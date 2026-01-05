// ==UserScript==
// @name         Marketpaid viewer
// @namespace    jorgequintt
// @version      1.2
// @description  enter something useful
// @author       Jorge Quintero
// @match        *.marketpaid.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13036/Marketpaid%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/13036/Marketpaid%20viewer.meta.js
// ==/UserScript==

var username = ""; // TU USERNAME
var password = ""; // TU PASSWORD

leave = true;

if (window.location.href.indexOf("login.php")!=-1){
    setTimeout(function() {document.getElementById("body_inside_inside_in_all_login_box_log_into_username").value=username;},500);
    setTimeout(function() {document.getElementById("body_inside_inside_in_all_login_box_log_into_password").value=password;},1000);
    setTimeout(function() {document.getElementById("body_inside_inside_in_all_login_box_log_button_b_connection").click();},1500);
    }

/*if(window.location.href.indexOf("index.php")){
    setTimeout(function(){window.location="https://marketpaid.com/bonusadpoints.php";},60000);
}*/

if((document.location.href.indexOf("bonusadpoints.php")!=-1) || (document.location.href.indexOf("paidads.php")!=-1)){
    var i = 0;
var conter=0;
    var reload = false;
    function step(){
        if(document.getElementById("page_inside_in_conn_inside_post").style.display=="block"){
            if(document.getElementById("body_inside_header_countdown_counter").style.display=="none"){
                if(document.getElementById("body_inside_header_countdown_confirm").style.display=="inline"){
                    document.getElementById("body_inside_header_countdown_confirm").click();
                }
            }
        }else{
            setTimeout(function(){document.getElementsByClassName("body_inside_inside_inpage_inside_paidads_in_once_view")[i].click();},500);
            i+=1;
        }
        conter=conter+1;
        if((conter>=200)&&(!reload)){reload=true;location.reload();}
        if(document.location.href.indexOf("bonusadpoints.php")!=-1){
            if((document.getElementsByClassName("body_inside_inside_inpage_inside_paidads_in_once_view").length<=1) && (leave===true)){window.location="https://marketpaid.com/paidads.php";leave=false;}
        }else{
            if((document.getElementsByClassName("body_inside_inside_inpage_inside_paidads_in_once_view").length<=1) && (leave===true)){leave=false;window.close();}
        }
    }

    setInterval(step,1000);
}
