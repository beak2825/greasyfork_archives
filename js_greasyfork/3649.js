// ==UserScript==
// @name          YouTube Menu Adder
// @namespace     http://www.diamonddownload.weebly.com
// @version       0.7
// @description   Gives YouTube menu back
// @include       *.youtube.*
// @copyright     2014+, RGSoftware
// @run-at        document-body
// @author        R.F Geraci
// @icon64        http://i.imgur.com/aITBfKE.png
// @downloadURL https://update.greasyfork.org/scripts/3649/YouTube%20Menu%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/3649/YouTube%20Menu%20Adder.meta.js
// ==/UserScript==

var SignedIn = true;

//=========================================================================================================CUSTOM SETTINGS=========================================================================================================================

var MyChannel = "https://www.youtube.com/user/youtube";
var Videos = "https://www.youtube.com/my_videos";
var Subscriptions = "https://www.youtube.com/feed/subscriptions";
var YtSettings = "https://www.youtube.com/account";
var AllMyChannels = "https://www.youtube.com/channel_switcher";
var Page = "Put your google+ link here";
var Googlep = "Put your google+ link here/stream";
var Managers = "Put your google+ link here/pages/settings/admin";
var Settings = "Put your google+ link here/pages/settings/plus";
var SignOut = "https://www.youtube.com/logout";
var SwitchAccount = "https://accounts.google.com/AddSession";

//==================================================================================================================================================================================================================================================


var element =  document.getElementById('yt-masthead-account-picker');
if (element == undefined && element == null){
    SignedIn = false;
}


//------------------------------------------>
var mDropDownItem1_Channel = "My Channel";
var mDropDownItem2_VideoManager = "Video Manager";
var mDropDownItem3_Subscriptions = "Subscriptions";
var mDropDownItem4_YouTubeSettings = "YouTube settings";
var mDropDownItem5_AllMyChannels = "All my channels";

var gDropDownItem1_Page = "Page";
var gDropDownItem2_GoogleP = "Google+";
var gDropDownItem3_Managers = "Managers";
var gDropDownItem3_Settings = "Settings";

var xDropDownItem1_SignOut = "Sign out";
var xDropDownItem2_SwitchAccount = "Switch account";
//------------------------------------------>


var bClicked = false;
var myMenuRef = null;

var par = document.getElementById('appbar-onebar-upload-group');

function createSelectBox(){
    if (SignedIn == true){
        var menu = document.createElement('select');
        menu.setAttribute('id', 'myMenu');
        menu.setAttribute('class', 'yt-uix-button   yt-uix-sessionlink yt-uix-button-default yt-uix-button-size-default');
        menu.setAttribute('style', 'border-left: none; border-top-right-radius: 2px; border-bottom-right-radius: 2px; border-bottom-left-radius: 0px; border-top-left-radius: 0px; width: 141px; padding-left: 10px; box-shadow: 0 1px 0 rgba(0,0,0,0.05);');
        
        var ubtn = document.getElementById('upload-btn');
        ubtn.style.borderTopRightRadius = "0px";
        ubtn.style.borderBottomRightRadius = "0px";
        
        //03 July, youTube added button border radius off 2px and moved the upload button 4px more away from the right. They also made the siderbar on videos 42px higher.
        
        // float: left; height: 28px; position: relative; right:18px; border: 1px solid #c9eeff; color: white; padding: 3px; background: #1ea9ea;'
        
        par.appendChild(menu);
    }
}

createSelectBox();

myMenuRef = document.getElementById('myMenu');

function createOptionsElements(itmVar, OptInt){
    if (SignedIn == true){
        var opt = document.createElement('option');
        opt.setAttribute('value', itmVar);
        opt.innerHTML = itmVar;
        opt.setAttribute('id', OptInt);
        myMenuRef.appendChild(opt);
    }
}

function goToUrl(url){
    if (SignedIn == true){
        window.location.href = url; 
    }
}

function OptionChanged(){
    if (SignedIn == true){
        var selval = myMenuRef.options[myMenuRef.selectedIndex].value;
        
        switch(selval){
            case mDropDownItem1_Channel:
                goToUrl(MyChannel);
                break;
            case mDropDownItem2_VideoManager:
                goToUrl(Videos);
                break;
            case mDropDownItem3_Subscriptions:
                goToUrl(Subscriptions);
                break;
            case mDropDownItem4_YouTubeSettings:
                goToUrl(YtSettings);
                break;
            case mDropDownItem5_AllMyChannels:
                goToUrl(AllMyChannels);
                break;
            case gDropDownItem1_Page:
                goToUrl(Page);
                break;
            case gDropDownItem2_GoogleP:
                goToUrl(Googlep);
                break;
            case gDropDownItem3_Managers:
                goToUrl(Managers);
                break;
            case gDropDownItem3_Settings:
                goToUrl(Settings);
                break;
            case xDropDownItem1_SignOut:
                goToUrl(SignOut);
                break;
            case xDropDownItem2_SwitchAccount:
                goToUrl(SwitchAccount);
                break;
        }
    }
}

createOptionsElements("", "opt_blank0");
createOptionsElements("YouTube Options", "Option_Select");
createOptionsElements(mDropDownItem1_Channel, "Option1");
createOptionsElements(mDropDownItem2_VideoManager, "Option2");
createOptionsElements(mDropDownItem3_Subscriptions, "Option3");
createOptionsElements(mDropDownItem4_YouTubeSettings, "Option4");
createOptionsElements(mDropDownItem5_AllMyChannels, "Option5");
createOptionsElements("", "opt_blank1");
createOptionsElements(gDropDownItem1_Page, "Option6");
createOptionsElements(gDropDownItem2_GoogleP, "Option7");
createOptionsElements(gDropDownItem3_Managers, "Option8");
createOptionsElements(gDropDownItem3_Settings, "Option9");
createOptionsElements("", "opt_blank2");
createOptionsElements(xDropDownItem1_SignOut, "Option10");
createOptionsElements(xDropDownItem2_SwitchAccount, "Option11");
createOptionsElements("", "opt_blank3");

document.getElementById("opt_blank3").disabled=true;
document.getElementById("opt_blank2").disabled=true;
document.getElementById("opt_blank1").disabled=true;
document.getElementById("opt_blank0").disabled=true;
var opt = document.getElementById("Option_Select");
opt.style.display='none';
opt.selected=true;

myMenuRef.onchange = function(){OptionChanged();};


//===========================DEV===================================

//background: -moz-linear-gradient(top,  #1ea9ea 0%, #4096ee 100%); \
//background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1ea9ea), color-stop(100%,#4096ee)); \
//background: -webkit-linear-gradient(top,  #1ea9ea 0%,#4096ee 100%); \
//background: -o-linear-gradient(top,  #1ea9ea 0%,#4096ee 100%); \
//background: -ms-linear-gradient(top,  #1ea9ea 0%,#4096ee 100%); \
//background: linear-gradient(to bottom, #1ea9ea 0%,#4096ee 100%);

//=================================================================