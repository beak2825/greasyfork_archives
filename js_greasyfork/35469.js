// ==UserScript==
// @name        DT_Script
// @grant    GM.getValue
// @grant    GM.setValue
// @description Test One for DT Script
// @author PSL Group
// @namespace   http://gpcms.habcommunity.com
// @include     http://gpcms.habcommunity.com/*
// @include     https://bvt.habcommunity.com/*
// @exclude     http://gpcms.habcommunity.com/www/edit_admin.php?act=view&syid=*
// @include     https://gpcms.habcommunity.com/*
// @include     https://bvt.habcommunity.com/*
// @exclude     https://gpcms.habcommunity.com/www/edit_admin.php?act=view&syid=*
// @version     1
// @grant none
// @require http://code.jquery.com/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35469/DT_Script.user.js
// @updateURL https://update.greasyfork.org/scripts/35469/DT_Script.meta.js
// ==/UserScript==


// =========================================================
// developer: Muhammad Tarmizi bin Kamaruddin
// updated on: 26 August 2013 (Monday) 02:37:18 AM GMT+08:00
// updated on: 19 May 2016 (Thuesday) 11:28:00 AM GMT+06:00 by Joacim Garcia
// updated on: 20 November 2017 (Monday) 17:00:00 PM GMT+06:00 by Manuel Pirez & Joacim Garcia
// =========================================================

var l = '';
var body_text = '';
var TEMPLATE_NAME = 'P2W/AGENCY EXPORT TEMPLATE V3';

