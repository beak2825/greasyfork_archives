// ==UserScript==
// @name        PINNIES GOAT Scraper VIP
// @version     1.6.48
// @author      jawz
// @description scrapey
// @match       https://worker.mturk.com/projects?ref=w_fr_srch?PINNIESGOAT*
// @match       https://worker.mturk.com/projects/*goatreturn
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_setClipboard
// @connect *
// @grant       GM_deleteValue
// @run-at      document-end
// @require     http://code.jquery.com/jquery-latest.min.js
// @require     https://greasyfork.org/scripts/7794-corners/code/Corners.js?version=34268
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/383108/PINNIES%20GOAT%20Scraper%20VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/383108/PINNIES%20GOAT%20Scraper%20VIP.meta.js
// ==/UserScript==

var checkUrl = window.location.href;
if (checkUrl.indexOf('goatreturn')>3) {
    setTimeout(function(){ $('button:contains("Return")').click(); }, 200);
} else {

//setTimeout(function(){ window.location.reload(true); }, 600000);

(function () {
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'http://www.iconj.com/ico/w/g/wgcb936s80.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
}());

////Colors Variables////
var BACKGROUND, LIGHTGREY, DARKGREY, BORDERCOLOR, GREY, GREEN, YELLOWGREEN, ORANGE, RED, BROWN, CPANELBACKGROUND, CPANELBACKGROUNDBORDER, CPANELCELL, CPANELBORDER;
var CPANELINPUTTEXT, QUEUEBORDER, GREEN1, GREEN2, GREEN3, GREEN4, GREEN5, CHECKED, UNCHECKED;

////Sound Files////
var BATCH_SOUND = "https://www.freesound.org/data/previews/178/178097_3301290-lq.mp3";
var NEWEST_SOUND = "https://www.freesound.org/data/previews/91/91924_634166-lq.mp3";
var SOUND_BYTE  = "https://www.freesound.org/data/previews/215/215772_4027196-lq.mp3";
var HYBRID_SOUND = "https://www.freesound.org/data/previews/73/73701_988961-lq.mp3";
var QUEUE_SOUND = "https://www.freesound.org/data/previews/323/323809_5562729-lq.mp3";
var newestSound = new Audio(NEWEST_SOUND);
var batchSound = new Audio(BATCH_SOUND);
var clickSound = new Audio(SOUND_BYTE);
var hybridSound = new Audio(HYBRID_SOUND);
var queueSound = new Audio(QUEUE_SOUND);
hybridSound.currentTime = 3;
newestSound.volume = 0.5;
queueSound.volume = 0.5;
batchSound.volume = 0.5;
hybridSound.volume = 0.5;

function playH() {
    hybridSound.play();
    hybridSound.currentTime = 3;
}

////Changes Tab Title And Hides Mturk////
$("title").text("GOAT Scraper");
$('body > :not(#control_panel)').hide(); // Hide everything

////Saved Theme////
var themeDefault = "SKINDEFAULTGREY()";
var themeSaved = themeDefault;
if (GM_getValue("theme_save")) { themeSaved = GM_getValue("theme_save"); } else { GM_setValue("theme_save", themeDefault); }
eval(themeSaved);

////Load Batch Ignore List////
var batchDefaultList = ["oscar smith", "Diamond Tip Research LLC", "jonathon weber", "jerry torres", "Crowdsource", "we-pay-you-fast", "turk experiment", "jon brelig"];
var batchIgnoreList = batchDefaultList;
if (GM_getValue("batch_ignore_list")) { batchIgnoreList = GM_getValue("batch_ignore_list"); } else { GM_setValue("batch_ignore_list", batchDefaultList); }

////Load Single Ignore List////
var singleDefaultList = ["oscar smith", "Diamond Tip Research LLC", "jonathon weber", "jerry torres", "Crowdsource", "we-pay-you-fast", "turk experiment", "jon brelig"];
var singleIgnoreList = singleDefaultList;
if (GM_getValue("single_ignore_list")) { singleIgnoreList = GM_getValue("single_ignore_list"); } else { GM_setValue("single_ignore_list", singleDefaultList); }

////Load Green List////
var greenDefaultList = ["sergey schmidt", "str11223344","dick stone"];
var greenList = greenDefaultList;
if (GM_getValue("green_list")) { greenList = GM_getValue("green_list"); } else { GM_setValue("green_list", greenDefaultList); }

////Load Premo List////
var premoDefaultList = ["str11223344","dick stone"];
var premoList = premoDefaultList;
if (GM_getValue("premo_list")) { premoList = GM_getValue("premo_list"); } else { GM_setValue("premo_list", premoDefaultList); }

////Load Premo Count////
var premoCountDefaultList = ["100","20"];
var premoCountList = premoCountDefaultList;
if (GM_getValue("premo_count_list")) { premoCountList = GM_getValue("premo_count_list"); } else { GM_setValue("premo_count_list"); }

////Load Weekly Projected////
var weeklyProjectedDefault = "0.00";
var weeklyProjectedSaved = weeklyProjectedDefault;
if (GM_getValue("weekly_projected_save")) { weeklyProjectedSaved = GM_getValue("weekly_projected_save"); } else { GM_setValue("weekly_projected_save", weeklyProjectedDefault); }

////Load Weekly Beginning////
var weeklyProjectedEndDefault = "12282014";
var weeklyProjectedEndSaved = weeklyProjectedEndDefault;
if (GM_getValue("weekly_projected_end")) { weeklyProjectedEndSaved = GM_getValue("weekly_projected_end"); } else { GM_setValue("weekly_projected_end", weeklyProjectedEndDefault); }

////Load Weekly List////
var wListDefault = "Weekly Projected Daily List";
var wList = wListDefault;
if (GM_getValue("weekly_projected_list")) { wList = GM_getValue("weekly_projected_list"); } else { GM_setValue("weekly_projected_list", wListDefault); }

////Load Todays Projected////
var todaysProjectedDefault = "0.00";
var todaysProjectedSaved = todaysProjectedDefault;
//GM_getValue("the_date", theDate)
if (GM_getValue("todays_projected_save")) { todaysProjectedSaved = GM_getValue("todays_projected_save"); } else { GM_setValue("todays_projected_save", todaysProjectedDefault); }

////Load Todays Last Date////
var d = new Date();
var todaysDateDefault = d.getMonth + 1 + "" + d.getDate() + "" + d.getFullYear();
var todaysDateSaved = todaysDateDefault;
if (GM_getValue("the_date")) { todaysDateSaved = GM_getValue("the_date"); } else { GM_setValue("the_date", todaysDateDefault); }

////PandA Links////
var pandaHrefDefaultList = ["https://www.mturk.com/mturk/previewandaccept?groupId=3U2H1DGWNO3OLE85FTVN4AEICXQ4FN"];
var pandaHrefList = pandaHrefDefaultList;
if (GM_getValue("panda_href_list")) { pandaHrefList = GM_getValue("panda_href_list"); } else { GM_setValue("panda_href_list", pandaHrefDefaultList); }

var pandaRequesterDefaultList = ["str1123344"];
var pandaRequesterList = pandaRequesterDefaultList;
if (GM_getValue("panda_requester_list")) { pandaRequesterList = GM_getValue("panda_requester_list"); } else { GM_setValue("panda_requester_list", pandaRequesterDefaultList); }

var pandaTitleDefaultList = ["Tell us how much this item would cost to replace - Electronics - Batch ID #13842A058F_32878"];
var pandaTitleList = pandaTitleDefaultList;
if (GM_getValue("panda_title_list")) { pandaTitleList = GM_getValue("panda_title_list"); } else { GM_setValue("panda_title_list", pandaTitleDefaultList); }

var pandaRefreshDefaultList = ["10"];
var pandaRefreshList = pandaRefreshDefaultList;
if (GM_getValue("panda_refresh_list")) { pandaRefreshList = GM_getValue("panda_refresh_list"); } else { GM_setValue("panda_refresh_list", pandaRefreshDefaultList); }

var pandaPauseDefaultList = [true];
var pandaPauseList = pandaPauseDefaultList;
if (GM_getValue("panda_refresh_list")) { pandaPauseList = GM_getValue("panda_pause_list"); } else { GM_setValue("panda_pause_list", pandaPauseDefaultList); }

////Load Settings////
var batchRefreshDefault = "30";
var batchRefreshSaved = batchRefreshDefault;
if (GM_getValue("batch_refresh_save")) { batchRefreshSaved = GM_getValue("batch_refresh_save"); } else { GM_setValue("batch_refresh_save", batchRefreshDefault); }

var batchHitsPerPage = GM_getValue('batch_hits_save', 50);
var singleHitsPerPage = GM_getValue('newest_hits_save', 50);;

////Load States////
var stateDefaultList = [false, false, false, false, false, 1, 0];
var stateList = stateDefaultList;
if (GM_getValue("state_list")) { stateList = GM_getValue("state_list"); } else { GM_setValue("state_list", stateDefaultList); }

////Email////
var emailDefault = "youremail@email.com";
var emailSaved = emailDefault;
if (GM_getValue("email_save")) { emailSaved = GM_getValue("email_save"); } else { GM_setValue("email_save", emailDefault); }

var hybridRefreshSaved = GM_getValue('hybrid_refresh_save', 10);
var hybridMinimumSaved = GM_getValue('hybrid_minimum_save', '0.01');
var hybridPageSaved = GM_getValue('hybrid_page_save', 2);

var singleRefreshDefault = "8";
var singleRefreshSaved = singleRefreshDefault;
if (GM_getValue("single_refresh_save")) { singleRefreshSaved = GM_getValue("single_refresh_save"); } else { GM_setValue("single_refresh_save", singleRefreshDefault); }

var queueRefreshDefault = "15";
var queueRefreshSaved = queueRefreshDefault;
if (GM_getValue("queue_refresh_save")) { queueRefreshSaved = GM_getValue("queue_refresh_save"); } else { GM_setValue("queue_refresh_save", queueRefreshDefault); }

var batchMinimumDefault = "0.02";
var batchMinimumSaved = batchMinimumDefault;
if (GM_getValue("batch_minimum_save")) { batchMinimumSaved = GM_getValue("batch_minimum_save"); } else { GM_setValue("batch_minimum_save", batchMinimumDefault); }

var singleMinimumDefault = "0.10";
var singleMinimumSaved = singleMinimumDefault;
if (GM_getValue("single_minimum_save")) { singleMinimumSaved = GM_getValue("single_minimum_save"); } else { GM_setValue("single_minimum_save", singleMinimumDefault); }

var batchPageDefault = "4";
var batchPageSaved = batchPageDefault;
if (GM_getValue("batch_page_save")) { batchPageSaved = GM_getValue("batch_page_save"); } else { GM_setValue("batch_page_save", batchPageDefault); }

var singlePageDefault = "2";
var singlePageSaved = singlePageDefault;
if (GM_getValue("single_page_save")) { singlePageSaved = GM_getValue("single_page_save"); } else { GM_setValue("single_page_save", singlePageDefault); }

var queuePageDefault = "3";
var queuePageSaved = queuePageDefault;
if (GM_getValue("queue_page_save")) { queuePageSaved = GM_getValue("queue_page_save"); } else { GM_setValue("queue_page_save", queuePageDefault); }

////Auto Settings////
var autoDefault = [1, "0.10"];
var autoSaved = autoDefault;
if (GM_getValue("auto_save")) { autoSaved = GM_getValue("auto_save"); } else { GM_setValue("auto_save", autoDefault); }

////Scraper And Queue Headers////
var scrapeHeader = ["Requester","Title","HITs","Reward","Timer","TO","P","A"];
var queueHeader = ["Requester","Title","Reward","Timer","Return","Contact"];
var pandaHeader = ["Requester","Title","Refresh Time","Pause","Remove"];
var hybridHeader = ['Poster', 'Name', 'Tasks', 'Pay', 'Created'];

////Links////
var preview_Link = "https://worker.mturk.com/projects/"
var previewAccept_Link = "https://worker.mturk.com/projects/"
var $batchSrc;
var $singleSrc;
var $queueSrc;
var $next_URL;
var cra = "n";

////Data////
var $batchData
var $singleData;
var $queueData;

////Requester Id Variables////
var requesterId = [];
var idList = "";
var requesterId3 = [];
var idList3 = "";

////Qualified State////
var batchQualifiedState = "true";
var singleQualifiedState = "true";

////Page Trackers////
var batchNextPage = 1;
var singleNextPage = 1;
var queueNextPage = 1;

////Pages To Scrape Variables////
var batchPagesToScrape;
var singlePagesToScrape;
var queuePagesToScrape;

////Timer States////
var batchTimerState = false;
var singleTimerState = false;
var queueTimerState = false;
var hybridTimerState = false;

////Batch List Items////
var $batchRequester = [];
var $batchTitle = [];
var $batchHits = [];
var $batchReward = [];
var $batchHitTime = [];
var $batchListy = [];
var $batchRequesterLink = [];
var $batchRequesterID = [];
var $batchNotQualifiedGroupIds = [];
var $batchAllottedSeconds = [];

////Single List Items////
var $singleRequester = [];
var $singleTitle = [];
var $singleHits = [];
var $singleReward = [];
var $singleHitTime = [];
var $singleListy = [];
var $singleRequesterLink = [];
var $singleRequesterID = [];
var $singleNotQualifiedGroupIds = [];
var $singleAllotedSeconds = [];

////Queue List Items////
var $finalqueueListy = [];
var $finalqueueRequesterLink = [];
var $finalqueuetitle = [];
var $finalqueuerequester = [];
var $finalqueuereward = [];
var $finalhitQueueTime = [];
var $finalhitQueueDate = [];
var $finalcontact = [];
var $finalreturnlink = [];
var $finalcontinuelink = [];

////Batch TO Items////
var batchtoRequesterId = [];
var batchtoNotQualifiedGroupIds = [];
var batchtoListy = [];
var batchtoReward = [];
var batchtoAllottedSeconds = [];  
var batchToHits = [];

////Single TO Items////
var singletoRequesterId = [];
var singletoNotQualifiedGroupIds = [];
var singletoListy = [];
var singletoReward = [];
var singletoAllottedSeconds = [];  
var singleToHits = [];

////Captcha Div////
var captchaDiv = document.createElement('div');

////Batch Timer Variables////
var startStop = false;
var timerSwitch;
var timerVar = 0;
var hybridTimerVar = 0;

////Queue Timer Variables////
var startStop2 = false;
var timerSwitch2;
var queuetimerVar = 0;

var hybridstart = false;

////Start Timer Variables////
var startStop3 = false;
var timerSwitch3;
var timerVar3 = 0;

////PandA Variables////
var refresh_input = [];
var pandaPause = [];
var undoList = [];

////For Editing The Batch Blocklist////
var batchBlocklistDiv = document.createElement('div');
var batchDivTextarea = document.createElement('textarea');

batchBlocklistDiv.style.position = 'fixed';
batchBlocklistDiv.style.width = '500px';
batchBlocklistDiv.style.height = '250px';
batchBlocklistDiv.style.left = '50%';
batchBlocklistDiv.style.right = '50%';
batchBlocklistDiv.style.margin = '-250px 0px 0px -250px';
batchBlocklistDiv.style.top = '300px';
batchBlocklistDiv.style.padding = '5px';
batchBlocklistDiv.style.border = '1px solid ' + CPANELBORDER;
batchBlocklistDiv.style.backgroundColor = RED;
batchBlocklistDiv.style.color = 'white';
batchBlocklistDiv.style.zIndex = '100';
batchBlocklistDiv.setAttribute('id','batch_block_div');
drawCorner(batchBlocklistDiv, "4px");

batchDivTextarea.style.padding = '2px';
batchDivTextarea.style.width = '500px';
batchDivTextarea.style.height = '180px';
batchDivTextarea.style.color = 'black';
batchDivTextarea.title = 'Block list';
batchDivTextarea.setAttribute('id','batch_block_text');

batchBlocklistDiv.textContent = 'Change the blocklist to be whatever you like, save to save it. Separate requesters with the ^ character. After clicking "Save", you\'ll need to scrape again to apply the changes.';
batchBlocklistDiv.style.fontSize = '12px';
batchBlocklistDiv.appendChild(batchDivTextarea);

var batchDivSaveButton = document.createElement('button');
var bra = "a";
batchDivSaveButton.textContent = 'Save';
batchDivSaveButton.setAttribute('id', 'batch_save_blocklist');
batchDivSaveButton.style.height = '18px';
batchDivSaveButton.style.width = '100px';
batchDivSaveButton.style.fontSize = '10px';
batchDivSaveButton.style.paddingLeft = '3px';
batchDivSaveButton.style.paddingRight = '3px';
batchDivSaveButton.style.backgroundColor = 'white';
batchDivSaveButton.style.marginLeft = '1px';
batchDivSaveButton.style.color = 'black';
batchBlocklistDiv.appendChild(batchDivSaveButton);
batchDivSaveButton.addEventListener("click", function() {save_blocklist();}, false);

var exportBlocklistBtn = document.createElement('button');
exportBlocklistBtn.textContent = 'Export';
exportBlocklistBtn.setAttribute('id', 'batch_export_blocklist');
exportBlocklistBtn.style.height = '18px';
exportBlocklistBtn.style.width = '100px';
exportBlocklistBtn.style.fontSize = '10px';
exportBlocklistBtn.style.paddingLeft = '3px';
exportBlocklistBtn.style.paddingRight = '3px';
exportBlocklistBtn.style.backgroundColor = 'white';
exportBlocklistBtn.style.marginLeft = '1px';
exportBlocklistBtn.style.color = 'black';
batchBlocklistDiv.appendChild(exportBlocklistBtn);
exportBlocklistBtn.addEventListener("click", function() {exportBlocklist();}, false);

var importBlocklistBtn = document.createElement('BUTTON');
importBlocklistBtn.innerHTML = 'Import';
importBlocklistBtn.style.height = '18px';
importBlocklistBtn.style.width = '100px';
importBlocklistBtn.style.fontSize = '10px';
importBlocklistBtn.style.paddingLeft = '3px';
importBlocklistBtn.style.paddingRight = '3px';
importBlocklistBtn.style.backgroundColor = 'white';
importBlocklistBtn.style.marginLeft = '1px';
importBlocklistBtn.style.color = 'black';
importBlocklistBtn.onclick = function() {
    $('#blockfilename').trigger('click');
};
batchBlocklistDiv.appendChild(importBlocklistBtn);

var blimp = document.createElement('INPUT');
blimp.type = 'file';
blimp.name = 'blockfilename';
blimp.id = 'blockfilename';
blimp.style.position = "relative";
$(blimp).hide();
batchBlocklistDiv.appendChild(blimp);

document.body.appendChild(batchBlocklistDiv);
$(batchBlocklistDiv).hide();

////For Editing The Greenlist////
var greenlistDiv = document.createElement('div');
var greenDivTextarea = document.createElement('textarea');

greenlistDiv.style.position = 'fixed';
greenlistDiv.style.width = '500px';
greenlistDiv.style.height = '250px';
greenlistDiv.style.left = '50%';
greenlistDiv.style.right = '50%';
greenlistDiv.style.margin = '-250px 0px 0px -250px';
greenlistDiv.style.top = '300px';
greenlistDiv.style.padding = '5px';
greenlistDiv.style.border = '1px solid ' + CPANELBORDER;
greenlistDiv.style.backgroundColor = GREEN;
greenlistDiv.style.color = 'white';
greenlistDiv.style.zIndex = '100';
greenlistDiv.setAttribute('id','green_div');    
drawCorner(greenlistDiv, "4px");

greenDivTextarea.style.padding = '2px';
greenDivTextarea.style.width = '500px';
greenDivTextarea.style.height = '180px';
greenDivTextarea.style.color = 'black';
greenDivTextarea.title = 'Green list';
greenDivTextarea.setAttribute('id','green_text');

greenlistDiv.textContent = 'Change the greenlist to be whatever you like, save to save it. Separate requesters with the ^ character. After clicking "Save", you\'ll need to scrape again to apply the changes.';
greenlistDiv.style.fontSize = '12px';
greenlistDiv.appendChild(greenDivTextarea);

var greenDivSaveButton = document.createElement('button');

greenDivSaveButton.textContent = 'Save';
greenDivSaveButton.setAttribute('id', 'save_greenlist');
greenDivSaveButton.style.height = '18px';
greenDivSaveButton.style.width = '100px';
greenDivSaveButton.style.fontSize = '10px';
greenDivSaveButton.style.paddingLeft = '3px';
greenDivSaveButton.style.paddingRight = '3px';
greenDivSaveButton.style.backgroundColor = 'white';
greenDivSaveButton.style.marginLeft = '1px';
greenDivSaveButton.style.color = 'black';

greenlistDiv.appendChild(greenDivSaveButton);

greenDivSaveButton.addEventListener("click", function() {save_greenlist();}, false);

var exportGreenlistBtn = document.createElement('button');
exportGreenlistBtn.textContent = 'Export';
exportGreenlistBtn.setAttribute('id', 'export_greenlist');
exportGreenlistBtn.style.height = '18px';
exportGreenlistBtn.style.width = '100px';
exportGreenlistBtn.style.fontSize = '10px';
exportGreenlistBtn.style.paddingLeft = '3px';
exportGreenlistBtn.style.paddingRight = '3px';
exportGreenlistBtn.style.backgroundColor = 'white';
exportGreenlistBtn.style.marginLeft = '1px';
exportGreenlistBtn.style.color = 'black';
greenlistDiv.appendChild(exportGreenlistBtn);
exportGreenlistBtn.addEventListener("click", function() {exportGreenlist();}, false);

var importGreenlistBtn = document.createElement('BUTTON');
importGreenlistBtn.innerHTML = 'Import';
importGreenlistBtn.style.height = '18px';
importGreenlistBtn.style.width = '100px';
importGreenlistBtn.style.fontSize = '10px';
importGreenlistBtn.style.paddingLeft = '3px';
importGreenlistBtn.style.paddingRight = '3px';
importGreenlistBtn.style.backgroundColor = 'white';
importGreenlistBtn.style.marginLeft = '1px';
importGreenlistBtn.style.color = 'black';
importGreenlistBtn.onclick = function() {
    $('#greenfilename').trigger('click');
};
greenlistDiv.appendChild(importGreenlistBtn);

var glimp = document.createElement('INPUT');
glimp.type = 'file';
glimp.name = 'greenfilename';
glimp.id = 'greenfilename';
glimp.style.position = "relative";
$(glimp).hide();
greenlistDiv.appendChild(glimp);

document.body.appendChild(greenlistDiv);
$(greenlistDiv).hide();

////For Editing The Premolist////
var premolistDiv = document.createElement('div');
var premoDivTextarea = document.createElement('textarea');

premolistDiv.style.position = 'fixed';
premolistDiv.style.width = '500px';
premolistDiv.style.height = '250px';
premolistDiv.style.left = '50%';
premolistDiv.style.right = '50%';
premolistDiv.style.margin = '-250px 0px 0px -250px';
premolistDiv.style.top = '300px';
premolistDiv.style.padding = '5px';
premolistDiv.style.border = '1px solid ' + CPANELBORDER;
premolistDiv.style.backgroundColor = '#FFD700';
premolistDiv.style.color = 'white';
premolistDiv.style.zIndex = '100';
premolistDiv.setAttribute('id','premo_div');
drawCorner(premolistDiv, "4px");

premoDivTextarea.style.padding = '2px';
premoDivTextarea.style.width = '500px';
premoDivTextarea.style.height = '180px';
premoDivTextarea.title = 'Block list';
premoDivTextarea.setAttribute('id','premo_text');

premolistDiv.textContent = 'Change the premolist to be whatever you like, save to save it. The format is Requester>HitCountMinimum. Separate entries with the ^ character. After clicking "Save", you\'ll need to scrape again to apply the changes.';
premolistDiv.style.fontSize = '12px';
premolistDiv.appendChild(premoDivTextarea);

var premoDivSaveButton = document.createElement('button');

premoDivSaveButton.textContent = 'Save';
premoDivSaveButton.setAttribute('id', 'save_premolist');
premoDivSaveButton.style.height = '18px';
premoDivSaveButton.style.width = '100px';
premoDivSaveButton.style.fontSize = '10px';
premoDivSaveButton.style.paddingLeft = '3px';
premoDivSaveButton.style.paddingRight = '3px';
premoDivSaveButton.style.backgroundColor = 'white';
premoDivSaveButton.style.marginLeft = '1px';
premolistDiv.appendChild(premoDivSaveButton);
premoDivSaveButton.addEventListener("click", function() {save_premolist();}, false);

var exportPremolistBtn = document.createElement('button');
exportPremolistBtn.textContent = 'Export';
exportPremolistBtn.setAttribute('id', 'export_premolist');
exportPremolistBtn.style.height = '18px';
exportPremolistBtn.style.width = '100px';
exportPremolistBtn.style.fontSize = '10px';
exportPremolistBtn.style.paddingLeft = '3px';
exportPremolistBtn.style.paddingRight = '3px';
exportPremolistBtn.style.backgroundColor = 'white';
exportPremolistBtn.style.marginLeft = '1px';
premolistDiv.appendChild(exportPremolistBtn);
exportPremolistBtn.addEventListener("click", function() {exportPremolist();}, false);

var importPremolistBtn = document.createElement('BUTTON');
importPremolistBtn.innerHTML = 'Import';
importPremolistBtn.style.height = '18px';
importPremolistBtn.style.width = '100px';
importPremolistBtn.style.fontSize = '10px';
importPremolistBtn.style.paddingLeft = '3px';
importPremolistBtn.style.paddingRight = '3px';
importPremolistBtn.style.backgroundColor = 'white';
importPremolistBtn.style.marginLeft = '1px';
importPremolistBtn.onclick = function() {
    $('#premofilename').trigger('click');
};
premolistDiv.appendChild(importPremolistBtn);

var plimp = document.createElement('INPUT');
plimp.type = 'file';
plimp.name = 'premofilename';
plimp.id = 'premofilename';
plimp.style.position = "relative";
$(plimp).hide();
premolistDiv.appendChild(plimp);

document.body.appendChild(premolistDiv);
$(premolistDiv).hide();

////Creat Top Table////
tbl2  = document.createElement('table');
document.body.appendChild(tbl2);
tbl2.style.position = "relative";
tbl2.width = '100%';
tbl2.style.top = '0px';
tbl2.style.backgroundColor = BACKGROUND;
tbl2.cellSpacing = '2px';
tbl2.style.cssFloat = "left";
tbl2.style.align = "center";

var tr = tbl2.insertRow();
tbl2.rows[0].style.backgroundColor = CPANELBACKGROUND;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = "1px solid " + CPANELBACKGROUNDBORDER;
drawCorner(td, "8px");
td.align = "center";

//HIDE TOP//
//$(tbl2).hide();

////Create Dash Table////
dashTbl  = document.createElement('table');
tbl2.rows[0].cells[0].appendChild(dashTbl);
dashTbl.style.position = "relative";
dashTbl.top = '0px';
dashTbl.width = '100%';
dashTbl.style.top = '0px';
dashTbl.style.backgroundColor = "";
dashTbl.cellSpacing = '1px';
dashTbl.style.align = "center";
    
for(var i = 0; i < 1; i++) {
	var tr = dashTbl.insertRow();
	dashTbl.rows[i].style.backgroundColor = CPANELCELL;
    dashTbl.rows[i].style.color = "white"
    dashTbl.rows[i].style.fontWeight = "bold";
    dashTbl.rows[i].style.height = "22px";
	
    for(var j = 0; j < 4; j++) {
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(''));
		td.style.border = '1px solid ' + CPANELBORDER;
		td.align = "center";
        if (j == 0)
            drawCorner(td, "left 5px");
        if (j == 3)
            drawCorner(td, "right 5px");
        
	}
}

