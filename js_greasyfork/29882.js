// ==UserScript==
// @name        gazellegames GGN more BookmarkTags
// @namespace   gazellegames
// @description adds bundle tags to bookmark page (e.g. local multiplayer)| Greasemonkey 4.1: ✔ Tampermonkey 4.4: ✔ 
// @include     https://gazellegames.net/bookmarks.php
// @version     3.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29882/gazellegames%20GGN%20more%20BookmarkTags.user.js
// @updateURL https://update.greasyfork.org/scripts/29882/gazellegames%20GGN%20more%20BookmarkTags.meta.js
// ==/UserScript==
var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function getTorrentPage(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}



var titleList =  document.querySelectorAll('[title="View Torrent"]')

try{var cookieList =  JSON.parse(getCookie('cookieList'));}
catch(err){var cookieList = [];}


var storedList = [];

//if list from cookie is good we just take it
if (cookieList.length == titleList.length){
    for(var i=0;i<titleList.length;i++){
        titleList[i].innerHTML = titleList[i].innerHTML +'<br><div style="text-decoration: none; color: grey">'+ cookieList[i] + '</div>';
    }
    //refresh the cookie
    var json_str = JSON.stringify(cookieList);
    createCookie('cookieList', json_str, 60);
}
//list is shit, we make new one
else{
    for(i=0;i<titleList.length;i++){
        try{
            var xmlString = getTorrentPage(titleList[i].href);
            var re = /(<strong>Feature:<\/strong>.*?<\/div>)/;
            xmlString = xmlString.match(re) [0];
            xmlString = xmlString.replace(/<.*?>/g, '');
            //xmlString is the string with features
            storedList.push(xmlString);
            titleList[i].innerHTML = titleList[i].innerHTML +'<br><div style="text-decoration: none; color: grey">'+ xmlString + '</div>';
        }
        catch(err){
            storedList.push("");
            console.log('shit');
        }
    }

    //we set the generated values as cookie
    var json_str_1 = JSON.stringify(storedList);
    createCookie('cookieList', json_str_1, 60);
}