!(function() {
  "use strict";

  var VERSION = '2.1.0';

  var ENTITIES = {};

  // from http://semplicewebsites.com/removing-accents-javascript
  var latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","ẞ":"SS","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ß":"ss","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};

//******************************************************************************
// Added an initialize function which is essentially the code from the S
// constructor.  Now, the S constructor calls this and a new method named
// setValue calls it as well.  The setValue function allows constructors for
// modules that extend string.js to set the initial value of an object without
// knowing the internal workings of string.js.
//
// Also, all methods which return a new S object now call:
//
//      return new this.constructor(s);
//
// instead of:
//
//      return new S(s);
//
// This allows extended objects to keep their proper instanceOf and constructor.
//******************************************************************************

  function initialize (object, s) {
    if (s !== null && s !== undefined) {
      if (typeof s === 'string')
        object.s = s;
      else
        object.s = s.toString();
    } else {
      object.s = s; //null or undefined
    }

    object.orig = s; //original object, currently only used by toCSV() and toBoolean()

    if (s !== null && s !== undefined) {
      if (object.__defineGetter__) {
        object.__defineGetter__('length', function() {
          return object.s.length;
        })
      } else {
        object.length = s.length;
      }
    } else {
      object.length = -1;
    }
  }

  function S(s) {
  	initialize(this, s);
  }

  var __nsp = String.prototype;
  var __sp = S.prototype = {

    between: function(left, right) {
      var s = this.s;
      var startPos = s.indexOf(left);
      var endPos = s.indexOf(right, startPos + left.length);
      if (endPos == -1 && right != null) 
        return new this.constructor('')
      else if (endPos == -1 && right == null)
        return new this.constructor(s.substring(startPos + left.length))
      else 
        return new this.constructor(s.slice(startPos + left.length, endPos));
    },

    //# modified slightly from https://github.com/epeli/underscore.string
    camelize: function() {
      var s = this.trim().s.replace(/(\-|_|\s)+(.)?/g, function(mathc, sep, c) {
        return (c ? c.toUpperCase() : '');
      });
      return new this.constructor(s);
    },

    capitalize: function() {
      return new this.constructor(this.s.substr(0, 1).toUpperCase() + this.s.substring(1).toLowerCase());
    },

    charAt: function(index) {
      return this.s.charAt(index);
    },

    chompLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
         s = s.slice(prefix.length);
         return new this.constructor(s);
      } else {
        return this;
      }
    },

    chompRight: function(suffix) {
      if (this.endsWith(suffix)) {
        var s = this.s;
        s = s.slice(0, s.length - suffix.length);
        return new this.constructor(s);
      } else {
        return this;
      }
    },

    //#thanks Google
    collapseWhitespace: function() {
      var s = this.s.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
      return new this.constructor(s);
    },

    contains: function(ss) {
      return this.s.indexOf(ss) >= 0;
    },

    count: function(ss) {
      var count = 0
        , pos = this.s.indexOf(ss)

      while (pos >= 0) {
        count += 1
        pos = this.s.indexOf(ss, pos + 1)
      }

      return count
    },

    //#modified from https://github.com/epeli/underscore.string
    dasherize: function() {
      var s = this.trim().s.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase();
      return new this.constructor(s);
    },

    latinise: function() {
      var s = this.replace(/[^A-Za-z0-9\[\] ]/g, function(x) { return latin_map[x] || x; });
      return new this.constructor(s);
    },

    decodeHtmlEntities: function() { //https://github.com/substack/node-ent/blob/master/index.js
      var s = this.s;
      s = s.replace(/&#(\d+);?/g, function (_, code) {
        return String.fromCharCode(code);
      })
      .replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      })
      .replace(/&([^;\W]+;?)/g, function (m, e) {
        var ee = e.replace(/;$/, '');
        var target = ENTITIES[e] || (e.match(/;$/) && ENTITIES[ee]);
            
        if (typeof target === 'number') {
          return String.fromCharCode(target);
        }
        else if (typeof target === 'string') {
          return target;
        }
        else {
          return m;
        }
      })

      return new this.constructor(s);
    },

    endsWith: function(suffix) {
      var l  = this.s.length - suffix.length;
      return l >= 0 && this.s.indexOf(suffix, l) === l;
    },

    escapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; }));
    },

    ensureLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
        return this;
      } else {
        return new this.constructor(prefix + s);
      }
    },

    ensureRight: function(suffix) {
      var s = this.s;
      if (this.endsWith(suffix))  {
        return this;
      } else {
        return new this.constructor(s + suffix);
      }
    },

    humanize: function() { //modified from underscore.string
      if (this.s === null || this.s === undefined)
        return new this.constructor('')
      var s = this.underscore().replace(/_id$/,'').replace(/_/g, ' ').trim().capitalize()
      return new this.constructor(s)
    },

    isAlpha: function() {
      return !/[^a-z\xDF-\xFF]|^$/.test(this.s.toLowerCase());
    },

    isAlphaNumeric: function() {
      return !/[^0-9a-z\xDF-\xFF]/.test(this.s.toLowerCase());
    },

    isEmpty: function() {
      return this.s === null || this.s === undefined ? true : /^[\s\xa0]*$/.test(this.s);
    },

    isLower: function() {
      return this.isAlpha() && this.s.toLowerCase() === this.s;
    },

    isNumeric: function() {
      return !/[^0-9]/.test(this.s);
    },

    isUpper: function() {
      return this.isAlpha() && this.s.toUpperCase() === this.s;
    },

    left: function(N) {
      if (N >= 0) {
        var s = this.s.substr(0, N);
        return new this.constructor(s);
      } else {
        return this.right(-N);
      }
    },
    
    lines: function() { //convert windows newlines to unix newlines then convert to an Array of lines
      return this.replaceAll('\r\n', '\n').s.split('\n');
    },

    pad: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      len = len - this.s.length;
      var left = Array(Math.ceil(len / 2) + 1).join(ch);
      var right = Array(Math.floor(len / 2) + 1).join(ch);
      return new this.constructor(left + this.s + right);
    },

    padLeft: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(Array(len - this.s.length + 1).join(ch) + this.s);
    },

    padRight: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(this.s + Array(len - this.s.length + 1).join(ch));
    },

    parseCSV: function(delimiter, qualifier, escape, lineDelimiter) { //try to parse no matter what
      delimiter = delimiter || ',';
      escape = escape || '\\'
      if (typeof qualifier == 'undefined')
        qualifier = '"';

      var i = 0, fieldBuffer = [], fields = [], len = this.s.length, inField = false, inUnqualifiedString = false, self = this;
      var ca = function(i){return self.s.charAt(i)};
      if (typeof lineDelimiter !== 'undefined') var rows = [];

      if (!qualifier)
        inField = true;

      while (i < len) {
        var current = ca(i);
        switch (current) {
          case escape:
            //fix for issues #32 and #35
            if (inField && ((escape !== qualifier) || ca(i+1) === qualifier)) {
              i += 1;
              fieldBuffer.push(ca(i));
              break;
            }
            if (escape !== qualifier) break;
          case qualifier:
            inField = !inField;
            break;
          case delimiter:
            if(inUnqualifiedString) {
              inField=false;
              inUnqualifiedString=false;
            }
            if (inField && qualifier)
              fieldBuffer.push(current);
            else {
              fields.push(fieldBuffer.join(''))
              fieldBuffer.length = 0;
            }
            break;
          case lineDelimiter:
            if(inUnqualifiedString) {
              inField=false;
              inUnqualifiedString=false;
              fields.push(fieldBuffer.join(''))
              rows.push(fields);
              fields = [];
              fieldBuffer.length = 0;
            }
            else if (inField) {
              fieldBuffer.push(current);
            } else {
              if (rows) {
                fields.push(fieldBuffer.join(''))
                rows.push(fields);
                fields = [];
                fieldBuffer.length = 0;
              }
            }
            break;
          case ' ':
            if (inField)
              fieldBuffer.push(current);
            break;
          default:
            if (inField)
              fieldBuffer.push(current);
            else if(current!==qualifier) {
              fieldBuffer.push(current);
              inField=true;
              inUnqualifiedString=true;
            }
            break;
        }
        i += 1;
      }

      fields.push(fieldBuffer.join(''));
      if (rows) {
        rows.push(fields);
        return rows;
      }
      return fields;
    },

    replaceAll: function(ss, r) {
      //var s = this.s.replace(new RegExp(ss, 'g'), r);
      var s = this.s.split(ss).join(r)
      return new this.constructor(s);
    },

    strip: function() {
      var ss = this.s;
      for(var i= 0, n=arguments.length; i<n; i++) {
        ss = ss.split(arguments[i]).join('');
      }
      return new this.constructor(ss);
    },

    right: function(N) {
      if (N >= 0) {
        var s = this.s.substr(this.s.length - N, N);
        return new this.constructor(s);
      } else {
        return this.left(-N);
      }
    },

    setValue: function (s) {
	  initialize(this, s);
	  return this;
    },

    slugify: function() {
      var sl = (new S(new S(this.s).latinise().s.replace(/[^\w\s-]/g, '').toLowerCase())).dasherize().s;
      if (sl.charAt(0) === '-')
        sl = sl.substr(1);
      return new this.constructor(sl);
    },

    startsWith: function(prefix) {
      return this.s.lastIndexOf(prefix, 0) === 0;
    },

    stripPunctuation: function() {
      //return new this.constructor(this.s.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""));
      return new this.constructor(this.s.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));
    },

    stripTags: function() { //from sugar.js
      var s = this.s, args = arguments.length > 0 ? arguments : [''];
      multiArgs(args, function(tag) {
        s = s.replace(RegExp('<\/?' + tag + '[^<>]*>', 'gi'), '');
      });
      return new this.constructor(s);
    },

    template: function(values, opening, closing) {
      var s = this.s
      var opening = opening || Export.TMPL_OPEN
      var closing = closing || Export.TMPL_CLOSE

      var open = opening.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var close = closing.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var r = new RegExp(open + '(.+?)' + close, 'g')
        //, r = /\{\{(.+?)\}\}/g
      var matches = s.match(r) || [];

      matches.forEach(function(match) {
        var key = match.substring(opening.length, match.length - closing.length);//chop {{ and }}
        if (typeof values[key] != 'undefined')
          s = s.replace(match, values[key]);
      });
      return new this.constructor(s);
    },

    times: function(n) {
      return new this.constructor(new Array(n + 1).join(this.s));
    },

    toBoolean: function() {
      if (typeof this.orig === 'string') {
        var s = this.s.toLowerCase();
        return s === 'true' || s === 'yes' || s === 'on' || s === '1';
      } else
        return this.orig === true || this.orig === 1;
    },

    toFloat: function(precision) {
      var num = parseFloat(this.s)
      if (precision)
        return parseFloat(num.toFixed(precision))
      else
        return num
    },

    toInt: function() { //thanks Google
      // If the string starts with '0x' or '-0x', parse as hex.
      return /^\s*-?0x/i.test(this.s) ? parseInt(this.s, 16) : parseInt(this.s, 10)
    },

    trim: function() {
      var s;
      if (typeof __nsp.trim === 'undefined') 
        s = this.s.replace(/(^\s*|\s*$)/g, '')
      else 
        s = this.s.trim()
      return new this.constructor(s);
    },

    trimLeft: function() {
      var s;
      if (__nsp.trimLeft)
        s = this.s.trimLeft();
      else
        s = this.s.replace(/(^\s*)/g, '');
      return new this.constructor(s);
    },

    trimRight: function() {
      var s;
      if (__nsp.trimRight)
        s = this.s.trimRight();
      else
        s = this.s.replace(/\s+$/, '');
      return new this.constructor(s);
    },

    truncate: function(length, pruneStr) { //from underscore.string, author: github.com/rwz
      var str = this.s;

      length = ~~length;
      pruneStr = pruneStr || '...';

      if (str.length <= length) return new this.constructor(str);

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = new S(template.slice(0, template.length-1)).trimRight().s;

      return (template+pruneStr).length > str.length ? new S(str) : new S(str.slice(0, template.length)+pruneStr);
    },

    toCSV: function() {
      var delim = ',', qualifier = '"', escape = '\\', encloseNumbers = true, keys = false;
      var dataArray = [];

      function hasVal(it) {
        return it !== null && it !== '';
      }

      if (typeof arguments[0] === 'object') {
        delim = arguments[0].delimiter || delim;
        delim = arguments[0].separator || delim;
        qualifier = arguments[0].qualifier || qualifier;
        encloseNumbers = !!arguments[0].encloseNumbers;
        escape = arguments[0].escape || escape;
        keys = !!arguments[0].keys;
      } else if (typeof arguments[0] === 'string') {
        delim = arguments[0];
      }

      if (typeof arguments[1] === 'string')
        qualifier = arguments[1];

      if (arguments[1] === null)
        qualifier = null;

       if (this.orig instanceof Array)
        dataArray  = this.orig;
      else { //object
        for (var key in this.orig)
          if (this.orig.hasOwnProperty(key))
            if (keys)
              dataArray.push(key);
            else
              dataArray.push(this.orig[key]);
      }

      var rep = escape + qualifier;
      var buildString = [];
      for (var i = 0; i < dataArray.length; ++i) {
        var shouldQualify = hasVal(qualifier)
        if (typeof dataArray[i] == 'number')
          shouldQualify &= encloseNumbers;
        
        if (shouldQualify)
          buildString.push(qualifier);
        
        if (dataArray[i] !== null && dataArray[i] !== undefined) {
          var d = new S(dataArray[i]).replaceAll(qualifier, rep).s;
          buildString.push(d);
        } else 
          buildString.push('')

        if (shouldQualify)
          buildString.push(qualifier);
        
        if (delim)
          buildString.push(delim);
      }

      //chop last delim
      //console.log(buildString.length)
      buildString.length = buildString.length - 1;
      return new this.constructor(buildString.join(''));
    },

    toString: function() {
      return this.s;
    },

    //#modified from https://github.com/epeli/underscore.string
    underscore: function() {
      var s = this.trim().s.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
      if ((new S(this.s.charAt(0))).isUpper()) {
        s = '_' + s;
      }
      return new this.constructor(s);
    },

    unescapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      }));
    },

    valueOf: function() {
      return this.s.valueOf();
    },

    //#Added a New Function called wrapHTML.
    wrapHTML: function (tagName, tagAttrs) {
      var s = this.s, el = (tagName == null) ? 'span' : tagName, elAttr = '', wrapped = '';
      if(typeof tagAttrs == 'object') for(var prop in tagAttrs) elAttr += ' ' + prop + '="' +(new this.constructor(tagAttrs[prop])).escapeHTML() + '"';
      s = wrapped.concat('<', el, elAttr, '>', this, '</', el, '>');
      return new this.constructor(s);
    }
  }

  var methodsAdded = [];
  function extendPrototype() {
    for (var name in __sp) {
      (function(name){
        var func = __sp[name];
        if (!__nsp.hasOwnProperty(name)) {
          methodsAdded.push(name);
          __nsp[name] = function() {
            String.prototype.s = this;
            return func.apply(this, arguments);
          }
        }
      })(name);
    }
  }

  function restorePrototype() {
    for (var i = 0; i < methodsAdded.length; ++i)
      delete String.prototype[methodsAdded[i]];
    methodsAdded.length = 0;
  }


