// ==UserScript==
// @name         NTKO办公OA法律文件审查打印
// @license      AGPL License
// @namespace    https://penicillin.github.io/
// @version      0.1
// @description  压缩所有的行
// @match        http://192.168.1.65/SubModule/DocumentFlow/Style/Lease.aspx?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491865/NTKO%E5%8A%9E%E5%85%ACOA%E6%B3%95%E5%BE%8B%E6%96%87%E4%BB%B6%E5%AE%A1%E6%9F%A5%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/491865/NTKO%E5%8A%9E%E5%85%ACOA%E6%B3%95%E5%BE%8B%E6%96%87%E4%BB%B6%E5%AE%A1%E6%9F%A5%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

 const css = '* { height: auto !important;  margin-top: auto !important;  margin-bottom: auto !important;padding-top: 0px !important; };';
 const myStyle = document.createElement('style');
 myStyle.type = 'text/css';
 myStyle.textContent = css;
 document.head.appendChild(myStyle);

const match=document.getElementById('lblb').innerText.match(/关于(.*)/);
if(match){document.title=match[1] + "审查表"};