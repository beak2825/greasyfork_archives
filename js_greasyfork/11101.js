// ==UserScript==
// @name        Alternative pp data scaling
// @namespace   http://osu.ppy.sh/u/Kert
// @description Shows alternatively scaled pp data on osu!
// @include     http*://osu.ppy.sh/u/*
// @include     http*://osu.ppy.sh/p/pp*
// @grant       none
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/11101/Alternative%20pp%20data%20scaling.user.js
// @updateURL https://update.greasyfork.org/scripts/11101/Alternative%20pp%20data%20scaling.meta.js
// ==/UserScript==

// Super mega sophisticated formula
// Thanks to FullTablet http://osu.ppy.sh/u/Full_Tablet
function GetScaledPP(pp){
    // 20 = 1 / (1 - 0.95)
    // the magic number is mathematically justified due to how pp weightnings work
    return pp / 20;
}

// Profile pages
function ProfileProc(){
    // ensure the needed element loaded
    var a = null;
    while(a === null){
        a = document.getElementsByClassName("profileStatLine")[0].getElementsByTagName("b")[0].getElementsByTagName("a")[0];
    }

    var all = document.getElementsByClassName("profileStatLine")[0].getElementsByTagName("b")[0].innerHTML;
    var link = document.getElementsByClassName("profileStatLine")[0].getElementsByTagName("b")[0].getElementsByTagName("a")[0].outerHTML;

    var text = '';
    for (var i = link.length+2; i < all.length; i++){
        text += all[i];
    }
    // skip non-players
    if(text != "-"){   
        var arr = text.split('pp');
        var pp = arr[0].replace(",", "");
        var scaled = GetScaledPP(pp);
        var rounded = Math.round(scaled);
        var res = link + ": [" + rounded + "] " + arr[0] + "pp" + arr[1];
        document.getElementsByClassName("profileStatLine")[0].getElementsByTagName("b")[0].innerHTML = res;
        document.getElementsByClassName("profileStatLine")[0].getElementsByTagName("b")[0].setAttribute("title", "Scaled pp: [" + scaled +"]");
    }
}

// Performance ranking page
function PerformanceProc(){
    var tables = document.getElementsByClassName("beatmapListing")[0].getElementsByTagName("tr");
    for(var i = 1; i < tables.length; i++){
        var curTable =  document.getElementsByClassName("beatmapListing")[0].getElementsByTagName("tr")[i];
        var old = curTable.getElementsByTagName("td")[4].getElementsByTagName("span")[0].innerHTML;
        var arr = old.split('pp');
        var pp = arr[0].replace(",", "");
        var scaled = GetScaledPP(pp);
        var rounded = Math.round(scaled);
        var res = "[" + rounded + "] " + arr[0] + "pp";
        curTable.getElementsByTagName("td")[4].getElementsByTagName("span")[0].innerHTML = res;
        curTable.getElementsByTagName("td")[4].setAttribute("title", "Scaled pp: [" + scaled +"]");
    }   
}

window.addEventListener("load", function(e) {
    // Selecting which function to use
    if(document.URL.match(/http.:\/\/osu\.ppy\.sh\/u\//i))
        ProfileProc();
    else
        PerformanceProc();
}, false);