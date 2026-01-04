// ==UserScript==
// @name			TFS Avatars
// @namespace		DorkForce
// @version			4.4
// @description		Detects locally-running image server to use for replacements of TFS avatars. Use http-server (https://www.npmjs.com/package/http-server) for node.js for simple image hosting. Recommend image size of 100x100.
// @author			Dan Overlander
// @include			*tfs2*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=730858
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @downloadURL https://update.greasyfork.org/scripts/40971/TFS%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/40971/TFS%20Avatars.meta.js
// ==/UserScript==

// Since v04.3: Replaced properName method with that from Gitlab script. TODO: extract script to tm library.
// Since v04.1: Tamperlibrary link updated. Removes Tamper Global script dependency
// Since v04.0: moving out setTamperIcon
// Since v03.0: Changed avatarHost to localhost
// Since v02.0: Changed avatarHost IP. Decreased TIMEOUT. Added history-image-icon class
// Since v01.0: Added missing classes from workitem history and links
// Since v00.0: Initial


(function() {
    'use strict';

    const TIMEOUT = 250;
    var toggle = {
            isMouseMoved: false,
            areClassesAdded: false
        },
        global = {
            triggerElement: '.menu-icon',
            scriptName: 'TFS Avatars',
            prefsName: 'TFSAvatarsPrefs',
            prefs: {},
            handlePrefsLocally: true,
            animationSpeed: (TIMEOUT/2),
            avatarHost: 'localhost:8080/', // for setPhoto
            pingPhoto: 'none', // pinging for setPhoto
            imageExt: '.png'
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.addClasses();
                    tm.addClasses();
                    tm.setTamperIcon(global);
                    page.setAvatars();
                }, TIMEOUT);
            },
            addClasses: function () {
                if (!toggle.areClassesAdded) {
                    toggle.areClassesAdded = true;

                    tm.addGlobalStyle('.identity-view-control { font-size:9px; line-height:10px; }');

                }
            },
            setAvatars: function () {
                tm.ping(global.avatarHost + global.pingPhoto + global.imageExt, function callback (response) {
                    if (response === 'responded') {
                        var avatarArray = [],
                            thisName = 'none',
                            thisImg;

                        tm.getContainer({
                            'el': '.user-picture-resolved'
                        }).then(function($container){
                            _.each($('.user-picture-resolved'), function (el) {
                                thisName = $(el).next().text();
                                thisImg = el;
                                utils.setProp(thisImg, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.identity-picker-resolved'
                        }).then(function($container){
                            _.each($('.identity-picker-resolved'), function (el) {
                                thisName = $(el).text().replace('Focus on the selected item to change the value via a combo box', '');
                                thisImg = el.firstChild;
                                utils.setProp(thisImg, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.history-identity-icon'
                        }).then(function($container){
                            _.each($('.history-identity-icon'), function (el) {
                                thisName = $(el).prop('alt');
                                thisName = utils.removeBrackets(thisName);
                                utils.setProp($(el), thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.la-user-icon'
                        }).then(function($container){
                            _.each($('.la-user-icon'), function (el) {
                                thisImg = $(el).find('img');
                                thisName = thisImg.prop('alt');
                                thisName = utils.removeBrackets(thisName);
                                utils.setProp(thisImg, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.history-image-icon'
                        }).then(function($container){
                            _.each($('.history-image-icon'), function (el) {
                                thisImg = $(el);
                                thisName = thisImg.prop('alt');
                                thisName = utils.removeBrackets(thisName);
                                utils.setProp(thisImg, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.ms-Persona'
                        }).then(function($container){
                            _.each($('.ms-Persona'), function (el) {
                                thisName = $(el).find('.persona-main-text-primary').text();
                                if (thisName == null || thisName === '') { // look for this value elsewhere in the DOM; in this case, the person's manager's element
                                    thisName = $(el).find('.persona-list-element-text-primary').text();
                                }
                                thisImg = $(el).find('img');
                                utils.setProp(thisImg, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.profile-image'
                        }).then(function($container){
                            _.each($('.profile-image'), function (el) {
                                thisName = $(el).parent().parent().prop('outerHTML');
                                if (thisName.indexOf('aria-label') > -1) {
                                    var propStartIndex = thisName.indexOf('aria-label') + 12,
                                        propLength = thisName.indexOf('(', propStartIndex) - propStartIndex;
                                    thisName = thisName.substr(propStartIndex, propLength);
                                } else {
                                    thisName = '';
                                }

                                if (thisName == null || thisName === '') { // look for this value elsewhere in the DOM; in this case, the person's manager's element
                                    thisName = $(el).next().text();
                                }
                                thisImg = el;
                                utils.setProp(thisImg, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.identity-picture'
                        }).then(function($container){
                            $('.identity-picture').each( function (key, value) {
                                var propStartIndex,
                                    propLength;
                                thisName = value.outerHTML; // generally, this is on the taskboard
                                if (thisName.indexOf('data-sip') > -1) {
                                    propStartIndex = thisName.indexOf('data-sip') + 10;
                                    propLength = thisName.indexOf('"', propStartIndex) - propStartIndex;
                                    thisName = thisName.substr(propStartIndex, propLength).replace('@Dell.com', '');
                                } else {
                                    thisName = '';
                                }

                                if (thisName == null || thisName === '') { // look for this value elsewhere in the DOM; in this case, within a dropdown
                                    thisName = $(this).parent().find('.title').text();
                                }

                                if (thisName == null || thisName === '') { // look for this value elsewhere in the DOM; in this case, in work-item history list
                                    thisName = $(this).parent().next().find('.discussion-messages-user').text();
                                }

                                if (thisName == null || thisName === '') { // look for this value elsewhere in the DOM; in this case, in team dashboard
                                    thisName = $(this).prop('alt');
                                    thisName = utils.removeBrackets(thisName);
                                }

                                thisImg = this;
                                utils.setProp(thisImg, thisName);
                            });
                        });

                        // On Query pages, in rows where Assigned- fields are shown. #AssignedFields
                        tm.getContainer({
                            'el': '.identity-grid-cell'
                        }).then(function($container){
                            var targetSpans = $('.identity-grid-cell').find('span');
                            targetSpans.each( function (key, value) {
                                thisName = utils.noTeam($(value).prop('innerText'));
                                if( (thisName.length > 2) && $(value).prop('innerHTML').indexOf('replacedName') === -1 ) {
                                    $(value).parent().parent().css('padding', '0px');
                                    $(value).parent().prop('innerHTML', '<span title="' + thisName + '" class="replacedName" style="background-image: url(\'http://' + global.avatarHost + thisName + global.imageExt + '\');">&nbsp;</span>' + thisName.replace(', ', '<br>').replace(' - Dell Team', '').replace(/([0-9])\w+/, '').replace(/([0-9])/, ''));
                                    $('.replacedName').css(
                                        {
                                            'top': '-2px',
                                            'position': 'relative',
                                            'height': '27px',
                                            'width': '27px',
                                            'display': 'block',
                                            'background-size': '27px 27px',
                                            'float': 'left'
                                        }
                                    );
                                }
                            });
                            setTimeout(page.setAvatars, (TIMEOUT*5));
                        });


                    }
                });
            }
        },
        utils = {
            noTeam: function(thisName) {
                return thisName.replace(' - Dell Team', '');
            },
            setProp: function(thisImg, thisName) {
                if (thisName != null && thisName != '' && thisName != 'undefined') {
                    thisName = utils.noTeam(thisName);
                    thisName = utils.properName(thisName);
                    $(thisImg).prop('src', 'http://' + global.avatarHost + thisName + global.imageExt);
                }
            },
            properName: function(thisName) {
                var firstName = '',
                    lastName = '',
                    midName = '';

                thisName = thisName
                    .replace('https://gitlab.dell.com/', '')
                    .replace(' - Dell Team', '')
                    .replace('\'s avatar', '')
                    .replace('Assigned to ', '')
                    .replace('Avatar for ', '')
                    .replace('@', '')
                    .replace(/@/g, '')
                    .replace(/\//g, '')
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
            removeBrackets(thisName) {
                if (thisName == null) {
                    return;
                }
                var propLength = thisName.indexOf('<') - 1;
                thisName = thisName.substr(0, propLength);
                return thisName;
            }
        };

    /*
     * Global functions
     */


    function initScript () {
        tm.getContainer({
            'el': global.triggerElement,
            'max': 100,
            'spd': 1000
        }).then(function($container){
            page.initialize();
        });
    }
    initScript();

    $(document).mousemove(function(e) {
        if (!global.isMouseMoved) {
            global.isMouseMoved = true;
            setTimeout(function() {
                global.isMouseMoved = false;
            }, TIMEOUT * 2);
            initScript();
        }
    });

})();