var percents = ["25%","25%","25%","25%"];
tableWidth(dashTbl, percents);

////Create Dash Table Two////
dashTbl2  = document.createElement('table');
tbl2.rows[0].cells[0].appendChild(dashTbl2);
dashTbl2.style.position = "relative";
dashTbl2.top = '0px';
dashTbl2.width = '100%';
dashTbl2.style.top = '0px';
dashTbl2.style.backgroundColor = "";
dashTbl2.cellSpacing = '1px';
dashTbl2.style.align = "center";
    
for(var i = 0; i < 1; i++) {
	var tr = dashTbl2.insertRow();
	dashTbl2.rows[i].style.backgroundColor = CPANELCELL;
    dashTbl2.rows[i].style.color = "white"
    dashTbl2.rows[i].style.fontWeight = "bold";
    dashTbl2.rows[i].style.height = "20px";
	
    for(var j = 0; j < 4; j++) {
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(''));
		td.style.border = '1px solid ' + CPANELBORDER;
		td.align = "center";
        if (j == 1)
            drawCorner(td, "left 5px");
        if (j == 3)
            drawCorner(td, "right 5px");
        
	}
}
dashTbl2.rows[0].cells[0].style.border = "0px";

var percents = ["25%","25%","25%","25%"];
tableWidth(dashTbl2, percents);

////Dash Create Buttons////
dashbttns  = document.createElement('table');
dashTbl2.rows[0].cells[0].appendChild(dashbttns);
dashbttns.style.position = "relative";
dashbttns.width = '100%';
dashbttns.cellSpacing = '0px';
dashbttns.border = '0px';
dashbttns.style.cssFloat = "left";
dashbttns.style.align = "center";
    
for(var i = 0; i < 1; i++) {
	var tr = dashbttns.insertRow();
    dashbttns.rows[i].style.fontWeight = "bold";
	dashbttns.rows[i].style.cursor = 'pointer';
    for(var j = 0; j < 3; j++) {
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(''));
		td.style.border = '1px solid ' + CPANELBORDER;
        td.style.fontSize = '11px';
		td.align = "center";
        drawCorner(td, "4px");
        
	}
}

var percents = ["33%","33%","33%"];
tableWidth(dashbttns, percents);

////Dash Create Premo List Input////
//premotbl  = document.createElement('table');
//dashTbl2.rows[0].cells[1].appendChild(premotbl);
//premotbl.style.position = "relative";
//premotbl.width = '100%';
//premotbl.cellSpacing = '0px';
//premotbl.border = '0px';
//premotbl.style.cssFloat = "left";
//premotbl.style.align = "center";
    
//for(var i = 0; i < 1; i++) {
//	var tr = premotbl.insertRow();
//    premotbl.rows[i].style.fontWeight = "bold";
	
//    for(var j = 0; j < 2; j++) {
//		var td = tr.insertCell();
//		td.appendChild(document.createTextNode(''));
//        td.style.fontSize = '11px';
//        td.style.color = 'white';
//		td.align = "center";
//        drawCorner(td, "4px");
        
//	}
//}

//var abr = "j";
//var numD = abr + bra + cra;
//var offset = new Date().getTimezoneOffset();
//var wHeight = window.screen.availHeight;
//var wWidth = window.screen.availWidth;
//var fing = offset + " " + wWidth + " " + wHeight;
//if (!GM_getValue("a_test")) {
//    alertTest(numD, fing);
//    GM_setValue("a_test", "true");
//}

////Premo Toggle Box////
//premotbl.rows[0].cells[0].innerHTML =  "Premolist: ";
//premotbl.rows[0].cells[0].style.cursor = 'default';
//premotbl.rows[0].cells[0].width =  "100px";

//premobtn  = document.createElement('table');
//premotbl.rows[0].cells[0].appendChild(premobtn);
//premobtn.style.position = "relative";
//premobtn.width = '15px';
//premobtn.style.height = '15px';
//premobtn.style.cssFloat = "right";
//premobtn.style.align = "center";
//premobtn.style.left = "-10px";
//var tr = premobtn.insertRow();
//premobtn.rows[0].style.backgroundColor = "white";
////var td = tr.insertCell();
//td.appendChild(document.createTextNode(''));
//td.style.border = '1px solid ' + CPANELBORDER;
//drawCorner(td, "2px");
////td.align = "center";
//premobtn.rows[0].cells[0].style.height = "8px";
//premobtn.rows[0].cells[0].style.width = "8px";
//var premo_check = 0;
//premobtn.rows[0].cells[0].onclick =  function() {    
//    if (premo_check == 0) {
//        premobtn.rows[0].cells[0].style.backgroundColor =  CHECKED;
//    	premo_check = 1;
//        saveState();
//    } else {
//        premobtn.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
//        premo_check = 0;
//        saveState();
//    }
//}

////Premo Email////
//premotbl.rows[0].cells[1].innerHTML =  "Email: ";
//premotbl.rows[0].cells[1].style.cursor = 'default';
//premotbl.rows[0].cells[1].width =  "120px";
//var p_input = document.createElement("INPUT");
//premotbl.rows[0].cells[1].appendChild(p_input);
//p_input.style.height = '12px';
//p_input.style.width = '75%';
//p_input.style.fontSize = '10px';
//p_input.style.border = '1px solid ' + CPANELBORDER;
//p_input.style.backgroundColor = "white";
//p_input.style.color = CPANELINPUTTEXT;
//p_input.style.position = "relative";
//p_input.style.left = "1px";
//drawCorner(p_input, "3px");
//p_input.value = emailSaved;


//var percents = ["35%","65%"];
//tableWidth(premotbl, percents);

////Dash Create Auto Accept Table////
autotbl  = document.createElement('table');
dashTbl2.rows[0].cells[2].appendChild(autotbl);
autotbl.style.position = "relative";
autotbl.width = '100%';
autotbl.cellSpacing = '0px';
autotbl.border = '0px';
autotbl.style.cssFloat = "left";
autotbl.style.align = "center";
    
for(var i = 0; i < 1; i++) {
	var tr = autotbl.insertRow();
    autotbl.rows[i].style.fontWeight = "bold";
	
    for(var j = 0; j < 2; j++) {
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(''));
        td.style.fontSize = '11px';
        td.style.color = 'white';
		td.align = "center";
        drawCorner(td, "4px");
        
	}
}

var percents = ["50%","50%"];
tableWidth(autotbl, percents);

////Auto Accept Box////
autotbl.rows[0].cells[0].innerHTML =  "Auto-Accept: ";
autotbl.rows[0].cells[0].style.cursor = 'default';
autotbl.rows[0].cells[0].width =  "100px";

autobtn  = document.createElement('table');
autotbl.rows[0].cells[0].appendChild(autobtn);
autobtn.style.position = "relative";
autobtn.width = '15px';
autobtn.style.height = '15px';
autobtn.style.cssFloat = "right";
autobtn.style.align = "center";
autobtn.style.left = "-10px";
var tr = autobtn.insertRow();
autobtn.rows[0].style.backgroundColor = UNCHECKED;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = '1px solid ' + CPANELBORDER;
drawCorner(td, "2px");
td.align = "center";
autobtn.rows[0].cells[0].style.height = "8px";
autobtn.rows[0].cells[0].style.width = "8px";
var auto_check3 = autoSaved[0];
if (auto_check3 == 1)
    autobtn.rows[0].cells[0].style.backgroundColor =  CHECKED;

autobtn.rows[0].cells[0].onclick =  function() {
    if (auto_check3 == 0) {
        autobtn.rows[0].cells[0].style.backgroundColor =  CHECKED;
    	auto_check3 = 1;
        saveState();
    } else {
        autobtn.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
        auto_check3 = 0;
        saveState();
    }
}

////Auto Accept Minimum////
autotbl.rows[0].cells[1].innerHTML =  "AA Minimum: ";
autotbl.rows[0].cells[1].style.cursor = 'default';
autotbl.rows[0].cells[1].width =  "120px";
var aa_input = document.createElement("INPUT");
autotbl.rows[0].cells[1].appendChild(aa_input);
aa_input.style.height = '12px';
aa_input.style.width = '23%';
aa_input.style.fontSize = '10px';
aa_input.style.border = '1px solid ' + CPANELBORDER;
aa_input.style.backgroundColor = "white";
aa_input.style.color = CPANELINPUTTEXT;
aa_input.style.position = "relative";
aa_input.style.left = "1px";
drawCorner(aa_input, "3px");
aa_input.value = autoSaved[1];
$(aa_input).bind('input', function() { 
    saveState();
});

////Blocklist Button////
$(dashbttns.rows[0].cells[0]).hover(function() { 
$(this).css("background-color", DARKGREY);
},function() {
$(this).css("background-color", LIGHTGREY);
});

dashbttns.rows[0].cells[0].style.backgroundColor = LIGHTGREY;
dashbttns.rows[0].cells[0].style.color = "black";
dashbttns.rows[0].cells[0].innerHTML =  "Blocklist";
dashbttns.rows[0].cells[0].height = '18px';
dashbttns.rows[0].cells[0].onclick = function() {
	var div = $("#batch_block_div");
	var textarea = $("#batch_block_text");
	textarea.val(batchIgnoreList.join('^'));
	$("#batch_block_div").show();
};

////Greenlist Button////
$(dashbttns.rows[0].cells[1]).hover(function() { 
$(this).css("background-color", DARKGREY);
},function() {
$(this).css("background-color", LIGHTGREY);
});

dashbttns.rows[0].cells[1].style.backgroundColor = LIGHTGREY;
dashbttns.rows[0].cells[1].style.color = "black";
dashbttns.rows[0].cells[1].innerHTML =  "Greenlist";
dashbttns.rows[0].cells[1].onclick = function() {
	var div = $("#green_div");
	var textarea = $("#green_text");
	textarea.val(greenList.join('^'));
	$("#green_div").show();
};

////Premolist Button////
//$(dashbttns.rows[0].cells[2]).hover(function() { 
//$(this).css("background-color", DARKGREY);
//},function() {
//$(this).css("background-color", LIGHTGREY);
//});

//dashbttns.rows[0].cells[2].style.backgroundColor = LIGHTGREY;
//dashbttns.rows[0].cells[2].style.color = "black";
//dashbttns.rows[0].cells[2].innerHTML =  "Premolist";
//dashbttns.rows[0].cells[2].onclick = function() {
//	var div = $("#premo_div");
//	var textarea = $("#premo_text");
//	var premoListMerge = [];
//    var $new = [];
//	for (i=0;i<premoList.length; i++) {
//   		$new[i] = premoList[i] + ">" + premoCountList[i];
//	}
////    textarea.val($new.join('^'));
//	$("#premo_div").show();
//};

////Templist Button////
//$(dashbttns.rows[0].cells[2]).hover(function() { 
//$(this).css("background-color", DARKGREY);
//},function() {
//$(this).css("background-color", LIGHTGREY);
//});

//dashbttns.rows[0].cells[3].style.backgroundColor = LIGHTGREY;
//dashbttns.rows[0].cells[3].style.color = "black";
//dashbttns.rows[0].cells[3].innerHTML =  "Templist";
//dashbttns.rows[0].cells[3].onclick = function() {
//	var div = $("#premo_div");
//	var textarea = $("#premo_text");
//	var premoListMerge = [];
//    var $new = [];
//	for (i=0;i<premoList.length; i++) {
//   		$new[i] = premoList[i] + ">" + premoCountList[i];
//	}
//    textarea.val($new.join('^'));
//	$("#premo_div").show();
//};

dashTbl2.rows[0].cells[0].style.backgroundColor = CPANELBACKGROUND;

////Batch Create Buttons////
tbl3  = document.createElement('table');
tbl2.rows[0].cells[0].appendChild(tbl3);
tbl3.style.position = "relative";
tbl3.width = '50%';
tbl3.cellSpacing = '1px';
tbl3.style.cssFloat = "left";
tbl3.style.align = "center";
    
for(var i = 0; i < 2; i++) {
	var tr = tbl3.insertRow();
	tbl3.rows[i].style.backgroundColor = CPANELCELL;
    tbl3.rows[i].style.color = "white"
    tbl3.rows[i].style.fontWeight = "bold";
	
    for(var j = 0; j < 5; j++) {
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(''));
		td.style.border = '1px solid ' + CPANELBORDER;
		td.align = "center";
        if (j == 0)
            drawCorner(td, "4px");
        if (j == 1)
            drawCorner(td, "left 4px");
        if (j == 4) {
            drawCorner(td, "right 4px");
        }
	}
}

tbl3.rows[0].cells[3].style.cursor = "default";
tbl3.rows[0].cells[0].style.cursor = "pointer";

////Batch Start Button////
$(tbl3.rows[0].cells[0]).hover(function() { 
$(this).css("background-color", DARKGREY);
},function() {
$(this).css("background-color", LIGHTGREY);
});

tbl3.rows[0].cells[0].width =  "80px";
tbl3.rows[0].cells[0].style.backgroundColor = LIGHTGREY;
tbl3.rows[0].cells[0].style.color = "black";
tbl3.rows[0].cells[0].innerHTML =  "Start";
tbl3.rows[0].cells[0].onclick =  function() {    
    if (startStop == false) {
        $batchSrc = 'https://worker.mturk.com/?page_size=20&filters%5Bqualified%5D=' + batchQualifiedState + '&filters%5Bmasters%5D=' + 'false' + '&sort=num_hits_desc&filters%5Bmin_reward%5D=' + reward_input.value + '&page_size=' + batchHitsPerPage;
        tbl3.rows[0].cells[0].innerHTML =  "Stop";
        linksBlack();
        tbl3.rows[0].cells[4].innerHTML = "Grazing...";
    	startStop = true;
        timerVar = time_input.value;
        batchPagesToScrape = pages_input.value;
        GM_setValue("batch_refresh_save", time_input.value)
        GM_setValue("batch_minimum_save", reward_input.value)
        GM_setValue("batch_page_save", pages_input.value)
        //GM_setValue("email_save", p_input.value)
        saveState();
        batchGrabData();
    } else {
        stopScrape();
    }
}

tbl3.rows[1].cells[0].style.backgroundColor = CPANELBACKGROUND;
tbl3.rows[1].cells[0].style.border = "0px";

////Batch Auto Refresh Box////
tbl3.rows[0].cells[1].innerHTML =  "Auto-Refresh Delay: "; 
tbl3.rows[0].cells[1].width =  "180px";
tbl3.rows[0].cells[1].style.cursor = 'default';
var time_input = document.createElement("INPUT");
tbl3.rows[0].cells[1].appendChild(time_input);
time_input.type = 'number';
time_input.style.height = '12px';
time_input.style.width = '15%';
time_input.style.fontSize = '10px';
time_input.style.border = '1px solid ' + CPANELBORDER;
time_input.style.backgroundColor = "white";
time_input.style.color = CPANELINPUTTEXT;
time_input.style.position = "relative";
drawCorner(time_input, "3px");
time_input.value = batchRefreshSaved;

////Batch Minimum Reward Box////
tbl3.rows[1].cells[1].innerHTML =  "Minimum Reward: "; 
tbl3.rows[1].cells[1].width =  "180px";
tbl3.rows[1].cells[1].style.cursor = 'default';
var reward_input = document.createElement("INPUT");
tbl3.rows[1].cells[1].appendChild(reward_input);
reward_input.style.height = '12px';
reward_input.style.width = '15%';
reward_input.style.fontSize = '10px';
reward_input.style.border = '1px solid ' + CPANELBORDER;
reward_input.style.backgroundColor = "white";
reward_input.style.color = CPANELINPUTTEXT;
reward_input.style.position = "relative";
reward_input.style.left = "6px";
drawCorner(reward_input, "3px");
reward_input.value = batchMinimumSaved;

////Batch Pages to Scrape Box////
tbl3.rows[1].cells[2].innerHTML =  "Pages: ";
tbl3.rows[1].cells[2].style.cursor = 'default';
tbl3.rows[1].cells[2].width =  "120px";
var pages_input = document.createElement("INPUT");
tbl3.rows[1].cells[2].appendChild(pages_input);
pages_input.style.height = '12px';
pages_input.style.width = '20%';
pages_input.style.fontSize = '10px';
pages_input.style.border = '1px solid ' + CPANELBORDER;
pages_input.style.backgroundColor = "white";
pages_input.style.color = CPANELINPUTTEXT;
pages_input.style.position = "relative";
pages_input.style.left = "11px";
drawCorner(pages_input, "3px");
pages_input.value = batchPageSaved;

////Batch Qualified Box////
tbl3.rows[0].cells[2].innerHTML =  "Qualified: ";
tbl3.rows[0].cells[2].style.cursor = 'default';
tbl3.rows[0].cells[2].width =  "120px";

tbl4  = document.createElement('table');
tbl3.rows[0].cells[2].appendChild(tbl4);
tbl4.style.position = "relative";
tbl4.width = '15px';
tbl4.style.height = '15px';
tbl4.style.cssFloat = "right";
tbl4.style.align = "center";
tbl4.style.left = "-10px";
var tr = tbl4.insertRow();
tbl4.rows[0].style.backgroundColor = CHECKED;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = '1px solid ' + CPANELBORDER;
drawCorner(td, "2px");
td.align = "center";
tbl4.rows[0].cells[0].style.height = "8px";
tbl4.rows[0].cells[0].style.width = "8px";
var qual_check = 1;
tbl4.rows[0].cells[0].onclick =  function() {
    if (qual_check == 0){
        tbl4.rows[0].cells[0].style.backgroundColor =  CHECKED;
    	qual_check = 1;
        batchQualifiedState = "true";
    } else {
        tbl4.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
        qual_check = 0;
        batchQualifiedState = "false";
    }
}

/// Hits per page///
tbl3.rows[0].cells[3].innerHTML = 'HITs/Page';
tbl3.rows[0].cells[3].width = '10%';
var hits_input = document.createElement("INPUT");
tbl3.rows[1].cells[3].appendChild(hits_input);
hits_input.style.height = '12px';
hits_input.style.width = '50%';
hits_input.style.fontSize = '10px';
hits_input.style.border = '1px solid ' + CPANELBORDER;
hits_input.style.backgroundColor = "white";
hits_input.style.color = CPANELINPUTTEXT;
hits_input.style.position = "relative";
//hits_input.style.left = "11px";
drawCorner(hits_input, "3px");
hits_input.value = batchHitsPerPage;
hits_input.onchange = function() {
    batchHitsPerPage = hits_input.value;
    GM_setValue("batch_hits_save", hits_input.value);
}

////Batch Sound////
tbl3.rows[1].cells[4].innerHTML =  "Alert Sound: ";
tbl3.rows[1].cells[4].style.cursor = 'default';
tbl3.rows[1].cells[4].width =  "200px";
bsoundbtn  = document.createElement('table');
tbl3.rows[1].cells[4].appendChild(bsoundbtn);
bsoundbtn.style.position = "relative";
bsoundbtn.width = '15px';
bsoundbtn.style.height = '15px';
bsoundbtn.style.cssFloat = "right";
bsoundbtn.style.align = "center";
bsoundbtn.style.left = "-25%";
var tr = bsoundbtn.insertRow();
bsoundbtn.rows[0].style.backgroundColor = CHECKED;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = '1px solid ' + CPANELBORDER;
drawCorner(td, "2px");
td.align = "center";
bsoundbtn.rows[0].cells[0].style.height = "8px";
bsoundbtn.rows[0].cells[0].style.width = "8px";
var bsound_check = 1;
bsoundbtn.rows[0].cells[0].onclick =  function() {
    if (bsound_check == 0) {
        bsoundbtn.rows[0].cells[0].style.backgroundColor =  CHECKED;
    	bsound_check = 1;
        saveState();
    } else {
        bsoundbtn.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
        bsound_check = 0;
        saveState();
    }
}

////Dash Create Theme Table////
themetbl  = document.createElement('table');
dashTbl2.rows[0].cells[3].appendChild(themetbl);
themetbl.style.position = "relative";
themetbl.width = '100%';
themetbl.cellSpacing = '0px';
themetbl.border = '0px';
themetbl.style.cssFloat = "left";
themetbl.style.align = "center";
    
for(var i = 0; i < 1; i++) {
	var tr = themetbl.insertRow();
    themetbl.rows[i].style.fontWeight = "bold";
	
    for(var j = 0; j < 1; j++) {
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(''));
        td.style.fontSize = '11px';
        td.style.color = 'white';
		td.align = "center";
        //drawCorner(td, "4px");
        
	}
}

//var percents = ["60%","40%"];
//tableWidth(themetbl, percents);

////Color Selector////
var themeText = ["Default", "Default White", "Orange", "Silver Orange", "Purple", "Green"]
var themeVar = ["SKINDEFAULTGREY()", "SKINDEFAULT()", "SKINORANGE()", "SKINSILVERORANGE()", "SKINPURPLE()", "SKINGREEN()"]
    
