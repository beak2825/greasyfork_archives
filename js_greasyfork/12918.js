// ==UserScript==
// @name         Log Scrapper
// @version      0.1.2
// @description  Don't Be Evil
// @author       Anonymous
// @match        http://*.hackerexperience.com/*
// @match        http://hackerexperience.com/*
// @match        https://*.hackerexperience.com/*
// @match        https://hackerexperience.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/10680
// @downloadURL https://update.greasyfork.org/scripts/12918/Log%20Scrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/12918/Log%20Scrapper.meta.js
// ==/UserScript==

if(window.self !== window.top) return;

Array.prototype.contains = function(s) { 
    return this.indexOf(s) !== -1; 
};
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

var savedText = GM_getValue("he_log", "").split(/\n/);
var isActivated = GM_getValue("he_active", "false") == "true";
var clearLogin = GM_getValue("he_clearlogin", "false") == "true";
var currentIP = GM_getValue('he_currentip');

//Get IP after short delay
setTimeout(function(){
    var IP = document.getElementsByClassName('header-ip-show')[0].innerText.trim();
    if(IP !== null && IP !== "" && IP !== currentIP){
        GM_setValue('he_currentip', IP);
        currentIP = IP;
        alert(IP);
    }
}, 500);
    
//Add button
var buttonText = 'Scrape Logs';
if(isActivated) {buttonText = "Stop Scraping";}
var node = document.createElement('div');
node.innerHTML = '<p>HE Helper</p><button id="scrapeButton" type="button">' + buttonText + '</button>';
node.setAttribute('id', 'hehelper');
document.body.appendChild(node);
document.getElementById ("scrapeButton").addEventListener ("click", ButtonClickAction, false);

GM_addStyle ( multilineStr ( function () {/*!
    #hehelper {
        position:               fixed;
        bottom:                    0;
        left:                   0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        z-index:                222;
        padding:                2px 2px;
    }
    #hehelper p {
        color:                  black;
        align:                  center;
    }
*/} ) );

//Check for logs
var textarea = document.getElementsByClassName("logarea")[0];
if(textarea !== undefined)
{
    var text = textarea.value.split(/\n/);
    if(isActivated){
        for(var i = 0; i < text.length; i++)
        {
            var line = text[i].trim();
            if(line === "") continue;
            if(line.length < 10) continue;
            if(!savedText.contains(line))
            {
                savedText.push(line);   
            }
        }
        saveLog(savedText);
        setTimeout(refreshPage, 4000);
    }
    else if(clearLogin && currentIP !== null)
    {
        var changed = false;
        var edited = "";
        for(var i = 0; i < text.length; i++)
        {
            if(text[i].contains(currentIP)){
                changed = true;
                continue;
            }
            var toAdd = text[i];
            if(i !== text.Length - 1) toAdd += "\n";
            edited += toAdd;
        }
        
        if(changed){
            textarea.value = edited;
            textarea.parentNode.submit();
        }
    }
}
else if(isActivated)
{
    setTimeout(refreshPage, 120000);
}

//Replace task link
var sidebar = document.getElementById("sidebar");
if(sidebar !== null){
    sidebar.getElementsByTagName("ul")[0].getElementsByTagName("a")[1].href="processes?page=all";
} else {
    isActivated = false;
}

//Add login button
var login = document.getElementById('loginbox');
if(login !== null){
    var tempDiv = document.createElement('div');
    tempDiv.setAttribute('style', 'width: 110px; margin:0 auto;');
    var loginClearButton = document.createElement('button');
    loginClearButton.innerHTML = 'Login & Clear';
    loginClearButton.setAttribute('type', 'button');
    loginClearButton.addEventListener("click", loginClearClick, false);
    tempDiv.appendChild(loginClearButton);
    login.parentNode.appendChild(tempDiv);
}

GM_setValue('he_clearlogin', 'false');

function refreshPage(){
    if(isActivated)
       location.reload();
}

function loginClearClick(cEvent)
{
    GM_setValue('he_clearlogin', 'true');
    document.getElementById('loginform').submit();
}

function saveLog()
{
    var temp = "";
    for(var i = 0; i < savedText.length; i++)
    {
        temp = temp + savedText[i] + "\n";
    }
    GM_setValue("he_log", temp.trim());
}

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
            ;
    return str;
}

function copyToClipboard(text) {
    var clipNode = document.createElement('div');
    clipNode.innerHTML = '<h>Logs Scraped:</h></br><textarea id="clipText"></textarea></br><button id="clipButton" type="button">Close</button>';
    clipNode.setAttribute('id', 'clipNode');
    document.body.appendChild(clipNode);
    document.getElementById ("clipButton").addEventListener ("click", clipButtonClickAction, false);
    document.getElementById('clipText').value = text;
    GM_addStyle ( multilineStr ( function () {/*!
    #clipNode {
        position:               fixed;
        bottom:                 0;
        left:                   0;
        top:                    0;
        right:                  0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                222;
        padding:                2px 2px;
        text-align:             center;
    }
    #clipNode textarea {
        width:                  80%;
        height:                 80%;
    }
*/} ) );
}

//Close
function clipButtonClickAction (zEvent) {
    document.body.removeChild(document.getElementById('clipNode'));
}

//Scrape button clicked
function ButtonClickAction (zEvent) {
    isActivated = !isActivated;
    GM_setValue("he_active", isActivated.toString());
    
    if(!isActivated){
        document.getElementById("scrapeButton").innerText = 'Scrape Logs';
        var temp = "";
        for(var i = 0; i < savedText.length; i++)
        {
            temp = temp + savedText[i] + "\n";
        }
        if(temp.trim() !== ""){
            copyToClipboard(temp.trim());
        }
        GM_setValue("he_log", "");
    } else {
        location.reload();
    }
}