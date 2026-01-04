// ==UserScript==
// @name         百度AiStudio输出结果隐藏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Birkhoff
// @match        https://aistudio.baidu.com/*.ipynb
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411652/%E7%99%BE%E5%BA%A6AiStudio%E8%BE%93%E5%87%BA%E7%BB%93%E6%9E%9C%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/411652/%E7%99%BE%E5%BA%A6AiStudio%E8%BE%93%E5%87%BA%E7%BB%93%E6%9E%9C%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 以下为代码
    window.onload = function() {
        // 脚本变量
        window.birkhoff = {};
        // 循环检测
    	const outputUpdateInterval = setInterval(() => {
    		const outputs = document.getElementsByClassName('cc-output');
            window.birkhoff.outputs = outputs;
    		for (var i in outputs) {
    			const output = outputs[i];
    			if (output.birkhoff_marked) {
    				continue;
    			}
    			// 获取到目标的按钮
    			if (output && output.firstElementChild && output.firstElementChild.firstElementChild) {
	    			const button = output.firstElementChild.firstElementChild;
	    			button.onclick = () => {
	    				if (output.status === 'show' || !output.status) {
	    					output.lastElementChild.style = "display: none";
	    					output.status = 'hidden';
	    				} else {
	    					output.lastElementChild.style = "";
	    					output.status = 'show';
	    				}
	    			};
                    output.style = "border-top: 5px dashed black;";
	    			output.birkhoff_marked = 'marked';
    			}
    		}
    	}, 1000);

        const tags = document.getElementById('tab-notebook').parentElement;
        tags.onclick = () => {
            setTimeout(() => {
                const notebookTag = document.getElementById('tab-notebook');
                if (notebookTag.ariaSelected === 'true') {
                    window.birkhoff.floatButton.style['display'] = '';
                } else {
                    window.birkhoff.floatButton.style['display'] = 'none';
                }
            }, 50);
        };

        const floatButton = document.createElement('button');
        window.birkhoff.floatButton = floatButton;
        floatButton.innerText = '隐藏';
        floatButton.style = 'font-size: 20px; color: black; background-color: deepskyblue; position: absolute; right: 100px; bottom: 100px; height: 60px; width: 60px; border: 1px solid lightgray; border-radius: 50%;';
        floatButton.onclick = () => {
            for (var i in window.birkhoff.outputs) {
                const output = window.birkhoff.outputs[i];
                if (output && output.firstElementChild && output.firstElementChild.firstElementChild) {
                    const button = output.firstElementChild.firstElementChild;
                    if (floatButton.innerText === '隐藏' && (output.status === 'show' || !output.status)) {
                        button.click();
                    } else if (floatButton.innerText === '显示' && output.status === 'hidden') {
                        button.click();
                    }
                }
            }
            floatButton.innerText = floatButton.innerText === '隐藏' ? '显示' : '隐藏';
        };
        document.body.append(floatButton);
    }
})();