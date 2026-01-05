// ==UserScript==
// @name           GHQEditor
// @namespace      GHQEditor
// @author         Jabroni1134
// @description    GHQ Site Editor for Chrome and Firefox
// @include        http://*.ghqnet.com/*
// @include        https://*.ghqnet.com/*
// @match          http://*.ghqnet.com/*
// @match          https://*.ghqnet.com/*
// @version        2.23
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_listValues
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/27100/GHQEditor.user.js
// @updateURL https://update.greasyfork.org/scripts/27100/GHQEditor.meta.js
// ==/UserScript==

var scriptVersion=2.22;
var ChangeLog = scriptVersion+" Change Log: *Fixed to allow GHQ to work with and without the HTTPS";
/*
----------------------
Disclaimer
----------------------
Certain parts of this script are taken from other similar projects, all rights
 on those sections are owned by their respective creators.
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
For a full copy of the GNU General Public License, see
http://www.gnu.org/licenses/.
*/
var DEBUGNEWCODE = 0;

var scriptName='GHQEditor';
var scriptId='74664';


var path = window.location.toString();					// get the URL of the current page
var page = path.substring(0, path.indexOf('.asp'));		// extract page name from URL
page = page.substring(page.lastIndexOf('/')+1);		// extract page name from URL

var browser = 'Firefox';
var isChrome = !!window.chrome && !!window.chrome.webstore;
if (isChrome) {
    browser = 'Chrome';
}


if(!GM_getValue('UNIQUEKEY',false)){
    var rand = Math.floor(Math.random()*10000000000000);
    GM_setValue('UNIQUEKEY',rand.toString());
}
var UNIQUEKEY = GM_getValue('UNIQUEKEY', false);

//==========================================
//Debug Setup
//==========================================
var DEBUG_KEY = "config_debug";
var LOG_LEVEL_KEY = "config_logLevel";

var LOG_LEVEL_DEBUG = 1;
var LOG_LEVEL_INFO = 2;
var LOG_LEVEL_WARN = 3;
var LOG_LEVEL_ERROR = 4;

var location = window.location.href;
var LOG_LEVEL = getSetting(LOG_LEVEL_KEY,0);

if(!getSetting(DEBUG_KEY,false)) LOG_LEVEL = 0;

try{
    var console = {
        log: function () // Basic logging function for loading etc
        {
            if( LOG_LEVEL >= 1 ) { notify( "\nError: "+arguments[0] ,MESSAGE_CLASS_ERROR); return; }
        },
        info: function () // Show data relevent to any functions being worked on
        {
            if( LOG_LEVEL >= 2 ) { notify( "Location: "+location+" \nError: "+arguments[0] ,MESSAGE_CLASS_ERROR); return; }
        },
        warn: function () // Show any non-fatal errors
        {
            if( LOG_LEVEL >= 3 ) { notify( "Location: "+location+" \nError: "+arguments[0] ,MESSAGE_CLASS_ERROR); return; }
        },
        error: function () // If error is breaking entire script
        {
            if( LOG_LEVEL == 4 ) { notify( "Location: "+location+" \nError: "+arguments[0] ,MESSAGE_CLASS_ERROR); return; }
        }
    };

} catch (e) {notify("Console exception: "+e,MESSAGE_CLASS_ERROR);}

if(document.title.indexOf("Error")!= -1) return; // try to break out if connections down to avoid messing up error page

//==========================================
//Get/Set Functions
//Prefixes server name to settings
//==========================================
function getSetting(key,value){
    try
    {
        if (typeof value == "float") value+="";
        return GM_getValue(getClan()+"_"+key,value);
    } catch (e) { console.warn ("Line Number: "+e.lineNumber+"\n getSetting error: "+e); console.info("\nKey: "+key+"\nValue: "+value); }
}

function setSetting(key,value){
    try
    {
        if (typeof value == "float") value+="";
        return GM_setValue(getClan()+"_"+key,value);
    } catch (e) { console.log ("Line Number: "+e.lineNumber+"\n setSetting error: "+e); console.log("\nKey: "+key+"\nValue: "+value); }
}

// Simple replacement of getelementbyid with $ to save typing
function $(variable){
    if(!variable) return;
    if (document.getElementById(variable)) return document.getElementById(variable);
}
function $n(variable){
    if(!variable) return;
    if (document.getElementsByName(variable)) return document.getElementsByName(variable);
}
//==========================================
//-----------Preset Definitions-------------
//==========================================
//NOTE: These are simpy defaults. There's no need to edit these here in the script.
var MESSAGE_CLASS = "notifier";
var MESSAGE_CLASS_ERROR = "notifierError";

GM_addStyle(+
            '.notifier {background-color: Black;border: solid 2px;color: red;padding: 20px 20px 20px 20px;}}'+
            '.notifierError {background-color: Black;border: solid 2px;color: red;padding: 10px 10px 10px 10px;}}'+
            'hr.cphr {color: orange;  width: 400px;}'+
            '.cpscripttimes {text-align: center;margin:0 auto;width:200px;background-color: #191919;border: #333333 solid 1px;padding-bottom: 10px;color: white;margin-top: 10px;font-size: 8px;opacity: 0.82;  z-index: 0;}'+
            '#gm_update_alert {position: relative;top: 0px;left: 0px;margin:0 auto;width:'+getTableWidth()+'px;background-color: #191919;text-align: center;font-size: 11px;font-family: Tahoma;border: #333333 solid 1px;margin-bottom: 10px;padding-left: 0px;padding-right: 0px;padding-top: 10px;padding-bottom: 10px;opacity: 0.82;color: white;}'+
            '.gm_update_alert_buttons {'+
            '  position: relative;'+
            '  top: -5px;'+
            '  margin: 5px;'+
            '}'+
            '#gm_update_alert_button_close {'+
            '  position: absolute;'+
            '  right: 20px;'+
            '  top: 20px;'+
            '  padding: 3px 5px 3px 5px;'+
            '  border-style: outset;'+
            '  border-width: thin;'+
            '  z-index: 11;'+
            '  background-color: orange;'+
            '  color: #FFFFFF;'+
            '  cursor:pointer;'+
            '}'+
            '.gm_update_alert_buttons span, .gm_update_alert_buttons span a  {'+
            '  text-decoration:underline;'+
            '  color: #003399;'+
            '  font-weight: bold;'+
            '  cursor:pointer;'+
            '}'+
            '.gm_update_alert_buttons span a:hover  {'+
            '  text-decoration:underline;'+
            '  color: #990033;'+
            '  font-weight: bold;'+
            '  cursor:pointer;'+
            '}'+
            '#gm_update_title {'+
            '  font-weight:bold;'+
            '  color:orange;'+
            '}'+
            '.right_Menu {'+
            '	color: gold;'+
            '	font-weight: bold;'+
            '  font-size: 11px;'+
            '  cursor:pointer;'+
            '}'+
            '.right_MenuHeader {'+
            '	color: gold;'+
            '	font-weight: bold;'+
            '  font-size: 11px;'+
            '}'+
            '.left_Menu {'+
            '	color: #DDDDDD;'+
            '  font-size: 12px;'+
            '	font-weight: bold;'+
            '}');

var totalStart = new Date();
var startTime = totalStart;
var endTime;
var timerMessage = "";

//==========================================
//Returns the clan abbr
//==========================================

var _clan = null;
function getClan(){
    //console.log("retreiving clan. Clan: "+_clan);
    if(_clan == null)
    {
        //console.log("setting clan. Location: "+window.location);
        var regex = /http:\/\/([a-z]+)\.ghqnet\.com/;
        var result = regex.exec(document.referrer);
        //console.log("Result: "+result);
        if(result == null)
        {
            //console.log(document.referrer);
            regex = /http:\/\/([a-z]+)\.ghqnet\.com/;
            result = regex.exec(document.URL);
        }
        if (result != null)
        {
            _clan = result[1];
        }
        //        else console.log ("Referrer error");
    }
    //console.log("Clan: "+_clan);
    return _clan;
}

//==========================================
//---------Display Functions----------------
//==========================================

function zeroPad(num){
    if(num <= 9){
        return "0" + num;
    }
    return num;
}