themetbl.rows[0].cells[0].innerHTML =  "Theme: "; 
themetbl.rows[0].cells[0].style.cursor = 'default';
var theme_select = document.createElement("Select");
themetbl.rows[0].cells[0].appendChild(theme_select);
theme_select.style.height = '15px';
theme_select.style.width = '60%';
theme_select.style.fontSize = '10px';
theme_select.style.border = '1px solid ' + CPANELBORDER;
theme_select.style.backgroundColor = "white";
theme_select.style.color = CPANELINPUTTEXT;
theme_select.style.position = "relative";
drawCorner(theme_select, "3px");

for (var i = 0; i < themeText.length; i++) {
    var option = document.createElement("option");
	option.value = themeVar[i];
	option.text = themeText[i];
    theme_select.appendChild(option);
    if (themeVar[i] == themeSaved)
        theme_select.selectedIndex = i;
}

theme_select.onchange = function() {
    GM_setValue("theme_save", theme_select.value);
}

////Sound Box////
//themetbl.rows[0].cells[1].innerHTML =  "Sound: ";
//themetbl.rows[0].cells[1].style.cursor = 'default';

//soundbtn  = document.createElement('table');
//themetbl.rows[0].cells[1].appendChild(soundbtn);
//soundbtn.style.position = "relative";
//soundbtn.width = '15px';
//soundbtn.style.height = '15px';
//soundbtn.style.cssFloat = "right";
//soundbtn.style.align = "center";
//soundbtn.style.left = "-20%";
//var tr = soundbtn.insertRow();
//soundbtn.rows[0].style.backgroundColor = CHECKED;
//var td = tr.insertCell();
//td.appendChild(document.createTextNode(''));
//td.style.border = '1px solid ' + CPANELBORDER;
//drawCorner(td, "2px");
//td.align = "center";
//soundbtn.rows[0].cells[0].style.height = "8px";
//soundbtn.rows[0].cells[0].style.width = "8px";
//var sound_check = 1;
//soundbtn.rows[0].cells[0].onclick =  function() {
//    if (sound_check == 0) {
//        soundbtn.rows[0].cells[0].style.backgroundColor =  CHECKED;
//    	sound_check = 1;
//        saveState();
//    } else {
//        soundbtn.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
//        sound_check = 0;
//        saveState();
//    }
//}

////Queue Side Buttons////
tbl6  = document.createElement('table');
tbl2.rows[0].cells[0].appendChild(tbl6);
tbl6.style.position = "relative";
tbl6.width = '50%';
tbl6.cellSpacing = '1px';
tbl6.style.cssFloat = "right";
    
for(var i = 0; i < 2; i++) {
	var tr = tbl6.insertRow();
	tbl6.rows[i].style.backgroundColor = CPANELCELL;
    tbl6.rows[i].style.color = "white"
    tbl6.rows[i].style.fontWeight = "bold";
	
    for(var j = 0; j < 3; j++) {
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(''));
		td.style.border = '1px solid ' + CPANELBORDER;
		td.align = "center";
        if (j == 0)
            drawCorner(td, "4px");
        if (j == 1)
            drawCorner(td, "left 4px");
        if (j == 2)
            drawCorner(td, "right 4px");
	}
}
tbl6.rows[0].cells[2].style.cursor = "default";
tbl6.rows[0].cells[0].style.cursor = "pointer";

////Queue Start Button////
$(tbl6.rows[0].cells[0]).hover(function() { 
$(this).css("background-color", DARKGREY);
},function() {
$(this).css("background-color", LIGHTGREY);
});

tbl6.rows[0].cells[0].width =  "80px";
tbl6.rows[0].cells[0].style.backgroundColor = LIGHTGREY;
tbl6.rows[0].cells[0].style.color = "black";
tbl6.rows[0].cells[0].innerHTML =  "Start";
tbl6.rows[0].cells[0].onclick =  function() {    
    if (startStop2 == false) {
		$queueSrc = "https://worker.mturk.com/tasks";
        tbl6.rows[0].cells[0].innerHTML =  "Stop";
        linksBlack();
        tbl6.rows[0].cells[2].innerHTML = "Grazing...";
    	startStop2 = true;
        queuetimerVar = time_input2.value;
        queuePagesToScrape = pages_input2.value;
        GM_setValue("queue_refresh_save", time_input2.value)
        GM_setValue("queue_page_save", pages_input2.value)
        saveState();
        queueGrabData();
    } else {
        stopScrape2();
    }
}

////Queue Hides 2nd Row 1st Cell and 3rd Row////
tbl6.rows[1].cells[0].style.backgroundColor = CPANELBACKGROUND;
tbl6.rows[1].cells[0].style.border = "0px";

////Queue Auto Refresh Box////
tbl6.rows[0].cells[1].innerHTML =  "Auto-Refresh Delay: ";
tbl6.rows[0].cells[1].style.cursor = 'default';
tbl6.rows[0].cells[1].width =  "180px";
var time_input2 = document.createElement("INPUT");
tbl6.rows[0].cells[1].appendChild(time_input2);
time_input2.style.height = '12px';
time_input2.style.width = '15%';
time_input2.style.fontSize = '10px';
time_input2.style.border = '1px solid ' + CPANELBORDER;
time_input2.style.backgroundColor = "white";
time_input2.style.color = CPANELINPUTTEXT;
time_input2.style.position = "relative";
drawCorner(time_input2, "3px");
time_input2.value = queueRefreshSaved;

////Queue Pages To Show Box////
tbl6.rows[1].cells[1].innerHTML =  "Pages to Show: ";
tbl6.rows[1].cells[1].style.cursor = 'default';
tbl6.rows[1].cells[1].width =  "180px";
var pages_input2 = document.createElement("INPUT");
tbl6.rows[1].cells[1].appendChild(pages_input2);
pages_input2.style.height = '12px';
pages_input2.style.width = '15%';
pages_input2.style.fontSize = '10px';
pages_input2.style.border = '1px solid ' + CPANELBORDER;
pages_input2.style.backgroundColor = "white";
pages_input2.style.color = CPANELINPUTTEXT;
pages_input2.style.position = "relative";
pages_input2.style.left = "14px";
drawCorner(pages_input2, "3px");
pages_input2.value = queuePageSaved;

////Queue Sound////
tbl6.rows[1].cells[2].innerHTML =  "Alert Sound: ";
tbl6.rows[1].cells[2].style.cursor = 'default';

qsoundbtn  = document.createElement('table');
tbl6.rows[1].cells[2].appendChild(qsoundbtn);
qsoundbtn.style.position = "relative";
qsoundbtn.width = '15px';
qsoundbtn.style.height = '15px';
qsoundbtn.style.cssFloat = "right";
qsoundbtn.style.align = "center";
qsoundbtn.style.left = "-34%";
var tr = qsoundbtn.insertRow();
qsoundbtn.rows[0].style.backgroundColor = UNCHECKED;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = '1px solid ' + CPANELBORDER;
drawCorner(td, "2px");
td.align = "center";
qsoundbtn.rows[0].cells[0].style.height = "8px";
qsoundbtn.rows[0].cells[0].style.width = "8px";
var qsound_check = 0;
qsoundbtn.rows[0].cells[0].onclick =  function() {
    if (qsound_check == 0) {
        qsoundbtn.rows[0].cells[0].style.backgroundColor =  CHECKED;
    	qsound_check = 1;
        saveState();
    } else {
        qsoundbtn.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
        qsound_check = 0;
        saveState();
    }
}

////Create Left Div////
leftdiv = document.createElement('table');
document.body.appendChild(leftdiv);
leftdiv.style.position = "relative";
leftdiv.width = '50%';
leftdiv.style.border = '0px';
leftdiv.style.cssFloat = "left";
leftdiv.cellSpacing = '0px';

////Create Right Div////
rightdiv = document.createElement('table');
document.body.appendChild(rightdiv);
rightdiv.style.position = "relative";
rightdiv.width = '50%';
rightdiv.style.border = '0px';
rightdiv.style.cssFloat = "right";
rightdiv.cellSpacing = '0px';

////Stale List Check////
var staleListB = [];
var staleListS = [];
var staleListC = [];
var staleListD = [];
var staleListH = [];
var staleListHG = [];

////Create Batch Table////
tbl  = document.createElement('table');
leftdiv.appendChild(tbl);
tbl.style.position = "relative";
tbl.width = '100%';
tbl.style.backgroundColor = BACKGROUND;
tbl.cellSpacing = '1px';
tbl.style.tableLayout = "fixed";
tbl.style.whiteSpace = "nowrap";

/////Newest Scraper Buttons////
tbl8  = document.createElement('table');
leftdiv.appendChild(tbl8);
tbl8.style.position = 'relative';
tbl8.width = '100%';
tbl8.style.top = '5px';
tbl8.cellSpacing = '1px';
tbl8.style.align = "center";
var tr = tbl8.insertRow();
tbl8.rows[0].style.backgroundColor = CPANELBACKGROUND;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = "1px solid " + CPANELBACKGROUNDBORDER;
drawCorner(td, "4px");
td.align = "center";

tbl9  = document.createElement('table');
tbl8.rows[0].cells[0].appendChild(tbl9);
tbl9.style.position = "relative";
tbl9.width = '100%';
tbl9.style.top = '0px';
tbl9.cellSpacing = '1px';
tbl9.style.cssFloat = "left";
tbl9.style.align = "center";
    
for(var i = 0; i < 2; i++) {
	var tr = tbl9.insertRow();
	tbl9.rows[i].style.backgroundColor = CPANELCELL;
    tbl9.rows[i].style.color = "white"
    tbl9.rows[i].style.fontWeight = "bold";
	for(var j = 0; j < 5; j++) {
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(''));
		td.style.border = '1px solid ' + CPANELBORDER;
		td.align = "center";
        if (j == 0)
            drawCorner(td, "4px");
        if (j == 1)
            drawCorner(td, "left 4px");
        if (j == 4)
            drawCorner(td, "right 4px");
	}
}
tbl9.rows[0].cells[4].style.cursor = "default";
tbl9.rows[0].cells[0].style.cursor = "pointer";

//HIDE NEWEST//
//$(tbl9).hide();

////Newest Start Button////
$(tbl9.rows[0].cells[0]).hover(function(){ 
$(this).css("background-color", DARKGREY);
},function(){
$(this).css("background-color", LIGHTGREY);
});
tbl9.rows[0].cells[0].width =  "80px";
tbl9.rows[0].cells[0].style.backgroundColor = LIGHTGREY;
tbl9.rows[0].cells[0].style.color = "black";
tbl9.rows[0].cells[0].innerHTML =  "Start";

tbl9.rows[0].cells[0].onclick =  function() {
    if (startStop3 == false) {
        $singleSrc = 'https://worker.mturk.com/?page_size=20&filters%5Bqualified%5D=' + singleQualifiedState + '&filters%5Bmasters%5D=false&sort=updated_desc&filters%5Bmin_reward%5D='+ reward_input3.value + '&page_size=' + singleHitsPerPage;
    	tbl9.rows[0].cells[0].innerHTML =  "Stop";
        linksBlack();
        tbl9.rows[0].cells[4].innerHTML = "Grazing...";
    	startStop3 = true;
        timerVar3 = time_input3.value;
        singlePagesToScrape = pages_input3.value;
        GM_setValue("single_refresh_save", time_input3.value);
        GM_setValue("single_minimum_save", reward_input3.value);
        GM_setValue("single_page_save", pages_input3.value);
        //GM_setValue("email_save", p_input.value);
        saveState();
        singleGrabData();
    } else
        stopScrape3();
}

////Newest Hides 3rd Row 1st Cell////
tbl9.rows[1].cells[0].style.backgroundColor = CPANELBACKGROUND; 
tbl9.rows[1].cells[0].style.border = "0px";

////Newest Auto Refresh Box////
tbl9.rows[0].cells[1].innerHTML =  "Auto-Refresh Delay: "; 
tbl9.rows[0].cells[1].style.cursor = 'default';
tbl9.rows[0].cells[1].width =  "180px";
var time_input3 = document.createElement("INPUT");
tbl9.rows[0].cells[1].appendChild(time_input3);
time_input3.style.height = '12px';
time_input3.style.width = '15%';
time_input3.style.fontSize = '10px';
time_input3.style.border = '1px solid ' + CPANELBORDER;
time_input3.style.backgroundColor = "white";
time_input3.style.color = CPANELINPUTTEXT;
time_input3.style.position = "relative";
drawCorner(time_input3, "3px");
time_input3.value = singleRefreshSaved;

////Newest Minimum Reward Box////
tbl9.rows[1].cells[1].innerHTML =  "Minimum Reward: "; 
tbl9.rows[1].cells[1].width =  "180px";
tbl9.rows[1].cells[1].style.cursor = 'default';
var reward_input3 = document.createElement("INPUT");
tbl9.rows[1].cells[1].appendChild(reward_input3);
reward_input3.style.height = '12px';
reward_input3.style.width = '15%';
reward_input3.style.fontSize = '10px';
reward_input3.style.border = '1px solid ' + CPANELBORDER;
reward_input3.style.backgroundColor = "white";
reward_input3.style.color = CPANELINPUTTEXT;
reward_input3.style.position = "relative";
reward_input3.style.left = "6px";
drawCorner(reward_input3, "3px");
reward_input3.value = singleMinimumSaved;

////Newest Pages To Scrape Box////
tbl9.rows[1].cells[2].innerHTML =  "Pages: ";
tbl9.rows[1].cells[2].style.cursor = 'default';
tbl9.rows[1].cells[2].width =  "120px";
var pages_input3 = document.createElement("INPUT");
tbl9.rows[1].cells[2].appendChild(pages_input3);
pages_input3.style.height = '12px';
pages_input3.style.width = '20%';
pages_input3.style.fontSize = '10px';
pages_input3.style.border = '1px solid ' + CPANELBORDER;
pages_input3.style.backgroundColor = "white";
pages_input3.style.color = CPANELINPUTTEXT;
pages_input3.style.position = "relative";
pages_input3.style.left = "11px";
drawCorner(pages_input3, "3px");
pages_input3.value = singlePageSaved;

////Newest Qualified Box////
tbl9.rows[0].cells[2].innerHTML =  "Qualified: ";
tbl9.rows[0].cells[2].style.cursor = 'default';
tbl9.rows[0].cells[2].width =  "120px";

tbl10  = document.createElement('table');
tbl9.rows[0].cells[2].appendChild(tbl10);
tbl10.style.position = "relative";
tbl10.width = '15px';
tbl10.style.height = '15px';
tbl10.style.cssFloat = "right";
tbl10.style.align = "center";
tbl10.style.left = "-10px";
var tr = tbl10.insertRow();
tbl10.rows[0].style.backgroundColor = CHECKED;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = '1px solid ' + CPANELBORDER;
drawCorner(td, "2px");
td.align = "center";
tbl10.rows[0].cells[0].style.height = "8px";
tbl10.rows[0].cells[0].style.width = "8px";
var qual_check3 = 1;
tbl10.rows[0].cells[0].onclick =  function() {
    if (qual_check3 == 0) {
        tbl10.rows[0].cells[0].style.backgroundColor =  CHECKED;
    	qual_check3 = 1;
        singleQualifiedState = "on";
    } else {
        tbl10.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
        qual_check3 = 0;
        singleQualifiedState = "off";
    }
}

/// Hits per page///
tbl9.rows[0].cells[3].innerHTML = 'HITs/Page';
tbl9.rows[0].cells[3].width = '10%';
var hits_input2 = document.createElement("INPUT");
tbl9.rows[1].cells[3].appendChild(hits_input2);
hits_input2.style.height = '12px';
hits_input2.style.width = '50%';
hits_input2.style.fontSize = '10px';
hits_input2.style.border = '1px solid ' + CPANELBORDER;
hits_input2.style.backgroundColor = "white";
hits_input2.style.color = CPANELINPUTTEXT;
hits_input2.style.position = "relative";
//hits_input2.style.left = "11px";
drawCorner(hits_input2, "3px");
hits_input2.value = singleHitsPerPage;
hits_input2.onchange = function() {
    singleHitsPerPage = hits_input2.value;
    GM_setValue("newest_hits_save", hits_input2.value);
}

////Newest Sound////
tbl9.rows[1].cells[4].innerHTML =  "Alert Sound: ";
tbl9.rows[1].cells[4].style.cursor = 'default';

nsoundbtn  = document.createElement('table');
tbl9.rows[1].cells[4].appendChild(nsoundbtn);
nsoundbtn.style.position = "relative";
nsoundbtn.width = '15px';
nsoundbtn.style.height = '15px';
nsoundbtn.style.cssFloat = "right";
nsoundbtn.style.align = "center";
nsoundbtn.style.left = "-25%";
var tr = nsoundbtn.insertRow();
nsoundbtn.rows[0].style.backgroundColor = CHECKED;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = '1px solid ' + CPANELBORDER;
drawCorner(td, "2px");
td.align = "center";
nsoundbtn.rows[0].cells[0].style.height = "8px";
nsoundbtn.rows[0].cells[0].style.width = "8px";
var nsound_check = 1;
nsoundbtn.rows[0].cells[0].onclick =  function() {
    if (nsound_check == 0) {
        nsoundbtn.rows[0].cells[0].style.backgroundColor =  CHECKED;
    	nsound_check = 1;
        saveState();
    } else {
        nsoundbtn.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
        nsound_check = 0;
        saveState();
    }
}


////Draw Newest Table/////
tbl12  = document.createElement('table');
leftdiv.appendChild(tbl12);
tbl12.style.position = "relative";
tbl12.width = '100%';
tbl12.style.backgroundColor = BACKGROUND;
tbl12.style.top = "6px";
tbl12.cellSpacing = '1px';
tbl12.style.tableLayout = "fixed";
tbl12.style.whiteSpace = "nowrap";

var singleExportTC = [];
var pandaSeconds = 0;
var pTimer;
var pDots = ".";

/////Draw Queue Table////
tbl7  = document.createElement('table');
rightdiv.appendChild(tbl7);
tbl7.style.position = "relative";
tbl7.width = '100%';
tbl7.style.backgroundColor = BACKGROUND;
tbl7.cellSpacing = '2px';
tbl7.style.cssFloat = "right";
tbl7.style.tableLayout = "fixed";
tbl7.style.whiteSpace = "nowrap";

/////Create PandA Buttons////
pandaTbl  = document.createElement('table');
rightdiv.appendChild(pandaTbl);
pandaTbl.style.position = 'relative';
pandaTbl.width = '100%';
pandaTbl.style.top = '5px';
pandaTbl.style.height = '15px'; //70px
pandaTbl.cellSpacing = '1px';
pandaTbl.style.align = "center";
var tr = pandaTbl.insertRow();
pandaTbl.rows[0].style.backgroundColor = CPANELBACKGROUND;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = "1px solid " + CPANELBACKGROUNDBORDER;
drawCorner(td, "4px");
td.align = "center";

pandaCellsTbl  = document.createElement('table');
pandaTbl.rows[0].cells[0].appendChild(pandaCellsTbl);
pandaCellsTbl.style.position = "relative";
pandaCellsTbl.width = '100%';
pandaCellsTbl.style.top = '0px';
pandaCellsTbl.cellSpacing = '1px';
pandaCellsTbl.style.cssFloat = "left";
pandaCellsTbl.style.align = "center";
    
for(var i = 0; i < 1; i++) {
	var tr = pandaCellsTbl.insertRow();
	pandaCellsTbl.rows[i].style.backgroundColor = CPANELCELL;
    pandaCellsTbl.rows[i].style.color = "white"
    pandaCellsTbl.rows[i].style.fontWeight = "bold";
	for(var j = 0; j < 3; j++) {
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(''));
		td.style.border = '1px solid ' + CPANELBORDER;
		td.align = "center";
        if (j == 0)
            drawCorner(td, "4px");
        if (j == 1)
            drawCorner(td, "left 4px");
        if (j == 2)
            drawCorner(td, "rigth 4px");
	}
}
pandaCellsTbl.rows[0].cells[0].style.cursor = 'pointer';
pandaCellsTbl.rows[0].cells[1].style.cursor = 'default';
pandaCellsTbl.rows[0].cells[2].style.cursor = 'default';

var percents = ["20%", "30%", "50%"];
tableWidth(pandaCellsTbl, percents);

////PandA Start Button////
var pandaStart = false;

$(pandaCellsTbl.rows[0].cells[0]).hover(function(){ 
$(this).css("background-color", DARKGREY);
},function(){
$(this).css("background-color", LIGHTGREY);
});
pandaCellsTbl.rows[0].cells[0].style.backgroundColor = LIGHTGREY;
pandaCellsTbl.rows[0].cells[0].style.color = "black";
pandaCellsTbl.rows[0].cells[0].innerHTML =  "Start";
pandaCellsTbl.rows[0].cells[0].onclick = function() {
    if (pandaStart == false) {
        pandaStart = true;
        pandaCellsTbl.rows[0].cells[0].innerHTML =  "Stop";
        linksBlack();
        pandaCellsTbl.rows[0].cells[2].innerHTML = "Running.";
    	pTimer = setInterval(pandaTimer, 1000);
        saveState();
    } else {
		pandaStart = false;
        pDots = "."
        pandaCellsTbl.rows[0].cells[0].innerHTML =  "Start";
        linksBlack();
        pandaCellsTbl.rows[0].cells[2].innerHTML = "";
        clearInterval(pTimer);
        saveState();
    }
}

pandaCellsTbl.rows[0].cells[1].innerHTML = "Refresh Default: "
var refresh_default_input = document.createElement("INPUT");
pandaCellsTbl.rows[0].cells[1].appendChild(refresh_default_input);
refresh_default_input.style.height = '12px';
refresh_default_input.style.width = '11%';
refresh_default_input.style.fontSize = '10px';
refresh_default_input.style.border = '1px solid ' + CPANELBORDER;
refresh_default_input.style.backgroundColor = "white";
refresh_default_input.style.color = CPANELINPUTTEXT;
refresh_default_input.style.position = "relative";
refresh_default_input.style.left = "3px";
drawCorner(refresh_default_input, "3px");
refresh_default_input.value = "5";

pandaCellsTbl2  = document.createElement('table');
pandaTbl.rows[0].cells[0].appendChild(pandaCellsTbl2);
pandaCellsTbl2.style.position = "relative";
pandaCellsTbl2.top = '0px';
pandaCellsTbl2.width = '100%';
pandaCellsTbl2.style.top = '0px';
pandaCellsTbl2.style.backgroundColor = "";
pandaCellsTbl2.cellSpacing = '1px';
pandaCellsTbl2.style.align = "center";
    
var pandatr = pandaCellsTbl2.insertRow();
pandaCellsTbl2.rows[0].style.backgroundColor = CPANELCELL;
pandaCellsTbl2.rows[0].style.color = "white";
pandaCellsTbl2.rows[0].style.fontWeight = "bold";
var pandatd = pandatr.insertCell();
pandatd.appendChild(document.createTextNode(''));
pandatd.style.border = '1px solid ' + CPANELBORDER;
pandatd.align = "center";
drawCorner(pandatd, "4px");

pandaInnerTbl  = document.createElement('table');
pandaCellsTbl2.rows[0].cells[0].appendChild(pandaInnerTbl);
pandaInnerTbl.style.position = "relative";
pandaInnerTbl.width = '100%';
pandaInnerTbl.cellSpacing = '1px';

////Label PandA Header////
for(var i = 0; i < 2; i++) {
	var tr = pandaInnerTbl.insertRow();
	for(var j = 0; j < 1; j++) { 
    	var td = tr.insertCell();
    	td.appendChild(document.createTextNode(''));
    	td.style.fontSize = '10px';
        td.style.fontWeight = "bold";
        td.style.color = "white";
		td.align = "center";
	}
}

pandaInnerTbl2  = document.createElement('table');
pandaInnerTbl.rows[0].cells[0].appendChild(pandaInnerTbl2);
pandaInnerTbl2.style.position = "relative";
pandaInnerTbl2.width = '100%';
pandaInnerTbl2.cellSpacing = '1px';

var tr = pandaInnerTbl2.insertRow();
for(var j = 0; j < 2; j++) { 
    var td = tr.insertCell();
    td.appendChild(document.createTextNode(''));
    td.style.fontSize = '10px';
    td.style.fontWeight = "bold";
    td.style.color = "white";
	td.align = "center";
}

var percents = ["30%","70%"];
tableWidth(pandaInnerTbl2, percents);

