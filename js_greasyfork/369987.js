// ==UserScript==
// @name         Wordpress Floating Button
// @namespace    Localhost
// @version      1.1
// @description  Ultility for backend using
// @author       Trần Minh Trí
// @match        http://localhost/*/wp-admin/*
// @match        */*/wp-admin/*
// @match        */wp-admin/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369987/Wordpress%20Floating%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/369987/Wordpress%20Floating%20Button.meta.js
// ==/UserScript==

// Add # to custom link
var customLinkInp = document.getElementById( "custom-menu-item-url" );
if( customLinkInp ){

    var parentCustomLinkInp = customLinkInp.parentElement;
    var sharpLink = document.createElement("span");

    customLinkInp.style.width = "157px";

    sharpLink.innerHTML = "#";
    sharpLink.style.float = "right";
    sharpLink.style.padding = "5px";
    sharpLink.style.background = "gray";
    sharpLink.style.color = "#FFF";
    sharpLink.style.cursor = "pointer";
    sharpLink.style.margin = "2px 0 0px 5px";
    sharpLink.addEventListener("click", function(){
        customLinkInp.value = "#";
    });

    parentCustomLinkInp.insertBefore(sharpLink, customLinkInp);
}

// Floating save button
var publishBtn = document.getElementById( "publish" ) || document.querySelector("input[type=submit]");
if( publishBtn &&
    (
      publishBtn.value == "Update" ||
      publishBtn.value == "Publish" ||
      publishBtn.value == "Update Profile"
    )
  ){
    var floatingBtnWrapper, floatingBtn, iLeftPos, iTopPos;
    floatingBtnWrapper = publishBtn.parentNode.cloneNode( true );
    floatingBtn = floatingBtnWrapper.querySelector("#publish") || floatingBtnWrapper.querySelector("input[type=submit]");

    iLeftPos = parseInt( publishBtn.parentNode.getBoundingClientRect().left, 10 );
    iTopPos = parseInt( publishBtn.getBoundingClientRect().top, 10 );

    if( iLeftPos <= document.body.clientWidth/2 ){
        iLeftPos = document.body.clientWidth;
        if( publishBtn.parentNode.id == "publishing-action" ){
            iLeftPos -= publishBtn.parentNode.offsetWidth;
        }else{
            iLeftPos -= publishBtn.offsetWidth;
            iLeftPos -= parseInt( window.getComputedStyle( publishBtn.parentNode ).getPropertyValue('padding-left'), 10 );
            iLeftPos -= parseInt( window.getComputedStyle( publishBtn.parentNode ).getPropertyValue('padding-right'), 10 );
        }
    }

    if( iTopPos > document.body.clientHeight*2/3 || iTopPos < document.body.clientHeight/3 ){
        iTopPos = document.body.clientHeight/2;
    }

    floatingBtn.addEventListener("click", function(){

        var spiner = floatingBtnWrapper.querySelector(".spinner");
        if( spiner ){
            spiner.classList.add("is-active");
        }

        publishBtn.click();
    });

    floatingBtnWrapper.style.position = "fixed";
    floatingBtnWrapper.style.left = iLeftPos + "px";
    floatingBtnWrapper.style.top = iTopPos + "px";
    floatingBtnWrapper.style.zIndex = "99999";

    floatingBtn.style.textShadow = "2px 2px 8px rgba(255, 255, 100, 1)";
    floatingBtn.style.display = "flex";
    floatingBtn.id = "floating-publish";

    document.querySelector("body").appendChild( floatingBtnWrapper );

}