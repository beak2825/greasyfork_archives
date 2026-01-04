// ==UserScript==
// @name        Dreadcast Development Kit
// @namespace   Dreadcast
// @match       https://www.dreadcast.net/Main
// @version     1.1.8
// @author      Pelagia/Isilin
// @description Development kit to ease Dreadcast scripts integration.
// @license     https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @connect     docs.google.com
// @connect     googleusercontent.com
// @connect     sheets.googleapis.com
// @connect     raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
// @updateURL https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.meta.js
// ==/UserScript==

// ===== JQuery utilities =====

$.fn.insertAt = function (index, element) {
  var lastIndex = this.children().size();
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index);
  }
  this.append(element);
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last());
  }
  return this;
};

// ===== Lib =====

const Util = {
  guard: (condition, message) => {
    if (!condition) throw new Error(message);
    return;
  },

  deprecate: (name, replacement) => {
    console.warn(
      name +
        ': this function has been deprecated and should not be used anymore.' +
        (replacement && replacement !== ''
          ? 'Prefer: ' + replacement + '.'
          : ''),
    );
  },

  isArray: (o, optional = false) =>
    $.type(o) === 'array' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isString: (o, optional = false) =>
    $.type(o) === 'string' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isBoolean: (o, optional = false) =>
    $.type(o) === 'boolean' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isNumber: (o, optional = false) =>
    $.type(o) === 'number' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isFunction: (o, optional = false) =>
    $.type(o) === 'function' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isDate: (o, optional = false) =>
    $.type(o) === 'date' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isError: (o, optional = false) =>
    $.type(o) === 'error' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isRegex: (o, optional = false) =>
    $.type(o) === 'regexp' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isObject: (o, optional = false) =>
    $.type(o) === 'object' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isColor: (o, optional = false) => {
    if (optional && ($.type(o) === 'undefined' || $.type(o) === 'null'))
      return true;
    else {
      const colors = ['rouge', 'bleu', 'vert', 'jaune'];
      return (
        $.type(o) === 'string' &&
        (colors.includes(o) ||
          o.match(/^[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3}$/gi))
      );
    }
  },

  isJQuery: (o, optional = false) =>
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')) ||
    o instanceof $,

  guardArray: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isArray(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be an array.`,
    ),

  guardString: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isString(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be a string.`,
    ),

  guardBoolean: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isBoolean(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be a boolean.`,
    ),

  guardNumber: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isNumber(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be a number.`,
    ),

  guardFunction: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isFunction(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be a a function.`,
    ),

  guardDate: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isDate(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be a date.`,
    ),

  guardError: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isError(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be an error.`,
    ),

  guardRegex: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isRegex(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be a regex.`,
    ),

  guardObject: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isObject(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be an object.`,
    ),

  guardColor: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isColor(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be a color.`,
    ),

  guardJQuery: (context, name, parameter, optional = false) =>
    Util.guard(
      Util.isJQuery(parameter, optional),
      `${context}: '${name}' ${
        optional ? 'optional ' : ''
      }parameter should be a jQuery element.`,
    ),

  isGame: () => window.location.href.includes('https://www.dreadcast.net/Main'),

  isForum: () =>
    window.location.href.includes('https://www.dreadcast.net/Forum') ||
    window.location.href.includes('https://www.dreadcast.net/FAQ'),

  isEDC: () => window.location.href.includes('https://www.dreadcast.net/EDC'),

  isWiki: () => window.location.href.includes('http://wiki.dreadcast.eu/wiki'),

  getContext: () => {
    return Util.isGame()
      ? 'game'
      : Util.isForum()
      ? 'forum'
      : Util.isEDC()
      ? 'edc'
      : 'wiki';
  },
};

// ===== Overwrite DC functions =====

if (Util.isGame() && MenuChat.prototype.originalSend === undefined) {
  MenuChat.prototype.originalSend = MenuChat.prototype.send;
  MenuChat.prototype.sendCallbacks = [];
  MenuChat.prototype.afterSendCallbacks = [];
  MenuChat.prototype.send = function () {
    const $nextFn = () => true;
    const $abortFn = () => false;
    const $message = $('#chatForm .text_chat').val();
    const $res = this.sendCallbacks.every((callback) =>
      callback($message, $nextFn, $abortFn),
    );
    if (!$res) {
      throw new Error('MenuChat.prototype.send: Error on sending message.');
    }

    this.originalSend();

    this.afterSendCallbacks.every((callback) => callback($message));
  };
  MenuChat.prototype.onSend = (callback) => {
    Util.guard(
      Util.isGame(),
      'MenuChat.prototype.onSend: this function should be called in Game only.',
    );
    MenuChat.prototype.sendCallbacks.push(callback);
  };
  MenuChat.prototype.onAfterSend = (callback) => {
    Util.guard(
      Util.isGame(),
      'MenuChat.prototype.onSend: this function should be called in Game only.',
    );
    MenuChat.prototype.afterSendCallbacks.push(callback);
  };
}

