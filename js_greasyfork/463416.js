// ==UserScript==
// @name         JSON Selector
// @namespace    https://openuserjs.org/users/SkyedBlue
// @version      1.2
// @description  Select a JSON string and display it in a formatted way.
// @author       Skyed_blue
// @license      OSI-SPDX-Short-Identifier
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @icon         http://t13.baidu.com/it/u=3464717519,1631837546&fm=224&app=112&f=JPEG?w=500&h=500
// @downloadURL https://update.greasyfork.org/scripts/463416/JSON%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/463416/JSON%20Selector.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const css = `
    #text-box-D {
        width: 64%; /* max-width: 64%; */
        word-wrap: break-word; /* 支持换行 */
        overflow: auto; /* 显示滚动条 */
        height: 90%; /* 固定高度 */
        z-index: 99999;
        display: none; /* 初始状态下隐藏文本展示框D */
        position: fixed; /* 设置文本展示框D的定位方式为绝对定位 */
        white-space: pre-wrap;  /* 支持换行 */
        left: 16%;
        top: 50px; /* 设置文本展示框D距离网站顶部50px的位置 */
        padding: 20px; /* 设置文本展示框D的边距 */
        border-radius: 10px; /* 设置文本展示框D的圆角 */
        box-shadow: 0 2px 2px rgba(0,0,0,0.1); /* 设置文本展示框D的阴影 */
        background-color: #fff; /* 设置文本展示框D的背景颜色 */
        font-size: 16px; /* 设置文本展示框D的字体大小 */
        line-height: 1.5; /* 设置文本展示框D的行高 */
        text-align: justify; /* 设置文本展示框D的文本对齐方式 */
    }

    /* Overlay style */
    #overlay {
            position: fixed;
            display: none;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.70);
            z-index: 99998;
        }

    .fade-in {
        animation: fade-in 0.15s ease-in-out;
    }

    .fade-out {
        animation: fade-out 0.15s ease-in-out;
    }

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fade-out {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    .string { color: #3ab54a; font-weight: bold; }
    .number { color: #25aae2; font-weight: bold; }
    .boolean { color: #f1592a; font-weight: bold; }
    .null { color: #f1592a; font-weight: bold; }
    .key { color: #92278f; font-weight: bold; }
    `

    var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));

    var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}

    var textBoxDDom = document.createElement('div');
    textBoxDDom.id = 'text-box-D';
    document.body.appendChild(textBoxDDom);

    var overlayDom = document.createElement('div');
    overlayDom.id = 'overlay';
    document.body.appendChild(overlayDom);




    function getJSON(str) {
        let stack = [];
        let res = [];
        for(let i = 0;i < str.length;i++)
        {
            if(str[i] === "{" || str[i] === "[") {
                stack.push(i);
            }
            if(str[i] === "}"|| str[i] === "]") {
                if (stack.length <= 0) {
                    continue;
                }
                let idx = stack.pop()
                if (stack.length <= 0) {
                    res.push(str.substring(idx, i+1));
                }
            }
        }
        return res
    }

    // num to str
    let numMp = new Map()

    function getNumMp(json) {
        let numbers = json.match(/\d+/g);
        numbers.forEach(num => {
        let key = parseInt(num);
        numMp.set(key, num);
        });
        return numMp;
    }

    function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        if(cls == 'number') {
            match = numMp.get(parseInt(match))
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

    const textBoxD = document.getElementById("text-box-D");
    const overlay = document.getElementById("overlay");
    let flag = true;

    function showTextBox() {
        textBoxD.classList.add("fade-in");
        textBoxD.style.display = "block";
			document.getElementById("overlay").classList.add("fade-in");
			overlay.style.display = "block";
		}

    function hideTextBox() {
        textBoxD.classList.remove("fade-in");
        textBoxD.classList.add("fade-out");
        overlay.classList.remove("fade-in");
        overlay.classList.add("fade-out");
        setTimeout(function() {
            textBoxD.style.display = "none";
            textBoxD.classList.remove("fade-out");
            overlay.style.display = "none";
            overlay.classList.remove("fade-out");
        }, 150);
    }

    document.addEventListener("mouseup", function(e) { /* 在文字展示框B上监听鼠标抬起事件 */
        if (textBoxD.contains(e.target)) {
            return;
        }

        const selectedText = window.getSelection().toString(); /* 获取当前选择的文本 */

        if (!flag || selectedText.length <= 0) {
            flag = true;
            return;
        }

        let jsonList = getJSON(selectedText);
        if (jsonList.length <= 0) {
            return;
        }

        let hasJson = false;
        for(let i = jsonList.length-1;i >= 0;i--) {
            let jsonStr = jsonList[i]
            try {
                getNumMp(jsonStr);
                let jsonObj = JSON.parse(jsonStr);
                textBoxD.innerHTML = syntaxHighlight(JSON.stringify(jsonObj, null, 8));
                hasJson = true;
                break;
            } catch {
                continue;
            }
        }
        if(hasJson){
            document.addEventListener("mousedown", function(e) { /* 在文档中监听鼠标抬起事件 */
                if (textBoxD.style.display === "block" && !textBoxD.contains(e.target)) { /* 如果文本展示框D正在显示 */
                    hideTextBox();
                }
            });
            showTextBox();
        }

        flag = false;
    });
})();