// ==UserScript==
// @name          Force Zoom
// @namespace     http://freefly.org
// @description	  You can control the zoom ratio of a web page by gesture pinch.
// @match          https://*.com/*
// @author        wozixing123
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/389172/Force%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/389172/Force%20Zoom.meta.js
// ==/UserScript==
var deviceWidth = document.documentElement.clientWidth;
var fromRotateScreen = false;
function removeViewPort(forceZoom) {
    var oMetaTag;
    var oMetaTags = document.getElementsByTagName("meta");
    var oMetaViewPortTagsWithWidth = new Array();
    var oMetaViewPortTagsWithoutWidth = new Array();
    var oMetaViewPortTags = new Array();
    deviceWidth = document.documentElement.clientWidth;
    var screenRotateListener = window.apusScreenRotateListener;
    if (!fromRotateScreen) {
        if (forceZoom) {
            if (!screenRotateListener) {
                window.apusOrgScreenOrientation = window.orientation;
                window.apusScreenRotateListener = removeViewPortAndForceZoom;
                window.addEventListener("resize", removeViewPortAndForceZoom, false)
            }
        } else {
            if (screenRotateListener) {
                window.apusScreenRotateListener = null;
                window.removeEventListener("resize", screenRotateListener, false)
            }
        }
    }
    fromRotateScreen = false;
    for (var i = 0; i < oMetaTags.length; i++) {
        if (oMetaTags[i].name.toLowerCase() == "viewport") {
            oMetaTag = oMetaTags[i];
            var content = oMetaTag.content;
            if (content && content.indexOf("width") >= 0) {
                oMetaViewPortTagsWithWidth.push(oMetaTag)
            } else {
                oMetaViewPortTagsWithoutWidth.push(oMetaTag)
            }
        }
    }
    for (var j = 0; j < oMetaViewPortTagsWithoutWidth.length; j++) {
        oMetaViewPortTags.push(oMetaViewPortTagsWithoutWidth[j])
    }
    for (var k = 0; k < oMetaViewPortTagsWithWidth.length; k++) {
        oMetaViewPortTags.push(oMetaViewPortTagsWithWidth[k])
    }
    for (var index = 0; index < oMetaViewPortTags.length; index++) {
        oMetaTag = oMetaViewPortTags[index];
        if (oMetaTag) {
            if (forceZoom) {
                var newViewportContentStr = oMetaTag.getAttribute("newContent");
                if (newViewportContentStr) {
                    oMetaTag.content = getTransferNewContentStr(newViewportContentStr)
                } else {
                    var oldViewportContentStr = "";
                    var orgViewportContentStr = oMetaTag.getAttribute("oldContent");
                    if (orgViewportContentStr) {
                        oldViewportContentStr = orgViewportContentStr
                    } else {
                        oldViewportContentStr = oMetaTag.content
                    }
                    var oldViewportContentArray = oldViewportContentStr.split(",");
                    var newViewportContentStr = "";
                    oMetaTag.setAttribute("oldContent", oldViewportContentStr);
                    newViewportContentStr = getNewViewPortContentStr(oldViewportContentStr, true);
                    oMetaTag.setAttribute("newContent", newViewportContentStr);
                    newViewportContentStr = getTransferNewContentStr(newViewportContentStr);
                    oMetaTag.content = newViewportContentStr.substr(0, newViewportContentStr.length - 1)
                }
            } else {
                var orgViewportContentStr = oMetaTag.getAttribute("oldContent");
                if (orgViewportContentStr) {
                    oMetaTag.content = orgViewportContentStr
                } else {
                    var oldViewportContentStr = oMetaTag.content;
                    oMetaTag.setAttribute("oldContent", oldViewportContentStr);
                    oMetaTag.content = getTransferNewContentStr(getNewViewPortContentStr(oldViewportContentStr, false))
                }
                oMetaTag.removeAttribute("newContent")
            }
        }
    }
}
function getNewViewPortContentStr(oldViewportContentStr, toRemoveScaleAttr) {
    var oldViewportContentArray = oldViewportContentStr.split(",");
    var newViewportContentStr = "";
    for (var i = 0; i < oldViewportContentArray.length; i++) {
        var perStr = oldViewportContentArray[i].trim();
        if (perStr.indexOf("width") == 0) {
            var widthStartIndex = perStr.indexOf("=");
            if (widthStartIndex > 0) {
                var widthValue = perStr.substr(widthStartIndex + 1).trim();
                if (widthValue.toLowerCase() == "device-width") {
                    perStr = "width=device-width"
                } else if (!isNaN(widthValue)) {
                    var finalWidth = parseInt(widthValue) + 1;
                    perStr = "width=" + finalWidth
                }
            }
        }
        if (perStr.indexOf("maximum-scale") < 0 && perStr.indexOf("user-scalable") < 0 || !toRemoveScaleAttr) {
            newViewportContentStr = newViewportContentStr + perStr + ","
        }
    }
    return newViewportContentStr
}
function getTransferNewContentStr(contentStr) {
    var transferedContentStr = contentStr;
    if (contentStr.indexOf("width=device-width") >= 0) {
        var finalWidth = deviceWidth + 1;
        var replacedStr = "width=" + finalWidth;
        transferedContentStr = contentStr.replace("width=device-width", replacedStr)
    }
    return transferedContentStr
}
function removeViewPortAndForceZoom() {
    var orgScreenOrientation = window.apusOrgScreenOrientation;
    var needRefreshAgain = window.apusNeedRefreshAgain;
    if ((typeof(orgScreenOrientation) != "undefined" && orgScreenOrientation != window.orientation) || needRefreshAgain) {
        var screenRoate = false;
        if (orgScreenOrientation != window.orientation) {
            screenRoate = true;
            window.apusOrgScreenOrientation = window.orientation
        }
        fromRotateScreen = true;
        var oldClientWidth = document.documentElement.clientWidth;
        removeViewPort(false);
        var newClientWidth = document.documentElement.clientWidth;
        var differClientWidth = newClientWidth - oldClientWidth;
        if (differClientWidth <= 1 && differClientWidth >= -1 && screenRoate) {
            window.apusNeedRefreshAgain = true
        } else {
            window.apusNeedRefreshAgain = false
        }
        fromRotateScreen = true;
        removeViewPort(true)
    }
}