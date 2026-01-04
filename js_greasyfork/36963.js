// ==UserScript==
// @name        Enhanced Tremor Games
// @namespace   ETG
// @support     http://www.tremorgames.com/?action=viewtopic&topicid=79097
// @icon        https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/ETG.ico
// @description Enhanced Tremor Games will enhance your tremor games experience!
// @style       ES2017 - Strings typically use double quotes, except HTML strings, which use single quotes.
// @resource    btnBold https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/bold.png
// @resource    btnCode https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/code.png
// @resource    btnHeader2 https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/header_2.png
// @resource    btnHeader3 https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/header_3.png
// @resource    btnHeader4 https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/header_4.png
// @resource    btnHr https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/hr.png
// @resource    btnImage https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/image.png
// @resource    btnItalic https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/italic.png
// @resource    btnLink https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/link.png
// @resource    btnList https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/list.png
// @resource    btnTable https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/buttons/table.png
// @resource    cfTextEditor https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/text_editor.png
// @resource    cfDarkTheme https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/dark_theme.png
// @resource    cfCustomOrder https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/custom_order.png
// @resource    cfChat https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/chat.png
// @resource    cfGiveaways https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/giveaways.png
// @resource    cfInventory https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/inventory.png
// @resource    cfLastPage https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/last_page.png
// @resource    cfLastPost https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/last_post.png
// @resource    cfPms https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/pms.png
// @resource    cfRewards https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/rewards.png
// @resource    cfSteam https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/steam.png
// @resource    cfUnsubscribe https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/unsubscribe.png
// @resource    cfWishlist https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/config/wishlist.png
// @resource    ajaxLoaderGif https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/ajaxloader.gif
// @resource    etgIcon https://raw.githubusercontent.com/Royalgamer06/EnhancedTremorGames/master/images/ETG.ico
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @connect     store.steampowered.com
// @connect     steamcommunity.com
// @connect     royalgamer06.ga
// @version     1.5.1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       unsafeWindow
// @author      Royalgamer06
// @author      brenomirandi
// @include     *://www.tremorgames.com/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/36963/Enhanced%20Tremor%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/36963/Enhanced%20Tremor%20Games.meta.js
// ==/UserScript==

// JQUERY NO CONFLICT
this.$ = this.jQuery = jQuery.noConflict(true);

// GLOBAL VARIABLES
var bGiveaways,
    bUnsubscribe,
    bLastpage,
    bLastpost,
    bSelectiveItems,
    bWishlist,
    bPM,
    bInventory,
    bSteam,
    bEditor,
    bDarkTheme,
    bCustomOrder,
    bChat,
    ChatSize,
    btnBold,
    btnCode,
    btnHeader2,
    btnHeader3,
    btnHeader4,
    btnHr,
    btnImage,
    btnItalic,
    btnLink,
    btnList,
    btnTable,
    cfTextEditor,
    cfDarkTheme,
    cfCustomOrder,
    cfChat,
    cfGiveaways,
    cfInventory,
    cfLastPage,
    cfLastPost,
    cfPms,
    cfRewards,
    cfSteam,
    cfUnsubscribe,
    cfWishlist,
    dSteam,
    dTremor,
    ajaxLoaderGif,
    etgIcon,
    chatSizes,
    commentArea,
    isChrome,
    domain,
    v;

// INITIATE ENHANCED TREMOR GAMES
function initETG() {

    // DEFAULT AJAX BEHAVIOR
    $.ajaxSetup({
        cache: false
    });

    // ASSIGN VALUES TO GLOBAL VARIABLES
    bGiveaways = GM_getValue("bGiveaways", true);
    bUnsubscribe = GM_getValue("bUnsubscribe", true);
    bLastpage = GM_getValue("bLastpage", true);
    bLastpost = GM_getValue("bLastpost", true);
    bSelectiveItems = GM_getValue("bSelectiveItems", true);
    bWishlist = GM_getValue("bWishlist", true);
    bPM = GM_getValue("bPM", true);
    bInventory = GM_getValue("bInventory", true);
    bSteam = GM_getValue("bSteam", true);
    bEditor = GM_getValue("bEditor", true);
    bDarkTheme = GM_getValue("bDarkTheme", false);
    bCustomOrder = false;
    bChat = GM_getValue("bChat", true);
    ChatSize = GM_getValue("ChatSize", 4);
    btnBold = GM_getResourceURL("btnBold");
    btnCode = GM_getResourceURL("btnCode");
    btnHeader2 = GM_getResourceURL("btnHeader2");
    btnHeader3 = GM_getResourceURL("btnHeader3");
    btnHeader4 = GM_getResourceURL("btnHeader4");
    btnHr = GM_getResourceURL("btnHr");
    btnImage = GM_getResourceURL("btnImage");
    btnItalic = GM_getResourceURL("btnItalic");
    btnLink = GM_getResourceURL("btnLink");
    btnList = GM_getResourceURL("btnList");
    btnTable = GM_getResourceURL("btnTable");
    cfTextEditor = GM_getResourceURL("cfTextEditor");
    cfDarkTheme = GM_getResourceURL("cfDarkTheme");
    cfCustomOrder = GM_getResourceURL("cfCustomOrder");
    cfChat = GM_getResourceURL("cfChat");
    cfGiveaways = GM_getResourceURL("cfGiveaways");
    cfInventory = GM_getResourceURL("cfInventory");
    cfLastPage = GM_getResourceURL("cfLastPage");
    cfLastPost = GM_getResourceURL("cfLastPost");
    cfPms = GM_getResourceURL("cfPms");
    cfRewards = GM_getResourceURL("cfRewards");
    cfSteam = GM_getResourceURL("cfSteam");
    cfUnsubscribe = GM_getResourceURL("cfUnsubscribe");
    cfWishlist = GM_getResourceURL("cfWishlist");
    dSteam = JSON.parse(GM_getValue("dSteam", "{}"));
    dTremor = JSON.parse(GM_getValue("dTremor", "{}"));
    ajaxLoaderGif = GM_getResourceURL("ajaxLoaderGif");
    etgIcon = GM_getResourceURL("etgIcon");
    chatSizes = [
        [150, 520],
        [240, 520],
        [260, 520],
        [300, 520],
        [360, 520],
        [480, 520]
    ];
    isChrome = !!window.chrome;
    domain = "http://www.tremorgames.com/";
    v = parseInt(GM_getValue("v", "0")) || 0;

    if (bDarkTheme)
        setTimeout(addDarkTheme, 0);
    if (Date.now() - parseInt(GM_getValue("lastSteamSync", "0")) >= 1800000 && bSteam) // every half hour
        setTimeout(ajaxSteamSync, 0);
    if (Date.now() - parseInt(GM_getValue("lastTremorSync", "0")) >= 21600000) // every 6 hours
        setTimeout(ajaxTremorSync, 0);

    $(document).ready(readyToEnhance);
}

// WAIT FOR DOCUMENT TO LOAD
function readyToEnhance() {
    setTimeout(customMenu, 0);
    if (bChat)
        setTimeout(addFloatingChat, 0);
    if (bGiveaways)
        setTimeout(joinAllGiveaways, 0);
    if (URLContains("editprofile"))
        setTimeout(addSettings, 0);
    /*if (URLContains("action=custom_game") && !URLContains("manual=true") && !URLContains("_submit") && bCustomOrder)
        setTimeout(addCustomOrderAutocomplete, 0);
    if (URLContains("action=custom_game_submit") && bSteam)
        setTimeout(addSteamOwnedToCustomOrder, 0);*/
    if (URLContains("action=messages") && bPM)
        setTimeout(enhancePrivateMessages, 0);
    if (URLContains("action=shop") && bSelectiveItems)
        setTimeout(enhanceShop, 0);
    if (URLContains("action=showitem&itemid=") && bSteam)
        setTimeout(enhanceShopItem, 0);
    if (URLContains("/profiles/") && bInventory)
        setTimeout(enhanceInventory, 0);
    if (URLContains("/profiles/") && bWishlist)
        setTimeout(enhanceWishlist, 0);
    if (URLContains("viewgiveaways") && bGiveaways)
        setTimeout(addGiveawaysJoinButton, 0);
    if (URLContains("action=forums") && !URLContains("&") && bUnsubscribe)
        setTimeout(addUnsubscribe, 0);
    if ((URLContains("action=forums") || URLContains("action=viewforum")) && bLastpage)
        setTimeout(addLastPage, 0);
    if (URLContains("page=4096") && bLastpost)
        setTimeout(scrollToLastPost, 0);
    if (URLContains("action=chat"))
        setTimeout(addReportToChat, 0);
    if (URLContains("viewtopic&topicid"))
        setTimeout(addReportToTopic, 0);
    if (URLContains("viewtopic&topicid"))
        setTimeout(addMultiQuote, 0);
    if (URLContains("viewtopic&topicid") && bEditor)
        setTimeout(enhanceTextEditor, 0);
    if (URLContains("action=shopbrowse&mode=tradingcards"))
        setTimeout(addTradingCardsList, 0);
    if (URLContains("action=points"))
        setTimeout(showStats, 0);
}

// RETURN IF URL CONTAINS STRING
function URLContains(str) {
    return window.location.href.indexOf(str) > -1;
}

// RETURN COOKIE VALUE
function readCookie(name) {
    name += "=";
    for (var ca = document.cookie.split(/;\s*/), i = ca.length - 1; i >= 0; i--) {
        if (!ca[i].indexOf(name)) return ca[i].replace(name, "");
    }
}

// RETURN THE DATE STRING OF TODAY
function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return day + "-" + month + "-" + year;
}

// RETURN THE TIME STRING OF NOW
function getTime() {
    var date = new Date();
    var seconds = date.getSeconds().toString();
    var minutes = date.getMinutes().toString();
    var hour = date.getHours().toString();
    return (hour.length > 1 ? hour : "0" + hour) + ":" +
        (minutes.length > 1 ? minutes : "0" + minutes) + ":" +
        (seconds.length > 1 ? seconds : "0" + seconds);
}

