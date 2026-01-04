// ==UserScript==
// @name           Github1s
// @icon           https://github.githubassets.com/pinned-octocat.svg
// @version        1.0.2
// @description    在 Github 网站顶部显示 Github1s 按钮，Github1s 是一个利用 VsCode Online 浏览代码的项目
// @author         zw95
// @originAuthor   桔子
// @match          https://github.com/*
// @grant          GM_addStyle
// @run-at         document-end
// @require        https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.slim.min.js
// @require        https://greasyfork.org/scripts/475259-elementgetter-alone/code/ElementGetter_Alone.js?version=1250106
// @namespace      https://greasyfork.org/users/991143
// @scriptHomePage https://greasyfork.org/scripts/486673
// @downloadURL https://update.greasyfork.org/scripts/486673/Github1s.user.js
// @updateURL https://update.greasyfork.org/scripts/486673/Github1s.meta.js
// ==/UserScript==

var themeMode;
(function () {
  "use strict";
  init();
  style();
  work();
})();

function init(){
  themeMode = document.querySelector("html")?.getAttribute('data-color-mode') || 'light';
}
/**
 * 创建 Github1s 按钮
 */
function work() {
  // 首页按钮
  elmGetter.get('.pagehead-actions.flex-shrink-0.d-none.d-md-inline').then((node) => {
    const github1sUrl = `https://github1s.com${location.pathname}`;
    const element = '<li id="github1sProjectButton"> <a target="_blank" class="btn btn-sm" href="' + github1sUrl + '"> <svg t="1613127032045" class="icon octicon octicon-heart text-pink" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2120" width="16.015625" height="16" xmlns:xlink="http://www.w3.org/1999/xlink"> <path d="M512.032 831.904c-19.168 0-38.304-9.92-58.144-29.76-7.808-7.808-7.808-20.48 0-28.288s20.48-7.808 28.288 0C494.368 786.08 504.16 792 512.032 792s17.664-5.92 29.856-18.144c7.808-7.808 20.48-7.808 28.288 0s7.808 20.48 0 28.288c-19.84 19.84-38.976 29.76-58.144 29.76z m-512-306.4c0 49.888 4.256 95.136 12.8 135.68s20.544 75.744 36 105.536 35.008 55.904 58.656 78.336 49.344 40.928 77.056 55.456c27.744 14.528 59.456 26.304 95.2 35.264S351.84 951.04 388.8 954.624 466.496 960 510.944 960c44.448 0 85.248-1.792 122.4-5.376s73.6-9.856 109.344-18.848c35.744-8.96 67.552-20.736 95.456-35.264s53.792-33.024 77.6-55.456c23.808-22.432 43.456-48.544 58.944-78.336s27.552-64.96 36.256-105.536c8.704-40.576 13.056-85.792 13.056-135.68 0-89.376-27.744-166.368-83.2-230.976 3.2-8.608 5.952-18.496 8.256-29.6s4.544-26.816 6.656-47.104c2.144-20.288 1.344-43.712-2.4-70.272S942.56 93.888 932.256 66.24l-8-1.632c-5.344-1.088-14.048-0.704-26.144 1.088s-26.208 5.024-42.4 9.696-37.056 13.92-62.656 27.744-52.608 31.328-81.056 52.512c-48.352-14.72-115.008-30.112-200-30.112s-151.808 15.392-200.544 30.112c-28.448-21.184-55.552-38.592-81.344-52.224s-46.4-22.976-61.856-28c-15.456-5.024-29.792-8.256-42.944-9.696s-21.6-1.888-25.344-1.344c-3.744 0.544-6.496 1.152-8.256 1.888-10.304 27.648-17.408 54.752-21.344 81.312s-4.8 49.888-2.656 69.984c2.144 20.096 4.448 35.904 6.944 47.392S80 286.304 83.2 294.56C27.744 358.816 0 435.808 0 525.536z m136.544 113.888c0-58.016 21.344-110.624 64-157.856 12.8-14.4 27.648-25.312 44.544-32.704s36.096-11.616 57.6-12.608 42.048-0.8 61.6 0.608 43.744 3.296 72.544 5.696 53.696 3.616 74.656 3.616c20.96 0 45.856-1.184 74.656-3.616s52.992-4.288 72.544-5.696c19.552-1.408 40.096-1.6 61.6-0.608s40.8 5.216 57.856 12.608c17.056 7.392 32 18.304 44.8 32.704 42.656 47.232 64 99.84 64 157.856 0 34.016-3.552 64.32-10.656 90.944s-16.096 48.928-26.944 66.912c-10.848 18.016-26.048 33.216-45.6 45.632s-38.496 22.016-56.8 28.8c-18.304 6.784-41.952 12.096-70.944 15.904s-54.944 6.112-77.856 6.912c-22.944 0.8-51.808 1.216-86.656 1.216s-63.648-0.416-86.4-1.216c-22.752-0.8-48.608-3.104-77.6-6.912s-52.608-9.12-70.944-15.904c-18.304-6.816-37.248-16.416-56.8-28.8s-34.752-27.616-45.6-45.632c-10.848-18.016-19.84-40.32-26.944-66.912s-10.656-56.928-10.656-90.944zM256.032 608c0-53.024 28.64-96 64-96s64 42.976 64 96-28.64 96-64 96-64-42.976-64-96z m384 0c0-53.024 28.64-96 64-96s64 42.976 64 96-28.64 96-64 96-64-42.976-64-96z" p-id="2121" fill="var(--color-codemirror-text)"></path> </svg></a> </li>';

    node.insertAdjacentHTML('afterBegin', element);
  });

  // 单文件按钮
  // elmGetter.get('.react-blob-header-edit-and-raw-actions > div:nth-child(1)').then((fileEditbutton) => {
  elmGetter.each('.react-blob-header-edit-and-raw-actions', document,(fileEditbutton) => {
    const parentNode = fileEditbutton.parentNode;

    console.log(1)
    const fileButton = document.createElement('button');
    fileButton.className='btn btn-sm';
    fileButton.innerHTML = `<svg t="1613127032045" class="icon octicon octicon-heart text-pink" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2120" width="16.015625" height="16" xmlns:xlink="http://www.w3.org/1999/xlink"> <path d="M512.032 831.904c-19.168 0-38.304-9.92-58.144-29.76-7.808-7.808-7.808-20.48 0-28.288s20.48-7.808 28.288 0C494.368 786.08 504.16 792 512.032 792s17.664-5.92 29.856-18.144c7.808-7.808 20.48-7.808 28.288 0s7.808 20.48 0 28.288c-19.84 19.84-38.976 29.76-58.144 29.76z m-512-306.4c0 49.888 4.256 95.136 12.8 135.68s20.544 75.744 36 105.536 35.008 55.904 58.656 78.336 49.344 40.928 77.056 55.456c27.744 14.528 59.456 26.304 95.2 35.264S351.84 951.04 388.8 954.624 466.496 960 510.944 960c44.448 0 85.248-1.792 122.4-5.376s73.6-9.856 109.344-18.848c35.744-8.96 67.552-20.736 95.456-35.264s53.792-33.024 77.6-55.456c23.808-22.432 43.456-48.544 58.944-78.336s27.552-64.96 36.256-105.536c8.704-40.576 13.056-85.792 13.056-135.68 0-89.376-27.744-166.368-83.2-230.976 3.2-8.608 5.952-18.496 8.256-29.6s4.544-26.816 6.656-47.104c2.144-20.288 1.344-43.712-2.4-70.272S942.56 93.888 932.256 66.24l-8-1.632c-5.344-1.088-14.048-0.704-26.144 1.088s-26.208 5.024-42.4 9.696-37.056 13.92-62.656 27.744-52.608 31.328-81.056 52.512c-48.352-14.72-115.008-30.112-200-30.112s-151.808 15.392-200.544 30.112c-28.448-21.184-55.552-38.592-81.344-52.224s-46.4-22.976-61.856-28c-15.456-5.024-29.792-8.256-42.944-9.696s-21.6-1.888-25.344-1.344c-3.744 0.544-6.496 1.152-8.256 1.888-10.304 27.648-17.408 54.752-21.344 81.312s-4.8 49.888-2.656 69.984c2.144 20.096 4.448 35.904 6.944 47.392S80 286.304 83.2 294.56C27.744 358.816 0 435.808 0 525.536z m136.544 113.888c0-58.016 21.344-110.624 64-157.856 12.8-14.4 27.648-25.312 44.544-32.704s36.096-11.616 57.6-12.608 42.048-0.8 61.6 0.608 43.744 3.296 72.544 5.696 53.696 3.616 74.656 3.616c20.96 0 45.856-1.184 74.656-3.616s52.992-4.288 72.544-5.696c19.552-1.408 40.096-1.6 61.6-0.608s40.8 5.216 57.856 12.608c17.056 7.392 32 18.304 44.8 32.704 42.656 47.232 64 99.84 64 157.856 0 34.016-3.552 64.32-10.656 90.944s-16.096 48.928-26.944 66.912c-10.848 18.016-26.048 33.216-45.6 45.632s-38.496 22.016-56.8 28.8c-18.304 6.784-41.952 12.096-70.944 15.904s-54.944 6.112-77.856 6.912c-22.944 0.8-51.808 1.216-86.656 1.216s-63.648-0.416-86.4-1.216c-22.752-0.8-48.608-3.104-77.6-6.912s-52.608-9.12-70.944-15.904c-18.304-6.816-37.248-16.416-56.8-28.8s-34.752-27.616-45.6-45.632c-10.848-18.016-19.84-40.32-26.944-66.912s-10.656-56.928-10.656-90.944zM256.032 608c0-53.024 28.64-96 64-96s64 42.976 64 96-28.64 96-64 96-64-42.976-64-96z m384 0c0-53.024 28.64-96 64-96s64 42.976 64 96-28.64 96-64 96-64-42.976-64-96z" p-id="2121" fill="var(--color-codemirror-text)"></path> </svg>`;

    // RAW URL 按钮
    elmGetter.get('button[aria-label="Copy raw content"]').then((rawFileButton) => {
    // elmGetter.each('button[aria-label="Copy raw content"]', document,(rawFileButton) => {

      var copyRawURLBtn = rawFileButton.cloneNode(true);
      copyRawURLBtn.removeAttribute('data-component');
      copyRawURLBtn.removeAttribute('data-testid');
      copyRawURLBtn.attributes['aria-label'] = 'Copy raw URL';
      copyRawURLBtn.attributes['id'] = 'copyRawURLBtn';
      copyRawURLBtn.title = '复制Raw URL';
      copyRawURLBtn.className = 'btn btn-sm'
      copyRawURLBtn.innerHTML = '<svg t="1715571239682" class="octicon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8619" width="16" height="16"><path d="M578.133 675.627c-3.306-3.307-8.746-3.307-12.053 0L442.133 799.573c-57.386 57.387-154.24 63.467-217.6 0-63.466-63.466-57.386-160.213 0-217.6L348.48 458.027c3.307-3.307 3.307-8.747 0-12.054l-42.453-42.453c-3.307-3.307-8.747-3.307-12.054 0L170.027 527.467c-90.24 90.24-90.24 236.266 0 326.4s236.266 90.24 326.4 0L620.373 729.92c3.307-3.307 3.307-8.747 0-12.053l-42.24-42.24z m275.84-505.6c-90.24-90.24-236.266-90.24-326.4 0L403.52 293.973c-3.307 3.307-3.307 8.747 0 12.054l42.347 42.346c3.306 3.307 8.746 3.307 12.053 0l123.947-123.946c57.386-57.387 154.24-63.467 217.6 0 63.466 63.466 57.386 160.213 0 217.6L675.52 565.973c-3.307 3.307-3.307 8.747 0 12.054l42.453 42.453c3.307 3.307 8.747 3.307 12.054 0l123.946-123.947c90.134-90.24 90.134-236.266 0-326.506z" p-id="8620"></path><path d="M616.64 362.987c-3.307-3.307-8.747-3.307-12.053 0l-241.6 241.493c-3.307 3.307-3.307 8.747 0 12.053l42.24 42.24c3.306 3.307 8.746 3.307 12.053 0L658.773 417.28c3.307-3.307 3.307-8.747 0-12.053l-42.133-42.24z" p-id="8621"></path></svg>'
      copyRawURLBtn.addEventListener("click", function() {
        // 复制固定文字到剪贴板
        var textArea = document.createElement('textarea');
        const fileRawPath = `${location.pathname}`.replace(/^\/((?:\w|-)+)\/((?:\w|-)+)\/blob\//, '/$1/$2/')
        const fileRawURL = `https://raw.githubusercontent.com${fileRawPath}`
        textArea.value = fileRawURL;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? '成功复制' : '复制失败';
            console.log(msg);
        } catch (err) {
            console.error('无法复制文本: ', err);
        }
        document.body.removeChild(textArea);
        const x = copyRawURLBtn.getBoundingClientRect().left - fileButton.clientWidth;
        const y = copyRawURLBtn.getBoundingClientRect().top - copyRawURLBtn.clientHeight -8;
        showTip('已复制！',x,y);
        setTimeout(()=>{
          cleanTip();
        },2000);
      });

      copyRawURLBtn.addEventListener("mouseover", function() {
        const x = copyRawURLBtn.getBoundingClientRect().left - fileButton.clientWidth;
        const y = copyRawURLBtn.getBoundingClientRect().top - copyRawURLBtn.clientHeight -8;
        showTip('复制Raw URL',x,y);
      });

      copyRawURLBtn.addEventListener("mouseout", function() {
        cleanTip();
      });

      // 添加复制RAW URL 按钮
      if(parentNode.firstChild){
        parentNode.insertBefore(copyRawURLBtn, parentNode.firstChild);
      } else {
        parentNode.appendChild(copyRawURLBtn);
      }

    });
    fileButton.addEventListener("click", function() {
      const github1sUrl = `https://github1s.com${location.pathname}`;
      window.open(github1sUrl, '_blank');
    });
    fileButton.addEventListener("mouseover", function() {
      const x = fileButton.getBoundingClientRect().left  - fileButton.clientWidth;
      const y = fileButton.getBoundingClientRect().top - fileButton.clientHeight -8;
      showTip('在Github1s中打开',x,y);
    });

    fileButton.addEventListener("mouseout", function() {
      cleanTip();
    });
    // 添加单文件按钮
    parentNode.insertBefore(fileButton,parentNode.firstChild);

  });

}

