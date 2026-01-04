// ==UserScript==
// @name         The Ruiner of Alis.io (Speed_Hack,Faster_Split,Faster_Macro,Crazy_Settings)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script is made up of Acydwarp's thoughts so give your kiddiot questions to him! The best perfomance for Instant and other game modes. Auto-Double,Fast Macro,Auto Respawn and other fun features. Have fun!
// @author       PutinWarp aka Zian (zian.pp.ua)
// @match        http://alis.io/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        1$
// @downloadURL https://update.greasyfork.org/scripts/34344/The%20Ruiner%20of%20Alisio%20%28Speed_Hack%2CFaster_Split%2CFaster_Macro%2CCrazy_Settings%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34344/The%20Ruiner%20of%20Alisio%20%28Speed_Hack%2CFaster_Split%2CFaster_Macro%2CCrazy_Settings%29.meta.js
// ==/UserScript==

// Thanks Acydwarp for stealing my ideas :)

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
window.addEventListener('keydown', Hotkey);
window.addEventListener('mouseup', mouseup);


// INFORMATIONS

//alert something important
//if(localStorage.tm_alerted !== 'true'){}


//text in the middle
addLoadEvent(function () {
    if (localStorage.getItem('tm_adblock') === "true") {
        var middle_text = document.createElement("center");
        document.getElementById('ad_main').appendChild(middle_text);
        middle_text.style.color = '#bebebe';
        middle_text.style.fontSize = 'medium';
        var middle_text1 = document.createElement("a");
        middle_text.appendChild(middle_text1);
        middle_text1.id = "middle_text1";
        middle_text1.href = "https://greasyfork.org/en/forum/post/discussion?script=28987";
        middle_text1.target = "_blank";
        middle_text1.innerHTML = 'Feedback, Ideas, Bugs';
        middle_text.style.opacity = "0";
        fadeIn_middle_text();
    }

    function fadeIn_middle_text() {
        if (middle_text.style.opacity <= 1) {
            middle_text.style.opacity = JSON.parse(middle_text.style.opacity) + 0.1;
            setTimeout(fadeIn_middle_text, 30);
        }
    }
});



// ------------------------END OF INFORMATIONS------------------------


// CRAZY SETTINGS

// shortly faster rejoin
respawnDelay = 180;

document.getElementById('settingsoverlays').style.height = "565px";

var unlock_crazy_settings = document.createElement("div");
unlock_crazy_settings.className = "checkbox";
var unlock_crazy_settingsLabel = document.getElementsByClassName("checkbox")[0].children[0].cloneNode(true);
document.getElementsByClassName('drawdelay')[0].insertBefore(unlock_crazy_settings, document.getElementById('draw_delay1').nextSibling);
unlock_crazy_settings.appendChild(unlock_crazy_settingsLabel);
unlock_crazy_settingsLabel.childNodes[1].textContent = "Crazy Settings";
unlock_crazy_settingsLabel.firstChild.checked = false;

unlock_crazy_settingsLabel.onclick = function () {
    if (unlock_crazy_settingsLabel.firstChild.checked) {
        document.getElementById('max_draw_time').min = "0";
        document.getElementById('max_draw_time').max = "1000";

        document.getElementById('draw_delay1').min = "0";
        document.getElementById('draw_delay1').max = "1000";

        document.getElementById('opt_zoom_speed').min = "0.1";
        document.getElementById('opt_zoom_speed').max = "1.9";

        document.getElementById('opt_zoom_speed').onclick = function () {
            if (JSON.parse(document.getElementById('txt_zoom_speed').innerHTML) > 1) {
                document.getElementById('txt_zoom_speed').innerHTML += " INVERSED";
            }
        };
    } else {
        document.getElementById('max_draw_time').min = "25";
        document.getElementById('max_draw_time').max = "200";

        document.getElementById('draw_delay1').min = "120";
        document.getElementById('draw_delay1').max = "250";

        document.getElementById('opt_zoom_speed').min = "0.88";
        document.getElementById('opt_zoom_speed').max = "0.99";

        document.getElementById('opt_zoom_speed').removeAttribute("onclick");
    }
};
// ------------------------END OF CRAZY SETTINGS------------------------


