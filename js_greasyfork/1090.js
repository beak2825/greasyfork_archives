/*

TradeMe PhotoView


//Shows thumbnails for all listings in TradeMe

 Version 0.37.14 (07 August 2018)
 Author: tbird81 / JimBob Baggins
 Licence: Will be free to edit as you choose, but i'd like to sort it out a bit first
 Gui: {333eb056-63c4-4e4b-9589-85a0d46d22b0}

// Future improvements
For me to think about:
	- DieNicelies for GM functions.
	- Convert to normal xmlhttprequest
	- More resilience
Fix the pop ups since TradeMe's changes.

// Risks
Risks of using this software:
	- Your incoming traffic may slightly increase because more pictures are loaded.
	- This software may slow down the loading of TradeMe listings pages.
	- You might forget that other people don't have this script, so may under-promote your auction.
	- TradeMe may change its site without notice, rendering this script useless.

Changes:
  - v0.37.14 Let's put the flags back
  - v0.37.11 TM have switched to a peculiar list layout
  - v0.37 Switched to https
  - v0.36.1 Grr...
  - v0.36 Bug fix...
  - v0.35 Pop-ups in gallery view of clothing/home & living fixed.
  - v0.32 New asynchronous clothing not showing pop-ups. Had to finally use jquery...
  - v0.30 Obvious speed fix made. Property slowness should be eliminated.
  - v0.29 Big changes people!
  - v0.28.3 Chrome strikes again...
  - v0.28.2 Double D'oh!
  - v0.28.1 D'oh!
  - v0.28 Property and Flatmates were causing issues. Should be good now.
	- v0.27 Fixed my shennanigans.
	- v0.26 Fixed TradeMe shennanigans.
	- v0.25 Fixed clothing issue.
	- v0.23 Open homes bug fixed.
	- v0.22 Big Zooms!  
	- v0.21 TM Server change...    
	- v0.20 Chrome's GM_xmlhttpRequest issue bypassed (will probably be resolved by them in due course)...
	- v0.15 Stuffed up the href link on the image brought forward.
	- v0.08 Sorry about the vary slow update!!! Should work with new trademe. I'm not sure what I was doing wrong.
	- v0.07 Fixed snippets.
	- v0.06 Updated image folder. Prior versions will not work.
	- v0.05 Displays an enlarged image when the mouse hovers over a thumbnail
	- v0.04 Now adds snippets of information about items.
	- v0.04 Uses maxHeight and maxWidth styles to confine picture to 85x64px
	- v0.03 Remove an unneeded loop!
	- v0.02 Made the User-agent the same as the browser.
	- v0.02 Exits search for images once first thumbnail has been found	.
	- v0.02 Exits search for images once matching icon is found.
	- v0.02 Changed some variable names to make more sense.
*/
// ==UserScript==
// @name           TradeMe PhotoView
// @namespace      http://www.girlza.com/
// @include        https://www.trademe.co.nz/*
// @description    Show thumbnails for all listings in TradeMe
// @grant metadata
// @version 0.37.14
// @downloadURL https://update.greasyfork.org/scripts/1090/TradeMe%20PhotoView.user.js
// @updateURL https://update.greasyfork.org/scripts/1090/TradeMe%20PhotoView.meta.js
// ==/UserScript==
//This allows you to turn off unnecessary features
var showThumbs = true;
var showSnippets = true;
var showZoom = true;


