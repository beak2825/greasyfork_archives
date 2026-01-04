// ==UserScript==
// @name          Better Google Search
// @namespace     Better Google Search
// @match         https://www.google.com/search?*
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @version       1.7
// @author        kyosukyuu
// @description   Adds useful features for google searching. English support only. Tested on Brave Browser. Intended to work with light mode and dark mode. Doesn't work on mobile view.
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/437567/Better%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/437567/Better%20Google%20Search.meta.js
// ==/UserScript==

GM_addStyle (`
  .btns--container {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    width: 100%;
    left: 100%;
    top: 0;
    margin-left: 20px;
    z-index: 1;
    background: #202124;
    border-radius: 3px;
  }
  .btns--container-light {
    background: #fff;
  }
  .btn {
    margin-right: 8px;
    cursor: pointer;
  }
  .btn--container {
    position: relative;
    padding: 4px;
    margin: 0 6px;
    margin-bottom: 6px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  .btn--container-light {
    color: #70757a !important;
  }
  .btn--container:hover {
    color: #ddd
  }
  .btn--container-light:hover {
    color: #202124 !important;
  }
/*   .btn--container:hover .caret-dropdown {
    border-color: #ddd transparent;
  }
  .btn--container-light:hover .caret-dropdown {
    border-color: #202124 transparent !important;
  }
 */
  .btn--active {
    color: #e8eaed !important;
  }
  .btn--active-light {
    color: #202124;
  }
  .caret-dropdown--active {
    border-color: #ddd transparent !important;
  }

  .btn--caret::after{
    border-color: #9aa0a6 transparent;
    border-style: solid;
    border-width: 5px 4px 0 4px;
    width: 0;
    height: 0;
    margin-left: 2px;
    top: 13px;
    margin-top: -2px;
    position: absolute;
    right: 0;
    content: " "
  }
  .btn--caret:hover::after, .btn--caret:focus::after {
    border-color: #ddd transparent !important;
  }
  .btn--container:hover > .btn--caret::after {
    border-color: #ddd transparent !important;
  }
  .btn--container-light:hover > .btn--caret::after {
    border-color: #202124 transparent !important;
  }

/*   .caret-dropdown {
    border-color: #9aa0a6 transparent;
    border-style: solid;
    border-width: 5px 4px 0 4px;
    width: 0;
    height: 0;
    margin-left: 2px;
    top: 13px;
    margin-top: -2px;
    position: absolute;
    right: 0;
  } */

  .dropdown--container {
    z-index: 10;
    padding: 5px 0;
    border-radius: 8px;
    box-shadow: 1px 1px 15px 0px #171717;
    background-color: #202124;
    position: absolute;
    width: 100%;
    min-width: 100px;
    max-width: 105px;
    max-height: 200px;
    top: 25px;
    overflow: hidden;
    overflow-y: auto;
    list-style-type: none;
  }
  .dropdown--container-light {
    box-shadow: 0 2px 10px 0 rgb(0 0 0 / 20%);
    background-color: #fff;
  }
  .show {
    display: block !important;
  }
  .hide {
    display: none;
  }

  .dropdown--items {
    line-height: 16px;
    padding: 7px 8px;
    color: #bdc1c6;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: auto;
  }
  .dropdown--items-light {
    color: #5f6368;
  }
  .dropdown--items:hover, .dropdown--items:focus {
    background-color: rgba(255,255,255,0.1);
  }
  .dropdown--items-light:hover, .dropdown--items-light:focus{
    background-color: rgba(0,0,0,0.1) !important;
  }

  .flex-break {
    flex-basis: 100%;
    height: 0;
  }

  .__MonkeyConfig_overlay {
    width: 100% !important;
    height: 100% !important;
  }
  .__MonkeyConfig_layer {
    left: calc(50% - 165px) !important;
    top: calc(50% - 60.25px) !important;
    width: 330px;
    height: 120.50px;
  }
  #__MonkeyConfig_frame {
    width: 100%;
  }

  @media only screen and (max-width: 1450px) {
    .btns--container {
      flex-direction: column;
      max-width: 125px;
      box-shadow: 1px 1px 3px 2px #0000003b;
    }
    .dropdown--container {
      left: 117px;
      top: 0;
    }
  }
`);

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

