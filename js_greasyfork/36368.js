// ==UserScript==
// @name         HIT Forker
// @version      1.2.4.3
// @description  Monitors mturk.com for HITs
// @author       ThisPoorGuy
// @icon         https://i.imgur.com/RaPUMRP.png
// @exclude      https://worker.mturk.com/direct_deposit*
// @exclude      https://worker.mturk.com/payment_schedule*
// @include      https://worker.mturk.com/?finder_beta_test
// @include      https://worker.mturk.com/?hit_forker
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      turkerview.com
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dompurify/1.0.8/purify.min.js

// @namespace https://greasyfork.org/users/163167
// @downloadURL https://update.greasyfork.org/scripts/36368/HIT%20Forker.user.js
// @updateURL https://update.greasyfork.org/scripts/36368/HIT%20Forker.meta.js
// ==/UserScript==

// Acknowledgements
// The core of this script was forked/stolen/adapted from Kadauchi's Hit Finder Beta script. Coding assistance in spots
// provided by Salem Beats and ChrisTurk. TurkerView was created by ChrisTurk. This script hooks into JR Panda Crazy
// Slothbear provided the code for text to speech, thanks!

// Changelog
// 1.2.4.3 - Fixed API domain references
// 1.2.4.2 - Fixed hotlinking of sound files that began returning the incorrect sound file.
// 1.2.4.1 - Fixed issue with sounds not playing. THANKS PHIL.
// 1.2.4 - Added SLACK export type
// 1.2.3 - Added an exclusion to specifically prevent running on the direct deposit pages now that amazon is dealing in bank information. While not strictly necessary, this update is intended to improve security by specifically disallowing this page. Hit Forker does not collect or transmit any personal or financial information.
// 1.2.1 - Fixed bug with TO API call to catch JSON error (Thanks THFYM for the tip!)
// 1.2 - Added option to turn off TurkerView if you desire such things.
// 1.1.1 = Fixed an issue with the TV API where it will stop if it encounters an error
// 1.1 - Added new TurkerView API code
// 1.0.6.1 - Further input sanatization improvements
// 1.0.5 - Minor update to change the soundjay links to https to stop mixed content complaining.
// 1.0.4 - Added an I button to the HIT log/HIT list so you can just click once to add something to the include list.
// 1.0.3 - Further work on input sanitization
// 1.0.2 - Fixed the issue where some asshat decided to inject code into a HIT name. THIS IS WHY WE CAN'T HAVE NICE THINGS.
// 1.0.1 - Fixed IRC Export function. You're welcome one guy using IRC exports.
// 1.0.0 - Added Text to speech for include list hits. There's a TTS checkbox in the show config section, this will override any sounds set up on your include list with a
//         text to speech notification. In order for the alert to trigger you need an include list entry with play sound enabled. Which sound you pick won't matter as this
//         will ignore that setting and use a vocal alert. Thanks to slothbear for the code.
// 0.8.1.2 - Fixed an issue exporting HITS that have quotes in the title.
// 0.8.1.1 - Added a limit to the number of characters you can stick into the fields on adding something to the block list to prevent accidental pasting of a block list import into the wrong spot.
// 0.8.1 - Fixed a couple of export formatting bugs.
// 0.8.0 - Added the ability to press a button to launch a qualification test if you don't qualify for something and a test is availible.
//         Working on adding requesting for auto-grant quals, but that's...trickier.
// 0.7.6 - Fixed issue with the search qualified check box not working.
// 0.7.5 - Added abilible hits to the Log display. Note this only shows the data from the time when the HIT was first seen, not any subsequent scans of it.
// 0.7.4 - Removed column for masters, it wasn't used for anything and was broken anyway. Also removed hide masters because it worked off of that code, which wasn't working anyway
// 0.7.3 - Returned a semi-colon to it's rightful position, even though it wasn't missed
// 0.7.2 - Made it so that the Panda button sets pandas without once=true set. Whoops.
// 0.7.0 - Big under the hood changes with how TV and TO review scores are gathered.
// 0.6.5 - Further modifications to prevent availibility of external sites causing HF to stop randomly.
// 0.6.4 - Send RequesterID over to PandaCrazy along with the other info.
// 0.6.3 - Bringing PC functionality in house
// 0.6.1 - Fixed panda button shading
// 0.6.0 - Re-jiggered panda crazy integration code to use Salem's PC library. Now detects if panda crazy is actually running when you click.
// 0.5.3 - Slight modifications to break integration with JR Panda Crazy, due to a memory leak issue. Will reach out to dev to see if we can clear it up and be happy together...
// 0.5.2 - Code cleanup.
// 0.5.1 - Fixed the panda buttons on the Found hits table.
// 0.5.0 - Hitting the panda button now sends full HIT name, pay and requester name info to panda crazy too. Have you noticed these version number leaps are pretty arbitratry?
//       - Fixed a stupid typo in a variable name.
// 0.4.3 - Switched TO request from a .get call to a .ajax call with a timeout to prevent the entire thing from exploding when TO's servers do.
// 0.4.2 - Link to TV Requester profile in export.
// 0.4.1 - Show/Hide HITs and Logged Hits settings are now saved across sessions
// 0.4.0 - Blocking a HIT or a Requester will now remove that Hit or all hits from said requester from display in the Hit Log
// 0.3.5 - Added a button to hide the new HITS table. Moved the button to hide the logged hits for consistancy.
// 0.3.2 - Modified icon for desktop notifications. Added Requester TV score to hit export
// 0.3.1 - Fix for amazon screwing with things. Thanks ChrisTurk!
// 0.3.0 - Under the hood changes, removed code for running on www, added new launch URL, old ?finder_beta will be phased out eventually
// 0.2.9 - Now acceptable to people with red/green color blindness!
// 0.2.6 - Fixed a minor error which caused colors to not work properly.
// 0.2.5 - Changed Coloration to respect TV reviews FIRST and then fall back on TO Values. Also changed colors.
// 0.2.0 - Added TurkerView Hourly ratings to HIT results, fixed export links.
// 0.1.5 - Some minor UI tweaks
// 0.1.4 - Added some indication that you have already clicked a button to send HIT to PC. Only works in log currently.
// 0.1.3 - Fixed issue with the Panda buttons in the HIT log not having the right GID
// 0.1.2 - Fixed an issue with HITs that have double quotes in the title not working with the ignore hit by title button. I think.
// 0.1.1 - Cleaned up the header, removed unused audio files
// 0.1.0 - Made modifications to launch links with worker website. Added buttons to send information to PandaCrazy directly instead of copying link
// TODO:
// Remove www code
// Clean up interface
// Delete the above todos because they're already done.

const ver = GM_info.scriptMetaStr.match(/version.*?(\d+.*)/)[1];
var worker = true;

var _config     = JSON.parse(localStorage.getItem('_finder'))    || {};
_config.tv_api_key = localStorage.getItem('turkerview_api_key') || '';
var blocklist   = JSON.parse(localStorage.getItem('_finder_bl')) || {};
var includelist = JSON.parse(localStorage.getItem('_finder_il')) || {};

// Compatability check
if (_config.version !== '1.1') { _config = {}; }

var config = {
    version  : _config.version  || '1.1',
    delay    : _config.delay    || '3',
    type     : _config.type     || 'LastUpdatedTime%3A1&pageSize=',
    size     : _config.size     || '25',
    rew      : _config.rew      || '0.00',
    avail    : _config.avail    || '0',
    mto      : _config.mto      || '0.00',
    alert    : _config.alert    || '0',
    qual     : _config.hasOwnProperty('qual') ? _config.qual : true,
    new      : _config.hasOwnProperty('new')  ? _config.new  : true,
    newaudio : _config.newaudio || 'beep',
    pb       : _config.hasOwnProperty('pb')   ? _config.pb   : false,
    to       : _config.hasOwnProperty('to')   ? _config.to   : false,
    tv       : _config.hasOwnProperty('tv')   ? _config.tv   : true,
    nl       : _config.hasOwnProperty('nl')   ? _config.nl   : false,
    bl       : _config.hasOwnProperty('bl')   ? _config.bl   : false,
    m        : _config.hasOwnProperty('m')    ? _config.m    : false,
    tts      : _config.hasOwnProperty('tts')  ? _config.tts  : false,
    push     : _config.push     || 'access_token_here',
    tv_api_key : _config.tv_api_key || '',
    disable_tv : _config.disable_tv || false,
    theme    : _config.theme    || 'default',
    custom   : _config.custom   ||  {main: 'FFFFFF', primary: 'CCCCCC', secondary: '111111', text: '000000', link: '0000EE', visited: '551A8B', prop : false},
    to_theme : _config.to_theme || '1',
    h_hidden : _config.h_hidden || '0',
    l_hidden : _config.l_hidden || '0'
};
console.log(config);
console.log(config.tv_api_key);
var themes = {
    'default' : {main: 'FFFFFF', primary: 'CCCCCC', secondary: '111111', menu: '373b44', menutext: 'FFFFFF', text: '000000', link: '0000EE', visited: '551A8B', prop : true},
    'light'   : {main: 'FFFFFF', primary: 'CCCCCC', secondary: '111111', menu: '373b44', menutext: 'FFFFFF', text: '000000', link: '0000EE', visited: '551A8B', prop : true},
    'dark'    : {main: '404040', primary: '666666', secondary: 'FFFFFF', menu: '202020', menutext: 'FFFFFF', text: 'FFFFFF', link: 'FFFFFF', visited: 'B3B3B3', prop : true},
    'darker'  : {main: '000000', primary: '262626', secondary: 'FFFFFF', menu: '373b44', menutext: 'FFFFFF', text: 'FFFFFF', link: 'FFFFFF', visited: 'B3B3B3', prop : true},
    'custom'  : config.custom
};

var turkerview = { };
var turkerview_update = 0;
var requesters = [ ];
var tvTimeoutCache = [ ];

var searches    = 0,
    logged      = 0,
    hitlog      = {},
    noti_delay  = [],
    push_delay = [];

const ViewHeaders = new Headers([
    ['X-VIEW-KEY', config.tv_api_key],
    ['X-APP-KEY', 'HIT Forker'],
    ['X-APP-VER', ver] //SemVer
]);

// General Configuration variables
var url, upd, num, rew, minrew, searchqual, pandaurl;

url    = 'https://worker.mturk.com/?';
pandaurl = 'https://worker.mturk.com';
upd    = '&sort=updated_desc&page_size=';
num    = '&sort=num_hits_desc&page_size=';
rew    = '&sort=reward_desc&page_size=';
minrew = '&filters%5Bmin_reward%5D=';
searchqual = '&filters%5Bqualified=';

