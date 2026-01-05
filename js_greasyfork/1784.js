// ==UserScript==
// @name           Twitch touches pokemon
// @namespace      https://github.com/lostcoaster/twitch-touches-pokemon
// @author         lostcoaster
// @author         MattiasBuelens
// @version        1.6
// @description    A tool adding a touch overlay onto the stream of twitchplayspokemon.
// @grant          unsafeWindow

// this include string credits Twitch Plays Pokemon Chat Filter
// @include        /^https?://(www|beta)\.twitch\.tv\/twitchplayspokemon(\/?)$/
// @include        /^https?://(www\.)?tinytwit\.ch\/twitchplayspokemon.*$/
// @include        /^https?://(www\.)?twitchplayspokemon\.net\/?$/

// @downloadURL https://update.greasyfork.org/scripts/1784/Twitch%20touches%20pokemon.user.js
// @updateURL https://update.greasyfork.org/scripts/1784/Twitch%20touches%20pokemon.meta.js
// ==/UserScript==

// for bookmarklet users : javascript:(function(){document.body.appendChild(document.createElement('script')).src='https://raw.githubusercontent.com/lostcoaster/twitch-touches-pokemon/master/touch.user.js';})();

/* jshint
     lastsemic:true,
     eqeqeq:true,
     unused:true
 */
/* global
     unsafeWindow:false
 */

(function () {

'use strict';

// ----------------------------
// Greasemonkey support
// ----------------------------
// Greasemonkey userscripts run in a separate environment and cannot use global
// variables from the page directly. They need to be accessed via `unsafeWindow`

var myWindow;
try {
    myWindow = unsafeWindow;
} catch (e) {
    myWindow = window;
}

var $ = myWindow.jQuery;

var Setting = function (key, defaultValue) {
    this.key = key;
    this.defaultValue = defaultValue;
    this.value = undefined;
    this.observers = [];
};
Setting.prototype.getValue = function () {
    return (this.value !== undefined) ? this.value : this.defaultValue;
};
Setting.prototype.setValue = function (value) {
    var newValue = (value !== undefined) ? value : this.defaultValue;
    if (newValue !== this.value) {
        this.value = newValue;
        this.fireObservers(newValue);
    }
};
Setting.prototype.restoreDefault = function () {
    this.setValue(this.defaultValue);
};
Setting.prototype.load = function (settings) {
    this.setValue(settings ? settings[this.key] : undefined);
};
Setting.prototype.save = function (settings) {
    settings[this.key] = this.getValue();
};
Setting.prototype.observe = function (observer) {
    this.observers.push(observer);
};
Setting.prototype.fireObservers = function (value) {
    for (var i = 0; i < this.observers.length; i++) {
        this.observers[i].call(null, value, this.key, this);
    }
};
Setting.prototype.bind = function (input) {
    input = $(input);
    if (input.is(':checkbox')) {
        this.bindCheckbox(input);
    }
};
Setting.prototype.bindCheckbox = function (checkbox) {
    var self = this;
    // set current value
    checkbox.prop('checked', this.getValue());
    // bind checkbox to setting
    this.observe(function (newValue) {
        checkbox.prop('checked', newValue);
    });
    // bind setting to checkbox
    checkbox.change(function () {
        self.setValue(checkbox.prop('checked'));
    });
};


var forIn = function (obj, f) {
    for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            f(k, obj[k]);
        }
    }
};

