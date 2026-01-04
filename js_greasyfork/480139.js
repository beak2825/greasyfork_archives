// ==UserScript==
// @name         LearningApps Show Crossword Answers
// @version      0.1
// @description  Add "Show answers" button to LearningApps crossword
// @author       stennen
// @match        *://learningapps.org/display?v=*
// @grant        none
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=learningapps.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480139/LearningApps%20Show%20Crossword%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/480139/LearningApps%20Show%20Crossword%20Answers.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
        function handler2() {

            let appcnt = document.body.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("iframe")[0].contentWindow;

            if (!appcnt.eval('AppClient')) {
                return;
            }

            if (!appcnt.document.body.innerHTML.includes('<script type="text/javascript" src="crossword.js"></script>')) {
                return;
            }

            let dc = document.getElementById("content_container");
            let cntr = document.createElement("center");
            let el = document.createElement("button");
            el.setAttribute("id", "showAnswersBtn");
            el.innerText='Show Answers';
            el.style.fontFamily='Arial';
            el.style.fontSize='30px';
            el.style.textAlign='center';
            cntr.appendChild(el);
            dc.appendChild(cntr);
            el = document.getElementById("showAnswersBtn");
            el.onclick = () => {
                let appClient = document.body.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.eval('AppClient');

                let answers='';
                for (let i=0;i<50;i++) {
                    let answr = appClient.getParameter("word" + i);
                    if (answr) {
                        answers+='<h3>Word ' + i + ': ' + answr + '</h3>';
                    }
                }

                let wnd = window.open("about:blank");
                wnd.document.body.innerHTML = '<style>h1,h2,h3,h4,h5,h6{font-family:Arial}</style><center><h1>Answers</h1><hr>' + answers + '<hr><p>made by stennen</p></center>'
            };
        }

        if (document.getElementById("showAnswersBtn")) {
            return;
        }

        if (!document.body.getElementsByTagName("iframe")) {
            return;
        }


        if (!document.body.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("iframe")) {
            return;
        }

        handler2();

    }, 1500);

    /* made by Stennen */
})();