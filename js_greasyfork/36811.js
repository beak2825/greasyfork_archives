// ==UserScript==
// @name        Panda Crazy
// @version     0.5.11
// @description Collects panda's for you 12-28-2017 updated version
// @author      (JohnnyRS on mturkcrowd.com and mturkgrind.com) johnnyrs@allbyjohn.com
// @include     http*://www.mturk.com/mturk/welcome?pandacrazy=on*
// @include     http*://www.mturk.com/?pandacrazy=on*
// @include     http*://worker.mturk.com/?filters[search_term]=pandacrazy=on*
// @include     http*://worker.mturk.com/requesters/PandaCrazy/projects*
// @include     http*://worker.mturk.com/?end_signin=1&filters%5Bsearch_term%5D=pandacrazy%3Don*
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @require     http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.8.0/jquery.modal.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-layout/1.3.0-rc-30.79/jquery.layout.min.js
// @resource    jQueryUICSS          http://code.jquery.com/ui/1.11.4/themes/pepper-grinder/jquery-ui.css
// @resource    jQueryModalCSS       https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.8.0/jquery.modal.min.css
// @resource    jQueryLayoutCSS      https://cdnjs.cloudflare.com/ajax/libs/jquery-layout/1.3.0-rc-30.79/layout-default.css
// @connect     allbyjohn.com
// @connect     mturk.com
// @connect     tiny.cc
// @connect     ibotta.com
// @connect     ns4t.net
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant 		GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_setClipboard
// @namespace   https://greasyfork.org/en/users/155391
// @downloadURL https://update.greasyfork.org/scripts/36811/Panda%20Crazy.user.js
// @updateURL https://update.greasyfork.org/scripts/36811/Panda%20Crazy.meta.js
// ==/UserScript==

var gScriptVersion = "0.5.11";
var gScriptName = "pandacrazy";
var gDatabaseVersion = "JRAPR16-1.1-1.1.1"; // JR[Date]-[requesters DB Reset].[Alarms DB reset]-[requesters DB Version].[Options DB Version].[Tabs DB Version]
var gLocation = window.location.href, gLastQueueCheck = null, gNumId=0, gQueueCheckinProgress=false, queueDelay=[], gNotifications = true, gExtInterval = null;
var gSlowDownAuto = true, gDelayedSave = false, gScriptStatus = "normal", gFullQueue = false, gFullQueueTimer = null, gTemplateHitCell = null, gNewSite = false;
var gSavedSearchArea = "", gSavedAddUrl = "", gMyLayout = null, gAcceptedLogTab = null, gStatusLogTab = null, gQueueWatchTab = null, gTemplateHitRow = null;
var gQueueHelperVersion = "", gQueueHelperFormat2 = false, gSendQueue=false, gMturkDate = "", gJRPOP = null;
var gMainData = {"hitCollection":{},"displayInfo":"1","accepted":0,"skipped":0,"errors":0,"searched":0,"noHits":0,"fullQueue":0,"orphan":0,"tooFast":0,"tooFastHam":0,"tooFastNormal":0,
                 "savedCycleNum":1,"hitsInQueue":0,"queueStatus":null,"notQual":0,"lastElapsed":0,"jobs":0,"payCounter":0.00,"totalEarnings":0.00,"projectedEarnings":0.00,
				 "missed":0,"captchaCounter":0};
var gMainMenu = [{"name":"Main","theobject":null}], gNewOldSite = false, gRapidSuppress = {"jobNumber":-1,"counter":0};
var gHitBgColor="#AFEEEE", gFilteredHitBgColor="#D1E5E5", gSearchesHitBgColor="#AED2D2", gButtonOffBgColor="#FFFFF0", gButtonOnBgColor="#008000";
var gButtonDelayHamBgColor="#00A3CC", gButtonDisabledBgColor="#D3D3D3", gHitMutedColor="#8B4513", gBlockedBgColor="#3D3D3D";
var gTitleColor="#000080", gButtonOffColor="black", gButtonOnColor="white", gButtonDisabledColor="#808080", gNotQualedBgColor="#DDA0DD", gBlockedColor = "#FFF5EE";
var gHitMutedBorderStyle="dotted", gHitBorderStyle="solid", gHitTextColor="#000000", gHitShortIdColor = "#551A8B";
var gZingOptions = {
    "0.01":{"SearchGroupAllowed":1,"TallyCountTotalAllowed":0,"MaxProductsSearch":0,"AcceptCodesSearching":false,"MaxReceiptImages":3},
    "0.03":{"SearchGroupAllowed":2,"TallyCountTotalAllowed":0,"MaxProductsSearch":2,"AcceptCodesSearching":true,"MaxReceiptImages":3},
    "0.05":{"SearchGroupAllowed":3,"TallyCountTotalAllowed":0,"MaxProductsSearch":4,"AcceptCodesSearching":true,"MaxReceiptImages":4},
    "0.07":{"SearchGroupAllowed":7,"TallyCountTotalAllowed":0,"MaxProductsSearch":5,"AcceptCodesSearching":true,"MaxReceiptImages":8}
};
var gZingFuncOptions = {
    "1":{"filterName":"Parse Zing Hit Page","functionName":parseZingHitPage}
};
var gAlarmSounds = {
    "less2":{"nameVar":"JR_PANDA_Soundless2","default":"http://tiny.cc/c6c1ay","audio":null,"desc":"Hits paying less than |: ","payRate":"0.02","lessMinutes":"99","base64":null,"mute":false,"tts":false},
    "less2Short":{"nameVar":"JR_PANDA_Soundless2Short","default":"http://tiny.cc/kyh1ay","audio":null,"desc":"Hits paying less than | with a short timer less than | minute(s): ","payRate":"0.02","lessMinutes":"2","base64":null,"mute":false,"tts":false},
    "less5":{"nameVar":"JR_PANDA_Soundless5","default":"http://tiny.cc/g7h1ay","audio":null,"desc":"Hits paying less than |: ","payRate":"0.05","lessMinutes":"99","base64":null,"mute":false,"tts":false},
    "less5Short":{"nameVar":"JR_PANDA_Soundless5Short","default":"http://tiny.cc/99h1ay","audio":null,"desc":"Hits paying less than | with a short timer less than | minute(s): ","payRate":"0.05","lessMinutes":"5","base64":null,"mute":false,"tts":false},
    "less15":{"nameVar":"JR_PANDA_Soundless15","default":"http://tiny.cc/qai1ay","audio":null,"desc":"Hits paying less than |: ","payRate":"0.15","lessMinutes":"99","base64":null,"mute":false,"tts":false},
    "less15Short":{"nameVar":"JR_PANDA_Soundless15Short","default":"http://tiny.cc/uai1ay","audio":null,"desc":"Hits paying less than | with a short timer less than | minute(s): ","payRate":"0.15","lessMinutes":"8","base64":null,"mute":false,"tts":false},
    "less99":{"nameVar":"JR_PANDA_Soundless99","default":"http://tiny.cc/gbi1ay","audio":null,"desc":"Hits paying MORE than |: ","payRate":"0.15","lessMinutes":"99","base64":null,"mute":false,"tts":false},
    "fullQueue":{"nameVar":"JR_PANDA_FullQueue","default":"http://tiny.cc/wietby","audio":null,"desc":"You have a full queue!","payRate":"","lessMinutes":"99","base64":null,"mute":false,"tts":false},
    "queueAlert":{"nameVar":"JR_PANDA_QueueAlert","default":"http://tiny.cc/cnxyby","audio":null,"desc":"Lowest timed hit in queue is less than || minutes.","payRate":"","lessMinutes":"4","base64":null,"mute":false,"tts":false},
    "hasToPause":{"nameVar":"JR_PANDA_hasToPause","default":"http://tiny.cc/w823by","audio":null,"desc":"Logged out or captcha alarm!","payRate":"","lessMinutes":"99","base64":null,"mute":false,"tts":false},
};
var su = ["speechObjects"]; //we need a container for out TTS objects, so when we have multiple names show up on the same interval each get's it's own place in the array
var gSoundOptions = null, gSoundFile = null, gTabIndex = 0, gMouseDownTimeoutId = null, gPressAndHold = false, gQueueData = [], gQueueCount = {};
var gMuteQueueWatch = false, gGroupings = {}, gGroupingsSort = [], gAlarmObject = null;
var gGroupingData = {"JR First":{"theNumber":"0","description":"First grouping by default.","grouping":[],"delayed":[]}};
var gDefaultGroupingData = {"JR First":{"theNumber":"0","description":"First grouping by default.","grouping":[],"delayed":[]}};
var gTabsInfo = {}, gTabsData = [], gMainOptions = {}, gExternalData = {};
var gSearchOptionsData = {"filterInclude":"","filterExclude":"",pay:"0","payHigher":true,"toCheck":3,"remember":false};
var gDefaultExternalData = {"url":"url","numId":null,"mode":null,"sentPing":false,"gotPong":true,"timeCount":0,"extName":"","extVersion":""};
var gDefaultSoundOptions = {"payRate":"","lessMinutes":"","base64":null,"mute":false,"tts":false};
var gDefaultSearchOptions = {"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"};
var gDefaultTabsInfo = {"nextTabNumber":"4","tabCount":"3"};
var gDefaultTabsData = [{"tabName":"Main","tabNumber":"1","positions":null},{"tabName":"Daily Hits","tabNumber":"2","positions":null},{"tabName":"Rare Hits","tabNumber":"3","positions":null}];
var gDefaultMainOptions = {"cycleNumber":980,"HamCycleNumber":900,"autoSlowDown":true,"cycleAutoIncrease":10,"alarmVolume":80,"cycleIncrease":10,"cycleDecrease":10,"cycleAdding":650,
		"queueTimer":40000,"hamDelayTimer":15,"showHelpTooltips":true,"cycleNumber2":1400,"cycleNumber3":2100,"disableCaptchaAlert":false,"disableQueueAlert":false,
		"disableNotifications":false,"debugger":0,"captchaCountText":true,"captchaAt":35,"fastPantha":false,"showAlertNotify":true,"fastSearch":false,"stopAutoSlow":false};
var gRequestersData = {}, gRequestersKeys = [];
var gJobDataDefault = {"requesterName":"","requesterId":"","groupId":"","pay":"","title":"","duration":"0","hitsAvailable":0,"timeLeft":"","totalSeconds":0,"hitId":"","qual":"",
		"continueURL":"","returnURL":"","durationParsed":{},"jobNumber":"-1","friendlyRName":"","friendlyTitle":"","assignedOn":"","description":"","keywords":"","timeData":{}};
var gDefaultRequestersData = {
    "0":{"requesterName":gDatabaseVersion,"requesterId":28,"action":gScriptVersion,"groupId":"","pay":"","qual":"","title":"","queueLimit":0,"duration":"0","audioforce":"","dailyLimit":0,"mute":false,"position":null,"tabNumber":"1","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":0,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[]},"theHistory":{},"excludeGID":[],"maxReward":"0.00"},"dateAdded":null,"stickyDelayedHam":false},
    "4":{"requesterName":"Ibotta","requesterId":"AGVV5AWLJY7H2","action":"Panda","groupId":"3YVLYSYEBF5EJAO35WSGKPFABSF0QM","pay":"0.01","qual":"ibotta","title":"Are these the same?","queueLimit":0,"duration":"0","audioforce":"less2","dailyLimit":0,"mute":false,"position":null,"tabNumber":"2","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":15,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "5":{"requesterName":"Ibotta","requesterId":"AGVV5AWLJY7H2","action":"Panda","groupId":"3BH1IVA3VJXE20OLEULG3K8PC6Q1RU","pay":"0.01","qual":"","title":"Are these the same?","queueLimit":0,"duration":"0","audioforce":"less2","dailyLimit":0,"mute":false,"position":null,"tabNumber":"2","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":15,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "6":{"requesterName":"Ibotta","requesterId":"AGVV5AWLJY7H2","action":"Panda","groupId":"3ZXRRTK2NDCB5NW5M24C9P2OWG41OF","pay":"0.01","qual":"ibotta","title":"Does this receipt contain the following?","queueLimit":0,"duration":"0","audioforce":"less2","dailyLimit":0,"mute":false,"position":null,"tabNumber":"2","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":8,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "7":{"requesterName":"Ibotta","requesterId":"AGVV5AWLJY7H2","action":"Panda","groupId":"3NYGPW9OTYRQLJTE9DQJQJRQJ2IZPS","pay":"0.01","qual":"","title":"Does this receipt contain the following?","queueLimit":0,"duration":"0","audioforce":"less2","dailyLimit":0,"mute":false,"position":null,"tabNumber":"2","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":8,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "8":{"requesterName":"Ibotta","requesterId":"AGVV5AWLJY7H2","action":"Panda","groupId":"3R35RPFD7JUTQN8612HRYP7E6LZ1PV","pay":"0.03","qual":"ibotta","title":"Does this receipt contain the following?","queueLimit":0,"duration":"0","audioforce":"less2","dailyLimit":0,"mute":false,"position":null,"tabNumber":"2","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":8,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "9":{"requesterName":"Ibotta","requesterId":"AGVV5AWLJY7H2","action":"Panda","groupId":"3ZXRRTK2NDCB5NW5M24C9P2OVF61OE","pay":"0.03","qual":"","title":"Does this receipt contain the following?","queueLimit":0,"duration":"0","audioforce":"less2","dailyLimit":0,"mute":false,"position":null,"tabNumber":"2","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":8,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "10":{"requesterName":"Ibotta","requesterId":"AGVV5AWLJY7H2","action":"Panda","groupId":"3CRC4NO2BIQQWQ3GX0HLFPTFOD30SA","pay":"0.05","qual":"ibotta","title":"Does this receipt contain the","queueLimit":0,"duration":"60 minutes","audioforce":"less2","dailyLimit":0,"mute":false,"position":null,"tabNumber":"2","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":12,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "11":{"requesterName":"Ibotta","requesterId":"AGVV5AWLJY7H2","action":"Panda","groupId":"3787DLY3Y49RIF1DIJQB3Z8BUNP1T2","pay":"0.05","qual":"","title":"Does this receipt contain the following?","queueLimit":0,"duration":"0","audioforce":"less2","dailyLimit":0,"mute":false,"position":null,"tabNumber":"2","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":12,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "14":{"requesterName":"MyLikes","requesterId":"A239M0XNXTKQZ7","action":"Panda","groupId":"3YS67JKWJAZLQB11QU6O537NDYZ4X9","pay":"0.01","qual":"","title":"Identify Images with Mature Content","queueLimit":0,"duration":"0","audioforce":"","dailyLimit":0,"mute":false,"position":null,"tabNumber":"1","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":0,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "15":{"requesterName":"MyLikes","requesterId":"A239M0XNXTKQZ7","action":"Panda","groupId":"3USMLONC9E5D7T4TWRD6UWVBJLN85E","pay":"0.03","qual":"","title":"Identify Images with Mature Content","queueLimit":0,"duration":"0","audioforce":"","dailyLimit":0,"mute":false,"position":null,"tabNumber":"1","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":0,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "16":{"requesterName":"MyLikes","requesterId":"A239M0XNXTKQZ7","action":"Panda","groupId":"37G59K9AEU0BNMXNCLOH5POEZUC9YI","pay":"0.03","qual":"","title":"Identify Videos with Mature Content","queueLimit":0,"duration":"15 minutes","audioforce":"","dailyLimit":0,"mute":false,"position":null,"tabNumber":"1","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":0,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "17":{"requesterName":"Steven Snow","requesterId":"A3GAVAUPTHM0B8","action":"Panda","groupId":"3X19M43Z4VULD73G1I2N3GGRYF10D8","pay":"0.06","qual":"","title":"steven snow search 3X..D8","queueLimit":0,"duration":"0","audioforce":"","dailyLimit":0,"mute":false,"position":null,"tabNumber":3,"once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":0,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "18":{"requesterName":"Steven Snow","requesterId":"A3GAVAUPTHM0B8","action":"Panda","groupId":"3TJJ8HSJVIVGSMA3ZXVL0CV5EGV28D","pay":"0.05","qual":"","title":"steven snow url 3T..8D","queueLimit":0,"duration":"0","audioforce":"","dailyLimit":0,"mute":false,"position":null,"tabNumber":"3","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":0,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "19":{"requesterName":"Venue Quality","requesterId":"A14AT838CPSKA6","action":"Panda","groupId":"3EM4DVSA8U8J6KF08Q5EM8I2NYE308","pay":"0.01","qual":"","title":"locations same","queueLimit":0,"duration":"0","audioforce":"","dailyLimit":0,"mute":false,"position":null,"tabNumber":"1","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":0,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "20":{"requesterName":"Venue Quality","requesterId":"A14AT838CPSKA6","action":"Panda","groupId":"3D8O2NKTAGFJD90I499E0D26RON13W","pay":"0.01","qual":"","title":"locations adult","queueLimit":0,"duration":"5 minutes","audioforce":"","dailyLimit":0,"mute":false,"position":null,"tabNumber":"1","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":0,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "21":{"requesterName":"Venue Quality","requesterId":"A14AT838CPSKA6","action":"Panda","groupId":"ZZAWVTYW3Z9ZTAX43ZD0","pay":"0.01","qual":"","title":"locations family","queueLimit":0,"duration":"0","audioforce":"","dailyLimit":0,"mute":false,"position":null,"tabNumber":"1","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":0,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false},
    "23":{"requesterName":"Rob Grady","requesterId":"AM07BBZNC6UTQ","action":"Panda","groupId":"33X7UBO5WUFB78Y5WJ3MVC35LFMU05","pay":"0.03","qual":"","title":"Transcribe Waffle House Guest Check","queueLimit":0,"duration":"5 minutes","audioforce":"","dailyLimit":0,"mute":false,"position":null,"tabNumber":"1","once":false,"dailyDone":0,"oneDone":0,"day":"","filterMode":0,"hamTimer":20,"friendlyRName":"","friendlyTitle":"","queueHitLimit":0,"weight":0,"searchData":{"searchOptions":{"excludeTerm":[],"includeTerm":[],"minReward":"0.00","historyArray":[],"excludeGID":[],"maxReward":"0.00"},"theHistory":{}},"dateAdded":null,"stickyDelayedHam":false}
};
var gExcludeIds = ["38FT9G80DL83PUCSQBVANJBIKGSLHM"], jqUI_CssSrc = GM_getResourceText("jQueryUICSS");
var jqUI_ModalSrc = GM_getResourceText("jQueryModalCSS"), jqLayout_CssSrc = GM_getResourceText("jQueryLayoutCSS");

function isNumeric(n) { return !isNaN(parseFloat(n)) && isFinite(n); }
Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1), jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};
Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};
function tooltipCreateFix(theElement,theDelay) {
	$(theElement).tooltip({ show: {delay:theDelay}, close: function () { $(this).tooltip("destroy"); tooltipCreateFix($(this),theDelay); helpToolTips(); } });
}
function formatAMPM(theFormat,theDate,theTimeZone) {
    var d = (theDate) ? theDate : new Date();
    if (theTimeZone == "mturk") {
        var mturkTZOffset = -8, today = new Date(); if (today.dst()) mturkTZOffset++;
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000), MturkTime = utc + (3600000 * mturkTZOffset);
        d = new Date(MturkTime);
    }
    var minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
        hours = d.getHours(), ampm = hours >= 12 ? 'pm' : 'am',
        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	hours = (hours>= 12) ? (hours-12) : hours;
	hours = (hours.toString().length == 1) ? '0'+hours : hours;
    if (theFormat=="short") return ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + '-' + d.getFullYear() + '(' + hours + ':' + minutes + ampm + ')';
    else if (theFormat=="dayandtime") return days[d.getDay()] + ' ' + hours + ':' + minutes + ampm;
    else if (theFormat=="onlydate") return ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + '-' + d.getFullYear();
    else return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
}
function formatTimeZone(theFormat,theDate,theTimeZone) { return formatAMPM(theFormat,theDate,theTimeZone); }
function getTimeLeft(theTime) {
    if (theTime!==null && theTime!=="") {
        var tempArray = (theTime.indexOf("second") != -1) ? theTime.split("second")[0].trim().split(" ") : null;
		var seconds = (tempArray) ? parseInt(tempArray[tempArray.length-1]) : 0;
		tempArray = (theTime.indexOf("minute") != -1) ? theTime.split("minute")[0].trim().split(" ") : null;
		var minutes = (tempArray) ? parseInt(tempArray[tempArray.length-1]) : 0;
		tempArray = (theTime.indexOf("hour") != -1) ? theTime.split("hour")[0].trim().split(" ") : null;
		var hours = (tempArray) ? parseInt(tempArray[tempArray.length-1]) : 0;
		tempArray = (theTime.indexOf("day") != -1) ? theTime.split("day")[0].trim().split(" ") : null;
		var days = (tempArray) ? parseInt(tempArray[tempArray.length-1]) : 0;
		tempArray = (theTime.indexOf("week") != -1) ? theTime.split("week")[0].trim().split(" ") : null;
		var weeks = (tempArray) ? parseInt(tempArray[tempArray.length-1]) : 0;
		return( {"weeks":weeks,"days":days,"hours":hours,"minutes":minutes,"seconds":seconds} );
    } else return null;
}
function formatTimeLeft(resetNow,thisDigit,timeString,lastDigit) {
	formatTimeLeft.timeFill = formatTimeLeft.timeFill || 0;
	if (resetNow) formatTimeLeft.timeFill = 0;
	var missingDigit = (lastDigit!="0" && thisDigit=="0") ? true : false;
	if (( thisDigit!="0" || missingDigit) && formatTimeLeft.timeFill<2) {
		formatTimeLeft.timeFill++;
		if (missingDigit) { return "00 " + timeString + "s"; }
		else {
			var addZero = (thisDigit<10) ? ((formatTimeLeft.timeFill==1) ? false : true) : false, plural = (thisDigit==1) ? false : true;
			return ((addZero) ? "0" : "") + thisDigit + " " + ((plural) ? (timeString+"s") : timeString) + " ";
		}
	} else return "";
}
function convertToTimeString(timeData) {
	var returnString = "";
	returnString += formatTimeLeft(true,timeData.weeks,"week",false); returnString += formatTimeLeft(false,timeData.days,"day",timeData.weeks);
	returnString += formatTimeLeft(false,timeData.hours,"hour",timeData.days); returnString += formatTimeLeft(false,timeData.minutes,"minute",timeData.hours);
	returnString += formatTimeLeft(false,timeData.seconds,"second",timeData.minutes);
	return returnString.trim();
}
function convertTimeToSeconds(timeData) {
	var totalSeconds = timeData.seconds + ((timeData.minutes) ? (timeData.minutes*60) : 0) + ((timeData.hours) ? (timeData.hours*3600) : 0) +
			((timeData.days) ? (timeData.days*86400) : 0) + ((timeData.weeks) ? (timeData.weeks*604800) : 0);
	return totalSeconds;
}
function convertSecondsToTimeData(seconds) {
	var timeData = {};
	timeData.weeks = Math.floor(seconds/604800); seconds = seconds - (timeData.weeks*604800);
	timeData.days = Math.floor(seconds/86400); seconds = seconds - (timeData.days*86400);
	timeData.hours = Math.floor(seconds/3600); seconds = seconds - (timeData.hours*3600);
	timeData.minutes = Math.floor(seconds/60); seconds = seconds - (timeData.minutes*60);
	timeData.seconds = seconds;
	return timeData;
}
function convertToSeconds(milliseconds,fixed) { fixed = fixed || 2; var seconds = parseFloat((milliseconds/1000.0 * 100) / 100).toFixed(fixed) + ""; return seconds.replace(/\.0*$/,""); }
function convertToMilliseconds(seconds) { if (seconds) return seconds*1000 + ""; else return "0"; }
function checkNotifications() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) return false;
  else if (Notification.permission === "granted") return true;
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) { if (permission === "granted") return true; });
  }
  return false;
}
function showNotification( title, message, tag, groupId, alertIcon ) {
	if (gMainOptions.disableNotifications) return;
	showNotification.tagNumber = showNotification.tagNumber || 0; showNotification.lastGroupID = showNotification.lastGroupID || "0";
	if (showNotification.lastGroupID != groupId) showNotification.tagNumber++;
	showNotification.lastGroupID = groupId;
	if (alertIcon) iconUrl = "https://pandacrazy.allbyjohn.com/mturk/Messaging-Alert-Icon.png";
	else iconUrl = "https://pandacrazy.allbyjohn.com/mturk/Messaging-Online-icon.png";
    var n = new Notification(title, {
        body: message, icon: iconUrl,
        tag: tag+showNotification.tagNumber});
    if (navigator.userAgent.search("Chrome") >= 0) n.onshow = function () { setTimeout(n.close.bind(n), 21000); };
}
function parseVersionString (str) {
    var x = str.split('.');
    var maj = parseInt(x[0]) || 0; var min = parseInt(x[1]) || 0; var pat = parseInt(x[2]) || 0;
    return {"major": maj, "minor": min, "patch": pat};
}
function checkVersion(greaterThanVersion,newVersion) { // Check if newVersion is GREATER than the greaterThanVersion
	var greaterThanVersionObj = parseVersionString(greaterThanVersion), newVersionObj = parseVersionString(newVersion);
	if (newVersionObj.major > greaterThanVersionObj.major ) return true;
	else if (greaterThanVersionObj.major==newVersionObj.major) {
		if (newVersionObj.minor > greaterThanVersionObj.minor) return true;
		else if (greaterThanVersionObj.minor==newVersionObj.minor && newVersionObj.patch > greaterThanVersionObj.patch) return true;
	}
	return false;
}
// Database using setValue and getValue
function defaultFillIn(data,defaultData) { if (!data) return null; for (var key in defaultData) { if (!(key in data)) data[key] = defaultData[key]; } }
function convertDatabase(theObject,key) {
	if (theObject[key].searchData) {
		if (theObject[key].searchData===null) theObject[key].searchData=setSearchOptionsDefault();
		if (!theObject[key].searchData.searchOptions) theObject[key].searchData.searchOptions = JSON.parse(JSON.stringify(gDefaultSearchOptions));
		if (!theObject[key].searchData.theHistory ) theObject[key].searchData.theHistory = {};
		theObject[key].searchData.searchHistory = null;
	}
	if (theObject[key].action===null) theObject[key].action="Panda";
	if (isNumeric(theObject[key].day)) theObject[key].day="";
	if (theObject[key].groupId.indexOf("&isSelectedBySearchExperiment=")!=-1) { theObject[key].groupId = theObject[key].groupId.split("&")[0]; }
	if (theObject[key].hamTimer===null) theObject[key].hamTimer=gDefaultMainOptions.hamDelayTimer;
}
function convertTabDatabase() {
	if (gTabsData[0].tabName == "Holder") { // temporary for testing computer
		var newDataBase = [];
		gTabInfo = {"nextTabNumber":"" + gTabsData[0].tabNumber,"tabCount":"" + gTabsData.length};
		$.each(gTabsData, function( index, value ) {
			if (index>0) newDataBase.push(value);
		});
		gTabsData = newDataBase;
	}
}
function getBase64Audio(theData) {
    var base64AudioData = new Uint8Array(theData), i = base64AudioData.length, binaryString = new Array(i);
    while (i--) { binaryString[i] = String.fromCharCode(base64AudioData[i]); }
    return(window.btoa(binaryString.join('')));
}
function fillInSoundOptions(soundOptions) {
	for (var key in soundOptions) {
		gSoundOptions[key].payRate = soundOptions[key].payRate; gSoundOptions[key].lessMinutes = soundOptions[key].lessMinutes;
		gSoundOptions[key].mute = soundOptions[key].mute; gSoundOptions[key].tts = soundOptions[key].tts;
		if (soundOptions[key].base64!==null) {
			gAlarmSounds[key].audio = new Audio("data:audio/wav;base64," + JSON.parse(soundOptions[key].base64));
			GM_setValue(gAlarmSounds[key].nameVar,soundOptions[key].base64);
		}
	}
}
function changeOldSettings() {
	if (gMainOptions.cycleIncrease==5) gMainOptions.cycleIncrease = 10; if (gMainOptions.cycleDecrease==5) gMainOptions.cycleDecrease = 10;
	if (gMainOptions.hamDelayTimer===null) gMainOptions.hamDelayTimer=gDefaultMainOptions.hamDelayTimer;
}
function loadSoundFiles(soundNumber,keyArray,resetMe) {
	resetMe = (typeof resetMe != 'undefined') ? resetMe : false;
	var savedDBVersion = gRequestersData[0].requesterName, resetDBVersion = savedDBVersion.split("-")[1];
    if (soundNumber < keyArray.length) {
        var gotBase64 = (resetMe) ? null : GM_getValue(gAlarmSounds[keyArray[soundNumber]].nameVar,null);
        loadSoundFiles.firstTime = loadSoundFiles.firstTime || false;
        if (gotBase64 === null) {
            if (!loadSoundFiles.firstTime) addToWaitDialog($("#JRjqModalDialog-waiting"),"For your first time this might take a few seconds.<br>Loading Alarms ",false,"16px");
            loadSoundFiles.firstTime = true;
            requestUrl(gAlarmSounds[keyArray[soundNumber]].default,0,function(theResult) {
				addToWaitDialog($("#JRjqModalDialog-waiting")," .",false,"16px");
                var base64 = getBase64Audio(theResult.response);
                GM_setValue(gAlarmSounds[keyArray[soundNumber]].nameVar,JSON.stringify(base64));
                gAlarmSounds[keyArray[soundNumber]].audio = new Audio("data:audio/wav;base64," + base64);
				loadSoundFiles(soundNumber+1,keyArray,resetMe);
            },function() { errorRequest(); }, "", "", "arraybuffer");
        } else {
            gAlarmSounds[keyArray[soundNumber]].audio = new Audio("data:audio/wav;base64," + JSON.parse(gotBase64));
            loadSoundFiles(soundNumber+1,keyArray,resetMe);
        }
    } else { changeOldSettings(); continueLoading(); }
	defaultFillIn(gSoundOptions[keyArray[soundNumber]],gDefaultSoundOptions);
}
function fillInGroupings() {
	for (var key in gGroupingData) {
        if (!gGroupingData[key].grouping) gGroupingData[key].grouping = [];
        gGroupings[key] = {"data":gGroupingData[key],"collecting":false};
        gGroupingsSort.push(key);
		defaultFillIn(gGroupingData[key],gDefaultGroupingData["JR First"]);
    }
}
function createKeysArray(theObject) {
	if (!theObject) return null;
	gRequestersKeys = [];
	for (var key in theObject) { gRequestersKeys.push(key); }
}
function loadInDBVersions(passedDatabase) {
	var tempData = null;
	if (passedDatabase) tempData = passedDatabase;
	else {
		tempData = JSON.parse(GM_getValue("JR_PANDA_RequestersData",JSON.stringify(gDefaultRequestersData)));
		createKeysArray(tempData);
	}
	var savedDBVersion = tempData[0].requesterName, resetDBVersion = savedDBVersion.split("-")[1], defaultDBVersion = savedDBVersion.split("-")[2];
	gRequestersKeys = [];
	for (var key in tempData) {
		gRequestersKeys.push(key); convertDatabase(tempData,key); tempData["0"].requesterName = gDatabaseVersion;
		defaultFillIn(tempData[key],gDefaultRequestersData[0]); defaultFillIn(tempData[key].searchData.searchOptions,JSON.parse(JSON.stringify(gDefaultSearchOptions)));
	}
	return tempData;
}
function setupSoundOptions(base64) {
	base64 = (typeof base64 != 'undefined') ? base64 : false;
	var soundOptions = {};
	for (var key in gAlarmSounds) {
		var theBase64 = (base64) ? GM_getValue(gAlarmSounds[key].nameVar,null) : null;
		defaultFillIn(soundOptions[key],gDefaultSoundOptions);
		if (gSoundOptions && gSoundOptions[key]) soundOptions[key] = {"payRate":gSoundOptions[key].payRate,"lessMinutes":gSoundOptions[key].lessMinutes,"base64":theBase64,
			"mute":gSoundOptions[key].mute,"tts":gSoundOptions[key].tts};
		else soundOptions[key] = {"payRate":gAlarmSounds[key].payRate,"lessMinutes":gAlarmSounds[key].lessMinutes,"base64":theBase64,
			"mute":gAlarmSounds[key].mute,"tts":gAlarmSounds[key].tts};
	}
	return soundOptions;
}
function clearOldMessages() {
	var storageKeys = Object.keys(localStorage);
	for (i = 0; i < storageKeys.length; i++)   {
		if ( (storageKeys[i].substring(0,11) == 'JR_message_' &&  storageKeys[i].substr(storageKeys[i].length - gScriptName.length) == gScriptName) ||
				storageKeys[i].substring(0,14) == 'JR_queueOrder_') {
			localStorage.removeItem(storageKeys[i]);
		}
	}
}
function loadSettings() {
	clearOldMessages();
	var defaultSoundOptions = setupSoundOptions();
	gRequestersData = loadInDBVersions();
    gMainOptions = JSON.parse(GM_getValue("JR_PANDA_MainOptions",JSON.stringify(gDefaultMainOptions)));
	defaultFillIn(gMainOptions,gDefaultMainOptions);
    gTabsData = JSON.parse(GM_getValue("JR_PANDA_TabsData",JSON.stringify(gDefaultTabsData)));
    gTabsInfo = JSON.parse(GM_getValue("JR_PANDA_TabsInfo",JSON.stringify(gDefaultTabsInfo)));
	convertTabDatabase();
	for (var key in gTabsData) { defaultFillIn(gTabsData[key],gDefaultTabsData[0]); }
    gGroupingData = JSON.parse(GM_getValue("JR_PANDA_GroupingData",JSON.stringify(gDefaultGroupingData)));
    fillInGroupings();
    gSoundOptions = JSON.parse(GM_getValue("JR_PANDA_SoundOptions",JSON.stringify(defaultSoundOptions)));
    loadSoundFiles(0,Object.keys(gAlarmSounds));
}
function saveSettings(doAfter) {
    GM_setValue("JR_PANDA_RequestersData",JSON.stringify(gRequestersData));
    GM_setValue("JR_PANDA_MainOptions",JSON.stringify(gMainOptions));
    GM_setValue("JR_PANDA_TabsData",JSON.stringify(gTabsData));
    GM_setValue("JR_PANDA_TabsInfo",JSON.stringify(gTabsInfo));
    GM_setValue("JR_PANDA_GroupingData",JSON.stringify(gGroupingData));
    GM_setValue("JR_PANDA_SoundOptions",JSON.stringify(gSoundOptions));
    if (doAfter) setTimeout( function() { doAfter(); },200);
	gDelayedSave = false;
}
function resetSettings() {
	GM_deleteValue("JR_PANDA_RequestersData"); GM_deleteValue("JR_PANDA_MainOptions"); GM_deleteValue("JR_PANDA_TabsData"); GM_deleteValue("JR_PANDA_TabsInfo");
	GM_deleteValue("JR_PANDA_GroupingData"); GM_deleteValue("JR_PANDA_SoundOptions");
	$.each(gAlarmSounds, function( index, value ) { GM_deleteValue(value.nameVar); });
}
function checkDelayedSave() { if (gDelayedSave) saveSettings(); }
// Jquery Creating HTML elements Functions --------
function toggleButton(thisButton,doThisOn,doThisOff,mode,modeStatus) {
	// dothison = status on function, dothisOff = status off function, mode = status mode to force change to, modestatus = force on or off function
    var theStatus = $(thisButton).data("status"), doStatus = (typeof modeStatus != 'undefined') ? modeStatus : (theStatus != "on" && theStatus!=mode) ? "on" : "off";
    if (mode && theStatus!=mode) $(thisButton).data("status",mode);
    else $(thisButton).data("status",doStatus);
    if (doStatus=="on" && doThisOn) doThisOn($(thisButton).data("theNumber"),thisButton,mode);
    if (doStatus=="off" && doThisOff) doThisOff($(thisButton).data("theNumber"),thisButton,mode);
    updateHitColors($(thisButton).data("theNumber"),thisButton);
}
function toggleButtonOff(thisButton,doThisOn,doThisOff,passedMode) {
    $(thisButton).data("status","off"); updateHitColors($(thisButton).data("theNumber"),thisButton);
    if (doThisOff) doThisOff($(thisButton).data("theNumber"),thisButton,passedMode);
}
function toggleButtonOn(thisButton,doThisOn,doThisOff) {
	if ($(thisButton).data("status") == "off") {
		$(thisButton).data("status","on"); updateHitColors($(thisButton).data("theNumber"),thisButton);
		if (doThisOn) doThisOn($(thisButton).data("theNumber"),thisButton);
	}
}
function checkButtonsStatus() { if (gScriptStatus == "normal") return true; else return false; }
function setAttributes(el, attrs) { for (var key in attrs) { el.setAttribute(key, attrs[key]); } }
function elementInit(theElement,theClass,theText,theStyle) {
	if (theClass) theElement.className = theClass; if (theText) theElement.textContent = theText; if (theStyle) theElement.style = theStyle; return theElement;
}
function createDiv(theHtml) { var inner = (theHtml) ? theHtml : ""; return $('<div>').html(inner); }
function createDiv2(theClass,theText,theStyle) { var div = document.createElement("div"); return elementInit(div,theClass,theText,theStyle); }
function createSpan(theHtml) { var inner = (theHtml) ? theHtml : ""; return $('<span>').html(inner); }
function createSpan2(theClass,theText,theStyle) { var span = document.createElement("span"); return elementInit(span,theClass,theText,theStyle); }
function createTextInput(theValue) { return $("<input>").attr({ "type": "text", "value": theValue }); }
function createCheckbox(theValue) { return $("<input>").attr({ "type": "checkbox", "value": theValue }); }
function createCheckbox2(theClass,theValue,theStyle) {
	var cb = document.createElement('input'); cb.type = "checkbox";
	if (theValue) cb.value = theValue; return elementInit(cb,theClass,null,theStyle);
}
function createRadioButton(theName,theValue) { return $("<input>").attr({ "type": "radio", "name": theName, "value": theValue }); }
function createLink(theText,theUrl,theTarget,theTitle) { return $('<a>',{text: theText,target: theTarget,title: theTitle,href: theUrl}); }
function createLink2(theText,theUrl,theTarget,theTitle) {
	var aLink = document.createElement("a"); var linkText = aLink.textContent = theText;
	aLink.title = theTitle; aLink.href = theUrl; aLink.target = theTarget; aLink.style.color = "#00FFFF"; return aLink;
}
function createSpanButton(toDo,theClass,theText,theBackgroundColor,theColor,theFontSize,addStyle) {
    var backgroundColor = (typeof theBackgroundColor != 'undefined') ? theBackgroundColor : "initial";
    var textColor = (typeof theColor != 'undefined') ? theColor : "initial", fontSize = (typeof theFontSize != 'undefined') ? theFontSize : "9px";
    var theButton = createSpan2("nonselectable " + theClass,theText,"font-size:" + fontSize + "; padding:0px 2px; background-color:" + backgroundColor + "; color:" + textColor +
		"; border:2px groove red; cursor:default; margin:0px 1px;" + addStyle);
	setAttributes(theButton,{"data-backgroundColor":backgroundColor,"data-status":"off","data-textColor":textColor,"data-htmltext":theText});
	theButton.addEventListener("dblclick", function (e) { e.stopPropagation(); });
	if (toDo) theButton.addEventListener("click", function (e) { if (checkButtonsStatus()) {toDo(e);} });
    return theButton;
}
function createContainer() {
    var containerDiv = createDiv(); containerDiv.css({"padding-left":"3px", "padding-right":"3px","padding-top":"0px","padding-bottom":"1px"}); return containerDiv;
}
function createPanels(goAppend) { var panelContainer = createContainer().attr("id","panelContainer"); return panelContainer; }
function createPanel(goAppend) { var panel = createContainer(); return panel; }
function createTabs(goAppend,isSortable,idName) {
    var tabList = $("<ul>"), tabsContainer = createContainer().attr("id",idName).css({"height":"99%"});
    tabList.appendTo(tabsContainer);
    tabsContainer.tabs().delegate( "span.ui-icon-close", "click", function(e) {
		var currentTab = $(e.target).closest("li"), currentIndex = $(currentTab).index();
		$("#JRMainTabs").tabs("option", "active", currentIndex);
		var returnValue = confirm("Are you sure you want to delete this Tab?\nAll hits inside the tab will be moved to the Main Tab.\nNo Hits will be lost.");
		if (returnValue) {
			var currentAriaTab = $("#" + (currentTab.attr("aria-controls"))), mainAriaTab = $("#" + ($("#JRTab_1").attr("aria-controls")));
			var currentData = $(currentTab).data("tabData");
			if (currentData.positions.length>0) {
				for (var i=0, len=currentData.positions.length; i<len; i++) {
					$(mainAriaTab).find(".tabContents").append($(currentAriaTab).find("#JRCellNum_" + currentData.positions[i]));
					gRequestersData[currentData.positions[i]].tabNumber = 1; gRequestersData[currentData.positions[i]].tabIndex = 0;
					gTabsData[0].positions.push(currentData.positions[i]); // Push hits on main tab
				}
			}
			currentData.positions.splice(0,currentData.positions.length);
			$(currentTab).remove(); gTabsData.splice(gTabsData.indexOf(currentData),1); saveSettings(); $("#JRMainTabs").tabs( "refresh" );
		}
    });
    if (isSortable) tabList.sortable({placeholder:"sortable-placeholder",delay:300,"items":"li:not(.ui-not-sortable)",dropOnEmpty: true});
    return tabsContainer;
}
function moveToTab(event,ui) {
	if (!ui.draggable.hasClass("JRHitCell") || ui.draggable.data("sameTab")) return;
	var thisTabData = gTabsData[$( "#JRMainTabs" ).tabs( "option", "active" )];
	ui.draggable.data("received",true);
	setTimeout( function() {
		gTabsData[ui.draggable.data("hitInfo").tabIndex].positions.splice(ui.draggable.data("oldPosition"), 1);
		thisTabData.positions.push(ui.draggable.data("theNumber"));
		ui.draggable.data("hitInfo").tabIndex = $(gTabsData).index(thisTabData);
		ui.draggable.data("hitData").tabNumber = thisTabData.tabNumber;
		ui.draggable.detach().appendTo($("#" + $("#JRTab_" + thisTabData.tabNumber).closest( "li" ).attr("aria-controls")).find(".tabContents:first"));
		saveSettings();
	},0);
}
function createTab(tabContainer,theTitle,isSortable,theID,tabData,appendClose,needBr) {
	needBr = (typeof needBr != 'undefined') ? needBr : true;
    var theClasses = (!appendClose) ? "ui-not-sortable" : "", theLabelClasses = (!appendClose) ? "JRTabLabel" : "JRTabLabel hasHelptip";
    var theLabelTitle = (!appendClose) ? "" : "Right click on tab to edit label for this tab. You can also move this tab. Click on the X to remove this tab.";
    var theTabDiv = createContainer().attr("id","tabs-" + (++gTabIndex));
    var theTabLi = $("<li>").html("<a href=\"#tabs-" + gTabIndex + "\" class=\"" + theLabelClasses + "\"" + " title=\"" + theLabelTitle + "\">" + theTitle + "</a>")
        .attr({"id":theID,"class":theClasses}).css({"font-size":"10px"}).data({"tabData":tabData}).appendTo( tabContainer.find("ul") );
    if (appendClose) {
		theTabLi.append(createSpan("Remove Tab").attr({"class":"ui-icon ui-icon-close","role":"presentation"}));
		theTabLi.bind("contextmenu", function(e) {
			if ($(e.target).closest("li").index() > 0) {
				var returnName = prompt("Enter Tab Label : ", $(e.target).html());
				if (returnName && returnName!=="") { $(e.target).html(returnName); $(e.target).closest("li").data("tabData").tabName = returnName; saveSettings(); }
			}
			e.preventDefault();
			return false;
        });
	}
    theTabDiv.data({"tabData":tabData}).appendTo(tabContainer);
    if (isSortable) {
        theTabLi.click( function() { $(this).focus(); $("#" + $(this).attr("aria-controls")).find(".tabContents").focus(); })
            .droppable({ tolerance: 'pointer', drop: moveToTab,
                over: function( event, ui ) {
					var inTabId = $(event.target).attr("aria-controls"); $("#JRMainTabs").tabs("option", "active", $(event.target).index());
                    $(event.target).focus(); $("#" + inTabId).find(".tabContents").focus(); ui.draggable.data("sameTab",false);
                }
            });
    }
	if (needBr) theTabDiv.html("<br clear='all' class='cleartab'></br>");
    tabContainer.tabs("refresh");
    return theTabDiv;
}
// Alarm function -----------
function doAfterSound() {
	if (this.ttsString!=="") speakThisNow(this.ttsString); this.ttsString = null;
	this.removeEventListener("ended",doAfterSound);
}
function playThisSound( keyName, ttsString ) {
	if (gSoundOptions[keyName].mute) { if (gSoundOptions[keyName].tts && ttsString && ttsString!=="") speakThisNow(ttsString); else return; }
	if (gAlarmObject) gAlarmObject.pause(); gAlarmObject = null; gAlarmObject = gAlarmSounds[keyName].audio; gAlarmObject.currentTime = 0;
	gAlarmObject.volume = gMainOptions.alarmVolume/100; gAlarmObject.ttsString = (ttsString && ttsString!=="") ? ttsString : "";
	gAlarmObject.addEventListener("ended", doAfterSound); gAlarmObject.play();
}
function playNewSound( AudioObject ) {
    if (gSoundFile) gSoundFile.pause();
    gSoundFile = AudioObject; gSoundFile.currentTime = 0; gSoundFile.volume = gMainOptions.alarmVolume/100;
	gSoundFile.play();
}
function speakThisNow(thisText) {
    if('speechSynthesis' in window){
        var speech = new SpeechSynthesisUtterance(thisText);
        speech.lang = 'en-US';
        window.speechSynthesis.speak(speech);
    }
}
// Main cycler class that handles all timers, queues, pauses, and hams
var theCycler = (function() {
    var privateVars = {
        _timers: [], _theQueue: [], _theFrontOfTheLineQueue: [], _theFrontOfTheLineTimer: [],
        _before: new Date(), _lastRemoved: -1, _theCycle: 500, _realCycle: 500,
        _theCycleElapsed: 0, _theCycleSkipping: 0, _paused: false, _doHam: null, _timeoutVar: null
    };
    var privateFunctions = {
        _getInTimer: function(theNumber) {
             for (var i=0, len=privateVars._timers.length; i<len; i++) {if (privateVars._timers[i].theNumber == theNumber) return(privateVars._timers[i]);}
            return null;
       },
        _checkInQueue: function(theNumber) {
			var foundNumber = -1;
            for (var i=0, len=privateVars._theQueue.length; i<len; i++) { if (privateVars._theQueue[i][0].theNumber == theNumber.toString()) foundNumber = i; }
			if (foundNumber==-1 && privateVars._doHam) if (privateVars._doHam[0].theNumber == theNumber.toString()) return -86; // -86 means it is ham data not in queue.
			return foundNumber;
        },
        _removeFromQueue: function(theNumber) {
            var foundNumber = privateFunctions._checkInQueue(theNumber);
            if (foundNumber > -1) return [foundNumber,privateVars._theQueue.splice(foundNumber, 1)[0]];
			else if (foundNumber == -86) { var returnData = privateVars._doHam; privateVars._doHam = null; return [foundNumber,returnData]; }
            else return null;
        },
        _goFrontOfTheLineTimer: function() {
            var frontOfTheLineNumber = privateVars._theFrontOfTheLineTimer.shift();
            var frontOfTheLineItem = privateFunctions._getInTimer(frontOfTheLineNumber);
			if (gMainOptions.debugger==2) console.log("Frontofthelinetimer: " + JSON.stringify(frontOfTheLineItem)); // debugger =2 for queue details.
            if (frontOfTheLineItem) {
                frontOfTheLineItem.runFunction.apply("frontoftheline",[frontOfTheLineItem.elapsed,frontOfTheLineItem.theNumber] );
				frontOfTheLineItem.elapsed = 0;
                return true;
            } else return false;
        },
        _goFrontOfTheLine: function() {
            var frontOfTheLineNumber = privateVars._theFrontOfTheLineQueue.shift(), thisItem = null, removeResult = null, frontOfTheLineQueue = null;
            removeResult = privateFunctions._removeFromQueue(frontOfTheLineNumber);
            if (!removeResult) return false;
			frontOfTheLineQueue = removeResult[1];
            if (frontOfTheLineQueue) {
				if (gMainOptions.debugger==2) console.log("Frontofthelinequeue: " + JSON.stringify(frontOfTheLineQueue)); // debugger =2 for queue details.
				for (var c=0, len=frontOfTheLineQueue.length; c<len; c++) { if (frontOfTheLineQueue[c].weightStatus=="item")  thisItem = frontOfTheLineQueue[c]; }
				if (thisItem) {
					if (!thisItem.doOnce) {
						if (removeResult[0]==-86) privateVars._doHam = frontOfTheLineQueue;
						else privateVars._theQueue.push(frontOfTheLineQueue);
					}
					thisItem.runFunction.apply("frontoftheline",[privateVars._theCycleElapsed,thisItem.theNumber] );
					return true;
				}
            }
			return false;
        },
        _goHam: function() {
            var hamCalled = false, thisItem=null;
			if (gMainOptions.debugger==2) console.log("Ham: " + JSON.stringify(privateVars._doHam)); // debugger =2 for queue details.
			for (var c=0, len=privateVars._doHam.length; c<len; c++) { if (privateVars._doHam[c].weightStatus=="item") thisItem = privateVars._doHam[c]; }
			if (thisItem) hamCalled = thisItem.runFunction.apply("goham",[privateVars._theCycleElapsed,thisItem.theNumber] );
            return hamCalled;
        },
        _doTimers: function() {
            var returnStatus = false;
            for(var i=0, len=privateVars._timers.length; i<len; i++) {
                privateVars._timers[i].elapsed += privateVars._theCycleElapsed;
                if (privateVars._timers[i].elapsed >= privateVars._timers[i].milliSeconds) {
                    returnStatus = privateVars._timers[i].runFunction.apply("timer",[privateVars._timers[i].elapsed,privateVars._timers[i].theNumber] );
                    privateVars._timers[i].elapsed = 0;
                }
            }
            return returnStatus;
        },
        _doQueue: function() {
            var skipThis = true, queueItem = null, counter=0, doOnce=false, weighted=false, weightedRan=false, removed=false;
			if (gMainOptions.debugger==2) console.log("Queue: " + JSON.stringify(privateVars._theQueue)); // debugger =2 for queue details.
            do {
                queueItem = privateVars._theQueue[counter];
				if (queueItem.length>1) weighted=true;
				if (queueItem[0].weightStatus=="item") { // check to see if this item is not null for weighted items. Non weighted items will never have nulls.
					try { skipThis = !queueItem[0].runFunction.apply("queue",[privateVars._theCycleElapsed,queueItem[0].theNumber] ); }
					catch(e) { console.log('JRPanda: An error has occurred: '+e.message); }
					doOnce = queueItem[0].doOnce;
					if (privateVars._lastRemoved==queueItem[0].theNumber) removed=true; // Was this item removed already?
					if (!removed) privateVars._theQueue.splice(counter,1); // remove from queue because item was either done or skipped.
					weightedRan=true;
				} else weightedRan=false;
				if (weighted && !removed) queueItem.push(queueItem.shift()); // Take from top of item queue and place on bottom to keep null weight items.
				if (weighted && !weightedRan && !removed) privateVars._theQueue.splice(counter,1,queueItem); // Replace item in same place if this was skipped because of null weight item.
				if ( (!weighted && !doOnce && !removed) || (weighted && weightedRan && !removed) ) privateVars._theQueue.push(queueItem);
				counter++; weighted=false;
            } while (privateVars._theQueue.length > 0 && skipThis && counter < privateVars._theQueue.length);
			privateVars._lastRemoved = -1; // Reset last removed so everything is fresh.
        },
        _theLoop: function() {
            var continueCheck = true;
            var elapsed = new Date().getTime() - privateVars._before.getTime();
            if (elapsed >= privateVars._realCycle) {
                privateVars._theCycleElapsed = elapsed;
                if (privateVars._theFrontOfTheLineTimer.length > 0) continueCheck = !privateFunctions._goFrontOfTheLineTimer();
                if (privateVars._theFrontOfTheLineQueue.length > 0) continueCheck = !privateFunctions._goFrontOfTheLine();
                if (continueCheck && privateVars._timers.length>0) continueCheck = !privateFunctions._doTimers();
                if (continueCheck && privateVars._doHam) { continueCheck = false; privateFunctions._goHam(); }
                if (continueCheck && privateVars._theQueue.length>0) { privateFunctions._doQueue(); }
                privateVars._before = new Date();
            }
            privateVars._timeoutVar = setTimeout(privateFunctions._theLoop, 5);
        }
    };
    var output = {
        addJob: function(func, theNumber, milliSeconds, doOnce, weight) {
            if (typeof func === 'function' && !isNaN(milliSeconds)) {
				doOnce = (typeof doOnce != 'undefined') ? doOnce : false; weight = (typeof weight != 'undefined') ? weight : 0;
                if (privateFunctions._checkInQueue(theNumber)!=-1) return;
                for(var i=0, len=privateVars._timers.length; i<len; i++) { if (privateVars._timers[i].theNumber == theNumber) return; }
                var jobData = [{'theNumber':theNumber,'runFunction': func,'milliSeconds':milliSeconds,'weightStatus':"item",'cycleWeight':weight,'elapsed':milliSeconds,'doOnce':doOnce}];
                if (milliSeconds === 0) {
					for (var ii=0; ii<weight; ii++) { jobData.unshift({'theNumber':theNumber,'weightStatus':"null",'doOnce':doOnce}); }
					privateVars._theQueue.unshift(jobData);
				}
                else if (milliSeconds > 0) privateVars._timers.unshift(jobData[0]);
            }
            if (privateVars._timeoutVar===null) { privateVars._before = new Date(); privateFunctions._theLoop(); }
        },
        removeJob: function(theNumber) {
            var returnValue = false;
            if (privateFunctions._removeFromQueue(theNumber)) privateVars._lastRemoved = theNumber;
            for (var i=0, len=privateVars._timers.length; i<len; i++) {
                if (privateVars._timers[i].theNumber == theNumber) {
                    privateVars._timers.splice(i, 1);
					privateVars._lastRemoved = theNumber;
                    returnValue=true;
                    break;
                }
            }
            if (privateVars._theQueue.length === 0 && privateVars._timers.length === 0) { clearTimeout(privateVars._timeoutVar); privateVars._timeoutVar = null; }
            return returnValue;
        },
        pause: function() {
            privateVars._paused = true;
            clearTimeout(privateVars._timeoutVar);
        },
        isPaused: function() { return privateVars._paused; },
        unpause: function() {
            privateVars._paused = false;
			privateVars._before = new Date();
            if (privateVars._timers.length>0 || privateVars._theQueue.length>0)
                privateVars._timeoutVar = setTimeout(privateFunctions._theLoop, 0);
        },
        frontOfTheLineTimer: function( theNumber ) { privateVars._theFrontOfTheLineTimer.push(theNumber); },
        frontOfTheLine: function( theNumber ) { privateVars._theFrontOfTheLineQueue.push(theNumber); },
        changeWeight: function( theNumber, newWeight ) {
			var foundNumber = privateFunctions._checkInQueue(theNumber), thisItem=null, itemQueue=null;
			if (foundNumber==-86) itemQueue = privateVars._doHam;
			else if (foundNumber>-1) itemQueue = privateVars._theQueue.splice(foundNumber, 1)[0];
            if (itemQueue) {
				for (var c=0, len=itemQueue.length; c<len; c++) { if (itemQueue[c].weightStatus=="item")  thisItem = itemQueue[c]; }
				if (thisItem) {
					thisItem.cycleWeight = newWeight;
					var jobData = [thisItem];
					for (var i=0; i<newWeight; i++) { jobData.unshift({'theNumber':theNumber,'weightStatus':"null"}); }
					if (foundNumber==-86) privateVars._doHam = jobData;
					else privateVars._theQueue.splice(foundNumber,0,jobData);
					if (gMainOptions.debugger==2) console.log(JSON.stringify(privateVars._theQueue)); // debugger =2 for queue details.
				}
			}
		},
        hamOn: function( theNumber ) {
			var hamData = null, removeResult = null;
			removeResult = privateFunctions._removeFromQueue(theNumber);
			if (removeResult) hamData = removeResult[1];
			if (hamData) privateVars._doHam = hamData;
			if (gMainOptions.debugger==2) console.log("The ham data = " + JSON.stringify(privateVars._doHam)); // debugger =2 for queue details.
		},
        hamOff: function() {
			if (privateVars._doHam) privateVars._theQueue.push(privateVars._doHam);
			privateVars._doHam = null;
			if (gMainOptions.debugger==2) console.log("The ham data = " + JSON.stringify(privateVars._doHam)); // debugger =2 for queue details.
		},
        isHamOn: function() { return (privateVars._doHam) ? true : false; },
        jobs: function() { return privateVars._theQueue.length; },
        skippingReset: function() { privateVars._theCycleSkipping = 0; privateVars._realCycle = privateVars._theCycle; },
        cycleIncrease: function(increaseNumber) {
            increaseNumber = (typeof increaseNumber != 'undefined') ? increaseNumber : gMainOptions.cycleIncrease;
            privateVars._theCycleSkipping += parseInt(increaseNumber);
            privateVars._realCycle += parseInt(increaseNumber);
        },
        cycleDecrease: function(decreaseNumber) {
            decreaseNumber = (typeof decreaseNumber != 'undefined') ? decreaseNumber : gMainOptions.cycleDecrease;
            privateVars._theCycleSkipping = (privateVars._theCycleSkipping > 0) ?
                privateVars._theCycleSkipping -= parseInt(decreaseNumber) : 0;
            privateVars._realCycle = privateVars._theCycle + privateVars._theCycleSkipping;
        },
		turnOff: function() { clearTimeout(privateVars._timeoutVar); privateVars._timeoutVar = null; },
        cycle: function() { return privateVars._theCycle; },
        cycleSkipping: function() { return privateVars._theCycleSkipping; },
        cycleChange: function(newSkipping) {
            privateVars._theCycleSkipping = newSkipping; privateVars._realCycle = privateVars._theCycle + privateVars._theCycleSkipping;
        },
        cycleAdd: function(newSkipping) {
            privateVars._theCycleSkipping += newSkipping; privateVars._realCycle = privateVars._theCycle + privateVars._theCycleSkipping;
        },
        cycleResetChange: function(newCycle) {
            privateVars._theCycle = newCycle; privateVars._theCycleSkipping = 0; privateVars._realCycle = newCycle;
        }
    };
    return output;
})();
// status on UI to show info to user.
function displayMainStatus() {
	if (!window.jQuery) return;
    var statusText = "", theMode="", theJobs = (gMainData.jobs===0) ? "-- Collecting Off " : "-- " + gMainData.jobs + " jobs On ";
    $("#JRJobsArea").html(theJobs);
    theMode = $("#JRCycleInfoArea").data("mode");
    var theCycle = (theMode=="Elapsed") ? "[ Elapsed: " + gMainData.lastElapsed + "ms | " :
        (theMode=="Cycle") ? "[ Cycling every: " + theCycler.cycle() + "ms | " :
        (theMode=="CycleSkipping") ? "[ Cycling Slowed: " + theCycler.cycleSkipping() + "ms | " :
        (theMode=="Hamcycle") ? "[ Min Ham Cycle: " + gMainOptions.HamCycleNumber + "ms | " : "";
    if (isActiveMenu(gMainMenu,"Cycler")) {
        theCycle = "[ Elapsed Time: " + gMainData.lastElapsed + "ms | Cycling every: " + theCycler.cycle() + "ms | Cycling Slowed: " +
            theCycler.cycleSkipping() + "ms | Min Ham Cycle: " + gMainOptions.HamCycleNumber + "ms ]";
        $("#JRCycleInfoArea").html(theCycle);
        $("#JRResultAccSkipArea").html("");
        $("#JRErrorArea").html("");
        $("#JRPayArea").html("");
    } else {
        $("#JRCycleInfoArea").html(theCycle);
        theMode = $("#JRResultAccSkipArea").data("mode");
        var theAccSkip = (theMode=="Accepted") ? "Accepted: " + gMainData.accepted + " | " :
            (theMode=="Skipped") ? "Skipped: " + gMainData.skipped + " | " :
			(theMode=="Missed") ? "Missed: " + gMainData.missed + " | " :
			(theMode=="Searched") ? "Total Searched: " + gMainData.searched + " | " : "";
        $("#JRResultAccSkipArea").html(theAccSkip);
        theMode = $("#JRErrorArea").data("mode");
        var theErrors = (theMode=="Errors") ? "Errors: " + gMainData.errors + " | " :
            (theMode=="TooFast") ? "PRE'S: " + gMainData.tooFast + " | " :
            (theMode=="TooHamFast") ? "GoHam Pre's: " + gMainData.tooFastHam + " | " :
            (theMode=="TooNormalFast") ? "Normal Pre's: " + gMainData.tooFastNormal + " | " : "";
        $("#JRErrorArea").html(theErrors);
        theMode = $("#JRPayArea").data("mode");
		var totalString = (gMainData.projectedEarnings===0.00) ? "Accepted: $" + gMainData.totalEarnings.toFixed(2) + " ]" : "Total: $" + gMainData.totalEarnings.toFixed(2) + " ]";
        var thePay = (theMode=="PayAccepted") ? totalString : (theMode=="Projected") ? "P.E.: $" + gMainData.projectedEarnings.toFixed(2) + " ]" : "";
        $("#JRPayArea").html(thePay);
    }
	$("#JRCaptchaCount").html( (!gMainOptions.captchaCountText || (gMainData.captchaCounter > gMainOptions.captchaAt+5)) ? "" : "Captcha Count: " + gMainData.captchaCounter);
}
function createQueueLinks(returnUrl,continueUrl) {
	var theLinks = createSpan2(), returnLink = (returnUrl!=="") ? createLink2("Return",returnUrl,"_blank","Return") : null;
	if (returnLink) {
		returnLink.classList.add("JRQueueReturn");
		if (returnLink.href.indexOf("doNotRedirect=true") == -1) returnLink.href = returnLink.href + "&doNotRedirect=true";
		returnLink.addEventListener('click', function(e) {
			gAlarmSounds.queueAlert.audio.pause();
			showYesNoDialog("Are you sure you want to return this hit?",function() {
				var theHeight=window.outerHeight-80, theWidth=window.outerWidth-10;
				window.open($(e.target).attr("href"),"_blank","width=" + theWidth + ",height=" +  theHeight + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
			});
			return false;
		});
		theLinks.appendChild(returnLink); theLinks.appendChild(document.createTextNode(" :: "));
	}
	var continueLinkURL = createLink2("Continue Work",continueUrl,"_blank","Continue Work");
	continueLinkURL.classList.add("JRQueueContinue");
	if (continueLinkURL.href.indexOf("doNotRedirect=true") == -1) continueLinkURL.href = continueLinkURL.href + "&doNotRedirect=true";
	continueLinkURL.addEventListener('click', function(e) {
		gAlarmSounds.queueAlert.audio.pause();
		var theHeight=window.outerHeight-80, theWidth=window.outerWidth-10;
		window.open($(e.target).attr("href"),"_blank","width=" + theWidth + ",height=" +  theHeight + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
		return false;
	});
	theLinks.appendChild(continueLinkURL);
	return theLinks;
}
function displayQueueStatus(queueAlertOK) {
	var lessThanAlarm = false, theTimeLeft = null, timeLeftString="";
	addToQueueWatchLog(createSpan(""),true);
	gMainData.hitsInQueue = gQueueData.length;
	if (gQueueData.length>0) {
		for (var i=gQueueData.length-1; i>=0; i--) {
			theTimeLeft = getTimeLeft(gQueueData[i].timeLeft);
			timeLeftString = convertToTimeString(theTimeLeft);
			addToQueueWatchLog(createSpan("(" + gQueueData[i].requesterName + ") [$" + gQueueData[i].pay + "] - <span style='color: #00CED1;'>" +
				timeLeftString + "</span> - " + gQueueData[i].title + " :: ").data("thisData",gQueueData[i])
					.append(createQueueLinks(gQueueData[i].returnURL,gQueueData[i].continueURL)));
			if (queueAlertOK && !gMainOptions.disableQueueAlert) {
				if (!lessThanAlarm && theTimeLeft.weeks < 1 && theTimeLeft.days < 1 && theTimeLeft.hours < 1 && theTimeLeft.minutes < parseInt(gSoundOptions.queueAlert.lessMinutes)) {
					lessThanAlarm = true;
					if (!$("#muteQueueWatchAlarm").is(":checked")) {
						if (!gSoundOptions.queueAlert.mute) playThisSound("queueAlert");
						else if (gSoundOptions.queueAlert.tts) speakThisNow("Running out of time!");
						$("#JRQueueWatchLog").css({"background-color":"#8A0000"});
						$("#JRQueueWatchLog").animate({"backgroundColor":"#000000"}, 10000, function() {
								$("#JRQueueWatchLog").css({"background-color":"#8A0000"});
								$("#JRQueueWatchLog").animate({"backgroundColor":"#000000"}, 10000);
							});
					}
				}
			}
		}
	} else {
		addToQueueWatchLog(createDiv("You have no hits in your queue at this time. Click on the black background to refresh your queue.<br>" +
			"An alarm will be heard if a hit has " + gSoundOptions.queueAlert.lessMinutes + " minutes left. Mute the alarm to the right if not needed.<br>" +
			"This window gets updated every " + convertToSeconds(gMainOptions.queueTimer) + " seconds.")
		.css({"font-size":"15px","color":"#7FFFD4","margin-top":"12px","text-align":"center","line-height":"18px"}));
	}
	$("#JRStatusTab_2 .JRTabLabel:first").html("Queue Watch - " + ((gMainData.hitsInQueue <=25) ? gMainData.hitsInQueue : "25"));
}
function fullQueueTimer() { gFullQueue = false; }
function displayHitStatus( container,theNumber ) {
	if (!window.jQuery) return;
    var hitInfo = gMainData.hitCollection[theNumber], hitStatus = hitInfo.status;
	var skippedStatus = (hitInfo.data.action.toLowerCase().indexOf("filter") != -1) ? "Skip: " + hitStatus.skipped + " | " : "";
	var missedStatus = (hitInfo.data.action.toLowerCase().indexOf("pantha") != -1) ? "Miss: " + hitStatus.missed + " | " : "";
	var foundHits = (hitInfo.data.action.toLowerCase().indexOf("search") != -1) ? "/" + hitStatus.foundHits : "";
    var statusText = "[ Acc: " + hitStatus.accepted + foundHits + " | " + skippedStatus + missedStatus + "Srch: " + hitStatus.searched + " ]";
    if (container) $(container).html(statusText);
	else $("#JRCellStatus_" + theNumber).html( statusText );
    displayMainStatus();
}
function processResults( theNumber, result, finalUrl, pageRWQ, jobData ) {
    var hitInfo = (theNumber>0) ? gMainData.hitCollection[theNumber] : null;
    var hitData = (hitInfo) ? hitInfo.data : null;
    var hitStatus = (hitInfo) ? hitInfo.status : null;
	var hitDataActionSix = (hitData) ? hitData.action.toLowerCase().substring(0,6) : "";
    switch(result) {
        case "NOTQUALIFIED":
            if (hitStatus) hitStatus.notQual++;
			hitInfo.hitCell.data("status","off");
			toggleButtonOff( hitInfo.hitCell.find(".JRCollectButton"),startCollecting,stopCollecting);
            updateHitCell(theNumber);
			break;
        case "BLOCKED": // stop collecting this job. Change background to error color.
            if (hitStatus) hitStatus.blocked++;
			hitInfo.hitCell.data("status","off");
			toggleButtonOff( hitInfo.hitCell.find(".JRCollectButton"),startCollecting,stopCollecting);
            updateHitCell(theNumber);
			break;
        case "NOACCEPT": // Missed a hit because someone else took it. So mad.
            if (hitDataActionSix == "search" || hitDataActionSix == "pantha") { hitStatus.missed++; hitStatus.noHits++; gMainData.missed++; }
            break;
        case "NOMORE":
            if (hitStatus) hitStatus.noHits++;
            gMainData.noHits++;
            break;
        case "TOOFAST":
            if (hitStatus) hitStatus.tooFast++;
            gMainData.tooFast++;
			if (theCycler.isHamOn()) gMainData.tooFastHam++; else gMainData.tooFastNormal++;
            if (gSlowDownAuto) theCycler.cycleIncrease(gMainOptions.cycleAutoIncrease);
			if (finalUrl) {
				var acceptPage = (finalUrl.indexOf("mturk/accept") != -1);
				var previewPage = (finalUrl.indexOf("mturk/preview") != -1);
				if (acceptPage || previewPage) {
					if (hitDataActionSix == "search" || (hitDataActionSix == "pantha" && acceptPage)) {
						if (gMainOptions.debugger>0) console.log("got a PRE for a search or pantha on: " + finalUrl); // debugger >0 for pre on search or pantha
						hitInfo.goToUrl.push({"url":finalUrl,"theNumber":theNumber});
					}
				}
			}
            break;
        case "LOGGEDOFF":
            if (!theCycler.isPaused()) {
				var addText = createDiv("You are logged out of Amazon.<br><br>Can't accept hits so pausing.<br><br>Please log back in!")
					.css({"margin-top":"30px","font-size":"17px","text-align":"center","color":"red"});
				if (finalUrl.indexOf("www.mturk.com") != -1) {
					$(addText).append(createDiv(createLink("Log in to Mturk","https://www.mturk.com/mturk/myhits","_blank","https://www.mturk.com/mturk/myhits")
							.click( function() {
								gJRPOP = window.open("https://www.mturk.com/mturk/myhits","_blank","width=" + 1000 + ",height=" +  800 + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
								return false;
							})).css({"color":"blue","margin-top":"15px"}));
				} else {
					$(addText).append(createDiv(createLink("Log in to NEW Mturk Page","http://worker.mturk.com/","_blank","http://worker.mturk.com/")
							.click( function() {
								gJRPOP = window.open("http://worker.mturk.com/","_blank","width=" + 1000 + ",height=" +  800 + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
								return false;
							})).css({"color":"blue","margin-top":"15px"}));
				}
				showWaitDialog("Logged Out!!","",function() {
					theCycler.unpause();
					$("#JRPauseButton").html("Pause").css({"background-color":"ivory","color":"black"});
					theCycler.frontOfTheLineTimer(-1);
				},null,addText,true);
				theCycler.pause();
				$("#JRPauseButton").html("Resume").css({"background-color":"red","color":"white"});
				if (gNotifications) showNotification( "ALERT: Logged Off!", "You are logged off of mturk so need to log back in as soon as possible",
					"loggedoff", "3ALERT3", true);
				if (!gSoundOptions.hasToPause.mute) playThisSound("hasToPause");
				else if (gSoundOptions.hasToPause.tts) speakThisNow("Sorry. You were logged off of m turk.");
			}
            break;
        case "DAILYLIMIT":
			theCycler.pause();
            $("#JRPauseButton").html("Resume").css({"background-color":"red","color":"white"});
			checkDelayedSave(); stopAll();
			showWaitDialog("Daily Limit Reached","",function() {},null,
				createDiv("ALERT: CONGRATS!<br><br>You have reached your mturk daily limit!! You must wait for tomorrow. Go outside and see the sun!")
					.css({"font-size":"18px","text-align":"center","margin":"20px 10px","line-height":"22px"}),false,240,510);
			if (gNotifications) showNotification( "ALERT: CONGRATS!", "You have reached your daily limit!! You must wait for tomorrow. Go outside and see the sun!",
				"loggedoff", "3ALERT3", true);
            break;
        case "NOTCOMPLETED":
        case "ERROR":
            if (hitStatus) hitStatus.error++;
            gMainData.error++;
            break;
        case "QUEUEMAX":
            if (hitStatus) hitStatus.fullQueue++;
			if (!gFullQueue) {
				if (!gSoundOptions.fullQueue.mute) playThisSound("fullQueue");
				else if (gSoundOptions.fullQueue.tts) speakThisNow("Your queue is full!");
				gFullQueueTimer = setTimeout( function() { fullQueueTimer(); }, 240000 );
			}
			gFullQueue = true;
            gMainData.fullQueue++;
            break;
        case "SKIPPED":
            if (hitStatus) hitStatus.skipped++;
            gMainData.skipped++;
            break;
        case "ACCEPTED":
			gMainData.captchaCounter++;
            if (hitStatus) hitStatus.accepted++;
			if (hitInfo.ham == "ontimed") hitInfo.lastAccept = new Date();
			var collectedDate = new Date(), newDateString = formatAMPM("onlydate",collectedDate); hitData.day = newDateString;
            if (hitData.dailyLimit && hitData.dailyLimit>0) hitData.dailyDone = (gMturkDate == hitData.day) ? hitData.dailyDone+1 : 1;
            if (hitData.once) hitData.oneDone = 1;
            gMainData.accepted++; gMainData.hitsInQueue++;
			if (pageRWQ) queueDelay.push(jobData);
			else addToQueueWatch(jobData);
			gSendQueue = true;
            var hitPay = parseFloat(hitData.pay), theDuration = hitInfo.minutes;
            gMainData.payCounter = gMainData.payCounter + hitPay; gMainData.totalEarnings = gMainData.projectedEarnings + gMainData.payCounter;
            if (theDuration===0 && hitData.duration!="0") {
                theDuration = (hitData.duration.indexOf("weeks")!=-1) ? 5000 : (hitData.duration.indexOf("day")!=-1) ? 1500 : (hitData.duration.indexOf("hours")!=-1) ? 200 :
                    (hitData.duration.indexOf("hour")!=-1) ? 60 : (hitData.duration.indexOf("minutes")!=-1) ? parseInt(hitData.duration.split("minutes")[0]) : 1;
				hitInfo.durationParsed = getTimeLeft(hitData.duration); hitInfo.minutes = theDuration;
            }
            var theSoundFile = "less99", notificationTitle = "Accepted Hit From: " + hitData.requesterName;
            var notificationMessage = "Pay: " + hitData.pay + "\nDuration: " + hitData.duration + "\nTitle: " + hitData.title;
            if (!hitData.mute) {
                if ( hitPay < parseFloat(gSoundOptions.less2.payRate) ) {
					theSoundFile = (theDuration !== 0 && theDuration<=parseInt(gSoundOptions.less2Short.lessMinutes)) ? "less2Short" : "less2";
				} else if ( hitPay <= parseFloat(gSoundOptions.less5.payRate) ) {
					theSoundFile =  (theDuration !== 0 && theDuration<=parseInt(gSoundOptions.less5Short.lessMinutes)) ? "less5Short" : "less5";
				} else if ( hitPay <= parseFloat(gSoundOptions.less15.payRate) ) {
					theSoundFile = (theDuration !== 0 && theDuration<=parseInt(gSoundOptions.less15Short.lessMinutes)) ? "less15Short" : "less15";
                } else if ( hitPay < parseFloat(gSoundOptions.less99.payRate) ) { theSoundFile = "less99"; }
                if (hitData.audioforce !== "") theSoundFile = hitData.audioforce;
				var speakThis = (gSoundOptions[theSoundFile].tts) ? "Accepted hit from " + hitData.requesterName + ". Duration " + hitData.duration +
					". Paying " + hitData.pay : "";
                if (gRapidSuppress.jobNumber != theNumber) { if (gSoundOptions[theSoundFile].mute) speakThisNow(speakThis); else playThisSound(theSoundFile,speakThis); }
				gRapidSuppress.jobNumber = theNumber; gRapidSuppress.counter = 8;
            }
			if (gScriptStatus == "normal") {
				var noLimits = checkLimits(theNumber);
				$("#JRCellNum_" + theNumber).stop(true,true);
				if (!noLimits && !hitData.once) { $("#JRCellNum_" + theNumber).css({"background-color":"#FFA691"}); }
				else {
					$("#JRCellNum_" + theNumber).css({"background-color":"yellow"});
					$("#JRCellNum_" + theNumber).animate({"backgroundColor": $("#JRCellNum_" + theNumber).data("backgroundColor")}, 30000);
				}
			}
            if (gNotifications) showNotification( notificationTitle, notificationMessage, "accepted", hitData.groupId);
            if ( hitInfo.ham == "paused" ) { toggleButton($("#JRHamB_" + theNumber),hamOn,hamOff); }
            addToAcceptedLog( hitData.requesterName + " - <a href='" + pandaLink(hitData.groupId) + "' target='_blank' style='color:cyan;'>" + hitData.groupId +
				"</a> [<span style='color:#90EE90;'>" + formatAMPM("dayandtime",collectedDate) + "</span>] - " + hitData.title );
            updateHitCell(theNumber);
			gDelayedSave = true;
            break;
    }
    if (theNumber > 0) displayHitStatus(null,theNumber);
}
function requestUrl(theUrl, theNumber, theFunction, errorFunction, data1, data2, theResponseType, acceptText) {
    theResponseType = theResponseType || ""; acceptText = acceptText || "text/html";
    if (gMainOptions.debugger>1) console.log("JR going to get: " + theUrl); // debugger >1 for request details
    GM_xmlhttpRequest({
        method: "GET",
        url: theUrl,
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "User-Agent": "Mozilla/5.0", "Accept": acceptText },
        responseType: theResponseType,
        onload: function(response) { if (typeof theFunction == 'function') theFunction(response,theNumber,data1,data2); },
        onerror: function(response) { errorRequest(response,theNumber); }
    });
}
function errorRequest(response,theNumber) {
	if (response && response.error) {
		console.log("error " + theNumber + ": " + response.error);
		if (response.error.indexOf("https://www.amazon.com/ap/signin?")!=-1) processResults( theNumber, "LOGGEDOFF", response.error );
	}
}
function pandaLink(theGroupId) { return "https://www.mturk.com/mturk/previewandaccept?groupId=" + theGroupId + "&doNotRedirect=true"; }
function pandaLinkNew(theGroupId) { return "http://worker.mturk.com/projects/" + theGroupId + "/tasks/accept_random?ref=w_pl_prvw"; }
function previewLink(theGroupId) { return "https://www.mturk.com/mturk/preview?groupId=" + theGroupId + "&doNotRedirect=true"; }
function previewLinkNew(theGroupId) { return "http://worker.mturk.com/projects/" + theGroupId + "/tasks?ref=w_pl_prvw"; }
function continueLink(theHitId) { return "https://www.mturk.com/mturk/continue?hitId=" + theHitId + "&doNotRedirect=true"; }
function returnLink(theHitId) { return "https://www.mturk.com/mturk/return?hitId=" + theHitId + "&inPipeline=false&doNotRedirect=true"; }
function requesterSearch(theRequester,minReward) { return "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&qualifiedFor=on&pageSize=10&minReward=" + minReward + "&sortType=Reward%3A1&requesterId=" + theRequester + "&doNotRedirect=true"; }
function requesterSearchNew(theRequesterID,minReward) { return "https://worker.mturk.com/requesters/" + theRequesterID + "/projects?page_size=30&filters%5B" +
		"qualified%5D=true&filters%5Bmasters%5D=false&sort=num_hits_desc&filters%5Bmin_reward%5D=" + minReward + "&format=json"; }
function termSearchNew(theTerm,theSize,theSort,qualified) {
	qualified = qualified || "true";
	return "https://worker.mturk.com/?filters%5Bsearch_term%5D=" + theTerm + "&page_size=" + theSize + "&page_number=1&sort=" + theSort + "&filters%5Bqualified%5D=" + qualified;
}
function acceptLink(theHitData) { return "https://www.mturk.com/mturk/accept?hitId=" + theHitData.hitId + "&prevHitSubmitted=" + theHitData.prevHitSubmitted +
    "&prevRequester=" + theHitData.prevRequester + "&prevReward=" + theHitData.prevReward + "&requesterId=" + theHitData.requesterId + "&groupId=" +
    theHitData.groupId + "&signature=" + theHitData.signature + "&doNotRedirect=true";
}
function acceptLinkNew(theGroupId,theHitId) { return "https://worker.mturk.com/projects/" + theGroupId + "/tasks/" + theHitId + "/accept?ref=w_wp_acpt_top"; }
function setSearchOptionsDefault() {
	var searchOptions = JSON.parse(JSON.stringify(gDefaultSearchOptions)), theHistory = {};
	return {"searchOptions":searchOptions,"theHistory":theHistory};
}
function checkLimits(theNumber) {
    var hitInfo = gMainData.hitCollection[theNumber], hitData = hitInfo.data, returnValue = false;
	var thisKey = hitData.requesterName + "::" + hitData.title + "::" + hitData.pay;
    if (hitData.queueLimit === 0 && hitData.queueHitLimit === 0 && hitData.dailyLimit === 0 && !hitData.once) returnValue = true;
	else if ( (hitData.once && hitData.oneDone>0) || (hitData.dailyLimit > 0 && parseInt(hitData.dailyLimit) <= parseInt(hitData.dailyDone)) ) {
        if (hitInfo.hitCell.data("status")=="on") hitInfo.hitCell.data("status","off");
        toggleButtonOff( hitInfo.hitCell.find(".JRCollectButton"),startCollecting,stopCollecting);
		returnValue = false; }
	else if (hitData.queueHitLimit > 0 && (gQueueCount[thisKey] === "undefined" || gQueueCount[thisKey] >= hitData.queueHitLimit)) returnValue = false;
    else if (hitData.queueLimit > 0 && hitData.queueLimit <= gMainData.hitsInQueue) returnValue = false;
    else returnValue = true;
    return returnValue;
}
function checkJobMode(theNumber) {
    var hitInfo = gMainData.hitCollection[theNumber], hitData = hitInfo.data, returnValue = true;
	if (hitData.action.toLowerCase().indexOf("panda")!=-1 && hitData.groupId==="") {
        if (hitInfo.hitCell.data("status")=="on") hitInfo.hitCell.data("status","off");
        toggleButtonOff( hitInfo.hitCell.find(".JRCollectButton"),startCollecting,stopCollecting);
		returnValue=false;
	}
	return returnValue;
}
function searchRequestersInfo( theNumber, hitNumber, requestersInfo ) {
    var hitInfo = gMainData.hitCollection[hitNumber], hitData = hitInfo.data;
    if (hitInfo.collecting != "off") {
        hitInfo.status.searched++;
        displayHitStatus(null,hitNumber);
        for (var i=0, len=requestersInfo.data.length; i<len; i++) { if ( requestersInfo.data[i].groupId == hitData.groupId ) { return i; } }
    }
    return -1;
}
function grabJobData(thisDoc,index) {
	var jobData = jQuery.extend(true, {}, gJobDataDefault), titleElement = $(thisDoc).find("#capsule" + index + "-0"), timeLeft = null, keywordsArray=[];
	var requesterNameNode = $(thisDoc).find("#requester\\.tooltip");
	if (titleElement.length) {
		jobData.title = $(titleElement).text().trim();
		var titleLink = $(titleElement).closest("tr").find(".capsulelink a:first"), titleLinkSplit = (titleLink.length) ? $(titleLink).attr("href").split("groupId=")[1] : "";
		jobData.groupId = (titleLinkSplit) ? titleLinkSplit.split("&")[0] : "";
		var returnLinkURL = $(titleElement).closest("tr").find("a:contains('Return this HIT'):first");
		jobData.returnURL = (returnLinkURL.length) ? "https://www.mturk.com" + $(returnLinkURL).attr("href") : "";
		var continueLinkURL = $(titleElement).closest("tr").find("a:contains('Continue work on this HIT'):first");
		jobData.continueURL = (continueLinkURL.length) ? "https://www.mturk.com" + $(continueLinkURL).attr("href") : "";
		jobData.hitId = (jobData.continueURL!=="") ? jobData.continueURL.split("hitId=")[1] : "";
		var requesterElement = $(thisDoc).find(".requesterIdentity:first");
		jobData.requesterName = (requesterElement.length) ? $(requesterElement).text().trim() : "";
		var contactRequesterUrl = $(thisDoc).find("#capsule" + index + "target").find("a:contains('Contact the Requester of this HIT'):first");
		jobData.requesterId = (contactRequesterUrl.length) ? $(contactRequesterUrl).attr("href").split("requesterId=")[1].split("&")[0] : "";
		var durationToComplete = $(thisDoc).find("#duration_to_complete\\.tooltip--" + index);
		jobData.duration = (durationToComplete.length) ? $(durationToComplete).closest("tr").find(".capsule_field_text").text().trim() : "";
		jobData.durationParsed = getTimeLeft(jobData.duration);
		var assignedOn = $(thisDoc).find("#assigned_on\\.tooltip--" + index);
		jobData.assignedOn = (assignedOn.length) ? $(assignedOn).closest("tr").find(".capsule_field_text").text().trim() : "";
		var description = $(thisDoc).find("#description\\.tooltip--" + index);
		jobData.description = (description.length) ? $(description).closest("tr").find(".capsule_field_text").text().trim() : "";
		var qualifications = $(thisDoc).find("#qualifications\\.tooltip--" + index);
		jobData.qual = (qualifications.length) ? $(qualifications).closest("tr").find(".capsule_field_text").text().trim() : "";
		var keywords = $(thisDoc).find("#keywords\\.tooltip--" + index);
		listKeywords = (keywords.length) ? $(keywords).closest("tr").find(".capsule_field_text:first a") : "";
		if (listKeywords.length) $(listKeywords).each( function(key,value) { keywordsArray.push($(value).text()); } );
		jobData.keywords = (keywordsArray.length) ? keywordsArray.toString() : "";
		timeLeft = $(thisDoc).find("#time_left\\.tooltip--" + index);
		jobData.timeLeft = (timeLeft.length) ? $(timeLeft).closest("tr").find(".capsule_field_text").text().trim() : "";
		jobData.totalSeconds = (jobData.timeLeft!=="") ? convertTimeToSeconds(getTimeLeft(jobData.timeLeft)) : 0;
		jobData.timeData = convertSecondsToTimeData(jobData.totalSeconds);
		var hitsAvailable = $(thisDoc).find("#number_of_hits\\.tooltip--" + index);
		jobData.hitsAvailable = (hitsAvailable.length) ? $(hitsAvailable).closest("tr").find(".capsule_field_text").text().trim() : "";
		var rewardElement = $(thisDoc).find("#reward\\.tooltip--" + index);
		jobData.pay = (rewardElement.length) ? $(rewardElement).closest("tr").find(".reward").text().replace("$","").trim() : "";
		return jobData;
	} else if (requesterNameNode.length) {
        jobData.groupId = ($(thisDoc).find("form[name='hitForm']").length) ? $(thisDoc).find("form[name='hitForm']").eq(0).find("input[name='groupId']").eq(0).val() : "";
        jobData.requesterId = ($(thisDoc).find("form[name='hitForm']").length) ? $(thisDoc).find("form[name='hitForm']").eq(0).find("input[name='requesterId']").eq(0).val() : "";
        jobData.hitId = ($(thisDoc).find("form[name='hitForm']").length) ? $(thisDoc).find("form[name='hitForm']").eq(0).find("input[name='hitId']").eq(0).val() : "";
        var capsuleNode = $(thisDoc).find("td.capsulelink_bold:first div").eq(0); jobData.title = (capsuleNode.length) ? $(capsuleNode).html().trim() : "";
        timeLeft = $(thisDoc).find("a#time_left\\.tooltip"); jobData.duration = (timeLeft.length) ? timeLeft.parent().next().html().trim() : "";
		jobData.durationParsed = getTimeLeft(jobData.duration); jobData.timeData = getTimeLeft(jobData.duration); jobData.timeLeft = convertToTimeString(jobData.timeData);
		jobData.totalSeconds = convertTimeToSeconds(jobData.timeData);
        var requesterTip = $(thisDoc).find("#requester\\.tooltip"); requesterNameNode = (requesterTip.length) ? $(requesterTip).parent().next() : null;
        jobData.requesterName = (requesterNameNode.length) ? ( ($(requesterNameNode).find("a").length) ? $(requesterNameNode).find("a").html().trim() :
			$(requesterNameNode).html().trim() ) : "";
        var numberHitsTip = $(thisDoc).find("#number_of_hits\\.tooltip"); jobData.hitsAvailable = (numberHitsTip.length) ? numberHitsTip.parent().next().html().trim() : 0;
        var rewardTip = $(thisDoc).find("#reward\\.tooltip"); jobData.pay = (rewardTip.length) ? rewardTip.parent().next().find("span").html().replace("$","").trim() : "";
		jobData.continueURL = continueLink(jobData.hitId); jobData.returnURL = returnLink(jobData.hitId);
		return jobData;
	} else return null;
}
function doSortResultsTable(thisDoc,pageType) {
	var sortResultsTable = $(thisDoc).find("#sortresults_form").next("table"), jobDatas = [];
	$(sortResultsTable).find("> tbody > tr").each(function(i, row) { var returnData = grabJobData(row,i); jobDatas.push(returnData); jobData = null; });
	return jobDatas;
}
function createCloneButton(thetext,bgColor,theStyle,className) {
	var cloneButton = createSpanButton(function(e) {},className,thetext,bgColor,null,null,theStyle); return cloneButton;
}
function initCloneButton(hitRow,hitInfo,theData,className,hitNumber,theFunction) {
	var cloneButton = hitRow.getElementsByClassName(className)[0]; cloneButton.style.display = "inline-block";
	if (hitInfo) cloneButton.style.backgroundColor = hitInfo.hitCell.find("." + className).css("background-color");
	if (hitInfo) cloneButton.style.color = hitInfo.hitCell.find("." + className).css("color");
	cloneButton.setAttribute("data-hitNumber",hitNumber); cloneButton.setAttribute("data-theData",JSON.stringify(theData));
	$(cloneButton).on("click", function(e) { theFunction(e); });
}
function addAJob(e,thisData,once,collectNow,disableButtons,search) {
	thisData = (thisData) || JSON.parse(e.target.getAttribute("data-theData"));
	if (thisData.requesterId==="") search=false;
	if (thisData.groupId!=="" || search) {
		var newNumber = fillNewHitData(thisData.requesterName, thisData.requesterId, thisData.groupId, thisData.pay,
			thisData.title, thisData.duration, once, true, collectNow, (search) ? "search" : "panda");
		gMainData.hitCollection[newNumber].numberHits = thisData.hitsAvailable; theCycler.frontOfTheLine(newNumber);
		if (disableButtons && e) $(e.target).closest(".hitRow").find(".JRPandaButton,.JROnceButton,.JRAddJobButton").addClass("ui-state-disabled").off("click");
	}
}
function createHitRow(theData,buttons,dialogWidth,titleWidth,fromWhere) {
	var durationTime = (theData.duration != "Time") ? getTimeLeft(theData.duration) : theData.duration;
	var durationText = (theData.duration != "Time") ? ((durationTime) ? durationTime.hours + ":" + ("0" + durationTime.minutes).slice(-2) : "0.00") : theData.duration;
	var payText = (theData.pay) ? ((theData.pay == "Pay") ? theData.pay : "$" + theData.pay) : "0";
	var spanWidth = dialogWidth - titleWidth, hitRow = null;
	if (!gTemplateHitRow) {
		gTemplateHitRow = document.createElement('div');
		var commonSpanStyle = " border:1px solid black; display:inline-block; overflow:hidden; white-space: nowrap; box-sizing:content-box";
		gTemplateHitRow.className = "hitRow";
		if (fromWhere=="jobs") gTemplateHitRow.appendChild(createCheckbox2("JRCheckbox",null,"margin:-15px 2px 0 0; padding:0; display:inline-block;"));
		gTemplateHitRow.appendChild(createSpan2("column1","First","background-color:#FBF5E6; width:140px; text-align:right;" + commonSpanStyle));
		gTemplateHitRow.appendChild(createSpan2("column2","Second","background-color:#FCF6CF; width:" + spanWidth + "px; cursor:pointer;" + commonSpanStyle));
		gTemplateHitRow.appendChild(createSpan2("column3","Third","background-color:#F0FFFF; width:35px;" + commonSpanStyle));
		if (fromWhere=="mturk") gTemplateHitRow.appendChild(createSpan2("column3.1","4th","background-color:#F5F5DC; width:40px;" + commonSpanStyle));
		gTemplateHitRow.appendChild(createSpan2("column4","5th","background-color:#7FFFD4; width:40px;" + commonSpanStyle));
		gTemplateHitRow.appendChild(createCloneButton("Collect",gButtonOffBgColor," overflow:hidden; display:none; height:12px; line-height:12px;box-sizing:content-box","JRCollectButton"));
		gTemplateHitRow.appendChild(createCloneButton("Details",gButtonOffBgColor," overflow:hidden; display:none; height:12px; line-height:12px;box-sizing:content-box","JRDetailsButton"));
		gTemplateHitRow.appendChild(createCloneButton("Panda",gButtonOffBgColor," overflow:hidden; display:none; height:12px; line-height:12px;box-sizing:content-box","JRPandaButton"));
		gTemplateHitRow.appendChild(createCloneButton("Once",gButtonOffBgColor," overflow:hidden; display:none; height:12px; line-height:12px;box-sizing:content-box","JROnceButton"));
		gTemplateHitRow.appendChild(createCloneButton("Add",gButtonOffBgColor," overflow:hidden; display:none; height:12px; line-height:12px;box-sizing:content-box","JRAddJobButton"));
	}
	if (gTemplateHitRow) {
		if (fromWhere=="mturk" || theData.duration == "Time" || (fromWhere=="jobs" && parseInt(theData.jobNumber) in gMainData.hitCollection)) {
			hitRow = gTemplateHitRow.cloneNode(true);
			hitRow.getElementsByClassName("column1")[0].textContent = (theData.friendlyRName && theData.friendlyRName!=="") ? theData.friendlyRName : theData.requesterName;
			hitRow.getElementsByClassName("column2")[0].textContent = (theData.friendlyTitle && theData.friendlyTitle!=="") ? theData.friendlyTitle : theData.title;
			hitRow.getElementsByClassName("column3")[0].textContent = durationText;
			if (fromWhere=="mturk") hitRow.getElementsByClassName("column3.1")[0].textContent = theData.hitsAvailable;
			hitRow.getElementsByClassName("column4")[0].textContent = payText;
			if (fromWhere=="jobs" && theData.jobNumber != "-1" && theData.duration != "Time") {
				var hitInfo = gMainData.hitCollection[parseInt(theData.jobNumber)];
				initCloneButton(hitRow,hitInfo,theData,"JRCollectButton",theData.jobNumber,function(e) {
						var theClone = gMainData.hitCollection[e.target.getAttribute("data-hitNumber")].hitCell.find(".JRCollectButton")[0];
						$(theClone).click(); $(e.target).css({"background-color":$(theClone).css("background-color"),"color":$(theClone).css("color")});
					});
				initCloneButton(hitRow,hitInfo,theData,"JRDetailsButton",theData.jobNumber,function(e) {
						var hitNumber = e.target.getAttribute("data-hitNumber");
						showEditHitDialog(hitNumber,$(e.target),function() { $("#JREditDialog").dialog( "close"); });
					});
				var theCheckbox = hitRow.getElementsByClassName("JRCheckbox")[0];
				theCheckbox.setAttribute("data-hitNumber",theData.jobNumber);
			} else if (fromWhere=="jobs" && theData.duration == "Time") {
				hitRow.getElementsByTagName("input")[0].addEventListener("click", function(e) {
					$(e.target).closest(".searchingResultsArea").find("input").prop("checked",$(e.target).prop("checked"));
				});
			} else if (fromWhere=="mturk" && theData.duration != "Time") {
				initCloneButton(hitRow,null,theData,"JRPandaButton",theData.jobNumber,function(e) { addAJob(e,null,false,true,true,false); });
				initCloneButton(hitRow,null,theData,"JROnceButton",theData.jobNumber,function(e) { addAJob(e,null,true,true,true,false); });
				initCloneButton(hitRow,null,theData,"JRAddJobButton",theData.jobNumber,function(e) { addAJob(e,null,false,false,true,false); });
			}
		} else { delete gRequestersData[parseInt(theData.jobNumber)]; gDelayedSave=true; }
	}
	return hitRow;
}
function historyUnique(searchData,requestersInfo,historyLimit) {
	var searchHistory = searchData.theHistory, historyArray = searchData.searchOptions.historyArray, returnValue = false;
	if (searchHistory[requestersInfo.groupId]) { searchHistory[requestersInfo.groupId].date = new Date(); returnValue = false; }
	else { searchHistory[requestersInfo.groupId] = {"info":requestersInfo,"date":new Date()}; historyArray.push(requestersInfo.groupId); returnValue = true; }
	if (historyArray.length>historyLimit) {
		var removeThese = historyArray.splice(0, historyArray.length-historyLimit);
		for (var i=0, len=removeThese.length; i<len; i++) { delete searchHistory[removeThese[i]]; }
	}
	gDelayedSave = true;
	return returnValue;
}
function doResultsJSON(theData) {
	var jobData = {}, jobDatas = [], projectData = {}, theResults = null, requesterSearch = ("total_num_results" in theData) ? true : false;
	if (requesterSearch) theResults = theData.results; else theResults = theData.tasks;
	for (var i=0,len=theResults.length; i<len; i++) {
		projectData = (requesterSearch) ? theResults[i] : theResults[i].project;
		jobData = jQuery.extend(true, {}, gJobDataDefault);
		jobData.requesterName=projectData.requester_name; jobData.title=projectData.title; jobData.requesterId=projectData.requester_id;
		jobData.hitId=theResults[i].assignment_id; jobData.totalSeconds=projectData.assignment_duration_in_seconds; jobData.description=projectData.description;
		jobData.durationParsed=convertSecondsToTimeData(jobData.totalSeconds); jobData.duration=convertToTimeString(jobData.durationParsed);
		jobData.timeData=convertSecondsToTimeData(theResults[i].time_to_deadline_in_seconds); jobData.timeLeft=convertToTimeString(jobData.timeData);
		jobData.hitsAvailable=projectData.assignable_hits_count; jobData.pay=parseFloat(projectData.monetary_reward.amount_in_dollars).toFixed(2);
		jobData.continueURL="https://worker.mturk.com" + theResults[i].task_url; jobData.returnURL = ""; jobData.groupId=projectData.hit_set_id;
		jobDatas.push(jobData); jobData={};
	}
	return jobDatas;
}
function checkSearchOptions(searchOptions,requestersData) {
	if (!searchOptions) return true;
	var allExcludeGID = "," + searchOptions.excludeGID[0] + ",";
	if (searchOptions.excludeGID.length && allExcludeGID.indexOf("," + requestersData.groupId + ",") != -1) return false;
	if (searchOptions.maxReward && searchOptions.maxReward!="0.00" && parseFloat(requestersData.pay) > parseFloat(searchOptions.maxReward)) return false;
	if (searchOptions.excludeTerm.length && searchOptions.excludeTerm[0] !== "" && requestersData.title.toLowerCase().indexOf(searchOptions.excludeTerm[0].toLowerCase()) != -1)
		return false;
	if (searchOptions.includeTerm.length && searchOptions.includeTerm[0] !== "" && requestersData.title.toLowerCase().indexOf(searchOptions.includeTerm[0].toLowerCase()) == -1)
		return false;
	return true;
}
function parseHitSearchPage(theResult,theNumber,searchWhere) {
	var theData = null, searchArea = null, jsonReceived = (theResult.responseHeaders.indexOf("application/json") != -1) ? true : false;
    var hitInfo = (theNumber>0) ? gMainData.hitCollection[theNumber] : null, hitData = (hitInfo) ? hitInfo.data : null, finalUrl = theResult.finalUrl;
	var parser = new DOMParser(), xmlDoc = (!jsonReceived) ? parser.parseFromString(theResult.responseText,"text/html") : null;
	searchArea = (searchWhere=="mturk") ? $("#JRSavedMturkArea1") : $("#JRSavedJobsArea1");
	if (!jsonReceived) {
		var errorTitle_Array = xmlDoc.getElementsByClassName("error_title"), errorTitle = (errorTitle_Array.length) ? errorTitle_Array[0] : null;
		if (errorTitle && errorTitle.innerHTML.indexOf("You have exceeded the maximum allowed page request rate") != -1) {
			processResults( theNumber, "TOOFAST", finalUrl );
			parser = null; xmlDoc = null; errorTitle_Array = null; errorTitle = null; searchArea = null;
			return;
		} else if (errorTitle && errorTitle.innerHTML.indexOf("Your search did not match any HITs") != -1) {
			if (theNumber<=0) {
				$(searchArea).find(".searchingResultsArea").html("");
				$(searchArea).find(".searchingResultsArea").append(createDiv("Nothing Found! Sorry.").css({"font-size":"25px","margin-top":"200px","text-align":"center"}));
				gSavedSearchArea = "";
			}
			parser = null; xmlDoc = null; errorTitle_Array = null; errorTitle = null; searchArea = null;
			return;
		}
	} else { theData = theResult.response; }
	if (theData && "error" in theData) { processResults( theNumber, "TOOFAST", finalUrl ); return; }
	var requestersInfo = (jsonReceived) ? doResultsJSON(theData) : doSortResultsTable(xmlDoc), goUrl = "";
	if (requestersInfo.length > 0) {
		if (gMainOptions.debugger>1) console.log("JR HitsearchPage : I found some hits: " + requestersInfo.length); // debugger >1 for SearchPage details
		if (theNumber<=0) {
			$(searchArea).find(".searchingResultsArea").html("");
			var captions = {"requesterName":"Requester Name","title":"Hit Title","duration":"Time","hitsAvailable":"# Hits","pay":"Pay","collect":"caption"};
			var dialogWidth = $("#JRjqModalDialog-Search").width();
			$(searchArea).find(".searchingResultsArea").append(createHitRow(captions,false,dialogWidth,450,searchWhere));
			$(searchArea).find(".searchingResultsArea").append(createDiv()
				.css({"margin-left":"5px","margin-top":"0px","background-color":"black","height":"6px","width":(dialogWidth - 145) + "px"}));
			for (var ii=0, len1=requestersInfo.length; ii<len1; ii++) {
				$(searchArea).find(".searchingResultsArea").append(createHitRow(requestersInfo[ii],true,dialogWidth,450,searchWhere));
				gSavedSearchArea = $(searchArea).find(".searchingResultsArea").html();
			}
			$(searchArea).find(".JRTotalFound").html("Found " + requestersInfo.length + " Jobs");
		} else {
			for (var i=0, goTo=0, len=requestersInfo.length; (i<len && goTo<3); i++) { // Only go to the first 3 highest paid hits for requester.
				if (checkSearchOptions(hitData.searchData.searchOptions,requestersInfo[i])) {
					if (!hitInfo.newHitsFound) hitInfo.status.foundHits++;
					if ( historyUnique(hitData.searchData,requestersInfo[i],12) ) hitInfo.status.foundHits++;
					goUrl = (hitData.action.toLowerCase()=="searchandfilter" || hitData.action.toLowerCase()=="searchpantha") ?
						previewLink(requestersInfo[i].groupId) : (gNewSite) ? pandaLinkNew(requestersInfo[i].groupId) : pandaLink(requestersInfo[i].groupId);
					if ( gMainData.fastSearch && !hitInfo.newHitsFound && goTo===0) requestUrl(goUrl,theNumber,parseMturkHitPage, errorRequest);
					else hitInfo.goToUrl.push({"url":goUrl,"theNumber":theNumber,"groupId":requestersInfo[i].groupId,"title":requestersInfo[i].title});
					goTo++;
					hitInfo.newHitsFound=true;
				}
			}
			if (hitInfo.newHitsFound) {
				updateHitCell(theNumber);
				hitData.groupId = requestersInfo[0].groupId; hitInfo.pandaNewUrl = pandaLinkNew(hitData.groupId); hitInfo.pandaUrl = pandaLink(hitData.groupId);
				hitInfo.previewUrl = previewLink(hitData.groupId); hitInfo.newTitle = requestersInfo[0].title;
				if ( hitInfo.ham == "paused" && requestersInfo.length==1 ) { saveGroupIdSearching(hitInfo,true); toggleButton($("#JRHamB_" + theNumber),hamOn,hamOff); }
				if (hitInfo.goToUrl.length) theCycler.frontOfTheLine(theNumber);
				hitInfo.newHitsFound=false;
			}
		}
		requestersInfo = null;
	} else if (theNumber<=0) {
		$(searchArea).find(".searchingResultsArea").html("");
		$(searchArea).find(".searchingResultsArea").append(createDiv("Nothing Found"));
	} else hitInfo.newHitsFound=false;
	parser = null; xmlDoc = null; searchArea = null; goUrl = null;
}
function prepareQueueData() {
	var thisKey = "", tempCount = {};
	for (var i=0,len=gQueueData.length; i<len; i++) {
		thisKey = gQueueData[i].requesterName + "::" + gQueueData[i].title + "::" + gQueueData[i].pay;
		tempCount[thisKey] = (thisKey in tempCount) ? tempCount[thisKey]+1 : 1;
	}
	$.each(gQueueCount, function( index, value ) { delete gQueueCount[index]; });
	gQueueCount = jQuery.extend(true, {}, tempCount);
}
function parseQueuePage(theResult,theNumber) {
	var theData = null, jsonReceived = (theResult.responseHeaders.indexOf("application/json") != -1) ? true : false;
	if (!jsonReceived) {
		var parser = new DOMParser(), finalUrl = theResult.finalUrl, xmlDoc = parser.parseFromString(theResult.responseText,"text/html");
		var errorTitle = xmlDoc.getElementsByClassName("error_title")[0], loggedOff1 = xmlDoc.getElementById("ap_signin_custom_message");
		var loggedOff3 = xmlDoc.getElementById("signin-slot");
		if (loggedOff1 || loggedOff3) { processResults( theNumber, "LOGGEDOFF", finalUrl ); parser = null; xmlDoc = null; return; }
		if (errorTitle) {
			var errorTitleHTML = errorTitle.innerHTML;
			if ( errorTitleHTML.indexOf("There are currently no HITs") != -1 ||
				errorTitleHTML.indexOf("You do not currently have any HITs") != -1) {
					gMainData.hitsInQueue = 0;
					gQueueData.splice(0,gQueueData.length);
					$.each(gQueueCount, function( index, value ) { delete gQueueCount[index]; });
			} else if ( errorTitleHTML.indexOf("You have exceeded the maximum allowed page request rate") != -1 ) {
				processResults( theNumber, "TOOFAST", finalUrl );
				theCycler.frontOfTheLineTimer(-1);
				parser = null; xmlDoc = null; errorTitle = null; return;
			}
		} else {
			var titleOrangeText = xmlDoc.getElementsByClassName("title_orange_text")[0];
			var thisKey = "", newValue=0, tempCount = {};
			if (titleOrangeText) {
				var words = titleOrangeText.innerHTML.trim().split(' ');
				if ($.isNumeric(words[words.length - 2])) gMainData.hitsInQueue = parseInt(words[words.length - 2]);
				words = null;
			}
			gQueueData.splice(0,gQueueData.length); gQueueData = doSortResultsTable(xmlDoc); prepareQueueData();
			titleOrangeText = null;
		}
	} else {
		theData = JSON.parse(theResult.response); gQueueData.splice(0,gQueueData.length); gQueueData = doResultsJSON(theData); prepareQueueData();
	}
	if (gMainData.hitsInQueue <=20) {
		gFullQueue = false;
		if (gFullQueueTimer) clearTimeout(gFullQueueTimer);
	}
	gLastQueueCheck = new Date();
	displayMainStatus();
	for (var ic=0,len1=queueDelay.length; ic<len1; ic++) { addToQueueWatch(queueDelay[ic]); }
	queueDelay.splice(0,queueDelay.length);
	displayQueueStatus(true);
	gSendQueue = true;
	gQueueCheckinProgress=false;
}
function parseZingHitPage(theResult,theNumber,formData) {
    var parser = new DOMParser(), xmlDoc = parser.parseFromString(theResult.responseText,"text/html"), hitInfo = gMainData.hitCollection[theNumber];
    var hitData = hitInfo.data, finalUrl = theResult.finalUrl, thisZingOptions = gZingOptions[hitData.pay];
    thisZingOptions = (gZingOptions[hitData.pay]) ? gZingOptions[hitData.pay] : gZingOptions["0.01"];
    var goAccept = false, theSearching = $(xmlDoc).find(".row-fluid .span6").eq(0), receiptItemsCount = $(theSearching).find(".receipt_items .fieldswrapper").length;
    var inputCount = $(theSearching).find("input[type=text]").length, multipleQuantityCount = $(theSearching).find("input[type=text].multiple_quantity").length;
    var codesCount = inputCount - 1 - multipleQuantityCount, thePicturesCount = $(xmlDoc).find(".receipt_images").eq(0).find("img").length;
    var limitReceptItems = thisZingOptions.SearchGroupAllowed, limitTallyCount = thisZingOptions.TallyCountTotalAllowed;
    var limitCodes = (thisZingOptions.AcceptCodesSearching) ? 10 : 0, limitImages = thisZingOptions.MaxReceiptImages;
    if (receiptItemsCount <= limitReceptItems && multipleQuantityCount <= limitTallyCount && codesCount <= limitCodes && thePicturesCount <= limitImages) goAccept = true;
    if ( goAccept ) {
		var acceptHitURL = acceptLink(formData);
		hitInfo.goToUrl.push({"url":acceptHitURL,"theNumber":theNumber});
		theCycler.frontOfTheLine(theNumber);
    } else processResults( theNumber, "SKIPPED", finalUrl );
	parser = null; xmlDoc = null;
}
function parseNewHitPageWarning(newAlerts) {
	var reactProps = [], returnString = "";
	for (var i=0, len=newAlerts.length; i<len; i++) {
		reactProps = newAlerts[i].dataset.reactProps;
		if (reactProps) {
			var reactInfo = JSON.parse(reactProps);
			returnString += reactInfo.header + " | ";
		}
	}
    return returnString;
}
function parseNewHitPageRequesters(projectDetailBar,finalUrl) {
	var jobData = jQuery.extend(true, {}, gJobDataDefault);
	var tempPrevDiv = projectDetailBar[0].getElementsByClassName("col-sm-4 col-xs-5");
	if (tempPrevDiv.length===0) tempPrevDiv = projectDetailBar[0].getElementsByClassName("col-md-6 col-xs-12"); // col-md-6 col-xs-12
	var reactInfo = tempPrevDiv[0].querySelector("div").dataset.reactProps;
	if (reactInfo) {
		reactInfo = JSON.parse(reactInfo).modalOptions;
		var contactRequesterUrl = reactInfo.contactRequesterUrl, contactVar = (contactRequesterUrl.indexOf("requester_id") != -1) ? "requester_id%5D=" : "requesterId=";
		jobData.hitsAvailable = reactInfo.assignableHitsCount; jobData.requesterName = reactInfo.requesterName; 
		jobData.hitId = finalUrl.split("assignment_id=")[1].split("&")[0]; jobData.continueURL = finalUrl; jobData.returnURL = "";
		tempContact = contactRequesterUrl.split(contactVar); if (tempContact.length) jobData.requesterId = contactRequesterUrl.split(contactVar)[1].split("&")[0];
		jobData.totalSeconds = reactInfo.assignmentDurationInSeconds; jobData.timeData = convertSecondsToTimeData(jobData.totalSeconds); jobData.title = reactInfo.projectTitle;
		jobData.timeLeft = convertToTimeString(jobData.timeData); jobData.pay = parseFloat(reactInfo.monetaryReward.amountInDollars).toFixed(2);
		jobData.duration = jobData.timeLeft;
	}
	return jobData;
}
function checkUpdateData(theNumber,requestersInfo) {
	var hitInfo = gMainData.hitCollection[theNumber], hitData = hitInfo.data, updated = false;
	if (hitData.title != requestersInfo.title) { hitData.title = requestersInfo.title; updated=true; }
	if (hitData.duration != requestersInfo.duration) { hitData.duration = requestersInfo.duration; updated=true; }
	if (hitData.requesterName != requestersInfo.requesterName) { hitData.requesterName = requestersInfo.requesterName; updated=true; }
	if (hitData.pay != requestersInfo.pay) { hitData.pay = requestersInfo.pay; updated=true; }
	hitInfo.hitId = requestersInfo.hitId; hitInfo.numberHits = requestersInfo.hitsAvailable;
	if (updated) gDelayedSave = true;
}
function parseMturkHitPage(theResult,theNumber) {
    var hitInfo = gMainData.hitCollection[theNumber], parser = new DOMParser(), finalUrl = theResult.finalUrl, mturkLimit = false, pageRWQ = gQueueCheckinProgress;
    var htmlDoc = parser.parseFromString(theResult.responseText,"text/html"), errorTitle = htmlDoc.getElementsByClassName("error_title")[0];
    if (htmlDoc.getElementsByClassName("error-page").length) errorTitle = htmlDoc.getElementsByClassName("error-page")[0];
    if (errorTitle && errorTitle.innerHTML.indexOf("You have exceeded the") != -1) {
		processResults( theNumber, "TOOFAST", finalUrl );
		parser = null; htmlDoc = null; errorTitle = null; return;
	}
    var mainContent_New = htmlDoc.getElementById("MainContent"), colxspush1 = htmlDoc.getElementsByClassName("col-xs-push-1"), newAlerts = [];
    var loggedOff1 = htmlDoc.getElementById("ap_signin_custom_message");
    var loggedOff3 = htmlDoc.getElementById("signin-slot");
    var loggedOff4 = (finalUrl.indexOf("www.amazon.com/ap/signin") != -1);
    if (loggedOff4) { processResults( theNumber, "LOGGEDOFF", finalUrl ); parser = null; htmlDoc = null; return; }
	if (colxspush1.length) {
		if ( colxspush1[0].innerHTML.indexOf("You must upgrade your browser to continue.") != -1 ) newAlerts = colxspush1[1].querySelectorAll("div");
		else newAlerts = colxspush1[0].querySelectorAll("div");
	}
	var projectDetailBar = htmlDoc.getElementsByClassName("project-detail-bar"), requestersInfo = {}, updated = false;
    if (htmlDoc.getElementById("alertboxHeader") || htmlDoc.getElementById("alertBox") || (newAlerts.length && projectDetailBar.length===0) ) {
		var alertHeaderHTML = "";
		if (htmlDoc.getElementById("alertboxHeader")) alertHeaderHTML = htmlDoc.getElementById("alertboxHeader").innerHTML;
		else if (htmlDoc.getElementById("alertBox")) alertHeaderHTML = htmlDoc.getElementById("alertBox").innerHTML;
		else alertHeaderHTML = parseNewHitPageWarning(newAlerts);
        mturkLimit = (alertHeaderHTML.indexOf("Please try again tomorrow.") != -1) || (alertHeaderHTML.indexOf("You cannot work on any more Tasks today") != -1);
        if (!mturkLimit && alertHeaderHTML.indexOf("There are no") != -1) {
            processResults( theNumber, "NOMORE", finalUrl ); parser = null; htmlDoc = null; errorTitle = null; return;
        } else if (alertHeaderHTML.indexOf("has chosen to prevent you from working on any of this Requester") != -1) {
            processResults( theNumber, "BLOCKED", finalUrl ); parser = null; htmlDoc = null; errorTitle = null; return;
        } else if (alertHeaderHTML.indexOf("You have too many HITs already") != -1 || alertHeaderHTML.indexOf("Your Task Queue is full") != -1 ||
				alertHeaderHTML.indexOf("You have accepted the maximum number") != -1) {
            processResults( theNumber, "QUEUEMAX", finalUrl ); parser = null; htmlDoc = null; errorTitle = null; return;
        } else if (alertHeaderHTML.indexOf("You have already accepted this HIT") != -1) {
            processResults( theNumber, "ALREADYACCEPT", finalUrl ); parser = null; htmlDoc = null; errorTitle = null; return;
        } else if (alertHeaderHTML.indexOf("The HIT you were viewing could not be accepted") != -1) {
            processResults( theNumber, "NOACCEPT", finalUrl ); parser = null; htmlDoc = null; errorTitle = null; return;
        } else if (alertHeaderHTML.indexOf("You are not qualified to accept") != -1 || alertHeaderHTML.indexOf("Your Qualifications do not meet the") != -1 ||
			alertHeaderHTML.indexOf("The Project has required Qualifications") != -1 || alertHeaderHTML.indexOf("This HIT requires Qualifications") != -1) {
				processResults( theNumber, "NOTQUALIFIED", finalUrl ); parser = null; htmlDoc = null; errorTitle = null; return;
        }
    }
	hitInfo.status.notQual = 0; hitInfo.status.blocked = 0;
	if (htmlDoc.querySelector('img[src^="https://opfcaptcha-prod.s3.amazonaws.com/"]')) {
		gMainData.captchaCounter=0;
		if (!gMainOptions.disableCaptchaAlert) {
			var pandaLink = (gNewSite) ? hitInfo.pandaNewUrl : hitInfo.pandaUrl;
			var addText = createDiv("Found a captcha when<br>trying to get <strong>" + hitInfo.data.requesterName + "</strong><br>Pausing script.")
				.css({"margin-top":"30px","line-height":"20px","font-size":"18px","text-align":"center","color":"red"})
				.append(createDiv(createLink("Try panda link to fill in panda.",pandaLink,"_blank",pandaLink)
					.click( function(e) {
						gJRPOP = window.open($(e.target).attr("href"),"_blank","width=" + 1200 + ",height=" +  900 + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
						return false;
					})).css({"color":"blue","margin-top":"15px"}));
			showWaitDialog("Captcha Alert!!","",function() {
				theCycler.unpause();
				$("#JRPauseButton").html("Pause").css({"background-color":"ivory","color":"black"});
			},null,addText,true);
			if (!theCycler.isPaused()) {
				theCycler.pause();
				$("#JRPauseButton").html("Resume").css({"background-color":"red","color":"white"});
				if (gNotifications) showNotification( "ALERT: Captcha ALERT!", "Just found a captcha so you better go fill it in as soon as possible!",
					"captcha", "3ALERT3", true);
				if (!gSoundOptions.hasToPause.mute) playThisSound("hasToPause");
				else if (gSoundOptions.hasToPause.tts) speakThisNow("Found a captcha! Paused.");
			}
		}
		parser = null; htmlDoc = null; return;
	}
    var hitAccepted = $(htmlDoc).find("img[src$='/media/return_hit.gif']"), notAccepted = $(htmlDoc).find("input[src$='/media/accept_hit.gif']"), hitData = hitInfo.data;
    if (errorTitle && errorTitle.innerHTML.indexOf("Your request was not completed successfully") != -1) {
        processResults( theNumber, "NOTCOMPLETED", finalUrl );
    } else if (mturkLimit) {
        processResults( theNumber, "DAILYLIMIT", finalUrl );
    } else if (hitAccepted.length) {
		requestersInfo = grabJobData(htmlDoc); checkUpdateData(theNumber,requestersInfo);
        processResults( theNumber, "ACCEPTED", finalUrl, pageRWQ, requestersInfo );
        if (gMainOptions.debugger>1) console.log("accepted: " + theNumber + " | updated: " + updated + " | groupId: " + hitData.groupId); // debugger >1 for accepting stats
	} else if (projectDetailBar.length) {
		var authenticity_Token = htmlDoc.querySelector("input[name='authenticity_token']").value;
		requestersInfo = parseNewHitPageRequesters(projectDetailBar,finalUrl); checkUpdateData(theNumber,requestersInfo);
        processResults( theNumber, "ACCEPTED", finalUrl, pageRWQ, requestersInfo );
        if (gMainOptions.debugger>1) console.log("accepted: " + theNumber + " | updated: " + updated + " | groupId: " + hitData.groupId); // debugger >1 for accepting stats
    } else if (notAccepted.length) {
        var formData = {};
        formData.hitId = htmlDoc.getElementsByName("hitId")[0].value; formData.prevHitSubmitted = htmlDoc.getElementsByName("prevHitSubmitted")[0].value;
        formData.prevRequester = htmlDoc.getElementsByName("prevRequester")[0].value; formData.requesterId = htmlDoc.getElementsByName("requesterId")[0].value;
        formData.prevReward = htmlDoc.getElementsByName("prevReward")[0].value; formData.groupId = htmlDoc.getElementsByName("groupId")[0].value;
        formData.signature = htmlDoc.getElementsByName("signature")[0].value;
        var iframeSrc = $(htmlDoc).find("iframe").attr("src"), acceptHitURL = acceptLink(formData), useAcceptHit = false;
        if (iframeSrc && formData.requesterId=="AGVV5AWLJY7H2") {
			if (hitData.filterMode>0 && hitData.filterMode <= Object.keys(gZingFuncOptions).length) {
				requestUrl(iframeSrc, theNumber, gZingFuncOptions[hitData.filterMode].functionName, errorRequest, formData);
			} else { useAcceptHit = true;}
		}
        if (hitData.action.toLowerCase().indexOf("pantha")!=-1 || useAcceptHit) {
			if (gMainOptions.fastPantha) requestUrl(acceptHitURL,theNumber,parseMturkHitPage, errorRequest);
			else { hitInfo.goToUrl.push({"url":acceptHitURL,"theNumber":theNumber}); theCycler.frontOfTheLine(theNumber); }
			if ( hitInfo.ham == "paused" ) toggleButton($("#JRHamB_" + theNumber),hamOn,hamOff);
		}
    } else { console.log("I have no idea what that was"); processResults( theNumber, "ERROR", finalUrl ); }
	parser = null; htmlDoc = null; hitAccepted = null; errorTitle = null; notAccepted = null;
}

function makeStatus() { return {"accepted":0,"skipped":0,"errors":0,"tooFast":0,"noHits":0,"fullQueue":0,"hitsStreak":0,"foundHits":0,
		"noHitsStreak":0,"searched":0,"orphan":0,"hitsResults":0,"notQual":0,"missed":0,"blocked":0,"reachedLimit":false}; }
function makeCollection(pandaUrl,previewUrl,theNumber,theData,addStatus,filterFuncData,tabIndex,pandaNewUrl) { return {"collecting":"off","pandaUrl":pandaUrl,
		"previewUrl":previewUrl,"goToUrl":[],"theNumber":theNumber,"data":theData,"status":(addStatus) ? makeStatus(): null,"specialOptions":null,"hitCell":null,
		"ham":"off","minutes":0,"newTitle":"","numberHits":"0","once":false,"filterFuncData":filterFuncData,"searching":"off","lastAccept":null,"newHitsFound":false,
		"tabIndex":tabIndex,"hitId":"","durationParsed":null,"dateDone":null,"elapsedSeconds":0,"pandaNewUrl":pandaNewUrl};
}
function addHitCollection(theData,theNumber,tabIndex) {
    var pandaNewUrl = pandaLinkNew(theData.groupId), pandaUrl = pandaLink(theData.groupId), previewUrl = previewLink(theData.groupId);
    var filterFuncData = (theData.action.toLowerCase().indexOf("filter") != -1) ? ((theData.requesterId=="AGVV5AWLJY7H2") ? gZingFuncOptions : null) : null;
	gMainData.hitCollection[theNumber] = makeCollection(pandaUrl,previewUrl,theNumber,theData,true,filterFuncData,tabIndex,pandaNewUrl);
    return theNumber;
}
function addQueueCheck() {
    theCycler.addJob( function( elapsed, theNumber ) {
		gQueueCheckinProgress=true; gMainData.queueStatus.searched++; var acceptText = null;
		var searchUrl = "https://www.mturk.com/mturk/sortmyhits?searchSpec=HITSearch%23T%231%2310%23-1%23T%23!Status!0!rO0ABXQACEFzc2lnbmVk!%23!Deadline!0!%23!&selectedSearchType=" + "hitgroups&searchWords=&sortType=Deadline%3A0&pageSize=25&doNotRedirect=true";
		if (gNewSite) { searchUrl = "https://worker.mturk.com/tasks"; acceptText = "application/json"; }
        requestUrl(searchUrl,1,function(theResult) { displayMainStatus(); return parseQueuePage(theResult); },function() { errorRequest(); }, null, null, null, acceptText );
        return true;
    }, -1, gMainOptions.queueTimer);
}
function popupClosed() {
	gJRPOP = null;
	if ($("#JRWaitDialog").dialog('isOpen') === true) { $("div[aria-describedby='JRWaitDialog'] .ui-dialog-buttonpane button:contains('Unpause')").click(); }
}
function addExternalScriptCheck() {
    gExtInterval = setInterval( function() {
		var sendQueue=null, sendPE=null, needQueue=false, sStr='JR_message_', eStr='_pandacrazy', numId=0;
		if ((Object.keys(gExternalData)).length) {
			for (var key in gExternalData) {
				if (!gExternalData[key].gotPong) {
					if (gExternalData[key].timeCount>20) {
						numId = gExternalData[key].numId; gExternalData[key].timeCount=0; delete gExternalData[key];
						localStorage.removeItem(sStr+'D_'+numId+eStr); localStorage.removeItem(sStr+'S_'+numId+eStr);
						localStorage.removeItem(sStr+'pong_'+numId+eStr); localStorage.removeItem(sStr+'send_'+numId+eStr);
					}
					else gExternalData[key].timeCount++;
				} else { gExternalData[key].gotPong=false; gExternalData[key].timeCount=0; }
			}
			if (needQueue || gSendQueue) { sendQueue=gQueueData; sendPE=gMainData.projectedEarnings; gSendQueue=false; }
			sendPingMessage("",{"queue":sendQueue,"queueChanged":false,"PE":sendPE},null);
		}
		try { if (gJRPOP !== null && gJRPOP.closed) popupClosed(); } catch (e) { popupClosed(); }
    }, 800);
}
function startCollecting(theNumber,thisButton) {
    var hitInfo = gMainData.hitCollection[theNumber], hitData = hitInfo.data; hitInfo.collecting = "on";
	if (hitData.dailyLimit && hitData.dailyLimit>0) hitData.dailyDone = (gMturkDate == hitData.day) ? hitData.dailyDone : 0;
    if (hitData.once) hitData.oneDone = 0;
    theCycler.addJob( function( elapsed, theNumber ) {
        var hitInfo = gMainData.hitCollection[theNumber], hitData = hitInfo.data, hitStatus = hitInfo.status, thisNewDate = new Date();
		var newDateString = formatAMPM("onlydate",new Date()); hitData.day = newDateString;
		if (gRapidSuppress.counter>0) gRapidSuppress.counter--;
		else { gRapidSuppress.jobNumber=-1; gRapidSuppress.counter=0; }
        if (hitInfo.ham == "ontimed") {
            if (hitData.hamTimer > 0 && hitInfo.lastAccept!==null) {
                var accElapsedTime = thisNewDate - hitInfo.lastAccept, theSeconds = accElapsedTime / 1000, offHamMode = (hitInfo.ham == "ontimed") ? "paused" : "off";
                if (theSeconds >= hitData.hamTimer) { toggleButton($("#JRHamB_" + theNumber),hamOn,hamOff,offHamMode); hitInfo.lastAccept = null; }
            }
        }
		var checkJob = checkJobMode(theNumber);
        if ( checkLimits(theNumber) && checkJob ) {
			if (hitStatus.reachedLimit) {
				hitStatus.reachedLimit = false; $("#JRCellNum_" + theNumber).stop(true,true);
				$("#JRCellNum_" + theNumber).css({"background-color":$("#JRCellNum_" + theNumber).data("backgroundColor")});
			} else $("#JRCellNum_" + theNumber).css({"background-color":$("#JRCellNum_" + theNumber).data("backgroundColor")});
			var theUrl = "", hitDataAction = hitData.action.toLowerCase();
			hitInfo.elapsedSeconds = (hitInfo.dateDone) ? (Math.round( ((thisNewDate - hitInfo.dateDone)/1000) * 10 ) / 10) : 0;
			hitInfo.dateDone = thisNewDate; hitStatus.searched++;
			if (hitDataAction.substring(0,6) == "search" && hitData.searchData===null) hitData.searchData = setSearchOptionsDefault();
			var searchOptions = hitData.searchData.searchOptions, useSearch = (hitDataAction.substring(0,6) == "search") ? true : false;
			var acceptText = (gNewSite) ? "application/json" : null;
            if (hitInfo.goToUrl.length) {
				useSearch = false;
                if ( (hitDataAction.substring(0,6) == "search" || hitDataAction == "filterpanda" || hitDataAction == "pantha") && !hitInfo.hitCell.data("saveSearchGroupId") )
                    theUrl = (hitInfo.goToUrl.shift()).url;
                else theUrl = (hitInfo.goToUrl[0]).url;
            } else {
                theUrl = ( hitDataAction == "panda" ) ? ( (gNewSite) ? hitInfo.pandaNewUrl : hitInfo.pandaUrl) :
					(useSearch && !gNewSite) ? requesterSearch(hitData.requesterId,searchOptions.minReward) :
					(useSearch && gNewSite) ? requesterSearchNew(hitData.requesterId,searchOptions.minReward) : (gNewSite) ? hitInfo.pandaNewUrl : hitInfo.previewUrl;
            }
            gMainData.searched++;
            gMainData.lastElapsed = elapsed;
            if (gMainOptions.debugger>1) console.log("Doing Number: " + theNumber + " | going to: " + theUrl); // debugger >1 for doing details
            if (useSearch) requestUrl(theUrl,theNumber,parseHitSearchPage, errorRequest, hitStatus.searched, null, "json", acceptText);
            else requestUrl(theUrl,theNumber,parseMturkHitPage, errorRequest, hitStatus.searched);
			if (gNewOldSite) requestUrl(hitInfo.pandaNewUrl,theNumber,parseMturkHitPage, errorRequest, hitStatus.searched); // gNewOldSite for both new and old site panda.
            displayHitStatus(null,theNumber);
			addToStatusLog(theNumber);
            return true;
		} else if (gScriptStatus == "normal" && checkJob) {
			hitStatus.reachedLimit = true;
			$("#JRCellNum_" + theNumber).stop(true,true);
			$("#JRCellNum_" + theNumber).css({"background-color":"#FFA691"});
            return false;
        }
    }, theNumber, 0, false, hitData.weight);
    gMainData.jobs++;
    //addQueueCheck();
}
function stopCollecting(theNumber,thisButton) {
    if (gMainOptions.debugger>1) console.log("turning off " + theNumber); // debugger >1 for collecting info
    if (gMainData.hitCollection[theNumber].collecting == "on") {
		setTimeout( function() { if (!gMainData.hitCollection[theNumber] || gMainData.hitCollection[theNumber].collecting == "off") removeFromStatusLog(theNumber); },9000);
        gMainData.hitCollection[theNumber].collecting = "off";
		gMainData.hitCollection[theNumber].status.reachedLimit = false;
        gMainData.hitCollection[theNumber].goToUrl.splice(0,gMainData.hitCollection[theNumber].goToUrl.length);
		$("#JRCellNum_" + theNumber).css({"background-color":$("#JRCellNum_" + theNumber).data("backgroundColor")});
        theCycler.removeJob(theNumber);
        gMainData.jobs--;
    }
    displayHitStatus(null,theNumber);
}
function stopAll() {
    $.each(gMainData.hitCollection, function( index, value ) {
        if (value.collecting == "on") {
            toggleButton( $("#JRCollectB_" + index),startCollecting,stopCollecting);
            if (value.collecting=="off" && value.ham != "off") toggleButtonOff($("#JRHamB_" + index),hamOn,hamOff);
        }
    });
}
function hamOn(theNumber,thisButton) {
    var onMode = "on", hitInfo = gMainData.hitCollection[theNumber];
    $(".JRHamButton").each( function() { if ( $(this).data("theNumber") != theNumber ) $(this).data("disabled",true); updateHitColors($(this).data("theNumber")); });
    if (hitInfo.ham == "paused") { onMode = "ontimed"; if (hitInfo.data.hamTimer > 0) hitInfo.lastAccept = new Date(); }
    hitInfo.ham = onMode; theCycler.hamOn(theNumber); theCycler.skippingReset(); theCycler.cycleResetChange(gMainOptions.HamCycleNumber);
}
function hamOff(theNumber,thisButton,theMode) {
    var passedMode = theMode || "";
    var hitInfo = gMainData.hitCollection[theNumber];
    if (hitInfo.ham.substring(0,2) == "on") {
        $(".JRHamButton").each( function() {
            if ( $(this).data("disabled") ) $(this).data("disabled",false);
            updateHitColors($(this).data("theNumber"));
        });
		cycleButtonSelect(gMainOptions.savedCycleNum);
		theCycler.hamOff();
		theCycler.skippingReset();
    }
	hitInfo.lastAccept = null;
    if (passedMode === "" && hitInfo.ham == "ontimed" && hitInfo.collecting != "off") passedMode = "paused";
    gMainData.hitCollection[theNumber].ham = (passedMode==="") ? "off" : passedMode;
	saveGroupIdSearching(hitInfo,false);
}
function muteJob(theNumber) {
    var hitInfo = gMainData.hitCollection[theNumber];
    hitInfo.data.mute = !hitInfo.data.mute;
    hitInfo.hitCell.data("mute",hitInfo.data.mute);
    updateHitColors( theNumber );
    saveSettings();
}
function helpToolTips() {
	if (gMainOptions.showHelpTooltips) $(".hasHelptip").tooltip( "option", "disabled", false );
	else $(".hasHelptip:not(.keepHelptip)").tooltip( "option", "disabled", true );
}
function createBlankDiv() {
	return createDiv("&nbsp;").attr("class","JRHitCell JRHitBlank").css({"border":"3px solid black", "margin":"2px 4px", "float":"left", "width":"206px", "height":"76px"});
}
function addTab(tabContainer,tabContents,theTitle,isSortable,theID,tabData,appendClose,needBr) {
	tabContents = tabContents || createDiv(); needBr = (typeof needBr != 'undefined') ? needBr : true;
    var theTab = createTab(tabContainer,theTitle,isSortable,theID,tabData,appendClose,needBr).data({"tabData":tabData});
    tabContents.data({"tabData":tabData}).attr({"class":"tabContents connectedSortable"}).css({"overflow":"auto"})
		.droppable({ tolerance: 'pointer', drop: moveToTab })
        .sortable({dropOnEmpty: true,delay:400,tolerance: "pointer","items":".JRHitCell:not(.ui-not-sortable)",
            helper:"clone",opacity: 0.9,appendTo:"body",
            start: function( event, ui ) {
                ui.item.addClass('noclick'); ui.item.data("oldPosition",ui.item.index()); ui.item.data("sameTab",true);
            },
			stop: function( event, ui ) {
                if (ui.item.data("hitInfo") && !ui.item.data("received")) {
                    var thePositions = gTabsData[ui.item.data("hitInfo").tabIndex].positions;
                    thePositions.splice(ui.item.index(), 0, thePositions.splice(ui.item.data("oldPosition"), 1)[0]);
                    saveSettings();
				}
			}
        });
	if (needBr) tabContents.insertBefore(theTab.find("br.cleartab")); else tabContents.appendTo(theTab);
    return theTab;
}
function fillNewHitData(requesterName, requesterId, groupId, pay, title, duration, onlyOnce, toMain, collectNow, theAction) {
	var active = (toMain) ? 0 : $( "#JRMainTabs" ).tabs( "option", "active" );
	var newHitData = jQuery.extend(true, {}, gDefaultRequestersData[0]);
	newHitData.action = (theAction) || "panda"; newHitData.qual = ""; newHitData.queueLimit = 0; newHitData.audioforce = ""; newHitData.hitlimit = ""; newHitData.mute = false;
	newHitData.position = null; newHitData.tabNumber = gTabsData[active].tabNumber; newHitData.hamTimer = (gMainOptions.hamDelayTimer) || gDefaultMainOptions.hamDelayTimer;
	newHitData.once = (onlyOnce) || false; newHitData.requesterName = (requesterName) || ""; newHitData.requesterId = (requesterId) || ""; newHitData.groupId = (groupId) || "";
	newHitData.searchData = setSearchOptionsDefault(); newHitData.dateAdded = new Date();
	newHitData.pay = (pay) || "0.00"; newHitData.title = (title) || groupId; newHitData.duration = (duration) || "";
	var newCell = addHitData(newHitData,active);
	if (collectNow) { newCell.data("status","on"); toggleButton( newCell.find(".JRCollectButton"),startCollecting,stopCollecting ); }
	if (theCycler.isHamOn()) newCell.find(".JRHamButton").data("disabled",true);
	updateHitCell(newCell.data("theNumber")); updateHitColors(newCell.data("theNumber"));
	return newCell.data("theNumber");
}
function changeToEdited(idName) { $("#"+idName).data("edited",true); $("div[aria-describedby=" + idName+ "] .ui-dialog-buttonpane button:contains('Save')").button().show(); }
function inputNumMS(thisOne,isMS) {
	if (isMS) $(thisOne).parent().find(".theInputEdit").val(convertToSeconds(parseInt(thisOne.value),3));
	else $(thisOne).parent().find(".theInputEdit2").val(convertToMilliseconds(parseFloat(thisOne.value)));
}
function backToDefault(thisButton,inputClass,thisValue,doubleDigit) {
	var idName = $(thisButton).data("idName"), editing = $("#"+idName).data("editing"), dataKey = $(thisButton).closest(".editLine").data("dataKey");
	var theDefaultObject = (editing=="searchoptions") ? gDefaultSearchOptions : (editing=="job") ? gDefaultRequestersData[0] : (editing=="timers") ? gDefaultMainOptions :
		(editing=="alarms") ? gAlarmSounds :  (editing=="options") ? gDefaultMainOptions : null;
	if (theDefaultObject && dataKey in theDefaultObject) {
		var defaultValue = theDefaultObject[dataKey];
		if (editing=="job" && dataKey=="requesterName") defaultValue="";
		if (editing=="job" && dataKey=="requesterId") defaultValue="";
		if (editing=="job" && dataKey=="action") defaultValue="panda";
		if (thisValue) $(thisButton).html((doubleDigit) ? ("0" + defaultValue).slice(-2) : defaultValue);
		else {
			var thisArea = $(thisButton).closest(".editLine");
			var inputNode = $(thisArea).find("."+inputClass+":first").val(defaultValue);
			if ($(thisArea).data("seconds2ms")) $(thisArea).find(".theInputEdit2").val(convertToMilliseconds(parseFloat(defaultValue)));
		}
		changeToEdited(idName);
	}
}
function dataEdited(idName,thisArea,theValue,extraValue) {
	extraValue = extraValue || null;
	var inputEdit1 = null, inputEdit2 = null, input1Label="", setValue=theValue;
	if ( $(thisArea).find(".theInputEdit").length > 0 ) return;
    changeToEdited(idName); $(thisArea).off("click");
	if (extraValue) setValue = (extraValue=="seconds") ? setValue : convertToSeconds(parseInt(theValue),3);
	inputEdit1 = createTextInput(setValue).attr("class","theInputEdit").css({"width":"300px"});
    if ($(thisArea).data("seconds2ms")) {
		input1Label = " Seconds: ";
		$(inputEdit1).css({"width":"50px"});
		inputEdit2 = createTextInput(convertToMilliseconds(parseFloat(theValue))).attr("class","theInputEdit2").css({"width":"50px"});
	}
	var inputEditSpan = createSpan(input1Label).append(inputEdit1);
	if (inputEdit2) inputEditSpan.append(createSpan(" Milliseconds: ")).append(inputEdit2);
	if ($(thisArea).data("doClick")) $(inputEdit1).click( function(e) { $(thisArea).data("doClick")(e); });
	if ($(thisArea).data("idToo")) {
		var secondArea = $(thisArea).data("idToo"), secondKey = $("#"+secondArea).data("dataKey");
		if (secondKey) {
			var theNumber = $("#"+idName).data("theNumber"), secondValue = gMainData.hitCollection[theNumber].data[secondKey];
			var secondInputEdit = createTextInput(secondValue).attr("class","theInputEdit").css({"width":"300px"});
			var secondInputEditSpan = createSpan().append(secondInputEdit);
			$(secondInputEdit).after($(createSpanButton(function(e) { backToDefault(e.target,"theInputEdit",false,false); },"","D",
				gButtonOffBgColor,gButtonOffColor,"8px")).css({"margin-left":"5px"}).data("idName",idName));
			$("#" + secondArea).find("span:not(.errorEditLine):not(.defaultEdit):not(.editButton)").replaceWith(secondInputEditSpan);
			$("#" + secondArea).off("click");
		}
	}
    $(inputEdit1).focus( function(e) {
		if ($(e.target).closest(".editLine").data("doFocus") && !$(e.target).closest(".editLine").data("focusOff")) $(e.target).closest(".editLine").data("doFocus")(e);
		$(e.target).select();
	});
	$(inputEdit1).after($(createSpanButton(function(e) { backToDefault(e.target,"theInputEdit",false,false); },"defaultButton","D",
		gButtonOffBgColor,gButtonOffColor,"8px")).css({"margin-left":"5px"}).data("idName",idName));
	if (inputEdit2) {
		$(inputEdit2).focus( function(e) { $(e.target).select(); });
		$(inputEdit1).on( "input", function() { if (this.value==="") { this.value=0; $(this).select(); } inputNumMS(this,false); });
		$(inputEdit2).on( "input", function() { if (this.value==="") { this.value=0; $(this).select(); } inputNumMS(this,true); });
	} else {
		if ($(thisArea).closest(".editLine").data("doInput")) $(inputEdit1).on( "input", function() { $(this).closest(".editLine").data("doInput")(); });
	}
    $(thisArea).find("span:not(.errorEditLine):not(.defaultEdit):not(.optionButton)").replaceWith(inputEditSpan);
    $(inputEdit1).focus();
}
function dataIncDecNumber(idName,currentNumber,limitNumber) {
	var formatNumber = (limitNumber>9) ? ("0" + currentNumber).slice(-2) : currentNumber;
	return createSpan().append($(createSpanButton( function(e) {
		var limitNumber = $(e.target).data("limitNumber"), numberIncDec = $(e.target).parent().find(".numberIncDec"), theNumber = parseInt(numberIncDec.html());
		theNumber = (theNumber>0) ? theNumber-1 : 0;
		numberIncDec.html((limitNumber>9) ? ("0" + theNumber).slice(-2) : theNumber);
		changeToEdited(idName);
	},"","<",gButtonOffBgColor,gButtonOffColor,"9px")).data({"limitNumber":limitNumber}))
	.append(createSpan(formatNumber.toString()).attr({"class":"numberIncDec nonselectable"}).data("idName",idName))
		.dblclick( function(e) { backToDefault(e.target,"numberIncDec",true,(limitNumber>9)); } )
	.append($(createSpanButton( function(e) {
		var limitNumber = $(e.target).data("limitNumber"), numberIncDec = $(e.target).parent().find(".numberIncDec"), theNumber = parseInt(numberIncDec.html());
		theNumber = (theNumber<limitNumber) ? theNumber+1 : limitNumber;
		numberIncDec.html((limitNumber>9) ? ("0" + theNumber).slice(-2) : theNumber);
		changeToEdited(idName);
	},"",">",gButtonOffBgColor,gButtonOffColor,"9px")).data({"limitNumber":limitNumber}));
}
function dataTrueFalse(idName,thisArea,theValue) {
    changeToEdited(idName);
	var newValue=false, theSpan = $(thisArea).closest("div").find("span");
    if (theSpan.html()=="true") newValue=false; else newValue=true;
    $(theSpan).html(newValue.toString());
}
function dataRadioButtons(idName,theName,theValues,theValue,theChangeFunction) {
	var radioButtons = createSpan().data("changeFunction",theChangeFunction);
	$.each(theValues, function(index, value) {
		var valueID = value.toLowerCase(), aRadio = createRadioButton(theName,valueID).attr({"id":valueID + "_radio_" + index}).css({"width":"20px"});
		if (valueID == theValue) aRadio.prop("checked",true);
		else aRadio.prop("checked",false);
		createSpan().append(aRadio).append($("<label for='" + valueID + "_radio_" + index + "'>").attr({"class":"JREditRadioB"}).append(value)
			.data("theValue",valueID)).appendTo(radioButtons);
	});
	$(radioButtons).buttonset();
	$(radioButtons).change( function() { changeToEdited(idName); ($(this).data("changeFunction"))($(this).find(".JREditRadioB[aria-pressed='true']:first").data("theValue")); });
    return radioButtons;
}
function dataPandaSearch(idName,thisArea,theValue) {
    changeToEdited(idName);
    if (theValue) returnValue=false;
    else returnValue=true;
    $(thisArea).find("span").html(returnValue.toString());
    return returnValue;
}
function saveAlarmsData() {
    $.each(gAlarmSounds, function( index, value ) {
        var importFileID = "importFileInput-" + index, base64 = $("#" + importFileID).data("base64");
        value.audio = $("#" + importFileID).data("audio");
        if (base64) GM_setValue(value.nameVar,JSON.stringify(base64));
    });
    saveSettings();
	return true;
}
function saveEditedInput(theSelector,theTag) { // inputSelector for the id or class name, returns value.
	if ($(theSelector + ".isInt").data("seconds2ms") && $(theSelector + ".isInt " + theTag).length) {
		theTag = ($(theSelector + ".isInt").data("seconds2ms")=="seconds") ? ".theInputEdit" : ".theInputEdit2";
		return parseFloat( $(theSelector + ".isInt").find(theTag).eq(0).val());
	}
	else if ($(theSelector + ".isFloat " + theTag).length) { return parseFloat( $(theSelector + " " + theTag).eq(0).val()).toFixed(2); }
	else if ($(theSelector + ".isBool span").length) { return ($(theSelector + " span").eq(0).html() === "true"); }
	else if ($(theSelector + ".isInt " + theTag).length) { return parseInt( $(theSelector + " " + theTag).eq(0).val()); }
	else if ($(theSelector + ".isInt .numberIncDec").length) { return parseInt( $(theSelector + ".isInt .numberIncDec").eq(0).html()); }
	else if ($(theSelector + " " + theTag).length) { return $(theSelector + " " + theTag).eq(0).val(); }
	else return null;
}
function editLineSaveData(idName,objectSaveFunction) {
	$("#" + idName + " .editLine").each( function(index,value) {
		var theKey = $(value).data("dataKey"), theDataType = $(value).data("dataType"), passBack = -1;
		if (theDataType && theDataType == "array") passBack = 0;
		if (theKey) { tempSave = saveEditedInput("#"+theKey+"Edit","input"); if (tempSave!==null) objectSaveFunction(theKey,tempSave,passBack); }
	});
}
function editLineDataCheck(idName) {
	var theReturnValue = true;
	$("#" + idName + " .editLine").each( function(index,value) {
		var newReturnValue = true;
		if ( $(value).find("input").length && $(value).data("dataCheck") ) newReturnValue = ($(value).data("dataCheck"))($(value).find("input"));
		theReturnValue = theReturnValue & newReturnValue;
		if (!theReturnValue) return false;
	});
	return theReturnValue;
}
function saveOptionsData() {
    var showHelpTooltipsEdit = $("#JREditDialog #showHelpTooltipsEdit input");
    if (showHelpTooltipsEdit.length) gMainOptions.showHelpTooltips = $(showHelpTooltipsEdit).eq(0).val();
	editLineSaveData("JREditDialog",function(theKey,theData) { gMainOptions[theKey] = theData; });
	helpToolTips(); saveSettings(); cycleButtonSelect(gMainOptions.savedCycleNum); displayMainStatus();
	return true;
}
function savesearchOptions() {
	if (!editLineDataCheck("JREditDialog2")) return false;
	editLineSaveData("JREditDialog2",function(theKey,theData,arrayIndex) {
			var dataObject = $("#JREditDialog2").data("searchOptions");
			if (arrayIndex===-1) dataObject[theKey] = theData;
			else dataObject[theKey][0] = theData;
		});
}
function saveTimersData() {
	if (!editLineDataCheck("JREditDialog")) return false;
	editLineSaveData("JREditDialog",function(theKey,theData) { gMainOptions[theKey] = theData; });
	theCycler.removeJob(-1); addQueueCheck(); // Reset queue watch just incase queue timer was changed.
	$("#JrCycleAddingButton").find("span").html("Add " + gMainOptions.cycleAdding); // Change adding button text just in case time was changed.
    saveSettings(); cycleButtonSelect(gMainOptions.savedCycleNum); // Reset cycleNumber just in case it was changed.
    displayMainStatus();
	return true;
}
function saveJobData() {
	if (!editLineDataCheck("JREditDialog")) return false;
    var theNumber = $("#JREditDialog").data("theNumber"), hitInfo = gMainData.hitCollection[theNumber], hitData = hitInfo.data;
	var tempSave = saveEditedInput("#filterModeEdit","select");
	editLineSaveData("JREditDialog",function(theKey,theData) { hitData[theKey] = theData; });
	if (tempSave!==null) hitData.filterMode = tempSave;
	if (hitData.dailyLimit === 0) hitData.dailyDone = 0;
	hitInfo.data.searchData = null; hitInfo.data.searchData = $("#JREditDialog").data("searchOptions");
	if (hitInfo.collecting != "off") theCycler.changeWeight(theNumber,hitData.weight);
	hitInfo.pandaUrl = pandaLink(hitData.groupId); // Reset pandalink just in case groupid was changed.
	hitInfo.pandaNewUrl = pandaLinkNew(hitData.groupId); // Reset New pandalink just in case groupid was changed.
	hitInfo.previewUrl = previewLink(hitData.groupId); // Reset previewlink just in case groupid was changed.
    saveSettings(); updateHitCell(theNumber); updateHitColors( theNumber ); displayHitStatus( null,theNumber );
	return true;
}
function saveEditedData() {
    if ( $("#JREditDialog2") && $("#JREditDialog2").data("edited") ) {
        if ($("#JREditDialog2").data("editing") == "searchoptions") return savesearchOptions();
    } else if ( $("#JREditDialog").data("edited") ) {
        if ($("#JREditDialog").data("editing") == "job") return saveJobData();
        else if ($("#JREditDialog").data("editing") == "timers") return saveTimersData();
        else if ($("#JREditDialog").data("editing") == "alarms") return saveAlarmsData();
        else if ($("#JREditDialog").data("editing") == "options") return saveOptionsData();
        else if ($("#JREditDialog").data("editing") == "groupingCreate") return saveGroupingCreateData();
        else if ($("#JREditDialog").data("editing") == "groupingHitsEdit") return saveGroupingHitsData();
    }
}
function saveToFile(theData,exportAlarms) {
    var blob = new Blob( [JSON.stringify(theData)], {type: "text/plain"}), dl = document.createElement("A");
    dl.href = URL.createObjectURL(blob); dl.download = "PandaCrazy_" + formatAMPM("short") + ((exportAlarms) ? "_w_alarms" : "") + ".json";
    document.body.appendChild(dl); dl.click(); dl.remove();
}
function exportJobs(exportAlarms) {
    //load from database to temp data variable
	createThisModal(250,400,"waiting",null,true,true);
	addToWaitDialog($("#JRjqModalDialog-waiting"),"Exporting Data. Please Wait....",true,"16px");
	setTimeout( function() {
		saveToFile({"Requesters":gRequestersData,"Options":gMainOptions,"Tabsdata":gTabsData,"Grouping":gGroupingData,"Tabsinfo":gTabsInfo,
			"SoundOptions":setupSoundOptions(exportAlarms)},exportAlarms);
		addToWaitDialog($("#JRjqModalDialog-waiting"),"<div style='text-align:center; font-size:18px; line-height:18px;'>" +
			"<br>Finished exporting the data.<br>You may close this dialog now.</div>",true,"18px");
	},1000);
}
function loadImportedAlarms(theData) {
	var theSoundOptions = {};
	if (theData.SoundOptions) theSoundOptions = theData.SoundOptions;
	else theSoundOptions = setupSoundOptions();
	for (var key in theSoundOptions) { if (theSoundOptions[key]) defaultFillIn(theSoundOptions[key],gDefaultSoundOptions); }
	fillInSoundOptions(theSoundOptions);
}
function loadImportedData(theData,importAlarms) {
	var waitingDialog = $("#JRjqModalDialog-waiting");
	$("div[aria-describedby='JRWaitDialog'] .ui-dialog-buttonpane button:contains('Close')").eq(0).prop('disabled', true);
	addToWaitDialog(waitingDialog,"Stopping all Jobs.",true,"16px");
	stopAll();
	setTimeout( function() {
		addToWaitDialog(waitingDialog,"Removing all Job Cells",true,"16px");
		$("#JRMainTabs").find(".ui-tabs-panel").each( function() {
			$(this).find(".JRHitCell").each( function() { $(this).remove(); });
		});
		setTimeout( function() {
			addToWaitDialog(waitingDialog,"Removing all Tabs",true,"16px");
			$.each(gTabsData, function( index, value ) {
				var panelId = $("#JRTab_" + value.tabNumber).closest( "li" ).remove().attr( "aria-controls" );
				$( "#" + panelId ).remove(); $("#JRMainTabs").tabs( "refresh" );
			});
			setTimeout( function() {
				addToWaitDialog(waitingDialog,"Deleting Collection Data",true,"16px");
				$.each(gMainData.hitCollection, function( index, value ) { delete gMainData.hitCollection[index]; });
				setTimeout( function() {
					addToWaitDialog(waitingDialog,"Deleting Requesters Data",true,"16px");
					$.each(gRequestersData, function( index, value ) { delete gRequestersData[index]; });
					addToWaitDialog(waitingDialog,"Deleting Grouping Data",true,"16px");
					$.each(gGroupingData, function( index, value ) { delete gGroupingData[index]; });
					$.each(gGroupings, function( index, value ) { delete gGroupings[index]; });
					gGroupingsSort.splice(0,gGroupingsSort.length);
					setTimeout( function() {
						addToWaitDialog(waitingDialog,"Deleting Tabs",true,"16px");
						$.each(gTabsData, function( index, value ) { delete gTabsData[index]; });
						gTabsInfo = {};
						$("#addNewtab").remove();
						setTimeout( function() {
							addToWaitDialog(waitingDialog,"Adding imported data in the database.",true,"16px");
							gMainOptions = theData.Options;
							defaultFillIn(gMainOptions,gDefaultMainOptions);
							if (importAlarms) loadImportedAlarms(theData);
							gRequestersData = loadInDBVersions(theData.Requesters);
							gTabsData = theData.Tabsdata;
							if (theData.Tabsinfo) gTabsInfo = theData.Tabsinfo;
							else gTabsInfo = gDefaultTabsInfo;
							convertTabDatabase();
							$.each(gTabsData, function( index, value ) { defaultFillIn(value,gDefaultTabsData[0]); });
							if (theData.Grouping) gGroupingData = theData.Grouping;
							else gGroupingData = gDefaultGroupingData;
							fillInGroupings();
							fillTabs($("#JRMainTabs"));
							setTimeout( function() {
								changeOldSettings();
								$("#JRMainTabs").tabs("option", "active", 0);
								addToWaitDialog(waitingDialog,"<div style='text-align:center; font-size:18px; line-height:18px;'>" +
									"<br>Importing is finished.<br>You may close this dialog now.</div>",true,"18px");
								$("#JRMainTabs").css({"height":$(".ui-layout-center").innerHeight() - $("#JRTheControls").innerHeight() - 8});
								$("#JRMainTabs").find(".tabContents").css({"height":$(".ui-layout-center").innerHeight() - $("#JRMainTabs")
									.find(".ui-tabs-nav").innerHeight() - $("#JRTheControls").innerHeight() - 8});
								tooltipCreateFix($(".JRStatusText"),680);
								tooltipCreateFix($(".hasHelptip"),1000);
								$("div[aria-describedby='JRWaitDialog'] .ui-dialog-buttonpane button:contains('Close')").eq(0).prop('disabled', false);
								gRequestersData[0].action=gScriptVersion;
								saveSettings();
							},1);
						},1);
					},1);
				},1);
			},1);
		},1);
	},1);
}
function importJobs(theFile,importData,importAlarms ) {
    //load json text and verify it's correct data for the database
	createThisModal(350,400,"waiting",null,true,true);
	var waitingDialog = $("#JRjqModalDialog-waiting");
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var reader = new FileReader();
        reader.onload = function() {
			addToWaitDialog(waitingDialog,"Loaded file in memory.",true,"16px");
            var textData = reader.result;
            setTimeout( function() {
				addToWaitDialog(waitingDialog,"Parsing the imported Data.",true,"16px");
				try {
					var theData = JSON.parse(textData);
					if (importData) loadImportedData(theData,importAlarms);
					else if (importAlarms) {
						loadImportedAlarms(theData);
						addToWaitDialog(waitingDialog,"<div style='text-align:center; font-size:18px; line-height:18px;'>" +
							"<br>Alarms Importing is finished.<br>You may close this dialog now.</div>",true,"18px");
					} else {
						addToWaitDialog(waitingDialog,"<div style='text-align:center; font-size:18px; line-height:18px;'>" +
							"<br>Nothing to import!!<br>You may close this dialog now.</div>",true,"18px");
					}
				} catch(e) {
					console.log("Could not parse text in file. Sorry.");
				}
            },50);
        };
        reader.readAsBinaryString(theFile);
        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
        return true;
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}
function formatDialog(idName,theHeight,theWidth,theTitle,theButton,editing,theModal) {
	// An all purpose function to reinitialize a dialog for use
    $("#" + idName).dialog("option","height",theHeight);
    $("#" + idName).dialog("option","width",theWidth);
    $("#" + idName).dialog("option", "title", theTitle);
    $("#" + idName).dialog("option", "position", { my: "center", at: "center", of: $("body") });
    $("#" + idName).data({"edited":false,"editing":editing,"theNumber":null,"button":theButton,"closeme":null,"yesFunction":null,
		"NOCloseDialog":false,"nameKey":null,"theGrouping":null,"theDelayed":null,"searchOptions":null});
    $("#" + idName).dialog("option","modal",theModal);
    $(".ui-dialog-titlebar").show();
	$("#JRSavedMturkArea").hide(); $("#JRSavedJobsArea").hide();
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('Yes')").hide();
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('Stop') span").html("No");
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('No')").hide();
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('Create Group')").hide();
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('Save')").hide();
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('Close') span").html("Cancel");
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('Unpause') span").html("Cancel");
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('Cancel')").show();
    $("#" + idName + " .JRContents:first").remove();
}
function checkGroupings(groupingData) {
    if (!groupingData.data) return false;
    if (!groupingData.data.grouping) return false;
    for (var i=0; i<groupingData.data.grouping.length; i++) {
        if ( !gRequestersData[groupingData.data.grouping[i]] ) { groupingData.data.grouping.splice(i, 1); i--; }
        else groupingData.data.grouping[i] = "" + groupingData.data.grouping[i];
    }
    if (groupingData.data.grouping.length===0) return false;
    return true;
}
function saveGroupingHitsData() {
	var nameChanged = $("#groupNameEdit input").length;
	var newName = (nameChanged) ? $("#groupNameEdit input").val().toString() : $("#JREditDialog").data("nameKey");
	if ( nameChanged && newName === "" ) {
		$(".errorEditLine:first").html("Please name this group!");
		return false;
	} else if ( nameChanged && (newName in gGroupingData) ) {
		$(".errorEditLine:first").html("This Name must be Unique!");
		return false;
	} else {
		if (nameChanged && ($("#JREditDialog").data("nameKey") != newName)) {
			var savedData = gGroupingData[$("#JREditDialog").data("nameKey")];
			var savedGroupings = gGroupings[$("#JREditDialog").data("nameKey")];
			delete gGroupingData[$("#JREditDialog").data("nameKey")];
			delete gGroupings[$("#JREditDialog").data("nameKey")];
			var theIndex = gGroupingsSort.indexOf($("#JREditDialog").data("nameKey"));
			gGroupingsSort.splice(theIndex,1,newName); gGroupingData[newName] = savedData; gGroupings[newName] = savedGroupings;
			$("#JREditDialog").data("nameKey",newName);
		}
		var tempGrouping = [];
		var tempDelayed = [];
		$("#JREditDialog .groupingHitCell").each( function() {
			if (!$(this).data("removeMe")) tempGrouping.push("" + $(this).data("theNumber"));
			if ($(this).data("delayed")) tempDelayed.push("" + $(this).data("theNumber"));
		});
		gGroupingData[$("#JREditDialog").data("nameKey")].grouping = tempGrouping;
		gGroupingData[$("#JREditDialog").data("nameKey")].delayed = tempDelayed;
		if ($("#groupDescriptionEdit input").length) {
			gGroupingData[$("#JREditDialog").data("nameKey")].description = $("#groupDescriptionEdit input").val().toString();
		}
		showGroupingDialog("view",$("#JREditDialog").data("button"));
        saveSettings();
		return true;
	}
}
function saveGroupingCreateData(theName,theDescription) {
    theDescription = theDescription || ""; theName = theName || ""; gScriptStatus = "normal";
    if ( theName !== "" && !(gGroupingData[theName]) ) {
        gGroupingData[theName] = {"theNumber":++gGroupingData["JR First"].theNumber,
            "description":theDescription,"grouping":$("#JREditDialog").data("theGrouping"),"delayed":$("#JREditDialog").data("theDelayed")};
        gGroupings[theName] = {"data":gGroupingData[theName],"collecting":false};
        gGroupingsSort.push(theName);
        saveSettings();
        return true;
    } else if ($("#JREditDialog").data("creating") == "add") {
		$(".JRHitCell .JRButton").removeClass("ui-state-disabled");
		$(".JRHitCell").each( function() { updateHitColors($(this).data("theNumber")); });
		var nameKey = $("#JREditDialog").data("nameKey");
		var tempGrouping = [];
		var tempDelayed = [];
		$(".JRHitCell:not('.JRHitDummy')").each( function() {
			if ($(this).data("selected") !== 0) {
				tempGrouping.push("" + $(this).data("theNumber"));
				if ($(this).data("selected") == "2") tempDelayed.push("" + $(this).data("theNumber"));
			}
		});
		gGroupingData[nameKey].grouping = tempGrouping;
		gGroupingData[nameKey].delayed = tempDelayed;
        saveSettings();
		$("#JREditDialog").dialog( "close");
		showGroupingDialog("view",$("#JREditDialog").data("button"));
        return true;
    } else return false;
}
function showWaitDialog(theTitle,theText,closeMeFunction,theButton,appendMe,showUnpause,theHeight,theWidth) {
	theHeight = theHeight || 310; theWidth = theWidth || 320; showUnpause = showUnpause || false;
	formatDialog("JRWaitDialog",theHeight,theWidth,theTitle,theButton,"",true);
	if (appendMe) $("#JRWaitDialog").html("").append(appendMe);
	else $("#JRWaitDialog").html("").append(createDiv(theText));
	if (closeMeFunction) {
		$("div[aria-describedby='JRWaitDialog'] .ui-dialog-buttonpane button:contains('Cancel') span").html((showUnpause) ? "Unpause" : "Close");
		$("div[aria-describedby='JRWaitDialog'] .ui-dialog-buttonpane button:contains('Close')").show();
		$("div[aria-describedby='JRWaitDialog'] .ui-dialog-buttonpane button:contains('Unpause')").show();
		$("#JRWaitDialog").data("closeme",closeMeFunction);
	} else $("div[aria-describedby='JRWaitDialog'] .ui-dialog-buttonpane button:contains('Cancel')").hide();
	if (showUnpause) {
		$("div[aria-describedby='JRWaitDialog'] .ui-dialog-buttonpane button:contains('No') span").html("Stop");
		$("div[aria-describedby='JRWaitDialog'] .ui-dialog-buttonpane button:contains('Stop')").show();
	}
	$("#JRWaitDialog").dialog("open");
    $("#JRWaitDialog").dialog("option", "position", {my: "center", at: "center", of: window});
}
function appendToWaitDialog(appendThis) { $("#JRWaitDialog").append(appendThis);}
function addToWaitDialog(theDialog,addText,newLine,fontSize) {
	fontSize = (fontSize) || "11px";
	if (newLine) $(theDialog).append(createDiv(addText).css({"font-size":fontSize,"line-height":fontSize}));
	else $(theDialog).append(createSpan(addText).css("font-size",fontSize));
}
function showPromptDialog(promptQuestion,theValue,theButton,theYesFunction) {
	formatDialog("JRPromptDialog",160,600,"",theButton,"groupingCreate",true);
	$("div[aria-describedby='JRPromptDialog'] .ui-dialog-titlebar").hide();
    $("div[aria-describedby='JRPromptDialog'] .ui-dialog-buttonpane button:contains('Yes')").show();
    $("div[aria-describedby='JRPromptDialog'] .ui-dialog-buttonpane button:contains('Yes') span").html("OK");
	$("#JRPromptDialog").data("yesFunction",function() { theYesFunction($("#JRPromptDialog .textInputField").val()); } );
	createDiv().attr("class","JRContents").appendTo($("#JRPromptDialog"));
	var textInputArea = createDiv().attr("class","textInputArea").css({"margin":"25px 15px"}).appendTo($("#JRPromptDialog .JRContents:first"));
	createDiv().html(promptQuestion).css({"font-size":"15px"}).appendTo(textInputArea);
	createDiv().append(createTextInput(theValue).attr("class","textInputField").select().css({"width":"200px","margin":"5px 0 0 30px","height":"25px"})).appendTo(textInputArea);
	$("#JRPromptDialog").dialog("open");
	$(".textInputField").select();
}
function showYesNoDialog(theQuestion,theYesFunction,data1,data2,theNoFunction) {
	$("#JRYesNoDialog").html("");
	$("#JRYesNoDialog").data({"data1":data1,"data2":data2});
	$("#JRYesNoDialog").data("yesFunction", function() { theYesFunction($("#JRYesNoDialog").data("data1"),$("#JRYesNoDialog").data("data2")); $("#JRYesNoDialog").dialog( "close"); });
	$("#JRYesNoDialog").data("closeme", function() { if (theNoFunction) theNoFunction(); $("#JRYesNoDialog").dialog( "close"); });
	createDiv(theQuestion).attr("class","questionArea").css({"margin":"15px 8px","font-size":"18px","text-align":"center","line-height":"18px"}).appendTo($("#JRYesNoDialog"));
	$("#JRYesNoDialog").dialog("open");
}
function createGroup() {
    var creating = $("#JREditDialog").data("creating"), theGrouping = [], theDelayed = [];
    $("#JREditDialog").dialog( "close");
    $(".ui-dialog-titlebar").show();
    gScriptStatus = "normal";
    $(".JRHitCell .JRButton").removeClass("ui-state-disabled");
    $(".JRHitCell").each( function() { updateHitColors($(this).data("theNumber")); });
    $("div[aria-describedby='JREditDialog']").removeClass("notmodal");
    $(".JRHitCell").each( function() {
        if (creating=="selection") {
            if ($(this).data("selected")!==0) theGrouping.push("" + $(this).data("theNumber"));
			if ($(this).data("selected")==2) theDelayed.push("" + $(this).data("theNumber"));
        } else {
            if ($(this).data("hitInfo").collecting != "off") {
				theGrouping.push("" + $(this).data("theNumber"));
				var hamStatus = $(this).data("hitInfo").ham;
				if (hamStatus == "paused" || hamStatus == "ontimed") theDelayed.push("" + $(this).data("theNumber"));
			}
        }
        $(this).data("selected",false);
    });
    showGroupingCreateDialog($("#JREditDialog").data("button"),theGrouping,theDelayed,"grouping");
}
function showGroupingCreateDialog(theButton,theGrouping,theDelayed,creating,nameKey) {
    var infoArea = createDiv().attr("class","infoArea").css({"margin":"15px 15px"});
    if (creating=="selection" || creating=="collecting" || creating=="add") {
        formatDialog("JREditDialog",106,600,"Select jobs to your group",theButton,"groupingCreate",false);
        gScriptStatus = "creating groupings";
        $("#JREditDialog").data({"creating":creating,"nameKey":nameKey});
		if (creating!="collecting") {
			$("#JREditDialog").data("NOCloseDialog",true); $(".JRHitCell").stop(true,true);
			$(".JRHitCell:not('.JRHitDummy')").css({"background-color":"#00FFEE"});
			$(".JRHitCell .myFloater").css({"background-color":"#00FFEE"});
			$(".JRHitCell .JRButton").addClass("ui-state-disabled");
			$("div[aria-describedby='JREditDialog']").addClass("notmodal");
		}
        $("#JREditDialog").data("closeme",function() {
            gScriptStatus = "normal";
            $(".JRHitCell .JRButton").removeClass("ui-state-disabled");
            $(".JRHitCell").each( function() { updateHitColors($(this).data("theNumber")); });
			$("#JREditDialog").dialog( "close");
			if (creating=="add") {
				$("#JREditDialog").dialog( "close");
				showGroupingDialog("view",$("#JREditDialog").data("button"));
			} else {
				releaseButton($("#JREditDialog"));
				$("#JREditDialog").dialog( "close");
			}
        });
        $("#JREditDialog").dialog("option", "position", { my: "center top", at: "center top", of: $("body") });
		createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
        infoArea.css({"margin":"8px 12px"}).appendTo($("#JREditDialog .JRContents:first"));
        if (creating!="add") $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Create Group')").show();
		else $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Save')").show();
        if (creating=="selection" || creating=="add") {
			if (nameKey) {
				var groupingsData = gGroupings[nameKey].data;
                $("#JREditDialog").data("edited",true);
				for (var i=0,len=groupingsData.grouping.length; i<len; i++) {
					$("#JRCellNum_" + groupingsData.grouping[i]).data("selected",0);
					if (groupingsData.delayed.indexOf(groupingsData.grouping[i]) != -1) {
						$("#JRCellNum_" + groupingsData.grouping[i]).css({"background-color":"#33CC66"});
						$("#JRCellNum_" + groupingsData.grouping[i]).data("selected",2);
					} else {
						$("#JRCellNum_" + groupingsData.grouping[i]).css({"background-color":"#ADFF2F"});
						$("#JRCellNum_" + groupingsData.grouping[i]).data("selected",1);
					}
				}
			}
            createDiv().html("Click on the jobs you want in this group below.<br>Right click on the jobs you want to be in Delayed Ham Mode.")
                .css({"font-size":"13px","text-align":"center","margin-top":0}).appendTo(infoArea);
        } else {
            if (gMainData.jobs===0) {
                createDiv().html("Sorry. You need to start collecting hits to create a grouping instantly.")
                    .css({"font-size":"14px","text-align":"center"}).appendTo(infoArea);
                $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Create Group')").hide();
				$("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Save')").hide();
                $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Cancel') span").html("Close");
            } else {
                createDiv().html("Do you really want to create an instant grouping for all the hits collecting now?")
                    .css({"font-size":"14px","text-align":"center"}).appendTo(infoArea);
                $("#JREditDialog").data({"creating":"created"});
            }
        }
        $(".ui-dialog-titlebar").hide();
        $("#JREditDialog").dialog("open");
    } else if ($("#JREditDialog").data("creating") == "created") {
        $("#JREditDialog").data({"theGrouping":theGrouping,"theDelayed":theDelayed});
        saveGroupingCreateData("Instantly Created #" + (gGroupingData["JR First"].theNumber + 1),"Grouping instantly made so no description");
        $("#JREditDialog").data("button",null);
        toggleButton(theButton,null,null);
        $("#JREditDialog").dialog("close");
		showGroupingDialog("view",$("#JREditDialog").data("button"));
    } else if (theGrouping.length>0) {
        formatDialog("JREditDialog",300,620,"Name your grouping to create it:",theButton,"groupingCreate",true);
        $("#JREditDialog").data({"theGrouping":theGrouping,"theDelayed":theDelayed});
		createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
        var groupingArea = createDiv().attr("class","groupingArea").css({"margin":"15px 15px"}).appendTo($("#JREditDialog .JRContents:first"));
        createDiv().html("").css({"margin":"15px 0 0 20px","font-size":"14px","color":"red","height":"30px"})
            .attr("class","groupingCreateError").appendTo(groupingArea);
        createDiv().html("Type in the name of this grouping:").css({"font-size":"15px"}).appendTo(groupingArea);
        createDiv().append(createTextInput("").attr("class","groupName").css({"width":"200px","margin":"5px 0 0 30px","height":"25px"})).appendTo(groupingArea);
        createDiv().html("Type in the description of this grouping:").css({"font-size":"15px","margin-top":"5px"}).appendTo(groupingArea);
        createDiv().append(createTextInput("").attr("class","groupDesc").css({"width":"350px","margin":"5px 0 0 30px","height":"25px"})).appendTo(groupingArea);
        var addGroupingButtonArea = createDiv().append($(createSpanButton( function(e) {
            var theName = $("#JREditDialog").find(".groupName").val().toString();
            var theDescription = $("#JREditDialog").find(".groupDesc").val().toString();
            if (theName!=="") {
                if (saveGroupingCreateData(theName,theDescription)) {
                    $("#JREditDialog").data("button",null);
                    toggleButton(theButton,null,null);
                    $("#JREditDialog").dialog("close");
					showGroupingDialog("view",$("#JREditDialog").data("button"));
                } else {
                    $("#JREditDialog .groupingCreateError:first").html("Error: Found another grouping with this name. Type in a UNIQUE name.");
                }
            } else {
                $("#JREditDialog .groupingCreateError:first").html("Error: You must type in a unique grouping name.");
            }
        },"","Create This Named Group",gButtonOffBgColor,gButtonOffColor,"12px")).css({"margin":"10px 0 0 35px"})).appendTo(groupingArea);
        $("#JREditDialog").dialog("open");
    } else {
        var realCreating = $("#JREditDialog").data("creating");
        formatDialog("JREditDialog",106,600,"No groupings selected!",theButton,"groupingCreate",true);
        $("#JREditDialog").data("yesFunction",function() {
            $("#JREditDialog").dialog( "close"); showGroupingCreateDialog($("#JREditDialog").data("button"),[],[],$("#JREditDialog").data("creating"));
        });
        $("#JREditDialog").dialog("option", "position", { my: "center top", at: "center top", of: $("body") });
		createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
        infoArea.appendTo($("#JREditDialog .JRContents:first"));
        if (realCreating == "selection") {
            createDiv().html("You forgot to select hits for the group. Try again?").css({"font-size":"14px","text-align":"center"}).appendTo(infoArea);
            $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Yes')").show();
            $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('No')").show();
            $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Cancel')").hide();
        } else {
            createDiv().html("There are no hits currently being collected. Start one first.").css({"font-size":"14px","text-align":"center"}).appendTo(infoArea);
        }
        $(".ui-dialog-titlebar").hide();
        $("#JREditDialog").dialog("open");
    }
}
function refreshGroupingHitsDialog(theKey,groupingViewArea) {
    var theGrouping = gGroupings[theKey].data.grouping, theDelayed = gGroupings[theKey].data.delayed;
    for (var i=0,len=theGrouping.length; i<len; i++) {
		var isDelayed = (theDelayed.indexOf(theGrouping[i]) != -1), theBackgroundColorNow = (isDelayed) ? "#33CC66" : "#ADFF2F";
		var thisRequesterName = (gRequestersData[theGrouping[i]].friendlyRName !== "") ? gRequestersData[theGrouping[i]].friendlyRName :
			((gRequestersData[theGrouping[i]].	requesterName !== "") ? gRequestersData[theGrouping[i]].requesterName : gRequestersData[theGrouping[i]].groupId);
        createDiv().attr("class","groupingHitCell")
            .css({"border-color":"MidnightBlue", "border-width":"3px", "border-style":"groove", "margin":"2px 4px","width":"180px","height":"40px",
                "background-color":theBackgroundColorNow, "font-size":"10px", "overflow":"hidden", "float":"left", "white-space":"nowrap", "padding":"3px 3px"})
            .data({"theNumber":theGrouping[i],"removeMe":false,"delayed":isDelayed})
            .append(createDiv(thisRequesterName))
            .append(createDiv(gRequestersData[theGrouping[i]].pay))
            .append(createDiv(gRequestersData[theGrouping[i]].title).css({"font-size":"8px"}))
			.bind("contextmenu", function(e) {
				e.preventDefault();
				var thisCell = $(e.target).closest(".groupingHitCell");
                $("#JREditDialog").data("edited",true);
                $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Save')").show();
				if ($(thisCell).data("delayed")) $(thisCell).data("delayed",false);
				else { $(thisCell).data("delayed",true); $(thisCell).data("removeMe",false); }
                $(thisCell).css("background-color",($(thisCell).data("removeMe")) ? "#F08080" : ($(thisCell).data("delayed")) ? "#33CC66" : "#ADFF2F");
			})
            .click( function(e) {
				var thisCell = $(e.target).closest(".groupingHitCell");
                $("#JREditDialog").data("edited",true);
                $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Save')").show();
				$(thisCell).data({"delayed":false,"removeMe":!$(thisCell).data("removeMe")});
                $(thisCell).css("background-color",($(thisCell).data("removeMe")) ? "#F08080" : "#ADFF2F");
            }).appendTo(groupingViewArea);
    }
    $("<br clear='all' class='cleartab'>").appendTo(groupingViewArea);
}
function refreshGroupingsDialog(groupingViewArea) {
    var returnValue = {"noGrouping":false,"collecting":false};
    $(groupingViewArea).find(".groupingLine").each( function() { $(this).remove(); });
    $.each(gGroupingsSort, function( index, theKey ) {
        var value = gGroupings[theKey];
        if (theKey != "JR First") {
			var addGroupingButtonArea = null, theBackground = "#F1EDC2";
            if (value.collecting) { theBackground = "#66CD00"; returnValue.collecting = true; }
            if (!checkGroupings(value)) { theBackground = "#F08080"; returnValue.noGrouping = true; }
            if (value.data.grouping.length===0) { theBackground = "#F08080"; returnValue.noGrouping = true; }
            var groupingLine = createDiv().attr({"class":"groupingLine"}).data({"theKey":theKey,"theIndex":index})
                .css({"margin-top":"2px","background-color":theBackground,"padding":"2px 3px 2px 3px","height":"17px","border":"2px ridge black",
					"cursor":"pointer","box-sizing":"content-box"})
                .click( function() {
                    if (value.data.grouping.length>0) {
                        value.collecting = !value.collecting;
                        for (var i=0,len=value.data.grouping.length; i<len; i++) {
                            if ($("#JRCollectB_" + value.data.grouping[i]).length) {
								var thisNumber = value.data.grouping[i];
                                if (value.collecting) {
									toggleButtonOn( $("#JRCollectB_" + thisNumber),startCollecting,stopCollecting);
									if (value.data.delayed.indexOf(thisNumber) != -1) toggleButton($("#JRHamB_" + thisNumber),hamOn,hamOff,"paused","off");
								}
                                else {
									toggleButtonOff( $("#JRCollectB_" + thisNumber),startCollecting,stopCollecting);
									toggleButtonOff( $("#JRHamB_" + thisNumber),hamOn,hamOff);
								}
                            } else console.log("bad button");
                        }
                        if (value.collecting) gGroupingsSort.splice(0, 0, gGroupingsSort.splice(index, 1)[0]);
                        refreshGroupingsDialog($("#JREditDialog .groupingViewArea"));
                    }
                }).appendTo(groupingViewArea);
            createSpan().html(theKey + " - " + value.data.description).appendTo(groupingLine);
            $(createSpanButton( function(e) {
                e.stopPropagation();
				showYesNoDialog("Are you sure you want me to delete this job?<br>" + $(e.target).data("theKey"),function(thisKey,thisIndex) {
                    delete gGroupings[thisKey]; delete gGroupingData[thisKey];
                    gGroupingsSort.splice(thisIndex, 1);
                    saveSettings( function() { refreshGroupingsDialog($("#JREditDialog .groupingViewArea")); });
				}, $(e.target).data("theKey"), $(e.target).data("theIndex"));
            },"","Del",gButtonOffBgColor,gButtonOffColor,"12px")).data({"theKey":theKey,"theIndex":index}).css({"float":"right"}).appendTo(groupingLine);
            $(createSpanButton( function(e) {
                e.stopPropagation(); $("#JREditDialog").dialog( "close");
				showGroupingCreateDialog($("#JREditDialog").data("button"),[],[],"add",$(e.target).data("theKey"));
            },"","Add",gButtonOffBgColor,gButtonOffColor,"12px")).data({"theKey":theKey,"theIndex":index}).css({"float":"right"}).appendTo(groupingLine);
            $(createSpanButton( function(e) {
                e.stopPropagation(); var theKey = $(e.target).data("theKey");
                formatDialog("JREditDialog",600,815,"Groupings Edit: " + theKey,$("#JREditDialog").data("button"),"groupingHitsEdit",true);
                $("#JREditDialog").data({"nameKey":theKey,"NOCloseDialog":true});
                $("#JREditDialog").data("closeme",function() { showGroupingDialog("view",$("#JREditDialog").data("button")); });
				createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
				createDiv().html("Click on the jobs to toggle it from keeping or removing it. [Red = remove] [Bright Green = keep]<br>Right click to make it a delayed Ham mode which will have a dark green background.")
					.css({"font-size":"13px","text-align":"center"}).appendTo($("#JREditDialog .JRContents:first"));
				var editGroupArea = createDiv().attr("class","editGroupArea").css({"margin":"10px 15px"}).appendTo($("#JREditDialog .JRContents:first"));
				createDiv().html("Group Name: ").append(createSpan(theKey.toString())).css("margin-top","4px")
					.attr({"class":"editLine hasHelptip","id":"groupNameEdit"}).appendTo(editGroupArea)
					.click( function() { dataEdited("JREditDialog",$(this),theKey); })
					.append(createSpan().attr("class","errorEditLine").css({"color":"red","margin-left":"5px"}));
				createDiv().html("Group Description: ").append(createSpan(gGroupingData[theKey].description.toString())).css("margin-top","2px")
					.attr({"class":"editLine hasHelptip","id":"groupDescriptionEdit"}).appendTo(editGroupArea)
					.click( function() { dataEdited("JREditDialog",$(this),gGroupingData[theKey].description); });
                var groupingViewArea = createDiv().attr("class","groupingViewArea").css({"border":"1px solid grey","margin":"15px 1px","padding":"5px 1px"})
                    .appendTo($("#JREditDialog .JRContents:first"));
                refreshGroupingHitsDialog(theKey,groupingViewArea);
            },"","Edit",gButtonOffBgColor,gButtonOffColor,"12px")).data({"theKey":theKey,"theIndex":index}).css({"float":"right"}).appendTo(groupingLine);
        }
    });
    if (returnValue.collecting) $("#JREditDialog .JRCollectingInstr").html("Groupings which are collecting are in green color.");
    else $("#JREditDialog .JRCollectingInstr").html("");
    if (returnValue.noGrouping) $("#JREditDialog .JREmptyInstr").html("Groupings which have NO hits grouped are in red.");
    else $("#JREditDialog .JREmptyInstr").html("");
}
function showGroupingDialog(doThis,theButton) {
	var dialogHeight = ($(window).height() > 600) ? 600 : $(window).height()-60;
    formatDialog("JREditDialog",600,780,"Groupings List:",theButton,"grouping " + doThis,true);
    $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Cancel') span").html("Close");
	createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
    var infoArea = createDiv().attr("class","infoArea").css({"margin":"15px 15px","text-align":"center"}).appendTo($("#JREditDialog .JRContents:first"));
    createDiv().html("Click on the Grouping Name you want to start or stop.").css("font-size","14px").appendTo(infoArea);
    createDiv().html("").attr({"class":"JRCollectingInstr"}).css("font-size","14px").appendTo(infoArea);
    createDiv().html("").attr({"class":"JREmptyInstr"}).css("font-size","14px").appendTo(infoArea);
    var groupingViewArea = createDiv().attr("class","groupingViewArea").css({"border":"1px solid grey","margin":"15px 15px","padding":"5px 3px"})
        .appendTo($("#JREditDialog .JRContents:first"));
    refreshGroupingsDialog(groupingViewArea);
    $("#JREditDialog").dialog("open");
}
function showExportImportDialog(porting,theButton) {
    formatDialog("JREditDialog",210,400,porting + " data",theButton,"export and importing",true);
	createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
    $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Cancel') span").html("Close");
    var exportImportArea = createDiv().attr("class","exportImportArea").css("margin","15px 15px").appendTo($("#JREditDialog .JRContents:first"));
    if (porting=="Export") {
        createDiv().append(createCheckbox().attr("class","exportAlarms").prop('checked', false).css("margin-left","25px"))
			.append(createSpan("Export Alarm Sounds Too.")).appendTo(exportImportArea);
        createDiv().css({"margin-top":"15px"}).append($(createSpanButton( function(e) { checkDelayedSave();
            var theButton = $("#JREditDialog").data("button");
            $("#JREditDialog").data("button",null);
            toggleButton(theButton,null,null);
            $("#JREditDialog").dialog("close");
			var exportAlarms = $("#JREditDialog .exportAlarms:first").prop('checked');
            exportJobs(exportAlarms);
        },"","Export to File",gButtonOffBgColor,gButtonOffColor,"12px"))).appendTo(exportImportArea);
    } else {
        createDiv().append(createCheckbox().attr("class","importData").prop('checked', true).css("margin-left","25px"))
			.append(createSpan("Import Data"))
			.append(createCheckbox().attr("class","importAlarms").prop('checked', true).css("margin-left","25px"))
			.append(createSpan("Import Alarms")).appendTo(exportImportArea);
        createDiv().css({"margin":"10px 0 10px 0"}).append($("<input>").attr({"type":"file","accept":".json","id":"importFileInput"})
            .change( function(event) { $("#importFromFileButton").data("disabled",false).css({"background-color":gButtonOffBgColor}); } )).appendTo(exportImportArea);
        $(createSpanButton( function(e) { checkDelayedSave();
				var importAlarms = $("#JREditDialog .importAlarms:first").prop('checked'), importData = $("#JREditDialog .importData:first").prop('checked');
                if ( !$(e.target).data("disabled") ) importJobs( $("#importFileInput").prop("files")[0], importData, importAlarms );
                var theButton = $("#JREditDialog").data("button");
                $("#JREditDialog").data("button",null); toggleButton(theButton,null,null); $("#JREditDialog").dialog("close");
            },"","Import From File",gButtonDisabledBgColor,gButtonOffColor,"12px")).appendTo(exportImportArea).attr({"id":"importFromFileButton"}).data("disabled",true);
    }
    $("#JREditDialog").dialog("open");
}
function searchingFilter(filterOn,index) {
	if (index=="0") return false;
	if (filterOn=="collecting") return (gMainData.hitCollection[parseInt(index)].collecting=="on");
	if (filterOn=="notcollecting") return (gMainData.hitCollection[parseInt(index)].collecting=="off");
	if (filterOn=="search") return (gMainData.hitCollection[parseInt(index)].data.action.substring(0,6).toLowerCase()=="search");
	if (filterOn=="once") return (gMainData.hitCollection[parseInt(index)].data.once);
	return true;
}
function doSearchNow(searchWhere) {
	var searchArea = (searchWhere=="mturk") ? document.getElementById("JRSavedMturkArea1") : document.getElementById("JRSavedJobsArea1");
	var theDialog = document.getElementById("JRjqModalDialog-Search");
	searchArea.getElementsByClassName("searchingResultsArea")[0].innerHTML = "";
	searchArea.getElementsByClassName("searchingResultsArea")[0]
		.appendChild(createDiv2(null,"Searching now. Wait Please......","font-size:25px; margin-top:200px; text-align:center;"));
	theDialog.setAttribute("savedSearch_" + searchWhere,searchArea.getElementsByClassName("searchingInput")[0].value);
	gTemplateHitRow=null;
	if (searchWhere=="mturk") {
		var sortingBy = $("#searchControlArea input[name='sortingOn']:checked").val();
		var sortingByText = (sortingBy == "highestNumber") ? "&sortType=NumHITs%3A1" : (sortingBy == "highestAmount") ? "&sortType=Reward%3A1" : "&sortType=LastUpdatedTime%3A1";
		theCycler.addJob( function( elapsed, theNumber ) {
			var theUrl = "https://worker.mturk.com/projects?page_size=50&filters%5Bqualified%5D=true&filters%5Bmasters%5D=false&sort=num_hits_desc&filters%5Bmin_reward%5D=0.00&format=json";
            requestUrl(theUrl,-54,parseHitSearchPage, errorRequest, searchWhere, null, "json", "application/json");
			return true;
		}, -54, 0, true);
		theCycler.frontOfTheLine(-54);
	} else {
		var searchingJob = $("#searchControlArea input[name='searchingJob']:checked").val(), theHitRow=null, numCounter=0;
		searchArea.getElementsByClassName("searchingResultsArea")[0].innerHTML = "";
		var captions = {"requesterName":"Requester Name","title":"Hit Title","duration":"Time","pay":"Pay","keyno1":"","keyno2":"","keyno3":"","jobNumber":"-1","friendlyRName":"","friendlyTitle":""};
		var dialogWidth = theDialog.offsetWidth;
		var returnedHitRow = createHitRow(captions,false,dialogWidth,500,searchWhere);
		if (returnedHitRow) searchArea.getElementsByClassName("searchingResultsArea")[0].appendChild(returnedHitRow);
		searchArea.getElementsByClassName("searchingResultsArea")[0].appendChild(
			createDiv2(null," ","margin-left:20px; margin-top:0px; background-color:black; height:6px; width:" + (dialogWidth - 245) + "px;"));
		var jobData = JSON.parse(JSON.stringify(gJobDataDefault));
		var searchValue = (searchArea.getElementsByClassName("searchingInput")[0].value).toLowerCase();
		for (var key in gRequestersData) {
			value = gRequestersData[key];
			if (searchingFilter(searchingJob,key)) {
				var fullSearchString = value.requesterName + " , " + value.title + " , " + value.friendlyRName + " , " + value.friendlyTitle;
				if ( (searchValue==="") || (fullSearchString.toLowerCase().indexOf(searchValue) != -1) ) {
					jobData.requesterName = value.requesterName; jobData.requesterId = value.requesterId; jobData.groupId = value.groupId;
					jobData.friendlyRName = value.friendlyRName; jobData.friendlyTitle = value.friendlyTitle; jobData.pay = value.pay;
					jobData.pay = value.pay; jobData.duration = value.duration; jobData.title = value.title; jobData.jobNumber=key;
					theHitRow = createHitRow(jobData,false,dialogWidth,500,searchWhere);
					if (theHitRow) searchArea.getElementsByClassName("searchingResultsArea")[0].appendChild(theHitRow);
					numCounter++;
				}
			}
		}
		searchArea.getElementsByClassName("JRTotalFound")[0].innerHTML = "Found " + numCounter + " Jobs";
		gSavedSearchArea = $(searchArea).find(".searchingResultsArea").html();
	}
}
function removeJob(thisNumber) {
	if (thisNumber>0) {
		if (gMainData.hitCollection[thisNumber].ham != "off") toggleButtonOff($("#JRHamB_" + thisNumber),hamOn,hamOff);
		stopCollecting(thisNumber);
		$("#JRCellNum_" + thisNumber).remove();
		var thePositions = gTabsData[gMainData.hitCollection[thisNumber].tabIndex].positions;
		delete gMainData.hitCollection[thisNumber]; delete gRequestersData[thisNumber];
		var theIndex = thePositions.indexOf(thisNumber);
		if ( theIndex > -1) thePositions.splice(theIndex, 1);
		saveSettings();
		return true;
	}
	return false;
}
function searchMturk(theArea,savedSearch) {
    createDiv().html("Type in a search word: ").css({"font-size":"15px","text-align":"left"})
		.append(createTextInput(savedSearch).attr("class","searchingInput").css({"width":"300px","margin-left":"10px","line-height":"17px"}).data("searchingFor","mturk")
		.keypress( function(e) { if ( e.which == 13 ) { doSearchNow("mturk"); } }))
		.append($(createSpanButton( function(e) { doSearchNow("mturk"); },"","Search",gButtonOffBgColor,gButtonOffColor,"12px")))
		.append(createSpan().css({"padding-left":"10px","font-size":"10px","display":"inline-block"}).attr({"class":"JRTotalFound"})).appendTo(theArea);
	createDiv().append(createRadioButton("sortingOn","newest").attr("checked",true).css({"margin-left":"200px"})
		.click( function() { $("#JRSavedJobsArea1 .searchingInput").focus(); doSearchNow("mturk"); } )).append(createSpan("Newest"))
		.append(createRadioButton("sortingOn","highestAmount").css({"margin-left":"20px"})
		.click( function() { $("#JRSavedJobsArea1 .searchingInput").focus(); doSearchNow("mturk"); } )).append(createSpan("Highest Amount"))
		.append(createRadioButton("sortingOn","highestNumber").css({"margin-left":"20px"})
		.click( function() { $("#JRSavedJobsArea1 .searchingInput").focus(); doSearchNow("mturk"); } )).append(createSpan("Highest Number")).appendTo(theArea);
}
function searchJobs(theArea,savedSearch,theDefault) {
	createDiv().append(createRadioButton("searchingJob","all").attr("checked",(theDefault=="all" ? true : false)).css({"margin-left":"200px"})
		.click( function() { $("#JRSavedJobsArea1 .searchingInput").focus(); doSearchNow("jobs"); } )).append(createSpan("All Jobs"))
		.append(createRadioButton("searchingJob","collecting").attr("checked",(theDefault=="collecting" ? true : false)).css({"margin-left":"20px"})
		.click( function() { $("#JRSavedJobsArea1 .searchingInput").focus(); doSearchNow("jobs"); } )).append(createSpan("Collecting"))
		.append(createRadioButton("searchingJob","notcollecting").attr("checked",(theDefault=="notcollecting" ? true : false)).css({"margin-left":"20px"})
		.click( function() { $("#JRSavedJobsArea1 .searchingInput").focus(); doSearchNow("jobs"); } )).append(createSpan("Not Collecting"))
		.append(createRadioButton("searchingJob","search").attr("checked",(theDefault=="search" ? true : false)).css({"margin-left":"20px"})
		.click( function() { $("#JRSavedJobsArea1 .searchingInput").focus(); doSearchNow("jobs"); } )).append(createSpan("Searching Mode")).appendTo(theArea)
		.append(createRadioButton("searchingJob","once").attr("checked",(theDefault=="once" ? true : false)).css({"margin-left":"20px"})
		.click( function() { $("#JRSavedJobsArea1 .searchingInput").focus(); doSearchNow("jobs"); } )).append(createSpan("Only Once")).appendTo(theArea);
    createDiv().html("Type in a search word: ").css({"font-size":"15px","text-align":"left"})
		.append(createTextInput(savedSearch).attr("class","searchingInput").css({"width":"300px","margin-left":"10px","line-height":"17px"}).data("searchingFor","jobs")
		.keypress( function(e) { if ( e.which == 13 ) { doSearchNow("jobs"); } }))
		.append($(createSpanButton( function(e) { doSearchNow("jobs"); },"","Search",gButtonOffBgColor,gButtonOffColor,"12px")))
		.append($(createSpanButton( function(e) {
			showYesNoDialog("Are you sure you want me to delete the selected jobs?",function() {
				$("#JRSavedJobsArea1 input").each( function(i,theCheckbox) {
					var hitNumber = theCheckbox.getAttribute("data-hitNumber");
					if ($(theCheckbox).prop("checked")) { if (removeJob(hitNumber)) $(theCheckbox).closest(".hitRow").remove(); }
				});
			});
		},"","Delete Selected",gButtonOffBgColor,gButtonOffColor,"12px")))
		.append(createSpan().css({"padding-left":"10px","font-size":"10px","display":"inline-block"}).attr({"class":"JRTotalFound"})).appendTo(theArea);
}
function closeThisModal(event,modal) {
	var savedMturkArea = document.getElementById("JRSavedMturkArea1"), savedJobsArea = document.getElementById("JRSavedJobsArea1");
	if (savedMturkArea) { document.getElementById("JRSavedMturkArea1").style.display = "none"; document.getElementById("JRSavedJobsArea1").style.display = "none"; }
	var theButton = event.target.getAttribute("data-theButton");
	if (event.target.getAttribute("data-removeAfter") == "true") event.target.remove();
	if (theButton!=="") toggleButton($("#" + theButton),null,null);
}
function createThisModal(height,width,modalName,buttonId,showClose,removeAfter) {
	removeAfter = (typeof removeAfter != 'undefined') ? removeAfter : false;
	var dialogHeight = ($(window).height() > height) ? height : $(window).height()-70;
	var dialogWidth = ($(window).width() > width) ? width : $(window).width()-90;
	var thisModal = document.getElementById("JRjqModalDialog-" + modalName); // Find out if the dialog exists already so reuse it to save memory. If not create a new one.
	if (!thisModal) { thisModal = createDiv2("dialogModal","","height:"+dialogHeight+"px; width:"+dialogWidth+"px; color:black"); thisModal.id = "JRjqModalDialog-" + modalName; }
	else { thisModal.style.width = dialogWidth+"px"; thisModal.style.height = dialogHeight+"px color:black"; }
	$(thisModal).modal({"closeText":"Close","showClose": showClose}); // create the modal dialog. (Jquery)
	thisModal.setAttribute("data-theButton",(buttonId) ? buttonId : ""); thisModal.setAttribute("data-removeAfter",removeAfter);
	$(thisModal).one("modal:close", function(event, modal) { closeThisModal(event,modal); });
	return thisModal;
}
function showSearchingDialog(theButton,searchFor,theDefault,autoStart) {
	showSearchingDialog.theButton = theButton;
	var theButtonID = (theButton) ? theButton.attr("id") : null, thisModal = createThisModal(700,1150,"Search",theButtonID,true);
	theDefault = theDefault || "all"; autoStart = autoStart || false;
	var savedMturkArea = document.getElementById("JRSavedMturkArea1"), savedJobsArea = document.getElementById("JRSavedJobsArea1");
	if (!savedMturkArea) {
		savedMturkArea = createDiv2("savedArea",""); savedMturkArea.id = "JRSavedMturkArea1"; savedMturkArea.style.display = "none"; thisModal.appendChild(savedMturkArea);
	}
	if (!savedJobsArea) {
		savedJobsArea = createDiv2("savedArea",""); savedJobsArea.id = "JRSavedJobsArea1"; savedJobsArea.style.display = "none"; thisModal.appendChild(savedJobsArea);
	}
	var theSavedArea = (searchFor=="mturk") ? savedMturkArea : savedJobsArea, theContents = theSavedArea.getElementsByClassName("JRContents");
	if (theContents.length===0) theSavedArea.appendChild(createDiv2("JRContents","")); // create JRContents if it's not already created.
    else while (theContents[0].lastChild) { theContents[0].lastChild.remove(); } // Remove the Contents to add new fresh contents.
	theSavedArea.style.display = "block";
	var dataSavedSearch = thisModal.getAttribute("savedSearch_" + searchFor);
	var savedSearch = (dataSavedSearch) ? dataSavedSearch : "";
	var searchControlArea = createDiv().attr("id","searchControlArea").css({"margin":"8px 15px"}).appendTo($(theSavedArea).find(".JRContents:first"));
	if (searchFor=="mturk") searchMturk(searchControlArea,savedSearch);
	else searchJobs(searchControlArea,savedSearch,theDefault);
	var searchingResultsHeight = $("#JRjqModalDialog-Search").height() - 65;
	if (!$(theSavedArea).find(".searchingResultsArea").length) createDiv().attr("class","searchingResultsArea")
		.css({"margin":"10px 2px 0 2px","overflow":"auto","height":searchingResultsHeight}).html("").appendTo($(theSavedArea));
	thisModal.getElementsByClassName("searchingInput")[0].focus();
	thisModal.getElementsByClassName("searchingInput")[0].select();
	if (autoStart) doSearchNow(searchFor);
}
function showAddJobsDialog(theButton) {
    formatDialog("JREditDialog",250,600,"Add a new PANDA!",theButton,"add job",true);
	createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
    $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Cancel') span").html("Close");
    var addJobArea = createDiv().attr("class","addJobArea").css("margin","15px 15px").appendTo($("#JREditDialog .JRContents:first"));
    createDiv().html("Below enter the preview or the previewandaccept url.<br>You may enter just the groupID number too or a NS4T.net url.<br>")
        .append(createTextInput("").attr("class","groupIdInput").css({"width":"400px","margin-top":"10px","margin-left":"30px"})
            .keypress(function(e) {
                if(e.which == 13) $("#JREditDialog .JRAddPanda:first span").click();
            }))
        .append(createDiv()
            .append(createCheckbox().attr("class","collectNow").prop('checked', true).css("margin-left","70px")).append(createSpan("Start Collecting"))
            .append(createCheckbox().attr("class","onlyOnce").css("margin-left","20px")).append(createSpan("Collect only once"))).appendTo(addJobArea);
    var addGroupIDButtonArea = createDiv().append($(createSpanButton( function(e) {
        var theValue = $("#JREditDialog .groupIdInput:first").val(), collectNow = $("#JREditDialog .collectNow:first").prop('checked');
        var onlyOnce = $("#JREditDialog .onlyOnce:first").prop('checked'), parsedGroupID = "";
        $("#JREditDialog .groupIDError").html("");
        if (theValue==="") { $("#JREditDialog .groupIDError").html("Please Enter a url or GroupID first."); }
        else if (theValue.indexOf("groupId=")!=-1) {
            parsedGroupID = theValue.split("groupId=")[1];
            if (parsedGroupID.indexOf("&")!=-1) parsedGroupID = parsedGroupID.split("&")[0];
        } else if (theValue.indexOf("worker.mturk.com")!=-1) {
            parsedGroupID = theValue.split("projects/")[1].split("/tasks")[0];
        } else if (theValue.indexOf("ns4t.net/")!=-1) {
			gSavedAddUrl = theValue;
			$("#JREditDialog *").prop('disabled',true);
			theCycler.addJob( function( elapsed, theNumber ) {
				requestUrl(gSavedAddUrl,-99,function(theResult,theNumber) {
					var theFinalUrl = theResult.finalUrl;
					if (theFinalUrl.indexOf("groupId=")!=-1) {
						parsedGroupID = theFinalUrl.split("groupId=")[1]; if (parsedGroupID.indexOf("&")!=-1) parsedGroupID = parsedGroupID.split("&")[0];
						var newNumber = fillNewHitData("", "", parsedGroupID, "0.00", parsedGroupID, "", onlyOnce, false, collectNow);
						var theButton = $("#JREditDialog").data("button");
						theCycler.frontOfTheLine(newNumber); toggleButton(theButton,null,null); $("#JREditDialog").dialog("close");
					} else { $("#JREditDialog *").prop('disabled',false); $("#JREditDialog .groupIDError").html("ERROR: Please Enter a url or GroupID first."); }
				}, errorRequest);
				return true;
			}, -99, 0, true);
			theCycler.frontOfTheLine(-99);
        } else if (theValue.indexOf(" ")==-1) {
            parsedGroupID = theValue;
        } else { $("#JREditDialog .groupIDError").html("ERROR: Please Enter a url or GroupID first."); }
        if (parsedGroupID!=="") {
			var newNumber = fillNewHitData("", "", parsedGroupID, "0.00", parsedGroupID, "", onlyOnce, false, collectNow);
            var theButton = $("#JREditDialog").data("button");
            toggleButton(theButton,null,null);
			theCycler.frontOfTheLine(newNumber);
            $("#JREditDialog").dialog("close");
        }
    },"JRAddPanda","Add Panda for Group ID hit",gButtonOffBgColor,gButtonOffColor,"12px")).css({"margin":"6px 0 0 35px"})).appendTo(addJobArea);
    createSpan("").attr("class","groupIDError").css({"color":"red","margin-left":"10px"}).appendTo(addGroupIDButtonArea);
    $("#JREditDialog").dialog("open");
}
function alarmReaderEditor(fileInput) {
    $("#JREditDialog").data("edited",true);
    $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Save')").show();
    if (fileInput.prop("files")[0].size > 6000000) return -1;
    var reader = new FileReader();
    reader.onload = function() {
        var readerContents = reader.result, base64Audio = btoa(readerContents), newAudio = new Audio("data:audio/wav;base64," + base64Audio);
        playNewSound( newAudio ); fileInput.data("base64",base64Audio); fileInput.data("audio",newAudio);
    };
    reader.readAsBinaryString(fileInput.prop("files")[0]);
    reader.onerror = function() { alert('Unable to read ' + file.fileName); return -2; };
	return 1;
}
function showAlarmsDialog( theNumber, theButton ) {
	var dialogHeight = ($(window).height() > 700) ? 700 : $(window).height()-60;
    formatDialog("JREditDialog",dialogHeight,740,"Edit your alarms according to what you like:",theButton,"alarms",true);
    $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Cancel')").show();
    $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Cancel') span").html("Close");
	createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
    var alarmsIntroArea = createDiv().attr("class","alarmsIntroArea").css({"margin":"15px 15px"}).appendTo($("#JREditDialog .JRContents:first"));
    createDiv().html("Alarms must be less than 6MB. I recommend the alarms to be less than 10 seconds.<br>There is no limit to the length because the script doesn't check that.")
        .css({"font-size":"15px","text-align":"center","margin":"6px 15px"})
		.append(createSpan("<br>Due to browser security features, alarms may have not been loaded.<br>").css({"color":"red"})
			.append(createSpan("Click here for some help to load in the default alarms!").css({"cursor":"pointer"}).click( function() {
				$(".alarmsArea:first").css({"display":"none"}); $(".alarmsHelpArea:first").css({"display":"block"});
			} )))
		.appendTo(alarmsIntroArea);
    var alarmsArea = createDiv().attr("class","alarmsArea").css({"margin":"4px"}).appendTo($("#JREditDialog .JRContents:first"));
    var statusArea = createDiv("Status: ").attr("id","alarmStatusArea").css({"margin":"10px 15px"}).appendTo(alarmsArea);
    $.each(gAlarmSounds, function( index, value ) {
        var importFileID = "importFileInput-" + index;
		var soundDescription = value.desc.split("|");
		var addAppend = createSpan(soundDescription[0]).css({"font-size":"12px","font-weight":"normal"});
		if (soundDescription.length>1 && gSoundOptions[index].payRate!=="") addAppend = addAppend.append($(createSpanButton(function(e) {
				showPromptDialog("Enter the pay rate this alarm will sound when the pay rate is less than this:",
					$(e.target).html().replace("$",""),$("#JREditDialog").data("theButton"),function(theValue) {
						gSoundOptions[$(e.target).data("theIndex")].payRate = theValue;
						$(e.target).html("$" + theValue); $("#JRPromptDialog").dialog("close"); changeToEdited("JREditDialog");
				});
			},"","$" + gSoundOptions[index].payRate,"ivory","black","11px")).data("theIndex",index)).css({"font-weight":"normal"})
			.append(createSpan(soundDescription[1]).css({"font-size":"12px","font-weight":"normal"}));
		if (soundDescription.length>2) addAppend = addAppend.append($(createSpanButton(function(e) {
				showPromptDialog("Enter the minutes that this alarm will sound if the duration is less than this:",
					$(e.target).html().replace("$",""),$("#JREditDialog").data("theButton"),function(theValue) {
						gSoundOptions[$(e.target).data("theIndex")].lessMinutes = theValue;
						$(e.target).html(theValue); $("#JRPromptDialog").dialog("close"); changeToEdited("JREditDialog");
				});
			},"",gSoundOptions[index].lessMinutes,"ivory","black","11px")).data("theIndex",index).css({"font-weight":"normal"}))
			.append(createSpan(soundDescription[2]).css({"font-weight":"normal"}));
        var thisEdit = createDiv().attr("class","alarmInputEdits").css({"margin-top":"8px"})
            .append(createDiv().append($(createSpanButton(function(e) { playNewSound($("#" + importFileID).data("audio")); },
                    "","Play","ivory","black","11px")).css({"margin-right":"0"}))
				.append($(createSpanButton(function(e) { var thisIndex = $(e.target).data("theIndex");
						toggleButton(e.target, function() { gSoundOptions[thisIndex].mute=true; }, function() { gSoundOptions[thisIndex].mute=false; } );
						if ($(e.target).data("status") == "on") $(e.target).css({"background-color":"red"}); saveSettings(); },
					"thisMute","Mute","ivory","black","11px")).data({"status":"off","theIndex":index}).css({"margin-right":"0"}))
				.append($(createSpanButton(function(e) { var thisIndex = $(e.target).data("theIndex");
						toggleButton(e.target, function() { gSoundOptions[thisIndex].tts=true; }, function() { gSoundOptions[thisIndex].tts=false; } );
						if ($(e.target).data("status") == "on") $(e.target).css({"background-color":"green"}); saveSettings(); },
					"thisTTS","TTS","ivory","black","11px")).data({"status":"off","theIndex":index}).css({"margin-right":"0"}))
				.append($(createSpanButton(function(e) { $(e.target).closest(".alarmInputEdits").find(".JRChangingArea:first").css({"display":"block"}); },
					"","Change","ivory","black","11px")).css({"margin-right":"8px"})).append(addAppend))
            .append(createDiv().attr({"class":"JRChangingArea"}).html("Change to: ").css({"display":"none"})
				.append($("<input>").attr({"type":"file","id":importFileID,"accept":"audio/*"}).data({"audio":value.audio,"base64":null})
                .change( function() {
					var returnValue = alarmReaderEditor($(this));
					if ( returnValue > 0 ) $("#alarmStatusArea").html("Status: Audio File Loaded.").css("color","green");
					else if ( returnValue == -1 ) $("#alarmStatusArea").html("Status: Audio File was way too big. File must be less than 6MB").css("color","red");
					else $("#alarmStatusArea").html("Status: Audio File was not loaded. Are you sure it was an audio file?").css({"font-size":"12px","color":"green"});
				})).css({"font-size":"11px","margin":"5px 0 0 40px"})).appendTo(alarmsArea);
		if (gSoundOptions[index].mute) { toggleButton($(thisEdit).find(".thisMute"), null, null ); $(thisEdit).find(".thisMute").css({"background-color":"red"}); }
		if (gSoundOptions[index].tts) { toggleButton($(thisEdit).find(".thisTTS"), null, null ); $(thisEdit).find(".thisTTS").css({"background-color":"green"}); }
    });
    var alarmsHelpArea = createDiv().attr("class","alarmsHelpArea").css({"margin":"30px 4px 0 4px","display":"none","text-indent":"50px"}).appendTo($("#JREditDialog .JRContents:first"));
	createDiv("Some browsers may stop connecting to other domains when trying to load up the alarms. This will cause the alarms to not load and not play at all. It should have at least ask you to allow @connect connections. You can try to look for any security features in tampermoney or greasemonkey which handles the @connect mode. if this still doesn't work then you can save each alarm below and then load each in the alarm change page. The following default sounds are used below:").css({"font-size":"15px"}).appendTo(alarmsHelpArea);
	var theULArea = createDiv($("<ul>").attr({"id":"alarmHelpUL"})).appendTo(alarmsHelpArea);
    $.each(gAlarmSounds, function( index, value ) {
		var soundDescription = value.desc.split("|");
		var theDescription = soundDescription[0];
		if (soundDescription.length>1) theDescription = theDescription + "$" + gSoundOptions[index].payRate;
		if (soundDescription.length>2) theDescription = theDescription + soundDescription[1] + gSoundOptions[index].lessMinutes + soundDescription[2];
		$("<li>").append(createLink(value.default,value.default,"_blank",value.desc))
			.append(createSpan(" - " + theDescription)).appendTo($("#alarmHelpUL"));
    });
	createDiv($(createSpanButton( function() {
		$(".alarmsArea:first").css({"display":"block"});
		$(".alarmsHelpArea:first").css({"display":"none"});
	},"","Click to go back to alarm options page","ivory","black","15px")).css({"text-align":"center","margin-top":"30px"})).appendTo(alarmsHelpArea);
    $("#JREditDialog").dialog("open");
}
function limitValues(theValue,min,max) {
	if (theValue>=min && theValue<=max) return true; else {
		showWaitDialog("Value must be between " + min + "ms and " + max + "ms","",function() {},null,
			createDiv("Sorry. You can't go under " + min + "ms and can't go over " + max + "ms.")
				.css({"font-size":"18px","text-align":"center","margin":"20px 10px","line-height":"22px"}),false,180,400);
		return false;
	}
}
function showEditOptionsDialog( theNumber, theButton ) {
	var dialogHeight = ($(window).height() > 640) ? 640 : $(window).height()-60;
    formatDialog("JREditDialog",dialogHeight,650,"Change options:",theButton,"options",true);
	createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
    var optionsArea = createDiv().attr("class","optionsArea").css({"margin":"15px 15px"}).appendTo($("#JREditDialog .JRContents:first"));
    createDiv().html("Click on the options you would like to change below:").css({"font-size":"15px","text-align":"center"}).appendTo(optionsArea);
	createDiv().html("Default values by pressing D after text field or double click on number.").css({"font-size":"11px","text-align":"center"}).appendTo(optionsArea);
    createDiv().html("Show Help Tooltips: ").css("margin-top","30px").append(createSpan( gMainOptions.showHelpTooltips.toString() ).css("font-weight","bolder"))
        .attr({"class":"editLine isBool cantEdit hasHelptip","id":"showHelpTooltipsEdit","title":"Show help tootips on all buttons, tabs or editable options? " +
			"Sometimes these helpful tips can get in the way especially if you already know how everything works."})
        .click( function() { dataTrueFalse("JREditDialog",$(this),gMainOptions.showHelpTooltips); }).data("dataKey","showHelpTooltips").appendTo(optionsArea);
    createDiv().html("Disable Captcha Alert: ").css("margin-top","5px").append(createSpan( gMainOptions.disableCaptchaAlert.toString() ).css("font-weight","bolder"))
        .attr({"class":"editLine isBool cantEdit hasHelptip","id":"disableCaptchaAlertEdit","title":"Disable captcha alert because another script works better."}).appendTo(optionsArea)
        .click( function() { dataTrueFalse("JREditDialog",$(this),gMainOptions.disableCaptchaAlert); }).data("dataKey","disableCaptchaAlert");
    createDiv().html("Show Captcha Counter Text: ").css("margin-top","5px").append(createSpan( gMainOptions.captchaCountText.toString() ).css("font-weight","bolder"))
        .attr({"class":"editLine isBool cantEdit hasHelptip","id":"captchaCountTextEdit","title":"Disable the captcha counter text on the bottom."}).appendTo(optionsArea)
        .click( function() { dataTrueFalse("JREditDialog",$(this),gMainOptions.captchaCountText); }).data("dataKey","captchaCountText");
    createDiv().appendTo(optionsArea).append(createSpan("Captcha shown after #hits: ").append(createSpan(gMainOptions.captchaAt.toString()))
        .attr({"class":"editLine isInt hasHelptip","id":"captchaAtEdit","title":"Enter the number of hits accepted when usually a captcha shows up for you."})
		.data({"dataCheck":function(target) { return limitValues(parseInt($(target).val()),0,200); }, "dataKey":"captchaAt"}));
    createDiv().html("Disable Queue Watch Alert: ").css("margin-top","5px").append(createSpan( gMainOptions.disableQueueAlert.toString() ).css("font-weight","bolder"))
        .attr({"class":"editLine isBool cantEdit hasHelptip","id":"disableQueueAlertEdit","title":"Disable the queue alert for a hit when lower than a specified time."})
        .click( function() { dataTrueFalse("JREditDialog",$(this),gMainOptions.disableQueueAlert); }).data("dataKey","disableQueueAlert").appendTo(optionsArea);
    createDiv().html("Disable Desktop Notifications: ").css("margin-top","5px").append(createSpan( gMainOptions.disableNotifications.toString() ).css("font-weight","bolder"))
        .attr({"class":"editLine isBool cantEdit hasHelptip","id":"disableNotificationsEdit","title":"Disable the desktop notification that you get when accepting panda's"})
        .click( function() { dataTrueFalse("JREditDialog",$(this),gMainOptions.disableNotifications); }).data("dataKey","disableNotifications").appendTo(optionsArea);
    createDiv().html("Debugger Level: ").css("margin-top","15px").append(dataIncDecNumber("JREditDialog",gMainOptions.debugger,5)).data("dataKey","debugger")
        .attr({"class":"editLine cantEdit isInt hasHelptip","id":"debuggerEdit","title":"Enter in the level to show debugging logs in the console log of your " +
			"browser for testing purposes."}).appendTo(optionsArea);
	$(".editLine:not('.cantEdit')").click(function() {
		dataEdited("JREditDialog",$(this),gMainOptions[$(this).data("dataKey")],$(this).data("seconds2ms"));
	});
	tooltipCreateFix($(".editLine"),1000);
    $("#JREditDialog").dialog("open");
}
function showEditTimersDialog( theNumber, theButton ) {
	var dialogHeight = ($(window).height() > 640) ? 640 : $(window).height()-60;
    formatDialog("JREditDialog",dialogHeight,650,"Edit this hit:",theButton,"timers",true);
	createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
    var timersArea = createDiv().attr("class","timersArea").css({"margin":"15px 15px"}).appendTo($("#JREditDialog .JRContents:first"));
    createDiv().html("All the timers are measured in Milliseconds except for one.") .css({"font-size":"15px","text-align":"center"}).appendTo(timersArea);
	createDiv().html("Click on details to edit. Default values by pressing D after text field.<br>1000 Milliseconds is equal to 1 second.")
		.css({"font-size":"11px","text-align":"center"}).appendTo(timersArea);
    createDiv().appendTo(timersArea).css("margin-top","20px").append(createSpan("Cycle Timer1: ").append(createSpan(gMainOptions.cycleNumber.toString())).data("dataKey","cycleNumber")
        .attr({"class":"editLine isInt hasHelptip","id":"cycleNumberEdit","title":"This is the number of milliseconds for the script to wait until it checks on the next job. By default 980 should be fast enough to grab hits fast. Limits are: 500ms to 6000ms."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),500,8000); } ));
    createDiv().appendTo(timersArea).append(createSpan("Cycle Timer2: ").append(createSpan(gMainOptions.cycleNumber2.toString())).data("dataKey","cycleNumber2")
        .attr({"class":"editLine isInt hasHelptip","id":"cycleNumber2Edit","title":"Second cycle timer to use so you can run other scripts at same time. Limits are: 900ms to 7000ms."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),500,8000); } ));
    createDiv().appendTo(timersArea).append(createSpan("Cycle Timer3: ").append(createSpan(gMainOptions.cycleNumber3.toString())).data("dataKey","cycleNumber3")
        .attr({"class":"editLine isInt hasHelptip","id":"cycleNumber3Edit","title":"Third cycle timer to use so you can run other scripts at same time. Limits are: 1200ms to 8000ms."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),500,8000); } ));
    createDiv().appendTo(timersArea).append(createSpan("GoHam Cycle Timer: ").append(createSpan(gMainOptions.HamCycleNumber.toString())).data("dataKey","HamCycleNumber")
        .attr({"class":"editLine isInt hasHelptip","id":"HamCycleNumberEdit","title":"This is the number of milliseconds for the script to wait until it checks on the next job when in HAM mode. Limits are: 500ms to 1500ms."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),500,1500); } ));
    createDiv().appendTo(timersArea).append(createSpan("Default GoHam Delay Timer: ").append(createSpan(gMainOptions.hamDelayTimer.toString()))
		.data({"dataKey":"hamDelayTimer","seconds2ms":"seconds"})
        .attr({"class":"editLine isInt hasHelptip","id":"hamDelayTimerEdit","title":"When you change a job mode from normal to Delayed Ham Mode by click and holding the Ham button then this is the time the script will change back to Normal mode when it receives no more hits in Ham Mode. This time in seconds will be used for any NEW jobs. Limits are: 5s to 60s."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),5,60); } ));
    createDiv().appendTo(timersArea).append(createSpan("Check Queue Timer Every: ").append(createSpan(gMainOptions.queueTimer.toString())).data("dataKey","queueTimer")
        .attr({"class":"editLine isInt hasHelptip","id":"queueTimerEdit","title":"This is the time you want the script to check your mturk queue. A minute seems fine because it only uses it when you have a limit on a job. If this timer is too low then it can make collecting pandas slower. Limits are: 20000ms to 120000ms."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),20000,120000); } ));
    var AdvancedArea = createDiv().attr("class","advancedArea").css({"border":"1px solid grey","margin":"20px 0 0 0","padding":"5px 3px"}).appendTo(timersArea);
    createDiv().html("Advanced Options:").css({"font-size":"15px","text-align":"center"}).appendTo(AdvancedArea);
    createDiv().appendTo(AdvancedArea).css("margin-top","15px").append(createSpan("Cycle Increase Button: ").append(createSpan(gMainOptions.cycleIncrease.toString())).data("dataKey","cycleIncrease")
        .attr({"class":"editLine isInt hasHelptip","id":"cycleIncreaseEdit","title":"The number of milliseconds to add to the cycle when pressing the increase button in the cycler menu. Limits are: 5ms to 100ms."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),5,100); } ));
    createDiv().appendTo(AdvancedArea).append(createSpan("Cycle Decrease Button: ").append(createSpan(gMainOptions.cycleDecrease.toString())).data("dataKey","cycleDecrease")
        .attr({"class":"editLine isInt hasHelptip","id":"cycleDecreaseEdit","title":"The number of milliseconds to subtract from the cycle when pressing the decrease button in the cycler menu. Limits are: 5ms to 100ms."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),5,100); } ));
    createDiv().appendTo(AdvancedArea).append(createSpan("Cycle Add Time Button: ").append(createSpan(gMainOptions.cycleAdding.toString())).data("dataKey","cycleAdding")
        .attr({"class":"editLine isInt hasHelptip","id":"cycleAddingEdit","title":"The number of milliseconds to add to the cycle when pressing the add to button in the cycler menu. This is for a fast slow down instead of pressing the increase button a lot of times. Limits are: 200ms to 1100ms."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),200,1100); } ));
    createDiv().appendTo(AdvancedArea).append(createSpan("Cycle Auto Slowdown Increase: ").append(createSpan(gMainOptions.cycleAutoIncrease.toString())).data("dataKey","cycleAutoIncrease")
        .attr({"class":"editLine isInt hasHelptip","id":"cycleAutoIncreaseEdit","title":"The number of milliseconds to add to the cycle when it has received an exceed error from mturk. Don't want it to slow down too quick so a small number here should be fine. Limits are: 5ms to 100ms."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),5,100); } ));
	$(".editLine:not('.cantEdit')").click(function() {
		dataEdited("JREditDialog",$(this),gMainOptions[$(this).data("dataKey")],$(this).data("seconds2ms"));
	});
	tooltipCreateFix($(".editLine"),1000);
    $("#JREditDialog").dialog("open");
}
function showSearchOptions( theNumber, searchData ) {
	var dialogHeight = ($(window).height() > 500) ? 500 : $(window).height()-60, hitInfo = gMainData.hitCollection[theNumber];
    formatDialog("JREditDialog2",dialogHeight,500,"Edit Search Options",null,"searchoptions",true);
    $("#JREditDialog2").data({"searchOptions":searchData.searchOptions,"theNumber":theNumber});
	createDiv().attr("class","JRContents").appendTo($("#JREditDialog2"));
    var requesterArea = createDiv().attr("class","requesterArea").css("margin","25px 8px").appendTo($("#JREditDialog2 .JRContents:first"));
	if (!searchData.searchOptions.includeTerm.length) searchData.searchOptions.includeTerm[0] = "";
	if (!searchData.searchOptions.excludeTerm.length) searchData.searchOptions.excludeTerm[0] = "";
	if (!searchData.searchOptions.excludeGID.length) searchData.searchOptions.excludeGID[0] = "";
    createDiv().html("Search mode options. Click on details to edit.<br>When editing: Press D for default value.")
        .css({"font-size":"15px","text-align":"center"}).appendTo(requesterArea);
    createDiv().appendTo(requesterArea).css({"margin-top":"10px"}).append(createSpan("Minimum Pay: ")
			.append(createSpan( searchData.searchOptions.minReward.toString() )).data("dataKey","minReward")
        .attr({"class":"editLine isFloat hasHelptip","id":"minRewardEdit","title":"Enter the minimum reward to go panda on."}));
    createDiv().appendTo(requesterArea).css({"margin-top":"10px"}).append(createSpan("Maximum Pay: ")
			.append(createSpan( searchData.searchOptions.maxReward.toString() )).data("dataKey","maxReward")
        .attr({"class":"editLine isFloat hasHelptip","id":"maxRewardEdit","title":"Enter the maximum reward to go panda on."}));
    createDiv().appendTo(requesterArea).css({"margin-top":"10px"}).append(createSpan("Include Word or Term: ")
			.append(createSpan( searchData.searchOptions.includeTerm[0].toString() )).data({"dataKey":"includeTerm","dataType":"array"})
        .attr({"class":"editLine isArray hasHelptip","id":"includeTermEdit","title":"Enter a word or term that the title must have to panda."}));
    createDiv().appendTo(requesterArea).css({"margin-top":"10px"}).append(createSpan("Exclude Word or Term: ")
			.append(createSpan( searchData.searchOptions.excludeTerm[0].toString() )).data({"dataKey":"excludeTerm","dataType":"array"})
        .attr({"class":"editLine isArray hasHelptip","id":"excludeTermEdit","title":"Enter a word or term that the title must NOT have to panda."}));
    createDiv().appendTo(requesterArea).css({"margin-top":"10px"}).append(createSpan("Exclude Group ID: ")
			.append(createSpan( searchData.searchOptions.excludeGID[0].toString() )).data({"dataKey":"excludeGID","dataType":"array"})
        .attr({"class":"editLine isArray hasHelptip","id":"excludeGIDEdit","title":"Enter a Group ID that you don't want to panda on this search."}));
	$("#JREditDialog2 .editLine:not('.cantEdit,.editOn')").click(function() {
		dataEdited("JREditDialog2",$(this),($("#JREditDialog2").data("searchOptions"))[$(this).data("dataKey")]);
	});
	tooltipCreateFix($(".editLine"),1000);
    $("#JREditDialog2").dialog("open");
}
function showEditHitDialog( theNumber, theButton, closeFunction ) {
	var dialogHeight = ($(window).height() > 680) ? 680 : $(window).height()-60;
    formatDialog("JREditDialog",dialogHeight,650,"Edit this hit:",theButton,"job",true);
	if (closeFunction) $("#JREditDialog").data("NOCloseDialog",true);
    var hitInfo = gMainData.hitCollection[theNumber], hitData = hitInfo.data, searchData = jQuery.extend(true, {}, hitInfo.data.searchData);
    $("#JREditDialog").data({"theNumber":theNumber,"closeme":closeFunction,"searchOptions":searchData});
	createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
    var requesterArea = createDiv().attr("class","requesterArea").css("margin","15px 8px").appendTo($("#JREditDialog .JRContents:first"));
    createDiv().html("Details of hit. All can be edited except for details in red.").css({"font-size":"16px","text-align":"center"}).appendTo(requesterArea);
	createDiv().html("Click on details to edit. Default values by pressing D or double click number.").css({"font-size":"11px","text-align":"center"}).appendTo(requesterArea);
    createDiv().appendTo(requesterArea).css({"margin-top":"10px"}).append(createSpan("Queue Hit Limit: ").append(dataIncDecNumber("JREditDialog",hitData.queueHitLimit,26)).data("dataKey","queueHitLimit")
        .attr({"class":"editLine cantEdit isInt hasHelptip","id":"queueHitLimitEdit","title":"Enter the number of this hit in your queue. Once it has collected this amount of hits in the queue it will stop grabbing hits from this job. It will start grabbing more hits when there is less than this amount. Good for hits that have a limit or a short timer so it won't fill your queue with too many."}));
    createDiv().appendTo(requesterArea).append(createSpan("Queue # Limit: ").append(dataIncDecNumber("JREditDialog",hitData.queueLimit,26)).data("dataKey","queueLimit")
        .attr({"class":"editLine cantEdit isInt hasHelptip","id":"queueLimitEdit","title":"Enter the limit of the number of any hits in your queue. It will stop collecting these hits until your queue is less than this number. Doesn't matter what hits are in the queue. It only looks at the total number of the queue. Good when you don't want your queue to be filled."}));
    createDiv().appendTo(requesterArea).append(createSpan("Hit Weight: ").append(dataIncDecNumber("JREditDialog",hitData.weight,10000)).data("dataKey","weight")
        .attr({"class":"editLine cantEdit isInt hasHelptip","id":"weightEdit","title":"Weight for this hit. If weight is more than 0 than it will skip this number of cycles before it checks."}));
    createDiv().appendTo(requesterArea).append(createSpan("Daily Limit: ").append(createSpan( hitData.dailyLimit.toString() )).data("dataKey","dailyLimit")
        .attr({"class":"editLine isInt hasHelptip","id":"dailyLimitEdit","title":"Enter the number to limit this hit for collection per day. Once it collects this amount of hits from this panda it will stop until the next day."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),0,3800); } ));
    createDiv().appendTo(requesterArea).append(createSpan("Ham Timer (seconds): ").append(createSpan( hitData.hamTimer.toString() )).data("dataKey","hamTimer")
        .attr({"class":"editLine isInt hasHelptip","id":"hamTimerEdit","title":"Enter the number of seconds this hit should be on Ham after a delayed ham reaction. This only works when you put the ham button in the delayed ham status. When a panda is found it will instantly start hamming this hit at the global ham timer. When it stops seeing any more hits it will wait this amount of seconds to turn off Ham and go back into delayed Ham status."})
		.data("dataCheck",function(target) { return limitValues(parseInt($(target).val()),5,60); } ));
    createDiv().html("Once: ").css("margin-top","5px").append(createSpan( hitData.once.toString() ).css("font-weight","bolder")).data("dataKey","once")
        .attr({"class":"editLine isBool cantEdit hasHelptip","id":"onceEdit","title":"If this is true then it will only collect one hit and then it will stop. You can start it again and it will collect one again. This is very useful for surveys."})
		.click( function() { dataTrueFalse("JREditDialog",$(this),hitData.once); }).appendTo(requesterArea);
    createDiv().html("Force Delayed Ham on Collect: ").css("margin-top","5px").append(createSpan( hitData.stickyDelayedHam.toString() ).css("font-weight","bolder")).data("dataKey","stickyDelayedHam")
        .attr({"class":"editLine isBool cantEdit hasHelptip","id":"stickyDelayedHamEdit","title":"Starts in delayed ham mode automatically when collect button is clicked when this option is true. By default it is false."})
		.click( function() { dataTrueFalse("JREditDialog",$(this),hitData.stickyDelayedHam); }).appendTo(requesterArea);
    createDiv().appendTo(requesterArea).append(createSpan("Friendly Requester Name: ").append(createSpan(hitData.friendlyRName)).data({"dataKey":"friendlyRName","idToo":"friendlyTitleEdit"})
        .attr({"class":"editLine hasHelptip","id":"friendlyRNameEdit","title":"Enter a friendly name for this requester. This name will show on the hit cell instead of the original name. Enter a blank name to show the original name."}));
    createDiv().appendTo(requesterArea).append(createSpan("Friendly Title: ").append(createSpan(hitData.friendlyTitle)).data({"dataKey":"friendlyTitle","idToo":"friendlyRNameEdit"})
        .attr({"class":"editLine hasHelptip","id":"friendlyTitleEdit","title":"Enter a friendly title for this hit. This title will show on the hit cell instead of the original title. Useful for long titles so you can shorten it or make it more rememorable. Enter a blank title to show the original title."}));
    var advancedArea = createDiv().attr("class","advancedArea").css({"border":"1px solid grey","margin":"15px 0 0 0","padding":"5px 3px"}).appendTo(requesterArea);
    createDiv().html("Advanced Options most are changed by the script automatically:").css({"font-size":"12px","text-align":"center"}).appendTo(advancedArea);
    createDiv().html("The Number: ").append(createSpan(theNumber)).css({"margin-top":"5px","color":"red"}).appendTo(advancedArea);
    createDiv().html("Action Mode: ").attr({"title":"Panda = Preview and Accept. (Regular mode)\nSearch = Panda first hit from requester. (For hits that have a lot of pandas)"})
		.append(dataRadioButtons("JREditDialog","actionMode",["Panda","Pantha","Search","Other"],hitData.action.toLowerCase(),function(thisValue) {
			$("#actionEdit").data("focusOff",true);
			dataEdited("JREditDialog",$("#actionEdit"),hitData.action);
			if (thisValue != "other") { $("#actionEdit input").val(thisValue); } else { $("#actionEdit input").focus();}
			if (thisValue.toLowerCase()=="search") { $("#searchOptionsButton").show(); }  else { $("#searchOptionsButton").hide(); }
			$("#actionEdit").data("focusOff",false);
		})).appendTo(advancedArea);
    createDiv().appendTo(advancedArea).append(createSpan("Action: ").append(createSpan(hitData.action)).data("dataKey","action")
        .attr({"class":"cantEdit editLine hasHelptip","id":"actionEdit","title":"Advanced use only. Should be Panda for normal use."})
		.data("focusOff",false)
		.data("doClick",function() {
			$("#other_radio_3").prop("checked",true).button("refresh");
			if ($("#actionEdit .theInputEdit").val().toLowerCase()=="search") $("#searchOptionsButton").show();
		})
		.data("doFocus",function() { $("#other_radio_3").prop("checked",true).button("refresh"); })
		.data("doInput",function() { if ($("#actionEdit .theInputEdit").val().toLowerCase()=="search") $("#searchOptionsButton").show(); else $("#searchOptionsButton").hide(); })
		.data("dataCheck",function(target) {
			if (!$(target).length) return true;
			var theValue = $(target).val().toLowerCase();
			var acceptableValue = ["panda","search","pantha","searchpantha","searchandfilter","filterpanda"];
			if ($.inArray(theValue,acceptableValue) == -1 ) {
				showWaitDialog("No such mode found.","",function() {},null,
					createDiv("Action Mode was not an accepted mode.<br>Action mode was changed back.")
						.css({"font-size":"18px","text-align":"center","margin":"20px 10px","line-height":"22px"}),
					false,180,400);
				$(target).val( ($.inArray(hitData.action,acceptableValue) == -1) ? "panda" : hitData.action);
				return false;
			} else if (theValue.indexOf("search") != -1) {
				var thisRequesterID = ($("#requesterIdEdit input").length) ? $("#requesterIdEdit input").val() : $("#requesterIdEdit span").text();
				if (thisRequesterID === "") {
					showWaitDialog("No such mode found.","",function() {},null,
						createDiv("Action Mode Search needs a Requester ID to work properly.<br>Action mode was changed back.")
							.css({"font-size":"18px","text-align":"center","margin":"20px 10px","line-height":"22px"}),
						false,180,600);
					$(target).val(($.inArray(hitData.action,acceptableValue) == -1) ? "panda" : hitData.action);
					return false;
				}
			}
			return true;
		})
        .click( function() { if ($(this).find("span:not(.errorEditLine)").length) { $("label[for='other_radio_3']:first").click(); dataEdited("JREditDialog",$(this),hitData.action); } })
		.append($(createSpanButton(function(e) {
			e.stopPropagation();
			createADialog("JREditDialog2","Search Options",250,310,true,function() {
				var theNumber = $("#JREditDialog2").data("theNumber"), hitInfo = gMainData.hitCollection[theNumber];
				saveEditedData(); $("#JREditDialog2").dialog( "close"); $("#JREditDialog2").remove(); changeToEdited("JREditDialog"); return false;
			});
			showSearchOptions( $("#JREditDialog").data("theNumber"), $("#JREditDialog").data("searchOptions") );
			return true;
		},"optionButton","Options",gButtonOffBgColor,gButtonOffColor,"8px")).attr({"id":"searchOptionsButton"}).css({"margin-left":"10px"}).hide()));
    createDiv().appendTo(advancedArea).append(createSpan("Requester Name: ").append(createSpan(hitData.requesterName)).data("dataKey","requesterName")
        .attr({"class":"editLine hasHelptip","id":"requesterNameEdit","title":"This is the original title of the hit. Shouldn't edit this because the script will replace it when it finds the hit. Change the friendly name instead."}));
    createDiv().appendTo(advancedArea).append(createSpan("Requester ID: ").append(createSpan(hitData.requesterId)).data("dataKey","requesterId")
        .attr({"class":"editLine hasHelptip","id":"requesterIdEdit","title":"This is the ID of the requester. Script only uses it for search actions so don't worry about it. But if you know the requester ID you can fill it in to complete it or to have it do a search action instead."}));
    createDiv().appendTo(advancedArea).append(createSpan("Group ID: ").append(createSpan(hitData.groupId)).data("dataKey","groupId")
        .attr({"class":"editLine hasHelptip","id":"groupIdEdit","title":"No reason to change this because you can just add a new job a lot faster."}));
    createDiv().appendTo(advancedArea).append(createSpan("Pay: ").append(createSpan(hitData.pay)).data("dataKey","pay")
        .attr({"class":"editLine hasHelptip","id":"payEdit","title":"Pay reward for this job. Will be changed automatically if a hit is found."}));
    createDiv().appendTo(advancedArea).append(createSpan("Duration: ").append(createSpan(hitData.duration.replace(" 00 seconds",""))).data("dataKey","duration")
        .attr({"class":"editLine hasHelptip","id":"durationEdit","title":"Duration assigned for this job. Will be changed automatically if a hit is found."}));
    if (hitData.dailyLimit>0) createDiv().appendTo(advancedArea).append(createSpan("Hits Daily Collected: ").append(createSpan(hitData.dailyDone.toString()))
        .attr({"class":"editLine cantEdit","id":"dailyDoneEdit"}).data("dataKey","dailyDone"));
	var theAddedDate = (hitData.dateAdded) ? formatAMPM("short",new Date(hitData.dateAdded)) : "";
    createDiv().appendTo(advancedArea).append(createSpan("Date Added: ").append(createSpan(theAddedDate)).data("dataKey","dateAdded")
        .attr({"class":"editLine cantEdit","id":"dateAddedEdit"}));
    createDiv().appendTo(advancedArea).append(createSpan("Qualifications: ").append(createSpan(hitData.qual)).css("color","red") // Can not be edited.
        .attr({"class":"editLine cantEdit","id":"qualEdit"}));
    createDiv().appendTo(advancedArea).append(createSpan("Force Audio: ").append(createSpan(hitData.audioforce)).data("dataKey","audioforce")
        .attr({"class":"editLine hasHelptip","id":"audioforceEdit","title":"Not implemented yet. Will be used to change the alarm for this hit no matter the pay rate or duration."}));
    if (hitData.action.toLowerCase().indexOf("filter") != -1 && hitInfo.filterFuncData) {
        var filterModeArea = createDiv().html("Filter Mode: ")
            .attr({"class":"editLine hasHelptip","id":"filterModeEdit"}).appendTo(advancedArea)
            .change( function() { dataEdited("JREditDialog",$(this),hitData.filterMode.toString()); });
        var filterSelection = $("<select>").attr("name","filterMode").appendTo(filterModeArea);
        var selected = "";
        for (var i=0,len=Object.keys(hitInfo.filterFuncData).length; i<len; i++) {
            selected = (hitData.filterMode==i+1) ? " selected='selected'" : "";
            filterSelection.append("<option value=" + Object.keys(hitInfo.filterFuncData)[i] + selected + ">" + hitInfo.filterFuncData[i+1].filterName + "</option>");
        }
        selected = (hitData.filterMode===0) ? " selected='selected'" : "";
        filterSelection.append("<option value=0 " + selected + ">Off</option>");
    } else { if (hitData.action.toLowerCase()=="search") $("#searchOptionsButton").show(); }
    var buttonJobArea = createDiv().css({"margin-top":"35px"}).appendTo(requesterArea);
    var muteJobButton = $(createSpanButton( function(e) { checkDelayedSave();
			var theNumber = $("#JREditDialog").data("theNumber"), hitInfo = gMainData.hitCollection[theNumber];
            muteJob(theNumber); $(e.target).html( (hitInfo.data.mute) ? "Turn on Alarm" : "Mute Alarm" );
        },"editLine hasHelptip",(hitInfo.data.mute) ? "Turn on Alarm" : "Mute Alarm",gButtonOffBgColor,gButtonOffColor,"13px"))
        .css({"border-color":"blue"})
        .attr({"id":"muteJobButton","title":"Turn on or off the alarm. Used when there is a big batch and the alarm is too long or loud each time it accepts it. You can also right click on the hit cell to mute it a lot faster."}).appendTo(buttonJobArea);
    var deleteJobButton = $(createSpanButton( function(e) { checkDelayedSave();
			var theNumber = $("#JREditDialog").data("theNumber");
			showYesNoDialog("Are you sure you want me to delete this job?",function(thisNumber) { if (removeJob(thisNumber)) $("#JREditDialog").dialog( "close"); },theNumber);
        },"editLine hasHelptip","Delete Job",gButtonOffBgColor,gButtonOffColor,"13px"))
        .attr({"id":"deleteJobButton","title":"Delete this job from this script."}).css({"margin-left":"80px"}).appendTo(buttonJobArea);
	tooltipCreateFix($(".editLine"),1000);
	$(".editLine:not('.cantEdit,.editOn')").click(function() { dataEdited("JREditDialog",$(this),hitData[$(this).data("dataKey")]); });
    $("#JREditDialog").dialog("open");
}
function showHelpDialog( theHelpText, theHelpTitle, theButton ) {
	var dialogHeight = ($(window).height() > 680) ? 680 : $(window).height()-60;
    formatDialog("JREditDialog",dialogHeight,750,theHelpTitle,theButton,theHelpText,true);
    $("div[aria-describedby='JREditDialog'] .ui-dialog-buttonpane button:contains('Cancel') span").html("Close");
	createDiv().attr("class","JRContents").appendTo($("#JREditDialog"));
	var helpArea = createDiv().attr("class","helpArea").css("margin","15px 8px").appendTo($("#JREditDialog .JRContents:first"));
	if (theHelpText == "about") {
		createDiv().html("Panda Crazy is a script that was created when I didn't like putting timers for pandas because it would make it difficult to work from the queue. I also wanted more organization for pandas. First thing to know is that this script uses cycles instead of timers. A cycle is an amount of time the script will check a panda, check a queue or do something else. So instead of having 3 pandas running at 1 second interval this script will search 1 panda each cycle. So in theory if you had 3 pandas on and the cycle timer at 900ms then a panda will be checked every 3*900ms = 2700ms or 2 seconds and 700ms. This script is built with an automatic slow down when it receives exceed errors from mturk which makes it easier to work from queue while still collecting hits in the background.")
			.css({"font-size":"15px","text-align":"left","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("Don't worry if it might not make sense right now but using short timers for pandas can accept more but cause more exceed errors from mturk when working. This script can do a similar thing when you go Ham on a panda. Also setting the cycle timer to a lower time can make it accept more pandas. The default cycle timer is at 980ms which I found the fastest it could go without getting errors. I use the term job to represent a panda so don't get confused because I will use both interchangably.")
			.css({"font-size":"15px","text-align":"left","margin-top":"10px","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("Putting a job on Ham means it will pause all other jobs and only collect the current job. When a job is in Ham mode then it will collect at a faster rate which by default is 700ms. The thought process is you should go into Ham mode when a batch just dropped and you want to get as many as you can fast. Once your queue is full you should turn off Ham mode so you can work on your queue with no or little exceed errors.")
			.css({"font-size":"15px","text-align":"left","margin-top":"10px","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("This script will automatically slow down when it gets too many exceed errors. This allows you to work while it's collecting hits for you in the background. Check the Elapsed time status text at the top to make sure it's close to it's default cycle timer. If it's running too slow like at 2000ms then you can click on the reset timer button which will make it go back to the default cycle timer. If you are working from queue then the elapsed timer will be slower. I'd recommend leaving it alone until you finish the queue or the queue isn't filling up fast enough. You should have a full queue constantly on a big batch even at 2 seconds cycle.")
			.css({"font-size":"15px","text-align":"left","margin-top":"10px","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("* Most browsers hava a limit to how low a timer could go. Most limit it to 1 second but you can stop that by putting this script in a WINDOW of it's own. Don't put it in a tab because then any unfocused tab will limit it to only 1 second. This script can go under 1 second if it's in it's own Window.")
			.css({"font-size":"15px","text-align":"left","margin-top":"10px","text-indent":"50px"}).appendTo(helpArea);
	} else if (theHelpText == "cycler") {
		createDiv().html("The definition of a cycler for this script is an amount of time the script will wait until it does something. Instead of thinking about a timer for each panda you should think about a line in a store. The clerk will wait on one person at a time until the line is finished. Each job you have colleting will be put in a queue for the script to do. The queue is never ending until you stop the script or stop collecting jobs. The script will take care of each job in the queue one at a time at a specific cycle timer. The lower the cycler timer the faster it checks for pandas. You have 3 cycle timers you can choose from 1 being the fastest and 3 being the slowest. These timers can be changed in the options menu. Use the 2nd and 3rd timers so this script can run with other scripts and not give too many request errors.")
			.css({"font-size":"15px","text-align":"left","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("I find at 980ms is the fastest amount of time before getting exceed errors from mturk. If you are doing nothing else on mturk then the elapsed time at the top should be around 980ms. If the script gets some exceed errors it will start slowing down by adding time to the cycle timer. The amount which is added is set in the options menu. The default time added is 10ms so it won't slow down too fast. I find this is a good amount of time so you can work from queue and still collect pandas in the background. You can change this default option but it's not really recommended.")
			.css({"font-size":"15px","text-align":"left","margin-top":"10px","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("If you are working from your queue and getting too many exceed errors you can add time to the cycle timer from the cycler menu at the top. You can increase or decrease time by a certain amount set in the timers option menu. This time is at 10ms by default which you can change if you want. You can also add 650ms to the cycle timer if you want it to slow down NOW. Adding 650ms will usually make it slow enough for you to work and still grab jobs as fast as possible. You can change the 650ms in the timers option menu if you want.")
			.css({"font-size":"15px","text-align":"left","margin-top":"10px","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("When you finish your queue and find out that the elapsed time that the script is checking for jobs is much more than the default time then you can reset it back by pushing the reset timer button. If you see it at 2000ms, which is about 2 seconds, then it's best to reset it as long as you are doing nothing on mturk. Remember if you are using other scripts that check the search page for hits then this will cause more exceed errors and will slow the script down. ")
			.css({"font-size":"15px","text-align":"left","margin-top":"10px","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("* It's best to let the slow down happen for the best chance at getting pandas. There is an option to stop the slow down and should only be turned off for times you want to get as many pandas as possible on a batch that trickles down slowly. This option does not save because it can cause problems for you when working.")
			.css({"font-size":"15px","text-align":"left","margin-top":"10px","text-indent":"50px"}).appendTo(helpArea);
	} else if (theHelpText == "jobs") {
		createDiv().html("The definition for a job for this script is basically a panda. I use the term job for a panda interchangeably so don't be confused. Click on the add job button to add a job by entering the groupID or the full url of a panda link. You can also enter in the url of a preview link and the script will be able to change it to a panda. Once the job is added you will see a new cell in the current tab with the information for this new job.")
			.css({"font-size":"15px","text-align":"left","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("For more help on Jobs go to ").append(createLink("Jobs Topic on the help site",
			"http://pandacrazy.allbyjohn.com/help/jobs","_blank","http://pandacrazy.allbyjohn.com/help/jobs").click( function() {
					window.open("http://pandacrazy.allbyjohn.com/help/jobs","_blank","width=" + 1300 + ",height=" +  900 + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
					return false;
				})).css({"font-size":"15px","margin-left":"15px","margin-top":"15px","text-align":"left","font-weight":"bold"}).appendTo(helpArea);
	} else if (theHelpText == "jobDetails") {
		createDiv().html("You can change many options in the details section of a job. Some are simple like changing the friendly title and requester name to make it easy for you to remember a panda. The advanced options on the bottom shouldn't be changed because most of them are changed by the script.")
			.css({"font-size":"15px","text-align":"left","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("If you don't want a job to collect too many pandas you can change the queue limit. The queue limit will look at the number of hits in a queue and will not go beyond this limit. It doesn't care what hits are in there so it's not useful if you have a lot of hits in your queue already. This is best used for short timed hits where you don't want to fill your queue because you can't finish it in time.")
			.css({"font-size":"15px","text-align":"left","margin-top":"10px","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("For more help on job details go to ").append(createLink("Edit Details Topic on the help site",
			"http://pandacrazy.allbyjohn.com/help/jobs/edit-details","_blank","http://pandacrazy.allbyjohn.com/help/jobs/edit-details").click( function() {
					window.open("http://pandacrazy.allbyjohn.com/help/jobs/edit-details","_blank","width=" + 1300 + ",height=" +  900 + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
					return false;
				})).css({"font-size":"15px","margin-left":"15px","margin-top":"15px","text-align":"left","font-weight":"bold"}).appendTo(helpArea);
	} else if (theHelpText == "goHam") {
		createDiv().html("To \"Go Ham\" has nothing to do with the food. Go Ham in this instance means \"Going hard as a motherf**ker!\" Which means you want the script to go as fast as possible to collect as many hits as it can to fill up your queue. Great use for batches that drop during the day. It shouldn't be used for surveys or other hits that continously drop for the whole day. It's best for those batches that you have no idea when they drop.")
			.css({"font-size":"15px","text-align":"left","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("For more help on Go Ham mode go to ").append(createLink("Edit Details Topic on the help site",
			"http://pandacrazy.allbyjohn.com/help/ham-mode","_blank","http://pandacrazy.allbyjohn.com/help/ham-mode").click( function() {
					window.open("http://pandacrazy.allbyjohn.com/help/ham-mode","_blank","width=" + 1300 + ",height=" +  900 + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
					return false;
				})).css({"font-size":"15px","margin-left":"15px","margin-top":"15px","text-align":"left","font-weight":"bold"}).appendTo(helpArea);
	} else if (theHelpText == "groupings") {
		createDiv().html("Groupings are a way to start and stop a group of jobs all at once. The hits in a group can be from any tab. You can group them in any way you would like. A grouping can be set up for all the regular pandas you turn on in the morning or during the night. You can group all the short timed pandas together so you can easily turn them on or off. You can even group up jobs from the same requester if you wanted to.")
			.css({"font-size":"15px","text-align":"left","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("For more help on Groupings go to ").append(createLink("Groupings Menu Topic on the help site",
			"http://pandacrazy.allbyjohn.com/help/menu-buttons/grouping","_blank","http://pandacrazy.allbyjohn.com/help/menu-buttons/grouping").click( function() {
					window.open("http://pandacrazy.allbyjohn.com/help/menu-buttons/grouping","_blank","width=" + 1300 + ",height=" +  900 + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
					return false;
				})).css({"font-size":"15px","margin-left":"15px","margin-top":"15px","text-align":"left","font-weight":"bold"}).appendTo(helpArea);
	} else if (theHelpText == "tabs") {
		createDiv().html("Tabs are a way for organizing your jobs in different ways. The main tab is permanent and can not be deleted. Also any jobs in tabs which are deleted will be moved to the Main tab. When you first install the script you will see 3 tabs by default just to give you examples. You can delete them or rename them in any way you want. If you want to rename a tab then righ click on the tab. It will bring up a dialog asking you for the new name of the tab. If you want to delete a tab then click on the x on the tab. Remember any hits inside the tab when deleted will be moved to the Main tab.")
			.css({"font-size":"15px","text-align":"left","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("For more help on the Tabs Row go to ").append(createLink("Tabs Row Topic on the help site",
			"http://pandacrazy.allbyjohn.com/help/tabs","_blank","http://pandacrazy.allbyjohn.com/help/tabs").click( function() {
					window.open("http://pandacrazy.allbyjohn.com/help/tabs","_blank","width=" + 1300 + ",height=" +  900 + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
					return false;
				})).css({"font-size":"15px","margin-left":"15px","margin-top":"15px","text-align":"left","font-weight":"bold"}).appendTo(helpArea);
	} else if (theHelpText == "options") {
		createDiv().html("The options menu is where all the different changes can be made to the functionality of the script. You can change the timers, alarms or other general options. There is another button to stop the auto slow down of the script when it receives exceed errors. It's best to not touch this button so you can work from queue and still have the script collect pandas without getting too many errors. The whole purpose of this script is to allow you to work as it collects hits in the background.")
			.css({"font-size":"15px","text-align":"left","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("For more help on the Options menu go to ").append(createLink("Options Menu Topic on the help site",
			"http://pandacrazy.allbyjohn.com/help/menu-buttons/options","_blank","http://pandacrazy.allbyjohn.com/help/menu-buttons/options").click( function() {
					window.open("http://pandacrazy.allbyjohn.com/help/menu-buttons/options","_blank","width=" + 1300 + ",height=" +  900 + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
					return false;
				})).css({"font-size":"15px","margin-left":"15px","margin-top":"15px","text-align":"left","font-weight":"bold"}).appendTo(helpArea);
	} else if (theHelpText == "statustext") {
		createDiv().html("The status text at the top shows a lot of different data so you can know it's working the best possible way. You will use the status to know how many jobs are being collected. You can find out how many pandas have been collected. It also collects the amount of money you will get if you submitted all the collected hits. The script doesn't know if you returned or a hit was abandoned so the pay amount is only an estimation.")
			.css({"font-size":"15px","text-align":"left","text-indent":"50px"}).appendTo(helpArea);
		createDiv().html("For more help on the Status Row go to ").append(createLink("Status Row Topic on the help site",
			"http://pandacrazy.allbyjohn.com/help/status-row","_blank","http://pandacrazy.allbyjohn.com/help/status-row").click( function() {
					window.open("http://pandacrazy.allbyjohn.com/help/status-row","_blank","width=" + 1300 + ",height=" +  900 + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
					return false;
				})).css({"font-size":"15px","margin-left":"15px","margin-top":"15px","text-align":"left","font-weight":"bold"}).appendTo(helpArea);
	}
    $("#JREditDialog").dialog("open");
}
function releaseButton(thisDialog) {
    if ($(thisDialog).data("button")) { toggleButton($(thisDialog).data("button"),null,null); $(thisDialog).data("button",null); }
}
function createADialog(idName,theTitle,theHeight,theWidth,isModal,saveFunction,theNumber) {
    createContainer().attr("id",idName)
        .data({"button":null,"theNumber":theNumber,"NOCloseDialog":false})
        .appendTo("body")
        .dialog({
            dialogClass: "no-close", autoOpen: false, title: theTitle, height: theHeight, width: theWidth, modal: isModal,
            buttons: {
                "Yes": function() {
                    if ($(this).data("yesFunction")) ($(this).data("yesFunction"))($(this).data("theNumber"));
                },
                "No": function() { if ($(this).data("closeme")) ($(this).data("closeme"))(); releaseButton($(this)); $(this).dialog( "close"); },
                "Create Grouping": function() { createGroup(); },
                "Save": function() {
                    var NOCloseDialog = $(this).data("NOCloseDialog"), saveReturn = true;
                    if (saveFunction) saveReturn = saveFunction();
                    if ($(this).data("closeme")) ($(this).data("closeme"))();
                    if (saveReturn && !NOCloseDialog) { releaseButton($(this)); $(this).dialog( "close"); }
                },
                "Cancel": function() {
                    var NOCloseDialog = $(this).data("NOCloseDialog");
                    if ($(this).data("closeme")) ($(this).data("closeme"))();
                    if (!NOCloseDialog) { releaseButton($(this)); $(this).dialog("close"); }
                }
            }
        });
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('Save')").hide();
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('Create Group')").hide();
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('Yes')").hide();
    $("div[aria-describedby='" + idName + "'] .ui-dialog-buttonpane button:contains('No')").hide();
}
function createWaitDialog() {
    createADialog("JRWaitDialog","Please Wait",250,310,true);
    $("div[aria-describedby='JRWaitDialog'] .ui-dialog-buttonpane button:contains('Cancel')").hide();
}
function createEditDialog() {
    createADialog("JREditDialog","Job Details",600,500,true,saveEditedData);
	createDiv().attr("id","JRSavedMturkArea").appendTo($("#JREditDialog")).hide();
	createDiv().attr("id","JRSavedJobsArea").appendTo($("#JREditDialog")).hide();
}
function createPromptDialog() {
    createADialog("JRPromptDialog","Enter your answer:",600,500,true,null,"");
    $("div[aria-describedby='JRPromptDialog'] .ui-dialog-buttonpane button:contains('Yes')").show();
}
function createYesNoDialog() {
    createADialog("JRYesNoDialog","Are you sure?",168,590,true,null,"");
    $("div[aria-describedby='JRYesNoDialog'] .ui-dialog-buttonpane button:contains('Yes')").show();
    $("div[aria-describedby='JRYesNoDialog'] .ui-dialog-buttonpane button:contains('No')").show();
    $("div[aria-describedby='JRYesNoDialog'] .ui-dialog-buttonpane button:contains('Cancel')").hide();
}
function sendCommandMessage(data) { localStorage.setItem("JR_message_" + gScriptName, JSON.stringify(data)); }
function createMessageData(command,url,data,target,idNum) { return {"time":(new Date().getTime()),"command":command,"url":url,"data":data,"theTarget":target,
		"version":gScriptVersion,"idNum":idNum}; }
function sendMessageData(command,theData,target) {
	var messageData = createMessageData(command,theData,target);
	sendCommandMessage(messageData);
}
function sendPongMessage(url,idNum,target) { localStorage.setItem("JR_message_pong_" + ((idNum!==null) ? (idNum+"_") : "") + gScriptName,
		JSON.stringify(createMessageData("run",url,null,target,idNum))); }
function sendPingMessage(url,data,target) { localStorage.setItem("JR_message_send_" + gScriptName, JSON.stringify(createMessageData("ping",url,data,target))); }
function sendTargetMessage(command,url,idNum,data,target) { localStorage.setItem("JR_message_send_" + ((idNum!==null) ? (idNum+"_") : "") + gScriptName,
		JSON.stringify(createMessageData(command,url,data,null,idNum))); }
function addExternalScript(theTarget,url,theData) {
	var externalData = jQuery.extend(true, {}, gDefaultExternalData);
	externalData.url = url; externalData.numId = gNumId++; // "extName":"","extVersion":""
	if (theData) {
		externalData.extName = theData.extName; externalData.extVersion = theData.version;
		if (theData.extName == "QueueHelper") { gQueueHelperVersion = (theData.version) ? theData.version : "0.0"; gQueueHelperFormat2 = checkVersion("0.2.7",theData.version); }
	}
	if (!gExternalData[theTarget]) gExternalData[theTarget] = externalData;
	return externalData.numId;
}
function findExternalScript(theTarget) {
	if (theTarget && gExternalData[theTarget]) return gExternalData[theTarget];
	else return null;
}
function mainListener(e) {
	if (e.newValue && e.key.substring(0,3) == 'JR_' && e.key.substr(e.key.length - gScriptName.length) == gScriptName) {
		var theStorage = JSON.parse(e.newValue), idNum=null, theMessageData = theStorage.data;
		if (e.key == 'JR_message_ping_' + gScriptName) {
			var theTarget = theStorage.theTarget || null;
			if (gMainOptions.debugger==4) console.log("received a ping with target: " + theTarget); // debugger == 4 for messages stats
			if (theTarget) idNum = addExternalScript(theTarget, e.url, theMessageData);
			sendPongMessage(e.url,idNum,theTarget);
		} else if ( e.key.substring(0,16) == 'JR_message_pong_' && theStorage.theTarget !== null) {
			if (gExternalData[theStorage.theTarget]) { gExternalData[theStorage.theTarget].gotPong = true; }
		} else if (e.key == 'JR_message_pong_' + gScriptName) {
		} else if ( e.key.substring(0,11) == 'JR_message_' ) {
			var theMessageCommand = theStorage.command;
			var externalData = findExternalScript(theStorage.theTarget);
			var onlyOnce = false;
			switch(theMessageCommand) {
				case 'startcollect' : // Message to tell panda crazy to start collecting a hit by number ID.
					break;
				case 'stopcollect' : // Message to tell panda crazy to stop collecting a hit by number ID.
					break;
				case 'unpause' : // Message to tell panda crazy to unpause if it's paused.
					break;
				case 'acceptedhit' : // Message to tell panda crazy that a hit was accepted outside of script. So add to queue watch.
					var thisHitInfo = makeCollection("","",-2998,theMessageData.jobData,false,null,-1);
					addToQueueWatch(theMessageData.jobData);
					gSendQueue = true;
					break;
				case 'returned' :
				case 'submitted' : // Message to tell panda crazy that a hit was submitted or returned. Just to keep queue up to date without checking queue all the time.
					removeFromQueueWatch(theMessageData.hitId);
					break;
				case 'externalrun' : // Message to tell panda crazy that an external script wants to be added to the main queue.
					// May provide a way to tell external scripts to run at a certain time according to the main cycle timer so it lowers pre's.
					break;
				case 'externalstop' : // Message to tell panda crazy that an external script wants to be removed from the main queue.
					break;
				case 'externalpong' : // Message to tell panda crazy that an external script is still running so don't remove from queue.
					break;
				case 'getQueueData' : // Message to tell panda crazy to send message giving all the hits in queue. May be used for queue sorting for external scripts.
					if (gExternalData[theStorage.theTarget]) {
						var extData = gExternalData[theStorage.theTarget];
						sendTargetMessage("theQueueData",extData.url,extData.numId,{"queue":gQueueData,"queueChanged":true,"PE":gMainData.projectedEarnings},theStorage.theTarget);
					}
					break;
				case 'queueData' : // Message to give panda crazy all the hits and number of hits in queue. Only uses the number of hits at this time.
					if (theMessageData.queueLength) gMainData.hitsInQueue = theMessageData.queueLength;
					displayMainStatus();
					break;
				case 'projectedEarnings' :
					if (theMessageData.projectedEarnings) {
						gMainData.projectedEarnings = parseFloat(theMessageData.projectedEarnings);
						gMainData.payCounter = payQueueCount();
						gMainData.totalEarnings = gMainData.projectedEarnings + gMainData.payCounter;
						$("#JRPayArea").stop(true,true).css({"color":"red"}).animate({"color": "#191970"}, 30000);
						displayMainStatus();
					}
					break;
				case 'addOnlyJob' :
					addAJob(null,theMessageData,false,false,false,false);
					break;
				case 'addOnceJob' :
					addAJob(null,theMessageData,true,true,false,false);
					break;
				case 'addSearchJob' :
					addAJob(null,theMessageData,false,true,false,true);
					break;
				case 'addJob' :
					addAJob(null,theMessageData,false,true,false,false);
					break;
			}
		}
		theStorage = null;
	}
}
function startMessageListener() { window.addEventListener("storage", mainListener, false); }
function shortGroupID( groupId ) { if (groupId) return groupId.slice(0,2) + ".." + groupId.slice(-4); else return ""; }
function updateHitCell(theNumber) {
    var hitInfo = gMainData.hitCollection[theNumber], hitData = hitInfo.data, hitCell = $("#JRCellNum_" + theNumber).eq(0);
	var theErrorStatus = (hitInfo.status.blocked > 0) ? "BLOCKED - " : (hitInfo.status.notQual > 0) ? "UNQUALIFIED - " : "";
	var thisRequesterName = (hitData.friendlyRName !== "") ? hitData.friendlyRName : ((hitData.requesterName !== "") ? hitData.requesterName :
			((hitData.groupId!=="") ? hitData.groupId : ":Unknown Name:"));
    $(hitCell).find(".myTitle").html(thisRequesterName).attr({"title":theErrorStatus + thisRequesterName + "\n" + hitData.groupId});
    $(hitCell).find(".myfloater").html("[" + ((hitData.groupId!=="") ? shortGroupID(hitData.groupId) : "Unknown") + "]");
	if (hitData.weight>0) $(hitCell).find(".weightStatus").html("W" + hitData.weight);
	else $(hitCell).find(".weightStatus").html("");
    if (gMainData.displayInfo===0) {
        $(hitCell).find(".myExtra").html(""); $(hitCell).find(".myDescription").html(""); $(hitCell).css({"width":"180px","height":"50px","min-height":"50px"});
    } else if (gMainData.displayInfo==1) {
		var htmlTitle = (hitData.friendlyTitle !== "") ? hitData.friendlyTitle : ((hitData.title!=="") ? hitData.title : hitData.groupId);
        $(hitCell).find(".myExtra").html(hitData.pay + ( (hitData.qual==="") ? "" : " (" + hitData.qual + ") " ) + ( (hitInfo.numberHits=="0") ? "" : " [" + hitInfo.numberHits + "] " ));
        $(hitCell).find(".myDescription").html(htmlTitle); $(hitCell).css({"width":"200px","height":"78px","min-height":"78px"});
    }
}
function updateHitColors(theNumber,thisButton) {
    if (theNumber) {
        var hitInfo = gMainData.hitCollection[theNumber], hitData = hitInfo.data, thisCell = document.getElementById("JRCellNum_" + theNumber);
        var collectButtonStatus = $(thisCell).find(".JRCollectButton").data("status");
        $("#JRCellNum_" + theNumber).data("status",collectButtonStatus);
        var gohamButtonStatus = $("#JRCellNum_" + theNumber).find(".JRHamButton").data("status");
        var gohamButtonDisabled = $("#JRCellNum_" + theNumber).find(".JRHamButton").data("disabled");
        var hitCellMute = $("#JRCellNum_" + theNumber).data("mute"), hitCellTypeAction = hitData.action.toLowerCase();
		var hitColor = (hitInfo.status.blocked > 0) ? gBlockedColor : gHitTextColor, shortColor = (hitInfo.status.blocked > 0) ? gBlockedColor : gHitShortIdColor;
        var hitBgColor = (hitInfo.status.reachedLimit) ? "#FFA691" : (hitCellTypeAction.substring(0,6)=="search") ? gSearchesHitBgColor : (hitCellTypeAction=="filterpanda") ?
			gFilteredHitBgColor : (hitInfo.status.notQual > 0) ? gNotQualedBgColor : (hitInfo.status.blocked > 0) ? gBlockedBgColor : gHitBgColor;
        var titleColor = (hitCellMute) ? gHitMutedColor : (hitInfo.status.blocked > 0) ? gBlockedColor : gTitleColor;
        var borderStyle = (hitCellMute) ? gHitMutedBorderStyle : gHitBorderStyle;
        var collectBgColor = (collectButtonStatus=="off") ? gButtonOffBgColor : gButtonOnBgColor;
        var collectColor = (collectButtonStatus=="off") ? gButtonOffColor : gButtonOnColor;
        var gohamBgColor = (gohamButtonDisabled) ? gButtonDisabledBgColor : (gohamButtonStatus=="off") ? gButtonOffBgColor : (gohamButtonStatus=="paused") ? gButtonDelayHamBgColor : gButtonOnBgColor;
        var goHamColor = (gohamButtonDisabled) ? gButtonDisabledColor : (gohamButtonStatus=="off") ? gButtonOffColor : gButtonOnColor;
        $(thisCell).css({"background-color":hitBgColor,"border-style":borderStyle,"color":hitColor}).data("backgroundColor",hitBgColor);
        $(thisCell).find(".myTitle").css({"color":titleColor});
        $(thisCell).find(".JRCollectButton").css({"background-color":collectBgColor,"color":collectColor});
        $(thisCell).find(".JRHamButton").css({"background-color":gohamBgColor,"color":goHamColor});
        $(thisCell).find(".myfloater").css({"background-color":hitBgColor,"color":shortColor});
    } else {
        var buttonStatus = $(thisButton).data("status"), buttonBgColor = (buttonStatus=="off") ? gButtonOffBgColor : gButtonOnBgColor;
        var buttonColor = (buttonStatus=="off") ? gButtonOffColor : gButtonOnColor;
        $(thisButton).css({"background-color":buttonBgColor});
        $(thisButton).css({"color":buttonColor});
    }
}
function saveGroupIdSearching(thisHitInfo,saveSearchGroupId) {
	var theHitCell = thisHitInfo.hitCell, borderColor = (saveSearchGroupId) ? "#e91640" : theHitCell.data("borderColor");
	theHitCell.css({"border-color":borderColor});
	theHitCell.data("saveSearchGroupId",saveSearchGroupId);
}
function cloneHitCell(templateHitCell,hitData,cellNumber) {
	var newContainer = templateHitCell.clone(true), hitInfo = gMainData.hitCollection[cellNumber], hitCellTypeAction = hitData.action.toLowerCase();
    var titleColor = (hitData.mute) ? gHitMutedColor : gTitleColor;
    var backgroundColor = (hitCellTypeAction.substring(0,6)=="search") ? gSearchesHitBgColor : (hitCellTypeAction=="filterpanda") ? gFilteredHitBgColor : gHitBgColor;
	var thisRequesterName = (hitData.friendlyRName !== "") ? hitData.friendlyRName : ((hitData.requesterName !== "") ? hitData.requesterName :
		((hitData.groupId!=="") ? hitData.groupId : ":Unknown Name:"));
	var htmlDescription = (gMainData.displayInfo==1) ? (hitData.pay + ( (hitData.qual==="") ? "" : " (" + hitData.qual + ") " )) : "";
    var htmlTitle = (hitData.friendlyTitle !== "") ? hitData.friendlyTitle : ((hitData.title!=="") ? hitData.title : hitData.groupId);
    var borderStyle = (hitData.mute) ? "dotted" : "solid";
	newContainer.find(".myfloater:first").html("[" + ((hitData.groupId!=="") ? shortGroupID(hitData.groupId) : "Unknown") + "]")
		.css({"background-color":backgroundColor}).data({"theNumber":cellNumber});
	newContainer.find(".myTitle:first").html(thisRequesterName).attr({"title":thisRequesterName + "\n" + hitData.groupId}).css({"color":titleColor});
	newContainer.find(".myExtra:first").html(htmlDescription);
	newContainer.find(".myDescription:first").html(htmlTitle).attr({"title":(hitData.friendlyTitle==="") ? htmlTitle : hitData.friendlyTitle + "\n" + hitData.title});
	newContainer.find(".myStatus:first").attr({"id":"JRCellStatus_" + cellNumber}); displayHitStatus(newContainer.find(".myStatus:first"),cellNumber);
	newContainer.find(".JRCollectButton:first").data({"theNumber":cellNumber,"hitCell":newContainer,"hitInfo":hitInfo}).attr({"id":"JRCollectB_" + cellNumber})
		.click( function(e) { checkDelayedSave(); var theNumber = $(e.target).data("theNumber"), hitInfo = gMainData.hitCollection[theNumber];
            if (hitInfo.collecting!="off" && hitInfo.ham != "off") toggleButtonOff($("#JRHamB_" + theNumber),hamOn,hamOff,"off");
            toggleButton( $(e.target),startCollecting,stopCollecting);
			if (hitInfo.collecting=="on" && hitInfo.data.stickyDelayedHam) {
				toggleButton($("#JRHamB_" + cellNumber),hamOn,hamOff,"paused","off");
			}
			e.stopPropagation();
        });
	newContainer.find(".JRHamButton").data({"theNumber":cellNumber,"hitCell":newContainer,"hitInfo":hitInfo}).attr({"id":"JRHamB_" + cellNumber})
		.click( function(e) { checkDelayedSave();
            if ( !$(e.target).data("disabled") && !gPressAndHold ) { var theNumber = $(e.target).data("theNumber"), hitInfo = gMainData.hitCollection[theNumber];
                if (hitInfo.collecting == "off") toggleButton($("#JRCollectB_" + theNumber),startCollecting,stopCollecting,"on");
				if (hitInfo.ham == "paused") hitInfo.ham="off";
                if (hitInfo.ham == "ontimed") toggleButton($(e.target),hamOn,hamOff,"off");
				else toggleButton($(e.target),hamOn,hamOff);
                gPressAndHold=false; e.stopPropagation();
            } else if (gPressAndHold) gPressAndHold=false;
        });
	newContainer.find(".JRDetailsButton").data({"theNumber":cellNumber,"hitCell":newContainer,"hitInfo":hitInfo}).attr({"id":"JRDetailsB_" + cellNumber})
		.click( function(e) { checkDelayedSave(); showEditHitDialog($(e.target).data("theNumber"),$(e.target)); e.stopPropagation(); });
	newContainer.find(".JRDeleteButton").data({"theNumber":cellNumber,"hitCell":newContainer,"hitInfo":hitInfo}).attr({"id":"JRDelB_" + cellNumber})
		.click( function(e) { checkDelayedSave(); var theNumber = $(e.target).data("theNumber");
			showYesNoDialog("Are you sure you want me to delete this job?",function(thisNumber) { if (removeJob(thisNumber)) $("#JREditDialog").dialog( "close"); },theNumber);
            e.stopPropagation();
        });
	newContainer.find(".weightStatus").html((hitData.weight>0) ? "W"+hitData.weight : "");
	newContainer.data({"backgroundColor":backgroundColor,"hitData":hitData,"hitInfo":hitInfo,"mute":hitData.mute,"theNumber":cellNumber,"typeAction":hitData.action.toLowerCase()})
		.attr({"id":"JRCellNum_" + cellNumber})
		.css({"background-color":backgroundColor,"titleColor":gTitleColor,"border-style":borderStyle});
	newContainer.click( function(e) {
		var theHitCell = $(e.target).closest(".JRHitCell"), theNumber = $(theHitCell).data("theNumber"), hitInfo = gMainData.hitCollection[theNumber];
		if (gScriptStatus == "normal") {
			if ($(e.target).is(".JRButton")) { e.stopPropagation(); return; }
			if ($(e.target).hasClass('noclick')) $(e.target).removeClass('noclick');
			else if ( theHitCell.data("typeAction").substring(0,6) == "search" ) saveGroupIdSearching(hitInfo,!theHitCell.data("saveSearchGroupId"));
		} else if (gScriptStatus == "creating groupings") {
			if (theHitCell.data("selected")!==0) { theHitCell.css({"background-color":"#00FFEE"}); theHitCell.data("selected",0); }
			else { theHitCell.css({"background-color":"#ADFF2F"}); theHitCell.data("selected",1); }
		}
	});
	return newContainer;
}
function createHitCell() {
    var theContainer = createContainer(),theCellWidth="200px",theCellHeight="78px";
    var floaterRight = createDiv().attr({"class":"myfloater hasHelptip keepHelptip","title":"Click here to copy panda link. Double Click to open panda link."})
        .click(function(e) { var theNumber = $(e.target).data("theNumber"); var hitInfo=gMainData.hitCollection[theNumber];
			GM_setClipboard((gNewSite) ? hitInfo.pandaNewUrl: hitInfo.pandaUrl); e.stopPropagation(); })
		.dblclick(function(e) { var theHeight=window.outerHeight-80, theWidth=window.outerWidth-10, theNumber = $(e.target).data("theNumber");
			var hitInfo=gMainData.hitCollection[theNumber];
			window.open((gNewSite) ? hitInfo.pandaNewUrl: hitInfo.pandaUrl,"_blank","width=" + theWidth + ",height=" +  theHeight +
			",scrollbars=yes,toolbar=yes,menubar=yes,location=yes"); })
        .css({"float":"right","margin-right":"-3px","padding":"0 1px 0 3px","font-weight":"900","background-color":gHitBgColor,
            "color":gHitShortIdColor,"font-size":"7px","z-index":"999","position":"relative","cursor":"pointer"}).html("").appendTo(theContainer);
    var theInfoArea = createDiv();
    var tempMyTitle = createDiv().html("").css({"font-weight":"900","color":gTitleColor,"font-size":"13px"})
        .attr({"class":"myTitle hasTooltip","title":""}).appendTo(theContainer);
    createDiv().html("").attr({"class":"myExtra"}).css({"font-size":"11px"}).appendTo(theContainer);
    var tempMyDescription = createDiv().html("").css({"font-size":"10px"}).attr({"class":"myDescription hasTooltip","title":""}).appendTo(theContainer);
    var theStatusArea = createDiv().html("&nbsp;").append(createSpan("").attr({"class":"myStatus","id":"JRCellStatus_" + 0})
        .css({"font-weight":"300","font-size":".8em"})).appendTo(theContainer);
	var theButtonArea = createSpan("").css({"margin-top":"2px","padding":"2px","line-height":"1.2em","display":"block"}).attr({"class":"myButtonArea"}).appendTo(theStatusArea);
    var tempCollectButton = $(createSpanButton( null,"JRCollectButton JRButton JRMButton hasHelptip","Collect",gButtonOffBgColor,gButtonOffColor,"12px"))
        .bind("mousedown", function(e) { $(e.target).closest(".tabContents").sortable("disable"); })
        .bind("mouseup mouseleave", function(e) { $(e.target).closest(".tabContents").sortable("enable"); })
        .attr({"id":"JRCollectB_" + 0,"title":"Start collecting this panda hit."})
        .data({"theNumber":0,"hitCell":theContainer,"status":"off","disabled":false}).appendTo(theButtonArea);
    var tempGoHamButton = $(createSpanButton( null,"JRHamButton JRButton JRMButton hasHelptip","GoHam",gButtonOffBgColor,gButtonOffColor,"12px"))
        .bind("mousedown", function(e) { var thisButton = $(e.target); $(e.target).closest(".tabContents").sortable("disable");
            gMouseDownTimeoutId = setTimeout( function() {
				var theNumber = $(thisButton).data("theNumber"), hitInfo = gMainData.hitCollection[theNumber]; gPressAndHold=true;
                if (hitInfo.collecting == "off") toggleButton($("#JRCollectB_" + theNumber),startCollecting,stopCollecting);
                if (hitInfo.ham=="off" || hitInfo.ham=="ontimed" || hitInfo.ham=="on") toggleButton($(thisButton),hamOn,hamOff,"paused","off");
				else toggleButton($(thisButton),hamOn,hamOff,"off","off");
            }, 500);
            e.stopPropagation();
        })
        .bind("mouseup mouseleave", function(e) { clearTimeout(gMouseDownTimeoutId); if (window.jQuery) { $(e.target).closest(".tabContents").sortable("enable"); } e.stopPropagation(); })
        .attr({"id":"JRHamB_" + 0,"title":"Try to collect pandas from this hit ONLY! Click and hold for a second to put in delayed Ham Mode which will only go into Ham mode after a panda is found."})
        .data({"theNumber":0,"hitCell":theContainer,"status":"off","disabled":false}).appendTo(theButtonArea);
    $(createSpanButton( null,"JRDetailsButton JRButton JRMButton hasHelptip","details",gButtonOffBgColor,gButtonOffColor,"9px"))
        .bind("mousedown", function(e) { $(e.target).closest(".tabContents").sortable("disable");})
        .bind("mouseup mouseleave", function(e) { $(e.target).closest(".tabContents").sortable("enable");})
        .attr({"id":"JRDetailsB_" + 0,"title":"Display all details and options for this hit. You can also edit any detail or option."})
        .data({"theNumber":0,"hitCell":theContainer,"status":"off","disabled":false}).appendTo(theButtonArea);
    $(createSpanButton( null,"JRDeleteButton JRButton JRMButton hasHelptip","X",gButtonOffBgColor,gButtonOffColor,"9px"))
        .bind("mousedown", function(e) { $(e.target).closest(".tabContents").sortable("disable");})
        .bind("mouseup mouseleave", function(e) { $(e.target).closest(".tabContents").sortable("enable");})
        .attr({"id":"JRDelB_" + 0,"class":"JRDeleteButton JRButton JRMButton hasHelptip","title":"Delete this job now."})
        .data({"theNumber":0,"hitCell":theContainer,"status":"off","disabled":false}).appendTo(theButtonArea);
	createSpan("").css({"margin-left":"2px","font-size":"8px"}).attr({"class":"weightStatus"}).appendTo(theButtonArea);
    theContainer.width(theCellWidth)
        .attr({"id":"JRCellNum_" + 0,"class":"JRHitCell"})
        .data({"backgroundColor":gHitBgColor,"borderColor":"MidnightBlue","titleColor":gTitleColor,"theNumber":0,"status":"off","color":gHitTextColor,"removeMe":false,
			"pandaHam":"off","mute":false,"saveSearchGroupId":false,"typeAction":"panda","oldPosition":null,"selected":0})
        .css({"border-color":"MidnightBlue", "border-width":"3px", "border-style":"solid", "margin":"2px 4px", "color":gHitTextColor,
			"height":theCellHeight,"min-height":theCellHeight,"background-color":gHitBgColor, "font-size":"11px", "cursor":"move",
			"overflow":"hidden", "float":"left", "white-space":"nowrap"})
        .bind("contextmenu", function(e) {
			var theHitCell = $(e.target).closest(".JRHitCell");
			e.preventDefault();
            if (gScriptStatus == "normal") { if ($(e.target).is(".JRButton")) return; muteJob(theHitCell.data("theNumber")); }
			else if (gScriptStatus == "creating groupings") {
                if (theHitCell.data("selected")==2) { theHitCell.css({"background-color":"#ADFF2F"}); theHitCell.data("selected",1); }
				else { theHitCell.css({"background-color":"#33CC66"}); theHitCell.data("selected",2); } }
        })
        .bind("mouseup mouseleave", function(e) { if (window.jQuery) { if ($(e.target).is(".JRButton")) { e.stopPropagation(); return; } } });
    return theContainer;
}
function addHitData(newHitData,tabIndex) {
    var inTabId = "#" + $("#JRTab_" + newHitData.tabNumber).attr("aria-controls");
    gRequestersData[gRequestersData[0].requesterId] = newHitData;
    $(inTabId).data("tabData").positions.push(gRequestersData[0].requesterId);
    var theNumber = addHitCollection(newHitData,gRequestersData[0].requesterId,tabIndex);
    gRequestersData[0].requesterId++;
	var newHitCell = cloneHitCell(gTemplateHitCell,newHitData,theNumber);
	$(inTabId).find(".tabContents").append(newHitCell);
	displayHitStatus(null,theNumber);
	tooltipCreateFix($($(inTabId).find(".JRStatusText")),680);
	tooltipCreateFix($("#JRMainTabs").find(".hasHelptip,.hasTooltip"),1000);
	gMainData.hitCollection[theNumber].hitCell = newHitCell;
    saveSettings();
    return newHitCell;
}
function addToMenu(theMenuArray,theName,theMenuObject) {
    if (theName=="Main") theMenuArray[0].theobject = theMenuObject;
    else { theMenuArray.push({"name":theName,"theobject":theMenuObject}); $(theMenuObject).hide(); }
}
function activeMenu(theMenuArray,theName) {
    for (var i=0,len=theMenuArray.length; i<len; i++) {
        if (theMenuArray[i].name == theName) $(theMenuArray[i].theobject).show();
        else $(theMenuArray[i].theobject).hide();
    }
    displayMainStatus();
}
function isActiveMenu(theMenuArray,theName) {
    for (var i=0,len=theMenuArray.length; i<len; i++) { if (theMenuArray[i].name == theName && $(theMenuArray[i].theobject).is(":visible")) return true; }
    return false;
}
function addToLog(addNode,logNode,limit,resetLog,sort) {
	limit = limit || 100; resetLog = resetLog || false; sort = sort || false;
	if (resetLog) { logNode.html(""); return; }
	if (limit) { var logLength = logNode.find(".logDiv").length; if (logLength > limit) logNode.find(".logDiv:last").remove(); }
	var firstLogDiv = logNode.find(".logDiv:first");
	if (firstLogDiv.length) firstLogDiv.before(createDiv().css({"margin-left":"18px","text-indent":"-15px"}).attr("class","logDiv").append(addNode));
	else logNode.append(createDiv().css({"margin-left":"18px","text-indent":"-15px"}).attr("class","logDiv").append(addNode));
	$(".logDiv span").click( function() { return false; } );
	return true;
}
function addToAcceptedLog(theText) { addToLog(createSpan(theText.trim()),$("#JRAcceptedLog")); }
function addToStatusLog(theNumber) {
	var hitInfo = gMainData.hitCollection[theNumber];
	var hitData = hitInfo.data, hitStatus = hitInfo.status;
	if ( !($("#JRStatusLog .statusNumber" + theNumber).length) ) $("#JRStatusLog").append(createDiv("").attr("class","statusNumber" + theNumber).css({"color":"white"})
		.append(createSpan("&nbsp;Requester: ").css({"color":"cyan"})).append(createSpan("").attr("class","sRequesterName"))
		.append(createSpan(" | Pay: ").css({"color":"cyan"})).append(createSpan("").attr("class","sPay"))
		.append(createSpan(" | Mode: ").css({"color":"cyan"})).append(createSpan("").attr("class","sMode"))
		.append(createSpan(" | Accepted: ").css({"color":"cyan"})).append(createSpan("").attr("class","sAccepted"))
		.append(createSpan(" | Missed: ").css({"color":"cyan"})).append(createSpan("").attr("class","sMissed"))
		.append(createSpan(" | Checked: ").css({"color":"cyan"})).append(createSpan("").attr("class","sChecked"))
		.append(createSpan(" | Elapsed: ").css({"color":"cyan"})).append(createSpan("").attr("class","sElapsed")));
	$("#JRStatusLog .statusNumber" + theNumber + " .sRequesterName").html(((hitData.friendlyRName!=="") ? hitData.friendlyRName : (hitData.requesterName!=="") ? hitData.requesterName : shortGroupID(hitData.groupId)));
	$("#JRStatusLog .statusNumber" + theNumber + " .sPay").html(hitData.pay);
	$("#JRStatusLog .statusNumber" + theNumber + " .sMode").html(hitData.action);
	$("#JRStatusLog .statusNumber" + theNumber + " .sAccepted").html(hitStatus.accepted);
	$("#JRStatusLog .statusNumber" + theNumber + " .sMissed").html(hitStatus.missed);
	$("#JRStatusLog .statusNumber" + theNumber + " .sChecked").html(hitStatus.searched);
	$("#JRStatusLog .statusNumber" + theNumber + " .sElapsed").html(hitInfo.elapsedSeconds + "s");
}
function removeFromStatusLog(theNumber) {
	if ( ($("#JRStatusLog .statusNumber" + theNumber).length) ) $("#JRStatusLog .statusNumber" + theNumber)[0].remove();
}
function addToQueueWatch(jobData) {
	var insertIndex=-1, thisTotalSeconds=jobData.totalSeconds;
    $.each(gQueueData, function( index, value ) { if (insertIndex==-1 && value.totalSeconds>thisTotalSeconds) insertIndex=index; });
	if (insertIndex==-1) gQueueData.push(jobData); else gQueueData.splice(insertIndex,0,jobData);
	thisKey = jobData.requesterName + "::" + jobData.title + "::" + jobData.pay;
	gQueueCount[thisKey] = (thisKey in gQueueCount) ? gQueueCount[thisKey]+1 : 1;
	displayQueueStatus(false);
}
function payQueueCount() {
	var payCounting = 0.00;
	for (var i=0,len=gQueueData.length; i<len; i++) { payCounting = (payCounting+parseFloat(gQueueData[i].pay)); }
	return payCounting;
}
function removeFromQueueWatch(theHitID) {
	var deleteThisIndex=null;
	for (var i=0,len=gQueueData.length; i<len; i++) {
		if (gQueueData[i].hitId==theHitID) {
			thisKey = gQueueData[i].requesterName + "::" + gQueueData[i].title + "::" + gQueueData[i].pay;
			if (thisKey in gQueueCount) gQueueCount[thisKey]--;
			if (gQueueCount[thisKey]<1) delete gQueueCount[thisKey];
			deleteThisIndex = i;
			break;
		}
	}
	if (deleteThisIndex!==null) { gQueueData.splice(deleteThisIndex,1); displayQueueStatus(false); }
}
function addToQueueWatchLog(theNode,resetLog,sort) {
	resetLog = resetLog || false; sort = sort || false;
	if (resetLog) {
		addToLog("",$("#JRQueueWatchLog"),26,true);
		var queueUrl=(gNewSite) ? "https://worker.mturk.com/tasks" : "https://www.mturk.com/mturk/myhits?doNotRedirect=true";
		$("#JRQueueWatchLog").append(createDiv().attr("class","muteQueueWatch").css({"float":"right","text-align":"right","height":"60px"}).append(createCheckbox()
			.attr("id","muteQueueWatchAlarm").prop('checked', gMuteQueueWatch)
			.click( function() { gAlarmSounds.queueAlert.audio.pause(); gMuteQueueWatch = $(this).is(":checked"); } ))
			.append(createSpan("Mute Alarm").css({"margin-right":"5px"}))
		.append(createDiv().append(createLink("Open Queue",queueUrl,"_blank","Open queue page").css({"color":"cyan","margin-right":"5px"})
			.click( function() {
                var theHeight=window.outerHeight-80, theWidth=window.outerWidth-10;
				window.open(queueUrl,"_blank","width=" + theWidth + ",height=" +  theHeight + ",scrollbars=yes,toolbar=yes,menubar=yes,location=yes");
				return false;
			}))));
	}
	addToLog(theNode,$("#JRQueueWatchLog"),26,false,sort);
}
function fillInPositions() { // Initialize positions because they are not set.
	for (var key in gRequestersData) {
        if (parseInt(key)>0) {
            var goInTab = null;
			for (var key2 in gTabsData) {
				if (goInTab === null) goInTab = gTabsData[key2];
				if (gTabsData[key2].tabNumber == gRequestersData[key].tabNumber) goInTab = gTabsData[key2];
            }
            if (goInTab) {
                if (goInTab.positions === null) goInTab.positions = [];
                goInTab.positions.push(key);
                gRequestersData[key].tabNumber = goInTab.tabNumber;
            }
        }
    }
}
function fillTabs(mainTabs) {
    var theNumber=0, newHitCell=null, thisTab=null, thisData=null, thisTabControls=null, value=null, tabContents=null, firstTab=true;
	thisTab = $("#" + ($("#JRTab_" + "1").attr("aria-controls")));
	gTemplateHitCell = createHitCell();
	for (var key in gTabsData) {
		value = gTabsData[key];
		if (value.positions) {
			tabContents = createDiv();
			for (var ii=0; ii<value.positions.length; ii++) {
				var thisPositionNumber = value.positions[ii];
				if (thisPositionNumber in gRequestersData) {
					thisData = gRequestersData[thisPositionNumber];
					theNumber = addHitCollection(thisData,thisPositionNumber,key);
					newHitCell = cloneHitCell(gTemplateHitCell,thisData,theNumber);
					tabContents.append(newHitCell);
					gMainData.hitCollection[theNumber].hitCell = newHitCell;
					gMainData.hitCollection[theNumber].data.tabNumber = value.tabNumber;
					gTabsData[key].positions[ii] = "" + value.positions[ii];
				} else {
					gTabsData[key].positions.splice(ii, 1); // this position number is not in the requesters data so delete position number.
					ii--;
				}
			}
			addTab(mainTabs,tabContents,gTabsData[key].tabName,true,"JRTab_" + gTabsData[key].tabNumber,gTabsData[key],!firstTab).css({"overflow":"visible"});
			if (firstTab) firstTab = false;
			tabContents=null;
		} else gTabsData[key].positions = [];
    }
	appendAddTabButton(mainTabs);
	newHitCell=null;
}
function refreshAllCells() {
	for (var key in gMainData.hitCollection) { updateHitCell(key); }
}
function showButtonUsed(thisButton) {
    thisButton.css({"background-color":"#CCC6B0"});
    thisButton.stop().animate({"backgroundColor": gButtonOffBgColor,"color":gButtonOffColor}, 500);
}
function appendAddTabButton(mainTabs) {
	var thisButton = $(createSpanButton(function(e) { checkDelayedSave(); $("#addNewtab").remove();
			var returnName = prompt("Enter Tab Label : ", "Added"); returnName = (returnName!=="") ? returnName : "Added";
			var nextTabNumber = parseInt(gTabsInfo.nextTabNumber), newTabData = jQuery.extend(true, {}, gTabsData[0]);
			newTabData.tabNumber = nextTabNumber; newTabData.tabName = returnName; newTabData.positions = [];
			addTab($("#JRMainTabs"),null,newTabData.tabName,true,"JRTab_" + nextTabNumber,newTabData,true).css({"overflow":"visible"});
			tooltipCreateFix($("#JRTab_" + nextTabNumber).find("a"),1000);
			gTabsInfo.nextTabNumber = nextTabNumber + 1;
			gTabsData.push(newTabData); saveSettings(); appendAddTabButton($("#JRMainTabs"));
		},"JRMButton hasHelptip","+","ivory","black","12px")).attr({"title":"Click to add a new tab. You will have the option to label it to the name you want."})
		.css({"margin":"5px 0 0 4px","padding":"3px"});
	tooltipCreateFix(thisButton,1000);
	$(mainTabs).find(".ui-tabs-nav").append( createDiv(thisButton).attr("id","addNewtab") .css({"padding":"8px 8px 0 0","height":"10px"}));
}
function createMenuButtons(buttonName,theId,appendToControl,tipHelp,doThis,doToggleButton,doActiveMenu) {
	doActiveMenu = doActiveMenu || false;
	var classList = (tipHelp==="") ? "" : "hasHelptip";
	var spanReturn = createSpan().append($(createSpanButton(function(e) { checkDelayedSave();
		if (doActiveMenu) activeMenu(gMainMenu,buttonName);
		if (doThis) {
            if (doToggleButton && !doActiveMenu) toggleButton($(e.target),function(theNumber,thisButton) { doThis(thisButton); },null);
			else doThis($(e.target));
		}
	},classList,buttonName,"ivory","black","12px")).attr({"id":theId,"title":tipHelp})).css({"margin":"10px 0"}).appendTo(appendToControl);
	return spanReturn;
}
function cycleButtonSelect(thisNumber) {
	$(".JRCycleButton span").css({"background-color":gButtonOffBgColor,"color":gButtonOffColor});
	$("#JRCycle" + thisNumber + "Button span").css({"background-color":gButtonOnBgColor,"color":gButtonOnColor});
	theCycler.cycleResetChange((thisNumber=="1") ? gMainOptions.cycleNumber : (thisNumber=="2") ? gMainOptions.cycleNumber2 : gMainOptions.cycleNumber3);
	gMainOptions.savedCycleNum = thisNumber; displayMainStatus();
}
function startPandaCrazy() {
    gMainData.queueStatus = makeStatus();
    var panels = createPanels("body").css({"height":"auto"}), northPanel = createPanel("body"), mainControls = createDiv().appendTo(northPanel);
	var waitingDialog = $("#JRjqModalDialog-waiting");
	setTimeout( function() {
		northPanel.addClass("ui-layout-north");
		mainControls.css({"background-color":"aliceblue","font-size":"10px","color":"midnightblue","padding":"5px 4px",
					   "border-color":"black", "border-width":"2px", "border-style":"groove"});
		createSpan("Vol: ").appendTo(mainControls);
		createSpan().attr("id","JRVolumeControl").css({"display":"inline-block","width":"80px","margin":"3px 8px 0px 2px"})
			.slider({range: "min",min: 0,max: 100,value: gMainOptions.alarmVolume,step: 5,
				stop: function(event, ui) { gMainOptions.alarmVolume = ui.value; playThisSound("less2"); }
			})
			.appendTo(mainControls);
		addToWaitDialog(waitingDialog,"Setting up Menu.",true,"16px");
		var theMenuArea = createSpan().attr("id","menuArea").appendTo(mainControls);
		var mainMenuControls = createSpan().appendTo(theMenuArea).attr("id","JrMainMenuControls").css({"margin":"10px 0"});
		addToMenu(gMainMenu,"Main",mainMenuControls);
		var jobsMenuControls = createSpan().appendTo(theMenuArea).attr("id","JrJobsMenuArea").css({"margin":"10px 0"});
		addToMenu(gMainMenu,"Jobs",jobsMenuControls);
		var displayMenuControls = createSpan().appendTo(theMenuArea).attr("id","JrDisplayMenuArea").css({"margin":"10px 0"});
		addToMenu(gMainMenu,"Display",displayMenuControls);
		var groupingMenuControls = createSpan().appendTo(theMenuArea).attr("id","JrGroupingMenuArea").css({"margin":"10px 0"});
		addToMenu(gMainMenu,"Grouping",groupingMenuControls);
		var cycleMenuControls = createSpan().appendTo(theMenuArea).attr("id","JrCycleMenuArea").css({"margin":"10px 0"});
		addToMenu(gMainMenu,"Cycler",cycleMenuControls);
		var optionsMenuControls = createSpan().appendTo(theMenuArea).attr("id","JrOptionsMenuArea").css({"margin":"10px 0"});
		addToMenu(gMainMenu,"Options",optionsMenuControls);
		var helpMenuControls = createSpan().appendTo(theMenuArea).attr("id","JrHelpMenuArea").css({"margin":"10px 0"});
		addToMenu(gMainMenu,"Help",helpMenuControls);
		setTimeout( function() {
			addToWaitDialog(waitingDialog,"Setting up sub Menus.",true,"16px");
			activeMenu(gMainMenu,"Main");
			createSpan(" | ").appendTo(mainMenuControls);
			createMenuButtons("Jobs","bMainJobs",mainMenuControls,"Add, Export, Import jobs and options.",null,false,true);
			createMenuButtons("Main","bJobsMain",jobsMenuControls,"Back to main menu.",null,false,true);
			createSpan(" -Jobs- ").appendTo(jobsMenuControls);
			createMenuButtons("List","bJobsList",jobsMenuControls,"List all jobs.",function(thisButton) { showSearchingDialog(thisButton,"jobs","all",true); },true);
			createMenuButtons("Add","bJobsAdd",jobsMenuControls,"Add Panda's to the script.",function(thisButton) { showAddJobsDialog(thisButton); },true);
			createMenuButtons("Save","bJobsSave",jobsMenuControls,"Save all jobs, tabs, options and groupings.",function(thisButton) {
				toggleButton(thisButton,function(theNumber,thisButton) { showWaitDialog("Saving Database....","",function() {},thisButton);
					setTimeout( function() { saveSettings();
						appendToWaitDialog(createDiv("Database Saved.<br>You may close this dialog.").css({"font-size":"18px","margin-top":"30px","text-align":"center"}));
					}, 500);
				},null);
			},false);
			createMenuButtons("Export","bJobsExport",jobsMenuControls,"Export options, jobs and groupings.",function(thisButton) { showExportImportDialog("Export",thisButton); },true);
			createMenuButtons("Import","bJobsImport",jobsMenuControls,"Import options, jobs and groupings.",function(thisButton) { showExportImportDialog("Import",thisButton); },true);
			createMenuButtons("Display","bMainDisplay",mainMenuControls,"Change how big the job cells are displayed in the tabs.",null,false,true);
			createMenuButtons("Main","bDisplayMain",displayMenuControls,"Back to main menu.",null,false,true);
			createSpan(" -Display- ").appendTo(displayMenuControls);
			createMenuButtons("Minimum Info","bDisplayMin",displayMenuControls,"Show requester name, groupid #, stats and buttons.",function(thisButton) {
				showButtonUsed(thisButton); gMainData.displayInfo=0; refreshAllCells(); },false);
			createMenuButtons("Extended Info","bDisplayExt",displayMenuControls,"Show requester name, groupid #, pay, description, stats and buttons.",function(thisButton) {
				showButtonUsed(thisButton); gMainData.displayInfo=1; refreshAllCells(); },false);
			createMenuButtons("Grouping","bMainGrouping",mainMenuControls,"Turn on jobs by grouping them together.",null,false,true);
			createMenuButtons("Main","bGroupingMain",groupingMenuControls,"Back to main menu.",null,false,true);
			createSpan(" -Grouping- ").appendTo(groupingMenuControls);
			createMenuButtons("Start/Stop","bGroupingStart",groupingMenuControls,"Start or stop groupings.",function(thisButton) { showGroupingDialog("collect",thisButton); },true);
			createMenuButtons("Create By Selection","bGroupingSelection",groupingMenuControls,"Create a grouping by selecting the jobs you want in it.",function(thisButton) {
				showGroupingCreateDialog(thisButton,[],[],"selection"); },true);
			createMenuButtons("Create Instantly","bGroupingInstant",groupingMenuControls,"Create a fast grouping of all jobs collecting now.",function(thisButton) {
				showGroupingCreateDialog(thisButton,[],[],"collecting"); },true);
			createMenuButtons("View all","bGroupingViewAll",groupingMenuControls,"View all the groupings created and start or stop them.",function(thisButton) {
				showGroupingDialog("view",thisButton); },true);
			createMenuButtons("Cycler","",mainMenuControls,"Change the cycler timer by resetting, increasing or descreasing it.",function() {
				$("#JRCycleInfoArea").stop(true,true).css({"color":"red"}); },false,true);
			createMenuButtons("Main","",cycleMenuControls,"Back to main menu.",function() { $("#JRCycleInfoArea").animate({"color": "#191970"}, 30000); },false,true);
			createSpan(" -Cycler- ").appendTo(cycleMenuControls);
			createMenuButtons("Reset","",cycleMenuControls,"Reset timer back to normal.",function(thisButton) {
				showButtonUsed(thisButton); theCycler.skippingReset(); displayMainStatus(); },true);
			createMenuButtons("1","",cycleMenuControls,"Use 1st cycle timer.",function(thisButton) { cycleButtonSelect("1"); },false).attr({"id":"JRCycle1Button","class":"JRCycleButton"});
			createMenuButtons("2","",cycleMenuControls,"Use 2nd cycle timer. (for running with other scripts)",function(thisButton) {
				cycleButtonSelect("2"); },false).attr({"id":"JRCycle2Button","class":"JRCycleButton"});
			createMenuButtons("3","",cycleMenuControls,"use 3rd cycle timer. (for running with other scripts)",function(thisButton) {
				cycleButtonSelect("3"); },false).attr({"id":"JRCycle3Button","class":"JRCycleButton"});
			createMenuButtons("Increase","",cycleMenuControls,"Add time to timer for less request errors.",function(thisButton) {
				showButtonUsed(thisButton); theCycler.cycleIncrease(); displayMainStatus(); },true);
			createMenuButtons("Decrease","",cycleMenuControls,"Decrease time to timer when finished working from queue.",function(thisButton) {
				showButtonUsed(thisButton); theCycler.cycleDecrease(); displayMainStatus(); },true);
			createMenuButtons("Add " + gMainOptions.cycleAdding,"",cycleMenuControls,"Add a large amount of time to timer so it's easier to work from queue.",function(thisButton) {
				showButtonUsed(thisButton); theCycler.cycleAdd(gMainOptions.cycleAdding); displayMainStatus(); },true);
			createMenuButtons("Edit Cycle Timers","",cycleMenuControls,"Change the timers used to grab jobs.",function(thisButton) { showEditTimersDialog("Timers",thisButton); },true);
			createMenuButtons("Help","",cycleMenuControls,"Find out what cyclers are and how to use them efficiently.",function(thisButton) {
				showHelpDialog("cycler","What is a cycler and how do I use it?",thisButton); },true);
			createMenuButtons("1","",mainMenuControls,"Use 1st cycle timer: " + gMainOptions.cycleNumber + "ms",function(thisButton) {
				cycleButtonSelect("1"); },false).attr({"id":"JRCycle1Button","class":"JRCycleButton"});
			createMenuButtons("2","",mainMenuControls,"Use 2nd cycle timer: " + gMainOptions.cycleNumber2 + "ms\n(for running with other scripts)",function(thisButton) {
				cycleButtonSelect("2"); },false).attr({"id":"JRCycle2Button","class":"JRCycleButton"});
			createMenuButtons("3","",mainMenuControls,"use 3rd cycle timer: " + gMainOptions.cycleNumber3 + "ms\n(for running with other scripts)",function(thisButton) {
				cycleButtonSelect("3"); },false).attr({"id":"JRCycle3Button","class":"JRCycleButton"});
			createMenuButtons("Options","",mainMenuControls,"Change timers, alarms and other options.",null,false,true);
			createMenuButtons("Main","",optionsMenuControls,"Back to main menu.",null,false,true);
			createSpan(" -Options- ").appendTo(optionsMenuControls);
			createMenuButtons("Timers","",optionsMenuControls,"Change cycler, queue and other timers to make it faster or slower.",function(thisButton) {
				showEditTimersDialog("Timers",thisButton); },true);
			createMenuButtons("Alarms","",optionsMenuControls,"Change the alarm alerts to any sound file and times to alert.",function(thisButton) {
				showAlarmsDialog("Alarms",thisButton); },true);
			createMenuButtons("General","",optionsMenuControls,"Change some general options for the script to work.",function(thisButton) {
				showEditOptionsDialog("Options",thisButton); },true);
			createMenuButtons("Stop Auto Slowdown","bStopSlowdown",optionsMenuControls,"Stop script from slowing down automatically. (Beware this may cause many requester errors)",function(thisButton) {
				toggleButton(thisButton, function() { gSlowDownAuto=false; }, function() { gSlowDownAuto=true; } ); gMainOptions.stopAutoSlow = !gSlowDownAuto;
				if (thisButton.data("status") == "on") thisButton.css({"background-color":"red"}); saveSettings();
			},false);
			createMenuButtons("Help","",mainMenuControls,"Find help and tips for the script to be used efficiently.",null,false,true);
			createMenuButtons("Main","",helpMenuControls,"Back to main menu.",null,false,true);
			createSpan(" -Help- ").appendTo(helpMenuControls);
			createMenuButtons("About Script","",helpMenuControls,"Find out more about the script that you never thought you needed.",function(thisButton) {
				showHelpDialog("about","About this script and how to use it efficiently.",thisButton); },true);
			createMenuButtons("Cycler","",helpMenuControls,"Find out what a cycler is and how to use them efficiently.",function(thisButton) {
				showHelpDialog("cycler","What is a cycler and how do I use it?",thisButton); },true);
			createMenuButtons("Jobs","",helpMenuControls,"Find out what a job is and how to use it efficiently.",function(thisButton) {
				showHelpDialog("jobs","What is a job and what can I do with it?",thisButton); },true);
			createMenuButtons("Job Details","",helpMenuControls,"Find out what the options in the details section mean.",function(thisButton) {
				showHelpDialog("jobDetails","What are the other options I can use with jobs?",thisButton); },true);
			createMenuButtons("Go Ham","",helpMenuControls,"Find out what Go Ham is and how it can help you get hits faster.",function(thisButton) {
				showHelpDialog("goHam","What is Go Ham and does it really taste like ham?",thisButton); },true);
			createMenuButtons("Groupings","",helpMenuControls,"Find out how to group jobs together so you can start and stop jobs at same time.",function(thisButton) {
				showHelpDialog("groupings","How do I use groupings and what are they?",thisButton); },true);
			createMenuButtons("Tabs","",helpMenuControls,"Find out how to use the tabs.",function(thisButton) { showHelpDialog("tabs","What can I do with the tabs?",thisButton); },true);
			createMenuButtons("Options","",helpMenuControls,"Find out about all the options you can change and why you would want to.",function(thisButton) {
				showHelpDialog("options","What can I do with all these options?",thisButton); },true);
			createMenuButtons("Status Text","",helpMenuControls,"Find out about the status text at the top and what it all means.",function(thisButton) {
				showHelpDialog("statustext","What are the stats at the top mean?",thisButton); },true);
			setTimeout( function() {
				addToWaitDialog(waitingDialog,"Setting up Status Row.",true,"16px");
				var mainStatus = createDiv().appendTo(northPanel).attr("id","JrMainStatus");
				mainStatus.css({"background-color":"aliceblue","font-size":"12px","color":"#191970","font-weight":"bold","padding":"5px 5px",
							   "border-color":"black", "border-width":"2px", "border-style":"groove"});
				createSpan().attr({"id":"JRJobsArea","class":"JRStatusText","title":"Click to list all jobs running."}).data("mode","Jobs")
					.click( function(e) { checkDelayedSave(); showSearchingDialog(null,"jobs",(gMainData.jobs===0) ? "all" : "collecting",true); }).appendTo(mainStatus);
				createSpan().attr({"id":"JRCycleInfoArea","class":"JRStatusText","title":"Click to Show Elapsed Time, Cycle Time, Added Time for Slow Down or Min Ham Cycle Time."}).data("mode","Elapsed")
					.click( function(e) { checkDelayedSave(); var theMode = $(e.target).data("mode");
						$(e.target).data("mode", (theMode=="Elapsed") ? "Cycle" : (theMode=="Cycle") ? "CycleSkipping" : (theMode=="CycleSkipping") ? "Hamcycle" : "Elapsed")
							.stop(true,true).css({"color":"red"}).animate({"color": "#191970"}, 30000);
						displayMainStatus();
					}).css({"cursor":"pointer"}).appendTo(mainStatus);
				createSpan().attr({"id":"JRResultAccSkipArea","class":"JRStatusText","title":"Click to Show Accepted, Missed, Skipped or total searched Hits."}).data("mode","Accepted")
					.click( function(e) { checkDelayedSave(); var theMode = $(e.target).data("mode");
						$(e.target).data("mode", (theMode=="Accepted") ? "Searched" : (theMode=="Searched") ? "Missed" : (theMode=="Missed") ? "Skipped" : "Accepted")
							.stop(true,true).css({"color":"red"}).animate({"color": "#191970"}, 30000);
						displayMainStatus();
					}).css({"cursor":"pointer"}).appendTo(mainStatus);
				createSpan().attr({"id":"JRErrorArea","class":"JRStatusText","title":"Click to Show Number of Page Request Errors or other Errors."}).data("mode","TooFast")
					.click( function(e) { checkDelayedSave(); var theMode = $(e.target).data("mode");
						$(e.target).data("mode", (theMode=="TooFast") ? "TooHamFast" : (theMode=="TooHamFast") ? "TooNormalFast" : (theMode=="TooNormalFast") ? "Errors" : "TooFast")
							.stop(true,true).css({"color":"red"}).animate({"color": "#191970"}, 30000);
						displayMainStatus();
					}).css({"cursor":"pointer"}).appendTo(mainStatus);
				createSpan().attr({"id":"JRPayArea","class":"JRStatusText","title":"Click for Payment for accepted hits or Projected Earnings from dashboard. Must have helper script and a script that shows projected earnings on the dashboard."}) .data("mode","PayAccepted")
					.click( function(e) { checkDelayedSave();
						var theMode = $(e.target).data("mode");
						$(e.target).data("mode", (theMode=="PayAccepted") ? "Projected" : "PayAccepted")
							.stop(true,true).css({"color":"red"}).animate({"color": "#191970"}, 30000);
						displayMainStatus();
					}).css({"cursor":"pointer"}).appendTo(mainStatus);
				var centerPanel = createPanel("body");
				centerPanel.addClass("ui-layout-center");
				setTimeout( function() {
					addToWaitDialog(waitingDialog,"Setting up Quick Button Row.",true,"16px");
					var theControls = createDiv().attr("id","JRTheControls").appendTo(centerPanel);
					theControls.css({"background-color":"aliceblue","font-size":"10px","color":"midnightblue","padding":"5px 4px",
								   "border-color":"black", "border-width":"2px", "border-style":"groove"});
					$(createSpanButton(function(e) { checkDelayedSave();
						if (theCycler.isPaused()) { theCycler.unpause(); $(e.target).html("Pause").css({"background-color":"ivory","color":"black"}); }
						else { theCycler.pause(); $(e.target).html("Resume").css({"background-color":"red","color":"white"}); }
					},"JRMButton hasHelptip","Pause","ivory","black","12px")).attr({"id":"JRPauseButton","title":"Pause collecting all jobs."}).appendTo(theControls);
					$(createSpanButton( function(e) { checkDelayedSave();
						toggleButton($(e.target),function(theNumber,thisButton) { showGroupingDialog("start",thisButton); },null);
					},"JRMButton hasHelptip","Start Group","ivory","black","12px")).attr({"title":"Start collecting all hits in a grouping.","id":"bShortStartG"}).appendTo(theControls);
					$(createSpanButton( function(e) { checkDelayedSave(); stopAll(); },"JRMButton hasHelptip","Stop All","ivory","black","12px"))
						.attr({"title":"Stop collecting all pandas NOW. The script will basically be turned off until you collect a hit again.","id":"bShortStop"}).appendTo(theControls);
					$(createSpanButton( function(e) { checkDelayedSave();
						toggleButton($(e.target),function(theNumber,thisButton) { showAddJobsDialog(thisButton); },null);
					},"JRMButton hasHelptip","Add Job","ivory","black","12px")).attr({"title":"Add a new panda to the current tab.","id":"bShortAddJ"}).appendTo(theControls);
					createSpan(" - ").appendTo(theControls);
					$(createSpanButton( function(e) { checkDelayedSave();
						showButtonUsed($(e.target)); theCycler.skippingReset(); displayMainStatus();
					},"JRMButton hasHelptip","Reset Timer","ivory","black","12px")).attr({"title":"Reset the timer to default if elapsed time is too high.","id":"bShortReset"}).appendTo(theControls);
					$(createSpanButton( function(e) { checkDelayedSave();
						toggleButton($(e.target),function(theNumber,thisButton) { showSearchingDialog(thisButton,"jobs","all",true); },null);
					},"JRMButton hasHelptip","Search Jobs","ivory","black","12px")).attr({"title":"Search through jobs you have saved.","id":"bShortSearchJ"}).appendTo(theControls);
					$(createSpanButton( function(e) { checkDelayedSave();
						toggleButton($(e.target),function(theNumber,thisButton) { showSearchingDialog(thisButton,"mturk"); },null);
					},"JRMButton hasHelptip","Search Mturk","ivory","black","12px")).attr({"title":"Search through Mturk.com for hits.","id":"bShortSearchM"}).appendTo(theControls);
					setTimeout( function() {
						addToWaitDialog(waitingDialog,"Setting up Tabs.",true,"16px");
						var mainTabs = createTabs(centerPanel,false,"JRMainTabs").css({"overflow":"hidden","box-sizing":"content-box"}).show();
						if (gTabsData[0].positions === null) fillInPositions();
						var southPanel = createPanel("body"), logTabs = createTabs(southPanel,false,"JRStatusTabs"); southPanel.addClass("ui-layout-south");
						gAcceptedLogTab = addTab(logTabs,null,"Accepted",false,"JRStatusTab_0",null,false,false);
						gStatusLogTab = addTab(logTabs,null,"Status log",false,"JRStatusTab_1",null,false,false);
						gQueueWatchTab = addTab(logTabs,null,"Queue Watch",false,"JRStatusTab_2",null,false,false);
						$(logTabs).find("ul:first").append(createSpan("").attr("id","JRCaptchaCount").css({"display":"inline-block","font-size":"10px","padding":"6px 0 0 3px"}));
						createDiv().appendTo(gAcceptedLogTab.find(".tabContents"))
							.attr({"id":"JRAcceptedLog","class":"JRContents"}).css({"background-color":"black","overflow":"auto","color":"white","font-size":"9px","padding-top":"2px"});
						createDiv().appendTo(gStatusLogTab.find(".tabContents"))
							.attr({"id":"JRStatusLog","class":"JRContents"}).css({"background-color":"black","overflow":"auto","color":"white","font-size":"9px", "padding-top":"2px"});
						createDiv().appendTo(gQueueWatchTab.find(".tabContents"))
							.attr({"id":"JRQueueWatchLog","class":"JRContents"}).css({"background-color":"black","overflow":"auto","color":"white","font-size":"9px", "padding-top":"2px"})
							.click( function() { checkDelayedSave(); theCycler.frontOfTheLineTimer(-1); });
						logTabs.tabs("option", "active", 2);
						setTimeout( function() {
							addToWaitDialog(waitingDialog,"Creating The Job Cells.",true,"16px");
							fillTabs(mainTabs);
							mainTabs.tabs("option", "active", 0);
							panels.appendTo("body"); northPanel.appendTo("body"); centerPanel.appendTo("body"); southPanel.appendTo("body");
							mainTabs.appendTo(centerPanel); logTabs.appendTo(southPanel);
							tooltipCreateFix($("#JRMainTabs").find(".hasHelptip,.hasTooltip"),1000);
							cycleButtonSelect("1");
							gMyLayout = $('body').layout({
								center__onresize: function() {
									var newHeight = $(".ui-layout-south").innerHeight() - 35;
									gStatusLogTab.find("div.JRContents").css({"height":newHeight});
									gAcceptedLogTab.find("div.JRContents").css({"height":newHeight});
									gQueueWatchTab.find("div.JRContents").css({"height":newHeight});
									var mainTabsHeight = $(".ui-layout-center").innerHeight() - $("#JRTheControls").innerHeight() - 8;
									var tabContentsHeight = mainTabsHeight - $("#JRMainTabs").find(".ui-tabs-nav").innerHeight();
									$("#JRMainTabs").css({"height":mainTabsHeight});
									$("#JRMainTabs").find(".tabContents").css({"height":tabContentsHeight,"min-height":tabContentsHeight});
								},
							});
							gMyLayout.sizePane("north", 65);
							gMyLayout.sizePane("south", 180);
							$("#JRStatusLog").css({"height":$(".ui-layout-south").innerHeight() - 35});
							$("#JRAcceptedLog").css({"height":$(".ui-layout-south").innerHeight() - 35});
							$("#JRQueueWatchLog").css({"height":$(".ui-layout-south").innerHeight() - 35});
							theCycler.cycleResetChange(gMainOptions.cycleNumber);
							gNotifications = checkNotifications();
							displayMainStatus();
							setTimeout( function() {
								addToWaitDialog(waitingDialog,"Display is done.",true,"16px");
								addToWaitDialog(waitingDialog,"Starting up script.",true,"16px");
								tooltipCreateFix($(".JRStatusText"),680);
								tooltipCreateFix($(".hasHelptip"),1000);
								addQueueCheck();
								addExternalScriptCheck();
								$( document ).keydown(function( event ) {
								  if ( event.keyCode === $.ui.keyCode.ESCAPE ) {
									$( ".tabContents" ).sortable( "cancel" );
								  }
								});
								setTimeout( function() {
									$.modal.close();
									if (checkVersion(gRequestersData[0].action,gScriptVersion)) {
										createThisModal(450,1000,"newV",null,true);
										$("#JRjqModalDialog-newV").append($("<h1 style='text-align:center;'>Panda Crazy has updated to a new version: " + gScriptVersion + "</h1>"));
										$("#JRjqModalDialog-newV").append($("<ul><li style='margin-bottom:5px;'>" +
											"<span style='font-weight:bold;'>New Features:</span></li><ul style='margin-top:5px; color:#006400;'>" +
											"</ul></li><li style='margin-bottom:5px;'><span style='font-weight:bold;'>Bug Fixes:</span></li><ul style='margin-top:5px; color:#006400;'>" +
											"<li>Fixed a few bugs with the new site change over this week that caused some search jobs and searching mturk to stop working.</li>" +
											"</ul></li></ul>"));
										gRequestersData[0].action=gScriptVersion;
										saveSettings();
									}
									if (gNewSite || gNewOldSite) $("#menuArea").append("<span style='font-size:8px;color:green'> -NEW SITE- </span>");
									gSlowDownAuto = !gMainOptions.stopAutoSlow;
									if (!gSlowDownAuto) { toggleButton($("#bStopSlowdown"), null, null ); $("#bStopSlowdown").css({"background-color":"red"}); }
								},1000);
							},1);
						},1);
					},1);
				},1);
			},1);
		},1);
	},1);
}
function continueLoading() { addToWaitDialog($("#JRjqModalDialog-waiting"),"Settings loaded.<br>Creating UI Display.",true,"16px"); startPandaCrazy(); }
function okToStart() {
	if (gLocation.indexOf("&resetalldata=yes") != -1) {
		var replaceUrl = "https://worker.mturk.com/requesters/PandaCrazy/projects";
		if (!gNewSite) replaceUrl = "https://www.mturk.com/mturk/welcome?pandacrazy=on";
		showYesNoDialog("Are you sure you want to delete ALL Data???",function() {
			resetSettings(); window.location.replace(replaceUrl);
		}, null, null, function() { window.location.replace(replaceUrl); });
		return;
	} else {
		document.title = "JR Panda Crazy [" + gScriptVersion + "] for Mturk.com";
		createThisModal(350,500,"waiting",null,false,true);
		setTimeout( function() {
			var nowDate = new Date();
			gMturkDate = formatTimeZone("onlydate",nowDate,"mturk");
			addToWaitDialog($("#JRjqModalDialog-waiting"),"Loading settings in memory.",true,"16px");
			setTimeout( function() { loadSettings(); },1);
			window.onbeforeunload = function() { gAlarmObject = null; checkDelayedSave(); stopAll(); theCycler.turnOff(); if (gExtInterval) clearInterval(gExtInterval); };
		},1);
	}
}

$("body").html("").css("height",screen.height-310);
startMessageListener();
$(function() {
    createEditDialog(); createWaitDialog(); createYesNoDialog(); createPromptDialog();
	if (gLocation.indexOf("&usenewsite=yes") != -1) { gNewSite=true; gNewOldSite=false; }
	if (gLocation.indexOf("worker.mturk.com") != -1) { gNewSite=true; gNewOldSite=false; }
	if (!gNewSite) {
		//showYesNoDialog("Mturk is in the middle of switching things over to the new worker site but are having problems so do you want to stay on the old site?",function() {
			//okToStart();
		//}, null, null, function() {
			createThisModal(450,1000,"newV",null,true);
			$("#JRjqModalDialog-newV").append($("<h1 style='text-align:center;'>This page will no longer work for Panda Crazy.</h1>"));
			$("#JRjqModalDialog-newV").append($("<h2>You must now go to the Panda Crazy links on the new worker site. \
				<ul><li>https://worker.mturk.com/requesters/PandaCrazy/projects (RECOMMENDED)</li> \
				<li>https://worker.mturk.com/?filters[search_term]=pandacrazy=on</li></ul></h2> \
				<h3>You will be redirected to the new worker url in 5 seconds. Hold on and enjoy the ride....</h3>"));
			setTimeout( function() { window.location.replace("https://worker.mturk.com/requesters/PandaCrazy/projects"); },8000);
		 //});
	} else okToStart();
});

/*jshint multistr: true */
GM_addStyle(jqUI_CssSrc);
GM_addStyle(jqUI_ModalSrc);
GM_addStyle(jqLayout_CssSrc);
GM_addStyle( " \
    body, input, select, td, li, div, textarea, p { font-size:11px; line-height: 14px; font-family:verdana,arial,sans-serif;} \
    .sortable-placeholder { height: 1.5em; line-height: 1.2em; background-color:burlywood; } \
    .ui-state-highlight { height: 1.5em; line-height: 1.2em; } \
    .editLine { padding: 2px 0; } \
    .editLine span { font-weight: bold; } \
    .ui-tooltip { white-space: pre-line; font-size:16px !important; max-width: 400px; width:500px; color:darkblue; } \
    .ui-tooltip-content { max-width: 400px; font-size:16px !important; line-height:17px !important; } \
    .ui-dialog.notmodal { border: 3px solid #000; } \
    .no-close .ui-dialog-titlebar-close { display: none; } \
    .ui-button .ui-state-default, .ui-button .ui-state-hover { color: black !important; } \
    .ui-state-hover .ui-icon1, .ui-state-focus .ui-icon1 { background-image: none !important; } \
	.ui-state-active .ui-tabs-anchor, .ui-tabs-active .ui-tabs-anchor { color: #000000 !important; } \
    .ui-state-active .ui-state-hover a, .ui-state-active .ui-state-hover a:link, .ui-state-focus .ui-state-hover a, .ui-state-focus .ui-state-hover a:link	{ \
		color: #FFFFFF !important; \
	} \
	.ui-icon, .ui-widget-content .ui-icon { \
		background-image: url('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/themes/pepper-grinder/images/ui-icons_222222_256x240.png'); \
	} \
    .ui-state-focus a, .ui-widget-content .ui-state-focus a, .ui-widget-header .ui-state-focus a  { color: #FFFFFF !important; } \
    .ui-state-hover a, .ui-widget-content .ui-state-hover a, .ui-widget-header .ui-state-hover a  { color: #FFFFFF !important; } .ui-state-active .ui-icon1 { \
         background-image: none !important; \
    } \
    .ui-state-default .ui-icon { \
        background-image: url('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/themes/pepper-grinder/images/ui-icons_b83400_256x240.png') !important; \
    } \
    .ui-widget-content { background: #eceadf none 50% 50% repeat !important; } \
	.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default { background: #f8f7f6 none 50% 50% repeat !important; } \
	.ui-widget-content .ui-icon1 { background-image: none !important; } \
	.ui-widget-header { background: #ffffff none 50% 50% repeat !important; } \
	#JREditDialog div { margin-top: 5px; } \
	.hitRow { margin-top: 0 !important; height: 16px; } \
	.JREditRadioB.ui-button-text-only.ui-state-focus { background: #f8f7f6 none 50% 50% repeat !important; padding: 0 3px 0 2px; } \
	.JREditRadioB.ui-button-text-only.ui-state-active, .JREditRadioB.ui-button-text-only.ui-state-focus.ui-state-hover { \
		color: #FFFFFF !important; background: #654b24 none 50% 50% repeat !important; \
	} \
	.JREditRadioB.ui-button-text-only .ui-button-text { color: #000000; padding: .1em .4em; } \
	.JREditRadioB.ui-button-text-only.ui-state-hover .ui-button-text { color: #FFFFFF !important; } \
	.JREditRadioB.ui-button-text-only.ui-state-active .ui-button-text { color: #FFFFFF !important; } \
	.ui-widget-overlay { background: #6e4f1c none 50% 50% repeat !important; } \
	.ui-state-active, .ui-widget-content .ui-state-active, .ui-widget-header .ui-state-active { \
		color: #140f06; background: #eceadf none 50% 50% repeat !important; \
	} \
	.ui-state-hover, .ui-widget-content .ui-state-hover, .ui-widget-header .ui-state-hover, .ui-state-focus, .ui-widget-content .ui-state-focus, \
	.ui-widget-header .ui-state-focus { background: #654b24 none 50% 50% repeat !important; } \
    #JRMainTabs li .ui-icon-close { float: left; margin: 0.4em 0.2em 0 0; cursor: pointer; } \
    #JRStatusTabs li .ui-icon-close { float: left; margin: 0.4em 0.2em 0 0; cursor: pointer; } \
	.dialogModal { overflow: visible !important; } \
	a.JRQueueReturn:link, a.JRQueueContinue:link { color: #3399FF; } \
	a.JRQueueReturn:visited, a.JRQueueContinue:visited { color: #6633FF; } \
	.hitRow .aHitColumn { display: inline-block; padding: 1px 5px; white-space: nowrap; border: 1px solid black; overflow: hidden; } \
	.modal { z-index:10 !important; max-width:none !important; background:#eceadf none 50% 50% repeat !important } \
	.ui-layout-resizer { z-index:0 !important; } \
	.nonselectable{-webkit-user-select:none;-khtml-user-drag:none;-khtml-user-select:none;-moz-user-select:none;-moz-user-select:-moz-none;-ms-user-select:none;user-select:none} \
	.selectable{-webkit-user-select:auto;-khtml-user-drag:auto;-khtml-user-select:auto;-moz-user-select:auto;-ms-user-select:auto;user-select:auto} \
");
