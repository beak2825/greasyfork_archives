// ==UserScript==
// @name            P&D戰友網希石快速預覽
// @description     直接預覽寵物進化樹中所得到的希石的所用之處
// @icon            https://pad.skyozora.com/images/egg.ico
// @namespace       https://gist.github.com/ytjchan
// @author          ytjchan
// @version         1.1.0
// @grant           none
// @license         WTFPL
// @include         *://pad.skyozora.com/pets/*
// @downloadURL https://update.greasyfork.org/scripts/390384/PD%E6%88%B0%E5%8F%8B%E7%B6%B2%E5%B8%8C%E7%9F%B3%E5%BF%AB%E9%80%9F%E9%A0%90%E8%A6%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/390384/PD%E6%88%B0%E5%8F%8B%E7%B6%B2%E5%B8%8C%E7%9F%B3%E5%BF%AB%E9%80%9F%E9%A0%90%E8%A6%BD.meta.js
// ==/UserScript==

(function() {
    if (document.querySelectorAll(".evolution-stone").length !== 0) return;

    document.querySelectorAll(".tooltip[title*='希石']").forEach(el => {

        if (el.innerHTML.includes("left01.png") || el.innerHTML.includes("right01.png")) {
            return;
        }

        let container = document.createElement("span");
        container.setAttribute("class", "evolution-stone")
        container.setAttribute("style", "display: inline-block; background-color: #ababab; padding: 0.1em 0.5em;");
        el.appendChild(container);
        el.parentNode.insertBefore(container, el.nextSibling);
        container.appendChild(el);
        fetch(el.href)
        .then(res => res.text())
        .then(html => {
            let dummy = document.createElement("html");
            dummy.innerHTML = html;
            let targetTable = null;
            dummy.querySelectorAll("span").forEach(span => {
                targetTable = (span.innerHTML == "使用此素材進化的寵物")? span.parentNode.parentNode.parentNode: targetTable;
            });
            targetTable.querySelectorAll("a").forEach(a => {
                a.childNodes.forEach(img => {
                    img.src = img.getAttribute("data-original");
                    img.width = img.width*9/10;
                    img.height = img.height*9/10;
                    img.style = "";
                });
                container.appendChild(a);
            });
        });
    });
})();