function showTip(msg,x,y,color){
  var tipDiv = document.querySelector("#__primerPortalRoot__");
  var toopTip = document.querySelector('#tooltip');
  var tipChildHtml = `<div style="position: relative; z-index: 1;"><span role="tooltip" id="raw-copy-message-tooltip" aria-live="assertive" class="" style="position: absolute; left: ${x}px; top: ${y}px; display:inline-block;padding:.5em .75em;font:11px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji';color:${color?color:'var(--fgColor-onEmphasis, var(--color-fg-on-emphasis, #ffffff))'};text-align:center;letter-spacing:normal;overflow-wrap:break-word;white-space:pre;pointer-events:none;background:${'var(--bgColor-emphasis,var(--color-neutral-emphasis-plus, #6e7681))'};border-radius:6px">${msg}</span></div>`;
  if(tipDiv){
    !toopTip && (tipDiv.innerHTML = tipChildHtml);
  }else{
    tipDiv = document.createElement('div')
    tipDiv.id = '__primerPortalRoot__';
    tipDiv.style.position = 'absolute';
    tipDiv.style.left = '0px';
    tipDiv.style.top = '0px';
    !toopTip && (tipDiv.innerHTML = tipChildHtml)
    document.body.appendChild(tipDiv);
    console.log('显示失败，没找到！');
  }
}

function cleanTip(){
  const tipDiv = document.querySelector("#__primerPortalRoot__");
  if(tipDiv){
    tipDiv.innerHTML = ``;
  }else{
    console.log('隐藏失败，没找到！');
  }
}
function style(){
  GM_addStyle(`
    .btn-sm {
    padding: 3px 8px;
    font-size: 12px;
    line-height: 20px;
    }
  `);
}