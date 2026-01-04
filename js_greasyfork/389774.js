"use strict";

// ==UserScript==
// @name         gm_config_toolbar
// @version      2020.4.20
// @namespace    https://github.com/niubilityfrontend
// @description  greasyfork configuration toolbar on the script addins
// @author       kufii
// @license      OSL-3.0
// @match *
// @include *
// @supportURL   https://github.com/kufii/My-UserScripts
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// ==/UserScript==
(function () {
  'use strict';

  window.GM_config = function (settings) {
    var storage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'cfg',
        ret = null,
        prefix = 'gm-config',
        addStyle = function addStyle() {
      var css = "\n\t\t\t\t.".concat(prefix, " {\n\t\t\t\t\tdisplay: grid;\n\t\t\t\t\talign-items: center;\n\t\t\t\t\tgrid-row-gap: 5px;\n\t\t\t\t\tgrid-column-gap: 10px;\n\t\t\t\t\tbackground-color: white;\n\t\t\t\t\tborder: 1px solid black;\n\t\t\t\t\tpadding: 5px;\n\t\t\t\t\tposition: fixed;\n\t\t\t\t\ttop: 0;\n\t\t\t\t\tright: 0;\n\t\t\t\t\tz-index: 2147483647;\n\t\t\t\t}\n\n\t\t\t\t.").concat(prefix, " label {\n\t\t\t\t\tgrid-column: 1 / 2;\n\t\t\t\t\tcolor: black;\n\t\t\t\t\ttext-align: right;\n\t\t\t\t\tfont-size: small;\n\t\t\t\t\tfont-weight: bold;\n\t\t\t\t}\n\n\t\t\t\t.").concat(prefix, " input,\n\t\t\t\t.").concat(prefix, " textarea,\n\t\t\t\t.").concat(prefix, " select {\n\t\t\t\t\tgrid-column: 2 / 4;\n\t\t\t\t}\n\n\t\t\t\t.").concat(prefix, " .").concat(prefix, "-save {\n\t\t\t\t\tgrid-column: 2 / 3;\n\t\t\t\t}\n\n\t\t\t\t.").concat(prefix, " .").concat(prefix, "-cancel {\n\t\t\t\t\tgrid-column: 3 / 4;\n\t\t\t\t}\n\t\t\t");

      if (typeof GM_addStyle === 'undefined') {
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
      } else {
        GM_addStyle(css);
      }
    },
        load = function load() {
      var defaults = {};
      settings.forEach(function (_ref) {
        var {
          key: key,
          "default": def
        } = _ref;
        return defaults[key] = def;
      });
      var cfg = typeof GM_getValue !== 'undefined' ? GM_getValue(storage) : localStorage.getItem(storage);
      if (!cfg) return defaults;
      cfg = JSON.parse(cfg);
      Object.entries(defaults).forEach(function (_ref2) {
        var [key, value] = _ref2;

        if (typeof cfg[key] === 'undefined') {
          cfg[key] = value;
        }
      });
      return cfg;
    },
        save = function save(cfg) {
      var data = JSON.stringify(cfg);
      typeof GM_setValue !== 'undefined' ? GM_setValue(storage, data) : localStorage.setItem(storage, data);
    },
        setup = function setup() {
      var createContainer = function createContainer() {
        var form = document.createElement('form');
        form.classList.add(prefix);
        return form;
      },
          createTextbox = function createTextbox(name, value, placeholder, maxLength, multiline, resize) {
        var input = document.createElement(multiline ? 'textarea' : 'input');

        if (multiline) {
          input.style.resize = resize ? 'vertical' : 'none';
        } else {
          input.type = 'text';
        }

        input.name = name;
        if (typeof value !== 'undefined') input.value = value;
        if (placeholder) input.placeholder = placeholder;
        if (maxLength) input.maxLength = maxLength;
        return input;
      },
          createNumber = function createNumber(name, value, placeholder, min, max, step) {
        var input = createTextbox(name, value, placeholder);
        input.type = 'number';
        if (typeof min !== 'undefined') input.min = min;
        if (typeof max !== 'undefined') input.max = max;
        if (typeof step !== 'undefined') input.step = step;
        return input;
      },
          createSelect = function createSelect(name, options, value, showBlank) {
        var select = document.createElement('select');
        select.name = name;

        var createOption = function createOption(val) {
          var {
            value = val,
            text = val
          } = val,
              option = document.createElement('option');
          option.value = value;
          option.textContent = text;
          return option;
        };

        if (showBlank) {
          select.appendChild(createOption(''));
        }

        options.forEach(function (opt) {
          if (typeof opt.optgroup !== 'undefined') {
            var optgroup = document.createElement('optgroup');
            optgroup.label = opt.optgroup;
            select.appendChild(optgroup);
            opt.values.forEach(function (value) {
              return optgroup.appendChild(createOption(value));
            });
          } else {
            select.appendChild(createOption(opt));
          }
        });
        select.value = value;
        return select;
      },
          createCheckbox = function createCheckbox(name, checked) {
        var checkbox = document.createElement('input');
        checkbox.id = "".concat(prefix, "-").concat(name);
        checkbox.type = 'checkbox';
        checkbox.name = name;
        checkbox.checked = checked;
        return checkbox;
      },
          createButton = function createButton(text, onclick, classname) {
        var button = document.createElement('button');
        button.classList.add("".concat(prefix, "-").concat(classname));
        button.textContent = text;
        button.onclick = onclick;
        return button;
      },
          createLabel = function createLabel(label, htmlFor) {
        var lbl = document.createElement('label');
        if (htmlFor) lbl.htmlFor = htmlFor;
        lbl.textContent = label;
        return lbl;
      },
          init = function init(cfg) {
        var controls = {},
            div = createContainer();
        settings.filter(function (_ref3) {
          var {
            type: type
          } = _ref3;
          return type !== 'hidden';
        }).forEach(function (setting) {
          var value = cfg[setting.key],
              control;

          if (setting.type === 'text') {
            control = createTextbox(setting.key, value, setting.placeholder, setting.maxLength, setting.multiline, setting.resizable);
          } else if (setting.type === 'number') {
            control = createNumber(setting.key, value, setting.placeholder, setting.min, setting.max, setting.step);
          } else if (setting.type === 'dropdown') {
            control = createSelect(setting.key, setting.values, value, setting.showBlank);
          } else if (setting.type === 'bool') {
            control = createCheckbox(setting.key, value);
          }

          div.appendChild(createLabel(setting.label, control.id));
          div.appendChild(control);
          controls[setting.key] = control;
          control.addEventListener(setting.type === 'dropdown' ? 'change' : 'input', function () {
            if (ret.onchange) {
              var control = controls[setting.key],
                  _value = setting.type === 'bool' ? control.checked : control.value;

              ret.onchange(setting.key, _value);
            }
          });
        });
        div.appendChild(createButton('Save', function () {
          settings.filter(function (_ref4) {
            var {
              type: type
            } = _ref4;
            return type !== 'hidden';
          }).forEach(function (_ref5) {
            var {
              key: key,
              type: type
            } = _ref5,
                control = controls[key];
            cfg[key] = type === 'bool' ? control.checked : control.value;
          });
          save(cfg);

          if (ret.onsave) {
            ret.onsave(cfg);
          }

          div.remove();
        }, 'save'));
        div.appendChild(createButton('Cancel', function () {
          if (ret.oncancel) {
            ret.oncancel(cfg);
          }

          div.remove();
        }, 'cancel'));
        document.body.appendChild(div);
      };

      init(load());
    };

    addStyle();
    ret = {
      load: load,
      save: save,
      setup: setup
    };
    return ret;
  };
})();