// CHECKBOXES / HOTKEYINPUTS

var specialCases = {
    0: "",
    9: "TAB",
    13: "ENTER",
    16: "SHIFT",
    27: "ESCAPE"
};

//create Adblock checkbox
var AdblockContainer = document.createElement("div");
AdblockContainer.className = "checkbox";
var AdblockLabel = document.getElementsByClassName("checkbox")[0].children[0].cloneNode(true);
document.getElementsByClassName('settings3')[0].insertBefore(AdblockContainer, document.getElementsByClassName("checkbox")[22].nextSibling);
AdblockContainer.appendChild(AdblockLabel);
var Adblock = AdblockLabel.children[0];
AdblockLabel.childNodes[1].textContent = "Adblock";
AdblockLabel.title = "This will refresh the page!";
Adblock.checked = JSON.parse(localStorage.getItem('tm_adblock'));
if (Adblock.checked) {
    document.getElementById("ad_bottom").remove(); // remove bottom ad;
    document.getElementById('ad_right').remove();
    while (document.getElementById("ad_main").firstChild) //remove middle ad;
        document.getElementById("ad_main").firstChild.remove();
}


// create Switch Gamemode Hk
var SwitchHk = document.createElement("div");
SwitchHk.className = "row";
var SwitchHkLabel1 = document.createElement("div");
SwitchHkLabel1.className = "cell hotkey";
document.getElementById('hotkey_table').insertBefore(SwitchHk, document.getElementsByClassName("row")[0]);
SwitchHk.appendChild(SwitchHkLabel1);
var SwitchHkLabel2 = document.createElement("div");
SwitchHkLabel2.className = "cell";
SwitchHkLabel2.textContent = "Switch Gamemode";
SwitchHk.appendChild(SwitchHkLabel2);
SwitchHkLabel1.textContent = specialCases[localStorage.getItem('tm_hk_switch')] || localStorage.getItem('tm_hk_switch') ? String.fromCharCode(localStorage.getItem('tm_hk_switch')) : "";

// create Previous-Server Hk
var PrevHk = document.createElement("div");
PrevHk.className = "row";
var PrevHkLabel1 = document.createElement("div");
PrevHkLabel1.className = "cell hotkey";
document.getElementById('hotkey_table').insertBefore(PrevHk, document.getElementsByClassName("row")[0]);
PrevHk.appendChild(PrevHkLabel1);
var PrevHkLabel2 = document.createElement("div");
PrevHkLabel2.className = "cell";
PrevHkLabel2.textContent = "Previous Server";
PrevHk.appendChild(PrevHkLabel2);
PrevHkLabel1.textContent = specialCases[localStorage.getItem('tm_hk_prev')] || localStorage.getItem('tm_hk_prev') ? String.fromCharCode(localStorage.getItem('tm_hk_prev')) : "";

// create Next-Server Hk
var NextHk = document.createElement("div");
NextHk.className = "row";
var NextHkLabel1 = document.createElement("div");
NextHkLabel1.className = "cell hotkey";
document.getElementById('hotkey_table').insertBefore(NextHk, document.getElementsByClassName("row")[0]);
NextHk.appendChild(NextHkLabel1);
var NextHkLabel2 = document.createElement("div");
NextHkLabel2.className = "cell";
NextHkLabel2.textContent = "Next Server";
NextHk.appendChild(NextHkLabel2);
NextHkLabel1.textContent = specialCases[localStorage.getItem('tm_hk_next')] || localStorage.getItem('tm_hk_next') ? String.fromCharCode(localStorage.getItem('tm_hk_next')) : "";