// ============================

const DC = {};

DC.LocalMemory = {
  init: (label, defaultValue) => {
    const $currentVal = GM_getValue(label);
    if ($currentVal === undefined) {
      GM_setValue(label, defaultValue);
      return defaultValue;
    } else {
      return $currentVal;
    }
  },

  set: (label, value) => GM_setValue(label, value),

  get: (label) => GM_getValue(label),

  delete: (label) => GM_deleteValue(label),

  list: () => GM_listValues(),
};

DC.Style = {
  apply: (css) => {
    Util.guardString('DC.Style.apply', 'css', css);

    if (typeof GM_addStyle !== 'undefined') {
      GM_addStyle(css);
    } else {
      let $styleNode = document.createElement('style');
      $styleNode.appendChild(document.createTextNode(css));
      (document.querySelector('head') || document.documentElement).appendChild(
        $styleNode,
      );
    }
  },
};

DC.TopMenu = {
  get: () => {
    Util.guard(
      Util.isGame(),
      'MenuChat.prototype.onSend: this function should be called in Game only.',
    );
    return $('.menus');
  },

  add: (element, index = 0) => {
    Util.guard(
      Util.isGame(),
      'MenuChat.prototype.onSend: this function should be called in Game only.',
    );
    Util.guardJQuery('DC.TopMenu.add', 'element', element);
    Util.guardNumber('DC.TopMenu.add', 'index', index);

    const $dom = DC.TopMenu.get();
    if (index === 0) {
      $dom.prepend(element);
    } else {
      $dom.insertAt(index, element);
    }
  },
};

