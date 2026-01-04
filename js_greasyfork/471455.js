// ==UserScript==
// @name         ChatterNot
// @namespace    chatternot.zero.torn
// @version      0.2
// @description  hides chat
// @author       -zero [2669774]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471455/ChatterNot.user.js
// @updateURL https://update.greasyfork.org/scripts/471455/ChatterNot.meta.js
// ==/UserScript==

if (!localStorage.hidechat){
    localStorage.hidechat = 1;
}

function click(){
    if (localStorage.hidechat){
        if (localStorage.hidechat == 1){
            localStorage.hidechat = 0;
            
        }
        else{
            localStorage.hidechat = 1;
            
        }

        hide();
    }
}

function hide(){
    if ($("#chatRoot").length > 0){
        if (localStorage.hidechat == 1){
            $("#chatRoot").hide();
        }
        else{
            $("#chatRoot").show();
        }

    }
    else{
        setTimeout(hide, 500);
    }
}

$(document).on('keypress', async function (e) {
   
    if (e.which == 96) {
        click();
    }
});

function insertMenu(){
    hideBUtton = `<li id="buttonHide" class="menu-item-link"><a><svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt " filter="" fill="#fff" stroke="transparent" stroke-width="0" width="25.77" height="29" viewBox="-6 -4 25.77 29"><path d="M12.81 4.36l-1.77 1.78a4 4 0 0 0-4.9 4.9l-2.76 2.75C2.06 12.79.96 11.49.2 10a11 11 0 0 1 12.6-5.64zm3.8 1.85c1.33 1 2.43 2.3 3.2 3.79a11 11 0 0 1-12.62 5.64l1.77-1.78a4 4 0 0 0 4.9-4.9l2.76-2.75zm-.25-3.99l1.42 1.42L3.64 17.78l-1.42-1.42L16.36 2.22z"/></svg></div><span class="link-text"> Hide</span></a></li>`;
    
    if ($(".menu-items > li").length > 0 && $("#buttonHide").length == 0){
        $(".menu-items").append(hideBUtton);
        $("#buttonHide").on("click",function(){
            console.log("Hide");
            click();
        });
    }
    else{
        setTimeout(insertMenu,300);
    }

}

function insert(){
    if ($(".dropdown-menu").length > 0){
        $(".dropdown-menu").on("click", function(){
            console.log("Clicked!");
            insertMenu();
        });


    }
    else{
        setTimeout(insert, 500);
    }

}

insert();
