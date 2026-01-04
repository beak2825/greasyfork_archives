// ==UserScript==
// @name         7017k小说网纯净版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  仅修改了7017k小说网 去除广告二维码 在正文之前添加换页按钮 可以导入本地小说阅读
// @author       Mantodea
// @match        https://www.7017k.com/*.html
// @grant        GM_xmlhtttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/451570/7017k%E5%B0%8F%E8%AF%B4%E7%BD%91%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/451570/7017k%E5%B0%8F%E8%AF%B4%E7%BD%91%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==

function removeFirstByClass(className)
{
    if(typeof className == 'string')
    {
        var obj = document.getElementsByClassName(className)[0];
        if(obj)
        {
            obj.remove();
        }
    }
}
function removeByID(ID)
{
    if(typeof ID == 'string')
    {
        var obj = document.getElementById(ID);
        if(obj)
        {
            obj.remove();
        }
    }
}
function createInput()
{
    var content = document.getElementById("content");
    var input = document.createElement("input");
    input.addEventListener("change", function selectedFileChanged(){
        if(this.files.length == 0)
        {
            console.log("请选择文件!");
            return;
        }
        var name = this.files[0].name.split(".")[0];
        const reader = new FileReader();
        content.innerHTML = "";
        reader.readAsText(this.files[0]);
        reader.onload = function complete(){
            var txt = reader.result.replace(" ", "").split("\n");
            for(var i = 0; i < txt.length; i++)
            {
                content.append('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + txt[i]);
                var br = document.createElement("br");
                var br2 = document.createElement("br");
                content.append(br);
                content.append(br2);
            }
            var title = document.getElementsByTagName("h1")[0];
            title.innerHTML = "";
            title.append(name);
            var p = document.getElementsByClassName("p")[0]
            p.innerHTML = "";
            p.append("本地小说 > " + name);
        }
    })
    input.type = "file";
    input.id = "Input";
    input.style = "filter:alpha(opacity = 0); opacity:0; width:0; height:0;";
    content.before(input);
}
function Click()
{
    var input = document.getElementById("Input");
    input.click();
}
function Init()
{
    var li1 = document.createElement("li");
    var li2 = document.createElement("li");
    var li3 = document.createElement("li");
    var li4 = document.createElement("li");
    var content = document.getElementById("content");
    var a = document.createElement("a");
    var b = document.createElement("a");
    var c = document.createElement("a");
    var d = document.createElement("a");
    var str = window.location.href.split("/");
    var num = Number(str[str.length - 1].replace(".html", ""));

    var div = document.createElement("div");
    div.setAttribute("class", "page_chapter");
    var ul = document.createElement("ul");
    a.href = window.location.href.replace(num, num - 1);
    b.href = window.location.href.replace(num, num + 1);
    c.href = window.location.href.replace(num, "").replace(".html", "");
    d.addEventListener("click", Click);
    a.append("上一章");
    b.append("下一章");
    c.append("返回目录");
    d.append("导入小说");
    li1.append(a);
    li2.append(c);
    li3.append(b);
    li4.append(d);
    ul.append(li1);
    ul.append(li2);
    ul.append(li3);
    ul.append(li4);
    div.append(ul);
    content.before(div);
}

(function() {
    removeFirstByClass("layui-row");
    removeFirstByClass("layui-row");
    removeFirstByClass("downcode");
    removeFirstByClass("header");
    removeFirstByClass("nav");
    removeFirstByClass("ywtop");
    removeFirstByClass("link");
    removeByID("footer");
    Init();
    createInput();
})();
