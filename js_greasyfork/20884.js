// ==UserScript==
// @name        Stig's Facebook Homefeed Cleanr
// @namespace   dk.rockland.userscript.facebook.cleanr
// @description Cleaning up the homefeed on Facebook. Removes or highlights Suggested, sponsored and paid content in the homefeed.
// @match       *://*.facebook.com/*
// @version     2018.03.30.0
// @author      Stig Nygaard, http://www.rockland.dk
// @homepageURL http://www.rockland.dk/userscript/facebook/cleanr/
// @supportURL  http://www.rockland.dk/userscript/facebook/cleanr/
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceURL
// @require     https://greasyfork.org/scripts/34527/code/GMCommonAPI.js?version=237580
// @resource    imgSettingsGCTM https://greasyfork.org/system/screenshots/screenshots/000/008/955/original/FBCleanrGCTM.png
// @resource    imgSettingsFFGM https://greasyfork.org/system/screenshots/screenshots/000/008/956/original/FBCleanrFFGM.png
// @resource    imgSadSmiley https://i.pinimg.com/originals/e4/13/54/e4135406951feb9b6bd685ef019e8d06.png
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/20884/Stig%27s%20Facebook%20Homefeed%20Cleanr.user.js
// @updateURL https://update.greasyfork.org/scripts/20884/Stig%27s%20Facebook%20Homefeed%20Cleanr.meta.js
// ==/UserScript==


/*
 *      Stig's Facebook Homefeed Cleanr is an userscript to remove or highlight
 *      posts in the in the homefeed, like Suggested Posts and Sponsored content.
 *
 *      https://greasyfork.org/scripts/20884-stig-s-facebook-homefeed-cleanr
 *      https://github.com/StigNygaard/Stigs_Facebook_Homefeed_Cleanr
 *
 *      Should work with all popular browsers and userscript managers. Compatibility with the new
 *      Greasemonkey 4 WebExtension and Firefox 57+ is done with the help of GMCommonAPI library:
 *
 *      https://github.com/StigNygaard/GMCommonAPI.js
 *      https://greasyfork.org/scripts/34527-gmcommonapi-js
 *
 *      Facebook Homefeed Cleanr is by downloads my most popular usescript, however
 *      also the userscript I haven given least attention and updates since it was
 *      launched. If you like it, but are impatient about my rare updates, you are
 *      welcome to contribute to the development of my script or fork it on GitHub.
 */


/*
 *      Copyright 2017 Stig Nygaard
 *      Licensed under the Apache License, Version 2.0 (the "License");
 *      You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */



// CHANGELOG - The most important updates/versions:
var changelog = [
    {version: '2018.03.30.0', description: 'The End! Well, of life on Greasy Fork for this script at least (soon). I have realized I don\'t have the time or motivation to keep the script updated regularly.'},
    {version: '2017.12.07.1', description: 'Reverting to an older version of GMCommonAPI while investigating an error when running in Google Chrome.'},
    {version: '2017.11.05.2', description: 'Greasemonkey 4 compatibility. New Settings menu/dialog. Bug fixes. Moving development to GitHub repository.'},
    {version: '2016.10.18.0', description: 'Sepia/yellowish highlight filter (Works best with modern browsers) plus some fixes and extra configuration options.'},
    {version: '2016.06.24.1', description: '1st release. English Facebook supported.'}
]; // TODO: Further configuration options to tailor your homefeed. Danish and mutiple language support.

/*
 NOTE-TO-SELF:
 loop gennem alle prefilter_% indlæst
    loop gennem prefilter defaults
        hvis prefilter indlæst = prefilter default, så sæt (default) flag som indlæst
        hvis default flag true
            tilføj associeret patterne til filterlister[sprog]         (løkke for alle sprog her?)
        end-hvis
    end-loop
 end-loop
 */

var DEBUG = false;
var INFO = true; // Trace the hidden posts in log - even if debug=false
var cleaning_runcountINFO = false;
var setupObserverINFO = false;