DC.UI = {
  Separator: () => $('<li class="separator" />'),

  Menu: (label, fn) => {
    Util.guardString('DC.UI.Menu', 'label', label);
    Util.guardFunction('DC.UI.Menu', 'fn', fn);

    return $(`<li id="${label}" class="couleur5">${label}</li>`).bind(
      'click',
      fn,
    );
  },

  SubMenu: (label, fn, separatorBefore = false) => {
    Util.guardString('DC.UI.SubMenu', 'label', label);
    Util.guardFunction('DC.UI.SubMenu', 'fn', fn);
    Util.guardBoolean('DC.UI.SubMenu', 'separatorBefore', separatorBefore);

    return $(
      `<li class="link couleur2 ${
        separatorBefore ? 'separator' : ''
      }">${label}</li>`,
    ).bind('click', fn);
  },

  DropMenu: (label, submenu) => {
    Util.guardString('DC.UI.DropMenu', 'label', label);
    Util.guardArray('DC.UI.DropMenu', 'submenu', submenu);

    const $label = label + '▾';

    const $list = $('<ul></ul>');
    submenu.forEach(($submenu) => {
      $($list).append($submenu);
    });

    return $(
      `<li id="${label}" class="parametres couleur5 right hover" onclick="$(this).find('ul').slideDown();">${$label}</li>`,
    ).append($list);
  },

  addSubMenuTo: (name, element, index = 0) => {
    Util.guard(
      Util.isGame(),
      'MenuChat.prototype.onSend: this function should be called in Game only.',
    );
    Util.guardString('DC.UI.addSubMenuTo', 'name', name);
    Util.guardJQuery('DC.UI.addSubMenuTo', 'element', element);
    Util.guardNumber('DC.UI.addSubMenuTo', 'index', index);

    const $menu = $(`.menus li:contains("${name}") ul`);

    if (index === 0) {
      $menu.prepend(element);
    } else {
      $menu.insertAt(index, element);
    }
  },

  TextButton: (id, label, fn) => {
    Util.guardString('DC.UI.TextButton', 'id', id);
    Util.guardString('DC.UI.TextButton', 'label', label);
    Util.guardFunction('DC.UI.TextButton', 'fn', fn);

    return $(`<div id="${id}" class="btnTxt">${label}</div>`).bind('click', fn);
  },

  Button: (id, label, fn) => {
    Util.guardString('DC.UI.Button', 'id', id);
    Util.guardString('DC.UI.Button', 'label', label);
    Util.guardFunction('DC.UI.Button', 'fn', fn);

    return $(
      `<div id="${id}" class="btn add link infoAide"><div class="gridCenter">${label}</div></div>`,
    ).bind('click', fn);
  },

  ColorPicker: (id, value, fn) => {
    Util.guardString('DC.UI.ColorPicker', 'id', id);
    Util.guardString('DC.UI.ColorPicker', 'value', value);
    Util.guardFunction('DC.UI.ColorPicker', 'fn', fn);

    return $(`<input id="${id}" value="${value}"`).bind('click', (e) =>
      fn(e.target.value),
    );
  },

  Tooltip: (text, content) => {
    Util.guardString('DC.UI.Tooltip', 'text', text);
    Util.guardJQuery('DC.UI.Tooltip', 'content', content);

    DC.Style.apply(`
        .tooltip {
          position: relative;
          display: inline-block;
        }
        .tooltip .tooltiptext {
          visibility: hidden;
          background-color: rgba(24,24,24,0.95);
          color: #fff;
          text-align: center;
          padding: 5px;
          border-radius: 6px;
          position: absolute;
          z-index: 1;
          font-size: 1rem;
        }
        .tooltip:hover .tooltiptext {
          visibility: visible;
        }
      `);

    return $(`<div class="tooltip">
        <span class="tooltiptext">${text}</span>
        </div>`).prepend(content);
  },

  Checkbox: (id, defaultEnable, onAfterClick) => {
    Util.guardString('DC.UI.Checkbox', 'id', id);
    Util.guardBoolean('DC.UI.Checkbox', 'defaultEnable', defaultEnable);
    Util.guardFunction('DC.UI.Checkbox', 'onAfterClick', onAfterClick);

    DC.Style.apply(`
        .dc_ui_checkbox {
          cursor: pointer;
          width: 30px;
          height: 18px;
          background: url(../../../images/fr/design/boutons/b_0.png) 0 0 no-repeat;
        }

        .dc_ui_checkbox_on {
          background: url(../../../images/fr/design/boutons/b_1.png) 0 0 no-repeat;
        }
      `);

    return $(
      `<div id="${id}" class="dc_ui_checkbox ${
        defaultEnable ? 'dc_ui_checkbox_on' : ''
      }" />`,
    ).bind('click', () => {
      $(`#${id}`).toggleClass('dc_ui_checkbox_on');
      onAfterClick?.($(`#${id}`).hasClass('dc_ui_checkbox_on'));
    });
  },

  PopUp: (id, title, content) => {
    Util.guard(
      Util.isGame(),
      'MenuChat.prototype.onSend: this function should be called in Game only.',
    );
    Util.guardString('DC.UI.PopUp', 'id', id);
    Util.guardString('DC.UI.PopUp', 'title', title);
    Util.guardJQuery('DC.UI.PopUp', 'content', content);

    $('#loader').fadeIn('fast');

    const html = `
        <div id="${id}" class="dataBox"  onClick="engine.switchDataBox(this)" style="display: block; z-index: 5; left: 764px; top: 16px;">
          <relative>
            <div class="head" ondblclick="$('#${id}').toggleClass('reduced');">
            <div title="Fermer la fenêtre (Q)" class="info1 link close transition3s" onClick="engine.closeDataBox($(this).parent().parent().parent().attr('id'));" alt="$('${id}').removeClass('active')">
              <i class="fas fa-times"></i>
            </div>
            <div title="Reduire/Agrandir la fenêtre" class="info1 link reduce transition3s" onClick="$('#${id}').toggleClass('reduced');">
              <span>-</span>
            </div>
            <div class="title">${title}</div>
          </div>
          <div class="dbloader"></div>
          <div class="content" style="max-width: 800px; max-height: 600px; overflow-y: auto; overflow-x: hidden;">
          </div>
        </relative>
      </div>`;

    engine.displayDataBox(html);
    $(`#${id} .content`).append(content);

    $('#loader').hide();
  },

  SideMenu: (id, label, content) => {
    Util.guardString('DC.UI.SideMenu', 'id', id);
    Util.guardString('DC.UI.SideMenu', 'label', label);
    Util.guardJQuery('DC.UI.SideMenu', 'content', content);

    const $idContainer = id + '_container';
    const $idButton = id + '_button';
    const $idContent = id + '_content';

    if ($('div#zone_sidemenu').length === 0) {
      $('body').append('<div id="zone_sidemenu"></div>');
    }
    $('#zone_sidemenu').append(
      `<div id="${$idContainer}" class="sidemenu_container"></div>`,
    );

    $(`#${$idContainer}`).append(
      DC.UI.TextButton(
        $idButton,
        '<i class="fas fa-chevron-left"></i>' + label,
        () => {
          const isOpen = $(`#${$idButton}`).html().includes('fa-chevron-right');
          if (isOpen) {
            $(`#${$idButton}`)
              .empty()
              .append('<i class="fas fa-chevron-left"></i>' + label);
            $(`#${$idContent}`).css('display', 'none');
          } else {
            $(`#${$idButton}`)
              .empty()
              .append('<i class="fas fa-chevron-right"></i>' + label);
            $(`#${$idContent}`).css('display', 'block');
          }
        },
      ),
    );

    $(`#${$idContainer}`).append(
      `<div id="${$idContent}" class="sidemenu_content"></div>`,
    );
    $(`#${$idContent}`).append(content);

    DC.Style.apply(`
        #zone_sidemenu {
          display: flex;
          flex-direction: column;
          position: absolute;
          right: 0px;
          top: 80px;
          z-index: 999999;
        }

        .sidemenu_container {
          display: flex;
        }

        .sidemenu_container > .btnTxt:first-child {
          margin: 0 auto;
          min-width: 100px;
          max-width: 100px;
          font-size: 1rem;
          padding: 1%;
          display: grid;
          height: 100%;
          box-sizing: border-box;
          grid-template-columns: 10% 1fr;
          align-items: center;
          text-transform: uppercase;
          font-family: Arial !important;
          line-height: normal !important;
        }

        .sidemenu_container .btnTxt:hover {
          background: #0b9bcb;
          color: #fff;
        }

        .sidemenu_content {
          background-color: #000;
          color: #fff !important;
          box-shadow: 0 0 15px -5px inset #a2e4fc !important;
          padding: 10px;
          width: 200px;
          display: none;
        }
      `);
  },
};