// create Spectate Hk
var SpecHk = document.createElement("div");
SpecHk.className = "row";
var SpecHkLabel1 = document.createElement("div");
SpecHkLabel1.className = "cell hotkey";
document.getElementById('hotkey_table').insertBefore(SpecHk, document.getElementsByClassName("row")[0]);
SpecHk.appendChild(SpecHkLabel1);
var SpecHkLabel2 = document.createElement("div");
SpecHkLabel2.className = "cell";
SpecHkLabel2.textContent = "Spectate";
SpecHk.appendChild(SpecHkLabel2);
SpecHkLabel1.textContent = specialCases[localStorage.getItem('tm_hk_spec')] || localStorage.getItem('tm_hk_spec') ? String.fromCharCode(localStorage.getItem('tm_hk_spec')) : "";

// create Play Hk
var PlayHk = document.createElement("div");
PlayHk.className = "row";
var PlayHkLabel1 = document.createElement("div");
PlayHkLabel1.className = "cell hotkey";
document.getElementById('hotkey_table').insertBefore(PlayHk, document.getElementsByClassName("row")[0]);
PlayHk.appendChild(PlayHkLabel1);
var PlayHkLabel2 = document.createElement("div");
PlayHkLabel2.className = "cell";
PlayHkLabel2.textContent = "Play";
PlayHk.appendChild(PlayHkLabel2);
PlayHkLabel1.textContent = specialCases[localStorage.getItem('tm_hk_play')] || localStorage.getItem('tm_hk_play') ? String.fromCharCode(localStorage.getItem('tm_hk_play')) : "";

//save checkbox states
document.getElementsByClassName('close-overlay')[0].onclick = function () {
    if (JSON.parse(localStorage.getItem('tm_adblock')) !== Adblock.checked) {
        localStorage.setItem("tm_adblock", Adblock.checked);
        location.reload();
    }
};
// ------------------------END OF CHECKBOXES / HOTKEYINPUTS------------------------

// AUTO RESPAWN & SPECTATE AFTER DEATH

addLoadEvent(function () {
    setMode();

    function fadeIn_BtnCon() {
        BtnContainer.style.opacity = JSON.parse(BtnContainer.style.opacity) + 0.05;
        setTimeout(fadeIn_BtnCon, 50);
    }
    window.setTimeout(function () {
        fadeIn_playBtn = setInterval(function () {
            if (window.getComputedStyle(document.getElementsByClassName('uk-button uk-button-default btn-play uk-button-large uk-width-small')[0], null).getPropertyValue('width') > "150px") {
                document.getElementsByClassName('uk-button uk-button-default btn-play uk-button-large uk-width-small')[0].style.width = parseInt(window.getComputedStyle(document.getElementsByClassName('uk-button uk-button-default btn-play uk-button-large uk-width-small')[0], null).getPropertyValue('width')) - 1 + "px";
                document.getElementsByClassName('uk-button uk-button-default btn-play uk-button-large uk-width-small')[0].style.marginLeft = parseInt(window.getComputedStyle(document.getElementsByClassName('uk-button uk-button-default btn-play uk-button-large uk-width-small')[0], null).getPropertyValue('margin-left')) + 1 + "px";
            } else {
                clearInterval(fadeIn_playBtn);

                document.getElementsByClassName('uk-button uk-button-default btn-play uk-button-large uk-width-small')[0].style.marginLeft = "0px";
                document.getElementsByClassName('uk-card uk-card-body uk-card-default')[1].insertBefore(BtnContainer, document.getElementsByClassName("uk-button uk-button-default btn-play")[0]);

                fadeIn_BtnCon();
            }
        }, 30);
    }, 1000);
});

//create Auto Respawn / Spectate after Death Button
var BtnContainer = document.createElement("button");
BtnContainer.className = "uk-button uk-button-default btn-spectate";
BtnContainer.style.right = "4px";
BtnContainer.style.paddingTop = "11px";
BtnContainer.style.opacity = '0';

