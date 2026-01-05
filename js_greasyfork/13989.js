// ==UserScript==
// @name         Chaturbate Easy Tipping
// @namespace    madTipper
// @version      0.2
// @author       omgmikey
// @match        https://chaturbate.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-idle
// @description Adds a new tipping popup and modifies the existing one
// @downloadURL https://update.greasyfork.org/scripts/13989/Chaturbate%20Easy%20Tipping.user.js
// @updateURL https://update.greasyfork.org/scripts/13989/Chaturbate%20Easy%20Tipping.meta.js
// ==/UserScript==
/* globals jQuery, $, initialRoomDossier */
/* eslint-disable dot-notation, no-multi-spaces */

var ID_PREFIX    = '#madTipper'
var CLASS_PREFIX = '.madTipper'
var CLASS_INPUT  = CLASS_PREFIX + '_input';

var HTML_IDS = {
    'BUTTON': 'button',
    'BUTTON_BG': 'button_bg',
    'POPUP': 'popup',
    'AMOUNT': 'amount',
    'COUNT': 'count',
    'INTERVAL': 'interval',
    'VARIANCE_LOWER': 'variance_lower',
    'VARIANCE_UPPER': 'variance_upper',

    'START': 'start',
    'STOP': 'stop',
    'TOTAL': 'total',
    'ETA': 'eta'
}

for (var key in HTML_IDS) {
    HTML_IDS[key] = ID_PREFIX + '_' + HTML_IDS[key];
}

var defaultSendTipButton = null;
var buttonAttach = null;
var popupAttach = null;

var tipsLeft = 0;
var tipFunctionTimeout = null;
var juration = loadJuration();

waitForKeyElements("#sendTipButton", initialize, true);

function initialize() {
    defaultSendTipButton = $('#sendTipButton');
    buttonAttach = defaultSendTipButton.parent();
    popupAttach = $('#SplitModeTipCallout').parent();

    createTipperButton();
    createTipperPopup();
    injectCSS();
    improveDefaultTipPopup();

    loadPreviousSettings();
    initializeButtonCallbacks();
    updateTipperButton();
};

function createTipperButton() {

    buttonAttach.append('<div id="madTipper_button_bg" class="sendTipButton"><a href="#" id="madTipper_button"></a></div>');
}

function updateTipperButton() {
    if (tipsLeft == 0) {
        $(HTML_IDS['BUTTON_BG']).html('MAD TIPPER').css({'width': '93px', 'max-width': '93px'});
    }
    else {
        $(HTML_IDS['BUTTON_BG']).html('MAD TIPPER (' + tipsLeft + ')').css({'width': '120px', 'max-width': '120px'});
    }
}

function createTipperPopup() {

    popupAttach.append(
        '<div class="overlay_popup" id="madTipper_popup">' +
            '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                '<tbody>' +
                    '<tr>' +
                        '<td class="formborder">' +
                            '<div class="title">Mad Tipper</div>' +
                            '<div class="body">' +
                                '<form>' +
                                    '<label>Amount per tip:</label><br >' +
                                    '<input type="text" id="madTipper_amount" class="madTipper_input">' +
                                    '<br />' +

                                    '<label>Number of tips:</label><br >' +
                                    '<input type="text" id="madTipper_count" class="madTipper_input">' +
                                    '<br /><hr />' +

                                    '<label>Interval:</label><br >' +
                                    '<input type="text" id="madTipper_interval" class="madTipper_input">' +
                                    '<br />' +

                                    '<label>Interval variance lower (optional):</label><br >' +
                                    '<input type="text" id="madTipper_variance_lower" class="madTipper_input">' +
                                    '<br />' +

                                    '<label>Interval variance upper (optional):</label><br >' +
                                    '<input type="text" id="madTipper_variance_upper" class="madTipper_input">' +
                                    '<br /><hr />' +

                                    'Total tip:  ' + '<a id="madTipper_total"></a>' +
                                    '<br />' +
                                    'Estimated duration:  ' + '<a id="madTipper_eta"></a>' +
                                '</form>' +
                                '<hr />' +
                                '<button id="madTipper_start">Start</button>' +
                                '<button id="madTipper_stop" disabled="disabled">Stop</button>' +
                            '</div>' +
                        '</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
        '</div>'
    );
}