/*************************************
/* Attach Native JavaScript String Properties
/*************************************/

  var nativeProperties = getNativeStringProperties();
  for (var name in nativeProperties) {
    (function(name) {
      var stringProp = __nsp[name];
      if (typeof stringProp == 'function') {
        //console.log(stringProp)
        if (!__sp[name]) {
          if (nativeProperties[name] === 'string') {
            __sp[name] = function() {
              //console.log(name)
              return new this.constructor(stringProp.apply(this, arguments));
            }
          } else {
            __sp[name] = stringProp;
          }
        }
      }
    })(name);
  }


/*************************************
/* Function Aliases
/*************************************/

  __sp.repeat = __sp.times;
  __sp.include = __sp.contains;
  __sp.toInteger = __sp.toInt;
  __sp.toBool = __sp.toBoolean;
  __sp.decodeHTMLEntities = __sp.decodeHtmlEntities //ensure consistent casing scheme of 'HTML'


//******************************************************************************
// Set the constructor.  Without this, string.js objects are instances of
// Object instead of S.
//******************************************************************************

  __sp.constructor = S;


/*************************************
/* Private Functions
/*************************************/

  function getNativeStringProperties() {
    var names = getNativeStringPropertyNames();
    var retObj = {};

    for (var i = 0; i < names.length; ++i) {
      var name = names[i];
      var func = __nsp[name];
      try {
        var type = typeof func.apply('teststring', []);
        retObj[name] = type;
      } catch (e) {}
    }
    return retObj;
  }

  function getNativeStringPropertyNames() {
    var results = [];
    if (Object.getOwnPropertyNames) {
      results = Object.getOwnPropertyNames(__nsp);
      results.splice(results.indexOf('valueOf'), 1);
      results.splice(results.indexOf('toString'), 1);
      return results;
    } else { //meant for legacy cruft, this could probably be made more efficient
      var stringNames = {};
      var objectNames = [];
      for (var name in String.prototype)
        stringNames[name] = name;

      for (var name in Object.prototype)
        delete stringNames[name];

      //stringNames['toString'] = 'toString'; //this was deleted with the rest of the object names
      for (var name in stringNames) {
        results.push(name);
      }
      return results;
    }
  }

  function Export(str) {
    return new S(str);
  };

  //attach exports to StringJSWrapper
  Export.extendPrototype = extendPrototype;
  Export.restorePrototype = restorePrototype;
  Export.VERSION = VERSION;
  Export.TMPL_OPEN = '{{';
  Export.TMPL_CLOSE = '}}';
  Export.ENTITIES = ENTITIES;



/*************************************
/* Exports
/*************************************/

  if (typeof module !== 'undefined'  && typeof module.exports !== 'undefined') {
    module.exports = Export;

  } else {

    if(typeof define === "function" && define.amd) {
      define([], function() {
        return Export;
      });
    } else {
      window.S = Export;
    }
  }