function setMode() {
    if (JSON.parse(localStorage.getItem('tm_join/spec')) === 1) {
        BtnContainer.style.borderColor = "#1660a0";
        BtnContainer.innerHTML = "<h4>R</h4>";
        BtnContainer.title = "Auto-Respawn";
    } else if (JSON.parse(localStorage.getItem('tm_join/spec')) === 2) {
        BtnContainer.style.borderColor = "#1660a0";
        BtnContainer.innerHTML = "<h4>S</h4>";
        BtnContainer.title = "Spectate after Death";
    } else {
        BtnContainer.style.borderColor = "#3c3c3c";
        BtnContainer.innerHTML = "";
        BtnContainer.title = "";
    }
}

//user button
mouseover = false;
BtnContainer.onmouseover = function () {
    mouseover = true;
};
BtnContainer.onmouseout = function () {
    mouseover = false;
};

function mouseup(event) {
    if (mouseover) {
        if (event.button === 0) {
            if (JSON.parse(localStorage.getItem('tm_join/spec')) < 2) {
                localStorage.setItem('tm_join/spec', JSON.parse(localStorage.getItem('tm_join/spec')) + 1);
            } else {
                localStorage.setItem('tm_join/spec', "0");
            }
            setMode();
        }
        if (event.button === 2) { //insert interval
            swal({
                title: 'Set check interval',
                html: '<p>in milliseconds</p><p>Low value may cause lag, recommended is 50-200.',
                input: 'range',
                inputAttributes: {
                    min: 0,
                    max: 300,
                    step: 10
                },
                inputValue: localStorage.getItem('tm_interval')
            }).catch(swal.noop).then(function (result) {
                if (result !== undefined && result !== localStorage.getItem('tm_interval')) {
                    localStorage.setItem('tm_interval', result);
                    swal({
                        title: 'Refresh required',
                        text: 'Refresh to take affect!',
                        type: 'error',
                        showCancelButton: 'true',
                        confirmButtonText: 'Yes, refresh now!',
                        cancelButtonText: 'No, refresh later!',
                        onOpen: function () {
                            swal.getConfirmButton().onclick = function () {
                                location.reload();
                            };
                        }
                    }).catch(swal.noop);
                }
            });
        }
    }
}

//respawn & spectate function
var overlay = false;
var just_joined = false;

window.setInterval(function () {
    if (isJoinedGame !== true && myApp.isSpectating !== true && currentIP !== "" && overlay !== true) {
        if (JSON.parse(localStorage.getItem('tm_join/spec')) === 1 && just_joined !== true) {
            document.getElementsByClassName('uk-button uk-button-default btn-play uk-button-large uk-width-small')[0].click();
            just_joined = true;
            window.setTimeout(function () {
                just_joined = false;
            }, 100);
        } else if (JSON.parse(localStorage.getItem('tm_join/spec')) === 2) {
            spectate();
        }
    }
    overlay = document.getElementById('overlays').style.display === "none" ? false : window.setTimeout(function () {
        overlay = true;
    }, 100);
}, localStorage.getItem('tm_interval'));

// Spectate after joining a server
window.setInterval(function () {
    if (window.webSocket !== undefined && webSocket.readyState === 0)
        setTimeout(spectate, 300);
}, 100);
// ------------------------END OF AUTO RESPAWN & SPECTATE AFTER DEATH------------------------

// HOTKEYS

// alert warning when reached first/last server
function warning() {
    if (window.warning1 === undefined || warning1.parentNode === null) {
        warning1 = document.createElement('div');
        warning1.Id = 'noty_layout__topCenter';
        document.getElementsByTagName('body')[0].appendChild(warning1);
        warning1.style.paddingTop = "5%";
        warning1.style.margin = "auto";
        warning1.style.width = "325px";
        warning1.style.position = "relative";
        warning1.style.zIndex = "99999";


        var warning2 = document.createElement('div');
        warning2.Id = 'noty_bar_88661265-2652-4807-94ed-77f64613667a';
        warning2.className = 'noty_bar noty_type__warning noty_theme__mint noty_close_with_click noty_has_timeout';
        warning1.appendChild(warning2);

        warning2_firstChild = document.createElement('div');
        warning2_firstChild.className = 'noty_body';
        warning2_firstChild.textContent = (s > 1 ? "Last" : "First") + " Server reached!";
        warning2_firstChild.style.textAlign = "center";
        warning2.appendChild(warning2_firstChild);
        setTimeout(function () {
            warning1.remove();
        }, 1000);
    }
}

