// ==UserScript==
// @name         Filmezz.eu - Link javító
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A linkek ugyanúgy jelennek meg, mint régen, nem pedig egy új oldalon.
// @author       GlassAndroctonus
// @grant        none
// @include      *://filmezz.eu/*
// @include      *://videohouse.me/*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/387017/Filmezzeu%20-%20Link%20jav%C3%ADt%C3%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/387017/Filmezzeu%20-%20Link%20jav%C3%ADt%C3%B3.meta.js
// ==/UserScript==
//If run-at not equal to document-start, then ads won't be blocked.
(function() {
    'use strict';

    //BROWSER DETECTION:
    var isFirefox = typeof InstallTrigger !== 'undefined';//FIREFOX=TRUE
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);//CHROME=TRUE
    var isEdge = !isIE && !!window.StyleMedia;//EDGE=TRUE
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;//OPERA=TRUE
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));//SAFARI=TRUE
    var isIE = /*@cc_on!@*/false || !!document.documentMode;//INTERNET_EXPLORER=TRUE
    var isBlink = (isChrome || isOpera) && !!window.CSS;//BLINK_ENGINE=TRUE

    if (isFirefox==true)//FIREFOX START
    {
        console.log("WEbsite name: "+document.location.href);
        var website=document.location.href;

        if (website.includes("filmezz.eu/online")==true)//Original Site -- Belső oldal
        {
            var linkExtractor=document.getElementsByClassName("col-md-6 col-sm-12")[0].innerHTML;
            linkExtractor=linkExtractor.substring(linkExtractor.indexOf("href=")+6,);
            linkExtractor=linkExtractor.substring(0,linkExtractor.indexOf("target")-2);



            var importantInner= document.getElementsByClassName("col-md-9 col-sm-12");
            var copytoinnerHTML='<h2 class="headline"><span>Linkek a filmhez</span></h2> <ul class="list-unstyled table-horizontal url-list"> <li class="head"> <div class="col-sm-4 col-xs-12">Szolgáltató</div> <div class="col-sm-4 col-xs-12">Info</div> <div class="col-sm-2 col-xs-6">Hibás link</div> <div class="col-sm-2 col-xs-6">Indítás</div> </li> </ul>'
            importantInner[0].innerHTML= copytoinnerHTML+'<iframe src="'+linkExtractor+'" width="847" height="500" frameborder="0"></iframe>';
        }
        else if (website.includes("videohouse")==true)//Iframe Stuff -- Külső oldal
        {
            //Count links number
            var temp = document.getElementsByClassName("col-md-9 col-sm-12");
            var count = (temp[0].innerHTML.match(/col-sm-4 col-xs-12 host/g) || []).length;
            console.log("SZÁM: "+count);

            //Remove useless stuff from the site(movie picture,description...)
            var importantOuter= document.getElementsByClassName("col-md-9 col-sm-12");
            document.body.innerHTML = importantOuter[0].innerHTML;//Replace the website
            window.parent.postMessage(count, '*');
            //Remove the links' heading
            var HeadLine=document.getElementsByTagName("h2");
            HeadLine[0].parentNode.removeChild(HeadLine[0]);
            var HeadLine2=document.getElementsByClassName("head");
            HeadLine2[0].parentNode.removeChild(HeadLine2[0]);
            //POPUP BLOCKING

            var linkList = document.querySelectorAll ("a");

            Array.prototype.forEach.call (linkList, function (link)
                                          {
                if (link.hostname.includes("deloplen.com"))
                {
                    //-- Block the link
                    link.href = "javascript:void(0)";
                    link.style = "text-decoration: none;background: #f3f315;";
                }
            } );

        }
    }//FIREFOX END

    // Your code here...
})();