// ADD CONFIGURATION SETTINGS
/*var config = {
    steam: {
        name: "Steam",
        description: "Activates steam functions",
        image: GM_getResourceURL("cfSteam"),
        inputs: [{
            type: "checkbox",
            value: bSteam,
            function: toggleS
        }, {
            type: "button",
            value: "ON",
            subtext: "Last sync",
            function: syncSteam
        }]
    }
};*/
function addSettings() {
    $('div.reg_row:nth-child(18)').after('<div class="reg_row" id="etg_row0"><div class="reg_col1" style="color:#FFB300" width="80%"><b>ETG Features</b></div></div>');

    $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row8"><button style="background-color:grey;width:150px;" onclick="return false;" class="cssbutton" value="syncSteam" id="syncSteam">Sync Steam</button></div></div>');

    if (!bChat)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row7"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleChat" id="toggleChat" name="13">Chat: Off</button></div></div>');
    else if (bChat)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row7"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleChat" id="toggleChat" name="13">Chat: On</button></div></div>');
    $('#etg_row7').after('<div class="reg_col5" style="margin-top: 10px;"><button style="background-color:grey;width:150px;" onclick="return false;" class="cssbutton" value="reset" id="resetSubscriptions">Reset Subscriptions</button></div>');

    if (!bSteam)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row6"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleSteam" id="toggleSteam" name="5">Steam: Off</button></div></div>');
    else if (bSteam)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row6"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleSteam" id="toggleSteam" name="5">Steam: On</button></div></div>');

    if (!bCustomOrder)
        $('#etg_row6').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleC" id="toggleC" name="12">Custom Order: Off</button></div>');
    else if (bCustomOrder)
        $('#etg_row6').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleC" id="toggleC" name="12">Custom Order: On</button></div>');

    if (!bEditor)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row5"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleE" id="toggleE" name="10">Text Editor: Off</button></div></div>');
    else if (bEditor)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row5"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleE" id="toggleE" name="10">Text Editor: On</button></div></div>');

    if (!bDarkTheme)
        $('#etg_row5').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleT" id="toggleT" name="11">Dark Theme: Off</button></div>');
    else if (bDarkTheme)
        $('#etg_row5').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleT" id="toggleT" name="11">Dark Theme: On</button></div>');

    if (!bWishlist)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row4"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleW" id="toggleW" name="4">Wishlist: Off</button></div></div>');
    else if (bWishlist)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row4"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleW" id="toggleW" name="4">Wishlist: On</button></div></div>');

    if (!bInventory)
        $('#etg_row4').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleI" id="toggleI" name="7">Inventory: Off</button></div>');
    else if (bInventory)
        $('#etg_row4').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleI" id="toggleI" name="7">Inventory: On</button></div>');

    if (!bGiveaways)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row3"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleG" id="toggleG" name="9">Giveaways: Off</button></div></div>');
    else if (bGiveaways)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row3"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleG" id="toggleG" name="9">Giveaways: On</button></div></div>');

    if (!bPM)
        $('#etg_row3').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="togglePM" id="togglePM" name="6">PM: Off</button></div>');
    else if (bPM)
        $('#etg_row3').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="togglePM" id="togglePM" name="6">PM: On</button></div>');

    if (!bLastpage)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row2"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleL" id="toggleL" name="0">Last Page: Off</button></div></div>');
    else if (bLastpage)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row2"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleL" id="toggleL" name="0">Last Page: On</button></div></div>');

    if (!bUnsubscribe)
        $('#etg_row2').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleU" id="toggleU" name="2">Unsubscribe: Off</button></div>');
    else if (bUnsubscribe)
        $('#etg_row2').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleU" id="toggleU" name="2">Unsubscribe: On</button></div>');

    if (!bSelectiveItems)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row1"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleS" id="toggleS" name="3">Item Filters: Off</button></div></div>');
    else if (bSelectiveItems)
        $('#etg_row0').after('<div class="reg_row"><div class="reg_col1" style="position:static !important;" id="etg_row1"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleS" id="toggleS" name="3">Item Filters: On</button></div></div>');

    if (!bLastpost)
        $('#etg_row1').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleP" id="toggleP" name="1">Last Post: Off</button></div>');
    else if (bLastpost)
        $('#etg_row1').after('<div class="reg_col5" style="margin-top: 10px;"><button rel="tooltip" style="width:150px;" onclick="return false;" class="cssbutton" value="toggleP" id="toggleP" name="1">Last Post: On</button></div>');


    $("#syncSteam").parent().append('<p style="font: 9px arial; color: #a82020;">Last sync: ' + (new Date(parseInt(GM_getValue("lastSteamSync", "0")))).toLocaleString() + '</p>');
    if (!isValidSteamData(dSteam) && bSteam) {
        syncSteam();
    }

    activateToolTip();
    $("#resetSubscriptions").click(resetSubscriptions);
    $("#syncSteam").click(syncSteam);
    $("#toggleG").click(toggleG);
    $("#toggleU").click(toggleU);
    $("#toggleL").click(toggleL);
    $("#toggleP").click(toggleP);
    $("#toggleS").click(toggleS);
    $("#toggleW").click(toggleW);
    $("#togglePM").click(togglePM);
    $("#toggleI").click(toggleI);
    $("#toggleE").click(toggleE);
    $("#toggleT").click(toggleT);
    //$("#toggleC").click(toggleC);
    $("#toggleChat").click(toggleChat);
    $("#toggleSteam").click(toggleSteam);
}

// ACTIVATE TOOLTIPS FOR CONFIGURATION SETTINGS
function activateToolTip() {
    image = [
        cfLastPage, //0 - Last page
        cfLastPost, //1 - Last post
        cfUnsubscribe, //2 - Unsubscribe
        cfRewards, //3 - Hide unaffordable items
        cfWishlist, //4 - Removed owned wishlist items
        cfSteam, //5 - Owned on steam
        cfPms, //6 - PM checkboxes
        cfInventory, //7 - Export inventory
        cfInventory, //8 - Expand inventory
        cfGiveaways, //9 - Giveaways
        cfTextEditor, //10- Text Editor
        cfDarkTheme, //11- Dark Theme
        cfCustomOrder, //12- Custom Order
        cfChat //13- Chat
    ];
    $("button[rel=tooltip]").mouseover(function(e) {
        var img_i = $(this).attr("name");
        $(this).append('<div id="tooltip"><img src="' + image[img_i] + '"></div>');
    }).mousemove(function(e) {
        var win_width;
        if (window.innerWidth)
            win_width = window.innerWidth;
        else if (document.documentElement && document.documentElement.clientWidth)
            win_width = document.documentElement.clientWidth;
        else if (document.body)
            win_width = document.body.clientWidth;
        if (win_width > 1900)
            x_dist = 435;
        else if (win_width > 1400)
            x_dist = 290;
        else if (win_width > 1350)
            x_dist = 160;
        else if (win_width > 1200)
            x_dist = 130;
        else if (win_width > 1000)
            x_dist = -20;
        else
            x_dist = -40;
        $("#tooltip").css("top", e.pageY + 10);
        $("#tooltip").css("left", e.pageX - x_dist);
    }).mouseout(function() {
        $(this).children("div#tooltip").remove();
    });
}

function disableSteamOption() { //disable steam button
    $("#toggleSteam, #syncSteam").prop("disabled", true).html('Disabled!');
    GM_setValue("bSteam", false);
    bSteam = false;
}

function ajaxSteamSync() {
    v++;
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://store.steampowered.com/dynamicstore/userdata/?v=" + v,
        onload: function(response) {
            GM_setValue("v", v);
            try {
                dSteam = JSON.parse(response.responseText);
                GM_setValue("dSteam", JSON.stringify(dSteam));
                GM_setValue("lastSteamSync", Date.now());
                $("#syncSteam").parent().html('<button style="background-color: green; width: 150px;" onclick="return false;" class="cssbutton" value="syncSteam" id="syncSteam">Done!</button>');
            } catch (error) {
                console.log("Unable to parse steam JSON data.", error);
                $("#syncSteam").parent().html('<button style="background-color: red; width: 150px;" onclick="return false;" class="cssbutton" value="syncSteam" id="syncSteam">Error!</button>');
                if (isValidSteamData(dSteam)) {
                    console.log("Using cached steam JSON data.");
                } else {
                    disableSteamOption();
                }
            }
        }
    });
}

function ajaxTremorSync() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://royalgamer06.ga/tgdb.json",
        onload: function(response) {
            try {
                dTremor = JSON.parse(response.responseText);
                GM_setValue("dTremor", JSON.stringify(dTremor));
                GM_setValue("lastTremorSync", Date.now());
                $("#syncTremor").parent().html('<button style="background-color: green; width: 150px;" onclick="return false;" class="cssbutton" value="syncTremor" id="syncTremor">Done!</button>');
            } catch (error) {
                console.log("Unable to parse tremor games JSON data.", error);
                $("#syncTremor").parent().html('<button style="background-color: red; width: 150px;" onclick="return false;" class="cssbutton" value="syncTremor" id="syncTremor">Error!</button>');
            }
        }
    });
}

function toggleSteam() {
    if (!bSteam) {
        GM_setValue("bSteam", true);
        bSteam = true;
        document.getElementById("toggleSteam").innerHTML = "Steam: On";
    } else if (bSteam) {
        GM_setValue("bSteam", false);
        bSteam = false;
        document.getElementById("toggleSteam").innerHTML = "Steam: Off";
    }
}

function togglePM() {
    if (!bPM) {
        GM_setValue("bPM", true);
        bPM = true;
        document.getElementById("togglePM").innerHTML = "PM: On";
    } else if (bPM) {
        GM_setValue("bPM", false);
        bPM = false;
        document.getElementById("togglePM").innerHTML = "PM: Off";
    }
}

function toggleI() {
    if (!bInventory) {
        GM_setValue("bInventory", true);
        bInventory = true;
        document.getElementById("toggleI").innerHTML = "Inventory: On";
    } else if (bGiveaways) {
        GM_setValue("bInventory", false);
        bInventory = false;
        document.getElementById("toggleI").innerHTML = "Inventory: Off";
    }
}

function toggleC() {
    if (!bCustomOrder) {
        GM_setValue("bCustomOrder", true);
        bCustomOrder = true;
        document.getElementById("toggleC").innerHTML = "Custom Order: On";
    } else if (bCustomOrder) {
        GM_setValue("bCustomOrder", false);
        bCustomOrder = false;
        document.getElementById("toggleC").innerHTML = "Custom Order: Off";
    }
}

function toggleG() {
    if (!bGiveaways) {
        GM_setValue("bGiveaways", true);
        bGiveaways = true;
        document.getElementById("toggleG").innerHTML = "Giveaways: On";
    } else if (bGiveaways) {
        GM_setValue("bGiveaways", false);
        bGiveaways = false;
        document.getElementById("toggleG").innerHTML = "Giveaways: Off";
    }
}

function toggleU() {
    if (!bUnsubscribe) {
        GM_setValue("bUnsubscribe", true);
        bUnsubscribe = true;
        document.getElementById("toggleU").innerHTML = "Unsubscribe: On";
    } else if (bUnsubscribe) {
        GM_setValue("bUnsubscribe", false);
        bUnsubscribe = false;
        document.getElementById("toggleU").innerHTML = "Unsubscribe: Off";
    }
}

function toggleL() {
    if (!bLastpage) {
        GM_setValue("bLastpage", true);
        bLastpage = true;
        document.getElementById("toggleL").innerHTML = "Last Page: On";
    } else if (bLastpage) {
        GM_setValue("bLastpage", false);
        bLastpage = false;
        document.getElementById("toggleL").innerHTML = "Last Page: Off";
    }
}

