// ==UserScript==
// @name         EXBetterGalleryList
// @namespace    https://greasyfork.org/zh-CN/users/453092
// @require      http://code.jquery.com/jquery-latest.js
// @version      1.1
// @description  BetterGalleryList
// @author       ikarosf
// @match        https://exhentai.org
// @match        https://e-hentai.org
// @match        https://exhentai.org/?*
// @match        https://e-hentai.org/?*
// @match        https://exhentai.org/tag/*
// @match        https://e-hentai.org/tag/*
// @match        https://exhentai.org/favorites.php*
// @match        https://e-hentai.org/favorites.php*
// @match        https://exhentai.org/g/*
// @match        https://e-hentai.org/g/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/420745/EXBetterGalleryList.user.js
// @updateURL https://update.greasyfork.org/scripts/420745/EXBetterGalleryList.meta.js
// ==/UserScript==

function list_html() {
    if($("select")[0].selectedOptions[0].text == "Compact"){

        $(".gl3c.glname>a").click(function(obj){
            $(this).parents(".gl3c.glname").css("background","black")
        });
        $(".gl3c.glname>a").attr("target","_blank");

        $(".gl4c.glhide").each(function(){
            var pagenum = parseInt($(this).find("div:last-child").text())
            var r = pagenum
            var g = 255-pagenum
            var b = 0
            if(pagenum<10){
                r = 255 - pagenum
                b = 255
            }else if(pagenum<=20){
                b = pagenum + 220
            }else if(pagenum<=30){
                b = pagenum + 130
            }
            var rgb = "rgb(" + r + "," + g + "," + b + ")";
            $(this).css("background",rgb)
            $(this).css("color","black")
            $(this).find("div>a").css("color","black")
        });
    }
    else if($("select")[0].selectedOptions[0].text == "Thumbnail"){

        $(".gl1t a").click(function(obj){
            $(this).parents(".gl1t").css("background","#3F51B5")
        });
        $(".gl1t a").attr("target","_blank");

        $(".gl1t>.gl5t>div:last-child>div:nth-child(2)").each(function(){
            var pagenum = parseInt($(this).text())
            var r = pagenum
            var g = 255-pagenum
            var b = 0
            if(pagenum<10){
                r = 255 - pagenum
                b = 255
            }else if(pagenum<=20){
                b = pagenum + 220
            }else if(pagenum<=30){
                b = pagenum + 130
            }
            var rgb = "rgb(" + r + "," + g + "," + b + ")";
            $(this).css("background",rgb)
            $(this).css("color","black")
        });
    }
}

function gallery_html() {
    if($("#rating_image").attr("class") == "ir"){
        unsafeWindow.rating_set(8)
    }
}

//-------------main-------------------

var pathname = unsafeWindow.location.pathname
if(pathname.indexOf("/g/") != -1){
    gallery_html()
}else{
    list_html()
}