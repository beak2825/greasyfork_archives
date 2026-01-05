// ==UserScript==
// @name       Remove Gmail and Outlook Ads
// @namespace  https://www.iplaysoft.com
// @version    0.15
// @description  Remove Gmail and Outlook Ads on web
// @match      https://mail.google.com/mail/*
// @match      https://outlook.live.com/*
// @require    https://cdn.staticfile.org/jquery/3.4.1/jquery.slim.min.js
// @copyright  X-Force
// @downloadURL https://update.greasyfork.org/scripts/4806/Remove%20Gmail%20and%20Outlook%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/4806/Remove%20Gmail%20and%20Outlook%20Ads.meta.js
// ==/UserScript==

if (window.top != window.self){
    //don't run on frames or iframes
  return;
}

var $=window.jQuery;

function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}



if(window.location.href.indexOf('mail.google.com')>0){
    //右侧和底部
    //GM_addStyle(".oM { display:none; }");
    //GM_addStyle(".Zs { display:none; }");
    //邮件列表顶部
    GM_addStyle(".aDM .Cp:first-child,.a4e .Cp:first-child{display: none !important; }");
}

if(window.location.href.indexOf('outlook.live.com')>0){
    $(document).ready(function(){
        document.getElementById("owaadbar0").parentNode.parentNode.parentNode.style.display="none";
    });
}