//get variables
var serverObject;
var server;
var region;
var s;
var serverlist = document.getElementsByClassName('uk-list');
var gamemodesEU = [];
var gamemodesNA = [];
var gamemodesAS = [];
addLoadEvent(function () {
    for (var i = 0; i < 6; i++) {
        gamemodesEU[i] = document.getElementById('eu-server').firstChild.childNodes[i].id.split('-')[1].toLowerCase();
        gamemodesNA[i] = document.getElementById('na-server').firstChild.childNodes[i].id.split('-')[1].toLowerCase();
        gamemodesAS[i] = document.getElementById('as-server').firstChild.childNodes[i].id.split('-')[1].toLowerCase();
    }
});

function getVars() {
    if (myApp.getCurrentPartyCode() !== "") {
        serverObject = myApp.getCurrentPartyCode().split(".");
        region = serverObject[2];
        s = parseInt(serverObject[4].slice(-2));
        sl = region !== 'as' ? region == 'eu' ? gamemodesEU.indexOf(serverObject[1]) : gamemodesNA.indexOf(serverObject[1]) + 6 : gamemodesAS.indexOf(serverObject[1]) + 12;
    }
}


function keydown() {
    if (window.webSocket !== undefined && document.activeElement.tagName !== "INPUT" && document.getElementById('hotkeysoverlay').style.display !== "block") {
        switch (event.keyCode) {
            case 32:
                split();
                break;
            case 87:
                feeding = true;
                setTimeout(feed, 0);
                break;
            case parseInt(localStorage.getItem('tm_hk_play')):
                document.getElementsByClassName('uk-button uk-button-default btn-play uk-button-large uk-width-small')[0].click();
                break;
            case parseInt(localStorage.getItem('tm_hk_spec')):
                spectate(); //triggers spectate function
                break;
            case parseInt(localStorage.getItem('tm_hk_next')):
                //if next-key is pressed, connect to next server
                getVars();
                if (s < serverlist[sl].childElementCount)
                    serverlist[sl].childNodes[s].click();
                else warning();
                break;
            case parseInt(localStorage.getItem('tm_hk_prev')):
                //if previous-key is pressed, connect to previous server
                getVars();
                if (s > 1)
                    serverlist[sl].childNodes[s - 2].click();
                else warning();
                break;
            case parseInt(localStorage.getItem('tm_hk_switch')):
                getVars();
                regionint = region !== 'as' ? region === 'eu' ? 0 : 6 : 12;
                serverlist[sl + 1 < regionint + 6 ? sl + 1 : regionint].firstChild.click();
                setTimeout(spectate, 300);
        }
    }
}

//fix spectate bug
window.setInterval(function () {
    document.getElementsByClassName('uk-button uk-button-default btn-spectate')[0].disabled = "";
}, 40);

// Macro Split
function split() {
    $("body").trigger($.Event("keydown", {
        keyCode: 32
    }));
    $("body").trigger($.Event("keyup", {
        keyCode: 32
    }));
}

//Macro Feed
function keyup(event) {
    if (event.keyCode == 87) { // key W
        feeding = false;
    }
}

function feed() {
    if (feeding) {
        window.onkeydown({
            keyCode: 87
        }); // key W
        window.onkeyup({
            keyCode: 87
        });
        setTimeout(feed, 0);
    }
}

// ------------------------END OF HOTKEYS------------------------