function getTableWidth(){
    var tables = document.evaluate(
        "//table[@class='top']",
        document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    //console.log('Found '+ tables.snapshotLength + ' tables.');
    if(tables.snapshotLength==0) return 900;
    var topTable = tables.snapshotItem(0);
    return topTable.getAttribute("width");
}

function URLDecode (encodedString) {
    var output = encodedString;
    var binVal, thisString;
    var myregexp = /(%[^%]{2})/;
    while ((match = myregexp.exec(output)) != null
           && match.length > 1
           && match[1] != '') {
        binVal = parseInt(match[1].substr(1),16);
        thisString = String.fromCharCode(binVal);
        output = output.replace(match[1], thisString);
    }
    return output;
}

//Notifier Utility Code
//http://javascript.nwbox.com/asyncAlert/
//-----------------------------------
var notifycount = 1;
function notify(m,c){
    if($('Message'))
    {
        document.body.removeChild($('Message'));
    }
    //  create a block element
    var b=document.createElement('div');
    b.id='Message';
    b.className=c||'';
    b.style.cssText='position:absolute;white-space:nowrap;z-index:10;';
    //  classname not passed, set default classname
    if(b.className.length==0){
        b.className = MESSAGE_CLASS;
    }
    //  insert block in to body
    b=document.body.insertBefore(b,document.body.firstChild);
    //  write HTML fragment to it
    b.innerHTML=m;
    //  save width/height before hiding
    var bw=b.offsetWidth;
    var bh=b.offsetHeight;
    //  hide, move and then show
    b.style.display='none';
    b.style.top = (document.body.clientHeight/2 + window.pageYOffset - bh/2)+"px";
    b.style.left = (document.body.clientWidth/2 + window.pageXOffset - bw/2)+"px";

    //console.log( b.style.top);
    //console.log("window height: "+document.body.clientHeight);
    //console.log("window width: "+document.body.clientWidth);
    //console.log("window scroll x: "+window.pageXOffset);
    //console.log("window scroll y: "+window.pageYOffset);

    b.style.display='block';
    var duration = 4000;
    var endOpacity = 0;
    if(c==MESSAGE_CLASS_ERROR)
    {
        b.className = "notifierError";
        b.id='errorMessage';
        var pos = notifycount * 40;
        b.style.top = (document.body.clientHeight/2 + window.pageYOffset - bh/2) - (400 - pos);
        duration = 4000;
        if(DEBUGNEWCODE) duration = 8000;
        endOpacity = 50;
    }

    notifycount++;
    // fadeout block if supported
    setFading(b,100,endOpacity,duration,function(){document.body.removeChild(b);});
}

// apply a fading effect to an object
// by applying changes to its style
// @o = object style
// @b = begin opacity
// @e = end opacity
// @d = duration (millisec)
// @f = function (optional)
function setFading(o,b,e,d,f){
    var t=setInterval(
        function(){
            b=stepFX(b,e,2);
            setOpacity(o,b/100);
            if(b==e){
                if(t){clearInterval(t);t=null;}
                if(typeof f=='function'){f();}
            }
        },d/20
    );
}
// set opacity for element
// @e element
// @o opacity
function setOpacity(e,o){
    // for IE
    e.style.filter='alpha(opacity='+o*100+')';
    // for others
    e.style.opacity=o;
}

// increment/decrement value in steps
// checking for begin and end limits
//@b begin
//@e end
//@s step
function stepFX(b,e,s){
    return b>e?b-s>e?b-s:e:b<e?b+s<e?b+s:e:b;
}

function insertNotification(message){
    if (message != null)
    {
        var notification = document.createElement("div");
        notification.setAttribute('id', 'gm_update_alert');
        var close = document.createElement("div");
        close.setAttribute('id', 'gm_update_alert_button_close');
        close.innerHTML = "Click to hide";
        close.addEventListener('click', function(event) {
            document.body.removeChild($('gm_update_alert'));
            document.body.removeChild($('gm_update_alert_button_close'));
        }, true);
        notification.innerHTML = ''
            +'  <div id="gm_update_title">GHQEditor Notification</div>'
            +'  <hr class="cphr" /><p>' + message
            +'</p>';
        notification.appendChild(close);
        document.body.insertBefore(notification, document.body.firstChild);
    }
}

function cleanBoards(){
    var thisTime = new Date().getTime();
    var clean = thisTime - 60*60*24;
    if(getSetting( 'LastCleaned', '0' ) < clean){
        var keys = GM_listValues();
        //var curTime = new Date().getTime();
        var youngestTime = curTime - 60*60*24*8*1000;
        for(var i=0; i<keys.length; ++i){
            if(keys[i].substr(0,6) == 'Posts_'){
                var Posts = getSetting( keys[i], ':' );
                var postarr = Posts.split(':');
                for(var x=0; x<postarr.length; ++x){
                    if(postarr[x] == ''){ continue; }
                    var lastReadTime = postarr[x].split('-')[1];
                    if(youngestTime >= lastReadTime){
                        postarr.splice(x, 1);
                        x--;
                    }
                }
                Posts = postarr.join(':');
                setSetting( keys[i], Posts );
            }
        }
        setSetting( 'LastCleaned', thisTime.toString() );
    }
}




//-----------------------------------
//Auto Launch count down script
//-----------------------------------

function timeToCounter(milliseconds){
    milliseconds = milliseconds/1000;
    var h = Math.floor(milliseconds/3600);
    var m = Math.floor((milliseconds % 3600)/60);
    var s = Math.floor((milliseconds % 3600) % 60);
    var counterString = "";
    if(h > 0)
        counterString += h+"h ";
    if(m > 0)
        counterString += m+"m ";
    if(s > 0)
        counterString += s+"s";
    return counterString;
}

//-----------------------------------
//End Auto Launch count down script
//-----------------------------------
//==========================================
// Check if new install
//==========================================
function installCheck(){
    try{
        var OldVersion = parseFloat(GM_getValue("scriptVersion",0+""));
        var NewVersion = parseFloat(scriptVersion);
        var LastMessage = GM_getValue("scriptLastMessage",'');
        var LatestVersion = 0.0;
        var lastCheck = parseInt(GM_getValue("updateCheckTime",0+""));
        var currTime = (new Date).getTime();
        //console.log("LastChecked: " + lastCheck);
        //console.log("Current Time: " + currTime);
        //console.log("Difference: " + (currTime - lastCheck));
        //console.log(scriptVersion);
        var Clan_Clan = getClan();
        if (OldVersion==null || OldVersion==""){
            GM_setValue("scriptVersion",NewVersion+"");
            insertNotification("You have sucessfully installed "+scriptName+" Version: "+NewVersion+" to your web browser.<br /><br/>"+ChangeLog);
            return;
        } else if (NewVersion>OldVersion){
            GM_setValue("scriptVersion",NewVersion+"");
            insertNotification("You have sucessfully upgraded "+scriptName+" From ("+OldVersion+") To ("+NewVersion+").<br/><br/>"+ChangeLog);
        }
        delete OldVersion;
        delete NewVersion;
        delete LatestVersion;
        delete lastCheck;
        delete currTime;
    } catch (e) { console.log ("Line Number: "+e.lineNumber+"\ninstallCheck(): "+e); }
}

//==========================================
//Config Page
//==========================================

var ANIMATE_SERVER_TIME_KEY = "config_animateServerTime";
var GAME_TIME_SHOW_KEY = "config_gameTime";
var LOCAL_TIME_SHOW_KEY = "config_localTime";
var HOUR24_KEY = "config_24Hour";
var POST_AREA_KEY = "config_postArea";
var LEFT_MENU_KEY = "config_leftMenu";
var NEW_POSTS_KEY = "config_newPosts";
var TARGET_SELECTOR_KEY = "config_targetSelector";
var BOT_LIST_KEY = "config_botlist";
var EDIT_USER_KEY = "config_editUser";
var SITE_MANAGER_KEY = "config_siteManager";
var GHQEDITOR_HEADER = "config_ghqeditorHeader";

function configBody(){
    var url = location;
    GM_addStyle('.configHeading {'
                +'	color: gold;'
                +'	font-weight: bold;'
                +'}'
                +'.featureName {'
                +'	color: #EEDC82;'
                +'}'
                +'.subFeatureName {'
                +'	color: #8B814C;'
                +'	padding-left:20'
                +'}'
                +'.footnote {'
                +'	color: gold;'
                +'	font-weight: bold;'
                +'}');
    var width = getTableWidth();
    if (width<900) width = 900;
    var newbody = "<div align='center'>"+
        "<h2>GHQEditor - Settings</h2>"+
        "<small>Script Version: "+scriptVersion+"<span id='pageDate'></span></small> <br/>"+
        "<table width='"+width+"'>"+
        "<tr bgcolor='#222222'><th width='230' colspan='2'>Feature</th><th>Description</th></tr>";

    newbody = newbody +"<tr bgcolor='#222222'><td colspan='3' class='configHeading'>General</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_ghqeditorHeader' /> Move GHQEditor Header</td>"+
        "<td style='padding-left:20'>Displays the \"GHQEditor Settings\" and \"GHQEditor Website\" at the bottom of every page instead of in the Header.</td></tr>";

    newbody = newbody +"<tr bgcolor='#222222'><td colspan='3' class='configHeading'>Times</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_24Hour' /> 24 Hour Format</td>"+
        "<td style='padding-left:20'>Displays clocks in a 24 Hour format instead of AM/PM.</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_animateServerTime' /> Animate Times</td>"+
        "<td style='padding-left:20'>Display constantly updated server time.</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_gameTime' /> Game Time</td>"+
        "<td style='padding-left:20'>Shows additional timer to show EarthEmpires GameTime.</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_localTime' /> Local Time</td>"+
        "<td style='padding-left:20'>Shows additional timer to show your current local time.</td></tr>";

    newbody = newbody +"<tr bgcolor='#222222'><td colspan='3' class='configHeading'>Page Changes</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_newPosts' /> Show New Posts</td>"+
        "<td style='padding-left:20'>Tracks all New Posts on boards and posts a \"New Post\" Image next to topics with new posts.<br>*All posts older then a week will not be shown as \"New\"</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_leftMenu' /> Left Menu</td>"+
        "<td style='padding-left:20'>Allows user you decide what links to show and what not to.</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_postArea' /> PostArea</td>"+
        "<td style='padding-left:20'>Augments the PostArea of Boards to include extra information like HTML quicklinks.</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_editUser' /> Edit Users</td>"+
        "<td style='padding-left:20'>Adds groups and other usefull information to the page.</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_siteManager' /> Site Manager</td>"+
        "<td style='padding-left:20'>Adds an easier way to edit the header of a site.</td></tr>";


    newbody = newbody +"<tr bgcolor='#222222'><td colspan='5' class='configHeading'>Earth Empire GHQ Sites (Only for EarthEmpire Sites)</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_targetSelector' /> Target Selector</td>"+
        "<td style='padding-left:20'>Adds extra options and coloring to the Target Selector page.</td></tr>"+

        "<tr bgcolor='#222222'><td class='featureName' colspan='2'><input type='checkbox' id='config_botlist' /> Bot List</td>"+
        "<td style='padding-left:20'>Adds extra options and coloring to the Bot Selector/Land Grabs page.</td></tr>";

    newbody = newbody +"<tr  bgcolor='#222222'><td colspan='3' align='center'><input id='saveButton' type=submit name='Save' value='Save' /> - <input id='resetButton' type=submit name='Reset to defaults' value='Reset to defaults' /></td></tr></table>"+
        "<a id='backLink' href='"+url+"'>Return to GHQ</a><br><br>"+


        "<table width='"+width+"'>";

    newbody = newbody +"<tr bgcolor='#222222'><td colspan='2' class='configHeading'>Board Monitoring<br>GHQEditor will not check for new posts on these boards<br>NOTE: This change will not take affect until GHQ is competely reloaded.</td></tr>"+
        "<tr bgcolor='#222222'><th>Do NOT Monitor Board</th><th>Description</th></tr>";

    var links = getSetting( 'menuBoards', '' );
    var linksarr = links.split('::::::');
    var boardsignore = getSetting( 'boards_ignore', ' ' );

    if(linksarr.length != 0){
        for(var i=0; i<linksarr.length; ++i){
            if(boardsignore.indexOf('::::::'+linksarr[i]+'::::::') != -1){
                checked = 'checked';
            }else{
                checked = '';
            }
            newbody = newbody +"<tr bgcolor='#222222'><td class='featureName'><input type='checkbox' Name='config_ignoreBoard' value='"+linksarr[i]+"' "+checked+"/> "+linksarr[i]+"</td>"+
                "<td style='padding-left:20'>Ignore Board when searching for new Posts?</td></tr>";
        }
    }

    newbody = newbody +"<tr bgcolor='#222222'><td colspan='2' align='center'><input id='saveButton2' type=submit name='Save' value='Save' /> - <input id='resetButton' type=submit name='Reset to defaults' value='Reset to defaults' /></td></tr>";
    newbody = newbody +"</table>"+
        "<small>GHQEditor created by Jabroni1134. Portions of the script are from Vigs AE Script (Config Page, Popups, Alerts)</small><br /><br />"+

        "<br /><br /><a id='backLink' href='"+url+"'>Return to GHQ</a>"+
        "</div>";
    return newbody;
}
function showConfig(){
    document.body.innerHTML = "<html><body background='' bgcolor='black' link='#00C0FF' text='#DDDDDD' vlink='#d3d3d3'>";
    document.body.appendChild(Title);
    document.body.innerHTML = document.body.innerHTML+configBody()+"</body></html>";
    loadConfig();
    $('saveButton').addEventListener('click', function(event) {
        saveConfig();
    }
                                     , true);
    $('saveButton2').addEventListener('click', function(event) {
        saveConfig();
    }
                                      , true);
    $('resetButton').addEventListener('click', function(event) {
        resetConfig();
    }
                                      , true);
}

//==========================================
//Save/Load Config
//==========================================

function saveConfig(){
    //console.log("Saving config");
    try{
        setSetting(ANIMATE_SERVER_TIME_KEY,$(ANIMATE_SERVER_TIME_KEY).checked);
        setSetting(LOCAL_TIME_SHOW_KEY,$(LOCAL_TIME_SHOW_KEY).checked);
        setSetting(GAME_TIME_SHOW_KEY,$(GAME_TIME_SHOW_KEY).checked);
        setSetting(HOUR24_KEY,$(HOUR24_KEY).checked);
        setSetting(POST_AREA_KEY,$(POST_AREA_KEY).checked);
        setSetting(LEFT_MENU_KEY,$(LEFT_MENU_KEY).checked);
        setSetting(NEW_POSTS_KEY,$(NEW_POSTS_KEY).checked);
        setSetting(TARGET_SELECTOR_KEY,$(TARGET_SELECTOR_KEY).checked);
        setSetting(BOT_LIST_KEY,$(BOT_LIST_KEY).checked);
        setSetting(EDIT_USER_KEY,$(EDIT_USER_KEY).checked);
        setSetting(SITE_MANAGER_KEY,$(SITE_MANAGER_KEY).checked);
        setSetting(GHQEDITOR_HEADER,$(GHQEDITOR_HEADER).checked);
        setSetting(DEBUG_KEY,$(DEBUG_KEY).checked);

        var logLevel = LOG_LEVEL_WARN;
        var radioButtons = document.evaluate(
            "//input[@type='radio']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        //console.log(redCells.snapshotLength);
        for(var i=0;i<radioButtons.snapshotLength;i++)
        {
            //console.log(radioButtons.snapshotItem(i));
            if (radioButtons.snapshotItem(i).checked==true) {
                logLevel = radioButtons.snapshotItem(i).value;
            }

        }
        setSetting(LOG_LEVEL_KEY,logLevel);


        var boxes = document.getElementsByName('config_ignoreBoard');
        var txt = "::::::";
        for (i = 0; i < boxes.length; i++) {
            if (boxes[i].checked) {
                txt = txt + boxes[i].value+"::::::";
            }
        }
        setSetting('boards_ignore',txt);

    } catch (e) {console.log("Save settings on "+getClan()+": "+e);}
    notify("Settings successfully saved.");
}
function loadConfig(){
    try{

        //console.log("Loading config");
        if ($(ANIMATE_SERVER_TIME_KEY)) $(ANIMATE_SERVER_TIME_KEY).checked = getSetting(ANIMATE_SERVER_TIME_KEY,true);
        if ($(LOCAL_TIME_SHOW_KEY)) $(LOCAL_TIME_SHOW_KEY).checked = getSetting(LOCAL_TIME_SHOW_KEY,true);
        if ($(GAME_TIME_SHOW_KEY)) $(GAME_TIME_SHOW_KEY).checked = getSetting(GAME_TIME_SHOW_KEY,true);
        if ($(HOUR24_KEY)) $(HOUR24_KEY).checked = getSetting(HOUR24_KEY,false);
        if ($(POST_AREA_KEY)) $(POST_AREA_KEY).checked = getSetting(POST_AREA_KEY,true);
        if ($(LEFT_MENU_KEY)) $(LEFT_MENU_KEY).checked = getSetting(LEFT_MENU_KEY,true);
        if ($(NEW_POSTS_KEY)) $(NEW_POSTS_KEY).checked = getSetting(NEW_POSTS_KEY,true);
        if ($(TARGET_SELECTOR_KEY)) $(TARGET_SELECTOR_KEY).checked = getSetting(TARGET_SELECTOR_KEY,true);
        if ($(BOT_LIST_KEY)) $(BOT_LIST_KEY).checked = getSetting(BOT_LIST_KEY,true);
        if ($(EDIT_USER_KEY)) $(EDIT_USER_KEY).checked = getSetting(EDIT_USER_KEY,true);
        if ($(SITE_MANAGER_KEY)) $(SITE_MANAGER_KEY).checked = getSetting(SITE_MANAGER_KEY,true);
        if ($(DEBUG_KEY)) $(DEBUG_KEY).checked = getSetting(DEBUG_KEY,false);
        if ($(GHQEDITOR_HEADER)) $(GHQEDITOR_HEADER).checked = getSetting(GHQEDITOR_HEADER,false);

        var logLevel = getSetting(LOG_LEVEL_KEY,LOG_LEVEL_WARN);
        //console.log("Log level: "+logLevel);
        var radioButtons = document.evaluate(
            "//input[@type='radio']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        //console.log(redCells.snapshotLength);
        for(var i=0;i<radioButtons.snapshotLength;i++)
        {
            //console.log(radioButtons.snapshotItem(i));
            if (radioButtons.snapshotItem(i).value==logLevel) {
                radioButtons.snapshotItem(i).checked = true;
            }

        }

    } catch (e) { console.log("Config loaded: "+e); return; }
}
function resetConfig(install){
    try{

        setSetting(ANIMATE_SERVER_TIME_KEY,true);
        setSetting(GAME_TIME_SHOW_KEY,true);
        setSetting(LOCAL_TIME_SHOW_KEY,true);
        setSetting(HOUR24_KEY,false);
        setSetting(POST_AREA_KEY,true);
        setSetting(LEFT_MENU_KEY,true);
        setSetting(NEW_POSTS_KEY,true);
        setSetting(TARGET_SELECTOR_KEY,true);
        setSetting(BOT_LIST_KEY,true);
        setSetting(EDIT_USER_KEY,true);
        setSetting(SITE_MANAGER_KEY,true);
        setSetting(DEBUG_KEY,false);
        setSetting(GHQEDITOR_HEADER,false);

        if(install == "newInstall") { notify ("Settings set to default for new install."); return; }
    } catch (e) { console.log("Config reset: "+e); return; }
    notify("Settings successfully reset reloading page to update.");

    window.location.reload();
}
//==========================================
//AUGMENT FUNCTIONS
//==========================================

/*
*  POSTAREA AUGMENTATION
*/
function postAreaAugment() {
    function postAreaAugment_TextEditor(span) {
        id = span.id;
        if(subjectfocus){
            var box = Subject;
        }else{
            var box = Message;
        }

        var start = box.selectionStart; 
        var end = box.selectionEnd; 
        switch (id){
            case 'BoldStart':
                text = '<b>';
                break;
            case 'Bold':
                if(start != end){
                    box.value = box.value.substr(0, end) + '</b>' + box.value.substr(end, box.value.length); 
                    box.value = box.value.substr(0, start) + '<b>' + box.value.substr(start, box.value.length); 
                }else{
                    text = '<b> </b>';
                }
                break;
            case 'BoldEnd':
                text = '</b>';
                break;
            case 'UnderlineStart':
                text = '<u>';
                break;
            case 'Underline':
                if(start != end){
                    box.value = box.value.substr(0, end) + '</u>' + box.value.substr(end, box.value.length); 
                    box.value = box.value.substr(0, start) + '<u>' + box.value.substr(start, box.value.length); 
                }else{
                    text = '<u> </u>';
                }
                break;
            case 'UnderlineEnd':
                text = '</u>';
                break;
            case 'ItalicsStart':
                text = '<i>';
                break;
            case 'Italics':
                if(start != end){
                    box.value = box.value.substr(0, end) + '</i>' + box.value.substr(end, box.value.length); 
                    box.value = box.value.substr(0, start) + '<i>' + box.value.substr(start, box.value.length); 
                }else{
                    text = '<i> </i>';
                }
                break;
            case 'ItalicsEnd':
                text = '</i>';
                break;
            case 'ColorIA':
                if(start != end){
                    box.value = box.value.substr(0, end) + '</font>' + box.value.substr(end, box.value.length); 
                    box.value = box.value.substr(0, start) + '<font color="orange">' + box.value.substr(start, box.value.length); 
                }else{
                    text = '<font color="orange">';
                }
                break;
            case 'ColorWar':
                if(start != end){
                    box.value = box.value.substr(0, end) + '</font>' + box.value.substr(end, box.value.length); 
                    box.value = box.value.substr(0, start) + '<font color="dodgerblue">' + box.value.substr(start, box.value.length); 
                }else{
                    text = '<font color="dodgerblue">';
                }
                break;
            case 'ColorFR':
                if(start != end){
                    box.value = box.value.substr(0, end) + '</font>' + box.value.substr(end, box.value.length); 
                    box.value = box.value.substr(0, start) + '<font color="mediumseagreen">' + box.value.substr(start, box.value.length); 
                }else{
                    text = '<font color="mediumseagreen">';
                }
                break;
            case 'ColorEnd':
                text = '</font>';
                break;
            case 'Fontx-Small':
            case 'FontSmall':
            case 'FontLarge':
            case 'Fontx-Large':
                var size = id.substr(4);
                if(start != end){
                    box.value = box.value.substr(0, end) + '</span>' + box.value.substr(end, box.value.length); 
                    box.value = box.value.substr(0, start) + '<span style="font-size: '+size+'">' + box.value.substr(start, box.value.length); 
                }else{
                    text = '<span style="font-size: '+size+'"> ';
                }
                break;
            case 'FontEnd':
                text = '</span>';
                break;
            case 'AddURL':
                var url = prompt('What URL would you like to Add? (Paste URL)');
                var text = prompt('What Text would you like shown to the user for the link? (Text Header shown to user for link)');
                text = '<a href="'+url+'">'+text+'</a>';
                break;
            case 'AddImage':
                var image = prompt('What is the URL to the Image? (Paste URL)');
                text = '<img border="0" src="'+image+'">';
                break;
            case 'Emotessmile': 
                text = ' :) ';
                break;
            case 'Emoteswink':
                text = ' ;) ';
                break;
            case 'Emotesfrown':
                text = ' :( ';
                break;
            case 'Emotescool':
                text = ' 8) ';
                break;
            case 'Emotesmad':
                text = ' >:{ ';
                break;
            case 'Emotestongue':
                text = ' :P ';
                break;
            case 'Emotescrazy':
                text = ' ~:~ ';
                break;
            case 'Emotesshocked':
                text = ' :O ';
                break;
            case 'Emotesdetermined':
                text = ' >:) ';
                break;
            case 'Emotesundecided':
                text = ' :/ ';
                break;
            case 'Emotesyelling':
                text = ' >:O ';
                break;
            case 'Emotessealed':
                text = ' :X ';
                break;
            case 'Emoteslaugh':
                text = ' :D ';
                break;
            case 'Emotescrying':
                text = ' :*( ';
                break;
            case 'Emotesblush':
                text = ' *blush* ';
                break;
            default:
                if(id.substr(0, 5) != 'Color'){ return; }
                var color = id.substr(5);
                if(start != end){
                    box.value = box.value.substr(0, end) + '</font>' + box.value.substr(end, box.value.length); 
                    box.value = box.value.substr(0, start) + '<font color="'+color+'">' + box.value.substr(start, box.value.length); 
                }else{
                    text = '<font color="'+color+'">';
                }


                break;
        }
        if(text !== undefined){
            box.value = box.value.substr(0, start) + text + box.value.substr(end, box.value.length); 
        }
        box.focus(); 
    }
    var subjectfocus = false;
    var Message = document.getElementsByTagName("textarea")[0];
    Message.cols = '75';
    Message.rows = '20';
    Message.addEventListener("focus", function(){ subjectfocus = false; }, false);
    var table = Message.parentNode.parentNode.parentNode;
    var rowindex = Message.parentNode.parentNode.sectionRowIndex;
    var editor = table.rows[rowindex].cells[0];
    editor.align = 'center';
    editor.vAlign = 'middle';
    var colorstext = '';
    var colors = new Array('Aqua', 'Blue', 'Crimson', 'DarkBlue', 'DarkCyan', 'DarkGreen', 'DarkViolet', 'DodgerBlue', 'Gray', 'Green', 'Lime', 'Maroon', 'Navy', 'Orange', 'Purple', 'Red', 'RoyalBlue', 'SeaGreen', 'Teal', 'Yellow');
    for(var i=0; i<colors.length; ++i){
        if(i == 5 || i == 10 || i == 15 || i == 20){
            colorstext += '<br>';
        }
        colorstext += '<span id="Color'+colors[i]+'" style="color: '+colors[i]+'" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">'+colors[i]+',</span> ';
    }
    editor.innerHTML = '<font style="color: DarkOrange; font-size: small"><span id="BoldStart" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">[B]</span> - <span id="Bold" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'"><b>Bold</b></span> - <span id="BoldEnd" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">[/B]</span><br><span id="UnderlineStart" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">[U]</span> - <span id="Underline" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'"><u>Underline</u></span> - <span id="UnderlineEnd" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">[/U]</span><br><span id="ItalicsStart" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">[I]</span> - <span id="Italics" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'"><i>Italics</i></span> - <span id="ItalicsEnd" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">[/I]</span><br><br>Colors: <span id="ColorIA" style="color: orange" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">IA,</span> <span id="ColorWar" style="color: dodgerblue" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">War,</span> <span id="ColorFR" style="color: mediumseagreen" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">FR</span><br>'+colorstext+'<br><span id="ColorEnd" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">End Color</span><br><br><span style="font-size: medium; text-decoration: underline"><strong>Size</strong></span><br><span id="Fontx-Small" style="font-size: x-Small" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">x-Small</span>, <span id="FontSmall" style="font-size: Small" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">Small</span>, <span id="FontLarge" style="font-size: Large" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">Large</span>, <span id="Fontx-Large" style="font-size: x-Large" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">x-Large</span><br><span id="FontEnd" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">End Size</span><br><br><span id="AddURL" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">Add URL</span><br><span id="AddImage" onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">Add Image</span><br><br><span id="Emotessmile" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/smile.gif"></span> <span id="Emoteswink" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/wink.gif"></span> <span id="Emotesfrown" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/frown.gif"></span> <span id="Emotescool" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/cool.gif"></span> <span id="Emotesmad" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/mad.gif"></span><br><span id="Emotestongue" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/tongue.gif"></span> <span id="Emotescrazy" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/crazy.gif"></span> <span id="Emotesshocked" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/shocked.gif"></span> <span id="Emotesdetermined" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/determined.gif"></span> <span id="Emotesundecided" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/undecided.gif"></span><br><span id="Emotesyelling" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/yelling.gif"></span> <span id="Emotessealed" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/sealed.gif"></span> <span id="Emoteslaugh" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/laugh.gif"></span> <span id="Emotescrying" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/crying.gif"></span> <span id="Emotesblush" onmouseover="this.style.cursor=\'pointer\'"><img border="0" src="http://sol.ghqnet.com/images/Emotes/blush.gif"></span>';

    document.getElementById("BoldStart").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Bold").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("BoldEnd").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("UnderlineStart").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Underline").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("UnderlineEnd").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("ItalicsStart").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Italics").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("ItalicsEnd").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("ColorIA").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("ColorWar").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("ColorFR").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("ColorEnd").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Fontx-Small").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("FontSmall").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("FontLarge").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Fontx-Large").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("FontEnd").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("AddURL").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("AddImage").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotessmile").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emoteswink").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotesfrown").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotescool").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotesmad").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotestongue").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotescrazy").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotesshocked").addEventListener("click", function(){TextEditor(this);}, false);
    document.getElementById("Emotesdetermined").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotesundecided").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotesyelling").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotessealed").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emoteslaugh").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotescrying").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    document.getElementById("Emotesblush").addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);

    for(var i=0; i<colors.length; ++i){
        var name = "Color"+colors[i];
        document.getElementById(name).addEventListener("click", function(){postAreaAugment_TextEditor(this);}, false);
    }
    var allInputs = document.getElementsByTagName("input");
    for(var i=0; i<allInputs.length; ++i){
        if(allInputs[i].name == 'Subject'){
            var Subject = allInputs[i];
            allInputs[i].addEventListener("focus", function(){ subjectfocus = true; }, false);
            allInputs[i].size = '70';
        }
    }
}