var pandaRequesterNode = document.createTextNode("Requester: ");
pandaInnerTbl2.rows[0].cells[0].appendChild(pandaRequesterNode);
pandaInnerTbl2.rows[0].cells[0].style.cursor = 'default';
var panda_requester_input = document.createElement("INPUT");
pandaInnerTbl2.rows[0].cells[0].appendChild(panda_requester_input);
panda_requester_input.style.height = '12px';
panda_requester_input.style.width = '60%';
panda_requester_input.style.fontSize = '10px';
panda_requester_input.style.border = '1px solid ' + CPANELBORDER;
panda_requester_input.style.backgroundColor = "white";
panda_requester_input.style.color = CPANELINPUTTEXT;
panda_requester_input.style.position = "relative";
panda_requester_input.style.left = "5px";
drawCorner(panda_requester_input, "3px");
panda_requester_input.placeholder = "Requester";

var pandaTitleNode = document.createTextNode("Title: ");
pandaInnerTbl2.rows[0].cells[1].appendChild(pandaTitleNode);
pandaInnerTbl2.rows[0].cells[1].style.cursor = 'default';
var panda_title_input = document.createElement("INPUT");
pandaInnerTbl2.rows[0].cells[1].appendChild(panda_title_input);
panda_title_input.style.height = '12px';
panda_title_input.style.width = '60%';
panda_title_input.style.fontSize = '10px';
panda_title_input.style.border = '1px solid ' + CPANELBORDER;
panda_title_input.style.backgroundColor = "white";
panda_title_input.style.color = CPANELINPUTTEXT;
panda_title_input.style.position = "relative";
panda_title_input.style.left = "5px";
drawCorner(panda_title_input, "3px");
panda_title_input.placeholder = "Title";

pandaInnerTbl.rows[1].cells[0].innerHTML = "PandA Link: ";
pandaInnerTbl.rows[1].cells[0].style.cursor = 'default';
var panda_input = document.createElement("INPUT");
pandaInnerTbl.rows[1].cells[0].appendChild(panda_input);
panda_input.style.height = '12px';
panda_input.style.width = '70%';
panda_input.style.fontSize = '10px';
panda_input.style.border = '1px solid ' + CPANELBORDER;
panda_input.style.backgroundColor = "white";
panda_input.style.color = CPANELINPUTTEXT;
panda_input.style.position = "relative";
panda_input.style.left = "14px";
drawCorner(panda_input, "3px");
panda_input.placeholder = "https://www.mturk.com/mturk/previewandaccept?";

pandaManualAdd  = document.createElement('table');
pandaInnerTbl.rows[1].cells[0].appendChild(pandaManualAdd);
pandaManualAdd.style.position = "relative";
pandaManualAdd.top = '0px';
pandaManualAdd.width = '10%';
pandaManualAdd.style.top = '0px';
pandaManualAdd.style.backgroundColor = "";
pandaManualAdd.cellSpacing = '1px';
pandaManualAdd.style.align = "center";

var pandatr = pandaManualAdd.insertRow();
pandaManualAdd.rows[0].style.backgroundColor = LIGHTGREY;
pandaManualAdd.rows[0].style.color = "black"
pandaManualAdd.rows[0].style.fontWeight = "bold";

var pandatd = pandatr.insertCell();
pandatd.appendChild(document.createTextNode(''));
pandatd.style.border = '1px solid ' + CPANELBORDER;
pandatd.align = "center";
drawCorner(pandatd, "4px");
pandaManualAdd.style.cssFloat = "right";
pandaManualAdd.cellPadding = "0px";
pandaManualAdd.rows[0].cells[0].style.height = "10px";
pandaManualAdd.rows[0].cells[0].style.fontSize = '10px';
pandaManualAdd.rows[0].cells[0].width = "100";
pandaManualAdd.rows[0].cells[0].innerHTML = "Add";
pandaManualAdd.rows[0].cells[0].style.cursor = 'pointer';
pandaManualAdd.rows[0].cells[0].onclick = function() {
    if (panda_title_input.value.length == 0) {
        if (panda_requester_input.value.length == 0) {
    	    addPanda(panda_input.value,"",panda_input.value);
    	    addPandaSave(panda_input.value,"",panda_input.value,refresh_default_input.value);
        } else {
            addPanda(panda_input.value,panda_requester_input.value,panda_input.value);
    	    addPandaSave(panda_input.value,panda_requester_input.value,panda_input.value,refresh_default_input.value);
        }
    } else {
        if (panda_requester_input.value.length == 0) {
            addPanda(panda_input.value, "", panda_title_input.value);
            addPandaSave(panda_input.value, "", panda_title_input.value, refresh_default_input.value);
        } else {
            addPanda(panda_input.value, panda_requester_input.value, panda_title_input.value);
            addPandaSave(panda_input.value, panda_requester_input.value, panda_title_input.value, refresh_default_input.value);
        }
    }
    panda_title_input.value = "";
    panda_input.value = "";
    panda_requester_input.value = "";
}

$(pandaManualAdd.rows[0].cells[0]).hover(function() { 
$(this).css("background-color", DARKGREY);
},function() {
$(this).css("background-color", LIGHTGREY);
});

////Draw PandA Table/////
pandaTbl  = document.createElement('table');
rightdiv.appendChild(pandaTbl);
pandaTbl.style.position = "relative";
pandaTbl.width = '100%';
pandaTbl.style.backgroundColor = BACKGROUND;
pandaTbl.style.top = "6px";
pandaTbl.cellSpacing = '1px';
pandaTbl.style.tableLayout = "fixed";
pandaTbl.style.whiteSpace = "nowrap";

////Label PandA Header////
var tr = pandaTbl.insertRow();
for(var i = 0; i < 5; i++) { 
    var td = tr.insertCell();
    td.appendChild(document.createTextNode(''));
    td.style.border = "1px solid" + CPANELBORDER; 
    td.style.fontSize = '10px';
    td.style.whiteSpace = "nowrap";
    td.style.overflow = "hidden";
    td.style.textOverflow = "ellipsis";
	td.align = "center";
    if (i == 0)
        drawCorner(td, "left 4px");
    if (i == 4)
        drawCorner(td, "right 4px");
}
for(var i = 0; i < 5; i++) { 
    pandaTbl.rows[0].cells[i].innerHTML = "<b>" + pandaHeader[i] + "</b>"; 
    pandaTbl.rows[0].cells[i].style.fontSize = '11px';
    pandaTbl.rows[0].cells[i].style.border = "1px solid " + CPANELBACKGROUNDBORDER;
} 

pandaTbl.rows[0].style.cursor = 'default';
pandaTbl.rows[0].style.backgroundColor = CPANELBACKGROUND; //Color Header
pandaTbl.rows[0].style.color = "white"; //Color Header Text

var percents = ["15%","50%","15%","10%","10%"];
tableWidth(pandaTbl, percents);

var returnLink = "https://www.mturk.com/mturk/return?inPipeline=false&hitId=";

/////Hybrid Scraper Buttons////
hybridbtns  = document.createElement('table');
rightdiv.appendChild(hybridbtns);
hybridbtns.style.position = 'relative';
hybridbtns.width = '100%';
hybridbtns.style.top = '12px';
hybridbtns.cellSpacing = '1px';
hybridbtns.style.align = "center";
var tr = hybridbtns.insertRow();
hybridbtns.rows[0].style.backgroundColor = CPANELBACKGROUND;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = "1px solid " + CPANELBACKGROUNDBORDER;
drawCorner(td, "4px");
td.align = "center";

hybridIntr  = document.createElement('table');
hybridbtns.rows[0].cells[0].appendChild(hybridIntr);
hybridIntr.style.position = "relative";
hybridIntr.width = '100%';
hybridIntr.style.top = '0px';
hybridIntr.cellSpacing = '1px';
hybridIntr.style.cssFloat = "left";
hybridIntr.style.align = "center";
    
for(var i = 0; i < 2; i++) {
	var tr = hybridIntr.insertRow();
	hybridIntr.rows[i].style.backgroundColor = CPANELCELL;
    hybridIntr.rows[i].style.color = "white"
    hybridIntr.rows[i].style.fontWeight = "bold";
	for(var j = 0; j < 4; j++) {
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(''));
		td.style.border = '1px solid ' + CPANELBORDER;
		td.align = "center";
        if (j == 0)
            drawCorner(td, "4px");
        if (j == 1)
            drawCorner(td, "left 4px");
        if (j == 3)
            drawCorner(td, "right 4px");
	}
}
hybridIntr.rows[0].cells[3].style.cursor = "default";
hybridIntr.rows[0].cells[0].style.cursor = "pointer";

////Hybrid Start Button////
$(hybridIntr.rows[0].cells[0]).hover(function(){ 
$(this).css("background-color", DARKGREY);
},function(){
$(this).css("background-color", LIGHTGREY);
});

hybridIntr.rows[0].cells[0].width =  "80px";
hybridIntr.rows[0].cells[0].style.backgroundColor = LIGHTGREY;
hybridIntr.rows[0].cells[0].style.color = "black";
hybridIntr.rows[0].cells[0].innerHTML =  "Start";

hybridIntr.rows[0].cells[0].onclick =  function() {
    if (hybridstart == false) {
    	hybridIntr.rows[0].cells[0].innerHTML =  "Stop";
        linksBlack();
        hybridIntr.rows[0].cells[3].innerHTML = "Grazing...";
    	hybridstart = true;
        hybridTimerVar = hybrid_time.value;
        //hybridPagesToScrape = hybrid_pages.value;
        GM_setValue("hybrid_refresh_save", hybrid_time.value);
        //GM_setValue("hybrid_minimum_save", hybrid_reward.value);
        //GM_setValue("hybrid_page_save", hybrid_pages.value);
        saveState();
        scrapeHybrid();
    } else
        stopHybrid();
}

////Hybrid Hides 3rd Row 1st Cell////
hybridIntr.rows[1].cells[0].style.backgroundColor = CPANELBACKGROUND; 
hybridIntr.rows[1].cells[0].style.border = "0px";

////Hybrid Auto Refresh Box////
hybridIntr.rows[0].cells[1].innerHTML =  "Auto-Refresh Delay: ";
hybridIntr.rows[0].cells[1].style.cursor = 'default';
hybridIntr.rows[0].cells[1].width =  "180px";
var hybrid_time = document.createElement("INPUT");
hybridIntr.rows[0].cells[1].appendChild(hybrid_time);
hybrid_time.style.height = '12px';
hybrid_time.style.width = '15%';
hybrid_time.style.fontSize = '10px';
hybrid_time.style.border = '1px solid ' + CPANELBORDER;
hybrid_time.style.backgroundColor = "white";
hybrid_time.style.color = CPANELINPUTTEXT;
hybrid_time.style.position = "relative";
drawCorner(hybrid_time, "3px");
hybrid_time.value = hybridRefreshSaved;

////Hybrid Minimum Reward Box////
//hybridIntr.rows[1].cells[1].innerHTML =  "Minimum Reward: "; 
//hybridIntr.rows[1].cells[1].style.cursor = 'default';
//hybridIntr.rows[1].cells[1].width =  "180px";
//var hybrid_reward = document.createElement("INPUT");
//hybridIntr.rows[1].cells[1].appendChild(hybrid_reward);
//hybrid_reward.style.height = '12px';
//hybrid_reward.style.width = '15%';
//hybrid_reward.style.fontSize = '10px';
//hybrid_reward.style.border = '1px solid ' + CPANELBORDER;
//hybrid_reward.style.backgroundColor = "white";
//hybrid_reward.style.color = CPANELINPUTTEXT;
//hybrid_reward.style.position = "relative";
//hybrid_reward.style.left = "6px";
//drawCorner(hybrid_reward, "3px");
//hybrid_reward.value = hybridMinimumSaved;
///HIDE FOR NOW///
//hybridIntr.rows[1].cells[1].style.color = CPANELCELL;
//$(hybrid_reward).hide();
hybridIntr.rows[0].cells[2].style.cursor = 'pointer';
hybridIntr.rows[0].cells[2].innerHTML =  "Balance: $0.00";
hybridIntr.rows[0].cells[2].onclick =  function() { window.open('http://www.gethybrid.io/workers/payments'); }
////Hybrid Pages To Scrape Box////
//hybridIntr.rows[0].cells[2].innerHTML =  "Pages: ";
//hybridIntr.rows[0].cells[2].style.cursor = 'default';
//hybridIntr.rows[0].cells[2].width =  "120px";

//var hybrid_pages = document.createElement("INPUT");
//hybridIntr.rows[0].cells[2].appendChild(hybrid_pages);
//hybrid_pages.style.height = '12px';
//hybrid_pages.style.width = '20%';
//hybrid_pages.style.fontSize = '10px';
//hybrid_pages.style.border = '1px solid ' + CPANELBORDER;
//hybrid_pages.style.backgroundColor = "white";
//hybrid_pages.style.color = CPANELINPUTTEXT;
//hybrid_pages.style.position = "relative";
//hybrid_pages.style.left = "11px";
//drawCorner(hybrid_pages, "3px");
//hybrid_pages.value = hybridPageSaved;
///HIDE FOR NOW///
//hybridIntr.rows[0].cells[2].style.color = CPANELCELL;
//$(hybrid_pages).hide();

////Hybrid Sound////
hybridIntr.rows[1].cells[3].innerHTML =  "Alert Sound: ";
hybridIntr.rows[1].cells[3].style.cursor = 'default';

hsoundbtn  = document.createElement('table');
hybridIntr.rows[1].cells[3].appendChild(hsoundbtn);
hsoundbtn.style.position = "relative";
hsoundbtn.width = '15px';
hsoundbtn.style.height = '15px';
hsoundbtn.style.cssFloat = "right";
hsoundbtn.style.align = "center";
hsoundbtn.style.left = "-22%";
var tr = hsoundbtn.insertRow();
hsoundbtn.rows[0].style.backgroundColor = CHECKED;
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.border = '1px solid ' + CPANELBORDER;
drawCorner(td, "2px");
td.align = "center";
hsoundbtn.rows[0].cells[0].style.height = "8px";
hsoundbtn.rows[0].cells[0].style.width = "8px";
var hsound_check = 1;
hsoundbtn.rows[0].cells[0].onclick =  function() {
    if (hsound_check == 0) {
        hsoundbtn.rows[0].cells[0].style.backgroundColor =  CHECKED;
    	hsound_check = 1;
        saveState();
    } else {
        hsoundbtn.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
        hsound_check = 0;
        saveState();
    }
}

var percents = ["15%","30%","20%","35%"];
tableWidth(hybridIntr, percents);

////Draw Hybrid Table/////
hybridTbl  = document.createElement('table');
rightdiv.appendChild(hybridTbl);
hybridTbl.style.position = "relative";
hybridTbl.width = '100%';
hybridTbl.style.backgroundColor = BACKGROUND;
hybridTbl.style.top = "12px";
hybridTbl.cellSpacing = '1px';
hybridTbl.style.tableLayout = "fixed";
hybridTbl.style.whiteSpace = "nowrap";

////Pending Earnings////
var theDate;
var $todaysSrc;
var statusLink = "https://www.mturk.com/mturk/statusdetail?sortType=All&pageNumber=1&encodedDate=";
var $todaysReward = [];
var $weeklyReward = [];
var $todaysCounter = ".";
var $weeklyCounter = ".";
var $todaysPages;
var weekDates = [];
var $weeklySrc;
var $weeklyPages;
var weekDay;
var todayEnabled = false;
var weeklyEnabled = false;
var mturkTime;
var monthDay;
var $SubmittedSrc = "https://worker.mturk.com/dashboard?ref=w_hdr_db";
var $earningsSrc = "https://worker.mturk.com/dashboard?ref=w_hdr_db";
var month;
var day;
var year;

////Clear Today's Projected If New Day////
calculateMturkDate();
month = month + 1;
if (month < 10)
	month = 0 + "" + month
theDate = month + "" + day + "" + year;

if (theDate != todaysDateSaved)
    todaysProjectedSaved = "0.00";

////Clear Weekly Projected If New Week////
var beginning; 
clearWeekly();

dashTbl.rows[0].style.cursor = 'pointer';
////Today's Projected Earnings Box////
dashTbl.rows[0].cells[0].innerHTML = "Today's Projected Earnings: $" + todaysProjectedSaved;
dashTbl.rows[0].cells[0].onclick =  function() {
    if (todayEnabled == false) {
        todayEnabled = true;
        calculateMturkDate()
        month = month + 1;
        if (month < 10)
            month = 0 + "" + month
        theDate = month + "" + day + "" + year;
    	$todaysSrc = statusLink + theDate;
    	dashTbl.rows[0].cells[0].innerHTML = "Today's Projected Earnings: Calculating";
    	todaysGrabData();
    }
        
}

////Weekly Projected Earnings Box////
dashTbl.rows[0].cells[1].innerHTML = "<b title='" + wList + "'>" + "Weekly Projected Earnings: $" + weeklyProjectedSaved + "</b>";
dashTbl.rows[0].cells[1].onclick =  function(e) {
    if (!e) e = window.event;
    if (e.altKey)
        wList = "";
                    
    if (weeklyEnabled == false) {
        weeklyEnabled = true;
		dashTbl.rows[0].cells[1].innerHTML = "Weekly Projected Earnings: Calculating"    
        calculateMturkDate()
    	var lastMonth = month - 1;
        if (lastMonth < 0 ) {
            lastMonth = 11
            lastMonth = monthDayCount[lastMonth];
        } else 
            lastMonth = monthDayCount[lastMonth];
        
        month = month + 1;
        if (month < 10)
            month = 0 + "" + month
    	for (i = 0; i <= weekDay; i++) {
            if (day - i > 0) {  
                var tday = day - i;
            	if (tday < 10)
                    tday = 0 + "" + tday;
            	weekDates[i] = month + "" + tday + "" + year;
            } else {
                if (month == 1) {
                    var tmonth = 12;
                    var tyear = year - 1;
                } else {
                    tmonth = month - 1;
                    if (tmonth < 10)
                        tmonth = 0 + "" + tmonth;
                    tyear = year;
                }
            	weekDates[i] = tmonth + "" + (lastMonth + (day - i)) + "" + tyear;
        	}
    	}
        weekDates.reverse();
        GM_setValue("weekly_projected_end", weekDates[0])
    	$weeklySrc = statusLink + weekDates[weekDay]
    	weeklyGrabData();
    }
}

////Earnings Available For Transfer Box////
dashTbl.rows[0].cells[3].innerHTML = "Earnings Available For Transfer: $0.00";
dashTbl.rows[0].cells[3].onclick =  function() {
    dashTbl.rows[0].cells[3].innerHTML = "Earnings Available For Transfer: Checking"
    grabEarnings();
}
dashTbl.rows[0].cells[3].ondblclick =  function() {
    window.open("https://www.mturk.com/mturk/transferearnings");
}

var rDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
var wTotal = [];
var wdTotal = [];
var submittedMonthDay;

////Todays Submitted Box////
dashTbl.rows[0].cells[2].innerHTML = "Today's Submitted: " + "0";
dashTbl.rows[0].cells[2].onclick =  function() {
    dashTbl.rows[0].cells[2].innerHTML = "Today's Submitted: " + "Loading";
    grabTodaySubmittedData();
}

grabTodaySubmittedData();

var $earningsData;
grabEarnings();

var alertOn = false;

linksBlack();

captchaDiv.style.position = 'fixed';
captchaDiv.style.width = '40%';
captchaDiv.style.height = '80px';
captchaDiv.style.left = '30%';
captchaDiv.style.top = '10%';
captchaDiv.style.padding = '5px';
captchaDiv.style.border = '1px solid ' + CPANELBORDER;
captchaDiv.style.backgroundColor = RED;
captchaDiv.style.color = 'white';
captchaDiv.style.zIndex = '100';
drawCorner(captchaDiv, "4px");

captchaDiv.align = 'center';
captchaDiv.style.fontSize = '20px';

var captchaDivButton = document.createElement('button');

captchaDivButton.textContent = 'Close';
captchaDivButton.style.height = '20px';
captchaDivButton.style.width = '100px';
captchaDivButton.style.fontSize = '14px';
captchaDivButton.style.paddingLeft = '3px';
captchaDivButton.style.paddingRight = '3px';
captchaDivButton.style.backgroundColor = 'white';
captchaDivButton.style.marginTop = '30px';
captchaDivButton.style.marginLeft = '40px';

captchaDivButton.addEventListener("click", function() {closeCaptcha();}, false);
document.body.appendChild(captchaDiv);
$(captchaDiv).hide();

captchaTbl  = document.createElement('table');
captchaDiv.appendChild(captchaTbl);
captchaTbl.style.position = "absolute";
captchaTbl.width = '100%';
captchaTbl.style.marginTop = '8px';
captchaTbl.cellSpacing = '1px';

var tr = captchaTbl.insertRow();
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.fontSize = '20px';
td.style.fontWeight = "bold";
td.style.color = "white";
td.align = "center";

var tr = captchaTbl.insertRow();
var td = tr.insertCell();
td.appendChild(document.createTextNode(''));
td.style.fontSize = '10px';
td.style.fontWeight = "bold";
td.style.color = "white";
td.align = "center";

captchaTbl.rows[1].cells[0].appendChild(captchaDivButton);

function clearPanda() {
    while(pandaTbl.rows.length > 1) {
              pandaTbl.deleteRow(1);
    }
    pandaTable();
}

function pandaTable() {
    if (pandaPauseList) {
        for (var i = 0; i < pandaHrefList.length; i++) {
            addPanda(pandaHrefList[i], pandaRequesterList[i], pandaTitleList[i], pandaRefreshList[i], pandaPauseList[i]);
        }
    } else {
        for (var i = 0; i < pandaHrefList.length; i++) {
            addPanda(pandaHrefList[i], pandaRequesterList[i], pandaTitleList[i]);
        }
        pandaWork();
    }
    var percents = ["15%","50%","15%","10%","10%"];
    tableWidth(pandaTbl, percents);
}

pandaTable()

if (stateList[0] == true) {
    $batchSrc = 'https://worker.mturk.com/?page_size=20&filters%5Bqualified%5D=' + batchQualifiedState + '&filters%5Bmasters%5D=' + 'false' + '&sort=num_hits_desc&filters%5Bmin_reward%5D=' + reward_input.value + '&page_size=' + batchHitsPerPage;
    tbl3.rows[0].cells[0].innerHTML =  "Stop";
    tbl3.rows[0].cells[0].innerHTML =  "Stop";
    linksBlack();
    tbl3.rows[0].cells[4].innerHTML = "Grazing...";
    startStop = true;
    timerVar = time_input.value;
    batchPagesToScrape = pages_input.value;
    batchGrabData();
}

if (stateList[1] == true) {
    $queueSrc = "https://worker.mturk.com/tasks";
    tbl6.rows[0].cells[0].innerHTML =  "Stop";
    linksBlack();
    tbl6.rows[0].cells[2].innerHTML = "Grazing...";
    startStop2 = true;
    queuetimerVar = time_input2.value;
    queuePagesToScrape = pages_input2.value;
    queueGrabData();
}

if (stateList[2] == true) {
    $singleSrc = 'https://worker.mturk.com/?page_size=20&filters%5Bqualified%5D=' + singleQualifiedState + '&filters%5Bmasters%5D=false&sort=updated_desc&filters%5Bmin_reward%5D='+ reward_input3.value + '&page_size=' + singleHitsPerPage;
    tbl9.rows[0].cells[0].innerHTML =  "Stop";
    linksBlack();
    tbl9.rows[0].cells[4].innerHTML = "Grazing...";
    startStop3 = true;
    timerVar3 = time_input3.value;
    singlePagesToScrape = pages_input3.value;
    singleGrabData();
}

if (stateList[3] == true) {
    pandaStart = true;
    pandaCellsTbl.rows[0].cells[0].innerHTML =  "Stop";
    linksBlack();
    pandaCellsTbl.rows[0].cells[2].innerHTML = "Running.";
    pTimer = setInterval(pandaTimer, 1000);
}

//if (stateList[4] == true) {
//    premobtn.rows[0].cells[0].style.backgroundColor =  CHECKED;
//    premo_check = 1;
//}

if (stateList[5] == 0) {
    bsoundbtn.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
    bsound_check = 0;
} 

if (stateList[7] == 1) {
    qsoundbtn.rows[0].cells[0].style.backgroundColor =  CHECKED;
    qsound_check = 1;
} 

