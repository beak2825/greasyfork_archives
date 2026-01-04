// ==UserScript==
// @name         global_oss_Hello
// @namespace    global_oss_Hello
// @description  审核过程的错误提示, Error tips during the review process
// @homepageURL  https://greasyfork.org/scripts/408591-global-oss-Hello
// @version      1.01
// @exclude      https://global-oss.zmqdez.com/front_end/index.html#/country
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @include      https://global-oss*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @connect      oapi.dingtalk.com
// @connect      jinshuju.net
// @run-at       document-idle
// @author       zhousanfu
// @copyright    2020 zhousanfu@hellofun.cn
// @downloadURL https://update.greasyfork.org/scripts/412808/global_oss_Hello.user.js
// @updateURL https://update.greasyfork.org/scripts/412808/global_oss_Hello.meta.js
// ==/UserScript==


var head = document.getElementsByTagName('head')[0],cssURL = 'https://fonts.googleapis.com/css?family=Noto+Sans+SC:100,300,400,500,700,900',linkTag = document.createElement('link');
linkTag.id = 'dynamic-style';
linkTag.href = cssURL;
linkTag.setAttribute('rel','stylesheet');
linkTag.setAttribute('media','all');
linkTag.setAttribute('type','text/css');
head.appendChild(linkTag);
document.querySelector("body").style='font-family: "source-han-serif-sc"'