function injectCSS() {

    $(HTML_IDS['BUTTON_BG']).attr('style', defaultSendTipButton.attr('style'));

    $(HTML_IDS['START']).attr('style', defaultSendTipButton.attr('style'));
    $(HTML_IDS['STOP']).attr('style', defaultSendTipButton.attr('style'));

    $(HTML_IDS['START']).addClass("sendTipButton");

    $(HTML_IDS['START']).prop('disabled', false);
    $(HTML_IDS['STOP']).prop('disabled', true);

    $(HTML_IDS['POPUP']).attr('style', $('#SplitModeTipCallout').attr('style'));
    $(HTML_IDS['POPUP']).css('left', '200px');

    $(CLASS_INPUT).css({
        'width': 'auto',
        'margin-bottom': '10px'
    });

    $(HTML_IDS['POPUP']).draggable();

    $(HTML_IDS['POPUP'] + ' .formborder').css({
        'height': '420px'
    });
}

function improveDefaultTipPopup() {

    $('#SplitModeTipCallout').draggable();

    $('#SplitModeTipCallout .tipMessageInput').parent()
    .append('<input type="checkbox" id="tip_keepopen"></input>')
    .append('<label for="tip_keepopen">Keep this window open after tipping</label>');

    var tipPopup = $('#SplitModeTipCallout');
    var keepOpenCheckbox = $('#tip_keepopen');
    var popupIsForcedOpen = false;

    var tipPopupForm = window.$('#SplitModeTipCallout form');
    tipPopupForm.submit(onFormSubmit);

    $('body').click(function(ev) {

        if ($('#SplitModeTipCallout .sendTip button[type="submit"]').is(ev.target)) {
            popupIsForcedOpen = false;
            return;
        }

        if (!popupIsForcedOpen || tipPopup.has(ev.target).length) {
            return;
        }

        if (tipPopup.is(':visible')) {
            tipPopup.hide();
        }

        popupIsForcedOpen = false;
    });

    function onFormSubmit() {

        if (!keepOpenCheckbox.is(':checked')) {
            return;
        }

        if (!tipPopup.is(':visible')) {
            tipPopup.show();
            popupIsForcedOpen = true;

            keepPopupOpen();
        }
    }

    function keepPopupOpen() {
        if (!tipPopup.is(':visible')) {
            defaultSendTipButton.trigger('click');
            tipPopup.show();
            return;
        }

        setTimeout(() => {
            keepPopupOpen();
        }, 100);
    }
}

function startTipping() {

    var err = verifyTipperFields();

    if (err) {
        alert(err);
        stopTipping();
        return;
    }

    saveCurrentSettings();

    $(HTML_IDS['START']).prop('disabled', true);
    $(HTML_IDS['STOP']).prop('disabled', false);
    $(CLASS_INPUT).prop('disabled', true);

    tipsLeft = getTipCount();

    /* we really want to send the first one immediately */
    sendTip();

    if (tipsLeft > 0) {
        chainQueueTips();
    }
}

function verifyTipperFields() {

    function isInt(value) {
        var regex = /^[0-9]+$/;
        return regex.test(String(value));
    }

    function isDuration(value) {
        try {
            juration.parse(value);
            return true;
        }
        catch(ex) {
            return false;
        }
    }

    function isDurationOrEmpty(value) {
        return value === '' || isDuration(value);
    }

    if (!isInt(getTipAmountRaw()) || getTipAmount() <= 0) {
        return 'Tip amount field should be a positive integer.';
    }

    if (!isInt(getTipCountRaw()) || getTipCount() <= 0) {
        return 'Tip count field should be a positive integer.';
    }

    if (!isDuration(getTipInterval())) {
        return 'Tip interval should contain a duration. E.g.: "2.5s", "1", "2min"';
    }

    if (!isDurationOrEmpty(getVarianceLowerRaw()) || !isDurationOrEmpty(getVarianceUpperRaw())) {
        return 'Variance fields should contain durations, or be left blank. E.g.: "", "2.5s"';
    }
}