(() => {
  "use strict"
  
  // SETTINGS
  const cfg = new MonkeyConfig({
    title: "Better Google Search Settings",
    menuCommand: true,
    params: {
      Bypass_CSP: {
        type: "checkbox",
        default: false,
      },
    }
  })
  
  const BYPASS_CSP = cfg.get("Bypass_CSP") || false
  
  // HELPERS
  const qSelect = (selector) => document.querySelector(selector)
  const qSelectAll = (selectors) => document.querySelectorAll(selectors)
  const qAllCallback = (selector, callback) => Array.from(qSelectAll(selector)).forEach((el, i) => callback(el, i))  
  
  let relativeParent = qSelect("input").parentElement.parentElement.parentElement.parentElement
  
  // check for theme
  const getDefaultTheme = () => {
    if (window?.matchMedia("(prefers-color-scheme: dark)").matches) return true
    return false
  }
  const isDark = getDefaultTheme()
  
  // bypass content-security-policy (CSP) to allow the script to work on google images
  // WARNING: this makes innerHTML vulnerable to injection
  if (window.trustedTypes?.createPolicy && BYPASS_CSP) {
    relativeParent = qSelect("input").parentElement.parentElement.parentElement
    window.trustedTypes.createPolicy("default", {
      createHTML: (string, sink) => string
    });
  }
  
  const FILE_TYPE = "FILE_TYPE"
  const EXCLUDE = "EXCLUDE"
  const SITE = "SITE"
  const EXACT_QUERY = "EXACT_QUERY"
  const TERM_APPEARS = "TERM_APPEARS"
  const BEFORE = "BEFORE"
  const AFTER = "AFTER"
  const DOMAIN = "DOMAIN"
  const SETTINGS = "SETTINGS"
  const LANGUAGE = "LANGUAGE"
  
  // contains all possible search actions you can perform
    const fileTypeData = {
      name: "File Type", action: FILE_TYPE, data: "filetype:", isUnique: true, 
      choices: [
        {name: "PDF", data: "pdf"}, 
        {name: "DOC", data: "doc"}, 
        {name: "DOCX", data: "docx"}, 
        {name: "TXT", data: "txt"}, 
        {name: "LOG", data: "log"}, 
        {name: "PPT", data: "ppt"}, 
        {name: "PPTX", data: "pptx"}, 
        {name: "XML", data: "xml"}, 
        {name: "TORRENT", data: "torrent"},
        {name: "RTF", data: "rtf"}
      ]
    }
    const excludeData = {
      name: "Exclude", action: EXCLUDE, data: "-", isUnique: false, urlBased: false,
    }
    const siteData = {
      name: "Site", action: SITE, data: "site:", isUnique: true, urlBased: false,
      choices: [
        {name: "reddit", data: "reddit.com"}, 
        {name: "stack overflow", data: "stackoverflow.com"}, 
        {name: "youtube", data: "youtube.com"}, 
        {name: "twitter", data: "twitter.com"}, 
        {name: "facebook", data: "facebook.com"}, 
        {name: "custom", data: ""}
      ]
    }
    const domainData = {
      name: "Domain", action: DOMAIN, data: "site:", isUnique: true, urlBased: false,
      choices: [
        {name: ".com", data: ".com"}, 
        {name: ".org", data: ".org"}, 
        {name: ".edu", data: ".edu"}, 
        {name: ".net", data: ".net"}
      ]
    }
    const exactQueryData = {
      name: "Exact Query", action: EXACT_QUERY, data: `""`, isUnique: false, urlBased: false,
    }
    const termAppearsData = {
      name: "Term Appears", action: TERM_APPEARS, isUnique: false, urlBased: false,
      choices: [
        {name: "in the title of the page", data: "allintitle:"}, 
        {name: "in the text of the page", data: "allintext:"}, 
        {name: "in the URL of the page", data: "allinurl:"}, 
        {name: "in links to the page", data: "allinanchor:"}
      ]
    }
    const beforeData = {
      name: "Before (Time)", action: BEFORE, data: "before:", isUnique: true, urlBased: false,
    }
    const afterData = {
      name: "After (Time)", action: AFTER, data: "after:", isUnique: true, urlBased: false,
    }
    const settingsData = {
      name: "Settings", action: SETTINGS, isUnique: true, urlBased: false,
    }
    const languageData = {
      name: "Language", action: LANGUAGE, data: "&lr=lang_", isUnique: true, urlBased: true,
      choices: [
        {name: "Any", data: ""},
        {name: "Afrikaans", data: "af"},
        {name: "Arabic", data: "ar"},
        {name: "Armenian", data: "hy"},
        {name: "Byelorussian", data: "be"},
        {name: "Bulgarian", data: "bg"},
        {name: "Catalan", data: "ca"},
        {name: "Chinese (Simplified)", data: "zh-CN"},
        {name: "Chinese (Traditional)", data: "zh-TW"},
        {name: "Croatian", data: "hr"},
        {name: "Czech", data: "cs"},
        {name: "Dutch", data: "nl"},
        {name: "Esperanto", data: "eo"},
        {name: "Estonian", data: "et"},
        {name: "English", data: "en"},
        {name: "Tagalog", data: "tl"},
        {name: "Finnish", data: "fi"},
        {name: "French", data: "fr"},
        {name: "German", data: "de"},
        {name: "Greek", data: "el"},
        {name: "Hebrew", data: "iw"},
        {name: "Hindi", data: "hi"},
        {name: "Hungarian", data: "hu"},
        {name: "Icelandic", data: "is"},
        {name: "Indonesian", data: "id"},
        {name: "Italian", data: "it"},
        {name: "Japanese", data: "ja"},
        {name: "Korean", data: "ko"},
        {name: "Latvian", data: "lv"},
        {name: "Lithuanian", data: "lt"},
        {name: "Norwegian", data: "no"},
        {name: "Persian", data: "fa"},
        {name: "Polish", data: "pl"},
        {name: "Romanian", data: "ro"},
        {name: "Russian", data: "ru"},
        {name: "Serbian", data: "sr"},
        {name: "Slovak", data: "sk"},
        {name: "Slovenian", data: "sl"},
        {name: "Spanish", data: "es"},
        {name: "Swahili", data: "sw"},
        {name: "Swedish", data: "sv"},
        {name: "Thai", data: "th"},
        {name: "Turkish", data: "tr"},
        {name: "Ukrainian", data: "uk"},
        {name: "Vietnamese", data: "vi"},
      ]
    }

    const actions = [
      excludeData, 
      exactQueryData, 
      beforeData, 
      afterData, 
      settingsData,
      fileTypeData, 
      siteData, 
      domainData, 
      termAppearsData, 
      languageData
    ]
  
  const toggleDropdown = (evt) => {
    if (evt.target !== evt.currentTarget) {
      evt.currentTarget.lastElementChild.classList.toggle("show")
      // theme dependent styles
      if (isDark) {
        evt.currentTarget.classList.toggle("btn--active")
      }
      else {
        evt.currentTarget.classList.toggle("btn--active-light")
      }
    }
    
    qAllCallback(".show", (el, i) => {
      if (el.previousElementSibling?.innerText !== evt.currentTarget.firstElementChild?.innerText) {
        el.classList.remove("show")
        el.parentElement.classList.remove("btn--active")
      }
    })
  }
  
  const createButtons = () => {
    relativeParent.style.position = "relative"

    const buttonsContainer = document.createElement("section")
    relativeParent.appendChild(buttonsContainer)
    buttonsContainer.classList.add("btns--container")
    actions.forEach((action, i) => {
      let caretDropdown = ""
      let dropdownMenu = ""
      let hasDropdown = false
      
      if (action?.choices) {
        hasDropdown = true
        caretDropdown = `<span class="caret-dropdown"></span>`
        
        // let parentAction = action.data
        let dropdownItems = action.choices.map((item) => `<li class="dropdown--items" data-action="${item.data}" data-parent-action="${action.data ? action.data : ""}" data-parent-action-index="${i}">${item.name}</li>`).join("")
            
        dropdownMenu = `
          <ul class="hide dropdown--container">
            ${dropdownItems}
          </ul>
        `
      }
      
      let flexBreak = ""
      if (actions[i].action === SETTINGS) flexBreak = `<div class="flex-break"><div>`
      
      if (hasDropdown) {
        buttonsContainer.innerHTML += `
          <section class="btn--container">
            <div class="btn">${action.name}</div>
            ${dropdownMenu}
          </section>
        `
      }
      else {
        buttonsContainer.innerHTML += `
          <section class="btn--container">
            <div class="btn">${action.name}</div>
          </section>
          ${flexBreak}
        `
      }
    })
  }
  
  createButtons()
  
  // attach buttons with dropdown function
  qAllCallback(".btn--container", (btn) => btn.addEventListener("click", toggleDropdown))
  qAllCallback(".dropdown--container", (el) => {
    el.addEventListener("click", (evt) => evt.stopPropagation())
    // add caret to buttons with dropdown
    el.previousElementSibling.classList.add("btn--caret")
  })
  
  
  // close dropdown menus when clicked on somewhere other than the dropdown areas
  window.onclick = (evt) => {
    if (!evt.target.matches(".btn")) {
      qAllCallback(".dropdown--container", ({classList}) => classList.contains("show") && classList.remove("show"))
      qAllCallback(".btn--active", ({classList}) => classList.remove("btn--active"))
    }
  }
  
  const attachActions = () => {
    // attach dropdown items with click handler
    qAllCallback(".dropdown--items", (item) => {
      item.addEventListener("click", (evt) => {
        const parentAction = evt.currentTarget.getAttribute("data-parent-action")
        const action = evt.currentTarget.getAttribute("data-action")
        const actionObject = actions[evt.currentTarget.getAttribute("data-parent-action-index")]
        const isUnique = actionObject.isUnique
        const actionType = actionObject.action
        const urlBased = actionObject.urlBased
        
        // special case for options that modify the search url and not the search bar
        if (urlBased) {
          let currentURL = window.location.href
          const expression = new RegExp("(&lr=lang_[a-z]{2}-[A-Z]{2}|&lr=lang_[a-z]{2}|&lr=lang_|&lr=lang|&lr=|&lr)", "gi")
          if (action === "") {
            document.location.href = currentURL.replace(expression, "")
            return
          }
          else if (currentURL.match(expression), "gi") currentURL = currentURL.replace(expression, "")
          document.location.href = `${currentURL}${parentAction}${action}`
          return
        }
        
        const input = qSelect("input")
        
        // check if unused or unique query already exists in search
        let expression = new RegExp(`(${parentAction}\\w+\\.\\w+|${parentAction}\\w+|${parentAction}\\.\\w+|${parentAction}:\\.\\w+|${parentAction}:\\.|${parentAction}\\w+.\\w+|${parentAction})`, "g")
        if (parentAction && input.value.match(expression)) {
          input.value = input.value.replace(expression, (search) => `${parentAction}${action}`)

          // only focus cursor on end of `site:` if it's blank (custom)
          if (actionType === SITE && action === "") {
            const searchPos = input.value.search(/(site:)/)
            input.setSelectionRange(searchPos + parentAction.length, searchPos + parentAction.length)
          }
          
          input.focus()
          return
        }
        // remove excess spaces
        input.value = input.value.replace(/\s{2,}/g, (search) => " ")
        
        // apply changes to search bar value
        input.value += ` ${parentAction}${action} `
        
        // trim and remove excess spaces
        input.value = input.value.trim().replace(/\s{2,}/g, (search) => " ")
        
        // focus on search bar
        input.focus()
      })
    })
    
    // attach non-having dropdown items with click handler
    qAllCallback(".btn--container", (el, i) => {
      if(el.childElementCount === 1) {
        el.firstElementChild.addEventListener("click", (evt) => {
          const action = actions[i].data
          
          // unique case for settings
          if (actions[i].action === SETTINGS) {
            cfg.open()
            return
          }
          
          const input = qSelect("input")
          
          // check if query is unique (only one of it should exist)
          const queryExists = new RegExp(`${action}`)
          if(actions[i].isUnique && input.value.match(queryExists)){
            const searchPos = input.value.search(queryExists)
            input.setSelectionRange(searchPos + action.length, searchPos + action.length)
            input.focus()
            return
          }
          
          // check if unused query is already in search bar
          const expression = new RegExp(`(${action}\\W)|(\\W${action}\\B)`, "g")
          if(input.value.match(expression)){
            // set cursor at unused query
            const searchPos = input.value.search(expression)
            
            if(action.length > 2) input.setSelectionRange(searchPos + action.length + 1, searchPos + action.length + 1)
            else input.setSelectionRange(searchPos + 2, searchPos + 2)
            
          }
          else{
            input.value = input.value.trim()
            // apply changes to search bar value
            input.value += ` ${action} `
            input.value = input.value.trim()
          }
          
          if(action === `""`) {
            const quotationsPos = input.value.search(`""`)
            input.setSelectionRange(quotationsPos + 1, quotationsPos + 1)
          }
          //focus on search bar
          input.focus()
        })
      }
    })
  }
  
  attachActions()
  
  if(!isDark){
    qAllCallback(".btns--container", (el) => el.classList.add("btns--container-light"))
    qAllCallback(".btn--container", (el) => el.classList.add("btn--container-light"))
    qAllCallback(".dropdown--container", (el) => el.classList.add("dropdown--container-light"))
    qAllCallback(".dropdown--items", (el) => el.classList.add("dropdown--items-light"))
  }
  
})();