/*************************************
/* 3rd Party Private Functions
/*************************************/

  //from sugar.js
  function multiArgs(args, fn) {
    var result = [], i;
    for(i = 0; i < args.length; i++) {
      result.push(args[i]);
      if(fn) fn.call(args, args[i], i);
    }
    return result;
  }

  //from underscore.string
  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    amp: '&'
  };

  //from underscore.string
  var reversedEscapeChars = {};
  for(var key in escapeChars){ reversedEscapeChars[escapeChars[key]] = key; }

  ENTITIES = {
    "amp" : "&",
    "gt" : ">",
    "lt" : "<",
    "quot" : "\"",
    "apos" : "'",
    "AElig" : 198,
    "Aacute" : 193,
    "Acirc" : 194,
    "Agrave" : 192,
    "Aring" : 197,
    "Atilde" : 195,
    "Auml" : 196,
    "Ccedil" : 199,
    "ETH" : 208,
    "Eacute" : 201,
    "Ecirc" : 202,
    "Egrave" : 200,
    "Euml" : 203,
    "Iacute" : 205,
    "Icirc" : 206,
    "Igrave" : 204,
    "Iuml" : 207,
    "Ntilde" : 209,
    "Oacute" : 211,
    "Ocirc" : 212,
    "Ograve" : 210,
    "Oslash" : 216,
    "Otilde" : 213,
    "Ouml" : 214,
    "THORN" : 222,
    "Uacute" : 218,
    "Ucirc" : 219,
    "Ugrave" : 217,
    "Uuml" : 220,
    "Yacute" : 221,
    "aacute" : 225,
    "acirc" : 226,
    "aelig" : 230,
    "agrave" : 224,
    "aring" : 229,
    "atilde" : 227,
    "auml" : 228,
    "ccedil" : 231,
    "eacute" : 233,
    "ecirc" : 234,
    "egrave" : 232,
    "eth" : 240,
    "euml" : 235,
    "iacute" : 237,
    "icirc" : 238,
    "igrave" : 236,
    "iuml" : 239,
    "ntilde" : 241,
    "oacute" : 243,
    "ocirc" : 244,
    "ograve" : 242,
    "oslash" : 248,
    "otilde" : 245,
    "ouml" : 246,
    "szlig" : 223,
    "thorn" : 254,
    "uacute" : 250,
    "ucirc" : 251,
    "ugrave" : 249,
    "uuml" : 252,
    "yacute" : 253,
    "yuml" : 255,
    "copy" : 169,
    "reg" : 174,
    "nbsp" : 160,
    "iexcl" : 161,
    "cent" : 162,
    "pound" : 163,
    "curren" : 164,
    "yen" : 165,
    "brvbar" : 166,
    "sect" : 167,
    "uml" : 168,
    "ordf" : 170,
    "laquo" : 171,
    "not" : 172,
    "shy" : 173,
    "macr" : 175,
    "deg" : 176,
    "plusmn" : 177,
    "sup1" : 185,
    "sup2" : 178,
    "sup3" : 179,
    "acute" : 180,
    "micro" : 181,
    "para" : 182,
    "middot" : 183,
    "cedil" : 184,
    "ordm" : 186,
    "raquo" : 187,
    "frac14" : 188,
    "frac12" : 189,
    "frac34" : 190,
    "iquest" : 191,
    "times" : 215,
    "divide" : 247,
    "OElig;" : 338,
    "oelig;" : 339,
    "Scaron;" : 352,
    "scaron;" : 353,
    "Yuml;" : 376,
    "fnof;" : 402,
    "circ;" : 710,
    "tilde;" : 732,
    "Alpha;" : 913,
    "Beta;" : 914,
    "Gamma;" : 915,
    "Delta;" : 916,
    "Epsilon;" : 917,
    "Zeta;" : 918,
    "Eta;" : 919,
    "Theta;" : 920,
    "Iota;" : 921,
    "Kappa;" : 922,
    "Lambda;" : 923,
    "Mu;" : 924,
    "Nu;" : 925,
    "Xi;" : 926,
    "Omicron;" : 927,
    "Pi;" : 928,
    "Rho;" : 929,
    "Sigma;" : 931,
    "Tau;" : 932,
    "Upsilon;" : 933,
    "Phi;" : 934,
    "Chi;" : 935,
    "Psi;" : 936,
    "Omega;" : 937,
    "alpha;" : 945,
    "beta;" : 946,
    "gamma;" : 947,
    "delta;" : 948,
    "epsilon;" : 949,
    "zeta;" : 950,
    "eta;" : 951,
    "theta;" : 952,
    "iota;" : 953,
    "kappa;" : 954,
    "lambda;" : 955,
    "mu;" : 956,
    "nu;" : 957,
    "xi;" : 958,
    "omicron;" : 959,
    "pi;" : 960,
    "rho;" : 961,
    "sigmaf;" : 962,
    "sigma;" : 963,
    "tau;" : 964,
    "upsilon;" : 965,
    "phi;" : 966,
    "chi;" : 967,
    "psi;" : 968,
    "omega;" : 969,
    "thetasym;" : 977,
    "upsih;" : 978,
    "piv;" : 982,
    "ensp;" : 8194,
    "emsp;" : 8195,
    "thinsp;" : 8201,
    "zwnj;" : 8204,
    "zwj;" : 8205,
    "lrm;" : 8206,
    "rlm;" : 8207,
    "ndash;" : 8211,
    "mdash;" : 8212,
    "lsquo;" : 8216,
    "rsquo;" : 8217,
    "sbquo;" : 8218,
    "ldquo;" : 8220,
    "rdquo;" : 8221,
    "bdquo;" : 8222,
    "dagger;" : 8224,
    "Dagger;" : 8225,
    "bull;" : 8226,
    "hellip;" : 8230,
    "permil;" : 8240,
    "prime;" : 8242,
    "Prime;" : 8243,
    "lsaquo;" : 8249,
    "rsaquo;" : 8250,
    "oline;" : 8254,
    "frasl;" : 8260,
    "euro;" : 8364,
    "image;" : 8465,
    "weierp;" : 8472,
    "real;" : 8476,
    "trade;" : 8482,
    "alefsym;" : 8501,
    "larr;" : 8592,
    "uarr;" : 8593,
    "rarr;" : 8594,
    "darr;" : 8595,
    "harr;" : 8596,
    "crarr;" : 8629,
    "lArr;" : 8656,
    "uArr;" : 8657,
    "rArr;" : 8658,
    "dArr;" : 8659,
    "hArr;" : 8660,
    "forall;" : 8704,
    "part;" : 8706,
    "exist;" : 8707,
    "empty;" : 8709,
    "nabla;" : 8711,
    "isin;" : 8712,
    "notin;" : 8713,
    "ni;" : 8715,
    "prod;" : 8719,
    "sum;" : 8721,
    "minus;" : 8722,
    "lowast;" : 8727,
    "radic;" : 8730,
    "prop;" : 8733,
    "infin;" : 8734,
    "ang;" : 8736,
    "and;" : 8743,
    "or;" : 8744,
    "cap;" : 8745,
    "cup;" : 8746,
    "int;" : 8747,
    "there4;" : 8756,
    "sim;" : 8764,
    "cong;" : 8773,
    "asymp;" : 8776,
    "ne;" : 8800,
    "equiv;" : 8801,
    "le;" : 8804,
    "ge;" : 8805,
    "sub;" : 8834,
    "sup;" : 8835,
    "nsub;" : 8836,
    "sube;" : 8838,
    "supe;" : 8839,
    "oplus;" : 8853,
    "otimes;" : 8855,
    "perp;" : 8869,
    "sdot;" : 8901,
    "lceil;" : 8968,
    "rceil;" : 8969,
    "lfloor;" : 8970,
    "rfloor;" : 8971,
    "lang;" : 9001,
    "rang;" : 9002,
    "loz;" : 9674,
    "spades;" : 9824,
    "clubs;" : 9827,
    "hearts;" : 9829,
    "diams;" : 9830
  }


}).call(this);


