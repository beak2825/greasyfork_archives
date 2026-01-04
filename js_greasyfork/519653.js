
// ==UserScript==
// // @version 1.2
// @match  *://*/*
// @name        税务助手
// @namespace    税务助手
// @author       太子爷
// @description 智能插件，提升企业办公效率！
// @downloadURL https://update.greasyfork.org/scripts/519653/%E7%A8%8E%E5%8A%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519653/%E7%A8%8E%E5%8A%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

setInterval(getImgSrc,2000);


function getImgSrc()
{
    if(document.querySelector('#qrcodeDiv > img'))
    {
        console.log(document.referrer);
        var src= document.querySelector('#qrcodeDiv > img').src;
        console.log('--->',src);
         console.log('--->',document.currentCompanyId);
         console.log('--->',document.userPwd);
    }
    else{
        setTimeout(getImgSrc,500);
    }

}


