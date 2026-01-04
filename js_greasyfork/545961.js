// ==UserScript==
// @name        Torn-JS-Helpers
// @version     2.47.6
// @namespace   https://github.com/edlau2
// @description Commonly used functions in my Torn scripts.
// @author      xedx [2100735]
// @connect     api.torn.com
// @connect     www.tornstats.com
// @exclude     *
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @license     MIT
// ==/UserScript==

// Until I figure out how to grab the metadata from this lib,
// it's not available via GM_info, this should be the same as
// the @version above
const thisLibVer = "2.47.3";

/*eslint no-unused-vars: 0*/
/*eslint no-undef: 0*/
/*eslint curly: 0*/
/*eslint no-multi-spaces: 0*/

//
// This check is designed to be run before abosuletly everything else in my scripts that
// load my helper library, which is 90% of them. This ensures they abort and will
// not execute when on the attacking page, to make loading as fast as possible.
//
// The 'require' of 'abort' script in the header didn't seem to work...
//
// Enable this when I feel ready with it, disabled (and not uploaded) for now...
//
const abortOnAttackPage = false;
const onAttackPage = function () { return location.search.startsWith("?sid=attack");}
if (abortOnAttackPage) {
    console.log(GM_info.script.name + " attack page check, match: ", location.search);
    if (location.search.startsWith("?sid=attack")) {
        console.log(GM_info.script.name + ' on page ' + location.href + " --- ABORTING!");
        //throw new Error(GM_info.script.name + " attack cheack, intentional abort, on attack page!");
    }
}

///////////////////////////////////////////////////////////////////////////////////
// Debugging, error handling (more later on...)
///////////////////////////////////////////////////////////////////////////////////

var debugLoggingEnabled = false;
var loggingEnabled = true;
var alertOnRetry = false;
var alertOnError = false;
var Torn_JS_Helpers_Installed = true;
var xedxDevMode = GM_getValue("xedxDevMode", false);

// I haven't tested this yet, is meant
// for systems (such as Greasemonkey) that don't
// have GM_setValue/GM_getValue - have the dot versions
//if (GM) {
//    window.GM_getValue = GM.getValue;
//    window.GM_setValue = GM.setValue;
//}

alertOnError = GM_getValue("alertOnError", alertOnError);
alertOnRetry = GM_getValue("alertOnRetry", alertOnRetry);

GM_setValue("alertOnError", alertOnError);
GM_setValue("alertOnRetry", alertOnRetry);

///////////////////////////////////////////////////////////////////////////////////
// Validate an API key and prompt if misssing
///////////////////////////////////////////////////////////////////////////////////

var api_key = GM_getValue('gm_api_key');
var lastValidated = GM_getValue("lastValidated", 0);
const validGoodForMin = 60;
const critErrs = [1,2,8,13,18];

async function validateApiKey(type = null, optText=null) {
    let text = GM_info.script.name + "Says:\n\nPlease enter your API key.\n" +
        "Your key will be saved locally so you won't have to be asked again.\n" +
        "Your key is kept private and not shared with anyone.";
    if (type == 'FULL')
        text += '\n\nA full access key is required!';
    else
        text += '\n\nOnly limited access is required';

    if (optText) {
        text += '\n\n' + optText;
    }

    if (api_key == null || api_key == 'undefined' || typeof api_key === 'undefined' || api_key == '') {
        api_key = prompt(text, "");
        GM_setValue('gm_api_key', api_key);
    } else {
        //let now = new Date().getTime();
        //if (now - lastValidated > validGoodForMin * 60 * 1000)
        //    getTimeToValidateKey();
    }

    if (type == 'FULL') {

    }
}

function getTimeToValidateKey() {
    let url = `https://api.torn.com/v2/torn/timestamp?key=${api_key}`;
    $.ajax({
        url: url,
        type: 'GET',
        success: function (response, status, xhr) {
            if (response.error && critErrs.includes(+response.error.code)) {
                console.error("[getTimeToValidateKey] Error in ajax lookup: ", response.error.code, response.error.error);
                api_key = '';
                let msg = GM_info.script.name + `: API key validation failed!\n\nThe server returned: ` +
                           `code ${response.error.code}, error ${response.error.error}.\n\n` +
                           `Please enter a valid API key.\n\n` +
                           `Your key will be saved locally so you won't have to be asked again.\n` +
                           `Your key is kept private and not shared with anyone.`;
                api_key = prompt(msg, "");
                GM_setValue('gm_api_key', api_key);
                return;
            } else if (response.error) {
                console.error("[getTimeToValidateKey] Error in ajax lookup: ", response.error.code, response.error.error);
            } else {
                debug("[getTimeToValidateKey] Got server time successfully: ", response);
            }
            //lastValidated = new Date().getTime();
            //GM_setValue("lastValidated", lastValidated);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("[getTimeToValidateKey] Error in ajax lookup: ", textStatus);
            console.error("[getTimeToValidateKey] Error thrown: ", errorThrown);
        }
    });
}

function getApiKey() {
    return api_key;
}

function getPlayerId() {
    let user = JSON.parse($("#torn-user").val());
    return user.id;
}

function getPlayerName() {
    let user = JSON.parse($("#torn-user").val());
    return user.playername;
}

function getPlayerFullName() {
    return getPlayerName() + ' [' + getPlayerId() + ']';
}

// When the node identified by 'sel' is available, call 'callback'
// See also: callWhenElementExists(selector, callback, freq=250, max=20)
// Similar, but diff callback signature.
//
// If 'attempts' is null, try forever
// 'interval' is when to try again, ms. If null, 250
// 'callback' will be called with node when present, or empty node if times out.
// Hence callback signature: callback(targetNode) { }
function callWhenReady(callback, sel, interval, attempts) {
    let node = $(sel);
    if ($(node).length) { callback($(node)); return; }
    let params = {cb: callback, sel: sel, i: interval, max: attempts, retries: 0};
    doRetries(params);

    function doRetries(params) {
        let node = $(params.sel);
        if ($(node).length) { params.cb($(node)); return; }

        params.retries++;
        if (params.max && params.retries > params.max) { params.cb($(node)); return; }
        setTimeout(doRetries, (params.i ? params.i : 250), params);
    }
}

///////////////////////////////////////////////////////////////////////////////////
// Get the user's ID. Two methods, API and DOM
// Use 'getPlayerId()' instead!
///////////////////////////////////////////////////////////////////////////////////

function getThisUserId() {
    let thisUserId = GM_getValue("thisUserId", undefined);
    if (!thisUserId) {
        let tmp = $("#torn-user").val();
        if (!tmp) return;
        let jsonObj = JSON.parse(tmp);
        thisUserId = jsonObj.id;
        GM_setValue("thisUserId", thisUserId);
    }
    return thisUserId;
}

function queryUserId(callback, retries=0) {
    xedx_TornUserQuery(null, 'basic', function(responseText, id, callback) {
        let jsonResp = JSON.parse(responseText);
        if (jsonResp.error) {
            if (jsonResp.error.code == 17) {
                if (retries++ < 5) {
                    if (alertOnRetry) alert("Retrying error 17!");
                    return queryUserId(callback, retries);
                } else {
                    return handleError(responseText);
                }
            } else { // != 17
                return handleError(responseText);
            }
        }
        try {
            return callback(jsonResp.player_id);
        } catch (e) {
            debugger;
        }
    }, callback);
}

// Get status of users, online, offline, idle...
// expects an array of user IDs:
// userIds = [1234, 5678, ....];
// callback sig: myCallback(jsonData)
// jsonData, for example: {1446944: 'offline', 2100735: 'online', 2603798: 'offline'}
function getStatusForUserArray(userIds, callback, options) {
    const statusURL = "https://www.torn.com/chat/online-status";
    var reqCb = callback;
    function localCb(response, status, xhr) {
        if (reqCb) reqCb(response, options);
    }

    function doPost(URL, postData, optCallback) {
        $.ajax({url: URL, type: 'POST', data: postData,
            processData: false,
            success: optCallback ? optCallback : processJSONPostResponse,
            error: function(err){console.error("ajax error: ", err);}
        });
    }

    let err;
    if (!userIds || !userIds.length) err = "Missing userIDs!";
    if (!err) if (!Array.isArray(userIds)) err = "userIds must be an array!";
    if (!err) if (!callback) err = "Must provide a callback!"
    if (err) {console.error(err); return err;}

    let reqData = '{"userIds":[';
    for (let idx=0; idx<userIds.length; idx++)
        reqData = reqData + (idx==0 ? '"' : ',"') + userIds[idx] + '"';
    reqData = reqData + ']}';
    doPost(statusURL, reqData, localCb);
}

// This is used so that any one of my scripts can tell if another
// one is running.
function registerWithScriptDb() {
    const dbDiv = "<div id='xedx-loaded-scripts' style='display: none;opacity: 0;'><ul></ul></div>";
    const thisScriptLi = "<li data-name='" + GM_info.script.name +
          "' data-ver='" + GM_info.script.version + "'></li>";

    // Fix with just JS, for now, don't crash
    if (typeof $ != 'function') return;
    if (!$("#xedx-loaded-scripts").length) $("body").after(dbDiv);
    $("#xedx-loaded-scripts > ul").append(thisScriptLi);
}

function logScriptDb() {
    let registeredScripts = $("#xedx-loaded-scripts > ul > li");
    if ($(registeredScripts).length > 0)
        console.log("Registered scripts:");
    else
        console.log("No registered scripts!");
    for (let idx=0; idx < $(registeredScripts).length; idx++) {
        console.log("    Name: ", $($(registeredScripts)[idx]).attr('name'),
                    " Version: ", $($(registeredScripts)[idx]).attr('version'));
    }
}

///////////////////////////////////////////////////////////////////////////////////
// Miscellaneous utilities
///////////////////////////////////////////////////////////////////////////////////

// Just spit out the name of the script at startup
const logScriptStart = function (register=true) {
    console.log(GM_info.script.name + ' version ' +
        GM_info.script.version + ' script started, library version ' + thisLibVer);
    if (register == true) callOnContentLoaded(registerWithScriptDb);
}

// See if cloudflare is challenging - do I have to wait for page load?
function checkCloudFlare(clickIt) {
    //if ($("#challenge-form").length > 0) {
    let active = false;
    if (document.querySelector("#challenge-form")) {
        active = true;
    } else if (location.href.indexOf('recaptcha') > -1) {
        active = true;
    } else if (document.querySelector(".iAmUnderAttack")) {
        active = true;
    } else {
        console.log(GM_info.script.name + " no active Cloudflare challenge detected.");
    }
    if (active == true) {
        console.log(GM_info.script.name + " Cloudflare challenge active!");
        return true;
    }
    return false;
}

function enableDebugLogging(enable=true) {
    debugLoggingEnabled = enable;
}

// non-blocking (async) delay, use with 'await' in an async function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const toggleClass = function(sel, classA, classB) {
    if ($(sel).hasClass(classA)) {$(sel).removeClass(classA).addClass(classB);} else {$(sel).removeClass(classB).addClass(classA);}}