var PandaCrazy = (function createPandaCrazy() {
    let _self = this;

    let _lastSentPingTime;
    let _lastReceivedPongTime;

    let _onlineSinceLastPing;

    let _pcListener;

    const MAX_WAIT_FOR_PANDA_CRAZY_RESPONSE_MS = 1000;

    function ping() {
        _lastSentPingTime = Date.now();
        localStorage.setItem("JR_message_ping_pandacrazy", `{"theTarget": "${Math.random()}"}`);
    }

    function hasIndicatedOnlineSinceLastPing() {
        if(_lastSentPingTime !== undefined && _lastReceivedPongTime !== undefined) {
            return _lastReceivedPongTime >= _lastSentPingTime;
        }
        else {
            return undefined;
        }
    }

    function online() {

        function respondToStorage(resolve, reject, e) {
            if(e.key.includes("JR_message_pong") && Boolean(e.newValue)) {

                _lastReceivedPongTime = Date.now();

                let pongData = JSON.parse(e.newValue);

                let lag = Number(pongData.time) - Number(_lastReceivedPongTime);

                if(hasIndicatedOnlineSinceLastPing()) {
                    resolve("online");
                }
            }
        }

        let isOnlinePromise = new Promise((resolve, reject) => {

            setTimeout(() => {reject("timeout");}, MAX_WAIT_FOR_PANDA_CRAZY_RESPONSE_MS);

            if(_pcListener) {window.removeEventListener("storage", _pcListener);}

            _pcListener = respondToStorage.bind(window, resolve, reject);

            window.addEventListener("storage", _pcListener);

            /*
             window.addEventListener("storage", e => {

             // console.log("Storage Event", e);

             if(e.key.includes("JR_message_pong") && Boolean(e.newValue)) {

             _lastReceivedPongTime = Date.now();

             let pongData = JSON.parse(e.newValue);

             let lag = Number(pongData.time) - Number(_lastReceivedPongTime);

             if(hasIndicatedOnlineSinceLastPing()) {
             resolve("online");
             }
             }
             });
             */
        });

        ping();

        return isOnlinePromise;
    }

    function addJob(gid, once, metadata) {
        let commandString = once ? "addOnceJob" : "addJob";

        localStorage.setItem("JR_message_pandacrazy", JSON.stringify({
            time: Date.now(),
            command: commandString,
            data: {
                groupId: gid,
                title: (metadata ? metadata.hitTitle || metadata.title : undefined),
                requesterName: (metadata ? metadata.requesterName : undefined),
                requesterId: (metadata ? metadata.requesterID || metadata.requesterId || metadata.rid : undefined),
                pay: (metadata ? metadata.hitValue || metadata.pay : undefined),
                duration: (metadata ? metadata.duration : undefined),
                hitsAvailable: (metadata ? metadata.hitsAvailable : undefined)
            }
        }));
    }

    function startJob(gid) {
        localStorage.setItem("JR_message_pandacrazy", JSON.stringify({
            time: Date.now(),
            command: "startcollect",
            data: {
                groupId: gid
            }
        }));
    }

    return {
        addJob,
        startJob,
        ping,
        online
    };
})();

const SPEECH_VOICE    = 3;          //0 - 21ish
const SPEECH_RATE     = 0.9;        //1 - 10 (default is 1)
const SPEECH_VOLUME   = 1;          //0 - 1 (default is 1)
const SPEECH_LANG     = 'en-US';    //(default is 'en')



//this is what does it all!
unsafeWindow.slothbearsTTS = function(obj) {
    let phrase = "Hit Found!" + obj.name;
    var speech = new Speech();
    if (speech.supported()) {
        speech.speak(phrase);
    }
};



var Speech = function() {
};

Speech.voices = null;

(function() {
    if ('speechSynthesis' in window) {
        // First call to getVoices may be null...later an event indicates when it is loaded
        Speech.voices = window.speechSynthesis.getVoices();

        // Save voices when loaded after first call
        window.speechSynthesis.onvoiceschanged = function() {
            Speech.voices = window.speechSynthesis.getVoices();
        };
    }
})();

Speech.prototype.supported = function() {
    return Speech.voices !== null;
};

Speech.prototype.speak = function(text) {
    if (Speech.voices !== null) {
        var speech = new SpeechSynthesisUtterance(text);

        speech.rate = SPEECH_RATE;
        speech.voice = speechSynthesis.getVoices()[SPEECH_VOICE];
        speech.lang = SPEECH_LANG;
        speech.volume = SPEECH_VOLUME;
        window.speechSynthesis.speak(speech);
    }
};

$('head').html(
    '<title>HIT Forker</title>' +
    '<base target="_blank">' +

    '<audio id="audio_1"><source src="https://turkerview.com/assets/sounds/button-1.mp3" type="audio/mpeg"></audio>' +
    '<audio id="audio_2"><source src="https://turkerview.com/assets/sounds/button-3.mp3" type="audio/mpeg"></audio>' +
    '<audio id="audio_3"><source src="https://turkerview.com/assets/sounds/button-4.mp3" type="audio/mpeg"></audio>' +
    '<audio id="audio_4"><source src="https://turkerview.com/assets/sounds/button-5.mp3" type="audio/mpeg"></audio>' +
    '<audio id="audio_beep"><source src="https://turkerview.com/assets/sounds/beep-21.mp3" type="audio/mpeg"></audio>' +
    '<audio id="audio_beepbeep"><source src="https://turkerview.com/assets/sounds/beep-24.mp3" type="audio/mpeg"></audio>' +
    '<audio id="audio_click"><source src="https://turkerview.com/assets/sounds/button-20.mp3" type="audio/mpeg"></audio>' +

    '<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">' +
    '<style id="css" type="text/css">'
);

$('body').on('click', '.closeTvAlert', function(){
    $(this).parent().parent().hide();
});

