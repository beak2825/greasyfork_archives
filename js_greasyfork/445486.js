// ==UserScript==
// @name         好大学在线 下载课件
// @namespace    empty
// @homepage     empty
// @author       Teruteru
// @description  为好大学在线添加下载课件和下载视频功能
// @version      1.0.0
// @match        https://*.cnmooc.org/study/initplay/*.mooc
// @match        https://*.cnmooc.org/study/unit/*.mooc
// @run-at       document-idle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/445486/%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%20%E4%B8%8B%E8%BD%BD%E8%AF%BE%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/445486/%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%20%E4%B8%8B%E8%BD%BD%E8%AF%BE%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        function sleep1(ms, callback) {
            setTimeout(callback, ms)
        }
        sleep1(1000, () => {
            adddownbutton();
        });
        $('.tab-inner').on('click', function () {
            sleep1(2000, () => {
                changebutton();
            });
        });
    };
})();

var btn;

function getElementByClassName(parent,tagName,classname)
{
    var aEls=parent.getElementsByTagName(tagName);
    var arr=[];
    for(var i=0;i<aEls.length;i++){
        if(aEls[i].className==classname)
        {
            arr.push(aEls[i]);
            break;
        }
    }
    return arr;
}

function adddownbutton()
{
    console.log("开始执行");
    var assistant_div = document.getElementById("assistant");
    if (assistant_div==null)
    {
        assistant_div=document.createElement('div');
        assistant_div.id = 'assistant';
        $('.main-scroll').prepend(assistant_div);
    }

    var add_button = function (text, fun) {
        btn = document.createElement('button');
        btn.textContent = text;
        btn.onclick = fun;
        // todo:优雅的样式设置
        btn.style = 'margin:5px;padding:5px';
        return assistant_div.appendChild(btn);
    };
    var isvideo=$(".jwvideo");
    if (isvideo.length>0)
        add_button("下载视频", downloadvideo);
    else
        add_button("下载课件", downloadcourseware);
}

function changebutton()
{
    var isvideo=$(".jwvideo");
    if (isvideo.length>0)
    {
        btn.textContent= "下载视频";
        btn.onclick =downloadvideo;
    }
    else
    {
        btn.textContent= "下载课件";
        btn.onclick =downloadcourseware;
    }
    console.log("更新完成");
}

function downloadcourseware()
{
    openNewWindow("/download/nodes/" + $("#courseOpenId").val() + "/"+ $("#nodeId").val() +".mooc");
}
function downloadvideo()
{
    openNewWindow($(".jwvideo")[0].children[0].src);
}

function openNewWindow(url) {
	let a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";
	a.target = "_blank";
	a.href = url;
	a.click();
	document.body.removeChild(a);
}
