// ==UserScript==
// @name         笔趣阁小说朗读
// @namespace    http://tampermonkey.net/
// @version      2.3.18
// @description  自动获取网页上的小说内容并转换为语音
// @author       Xie
// @match        *://**/*.html
// @license      使用说明：请看下方描述
// @icon         data:image/gif;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478301/%E7%AC%94%E8%B6%A3%E9%98%81%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/478301/%E7%AC%94%E8%B6%A3%E9%98%81%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(!('speechSynthesis' in window)) {
    throw alert("对不起，您的浏览器不支持")
  }

  let url = window.location.href;
  // 百度贴吧能匹配成功下面的判断，这里直接拦截
  if (url.indexOf('baidu') >= 0) {
    return;
  }

  let allText = document.body.innerText;
  const allTextKeyWords = ['上一章', '上一页', '下一章', '下一页', '目录', '章节', '小说', '网站即将关闭',
    '阅读最新内容',
    '为你提供最快',
    '为您提供最快',
    '请收藏本站',
    '最新章节',
    '一键直达',
    '最快更新',
    '记住本书',
    '首发域名',
    '首发网址',
    '首发地址',
    '免费阅读',
    '笔趣阁',
    '小说网'];
  if (!allTextKeyWords.some(keyword => allText.includes(keyword))) {
    // 如果整个页面都不含如上任何元素，则不使用当前插件
    console.log('其他网站')
    return;
  }

  // 需要删除的页面标签
  var removeEle = ['.lm','.erwm', '.read-titlelinke', '.tjlist', 'center', '.readinline', '.sectionTwo', '.lrghqazd', '.fdpsxavq', '#commendbook', '.readon' ,'#tyJ', '#pAV', '.nr_page', 'iframe'];