function addCustomSearchResult (jNode) {
    
  
//Open Homes were bugging out
var z = document.getElementsByClassName('openhomes')
for (var i = 0; i < z.length; i++) {
    if (z[i].tagName == "LI") {
        z[i].style.width = '170px';
        z[i].style.textAlign = 'center';
        z[i].childNodes[1].style.width = '170px';
        z[i].childNodes[1].style.textAlign = 'center';
    }
}


//The prototype for the callback function that allows me to remember what link I was loading!
Function.prototype.bind = function(thisObject) {
    var method = this;
    var oldargs = [].slice.call(arguments, 1);
    return function() {
        var newargs = [].slice.call(arguments);
        return method.apply(thisObject, oldargs.concat(newargs));
    };
}

var allImgs, thisImg;
var globalTimer;

//First we load all the images of that little camera
allImgs = document.evaluate(
    "//img | //div[@class='image'] | //div[@class='image ']", //the name of the little camera icon
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
  
        
//Then we go through them one-by-one
for (var i = 0; i < allImgs.snapshotLength; i++) {
    
    var n = allImgs.snapshotItem(i).src;
    
    var bgIm = false
    
    if(typeof n === 'undefined'){n = allImgs.snapshotItem(i).style.backgroundImage;
                                 n = n.substring(4,n.length-1).replace(/["']/g, "");
                                 
                                 //console.log(n)
                                 //n = n.substring(5,n.length-2);
                                 bgIm = true;
                                
                                
                               }
    
    if (n.indexOf('hasPhoto_160x120.png') > -1) {
        thisImg = allImgs.snapshotItem(i); //the photos exist but no thumbnail
        thisImg.setAttribute('thumbnailnumber', i);
        //We need to request the page that the icon links to, to get it's thumbnail

        if (thisImg.parentNode.href) {

            var oReq = new XMLHttpRequest();
            oReq.open("GET", thisImg.parentNode.href);

            oReq.addEventListener("load", cbReplaceWithPhoto.bind({
                specificIcon: thisImg.parentNode
            }), false);
            oReq.send();

        }
    } else if (n.indexOf('/lv2/') > -1 || n.indexOf('/gv/') > -1 || n.indexOf('/med/') > -1 || n.indexOf('/tq/') > -1 || bgIm){
        thisImg = allImgs.snapshotItem(i); 
        thisImg.setAttribute('thumbnailnumber', i);
        
        addHover(thisImg, bgIm)
        
    }
}


//Curious design decision from TM in getting rid of the flag, so we've added the flags back... this is just for me really, so if you don't like it then tough! :-)
  
  
    allImgs = document.evaluate("//div[@class='reserve-text']/../..",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
    for (var i = 0; i < allImgs.snapshotLength; i++) {
      if (allImgs.snapshotItem(i).querySelector(".icon").innerText.trim() == "Reserve Met"){
      	//reserve met
      	var current = allImgs.snapshotItem(i).querySelector(".listingBidPrice").innerText;
        allImgs.snapshotItem(i).querySelector(".listingBidPrice").innerHTML = current + "<img src='/images/NewSearchCards/LVIcons/reserveMet.gif' style='padding-left:3px;' alt='' height='14'>"
      } else {
      	//reserve not met 
      	var current = allImgs.snapshotItem(i).querySelector(".listingBidPrice").innerText;
        allImgs.snapshotItem(i).querySelector(".listingBidPrice").innerHTML = current + "<img src='/images/NewSearchCards/LVIcons/noReserve.gif' style='padding-left:3px;' alt='' height='14'>"
      }  
		};
   	/*
    //the original buy now colours, switched off for the time being
    allImgs = document.evaluate("//div[@class='listingBuyNowPrice'] | //div[@class='listingBuyNowText']",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
    for (var i = 0; i < allImgs.snapshotLength; i++) {
    	allImgs.snapshotItem(i).style.color = "#cc6600"; 
		};*/
  

//Set the style up in the <HEAD> tag
var head = document.getElementsByTagName('head')[0];

style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.enlargement {visibility:hidden;position:absolute;z-index:100;top:20px;}\r\n.enlargement img {}';
head.appendChild(style);

var dimsz = document.getElementById("container").offsetLeft + document.getElementById("mainContent").offsetLeft

style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = ".imgBig {top:50px;position:absolute;max-width:100%;min-height:100%;margin-left:20px;left:0px;border:1px solid #000;box-shadow:0 0 17px #000;-moz-box-shadow:0 0 17px #000;-webkit-box-shadow:0 0 17px #000;}";
head.appendChild(style);

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function addHover(imgUse, bgIm){
//This handles the tooltip-like zoom function
    
    
    
            var zoomDiv = document.createElement('div');
            zoomDiv.setAttribute('id', "enlargement" + imgUse.getAttribute('thumbnailnumber'));
            zoomDiv.setAttribute('class', 'enlargement');
            document.body.appendChild(zoomDiv);
    
            //When mouse goes over it starts a timer.
            imgUse.addEventListener(
                'mouseover',
                function(event) {
                    var x = event.pageX;
                    var y = event.pageY
                    var divId = 'enlargement' + this.getAttribute('thumbnailnumber');

                    obj = document.getElementById(divId);
                    
                    var n = this.src;
                    if (bgIm){
                        n = this.style.backgroundImage;
                        n = n.substring(4,n.length-1).replace(/["']/g, "")
                        
                        var x1 = n.indexOf('photoserver')
                        var x2 = n.indexOf('/',x1+13)
                        
                        n = n.substring(0,x1+12)+"full"+n.substring(x2,n.length)
                    }                          
                    obj.innerHTML = "<img src='" + n.replace('/gv/', '/full/') + "'>";
                    obj.innerHTML = obj.innerHTML.replace('/lv2/', '/full/')
                    obj.innerHTML = obj.innerHTML.replace('/med/', '/full/')
                    obj.style.width = (dimsz - 20) + 'px'
                    obj.style.top = (window.pageYOffset + 100) + 'px';
              
                    document.getElementById(divId).childNodes[0].className="imgBig"
                    
                    globalTimer = window.setTimeout( //after 700msec the pic will become visible
                        function() {
                            showPopupDiv(x, y, divId);
                        },
                        200);
                },
                true);

            //Hide image and reset timer once mouse moves out
            imgUse.addEventListener('mouseout',
                function(event) {
                    window.clearTimeout(globalTimer);
                    document.getElementById('enlargement' + this.getAttribute('thumbnailnumber')).style.visibility = 'hidden';
                },
                true);

}

//This is the callback function that gets run when the itemDetailsPage has loaded
//It grabs the filename of the thumbnail, and replaces the icon with it.
function cbReplaceWithPhoto(rD) {

    //Borrowed some code from Gallery+. Thanks :-)
    var imgtag = /<img.*mainImage.*\/>/g.exec(rD.target.responseText);
    var imgsrc = /.*src="([^"]*)"/.exec(imgtag)

    if (imgsrc !== null) {
        replacementImg = document.createElement("img"); //replace it with this
        replacementImg.src = imgsrc[1].replace("\/tq\/", "\/lv2\/")

        var useThis = 0
        var foundIt = false

        while (foundIt == false) {
            if (useThis < this.specificIcon.childNodes.length) {
                if (this.specificIcon.childNodes[useThis].nodeName.toUpperCase() == "IMG") {
                    if (this.specificIcon.childNodes[useThis].hasAttribute("thumbnailnumber")) {
                        foundIt = true
                    }
                }
            }
            if (foundIt == false) {
                useThis = useThis + 1
            }
        }

        var iconH = Number(this.specificIcon.childNodes[useThis].style.height.replace(/[^\d\.\-]/g, '')) + "px"
        var iconW = Number(this.specificIcon.childNodes[useThis].style.width.replace(/[^\d\.\-]/g, '')) + "px"

        if (iconH == "0px") {iconH = "120px"}
        if (iconW == "0px") {iconW = "160px"}

        replacementImg.style.maxHeight = iconH
        replacementImg.style.maxWidth = iconW
        replacementImg.setAttribute('thumbnailnumber', this.specificIcon.childNodes[useThis].getAttribute('thumbnailnumber'));
        
        if (this.specificIcon.childNodes[useThis].id.indexOf("GalleryView")>-1) {
            replacementImg = this.specificIcon.childNodes[useThis]
        }

        //replace the icon with the thumbnail
        this.specificIcon.replaceChild(replacementImg, this.specificIcon.childNodes[useThis]);
        
        addHover(replacementImg)
        
    }
}

/* Function to popup the hidden div */
function showPopupDiv(triggerX, triggerY, divId) {
    obj = document.getElementById(divId);
    obj.style.visibility = "visible"; //make it visible
}
    
}

addCustomSearchResult();

waitForKeyElements (".supergrid-overlord, #ListViewList", addCustomSearchResult);  


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
      