function log(s, info) {
    if ((info && window.console) || (DEBUG && window.console)) {
        window.console.log('*Cleanr* '+s);
    }
}
var cleanr = cleanr || {
    list: [
        {language: 'English', filter: ['Suggested Post', 'Suggested video', 'Suggested Pages', 'Page stories you may like', 'Sponsored', ' Paid ']},
        // {language: 'English', filter: ['Suggested Post', 'Suggested video', 'Suggested Pages', 'Page stories you may like', /* 'replied to a comment on this', ' shared a memory ', */ 'Sponsored', ' Paid ', ' liked this.', ' reacted to this.', ' commented on this.', 'Like Page', "s Birthday", "s birthday!"]}, // my personnal settings // 's Birthday
        {language: 'Dansk', filter: ['Foreslået opslag', 'Sponsoreret']}
    ],
    config: {
        mode: '',
        method: '' /* ,
        list: [
            {
                language: 'English',
                filter: [
                    {id: 'prefilter_SuggestedPost', selected: true, pattern: 'Suggested Post'}, // pattern: {English: 'Suggested Post', Dansk: 'Foreslået opslag'}   ????
                    {id: 'prefilter_Sponored', selected: true, pattern: 'Sponsored'},
                    {id: 'prefilter_likedthis', selected: false, pattern: ' liked this.'},
                    {id: 'prefilter_reactedtothis', selected: false, pattern: ' reacted to this.'},
                    {id: 'prefilter_likepage', selected: false, pattern: 'Like Page'},
                    {id: 'prefilter_sBirthday', selected: false, pattern: "'s Birthday"},
                    {id: 'prefilter_sbirthday', selected: false, pattern: "'s birthday"}
                ]
            },
            {
                language: 'Dansk',
                filter: [
                    {id: 'prefilter_SuggestedPost', selected: true, pattern: 'Foreslået opslag'},
                    {id: 'prefilter_Sponored', selected: true, pattern: 'Sponsoreret'},
                    {id: 'prefilter_likedthis', selected: false, pattern: ' synes godt om dette.'},
                    {id: 'prefilter_reactedtothis', selected: false, pattern: ' har reageret på dette.'},
                    {id: 'prefilter_likepage', selected: false, pattern: 'Synes godt om side'},
                    {id: 'prefilter_sBirthday', selected: false, pattern: " har fødselsdag!"},
                    {id: 'prefilter_sbirthday', selected: false, pattern: "s fødselsdag"}
                ]
            }
        ] */
    },
    activefilter: null,
    languageDetected: false,
    cleaning_running: false,
    cleaning_runcount: 0,
    postlist: null,
    startTime: Date.now(),
    lazystart: 0,
    insertStyle: function() {
        if (!document.getElementById('cleanrStyle')) {
            // var wink = '#settingsLink {animation: wink 5s ease 1s 2;} @keyframes wink {0% {background-color:transparent;} 50% {background-color:rgba(255,250,0,1);} 100% {background-color:transparent;}}';
            var style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.setAttribute('id', 'cleanrStyle');
            if(DEBUG || cleanr.config.mode==='highlight') {
                style.innerHTML = 'div.cleaned > div {background-color:#FFA; filter: sepia(90%) !important} div.cleaned > div > div {opacity:0.96 !important} #configBox {position:absolute;width:200px;right:-220px} .configBox {opacity:0.7}';
            } else {
                style.innerHTML = 'div.cleaned > div {display:none !important} #configBox {position:absolute;width:200px;right:-220px} .configBox {opacity:0.7}';
            }
            document.getElementsByTagName('head')[0].appendChild(style);
            log('cleanrStyle has been ADDED');
        }
    },
    configure: function() {
        var lan = cleanr.list[0].language; // Default to English
        var i = 0;

        // *** Language detection currently NOT working: ***
        var languageselection = document.querySelector('._2cpb > div.fsm.fwn.fcg');
        if (languageselection) {
            languageselection = languageselection.textContent;
            log('languageselection=[' + languageselection + ']');
            for (i = 0; i < cleanr.list.length; i++) {
                if (languageselection.indexOf(cleanr.list[i].language) === 0) {
                    cleanr.activefilter = cleanr.list[i].filter;
                    lan = cleanr.list[i].language;
                    log('Language set to ' + lan, INFO);
                }
            }
            cleanr.languageDetected = true; // well, maybe...
        } else {
            log('languageselection not found.');
        }

        if (document.body && !document.getElementById('configBox')) {
            let configBox = '<div id="configBox" style="position:fixed;left:0;right:0;top:8em;z-index:3000009;margin-left:auto;margin-right:auto;min-height:8em;width:50%;background-color:#fff;color:#111;border:3px rgb(66,103,178) solid;border-radius:5px;display:none;padding:1em"><em style="color:rgb(66,103,178)"><b>Stig\'s Facebook Homefeed Cleanr</b> - version ' + GMC.info.script.version + '</em><div style="padding:1em 0 0 0"></div></div>';
            document.body.insertAdjacentHTML('beforeend', configBox);
            let content = document.querySelector('div#configBox div');
            let configForm = '<form id="cleanrsettings" name="cleanrsettings" style="padding:1em 0 1em 0">' +
                '<fieldset><legend>Mode</legend>' +
                '<div><label for="hideId"><input type="radio" name="mode" id="hideId" value="hide" ' + (cleanr.config.mode === 'hide' ? 'checked="checked" ' : '') + '/> Hide posts</label></div>' +
                '<div><label for="highlightId" title="Yellowish/sepia highlighted posts"><input type="radio" name="mode" id="highlightId" value="highlight" ' + (cleanr.config.mode === 'highlight' ? 'checked="checked" ' : '') + '/> Highlight posts</label></div>' +
                '<div><label for="debugId" title="Highlighted and add a lot of extra trace in javascript console - for debugging"><input type="radio" name="mode" id="debugId" value="debug" ' + (cleanr.config.mode === 'debug' ? 'checked="checked" ' : '') + '/> Highlight posts &amp; debug logging</label></div>' +
                '</fieldset>' +
                '<fieldset id="filterlist"><legend>Filters (<span id="filterlanguage">' + lan + '</span>)</legend>' +
                '</fieldset>' +
                '<fieldset><legend>Method</legend>' +
                '<div><label for="defaultId" title="Recommended choice until it eventually stops working..."><input type="radio" name="method" id="defaultId" value="default" ' + (cleanr.config.method === 'default' ? 'checked="checked" ' : '') + '/> Default/auto (Currently <em>DOM Observer</em>)</label></div>' +
                '<div><label for="observerId"><input type="radio" name="method" id="observerId" value="observer" ' + (cleanr.config.method === 'observer' ? 'checked="checked" ' : '') + '/> DOM Observer</label></div>' +
                '<div><label for="scrollId"><input type="radio" name="method" id="scrollId" value="scroll" ' + (cleanr.config.method === 'scroll' ? 'checked="checked" ' : '') + '/> Scroll-triggered</label></div>' +
                '<div><label for="intervalId"><input type="radio" name="method" id="intervalId" value="interval" ' + (cleanr.config.method === 'interval' ? 'checked="checked" ' : '') + '/> Interval-check</label></div>' +
                '</fieldset>' +
                '<button type="button" id="updateSettings" style="margin-top:.5em">Update settings</button> &nbsp; ' +
                '<button type="button" id="cancelSettings" style="margin-top:.5em">Cancel</button>' +
                '<p>Most important or recent updates:</p>' +
                '<div id="changelog">' +
                '</div>' +
                '</form>';
            content.insertAdjacentHTML('beforeend', configForm);
            GMC.registerMenuCommand("Homefeed Cleanr settings", cleanr.showConfig);
            var flist = document.getElementById('filterlist');
            if (flist) {
                for (i = 0; i < cleanr.activefilter.length; i++) {
                    flist.insertAdjacentHTML('beforeend', '<div><input type="checkbox" id="f' + i + '" value="' + cleanr.activefilter[i] + '" checked="checked" disabled="disabled" /><label for="f' + i + '">&nbsp;' + cleanr.activefilter[i] + '</label></div>');
                }
                flist.insertAdjacentHTML('beforeend', '<p style="margin-bottom:0;display:none">Filters are <em>case sensitive</em>.</p>');
            }
            var updateSettingsBtn = document.getElementById('updateSettings');
            if (updateSettingsBtn) {
                updateSettingsBtn.addEventListener('click', cleanr.saveSettings);
            }
            var clog = document.getElementById('changelog');
            if (clog) {
                for (i = 0; i < changelog.length; i++) {
                    clog.insertAdjacentHTML('beforeend', '<div><em>' + changelog[i].version + ':</em><br />' + changelog[i].description + '</div>');
                }
            }
            document.getElementById('cancelSettings').addEventListener('click', function () {
                document.getElementById('configBox').style.display = 'none';
                return false;
            }, false);
            document.addEventListener('keyup', function (ev) {
                if (document.getElementById('configBox') && ev.keyCode === 27) {
                    document.getElementById('configBox').style.display = 'none';
                    return false;
                }
            });
        }
    },
    showConfig: function () {
        document.getElementById('configBox').style.display='block';
        document.forms['cleanrsettings'].querySelector('input:checked:enabled').focus();
    },
    loadSettings: function() {
        // if (typeof GM_getValue === 'function') { // TEMP! Moving old values to Local Storage
        //     if (GM_getValue('debug','') !== '') {
        //         GMC.setLocalStorageValue('debug', GM_getValue('debug',''));
        //         GM_deleteValue('debug');
        //     }
        //     if (GM_getValue('mode','') !== '') {
        //         GMC.setLocalStorageValue('mode', GM_getValue('mode',''));
        //         GM_deleteValue('mode');
        //     }
        //     if (GM_getValue('method','') !== '') {
        //         GMC.setLocalStorageValue('method', GM_getValue('method',''));
        //         GM_deleteValue('method');
        //     }
        // }

        DEBUG = (''+GMC.getLocalStorageValue('debug', DEBUG)) === 'true';
        // Mode
        cleanr.config.mode = GMC.getLocalStorageValue('mode', ''); // hide, highlight, debug
        if (DEBUG && cleanr.config.mode==='') {
            cleanr.config.mode = 'highlight';
        } else if (cleanr.config.mode==='') {
            cleanr.config.mode = 'hide';
        } else if (cleanr.config.mode==='debug') {
            DEBUG = true;
        }
        // Method
        cleanr.config.method = GMC.getLocalStorageValue('method', 'default'); // observer, scroll, interval, default
        // Active filters
    },
    saveSettings: function() {
        GMC.setLocalStorageValue('mode', document.forms['cleanrsettings'].elements['mode'].value );
        GMC.setLocalStorageValue('method', document.forms['cleanrsettings'].elements['method'].value );
        location.reload(true);
    },
    cleaning: function () {
        cleanr.lazystart = 0;
        if(cleanr.cleanr_running) return;
        cleanr.cleanr_running = true;
        cleanr.cleaning_runcount++;
        log('Running cleaning() #'+cleanr.cleaning_runcount + ' at time='+cleanr.secondsSinceStart()+' sec. after start.', cleaning_runcountINFO);
        if (!cleanr.postlist) cleanr.postlist = document.getElementsByClassName('_5jmm');
        if (!cleanr.languageDetected) {
            cleanr.configure();
        }
        log('Running cleaning() #'+cleanr.cleaning_runcount + '. Cleaning on a postlist of length=' + cleanr.postlist.length, cleaning_runcountINFO);
        /*
        for (var i = 0; i < cleanr.postlist.length; i++) {
            if (!cleanr.postlist[i].classList.contains('cleaned')) {
                for (var j = 0; j < cleanr.activefilter.length; j++) {
                    if (cleanr.postlist[i].textContent.indexOf(cleanr.activefilter[j]) > -1) {
                        cleanr.postlist[i].classList.add('cleaned');
                        log('Hiding or highlighting item because <' + cleanr.activefilter[j] + '> : [ ' + cleanr.postlist[i].textContent.substring(0, 500) + ' ]', INFO);
                    }
                }
            }
        }
        */
        for (var i = cleanr.postlist.length -1; i >= 0; i--) {
            var itemCleaned = cleanr.postlist[i].classList.contains('cleaned');
            if (itemCleaned && (cleanr.cleaning_runcount % 3 < 2)) { // well, usually return, but not always because apparently there can be some left-overs...
                cleanr.cleanr_running = false;
                return; // quick exit cleaning
            }
            if (!itemCleaned) {
                for (var j = 0; j < cleanr.activefilter.length; j++) {
                    if (cleanr.postlist[i].textContent.indexOf(cleanr.activefilter[j]) > -1) {
                        cleanr.postlist[i].classList.add('cleaned');
                        log('Hiding or highlighting item because <' + cleanr.activefilter[j] + '> : [ ' + cleanr.postlist[i].textContent.substring(0, 500) + ' ]', INFO);
                        break;
                    }
                }
            }
        }
        cleanr.cleanr_running = false;
    },
    lazystartCleaning: function(mutations) {
        log('Running lazystartCleaning(), lazystart=' + cleanr.lazystart, cleaning_runcountINFO);
        cleanr.lazystart++;
        if (cleanr.lazystart > 1) {
            log('Running lazystartCleaning(), but skipping cleaning() because a lazystart is already pending...', cleaning_runcountINFO);
        } else {
            log('Running lazystartCleaning() and scheduling cleaning() ' + (typeof mutations === 'undefined' ? ' without mutations.' : (' with ' + mutations.length + ' mutation records.')), cleaning_runcountINFO);
            window.setTimeout(cleanr.cleaning, 100); // Let it breathe 100ms first......
        }
    },
    setupObserver: function () {
        log('Running setupObserver()...');
        cleanr.insertStyle();
        var observed = document.querySelector('div[id^="feed_stream_"]') || document.querySelector('div[id^="topnews_main_stream"]') || document.getElementById('stream_pagelet');
        if (!observed) {
            log('Object to observe NOT found - re-trying later...', setupObserverINFO);
        } else if (observed.classList.contains('hasObserver')) {
            log('Everything is okay! - But checking again later...', setupObserverINFO);
        } else {
            var oldObserved = document.getElementsByClassName('hasObserver').item(0); // Maybe we had an observer on another element?
            if (oldObserved) {
                oldObserved.disconnect();
                log(' *** An old observer was removed from element with id='+oldObserved.id+'. ***', setupObserverINFO);
            }
            cleanr.cleaning();
            log('Now adding Observer and starting...', setupObserverINFO);
            // var observer = new MutationObserver(cleanr.cleaning);
            var observer = new MutationObserver(cleanr.lazystartCleaning);
            var config = {childList: true, attributes: false, characterData: false, subtree: true};
            observer.observe(observed, config);
            observed.classList.add('hasObserver');
            log('Observer added and running on element with id='+observed.id+'...', setupObserverINFO);
        }
    },
    secondsSinceStart: function() {
        return ((Date.now()-cleanr.startTime)/1000).toFixed(3);
    },
    registerScroll: function () {
        cleanr.hasScrolled = true;
    },
    scrollTick: function() {
        if (cleanr.hasScrolled) {
            cleanr.hasScrolled = false;
            cleanr.cleaning();
        }
    },
    runOnce: function() {
        //GMC.setLocalStorageValue('infoShown',''); // To always show run-once info!!!
        if (!GMC.getLocalStorageValue('eolShown',false)) {
            let infobox = '<div id="infobox" style="position:fixed;left:0;right:0;top:10em;z-index:3000009;margin-left:auto;margin-right:auto;min-height:8em;width:40%;background-color:#fff;color:#111;border:3px rgb(66,103,178) solid;border-radius:5px;display:none;padding:1em"><em style="color:rgb(66,103,178)"><b>Stig\'s Facebook Homefeed Cleanr information</b> - This should only be shown once or twice...</em><div style="padding:1em 0 0 0"></div></div>';
            document.body.insertAdjacentHTML('beforeend', infobox);
            document.getElementById('infobox').addEventListener('click', function () {
                this.style.display = 'none';
                return false;
            }, false);
            document.addEventListener('keyup', function (ev) {
                if (document.getElementById('infobox') && ev.keyCode === 27) {
                    document.getElementById('infobox').style.display = 'none';
                    return false;
                }
            }, {once: true});
            let content = document.querySelector('div#infobox div');
            // let info = '<p>Using an userscript-managers like <em>Tampermonkey</em>, you can access a <b>settings dialog</b> for <em>Facebook Homefeed Cleanr</em> via a dropdown menu on the managers icon in the browser toolbar.</p><img style="max-width:100%;width:auto;height:auto" src="'+GMC.getResourceURL('imgSettingsGCTM')+'" />' +
            //     '<p>In <em>Firefox</em> you can also access Facebook Homefeed Cleanr\'s <b>settings dialog</b> via the webpage\'s <em>context-menu</em> (right-click on the page).</p><p>If you are using <em>Greasemonkey 4</em>, the right-click context menu is the <em>only way</em> to access the settings dialog.</p><img style="max-width:100%;width:auto;height:auto" src="'+GMC.getResourceURL('imgSettingsFFGM')+'" />';
            let info =  '<img style="max-width:250px;width:auto;height:auto;display:block;float:right" src="'+GMC.getResourceURL('imgSadSmiley')+'" /><p><b>THE LAST "OFFICIAL" VERSION !</b></p><p>I plan to withdraw this userscript from Greasy Fork soon.</p><p>Even though it by number of installs is my most popular userscript, it is still the lowest prioritized for me personally, and I find it hard to find time and motivation to fix bugs and keep it updated -  not to mention ever reach my original goals for the feature-set of the script. So I have decided it is unfair to keep the script "promoted" on Greasy Fork.</p>' +
                        '<p>I will continue to be using the script myself, and if you, despite slow or missing development and bug fixing, still want to use it, you should now <b><a href="https://github.com/StigNygaard/Stigs_Facebook_Homefeed_Cleanr"><em>re-install</em> it from GitHub</a></b> where I will continue to keep it hosted (and potentially occasionally updated).</p><p>The script currently has some issues, like occasionally forgetting settings (This is also why this info-screen might be shown more than the intended single time only). And at the time of writing this, the basic functionally of hiding sponsored posts actually also seems to be a bit unstable. Both are things I hope to fix some day, but the fix will only be posted on GitHub if/when ready.</p>';
            content.insertAdjacentHTML('beforeend', info);
            document.getElementById('infobox').style.display = 'block';
            GMC.setLocalStorageValue('eolShown',GMC.info.script.version.replace(/\./g,'').substring(0,8));
        }
    },


init: function () {
        log('Running init()');
        cleanr.activefilter = cleanr.list[0].filter;  // Default to English filters
        cleanr.loadSettings();
        cleanr.insertStyle();

        // extra initial cleanups...
        setTimeout(cleanr.cleaning,100);
        setTimeout(cleanr.cleaning,300);
        setTimeout(cleanr.cleaning,700);
        setTimeout(cleanr.cleaning,1200);

        // Methods:
        switch(cleanr.config.method) {
            case 'default':
            case 'observer':
                log('OBSERVER selected', true);
                setInterval(cleanr.setupObserver, 2000); // Every twice second, check if observer is (still) running - and setup if not...
                break;
            case 'scroll':
                log('SCROLL selected', true);
                window.addEventListener("scroll", cleanr.registerScroll);
                setInterval(cleanr.scrollTick, 300);
                break;
            case 'interval':
                log('INTERVAL selected', true);
                setInterval(cleanr.cleaning, 300);
                break;
            default:
                alert('Method error');
        }

        cleanr.runOnce();
    }
};

cleanr.init();
