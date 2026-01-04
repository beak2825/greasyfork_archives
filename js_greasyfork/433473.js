// ==UserScript==
// @name 			TaoBao Spreadsheet Easy Paster
// @author			AColdWall + Figgie
// @description		Easily paste your reps into a spreadsheet
// @version			0.0.5
// @date			10/5/2021
// @include			/^https?:\/\/((?:item|2)\.taobao|detail\.tmall)\.com\/(item|meal_detail)\.htm\?/
// @include			/^https?:\/\/world.(?:taobao|tmall).com/item/\d+.htm/

// @include			http://ai.taobao.com/auction/edetail.htm?*
// @include			http://re.taobao.com/eauction?*
// @include			http://h5.m.taobao.com/*/detail.htm?*
// @include			http://buy.taobao.com/auction/buy_now.jhtml
// @include			http://hi.taobao.com/market/hi/detail2014.php?*
// @include			http://baoxian.taobao.com/item.htm?*


// @icon			http://www.taobao.com/favicon.ico
// @run-at			document-idle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant            GM_registerMenuCommand
// @namespace https://greasyfork.org/users/173948
// @downloadURL https://update.greasyfork.org/scripts/433473/TaoBao%20Spreadsheet%20Easy%20Paster.user.js
// @updateURL https://update.greasyfork.org/scripts/433473/TaoBao%20Spreadsheet%20Easy%20Paster.meta.js
// ==/UserScript==


var msgFlag=false;
var aiTaobaoJump=true;
var urls=location.href;
var search=location.search;
var page=location.pathname;
var host=location.hostname.toLowerCase();
var oTitle=document.title=document.title.replace(/-tmall.com天猫$/,'').replace(/-淘宝网$/,'');	//网页标题

