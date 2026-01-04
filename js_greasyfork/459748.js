// ==UserScript==
// @name         百度网盘文件列表名称提取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可提取百度网盘文件名称列表 支持一键复制与数量统计
// @author       Yanan
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at document-start
// @match https://pan.baidu.com/disk/main*
// @match https://pan.baidu.com/s/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459748/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8%E5%90%8D%E7%A7%B0%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459748/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8%E5%90%8D%E7%A7%B0%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyToClip(content, message) {
        var aux = document.createElement("textarea");
        aux.value = content;
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        if (message == null) {
            alert("复制成功");
        } else{
            alert(message);
        }
    }

    const showResult = (str, list) => {
        const div = document.createElement('DIV');
        div.style.cssText = 'position: fixed; right:0; bottom: 0; height: 60vh; width: 30vw; display:flex; flex-direction: column; background: #fff; border: 2px dashed blue; z-index: 100000;'
        const textArea = document.createElement('TEXTAREA');
        textArea.style.cssText = 'width:100%; flex: 1; font-family: Arial; ';
        const statics = document.createElement('DIV');
        statics.style.cssText = 'display: flex; align-items: center; height: 30px; border-bottom: 1px solid #ccc; flex-shrink:0;';
        statics.innerHTML = '共计：' + list.length + '条，请核对！！';
        textArea.value = str;
        const copy = document.createElement('BUTTON');
        copy.innerHTML= '复制';
        copy.style.cssText = 'position:absolute; right:20px;top:4px;'
        copy.addEventListener('click', () => {
            copyToClip(str);
        })
        div.appendChild(statics);
        div.appendChild(textArea);
        div.appendChild(copy);
        document.body.appendChild(div);
    }

    // Your code here...
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        console.log(url)
        if (url.includes('api/list') || url.includes('share/list')) {
            console.log('started to work', url);
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    try {
                    const r = typeof this.response === 'string' ? JSON.parse(this.response) : this.response;
                    const listStr = r.list.map(e => e.server_filename).join('\n');
                    showResult(listStr,r.list);
                    } catch(e) {
                        console.log('插件解析错误',e);
                    }
                }
            });
        }
        originOpen.apply(this, arguments);
    };
})();