window.onload = function () {
    var a = '';
    //$('body').append("<link href='http://hab.pslresearch.com/InstarBuilding/SBdocs/sbdoc2/r/nprogress/nprogress.css' rel='stylesheet' />");

    body_text = $('body').html();
    l = document.location;
    l = l.toString();

    // common button
    a = '<div style="background-color:cyan;padding:10px;">COMMON LINKS: ';
    a += '<a href="https://gpcms.habcommunity.com/www/front.php?module=panel&controller=groups&act=index&__menu_node=show_groups">Groups</a> | ';
    a += '<a href="https://gpcms.habcommunity.com/www/front.php?module=panel&controller=import">Import unique links</a> | ';
    a += '<a href="https://gpcms.habcommunity.com/www/project.php?act=list_projects&__menu_node=projectlist&men=projekte">Projects</a> | ';
    a += '<a href="https://gpcms.habcommunity.com/www/front.php?module=survey&controller=maildraft&__menu_node=edit_mail_drafts">Mail templates</a> | ';
    a += '<a href="https://gpcms.habcommunity.com/www/front.php?module=panel&controller=importupdate">Update pseudonym</a>';

    var uri = new Uri(document.location.href);
    var pid = uri.getQueryParamValue('pid');
    if (pid) {
        a += '<br/><br/>CURRENT PROJECT (pid=' + pid + ') : ';
        a += '<a href="https://gpcms.habcommunity.com/www/front.php?module=panel&controller=sampling&act=create_sample&pid=' + pid + '">Create sample</a> | ';
        a += '<a href="https://gpcms.habcommunity.com/www/layout_editor.php?act=overview&pid=' + pid + '&__menu_node=edit_layout">Layout</a> | ';
        a += '<a href="https://gpcms.habcommunity.com/www/layout_editor.php?act=edit_tpl&pid=' + pid + '&file=main.tpl">main.tpl</a> | ';
        a += '<a href="https://gpcms.habcommunity.com/www/edit_admin.php?act=view&syid=' + pid + '&__menu_node=edit">Questionnaire editor</a> | ';
        a += '<a href="https://gpcms.habcommunity.com/www/export_new.php?act=project&pid=' + pid + '&__menu_node=export">Export</a> | ';
        a += '<a href="https://gpcms.habcommunity.com/www/export_new.php?act=edit_maps&mode=project&pid=' + pid + '&mode=project&__menu_node=edit_maps">Export template editor</a>';
    }
    a += '</div>';
    $('#wrap').before(a);

    if (l == 'https://gpcms.habcommunity.com/www/front.php?module=panel&controller=import') {
        ul_gp_IMPORT();
    } else if (l == 'https://gpcms.habcommunity.com/www/front.php' &&
        S(body_text).contains('The selected file contains') &&
        S(body_text).contains('Proceed to preview') &&
        S(body_text).contains('Please save your allocation before switching to another tab.')) {
        ul_gp_IMPORT_PAGE2();
    } else if (l == 'https://gpcms.habcommunity.com/www/front.php' &&
        S(body_text).contains('Preview: This is only the preview of the uploaded data. The data has not been imported yet. You can edit the uploaded data before you finally import it.') &&
        S(body_text).contains('Import')) {
        ul_gp_IMPORT_PAGE3();
    } else if (l == 'https://gpcms.habcommunity.com/www/front.php?module=panel&controller=importupdate') {
        ul_gp_UPDATE_PSEUDONYM();
    } else if ((S(l).startsWith('https://gpcms.habcommunity.com/www/front.php?module=panel&controller=sampling&act=proc_create_sample&pid=') ||
            S(l).startsWith('https://gpcms.habcommunity.com/www/front.php?module=panel&controller=sampling&act=view_sample&pid=')) &&
        S(body_text).contains('The sample contains the participants of the survey project. A project may have one or several samples. For example you can create a second sample to requote.')) {
        ul_gp_SAMPLE_OVERVIEW();
    } else if (S(l).startsWith('https://gpcms.habcommunity.com/www/front.php?module=panel&controller=sampling&act=define_filter&pid=') &&
        S(body_text).contains('Here you define the panelists belonging to your sample. For example this could be single panelists that you have found with the help of panel search and that you have collated to a group.')) {
        ul_gp_SAMPLE_DEFINE_BASIC_SET();
    } else if (S(l).startsWith('https://gpcms.habcommunity.com/www/front.php?module=panel&controller=sampling&act=draw_sample&pid=') &&
        S(body_text).contains('Do you want to draw the sample now?')) {
        ul_gp_SAMPLE_DRAW_SAMPLE();
    } else if (S(l).startsWith('https://gpcms.habcommunity.com/www/export_new.php?act=edit_maps&mode=project&pid=') &&
        S(body_text).contains('The following list shows all available export templates.')) {
        ul_gp_EXPORT_TEMPLATE_EDITOR();
    } else if (S(body_text).contains('Create a new template based on \'Master data, address data and result data\'')) {
        ul_gp_EXPORT_TEMPLATE_EDITOR_PAGE2();
    } else if (S(l).startsWith('https://gpcms.habcommunity.com/www/export_new.php?act=upload_map&mode=project&pid=') &&
        S(body_text).contains('Upload definitions for template')) {
        ul_gp_UPLOAD_TEMPLATE();
    } else if (S(body_text).contains('The uploaded template definition was applied successfully.')) {
        ul_gp_UPLOAD_TEMPLATE_DONE();
    } else if (S(body_text).contains('Please select the file format for the export') &&
        S(body_text).contains('Export of data (all answers)')) {
        ul_gp_EXPORT_DATA();
    } else if (S(body_text).contains('Create group') &&
        S(body_text).contains('Please specify the details for the group.')) {
        ul_gp_CREATE_GROUP();
    } else if (S(l).contains('https://bvt.habcommunity.com/agency_project_details.php?agencyid=')) {
        bvt_AGENCY_REDIRECT();
    }

}

setInterval(function () {
    body_text = $('body').html();
    if (S(l).startsWith('https://gpcms.habcommunity.com/www/front.php?module=panel&controller=sampling&pid=') &&
        S(body_text).contains('The sample contains the participants of the survey project. A project may have one or several samples. For example you can create a second sample to requote.') &&
        S(body_text).contains('Filter result:') &&
        S(body_text).contains('Panelists matched') &&
        S(body_text).contains('The filter was applied successfully.') &&
        S(body_text).contains('panelists match the condition.')) {
        ul_gp_SAMPLE_DEFINE_BASIC_SET_AFTER_ACTIVATE_FILTER();
    }
}, 1000);

