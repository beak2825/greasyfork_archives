// ==UserScript==
// @name         Prequel Fanartbooru minimal mode
// @namespace    https://www.prequeladventure.com/fanartbooru/user/amkitsune
// @version      2.2
// @description  Reformats the layout of the Prequel Fanartbooru to take up less space and work better on smaller screens. (click userbox and upload box titles to hide and restore them.)
// @author       AMKitsune
// @match        https://www.prequeladventure.com/fanartbooru*
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/33879/Prequel%20Fanartbooru%20minimal%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/33879/Prequel%20Fanartbooru%20minimal%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var article = document.getElementsByTagName("article")[0];
    var header = document.getElementById("header");
    var footer = document.getElementsByTagName("footer")[0];
    var sidebar = document.getElementsByTagName("nav")[0];
    var uploadBox = document.getElementById("Uploadhead");
    var comments = document.getElementsByClassName("comment");
    var blockBodies = document.getElementsByClassName("blockbody");
    var h3Elements = document.getElementsByTagName("h3");
    var userBox = null;
    var loginBox = null;
    var allSections = document.getElementsByTagName("section");

    //console.log(allSections.length);
    for (var i = 0; i < allSections.length; i++) {
        // console.log(allSections[i].id);
        if (allSections[i].id.indexOf("Logged_in_as") >=0) {
            // console.log("found the user box");
            userBox = allSections[i];
            //console.log(userBox);
        }
        if (allSections[i].id.indexOf("Loginhead") >=0) {
            //console.log("found the login box");
            loginBox = allSections[i];
            //console.log(loginBox);
        }
    }

    for(i = 0;i<comments.length;i++){
        comments[i].style.margin = "2px";
    }
    for(i = 0;i<h3Elements.length;i++){
        h3Elements[i].style.margin = "2px";
    }
    for(i = 0;i<blockBodies.length;i++){
        blockBodies[i].style.margin = "2px";
    }

    //userBox = document.getElementById("Logged_in_as_AMKitsunehead");//TODO  make this work with any logged in user and make it also work for non-logged in user.

    //var userBox = document.querySelector('[id^="Logged_in_as_"]').id[0];
    var tipsSection = document.getElementsByClassName("tip1")[0].parentNode.parentNode;
    var navigationSection= document.getElementById("Navigationleft");
    var thumbnails = document.getElementsByClassName("thumb");

    if(uploadBox !== null){
        uploadBox.getElementsByTagName("h3")[0].addEventListener("click",toggleUploadBox);
        if(GM_getValue("uploadBoxVisible",true) === true){
            uploadBox.childNodes[1].style.display = "block";
        } else {
            uploadBox.childNodes[1].style.display = "none";
        }
        sidebar.insertBefore(uploadBox,sidebar.childNodes[0]);
    }
    if(userBox !== null){
        userBox.getElementsByTagName("h3")[0].addEventListener("click",toggleUserBox);
        if(GM_getValue("userBoxVisible",true) === true){
            userBox.childNodes[1].style.display = "block";
        } else {
            userBox.childNodes[1].style.display = "none";
        }
        sidebar.insertBefore(userBox,sidebar.childNodes[0]);
    }
    if(loginBox !== null){
        loginBox.getElementsByTagName("h3")[0].addEventListener("click",toggleLoginBox);
        if(GM_getValue("loginBoxVisible",true) === true){
            loginBox.childNodes[1].style.display = "block";
        } else {
            loginBox.childNodes[1].style.display = "none";
        }
        sidebar.insertBefore(loginBox,sidebar.childNodes[0]);
    }
    if(tipsSection !== null){
        tipsSection.style.display = "none";
    }
    if(navigationSection !== null){
        var comicLink = document.createElement("a");
        var linkText = document.createTextNode("Back to comic");

        var changeThumbnailSizeLink = document.createElement("a");
        var changeThumbnailSizeText = document.createTextNode("Change thumbnail sizes.");
        changeThumbnailSizeLink.appendChild(changeThumbnailSizeText);
        changeThumbnailSizeLink.addEventListener("click",requestNewThumbnailSize);

        comicLink.href = "/";
        comicLink.appendChild(linkText);
        navigationSection.lastChild.insertBefore(document.createElement("br"),navigationSection.lastChild.childNodes[0]);
        navigationSection.lastChild.insertBefore(changeThumbnailSizeLink,navigationSection.lastChild.childNodes[0]);
        navigationSection.lastChild.insertBefore(document.createElement("br"),navigationSection.lastChild.childNodes[0]);
        navigationSection.lastChild.insertBefore(comicLink,navigationSection.lastChild.childNodes[0]);
    }

    setThumbnailSize(GM_getValue("thumbnailSize",190));


    footer.style.display = "none";
    header.style.display = "none";
    header.parentNode.style.margin_bottom = "0px";
    header.parentNode.style.padding = "0px";

    for(i = 0;i< article.getElementsByTagName("h3").length;i++){
        article.getElementsByTagName("h3")[i].style.display = "none";
    }

    if(document.getElementById("image-list") !== null){
        document.getElementById("image-list").firstChild.style.display = "none";
    }
    if(document.getElementById("Imagemain") !== null){
        document.getElementById("Imagemain").firstChild.style.display = "none";
    }

    function setThumbnailSize(size){
        for(i = 0;i<thumbnails.length;i++){
            thumbnails[i].style.maxWidth = size+"px";
            thumbnails[i].style.maxHeight = size+"px";
            thumbnails[i].firstChild.style.maxWidth = size+"px";
            thumbnails[i].firstChild.style.maxHeight = size+"px";
        }
    }

    function toggleUserBox(){
        if(userBox.childNodes[1].style.display === "block"){
            userBox.childNodes[1].style.display = "none";
            GM_setValue("userBoxVisible",false);
        } else {
            userBox.childNodes[1].style.display = "block";
            GM_setValue("userBoxVisible",true);
        }
    }

    function toggleLoginBox(){
        if(loginBox.childNodes[1].style.display === "block"){
            loginBox.childNodes[1].style.display = "none";
            GM_setValue("loginBoxVisible",false);
        } else {
            loginBox.childNodes[1].style.display = "block";
            GM_setValue("loginBoxVisible",true);
        }
    }

    function toggleUploadBox(){
        if(uploadBox.childNodes[1].style.display === "block"){
            uploadBox.childNodes[1].style.display = "none";
            GM_setValue("uploadBoxVisible",false);
            console.log("uploadBoxVisible set to " + GM_getValue("uploadBoxVisible"));
        } else {
            uploadBox.childNodes[1].style.display = "block";
            GM_setValue("uploadBoxVisible",true);
            console.log("uploadBoxVisible set to " + GM_getValue("uploadBoxVisible"));
        }
    }

    function requestNewThumbnailSize(){
        var input = parseInt(window.prompt("please enter a new thumbnail size.",GM_getValue("thumbnailSize",190)));
        if(Number.isInteger(input)){
            console.log("new valid thumbnail size found");
            GM_setValue("thumbnailSize",input);
            setThumbnailSize(input);
        }
    }

})();