function toggleP() {
    if (!bLastpost) {
        GM_setValue("bLastpost", true);
        bLastpost = true;
        document.getElementById("toggleP").innerHTML = "Last Post: On";
    } else if (bLastpost) {
        GM_setValue("bLastpost", false);
        bLastpost = false;
        document.getElementById("toggleP").innerHTML = "Last Post: Off";
    }
}

function toggleS() {
    if (!bSelectiveItems) {
        GM_setValue("bSelectiveItems", true);
        bSelectiveItems = true;
        document.getElementById("toggleS").innerHTML = "Item Filters: On";
    } else if (bSelectiveItems) {
        GM_setValue("bSelectiveItems", false);
        bSelectiveItems = false;
        document.getElementById("toggleS").innerHTML = "Item Filters: Off";
    }
}

function toggleW() {
    if (!bWishlist) {
        GM_setValue("bWishlist", true);
        bWishlist = true;
        document.getElementById("toggleW").innerHTML = "Wishlist: On";
    } else if (bWishlist) {
        GM_setValue("bWishlist", false);
        bWishlist = false;
        document.getElementById("toggleW").innerHTML = "Wishlist: Off";
    }
}

function toggleE() {
    if (!bEditor) {
        GM_setValue("bEditor", true);
        bEditor = true;
        document.getElementById("toggleE").innerHTML = "Text Editor: On";
    } else if (bEditor) {
        GM_setValue("bEditor", false);
        bEditor = false;
        document.getElementById("toggleE").innerHTML = "Text Editor: Off";
    }
}

function toggleT() {
    if (!bDarkTheme) {
        GM_setValue("bDarkTheme", true);
        bDarkTheme = true;
        document.getElementById("toggleT").innerHTML = "Dark Theme: On";
    } else if (bDarkTheme) {
        GM_setValue("bDarkTheme", false);
        bDarkTheme = false;
        document.getElementById("toggleT").innerHTML = "Dark Theme: Off";
    }
}

function toggleChat() {
    if (!bChat) {
        GM_setValue("bChat", true);
        bChat = true;
        document.getElementById("toggleChat").innerHTML = "Chat: On";
        $("#floatingChat").show();
    } else if (bChat) {
        GM_setValue("bChat", false);
        bChat = false;
        document.getElementById("toggleChat").innerHTML = "Chat: Off";
        $("#floatingChat").hide();
    }
}

// RESET TOPIC SUBSCRIPTIONS FOR CONFIGURATION SETTINGS
function resetSubscriptions() {
    GM_setValue("blocklist", null);
    $("#reset").text("Done!");
}

// SYNCING STEAM FOR CONFIGURATION SETTINGS
function syncSteam() {
    $("#syncSteam").parent().html('<center id="syncSteam"><img style="margin-top: 10px;" src="/ajax-loader.gif"></center>');
    ajaxSteamSync();
}

// CHANGE THE TOP MENU
function customMenu() {
    var menu = $("div.header-right ul.nav.nav-pills");
    $(menu).find(">li:has(>a)").remove();
    $(menu).find("div[style='margin-top:3px;']").css("margin-left", "10px");
    const js = "javascript";
    var community = buildDropdown([{
        href: "/?action=forums",
        title: "Community"
    }, {
        href: "/?action=viewgiveaways",
        title: "Giveaways"
    }, {
        href: "/?action=forums",
        title: "Forums"
    }, {
        href: "/?action=chat",
        title: "Chat"
    }]);
    var rewards = buildDropdown([{
        href: "/?action=shop",
        title: "Tremor Rewards"
    }, {
        href: "/?action=shop",
        title: "Item Store"
    }, {
        href: js + ":requestTremorReward();",
        title: "Request a game"
    }]);
    unsafeWindow.requestTremorReward = requestTremorReward;
    $(menu).prepend(community).prepend(rewards);
}

// BUILD A HTML STRING FOR A CUSTOMIZABLE DROPDOWN MENU
function buildDropdown(options) {
    if (!options || options.length === 0) return;
    var htmlStr = '<li><div class="btn-group" style="margin-top: 3px; margin-left: 10px;">';
    htmlStr += '<a style="color: white;" class="btn btn-danger btn-small" href="' + options[0].href + '">' + options[0].title + '</a>';
    htmlStr += '<button class="btn dropdown-toggle btn-danger btn-small" data-toggle="dropdown"><span class="caret"></span></button><ul class="dropdown-menu">';
    options.shift();
    $(options).each(function() {
        htmlStr += '<li><a href="' + this.href + '">' + this.title + '</a></li>';
    });
    htmlStr += '</ul></div></li>';
    return htmlStr;
}

// ADD DARK THEME TO TREMORGAMES
function addDarkTheme() {
    var css = "html {-webkit-filter: invert(100%);" +
        "-moz-filter: invert(100%);" +
        "-o-filter: invert(100%);" +
        "-ms-filter: invert(100%); } " +
        "img {-webkit-filter: invert(100%);" +
        "-moz-filter: invert(100%);" +
        "-o-filter: invert(100%);" +
        "-ms-filter: invert(100%); }" +
        "body { margin-top: -10px;" +
        "-webkit-filter: grayscale(1);" +
        "background: #262626; }";
    GM_addStyle(css);
}

// ADD FLOATING CHAT
function addFloatingChat() {
    var n = GM_getValue("ChatSize", 4);
    $("body").prepend('<div id="floatingChat" style="z-index: 100000; position: fixed; width: ' + chatSizes[n][0] + 'px; height: ' + chatSizes[n][1] + 'px; right: 0px; bottom: 0px; background: white; border: 1px solid rgb(221, 221, 221);"></div>');
    var refreshInterval = setInterval(function() {
        RefreshChat(refreshInterval);
    }, 5000);
    RefreshChat(refreshInterval);
    unsafeWindow.reportChat = reportChat;
    unsafeWindow.SendChatMessage = function() {
        chat_text = $("#chat_text").val();
        if (chat_text.trim() === "") return false;
        $.post("/achievements/ajax_sendchat.php", {
            chat_text: chat_text
        }, RefreshChat);
        $("#chat_text").val("");
        return false;
    };
}

// LOAD NEW CHAT CONTENTS IN FLOATING CHAT
function RefreshChat(refreshInterval) {
    if ($("#floatingChat").length > 0) {
        $.get("/?action=chat", function(data) {
            if ($("#main_chat").length === 0) {
                $("#floatingChat").html($(".main_section_content", data));
                if (GM_getValue("ChatSize", 4) != 1)
                    $("#floatingChat form").append('<input align="right" class="btn" type="Submit" value="Close" id="btnClose" onclick="$(this).parent().parent().parent().parent().remove();return false;">');
                else
                    $("#floatingChat form").append('&nbsp;&nbsp;&nbsp;<p id="btnClose" align="right" style="display: inline; cursor: pointer; color: gray; font-size: 16px;">x</p>');
                $("#floatingChat form").append(' <p id="chatConfig" align="right" style="float: right; display:inline; cursor: pointer; color: gray; font-size: 16px; margin-top: 5px;">⚙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>');
                $("#btnClose").click(function() {
                    clearInterval(refreshInterval);
                    $(this).parent().parent().parent().parent().remove();
                    return false;
                });
                $("#chatConfig").click(function() {
                    var c = prompt("Current chat size: " + GM_getValue("ChatSize", 4) + (GM_getValue("ChatSize", 4) == 4 ? " (default)" : "") + "\n\nChoose a size between 0-5:\n\n", "");
                    if (c !== null) {
                        if (c < 0 || c > 5 || (c + 1) / (c + 1) != 1) {
                            alert("Invalid value");
                            return;
                        } else {
                            GM_setValue("ChatSize", c);
                            bChat = true;
                            $("#floatingChat").css("width", chatSizes[c][0] + "px").css("height", chatSizes[c][1] + "px");
                        }
                    }
                });
            } else {
                $("#main_chat").html($("#main_chat", data).html());
            }
            $("#main_chat").css("overflow", "hidden");
            $("#main_chat > div").each(function() {
                var username = $("div:nth-child(2) > a", this).text();
                var username_link = $("div:nth-child(2) > a", this).attr("href");
                var chat_log = $("div:nth-child(2)", this).text().split(": ")[1];
                var time = $("div:nth-child(3)", this).text();
                $(this).append('<a style="border: 0px solid black; float: right; width: 50px; color: grey;" href="javascript:reportChat(\'' + username + '\', \'' + username_link + '\', \'' + chat_log + '\', \'' + time + '\')">Report</a>');
            });
            $("#main_chat").scrollTop(1000000);
        });
    }
}

