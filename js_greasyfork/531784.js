// ==UserScript==
// @name         bj-rapido
// @namespace    www.google.com
// @version      0.1.9
// @description  Pare de esquecer os campos
// @author       a1Th
// @icon         https://www.a1th.dev/favicon.ico
// @license      MIT
// @match        https://bj-share.info/upload.php*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531784/bj-rapido.user.js
// @updateURL https://update.greasyfork.org/scripts/531784/bj-rapido.meta.js
// ==/UserScript==

/*
 * MonkeyConfig
 * version 0.1.3
 *
 * Copyright (c) 2011-2013 Michal Wojciechowski (odyniec.net)
 */

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
    openWin,
    openLayer,
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
        data.buttons = ['save', 'defaults', 'cancel'];

      if (data.title === undefined)
        if (typeof GM_getMetadata == 'function') {
          /*
           * If GM_getMetadata is available, get the name of the script
           * and use it in the dialog title
           */
          var scriptName = GM_getMetadata('name');
          data.title = scriptName + ' Configuration';
        } else data.title = 'Configuration';
    }

    /* Make a safe version of title to be used as stored value identifier */
    var safeTitle =
      data && data.title ? data.title.replace(/[^a-zA-Z0-9]/g, '_') : '';

    storageKey = '_MonkeyConfig_' + safeTitle + '_cfg';

    var storedValues;

    /* Load stored values (if present) */
    if (GM_getValue(storageKey))
      storedValues = JSON.parse(GM_getValue(storageKey));

    for (var name in params) {
      /* If there's a value defined in the passed data object, use it */
      if (params[name]['value'] !== undefined) set(name, params[name].value);
      /* Check if there's a stored value for this parameter */ else if (
        storedValues &&
        storedValues[name] !== undefined
      )
        set(name, storedValues[name]);
      /* Otherwise, set the default value (if defined) */ else if (
        params[name]['default'] !== undefined
      )
        set(name, params[name]['default']);
      else set(name, '');
    }

    if (data.menuCommand) {
      /* Add an item to the User Script Commands menu */
      var caption = data.menuCommand !== true ? data.menuCommand : data.title;

      GM_registerMenuCommand(caption, function () {
        cfg.open();
      });
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
    var html =
      '<div class="__MonkeyConfig_container">' +
      '<h1>' +
      data.title +
      '</h1>' +
      '<table>';

    for (var name in params) {
      html += MonkeyConfig.formatters['tr'](name, params[name]);
    }

    html +=
      '<tr><td colspan="2" class="__MonkeyConfig_buttons">' + '<table><tr>';

    /* Render buttons */
    for (var button in data.buttons) {
      html += '<td>';

      switch (data.buttons[button]) {
        case 'cancel':
          html +=
            '<button type="button" ' +
            'id="__MonkeyConfig_button_cancel">' +
            '<img src="data:image/png;base64,' +
            MonkeyConfig.res.icons.cancel +
            '" />&nbsp;' +
            'Cancel</button>';
          break;
        case 'defaults':
          html +=
            '<button type="button" ' +
            'id="__MonkeyConfig_button_defaults">' +
            '<img src="data:image/png;base64,' +
            MonkeyConfig.res.icons.arrow_undo +
            '" />&nbsp;' +
            'Set&nbsp;Defaults</button>';
          break;
        case 'save':
          html +=
            '<button type="button" ' +
            'id="__MonkeyConfig_button_save">' +
            '<img src="data:image/png;base64,' +
            MonkeyConfig.res.icons.tick +
            '" />&nbsp;' +
            'Save</button>';
          break;
      }

      html += '</td>';
    }

    html += '</tr></table></td></tr>';

    html += '</table><div>';

    return html;
  }

  /**
   * Update the fields in the dialog to reflect current values
   */
  function update() {
    /* Do nothing if the dialog is not currently displayed */
    if (!displayed) return;

    for (var name in params) {
      var value = values[name];

      switch (params[name].type) {
        case 'checkbox':
          var elem = container.querySelector('[name="' + name + '"]');
          elem.checked = !!value;
          break;
        case 'custom':
          params[name].set(
            value,
            container.querySelector('#__MonkeyConfig_parent_' + name)
          );
          break;
        case 'number':
        case 'text':
          var elem = container.querySelector('[name="' + name + '"]');
          elem.value = value;
          break;
        case 'select':
          var elem = container.querySelector('[name="' + name + '"]');

          if (elem.tagName.toLowerCase() == 'input') {
            if (elem.type && elem.type == 'radio') {
              /* Single selection with radio buttons */
              elem = container.querySelector(
                '[name="' + name + '"][value="' + value + '"]'
              );
              elem.checked = true;
            } else if (elem.type && elem.type == 'checkbox') {
              /* Multiple selection with checkboxes */
              var checkboxes = container.querySelectorAll(
                'input[name="' + name + '"]'
              );

              for (var i = 0; i < checkboxes.length; i++)
                checkboxes[i].checked = value.indexOf(checkboxes[i].value) > -1;
            }
          } else if (elem.tagName.toLowerCase() == 'select')
            if (elem.multiple) {
              /* Multiple selection element */
              var options = container.querySelectorAll(
                'select[name="' + name + '"] option'
              );

              for (var i = 0; i < options.length; i++)
                options[i].selected = value.indexOf(options[i].value) > -1;
            } else
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
          values[name] = params[name].get(
            container.querySelector('#__MonkeyConfig_parent_' + name)
          );
          break;
        case 'number':
        case 'text':
          var elem = container.querySelector('[name="' + name + '"]');
          values[name] = elem.value;
          break;
        case 'select':
          var elem = container.querySelector('[name="' + name + '"]');

          if (elem.tagName.toLowerCase() == 'input') {
            if (elem.type && elem.type == 'radio')
              /* Single selection with radio buttons */
              values[name] = container.querySelector(
                '[name="' + name + '"]:checked'
              ).value;
            else if (elem.type && elem.type == 'checkbox') {
              /* Multiple selection with checkboxes */
              values[name] = [];
              var inputs = container.querySelectorAll(
                'input[name="' + name + '"]'
              );

              for (var i = 0; i < inputs.length; i++)
                if (inputs[i].checked) values[name].push(inputs[i].value);
            }
          } else if (elem.tagName.toLowerCase() == 'select' && elem.multiple) {
            /* Multiple selection element */
            values[name] = [];
            var options = container.querySelectorAll(
              'select[name="' + name + '"] option'
            );

            for (var i = 0; i < options.length; i++)
              if (options[i].selected) values[name].push(options[i].value);
          } else values[name] = elem.value;
          break;
      }
    }

    GM_setValue(storageKey, JSON.stringify(values));

    close();

    if (data.onSave) data.onSave(values);
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

      if ((button = container.querySelector('#__MonkeyConfig_button_save')))
        button.addEventListener('click', saveClick, true);
      if ((button = container.querySelector('#__MonkeyConfig_button_cancel')))
        button.addEventListener('click', cancelClick, true);
      if ((button = container.querySelector('#__MonkeyConfig_button_defaults')))
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
          height: 100,
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

        head.innerHTML =
          '<title>' +
          data.title +
          '</title>' +
          '<style type="text/css">' +
          MonkeyConfig.res.stylesheets.main +
          '</style>';

        body.className = '__MonkeyConfig_window';
        /* Place the rendered configuration dialog inside the window body */
        body.innerHTML = render();

        /* Find the container (CBAN-3489) */
        container = win.document.querySelector('.__MonkeyConfig_container');

        /* Resize window to the dimensions of the container div */
        win.innerWidth = container.clientWidth;
        win.resizeBy(0, -win.innerHeight + container.clientHeight);

        /* Place the window centered relative to the parent */
        win.moveBy(
          Math.round((window.outerWidth - win.outerWidth) / 2),
          Math.round((window.outerHeight - win.outerHeight) / 2)
        );

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
        openLayer.style.left =
          Math.round((window.innerWidth - openLayer.clientWidth) / 2) + 'px';
        openLayer.style.top =
          Math.round((window.innerHeight - openLayer.clientHeight) / 2) + 'px';
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
        if (undefined !== iframe.frameborder) iframe.frameBorder = '0';
        if (undefined !== iframe.scrolling) iframe.scrolling = 'no';
        if (undefined !== iframe.seamless) iframe.seamless = true;

        /* Do the rest in the load event handler */
        iframe.addEventListener(
          'load',
          function () {
            iframe.contentDocument.body.innerHTML = render();
            iframe.style.opacity = 1;

            /* Append the style to the head */
            var head = iframe.contentDocument.querySelector('head'),
              style = iframe.contentDocument.createElement('style');
            style.setAttribute('type', 'text/css');
            style.appendChild(
              iframe.contentDocument.createTextNode(
                MonkeyConfig.res.stylesheets.main
              )
            );
            head.appendChild(style);

            var body = iframe.contentDocument.querySelector('body');
            body.className = '__MonkeyConfig_body';

            container = iframe.contentDocument.querySelector(
              '.__MonkeyConfig_container'
            );

            iframe.width = container.clientWidth;
            iframe.height = container.clientHeight;

            /* Position the layer in the center of the viewport */
            openLayer.style.left =
              Math.round((window.innerWidth - openLayer.clientWidth) / 2) +
              'px';
            openLayer.style.top =
              Math.round((window.innerHeight - openLayer.clientHeight) / 2) +
              'px';
            openLayer.style.zIndex = 9999;

            openDone();
          },
          false
        );

        setTimeout(function () {
          iframe.width = container.clientWidth;
          iframe.height = container.clientHeight;

          /* Position the layer in the center of the viewport */
          openLayer.style.left =
            Math.round((window.innerWidth - openLayer.clientWidth) / 2) + 'px';
          openLayer.style.top =
            Math.round((window.innerHeight - openLayer.clientHeight) / 2) +
            'px';
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
    } else if (openLayer) {
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
  _field: function (name, options, data) {
    var html;

    if (options.type && MonkeyConfig.HTML[options.type])
      html = MonkeyConfig.HTML[options.type](name, options, data);
    else return;

    if (/\[FIELD\]/.test(options.html)) {
      html = options.html.replace(/\[FIELD\]/, html);
    }

    return html;
  },
  _label: function (name, options, data) {
    var label =
      options['label'] ||
      name.substring(0, 1).toUpperCase() +
        name.substring(1).replace(/_/g, '&nbsp;');

    return (
      '<label for="__MonkeyConfig_field_' + name + '">' + label + '</label>'
    );
  },
  checkbox: function (name, options, data) {
    return (
      '<input id="__MonkeyConfig_field_' +
      name +
      '" type="checkbox" name="' +
      name +
      '" />'
    );
  },
  custom: function (name, options, data) {
    return options.html;
  },
  number: function (name, options, data) {
    return (
      '<input id="__MonkeyConfig_field_' +
      name +
      '" ' +
      'type="text" class="__MonkeyConfig_field_number" ' +
      'name="' +
      name +
      '" />'
    );
  },
  select: function (name, options, data) {
    var choices = {},
      html = '';

    if (options.choices.constructor == Array) {
      /* options.choices is an array -- build key/value pairs */
      for (var i = 0; i < options.choices.length; i++)
        choices[options.choices[i]] = options.choices[i];
    } else choices = options.choices;
    /* options.choices is an object -- use it as it is */

    if (!options.multiple) {
      /* Single selection */
      if (!/^radio/.test(options.variant)) {
        /* Select element */
        html +=
          '<select id="__MonkeyConfig_field_' +
          name +
          '" ' +
          'class="__MonkeyConfig_field_select" ' +
          'name="' +
          name +
          '">';

        for (var value in choices)
          html +=
            '<option value="' +
            MonkeyConfig.esc(value) +
            '">' +
            choices[value] +
            '</option>';

        html += '</select>';
      } else {
        /* Radio buttons */
        for (var value in choices) {
          html +=
            '<label><input type="radio" name="' +
            name +
            '" ' +
            'value="' +
            MonkeyConfig.esc(value) +
            '" />&nbsp;' +
            choices[value] +
            '</label>' +
            (/ column/.test(options.variant) ? '<br />' : '');
        }
      }
    } else {
      /* Multiple selection */
      if (!/^checkbox/.test(options.variant)) {
        /* Checkboxes */
        html +=
          '<select id="__MonkeyConfig_field_' +
          name +
          '" ' +
          'class="__MonkeyConfig_field_select" ' +
          'multiple="multiple" ' +
          'name="' +
          name +
          '">';

        for (var value in choices)
          html +=
            '<option value="' +
            MonkeyConfig.esc(value) +
            '">' +
            choices[value] +
            '</option>';

        html += '</select>';
      } else {
        /* Select element */
        for (var value in choices) {
          html +=
            '<label><input type="checkbox" ' +
            'name="' +
            name +
            '" ' +
            'value="' +
            MonkeyConfig.esc(value) +
            '" />&nbsp;' +
            choices[value] +
            '</label>' +
            (/ column/.test(options.variant) ? '<br />' : '');
        }
      }
    }

    return html;
  },
  text: function (name, options, data) {
    if (options.long)
      return (
        '<textarea id="__MonkeyConfig_field_' +
        name +
        '" ' +
        'class="__MonkeyConfig_field_text" ' +
        (!isNaN(options.long) ? 'rows="' + options.long + '" ' : '') +
        'name="' +
        name +
        '"></textarea>'
      );
    else
      return (
        '<input id="__MonkeyConfig_field_' +
        name +
        '" ' +
        'type="text" class="__MonkeyConfig_field_text" ' +
        'name="' +
        name +
        '" />'
      );
  },
};

MonkeyConfig.formatters = {
  tr: function (name, options, data) {
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
  },
};

/* Has the stylesheet been added? */
MonkeyConfig.styleAdded = false;

/* Resources */
MonkeyConfig.res = {};

/* Icons */
MonkeyConfig.res.icons = {
  arrow_undo:
    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0\
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
  cancel:
    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0\
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
  tick: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0\
U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGrSURBVDjLvZPZLkNhFIV75zjvYm7VGFNC\
qoZUJ+roKUUpjRuqp61Wq0NKDMelGGqOxBSUIBKXWtWGZxAvobr8lWjChRgSF//dv9be+9trCwAI\
/vIE/26gXmviW5bqnb8yUK028qZjPfoPWEj4Ku5HBspgAz941IXZeze8N1bottSo8BTZviVWrEh5\
46EO03EXpuJOdG63otJbjBKHkEp/Ml6yNYYzpuezWL4s5VMtT8acCMQcb5XL3eJE8VgBlR7BeMGW\
9Z4yT9y1CeyucuhdTGDxfftaBO7G4L+zg91UocxVmCiy51NpiP3n2treUPujL8xhOjYOzZYsQWAN\
yRYlU4Y9Br6oHd5bDh0bCpSOixJiWx71YY09J5pM/WEbzFcDmHvwwBu2wnikg+lEj4mwBe5bC5h1\
OUqcwpdC60dxegRmR06TyjCF9G9z+qM2uCJmuMJmaNZaUrCSIi6X+jJIBBYtW5Cge7cd7sgoHDfD\
aAvKQGAlRZYc6ltJlMxX03UzlaRlBdQrzSCwksLRbOpHUSb7pcsnxCCwngvM2Rm/ugUCi84fycr4\
l2t8Bb6iqTxSCgNIAAAAAElFTkSuQmCC',
};

/* Stylesheets */
MonkeyConfig.res.stylesheets = {
  main: '\
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
',
};

const cfg = new MonkeyConfig({
  title: 'Configurações',
  menuCommand: true,
  params: {
    Anônimo: {
      label: 'Postar como anônimo',
      type: 'checkbox',
      default: false,
    },
    BiOMA_info: {
      type: 'text',
      default: '',
    },
  },
});

let fileName = '';
let seasonInfo = null;
let service = '';
let resolution = '';
let audioCodec = '';
let videoCodec = '';
(function () {
  const rules = document.querySelector('.box.pad');
  if (rules) {
    rules.remove();
  }
  updateBackground('#file');
  const torrentInput = document.querySelector('#file');
  if (torrentInput) {
    torrentInput.addEventListener('change', (e) => {
      const target = e.target;
      fileName = formatFileName(target.value);
      parseFileName(fileName);
      handleParser();
    });
  }
  const categorySelect = document.querySelector('#categories');
  if (!categorySelect) {
    console.error('Select element #categories not found.');
    return;
  }
  tdStyle(categorySelect);
  const categoryButtonsContainer = document.createElement('div');
  buttons('categoryButtons').forEach((button) => {
    const btn = createButton(button, handleCategoryClick);
    categoryButtonsContainer.appendChild(btn);
  });
  if (!categorySelect?.parentNode) return;
  categorySelect.parentNode.insertBefore(
    categoryButtonsContainer,
    categorySelect.nextSibling
  );
  waitForElement('#formato', () => {
    setupForm();
  });
})();

const RESOLUTION = {
  '720p': ['720p'],
  '1080p': ['1080p'],
  '2160p': ['2160p'],
};
const AUDIOCODEC = {
  'E-AC-3': ['ddp', 'dd+'],
  AC3: ['dd(?!p|\\+)'],
  AAC: ['aac'],
};
const VIDEOCODED = {
  'H.264': ['h264', 'h.264', 'h 264'],
  x264: ['x264', 'x.264', 'x 264'],
  'H.265': ['h265', 'h.265', 'h 265'],
  x265: ['x265', 'x.265', 'x 265'],
};
const SERVICE = {
  Crunchyroll: [' cr '],
  Netflix: [' nf '],
  Amazon: [' amzn '],
  Globoplay: [' glbo '],
  Mubi: [' mubi '],
  Max: [' max '],
  'Disney+': [' dsnp '],
  'Paramount+': [' pmnt '],
  'AppleTV+': [' atvp '],
};
const ADDITIONINFOTAGS = {
  'Dolby Vision': ['dv', 'dovi'],
  'Dolby Atmos': ['atmos'],
  'HDR10+': ['hdr10+'],
  HDR10: ['hdr10', 'hdr'],
};
const YEARREGEX = /(.+)(\s\d{4}(?=\s))/;
const TVorANIMEREGEX = /(.+)(?=\s[es]\d{1,2})/gi;
function formatFileName(fileName) {
  fileName = fileName.toLowerCase();
  fileName = fileName
    .replace(/^c:\\fakepath\\/, '')
    .replace(/\.torrent$/, '')
    .replaceAll('.', ' ')
    .replaceAll('.', ' ')
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/^\[.+?\]\s?/i, '')
    .replaceAll('[', '')
    .replaceAll(']', '')
    .replaceAll('(', '')
    .replaceAll(')', '');
  return fileName;
}
function detectMatch(group, text) {
  const lowerText = text.toLowerCase();
  for (const [key, values] of Object.entries(group)) {
    if (values.some((value) => lowerText.includes(value))) {
      return key;
    }
  }
  return '';
}
function detectResolution(text) {
  return detectMatch(RESOLUTION, text);
}
function detectService(text) {
  return detectMatch(SERVICE, text);
}
function detectAudioCodec(text) {
  return detectMatch(AUDIOCODEC, text);
}
function detectVideoCodec(text) {
  return detectMatch(VIDEOCODED, text);
}
function parseSeasonEpisode(fileName) {
  const regex = /s(\d{2})(?:e(\d{2,3}))?/i;
  const match = fileName.match(regex);
  if (match) {
    const [, season, episode] = match;
    return {
      season,
      ...(episode ? { episode } : {}),
    };
  }
  return null;
}
function handleAdditionalInfoTags(fileName) {
  const additionalInfoCheckbox = document.querySelector('#remaster');
  if (!additionalInfoCheckbox) return;
  Object.entries(ADDITIONINFOTAGS).forEach(([label, keywords]) => {
    const matched = keywords.some((kw) =>
      fileName.toLowerCase().includes(kw.toLowerCase())
    );
    if (matched) {
      if (!additionalInfoCheckbox.checked) {
        additionalInfoCheckbox.click();
      }
      clickAdditionalInfoTags(label);
    }
  });
}
function parseFileName(fileName) {
  resolution = detectResolution(fileName);
  audioCodec = detectAudioCodec(fileName);
  videoCodec = detectVideoCodec(fileName);
  service = detectService(fileName);
  seasonInfo = parseSeasonEpisode(fileName);
  handleAdditionalInfoTags(fileName);
}

function handleCategoryClick(button) {
  updateSelectValue('#categories', String(button.value));
}
function setupForm() {
  checkRequiredFields();
  const anonCheckBox = document.querySelector('#anonyCheck');
  if (cfg.get('Anônimo') && anonCheckBox) {
    anonCheckBox.click();
  }
  const defaultValues = {
    '#formato': 'MKV',
    '#qualidade': 'WEB-DL',
    '#tipolegenda': 'Embutida',
    '#fichatecnica': cfg.get('BiOMA_info') ?? '',
  };
  Object.entries(defaultValues).forEach(([selector, value]) => {
    updateSelectValue(selector, value);
  });
  handleParser();
  const xxxSelect = document.querySelector('#adulto');
  if (xxxSelect) {
    xxxSelect.value = '2';
  }
  handleAudioLanguageSelect();
  handleVideoCodecSelect();
  handleAudioCodecSelect();
  handleAudioIdiomSelect();
  handleResolution();
  handleService();
  handleQualitySelect();
  handleScreens();
}
function handleAudioLanguageSelect() {
  setLanguageForNationalAudio();
  const audioLanguageSelect = document.querySelector('#audio');
  if (!audioLanguageSelect) return;
  tdStyle(audioLanguageSelect);
  const audioButtonsContainer = document.createElement('div');
  buttons('audioLanguageButtons').forEach((button) => {
    const btn = createButton(button, () =>
      updateSelectValue('#audio', button.value)
    );
    audioButtonsContainer.appendChild(btn);
  });
  if (!audioLanguageSelect?.parentNode) return;
  audioLanguageSelect.parentNode.insertBefore(
    audioButtonsContainer,
    audioLanguageSelect.nextSibling
  );
}
function handleVideoCodecSelect() {
  const videoCodecSelect = document.querySelector('#codecvideo');
  if (!videoCodecSelect) return;
  tdStyle(videoCodecSelect);
  const videoCodecButtonsContainer = document.createElement('div');
  buttons('videoCodecButtons').forEach((button) => {
    const btn = createButton(button, () =>
      updateSelectValue('#codecvideo', button.value)
    );
    videoCodecButtonsContainer.appendChild(btn);
  });
  if (!videoCodecSelect?.parentNode) return;
  videoCodecSelect.parentNode.insertBefore(
    videoCodecButtonsContainer,
    videoCodecSelect.nextSibling
  );
}
function handleAudioCodecSelect() {
  // updateBackground('#codecaudio');
  const audioCodecSelect = document.querySelector('#codecaudio');
  if (!audioCodecSelect) return;
  tdStyle(audioCodecSelect);
  const audioCodecButtonsContainer = document.createElement('div');
  buttons('audioCodecButtons').forEach((button) => {
    const btn = createButton(button, () =>
      updateSelectValue('#codecaudio', button.value)
    );
    audioCodecButtonsContainer.appendChild(btn);
  });
  if (!audioCodecSelect?.parentNode) return;
  audioCodecSelect.parentNode.insertBefore(
    audioCodecButtonsContainer,
    audioCodecSelect.nextSibling
  );
}
function handleAudioIdiomSelect() {
  const audioIdiomSelect = document.querySelector('#idioma');
  if (!audioIdiomSelect) return;
  tdStyle(audioIdiomSelect);
  const audioIdiomButtonsContainer = document.createElement('div');
  buttons('audioIdiomButtons').forEach((button) => {
    const btn = createButton(button, () =>
      updateSelectValue('#idioma', button.value)
    );
    audioIdiomButtonsContainer.appendChild(btn);
  });
  if (!audioIdiomSelect?.parentNode) return;
  audioIdiomSelect.parentNode.insertBefore(
    audioIdiomButtonsContainer,
    audioIdiomSelect.nextSibling
  );
}
function handleResolution() {
  const hInput = document.querySelector('#resolucaoh');
  if (!hInput) return;
  tdStyle(hInput);
  const ResolutionButtonsContainer = document.createElement('div');
  buttons('resolutionButtons').forEach((button) => {
    const btn = createButton(button, () => {
      updateInputValue('#resolucaow', button.value.w);
      updateInputValue('#resolucaoh', button.value.h);
    });
    ResolutionButtonsContainer.appendChild(btn);
  });
  if (!hInput?.parentNode) return;
  hInput.parentNode.insertBefore(
    ResolutionButtonsContainer,
    hInput.nextSibling
  );
}
function handleService() {
  const serviceInput = document.querySelector('#release');
  if (!serviceInput) return;
  tdStyle(serviceInput);
  const ServiceButtonsContainer = document.createElement('div');
  buttons('serviceButtons').forEach((button) => {
    const btn = createButton(button, () => {
      updateInputValue('#release', button.value);
    });
    ServiceButtonsContainer.appendChild(btn);
  });
  if (!serviceInput?.parentNode) return;
  serviceInput.parentNode.insertBefore(
    ServiceButtonsContainer,
    serviceInput.nextSibling
  );
}
function handleQualitySelect() {
  const qualitySelect = document.querySelector('#qualidade');
  if (!qualitySelect) return;
  tdStyle(qualitySelect);
  const qualityButtonsContainer = document.createElement('div');
  buttons('qualityButtons').forEach((button) => {
    const btn = createButton(button, () =>
      updateSelectValue('#qualidade', button.value)
    );
    qualityButtonsContainer.appendChild(btn);
  });
  if (qualitySelect.parentNode) {
    qualitySelect.parentNode.insertBefore(
      qualityButtonsContainer,
      qualitySelect.nextSibling
    );
  }
}
function setLanguageForNationalAudio() {
  const audioSelect = document.querySelector('#audio');
  if (!audioSelect) return;
  tdStyle(audioSelect);
  audioSelect.addEventListener('change', () => {
    if (audioSelect.value === 'Nacional') {
      updateSelectValue('#idioma', 'Português');
    } else {
      updateSelectValue('#idioma', '');
    }
  });
}
function handleParser() {
  if (!document.querySelector('#audio')) {
    return;
  }
  const res = resolutions()[resolution];
  const isDual = fileName?.includes('dual');
  const selectorsMap = [
    { selector: '#audio', value: isDual ? 'Dual Áudio' : '', type: 'select' },
    { selector: '#codecaudio', value: audioCodec, type: 'select' },
    { selector: '#codecvideo', value: videoCodec, type: 'select' },
    { selector: '#release', value: service, type: 'input' },
    { selector: '#resolucaow', value: res?.w ?? '', type: 'input' },
    { selector: '#resolucaoh', value: res?.h ?? '', type: 'input' },
  ];
  selectorsMap.forEach(({ selector, value, type }) => {
    const finalValue = value ?? '';
    type === 'select'
      ? updateSelectValue(selector, finalValue)
      : updateInputValue(selector, finalValue);
  });
  const seasonOrEpisodeSelect = document.querySelector('#tipo');
  if (seasonOrEpisodeSelect) {
    updateSelectValue('#tipo', seasonInfo?.episode ? 'episode' : 'season');
    const seasonInput = document.querySelector('#season');
    const episodeInput = document.querySelector('#episode');
    if (seasonInput) {
      updateInputValue('#season', seasonInfo?.season ?? '');
    }
    if (episodeInput) {
      updateInputValue('#episode', seasonInfo?.episode ?? '');
    }
  }
}
function clickAdditionalInfoTags(label) {
  const links = document.querySelectorAll('#remaster_tags a');
  const target = Array.from(links).find(
    (a) => a.textContent?.trim().toLowerCase() === label.toLowerCase()
  );
  target?.click();
}

function createButton(button, onClick) {
  const btn = document.createElement('button');
  btn.id = button.id;
  btn.textContent = button.label;
  btn.style.marginRight = '5px';
  btn.style.backgroundColor = '#ffff55';
  btn.style.color = '#000000';
  btn.style.fontSize = '.6rem';
  btn.style.fontWeight = '600';
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    onClick(button);
  });
  return btn;
}
function updateInputValue(selector, value) {
  const inputElement = document.querySelector(selector);
  if (!inputElement) {
    return;
  }
  inputElement.value = value;
  inputElement.dispatchEvent(new Event('input'));
}
function handleScreens() {
  const style = document.createElement('style');
  style.textContent = `
  .dropzone:not(:has(.dz-preview)) {
    background-color: red !important;
    color:white;
  }
`;
  document.head.appendChild(style);
}
function tdStyle(buttonsDiv) {
  const parentTd = buttonsDiv.closest('td');
  if (parentTd) {
    parentTd.style.display = 'flex';
    parentTd.style.gap = '12px';
    parentTd.style.alignItems = 'center';
  }
}
function updateSelectValue(selector, value) {
  const selectElement = document.querySelector(selector);
  if (!selectElement) {
    console.error(`Element with selector '${selector}' not found.`);
    return;
  }
  selectElement.value = value;
  selectElement.dispatchEvent(new Event('change'));
}
function updateBackground(elementSelector) {
  const selector = document.querySelector(elementSelector);
  if (!selector) {
    console.error(`Element with selector '${selector}' not found.`);
    return;
  }
  const checkValue = () => {
    const isSelect = selector.tagName === 'SELECT';
    const value = selector.value.trim();
    const isInvalid = isSelect ? value === '' || value === '0' : value === '';
    selector.style.background = isInvalid ? 'red' : '';
    selector.style.color = isInvalid ? 'white' : '';
  };
  checkValue();
  selector.addEventListener(
    selector.tagName === 'SELECT' ? 'change' : 'input',
    checkValue
  );
}
function checkRequiredFields() {
  const requiredFields = [
    '#file',
    '#imdblink',
    '#audio',
    '#codecvideo',
    '#codecaudio',
    '#idioma',
    '#resolucaow',
    '#resolucaoh',
    '#release',
    '#qualidade',
    '#season',
    '#episode',
  ];
  // if (
  //   document.querySelector<HTMLSelectElement>('#duracaoHR')!.value == '0' &&
  //   document.querySelector<HTMLSelectElement>('#duracaoMIN')!.value == '0'
  // ) {
  //   updateBackground('#duracaoMIN');
  // }
  requiredFields.forEach((selector) => updateBackground(selector));
}
function waitForElement(selector, callback) {
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  const existingElement = document.querySelector(selector);
  if (existingElement) {
    callback(existingElement);
    observer.disconnect();
  }
}
function buttons(buttonType) {
  const buttonCollections = {
    categoryButtons: [
      { id: 'btn-Filmes', label: 'Filmes', value: 0 },
      { id: 'btn-Seriados', label: 'Seriados', value: 1 },
      { id: 'btn-Animes', label: 'Animes', value: 13 },
    ],
    audioLanguageButtons: [
      { id: 'btn-Nacional', label: 'Nacional', value: 'Nacional' },
      { id: 'btn-DUAL', label: 'DUAL', value: 'Dual Áudio' },
      { id: 'btn-Dublado', label: 'Dublado', value: 'Dublado' },
      { id: 'btn-Legendado', label: 'Legendado', value: 'Legendado' },
    ],
    videoCodecButtons: [
      { id: 'btn-H264', label: 'H.264', value: 'H.264' },
      { id: 'btn-H265', label: 'H.265', value: 'H.265' },
      { id: 'btn-x264', label: 'x264', value: 'x264' },
      { id: 'btn-x265', label: 'x265', value: 'x265' },
    ],
    audioCodecButtons: [
      { id: 'btn-AAC', label: 'AAC', value: 'AAC' },
      { id: 'btn-AC3', label: 'AC3', value: 'AC3' },
      { id: 'btn-E-AC-3', label: 'E-AC-3', value: 'E-AC-3' },
      { id: 'btn-DTS', label: 'DTS', value: 'DTS' },
      { id: 'btn-DTS-HD', label: 'DTS-HD', value: 'DTS-HD' },
      { id: 'btn-DTS:X', label: 'DTS:X', value: 'DTS:X' },
      { id: 'btn-AC3/AAC', label: 'AC3/AAC', value: 'AC3/AAC' },
      { id: 'btn-AC3/DTS', label: 'AC3/DTS', value: 'AC3/DTS' },
      { id: 'btn-AC3/E-AC-3', label: 'AC3/E-AC-3', value: 'AC3/E-AC-3' },
      { id: 'btn-FLAC', label: 'FLAC', value: 'FLAC' },
      { id: 'btn-TrueHD', label: 'TrueHD', value: 'TrueHD' },
    ],
    audioIdiomButtons: [
      { id: 'btn-Portugues', label: 'Português', value: 'Português' },
      { id: 'btn-Ingles', label: 'Inglês', value: 'Inglês' },
      { id: 'btn-Espanhol', label: 'Espanhol', value: 'Espanhol' },
      { id: 'btn-Japones', label: 'Japonês', value: 'Japonês' },
      { id: 'btn-Chines', label: 'Chinês', value: 'Chinês' },
      { id: 'btn-Coreano', label: 'Coreano', value: 'Coreano' },
      { id: 'btn-Frances', label: 'Francês', value: 'Francês' },
      { id: 'btn-Alemao', label: 'Alemão', value: 'Alemão' },
      { id: 'btn-Hindi', label: 'Hindi', value: 'Hindi' },
      { id: 'btn-Italiano', label: 'Italiano', value: 'Italiano' },
      { id: 'btn-Russo', label: 'Russo', value: 'Russo' },
      { id: 'btn-Turco', label: 'Turco', value: 'Turco' },
    ],
    resolutionButtons: [
      { id: 'btn-720p', label: '720p', value: resolutions()['720p'] },
      { id: 'btn-1080p', label: '1080p', value: resolutions()['1080p'] },
      { id: 'btn-2160p', label: '2160p', value: resolutions()['2160p'] },
    ],
    serviceButtons: [
      { id: 'btn-Netflix', label: 'Netflix', value: 'Netflix' },
      { id: 'btn-Amazon', label: 'Amazon', value: 'Amazon' },
      { id: 'btn-Disney+', label: 'Disney+', value: 'Disney+' },
      { id: 'btn-AppleTV+', label: 'AppleTV+', value: 'AppleTV+' },
      { id: 'btn-Max', label: 'Max', value: 'Max' },
      { id: 'btn-Crunchyroll', label: 'Crunchyroll', value: 'Crunchyroll' },
      { id: 'btn-Globoplay', label: 'Globoplay', value: 'Globoplay' },
      { id: 'btn-Paramount+', label: 'Paramount+', value: 'Paramount+' },
    ],
    qualityButtons: [
      { id: 'btn-WEB-DL', label: 'WEB-DL', value: 'WEB-DL' },
      { id: 'btn-Blu-ray', label: 'Blu-ray', value: 'Blu-ray' },
      { id: 'btn-BRRip', label: 'BRRip', value: 'BRRip' },
    ],
  };
  return buttonCollections[buttonType] || [];
}
function resolutions() {
  const resolutions = {
    '720p': { w: '1280', h: '720' },
    '1080p': { w: '1920', h: '1080' },
    '2160p': { w: '3840', h: '2160' },
  };
  return resolutions;
}
