// ==UserScript==
// @name         Bierdopje AddOn Plus
// @namespace    Bierdopje.eu
// @description  Restores Bierdopje functionality
// @include      http://*.bierdopje.com*
// @include      http://*.bierdopje.eu*
// @include      http://*.bierdopje.com*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @author       XppX
// @icon         http://s3.amazonaws.com/uso_ss/icon/68881/large.png
// @version      1.108
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36444/Bierdopje%20AddOn%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/36444/Bierdopje%20AddOn%20Plus.meta.js
// ==/UserScript==

/**
Changelog:
1.0:  Initial version of a distinguished Bierdopje member
1.1:  Added 720p/Xvid search functions
1.2:  Added more targeted & faster search functions
1.3:  Update for firefox 3.6
1.3.1: Cleaning of code doubled setup speed of script
1.3.2: Removed JS libraries and added check for JQuery which was giving a conflict with the one the site uses
1.3.3: Added WEB-DL & retuned the *** search string (the BINTube site has problems if you specify the size minimum)
1.4:  Replaced BinTube (became paid service) by NZBClub, with faster available releases (due to faster background searches)
1.5:  Added new NZB search engine: BINSearch
1.6:  Bierdopje pages for single episodes are now supported as well (.../shows/xxxx/episode/S01E03)
1.6.1:  Opened up the search string a bit (no '.' between show and episodenumber avoids title/no-title problem when searching)
1.7:  Page detection improved: make clear distiction between the single episode and the multiple episodes page
1.8:  Disabled *** because, after having experienced lots of problems, the site is not available anymore (16/04/10)
1.9:  Added "OR" searches for ***; *** and *** don't support OR;
1.10: Updated scene convention conversion (14/11/10)
1.11: Updated scene convention conversion (09/01/11)
1.12: Updated scene convention conversion (16/04/11) - provided by Milky_Way
1.13: Updated NZBClub call parameters - engine has now other options (01/10/11)
1.14: Changed the country code for *** as the Dutch version seems to have dissapeared
1.15: Added additional scene conversions, provided by Darkling + changed country code again for NZBIndex
1.16: Added additional scene conversions, provided by Darkling
1.17: Securized the calls to the NZB seekers, provided by Darkling
1.18: Added additional scene conversions, provided by Darkling
1.19: Added additional scene conversions, provided by Darkling
1.20: Removed xvid format in favor of mp4 (non-720p)
1.21: Adapted the search url for binsearch. '-720p' has no effect here. Feedback from Milky_Way.
1.22: Lowered the minimum size for mp4 searches. Feedback from dannygs51.
1.23-26: Added additional scene conversions, provided by Darkling
1.27: Updated search URL of NZBClub (20/08/12)
1.28-29: Added additional scene conversions, provided by Darkling
1.30: Big clean up in the scene convention conversion (30/09/12)
1.31: Updated search string of WEB-DL to include 1080p versions (05/10/12)
1.32: Search string relaxed because some search engines didn't return results anymore (06/10/12)
1.33: Added additional scene conversions, provided by Darkling
1.40: Compatibility changes needed to switch over to the standard Firefox update process (23/11/12)
1.41: Improved metatag and added internationalization to the episode regex match function (24/11/12)
1.42: Changed KATSearch options (02/11/13)
1.5:  Bierdopje changed layout (27/11/13)
1.51: Added subtitle search functionality (28/11/13)
1.52: Added additional scene conversions (18/12/13)
1.60: Added a configuration menu (19/12/13)
1.61: Made the pop-up menu's fully customisable (20/12/13)
1.62: Added an additional conversion map for Subtitles (22/12/13)
1.65: Abstracted some functions and removed 1 click in case only 1 subtitle site was chosen (28/12/13)
1.66: Beautification (04/01/14)
1.67: Updated scene convention conversion (04/01/14)
1.68: Improving recognition of episodes with years as season number (05/01/14)
1.69: Restored 720p for KAT because 0p is not accepted, so 1080p needs to be found manually (05/01/14)
1.70: Updated subtitle conversion (08/01/14)
1.71: Replaced Subtitleseeker (dodgy) by OpenSubtitles (09/01/14)
1.80: Full rewrite of the subtitle mapping to make it easier to add new conversions (10/01/14)
1.81: Added *** as *** site & updated subtitle conversion (11/01/14)
1.82: Rectified small error with specials (11/01/14)
1.85: Mass update subtitle conversion (11/01/14)
1.86: Added again Seeker on request + corrected a small error (11/01/14)
1.87: Updated subtitle conversion (12/01/14)
1.88: Updated subtitle conversion (25/01/14)
1.89: Updated subtitle conversion (19/03/14)
1.90: Updated subtitle conversion (19/04/14)
1.91: UserScripts.org is dead - changed download/upload URL (31/05/14)
1.92: Updated subtitle conversion (09/06/14)
1.93: *** replaced by *** (28/06/14)
1.94: Made compatible with GreaseMonkey 2.0 (18/07/14)
1.95: Fixed bug in Bierdopje & Updated release recognition (23/08/14)
1.96: Workaround voor bug in Bierdopje (07/09/14)
1.97: Updated subtitle conversion (11/10/14)
1.98: Updated subtitle conversion (10/01/15)
1.99: Updated subtitle conversion (03/04/15)
1.100: Updated *** (09/05/15)
1.101: Updated subtitle conversion (24/07/15)
1.102: Updated subtitle conversion (09/02/16)
1.103: Updated subtitle conversion (13/03/16)
1.104: Updated subtitle conversion (03/05/16)
1.105: *** replaced by ***(14/08/16)
1.106: Added *** on request(27/08/16)
1.107: Cleanup (28/08/16)
1.108: Updated subtitle conversion (01/05/17)
**/

