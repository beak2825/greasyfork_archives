// ==UserScript==
// @name         Mouse Gestures like Opera
// @namespace    https://greasyfork.org/users/37096/
// @homepage     https://greasyfork.org/scripts/33398/
// @supportURL   https://greasyfork.org/scripts/33398/feedback
// @version      1.1.0
// @description  A Mouse Gestures script is the same as in the old Opera
// @author       Hồng Minh Tâm
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @icon         https://png.icons8.com/ultraviolet/40/000000/mouse-right-click.png
// @include      *
// @compatible   chrome
// @license      GNU GPLv3
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @grant        window.focus
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/33398/Mouse%20Gestures%20like%20Opera.user.js
// @updateURL https://update.greasyfork.org/scripts/33398/Mouse%20Gestures%20like%20Opera.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle([
    '[class*="mglo-"], [class*="mglo-"] * { background-color: transparent; color: #333; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; line-height: 1.5; padding: 0; margin: 0; min-width: auto; min-height: auto; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }',
    '[class*="mglo-"]:before, [class*="mglo-"]:after, [class*="mglo-"] *:before, [class*="mglo-"] *:after { background-color: transparent; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }',
    /*main*/
    '.mglo { z-index: 10000000000; position: fixed; overflow: hidden; border: 1px solid #CCC; white-space: nowrap; font-family: sans-serif; background-color: rgba(0, 0, 0, 0.7); color: #333; border-radius: 50%; width: 400px; height: 400px; }',

    '.mglo .mglo-middle, .mglo .mglo-up, .mglo .mglo-down, .mglo .mglo-left, .mglo .mglo-right { display: table; position: absolute; height: 160px; width: 160px; padding: 0; margin: 0; }',
    '.mglo .mglo-middle { top: 50%; left: 50%; margin-top: -20px; margin-left: -80px; width: 160px; height: 160px; text-align: center; }',
    '.mglo .mglo-up { top: 0; left: 50%; margin-left: -80px; }',
    '.mglo .mglo-down { bottom: 0; left: 50%; margin-left: -80px; }',
    '.mglo .mglo-left { top: 50%; left: 0; margin-top: -80px; }',
    '.mglo .mglo-right { top: 50%; right: 0; margin-top: -80px; }',

    '.mglo .mglo-label { color: #fff; font-family: Arial,"Helvetica Neue",Helvetica,sans-serif; font-weight: 700; font-size: 16px; text-transform: none; letter-spacing: normal; white-space: pre-wrap; padding: 0; margin: 0; -webkit-transition: all .2s; -moz-transition: all .2s; transition: all .2s; line-height: 22px; }',
    '.mglo .mglo-up > .mglo-label { display: table-cell; vertical-align: bottom; text-align: center; padding-bottom: 50px; }',
    '.mglo .mglo-down > .mglo-label { display: table-cell; vertical-align: top; text-align: center; padding-top: 50px; }',
    '.mglo .mglo-left > .mglo-label { display: table-cell; vertical-align: middle; text-align: right; padding-right: 50px; }',
    '.mglo .mglo-right > .mglo-label { display: table-cell; vertical-align: middle; text-align: left; padding-left: 50px; }',

    '.mglo .mglo-icon { position: absolute; width: initial; display: initial; }',
    '.mglo .mglo-middle > .mglo-icon { position: initial; }',
    '.mglo .mglo-up > .mglo-icon { bottom: 0; left: 50%; margin-left: -20px; }',
    '.mglo .mglo-down > .mglo-icon { top: 0; left: 50%; margin-left: -20px; }',
    '.mglo .mglo-left > .mglo-icon { top: 50%; right: 0; margin-top: -20px; }',
    '.mglo .mglo-right > .mglo-icon { top: 50%; left: 0; margin-top: -20px; }',

    '.mglo .active > .mglo-label { background-color: transparent; color: #ffff00; }',
    '.mglo .mglo-up.active > .mglo-label { padding-bottom: 10px; }',
    '.mglo .mglo-down.active > .mglo-label { padding-top: 10px; }',
    '.mglo .mglo-left.active > .mglo-label { padding-right: 10px; }',
    '.mglo .mglo-right.active > .mglo-label { padding-left: 10px; }',
    '.mglo .active > .mglo-icon { display: none; }',

    '.mglo.hide, .mglo .hide { display: none; }',
    /*list icon*/
    '.mglo-list-icon { line-height: 0; margin-bottom: 10px; }',
    '.mglo-list-icon > .mglo-icon { width: 30px; height: 30px; -webkit-user-drag: none; user-select: none; }',
    '.mglo-list-icon-group > label { display: inline-block; margin-bottom: 5px; }',
    '.mglo-list-icon-group.inline .mglo-list-icon { display: inline-block; }',
    /*dialog*/
    '.mglo-dialog { z-index: 9999999999; padding-top: 30px; padding-bottom: 30px; position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0,0,0,0.5); }',
    '.mglo-dialog-content { max-height: 100%; min-height: 200px; display: -webkit-box; display: -moz-box; display: -ms-flexbox; display: -webkit-flex; display: flex; -webkit-box-orient: vertical; -moz-box-orient: vertical; -webkit-flex-flow: column; -ms-flex-direction: column; flex-flow: column; margin: auto; background-color: #fff; position: relative; outline: 0; width: 600px; }',
    '.mglo-dialog-form { display: -webkit-box; display: -moz-box; display: -ms-flexbox; display: -webkit-flex; display: flex; -webkit-box-orient: vertical; -moz-box-orient: vertical; -webkit-flex-flow: column; -ms-flex-direction: column; flex-flow: column; }',
    '.mglo-dialog-header { color: #fff; background-color: #2196F3; padding: 15px; font-weight: 700; position: relative; }',
    '.mglo-dialog-body { overflow: auto; padding: 15px; }',
    '.mglo-dialog-footer { background-color: #f9f9f9; border-top: 1px solid #ddd; padding: 8px 15px; text-align: right; }',
    '.mglo-dialog-footer > button + button {  margin-left: 8px; }',
    '.mglo-dialog-footer:empty { display: none; }',
    '.mglo-dialog-footer:before, .mglo-dialog-footer:after { content: ""; display: table; clear: both; }',
    '.mglo-dialog .mglo-close { position: absolute; right: 0; top: 0; bottom: 0; padding: 0 20px; border: none; box-shadow: none; border-radius: 0; outline: 0; text-decoration: none; color: inherit; background-color: inherit; font-size: 24px; font-weight: 700; }',
    '.mglo-dialog .mglo-close:hover { color: #fff; background-color: #f44336; }',
    /*form*/
    '.mglo-form-group > label { display: inline-block; margin-bottom: 5px; }',
    '.mglo-form-control { padding: 5px 10px; color: #333; background-color: #fff; border: 1px solid #ccc; width: 100%; display: block; margin-bottom: 10px }',
    '.mglo-form-group.inline .mglo-form-control { display: inline-block; margin-left: 8px; width: auto; }',
    '.mglo-form-control[disabled] { background-color: #eee; color: #888 }',

    '.mglo-form-check { display: block; margin-bottom: 10px; }',
    '.mglo-form-group.inline .mglo-form-check { display: inline-block; }',
    '.mglo-form-group.inline .mglo-form-check + .mglo-form-check { margin-left: 10px; }',
    '.mglo-form-check-label { position: relative; padding: 0; margin: 0; display: inline-block; }',
    '.mglo-form-check-input { display: none !important; }',
    'input.mglo-form-check-input + span, input.mglo-form-check-input + span { padding: 0; margin: 0; }',
    '.mglo-form-check-input + span:before { position: relative; top: 5px; display: inline-block; width: 20px; height: 20px; content: ""; border: 2px solid #c0c0c0; margin-right: 8px; background-color: #fff; }',
    '.mglo-form-check-input:checked + span:before { border-color: #3e97eb; }',
    '.mglo-form-check-input:checked + span:after { content: ""; position: absolute; }',
    '.mglo-form-check-input[type="checkbox"] +span:before { border-radius: 2px; }',
    '.mglo-form-check-input[type="checkbox"]:checked + span:before { background: #3e97eb; }',
    '.mglo-form-check-input[type="checkbox"]:checked + span:after { top: 8px; left: 7px; width: 6px; height: 12px; transform: rotate(45deg); border: 2px solid #fff; border-top: 0; border-left: 0; }',
    '.mglo-form-check-input[type="radio"] +span:before { border-radius: 50%; }',
    '.mglo-form-check-input[type="radio"]:checked + span:after { top: 10px; left: 5px; width: 10px; height: 10px; border-radius: 50%; background: #3e97eb; }',

    '.mglo-form-no-label, .mglo-form-no-label input, .mglo-form-no-label select { margin-bottom: 0; }',
    '.mglo-form-no-label .mglo-form-check-input + span:before { margin-right: 0; }',
    '.mglo-form-no-label .mglo-form-check-label { height: 30px; }',
    '.mglo-form-no-label .mglo-list-icon { margin-bottom: 0; }',
    /*button*/
    '.mglo-btn { padding: 5px 10px; color: #333; background-color: #fff; border: 1px solid #ccc; }',
    '.mglo-btn:hover { color: #333; background-color: #e6e6e6; }',
    '.mglo-btn:active { background-color: #c6c6c6; }',
    '.mglo-btn.blue { color: #fff; background-color: #2196F3; border-color: #2196F3; }',
    '.mglo-btn.red { color: #fff; background-color: #f44336; border-color: #f44336; }',
    '.mglo-btn.left { float: left; }',
    '.mglo-btn.right { float: right; }',
    /*inputmg*/
    '.mglo-form-group.mglo-form-group-record { display: flex; }',
    '.mglo-form-group.mglo-form-group-record .mglo-btn.mglo-btn-record:before { display: block; content: ""; background-color: #808080; width: 12px; height: 12px; border-radius: 50%; transition: 0.2s; }',
    '.mglo-form-group.mglo-form-group-record .mglo-btn.mglo-btn-record:hover:before { background-color: #f44336; transition: 0.2s; }',
    '.mglo-form-group.mglo-form-group-record .mglo-form-control { text-transform: uppercase; font-weight: 700; }',
    '.mglo-record-backdrop { z-index: 9999999999; position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0,0,0,0.5); }',
    '.mglo-record-backdrop .mglo-list-icon { position: absolute; bottom: 0; left: 0; right: 0;text-align: center; background-color: rgba(0,0,0,0.5); }',
    '.mglo-record-backdrop .mglo-list-icon > .mglo-icon { margin-top: 20px; margin-bottom: 20px; }',
    /*table*/
    '.mglo-table { border: 1px solid #c0c0c0; border-collapse: collapse; border-spacing: 0; width: 100%; }',
    '.mglo-table th { font-weight: 700; }',
    '.mglo-table tr { border-bottom: 1px solid #c0c0c0; }',
    '.mglo-table td, .mglo-table th { padding: 8px; vertical-align: top; }',
    '.mglo-table tr:nth-child(even) { background-color: #f1f1f1; }',
    /*item*/
    '.mglo-item { padding: 8px; border: 1px solid #ccc; }',
    '.mglo-item + .mglo-item { margin-top: 5px; }',
    '.mglo-item>*:last-child, .mglo-item>*:last-child>*:last-child { margin-bottom: 0; }'
  ].join('\n'));

  var varw = (function (context) {
    return function (varName, varValue, setEvent) {
      var value = varValue;
      Object.defineProperty(context, varName, {
        get: function () {
          return value;
        },
        set: function (v) {
          value = v;
          if (setEvent) {
            setEvent(v);
          }
        }
      });
    };
  })(unsafeWindow);

  varw('isRecord', false, function (value) {
    recordMG(value);
  });

  var SENSITIVITY = 20;
  var startX, startY;
  var gesture = '';
  var gestures;
  var values;
  var preventContextMenu = false;
  var mouseDownTriggered = false;
  var timeoutDelay;
  var dialogSetting;
  var icon = {
    up: getIcons8('ultraviolet', 'up', 40, '000000'),
    down: getIcons8('ultraviolet', 'down', 40, '000000'),
    left: getIcons8('ultraviolet', 'left', 40, '000000'),
    right: getIcons8('ultraviolet', 'right', 40, '000000'),
    mouseRightClick: getIcons8('ultraviolet', 'mouse-right-click', 40, '000000')
  };
  var $contentSetting = $('<div/>');
  var $buttonReset = $('<button/>', {
    class: 'mglo-btn',
    type: 'reset',
    text: 'Reset'
  });
  var $buttonSave = $('<button/>', {
    class: 'mglo-btn blue',
    text: 'Save'
  });
  var $buttonFooterSettings = [$buttonReset, $buttonSave];
  var $currentInputMG;
  var $recordBackdrop = $('<div/>', {
    class: 'mglo-record-backdrop'
  });
  var gestureStrings = {
    up: 'u',
    down: 'd',
    left: 'l',
    right: 'r'
  };
  var defaultActions = {
    closeTab: {
      label: 'Close tab',
      category: 'Tab',
      fn: function () {
        window.top.close();
      }
    },
    newTab: {
      label: 'New tab',
      category: 'Tab',
      fn: function () {
        defaultActions.openInNewTab.fn();
      }
    },
    duplicateTab: {
      label: 'Duplicate tab',
      category: 'Tab',
      fn: function () {
        defaultActions.openInNewTab.fn(unsafeWindow.location.href);
      }
    },
    openInNewTab: {
      label: 'Open link in new tab',
      category: 'Tab',
      fn: function (link) {
        GM_openInTab(link, false);
      },
      onLink: true
    },
    openInNewBackgroundTab: {
      label: 'Open link in new background tab',
      category: 'Tab',
      fn: function (link) {
        GM_openInTab(link, true);
      },
      onLink: true
    },
    scrollUp: {
      label: 'Scroll up',
      category: 'Scroll',
      fn: function () {
        $('html, body').animate({
          scrollTop: '-=600'
        }, 'slow');
      }
    },
    scrollDown: {
      label: 'Scroll down',
      category: 'Scroll',
      fn: function () {
        $('html, body').animate({
          scrollTop: '+=600'
        }, 'slow');
      }
    },
    scrollToTop: {
      label: 'Scroll to top',
      category: 'Scroll',
      fn: function () {
        $('html, body').animate({
          scrollTop: 0
        }, 'slow');
      }
    },
    scrollToBottom: {
      label: 'Scroll to bottom',
      category: 'Scroll',
      fn: function () {
        $('html, body').animate({
          scrollTop: $(document).height()
        }, 'slow');
      }
    },
    scrollUpOnElement: {
      label: 'Scroll up on element',
      category: 'Scroll',
      fn: function () {
        var scrollChange = (values.$vScrollBarUp.is('html, body') ? $(window).height() : values.$vScrollBarUp.innerHeight()) * 5 / 7;
        values.$vScrollBarUp.animate({
          scrollTop: '-=' + scrollChange
        }, 'slow');
      }
    },
    scrollDownOnElement: {
      label: 'Scroll down on element',
      category: 'Scroll',
      fn: function () {
        var scrollChange = (values.$vScrollBarDown.is('html, body') ? $(window).height() : values.$vScrollBarDown.innerHeight()) * 5 / 7;
        values.$vScrollBarDown.animate({
          scrollTop: '+=' + scrollChange
        }, 'slow');
      }
    },
    back: {
      label: 'Back',
      category: 'Navigation',
      fn: function () {
        unsafeWindow.history.back();
      }
    },
    forward: {
      label: 'Forward',
      category: 'Navigation',
      fn: function () {
        unsafeWindow.history.forward();
      }
    },
    reload: {
      label: 'Reload',
      category: 'Load',
      fn: function () {
        unsafeWindow.location.reload();
      }
    },
    reloadWithoutCache: {
      label: 'Reload without cache',
      category: 'Load',
      fn: function () {
        unsafeWindow.location.reload(true);
      }
    },
    // settingsMGLO: {
    //   label: 'Settings Mouse Gestures like Opera',
    //   category: 'Other',
    //   fn: function () {
    //     showDialogSetting();
    //   }
    // },
  };
  var defaultGestures = {
    u: {
      gesture: 'scrollUpOnElement',
    },
    d: {
      gesture: 'scrollDownOnElement',
    },
    // u: {
    //     gesture: 'scrollUp',
    // },
    // d: {
    //     gesture: 'scrollDown',
    // },
    l: {
      gesture: 'back',
    },
    r: {
      gesture: 'forward',
    },
    ud: {
      gesture: 'reload',
    },
    ur: {
      gesture: 'newTab',
    },
    du: {
      gesture: 'duplicateTab',
    },
    dl: {
      gesture: 'openInNewTab',
    },
    dr: {
      gesture: 'closeTab',
    },
    // lu: {
    //     gesture: 'scrollUpOnElement',
    // },
    // ld: {
    //     gesture: 'scrollDownOnElement',
    // },
    ru: {
      gesture: 'scrollToTop',
    },
    rd: {
      gesture: 'scrollToBottom',
    },
    udu: {
      gesture: 'reloadWithoutCache',
    },
    dld: {
      gesture: 'openInNewBackgroundTab',
    },
    // dudu: {
    //   gesture: 'settingsMGLO',
    // }
  };

  function getIcons8(style, id, size, color) {
    return 'https://png.icons8.com/' + style + '/' + size + '/' + color + '/' + id + '.png';
  }

  // function setGestures() {
  //   GM_setValue('gestures', gestures);
  // }

  // function getGestures() {
  //   return GM_getValue('gestures');
  // }

  // function loadGestures() {
  //   var valueGestures = getGestures();
  //   if (valueGestures) {
  //     gestures = valueGestures;
  //   } else {
  //     resetGestures();
  //   }
  // }

  // function resetGestures() {
  //   gestures = defaultGestures;
  //   setGestures();
  // }

  // loadGestures();
  gestures = defaultGestures;

  var $mouseGestures = $('<div/>', {
    class: 'mglo hide'
  }).appendTo(document.body);
  var widthMouseGestures = $mouseGestures.width();
  var heightMouseGestures = $mouseGestures.height();
  var halfWidthMouseGestures = widthMouseGestures / 2;
  var halfHeightMouseGestures = heightMouseGestures / 2;

  var $up = $('<div/>', {
    class: 'mglo-up'
  }).appendTo($mouseGestures);
  var $upIcon = $('<img/>', {
    class: 'mglo-icon',
    src: icon.up
  }).appendTo($up);
  var $upLabel = $('<div/>', {
    class: 'mglo-label'
  }).appendTo($up);

  var $down = $('<div/>', {
    class: 'mglo-down'
  }).appendTo($mouseGestures);
  var $downIcon = $('<img/>', {
    class: 'mglo-icon',
    src: icon.down
  }).appendTo($down);
  var $downLabel = $('<div/>', {
    class: 'mglo-label'
  }).appendTo($down);

  var $left = $('<div/>', {
    class: 'mglo-left'
  }).appendTo($mouseGestures);
  var $leftIcon = $('<img/>', {
    class: 'mglo-icon',
    src: icon.left
  }).appendTo($left);
  var $leftLabel = $('<div/>', {
    class: 'mglo-label'
  }).appendTo($left);

  var $right = $('<div/>', {
    class: 'mglo-right'
  }).appendTo($mouseGestures);
  var $rightIcon = $('<img/>', {
    class: 'mglo-icon',
    src: icon.right
  }).appendTo($right);
  var $rightLabel = $('<div/>', {
    class: 'mglo-label'
  }).appendTo($right);

  var $middle = $('<div/>', {
    class: 'mglo-middle'
  }).appendTo($mouseGestures);
  var $middleIcon = $('<img/>', {
    class: 'mglo-icon',
    src: icon.mouseRightClick
  }).appendTo($middle);
  var $middleLabel = $('<div/>', {
    class: 'mglo-label'
  }).appendTo($middle);

  var ListIcon = (function () {
    function ListIcon(label, attribute) {
      this.gesture = '';
      var $control = $('<div/>', {
        class: 'mglo-list-icon-group'
      });
      if (typeof label === 'undefined') {
        $control.addClass('mglo-form-no-label');
      } else {
        var $label = $('<label/>');
        $label.text(label);
        $label.appendTo($control);
      }
      var $listIcon = $('<div/>', attribute);
      $listIcon.addClass('mglo-list-icon');
      $listIcon.appendTo($control);
      this.$listIcon = $listIcon;
      this.$element = $control;
      this.setGesture(attribute.gesture);
    }
    ListIcon.prototype = {
      setGesture: function (gesture) {
        var _this = this;
        this.gesture = gesture;
        this.$listIcon.empty();
        this.$listIcon.data('data-gesture', gesture);
        gesture.split('').forEach(function (c) {
          switch (c) {
            case gestureStrings.up:
              $upIcon.clone().appendTo(_this.$listIcon);
              break;
            case gestureStrings.down:
              $downIcon.clone().appendTo(_this.$listIcon);
              break;
            case gestureStrings.left:
              $leftIcon.clone().appendTo(_this.$listIcon);
              break;
            case gestureStrings.right:
              $rightIcon.clone().appendTo(_this.$listIcon);
              break;
          }
        });
      }
    };
    return ListIcon;
  })();

  var Form = {
    Control: (function () {
      function Control(type, label, attribute, event) {
        if (typeof attribute !== 'object') {
          attribute = {};
        }
        if (typeof attribute.id === 'undefined') {
          attribute.id = 'mglo-' + type + '-' + new Date().getTime();
        }
        var $control = $('<div/>', {
          class: 'mglo-form-group'
        });
        if (typeof label === 'undefined') {
          $control.addClass('mglo-form-no-label');
        } else {
          var $label = $('<label/>', {
            for: attribute.id
          });
          $label.text(label);
          $label.appendTo($control);
        }
        var $input = $('<input/>', attribute);
        $input.attr({
          type: type,
          class: 'mglo-form-control'
        });
        $input.appendTo($control);
        this.label = label;
        this.id = attribute.id;
        this.$input = $input;
        this.$element = $control;
        if (type === 'number') {
          $input.on('input.mglo', function (e) {
            e.target.value = parseInt(e.target.value) ? e.target.value.replace(/^0+/, '') : (this.min || 0);
            event(e);
          });
        } else {
          $input.on('input.mglo', event);
        }
      }
      Control.prototype = {
        oninput: function (event) {
          this.$input.on('input.mglo', function (e) {
            e.target.value = parseInt(e.target.value) ? e.target.value.replace(/^0+/, '') : (this.min || 0);
            event(e);
          });
        }
      };
      return Control;
    }()),
    Select: (function () {
      function Select(label, attribute, event) {
        var items = [],
          itemElements = [],
          value;
        if (typeof attribute !== 'object') {
          attribute = {};
        }
        if (typeof attribute.id === 'undefined') {
          attribute.id = 'mglo-select-' + new Date().getTime();
        }
        if (typeof attribute.items !== 'undefined') {
          items = $.extend(true, [], attribute.items);
          delete attribute.items;
        }
        if (typeof attribute.value !== 'undefined') {
          value = attribute.value;
        }
        var $control = $('<div/>', {
          class: 'mglo-form-group',
        });
        if (typeof label === 'undefined') {
          $control.addClass('mglo-form-no-label');
        } else {
          var $label = $('<label/>', {
            for: attribute.id
          });
          $label.text(label);
          $label.appendTo($control);
        }
        var $select = $('<select/>', attribute);
        $select.attr('class', 'mglo-form-control');
        $select.appendTo($control);
        if (!Array.isArray(items)) {
          items = [items];
        }
        for (var i = 0; i < items.length; i++) {
          var text = items[i].label;
          var $item = $('<option/>', items[i]);
          $item.text(text);
          if (value === items[i].value) {
            $item.prop('selected', true);
          }
          if (typeof items[i].optgroup !== 'undefined') {
            if ($select.find('optgroup[label="' + items[i].optgroup + '"]').size()) {
              $select.find('optgroup[label="' + items[i].optgroup + '"]').append($item);
            } else {
              var $optgroup = $('<optgroup/>', {
                label: items[i].optgroup
              });
              $optgroup.append($item);
              $optgroup.appendTo($select);
            }
          } else {
            $item.appendTo($select);
          }
          itemElements.push($item);
        }
        this.label = label;
        this.id = attribute.id;
        this.$select = $select;
        this.$element = $control;
        this.items = itemElements;
        $select.on('change.mglo', event);
      }
      Select.prototype = {
        onchange: function (event) {
          this.$select.on('change.mglo', event);
        }
      };
      return Select;
    }()),
    CheckInput: (function () {
      function CheckInput(type, label, attribute, event) {
        if (typeof attribute !== 'object') {
          attribute = {};
        }
        if (typeof attribute.id === 'undefined') {
          attribute.id = 'mglo-' + type + '-' + new Date().getTime();
        }
        var $checkInput = $('<div/>', {
          class: 'mglo-form-check',
        });
        if (typeof label === 'undefined') {
          $checkInput.addClass('mglo-form-no-label');
        }
        var $label = $('<label/>', {
          class: 'mglo-form-check-label'
        }).appendTo($checkInput);
        var $input = $('<input/>', attribute);
        $input.attr({
          type: type,
          class: 'mglo-form-check-input'
        });
        $input.appendTo($label);
        var $text = $('<span/>').text(label);
        $text.appendTo($label);
        this.label = label;
        this.id = attribute.id;
        this.$input = $input;
        this.$element = $checkInput;
        $input.on('change.mglo', event);
      }
      CheckInput.prototype = {
        onchange: function (event) {
          this.$input.on('change.mglo', event);
        },
      };
      CheckInput.createGroup = function (name, checkInputs) {
        var $checkInputGroup = $('<div/>', {
          class: 'mglo-form-group',
          id: name
        });
        for (var i = 0; i < checkInputs.length; i++) {
          var checkInput = checkInputs[i];
          checkInput.$input.name = name;
          $checkInputGroup.append(checkInput.$element);
        }
        return $checkInputGroup;
      };
      return CheckInput;
    }()),
    InputMG: (function () {
      function InputMG(label, attribute) {
        if (typeof attribute !== 'object') {
          attribute = {};
        }
        if (typeof attribute.id === 'undefined') {
          attribute.id = 'mglo-input-mg-' + new Date().getTime();
        }
        var $control = $('<div/>', {
          class: 'mglo-form-group mglo-form-group-record'
        });
        if (typeof label === 'undefined') {
          $control.addClass('mglo-form-no-label');
        } else {
          var $label = $('<label/>', {
            for: attribute.id
          });
          $label.text(label);
          $label.appendTo($control);
        }
        var $input = $('<input/>', attribute);
        $input.attr({
          type: 'text',
          class: 'mglo-form-control'
        });
        $input.appendTo($control);
        var $recordButton = $('<button/>', {
          class: 'mglo-btn mglo-btn-record'
        });
        $recordButton.on('click.mglo', function (e) {
          e.preventDefault();
          $currentInputMG = $(this).parent().find('input.mglo-form-control');
          isRecord = true;
        });
        $recordButton.appendTo($control);
        this.label = label;
        this.id = attribute.id;
        this.$input = $input;
        this.$element = $control;
        this.$recordButton = $recordButton;
        $input.on('keypress.mglo', function (e) {
          var key = e.keyCode;
          key = String.fromCharCode(key);
          var regex = /(\b(?:([UDLRudlr])(?!\2{1}))+\b)/g;
          if (!regex.test(key)) {
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
          }
        }).on('input.mglo', function (e) {
          $(this).val(function (i, val) {
            return val.toLowerCase();
          });
        });
      }
      return InputMG;
    }()),
  };

  var recordListIcon = new ListIcon(undefined, {
    gesture: gesture
  });

  function mouseMoveMG(e) {
    if (startY - e.clientY > 10 || e.clientY - startY > 10 || startX - e.clientX > 10 || e.clientX - startX > 10) {
      preventContextMenu = false;
      if (mouseDownTriggered) {
        mouseDownTriggered = false;
      } else {
        clearTimeout(timeoutDelay);
        showMG(e);
        checkMG(e);
      }
    }
  }

  function mouseDownMG(e, data) {
    e = data || e;
    if (e.which === 3) {
      getValues(e);
      preventContextMenu = false;
      mouseDownTriggered = true;
      startX = e.clientX;
      startY = e.clientY;
      gesture = '';
      loadMG();
      timeoutDelay = setTimeout(function () {
        showMG(e);
      }, 500);
      $(document).on('mousemove.mglo', mouseMoveMG);
    }
  }

  function mouseUpMG(e) {
    clearTimeout(timeoutDelay);
    $(document).off('mousemove.mglo');
    if (isRecord === false && checkTypeItemMG('link', gesture, true)) {
      switch (gesture.slice(-1)) {
        case gestureStrings.up:
          $down.addClass('hide');
          $left.addClass('hide');
          $right.addClass('hide');
          break;
        case gestureStrings.down:
          $up.addClass('hide');
          $left.addClass('hide');
          $right.addClass('hide');
          break;
        case gestureStrings.left:
          $up.addClass('hide');
          $down.addClass('hide');
          $right.addClass('hide');
          break;
        case gestureStrings.right:
          $up.addClass('hide');
          $down.addClass('hide');
          $left.addClass('hide');
          break;
      }
      $mouseGestures.delay(300).addClass('hide');
    } else {
      $mouseGestures.addClass('hide');
      if (isRecord === true && gesture) {
        isRecord = false;
      }
    }
    gesture = '';
  }

  function contextMenuMG(e) {
    if (preventContextMenu) e.preventDefault();
  }

  $(document).on('mousedown.mglo', mouseDownMG)
    .on('mouseup.mglo', mouseUpMG)
    .on('contextmenu.mglo', contextMenuMG);

  function showMG(e) {
    preventContextMenu = true;
    var mouseX = e.pageX - $(window).scrollLeft();
    var mouseY = e.pageY - $(window).scrollTop();
    $mouseGestures.css({
      left: mouseX - halfWidthMouseGestures,
      top: mouseY - halfHeightMouseGestures
    }).stop(true, true);
    $mouseGestures.removeClass('hide');
  }

  function checkMG(e) {
    checkMove(startY - e.clientY, gestureStrings.up, e);
    checkMove(e.clientY - startY, gestureStrings.down, e);
    checkMove(startX - e.clientX, gestureStrings.left, e);
    checkMove(e.clientX - startX, gestureStrings.right, e);
    if (isRecord === true) {
      recordListIcon.setGesture(gesture);
    }
  }

  function checkMove(p, t, e) {
    if (p >= SENSITIVITY) {
      startX = e.clientX;
      startY = e.clientY;
      if (gesture.slice(-1) != t) {
        gesture += t;
        loadMG();
      }
    }
  }

  function loadMG() {
    if (checkTypeItemMG('link', gesture + gestureStrings.up)) {
      $up.removeClass('active hide');
      $upLabel.text(getGesture(gesture + gestureStrings.up, 'label'));
    } else {
      $up.addClass('hide');
    }
    if (checkTypeItemMG('link', gesture + gestureStrings.down)) {
      $down.removeClass('active hide');
      $downLabel.text(getGesture(gesture + gestureStrings.down, 'label'));
    } else {
      $down.addClass('hide');
    }
    if (checkTypeItemMG('link', gesture + gestureStrings.left)) {
      $left.removeClass('active hide');
      $leftLabel.text(getGesture(gesture + gestureStrings.left, 'label'));
    } else {
      $left.addClass('hide');
    }
    if (checkTypeItemMG('link', gesture + gestureStrings.right)) {
      $right.removeClass('active hide');
      $rightLabel.text(getGesture(gesture + gestureStrings.right, 'label'));
    } else {
      $right.addClass('hide');
    }

    if (checkTypeItemMG('link', gesture)) {
      switch (gesture.slice(-1)) {
        case gestureStrings.up:
          $up.removeClass('hide').addClass('active');
          break;
        case gestureStrings.down:
          $down.removeClass('hide').addClass('active');
          break;
        case gestureStrings.left:
          $left.removeClass('hide').addClass('active');
          break;
        case gestureStrings.right:
          $right.removeClass('hide').addClass('active');
          break;
      }
    }
  }

  function recordMG(isTurn) {
    if (isTurn === true) {
      if (dialogSetting && dialogSetting.isShow) {
        $recordBackdrop.insertAfter(dialogSetting.$dialog);
      } else {
        $recordBackdrop.appendTo(document.body);
      }
      recordListIcon.$element.appendTo($recordBackdrop);
    } else if (isTurn === false && gesture) {
      $currentInputMG.val(gesture);
      recordListIcon.setGesture('');
      $recordBackdrop.remove();
    }
  }

  function getValues(e) {
    values = {};
    values.$target = $(e.target);
    if (values.$target.closest('a').length) {
      values.link = values.$target.closest('a').prop('href');
    }
    values.$vScrollBar = values.$target.vScrollBarParent();
    values.$vScrollBarUp = values.$target.vScrollBarParent('up');
    values.$vScrollBarDown = values.$target.vScrollBarParent('down');
  }

  function getGesture(gesture, prototype) {
    if (typeof prototype !== 'undefined') {
      if (gestures[gesture].gesture !== 'custom') {
        return defaultActions[gestures[gesture].gesture][prototype];
      } else {
        return gestures[gesture].custom[prototype];
      }
    } else {
      if (gestures[gesture].gesture !== 'custom') {
        return defaultActions[gestures[gesture].gesture];
      } else {
        return gestures[gesture].custom;
      }
    }
  }

  function checkTypeItemMG(type, gesture, runFunction) {
    if (typeof runFunction === 'undefined') {
      runFunction = false;
    }
    if (gestures[gesture]) {
      if (getGesture(gesture, 'on' + type.toCapitalize().replace(' ', ''))) {
        if (values[type]) {
          if (runFunction === true) {
            getGesture(gesture, 'fn')(values[type]);
          }
          return true;
        } else {
          return false;
        }
      } else {
        if (runFunction === true) {
          getGesture(gesture, 'fn')();
        }
        return true;
      }
    } else {
      return false;
    }
  }

  String.prototype.toCapitalize = function () {
    return this.replace(/(\b)([a-zA-Z])/g, function (m) {
      return m.toUpperCase();
    });
  };

  var Dialog = (function () {
    function Dialog(title, $content, $buttonFooters, isForm, id) {
      if (typeof id === 'undefined') {
        id = 'dialog-' + new Date().getTime();
      }
      if (typeof isForm === 'undefined') {
        isForm = false;
      }
      this.title = title;
      this.$content = $content.clone(true, true);
      this.id = id;
      this.isShow = false;
      this.status = 'create';
      var $dialog = $('<div/>', {
        class: 'mglo-dialog',
        id: this.id
      });
      this.$dialog = $dialog;
      $dialog.get(0).onclick = this.close.bind(this);
      var $dialogContent = $('<div/>', {
        class: 'mglo-dialog-content'
      });
      $dialogContent.appendTo($dialog);

      var $dialogForm = $('<form/>', {
        class: 'mglo-dialog-form'
      });
      if (isForm === true) {
        $dialogForm.appendTo($dialogContent);
      }

      var $dialogHeader = $('<div/>', {
        class: 'mglo-dialog-header'
      });
      $dialogHeader.append(this.title);
      if (isForm === true) {
        $dialogHeader.appendTo($dialogForm);
      } else {
        $dialogHeader.appendTo($dialogContent);
      }
      var $buttonClose = $('<button/>', {
        class: 'mglo-close'
      });
      $buttonClose.html('\u00d7');
      $buttonClose.get(0).onclick = this.close.bind(this);
      $buttonClose.appendTo($dialogHeader);


      var $dialogBody = $('<div/>', {
        class: 'mglo-dialog-body'
      });
      $dialogBody.append(this.$content);
      if (isForm === true) {
        $dialogBody.appendTo($dialogForm);
      } else {
        $dialogBody.appendTo($dialogContent);
      }

      var $dialogFooter = $('<div/>', {
        class: 'mglo-dialog-footer'
      });
      if (isForm === true) {
        $dialogFooter.appendTo($dialogForm);
      } else {
        $dialogFooter.appendTo($dialogContent);
      }
      if (typeof $buttonFooters !== 'undefined') {
        if ($buttonFooters instanceof jQuery) {
          $buttonFooters.each(function () {
            $(this).clone(true, true).appendTo($dialogFooter);
          });
        } else if ($buttonFooters instanceof Array) {
          $.each($buttonFooters, function (index, $button) {
            $button.clone(true, true).appendTo($dialogFooter);
          });
        } else if ($buttonFooters instanceof Object) {
          $.each($buttonFooters, function (key, $button) {
            $button.clone(true, true).appendTo($dialogFooter);
          });
        }
      }
      $dialogContent.click(function (e) {
        e.stopPropagation();
      });
    }
    Dialog.prototype = {
      show: function () {
        if ($mouseGestures.size()) {
          this.$dialog.insertBefore($mouseGestures);
        } else {
          this.$dialog.appendTo(document.body);
        }
        this.isShow = true;
        this.status = 'show';
      },
      close: function () {
        this.$dialog.remove();
        this.isShow = false;
        this.status = 'close';
      }
    };
    return Dialog;
  })();

  var ItemMG = (function () {
    function ItemMG(gesture, action, options) {
      var _this = this;
      this.gesture = gesture;
      this.action = action;
      var $itemMG = $('<div/>', {
        class: 'mglo-item'
      });
      var listIcon = new ListIcon('Gesture', {
        gesture: gesture
      });
      listIcon.$element.appendTo($itemMG);
      var itemActions = [];
      $.each(defaultActions, function (nameGesture, value) {
        if (options.onLink !== true && value.onLink !== true || options.onLink === true && value.onLink === true) {
          var item = {};
          item.value = nameGesture;
          item.label = value.label;
          item.optgroup = value.category;

          $.each(gestures, function (gesture, value) {
            if (value.gesture === nameGesture && nameGesture !== action) {
              item.disabled = true;
            }
          });

          itemActions.push(item);
        }
      });

      var inputMG = new Form.InputMG(undefined, {
        value: gesture
      });
      inputMG.$element.appendTo($itemMG);

      var selectAction = new Form.Select('Action', {
        required: true,
        items: itemActions,
        value: action
      }, function (e) {
        return _this.setAction(e.target.value);
      });

      selectAction.$element.appendTo($itemMG);
      this.listIcon = listIcon;
      this.inputMG = inputMG;
      this.selectAction = selectAction;
      this.$element = $itemMG;
    }
    ItemMG.prototype = {
      setGesture: function (gesture) {
        this.gesture = gesture;
        this.listIcon.setGesture(gesture);
      },
      setAction: function (action) {
        this.action = action;
        this.selectAction.$select.val(action);
      }
    };
    return ItemMG;
  })();

  // var Table = (function () {
  //     function Table(options) {
  //         var $table = $('<table/>', {
  //             class: 'mglo-table'
  //         });
  //         var $trHeader = $('<tr/>').appendTo($table);
  //         options.columns.forEach(function (column) {
  //             $('<th/>').text(column.header).appendTo($trHeader);
  //         });

  //         options.data.forEach(function (row, index) {
  //             var $trRow = $('<tr/>').appendTo($table);
  //             options.columns.forEach(function (column) {
  //                 $.each(row, function (key, value) {
  //                     if (column.binding === key) {
  //                         var $td = $('<td/>', column).append(value).appendTo($trRow);
  //                     }
  //                 });
  //             });
  //         });
  //         this.$element = $table;
  //     }
  //     return Table;
  // }());

  function showDialogSetting() {
    if (dialogSetting && dialogSetting.isShow) {
      dialogSetting.close();
    }
    dialogSetting = new Dialog('Settings', $contentSetting, $buttonFooterSettings, true);
    dialogSetting.show();
  }

  $contentSetting.append('On Page');

  $.each(gestures, function (gesture, value) {
    if (getGesture(gesture, 'onLink') !== true) {
      var itemMG = new ItemMG(gesture, value.gesture, {});
      itemMG.$element.appendTo($contentSetting);
    }
  });

  $contentSetting.append('On Link');

  $.each(gestures, function (gesture, value) {
    if (getGesture(gesture, 'onLink') === true) {
      var itemMG = new ItemMG(gesture, value.gesture, {
        onLink: true
      });
      itemMG.$element.appendTo($contentSetting);
    }
  });

  $buttonSave.on('click.mglo', function (e) {
    e.preventDefault();
  });

  // GM_registerMenuCommand('Settings', function () {
  //   showDialogSetting();
  // });

  $.fn.isScrollToTop = function () {
    return this.scrollTop() === 0;
  };

  $.fn.isScrollToBottom = function () {
    return this.get(0).scrollHeight - this.scrollTop() <= this.outerHeight();
  };

  $.fn.hasVScrollBar = function (includeHidden) {
    var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
    return !(/(HTML)/.test(this.get(0).tagName)) && overflowRegex.test(this.css('overflow')) && overflowRegex.test(this.css('overflow-y')) && this.get(0).scrollHeight > this.innerHeight();
  };

  $.fn.vScrollBarParent = function (scrollUpOrDown, includeHidden) {
    if (this.hasVScrollBar() && (scrollUpOrDown !== 'up' && scrollUpOrDown !== 'down' || scrollUpOrDown === 'up' && !this.isScrollToTop() || scrollUpOrDown === 'down' && !this.isScrollToBottom())) {
      return this;
    }
    var position = this.css('position'),
      excludeStaticParent = position === 'absolute',
      vScrollBarParent = this.parents().filter(function () {
        var parent = $(this);
        if (excludeStaticParent && parent.css('position') === 'static' || scrollUpOrDown === 'up' && parent.isScrollToTop() || scrollUpOrDown === 'down' && parent.isScrollToBottom()) {
          return false;
        }
        return parent.hasVScrollBar();
      }).eq(0);
    return position === 'fixed' || !vScrollBarParent.length ? $('html, body') : vScrollBarParent;
  };
})();