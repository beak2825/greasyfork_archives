// ==UserScript==
// @name         Login Alert
// @version      0.1
// @description  Creates a popup to alert you if someone logs into your VPC. 
// @author       Anonymous
// @match        https://*.hackerexperience.com/logs
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/10680
// @downloadURL https://update.greasyfork.org/scripts/18575/Login%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/18575/Login%20Alert.meta.js
// ==/UserScript==

/* Parts of this code are directly taken from Hacker Experience Helper, so original credit goes to the writer of that where relevant */

if(window.self !== window.top) return;

Array.prototype.contains = function(s) { 
    return this.indexOf(s) !== -1; 
};
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

var savedText = GM_getValue("he_log", "").split(/\n/);
var isActivated = GM_getValue("he_active", "false") == "true";
var clearLogin = GM_getValue("he_clearlogin", "false") == "true";
var currentIP = GM_getValue('he_currentip');


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
            var arrayCheck = []; //sets an array to push text to. 


            //splits the array so we can check each element. 
            var newLine = line.split(' ');
            console.log(newLine.length); // testing purposes. 


            /* checks if the word after ip is logged 
if it is, pushes each item after that to our array.  */
            if (newLine[4] === "logged") {
                for (i = 4 ; i < newLine.length ; i++ ) {
                    arrayCheck.push(newLine[i]);
                }

            }
            var someoneLoggedIn = arrayCheck.join(' '); 


            if(someoneLoggedIn === "logged in as root" || someoneLoggedIn ==="logged in as ftp" || someoneLoggedIn ==="logged in as ssh") {
                alert("Warning " + newLine[3] + " logged into your system!!!");
            }  //alerts us.


            if(line.length < 10) continue;

            if(!savedText.contains(line))
            {
                savedText.push(line);   
            }
        }
        saveLog(savedText);
        setTimeout(refreshPage, 1500
                  );
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