function getSleepInterval() {

    var interval = juration.parse(getTipInterval());
    var lower_bound = interval - getVarianceLower();
    var upper_bound = interval + getVarianceUpper();

    return getRandomNumber(lower_bound, upper_bound) * 1000;
}

function getRandomNumber(min, max) {

    return Math.random() * (max - min) + min;
}

function chainQueueTips() {

    var sleepTime = getSleepInterval();

    tipFunctionTimeout = setTimeout(function() {
        sendTip(chainQueueTips);
    }, sleepTime);
}

function sendTip(queueNextTipFn) {

    var roomInfo = JSON.parse(initialRoomDossier);
    var queryUrl = '/tipping/send_tip/' + roomInfo.broadcaster_username + '/';

    var params = {
        'csrfmiddlewaretoken': $.cookie('csrftoken'),
        'tip_amount': getTipAmount(),
        'tip_room_type': roomInfo.room_status,
        'tip_type': 'public',
        'from_username': roomInfo.viewer_username,
        'source': 'theater',
        'video_mode': 'split',
        'message': '',
    };

    var formData = new FormData();

    for (const [k, v] of Object.entries(params)) {
        formData.append(k , v);
    }

    $.ajax({
        url: queryUrl,
        data: formData,
        method: 'POST',
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) {
            if (response.error) {
                alert(response.error);
                stopTipping();
            }
        }
    });

    updateTipsLeft();

    if (tipsLeft === 0) {
        stopTipping();
    }
    else if (queueNextTipFn) {
        queueNextTipFn();
    }
}

function updateTipsLeft() {

    tipsLeft--;
    updateTipperButton();
}

function stopTipping() {

    clearTimeout(tipFunctionTimeout);
    tipFunctionTimeout = null;

    tipsLeft = 0;
    updateTipperButton();

    $(HTML_IDS['STOP']).prop('disabled', true);
    $(HTML_IDS['START']).prop('disabled', false);
    $(CLASS_INPUT).prop('disabled', false);
}

function initializeButtonCallbacks() {

    var popup = $(HTML_IDS['POPUP']);
    var button = $(HTML_IDS['BUTTON_BG']);

    button.click(function(ev) {
        if (popup.is(':visible')) {
            popup.hide();
        }
        else {
            $(HTML_IDS['POPUP']).attr('style', $('#SplitModeTipCallout').attr('style'));
            popup.show();
        }
    });

    popup.click(function(ev) {
        ev.stopPropagation();
    });

    $(HTML_IDS['START']).click(function() {
        startTipping();
        $(HTML_IDS['POPUP']).hide();
    });

    $(HTML_IDS['STOP']).click(function() {
        stopTipping();
    });

    $('body').click(function(ev) {
        if (ev.target.id != button.prop('id')) {
            $(HTML_IDS['POPUP']).hide();
        }
    });

    $(CLASS_INPUT).change(function() {
        calculateAndSetTotalTip();
        calculateAndSetETA();
    });
}

function calculateAndSetTotalTip() {

    var value = $(HTML_IDS['AMOUNT']).val() * $(HTML_IDS['COUNT']).val();
    $(HTML_IDS['TOTAL']).html(value + ' tokens');
}

function calculateAndSetETA() {
    var interval = juration.parse($(HTML_IDS['INTERVAL']).val());

    /* we're not counting the first tip */
    var count = getTipCount() - 1;

    var variance_lower = getVarianceLower();
    var variance_upper = getVarianceUpper();

    var eta = (interval + variance_upper - variance_lower) * count;
    $(HTML_IDS['ETA']).html(juration.stringify(eta, {'format': 'long', 'units': 2}));
}