// ADD CUSTOM ORDER AUTOCOMPLETE
function addCustomOrderAutocomplete() {
    $("form").remove();
    $(".main_section_content").prepend('<input style="width: 450px; float: left; background: none;" id="steamsearch" type="text">');
    $(".main_section_content").prepend('<label><b>Search for a Steam Game below:</b></label><label style="float: right; margin-right: 120px; margin-top: 5px;"> ...or <u><a href="?action=custom_game&manual=true">enter manually</a></u>.</label>');
    $("#steamsearch").after('<div style="margin-top: 30px; width: 480px; padding-left: 10px" class="easy-autocomplete-container"><ul style="display: block;" id="autocomplete"></ul></div><br><br><div id="result"></div>' +
                            '<div class="item_purchase"><hr><label><b>Total: </b><span id="total">0 Tremor Coins</span></label><a class="btn btn-success" style="width: 140px; color: white;" href="javascript:PurchaseAllItems()">Redeem All</a></div>');
    $("#steamsearch").on("change paste keyup", function() {
        if ($(this).val().trim() === "") {
            $("#autocomplete").hide();
        } else {
            $("#autocomplete").show();
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://store.steampowered.com/search/suggest?term=" + $(this).val() + "&f=games&cc=US&l=english",
                onload: function(data) {
                    $("#autocomplete").html('');
                    var parser = new DOMParser();
                    Array.from(parser.parseFromString(data.responseText, "text/html").querySelectorAll("[data-ds-appid]")).forEach(function(item) {
                        var appid = item.getAttribute("data-ds-appid");
                        var itemlink = item.getAttribute("href").split("?")[0];
                        var itemName = item.querySelector(".match_name").innerHTML;
                        var itemPrice = item.querySelector(".match_price").innerHTML;
                        var itemCoins = itemPrice == "Free" || itemPrice == "Free Demo" ? 0 : Math.round(parseFloat(itemPrice.replace("$", "")) * 850);
                        var smallImage = item.querySelector(".match_img img").getAttribute("src");
                        var right_text = '<span style="color: black;">' + itemName + '</span>';
                        var image_text = '<div style="float: left; margin-right: 10px;"><img style="width: 70px; height: 70px;" src="' + smallImage + '" /></div>';
                        right_text += '<div class="tooltip_options" style="margin-top: 4px;"><span style="font-size: 14px;"><b>' + itemPrice + '</b> (' + itemCoins + ' Tremor Coins)</span</div>';
                        $("#autocomplete").append('<a href="#" id="result_' + appid + '"><li><div class="eac-item">' + image_text + '<div>' + right_text + '</div><div style="clear: both;"></div></div></div></li></a>');
                        $("#result_" + appid).click(function() {
                            $("#steamsearch").attr("style", "width:450px;float:left;background:url('" + domain + "ajax-loader.gif') no-repeat right center;");
                            $("#autocomplete").hide();
                            $.post("/?action=custom_game_submit", {
                                url: itemlink
                            }, function(data) {
                                $("#steamsearch").attr("style", "width:450px;float:left;background:none;");
                                var html = "";
                                if (bSteam) {
                                    var owned = ownsSteamApp(appid) ? "Yes" : "No";
                                    if (owned == "Yes")
                                        if (!confirm("You own this game, are you sure you like to add this to cart?")) return false;
                                    html = $(".main_section_content", data).find("tbody > tr:nth-child(2)").after('<tr><td> Owned </td><td>' + owned + '</td></tr>').parent().parent().parent().html();
                                } else {
                                    html = $(".main_section_content", data).html();
                                }
                                $("#result").append('<div id="custom_order_' + appid + '"><hr><div class="subpage_header_backlink"><a href="javascript:DeleteItem(' + appid + ')" style="font-size: 26px; font-weight: bold;">X</a></div>' + html + '</div>');
                                $(".item_purchase").removeAttr("style");
                                var totalprice = parseInt($("#total").text().split(" ")[0]) + parseInt(itemCoins);
                                $("#total").text(totalprice + " Tremor Coins");
                            });
                        });
                    });
                }
            });
        }
    });
    unsafeWindow.DeleteItem = function(appid) {
        var elem = $("#custom_order_" + appid);
        var price = $(elem).find("table > tbody > tr:nth-child(5) > td:nth-child(2)").text();
        var totalprice = parseInt($("#total").text().split(" ")[0]) - parseInt(price);
        $("#total").text(totalprice + " Tremor Coins");
        $(elem).remove();
    };
    unsafeWindow.PurchaseItem = function(itemid, appid, game_type, itemname, price) {
        var r = false;
        smoke.confirm("Are you sure you want to redeem " + itemname + " for " + price + " Tremor Coins?", function(e) {
            if (e) {
                var nonce = $("#nonce").html();
                $.post("/achievements/ajax_buyitem.php", {
                    itemid: itemid,
                    nonce: nonce,
                    appid: appid,
                    type: game_type,
                    price_coins: price
                }, function(data) {
                    smoke.alert(data);
                });
            } else {}
        }, {
            ok: "Yes",
            cancel: "No",
            classname: "custom-class",
            reverseButtons: true
        });
    };
    unsafeWindow.PurchaseAllItems = function() {
        var price = $("#total").text();
        smoke.confirm("Are you sure you want to redeem all above items for " + price + "?", function(ev) {
            if (ev) {
                $("#result [href*=PurchaseItem]").each(function() {
                    var data = $(this).attr("href").split("(")[1].split(")")[0].replace(/\'/g, "").split(",");
                    var itemid = data[0];
                    var appid = data[1];
                    var nonce = $("#nonce").html();
                    $.post("/achievements/ajax_buyitem.php", {
                        itemid: itemid,
                        nonce: nonce,
                        appid: appid
                    }, function(data) {
                        smoke.alert(data);
                    });
                });
            }
        }, {
            ok: "Yes",
            cancel: "No",
            classname: "custom-class",
            reverseButtons: true
        });
    };
}

// ADD STEAM GAME OWNERSHIP INFORMATION TO DEFAULT CUSTOM ORDER RESULT
function addSteamOwnedToCustomOrder() {
    var appid = $(".grid a").text().split("/")[4];
    var owned = ownsSteamApp(appid) ? "Yes" : "No";
    $(".main_section_content").find("tbody > tr:nth-child(2)").after('<tr><td> Owned </td><td>' + owned + '</td></tr>');
}

// ADD CHECKBOXES TO PRIVATE MESSAGES
function enhancePrivateMessages() {
    $("tr[valign=top]").prepend('<td width="40" align="center" valign="middle" style="border-bottom: 1px solid #E4E4E3; border-right: 1px solid #E4E4E3;"><input type="checkbox"></td>');
    $("td[align=center]:first").prepend('<button id="deleteButton" style="margin-left: 3px; background-color: #0F96C8; color: white; position: relative; top: -5.5px; line-height: 10px; height: 19px; font-size: 12px;">DELETE CHECKED</button>');
    $("td[align=center]:first").prepend('<button id="readButton" style="margin-left: 3px; background-color: #0F96C8; color: white; position: relative; top: -5.5px; line-height: 10px; height: 19px; font-size: 12px;">MARK CHECKED READ</button>');
    $(".messagecellheaders input[type=checkbox]").click(function() {
        $("input[type=checkbox]").each(function() {
            $(this).prop("checked", !$(this).prop("checked"));
        });
    });
    $("tr[valign=top]:has(img[src*='unread.gif']) input[type=checkbox]").prop("checked", true);
    $("#deleteButton").click(deleteSelected);
    $("#readButton").click(markSelectedRead);
}

// DELETE SELECTED PRIVATE MESSAGES
function deleteSelected() {
    var checked = $("input[type=checkbox]:checked");
    if (checked.length > 0) {
        if (confirm("Are you sure you wish to delete these messages?")) {
            $(".main_section_content table").hide();
            $(".main_section_content").prepend('<div id="loading" style="visibility: visible; clear:both; padding-top:100px; height:160px;" align="center"><img src="/images/loading.gif"></div>');
            var ajaxCount = checked.length;
            $(checked).each(function() {
                $(this).parent().parent().remove();
                $.get($(this).parent().parent().find("a[onclick='return confirmDeleteMessage()']").attr("href"), function() {
                    ajaxCount--;
                    if (ajaxCount === 0) {
                        $(".main_section_content table").show();
                        $("#loading").remove();
                        $("#loading").remove();
                    }
                });
            });
        }
    } else {
        alert("Please select 1 or more private message(s) and try again");
    }
}

// DELETE SELECTED PRIVATE MESSAGES
function markSelectedRead() {
    var checked = $("tr[valign=top]:has(input[type=checkbox]:checked):not(.messagecellheaders)");
    if (checked.length > 0) {
        $(".main_section_content table").hide();
        $(".main_section_content").prepend('<div id="loading" style="visibility: visible; clear:both; padding-top:100px; height:160px;" align="center"><img src="/images/loading.gif"></div>');
        var ajaxCount = checked.length;
        checked.each(function() {
            let url = $(this).find(".messagesubject a").attr("href");
            let img = $(this).find("img[src*='unread.gif']");
            $.get(url, function() {
                ajaxCount--;
                if (img.length > 0) {
                    var c = parseInt($("[name=Messages]").text());
                    $("[name=Messages]").text(--c);
                    $(img).attr("src", "/images/read.gif").attr("alt", "You Have Read This Message");
                }
                if (ajaxCount === 0) {
                    $(".main_section_content table").show();
                    $("#loading").remove();
                    $("#loading").remove();
                }
            });
        });
    } else {
        alert("Please select 1 or more private message(s) and try again");
    }
}

// ADD STEAM GAME OWNERSHIP CHECK TO SHOP ITEM AND REMOVE REDEEM BUTTON IF NO STOCK
function enhanceShopItem() {
    if ($("#productlink[href*='steampowered.com/app/']").length > 0) {
        $(".item_purchase").prepend('<div id="steamcheck" style="margin-top: -20px; padding-bottom: 10px;"></div>');
        var appid = $("#productlink").attr("href").split("/")[4];
        if (ownsSteamApp(appid)) {
            $('#steamcheck').html('<b style="font-size: 12px; color: red;">WARNING: You already own this item on steam!</b>');
            $(".btn.btn-success.btn-large").first().css("background", "red");
        } else {
            $('#steamcheck').html('<b style="font-size: 12px; color: green;">NOTICE: You do not own this item on steam!</b>');
        }
        //$(".btn.btn-success.btn-large").first().css("font-size", "22px").css("width", "25%").after('<form id="customorder" action="/?action=custom_game_submit" method="POST" style="display: inline;"><input style="visibility: hidden; width: 0px;" id="url" name="url" type="text"><button type="submit" class="btn btn-success btn-large" style="font-size: 22px; width: 58%;">Custom order</button></form>');
        //$("#url").val($("#productlink").attr("href"));
    }
    if (parseInt($("#itemsremaining").text()) === 0) {
        $(".btn.btn-success.btn-large").first().remove();
    }
}

