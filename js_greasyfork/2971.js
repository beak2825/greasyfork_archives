// ==UserScript==
// @name        Free Trader
// @namespace   passiveaggressiveboot
// @description Does various things for the Pirates Glory games, see additional info.
// @license     MIT
// @include     *s2.piratesglory.com/*
// @version     8
// @downloadURL https://update.greasyfork.org/scripts/2971/Free%20Trader.user.js
// @updateURL https://update.greasyfork.org/scripts/2971/Free%20Trader.meta.js
// ==/UserScript==
// This script comes with ABSOLUTELY NO GUARANTEE OF ANY KIND. Or cookies.
//
//
//don't run on frames or iframes
if (window.top != window.self) return;
//
window.addEventListener('load', LocalMain, false);
//
var refresh_min  =  3,
    refresh_max  =  5,
    helper_links = {
        'General Trade Report': 'http://s2.piratesglory.com/?page=treasury&action=trade_report&id=1',
        'Show Fleets Profit': 'http://s2.piratesglory.com/index.php?action=ships&sort_type=profit',
        'Hunt for new Treasure': 'http://s2.piratesglory.com/index.php?page=treasure&action=hunt',
        'List Trade Routes': 'http://s2.piratesglory.com/index.php?page=market&action=list_trade_route'
    };
var presents_page  = 'http://s2.piratesglory.com/index.php?page=profile&action=presents',
    news_page      = 'http://s2.piratesglory.com/index.php?page=news',
    presents_pages = [
        'http://s2.piratesglory.com/?page=profile&action=presents&store=present1',
        'http://s2.piratesglory.com/?page=profile&action=presents&store=present2',
        'http://s2.piratesglory.com/?page=profile&action=presents&store=present3'
    ];
//
// Notification permission request
var Notification = window.Notification || window.mozNotification || window.webkitNotification;
Notification.requestPermission(function (permission) {
    console.log('Permission to use notifications is ' + permission);
});
//
// In place editing
var editing = false;
if (document.getElementById && document.createElement) {
    var butt = document.createElement('BUTTON');
    var buttext = document.createTextNode('OK');
    butt.appendChild(buttext);
    butt.onclick = saveEdit;
}

