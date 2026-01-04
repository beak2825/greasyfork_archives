// ==UserScript==
// @name         EFZ刷课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  别指望用它完成作业！
// @author       EFZer
// @match        http://course.hsefz.cn/course/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/446023/EFZ%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/446023/EFZ%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

var button=document.createElement('button')
button.textContent="刷课"
var nav=document.getElementsByClassName('nav-tabs')[0]
nav.appendChild(button)
button.addEventListener("click", finish)
function finish(){
var lessons=document.getElementsByClassName('lesson-item')
var lens=lessons.length
for (let i=0;i<lens;i++){
    var id=lessons[i].getAttribute('data-id')
    var url=location.href+'/lesson/'+id+'/learn/finish'
    GM_xmlhttpRequest({method: 'POST',url: url,headers: {'X-CSRF-Token': 'f62dd28fc13dc9dc82da87a3462df846362ee8b7','X-Requested-With': 'XMLHttpRequest'}})
}
    location.reload()
    alert('已完成！有作业的话自己去写哦')
}

