// ==UserScript==
// @name         复制授权
// @namespace    https://viayoo.com/
// @version      0.1
// @homepageURL  https://app.viayoo.com/addons/59
// @author       Sky
// @run-at       document-start
// @match        *
// @description  none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488243/%E5%A4%8D%E5%88%B6%E6%8E%88%E6%9D%83.user.js
// @updateURL https://update.greasyfork.org/scripts/488243/%E5%A4%8D%E5%88%B6%E6%8E%88%E6%9D%83.meta.js
// ==/UserScript==
/*
* @name: 复制授权
* @Author: Sky
* @version: 1.4
* @description: 管理网页复制行为
* @include: *
* @createTime: 2020-8-8 11:55
* @updateTime: 2021-11-7 23:10
*/
(function(){const
/* 等号后的数可供修改
1为是 0为否 */
needc = 1, /* 拦截复制时是否弹窗确认 */
shows = 1, /* 是否显示小红点开关 */
/*－－－－以下勿改－－－－*/
key = encodeURIComponent('复制授权:执行判断');
if(window[key]){return;}
try {
window[key] = true;
let red = true,
lastCopyTime = 0;
function copyHandle(e){
function stopCopy(){e.preventDefault();e.stopImmediatePropagation();lastCopyTime = Date.now();}
if(Date.now() - lastCopyTime < 100){stopCopy();return;}
if(red && !(needc && confirm('网页正在尝试复制，是否允许？'))){stopCopy();}
}
document.addEventListener('copy',(e)=>copyHandle(e),{'passive':false, 'capture':true});
Array.from(document.getElementsByTagName('iframe')).forEach((i)=>i.contentDocument.addEventListener('copy',(e)=>copyHandle(e),{'passive':false, 'capture':true}));
if(shows){
const sw = document.createElement("div");
sw.style = 'position:fixed!important;bottom:45%;right:10px;z-index:999999;width:14px;height:14px;opacity:0.4;border-radius:7px;background:red';
document.body.appendChild(sw);
sw.addEventListener('touchmove', function(e){
sw.style.right = sw.style.bottom = '';
sw.style.left = (e.touches[0].clientX - 7) + 'px';
sw.style.top = (e.touches[0].clientY - 7) + 'px';
}, {'passive':true});
sw.addEventListener('click', function(e){
sw.style.background = red ? 'green' : 'red'
red = !red;
}, {'passive':true});
}
} catch(err){console.log('复制授权：', err);}
})();
