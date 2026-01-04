// ==UserScript==
// @name         Reddit Preview Redgif and Gfycat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allow you to see gifs without opening the post.
// @author       shead
// @match        https://www.reddit.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/437669/Reddit%20Preview%20Redgif%20and%20Gfycat.user.js
// @updateURL https://update.greasyfork.org/scripts/437669/Reddit%20Preview%20Redgif%20and%20Gfycat.meta.js
// ==/UserScript==

var currentPathName;
var isRed;

window.addPreviewButton = function(event){

    var hoveredObj = $(':hover').last();
    var linkElmnt = hoveredObj.parent();

    if(!linkElmnt || !linkElmnt[0] || !linkElmnt[0].href || (linkElmnt[0].origin != "https://gfycat.com" && ( linkElmnt[0].origin != "https://redgifs.com" && linkElmnt[0].origin != "https://www.redgifs.com")))
    {

      //  currentPathName ="";
        //   $("#previewPanel").remove();
        return;
    }

    if(currentPathName === linkElmnt[0].pathname)
    {

        return;
    }

    if(linkElmnt[0].origin === "https://gfycat.com")
    {
        isRed = false;
    }

    if((linkElmnt[0].origin === "https://redgifs.com" || linkElmnt[0].origin === "https://www.redgifs.com"))
    {
        isRed = true;
    }

    //debugger;
    $("#previewButton").remove();
    currentPathName = linkElmnt[0].pathname;
    linkElmnt.parent().prepend("<div id='previewButton' style='background-color:blue; width:100%; height:50%; z-index:1000')'></div>")
    $("#previewButton").click( function(event){ event.stopPropagation(); previewClick();})

}


window.previewClick = function (e){

    $("body").append("<div id='previewDiv'> </div>");
    $("#previewDiv")[0].style.width = "100%"
    $("#previewDiv")[0].style.height = "1000%"
    $("#previewDiv")[0].style.left = "0px";
    $("#previewDiv")[0].style.top = "0px";
    $("#previewDiv")[0].style.position = "fixed"
    $("#previewDiv")[0].style.zIndex = 1000;
    $("#previewDiv").click( function(){
        $("#previewDiv").remove();
        addPreviewButton(e);
    })
    $("#previewDiv").append("<div id='previewPanelArea'> </div>");

    $("#previewPanelArea")[0].style.width = "50%"
    $("#previewPanelArea")[0].style.height = "50%"
    $("#previewPanelArea")[0].style.left = "50%";
    $("#previewPanelArea")[0].style.top = "50%";
    $("#previewPanelArea")[0].style.position = "fixed"
    $("#previewPanelArea")[0].style.marginTop = "-"+document.getElementById('previewPanelArea').offsetHeight/2+"px";
    $("#previewPanelArea")[0].style.marginLeft = "-"+document.getElementById('previewPanelArea').offsetWidth/2+"px";

    $("#previewPanelArea")[0].style.zIndex = 1000;
    var iframeSrc;


    if( isRed === false)
    {
        iframeSrc = "'https://gfycat.com/ifr"+currentPathName+"'" ;
    }

    if( isRed === true)
    {
        iframeSrc = "'https://redgifs.com/ifr"+currentPathName+"'" ;
        iframeSrc = iframeSrc.replace("watch/", "");
    }

    $("#previewPanelArea").append("<div id='previewPanel' style='position:relative; padding-bottom:calc(56.25% + 44px)'><iframe id='iFrameVideo' src="+iframeSrc+" frameborder='0' hd='1' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' muted='false' allow='autoplay; fullscreen'></iframe></div>");

}


$('body').on('mousemove', function(e) {
    addPreviewButton(e);
});