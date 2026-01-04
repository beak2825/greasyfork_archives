// ==UserScript==
// @name         password shower
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  Design Challenge Project
// @author       XGL
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374268/password%20shower.user.js
// @updateURL https://update.greasyfork.org/scripts/374268/password%20shower.meta.js
// ==/UserScript==

//this "password shower" is designed to show password hiding in ***.
//You should take the risk of security leak (including your password is peeked by others) on your own. 
//I will not take your password, and do not take any responsibility for your password.
//Use this only when you really hate any kind of asterisk password text boxes and is really crazy.

var isDown= false;
var isMouseOver=false;
var pwdList = [];
var mouseOverSwitch=true;
var isPressed = false;
var isClicked = false;

document.onkeydown=function(e){
    keynum = window.event ? e.keyCode : e.which;
    keychar = String.fromCharCode(keynum);
    isDown = true;
    if(keynum == 17) showAllPwd();//peek on Ctrl
    if(keynum == 113) {//Press F2 to switch on/off mouse-over peek function
        if(mouseOverSwitch === false) mouseOverSwitch = true;
        else {
            mouseOverSwitch = false;
            hideAllPwd();
        }
    }
    if(keynum==16) {
        //show permantly on pressing shift (press again to disable)
        if(isPressed===false) {
            isPressed=true;
            showAllPwd();
            //alert(keynum);
        }
        else{//press again shift to disable
            isPressed=false;
            hideAllPwd();
        }
    }
};

document.onkeyup=function(e){
                keynum = window.event ? e.keyCode : e.which;
                keychar = String.fromCharCode(keynum);
                isDown=false;
                //alert(keynum+'-up-:'+keychar);
                if(keynum == 17) hideAllPwd();//peek finished
                

};
function showAllPwd(){
    for(var i=0;i<list.length;i++){
        list[i].setAttribute("type","text");
    }
}
function hideAllPwd(){
    for(var i=0;i<list.length;i++){
        list[i].setAttribute("type","password");
    }
}
function showPwd(i){
    list[i].setAttribute("type","text");
}
function hidePwd(i){
        list[i].setAttribute("type","password");
}
function register_mouseover(){
    for(var i=0;i<list.length;i++){
        (function(i){
        list[i].onmouseover=function(){
            //show pwd on mouse over if switch is open
            isMouseOver=true;
            if(mouseOverSwitch === true) showPwd(i);
                else hideAllPwd();
            //alert(keynum+'-A1-:'+keychar);
        };
        list[i].onmouseout=function(){
            isMouseOver=false;
            if(mouseOverSwitch === true)hidePwd(i);
                else hideAllPwd();
        };
        })(i);
    }
}
window.onload=function(){
    list=document.querySelectorAll("input[type=password]");
    //get all pwd fields
    register_mouseover();
};