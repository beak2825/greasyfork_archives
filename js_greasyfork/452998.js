// ==UserScript==
// @name         Torn Attack Helper
// @namespace    http://www.torn.com/
// @version      0.2
// @description  See your yata targets in the attacks page
// @author       NicoNZ
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452998/Torn%20Attack%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/452998/Torn%20Attack%20Helper.meta.js
// ==/UserScript==


(function($) {
'use strict';

const YATA_COLOR_BLACK = 0;
const YATA_COLOR_GREEN = 1;
const YATA_COLOR_ORANGE = 2;
const YATA_COLOR_RED = 3;
const TOGGLE_COLOR_ID_PREFIX = 'toggle-color-';
const FORM_API_KEY_NAME = 'apikey';

const VALUE_LAST_YATA_UPDATE_KEY = 'yata_last_updated';
const VALUE_TARGETS_KEY = 'yata_targets';
const VALUE_FORM_VALUES_KEY = 'form_values';
const VALUE_TORN_TARGETS_KEY = 'torn_targets';
const VALUE_TORN_BACKOFF_KEY = 'torn_backoff';
const getFormDefaultValues = (flag) => {
    return {
        [FORM_API_KEY_NAME]: '',
        [TOGGLE_COLOR_ID_PREFIX + YATA_COLOR_RED]: flag,
        [TOGGLE_COLOR_ID_PREFIX + YATA_COLOR_GREEN]: flag,
        [TOGGLE_COLOR_ID_PREFIX + YATA_COLOR_ORANGE]: flag,
        [TOGGLE_COLOR_ID_PREFIX + YATA_COLOR_BLACK]: flag
    }
};
const getToggleValues = () => {
    return GM_SuperValue.get(VALUE_FORM_VALUES_KEY, getFormDefaultValues(true));
};
const setToggleValues = (toggleValues) => {
    return GM_SuperValue.set(VALUE_FORM_VALUES_KEY, toggleValues);
};
const bindFormChange = (formId) => {
    $('#' + formId).change(function() {
        const newValues = $(this).serializeArray()
        .reduce((a, v) => {
            return {
                ...a,
                [v.name]: v.value == 'on' ? true : v.value
        }}, getFormDefaultValues(false));

        setToggleValues(newValues);
        loadTargetsFromYata();
    });
};

// GENERIC REQUESTS
const makeExternalRequest = (url, query, callback) => {
    const apiKey = getToggleValues()[FORM_API_KEY_NAME].trim();
    if (apiKey == '') {
        return;
    }
    GM_xmlhttpRequest({
        method: 'GET',
        url: url + '?' + query + '&key=' + apiKey,
        responseType: 'json',
        onload: (response) => {
            callback(response.response);
        }
    });
};
// YATA
const loadTargetsFromYata = () => {
    const cachedTargets = GM_SuperValue.get(VALUE_TARGETS_KEY, null);
    if (cachedTargets != null) {
        console.log('Loading yata targets from cache');
        updateUIFromTargets(cachedTargets);
    }

    const lastUpdate = GM_SuperValue.get(VALUE_LAST_YATA_UPDATE_KEY, 0);
    const diffLastUpdateMilli = new Date().getTime() - lastUpdate;
    const timespanInMilli = 5 * 60 * 1000;

    if (diffLastUpdateMilli < timespanInMilli) {
        return;
    }

    console.log('Loading targets from yata');
    makeExternalRequest('https://yata.yt/api/v1/targets/export/', null, (data) => {
        if (!('targets' in data)) {
            console.error('Failed to load data from yata', data);
            return;
        }
        console.log('Targets successfully loaded from yata');
        GM_SuperValue.set(VALUE_LAST_YATA_UPDATE_KEY, new Date().getTime());

        let targets = [];
        for (const [key, value] of Object.entries(data.targets)) {
            targets.push({
                'id': key,
                ...value
            });
        }

        GM_SuperValue.set(VALUE_TARGETS_KEY, targets);
        updateUIFromTargets(targets);
    });
};
const updateUIFromTargets = (targets) => {
    const filterSortTargets = sortTargetsByRespect(filterTargetsBySettings(targets));
    if (filterSortTargets.length == 0) {
        return;
    }
    const currentTargetId = getCurrentTargetFromUrl();
    const currentIndex = filterSortTargets.findIndex((target) => target.id == currentTargetId);
    const firstIndex = 0;
    const previousIndex = Math.max(0, currentIndex - 1);
    const nextIndex = Math.min(filterSortTargets.length - 1, currentIndex + 1);
    const lastIndex = filterSortTargets.length - 1;

    setPlaybackButtonUrl('first', filterSortTargets[firstIndex].id);
    setPlaybackButtonUrl('previous', filterSortTargets[previousIndex].id);
    setPlaybackButtonUrl('next', filterSortTargets[nextIndex].id);
    setPlaybackButtonUrl('last', filterSortTargets[lastIndex].id);

    if (currentIndex == -1) {
        hideCurrentTargetInfo();
        return;
    }
    const currentTarget = filterSortTargets[currentIndex];
    const targetInfo = [currentTarget.note, 'R: ' + currentTarget.flat_respect.toFixed(2), (currentIndex + 1) + '/' + filterSortTargets.length].join(' - ');
    setTargetInfoInfo(targetInfo, currentTarget.color);
};
const getCurrentTargetFromUrl = () => {
    return new URLSearchParams(location.search).get('user2ID');
};
const filterTargetsBySettings = (targets) => {
    const currentTargetId = getCurrentTargetFromUrl();
    const toggleValues = getToggleValues();
    return targets
        .filter((target) => toggleValues[TOGGLE_COLOR_ID_PREFIX + target.color] || currentTargetId == target.id);
}
const sortTargetsByRespect = (targets) => {
    return targets.sort((a, b) => b.flat_respect - a.flat_respect);
}
const sortTargetsByStatusUntilLifeAndRespect = (targets) => {
    return targets.sort((a, b) => a.status_until - b.status_until || b.flat_respect - a.flat_respect || a.life_current - b.life_current );
}

// TORN
const loadTornUserData = () => {
    makeTornRequest('user/', 'bars', (userData) => {
        setStatusBarElementValue('energy', userData.energy.current, userData.energy.maximum);

        const currentChain = userData.chain.current;
        const chainBonuses = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];
        let i = 0;
        while (currentChain > chainBonuses[i]) {
            i++
        }
        const chainMax = chainBonuses[i];
        setStatusBarElementValue('chain', currentChain, chainMax);
    });
};
const loadTornTargetData = (targetId) => {
    makeTornRequest('user/' + targetId, 'timestamp,profile', (targetInfo) => {
        const targets = GM_SuperValue.get(VALUE_TORN_TARGETS_KEY, {});
        targets[targetId] = {
            'status_until': targetInfo.status.until,
            'life_current': targetInfo.life.current,
            'life_maximum': targetInfo.life.maximum,
            'update_timestamp': targetInfo.timestamp,
        };
        GM_SuperValue.set(VALUE_TORN_TARGETS_KEY, targets);

        refreshTargetList();
        console.log('Target data successfully loaded using TORN api', targetId);
    });
};
const makeTornRequest = (uri, selections, callback) => {
    if (isTornCircuitBreakerEnabled()) {
        return;
    }
    makeExternalRequest('https://api.torn.com/' + uri, 'selections=' + selections, (response) => {
        if (handleTornApiError(response)) {
            return;
        }

        callback(response);
    });
};
const handleTornApiError = (response) => {
    const TOO_MANY_REQUESTS_ERROR_CODE = 5;
    if (!('error' in response)) {
        return false;
    }

    if (response.error.code == TOO_MANY_REQUESTS_ERROR_CODE) {
        enableTornCircuitBreaker();
    }

    console.error('Failed to fetch TORN api', response);
    return true;
};
const enableTornCircuitBreaker = () => {
    // 60 seconds backoff.
    GM_SuperValue.set(VALUE_TORN_BACKOFF_KEY, new Date().getTime() + 60000);
};
const isTornCircuitBreakerEnabled = () => {
    const backOff = GM_SuperValue.get(VALUE_TORN_BACKOFF_KEY, new Date().getTime());
    return backOff > new Date().getTime();
};
const loadTargetsData = () => {
    const targets = GM_SuperValue.get(VALUE_TARGETS_KEY, null);
    if (targets == null) {
        return;
    }
    getMergedTornYataTargets(targets).forEach((target) => {
        const tornBackoffMode = false;
        if (tornBackoffMode) {
            console.log('Torn is on backoff mode. Waiting for making more requests');
            return;
        }
        if (!targetIsAttackable(target)) {
            return;
        }
        if (targetWasUpdatedRecently(target)) {
            return;
        }

        console.log('Loading target data ' + target.id);
        loadTornTargetData(target.id);
    });
}
const targetIsAttackable = (target) => target.status_until * 1000 < new Date();
const targetWasUpdatedRecently = (target) => new Date() - (target.update_timestamp * 1000) < 1000 * 60;
const refreshTargetList = () => {
    const targets = GM_SuperValue.get(VALUE_TARGETS_KEY, null);
    if (targets == null) {
        return;
    }
    renderTargetList(getMergedTornYataTargets(targets));
}
const getMergedTornYataTargets = (targets) => {
    const tornTargetValues = GM_SuperValue.get(VALUE_TORN_TARGETS_KEY, {});
    const filterSortTargets = filterTargetsBySettings(targets);
    return sortTargetsByStatusUntilLifeAndRespect(filterSortTargets.map((target) => {
        const tornTarget = tornTargetValues[target.id] || {};
        return {
            ...target,
            ...tornTarget,
        }
    }));;
}

const init = () => {
    createHtmlElements();
    loadTargetsFromYata();
    loadTornUserData();
    loadTargetsData();
    refreshTargetList();
};



const createMainWrapperElement = (id) => {
    const $mainTornContainer = $('.content-wrapper');

    $('body')
        .append(
        $('<form></form>')
        .attr('id', id)
        .css('background-color', 'black')
        .css('padding', '10px')
        .css('position', 'fixed')
        .css('left', $mainTornContainer.offset().left + $mainTornContainer.width() + 'px')
        .css('top', $mainTornContainer.offset().top + 'px')
        .css('font-size', '15px')
        .css('text-align', 'center')
    );
};
const createWrapperElement = (wrapperId, id) => {
    $('<div></div>')
        .attr('id', id)
        .css('margin', '10px')
        .appendTo('#' + wrapperId);
};
const createStatusBarElement = (wrapperId, name, color) => {
    $('<div></div>')
        .attr('id', name + '-wrapper')
        .css('margin-bottom', '10px')
        .css('position', 'relative')
        .css('height', '15px')
        .appendTo('#' + wrapperId);

    const baseElement = $('<div></div>')
        .css('width', '0%')
        .css('height', '100%')
        .css('position', 'absolute');

    baseElement
        .clone()
        .attr('id', name + '-background')
        .css('z-index', '0')
        .css('width', '100%')
        .css('background-color', color)
        .css('opacity', '0.6')
        .appendTo('#' + name + '-wrapper');
    baseElement
        .clone()
        .attr('id', name + '-bar')
        .css('z-index', '1')
        .css('background-color', color)
        .appendTo('#' + name + '-wrapper');
    baseElement
        .clone()
        .attr('id', name + '-text')
        .text('? / ?')
        .css('z-index', '2')
        .css('width', '100%')
        .css('color', 'white')
        .appendTo('#' + name + '-wrapper');
};
const setStatusBarElementValue = (id, min, max) => {
    $('#' + id + '-bar').css('width', Math.min(100, (min / max * 100)) + '%');
    $('#' + id + '-text').text(min + ' / ' + max);
};
const createApiKeyInputElement = (wrapperId, name, defaultValue) => {
    $('<input></input>')
        .attr('name', name)
        .attr('id', name)
        .attr('type', 'text')
        .attr('placeholder', 'api key')
        .val(defaultValue)
        .css('width', '100%')
        .appendTo('#' + wrapperId);
};
const createPlaybackButtonElement = (wrapperId, icon, action) => {
    $('<a></a>')
        .text(icon)
        .attr('href', '#')
        .attr('id', action)
        .attr('alt', 'Go to ' + action + ' target')
        .css('font-size', '25px')
        .css('text-decoration', 'none')
        .appendTo('#' + wrapperId);
};
const getPlayerAttackUrl = (targetId) => '/loader.php?sid=attack&user2ID=' + targetId;
const setPlaybackButtonUrl = (id, targetId) => {
    $('#' + id).attr('href', getPlayerAttackUrl(targetId))
};
const createToggleElement = (wrapperId, name, label, defaultValue) => {
    $('<input></input>')
        .attr('name', name)
        .attr('id', name)
        .attr('type', 'checkbox')
        .prop('checked', defaultValue)
        .appendTo('#' + wrapperId);
    $('<label></label>')
        .text(label)
        .attr('for', name)
        .appendTo('#' + wrapperId);
};
const createTargetInfoElement = (wrapperId) => {
    $('<span></span>')
        .attr('id', 'target-info')
        .text('Loading...')
        .css('width', '100%')
        .css('height', '15px')
        .css('display', 'block')
        .css('background', 'gray')
        .appendTo('#' + wrapperId);
};
const getTargetColorByColorCode = (colorCode) => {
    switch (colorCode) {
        case YATA_COLOR_BLACK:
        return 'gray';

        case YATA_COLOR_GREEN:
        return 'green';

        case YATA_COLOR_ORANGE:
        return 'orange';

        case YATA_COLOR_RED:
        return 'red';
        }
    return 'silver';
}
const setTargetInfoInfo = (text, colorCode) => {
    $('#target-info')
        .text(text)
        .css('background', getTargetColorByColorCode(colorCode));
};
const hideCurrentTargetInfo = () => {
    $('#target-info')
        .css('display', 'none');
};
const renderTargetList = (targets) => {
    $('#tytm-target-list-wrapper').html(
        targets.map(target => renderTarget(target))
    );
}
const renderTarget = (target) => {
    const health = Math.floor(target.life_current / target.life_maximum * 100);
    const name = target.name;
    let status = '';
    if (!targetIsAttackable(target)) {
        status = $('<span></span>').countdown(target.status_until * 1000, {elapse: true})
            .on('update.countdown', function(event) {
            let format = '%M:%Ss - ';
            if (event.offset.hours != 0) {
                format = '%-H' + format;
            }
            const $this = $(this);
            if (event.elapsed) {
                $this.html(event.strftime('Out for ' + format));
                return;
            }

            $this.html(event.strftime('Ready in ' + format));
        });
    }
    return $('<a></a>')
        .attr('id', 'target' + target.id)
        .attr('href', getPlayerAttackUrl(target.id))
        .text(name)
        .css('text-decoration', 'none')
        .css('width', '100%')
        .css('height', '15px')
        .css('padding', '2px 4px')
        .css('display', 'block')
        .css('text-align', 'left')
        .css('background', 'border-box')
        .css('background-color', getTargetColorByColorCode(target.color))
        .prepend(status);
}
const createHtmlElements = () => {
    const mainWrapperId = 'tytm-form';
    const tornDataWrapperId = 'tytm-torn-data';
    const apiKeyWrapperId = 'tytm-api-key-wrapper';
    const playbackButtonsWrapperId = 'tytm-playback-buttons-wrapper';
    const togglesWrapperId = 'tytm-toggles-wrapper';
    const targetInfoWrapperId = 'tytm-target-info-wrapper';
    const targetListWrapperId = 'tytm-target-list-wrapper';

    const toggleValues = getToggleValues();
    createMainWrapperElement(mainWrapperId);

    createWrapperElement(mainWrapperId, apiKeyWrapperId);
    createApiKeyInputElement(apiKeyWrapperId, FORM_API_KEY_NAME, toggleValues[FORM_API_KEY_NAME]);

    createWrapperElement(mainWrapperId, tornDataWrapperId);
    createStatusBarElement(tornDataWrapperId, 'energy', 'green');
    createStatusBarElement(tornDataWrapperId, 'chain', 'gray');

    createWrapperElement(mainWrapperId, playbackButtonsWrapperId);
    createPlaybackButtonElement(playbackButtonsWrapperId, '⏮', 'first');
    createPlaybackButtonElement(playbackButtonsWrapperId, '⏪', 'previous');
    createPlaybackButtonElement(playbackButtonsWrapperId, '⏩', 'next');
    createPlaybackButtonElement(playbackButtonsWrapperId, '⏭', 'last');

    createWrapperElement(mainWrapperId, togglesWrapperId);
    const colorMap = {
        [YATA_COLOR_RED]: 'R',
        [YATA_COLOR_ORANGE]: 'O',
        [YATA_COLOR_GREEN]: 'G',
        [YATA_COLOR_BLACK]: 'B'
    };
    for (const [colorKey, colorLabel] of Object.entries(colorMap)) {
        const colorId = TOGGLE_COLOR_ID_PREFIX + colorKey;
        createToggleElement(togglesWrapperId, colorId, colorLabel, toggleValues[colorId]);
    }

    createWrapperElement(mainWrapperId, targetInfoWrapperId);
    createTargetInfoElement(targetInfoWrapperId);

    createWrapperElement(mainWrapperId, targetListWrapperId);

    bindFormChange(mainWrapperId);
};

// Library stolen from: https://userscripts-mirror.org/scripts/source/107941.user.js
const GM_SuperValue = new function () {

    var JSON_MarkerStr  = 'json_val: ';
    var FunctionMarker  = 'function_code: ';

    function ReportError (msg) {
        if (console && console.error)
            console.log (msg);
        else
            throw new Error (msg);
    }

    //--- Check that the environment is proper.
    if (typeof GM_setValue != "function")
        ReportError ('This library requires Greasemonkey! GM_setValue is missing.');
    if (typeof GM_getValue != "function")
        ReportError ('This library requires Greasemonkey! GM_getValue is missing.');


    /*--- set ()
        GM_setValue (http://wiki.greasespot.net/GM_setValue) only stores:
        strings, booleans, and integers (a limitation of using Firefox
        preferences for storage).

        This function extends that to allow storing any data type.

        Parameters:
            varName
                String: The unique (within this script) name for this value.
                Should be restricted to valid Javascript identifier characters.
            varValue
                Any valid javascript value.  Just note that it is not advisable to
                store too much data in the Firefox preferences.

        Returns:
            undefined
    */
    this.set = function (varName, varValue) {

        if ( ! varName) {
            ReportError ('Illegal varName sent to GM_SuperValue.set().');
            return;
        }
        if (/[^\w _-]/.test (varName) ) {
            ReportError ('Suspect, probably illegal, varName sent to GM_SuperValue.set().');
        }

        switch (typeof varValue) {
            case 'undefined':
                ReportError ('Illegal varValue sent to GM_SuperValue.set().');
            break;
            case 'boolean':
            case 'string':
                //--- These 2 types are safe to store, as is.
                GM_setValue (varName, varValue);
            break;
            case 'number':
                /*--- Numbers are ONLY safe if they are integers.
                    Note that hex numbers, EG 0xA9, get converted
                    and stored as decimals, EG 169, automatically.
                    That's a feature of JavaScript.

                    Also, only a 32-bit, signed integer is allowed.
                    So we only process +/-2147483647 here.
                */
                if (varValue === parseInt (varValue)  &&  Math.abs (varValue) < 2147483647)
                {
                    GM_setValue (varName, varValue);
                    break;
                }
            case 'object':
                /*--- For all other cases (but functions), and for
                    unsafe numbers, store the value as a JSON string.
                */
                var safeStr = JSON_MarkerStr + JSON.stringify (varValue);
                GM_setValue (varName, safeStr);
            break;
            case 'function':
                /*--- Functions need special handling.
                */
                var safeStr = FunctionMarker + varValue.toString ();
                GM_setValue (varName, safeStr);
            break;

            default:
                ReportError ('Unknown type in GM_SuperValue.set()!');
            break;
        }
    }//-- End of set()


    /*--- get ()
        GM_getValue (http://wiki.greasespot.net/GM_getValue) only retieves:
        strings, booleans, and integers (a limitation of using Firefox
        preferences for storage).

        This function extends that to allow retrieving any data type -- as
        long as it was stored with GM_SuperValue.set().

        Parameters:
            varName
                String: The property name to get. See GM_SuperValue.set for details.
            defaultValue
                Optional. Any value to be returned, when no value has previously
                been set.

        Returns:
            When this name has been set'
                The variable or function value as previously set.

            When this name has not been set, and a default is provided...
                The value passed in as a default

            When this name has not been set, and default is not provided...
                undefined
    */
    this.get = function (varName, defaultValue) {

        if ( ! varName) {
            ReportError ('Illegal varName sent to GM_SuperValue.get().');
            return;
        }
        if (/[^\w _-]/.test (varName) ) {
            ReportError ('Suspect, probably illegal, varName sent to GM_SuperValue.get().');
        }

        //--- Attempt to get the value from storage.
        var varValue    = GM_getValue (varName);
        if (!varValue)
            return defaultValue;

        //--- We got a value from storage. Now unencode it, if necessary.
        if (typeof varValue == "string") {
            //--- Is it a JSON value?
            var regxp       = new RegExp ('^' + JSON_MarkerStr + '(.+)$');
            var m           = varValue.match (regxp);
            if (m  &&  m.length > 1) {
                varValue    = JSON.parse ( m[1] );
                return varValue;
            }

            //--- Is it a function?
            var regxp       = new RegExp ('^' + FunctionMarker + '((?:.|\n|\r)+)$');
            var m           = varValue.match (regxp);
            if (m  &&  m.length > 1) {
                varValue    = eval ('(' + m[1] + ')');
                return varValue;
            }
        }

        return varValue;
    }//-- End of get()
};


/*!
 * The Final Countdown for jQuery v2.2.0 (http://hilios.github.io/jQuery.countdown/)
 * Copyright (c) 2016 Edson Hilios
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){"use strict";function b(a){if(a instanceof Date)return a;if(String(a).match(g))return String(a).match(/^[0-9]*$/)&&(a=Number(a)),String(a).match(/\-/)&&(a=String(a).replace(/\-/g,"/")),new Date(a);throw new Error("Couldn't cast `"+a+"` to a date object.")}function c(a){var b=a.toString().replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1");return new RegExp(b)}function d(a){return function(b){var d=b.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);if(d)for(var f=0,g=d.length;f<g;++f){var h=d[f].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/),j=c(h[0]),k=h[1]||"",l=h[3]||"",m=null;h=h[2],i.hasOwnProperty(h)&&(m=i[h],m=Number(a[m])),null!==m&&("!"===k&&(m=e(l,m)),""===k&&m<10&&(m="0"+m.toString()),b=b.replace(j,m.toString()))}return b=b.replace(/%%/,"%")}}function e(a,b){var c="s",d="";return a&&(a=a.replace(/(:|;|\s)/gi,"").split(/\,/),1===a.length?c=a[0]:(d=a[0],c=a[1])),Math.abs(b)>1?c:d}var f=[],g=[],h={precision:100,elapse:!1,defer:!1};g.push(/^[0-9]*$/.source),g.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source),g.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source),g=new RegExp(g.join("|"));var i={Y:"years",m:"months",n:"daysToMonth",d:"daysToWeek",w:"weeks",W:"weeksToMonth",H:"hours",M:"minutes",S:"seconds",D:"totalDays",I:"totalHours",N:"totalMinutes",T:"totalSeconds"},j=function(b,c,d){this.el=b,this.$el=a(b),this.interval=null,this.offset={},this.options=a.extend({},h),this.instanceNumber=f.length,f.push(this),this.$el.data("countdown-instance",this.instanceNumber),d&&("function"==typeof d?(this.$el.on("update.countdown",d),this.$el.on("stoped.countdown",d),this.$el.on("finish.countdown",d)):this.options=a.extend({},h,d)),this.setFinalDate(c),this.options.defer===!1&&this.start()};a.extend(j.prototype,{start:function(){null!==this.interval&&clearInterval(this.interval);var a=this;this.update(),this.interval=setInterval(function(){a.update.call(a)},this.options.precision)},stop:function(){clearInterval(this.interval),this.interval=null,this.dispatchEvent("stoped")},toggle:function(){this.interval?this.stop():this.start()},pause:function(){this.stop()},resume:function(){this.start()},remove:function(){this.stop.call(this),f[this.instanceNumber]=null,delete this.$el.data().countdownInstance},setFinalDate:function(a){this.finalDate=b(a)},update:function(){if(0===this.$el.closest("html").length)return void this.remove();var b,c=void 0!==a._data(this.el,"events"),d=new Date;b=this.finalDate.getTime()-d.getTime(),b=Math.ceil(b/1e3),b=!this.options.elapse&&b<0?0:Math.abs(b),this.totalSecsLeft!==b&&c&&(this.totalSecsLeft=b,this.elapsed=d>=this.finalDate,this.offset={seconds:this.totalSecsLeft%60,minutes:Math.floor(this.totalSecsLeft/60)%60,hours:Math.floor(this.totalSecsLeft/60/60)%24,days:Math.floor(this.totalSecsLeft/60/60/24)%7,daysToWeek:Math.floor(this.totalSecsLeft/60/60/24)%7,daysToMonth:Math.floor(this.totalSecsLeft/60/60/24%30.4368),weeks:Math.floor(this.totalSecsLeft/60/60/24/7),weeksToMonth:Math.floor(this.totalSecsLeft/60/60/24/7)%4,months:Math.floor(this.totalSecsLeft/60/60/24/30.4368),years:Math.abs(this.finalDate.getFullYear()-d.getFullYear()),totalDays:Math.floor(this.totalSecsLeft/60/60/24),totalHours:Math.floor(this.totalSecsLeft/60/60),totalMinutes:Math.floor(this.totalSecsLeft/60),totalSeconds:this.totalSecsLeft},this.options.elapse||0!==this.totalSecsLeft?this.dispatchEvent("update"):(this.stop(),this.dispatchEvent("finish")))},dispatchEvent:function(b){var c=a.Event(b+".countdown");c.finalDate=this.finalDate,c.elapsed=this.elapsed,c.offset=a.extend({},this.offset),c.strftime=d(this.offset),this.$el.trigger(c)}}),a.fn.countdown=function(){var b=Array.prototype.slice.call(arguments,0);return this.each(function(){var c=a(this).data("countdown-instance");if(void 0!==c){var d=f[c],e=b[0];j.prototype.hasOwnProperty(e)?d[e].apply(d,b.slice(1)):null===String(e).match(/^[$A-Z_][0-9A-Z_$]*$/i)?(d.setFinalDate.call(d,e),d.start()):a.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi,e))}else new j(this,b[0],b[1])})}});

init();
})(jQuery);