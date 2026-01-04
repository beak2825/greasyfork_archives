// ==UserScript==
// @name         Prequel fanartbooru post archiver
// @namespace    http://www.prequeladventure.com/fanartbooru/user/amkitsune
// @version      1.1
// @description  Adds a link to quickly download a posts image, comments and data.
// @author       AMKitsune
// @match        http://www.prequeladventure.com/fanartbooru/post/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39870/Prequel%20fanartbooru%20post%20archiver.user.js
// @updateURL https://update.greasyfork.org/scripts/39870/Prequel%20fanartbooru%20post%20archiver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clickableLink = document.createElement("a");
    clickableLink.style="color:white;";
    const linkText = document.createTextNode("Download archive of this post.");
    clickableLink.appendChild(linkText);

    clickableLink.onclick = function(){
        const postName = document.getElementsByTagName("Title")[0].innerText;

        const imageElement = document.getElementById("main_image");
        var imageLink = document.createElement("a");
        imageLink.href = imageElement.src;
        imageLink.download = "archived booru post " + postName + "." + (imageElement.src.split('.').pop());
        setTimeout(function(){imageLink.click(); console.log("downloading image.");},500);


        const imageInfoElement = document.getElementsByClassName("image_info")[0];
        const commentsElement = document.getElementById("comment-list-image");
        var finalString = imageInfoElement.innerText + "-----comments (text)-----\n" + commentsElement.innerText + "-----comments (raw)-----\n" + commentsElement.innerHTML;
        var textFileBlob = new Blob([finalString], {type: "text/plain"});
        window.URL = window.URL || window.webkitURL;
        var textLink = document.createElement("a");
        textLink.href = window.URL.createObjectURL(textFileBlob);
        textLink.download = "image data and comments for post " + postName + ".txt";
        setTimeout(function(){textLink.click();console.log("downloading text.");},1000);

    };

    document.getElementById("Imagemain").appendChild(clickableLink);
})();