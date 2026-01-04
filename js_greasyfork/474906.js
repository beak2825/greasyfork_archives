// ==UserScript==
// @name         HZ-Fang
// @description  HZ-Fang Stay Version
// @namespace    http://stay.app/
// @version      0.0.23
// @author       Stay
// @match        *://113.16.217.147:8084/hzwspsp/web/swbhz*
// @icon         https://greasyfork.org/vite/assets/blacklogo16-37ZGLlXh.png
// @run-at       document-start
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474906/HZ-Fang.user.js
// @updateURL https://update.greasyfork.org/scripts/474906/HZ-Fang.meta.js
// ==/UserScript==

const myStyles = `
.hui-header, .hui-header h1 {
  height: 30px !important;
  line-height: 1 !important;
  font-size: 16px !important;
  line-height: 30px !important;
}

.hui-wrap {
  overflow: scroll;
}

.aui-extreme {
  padding: 0 !important;
}

.aui-extreme-item {
  width: 11% !important;
  margin-bottom: 2px;
}

.aui-extreme-item .bgBlue {
  background: #ecf6ff !important;
}

.aui-extreme-item .bgBlue .aui-hot{
  opacity: 0.2 !important;
}

.aui-extreme-item .aui-flex {
  padding: 2px !important;
}

.aui-palace {
  padding: 0;
}

.aui-palace-grid-text h2 {
  display: none;
}

.aui-palace-grid-text p {
  font-size: 12px !important;
  line-height: 1 !important;
  transform: scale(0.7) !important;
  transform-origin: left !important;
}

.aui-palace a:nth-child(2) {
  display: none !important;
}

.aui-palace a {
  width: 45% !important;
}

.aui-flex-box {
  height: 30px !important;
}

.aui-flex-box h2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-break: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-height: 1;
  font-size: 12px !important;
  transform: scale(0.8) !important;
  transform-origin: left !important;
}

.aui-hot,
.aui-hot img {
    width: 25px !important;
    height: 25px !important;
}

.scrolltab-content-item h1 {
  font-size: 12px !important;
  padding: 0 !important;
  line-height: 1 !important;
  transform: scale(0.6)  !important;
  transform-origin: left  !important;
}

.aui-palace-grid {
  margin-bottom: 0  !important;
    line-height: 1  !important;
}

#xxxx_div {
  width: 20% !important;
  font-size: 12px !important;
}

#list_div {
    width: 80% !important;
    font-size: 12px !important;
    height: 200% !important;
}

#xxxx_div span,
#xxxx_div li,
.xxxxclas table,
.xxxxclas td {
  font-size: 12px !important;
  transform: scale(0.8);
  transform-origin: left;
}
`;

function main(injectType) {
    setTimeout(() => {
        document.getElementById('xxxx_div').style.height = 'auto';
        document.getElementById('list_div').style.height = 'auto';
        document.querySelector('.hottit').remove();
        document.querySelector('.scrolltab-nav').remove();
        document.body.style.zoom = navigator.userAgent.includes('safari') ? 0.3 : 1;

        var styleSheet = document.createElement('style');
        styleSheet.innerText = myStyles;
        document.head.appendChild(styleSheet);

        setTimeout(() => {
            console.log('injectType:', injectType);
            document.querySelectorAll('.aui-flex-box h2').forEach((el) => {
                if (/\[(.*)\]/.test(el.innerText)) {
                    if (el.innerText.match(/\[(.*)\]/) && el.innerText.match(/\[(.*)\]/)[1]) {
                        el.innerText = el.innerText.match(/\[(.*)\]/)[1];
                    }
                }
            });

            document.querySelectorAll('.aui-palace-grid-text p').forEach((el) => {
                el.innerText = el.innerText.replace('㎡', '');
            });
        }, 1000);
    }, 200);
}

if (document.readyState !== 'loading') {
    main('readyState');
} else {
    document.addEventListener('DOMContentLoaded', function (event) {
        main('DOMContentLoaded');
    });
}



