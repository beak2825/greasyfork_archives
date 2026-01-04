// ==UserScript==
// @name       dm跳转环境
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description   悬浮到 username 跳转各种环境
// @author       刘士朋
// @match       https://web.innodealing.com/dashboard/
// @match       https://webqa.innodealing.com/dashboard/
// @match       https://web.uat.innodealing.com/dashboard/
// @match       https://webgamma.innodealing.com/dashboard/
// @match       https://webbeta.innodealing.com/dashboard/
// @match       https://webzeta.innodealing.com/dashboard/
// @icon         https://web.innodealing.com/dashboard/img/favicon/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480728/dm%E8%B7%B3%E8%BD%AC%E7%8E%AF%E5%A2%83.user.js
// @updateURL https://update.greasyfork.org/scripts/480728/dm%E8%B7%B3%E8%BD%AC%E7%8E%AF%E5%A2%83.meta.js
// ==/UserScript==

(function () {
    window.addEventListener("load", () => {
        setTimeout(()=>{
            let iframe = document.getElementById("new-dashboard-frame");
            if(!iframe){
                iframe = document.getElementsByClassName('new-dashboard-frame')[0]
            }
            var innerDoc = iframe?.contentDocument || iframe?.contentWindow.document;
            var element = innerDoc.getElementById("dm-matrix-header-global");

            const observer = registerObserver();

            observer.observe(element, {
                childList: true,
                subtree: true,
            });


        },500)

    });
})();

const createEnv = (function addEnv() {
    const env = {
        prod: "https://web.innodealing.com/dashboard/",
        qa: "https://webqa.innodealing.com/dashboard/",
        uat: "https://web.uat.innodealing.com/dashboard/",
        gamma: "https://webgamma.innodealing.com/dashboard/",
        zeta: "https://webzeta.innodealing.com/dashboard/",
        beta: "https://webbeta.innodealing.com/dashboard/",
        delta: "https://webdelta.innodealing.com/dashboard/",
        alpha: "https://webalpha.innodealing.com/dashboard/",
    };
    const Fragment = document.createDocumentFragment();
    Object.keys(env).forEach((keys) => {
        const li = document.createElement("li");
        li.className = "ant-dropdown-menu-item";
        li.innerText = keys;
        li.onclick = () => {
            window.location.href = env[keys];
        };
        Fragment.appendChild(li);
    });
    return (container) => {
        container.appendChild(Fragment);
    };
})();


function registerObserver() {
    const matrixObserver = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                for (const node of mutation.addedNodes) {
                    if (node.nodeName.toLocaleLowerCase() === "div") {
                        const ul = node.querySelector("ul.ant-dropdown-menu");
                        if (ul) {
                            createEnv(ul);
                            observer.disconnect();
                        }
                    }
                }
            }
        }
    });

    return matrixObserver;
}
