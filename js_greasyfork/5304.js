// ==UserScript==
// @name        RPG.SE Chat Fudge Dice
// @namespace   http://userscripts.org/users/168580
// @description Convert RPG.SE chat d6 to Fudge dice (dF)
// @grant       none
// @include     http://chat.stackexchange.com/rooms/*
// @include     http://chat.stackexchange.com/transcript/*
// @version     1.4.4
// @downloadURL https://update.greasyfork.org/scripts/5304/RPGSE%20Chat%20Fudge%20Dice.user.js
// @updateURL https://update.greasyfork.org/scripts/5304/RPGSE%20Chat%20Fudge%20Dice.meta.js
// ==/UserScript==

// Changelog:
// 1.4.4 Now triggers off document.ready instead of window.load.
// 1.4.3 Moved button position. Fixed a lot of little errors.
// 1.4.2 Repaired localStorage references.
// 1.4.1 Dice script no longer activates on non-RPG.SE rooms, since those don't even have dice.
//       Also, a bug fix: script wouldn't save settings when it was activated in a room, so a refresh would lead to it being deactivated again.
// 1.4 Script now supports activation/deactivation in any chat room
// 1.3 Configurable colors
// 1.2 Made to work in Transcript. Dice faces made fatter.
// 1.1 ??
// 1.0 Created by @C.Ross (http://userscripts.org/users/168580)

