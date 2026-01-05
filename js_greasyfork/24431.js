// ==UserScript==
// @name         SGTools Giveaways Helper (Custom by Barokai)
// @icon         https://cdn.steamgifts.com/img/favicon.ico
// @namespace    *://www.sgtools.info/
// @version      1.7.7
// @description  Makes your life easier!
// @author       Barokai | www.loigistal.at (Enhanced version of KnSYS which is based on a work from Mole & Archi. See below)
// @description  Enhanced create giveaway feature - added 3 buttons for 3 giveaway groups (BundleQuest, RPGTreasury, Unlucky-7) which will be chosen automatically on click.
// @homepage     https://github.com/Barokai/sgtools-giveaways-helper-custom/
// @license      https://github.com/Barokai/sgtools-giveaways-helper-custom/blob/master/LICENSE
// @match        *://www.steamgifts.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24431/SGTools%20Giveaways%20Helper%20%28Custom%20by%20Barokai%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24431/SGTools%20Giveaways%20Helper%20%28Custom%20by%20Barokai%29.meta.js
// ==/UserScript==
/* Based on SGTools Giveaways Helper by KnSYS
 * which is
 * Based on Touhou Giveaways Helper
 * https://github.com/Aareksio/touhou-giveaways-helper
 * authors  Mole & Archi
 *
 * MIT License
 */

/* TODO Barokai:
 * set default duration per group
 * set default description per group (eg. unlucky-7: open for gifters or not, bundlequest: free/discount/premium,..)
 */

