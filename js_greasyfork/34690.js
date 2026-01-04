// ==UserScript==
// @name            DSA Seasonal
// @locale          English (en)
// @namespace       COMDSPDSA
// @version         3.5
// @description     Applies seasonal theme to DSA
// @author          SD / Dan Overlander
// @include         http://sales.dell.com/*
// @include	        *olqa.preol.dell.com*
// @include         *localhost.dell.com*
// @include	        *http://localhost:36865*
// @include         *dell.com/Identity/*
// @include			*dell.com/salesapp*
// @include         *sales.dell.com*
// @exclude         */swagger/*
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=730858
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/34690/DSA%20Seasonal.user.js
// @updateURL https://update.greasyfork.org/scripts/34690/DSA%20Seasonal.meta.js
// ==/UserScript==

// Since v03.40: Working on a fixing the holiday selection scanning
// Since v03.30: Tweaked Halloween theme. Fixed defects regarding hosts and page2image display
// Since v03.20: Added Metroid Theme
// Since v03.10: Added some missing button font colors for 3 themes. audio bugfix for undefined error on success/failure pages. Removes Tamper Global script dependency
// Since v03.00: Turned off debug mode by default. Adopted modern iffe code structure, thus allowing user-defined preferences (themes). Ignoring colors for accordion "buttons"
// Since v02.40: Revised data structure. Added MAR10 Day.  Added sounds.
// Since v02.30: Updated tamperlibrary. Vertically-centered header image.
// Since v02.20: converted dorkforce images to https
// Since v02.10: Adjusting Mother's Day date
// Since v02.00: adapting to localhost.dell.com...
// Since v01.87: Fixed remaining images by moving them to publicly-accessible, reliable host. Removed Spring Forward because it was too close in look to Mother's Day and too close in time to St Pats
// Since v01.86: Adjusting timing of Groundhog Day. Moved source of Valentines images, PresidentsDay images, StPats. Tweaked Days.
// Since v01.80: Adjusted timing of Daylight Saving Time Ends. Adding scrolling and/or animating backgrounds. Added Groundhog Day.
// Since v01.70: Tweaks background on swagger pages
// Since v01.60: Daylight Saving Time Ends Updated
// Since v01.50: Tweaked Halloween image & colors
// Since v01.40: Changed Senior background.  Not final.  Added diff to console log when showing a theme. Halloween adjusted.  Gonna have to figure out how to more accurately grab holidays, someday.
// Since v01.30: Converted date format to ISO, to avoid future failure
// Since v01.20: Added Senior Citizens Day
// Since v01.10: Updated 4th July banner; it was being "checked" :)
// Since v01.00: Father's Day color tweak.  Added Independence Day. TWEAKED DATE CALCULATION!
// Since v0.961: Added Father's Day, Daylight Savings Time Ends, Halloween - thus completes about a 1-year cycle
// Since v0.96: Tweaked link colors of Tax Day
// Since v0.95: Added Tax/Theft Day
// Since v0.94: Annoying Easter header image swapped
// Since v0.93: Added St. Patrick's Day
// Since v0.92: TM library link changed. Tweak Spring Forward. Add option to invert; will need work later
// Since v0.91: Tweaked Spring Forward's colors
// Since v0.9: Tweaked President's Day colors
// Since v0.8: Disabled show-off theme control keyboard keys
// Since v0.7: Fixed MLK, added Presidents
// Since v0.6: Added Martin Luther King Day and Valentine's Day
// Since v0.5: Renamed. Tweaked Thanksgiving occurence. Added logging when no holiday is selected.
// Since v0.4: white opacity.8 background, different Easter image
// Since v0.3: Hacky keyboard toggling between 4 themes
// Since v0.2: Temporary full-web-accessible background images
// Since v0.1: gets next holiday and applies theme within X days of its date

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */
// var tm = tm || {};
// var moment = moment || {};
// var $ = $ || {};
// var _ = _ || {};

