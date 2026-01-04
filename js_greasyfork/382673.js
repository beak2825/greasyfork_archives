// ==UserScript==
// @name         Chaturbate Easy Tipping
// @namespace    madTipper
// @version      0.1
// @author       omgmikey
// @match        https://*.chaturbate.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @description Adds a new tipping popup and modifies the existing one
// @downloadURL https://update.greasyfork.org/scripts/382673/Chaturbate%20Easy%20Tipping.user.js
// @updateURL https://update.greasyfork.org/scripts/382673/Chaturbate%20Easy%20Tipping.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

CSS_GREY  = {'color': 'rgb(88,141,61)'};
CSS_WHITE = {'color': '#FFFFFF'};
CSS_BLACK = {'color': '#000000'};

ID_PREFIX    = '#madTipper'
CLASS_PREFIX = '.madTipper'
CLASS_INPUT  = CLASS_PREFIX + '_input';

var HTML_IDS = {
    'BUTTON': 'button',
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

var shell = $('.tip_shell');
var tipsLeft = 0;
var tipFunctionTimeout = null;
var juration = loadJuration();

(function initialize() {

    createTipperButton();
    createTipperPopup();
    injectCSS();
    improveDefaultTipPopup();

    loadPreviousSettings();
    initializeButtonCallbacks();
    updateTipperButton();
})();

function createTipperButton() {

    shell.append('<div id="madTipper_button_bg"><a href="#" id="madTipper_button"></a></div>');
}

function updateTipperButton() {

    if (tipsLeft == 0) {
        $(HTML_IDS['BUTTON']).html('MAD TIPPER').css({'width': '80px'});
    }
    else {
        $(HTML_IDS['BUTTON']).html('MAD TIPPER (' + tipsLeft + ')').css({'width': '120px'});
    }
}

function createTipperPopup() {

    shell.append(
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

    var buttonBackgroundUrl =
        'url("https://ssl-ccstatic.highwebmedia.com/images/btn-sprites2.gif?ac5eba7d5cf3") no-repeat right';

    var buttonFontFamily =
        'UbuntuMedium,Arial,Helvetica,sans-serif';

    var genericButtonCSS = {
        'height':'21px',
        'width':'100px',
        'padding-left':'10px',
        'margin-right':'10px',
        'font-size':'12px',
        'text-shadow':'1px 1px 0 #588d3d',
        'color': '#FFFFFF'
    };

    genericButtonCSS['font-family'] = buttonFontFamily;
    genericButtonCSS['background'] = buttonBackgroundUrl + ' -84px';

    var mainButtonCSS = {
        'position': 'absolute',
        'left': '500px',
        'top': '30px',
        'height': '18px',
        'padding': '3px 10px 0 0',
        'text-decoration': 'none',
        'text-align': 'center',
        'width': '80px'
    }

    for (var key in genericButtonCSS) {
        if (mainButtonCSS[key] === undefined) {
            mainButtonCSS[key] = genericButtonCSS[key];
        }
    }

    $(HTML_IDS['BUTTON']).css(mainButtonCSS);

    $(CLASS_INPUT).css({
        'width': 'auto',
        'margin-bottom': '10px'
    });

    $(HTML_IDS['POPUP']).css({
        'position': 'absolute',
        'z-index': 1000,
        'width': '280px',
        'top': '-456px',
        'left': '452px',
        'display': 'none'
    }).draggable();

    $(HTML_IDS['POPUP'] + ' .formborder').css({
        'border-bottom': '2px solid #0b5d81',
        'height': '420px'
    });

    $(HTML_IDS['START']).css(genericButtonCSS);
    genericButtonCSS['background'] = buttonBackgroundUrl + ' -42px';

    delete genericButtonCSS['color'];
    $(HTML_IDS['STOP']).css(genericButtonCSS);
}

function improveDefaultTipPopup() {

    $('.overlay_popup.tip_popup').css({
        'top': '-240px'
    }).draggable();

    $('#tip_message').css({
        'margin-bottom': '20px'
    })
    .append('<input type="checkbox" class="float_right" id="tip_keepopen"></input><br />')
    .append('<br /><label class="float_right" for="tip_keepopen">Keep this window open after tipping</label>');

    $('.float_right').css({
        'float': 'right'
    });

    setPopupHeight('250px');

    var tipPopup = $('.tip_popup');
    var keepOpenCheckbox = $('#tip_keepopen');
    var popupIsForcedOpen = false;

    /* use CB jquery to ensure correct callback execution order */
    var tipPopupForm = defchat_settings.domroot.find('.tip_popup form');
    tipPopupForm.submit(onFormSubmit);

    keepOpenCheckbox.css({
        'margin-top': '10px'
    });

    $('body').click(function(ev) {

        if ($('.tip_button').is(ev.target)) {
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

        setPopupHeight('270px');

        if (!keepOpenCheckbox.is(':checked')) {
            return;
        }

        if (!tipPopup.is(':visible')) {
            tipPopup.show();
            popupIsForcedOpen = true;
        }
    }

    function setPopupHeight(value) {
        $('.overlay_popup.tip_popup .formborder').css({
            'height': value,
        });
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

    $(HTML_IDS['START']).prop('disabled', true).css(CSS_GREY);
    $(HTML_IDS['STOP']).prop('disabled', false).css(CSS_WHITE);
    $(CLASS_INPUT).prop('disabled', true).css(CSS_GREY);

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

    var queryUrl = $('.tip_popup form').attr('action');

    var queryParams = $.param({
        'csrfmiddlewaretoken': $.cookie('csrftoken'),
        'tip_amount': getTipAmount(),
        'message': '',
        'tip_room_type': $('#id_tip_room_type').val(),
        'tip_v': defchat_settings.v_tip_vol,
    });

    $.ajax({
        url: queryUrl,
        data: queryParams,
        dataType: 'json',
        type: 'post',
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

    $(HTML_IDS['STOP']).prop('disabled', true).css(CSS_GREY);
    $(HTML_IDS['START']).prop('disabled', false).css(CSS_WHITE);
    $(CLASS_INPUT).prop('disabled', false).css(CSS_BLACK);
}

function initializeButtonCallbacks() {

    var popup = $(HTML_IDS['POPUP']);
    var button = $(HTML_IDS['BUTTON']);

    button.click(function(ev) {
        if (popup.is(':visible')) {
            popup.hide();
        }
        else {
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
