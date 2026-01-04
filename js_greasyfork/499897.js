// ==UserScript==
// @name         HuggingFace下载列表获取
// @namespace    https://sfkgroup.github.io/
// @version      0.1
// @description  这是一个用于批量获取HuggingFace项目下载链接的脚本(以使用IDM类软件进行批量下载).
// @author       SFKgroup
// @match        https://huggingface.co/*/*/tree/main
// @match        https://hf-mirror.com/*/*/tree/main
// @grant        GM_log
// @icon         https://sfkgroup.github.io/images/favicon.ico
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/499897/HuggingFace%E4%B8%8B%E8%BD%BD%E5%88%97%E8%A1%A8%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/499897/HuggingFace%E4%B8%8B%E8%BD%BD%E5%88%97%E8%A1%A8%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {

    function createClickBox(box_id) {
        var e_1 = document.createElement("label");
        e_1.setAttribute("class", "custom-checkbox");
        var e_2 = document.createElement("input");
        e_2.setAttribute("type", "checkbox");
        e_2.setAttribute("name", "download_option");
        e_2.setAttribute("value", box_id);
        e_2.checked = true
        e_1.appendChild(e_2);
        var e_3 = document.createElement("span");
        e_3.setAttribute("class", "checkmark");
        e_1.appendChild(e_3);
        return e_1;
    }

    function createStyleNode() {
        var e_0 = document.createElement("style");
        e_0.setAttribute("type", "text/css");
        e_0.appendChild(document.createTextNode("\n.custom-checkbox input[type=\"checkbox\"] {\ndisplay: none; \n}\n\n.custom-checkbox .checkmark {\ndisplay: inline-block;\nwidth: 20px;\nheight: 20px;\nbackground: #eee;\nmargin-right: 8px;\nborder-radius: 4px;\nposition: relative;\n}\n\n.custom-checkbox input[type=\"checkbox\"]:checked + .checkmark:before {\ncontent: '';\nposition: absolute;\nleft: 7px;\ntop: 3px;\nwidth: 6px;\nheight: 10px;\nborder: solid #000;\nborder-width: 0 2px 2px 0;\ntransform: rotate(45deg);\n}\n"));
        return e_0;
    }


    function createAndDownloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    function getCheckedBoxes() {
        var checkboxes = document.getElementsByName('download_option');
        var selected = "";

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                selected += window.location.origin + table.children[checkboxes[i].value].children[1].getAttribute('href').split('?')[0] + '\n';
            }
        }

        console.log(selected);
        createAndDownloadFile('download_urls.txt', selected);
    }

    function createDownloadButton() {
        var e_0 = document.createElement("button");
        e_0.setAttribute("class", "btn group mr-0 flex-grow-0 cursor-pointer rounded-full ");
        var e_1 = document.createElement("span");
        e_1.setAttribute("class", "group-hover:underline");
        e_1.appendChild(document.createTextNode("Download Links"));
        e_0.onclick = getCheckedBoxes
        e_0.appendChild(e_1);
        return e_0;
    }

    var table = document.querySelector("body > div > main > div.container.relative.flex.flex-col.md\\:grid.md\\:space-y-0.w-full.md\\:grid-cols-12.space-y-4.md\\:gap-6.mb-16 > section > div:nth-child(4) > ul")

    for (let k = 0; k < table.children.length; k++) {
        let fatherbox = table.children[k].children[0].children[0]
        fatherbox.insertBefore(createClickBox(k), fatherbox.firstChild);
    }

    table.appendChild(createStyleNode())


    let tool_bar = document.querySelector("body > div > main > div.container.relative.flex.flex-col.md\\:grid.md\\:space-y-0.w-full.md\\:grid-cols-12.space-y-4.md\\:gap-6.mb-16 > section > header > div.mb-2.flex.w-full.items-center.md\\:w-auto")
    tool_bar.appendChild(createDownloadButton())

})();