(function() {
    'use strict';

    var TIMEOUT = 750,
        script = 'DSA Seasonal',
        baseUrl = 'https://www.dorkforce.com/dsa/themes/',
        pingPhoto = '!none',
        imageExt = '.png',
        global = {
            handlePrefsLocally: true,
            ids: {
                scriptName: script,
                prefsName: script.replace(/\s/g, '') + 'Prefs',
                memsName: script.replace(/\s/g, '') + 'Mems', // using this as a system-memory kind of thing.  Like the prefs but the user doesn't see them
                triggerElements: ['body'] // this script just dumps things to the page and does not rely on pre-existing elements
            },
            states: {
                appendClickProcessed: false,
                isHolidayApplied: false,
                areKeysAdded: false,
                isMouseMoved: false,
                avatarPingFailed: false
            },
            prefs: {},
            mems: {}
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    page.setMems();
                    page.applyHoliday();
                    tm.addClasses();
                    tm.setTamperIcon(global);
                    page.addPrefsIcon();
                }, TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName);
                if (currentPrefs == null || _.isEmpty(JSON.parse(currentPrefs))) {
                    global.prefs = {
                        debugMode: 'false',
                        daysAhead: '18',
                        holidayArray: [
                            {
                                "name": "Martin Luther King Day",
                                "date": "0,2,1",
                                "pageImage": "mlk-background.jpg",
                                "headerImage": "mlk-banner.png",
                                "buttonColor": "CadetBlue",
                                "backgroundColor": "cornsilk",
                            },
                            {
                                "name": "Groundhog Day",
                                "date": "1,0,0",
                                "pageImage": "groundhog-day-background.jpg",
                                "headerImage": "groundhog-day-banner.png",
                                "buttonColor": "CadetBlue",
                                "backgroundColor": "cornsilk",
                            },
                            {
                                "name": "Valentine's Day",
                                "date": "1,1,6",
                                "pageImage": "valentines-background.jpg",
                                "page2Image": "valentines-overlay.png",
                                "headerImage": "valentines-banner.jpg",
                                "buttonColor": "HotPink",
                                "backgroundColor": "LightPink",
                                "scrollTB": "true",
                            },
                            {
                                "name": "President's Day",
                                "date": "1,2,1",
                                "pageImage": "presidentsday-background.png",
                                "headerImage": "presidentsday-banner.jpg",
                                "buttonColor": "#005CB7",
                                "buttonTextColor": "#ccdef0",
                                "dropdownColor": "#7faddb",
                                "backgroundColor": "LightSkyBlue",
                            },
                            {
                                "name": "St. Patrick's Day",
                                "date": "2,2,5",
                                "pageImage": "stpats-background.jpg",
                                "page2Image": "stpats-background2.png",
                                "headerImage": "stpats-banner.jpg",
                                "buttonColor": "#144314",
                                "backgroundColor": "darkgreen",
                                "styles": [
                                    {
                                        "element": "#page2Image",
                                        "style": "background-size:225% !important"
                                    }
                                ]
                            },
                            {
                                "name": "Easter",
                                "date": "3,1,0",
                                "pageImage": "easter-background.jpg",
                                "headerImage": "easter-banner.jpg",
                                "buttonColor": "DeepPink",
                                "backgroundColor": "#c0fff4",
                            },
                            {
                                "name": "Tax Day",
                                "date": "3,2,2",
                                "pageImage": "tax-background.jpg",
                                "headerImage": "tax-banner.png",
                                "backgroundColor": "darkolivegreen",
                                "dropdownColor": "aliceblue",
                            },
                            {
                                "name": "Mother's Day",
                                "date": "4,1,0",
                                "pageImage": "mother-background.png",
                                "headerImage": "mother-banner.png",
                                "buttonColor": "crimson",
                                "baseLink": "crimson",
                                "backgroundColor": "#c0fff4",
                                "dropdownColor": "lightpink",
                            },
                            {
                                "name": "Memorial Day",
                                "date": "4,-1,1",
                                "page": "VALUE",
                                "header": "VALUE",
                                "buttonColor": "black",
                                "backgroundColor": "black"
                            },
                            {
                                "name": "Father's Day",
                                "date": "5,2,0",
                                "pageImage": "fathers-background.jpg",
                                "headerImage": "fathers-banner.jpg",
                                "buttonColor": "#012255",
                                "buttonTextColor": "white",
                                "backgroundColor": "#9FD7E4",
                                "dropdownTitle": "white",
                                "dropdownColor": "#7faddb",
                            },
                            {
                                "name": "Independence Day",
                                "date": "6,0,3",
                                "pageImage": "id-background.jpg",
                                "headerImage": "id-banner.png",
                                "backgroundColor": "darkblue",
                                "dropdownColor": "aliceblue",
                                "appTitleColor": "white",
                            },
                            {
                                "name": "Legend of Zelda Day",
                                "date": "7,2,0",
                                "pageImage": "zelda-background.jpg",
                                "headerImage": "zelda-banner.png",
                                "backgroundColor": "darkgreen",
                                "dropdownColor": "limegreen",
                                "appTitleColor": "green",
                                "baseLink": "black",
                                "audio": {
                                    "random": [
                                        'WW_SmallPot_Drop1.wav',
                                        'WW_PauseMenu_Save_Yes.wav',
                                        'WW_LargePot_Drop1.wav',
                                        'WW_LargeChest_Open1.wav',
                                        'ZSS_LowHealth.wav',
                                        'ZSS_StaminaGauge_Empty.wav'
                                    ],
                                    "clicks": [
                                        'WW_Sword_Slash.wav',
                                        'WW_Get_Rupee.wav',
                                        'WW_Arrow_Shoot.wav',
                                        'WW_Get_Heart.wav',
                                        'WW_Link_Roll.wav',
                                    ],
                                    "errors": [
                                        'WW_Gong.wav',
                                        'WW_Error.wav',
                                        'LA_Link_Dying.wav',
                                        'TP_Warp_Out.wav',
                                        'LA_NightmareShadow4_SummonStaff.wav'
                                    ],
                                    "awards": [
                                        'WW_Secret.wav',
                                        'WW_PressStart.wav',
                                        'WW_Fanfare_SmallItem.wav',
                                        'WW_Fanfare_HeartContainer.wav',
                                        'WW_Fanfare_Item.wav'
                                    ]
                                }
                            },
                            {
                                "name": "Super Mario Day (MAR10)",
                                "date": "2,1,3",
                                "pageImage": "mario-background.png",
                                "headerImage": "mario-banner.png",
                                "backgroundColor": "darkblue",
                                "dropdownColor": "aliceblue",
                                "appTitleColor": "chocolate",
                                "baseLink": "cornflowerblue",
                                "buttonColor": "cornflowerblue",
                                "audio": {
                                    "random": [
                                        'smw_vine.wav',
                                        'smw_spring_jump.wav',
                                        'smw_power-up.wav',
                                        'smw_1-up.wav',
                                    ],
                                    "clicks": [
                                        'smw_coin.wav',
                                        'smw_jump.wav',
                                    ],
                                    "errors": [
                                        'smw_lost_a_life.wav',
                                        'smw_game_over.wav',
                                    ],
                                    "awards": [
                                        'smw_course_clear.wav',
                                    ]
                                }
                            },
                            {
                                "name": "Senior Citizens Day",
                                "date": "7,3,2",
                                "pageImage": "senior-background.jpg",
                                "headerImage": "senior-banner.jpg",
                                "buttonColor": "#012255",
                                "buttonTextColor": "white",
                                "backgroundColor": "#B28EC7",
                                "dropdownTitle": "white",
                                "dropdownColor": "#C09DC7",
                                "appTitleColor": "white",
                            },
                            {
                                "name": "Labor Day",
                                "date": "8,0,1",
                                "pageImage": "labor-background.jpg",
                                "headerImage": "labor-banner.jpg",
                                "buttonColor": "#012255",
                                "buttonTextColor": "white",
                                "backgroundColor": "#9FD7E4",
                                "dropdownTitle": "white",
                                "dropdownColor": "#7faddb",
                            },
                            {
                                "name": "Metroidween",
                                "date": "9,1,2",
                                "pageImage": "metroid-background.jpg",
                                "headerImage": "metroid-banner.png",
                                "buttonColor": "maroon",
                                "buttonTextColor": "white",
                                "backgroundColor": "LightPink",
                                "dropdownTitle": "white",
                                "dropdownColor": "#8a1919",
                                "audio": {
                                    "random": [
                                        "metroid-random1.wav",
                                        "metroid-random2.wav",
                                        "metroid-random3.wav",
                                        "metroid-random4.wav"
                                    ],
                                    "clicks": [
                                        "metroid-click1.wav",
                                        "metroid-click2.wav",
                                        "metroid-click3.wav",
                                        "metroid-click4.wav"
                                    ],
                                    "errors": [
                                        "metroid-error1.wav",
                                        "metroid-error2.wav",
                                        "metroid-error3.wav",
                                        "metroid-error4.wav"
                                    ],
                                    "awards": [
                                        "metroid-award1.wav",
                                        "metroid-award2.wav",
                                        "metroid-award3.wav",
                                        "metroid-award4.wav"
                                    ]
                                }
                            },
                            {
                                "name": "Halloween",
                                "date": "9,4,2",
                                "pageImage": ["halloween-background.jpg", "halloween-background.gif"],
                                "page2Image": "halloween-page2Image.png",
                                "scrollTB": "false",
                                "styles": [
                                    {
                                        "element": "#page2Image",
                                        "style": "background-size:505% !important"
                                    }
                                ],
                                "headerImage": "halloween-banner.png",
                                "footerStyle": "border-top: black !important; background-color: black !important; background-image: none;",
                                "baseLink": "royalblue",
                                "buttonColor": "white",
                                "buttonTextColor": "black",
                                "backgroundColor": "#120E4C",
                                "dropdownTitle": "white",
                                "dropdownColor": "#7875A7",
                                "appTitleColor": "white",
//                                 "audio": {
//                                     "random": [
//                                         "halloween-organic-metallic-ambience-sounds.wav",
//                                         "halloween-eerie-sounds.wav",
//                                         "halloween-creepy-whistling.wav"
//                                     ],
//                                     "errors": [
//                                         "halloween-dun-dun-dun-dramatic-hits.wav"
//                                     ],
//                                     "awards": [
//                                         "halloween-scary-organ.wav"
//                                     ]
//                                 }
                            },
                            {
                                "name": "Daylight Savings Time Ends",
                                "date": "10,0,1",
                                "pageImage": "fallback-background.jpg",
                                "headerImage": "fallback-banner.jpg",
                                "buttonColor": "#4D1E00",
                                "backgroundColor": "#FF7619",
                                "dropdownTitle": "white",
                            },
                            {
                                "name": "Thanksgiving",
                                "date": "10,4,4",
                                "pageImage": "fall-background.png",
                                "page2Image": "fall-background2.png",
                                "headerImage": "fall-banner.jpg",
                                "buttonColor": "orange",
                                "backgroundColor": "lightgoldenrodyellow",
                                "scrollRL": "true",
                                "styles": [
                                    {
                                        "element": "#page2Image",
                                        "style": "background-size:800% !important"
                                    }
                                ]
                            },
                            {
                                "name": "midwinter",
                                "date": "11,1,5",
                                "pageImage": "midwinter-background.gif",
                                "headerImage": "midwinter-banner.gif",
                                "baseLink": "cadetblue",
                                "buttonColor": "cadetblue",
                                "backgroundColor": "silver",
                                "dropdownTitle": "white",
                                "dropdownColor": "lavendar",
                                "appTitleColor": "white",
                            },
                            {
                                "name": "Christmas",
                                "date": "11,4,1",
                                "pageImage": "christmas-background.png",
                                "headerImage": "christmas-banner.jpg",
                                "buttonColor": "azure",
                                "backgroundColor": "silver",
                                "baseLink": "cadetblue",
                                "dropdownColor": "lightsteelblue",
                            },
                        ]
                    };
                    tm.savePreferences(global.ids.prefsName, global.prefs);
                } else {
                    global.prefs = JSON.parse(currentPrefs);
                }
            },
            setMems: function() {
                var currentMems = GM_getValue(global.ids.memsName);
                if (currentMems == null || _.isEmpty(JSON.parse(currentMems))) {
                    global.mems = {};
                    global.mems.triggers = []; // TODO: this is always getting overwritten when used
                    tm.savePreferences(global.ids.memsName, global.mems);
                } else {
                    global.mems = JSON.parse(currentMems);
                }
            },
            applyHoliday: function () {
                if (!global.states.isHolidayApplied) {
                    global.states.isHolidayApplied = true;

                    var holidays = utils.tempExtractHolidayObj(global.prefs.holidayArray);
                    var nextHoliday = utils.getNextHoliday(holidays),
                        baseLink,
                        pageImage,
                        page2Image,
                        headerImage,
                        buttonColor,
                        buttonTextColor,
                        dropdownColor,
                        dropdownTitle,
                        invertedColor,
                        dropShadowText,
                        appTitleColor,
                        scrollRL = false,
                        scrollTB = false,
                        backgroundColor;
                    if (nextHoliday.diff > Number(global.prefs.daysAhead)) {
                        tm.log(nextHoliday.name + ' is ' + nextHoliday.diff + ' days away.');
                        return;
                    }

                    tm.log('Showing ' + nextHoliday.name + '(' + nextHoliday.diff + ')');

                    var h = global.prefs.holidayArray.filter(obj => {
                        return obj.name === nextHoliday.name
                    })[0];
                    pageImage = (typeof h.pageImage === 'string') ? h.pageImage : h.pageImage[Math.floor(Math.random()*h.pageImage.length)];
                    pageImage = (pageImage.indexOf('http') < 0) ? baseUrl + pageImage : pageImage;
                    page2Image = (h.page2Image != null) ? (h.page2Image.indexOf('http') < 0) ? baseUrl + h.page2Image : h.page2Image : undefined;
                    headerImage = (h.headerImage != null) ? (h.headerImage.indexOf('http') < 0) ? baseUrl + h.headerImage : h.headerImage : undefined;
                    buttonColor = h.buttonColor;
                    backgroundColor = h.backgroundColor;
                    baseLink = h.baseLink;
                    buttonTextColor = h.buttonTextColor;
                    dropdownTitle = h.dropdownTitle;
                    dropdownColor = h.dropdownColor;
                    invertedColor = (h.invertedColor == 'true');
                    dropShadowText = (h.dropShadowText == 'true');
                    appTitleColor = h.appTitleColor;
                    scrollRL = (h.scrollRL == 'true');
                    scrollTB = (h.scrollTB == 'true');
                    if (h.styles != null) {
                        _.each(h.styles, function(style) {
                            tm.addGlobalStyle(style.element + ' {' + style.style + '}');
                        });
                    }
                    if (h.audio != null) {
                        var renderAudioElements = function(snd) {
                            var body, el;
                            body = document.getElementsByTagName('body')[0];
                            if (!body) { return; }
                            el = document.createElement('audio');
                            el.id = snd.split('.')[0];
                            el.src = baseUrl + 'audio/' + snd;
                            el.autostart = 'false';
                            body.appendChild(el);
                        };
                        if (h.audio.clicks != null && h.audio.clicks.length > 0) {
                            _.each(h.audio.clicks, function(snd) {
                                renderAudioElements(snd);
                            });
                        }
                        if (h.audio.random != null && h.audio.random.length > 0) {
                            _.each(h.audio.random, function(snd) {
                                renderAudioElements(snd);
                            });
                        }
                        if (h.audio.errors != null && h.audio.errors.length > 0) {
                            _.each(h.audio.errors, function(snd) {
                                renderAudioElements(snd);
                            });
                        }
                        if (h.audio.awards != null && h.audio.awards.length > 0) {
                            _.each(h.audio.awards, function(snd) {
                                renderAudioElements(snd);
                            });
                        }
                        window.onclick = function(e) {
                            var soundName, soundElement;
                            var eType = e.target.type;
                            eType = (eType != null && eType != '') ? eType : e.target.parentElement.type;
                            eType = (eType != null && eType != '') ? eType : e.target.tagName;
                            eType = eType.toLowerCase();
                            if (global.prefs.debugMode === 'true') {
                                console.log(eType);
                                console.dir(e.target);
                            }
                            switch (eType) {
                                case 'submit':
                                case 'link':
                                case 'button':
                                case 'radio':
                                case 'checkbox':
                                case 'select-one':
                                case 'text':
                                case 'a': // can't pause navigation to play sound, unfortunately.
                                    if (h.audio != null & h.audio.clicks != null && h.audio.clicks.length > 0)
                                        soundName = h.audio.clicks[Math.floor(Math.random()*h.audio.clicks.length)];
                                    break;
                                default:
                                    var rnd=Math.floor(Math.random()*11)
                                    if (rnd === 0 && h.audio != null & h.audio.random != null) {
                                        soundName = h.audio.random[Math.floor(Math.random()*h.audio.random.length)];
                                    }
                                    break;
                            }
                            if (soundName != null) {
                                soundElement = document.getElementById(soundName.split('.')[0]);
                                soundElement.play();
                            }
                        };
                    }

                    tm.addGlobalStyle('.dds__accordion-btn, .dds__secondary-accordion-btn {background-color: transparent !important;}');
                    tm.addGlobalStyle('.content-view {background-color: inherit;}');
                    tm.addGlobalStyle('.content-area, #swagger-ui-container, .dell-container-body {background-color: rgba(255, 255, 255, 0.7);}');
                    tm.addGlobalStyle('.panel { background-color: rgba(255, 255, 255, 0.3);');
                    tm.addGlobalStyle('@keyframes horizontalAnimation { 	from { background-position: 0 0; } 	to { background-position: 100% 0; } }');
                    tm.addGlobalStyle('@keyframes verticalAnimation { 	from { background-position: 0 0; } 	to { background-position: 0 100%; } }');
                    if (pageImage != null) tm.addGlobalStyle('body { background: url("' + pageImage + '") no-repeat center center fixed; background-size: cover; }');
                    if (headerImage != null) tm.addGlobalStyle('.main-nav, .dds__msthd-navbar-top, .footer { background-image: url("' + headerImage + '"); background-size: cover; background-position-y:center; }');
                    if (buttonColor != null) tm.addGlobalStyle('.main-nav, .btn-primary, button { background-color: ' + buttonColor + ' !important;}');
                    if (buttonColor != null) tm.addGlobalStyle('#dropMenu button { background-color:inherit !important; color: ' + buttonColor + '; }');
                    if (buttonColor != null) tm.addGlobalStyle('a { color: ' + buttonColor + ';}');
                    if (backgroundColor != null) tm.addGlobalStyle('.view-nav { background-color: ' + backgroundColor + ' !important; }');
                    if (baseLink != null) tm.addGlobalStyle('.icon-ui-dell, .brand-title, a { color: ' + baseLink + ' !important;}');
                    if (buttonTextColor != null) tm.addGlobalStyle('.btn-primary, button, .main-nav .top-nav .dropdown-menu ul li > a { color: ' + buttonTextColor + ' !important;}');
                    if (dropdownTitle != null) tm.addGlobalStyle('#menu_versionToggle, .current-business-unit a { color: ' + dropdownTitle + ' !important;}');
                    if (dropdownColor != null) tm.addGlobalStyle('.dropdown-menu { background-color: ' + dropdownColor + ' !important;}');
                    if (invertedColor === true) tm.addGlobalStyle('a { -webkit-filter: invert(100%); filter: invert(100%); }');
                    if (dropShadowText === true) tm.addGlobalStyle('a { text-shadow: 1px 1px 1px #000; }');
                    if (appTitleColor != null) tm.addGlobalStyle('#welcomeMessage, .app-title, .customer-header .segment-info, .customer-header h5, customer-details-navigation .row, customer-details-navigation .segment-info { color: ' + appTitleColor + '; }');
                    if (scrollRL === true) tm.addGlobalStyle('#COM	{ background-position: 0px 0px; 	background-repeat: repeat-x; 	animation: horizontalAnimation 40s linear infinite; }');
                    if (scrollTB === true) tm.addGlobalStyle('#COM	{ background-position: 0px 0px; 	background-repeat: repeat-y; 	animation: verticalAnimation 40s linear infinite; }');
                    if (page2Image != null) {
                        $('body').prepend('<div id="page2Image"></div>');
                        tm.addGlobalStyle('#page2Image	{  background-position: 0px 0px; 	background-repeat:repeat-x; 	animation:horizontalAnimation 40s linear infinite;		width:100%;		height:100%;	position:fixed;	z-index:-1; background:url("' + page2Image + '");}');
                    }
                    if (h.footerStyle != null) tm.addGlobalStyle('.footer {' + h.footerStyle + '}');

                    // monitor pages for conditions and apply sounds if possible
                    var scanFor = function(identifier, value) {
                        if (document.getElementsByClassName(identifier) && document.getElementsByClassName(identifier).length > 0) {
                            if (document.getElementsByClassName(identifier)[0] && document.getElementsByClassName(identifier)[0].innerHTML.indexOf(value) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            if (document.getElementById(identifier) && document.getElementById(identifier).innerHTML.indexOf(value) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };

                    var successTimeout, failureTimeout;

                    var monitorSuccess = function() {
                        if (h.audio != null && (scanFor('app-title', 'Order Details') || scanFor('orderConfirmationWell', ' '))) {
                            var soundName, soundElement;
                            if (h.audio != null & h.audio.awards != null) {
                                soundName = h.audio.awards[Math.floor(Math.random()*h.audio.awards.length)];
                            }
                            if (soundName != null) {
                                soundElement = document.getElementById(soundName.split('.')[0]);
                                if (soundElement) {
                                    soundElement.play();
                                } else {
                                    successTimeout = setTimeout(monitorSuccess, 1000);
                                }
                            }
                        } else {
                            successTimeout = setTimeout(monitorSuccess, 1000);
                        };
                    }

                    var monitorFailure = function() {
                        if (h.audio != null &&(scanFor('common_noResults_message', 'Sorry') || scanFor('ErrorMessageTitle', ' '))) {
                            var soundName, soundElement;
                            if (h.audio != null & h.audio.errors != null) {
                                soundName = h.audio.errors[Math.floor(Math.random()*h.audio.errors.length)];
                            }
                            if (soundName != null) {
                                soundElement = document.getElementById(soundName.split('.')[0]);
                                if (soundElement) {
                                    soundElement.play();
                                } else {
                                    failureTimeout = setTimeout(monitorFailure, 1000);
                                }
                            }
                        } else {
                            failureTimeout = setTimeout(monitorFailure, 1000);
                        };
                    }

                    window.onhashchange = function() {
                        global.mems.triggers = [];
                        clearTimeout(successTimeout);
                        clearTimeout(failureTimeout);
                        failureTimeout = setTimeout(monitorFailure, 1000);
                        successTimeout = setTimeout(monitorSuccess, 1000);
                    }

                    if (global.mems.triggers.indexOf('order') === -1) {
                        global.mems.triggers.push('order');
                        monitorSuccess();
                    }
                    if (global.mems.triggers.indexOf('failure') === -1) {
                        global.mems.triggers.push('failure');
                        monitorFailure();
                    }

                }
            },
            addPrefsIcon: function() {
                var scrName = global.ids.scriptName.replace(/\s/g, ''),
                    popupIdentifier = 'helpFor' + scrName;
                if ($('.acronymButton').length > 0 && $('.' + popupIdentifier).css('bottom') === '18px') {
                    $('.' + popupIdentifier).css('bottom', '41px');
                }
                //                 if ($('.helpForWorkItem').length > 0 && $('.' + popupIdentifier).css('right') === '7px') {
                //                     $('.' + popupIdentifier).css('right', '41px');
                //                 }
                if ($('.' + popupIdentifier).length === 0) {
                    tm.addGlobalStyle('.' + popupIdentifier + ' { position:fixed; z-index:999999999; content: url("https://www.dorkforce.com/dsa/62971-gear-icon.png"); right:7px; bottom:18px; width:16px; height:16px;}');
                    $('body').append('<span class="fingery ' +  popupIdentifier + '" title="' + scrName + ' Preferences"></span>');
                    $('.' + popupIdentifier).mouseup(function clickIdLink (e) {
                        var modalId = scrName + 'Options',
                            modalBody = '';
                        modalBody += '<div class="popupDetailTitle">' + modalId + '</div><div class="popupDetailContent">&nbsp;</div>';
                        _.each(global.prefs, function (value, key) {
                            if (Array.isArray(value) || typeof value === 'string' || typeof value === 'number') {
                                var thisVal = typeof value === 'object' ? JSON.stringify(value) : value;
                                modalBody +=
                                    '<div class="popupDetailTitle">' + key + '</div>' +
                                    '<div class="popupDetailContent">' +
                                    '    <textarea style="width:100%" id="' + key + '" type="text">' + thisVal + '</textarea>' +
                                    '</div>';
                            } else {
                                _.each(value, function (value2, key2) {
                                    var thisVal2 = typeof value2 === 'object' ? JSON.stringify(value2) : value2;
                                    modalBody +=
                                        '<div class="popupDetailTitle">' + key2 + '</div>' +
                                        '<div class="popupDetailContent">' +
                                        '    <textarea style="width:100%" id="' + key2 + '" type="text">' + thisVal2 + '</textarea>' +
                                        '</div>';
                                });
                            }
                        });
                        modalBody += '<div class="popupDetailTitle">&nbsp;</div><div class="popupDetailContent" style="text-align:right; margin-top:20px;">' +
                            '    <button aria-label="Reset Plugin Memory" class="memery tBtn">Reset Memory</button>' +
                            '    <button aria-label="Reset Plugin Preferences" class="resetery tBtn tBtnMain">Reset Preferences</button>' +
                            '    <button aria-label="Save Plugin Preferences" class="savery tBtn tBtnMain">Save</button>' +
                            '    <button aria-label="Close Preference Window" class="uiClosify tBtn">Close</button>' +
                            '</div>';

                        tm.showModal(modalId, modalBody);

                        $('.memery').on('click', function() {
                            tm.erasePreferences(global.ids.memsName);
                            alert('Page memory erased.');
                        });
                        $('.savery').on('click', function() {
                            var setVal;
                            _.each(global.prefs, function(value, key) {
                                setVal = $('#' + key).val().toString();
                                try {
                                    setVal = JSON.parse($('#' + key).val());
                                    if (setVal === true || setVal === false) {
                                        setVal = setVal.toString();
                                    }
                                }
                                catch(e) {
                                    tm.log(key + ' is not JSON');
                                }
                                global.prefs[key] = setVal;
                            });
                            // tm.savePreferences(global.ids.prefsName, global.prefs);
                            GM_setValue(global.ids.prefsName, JSON.stringify(global.prefs));
                            alert('Refresh to see new values.');
                        });
                        $('.resetery').on('click', function() {
                            tm.erasePreferences(global.ids.prefsName);
                            alert('Refresh to see default values.');
                        });
                        $('.uiClosify').on('click', function() {
                            $(this).closest('.popupDetailWindow').remove();
                        });
                    });
                }
            }
        },
        utils = {
            initScript: function () {
                _.each(global.ids.triggerElements, (trigger) => {
                    tm.getContainer({
                        'el': trigger,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        page.initialize();
                    });
                });
            },
            tempExtractHolidayObj: function(holidayArray) { // rewrite needed, later, to just use holidayData directly
                var temp = {};
                _.each(holidayArray, function(holiday) {
                    temp[holiday.date] = holiday.name;
                });
                return temp;
            },
            isoFormat: function(year, month, date) {
                if (year == null || month == null || date == null) {
                    return null;
                }

                var mill;
                year = year.toString();
                month = month.toString();
                date = date.toString();
                if (year.length === 2) {
                    mill = new Date().getFullYear().toString().substr(0,2);
                    year = mill + year;
                }
                month = ('0' + month);
                month = month.substr(month.length-2, 2);

                date = ('0' + date);
                date = date.substr(date.length-2, 2);
                return year + '-' + month + '-' + date;
            },
            getHoliday: function(holidays, month, week, day) {
//                 console.dir(holidays);
//                 tm.log(holidays[month + "," + week + "," + day]);
                return holidays[month + "," + week + "," + day];
            },
            getNextHoliday: function(holidays) {
                // There is currently a BUG where if you are on a day that is not the start of a week (0 index), the month is incorrectly scanned; while the WEEK increments from N to N+1, the day of week continues until IT hits 6, and then resets to 0.
                var myYear = moment().year(),
                    oneYearFromNow = moment().year() + 1,
                    myMonth = moment().month(),
                    myWeek,
                    myDayOfWeek,
                    startDate = moment(utils.isoFormat(myYear, myMonth+1, 1)),
                    scanDate = startDate,
                    daysInMonth = (moment(scanDate).endOf('month').date())-1,
                    myDate = moment().date()-1, // a counter, so we only scan at most just over 1 month's worth of days
                    holiday;
                // tm.log('Search starting from ' + moment(startDate).format("MMM Do YYYY"));

                while (holiday === undefined && myDate < 33 && myYear < oneYearFromNow) {
                    scanDate = moment(utils.isoFormat(myYear, myMonth+1, myDate+1));
                    myWeek = Math.ceil(moment(scanDate).date() / 7)-1;
                    myDayOfWeek = moment(scanDate).day();
                    holiday = utils.getHoliday(holidays, myMonth, myWeek, myDayOfWeek);
//                     tm.log(daysInMonth + ', ' + myMonth + ' ' + myWeek + ' ' + myDayOfWeek + ' = ' + scanDate + (holiday != null ? ' (found holiday: ' + holiday + ')' : ''));

                    myDate++;
                    if (myDate > daysInMonth) {
                        myDate = 0;
                        myMonth++;
                        if (myMonth > 11) {
                            myMonth = 0;
                            myYear++;
                        }
                        daysInMonth = (moment(scanDate).endOf('month').date())-1;
                    }
                }

                var holidayObj = {
                    name: holiday,
                    diff: -(moment(startDate).diff(scanDate, 'days'))
                };

                return holidayObj;
            }
        };

    (function() { // Global Functions
        if (global.prefs.debugMode === 'true') tm.log('Global initialization of ' + global.ids.scriptName);
        utils.initScript();
        $(document).mousemove(function(e) {
            if (!global.states.isMouseMoved) {
                global.states.isMouseMoved = true;
                setTimeout(function() {
                    global.states.isMouseMoved = false;
                }, TIMEOUT * 2);
                utils.initScript();
            }
            if (global.mems != null & global.states.avatarPingFailed) {
                var duration = moment.duration(moment().diff(global.mems.avatarPingTimer));
                if (global.mems.avatarPingTimer != null && Math.round(duration.asSeconds()) > 15) {
                    global.states.avatarPingFailed = false;
                    global.mems.avatarPingTimer = null;
                    tm.savePreferences(global.memsName, global.mems);
                }
            }
        });
    })(); // Global Functions

})();