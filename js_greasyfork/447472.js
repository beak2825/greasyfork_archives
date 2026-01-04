// ==UserScript==
// @name        Copy utaten lyrics
// @namespace    https://zhiyoon.cn
// @match       https://utaten.com/lyric/*
// @version     1.0
// @author      qrqhuang
// @license      MIT
// @description  Simple implement to provider an area for copy lyrics. It can keep hiragana typesetting.
// @note         20220706 init repo
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/447472/Copy%20utaten%20lyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/447472/Copy%20utaten%20lyrics.meta.js
// ==/UserScript==
(function () {
    let copyZoneCss =
        `
        #copyZone {
          background:aliceblue;
          line-height: 10px
        }
        
        .table-1 {
          width: auto;
        }

        .table-1 thead,
        .table-1 tr {
            line-height: 15px
        }


        /* Padding and font style */
        .table-1 td,
        .table-1 th {
            padding: 0px 0px;
            font-size: 13px;
            font-family: Verdana;
            #color: #5b7da3;
            white-space: nowrap;
            text-align: left;
            border-top: none;
            border-bottom: none;
        }

        /* Alternating background colors */
        .pianjia_line {
            #background: #d3dfed;
            #text-align: center;
            letter-spacing: -0.001em;
            color: #999;
        }

        .normal_line {
            #background: #FFF;
        }
      `;

    function copyLyrics() {
        const lrcDOM = document.querySelector(".hiragana");
        const childNodes = lrcDOM.childNodes;

        let lines = '';

        let pingjia = [];
        let hanzi = [];
        for (let i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];

            if (node.nodeName === 'BR') {
                lines = lines + `<table class="table-1">`;
                if (pingjia.join("").trim() !== '') {
                    lines = lines + '<tr class="pianjia_line">' + pingjia.map(e => `<td>${e}</td>`).join("") + "</tr>";
                }

                lines = lines + '<tr class="normal_line">' + hanzi.map(e => `<td>${e}</td>`).join("") + "</tr>";
                lines = lines + `</table><br/>`;

                pingjia = [];
                hanzi = [];

                continue;
            }


            if (node.className === 'ruby') {
                var rubyNodes = node.childNodes;

                hanzi.push(rubyNodes[0].textContent);
                pingjia.push(rubyNodes[1].textContent);
            } else if (node.nodeType === 3) {
                if (node.data.trim() !== '') {
                    //text
                    hanzi.push(node.data.trim());
                    pingjia.push("");
                }
            }
        }

        let html = `<div id="copyZone">${lines}</div><br/><br/>`;
        document.querySelector("#container").insertAdjacentHTML(
            "afterbegin",
            html
        );
    }

    GM_addStyle(copyZoneCss);
    setTimeout(copyLyrics, 200);
})();