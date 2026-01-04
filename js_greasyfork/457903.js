// ==UserScript==
// @name         Bilibili Markdown ++
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  为B站专栏增加markdown解析功能；一次编写，到处发表！
// @author       You
// @match      https://member.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @resource css https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.css
// @require    https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js
// @run-at     document-end
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/457903/Bilibili%20Markdown%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/457903/Bilibili%20Markdown%20%2B%2B.meta.js
// ==/UserScript==

(function () {
    'use strict'
    const document = unsafeWindow.document
    const window = unsafeWindow
    setTimeout(()=>{
        if (window.location.href.indexOf("upload/text/edit") > -1 ) {
            log(window.document.querySelector("#edit-article-box > div > iframe"))
        }
        if (window.location.href.indexOf("article-text/home?aid") > -1) {

            createBox().then((divE) => {
                appendBox(divE)
                addBothStyle()
            }).then(()=>{
                moveIt(findId('buttonsBox'),findId('topDiv'))
                convert2BiliEvent()
                convert2BiliEvent_add()
                MarkdownOLEvent()
                ReadmeEvent()
            }).then((md)=>{
            })
        }
    },500)

    function getb(){}
    function addTextEvent(){
        document.getElementById('formMat').addEventListener('click',()=>{
            getMdValue()
        })
    }
    function md2Html(md) {
        let converter = new showdown.Converter()
        converter.setOption('tables', true)
        let md_html = converter.makeHtml(md)
        console.log(md);
        console.log(md_html);
        return md_html
    }
    function saveIt(){

        document.querySelector("#edit-page > div > div.btn-group.main-active-btn > button:nth-child(2)").click()
    }
    /////button////event////

    function convert2BiliEvent(){
        document.getElementById('upLoad').addEventListener('click',()=>{
            document.getElementById('ueditor_0').contentWindow.document.body.innerHTML=md2Html(getMdValue())
        })
    }
    function convert2BiliEvent_add(){
        document.getElementById('upLoadadd').addEventListener('click',()=>{
            document.getElementById('ueditor_0').contentWindow.document.body.innerHTML+=md2Html(getMdValue())
        })
    }
    function MarkdownOLEvent(){
        document.getElementById('preView').addEventListener('click',()=>{
            window.open('https://md.bigonion.cn','_blank');
        })
    }
     function ReadmeEvent(){
        document.getElementById('Readme').addEventListener('click',()=>{
            window.open('https://github.com/LiWeny16/Bilibili-markdown-/blob/main/README.md','_blank');
        })
    }
    /////button////event/////

    function getMdValue(){
        return document.getElementById('preViewMd').value
    }
    function getBiliValue(){
        return new Promise((resolve)=>{
            resolve(document.getElementById('ueditor_0').contentWindow.document.body.innerHTML)
        })
    }
    function appendBox(divE) {
        document.body.appendChild(divE)
    }
    function createBox() {
        return new Promise((resolve) => {
            var divE = document.createElement('div')
            var divId = document.createAttribute("id") //创建属性
            divId.value = 'topDiv' //设置属性值
            divE.setAttributeNode(divId) //给div添加属性
            divE.innerHTML = `
             <div id="buttonsBox">
               <button id="upLoad" class="UI-H5-Components-button">覆盖转换md为B站格式</button>
               <button id="upLoadadd" class="UI-H5-Components-button">添加转换</button>
               <button id="preView" class="UI-H5-Components-button">在线预览markdown</button>
               <button id="Readme" class="UI-H5-Components-button">用前必看</button>
             </div>
             <div id="textareaBox">
               <textarea name="1" id="preViewMd" cols="60" rows="6"></textarea>
             </div>
            `
            resolve(divE)
        })
    }
    function addBothStyle() {
        GM_addStyle(`
 #buttonsBox{
    cursor:move;
 }
 #topDiv{
    border-radius: 8px;
    padding: 4px 13px;
    margin-bottom: 9px;
    width: fit-content;
    translate: -20px;
    background: #ffffffcc;
    display: flex;
    flex-direction: column;
    position: fixed;
    border: solid;
    left: 588px;
    top: 30px;
    z-index: 9999;
    background: white;
    color: black;
}
.UI-H5-Components-button:hover{background:#dcdcdccc}.UI-H5-Components-button:active{background:#bdbdbdcc}.UI-H5-Components-button{background:transparent;border-radius:4px}
`)
    }

    ///////////函//////数//////库///////////
    /*
     *元素移动
     *parameter: controlEle,movedEle
     */
    function moveIt(controlEle, movedEle) {
        //var demo = document.getElementById(`${settings}`)
        var canitmove = false
        var x = 0,
            y = 0
        controlEle.onmousedown = function (e) {
            e.preventDefault()
            x = e.pageX - movedEle.offsetLeft
            y = e.pageY - movedEle.offsetTop
            canitmove = true
            //  console.log(e.pageX)
        }
        controlEle.onmouseup = function (e) {
            e.preventDefault()
            x = e.pageX - movedEle.offsetLeft
            y = e.pageY - movedEle.offsetTop
            canitmove = false
            //     console.log(e.pageX)
        }
        window.onmouseup = function () {
            canitmove = false
        }
        window.onmousemove = function (e) {

            if (canitmove) {
                movedEle.style.left = e.pageX - x + 'px'
                movedEle.style.top = e.pageY - y + 'px'
            }
        }
    }
    /*
     *寻找元素
     *parameter: id:string
     */
    function findId(id){
        return document.getElementById(id)
    }
    function findClass(className){
        return document.getElementsByClassName(className)
    }
    /*
    *获取、设置cookie
    *parameter: cname，cvalue，exdays
    */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
    /*
    *log函数
    */
    function logAdd(a){
        document.getElementById('preViewMd').value=a
    }
    function log(a){
        console.log(a)
    }
    ///////////函//////数//////库///////////
})()