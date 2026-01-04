// ==UserScript==
// @name        生成链接 
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1.4
// @author      amateur
// @description 将网页中的网址文字都替换成链接
// @downloadURL https://update.greasyfork.org/scripts/429754/%E7%94%9F%E6%88%90%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/429754/%E7%94%9F%E6%88%90%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 网页加载完成后执行（在csdn中不执行）
window.onload = replace;

function replace() {
    let res = new Array();
    // res[0] = new RegExp('https?://.*/(.*?\.(html|htm|php|jsp))?', 'g');
    res[0] = new RegExp('(..)?https?://.*([/ ]|html|htm|php|jsp)', 'g');

    // 根据选择器获取标签
    body = document.querySelector('body');
    for (const re of res) {
        let urls = body.innerText.match(re);
        for (const url of urls) {
          two = url.substr(0, 2);
          // 如果匹配到的是href="url"，则跳过
          if(two === '="') {
            continue;
          }
          if(two !== 'ht') {
            // 除去匹配字符串的前两个字符
            url = url.substr(2);                        
          }
          body.innerHTML = body.innerHTML.replace(url, `<a href=${url} target="_blank">${url}</a>`);
        }
    }
}