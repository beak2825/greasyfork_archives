// ==UserScript==
// @name         Lernu.net vortaro filtrilo
// @namespace    
// @version      0.6
// @description  Filtras la lingvojn de la lernu.net vortaro
// @author       panicbit
// @match        http://*.lernu.net/cgi-bin/vortaro.pl
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.0.3/js.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11833/Lernunet%20vortaro%20filtrilo.user.js
// @updateURL https://update.greasyfork.org/scripts/11833/Lernunet%20vortaro%20filtrilo.meta.js
// ==/UserScript==

// Fix prototype.js JSON crap
// Kudos to https://github.com/mozilla/jschannel/pull/18
var _json_stringify = JSON.stringify;
JSON.stringify = function(value) {
    var _array_tojson = Array.prototype.toJSON;
    delete Array.prototype.toJSON;
    var r=_json_stringify(value);
    Array.prototype.toJSON = _array_tojson;
    return r;
};

$.noConflict();

var settingsIcon = 'data:image/png;base64,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';
var defaultLangs = ['eo--eo', 'en--eo', 'eo--en'];
var langOptionsSelector = '#ElektiLingvon option';
var shownLangs = undefined;

var selectedLang = function(lang) {
    return Cookies.get('nlernuvortaro_lingvoparo');
};

var isShownLang = function(lang) {
    return shownLangs.indexOf(lang) != -1;
};

var loadLangs = function() {
    if (localStorage.filtermod_shownLangs === undefined) {
        shownLangs = defaultLangs;
        saveLangs();
    }
    else {
        try {
            shownLangs = JSON.parse(localStorage.filtermod_shownLangs);
        }
        catch(_) {
            shownLangs = defaultLangs;
        }
        if (!Array.isArray(shownLangs)) {
            shownLangs = defaultLangs;
        }
    }
    addLang(selectedLang());
};

var saveLangs = function() {
    localStorage.filtermod_shownLangs = JSON.stringify(shownLangs);
};

var addLang = function(lang) {
    if (lang === undefined || lang === null) {
        return;
    }
    if (!isShownLang(lang)) {
        shownLangs.push(lang);
    }
    saveLangs();
};

var removeLang = function(lang) {
    var index = shownLangs.indexOf(lang);
    if (index != -1) {
        shownLangs.splice(index, 1);
    }
    saveLangs();
};

loadLangs();

var settingsButton = jQuery('<img>')
    .attr('src', settingsIcon)
    .css({
        'width': '18px',
        'height': '18px',
        'float': 'right',
        'cursor': 'pointer'
    });

var exitButton = jQuery('<button>Eliri</button>')
    .css({
        'display': 'block',
        'margin-bottom': '0.25rem'
    });

var settings = jQuery('<div></div>')
    .css({
        'height': '15em',
        'overflow': 'auto',
        'margin-left': '0.25rem',
        'margin-top': '0.25rem'
    })
    .hide()
    .append(exitButton);

var vortaro = jQuery('body > *');

// Inject elements
jQuery('p').first().append(settingsButton);
jQuery('body').append(settings);

// Set up buttons
settingsButton.click(function() {
    vortaro.hide();
    settings.show();
});

exitButton.click(function() {
    settings.hide();
    vortaro.show();
});

// Inject settings page

var getLang = function(langdef) {
    var langs = langdef.split('--');
    if (langs[0] == 'eo') {
        return langs[1];
    }
    else {
        return langs[0];
    }
};

var skipArg = function(cb) {
    return function() {
        var args = jQuery(arguments).slice(1);
        return cb.apply(this, args);
    };
};

var optionToLang = function(option) {
    return getLang(option.value);
};

var isShownLangOption = function(option) {
    return isShownLang(optionToLang(option));
};

var availableOptions = jQuery(langOptionsSelector);

var refreshOptions = function() {
    jQuery('#ElektiLingvon').html('');
    availableOptions.each(function(_, option) {
        if (isShownLang(option.value)) {
            jQuery('#ElektiLingvon').append(option);
        }
    });
    jQuery('#ElektiLingvon').val(selectedLang());
};

refreshOptions();

availableOptions.each(function(_, el) {
    var label = jQuery('<label>'+jQuery(el).text()+'</label>');
    var checkbox = jQuery('<input type="checkbox">');
    
    if (isShownLang(el.value)) {
        checkbox.attr('checked', true);
    }
    
    if (selectedLang() == el.value) {
        checkbox.prop('disabled', true);
    }
    
    // Disable checkbox if its language is selected
    jQuery('#ElektiLingvon').change(function(event) {
        if (el.value == jQuery(event.target).val()) {
            checkbox.prop('disabled', true);
        }
        else {
            checkbox.prop('disabled', false);
        }
    });
    
    label.prepend(checkbox);
    settings
        .append(label)
        .append('<br>');
    
    // Add/Remove languages on click
    checkbox.click(function() {
        if (this.checked) {
            addLang(el.value);
        }
        else {
            removeLang(el.value);
        }
        refreshOptions();
    });
});