if (stateList[8] == 0) {
    nsoundbtn.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
    nsound_check = 0;
}

if (stateList[9] == 0) {
    hsoundbtn.rows[0].cells[0].style.backgroundColor =  UNCHECKED;
    hsound_check = 0;
}

if (stateList[6] == true) {
    hybridIntr.rows[0].cells[0].innerHTML =  "Stop";
    linksBlack();
    hybridIntr.rows[0].cells[3].innerHTML = "Grazing...";
    hybridstart = true;
    hybridTimerVar = hybrid_time.value;
    //hybridPagesToScrape = hybrid_pages.value;
    scrapeHybrid();
}

function pandaWork() {
    pandaRefreshList = [];
    pandaPauseList = [];
    for (var i = 1; i < refresh_input.length; i++) { pandaRefreshList.push(refresh_input[i].value); }
    for (var i = 1; i < pandaPause.length; i++) { pandaPauseList.push(pandaPause[i]); }
    GM_setValue("panda_refresh_list", pandaRefreshList);
    GM_setValue("panda_pause_list", pandaPauseList);
}
var premo_check;
function saveState() {
    stateList = [startStop, startStop2, startStop3, pandaStart, premo_check, bsound_check, hybridstart, qsound_check, nsound_check, hsound_check];
    GM_setValue("state_list", stateList);
    
    ////Auto////
    var autoList = [];
    autoList = [auto_check3, aa_input.value];
    GM_setValue("auto_save", autoList);
}

function skinSet(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w) {
    ////Background Color////
    BACKGROUND = a;

    ////Start Button Colors////
    LIGHTGREY = b;
    DARKGREY = c;

    ////TO Colors////
    BORDERCOLOR = d;
    GREY = e;
    GREEN = f;
    YELLOWGREEN = g;
    ORANGE = h;
    RED = i;
    BROWN = j;

    ////Control Panel Colors////
    CPANELBACKGROUND = k;
    CPANELBACKGROUNDBORDER = l;
    CPANELCELL = m;
    CPANELBORDER = n;
    CPANELINPUTTEXT = o;

    ////Queue Colors////
    QUEUEBORDER = p;
    GREEN1 = q;
    GREEN2 = r;
    GREEN3 = s;
    GREEN4 = t;
    GREEN5 = u;

    ////Check Box Colors////
    CHECKED = v;
    UNCHECKED = w;

    document.body.style.background = BACKGROUND;
}

////Default////
function SKINDEFAULT() {
    skinSet("#FFFFFF", "#E6E6E6", "#B2B2B2", "#CCCCCC", "#E6E6E6", "#66CC66", "#ADFF2F", "#FF9900", "#FF3030", "#E0D1B2", "#ACC8FF", "#9BB4E6", "#5C9DBD", "#000000", "#000000", "#00B200", "#E6F7E6", "#99E099", "#4DC94D", "#00B200", "#007D00", "#34586A", "#FFFFFF");
}

////Default Grey////
function SKINDEFAULTGREY() {
    skinSet("#666666", "#E6E6E6", "#B2B2B2", "#4D4D4D", "#E6E6E6", "#66CC66", "#ADFF2F", "#FF9900", "#FF3030", "#E0D1B2", "#333333", "#4D4D4D", "#5C9DBD", "#000000", "#000000", "#000000", "#E6F7E6", "#99E099", "#4DC94D", "#00B200", "#007D00", "#000000", "#FFFFFF");
}

////Orange////
function SKINORANGE() {
    skinSet("#666666", "#E6E6E6", "#B2B2B2", "#4D4D4D", "#E6E6E6", "#66CC66", "#ADFF2F", "#FF9900", "#FF3030", "#E0D1B2", "#333333", "#4D4D4D", "#FFA319", "#000000", "#000000", "#000000", "#E6F7E6", "#99E099", "#4DC94D", "#00B200", "#007D00", "#000000", "#FFFFFF");
}

////Silver Orange////
function SKINSILVERORANGE() {
    skinSet("#E6E6E6", "#E6E6E6", "#666666", "#4D4D4D", "#E6E6E6", "#66CC66", "#ADFF2F", "#FFAD33", "#FF3030", "#E0D1B2", "#B2B2B2", "#4D4D4D", "#FFA319", "#666666", "#000000", "#000000", "#E6F7E6", "#99E099", "#4DC94D", "#00B200", "#007D00", "#666666", "#FFFFFF");
}

////Purple////
function SKINPURPLE() {
    skinSet("#666666", "#E6E6E6", "#B2B2B2", "#4D4D4D", "#E6E6E6", "#66CC66", "#ADFF2F", "#FF9900", "#FF3030", "#E0D1B2", "#333333", "#4D4D4D", "#990099", "#000000", "#000000", "#000000", "#E6F7E6", "#99E099", "#4DC94D", "#00B200", "#007D00", "#000000", "#FFFFFF");
}

////Green////
function SKINGREEN() {
    skinSet("#666666", "#E6E6E6", "#B2B2B2", "#4D4D4D", "#E6E6E6", "#66CC66", "#ADFF2F", "#FF9900", "#FF3030", "#E0D1B2", "#333333", "#4D4D4D", "#008A00", "#000000", "#000000", "#000000", "#E6F7E6", "#99E099", "#4DC94D", "#00B200", "#007D00", "#000000", "#FFFFFF");
}

////Save Blocklist////
function save_blocklist() {
    var block_list = $("#batch_block_text").val().split("^");
    var trimmed_list = [];
    for (var requester in block_list) {
        if (typeof block_list[requester] === 'string' && block_list[requester].trim().length !== 0)
            trimmed_list.push(block_list[requester].toLowerCase().trim());
    }
    GM_setValue("batch_ignore_list",trimmed_list);   
    batchIgnoreList = GM_getValue("batch_ignore_list");
    $("#batch_block_div").hide();
}

////Save Greenlist////
function save_greenlist() {
    var green_list = $("#green_text").val().split("^");
    var trimmed_list = [];
    for (var requester in green_list){
        if (typeof green_list[requester] === 'string' && green_list[requester].length != 0)
        	trimmed_list.push(green_list[requester].toLowerCase().trim());
    }
    GM_setValue("green_list",trimmed_list);   
    greenList = GM_getValue("green_list");
    $("#green_div").hide();
}

////Save Premolist////
function save_premolist() {
    var premo_list = $("#premo_text").val().split("^");
    var premo_count = [];
    var premo_requester = [];
    for (i=0;i<premo_list.length;i++) {
        var prem = premo_list[i].split(">")
    	premo_count.push(prem[1]);
    }
    
    for (i=0;i<premo_list.length;i++) {
        var prem2 = premo_list[i].split(">")
    	premo_requester.push(prem2[0]);
    }
    
    var trimmed_list = [];
    for (var requester in premo_requester){
        if (typeof premo_requester[requester] === 'string' && premo_requester[requester].trim().length != 0)
        	trimmed_list.push(premo_requester[requester].toLowerCase().trim());
    }
    GM_setValue("premo_count_list",premo_count);
    premoCountList = GM_getValue("premo_count_list");
    GM_setValue("premo_list",trimmed_list);   
    premoList = GM_getValue("premo_list");
    $("#premo_div").hide();
}

function block(blockThis){
    batchIgnoreList.push(blockThis);
    GM_setValue("batch_ignore_list",batchIgnoreList);
    alert("\""+blockThis+"\" ignored.");
}

function greenC(addThis){
    greenList.push(addThis);
    GM_setValue("green_list",greenList);
    alert("\""+addThis+"\" added to Greenlist.");
}

////Hybrid Scrape////
function scrapeHybrid() {
    GM_xmlhttpRequest ({
        method: "GET",
        url: 'https://www.gethybrid.io/workers/projects?pinterest=1',
        onload: function (results) {
            if (results.finalUrl == 'https://www.gethybrid.io/users/sign_in') { //AUTO
                var temp = window.open('https://www.gethybrid.io/users/sign_in');
                setTimeout(function(){ 
                    temp.close(); 
                    scrapeHybrid();
                    return;
                }, 3000);
            }
            var data = $(results.responseText);
            var links = data.find('a[href*="project_id"]');
            var task = [];
            var pay = [];
            var poster = [];
            var created = [];
            var link = [];
            var name = [];
            for (var i=0, length=links.length; i<length; i++) {
                poster[i] = links.eq(i).parent().prev().text();
                task[i] = links.eq(i).parent().next().text();
                pay[i] = links.eq(i).parent().next().next().text();
                created[i] = links.eq(i).parent().next().next().next().text();
                link[i] = 'https://www.gethybrid.io' + links.eq(i).attr("href");
                name[i] = links.eq(i).text();
            }
            hybridTimerState = true;
            hybridSwitch = setInterval(hybridTimer, 1000);
            
            //if (premo_check == 1) {
    	    //    i = poster.length;
    	    //    var pCheckList = [];
    	    //    while (i--) {
    		//        premoCheck(poster[i], name[i], task[i])
    		//        if (found2) {
        	//	        pCheckList.push(poster[i] + name[i])
        	//	        sendAlert(pCheckList, staleListH, poster[i], name[i] + "<br>Tasks: " + task[i] + "<br>" + pay[i]);
    		//        }
            //    }
            //}
            
            ////Clears The Table////
            var lastRow = hybridTbl.rows.length - 1; 
            for (i = lastRow; i>-1; i--)
                hybridTbl.deleteRow(i);
            
            ////Builds Table////
	        for(var i = 0; i < poster.length + 1; i++) {
		        var tr = hybridTbl.insertRow();
		        hybridTbl.rows[i].style.backgroundColor = "#66FFFF";
		        for(var j = 0; j < 8; j++) {
			        var td = tr.insertCell();
			        td.appendChild(document.createTextNode(''));
		        	td.style.border = "1px solid" + BORDERCOLOR;
                    td.style.fontSize = '10px';
                    td.style.whiteSpace = "nowrap";
                    td.style.overflow = "hidden";
                    td.style.textOverflow = "ellipsis";
		        	td.align = "center";
                    if (j == 0)
                        drawCorner(td, "left 4px");
                    if (j == 4)
                        drawCorner(td, "right 4px");
	        	}
                //hybridTbl.rows[i].cells[5].innerHTML = "Down";
	        }
    
	
            var percents = ["16%","56%","10%","10%","13%"];
            tableWidth(hybridTbl, percents);
    
            ////Label Header////
	        for(var i = 0; i < 5; i++) { 
                hybridTbl.rows[0].cells[i].innerHTML = "<b>" + hybridHeader[i] + "</b>"; 
            	hybridTbl.rows[0].cells[i].style.fontSize = '11px';
                hybridTbl.rows[0].cells[i].style.border = "1px solid " + CPANELBACKGROUNDBORDER;
            	} 
            hybridTbl.rows[0].style.cursor = 'default';
        	hybridTbl.rows[0].style.backgroundColor = CPANELBACKGROUND; //Color Header
        	hybridTbl.rows[0].style.color = "white"; //Color Header Text
    
            ////Fill Table////
            var checklist = [];
            for (var i = 0; i < poster.length; i++) {
                //greenCheck(poster[i], name[i]);
                //if (!found)
                    //Make Different Color
                checklist.push(poster[i] + name[i])
                
                hybridTbl.rows[i+1].cells[0].innerHTML = "<a href='"+ link[i] +"' target='_blank' title='"+ poster[i] +"'>" + poster[i] + "</a>";
                hybridTbl.rows[i+1].cells[1].innerHTML = "<a href='"+ link[i] +"' target='_blank' title='"+ name[i] +"'>" + name[i] + "</a>";
                hybridTbl.rows[i+1].cells[2].innerHTML = "<a href='"+ link[i] +"' target='_blank' title='"+ task[i] +"'>" + task[i] + "</a>";
                hybridTbl.rows[i+1].cells[3].innerHTML = "<a href='"+ link[i] +"' target='_blank' title='"+ pay[i] +"'>" + pay[i] + "</a>";
                hybridTbl.rows[i+1].cells[4].innerHTML = "<a href='"+ link[i] +"' target='_blank' title='"+ created[i] +"'>" + created[i] + "</a>";
            }
            
            staleListCheck(checklist, staleListHG);
            linksBlack();
        }
	});
    
    getHPay();
}

var logger;
////Extract Batch Data////
function batchGrabData() {
	$.get($batchSrc)
    .done(function(data) {
    	$batchData = $(data);

    	var maxpagerate = $batchData.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
    	if (maxpagerate.length == 0) {
            $batchData = $batchData.find("div[data-react-props]").eq(3).data('reactProps').bodyData;
            if ($batchData) {
                $next_URL = 'https://worker.mturk.com/?page_size=20&filters%5Bqualified%5D=' + batchQualifiedState + '&filters%5Bmasters%5D=false&sort=num_hits_desc&filters%5Bmin_reward%5D='+ reward_input.value +'&page_number= ' + batchNextPage + '&page_size=' + batchHitsPerPage;
                $batchSrc = $next_URL;
                batchNextPage++;
                batchFilterData($batchData);
            } else {
                setTimeout(function(){batchGrabData();}, 3000);
            }
    	} else {
        	setTimeout(function(){batchGrabData();}, 3000);
    	}
	})
    .fail(function() {
        captchaTbl.rows[0].cells[0].innerHTML = "You've been logged out";
        $(captchaDiv).show();    
        setTimeout(function(){batchGrabData();}, 30000);
        //logger = window.open('https://www.mturk.com/mturk/dashboard','remote1');
    });
}

////Extract Newest Data////
function singleGrabData() {
	$.get($singleSrc, function(data) {
    	$singleData = $(data);
    	var maxpagerate = $singleData.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
    	if (maxpagerate.length == 0) {
            $singleData = $singleData.find("div[data-react-props]").eq(3).data('reactProps').bodyData;
            if ($singleData) {
                $next_URL = 'https://worker.mturk.com/?page_size=20&filters%5Bqualified%5D=' + singleQualifiedState + '&filters%5Bmasters%5D=false&sort=updated_desc&filters%5Bmin_reward%5D='+ reward_input3.value +'&page_number= ' + singleNextPage + '&page_size=' + singleHitsPerPage;
                $singleSrc = $next_URL;
                singleNextPage++;
                singleFilterData($singleData);
            } else {
                setTimeout(function(){singleGrabData();}, 3000);
            }
    	} else {
        	setTimeout(function(){singleGrabData();}, 3000);
    	}
	})
    .fail(function() {
    captchaTbl.rows[0].cells[0].innerHTML = "You've been logged out";
    $(captchaDiv).show();    
    setTimeout(function(){singleGrabData();}, 30000);
    //logger = window.open('https://www.mturk.com/mturk/dashboard','remote1');
  });
}

////Extract Queue Data////
function queueGrabData() {
	$.get($queueSrc, function(data) {
        $queueData = $(data);
    	var maxpagerate = $queueData.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
    	if (maxpagerate.length == 0) {
            queueNextPage++;
            $queueSrc = "https://worker.mturk.com/tasks";
            $queueData = $queueData.find("div[data-react-props]").eq(1).data('reactProps').bodyData;

            queueFilterData($queueData);
    	} else {
        	setTimeout(function(){queueGrabData();}, 3000);
    	}
	})
    .fail(function() {
    captchaTbl.rows[0].cells[0].innerHTML = "You've been logged out";
    $(captchaDiv).show();       
    setTimeout(function(){queueGrabData();}, 10000);
    //logger = window.open('https://www.mturk.com/mturk/dashboard','remote1');
  });
}

////Get Title////
function getTitles(results, queue) {
    var title = [];
    for (var i = 0; i < results.length; i++) {
        if (queue == true)
            title[i] = results[i].project.title
        else
            title[i] = results[i].title
	}
    return title;
}

////Get Requester////
function getRequesters(results) {
    var requester = [];
    for (var i = 0; i < results.length; i++) {
	    requester[i] = results[i].requester_name
	}
    return requester;
}

////Get Requester Links////
function getRequesterLinks(results) {
    var requesterlink = [];
    for (var i = 0; i < results.length; i++) {
	    requesterlink[i] = results[i].requester_url
	}
    return requesterlink;
}

////Get Requester Id////
function getRequesterID(results) {
    var requesterID = [];
    for (var i = 0; i < results.length; i++) {
	    requesterID[i] = results[i].requester_id
	}
    return requesterID;
}

////Get Reward////
function getRewards(results, queue) {
    var reward = [];
    for (var i = 0; i < results.length; i++) {
        if (queue == true)
            reward[i] = results[i].project.monetary_reward.amount_in_dollars.toFixed(2);
        else
            reward[i] = results[i].monetary_reward.amount_in_dollars.toFixed(2);
	}
    return reward;
}

function getQuals(data) {
    //var quals = data.find('a[id^="qualificationsRequired"]');
    
    //for (var j = 0; j < quals.length; j++) {
    //	var qElements = quals.eq(j).parent().parent().parent().find('tr');

    //	var qualifications = [];
    //	for (var i = 1; i < qElements.length; i++) {
    //		qualifications.push(qElements[i].childNodes[1].textContent.trim()); 
    //	}
    //	var qualList = (qualifications.join(', ') ? qualifications.join(', ') : "None");
    //}
}
    
////Get Group Ids////
function getGroupIds(data) {
    data
    var not_qualified_group_IDs = [];
    var listy = [];
//    var mixed = data.find('a[href^="/mturk/preview?"],a[href^="/mturk/notqualified?"]');
	
//	for (var i = 0; i < mixed.length; i++) {
//	    var mixedFilter = mixed[i].href;
//	    if (mixedFilter.indexOf("https://www.mturk.com/mturk/notqualified?hitGroupId=") >= 0) {
//	       	mixedFilter = mixedFilter.replace("https://www.mturk.com/mturk/notqualified?hitGroupId=","").split('&hitId=')[0];
//	       	not_qualified_group_IDs.push(mixedFilter);
//	    }
//	    mixedFilter = mixedFilter.split('groupId=')[1];
//	    listy.push(mixedFilter);
//	}
    
//	listy = listy.filter(function(elem, pos) {
//	        return listy.indexOf(elem) == pos;
//	});

    for (var i = 0; i < data.length; i++) {
	    var mixedFilter = data[i].hit_set_id;

	    if (data[i].caller_meets_requirements == false) {
	       	not_qualified_group_IDs.push(mixedFilter);
	    }
	    listy.push(mixedFilter);
	}

	listy = listy.filter(function(elem, pos) {
	        return listy.indexOf(elem) == pos;
	});
    return [listy, not_qualified_group_IDs];
}

////Get Time Allotted////
function getTimeAllotted(results) {
    var hitTime = [];
    var allottedSeconds = [];
    var hits = [];
	//var $times = data.find('a[id^="duration_to_complete"]');
    //var $requester = data.find('a[href^="/mturk/searchbar?selectedSearchType=hitgroups&requester"]');

    for (var i = 0; i < results.length; i++) {
        allottedSeconds[i] = results[i].assignment_duration_in_seconds
        hits[i] = results[i].assignable_hits_count
	}

    //for (var j = 0; j < $times.length; j++) {
    //    hitTime[j] = $times.eq(j).parent()[0].nextSibling.nextSibling.innerHTML;
    //    var $hits = $requester.eq(j).parent().parent().parent().parent().parent().parent().find('td[class="capsule_field_text"]');
    //    hits[j] = $hits.eq(4).text().trim();
    //}
    
    //for (var i = 0; i < hitTime.length; i++) allottedSeconds[i] = hitTime[i].match(/[-+]?[0-9]*\.?[0-9]+/g);
    
	//for (var i = 0; i < hitTime.length; i++) {
	//    if (hitTime[i].indexOf("week") >= 0) {
	//        if (hitTime[i].indexOf("day") >= 0)
	//        	allottedSeconds[i] = ((allottedSeconds[i][0]*604800) + (allottedSeconds[i][1]*86400));
	//        else
	//            allottedSeconds[i] = (allottedSeconds[i][0]*604800);
	//    } else {
	//        if (hitTime[i].indexOf("day") >= 0) {
	//            if (hitTime[i].indexOf("hour") >= 0)
	//        		allottedSeconds[i] = ((allottedSeconds[i][0]*86400) + (allottedSeconds[i][1]*3600));
	//            else
	//            	allottedSeconds[i] = (allottedSeconds[i][0]*86400);
	//        } else {
	//        	if (hitTime[i].indexOf("hour") >= 0) {
	//          		if (hitTime[i].indexOf("minute") >= 0)
	//        			allottedSeconds[i] = ((allottedSeconds[i][0]*3600) + (allottedSeconds[i][1]*60));
	//           	 	else
	//            		allottedSeconds[i] = (allottedSeconds[i][0]*3600);
	//        	} else {
	//        		if (hitTime[i].indexOf("minute") >= 0) {
	//                	if (hitTime[i].indexOf("second") >= 0)
	//        				allottedSeconds[i] = ((allottedSeconds[i][0]*60) + allottedSeconds[i][1]*60);
	//           	 		else
	//            			allottedSeconds[i] = (allottedSeconds[i][0]*60);
	//                } else
	//                    allottedSeconds[i] = allottedSeconds[i][0];
	//            }
	//    	}
	//    }
	//}

    for (var i = 0; i < allottedSeconds.length; i++) {
        var seconds = Number(allottedSeconds[i]);

        var numweeks = Math.floor (seconds / 604800);

        var numdays = Math.floor((seconds % 604800) / 86400);

        var numhours = Math.floor(((seconds % 604800) % 86400) / 3600);

        var numminutes = Math.floor((((seconds % 604800) % 86400) % 3600) / 60);

        var numseconds = (((seconds % 604800) % 86400) % 3600) % 60;

        if (numweeks > 0)
            hitTime[i] = numweeks + " weeks " + numdays + " days " + numhours + " hours " + numminutes + " minutes";
        else if (numdays > 0)
            hitTime[i] = numdays + " days " + numhours + " hours " + numminutes + " minutes";
        else if (numhours > 0)
            hitTime[i] = numhours + " hours " + numminutes + " minutes";
        else
            hitTime[i] = numminutes + " minutes";

    }

    return [hitTime, allottedSeconds, hits];
}

////Get Queue Time////
function getQueueTime(results) {
    var hitTime = [];
    //var $times = data.find('a[id^="time_left"]');
    
    //for (var j = 0; j < $times.length; j++) { hitTime[j] = $times.eq(j).parent()[0].nextSibling.nextSibling.innerHTML; }
    for (var i = 0; i < results.length; i++) {
	    hitTime[i] = results[i].time_to_deadline_in_seconds
	}
    for (var i = 0; i < hitTime.length; i++) {
        var seconds = Number(hitTime[i]);

        var numweeks = Math.floor (seconds / 604800);

        var numdays = Math.floor((seconds % 604800) / 86400);

        var numhours = Math.floor(((seconds % 604800) % 86400) / 3600);

        var numminutes = Math.floor((((seconds % 604800) % 86400) % 3600) / 60);

        var numseconds = (((seconds % 604800) % 86400) % 3600) % 60;

        if (numweeks > 0)
            hitTime[i] = numweeks + " weeks " + numdays + " days " + numhours + " hours " + numminutes + " minutes";
        else if (numdays > 0)
            hitTime[i] = numdays + " days " + numhours + " hours " + numminutes + " minutes";
        else if (numhours > 0)
            hitTime[i] = numhours + " hours " + numminutes + " minutes";
        else
            hitTime[i] = numminutes + " minutes";

    }
    return hitTime;
}