function getTipAmount() {

    return parseInt(getTipAmountRaw());
}

function getTipAmountRaw() {

    return $(HTML_IDS['AMOUNT']).val();
}

function getTipInterval() {

    return $(HTML_IDS['INTERVAL']).val();
}

function getTipCount() {

    return parseInt(getTipCountRaw());
}

function getTipCountRaw() {

    return $(HTML_IDS['COUNT']).val();
}

function getVarianceLower() {

    return parseVariance(getVarianceLowerRaw());
}

function getVarianceLowerRaw() {

    return $(HTML_IDS['VARIANCE_LOWER']).val();
}


function getVarianceUpper() {

    return parseVariance(getVarianceUpperRaw());
}

function getVarianceUpperRaw() {

    return $(HTML_IDS['VARIANCE_UPPER']).val();
}

function parseVariance(variance) {

    if (variance == '0') {
        variance = 0;
    }

    variance = variance || 0;

    if (variance != 0) {
        variance = juration.parse(variance);
    }

    return variance;
}

function saveCurrentSettings() {

    GM_setValue('amount', getTipAmount());
    GM_setValue('interval', getTipInterval());
    GM_setValue('count', getTipCount());
    GM_setValue('variance_lower', getVarianceLower());
    GM_setValue('variance_upper', getVarianceUpper());
}

function loadPreviousSettings() {

    var amount = GM_getValue('amount', 1);
    $(HTML_IDS['AMOUNT']).val(amount);

    var count = GM_getValue('count', 10);
    $(HTML_IDS['COUNT']).val(count);

    var interval = GM_getValue('interval', '1s');
    $(HTML_IDS['INTERVAL']).val(interval);

    var variance_lower = GM_getValue('variance_lower', '');
    $(HTML_IDS['VARIANCE_LOWER']).val(variance_lower);

    var variance_upper = GM_getValue('variance_upper', '');
    $(HTML_IDS['VARIANCE_UPPER']).val(variance_upper);

    calculateAndSetTotalTip();
    calculateAndSetETA();
}


// Script ends here
// Libs included because they're not on a popular cdn


/*
 * juration - a natural language duration parser
 * https://github.com/domchristie/juration
 *
 * Copyright 2011, Dom Christie
 * Licenced under the MIT licence
 *
 */