// HOTKEY INPUT
var thingsClicked = {
    spec: false,
    play: false,
    next: false,
    prev: false,
    switch: false,
};
var keyCode;
var codeAsChar;

function unselect() {
    selectedHotkeyRow = null; // unselect "real" Hotkeys
    thingsClicked.spec = false;
    thingsClicked.play = false;
    thingsClicked.next = false;
    thingsClicked.prev = false;
    thingsClicked.switch = false;
}

document.getElementsByClassName('close-overlay')[1].onclick = function () {
    unselect();
};
SpecHk.onclick = function () {
    unselect();
    thingsClicked.spec = true;
};
PlayHk.onclick = function () {
    unselect();
    thingsClicked.play = true;
};
NextHk.onclick = function () {
    unselect();
    thingsClicked.next = true;
};
PrevHk.onclick = function () {
    unselect();
    thingsClicked.prev = true;
};
SwitchHk.onclick = function () {
    unselect();
    thingsClicked.switch = true;
};

var things = ["spec", "play", "next", "prev", "switch"];

function Hotkey(event) {
    if (event.keyCode) {
        for (let thing of things) {
            if (thingsClicked[thing]) {
                if (event.keyCode !== 46)
                    localStorage.setItem('tm_hk_' + thing, event.keyCode);
                else
                    localStorage.setItem('tm_hk_' + thing, '0');
            }
        }
        unselect();
        // display the character:
        SpecHkLabel1.textContent = specialCases[localStorage.getItem('tm_hk_spec')] || localStorage.getItem('tm_hk_spec') ? String.fromCharCode(localStorage.getItem('tm_hk_spec')) : "";
        PlayHkLabel1.textContent = specialCases[localStorage.getItem('tm_hk_play')] || localStorage.getItem('tm_hk_play') ? String.fromCharCode(localStorage.getItem('tm_hk_play')) : "";
        NextHkLabel1.textContent = specialCases[localStorage.getItem('tm_hk_next')] || localStorage.getItem('tm_hk_next') ? String.fromCharCode(localStorage.getItem('tm_hk_next')) : "";
        PrevHkLabel1.textContent = specialCases[localStorage.getItem('tm_hk_prev')] || localStorage.getItem('tm_hk_prev') ? String.fromCharCode(localStorage.getItem('tm_hk_prev')) : "";
        SwitchHkLabel1.textContent = specialCases[localStorage.getItem('tm_hk_switch')] || localStorage.getItem('tm_hk_switch') ? String.fromCharCode(localStorage.getItem('tm_hk_switch')) : "";
    }
}
// ------------------------END OF HOTKEYINPUT------------------------


// Short Script to simplyfy onload function
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            if (oldonload) {
                oldonload();
            }
            func();
        };
    }
}
// Date
var date = new Date();
$("lb_detail").after('<div id="datename" style="font-size:14px;font-weight:900;color:#00bfff;padding-top:10px;">' + date.toLocaleString() + '</div>');
document.getElementById('datename').style.textDecoration = 'overline';
document.getElementById("nick").maxLength = "25";
document.getElementById("team_name").placeholder = "Team";
document.getElementById("nick").placeholder = "Your ugly nick";
document.getElementById("skinurl").placeholder = "Your ugly skin(imgur)";

// New  nice Theme

document.getElementById('lb_title').style.color = '#009900';
document.getElementById('div_score').style.color = 'red';
document.getElementById('div_score').style.fontWeight = '900';
document.getElementById('lb_title').style.fontWeight = '900';
document.getElementById('minimap').style.height = '215px';
document.getElementById('minimap').style.width = '215px';
document.getElementById('div_lb').style.width = '215px';
document.getElementById('ad_main').style.display = 'hidden';
document.getElementById('ad_main').style.display = 'hidden';
document.getElementById('hideui').style.color = 'red';
document.getElementById('hideui').style.width = '20px';
document.getElementById('hideui').style.heigth = '20px';
document.getElementById('lb_title').style.textDecoration = 'underline';


// -------------------------------END--------------------------------