function ul_gp_IMPORT() {
    var a = '';
    var b = '';
    var ptitle = '';

    a = '<div style="background-color:yellow;padding:10px;">';
    a += 'Paste PTITLE here: <input type="text" id="ul_gp_IMPORT_text"/> and click <input type="button" value="P2W" id="ul_gp_IMPORT_button_P2W" />';
    a += '<input type="button" value="AGENCY" id="ul_gp_IMPORT_button_AGENCY" />';
    a += '</div>';
    $('#f1').before(a);

    // button, text function
    $('#ul_gp_IMPORT_button_P2W').on('click', function () {
        $('#reg_code').val(374); //p2w upload
        $('#category_id').val(18).change(); // 02. p2w - Projects
        ptitle = $('#ul_gp_IMPORT_text').val(); // sample: 210200711RA
        if (ptitle) {
            $("#group_id > option").each(function () {
                b = $(this).text();
                if (S(b.toLowerCase()).startsWith(ptitle.toLowerCase())) {
                    $("#group_id").val($(this).val());
                }
            });
        }
    });
    $('#ul_gp_IMPORT_button_AGENCY').on('click', function () {
        $('#reg_code').val(375); //agency upload
        $('#category_id').val(19).change(); // <option value="19">03. Agency - Projects</option>
        ptitle = $('#ul_gp_IMPORT_text').val(); // sample: 320204060
        if (ptitle) {
            $("#group_id > option").each(function () {
                b = $(this).text();
                if (S(b.toLowerCase()).startsWith(ptitle.toLowerCase())) {
                    $("#group_id").val($(this).val());
                }
            });
        }
    });
    $('#ul_gp_IMPORT_text').on('keyup change click', function () {
        b = $(this).val();
        b = b.toLowerCase();
        if (S(b).endsWith('p2w')) {
            $('#ul_gp_IMPORT_button_P2W').click();
        }
        if (S(b).endsWith('agency')) {
            $('#ul_gp_IMPORT_button_AGENCY').click();
        }
    });

    $('#charset').val('UTF-8');
    $('#charset').parent().parent().css('background-color', 'lightgreen');
    $('#pstatus').val(3); //<option value="3">Active (P2W/Agency)</option>
    $('#pstatus').parent().parent().css('background-color', 'lightgreen');

    // yellow
    $('#reg_code').parent().parent().css('background-color', 'yellow');
    $('#category_id').parent().parent().css('background-color', 'yellow');
    $('#group_id').parent().parent().css('background-color', 'yellow');

    // pink
    $('input[type="file"]').eq(0).parent().parent().css('background-color', 'pink');

}

function ul_gp_IMPORT_PAGE2() {
    //    alert('ul_gp_IMPORT_PAGE2');
    var b = '';
    $('input[type="submit"]').each(function () {
        b = $(this).val();
        if (b == 'Proceed to preview') {
            $(this).click();
        }
    });
}

function ul_gp_IMPORT_PAGE3() {
    //alert('ul_gp_IMPORT_PAGE3');
    var b = '';
    $('input[type="submit"]').each(function () {
        b = $(this).val();
        if (b == 'Import ') {
            $(this).click();
        }
    });
}

function ul_gp_UPDATE_PSEUDONYM() {
    $('#charset').val('UTF-8');
    $('#charset').parent().parent().css('background-color', 'lightgreen');

    // pink
    $('input[type="file"]').eq(0).parent().parent().css('background-color', 'pink');
}

function ul_gp_SAMPLE_OVERVIEW() {
    //alert('ul_gp_SAMPLE_OVERVIEW');

    // check if 0 data
    var isFound = false;
    var v = 0;
    $('td').each(function () {
        if ($(this).text() == 'Number of panelists matching') {
            isFound = true;
            v = $(this).next().text();
        }
    });

    if (isFound) {
        v = parseFloat(v);
        if (v == 0) {
            //alert('Number of panelists matching is 0');
            $('td').each(function () {
                if ($(this).text() == 'Number of panelists matching') {
                    $(this).parent().css('background-color', 'red');
                }
            });

            // proceed to Define basic set
            $('a').each(function () {
                if ($(this).text() == 'Define basic set') {
                    //alert('found');
                    window.location.href = $(this).attr('href');
                }
            });
        }
    }
}

function ul_gp_SAMPLE_DEFINE_BASIC_SET() {
    //alert('ul_gp_SAMPLE_DEFINE_BASIC_SET');
    var a = '';
    var b = '';
    var c = '';

    var ptitle = $('h1').text();
    ptitle = ptitle.toString();
    ptitle = ptitle.slice(ptitle.indexOf('" in project "') + ('" in project "').length, ptitle.length - 1);
    // sample: Define basic set for sample "TESTING_ONLY_DELETE_LATER" in project "320204060YD"

    a = '<div style="background-color:yellow;padding:10px;">';
    a += '<input type="button" value="P2W" id="ul_gp_SAMPLE_DEFINE_BASIC_SET_button_P2W" />';
    a += '<input type="button" value="AGENCY" id="ul_gp_SAMPLE_DEFINE_BASIC_SET_button_AGENCY" />';
    a += '</div>';
    $('#print_filter_form').before(a);

    // button function
    $('#ul_gp_SAMPLE_DEFINE_BASIC_SET_button_P2W').on('click', function () {
        $('#category').val(18).change(); // 02. p2w - Projects
        $("#gid > option").each(function () {
            b = $(this).text();
            c = ptitle + '_p2w';
            b = b.toLowerCase();
            c = c.toLowerCase();
            if (S(b).startsWith(c)) {
                $("#gid").val($(this).val());
            }
        });
    });
    $('#ul_gp_SAMPLE_DEFINE_BASIC_SET_button_AGENCY').on('click', function () {
        $('#category').val(19).change(); // 03. Agency - Projects
        $("#gid > option").each(function () {
            b = $(this).text();
            c = ptitle + '_agency';
            b = b.toLowerCase();
            c = c.toLowerCase();
            if (S(b).startsWith(c)) {
                $("#gid").val($(this).val());
            }
        });
    });

    // yellow
    $('#category').parent().parent().css('background-color', 'yellow');
    $('#gid').parent().parent().css('background-color', 'yellow');

    $('#allocation_filter_id').val(2); //<option value="2">Remove Panelists who joined in the last 7 days</option>
    $('#allocation_filter_id').parent().parent().css('background-color', 'lightgreen');
    $('#pstatus__').val(3); //<option value="3">Active (P2W/Agency)</option>
    $('#pstatus__').parent().parent().css('background-color', 'lightgreen');
}

function ul_gp_SAMPLE_DEFINE_BASIC_SET_AFTER_ACTIVATE_FILTER() {
    // proceed to Draw sample
    $('a').each(function () {
        if ($(this).text() == 'Draw sample') {
            window.location.href = $(this).attr('href');
        }
    });
}

function ul_gp_SAMPLE_DRAW_SAMPLE() {
    var b = '';
    $('input[type="submit"]').each(function () {
        b = $(this).val();
        if (b == 'Draw sample') {
            $(this).click();
        }
    });
}

function ul_gp_EXPORT_TEMPLATE_EDITOR() {
    //alert('ul_gp_EXPORT_TEMPLATE_EDITOR');
    var b = '';
    body_text = $('body').html();

    var uri = new Uri(document.location.href);
    var pid = uri.getQueryParamValue('pid');

    if (S(body_text).contains(TEMPLATE_NAME)) {
        $('a').each(function () {
            if (S($(this).text()).startsWith(TEMPLATE_NAME)) {
                $(this).parent().parent().css('background-color', 'lightgreen');

                // proceed to Export
                window.location.href = "https://gpcms.habcommunity.com/www/export_new.php?act=project&pid=" + pid + "&__menu_node=export";
            }
        });
    } else {
        $('#mapname').val('project_addr_master'); // <option value="project_addr_master">Master data, address data and result data</option>
        $('#mapname').parent().parent().css('background-color', 'lightgreen');

        $('input[type="submit"]').each(function () {
            b = $(this).val();
            if (b == 'Create') {
                $(this).click();
            }
        });
    }

}

function ul_gp_EXPORT_TEMPLATE_EDITOR_PAGE2() {
    $('input[type="text"]').eq(0).val(TEMPLATE_NAME);
    $('input[type="text"]').eq(0).parent().parent().css('background-color', 'lightgreen');

    $('input[type="submit"]').each(function () {
        b = $(this).val();
        if (b == 'Save as new template') {
            $(this).click();
        }
    });

}