function loadJuration() {

  var UNITS = {
    seconds: {
      patterns: ['second', 'sec', 's'],
      value: 1,
      formats: {
        'chrono': '',
        'micro':  's',
        'short':  'sec',
        'long':   'second'
      }
    },
    minutes: {
      patterns: ['minute', 'min', 'm(?!s)'],
      value: 60,
      formats: {
        'chrono': ':',
        'micro':  'm',
        'short':  'min',
        'long':   'minute'
      }
    },
    hours: {
      patterns: ['hour', 'hr', 'h'],
      value: 3600,
      formats: {
        'chrono': ':',
        'micro':  'h',
        'short':  'hr',
        'long':   'hour'
      }
    },
    days: {
      patterns: ['day', 'dy', 'd'],
      value: 86400,
      formats: {
        'chrono': ':',
        'micro':  'd',
        'short':  'day',
        'long':   'day'
      }
    },
    weeks: {
      patterns: ['week', 'wk', 'w'],
      value: 604800,
      formats: {
        'chrono': ':',
        'micro':  'w',
        'short':  'wk',
        'long':   'week'
      }
    },
    months: {
      patterns: ['month', 'mon', 'mo', 'mth'],
      value: 2628000,
      formats: {
        'chrono': ':',
        'micro':  'm',
        'short':  'mth',
        'long':   'month'
      }
    },
    years: {
      patterns: ['year', 'yr', 'y'],
      value: 31536000,
      formats: {
        'chrono': ':',
        'micro':  'y',
        'short':  'yr',
        'long':   'year'
      }
    }
  };

  var stringify = function(seconds, options) {

    if(!_isNumeric(seconds)) {
      throw "juration.stringify(): Unable to stringify a non-numeric value";
    }

    if((typeof options === 'object' && options.format !== undefined) && (options.format !== 'micro' && options.format !== 'short' && options.format !== 'long' && options.format !== 'chrono')) {
      throw "juration.stringify(): format cannot be '" + options.format + "', and must be either 'micro', 'short', or 'long'";
    }

    var defaults = {
      format: 'short',
      units: undefined
    };

    var opts = _extend(defaults, options);

    var units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'], values = [];
    var remaining = seconds;
    var activeUnits = 0;
    for(var i = 0, len = units.length;
        i < len && (opts.units == undefined || activeUnits < opts.units);
        i++) {
      var unit = UNITS[units[i]];
      values[i] = Math.floor(remaining / unit.value);
      if (values[i] > 0 || activeUnits > 0)
        activeUnits++;

      if(opts.format === 'micro' || opts.format === 'chrono') {
        values[i] += unit.formats[opts.format];
      }
      else {
        values[i] += ' ' + _pluralize(values[i], unit.formats[opts.format]);
      }
      remaining = remaining % unit.value;
    }
    var output = '';
    for(i = 0, len = values.length; i < len; i++) {
      if(values[i].charAt(0) !== "0" && opts.format != 'chrono') {
        output += values[i] + ' ';
      }
      else if (opts.format == 'chrono') {
        output += _padLeft(values[i]+'', '0', i==values.length-1 ? 2 : 3);
      }
    }
    return output.replace(/\s+$/, '').replace(/^(00:)+/g, '').replace(/^0/, '');
  };

  var parse = function(string) {

    // returns calculated values separated by spaces
    for(var unit in UNITS) {
      for(var i = 0, mLen = UNITS[unit].patterns.length; i < mLen; i++) {
        var regex = new RegExp("((?:\\d+\\.\\d+)|\\d+)\\s?(" + UNITS[unit].patterns[i] + "s?(?=\\s|\\d|\\b))", 'gi');
        string = string.replace(regex, function(str, p1, p2) {
          return " " + (p1 * UNITS[unit].value).toString() + " ";
        });
      }
    }

    var sum = 0,
        numbers = string
                    .replace(/(?!\.)\W+/g, ' ')                       // replaces non-word chars (excluding '.') with whitespace
                    .replace(/^\s+|\s+$|(?:and|plus|with)\s?/g, '')   // trim L/R whitespace, replace known join words with ''
                    .split(' ');

    for(var j = 0, nLen = numbers.length; j < nLen; j++) {
      if(numbers[j] && isFinite(numbers[j])) {
         sum += parseFloat(numbers[j]);
      } else if(!numbers[j]) {
        throw "juration.parse(): Unable to parse: a falsey value";
      } else {
        // throw an exception if it's not a valid word/unit
        throw "juration.parse(): Unable to parse: " + numbers[j].replace(/^\d+/g, '');
      }
    }
    return sum;
  };

  // _padLeft('5', '0', 2); // 05
  var _padLeft = function(s, c, n) {
      if (! s || ! c || s.length >= n) {
        return s;
      }

      var max = (n - s.length)/c.length;
      for (var i = 0; i < max; i++) {
        s = c + s;
      }

      return s;
  };

  var _pluralize = function(count, singular) {
    return count == 1 ? singular : singular + "s";
  };

  var _isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  var _extend = function(obj, extObj) {
    for (var i in extObj) {
      if(extObj[i] !== undefined) {
        obj[i] = extObj[i];
      }
    }
    return obj;
  };

  var juration = {
    parse: parse,
    stringify: stringify,
    humanize: stringify
  };

  return juration;
};

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
