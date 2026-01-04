// ==UserScript==
// @name         lecturenotes-dl
// @version      0.1
// @description  Download PDF from lecturenotes
// @author       nithin005
// @include      https://lecturenotes.in/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @resource     IMPORTED_CSS https://raw.githubusercontent.com/Nithin005/lecturenotes.in-chrome-extension/master/styles.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/696953
// @downloadURL https://update.greasyfork.org/scripts/414016/lecturenotes-dl.user.js
// @updateURL https://update.greasyfork.org/scripts/414016/lecturenotes-dl.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    let doc;
    let i;
    let reader;
    let pageNodes;
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const observer = new MutationObserver(main);
    const config = { attributes: true, childList: true, subtree: true };
    let inserted = false;

    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);

    /**
     * sanitize filename
     * https://gist.github.com/barbietunnie/7bc6d48a424446c44ff4
     */
    var illegalRe = /[\/\?<>\\:\*\|":]/g;
    var controlRe = /[\x00-\x1f\x80-\x9f]/g;
    var reservedRe = /^\.+$/;
    var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

    function sanitize(input, replacement) {
        var sanitized = input
            .replace(illegalRe, replacement)
            .replace(controlRe, replacement)
            .replace(reservedRe, replacement)
            .replace(windowsReservedRe, replacement);
        return sanitized.split("").splice(0, 255).join("")
    }
    /** */

    function main() {
        let imgElement = pageNodes[i].querySelector("div.MuiPaper-root > div > img");
        const button = document.querySelector('.dl-button');
        if (imgElement === null) {
            pageNodes[i].scrollIntoView(true);
            observer.observe(pageNodes[i], config);
            return;
        }
        observer.disconnect();
        let url = imgElement.src;
        if (i === 0) {
            const width = imgElement.naturalWidth;
            const height = imgElement.naturalHeight;

            const orientation = width > height ? 'l' : 'p';
            doc = jspdf.jsPDF({
                orientation,
                unit: "px",
                format: [width, height]
            });
        }
        let imgProp = doc.getImageProperties(url);
        doc.addImage(imgProp.data, 'JPEG', 0, 0, imgProp.width, imgProp.height);
        button.innerText = `${i + 1} pages loaded out of ${pageNodes.length - 1}`;
        i++;
        if (i >= pageNodes.length - 1) {
            let titleElement = document.querySelector("head > title");
            const filename = sanitize(titleElement.innerText || 'notes', '_');
            doc.save(filename);

            return;
        }
        doc.addPage();
        main();
    }

    function randomScroll() {
        const button = document.querySelector('.dl-button');
        const handler = setInterval(() => {
            let scrollLen = -window.innerHeight;
            reader.scrollBy(0, scrollLen);
            if (i === (pageNodes.length - 1)) {
                clearInterval(handler);
                button.innerHTML = `
                <div class="plugin-flex">
                    <div class="check"></div>
                    <div style="margin-left:9px">Downloaded</div>
                </div>
                `
                setTimeout(() => {
                    button.innerText = 'Download';
                }, 3000)
            }
        }, 1000)
    }

    function buttonClicked() {
        const button = document.querySelector('.dl-button');
        i = 0;

        button.innerText = 'Loading please wait...';
        //setTimeout(() => {
        reader = document.querySelector("main");
        pageNodes = reader.querySelector("div").children;
        reader.scroll(0, 0);
        main();
        randomScroll();
        // }, 1000);
    }

    function constructButton() {



        inserted = true;
        const dom = document.querySelector('body');
        const button = document.createElement('button');
        //clean this
        button.style.display = "flex";
        button.setAttribute('class', 'dl-button');
        button.innerHTML = `
            <div>Download PDF</div>
            `;
        button.onclick = buttonClicked;
        dom.appendChild(button);


    }

    // A helper to listen for params change
    (function (history) {
        var pushState = history.pushState;
        history.pushState = function (state) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({ state: state });
            }
            return pushState.apply(history, arguments);
        };
    })(window.history);

    if ((/\breading=true\b/.test(location.search))) {
        // GM_log("triggered")
        constructButton();
    }

    window.onpopstate = history.onpushstate = () => {
        if (!(/\breading=true\b/.test(location.search))) {
            if (!inserted) {
                constructButton();
            }
            document.querySelector('.dl-button').style.display = 'flex';
            //GM_log("triggered")
        }
        else {
            if (inserted) {
                document.querySelector('.dl-button').style.display = 'none';
            }
        }
    }
})();