function ul_gp_UPLOAD_TEMPLATE() {
    $('#charset').val('UTF-8');
    $('#charset').parent().parent().css('background-color', 'lightgreen');

    // pink
    $('input[type="file"]').eq(0).parent().parent().css('background-color', 'pink');
}

function ul_gp_UPLOAD_TEMPLATE_DONE() {
    $('a').each(function () {
        if (S($(this).text()).startsWith(TEMPLATE_NAME)) {
            $(this).parent().parent().css('background-color', 'lightgreen');

            // proceed to Export
            $('a').each(function () {
                if ($(this).prop('title') == 'Export') {
                    window.location.href = $(this).attr('href');
                }
            });
        }
    });
}

function ul_gp_EXPORT_DATA() {
    var a = '';

    // xls
    $('input[type="radio"]').each(function () {
        if ($(this).prop('name') == 'form_format' && $(this).prop('value') == 'xls') {
            $(this).prop('checked', true);
            $(this).parent().parent().css('background-color', 'lightgreen');
        }
    });

    var s = $('body').find('input[type="radio"]');

    //  User-defined template
    s.each(function (index, el) {
        if (index !== s.length - 1) {
            if ($(this).prop('name') == 'form_template' && $(this).prop('value') == 'project_addr_master') {
                s.eq(index + 1).prop('checked', true);
                s.eq(index + 1).parent().parent().css('background-color', 'lightgreen');
            }
        }
    });

    a = '<div style="background-color:yellow;padding:10px;">';
    a += 'Paste Sample Name here: <input type="text" id="ul_gp_EXPORT_DATA_text"/>';
    a += '</div>';
    $('#cform').before(a);

    // text yellow
    var b = '';
    var c = '';
    $('#ul_gp_EXPORT_DATA_text').on('keyup change click', function () {
        c = $(this).val(); // sample: CR_2013-08-25_bg530
        if (c) {
            $("#restrict > option").each(function () {
                //alert(b);
                b = $(this).text();
                if (S(b).startsWith(c)) {
                    $("#restrict").val($(this).val());
                }
            });
        }
    });
    $('#restrict').parent().parent().css('background-color', 'yellow');

    // <input type="checkbox" checked="" value="3" name="form_panelstatus[]">
    s = $('body').find('input[type="checkbox"]');
    s.each(function () {
        if ($(this).prop('name') == 'form_panelstatus[]') {
            $(this).prop('checked', $(this).val() == '3');
            $(this).parent().parent().css('background-color', 'lightgreen');
        }
    });

    s = $('body').find('input[type="text"]');
    s.each(function () {
        if ($(this).prop('name') == 'form_missingvalue_numeric') {
            $(this).val('');
            $(this).parent().parent().css('background-color', 'lightgreen');
        }
        if ($(this).prop('name') == 'form_missingvalue_text') {
            $(this).val('');
            $(this).parent().parent().css('background-color', 'lightgreen');
        }
        if ($(this).prop('name') == 'form_missingvalue_text_empty') {
            $(this).val('');
            $(this).parent().parent().css('background-color', 'lightgreen');
        }
    });

    //<input type="checkbox" value="11" name="form_dispositioncode[]">
    $('input[type="checkbox"]').each(function () {
        if ($(this).prop('name') == 'form_dispositioncode[]') {
            $(this).prop('checked', true);
            $(this).parent().parent().css('background-color', 'lightgreen');
        }
    });
}


function ul_gp_CREATE_GROUP() {
    var a = '';
    var b = '';
    var ptitle = '';

    a = '<div style="background-color:yellow;padding:10px;">';
    a += 'Paste PTITLE here: <input type="text" id="ul_gp_CREATE_GROUP_text"/> and click <input type="button" value="P2W" id="ul_gp_CREATE_GROUP_button_P2W" />';
    a += '<input type="button" value="AGENCY" id="ul_gp_CREATE_GROUP_button_AGENCY" />';
    a += '</div>';
    $('#f1').before(a);

    // button, text function
    $('#ul_gp_CREATE_GROUP_button_P2W').on('click', function () {
        $('#category').val(18).change(); // 02. p2w - Projects
        ptitle = $('#ul_gp_CREATE_GROUP_text').val();
        var s = $('input[type="text"]');
        s.each(function () {
            if ($(this).prop('name') == 'title') {
                $(this).val(ptitle);
            }
        });
    });
    $('#ul_gp_CREATE_GROUP_button_AGENCY').on('click', function () {
        $('#category').val(19).change(); // <option value="19">03. Agency - Projects</option>
        ptitle = $('#ul_gp_CREATE_GROUP_text').val();
        var s = $('input[type="text"]');
        s.each(function () {
            if ($(this).prop('name') == 'title') {
                $(this).val(ptitle);
            }
        });
    });
    $('#ul_gp_CREATE_GROUP_text').on('keyup change click', function () {
        b = $(this).val();
        b = b.toLowerCase();
        if (S(b).endsWith('p2w')) {
            $('#ul_gp_CREATE_GROUP_button_P2W').click();
        }
        if (S(b).endsWith('agency')) {
            $('#ul_gp_CREATE_GROUP_button_AGENCY').click();
        }
    });

    // yellow
    $('#category').parent().parent().css('background-color', 'yellow');
    var s = $('input[type="text"]');
    s.each(function () {
        if ($(this).prop('name') == 'title') {
            $(this).parent().parent().css('background-color', 'yellow');
        }
    });
}


function bvt_AGENCY_REDIRECT() {
    var a = '';
    a = '<div style="background-color:yellow;padding:10px;">';
    a += '<a href="javascript:document.location=document.location + \'&SUPERDOWNLOAD=1\'">SUPERDOWNLOAD</a>';
    a += '<br/><span id="notify"></span>';
    a += '</div>';
    $('h1').eq(0).before(a);

    var b = [];
    var counter = 0;

    var download = function (url, index) {
        $.ajax({
            url: url,
            success: function (result) {
                b[index] = extractTable(result);
                counter++;
                $('#notify').html(counter + '/' + LAST + ' (' + counter / LAST * 100 + '%)');
            }

        });
    };

    var extractTable = function (a) {
        var s = a.toString();
        var start = s.indexOf('<table id="table-box" class="tablesorter">');
        s = s.slice(start, s.length);
        s = s.slice(0, s.indexOf('</table>'));

        return s;
    };

    var extractHeader = function (a) {
        var header = '';
        var s = a.toString();
        header = s.slice(s.indexOf('<thead>'), s.indexOf('</thead>'));
        header = header.replace(/<thead>/g, '');
        header = S(header).collapseWhitespace();
        return header;
    };

    if (S(l).contains('&SUPERDOWNLOAD=1')) {
        var LAST = $("select > option:last").val();

        for (var i = 1; i <= LAST; i++) {
            download(document.location + '&page=' + i, i - 1);
        }
    }

    var extractDataRow = function (a) {
        var s = a.toString();
        s = s.slice(s.indexOf('<tbody>') + 7, s.indexOf('</tbody>'));
        s = S(s).collapseWhitespace();

        return s;

    };

    var dtimer = setInterval(function () {
        if (counter == LAST) {
            clearInterval(dtimer);

            var d = '';

            d += '<table>';
            d += '<thead>' + extractHeader(b[0]) + '</thead>';
            d += '<tbody>';
            +extractDataRow(b[0]);

            for (var i = 0, ii = b.length; i < ii; i++) {
                var ti = b[i];

                d += extractDataRow(ti);
            }
            d += '</tbody>';
            d += '</table>';
            //$('#table-box').after('<hr><textarea style="width:500px;height:500px;">' + d + '</textarea>');
            $('#table-box').after('<hr>' + d);
        }
    }, 500);
}

