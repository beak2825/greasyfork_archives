// ==UserScript==
// @name         CSDN 一键复制
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  一键复制CSDN代码块
// @author       Hz
// @match        blog.csdn.net/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381325/CSDN%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/381325/CSDN%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var codes = document.getElementsByTagName('pre');
    var timer = null;

    for(var i=0;i<codes.length;i++) {
        var block = codes[i];
        var btn = document.createElement('div');
        btn.style.position = 'absolute';
        btn.style.right = '100px';
        btn.style.top = '4px';
        btn.style.fontSize = '12px';
        btn.style.color = '#4d4d4d';
        btn.style.backgroundColor = 'white';
        btn.style.padding = '2px 8px';
        btn.style.margin = '8px';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05)';
        btn.innerText = '一键复制';
        block.appendChild(btn);
        btn.onclick = (function(index){
            return function(){
                copyCode(index)
            }
        })(i)
    }

    function copyCode(blockIndex) {
        var str = codes[blockIndex].children[0].innerText;
        var result = false;
        var saveString = function(e){
            e.clipboardData.setData('text/plain', str);
            e.preventDefault();
        }
        document.addEventListener('copy', saveString);
        result = document.execCommand('copy');
        document.removeEventListener('copy', saveString);
        var btn = codes[blockIndex].children[codes[blockIndex].children.length - 1];
        btn.innerText = '已复制';
        if(timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(function(){
            btn.innerText = '一键复制';
            clearTimeout(timer);
            timer = null;
        }, 3000);
        return result;
    }


    var masks = document.querySelectorAll('.hide-article-box')
    for(var m=0;m<masks.length;m++){
        masks[m].parentElement.removeChild(masks[m]);
    }
    var articleContent = document.getElementById('article_content');
    if(articleContent) {
        articleContent.style.height = 'auto';
    }
})();