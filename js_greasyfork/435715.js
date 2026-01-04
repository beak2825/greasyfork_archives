// ==UserScript==
// @name         quik read mode
// @namespace    http://www.gongjumi.com/
// @version      0.3
// @description  quik read mode!
// @author       h2ero
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/435715/quik%20read%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/435715/quik%20read%20mode.meta.js
// ==/UserScript==

var m = function (f) {
    return f.toString().split('\n').slice(1, - 1).join('\n');
}
var loadCss = function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = m(function () { /*
          img,video{
          display:none !important;
          }
          * {
           color:#404040 !important;
           background:#fff !important;
           background-image:none !important;
          }
          a{
          text-decoration: underline !important;
    background: #eee;
              }

          */
    });
    var head = document.querySelector('head')
    head.appendChild(style);
};
loadCss();

    // Your code here...
