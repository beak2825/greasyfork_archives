// ==UserScript==
// @name         SPOJ 注册时显示验证码
// @namespace    https://www.luogu.com.cn/user/705138
// @version      0.1
// @description  让 SPOJ 注册时显示替代验证码(原验证码会被墙)
// @author       Lucas2011xy
// @match        https://www.spoj.com/register/
// @icon         https://stx1.spoj.com/gfx/favicon_new.png
// @grant        none
// @license      CC-BY-SA-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/487562/SPOJ%20%E6%B3%A8%E5%86%8C%E6%97%B6%E6%98%BE%E7%A4%BA%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/487562/SPOJ%20%E6%B3%A8%E5%86%8C%E6%97%B6%E6%98%BE%E7%A4%BA%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* FROM https://recaptcha.net/recaptcha/api.js?hl=en */(function(){var w=window,C='___grecaptcha_cfg',cfg=w[C]=w[C]||{},N='grecaptcha';var gr=w[N]=w[N]||{};gr.ready=gr.ready||function(f){(cfg['fns']=cfg['fns']||[]).push(f);};w['__recaptcha_api']='https://recaptcha.net/recaptcha/api2/';(cfg['render']=cfg['render']||[]).push('onload');w['__google_recaptcha_client']=true;var d=document,po=d.createElement('script');po.type='text/javascript';po.async=true;po.src='https://www.gstatic.cn/recaptcha/releases/yiNW3R9jkyLVP5-EEZLDzUtA/recaptcha__en.js';po.crossOrigin='anonymous';po.integrity='sha384-7+IRLxkl1z6qr/oVEzkUcOT7nJWJEREgLpBaZWNupuW+U8zyeMHDFv52Ok8DA41S';var e=d.querySelector('script[nonce]'),n=e&&(e['nonce']||e.getAttribute('nonce'));if(n){po.setAttribute('nonce',n);}var s=d.getElementsByTagName('script')[0];s.parentNode.insertBefore(po, s);})();
})();