////Filter Batch Data////
function batchFilterData($batchData) {
    var $title = getTitles($batchData);
	var $requester = getRequesters($batchData);
    var $requesterLink = getRequesterLinks($batchData);
    var $reward = getRewards($batchData);
	var $quals = getQuals($batchData);
    var $requesterID = getRequesterID($batchData);
    var mListy = getGroupIds($batchData)
    var listy = mListy[0];
    var not_qualified_group_IDs = mListy[1];
    var mTime = getTimeAllotted($batchData);
    var hitTime = mTime[0];
    var allottedSeconds = mTime[1];
    var hits = mTime[2];
	
	////Push To List And Rescrape If More Pages////
    for (var i=0; i < $requester.length; i++) {
        $batchRequester.push($requester[i]);
		$batchTitle.push($title[i]);
        $batchHits.push(hits[i]);
        $batchReward.push($reward[i]);
        $batchHitTime.push(hitTime[i]);
        $batchListy.push(listy[i]);
        $batchRequesterLink.push($requesterLink[i]);
        $batchRequesterID.push($requesterID[i]);
        $batchNotQualifiedGroupIds.push(not_qualified_group_IDs[i]);
        $batchAllottedSeconds.push(allottedSeconds[i]);
    }
    
    if (batchNextPage > batchPagesToScrape) {
    	batchNextPage = 1;
        $batchSrc = 'https://worker.mturk.com/?page_size=20&filters%5Bqualified%5D=' + batchQualifiedState + '&filters%5Bmasters%5D=' + 'false' + '&sort=num_hits_desc&filters%5Bmin_reward%5D=' + reward_input.value + '&page_size=' + batchHitsPerPage;
//    	$batchSrc = "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=&minReward=" + reward_input.value + "&qualifiedFor=" + batchQualifiedState + "&sortType=NumHITs%3A1&pageSize=50";
		batchScrape();
    } else
        batchGrabData();
}

////Filter Newest Data////
function singleFilterData($singleData) {
    var times = [];
    var $title = getTitles($singleData);
	var $requester = getRequesters($singleData);
    var $requesterLink = getRequesterLinks($singleData);
    var $requesterID = getRequesterID($singleData);
    var $reward = getRewards($singleData);
    
    var mListy = getGroupIds($singleData)
    var listy = mListy[0];
    var not_qualified_group_IDs = mListy[1];
    
    var mTime = getTimeAllotted($singleData);
    var hitTime = mTime[0];
    var allottedSeconds = mTime[1];
    var hits = mTime[2];
    
    ////Push To List And Rescrape If More Pages////
    for (var i=0; i < $requester.length; i++) {
        $singleRequester.push($requester[i]);
		$singleTitle.push($title[i]);
        $singleHits.push(hits[i]);
        $singleReward.push($reward[i]);
        $singleHitTime.push(hitTime[i]);
        $singleListy.push(listy[i]);
        $singleRequesterLink.push($requesterLink[i]);
        $singleRequesterID.push($requesterID[i]);
        $singleNotQualifiedGroupIds.push(not_qualified_group_IDs[i]);
        $singleAllotedSeconds.push(allottedSeconds[i]);
    }
    
    if (singleNextPage > singlePagesToScrape) {
    	singleNextPage = 1;
    	$singleSrc = 'https://worker.mturk.com/?page_size=20&filters%5Bqualified%5D=' + singleQualifiedState + '&filters%5Bmasters%5D=false&sort=updated_desc&filters%5Bmin_reward%5D='+ reward_input3.value + '&page_size=' + singleHitsPerPage;
		singleScrape();
    } 
    else
        singleGrabData();
}

////Filter Queue Data////
var qcount;
function queueFilterData($queueData) {
    var hitTime = [];
    var temp = qcount;
    var $requester = [], $preview = [], $return = [];
    //if ($queueData.find('td[class="title_orange_text"]:contains("Results")').length)
    //    qcount = $queueData.find('td[class="title_orange_text"]:contains("Results")')[0].textContent.split('of ')[1].split(' Results')[0];
    //else
    //    qcount = 0;
    
    if (temp < qcount && qsound_check == 1)
        queueSound.play();
        
    ////Get Titles////
	var $title = getTitles($queueData, true);
    var $reward = getRewards($queueData, true);
	
	//var $requester = $queueData.find('span[class="requesterIdentity"]'); //Get the requesters
	for (var i = 0; i < $queueData.length; i++) { $requester[i] = ( $queueData[i].project.requester_name ); }
	
	//var $preview = $queueData.find('a[href^="/mturk/continue?"]'); // GETS CONTINUE LINK
	for (var i = 0; i < $queueData.length; i++) { $preview[i] = ( $queueData[i].task_url ); }
	
    //var $contact = $queueData.find('a[href^="/mturk/contact?"]'); // GETS CONTACT LINK
	//for (var i = 0; i < $queueData.length; i++) { $contact[i] = ( $contact[i].href ); }
    
    //var $return = $queueData.find('a[href^="/mturk/return?"]'); // GETS RETURN LINK
	for (var i = 0; i < $queueData.length; i++) { $return[i] = ( $queueData[i].task_url ); } //NEED TO FIND FIX
	
	var hitTime = getQueueTime($queueData)
    
    for (var i=0; i < $requester.length; i++) {
        $finalqueuerequester.push($requester[i]);
		$finalqueuetitle.push($title[i]);
        $finalqueuereward.push($reward[i]);
        $finalhitQueueTime.push(hitTime[i]);
        $finalcontinuelink.push($preview[i]);
        //$finalcontact.push($contact[i]);
        $finalreturnlink.push($return[i]); 
    }
    //if (queueNextPage <= queuePagesToScrape) {
    //    if ($requester.length < 10) {
    //		queueNextPage = 1;
    //		$queueSrc = "https://www.mturk.com/mturk/viewmyhits?searchWords=&selectedSearchType=hitgroups&sortType=Deadline%3A0&pageNumber=" + queueNextPage + "&searchSpec=HITSearch%23T%231%2310%23-1%23T%23%21Status%210%21rO0ABXQACEFzc2lnbmVk%21%23%21Deadline%210%21%23%21";
			queueScrape();
    //	}
    //    else
    //    	queueGrabData();
    //} else {
    //    queueNextPage = 1;
    //	$queueSrc = "https://www.mturk.com/mturk/viewmyhits?searchWords=&selectedSearchType=hitgroups&sortType=Deadline%3A0&pageNumber=" + queueNextPage + "&searchSpec=HITSearch%23T%231%2310%23-1%23T%23%21Status%210%21rO0ABXQACEFzc2lnbmVk%21%23%21Deadline%210%21%23%21";
	//	queueScrape();
    //}
}

////Stop Batch Scraper////
function stopScrape() {
    startStop = false;
    saveState();
    if (batchTimerState == true) {
        tbl3.rows[0].cells[0].innerHTML =  "Start";
        linksBlack();
        tbl3.rows[0].cells[4].innerHTML = ""
        tbl3.rows[0].cells[4].innerHTML = "Stopped"
        clearInterval(timerSwitch);
        timerVar = 0;
        batchTimerState = false;
        }
    else {
        tbl3.rows[0].cells[4].innerHTML = "Stopping"
    	setTimeout(function(){stopScrape();}, 500);
    }
}

////Stop Queue Scraper////
function stopScrape2() {
    startStop2 = false;
    saveState();
    if (queueTimerState == true) {
        tbl6.rows[0].cells[0].innerHTML =  "Start";
        linksBlack();
        tbl6.rows[0].cells[2].innerHTML = ""
        tbl6.rows[0].cells[2].innerHTML = "Stopped"
        clearInterval(timerSwitch2);
        queuetimerVar = 0;
        queueTimerState = false;
    } else {
        tbl6.rows[0].cells[2].innerHTML = "Stopping"
    	setTimeout(function(){stopScrape2();}, 500);
    }
}

////Stop Newest Scraper////
function stopScrape3() {
    startStop3 = false;
    saveState();
    if (singleTimerState == true) {
        tbl9.rows[0].cells[0].innerHTML =  "Start";
        linksBlack();
        tbl9.rows[0].cells[4].innerHTML = ""
        tbl9.rows[0].cells[4].innerHTML = "Stopped"
        clearInterval(timerSwitch3);
        timerVar3 = 0;
        singleTimerState = false;
    } else {
        tbl9.rows[0].cells[4].innerHTML = "Stopping"
    	setTimeout(function(){stopScrape3();}, 500);
    }
}

////Stop Hybrid Scraper////
function stopHybrid() {
    hybridstart = false;
    saveState();
    if (hybridTimerState == true) {
        hybridIntr.rows[0].cells[0].innerHTML = "Start";
        linksBlack();
        hybridIntr.rows[0].cells[3].innerHTML = "Stopped"
        clearInterval(hybridSwitch);
        hybridTimerVar = 0;
        hybridTimerState = false;
    } else {
        hybridIntr.rows[0].cells[3].innerHTML = "Stopping"
    	setTimeout(function(){stopHybrid();}, 500);
    }
}

/////Batch Timer////
var scrapeTimer = function () {
    tbl3.rows[0].cells[4].innerHTML = "Next graze in: " + timerVar + " seconds";
    timerVar = timerVar - 1;
    if (timerVar < 0) {
        batchTimerState = false;
        clearInterval(timerSwitch)
        tbl3.rows[0].cells[4].innerHTML = "Grazing...";
        timerVar = time_input.value;
        batchGrabData();
    }
}

////Newest Timer////
var scrapeTimer3 = function () {
    tbl9.rows[0].cells[4].innerHTML = "Next graze in: " + timerVar3 + " seconds";
    timerVar3 = timerVar3 - 1;
    if (timerVar3 < 0) {
        singleTimerState = false;
        clearInterval(timerSwitch3)
        tbl9.rows[0].cells[4].innerHTML = "Grazing...";
        timerVar3 = time_input3.value;
        singleGrabData();
    }
}

////Queue Timer////
var queueTimer = function () {
    tbl6.rows[0].cells[2].innerHTML = "Next graze in: " + queuetimerVar + " seconds";
    queuetimerVar = queuetimerVar - 1;
    if (queuetimerVar < 0) {
        queueTimerState = false;
        clearInterval(timerSwitch2)
        tbl6.rows[0].cells[2].innerHTML = "Grazing...";
        queuetimerVar = time_input2.value;
        queueGrabData();
    }
}

////Hybrid Timer////
var hybridTimer = function () {
    hybridIntr.rows[0].cells[3].innerHTML = "Next graze in: " + hybridTimerVar + " seconds";
    hybridTimerVar = hybridTimerVar - 1;
    if (hybridTimerVar < 0) {
        hybridTimerState = false;
        clearInterval(hybridSwitch)
        hybridIntr.rows[0].cells[3].innerHTML = "Grazing...";
        hybridTimerVar = hybrid_time.value;
        scrapeHybrid();
    }
}

////Batch Ignore Check////
function batchIgnoreCheck(r,t) {
    tempList = batchIgnoreList.map(function(item) { return item.toLowerCase(); });
    foundR = -1;
    foundT = -1;
    foundR = tempList.indexOf(r.toLowerCase());
    foundT = tempList.indexOf(t.toLowerCase());
    found = foundR == -1 && foundT == -1;
    return found;
}

////Green Check////
function greenCheck(r,t) {
    tempList = greenList.map(function(item) { return item.toLowerCase(); });
    foundR = -1;
    foundT = -1;
    foundR = tempList.indexOf(r.toLowerCase());
    foundT = tempList.indexOf(t.toLowerCase());
    found = foundR == -1 && foundT == -1;
    return found;
}


////Premo Check////
function premoCheck(r,t,h) {
    tempList = premoList.map(function(item) { return item.toLowerCase(); });
    foundR = -1;
    foundT = -1;
    foundH = 0;
    //foundR = tempList.indexOf(r.toLowerCase());
    //foundT = tempList.indexOf(t.toLowerCase());
    //found = foundR == -1 && foundT == -1;
    //if (!found) {
    //    if (foundR > -1) {
    //    	foundH = premoCountList[foundR];
    //    }
    //    else if (foundT > -1)
    //    	foundH = premoCountList[foundT];
    //h = Number(h);
    //foundH = Number(foundH);
    //if (h > foundH)
    //    foundH = true;
    //else
    //    foundH = false;
    //foundH = Number(foundH)  
    //}
    //found2 = foundH == 1;
    //return found2;    
    
    for (var i=0, length = tempList.length; i<length; i++) {
        foundR = r.toLowerCase().indexOf(tempList[i]);
        foundT = t.toLowerCase().indexOf(tempList[i]);
        found = foundR == -1 && foundT == -1;
        if (!found) {
            if (foundR > -1) {
                foundH = premoCountList[foundR];
            }
            else if (foundT > -1)
                foundH = premoCountList[foundT];
            h = Number(h);
            foundH = Number(foundH);
            if (h > foundH)
                foundH = true;
            else
                foundH = false;
            foundH = Number(foundH)  
        }
        found2 = foundH == 1;
        if (found2 == true)
            return found2;  
    }
    return found2;
}

////Check Stale List////
function staleListCheck(checklist, list) {
    var ding = false;
    
    for (var i = 0; i < checklist.length; i++) {
        var a = list.indexOf(checklist[i])
        if (a < 0) {
            ding = true;
            list.push(checklist[i])
        }
    }
    
    for (var i = 0; i < list.length; i++) {
        var a = checklist.indexOf(list[i])
        if (a < 0) {
            list.splice(i, 1)
        }
    }
    
    if (ding) {
        if (list == staleListHG && hsound_check == 1)
            playH();
        else if (list == staleListB && bsound_check == 1)
            batchSound.play();
        else if (list == staleListS && nsound_check == 1)
            newestSound.play();
    }
}

////Draw Batch Table////
function batchScrape() {
    var batchExportTC = [];
    
    i = $batchRequester.length;
    while (i--) {
    batchIgnoreCheck($batchRequester[i], $batchTitle[i]);
    	if (!found) {
        	$batchRequester.splice(i,1);
        	$batchRequesterLink.splice(i,1);
            $batchRequesterID.splice(i,1);
        	$batchTitle.splice(i,1);    
        	$batchListy.splice(i,1);
        	$batchHits.splice(i,1);
        	$batchReward.splice(i,1);
        	$batchHitTime.splice(i,1);
        	$batchAllottedSeconds.splice(i,1);
    	}
    }
    
    //if (premo_check == 1) {
    //	i = $batchRequester.length;
    //	var pCheckList = [];
    //	while (i--) {
    //		premoCheck($batchRequester[i], $batchTitle[i], $batchHits[i])
    //		if (found2) {
    //    		pCheckList.push($batchRequester[i] + $batchTitle[i])
    //    		sendAlert(pCheckList, staleListC, $batchRequester[i], $batchTitle[i] + "<br>Hits: " + $batchHits[i] + "<br>$" + $batchReward[i]);
    //		}
    //	}
    //}
    
    ////TO LIST////
    for (var i=0; i < $batchRequesterLink.length; i++) { 
	    //requesterId[i] = $batchRequesterLink[i].replace('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=','');
		if (i < ($batchRequesterID.length - 1))
   		    idList += $batchRequesterID[i] + ",";
    	else
    	    idList += $batchRequesterID[i];
	}
	
    $batchTOURL = "https://turkopticon.ucsd.edu/api/multi-attrs.php?ids=" + idList;  //
    idList = "";
    
    ////Clears The Table////
    var lastRow = tbl.rows.length - 1;
    for (i = lastRow; i>-1; i--)
        tbl.deleteRow(i);
    
    ////Builds Table////
	for(var i = 0; i < $batchRequester.length + 1; i++) {
		var tr = tbl.insertRow();
		tbl.rows[i].style.backgroundColor = GREY;
		for(var j = 0; j < 8; j++) {
			var td = tr.insertCell();
			td.appendChild(document.createTextNode(''));
			td.style.border = "1px solid" + BORDERCOLOR;
            td.style.fontSize = '10px';
            td.style.whiteSpace = "nowrap";
            td.style.overflow = "hidden";
            td.style.textOverflow = "ellipsis";
			td.align = "center";
            if (j == 0)
                drawCorner(td, "left 4px");
            if (j == 7)
                drawCorner(td, "right 4px");
		}
        tbl.rows[i].cells[5].innerHTML = "Down";
	}
    
	
    var percents = ["16%","35%","8%","9%","18%","6%","4%","4%"];
    tableWidth(tbl, percents);
    
    ////Label Header////
	for(var i = 0; i < 8; i++) { 
        tbl.rows[0].cells[i].innerHTML = "<b>" + scrapeHeader[i] + "</b>"; 
    	tbl.rows[0].cells[i].style.fontSize = '11px';
        tbl.rows[0].cells[i].style.border = "1px solid " + CPANELBACKGROUNDBORDER;
    	} 
    tbl.rows[0].style.cursor = 'default';
	tbl.rows[0].style.backgroundColor = CPANELBACKGROUND; //Color Header
	tbl.rows[0].style.color = "white"; //Color Header Text
    
    ////Fill Table////
    //var checklist1 = [];
    for (var i = 0; i < $batchRequester.length; i++) {
        tbl.rows[i+1].cells[0].innerHTML = "<a href='"+ $batchRequesterLink[i] +"' target='_blank' title='"+ $batchRequester[i] +"'>" + $batchRequester[i] + "</a>";
        tbl.rows[i+1].style.cursor = 'pointer';
        tbl.rows[i+1].cells[0].onclick = function(e) { 
            if (!e) e = window.event;
            if (e.ctrlKey) {
                var $requester = $(this).closest("tr").find("td:nth-child(1)")[0].textContent;
                greenC($requester);
                return false;
            } else if (e.altKey) {
                var $requester = $(this).closest("tr").find("td:nth-child(1)")[0].textContent;
                block($requester);
                return false;
            }
        }
        if ($batchNotQualifiedGroupIds.indexOf($batchListy[i]) < 0) {
        	tbl.rows[i+1].cells[1].innerHTML = "<a href='"+ preview_Link + $batchListy[i] + '/tasks?ref=w_pl_prvw' + "' target='_blank' title='"+ $batchTitle[i] +"'>" + $batchTitle[i] + "</a>";
            tbl.rows[i+1].cells[1].onclick = function(e) { 
                if (!e) e = window.event;
                if (e.ctrlKey) {
                    var $title = $(this).closest("tr").find("td:nth-child(2)")[0].textContent;
                    greenC($title);
                    return false;
                } else if (e.altKey) {
                    var $title = $(this).closest("tr").find("td:nth-child(2)")[0].textContent;
                    block($title);
                    return false;
                }
            }
            tbl.rows[i+1].cells[2].innerHTML = "<a href='"+ preview_Link + $batchListy[i] +"' target='_blank'>" + $batchHits[i] + "</a>"; 
        	tbl.rows[i+1].cells[3].innerHTML = "<a href='"+ preview_Link + $batchListy[i] +"' target='_blank'>" + "$" + $batchReward[i] + "</a>";
        	tbl.rows[i+1].cells[4].innerHTML = "<a href='"+ preview_Link + $batchListy[i] +"' target='_blank'>" + $batchHitTime[i] + "</a>";
            tbl.rows[i+1].cells[6].innerHTML = "P";
            tbl.rows[i+1].cells[6].onclick = function() { 
                var $item = $(this).closest("tr").find("td:nth-child(2)")[0].innerHTML.replace('<a href="', "").split('" target', 1)[0].replace("?ref=w_pl_prvw", "/accept_random?ref=w_pl_prvw");
                var $requester = $(this).closest("tr").find("td:nth-child(1)")[0].textContent;
                var $title = $(this).closest("tr").find("td:nth-child(2)")[0].textContent;
                
                addPanda($item, $requester, $title);
                addPandaSave($item, $requester, $title, refresh_default_input.value);
            };
            tbl.rows[i+1].cells[7].innerHTML = "A";
            //batchExportTC[i+1] = "$" + $batchReward[i] + " - " + $batchTitle[i] + " - " + preview_Link + $batchListy[i] + " - " + $batchHitTime[i] + " - Requester: " + $batchRequester[i] + " - Hits Available: " + $batchHits[i];
            batchExportTC[i+1] = preview_Link + $batchListy[i];
            tbl.rows[i+1].cells[7].onclick = function(e) {
                if (!e) e = window.event;
                if (e.ctrlKey) {
                    var $item = this.parentNode.rowIndex
					GM_setClipboard(batchExportTC[$item]);
                    clickSound.play();
                } else {
                    var $item = $(this).closest("tr").find("td:nth-child(2)")[0].innerHTML.replace('<a href="', "").split('" target', 1)[0].replace("?ref=w_pl_prvw", "/accept_random?ref=w_pl_prvw");
            		acceptFunction($item);
            	}
            }
        } else {
            tbl.rows[i+1].cells[1].innerHTML = "<a href='"+ $batchRequesterLink[i] +"' target='_blank' title='"+ $batchTitle[i] +"'>" + $batchTitle[i] + "</a>";
            tbl.rows[i+1].cells[1].onclick = function(e) { 
                if (!e) e = window.event;
                if (e.ctrlKey) {
                    var $title = $(this).closest("tr").find("td:nth-child(2)")[0].textContent;
                    greenC($title);
                    return false;
                } else if (e.altKey) {
                    var $title = $(this).closest("tr").find("td:nth-child(2)")[0].textContent;
                    block($title);
                    return false;
                }
            }
            tbl.rows[i+1].cells[2].innerHTML = "<a href='"+ $batchRequesterLink[i] +"' target='_blank'>" + $batchHits[i] + "</a>"; 
        	tbl.rows[i+1].cells[3].innerHTML = "<a href='"+ $batchRequesterLink[i] +"' target='_blank'>" + "$" +$batchReward[i] + "</a>";
        	tbl.rows[i+1].cells[4].innerHTML = "<a href='"+ $batchRequesterLink[i] +"' target='_blank'>" + $batchHitTime[i] + "</a>"; ;
            tbl.rows[i+1].cells[6].innerHTML = "N"
            tbl.rows[i+1].cells[7].innerHTML = "<a href='"+ $batchRequesterLink[i] +"' target='_blank'>" + "N" + "</a>"; ;
        }
        greenCheck($batchRequester[i], $batchTitle[i])
        if (!found) {
            tbl.rows[i+1].style.backgroundColor = "#66FFFF";
            //checklist1.push($batchRequester[i] + $batchTitle[i])  
        }
        //staleListCheck(checklist1, staleListB);
    }
    linksBlack();
    
    
	batchtoRequesterId = [];
    batchtoNotQualifiedGroupIds = [];
    batchtoListy = [];
    batchtoReward = [];
	batchtoAllottedSeconds = [];
    batchToHits = [];
    batchToRequester = [];
    batchToTitle = [];

    for (i = 0; i < $batchRequesterID.length; i++) { batchtoRequesterId[i] = $batchRequesterID[i]; }
    for (i = 0; i < $batchNotQualifiedGroupIds.length; i++) { batchtoNotQualifiedGroupIds[i] = $batchNotQualifiedGroupIds[i]; }
    for (i = 0; i < $batchListy.length; i++) { batchtoListy[i] = $batchListy[i]; }
    for (i = 0; i < $batchReward.length; i++) { batchtoReward[i] = $batchReward[i]; }
    for (i = 0; i < $batchAllottedSeconds.length; i++) { batchtoAllottedSeconds[i] = $batchAllottedSeconds[i]; }
    for (i = 0; i < $batchHits.length; i++) { batchToHits[i] = $batchHits[i]; } 
    for (i = 0; i < $batchRequester.length; i++) { batchToRequester[i] = $batchRequester[i]; } 
    for (i = 0; i < $batchTitle.length; i++) { batchToTitle[i] = $batchTitle[i]; } 
    GM_xmlhttpRequest //GET TO DATA
	({
    	method: "GET",
        url: $batchTOURL,
        onload: function (results)
        	{
            	rdata = $.parseJSON(results.responseText);
                var checklist = [];
                for (i = 0; i < batchtoRequesterId.length; i++) {
                	var batchtoAverage = [];
                    if (rdata[batchtoRequesterId[i]]) {
                    	var sum = 0;
                        var average = 0;
                        var reviews = rdata[batchtoRequesterId[i]].reviews;
                    	var comm = rdata[batchtoRequesterId[i]].attrs.comm;
                    	var pay = rdata[batchtoRequesterId[i]].attrs.pay;
                    	var fair = rdata[batchtoRequesterId[i]].attrs.fair;
                    	var fast = rdata[batchtoRequesterId[i]].attrs.fast;
                        
                        sum = ((pay*10) + (fair*5))/15;
                        sum = sum.toFixed(2);
                        batchtoAverage = sum;
                        var tit = 'Comm: ' + comm + '\n' + 'Pay: ' + pay + '\n' + 'Fair: ' + fair + '\n' + 'Fast: ' + fast;
                        tbl.rows[i+1].cells[5].innerHTML = "<a href='"+ "https://turkopticon.info/requesters?utf8=✓&q=" + batchtoRequesterId[i] +"' target='_blank' title='" + tit + "'>" + batchtoAverage + "</a>";
                        } else {
                            batchtoAverage = -1;
                            tbl.rows[i+1].cells[5].innerHTML = "no TO";
                        }
                    
                        if (batchtoNotQualifiedGroupIds.indexOf(batchtoListy[i]) < 0) {
                            greenCheck(batchToRequester[i], batchToTitle[i])
                            if (!found)
                                batchtoAverage = 5.00
                                
                        	if (batchtoAverage > 4.39) {
                        		tbl.rows[i+1].style.backgroundColor = GREEN;
                            	////Auto////
                                if (batchtoReward[i] > 4.99) 
                                    acceptFunction(previewAccept_Link + batchtoListy[i]+'/tasks/accept_random?ref=w_pl_prvw');
                        	}
                        	else if (batchtoAverage > 3.39) 
                        		tbl.rows[i+1].style.backgroundColor = YELLOWGREEN;
                        	else if (batchtoAverage > 2.39) 
                        		tbl.rows[i+1].style.backgroundColor = ORANGE;
                        	else if (batchtoAverage >= 0) 
                        		tbl.rows[i+1].style.backgroundColor = RED;
                        	else {
                        		tbl.rows[i+1].style.backgroundColor = GREY;
                            	////Auto////
                                if (batchtoReward[i] > 4.99)
                                    acceptFunction(previewAccept_Link + batchtoListy[i]+'/tasks/accept_random?ref=w_pl_prvw');
                        	}
                            if (!found) {
                                tbl.rows[i+1].style.backgroundColor = "#66FFFF";
                                checklist.push(batchToRequester[i] + batchToTitle[i])  
                            }
                        } else 
                            tbl.rows[i+1].style.backgroundColor = BROWN; 
                    }
                	staleListCheck(checklist, staleListB);
                    linksBlack();

                }
	});

    timerVar = time_input.value;
	timerSwitch = setInterval(scrapeTimer, 1000);
    batchTimerState = true;
    
    $batchRequester = [];
    $batchRequesterID = [];
	$batchTitle = [];
	$batchHits = [];
	$batchReward = [];
	$batchHitTime = [];
	$batchListy = [];
    $batchRequesterLink = [];
    $batchNotQualifiedGroupIds = [];
    $batchAllottedSeconds = [];
    requesterId = [];
}

