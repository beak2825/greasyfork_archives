// ==UserScript==
// @name         浏览器笔记本-NicoNote
// @name:zh-CN   浏览器笔记本-NicoNote
// @name:zh-TW   瀏覽器筆記本-NicoNote
// @name:en      Notebook in browser-NicoNote
// @namespace    https://github.com/ccr39/NicoNote
// @supportURL   https://greasyfork.org/zh-CN/scripts/521195-%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AC%94%E8%AE%B0%E6%9C%AC-niconote
// @supportURL   https://github.com/ccr39/NicoNote
// @version      1.1.1
// @description        一个可以应用于浏览器的笔记本脚本。轻量，方便，支持 Markdown 语法。高效的浏览器学习工具。
// @description:zh-CN  一个可以应用于浏览器的笔记本脚本。轻量，方便，支持 Markdown 语法。高效的浏览器学习工具。
// @description:zh-TW  一個可以應用於瀏覽器的筆記本腳本。輕量，方便，支持 Markdown 語法。高效的瀏覽器學習工具。
// @description:en     A Notebook script in browser.Lightweight、Convenient，Supports Markdown syntax.Efficient learning tool in browsers.
// @author       ccr39
// @match        *://*/*
// @icon         data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cmVjdCBpZD0ic3ZnXzUiIGhlaWdodD0iNTcxLjk5OTk4IiB3aWR0aD0iNTk2Ljk5OTk4IiB5PSItNDAuMzMzMzMiIHg9Ii02MS4wMDAwMSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDA3ZmZmIi8+CiAgPGcgc3Ryb2tlPSJudWxsIiBpZD0ic3ZnXzEiPgogICA8cGF0aCBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im51bGwiIGQ9Im00MDUuNTc4MzgsMTFsLTI5NC41NTAzNCwwYy0xMy43MzIxNSwwIC0yNC45MDM4MiwxMS41OTE1NiAtMjQuOTAzODIsMjUuODM5ODRsMCwzNi4xOTU4OGwtMTQuODE3NzcsMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N3M2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE0LjgxNzc3LDBsMCw1NS41OTI5OWwtMTQuODE3NzcsMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N3M2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE0LjgxNzc3LDBsMCw1NS41OTM5NGwtMTQuODE3NzcsMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N3M2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE0LjgxNzc3LDBsMCw1NS41OTM5NGwtMTQuODE3NzcsMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N3M2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE0LjgxNzc3LDBsMCw1NS41OTI5OWwtMTQuODE3NzcsMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N3M2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE0LjgxNzc3LDBsMCwzNi4xOTU4OGMwLDE0LjI0ODI4IDExLjE3MTY3LDI1LjgzOTg0IDI0LjkwMzgyLDI1LjgzOTg0bDI5NC41NTAzNCwwYzI0LjIzNDE4LDAgNDMuOTUwNjIsLTIwLjQ1NjU0IDQzLjk1MDYyLC00NS42MDI1NGwwLC0zOTguNzk0OTJjMCwtMjUuMTQ2IC0xOS43MTU1MiwtNDUuNjAyNTQgLTQzLjk1MDYyLC00NS42MDI1NHptMTYuMjc5NzIsNDQ0LjM5NzQ1YzAsOS4zMTM4MyAtNy4zMDIzNSwxNi44OTE2IC0xNi4yNzk3MiwxNi44OTE2bC0yOTEuNzgzMjUsMGwwLC0zMy4zMjQ3OGwxNC44MTc3NywwYzcuNjQwODYsMCAxMy44MzU0NSwtNi40Mjc0MiAxMy44MzU0NSwtMTQuMzU1NDdzLTYuMTk0NTksLTE0LjM1NTQ3IC0xMy44MzU0NSwtMTQuMzU1NDdsLTE0LjgxNzc3LDBsMCwtNTUuNTkyOTlsMTQuODE3NzcsMGM3LjY0MDg2LDAgMTMuODM1NDUsLTYuNDI3NDIgMTMuODM1NDUsLTE0LjM1NTQ3cy02LjE5NDU5LC0xNC4zNTU0NyAtMTMuODM1NDUsLTE0LjM1NTQ3bC0xNC44MTc3NywwbDAsLTU1LjU5Mzk0bDE0LjgxNzc3LDBjNy42NDA4NiwwIDEzLjgzNTQ1LC02LjQyNzQyIDEzLjgzNTQ1LC0xNC4zNTU0N3MtNi4xOTQ1OSwtMTQuMzU1NDcgLTEzLjgzNTQ1LC0xNC4zNTU0N2wtMTQuODE3NzcsMGwwLC01NS41OTM5NGwxNC44MTc3NywwYzcuNjQwODYsMCAxMy44MzU0NSwtNi40Mjc0MiAxMy44MzU0NSwtMTQuMzU1NDdzLTYuMTk0NTksLTE0LjM1NTQ3IC0xMy44MzU0NSwtMTQuMzU1NDdsLTE0LjgxNzc3LDBsMCwtNTUuNTkyOTlsMTQuODE3NzcsMGM3LjY0MDg2LDAgMTMuODM1NDUsLTYuNDI3NDIgMTMuODM1NDUsLTE0LjM1NTQ3cy02LjE5NDU5LC0xNC4zNTU0NyAtMTMuODM1NDUsLTE0LjM1NTQ3bC0xNC44MTc3NywwbDAsLTMzLjMyNDc4bDI5MS43ODMyNSwwYzguOTc2NDQsMCAxNi4yNzk3Miw3LjU3NjgyIDE2LjI3OTcyLDE2Ljg5MTZsMCwzOTguNzk0OTJ6IiBpZD0ic3ZnXzIiLz4KICAgPHBhdGggZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJudWxsIiBkPSJtMzY2LjU0NzY0LDQxMC4yNTMzM2wtNjUuOTk4OCwwYy03LjY0MDg2LDAgLTEzLjgzNTQ1LDYuNDI3NDIgLTEzLjgzNTQ1LDE0LjM1NTQ3czYuMTk0NTksMTQuMzU1NDcgMTMuODM1NDUsMTQuMzU1NDdsNjUuOTk4OCwwYzcuNjQwODYsMCAxMy44MzU0NSwtNi40Mjc0MiAxMy44MzU0NSwtMTQuMzU1NDdzLTYuMTk0NTksLTE0LjM1NTQ3IC0xMy44MzU0NSwtMTQuMzU1NDd6IiBpZD0ic3ZnXzMiLz4KICAgPHBhdGggZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJudWxsIiBkPSJtMzY2LjU0NzY0LDczLjAzNTcybC0xNjkuMTIwODksMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N2wwLDc3Ljg5NDY5YzAsNy45MjgwNSA2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE2OS4xMjA4OSwwYzcuNjQwODYsMCAxMy44MzU0NSwtNi40Mjc0MiAxMy44MzU0NSwtMTQuMzU1NDdsMCwtNzcuODk0NjljMCwtNy45MjgwNSAtNi4xOTQ1OSwtMTQuMzU1NDcgLTEzLjgzNTQ1LC0xNC4zNTU0N3ptLTEzLjgzNTQ1LDc3Ljg5NDY5bC0xNDEuNDQ5OTgsMGwwLC00OS4xODM3NWwxNDEuNDQ5OTgsMGwwLDQ5LjE4Mzc1eiIgaWQ9InN2Z180Ii8+CiAgPC9nPgogPC9nPgoKPC9zdmc+
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @exclude      https://www.bing.com/search*
// @license      GNU GPL-3.0
// @supportURL   https://github.com/ccr39/NicoNote
// @homepage     https://github.com/ccr39/NicoNote
// @require      https://unpkg.com/vditor/dist/index.min.js
// @require      https://unpkg.com/vditor@3.10.8/dist/js/i18n/zh_CN.js
// @run-at       document-idle
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/521195/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AC%94%E8%AE%B0%E6%9C%AC-NicoNote.user.js
// @updateURL https://update.greasyfork.org/scripts/521195/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AC%94%E8%AE%B0%E6%9C%AC-NicoNote.meta.js
// ==/UserScript==
GM_addStyle(`@import url('https://unpkg.com/vditor/dist/index.css');`);
(()=>{
    'use strict';
//-------------------------------------------------------------------------------------
    const nicoButton = document.createElement('div');
    const nicoIcon = document.createElement('img');
    nicoButton.id = "nicoBt";
    nicoIcon.id = "nicoIcon";
    nicoIcon.src = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cmVjdCBpZD0ic3ZnXzUiIGhlaWdodD0iNTcxLjk5OTk4IiB3aWR0aD0iNTk2Ljk5OTk4IiB5PSItNDAuMzMzMzMiIHg9Ii02MS4wMDAwMSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDA3ZmZmIi8+CiAgPGcgc3Ryb2tlPSJudWxsIiBpZD0ic3ZnXzEiPgogICA8cGF0aCBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im51bGwiIGQ9Im00MDUuNTc4MzgsMTFsLTI5NC41NTAzNCwwYy0xMy43MzIxNSwwIC0yNC45MDM4MiwxMS41OTE1NiAtMjQuOTAzODIsMjUuODM5ODRsMCwzNi4xOTU4OGwtMTQuODE3NzcsMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N3M2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE0LjgxNzc3LDBsMCw1NS41OTI5OWwtMTQuODE3NzcsMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N3M2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE0LjgxNzc3LDBsMCw1NS41OTM5NGwtMTQuODE3NzcsMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N3M2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE0LjgxNzc3LDBsMCw1NS41OTM5NGwtMTQuODE3NzcsMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N3M2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE0LjgxNzc3LDBsMCw1NS41OTI5OWwtMTQuODE3NzcsMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N3M2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE0LjgxNzc3LDBsMCwzNi4xOTU4OGMwLDE0LjI0ODI4IDExLjE3MTY3LDI1LjgzOTg0IDI0LjkwMzgyLDI1LjgzOTg0bDI5NC41NTAzNCwwYzI0LjIzNDE4LDAgNDMuOTUwNjIsLTIwLjQ1NjU0IDQzLjk1MDYyLC00NS42MDI1NGwwLC0zOTguNzk0OTJjMCwtMjUuMTQ2IC0xOS43MTU1MiwtNDUuNjAyNTQgLTQzLjk1MDYyLC00NS42MDI1NHptMTYuMjc5NzIsNDQ0LjM5NzQ1YzAsOS4zMTM4MyAtNy4zMDIzNSwxNi44OTE2IC0xNi4yNzk3MiwxNi44OTE2bC0yOTEuNzgzMjUsMGwwLC0zMy4zMjQ3OGwxNC44MTc3NywwYzcuNjQwODYsMCAxMy44MzU0NSwtNi40Mjc0MiAxMy44MzU0NSwtMTQuMzU1NDdzLTYuMTk0NTksLTE0LjM1NTQ3IC0xMy44MzU0NSwtMTQuMzU1NDdsLTE0LjgxNzc3LDBsMCwtNTUuNTkyOTlsMTQuODE3NzcsMGM3LjY0MDg2LDAgMTMuODM1NDUsLTYuNDI3NDIgMTMuODM1NDUsLTE0LjM1NTQ3cy02LjE5NDU5LC0xNC4zNTU0NyAtMTMuODM1NDUsLTE0LjM1NTQ3bC0xNC44MTc3NywwbDAsLTU1LjU5Mzk0bDE0LjgxNzc3LDBjNy42NDA4NiwwIDEzLjgzNTQ1LC02LjQyNzQyIDEzLjgzNTQ1LC0xNC4zNTU0N3MtNi4xOTQ1OSwtMTQuMzU1NDcgLTEzLjgzNTQ1LC0xNC4zNTU0N2wtMTQuODE3NzcsMGwwLC01NS41OTM5NGwxNC44MTc3NywwYzcuNjQwODYsMCAxMy44MzU0NSwtNi40Mjc0MiAxMy44MzU0NSwtMTQuMzU1NDdzLTYuMTk0NTksLTE0LjM1NTQ3IC0xMy44MzU0NSwtMTQuMzU1NDdsLTE0LjgxNzc3LDBsMCwtNTUuNTkyOTlsMTQuODE3NzcsMGM3LjY0MDg2LDAgMTMuODM1NDUsLTYuNDI3NDIgMTMuODM1NDUsLTE0LjM1NTQ3cy02LjE5NDU5LC0xNC4zNTU0NyAtMTMuODM1NDUsLTE0LjM1NTQ3bC0xNC44MTc3NywwbDAsLTMzLjMyNDc4bDI5MS43ODMyNSwwYzguOTc2NDQsMCAxNi4yNzk3Miw3LjU3NjgyIDE2LjI3OTcyLDE2Ljg5MTZsMCwzOTguNzk0OTJ6IiBpZD0ic3ZnXzIiLz4KICAgPHBhdGggZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJudWxsIiBkPSJtMzY2LjU0NzY0LDQxMC4yNTMzM2wtNjUuOTk4OCwwYy03LjY0MDg2LDAgLTEzLjgzNTQ1LDYuNDI3NDIgLTEzLjgzNTQ1LDE0LjM1NTQ3czYuMTk0NTksMTQuMzU1NDcgMTMuODM1NDUsMTQuMzU1NDdsNjUuOTk4OCwwYzcuNjQwODYsMCAxMy44MzU0NSwtNi40Mjc0MiAxMy44MzU0NSwtMTQuMzU1NDdzLTYuMTk0NTksLTE0LjM1NTQ3IC0xMy44MzU0NSwtMTQuMzU1NDd6IiBpZD0ic3ZnXzMiLz4KICAgPHBhdGggZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJudWxsIiBkPSJtMzY2LjU0NzY0LDczLjAzNTcybC0xNjkuMTIwODksMGMtNy42NDA4NiwwIC0xMy44MzU0NSw2LjQyNzQyIC0xMy44MzU0NSwxNC4zNTU0N2wwLDc3Ljg5NDY5YzAsNy45MjgwNSA2LjE5NDU5LDE0LjM1NTQ3IDEzLjgzNTQ1LDE0LjM1NTQ3bDE2OS4xMjA4OSwwYzcuNjQwODYsMCAxMy44MzU0NSwtNi40Mjc0MiAxMy44MzU0NSwtMTQuMzU1NDdsMCwtNzcuODk0NjljMCwtNy45MjgwNSAtNi4xOTQ1OSwtMTQuMzU1NDcgLTEzLjgzNTQ1LC0xNC4zNTU0N3ptLTEzLjgzNTQ1LDc3Ljg5NDY5bC0xNDEuNDQ5OTgsMGwwLC00OS4xODM3NWwxNDEuNDQ5OTgsMGwwLDQ5LjE4Mzc1eiIgaWQ9InN2Z180Ii8+CiAgPC9nPgogPC9nPgoKPC9zdmc+';
    var nicoButtonStyle =`position: fixed;
    left: ${window.innerWidth-80}px;
    top: 50px;
    width: 48px;
    height: 48px;
    border: 2px solid #D3D3D3;
    border-radius: 50%;
    background: rgb(0, 127, 255);
    z-index: 214700;
    text-align: center`;
    //用字符串写样式，给自己跪了。。。最后一个center后的;可写可不写
    //若在引号内换行，要在每行末加上\
    var nicoIconStyle = `height: 71%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    :hover{filter: brightness(0.7);`;
    //第一句表示依照浏览器边框定位，left与bottom定义位置，width与height定义长宽，border用于定义边框，border-radius用于实现圆形效果,z-index定义了元素的图层高度，设置一个很大的数字可以保证其置于其他图像上方。
    nicoButton.setAttribute("style",nicoButtonStyle);
    nicoIcon.setAttribute("style",nicoIconStyle);
    if (window.self === window.top) {
        document.querySelector("html").appendChild(nicoButton);
        nicoButton.appendChild(nicoIcon);
    }
    //setAttribute(,)可以改变元素属性，用来改变nicoButton的CSS样式
    nicoButton.addEventListener("mouseover", function () {//mouseover指的是鼠标移上去的事件
        nicoButton.style.width = "55px";
        nicoButton.style.height = "55px";//变大
        nicoButton.style.cursor = "pointer";//手指
    });
    nicoButton.addEventListener("mouseout", function () {//mouseout指的是鼠标移走的事件
        nicoButton.style.width = "48px";
        nicoButton.style.height = "48px";
        nicoButton.style.cursor = "";
    });
    var ifNicoNotDiv = true;
    letWeDrag(nicoButton,true);

    nicoButton.addEventListener("click", function () {
        if(ifNicoNotDiv){
            //用点击事件呼出编辑框,添加在 nicoBt 后面
            nicoButton.style.opacity="0.3";
            //透明化
            nicoNoteDiv.style.top = `${parseInt(nicoButton.style.top)}px`;
            nicoNoteDiv.style.left = `${parseInt(nicoButton.style.left)-parseInt(nicoNoteDiv.style.width)}px`;
            nicoNoteDiv.style.display = "";
            //相对图标位置呼出编辑框。
            ifNicoNotDiv = false;
            nicoNoteDiv.style.display = "";
        }
        else{
            nicoNoteDiv.style.display = "none";
            nicoButton.style.opacity="1";
            ifNicoNotDiv = true;
            //点击两次隐藏。
        }});
//----------------------------------------上方主要编辑了按钮的功能，下方来编辑Note框---------------------------------------------------
    var nicoNoteDiv = document.createElement("div");
    //这里用document.creatElement()创建元素。ps.比最开始进步了
    nicoNoteDiv.setAttribute("id","nicoNoteDiv");
    var nicoDivStyle = `position: fixed;
    top: 60px;
    width: 360px;
    height: 200px;
    z-index: 2147400;
    background: black;
    border: 1px solid #D3D3D3;
    resize: both;
    overflow: auto;
    border-radius: 10px;
    box-shadow: 3px 3px 5px #D3D3D3;
    `;
    //border-radius绘制圆角矩形
    //box-shadow添加阴影后面的值为水平偏移量、垂直偏移量、模糊半径和阴影颜色。
    nicoNoteDiv.setAttribute("style",nicoDivStyle);
    nicoNoteDiv.style.top = `${parseInt(nicoButton.style.top)}px`;
    nicoNoteDiv.style.left = `${parseInt(nicoButton.style.left)-parseInt(nicoNoteDiv.style.width)}px`;
    nicoNoteDiv.style.display = "none";
    document.querySelector("html").appendChild(nicoNoteDiv);

//---------------------------------------限制大小---------------------------
    document.addEventListener("mouseup",()=>{
        if(parseInt(nicoNoteDiv.style.width)<200){ nicoNoteDiv.style.width="300px";};
        if(parseInt(nicoNoteDiv.style.height)<40){ nicoNoteDiv.style.height="200px";}
    });
//------------------------------改变窗口大小调节位置----------------------------------------
    window.top.addEventListener('resize', () => {
        const elementWidth = nicoButton.offsetWidth;
        const viewportWidth = window.innerWidth;
        nicoButton.style.left = (viewportWidth - elementWidth-10) + "px";
        nicoNoteDiv.style.top = `${parseInt(nicoButton.style.top)}px`;
        nicoNoteDiv.style.left = `${parseInt(nicoButton.style.left)-parseInt(nicoNoteDiv.style.width)}px`;
    });
//————————————————————加载数据库———————————————————
    var dbVersion = Date.now();
    const request = indexedDB.open("VditorHistoryDB",dbVersion);
    let db;
    request.onupgradeneeded = (e) => {
        db = e.target.result;
        //表示成功打开的数据库实例。
        if (!db.objectStoreNames.contains("history")) {
            db.createObjectStore("history", { keyPath: "id" });
            //如果没有创建对象储存，则创建一个"history"对象储存。
            //而每一条主字段的标识为id，也就是我们可以在之后给每个字段添加id，作为标识。IndexedDB 会根据这个属性对记录进行索引。
        }
    };
    function saveContent(vditor) {
        const content = vditor.getValue();//获取 MD 内容
        const timestamp = Date.now(); // 时间戳作为 ID
        const transaction = db.transaction("history", "readwrite");//创建一个操作 "history" 存储的读写事务。
        const store = transaction.objectStore("history");// 获取 "history" 对象存储
        store.put({ id: timestamp, content: content, savedAt: new Date().toLocaleString() });
        //向"history" 存储中放入一个id为时间戳，内容为 Markdown 内容，保存的时间为当前时间的内容。
        //savedAt 是一个字段，用于记录保存的时间。而new Date().toLocaleString() 是 JavaScript 的方法，返回当前时间的本地化格式（例如 2024/12/15 10:30:45）
        transaction.oncomplete = () => {
            alert("内容已保存！");
        };
        transaction.onerror = (event) => {
            console.error("保存失败", event.target.error);
        };
    }
    function showHistory(ifFirst,vditor) {
        const transaction = db.transaction("history", "readwrite");//创建读取事务的实例
        const store = transaction.objectStore("history");//获取对象储存的实例
        const request = store.getAll();
        request.onsuccess = (event) => {
            const history = event.target.result; // 确保在请求成功后访问 result 属性
            history.sort((a, b) => b.id - a.id);// 按 ID（即时间戳）降序排序
            if(ifFirst){vditor.setValue(history[0].content);}
            else{//创建历史记录
                const existingDialog = document.querySelector("#history-dialog");
                if (existingDialog) existingDialog.remove();
                // 创建弹窗容器
                const dialog = document.createElement("div");
                dialog.id = "history-dialog";
                dialog.style.position = "fixed";
                dialog.style.top = "50%";
                dialog.style.left = "50%";
                dialog.style.transform = "translate(-50%, -50%)";
                dialog.style.background = "#fff";
                dialog.style.border = "1px solid #ddd";
                dialog.style.padding = "15px";
                dialog.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.3)";
                dialog.style.zIndex = "2147483647";
                dialog.style.maxHeight = "300px";
                dialog.style.overflowY = "auto";

                // 弹窗标题
                const title = document.createElement("h3");
                title.innerText = "历史记录";
                title.style.marginTop = "0";
                dialog.appendChild(title);

                // 遍历历史记录，添加按钮
                history.forEach((item, index) => {
                    const button = document.createElement("button");
                    const delateButton = document.createElement("button");
                    button.innerText = `${index + 1}. ${item.savedAt}`;
                    button.style.display = "block";
                    button.style.marginBottom = "10px";
                    button.style.width = "100%";
                    delateButton.innerText = `删除`;
                    delateButton.style.display = "block";
                    delateButton.style.marginBottom = "10px";
                    delateButton.style.width = "50%";
                    // 点击按钮时写入内容
                    button.onclick = () => {
                        vditor.setValue(item.content);
                        dialog.remove(); // 关闭弹窗
                    };
                    delateButton.onclick = () => {
                        const transaction = db.transaction("history", "readwrite");
                        const store = transaction.objectStore("history");
                        const deleteRequest = store.delete(item.id);
                        showHistory(false,vditor);
                    };
                    dialog.appendChild(button);
                    dialog.appendChild(delateButton);
                });

                // 关闭按钮
                const closeButton = document.createElement("button");
                closeButton.innerText = "关闭";
                closeButton.style.marginTop = "10px";
                closeButton.style.width = "100%";
                closeButton.onclick = () => dialog.remove();
                dialog.appendChild(closeButton);
                document.body.appendChild(dialog);
            }
            };
    }

//————————————————引入 Vditor—————————————————————————————
    var nicoVditor = document.createElement("div");
    nicoVditor.id = "nicoVditor";
    nicoVditor.style = `
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    background: #D3D3D3;
    `;
    nicoVditor.innerHTML=`<p>Vditor渲染失败，访问以下链接来查看解决方案：</p><a href='https://github.com/ccr39/NicoNote/'>NicoNote</a>`;
    //用``来写，又进步了。这里在absolute下定义top和bottom后不定义height，就可以让其填满。
    nicoNoteDiv.appendChild(nicoVditor);
    request.onsuccess = e => {
        const vditor = new Vditor("nicoVditor",{
            width: "100%",
            placeholder: 'NicoNote🤗',
            toolbar: ['emoji','preview','outline','export','upload','help',{
                name: 'nicoSave',
                tipPosition: 's',
                tip: '保存到浏览器',
                className: 'right',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"> <path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>`,
                click () {saveContent(vditor)},}, {
                name: 'hsitory',
                tipPosition: 's',
                tip: '历史记录',
                className: 'right',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
<path d="M12 8V12L14.5 14.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.60423 5.60423L5.0739 5.0739V5.0739L5.60423 5.60423ZM4.33785 6.87061L3.58786 6.87438C3.58992 7.28564 3.92281 7.61853 4.33408 7.6206L4.33785 6.87061ZM6.87963 7.63339C7.29384 7.63547 7.63131 7.30138 7.63339 6.88717C7.63547 6.47296 7.30138 6.13549 6.88717 6.13341L6.87963 7.63339ZM5.07505 4.32129C5.07296 3.90708 4.7355 3.57298 4.32129 3.57506C3.90708 3.57715 3.57298 3.91462 3.57507 4.32882L5.07505 4.32129ZM3.75 12C3.75 11.5858 3.41421 11.25 3 11.25C2.58579 11.25 2.25 11.5858 2.25 12H3.75ZM16.8755 20.4452C17.2341 20.2378 17.3566 19.779 17.1492 19.4204C16.9418 19.0619 16.483 18.9393 16.1245 19.1468L16.8755 20.4452ZM19.1468 16.1245C18.9393 16.483 19.0619 16.9418 19.4204 17.1492C19.779 17.3566 20.2378 17.2341 20.4452 16.8755L19.1468 16.1245ZM5.14033 5.07126C4.84598 5.36269 4.84361 5.83756 5.13505 6.13191C5.42648 6.42626 5.90134 6.42862 6.19569 6.13719L5.14033 5.07126ZM18.8623 5.13786C15.0421 1.31766 8.86882 1.27898 5.0739 5.0739L6.13456 6.13456C9.33366 2.93545 14.5572 2.95404 17.8017 6.19852L18.8623 5.13786ZM5.0739 5.0739L3.80752 6.34028L4.86818 7.40094L6.13456 6.13456L5.0739 5.0739ZM4.33408 7.6206L6.87963 7.63339L6.88717 6.13341L4.34162 6.12062L4.33408 7.6206ZM5.08784 6.86684L5.07505 4.32129L3.57507 4.32882L3.58786 6.87438L5.08784 6.86684ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM16.1245 19.1468C14.9118 19.8483 13.5039 20.25 12 20.25V21.75C13.7747 21.75 15.4407 21.2752 16.8755 20.4452L16.1245 19.1468ZM20.25 12C20.25 13.5039 19.8483 14.9118 19.1468 16.1245L20.4452 16.8755C21.2752 15.4407 21.75 13.7747 21.75 12H20.25ZM6.19569 6.13719C7.68707 4.66059 9.73646 3.75 12 3.75V2.25C9.32542 2.25 6.90113 3.32791 5.14033 5.07126L6.19569 6.13719Z" fill="#1C274C"/>
</svg>`,
                click:  () => {
                    showHistory(false,vditor);
                }},{
                name: 'sponsor',
                tipPosition: 's',
                tip: '成为赞助者',
                className: 'right',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" role="img" width="48px" height="48px" viewBox="0 0 24 24" aria-labelledby="favouriteIconTitle" stroke="red" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="none" color="red"> <title id="favouriteIconTitle">Favourite</title> <path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z"/> </svg>`,
                click () {window.open("https://ccr39.github.io/donate/", "_blank");},//打开一个新的标签页
            },{
                name: 'hide',
                tipPosition: 's',
                tip: '隐藏',
                className: 'left',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 1024 1024"><path d="M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2L371.2 588.8ZM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z" fill="#000000"/><path d="M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z" fill="#000000"/></svg>`,
                click () {nicoNoteDiv.style.display = "none";
                          nicoButton.style.opacity="1";
                          ifNicoNotDiv = true;},
            },],
            cache: {
                enable: false,
            },
            after: () =>{
                vditor.setValue('');
                const nicoToolbar=document.querySelector("#nicoVditor > div.vditor-toolbar");
                nicoToolbar.style.cursor = "move";
                letWeDrag(nicoNoteDiv,false,nicoToolbar);
                showHistory(true,vditor);
            }
        });
    };

//---------------------------------------底下是一个可以让元素可以被拖动的函数---------------------------
    function letWeDrag(dragDiv,ifBt,nicoToolbar){
        let offsetX = 0;
        let offsetY = 0;
        let nicoDivX =0;
        let nicoDivY =0;
        let ifDragging = false;
        //充当一个布尔变量，用于判断是否在抓取移动状态,let为局部变量
        if(ifBt){dragDiv.addEventListener("mousedown",(e) => {//"mousedown"即监测鼠标点下的事件。
            ifDragging = true;
            offsetX = e.clientX;
            offsetY = e.clientY;
            //记录初始鼠标坐标(相对于左上角)
            nicoDivY = parseInt(dragDiv.style.top);
            nicoDivX = parseInt(dragDiv.style.left);
            //获取div的位置parseInt（）会将字符串转化为数字（忽略最后的非数字部分）
            e.preventDefault();
            //用来禁止鼠标拖拽时选中的功能
        })}
        else{nicoToolbar.addEventListener("mousedown",(e) => {//通过监听内部div调整外部div
            ifDragging = true;
            offsetX = e.clientX;
            offsetY = e.clientY;
            nicoDivY = parseInt(dragDiv.style.top);
            nicoDivX = parseInt(dragDiv.style.left);
            e.preventDefault();
        })};
        document.addEventListener('mousemove',(e)=>{
            if(ifDragging){
                const { clientX, clientY } = e;
                //获取当前鼠标坐标
                dragDiv.style.top = `${nicoDivY+clientY-offsetY}px`;
                dragDiv.style.left = `${nicoDivX+clientX-offsetX}px`;
                //${}表示在字符串中插入函数或变量，但要确保使用反引号`Code`
                if(ifBt){dragDiv.style.pointerEvents = "none";}
                //禁止单击，防止拖拽同时点击。
            }
        });
        document.addEventListener("mouseup",() =>{
            ifDragging = false;
            if(ifBt){dragDiv.style.pointerEvents = "auto";} // 恢复点击
        });
        //松开鼠标，停止拖拽
    }

})();