DC.Network = {
  fetch: (args) => {
    Util.guardObject('DC.Network.fetch', 'args', args);

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest(
        Object.assign({}, args, {
          onload: (e) => resolve(e.response),
          onerror: reject,
          ontimeout: reject,
        }),
      );
    });
  },

  loadSpreadsheet: async (sheetId, tabName, range, apiKey, onLoad) => {
    Util.guardString('DC.Network.loadSpreadsheet', 'sheetId', sheetId);
    Util.guardString('DC.Network.loadSpreadsheet', 'tabName', tabName);
    Util.guardString('DC.Network.loadSpreadsheet', 'range', range);
    Util.guardString('DC.Network.loadSpreadsheet', 'apiKey', apiKey);
    Util.guardFunction('DC.Network.loadSpreadsheet', 'onLoad', onLoad);

    const urlGoogleSheetDatabase = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tabName}!${range}?key=${apiKey}`;
    const result = await DC.Network.fetch({
      method: 'GET',
      url: urlGoogleSheetDatabase,
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
    onLoad(result.values);
  },

  loadScript: async (url, onAfterLoad) => {
    Util.guardString('DC.Network.loadScript', 'url', url);
    Util.guardFunction(
      'DC.Network.loadScript',
      'onAfterLoad',
      onAfterLoad,
      true,
    );

    // TODO we should check that url is from a valid and secure source.
    const result = await DC.Network.fetch({
      method: 'GET',
      url,
      headers: {
        'Content-Type': 'text/javascript',
      },
    });
    // TODO we have to secure more this call
    eval(result);

    onAfterLoad?.();
  },

  loadJson: async (url) => {
    Util.guardString('DC.Network.loadJson', 'url', url);

    const result = await DC.Network.fetch({
      method: 'GET',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
    return result;
  },
};

DC.Chat = {
  sendMessage: (message) => {
    Util.guard(
      Util.isGame(),
      'MenuChat.prototype.onSend: this function should be called in Game only.',
    );
    Util.guardString('DC.Chat.sendMessage', 'message', message);

    $('#chatForm .text_chat').val(message);
    $('#chatForm .text_valider').click();
  },

  t: (message, decoration) => {
    Util.guardString('DC.Chat.t', 'message', message);
    Util.guardObject('DC.Chat.t', 'decoration', decoration);
    Util.guardBoolean('DC.Chat.t', 'decoration.bold', decoration.bold, true);
    Util.guardBoolean(
      'DC.Chat.t',
      'decoration.italic',
      decoration.italic,
      true,
    );
    Util.guardColor('DC.Chat.t', 'decoration.color', decoration.color, true);

    var prefix = '';
    var suffix = '';

    if (decoration.bold) {
      prefix += '[b]';
      suffix += '[b]';
    }

    if (decoration.italic) {
      prefix += '[i]';
      suffix = '[/i]' + suffix;
    }

    if (decoration.color && decoration.color !== '') {
      prefix += '[c=' + decoration.color + ']';
      suffix = '[/c]' + suffix;
    }

    return prefix + message + suffix;
  },

  addCommand: (label, fn) => {
    Util.guard(
      Util.isGame(),
      'MenuChat.prototype.onSend: this function should be called in Game only.',
    );
    Util.guardString('DC.Chat.addCommand', 'label', label);
    Util.guardFunction('DC.Chat.addCommand', 'fn', fn);

    nav.getChat().onSend((message, next, abort) => {
      const forbiden = ['me', 'y', 'ye', 'yme', 'w', 'we', 'wme', 'roll', ''];

      const labelUsed = message.split(' ')[0].substr(1);
      if (
        message[0] !== '/' ||
        labelUsed !== label ||
        forbiden.includes(labelUsed)
      ) {
        return next();
      }

      const content = message.substr(labelUsed.length + 1);

      if (fn(labelUsed, content)) {
        return next();
      } else {
        return abort();
      }
    });
  },
};

DC.Deck = {
  checkSkill: (info) => {
    Util.guard(
      Util.isGame(),
      'DC.Deck.checkSkill: this function should be called in Game only.',
    );
    Util.guardNumber('DC.Deck.checkSkill', 'info', info);

    return info <= $('.stat_6_entier').first().html();
  },

  write: (node, deckId) => {
    Util.guard(
      Util.isGame(),
      'DC.Deck.write: this function should be called in Game only.',
    );
    Util.guardJQuery('DC.Deck.write', 'node', node);
    Util.guardString('DC.Deck.write', 'deckId', deckId);

    const mode =
      $(`#${deckId} .zone_ecrit div:last-child`).attr('class') ===
      'ligne_resultat_fixed';

    if (mode) {
      $(`#${deckId} .zone_ecrit>.ligne_resultat_fixed:last-child`).append(node);
    } else {
      $('<div class="ligne_resultat_fixed" />')
        .append(node)
        .appendTo($(`#${deckId} .zone_ecrit`));
    }
  },

  createCommand: (info, command, fn, helpFn, help) => {
    Util.guard(
      Util.isGame(),
      'DC.Deck.createCommand: this function should be called in Game only.',
    );
    Util.guardNumber('DC.Deck.createCommand', 'info', info);
    Util.guardString('DC.Deck.createCommand', 'command', command);
    Util.guardFunction('DC.Deck.createCommand', 'fn', fn);
    Util.guardFunction('DC.Deck.createCommand', 'helpFn', helpFn);
    Util.guardString('DC.Deck.createCommand', 'help', help);

    $(document).ajaxComplete(function (event, xhr, settings) {
      // Handle custom deck command
      if (/Command/.test(settings.url)) {
        var deckId = 'db_deck_' + settings.data.match(/[0-9]*$/)[0];
        var lastCommand = $(`#${deckId} .ligne_ecrite_fixed input`)
          .last()
          .val();

        // Handle Date command

        if (new RegExp(`^${command}`, 'gi').test(lastCommand)) {
          if (DC.Deck.checkSkill(info)) {
            fn(lastCommand, deckId);
          } else {
            DC.Deck.write(
              $(
                '<span>Votre niveau en informatique est trop faible pour réussir cette commande</span>',
                deckId,
              ),
            );
          }
        }
        // Handle help Date command
        else if (new RegExp(`^help ${command}`, 'gi').test(lastCommand)) {
          helpFn(deckId);
        }
        // Handle help Date command
        else if (/^help$/gi.test(lastCommand)) {
          DC.Deck.write($(`<br />${help}`), deckId);
        }
      }
    });
  },
};
