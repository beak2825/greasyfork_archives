// ==UserScript==
// @name         琉璃神社★hash2link
// @version      0.2
// @description  将琉璃神社文章页面文本中独立成行的hash值转换成可点击的magnet链接，并在其右侧展示复制按钮
// @author       不愿透露姓名的lsp
// @license      MIT
// @match        *://*/wp/all/*
// @icon         https://www.llss.fan/favicon.ico
// @run-at       document-end
// @namespace https://greasyfork.org/users/158429
// @downloadURL https://update.greasyfork.org/scripts/423788/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E2%98%85hash2link.user.js
// @updateURL https://update.greasyfork.org/scripts/423788/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E2%98%85hash2link.meta.js
// ==/UserScript==

if (['liuli','llss','hacg'].some(hSLD => window.location.host.includes(hSLD))) {
    (function () {
        function changeHashToLink(node) {
            switch(node.nodeType) {
                case 1:
                    for (let i = node.childNodes.length - 1; i >= 0; i--) {
                        changeHashToLink(node.childNodes[i]);
                    }
                    break;
                case 3:
                    if (node.length == 40 || node.length == 41) {
                        if (node.textContent.match(/^\n?\w{40}\n?$/)) {
                            let injection = document.createElement("div");

                            injection.innerHTML = `<a id="maglink" href="magnet:?xt=urn:btih:${node.textContent.replace(/\n/g, "")}" target="_blank">${node.textContent}</a><span>&nbsp;</span><button id="copyButton" style="color:gray;background:transparent">复制链接 📋</button>`;
                            node.parentNode.insertBefore(injection, node);

                            let elcopyButton = document.getElementById("copyButton");
                            let elmaglink = document.getElementById("maglink");

                            elcopyButton.onclick = () => {navigator.clipboard.writeText(elmaglink.href).then(()=>{elcopyButton.textContent="操作成功 ✔️"},()=>{elcopyButton.textContent="操作失败 ❌"}).finally(setTimeout(()=>{elcopyButton.textContent="复制链接 📋"}, 1500))};
                            elmaglink.onclick = (e) => {console.log(e);window.open(elmaglink.href, '_blank ', `width=400, height=100, left==${e.clientX}, top=${e.clientY}`); return false};

                            node.parentNode.removeChild(node);
                        }
                    }
                    break;
            }
        }
        changeHashToLink(document.getElementsByClassName("entry-content")[0]);
    })();
}