//Thanks to Sohum (http://rpg.stackexchange.com/users/792/sohum) for the chrome fix
var main = function () {

    var util = (function () {

        function inTranscript() {
            return window.location.href.indexOf('/transcript/') !== -1;
        }

        // Checks to see if the chat room is on RPG.SE.
        // Other chat rooms don't have dice, so there's no point in running the script there.
        function chatroomIsOnRpgSe() {
            var footerHref = $('a', '#footer-logo').prop('href');
            return (footerHref.indexOf('rpg.stackexchange.com') >= 0);
        }

        function getRoomId() {
            var url = new URL(window.location);

            // this split will turn into one of these for the Fate room:
            // ["", "room", "8403"]
            // ["", "transcript", "8403"]
            var pathBits = url.pathname.split('/', 3);
            return pathBits[2];
        }

        return {
            inTranscript: inTranscript,
            chatroomIsOnRpgSe: chatroomIsOnRpgSe,
            getRoomId: getRoomId
        };

    })();

    var fudgeConfig = (function () {
        var store = "fudgeConfig";

        // Config (defaults)
        var _useColors = false;
        var _plusColor = '#008800';
        var _minusColor = '#CC0000';
        var _rooms = ['8403', '11']; // Fate chat room, RPG General chat

        // Get/set whether to use colours
        function useColors(value) {
            if (typeof value === "undefined") { return _useColors; }
            _useColors = value;
        }

        // Get/set the plus colour
        function plusColor(value) {
            if (typeof value === "undefined") { return _plusColor; }
            _plusColor = value;
        }

        // Get/set the minus colour
        function minusColor(value) {
            if (typeof value === "undefined") { return _minusColor; }
            _minusColor = value;
        }

        // Check whether the colour format is valid
        function validateColorInput(value) {
            // #000 or #000000 is acceptable
            if (value.length !== 7 && value.length !== 4) { return false; }
            if (value[0] !== '#') { return false; }
            return true;
        }

        function save() {
            var config = {
                'useColors': _useColors,
                'plusColor': _plusColor,
                'minusColor': _minusColor,
                'rooms': _rooms
            };
            localStorage[store] = JSON.stringify(config);
        }

        function load() {
            var firstRunEver = (typeof localStorage[store] === "undefined");
            if (firstRunEver) {
                // Use and store defaults.
                save();
                return;
            }
            var config = JSON.parse(localStorage[store]);
            _useColors = config.useColors;
            _plusColor = config.plusColor;
            _minusColor = config.minusColor;

            if (config.rooms) { _rooms = config.rooms; }
            else { save(); }
        }

        function isActive() {
            var roomId = util.getRoomId();
            return (_rooms.indexOf(roomId) >= 0);
        }

        function activateRoom() {
            _rooms.push(util.getRoomId());
            save();
        }

        function deactivateRoom() {
            var roomId = util.getRoomId();
            _rooms = $.grep(_rooms, function(value) {
                return value !== roomId;
            });
            save();
            window.location.reload();
        }

        return {
            useColors: useColors,
            plusColor: plusColor,
            minusColor: minusColor,
            validateColorInput: validateColorInput,
            save: save,
            load: load,
            isActive: isActive,
            activateRoom: activateRoom,
            deactivateRoom: deactivateRoom
        };
    })();


    // Functions that act on the chat messages themselves
    var chatMessages = (function () {
        // Replace the content of d6 dice to convert them into Fudge dice
        function convertDice() {
            $('.six-sided-die').each(function () {
                var $die = $(this);
                //It does something strange when I try to use the :not selector,
                //   So go old school
                if ($die.hasClass('fate-die')) {
                    return;
                }
                var count = $('.dot:contains("•")', $die).length;
                $die.empty();
                $die.attr('data-d6-roll', count);

                var $face = $('<span>')
                    .css('display', 'table-cell')
                    .css('vertical-align', 'middle');

                if (count < 3) {
                    $face.html('&minus;');
                    if (fudgeConfig.useColors()) {
                        $die.css('color', fudgeConfig.minusColor());
                    }
                    $die.empty().append($face);
                    $die.addClass('fate-roll-minus');
                    $die.attr('data-fate-roll', -1);
                } else if (count > 4) {
                    $face.html('+');
                    if (fudgeConfig.useColors()) {
                        $die.css('color', fudgeConfig.plusColor());
                    }
                    $die.empty().append($face);
                    $die.addClass('fate-roll-plus');
                    $die.attr('data-fate-roll', 1);
                } else {
                    $die.text(' ');
                    $die.attr('data-fate-roll', 0);
                }

                $die.css('display', 'table');
                $die.css('text-align', 'center');
                $die.css('font-size', '30px');
                $die.css('font-weight', 'bold');

                //Add class to prevent re-processing
                $die.addClass('fate-die');
            });
        }
        
        // Mark Fudge dice rolls with a title representing their value
        function add4dFMeta() {
            $('.content').each(function () {
                var $content = $(this);
                if ($('.fate-die', $content).length === 4 && !$content.hasClass('.fate-roll')) { 
                    $content.addClass('.fate-roll');

                    var total = 0;
                    $('.fate-die', $content).each(function () {
                        var $die = $(this);
                        total = total + parseInt($die.attr('data-fate-roll'), 10);
                    });

                    if (total > 0) {
                        total = '+' + total;
                    }
                    $content.attr('title', '4dF = ' + total);
                }
            });
        }

        // Update the dice on each Fudge die on screen
        function updateColors() {
            if (fudgeConfig.useColors()) {
                $('.fate-roll-plus').css('color', fudgeConfig.plusColor());
                $('.fate-roll-minus').css('color', fudgeConfig.minusColor());
            } else {
                $('.fate-roll-plus').css('color', '');
                $('.fate-roll-minus').css('color', '');
            }
        }

        function scan() {
            if (!fudgeConfig.isActive()) { return; }
            convertDice();
            add4dFMeta();
        }

        return {
            scan: scan,
            updateColors: updateColors
        };

    })();

    var configMenu = (function () {

        // Creates the button for this script
        function createButton() {
            var $button = $('<a>')
                .text('fudge dice');
            return $button;
        }

        // Wraps a form element in an appropriate label
        function wrapLabel($object, labelText) {
            var $lbl = $('<label>')
                .text(labelText)
                .css('vertical-align', 'middle')
                .prepend($object);
            $object.css('margin-right', '1em');
            return $('<p>').append($lbl);
        }

        function createActiveOptions() {
            var $options = $('<div>')
                .prop('id', 'fudge-active-options');

            var $colorToggle = $('<input>')
                .prop('type', 'checkbox')
                .css('vertical-align', 'middle')
                .prop('id', 'fudge-color-toggle');
            $options.append(wrapLabel($colorToggle, 'Use colors'));

            var $picker = $('<input>')
                .addClass('color-picker')
                .prop('type', 'text')
                .prop('maxlength', '7')
                .css('width', '7em')
                .css('vertical-align', 'middle');
            var $preview = $('<span>')
                .addClass('color-preview')
                .css('display', 'inline-block')
                .css('width', '1em')
                .css('height', '1em')
                .css('border', '1px solid black')
                .css('margin-right', '0.5em')
                .css('vertical-align', 'middle');
            var $pickerSpan = $('<span>')
                .append($preview)
                .append($picker);

            var $plusColorPicker = $pickerSpan.clone()
                .prop('id', 'fudge-plus-color');
            $options.append(wrapLabel($plusColorPicker, 'Plus color'));

            var $minusColorPicker = $pickerSpan
                .prop('id', 'fudge-minus-color');
            $options.append(wrapLabel($minusColorPicker, 'Minus color'));

            $options.append($('<button>')
                .prop('id', 'fudge-save')
                .text('Save and update')
            );

            $options.append($('<div>')
                .text("Insert a three- or six-digit hex color, such as #000 or #CC00FF, then hit enter. "
                    + "A red border means you probably entered an invalid value. "
                    + "You can still save that value but it won't be previewed. "
                    + "You can use a ")
                .append($('<a>')
                    .text('HTML Color Picker')
                    .prop('href', 'http://www.w3schools.com/tags/ref_colorpicker.asp')
                    .prop('target', '_blank')
                )
            );

            $options.append($('<div>')
                .text("To deactivate fudge dice for this room, use this (it also needs to refresh the page): ")
                .append($('<button>')
                    .prop('id', 'fudge-deactivate')
                    .text('Deactivate & refresh')
                )
            );

            return $options;
        }

        function createInactiveOptions() {
            var $options = $('<div>')
                .prop('id', 'fudge-inactive-options');

            $options.append($('<button>')
                .prop('id', 'fudge-activate')
                .text('Activate fudge dice')
            );

            return $options;
        }

        // Create the configuration menu element
        function createMenu() {
            var $menu = $('<section>')
                .css('border', '1px solid #E0DCBF')
                .css('background-color', '#FFF8DC')
                .css('padding', '10px')
                .css('color', '#444444')
                .css('margin-bottom', '1em');

            $menu.append(
                $('<h3>')
                    .text('Fudge dice config')
                    .css('margin-bottom', '0.5em')
            );

            $menu.append(createActiveOptions());
            $menu.append(createInactiveOptions());

            $menu.hide();
            return $menu;
        }

        // Updates the options to display either the active or inactive view
        function updateOptionsView() {
            if (fudgeConfig.isActive()) {
                $('#fudge-active-options').show();
                $('#fudge-inactive-options').hide();
            } else {
                $('#fudge-active-options').hide();
                $('#fudge-inactive-options').show();
            }
        }

        // Add the config menu to the page
        function addConfigMenu() {
            var $button = createButton();
            $('#sidebar-menu').append(' | ');
            $('#sidebar-menu').append($button);

            var $menu = createMenu();
            $menu.insertAfter($('#sidebar-menu'));

            $('#fudge-color-toggle').click(function () {
                fudgeConfig.useColors($(this).prop('checked'));
            });

            $('.color-picker').change(function () {
                var valid = fudgeConfig.validateColorInput($(this).val());
                if (!valid)
                {
                    $(this).css('border-color', 'red');
                    return;
                }

                $(this).css('border-color', 'green');

                $('.color-preview', $(this).parent()).css('background-color', $(this).val());
            });

            $('#fudge-color-toggle').prop('checked', fudgeConfig.useColors());
            $('#fudge-plus-color .color-picker').val(fudgeConfig.plusColor());
            $('#fudge-minus-color .color-picker').val(fudgeConfig.minusColor());
            $('.color-picker').change();

            $('#fudge-save').click(function () {
                var useColors = $('#fudge-color-toggle').prop('checked');
                var plusColor = $('#fudge-plus-color .color-picker').val();
                var minusColor = $('#fudge-minus-color .color-picker').val();

                fudgeConfig.useColors(useColors);
                fudgeConfig.plusColor(plusColor);
                fudgeConfig.minusColor(minusColor);
                fudgeConfig.save();

                chatMessages.updateColors();
            });

            updateOptionsView();

            $('#fudge-activate').click(function () {
                fudgeConfig.activateRoom();                
                updateOptionsView();
            });

            $('#fudge-deactivate').click(function () {
                fudgeConfig.deactivateRoom();
                updateOptionsView();
            });

            $button.click(function () {
                $menu.toggle();
            });
        }

        function load() {
            addConfigMenu();
        }

        return {
            load: load
        };

    })();

    $(document).ready(function () {
        // Remain inactive for non-RPG.SE chat rooms
        if (!util.chatroomIsOnRpgSe()) { return; }

        fudgeConfig.load();
        configMenu.load();

        if(util.inTranscript()) {
            chatMessages.scan();
        } else {
            $(document).one('DOMNodeInserted', '#chat', function () {
                // Wait til the dice have loaded
                $(chatMessages.scan);
            });

            setInterval(chatMessages.scan, 500);
        }
    });

};

var script = document.createElement('script');
script.type = "text/javascript";
script.id = "fudge-dice-script";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);