// ==UserScript==
// @name         DMZJ漫画全屏自适应
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  动漫之家漫画全屏自适应
// @author       VickScarlet
// @include      /^(http)s?:\/\/(manhua\.dmzj\.com)\/.*\/[0-9]+.shtml.*
// @include      /^(http)s?:\/\/(www\.dmzj\.com)\/view\/.*\/[0-9]+.html.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37149/DMZJ%E6%BC%AB%E7%94%BB%E5%85%A8%E5%B1%8F%E8%87%AA%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/37149/DMZJ%E6%BC%AB%E7%94%BB%E5%85%A8%E5%B1%8F%E8%87%AA%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

function initial(){
    set_mode();
    init_view();
    init_key();
    init_style();
}


function init_view(){
    $("#app_manhua").attr("style","width:800px; height:120px; padding:20px; background:#fff; border:1px solid #ccc; margin:20px auto");
    $("body").children().addClass("nodisplay");
    let html = `
    <div id="scarletshow">
        <div id="scarletshowbg">
        </div>
        <div id="scarletshowcontent">
            <img id="imgcontent" index="0"/>
        </div>
    </div>`;
    $("body").append(html);
    if(typeof(arr_pages) == "undefined"){
        arr_pages = picArry;
    }
    $("#imgcontent").attr('src',img_prefix+arr_pages[0]);
}

function init_key(){
    if(typeof(arr_pages) == "undefined"){
        arr_pages = picArry;
    }
    let count = arr_pages.length;
    $('body').keyup(function(event) {
        if (document.activeElement.localName != "input" && document.activeElement.localName != "select" ) {
            let value = event.keyCode;
            if (value == 88) {//x
                let curr = parseInt($("#imgcontent").attr("index"));
                let prev = curr - 1;
                if(prev<0){
                    let prevc = $("a.btm_chapter_btn.fl");
                    if(prevc.length > 0){ prevc[0].click(); }
                    else alert("已经是最前了");
                }else{
                    $("#imgcontent").attr('index',prev);
                    $("#imgcontent").attr('src',img_prefix+arr_pages[prev]);
                }
            }else if(value == 67){//c
                let curr = parseInt($("#imgcontent").attr("index"));
                let next = curr + 1;
                if(next+1>count){
                    let nextc = $("a.btm_chapter_btn.fr");
                    if(nextc.length > 0){ nextc[0].click(); }
                    else alert("已经是最后了");
                }else{
                    $("#imgcontent").attr('index',next);
                    $("#imgcontent").attr('src',img_prefix+arr_pages[next]);
                }
            }else if(value == 90){//z
                let prevc = $("a.btm_chapter_btn.fl");
                if(prevc.length > 0){ prevc[0].click(); }
                else alert("没有前一章了");
            }else if(value == 86){//v
                let nextc = $("a.btm_chapter_btn.fr");
                if(nextc.length > 0){ nextc[0].click(); }
                else alert("没有后一章了");
            }else if(value == 81){//q
                $("body").children(".nodisplay").removeClass("nodisplay");
                $("#scarletshow").attr("class","nodisplay");
            }else if(value == 65){//a
                $("body").children().addClass("nodisplay");
                $("#scarletshow").attr("class","");
            }
        }
    });
}

function set_mode(){
    if(location.hostname=="manhua.dmzj.com"){
        if($("#qiehuan_txt").text()=="切换到上下滚动阅读"){
            $("#qiehuan_txt").click();
        }
    } else {
        if($("input[name=mode]:checked").val()=="0"){
            $("input[name=mode]:checked").val("1");
            reset();
        }
    }
}

function init_style(){
    let style = `<style id="scarletview">#scarletshow{position:fixed;width:100%;height:100%;top:0}#scarletshowbg{background:black;width:100%;height:100%;opacity:0.5;}#scarletshowcontent{position:absolute;width:100%;height:100%;top:0;}#scarletshowcontent>a{z-index:10000;}#imgcontent{position:absolute;max-width:100%;max-height:100%;top:50%;left:50%;transform:translateY(-50%)translateX(-50%);}.nodisplay{display:none;}</style>`;
    $("head").append(style);
}

$(document).ready(function() {
    initial();
});