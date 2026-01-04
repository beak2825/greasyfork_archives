// ==UserScript==
// @name     Pinterest img preview
// @include  https://www.pinterest.jp/*
// @match    https://stackoverflow.com/questions/*
// @require  https://code.jquery.com/jquery-3.5.1.min.js
// @description preview Pinterest img
// @noframes
// @version 1.0.0
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/669061
// @downloadURL https://update.greasyfork.org/scripts/407538/Pinterest%20img%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/407538/Pinterest%20img%20preview.meta.js
// ==/UserScript==

var imgDiv = document.createElement("div");
imgDiv.id = "pinterest-img-box";
imgDiv.style.background = "#ffffff";
imgDiv.style.top = "0px";
imgDiv.style.left = "0px";
imgDiv.style.right = "auto";
imgDiv.style.bottom = "auto";
imgDiv.style.position = "fixed";
//imgDiv.style.border = "1px solid #000";
imgDiv.style.color = "red";
imgDiv.style.zIndex = 2147483647;
var img = document.createElement("img");
img.id = "pinterest-img";
img.style.background = "#ffffff";
img.style.top = "auto";
img.style.left = "auto";
img.style.right = "auto";
img.style.bottom = "auto";
img.style.position = "fixed !important";
img.style.border = "1px solid #000";
img.style.color = "red";
imgDiv.append(img);
document.body.append(imgDiv);
waitForKeyElements("img", listLinks);
function listLinks (jNode) {
    jNode.on({
        mouseenter: function (e) {
            var regx = new RegExp(".*3x,(.*?) 4x.*?");
            if(regx.test(jNode.attr("srcset"))){
                var imgUrl = regx.exec(jNode.attr("srcset"))[1];
                console.log("------------img:", imgUrl);
                //jNode.attr("src",imgUrl);
                $("#pinterest-img-box").css("display","block");
                $("#pinterest-img").attr("src",imgUrl);
                // Get on screen image
                var theImage = new Image();
                theImage.src = imgUrl
                var imageWidth = theImage.width;
                var imageHeight = theImage.height;
                var realWidth = $(window).width();
                var realHeight = $(window).height();
                $("#pinterest-img-box").css("width", "auto");
                $("#pinterest-img-box").css("height", "auto");
                var scaleX = 100;
                var scaleY = 100;
                if(imageWidth > realWidth){
                    scaleX = Math.floor(realWidth*100 /imageWidth)
                }
                if(imageHeight > realHeight){
                    scaleY = Math.floor(realHeight*100 /imageHeight)
                }
                console.log("--scale:"+scaleX+'   '+scaleY);
                if(scaleX > scaleY){
                    scaleX = scaleY;
                }
                if(scaleX != 100){
                    imageWidth = Math.floor(imageWidth * scaleX /100)
                    imageHeight = Math.floor(imageHeight * scaleX /100)
                    $("#pinterest-img-box").css("width", imageWidth);
                    $("#pinterest-img-box").css("height", imageHeight);
                }
                console.log("--img-box:"+imageWidth+'   '+imageHeight);
                var mouseX=e.clientX;
                var mouseY=e.clientY;
                if(2*mouseX < realWidth){
                    $("#pinterest-img-box").css("left",(mouseX + 10)+"px");
                    $("#pinterest-img-box").css("right","auto");
                }else{
                    $("#pinterest-img-box").css("right",(realWidth - mouseX+10)+"px");
                    $("#pinterest-img-box").css("left","auto");
                }
                if(2*mouseY < realHeight){
                    if(imageHeight > realHeight - mouseY){
                        $("#pinterest-img-box").css("top","auto");
                        $("#pinterest-img-box").css("bottom","10px");
                    }else{
                        $("#pinterest-img-box").css("top",(mouseY +10)+"px");
                        $("#pinterest-img-box").css("bottom","auto");
                    }
                }else{
                    if(imageHeight > mouseY){
                        $("#pinterest-img-box").css("bottom","auto");
                        $("#pinterest-img-box").css("top","10px");
                    }else{
                        $("#pinterest-img-box").css("bottom",(realHeight - mouseY + 10)+"px");
                        $("#pinterest-img-box").css("top","auto");
                    }
                }
                //$('body').mousemove(function(e) {


                //console.log(mouseX+'   '+mouseY);
                //})
            }
            //console.log ("Found img src: ", jNode.attr("src")," img srcset: ", jNode.attr("srcset")," img currentSrc: ", jNode.attr("currentSrc"));
            //console.log("Node:",jNode);
        },
        mouseleave: function () {
            $("#pinterest-img-box").css("display","none");
        }
    });
}
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}