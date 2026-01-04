// ==UserScript==
// @name         大众点评评论
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  获取大众点评网页评论,解决动态字体加密
// @author       You
// @match        http://www.dianping.com/shop*
// @match        https://www.dianping.com/shop*
// @icon         https://www.google.com/s2/favicons?domain=dianping.com
// @require      https://greasyfork.org/scripts/435146-html2canvas-132/code/html2canvas132.js?version=986217
// @require      https://unpkg.com/tesseract.js@2.1.0/dist/tesseract.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/435145/%E5%A4%A7%E4%BC%97%E7%82%B9%E8%AF%84%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/435145/%E5%A4%A7%E4%BC%97%E7%82%B9%E8%AF%84%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==
/* global html2canvas Tesseract */

// console.log(GM_info);
const moreBtnClass = '.fold';
const lessBtnClass = '.unfold';
const commentClass = '.review-words';
const nextBtnClass = '.NextPage';
const ppocrUrl = 'https://www.paddlepaddle.org.cn/paddlehub-api/image_classification/chinese_ocr_db_crnn_mobile';

(function() {
  'use strict';
  const $ = document.querySelectorAll.bind(document);

  const renderCmt = elm => {
    return new Promise((resolve, reject) => {
      // console.log('elm', elm)
      html2canvas(elm, {
        allowTaint: true,
        scale: 1,
        useCORS: true,
        width: elm.offsetWidth * 1.2,
        height: elm.offsetHeight * 1.2,
        x: -elm.offsetWidth * 0.1,
        y: -elm.offsetHeight * 0.16
      }).then(canvas => {
        const data = canvas.toDataURL().split(',')[1];
        // console.log('data', data);
        // document.body.append(canvas);
        GM.xmlHttpRequest({
          method: 'POST',
          url: ppocrUrl,
          responseType: 'json',
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({ image: data }),
          onload: response => {
            // console.log('response', response);
            const res = response.response.result[0].data.map(r => r.text).join('');
            return resolve(res);
          }
        });
        // return resolve(canvas);
        // console.log('start to recognize');
        // Tesseract.recognize(canvas, 'chi_sim', {
        // langPath: 'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0_best/',
        // }).then(res => {
        // console.log(res);
        // const { text } = res.data;
        // return resolve(text);
        // })
      })
    });
  }

  const getAllCommentCanvas = async () => {
    let comments = $(commentClass);
    // comments = [comments[0]];
    let tasks = [];
    let ret = [];
    //for(let i = 0;i <= comments.length; i++) {
    //const cmt = comments[i];
    //const res = await renderCmt(cmt)
    //console.log('res', i, res);
    //}
    comments.forEach((cmt, idx) => {
      const imgs = cmt.querySelectorAll('img');
      imgs.forEach(img => cmt.removeChild(img));
      tasks.push(renderCmt(cmt));
    });
    ret = await Promise.all(tasks);
    return ret;
  }

  const getResult = async () => {
    const $ = document.querySelectorAll.bind(document);
    const documentTxt = new XMLSerializer().serializeToString(document);

    const getCssUrl = () => {
      const bar = documentTxt.matchAll(/href=\"(\/\/s3plus\.meituan\.net\/v1\/.*?)\"/g);
      const baz = [...bar];
      return baz.map(b => 'https:' + b[1]);
    }

    const getSvgUrl = (content) => {
      const bar = content.matchAll(/\[class\^=\"(.*?)\"\].*?url\((\/\/s3plus.meituan.net\/v1\/.*?)\)/g);
      const baz = [...bar];
      return baz;
    }

    const getFileViaUrl = url => {
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: 'GET',
          url: url,
          responseType: 'text',
          headers: {
            'Content-Type': 'text/css'
          },
          onload: response => {
            if (response.status === 200) return resolve(response.response)
            else return resolve('');
          }
        });
      });
    }

    const cssNameMap = {};
    const svgMap = {};
    const urls = getCssUrl();
    let svgUrls = [];
    for(let i = 0;i < urls.length;i += 1) {
      const cssContent = await getFileViaUrl(urls[i]);
      const matchs = cssContent.matchAll(/.(.*?)\{background:-(.*?)px -(.*?)px;}/mg);
      const matchNames = [...matchs];
      matchNames.forEach(name => {
        if (!name[0].includes('[')) {
          cssNameMap[name[1]] = [+Number(name[2]).toFixed(0), +Number(name[3]).toFixed(0)]
        }
      });
      const svgUrl = getSvgUrl(cssContent);
      svgUrls = [...svgUrl, ...svgUrls];
    }

    for(let i = 0;i < svgUrls.length;i += 1) {
      const svgContent = await getFileViaUrl(svgUrls[i][2]);
      const fontLocMap = [...svgContent.matchAll(/<text x=\".*?\" y=\"(.*?)\">(.*?)<\/text>/mg)];
      let fontHeightOffset =0;
      let fontWeightOffset = 0
      if (svgContent.includes('#333')) {
        fontHeightOffset = 23;
        fontWeightOffset = 0;
      }
      if (svgContent.includes('#666')) {
        fontHeightOffset = 15;
        fontWeightOffset = 0;
      }
      const fontLoc = {};
      fontLocMap.forEach((fl, idx) => {
        fontLoc[fl[1]] = idx + 1;
      });
      svgMap[svgUrls[i][1]] = {};
      svgMap[svgUrls[i][1]]['fontLocMap'] = fontLocMap;
      svgMap[svgUrls[i][1]]['fontHeightOffset'] = fontHeightOffset;
      svgMap[svgUrls[i][1]]['fontWeightOffset'] = fontWeightOffset;
      svgMap[svgUrls[i][1]]['fontLoc'] = fontLoc;
    }
    // console.log('svgMap', svgMap);
    // console.log('cssNameMap', cssNameMap);
    Object.keys(cssNameMap).forEach((key, idx) => {
      const arr = cssNameMap[key];
      const keys = Object.keys(svgMap);
      const foo = keys.find(k => key.includes(k));
      const fontMap = svgMap[foo];
      if (!fontMap) return;
      const locX = arr[0];
      const locY = arr[1];
      const fontHeightOffset = fontMap.fontHeightOffset;
      const fontWeightOffset = fontMap.fontWeightOffset;
      const fontLoc = fontMap.fontLoc;
      const fontLocMap = fontMap.fontLocMap;
      const locXLine = Math.floor((locX + fontWeightOffset) / 14);
      const locYLine = fontLoc[locY + fontHeightOffset];
      let val = '';
      // console.log('fontLocMap', fontLocMap);
      if (fontLocMap[locYLine - 1]) val = fontLocMap[locYLine - 1][2][locXLine];
      cssNameMap[key].push(val);
    });
    // console.log('cssMap', cssNameMap)
    const comments = [...$(commentClass)];
    const result = [];
    comments.forEach(cmt => {
      const imgs = cmt.querySelectorAll('img');
      imgs.forEach(img => cmt.removeChild(img));
      const nodes = [...cmt.childNodes];
      let foo = '';
      nodes.forEach(node => {
        const cls = node.className;
        if (cls) {
          const bar = cssNameMap[cls];
          if (bar) foo += bar[2];
        } else foo += node.textContent;
      });
      result.push(foo.trim());
    });

    return result;
  }

  const showResult = (pics) => {
    let foo = document.createElement('p');
    foo.innerHTML = pics.map(p => '<div style="margin-top: 20px;">' + p + '</div>').join(` `);
    foo.style.position = 'fixed';
    foo.style.width = '600px';
    foo.style.height = '600px';
    foo.style.left = '10px';
    foo.style.bottom = '20px';
    foo.style.padding = '20px';
    foo.style.background = '#61ffff';
    foo.style.overflow = 'auto';
    document.body.appendChild(foo);
  }

  let btn = document.createElement('button');
  let next = document.createElement('button');
  btn.innerHTML = '开始采集';
  btn.style.position = 'fixed'
  btn.style.right = '20px';
  btn.style.bottom = '80px';

  next.innerHTML = '下一页';
  next.style.position = 'fixed'
  next.style.right = '20px';
  next.style.bottom = '120px';

  document.body.appendChild(btn);
  document.body.appendChild(next);

  btn.onclick = async () => {
    const moreBtns = $(moreBtnClass);
    moreBtns.forEach(b => {
      b.click();
      b.style.opacity = 0;
    });
    const lessBtns = $(lessBtnClass);
    lessBtns.forEach(l => l.style.opacity = 0);
    //getAllCommentCanvas()
    //.then(pics => {
    //console.log(pics);
    //showResult(pics);
    //})
    //.catch(console.error)
    const res = await getResult();
    // console.log('res', res);
    showResult(res);
  }
  next.onclick = () => {
    const nextBtn = $(nextBtnClass)[0];
    if (nextBtn) nextBtn.click();
  }

})();
