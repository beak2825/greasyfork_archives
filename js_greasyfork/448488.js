// ==UserScript==
// @name         编程猫防屏蔽防吃格式助手
// @namespace    https://shequ.codemao.cn/user/201649362
// @version      2.0.0
// @description  编程猫发帖防屏蔽防吃格式
// @author       SMYLuke
// @match        https://shequ.codemao.cn/community
// @match        https://shequ.codemao.cn/community/
// @match        https://shequ.codemao.cn/community?board=*
// @icon         https://static.codemao.cn/whitef/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448488/%E7%BC%96%E7%A8%8B%E7%8C%AB%E9%98%B2%E5%B1%8F%E8%94%BD%E9%98%B2%E5%90%83%E6%A0%BC%E5%BC%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/448488/%E7%BC%96%E7%A8%8B%E7%8C%AB%E9%98%B2%E5%B1%8F%E8%94%BD%E9%98%B2%E5%90%83%E6%A0%BC%E5%BC%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

onload = async () => {
    'use strict';
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css";
    document.head.appendChild(link);
    var doNotShield = {
        width: 640,
        height: 480,
        run: async () => {
            const content = document.querySelector(textarea).contentDocument.body;
            const data = encodeURI(`<link href="https://static.codemao.cn/community/prism/prism.min.css" rel="stylesheet" type="text/css" />${content.innerHTML}`);
            GM_xmlhttpRequest({
                method: "post",
                url: "https://static.box3.codemao.cn/block",
                data: data,
                binary: true,
                async onload({ response }) {
                    document.querySelector(textarea).contentDocument.body.innerHTML = `<iframe src="//box3statichelper.pythonanywhere.com/hash.html?hash=${JSON.parse(response).Key}" style="width: ${doNotShield.width}px; height: ${doNotShield.height}px; display: block; margin: 40px auto; max-width: 100%;"></iframe>`;
                },
            });
        }}
    const textarea = "#react-tinymce-0_ifr";
    document.querySelector("#root > div > div.r-index--main_cont > div > div.r-community--right_search_container > div > div.r-community--search_header > a.r-community--send_btn").addEventListener("click", () => {
        window.gui = new lil.GUI({title: "编程猫防屏蔽防吃格式助手"});
        window.gui.domElement.style.top = "unset";
        window.gui.domElement.style.bottom = "0";
        window.gui.domElement.style.userSelect = "none";
        window.gui.add(doNotShield, "width", 10, 1000, 10).name("宽度（px）");
        window.gui.add(doNotShield, "height", 10, 1000, 10).name("高度（px）");
        window.gui.add(doNotShield, "run").name("使用防屏蔽功能");
    });
    document.querySelector("#root > div > div.r-index--main_cont > div > div:nth-child(4) > div > div.c-model_box--content_wrap > div > a").addEventListener("click", () => {
        window.gui.destroy();
    });
};
