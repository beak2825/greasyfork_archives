// ==UserScript==
// @name			GIT Avatars
// @namespace		COMDSPDSA
// @version			8.2
// @description		Detects locally-running image server to use for replacements of avatars. Use http-server (https://www.npmjs.com/package/http-server) for node.js for simple image hosting. Recommend image size of 100x100.
// @author			Dan Overlander
// @include			*/git.dell.com*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @downloadURL https://update.greasyfork.org/scripts/37473/GIT%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/37473/GIT%20Avatars.meta.js
// ==/UserScript==

// Since v08.1: Changed avatarHost to localhost
// Since v08.0: Changed avatarHost IP
// Since v07.0: Switched to mouse move toggle.  Swapped .avatar image detection around, to get ALT prop before child alt props.
// Since v06.0: removed version from Tampermonkey Support Library link
// Since v05.0: Added .from-avatar to list of classes to swap
// Since v04.0: Fixes to match changed classes on site
// Since v03.0: added .gravatar replacement
// Since v02.0: added updateImg function with "null check"
// Since v01.0: adding scanning for middle names
// Since v00.0: init, copying from TFS Avatars script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

    var TIMEOUT = 750,
		thisScript = 'GIT Avatars',
		avatarHost = 'localhost:8080/', // for setPhoto
		pingPhoto = '!none', // pinging for setPhoto
        imageExt = '.png',
		toggle = {
			isResetting: undefined,
			areClassesAdded: false,
            isMouseMoved: false
		},
        properName = function(thisName) {
            var firstName = '',
                lastName = '',
                midName = '';

            thisName = thisName.replace('@', '');
            firstName = thisName.substring(0, thisName.indexOf('-'));
            lastName = thisName.substring(thisName.indexOf('-')+1, thisName.length);
            if (firstName.length === 0 || lastName.length === 0) {
                return;
            }
            thisName = lastName + ', ' + firstName;
            if (thisName.indexOf('-') > 0) {
                midName = thisName.substring(0, thisName.indexOf('-'));
                thisName = thisName.substring(thisName.indexOf('-')+1, thisName.length);
                thisName = thisName + ' ' + midName;
            }
            return thisName;
        },
        updateImg = function(img, thisName) {
            if (thisName != null) {
                if (thisName !== ', ') {
                    $(img).prop('src', 'http://' + avatarHost + thisName + imageExt);
                } else {
                    tm.log('updateImg: invalid user name for ' + img.src + ': ' + thisName + '(' + thisName.length + ' chars)');
                }
            }
        },
		page = {
			initialize: function () {
				setTimeout(function () {
					page.addClasses();
					page.setTamperIcon();
					page.setAvatars();
				}, TIMEOUT);
			},
			addClasses: function () {
				if (!toggle.areClassesAdded) {
					toggle.areClassesAdded = true;

				}
			},
			setTamperIcon: function () {
				// Add Tampermonkey Icon with label to identify this script
				if (!toggle.isResetting) {
					$('.tamperlabel').remove();
					toggle.isResetting = setTimeout(function() {
						if($('.tamperlabel').length > 0) {
							$('.tamperlabel').prop('title', $('.tamperlabel').prop('title') + ' | ' + thisScript);
						} else {
							$('.project-selector').append('<span class="icon icon-tfs-build-status-header tamperlabel" title="Tampermonkey scripts: ' + thisScript + '"></span>');
						}
						toggle.isResetting = undefined;
					}, TIMEOUT);
				}
            },
            setAvatars: function () {
                tm.ping(avatarHost + pingPhoto + imageExt, function callback (response) {
                    if (response === 'responded') {
                        var avatarArray = [],
                            thisName = 'none';

                        tm.getContainer({
                            'el': '.avatar-parent-child'
                        }).then(function($container){
                            tm.log('.avatar-parent-child');
                            _.each($('.avatar-parent-child img'), function (img) {
                                thisName = properName( $(img).prop('alt') );
                                updateImg(img, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.timeline-comment-avatar'
                        }).then(function($container){
                            tm.log('.timeline-comment-avatar');
                            _.each($('img.timeline-comment-avatar'), function (img) {
                                thisName = properName( $(img).prop('alt') );
                                updateImg(img, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.from-avatar'
                        }).then(function($container){
                            tm.log('.from-avatar');
                            _.each($('img.from-avatar'), function (img) {
                                thisName = properName( $(img).prop('alt') );
                                updateImg(img, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.avatar'
                        }).then(function($container){
                            tm.log('.avatar');
                            _.each($('img.avatar'), function (img) {
                                thisName = $(img).prop('alt').replace('@', '');
                                thisName = properName(thisName);
                                if (thisName == null) {
                                    thisName = $(img).next().next().text();
                                    thisName = properName(thisName);
                                }
                                updateImg(img, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.capped-card .avatar'
                        }).then(function($container){
                            tm.log('.capped-card .avatar');
                            _.each($('.capped-card img.avatar'), function (img) {
                                thisName = $(img).next().next().text().replace('@', '');
                                thisName = properName(thisName);
                                updateImg(img, thisName);
                            });
                        });

                        tm.getContainer({
                            'el': '.gravatar'
                        }).then(function($container){
                            tm.log('.gravatar');
                            _.each($('img.gravatar'), function (img) {
                                thisName = $(img).prop('alt').replace('@', '');
                                thisName = properName(thisName);
                                updateImg(img, thisName);
                                var wh = 40;
                                $(img).css({'width': wh+'px', 'height': wh+'px'});
                            });
                        });

                    }
                });
            }
        };

    /*
     * Global functions
     */

    function initScript () {
        tm.getContainer({
            'el': '.HeaderMenu',
            'max': 100,
            'spd': 1000
        }).then(function($container){
            page.initialize();
        });
    }
    initScript();

    $(document).mousemove(function(e) {
        if (!toggle.isMouseMoved) {
            toggle.isMouseMoved = true;
            setTimeout(function() {
                toggle.isMouseMoved = false;
            }, TIMEOUT * 2);
            initScript();
        }
    });

})();