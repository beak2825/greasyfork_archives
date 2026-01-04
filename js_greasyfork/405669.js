// ==UserScript==
// @name         YApiScript
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  try to take over the world!
// @author       HolmesZhao
// @match        *://yapi.zuoyebang.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405669/YApiScript.user.js
// @updateURL https://update.greasyfork.org/scripts/405669/YApiScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var enumHeader = "MM";
    var app = 'mmj';

    // Your code here...
    function copyMMJText() {
        let note = document.getElementsByClassName('ant-col-8 colName')[0].innerText;
        let dom = document.getElementsByClassName('colValue')[1].getElementsByClassName('colValue')[1];
        if (dom == null) {
            dom = document.getElementsByClassName('colValue')[2].getElementsByClassName('colValue')[1];
        }
        let urlPath = dom.innerText;
        let urlPathDefine = 'kUrl' + urlPath.split('/').join('_');
        urlPathDefine = '#define ' + urlPathDefine + " @\"" + urlPath.split('/').slice(1).join('/') + "\"";
        urlPathDefine = "/// " + note + '\n' + urlPathDefine;
        // dom.innerText = urlPathDefine;
        document.getElementsByClassName('anticon anticon-copy interface-url-icon')[0].innerHTML = "<textarea id=\"copyText\" style=\"opacity: 0;position:absolute;\">" + urlPathDefine + "</textarea>";
        var element = document.getElementById("copyText");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        // let range = document.createRange();
        // range.selectNode(dom);
        // let selection = window.getSelection();
        // if(selection.rangeCount > 0) selection.removeAllRanges();
        // selection.addRange(range);
        // document.execCommand('copy');
        // setTimeout(() => {
        //     dom.innerText = urlPath;
        // }, 1000);
    }
    function copyStudyText() {
        let note = document.getElementsByClassName('ant-col-8 colName')[0].innerText;
        let dom = document.getElementsByClassName('colValue')[1].getElementsByClassName('colValue')[1];
                if (dom == null) {
            dom = document.getElementsByClassName('colValue')[2].getElementsByClassName('colValue')[1];
        }
        let urlPath = dom.innerText;
        let urlPathDefine = 'kUrl' + urlPath.split('/').join('_');
        //urlPathDefine = '#define ' + urlPathDefine + " @\"" + urlPath.split('/').slice(1).join('/') + "\"";
        urlPathDefine = 'static let ' + urlPathDefine + ": NetRequestUrls = \"" + urlPath.split('/').slice(1).join('/') + "\"";
        urlPathDefine = "/// " + note + '\n' + urlPathDefine;
        // dom.innerText = urlPathDefine;
        document.getElementsByClassName('anticon anticon-copy interface-url-icon')[0].innerHTML = "<textarea id=\"copyText\" style=\"opacity: 0;position:absolute;\">" + urlPathDefine + "</textarea>";
        var element = document.getElementById("copyText");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        // let range = document.createRange();
        // range.selectNode(dom);
        // let selection = window.getSelection();
        // if(selection.rangeCount > 0) selection.removeAllRanges();
        // selection.addRange(range);
        // document.execCommand('copy');
        // setTimeout(() => {
        //     dom.innerText = urlPath;
        // }, 1000);
    }

    function copyAll() {
        let trDoms = document.getElementsByTagName('tr');
        let defines = [];
        for (let index = 1; index < trDoms.length; index++) {
            const element = trDoms[index];
            let note = element.getElementsByTagName('td')[0].innerText;
            let urlPath = element.getElementsByTagName('td')[1].innerText;
            let urlPathDefine = 'kUrl_' + urlPath.split('/').slice(1).join('_');
            urlPathDefine = '#define ' + urlPathDefine + " @\"" + urlPath.split('/').slice(1).join('/') + "\"";
            urlPathDefine = "/// " + note + '\n' + urlPathDefine;
            defines.push(urlPathDefine);
        }
        let copy_text = defines.join('\n\n');
        let titleDom = document.getElementsByClassName('interface-title')[0];
        let titleInnerHtml = titleDom.innerHTML;
        titleDom.innerHTML = titleInnerHtml + "<textarea id=\"copyAllText\" style=\"opacity: 0;position:absolute;\">" + copy_text + "</textarea>";
        var element = document.getElementById("copyAllText");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
    }

    function enumCopy() {
        let trDoms = document.getElementsByTagName('tr');
        let enums = [];
        let enumType = enumHeader
        for (let i = 1; i < trDoms.length; i++) {
            const element = trDoms[i];
            let note = element.getElementsByTagName('td')[0].innerText;
            let urlPath = element.getElementsByTagName('td')[1].innerText;
            let string = "";
            let array = urlPath.split('/').slice(1);
            for (let j = 0; j < array.length; j++) {
                const obj = array[j];
                string += obj.charAt(0).toUpperCase() + obj.slice(1)
                if (j == 0 && i == 1) {
                    enumType += string
                }
            }
            let urlPathDefine = enumHeader + string + ',';
            urlPathDefine = "\t/// " + note + '\n' + '\t' + urlPathDefine;
            enums.push(urlPathDefine);
        }
        let copy_text = enums.join('\n');
        let enumStr = "typedef NS_ENUM(NSUInteger, " + enumType + "Type) {";
        enumStr += '\n';
        enumStr += copy_text;
        enumStr += '\n';
        enumStr += '};';
        let titleDom = document.getElementsByClassName('interface-title')[0];
        let titleInnerHtml = titleDom.innerHTML;
        titleDom.innerHTML = titleInnerHtml + "<textarea id=\"enumCopy\" style=\"opacity: 0;position:absolute;\">" + enumStr + "</textarea>";
        var element = document.getElementById("enumCopy");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
    }

    function enumSwitchCopy() {
        let trDoms = document.getElementsByTagName('tr');
        let enums = [];
        let enumType = enumHeader
        for (let i = 1; i < trDoms.length; i++) {
            const element = trDoms[i];
            let note = element.getElementsByTagName('td')[0].innerText;
            let urlPath = element.getElementsByTagName('td')[1].innerText;
            let string = "";
            let array = urlPath.split('/').slice(1);
            for (let j = 0; j < array.length; j++) {
                const obj = array[j];
                string += obj.charAt(0).toUpperCase() + obj.slice(1)
            }
            let urlPathDefine = enumHeader + string;
            urlPathDefine = "\tcase " + urlPathDefine + ':\n' + '\t\treturn kUrl_' + array.join('_') + ";";
            enums.push(urlPathDefine);
        }
        let header = "switch (self.reqType) {\n";
        let footer = "\n\tdefault:\n\t\treturn @\"\";\n}"
        let copy_text = enums.join('\n');
        let enumStr = header + copy_text + footer;
        let titleDom = document.getElementsByClassName('interface-title')[0];
        let titleInnerHtml = titleDom.innerHTML;
        titleDom.innerHTML = titleInnerHtml + "<textarea id=\"enumSwitchCopy\" style=\"opacity: 0;position:absolute;\">" + enumStr + "</textarea>";
        var element = document.getElementById("enumSwitchCopy");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
    }

    function changeApp() {
        let btn = document.getElementsByClassName('mmbutton')[0];
        let key = 'mbkj'
        app = localStorage.getItem(key)
        if (app == '' || app == null) {
            app = 'mmj'
        }
        switch (app) {
            case 'mmj':
                btn.innerText = '错题APP'
                localStorage.setItem(key, 'study');
                break;
            case 'study':
                btn.innerText = '喵喵机'
                localStorage.setItem(key, 'mmj');
                break;
            default:
                break;
        }
        app = localStorage.getItem(key)
    }

    function appName() {
        let key = 'mbkj'
        app = localStorage.getItem(key)
        if (app == '' || app == null) {
            app = 'mmj'
        }
        switch (app) {
            case 'mmj':
                return '喵喵机'
            case 'study':
                return '错题APP'
            default:
                return ""
        }
    }

    function addButton(name, marginLeft, fun) {
        var txt = document.createTextNode(name);
        var btn = document.createElement('button');
        btn.className = 'mmbutton';
        btn.style = "z-index: 9999; font-size: large; position: fixed; top: 0pt; left: " + (marginLeft) + "px;";
        btn.onclick = fun;
        btn.appendChild(txt);
        document.body.appendChild(btn);
        return btn.offsetWidth + btn.offsetLeft;
    };

    function inject() {
        var clickDom = document.getElementsByClassName('colValue')[1].getElementsByClassName('colValue')[1];
        if (clickDom == null) {
            clickDom = document.getElementsByClassName('colValue')[2].getElementsByClassName('colValue')[1];
        }
        if (clickDom) {
            clickDom.onclick = () => {
                switch (app) {
                    case "mmj":
                        copyMMJText()
                        break;
                    case "study":
                        copyStudyText()
                    default:
                        break;
                }
            }
            alert('注入成功');
        } else {
            copyAll();
            alert('已复制所有接口');
            addButton('复制枚举', 100, enumCopy);
            addButton('复制枚举Path', 200, enumSwitchCopy);
        }
    }

    window.onload = () => {
        var btnLeft = screen.width/5;
        var marginLeft = 30;
        btnLeft += marginLeft;
        btnLeft = addButton(appName(), btnLeft, changeApp);
        btnLeft += marginLeft;
        btnLeft = addButton('注入脚本', btnLeft, inject);
    }

})();


