// ==UserScript==
// @name         bigoBar
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Spring
// @match        https://global-oss.zmqdez.com/front_end/index.html*
// @grant        none
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/416317/bigoBar.user.js
// @updateURL https://update.greasyfork.org/scripts/416317/bigoBar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here."..
let url = null; //生效的地址
let str = "";
let country = null;//国家码


let standard = {
    text:"<b>标准版</b>",
    css:{
        "position":"fixed",
        "top":"5vh",
        "right":"30vw",
        "background-color":"lightgreen",
        "color":"white",
        "display":"block",
        "width":"30vw",
        "height":"6vh",
        "font-size":"1.8em",
        "line-height":"2.4em",
        "text-align":"center"
    }
};
let Strict_version = {
    text:"<b>偏严版</b>",
    css:{
        "position":"fixed",
        "top":"5vh",
        "right":"30vw",
        "background-color":"yellow",
        "color":"black",
        "display":"block",
        "width":"30vw",
        "height":"6vh",
        "font-size":"1.8em",
        "line-height":"2.4em",
        "text-align":"center"
    }
};
let Strict_Edition = {
    text:"<b>标准版</b>",
    css:{
        "position":"fixed",
        "top":"5vh",
        "right":"50vw",
        "background-color":"black",
        "color":"white",
        "display":"block",
        "width":"30vw",
        "height":"6vh",
        "font-size":"1.8em",
        "line-height":"2.4em",
        "text-align":"center"
    }
};


//国家码对应规则版本
let config = {
    "FR":standard,
    "DE":standard,
    "IT":standard,
    "PL":standard,
    "ZA":standard,
    "BE":standard,
    "NL":standard,
    "SE":standard,
    "AT":standard,
    "RO":standard,
    "CH":standard,
    "SK":standard,
    "BA":standard,
    "BL":standard,
    "RU":standard,
    "UA":standard,
    "BY":standard,
    "GE":standard,
    "AM":standard,
    "AZ":standard,
    "TJ":standard,
    "TM":standard,
    "KG":standard,
    "UZ":standard,
    "KZ":standard,
    "BR":standard,
    "MX":standard,
    "AR":standard,
    "CO":standard,
    "BO":standard,
    "CL":standard,
    "CR":standard,
    "DO":standard,
    "EC":standard,
    "SV":standard,
    "GT":standard,
    "HN":standard,
    "NI":standard,
    "PA":standard,
    "PY":standard,
    "PE":standard,
    "ES":standard,
    "UY":standard,
    "VE":standard,
    "PR":standard,
    "AU":standard,
    "NZ":standard,
    "ID":standard,
    "PH":standard,
    "TH":standard,
    "VN":standard,
    "KH":standard,
    "MM":standard,
    "NP":standard,
    "AF":standard,
    "CY":standard,
    "KP":standard,
    "LK":standard,
    "MN":standard,
    "MV":standard,
    "BT":standard,
    "TL":standard,
    "AD":standard,
    "AL":standard,
    "BE":standard,
    "BG":standard,
    "CH":standard,
    "CZ":standard,
    "DK":standard,
    "EE":standard,
    "FI":standard,
    "GR":standard,
    "HU":standard,
    "IE":standard,
    "IS":standard,
    "LA":standard,
    "LI":standard,
    "LT":standard,
    "LU":standard,
    "LV":standard,
    "MC":standard,
    "MD":standard,
    "MT":standard,
    "NL":standard,
    "NO":standard,
    "AS":standard,
    "KY":standard,
    "MQ":standard,
    "VC":standard,
    "BM":standard,
    "CW":standard,
    "VG":standard,
    "AO":standard,
    "BF":standard,
    "BI":standard,
    "BJ":standard,
    "BW":standard,
    "CD":standard,
    "CF":standard,
    "CG":standard,
    "CM":standard,
    "ET":standard,
    "GA":standard,
    "GH":standard,
    "GM":standard,
    "GN":standard,
    "KE":standard,
    "LR":standard,
    "LS":standard,
    "MG":standard,
    "ML":standard,
    "MU":standard,
    "MW":standard,
    "MZ":standard,
    "NA":standard,
    "NE":standard,
    "SC":standard,
    "SZ":standard,
    "TD":standard,
    "TG":standard,
    "TZ":standard,
    "UG":standard,
    "ZM":standard,
    "ZW":standard,
    "CI":standard,
    "FM":standard,
    "NG":standard,
    "SS":standard,
    "RW":standard,
    "CV":standard,
    "GW":standard,
    "RE":standard,
    "ST":standard,
    "ER":standard,
    "XK":standard,
    "CK":standard,
    "FJ":standard,
    "GU":standard,
    "NR":standard,
    "PG":standard,
    "SB":standard,
    "TO":standard,
    "CX":standard,
    "MH":standard,
    "MP":standard,
    "NC":standard,
    "PF":standard,
    "PW":standard,
    "TK":standard,
    "KI":standard,
    "NU":standard,
    "WS":standard,
    "VU":standard,
    "GQ":standard,
    "PT":standard,
    "RO":standard,
    "RS":standard,
    "JM":standard,

    "TR":Strict_version,
    "US":Strict_version,
    "GB":Strict_version,
    "CA":Strict_version,
    "JP":Strict_version,
    "KR":Strict_version,
    "CN":Strict_version,
    "TW":Strict_version,
    "HK":Strict_version,
    "MO":Strict_version,
    "SG":Strict_version,
    "MY":Strict_version,

    "AE":Strict_Edition,
    "SA":Strict_Edition,
    "KW":Strict_Edition,
    "LB":Strict_Edition,
    "IQ":Strict_Edition,
    "PS":Strict_Edition,
    "JO":Strict_Edition,
    "YE":Strict_Edition,
    "OM":Strict_Edition,
    "SY":Strict_Edition,
    "QA":Strict_Edition,
    "BH":Strict_Edition,
    "EG":Strict_Edition,
    "SD":Strict_Edition,
    "LY":Strict_Edition,
    "TN":Strict_Edition,
    "DZ":Strict_Edition,
    "MA":Strict_Edition,
    "SO":Strict_Edition,
    "IR":Strict_Edition,
    "IL":Strict_Edition,
    "MR":Strict_Edition,
    "DJ":Strict_Edition,
    "KM":Strict_Edition,

    "PK":Strict_Edition,
    "BD":Strict_Edition,
    "IN":Strict_Edition,
}

function afterDom(){
    let html_1 = "<div id='tips'></div>"
    $("body").after(html_1);
}



afterDom();
function demo(){
    str = $(".review-info>li:nth-child(6)").text();
    if(str!=""){
        country = str.slice(7,9);
        $("#tips").html(config[country].text);
        $("#tips").css(config[country].css)
    }
    else{
        $("#tips").css({"display":"none"})
    }
}


setInterval(demo,1000);
})();