// 模糊匹配删除：class\id\标签名称
  var removeEleFuzzyMatching = ['nav', 'top', 'foot', 'link', 'header', 'img', 'show'];
  // 根据关键词 过滤 小说内容中的行
  let filterKeywords = [
    'ｈｔｔｐs',
    'ｈｔｔｐs',
    'xsｗａｎｇ．la',
    'ｈｔｔps',
    'http',
    'www',
    '.com',
    'CòΜ',
    'net',
    '网站即将关闭',
    '阅读最新内容',
    '为你提供最快',
    '为您提供最快',
    '请收藏本站',
    '最新章节',
    '一键直达',
    '最快更新',
    '章节错误',
    '记住本书',
    '首发域名',
    '首发网址',
    '首发地址',
    '本站地址',
    '本站网址',
    '免费阅读',
    '笔趣阁',
    '无广告',
    '小说网',
    '手机版',
    '请下载'
  ];
  // 将当前网站的域名添加到过滤名单
  filterKeywords.push(window.location.hostname);

  // 章节名称标签
  var titleEle = null;
  // 小说内容标签
  var contentEle = null;
  // 上一页、上一章
  var leftButton = null;
  // 下一页、下一章
  var rightButton = null;

  let punctuationMarks = ['。', '？', '！', '；', '?', '!', ';'];

  setTimeout(function() {
    // 删除无用元素
    elementRemove();
    // 自动识别标题、内容、上一章、下一章等标签
    let flag = autoIdentify();
    if(!flag) {
      return;
    }

    // 创建一个新的div元素
    let floatingDiv = document.createElement("div");
    floatingDiv.innerHTML = `
<div class="xie-floating-div">
  <div class="xie-menu">
    <div title="展开">
      <svg t="1698304201100" class="icon xie-svg-zk" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1496"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#D0DDFE" p-id="1497"></path><path d="M512 592m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0Z" fill="#FFFFFF" p-id="1498"></path><path d="M512 384a208 208 0 0 0-147.072 355.072 208 208 0 0 0 294.144-294.144 206.64 206.64 0 0 0-147.072-60.928m0-48a256 256 0 1 1-256 256 256 256 0 0 1 256-256z" fill="#FFFFFF" p-id="1499"></path><path d="M225.136 590.688m59.184 0l-0.016 0q59.184 0 59.184 59.184l0 54.624q0 59.184-59.184 59.184l0.016 0q-59.184 0-59.184-59.184l0-54.624q0-59.184 59.184-59.184Z" fill="#8BACFF" p-id="1500"></path><path d="M792.064 671.904a292.8 292.8 0 0 0-70-355.2l16.176-31.472q8.512 7.456 16.592 15.52a337.392 337.392 0 0 1 71.36 371.2z m-594.256 0A337.392 337.392 0 0 1 269.104 300.752a342.224 342.224 0 0 1 32.16-28.304L320.976 301.616a292.928 292.928 0 0 0-89.024 370.288z" fill="#3075FF" p-id="1501"></path><path d="M680 590.688m59.184 0l-0.016 0q59.184 0 59.184 59.184l0 54.624q0 59.184-59.184 59.184l0.016 0q-59.184 0-59.184-59.184l0-54.624q0-59.184 59.184-59.184Z" fill="#8BACFF" p-id="1502"></path><path d="M197.824 563.376m59.184 0l-0.016 0q59.184 0 59.184 59.184l0 109.248q0 59.184-59.184 59.184l0.016 0q-59.184 0-59.184-59.184l0-109.248q0-59.184 59.184-59.184Z" fill="#216CFF" p-id="1503"></path><path d="M707.2 563.376m59.184 0l-0.016 0q59.184 0 59.184 59.184l0 109.248q0 59.184-59.184 59.184l0.016 0q-59.184 0-59.184-59.184l0-109.248q0-59.184 59.184-59.184Z" fill="#216CFF" p-id="1504"></path><path d="M727.984 331.136l-0.128 0.128a316.8 316.8 0 0 0-431.776-2.672L295.984 328.496a32 32 0 1 1-43.2-47.088 381.056 381.056 0 0 1 518.592 2.672 32 32 0 1 1-43.2 47.088z" fill="#216CFF" p-id="1505"></path><path d="M524 464m28 0l0 0q28 0 28 28l0 248q0 28-28 28l0 0q-28 0-28-28l0-248q0-28 28-28Z" fill="#FFB444" p-id="1506"></path><path d="M604 592m28 0l0 0q28 0 28 28l0 104q0 28-28 28l0 0q-28 0-28-28l0-104q0-28 28-28Z" fill="#FFB444" p-id="1507"></path><path d="M444 544m28 0l0 0q28 0 28 28l0 152q0 28-28 28l0 0q-28 0-28-28l0-152q0-28 28-28Z" fill="#FFB444" p-id="1508"></path><path d="M364 640m28 0l0 0q28 0 28 28l0 40q0 28-28 28l0 0q-28 0-28-28l0-40q0-28 28-28Z" fill="#FFB444" p-id="1509"></path></svg>
    </div>
    <div title="收缩">
      <svg t="1698286098837" class="icon xie-svg-ss" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1815" width="200" height="200"><path d="M333.1 126.5l-0.7 0.7c-12.3 12.3-12.3 32.4 0 44.7l339.9 339.9-340.1 340.1c-12.5 12.5-12.5 32.9 0 45.4s32.9 12.5 45.4 0L740 535s0.1-0.1 0.2-0.1l0.7-0.7c12.3-12.3 12.3-32.4 0-44.7l-363-363c-12.4-12.3-32.5-12.3-44.8 0z" fill="#4D4D4D" p-id="1816"></path></svg>
    </div>
  </div>
  <div class="xie-body">
    <div class="xie-form">
      <div class="xie-row">
        <label class="xie-col-label" for="voiceSelect">声音：</label>
        <select id="voiceSelect" name="voiceSelect" style="width: 150px"></select>
      </div>
      <div class="xie-row">
        <label class="xie-col-label" for="volumeInput">音量：</label>
        <input type="range" id="volumeInput" name="volumeInput" min="0.1" max="1" step="0.1" value="1">
        <div class="xie-col-value" id="volumeValue">1</div>
      </div>
      <div class="xie-row">
        <label class="xie-col-label" for="rateInput">语速：</label>
        <input type="range" id="rateInput" name="rateInput" min="0.1" max="10" step="0.1" value="1">
        <div class="xie-col-value" id="rateValue">1</div>
      </div>
      <div class="xie-row">
        <label class="xie-col-label" for="pitchInput">音高：</label>
        <input type="range" id="pitchInput" name="pitchInput" min="0" max="2" step="0.1" value="1">
        <div class="xie-col-value" id="pitchValue">1</div>
      </div>
      <div class="xie-row">
        <label class="xie-col-label">字幕：</label>
        <input type="radio" id="captions_1" name="captions" value="1" style="margin: 0px 10px;">
        <label for="captions_1">打开</label>
        <input type="radio" id="captions_0" name="captions" value="0" style="margin: 0px 10px;">
        <label for="captions_0">关闭</label>
      </div>
      <div class="xie-row">
        <label class="xie-col-label" title="根据关键词净化小说内容，删除含网址地址的行">净化：</label>
        <input type="radio" id="purification_1" name="purification" value="1" style="margin: 0px 10px;">
        <label for="purification_1">打开</label>
        <input type="radio" id="purification_0" name="purification" value="0" style="margin: 0px 10px;">
        <label for="purification_0">关闭</label>
      </div>
      <div class="xie-row">
        <label class="xie-col-label">隐身：</label>
        <input type="radio" id="stealth_0" name="stealth" value="0" style="margin: 0px 10px;">
        <label for="stealth_0">隐藏</label>
        <input type="radio" id="stealth_1" name="stealth" value="1" style="margin: 0px 10px;">
        <label for="stealth_1">显示</label>
      </div>
      <div class="xie-row">
        <label class="xie-col-label">续播：</label>
        <input type="radio" id="autoplay_1" name="autoplay" value="1" style="margin: 0px 10px;">
        <label for="autoplay_1">翻页自动播放</label>
        <input type="radio" id="autoplay_0" name="autoplay" value="0" style="margin: 0px 10px;">
        <label for="autoplay_0">手动播放</label>
      </div>
      <div class="xie-row" style="flex-direction: column;font-size: 12px;">
        <div class="xie-remake">
            <div class="xie-remake-title">快捷键（非全局）：</div>
            <div class="xie-remake-body">
                <div>Ctrl + 方向左键：上一页、上一章</div>
                <div>Ctrl + 方向右键：下一页、下一章</div>
                <div>Ctrl + 方向下键：播放、暂停</div>
            </div>
        </div>
      </div>
    </div>
    <div class="xie-body-button">
      <div title="播放">
        <svg t="1698285826519" class="icon xie-svg-bf" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1349" ><path d="M772.7 217.7a32.2 32.1 0 1 0 64.4 0 32.2 32.1 0 1 0-64.4 0Z" fill="#4D4D4D" p-id="1350"></path><path d="M415.8 679.9c5.9 0 11.5-1.6 16.2-4.5l231.1-134.6c10.9-5.2 18.5-16.3 18.5-29.2 0-11.9-6.4-22.3-16-27.8L439.7 352.2c-5.8-6.7-14.4-10.9-23.9-10.9-17.6 0-31.8 14.4-31.8 32.1 0 0.6 0 1.2 0.1 1.8l-0.4 0.2 0.5 269c-0.1 1.1-0.2 2.2-0.2 3.4 0 17.7 14.3 32.1 31.8 32.1z" fill="#4D4D4D" p-id="1351"></path><path d="M909.8 306.6c-5.4-10.5-16.3-17.8-28.9-17.8-17.8 0-32.2 14.4-32.2 32.1 0 6 1.7 11.7 4.6 16.5l-0.1 0.1c26.9 52.4 42.1 111.8 42.1 174.7 0 211.6-171.6 383.2-383.2 383.2S128.8 723.8 128.8 512.2 300.4 129.1 512 129.1c62.5 0 121.5 15 173.6 41.5l0.2-0.4c4.6 2.6 10 4.1 15.7 4.1 17.8 0 32.2-14.4 32.2-32.1 0-13.1-7.9-24.4-19.3-29.4C653.6 81.9 584.9 64.5 512 64.5 264.7 64.5 64.3 265 64.3 512.2S264.7 959.9 512 959.9s447.7-200.4 447.7-447.7c0-74.1-18-144-49.9-205.6z" fill="#4D4D4D" p-id="1352"></path></svg>
      </div>
      <div title="暂停">
        <svg t="1698285952364" class="icon xie-svg-zt" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1507" ><path d="M910.8 303.6c-5.4-10.5-16.3-17.8-28.9-17.8-17.8 0-32.2 14.4-32.2 32.1 0 6 1.7 11.7 4.6 16.5l-0.1 0.1c26.9 52.4 42.1 111.8 42.1 174.7 0 211.6-171.6 383.2-383.2 383.2S129.8 720.8 129.8 509.2 301.4 126.1 513 126.1c62.5 0 121.5 15 173.6 41.5l0.2-0.4c4.6 2.6 10 4.1 15.7 4.1 17.8 0 32.2-14.4 32.2-32.1 0-13.1-7.9-24.4-19.3-29.4C654.6 78.9 585.9 61.5 513 61.5 265.7 61.5 65.3 262 65.3 509.2S265.7 956.9 513 956.9s447.7-200.4 447.7-447.7c0-74.1-18-144-49.9-205.6z" fill="#515151" p-id="1508"></path><path d="M385.4 352.2V672c0 17.5 14.3 31.9 31.9 31.9 17.6 0 32-14.4 31.9-31.9V352.2c0-17.5-14.3-31.9-31.9-31.9-17.5 0-31.9 14.3-31.9 31.9zM578.9 352.2V672c0 17.5 14.3 31.9 31.9 31.9 17.5 0 31.9-14.4 31.9-31.9V352.2c0-17.5-14.3-31.9-31.9-31.9-17.5 0-31.9 14.3-31.9 31.9z" fill="#515151" p-id="1509"></path><path d="M772.7 217.7a32.2 32.1 0 1 0 64.4 0 32.2 32.1 0 1 0-64.4 0Z" fill="#515151" p-id="1510"></path></svg>
      </div>
      <div title="清空播放列表">
        <svg t="1698289630950" class="icon xie-svg-qk" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2268" width="200" height="200"><path d="M703.355701 958.712041 297.259706 958.712041c-97.55792 0-131.029242-18.10945-131.029242-130.289392L166.230464 390.164141c0-14.950504 12.122085-27.073612 27.073612-27.073612 14.950504 0 27.073612 12.122085 27.073612 27.073612l0 438.258509c0 71.145363-1.797949 76.144214 76.883041 76.144214l406.095995 0c76.05007 0 85.554538-2.142803 85.554538-76.144214L788.911262 390.164141c0-14.950504 12.122085-27.073612 27.073612-27.073612 14.950504 0 27.072589 12.122085 27.072589 27.073612l0 438.258509C843.05644 931.904489 808.528042 958.712041 703.355701 958.712041z" fill="#4d4d4d" p-id="2269"></path><path d="M694.155155 241.261832c-14.950504 0-27.072589-12.122085-27.072589-27.073612l0-8.460696c0-78.231759-14.620999-86.295412-85.554538-86.295412L419.088402 119.432113c-73.961502 0-76.883041 10.482749-76.883041 86.295412l0 8.460696c0 14.950504-12.122085 27.073612-27.073612 27.073612-14.951527 0-27.073612-12.122085-27.073612-27.073612l0-8.460696c0-105.000426 27.601638-140.441613 131.029242-140.441613l162.438603 0c112.575961 0 139.701762 45.289486 139.701762 140.441613l0 8.460696C721.228767 229.139747 709.106682 241.261832 694.155155 241.261832z" fill="#4d4d4d" p-id="2270"></path><path d="M342.205361 823.346027c-7.482415 0-13.537318-6.079462-13.537318-13.537318l0-27.071565c0-7.482415 6.054903-13.537318 13.537318-13.537318 7.482415 0 13.536294 6.053879 13.536294 13.537318l0 27.071565C355.741655 817.266565 349.686752 823.346027 342.205361 823.346027z" fill="#4d4d4d" p-id="2271"></path><path d="M342.205361 728.58992c-7.482415 0-13.537318-6.079462-13.537318-13.537318L328.668043 484.920248c0-7.475252 6.054903-13.536294 13.537318-13.536294 7.482415 0 13.536294 6.061043 13.536294 13.536294l0 230.133378C355.741655 722.510458 349.686752 728.58992 342.205361 728.58992z" fill="#4d4d4d" p-id="2272"></path><path d="M504.64294 823.346027c-7.482415 0-13.536294-6.079462-13.536294-13.537318l0-324.889485c0-7.475252 6.053879-13.536294 13.536294-13.536294s13.537318 6.061043 13.537318 13.536294l0 324.889485C518.180258 817.266565 512.125355 823.346027 504.64294 823.346027z" fill="#4d4d4d" p-id="2273"></path><path d="M667.082566 823.346027c-7.482415 0-13.537318-6.079462-13.537318-13.537318l0-324.889485c0-7.475252 6.054903-13.536294 13.537318-13.536294s13.536294 6.061043 13.536294 13.536294l0 324.889485C680.617837 817.266565 674.563958 823.346027 667.082566 823.346027z" fill="#4d4d4d" p-id="2274"></path><path d="M951.349865 305.560254c0 61.674665-49.994648 111.676475-111.676475 111.676475l-656.522558 0c-61.680804 0-111.676475-50.001811-111.676475-111.676475l0-6.768147c0-61.674665 49.994648-111.676475 111.676475-111.676475l656.522558 0c61.680804 0 111.676475 50.001811 111.676475 111.676475L951.349865 305.560254zM897.203664 298.79313c0-31.772634-25.750477-57.530274-57.530274-57.530274l-656.522558 0c-31.778774 0-57.530274 25.75764-57.530274 57.530274l0 6.768147c0 31.772634 25.7515 57.530274 57.530274 57.530274l656.522558 0c31.779797 0 57.530274-25.75764 57.530274-57.530274L897.203664 298.79313z" fill="#4d4d4d" p-id="2275"></path></svg>
      </div>
    </div>
  </div>
</div>
<div class="xie-bottom-div">
    <div class="xie-bottom-content"></div>
</div>
<style>
   .xie-floating-div body, dd, div, dl, dt, fieldset, form, h1, h2, h3, h4, h5, h6, html, img, input, li, ol, p, select, table, td, th, ul {
        margin: 0;
        padding: 0;
    }
  .xie-floating-div {
    position: fixed;
    top: 150px;
    right: 20px;
    display: flex;
    background-color: #fff;
    border: 1px solid #efefef;
    border-radius: 8px;
    font-size: 14px;
    cursor: default;
  }
  .xie-bottom-div {
    position: fixed;
    bottom: 15px;
    left: 0;
    display: flex;
    width: 100%;
    align-items: center;
    align-content: center;
    justify-content: center;
  }
  .xie-bottom-content {
    min-height: 50px;
    background-color: #fff;
    border: 1px solid #efefef;
    border-radius: 6px;
    width: 70%;
    padding: 10px 15px;
    display: flex;
    text-align: center;
    align-content: center;
    align-items: center;
    justify-content: center;
    color: #67C23A;
    font-size: 20px;
    font-weight: bold;
    line-height: 28px;
    transition: opacity 1s; /* 添加渐变效果 */
  }
  .xie-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
  }
  .xie-body {
    display: none;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    /*border-left: 1px solid #efefef;*/
    transition: opacity 1s; /* 添加渐变效果 */
  }
  .xie-form {
    padding: 10px 15px;
  }
  .xie-row {
    display: flex;
    align-items: center;
    margin: 5px 0px;
  }
  .xie-remake {
    border: 1px solid #efefef;
    width: 100%;
    margin-bottom: 5px;
  }
  .xie-remake-title {
    background-color: #aaa;
    color: #fff;
    border-bottom: 1px solid #efefef;
    padding: 5px;
  }
  .xie-remake-body{
    padding: 5px;
    width: 240px;
  }
  .xie-remake-body-a {
    height: 22px;
    display: flex;
    align-items: center;
    padding: 0 5px;
    text-decoration: underline;
  }
  .xie-col-label {
    font-weight: bold;
  }
  .xie-col-value{
    width: 30px;
    text-align: center;
  }
  .xie-body-button{
    display: flex;
    justify-content: center;
    align-items: center;
    /*border-top: 1px solid #efefef;*/
    width: 100%;
    padding: 0;
    margin-bottom: 20px;
  }
  .xie-svg-zk, .xie-svg-ss {
    width: 30px;
    height: 30px;
  }
  .xie-svg-bf, .xie-svg-zt, .xie-svg-qk {
    width: 25px;
    height: 25px;
    margin: 0px 10px;
  }
  .xie-svg-zk, .xie-svg-zt {
    display: none;
  }
  .xie-svg-ss {
    display: none;
  }
  .xie-svg-ss>path {
    fill: #303133;
  }
  .xie-svg-bf>path {
    fill: #409EFF;
  }
  .xie-svg-zt>path {
    fill: #E6A23C;
  }
  .xie-svg-qk>path {
    fill: #F56C6C;
  }
  .xie-svg-bf:hover {
    filter: brightness(1.5); /* 改变亮度以更改整个SVG的颜色 */
    transition: filter 0.3s; /* 添加过渡效果 */
  }
</style>

`;
    document.body.appendChild(floatingDiv);

    const pageTitle = document.title;

    const voiceSelect = document.getElementById("voiceSelect");
    const volumeInput = document.getElementById("volumeInput");
    const volumeValue = document.getElementById("volumeValue");
    const rateInput = document.getElementById("rateInput");
    const rateValue = document.getElementById("rateValue");
    const pitchInput = document.getElementById("pitchInput");
    const pitchValue = document.getElementById("pitchValue");
    const captionsButtons = document.querySelectorAll('input[name="captions"]');
    const purificationButtons = document.querySelectorAll('input[name="purification"]');
    const stealthButtons = document.querySelectorAll('input[name="stealth"]');
    const autoplayButtons = document.querySelectorAll('input[name="autoplay"]');

    const xieFloatingDiv = document.querySelector(".xie-floating-div");
    const xieBody = document.querySelector(".xie-body");
    const bottomContent = document.querySelector(".xie-bottom-content");
    const xieSvgZk = document.querySelector(".xie-svg-zk");
    const xieSvgSs = document.querySelector(".xie-svg-ss");
    const xieSvgBf = document.querySelector(".xie-svg-bf");
    const xieSvgZt = document.querySelector(".xie-svg-zt");
    const xieSvgQk = document.querySelector(".xie-svg-qk");

    var autoplayV = '0';

    clickSs();
    initInput();
    clickQk();


    function autoIdentify() {
      // 需要排除的标签，这些标签直接跳过判断
      const excludeEleKeyWords = ['script', 'style', 'font', 'symbol', 'svg', 'img', 'select', 'input', 'option'];
      // 标题常规标签
      const titleEleKeyWords = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header'];
      // 标题关键词
      const titleKeyWords = ['第', '章', '节', '篇', '卷', '页'];
      // 内容中允许保留的子元素标签，其它标签都需要删除，然后再获取内容文本进行识别
      const contentReserveWords = ['p', 'span', 'br', 'pre', 'b', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'i', 'u'];

      // 从特定标签中找到的标题
      let titleEles = [null, null, null];
      // 上次识别到的小说内容中文长度，用于与本次长度做对比，保留最长的内容
      let len_ch = 0;
      // 记录已经打印过的标签，防止重复打印
      let tags = [];

      const allElements = document.querySelectorAll('html > :not(head) *');
      for (const element of allElements) {
        // 复制当前元素以避免直接修改原始元素
        const clonedElement = element.cloneNode(true);
        let tagName = clonedElement.tagName.toLowerCase();
        let str = getText(clonedElement.textContent);
        if (str === '' || excludeEleKeyWords.includes(tagName)) {
          continue;
        }
        // 打印出每种标签名称
        if (!tags.some(keyword => tagName.includes(keyword))) {
          console.log(tagName, element);
          tags.push(tagName);
        }

        try {
          if (tagName !== 'a') {
            // 如果没有从特定标签取到标题，则持续从所有标签中暂时获取
            // 标题从三个方面分别取值，
            // 1：含关键词 是关键标签 无子元素
            // 2：含关键词 是关键标签 有子元素
            // 3：不含关键词 是关键标签 无子元素

            // 含关键词
            if (titleKeyWords.some(keyword => str.includes(keyword))) {
              // 是关键标签
              if (titleEleKeyWords.includes(tagName)) {
                // 无子元素
                if (titleEles[0] == null && clonedElement.children.length === 0) {
                  titleEles[0] = element;
                }
                else if (titleEles[1] == null) {
                  titleEles[1] = element;
                }
              }
            }
            else if (titleEles[2] == null && titleEleKeyWords.includes(tagName) && clonedElement.children.length === 0) {
              titleEles[2] = element;
            }
          }
        }
        catch (e) {
          console.log('标题获取出错');
          console.log(e);
          console.log(clonedElement);
        }

        try {
          // 检查 div 元素是否包含文本内容
          if (!clonedElement.className || !clonedElement.className.includes || !clonedElement.className.includes('xie-')) {
            // 遍历当前元素的所有直接子元素，删除非 特定元素 的元素
            var childNodes = clonedElement.childNodes;
            for (var i = childNodes.length - 1; i >= 0; i--) {
              var childNode = childNodes[i];
              if (childNode.nodeType === 1 && !contentReserveWords.includes(childNode.nodeName.toLowerCase())) {
                clonedElement.removeChild(childNode);
              }
            }

            str = getText(clonedElement.textContent);
            let chineseCharacters  = str.match(/[\u4e00-\u9fa5]/g);
            let len_ch2  = chineseCharacters ? chineseCharacters.length : 0;
            if (len_ch2 > len_ch) {
              contentEle = element;
              len_ch = len_ch2;
            }
          }
        }
        catch (e) {
          console.log('内容获取出错');
          console.log(e);
          console.log(clonedElement);
        }

        try {
          if (tagName === 'a') {
            if (str === '上一章' || str === '上一页') {
              leftButton = element;
            }
            else if (str === '下一章' || str === '下一页') {
              rightButton = element;
            }
          }
        }
        catch (e) {
          console.log('上一章/下一章获取出错');
          console.log(e);
          console.log(clonedElement);
        }
      }

      titleEle = titleEles[0] || titleEles[1] || titleEles[2];

      console.log('自动识别标题:', titleEle ? getText(titleEle.textContent) : null, titleEles);
      console.log('自动识别内容:', contentEle, contentEle ? getText(contentEle.textContent) : null);
      console.log('自动识别上一章:', leftButton);
      console.log('自动识别下一章:', rightButton);

      if (contentEle == null) {
        console.log('内容获取失败');
        return false;
      }
      return true;
    }

    function getText(str) {
      try {
        return str.trim().replace(/[\r\n]+/g, '').toLowerCase();
      }
      catch (e) {
        console.log(ele);
        console.log(e);
      }
      return '';
    }

    // 小说章节页面净化
    function bookContent(type) {
      if (type === 0) {
        return;
      }
      let ss = [];
      let stra = contentEle.innerText.split('\n');
      // 前一行是否为空
      let prevNull = false;
      for (let i = 0; i < stra.length; i++){
        let s = filterStr(stra[i]);
        let isNull = !s || s==='' || s.trim() === '';
        // 如果上一行为空，这一行还为空，跳过
        if ((prevNull && isNull)) {
          continue;
        }
        prevNull = isNull;
        ss.push(s);
      }
      // console.log(ss);
      if (ss.length > 0) {
        contentEle.innerHTML = ss.join("<br/>")
      }
    }

    // 删除元素
    function elementRemove() {
      // 获取所有的定时器ID
      let highestTimeoutId = setTimeout(() => {});
      let highestIntervalId = setInterval(() => {});

      // 清除所有 setTimeout
      for (let i = 0; i <= highestTimeoutId; i++) {
        clearTimeout(i);
      }

      // 清除所有 setInterval
      for (let i = 0; i <= highestIntervalId; i++) {
        clearInterval(i);
      }

      // 精确删除
      removeEle.forEach(function(className) {
        let elements = document.querySelectorAll(className);
        elements.forEach(function(element) {
          element.remove();
        });
      });

      // 模糊匹配删除
      var allElements = document.querySelectorAll('html > :not(head) *');
      allElements.forEach(function(element) {
        console.log(element.tagName, element.id, element.classList, element.style.backgroundImage)
        // 取消所有标签的背景图
        element.style.setProperty('background-image', 'none', 'important');

        // 检查标签的 class、id 和标签名称是否包含数组中的任何一个关键词
        var shouldDelete = removeEleFuzzyMatching.some(function(keyword) {
          return Array.from(element.classList).join(' ').includes(keyword) ||
            element.id.includes(keyword) ||
            element.tagName.toLowerCase().includes(keyword);
        });
        // 如果包含任何一个关键词，删除该标签
        if (shouldDelete) {
          const tagName = element.tagName;
          const className = element.className;
          const id = element.id;
          console.log(`被删除的标签: 名称=${tagName}, class=${className}, id=${id}`);
          element.remove();
        }
      });
      document.body.style.paddingBottom = '20px';
    }

    function bottomContentShowHidden(type) {
      showAndHidden(bottomContent, 'flex', type)
    }

    function showAndHidden(ele, showType, type) {
      if (type === 1) {
        ele.style.display = showType;
        ele.style.opacity = 1;
        xieFloatingDiv.style.opacity = 1;
      } else {
        // 将透明度设置为0来触发渐隐
        ele.style.opacity = 0;
        xieFloatingDiv.style.opacity = 0.5;
        // 使用setTimeout在动画结束后将div隐藏
        setTimeout(function() {
          ele.style.display = 'none';
        }, 100); // 这里的1000表示1秒，与CSS中的过渡时间相匹配
      }
    }

    // 显示或隐藏页面内容
    function showAndHiddenPage(val) {
      if (titleEle != null) {
        titleEle.style.display = val == 1 ? 'block' : 'none';
      }
      contentEle.style.display = val == 1 ? 'block' : 'none';
      if (val == 1) {
        document.title = pageTitle;
      }
      else {
        document.title = '???';
      }
    }
    function initInput() {
      setTimeout(() => {
        let vs = window.speechSynthesis.getVoices();
        for (let i in vs) {
          let newOption = document.createElement("option");
          newOption.text = vs[i].name; // 选项的显示文本
          newOption.value = i; // 选项的值
          // 将新的 option 元素添加到 select 元素中
          voiceSelect.add(newOption);
        }

        let voiceV = getItem("xie-input-voice", 2);
        voiceSelect.selectedIndex = Number(voiceV);
        voiceSelect.addEventListener("change", function() {
          setItem("xie-input-voice", voiceSelect.value);
        });

      }, 500);

      let captionsV = getItem("xie-input-captions", '0');
      bottomContentShowHidden(Number(captionsV))
      captionsButtons.forEach(function(radioButton) {
        if (radioButton.value === captionsV) {
          radioButton.checked = true;
        }
        radioButton.addEventListener("change", function() {
          if (radioButton.checked) {
            setItem("xie-input-captions", radioButton.value);
            bottomContentShowHidden(Number(radioButton.value))
          }
        });
      });

      let purificationV = getItem("xie-input-purification", '0');
      bookContent(Number(purificationV));
      purificationButtons.forEach(function(radioButton) {
        if (radioButton.value === purificationV) {
          radioButton.checked = true;
        }
        radioButton.addEventListener("change", function() {
          if (radioButton.checked) {
            setItem("xie-input-purification", radioButton.value);
            bookContent(Number(radioButton.value))
          }
        });
      });

      let stealthV = getItem("xie-input-stealth", '1');
      showAndHiddenPage(stealthV);
      stealthButtons.forEach(function(radioButton) {
        if (radioButton.value === stealthV) {
          radioButton.checked = true;
        }
        radioButton.addEventListener("change", function() {
          if (radioButton.checked) {
            setItem("xie-input-stealth", radioButton.value);
            showAndHiddenPage(radioButton.value);
          }
        });
      });

      autoplayV = getItem("xie-input-autoplay", '0');
      autoplayButtons.forEach(function(radioButton) {
        if (radioButton.value === autoplayV) {
          radioButton.checked = true;
        }
        radioButton.addEventListener("change", function() {
          if (radioButton.checked) {
            setItem("xie-input-autoplay", radioButton.value);
          }
        });
      });

      let volumeV = getItem("xie-input-volume", 1);
      volumeValue.textContent = volumeV;
      volumeInput.value = volumeV;
      volumeInput.addEventListener("input", function() {
        volumeValue.textContent = volumeInput.value;
        setItem("xie-input-volume", volumeInput.value);
      });

      let rateV = getItem("xie-input-rate", 0.8);
      rateValue.textContent = rateV;
      rateInput.value = rateV;
      rateInput.addEventListener("input", function() {
        rateValue.textContent = rateInput.value;
        setItem("xie-input-rate", rateInput.value);
      });

      let pitchV = getItem("xie-input-pitch", 1);
      pitchValue.textContent = pitchV;
      pitchInput.value = pitchV;
      pitchInput.addEventListener("input", function() {
        pitchValue.textContent = pitchInput.value;
        setItem("xie-input-pitch", pitchInput.value);
      });

      xieSvgZk.addEventListener("click", () => {
        clickZk();
      });
      xieSvgSs.addEventListener("click", () => {
        clickSs();
      });
      xieSvgBf.addEventListener("click", () => {
        clickBf();
      });
      xieSvgZt.addEventListener("click", () => {
        clickZt()
      });
      xieSvgQk.addEventListener("click", () => {
        clickQk();
      });

      document.addEventListener('keydown', function(event) {
        // 检查是否按下了Ctrl键
        if (event.ctrlKey) {
          switch (event.key) {
            case 'ArrowUp':
              console.log('按下了Ctrl + 方向上键：');
              break;
            case 'ArrowDown':
              console.log('按下了Ctrl + 方向下键：播放、暂停', xieSvgBf.style.display);
              xieSvgBf.style.display == 'none' ? clickZt() : clickBf();
              break;
            case 'ArrowLeft':
              console.log('按下了Ctrl + 方向左键：上一页、上一章');
              if (leftButton == null) {
                clickQk();
                contents.push('未找到上一章元素，快捷键跳转失败！！！')
                mySpeechSynthesis(0);
              }
              else {
                leftButton.click();
              }
              break;
            case 'ArrowRight':
              console.log('按下了Ctrl + 方向右键：下一页、下一章');
              if (rightButton == null) {
                clickQk();
                contents.push('未找到下一章元素，快捷键跳转失败！！！')
                mySpeechSynthesis(0);
              }
              else {
                rightButton.click();
              }
              break;
            default:
              // 如果不是上下左右键，可以不处理或执行其他操作
              break;
          }
        }
      });

      try {
        // 向用户请求自动播放权限
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then(function(stream) {
            // 用户已授权，可以播放音频或视频
            setTimeout(() => {
              let autoplayV = getItem("xie-input-autoplay", '0');
              if (autoplayV == 1) {
                console.log('开始自动播放');
                // xieSvgBf.click();
                var clickEvent = new Event('click', {
                  bubbles: true,
                  cancelable: true,
                });
                xieSvgBf.dispatchEvent(clickEvent);
              }
            }, 1500);
          })
          .catch(function(error) {
            console.error('获取用户媒体权限失败:', error);
          });
      } catch (e) {
        // 失败了也尝试自动播放
        setTimeout(() => {
          let autoplayV = getItem("xie-input-autoplay", '0');
          if (autoplayV == 1) {
            console.log('开始自动播放');
            // xieSvgBf.click();
            var clickEvent = new Event('click', {
              bubbles: true,
              cancelable: true,
            });
            xieSvgBf.dispatchEvent(clickEvent);
          }
        }, 1500);
      }

    }

    function getItem(key, defValue) {
      let v = localStorage.getItem(key);
      if (v == null) {
        v = defValue;
        setItem(key, v);
      }
      return v;
    }

    function setItem(key, value) {
      localStorage.setItem(key, value);
    }

    // 展开
    function clickZk() {
      xieSvgZk.style.display = 'none';
      xieSvgSs.style.display = 'unset';
      showAndHidden(xieBody, 'flex', 1);
    }
    // 收缩
    function clickSs() {
      xieSvgSs.style.display = 'none';
      showAndHidden(xieBody, null, 0);
      xieSvgZk.style.display = 'unset';
    }

    function bfzt(type) {
      if (type) {
        xieSvgBf.style.display = 'none';
        xieSvgZt.style.display = 'unset';
      } else {
        xieSvgZt.style.display = 'none';
        xieSvgBf.style.display = 'unset';
      }
    }
    // 播放
    function clickBf() {
      if (window.speechSynthesis.speaking) {
        console.log('继续播放');
        window.speechSynthesis.resume(); //继续
      } else {
        console.log('开始播放');
        getContent();
      }
      bfzt(true);
    }

    // 暂停
    function clickZt() {
      console.log('暂停');
      window.speechSynthesis.pause();
    }

    /*
    其它方法
      resume() 重新开始
      stop()   立即终止

      正在播放语音：window.speechSynthesis.speaking && !window.speechSynthesis.pause
      处于暂停中：window.speechSynthesis.paused
    * */
    // 清空
    function clickQk() {
      console.log('清空');
      bfzt(false);
      // 清除所有语音播报创建的队列
      window.speechSynthesis.cancel();
      setCurrentText('未开始朗读！！！');
    }

    var contents = [];
    function getContent() {
      clickQk();
      // console.log('获取播放内容')
      const contentReserveWords = ['p', 'span', 'br', 'pre', 'b', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'i', 'u'];
      var childNodes = contentEle.childNodes;
      for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        if (childNode.nodeType === 1 && !contentReserveWords.includes(childNode.nodeName.toLowerCase())) {
          contentEle.removeChild(childNode);
        }
      }
      let stra = contentEle.innerText.split('\n');
      // console.log(stra)
      if (titleEle && titleEle.textContent) {
        contents.push(titleEle.textContent.replace(/[\/-]/g, '/'))
      }

      for (let i = 0; i < stra.length; i++){
        let s = filterStr(stra[i]);
        // 如果这一行为空 或 含需要过滤的关键词 或 第一行与标题内容相同  跳过
        if (s === '' || (contents.length > 0 && contents[0].replace(' ', '') === s.replace(' ', '') && i === 0)) {
          continue;
        }
        contents.push(s);
        //console.log(s)
      }
      if (contents.length > 0) {
        let s = '本次朗读结束！'
        if (autoplayV == 1) {
          if (rightButton == null) {
            s += '未找到下一章元素，自动跳转失败'
          }
          else {
            s += '即将自动跳转下一页'
          }
        }
        else {
          clickZk();
        }
        contents.push(s)
        mySpeechSynthesis(0);
      }
      console.log(contents)
    }

    function filterStr(s) {
      if (s) {
        s = getText(s);
        filterKeywords.forEach(function (v) {
          if (s.indexOf(v) !== -1) {
            // 定义标点符号数组
            let si = s.indexOf(v);
            let li = -1;
            // 从字符串末尾开始向前遍历
            for (let i = si - 1; i >= 0; i--) {
              // 如果当前字符是标点符号，则返回该下标
              if (punctuationMarks.includes(s[i])) {
                li = i;
                break;
              }
            }
            console.log(s, li, v)
            if (li === -1) {
              s = '';
              return;
            }
            else {
              s = s.substring(0, li + 1);
            }
          }
        });
      }
      return s;
    }
    function setCurrentText(message) {
      // console.log('当前播放：', message);
      bottomContent.innerHTML = message;
    }

    function mySpeechSynthesis(i) {
      let message = contents[i];
      let msg = new SpeechSynthesisUtterance();
      // 文本
      msg.text = message;
      // 声音
      msg.voice = window.speechSynthesis.getVoices()[Number(getItem("xie-input-voice", null))];

      // 音量：0~1，默认1，
      msg.volume = Number(getItem("xie-input-volume", 1));
      // 语速：0.1~10，默认1
      msg.rate = Number(getItem("xie-input-rate", 1));
      // 音高：0~2，默认1
      msg.pitch = Number(getItem("xie-input-pitch", 1));
      // 开始
      msg.onstart = ()=> {
        if (i === 0) {
          clickSs();
        }
        // console.log('开始')
        setCurrentText(message);
      }
      // 暂停
      msg.onpause = ()=> {
        // console.log('暂停');
        bfzt(false);
      }
      // 结束回调
      msg.onend = ()=> {
        if (!window.speechSynthesis.pending) {
          console.log('结束', contents.length, i);
          if (i >= contents.length - 1) {
            bfzt(false);
            setCurrentText('播放完成！！！');

            if (autoplayV == 1) {
              if (rightButton == null) {
                clickZk();
              }
              else {
                setTimeout(function() {
                  rightButton.click();
                }, 1000);
              }
            }
            else {
              clickZk();
            }

          } else {
            mySpeechSynthesis(i + 1);
          }
        }
      };
      window.speechSynthesis.speak(msg);
      // console.log(msg)
    }
  }, 1500);


})();