(function() {
    'use strict';

    var SGTOOLS_SITE = 'https://www.sgtools.info/';
    var SGTOOLS_TIME = 2 * 24 * 60 * 60 * 1000; // 2 days recommended

    var DEFAULT_LEVEL = 0;
    var DEFAULT_DESCRIPTION = "**Good Luck!**";
    var DISCLAIMER = "\n\n**Please notice**:\nThere is a very small chance that the key was already redeemed (happens if i forget to note that) - if thats the case, write a comment/message and I’ll send you a new key/steamgift!";
    var GROUPS = {
        "none": {
            name: "",
            level: 1,
            description: DEFAULT_DESCRIPTION + DISCLAIMER
        },
        "boxofkittens": {
            name: "Box of Kittens!",
            level: DEFAULT_LEVEL,
            description: DEFAULT_DESCRIPTION + "\n\nComment with a funny gif ;)" + DISCLAIMER
        },
        "bundlequest": {
            name: "Bundle Quest",
            level: DEFAULT_LEVEL,
            description: DEFAULT_DESCRIPTION + "\n\n*This Giveaway is a normal/free/XX% discount giveaway.*" + DISCLAIMER
        },
        "rpgtreasury": {
            name: "RPG Treasury",
            level: DEFAULT_LEVEL,
            description: DEFAULT_DESCRIPTION + DISCLAIMER
        },
        "unlucky7": {
            name: "Unlucky-7",
            level: DEFAULT_LEVEL,
            description: DEFAULT_DESCRIPTION + "\n\nOpen for gifters, but please make sure that your [gift difference](http://i.imgur.com/69WNFSw.png) is above 7.0 or higher.\nYou can check yours [here](https://www.steamgifts.com/group/WWF2y/unlucky-7/users)." + DISCLAIMER
        }
    };

    var current_path;
    if (/steamgifts\.com/.exec(window.location.href)) {
        current_path = window.location.pathname.split('/');
        removeFromArray(current_path, "");
    }

    if (current_path) {
        if (current_path.length !== 0 && current_path[0] === 'giveaways' && current_path[1] === 'new') {
            addStyles();
            giveawayNew();
        } else if (current_path.length !== 0 && current_path[0] === 'giveaway') {
            var id = current_path[1];
            console.log(id);
            getProtectedStatus(id);
        }
    }

    function getProtectedStatus(id) {
        var isInviteOnly = $('.featured__column--invite-only').length;
        if (isInviteOnly) {
            var url = SGTOOLS_SITE + 'api/isSGTProtected/' + id;
            $.getJSON(url + "?callback=?", function(result) {
                var isProtected = result["protected"];
                var toAppendValid = $(".sidebar__entry-insert");
                var toAppendError = $(".sidebar__error");
                if (isProtected) {
                    toAppendValid.html('<i class="fa fa-lock"></i> Enter SGTools Protected Giveaway');
                    toAppendError.html('<i class="fa fa-lock"></i> ' + toAppendError.html());
                    toAppendValid.css({
                        'border-color': "#93BBD3 #699DBC #427BA4 #70ACC8",
                        'background-image': 'linear-gradient(#A7D1EE 0%, #8AC4DF 50%, #6AA2C9 100%)',
                        'color': 'inherit'
                    });
                } else {
                    toAppendValid.html('<i class="fa fa-unlock"></i> ' + toAppendValid.html());
                }
            });
        }
    }

    function giveawayNew() {
        let getGroupButtons = function() {
            var buttonMarkup = "";
            $.each(GROUPS, function(key, g) {
                //var groupname = g.name !== "" ? " for " + g.name : "";
                var groupname = g.name || "default";
                var icon = groupname !== "default" ? "group" : "gift";
                var id = "sgToolsBtn_" + key;
                //buttonMarkup += '  <div class="form__row__indent"><div class="form__submit-button" id="' + id + '"><i class="fa fa-fast-forward"></i>&nbsp;Fill default settings' + groupname + '</div>&nbsp;</div>';
                buttonMarkup += '  <div class="form__submit-button" id="' + id + '"><i class="fa fa-'+ icon +'"></i>&nbsp;' + groupname + '</div>&nbsp;';
            });
            return buttonMarkup;
        };

        let bindOnClick = function() {
            $.each(GROUPS, function(key, group) {
                var id = "sgToolsBtn_" + key;
                $("#" + id).click(function() {
                    applySettings(group);
                    console.log("clicked " + (group.name || "default" ) + " button");
                });
            });
        };

        $(".form__rows").prepend(
            '<div class="form__row form__row--sgtools-giveaway-helper">' +
            '  <div class="form__heading">' +
            '    <div class="form__heading__number">0.</div>' +
            '    <div class="form__heading__text">SGTools Giveaway</div>' +
            '  </div>' +
            getGroupButtons() +
            '</div>');
        bindOnClick();

        let applyGiveawayTypeKey = function() {
            var privateButton = $("div[data-checkbox-value='key']");
            if (!privateButton.hasClass('is-selected')) {
                privateButton.trigger("click");
            }
        };

        let applyDates = function() {
            let startingDate = new Date();
            let endingDate = new Date(startingDate.getTime() + SGTOOLS_TIME + (60 * 60 * 1000)); // Extra 1 hour
            $("input[name='start_time']").val(formatDate(startingDate));
            $("input[name='end_time']").val(formatDate(endingDate));
        };

        let applyRegionRestrictions = function() {
            $("div[data-checkbox-value='0']").trigger("click");
        };

        var applyPrivate = function(group) {
            if (group.name) {
                var privateButton = $("div[data-checkbox-value='invite_only']");
                if (!privateButton.hasClass('is-selected')) {
                    privateButton.trigger("click");
                }
            }
        };

        let scrollToGroup = function(group) {
            var container = $('.form__groups'),
                scrollTo = group;

            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
        };

        let applyGroup = function(group) {
            if (group.name) {
                var privateButton = $("div[data-checkbox-value='groups']");
                if (!privateButton.hasClass('is-selected')) {
                    privateButton.trigger("click");
                }

                var group_form = $('div.form__group__details > div.form__group__name:contains(' + group.name + ')');
                group_form.click();
                scrollToGroup(group_form);
            }
        };

        let applyDescription = function(group) {
            let descarea = $("textarea[name='description']");
            descarea.val(group.description);
        };

        let applyLevel = function(group) {
            let levelValue = $("input[name='contributor_level']");
            levelValue.val(group.level);
            $(".ui-slider-range").css('width', group.level * 10 + "%");
            $(".ui-slider-handle").css('left', group.level * 10 + "%");
            if (group.level > 0) {
                $(".form__input-description--level").removeClass("is-hidden");
                $(".form__input-description--no-level").addClass("is-hidden");
                $("span.form__level").text("level " + group.level);
            } else {
                $(".form__input-description--no-level").removeClass("is-hidden");
                $(".form__input-description--level").addClass("is-hidden");
            }

        };

        let reset = function() {
            $(".form__checkbox.is-disabled").show();
            $('div.form__group.form__group--steam.is-selected').click(); // deselect all previously selected groups
            $("div[data-checkbox-value='everyone']").click(); // set "who can enter" to everyone
            var group = {
                level: 0
            };
            applyLevel(group); // reset level to 0
            console.log("resetted checkboxes/groups/level");
        };

        let applySettings = function(group) {
            reset();
            applyGiveawayTypeKey();
            applyDates();
            applyRegionRestrictions();
            applyPrivate(group);
            applyDescription(group);
            applyLevel(group);
            applyGroup(group);
            // hides not used checkboxes
            $(".form__checkbox.is-disabled").hide();
            // focus input to enter game name
            $(".js__autocomplete-name").focus();
        };
    }

    /* Helpers */
    function removeFromArray(arr, item) {
        for (let i = arr.length; i--;) {
            if (arr[i] === item) {
                arr.splice(i, 1);
            }
        }
    }

    function formatDate(date) {
        // Fixed by Archi for all SG weird dates, do not touch

        // Fix hours
        let hours = date.getHours();
        let ampm = '';
        if (hours < 12) {
            ampm = 'am';
            if (hours === 0) {
                hours = 12;
            }
        } else {
            ampm = 'pm';
            if (hours !== 12) {
                hours = hours % 12;
            }
        }

        // Fix minutes
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        // Return result
        return $.datepicker.formatDate('M d, yy', date) + " " + hours + ":" + minutes + " " + ampm;
    }
})();

/*jshint multistr: true */
function addStyles() {
    GM_addStyle("\
input[type=text], textarea{\
-webkit-transition: all 0.30s ease-in-out;\
-moz-transition: all 0.30s ease-in-out;\
-ms-transition: all 0.30s ease-in-out;\
-o-transition: all 0.30s ease-in-out;\
outline: none;\
padding: 3px 0px 3px 3px;\
margin: 5px 1px 3px 0px;\
border: 1px solid #DDDDDD;\
} \
input[type=text]:focus, textarea:focus {\
box-shadow: 0 0 5px rgba(81, 203, 238, 1);\
padding: 3px 0px 3px 3px;\
margin: 5px 1px 3px 0px;\
border: 1px solid rgba(81, 203, 238, 1) !important; \
}");
}
