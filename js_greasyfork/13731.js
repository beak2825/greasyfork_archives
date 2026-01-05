// ==UserScript==
// @name       Reddit WebPreview
// @version    7.19.14
// @description  Webpage Preview like hoverzoom
// @match      *://www.reddit.com*/*
// @copyright  2014+,  Hans Strausl
// @namespace https://greasyfork.org/users/3445
// @downloadURL https://update.greasyfork.org/scripts/13731/Reddit%20WebPreview.user.js
// @updateURL https://update.greasyfork.org/scripts/13731/Reddit%20WebPreview.meta.js
// ==/UserScript==
var RWP_DEBUG = false;
var things, link, i, x, w, h, page, timeout = null;

function init(){
    setTimeout(function(){
        G("Reddit WebPreview Started");
        things = document.getElementsByClassName("thing link");
        for (i = 0; i < things.length; i++){
            link = things[i].getElementsByClassName("title may-blank")[0];
            link.onmouseover = function(e){
                if (!(this.className.search("hoverZoomLink") > -1)){
                    G(link);
                    
                    prvw(this, e.pageX);
                }
            };
        }
    }, 500);
}

window.onload = init();

function prvw(link, mouseX){
    timeout = setTimeout(function(){
        w = screen.width;
        h = screen.height - 200;
        x = (w / 2) - 150;
        G(w + " x " + h + " : " + x + " : " + (mouseX - 25));
        page = window.open(link.href,"","height=" + h + ",width=" + x + ",left=" + (mouseX - 25) + ",top=50");
    }, 500);
    link.onmouseout = function(e){
        clearTimeout(timeout);
        if (typeof page !== "undefined"){
            page.close();
        }
    };
    window.onbeforeunload = function(e){
        if (typeof page !== "undefined"){
            page.close();
        }
    }
}

function G(data){
    if (RWP_DEBUG === true){
        console.log(data);
    }
}