// ADD MORE CATEGORIES AND FILTER OPTIONS TO TREMOR REWARDS SHOP
function enhanceShop() {
    $(".main_section_box div:contains('No Items Found')").html('*** No Items Found In Tremor Rewards ***<br>*** Try <u><a id="btnRequestReward" href="javascript:void(0)">requesting it</a></u>! ***');
    $("#btnRequestReward").click(requestTremorReward);

    $(".shop_catbg_middle_right").append(' | ').append('<a href="/index.php?action=shopbrowse&mode=tradingcards" style="font-weight: bold; color: #FFF89B;">Games With Trading Cards</a>');
    /*if (GM_getValue("o_checked") == "false" && location.href == "/?action=shop") {
        location.href = "/?action=shop&searchterm=+";
    }*/

    $(".shop_item_box div a:has(img)").each(function() { // Add steam store links
        const itemid = $(this).attr("href").split("itemid=")[1];
        if (dTremor.rewards.hasOwnProperty(itemid)) {
            const steamid = dTremor.rewards[itemid].appid === null ? "sub/" + dTremor.rewards[itemid].subid : "app/" + dTremor.rewards[itemid].appid;
            $(this).after('<a href="http://store.steampowered.com/' + steamid + '" target="_blank"><img src="http://store.steampowered.com/favicon.ico" alt="Steam Store" height="20"></a>');
        }
    });

    var filters = '<br> Hide unaffordable items : <input type="checkbox" id="unaffordable">';
    if (bSteam) {
        filters += '<br> Hide items owned on steam : <input type="checkbox" id="steamowned">';
    }
    $("#frm_shop_srch > div > div").removeAttr("style").css("text-align", "right").css("margin-right", "16px").css("margin-top", "-12px").append(filters);
    $("#unaffordable").on("change", function() {
        if (this.checked) {
            GM_setValue("u_checked", true);
            $.get("/achievements/ajax_getusercoins.php", function(coinsresult) {
                var coins = parseInt(coinsresult);
                $("div.main_section_box > div > div.shop_item_box_type:nth-child(4)").each(function() {
                    var price = parseInt($(this).text().replace(" Tremor Coins", ""));
                    if (price > coins) {
                        $(this).parent().hide();
                        $(this).parent().addClass("unaffordable");
                    }
                });
            });
        } else {
            GM_setValue("u_checked", false);
            $(".shop_item_box.unaffordable:hidden:not(.steamowned:hidden):not(.outofstock:hidden)").each(function() {
                $(this).show();
            });
        }
    });
    $("#steamowned").on("change", function() {
        if (this.checked) {
            GM_setValue("s_checked", true);
            $(".shop_item_box:has(.popover_tooltip)").each(function() {
                const itemid = $(".popover_tooltip", this).attr("href").split("itemid=")[1];
                if (dTremor.rewards.hasOwnProperty(itemid) && ownsSteamApp(dTremor.rewards[itemid].appid)) {
                    $(this).addClass("steamowned").hide();
                }
            });
        } else {
            GM_setValue("s_checked", false);
            $(".shop_item_box.steamowned:hidden:not(.unaffordable:hidden):not(.outofstock:hidden)").each(function() {
                $(this).show();
            });
        }
    });
    $("input[name=hideoutofstock]").on("change", function() {
        if (this.checked && URLContains("searchterm=") && !URLContains("hideoutofstock=1")) {
            GM_setValue("o_checked", true);
            $(".shop_item_box_type~ .shop_item_box_type+ .shop_item_box_type").each(function() {
                var stock = parseInt($(this).text().trim().replace("In Stock : ", ""));
                if (stock === 0) {
                    $(this).parents(".shop_item_box").hide().addClass("outofstock");
                }
            });
        } else if (!this.checked && URLContains("searchterm=") && !URLContains("hideoutofstock=1")) {
            GM_setValue("o_checked", false);
            $(".shop_item_box.outofstock:hidden:not(.unaffordable:hidden):not(.steamowned:hidden)").each(function() {
                $(this).show();
            });
        } else if (!this.checked && URLContains("hideoutofstock=1")) {
            GM_setValue("o_checked", false);
            location.href = location.href.replace("&hideoutofstock=1", "");
        } else if (!this.checked && !URLContains("searchterm=")) {
            GM_setValue("o_checked", false);
            location.href = location.href + "&searchterm=+";
        }
    });
    var u_checked = Boolean(GM_getValue("u_checked"));
    var s_checked = Boolean(GM_getValue("s_checked"));
    var o_checked = Boolean(GM_getValue("o_checked"));
    if (u_checked) {
        $("#unaffordable").click();
    }
    if (s_checked) {
        $("#steamowned").click();
    }
    if (!URLContains("searchterm=") && !URLContains("hideoutofstock=1")) {
        $("input[name=hideoutofstock]")[0].checked = true;
        GM_setValue("o_checked", true);
        o_checked = true;
    } else if (URLContains("searchterm=") && !URLContains("hideoutofstock=1")) {
        $("input[name=hideoutofstock]")[0].checked = false;
        GM_setValue("o_checked", false);
        o_checked = false;
    } else if (URLContains("hideoutofstock=1")) {
        $("input[name=hideoutofstock]")[0].checked = true;
        GM_setValue("o_checked", true);
        o_checked = true;
    } else if (o_checked) {
        $("#steamowned").click();
    }
}

// REQUEST A GAME TO BE ADDED TO TEMOR REWARDS SETUP
function requestTremorReward() {
    if (confirm("Are you sure you want to request a game to be added to the Tremor Rewards Store?\nPlease note that requesting game does NOT guarantee it to be added.\nGames must be activated for worldwide.")) {
        let discounted = confirm("Is the game you want discounted somewhere?\nDiscounted games have a much higher chance to be accepted.\nOK = Yes, Cancel = No");
        let name = prompt("Game" + (discounted ? "/Sale" : "") + " name:") || "N/A";
        let link, price, enddate;
        if (discounted) {
            link = prompt("Direct link to discord/sale:\nPlease note that only trusted stores/sellers are accepted.") || "N/A";
            price = parseFloat(prompt("The price in USD ($):\nPlease do not include any text, only numbers.", "0.00")) || "N/A";
            var date = new Date();
            date.setDate(date.getDate() + 2);
            enddate = prompt("The date or time the sale ends:", "Ends in 2 days / Ends at " + date.toLocaleDateString()) || "N/A";
        }
        $.get("/achievements/ajax_getusercoins.php", function(coinsresult) {
            var coins = parseInt(coinsresult);
            var cancontinue = discounted ? (!isNaN(price) && (coins / 900 > price || price < 10)) : true;
            if (cancontinue) {
                const reason = prompt("Reason (optional):");
                const topicid = discounted ? 46393 : 69;
                var commenttext = "* **NAME**: " + name + "\n";
                if (discounted) {
                    commenttext += "* **LINK**: " + link + "\n";
                    commenttext += "* **PRICE**: $" + price + " = " + (price * 900) + " Tremor Coins\n";
                    commenttext += "* **END DATE**: " + enddate + "\n";
                }
                if (reason.length > 1) commenttext += "* **REASON**: " + reason + "\n";
                $.post("/ajax_addforum_post.php?topicid=" + topicid, {
                    message: commenttext
                }, function(data) {
                    var obj = JSON.parse(data);
                    if (obj.status == 1) {
                        alert("Successfully requested!");
                        const postid = $(".forumpost[id]", obj.message).attr("id");
                        location.href = domain + "?action=viewtopic&topicid=" + topicid + "&page=4096#" + postid;
                    } else {
                        alert(obj.message);
                    }
                });
            } else if (isNaN(price)) {
                alert("Sorry, the price format was incorrect. Please try again.");
            } else {
                alert("Sorry, make sure you only request major discounts that is not over $10/9000 Tremor coins UNLESS you have the coins for it.");
            }
        });
    }
}

// ADD EXPORT FUNCTION TO YOUR TREMOR REWARDS INVENTORY
function enhanceInventory() {
    var myuid = readCookie("uid");
    var uid = location.href.split("/")[4];
    $("#prf_tab6 a").removeAttr("onclick");
    $("#prf_tab6 a").click(function() {
        for (i = 1; i <= 9; i++) {
            if (i == 6) {
                $("#prf_tab" + i).addClass("actv");
            } else {
                $("#prf_tab" + i).removeClass("actv");
            }
        }
        $("#uprofile_content").html('<div style="clear: both; padding-top: 160px; height: 160px;" align="center"><img src="' + domain + '/images/loading.gif"></div>');
        $.get("/ajaxfunctions.php?page=load_profiletabs&pid=6&userid=" + uid, function(data) {
            $("#uprofile_content").html(data);
            $(".use_item_col span").each(function() {
                var t = $(this).text();
                if (t.includes("http://") || t.includes("https://")) {
                    $(this).html('<a target="_blank" href="' + t + '">' + t + '</a>');
                }
            });
            if ($("div.ach_paging_ajax").length > 0) {
                $("#uprofile_content .my_items_title").after('<button id="btnExpandAll" class="cssbutton" style="float: right; margin-bottom: 5px; margin-top: 5px; margin-right: 5px;">Load all pages</button>');
                $("#btnExpandAll").click(expandAll);
            }
            if (myuid === uid) {
                $(".wdth3:not(:has(.reqbtn))").append('<br><button class="cssbutton reqbtn" style="margin-top: 5px">Request refund</button>').each(function() {
                    $(this).click(requestRefund);
                });
                $("#uprofile_content .my_items_title").after('<button id="btnExportKeys" class="cssbutton" style="float: right; margin-bottom: 5px; margin-top: 5px; margin-right: 5px;">Export steam keys</button>');
                $("#btnExportKeys").click(exportAll);
                $("#uprofile_content .my_items_title").after('<button id="btnHideOwned" class="cssbutton" style="float: right; margin-bottom: 5px; margin-top: 5px; margin-right: 5px;">Show only unowned on steam</button>');
                $("#btnHideOwned").click(removeOwnedRewards);
            }
        });
    });
}

// REQUEST A REFUND SETUP
function requestRefund() {
    var row = $(this).parents("tr");
    if (confirm("Are you sure you want to request a refund?")) {
        const itemname = $(".txt", row).text().trim();
        const itemid = $(".txt > a", row).attr("href").split("itemid=")[1];
        const itemlink = "/?action=showitem&itemid=" + itemid;
        const itemcost = $(".wdth2 > div", row).text().split("(")[1].split(" Tremor")[0];
        const orderid = $(".wdth3", row).html().split("<br>")[0].split(":")[1].trim();
        const orderdate = $(".wdth3", row).html().split("<br>")[1].trim();
        const orderstatus = $(".use_item_col:contains(Awaiting)", row).length > 0 ? "Awaiting approval" : "Received";
        const reason = prompt("Reason:");
        var commenttext = "**ITEM NAME**: [" + itemname + "](" + itemlink + ")\n";
        commenttext += "**ITEM ID**: [" + itemid + "](" + itemlink + ")\n";
        commenttext += "**ITEM COST**: " + itemcost + "\n";
        commenttext += "**ORDER ID**: " + orderid + "\n";
        commenttext += "**ORDER DATE**: " + orderdate + "\n";
        commenttext += "**ORDER STATUS**: " + orderstatus + "\n";
        if (reason.length > 1) commenttext += "**REASON**: " + reason + "\n";
        $.post("/ajax_addforum_post.php?topicid=114231", {
            message: commenttext
        }, function(data) {
            var obj = JSON.parse(data);
            if (obj.status == 1) {
                alert("Successfully requested a refund!");
                const postid = $(".forumpost[id]", obj.message).attr("id");
                location.href = domain + "?action=viewtopic&topicid=114231&page=4096#" + postid;
            } else {
                alert(obj.message);
            }
        });
    }
}

// LOAD ALL ITEMS PAGES
function expandAll() {
    var max = parseInt($(".pagenav2").attr("onclick").split("'")[3]) / 10;
    var cur = parseInt($(".pagenav-view").text().trim()) - 1;
    var uid = location.href.split("/")[4];
    var myuid = readCookie("uid");
    $(".tbl_last > tbody > tr").last().children().each(function() {
        $(this).removeAttr("style");
    });
    for (var i = 0; i <= max; i++) {
        if (i !== cur) {
            $.get("/achievements/ajax_show_useritems.php?userid=" + uid + "&limitstart=" + (10 * i), function(data) {
                var rows = $('<div/>').html(data).find(".tbl_last > tbody > tr");
                $(rows).last().children().each(function() {
                    $(this).removeAttr("style");
                });
                $(".use_item_col span", rows).each(function() {
                    var t = $(this).text();
                    if (t.includes("http://") || t.includes("https://")) {
                        $(this).html('<a target="_blank" href="' + t + '">' + t + '</a>');
                    }
                });
                $("#UserItems > table.tbl_last > tbody").append(rows);
                if (uid === myuid) {
                    $(".wdth3:not(:has(.reqbtn))").append('<br><button class="cssbutton reqbtn" style="margin-top: 5px">Request refund</button>').each(function() {
                        $(this).click(requestRefund);
                    });
                }
            });
        }
    }
    $("div.ach_paging_ajax").remove();
}