var touch_pad = {
    parameters: {
        position_x: 0.359,
        position_y: 0.548,
        original_height: 434,
        bar_height: 30,
        ratio: 9 / 16,
        screen_height: 192,
        screen_width: 256
    },

    settings: {
        show_border: new Setting('show_border', true),
        direct_send: new Setting('direct_send', false)
    },
    settings_key: 'twitch-touches-pokemon',

    scale: 1,

    interval_handle: (window.touch_pad === undefined ? undefined : touch_pad.interval_handle),

    // reflect mouse event to coordinate output.
    coords: function (event) {
        var x = Math.floor((event.pageX - $(event.target).offset().left) / touch_pad.scale);
        var y = Math.floor((event.pageY - $(event.target).offset().top) / touch_pad.scale);
        x = Math.min(Math.max(x, 1), touch_pad.parameters.screen_width);
        y = Math.min(Math.max(y, 1), touch_pad.parameters.screen_height);
        return x + ',' + y;
    },
    // adjust position of the box, parameters are relative position of top-left corner of the box within stream screen
    // 0 <= rx,ry <= 1
    position: function (rx, ry) {
        try{
            var base = $('#player,#videoPlayer');
            if(!base.is('object')) // in tinytwitch #player is that object.
                base = base.find('object'); // but in twitch player is just a div.
            var height = base.height() - touch_pad.parameters.bar_height;
            var base_offset = base.offset();
            var real_height, real_width, left_margin, top_margin;
            if (height / base.width() > touch_pad.parameters.ratio) {
                // this is the behavior of BetterTTV, filling horizontally and leave margins on top and bottom
                real_width = base.width();
                real_height = real_width * touch_pad.parameters.ratio;
                touch_pad.scale = real_height / touch_pad.parameters.original_height;
                left_margin = 0;
                top_margin = (height - real_height) / 2;
            } else {
                // this is the normal behavior of twitch, filling vertically and leave margins on left and right.
                real_height = height;
                touch_pad.scale = real_height / touch_pad.parameters.original_height;
                real_width = real_height / touch_pad.parameters.ratio;
                left_margin = (base.width() - real_width) / 2;
                top_margin = 0;
            }
            $('.touch_overlay').offset({
                top: Math.floor(base_offset.top + top_margin + ry * real_height),
                left: Math.floor(base_offset.left + left_margin + rx * real_width)
            })
                .height(Math.floor(touch_pad.parameters.screen_height * touch_pad.scale))
                .width(Math.floor(touch_pad.parameters.screen_width * touch_pad.scale));
        } catch(err) {
            console.error(err); //don't quit
        }

    },

    aim: function () {
        touch_pad.position(touch_pad.parameters.position_x, touch_pad.parameters.position_y); // rough estimation No.2
    },

    init_settings: function () {
        forIn(touch_pad.settings, function (k, setting) {
            setting.observe(function () {
                touch_pad.save_settings();
            });
        });
    },
    load_settings: function () {
        var settings = JSON.parse(myWindow.localStorage.getItem(touch_pad.settings_key));
        forIn(touch_pad.settings, function (k, setting) {
            setting.load(settings);
        });
    },
    save_settings: function () {
        var settings = {};
        forIn(touch_pad.settings, function (k, setting) {
            setting.save(settings);
        });
        myWindow.localStorage.setItem(touch_pad.settings_key, JSON.stringify(settings));
    },
    restore_default_settings: function () {
        forIn(touch_pad.settings, function (k, setting) {
            setting.restoreDefault();
        });
    },

    init: function () {
        if ($('.touch_overlay').length === 0) {

            $('body')
                .append('<div class="touch_overlay" style="cursor:crosshair;z-index:99"></div>')
                .append('<style type="text/css">.touchborder{border:red solid 1px;}</style>');


            $('.touch_overlay').unbind()
                .mouseup(function (event) {
                    var output_text = touch_pad.coords(event);
                    var output_area = $('textarea')
                        .val(output_text)
                        .change();

                    // on tinytwitch accessing the textarea is difficult.
                    if (output_area.length === 0)
                        myWindow.prompt('Twitch touches pokemon cannot locate the chat box on this page, possibly because it is not on the offical stream page, but you can copy the following value to send it yourself.',
                            output_text);

                    if (touch_pad.settings.direct_send.getValue()) {
                        $('.send-chat-button button').click();
                    }

                });

            // add the reaiming into settings menu. idea stolen from the chat-filter : http://redd.it/1y8ukl
            $('.chat-settings')
                .append('<div class="chat-menu-header">Touch pad</div>')
                .append($('<div class="chat-menu-content"></div>')
                    .append('<p><label><input id="ttp-show-border" type="checkbox"> Show border</label></p>')
                    .append('<p><label><input id="ttp-direct-send" type="checkbox"> Send on clicking</label></p>')
                    .append($('<button>Reposition Touchpad</button>').click(function () {
                        touch_pad.aim();
                    })));
        }

        // initialize settings
        touch_pad.init_settings();
        // bind inputs to settings
        touch_pad.settings.show_border.bind('#ttp-show-border');
        touch_pad.settings.direct_send.bind('#ttp-direct-send');
        // observe settings
        touch_pad.settings.show_border.observe(function (shown) {
            $('.touch_overlay').toggleClass("touchborder", shown);
        });
        // load settings
        touch_pad.load_settings();

        //start running
        touch_pad.aim();

        if (touch_pad.interval_handle) {
            clearInterval(touch_pad.interval_handle);
        }
        //update the size every 50 ms , thanks to Meiguro's idea!
        touch_pad.interval_handle = setInterval(touch_pad.aim, 50);
    }
};

// initialize on DOM ready
$(function () {
    touch_pad.init();
});

})();
