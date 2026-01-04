// ==UserScript==
// @name          腾讯文档自动化任务扩展
// @namespace    http://tampermonkey.net/
// @description  腾讯文档自动化任务扩展,looom相关人员使用,他人无用
// @author       looom
// @match        https://docs.qq.com/form/page/*
// @icon         https://docs.gtimg.com/docs-design-resources/mobile/png@3x/file_form_64@3x-4be590ebf1.png
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license MIT
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/491634/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E5%8C%96%E4%BB%BB%E5%8A%A1%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/491634/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E5%8C%96%E4%BB%BB%E5%8A%A1%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==


// 解锁编辑框
function unlock_edit(){
    const textAreas = document.getElementsByTagName("textarea");
    for (let i = 0; i < textAreas.length; i++) {
        textAreas[i].disabled = false;
        textAreas[i].setAttribute("spellcheck", "true");
    }
}


// 显示隐藏表格
function Form(){
    let isshow=false
    let cookie=document.cookie;
    let form=document.createElement("div");
    form.id="form";
    let form_style={
        "background-color": "rgba(254, 249, 245, 0.5)",
        "display": "flex",
        "position": "fixed",
        "flex-direction": "column",
        "justify-content": "space-around",
        "font-size": "x-large",
        "width": "50px",
        "height": "50px",
        "z-index": "10",
        "left": "3%",
        "top": "3%",
        "padding-top": "40px",
        "border": "#000 solid 1px",
        "border-radius": "20px",
        "overflow": "hidden",
        "transition": "0.5s"
    }
    Object.assign(form.style, form_style)
    // 窗口拖动
    form.onmousedown = function(event) {
        let offsetX = event.clientX - form.offsetLeft;
        let offsetY = event.clientY - form.offsetTop;
        document.onmousemove = function(event) {
            let x = event.clientX;
            let y = event.clientY;
            form.style.left = x - offsetX + 'px';
            form.style.top = y - offsetY + 'px';
        }
        document.onmouseup = function() {
            document.onmousemove = null;
        }
    }
    let logo=document.createElement("div")
    logo.id="logo"
    let logo_style={
        "width": "50px",
        "height": "50px",
        "padding": "10px",
        "background-color": "#57606f",
        "border-radius": "10px",
        "position": "absolute",
        "transition": "0.5s",
        "top": 0
    }
    logo.innerHTML='<svg width="30px" height="30px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 10px; left: 10px"><path d="M44 4H4V44H44V4Z" fill="#fff" stroke="#000" stroke-width="4" stroke-linejoin="bevel"/><path d="M16 4V16H4" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="bevel"/><path d="M36 24V36H24" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="bevel"/><path d="M36 36L24 24" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="bevel"/><path d="M4 6V26" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="bevel"/><path d="M7 4H27" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="bevel"/></svg>'
    Object.assign(logo.style, logo_style)
    logo.addEventListener("click", ()=>{
        isshow=!isshow
        if(isshow){
            form.style.width="40%"
            form.style.height="auto"
            logo.style.rotate="180deg"
        } else {
            Object.assign(form.style, form_style)
            logo.style.rotate="0deg"
        }
    })
    form.appendChild(logo)
    let div1=document.createElement("div")
    let div1_p=document.createElement("div")
    div1_p.innerText="你的cookie为:"
    let div1_textarea=document.createElement("textarea")
    div1_textarea.value=document.cookie
    div1_textarea.setAttribute("readonly","true")
    let div1_textarea_style={
        "min-width": "100%",
        "max-width": "100%",
        "min-height": "1.5em"
    }
    div1.appendChild(div1_p)
    div1.appendChild(div1_textarea)
    Object.assign(div1_textarea.style,div1_textarea_style)
    div1.style="display:  flex; flex-direction: column"
    form.appendChild(div1)
    let div2=document.createElement("div")
    let div2_p=document.createElement("div")
    div2_p.innerText="输入网站提供的id:"
    let div2_input=document.createElement("input")
    div2_input.setAttribute("placeholder","在此处输入id")
    div2_input.id="user_id"
    div2.style="display:  flex; flex-direction: column"
    div2.appendChild(div2_p)
    div2.appendChild(div2_input)
    form.appendChild(div2)
    let div3=document.createElement("div")
    let div3_btn1=document.createElement("input")
    let div3_btn2=document.createElement("input")
    let div3_style={
        "display": "flex",
        "flex-direction": "row",
        "justify-content": "space-around"
    }
    Object.assign(div3.style,div3_style)
    let div3_btn1_style={
        "color": "#FFF",
        "background-color": "#1E6FFF",
        "color": "#FFF",
        "padding": "10px"
    }
    div3_btn1.value="提交"
    div3_btn2.value="取消"
    div3_btn1.type="button"
    div3_btn2.type="button"
    div3_btn2.style.padding="10px"
    Object.assign(div3_btn1.style,div3_btn1_style)
    div3_btn1.id="submit"
    div3_btn2.id="cancel"
    div3_btn1.addEventListener("click", ()=>{
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://121.40.92.198:8080?upcookie",
            headers: {"Content-Type" : "application/json"},
            data: JSON.stringify({"id":div2_input.value,"cookie":document.cookie}),
            timeout: 5000,
            onload: function(res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    alert(text)
                    console.log(json);
                } else {
                    alert("失败: " + res)
                }
            },
            onerror: function(res){
                console.error(res)
                alert("无法连接到服务器")
            }
        });
    })
    div3_btn2.addEventListener("click",()=>{
        isshow=!isshow
        Object.assign(form.style, form_style)
        logo.style.rotate="0deg"
    })
    div3.appendChild(div3_btn1)
    div3.appendChild(div3_btn2)
    form.appendChild(div3)
    document.body.appendChild(form)
    for(let i of document.querySelectorAll("#form>div")){i.style.padding="20px"}

}


(function() {
    'use strict';

    // Your code here...
    unlock_edit()
    Form()
    //alert(cookie)
})();