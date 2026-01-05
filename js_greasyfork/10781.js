// ==UserScript==
// @name         SE dropdown kb-nav
// @version      1.0
// @description  Allows keyboard-navigating through the items under "more communities" in the SE dropdown
// @author       nicael
// @include        *://*.stackexchange.com/*
// @include        *://*stackoverflow.com/*
// @include        *://*serverfault.com/*
// @include        *://*superuser.com/*
// @include        *://*askubuntu.com/*
// @include        *://*stackapps.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/9713
// @downloadURL https://update.greasyfork.org/scripts/10781/SE%20dropdown%20kb-nav.user.js
// @updateURL https://update.greasyfork.org/scripts/10781/SE%20dropdown%20kb-nav.meta.js
// ==/UserScript==

var i = -1;

$(document).ready(function(){
    $(document).keydown(function(e) {
        if($(".icon-site-switcher.topbar-icon-on").length>0){
            if($(".other-sites li").length>1){
                if(e.keyCode==40){
                    i++;
                    if(i==$(".other-sites li").length){i=0;}
                }
                if(e.keyCode==38){
                    i--;
                    if(i<0){i=$(".other-sites li").length-1;}
                }
            } else {
                i=0;
            }
            if(e.keyCode==13&&i>-1){location.href=$(".other-sites li").eq(i).find("a").attr("href")}
            if(e.keyCode==40||e.keyCode==38){
                e.preventDefault();
                if(i==0){
                    $("a[href='//stackexchange.com/sites']").parent().parent().get(0).scrollIntoView();
                } else {
                    $(".other-sites li").get(i-1).scrollIntoView();
                }
                $(window).scrollTop(0);
            }else{
                $(".site-filter-input").focus();
                i=0;
            }

            $(".other-sites li").css({"background-color":"rgba(0,0,0,0)"}).eq(i).css({"background-color":"rgb(230,230,230)"});

        }
    })
})
