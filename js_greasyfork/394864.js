// ==UserScript==
// @name           Indic Transliterate
// @namespace      itranslit
// @description    Transliterate from latin encodings and other Indic Unicode to Indic Unicode
// @match          *://*/*
// @exclude        *://spokensanskrit.org/*
// @grant          GM_getValue
// @grant          GM_setValue
// @noframes
// @version        2.0.1
// @downloadURL https://update.greasyfork.org/scripts/394864/Indic%20Transliterate.user.js
// @updateURL https://update.greasyfork.org/scripts/394864/Indic%20Transliterate.meta.js
// ==/UserScript==

// NOTE:
// This used to be three files: itranslist_data.js (that contained
// functions for specific scripts - tamil, devanagari, etc.),
// itranslit.js (that contained data common to all Indic languages
// and functions to map to and from latin to Indic Unicode), and
// itmain.user.js (the actual userscript that @require'd the
// first two).
// Tampermonkey seems to having problems processing @require,
// so all the three files have merged into one.

(function() {

  // BEGIN itranslit_data.js.

  // To add support for a script xxx, do:
  // 1 Add a pp_xxx (postprocess) function for the script. The function
  //   is called with the Indic Unicode text (and the encoding, if the input is
  //   latin) as parameters, and should fix any
  //   unconventional/sloppy characters with the correct ones and return
  //   the postprocessed text. See the pp_? functions below for examples.
  // 2 Add a line about the script in the _Scripts map (defined below
  //   the pp_xxx functions).

  // Fix character sequences unique to Tamil.
  function _pp_tamil(text, from_encoding) {
    // R -> ru, RR -> roo.
    text = text.replace(/\u0b8b/g, '\u0bb0\u0bc1');
    text = text.replace(/\u0be0/g, '\u0bb0\u0bc2');
    // same as mod. (example: kR)
    text = text.replace(/\u0bc3/g, '\u0bcd\u0bb0\u0bc1');
    text = text.replace(/\u0bc4/g, '\u0bcd\u0bb0\u0bc2');
    // lR, lRR
    text = text.replace(/\u0b8c/g, '\u0bb2\u0bcd\u0bb0\u0bc1');
    text = text.replace(/\u0be1/g, '\u0bb2\u0bcd\u0bb0\u0bc2');
    // same as mod. (example: kLR)
    text = text.replace(/\u0be2/g, '\u0bcd\u0bb2\u0bcd\u0bb0\u0bc1');
    text = text.replace(/\u0be3/g, '\u0bcd\u0bb2\u0bcd\u0bb0\u0bc2');
    // kha, ga, gha -> ka
    text = text.replace(/[\u0b96\u0b97\u0b98]/g, '\u0b95');
    // cha -> ca
    text = text.replace(/\u0b9b/g, '\u0b9a');
    // jha -> ja
    text = text.replace(/\u0b9d/g, '\u0b9c');
    // tha, da, dha -> ta
    text = text.replace(/[\u0ba0\u0ba1\u0ba2]/g, '\u0b9f');
    // Tha, Da, Dha -> Ta
    text = text.replace(/[\u0ba5\u0ba6\u0ba7]/g, '\u0ba4');
    // pha, ba, bha -> pa.
    text = text.replace(/[\u0bab\u0bac\u0bad]/g, '\u0baa');
    // OM
    text = text.replace(/\u0bd0/g, '\u0b93\u0bae\u0bcd');
    // m
    text = text.replace(/\u0b82/g, '\u0bae\u0bcd');
    // H
    text = text.replace(/\u0b83/g, '\u0903');
    // S -> nothing
    text = text.replace(/\u0bbd/g, '');
    // || -> .
    text = text.replace(/\u0be4\u0be4\s*/g, '. ');
    text = text.replace(/\u0be5\s*/g, '. ');
    // | -> ;
    text = text.replace(/\u0be4\s*/g, '; ');
    // na -> ~na if not at start of word.
    text = text.replace(/.[\u0ba8]+/g, function(m) {
      if (!m.charAt(0).match(/\s/))
        return m.charAt(0) + m.substr(1).replace(/\u0ba8/g,'\u0ba9');
      else
        return m;
    });
    // n if followed by ta.
    text = text.replace(/\u0ba9(?=\u0bcd\u0ba4)/g, '\u0ba8');
    // nr -> nR (e.g., manram -> manRam)
    text = text.replace(/\u0ba9\u0bcd\u0bb0/g, '\u0ba9\u0bcd\u0bb1');
    // ra[ra,Ra] -> RRa
    // bonus: t[ra] -> RRa
    text = text.replace(/[\u0bb0\u0b9f]\u0bcd[\u0bb0\u0bb1]/g, '\u0bb1\u0bcd\u0bb1');
    return text;
  }

  // Fix character sequences unique to Devanagari.
  function _pp_devanagari(text, from_encoding) {
    // Replace e with E.
    text = text.replace(/\u090e/g, '\u090f');
    text = text.replace(/\u0946/g, '\u0947');
    // Replace o with O.
    text = text.replace(/\u0912/g, '\u0913');
    text = text.replace(/\u094a/g, '\u094b');
    // Replace n~ with n.
    text = text.replace(/\u0929/g, '\u0928');
    // Replace R with r.
    text = text.replace(/\u0931/g, '\u0930');
    // Replace zh with L (to handle tamil -> devanagari)
    text = text.replace(/\u0934/g, '\u0933');
    return text;
  }

  var _Scripts = {
    devanagari : new _ScriptInfo(0x0900, 0x097f, _pp_devanagari),
    // bengali : new _ScriptInfo(0x0980, 0x09ff),
    // gurmukhi : new _ScriptInfo(0x0A00, 0x0A7f),
    // gujarati : new _ScriptInfo(0x0A80, 0x08ff),
    // oriya : new _ScriptInfo(0x0B00, 0x0B7f),
    tamil : new _ScriptInfo(0x0B80, 0x0Bff, _pp_tamil),
    // telugu : new _ScriptInfo(0x0C00, 0x0C7f),
    // kannadam : new _ScriptInfo(0x0C80, 0x0Cff),
    // malayalam : new _ScriptInfo(0x0D00, 0x0D7),
  };

  /*
   * Create a script metadata object.
   * s,e: Unicode values for the range of characters for this script.
   * pp_function: Function called with converted Unicode data
   * to perform any additional processing (typically to handle
   * commonly used sloppy text).
   */
  function _ScriptInfo(s, e, pp_function) {
    this.start = s;
    this.end = e;
    this.l2uregex = null;
    this.pp_function = pp_function;
  };

  function get_scripts() {
    return _Scripts;
  }
  // END itranslit_data.js

  // ====================================================================

  // BEGIN itranslit.js.

  const Encodings = {hk: 'Harvard-Kyoto', generic: 'Generic'};
  const Mappings = {
    vows: { // Vowels.
      COMMON: {
        a: 0x05, A: 0x06, i: 0x07, I: 0x08, u: 0x09,
        U: 0x0a, ai: 0x10, au: 0x14,
      },
      generic: {
        aa: 0x6, ee: 0x08, oo: 0x0a,
        e: 0x0e, E: 0x0f, o: 0x12, O: 0x13,
      },
      hk: {
        R: 0x0b, RR: 0x60, lR: 0x0c, lRR: 0x61,
        e: 0x0f, E: 0x0f, o: 0x13, O: 0x13,
      }
    },
    mods: { // Consonant modifiers corr to vowels.
      COMMON: {
        a: null, A: 0x3e, i: 0x3f, I: 0x40,
        u: 0x41, U: 0x42, ai: 0x48, au: 0x4c,
      },
      generic: {
        aa: 0x3e, ee: 0x40, oo: 0x42, 
        e: 0x46, E: 0x47, o: 0x4a, O: 0x4b, 
      },
      hk: {
        R: 0x43, RR: 0x44, lR: 0x62, lRR: 0x63,
        e: 0x47, E: 0x47, o: 0x4b, O: 0x4b, 
      }
    },
    specialmods:  { // Can be combined with both vowels and consants.
      COMMON: {
      },
      generic: {
      },
      hk: {
        M: 0x02
      }
    },
    cons: { // Consonants.
      COMMON: {
        k: 0x15, kh: 0x16, g: 0x17, gh: 0x18, G: 0x19,
        c: 0x1a, ch: 0x1b, j: 0x1c, jh: 0x1d, J: 0x1e,
        T: 0x1f, Th: 0x20, D: 0x21, Dh: 0x22, N: 0x23,
        t: 0x24, th: 0x25, d: 0x26, dh: 0x27, n: 0x28,
        p: 0x2a, ph: 0x2b, f: 0x2b, b: 0x2c, bh: 0x2d, m: 0x2e,
        y: 0x2f, r: 0x30, l: 0x32, L: 0x33, v: 0x35, w: 0x35, h: 0x39,
      },
      generic: {
        '~g': 0x19, '~j': 0x1e,
        '~n': 0x29, /* tamil small-na */
        R: 0x31, /* tamil ra */
        z: 0x34, zh: 0x34, /* tamil zh */
        sh: 0x36, Sh: 0x37, s: 0x38, h: 0x39,
      },
      hk: {
        z: 0x36, S: 0x37, s: 0x38, h: 0x39,
      }
    },
    others: { // Miscellaneous. These don't combine with anything.
      COMMON: {
        q: 0x3, '.h': 0x3, H: 0x3,
        OM: 0x50, AUM: 0x50, '.': 0x64, '\\\\':0x65, '\\': 0x64,
        '|':0x64, '||': 0x65,
        '0': 0x66, '1': 0x67, '2': 0x68, '3': 0x69, '4': 0x6a, '5': 0x6b, '6': 0x6c,
        '7': 0x6d, '8': 0x6e, '9': 0x6f,
      },
      generic: {
        '.a': 0x3d,
      },
      hk: {
        "'": 0x3d,
      }
    }
  };

  const _ShortCode = 0x4d;

  var _IVows = {}
  var _IMods = {};
  var _ISpecialMods = {};
  var _ICons = {};
  var _IOthers = {};

  var _IChars = {};

  // Convert characters in from_script
  // (or all) from one Indic unicode script to another.
  function u2u(/* to_script, text, from_script */) {
    if (arguments.length < 2) {
      return "";
    }
    var to_script = arguments[0];
    var scripts = get_scripts();
    var to_start = scripts[to_script].start;
    var text = arguments[1];
    var script_names = new Array();
    if (arguments.length > 2) {
      for (var i = 2; i < arguments.length; ++i)
        script_names.concat(arguments[i]);
    } else {
      script_names = Object.keys(get_scripts());
    }

    var starts = new Array();
    for (var i in script_names) {
      starts.push(scripts[script_names[i]].start);
    }
    var out = new String();
    for (var i = 0; i < text.length; ++i) {
      var c = text.charCodeAt(i);
      if (starts.indexOf(c & 0xff80) >= 0)
        out = out.concat(String.fromCharCode(to_start + (c&0x7f)));
      else
        out = out.concat(text.charAt(i));
    }
    return _pp(to_script, out);
  }

  // Convert from Indic unicode to latin.
  function u2l(text, to_encoding = 'generic') {
    var itext = "";
    for (var i = 0; i < text.length; ++i) {
      var ucode = text.charCodeAt(i);
      if (ucode <= 0x7f) {
        itext += text.charAt(i);
        continue;
      }
      var ichar = null;
      ucode = ucode & 0x7f;
      var con = _getIChar(to_encoding, ucode, _ICons);
      if (con != null) {
        var nextcode = text.charCodeAt(++i) &0x7f;
        if (nextcode == _ShortCode)
          ichar = con;
        else {
          var mod = _getIChar(to_encoding, nextcode, _IMods, _ISpecialMods);
          if (mod != null)
            ichar = con + mod;
          else {
            ichar = con + 'a';
            --i;
          }
        }
      } else {
        var vow = _getIChar(to_encoding, ucode, _IVows);
        if (vow != null)
          ichar = vow;
        else {
          var special = _getIChar(to_encoding, ucode, _IOthers);
          if (special != null)
            ichar = special;
        }
      }
      if (ichar != null) {
        itext += ichar;
      } else {
      }
    }
    return itext;
  }

  // Convert latin to Indic Unicode
  function l2u(text, to_script, from_encoding = 'generic') {
    // FIXME: For now, hardcode.
    from_encoding = (to_script == 'tamil') ? 'generic' : 'hk';
    // END FIXME
    var pat = "";
    var pref = '';
    var to_info = get_scripts()[to_script];
    encodingIChars = _IChars[from_encoding];
    var regex = to_info.l2uregex;
    if (regex == null) {
      for (var ichar in encodingIChars) {
        ichar = ichar.replace(/\\/g, '\\\\');
        ichar = ichar.replace(/\./g, '\\.');
        ichar = ichar.replace(/\^/g, '\\^');
        ichar = ichar.replace(/\|/g, '\\|');
        pat += pref + ichar;
        pref = '|';
      }
      regex = new RegExp('(' + pat + ')', 'gm');
      to_info.l2uregex = regex;
    }
    var to_start = to_info.start;
    return _pp(to_script, text.replace(regex, function(m) {
      return (encodingIChars[m] != null) ?
        _get_chars(encodingIChars[m], to_start) :
        m;
    }), from_encoding);
  }

  function _getIChar() {
    var encoding = arguments[0];
    var ucode = arguments[1];
    for (var i = 2; i < arguments.length; ++i) {
      var chars = arguments[i][encoding];
      for (var ichar in chars) {
        if (chars[ichar] == ucode)
          return ichar;
      }
    }
    return null;
  }

  function _get_chars(codes, start) {
    var out = new String();
    for (var j = 0; j < codes.length; ++j) {
      out = out.concat(String.fromCharCode(start + codes[j]));
    }
    return out;
  }

  function _pp(to_script, text, from_encoding) {
    var f = get_scripts()[to_script].pp_function;
    return (f != null) ? f(text, from_encoding) : text;
  }

  function _init() {
    for (encoding in Encodings) {
      _IVows[encoding] = Object.assign({}, Mappings['vows']['COMMON'], Mappings['vows'][encoding]);
      _IMods[encoding] = Object.assign({}, Mappings['mods']['COMMON'], Mappings['mods'][encoding]);
      _ICons[encoding] = Object.assign({}, Mappings['cons']['COMMON'], Mappings['cons'][encoding]);
      _ISpecialMods[encoding] = Object.assign({}, Mappings['specialmods']['COMMON'], _ISpecialMods[encoding]);
      _IOthers[encoding] = Object.assign({}, Mappings['others']['COMMON'], Mappings['others'][encoding]);
      _init_encoding(encoding);
    }
  }

  function _init_encoding(encoding) {
    _IChars[encoding] = {};
    for (var vow in _IVows[encoding]) {
      _IChars[encoding][vow] = [ _IVows[encoding][vow] ];
      for (var smod in _ISpecialMods[encoding]) {
        _IChars[encoding][vow + smod] = (_ISpecialMods[encoding][smod] != null ) ?
          [_IVows[encoding][vow], _ISpecialMods[encoding][smod]] :
          [_IVows[encoding][vow]];
      }
    }

    for (var cons in _ICons[encoding]) {
      _IChars[encoding][cons] = [ _ICons[encoding][cons], _ShortCode];
      for (var mod in _IMods[encoding]) {
        _IChars[encoding][cons + mod] = (_IMods[encoding][mod] != null ) ?
          [_ICons[encoding][cons], _IMods[encoding][mod]] :
          [_ICons[encoding][cons]];
        for (var smod in _ISpecialMods[encoding]) {
          _IChars[encoding][cons + mod + smod] = (_IMods[encoding][mod] != null ) ?
            [_ICons[encoding][cons], _IMods[encoding][mod], _ISpecialMods[encoding][smod]] :
            [_ICons[encoding][cons], _ISpecialMods[encoding][smod]];
        }
      }
    }

    for (var other in _IOthers[encoding]) {
      _IChars[encoding][other] = [ _IOthers[encoding][other]];
    }

    _IChars[encoding] = _sortMap(_IChars[encoding], function(a,b) {
      return b.length - a.length;
    });
  }

  function _sortMap(m, f) {
    var keys = [];
    for (key in m) {
      keys.push(key);
    }
    keys.sort(f);
    var new_m = {};
    for (key in keys) {
      new_m[keys[key]] = m[keys[key]];
    }
    return new_m;
  }

  _init();

  // END itranslit.js

  // ====================================================================

  // BEGIN itmain.user.js

  var body;
  var toggler;

  var SelectStyle = {
    border: '1px solid #aaaae0',
    backroundColor: '#fcfcff',
    whiteSpace: 'normal',
  };

  var TranslitStyle = {
    whiteSpace: 'pre-wrap',
  };

  var ButtonStyle = {
    lineHeight: 1.5,
    fontWeight: 'bold',
    color: 'blue',
    marginLeft: '5px',
  };

  var CloseButtonStyle = {
    lineHeight: 1.5,
    fontWeight: 'bold',
    color: 'red',
    marginLeft: '5px',
  };

  var DisabledButtonStyle = {
    lineHeight: 1.5,
    fontWeight: 'normal',
    color: '#888888',
    marginLeft: '5px',
  };

  var TogglerEnabledStyle = {
    color: 'green',
  };

  var TogglerDisabledStyle = {
    color: 'red',
  };

  const ATTR_SEEN_BEFORE = "seen";
  var ATTR_ENABLED = 'intranslit_enabled_' + window.location.host;

  function getSelectedText(trim) {
    var text =
      (window.getSelection) ? window.getSelection().toString() :
      (document.getSelection) ? document.getSelection().toString() :
      (document.selection) ? document.selection.createRange().text : null;
    if (trim && text != null)
      text = text.trim();
    return text;
  }

  function style(el, css) {
    for (var k in css)
      el.style[k] = css[k];
    return el;
  }

  function createToggler() {
    toggler = document.createElement('div');
    toggler.id = 'itranslit_toggle';
    toggler.title = 'Click to enable/disable transliteration';
    style(toggler, {
      cursor: 'pointer',
      'float': 'right',
      padding: '0px 15px 0px',
      fontWeight : 'bold',
      backgroundColor: 'transparent',
      position: 'fixed',
      right: '0px',
      bottom: '35px',
      width: '10px',
      zIndex: '99999',
      fontSize: '20px',
    });
    body.appendChild(toggler);
    toggler.innerHTML = '&diams;';
  }

  function getEnabled() {
    v = GM_getValue(ATTR_ENABLED, false);
    return v;
  }

  function setEnabled(v) {
    GM_setValue(ATTR_ENABLED, v);
    style(toggler, v ? TogglerEnabledStyle : TogglerDisabledStyle);
  }

  function transliterate(target) {
    var textScript;

    if (haveSeenBefore(target))
      return;

    var content = getContent(target);
    textScript = getTextScript(content);

    resetChildren(target);
    // Save old content.
    var oldHTML = target.innerHTML;

    // Add buttons at the top of the section.
    var newId = new Date().getTime();
    var newHTML =
      '<div>' +
        '<div>';
    if (textScript == 'latin') {
      // FIXME: Get list of encodings from metadata instead of
      // hardcoding here.
      newHTML +=
          '<div style="visibility:hidden; margin:10px 0 0 0; line-height:1.5; float:left;">' +
            '<span>Input Encoding: </span>' +
            '<input type="radio" name="'+newId+'_lscript" value="generic"/>&nbsp;Generic' +
            '<input checked="checked" style="margin-left: 10px" type="radio" name="'+newId+'_lscript" value="hk"/>&nbsp;HK' +
          '</div>';
    }
    newHTML += '<div style="float:right;">';
    var allButtons = [];
    scripts = get_scripts();
    for (var script in scripts) {
      var bid = 'do_' + script + '_' + newId;
      allButtons.push(bid);
      newHTML +=
            '<input title="Transliterate into '+ script + '" type="button" id="' + bid +
              '" data-script="' + script +
              '" value="' + String.fromCharCode(scripts[script].start + 5) + '"/>';
    }

    newHTML +=
            '<input title="Close" type="button" id="close_' + newId + '" value="x"/>' +
          '</div>' + // end opts_out
        '</div>' + // end opts
        '<br/>' +
        '<div style="padding:5px; clear:both" id="text_' + newId + '">' +
          oldHTML +
        '</div>' +
      '</div>';

    target.innerHTML = newHTML;
    var newTarget = document.getElementById('text_' + newId);
    style(newTarget, SelectStyle);
    var radios = document.getElementsByName(newId+'_lscript');

    // Add click handlers for the buttons.
    for (var script in scripts) {
      (function(l) {
        var bid = 'do_' + l + '_' + newId;
        var button = document.getElementById(bid);
        style(button, ButtonStyle);
        button.addEventListener('click', function(ee) {
          if (button.value != 'x') {
            // Transliterate.
            var convertedText;
            if (textScript == 'latin') {
              // latin -> Indic Unicode.
              inputOpt = radios[0].checked ? radios[0].value : radios[1].value;
              convertedText = l2u(content, l, inputOpt);
            } else {
               // Indic Unicode -> latin.
              /*
               * Disabled for now.
              if (textScript == button.getAttribute('data-script')) {
                convertedText = u2l(content);
              } else {
              */
                // Indic Unicode => Indic Unicode.
                convertedText = u2u(l, content);
              /*
              }
              */
            }
            newTarget.innerHTML = convertedText;
            style(newTarget, TranslitStyle);
            button.value = 'x';
            button.title = 'Revert';
            for (i in allButtons) {
              if (allButtons[i] != bid) {
                document.getElementById(allButtons[i]).disabled = true;
                style(document.getElementById(allButtons[i]),
                  DisabledButtonStyle);
              }
            }
            for (var r in radios) {
              radios[r].disabled = true;
            }
          } else {
            // Revert.
            newTarget.innerHTML = oldHTML;
            style(newTarget, SelectStyle);
            button.value = String.fromCharCode(scripts[l].start+5);
            button.title = 'Transliterate into ' + l;
            for (i in allButtons) {
              if (allButtons[i] != bid) {
                document.getElementById(allButtons[i]).disabled = false;
              }
              style(document.getElementById(allButtons[i]), ButtonStyle);
            }
            for (var r in radios) {
              radios[r].disabled = false;
            }
          }
        }, false);
      })(script);
    }
    var closeLit = document.getElementById('close_' + newId);
    style(closeLit, CloseButtonStyle);
    closeLit.style.color = 'red';
    closeLit.addEventListener('click', function(ee) {
      target.innerHTML = oldHTML;
      clearSeenBefore(target);
    }, false);
    // Mark that we've seen this section, so we don't add buttons
    // more than once.
    setSeenBefore(target);
  }

  /*
   * Return the script of the given text.
   * null: Unrecognized.
   */
  function getTextScript(content) {
    var script = null;
    if (content) {
      content = content
        .trim()
        .replace(/ +/g, ' ')
        .replace(/[\r\n]+/g, '\n');
      if (content.match(/[\u0900-\u0d7f]/)) {
        var charCode = 0;
        for (var i = 0; i < content.length; ++i) {
          charCode = content.charCodeAt(i);
          if (charCode >= 0x0900) break;
        }
        charCode &= 0xff80;
        var scripts = get_scripts();
        for (i in scripts) {
          if (scripts[i].start == charCode) {
            script = i;
            break;
          }
        }
      } else if (content.match(/[A-Za-z]/)) {
        script = 'latin';
      }
    }
    return script;
  }

  function getContent(t) {
    var content = t.innerText;
    return content;
  }

  function setSeenBefore(t) {
    t.setAttribute(ATTR_SEEN_BEFORE, '1');
  }

  function clearSeenBefore(t) {
    t.removeAttribute(ATTR_SEEN_BEFORE);
  }

  function haveSeenBefore(t) {
    var v = false;
    while (t) {
      if (t.getAttribute && t.getAttribute(ATTR_SEEN_BEFORE)) {
        v = true;
        break;
      }
      t = t.parentNode;
    }
    return v;
  }

  function resetChildren(t) {
    var ev = document.createEvent('MouseEvents');
    ev.initEvent("click", true, true);
    for (var i = 0; i < t.childNodes.length; ++i) {
      var ct = t.childNodes[i];
      if (ct.id && ct.id.match(/close_\d+/) && ct.nodeName == 'INPUT')
        ct.dispatchEvent(ev);
      else if (t.childNodes)
        resetChildren(ct);
    }
  }

  function handleClick(e) {
    if (!getEnabled() || e.button != 0)
      return;
    var target = (e.target || e.srcElement);
    if (!target || target == body || target == toggler)
      return;
    var n = target;
    while (n && n != body) {
      if (n.nodeName == 'A' || n.nodeName == 'INPUT' ||
        n.nodeName == 'TEXTAREA' || n.nodeName == 'FORM') {
          return;
      }
      n = n.parentNode;
    }
    transliterate(target);
  }

  // Main.

  body = document.getElementsByTagName('body')[0];

  // Create the feature toggler.
  createToggler();
  setEnabled(getEnabled());
  toggler.addEventListener('click', function(e) {
    setEnabled(getEnabled() === false);
  }, false);

  // Init click listener.
  document.addEventListener('mouseup', handleClick, false);

  // END itmain.user.js

})();
