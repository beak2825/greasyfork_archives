// ==UserScript==
// @name         DSA Admin Plugin
// @locale       English (en)
// @namespace    COMDSPDSA
// @version      10.4
// @description  Adds abilities to DSA Admin
// @author       Dan Overlander
// @include	     *olqa.preol.dell.com*
// @include	     http://localhost:36865*
// @exclude      */swagger/*
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=730858
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40019/DSA%20Admin%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/40019/DSA%20Admin%20Plugin.meta.js
// ==/UserScript==

// Since v10.3: Removes Tamper Global script dependency
// Since v10.2: Updated Tampermonkey library
// Since v10.1: moving out setTamperIcon
// Since v10.0: Tweaked button colors
// Since v09.0: Swapping the length of roles loaded on init
// Since v08.0: Now need to trim the roles that are saved, apparently!
// Since v07.0: Ugh. Added a length-reset to the reset stores function. Also added a try/catch to fix empty-length bug
// Since v06.0: Outputs length of stored arrays to each load button's text
// Since v05.0: Added a "reset stores" button. Changed selection of loading action from "contains" to "isText"
// Since v04.0: renamed the buttons, added a "clear all"
// Since v03.0: added maintenance tool link, revamps OP GMOR link. Added permissionStatus link.
// Since v02.0: Upgraded button styles
// Since v01.0: Adds link to OP GMOR site
// Since v00.0: Initial

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

    var TIMEOUT = 750,
		global = {
            scriptName: 'DSA Admin Plugin',
            prefsName: 'adminPrefs',
            prefs: {},
            handlePrefsLocally: true,
            triggerElement: '.icon-ui-dell',
            isResetting: undefined,
			areClassesAdded: false,
            isMenuAdded: false,
            gEnv: 'g1'
		},
		page = {
			initialize: function () {
                if ($('#application_title_text').parent().find('span:contains("G2")').length > 0) global.gEnv = 'g2';
                if ($('#application_title_text').parent().find('span:contains("G3")').length > 0) global.gEnv = 'g3';
                if ($('#application_title_text').parent().find('span:contains("G4")').length > 0) global.gEnv = 'g4';

                if ($('#admin_users_tab').length === 0) {
                    global.isMenuAdded = false;
                }
				setTimeout(function () {
					page.addClasses();
                    tm.addClasses();
					tm.setTamperIcon(global);
                    tm.getContainer({
                        'el': '#admin_users_tab',
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        page.addMenu();
                        page.addLinks();
                    });
				}, TIMEOUT);
			},
			addClasses: function () {
				if (!global.areClassesAdded) {
					global.areClassesAdded = true;

                    tm.addGlobalStyle('.dpButton { cursor:pointer; float:right; height:35px; margin-right:-4px; top:5px; position:relative; z-index:999; color:navy !important; ' +
                                                  'background:linear-gradient(to bottom, rgba(252,252,252,1) 0%,rgba(238,238,238,1) 40%,rgba(223,223,223,1) 100%); ' +
                                                  'color:#2688BB; border-radius: 20px 10px 10px 10px; border-width:thin; }');

                    tm.addGlobalStyle('.offs { font-weight:bold; position:absolute; top:19px; right:7px; }');
				}
			},
            addLinks: function() {
                $('td:contains("DellOrderProcessingAdmin")').html('DellOrderProcessingAdmin <button class="dpButton" style="height:20px; top:0px;" onclick="window.open(\'http://' + global.gEnv + 'vmtools06.olqa.preol.dell.com/DSA-Maintenance/Opgmor\')">Go</button>');
            },
            addMenu: function () {
				if (!global.isMenuAdded) {
					global.isMenuAdded = true;
                    var rolesOneLength,
                        rolesTwoLength,
                        buttonId,
                        rolesToCopy = [],
                        buttonAnchor = $('#admin_users_tab').parent().parent().parent();

                    try{
                        rolesOneLength = JSON.parse(localStorage.getItem('rolesToCopy')).length;
                        rolesTwoLength = JSON.parse(localStorage.getItem('bookmarkedRoles')).length;
                    }
                    catch(error){
                        rolesOneLength = '';
                        rolesTwoLength = '';
                    }

                    buttonId = 'clearAll';
                    var clearAll = function () {
                        $('tr input:checked').click();
                        return false;
                    };
                    buttonAnchor.before('<button id="' + buttonId + '" class="dpButton">' + buttonId + '</button>');
                    $('#' + buttonId).click(clearAll);

                    buttonId = 'showChecked';
                    var showChecked = function () {
                        $('tr input:not(:checked)').parent().parent().hide();
                        return false;
                    };
                    buttonAnchor.before('<button id="' + buttonId + '" class="dpButton">' + buttonId + '</button>');
                    $('#' + buttonId).click(showChecked);


                    buttonId = 'showAll';
                    var showAll = function () {
                        $('tr input:not(:checked)').parent().parent().show();
                        return false;
                    };
                    buttonAnchor.before('<button id="' + buttonId + '" class="dpButton">' + buttonId + '</button>');
                    $('#' + buttonId).click(showAll);


                    buttonId = 'resetStores';
                    var resetStores = function () {
                        localStorage.setItem('bookmarkedRoles', {});
                        localStorage.setItem('rolesToCopy', {});
                        $('#rolesOneLength').text('');
                        $('#rolesTwoLength').text('');
                        alert('Role storage cleared.');
                        return false;
                    };
                    buttonAnchor.before('<button id="' + buttonId + '" class="dpButton">' + buttonId + '</button>');
                    $('#' + buttonId).click(resetStores);

                    buttonId = 'loadTwo';
                    var loadTwo = function () {
                        $('tr input:checked').click();
                        rolesToCopy = JSON.parse(localStorage.getItem('bookmarkedRoles'));
                        if (rolesToCopy != null && rolesToCopy.length > 0) {
                            _.each(rolesToCopy, (role) => {
                                if (role != null || role !== 'undefined') {
                                    $('td:isText("' + role + '")').prev().find('input').click();
                                }
                            });
                            logRoles('load', 2);
                            setTimeout(function () {
                                alert('Role Set [02] loaded.');
                            }, TIMEOUT);
                        } else {
                            alert('No roles to load.');
                        }
                        return false;
                    };
                    buttonAnchor.before('<button id="' + buttonId + '" class="dpButton">' + buttonId + '<span id="rolesTwoLength" class="offs">' + rolesTwoLength + '</span></button>');
                    $('#' + buttonId).click(loadTwo);


                    buttonId = 'storeTwo';
					var storeTwo = function () {
                        var trRole;
                        rolesToCopy = [];
                        showChecked();
                        var roleTrs = $('.info-hdr:contains("Profiles")').next().find('tr');
                        _.each(roleTrs, (roleTr) => {
                            _.each($(roleTr), (jqTR) => {
                                $(jqTR).each(function() {
                                    trRole = $($(this).find('td:visible')[1]).prop('outerText');
                                    if (trRole != null) {
                                        rolesToCopy.push(trRole.trim());
                                    }
                                });
                            });
                        });
                        localStorage.setItem('bookmarkedRoles', JSON.stringify(rolesToCopy));
                        showAll();
                        logRoles('store', 2);
                        $('#rolesTwoLength').text(rolesToCopy.length);
                        alert('Role Set [02] stored.');
                        return false;
                    };
                    buttonAnchor.before('<button id="' + buttonId + '" class="dpButton">' + buttonId + '</button>');
                    $('#' + buttonId).click(storeTwo);

                    buttonId = 'loadOne';
                    var loadOne = function () {
                        $('tr input:checked').click();
                        rolesToCopy = JSON.parse(localStorage.getItem('rolesToCopy'));
                        if (rolesToCopy != null && rolesToCopy.length > 0) {
                            _.each(rolesToCopy, (role) => {
                                if (role != null || role !== 'undefined') {
                                    $('td:isText("' + role + '")').prev().find('input').click();
                                }
                            });
                            logRoles('load', 1);
                            setTimeout(function () {
                                alert('Role Set [01] loaded.');
                            }, TIMEOUT);
                        } else {
                            alert('No roles to load.');
                        }
                        return false;
                    };
                    buttonAnchor.before('<button id="' + buttonId + '" class="dpButton">' + buttonId + '<span id="rolesOneLength"  class="offs">' + rolesOneLength + '</span></button>');
                    $('#' + buttonId).click(loadOne);

                    buttonId = 'storeOne';
                    var storeOne = function () {
                        var trRole;
                        rolesToCopy = [];
                        showChecked();
                        var roleTrs = $('.info-hdr:contains("Profiles")').next().find('tr');
                        _.each(roleTrs, (roleTr) => {
                            _.each($(roleTr), (jqTR) => {
                                $(jqTR).each(function() {
                                    trRole = $($(this).find('td:visible')[1]).prop('outerText');
                                    if (trRole != null) {
                                        rolesToCopy.push(trRole.trim());
                                    }
                                });
                            });
                        });
                        localStorage.setItem('rolesToCopy', JSON.stringify(rolesToCopy));
                        logRoles('store', 1);
                        showAll();
                        $('#rolesOneLength').text(rolesToCopy.length);
                        alert('Role set [01] stored.');
                        return false;
                    };
                    buttonAnchor.before('<button id="' + buttonId + '" class="dpButton">' + buttonId + '</button>');
                    $('#' + buttonId).click(storeOne);


                    // SWITCH ANCHORS - NOW USE APPEND INSTEAD OF BEFORE
                    buttonAnchor = $('#userDetails_header').parent().parent().find('td').eq(1);


                    buttonId = 'dsaMaintenance';
                    var gotoMaintenance = function () {
                        window.open('http://' + global.gEnv + 'vmtools06.olqa.preol.dell.com/DSA-Maintenance/AppSettings', '_blank');
                        return false;
                    };
                    buttonAnchor.append('<button id="' + buttonId + '" class="dpButton" style="margin-right:20px; top:3px;">' + buttonId + '</button>');
                    $('#' + buttonId).click(gotoMaintenance);

                    buttonId = 'permissionStatus';
                    var gotoPermissions = function () {
                        window.open(window.location.href.substr(0, window.location.href.indexOf('#')) + '#/security/mypermissions', '_self');
                        return false;
                    };
                    buttonAnchor.append('<button id="' + buttonId + '" class="dpButton" style="margin-right:20px; top:3px;">' + buttonId + '</button>');
                    $('#' + buttonId).click(gotoPermissions);

                }
            }
        };

    /*
     * Global functions
     */

    if( ! $.expr[':']['isText'] ) {
        $.expr[':']['isText'] = function( node, index, props ) {
            var retVal = false;
            // Verify single text child node with matching text
            if( node.nodeType == 1 && node.childNodes.length == 1 ) {
                var childNode = node.childNodes[0];
                retVal = childNode.nodeType == 3 && childNode.nodeValue === props[3];
            }
            return retVal;
        };
    }

    function logRoles(action, whichRoleset) {
        console.log(action + ' roleset ' + whichRoleset);
        switch(whichRoleset) {
            case(1):
                console.log(JSON.parse(localStorage.getItem('rolesToCopy')));
                break;
            case(2):
                console.log(JSON.parse(localStorage.getItem('bookmarkedRoles')));
                break;
        }

    }

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

    window.onresize = function(event) {
        initScript();
    };

})();