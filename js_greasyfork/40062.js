// ==UserScript==
// @name           KNet deeplink fetcher.
// @namespace      http://www.amazon.com
// @description    Easy deep KNet link (https://portal2010.amazon.com/sites/tld/gll/Shared%20Documents/KNet/KNetQRG--DeepLinks-2014-03.pdf) generation to easily copy and share important KNET trainings with your colleagues. Particularly useful for any Amazon trainer or HR employee.
// @include        https://knet.csod.com/LMS/LoDetails/*
// @include        https://knet.csod.com/LMS/catalog/EventsCalendar.aspx*
// @authors        Vassilis Moustakas (vmous@)
// @grant          none
// @version        1
// @downloadURL https://update.greasyfork.org/scripts/40062/KNet%20deeplink%20fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/40062/KNet%20deeplink%20fetcher.meta.js
// ==/UserScript==

function FetcherAction (gmEvent) {
    var curURL = window.location.href;
    var deeplink = null;
    if (curURL.indexOf('LoDetails') > -1) {
        deeplink = GetSessionEventDeepLink(curURL);
    }
    else if (curURL.indexOf('EventsCalendar.aspx') > -1) {
        deeplink = GetCalendarDeepLink(curURL);
    }

    if (deeplink) {
        window.prompt("Copy to clipboard: Ctrl+c (Cmd+c for Mac), Enter", deeplink);
    }
    else {
        window.alert("Could not get a deep KNET link from this page :(");
    }
}

// Create the deeplink fetcher anchor and bind it to the construction method.
function SetupAnchor() {
    var elem = document.createElement('a');
    elem.setAttribute('href', 'javascript:void(0)');
    elem.appendChild(document.createTextNode('Gimme the deep KNet link!'));
    elem.addEventListener('click', function() {
        FetcherAction();
    }, false);

    return elem;
}

// Session and Event pages deeplink construction.
function GetSessionEventDeepLink(curURL) {
    var deeplink = null;
    var match = curURL.match(/[?&]loid=([^&]+)/i);
    var loid = match ? match[1] : null;
    if (loid) {
        deeplink = 'https://knet.amazon.com/?/LMS/LoDetails/DetailsLo.aspx?loid=' + loid;
    }

    return deeplink;
}

// Events Calendar page deeplink construction.
function GetCalendarDeepLink(curURL) {
    var deeplink = curURL.replace('csod.com','amazon.com/?');

    return deeplink;
}

// Place the deeplink fetcher anchor in the page.
function InjectAnchor() {
    var curURL = window.location.href;
    var elem = null;
    var whereTo = null;
    if (curURL.indexOf('LoDetails') > -1) {
        elem = SetupAnchor();
        // Style the anchor accordingly.
        elem.setAttribute('class', 'cso-btn cso-btn-large cso-btn-blue cso-corner cso-cont-marr5');
        whereTo = document.getElementById('dialog-trainingPurpose');
        if (elem && whereTo) {
            whereTo.parentNode.appendChild(elem, whereTo);
        }
    }
    else if (curURL.indexOf('EventsCalendar.aspx') > -1) {
        elem = SetupAnchor();
        whereTo = document.getElementById('lnkModeDay');
        if (elem && whereTo) {
            whereTo.parentNode.insertBefore(elem, whereTo);
        }
    }
}

// Do it!
InjectAnchor();



















































// Create functions which are known to be 
// missing from Chrome's Greasemonkey API
if (typeof GM_getValue == 'undefined') {
    GM_getValue = function(name, defaultValue) {
        var value = localStorage.getItem(name);
        if (!value)
            return defaultValue;
        var type = value[0];
        value = value.substring(1);
        switch (type) {
            case 'b':
                return value == 'true';
            case 'n':
                return Number(value);
            default:
                return value;
        }
    }
}

if (typeof GM_setValue == 'undefined') {
    GM_setValue = function(name, value) {
        value = (typeof value)[0] + value;
        localStorage.setItem(name, value);
    }
}

if (typeof GM_log == 'undefined') {
    GM_log = function(message) {
        console.log(message);
    }
}

