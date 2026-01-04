// ==UserScript==
// @name        E-Hentai Better Navigation
// @description Удобное средство просмотра галереи.
// @namespace   https://e-hentai.org/s/*
// @include     https://exhentai.org/s/*
// @include     https://e-hentai.org/s/*
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/389909/E-Hentai%20Better%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/389909/E-Hentai%20Better%20Navigation.meta.js
// ==/UserScript==

document.body.style.background = "black";
document.body.querySelector("html body div#i1.sni").style.display = "none";
document.body.querySelector("html body p.ip").style.display = "none";

let mainBody = document.createElement("div");
let sidebar = document.createElement("div");
let header = document.createElement("div");
let headerText = document.createElement("p");
let bottom = document.createElement("div");
let bottomText = document.createElement("p");
let helpLink = document.createElement("a");
let sidebarBody = document.createElement("div");
let imageMain = document.createElement("img");


let table = document.createElement("table");
let tableBody = document.createElement("tbody");
let tableRow = document.createElement("tr");
let tableColumn1 = document.createElement("td");
let tableColumn2 = document.createElement("td");

document.body.insertBefore(mainBody, document.body.firstChild);

mainBody.appendChild(table);
table.appendChild(tableBody);
tableBody.appendChild(tableRow);
tableRow.appendChild(tableColumn1);
tableRow.appendChild(tableColumn2);

tableColumn1.appendChild(sidebar);
sidebar.appendChild(header);
header.appendChild(headerText);
sidebar.appendChild(sidebarBody);
sidebar.appendChild(bottom);
bottom.appendChild(helpLink);
bottom.appendChild(bottomText);
tableColumn2.appendChild(imageMain);

tableColumn1.vAlign = "top";
tableColumn2.vAlign = "top";
tableColumn2.align = "center";
tableColumn2.style.width = "100%";

sidebar.style.background = "grey";
sidebar.style.width = "240px";
sidebar.style.height = "100vh";
sidebar.style.position = "fixed";

sidebarBody.style.height = "95vh";
sidebarBody.style.overflowY = "auto";

header.style.background = "darkgrey";

let headerTextMain = document.body.querySelector("html body div#i1.sni h1").innerText;
headerText.innerText = headerTextMain;

$(helpLink).click(function () {
    alert("Shortkeys:\n" +
        "1 - fit image to screen\n" +
        "2 - set image size to real\n" +
        "m - go to gallery main page");
});
helpLink.innerText = "(help)";
helpLink.href = "#";
bottomText.innerText = "";

imageMain.style.textAlign = "center";
imageMain.style.display = "block";
imageMain.style.maxHeight = "99vh";
imageMain.style.userSelect = "none";

table.style.borderCollapse = "collapse";

$(tableColumn2).click(function (event) {
    if ($(event.target).is(imageMain)){
        if(openedPageIndex+1<pageUri.length)
            openedPageIndex++;
        $(sidebarBody).animate({
            scrollTop: $(sidebarBody).scrollTop() - $(sidebarBody).offset().top + $("#"+(openedPageIndex+1)).offset().top-50
        }, 500);
        SrcAssignHandler();
    } else {
        if(openedPageIndex>0)
            openedPageIndex--;
        $(sidebarBody).animate({
            scrollTop: $(sidebarBody).scrollTop() - $(sidebarBody).offset().top + $("#"+(openedPageIndex+1)).offset().top-50
        }, 500);
        SrcAssignHandler();
    }
    window.scrollTo(0, 0);
});

let openedPageIndex;
let pageUri = [];
let imageSrc = [];
let imagePreviewBackground = [];
openedPageIndex = parseInt(document.documentURI.substring(document.documentURI.lastIndexOf("-")+1))-1;
imageMain.src = document.body.querySelector("html body div#i1.sni div#i3 a img#img").getAttribute("src");

let homeButton = document.body.querySelector("html body div#i1.sni div#i5 div.sb a");
let homeHref =  homeButton.getAttribute("href");
if (homeHref.includes("?")) homeHref = homeHref.substr(0, homeHref.indexOf("?")-1)+"/";

$.ajax({url: homeHref, dataType: 'html', success: function(responseData){
    pageUri = $(responseData).find(".gdtm").children().find("a").toArray();

    let imagePreview = $(responseData).find(".gdtm").children().toArray();
    for (let i=0; i<imagePreview.length; i++){
        imagePreviewBackground.push($(imagePreview[i]).css("background"));
    }
    headerText.innerText += pageUri.length;
    GetPagesHrefs();
}});
let galleryPageIndex = 1;

