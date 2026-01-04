// ==UserScript==
// @name         yinxiang Redirect evernote
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  yinxiang app login page auto redirect to evernote inernational
// @description:zh-CN 国内印象笔记登录页面自动跳转至国际版evernote。
// @author       CXOCTO
// @match        https://app.yinxiang.com/ClipperLogin.action?wck=clipper_chr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472680/yinxiang%20Redirect%20evernote.user.js
// @updateURL https://update.greasyfork.org/scripts/472680/yinxiang%20Redirect%20evernote.meta.js
// ==/UserScript==

(function() {
let btn=document.createElement("button");
btn.innerHTML="GOTO EVERNOTE";
    location='https://www.evernote.com/ClipperLogin.action?wck=clipper_chr';
btn.onclick=function(){
    //https://www.evernote.com/ClipperLogin.action?wck=clipper_chr
    location='https://www.evernote.com/ClipperLogin.action?wck=clipper_chr'
}
document.body.append(btn);
})();