// CREATE EXPORTING DATA
function exportAll() {
    var data = "";
    $("#UserItems > table.tbl_last > tbody > tr").each(function() {
        if ($(this).text().match(/[A-NP-RTV-Z02-9]{5}(-[A-NP-RTV-Z02-9]{5}){2}/)) {
            var name = $(this).find(".txt a").text();
            var value = $(this).find(".use_item_col span").text();
            data += name + "\r\n" + value + "\r\n\r\n";
        }
    });
    downloadFile("tremor_games_export.txt", data);
}

// DOWNLOAD A FILE WITH CUSTOM DATA
function downloadFile(filename, data) {
    var blob = new Blob([data], {
        type: "text/csv"
    });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var elem = window.document.createElement("a");
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

// HIDE REWARDS ALREADY OWNED ON STEAM
function removeOwnedRewards() {
    $("#UserItems tr:has([href*='showitem&itemid='])").each(function() {
        const itemid = $("[href*='showitem&itemid=']", this).attr("href").split("itemid=")[1];
        if (!dTremor.rewards.hasOwnProperty(itemid) || ownsSteamApp(dTremor.rewards[itemid].appid) || ownsSteamSub(dTremor.rewards[itemid].subid)) {
            $(this).remove();
        }
    });
    $("#btnHideOwned").text("Done!").prop("disabled", true);
}

// ADD FUNCTIONS TO WISHLIST
function enhanceWishlist() {
    $("#prf_tab9 a").removeAttr("onclick");
    $("#prf_tab9 a").click(function() {
        var myuid = readCookie("uid");
        var uid = location.href.split("/")[4];
        for (i = 1; i <= 9; i++) {
            if (i == 9) {
                $("#prf_tab" + i).addClass("actv");
            } else {
                $("#prf_tab" + i).removeClass("actv");
            }
        }
        $("#uprofile_content").html('<div style="clear: both; padding-top: 160px; height: 160px;" align="center"><img src="/images/loading.gif"></div>');
        $.get("/ajaxfunctions.php?page=load_profiletabs&pid=9&userid=" + uid, function(data) {
            $("#uprofile_content").html(data);
            if ($("#btnHideOutOfStock").length === 0) {
                $("#uprofile_content .my_items_title").after('<button id="btnHideOutOfStock" class="cssbutton" style="float: right; margin-bottom: 5px; margin-top: 5px; margin-right: 5px;">Hide out of stock</button>');
                $("#btnHideOutOfStock").click(hideOutOfStock);
                if (myuid === uid) {
                    $("#uprofile_content .my_items_title").after('<button id="btnRemoveRedeemed" class="cssbutton" style="float: right; margin-bottom: 5px; margin-top: 5px; margin-right: 5px;">Remove redeemed</button>');
                    $("#btnRemoveRedeemed").click(removeRedeemed);
                    if (bSteam) {
                        $("#uprofile_content .my_items_title").after('<button id="btnRemoveOwned" class="cssbutton" style="float: right; margin-bottom: 5px; margin-top: 5px; margin-right: 5px;">Remove owned on steam</button>');
                        $("#btnRemoveOwned").click(removeOwned);
                        $("#uprofile_content .my_items_title").after('<button id="btnImportWishlist" class="cssbutton" style="float: right; margin-bottom: 5px; margin-top: 5px; margin-right: 5px;">Import wishlist from steam</button>');
                        $("#btnImportWishlist").click(importWishlist);
                    }
                }
            }
            if ($(".tbl_last.sortable").length === 0 && $("div.ach_paging_ajax").length > 0) {
                $("#uprofile_content").prepend('<div id="loading" style="visibility: visible; clear:both; padding-top: 160px; height: 160px;" align="center"><img src="/images/loading.gif"></div>');
                $("#uprofile_content").css("visibility", "hidden");
                var max = parseInt($(".pagenav2").attr("onclick").split("'")[3]) / 10;
                $(".tbl_last > tbody > tr").last().children().each(function() {
                    $(this).removeAttr("style");
                });
                for (let i = 1; i <= max; i++) {
                    $.get("/achievements/ajax_show_wishlistitems.php?userid=" + uid + "&limitstart=" + (10 * i), function(data) {
                        var rows = $("<div />").html(data).find("table.tbl_last tr");
                        $(rows).last().children().each(function() {
                            $(this).removeAttr("style");
                        });
                        $("#UserWishlistItems > table.tbl_last > tbody").append(rows);
                        if (i === max) {
                            setTimeout(function() {
                                $.getScript("http://www.kryogenix.org/code/browser/sorttable/sorttable.js", function() {
                                    $("#uprofile_content").css("visibility", "visible");
                                    $("#loading").remove();
                                });
                            }, 500);
                        }
                    });
                }
                $("div.ach_paging_ajax").remove();
                $("table.head").remove();
                $("table.tbl_last > tbody").prepend('<tr><td class="wdth1"></td><td class="seb"></td><td class="wdth2" style="cursor: pointer;">Title</td><td class="seb"></td><td class="wdth3" style="cursor: pointer;">Stock</td><td class="seb"></td><td class="use_item_col"></td></tr>');
                $("table.tbl_last tr:first > td:not(.seb)").css("background-color", "#3d94f6").css("text-align", "center").css("font-weight", "bold").css("color", "black");
                $("table.tbl_last").addClass("sortable");
            }
        });
    });
}

// HIDE WISHLIST ITEMS THAT ARE OUR OF STOCK
function hideOutOfStock() {
    var html = $("#btnHideOutOfStock").html();
    $("#UserWishlistItems tbody td.wdth3").each(function() {
        if (parseInt($(this).text()) <= 0) {
            $(this).parent().toggle();
        }
    });
    if (html.indexOf("Hide") > -1) {
        $("#btnHideOutOfStock").html(html.replace("Hide", "Show"));
    } else {
        $("#btnHideOutOfStock").html(html.replace("Show", "Hide"));
    }
}

// REMOVE WISHLIST ITEMS ALREADY REDEEMED ON TREMORGAMES
function removeRedeemed() {
    $("#UserWishlistItems tr:has([href*='showitem&itemid=']):contains(You already have this item)").each(function() {
        const itemid = $("[href*='showitem&itemid=']", this).attr("href").split("itemid=")[1];
        unsafeWindow.DeleteWishlistItem(itemid);
    });
    $("#btnRemoveRedeemed").text("Done!").prop("disabled", true);
}

// REMOVE WISHLIST ITEMS ALREADY OWNED ON STEAM
function removeOwned() {
    $("#UserWishlistItems tr:has([href*='showitem&itemid='])").each(function() {
        const itemid = $("[href*='showitem&itemid=']", this).attr("href").split("itemid=")[1];
        if (dTremor.rewards.hasOwnProperty(itemid) && (ownsSteamApp(dTremor.rewards[itemid].appid) || ownsSteamSub(dTremor.rewards[itemid].subid))) {
            unsafeWindow.DeleteWishlistItem(itemid);
        }
    });
    $("#btnRemoveOwned").text("Done!").prop("disabled", true);
}

// IMPORT WISHLIST ITEMS FROM STEAM
function importWishlist() {
    $("#btnImportWishlist").text("Importing...").prop("disabled", true);
    const wlObjs = Object.values(dTremor.rewards).filter(o => dSteam.rgWishlist.includes(o.appid));
    var ajaxDone = 0;
    wlObjs.forEach(o => {
        $.get("/achievements/ajax_addtowishlist.php?itemid=" + o.itemid, function() {
            ajaxDone++;
            if (ajaxDone === wlObjs.length) {
                $("#btnImportWishlist").text("Done!");
            }
        });
    });
}

// ALLOW JOINING MULTIPLE GIVEAWAYS AT ONCE
function addGiveawaysJoinButton() {
    var count = $(".cssbutton").length;
    if (count > 0) {
        var sum = $(".main_section_box .main_section_content > div:has(.cssbutton) b:contains(Entry Fee)").get().map(elem => parseInt(elem.innerText.split(" ")[3])).reduce((total, num) => total + num);
        $("form[name=myform]").after('<br><button class="cssbutton" style="width: 240px;" id="giveaway">Enter all ' + count + ' giveaways<br>(costs ' + sum + ' tremor coins)</button>');
        $("#giveaway").click(function() {
            $(".cssbutton:not(#giveaway)").each(function() {
                $.get(this.href, function() {
                    count--;
                    if (count === 0) location.reload();
                });
            });
        });
    }
}

// JOIN ALL GIVEAWAYS
function joinAllGiveaways() {
    if (readCookie("tguserid") == "723169" && bGiveaways) {
        $.get("/?action=viewgiveaways", function(data) {
            $(".cssbutton", data).each(function() {
                $.get($(this).attr("href"));
            });
        });
    }
}

// ADD UNSUBSCRIBE OPTIONS
function addUnsubscribe() {
    var listval = GM_getValue("blocklist");
    var blocklist = [];
    if (listval) {
        blocklist = blocklist.concat(JSON.parse(listval));
    }
    unsafeWindow.blocklist = blocklist;
    var hereTd = document.getElementsByTagName("table");
    var hereHref = hereTd[5].getElementsByTagName("a");
    for (var J = hereHref.length - 1; J >= 0; --J) {
        if (blocklist.indexOf(hereHref[J].text) >= 0) {
            $("tr:contains('" + hereHref[J].text + "')").remove();
        }
    }
    for (var k = 0; k < hereHref.length - 1; k++) {
        if (k % 2 === 0)
            $(hereHref[k]).before('<button class="myButton" value="X" id="tomate' + k + '">X</button>&nbsp &nbsp');
    }
    for (var l = 0; l <= 20; l += 2) {
        $("#tomate" + l).click(function() {
            blocklist = blocklist.concat(hereHref[l].text);
            GM_setValue("blocklist", JSON.stringify(blocklist));
            $("tr:contains('" + hereHref[l].text + "')").hide();
        });
    }
}

// ADD LAST PAGE LINK TO TREMORGAMES FORUMS
function addLastPage() {
    $(".grid tbody tr").each(function() {
        var href = $(this).find("a[href*='action=viewtopic&topicid']").attr("href") + "&page=4096";
        $(this).find("br+ a[href*='/profiles/']").append('<a href="' + href + '"> »</a>');
    });
}

// PUT LAST POST INTO USER VIEW
function scrollToLastPost() {
    var ids = $(".forumpost");
    location.hash = ids[ids.length - 1].id;
}

// ADD REPORT FUNCTION TO TOPICS AND MAKE TABLES SORTABLE
function addReportToTopic() {
    $("a:contains('Permalink')").each(function() {
        var postid = $(this).attr("href").split("postid=")[1].split("&")[0];
        $(this).after('<a style="margin-left: 15px;" href="javascript:reportPost(' + postid + ')">Report</a>');
    });
    $('div[style="border:2px solid #F7F7F7;margin-top:10px;"] table table').addClass("sortable");
    $.getScript("http://www.kryogenix.org/code/browser/sorttable/sorttable.js");
    $('div[style="border:2px solid #F7F7F7;margin-top:10px;"] table table thead').css("cursor", " pointer");
    unsafeWindow.reportPost = function(postid) {
        var offense = prompt("Offense:");
        if (offense === null) return;
        var username = $("#postid" + postid).parent().parent().find("td:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)").text();
        var username_link = $("#postid" + postid).parent().parent().find("td:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)").attr("href");
        var date = $("#postid" + postid).parent().parent().find("td:nth-child(1) > div:nth-child(1)").text();
        var postid_link = "/?action=viewpost&postid=" + postid;
        var commenttext = "**NAME**: [" + username + "](" + username_link + ")\n**DATE**: " + date + "\n**OFFENSE**: " + offense + "\n**POST**: [PostID " + postid + "](" + postid_link + ")";
        $.post("/ajax_addforum_post.php?topicid=76178", {
            message: commenttext
        }, function(data) {
            var obj = JSON.parse(data);
            if (obj.status == 1) {
                alert("Successfully reported this post!");
            } else {
                alert(obj.message);
            }
        });
    };
}

// ADD REPORT FUNCTION TO CHAT
function addReportToChat() {
    $("#main_chat > div").each(function() {
        var username = $("div:nth-child(2) > a", this).text();
        var username_link = $("div:nth-child(2) > a", this).attr("href");
        var chat_log = $("div:nth-child(2)", this).text().split(": ")[1];
        var time = $("div:nth-child(3)", this).text();
        $(this).append('<a style="border: 0px solid black; float: right; width: 50px; color: grey;" href="javascript:reportChat(\'' + username + '\', \'' + username_link + '\', \'' + chat_log + '\', \'' + time + '\')">Report</a>');
    });
    unsafeWindow.reportChat = reportChat;
}

// REPORT CHAT MESSAGE
function reportChat(username, username_link, chat_log, time) {
    var offense = prompt("Offense (please provide screenshots):");
    if (offense === null) return;
    var date = getToday() + " " + time;
    var commenttext = "**NAME**: [" + username + "](" + username_link + ")\n**DATE**: " + date + "\n**OFFENSE**: " + offense + " @ [Chat](" + domain + "?action=chat)\n\n> Original Chat Log from " + username + "\n\n> " + chat_log;
    $.post("/ajax_addforum_post.php?topicid=76178", {
        message: commenttext
    }, function(data) {
        var obj = JSON.parse(data);
        if (obj.status == 1) {
            alert("Successfully reported this chat message!");
        } else {
            alert(obj.message);
        }
    });
}

// ADD TRADING CARDS LIST TO TREMOR REWARDS SHOP
function addTradingCardsList() {
    $(".main_section_box").html($(".main_section_box").html().replace("Invalid Browse Mode", ""));
    $(".main_section_box").append('<div class="forumpost display_emo"><div style="margin-left: 7px;">Source: From <u><a href="/?action=viewtopic&topicid=68018">Games on Tremor Games with Cards: The complete list</a></u>' +
                                  ', by <u><a href="' + domain + 'profiles/105570/snipah.html">snipah</a></u>.</div><table style="margin-left: 7px;" id="tc_contents"></table></div>');
    $("#frm_shop_srch > div > div").remove();
    $.get("/?action=viewtopic&topicid=68018", function(data) {
        $("#tc_contents").append($('div[style="border:2px solid #F7F7F7;margin-top:10px;"] table table thead', data).first());
        $("#tc_contents").append('<tbody />');
        $("#tc_contents tbody").append($('div[style="border:2px solid #F7F7F7;margin-top:10px;"] table table tbody tr', data));
        $("#tc_contents tbody").html($("#tc_contents tbody").html());
        $("#tc_contents").addClass("sortable");
        $("#tc_contents thead").css("cursor", "pointer");
        setTimeout(function() {
            $.getScript("http://www.kryogenix.org/code/browser/sorttable/sorttable.js");
        }, 1500);
    });
}

// ADD ENHANCED TEXT EDITOR TO TOPIC
function enhanceTextEditor() {
    commentArea = $("#newcomment")[0];
    $(commentArea).before('<center><img src="' + btnBold +
                          '" id="boldIco"></img><img src="' + btnItalic +
                          '" id="itaIco"></img><img src="' + btnHeader2 +
                          '" id="h1Ico"></img><img src="' + btnHeader3 +
                          '" id="h2Ico"></img><img src="' + btnCode +
                          '" id="codeIco"><img src="' + btnList +
                          '" id="listIco"><img src="' + btnHr +
                          '" id="hrIco"></img><img src="' + btnLink +
                          '" id="linkIco"></img><img src="' + btnImage +
                          '" id="imgIco"></img><img src="' + btnTable +
                          '" id="tableIco"></img></center>');
    $("#boldIco").click(function() {
        addTag("**", "**");
    });
    $("#itaIco").click(function() {
        addTag("*", "*");
    });
    $("#h1Ico").click(function() {
        addTag("#", "");
    });
    $("#h2Ico").click(function() {
        addTag("####", "");
    });
    $("#listIco").click(function() {
        addTag("* ", "");
    });
    $("#codeIco").click(function() {
        addTag("`", "`");
    });
    $("#hrIco").click(function() {
        var sel_txt = commentArea.value.substring(commentArea.selectionStart, commentArea.selectionEnd);
        if (sel_txt === "")
            commentArea.value = commentArea.value.substring(0, commentArea.selectionStart) + "___" + commentArea.value.substring(commentArea.selectionEnd, commentArea.value.length);
        commentArea.focus();
    });
    $("#linkIco").click(function() {
        generateCode(false);
    });

    $("#imgIco").click(function() {
        generateCode(true);
    });

    $("#tableIco").click(function() {
        if ($("#tableeditor").length > 0) {
            alert("Cancel the current table first");
            return;
        }
        var c = prompt("Column quantity: ", "");
        var r = prompt("Row quantity: ", "");
        generateTableEditor(c, r);
    });
}

function addTag(prefix, suffix) {
    var sel_txt = commentArea.value.substring(commentArea.selectionStart, commentArea.selectionEnd);
    var replace;
    if (sel_txt !== "") {
        if (prefix == "* ") {
            var lines = sel_txt.split("\n");
            sel_txt = "";
            for (var i = 0; i < lines.length; i++) {
                lines[i] = "* " + lines[i] + "\n";
                sel_txt += lines[i];
            }
            replace = sel_txt;
        } else {
            replace = prefix + sel_txt + suffix;
            if (/\s+$/.test(sel_txt))
                replace = prefix + sel_txt.slice(0, -1) + suffix + " ";
        }
        commentArea.value = commentArea.value.substring(0, commentArea.selectionStart) + replace + commentArea.value.substring(commentArea.selectionEnd, commentArea.value.length);
    }
    commentArea.focus();
}

function generateCode(isImage) {
    var sel_txt = commentArea.value.substring(commentArea.selectionStart, commentArea.selectionEnd);
    var url = prompt("Enter the URL: ", "");
    var txt;
    if (!url)
        return;
    if (sel_txt === "")
        txt = prompt("Enter a text: ", "");
    var b = "[";
    if (isImage)
        b = "![";
    if (sel_txt === "")
        commentArea.value = commentArea.value.substring(0, commentArea.selectionStart) + b + txt + "](" + url + ")" + commentArea.value.substring(commentArea.selectionEnd, commentArea.value.length);
    else
        commentArea.value = commentArea.value.substring(0, commentArea.selectionStart) + b + sel_txt + "](" + url + ")" + commentArea.value.substring(commentArea.selectionEnd, commentArea.value.length);
    commentArea.focus();
}

function generateTableEditor(cols, rows) {
    var tableEditor = $('<center><table id="tableeditor"><tbody>');
    for (var r = 0; r < rows; r++) {
        var tr = $('<tr>');
        for (var c = 0; c < cols; c++)
            if (r === 0)
                $('<td><span class="commentTable" style="width: 100px; height: 20px; display: inline-block; border: 1px solid black; overflow: hidden; background-color: lightgreen;" contenteditable></span></td>').appendTo(tr);
            else
                $('<td><span class="commentTable" style="width: 100px; height: 20px; display: inline-block; border: 1px solid black; overflow: hidden;" contenteditable></span></td>').appendTo(tr);
        tr.appendTo(tableEditor);
    }
    $(commentArea).after(tableEditor);
    $(tableEditor).after('<br><center><p id="createtable" style="cursor: pointer; width: 100px; color: red; text-decoration: underline;">Add Table</p><br><p id="canceltable" style="cursor: pointer; width: 100px; color: red; text-decoration: underline;">Cancel</p></center></center>');
    $("#createtable").click(function() {
        createTable(cols, rows);
    });
    $("#canceltable").click(function() {
        $(tableEditor).remove();
        $(createtable).remove();
        $(canceltable).remove();

    });
}

// CREATE A TABLE IN THE RIGHT FORMATTING
function createTable(cols, rows) {
    var codeTable = "";
    var tableEditor = document.getElementsByClassName("commentTable");
    var f = 0;
    for (var i = 0; i < rows; i++) {
        codeTable += "\n";
        if (i == 1) {
            var headerLine = "";
            for (var k = 0; k < cols; k++) {
                headerLine += "------------- |";
            }
            codeTable += headerLine + "\n";
        }
        f = i * (cols - 1);
        for (var j = 0; j < cols; j++) {
            codeTable += tableEditor[i + j + f].innerHTML + " | ";
        }
    }
    var sel_txt = commentArea.value.substring(commentArea.selectionStart, commentArea.selectionEnd);
    if (sel_txt === "") commentArea.value = commentArea.value.substring(0, commentArea.selectionStart) + codeTable + commentArea.value.substring(commentArea.selectionEnd, commentArea.value.length);
    commentArea.focus();
}

// ADD MULTIQUOTE FEATURE TO TOPIC
function addMultiQuote() {
    $("a:contains('Quote')").each(function() {
        var multiquote = $(this).clone();
        $(multiquote).removeAttr("style").attr("href", $(multiquote).attr("href").replace("QuotePost", "MultiQuotePost")).text(" +");
        $(multiquote).appendTo($(this));
    });
    unsafeWindow.MultiQuotePost = function(id) {
        $.get("/json_get_post_for_edit.php?postid=" + id, function(data) {
            var obj = JSON.parse(data);
            if (obj.Status == 1) {
                msgarray = obj.Message.split("\n");
                for (i = 0; i < msgarray.length; i++) {
                    msgarray[i].replace(/^\s+/, "");
                    msgarray[i] = "> " + msgarray[i];
                }
                obj.Message = "";
                for (i = 0; i < msgarray.length; i++) {
                    if (msgarray[i].length > 0)
                        obj.Message = obj.Message + msgarray[i] + "\n";
                }
                obj.Message.replace(/>/g, ">>");
                quote = "> Originally posted by " + obj.username;
                quote = quote + "\n\n" + obj.Message;
                quote = quote + "\n\n";
                document.getElementById("newcomment").value += quote + "#####\n";
                if ($("#floatingQuotes").length === 0) {
                    $("body").prepend('<div id="floatingQuotes" style="z-index: 100000; position: fixed; right: 0px; top: 0px; padding-right: 10px; padding-left: 10px; background: white; border: 1px solid rgb(221, 221, 221);"><h4>QUOTING<br>' + obj.username + '<br></h4></div>');
                    setTimeout(function() {
                        $("#floatingQuotes").remove();
                    }, 1000);
                }
            } else {
                alert(obj.Message);
            }

        });
    };
}

// SHOW STATS
function showStats() {
    if (location.href.indexOf("action=points" > -1) && $(".main_section_headers").length > 0) {
        var statshtml = '<div id="stats"><div class="main_section_headers"><center>Statistics</center></div><div class="main_section_content">';
        statshtml += '<div style="text-align: center;"><div class="pagination1"><span>Last updated: ' + getStatsLastUpdated() + '</span><a id="updateStatsBtn" href="#">Update</a><a id="resetStatsBtn" href="#">Reset</a></div></div>';
        statshtml += '<table class="grid" width="100%"><thead><tr><td width="150">Statistic</td><td>Date</td><td>Description</td><td>Points</td><td>Coins</td><td>Balance</td></tr></thead><tbody>';
        statshtml += buildStatsRow("Sums of all points, coins and balances", getSums());
        statshtml += buildStatsRow("Averages of all points, coins and balances", getAverages());
        statshtml += buildStatsRow("Max balance ever", getBalanceMax());
        statshtml += buildStatsRow("Max coins gained at once", getCoinsMax());
        statshtml += buildStatsRow("Max coins gained at once (excl refunds)", getCoinsMaxNoRefund());
        statshtml += buildStatsRow("Min coins lost at once", getCoinsMin());
        statshtml += buildStatsRow("Min coins lost at once (excl purchase)", getCoinsMinNoPurchase());
        statshtml += '</tbody></table></div></div><hr>';
        $("#stats").remove();
        $(".main_section_headers").before(statshtml);
        $("#updateStatsBtn").click(updateStats);
        $("#resetStatsBtn").click(resetStats);
    }
}

// REMOVE STATS ON EARNINGS
function resetStats() {
    if (confirm("Are you sure you want to reset all statistical data on your earnings?")) {
        localStorage.removeItem("statsjson");
        location.reload();
    }
}

// UPDATE STATS ON EARNINGS
function updateStats() {
    if (location.href.indexOf("action=points" > -1) && $("#updateStatsBtn").length > 0) {
        $("#updateStatsBtn").text("Updating...");
        var uid;
        var json = localStorage.getItem("statsjson") ? JSON.parse(localStorage.getItem("statsjson")) : {};
        var lastpage = $("span:contains(' Pages of ')").text().split(" ").pop();
        var pageschecked = 0;
        if (json.pageschecked) {
            pageschecked = json.pageschecked;
        } else {
            json.pageschecked = pageschecked;
        }
        if (json.uid) {
            uid = json.uid;
        } else {
            uid = $(".wbox_topleft a").attr("href").split("/")[4];
            json.uid = uid;
        }
        if (!json.data) {
            json.data = [];
        }
        for (var page = 1; page <= lastpage - pageschecked; page++) {
            $.get("/?action=points&userid=" + uid + "&page=" + page, function(data) {
                data = data.replace(/<img\b[^>]*>/ig, "");
                $(".grid tbody tr", data).each(function() {
                    const description = $(this).find("td:nth-child(2)").text();
                    const points = parseInt($(this).find("td:nth-child(3)").text());
                    const coins = parseInt($(this).find("td:nth-child(4)").text());
                    const balance = parseInt($(this).find("td:nth-child(5)").text());
                    const datetime = $(this).find("td:nth-child(1)").text();
                    const date = datetime.split(" ").slice(0, -2).join(" ");
                    const time = datetime.split(" ").slice(-2).join(" ");
                    var item = {};
                    item.date = date;
                    item.time = time;
                    item.description = description;
                    item.points = points;
                    item.coins = coins;
                    item.balance = balance;
                    json.data.push(item);
                });
                json.lastupdated = getToday() + " " + getTime();
                localStorage.setItem("statsjson", JSON.stringify(json));
            }).always(function() {
                json.pageschecked++;
                if (json.pageschecked == lastpage) {
                    setTimeout(function() {
                        console.log(json);
                        showStats();
                    }, 2000);
                }
            });
        }
    }
}

// GET WHEN STATS WERE LAST UPDATED
function getStatsLastUpdated() {
    return localStorage.getItem("statsjson") && JSON.parse(localStorage.getItem("statsjson")).lastupdated ? JSON.parse(localStorage.getItem("statsjson")).lastupdated : "Never";
}

// BUILD ROW FROM OBJECT FOR STATISTICS TABLE
function buildStatsRow(stat, obj) {
    console.log(stat, obj);
    return '<tr><td width="150">' + (stat ? stat : "") +
        '</td><td><small>' + (obj && obj.date ? obj.date : "") + " " + (obj && obj.time ? obj.time : "") +
        '</small></td><td>' + (obj && obj.description ? obj.description : "") +
        '</td><td>' + (obj && obj.points.toString() ? obj.points.toString() : "") +
        '</td><td>' + (obj && obj.coins.toString() ? obj.coins.toString() : "") +
        '</td><td>' + (obj && obj.balance.toString() ? obj.balance.toString() : "") +
        '</td></tr>';
}

// GET BALANCE EVER
function getBalanceMax() {
    var json = JSON.parse(localStorage.getItem("statsjson"));
    if (!json) return null;
    var max = Math.max.apply(Math, json.data.map(function(o) {
        return o.balance;
    }));
    return json.data.filter(function(o) {
        return o.balance == max;
    })[0];
}

// GET MAX COINS EARNING
function getCoinsMax() {
    var json = JSON.parse(localStorage.getItem("statsjson"));
    if (!json) return null;
    var max = Math.max.apply(Math, json.data.map(function(o) {
        return o.coins;
    }));
    return json.data.filter(function(o) {
        return o.coins == max;
    })[0];
}

// GET MAX COINS EARNING (NO REFUND)
function getCoinsMaxNoRefund() {
    var json = JSON.parse(localStorage.getItem("statsjson"));
    if (!json) return null;
    var max = Math.max.apply(Math, json.data.map(function(o) {
        return o.description.indexOf("Refund") == -1 ? o.coins : 0;
    }));
    return json.data.filter(function(o) {
        return o.coins == max;
    })[0];
}

// GET MIN COINS EARNING
function getCoinsMin() {
    var json = JSON.parse(localStorage.getItem("statsjson"));
    if (!json) return null;
    var min = Math.min.apply(Math, json.data.map(function(o) {
        return o.coins;
    }));
    return json.data.filter(function(o) {
        return o.coins == min;
    })[0];
}

// GET MIN COINS EARNING (NO PURCHASE)
function getCoinsMinNoPurchase() {
    var json = JSON.parse(localStorage.getItem("statsjson"));
    if (!json) return null;
    var min = Math.min.apply(Math, json.data.map(function(o) {
        return o.description.indexOf("Bought Item") == -1 ? o.coins : 0;
    }));
    return json.data.filter(function(o) {
        return o.coins == min;
    })[0];
}

// GET AVERAGES
function getAverages() {
    var json = JSON.parse(localStorage.getItem("statsjson"));
    if (!json) return null;
    var pointsavg = parseInt(json.data.map(function(o) {
        return o.points;
    }).reduce(function(p, c, i) {
        return p + (c - p) / (i + 1);
    }, 0));
    var coinsavg = parseInt(json.data.map(function(o) {
        return o.coins;
    }).reduce(function(p, c, i) {
        return p + (c - p) / (i + 1);
    }, 0));
    var balavg = parseInt(json.data.map(function(o) {
        return o.balance;
    }).reduce(function(p, c, i) {
        return p + (c - p) / (i + 1);
    }, 0));
    return {
        points: pointsavg,
        coins: coinsavg,
        balance: balavg
    };
}

// GET SUMS
function getSums() {
    var json = JSON.parse(localStorage.getItem("statsjson"));
    if (!json) return null;
    var pointssum = json.data.map(function(o) {
        return o.points;
    }).reduce(function(a, b) {
        return a + b;
    });
    var coinssum = json.data.map(function(o) {
        return o.coins;
    }).reduce(function(a, b) {
        return a + b;
    });
    var balsum = json.data.map(function(o) {
        return o.balance;
    }).reduce(function(a, b) {
        return a + b;
    });
    return {
        points: pointssum,
        coins: coinssum,
        balance: balsum
    };
}

// GET DAILY REFERRAL EARNINGS
function getDailyReferral() {
    var json = JSON.parse(localStorage.getItem("statsjson"));
    var groups = {};
    json.data.forEach(function(item) {
        var date = new Date(item.date);
        var key = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        //console.log(item.date + " ==> " + date + " ==> " + key);
        if (groups[key] && item.description == "Earnings from Referral") {
            groups[key] += item.coins;
        } else if (item.description == "Earnings from Referral") {
            groups[key] = item.coins;
        }
    });
    return groups;
}

// IS THE OBJECT EMPTY ( = {})
function isObjEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// IS THE STEAM DATA VALID
function isValidSteamData(obj) {
    return typeof obj === "object" &&
        !isObjEmpty(obj) &&
        obj.hasOwnProperty("rgWishlist") &&
        obj.hasOwnProperty("rgOwnedPackages") &&
        obj.hasOwnProperty("rgOwnedApps") &&
        obj.rgWishlist.length > 0 &&
        obj.rgOwnedPackages.length > 0 &&
        obj.rgOwnedApps.length > 0;
}

// IS APP OWNED ON STEAM
function ownsSteamApp(appid) {
    return !isNaN(parseInt(appid)) && dSteam.rgOwnedApps.includes(parseInt(appid));
}

// IS SUB OWNED ON STEAM
function ownsSteamSub(subid) {
    return !isNaN(parseInt(subid)) && dSteam.rgOwnedPackages.includes(parseInt(subid));
}

initETG();