let images = [];
function GetPagesHrefs(){
    $.ajax({url: homeHref + "?p="+ galleryPageIndex, dataType: 'html', success: function(responseData){
        let child = $(responseData).find(".gdtm").children().find("a").toArray();
        let imagePreview = $(responseData).find(".gdtm").children().toArray();
        for (let i=0; i < imagePreview.length; i++){
            imagePreviewBackground.push($(imagePreview[i]).css("background"));
        }
        let pageIndex;
        pageIndex = $(responseData).find(".ptds").first().children().text();
        if (pageIndex !== (galleryPageIndex+1).toString()){
            headerText.innerText = headerTextMain+ " | ";
            AppendNeededImages();
        } else {
            for (let i = 0; i < child.length; i++){
                pageUri.push(child[i]);
            }
            galleryPageIndex++;
            setTimeout(function(){GetPagesHrefs();}, 100);
        }
        headerText.innerText += pageUri.length;
    }});
}


function AppendNeededImages() {
    for (let i=0;i<pageUri.length;i++){
        images.push(document.createElement("img"));
        imageSrc.push("");

        let imageNumber = document.createElement("div");
        let sideBarImageContainer = document.createElement("div");

        images[i].id = i+1;
        images[i].alt = i+1;
        images[i].title = i+1;
        imageNumber.innerText = i+1;
        imageNumber.style.background = "black";
        imageNumber.style.color = "white";
        imageNumber.style.position = "absolute";
        imageNumber.style.top = "5px";
        imageNumber.style.left = "5px";
        sideBarImageContainer.title = i+1;
        sideBarImageContainer.style.position = "relative";
        sideBarImageContainer.style.width = "100px";
        sideBarImageContainer.style.minHeight = "138px";
        sideBarImageContainer.style.background = imagePreviewBackground[i];

        $(sideBarImageContainer).click(function () {
            openedPageIndex = parseInt(this.title)-1;

            $(sidebarBody).animate({
                scrollTop: $(sidebarBody).scrollTop() - $(sidebarBody).offset().top + $("#"+(openedPageIndex+1)).offset().top-50
            }, 500);

            window.scrollTo(0, 0);
            SrcAssignHandler();
        });

        images[i].style.maxHeight = "400px";
        images[i].style.maxWidth = "220px";


        sidebarBody.appendChild(sideBarImageContainer);
        sideBarImageContainer.appendChild(images[i]);
        sideBarImageContainer.appendChild(imageNumber);
    }
    SrcAssignHandler();
}

function SrcAssignHandler() {
    if (imageSrc[openedPageIndex] === "")
        GetImgSrc(pageUri[openedPageIndex], openedPageIndex);
    else imageMain.src = imageSrc[openedPageIndex];
    if (openedPageIndex > 1 && imageSrc[openedPageIndex - 2] === "") {
        GetImgSrc(pageUri[openedPageIndex - 2], openedPageIndex - 2);
    }
    if (openedPageIndex > 0 && imageSrc[openedPageIndex - 1] === "") {
        GetImgSrc(pageUri[openedPageIndex - 1], openedPageIndex - 1);
    }
    if (openedPageIndex + 1 < pageUri.length && imageSrc[openedPageIndex + 1] === "") {
        GetImgSrc(pageUri[openedPageIndex + 1], openedPageIndex + 1);
    }
    if (openedPageIndex + 2 < pageUri.length && imageSrc[openedPageIndex + 2] === "") {
        GetImgSrc(pageUri[openedPageIndex + 2], openedPageIndex + 2);
    }
}

function GetImgSrc(pageUri, index) {
    $.get(pageUri).then(function(responseData){
        let prevImageSrc = responseData.substring(responseData.indexOf("<img id=")+19);
        prevImageSrc = prevImageSrc.substring(0,prevImageSrc.indexOf("style")-2);
        setTimeout(function(){AssignPageUri(prevImageSrc, index);},100);
    });
}

function AssignPageUri(src, index) {
    if (index === openedPageIndex){
        imageMain.src = src;
        $(sidebarBody).animate({
            scrollTop: $(sidebarBody).scrollTop() - $(sidebarBody).offset().top + $("#"+(openedPageIndex+2)).offset().top
        }, 500);
    }
    imageSrc[index] = src;
    images[index].src = src;
}


document.body.addEventListener("keydown", function (event) {
    if (event.keyCode === 49) {imageMain.style.maxHeight = "99vh";} //1
    if (event.keyCode === 50) {imageMain.style.maxHeight = "100%";} //2
    if (event.keyCode === 77) {window.location.href = homeButton.href;} //m
    if (event.keyCode === 81) {imageMain.src = imageSrc[openedPageIndex];} //r
});