$('body').html(
    // Main
    '<div style="margin-bottom: 5px; text-align:right;" id="menubar">' +
    '<div style="position: absolute; top: 32px width: 100px; font-size: 14pt; font-weight: bold;" id="menu_title">HIT Forker</div>'+
    '<div style="line-height: 30px; margin-right:5px;">'+
    '<button id="scan_button" style="margin-right: 5px;">Start</button>' +
    '<button id="bloc_button" style="margin-right: 5px;">Block List</button>' +
    '<button id="incl_button" style="margin-right: 5px;">Include List</button>' +
    '<button id="sett_button" style="margin-right: 5px;">Advanced Settings</button>' +
    '<button id="conf_button" style="margin-right: 5px;">Show Config</button>' +

    '</div></div>' +

    // Config
    '<div id="config" style="position: absolute; top: 37px; right: 5px; margin-bottom: 5px;" class="hidden">' +

    '<div style="margin-bottom: 5px;">' +
    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Delay in seconds between searches.">Search Delay: ' +
    '<input id="delay" style="width: 50px;" type="number" step="1" min="1" value="' + config.delay + '">' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Filter HITs by minimum reward.">Min Reward: ' +
    '<input id="min_rew" style="width: 50px;" type="number" step="0.01" min="0" value="' + config.rew + '">' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Filter HITs by minimum available.">Min Avail: ' +
    '<input id="min_avail" style="width: 50px;" type="number" step="1" min="0" value="' + config.avail + '">' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Filter HITs by minimum TO pay.">Min TO: ' +
    '<input id="min_to" style="width: 50px;" type="number" step="0.1" min="0" max="5" value="' + config.mto + '">' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Search for this many HITs.">Size: ' +
    '<input id="size" style="width: 50px;" type="number" step="1" min="1" max="100" value="' + config.size + '">' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Sort HITs by (Latest / Most Available / Highest Reward)">Sort by: ' +
    '<select id="type" value="' + config.type + '">' +
    '<option value="' + upd + '">Latest</option>' +
    '<option value="' + num + '">Most Available</option>' +
    '<option value="' + rew + '">Reward (Most)</option>' +
    '</select>' +
    '</label>' +

    '<label style="margin-right: 0px; display: inline-block; border-bottom: 1px solid;" title="Only show HITs that you are  for.">Qualified' +
    '<input id="qual" type="checkbox" ' + (config.qual ? 'checked' : '') + '>' +
    '</label>' +
    '</div>' +

    '<div style="margin-bottom: 5px;">' +
    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Delay in seconds between desktop notifications and sound alerts for an include list match.">Alert Delay: ' +
    '<input id="alert_delay" style="width: 50px;" type="number" step="1" min="0" value="' + config.alert + '">' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Make a sound when a new HIT is found.">Sound On New HIT ' +
    '<input id="new_sound" type="checkbox" ' + (config.new ? 'checked' : '') + '>' +
    '<select id="new_audio" value="' + config.newaudio + '">' +
    //'<option value="default">Default</option>' +
    '<option value="beep">Beep</option>' +
    '<option value="beepbeep">Beep Beep</option>' +
    //'<option value="ding">Ding</option>' +
    //'<option value="squee">Squee</option>' +
    '<option value="click">Click</option>' +
    '</select>' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Allow include list to send a TTS notification when matched">TTS ' +
    '<input id="tts" type="checkbox" ' + (config.tts ? 'checked' : '') + '>' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Allow inludelist matches to send Pushbullet notifications if enabled for that match.">Pushbullet ' +
    '<input id="pb" type="checkbox" ' + (config.pb ? 'checked' : '') + '>' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Use turkopticon.">Enable TO ' +
    '<input id="to" type="checkbox" ' + (config.to ? 'checked' : '') + '>' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Hide all HITs that do not match your include list.">Hide Non Include List ' +
    '<input id="nl_hide" type="checkbox" ' + (config.nl ? 'checked' : '') + '>' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;" title="Hide HITs that match your block list.">Hide Block List ' +
    '<input id="bl_hide" type="checkbox" ' + (config.bl ? 'checked' : '') + '>' +
    '</label>' +

    '</div>' +

    '</div>' +

    '<div id="TVAlert" style="background-color: #dff0d8; border-color: #d0e9c6;' + (((config.tv_api_key == '' || config.tv_api_key.length != 40) && !config.disable_tv) ? `` : ` display: none; `) +' color: #3c763d; padding: 15px; margin-bottom: 1rem; border: 1px solid transparent; border-radius: 2px; margin: auto; width: 60%; padding-top: 10px; padding-bottom: 10px;">' +
    '<h4 style="font-size: 0.857rem; margin-bottom: 0.5rem; margin-top: 0.5rem;">TurkerView API Changes (<span class="closeTvAlert" style="cursor: pointer;">Dismiss</span>)</h4>' +

        `<small>
    <p>Sorry for the intrusion, but we're expanding our services & infrastructure and making huge improvements to the way we deliver information & data to Turkers in 2019!</p>
    <p>HIT Forker has been updated to function with TurkerView's new View API [<a href="https://forum.turkerview.com/threads/hit-forker-update.2025/" target="_blank">details here</a>]
    <p>TVJS 10 is out! You can read change details <a href="https://forum.turkerview.com/threads/turkerviewjs-10.2010/" target="_blank">here</a> - including improvements to approval (AA) time tracking! You can find more information about the full API changes <a href="https://forum.turkerview.com/threads/view-api-details.2012/" target="_blank" style="text-decoration: underline;">on our announcement here</a>.</p>
    <p>Make sure to register & get your new access keys to our upgraded API by <a href="https://turkerview.com/account/api/" target="_blank" style="text-decoration: underline;">visiting your account dashboard</a>. We'll stop displaying this as soon as you do, but the script wont be able to retrieve TV data after February 1st without an API Key.</p>
        </small><form action="saveForkerApiForm" onsubmit="return false;">
        <input type="text" class="form-control" style="max-width: 50%; margin-top: 5px; margin-bottom: 5px;">
        <button type="submit" class="btn btn-primary">Save API Key</button>
    </form>
    <script>
        $('form[action*=saveForkerApiForm]').submit(function(e){
            e.preventDefault();
            let api_key = $(this).find('input[type=text]').val().trim();
            console.log(api_key);
            if (api_key.length == 40){
                localStorage.setItem('turkerview_api_key', api_key);
                alert('Awesome, we saved your API key for future use! HIT Forker will reload now.');
                window.location.reload();
            } else {
                alert("We cannot save the provided key as it isn't valid.");
            }
        });
    </script>` +

    '</div>'+

    '<div id="TVErrorMessage" style="display: none; background-color: #f2dede; border-color: #ebcccc; color: #a94442; padding: 15px; margin-bottom: 1rem; border: 1px solid transparent; border-radius: 2px; margin: auto; width: 60%; padding-top: 10px; padding-bottom: 10px;">' +
    '<h4 style="font-size: 0.857rem; margin-bottom: 0.5rem; margin-top: 0.5rem;">TurkerView API Error (<span class="closeTvAlert" style="cursor: pointer;">Dismiss</span>)</h4>' +
    '<p style="margin-bottom: 0.5rem; margin-top: 0.5rem;">Error Message.</p>' +
    '</div>'+
    // HITs
    '<div id="latest_hits">' +
    '<div style="border-bottom: 3px solid; margin-bottom: 5px;">' +
    '<span style="font-size: 20px; font-weight: bold;">HITs</span>' +
    '<span id="hits_data" style="font-size: 11px;"></span>' +
    '<span id="hits_controls" style="float: right"><button id="hits_button" style="margin-right: 5px;">Hide New HITs</button></span>' +
    '</div>' +
    '<div id="hits_hidden" style="text-align: center; display: none;">--- HITS HIDDEN ---</div>' +
    '<div id="hits_table">' +
    '<div>' +
    '<div style="overflow: hidden; white-space: nowrap;">' +
    '<div style="float: left; width: calc(100% - 330px);">' +
    '<span style="width: 34%; float: left;  display:inline-block; overflow: hidden;">Requester</span>' +
    '<span style="width: 64%; float: right; display:inline-block; overflow: hidden;">Project</span>' +
    '</div>' +

    '<div style="float: right;">' +
    '<span style="width: 60px; display:inline-block; text-align: center;">Tasks</span>' +
    '<span style="width: 60px; display:inline-block; text-align: center;">Accept</span>' +
    '<span style="width: 60px; display:inline-block; text-align: center;">TV</span>' +
    '<span style="width: 60px; display:inline-block; text-align: center;">TO</span>' +
    '<span style="width: 60px; display:inline-block; text-align: center;">PANDA</span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="new_hits_"></div>' +
    '</div>' +
    '</div>' +

    '<br>' +

    //Logged HITs
    '<div id="logged_hits">' +
    '<div style="border-bottom: 3px solid; margin-bottom: 5px;">' +
    '<span style="font-size: 20px; font-weight: bold;">Logged HITs</span>' +
    '<span id="logged_hits_data" style="font-size: 11px;"></span>' +
    '<span id="log_controls" style="float: right"><button id="logg_button" style="margin-right: 0px;">Hide Logged HITs</button></span>' +
    '</div>' +
    '<div id="log_hidden" style="text-align: center; display: none;">--- LOGGED HITS HIDDEN ---</div>' +
    '<div id="log_table">' +
    '<div>' +
    '<div style="overflow: hidden; white-space: nowrap;">' +

    '<div style="float: left;">' +
    '<span style="width: 80px; display:inline-block;">Time</span>' +
    '</div>' +

    '<div style="float: left; width: calc(100% - 3500px);">' +
    '<span style="width: 25%; float: left;  display:inline-block; overflow: hidden;">Requester</span>' +
    '<span style="width: 75%; float: right; display:inline-block; overflow: hidden;">Project</span>' +

    '</div>' +

    '<div style="float: right;">' +
    '<span style="width: 60px; display:inline-block; text-align: center;">Avail</span>' +
    '<span style="width: 60px; display:inline-block; text-align: center;">Accept</span>' +
    '<span style="width: 60px; display:inline-block; text-align: center;">TV</span>' +
    '<span style="width: 60px; display:inline-block; text-align: center;">TO</span>' +
    '<span style="width: 60px; display:inline-block; text-align: center;">PANDA</span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="log_hits_"></div>' +
    '</div>' +
    '</div>' +

    // Block List
    '<div id="bl_div" style="z-index: 99; position: fixed; width: 80%; height: 80%; left: 10%; top: 300px; margin-top: -250px; display: none;">' +
    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;">Block List</div>' +
    '<div id="bl_items"></div>' +
    '<div style="text-align: center;">' +
    '<button id="bl_add"    style="margin-right: 5px;">Add</button>' +
    '<button id="bl_close"  style="margin-right: 5px;">Close</button>' +
    '<button id="bl_import" style="margin-right: 5px;">Import</button>' +
    '<button id="bl_export" style="margin-right: 0px;">Export</button>' +
    '</div>' +
    '</div>' +

    // Add Block List Popup
    '<div id="bl" class="add" style="z-index: 100; position: fixed; width: 520px; top: 300px; left: 50%; margin: -250px; padding: 5px; text-align: center; display: none;">' +
    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;">Add To Block List</div>' +

    '<div>' +
    '<p><label>Term: </label><input id="bl_term" value="" maxlength="300"></p>' +
    '<p><label>Name: </label><input id="bl_name" value="" maxlength="300"></p>' +
    '<input id="bl_gid" value="0" type="hidden">' +
    '</div>' +

    '<div>' +
    '<button id="bl_add_save"   style="margin-right: 5px;">Save</button>' +
    '<button id="bl_add_cancel" style="margin-right: 0px;">Cancel</button>' +
    '</div>' +
    '</div>' +

    // Edit Block List Popup
    '<div id="edit_bl" class="add" class="add" style="z-index: 100; position: fixed; width: 520px; top: 300px; left: 50%; margin: -250px; padding: 5px; text-align: center; display: none;">' +
    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;">Edit Block List Item</div>' +

    '<div>' +
    '<p><label>Term: </label><input id="edit_bl_term"  value=""disabled></p>' +
    '<p><label>Name: </label><input id="edit_bl_name" value=""></p>' +
    '</div>' +

    '<div>' +
    '<button id="edit_bl_save"   style="margin-right: 5px;">Save</button>' +
    '<button id="edit_bl_delete" style="margin-right: 5px;">Delete</button>' +
    '<button id="edit_bl_cancel" style="margin-right: 0px;">Cancel</button>' +
    '</div>' +
    '</div>' +

    // Include List
    '<div id="il_div" style="z-index: 99; position: fixed; width: 80%; height: 80%; left: 10%; top: 300px; margin-top: -250px; display: none;">' +
    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;">Include List</div>' +
    '<div id="il_items"></div>' +
    '<div style="text-align: center;">' +
    '<button id="il_add"    style="margin-right: 5px;">Add</button>' +
    '<button id="il_close"  style="margin-right: 5px;">Close</button>' +
    '<button id="il_import" style="margin-right: 5px;">Import</button>' +
    '<button id="il_export" style="margin-right: 0px;">Export</button>' +
    '</div>' +
    '</div>' +

    // Add Include List Popup
    '<div id="il" class="add" style="z-index: 100; position: fixed; width: 520px; top: 300px; left: 50%; margin: -250px; padding: 5px; text-align: center; display: none;">' +
    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;">Add To Include List</div>' +

    '<div>' +
    '<p><label>Term: </label><input id="il_term" value=""></p>' +
    '<p><label>Name: </label><input id="il_name" value=""></p>' +
    '</div>' +

    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;">Alerts</div>' +

    '<p>' +
    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;">Sound: ' +
    '<select id="il_sound">' +
    '<option value="1">Sound 1</option>' +
    '<option value="2">Sound 2</option>' +
    '<option value="3">Sound 3</option>' +
    '<option value="4">Sound 4</option>' +
    '</select>' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;">Desktop Notifications' +
    '<input id="il_noti_cb" type="checkbox">' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;">Play Sound' +
    '<input id="il_sound_cb" type="checkbox">' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;">Send Pushbullet' +
    '<input id="il_push_cb" type="checkbox">' +
    '</label>' +
    '</p>' +

    '<div>' +
    '<button id="il_add_save"   style="margin-right: 5px;">Save</button>' +
    '<button id="il_add_cancel" style="margin-right: 0px;">Cancel</button>' +
    '</div>' +
    '</div>' +

    // Edit Include List Popup
    '<div id="edit_il" class="add" style="z-index: 100; position: fixed; width: 520px; top: 300px; left: 50%; margin: -250px; padding: 5px; text-align: center; display: none;">' +
    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;">Edit Include List Item</div>' +

    '<div>' +
    '<p><label>Term: </label><input id="edit_il_term" value="" disabled></p>' +
    '<p><label>Name: </label><input id="edit_il_name" value=""></p>' +
    '</div>' +

    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;"">Alerts</div>' +

    '<p>' +
    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;">Sound: ' +
    '<select id="edit_il_sound">' +
    '<option value="1">Sound 1</option>' +
    '<option value="2">Sound 2</option>' +
    '<option value="3">Sound 3</option>' +
    '<option value="4">Sound 4</option>' +
    '</select>' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;">Desktop Notifications' +
    '<input id="edit_il_noti_cb" type="checkbox">' +
    '</label>' +

    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;">Play Sound' +
    '<input id="edit_il_sound_cb" type="checkbox">' +
    '</label>' +

    '<label style="margin-right: 0px; display: inline-block; border-bottom: 1px solid;">Send Pushbullet' +
    '<input id="edit_il_push_cb" type="checkbox">' +
    '</label>' +
    '</p>' +

    '<div>' +
    '<button id="edit_il_save"   style="margin-right: 5px;">Save</button>' +
    '<button id="edit_il_delete" style="margin-right: 5px;">Delete</button>' +
    '<button id="edit_il_cancel" style="margin-right: 0px;">Cancel</button>' +
    '</div>' +
    '</div>' +

    // Advanced Settings
    '<div id="sett" class="add" style="z-index: 100; position: fixed; width: 520px; top: 300px; left: 50%; margin: -250px; padding: 5px; text-align: center; display: none;">' +
    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;">Advanced Settings</div>' +

    '<div>' +
    '<p><label>Pushbullet Token: </label><input id="push" value="' + config.push + '"></p>' +
    '</div>' +
    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;">TurkerView</div>' +
    '<div><p><label>TurkerView API Key: </label><input id="tv_api_key" value="' + ((config.tv_api_key == null || config.tv_api_key.length != 40) ? '' : config.tv_api_key) + '"></p></div>' +
        '<div><p><label><input type="checkbox" name="disable_turkerview"' + (config.disable_tv ? 'checked' : '') + '> Disable TurkerView</label></p></div>' +
    '<div><p>TurkerView is completely free (no obligation) for a month, we hope you\'ll <a href="" target="_blank">join us & try it</a>, but if not feel free to disable to stop notifications.</p></div>' +

    '<div style="position: relative; width: 80%; left: 10%; border-bottom: 3px solid; padding: 2px; text-align: center;">Theme</div>' +

    '<p>' +
    '<label style="margin-right: 5px; display: inline-block; border-bottom: 1px solid;">Theme: ' +
    '<select id="adv_theme" value="' + config.theme + '">' +
    '<option value="default">Default (Light)</option>' +
    '<option value="light">Pastel</option>' +
    '<option value="dark">Dark</option>' +
    '<option value="darker">Darker</option>' +
    '<option value="custom">Custom</option>' +
    '</select>' +
    '</label>' +

    '<label style="margin-right: 0px; display: inline-block; border-bottom: 1px solid;">TO Theme: ' +
    '<select id="to_theme" value="' + config.to_theme + '">' +
    '<option value="1">Default</option>' +
    '<option value="2">Column Only</option>' +
    '<option value="3">Text Only</option>' +
    '</select>' +
    '</label>' +
    '</p>' +

    '<p>' +
    '<label style="width: 150px; margin-right: 5px; display: inline-block; border-bottom: 1px solid; text-align: left;">Main: #' +
    '<input id="theme_main" style="width: 55px; float: right;" maxlength="6">' +
    '</label>' +

    '<label style="width: 150px; margin-right: 5px; display: inline-block; border-bottom: 1px solid; text-align: left;">Primary: #' +
    '<input id="theme_primary" style="width: 55px; float: right;" maxlength="6">' +
    '</label>' +

    '<label style="width: 150px; margin-right: 0px; display: inline-block; border-bottom: 1px solid; text-align: left;">Secondary: #' +
    '<input id="theme_secondary" style="width: 55px; float: right;" maxlength="6">' +
    '</label>' +
    '</p>' +

    '<p>' +
    '<label style="width: 150px; margin-right: 5px; display: inline-block; border-bottom: 1px solid; text-align: left;">Text: #' +
    '<input id="theme_text" style="width: 55px; float: right;" maxlength="6">' +
    '</label>' +

    '<label style="width: 150px; margin-right: 5px; display: inline-block; border-bottom: 1px solid; text-align: left;">Link: #' +
    '<input id="theme_link" style="width: 55px; float: right;" maxlength="6">' +
    '</label>' +

    '<label style="width: 150px; margin-right: 0px; display: inline-block; border-bottom: 1px solid; text-align: left;">Visited: #' +
    '<input id="theme_visited" style="width: 55px; float: right;" maxlength="6">' +
    '</label>' +
    '</p>' +

    '<div>' +
    '<button id="sett_save"  style="margin-right: 5px;">Save</button>' +
    '<button id="sett_close" style="margin-right: 0px;">Close</button>' +
    '</div>' +
    '</div>'
);

