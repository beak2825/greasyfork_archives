// ==UserScript==
// @name			ADO Mods
// @namespace		COMDSPDSA
// @version			1.0
// @description		Replaces user avatars with custom ones
// @author			Dan Overlander
// @include			*/dev.azure.com*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=907043
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @require         https://unpkg.com/popper.js@1
// @require         https://unpkg.com/tippy.js@4
// @grant           GM_setValue
// @grant           GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/434093/ADO%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/434093/ADO%20Mods.meta.js
// ==/UserScript==

// Since v00.0: init, copying from Gitlab Mods script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    var utils = {
        debug: function(msg) {
            let userSelectedIgnore = global.prefs.debugIgnores.includes(utils.debug.caller.name);
            if (global.prefs.debugMode && !userSelectedIgnore) {
                if (typeof msg === 'object') {
                    let hasSource = false;
                    if (msg.constructor === Array) {
                        msg.includes("iAm") && (hasSource = true);
                        userSelectedIgnore = global.prefs.debugIgnores.includes(msg.find(id => id === "iAm"));
                    } else {
                        const keys = Object.keys(msg);
                        keys.forEach((key, index) => {
                            !hasSource && (hasSource = key === "iAm");
                        });
                        userSelectedIgnore = global.prefs.debugIgnores.includes(msg.iAm);
                    }
                    if (hasSource) {
                        !userSelectedIgnore && console.log(msg);
                    } else {
                        console.log({'iAm': utils.debug.caller.name, ...msg});
                    }
                } else {
                    console.log({'iAm': utils.debug.caller.name, 're': msg});
                }
            }
        },
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
        savedMems: function() {
            return JSON.parse(GM_getValue(global.ids.memsName));
        },
        properName: function(thisName) {
            if (!thisName) {
                return;
            }
            var firstName = '',
                lastName = '',
                midName = '';

            thisName = thisName
                .replace(`https://${global.ids.thisSite}/`, '')
                .replace(' - Dell Team', '')
                .replace('\'s avatar', '')
                .replace('Assigned to ', '')
                .replace('Avatar for ', '')
                .replace(/dell\.com/gi, '')
                .replace(/dellteam\.com/gi, '')
                .replace(/selected identity/gi, '')
                .replace('@', '')
                .replace(/@/g, '')
                .replace(/\//g, '')
                .replace(/Review requested from /g, '')
                .replace(/_/g, '-');
            firstName = thisName.substring(0, thisName.indexOf('-'));
            lastName = thisName.substring(thisName.indexOf('-')+1, thisName.length);
            if ((firstName.length === 0 && lastName.length === 0)) {
                return;
            }
            if (firstName.length > 0 && lastName.length > 0 && thisName.indexOf(',') < 0) {
                thisName = lastName + ', ' + firstName;
            }
            if (thisName.indexOf('-') > 0) {
                midName = thisName.substring(0, thisName.indexOf('-'));
                thisName = thisName.substring(thisName.indexOf('-')+1, thisName.length);
                thisName = thisName + ' ' + midName;
            }
            while (thisName.indexOf('  ') > 0) {
                thisName = thisName.replace(/\s\s/, ''); // no double spaces
            }
            thisName = thisName
                .replace(/(\r\n\t|\n|\r\t)/gm,'') // no line breaks or tabs
                .replace(/ ,/, ',') // no spaces before commas
                .replace(/\%20/, '') // no %20 characters
                .replace(/Americas/g, '')
                .trim(); // seriously, no extra spaces
            thisName = thisName.replace(',', ', ').replace('  ', ' '); // there's probably a less-stupid way of REALLY making sure it's always "COMMA SPACE"
            return thisName;
        },
        updateImg: function(img, thisName) {
            if (thisName != null) {
                if (thisName.length > 0 && thisName !== ', ') {
                    if ($(img).prop('src').indexOf('!none') <= 0 && ($(img).prop('src').indexOf(global.ids.thisSite) > -1 || $(img).prop('src').indexOf('gravatar') > -1)) {
                        utils.debug(thisName);
                        var nameDivider = (thisName.indexOf(',') < 0) ? ' ' : ', ';
                        var thisNameSpaceIndex = thisName.indexOf(' ') + 1;
                        var thisNameFirst = thisName.indexOf(' ') < 0 ? thisName : nameDivider === ' ' ? thisName.substr(0, thisName.indexOf(thisNameSpaceIndex)-1) : thisName.substr(thisNameSpaceIndex, thisName.length - thisNameSpaceIndex);
                        if (thisNameFirst.length === 0) {
                            thisNameFirst = thisName;
                        }
                        var thisNameLast = thisName.indexOf(' ') < 0 ? '' : nameDivider === ' ' ? '_' + thisName.replace(thisNameFirst + ' ', '') : '_' + thisName.replace(', ' + thisNameFirst, '');
                        var emailAddy;
                        if ($(img).attr('data-email') && $(img).attr('data-email').length > 0) {
                            emailAddy = $(img).attr('data-email');
                        } else {
                            emailAddy = thisNameFirst + thisNameLast;
                        }
                        var tippyId = 'tippy' + thisNameFirst + thisNameLast + '-' + Math.floor(Math.random() * 999999999) + 1;
                        tippyId = tippyId.replace(/ /g, '');
                        var dataSubject;
                        if (document.querySelector('.qa-title')) {
                            dataSubject = 're: [' + document.querySelector('.qa-title').textContent + '](' + document.URL + ')'.replace('#', '');
                        }
                        if (global.states.avatarPingFailed === false && global.prefs.avatarPreference[0] === 'localhost' ) {
                            // look at why there's a difference handling localhost vs. the other avatar servers
                            $(img).prop('src', 'http://' + avatarHost + thisName + imageExt);
                        } else if (global.prefs.avatarPreference[0] !== 'localhost'){
                            var templateSrc = global.templates.default.replace(/IMGID/g, thisName).replace(/IMGALT/g, thisName);
                            templateSrc = encodeURI(templateSrc.substr(templateSrc.indexOf('http'), (templateSrc.indexOf('alt=') - templateSrc.indexOf('http'))-2));
                            $(img).prop('src', templateSrc);
                        }
                        var emailSubject = document.querySelector('.qa-title') ? document.querySelector('.qa-title').textContent : ' ';
                        if($(img).attr('class').split(' ').indexOf('modAdded') < 0) {
                            $(img).addClass('modAdded'); // do this ONCE per modded image
                            tippy('[data-tippy-id=' + tippyId + ']', {
                                content: $('[data-tippy-id=' + tippyId + ']').attr('data-content'),
                                interactive: true,
                                placement: 'left',
                                onShown: function() {
                                    $('.instantUserChatLink').bind('click', (e) => {
                                        utils.debug(e.target.dataset);
                                        utils.userChatAction(e.target.dataset.chatid, e.target.dataset.subject.replace(/#(?<=#)[^\]]+]/g, '').replace(/📰/g, ''));
                                    });
                                },
                                onHide: function() {
                                    $('.instantUserChatLink').unbind('click');
                                }
                            })
                        }
                    }
                } else {
                    utils.debug('updateImg: invalid user name for ' + img.src + ': ' + thisName + '(' + thisName.length + ' chars)');
                }
            }
        }
    };
    var TIMEOUT = 750,
        avatarHost = 'localhost:8675/', // for setPhoto
        pingPhoto = '!none', // pinging for setPhoto
        imageExt = '.png',
        global = {
            ids: {
                thisSite: 'dev.azure.com',
                scriptName: 'ADO Mods',
                prefsName: 'adoPrefs',
                memsName: 'adoMems', // using this as a system-memory kind of thing.  Like the prefs but the user doesn't see them
                triggerElements: ['.footer'],
            },
            states: {
                areClassesAdded: false,
                delays: [],
                isMouseMoved: false,
                avatarPingFailed: null,
            },
            prefs: {},
            mems: undefined,
            templates: {
                default: null,
                localhost: '<img src="http://' + avatarHost + 'IMGID.png" alt="IMGALT" title="IMGALT" class="avatar s40" data-email="">',
                dicebear: '<img src="https://avatars.dicebear.com/api/bottts/IMGID.svg" alt="IMGALT" title="IMGALT" class="avatar s40" data-email="">',
            }
        },
        page = {
            initialize: function () {
                // utils.debug("init");
                setTimeout(function () {
                    page.setPrefs();
                    page.setMems();
                    tm.setTamperIcon(global);
                    tm.initNotes(global);
                    tm.addClasses();
                    page.addClasses();
                    page.setAvatars();
                }, TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName),
                    setDefaultPrefs = function() {
                        if (global.prefs.debugMode == null)                global.prefs.debugMode = false;
                        if (global.prefs.debugIgnores == null)             global.prefs.debugIgnores = [];
                        if (global.prefs.useLocalAvatars == null)          global.prefs.useLocalAvatars = false;
                        if (global.prefs.avatarPreference == null)         global.prefs.avatarPreference = ['dicebear', 'localhost']; // ['dicebear', 'adorable', 'localhost']
                    };

                if (currentPrefs == null || _.isEmpty(JSON.parse(currentPrefs))) {
                    global.prefs = {};
                    setDefaultPrefs();
                    tm.savePreferences(global.ids.prefsName, global.prefs);
                } else {
                    global.prefs = JSON.parse(currentPrefs);
                    setDefaultPrefs();
                    for (var key in global.prefs) {
                        try {
                            if (global.prefs[key] === 'true' || global.prefs[key] === 'false') {
                                global.prefs[key] = (global.prefs[key] == 'true')
                            } else {
                                global.prefs[key] = JSON.parse(global.prefs[key]);
                            }
                        } catch (e) {
                            global.prefs[key] = global.prefs[key];
                        }
                    }
                }
                switch (global.prefs.avatarPreference[0]) {
                    case 'dicebear':
                        global.templates.default = global.templates.dicebear;
                        break;
                    default:
                        global.templates.default = global.templates.localhost;
                        break;
                }
            },
            setMems: function() {
                var currentMems = GM_getValue(global.ids.memsName);
                if (currentMems == null || _.isEmpty(JSON.parse(currentMems))) {
                    global.mems = {};
                    global.mems.avatarPingTimer = global.mems.avatarPingTimer || undefined;

                    tm.savePreferences(global.ids.memsName, global.mems);
                } else {
                    global.mems = JSON.parse(currentMems);
                }
            },
            addClasses: function () {
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;

                    // Avatar-related
                    tm.addGlobalStyle('.userPopMenu { margin:0; padding:1rem; }' +
                                      '.userPopMenu li { list-style-type: none; }');
                }
            },
            setAvatars: function () {
                if (!(global.prefs.useLocalAvatars)) {
                    return;
                }

                if (!global.states.avatarPingFailed && pingPhoto != null && global.prefs.avatarPreference[0] === 'localhost') {
                    tm.ping(avatarHost + pingPhoto + imageExt, function callback (response) {
                        if (response === 'responded') {
                            global.states.avatarPingFailed = false;
                        } else {
                            global.states.avatarPingFailed = true;
                        }
                        global.mems.avatarPingTimer = moment();
                        tm.savePreferences(global.ids.memsName, global.mems);
                    });
                }

                var avatarArray = [],
                    thisName = 'none';

                // gitlab
                var avatars = [
                    {
                        element: '.project-member img', // project summary page
                        getImgSource: null,
                        getNameSource: function(el) { return el.parentElement.parentElement.getAttribute("aria-label").match(/\<(.*?)\>/g)[0].replace(/\<|\>/g, '') },
                    },
                    {
                        element: '.vss-Persona-content', // Overview Dashboard page
                        getImgSource: null,
                        getNameSource: function(el) { return el.parentElement.getAttribute("aria-label") },
                    },
                    {
                        element: '.identity-picker-resolved img', // Item Details assigned-to box
                        getImgSource: null,
                        getNameSource: function(el) { return el.parentElement.getAttribute("aria-label") },
                    },
                    {
                        element: '.identity-picture', // View All modal or Item Details History (for self)
                        getImgSource: null,
                        getNameSource: function(el) {
                            let selfEl = el.parentElement.querySelector(".identity-name");
                            if (!selfEl) {
                                selfEl = el.parentElement.getAttribute("aria-label");
                            } else {
                                selfEl = selfEl.innerText;
                            }
                            return selfEl;
                        },
                    },
                    {
                        element: '.avatar-button-image', // Item Details History
                        getImgSource: null,
                        getNameSource: function(el) { return el.getAttribute("alt") },
                    },
                ];

                avatars.forEach(avatar => {
                    tm.getContainer({
                        'el': avatar.element
                    }).then(function($container){
                        var iter = $(avatar.element).is('img') ?
                            $(avatar.element) : avatar.getImgSource ?
                            avatar.getImgSource(avatar.element) : function(el) { return $(el).find('img'); };
                        _.each(iter, function (img) {
                            thisName = utils.properName(avatar.getNameSource(img));
                            utils.debug({'iAm': 'avatars.forEach', 'avatar': avatar, 'thisName': thisName});
                            thisName && utils.updateImg(img, thisName);
                        });
                    });
                });

                $('img').each(function() {
                    var img = new Image(),
                        self = this;

                    img.onerror = function(){
                        $(self).prop('src', 'http://' + avatarHost + '!none' + imageExt);
                    }

                    if (this.src.indexOf('avatar_url') < 0) {
                        img.src = this.src;
                    }
                });

            },
        };

    setTimeout(function() {
        utils.initScript();
        document.addEventListener('mousemove', function handleMouseEvent () {
            if (!global.states.isMouseMoved) {
                global.states.isMouseMoved = true;
                setTimeout(function() {
                    global.states.isMouseMoved = false;
                }, TIMEOUT * 2);
                if (document.getElementById('GitlabModsOptions') == null) { // don't re-init the script when a popup is open
                    utils.initScript();
                }
            }
        });
    }, TIMEOUT);

})();