//*****************************************************************************************
//*       Page selection
//*****************************************************************************************

//alert ("*** start script ***" );
var homepage = (window.location.href.charAt(window.location.href.length-1) == '/');
if (!homepage && window.location.href.indexOf("/shows") < 0) return false;
var favorites = (window.location.href.indexOf("/shows/episodes") > 0);
var singleEpisode = !homepage && !favorites;
if (singleEpisode) { // just a single episode on the page is possible, let's narrow down the options
  singleEpisode = (window.location.href.indexOf("/shows/") > 0) && (window.location.href.indexOf("/episode/") > 0);
}

//*****************************************************************************************
//*       Preferences
//*****************************************************************************************

var Check_Nederlands      = GM_getValue("Ext.BD.SubLanguage_NL", true);
var Check_English         = GM_getValue("Ext.BD.SubLanguage_US", true);
var Check_Addic7ed        = GM_getValue("Ext.BD.SubProvider_Addic7ed", true);
var Check_PodNapisi       = GM_getValue("Ext.BD.SubProvider_PodNapisi", true);
var Check_OpenSubtitles   = GM_getValue("Ext.BD.SubProvider_OpenSubTitles", false);
var Check_SubtitleSeeker  = GM_getValue("Ext.BD.SubProvider_SubtitleSeeker", false);
var Check_WEBDL           = GM_getValue("Ext.BD.MediaFormat_WEB-DL", true);
var Check_HDTV            = GM_getValue("Ext.BD.MediaFormat_HDTV", true);
var Check_HDTV_x264       = GM_getValue("Ext.BD.MediaFormat_HDTV.x264", true);
var Check_Torrent         = GM_getValue("Ext.BD.DownloadFormat_Torrent", false);
var Check_NZB             = GM_getValue("Ext.BD.DownloadFormat_NZB", true);

//*****************************************************************************************
//*      Release Map - Transformation from Bierdopje format to what download sites expect
//*****************************************************************************************
// space = "."
var releaseMapArray = {
  "112263":"11.22.63",
  "air.crash.investigation...mayday":"air.crash.investigation",
  "bbc.life":"life",
  "csi.crime.scene.investigation":"csi",
  "csi.ny":"csi.new.york",
  "dragon.riders.of.berk":"riders.of.berk",
  "emily.owens.md":"emily.owens.m.d",
  "hawaii.five.0":"hawaii.five-0",
  "infamous":"deception",
  "intelligence":"intelligence.us",
  "intruders.us":"intruders",
  "lost.angels":"mob.city",
  "marvels+aka+jessica+jones":"marvel's+jessica+jones",
  "rake":"rake.US",
  "ride.along":"the.chicago.code",
  "secrets..lies.abc":"secrets.and.lies",
  "shield":"agents+of+S.H.I.E.L.D.",
  "spartacus.blood.and.sand":"spartacus",
  "special.victims.unit":"svu",
  "the.frankenstein.code":"second.chance",
  "the.catch.1970":"the.catch.us",
  "the.jay.leno.show":"jay.leno",
  "the.new.girl":"new.girl",
  "the.newsroom.us":"the.newsroom",
  "two.broke.girls":"2.broke.girls",
  "xiii":"xiii.The.Series",
};
var releaseMap = new RegExp("^"+Object.keys(releaseMapArray).join("|^"),"i");