/*
*  NEW POSTS
*/
function newPosts() {
    function newPosts_MarkAllRead() {
        var allNew = document.getElementsByName("NEW");
        for(var i=0; i<allNew.length; ++i){
            allNew[i].parentNode.removeChild( allNew[i] ); 
            i--;
        }
        setSetting( 'Posts_'+BoardID, ':AllRead-'+curTime+':' );
        notify('All topics marked as Read.');
    }
    var allTR = document.getElementsByTagName('tr');			// get all TD elements
    var allInputs = document.getElementsByTagName("input");
    for(var i=0; i<allInputs.length; ++i){
        if(allInputs[i].name == 'BoardID'){
            BoardID = allInputs[i].value;
            break;
        }
    }
    var Posts = getSetting( 'Posts_'+BoardID, ':' );
    var t = Posts.indexOf(':AllRead-');
    if(t!=-1){
        var tEnd = Posts.indexOf(':', t+1);
        var val = Posts.slice(t, tEnd);
        val = val.replace(':', '');
        var allReadTime = val.split('-')[1];
    }else{
        var allReadTime = 0;
    }
    if(document.forms[0].name == 'EditBoard'){
        colnum = 3;
    }else{
        colnum = 0;
    }
    var youngestTime = curTime - 60*60*24*7*1000;
    for(var i=0; i < allTR.length; ++i){
        if(allTR[i].firstChild.colSpan == 4 || allTR[i].firstChild.colSpan == 4+colnum){
            if(allTR[i].firstChild.firstChild != 'undefined' && allTR[i].lastChild.firstChild != 'undefined'){
                if(allTR[i].lastChild.firstChild.innerHTML == 'View Emotes' ){
                    var row = allTR[i].parentNode.insertRow(0);
                    var cell = row.insertCell(0);
                    cell.bgColor = 'black';
                    cell.colSpan = 4+colnum;
                    cell.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\';" id="MarkRead"><font style="color: Orange; font-size: small"><strong>Mark all as "Read"</strong></font></span>';
                    $('MarkRead').addEventListener("click", function(){newPosts_MarkAllRead();}, false);
                    i++;
                }
            }
            continue;
        }
    
        if(allTR[i].cells.length != 5+colnum){            
            continue;
        }
  
        if(allTR[i].cells[4+colnum].innerHTML == 'Last Post'){           
            continue;            
        }
        var PostDate = allTR[i].lastChild.innerHTML;
        PostDate = Date.parse(PostDate); 
        if(youngestTime >= PostDate || allReadTime >= PostDate){
            continue;
        }
        if(allTR[i].cells[3+colnum].firstChild.innerHTML == Clan_Username){
            continue;
        }        
        var ThreadID = allTR[i].childNodes[0+colnum].firstChild.href.split('&')[1];
        ThreadID = ThreadID.split('=')[1];
        var t = Posts.indexOf(':'+ThreadID+'-');
        if(t!=-1){
            var tEnd = Posts.indexOf(':', t+1);
            var val = Posts.slice(t, tEnd);
            val = val.replace(':', '');
            var lastReadTime = val.split('-')[1];
            if(PostDate <= lastReadTime){
                continue;
            }
            //allTR[i].childNodes[0+colnum].innerHTML = '<span id="t_'+ThreadID+'" name="NEW"> <font style="color: Red; font-size: x-small">*NEW* </font></span>'+allTR[i].childNodes[0+colnum].innerHTML;
            allTR[i].childNodes[0+colnum].innerHTML = '<span id="t_'+ThreadID+'" name="NEW"><img src="http://www.ghqnet.com/sites/SOL/Files/newpost.png"> </span>'+allTR[i].childNodes[0+colnum].innerHTML;
        }else{
            //allTR[i].childNodes[0+colnum].innerHTML = '<span id="t_'+ThreadID+'" name="NEW"><font style="color: Red; font-size: x-small">*NEW* </font></span>'+allTR[i].childNodes[0+colnum].innerHTML;
            allTR[i].childNodes[0+colnum].innerHTML = '<span id="t_'+ThreadID+'" name="NEW"><img src="http://www.ghqnet.com/sites/SOL/Files/newpost.png"> </span>'+allTR[i].childNodes[0+colnum].innerHTML;
        }
    }
}
function newPostMarkRead() {
    var BoardID = path.split('&')[0].split('=')[1];
    var Posts = getSetting( 'Posts_'+BoardID, ':' );
    var t = Posts.indexOf(':AllRead-');
    if(t!=-1){
        var tEnd = Posts.indexOf(':', t+1);
        var val = Posts.slice(t, tEnd);
        val = val.replace(':', '');
        var allReadTime = val.split('-')[1];
    }else{
        var allReadTime = 0;
    }
    var PostDate = path.split('&')[3].split('=')[1];
    PostDate = Date.parse(URLDecode(PostDate));
    //var curTime = new Date().getTime();
    var youngestTime = curTime - 60*60*24*7*1000;
    if(youngestTime < PostDate && allReadTime < PostDate){
        var ThreadID = path.split('&')[1].split('=')[1];
        t = Posts.indexOf(':'+ThreadID+'-');
        if(t!=-1){
            tEnd = Posts.indexOf(':', t+1);
            var val = Posts.slice(t, tEnd);
            Posts = Posts.replace(val, ':'+ThreadID+'-'+PostDate+':');
        }else{
            Posts = Posts+ThreadID+'-'+PostDate+':';
        }
        setSetting( 'Posts_'+BoardID, Posts );
    }
}
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
function cleanBoard() {
    function cleanBoard_onChange(t) {
        var Value = t.value; 
        switch (Value){
            case 'Choose One':
                $("CleanBoard_SpanOlderThen").style.display = 'none';
                $("CleanBoard_SpanSortOrder").style.display = 'none';
                $("CleanBoard_SortOrder").selectedIndex = $("CleanBoard_SortOrder").options[0].index;
                $("CleanBoard_SpanStartingWithA").style.display = 'none';
                $("CleanBoard_SpanCustom").style.display = 'none';
                $("CleanBoard_SpanExplain").style.display = 'none';
                $("CleanBoard_SpanCleanBoard").style.display = 'none';
                break;
            case 'Check Boxes':
                $("CleanBoard_SpanOlderThen").style.display = '';
                $("CleanBoard_SpanSortOrder").style.display = 'none';
                $("CleanBoard_SortOrder").selectedIndex = $("CleanBoard_SortOrder").options[0].index;
                $("CleanBoard_SpanStartingWithA").style.display = 'none';
                $("CleanBoard_SpanCustom").style.display = 'none';
                $("CleanBoard_SpanExplain").style.display = '';
                $("CleanBoard_SpanCleanBoard").style.display = '';
                break;
            default:
                $("CleanBoard_SpanOlderThen").style.display = '';
                $("CleanBoard_SpanSortOrder").style.display = '';
                $("CleanBoard_SortOrder").selectedIndex = $("CleanBoard_SortOrder").options[0].index;
                $("CleanBoard_SpanStartingWithA").style.display = 'none';
                $("CleanBoard_SpanCustom").style.display = 'none';
                $("CleanBoard_SpanExplain").style.display = 'none';
                $("CleanBoard_SpanCleanBoard").style.display = 'none';
                break;
        }
    }
    function cleanBoard_onChangeSortOrder(t) {
        var Value = t.value; 
        switch (Value){
            case 'Keep Current Sort Order':
                $("CleanBoard_SpanStartingWithA").style.display = 'none';
                $("CleanBoard_SpanCustom").style.display = 'none';
                $("CleanBoard_SpanExplain").style.display = '';
                $("CleanBoard_SpanCleanBoard").style.display = '';
                break;
            case 'Alphabetically':
                $("CleanBoard_SpanStartingWithA").style.display = '';
                $("CleanBoard_SpanCustom").style.display = 'none';
                $("CleanBoard_SpanExplain").style.display = '';
                $("CleanBoard_SpanCleanBoard").style.display = '';
                break;
            case 'Custom':
                $("CleanBoard_SpanStartingWithA").style.display = 'none';
                $("CleanBoard_SpanCustom").style.display = '';
                $("CleanBoard_SpanExplain").style.display = '';
                $("CleanBoard_SpanCleanBoard").style.display = '';
                break;
            default:
                $("CleanBoard_SpanStartingWithA").style.display = 'none';
                $("CleanBoard_SpanCustom").style.display = 'none';
                $("CleanBoard_SpanExplain").style.display = 'none';
                $("CleanBoard_SpanCleanBoard").style.display = 'none';
                break;
        }
    }
    function cleanBoard_Explain() {
        var CleanBoard = $("CleanBoard");
        var Value = CleanBoard.value; 
        switch (Value){
            case 'Choose One':
                return;
                break;
            case 'Check Boxes':
                var days = $('CleanBoard_Days');
                alert('"Check Boxes" on any posts older then "'+days.value+'" Days.');
                break;
            default:
                var SortOrder = $("CleanBoard_SortOrder");
                var Value2 = SortOrder.value; 
                var days = $('CleanBoard_Days');
                switch (Value2){
                    case 'Keep Current Sort Order':
                        alert('"Move to selected board" any posts older then "'+days.value+'" Days while "Keeping the Current Sort Order".');
                        break;
                    case 'Alphabetically':
                        var StartingWithA = $('CleanBoard_StartingWithA');
                        var InStepsOfSign = $('CleanBoard_InStepsOfSign');
                        var InStepsOf = $('CleanBoard_InStepsOf');
                        if(InStepsOfSign.value == '+'){
                            var b = Number(StartingWithA.value) + Number(InStepsOf.value);
                            var c = b + Number(InStepsOf.value);
                            var d = c + Number(InStepsOf.value);
                        }else{
                            var b = Number(StartingWithA.value) - Number(InStepsOf.value);
                            var c = b - Number(InStepsOf.value);
                            var d = c - Number(InStepsOf.value);
                        }
                        alert('"Move to selected board" any posts older then "'+days.value+'" Days while sorting "Alphabetically" starting with "A" at "'+StartingWithA.value+'" and in steps of "'+InStepsOfSign.value+InStepsOf.value+'". So A="'+StartingWithA.value+'", B="'+b+'", C="'+c+'", D="'+d+'", etc.');
                        break;
                    case 'Custom':
                        var Custom = $('CleanBoard_Custom');
                        alert('"Move to selected board" any posts older then "'+days.value+'" Days while placing all moved topics at position "'+Custom.value+'".');
                        break;
                    default:
                        return;
                        break;
                }
                break;
        }
    }
    function cleanBoard_CleanBoard() {
        var CleanBoard = $("CleanBoard");
        var Value = CleanBoard.value; 
        switch (Value){
            case 'Choose One':
                return;
                break;
            case 'Check Boxes':
                var days = $('CleanBoard_Days');
                var allChecks = table.getElementsByTagName('input');			// get all TD elements
                var dif = parseInt(days.value) * 24 * 60 * 60 * 1000;
                currentTime = curTime - dif;
                var count = 0;
                for(var i=0; i<allChecks.length; ++i){
                    if(allChecks[i].parentNode.parentNode.childNodes[6] == undefined){
                        continue;
                    }else if(allChecks[i].parentNode.parentNode.childNodes[6].innerHTML == undefined){
                        continue;
                    }
                    if(allChecks[i].parentNode.parentNode.childNodes[6].innerHTML == ''){
                        continue;
                    }
                    var date = allChecks[i].parentNode.parentNode.childNodes[6].innerHTML;
                    date = Date.parse(date);
                    if(isNaN(date)){ continue; }
                    if(currentTime > date){
                        allChecks[i].checked = true;
                        count++;
                    }
                }
                alert('"'+count+'" Topics have been selected. You may now use the GHQ functions to Move the topics or Delete them.');
                break;
            default:
                var SortOrder = $("CleanBoard_SortOrder");
                var Value2 = SortOrder.value; 
                var days = $('CleanBoard_Days');
                switch (Value2){
                    case 'Keep Current Sort Order':
                        var days = $('CleanBoard_Days');
                        var allChecks = table.getElementsByTagName('input');			// get all TD elements
                        var dif = parseInt(days.value) * 24 * 60 * 60 * 1000;
                        currentTime = curTime - dif;
                        var count = 0;
                        for(var i=0; i<allChecks.length; ++i){
                            if(allChecks[i].parentNode.parentNode.childNodes[6] == undefined){
                                continue;
                            }else if(allChecks[i].parentNode.parentNode.childNodes[6].innerHTML == undefined){
                                continue;
                            }
                            if(allChecks[i].parentNode.parentNode.childNodes[6].innerHTML == ''){
                                continue;
                            }
                            var date = allChecks[i].parentNode.parentNode.childNodes[6].innerHTML;
                            date = Date.parse(date);
                            if(isNaN(date)){ continue; }
                            if(currentTime > date){
                                allChecks[i].checked = true;
                                count++;
                            }
                        }
                        if(confirm('Are you sure you want to move these "'+count+'" Topics to the selected board while keeping the current Sort Order?')){
                            $('NewBoardID').value = Value;
                            document.forms[0].submit();
                        }

                        break;
                    case 'Alphabetically':
                        var StartingWithA = $('CleanBoard_StartingWithA');
                        var InStepsOfSign = $('CleanBoard_InStepsOfSign');
                        var InStepsOf = $('CleanBoard_InStepsOf');




                        break;
                    case 'Custom':
                        var Custom = $('CleanBoard_Custom');





                        break;
                    default:
                        return;
                        break;
                }
                break;
        }
    }
    var allInputs = document.getElementsByTagName('input');			// get all TD elements
    for(var i=0; i<allInputs.length; ++i){
        if(allInputs[i].name == 'Delete'){
            var deleteElem = allInputs[i];
        }
        if(allInputs[i].name == 'Move'){
            allInputs[i].id = 'Move';
        }
    }
    if(deleteElem === undefined){ return; }
    if(document.forms[0].name == 'EditBoard'){
    }else{
        return;
    }
    var table = deleteElem.parentNode.parentNode.parentNode;
    var row = table.insertRow(-1);
    var cell = row.insertCell(0);
    row.bgColor = deleteElem.parentNode.parentNode.bgColor;
    cell.colSpan = '7';
    var options = "<option>Choose One</option><option>Check Boxes</option>";
    var allSelects = document.getElementsByTagName('select');			// get all TD elements
    for(var i=0; i<allSelects.length; ++i){
        if(allSelects[i].name == 'NewBoardID'){
            var moveElem = allSelects[i];
            allSelects[i].id = 'NewBoardID';
            break;
        }
    }
    if(moveElem === undefined){ 
    }else{
        for(var i=0; i<moveElem.options.length; ++i){
            options += '<option value="'+moveElem.options[i].value+'">MoveTo: '+moveElem.options[i].text+'</option>';
        }
    }
    cell.innerHTML = '</form>CleanBoard: <select id="CleanBoard">'+options+'</select>'+
        '<span id="CleanBoard_SpanOlderThen" style="display: none;"> any Posts Older Then <select id="CleanBoard_Days"><option value="0">0 Days</option><option value="7">7 Days</option><option value="14">14 Days</option><option selected value="30">1 Month</option><option value="60">2 Months</option><option value="90">3 Months</option><option value="120">4 Months</option><option value="150">5 Months</option><option value="180">6 Months</option><option value="365">1 Year</option></select></span>'+
        '<span id="CleanBoard_SpanSortOrder" style="display: none;"> and set at Sort Order <select id="CleanBoard_SortOrder"><option>Choose One</option><option>Keep Current Sort Order</option><option>Alphabetically</option><option>Custom</option></select></span>'+
        '<span id="CleanBoard_SpanStartingWithA" style="display: none;"> starting with A at <input value="0" size="5" id="CleanBoard_StartingWithA" /> and in steps of <select id="CleanBoard_InStepsOfSign"><option selected>-</option><option>+</option></select><input value="2" size="3" id="CleanBoard_InStepsOf"/></span>'+
        '<span id="CleanBoard_SpanCustom" style="display: none;"> at SortOrder <input value="0" size="5" id="CleanBoard_Custom" /></span>'+
        '<span id="CleanBoard_SpanExplain" style="display: none;"><button id="CleanBoard_Explain" onclick="return false">  Explain</button></span>'+
        '<span id="CleanBoard_SpanCleanBoard" style="display: none;"><button id="CleanBoard_CleanBoard" onclick="return false">  CleanBoard</button></span>';
    $("CleanBoard").addEventListener("change", function(){cleanBoard_onChange(this);}, false);
    $("CleanBoard_SortOrder").addEventListener("change", function(){cleanBoard_onChangeSortOrder(this);}, false);
    $("CleanBoard_Explain").addEventListener("click", function(){cleanBoard_Explain(this);}, false);
    $("CleanBoard_CleanBoard").addEventListener("click", function(){cleanBoard_CleanBoard();}, false);

}
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
function links() {
    function links_ShowEdits() {
        var links = getSetting( 'Links', '' );
        var linksarr = links.split('::::::');
        if(!editing){
            alert('This function will allow you to select Menu Items you dont use and move them to the bottom of the Menu to get them out of the way. - Simply click the X next to the Menu Item.');
            var row = allTR[0].parentNode.insertRow(2);
            var cell = row.insertCell(0);
            cell.colSpan = 2;
            cell.bgColor = allTR[1].bgColor;
            row.bgColor = allTR[1].bgColor;
            cell.align = 'center';
            cell.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\';"><font style="color: Orange; font-size: 12px;">Reset Menu Items</font></span>';
            cell.addEventListener("click", function(){links_ResetMenuVerify();}, false);
            for(var i=0; i<allTR.length; ++i){
                if(i<=2 || allTR[i].id.slice(0, 14) == 'EditMenuTitle_'){
                    allTR[i].firstChild.colSpan = 2;
                    if(allTR[i].style.display == 'none'){
                        allTR[i].style.display = '';
                        EditMenuIndex = i;
                    }
                }else{
                    var cell = allTR[i].insertCell(0);
                    cell.align = 'center';
                    if(allTR[i].id.slice(0, 6) == 'Moved_'){
                        allTR[i].style.display = '';
                        cell.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\';"><font style="color: Orange; font-size: x-small">+</font></span>';
                        cell.addEventListener("click", function(){links_UnMoveMenuItem(this);}, false);
                    }else{
                        cell.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\';"><font style="color: Orange; font-size: x-small">X</font></span>';
                        cell.addEventListener("click", function(){links_MoveMenuItem(this);}, false);
                    }
                }
            }
            editing = true;
         
        }else{
            x = allTR[0].parentNode.deleteRow(2);            
            for(var i=0; i<allTR.length; ++i){
                if(allTR[i].firstChild.colSpan == 2){
                    allTR[i].firstChild.colSpan = 1;
                }else{
                    var cell = allTR[i].deleteCell(0);
                    if(allTR[i].id.slice(0, 6) == 'Moved_'){
                        allTR[i].style.display = 'none';
                    }
                }
            }
            allTR[EditMenuIndex].style.display = 'none';
            x = EditMenuIndex-1;
            allTR[x].style.display = 'none';
            editing = false;
        }
    }
    function links_MoveMenuItem(t) {
        var row = t.parentNode;
        var obj = row.cloneNode(true);
        var id = obj.id.substr(9);
        obj.id = 'Moved_'+id;
        var s = row.parentNode.appendChild(obj);
        s.firstChild.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\';"><font style="color: Orange; font-size: x-small">+</font></span>';
        s.firstChild.addEventListener("click", function(){links_UnMoveMenuItem(this);}, false);
        row.style.display = 'none';
        val = row.lastChild.firstChild.innerHTML;
        var links = getSetting( 'Links', '' );
        if(links == ''){
            setSetting( 'Links', ':::'+val+':::' );
            return;
        }
        if(links.indexOf(':::'+val+':::')!=-1){
            return;
        }
        setSetting( 'Links', links+':::'+val+':::' );
    }
    function links_UnMoveMenuItem(t) {
        var row = t.parentNode;
        var id = row.id.substr(6);
        var s = document.getElementById('EditMenu_'+id);
        s.style.display = '';
        row.parentNode.deleteRow(row.rowIndex);
        var links = getSetting( 'Links', '' );
        links = links.replace(':::'+row.lastChild.firstChild.innerHTML+':::', '');
        setSetting( 'Links', links );
    }
    function links_ResetMenuVerify(t) {
        var answer = confirm("Are you sure you want to clear your Menu Filter Links?");
        if(answer){ links_ResetMenu(t); }else{ return; }
    }
    function links_ResetMenu(t) {
        x = allTR[0].parentNode.deleteRow(2);
        setSetting( 'Links', '' );
        for(var i=0; i<allTR.length; ++i){
            if(allTR[i] === undefined){
                break;
            }
            if(allTR[i].firstChild.colSpan == 2){
                allTR[i].firstChild.colSpan = 1;
            }else{
                var cell = allTR[i].deleteCell(0);
                allTR[i].style.display = '';

                if(allTR[i].id.slice(0, 6) == 'Moved_'){
                    allTR[i].parentNode.deleteRow(allTR[i].rowIndex);
                    i--;
                }
            }
        }
        editing = false;
        allTR[allTR.length-1].style.display = 'none';
        allTR[allTR.length].style.display = 'none';
    }
    function links_MarkBoardRead(t) {
        var boardIDVal = t.id.substr(9);
        var s = myRef.document.getElementById('table_'+boardIDVal);
        s.style.display = 'none';
        var boardNameVal = myRef.document.getElementById('boardIDName_'+boardIDVal).innerHTML;
        setSetting( 'Posts_'+boardIDVal, ':AllRead-'+curTime+':' );
        //notify('All topics marked as Read in '+boardNameVal+'.');//GOES TO WRONG WINDOW
    }
    function links_IgnoreBoard(t) {
        var boardIDVal = t.id.substr(12);
        var boardNameVal = myRef.document.getElementById('boardIDName_'+boardIDVal).innerHTML;
        var s = myRef.document.getElementById('table_'+boardIDVal);
        s.style.display = 'none';
        setSetting( 'Posts_'+boardIDVal, ':AllRead-'+curTime+':' );
        var ignoredBoards = getSetting( 'boards_ignore', '::::::' );
        setSetting('boards_ignore', ignoredBoards+boardNameVal+'::::::');
        //notify('All topics marked as Read in '+boardNameVal+'.');//GOES TO WRONG WINDOW
    }
    function links_RefreshBoard(t) {
        var boardIDVal = t.id.substr(8);
        var boardNameVal = myRef.document.getElementById('boardIDName_'+boardIDVal).innerHTML;
        var s = myRef.document.getElementById('Refresh_'+boardIDVal);
        s.innerHTML = 'Refreshing...   ';
        var id = myRef.document.getElementById('ID_'+boardIDVal).innerHTML;
        links_CheckforNewPostsOnBoard(id, 1);
    }

    function links_CheckforNewPostsVerify(t) {
        var answer = confirm("This process loads all Boards and checks them for new posts. This may take awhile on slower internets as it runs in the background. You must have Popup blocker disabled for GHQ in order to get the full experience. Are you sure you want to continue?");
        if(answer){ links_CheckforNewPosts(t); }else{ return; }
    }
    function links_CheckforNewPostsOnBoard(i, update) {
        if(boardLinks[i] === undefined || boardLinks[i] === null){ myRef.document.close(); return; }
        var patt4=/ShowPost\.asp\?BoardID=[0-9]{1,}&ThreadID=[0-9]{1,}&site=[A-z]{1,8}&lastpost=.{14,20}(AM|PM)\b/i; //SHowPost URLS
        var patt1=/ShowPost\.asp\?BoardID=[0-9]{1,}/; //BoardID
        var patt2=/=.{14,20}(AM|PM)/gi; //PostTime
        var patt3=/ThreadID=[0-9]{1,}/i; //ThreadID
        var patt5=/[0-9]{1,2}.[0-9]{1,2}.[0-9]{4}.[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}.(AM|PM)/i; //PostTime

        var OldBoardID = 0;
        var count = 0;
        var newPostsText = '';
        GM_xmlhttpRequest({
            method: 'GET',
            url: menuLinksArr[boardLinks[i]].href,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'main': 'application/scriptVersion+xml,application/xml,text/xml',
            },
            onload: function(responseDetails) {
                if(curTime == "" || curTime === undefined){
                    curTime = responseDetails.responseText.match(patt5);
                    curTime = Date.parse(curTime[0]);
                }
                var youngestTime = curTime - 60*60*24*7*1000;

                var rows = responseDetails.responseText.split(/<\/TR>/i); //Gets every ShowPost Link
                if(rows === null){ i++; links_CheckforNewPostsOnBoard(i, 0); }
                for(var x=0; x<rows.length; ++x){
                    var response = rows[x].match(patt4); //Gets every ShowPost Link
                    if(response === null){ continue; }
                    BoardID = response[0].match(patt1);
                    BoardID = BoardID[0].slice(21);
                    if(BoardID == 0){
                        continue;
                    }
                    if(BoardID != OldBoardID){
                        OldBoardID = BoardID;
                        var Posts = getSetting( 'Posts_'+BoardID, ':' );
                        var t = Posts.indexOf(':AllRead-');
                        if(t!=-1){
                            var tEnd = Posts.indexOf(':', t+1);
                            var val = Posts.slice(t, tEnd);
                            val = val.replace(':', '');
                            var allReadTime = val.split('-')[1];
                        }else{
                            var allReadTime = 0;
                        }
                    }
                    var PostDate = response[0].match(patt2);
                    var PostDate = PostDate[0].slice(1);
                    PostDate = Date.parse(PostDate);
                    if(youngestTime >= PostDate || allReadTime >= PostDate){
                        continue;
                    }
                    var ThreadID = response[0].match(patt3);
                    var ThreadID = ThreadID[0].slice(9);
                    var t = Posts.indexOf(':'+ThreadID+'-');
                    if(t!=-1){
                        var tEnd = Posts.indexOf(':', t+1);
                        var val = Posts.slice(t, tEnd);
                        val = val.replace(':', '');
                        var lastReadTime = val.split('-')[1];
                        if(PostDate <= lastReadTime){
                            continue;
                        }
                    }
                    count++;
                    if(newPostsArr[BoardID] === undefined){
                        newPostsArr[BoardID] = new Array;
                    }
                    if(newPostsArr[BoardID][ThreadID] === undefined){
                        var cols = rows[x].split(/<\/td>/i); //Gets every TD of a row
                        if(cols === null){ continue; }
                        if(cols[6] === undefined){ //NO EDIT BOARDS
                            var t = cols[0].indexOf('>');
                            var Topic = cols[0].slice(t+1);                         
                            //var Topic = cols[0].slice(t+10);
                            //var Topic = '<a target="main" href=\'Boards/'+Topic;
                            var t = cols[1].indexOf('>');
                            var Originator = cols[1].slice(t+1);
                            var t = cols[2].indexOf('>');
                            var Posts = cols[2].slice(t+1);
                            var t = cols[3].indexOf('>');
                            var Last_Poster = cols[3].slice(t+1);
                            var t = cols[4].indexOf('>');
                            var Last_Post = cols[4].slice(t+1);   
                            var t = cols[5].indexOf('>');
                            var Last_Posted = cols[5].slice(t+1);       
                        }else{
                            var t = cols[2].indexOf('>');
                            var Topic = cols[2].slice(t+1);
                            //var Topic = cols[3].slice(t+10);
                            //var Topic = '<a target="main" href=\'Boards/'+Topic;
                            var t = cols[3].indexOf('>');
                            var Originator = cols[3].slice(t+1);
                            var t = cols[4].indexOf('>');
                            var Posts = cols[4].slice(t+1);
                            var t = cols[5].indexOf('>');
                            var Last_Poster = cols[5].slice(t+1);
                            var t = cols[6].indexOf('>');
                            var Last_Post = cols[6].slice(t+1);
                            var t = cols[7].indexOf('>');
                            var Last_Posted = cols[7].slice(t+1);
                        }
                        newPostsText = newPostsText+'<tr bgcolor="#222222">'+Topic+'</td><td width="15%" nowrap>'+Originator+'</td><td align="center" width="5%" nowrap>'+Posts+'</td><td width="25%" nowrap>'+Last_Poster+'</td><td width="25%" nowrap>'+Last_Post+'</td><td width="25%" nowrap>'+Last_Posted+'</td></tr>';
                    }
                }
                if(count >= 1){
                    if(update === 1){
                        if(count >= 2){ pleral = 's'; }else{ pleral = ''; }
                        var t = '<br><table border="0" cellpadding="3" cellspacing="1" width="100%"><tr bgcolor="#222222"><td colspan=5><table width="100%"><tr><td><span onmouseover="this.style.cursor=\'pointer\';" id="Refresh_'+BoardID+'"><img src="http://www.ghqnet.com/sites/SOL/Files/refresh-icon.png"></span> '+menuLinksArr[boardLinks[i]].parentNode.innerHTML+' - '+count+' New Post'+pleral+' - <span onmouseover="this.style.cursor=\'pointer\';" id="MarkRead_'+BoardID+'"><font style="color: Orange; font-size: small"><strong>Mark Board as "Read"</strong></font></span></td><td align="right"><span onmouseover="this.style.cursor=\'pointer\';" id="IgnoreBoard_'+BoardID+'"><font style="color: Orange; font-size: small"><strong>Permanently Ignore Board</strong></font></span></td></tr></table></td></tr><tr bgcolor="#222222"><td width="47.5%"><b>Topic</b></td><td><b>Originator</b></td><td align="center"><b>Posts</b></td><td><b>Last Poster</b></td><td><b>Last Post</b></td></tr>';
                        t = t + newPostsText;
                        var s = myRef.document.getElementById('table_'+BoardID);
                        s.innerHTML = t;
                        myRef.document.getElementById('MarkRead_'+BoardID).addEventListener("click", function(){links_MarkBoardRead(this);}, false);
                        myRef.document.getElementById('IgnoreBoard_'+BoardID).addEventListener("click", function(){links_IgnoreBoard(this);}, false);
                        myRef.document.getElementById('Refresh_'+BoardID).addEventListener("click", function(){links_RefreshBoard(this);}, false);
                        return;
                    }else{
                        menuLinksArr[boardLinks[i]].parentNode.innerHTML = '<span name="NEW"><img src="http://www.ghqnet.com/sites/SOL/Files/newpost.png"> </span>'+menuLinksArr[boardLinks[i]].parentNode.innerHTML;
                        if(count >= 2){ pleral = 's'; }else{ pleral = ''; }
                        myRef.document.write('<span id="ID_'+BoardID+'" style="display:none">'+i+'</span><span id="boardIDName_'+BoardID+'" style="display:none">'+menuLinksArr[boardLinks[i]].innerHTML+'</span><span id="table_'+BoardID+'"><br><table border="0" cellpadding="3" cellspacing="1" width="100%"><tr bgcolor="#222222"><td colspan=5><table width="100%"><tr><td><span onmouseover="this.style.cursor=\'pointer\';" id="Refresh_'+BoardID+'"><img src="http://www.ghqnet.com/sites/SOL/Files/refresh-icon.png"></span> '+menuLinksArr[boardLinks[i]].parentNode.innerHTML+' - '+count+' New Post'+pleral+' - <span onmouseover="this.style.cursor=\'pointer\';" id="MarkRead_'+BoardID+'"><font style="color: Orange; font-size: small"><strong>Mark Board as "Read"</strong></font></span></td><td align="right"><span onmouseover="this.style.cursor=\'pointer\';" id="IgnoreBoard_'+BoardID+'"><font style="color: Orange; font-size: small"><strong>Permanently Ignore Board</strong></font></span></td></tr></table></td></tr><tr bgcolor="#222222"><td width="47.5%"><b>Topic</b></td><td><b>Originator</b></td><td align="center"><b>Posts</b></td><td><b>Last Poster</b></td><td><b>Last Post</b></td></tr>');
                        myRef.document.write(newPostsText);
                        myRef.document.write('</table></span>');
                        myRef.document.getElementById('MarkRead_'+BoardID).addEventListener("click", function(){links_MarkBoardRead(this);}, false);
                        myRef.document.getElementById('IgnoreBoard_'+BoardID).addEventListener("click", function(){links_IgnoreBoard(this);}, false);
                        myRef.document.getElementById('Refresh_'+BoardID).addEventListener("click", function(){links_RefreshBoard(this);}, false);
                    }
                }else{
                    if(update === 1){
                        var t = '<br><table border="0" cellpadding="3" cellspacing="1" width="100%"><tr bgcolor="#222222"><td colspan=5><table width="100%"><tr><td><span onmouseover="this.style.cursor=\'pointer\';" id="Refresh_'+BoardID+'"><img src="http://www.ghqnet.com/sites/SOL/Files/refresh-icon.png"></span> '+menuLinksArr[boardLinks[i]].parentNode.innerHTML+' - 0 New Posts</td><td align="right"><span onmouseover="this.style.cursor=\'pointer\';" id="IgnoreBoard_'+BoardID+'"><font style="color: Orange; font-size: small"><strong>Permanently Ignore Board</strong></font></span></td></tr></table></td></tr><tr bgcolor="#222222"><td width="47.5%"><b>Topic</b></td><td><b>Originator</b></td><td align="center"><b>Posts</b></td><td><b>Last Poster</b></td><td><b>Last Post</b></td></tr><tr bgcolor="#222222"><td colspan="5" align="center">No New Posts</td></tr>';
                        var s = myRef.document.getElementById('table_'+BoardID);
                        s.innerHTML = t;
                        myRef.document.getElementById('IgnoreBoard_'+BoardID).addEventListener("click", function(){links_IgnoreBoard(this);}, false);
                        myRef.document.getElementById('Refresh_'+BoardID).addEventListener("click", function(){links_RefreshBoard(this);}, false);
                        return;
                    }else{
//                        menuLinksArr[boardLinks[i]].parentNode.innerHTML = '<span name="NEW"><img src="http://www.ghqnet.com/sites/SOL/Files/newpost.png"> </span>'+menuLinksArr[boardLinks[i]].parentNode.innerHTML;
                        myRef.document.write('<span id="ID_'+BoardID+'" style="display:none">'+i+'</span><span id="boardIDName_'+BoardID+'" style="display:none">'+menuLinksArr[boardLinks[i]].innerHTML+'</span><span id="table_'+BoardID+'"><br><table border="0" cellpadding="3" cellspacing="1" width="100%"><tr bgcolor="#222222"><td colspan=4><table width="100%"><tr><td><span onmouseover="this.style.cursor=\'pointer\';" id="Refresh_'+BoardID+'"><img src="http://www.ghqnet.com/sites/SOL/Files/refresh-icon.png"></span> '+menuLinksArr[boardLinks[i]].parentNode.innerHTML+' - 0 New Posts - <span onmouseover="this.style.cursor=\'pointer\';" id="MarkRead_'+BoardID+'"><font style="color: Orange; font-size: small"><strong>Mark Board as "Read"</strong></font></span></td><td align="right"><span onmouseover="this.style.cursor=\'pointer\';" id="IgnoreBoard_'+BoardID+'"><font style="color: Orange; font-size: small"><strong>Permanently Ignore Board</strong></font></span></td></tr></table></td></tr><tr bgcolor="#222222"><td colspan="5" align="center">No New Posts</td></tr>');
//                        myRef.document.write(newPostsText);
                        myRef.document.write('</table></span>');
                        myRef.document.getElementById('MarkRead_'+BoardID).addEventListener("click", function(){links_MarkBoardRead(this);}, false);
                        myRef.document.getElementById('IgnoreBoard_'+BoardID).addEventListener("click", function(){links_IgnoreBoard(this);}, false);
                        myRef.document.getElementById('Refresh_'+BoardID).addEventListener("click", function(){links_RefreshBoard(this);}, false);
                    }
                }
                notify('<center>'+menuLinksArr[boardLinks[i]].innerHTML+'<br>'+count+' New Posts</center>');
                i++;
                percentage = i / totalboards;
                percentage = Math.round(percentage * 100);
                myRef.document.getElementById('progress').innerHTML = i;
                myRef.document.getElementById('percent').innerHTML = percentage;
                var a = myRef.document.getElementsByTagName('a');
                for (var z = 0; z <a.length; z++){ 
                    a[z].target = "main"; 
                    if(a[z].href.indexOf('ShowPost.asp') != -1 && a[z].href.indexOf('Boards/') == -1){
                        //if(a[z].innerHTML == 'Newest'){
                        t = a[z].href.indexOf('ghqnet.com/') //SPLIT THE HTTP:SOL SHIT OUT AND PUT IN BOARDS/


                        if(t!=-1){
                            var val = a[z].href.slice(t+11);
                            a[z].href = 'Boards/'+val;
                        }
                    }

                }
                links_CheckforNewPostsOnBoard(i, 0);
            }
        });
    }
    function links_CheckforNewPosts(t) {
        var allNew = document.getElementsByName("NEW");
        for(var i=0; i<allNew.length; ++i){
            allNew[i].parentNode.removeChild( allNew[i] ); 
            i--;
        }
        myRef = window.open('about:blank','newPostsPage','left=20,top=20,width=1000,height=500,scrollbars=1');
        if(ignorecount >= 2){ pleral = 's'; }else{ pleral = ''; }
        myRef.document.body.innerHTML = ''; //FIREFOX OLD
        myRef.document.write('<meta content="Earth, Military, Army, Navy, Marines, Air Force, Jets, Troops, Spies, Games" name="keywords"><html><head><meta content="en-us" http-equiv="Content-Language"></head><body background="" bgcolor="black" link="#00C0FF" text="#DDDDDD" vlink="#d3d3d3"><style type="text/css"> a:hover {	text-decoration: underline; } td { font-family: verdana, ariel, Helvetica, sans-serif; font-size: 14px; } .style1 { text-align: center;	font-size: small; } .style2 { font-size: x-small; } </style><table border="0" cellpadding="3" cellspacing="1" width="100%"><tr bgcolor="#222222"><td class="style1"><strong>Boards with New Posts<br><span id="progress">0</span> of '+count+' Processed - <span id="percent">0</span>% Completed - Ignoring '+ignorecount+' Board'+pleral+'<br></strong><span class="style2">Click on a Board Name or a Post to go to that page.<br>Click on &quot;Mark Board Read&quot; to mark all posts as read.<br>Click &quot;Ignore Board&quot; to no longer parse this board for new Posts. (Less Boards Monitored = Quicker Processing)</span></td></tr></table>');
        links_CheckforNewPostsOnBoard(0, 0);
    }
    var curTime = "";
    var myRef = '';
    var patt5=/ShowBoard\.asp\?board=.+/i; //Is it a board link?
    var menuLinksArr = document.getElementsByTagName("a");
    var boardLinks = new Array();
    var newPostsArr = new Array();
    var temp = '';
    var count = 0;
    var ignorecount = 0;
    var boardsignore = getSetting( 'boards_ignore', ' ' );
    for(var i = 0; i<menuLinksArr.length; i++) {
        var isBoard = menuLinksArr[i].href.match(patt5);
        if(isBoard === null){ continue; }
        if(count == 0 && ignorecount == 0){
            temp = menuLinksArr[i].innerHTML;
        }else{
            temp = temp+'::::::'+menuLinksArr[i].innerHTML;
        }
        if(boardsignore.indexOf('::::::'+menuLinksArr[i].innerHTML+'::::::') != -1){
            ignorecount++;
            continue;
        }
        boardLinks[count] = i;
        count++;
    }
    var totalboards = count;
    setSetting( 'menuBoards', temp );
    var allTR = document.getElementsByTagName('tr');			// get all TD elements
    var editing = false;
    var row = allTR[0].parentNode.insertRow(0);
    var cell = row.insertCell(0);
    cell.bgColor = allTR[1].bgColor;
    row.bgColor = allTR[1].bgColor;
    cell.align = 'center';
    cell.innerHTML = '<font color="orange"><strong>GHQEditor</strong></font>';

    var row = allTR[0].parentNode.insertRow(1);
    var cell = row.insertCell(0);
    cell.bgColor = allTR[3].bgColor;
    row.bgColor = allTR[3].bgColor;
    cell.align = 'center';
    cell.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\';"><font style="color: Orange; font-size: 12px;">Edit Menu Items</font></span>';
    cell.addEventListener("click", function(){links_ShowEdits();}, false);
