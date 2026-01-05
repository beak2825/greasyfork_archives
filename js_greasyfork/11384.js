// ==UserScript==
// @name               ZARP Forum Tweaks
// @namespace          http://toxic.hol.es/
// @version            1.0
// @author             ToXIc Gaming
// @description        Hides the menu and creates a button to show it when needed and add some other tweaks.
// @match              *://*.zarpgaming.com/*
// @run-at             document-body
// @require    		   http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/11384/ZARP%20Forum%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/11384/ZARP%20Forum%20Tweaks.meta.js
// ==/UserScript==

//     $(document).ready ( function(){
       var size = $(window).width()-200;
        $('body').prepend('<style type="text/css"> /* #kbbcode-preview {height: 1000px !important;} */ .rt-page-container {margin-top: 0px !important;} #rt-logo {background-size: 50% !important; height: 100% !important;}.logo-block { height: 50px !important; } #Kunena div.kprofile-rightcol1 { width: 100% !important; } .borders{border-top: 1px solid #BFC3C6 !important;} .floatRight { float:right !important; } .width20 { width:100% !important; } .width1444 { width: 90% !important; left: 5% !important; border-radius: 10px 10px 10px 10px !important; }  .noback {background-color: transparent !important;box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.8), 0px 0px 0px rgba(225, 225, 225, 0.15) inset, 0px 0px 0px rgba(225, 225, 225, 0.1) inset !important;border: 0px solid #000 !important;}</style>')
        $(document.getElementById("rt-sidebar-a")).hide();
          $(document.getElementsByClassName("kblock kannouncement")).hide();
       //(document.getElementsByClassName("gf-menu l1")).hide();
        $(document.getElementsByClassName("gf-menu l1")).append('<li class="item117"><a class="item" id="toggle">Show Menu</a></li>');
       $(".klist-actions-forum:first").append('<a id="togglesig" class="kicon-button kbuttoncomm btn-left">Show Signatures</a>');
         $('a[rel="kannouncement"]').click();
       $(document.getElementsByClassName("kmsgsignature")).hide();
        //$(document.getElementsByClassName("rt-main-wrapper rt-grid-9 rt-push-3")).addClass('floatRight');
        $(document.getElementsByClassName("rt-page-container rt-container rt-dark")).addClass('width20');
        $(document.getElementsByClassName("rt-page-container rt-container rt-dark")).addClass('noback');
        $(document.getElementsByClassName("rt-main-wrapper rt-grid-9 rt-push-3")).addClass('width1444');
       $(document.getElementsByClassName("kforum-pathway")).addClass('borders');
        $(document.getElementsByClassName("item259")).hide();
       $(document.getElementsByClassName("rt-pages")).hide();
       $(document.getElementById("rt-footer-surround")).hide();
       $(document.getElementsByClassName("kblock kpbox")).hide();
            
     $(document.getElementById("toggle")).click(function(){
        if (document.getElementById("toggle").innerHTML === "Show Menu"){
        $(document.getElementsByClassName("kblock kannouncement")).show();
        $(document.getElementById("rt-sidebar-a")).show();
          $(document.getElementsByClassName("kblock kpbox")).show();
           $(document.getElementsByClassName("kforum-pathway")).removeClass('borders');
        //$(document.getElementsByClassName("rt-main-wrapper rt-grid-9 rt-push-3")).removeClass('floatRight');
        $(document.getElementsByClassName("rt-page-container rt-container rt-dark")).removeClass('width20');
          $(document.getElementsByClassName("rt-page-container rt-container rt-dark")).removeClass('noback');
        $(document.getElementsByClassName("rt-main-wrapper rt-grid-9 rt-push-3")).removeClass('width1444');
        document.getElementById("toggle").innerHTML = "Hide Menu";
        } else {
        $(document.getElementById("rt-sidebar-a")).hide();
             $(document.getElementsByClassName("kblock kannouncement")).hide();
          $(document.getElementsByClassName("kblock kpbox")).hide();
           $(document.getElementsByClassName("kforum-pathway")).addClass('borders');
        //$(document.getElementsByClassName("rt-main-wrapper rt-grid-9 rt-push-3")).addClass('floatRight');
        $(document.getElementsByClassName("rt-page-container rt-container rt-dark")).addClass('width20');
          $(document.getElementsByClassName("rt-page-container rt-container rt-dark")).addClass('noback');
        $(document.getElementsByClassName("rt-main-wrapper rt-grid-9 rt-push-3")).addClass('width1444');
        document.getElementById("toggle").innerHTML = "Show Menu"
        }
    });
       
            $(document.getElementById("togglesig")).click(function(){
        if (document.getElementById("togglesig").innerHTML === "Show Signatures"){
        $(document.getElementsByClassName("kmsgsignature")).show();
        document.getElementById("togglesig").innerHTML = "Hide Signatures";
        } else {
        $(document.getElementsByClassName("kmsgsignature")).hide();
        document.getElementById("togglesig").innerHTML = "Show Signatures"
        }
    });
   
       
  //     });