// ==UserScript==
// @name GPX+: Userlist Opener
// @description Automatically opens users from the userlist to click
// @include *gpx.plus/users/*
// @version      1.0.1
// @license      MIT
// @grant        none
// @namespace Squornshellous Beta
// @downloadURL https://update.greasyfork.org/scripts/488330/GPX%2B%3A%20Userlist%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/488330/GPX%2B%3A%20Userlist%20Opener.meta.js
// ==/UserScript==

function addControlButton() {
    writeCookie("clickerActive",0);
    var container=document.createElement("div");
    container.innerHTML=`<style>
    #minmax, .label {
        font-size:12px;
    }
    #minmax .label {
        width:6.3em;
        text-align:right;
    }
    #minmax .number {
        width:0.75em;
        text-align:center;
        cursor:pointer;
    }
    #max .number:last-child, .opts div:last-child {
        border-bottom-right-radius:5px;
    }
    #min div, #max div {
        display:inline-block;
        padding:3px 5px 2px;
    }
    :is(.optsWrap, #minmax) .label, #minmax .number.active {
        font-weight:bold;
    }
    #min div, #max div, .optsWrap div div, .optsWrap .label, #clickerButton {
        background:rgb(220,9,9);
        border-bottom:1px solid white;
        border-right:1px solid white;
    }
    .optsWrap {
        width:fit-content;
        border:none;
    }
    .optsWrap .label {
        padding:3px 5px;
    }
    .opts {
        border:none !important;
        display:flex;
    }
    .opts div {
        padding:3px 5px;
        flex-grow:1;
        text-align:center;
    }
    #clickerButton {
        cursor:pointer;
        display:inline-block;
        font-size:20px;
        padding:0 5px 2px;
        border-bottom-right-radius:10px;
        border-bottom:1px solid white;
        border-right:1px solid white;
    }
    #minmax .number, #clickerButton, .opts div {
        opacity:0.75;
    }
    .optsWrap .active, #clickerButton.active, :is(.optsWrap, #minmax) .label, #minmax .number.active {
        opacity:1;
    }
    .opts .clickable {
        cursor:pointer;
    }
    #breakOpts, .optsWrap {
        display:flex;
    }
    .optsWrap {
        align-items:flex-start;
    }
    #breakOpts {
        flex-direction:column;
    }
    </style>`;
    var minmax=document.createElement("div");
    minmax.id="minmax";
    minmax.innerHTML="<div id=\"min\"><div class=\"label\">Party min:</div>"+minmaxButtons()+"</div><div id=\"max\"><div class=\"label\">Hatch max:</div>"+minmaxButtons()+"</div>";
    container.append(minmax);
    container.innerHTML+=`<div class="optsWrap">
    <div id="breakOpts" class="opts">
        <div class="label">Break on:</div>
        <div id="optsWalker" class="clickable">Walker</div>
        <div id="optsUnderground" class="clickable">Underground</div>
        <div id="optsExploration" class="clickable">Exploration</div>
    </div>
    <div class="opts" style="display:none;">
        <div id="optsBreak" class="clickable">Alert on break</div>
    </div>
</div>`;

    var button=document.createElement("div");
    button.id="clickerButton";
    button.innerHTML="🖰";
    container.append(button);

    container.style="position:absolute; top:0; left:0;";
    document.body.append(container);

    var min=readCookie("minCookie");
    if (!min) {
        min=0;
        writeCookie("minCookie",0);
    }
    document.querySelector("#min [value='"+min+"']").classList.add("active");
    var max=readCookie("maxCookie");
    if (!max) {
        max=6;
        writeCookie("maxCookie",6);
    }
    document.querySelector("#max [value='"+max+"']").classList.add("active");
    addButtonFunctions("min");
    addButtonFunctions("max");

    var defaults={"optsWalker":1,"optsUnderground":1,"optsExploration":1,/*"optsBreak":0,*/"clickerButton":0};
    Object.keys(defaults).forEach(buttonName=>{
        if (readCookie(buttonName+"_cookie")==null) writeCookie(buttonName+"_cookie",defaults[buttonName]);
        toggle(buttonName,0);
        document.querySelector("#"+buttonName).addEventListener("click",e=>{toggle(e.target.id,1)});
    });
    document.querySelector("#clickerButton").addEventListener("click",watch);

    if (readCookie("clickerButton_cookie")=="1") {
        watch();
        tryOpen();
    }
}
function minmaxButtons() {
    var result="";
    for (var i=0;i<7;i++) result+="<div class=\"number\" value=\""+i+"\">"+i+"</div>";
    return result;
}
function addButtonFunctions(whichOne) {
    var buttons=document.querySelectorAll("#"+whichOne+" .number");
    for (var i=0;i<buttons.length;i++) buttons[i].addEventListener("click",changeNumber);
}
function changeNumber() {
    var whichOne=this.parentElement.id;
    var number=this.getAttribute("value");
    document.querySelector("#"+whichOne+" .active").classList.remove("active");
    document.querySelector("#"+whichOne+" [value='"+number+"']").classList.add("active");
    writeCookie(whichOne+"Cookie",number);
}
function target(count) {
    console.log("hi");
    var targets=document.querySelectorAll('#partyTarget div');
    for (var i=0;i<targets.length;i++) {
        targets[i].style.fontWeight='normal';
        targets[i].style.opacity='0.66';
    }
    var target=document.querySelector("#partyTarget"+count);
    target.style.fontWeight='bold';
    target.style.opacity='1';
    writeCookie('partyTarget',count);
}
function toggle(elementName,invert) {
    var cookieName=elementName+"_cookie";
    var cookie=parseInt(readCookie(cookieName));
    if (invert==1) {
        cookie=1-cookie;
        writeCookie(cookieName,cookie);
    }
    setButton(elementName,cookie);
}
function setButton(elementName,state) {
    var button=document.getElementById(elementName);
    if (state==0) button.classList.remove("active");
    else button.classList.add("active");
}
function watch() {
    if (readCookie("clickerButton_cookie")==1) {
        var finish=document.getElementById("usersFeederFinish");
        var dialogs=document.getElementsByClassName("alertDialog");
        if (finish||dialogs.length>0) {
            setTimeout(function() {location.reload()},120000);//150000
        }
        else {
            var serverTime=parseInt(document.getElementById("headerTime").innerHTML.replace(/\n/g,"").replace(/.*:/,"").replace(/ .*/,""));
            var currentTime=new Date().getMinutes();
            if (serverTime>49&&currentTime<11) currentTime+=60;
            if (currentTime-serverTime>9) location.reload();
            else setTimeout(function() {watch(); tryOpen();},1000);
        }
    }
}
function tryOpen() {
    var partyMin=readCookie("minCookie");
    var hatchMax=readCookie("maxCookie");

    var partyCount=document.querySelector("#topNotifications div[data-notification=party]").innerHTML.replace(/[^0-9]/g,"");
    var hatchy=document.getElementById("notification-main");
    var underground=document.getElementById("notification-underground");
    var poketch=document.getElementById("notification-walker");
    var explore=document.getElementById("notification-explorations");
    var hatchReady=1;
    if (hatchy) if (hatchy.innerHTML.replace(/[^0-9]/g,"")>=hatchMax-(explore?1:0)) hatchReady=0;
    var walkerLv=0;
    if (poketch) walkerLv=parseInt(poketch.innerHTML);
    var explorationComplete=0;
    if (explore) if (explore.innerHTML.search(/[0-9]/)==-1) explorationComplete=1;

    if (
        hatchReady>0 &&
        partyCount>=partyMin &&
        (!document.querySelector("#optsUnderground").classList.contains("active") || !underground) &&
        (!document.querySelector("#optsWalker").classList.contains("active") || walkerLv<96) &&
        (!document.querySelector("#optsExploration").classList.contains("active") || explorationComplete==0)
    ) {
        var usersTable=document.getElementById("usersTable");
        if (usersTable.innerHTML!="") {
            var form=document.getElementById("usersOpen");
            var button=form.querySelector("input[type=submit]");
            if (readCookie("clickerActive")==0) {
                writeCookie("clickerActive",1);
                console.log("open list");
                button.click();

                if (document.getElementById("notification-shelter")) if (parseInt(document.getElementById("notification-shelter").innerText)<16) document.querySelector("#contentPanel").style.background="hotpink";
            }
        }
        else {
            setTimeout(function() {tryOpen()},1000);
        }
    }
    else {
        document.body.style.background="red";
        setTimeout(function() {location.reload()},120000);//150000
    }
}
function writeCookie(cookieName,cookieValue) {document.cookie=(cookieName+'='+cookieValue).replace(/&/g,"&a").replace(/;/g,"&s")+';expires=Thu, 31 Dec 2099 29:59:59 GMT;samesite=lax;domain=gpx.plus;path=/';}
function readCookie(name) {
	var readcookies=document.cookie.split(";");
	for (z=0;z<readcookies.length;z++) {
		var readcookie=readcookies[z].replace(/^ | $/g,"").replace(/ =|= /g,"=").split("=");
		if (name==readcookie[0]) return readcookie[1].replace(/&s/g,";").replace(/&a/g,"&");
	}
	return null;
}
addControlButton();