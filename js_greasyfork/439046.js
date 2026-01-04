// ==UserScript==
// @name         jira dashbord copy summary
// @namespace    https://www.chancetop.com/
// @version      0.0.1
// @description  show a link to copu issue key & summary at dashboard page.
// @author       felix
// @match        https://wonder.atlassian.net/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439046/jira%20dashbord%20copy%20summary.user.js
// @updateURL https://update.greasyfork.org/scripts/439046/jira%20dashbord%20copy%20summary.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const matchStr = "https://wonder.atlassian.net/jira/dashboards"

    setInterval(() => {
        if (window.location.href.search(matchStr) == 0 && !document.querySelector('a.felix-style-exist')) {
            // all issue page.
            waitElementLoaded("table.aui.issue-table > tbody", function () {
                appenButton();
            })
        }
    }, 3000)

    function appenButton() {
        document.querySelectorAll(".issuerow td.issuetype").forEach(td => {
            td.appendChild(buildCopyButton())
        })
    }

    function buildCopyButton() {
        var a = document.createElement("a")
        a.setAttribute("class", "felix-style-exist")

        var span = document.createElement("span")
        span.setAttribute("role", "img")
        span.setAttribute("aria-label", "Give feedback")

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute("width", "22")
        svg.setAttribute("height", "22")
        svg.setAttribute("viewBox", "0 0 22 22")
        svg.setAttribute("focusable", "false")
        svg.setAttribute("role", "presentation")
        svg.setAttribute("felix-style", "doFunction")

        var g = document.createElementNS("http://www.w3.org/2000/svg", "g")
        g.setAttribute("fill", "currentColor")
        g.setAttribute("fill-rule", "evenodd")

        var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path1.setAttribute("d", "M12.856 5.457l-.937.92a1.002 1.002 0 0 0 0 1.437 1.047 1.047 0 0 0 1.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 0 1 .203 3.81l-2.903 2.852a2.646 2.646 0 0 1-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 0 0-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47")
        var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path2.setAttribute("d", "M11.144 19.543l.937-.92a1.002 1.002 0 0 0 0-1.437 1.047 1.047 0 0 0-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 0 1-.203-3.81l2.903-2.852a2.646 2.646 0 0 1 3.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 0 0 .357 6.82c1.893 1.517 4.695 1.226 6.422-.47")

        g.appendChild(path1)
        g.appendChild(path2)

        svg.appendChild(g)

        span.appendChild(svg)

        a.appendChild(span)

        svg.onclick = function (e) {
            var tr

            if (e.target.getAttribute("felix-style") == "doFunction") {
                tr = e.target.parentNode.parentNode.parentNode.parentNode
            } else {
                tr = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
            }

            var trChildNodes = tr.childNodes

            var key = trChildNodes[3]
            var keyText = key.childNodes[1].innerText

            var summary = trChildNodes[5]
            var summaryChildNodes = summary.childNodes
            var pNodes = summaryChildNodes[0].childNodes

            var a1Text = pNodes[1].innerText
            var a2Text = pNodes[3].innerText

            var res = keyText + " / " + a1Text + " " + a2Text;
            copyText(res)
        }
        return a
    }

    function waitElementLoaded(selector, func) {
        let timer = setInterval(() => {
            let element = document.querySelector(selector);
            if (element != null) {
                clearInterval(timer);
                func(element);
            }
        }, 500);
    }

    function copyText(content) {
        let fakeElem = document.createElement('textarea');
        // Move element out of screen horizontally
        fakeElem.style.position = 'absolute';
        fakeElem.style.left = '-9999px';
        fakeElem.style.fontSize = '12pt';
        // Reset box model
        fakeElem.style.border = '0';
        fakeElem.style.padding = '0';
        fakeElem.style.margin = '0';

        fakeElem.setAttribute('readonly', '');
        fakeElem.value = content;

        document.body.appendChild(fakeElem);
        fakeElem.select();
        document.execCommand('copy');
    }
})();