// Click functions
$('#scan_button').click(function () {
    if ($(this).text() === 'Start') {
        $(this).text('Stop');
        _scan();
    }
    else {
        $(this).text('Start');
    }
});

$('#sett_button').click(function () {
    $('#sett').toggle();
});

$('#conf_button').click(function () {
    if ($(this).text() === 'Hide Config') {
        $(this).text('Show Config');
    }
    else {
        $(this).text('Hide Config');
    }
    $('#config').toggleClass('hidden');
});

$('#logg_button').click(function () {
    _hide_log_list( $(this).text() === 'Hide Logged HITs' ? true : false );
});

$('#hits_button').click(function () {
    _hide_hit_list( $(this).text() === 'Hide New HITs' ? true : false );
});

$('#bloc_button').click(function () {
    $('#bl_div').toggle();
});

$('#bl_add').click(function () {
    $('#bl').show();
});

$('#bl_close').click(function () {
    $('#bl_div').hide();
});

$('#bl_import').click(function () {
    _import_block();
});

$('#bl_export').click(function () {
    _export_block();
});

$('#bl_add_save').click(function () {
    var obj = {
        term : $('#bl_term').val(),
        name : $('#bl_name').val() === '' ? $('#bl_term').val() : $('#bl_name').val(),
        gid : $('#bl_gid').val() === '' ? 'X' : $('#bl_gid').val()
    };

    _add_block(obj);

    if ( obj.gid != 'X' ) {
        $('.loggid_' + obj.gid ).remove();
    }
    else {
        $('.logreqid_' + obj.term ).remove();
    }

    $('#bl_term, #bl_name').val('');
    $('#bl').hide();
});

$('#bl_add_cancel').click(function () {
    $('#bl_term, #bl_name').val('');
    $('#bl').hide();
});

$('#edit_bl_save').click(function () {
    _update_block($(this).val());
    $('#edit_bl_term, #edit_bl_name').val('');
    $('#edit_bl').hide();
});

$('#edit_bl_delete').click(function () {
    _delete_block($(this).val());
    $('#edit_bl_term, #edit_bl_name').val('');
    $('#edit_bl').hide();
});

$('#edit_bl_cancel').click(function () {
    $('#edit_bl_term, #edit_bl_name').val('');
    $('#edit_bl').hide();
});

$('#incl_button').click(function () {
    $('#il_div').toggle();
});

$('#il_add').click(function () {
    $('#il').show();
});

$('#il_close').click(function () {
    $('#il_div').hide();
});

$('#il_import').click(function () {
    _import_include();
});

$('#il_export').click(function () {
    _export_include();
});

$('#il_add_save').click(function () {
    var obj = {
        term     : $('#il_term').val().trim(),
        name     : $('#il_name').val().trim() === '' ? $('#il_term').val().trim() : $('#il_name').val().trim(),
        sound    : $('#il_sound').val(),
        noti_cb  : $('#il_noti_cb').prop('checked'),
        sound_cb : $('#il_sound_cb').prop('checked'),
        push_cb : $('#il_push_cb').prop('checked')
    };

    _add_include(obj);

    $('#il_term, #il_name').val('');
    $('#il').hide();
});

$('#il_add_cancel').click(function () {
    $('#il_term, #il_name').val('');
    $('#il').hide();
});

$('#edit_il_save').click(function () {
    _update_include($(this).val());
    $('#edit_il_term, #edit_il_name, #edit_il_sound').val('');
    $('#edit_il_noti_cb, #edit_il_sound_cb, #edit_il_push_cb').prop('checked', false);
    $('#edit_il').hide();
});

$('#edit_il_delete').click(function () {
    _delete_include($(this).val());
    $('#edit_il_term, #edit_il_name, #edit_il_sound').val('');
    $('#edit_il_noti_cb, #edit_il_sound_cb, #edit_il_push_cb').prop('checked', false);
    $('#edit_il').hide();
});

$('#edit_il_cancel').click(function () {
    $('#edit_il_term, #edit_il_name, #edit_il_sound').val('');
    $('#edit_il_noti_cb, #edit_il_sound_cb, #edit_il_push_cb').prop('checked', false);
    $('#edit_il').hide();
});

$('.on, .off').click(function () {
    $(this).toggleClass('on off');
    _save();
});

$('#sett_save').click(function () {

    let original_key = config.tv_api_key;
    let new_key = $('#tv_api_key').val();
    let disable_tv = $('input[name=disable_turkerview]').is(':checked');
    config.disable_tv = disable_tv;
    _save('custom');
    _theme();
    if (original_key != new_key) {
        $('#sett').prepend(`<p class="saved-settings-alert">Settings Saved! We'll reload Forker shortly.</p>`);
        setTimeout(function() {
            window.location.reload();
        }, 1000)
    } else $('#sett').prepend(`<p class="saved-settings-alert">Settings Saved!</p>`);
});

$('#sett_close').click(function () {
    $('#sett').find('.saved-settings-alert').remove();
    $('#sett').hide();
});

$('#time').click(function () {
    $('.new').removeClass('new');
});

// Delegated click functions
$('body').on('click', '.blockit', function () {
    _edit_block($(this).val());
});

$('body').on('click', '.includeit', function () {
    _edit_include($(this).val());
});

$('body').on('click', '.rt', function () {
    _block($(this).data('term'), $(this).data('name'), $(this).attr('id'));
});

$('body').on('click', '.it', function () {
    _includerid($(this).data('term'), $(this).data('name'), $(this).attr('id'));
});

$('body').on('click', '.pc', function () {
    _panda($(this).data('term'), $(this).data('reqname'), $(this).data('reqid'), $(this).data('title'), $(this).data('value'), $(this).data('name'), $(this))
});

$('body').on('click', '.vb', function () {
    _export_vb($(this).val());
});

$('body').on('click', '.irc', function () {
    _export_irc($(this).val());
});

$('body').on('click', '.slk', function () {
    _export_slk($(this).val());
});

$('body').on('click', '.details', function () {
    $(this).toggleClass('fa-plus-circle fa-minus-circle');
    $('.info[value="' + $(this).val() + '"]').toggle();
});

// Delegated mouseover functions
$('body').on('mouseover', '.new', function () {
    $(this).removeClass('new');
});

// On change events
$('#new_audio').change(function () {
    _save();
    _sound('new');
});

$('#il_sound').change(function () {
    _sound('il');
});

$('#edit_il_sound').change(function () {
    _sound('il_edit');
});

$('#type, #size, #adv_theme, #to_theme, #c_theme, :checkbox').change(function () {
    _save();
});

$('#adv_theme, #to_theme, #c_theme').change(function () {
    _theme();
});

// On input events
$('#delay, #min_rew, #min_avail, #min_to, #alert_delay').on('input', function () {
    _save();
});

function sanitize(strings, ...values) {
    console.log( strings );
    const dirty = strings.reduce((prev, next, i) => `${prev}${next}${values[i]} || ''}`, '');
    return DomPurify.sanitize(dirty);
}

function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

function _scan () {
    var searchqualvar
    searchqualvar = (config.qual ? 'true' : 'false');


    if ($('#scan_button').text() === 'Stop') {
        var _url = url + $('#type').val() + $('#size').val() + minrew + $('#min_rew').val() + searchqual + searchqualvar;
        //console.log( _url );
        var _scanurl = _url + '&format=json';

        var date = new Date(), h = date.getHours(), m = date.getMinutes(), s = date.getSeconds(), ampm = h >= 12 ? 'pm' : 'am';
        h = h % 12; h = h ? h : 12; m = m < 10 ? '0' + m : m; s = s < 10 ? '0' + s : s;
        var timeis = [h, m, s, ampm];
        console.log( _scanurl );
        $.get(_scanurl, function (data) {
            _scrape_new(data, timeis);
        }).fail(function () {
            setTimeout(function () { _scan(); }, 2500);
        });
    }
}

