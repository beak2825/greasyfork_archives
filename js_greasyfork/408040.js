// ==UserScript==
// @name         f**k wechat taobao link
// @namespace    https://rainhan.io
// @version      0.3
// @description  fix wechat to direct open ANY link/微信桌面版直接打开各种链接
// @author       Luuray
// @match        https://support.weixin.qq.com/cgi-bin/mmsupport-bin/readtemplate?t=w_redirect_taobao*
// @match        https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/408040/f%2A%2Ak%20wechat%20taobao%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/408040/f%2A%2Ak%20wechat%20taobao%20link.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var url = document.body.getAttribute("url");

    if(url){
        location.replace(url.replace(/&amp;/g, "&"));
    }
    else{
        var escaper = document.createElement("textarea");
        if(cgiData.hasOwnProperty('url')){
            escaper.innerHTML = cgiData.url;
        }else{
            if(cgiData.desc.indexOf('http') !=0){
                return ;
            }
            escaper.innerHTML = cgiData.desc;
        }
        location.replace(escaper.value);
    }
})();