//*****************************************************************************************
//*      Subtitle Maps - Transformation from Bierdopje format to what subtitle sites expect
//*****************************************************************************************
// space = "+"
var addic7edMapArray = {
  "112263":"11.22.63",
  "a+young+doctors+notebook":"a+young+doctor's+notebook",
  "agatha+christies+marple":"agatha+christie's+marple",
  "agent+x+us":"agent+x",
  "atlantis":"atlantis+(2013)",
  "beauty+and+the+beast":"beauty+and+the+beast+(2012)",
  "brooklyn+nine+nine":"brooklyn+nine-nine",
  "chicago+pd":"chicago+p.d.",
  "csi+crime+scene+investigation":"csi:+crime+scene+investigation",
  "csi+cyber":"csi:+cyber",
  "dallas+2012":"dallas+(2012)",
  "da+vincis+demons":"da+vinci's+demons",
  "dcs+legends+of+tomorrow":"dc's+legends+of+tomorrow",
  "dragon+riders+of+berk":"dragons:+riders+of+berk",
  "drake+and+josh":"drake+@+josh",
  "earth+final+conflict":"earth:+final+conflict",
  "east+bound+and+down":"eastbound+and+down",
  "emily+owens+md":"emily+owens+M.D.",
  "empire+2014":"empire+(2015)",
  "franklin++bash":"franklin+&+bash",
  "from+dusk+till+dawn":"from+dusk+till+dawn:",
  "hawaii+five+0+2010":"hawaii+five-0+(2010)",
  "house+of+cards+2012":"house+of+cards+(2013)",
  "greys+anatomy":"grey's+anatomy",
  "infamous":"deception",
  "intelligence":"intelligence+us",
  "intruders+us":"intruders",
  "law++order+special+victims+unit":"law+and+order+SVU",
  "lost+angels":"mob+city",
  "marvels+aka+jessica+jones":"marvel's+jessica+jones",
  "marvels":"marvel's",
  "mike++molly":"mike+&+molly",
  "miss+fishers+murder+mysteries":"miss+fisher's+murder+mysteries",
  "mrs+browns+boys":"mrs+brown's+boys",
  "mr+robot":"mr._robot",
  "odyssey":"american+odyssey",
  "ncis+":"ncis:+",
  "rake+2013":"rake+us",
  "ride+along":"the+chicago+code",
  "rizzoli++isles":"rizzoli+&+isles",
  "satisfaction+2014":"satisfaction+us",
  "shield":"marvel's+agents+of+S.H.I.E.L.D.",
  "secrets++lies+abc":"secrets+and+lies",
  "secrets++lies":"secrets+&+lies",
  "sherlock":"Sherlock_(2010)",
  "spartacus+blood+and+sand":"spartacus:+blood+and+sand",
  "spartacus+gods+of+the+arena":"spartacus:+gods+of+the+arena",
  "sullivan+and+son":"sullivan+@+son",
  "the+catch+1970":"the+catch",
  "the+flash+2014":"the+flash+(2014)",
  "the+frankenstein+code":"second+chance",
  "the+michael+j+fox+show":"the+michael+j.+fox+show",
  "the+new+girl":"new+girl",
  "the+newsroom+us":"the+newsroom",
  "the+strain+1970":"the+strain",
  "the+x+files":"the_X-files",
  "those+who+kill+us":"those+who+kill",
  "two+broke+girls":"2+broke+girls",
  "undateable+2013":"undateable+(2014)",
  "vampire+diaries":"the+vampire+diaries",
  "xiii":"xiii:+the+Series",
  "young++hungry":"young+&+hungry",
};
var addic7edMap = new RegExp("^"+Object.keys(addic7edMapArray).join("|^").replace(/[-[\]{}()*+?.,\\$#]/g, "\\$&"),"i");

var anySubtitleMapArray = {
  "112263":"11.22.63",
  "a+young+doctors+notebook":"a+young+doctor's+notebook",
	"agatha+christies+marple":"agatha+christie's+marple",
  "dallas+2012":"dallas+(2012)",
  "dcs+legends+of+tomorrow":"legends+of+tomorrow",
  "dragon+riders+of+berk":"dragons:+riders+of+berk",
  "emily+owens+md":"emily+owens+M.D.",
  "franklin++bash":"franklin+&+bash",
  "hawaii+five+0+2010":"hawaii+five-0+(2010)",
  "infamous":"deception",
  "intelligence":"intelligence+(US)",
  "intruders+us":"intruders",
  "law++order+special+victims+unit":"law+and+order+SVU",
  "lost+angels":"mob+city",
  "marvels+aka+jessica+jones":"marvels+jessica+jones",
  "mike++molly":"mike+molly",
  "odyssey":"american+odyssey",
  "rake":"rake+(US)",
  "ride+along":"the+chicago+code",
  "rizzoli++isles":"rizzoli+&+isles",
  "shield":"agents+of+S.H.I.E.L.D.",
  "the+catch+1970":"the+catch+us",
  "the+frankenstein+code":"second+chance",
  "the+michael+j+fox+show":"the+michael+j.+fox+show",
  "the+new+girl":"new+girl",
  "the+newsroom+us":"the+newsroom",
  "the+strain+1970":"the+strain",
  "two+broke+girls":"2+broke+girls",
  "xiii":"xiii+The+Series",
};
var anySubtitleMap = new RegExp("^"+Object.keys(anySubtitleMapArray).join("|^").replace(/[-[\]{}()*+?.,\\$#]/g, "\\$&"),"i");

var subQuality ="data:image/png;base64,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%3D%3D";

//*****************************************************************************************
//*       Preferences Box
//*****************************************************************************************

function main() {

  try {
    GM_registerMenuCommand("[Bierdopje Addon] Configuratie", AddonConfig, "C");
  } catch (e) {
    console.warn("Could not register GM menu handler. This is normal if run outside of Greasemonkey.", e);
  }
  
  modifyPage();
}

function set_config(configItem, configValue)
{
  //stored in the about:config of FireFox (internal variables
  switch (configItem)
  {
  case 'Check_Nederlands':      GM_setValue("Ext.BD.SubLanguage_NL", configValue);
                                Check_Nederlands = configValue;
                                break;
  case 'Check_English':         GM_setValue("Ext.BD.SubLanguage_US", configValue);
                                Check_English = configValue;
                                break;
  case 'Check_Addic7ed':        GM_setValue("Ext.BD.SubProvider_Addic7ed", configValue);
                                Check_Addic7ed = configValue;
                                break;
  case 'Check_PodNapisi':       GM_setValue("Ext.BD.SubProvider_PodNapisi", configValue);
                                Check_PodNapisi = configValue;
                                break;
  case 'Check_OpenSubtitles':   GM_setValue("Ext.BD.SubProvider_OpenSubTitles", configValue);
                                Check_OpenSubtitles = configValue;
                                break;
  case 'Check_SubtitleSeeker':  GM_setValue("Ext.BD.SubProvider_SubtitleSeeker", configValue);
                                Check_SubtitleSeeker = configValue;
                                break;
  case 'Check_WEBDL':           GM_setValue("Ext.BD.MediaFormat_WEB-DL", configValue);
                                Check_WEBDL = configValue;
                                break;
  case 'Check_HDTV':            GM_setValue("Ext.BD.MediaFormat_HDTV", configValue);
                                Check_HDTV = configValue;
                                break;
  case 'Check_HDTV_x264':       GM_setValue("Ext.BD.MediaFormat_HDTV.x264", configValue);
                                Check_HDTV_x264 = configValue;
                                break;
  case 'Check_Torrent':         GM_setValue("Ext.BD.DownloadFormat_Torrent", configValue);
                                Check_Torrent = configValue;
                                break;
  case 'Check_NZB':             GM_setValue("Ext.BD.DownloadFormat_NZB", configValue);
                                Check_NZB = configValue;
                                break;
  default:  console.warn("Configuration Item ["+configItem+"] not recognized!");
  }
}

function closeConfigurationBox()
{
  configurationBox = document.getElementById('subframe');
  configurationBox.parentNode.removeChild(configurationBox);
  window.location.reload(false);
}

function AddonConfig()
{
  if (document.getElementById('subframe'))
  {
    closeConfigurationBox();
    return;
  }
  var configcss = '\
    #imgsubframe {\
      border: none;\
    }\
    #plusimage{\
      display:inline;\
    }\
    #subframe {\
      position: fixed;\
      width: 100%;\
      height: 100%;\
      top: 0;\
      left: 0;\
      font-size:12px;\
      z-index:211;\
      text-align:left;\
    }\
    #fade {\
      background: #000;\
      position: fixed;\
      width: 100%;\
      height: 100%;\
      opacity: .80;\
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";\
      left: 0;\
      z-index: 10;\
    }\
    .popup_block {\
      font-family:verdana;\
      color:black;\
      background: #ddd;\
      padding: 10px 20px;\
      border: 10px solid #fff;\
      float: left;\
      width: 731px;\
      position: absolute;\
      top: 2%;\
      left: 40%;\
      margin: 0 0 0 -292px;\
      -moz-border-radius: 10px;\
      border-radius: 10px;\
      z-index: 100;\
    }\
    .popup_block .popup {\
      float: left;\
      width: 100%;\
      background: #fff;\
      margin: 10px 0;\
      padding: 0px 0 0px;\
      border-left: 1px solid #bbb;\
      border-top: 1px solid #bbb;\
      border-right: 1px solid #bbb;\
    }\
    .h3subframe{\
      margin: 1px 0 0px;\
      padding: 1px 10px;\
      border-bottom: 1px solid #bbb;\
      font-size: 1.5em;\
      font-weight: normal;\
      cursor:pointer;\
      background:#DDDDDD none repeat scroll 0 0;\
    }\
    .h3subframe:hover{\
      background:#C0BEBE none repeat scroll 0 0;\
    }\
    #h3subframetitle{\
      margin: 2px 0 0px;\
      padding: 7px 10px;\
      border-bottom: 1px solid #bbb;\
      font-size: 2.0em;\
      font-weight: normal;\
    }\
    .popup a {\
      color: darkblue;\
      text-decoration: none;\
    }\
    .popup p {\
      padding: 1px 10px;\
      margin: 0px 0;\
      font-family:verdana,geneva,lucida,"lucida grande",arial,helvetica,sans-serif;\
      font-size:10pt;\
      font-size-adjust:none;\
      font-stretch:normal;\
      font-style:normal;\
      font-variant:normal;\
      font-weight:normal;\
      line-height:normal;\
    }\
    .sidebyside {\
      padding: 1px 10px;\
      margin: 0px 0;display:inline-block;width:17em;\
    }\
    .popup img.cntrl {\
      position: absolute;\
      right: -20px;\
      top: -20px;\
    }\
    .h3subframecontent {\
      max-height:294px;\
      overflow:auto;\
      display: none;\
      padding: 10px 10px;\
    }\
    #showinfo{\
      font-size:14px;\
    }\
  ';
  GM_addStyle(configcss);

  var configurationinnerHTML = '\
    <div id="fade"></div>\
    <div class="popup_block">\
      <div class="popup">\
        <a href="#" onclick="javascript:return false;"><img id="imgsubframe" title="Close" class="cntrl" src="data:image/png;base64,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%3D%3D"/></a>\
        <div id="h3subframetitle"><b>Bierdopje Addon - Preferences</b></div>\
        <div id="h3subframe1" class="h3subframe">Media</div><div class="h3subframecontent">\
          <p id="showinfo">Choose the <b>media formats</b> you need</p><br>\
          <div class="sidebyside"><span id="Check_WEBDL"></span> <font color="gray">(720p &amp; 1080p)</font></div>\
          <div class="sidebyside"><span id="Check_HDTV"></span>  <font color="gray">(720p &amp; 1080p)</font></div>\
          <div class="sidebyside"><span id="Check_HDTV_x264"></span> <font color="gray">(MP4)</font></div>\
          <br><br/><hr/>\
          <p id="showinfo">Choose the <b>type of files</b> you want to download</p><br>\
          <div class="sidebyside"><span id="Check_NZB"></span></div>\
          <div class="sidebyside"><span id="Check_Torrent"></span></div><br>\
        </div>\
        <div id="h3subframe2" class="h3subframe">Subtitles</div><div class="h3subframecontent">\
          <p id="showinfo">Choose the <b>subtitle sites</b> you want as option</p><br>\
          <table width="100%"><tr><td width="50%">\
          <p><span id="Check_Addic7ed"></span> <font color="gray">(preferred)</font></p>\
          <p><span id="Check_PodNapisi"></span> </p>\
          <p><span id="Check_OpenSubtitles"></span></p>\
          <p><span id="Check_SubtitleSeeker"></span> <font color="gray">(can be unsafe)</font></p>\
    			</td><td><img src="data:image/jpeg;base64,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"/>\
    			</td></tr></table>\
        </div>\
        <div id="h3subframe3" class="h3subframe">Languages</div><div class="h3subframecontent">\
          <p id="showinfo">Choose the <b>subtitle languages</b> you want to find</p><br>\
          <p><span id="Check_Nederlands"></span> <img src="/g/if/icons/flags/nl.gif"/></p>\
          <p><span id="Check_English"></span> <img src="/g/if/icons/flags/us.gif"/></p>\
        </div>\
        <div id="h3subframe4" class="h3subframe">About</div><div class="h3subframecontent">\
          <p><b>'+GM_info.script.name + '</b> - version: ' + GM_info.script.version+'</p>\
          <br />\
          <table width="100%"><tr><td width="50%">\
          <p>' + GM_info.script.description +'</p>\
          <br />\
          <p>Author: XppX <br/></p>\
          <br />\
          <p>License: GPL</p>\
    			</td><td><img src="http://s3.amazonaws.com/uso_ss/icon/68881/large.png"/>\
    			</td></tr></table>\
        </div>\
      </div>\
    </div>\
  ';

  var divsubframe = document.createElement("div");
  divsubframe.id = "subframe";
  divsubframe.setAttribute('style', 'visibility: visible;');
  divsubframe.innerHTML = configurationinnerHTML;
  document.body.appendChild(divsubframe);
  var imgClose=document.getElementById("imgsubframe");
  imgClose.addEventListener("click", closeConfigurationBox, false);

  function closeallothersmallconfigs(evt)
  {
    var notthisone = evt.target || evt.srcElement;
    for (var i=0;i<document.getElementsByTagName('div').length;i++)
    {
      if (document.getElementsByTagName('div')[i].className == 'h3subframe')
      {
        if (notthisone == document.getElementsByTagName('div')[i])
          ;
        else
        {
          document.getElementsByTagName('div')[i].nextSibling.style.display = "none";
          document.getElementsByTagName('div')[i].addEventListener("click", opensmallconfigs, false);
        }
      }
    }
  }
 function closesmallconfigs(e)
 {
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    target.removeEventListener("click", closesmallconfigs, false);
    target.nextSibling.style.display = "none";
    target.addEventListener("click", opensmallconfigs, false);
 }
 function opensmallconfigs(e)
 {
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    target.removeEventListener("click", opensmallconfigs, false);
    target.nextSibling.style.display = "block";
    closeallothersmallconfigs(evt);
    target.addEventListener("click", closesmallconfigs, false);
  }

  function changeConfiguration(e)
  {
    if (e.target.tagName == 'INPUT')
    {
      set_config(e.target.id, !eval(e.target.id));
    }
  }
  var existingobject = divsubframe.getElementsByTagName("span");

  var addition  = "";
  var choice;
  for (var i = existingobject.length - 1; i >= 0; i--)
  {
    choice = existingobject[i];
    if (eval(choice.id)){
      addition = "checked='checked'";
    } else {
      addition = "";
    };
    choice.innerHTML = "<input type='checkbox' class='checkboxconfig' "+addition+"' name='"+choice.id+"' id='"+choice.id+"'/>  "+choice.id.substr(6).replace(/__/g,' ');
    document.getElementById(choice.id).addEventListener("click", changeConfiguration, false);
  }

  for (var i=0;i<document.getElementsByTagName('div').length;i++)
  {
    if (document.getElementsByTagName('div')[i].className == 'h3subframe'){
      var h3subframeelement = document.getElementsByTagName('div')[i];
      h3subframeelement.addEventListener("click", opensmallconfigs, false);
    }
  }

  var open1stDiv = new Object();
  open1stDiv.target = document.getElementById('h3subframe1');
  opensmallconfigs(open1stDiv);

}

//*****************************************************************************************
//*       Helper functions
//*****************************************************************************************

// Return a string in CamelCase
function toCamelCase(str) {
    return str.replace(/(?:^|\s|\+|\.)\w/g, function(match) {
        return match.toUpperCase();
    });
}

// Correctly escape any given string
function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// Return a show title based on conventions
function toConvention(title, separator, titleMap, titleMapArray)
{
  //Unescape the title so international characters are shown instead of the %.. replacements
  var strOut = unescape(title.toLowerCase());

  strOut = strOut.replace(/[-\s]/g, separator);

  strOut = strOut.replace(titleMap, function(matched){
    return titleMapArray[matched];
  });

  //Remove all traces to CCYY from the titles as they are frequently ignored by releasers
  strOut = strOut.replace(/(\.|\+)20\d{2}/, "");
  //Replace the flawed '&' (bug BD) into 'and'
  
  var regex = new RegExp('[' + escapeRegExp(separator) + ']{2}');
  strOut = strOut.replace(regex, separator+'and'+separator);

  return toCamelCase(strOut);
}

// Replace some titles that are described differently by the release groups
function mapToReleaseConvention(title)
{
  var strOut = toConvention(title, ".", releaseMap, releaseMapArray);
  
  return escape(strOut);
}

// Replace some titles that are described differently by the subtitle sites
function mapToSubtitleConvention(title, targetSite)
{
  var strOut = "";
  switch (targetSite)
  {
    case 'Check_Addic7ed':  strOut = toConvention(title, "+", addic7edMap, addic7edMapArray);
                            strOut = strOut.replace(/[+]Us$/, '_(US)');
                            break;
    default:                strOut = toConvention(title, "+", anySubtitleMap, anySubtitleMapArray);
  }
  return escape(strOut);
}


// Store the episode reference in the given episode array
function storeEpisode(reference, episode, idx)
{
    // Look for any (American standard) word inbetween shows and episode, and % that denotes i18n
    var matchEps = reference.match(/shows\/([\w-%]*)\/episode\/([\w-]*)/);
    if (matchEps == null || matchEps.length != 3 ) return false;

    idx++;

    episode[idx] = new Array(4); // Multi-dimensional Array
    episode[idx][0] = matchEps[1]; // Original naming
    episode[idx][1] = mapToReleaseConvention(matchEps[1]); // lookup string for downloads
    var breakidx = matchEps[2].indexOf("E"); // position of E in S9999E9999
    episode[idx][2] = matchEps[2].substr(1,breakidx-1); // season S9999
    episode[idx][3] = matchEps[2].substr(breakidx+1); // episode E9999

    return true;
}

// Create a modified link for each item in the popup menu
function createHyperlink(reference, refname)
{
  return "<a href=" + reference + " target=_blank>";
  //return "<a href=\"" + reference + "\" onmouseover=\"window.status='"+refname+"'; return true;\" target=_blank>";
}

// Create a link for the popup menu
function createChoiceMenu(reference, refname)
{
  return "- " + createHyperlink(reference, refname) + refname + "</a>";
}

//*****************************************************************************************
//*       JQ Code: Client-Side Page Modification
//*****************************************************************************************

// query and modify the page

function modifyPage() {

  var episode = new Array();
  var searchTag = new Array(4);
  var count = -1;

  if (singleEpisode) { // the page only contains a single episode reference

    if (storeEpisode(window.location.href, episode, count)) { count++; }

  } else { // specific scan for homepage and favorties: show/episodes

    $('a').each (function (i) {
      if (homepage || favorites)
      {
        if (this.parentNode.parentNode.id.indexOf("episode-") != 0) return true;
      }
      if (this.href.indexOf("episode") > 0 && storeEpisode(this.href, episode, count)) { count++; }
    });
  }

  $('.wittetekst').each (function (i) {
    if (typeof(this.href) != "undefined")
    {
      if (this.href.substr(this.href.length-8) == 'settings')
      {
        $(this).after(' | <a id="AddonPreferences" class="wittetekst" href=\"#\">BD</a>');
      }
    }
  });

  $('#AddonPreferences').click(function(){ AddonConfig(); return false; });

  if (count < 0) { return true; }

  var Nbr_Formats        = Check_WEBDL+Check_HDTV+Check_HDTV_x264;
  var Nbr_DownloadTypes  = Check_Torrent+Check_NZB;
  var Nbr_Subtitlesites  = Check_Addic7ed+Check_OpenSubtitles+Check_PodNapisi+Check_SubtitleSeeker;

  if (Nbr_DownloadTypes==0 && Nbr_Subtitlesites==0) { return true; }

  // now create the icons together with the search requests and hope they stay in sync with the form page
  count = -1;

  var seasonNbr          = 0;
  var episodeNbr         = 0;

  // search url's & arguments for given sites
  
  var N01_URL     = "https://www.nzbindex.com/search/?q=";
  var N01_ARG_HD  = "&age=&max=25&sort=agedesc&minsize=600&maxsize=5120&poster=&nfo=&hidespam=1&more=0";
  var N01_ARG_MP4 = "&age=&max=25&sort=agedesc&minsize=150&maxsize=1536&poster=&nfo=&hidespam=1&more=0";

  var N02_URL     = "https://www.nzbclub.com/search.aspx?q=";
  var N02_ARG_HD  = "&szs=20&sze=24&st=1&sp=1&sn=1";
  var N02_ARG_MP4 = "&sz=16&ez=22&rpp=25&st=1&sp=1&sn=1";

  var N03_URL     = "https://binsearch.info/index.php?q=";
  var N03_ARG_HD  = "&m=&max=25&adv_g=&adv_age=999&adv_sort=date&adv_col=on&xminsize=600&xmaxsize=5120&font=small&postdate=";
  var N03_ARG_MP4 = "&m=&max=25&adv_g=&adv_age=999&adv_sort=date&adv_col=on&xminsize=150&xmaxsize=1024&font=small&postdate=";

  var T01_URL     = "http://extratorrent.cc/search/?new=1&search=";
  var T02_URL     = "https://rarbgunblock.com/torrents.php?search=";

  var ADDIC7ED_URL    = "http://www.addic7ed.com/serie/";
  var POPNAPISI_URL   = "http://www.podnapisi.net/subtitles/search/advanced?keywords=";
  var OPENSUB_URL     = "http://www.openSubtitles.org/nl/search/searchonlytvseries-on/subformat-srt/";
  var SUBTITLE_URL    = "http://www.subtitleseeker.com/search/TV_EPISODES/";

  var searchEngine    = '';
  var episodeName     = '';

  var Addic7edTitle        = "";
  var PodNapisiTitle       = "";
  var OpenSubtitlesTitle   = "";
  var SubtitleSeekerTitle  = "";

  // Create subtitle references
  function createSubtitleTag(isoCde, pageHook)
  {
    if (seasonNbr==0) {
      $(pageHook).after('&nbsp;<img src=\"/g/if/icons/flags/'+(isoCde=="NL"?"nl":"us")+'_gray.gif\"\
        class=\"specbtn\" border=\"0\" />');
    	return false;
    }

    var choiceMenu = "";
    var subtitlesource  = '';

    if (Check_Addic7ed) {
      searchTag[1] = Addic7edTitle+"/"+seasonNbr+"/"+episodeNbr+(isoCde=="NL"?"/17":"/1");
      if (Nbr_Subtitlesites==1) {
        subtitlesource = createHyperlink(ADDIC7ED_URL + searchTag[1], "Addic7eD");
      } else {
        choiceMenu = createChoiceMenu(ADDIC7ED_URL + searchTag[1], "Addic7eD");
      }
    }
    if (Check_PodNapisi) {
      if (Check_Addic7ed) {
        choiceMenu = choiceMenu.concat("<br>");
      }
      searchTag[1] = PodNapisiTitle+"&seasons="+seasonNbr+"&episodes="+episodeNbr+"&language="+(isoCde=="NL"?"nl":"en");
      if (Nbr_Subtitlesites==1) {
        subtitlesource = createHyperlink(POPNAPISI_URL + searchTag[1], "PopNapisi");
      } else {
        choiceMenu = choiceMenu.concat(createChoiceMenu(POPNAPISI_URL + searchTag[1], "PopNapisi"));
      }
    }
    if (Check_OpenSubtitles) {
      if (Check_Addic7ed || Check_PodNapisi) {
        choiceMenu = choiceMenu.concat("<br>");
      }
      searchTag[1] = "sublanguageid-"+(isoCde=="NL"?"dut":"eng")+"/season-"+seasonNbr+"/episode-"+episodeNbr+"/moviename-"+OpenSubtitlesTitle;
      if (Nbr_Subtitlesites==1) {
        subtitlesource = createHyperlink(OPENSUB_URL + searchTag[1], "OpenSubtitles");
      } else {
        choiceMenu = choiceMenu.concat(createChoiceMenu(OPENSUB_URL + searchTag[1], "OpenSubtitles"));
      }
    }
    if (Check_SubtitleSeeker) {
      if (Check_Addic7ed || Check_PodNapisi || Check_OpenSubtitles) {
        choiceMenu = choiceMenu.concat("<br>");
      }
      searchTag[1] = SubtitleSeekerTitle+"+S"+episode[count][2]+"E"+episode[count][3];
      if (Nbr_Subtitlesites==1) {
        subtitleSource  = createHyperlink(SUBTITLE_URL + searchTag[1], "SubTitleSeeker");
      } else {
        choiceMenu = choiceMenu.concat(createChoiceMenu(SUBTITLE_URL + searchTag[1], "SubTitleSeeker"));
      }
    }
    if (Nbr_Subtitlesites==1) {
      $(pageHook).after('&nbsp;'+subtitlesource+'<img src=\"/g/if/icons/flags/'+(isoCde=="NL"?"nl":"us")+'.gif\"\
        class=\"specbtn\" border=\"0\" /><a>');
    } else {
      $(pageHook).after('&nbsp;<img src=\"/g/if/icons/flags/'+(isoCde=="NL"?"nl":"us")+'.gif\" onclick=\
            "Tip(\''+choiceMenu+'\',TITLE,\'Get Subtitle '+episodeName+'\');"\
        class=\"specbtn\" border=\"0\" />');
    }
    return true;
  }


  //$('.SeenItem').each (function (i) { // this is faster but the admin of BD was not consistent in using this everywhere

  $('.content img').each (function (i) {
    if (this.id.substr(0,4) == 'seen')
    {
      count++;

      seasonNbr  = +episode[count][2];
      episodeNbr = +episode[count][3];

      if ( episodeNbr > 0)
      {

        searchTag[0] = episode[count][1]+"+S"+episode[count][2]+"E"+episode[count][3];
        searchTag[1] = episode[count][1]+"+&quot;S"+episode[count][2]+"E"+episode[count][3]+"&quot;+|+&quot;"+seasonNbr+"x"+episode[count][3]+"&quot;";
        searchTag[2] = episode[count][1]+"%2BS"+episode[count][2]+"E"+episode[count][3];
        episodeName  = episode[count][1]+" [S"+episode[count][2]+"E"+episode[count][3]+"]";

        if (Nbr_DownloadTypes>0 && Nbr_Formats>0) {
          choiceMenu = "";
          if (Check_WEBDL) {
            choiceMenu = choiceMenu.concat("WEB-DL 1080p/720p");
            if (Check_NZB) {
              choiceMenu = choiceMenu.concat("<br>- <font color=##505050><i>NZB:</i></font> ");
              searchEngine = "<a href=" + N01_URL + searchTag[1] + "+0p++WEB-DL" + N01_ARG_HD + " target=_blank>NZBindex</a>";
              choiceMenu = choiceMenu.concat(searchEngine);
              searchEngine = "<a href=" + N02_URL  + searchTag[0] + "+WEB-DL"  + N02_ARG_HD  + " target=_blank>NZBClub</a>";
              choiceMenu = choiceMenu.concat(", (", searchEngine);
              searchEngine = "<a href=" + N03_URL  + searchTag[0] + "+WEB-DL" + N03_ARG_HD + " target=_blank>BINSearch</a>";
              choiceMenu = choiceMenu.concat(", ", searchEngine, ")");
            }
            if (Check_Torrent) {
	            choiceMenu = choiceMenu.concat("<br>- <font color=##505050><i>Torrent:</i></font> ");
	            searchEngine = "<a href=" + T01_URL  + searchTag[0] + "+WEB-DL" + " target=_blank>ExtraTorrent</a>";
	            choiceMenu = choiceMenu.concat(searchEngine);
	            searchEngine = "<a href=" + T02_URL  + searchTag[0] + "+WEB-DL" + " target=_blank>RARBG</a>";
	            choiceMenu = choiceMenu.concat(", ", searchEngine);
            }
            if (Check_HDTV || Check_HDTV_x264) {
              choiceMenu = choiceMenu.concat("<br>");
            }
          }
          if (Check_HDTV) {
            choiceMenu = choiceMenu.concat("HDTV 1080p/720p");
            if (Check_NZB) {
              choiceMenu = choiceMenu.concat("<br>- <font color=##505050><i>NZB:</i></font> ");
              searchEngine = "<a href=" + N01_URL + searchTag[1] + "+0p++x264"   + N01_ARG_HD + " target=_blank>NZBindex</a>";
              choiceMenu = choiceMenu.concat(searchEngine);
              searchEngine = "<a href=" + N02_URL  + searchTag[0] + "+0p+x264"    + N02_ARG_HD  + " target=_blank>NZBClub</a>";
              choiceMenu = choiceMenu.concat(", (", searchEngine);
              searchEngine = "<a href=" + N03_URL  + searchTag[0] + "+0p+x264"   + N03_ARG_HD + " target=_blank>BINSearch</a>";
              choiceMenu = choiceMenu.concat(", ", searchEngine, ")");
            }
            if (Check_Torrent) {
	            choiceMenu = choiceMenu.concat("<br>- <font color=##505050><i>Torrent:</i></font> ");
	            searchEngine = "<a href=" + T01_URL  + searchTag[0] + "+720p+x264" + " target=_blank>ExtraTorrent</a>";
	            choiceMenu = choiceMenu.concat(searchEngine);
	            searchEngine = "<a href=" + T02_URL  + searchTag[0] + "+720p+x264" + " target=_blank>RARBG</a>";
	            choiceMenu = choiceMenu.concat(", ", searchEngine);
            }
            if (Check_HDTV_x264) {
              choiceMenu = choiceMenu.concat("<br>");
            }
          }
          if (Check_HDTV_x264) {
            choiceMenu = choiceMenu.concat("HDTV.x264 MP4");
            if (Check_NZB) {
              choiceMenu = choiceMenu.concat("<br>- <font color=##505050><i>NZB:</i></font> ");
              searchEngine = "<a href=" + N01_URL + searchTag[1] + "+HDTV.x264"   + N01_ARG_MP4 + " target=_blank>NZBindex</a>";
              choiceMenu = choiceMenu.concat(searchEngine);
              searchEngine = "<a href=" + N02_URL  + searchTag[0] + "+HDTV.x264"    + N02_ARG_MP4  + " target=_blank>NZBClub</a>";
              choiceMenu = choiceMenu.concat(", (", searchEngine);
              searchEngine = "<a href=" + N03_URL  + searchTag[0] + "+HDTV.x264"   + N03_ARG_MP4 + " target=_blank>BINSearch</a>";
              choiceMenu = choiceMenu.concat(", ", searchEngine, ")");
            }
            if (Check_Torrent) {
	            choiceMenu = choiceMenu.concat("<br>- <font color=##505050><i>Torrent:</i></font> ");
	            searchEngine = "<a href=" + T01_URL  + searchTag[0] + "+HDTV+x264" + " target=_blank>ExtraTorrent</a>";
	            choiceMenu = choiceMenu.concat(searchEngine);
	            searchEngine = "<a href=" + T02_URL  + searchTag[0] + "+HDTV+x264" + " target=_blank>RARBG</a>";
	            choiceMenu = choiceMenu.concat(", ", searchEngine);
            }
          }
          if (Check_WEBDL || Check_HDTV || Check_HDTV_x264) {
            $(this).after('&nbsp;<img src=\"/g/if/icons/drive_go.gif\" onclick=\
                  "Tip(\''+choiceMenu+'\',TITLE,\'Download '+episodeName+'\');"\
              class=\"specbtn\" border=\"0\" />');
          }
        }

        if (Nbr_Subtitlesites>0) {
          if (Check_Addic7ed) {
            Addic7edTitle = mapToSubtitleConvention(episode[count][0], "Check_Addic7ed");
          }
          if (Check_PodNapisi) {
            PodNapisiTitle = mapToSubtitleConvention(episode[count][0], "Check_PodNapisi");
          }
          if (Check_OpenSubtitles) {
            OpenSubtitlesTitle = mapToSubtitleConvention(episode[count][0], "Check_OpenSubtitles");
          }
          if (Check_SubtitleSeeker) {
            SubtitleSeekerTitle = mapToSubtitleConvention(episode[count][0], "Check_SubtitleSeeker");
          }
          if (Check_English) {
            createSubtitleTag("US", this);
          }
          if (Check_Nederlands) {
            createSubtitleTag("NL", this);
          }
        }
      }
    }
  });
}

//*****************************************************************************************
//*       Main
//*****************************************************************************************

try
{
  main(); // execute the main code block
}
catch(e)
{
  var txt="An error occurred while executing this script.\n\n";
  txt+="Issue: <<<" + e.message + ">>>\n\n";
  txt+="\nPlease report this back to the author so it can be corrected.\n\n";
  txt+="Click <OK> to continue.\n\n";
  alert(txt);
}