function MonkeyConfig() {
    var cfg = this,
        /* Data object passed to the constructor */
        data,
        /* Configuration parameters (data.parameters or data.params) */
        params,
        /* Current values of configuration parameters */
        values = {},
        /* Identifier used to store/retrieve configuration */
        storageKey,
        /* Is the configuration dialog displayed? */
        displayed,
        /* Currently displayed window/layer */
        openWin, openLayer,
        /* DOM element wrapping the configuration form */
        container,
        /* Darkened overlay used in the layer display mode */
        overlay;

    /**
     * Initialize configuration
     *
     * @param newData New data object
     */
    function init(newData) {
        data = newData;

        if (data) {
            params = data.parameters || data.params;

if (data.buttons === undefined)
                /* Set default buttons */
                data.buttons = [ 'save', 'defaults', 'cancel' ];

            if (data.title === undefined)
                /*
                 * If GM_getMetadata is available, get the name of the script
                 * and use it in the dialog title
                 */
                if (typeof GM_getMetadata == 'function') {
                    var scriptName = GM_getMetadata('name');
                    data.title = scriptName + ' Configuration';
                }
                else
                    data.title = 'Configuration';
        }

        /* Make a safe version of title to be used as stored value identifier */
        var safeTitle = data && data.title ?
                data.title.replace(/[^a-zA-Z0-9]/g, '_') : '';

        storageKey = '_MonkeyConfig_' + safeTitle + '_cfg';

        var storedValues;

        /* Load stored values (if present) */
        if (GM_getValue(storageKey))
            storedValues = JSON.parse(GM_getValue(storageKey));

        for (var name in params) {
            /* If there's a value defined in the passed data object, use it */
            if (params[name]['value'] !== undefined)
                set(name, params[name].value);
            /* Check if there's a stored value for this parameter */
            else if (storedValues && storedValues[name] !== undefined)
                set(name, storedValues[name]);
            /* Otherwise, set the default value (if defined) */
            else if (params[name]['default'] !== undefined)
                set(name, params[name]['default']);
            else
                set(name, '');
        }

        if (data.menuCommand) {
            /* Add an item to the User Script Commands menu */
            var caption = data.menuCommand !== true ? data.menuCommand :
                data.title;

            GM_registerMenuCommand(caption, function () { cfg.open(); });
        }

        /* Expose public methods */
        cfg.open = open;
        cfg.close = close;
        cfg.get = get;
        cfg.set = function (name, value) {
            set(name, value);
            update();
        };
    }

    /**
     * Get the value of a configuration parameter
     *
     * @param name Name of the configuration parameter
     * @returns Value of the configuration parameter
     */
    function get(name) {
        return values[name];
    }

    /**
     * Set the value of a configuration parameter
     *
     * @param name Name of the configuration parameter
     * @param value New value of the configuration parameter
     */
    function set(name, value) {
        values[name] = value;
    }

    /**
     * Reset configuration parameters to default values
     */
    function setDefaults() {
        for (var name in params) {
            if (typeof params[name]['default'] !== 'undefined') {
                set(name, params[name]['default']);
            }
        }
    }

    /**
     * Render the configuration dialog
     */
    function render() {
        var html = '<div class="__MonkeyConfig_container">' +
            '<h1>' + data.title + '</h1>' +
            '<table>';

        for (var name in params) {
            html += MonkeyConfig.formatters['tr'](name, params[name]);}

        html += '<tr><td colspan="2" class="__MonkeyConfig_buttons">' +
                '<table><tr>';

        /* Render buttons */
        for (var button in data.buttons) {
            html += '<td>';

            switch (data.buttons[button]) {
            case 'cancel':
                html += '<button type="button" ' +
                    'id="__MonkeyConfig_button_cancel">' +
                    '<img src="data:image/png;base64,' +
                        MonkeyConfig.res.icons.cancel + '" />&nbsp;' +
                    'Cancel</button>';
                break;
            case 'defaults':
                html += '<button type="button" ' +
                    'id="__MonkeyConfig_button_defaults">' +
                    '<img src="data:image/png;base64,' +
                        MonkeyConfig.res.icons.arrow_undo + '" />&nbsp;' +
                    'Set&nbsp;Defaults</button>';
                break;
            case 'save':
                html += '<button type="button" ' +
                    'id="__MonkeyConfig_button_save">' +
                    '<img src="data:image/png;base64,' +
                        MonkeyConfig.res.icons.tick + '" />&nbsp;' +
                    'Save</button>';
                break;
            }

            html += '</td>';
        }

        html += '</tr></table></td></tr>';

        html += "</table><div>";

        return html;
    }

    /**
     * Update the fields in the dialog to reflect current values
     */
    function update() {
        /* Do nothing if the dialog is not currently displayed */
        if (!displayed)
            return;

        for (var name in params) {
            var value = values[name];

            switch (params[name].type) {
            case 'checkbox':
                var elem = container.querySelector('[name="' + name + '"]');
                elem.checked = !!value;
                break;
            case 'custom':
                params[name].set(value, container
                        .querySelector('#__MonkeyConfig_parent_' + name));
                break;
            case 'number': case 'text':
                var elem = container.querySelector('[name="' + name + '"]');
                elem.value = value;
                break;
            case 'select':
                var elem = container.querySelector('[name="' + name + '"]');

                if (elem.tagName.toLowerCase() == 'input') {
                    if (elem.type && elem.type == 'radio') {
                        /* Single selection with radio buttons */
                        elem = container.querySelector(
                            '[name="' + name + '"][value="' + value + '"]');
                        elem.checked = true;
                    }
                    else if (elem.type && elem.type == 'checkbox') {
                        /* Multiple selection with checkboxes */
                        var checkboxes = container.querySelectorAll(
                            'input[name="' + name + '"]');

                        for (var i = 0; i < checkboxes.length; i++)
                            checkboxes[i].checked =
                                (value.indexOf(checkboxes[i].value) > -1);
                    }
                }
                else if (elem.tagName.toLowerCase() == 'select')
                    if (elem.multiple) {
                        /* Multiple selection element */
                        var options = container.querySelectorAll(
                            'select[name="' + name + '"] option');

                        for (var i = 0; i < options.length; i++)
                            options[i].selected =
                                (value.indexOf(options[i].value) > -1);
                    }
                    else
                        /* Single selection element */
                        elem.value = value;
                break;
            }
        }
    }

    /**
     * Save button click event handler
     */
    function saveClick() {
        for (name in params) {
            switch (params[name].type) {
            case 'checkbox':
                var elem = container.querySelector('[name="' + name + '"]');
                values[name] = elem.checked;
                break;
            case 'custom':
                values[name] = params[name].get(container
                        .querySelector('#__MonkeyConfig_parent_' + name));
                break;
            case 'number': case 'text':
                var elem = container.querySelector('[name="' + name + '"]');
                values[name] = elem.value;
                break;
            case 'select':
                var elem = container.querySelector('[name="' + name + '"]');

                if (elem.tagName.toLowerCase() == 'input') {
                    if (elem.type && elem.type == 'radio')
                        /* Single selection with radio buttons */
                        values[name] = container.querySelector(
                            '[name="' + name + '"]:checked').value;
                    else if (elem.type && elem.type == 'checkbox') {
                        /* Multiple selection with checkboxes */
                        values[name] = [];
                        var inputs = container.querySelectorAll(
                            'input[name="' + name + '"]');

                        for (var i = 0; i < inputs.length; i++)
                            if (inputs[i].checked)
                                values[name].push(inputs[i].value);
                    }
                }
                else if (elem.tagName.toLowerCase() == 'select' && elem.multiple) {
                    /* Multiple selection element */
                    values[name] = [];
                    var options = container.querySelectorAll(
                        'select[name="' + name + '"] option');

                    for (var i = 0; i < options.length; i++)
                        if (options[i].selected)
                            values[name].push(options[i].value);
                }
                else
                    values[name] = elem.value;
                break;
            }
        }

        GM_setValue(storageKey, JSON.stringify(values));

        close();

        if (data.onSave)
            data.onSave(values);
    }

    /**
     * Cancel button click event handler
     */
    function cancelClick() {
        close();
    }

    /**
     * Set Defaults button click event handler
     */
    function defaultsClick() {
        setDefaults();
        update();
    }

    /**
     * Open configuration dialog
     *
     * @param mode
     *            Display mode ("iframe", "layer", or "window", defaults to
     *            "iframe")
     * @param options
     *            Display mode options
     */
    function open(mode, options) {
        function openDone() {
            /* Attach button event handlers */
            var button;

            if (button = container.querySelector('#__MonkeyConfig_button_save'))
                button.addEventListener('click', saveClick, true);
            if (button = container.querySelector('#__MonkeyConfig_button_cancel'))
                button.addEventListener('click', cancelClick, true);
            if (button = container.querySelector('#__MonkeyConfig_button_defaults'))
                button.addEventListener('click', defaultsClick, true);

            displayed = true;
            update();
        }

        switch (mode) {
        case 'window':
            var windowFeatures = {
                location: 'no',
                status: 'no',
                left: window.screenX,
                top: window.screenY,
                width: 100,
                height: 100
            };

            /* Additional features may be specified as an option */
            if (options && options.windowFeatures)
                for (var name in options.windowFeatures)
                    windowFeatures[name] = options.windowFeatures[name];

            var featuresArray = [];

            for (var name in windowFeatures)
                featuresArray.push(name + '=' + windowFeatures[name]);

            var win = window.open('', data.title, featuresArray.join(','));

            /* Find head and body (then call the blood spatter analyst) */
            var head = win.document.getElementsByTagName('head')[0],
                body = win.document.getElementsByTagName('body')[0];

            head.innerHTML = '<title>' + data.title + '</title>' +
                '<style type="text/css">' +
                MonkeyConfig.res.stylesheets.main + '</style>';

            body.className = '__MonkeyConfig_window';
            /* Place the rendered configuration dialog inside the window body */
            body.innerHTML = render();

            /* Find the container (CBAN-3489) */
            container = win.document.querySelector('.__MonkeyConfig_container');

            /* Resize window to the dimensions of the container div */
            win.innerWidth = container.clientWidth;
            win.resizeBy(0, -win.innerHeight + container.clientHeight);

            /* Place the window centered relative to the parent */
            win.moveBy(Math.round((window.outerWidth - win.outerWidth) / 2),
                Math.round((window.outerHeight - win.outerHeight) / 2));

            openWin = win;

            openDone();

            break;
        case 'layer':
            if (!MonkeyConfig.styleAdded) {
                GM_addStyle(MonkeyConfig.res.stylesheets.main);
                MonkeyConfig.styleAdded = true;
            }

            var body = document.querySelector('body');

            /* Create the layer element */
            openLayer = document.createElement('div');
            openLayer.className = '__MonkeyConfig_layer';

            /* Create the overlay */
            overlay = document.createElement('div');
            overlay.className = '__MonkeyConfig_overlay';
            overlay.style.left = 0;
            overlay.style.top = 0;
            overlay.style.width = window.innerWidth + 'px';
            overlay.style.height = window.innerHeight + 'px';
            overlay.style.zIndex = 9999;

            body.appendChild(overlay);
            body.appendChild(openLayer);

            /*
             * Place the rendered configuration dialog inside the layer element
             */
            openLayer.innerHTML = render();

            /* Position the layer in the center of the viewport */
            openLayer.style.left = Math.round((window.innerWidth -
                    openLayer.clientWidth) / 2) + 'px';
            openLayer.style.top = Math.round((window.innerHeight -
                    openLayer.clientHeight) / 2) + 'px';
            openLayer.style.zIndex = 9999;

            container = document.querySelector('.__MonkeyConfig_container');

            openDone();

            break;
        case 'iframe':
        default:
            if (!MonkeyConfig.styleAdded) {
                GM_addStyle(MonkeyConfig.res.stylesheets.main);
                MonkeyConfig.styleAdded = true;
            }

            var body = document.querySelector('body');
            var iframe = document.createElement('iframe');

            /* Create the layer element */
            openLayer = document.createElement('div');
            openLayer.className = '__MonkeyConfig_layer';

            /* Create the overlay */
            overlay = document.createElement('div');
            overlay.className = '__MonkeyConfig_overlay';
            overlay.style.left = 0;
            overlay.style.top = 0;
            overlay.style.width = window.innerWidth + 'px';
            overlay.style.height = window.innerHeight + 'px';
            overlay.style.zIndex = 9999;

            iframe.id = '__MonkeyConfig_frame';
            /*
             * Make the iframe transparent so that it remains invisible until
             * the document inside it is ready
             */
            iframe.style.opacity = 0;
            iframe.src = 'about:blank';

            /* Make the iframe seamless with no border and no scrollbars */
            if (undefined !== iframe.frameborder)
                iframe.frameBorder = '0';
            if (undefined !== iframe.scrolling)
                iframe.scrolling = 'no';
            if (undefined !== iframe.seamless)
                iframe.seamless = true;

            /* Do the rest in the load event handler */
            iframe.addEventListener('load', function () {
                iframe.contentDocument.body.innerHTML = render();
                iframe.style.opacity = 1;

                /* Append the style to the head */
                var head = iframe.contentDocument.querySelector('head'),
                    style = iframe.contentDocument.createElement('style');
                style.setAttribute('type', 'text/css');
                style.appendChild(iframe.contentDocument.createTextNode(
                        MonkeyConfig.res.stylesheets.main));
                head.appendChild(style);

                var body = iframe.contentDocument.querySelector('body');
                body.className = '__MonkeyConfig_body';

                container = iframe.contentDocument
                    .querySelector('.__MonkeyConfig_container');

                iframe.width = container.clientWidth;
                iframe.height = container.clientHeight;

                /* Position the layer in the center of the viewport */
                openLayer.style.left = Math.round((window.innerWidth -
                        openLayer.clientWidth) / 2) + 'px';
                openLayer.style.top = Math.round((window.innerHeight -
                        openLayer.clientHeight) / 2) + 'px';
                openLayer.style.zIndex = 9999;

                openDone();
            }, false);

            setTimeout(function () {
                iframe.width = container.clientWidth;
                iframe.height = container.clientHeight;

                /* Position the layer in the center of the viewport */
                openLayer.style.left = Math.round((window.innerWidth -
                        openLayer.clientWidth) / 2) + 'px';
                openLayer.style.top = Math.round((window.innerHeight -
                        openLayer.clientHeight) / 2) + 'px';
                openLayer.style.zIndex = 9999;
            }, 0);

            body.appendChild(overlay);
            body.appendChild(openLayer);
            openLayer.appendChild(iframe);

            break;
        }
    }

    /**
     * Close configuration dialog
     */
    function close() {
        if (openWin) {
            openWin.close();
            openWin = undefined;
        }
        else if (openLayer) {
            openLayer.parentNode.removeChild(openLayer);
            openLayer = undefined;

            if (overlay) {
                overlay.parentNode.removeChild(overlay);
                overlay = undefined;
            }
        }

        displayed = false;
    }

    init(arguments[0]);
}

