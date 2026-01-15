// ==UserScript==
// @name         JumptoonDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for jumptoon.com
// @icon         https://jumptoon.com/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/497457-jumptoondownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://jumptoon.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/497459/JumptoonDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/497459/JumptoonDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/jumptoon\.com\/series\/.*\/episodes\/(?<episodeID>\d+)\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (re.exec(newHref)?.groups?.episodeID === re.exec(oldHref)?.groups?.episodeID) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // return if not reading chapter now
  if (!re.test(oldHref)) return;

  try {
    // 新的解析方式：直接从脚本标签中查找数据
    const scripts = Array.from(document.querySelectorAll('script'));
    let content = null;
    
    for (const script of scripts) {
      if (script.textContent.includes('self.__next_f.push')) {
        const scriptContent = script.textContent;
        // 查找包含 seriesEpisodeContent 的数据
        const match = scriptContent.match(/self\.__next_f\.push\((\[.*?\])\s*\)/);
        
        if (match) {
          try {
            const pushData = JSON.parse(match[1]);
            if (pushData && pushData.length >= 2 && typeof pushData[1] === 'string') {
              // 解析字符串数据
              const dataStr = pushData[1];
              // 移除可能的前缀（如 "2e:"）
              let jsonStr = dataStr;
              if (jsonStr.includes(':')) {
                jsonStr = jsonStr.substring(jsonStr.indexOf(':') + 1);
              }
              
              const parsedData = JSON.parse(jsonStr);
              // 在解析的数据中查找 seriesEpisodeContent
              function findSeriesEpisodeContent(obj) {
                if (obj && typeof obj === 'object') {
                  if (obj.seriesEpisodeContent) {
                    return obj.seriesEpisodeContent;
                  }
                  // 递归查找
                  for (const key in obj) {
                    const result = findSeriesEpisodeContent(obj[key]);
                    if (result) return result;
                  }
                }
                return null;
              }
              
              content = findSeriesEpisodeContent(parsedData);
              if (content) break;
            }
          } catch (e) {
            console.warn('解析脚本数据失败:', e);
          }
        }
      }
    }

    if (!content) {
      // 如果第一种方法失败，尝试另一种方法：查找包含完整数据的脚本
      const dataScript = scripts.find(script => 
        script.textContent.includes('seriesEpisodeContent') && 
        script.textContent.includes('pageList')
      );
      
      if (dataScript) {
        const scriptText = dataScript.textContent;
        // 尝试提取 JSON 数据
        const jsonMatch = scriptText.match(/\{"children":\[.*?\}/s);
        if (jsonMatch) {
          try {
            const jsonData = JSON.parse(jsonMatch[0]);
            // 查找 seriesEpisodeContent
            function findInChildren(arr) {
              for (const item of arr) {
                if (item && typeof item === 'object') {
                  if (item.seriesEpisodeContent) {
                    return item.seriesEpisodeContent;
                  }
                  if (item.children && Array.isArray(item.children)) {
                    const result = findInChildren(item.children);
                    if (result) return result;
                  }
                }
              }
              return null;
            }
            
            if (jsonData.children) {
              content = findInChildren(jsonData.children);
            }
          } catch (e) {
            console.warn('解析嵌套数据失败:', e);
          }
        }
      }
    }

    if (!content) {
      throw new Error('无法找到章节内容数据');
    }

    // 获取标题信息
    let title1, title2;
    try {
      title1 = document.querySelector('title').textContent.split('|')[0].trim().split('】 ')[1].trim();
    } catch (e) {
      title1 = '未知标题';
    }
    
    if (content.seriesEpisodeEdge && content.seriesEpisodeEdge.node) {
      title2 = `${content.seriesEpisodeEdge.node.notation}${content.seriesEpisodeEdge.node.title ? ' ' + content.seriesEpisodeEdge.node.title : ''}`;
    } else if (content.id && content.number && content.title) {
      // 备用方案：直接从 content 对象获取信息
      title2 = `第${content.number}話${content.title ? ' ' + content.title : ''}`;
    } else {
      title2 = '未知章节';
    }
    
    const title = `${title1} ${title2}`;
    const pages = content.pageList || [];
    const seed = `${content.seriesId || 'JT00053'}:${content.number || '30'}`.split('').reduce((acc, cur) => acc + cur.codePointAt(0), 0);
    const scrambleAlgorithmType = content.scrambleAlgorithmType || 'V2';

    if (pages.length === 0) {
      throw new Error('没有找到图片页面');
    }

    // setup ImageDownloader
    ImageDownloader.init({
      maxImageAmount: pages.length,
      getImagePromises,
      title
    });

    // add style patch
    const downloadBtn = document.getElementById('ImageDownloader-DownloadButton');
    if (downloadBtn) downloadBtn.style.textAlign = 'center';

    // collect promises of image
    function getImagePromises(startNum, endNum) {
      return pages
        .slice(startNum - 1, endNum)
        .map(page => getDecryptedImage(page)
          .then(ImageDownloader.fulfillHandler)
          .catch(ImageDownloader.rejectHandler)
        );
    }

    // get decrypted image
    function getDecryptedImage(page) {
      return new Promise(async resolve => {
        const imageArrayBuffer = await axios.get(page.imageUrl, { responseType: 'arraybuffer' }).then(res => res.data);
        const image = document.createElement('img');
        image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        image.onload = function () {
          // create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = page.width;
          canvas.height = page.height;

          // get coords
          const coords = getCoords(seed, scrambleAlgorithmType, page.width, this.width, page.height);

          // draw pieces
          for (const coord of coords) {
            ctx.drawImage(this, ...coord);
          }

          canvas.toBlob(resolve);
        }
      });
    }

    // seed, scrambleAlgorithmType, page.width, scrambledImage.width, page.height
    function getCoords(e, i, t, s, r) { 
      const X = (e) => ({
        next: () => e = (1664525 * e + 1013904223) % 4294967296
      });

      const e4 = (e, i, t) => {
        let s = Array.from({ length: i}, (e, i) => i)
          , r = i;
        0 !== t && r--;
        let a = X(e);
        for (let e = r; e > 1; e--) {
          let i = a.next() % e;
          [s[i],s[e - 1]] = [s[e - 1], s[i]]
        }
        return s;
      }

      const eQ = {
        V1: {
          splitWidth: 12,
          paddingWidth: 3,
          blankWidth: 3
        },
        V2: {
          splitWidth: 20,
          paddingWidth: 15,
          blankWidth: 1
        }
      }

      let {splitWidth: a, blankWidth: n, paddingWidth: o} = eQ[i]
        , l = a + n + 2 * o
        , d = Math.floor(s / l)
        , c = t % a
        , u = e4(e, d, c)
        , m = Array.from({ length: d })
        , p = [];
      for (let e of u)
        m[u[e]] = e;
      for (let e = 0; e < d; e++) {
        let i = m[e] * l + o
          , t = e * a;
        p.push([i, 0, a, r, t, 0, a, r])
      }
      if (c) {
        let e = d * l + o
          , i = d * a;
        p.push([e, 0, c, r, i, 0, c, r])
      }
      return p;
    }

  } catch (error) {
    console.error('JumptoonDownloader 错误:', error);
    alert('下载器初始化失败: ' + error.message);
  }

})(axios, JSZip, saveAs, ImageDownloader);