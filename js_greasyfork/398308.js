// ==UserScript==
// @name         ITMTU original images
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Gets link to original images on ITMTU and shows all images in a collection
// @author       Erlkonigin
// @match        http://www.itmtu.com/mm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398308/ITMTU%20original%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/398308/ITMTU%20original%20images.meta.js
// ==/UserScript==

(function() {

    let imgDiv = document.getElementsByClassName("image_div")[0];
    let imgLink = imgDiv.children[0].children[0].children[0].getAttribute("src");

    //get root directory to display all images
    let dir = imgLink.split("/");
    let popped = dir.pop();
    dir = dir.join("/");
    dir += "/";

    //get total count of images
    let allPageElems = document.getElementsByClassName("page-numbers");
    let lastPageElem = allPageElems[allPageElems.length-2];
    let lastPageNumber = lastPageElem.innerHTML;
    createAllImagesView(findAllImages(dir, lastPageNumber));

    //child to insert new element before
    let toInsertBefore = document.getElementsByClassName("image_postall")[0];
    //creating new element
    let newElem = document.createElement("p");
    newElem.style.textAlign = "center";
    //new child element for new element for good formatting
    let link = document.createElement("a");
    link.setAttribute("href", imgLink);
    link.innerHTML = "FULL SIZE";

    newElem.appendChild(link);
    //adding custom element to original page
    let container = document.getElementsByClassName("content_left")[0];
    container.insertBefore(newElem, toInsertBefore)
})();

function findAllImages(dir, lastIndex){
    let allImgLinks = new Array();
    for(var i = 1; i <= lastIndex; i++){
        let filename = i.toString().padStart(4, "0");
        filename += ".jpg";
        let fullLink = dir + filename;
        allImgLinks.push(fullLink);
    }
    return allImgLinks;
}

function createAllImagesView(imgLinksArr){
    //creates container for all images
   let container = document.createElement("ul");
    container.classList.add("xg_content");
    container.classList.add("myStyle");
    container.style.overflowY = "scroll";
    container.style.height = "80vh";

    imgLinksArr.forEach((link) => {
        //creating root li element
        let liElem = document.createElement("li");
        liElem.classList.add("i_list")
        liElem.classList.add("list_n2")

        let childLinkElem = document.createElement("a");
        let currentLoc = window.location.href.split("/");
        currentLoc.pop();
        currentLoc = currentLoc.join("/");
        currentLoc += "/";
        childLinkElem.setAttribute("href", currentLoc + (imgLinksArr.indexOf(link)+1));

        let caseInfo = document.createElement("div");
        caseInfo.classList.add("case_info");
        let metaTitle = document.createElement("a");
        metaTitle.classList.add("meta-title");
        metaTitle.innerHTML = "IMAGE " + (imgLinksArr.indexOf(link)+1);
        metaTitle.setAttribute("target", "_blank");
        metaTitle.setAttribute("href", link);
        caseInfo.appendChild(metaTitle);

        let childImgElem = document.createElement("img");
        childImgElem.classList.add("waitpic");
        childImgElem.setAttribute("src", "http://www.itmtu.com/wp-content/themes/cx-udy/timthumb.php?h=370&w=270&src=" + link);
        childLinkElem.appendChild(childImgElem);
        liElem.appendChild(childLinkElem);
        liElem.appendChild(caseInfo);
        container.appendChild(liElem);
    });
    let contentDiv = document.getElementById("content");
    contentDiv.appendChild(container);
}