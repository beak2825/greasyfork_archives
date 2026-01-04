// ==UserScript==
// @name         dianping网站公园评论信息采集工具
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  获取大众点评网页评论,解决动态字体加密
// @author       You
// @match        http://www.dianping.com/shop*
// @match        https://www.dianping.com/shop*
// @icon         https://www.google.com/s2/favicons?domain=dianping.com
// @require      https://greasyfork.org/scripts/435146-html2canvas-132/code/html2canvas132.js?version=986217
// @require      https://unpkg.com/tesseract.js@2.1.0/dist/tesseract.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/453298/dianping%E7%BD%91%E7%AB%99%E5%85%AC%E5%9B%AD%E8%AF%84%E8%AE%BA%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/453298/dianping%E7%BD%91%E7%AB%99%E5%85%AC%E5%9B%AD%E8%AF%84%E8%AE%BA%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
/* global html2canvas Tesseract */

// console.log(GM_info);
const moreBtnClass = '.fold';
const lessBtnClass = '.unfold';
const commentClass = '.review-words';
const nextBtnClass = '.NextPage';
const toCSVClass = '.ToCsv';

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
    };

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
      let fontWeightOffset = 0;
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
  };
  
  // 导出数据模块
 function data_to_csv(data, name) {
    const blob = new Blob(["\ufeff" +data], {type: 'text/csv,charset=utf-8'});
    const uri = URL.createObjectURL(blob);
    let downloadLink = document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = (name+".csv")||"temp.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);}

  const showResult = (pics) => {
    let foo = document.createElement('p');
    foo.id = "comments";
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
    //JS选中p标签中的所有文本内容
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.selectNodeContents(foo);
    selection.addRange(range);
    document.execCommand('copy');
    
  };

  let btn = document.createElement('button');
  let next = document.createElement('button');
  let toCSV = document.createElement('button');
  let autoExe = document.createElement('button');
  btn.innerHTML = '开始采集';
  btn.style.position = 'fixed';
  btn.style.right = '20px';
  btn.style.bottom = '100px';
  toCSV.innerHTML = '导出为csv';
  toCSV.style.position = 'fixed';
  toCSV.style.right = '20px';
  toCSV.style.bottom = '140px';
  toCSV.id="download";
  next.innerHTML = '下一页';
  next.style.position = 'fixed';
  next.style.right = '20px';
  next.style.bottom = '120px';
  autoExe.innerHTML = '自动采集';
  autoExe.style.position = 'fixed';
  autoExe.style.right = '20px';
  autoExe.style.bottom = '160px';
  document.body.appendChild(btn);
  document.body.appendChild(next);
  document.body.appendChild(toCSV);
  document.body.appendChild(autoExe);
  
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
    console.log('res', res);
    showResult(res);
    
    var parkname = document.querySelector(".shop-name").textContent;//获取公园名称
    var url = window.location.href; // 返回完整 URL (https://www.runoob.com/html/html-tutorial.html)
    url = url.substring(url.lastIndexOf('/') + 1, url.length);//获取url中最后一个单词
    //https://www.dianping.com/shop/H8sOT7dhpFprpFAZ/review_all 第一页评论的url
    //https://www.dianping.com/shop/H8sOT7dhpFprpFAZ/review_all/p101 第1页以后的评论页面的url
    var ptext = document.getElementById("comments").innerText;
    data_to_csv(ptext, parkname + url); 
  };
  
  //下一页功能
  next.onclick = () => {
    const nextBtn = $(nextBtnClass)[0];
    if (nextBtn) 
    {
        nextBtn.click();
    }
  };
  
  toCSV.onclick = () =>  {
    var parkname = document.querySelector(".shop-name").textContent;//获取公园名称
    var url = window.location.href; // 返回完整 URL (https://www.runoob.com/html/html-tutorial.html)
    url = url.substring(url.lastIndexOf('/') + 1, url.length);//获取url中最后一个单词
    //https://www.dianping.com/shop/H8sOT7dhpFprpFAZ/review_all 第一页评论的url
    //https://www.dianping.com/shop/H8sOT7dhpFprpFAZ/review_all/p101 第1页以后的评论页面的url
    var ptext = document.getElementById("comments").innerText;
    data_to_csv(ptext, parkname + url); 
    };

  autoExe.onclick = () =>  {
     //获取该POI的评论总页数，利用循环，每隔随机数量的秒数，自动执行“采集每一页”评论信息的功能；每页评论内容导出为CSV
    var strpages = document.querySelector(".reviews-pages").getElementsByTagName('a')[8].innerText;//查看页面结构，获取dom中的元素值：总页数
    var pages = Number(strpages);//字符串转为int
    var curpage=0;
    // 用户输入
    const min = 3;
    const max = 17;
    // 生成随机数
    const a = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log('总页数', pages);
    while(curpage<=pages){
        //采集本页数据
        btn.click();
        //进入下一页
        const nextBtn = $(nextBtnClass)[0];
        if (nextBtn) nextBtn.click();
        curpage++;
        }

    };
 
 
})();
