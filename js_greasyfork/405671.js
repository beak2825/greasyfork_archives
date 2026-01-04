// ==UserScript==
// @name         Zebra
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  try to take over the world!
// @author       HolmesZhao
// @match        *://autotrack.zuoyebang.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405671/Zebra.user.js
// @updateURL https://update.greasyfork.org/scripts/405671/Zebra.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function addButton(name, marginLeft, fun) {
        var txt = document.createTextNode(name);
        var btn = document.createElement('button');
        btn.className = 'mmbutton';
        btn.style = "z-index: 9999; font-size: large; position: fixed; top: 0pt; left: "+(screen.width / 4 + marginLeft)+"px;";
        btn.onclick = fun;
        btn.appendChild(txt);
        document.body.appendChild(btn);
        return btn.offsetWidth;
    };

    function getAll() {
        let trDoms = document.getElementsByTagName('tbody')[0].children;
        let all = [];
        for (let i = 0; i < trDoms.length; i++) {
            const tr = trDoms[i];
            let chooseNext = tr.children[5].textContent == "--";
            if (chooseNext) {
                continue;
            }
            let name = tr.children[0].textContent;
            let description = tr.children[1].textContent;
            let isTap = description.indexOf('点击') != -1
            let type = isTap ? "点击" : "展现";
            let code = "// ";
            let res = "";
            description = "/// " + description;
            switch (type) {
                case "点击":
                    code += ("[MMEventTool postOpKey:MMEventOpKey" + name + "];");
                    break;
                case "展现":
                    code += ("[MMEventTool postStateKey:MMEventOpKey" + name + "];");
                    break;
                default:
                    break;
            }
            name = "static MMEventOpKey MMEventOpKey" + name + " = @\"" + name + "\";";

            res += description;
            res += "\n";
            res += name;
            res += "\n";
            res += code;

            all.push(res);
        }
        let copy_text = all.join("\n\n");
        let titleDom = document.getElementsByClassName('app-container__header')[0];
        let titleInnerHtml = titleDom.innerHTML;
        titleDom.innerHTML = titleInnerHtml + "<textarea id=\"getAllCopy\" style=\"opacity: 0;position:absolute;\">" + copy_text + "</textarea>";
        var element = document.getElementById("getAllCopy");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
    }

    function getSwiftAll() {
        let trDoms = document.getElementsByTagName('tbody')[0].children;
        let all = [];
        for (let i = 0; i < trDoms.length; i++) {
            const tr = trDoms[i];
            let chooseNext = tr.children[4].textContent == "待实现";
            if (!chooseNext) {
                continue;
            }
            let name = tr.children[0].textContent;
            let description = tr.children[1].textContent;
            let isTap = description.indexOf('点击') != -1
            let type = isTap ? "点击" : "展现";
            let code = "// ";
            let res = "";
            description = "/// " + description;
            switch (type) {
                case "点击":
                    code += ("MMEventTool.postOpKey(MMEventKey." + name + ")");
                    break;
                case "展现":
                    code += ("MMEventTool.postStateKey(MMEventKey." + name + ")");
                    break;
                default:
                    break;
            }
            name = "static let " + name + ": String = \"" + name + "\"";

            res += description;
            res += "\n";
            res += name;
            res += "\n";
            res += code;

            all.push(res);
        }
        let copy_text = all.join("\n\n");
        let titleDom = document.getElementsByClassName('app-container__header')[0];
        let titleInnerHtml = titleDom.innerHTML;
        titleDom.innerHTML = titleInnerHtml + "<textarea id=\"getAllCopy\" style=\"opacity: 0;position:absolute;\">" + copy_text + "</textarea>";
        var element = document.getElementById("getAllCopy");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
    }

    function inject() {
        // getAll();
        getSwiftAll();
        alert('已复制所有埋点');
    }

    window.onload = () => {
        addButton('注入脚本', 0, inject);
    }
})();