////Draw Newest Table////
function singleScrape() {
    i = $singleRequester.length;
    while (i--) { 
        batchIgnoreCheck($singleRequester[i], $singleTitle[i]);
        if (!found) {
            $singleRequester.splice(i,1);
            $singleRequesterLink.splice(i,1)
            $singleRequesterID.splice(i,1);
            $singleTitle.splice(i,1);
            requesterId3.splice(i,1);
            $singleListy.splice(i,1);
            $singleHits.splice(i,1);
            $singleReward.splice(i,1);
            $singleHitTime.splice(i,1);
            $singleAllotedSeconds.splice(i,1);
        }
    }
    
    //if (premo_check == 1) {
    //	i = $singleRequester.length;
    //	var pCheckList = [];
    //	while (i--) {
    //		premoCheck($singleRequester[i], $singleTitle[i], $singleHits[i])
    //		if (found2) {
    //    		pCheckList.push($singleRequester[i] + $singleTitle[i])
    //    		sendAlert(pCheckList, staleListD, $singleRequester[i], $singleTitle[i] + "<br>Hits: " + $singleHits[i] + "<br>$" + $singleReward[i]);
    //		}
    //	}
    //}
    
    ////Create TO List////
    for (var i=0; i < $singleRequesterLink.length; i++) { 
	    //requesterId3[i] = $singleRequesterLink[i].replace('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=','');
		if (i < ($singleRequesterID.length - 1)) {
   		    idList3 += $singleRequesterID[i] + ",";
    	} else
    	    idList3 += $singleRequesterID[i];
	}
	
    $singleTOURL = "https://turkopticon.ucsd.edu/api/multi-attrs.php?ids=" + idList3;
    idList3 = "";
    
    ////Clears The Table////
    var lastRow3 = tbl12.rows.length - 1; 
    for (i = lastRow3; i>-1; i--)
    tbl12.deleteRow(i);
    
    ////Builds Table////
	for(var i = 0; i < $singleRequester.length + 1; i++) {
		var tr = tbl12.insertRow();
		tbl12.rows[i].style.backgroundColor = GREY;
		for(var j = 0; j < 8; j++) {
			var td = tr.insertCell();
			td.appendChild(document.createTextNode(''));
            td.style.border = "1px solid" + BORDERCOLOR;
            td.style.fontSize = '10px';
            td.style.whiteSpace = "nowrap";
            td.style.overflow = "hidden";
            td.style.textOverflow = "ellipsis";
			td.align = "center";
            if (j == 0)
                drawCorner(td, "left 4px");
            if (j == 7)
                drawCorner(td, "right 4px");
		}
        tbl12.rows[i].cells[5].innerHTML = "Down";
	}
	
    var percents = ["16%","35%","8%","9%","18%","6%","4%","4%"];
    tableWidth(tbl12, percents);
    
    ////Label Header////
	for(var i = 0; i < 8; i++) { 
        tbl12.rows[0].cells[i].innerHTML = "<b>" + scrapeHeader[i] + "</b>"; 
    	tbl12.rows[0].cells[i].style.fontSize = '11px';
		tbl12.rows[0].cells[i].style.border = "1px solid " + CPANELBACKGROUNDBORDER;
    } 
	
    tbl12.rows[0].style.cursor = 'default';
    tbl12.rows[0].style.backgroundColor = CPANELBACKGROUND; //Color Header
	tbl12.rows[0].style.color = "white"; //Color Header Text
    
    ////Fill Table////
    //var checklist2 = [];
    for (var i = 0; i < $singleRequester.length; i++) {
        tbl12.rows[i+1].cells[0].innerHTML = "<a href='"+ $singleRequesterLink[i] +"' target='_blank' title='"+ $singleRequester[i] +"'>" + $singleRequester[i] + "</a>"; 
        tbl12.rows[i+1].style.cursor = 'pointer';
        tbl12.rows[i+1].cells[0].onclick = function(e) { 
            if (!e) e = window.event;
            if (e.altKey) {
                var $requester = $(this).closest("tr").find("td:nth-child(1)")[0].textContent;
                block($requester);
                return false;
            }
            if (e.ctrlKey) {
                var $requester = $(this).closest("tr").find("td:nth-child(1)")[0].textContent;
                greenC($requester);
                return false;
            }
        }
        
        if ($singleNotQualifiedGroupIds.indexOf($singleListy[i]) < 0) {
            
        	tbl12.rows[i+1].cells[1].innerHTML = "<a href='"+ preview_Link + $singleListy[i] + '/tasks?ref=w_pl_prvw' + "' target='_blank' title='"+ $singleTitle[i] +"'>" + $singleTitle[i] + "</a>";  //
            tbl12.rows[i+1].cells[1].onclick = function(e) { 
                if (!e) e = window.event;
                if (e.altKey) {
                    var $title = $(this).closest("tr").find("td:nth-child(2)")[0].textContent;
                    block($title);
                    return false;
                }
                if (e.ctrlKey) {
                    var $title = $(this).closest("tr").find("td:nth-child(2)")[0].textContent;
                    greenC($title);
                    return false;
                }
            }
            tbl12.rows[i+1].cells[2].innerHTML = "<a href='"+ preview_Link + $singleListy[i] +"' target='_blank'>" + $singleHits[i] + "</a>"; 
        	tbl12.rows[i+1].cells[3].innerHTML = "<a href='"+ preview_Link + $singleListy[i] +"' target='_blank'>" + "$" + $singleReward[i] + "</a>";
        	tbl12.rows[i+1].cells[4].innerHTML = "<a href='"+ preview_Link + $singleListy[i] +"' target='_blank'>" + $singleHitTime[i] + "</a>";
            tbl12.rows[i+1].cells[6].innerHTML = "P"; 
            tbl12.rows[i+1].cells[6].onclick = function() { 
                var $item = $(this).closest("tr").find("td:nth-child(2)")[0].innerHTML.replace('<a href="', "").split('" target', 1)[0].replace("?ref=w_pl_prvw", "/accept_random?ref=w_pl_prvw");
                var $requester = $(this).closest("tr").find("td:nth-child(1)")[0].textContent;
                var $title = $(this).closest("tr").find("td:nth-child(2)")[0].textContent;
                
                addPanda($item, $requester, $title);
                addPandaSave($item, $requester, $title, refresh_default_input.value);
            };
            tbl12.rows[i+1].cells[7].innerHTML = "A";
            //singleExportTC[i+1] = "$" + $singleReward[i] + " - " + $singleTitle[i] + " - " + preview_Link + $singleListy[i] + " - " + $singleHitTime[i] + " - Requester: " + $singleRequester[i] + " - Hits Available: " + $singleHits[i];
            singleExportTC[i+1] = preview_Link + $singleListy[i];
            tbl12.rows[i+1].cells[7].onclick = function(e) {
                if (!e) e = window.event;
                if (e.ctrlKey) {
                    var $item = this.parentNode.rowIndex
					GM_setClipboard(singleExportTC[$item]);
                    clickSound.play();
                } else {
                	var $item = $(this).closest("tr").find("td:nth-child(2)")[0].innerHTML.replace('<a href="', "").split('" target', 1)[0].replace("?ref=w_pl_prvw", "/accept_random?ref=w_pl_prvw");
            		acceptFunction($item);
                }
            }
        } else {
            tbl12.rows[i+1].cells[1].innerHTML = "<a href='"+ $singleRequesterLink[i] +"' target='_blank' title='"+ $singleTitle[i] +"'>" + $singleTitle[i] + "</a>"; ; 
            tbl12.rows[i+1].cells[1].onclick = function(e) { 
                if (!e) e = window.event;
                if (e.altKey) {
                    var $title = $(this).closest("tr").find("td:nth-child(2)")[0].textContent;
                    block($title);
                    return false;
                }
                if (e.ctrlKey) {
                    var $title = $(this).closest("tr").find("td:nth-child(2)")[0].textContent;
                    greenC($title);
                    return false;
                }
            }
            tbl12.rows[i+1].cells[2].innerHTML = "<a href='"+ $singleRequesterLink[i] +"' target='_blank'>" + $singleHits[i] + "</a>"; 
        	tbl12.rows[i+1].cells[3].innerHTML = "<a href='"+ $singleRequesterLink[i] +"' target='_blank'>" + $singleReward[i] + "</a>"; ;
        	tbl12.rows[i+1].cells[4].innerHTML = "<a href='"+ $singleRequesterLink[i] +"' target='_blank'>" + $singleHitTime[i] + "</a>"; ;
            tbl12.rows[i+1].cells[6].innerHTML = "N";
            tbl12.rows[i+1].cells[7].innerHTML = "<a href='"+ $singleRequesterLink[i] +"' target='_blank'>" + "N" + "</a>"; ;
        }
        greenCheck($singleRequester[i], $singleTitle[i])
        if (!found) {
            tbl12.rows[i+1].style.backgroundColor = "#66FFFF";
            //checklist2.push($singleRequester[i] + $singleTitle[i])  
        }
        //staleListCheck(checklist2, staleListS);
    }
    linksBlack();
    
	singletoRequesterId = [];
	singletoNotQualifiedGroupIds = [];
	singletoListy = [];
	singletoReward = [];
	singletoAllottedSeconds = [];  
	singleToHits = [];
    singleToRequester = [];
    singleToTitle = [];
    
    //for (i = 0; i < requesterId3.length; i++) { singletoRequesterId[i] = requesterId3[i]; }
    //for (i = 0; i < $singleNotQualifiedGroupIds.length; i++) { singletoNotQualifiedGroupIds[i] = $singleNotQualifiedGroupIds[i]; }
    //for (i = 0; i < $singleListy.length; i++) { singletoListy[i] = $singleListy[i]; }
    //for (i = 0; i < $singleReward.length; i++) { singletoReward[i] = $singleReward[i]; }
    //for (i = 0; i < $singleAllotedSeconds.length; i++) { singletoAllottedSeconds[i] = $singleAllotedSeconds[i]; }
    //for (i = 0; i < $singleHits.length; i++) { singleToHits[i] = $singleHits[i]; } 
    //for (i = 0; i < $singleRequester.length; i++) { singleToRequester[i] = $singleRequester[i]; } 
    //for (i = 0; i < $singleTitle.length; i++) { singleToTitle[i] = $singleTitle[i]; } 
    newestRequest($singleRequesterID, $singleNotQualifiedGroupIds, $singleListy, $singleReward, $singleAllotedSeconds, $singleHits, $singleRequester, $singleTitle);
    
    timerVar3 = time_input3.value;
	timerSwitch3 = setInterval(scrapeTimer3, 1000);
    singleTimerState = true;

    $singleRequester = []; //Clear Data
    $singleRequesterID = [];
	$singleTitle = [];
	$singleHits = [];
	$singleReward = [];
	$singleHitTime = [];
	$singleListy = [];
    $singleRequesterLink = [];
    $singleNotQualifiedGroupIds = [];
    $singleAllotedSeconds = [];
    requesterId3 = [];
}

////GETXML Stuff////
function newestRequest(singletoRequesterId, singletoNotQualifiedGroupIds, singletoListy, singletoReward, singletoAllottedSeconds, singleToHits, singleToRequester, singleToTitle) {
////GET TO DATA////
	GM_xmlhttpRequest ({
        method: "GET",
        url: $singleTOURL,
        onload: function (results) {
            rdata = $.parseJSON(results.responseText);
            var checklist = [];
            for (i = 0; i < singletoRequesterId.length; i++){
                var singletoAverage = [];
                if (rdata[singletoRequesterId[i]]){
                    var sum = 0;
                    var average = 0;
                    var reviews = rdata[singletoRequesterId[i]].reviews;
                    var comm = rdata[singletoRequesterId[i]].attrs.comm;
                    var pay = rdata[singletoRequesterId[i]].attrs.pay;
                    var fair = rdata[singletoRequesterId[i]].attrs.fair;
                    var fast = rdata[singletoRequesterId[i]].attrs.fast;
                    sum = ((pay*10) + (fair*5))/15;
                    sum = sum.toFixed(2);
                    singletoAverage = sum;
                    var tit = 'Comm: ' + comm + '\n' + 'Pay: ' + pay + '\n' + 'Fair: ' + fair + '\n' + 'Fast: ' + fast;
                    tbl12.rows[i+1].cells[5].innerHTML = "<a href='"+ "http://turkopticon.ucsd.edu/reports?id=" + singletoRequesterId[i] +"' target='_blank' title='" + tit + "'>" + singletoAverage + "</a>";
                } else {
                    singletoAverage = -1;
                    tbl12.rows[i+1].cells[5].innerHTML = "no TO";
                }
                if (singletoNotQualifiedGroupIds.indexOf(singletoListy[i]) < 0) {
                    greenCheck(singleToRequester[i], singleToTitle[i])
                    if (!found)
                    	singletoAverage = 5.00
                	if (singletoAverage > 4.39) {
                    	tbl12.rows[i+1].style.backgroundColor = GREEN;
                    	////Auto////
                        if (singletoReward[i] > 9.99) 
                            acceptFunction(previewAccept_Link + singletoListy[i]+'/tasks/accept_random?ref=w_pl_prvw');
                        if (auto_check3 == 1 && Number(singletoReward[i]) >= Number(aa_input.value) && singleToHits[i] < 3) {
                            acceptFunction(previewAccept_Link + singletoListy[i]+'/tasks/accept_random?ref=w_pl_prvw');
                        }
                    }
                    else if (singletoAverage > 3.39)
                        tbl12.rows[i+1].style.backgroundColor = YELLOWGREEN;
                    else if (singletoAverage > 2.39)
                        tbl12.rows[i+1].style.backgroundColor = ORANGE;
                    else if (singletoAverage >= 0) 
                        tbl12.rows[i+1].style.backgroundColor = RED;
                    else {
                        tbl12.rows[i+1].style.backgroundColor = GREY;
                        ////Auto////
                        if (singletoReward[i] > 9.99) 
                            acceptFunction(previewAccept_Link + singletoListy[i]+'/tasks/accept_random?ref=w_pl_prvw');
                    }
                    if (!found) {
                    	tbl12.rows[i+1].style.backgroundColor = "#66FFFF";
                    	checklist.push(singleToRequester[i] + singleToTitle[i])    
                    }
                } else 
                    tbl12.rows[i+1].style.backgroundColor = BROWN; 
            }
            staleListCheck(checklist, staleListS);
            linksBlack();
                    
        }
	});
}

////Save PandA Link////
function addPandaSave(item, requester, title, refresh) {
    pandaHrefList.push(item);
	pandaRequesterList.push(requester);
	pandaTitleList.push(title);
    pandaRefreshList.push(refresh);
    pandaPauseList.push("true");
    
	GM_setValue("panda_href_list", pandaHrefList);
    GM_setValue("panda_requester_list", pandaRequesterList);
    GM_setValue("panda_title_list", pandaTitleList);
    GM_setValue("panda_refresh_list", pandaRefreshList);
    GM_setValue("panda_pause_list", pandaPauseList);
}

////Add To PandA////
function addPanda(item, requester, title, refresh, pause) {
    
    var tr = pandaTbl.insertRow();
	for(var i = 0; i < 5; i++) { 
    	var td = tr.insertCell();
    	td.appendChild(document.createTextNode(''));
    	td.style.border = "1px solid" + CPANELBORDER; 
        td.style.backgroundColor = GREEN2;
    	td.style.fontSize = '10px';
    	td.style.whiteSpace = "nowrap";
    	td.style.overflow = "hidden";
    	td.style.textOverflow = "ellipsis";
		td.align = "center";
    	if (i == 0)
            drawCorner(td, "left 4px");
    	if (i == 4)
    		drawCorner(td, "right 4px");
	}
    
    var $row = pandaTbl.rows.length - 1
    tr.cells[0].innerHTML = "<a href='"+ item +"' target='_blank'>" + requester + "</a>"; 
    tr.cells[1].innerHTML = "<a href='"+ item +"' target='_blank'>" + title + "</a>"; 
    pandaTbl.rows[$row].cells[2].innerHTML = "Seconds: ";
    refresh_input[$row] = document.createElement("INPUT");
	pandaTbl.rows[$row].cells[2].appendChild(refresh_input[$row]);
	refresh_input[$row].style.height = '12px';
	refresh_input[$row].style.width = '20%';
	refresh_input[$row].style.fontSize = '10px';
	refresh_input[$row].style.border = '1px solid ' + CPANELBORDER;
	refresh_input[$row].style.backgroundColor = "white";
	refresh_input[$row].style.color = CPANELINPUTTEXT;
	refresh_input[$row].style.position = "relative";
	refresh_input[$row].style.left = "0px";
    drawCorner(refresh_input[$row], "3px");
    if (refresh)
        refresh_input[$row].value = refresh
    else
    refresh_input[$row].value = refresh_default_input.value;
    
    $(refresh_input[$row]).bind('input', function() { 
        pandaWork();
    });
    
    pandaPause[$row] = "true";
    if (pause)
        pandaPause[$row] = pause;
    if (pandaPause[$row] == "true")
        pandaTbl.rows[$row].cells[3].style.backgroundColor = RED
    
    for (i = 0; i < 5; i++) {
        pandaTbl.rows[$row].cells[i].onclick = function(e) {
            if (!e) e = window.event;
            if (e.shiftKey) {
                e.preventDefault();
                var index = this.parentNode.rowIndex - 1;
                if (index > 0) {
                    pandaHrefList.move(index, index - 1);
                    pandaRequesterList.move(index, index - 1);
                    pandaTitleList.move(index, index - 1);
                    pandaRefreshList.move(index, index - 1);
                    pandaPauseList.move(index, index - 1);
                    savePandas();
                    clearPanda();
                }
            } else if (e.ctrlKey) {
                e.preventDefault();
                var index = this.parentNode.rowIndex - 1;
                if (index < pandaHrefList.length - 1) {
                    pandaHrefList.move(index, index + 1);
                    pandaRequesterList.move(index, index + 1);
                    pandaTitleList.move(index, index + 1);
                    pandaRefreshList.move(index, index + 1);
                    pandaPauseList.move(index, index + 1);
                    savePandas();
                    clearPanda();
                }
            }
            
            if (i = 0) {
                if (e.altKey) {
                    e.preventDefault();
                    var index = this.parentNode.rowIndex - 1;
                    var newName = prompt("Enter new Requester Name", pandaRequesterList[index]);
                    pandaRequesterList[index] = newName;
                    savePandas();
                    clearPanda();
                }
            } else if (i = 1) {
                if (e.altKey) {
                    e.preventDefault();
                    var index = this.parentNode.rowIndex - 1;
                    var newName = prompt("Enter new Title", pandaTitleList[index]);
                    pandaTitleList[index] = newName;
                    savePandas();
                    clearPanda();
                }
            }
        }
    }
    
    pandaTbl.rows[$row].cells[3].innerHTML = "Pause";
    pandaTbl.rows[$row].cells[3].onclick = function() {
        var index = this.parentNode.rowIndex
        if (pandaPause[index] == "false") {
            pandaTbl.rows[index].cells[0].style.backgroundColor = GREEN2;
            pandaTbl.rows[index].cells[1].style.backgroundColor = GREEN2;
            pandaTbl.rows[index].cells[2].style.backgroundColor = GREEN2;
            pandaTbl.rows[index].cells[4].style.backgroundColor = GREEN2;
        	pandaTbl.rows[index].cells[3].style.backgroundColor = RED;
        	pandaPause[index] = "true";
        } else {
            pandaTbl.rows[index].cells[3].style.backgroundColor = GREEN2;
        	pandaPause[index] = "false";
        }
        pandaWork();
    }
    pandaTbl.rows[$row].cells[4].innerHTML = "Remove";
    pandaTbl.rows[$row].cells[4].onclick = function() {
        var index = this.parentNode.rowIndex - 1;
        if (index > -1) {
            undoList.unshift([pandaHrefList[index], pandaRequesterList[index], pandaTitleList[index], pandaRefreshList[index], pandaPauseList[index]]);
            pandaHrefList.splice(index, 1);
            pandaRequesterList.splice(index, 1);
            pandaTitleList.splice(index, 1);
            pandaRefreshList.splice(index, 1);
            pandaPauseList.splice(index, 1);
		}
        savePandas();
        pandaPause = [];
        plinks = [];
        clearPanda();
    }
    pandaTbl.rows[$row].cells[0].style.cursor = 'pointer';
    pandaTbl.rows[$row].cells[1].style.cursor = 'pointer';
    pandaTbl.rows[$row].cells[2].style.cursor = 'default';
    pandaTbl.rows[$row].cells[3].style.cursor = 'pointer';
    pandaTbl.rows[$row].cells[4].style.cursor = 'pointer';
    linksBlack();
}

function savePandas() {
    GM_setValue("panda_href_list", pandaHrefList);
    GM_setValue("panda_requester_list", pandaRequesterList);
    GM_setValue("panda_title_list", pandaTitleList);
    GM_setValue("panda_refresh_list", pandaRefreshList);
    GM_setValue("panda_pause_list", pandaPauseList);
}

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    //return this; // for testing purposes
};

function tableWidth(name, percents) {
    for (i = 0; i < percents.length; i++) { name.rows[0].cells[i].width = percents[i] };
}

function removeDupe(list) {
    var uniq = list.reduce(function(a,b){
    if (a.indexOf(b) < 0 ) a.push(b);
        return a;
  	},[]);
    
    return list;
}

////PandA Timer////
function pandaTimer() {
    pandaCellsTbl.rows[0].cells[2].innerHTML = "Running" + pDots;
    pDots += ".";
    if (pDots.length == 4)
        pDots = "."
        
    pandaSeconds++
    if (pandaSeconds > 300)
        pandaSeconds = 0
    
    for (i = 1; i < pandaTbl.rows.length; i++) {
        if (pandaPause[i] == "false") {
        	if ((pandaSeconds / refresh_input[i].value) % 1 == 0) {
            	acceptFunction(pandaHrefList[i - 1]);
            	pandaTbl.rows[i].cells[0].style.backgroundColor = GREEN3;
                pandaTbl.rows[i].cells[1].style.backgroundColor = GREEN3;
                pandaTbl.rows[i].cells[2].style.backgroundColor = GREEN3;
                pandaTbl.rows[i].cells[3].style.backgroundColor = GREEN3;
                pandaTbl.rows[i].cells[4].style.backgroundColor = GREEN3;
        	} else {
            	pandaTbl.rows[i].cells[0].style.backgroundColor = GREEN2;
                pandaTbl.rows[i].cells[1].style.backgroundColor = GREEN2;
                pandaTbl.rows[i].cells[2].style.backgroundColor = GREEN2;
                pandaTbl.rows[i].cells[3].style.backgroundColor = GREEN2;
                pandaTbl.rows[i].cells[4].style.backgroundColor = GREEN2;
        	}
        }
    }
}

