// ==UserScript==
// @name         稿定设计
// @namespace    https://greasyfork.org/zh-CN/users/753623-achengovo
// @version      2.6
// @description  支持去除图怪兽、易企秀、创客贴、比格设计、稿定设计、爱设计图片水印
// @author       秦东
// @icon         https://achengovo.com/greasyfork/logo.png
// @match        https://*.818ps.com/*
// @match        https://*.eqxiu.com/*
// @match        https://*.chuangkit.com/*
// @match        https://bigesj.com/*
// @match        https://*.gaoding.com/*
// @match        https://www.isheji.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463834/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/463834/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1.meta.js
// ==/UserScript==
(function( $ ) {
    init([]);
    newOutBtn("kill","去除水印",kill)
    var tit=document.title;
    if (/(图怪兽)/.test(tit)) {
        newOutBtn("ziti","字体问题",()=>{
            $(".image-watermark").remove()})
    }
    donate()
    function kill(){
        var tit=document.title;
        if (/(图怪兽)/.test(tit)) {
 
            $(".image-watermark").remove()
            let oldStr = window.document.body.innerHTML;
            var newStr=document.getElementsByClassName("canvasContent")[0].innerHTML
            window.document.body.innerHTML = newStr;
            $(".footCreateBlankCanvas").remove();
            $("body").css("overflow","auto")
            $("div").remove(".image-watermark");
            $(".fixedWaterMaskButton").remove();
        }else if (/(易企秀)/.test(tit)) {
            $("div.eqc-watermark").css("position",'static');
            $(".eqc-wm-close").remove();
            let oldStr = window.document.body.innerHTML;
            var newStr=document.getElementsByClassName("safe-space")[0].innerHTML
            newStr=newStr.replaceAll('data-hint="双击或从素材库拖拽进行替换"','')
            newStr=newStr.replaceAll("hint--top","")
            window.document.body.innerHTML = newStr;
            $("body").css("overflow","auto");
            var timename=setTimeout(function print(){
                $(".eqc-editor").css("transform","none");
                $("#eqc-mouse-info").css("display","none");
            },500);
        }else if (/(创客贴)/.test(tit)) {
            $("div[style*='ckt-watermark']").remove();
            $("div").remove(".templateWaterMark");
            $(".remove-cktTemplate-watermark").remove();
            let oldStr = window.document.body.innerHTML;
            var newStr=document.getElementsByClassName("canvas-slot-inner")[0].innerHTML
            window.document.body.innerHTML = newStr;
            $("body").css("overflow","auto")
        }else if (/(比格设计)/.test(tit)) {
            $("div.water").css("position",'static');
            $("div.tool-bar-container").remove();
            $(".water-tip").remove();
            let oldStr1 = window.document.body.innerHTML;
            var newStr=document.getElementsByClassName("bige-canvas-list")[0].innerHTML
            window.document.body.innerHTML = newStr;
        }else if (/(稿定设计)/.test(tit)) {
            var nowUrl=window.location.href;
            if(!/(qiye.)/.test(nowUrl)){
                alert("浏览器网址前加上qiye.切换到企业版本去水印效果更好")
            }
            $(".header-container").remove()
            $(".resource-station").remove()
            $(".right-panel").remove()
            $(".editor-container").css("position","inherit");
            var gaoding = document.createElement('style');
            gaoding.innerHTML=".editor-watermark{position: static;z-index:-999 !important"
            window.document.body.append(gaoding)
            $("body").prepend(gaoding);
            $(".editor-watermark").css("opacity","0");
            $(".main__bottom").remove()
        }else if (/(爱设计)/.test(tit)) {
            $("#editorDrag > div.undefined.scrolly > div.scrolly-viewport.editor-center > div > div:nth-child(1)").remove();
            $(".editor-watermask").remove();
            $(".editor-header").remove();
            $(".editor-aside").remove();
            $(".editor-panel").remove();
            $("#rongqi").remove();
            $("#outbuttons").remove();
        }
    }
 
})( jQuery );
function newOutBtn(id,text,fun){
    $("#outbuttons").append( "<button class='mybutton' id='"+id+"' style='float:left;background-color: rgba(70, 196, 38, 0.6); width: 70px;height: 30px;font-size: 12px;color:red;'>"+text+"</button>");
    $("#"+id+"").click(fun)
}
function init(data){
    var outbuttons="<div id='outbuttons' style='font-size: 12px;background-color: rgba(70, 196, 38, 0.6); position: fixed; top: 0; left: 0; z-index: 99999;'>"
    +"</div>"
    $("body").prepend(outbuttons);
    var tit=document.title;
    for(var i=0;i<data.length;i++){
        var reg=new RegExp("("+data[i][0]+")")
        if(reg.test(tit)){
            data[i][1]();
        }
    }
}
function readCookie(cookieName) {
    var theCookie = "" + document.cookie;
    var ind = theCookie.indexOf(cookieName);
    if (ind == -1 || cookieName == "") return "";
    var ind1 = theCookie.indexOf(';', ind);
    if (ind1 == -1) ind1 = theCookie.length;
    return unescape(theCookie.substring(ind + cookieName.length + 1, ind1));
}