// Call the callback once page content loaded (readystate is still interactive)
function callOnContentLoaded(callback) {
    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// Call the callback once page content loading is complete (readystate is complete)
function callOnContentComplete(callback) {
    if (document.readyState == 'complete') {
        callback();
    } else {
        document.addEventListener('readystatechange',
                                  event => {if (document.readyState == 'complete') callback();});
    }
}

// Be notified if visibility changes (change tabs, for example)
// Callback sig: cllbackFn(visible) {} // 'visible' is true if getting focus
function callOnVisibilityChange(callback) {
    document.addEventListener("visibilitychange", function() {
      if (document.visibilityState === 'visible') {
        callback(true);
      } else {
        callback(false);
      }
    });
}

// Notify when an element exits, via polling. If possible,
// use callWhenElementExistsEx(...) instead
//
// Callback signature: callback(success, element, selector, retries)
// Success is true if found, false if timed out
// Of course you could call again from the callback....
// Freq is how often to check for element, ms
// max is max attempts, defaults are 5 seconds total.
//
function callWhenElementExists(selector, callback, freq=250, max=20) {

    if (!selector || !callback) return console.error("Invalid function params!");
    if ($(selector).length) {callback(true, $(selector), selector, 0); return;}
    findElement({sel: selector, cb: callback, timeout: freq, maxRetries: max});

    function findElement(options, retries=0) {
        if (xedxDevMode == true) log("findElement: ", retries);
        let target = $(options.sel);
        if (!$(target).length) {
            if (retries++ < options.maxRetries) return setTimeout(findElement, options.timeout, options, retries);
            options.cb(false, null, options.sel, retries);
        } else {
            options.cb(true, $(target), options.sel, retries);
        }
    }
}

// Mutation observer method, used if you have a parent to observe
// callback sig: callback(node)
function callWhenElementExistsEx(closestRoot, selector, callback) {
    if (!$(closestRoot).length) {
        console.error("ERROR: observer root does not exist: ", $(closestRoot));
        if ($(selector).length > 0)
            callback($(selector));
        return;
    }

    if ($(selector).length > 0) {
        callback($(selector));
        return;
    }

    const context = { sel: selector, cb: callback, found: false };
    const observer = new MutationObserver((mutations, observer) => {
       localMutationCb(mutations, observer, context)
    });

    observer.observe($(closestRoot)[0], { attributes: false, childList: true, subtree: true });

    function localMutationCb(mutations, observer, context) {
        if ($(context.sel).length > 0) {
            observer.disconnect();
            context.cb($(context.sel));
        }
    }
}

// Install an event listener for hash change notifications
function callOnHashChange(callback) {
    return installHashChangeHandler(callback);
}

function installHashChangeHandler(callback) {
    window.addEventListener('hashchange', function() {
        log('The hash has changed! new hash: ' + location.hash);
        callback();}, false);
}

// ==================== PushState handler installation ==================
const bindEventListener = function (type) {
    const historyEvent = history[type];
    return function () {
        const newEvent = historyEvent.apply(this, arguments);
        const e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return newEvent;
    };
};

function installPushStateHandler(pushStateChangedHandler) {
    history.pushState = bindEventListener("pushState");
    window.addEventListener("pushState", function (e) {
        pushStateChangedHandler(e);
    });
}
// ============= Display an alert that can time out ==============

async function alertWithTimeout(mainMsg, timeoutSecs, btnMsg) {
    addAlertStyles();
    addAlertDiv();

    $("#xalert .mainMsg").text(mainMsg);
    if (btnMsg) $("#xalert button").text(btnMsg);
    return await openModelessAlert(timeoutSecs);

    async function openModelessAlert(timeoutSecs) {
        $("#xalert").css("display", "block");
        if (timeoutSecs) setTimeout(function() {$("#xalert").remove();}, timeoutSecs*1000);
        return new Promise(resolve => {
            $("#xalert-ok-btn").on('click', (e) => {resolve($("#xalert").remove())});
        });
    }

     var alertStylesAdded = false;
     function addAlertDiv() {
         if ($("#xalert").length > 0) return;
         let newDiv = `
             <div id="xalert"><div class="alert-content">
                 <p class='mainMsg'></p>
                 <span class="xbtn-wrap"><button id="xalert-ok-btn" class="xedx-torn-btn" data-ret="true">OK</button></span>
             </div></div>`;
         $("body").append(newDiv);
     }
     function addAlertStyles() {
         if (alertStylesAdded) return;
         GM_addStyle(`
             #xalert {
                 display: none;
                 position: fixed;
                 top: 50%;
                 left: 50%;
                 width: 300px;
                 /* height: 150px; */
                 transform: translate(-50%, -50%);
                 background-color: var(--default-white-color);
                 padding: 20px 20px 0px 20px;
                 border-radius: 10px;
                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                 color: var(--default-black-color);
                 font-size: 14px;
                 font-family: arial;
                 z-index: 9999999;
            }
            #xalert button {
                 margin: 10px 25px 10px 25px;
            }
            .mainMsg {
                 padding: 20px 0px 20px 0px;
                 font-size: 16px;
                 white-space: pre-line;
            }
            .alert-content {
                 position: relative;
                 display: flex;
                 flex-flow: column wrap;
                 align-content: center;
                 height: 100%;
            }
            .xbtn-wrap {
                 display: flex;
                 flex-flow: row wrap;
                 justify-content: center;
                 /* position: absolute; */
                 width: 100%;
                 align-content: center;
                 /* bottom: 10%;
                 left: 50%;
                 transform: translate(-50%); */
            }
        `);
    alertStylesAdded = true;
    }
}

// ========================================================================

// Store latest version info and notify if updated.
var silentUpdates = false;
function versionCheck(silent=false) {
    let curr_ver = GM_getValue('curr_ver', GM_info.script.version);
    if (Number(GM_info.script.version) > Number(curr_ver)) {
        let msg = 'Your version of ' + GM_info.script.name + ' has been updated to version ' + GM_info.script.version +
            ' ! Press OK to continue.';
        if (!silentUpdates && !silent) {alertWithTimeout(msg, 10);}
        console.log(msg);
    }
    GM_setValue('curr_ver', GM_info.script.version);
}

// Simple logging helpers. Log regular events or debug-only events.
// Set these two vars as appropriate in your script.
function timeNow() {
    let now = new Date().getTime();
    let date = new Date(now);
    let  timestr = date.toLocaleTimeString();
    return timestr;
}

function log(...data) {
    if (loggingEnabled) {
        console.log(GM_info.script.name + ': ', ...data);
    }
}

function logtTime() {
    let now = new Date().getTime();
    let ms = now % 1000;
    let sec = parseInt(now/1000);  // Only need at most last 3 digits
    let smSec = sec % 60;

    //let min = parseInt(sec / 60);

    return smSec + "." + ms;
}

function logt(...data) {
    if (loggingEnabled) {
        console.log(logtTime() + " " + GM_info.script.name + ': ', ...data);
    }
}

function debug(...data) {
    if (debugLoggingEnabled) {
        console.log(GM_info.script.name + ': ', ...data);
    }
}

/////////////////////////////////////////////////////////
// Functions to see if on a given page
/////////////////////////////////////////////////////////

function isIndexPage() {return (location.href.indexOf("index.php") > -1)}
function isItemPage() {return (location.href.indexOf("item.php") > -1)}
function isFactionPage() {return (location.href.indexOf("factions.php") > -1)}
function isGymPage() {return (location.href.indexOf("gym.php") > -1)}
function isAttackPage() {return (location.href.indexOf("loader.php?sid=attack&user2ID") > -1)}
function isStocksPage() {return (location.href.indexOf("page.php?sid=stocks") > -1)}
function isRacePage() {return (location.href.indexOf("loader.php?sid=racing") > -1)}
function isBazaarPage() {return (location.href.indexOf("bazaar.php") > -1)}
function isHospPage() {return (location.href.indexOf("hospital.php") > -1)}
function isJailPage() {return (location.href.indexOf("jailview.php") > -1)}
function isPointsPage() {return (location.href.indexOf("page.php?sid=points") > -1)} //https://www.torn.com/page.php?sid=points
function isUserListPage() {return (location.href.toLowerCase().indexOf("userlist") > -1)}
function isAmmoPage() {return (location.href.toLowerCase().indexOf("sid=ammo") > -1)}
function isModsPage() {return (location.href.toLowerCase().indexOf("sid=itemsmods") > -1)};
function isJobsPage() {return (location.href.toLowerCase().indexOf("joblist") > -1)};
function isTravelPage() {return (location.href.toLowerCase().indexOf("travelagency") > -1)};
function isApiPage() {return (location.href.toLowerCase().indexOf("api.htm") > -1)};
function isCrimePage() {return (location.href.indexOf("sid=crimes") > -1)}

// Can't call from "run-at: start" with no jquery or top page headers...
function isHomePage() {
    let hdrTxt = $("#skip-to-content").text();
    //let hdrTxt = document.getElementById("skip-to-content").textContent;
    if (!hdrTxt) return false;
    if (hdrTxt.trim().toLowerCase() != 'home') return false;
    return true;
}

//
// Get class list for an element
//
function getClassList(element) {
    let classList;
    let list = $(element).attr("class");
    if (list) classList = list.split(/\s+/);

    return classList;
}

// Date formatting 'constants'
const date_formats = ["YYYY-MM-DD",
                      "YYYY-MONTH-DD DDD",
                      "YYYY-MM-DD HH:MM:SS",
                      "DAY MONTH DD YYYY HH:MM:SS",
                      "FULL (DAY MONTH DD YYYY HH:MM:SS TZ)"];

const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

// HTML constants
const CRLF = '<br/>';
const TAB = '&emsp;';
const separator = '<hr class = "delimiter-999 m-top10 m-bottom10">';


// Convert a date object into a readable format
// Note: use 'Utilities.formatDate' instead.
function dateConverter(dateobj, format){
    var year = dateobj.getFullYear();
    var month= ("0" + (dateobj.getMonth()+1)).slice(-2);
    var date = ("0" + dateobj.getDate()).slice(-2);
    var hours = ("0" + dateobj.getHours()).slice(-2);
    var minutes = ("0" + dateobj.getMinutes()).slice(-2);
    var seconds = ("0" + dateobj.getSeconds()).slice(-2);
    var day = dateobj.getDay();
    var converted_date = dateobj.toString();

    switch(format){
        case "YYYY-MM-DD":
            converted_date = year + "-" + month + "-" + date;
            break;
        case "YYYY-MONTH-DD DDD":
            converted_date = year + "-" + months[parseInt(month)-1] + "-" + date + " " + days[parseInt(day)];
            break;
        case "YYYY-MM-DD HH:MM:SS":
            converted_date = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            break;
        case "DAY MONTH DD YYYY HH:MM:SS":
            converted_date = days[parseInt(day)] + " " + months[parseInt(month)-1] + " " + date + " " + year + " " +
                hours + ":" + minutes + ":" + seconds;
            break;
        case "FULL (DAY MONTH DD YYYY HH:MM:SS TZ)":
            converted_date = dateobj.toString();
            break;
    }

    return converted_date;
}

// Check if a var is numeric
function isaNumber(x)
{
    return !isNaN(x);
}

// Format a number as currency.
function asCurrency(num) {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return formatter.format(num);
}

// Function used to get time formatted for the running averages sheet
// Formatted as: mm/dd/yyyy 00:00:00 TCT
// This is stolenn from one of my Google Sheets App Scripts, never
// tried in pure Javascript. This is in TCT, which is the same as UTC/GMT
function timenow() {
    return Utilities.formatDate(new Date(), "GMT", "MM/dd/yyy HH:mm:ss");
}

// Add commas at thousand place - works with decimal numbers
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

// Check to see if a pointer (sic) is valid
// Note: "val == undefined" is the same as the coercion, "val == null", and 'val'.
function validPointer(val, dbg = false) {
    if (typeof val !== undefined && val) {return true;}
    if (dbg) {debugger;}
    return false;
}

// Return a random int, 0 up to 'max', inclusive.
function getRandomInt(max) {
    return Math.floor(Math.random() * (max+1));
}

// Return an arbitrary (not int) number between min and max, inclusive.
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Return a random int between min and max, inclusive
function getRandomIntEx(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create a hash for a string. Returns a positive
// 32 bit int.
String.prototype.hashCode = function(){
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Get sidebar data from session. Has all sorts of neat stuff...
var gblSidebarData = getSidebarData();
function getSidebarData() {
    let key = Object.keys(sessionStorage).find(key => /sidebarData\d+/.test(key));
    gblSidebarData = JSON.parse(sessionStorage.getItem(key));
    return gblSidebarData;
}

// Return the page sid for cuurent page. For example, an attack log is at
// "https://www.torn.com/loader.php?sid=attackLog&ID=<log id>", this would
// return "attackLog". Couls differentiate between diff crime pages, for example.
function getPageSid() {
    const params = new URLSearchParams(window.location.search);
    return params.get('sid');
}

//const getRfcv = function() { return $.cookie('rfc-id'); }
const isDarkMode = function() { return $.cookie('darkModeEnabled'); }

// Get any cookie value - use '$.cookie()' if JQuery available
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Get current rfcv value for request authorization
function getRfcv() {
    return getCookie("rfc_id");
}

// ============ Dynamically load another script ==================
// Alternative to @require if not always needed....
//
function loadScript(file, noisy) {
  const newScript = document.createElement('script');
  newScript.setAttribute('src', file);
  newScript.setAttribute('async', 'true');

    if (noisy == true) {
      newScript.onload = () => {
        displayMessage(`${file} loaded successfully.`, 'success');
      };

      newScript.onerror = () => {
        displayMessage(`Error loading script: ${file}`, 'error');
      };
    }

  document.head.appendChild(newScript);
}

// ===================== User ID functions ===========================

// Return own user ID
function getUserId() {
    let userId = GM_getValue("userId", undefined);
    if (userId) {
        return userId;
    }

    if (gblSidebarData)
        userId = gblSidebarData.user.userID;
    if (!userId) {
        let tmp = $("#torn-user").val();
        if (!tmp) return;
        let parts = tmp.split('"');
        if (!parts || parts.length < 4) return;
        userId = parts[3];
    }
    GM_setValue("userId", userId);
    return userId;
}

// The URL expected is in the form "https://www.torn.com/profiles.php?XID=1162022#/"
// More accudomtely, "XID=" must be present :-)
// We need the XID; the trailing '#' may not be present.
function xidFromProfileURL(URL) {
    var n = URL.indexOf('XID='); // Find the 'XID=' token
    if (n == -1) {return null;}
    var n2 = URL.slice(n).indexOf('#'); // Find the '#' sign (removed in some patch, may not exist)
    var ID = 0;
    if (n2 != -1) {
        ID = URL.slice(n+4, n2); // Extract just the ID from the URL, between the '=' and '#'
    } else {
        ID = URL.slice(n+4);
    }
    return ID;
}

// More generic version of above, "ID=" must be preset
// or a user2ID attack page search param
function idFromURL(URL) {
    if (!URL) return;
    // Attack page format
    const params = new URLSearchParams(location.search);
    const XID = params.get("user2ID");
    if (XID) return XID;

    var n = URL.indexOf('ID='); // Find the 'ID=' token
    if (n == -1) {return null;}
    var n2 = URL.slice(n).indexOf('#'); // Find the next '#' sign (may not exist)
    var ID = 0;
    if (n2 != -1) {
        ID = URL.slice(n+3, n2); // Extract just the ID from the URL, between the '=' and '#'
    } else {
        ID = URL.slice(n+3);
    }
    return ID;
}

function idFromURL2(URL) {
    let path = location.pathname + location.search;
    let nums = match('/\d+/');
    return nums ? nums[0] : null;
}

// Another version of above, except search for 'userid='
// Should combine these...
function useridFromProfileURL(URL) {
    var n = URL.indexOf('userId='); // Find the 'userId=' token
    if (n == -1) {return null;}
    var n2 = URL.slice(n).indexOf('#'); // Find the '#' sign (removed in some patch, may not exist)
    var ID = 0;
    if (n2 != -1) {
        ID = URL.slice(n+7, n2); // Extract just the ID from the URL, between the '=' and '#'
    } else {
        ID = URL.slice(n+7);
    }
    return ID;
}

// Return the numeric equivalent of the full rank returned by the 'profile' selection
// Torn 'user' API query.
function numericRankFromFullRank(fullRank) {
    let parts = fullRank.split(' ');
    let rank = parts[0];
    if (parts.length >= 3 &&
        (rank == 'Absolute' || rank == 'Below' || rank == 'Above' || rank == 'Highly')) {
        rank = rank + ' ' + parts[1];
    }

    // Lookup name in our table (array) to convert to number
    let numeric_rank = 0;
    for (let i = 0; i < _ranks.length; i++) {
        if (rank == _ranks[i]) {
            numeric_rank = i;
            break;
        }
    }

    return numeric_rank;
}

// Open a new tab to a given URL. Will get focus by default
const openInNewTab = (url, focus=true) => {focus ? window.open(url, '_blank').focus() :
                                                   window.open(url, '_blank');}


//////////////////////////////////////////////////////////////////////
// Map textual rank names to numeric, via array index
//////////////////////////////////////////////////////////////////////

var _ranks = ['Absolute beginner',
              'Beginner',
              'Inexperienced',
              'Rookie',
              'Novice',
              'Below average',
              'Average',
              'Reasonable',
              'Above average',
              'Competent',
              'Highly competent',
              'Veteran',
              'Distinguished',
              'Highly distinguished',
              'Professional',
              'Star',
              'Master',
              'Outstanding',
              'Celebrity',
              'Supreme',
              'Idolized',
              'Champion',
              'Heroic',
              'Legendary',
              'Elite',
              'Invincible'];

/////////////////////////////////////////////////////////////////////////////////
// Functions to query the Torn API (and a few others)
/////////////////////////////////////////////////////////////////////////////////

const baseTornURL = "https://api.torn.com/";
const baseTornURLv2 = "https://api.torn.com/v2/";

function xedx_TornGenericQuery(section, ID, selection, callback, param=null) {
    if (ID == null) ID = '';
    let comment = GM_info.script.name.replace('Torn', 'XedX');
    let url = baseTornURL + section + "/" + ID + "?comment=" + comment + "&selections=" + selection + "&key=" + api_key;
    let details = GM_xmlhttpRequest({
        method:"POST",
        url:url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        onload: function(response) {
            if (response.error && critErrs.includes(+response.error.code)) {
                getTimeToValidateKey();
                return;
            }
            if (response.responseText && response.responseText.error &&
                critErrs.includes(+response.responseText.error.code)) {
                getTimeToValidateKey();
                return;
            }
            callback(response.responseText, ID, param);
        },
        onerror: function(response) {
            handleSysError(response);
        },
        onabort: function(response) {
            console.debug('(JS-Helper) ' + GM_info.script.name + ': onabort');
            handleSysError(response);
        },
        ontimeout: function(response) {
            console.debug('(JS-Helper) ' + GM_info.script.name +': ontimeout');
            handleSysError(response);
        }
    });
}

// The v2 version takes an 'options' param now, an object whose key-value
// pairs are appended to the query string. It also may contain a 'param'
// member to pass to the callback.
function xedx_TornGenericQueryv2(section, ID, selection, callback, options) {
    if (ID == null) ID = '';
    let comment = GM_info.script.name.replace('Torn', 'XedX');
    //let url = baseTornURLv2 + section + "/" + ID + "?comment=" + comment + "&selections=" + selection + "&key=" + api_key;
    let addlArgs = "";
    if (options)
        addlArgs = buildArgStr(options);
    let url = baseTornURLv2 + section + "/" + (ID ? ID + "/" : "") + selection + "?key=" + api_key + "&comment=" + comment + addlArgs;
    let details = GM_xmlhttpRequest({
        method:"POST",
        url:url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        onload: function(response) {
            if (response.error && critErrs.includes(+response.error.code))
                getTimeToValidateKey();
            let param = null;
            if (options && options.param) param = options.param;
            callback(response.responseText, ID, param);
        },
        onerror: function(response) {
            handleSysError(response);
        },
        onabort: function(response) {
            console.debug('(JS-Helper) ' + GM_info.script.name + ': onabort');
            handleSysError(response);
        },
        ontimeout: function(response) {
            console.debug('(JS-Helper) ' + GM_info.script.name +': ontimeout');
            handleSysError(response);
        }
    });

    function buildArgStr(options) {
        if (!options) return;
        let argStr = "";
        let keys = Object.keys(options);
        for (let idx=0; idx<keys.length; idx++) {
            let key = keys[idx];
            let value = options[key];
            argStr += "&" + key +"=" + value;
        }
        return argStr;
    }
}

function xedx_TornGenericQueryDbg(section, ID, selection, callback, param=null) {
    if (ID == null) ID = '';
    let comment = GM_info.script.name.replace('Torn', 'XedX');
    let url = baseTornURL + section + "/" + ID + "?comment=" + comment + "&selections=" + selection + "&key=" + api_key;
    console.debug('(JS-Helper) ' + GM_info.script.name + ' Querying ' + section + ':' + selection + ' ID: ' + ID);
    let details = GM_xmlhttpRequest({
        method:"POST",
        url:url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        onload: function(response) {
            if (response.error && critErrs.includes(+response.error.code)) {
                getTimeToValidateKey();
                return;
            }
            if (response.responseText && response.responseText.error &&
                critErrs.includes(+response.responseText.error.code)) {
                getTimeToValidateKey();
                return;
            }
            callback(response.responseText, ID, param);
        },
        onerror: function(response) {
            console.log('(JS-Helper) ' + GM_info.script.name + ' Error Response: ', response);
            handleSysError(response);
        },
        onabort: function(response) {
            console.log('(JS-Helper) ' + GM_info.script.name + ': onabort response: ', response);
            handleSysError(response);
        },
        ontimeout: function(response) {
            console.log('(JS-Helper) ' + GM_info.script.name +': ontimeout response: ', response);
            handleSysError(response);
        }
    });
}


// Get current Torn time, secs since epoch
// Usually, Date() works just as well, just be
// aware of secsvs ms...
//
//https://api.torn.com/user/?selections=timestamp&key=
function GetTornTime(callback) {
    xedx_TornGenericQuery('user', 0, "timestamp", callback);
}

//
// Callback should have the following signature: callback(responseText, ID, (optional)param)
// Duplicated for v2 to preserve backwards-compatibility. (non-debug versions only)
//
// Callback sig: callback(response.responseText, ID, param);
//
// ---------------------
function xedx_TornUserQuery(ID, selection, callback, param=null) {
    xedx_TornGenericQuery('user', ID, selection, callback, param);
}

function xedx_TornUserQueryv2(ID, selection, callback, param=null) {
    xedx_TornGenericQueryv2('user', ID, selection, callback, param);
}

function xedx_TornUserQueryDbg(ID, selection, callback, param=null) {
    xedx_TornGenericQueryDbg('user', ID, selection, callback, param);
}

// --------------------
function xedx_TornPropertyQuery(ID, selection, callback, param=null) {
    xedx_TornGenericQuery('property', ID, selection, callback, param);
}

function xedx_TornPropertyQueryv2(ID, selection, callback, param=null) {
    xedx_TornGenericQueryv2('property', ID, selection, callback, param);
}

function xedx_TornPropertyQueryDbg(ID, selection, callback, param=null) {
    xedx_TornGenericQueryDbg('property', ID, selection, callback, param);
}

// --------------------
function xedx_TornFactionQuery(ID, selection, callback, param=null) {
    xedx_TornGenericQuery('faction', ID, selection, callback, param);
}
function xedx_TornFactionQueryv2(ID, selection, callback, param=null) {
    xedx_TornGenericQueryv2('faction', ID, selection, callback, param);
}

function xedx_TornFactionQueryDbg(ID, selection, callback, param=null) {
    xedx_TornGenericQueryDbg('faction', ID, selection, callback, param);
}

// ---------------------
function xedx_TornCompanyQuery(ID, selection, callback, param=null) {
    xedx_TornGenericQuery('company', ID, selection, callback, param);
}
function xedx_TornCompanyQueryv2(ID, selection, callback, param=null) {
    xedx_TornGenericQuery('company', ID, selection, callback, param);
}

function xedx_TornCompanyQueryDbg(ID, selection, callback, param=null) {
    xedx_TornGenericQueryDbg('company', ID, selection, callback, param);
}

// -----------------------
function xedx_TornMarketQuery(ID, selection, callback, param=null) {
    xedx_TornGenericQuery('market', ID, selection, callback, param);
}
function xedx_TornMarketQueryv2(ID, selection, callback, param=null) {
    xedx_TornGenericQuery('market', ID, selection, callback, param);
}

function xedx_TornMarketQueryDbg(ID, selection, callback, param=null) {
    xedx_TornGenericQueryDbg('market', ID, selection, callback, param);
}

// ----------------------
function xedx_TornTornQuery(ID, selection, callback, param=null) {
    xedx_TornGenericQuery('torn', ID, selection, callback, param);
}
function xedx_TornTornQueryv2(ID, selection, callback, param=null) {
    xedx_TornGenericQuery('torn', ID, selection, callback, param);
}

function xedx_TornTornQueryDbg(ID, selection, callback, param=null) {
    xedx_TornGenericQueryDbg('torn', ID, selection, callback, param);
}
//////////////////////////////////////////////////////////////////
// Function to do a TornStats bat stats spy
//////////////////////////////////////////////////////////////////

function xedx_TornStatsSpy(ID, callback, param=null) {
    if (!ID) ID = '';
    let url = 'https://www.tornstats.com/api/v1/' + api_key + '/spy/' + ID;
    //console.debug('(JS-Helper) ' + GM_info.script.name + ' Spying ' + ID + ' via TornStats');
    //console.debug('(JS-Helper) ' + GM_info.script.name + ' url: ' + url);
    GM_xmlhttpRequest({
        method:"GET",
        url:url,
        headers: {
            'Accept': '*/*'
        },
        onload: function(response) {
            // Check status code here: 429
            //console.log('TornStat response: ', response);
            //if (response.status != 200) {
            //} else {
            callback(response.responseText, ID, param);
            //}
        },
        onerror: function(response) {
            console.debug('(JS-Helper) ' + GM_info.script.name + ': onerror');
            console.debug(response);
            handleSysError(response);
        },
        onabort: function(response) {
            console.debug('(JS-Helper) ' + GM_info.script.name + ': onabort');
            console.debug(response);
            handleSysError(response);
        },
        ontimeout: function(response) {
            console.debug('(JS-Helper) ' + GM_info.script.name +': ontimeout');
            console.debug(response);
            handleSysError(response);
        }
    });
}

//////////////////////////////////////////////////////////////////////
// ************************ Travel Related ***************************
//////////////////////////////////////////////////////////////////////

//
// Query YATA for foreign stocks, put this into library...
//
function xedx_YataForeignStocks(callback, param=null) {

    const yataHost = "https://yata.yt";
    const stocksURL = "/api/v1/travel/export/";
    let url = yataHost + stocksURL;

    log("xedx_YataForeignStocks: url is ", url);
    GM_xmlhttpRequest({
        method:"GET",
        url:url,
        headers: {
            'Accept': '*/*'
        },
        onload: function(response) {
            console.log('TornStat response: ', response);
            callback(response.responseText, param);
        },
        onerror: function(response) {
            console.debug('(JS-Helper) ' + GM_info.script.name + ': onerror');
            console.debug(response);
            handleSysError(response);
        },
        onabort: function(response) {
            console.debug('(JS-Helper) ' + GM_info.script.name + ': onabort');
            console.debug(response);
            handleSysError(response);
        },
        ontimeout: function(response) {
            console.debug('(JS-Helper) ' + GM_info.script.name +': ontimeout');
            console.debug(response);
            handleSysError(response);
        }
    });
}// End YATA stocks fn...

// Given a coutry taken from looking at someone's travel
// destination via the API, translate it into a YATA country code
function codeFromCountry(country) {
    if (country == 'uk') return 'uni';                // Verified
    if (country == 'mexico') return 'mex';            // Verified
    if (country == 'canada') return 'can';            // Verified
    if (country == 'argentina') return 'arg';         // Verified
    if (country == 'hawaii') return 'haw';
    if (country == 'cayman-islands') return 'cay';    // Verified
    if (country == 'switzerland') return 'swi';       // Verified
    if (country == 'japan') return 'jap';
    if (country == 'china') return 'chi';             // Verified
    if (country == 'uae') return 'uae';               // Verified
    if (country == 'south-africa') return 'sou';      // Verified

    debug("*** Didn't find ", country, " in country list! ***");
    return null;
}

// Return what country we are in (or going to!)
function currentCountry() {
    return $('body')[0].getAttribute('data-country');
}

// Return TRUE if travelling or not in Torn
function awayFromHome() {
    return abroad() || travelling();
}

// Return true if abroad (in the air or landed)
function abroad() {
    if ($('body')[0])
        return $('body')[0].getAttribute('data-abroad') == 'true';
    else {
        log("Error! 'body' not found? Too early? ", $('body'));
        return false;
    }
}

// Return true if travelling (in the air)
function travelling() {
    return $('body')[0].getAttribute('data-traveling') == 'true';
}

// Return true if in dark mode
function darkMode() {
    return $('body')[0].classList.contains('dark-mode');
}

/////////////////////////////////////////////////////////////////////////////////////
// Very simple error handler; only displayed (and logged) [once <== this is a lie!]
// Called from the various xedx_Torn*Query() functions
/////////////////////////////////////////////////////////////////////////////////////

// TBD: Change this to a self-closing message.
var errorLogged = false;
function handleError(responseText) {
    if (!errorLogged) {
        let jsonResp = JSON.parse(responseText);
        let errorText = GM_info.script.name + ': An error has occurred querying the Torn API.\n' +
            '\nCode: ' + jsonResp.error.code +
            '\nError: ' + jsonResp.error.error;

        // Temporary
        log("[jsHelper] Error: ", errorText);
        if (jsonResp.error.code == 5) debugger;

        if (jsonResp.error.code == 5) {
            errorText += '\n\n The Torn API only allows so many requests per minute. ' +
                'If this limit is exceeded, this error will occur. It will clear itself' +
                'up shortly, or you may try refreshing the page.\n';
        }

        if (jsonResp.error.code == 2) {
            errorText += '\n\n It appears that the API key entered or saved for you ' +
                'is incorrect. Please try refreshing the page, you will be prompted again for your API key.\n';
            GM_setValue('gm_api_key', '');
        }

        if (jsonResp.error.code == 16) {
            errorText += '\n\nPlease try refreshing the page, you will be prompted again for your API key.\n';
            GM_setValue('gm_api_key', '');
        }

        errorText += '\nPress OK to continue.';
        if (alertOnError) alert(errorText);
        console.log(errorText);
        errorLogged = true;
    }
}

function handleSysError(response, addlText=null) {

    console.log("System error: ", response);

    let errorText = GM_info.script.name + ': An error has occurred querying data.\n\n' +
        response.error;

    errorText += '\n\nPress OK to continue.';
    if (alertOnError) alert(errorText);
    console.log(errorText);
    console.log(response);
    console.log(response.error);
}

// Print out ajax errors....
function decodeAjaxError(jqXHR, textStatus, errorThrown) {
    log("decodeQuickReloadError");
    log("jqXHR: ", jqXHR);
    log("textStatus: ", textStatus);
    log("errorThrown: ", errorThrown);
}

//--- Simulate a natural mouse-click sequence.
function simulateMouseClick(targetNode) {
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

// Just a nifty little helper so I can see the status of the page load.
// For development stuff...
function addLoadingLights() {
    if (document.querySelector("xedx-lights")) return;
    const targetSel = "#topHeaderBanner > div.header-wrapper-top > div";
    GM_addStyle(`
     .topcorner {position:absolute; top: 0px; right: 0px; width: 117px; height: 39px; color: #a7b9ca;}
     .icon-enabled {display: inline-block; vertical-align: middle; height: 34px; width: 34px;
                    background: url(/images/v2/chat/tab_icons.svg) left top;
                    filter: drop-shadow(0px 0px 1px rgba(17,17,17,0.678431));}
     .icon-disabled {display: inline-block; vertical-align: middle; height: 34px; width: 34px;
                    background: url(/images/v2/chat/tab_icons.svg) -68px top;
                    filter: drop-shadow(0px 0px 1px rgba(17,17,17,0.678431));}
    `);
    const miniUI = '<div id="xedx-lights" class="topcorner">' +
          '<i id="xloading" class="icon-disabled"></i>' +
          '<i id="xinteractive" class="icon-disabled"></i>' +
          '<i id="xcomplete" class="icon-disabled"></i>' +
          '</div>';
    const toggleLightIcon = function (id) {
        let node = document.getElementById('x' + id);
        $(node).removeClass('icon-disabled');
        $(node).addClass('icon-enabled');
    }

    document.onreadystatechange = function () {toggleLightIcon(document.readyState);}
    let target = document.querySelector(targetSel);
    if (!target) return setTimeout(addLoadingLights, 50);
    if (!document.querySelector("xedx-lights")) $(target).after(miniUI);

    if (document.readyState == 'loading') toggleLightIcon('loading');
    if (document.readyState == 'interactive') {
        toggleLightIcon('loading');
        toggleLightIcon('interactive');
    }
    if (document.readyState == 'complete') {
        toggleLightIcon('loading');
        toggleLightIcon('interactive');
        toggleLightIcon('complete');
    }
}


/**
 * @auther SM@K<smali.kazmi@hotmail.com>
 * @description website: smak.pk
 * usage: alert(SmartPhone.isAny());
 * if (SmartPhone.isAny()) {...}
 */
(function() { // SmartPhone = function(obj) {
    var root = this;
    var SmartPhone = function(obj) {
        if (obj instanceof SmartPhone) return obj;
        if (!(this instanceof SmartPhone)) return new SmartPhone(obj);
        this._wrapped = obj;
    };

    SmartPhone.userAgent = null;
    SmartPhone.getUserAgent = function() {return this.userAgent;};
    SmartPhone.setUserAgent = function(userAgent) {this.userAgent = userAgent;};
    SmartPhone.isAndroid = function() {return this.getUserAgent().match(/Android/i);};
    SmartPhone.isBlackBerry = function() {return this.getUserAgent().match(/BlackBerry/i);};
    SmartPhone.isBlackBerryPlayBook = function() {return this.getUserAgent().match(/PlayBook/i);};
    SmartPhone.isBlackBerry10 = function() {return this.getUserAgent().match(/BB10/i);};
    SmartPhone.isIOS = function() {this.isIPhone() || this.isIPad() || this.isIPod();};
    SmartPhone.isIPhone = function() {return this.getUserAgent().match(/iPhone/i);};
    SmartPhone.isIPad = function() {return this.getUserAgent().match(/iPad/i);};
    SmartPhone.isIPod = function() {return this.getUserAgent().match(/iPod/i);};
    SmartPhone.isOpera = function() {return this.getUserAgent().match(/Opera Mini/i);};
    SmartPhone.isWindows = function() {return this.isWindowsDesktop() || this.isWindowsMobile();};
    SmartPhone.isWindowsMobile = function() {return this.getUserAgent().match(/IEMobile/i);};
    SmartPhone.isWindowsDesktop = function() {return this.getUserAgent().match(/WPDesktop/i);};
    SmartPhone.isFireFox = function() {return this.getUserAgent().match(/Firefox/i);};
    SmartPhone.isNexus = function() {return this.getUserAgent().match(/Nexus/i);};
    SmartPhone.isKindleFire = function() {return this.getUserAgent().match(/Kindle Fire/i);};
    SmartPhone.isPalm = function() {return this.getUserAgent().match(/PalmSource|Palm/i);};
    SmartPhone.isAny = function() {
        var foundAny = false;
        var getAllMethods = Object.getOwnPropertyNames(SmartPhone).filter(function(property) {
            return typeof SmartPhone[property] == 'function';
        });

        for (var index in getAllMethods) {
            if (getAllMethods[index] === 'setUserAgent' || getAllMethods[index] === 'getUserAgent' ||
                getAllMethods[index] === 'isAny' || getAllMethods[index] === 'isWindows' ||
                getAllMethods[index] === 'isIOS') {
                continue;
            }
            if (SmartPhone[getAllMethods[index]]()) {
                foundAny = true;
                break;
            }
        }
        return foundAny;
    };

    if(typeof window === 'function' || typeof window === 'object') {
        SmartPhone.setUserAgent(navigator.userAgent);
    }

    if (typeof exports !== 'undefined') {
        var middleware = function(isMiddleware) {
            isMiddleware = isMiddleware === (void 0) ? true : isMiddleware;
            if(isMiddleware) {
                return function(req, res, next) {
                    var userAgent = req.headers['user-agent'] || '';
                    SmartPhone.setUserAgent(userAgent);
                    req.SmartPhone = SmartPhone;
                    if ('function' === typeof res.locals) {
                        res.locals({SmartPhone: SmartPhone});
                    } else {
                        res.locals.SmartPhone = SmartPhone;
                    }
                    next();
                };
            } else {
                return SmartPhone;
            }
        };
        if (typeof module !== 'undefined' && module.exports) {
            var exports = module.exports = middleware;
        }
        exports = middleware;
    } else {
        root.SmartPhone = SmartPhone;
    }
}.call(this));

//
// Nifty UI stuff
//

 // ========================= Draggable support =========================
//
// Outermost div (elmt is ID of the div) must have position: absolute or fixed
// Inside that must be a div called <outer-id>header ...
// See "Torn Hospital Timer" as an example.
//
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    let t = (elmnt.offsetTop - pos2);
    if (t < 0) t = 0;
    if (t > window.innerHeight)
        t = window.innerHeight - (event.target.offsetHeight);
    elmnt.style.top = t + "px";

    let l = (elmnt.offsetLeft - pos1);
    if (l < 0) l = 0;
    if (l > window.innerWidth)
        l = window.innerWidth - (event.target.offsetWidth);
    elmnt.style.left = l + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    //GM_setValue("lastPosition", $("#x-hosp-watch").position());
    let curPos = {top: elmnt.style.top, left: elmnt.style.left};
    GM_setValue("lastPosition", curPos);
  }
}

// See if a click is on top of an element
function isClickInElement(event, elem) {
    let xOK = false, yOK = false;
    let xClick = event.clientX, yClick = event.clientY;
    let elemTop = $(elem).offset().top, elemLeft = $(elem).offset().left;
    let elemBottom = elemTop + $(elem).height(), elemRight = elemLeft + $(elem).width();
    let pos = $(elem).position();

    if (xClick >= elemLeft && xClick <= elemRight) xOK = true;
    if (yClick >= elemTop && yClick <= elemBottom) yOK = true;

    // Compensation for sidebar scrolling.
    if (yClick >= pos.top && yClick <= (pos.top + $(elem).height())) yOK = true;

    return (xOK && yOK);
}

// Determines the current crimes available - display name, internal name,and ID
// Keeps a cached version
var gCrimeList = undefined;
var gDataSet = undefined;
function doCrimeLoad(callback, full=false) {
    let dataVal = {
        sid: "crimesData",
        step: "crimesList",
        //typeID: whichCrime,
        rfcv: "669d64dc9000a"
    };

    if (gCrimeList != undefined && callback) {
        //callback((full == true) ? gDataSet : gCrimeList);
        callback(gDataSet);
        return;
    }

    const crimeURL = "https://www.torn.com/page.php?sid=crimes";
    $.ajax({
        url: crimeURL,
        type: 'GET',
        data: dataVal,
        success: function (response, status, xhr) {
            var ct = xhr.getResponseHeader("content-type") || "";
            if (ct.indexOf('html') > -1) {
                log("Uniques, response: ", response);
                log("Uniques, $response: ", $(response)[0]);

                gDataSet = $(response)[0] ? $(response)[0].dataset : undefined;
                gCrimeList = gDataSet? gDataSet.availableCrimes : undefined;
                if (callback) {
                    //callback((full == true) ? gDataSet : gCrimeList);
                    callback(gDataSet);
                }
                //processCrimeLoadHTMLResponse(response, status, xhr);
            } else {
                let jsonResp = JSON.parse(response);
                callback(jsonResp);
                //log("error: unexpected content type: ", response);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            log("Error in crimeLoad: ", textStatus);
        }
    });
}

//
// Get the elements for the various icon nodes on the top of the taskbar
// callback: fn to call when complete. sig: callback(status, node)
//   - status: "OK" or error string
// maxRetries - default is 8 (~2 secs)
//
const iconIndices = {"donator": 4, "subscriber": 4, "donators": 4, "subscribers": 4,
                     "level": 5, "gender" : 6, "marriage": 8, "faction": 9, "hospital": 15,
                     "hosp": 15, "edu": 19, "education": 19, "company": 27,
                     "bank": 29, "interest": 29, "caymans": 31, "vault": 32,
                     "market": 36, "items": 36,
                     "stocks": 38, "stock": 38, "booster":39, "boostercd": 43,
                     "book": 68,
                     "med": 44, "medical": 44, "drug": 49, "drugcd": 49,
                     "oc": 85, "organized": 85,
                     "organizedcrime": 85};

function getSidebarIcon(iconName, callback, maxRetries=8) {
    if (!callback || !iconName) {
        console.error("Missing callback or icon name for getSidebarIcon");
        return;
    }

    let iconIndex = iconIndices[iconName];
    if (!iconIndex) {
        let msg = "Could not find an icon for '" + iconName + "'. Valid entries follow.";
        callback(iconName, {name: iconName, status: "error",
                            reason: msg, data: JSON.stringify(iconIndices)});
    }

    let sel = "[class*='icon" + iconIndex + "_']";
    let params = {name: iconName, selector: sel, callback: callback, maxRetries: maxRetries};
    getIcon(params);
}

// Private helper to get sidebar icons
// params: {selector: <icon selector>, callback: callback, maxRetries: maxRetries}
// callback: callback(status, element)
function getIcon(params, retries) {
    if (!params.callback) return;

    let icon = $(params.selector)[0];
    if ($(icon).length < 1) {
        if (retries++ < params.maxRetries) return setTimeout(getIcon, 250, params, retries);
        params.callback(params.name, {status: "error",
                                      reason: "Timed out, did not locate selector.",
                                      data: JSON.stringify(params)});
    }
    params.callback(params.name, {status: "OK"}, icon);
}

// Add my own custom section in the sidebar
function makeXedxSidebarContentDiv(elemId) {
    let newElemId = "x-scrollbar-content" + (elemId ? ("-" + elemId) : "");
    let selector = '#'+ newElemId;
    if ($(selector).length > 0) return selector;
    let node = $('#sidebar').find('div[class^=toggle-content__]').find('div[class^=content___]:not([id^="x-scroll"])');
    if ($(node).length < 1) return;

    let clone = $($(node)[0]).clone();
    $(clone).children().remove();
    $(node).after(clone);
    $(clone).attr("id", newElemId);
    return selector;
}

// Add a button on almost any page, to the right of top title.
// Callback is required, the click handler.
// id and title are optional.

// Not sure if I'll want or need this "filter" for
// the callback, could simply pass the callback fn
// as param to the ".on" fn. Maybe could add a struct
// as a param to the add btn fn for 1) addl btn style
// params? and 2) to set up params for the callback?
const custClickHandler = function (event) {
    let cb = event.data.handler;

    // Could do something here...

    cb(event);
}

// Turns out this isn't a universal selector. (skip-to-content)
// Maybe make a lookup table based on page href?
// Hard to maintain...need more dynamic way to
// locate...or use page position?
function addTopBarButton(callback, id, title) {

    if (!id) id = "xedx-misc-btn";
    if (!title) title = "Click";

    let btnSel = "#" + id;
    if ($(btnSel).length > 0) return;

    let name = $("#skip-to-content");
    let myButton = `<span><input id="${id}" type="submit"
                    style="margin-left: 15px; margin-top: 2px;" class="xedx-torn-btn" value="${title}"></span>`;
    $(name).after(myButton);
    $(btnSel).on('click', { handler: callback }, custClickHandler );
}

/* Old function to cause a beep - won't work unless initiated by an element click */

// All arguments are optional:
//   duration of the tone in milliseconds. Default is 500
//   frequency of the tone in hertz. default is 440
//   volume of the tone. Default is 1, off is 0.
//   type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//   callback to use on end of tone
//
var audioCtx;
function beep(duration=500, frequency=440, volume=1, type='sine', callback) {
    if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (volume){gainNode.gain.value = volume;}
    if (frequency){oscillator.frequency.value = frequency;}
    if (type){oscillator.type = type;}
    if (callback){oscillator.onended = callback;}

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
};

//
// Display a 'spinner'/'spin loader'/'loader' as an indication of a lengthy process
//
function displaySpinner(target, spinnerId) {
    addSpinLoaderStyles();
    let loaderDiv = "<div id='" + spinnerId + "' class='spinLoader'></div>"
    $(target).before(loaderDiv);
}

function removeSpinner(spinnerId) {
    let sel = "#"+ spinnerId;
    $(sel).remove();
}

// ===================== Save/restore actual position =======================
// I typically use with floating divs that are children of a very high
// level element, such as #mainContainer. Pass the id of the outermost
// div and frequency at which to poll for changes. Only usefull with draggable
// DIVs, seethe dragElement() for details on doing that also. Torn Hospital
// Timer, Torn Blood Bag Reminder, Torn War Timer on Every Page all use  both fns.
//
// The optional 'stayInWindow' param, if true, will try to force the window to
// stay within the window extents.
//
function isInViewport(element) {
    let elementTop = $(element).offset().top;
    let elementBottom = elementTop + $(element).outerHeight();
    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
}

function isOffsetInViewport(element, off) {
    let elementTop = off.top;
    let elementBottom = elementTop + $(element).outerHeight();
    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

  return elementBottom > viewportTop && elementTop < viewportBottom;
}

function startSavingPos(interval, outerDivId, stayInWindow) {
    var posTimer = 0;
    if (!interval) return console.error("[startSavingPos] interval is required!");
    if (!outerDivId) return console.error("[startSavingPos] outerDivId is required!");
    restoreSavedPos(outerDivId);
    posTimer = setInterval(savePosition, 1500, outerDivId, stayInWindow);

    function getPosSelector(outerDivId) {
        return "#" + outerDivId;
    }

    function getDefPos(outerDivId) {
        let outerDivSelector = getPosSelector(outerDivId);
        let l = parseInt($("#mainContainer").outerWidth(true)) -
            ($(outerDivSelector).outerWidth() + 50);
        let t = 80;
        let off = {left: l, top: t};
        return off;
    }

    function getPosKey(outerDivId) {
        let key = outerDivId + "-lastPos";
        return key;
    }

    function getSavedPosition(outerDivId) {
        let key = getPosKey(outerDivId);
        let off;
        let tmp = GM_getValue(key, undefined);
        if (tmp) {
            off = JSON.parse(tmp);
        } else {
            off = getDefPos(outerDivId);
        }
        return off;
    }

    function checkExtents(outerDivSelector, off) {
        let changed = false;
        if (off.left < 0) {off.left = 0; changed = true;}
        if (off.left > (window.innerWidth - 20)) {off.left =
            (window.innerWidth - $(outerDivSelector).width());
            changed = true;}
        if (off.top < 0) {off.top = 0; changed = true;}
        if (off.top > window.innerHeight - 30) {off.top =
            (window.innerHeight - 30); changed = true;}

        if (changed) $(outerDivSelector).offset(off);
    }

    function savePosition(outerDivId, stayInWindow) {
        let outerDivSelector = getPosSelector(outerDivId);
        if ($(outerDivSelector).length == 0) {        // Element is gone
            console.log(GM_info.script.name + ': ' + outerDivSelector + " not found! Stopping position timer.");
            clearInterval(posTimer);
            posTimer = 0;
            return;
        }

        // Account for scroll! This will be offset to *unscrolled*
        let off = $(outerDivSelector).offset();
        let scr = $(window).scrollTop();
        off.top = parseInt(off.top) - parseInt(scr);

        if (stayInWindow == true) {
        //    checkExtents(outerDivSelector, off);
        }

        let key = getPosKey(outerDivId);
        GM_setValue(key, JSON.stringify(off));
    }

    function restoreSavedPos(outerDivId) {
        let outerDivSelector = getPosSelector(outerDivId);
        let off = getSavedPosition(outerDivId);

        let scr = $(window).scrollTop();
        off.top = parseInt(off.top) + parseInt(scr);
        if (off.top < 0) {
            off.top = 50;
        }

        $(outerDivSelector).offset(off);
    }
}

//
// Functions to attach a context menu to an element. Don't forget 'addContextStyles()'!

// 'selector' is the elemt to handle the right-click.
// 'menuID' is the ID of the menu.
// If 'noSample' is true (the default), will be added without the sample item.
//
// It is set up so that clicking outside of it will close the menu.
// You can add menu items using the selector $("#<menuId > ul").append(li);
// Add handlers for them, or create with <a href>'s. To make sure the
// menu itself is hidden after an LI click, if not changing pages, you
// can call "cmHideShow(menuSel, targetSel);", the two params are the
// menu selector, and target selector, passed when the menu was creatwd.
//
// An options object may be passed in. Options that are understood:
// options  [
//  filter: <function>
//  classOverRide: <class name>
//  noSample: true to remove sample LI (default)
// }
//
// The filter function will be called first, if it return true
// then nothing else is done. Otherwise, event propogation is stopped
// and the menu is hidden.
//
// classOverRide, if provided, will replacethe default .context-menu
// class and it's descendents, .context-menu > ul and ul > li
//
// Returns the menu's selector on success, undefined otherwise.
//
function installContextMenu(selector, menuId, options) {
    let noSample = true, filterCb = undefined, customClass = undefined;
    if (options) {
        noSample = (options.noSample == undefined) ? true : options.noSample;
        filterCb = options.filter;
        customClass = options.classOverRide;
    };

    const cmHtml = `<div id="` + menuId + `" class="` +
                        (customClass ? customClass : "context-menu") +
                        ` ctxhide">
                        <ul><li class="x-sample"><a href="#">Sample</a></li></ul>
                    </div`;

    // This doesn't seem to work quite right yet...
    // Maybe wrap in exception handlers?
    //
    // If context menu css not yet included, add it
    //if (!getDefinedCss("context-menu")) {
    //    addContextStyles();
    //}

    let menuSelector = "#" + menuId;
    if ($(menuSelector).length) {return log("Element ", menuId, " Already exists!");}
    if (!$(selector).length) {return log("Target selector ", selector, " not found!");}

    $(selector).after(cmHtml);

    // Add handlers for right-click - hide or show the menu
    let params = {cmSel: menuSelector, targetSel: selector, filter: filterCb};
    $(selector).on('contextmenu', params, handleCmRightClick);
    $(menuSelector).on('contextmenu', params, handleCmRightClick);

    // The 'sample' li is just to give an indication it worked,
    // other than the log messages. Clicking it removes it.
    let sampleSel = menuSelector + " > ul > li.x-sample";
    if (noSample)
        $(sampleSel).remove();
    else
        $(sampleSel).on('click', {sel: sampleSel, rootId: menuId}, cmRemoveSample);

    // Add handler for clicks outside of the menu - hide menu
    cmHandleOutsideClicks(menuId);

    log("Context menu '", menuSelector, " installed!");

    return ($(menuSelector).length > 0) ? menuSelector : undefined;
}

// Helper for LI's in the list. If the menu has a border-radius, matching
// it on the first and last LI's in the menu looks much nicer when hovering.
// These calls set that. The target is the LI to set the radius on, the
// matchSel is the elementto get the radius from. Can be elements or
// selectors.
function matchTopBorderRadius(targetSel, matchSel) {
    let radius = $(matchSel).css("border-radius");
    let radiusStr = radius + " " + radius + " 0px 0px";
    $(targetSel).css("border-radius", radiusStr);
}

function matchBottomBorderRadius(targetSel, matchSel) {
    let radius = $(matchSel).css("border-radius");
    let radiusStr = "0px 0px " + radius + " " + radius;
    $(targetSel).css("border-radius", radiusStr);
}

function handleCmRightClick(event) {
    let menuSel = event.data.cmSel;
    let targetSel = event.data.targetSel;
    let filterFn = event.data.filter;

    if (filterFn) {
        if (filterFn(event)) {
            //event.preventDefault();
            return;
        }
    }

    event.preventDefault();

    cmHideShow(menuSel, targetSel);
}

function cmHideShow(cmSelector, targetSelector) {
    let ctxVisible = $(cmSelector).hasClass("ctxshow");
    if (ctxVisible) {
        $(cmSelector).removeClass("ctxshow").addClass("ctxhide");
    } else {
        let x = $(targetSelector).css("left");
        let y = event.clientY;

        if (!$(cmSelector).hasClass("no-pos")) {
            $(cmSelector).css("left", x.toString() + "px");
            $(cmSelector).css("top", y.toString() + "px");
        }

        $(cmSelector).removeClass("ctxhide").addClass("ctxshow");
    }
}

function cmHandleOutsideClicks(cmId) {
    $("html").click(function (e) {
        let menu = document.getElementById(cmId)
        if (e.target != menu) {
            if ($(menu).hasClass("ctxshow"))
                $(menu).removeClass("ctxshow").addClass("ctxhide");
            if (!$(menu).hasClass("ctxhide"))
                $(menu).addClass("ctxhide");
        }
    });
}

function cmRemoveSample(event) {
    let liSel = event.data.sel;
    let menuId = event.data.rootId;
    let msgText = 'This will remove this sample menu item.\nTo add ' +
        'new ones, use the sytax $("#' + menuId + ' > ul").append(<node/html>);\n' +
        'Go ahead and remove this menu item?';
    if (confirm(msgText))
        $(liSel).remove();
}

// **************** End adding context menu functions *******************

// Determine if a CSS style has already been defined.
// Returns an array of all the defined rules
//
// This doesn't seem to work quite right yet...
// Maybe wrap in exception handlers?
//
function getDefinedCss(s) {

    // Until fixed, just return.
    return;

    if(!document.styleSheets) return '';
    if(typeof s== 'string') s= RegExp('\\b'+s+'\\b','i'); // IE capitalizes html selectors

    //try {
    var A, S, DS= document.styleSheets, n= DS.length, SA= [];
    while(n){
        S= DS[--n];
        try {
            A= (S.rules)? S.rules: S.cssRules;
            for(var i= 0, L= A.length; i<L; i++){
                let tem= A[i].selectorText? [A[i].selectorText, A[i].style.cssText]: [A[i]+''];
                if(s.test(tem[0])) SA[SA.length]= tem;
            }
        } catch (ex) {
            log("exception ", ex);
            debugger;
            continue;
        }
    }
    //} catch (ex) {
    //    log("exception ", ex);
    //    debugger;
    //    return;
    //}
    return SA.join('\n\n');
}


// *******************************************************
// The following can be called to add styles I use often.
// I may move to a separate .css file, loading those is a
// bit trickier than just calling these functions for what
// I need.
// *******************************************************

// Styles defined here are used by calling a function to install.
//
// addTornButtonExStyles() - A replacement for a button class "torn-btn", won't flicker on hover
// addContextStyles() - Styles used to build a popup context menu, see the notes
// addToolTipStyle() - Styles to support tool tips. Be sure to read the comment about JQuery versions!
// loadCommonMarginStyles()
// loadTtsColors()
// loadMiscStyles()
//


//
// Work in progress: collecting common ones used everywhere
// Eventually separate CSS from the lib functions.
//
// Optionally can provide an 'options' struct to selectively
// include, or call the individual functions yourself.
//
// opts { margin, colors, misc, context, tooltip, button, /*spinLoader*/ }
function loadAllCommonStyles(opts) {
    if (!opts || opts.margin == true) loadCommonMarginStyles();
    if (!opts || opts.color == trues) loadTtsColors();
    if (!opts || opts.misc == true) loadMiscStyles();
    if (!opts || opts.context == true) addContextStyles();
    if (!opts || opts.tooltip == true) addToolTipStyle();
    if (!opts || opts.button == true) addButtonStyles();
    if (!opts || opts.flex == true) addFlexStyles();
    if (!opts || opts.border == true) addBorderStyles();
    //if (!opts || opts.spinLoader == true) addSpinLoaderStyles();
}

// Styles for a 'spinner' when doing something that may take a bit.
var spinStylesLoaded = false;
function addSpinLoaderStyles() {
    if (spinStylesLoaded == true) return;
    spinStylesLoaded = true;
    GM_addStyle(`
        .spinLoader {
          border: 16px solid #f3f3f3; /* Light grey */
          border-top: 16px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 120px;
          height: 120px;
          animation: spin 2s linear infinite;

          position: fixed !important;
          top: 50%  !important;
          left: 50% !important;

        }

        @keyframes spin {
          0% { transform:  translate(-50%,-50%) rotate(0deg); }
          100% { transform:  translate(-50%,-50%) rotate(360deg); }
        }
    `);
}

// Some quick alignment styles
//
// xfixed-vert - Align fixed vertical center screen
// xfixed-horiz - Fixed horizontal center
// xfixed-both - fixed both center - see also .xopts-ctr-screen
//
function addAlignmentStyles() {
    GM_addStyle(`
        .xfixed-vert {
            position: fixed;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .xfixed-horiz {
            position: fixed;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .xfixed-both {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    `);
}

// 'Floating' divs, see wartimer, hops timer, treat counter, blood bags...
function addFloatStyles() {
    GM_addStyle(`
         .x-float-outer {
            -ms-transform: translateX(-20%) translateY(-95%)  !important;
            -webkit-transform: translate(-20%,-95%) !important;
            transform: translate(-20%,-95%) !important;
            background: transparent;
            top: 32%;
            left: 84%;
        }
        .x-float-header {
            border-radius: 5px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
        .x-float-inner {
            border-radius: 5px;
            width: 200px;
            height: 40px;
            align-content: center;
            justify-content: center;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
        }
    `);
}

// Replacement for class .torn-btn,which I find cab flicker
// on hover-over sometimes, I think due to border width,
// padding and margin issues.
//
// Note: included with addButtonStyles() !!!
function addTornButtonExStyles() {
    GM_addStyle(`
        .xedx-torn-btn {
            height: 24px;
            width: 74px;
            line-height: 22px;
            font-family: "Fjalla One", Arial, serif;
            font-size: 14px;
            font-weight: normal;
            text-align: center;
            text-transform: uppercase;
            border-radius: 5px;
            padding: 0 10px;
            cursor: pointer;
            color: #555;
            color: var(--btn-color);
            text-shadow: 0 1px 0 #FFFFFF40;
            text-shadow: var(--btn-text-shadow);
            background: linear-gradient(180deg, #DEDEDE 0%, #F7F7F7 25%, #CFCFCF 60%, #E7E7E7 78%, #D9D9D9 100%);
            background: var(--btn-background);
            border: 1px solid #aaa;
            border: var(--btn-border);
            display: inline-block;
            vertical-align: middle;
         }
         .xedx-torn-btn:hover {
            filter: brightness(2.00);
         }
         .xedx-torn-btn:active {
            filter: brightness(0.80);
         }
         .xedx-torn-btn-raw {
            line-height: 22px;
            font-family: "Fjalla One", Arial, serif;
            font-size: 14px;
            font-weight: normal;
            text-align: center;
            text-transform: uppercase;
            border-radius: 5px;
            cursor: pointer;
            color: #555;
            color: var(--btn-color);
            text-shadow: 0 1px 0 #FFFFFF40;
            text-shadow: var(--btn-text-shadow);
            background: linear-gradient(180deg, #DEDEDE 0%, #F7F7F7 25%, #CFCFCF 60%, #E7E7E7 78%, #D9D9D9 100%);
            background: var(--btn-background);
            border: 1px solid #333;
            display: inline-block;
            vertical-align: middle;
         }
         .xedx-torn-btn-raw:hover {
            filter: brightness(1.50);
            border: 1px solid #222;
         }
         .xedx-torn-btn-raw:active {
            filter: brightness(0.80);
            border: 1px solid #111;
         }

        .x-rt-btn {
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            justify-content: center;
            width: 30px;
            border-radius: 30px;
            cursor: pointer;
            background-image: radial-gradient(rgba(170, 170, 170, 0.6) 0%, rgba(6, 6, 6, 0.8) 100%);
        }
        .x-rt-btn.r20 {
            width: 20px !important;
            height: 20px;
            border-radius: 20px !important;
        }
     `);
}

function addButtonStyles() {
    addTornButtonExStyles();
    addSortBtnStyles();

    // Add a width style to this to over-ride 20px if you want...
    GM_addStyle(`
        .x-round-btn {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-content: center;
            cursor: pointer;
            background-image: radial-gradient(rgba(170, 170, 170, 0.6) 0%, rgba(6, 6, 6, 0.8) 100%);
            width: 20px;
            height: 20px;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
        }
    `);
}

// Button itself:
// const toggleBtn = `<span class="x-toggle-sort"><i class="fas fa-caret-down"></i></span>`;
// Can set initial position: "fa-caret-up" : "fa-caret-down"
//
// Note: included with addButtonStyles() !!!
function addSortBtnStyles() {
    GM_addStyle(`
        .x-toggle-sort {
                position: relative;
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                cursor: pointer;
                width: 30px;
                opacity: 1;
                visibility: visible;
                transition: all .2s ease-in-out;
                float: right;
                vertical-align: bottom;
                align-content: center;
            }
            body:not(.dark-mode) .x-toggle-sort {
                background-image: radial-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(50, 50, 50, 0.6) 100%);
                border: none;
                color: #666l
            }
    `);
}


// Add the style(s) I use for tool-tips
// tooltip3 is *no longer* the correct one, with an opaque gray background
// tooltip4 sizes to content, current preferred version. May now also
// provide your own.
//
// Important: Add these to your script:
//
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
//
function addToolTipStyle() {
    toolTipStylesAdded = true;
    GM_addStyle(`.ui-helper-hidden-accessible {display: none;}`);
    GM_addStyle(`.tt-ws {white-space: pre-line;}`);
    GM_addStyle(".tooltip2 {" +
                "radius: 4px !important;" +
                "background-color: #ddd !important;" +
                "padding: 5px 20px;" +
                "border: 2px solid white;" +
                "border-radius: 10px;" +
                "width: 300px;" +
                "margin: 50px;" +
                "text-align: left;" +
                "font: bold 14px ;" +
                "font-stretch: condensed;" +
                "text-decoration: none;" +
                "}");

    GM_addStyle(".tooltip3 {" +
                "radius: 4px !important;" +
                "background-color: #000000 !important;" +
                "filter: alpha(opacity=80);" +
                "opacity: 0.80;" +
                "padding: 5px 20px;" +
                "border: 2px solid gray;" +
                "border-radius: 10px;" +
                "width: auto;" +
                "margin: 50px;" +
                "text-align: left;" +
                "font: bold 14px ;" +
                "font-stretch: condensed;" +
                "text-decoration: none;" +
                "color: #FFF;" +
                "font-size: 1em;" +
                "}");

    GM_addStyle(".tooltip4 {" +
                "radius: 4px !important;" +
                "background-color: #000000 !important;" +
                "filter: alpha(opacity=80);" +
                "opacity: 0.80;" +
                "padding: 5px 20px;" +
                "border: 2px solid gray;" +
                "border-radius: 10px;" +
                "width: fit-content;" +
                "margin: 50px;" +
                "text-align: left;" +
                "font: bold 14px ;" +
                "font-stretch: condensed;" +
                "text-decoration: none;" +
                "color: #FFF;" +
                "font-size: 1em;" +
                "line-height: 1.5;" +
                "z-index: 999999;" +
                "}");

    GM_addStyle(".tooltip5 {" +
                "radius: 4px !important;" +
                "background-color: #000000 !important;" +
                "filter: alpha(opacity=80);" +
                "opacity: 0.80;" +
                "padding: 5px 20px;" +
                "border: 2px solid gray;" +
                "border-radius: 10px;" +
                "width: fit-content;" +
                "margin: 10px;" +
                "text-align: left;" +
                "font: bold 14px ;" +
                "font-stretch: condensed;" +
                "text-decoration: none;" +
                "color: #FFF;" +
                "font-size: 1em;" +
                "z-index: 999999;" +
                "}");

    GM_addStyle(`
        .tooltip6 {
            position: relative;
            top: 225px !important;
            left: 480px !important;
            transform: translateX(-110%);
            background-color: #000000 !important;
            filter: alpha(opacity=80);
            opacity: 0.80;
            padding: 5px 20px;
            border: 2px solid gray;
            border-radius: 10px;
            width: fit-content;
            margin: 10px;
            text-align: left;
            font-weight: bold !important;
            font-stretch: condensed;
            text-decoration: none;
            color: #FFF;
            font-size: 13px;
            line-height: 1.5;
            z-index: 999;
        }
    `);
}

// Adds a tool tip to a node/element
// 'cl' is the name of a custom class if you want to pass that in.
function displayToolTip(node, text, cl) {
    $(document).ready(function() {
        $(node).attr("title", "original");
        $(node).tooltip({
            content: text,
            classes: {
                "ui-tooltip": cl ? cl : "tooltip3"
            }
        });
    })
}

// $().tooltip seems to be a JQuery UI function. There are lots of attributes:
// {
//   content:
//   disabled:
//   hide:
//   items:
//   position:
//   show:
//   tooltipClass:
//   track:
// }
//
// Didn't find "classes" doumentation. Position may be usefull!
// Instead of just passing one class here, pass array -
// or pass in an attributes object, and merge into the one we
// use here?
//
// Also has a for taking an "action" ! can change options dynamically,
// open/close, enable/disable, etc.
// Also can be set up to call functions on create, open, close!!
//
var toolTipStylesAdded = false;
function displayHtmlToolTip(node, text, cl) {
    if (toolTipStylesAdded == false) {
        debugger;
    }

    $(document).ready(function() {
        //let currAttr = $(node).attr("style");
        //let newAttr = "white-space: pre-line;" + (currAttr ? currAttr : "");
        $(node).attr("title", "original");
        $(node).attr("data-html", "true");
        //$(node).attr("style", newAttr);
        $(node).tooltip({
            content: text,
            classes: {
                "ui-tooltip": cl ? (cl + " tt-ws") : "tooltip3 tt-ws"
            }
        });
    })
}

// Adds a tool tip to a node/element
// 'cl' is the name of a custom class if you want to pass that in.
function displayToolTip2(node, text, cl) {
    $(document).ready(function() {
        $(node).attr("title", "original");
        $(node).tooltip({
            content: text,
            classes: {
                "ui-tooltip": cl ? cl : "tooltip4"
            }
        });
    })
}

// This was a test fn, can use the one above instead.
function displayMiniToolTip(node, text) {
    $(document).ready(function() {
        $(node).attr("title", "original");
        $(node).tooltip({
            content: text,
            classes: {
                "ui-tooltip": "tooltip4"
            }
        });
    })
}

// These classes are used to build a right-click context menu...
//
// context-wrapper is used in a div encompassing the context menu if desired, to see
// where it is. x-box is another diagnostic class to draw a box at a point to see where
// that would be. Once the menu is created and placed anywhere on the page, a click
// handler would do this:
//   $(cmSel).css("left", x.toString() + "px");
//   $(cmSel).css("top", y.toString() + "px");
//   $(cmSel).removeClass("ctxhide").addClass("ctxshow");
// to display and place somewhere onscreen. Menus can be appended to the UL.
// Sample HTML:
/*
    `<div id="x-contextMenu context-border" class="context-menu ctxhide">
        <ul>
            <li><a href="#">Menu 1</a></li>
            <li><a href="#">Menu 2</a></li>
            <li id="click-me"><a>Clickable Choice</a></li>
        </ul>
    </div`
*/
function addContextStyles() {
    GM_addStyle(`
        .context-wrapper {
            border: 1px solid red;
        }
        .context-menu {
            position: absolute;
            text-align: center;
            background: lightgray;
            margin: 2px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999999;
        }
        .context-border {
            border: 1px solid black;
            border-radius: 15px;
        }

        .ctxhide {display: none;}
        .ctxshow {display: block}

        .context-menu ul {
            padding: 0px;
            margin: 0px;
            min-width: 150px;
            list-style: none;
            border: 1px solid black;
        }

        .context-menu ul li {
            border-top: 1px solid black;

        }

        .context-menu ul li-ex {
            border: 1px solid black;
            border-radius: 5px;
            cursor: pointer;
            color: #555;
            color: var(--btn-color);
            text-shadow: 0 1px 0 #FFFFFF40;
            text-shadow: var(--btn-text-shadow);
            background: linear-gradient(180deg, #DEDEDE 0%, #F7F7F7 25%, #CFCFCF 60%, #E7E7E7 78%, #D9D9D9 100%);
            background: var(--btn-background);
            border: 1px solid #aaa;
            border: var(--btn-border);
            vertical-align: middle;
        }

        .context-menu ul li a {
            padding-bottom: 7px;
            padding-top: 7px;
            text-decoration: none;
            color: black;
            display: block;
        }

        .context-menu ul li:hover {
            background: darkgray;
        }
        .x-centered {
          position: fixed;
          top: 50%;
          left: 50%;
          /* bring your own prefixes */
          transform: translate(-50%, -50%);
        }
        .x-box {
            z-index: 20;
            width: 20px;
            height: 20px;
            border: 2px solid;
            border-color: black;
            display: block;
        }
    `);
}

function addBackgroundStyles () {
    GM_addStyle(`
        .xmed-li-rad {
            background: linear-gradient(180deg, #999999 0%, #333333 100%);
            border-top: 2px solid #111111;
        }

        .xbgb-var {background: var(--page-background-color) !important;}
        .xbgb {background: black !important;}
        .xbgb2 {background: rgba(0, 0, 0, .2) !important;}
        .xbgb4 {background: black; opacity: 0.4 !important;}
        .xbgb6 {background: black; opacity: 0.6 !important;}
        .xbgb8 {background: black; opacity: 0.8 !important;}
        .xbgt {background: transparent !important;}
    `);
}

//
// Styles to add a range slider. Example HTML:
//
// <span id="opts-bg-slider" class="slidecontainer xfmt-span">
//    <input class="slider2" type="range" min="56" max="232" value="211">
// </span>
//
function addRangeSliderStyles() {

    GM_addStyle(`
        .slidecontainer {
            width: 100%;
        }

        .slider2 {
            width: 100%;
        }

        .slider {
            -webkit-appearance: none;
            width: 100%;
            height: 25px;
            background: #d3d3d3;
            outline: none;
            opacity: 0.7;
            -webkit-transition: .2s;
            transition: opacity .2s;
        }

        .slider:hover {
            opacity: 1;
        }

        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 25px;
            height: 25px;
            background: #04AA6D;
            cursor: pointer;
        }

        .slider::-moz-range-thumb {
            width: 25px;
            height: 25px;
            background: #04AA6D;
            cursor: pointer;
        }
    `);
}

//
// These styles are used to create a 'floating' centered options dialog.
//
// Outermost styles:
//
//   xopts-ctr-screen - makes the div centered.
//   xshow-flex - use to display, instead of 'display: block' Can use any 'display: hide'
//                to hide, such as .xhide or .ctxhide Use addClass and removeClass, helper
//                functions are provided to make this easy.
//   xopts-bg: Defines background colors, border, z-order
//   xopts-def-size: Provides a common size I use
//
// For spans organized in rows or colums:
//
//   xfmt-hdr-span - Creates a 'header' with an underline, on a span
//   xfmt-hdr-span-c - same, but centered
//   xfmt-span - Defines a span as min 24 pix tall.
//
// Simple fonts:
//
//   xfmt-font-blk: 14px arial black
//   xfmt-font-blk input - 10px right margin for checkboxes, radio btns, etc.
//
// Misc:
//
//   .break: A hard line break between spans in flex boxes, to force to next row
//
function addFloatingOptionsStyles() {

    GM_addStyle(`
        .xopts-ctr-screen {
            position: fixed !important;
            top: 50%  !important;
            left: 50% !important;
            -ms-transform: translateX(-50%) translateY(-50%)  !important;
            -webkit-transform: translate(-50%,-50%) !important;
            transform: translate(-50%,-50%) !important;
        }
        .xshow-flex {
            display: flex !important;
        }
        .xopts-bg {
            background: lightgray;
            z-index: 999999;
            width: 360px !important;
            height: 380px !important;
        }
        .xopts-def-size {
            width: 360px !important;
            height: 380px !important;
        }
        .xfmt-hdr-span {
            border-bottom: 2px solid black;
            margin-top: 5px;
            margin-bottom: 5px;
            align-items: center;
            display: flex;
            vertical-align: middle;
            min-height: 24px;
        }
        .xfmt-hdr-spanc {
            border-bottom: 2px solid black;
            margin-top: 5px;
            margin-bottom: 5px;
            align-items: center;
            display: flex;
            vertical-align: middle;
            min-height: 24px;
            justify-content: center;
        }
        .xfmt-font-blk {
            color: black;
            font: 14px Arial, sans-serif;
        }
        .xfmt-font-blk input {
            margin-right: 10px;
        }
        .xfmt-span {
            min-height: 24px;
        }

        .break {
          flex-basis: 100%;
          height: 0;
        }
    `);
}

// Flexbox styles mostly used for floating options/help divs
// See Hospital Timer, NPC AttackWatcher, the Nerve Context Options dialog...
//
// .xfr-center: flex row, centered vert & horiz
//
function addFlexStyles() {
    GM_addStyle(`
        .xflexr {
            display: flex;
            flex-flow: row wrap;
        }
        .xflexr-center {
            display: flex;
            flex-flow: row wrap;
            align-content: center;
            justify-content: center;
        }
        .xflex-center {
            align-content: center;
            justify-content: center;
        }
        .xflexc {
            display: flex;
            flex-direction: column;
        }
        .xflexc-center {
            flex-direction: column;
            align-content: center;
            justify-content: center;
        }
        .xflexc-left {
            flex-direction: column;
            align-content: flex-start !important;
            width: 100%;
        }
        .xflexr-24p {
            minimum-height: 24px !important;
            padding-top: 15px !important;
        }
        .xshow-flex {
            display: flex !important;
        }
        .xflex {
            display: flex;
        }
    `);
}

function addBorderStyles() {

    GM_addStyle(`
        .xbblue {border: 1px solid blue;}
        .xbred {border: 1px solid red;}
        .xbgreen {border: 1px solid limegreen;}
        .xbyellow {border: 1px solid yellow;}
        .xbwhite {border: 1px solid white;}
        .xbblack {border: 1px solid black;}

        .xbblue2 {border: 2px solid blue;}
        .xbred2 {border: 2px solid red;}
        .xbgreen2 {border: 2px solid limegreen;}
        .xbyellow2 {border: 2px solid yellow;}
        .xbwhite2 {border: 2px solid white;}
        .xbblack2 {border: 2px solid black;}

        .xbgreen-inset {box-shadow: inset 0px 0px 2px 4px limegreen;}
        .xbgreen-inset-sm {box-shadow: inset 1px 0px 0px 2px #0eb30e;}

        .xopts-border-insert-tl {
            border-radius: 15px;
            box-shadow: 0 20px 10px -20px rgba(0,0,0,0.45) inset, -20px 0 10px -20px rgba(0,0,0,0.45) inset;
        }
        .xopts-border-insert-br {
            border-radius: 15px;
            box-shadow: 0 -20px 10px -20px rgba(0,0,0,0.45) inset, -20px 0 10px -20px rgba(0,0,0,0.45) inset;
        }
        .xopt-border-ml6 {
            border-radius: 15px;
            box-shadow: 0 29px 52px rgba(0,0,0,0.40), 0 25px 16px rgba(0,0,0,0.20);
        }
        .xopt-border-ml7 {
            border-radius: 15px;
            box-shadow: 0 45px 65px rgba(0,0,0,0.50), 0 35px 22px rgba(0,0,0,0.16);
        }
        .xopt-border-ml8 {
            border-radius: 15px;
            box-shadow: 0 60px 80px rgba(0,0,0,0.60), 0 45px 26px rgba(0,0,0,0.14);
        }
        .xopts-border-10 {
            border-radius: 15px;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
        }
        .xopts-border-27 {
            border-radius: 15px;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
        }
        .xopts-border-87 {
            border-radius: 15px;
            box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
        }
        .xopts-border-88 {
            border-radius: 15px;
            border: 3px solid darkslategray;
        }
        .xopts-border-89 {
            border-radius: 15px;
            box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
        }
    `);
}

// Styles for all sorts of cursors
function addCursorMovingStyles() {
    GM_addStyle(`
        .grab {cursor: -webkit-grab; cursor: grab;}
        .grabbing {cursor: -webkit-grabbing; cursor: grabbing;}
        .move {cursor: move;}

        .col-resize {cursor: col-resize;}
        .e-resize {cursor: e-resize;}
        .ew-resize {cursor: ew-resize;}
        .n-resize {cursor: n-resize;}
        .ne-resize {cursor: ne-resize;}
        .nesw-resize {cursor: nesw-resize;}
        .ns-resize {cursor: ns-resize;}
        .nw-resize {cursor: nw-resize;}
        .nwse-resize {cursor: nwse-resize;}
        .row-resize {cursor: row-resize;}
        .s-resize {cursor: s-resize;}
        .se-resize {cursor: se-resize;}
        .sw-resize {cursor: sw-resize;}
        .w-resize {cursor: w-resize;}
    `);
}

function addCursorStyles() {
    GM_addStyle(`
        .alias {cursor: alias;}
        .all-scroll {cursor: all-scroll;}
        .auto {cursor: auto;}
        .cell {cursor: cell;}
        .context-menu {cursor: context-menu;}
        .copy {cursor: copy;}
        .crosshair {cursor: crosshair;}
        .default {cursor: default;}
        .help {cursor: help;}
        .no-drop {cursor: no-drop;}
        .none {cursor: none;}
        .not-allowed {cursor: not-allowed;}
        .pointer {cursor: pointer;}
        .progress {cursor: progress;}
        .text {cursor: text;}
        .url {cursor: url(myBall.cur),auto;}
        .wait {cursor: wait;}
        .zoom-in {cursor: zoom-in;}
        .zoom-out {cursor: zoom-out;}
    `);
}

// General stuff without good categories
//
//   xhide - hides an element (display: hide)
//   xshow - shows an element (display: block) Note you need other styles
//           for flex, etc. See the floating opts styles for another example
//   xshowi - As above, for iinline-block elements
//   xhyperlink - Dims hyperlins a tad. Likely will change...
//   xinit, xunset - supposed to unset or re-init alll inherited styles.
//                   Not supported everywhere, look up "all: unset" or "all: init"
//   wnnnp - width nnn%
function loadMiscStyles() {
    GM_addStyle(`
        .xhide {
            display: none;
        }
        .xshow {
            display: block;
        }
        .xshowi {
            display: inline-block;
        }
        .xshowif {
            display: inline-flex;
        }
        .xshowf {
            display: flex;
        }
        .xhyperlink {
            /*filter: brightness(85%);*/
        }
        .x-init {
            all: initial;
        }
        .x-unset {
            all: unset;
        }
        .x-ez-scroll {
            overflow: auto;
            padding: 20px;
            overflow-y: auto;
            top: 0px;
        }
        .xz {
            z-index: 999999;
        }
       .xscrollLock {
           max-height: 90vh;
           overflow-y: auto;
           top: 0px;
           position: sticky;
       }
       .xedx-caret {
           padding-top:5px;
           padding-bottom:5px;
           padding-left:20px;
           padding-right:10px;
       }

       .w20p {width: 20%;}
       .w25p {width: 25%;}
       .w30p {width: 30%;}
       .w35p {width: 35%;}
       .w40p {width: 40%;}
       .w45p {width: 45%;}
       .w50p {width: 50%;}
       .w60p {width: 60%;}
       .w70p {width: 70%;}
       .w80p {width: 80%;}
    `);
}

// Colors referenced by TTS, unify all colors in all scripts eventually.
function loadTtsColors() {
    GM_addStyle(`
        .xedx-green {
            color: limegreen;
        }
        .xedx-red {
            color: red;
        }
        .xedx-offred {
            color: #FF2B2B;
        }
        .xedx-green-b {
            background: lime;
            -webkit-animation: highlight-active 1s linear 0s infinite normal;
            animation: highlight-active 1s linear 0s infinite normal;
        }
    `);
}

function loadCommonMarginStyles() {
    GM_addStyle(`

        .x-margin3 {
            border-left: 2px solid steelblue;
            border-right: 2px solid steelblue;
            border-bottom: 2px solid steelblue;
        }
        .xmb3 {
            margin-bottom: 3px;
        }
        .xmb5 {
            margin-bottom: 5px;
        }
        .xmb10 {
            margin-bottom: 10px;
        }
        .xmb20 {
            margin-bottom: 20px;
        }
        .xmb30 {
            margin-bottom: 30px;
        }
        .xml5 {
            margin-left: 5px;
        }
        .xml10 {
            margin-left: 10px;
        }
        .xml14 {
            margin-left: 14px;
        }
        .xml20 {
            margin-left: 20px;
        }
        .xmr5 {
            margin-right: 5px;
        }
        .xmr10 {
            margin-right: 10px;
        }
        .xmr20 {
            margin-right: 20px;
        }
        .xmt3 {
            margin-top: 3px;
        }
        .xmt5 {
            margin-top: 5px;
        }
        .xmt10 {
            margin-top: 10px;
        }
        .xmt20 {
            margin-top: 20px;
        }

    `);
}

function addDraggableStyles() {
    GM_addStyle(`
        .x-drag {
            position: fixed;
            display: flex;
            z-index: 999998;
            overflow: scroll;
            border: 1px solid steelblue;
            border-radius: 10px;
            background: var(--default-bg-panel-color) none repeat scroll 0% 0% / auto padding-box border-box;
        }
    `);
}


