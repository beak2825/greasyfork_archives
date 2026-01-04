// ==UserScript==
// @name         36dm下载链接提取
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  提取36dm网站的动漫列表的下载链接
// @author       ruanimal
// @match        http://www.36dm.club/*
// @match        https://www.36dm.club/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392505/36dm%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/392505/36dm%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {


'use strict';

function makeRequest(url, callBack) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = () => {
        if(httpRequest.readyState === 4){
            console.log('xxx')
            callBack(httpRequest.responseText)
        }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}

function copyText(content, callback){ // text: 要复制的内容， callback: 回调
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);

      textarea.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
      }
      document.body.removeChild(textarea);
    if(callback) {callback(content)}
}

document.todolist = Array()

var ul = document.createElement('div')
ul.style.position = 'fixed'
ul.style.top = '50px'
ul.style.right = '50px'
ul.style.width = '600px'

document.body.appendChild(ul)

var _btn = document.createElement('button')
_btn.style.position = 'fixed'
_btn.style.top = '20px'
_btn.style.right = '60px'
_btn.innerText = '点击复制'
_btn.onclick = () => {
    copyText(ul.innerText, ()=> {
        console.log(ul.innerText)
        alert('复制成功!')
    })
}
document.body.appendChild(_btn)

var _btn2 = document.createElement('button')
_btn2.style.position = 'fixed'
_btn2.style.top = '20px'
_btn2.style.right = '10px'
_btn2.innerText = '清除'
_btn2.onclick = () => {
    ul.innerHTML = "";
}
document.body.appendChild(_btn2)

var targets = document.querySelectorAll('#data_list > tr > td:nth-child(3) > a')
for (var i of targets) {
    var btn = document.createElement('span') ;
    btn.innerText = '提取链接'
    btn.dataset.url = i.href
    btn.dataset.clicked = ''
    btn.onclick = function () {
        if (this.dataset.clicked) {
            return
        }

        var t = this;
        console.log(this);
        t.style.color='#ddd';
        document.todolist.push(t.dataset.url);
        makeRequest(t.dataset.url, function(context) {
            var el = document.createElement('html');
            el.innerHTML = context
            let aaa = el.querySelector('#magnet')
            let url = aaa.href
            let title = el.querySelector('head > title').text
            // let url = aaa.href + "&dn=" + encodeURIComponent(title)
            for(var i = 0 ; i < 2; i++){
                var index = title.lastIndexOf(" - ");
                if(index > -1){
                    title = title.substr(0, index);
                }
            }
            if(title.length > 0){
                url += "&dn=" + title
            }
            ul.appendChild(document.createTextNode(url));
            ul.appendChild(document.createElement('br'));
        })
        this.dataset.clicked = '1'
    }
    i.parentNode.appendChild(btn);
}
})();