var NinjaAutoUpdate = new Object();
NinjaAutoUpdate.version = "1";
NinjaAutoUpdate.delta = 60 * 60 * 24 * 3; //3 days (?)

NinjaAutoUpdate.getEpoch = function() {
    return Math.round((new Date()).getTime()/1000);
};

NinjaAutoUpdate.init = function() {
    // check new version
    // compute current time
    var now = NinjaAutoUpdate.getEpoch();
    var updateAt = GM_getValue("NinjaAutoUpdate_LAST_CHECK", 0) + NinjaAutoUpdate.delta;

    if (updateAt > now) return; // dont do anything 
  
    // do a check
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://improvement-ninjas.amazon.com/gmget.cgi?check=knet_deeplink_fetcher.user.js',
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
        },
        onload: NinjaAutoUpdate.callback
        });
    // record time of last check
    GM_setValue("NinjaAutoUpdate_LAST_CHECK", NinjaAutoUpdate.getEpoch());
};

NinjaAutoUpdate.callback = function(response) {
    if (! Number(response.responseText)) {
        // ERROR!? What can be done now? Not a lot i reckon...
        return;
    }
    if (NinjaAutoUpdate.version != Number(response.responseText)) {
        NinjaAutoUpdate.createAlert();
    }
};

NinjaAutoUpdate.ignore = function(event) {
    GM_setValue("NinjaAutoUpdate_LAST_CHECK", NinjaAutoUpdate.getEpoch());
    NinjaAutoUpdate.cancelAlert();
    if (typeof event === "object" && typeof event.stopPropagation === "function") {
      event.stopPropagation();
    }
};

NinjaAutoUpdate.install = function() {
    window.open('https://improvement-ninjas.amazon.com/gmget.cgi?get=knet_deeplink_fetcher.user.js');
    NinjaAutoUpdate.cancelAlert();
    GM_setValue("NinjaAutoUpdate_LAST_CHECK", NinjaAutoUpdate.getEpoch());
    if (typeof event === "object" && typeof event.stopPropagation === "function") {
      event.stopPropagation();
    }
};

NinjaAutoUpdate.createAlert = function() {
    NinjaAutoUpdate.alert = document.createElement('div');
    NinjaAutoUpdate.alert.setAttribute('class', 'NinjaAutoUpdateOverlay');
    NinjaAutoUpdate.alert.innerHTML = "<style>.NinjaAutoUpdateOverlay {  font-size: 11px;  position: relative;  margin: 0 0 0 0;  padding: 4px 10px;  text-align: left;  z-index: 1000;  cursor: pointer;  background-color: #FFFFD5;  border-bottom:1px solid #E47911;  color: #990000;}.NinjaAutoUpdateOverlay a {  padding: 0px 4px;}.NinjaAutoUpdateOverlay .nau-right {  float: right;}</style><div>    <span style='font-size:larger'>    A new version of <strong>'knet_deeplink_fetcher.user.js'</strong> is available!    </span>  <a href='#' id='NinjaAutoUpdateInstall-knet_deeplink_fetcher.user.js'>    Get the new one!  </a>  <a href='#' id='NinjaAutoUpdateIgnore-knet_deeplink_fetcher.user.js' class='nau-right'>    Ignore for a few days  </a></div>";
    var first = document.body.firstChild;
    document.body.insertBefore(NinjaAutoUpdate.alert, first);
    document.getElementById("NinjaAutoUpdateInstall-knet_deeplink_fetcher.user.js").addEventListener("click", NinjaAutoUpdate.install, false);
    document.getElementById("NinjaAutoUpdateIgnore-knet_deeplink_fetcher.user.js").addEventListener("click", NinjaAutoUpdate.ignore, false);
};

NinjaAutoUpdate.cancelAlert = function() {
  if (typeof NinjaAutoUpdate.alert === "object") {
    NinjaAutoUpdate.alert.parentNode.removeChild(NinjaAutoUpdate.alert);
    NinjaAutoUpdate.alert = undefined;
  }
};

// Init without waiting for load event, this code
// doesnt depend on any loaded DOM elements
NinjaAutoUpdate.init();