function _scrape_new (data, timeis) {
    var keys = [], log_keys = [], to = [], logged_in = true;
    var new_requesters = [];
    var hits = data.results;
    //Set config for allowed tags
    var config = {
        ALLOWED_TAGS: ['p', '#text']
    };

    for (var i = 0; i < hits.length; i ++) {
        var hit = hits[i],
            req_name  = DOMPurify.sanitize(hit.requester_name,config).replace(/"/g, "&quot;" ),
            req_id    = DOMPurify.sanitize(hit.requester_id,config),
            req_link  = DOMPurify.sanitize(hit.requester_url.replace(/\.json/, ''),config),
            //req_link  = 'https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=' + hit.requester_id,
            con_link  = DOMPurify.sanitize('https://www.mturk.com/mturk/contact?requesterId=' + hit.requester_id, config),
            group_id  = DOMPurify.sanitize(hit.hit_set_id,config),
            prev_link = DOMPurify.sanitize(hit.project_tasks_url.replace(/\.json/, ''),config),
            //prev_link = 'https://www.mturk.com/mturk/preview?groupId=' + hit.hit_set_id,
            pand_link = DOMPurify.sanitize(hit.accept_project_task_url.replace(/\.json/, ''),config),
            //pand_link = 'https://www.mturk.com/mturk/previewandaccept?groupId=' + hit.hit_set_id,
            title     = DOMPurify.sanitize(hit.title,config),
            safetitle = title.replace(/"/g, "&quot;" ),
            desc      = DOMPurify.sanitize(hit.description.replace(/"/g, "&quot;" ),config),
            time      = _convert_seconds(hit.assignment_duration_in_seconds),
            reward    = DOMPurify.sanitize('$' + hit.monetary_reward.amount_in_dollars.toFixed(2),config),
            avail     = DOMPurify.sanitize(hit.assignable_hits_count,config);

        var key = req_id + title + reward + group_id;
        keys.push(key);

        var qualif = 'None';
        var quals = hit.project_requirements;


        if (quals.length) {

            qualif = '';
            for (var j = 0; j < quals.length; j ++) {
                var q_comp = quals[j].comparator + ' ';
                var q_name = quals[j].qualification_type.name + ' ';

                var q_valu = quals[j].qualification_values;
                var q_values = '';
                for (var k = 0; k < quals.length; k ++) {
                    if (quals[j].qualification_values[k]) {
                        q_values += quals[j].qualification_values[k];
                        q_values += k === quals.length ? ', ' : '';
                    }
                }
                if ( typeof quals[j].qualification_request_url !== 'undefined' ) {
                    q_values += '~!~' + quals[j].qualification_request_url;
                }
                qualif += (q_name + q_comp + q_values).trim() + '; ';
            }
            qualif = qualif.trim();
        }

        qualif = DOMPurify.sanitize(qualif,config);

        if (!hitlog[key]) {
            hitlog[key] = {
                reqname  : req_name,
                reqid    : req_id,
                reqlink  : req_link,
                conlink  : con_link,
                groupid  : group_id,
                prevlink : prev_link,
                pandlink : pand_link,
                title    : title,
                safetitle: safetitle,
                desc     : desc,
                time     : time,
                reward   : reward,
                avail    : avail,
                quals    : qualif,
                key      : key,
                tolink   : 'https://turkopticon.net/' + req_id,
                to       : { comm : 'N/A', fair : 'N/A', fast : 'N/A', pay  : 'N/A' },
                tvlink   : 'https://turkerview.com/requesters/' + req_id,
                tv       : 'N/A'
            };

            if ( $.inArray( req_id, requesters ) == -1 ) {
                new_requesters.push( req_id );
            }

            to.push([key, req_id]);
            log_keys.push(key);
        }
        else {
            hitlog[key].avail = avail;
        }
    }

    var tvPromise = _getTVReviews( new_requesters );
    var toPromise = _to(keys, log_keys, logged_in, to, timeis);

    $.when( tvPromise, toPromise).done( function( v1, v2 ) {
            _build(keys, log_keys, timeis);
        }
    );
}

let stopTV = false;
let tv_fail_rate = 0;
function _getTVReviews( reqlist ) {
    var def = $.Deferred();
    if ( reqlist.length > 0 && !config.disable_tv && !stopTV){
        fetch(`https://view.turkerview.com/v1/requesters/?requester_ids=${reqlist.join()}`, {
            method: 'GET',
            cache: 'no-cache',
            headers: ViewHeaders
        }).then(response => {
            if (!response.ok) throw response;

            return response.json();
        }).then(json => {

            newreviews = json.requesters;
            $.merge( requesters, reqlist );
            turkerview = extend( turkerview, newreviews);
            def.resolve(json);

        }).catch(ex => {
            tv_fail_rate++;
            if (ex.statusText == 'invalidUserAuthKey') {
                stopTV = true;
                $('#TVErrorMessage').find('p').html(`<span>Your TurkerView API Key is invalid. If you haven't added it yet check the "Advanced Settings" options tab!</span><p style="margin-bottom: 0.5rem; margin-top: 0.5rem;">You can claim your free API key (or support the site with a subscription!) from your <a href="https://turkerview.com/account/api/" target="_blank">TurkerView account API dashboard.</a></p>`);
                $('#TVErrorMessage').show();
            }
            else if (ex.statusText == 'dailyLimitExceeded' || ex.statusText == 'freeTrialExpired') {
                stopTV = true;
                $('#TVErrorMessage').find('p').html(`<span>Your TurkerView API Key has hit the free quota limit, please upgrade from your <a href="https://turkerview.com/account/api/" target="_blank">TurkerView account API dashboard</a>.</span>`);
                $('#TVErrorMessage').show();
            }

            def.resolve( 'Empty');
        });
    }
    else {
        def.resolve( 'Empty');
    }

    return def.promise();
}

function _getTVHourly( reqid ) {
    var tvHourly;
    if( reqid in turkerview ) {
        tvHourly = '$' + turkerview[reqid]['wages']['average']['wage'] + "/hr";
    }
    else {
        tvHourly = '-';
    }

    return tvHourly;
}

function _to (keys, log_keys, logged_in, to, timeis) {
    var def = $.Deferred();
    var timeout = true;

    var ids = [];

    if (logged_in && to.length && config.to) {
        for (var i = 0; i < to.length; i++) {
            ids.push(to[i][1]);
        }

        $.ajax( {
            url: 'https://turkopticon.net/api/multi-attrs.php?ids=' + ids,
            success: function (data) {
                try {
                    var to_data = JSON.parse(data);
                }
                catch(err) {
                    console.log ( "Fork off TO you're drunk" );
                    // malformed javascript, treat it lke TO timed out.
                    def.resolve( 'Done');
                }

                for (i = 0; i < to.length; i++) {
                    if (!to_data[to[i][1]].length && typeof to_data[to[i][1]].attrs != 'undefined') {
                        hitlog[to[i][0]].to = to_data[to[i][1]].attrs;
                    }
                }

                timeout = false;
            },
            timeout: 400
        }).always(function () {
            def.resolve( 'Done' );
        });
    }
    else {
        def.resolve( 'TO Off' );
    }
    return def.promise();

}

function _build (keys, log_keys, timeis) {
    var hit_html = '', log_html = '';

    for (var i = 0; i < keys.length; i++) {
        var hit = hitlog[keys[i]], blocked = _check_block(hit), included = _check_include(hit), remove = false, classes, tvHourly, tvScore = false;

        hit.tv = _getTVHourly( hit.reqid );

        if ( hit.tv.substring(0,3) == 'N/A' || hit.tv.substring(0,3) == '<sp' ) {
            tvScore = false;
        }
        else {
            tvScore = true;
        }

        rowcolor = tvScore == true ? _color_tv(hit) : 'toNone';

        classes = rowcolor;

        if (Number(config.avail) > Number(hit.avail) || Number(config.mto) > Number(hit.to.pay)) {
            classes += ' hidden';
            remove = true;
        }

        if (blocked) {
            classes += config.bl ? ' bl_hidden' : ' bl';
            remove = true;
        }

        if (included) {
            classes += ' il';
            _included(included, hit);
        }
        else {
            classes += config.nl ? ' nl_hidden' : ' nl';
        }

        hit_html +=
            '<div class="cont" style="margin-bottom: 2px;">' +
            '<div class="' + classes + ' " style="overflow: hidden; white-space: nowrap; margin-bottom: 2px;">' +

            '<div style="float: left; width: calc(100% - 330px);">' +

            '<span style="width: 25%; float: left; display:inline-block; overflow: hidden;">' +
            '<button data-term="' + hit.reqid + '" data-name="' + hit.reqname + '" class="rt">R</button>' +
            '<button id="'+ hit.groupid + '" data-term="' + hit.safetitle + '" data-name="' + hit.safetitle + '" class="rt">T</button>' +
            '<button data-term="' + hit.reqid + '" data-name="' + hit.reqname + '" class="it">I</button>' +
            '<a href="' + hit.reqlink + '">' + hit.reqname + '</a>' +
            '</span>' +

            '<span style="width: 75%; float: right; display:inline-block; overflow: hidden;">' +
            '<button value="' + hit.key + '" class="vb">vB</button>' +
            '<button value="' + hit.key + '" class="irc">IRC</button>' +
            '<button value="' + hit.key + '" class="slk">SLK</button>' +
            '<a href="' + hit.prevlink + '">' + hit.safetitle + '</a>' +
            '</span>' +

            '</div>' +

            '<div style="float: right;">' +

            '<span style="width: 60px; display:inline-block; text-align: center;">' +
            hit.avail +
            '</span>' +

            '<span style="width: 60px; display:inline-block; text-align: center;">' +
            '<a href="' + hit.pandlink + '">' + hit.reward + '</a>' +
            '</span>' +

            '<span class="to" style="width: 60px; display:inline-block; text-align: center;">' +
            '<a href="' + hit.tvlink + '">' + hit.tv + '</a>' +
            '</span>' +

            '<span class="to" style="width: 60px; display:inline-block; text-align: center;">' +
            '<a href="' + hit.tolink + '">' + hit.to.pay + '</a>' +
            '</span>' +

            '<span style="width: 60px; display:inline-block; text-align: center;">' +
            '<button data-term="' + hit.groupid + '" data-reqid="' + hit.reqid + '" data-reqname="' + hit.reqname.replace(/"/g, "&quot;" ) + '" data-title="' + hit.safetitle + '"  data-value="' + hit.reward.replace(/\$/g, '') + '" data-name="panda" class="pc">P</button>' +
            '<button data-term="' + hit.groupid + '" data-reqid="' + hit.reqid + '" data-reqname="' + hit.reqname.replace(/"/g, "&quot;" ) + '" data-title="' + hit.safetitle + '"  data-value="' + hit.reward.replace(/\$/g, '') + '" data-name="once" class="pc">O</button>' +
            '</span>' +

            '</div>' +
            '</div>' +
            '</div>'
        ;

        if (remove) {
            var index = log_keys.indexOf(keys[i]);

            if (index > -1) {
                log_keys.splice(index, 1);
            }
        }
    }

    if (log_keys.length) {
        for (var j = 0; j < log_keys.length; j ++) {
            var hit_log = hitlog[log_keys[j]], included_log = _check_include(hit_log), rowcolor, classes_log, tvHourly;

            rowcolor = hit_log.tv != 'N/A' ? _color_tv(hit_log) : 'toNone';

            classes_log = rowcolor;

            if (included_log) {
                classes_log += ' il';
            }
            else {
                classes_log += config.nl ? ' nl_hidden' : ' nl';
            }

            var quals = hit_log.quals.split(';');
            var qualif = '';

            for (var k = 0; k < quals.length; k ++) {
                if (quals[k] !== '') {
                    if( quals[k].indexOf('~!~') != -1 ) {
                        var temp = quals[k].split('~!~');
                        quals[k] = temp[0];
                        if (temp[1].indexOf('request') == -1 ) {
                            //Qual test
                            quals[k] += '<form action="' +temp[1] +'" method="get" style=" display:inline!important;"><button>Take Test</button></form>';
                        }
                        else {
                            //Request Qual
                            //quals[k] += '<form action="' +temp[1] +'" method="post"><button>Request</button></form>';
                        }
                    }
                    qualif += '<li style="padding: 2px;">' + quals[k] + '</li>';
                }
            }



            log_html +=
                '<div class="cont loggid_' + hit_log.groupid +' logreqid_' + hit_log.reqid + '" style="margin-bottom: 2px;">' +
                '<div class="' + classes_log + '" style="overflow: hidden; white-space: nowrap;">' +

                '<div style="float: left;">' +
                '<span style="width: 80px; display:inline-block;">' +
                '<button class="fa fa-plus-circle fa-2 details" aria-hidden="true" value="' + hit_log.key + '" style="background-color: transparent; border: 0px; padding: 1px;"></button>' +
                timeis[0] + ':' + timeis[1]  + timeis[3] + '</span>' +
                '</div>' +

                '<div style="float: left; width: calc(100% - 410px);">' +

                '<span style="width: 25%; float: left; display:inline-block; overflow: hidden;">' +
                '<button data-term="' + hit_log.reqid + '" data-name="' + hit_log.reqname + '" class="rt">R</button>' +
                '<button id="'+ hit_log.groupid + '" data-term="' + hit_log.safetitle + '" data-name="' + hit_log.safetitle + '" class="rt">T</button>' +
                '<button data-term="' + hit_log.reqid + '" data-name="' + hit_log.reqname + '" class="it">I</button>' +
                '<a href="' + hit_log.reqlink + '">' + hit_log.reqname + '</a>' +
                '</span>' +

                '<span style="width: 75%; float: right; display:inline-block; overflow: hidden;">' +
                '<button value="' + hit_log.key + '" class="vb">vB</button>' +
                '<button value="' + hit_log.key + '" class="irc">IRC</button>' +
                '<button value="' + hit_log.key + '" class="slk">SLK</button>' +
                '<a href="' + hit_log.prevlink + '">' + hit_log.safetitle + '</a>' +
                '</span>' +

                '</div>' +

                '<div style="float: right;">' +

                '<span style="width: 60px; display:inline-block; text-align: center;">' +
                hit_log.avail +
                '</span>' +

                '<span style="width: 60px; display: inline-block; text-align: center;">' +
                '<a href="' + hit_log.pandlink + '">' + hit_log.reward + '</a>' +
                '</span>' +

                '<span class="to" style="width: 60px; display:inline-block; text-align: center;">' +
                '<a href="' + hit_log.tvlink + '">' + hit_log.tv + '</a>' +
                '</span>' +


                '<span class="to" style="width: 60px; display:inline-block; text-align: center;">' +
                '<a href="' + hit_log.tolink + '">' + hit_log.to.pay + '</a>' +
                '</span>' +

                '<span style="width: 60px; display:inline-block; text-align: center;">' +
                '<button data-term="' + hit_log.groupid + '" data-reqid="' + hit_log.reqid + '" data-reqname="' + hit_log.reqname.replace(/"/g, "&quot;" ) + '" data-title="' + hit_log.safetitle + '"  data-value="' + hit_log.reward.replace(/\$/g, '') + '" data-name="panda" class="pc">P</button>' +
                '<button data-term="' + hit_log.groupid + '" data-reqid="' + hit_log.reqid + '" data-reqname="' + hit_log.reqname.replace(/"/g, "&quot;" ) + '" data-title="' + hit_log.safetitle + '"  data-value="' + hit_log.reward.replace(/\$/g, '') + '" data-name="once" class="pc">O</button>' +
                '</span>' +

                '</div>' +
                '</div>'+

                '<div class="info ' + rowcolor + '" value="' + hit_log.key + '" style="overflow: hidden; display: none; font-size: 11px;">' +

                '<div style="border-bottom: 1px solid #000000;"></div>' +

                '<span style="width: 33%; float: left; display:inline-block; padding: 5px;">' +
                '<span style="text-decoration: underline;">Description</span>' +
                '<div style="padding: 2px;">' + hit_log.desc +'</div>' +
                '<span style="text-decoration: underline;">Time</span>' +
                '<div style="padding: 2px;">' + hit_log.time +'</div>' +
                '</span>' +

                '<span style="width: 33%; float: left; display:inline-block; padding: 5px;">' +
                '<span style="text-decoration: underline;">Qualifications</span>' +
                qualif +
                '</span>' +

                '<span style="width: calc(34% - 30px); float: right; display:inline-block; padding: 5px;">' +
                '<span style="text-decoration: underline;">Turkopticon</span>' +
                '<br>' +
                '<span style="width: 70px; display:inline-block; padding: 2px;">Pay  : ' + hit_log.to.pay +'</span>' +
                '<span style="width: 70px; display:inline-block; padding: 2px;">Fair : ' + hit_log.to.fair +'</span>' +
                '<br>' +
                '<span style="width: 70px; display:inline-block; padding: 2px;">Comm : ' + hit_log.to.comm +'</span>' +
                '<span style="width: 70px; display:inline-block; padding: 2px;">Fast : ' + hit_log.to.fast +'</span>' +
                '</span>' +

                '</div>' +
                '</div>';

            logged ++;
        }
        if (config.new) {
            _sound('new');
        }
    }
    $('#new_hits_').html(hit_html);
    $('#log_hits_').prepend(log_html);

    searches ++;
    var hits_data = '<span> ' + timeis[0] + ':' + timeis[1] + ':' + timeis[2] + timeis[3] + ' Scanned HITs: ' + keys.length + '</span><span style="float: right;">' + tv_fail_rate + '/' + searches + '</span>';
    var logged_hits_data = '<span style="float: right;">' + logged + '</span>';

    $('#hits_data').html(hits_data);
    $('#logged_hits_data').html(logged_hits_data);

    if ($('#scan_button').text() === 'Stop') {
        setTimeout(function () {
            _scan();
        }, $('#delay').val() * 1000);
    }
}

function _sound (sound) {
    if (sound === 'new')     { $('#audio_' + config.newaudio)           [0].play(); }
    if (sound === 'include') { $('#audio_' + config.newaudio)           [0].play(); }
    if (sound === 'il')      { $('#audio_' + $('#il_sound').val())      [0].play(); }
    if (sound === 'il_edit') { $('#audio_' + $('#edit_il_sound').val()) [0].play(); }
}

function _check_block (hit) {
    for (var key in blocklist) {
        var obj = blocklist[key];
        if (obj.term.toLowerCase() === hit.reqname.toLowerCase() || obj.term.toLowerCase() === hit.title.toLowerCase() || obj.term.toLowerCase() === hit.reqid.toLowerCase() || obj.term.toLowerCase() === hit.groupid.toLowerCase()) {
            return obj;
        }
    }
}

function _check_include (hit) {
    for (var key in includelist) {
        var obj = includelist[key];
        if (obj.term.toLowerCase() === hit.reqname.toLowerCase() || obj.term.toLowerCase() === hit.title.toLowerCase() || obj.term.toLowerCase() === hit.reqid.toLowerCase() || obj.term.toLowerCase() === hit.groupid.toLowerCase()) {
            return obj;
        }
    }
}

function _included (obj, hit) {
    var check = noti_delay.indexOf(hit.key) !== -1;
    var pushcheck = push_delay.indexOf(hit.key) !== -1;

    if (!check) {
        noti_delay.unshift(hit.key);
        setTimeout(function () { noti_delay.pop(); }, config.alert * 1000);
    }
    if (obj.noti_cb && !check) {
        Notification.requestPermission();
        var n = new Notification(hit.reqname + ' | ' + hit.reward, {
            icon : 'http://nopurpose.org/stuff/avatars/Lj21396.gif',
            body : hit.title,
        });
        setTimeout(n.close.bind(n), 5000);

        n.onclick = function(e) {
            e.preventDefault();
            window.open(hit.prevlink, '_blank');
        };

    }
    if (obj.sound_cb && !check) {
        if ( !config.tts ) {
            $('#audio_' + obj.sound)[0].play();
        }
        else {
            //Console.log("BOOM, TTS");
            slothbearsTTS(obj);
        }
    }
    if (obj.push_cb && !pushcheck && config.pb) {
        push_delay.unshift(hit.key);
        setTimeout(function () { push_delay.pop(); }, 900000);

        var push = {};

        push['type'] = 'note';
        push['title'] = 'HIT Finder';
        push['body'] = '[' + hit.reqname + ']\n[' + hit.safetitle + ']\n[' + hit.reward + ']\n[' + hit.prevlink + ']';

        $.ajax({
            type    : 'POST',
            headers : {'Authorization': 'Bearer ' + config.push},
            url     : 'https://api.pushbullet.com/v2/pushes',
            data    : push
        });

    }
}

function _color_tv(hit) {
    var tvHourly = hit.tv.replace(/\$/g, '').replace(/\/hr/g, '');

    if (tvHourly == '-') return 'toNone';

    if (config.theme == "light") {
        if (tvHourly >= 10.00) { return 'tvHigh'; }
        else if (tvHourly >= 7.25) { return 'tvFair'; }
        else { return 'tvLow'; }
    }
    else {
        if (tvHourly >= 10.00) { return 'toHigh'; }
        else if (tvHourly >= 7.25) { return 'toAverage'; }
        else { return 'toLow'; }

    }
}

function _color_to (hit) {
    var to = hit.to.pay;

    if (config.theme == "light") {
        if      (to > 4) { return 'tvHigh';    }
        else if (to > 2.5) { return 'tvFair';    }
        else if (to > 0) { return 'tvLow'; }
        else             { return 'tvNone';    }
    }
    else {
        if      (to > 4) { return 'toHigh';    }
        else if (to > 3) { return 'toGood';    }
        else if (to > 2.25) { return 'toAverage'; }
        else if (to > 1.25) { return 'toLow';     }
        else if (to > 0) { return 'toPoor';    }
        else             { return 'toNone';    }

    }
}

function _convert_seconds (seconds) {
    seconds = Number(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);
    var time = '';
    if (h > 0) { time += h + ' hour(s) ';    }
    if (m > 0) { time += m + ' minutes(s) '; }
    if (s > 0) { time += s + ' seconds(s)';  }
    return time;
}

function _block (term, name, gid) {
    $('#bl_term') .val(term);
    $('#bl_name') .val(name);
    $('#bl_gid').val(gid);
    $('#bl')      .show();
}

function _includerid( term, name, gid ) {
    $('#il_term') .val(term);
    $('#il_name') .val(name);
    $('#il')      .show();
}

function _panda(term, reqname, reqid, title, value, name, button) {
    var hitData = {
        hitTitle: title,
        requesterName: reqname,
        requesterId: reqid,
        hitValue: value
    }

    var once = name == "panda" ? false : true;

    PandaCrazy.online().then (
        function(successResp) {
            PandaCrazy.addJob( term, once, hitData );
            button.addClass("clicked")
        },
        function(failedResp) {
            alert( "Panda Crazy doesn't appear to be running. Please double check if it's being run on the same browser profile and try again");
        }
    );
    //console.log ( running );
}


function _add_block (obj) {
    if (!blocklist[obj.term]) {
        blocklist[obj.term] = obj;
        _init_lists();
    }
}

function _edit_block (term) {
    var obj = blocklist[term];
    $('#edit_bl_term')   .val(obj.term) .text(obj.term);
    $('#edit_bl_name')   .val(obj.name);
    $('#edit_bl_save')   .val(obj.term);
    $('#edit_bl_delete') .val(obj.term);
    $('#edit_bl')        .show();
}

function _update_block (block) {
    var obj = blocklist[block];
    obj.name = $('#edit_bl_name').val();
    _init_lists();
}

function _delete_block (block) {
    delete blocklist[block];
    _init_lists();
}

function _add_include (obj) {
    if (!includelist[obj.term]) {
        includelist[obj.term] = obj;
        _init_lists();
    }
}

function _edit_include (term) {
    var obj = includelist[term];

    $('#edit_il_term')  .val(obj.term) .text(obj.term);
    $('#edit_il_name')  .val(obj.name);
    $('#edit_il_sound') .val(obj.sound);

    $('#edit_il_noti_cb')  .prop('checked', obj.noti_cb);
    $('#edit_il_sound_cb') .prop('checked', obj.sound_cb);
    $('#edit_il_push_cb') .prop('checked', obj.push_cb);

    $('#edit_il_save')   .val(obj.term);
    $('#edit_il_delete') .val(obj.term);

    $('#edit_il').show();
}

function _update_include (term) {
    var obj = includelist[term];
    obj.name     = $('#edit_il_name')  .val().trim();
    obj.sound    = $('#edit_il_sound') .val().trim();
    obj.noti_cb  = $('#edit_il_noti_cb')  .prop('checked');
    obj.sound_cb = $('#edit_il_sound_cb') .prop('checked');
    obj.push_cb = $('#edit_il_push_cb') .prop('checked');
    _init_lists();
}

function _delete_include (term) {
    delete includelist[term];
    _init_lists();
}

function _hide_hit_list( hide ) {
    if (hide) {
        $("#hits_button").text('Show New HITs');
        $('#hits_table').hide();
        $('#hits_hidden').show();
        config.h_hidden = '1';
    }
    else {
        $("#hits_button").text('Hide New HITs');
        $('#hits_table').show();
        $('#hits_hidden').hide();
        config.h_hidden = '0';
    }

    _save( 'showhide' );
}

function _hide_log_list( hide ) {
    if (hide) {
        $("#logg_button").text('Show Logged HITs');
        $('#log_table').hide();
        $('#log_hidden').show();
        config.l_hidden = '1';
    }
    else {
        $("#logg_button").text('Hide Logged HITs');
        $('#log_table').show();
        $('#log_hidden').hide();
        config.l_hidden = '0';
    }

    _save( 'showhide' );
}

function _init_lists () {
    var bl_sort = [], il_sort = [], bl_html = '', il_html = '';

    for (var bl_key in blocklist) {
        bl_sort.push([bl_key, blocklist[bl_key].name]);
    }

    bl_sort.sort(function (a, b) {
        if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
        if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
        return 0;
    });

    for (var i = 0; i < bl_sort.length; i ++) {
        var bl_obj = blocklist[bl_sort[i][0]];
        bl_html += '<button class="blockit" style="margin: 2px;" value="' + bl_obj.term + '" title="' + bl_obj.term + '">' + bl_obj.name + '</button>';
    }

    for (var il_key in includelist) {
        il_sort.push([il_key, includelist[il_key].name]);
    }

    il_sort.sort(function (a, b) {
        if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
        if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
        return 0;
    });

    for (var j = 0; j < il_sort.length; j ++) {
        var il_obj = includelist[il_sort[j][0]];
        il_html += '<button class="includeit" style="margin: 2px;" value="' + il_obj.term + '" title="' + il_obj.term + '">' + il_obj.name + '</button>';
    }

    $('#bl_items') .html(bl_html);
    $('#il_items') .html(il_html);
    _save('init');
}

function _import_block () {
    var import_bl  = prompt(
        'Block List Import\n\n' +
        'You can import from HIT Finder or HIT Scraper.\n\n' +
        'This will not delete your current block list, only add to it.\n\n' +
        'Please enter your block list here.',
        ''
    );

    if (import_bl) {
        var json = _json_validator(import_bl);

        if (json) {
            var _bl_obj = JSON.parse(import_bl);
            for (var key in _bl_obj) {
                if (_bl_obj[key].hasOwnProperty('term') && _bl_obj[key].hasOwnProperty('name') && !_bl_obj[key].hasOwnProperty('sound')) {
                    if (!blocklist[key]) {
                        blocklist[key] = {
                            term : _bl_obj[key].term,
                            name : _bl_obj[key].name
                        };
                    }
                }
                else {
                    alert('An error occured while importing.\n\n Please check if you have a valid import and try again.');
                    break;
                }
            }
            _init_lists();
        }
        else if (import_bl.match(/^/)) {
            var _bl_arr = import_bl.trim().split('^');
            for (var i = 0; i < _bl_arr.length; i ++) {
                if (!blocklist[_bl_arr[i]]) {
                    blocklist[_bl_arr[i]] = {
                        term : _bl_arr[i],
                        name : _bl_arr[i]
                    };
                }
            }
            _init_lists();
        }
    }
    else {
        alert('An error occured while importing.\n\n Please check if you have a valid import and try again.');
    }
}

function _export_block () {
    GM_setClipboard(localStorage.getItem('_finder_bl'));
    alert('Your block list has been copied to your clipboard.');
}

function _import_include () {
    var import_il  = prompt(
        'Include List Import\n\n' +
        'You can import from HIT Finder or HIT Scraper.\n\n' +
        'This will not delete your current include list, only add to it.\n\n' +
        'Please enter your include list here.',
        ''
    );

    if (import_il) {
        var json = _json_validator(import_il);

        if (json) {
            var _il_obj = JSON.parse(import_il);

            for (var key in _il_obj) {
                if (_il_obj[key].hasOwnProperty('term') && _il_obj[key].hasOwnProperty('name') && _il_obj[key].hasOwnProperty('sound')) {
                    if (!includelist[key]) {
                        includelist[key] = {
                            term     : _il_obj[key].term,
                            name     : _il_obj[key].name,
                            sound    : _il_obj[key].sound,
                            noti_cb  : _il_obj[key].noti_cb,
                            sound_cb : _il_obj[key].sound_cb,
                            push_cb  : _il_obj[key].push_cb
                        };
                    }
                }
                else {
                    alert('An error occured while importing.\n\n Please check that you have a valid import and try again.');
                    break;
                }
            }
            _init_lists();
        }
        else if (import_il.match(/^/)) {
            var _il_arr = import_il.split('^');

            for (var i = 0; i < _il_arr.length; i ++) {
                if (!includelist[_il_arr[i]]) {
                    includelist[_il_arr[i]] = {
                        term     : _il_arr[i],
                        name     : _il_arr[i],
                        sound    : '1',
                        noti_cb  : true,
                        sound_cb : true,
                        push_cb  : false
                    };
                }
            }
            _init_lists();
        }
    }
    else {
        alert('An error occured while importing.\n\n Please check that you have a valid import and try again.');
    }
}

function _export_include () {
    GM_setClipboard(localStorage.getItem('_finder_il'));
    alert('Your include list has been copied to your clipboard.');
}

function _export_vb (key) {
    var hit = hitlog[key];

    var pay = hit.to.pay,  _pay = '#B30000';
    if      (pay > 3.99) { _pay = '#00B300'; }
    else if (pay > 2.99) { _pay = '#B3B300'; }
    else if (pay > 1.99) { _pay = '#B37400'; }

    var fair = hit.to.fair, _fair = '#B30000';
    if      (fair > 3.99) { _fair = '#00B300'; }
    else if (fair > 2.99) { _fair = '#B3B300'; }
    else if (fair > 1.99) { _fair = '#B37400'; }

    var comm = hit.to.comm, _comm = '#B30000';
    if      (comm > 3.99) { _comm = '#00B300'; }
    else if (comm > 2.99) { _comm = '#B3B300'; }
    else if (comm > 1.99) { _comm = '#B37400'; }

    var fast = hit.to.fast, _fast = '#B30000';
    if      (fast > 3.99) { _fast = '#00B300'; }
    else if (fast > 2.99) { _fast = '#B3B300'; }
    else if (fast > 1.99) { _fast = '#B37400'; }

    var tv = hit.tv.replace(/\$/g, ''), _tvhourly = '#B30000';
    if ( tv != 'N/A' ) {
        if ( tv  >= 10 ) { _tvhourly = '#00B300'; }
        else if ( tv >= 7.25 ) { _tvhourly = '#B3B300'; }
        tv = '$' + tv + '/hr';
    }

    var quals = hit.quals.split(';');
    var qualif = '';

    for (var k = 0; k < quals.length; k ++) {
        if (quals[k] !== '') {
            if( quals[k].indexOf('~!~') != -1 ) {
                var temp = quals[k].split('~!~');
                quals[k] = temp[0];
                if (temp[1].indexOf('request') == -1 ) {
                    //Qual test
                    quals[k] += '[URL=' +temp[1] +']Take Test[/URL]';
                }
                else {
                    //Request Qual
                    //quals[k] += '<form action="' +temp[1] +'" method="post"><button>Request</button></form>';
                }
            }
            qualif += quals[k] + ';';
        }
    }

    var exportcode = '[table][tr][td]'+
        '[b]Title:[/b] [URL=' + pandaurl + hit.prevlink + ']' + hit.safetitle + '[/URL] | [URL=' + pandaurl + hit.pandlink + ']PANDA[/URL]\n' +
        '[b]Requester:[/b] [URL=' + pandaurl + hit.reqlink + ']' + hit.reqname + '[/URL] [' + hit.reqid + '] ([URL=' + hit.tvlink +']Req TV[/URL]): [B][COLOR=' + _tvhourly + ']' + tv + '[/COLOR][/B]\n' +
        '([URL='+hit.tolink+']TO[/URL]):'+
        '[b] \[Pay: [COLOR=' + _pay + ']' + pay + '[/COLOR]\][/b]'+
        '[b] \[Fair: [COLOR=' + _fair + ']' + fair + '[/COLOR]\][/b]' +
        '[b] \[Comm: [COLOR=' + _comm +']' + comm + '[/COLOR]\][/b]' +
        '[b] \[Fast: [COLOR=' + _fast + ']' + fast + '[/COLOR]\][/b]\n' +
        '[b]Description:[/b] ' + hit.desc + '\n' +
        '[b]Time:[/b] ' + hit.time + '\n' +
        '[b]HITs Available:[/b] ' + hit.avail + '\n' +
        '[b]Reward:[/b] [COLOR=green][b] ' + hit.reward + '[/b][/COLOR]\n' +
        '[b]Qualifications:[/b] ' + qualif + '\n' +
        '[/td][/tr][/table]';

    GM_setClipboard(exportcode);
    alert('Forum export has been copied to your clipboard.');
}

function _export_irc (key) {
    var hit = hitlog[key];

    $.get('https://ns4t.net/yourls-api.php?action=bulkshortener&title=MTurk&signature=39f6cf4959&urls[]=https://worker.mturk.com' + hit.prevlink + '&urls[]=https://worker.mturk.com' + hit.pandlink, function (data) {
        var urls = data.split(';'),
            preview = urls[0],
            panda   = urls[1];

        var exportcode = 'Req: ' + hit.reqname + ' ■ Title: ' + hit.safetitle + ' ■ Reward: ' + hit.reward;
        exportcode += preview !== panda ? ' ■ Prev: ' + preview + ' ■ PandA: '+ panda : ' ■ Search: ' + preview;
        exportcode += ' ■ TO: (Pay: ' + hit.to.pay + ') (Fair: ' + hit.to.fair + ') (Comm: ' + hit.to.comm + ') (Fast: ' + hit.to.fast + ')';

        GM_setClipboard(exportcode);
        alert('IRC export has been copied to your clipboard.');

    }).fail(function () {
        alert('Failed to shorten links.');
    });
}

function _json_validator (data) {
    try {
        JSON.parse(data);
        return true;
    }
    catch (e) {
        return false;
    }
}

function _export_slk (key) {
  var hit = hitlog[key];
  var quals = hit.quals.split(';');
  var qualif = '';

    for (var k = 0; k < quals.length; k ++) {
        if (quals[k] !== '') {
            if( quals[k].indexOf('~!~') != -1 ) {
                var temp = quals[k].split('~!~');
                quals[k] = temp[0];
                if (temp[1].indexOf('request') == -1 ) {
                    //Qual test
                    quals[k] += '\nQual Test: https://worker.mturk.com' +temp[1] + '\n' ;
                }
                else {
                    //Request Qual
                    //quals[k] += '<form action="' +temp[1] +'" method="post"><button>Request</button></form>';
                }
            }
          qualif += quals[k] + ';';
        }
      }

     var exportcode = 'Title: ' + hit.safetitle + ' • ' + pandaurl + hit.prevlink.replace(/\?ref=w_pl_prvw/, '') + ' • ' + pandaurl + hit.pandlink.replace(/\?ref=w_pl_prvw/, '') + '\n' +
        'Requester: ' + hit.reqname + ' • ' + pandaurl + hit.reqlink.replace(/\?ref=w_pl_prvw/, '') + '\n' +
        'TV: [Hrly: $' + hit.tv.replace(/\$/g, '') + '] [Fast:] [Comm:] [Fair:] [Reviews:] [ToS:] • ' + hit.tvlink + '\n' +
        'TO: [Pay: ' + hit.to.pay + '] [Fast: ' + hit.to.fast + '] [Comm: ' + hit.to.comm + '] [Fair: ' + hit.to.fair + '] • ' + hit.tolink + '\n' +
        'Reward: $' + hit.reward.replace(/\$/g, '') + '\n' +
        'Duration: ' + hit.time + '\n' +
        'Available: ' + hit.avail + '\n' +
        'Description: ' + hit.desc + '\n' +
        'Requirements: ' + quals + '\n'
       ;
  GM_setClipboard(exportcode);
  alert('Slack export has been copied to your clipboard.');
}

function _save (type) {
    if (type !== 'init' && type !== 'custom') {
        config.delay    = $('#delay')       .val();
        config.rew      = $('#min_rew')     .val();
        config.avail    = $('#min_avail')   .val();
        config.mto      = $('#min_to')      .val();
        config.alert    = $('#alert_delay') .val();
        config.type     = $('#type')        .val();
        config.size     = $('#size')        .val();
        config.newaudio = $('#new_audio')   .val();
        config.theme    = $('#adv_theme')   .val();
        config.to_theme = $('#to_theme')    .val();

        config.new  = $('#new_sound') .prop('checked');
        config.pb   = $('#pb')        .prop('checked');
        config.tts  = $('#tts')       .prop('checked');
        config.to   = $('#to')        .prop('checked');
        config.qual = $('#qual')      .prop('checked');
        config.nl   = $('#nl_hide')   .prop('checked');
        config.bl   = $('#bl_hide')   .prop('checked');
        config.m    = $('#m_hide')    .prop('checked');
        console.log($('#push').val());

    }
    if (type === 'custom' && $('#adv_theme').val() === 'custom') {
        config.custom = {
            main      : $('#theme_main')      .val(),
            primary   : $('#theme_primary')   .val(),
            secondary : $('#theme_secondary') .val(),
            text      : $('#theme_text')      .val(),
            link      : $('#theme_link')      .val(),
            visited   : $('#theme_visited')   .val(),
            prop      : false
        };
        themes.custom = config.custom;
    }
    config.push     = $('#push').val();
    config.tv_api_key = $('#tv_api_key').val();

    localStorage.setItem('_finder', JSON.stringify(config));
    localStorage.setItem('_finder_bl', JSON.stringify(blocklist));
    localStorage.setItem('_finder_il', JSON.stringify(includelist));

    if (config.nl) { $('.nl').toggleClass('nl nl_hidden');        }
    else           { $('.nl_hidden').toggleClass('nl nl_hidden'); }

    if (config.bl) { $('.bl').toggleClass('bl bl_hidden');        }
    else           { $('.bl_hidden').toggleClass('bl bl_hidden'); }

    if (config.m) { $('.m').toggleClass('m m_hidden');        }
    else          { $('.m_hidden').toggleClass('m m_hidden'); }
}

function _theme () {
    var theme = themes[config.theme];

    $('#theme_main')      .val(theme.main)      .prop('disabled', theme.prop);
    $('#theme_primary')   .val(theme.primary)   .prop('disabled', theme.prop);
    $('#theme_secondary') .val(theme.secondary) .prop('disabled', theme.prop);
    $('#theme_text')      .val(theme.text)      .prop('disabled', theme.prop);
    $('#theme_link')      .val(theme.link)      .prop('disabled', theme.prop);
    $('#theme_visited')   .val(theme.visited)   .prop('disabled', theme.prop);
    _write_theme();
}

function _write_theme () {
    var css  = _to_theme(), theme = themes[config.theme];

    css +=
        'html {color: #' + theme.text + '; background-color: #' + theme.main + '; line-height: 1.5; font-family: "Roboto", sans-serif; font-size: 15px; font-weight: normal;}' +
        'body {margin: 0px;}' +
        '#menubar { background-color: #' + theme.menu + '; margin: 0px; padding: 3px; height:30px; color: #' + theme.menutext + ' }' +
        '#latest_hits { margin: 5px; }' +
        '#logged_hits { margin: 5px; }' +
        '#config { background-color: #' + theme.primary + '; border: 2px #' + theme.text + ' solid; padding: 2px;}' +

        '#bl_items, #il_items {background-color: #'+theme.main+'; height: calc(100% - 64px); overflow-y: scroll;}' +
        '#bl_div, #il_div {background-color: #'+theme.primary+'; border: 2px solid #'+theme.secondary+';}' +

        '.add {background-color: #'+theme.primary+'; border: 2px solid #'+theme.secondary+';}' +

        '.bl {border: 2px solid  #FF0000;}' +
        '.il {border: 2px solid  #009900;}' +
        '.hidden, .nl_hidden, .bl_hidden, .m_hidden {display: none;}' +
        'button:focus {outline: none !important;}';

    if (config.theme == 'light' ) {
        css +=
            '.tvHigh    {background-color: rgba(0,128,0,0.3); }' +
            '.tvFair    {background-color: rgba(255,165, 0, 0.3);}' +
            '.tvLow     {background-color: rgba(255,0,0,0.3); }' +
            '.tvNone    {background-color: rgba(128,128,128, 0.3); }'
    }

    $('#css').html(css);
}

function _to_theme () {
    var to, theme = themes[config.theme], color = '';
    console.log(config.to_theme);
    if (config.theme === 'default') {
        color = 'd9d9d9';
    }
    else {
        color = '262626';
    }

    switch (config.to_theme) {
        case '1':
            to =
                'td {font-weight: bold;}' +
                '.cont, .hit, .details {color: #000000;}' +
                '.toHigh    {background-color: #33cc59;}' +
                '.toGood    {background-color: #a6cc33;}' +
                '.toAverage {background-color: #cccc33;}' +
                '.toLow     {background-color: #cca633;}' +
                '.toPoor    {background-color: #cc3333;}' +
                '.toNone    {background-color: #cccccc;}' +
                '.rt, .it, .pc   {width: 20px; height: 20px; background-color: transparent; margin: 1px;  border: 1px solid  #000000; font-size: 80%; padding: 1px;}' +
                '.vb, .irc, .slk {width: 25px; height: 20px; background-color: transparent; margin: 1px;  border: 1px solid  #000000; font-size: 80%; padding: 1px;}' +
                '.clicked   {background-color:grey;}';
            ;
            return to;
        case '2':
            to =
                'a         {color: #'+theme.link+';}' +
                'a:visited {color: #'+theme.visited+';}' +
                'tbody td  {color: #'+theme.text+';}' +
                '.to a {color: #000000;}' +

                '.cont, .details {color: #'+theme.text+';}' +
                '.toHigh    {background-color: #'+color+';}' +
                '.toGood    {background-color: #'+color+';}' +
                '.toAverage {background-color: #'+color+';}' +
                '.toLow     {background-color: #'+color+';}' +
                '.toPoor    {background-color: #'+color+';}' +
                '.toNone    {background-color: #'+color+';}' +

                '.toHigh    .to {background-color: #33cc59;}' +
                '.toGood    .to {background-color: #a6cc33;}' +
                '.toAverage .to {background-color: #cccc33;}' +
                '.toLow     .to {background-color: #cca633;}' +
                '.toPoor    .to {background-color: #cc3333;}' +
                '.toNone    .to {background-color: #cccccc;}' +
                '.rt, .pc   {width: 20px; height: 20px; color: #'+theme.text+'; background-color: transparent; margin: 1px;  border: 1px solid  #'+theme.text+'; font-size: 80%; padding: 1px;}' +
                '.vb, .irc, .slk {width: 25px; height: 20px; color: #'+theme.text+'; background-color: transparent; margin: 1px;  border: 1px solid  #'+theme.text+'; font-size: 80%; padding: 1px;}' +
                '.clicked   {background-color:grey;}';
            ;
            return to;
        case '3':
            to =
                'a         {color: #'+theme.link+';}' +
                'a:visited {color: #'+theme.visited+';}' +
                'tbody td  {color: #'+theme.text+';}' +

                '.cont, .details {color: #'+theme.text+';}' +
                '.toHigh    {background-color: #'+color+';}' +
                '.toGood    {background-color: #'+color+';}' +
                '.toAverage {background-color: #'+color+';}' +
                '.toLow     {background-color: #'+color+';}' +
                '.toPoor    {background-color: #'+color+';}' +
                '.toNone    {background-color: #'+color+';}' +

                '.toHigh    .to a {color: #33cc59;}' +
                '.toGood    .to a {color: #a6cc33;}' +
                '.toAverage .to a {color: #cccc33;}' +
                '.toLow     .to a {color: #cca633;}' +
                '.toPoor    .to a {color: #cc3333;}' +
                '.toNone    .to a {color: #cccccc;}' +
                '.rt, .pc   {width: 20px; height: 20px; color: #'+theme.text+'; background-color: transparent; margin: 1px;  border: 1px solid  #'+theme.text+'; font-size: 80%; padding: 1px;}' +
                '.vb, .irc, .slk {width: 25px; height: 20px; color: #'+theme.text+'; background-color: transparent; margin: 1px;  border: 1px solid  #'+theme.text+'; font-size: 80%; padding: 1px;}' +
                '.clicked   {background-color:grey;}';
            ;
            return to;
    }
}

$('#type option[value="' + config.type + '"]')          .prop('selected', true);
$('#size option[value="' + config.size + '"]')          .prop('selected', true);
$('#new_audio option[value="' + config.newaudio + '"]') .prop('selected', true);
$('#adv_theme option[value="' + config.theme + '"]')    .prop('selected', true);
$('#to_theme option[value="' + config.to_theme + '"]')  .prop('selected', true);

_theme();
_init_lists();
_hide_hit_list( config.h_hidden == '1' ? true : false );
_hide_log_list( config.l_hidden == '1' ? true : false );