/**
 * Replace double quotes with entities so that the string can be safely used
 * in a HTML attribute
 *
 * @param string A string
 * @returns String with double quotes replaced with entities
 */
MonkeyConfig.esc = function (string) {
    return string.replace(/"/g, '&quot;');
};

MonkeyConfig.HTML = {
    '_field': function (name, options, data) {
        var html;

        if (options.type && MonkeyConfig.HTML[options.type])
            html = MonkeyConfig.HTML[options.type](name, options, data);
        else
            return;

        if (/\[FIELD\]/.test(options.html)) {
            html = options.html.replace(/\[FIELD\]/, html);
        }

        return html;
    },
    '_label': function (name, options, data) {
        var label = options['label'] ||
            name.substring(0, 1).toUpperCase() + name.substring(1)
                .replace(/_/g, '&nbsp;');

        return '<label for="__MonkeyConfig_field_' + name + '">' + label +
            '</label>';
    },
    'checkbox': function (name, options, data) {
        return '<input id="__MonkeyConfig_field_' + name +
            '" type="checkbox" name="' + name + '" />';
    },
    'custom': function (name, options, data) {
        return options.html;
    },
    'number': function (name, options, data) {
        return '<input id="__MonkeyConfig_field_' + name + '" ' +
            'type="text" class="__MonkeyConfig_field_number" ' +
            'name="' + name + '" />';
    },
    'select': function (name, options, data) {
        var choices = {}, html = '';

        if (options.choices.constructor == Array) {
            /* options.choices is an array -- build key/value pairs */
            for (var i = 0; i < options.choices.length; i++)
                choices[options.choices[i]] = options.choices[i];
        }
        else
            /* options.choices is an object -- use it as it is */
            choices = options.choices;

        if (!options.multiple) {
            /* Single selection */
            if (!/^radio/.test(options.variant)) {
                /* Select element */
                html += '<select id="__MonkeyConfig_field_' + name + '" ' +
                    'class="__MonkeyConfig_field_select" ' +
                    'name="' + name + '">';

                for (var value in choices)
                    html += '<option value="' + MonkeyConfig.esc(value) + '">' +
                        choices[value] + '</option>';

                html += '</select>';
            }
            else {
                /* Radio buttons */
                for (var value in choices) {
                    html += '<label><input type="radio" name="' + name + '" ' +
                        'value="' + MonkeyConfig.esc(value) + '" />&nbsp;' +
                        choices[value] + '</label>' +
                        (/ column/.test(options.variant) ? '<br />' : '');
                }
            }
        }
        else {
            /* Multiple selection */
            if (!/^checkbox/.test(options.variant)) {
                /* Checkboxes */
                html += '<select id="__MonkeyConfig_field_' + name + '" ' +
                    'class="__MonkeyConfig_field_select" ' +
                    'multiple="multiple" ' +
                    'name="' + name + '">';

                for (var value in choices)
                    html += '<option value="' + MonkeyConfig.esc(value) + '">' +
                        choices[value] + '</option>';

                html += '</select>';
            }
            else {
                /* Select element */
                for (var value in choices) {
                    html += '<label><input type="checkbox" ' +
                        'name="' + name + '" ' +
                        'value="' + MonkeyConfig.esc(value) + '" />&nbsp;' +
                        choices[value] + '</label>' +
                        (/ column/.test(options.variant) ? '<br />' : '');
                }
            }
        }

        return html;
    },
    'text': function (name, options, data) {
        if (options.long)
            return '<textarea id="__MonkeyConfig_field_' + name + '" ' +
                'class="__MonkeyConfig_field_text" ' +
                (!isNaN(options.long) ? 'rows="' + options.long + '" ' : '') +
                'name="' + name + '"></textarea>';
        else
            return '<input id="__MonkeyConfig_field_' + name + '" ' +
                'type="text" class="__MonkeyConfig_field_text" ' +
                'name="' + name + '" />';
    }
};

MonkeyConfig.formatters = {
    'tr': function (name, options, data) {
        var html = '<tr>';

        switch (options.type) {
        case 'checkbox':
            /* Checkboxes get special treatment */
            html += '<td id="__MonkeyConfig_parent_' + name + '" colspan="2">';
            html += MonkeyConfig.HTML['_field'](name, options, data) + ' ';
            html += MonkeyConfig.HTML['_label'](name, options, data);
            html += '</td>';
            break;
        default:
            html += '<td>';
            html += MonkeyConfig.HTML['_label'](name, options, data);
            html += '</td><td id="__MonkeyConfig_parent_' + name + '">';
            html += MonkeyConfig.HTML['_field'](name, options, data);
            html += '</td>';
            break;
        }

        html += '</tr>';

        return html;
    }
};

/* Has the stylesheet been added? */
MonkeyConfig.styleAdded = false;

/* Resources */
MonkeyConfig.res = {};

/* Icons */
MonkeyConfig.res.icons = {
    'arrow_undo': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0\
U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIJSURBVDjLpVM9aJNRFD35GsRSoUKKzQ/B\
0NJJF3EQlKrVgijSCBmC4NBFKihIcXBwEZdSHVoUwUInFUEkQ1DQ4CKiFsQsTrb5xNpgaZHw2Uog\
5t5zn0NJNFaw0guX97hwzuPcc17IOYfNlIdNVrhxufR6xJkZjAbSQGXjNAorqixSWFDV3KPhJ+UG\
LtSQMPryrDscPwLnAHOEOQc6gkbUpIagGmApWIb/pZRX4fjj889nWiSQtgYyBZ1BTUEj6AjPa0P7\
1nb0Jfqwa+futIheHrzRn2yRQCUK/lOQhApBJVQJChHfnkCqOwWEQ+iORJHckUyX5ksvAEyGNuJC\
+s6xCRXNHNxzKMmQ4luwgjfvZp69uvr2+IZcyJ8rjIporrxURggetnV0QET3rrPxzMNM2+n7p678\
jUTrCiWhphAjVHR9DlR0WkSzf4IHxg5MSF0zXZEuVKWKSlCBCostS8zeG7oV64wPqxInbw86lbVX\
KEQ8mkAqmUJ4SxieeVhcnANFC02C7N2h69HO2IXeWC8MDj2JnqaFNAMd8f3HKjx6+LxQRmnOz1OZ\
axKIaF1VISYwB9ARZoQaYY6o1WpYCVYxt+zDn/XzVBv/MOWXW5J44ubRyVgkelFpmF/4BJVfOVDl\
VyqLVBZI5manPjajDOdcswfG9k/3X9v3/vfZv7rFBanriIo++J/f+BMT+YWS6hXl7QAAAABJRU5E\
rkJggg==',
    'cancel': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0\
U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHdSURBVDjLpZNraxpBFIb3a0ggISmmNISW\
XmOboKihxpgUNGWNSpvaS6RpKL3Ry//Mh1wgf6PElaCyzq67O09nVjdVlJbSDy8Lw77PmfecMwZg\
/I/GDw3DCo8HCkZl/RlgGA0e3Yfv7+DbAfLrW+SXOvLTG+SHV/gPbuMZRnsyIDL/OASziMxkkKkU\
QTJJsLaGn8/iHz6nd+8mQv87Ahg2H9Th/BxZqxEkEgSrq/iVCvLsDK9awtvfxb2zjD2ARID+lVVl\
babTgWYTv1rFL5fBUtHbbeTJCb3EQ3ovCnRC6xAgzJtOE+ztheYIEkqbFaS3vY2zuIj77AmtYYDu\
sPy8/zuvunJkDKXM7tYWTiyGWFjAqeQnAD6+7ueNx/FLpRGAru7mcoj5ebqzszil7DggeF/DX1nB\
N82rzPqrzbRayIsLhJqMPT2N83Sdy2GApwFqRN7jFPL0tF+10cDd3MTZ2AjNUkGCoyO6y9cRxfQo\
wFUbpufr1ct4ZoHg+Dg067zduTmEbq4yi/UkYidDe+kaTcP4ObJIajksPd/eyx3c+N2rvPbMDPbU\
FPZSLKzcGjKPrbJaDsu+dQO3msfZzeGY2TCvKGYQhdSYeeJjUt21dIcjXQ7U7Kv599f4j/oF55W4\
g/2e3b8AAAAASUVORK5CYII=',
    'tick': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0\
U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGrSURBVDjLvZPZLkNhFIV75zjvYm7VGFNC\
qoZUJ+roKUUpjRuqp61Wq0NKDMelGGqOxBSUIBKXWtWGZxAvobr8lWjChRgSF//dv9be+9trCwAI\
/vIE/26gXmviW5bqnb8yUK028qZjPfoPWEj4Ku5HBspgAz941IXZeze8N1bottSo8BTZviVWrEh5\
46EO03EXpuJOdG63otJbjBKHkEp/Ml6yNYYzpuezWL4s5VMtT8acCMQcb5XL3eJE8VgBlR7BeMGW\
9Z4yT9y1CeyucuhdTGDxfftaBO7G4L+zg91UocxVmCiy51NpiP3n2treUPujL8xhOjYOzZYsQWAN\
yRYlU4Y9Br6oHd5bDh0bCpSOixJiWx71YY09J5pM/WEbzFcDmHvwwBu2wnikg+lEj4mwBe5bC5h1\
OUqcwpdC60dxegRmR06TyjCF9G9z+qM2uCJmuMJmaNZaUrCSIi6X+jJIBBYtW5Cge7cd7sgoHDfD\
aAvKQGAlRZYc6ltJlMxX03UzlaRlBdQrzSCwksLRbOpHUSb7pcsnxCCwngvM2Rm/ugUCi84fycr4\
l2t8Bb6iqTxSCgNIAAAAAElFTkSuQmCC'
};

/* Stylesheets */
MonkeyConfig.res.stylesheets = {
    'main': '\
body.__MonkeyConfig_window {\
    appearance: window !important;\
    -moz-appearance: window !important;\
    background: auto;\
    font-family: sans-serif !important;\
    height: 100% !important;\
    margin: 0 !important;\
    padding: 0 !important;\
    width: 100% !important;\
}\
\
div.__MonkeyConfig_container {\
    display: table !important;\
    font-family: sans-serif !important;\
    padding: 0.3em !important;\
}\
\
body.__MonkeyConfig_window div.__MonkeyConfig_container {\
    appearance: window !important;\
    -moz-appearance: window !important;\
    height: 100%;\
    width: 100%;\
}\
\
div.__MonkeyConfig_container h1 {\
    border-bottom: solid 1px #999 !important;\
    font-family: sans-serif !important;\
    font-size: 120% !important;\
    margin: 0 !important;\
    padding: 0 0 0.3em 0 !important;\
}\
\
div.__MonkeyConfig_container table {\
    border-spacing: 0 !important;\
    margin: 0 !important;\
}\
\
div.__MonkeyConfig_container table td {\
    border: none !important;\
    line-height: 100% !important;\
    padding: 0.3em !important;\
    text-align: left !important;\
    vertical-align: top !important;\
    white-space: nowrap !important;\
}\
\
div.__MonkeyConfig_container table td.__MonkeyConfig_buttons {\
    padding: 0.2em 0 !important;\
}\
\
.__MonkeyConfig_field_number {\
    width: 5em !important;\
}\
\
div.__MonkeyConfig_container td.__MonkeyConfig_buttons table {\
    border-top: solid 1px #999 !important;\
    width: 100% !important;\
}\
\
div.__MonkeyConfig_container td.__MonkeyConfig_buttons td {\
    padding: 0.6em 0.3em 0.1em 0.3em !important;\
    text-align: center !important;\
    vertical-align: top;\
}\
\
div.__MonkeyConfig_container td.__MonkeyConfig_buttons button {\
    appearance: button !important;\
    -moz-appearance: button !important;\
    background-position: 8px 50% !important;\
    background-repeat: no-repeat !important;\
    padding: 3px 8px 3px 24px !important;\
    padding: 3px 8px !important;\
    white-space: nowrap !important;\
}\
\
div.__MonkeyConfig_container td.__MonkeyConfig_buttons button img {\
    vertical-align: middle !important;\
}\
\
div.__MonkeyConfig_layer {\
    display: table !important;\
    position: fixed !important;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container,\
body.__MonkeyConfig_body > div.__MonkeyConfig_container {\
    background: #eee linear-gradient(180deg,\
        #f8f8f8 0, #ddd 100%) !important;\
    border-radius: 0.5em !important;\
    box-shadow: 2px 2px 16px #000 !important;\
    color: #000 !important;\
    font-family: sans-serif !important;\
    font-size: 11pt !important;\
    padding: 1em 1em 0.4em 1em !important;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container td,\
div.__MonkeyConfig_layer div.__MonkeyConfig_container label,\
div.__MonkeyConfig_layer div.__MonkeyConfig_container input,\
div.__MonkeyConfig_layer div.__MonkeyConfig_container select,\
div.__MonkeyConfig_layer div.__MonkeyConfig_container textarea,\
div.__MonkeyConfig_layer div.__MonkeyConfig_container button {\
    color: #000 !important;\
    font-family: sans-serif !important;\
    font-size: 11pt !important;\
    line-height: 100% !important;\
    margin: 0 !important;\
    vertical-align: baseline !important;\
}\
\
div.__MonkeyConfig_container label {\
    line-height: 120% !important;\
    vertical-align: baseline !important;\
}\
\
div.__MonkeyConfig_container textarea {\
    vertical-align: text-top !important;\
    width: 100%;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container input[type="text"] {\
    appearance: textfield !important;\
    -moz-appearance: textfield !important;\
    background: #fff !important;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container h1 {\
    font-weight: bold !important;\
    text-align: left !important;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container td.__MonkeyConfig_buttons button,\
body > div.__MonkeyConfig_container td.__MonkeyConfig_buttons button {\
    appearance: button !important;\
    -moz-appearance: button !important;\
    background: #ccc linear-gradient(180deg,\
        #ddd 0, #ccc 45%, #bbb 50%, #aaa 100%) !important;\
    border-style: solid !important;\
    border-width: 1px !important;\
    border-radius: 0.5em !important;\
    box-shadow: 0 0 1px #000 !important;\
    color: #000 !important;\
    font-size: 11pt !important;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container td.__MonkeyConfig_buttons button:hover,\
body > div.__MonkeyConfig_container td.__MonkeyConfig_buttons button:hover {\
    background: #d2d2d2 linear-gradient(180deg,\
        #e2e2e2 0, #d2d2d2 45%, #c2c2c2 50%, #b2b2b2 100%) !important;\
}\
\
div.__MonkeyConfig_overlay {\
    background-color: #000 !important;\
    opacity: 0.6 !important;\
    position: fixed !important;\
}\
\
iframe#__MonkeyConfig_frame {\
    border: none !important;\
    box-shadow: 2px 2px 16px #000 !important;\
}\
\
body.__MonkeyConfig_body {\
    margin: 0 !important;\
    padding: 0 !important;\
}\
'
};

var cfg = new MonkeyConfig({
    title: 'Taobao Spreadsheet Easy Paster',
    menuCommand: false,
    params: {
        locale: {
            type: 'select',
            choices: [ 'US', 'EU' ],
            default: 'US',
            label:"Locale: Google docs uses ';' for EU and ',' for<br /> US locales, if you see errors, try switching this."
        },
        currency: {
            type: 'select',
            choices: [ "AED","ARS","AUD","BGN","BND","BOB","BRL","CAD","CHF","CLP","CNY","COP","CZK","DKK","EGP","EUR","FJD","GBP","HKD","HRK","HUF","IDR","ILS","INR","JPY","KES","KRW","LTL","MAD","MXN","MYR","NOK","NZD","PEN","PHP","PKR","PLN","RON","RSD","RUB","SAR","SEK","SGD","THB","TRY","TWD","UAH","USD","VEF","VND","ZAR" ],
            default: 'USD',
            label:"Currency."
        }
    },
    onSave:function(){location.reload();}
});

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

var PriceRead = {
	/*价格读取*/
	taobao : function(){
		var price=$('.tb-rmb-num')[0].textContent;				//淘宝商品价格
		if($("#J_PromoPrice").className!='tb-detail-price tb-clearfix tb-promo-price tb-hidden') {	//有促销信息
			msg('T');
			var PromoPrice=$('#J_PromoPriceNum')?$('#J_PromoPriceNum').textContent:$('.tb-rmb-num')[0].textContent;		//读取促销价格

			var subtitle=$('.tb-subtitle')[0]?$('.tb-subtitle')[0].textContent:null;			//淘宝标题下商品简述
			if(/拍下立?减[一二三四五六七八九十\d+][元块]?/.test(subtitle)) {
				msg('商品描述中有拍下减价信息');
				var info=subtitle.match(/拍下立?减([一二三四五六七八九十\d]+)[元块]?/i);
				var newPrice=convNum(info[1]);
				ChangeTitle([PromoPrice,"减价后："+Number(PromoPrice-newPrice),info[0]]);
			} else {
				msg('淘宝-直接显示商品促销价格');
				ChangeTitle(PromoPrice);
			}
		} else {
			msg('淘宝——无促销直接显示商品原价格');
			ChangeTitle(price);
		}
	},

	tmall : function(){//标题前加入价格
		if($('.tm-price')[0]||$('.tm-promo-type')[0]){//天猫价格信息
			var promo=$('.tm-promo-type').length!==0?$('.tm-promo-type')[0].textContent:"";//天猫促销信息(旧)
			var PromoPrice=$('#J_PromoPrice').getElementsByClassName('tm-price')[0]?$('#J_PromoPrice').getElementsByClassName('tm-price')[0].innerHTML:null;//天猫促销信息(新)
			var price=$('.tm-price')[0].textContent;//天猫商品价格
			//var price=promo.parentNode.getElementsByClassName('tm-price')[0];//天猫商品价格
			var minus=$('.tb-detail-hd')[0].children[1];//商品信息

			if(/[一二三四五六七八九十\d]+[块快][一二三四五六七八九十\d]*?/.test(promo)){//中文减价促销
				//msg(convNum(promo));
				msg("天猫-标题修改1");
				ChangeTitle(convNum(promo.match(/([一二三四五六七八九十\d])+[块快]([一二三四五六七八九十\d])+?/g)[0]));
			}
			else if(/拍下?[\d\.]+元?/i.test(promo))
			{
				msg("天猫-标题修改2");
				ChangeTitle(promo.match(/[\d\.]+/)[0]);
			}
			else if(/拍下立?减[一二三四五六七八九十\d+]元/.test(promo))
			{
				msg("天猫-标题修改3");
				ChangeTitle((price.match(/[\d\.]+/)[0]-Number(convNum(promo).match(/[\d\.]+/)[0])));
			}
			else if(/[一二三四五六七八九十两\d]+件[一二三四五六七八九十两\d]+/.test(promo))
			{
				msg("多件改价优惠");
				ChangeTitle([promo,PromoPrice]);
			}
			else if(/返现[一二三四五六七八九十两\d]+/.test(promo))
			{
				msg("返现提醒");
				ChangeTitle([promo,PromoPrice]);
			}
			else if(/拍下[^\d]*((自动|立)减价?)[\d\-\.]+元?(?!天)/.test(minus.textContent)&&minus.textContent.match(/拍下.*?(?:(?:自动|立)减)([\d\-\.]+)元?/)[1]!=price.replace(/0$/,''))
			{			//从商品信息中获取减价信息, 且促销信息中不存在减价信息
				msg("天猫-标题修改4");
				price=price.match(/[\d\.]+/)[0];
				minus=minus.textContent.match(/拍下.*?(?:(?:自动|立)减)?([\d\-\.]+)元?/)[1];
				//ChangeTitle(minus.innerHTML.match(/拍下.*?(?:(?:自动|立)减)?([\d\-\.]+)元?/)[1]);
				ChangeTitle(price-Number(minus)+"="+price+"-"+minus);
			}
			else if(/拍下[\d\-\.]+元?/.test(minus.innerHTML)&&minus.innerHTML.match(/拍下[\d\-\.]+元?/)[1]!=price.replace(/0$/,''))
			{	//从商品信息中获取促销价信息,
				msg("天猫-标题修改5");
				minus.innerHTML=minus.innerHTML.replace(/(拍下[\d\-\.]+元?)/,'<span style="color:red">$1</span>');
				minus=minus.innerHTML.match(/拍下([\d\-\.]+)元?/)[1];
				ChangeTitle(Number(minus));
			}
			else if(/拍下减价/.test(promo))
			{//减价情况
				msg("天猫-标题修改6");
				if(minus.innerHTML.search(/((?:拍下)?(自动|立)减)?[\d\-\.]+元/)>-1){ChangeTitle(minus.innerHTML.match(/(?:拍下)?(?:(?:自动|立)减)?([\d\-\.]+)元?/)[1])}
				if(minus.innerHTML.search(/[\d\.][元块]包邮/)>-1){ChangeTitle(minus.innerHTML.match(/([\d\.]+)[元块]包邮/)[1])}
			} else if(PromoPrice) {
				msg('天猫-有促销价');
				ChangeTitle(PromoPrice);
			} else {
				msg("天猫-商品原价格");
				ChangeTitle(price);//原商品价格
				//ChangeTitle(price.match(/[\d\.]+/)[0]);//天猫促销
			}
		}
	},

	baoxian : function(){
		var t=setInterval(function(){
			if($('#J_Price')){
				ChangeTitle($('#J_Price').textContent);
				clearInterval(t);
			}
		},500);
	},

	isArray : function(v){
		return toString.apply(v) === '[object Array]';
	}
}

function msg(texts){
	if(msgFlag){
		try{
			console.log(texts);
			//alert(texts);
		}catch(e){
			console.log(e.message);
			//alert(e.message);
		}
	}
}

function convNum(money){
	var cnNum=["零","一","二","三","四","五","六","七","八","九","块","快","0","1","2","3","4","5","6","7","8","9","十","两"];
	var Num=["0","1","2","3","4","5","6","7","8","9",".",".","0","1","2","3","4","5","6","7","8","9","10","2"];

	var RegExp=/([百十]|.*件)/;
	if(RegExp.test(money)){
		money=money.replace(RegExp,"");
	}
	for(j=0;j<cnNum.length;j++){
		for(i=0;i<money.length;i++){
			money=money.replace(cnNum[j],Num[j]);
		}
	}
	return Number(money);
}

(function(){
	switch(host){
		//URL过滤 + 价格标题
		case "item.taobao.com":	//去除商品页面地址的无用参数, 并在网页标题中添加商品价格
		case "detail.tmall.com":
			window.history.pushState('state', 'title', search="?"+getQueryString("ID",true)+getQueryString("skuId"));
			document.addEventListener('DOMContentLoaded',main);
			main();
			window.addEventListener('load',function(){
				$('#J_PromoPrice').getElementsByClassName('tm-promo-price')[0].innerHTML+='<a href="'+location.href.replace(host,host.replace(/(\w+\.)/i,'$1m.'))+'&mobile=true" target="_blank">手机淘宝</a>';
			});
			break;
		case "world.taobao.com":
		case "world.tmall.com":
			window.history.pushState('state', 'title', search="?"+getQueryString("ID",true)+getQueryString("skuId"));
			document.addEventListener('DOMContentLoaded',main);
			main();
			break;
		case "baoxian.taobao.com":
			if(page=='/item.htm') {
				window.history.pushState('state', 'title', search="?"+getQueryString("ID",true));
				PriceRead.baoxian();
			}
			break;
		//URL过滤
		case 'baron.laiwang.com':
			//来往分享页面跳转
			location.href=pageData.actionRule[0].url;
			break;
		case "hi.taobao.com":
			if(page=='/market/hi/detail2014.php'){
				window.history.pushState('state', 'title', search="?"+getQueryString("ID",true));
			}
			break;
		case "2.taobao.com":	//去除二手商品页面地址的无用参数
			window.history.pushState('state', 'title', search="?"+getQueryString("ID",true)+getQueryString("skuId"));
			break;
		case "ai.taobao.com":
			if(aiTaobaoJump) location.href="http://detail.tmall.com/item.htm?id="+pageconfig.itemId;
			break;
		case "re.taobao.com":
			IDstr=document.getElementById('sharePageInfo').value;
			JSON=eval('(' + IDstr + ')');//JSON字符串转换成JSON对象
			location.href="http://item.taobao.com/item.htm?id="+JSON.key;
			break;
		case "h5.m.taobao.com":
		case "detail.m.tmall.com":
		case "a.m.tmall.com":		//手机淘宝转电脑
			if(getQueryString("mobile",'val')!='true'){
				location.href="http://detail.tmall.com/item.htm?"+getQueryString("ID",true)+getQueryString("skuId");
			}
			break;
		case "detail.etao.com":		//一淘优惠购转回淘宝
			location.href="http://detail.tmall.com/item.htm?id="+getQueryString("ID",true)+getQueryString("skuId");
			break;
		case "img.taobaocdn.com":	//小图转大图
			location.href=urls.replace("_400x400.jpg",'');
			break;
		case 'buy.taobao.com':
			if(/\/buy_now.jhtml$/i.test(urls)){
				if(!document.getElementById('J_AnonBuy').checked){
					document.getElementById('J_AnonBuy').click();
				}
				var msg=$('.msgtosaler');
				for(i=0;i<msg.length;i++){
					msg[i].value="请务必包装好，发货前请检查货物无损，另请在运单注明货到电联本人，谢谢。";
					msg[i].click();
				}
			}
			break;
		case 'cashier.alipay.com':
			if(/\/standard\/gateway\/ebankDeposit.htm/i.test(urls)){
				if(!document.getElementById("J-paymentArgreement").checked){
					document.getElementById("J-paymentArgreement").click();
				}
			}
			break;
		case 'ka.tmall.com'://天猫点券签到
			document.getElementById('signTrigger').click();
			break;
		case 'www.etao.com':	//一掏签到
			(function(){
				var a=document.createElement('iframe');
				a.src="http://rebate.etao.com/my/index.htm";
				$('.etao-logo')[0].appendChild(a);
				setTimeout(document.getElementById('J_SignIn').click(),5000);
			})();
			break;
		default:
			if(/\w+.m.tmall.com/.test(host)&&/^http:\/\/(?!s\.|a\.|detail\.)\w+\.m.tmall.com/i.test(urls)){
				location.host=host.replace(/(?!\.)m\./,'');
			}
	}
})();

function main(){
	var t=setInterval(function(){
		if(host=='item.taobao.com'&&$('.tb-rmb-num')[0].textContent!==""){
			clearInterval(t);
			PriceRead.taobao();
			//$('.J_Prop')[0].addEventListener('click',PriceRead.taobao);	//监听套餐选择变化
			$('.tb-meta')[0].addEventListener('DOMSubtreeModified',PriceRead.taobao);	//监听价格变化
			//$('.tb-rmb-num')[0].addEventListener('DOMSubtreeModified',PriceRead.taobao);	//监听价格变化
		} else if(host=='detail.tmall.com'&&$('.tm-price')[0].textContent!==""){
			clearInterval(t);
			PriceRead.tmall();
			console.log("监听价格变化");
			$('.tm-fcs-panel')[0].addEventListener('DOMSubtreeModified',PriceRead.tmall);	//监听价格变化
		} else if(host=='world.taobao.com') {
			clearInterval(t);
			PriceRead.taobao();
			$('#J_PromoWrap').addEventListener('DOMSubtreeModified',PriceRead.taobao);
		} else if(host=='world.tmall.com') {
			clearInterval(t);
			PriceRead.tmall();
			$('.tm-fcs-panel')[0].addEventListener('DOMSubtreeModified',PriceRead.tmall);
		}
	},1000);
}


function ChangeTitle(title){
    var locale = cfg.get('locale');
    var currency = cfg.get('currency');
	title=title.replace(/[￥ ¥ ]/g,'');
    var ImageContainer = document.getElementById('imageCopy');
    var tbScriptSettings = document.getElementById('tbScriptSettings');
    var ImageRef = document.getElementById('J_ImgBooth');
    var ImageLink;
    if(tbScriptSettings == null){
       tbScriptSettings = document.createElement("a");
       tbScriptSettings.innerHTML = "Settings";
       tbScriptSettings.setAttribute("id","tbScriptSettings");
        var windowFeatures = {
                location: 'no',
                status: 'no',
                left: window.screenX,
                top: window.screenY,
                width: 500,
                height: 500
            };
       tbScriptSettings.onclick = function(){
           cfg.open("window",{windowFeatures:windowFeatures});
       };
       document.body.prepend(tbScriptSettings);
    }
    if(ImageRef !== null){
        ImageLink = ImageRef.getAttribute('src');
        if(ImageLink[0] == "/")ImageLink = "".concat("http:",ImageLink);
        if(locale == "US"){
             ImageLink = "".concat("=image(\"",ImageLink,"\",4,150,150)\t=GoogleTranslate(\"",oTitle,"\", \"zh-CN\",\"EN\")\t",window.location.href,"\t",title,"¥","\t=ROUND((GOOGLEFINANCE(\"CURRENCY:CNY",currency,"\")*",title,"),2)","\t=CHAR(10)&CHAR(10)&CHAR(10)&CHAR(10)&CHAR(10)");
        } else {
            ImageLink = "".concat("=image(\"",ImageLink,"\";4;150;150)\t=GoogleTranslate(\"",oTitle,"\"; \"zh-CN\";\"EN\")\t",window.location.href,"\t",title,"¥","\t=ROUND((GOOGLEFINANCE(\"CURRENCY:CNY",currency,"\")*",title,");2)","\t=CHAR(10)&CHAR(10)&CHAR(10)&CHAR(10)&CHAR(10)");
        }
        if(ImageContainer !== null){
            ImageContainer.setAttribute("value",ImageLink);
        } else {
            ImageContainer = document.createElement("input");
            ImageContainer.setAttribute("value",ImageLink);
            ImageContainer.setAttribute("id","imageCopy");
            ImageContainer.setAttribute("style","background-color:green");
            ImageContainer.setAttribute("id","imageCopy");
            ImageContainer.setAttribute("onclick","this.select();");
            document.body.prepend(ImageContainer);
        }
    }
}

function getQueryString(name,mode) {//筛选参数
	var reg = new RegExp("(?:^|&)(" + name + "=([^&]*))(?:&|$)", "i");		//正则筛选参数
	var value = search.substr(1).match(reg);
	if(mode=='val' && value !== null){
		return value[2];
	} else if(mode && value !== null){
		return unescape(value[1]);
	} else if(value !== null) {
		return "&"+name+"="+unescape(value[2]);
	}
	return "";
}

function $(obj) {//ID, Class选择器
	var objF=obj.replace(/^[#\.]/,'');
	return (/^#/.test(obj)) ? document.getElementById(objF) : (/^\./.test(obj)) ? document.getElementsByClassName(objF) : document.querySelectorAll(obj);
}

// load jQuery and execute the main function
addJQuery(main);