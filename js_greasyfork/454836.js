// ==UserScript==
// @name            深大公文通去敏小助手
// @namespace       http://tampermonkey.net/
// @version         1.0.2
// @description     去除深大公文通去隐形水印、去个人信息
// @author          HydrogenE7
// @match           https://www1.szu.edu.cn/board/view.asp?*
// @grant           GM_setValue
// @grant           GM_getValue
// @license         MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/454836/%E6%B7%B1%E5%A4%A7%E5%85%AC%E6%96%87%E9%80%9A%E5%8E%BB%E6%95%8F%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454836/%E6%B7%B1%E5%A4%A7%E5%85%AC%E6%96%87%E9%80%9A%E5%8E%BB%E6%95%8F%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //watermark('深圳大学校园公文通','','');
    window.onload = function(){
        document.body.innerHTML = document.body.innerHTML.replace(/<font color="#F8F8F8" style="font-size:9pt">(.*)<\/font>/gm, '');
        document.body.innerHTML = document.body.innerHTML.replace(/watermark\('深圳大学校园公文通',/gm, '//watermark(\'深圳大学校园公文通\',');
        document.body.innerHTML = document.body.innerHTML.replace(/<div id="mark_div.*<\/div>/gm, '');
        document.body.innerHTML = document.body.innerHTML.replace(/<font class="fontcolor1">(.*)个人中心｜<\/font>/gm, '<font class="fontcolor1">个人中心｜<\/font>');
        document.body.innerHTML = document.body.innerHTML.replace(/【本文属内部通告，未经发文单位同意，不得截屏、拍图或复制转发】/gm, '');
    }
})();