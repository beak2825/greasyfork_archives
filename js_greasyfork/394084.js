// ==UserScript==
// @name         YT Trending Phone Number Removal Tool
// @namespace    https://greasyfork.org/en/scripts/394084-yt-trending-phone-number-removal-tool
// @version      1.1
// @description  Removes Phone Numbers from YouTube Trending Page video descriptions
// @author       TheBerzzeker
// @match        *://www.youtube.com/feed/trending*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394084/YT%20Trending%20Phone%20Number%20Removal%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/394084/YT%20Trending%20Phone%20Number%20Removal%20Tool.meta.js
// ==/UserScript==

function loadDescriptions(){

    var description_elements = document.getElementsByTagName("yt-formatted-string");

    for ( var i=0;i<description_elements.length;++i){
    GetPhoneNumber(description_elements[i]);
    }

}

function GetPhoneNumber(description_el){

var description = description_el.innerHTML;
var phone_vals = ["07","+4","+40","0 7","0.7","0-7"];
var modified = false;

    for(var i=0;i<phone_vals.length;++i){
    if(!description.includes(phone_vals[i])) continue;

        var index = description.indexOf(phone_vals[i]);

        HashNumbers(description_el,index);

        modified =true;

    }


    if(modified) GetPhoneNumber(description_el);

}

function HashNumbers(description_el,index){

var description = description_el.innerHTML;

    console.log(description);
    console.log(index);

var beginning=0,ending = description.length;

    console.log(beginning);
    console.log(ending);

    for(var i=index;i>=0;--i){
        if(description[i]>='a' && description[i]<='z') {beginning = i+1;break;}
        if(description[i]>='A' && description[i]<='Z') {beginning = i+1;break;}
    }

    for(i=index;i<description.length;++i){
        if(description[i]>='a' && description[i]<='z') {ending = i;break;}
        if(description[i]>='A' && description[i]<='Z') {ending = i;break;}
    }

    var a_str = description.substring(0,beginning);
    var b_str = description.substr(ending);

    var middle = ". ";
/*
    for(i = beginning;i<ending;++i){
        middle+="*";
    }
*/


    description_el.innerHTML=a_str+middle+b_str;

}

loadDescriptions();