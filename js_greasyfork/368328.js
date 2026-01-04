// ==UserScript==
// @name            Office Online Viewer
// @description     View office documents in your browser with Microsoft Office Online. Previously made by ogzergin
// @namespace       Kenya-West
// @author          Kenya-West
// @version        	0.3.0
// @include        	*
// @exclude        	http*://view.officeapps.live.com/*
// @exclude        	http*://docs.google.com/*
// @exclude        	http*://mail.google.com/*
// @exclude        	http*://viewer.zoho.com/*
// @exclude        	http*://*.live.com/*
// @exclude        	http*://office.com/*
// @exclude        	http*://*.office.com/*
// @exclude        	http*://outlook.com/*
// @exclude        	http*://*.outlook.com/*
// @downloadURL https://update.greasyfork.org/scripts/368328/Office%20Online%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/368328/Office%20Online%20Viewer.meta.js
// ==/UserScript==

var pageLinks = document.links;
var fileTypes = ["doc", "docx", "xls", "xlsx", "ppt", "pps", "pptx"];

//https://view.officeapps.live.com/op/view.aspx?src=
var strOfficeHost = "view.officeapps.live.com";
var strViewOfficeUrl = "https://" + strOfficeHost + "/op/view.aspx?src=";

parseLinks();
chromeModuleRun();

addDebouncedEventListener(document, 'DOMNodeInserted', function (evt) {
    parseLinks();
}, 1000);

function endsWith(str, suffix) { //  check if string has suffix 
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function stripQueryString(str) {
    return str.protocol + '//' + str.hostname + str.pathname;
}

function parseLinks() {
    for (var i = 0; i < pageLinks.length; i++) {
        if (pageLinks[i].isParsed != true && pageLinks[i].host != strOfficeHost) {
            parseLink(pageLinks[i]);
            pageLinks[i].isParsed = true;
        }
    }
}

function parseLink(link) {

    var url = stripQueryString(link);

    if (checkType(url)) {
        addOfficeLink(link);
    }

}

function checkType(str) {
    for (var i = 0; i < fileTypes.length; i++) {
        if (endsWith(str, '.' + fileTypes[i]))
            return true;
    }
    return false;
}
function addOfficeLink(link) {
    var officeLink = document.createElement('a');
    officeLink.href = strViewOfficeUrl + encodeURI(stripQueryString(link));
    officeLink.isParsed = true;
    officeLink.target = "_blank";

    var ico = document.createElement("img");

    if (endsWith(officeLink.href, ".doc") || endsWith(officeLink.href, ".docx"))
        ico.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAYhJREFUeNpiYKAxYMQlMX3q5PlAKoFIcz4AcWFmdu4Com0GWvD/548f/4kBILVQjOEgJnyWsLGzE+0gRycXEDUf3RImaoW1uoYGVkuoZsGvnz+xWsJCHddrMsybOxtduB+IFzBKRO0VADLuA7EAMYbxcbEw3JxtR1DdjGlTGICpihEWRALEuvbTtz8k+Y7lxTLnD0BfkKTp5PGjOOXMLa1RLUDmPF/qxLDy0HOGgpnXGfa0mTFoy/MwqKceYkjzlGUoDlJkkIzeh9UQvD5A5lx9+IVBR54XHM4gw0EAxLfUFGQ4dv0D5T44dv09Q6qHLIOVliCY//j1DyBbgEFWhINh1eHnOA0h2gcgV4IsKAEGB4j9+PV3Bg9jUQZZUQ6GY9eo4YNr78E0KHh6191n+Pj1D0O4nSTcdxT7AJQEQfEAsgDk4o/ffsN9RpVUBAIuVadQ+LCUg88Qon1Ay3zwgZSighQf4K1wKAEg/VQtrnEBJkJlPLl1AzGRvABYxidQ4PgFDPQAAAEGADBX+y/oDCHMAAAAAElFTkSuQmCC";
    else if (endsWith(officeLink.href, ".xls") || endsWith(officeLink.href, ".xlsx"))
        ico.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXFJREFUeNpiYKAxYMQlMX3q5PlAKoFIcz4AcWFmdu4Com0GWvD/548f/4kBILVQjOEgJnyWsLGzE+0gRycXEDUf3RImaoW1uoYGVkuoZsGvnz+xWsJCHddrMsybOxtduB+IFzAK1DgKABn3gViAGMP4OXgYHlRvIqhuxrQpDMBUxQgLIgFiXfvxxxeSfMfyoWX/B6AvSNK0b89OMG1kbMpw7uxpFDknF3dUC9A1N7umMaSZBTAELqlgePzhJcOZnPkM228dZ0hY3YzVEHQDMXyALtBzeClDuJ4r2KJPP74Cg+QrQ/7mPur5AGbggtBaMB/kcpAYLkNI9gEI8HFww9myAuLUjQNZfnFg8KSDw52fnYehxDaaYeWl3Si+oMgHk3yLgGmdm6F21ywwHxTJE4FiyJFMkQ8Cl5Sj8MVbvTBcRXEc0CIffCClqCDFB3grHEoASD9Vi2tcgIlQGU9u3UBMJC8AlvEJFDh+AQM9AECAAQDazQB29Xk6fwAAAABJRU5ErkJggg==";
    else
        ico.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWlJREFUeNpiYKAxYMQlMX3q5PlAKoFIcz4AcWFmdu4Com0GWvD/548f/4kBILVQjOEgJnyWsLGzE+0gRycXEDUf3RImaoW1uoYGVkuoZsGvnz+xWsJCHddrMsybOxtduB+IFzAesZMRADLuA7EAMYax8PAxsDcvZPgJdLG5pTXDt93zGJgFJRnYDJwZGFnY4OpmTJvCAExVjLAgEiDWtX++fAIbjgz+vn/O8OvCXqzqmWwOPflAjWACWfL/+xdMH2NTbLrzNpz98+VThqtZfgx/gS7HBrhck/AHKS6J0+6qDLx65gyq9dMYRFyDGF6ux8ykJ48fReGD4oSkjEYKYMeRKXH6ABZM3+5eZ3izex1BC+QVlEgPInyuhaUkEBtkuKCQEGkW4AMGRiZEq2Uh1fXYIhdfRJPlA2yphZAPPhCdmzm5SfIB3gqHEgDST9V8gAswESrjya0biInkBcAyPoECxy9goAcACDAAA7PdyVcZ42AAAAAASUVORK5CYII=";


    ico.style.marginLeft = "5px";
    officeLink.appendChild(ico);
    link.parentNode.insertBefore(officeLink, link.nextSibling);

}

function addDebouncedEventListener(obj, eventType, listener, delay) {
    var timer;

    obj.addEventListener(eventType, function (evt) {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout(function () {
            timer = null;
            listener.call(obj, evt);
        }, delay);
    }, false);
}

function chromeModuleRun() {
    if (chrome && chrome.downloads && chrome.downloads.onCreated) {
        chrome.downloads.onCreated.addListener(
            function (downloadItem) {

                for (var i = 0; i < fileTypes.length; i++) {
                    if (downloadItem.finalUrl.search("." + array[i]) != -1) { //to check a file type in the url
                        chrome.downloads.cancel(downloadItem.id, function () { // if true, then cancel
                            console.log("Download from: " + downloadItem.finalUrl + " has been canceled");
                        })
                    }
                }

            })
    } else {
        console.log("It is not Chrome so capability of downloads preventing will not work")
    }
}