// ====================================================================================================
// RESOURCE
// ====================================================================================================
/*! jsUri v1.1.1 | https://github.com/derek-watson/jsUri */
var Query = function (a) {
    "use strict";
    var b = function (a) {
            var b = [],
                c,
                d,
                e,
                f;
            if (typeof a == "undefined" || a === null || a === "")
                return b;
            a.indexOf("?") === 0 && (a = a.substring(1)),
                d = a.toString().split(/[&;]/);
            for (c = 0; c < d.length; c++)
                e = d[c], f = e.split("="), b.push([f[0], f[1]]);
            return b
        },
        c = b(a),
        d = function () {
            var a = "",
                b,
                d;
            for (b = 0; b < c.length; b++)
                d = c[b], a.length > 0 && (a += "&"), a += d.join("=");
            return a.length > 0 ? "?" + a : a
        },
        e = function (a) {
            a = decodeURIComponent(a),
                a = a.replace("+", " ");
            return a
        },
        f = function (a) {
            var b,
                d;
            for (d = 0; d < c.length; d++) {
                b = c[d];
                if (e(a) === e(b[0]))
                    return b[1]
            }
        },
        g = function (a) {
            var b = [],
                d,
                f;
            for (d = 0; d < c.length; d++)
                f = c[d], e(a) === e(f[0]) && b.push(f[1]);
            return b
        },
        h = function (a, b) {
            var d = [],
                f,
                g,
                h,
                i;
            for (f = 0; f < c.length; f++)
                g = c[f], h = e(g[0]) === e(a), i = e(g[1]) === e(b), (arguments.length === 1 && !h || arguments.length === 2 && !h && !i) && d.push(g);
            c = d;
            return this
        },
        i = function (a, b, d) {
            arguments.length === 3 && d !== -1 ? (d = Math.min(d, c.length), c.splice(d, 0, [a, b])) : arguments.length > 0 && c.push([a, b]);
            return this
        },
        j = function (a, b, d) {
            var f = -1,
                g,
                j;
            if (arguments.length === 3) {
                for (g = 0; g < c.length; g++) {
                    j = c[g];
                    if (e(j[0]) === e(a) && decodeURIComponent(j[1]) === e(d)) {
                        f = g;
                        break
                    }
                }
                h(a, d).addParam(a, b, f)
            } else {
                for (g = 0; g < c.length; g++) {
                    j = c[g];
                    if (e(j[0]) === e(a)) {
                        f = g;
                        break
                    }
                }
                h(a),
                    i(a, b, f)
            }
            return this
        };
    return {
        getParamValue: f,
        getParamValues: g,
        deleteParam: h,
        addParam: i,
        replaceParam: j,
        toString: d
    }
}, Uri = function (a) {
    "use strict";
    var b = !1,
        c = function (a) {
            var c = {
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                },
                d = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
                e = {
                    name: "queryKey",
                    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                },
                f = c[b ? "strict" : "loose"].exec(a),
                g = {},
                h = 14;
            while (h--)
                g[d[h]] = f[h] || "";
            g[e.name] = {},
                g[d[12]].replace(e.parser, function (a, b, c) {
                    b && (g[e.name][b] = c)
                });
            return g
        },
        d = c(a || ""),
        e = new Query(d.query),
        f = function (a) {
            typeof a != "undefined" && (d.protocol = a);
            return d.protocol
        },
        g = null,
        h = function (a) {
            typeof a != "undefined" && (g = a);
            return g === null ? d.source.indexOf("//") !== -1 : g
        },
        i = function (a) {
            typeof a != "undefined" && (d.userInfo = a);
            return d.userInfo
        },
        j = function (a) {
            typeof a != "undefined" && (d.host = a);
            return d.host
        },
        k = function (a) {
            typeof a != "undefined" && (d.port = a);
            return d.port
        },
        l = function (a) {
            typeof a != "undefined" && (d.path = a);
            return d.path
        },
        m = function (a) {
            typeof a != "undefined" && (e = new Query(a));
            return e
        },
        n = function (a) {
            typeof a != "undefined" && (d.anchor = a);
            return d.anchor
        },
        o = function (a) {
            f(a);
            return this
        },
        p = function (a) {
            h(a);
            return this
        },
        q = function (a) {
            i(a);
            return this
        },
        r = function (a) {
            j(a);
            return this
        },
        s = function (a) {
            k(a);
            return this
        },
        t = function (a) {
            l(a);
            return this
        },
        u = function (a) {
            m(a);
            return this
        },
        v = function (a) {
            n(a);
            return this
        },
        w = function (a) {
            return m().getParamValue(a)
        },
        x = function (a) {
            return m().getParamValues(a)
        },
        y = function (a, b) {
            arguments.length === 2 ? m().deleteParam(a, b) : m().deleteParam(a);
            return this
        },
        z = function (a, b, c) {
            arguments.length === 3 ? m().addParam(a, b, c) : m().addParam(a, b);
            return this
        },
        A = function (a, b, c) {
            arguments.length === 3 ? m().replaceParam(a, b, c) : m().replaceParam(a, b);
            return this
        },
        B = function () {
            var a = "",
                b = function (a) {
                    return a !== null && a !== ""
                };
            b(f()) ? (a += f(), f().indexOf(":") !== f().length - 1 && (a += ":"), a += "//") : h() && b(j()) && (a += "//"),
            b(i()) && b(j()) && (a += i(), i().indexOf("@") !== i().length - 1 && (a += "@")),
            b(j()) && (a += j(), b(k()) && (a += ":" + k())),
                b(l()) ? a += l() : b(j()) && (b(m().toString()) || b(n())) && (a += "/"),
            b(m().toString()) && (m().toString().indexOf("?") !== 0 && (a += "?"), a += m().toString()),
            b(n()) && (n().indexOf("#") !== 0 && (a += "#"), a += n());
            return a
        },
        C = function () {
            return new Uri(B())
        };
    return {
        protocol: f,
        hasAuthorityPrefix: h,
        userInfo: i,
        host: j,
        port: k,
        path: l,
        query: m,
        anchor: n,
        setProtocol: o,
        setHasAuthorityPrefix: p,
        setUserInfo: q,
        setHost: r,
        setPort: s,
        setPath: t,
        setQuery: u,
        setAnchor: v,
        getQueryParamValue: w,
        getQueryParamValues: x,
        deleteQueryParam: y,
        addQueryParam: z,
        replaceQueryParam: A,
        toString: B,
        clone: C
    }
}, jsUri = Uri;