//
function LocalMain() {
    // Refresh at random intervals
    function getRandomInt(min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + min) * 60 * 1000;
    }
    random_int = getRandomInt(refresh_min, refresh_max);
    setTimeout(function () {
        window.location.reload();
    }, random_int);
    //
    // Panel with various info.
    var panel = document.createElement('div'),
        turns = (localStorage.getItem("GM_FreeTrader_warning_turns")) ? localStorage.getItem("GM_FreeTrader_warning_turns") : 0,
        gold = (localStorage.getItem("GM_FreeTrader_warning_gold")) ? localStorage.getItem("GM_FreeTrader_warning_gold") : 0;
    panel.innerHTML = '<div style="margin: 10px; border: 2px solid #ffffff; font-size: small; background-color: #000000; color: #ffffff;' +
    'position: absolute; float: right; right:0; padding: 10px;">' +
    '<div id="controls">Additional Controls<hr></div>'+
    '<br />Console<hr>' +
    '<span id="refresh-countdown"></span><br />' +
    '<br />Warnings<hr>' +
    '<div><span>Turns: </span><span id="turns" style="display: inline-block;"><p class="sgold" style="margin: 0px;">' + turns + '</p></span></div>' +
    '<div><span>Gold: </span><span id="gold" style="display: inline-block;"><p class="sgold" style="margin: 0px;">'+gold+'</p></span></div>' +
    '</div>';
    // Creates panel
    document.body.insertBefore(panel, document.body.firstChild);
    // Add helper links to panel
    HelperLinks();
    // Activates in-place editing
    panel.onclick = catchIt;
    // Check current page for related events.
    CheckCurrentPage();
    // Initiate the refresh countdown
    RefreshCountdown(random_int);
    // Check events and notify if necessary.
    CheckEvents();
};
//
// Check current page and make background changes
function CheckCurrentPage() {
    // Check Presents Page
    if (presents_pages.indexOf(location.href) != - 1) {
        sessionStorage.setItem('GM_FreeTrader_Presents_Checked', 'false');
    }
    if (news_page == location.href) {
        sessionStorage.setItem('GM_FreeTrader_News_Checked', 'false');
    }
};
//
// Check for presents
function CheckEvents() {
    var important_events = document.getElementsByClassName('xred');
    if (important_events.length > 0) {
        for (var i in important_events) {
            if (typeof important_events[i].textContent != 'undefined') {
                var important_event = important_events[i].textContent;
                if (important_event == '(Present Available)') {
                    if (!(sessionStorage.getItem('GM_FreeTrader_Presents_Checked') == 'true')) {
                        ShowNotification('Presents available!', 'presents', presents_page);
                    };
                };
                if (important_event.search(/event/) != - 1) {
                    if (!(sessionStorage.getItem('GM_FreeTrader_News_Checked') == 'true')) {
                       ShowNotification(important_event.slice(1, important_event.length - 1), 'news', news_page);
                    };
                };
            };
        };
    };
    
    var watched_items = document.getElementsByClassName("sgold"),
        turns_limit = localStorage.getItem("GM_FreeTrader_warning_turns"),
        gold_limit = localStorage.getItem("GM_FreeTrader_warning_gold");
    for (var item in watched_items) {
        if (typeof watched_items[item].textContent != 'undefined') {
            if (watched_items[item].getAttribute("href") == "index.php?page=crs" && turns_limit) {
                if (parseInt(watched_items[item].textContent) >= parseInt(turns_limit)) {
                    if (sessionStorage.getItem('GM_FreeTrader_Turn_Limit_Checked') != 'true') {
                        ShowNotification( watched_items[item].textContent + ' turns available - limit at '+turns_limit, 'turn_limit_warning' );
                    };}
                else {
                    sessionStorage.setItem("GM_FreeTrader_Turn_Limit_Checked", "false");
                };
            };
            if (watched_items[item].getAttribute("href") == "index.php?page=treasury" && gold_limit) {
                if (parseInt(watched_items[item].textContent.replace(/\,/g,'')) >= parseInt(gold_limit)) {
                    if (sessionStorage.getItem('GM_FreeTrader_Gold_Limit_Checked') != 'true') {
                        ShowNotification( watched_items[item].textContent + ' gold available - limit at '+gold_limit, 'gold_limit_warning' );
                    };}
                else {
                    sessionStorage.setItem("GM_FreeTrader_Gold_Limit_Checked", "false");
                };
            };
        };
    }
};
//
// Countdown for refresh. Needs to be visible for now.
function RefreshCountdown(countdown_time) {
    var target_date = new Date() .getTime() + countdown_time,
    days,
    hours,
    minutes,
    seconds,
    countdown = document.getElementById('refresh-countdown');
    setInterval(function () {
        var current_date = new Date() .getTime(),
        seconds_left = (target_date - current_date) / 1000;
        minutes = parseInt(seconds_left / 60);
        seconds = parseInt(seconds_left % 60);
        countdown.innerHTML = 'Refresh in: ' + minutes + 'm, ' + seconds + 's';
    }, 480);
};
//
// Show a notification message.
function ShowNotification(message, message_tag = 'hahahaha', target_location = '#') {
    message_title = 'Pirates Glory'
    var instance = new Notification(message_title, {
        icon: 'http://s2.piratesglory.com/favicon.ico',
        tag: message_tag,
        body: message
    });
    instance.onclick = function () {
        location.href = target_location
        if (message_tag == 'presents') {
            sessionStorage.setItem('GM_FreeTrader_Presents_Checked', 'true');
        };
        if (message_tag == 'news') {
            sessionStorage.setItem('GM_FreeTrader_News_Checked', 'true');
        };
        if (message_tag == 'turn_limit_warning') {
            sessionStorage.setItem('GM_FreeTrader_Turn_Limit_Checked', 'true');
        };
        if (message_tag == 'gold_limit_warning') {
            sessionStorage.setItem('GM_FreeTrader_Gold_Limit_Checked', 'true');
        };
    };
    instance.onerror = function () {
        console.log('Cannot display notification for some reason.');
    };
    //     instance.onshow = function () {
    //         // Something to do
    //     };
    instance.onclose = function () {
    };
    return false;
};

function catchIt(e) {
    if (editing) return;
    if (!document.getElementById || !document.createElement) return;
    if (!e) var obj = window.event.srcElement;
    else var obj = e.target;
    while (obj.nodeType != 1) {
        obj = obj.parentNode;
    }
    if (obj.tagName == "INPUT" || obj.tagName == 'A') return;
    while (obj.nodeName != 'P' && obj.nodeName != 'HTML') {
        obj = obj.parentNode;
    }
    if (obj.nodeName == 'HTML') return;
    var x = obj.innerHTML;
    var y = document.createElement("INPUT");
    var z = obj.parentNode;
    y.setAttribute("type", "text")
    y.setAttribute("size", "5")
    z.insertBefore(y,obj);
    z.insertBefore(butt,obj);
    z.removeChild(obj);
    y.value = x;
    y.focus();
    editing = true;
}
function saveEdit() {
    var area = document.getElementsByTagName("INPUT")[0];
    var y = document.createElement('P');
    var z = area.parentNode;
    y.setAttribute("class", "sgold");
    y.setAttribute("style", "margin: 0px;");
    var reg = /^\d+$/;
    if (reg.test(parseInt(area.value))) {
        localStorage.setItem('GM_FreeTrader_warning_' + z.id, parseInt(area.value));
    };
    y.innerHTML = area.value;
    z.insertBefore(y,area);
    z.removeChild(area);
    z.removeChild(document.getElementsByTagName('button')[0]);
    editing = false;
}
//
// Helper Links
function HelperLinks() {
    if (helper_links.length == -1) return;
    var controls = document.getElementById("controls");
    var link_list = document.createElement("ul");
    link_list.setAttribute("id", "helper_links");
    controls.appendChild(link_list);
    for (var k in helper_links) {
        if (helper_links.hasOwnProperty(k)) {
            var list_item = document.createElement("li");
            var link = document.createElement("a");
            link.setAttribute("href", helper_links[k]);
            link.textContent = k;
            list_item.appendChild(link);
            link_list.appendChild(list_item);
        };
    };
};



// The cookie part is non-negotiable.