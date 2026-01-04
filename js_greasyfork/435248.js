// ==UserScript==
// @name         F2- Odds Convert
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try it!
// @author       Antony.kao
// @include       *MarketManagement/*
// @include       *://gmm*.gmm88.com/*
// @run-at        document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435248/F2-%20Odds%20Convert.user.js
// @updateURL https://update.greasyfork.org/scripts/435248/F2-%20Odds%20Convert.meta.js
// ==/UserScript==

(function() {
    if(UrlContains("MarketManagement")){
    }
    $("body").keydown(function(e){
         //now we caught the key code!!
         var keyCode = e.keyCode || e.which;
         if(keyCode == 113) // F2
         {
             //well you need keep on mind that your browser use some keys
             //to call some function, so we'll prevent this
             e.preventDefault();

             if($("[name='youyou']").length >0)
             {
                 $("[name='youyou']").remove();
                 return;
             }

            var oddsdiv = $("tr:not([isalgorow])").find("div.odds,div.oddsnonlink").each(function(i, obj) {
                var odds = $(this).find("a").html();
                var newodds = 0.00;
                //console.log(fmtNumber(odds));
                if(fmtNumber(odds) > 1.00)
                {
                    newodds = " M"+ dec2Malay(odds);
                    if(newodds.indexOf("NaN") < 0){
                        $(this).append("<span name='youyou' style = 'background:#E1C4C4'>"+newodds+" </span>");
                    }
                }
                else
                {
                    newodds = " E"+ Malay2dec(odds);
                    if(newodds.indexOf("NaN") < 0){
                        $(this).append("<span name='youyou' style = 'background:#ffef96'>"+newodds+" </span>");
                    }
                }
            });
         }
    });
    // Your code here...
})();

function UrlContains(urlfragment){
    return document.URL.indexOf(urlfragment) != -1;
}

function dec2US(myDec) {
    var myUS;
    myDec = parseFloat(myDec);
    if (myDec <= 1 || myDec == NaN) {
        myUS = NaN;
    } else if (myDec < 2) {
        myUS = -100 / (myDec - 1);
    } else {
        myUS = (myDec - 1) * 100;
    }
    return (myUS > 0 ? "+" : "") + Math.round(myUS * 100) / 100;
}

function US2dec(myUS) {
    var myDec;
    myUS = parseFloat(myUS);
    if (Math.abs(myUS) < 100 || myUS == NaN) {
        myDec = NaN;
    } else if (myUS > 0) {
        myDec = 1 + myUS / 100;
    } else {
        myDec = 1 - 100 / myUS;
    }
    return myDec.toFixed(4);
}

function dec2frac(dec) {
    dec = parseFloat(dec - 1);
    var myBestFrac = Math.round(dec) + "/" + 1;
    var myBestFracVal = Math.round(dec);
    var myBestErr = Math.abs(myBestFracVal - dec);
    for (var i = 2; i <= 200; i++) {
        var myFracVal = Math.round(dec * i) / i;
        var myErr = Math.abs(myFracVal - dec);
        if (myErr < myBestErr) {
            myBestFrac = Math.round(dec * i) + "/" + i;
            myBestFracVal = myFracVal;
            if (myErr == 0) break;
            myBestErr = myErr;
        }
    }
    return (myBestFrac);
}

function frac2dec(frac) {
    var myArr = frac.split(/\//);
    myArr[1] = myArr[1] == undefined ? 1 : myArr[1];
    return ((myArr[0] / myArr[1] + 1).toFixed(4));
}

function prob2dec(prob) {
    return (1 / fmtNumber(prob)).toFixed(4);
}

function dec2prob(dec) {
    return fmtPercent(1 / dec);
}

function HK2dec(myHK) {
    var myDec;
    myHK = parseFloat(myHK);
    if (myHK <= 0 || myHK == NaN) {
        myDec = NaN;
    } else {
        myDec = (myHK + 1);
    }
    return myDec.toFixed(4);
}

function dec2HK(myDec) {
    var myHK;
    myDec = parseFloat(myDec);
    if (myDec <= 1 || myDec == NaN) {
        myHK = NaN;
    } else {
        myHK = (myDec - 1);
    }
    return myHK.toFixed(4);
}

function Indo2dec(myIndo) {
    var myDec;
    myIndo = parseFloat(myIndo);
    if (myIndo == NaN || Math.abs(myIndo) < 1) {
        myDec = NaN;
    } else if (myIndo >= 1) {
        myDec = (myIndo + 1);
    } else {
        myDec = 1 - 1 / myIndo;
    }
    return myDec.toFixed(4);
}

function dec2Indo(myDec) {
    var myIndo;
    myDec = parseFloat(myDec);
    if (myDec <= 1 || myDec == NaN) {
        myIndo = NaN;
    } else if (myDec >= 2) {
        myIndo = (myDec - 1);
    } else {
        myIndo = 1 / (1 - myDec);
    }
    return myIndo.toFixed(4);
}

function Malay2dec(myMalay) {
    var myDec;
    myMalay = parseFloat(myMalay);
    if (myMalay == NaN || myMalay > 1 || myMalay == 0) {
        myDec = NaN;
    } else if (myMalay > 0) {
        myDec = (myMalay + 1);
    } else {
        myDec = 1 - 1 / myMalay;
    }
    return myDec.toFixed(4);
}

function dec2Malay(myDec) {
    var myMalay;
    myDec = parseFloat(myDec);
    if (myDec <= 1 || myDec == NaN) {
        myMalay = NaN;
    } else if (myDec <= 2) {
        myMalay = (myDec - 1);
    } else {
        myMalay = 1 / (1 - myDec);
    }
    return myMalay.toFixed(4).padStart(7);
}

function fmtNumber(myString) {
    myString = "" + myString;
    myString = myString.replace(/\$/g, "");
    var myNum = myString.replace(/\,/g, "");
    if (myString.match(/\%$/g, "")) {
        myNum = myString.replace(/\%$/g, "")
        myNum = parseFloat(myNum) / 100;
    }
    return (1 * myNum);
}

function fmtPercent(myNum) {
    if (("" + myNum).match(/\%$/g, "")) {
        myNum = myNum.replace(/\%$/g, "");
        myNum /= 100;
    }
    return (((myNum * 100).toFixed(2)) + "%");
}