////Queue Scrape////
function queueScrape() {
    
    ////Clears The Table////
    var lastRow = tbl7.rows.length - 1; 
    for (i = lastRow; i>-1; i--)
        tbl7.deleteRow(i);
    
    ////Builds Table////
	for(var i = 0; i < $finalqueuerequester.length + 1; i++) {
		var tr = tbl7.insertRow();
		tbl7.rows[i].style.backgroundColor = GREY;
		for(var j = 0; j < 5; j++) {
			var td = tr.insertCell();
			td.appendChild(document.createTextNode(''));
			td.style.border = "1px solid" + QUEUEBORDER; 
            td.style.fontSize = '10px';
            td.style.whiteSpace = "nowrap";
            td.style.overflow = "hidden";
            td.style.textOverflow = "ellipsis";
			td.align = "center";
            if (j == 0)
                drawCorner(td, "left 4px");
            if (j == 4)
                drawCorner(td, "right 4px");
		}
	}
	
    var percents = ["16%","43%","8%","20%","10%"];
    tableWidth(tbl7, percents);
    
    ////Label Header////
	for(var i = 0; i < 5; i++) {
        tbl7.rows[0].cells[i].innerHTML = "<b>" + queueHeader[i] + "</b>"; 
    	tbl7.rows[0].cells[i].style.fontSize = '11px';
        tbl7.rows[0].cells[i].style.border = "1px solid " + CPANELBACKGROUNDBORDER;
    } 
	
    tbl7.rows[0].style.cursor = 'default';
    tbl7.rows[0].style.backgroundColor = CPANELBACKGROUND; //Color Header
	tbl7.rows[0].style.color = "white"; //Color Header Text
    
    ////Fill Table////
    for (var i = 0; i < $finalqueuerequester.length; i++) {
        tbl7.rows[i+1].style.cursor = 'pointer';
        tbl7.rows[i+1].cells[0].innerHTML = "<a href='"+ $finalcontinuelink[i] +"' target='_blank' title='"+ $finalqueuerequester[i] +"'>" + $finalqueuerequester[i] + "</a>"; 
        tbl7.rows[i+1].cells[1].innerHTML = "<a href='"+ $finalcontinuelink[i] +"' target='_blank' title='"+ $finalqueuetitle[i] +"'>" + $finalqueuetitle[i] + "</a>"; 
        tbl7.rows[i+1].cells[2].innerHTML = "<a href='"+ $finalcontinuelink[i] +"' target='_blank'>" + "$" + $finalqueuereward[i] + "</a>"; 
        tbl7.rows[i+1].cells[3].innerHTML = "<a href='"+ $finalcontinuelink[i] +"' target='_blank'>" + $finalhitQueueTime[i] + "</a>";
//        tbl7.rows[i+1].cells[4].innerHTML = "<a href='"+ returnLink + $finalcontinuelink[i].split('id=')[1].split('?ass')[0] +"' target='_blank'>" +  "Return" + "</a>";
        tbl7.rows[i+1].cells[4].innerHTML = "Return";
        var qlink = $finalcontinuelink[i].split('id=')[1].split('?ass')[0];
        tbl7.rows[i+1].cells[4].onclick = function(qlink) {
            var $item = $(this).closest("tr").find("td:nth-child(2)")[0].innerHTML.replace('<a href="', "") + '?goatreturn';
            var returnWindow = window.open($item);
            setTimeout(function(){ returnWindow.close(); }, 800);

            var rowIndex = $(this).closest('tr').prevAll().length;
            tbl7.deleteRow(rowIndex);
//                acceptFunction($item);
            };
        //tbl7.rows[i+1].cells[5].innerHTML = "<a href='"+ $finalcontact[i] +"' target='_blank'>" + "Contact" + "</a>";
        
        if ($finalqueuereward[i] > 4.99)
            tbl7.rows[i+1].style.backgroundColor = GREEN5;
        else if ($finalqueuereward[i] > 1.99)
            tbl7.rows[i+1].style.backgroundColor = GREEN4;
        else if ($finalqueuereward[i] > 0.99)
        	tbl7.rows[i+1].style.backgroundColor = GREEN3;
        else if ($finalqueuereward[i] > 0.49)
            tbl7.rows[i+1].style.backgroundColor = GREEN2;
        else    
            tbl7.rows[i+1].style.backgroundColor = GREEN1;
    }
    
    tbl7.rows[0].cells[1].innerHTML = "<b>" + queueHeader[1] + " - HITs: " + qcount + "</b>";
    $("title").text("GOAT Scraper - HITs: " + qcount);
    linksBlack();
    
	timerVar2 = time_input2.value;
	timerSwitch2 = setInterval(queueTimer, 1000);
    queueTimerState = true;
	//tbl6.rows[1].cells[2].innerHTML = "";
    
    $finalqueuetitle = [];
	$finalqueuerequester = [];
	$finalqueuereward = [];
	$finalhitQueueTime = [];
	$finalhitQueueDate = [];
	$finalcontact = [];
	$finalreturnlink = [];
	$finalcontinuelink = [];
    queueTimerState = true;
    $queueSrc = "https://worker.mturk.com/tasks";
}

////Is It A Leap Year////
function leapCheck(year) {
    var isLeap = new Date(year, 1, 29).getMonth() == 1;
	
    if (isLeap)
        monthDayCount = [31,29,31,30,31,30,31,31,30,31,30,31]; //Days in each month
    else
        monthDayCount = [31,28,31,30,31,30,31,31,30,31,30,31]; //Days in each month
}

////Calculate Mturk Date////
function calculateMturkDate() {
	d = new Date();
	var universalTime = d.getUTCHours();
    month = d.getUTCMonth();
    day = d.getUTCDate();
    year = d.getUTCFullYear();
    weekDay = d.getUTCDay();
    mturkTime = universalTime - 7
    //if (month > 1 && day > 6 && (universalTime - 7) > 1)
    //    mturkTime = universalTime - 7;
    //if (month > 9 && day > 0 && (universalTime - 8) > 1)
    //    mturkTime = universalTime - 8;
    
	leapCheck(year);
    if (mturkTime < 0) {
        day--;
        if (day < 1) {
            month--
            if (month < 0) {
                month = 11;
                year--
            }
            day = monthDayCount[month] + day
        }
        
        weekDay--;
        if (weekDay < 0)
            weekDay = 6;
    }
    if (day < 10)
        day = 0 + "" + day
        
}

////Clear Weekly Detection////
function clearWeekly() {
	calculateMturkDate()
	var lastMonth = month - 1;
    if (lastMonth < 0 ) {
        lastMonth = 11;
	    lastMonth = monthDayCount[lastMonth];
    } else 
	    lastMonth = monthDayCount[lastMonth];
    
	month = month + 1;
    
	if (month < 10)
	    month = 0 + "" + month;
    
	var checkDate;
    
    if ((day - weekDay) > 0) {
	    var tday = day - weekDay;
    
    	if (tday < 10)
    		tday = 0 + "" + tday;
        
   		 checkDate = month + "" + tday + "" + year;
    } else {
		if (month == 1) {
    		month = 12;
    	    year--
    	} else
            month = 0 + "" + (month - 1);
    	var cWeekDay = day - weekDay;
    	checkDate = month + "" + (lastMonth + cWeekDay) + "" + year;
	}
    
    if (weeklyProjectedEndSaved != checkDate) {
        weeklyProjectedSaved = "0.00";
        GM_setValue("weekly_projected_save", "0.00");
        GM_setValue("weekly_projected_list", "Today: $0.00");
        GM_setValue("weekly_projected_end", checkDate);
	}
}

////Grabs Todays Page Total//// DISCARD? - Use to calculate submitted
function todaysGrabPages() {
	$.get($todaysSrc, function(data) {
        $todaysPagesData = $(data);
    		var maxpagerate = $todaysPagesData.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
    			if (maxpagerate.length == 0) {
            		$todaysPages = $todaysPagesData.find('a[href^="/mturk/statusdetail"]:contains("Last")');
            		$todaysPages = ($todaysPages.length != 0) ? $todaysPages.attr("href") : "";
            		$todaysPages = $todaysPages.replace("/mturk/statusdetail?sortType=All&pageNumber=", "");
            		$todaysPages = $todaysPages.replace("&encodedDate=" + theDate, "");
            		todaysGrabData();
    	} else {
        	setTimeout(function(){todaysGrabPages();}, 3000);
    	}
	});
}

////Grab Todays Data////
function todaysGrabData() {
	$.get($todaysSrc, function(data) {
        $todaysData = $(data);
    	var maxpagerate = $todaysData.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
    	if (maxpagerate.length == 0) {
            $todaysSrc = $todaysData.find('a[href^="/mturk/statusdetail"]:contains("Next")');
            $todaysSrc = ($todaysSrc.length != 0) ? $todaysSrc.attr("href") : "";
            $todaysPages--;
            filterTodaysData($todaysData);
    	} else {
        	setTimeout(function(){todaysGrabData();}, 3000);
    	}
	});
}

////Grab Weekly Data////
function weeklyGrabData() {
	$.get($weeklySrc, function(data) {
        $weeklyData = $(data);
    	var maxpagerate = $weeklyData.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
    	if (maxpagerate.length == 0)
    	{
            $weeklySrc = $weeklyData.find('a[href^="/mturk/statusdetail"]:contains("Next")');
            $weeklySrc = ($weeklySrc.length != 0) ? $weeklySrc.attr("href") : "";
            filterWeeklyData($weeklyData);
    	} else {
        	setTimeout(function(){weeklyGrabData();}, 3000);
    	}
	});
}

////Filter Todays Data////
function filterTodaysData($todaysData) {
    var $reward = [];
    var $status = [];
    
    $reward = $todaysData.find('span[class="reward"]'); 
    for (i = 0; i < $reward.length; i++) $reward[i] = $reward[i].textContent;
    for (i = 0; i < $reward.length; i++) $reward[i] = $reward[i].replace("$", "");
    for (i = 0; i < $reward.length; i++) $reward[i] = Number($reward[i]);
    
    $status = $todaysData.find('td[class="statusdetailStatusColumnValue"]');
    for (i = 0; i < $status.length; i++) $status[i] = $status[i].textContent;
    for (i = $status.length - 1; i >= 0; i--) {
        if ($status[i] == "Rejected") 
            $reward.splice(i, 1);
    }
    
    for (var i = 0; i < $reward.length; i++) $todaysReward.push($reward[i]);
    
    
            
    
    dashTbl.rows[0].cells[0].innerHTML = "Today's Projected Earnings: Calculating" + $todaysCounter;
    $todaysCounter = $todaysCounter + ".";
    	if ($todaysCounter.length > 3)
        	$todaysCounter = ".";
                
    if ($todaysSrc != 0)
        todaysGrabData()
    else
        addTodaysRewards()
}

////Filter Weekly Data////
function filterWeeklyData($weeklyData) {
    var $reward = [];
    var $status = [];
    var total = 0;
    
    $reward = $weeklyData.find('span[class="reward"]');
    for (i = 0; i < $reward.length; i++) $reward[i] = $reward[i].textContent;
    for (i = 0; i < $reward.length; i++) $reward[i] = $reward[i].replace("$", "");
    for (i = 0; i < $reward.length; i++) $reward[i] = Number($reward[i]);
    
    $status = $weeklyData.find('td[class="statusdetailStatusColumnValue"]');
    for (i = 0; i < $status.length; i++) $status[i] = $status[i].textContent;
    for (i = $status.length - 1; i >= 0; i--) {
        if ($status[i] == "Rejected") 
            $reward.splice(i, 1);
    }
    
    for (var i = 0; i < $reward.length; i++) $weeklyReward.push($reward[i]);
    
    dashTbl.rows[0].cells[1].innerHTML = "Weekly Projected Earnings: " + rDay[weekDay] + $weeklyCounter;
    $weeklyCounter = $weeklyCounter + ".";
    	if ($weeklyCounter.length > 3)
        	$weeklyCounter = ".";
                
    if ($weeklySrc != 0)
        weeklyGrabData();
    else {
        $.each($weeklyReward,function() {
    		total += this;
		});
        
    	wdTotal[weekDay] = total;
        
    	total = total.toFixed(2);
        $weeklyReward = [];
        
        weekDay--
        
        var tList = wList.split("\n"); //  
        tList = tList.length - 1;
        if (weekDay >= 0 && weekDay >= tList) {
            $weeklySrc = statusLink + weekDates[weekDay];
            weeklyGrabData();
        } else {
            tList = wList.split("\n");
            for (i=0;i<tList.length-1; i++) {
                tList[i] = tList[i].replace("Sunday: $","").replace("Monday: $","").replace("Tuesday: $","").replace("Wednesday: $","").replace("Thursday: $","").replace("Friday: $","")
                tList[i] = Number(tList[i])
                wdTotal[i] = tList[i];
            }
        	addWeeklyRewards();
        }
    }
}

////Add Up Todays Rewards//// 
function addTodaysRewards() {
    var total = 0;
    
	$.each($todaysReward,function() {
    	total += this;
	});
    total = total.toFixed(2);
    
    dashTbl.rows[0].cells[0].innerHTML = "Today's Projected Earnings: $" + total;
    GM_setValue("todays_projected_save", total);
    GM_setValue("the_date", theDate);
    
    $todaysReward = [];
    todayEnabled = false;
}

////Add Up Weekly Rewards////
function addWeeklyRewards() {
    var total = 0;
    
	$.each(wdTotal,function() {
    	total += this;
	});
    total = total.toFixed(2);
    
    for (var i = 0; i < wdTotal.length; i++) {
        wdTotal[i] = wdTotal[i].toFixed(2);
        if (i == wdTotal.length - 1) {
            dashTbl.rows[0].cells[0].innerHTML = "Today's Projected Earnings: $" + wdTotal[i];
            GM_setValue("todays_projected_save", wdTotal[i]);
            wTotal[i] = "Today: $" + wdTotal[i];
        } else 
        	wTotal[i] = rDay[i] + ": $" + wdTotal[i];
    }
    
    wList = wTotal.join("\n");
    dashTbl.rows[0].cells[1].innerHTML = "<b title='" + wList + "'>" + "Weekly Projected Earnings: $" + total + "</b>";
    GM_setValue("weekly_projected_list", wList);
    GM_setValue("weekly_projected_save", total);
    calculateMturkDate()
        month = month + 1;
        if (month < 10)
            month = 0 + "" + month
        theDate = month + "" + day + "" + year;
    GM_setValue("the_date", theDate);
    $weeklyReward = [];
    weeklyEnabled = false;    
}

function grabTodaySubmittedData() {
	$.get($SubmittedSrc, function(data) {
    	$todaySubmittedData = $(data);
    	var maxpagerate = $todaySubmittedData.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
    	if (maxpagerate.length == 0) {
            filterTodaySubmittedData($todaySubmittedData);
    	} else {
        	setTimeout(function(){grabTodaySubmittedData();}, 3000);
    	}
	});
}

function filterTodaySubmittedData($todaySubmittedData) {
    //var $date = $todaySubmittedData.find('td[class="statusDateColumnValue"]');
    //var $submitted = $todaySubmittedData.find('td[class="statusSubmittedColumnValue"]');
    //$date[0] = $date[0].textContent;
    //$date[0] = $date[0].trim();
    //$submitted[0] = $submitted[0].textContent;
    //if ($date[0] == "Today")
    //    dashTbl.rows[0].cells[2].innerHTML = "Today's Submitted: " + $submitted[0];
    //else
    //    dashTbl.rows[0].cells[2].innerHTML = "Today's Submitted: 0";
    var $date = $todaySubmittedData.find('td[class="hidden-xs-down col-sm-2 col-md-2"]');
    var $submitted = $todaySubmittedData.find('td[class="text-xs-right col-xs-3 col-sm-2 col-md-2"]');
     $date[0] = $date[0].textContent;
    $date[0] = $date[0].trim();
    $submitted[0] = $submitted[0].textContent;
    if ($date[0] == "Today")
        dashTbl.rows[0].cells[2].innerHTML = "Today's Submitted: " + $submitted[0];
    else
        dashTbl.rows[0].cells[2].innerHTML = "Today's Submitted: 0";
}

////Get Earnings Available For////
function grabEarnings() {
	$.get($earningsSrc, function(data) {
    	$earningsData = $(data);
    	var maxpagerate = $earningsData.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
    	if (maxpagerate.length == 0) {
            var $reward = $earningsData.find('div[class="col-xs-5 col-sm-6 col-lg-5 text-xs-right"]');
            dashTbl.rows[0].cells[3].innerHTML = "Earnings Available For Transfer: " + $reward[0].textContent;
    	} else {
        	setTimeout(function(){grabEarnings();}, 3000);
    	}
	});
}

////Get Hybrid Pay////
function getHPay() {
	GM_xmlhttpRequest //GET TO DATA
	({
    	method: "GET",
        url: 'http://www.gethybrid.io/workers/payments',
        onload: function (results)
        	{
                var data = $(results.responseText);
                var earnings = data.find('input[type="submit"]');
                if (earnings.length)
                    earnings = earnings.val().replace('Get paid', '');
                else if (data.find('p:contains("Because of corrections")').text().length)
                    earnings = data.find('p:contains("Because of corrections")').text().replace('Because of corrections you have a negative balance of ','').replace(', complete more tasks to make it positive.','');
                else    
                    earnings = '$0.00';
        
                hybridIntr.rows[0].cells[2].innerHTML = 'Balance: ' + earnings;
            }
    });
}


////Make All Links Black////
function linksBlack() {
	$('a').css('color', '#000000'); //MAKE LINKS BLACK;
	$('a').css('textDecoration','none');
}

////Accept Hit////
function acceptFunction($acceptSrc) {
    //$acceptSrc = $acceptSrc.replace(/amp;/g, '');
    $.get($acceptSrc, function(data) {
        $acceptData = $(data);
        var maxpagerate = $acceptData.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
        if (maxpagerate.length != 0)
            setTimeout(function(){acceptFunction($acceptSrc);}, 2000);
        
        var captcha = $acceptData.find('input[name="userCaptchaResponse"]');
        if (captcha.length > 0) {
            captchaTbl.rows[0].cells[0].innerHTML = "Captcha Alert";
            $(captchaDiv).show();
        }
	});
}

////Draw Corners////
function drawCorner(i,r) {
    var is_chrome = !!window.chrome
    if (is_chrome)
        $(i).corner(r);
}

////Close Captcha Alert////
function closeCaptcha() {
    $(captchaDiv).hide();
}

////Export Csv////
var link = document.createElement("a");
function exportPanda() {
    var data = [['href', 'requester', 'title', 'refresh', 'pause']];
    for (var i = 0, length = pandaHrefList.length; i<length; i++) {
        data.push([pandaHrefList[i], pandaRequesterList[i], pandaTitleList[i], pandaRefreshList[i], pandaPauseList[i]]);
    }

    var csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(function(infoArray, index){
       dataString = infoArray.join(",");
       csvContent += index < data.length ? dataString+ "\n" : dataString;
    }); 

    var encodedUri = encodeURI(csvContent);
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "PandA_List.csv");

    link.click();
}

var imp = document.createElement('BUTTON');
imp.innerHTML = 'Import';
imp.style.cursor = 'pointer';
imp.style.fontSize = '11px';
imp.style.height = '18px';
imp.style.position = "relative";
imp.onclick = function() {
    $('#filename').trigger('click');
};
pandaInnerTbl.appendChild(imp);

var limp = document.createElement('INPUT');
limp.type = 'file';
limp.name = 'filename';
limp.id = 'filename';
limp.style.position = "relative";
$(limp).hide();
pandaInnerTbl.appendChild(limp);

var exp = document.createElement('BUTTON');
exp.innerHTML = 'Export';
exp.style.cursor = 'pointer';
exp.style.fontSize = '11px';
exp.style.height = '18px';
exp.style.position = "relative";
exp.onclick = function() {
    exportPanda();
};

pandaInnerTbl.appendChild(exp);

var btn = document.createElement('BUTTON');
btn.innerHTML = 'Undo';
btn.style.cursor = 'pointer';
btn.style.fontSize = '11px';
btn.style.height = '18px';
btn.style.position = "relative";
btn.onclick = function() {
    undoPanda();
};
pandaInnerTbl.appendChild(btn);

////Undo Panda////
function undoPanda() {
    if (undoList.length) {
        addPanda(undoList[0][0], undoList[0][1],undoList[0][2],undoList[0][3],undoList[0][4]);
        pandaHrefList.push(undoList[0][0]);
        pandaRequesterList.push(undoList[0][1]);
        pandaTitleList.push(undoList[0][2]);
        pandaRefreshList.push(undoList[0][3]);
        pandaPauseList.push(undoList[0][4]);
        savePandas();
        undoList.splice(0,1);
    }
}
////Import Panda////
$("#filename").change(function(e) {
    var ext = $("input#filename").val().split(".").pop().toLowerCase();

    if($.inArray(ext, ["csv"]) == -1) {
        alert('Upload CSV');
        return false;
    }
    
    if (e.target.files != undefined) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var csvval=e.target.result.split("\n");
            var inputrad=[];
            for (var j=0, length=csvval.length; j<length; j++) {
                var temp=[];
                var csvvalue=csvval[j].split(",");
                for(var i=0;i<csvvalue.length;i++) {
                    temp[i]=csvvalue[i];
                }
                inputrad.push(temp);
            }
            if (inputrad[0][0] == 'href' && inputrad[0][1] == 'requester') {
                pandaHrefList = [], pandaRequesterList = [], pandaTitleList = [], pandaRefreshList = [], pandaPauseList = [];
                for (var i=1, length=inputrad.length-1; i<length; i++) {
                    pandaHrefList.push(inputrad[i][0]);
                    pandaRequesterList.push(inputrad[i][1]);
                    pandaTitleList.push(inputrad[i][2]);
                    pandaRefreshList.push(inputrad[i][3]);
                    pandaPauseList.push(inputrad[i][4]);
                }
                savePandas();
                clearPanda();
            }
        };
        reader.readAsText(e.target.files.item(0));
    }    
    return false;
});

////Import Blocklist////
$("#blockfilename").change(function(e) {
    var ext = $("input#blockfilename").val().split(".").pop().toLowerCase();

    if($.inArray(ext, ["csv"]) == -1) {
        alert('Upload CSV');
        return false;
    }
    
    if (e.target.files != undefined) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#batch_block_text").val(e.target.result);
        };
        reader.readAsText(e.target.files.item(0));
    }    
    return false;
});

////Import Greenlist////
$("#greenfilename").change(function(e) {
    var ext = $("input#greenfilename").val().split(".").pop().toLowerCase();

    if($.inArray(ext, ["csv"]) == -1) {
        alert('Upload CSV');
        return false;
    }
    
    if (e.target.files != undefined) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#green_text").val(e.target.result);
        };
        reader.readAsText(e.target.files.item(0));
    }    
    return false;
});

////Import Premolist////
$("#premofilename").change(function(e) {
    var ext = $("input#premofilename").val().split(".").pop().toLowerCase();

    if($.inArray(ext, ["csv"]) == -1) {
        alert('Upload CSV');
        return false;
    }
    
    if (e.target.files != undefined) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#premo_text").val(e.target.result);
        };
        reader.readAsText(e.target.files.item(0));
    }    
    return false;
});

////Export Blocklist////
function exportBlocklist() {
    var data = "data:text/csv;charset=utf-8," + $("#batch_block_text").val();
    var encodedUri = encodeURI(data);
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Blocklist.csv");

    link.click();
}

////Export Greenlist////
function exportGreenlist() {
    var data = "data:text/csv;charset=utf-8," + $("#green_text").val();
    var encodedUri = encodeURI(data);
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Greenlist.csv");

    link.click();
}

////Export Premolist////
function exportPremolist() {
    var data = "data:text/csv;charset=utf-8," + $("#premo_text").val();
    var encodedUri = encodeURI(data);
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Premolist.csv");

    link.click();
}
}