/*
    var row = allTR[0].parentNode.insertRow(2);
    var cell = row.insertCell(0);
    cell.bgColor = allTR[1].bgColor;
    row.bgColor = allTR[1].bgColor;
    cell.align = 'center';
    cell.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\';"><font style="color: Orange; font-size: 12px;">Reset Menu Items</font></span>';
    cell.addEventListener("click", function(){links_ResetMenuVerify();}, false);
*/
    var row = allTR[0].parentNode.insertRow(2);
    var cell = row.insertCell(0);
    cell.bgColor = allTR[1].bgColor;
    row.bgColor = allTR[1].bgColor;
    cell.align = 'center';

    if(browser === 'Firefox'){
        cell.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\';"><font style="color: Orange; font-size: 12px; text-decoration: line-through;">Check 4 New Posts</font></span>';
    }else{
        cell.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\';"><font style="color: Orange; font-size: 12px;">Check 4 New Posts</font></span>';
        cell.addEventListener("click", function(){links_CheckforNewPostsVerify();}, false);
    }

    var row = allTR[0].parentNode.insertRow(-1);
    var cell = row.insertCell(0);
    cell.align = 'center';
    cell.innerHTML = '<font style="color: Orange; font-size: 14px;"><b>____________</b></font>';
    row.style.display = 'none';
    row.id = 'EditMenuTitle_'+row.rowIndex;
    var row = allTR[0].parentNode.insertRow(-1);
    var cell = row.insertCell(0);
    cell.bgColor = allTR[0].bgColor;
    row.bgColor = allTR[0].bgColor;
    row.id = 'EditMenuTitle_'+row.rowIndex;
    cell.align = 'center';
    cell.innerHTML = '<font style="color: Orange; font-size: 14px;"><b>HIDDEN ITEMS</b></font>';
    row.style.display = 'none';
    row.id = 'EditMenuTitle_'+row.rowIndex;
    var links = getSetting( 'Links', '' );
    var linksarr = links.split('::::::');
    if(linksarr.length != 0){
        for(var i=0; i<allTR.length; ++i){
            var val = allTR[i].firstChild.firstChild.innerHTML;
            if(allTR[i].id.slice(0, 14) == 'EditMenuTitle_' || allTR[i].id.slice(0, 6) == 'Moved_'){
                break;
            }
            if(allTR[i].id == ''){
                allTR[i].id = 'EditMenu_'+allTR[i].rowIndex;
            }
            if(links.indexOf(':::'+val+':::')!=-1){
                var obj = allTR[i].cloneNode(true);
                var id = obj.id.substr(9);
                obj.id = 'Moved_'+id;
                var s = allTR[i].parentNode.appendChild(obj);
                s.firstChild.addEventListener("click", function(){links_UnMoveMenuItem(this);}, false);
                allTR[i].style.display = 'none';
                s.style.display = 'none';
            }
        }
    }
}
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
function siteManager() {
    var allTA = document.getElementsByTagName('textarea');			// get all TD elements
    for(var i=0; i<allTA.length; ++i){
        if(allTA[i].name == 'HeadlineTitle'){
            allTA[i].cols = 75;
            allTA[i].rows = 6;
        }
    }
}
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
function targetInfo() {
    function targetInfo_hideRow(t, type) {
        if(Hide[t.id] === undefined){
            Hide[t.id] = new Array();
        }
        if(Hide[t.id][type] === undefined){
            Hide[t.id][type] = true;
        }
        t.style.display = 'none';
    }
    function targetInfo_unHideRow(t, type) {
        if(Hide[t.id] === undefined){
            return;
        }
        if(Hide[t.id][type] === undefined){
            return;
        }
        delete Hide[t.id][type];
        for (var i = 0; i < Hide[t.id].length; ++i){ //CHROME FIX - WAS a for each
            if(Hide[t.id][i]){
                return;
            }
        }
        delete Hide[t.id];
        t.style.display = '';
    }
    function targetInfo_filter(t) {
        var Name = t.id.substr(7);
        var Value = t.value; 
        var CellIndex = t.parentNode.cellIndex; 
        switch (Name){
            case 'GDI':
                for(var i=0; i<allTR.length; ++i){
                    if(allTR[i].id === undefined){ continue; }
                    if(allTR[i].id == ''){ continue; }
                    if(Value == ''){
                        targetInfo_unHideRow(allTR[i], Name);
                        continue;
                    }
                    if(Value == allTR[i].cells[CellIndex].firstChild.innerHTML){
                        targetInfo_unHideRow(allTR[i], Name);
                    }else{
                        targetInfo_hideRow(allTR[i], Name);
                    }
                }
                break;
            case 'Age':
            case 'NW':
            case 'Land':
            case 'Spal':
            case 'SDI':
                var Operator = Value.substr(0, 1); 
                var Value = Value.substr(1); 
                for(var i=0; i<allTR.length; ++i){
                    if(allTR[i].id === undefined){ continue; }
                    if(allTR[i].id == ''){ continue; }
                    if(Value == ''){
                        targetInfo_unHideRow(allTR[i], Name);
                        continue;
                    }
                    if(Name == 'Age'){
                        var TRValue = allTR[i].cells[CellIndex].firstChild.firstChild.innerHTML;
                    }else if( Name == 'Spal'){
                        var TRValue = allTR[i].cells[CellIndex].firstChild.innerHTML;
                    }else if( Name == 'SDI'){
                        var TRValue = allTR[i].cells[CellIndex].firstChild.firstChild.innerHTML.slice(0, -1);
                    }else if( Name == 'Land'){
                        var TRValue = allTR[i].cells[CellIndex].firstChild.innerHTML.replace(/\,/g,'');
                    }else{
                        var TRValue = allTR[i].cells[CellIndex].firstChild.innerHTML;
                    }

                    if(Operator == '>'){
                        if(parseFloat(TRValue) >= parseFloat(Value)){
                            targetInfo_unHideRow(allTR[i], Name);
                        }else{
                            targetInfo_hideRow(allTR[i], Name);
                        }
                    }else{
                        if(parseFloat(TRValue) < parseFloat(Value)){
                            targetInfo_unHideRow(allTR[i], Name);
                        }else{
                            targetInfo_hideRow(allTR[i], Name);
                        }
                    }
                }
                break;
            case 'NWDiff':
            case 'LandDiff':
                for(var i=0; i<allTR.length; ++i){
                    if(allTR[i].id === undefined){ continue; }
                    if(allTR[i].id == ''){ continue; }
                    if(Value == ''){
                        targetInfo_unHideRow(allTR[i], Name);
                        continue;
                    }
                    if(allTR[i].cells[CellIndex].firstChild.innerHTML != '' && allTR[i].cells[CellIndex].firstChild.innerHTML != '0'){
                        targetInfo_unHideRow(allTR[i], Name);
                    }else{
                        targetInfo_hideRow(allTR[i], Name);
                    }
                }
                break;
            default:
                break;
        }
    }
    function targetInfo_quickSets(t) {
        if(t == 'UnHide'){
            for(var i=0; i<allTR.length; ++i){
                targetInfo_unHideRow(allTR[i], 'Hide');
            }
        }else if(t == 'Filters'){
            var allSelects = document.getElementsByTagName('select');
            for(var i=0; i<allSelects.length; ++i){
                for(var x=0; x<allSelects[i].length; ++x){
                    if(allSelects[i].options[x].value == ''){ 
                        allSelects[i].selectedIndex = allSelects[i].options[x].index;
                        break;
                    }
                }
            }
            for(var x=0; x<allTR.length; ++x){
                var Name = allTR[x].id.substr(7);
                allTR[x].style.display = '';
                delete Hide;
                var Hide = new Array;
            }
        }else{
            var NW = $('Filter_NWDiff');
            var Land = $('Filter_LandDiff');
            var NW_Name = NW.id.substr(7);
            var NW_Value = NW.value; 
            var NW_CellIndex = NW.parentNode.cellIndex; 
            var Land_Name = Land.id.substr(7);
            var Land_Value = Land.value; 
            var Land_CellIndex = Land.parentNode.cellIndex; 
            for(var x=0; x<allTR.length; ++x){
                var Name = allTR[x].id.substr(7);
                allTR[x].style.display = '';
                delete Hide;
                var Hide = new Array;
                if(allTR[x].id === undefined){ continue; }         
                if(allTR[x].id === ''){ continue; }           
                if(allTR[x].cells[NW_CellIndex].firstChild.innerHTML == '0' && allTR[x].cells[Land_CellIndex].firstChild.innerHTML == '0'){
                    targetInfo_hideRow(allTR[x], Name);
                }else{
                    targetInfo_unHideRow(allTR[x], Name);
                }
            }
        }
    }
    var allTR = document.getElementsByTagName('tr');			// get all TD elements	
    Hide = new Array();
    Data = new Array();
    var allTH = document.getElementsByTagName('th');			// get all TD elements
    for(var i=0; i<allTH.length; ++i){
        if(allTH[i].innerHTML.slice(-11, -4) == 'Country' ){
            var table = allTH[i].parentNode.parentNode;
            table.id = 'CountryTable';
            var header = 'Number';
            num = 10000;
            for (var x=0; x<table.rows.length; x++) {
                var newCell = table.rows[x].insertCell(i+1);
                newCell.bgColor = '#222222';
                newCell.align = 'center';
                if(x == 0){
                    newCell.innerHTML = '<text color=#DDDDDD><b>'+header+'</b></font>';
                }else{
                    newCell.innerHTML = '';
                    newCell.id = num+'_CountryNumber';
                    num++;
                }
                var newCell = table.rows[x].insertCell(i);
                newCell.bgColor = '#222222';
                newCell.align = 'center';
                if(x == 0){
                    newCell.innerHTML = '<text color=#DDDDDD><b>Hide Country</b></font>';
                }else{
                    newCell.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">Hide</span>';
                    newCell.id = 'Hide_'+x;
                    newCell.addEventListener("click", function(){targetInfo_hideRow(this.parentNode, 'Hide');}, false);
                }
            }
        } 
    }
    var sp1 = document.createElement("span");
    sp1.innerHTML = '<table width="100%"><tr><td align="right">QUICKSETS: <button style="color: orange; font-family: Verdana, Helvetica, Arial; font-size: 10 pt; font-weight: bold; background-color: #191919; border: 2px #444444 solid" id="QuickSet_NWLandChange" onClick="return false;">Show only NW OR Land Changes</button> - <button style="color: red; font-family: Verdana, Helvetica, Arial; font-size: 10 pt; font-weight: bold; background-color: #191919; border: 2px #444444 solid" id="QuickSet_UnHide" onClick="return false;">UnHide All Rows</button><button style="color: red; font-family: Verdana, Helvetica, Arial; font-size: 10 pt; font-weight: bold; background-color: #191919; border: 2px #444444 solid" id="QuickSet_Filters" onClick="return false;"><strong>Reset Filters</strong></button></td></td></table>';
    table.parentNode.parentNode.insertBefore(sp1, table.parentNode);
    document.getElementById("QuickSet_NWLandChange").addEventListener("click", function(){targetInfo_quickSets("NWLandChange");}, false);
    document.getElementById("QuickSet_UnHide").addEventListener("click", function(){targetInfo_quickSets("UnHide");}, false);
    document.getElementById("QuickSet_Filters").addEventListener("click", function(){targetInfo_quickSets("Filters");}, false);

    var row = table.insertRow(0);
    var cell = row.insertCell(0);
    cell.colSpan = table.rows[1].cells.length;
    cell.innerHTML = '';
    var allTH = table.getElementsByTagName('th');			// get all TD elements
    var row = table.insertRow(1);
    for(var i=0; i<allTH.length; ++i){
        var column = allTH[i].firstChild.innerHTML;
        Data[allTH[i].cellIndex] = column;
    }
    for(var i=0; i<table.rows[2].cells.length; ++i){
        var cell = row.insertCell(i);
        cell.bgColor = 'black';
        if(i == 0){
            cell.align = 'center';
            cell.innerHTML = '<a href="javascript:location.reload()">Refresh this page</a>';
            continue;
        }
        if(i == 2){
            cell.align = 'right';
            cell.innerHTML = 'FILTERS: ';
            continue;
        }
        cell.align = 'center';
        if(Data[i] === undefined){
            cell.innerHTML = ' ';
            continue;
        }

        switch (Data[i])
        {
            case 'GDI':
                cell.innerHTML = '<select name="Filter_GDI" id="Filter_GDI" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option> </option><option>Y</option></select>';
                document.getElementById("Filter_GDI").addEventListener("change", function(){targetInfo_filter(this);}, false);
                break;
            case 'Age(h)':
                cell.innerHTML = '<select name="Filter_Age" id="Filter_Age" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option value="<24"><24</option><option value="<6"><6</option><option value="<2"><2</option><option selected value=""> </option><option value=">2">>2</option><option value=">6">>6</option><option value=">12">>12</option><option value=">24">>24</option></select>';
                document.getElementById("Filter_Age").addEventListener("change", function(){targetInfo_filter(this);}, false);
                break;
            case 'NW(M)':
                cell.innerHTML = '<select name="Filter_NW" id="Filter_NW" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option value="<5"><5m</option><option value="<1"><1m</option><option value="<0.5"><500k</option><option selected value=""> </option><option value=">0.5">>500k</option><option value=">1">>1m</option><option value=">2">>2m</option><option value=">5">>5m</option></select>';
                document.getElementById("Filter_NW").addEventListener("change", function(){targetInfo_filter(this);}, false);
                break;
            case 'NW Diff':
                cell.innerHTML = '<select name="Filter_NWDiff" id="Filter_NWDiff" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option value=""> </option><option value="Changed">Changed</option></select>';
                document.getElementById("Filter_NWDiff").addEventListener("change", function(){targetInfo_filter(this);}, false);
                break;
            case 'Land':
                cell.innerHTML = '<select name="Filter_Land" id="Filter_Land" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option value="<10000"><10000</option><option value="<5000"><5000</option><option selected value=""> </option><option value=">1000">>1000</option><option value=">5000">>5000</option><option value=">10000">>10000</option><option value=">20000">>20000</option></select>';
                document.getElementById("Filter_Land").addEventListener("change", function(){targetInfo_filter(this);}, false);
                break;
            case 'Land Diff':
                cell.innerHTML = '<select name="Filter_LandDiff" id="Filter_LandDiff" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option value=""> </option><option value="Changed">Changed</option></select>';
                document.getElementById("Filter_LandDiff").addEventListener("change", function(){targetInfo_filter(this);}, false);
                break;
            case 'Spal':
                cell.innerHTML = '<select name="Filter_Spal" id="Filter_Spal" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option value="<75"><75</option><option value="<50"><50</option><option value="<25"><25</option><option value="<15"><15</option><option selected value=""> </option></select>';
                document.getElementById("Filter_Spal").addEventListener("change", function(){targetInfo_filter(this);}, false);
                break;
            case 'SDI':
                cell.innerHTML = '<select name="Filter_SDI" id="Filter_SDI" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option value="<50"><50%</option><option value="<25"><25%</option><option value="<10"><10%</option><option selected value=""> </option></select>';
                document.getElementById("Filter_SDI").addEventListener("change", function(){targetInfo_filter(this);}, false);
                break;
            default:
                continue;
                break;
        }
    }
    var allTD = table.getElementsByTagName('td');			// get all TD elements
    var number = 10000;
    for(var i=0; i<allTD.length; ++i){
        if(allTD[i].parentNode.rowIndex <= 2){
            continue;
        }
        var Name = Data[allTD[i].cellIndex];
        if(Name != undefined){
            allTD[i].id = number+'_'+Name;
            number++;
        }
        if(allTD[i].id == ''){
            continue;
        }
        if(allTD[i].id.substr(6) == 'CountryNumber'){
            var last = i-1;
            //				var num = allTD[last].innerHTML.split('#'); // OLD FIREFOX
            //				allTD[i].innerHTML = num[1].slice(0, -5); // OLD FIREFOX
            var num = allTD[last].firstChild.innerHTML.split('#'); //CHROME FIX
            allTD[i].innerHTML = num[1].slice(0, -1); //CHROME FIX
            allTD[last].noWrap = true;
            allTD[i].parentNode.id = 'TR_'+num[1].slice(0, -1);
        } 
        if(Name == undefined){
            continue;
        } 
        switch (Name)
        {
            case 'GDI':
                var val = allTD[i].innerHTML;
                if(val!=''){
                    allTD[i].bgColor = 'DarkRed';
                }
                break;
            case 'Age(h)':
                var val = allTD[i].firstChild.firstChild.innerHTML;
                if(val <= 2 && val!=''){
                    allTD[i].bgColor = 'DarkGreen';
                }else if(val >= 12){
                    allTD[i].bgColor = 'DarkRed';
                }else if(val >= 3){
                    allTD[i].bgColor = '#800080';
                }else{
                    allTD[i].bgColor = '#222222';
                }
                break;
            case 'NW Diff':
                var val = allTD[i].firstChild.innerHTML;
                if(val!='' && val != 0){
                    allTD[i].bgColor = 'DarkRed';
                }
                break;
            case 'Land Diff':
                var val = allTD[i].firstChild.innerHTML;
                if(val!='' && val!='0'){
                    allTD[i].bgColor = 'DarkRed';
                }
                break;
            case 'Spal':
                var val = allTD[i].firstChild.innerHTML;
                if(val == ''){ continue; }
                if(val <= 25){
                    allTD[i].bgColor = 'DarkGreen';
                }else if(val >= 50){
                    allTD[i].bgColor = 'DarkRed';
                }else{
                    allTD[i].bgColor = '#800080';
                }
                break;
            case 'SDI':
                var val = allTD[i].firstChild.innerHTML.slice(0, -1);
                if(val <= 24 && val!=''){
                    allTD[i].bgColor = 'DarkGreen';
                }else if(val >= 50){
                    allTD[i].bgColor = 'DarkRed';
                }else if(val >= 25){
                    allTD[i].bgColor = '#800080';
                }else{
                    allTD[i].bgColor = '#222222';
                }
                break;

            default:
                continue;
                break;
        }
    }
    var NW = $('Filter_NWDiff');
    var Land = $('Filter_LandDiff');
    if(NW === undefined || Land === undefined){ 
        var b = $('QuickSet_NWLandChange');
        b.parentNode.removeChild(b);
    }

}
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
function targetSelector() {
    function targetSelector_quickSets(t) {
        for(var i=0; i<allInputs.length; ++i){
            if(allInputs[i].type == 'checkbox'){
                allInputs[i].checked = false; 
            }
        }
        for(var i=0; i<Data[t].length; ++i){
            var temp = Data[t][i];
            document.getElementById(temp).checked = true;
        }
    }
    var Data = new Array();
    Data['SiG'] = new Array('Tag', 'Age', 'Networth', 'NWDiff', 'Land', 'LandDiff', 'Spies', 'Spal', 'Missiles');
    Data['Warmod'] = new Array();
    var allTD;												// holds collection of all TD elements
    allTD = document.getElementsByTagName('td');			// get all TD elements
    var allInputs = document.getElementsByTagName("input");
    var number = 0;
    for(var i=0; i<allInputs.length; ++i){
        allInputs[i].id = allInputs[i].name;
        if(allInputs[i].type == 'checkbox'){
            if(allInputs[i].checked == true){
                Data['Warmod'][number] = allInputs[i].id;
                number++;
            }
        }
    }
    for(var i=0; i<allTD.length; ++i){
        if(allTD[i].innerHTML  == "Select your desired fields"){
            allTD[i].innerHTML = allTD[i].innerHTML + '<BR>QUICKSETS: <button style="color: darkturquoise; font-family: Verdana, Helvetica, Arial; font-size: 10 pt; font-weight: bold; background-color: #191919; border: 2px #444444 solid" id="QuickSet_Warmod" onClick="return false;"><strong>Warmod</strong></button>  |  <button style="color: DarkViolet; font-family: Verdana, Helvetica, Arial; font-size: 10 pt; font-weight: bold; background-color: #191919; border: 2px #444444 solid" id="QuickSet_SiG" onClick="return false;"><strong>SiG</strong></button>';
            document.getElementById("QuickSet_Warmod").addEventListener("click", function(){targetSelector_quickSets("Warmod");}, false);
            document.getElementById("QuickSet_SiG").addEventListener("click", function(){targetSelector_quickSets("SiG");}, false);
        } 
    }
}
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
function botList() {
    function targetInfo_UnhideAll() {
        Hide = [];
        targetInfo_FullFilter();
    }
    function targetInfo_hideRow(t) {
       Hide.push(t.id);
       t.style.display = 'None';
    }
    function targetInfo_FullFilter() {
        var Filter_Gov = document.getElementById("Filter_Gov").value;
        var Filter_Gov2 = document.getElementById("Filter_Gov2").value;
        var Filter_NWOperator = document.getElementById("Filter_NWOperator").value;
        var Filter_NW = document.getElementById("Filter_NW").value;
        var Filter_NWDiff = document.getElementById("Filter_NWDiff").value;
        var Filter_LandOperator = document.getElementById("Filter_LandOperator").value;
        var Filter_Land = document.getElementById("Filter_Land").value;
        var Filter_LandDiff = document.getElementById("Filter_LandDiff").value;
        var Filter_GDI = document.getElementById("Filter_GDI").value;
        var Filter_Age = document.getElementById("Filter_Age").value;
        var Filter_Def24 = document.getElementById("Filter_Def24").value;
        var Filter_Def48 = document.getElementById("Filter_Def48").value;
        var Filter_Def72 = document.getElementById("Filter_Def72").value;
        var Filter_Strat = document.getElementById("Filter_Strat").value;
        var Filter_Strat2 = document.getElementById("Filter_Strat2").value;
        var Filter_StratPlanned = document.getElementById("Filter_StratPlanned").value;
        var Filter_StratPlanned2 = document.getElementById("Filter_StratPlanned2").value;
        var Filter_Tech = document.getElementById("Filter_Tech").value;
        var Filter_JetsOperator = document.getElementById("Filter_JetsOperator").value;
        var Filter_Jets = document.getElementById("Filter_Jets").value;
        for (i = 2, row; row = table.rows[i]; i++) {
            row.style.display = '';
            if(Hide.includes(row.id)){
                row.style.display = 'None';
            }
            var Value_Gov = row.cells[colID_Gov].firstChild.innerHTML;
            var Value_NW = row.cells[colID_NW].firstChild.innerHTML;
            var Value_NWDiff = row.cells[colID_NWDiff].firstChild.innerHTML;
            var Value_Land = Number(row.cells[colID_Land].firstChild.innerHTML.replace(/\D/g,''));
            var Value_LandDiff = row.cells[colID_LandDiff].firstChild.innerHTML;
            var Value_GDI = row.cells[colID_GDI].firstChild.innerHTML;
            var Value_Age = Number(row.cells[colID_Age].firstChild.innerHTML);
            var Value_Def24 = Number(row.cells[colID_Def24].firstChild.innerHTML);
            var Value_Def48 = Number(row.cells[colID_Def48].firstChild.innerHTML);
            var Value_Def72 = Number(row.cells[colID_Def72].firstChild.innerHTML);
            var Value_Strat = row.cells[colID_Strat].firstChild.innerHTML;
            var Value_StratPlanned = row.cells[colID_StratPlanned].firstChild.innerHTML;
            var Value_Tech = Number(row.cells[colID_Tech].firstChild.innerHTML.replace(/\D/g,''));
            var Value_Jets = Number(row.cells[colID_Jets].firstChild.innerHTML.replace(/\D/g,''));
            //CHECK GOV
            document.getElementById("Filter_Gov2").style.display = 'none';
            if(Filter_Gov != ""){
                document.getElementById("Filter_Gov2").style.display = '';
            }
            if(Filter_Gov != Value_Gov && Filter_Gov2 != Value_Gov && Filter_Gov != ""){
                row.style.display = 'none';
                continue;
            }
            //CHECK Filter_NW
            if(Filter_NWOperator == ">"){
                if(Filter_NW > Value_NW && Filter_NW != ""){
                    row.style.display = 'none';
                    continue;
                }
            }else{
                if(Filter_NW < Value_NW && Filter_NW != ""){
                    row.style.display = 'none';
                    continue;
                }
            }
            //CHECK Filter_NWDiff
            if(Filter_NWDiff == "Unchanged"){
                if(Value_NWDiff != '' && Value_NWDiff != '0'){
                    row.style.display = 'none';
                    continue;
                }
            }else if(Filter_NWDiff == "Changed"){
                if(Value_NWDiff == '' || Value_NWDiff == '0'){
                    row.style.display = 'none';
                    continue;
                }
            }
            //CHECK Filter_Land
            if(Filter_LandOperator == ">"){
                if(Filter_Land >= Value_Land && Filter_Land != ""){
                    row.style.display = 'none';
                    continue;
                }
            }else{
                if(Filter_Land <= Value_Land && Filter_Land != ""){
                    row.style.display = 'none';
                    continue;
                }
            }
            //CHECK Filter_LandDiff
            if(Filter_LandDiff == "Unchanged"){
                if(Value_LandDiff != '' && Value_LandDiff != '0'){
                    row.style.display = 'none';
                    continue;
                }
            }else if(Filter_LandDiff == "Changed"){
                if(Value_LandDiff == '' || Value_LandDiff == '0'){
                    row.style.display = 'none';
                    continue;
                }
            }
            //CHECK Filter_GDI
            if(Filter_GDI == "Y"){
                if(Value_GDI != 'Y'){
                    row.style.display = 'none';
                    continue;
                }
            }else if(Filter_GDI == "N"){
                if(Value_GDI == 'Y'){
                    row.style.display = 'none';
                    continue;
                }
            }
            //CHECK Filter_Age
            if(Filter_Age <= Value_Age && Filter_Age != ""){
                row.style.display = 'none';
                continue;
            }
            //CHECK Filter_Def24
            if(Filter_Def24 < Value_Def24 && Filter_Def24 != ""){
                row.style.display = 'none';
                continue;
            }
            //CHECK Filter_Def48
            if(Filter_Def48 < Value_Def48 && Filter_Def48 != ""){
                row.style.display = 'none';
                continue;
            }
            //CHECK Filter_Def72
            if(Filter_Def72 < Value_Def72 && Filter_Def72 != ""){
                row.style.display = 'none';
                continue;
            }
            //CHECK Filter_Strat
            document.getElementById("Filter_Strat2").style.display = 'none';
            if(Filter_Strat != ""){
                document.getElementById("Filter_Strat2").style.display = '';
            }
            if(Filter_Strat != Value_Strat && Filter_Strat2 != Value_Strat && Filter_Strat != ""){
                row.style.display = 'none';
                continue;
            }
            //CHECK Filter_StratPlanned
            document.getElementById("Filter_StratPlanned2").style.display = 'none';
            if(Filter_StratPlanned != ""){
                document.getElementById("Filter_StratPlanned2").style.display = '';
            }
            if(Filter_StratPlanned != Value_StratPlanned && Filter_StratPlanned2 != Value_StratPlanned && Filter_StratPlanned != ""){
                row.style.display = 'none';
                continue;
            }
            //CHECK Filter_Tech
            if(Filter_Tech > Value_Tech && Filter_Tech != ""){
                row.style.display = 'none';
                continue;
            }
            //CHECK Filter_Jets
            if(Filter_JetsOperator == ">"){
                if(Filter_Jets > Value_Jets && Filter_Jets != ""){
                    row.style.display = 'none';
                    continue;
                }
            }else{
                if(Filter_Jets < Value_Jets && Filter_Jets != ""){
                    row.style.display = 'none';
                    continue;
                }
            }
        }
    }

    var colID_Country = 1;
    var colID_Gov = 3;
    var colID_NW = 4;
    var colID_NWDiff = 5;
    var colID_Land = 6;
    var colID_LandDiff = 7;
    var colID_GDI = 9;
    var colID_Age = 10;
    var colID_Def24 = 11;
    var colID_Def48 = 12;
    var colID_Def72 = 13;
    var colID_Strat = 14;
    var colID_StratPlanned = 15;
    var colID_Tech = 16;
    var colID_Jets = 17;
    var i = 0;
    var Hide = new Array();
    var row;
    var table = document.getElementsByTagName('table')[3];
    var sp1 = document.createElement("span");
    sp1.innerHTML = '<table width="100%"><tr><td align="left"><a href="javascript:location.reload()">Refresh this page</a></td><td align="right">QUICKSETS: <button style="color: red; font-family: Verdana, Helvetica, Arial; font-size: 10 pt; font-weight: bold; background-color: #191919; border: 2px #444444 solid" id="QuickSet_UnHide" onClick="return false;">UnHide All Rows</button><button style="color: red; font-family: Verdana, Helvetica, Arial; font-size: 10 pt; font-weight: bold; background-color: #191919; border: 2px #444444 solid" id="QuickSet_Save" onClick="return false;"><strong><strike>Save Settings</strike></strong></button></td></td></table>';
    table.parentNode.insertBefore(sp1, table);
    $("QuickSet_UnHide").addEventListener("click", function(){targetInfo_UnhideAll();}, false);
    var num = 0;
    for (i = 0, row; row = table.rows[i]; i++) {
        row.id = 'Row_'+i;
        var newCell = row.insertCell(1);
        newCell.align = 'center';
        if(i == 0){
            newCell.innerHTML = '<text color=#DDDDDD><b>#</b></font>';
        }else{
            num = row.cells[0].firstChild.innerHTML.split('#')[1].slice(0, -1);
            newCell.innerHTML = num;
            newCell.id = 'row_'+num;
        }
        newCell = row.insertCell(0);
        newCell.align = 'center';
        if(i == 0){
            newCell.innerHTML = '';
        }else{
            newCell.innerHTML = '<span onmouseover="this.style.cursor=\'pointer\'; this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'" style="color:red">X</span>';
            newCell.id = 'Hide_'+i;
            newCell.addEventListener("click", function(){targetInfo_hideRow(this.parentNode, 'Hide');}, false);
        }
        if(i % 2 == 0){
        }else{
            row.style.backgroundColor = '#313131';
        }
        //ADD COLORS TO AGE FIELD
        var val = Number(row.cells[colID_Age].firstChild.innerHTML);
        if(val <= 3 && val != '' || isNaN(val) && i != 0){
            row.cells[colID_Age].bgColor = 'DarkGreen';
        }
        //ADD COLORS TO DEF24
        val = Number(row.cells[colID_Def24].firstChild.innerHTML);
        if(val == 0 && !isNaN(val)){
            row.cells[colID_Def24].bgColor = 'DarkGreen';
        }else if(val <= 2 && !isNaN(val)){
            row.cells[colID_Def24].bgColor = 'Green';
        }else if(val <= 6 && !isNaN(val)){
            row.cells[colID_Def24].bgColor = '#800080';
        }else if(!isNaN(val)){
            row.cells[colID_Def24].bgColor = 'DarkRed';
        }
        /*
        //ADD COLORS TO NW DIFF
        val = row.cells[colID_NWDiff].firstChild.innerHTML;
        if(val!='' && val != 0){
           row.cells[colID_NWDiff].bgColor = 'DarkRed';
        }
        //ADD COLORS TO LAND DIFF
        val = row.cells[colID_LandDiff].firstChild.innerHTML;
        if(val!='' && val!='0'){
            row.cells[colID_LandDiff].bgColor = 'DarkRed';
        }
        */
    }
    //CREATE HEADER ROW
    row = table.insertRow(0);
    row.style.backgroundColor = '#222222';
    var cell = row.insertCell(0);
    cell.colSpan = 3;
    cell.align = "right";
    cell.innerHTML = 'FILTERS: ';
    //GOV
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_Gov" id="Filter_Gov" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="Communism">Comm</option><option value="Democracy">Democ</option><option value="Fascism">Fasc</option><option value="Theocracy">Theo</option><option value="Dictatorship">Dict</option><option value="Monarchy">Mon</option><option value="Republic">Rep</option><option value="Tyranny">Tyr</option></select>';
    cell.innerHTML += '<br><select name="Filter_Gov2" id="Filter_Gov2" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value=""></option><option value="Communism">Comm</option><option value="Democracy">Democ</option><option value="Fascism">Fasc</option><option value="Theocracy">Theo</option><option value="Dictatorship">Dict</option><option value="Monarchy">Mon</option><option value="Republic">Rep</option><option value="Tyranny">Tyr</option></select>';
    document.getElementById("Filter_Gov").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    document.getElementById("Filter_Gov2").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    document.getElementById("Filter_Gov2").style.display = 'none';
    //NETWORTH
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_NWOperator" id="Filter_NWOperator" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option value="<"><</option><option selected value=">">></option></select>';
    cell.innerHTML += '<select name="Filter_NW" id="Filter_NW" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="0.5">500k</option><option value="1">1m</option><option value="2">2m</option><option value="3">3m</option><option value="4">4m</option><option value="5">5m</option><option value="6">6m</option><option value="7">7m</option><option value="8">8m</option><option value="9">9m</option><option value="10">10m</option><option value="15">15m</option><option value="20">20m</option></select>';
    document.getElementById("Filter_NWOperator").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    document.getElementById("Filter_NW").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    //NWDiff
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_NWDiff" id="Filter_NWDiff" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="Changed">Changed</option><option value="Unchanged">Unchanged</option></select>';
    document.getElementById("Filter_NWDiff").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    //LAND
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_LandOperator" id="Filter_LandOperator" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option value="<"><</option><option selected value=">">></option></select>';
    cell.innerHTML += '<select name="Filter_Land" id="Filter_Land" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="5000">5k</option><option value="6000">6k</option><option value="7000">7k</option><option value="8000">8k</option><option value="9000">9k</option><option value="10000">10k</option><option value="15000">15k</option><option value="20000">20k</option><option value="30000">30k</option><option value="40000">40k</option><option value="50000">50k</option><option value="750000">75k</option><option value="100000">100k</option></select>';
    document.getElementById("Filter_LandOperator").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    document.getElementById("Filter_Land").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    //LandDiff
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_LandDiff" id="Filter_LandDiff" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="Changed">Changed</option><option value="Unchanged">Unchanged</option></select>';
    document.getElementById("Filter_LandDiff").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    //SKIP
    cell = row.insertCell(-1);
    cell.align = "center";
    //GDI
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_GDI" id="Filter_GDI" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="Y">Y</option><option value="N">N</option></select>';
    document.getElementById("Filter_GDI").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    //AGE
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_Age" id="Filter_Age" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="2"><2</option><option value="4"><4</option><option value="6"><6</option><option value="8"><8</option><option value="10"><10</option><option value="12"><12</option><option value="24"><24</option><option value="48"><48</option><option value="72"><72</option></select>';
    document.getElementById("Filter_Age").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    //DEF24
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_Def24" id="Filter_Def24" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="0">None</option><option value="1"><1</option><option value="2"><2</option><option value="3"><3</option><option value="4"><4</option><option value="5"><5</option><option value="6"><6</option><option value="8"><8</option><option value="10"><10</option><option value="12"><12</option></select>';
    document.getElementById("Filter_Def24").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    //DEF48
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_Def48" id="Filter_Def48" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="0">None</option><option value="1"><1</option><option value="2"><2</option><option value="3"><3</option><option value="4"><4</option><option value="5"><5</option><option value="6"><6</option><option value="8"><8</option><option value="10"><10</option><option value="12"><12</option></select>';
    document.getElementById("Filter_Def48").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    //DEF72
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_Def72" id="Filter_Def72" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="0">None</option><option value="1"><1</option><option value="2"><2</option><option value="3"><3</option><option value="4"><4</option><option value="5"><5</option><option value="6"><6</option><option value="8"><8</option><option value="10"><10</option><option value="12"><12</option></select>';
    document.getElementById("Filter_Def72").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    //Strat
    cell = row.insertCell(-1);
    cell.align = "center";
    var data = new Array();
    var data2 = new Array();
    var row2 = '';
    for (i = 2, row2; row2 = table.rows[i]; i++) {
       if(data.includes("<option>"+row2.cells[colID_Strat].firstChild.innerHTML+"</option>")){
       }else{
           data.push("<option>"+row2.cells[colID_Strat].firstChild.innerHTML+"</option>");
       }
       if(data2.includes("<option>"+row2.cells[colID_StratPlanned].firstChild.innerHTML+"</option>")){
       }else{
           data2.push("<option>"+row2.cells[colID_StratPlanned].firstChild.innerHTML+"</option>");
       }
    }
    cell.innerHTML = '<select name="Filter_Strat" id="Filter_Strat" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">All</option>'+data.join()+'</select>';
    cell.innerHTML += '<br><select name="Filter_Strat2" id="Filter_Strat2" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value=""></option>'+data.join()+'</select>';
    document.getElementById("Filter_Strat").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    document.getElementById("Filter_Strat2").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    document.getElementById("Filter_Strat2").style.display = 'none';
    //STRAT2
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_StratPlanned" id="Filter_StratPlanned" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">All</option>'+data.join()+'</select>';
    cell.innerHTML += '<br><select name="Filter_StratPlanned2" id="Filter_StratPlanned2" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value=""></option>'+data.join()+'</select>';
    document.getElementById("Filter_StratPlanned").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    document.getElementById("Filter_StratPlanned2").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    document.getElementById("Filter_StratPlanned2").style.display = 'none';
    //TECH
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_Tech" id="Filter_Tech" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="10000">>10k</option><option value="20000">>20k</option><option value="40000">>40k</option><option value="60000">>60k</option><option value="80000">>80k</option><option value="100000">>100k</option><option value="150000">>150</option><option value="200000">>200k</option><option value="250000">>250k</option><option value="300000">>300k</option><option value="400000">>400k</option><option value="500000">>500k</option><option value="600000">>600k</option><option value="700000>>700k</option><option value="800000">>800k</option><option value="900000">>900k</option><option value="1000000">>1m</option></select>';
    document.getElementById("Filter_Tech").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    //TECH
    cell = row.insertCell(-1);
    cell.align = "center";
    //Jets
    cell = row.insertCell(-1);
    cell.align = "center";
    cell.innerHTML = '<select name="Filter_JetsOperator" id="Filter_JetsOperator" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option value="<"><</option><option selected value=">">></option></select>';
    cell.innerHTML += '<select name="Filter_Jets" id="Filter_Jets" style="color: white; font-family: Verdana, Helvetica, Arial; font-size: 8 pt; background-color: #191919; border: 1px #444444 solid"><option selected value="">Any</option><option value="50000">50k</option><option value="100000">100k</option><option value="200000">200k</option><option value="300000">300k</option><option value="400000">400k</option><option value="500000">500k</option><option value="750000">750k</option><option value="1000000">1m</option><option value="2000000">2m</option><option value="3000000">3m</option><option value="4000000">4m</option><option value="5000000">5m</option><option value="6000000">6m</option><option value="7000000">7m</option><option value="8000000">8m</option><option value="9000000">9m</option><option value="10000000">10m</option></select>';
    document.getElementById("Filter_JetsOperator").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
    document.getElementById("Filter_Jets").addEventListener("change", function(){targetInfo_FullFilter(this);}, false);
}

// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
function userManager(){
    var Names = new Array();
    var allTR = document.getElementsByTagName('tr');			// get all TD elements
    var table = document.forms[0].parentNode;
    allTR = table.getElementsByTagName('tr');			// get all TD elements
    var CountryID = false;
    var LastLoginID = false;
    var DisplayNameID = false;
    var day = (1000*60*60*24);
    var hour = (1000*60*60);
    var min = (1000*60);
    var nUser = 0;
    var runNumber = 0;
    var PermList = new Array();
    var totalUsers = 0;
    var stopProcess = 'false';
    var Clan_Clan = getClan();
    var bgcolor = '#454545';
    var bgcolor1 = '#454545';
    var bgcolor2 = '#333333';
    var Perms = new Array();
    var PermNames = new Array();
    var Data = new Array();
    var totalCols = 0;
    for(var i=0; i<allTR[1].cells.length; ++i){
        if(allTR[1].cells[i].innerHTML.indexOf("Country")!=-1){
            CountryID = i;
        } else if(allTR[1].cells[i].innerHTML.indexOf("Login")!=-1){
            LastLoginID = i;
        } else if(allTR[1].cells[i].innerHTML.indexOf("Display")!=-1){
            DisplayNameID = i;
        }
    }
    for(i=1; i<allTR.length; ++i){
        if(allTR[i].firstChild.colSpan >= 2){
            continue;
        }
        var cell = allTR[i].insertCell(-1);
        cell.bgColor = allTR[i].bgColor;
        cell.noWrap = true;
        if(i == 1){
            allTR[i].cells[LastLoginID+1].innerHTML = '<font color="Orange">How Long Ago</font><input name="Delete" type="hidden" value"Delete Selected">';
            allTR[i].cells[LastLoginID+1].align = 'center';
            continue;
        }
        if(LastLoginID != false){
            var LastLogin = allTR[i].cells[LastLoginID].innerHTML;
            allTR[i].cells[LastLoginID].noWrap = true;
            if(LastLogin == ''){
                allTR[i].cells[LastLoginID+1].bgColor = 'DarkRed';
                continue;
            }
            LastLogin = Date.parse(LastLogin);
            var dif = curTime - LastLogin;
            if(dif >= day){
                var d = Math.floor(dif/day);
                t = dif - d * day;
                var h = Math.floor(t/hour);
                var timestring = d+" Day(s) "+h+" Hours Ago";
                if(d >= 30){
                    allTR[i].cells[LastLoginID+1].bgColor = 'DarkRed';
                }else if(d >= 7){
                    allTR[i].cells[LastLoginID+1].bgColor = '#0080C0';
                }
            }else if(dif >= hour){
                var h = Math.floor(dif/hour);
                t = dif - h * hour;
                var m = Math.floor(t/min);
                var timestring = h+" Hours "+m+" Mins Ago";
            }else{
                var m = Math.floor(dif/min);
                var timestring = m+" Mins Ago";

            }
            allTR[i].cells[LastLoginID+1].innerHTML = timestring;
        }
        if(CountryID != false){
            var Country = allTR[i].cells[CountryID].innerHTML;
            if(Country == ''){
                allTR[i].cells[CountryID].bgColor = 'DarkRed';
            }
        }
    }
}

// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
function editUser() {
    function CheckForNewPerms(url) {
        notify("<font color='Red' size='+2'>Checking for perm updates for the specified group.");
        var Clan_Clan = getClan();
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://'+Clan_Clan+'.ghqnet.com/Admin/EditGroup.asp?GroupID='+url,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'main': 'application/scriptVersion+xml,application/xml,text/xml',
            },
            onload: function(responseDetails) {
                var response = responseDetails.responseText;
                var div = document.createElement('div');
                div.innerHTML = response;
                var allInputs = div.getElementsByTagName('input');			// get all Input elements
                var groupPerms = getSetting('GroupPerms',false);
                if(groupPerms === false){
                    groupPerms = new Array();
                }else{
                    groupPerms = JSON.parse(groupPerms);
                }
                var groupID = url;
                groupPerms[groupID] = new Array();
                groupPerms[groupID][0] = new Array();
                var allSelects = div.getElementsByTagName('select');
                groupPerms[groupID][0][1] = allSelects[0].options[allSelects[0].selectedIndex].value;
                var num = 1;
                for (var i=0;i<allInputs.length;i++){
                    if(allInputs[i].name == "GroupName"){
                        groupPerms[groupID][0][0] = allInputs[i].value;
                        continue;
                    }
                    if(allInputs[i].name == "GroupColor"){
                        groupPerms[groupID][0][1] = allInputs[i].value;
                        continue;
                    }
                    if(allInputs[i].type == "checkbox"){
                        if(allInputs[i].checked == true){
                            groupPerms[groupID][num] = allInputs[i].value;
                            num++;
                        }
                    }
                }
                setSetting( 'GroupPerms', JSON.stringify(groupPerms) );
                editUser_ParseGroups(groupPerms);
            }
        });
    }

    function editUser_ParseGroups(groupPerms){
        var bgcolor = '#454545';
        var moves = '';
        var list = '';
        var userhave = 1;

        for (var i=0;i<permListByID.length;i++){ // FOR EACH GROUP
             Perms[permListByID[i]]['InGroup'] = 0;
             Perms[permListByID[i]]['UserCount'] = 0;
        }
        for (var i=1;i<Groups.length;i++){ // FOR EACH GROUP
            userhave = 1;
            groupID = Groups[i]['ID'];
            if(groupPerms[groupID] == undefined){
                continue;
            }
            if(groupPerms[groupID].length == 1){
                continue;
            }
            list = groupPerms[groupID];
            for (var x=1;x<list.length;x++){ // FOR EACH PERM IN THAT GROUP, SEE IF THE USER HAS ALL PERMS IN THE GROUP.
                if(Perms[list[x]] === undefined){
                    userhave = 0;
                    continue;
                }
                if(Perms[list[x]]['UserHas'] === 0){
                    userhave = 0;
                    continue;
                }
            }
            if(userhave === 1){
                for (var x=1;x<list.length;x++){ // IF USER IS IN THE GROUP THEN REPARSE PERMS AND ADD IN INDICATORS FOR IT.
                    Perms[list[x]]['InGroup'] = 1;
                    Perms[list[x]]['UserCount']++;
                }
            }
        }
        for (var i=1;i<Groups.length;i++){ // FOR EACH GROUP
            userhave = 1;
            if(bgcolor == bgcolor1){ bgcolor = bgcolor2; }else{ bgcolor = bgcolor1; }
            groupID = Groups[i]['ID'];
            groupName = Groups[i]['Name'];
            if(groupPerms[groupID] ==undefined){
                moves = moves + '<tr><td bgcolor="'+bgcolor+'"><button id="UpdateGroup_' + groupID + '" name="'+ i +'">UpdateGroup</button></td><td align="right" bgcolor="'+bgcolor+'" id="_'+ groupID +'">' + groupName + '<font color="YELLOW"> - Error: No perms Saved.</font></td><td bgcolor="'+bgcolor+'"><button id="Move_' + groupID + '" name="'+ i +'">Update</button></td><td bgcolor="'+bgcolor+'"></td></tr>';
                continue;
            }
            if(groupPerms[groupID].length == 1){
                moves = moves + '<tr><td bgcolor="'+bgcolor+'"><button id="UpdateGroup_' + groupID + '" name="'+ i +'">UpdateGroup</button></td><td align="right" bgcolor="'+bgcolor+'" id="_'+ groupID +'">' + groupName + '<font color="YELLOW"> - Error: No perms listed.</font></td><td bgcolor="'+bgcolor+'"><button id="Move_' + groupID + '" name="'+ i +'">Update</button></td><td bgcolor="'+bgcolor+'"></td></tr>';
                continue;
            }
            var showpermslisthave = '';
            var showpermslistdonthave = '';
            var PermID = '';
            
            
            
            
            
///////////////////////////////FOR SOME REASON ADMINISTRATOR (PERM 1) DOES NOT WORK.  MIGHT HAVE SOMETHING TO WITH THE 1 ALSO MEANING TRUE IS SOME CASES.
            
            
            
            
            
            
            
            
            list = groupPerms[groupID];
            for (var x=1;x<list.length;x++){ // FOR EACH PERM IN THAT GROUP, SEE IF THE USER HAS ALL PERMS IN THE GROUP.            
                PermID = list[x];
                if(Perms[PermID] === undefined){
                    continue;
                }
                if(Perms[PermID]['UserCount'] > 1){
                    var color = 'grey';
                }else{
                    var color = 'green';
                }
                if(Perms[PermID]['UserHas'] == 1){
                    showpermslisthave = showpermslisthave + '<font color="'+ color +'">' + Perms[PermID]['Name'] + '</font><BR>';
                }else{
                    showpermslistdonthave = showpermslistdonthave + '<font color="'+ color +'">' + Perms[PermID]['Name'] + '</font><BR>';
                    userhave = 0;
                }
            }
            var spanhave = '<span id="spanhave_'+ groupID +'" class="box" return false;" style="display:none">'+showpermslisthave+'</span>';
            var spandonthave = '<span id="spandonthave_'+ groupID +'" class="box" return false;" style="display:none">'+showpermslistdonthave+'</span>';
            var color = groupPerms[groupID][0][1];

            if(userhave == 1){
                moves = moves + '<tr><td bgcolor="'+bgcolor+'"><button id="UpdateGroup_' + groupID + '" name="'+ i +'">UpdateGroup</button></td><td align="right" bgcolor="'+bgcolor+'"><br>'+spandonthave+'</td><td bgcolor="'+bgcolor+'"><button style="color: #FF0000" id="Move_'+ groupID +'" name="'+ groupID +'"><strong><<<</strong></button></td><td bgcolor="'+bgcolor+'" id="_'+ groupID +'"><font color="'+ color +'">' + groupName + '</font>' + spanhave + '</td></tr>';
            }else{
                moves = moves + '<tr><td bgcolor="'+bgcolor+'"><button id="UpdateGroup_' + groupID + '" name="'+ i +'">UpdateGroup</button></td><td align="right" bgcolor="'+bgcolor+'" id="_'+ groupID +'"><font color="'+ color +'">' + groupName + '</font>' + spandonthave +'</td><td bgcolor="'+bgcolor+'"><button id="Move_' + groupID + '" name="'+ groupID +'"><strong>>>></strong></button></td><td bgcolor="'+bgcolor+'"><br>' + spanhave + '</td></tr>';
            }

        }
        var moves2 = '';
        var showpermslisthave = '';
        var showpermslistdonthave = '';
        for (var i=0;i<permListByID.length;i++){
            if(bgcolor == bgcolor1){ bgcolor = bgcolor2; }else{ bgcolor = bgcolor1; }
            var temp = permListByID[i];
            var name = Perms[temp]['Name'];
            var color = 'white';
            var cellcolor = bgcolor;
            if (Perms[temp]['InGroup'] == 0){
                cellcolor = 'darkred';
            }
            if(Perms[temp]['UserHas'] == 1){
                showpermslisthave = showpermslisthave + '<font color="'+ color +'">' + temp + '</font><BR>';
                moves2 = moves2 + '<tr><td align="right" bgcolor="'+bgcolor+'"><br></td><td bgcolor="'+bgcolor+'"><button style="color: #FF0000" id="MovePerm_' + temp + '" name="'+ i +'"><strong><<<</strong></button></td><td bgcolor="'+cellcolor+'" id="_'+ temp +'"><font color="'+color+'">' + name + '</font></td></tr>';
            }else{
                showpermslistdonthave = showpermslistdonthave + '<font color="'+ color +'">' + temp + '</font><BR>';
                moves2 = moves2 + '<tr><td align="right" bgcolor="'+bgcolor+'" id="_'+ temp +'"><font color="'+color+'">' + name +'</font></td><td bgcolor="'+bgcolor+'"><button id="MovePerm_' + temp + '" name="'+ i +'"><strong>>>></strong></button></td><td bgcolor="'+bgcolor+'"><br></td></tr>';
            }
        }
        allTD[tableIndex].innerHTML = tableHeader + moves + tableMiddle + moves2 + tableFooter;
        for (var i=0;i<permListByID.length;i++){
            var temp = permListByID[i];
            var t = $('MovePerm_'+temp);
            t.addEventListener("click", function(){editUser_setPerm(this.id);}, false);
        }
        for (var i=1;i<Groups.length;i++){ // FOR EACH GROUP
            var temp = Groups[i]['ID'];
            var t = $('Move_'+temp);
            var te = $('_'+temp);
            var ug = $('UpdateGroup_'+temp);
            te.addEventListener("click", function(){editUser_ShowText(this.id);}, false);
            ug.addEventListener("click", function(){CheckForNewPerms(Groups[this.name]['ID']);}, false);
            if(t.innerHTML == '<strong>&lt;&lt;&lt;</strong>'){
                t.addEventListener("click", function(){editUser_setPerms(this.name, "have");}, false);
            }else if(t.innerHTML == 'Update'){
                t.addEventListener("click", function(){CheckForNewPerms(Groups[this.name]['ID']);}, false);
            }else{
                t.addEventListener("click", function(){editUser_setPerms(this.name, "donthave");}, false);
            }
        }

    }
    function editUser_setPerms(DataID, current){
       for (var i=1;i<groupPerms[DataID].length;i++){ // FOR EACH PERM IN THAT GROUP, SEE IF THE USER HAS ALL PERMS IN THE GROUP.
            var temp = groupPerms[DataID][i];
            if(Perms[temp] === undefined){
            }else{
                if(current == 'donthave'){
                    Perms[temp]['UserHas'] = 1;
                    Perms[temp]['UserCount']++;
                    $("checkbox_"+temp).checked = true;
                }else{
                    if(Perms[temp]['UserCount'] <= 1){
                        Perms[temp]['UserHas'] = 0;
                        Perms[temp]['UserCount'] = 0;
                        $("checkbox_"+temp).checked = false;
                    }else{
                        Perms[temp]['UserCount']--;
                    }
                }
            }
        }
        editUser_ParseGroups(groupPerms);
    }
    function editUser_setPerm(permID){ // SETS AN INDIVIDUAL PERM ON OR OFF
        permID = permID.substr(9);
        if(Perms[permID]['UserHas'] === 1){
            Perms[permID]['UserHas'] = 0;
            Perms[permID]['UserCount'] = 0;
            $("checkbox_"+permID).checked = false;
        }else{
            Perms[permID]['UserHas'] = 1;
            Perms[permID]['UserCount']++;
            $("checkbox_"+permID).checked = true;
        }

        editUser_ParseGroups(groupPerms);
    }
    function editUser_ShowText(id) {
        var t = document.getElementById('spanhave'+id);
        var t2 = document.getElementById('spandonthave'+id);
        if(t.style.display == 'block'){
            t.style.display = 'none';
            t2.style.display = 'none';
        }else{
            t.style.display = 'block';
            t2.style.display = 'block';
        }
    }
    function editUser_checkedBox(t) {
        temp = t.id.substr(9);
        if(t.checked == true){
            Perms[temp]['UserHas'] = 1;
            Perms[temp]['UserCount']++;
        }else{
            Perms[temp]['UserHas'] = 0;
            Perms[temp]['UserCount']--;
        }
        editUser_ParseGroups(groupPerms);
    }
    var allTH;
    var allTD;												// holds collection of all TD elements
    var td_index;											// var used to index
    allTD = document.getElementsByTagName('td');			// get all TD elements
    allTH = document.getElementsByTagName('th');			// get all TH elements

    var allTextAreas = document.getElementsByTagName("textarea");
    for(var i=0; i<allTextAreas.length; ++i){
        if(allTextAreas[i].name == 'Comments'){
            allTextAreas[i].cols = 50;
            allTextAreas[i].rows = 8;
        }
    }
    var allInputs = document.getElementsByTagName("input");
    for(var i=0; i<allInputs.length; ++i){
        if(allInputs[i].name == 'Permissions'){ continue; }
        allInputs[i].id = allInputs[i].name;
    }
    var allSelects = document.getElementsByTagName("select");
    for(var i=0; i<allSelects.length; ++i){
        allSelects[i].id = allSelects[i].name;
    }
    var allTextAreas = document.getElementsByTagName("textarea");
    for(var i=0; i<allTextAreas.length; ++i){
        if(allTextAreas[i].name == 'Comments'){
            allTextAreas[i].cols = 50;
            allTextAreas[i].rows = 8;
        }
    }

    var bgcolor = '#454545';
    var bgcolor1 = '#454545';
    var bgcolor2 = '#333333';
    var style = '<style type="text/css"><!--  .box { background-color: #504D6F; border: 1px solid #FFF; width: 250; padding: 5px; } --> </style>';
    for(var i=0; i<allTD.length; ++i){
        if(allTD[i].innerHTML == '<b><font size="+1">Edit User Permissions</font></b>'){	// find td object with keyword in it
            var tableIndex = i;

            allTD[i].bgColor = 'black';
            allTD[i].parentNode.bgColor = 'black';

            var tableHeader = '<table align=center border="0" cellspacing="1" cellpadding="2"><tr><td valign="top"> <table align=center border="0" cellspacing="1" cellpadding="2"><tr><th bgcolor="'+bgcolor+'" colspan=4>Quick Groups Editing<br><font color=gray size=small>*Click a group to see associated perms.<br>*Gray Perms are duplicate perms and are being used by other groups as well.<br>*Green Perms will be transfered when the group is transfered.<br>*To edit/update the perms list for each group, go to the GHQ Group manager page.</font></th></tr><tr><th bgcolor="'+bgcolor+'"></th><th width=300px bgcolor="'+bgcolor+'">Dont Have</th> <th bgcolor="'+bgcolor+'">M</th><th width=300px bgcolor="'+bgcolor+'">Have</th></tr>';
            save = '<tr><td bgcolor="'+bgcolor+'"></td><td align="right"></td><td></td><td align=left></td></tr>';
            var tableMiddle = '</table></td><td valign="top"><table align=center border="0" cellspacing="1" cellpadding="2"><tr><th bgcolor="'+bgcolor+'" colspan=3>Quick Permission Editing<br><font color=gray size=small>*Cells in <font color=red>RED</font> are perms not associated with a Group.</font></th></tr><tr><th width=300px bgcolor="'+bgcolor+'">Dont Have</th><th bgcolor="'+bgcolor+'">M</th><th width=300px bgcolor="'+bgcolor+'">Have</th></tr>';
            save2 = '<tr><td align="right"></td><td></td><td align=left></td></tr>';
            var tableFooter = '</td></tr></table></td></tr></table></td></tr><tr bgcolor="#22222"><td colspan=3 bgcolor="#222222"><b>Edit User Permissions</b>';

            allTD[i].innerHTML = tableHeader + save + tableMiddle + save2 + tableFooter;
            break;
        }
    }
    var groupPerms = getSetting('GroupPerms',false);
    if(groupPerms !== false){
        groupPerms = JSON.parse(groupPerms);
    }

    var GroupsT= $n('Group')[0];
    var Groups = new Array();
     for (var i=1;i<GroupsT.length;i++){
         Groups[i] = new Array();
         Groups[i]['Name'] = GroupsT.options[i].text;
         Groups[i]['ID'] = GroupsT.options[i].value;
    }
    var permList = $n('Permissions');
    var permListByID = new Array();
    var Perms = new Array();

     for (var i=0;i<permList.length;i++){
         permListByID[i] = permList[i].value;
         Perms[permList[i].value] = new Array();
         Perms[permList[i].value]['Name'] = permList[i].parentNode.parentNode.childNodes[1].innerHTML;
         Perms[permList[i].value]['InGroup'] = 0;
         //permname = permname.replace('&amp;', '&');
         if (permList[i].checked === true){
             Perms[permList[i].value]['UserHas'] = 1;
         }else{
             Perms[permList[i].value]['UserHas'] = 0;
         }
         Perms[permList[i].value]['UserCount'] = 0;
         permList[i].id = 'checkbox_'+permList[i].value;
         $('checkbox_'+permList[i].value).addEventListener("click", function(){editUser_checkedBox(this);}, false);
         Perms[permList[i].value]['InUsersGroup'] = 0;
    }

    editUser_ParseGroups(groupPerms);
}


// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################

function editGroupCheck() {
    function Verify2() {
        if (document.EditGroup.GroupName.value=='') {
            alert('You must enter a Force Name.');
            return false;
        }
        if (document.EditGroup.GroupColor.value=='') {
            alert('You must enter a Force Name.');
            return false;
        }
        SavePerms();
        document.EditGroup.submit();
        return false;
    }
    function SavePerms() {
        var group = getSetting('GroupPerms',false);
        if(group === false){
            group = new Array();
        }else{
            group = JSON.parse(group);
        }
        var groupID = $n('GroupID')[0].value;
        group[groupID] = new Array();
        group[groupID][0] = new Array();
        group[groupID][0][0] = $n('GroupName')[0].value;
        group[groupID][0][1] = $n('GroupColor')[0].value; 
        group[groupID][0][2] = $n('GroupNumber')[0].options[$n('GroupNumber')[0].selectedIndex].value;
        var defaultPerms = $n('DefaultPermissions');
        var num = 1;
        for (var i=0;i<defaultPerms.length;i++){
            if(defaultPerms[i].checked == true){
                group[groupID][num] = defaultPerms[i].value;
                num++;
            }
        }
        setSetting( 'GroupPerms', JSON.stringify(group) );
    }
    SavePerms();
    $n('Submit')[0].onclick = Verify2;
}

// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################

function accessManager() {
    function CheckforAccessListVerify(t) {
        var answer = confirm("This process will add several columns to this page that will display where each perm is used. This may take awhile on slower internets as it has to load several pages in the background. Are you sure you want to continue?");
        if(answer){ GetAccessList_Menu(t); }else{ return; }
    }

     function GetAccessList_Menu() {
        notify("<font color='Red' size='+2'>Checking for Access List for Menu Items.");
        var Clan_Clan = getClan();
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://'+Clan_Clan+'.ghqnet.com/Admin/Menu/MenuManager.asp',
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'main': 'application/scriptVersion+xml,application/xml,text/xml',
            },
            onload: function(responseDetails) {
                var response = responseDetails.responseText;
                var div = document.createElement('div');
                div.innerHTML = response;
                var table = div.getElementsByTagName('table');
                for (var i=0;i<table.length;i++){
                    if(table[i].id == "main"){
                        table = table[i];
                        break;
                    }
                }
                var perms = getSetting('AccessPerms',false);
                if(perms === false){
                    return;
                }else{
                    perms = JSON.parse(perms);
                }
                for (var i=2;i<table.rows.length;i++){
                    if(table.rows[i].cells.length < 5){ continue; }
                    var title = table.rows[i].cells[2].innerText;
                    var perm = table.rows[i].cells[4].innerHTML;
                    if(perm == ""){ continue; }
                    if(perms[perm] === undefined){
                        if(perm === 'Administrator'){ continue; }
                        alert("'"+perm+"' was not found in the Access Manager. Please Verify this is set up correctly.");
                        continue;
                    }
                    perms[perm][2].push(title.trim());
                }
                setSetting( 'AccessPerms', JSON.stringify(perms) );
                delete perms;
                delete table;
                delete div;
                delete response;
                GetAccessList_Page();
            }
        });
    }

     function GetAccessList_Page() {
        notify("<font color='Red' size='+2'>Checking the Access List for WebPages.");
        var Clan_Clan = getClan();
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://'+Clan_Clan+'.ghqnet.com/Admin/PageManager.asp',
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'main': 'application/scriptVersion+xml,application/xml,text/xml',
            },
            onload: function(responseDetails) {
                var response = responseDetails.responseText;
                var div = document.createElement('div');
                div.innerHTML = response;
                var table = div.getElementsByTagName('table');
                for (var i=0;i<table.length;i++){
                    if(table[i].id == "main"){
                        table = table[i];
                        break;
                    }
                }
                var perms = getSetting('AccessPerms',false);
                if(perms === false){
                    return;
                }else{
                    perms = JSON.parse(perms);
                }
                for (var i=2;i<table.rows.length;i++){
                    if(table.rows[i].cells.length < 5){ continue; }
                    var title = table.rows[i].cells[2].innerText;
                    var viewperm = table.rows[i].cells[3].innerHTML;
                    var editperm = table.rows[i].cells[4].innerHTML;
                    if(perms[viewperm] === undefined){
                        if(viewperm !== "Administrator" && viewperm !== "<i>Public</i>"){
                            alert("'"+viewperm+"' was not found in the Access Manager. Please Verify this is set up correctly and that this perm is still used.");
                        }
                    }else{
                        perms[viewperm][3][0].push(title.trim());
                    }
                    if(perms[editperm] === undefined){
                        if(editperm !== "Administrator" && editperm !== "<i>Public</i>"){
                            alert("'"+editperm+"' was not found in the Access Manager. Please Verify this is set up correctly and that this perm is still used.");
                        }
                    }else{
                        perms[editperm][3][1].push(title.trim());
                    }
                }
                setSetting( 'AccessPerms', JSON.stringify(perms) );
                delete perms;
                delete table;
                delete div;
                delete response;
                GetAccessList_Boards();
            }
        });
    }

     function GetAccessList_Boards() {
        notify("<font color='Red' size='+2'>Checking the Access List for Baords.");
        var Clan_Clan = getClan();
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://'+Clan_Clan+'.ghqnet.com/Admin/BoardManager.asp',
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'main': 'application/scriptVersion+xml,application/xml,text/xml',
            },
            onload: function(responseDetails) {
                var response = responseDetails.responseText;
                var div = document.createElement('div');
                div.innerHTML = response;
                var table = div.getElementsByTagName('table');
                for (var i=0;i<table.length;i++){
                    if(table[i].id == "main"){
                        table = table[i];
                        break;
                    }
                }
                var perms = getSetting('AccessPerms',false);
                if(perms === false){
                    return;
                }else{
                    perms = JSON.parse(perms);
                }
                for (var i=2;i<table.rows.length;i++){
                    if(table.rows[i].cells.length < 5){ continue; }
                    var title = table.rows[i].cells[1].innerText;
                    var readperm = table.rows[i].cells[2].innerHTML;
                    var postperm = table.rows[i].cells[3].innerHTML;
                    var moderateperm = table.rows[i].cells[4].innerHTML;
                    var moveperm = table.rows[i].cells[5].innerHTML;
                    if(perms[readperm] !== undefined){
                        perms[readperm][1][0].push(title.trim());
                    }
                    if(perms[postperm] !== undefined){
                        perms[postperm][1][1].push(title.trim());
                    }
                    if(perms[moderateperm] !== undefined){
                        perms[moderateperm][1][2].push(title.trim());
                    }
                    if(perms[moveperm] !== undefined){
                        perms[moveperm][1][3].push(title.trim());
                    }
                }
                setSetting( 'AccessPerms', JSON.stringify(perms) );
                delete perms;
                delete table;
                delete div;
                delete response;
                UpdateAccessList();
            }
        });
    }
    
    function UpdateAccessList(t) {
        var perms = getSetting('AccessPerms',false);
        if(perms === false){
            return;
        }else{
            perms = JSON.parse(perms);
        }
        var table = $('main');
        var x = table.rows[1].cells[4].innerHTML = "MENU VIEW";
        var x = table.rows[1].cells[5].innerHTML = "PAGE VIEW";
        var x = table.rows[1].insertCell(-1);
        x.innerHTML = "PAGE EDIT";
        var x = table.rows[1].insertCell(-1);
        x.innerHTML = "BOARD VIEW";
        var x = table.rows[1].insertCell(-1);
        x.innerHTML = "BOARD POST";
        var x = table.rows[1].insertCell(-1);
        x.innerHTML = "BOARD EDIT";
        var x = table.rows[1].insertCell(-1);
        x.innerHTML = "BOARD MOVE";
        for (var i = 2, row; row = table.rows[i]; i++) {
            if(row.cells.length < 4){ continue; }
            var perm = row.cells[3].innerHTML;
            if(perms[perm] === undefined){ continue; }
            row.cells[4].innerHTML = perms[perm][2].toString().replace(/,/g, "<br />"); //MENU
            row.cells[5].innerHTML = perms[perm][3][0].toString().replace(/,/g, "<br />"); //PAGE VIEW
            var x = table.rows[i].insertCell(-1);
            x.innerHTML = perms[perm][3][1].toString().replace(/,/g, "<br />"); //PAGE EDIT
            var x = table.rows[i].insertCell(-1);
            x.innerHTML = perms[perm][1][0].toString().replace(/,/g, "<br />"); //BOARDS VIEW
            var x = table.rows[i].insertCell(-1);
            x.innerHTMLL = perms[perm][1][1].toString().replace(/,/g, "<br />"); //BOARDS POST
            var x = table.rows[i].insertCell(-1);
            x.innerHTMLL = perms[perm][1][2].toString().replace(/,/g, "<br />"); //BOARDS EDIT
            var x = table.rows[i].insertCell(-1);
            x.innerHTML = perms[perm][1][3].toString().replace(/,/g, "<br />"); //BOARD MOVE
        }
    }


    var allTD = document.getElementsByTagName('td');			// get all TD elements
    var perms = {};
    for(var i=0; i<allTD.length; i++){
        if(allTD[i].cellIndex == 3){
            if(allTD[i].firstChild.textContent == "Permission"){
                var table = allTD[i].parentNode.parentNode;
            }
        }
    }
    table.rows[0].cells[0].innerHTML = "<font size=+1><b>Site Permissions </B></font><span onmouseover=\"this.style.cursor='pointer';\"><font color='Orange'><b> ----- Click here to use GHQEditor to get a list of where these perms are used. (Takes a few seconds)</b></font></span>";
    table.rows[0].cells[0].addEventListener("click", function(){CheckforAccessListVerify();}, false);
    for (var i = 2, row; row = table.rows[i]; i++) {
        if(row.cells.length < 4){ continue; }
        var perm = row.cells[3].innerHTML;
        perms[perm] = new Array();
        perms[perm][1] = new Array(); //WILL BE BOARDS
        perms[perm][1][0] = new Array(); //WILL BE BOARDS
        perms[perm][1][1] = new Array(); //WILL BE BOARDS
        perms[perm][1][2] = new Array(); //WILL BE BOARDS
        perms[perm][1][3] = new Array(); //WILL BE BOARDS
        perms[perm][2] = new Array(); //MENUS
        perms[perm][3] = new Array(); //PAGES
        perms[perm][3][0] = new Array(); //PAGES
        perms[perm][3][1] = new Array(); //PAGES
    }
    setSetting( 'AccessPerms', JSON.stringify(perms) );
}

// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################
// ########################################################################################################################################################

function clocks() {

    var temp = new Date();
    temp = temp - locTimeFirst;

    ghqTime = ghqTimeFirst.getTime() + temp;

    var ghqTime = new Date(ghqTime);
    var month = ghqTime.getMonth()+1;
    var day = ghqTime.getDate();
    var year = ghqTime.getFullYear();
    var hour = ghqTime.getHours();
    var minute = ghqTime.getMinutes();
    var second = ghqTime.getSeconds();
    second = zeroPad(second);
    minute = zeroPad(minute);

    if(getSetting(HOUR24_KEY,false)){
        hour = zeroPad(hour);
        ghqTimeString = month+'/'+day+'/'+year+' '+hour+':'+minute+':'+second;
    }else{
        if (hour>=12){
            AorP="P.M.";
        }else{
            AorP="A.M.";
        }
        if (hour>=13){
            hour -=12;
        }
        if (hour==0){
            hour=12;
        }
        ghqTimeString = month+'/'+day+'/'+year+' '+hour+':'+minute+':'+second+' '+AorP;
    }
    headerLeftMenu.innerHTML = 'GHQ: '+ghqTimeString;
    if(getSetting(GAME_TIME_SHOW_KEY,true)){
        var gameTime = new Date();
        var month = gameTime.getUTCMonth()+1;
        var day = gameTime.getUTCDate();
        var year = gameTime.getUTCFullYear();
        var hour = gameTime.getUTCHours();
        var minute = gameTime.getUTCMinutes();
        var second = gameTime.getUTCSeconds();
        second = zeroPad(second);
        minute = zeroPad(minute);
        if(getSetting(HOUR24_KEY,false)){
            hour = zeroPad(hour);
            gameTime = month+'/'+day+'/'+year+' '+hour+':'+minute+':'+second;
        }else{
            if (hour>=12){
                AorP="P.M.";
            }else{
                AorP="A.M.";
            }
            if (hour>=13){
                hour -=12;
            }
            if (hour==0){
                hour=12;
            }
            gameTime = month+'/'+day+'/'+year+' '+hour+':'+minute+':'+second+' '+AorP;
        }
        headerLeftMenu.innerHTML = headerLeftMenu.innerHTML+'<br>Game: '+gameTime;
    }
    if(getSetting(LOCAL_TIME_SHOW_KEY,true)){
        var locTime = new Date();
        var month = locTime.getMonth()+1;
        var day = locTime.getDate();
        var year = locTime.getFullYear();
        var hour = locTime.getHours();
        var minute = locTime.getMinutes();
        var second = locTime.getSeconds();
        second = zeroPad(second);
        minute = zeroPad(minute);
        if(getSetting(HOUR24_KEY,false)){
            hour = zeroPad(hour);
            locTime = month+'/'+day+'/'+year+' '+hour+':'+minute+':'+second;
        }else{
            if (hour>=12){
                AorP="P.M.";
            }else{
                AorP="A.M.";
            }
            if (hour>=13){
                hour -=12;
            }
            if (hour==0){
                hour=12;
            }
            locTime = month+'/'+day+'/'+year+' '+hour+':'+minute+':'+second+' '+AorP;
        }
        var locTimeOffset = new Date().getTimezoneOffset() / 60 * -1;
        headerLeftMenu.innerHTML = headerLeftMenu.innerHTML+'<br>Local: '+locTime+' (GMT'+locTimeOffset+')';
    }
    if(getSetting(ANIMATE_SERVER_TIME_KEY,true)){
        setTimeout(clocks,1000);
    }
}

//==========================================
//MAIN LOAD
//==========================================
try{
    var Clan_Clan = getClan();
    if($('title') !== undefined){
        var Title = $('title');
        var Headline = $('headline');
        var center = Title.firstChild.firstChild.childNodes[1];
        if(center !== undefined){
            var Clan_Username = center.childNodes[2].innerHTML;
            var Clan_Username = Clan_Username.substring(0, Clan_Username.indexOf(','));
            setSetting('Clan_Username', Clan_Username);
            Title.firstChild.firstChild.childNodes[0].width = '15%';
            Title.firstChild.firstChild.childNodes[2].width = '15%';
            bgcolor = Title.firstChild.firstChild.bgColor;
            var html = '<table width="100%" cellspacing="1" cellpadding="0"><tr bgcolor="'+bgcolor+'"><td align="center">'+center.innerHTML+'</td></tr></table>';
            center.innerHTML = html; 
            if(Headline !== undefined){
                center.appendChild(Headline);
            }
            center.bgColor = 'black';
            if(!getSetting(GHQEDITOR_HEADER,false)){ //Had to change to non-booleon for chrome
                //HEADER RIGHT MENU
                headerRightMenu = Title.firstChild.firstChild.childNodes[2];
                var span = document.createElement("span");
                span.id = 'SettingsLink';
                span.innerHTML = 'GHQEditor Settings';
                span.setAttribute('align','center');
                span.setAttribute('class','right_Menu');
                var lineBreak = document.createElement('br');
                headerRightMenu.appendChild(lineBreak);
                headerRightMenu.appendChild(span);
                var span = document.createElement("span");
                span.id = 'SettingsHomepage';
                span.innerHTML = "GHQEditor Homepage";
                span.setAttribute('align','center');
                span.setAttribute('class','right_Menu');
                var lineBreak = document.createElement('br');
                headerRightMenu.appendChild(lineBreak);
                headerRightMenu.appendChild(span);
            }else{
                var newdiv = document.createElement('div');
                newdiv.innerHTML = '<center><span id="GHQSet">GHQEditor: <span id="SettingsLink">Settings</span> | <span id="SettingsHomepage">Homepage</span></span></center>';
                document.body.appendChild(newdiv);
                $('GHQSet').setAttribute('class','right_MenuHeader');
                $('SettingsLink').setAttribute('class','right_Menu');
                $('SettingsHomepage').setAttribute('class','right_Menu');
            }
            $('SettingsLink').addEventListener("click", function(){ showConfig(null); }, true);
            $('SettingsHomepage').addEventListener("click", function(){ window.open('https://greasyfork.org/en/scripts/27100-ghqeditor'); }, true);
            //HEADER LEFT MENU
            headerLeftMenu = Title.firstChild.firstChild.childNodes[0];
            headerLeftMenu.noWrap = true;
            var ghqTimeFirst = headerLeftMenu.firstChild.firstChild.innerHTML;
            curTime = headerLeftMenu.firstChild.firstChild.innerHTML;
            curTime = Date.parse(curTime);
            headerLeftMenu.setAttribute('class','left_Menu');
            ghqTimeFirst = Date.parse(ghqTimeFirst);
            ghqTimeFirst = new Date(ghqTimeFirst);
            var locTimeFirst = new Date();
            clocks();

            //CLEAN BOARD NEW POSTS
            cleanBoards();
            installCheck();
        }
    }
    switch (page){
        case "AccessManager":
                accessManager();
        case "ShowBoard":
            if(getSetting(NEW_POSTS_KEY,true)){
                newPosts();
            }
            //cleanBoard();
        case "ShowPost":
            if(getSetting(POST_AREA_KEY,true)){
                postAreaAugment();
            }
            if(getSetting(NEW_POSTS_KEY,true) && page === "ShowPost"){
                newPostMarkRead();
            }
            break;
        case "SiteManager":
            if(getSetting(SITE_MANAGER_KEY,true)){
                siteManager();
            }
            break;
        case "TargetInfo":
            if(getSetting(TARGET_SELECTOR_KEY,true)){
                targetInfo();
            }
            break;
        case "TargetSelector":
            if(getSetting(TARGET_SELECTOR_KEY,true)){
                targetSelector();
            }
            break;
        case "UserManager":
            if(getSetting(EDIT_USER_KEY,true)){
                userManager();
            }
            break;
        case "BotList":
                if(getSetting(BOT_LIST_KEY,true)){
                    botList();
                }
            break;
        case "EditUser":
                if(getSetting(EDIT_USER_KEY,true)){
                    editUser();
                }
            break;
        case "EditGroup":
                if(getSetting(EDIT_USER_KEY,true)){
                    editGroupCheck();
                }
            break;
        default:
            if(getSetting(LEFT_MENU_KEY,true)){
                var page2 = path.substring(0, path.indexOf('.ASP'));		// extract page name from URL
                page2 = page2.substring(page2.lastIndexOf('/')+1);		// extract page name from URL
                if(page2 == "LINKS"){
                    if(window.name != 'newPostsPage'){
                        links();
                    }
                }
            }
            break;
    }

} catch (e) { console.log("Main Load: "+e); return; }