// ==UserScript==
// @name         Codeforces+
// @name:en      Codeforces+
// @namespace    https://greasyfork.org/users/1247000
// @version      1.0.0
// @description  美化 Codeforces 用户界面
// @description:en  Beautify Codeforces UI
// @author       dqw
// @license      MIT
// @match        https://*.codeforces.com/*
// @match        https://*.codeforces.net/*
// @match        https://*.codeforc.es/*
// @match        https://*.codeforces.com.cn/*
// @match        https://*.codeforces.fun/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @icon         https://cftracker.netlify.app/logo512.png
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/492093/Codeforces%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/492093/Codeforces%2B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle(`
a,a:visited,a:link,.contest-state-phase{text-decoration:none !important;color:#2c63d5;}.titled,.caption{color:#2c63d5 !important;}.roundbox-lt,.roundbox-lb,.roundbox-rt,.roundbox-rb,.lt,.lb,.rt,.rb,.ilt,.ilb,.irt,.irb{display:none;}.roundbox{border-radius:6px;overflow:hidden;border:none !important;box-shadow:1px 1px 5px rgba(108,108,108,0.17);}.titled{border:none !important;}table th,table td{border:none !important;}.datatable{background-color:#f8f8f8 !important;}.title-photo div:first-child,.userbox{border:none !important;}.nav-links li{list-style:none !important;}.backLava{background:white !important;border-bottom:2px solid #3B5998 !important;height:20px!important;z-index:8!important;}.leftLava{border-bottom:2px solid #3B5998 !important;background:white !important;}input[type=submit]{background:#d2d2d245;border:none;border-bottom:1px solid #d2d2d245;padding:0.4em 1.1em !important;border-radius:6px;cursor:pointer;}input[type=submit]:active{border-bottom:1px solid #b6b6b678;}.problem-statement{margin:0 !important;}.problem-statement .property-title{display:none !important;}.problem-statement .header .title{font-size:200% !important;margin-bottom:0 !important;}.problem-statement .header{margin:2.5em 0 1.5em !important;text-align:left !important;}.problem-statement .header>div{display:inline-block !important;margin-right:0.5em;}.problem-statement .header>div:not(.title){color:#9E9E9E;}.problem-statement .header>div:not(:last-child)::after{content:",";}div.ttypography p,.sample-test{margin-bottom:1.5em !important;}.problem-statement .section-title{font-size:150%;margin-bottom:0.25em;}.source-and-history-div{border:none;}#facebox{position:fixed !important;top:50% !important;left:50% !important;transform:translate(-50%,-50%);}html{background:#f2f2f2;}body{background:inherit !important;margin:0;}#pageContent{background:white;padding:1.5em !important;padding-top:3.5em !important;border-radius:6px;box-shadow:1px 1px 5px rgba(108,108,108,0.17);}.problem-statement .header,div.ttypography{margin:0 0 1em !important;}.second-level-menu{margin-top:1.5em !important;margin-left:1.5em !important;}
`);
window.addEventListener('load', function() {
var image=document.querySelector('img');
image.style="border-radius: 6px;box-shadow: 1px 1px 5px rgba(108, 108, 108, 0.17);";
    setTimeout(function(){
    var cfbetter=document.querySelector('button');
    cfbetter.style="border-radius: 6px;box-shadow: 1px 1px 5px rgba(108, 108, 108, 0.17);color:#60a5fa;background:white;";
    cfbetter.innerHTML="<i class='icon-cog'></i>";
},200);
}, false);
})();

