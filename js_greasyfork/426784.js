// ==UserScript==
// @name         Yt Classic
// @namespace    Yt Classic
// @version      2.2.1
// @author       Snarl
// @description  Classic YouTube layout
// @match        https://www.youtube.com/watch*
// @match        http://www.youtube.com/watch*
// @match        https://www.youtube.com/channel/*
// @match        http://www.youtube.com/channel/*
// @match        https://www.youtube.com/user/*
// @match        http://www.youtube.com/user/*
// @match        https://www.youtube.com/c/*
// @match        http://www.youtube.com
// @grant        none
// @run-at       document-start
// @icon         https://yt3.ggpht.com/-afBnHVG_R6E/AAAAAAAAAAI/AAAAAAAAAAA/LtE5kbPkZvE/s27-c-k-no-mo-rj-c0xffffff/photo.jpg
// @downloadURL https://update.greasyfork.org/scripts/426784/Yt%20Classic.user.js
// @updateURL https://update.greasyfork.org/scripts/426784/Yt%20Classic.meta.js
// ==/UserScript==

(function() {
    //'use strict';

    var d = window.document, readyState = d.readyState, w; if (typeof unsafeWindow != 'undefined') { w = unsafeWindow } else w = window; w.classic_load_time = readyState;
    // earliest stage of loading the yt page
    if (d.lastChild && d.readyState == 'loading' && !(typeof ytspf != 'undefined' && ytspf.enabled == true) && typeof Proxy == 'function') {

      var s = d.createElement('script'), frame = d.createElement('iframe'), form = d.createElement('form')
      s.id = 'ytspf-id'
      var h = d.lastChild.firstChild; // HEAD element already exists

      //frame.src = '/yts/jsbin/player_ias-vfl5eNx6Z/en_US/base.js'
      frame.name = 'messageTxt'
      form.id = 'outputText'

      // code to define the ytspf object as it once used to be, before the new yt code has a chance to do it differently
      var code = "let ytspf = window.ytspf = {};ytspf.enabled = true;ytspf.config = {'reload-identifier': 'spfreload'};ytspf.config['request-headers'] = {'X-YouTube-Ad-Signals': {toString: function() {return (window['yt'] && yt['ads_'] && yt.ads_['signals_'] &&yt.ads_.signals_['getAdSignalsString']) ?yt.ads_.signals_.getAdSignalsString() :'';}},'X-YouTube-Identity-Token': null};ytspf.config['experimental-request-headers'] = ytspf.config['request-headers'];ytspf.config['cache-max'] = 50;ytspf.config['navigate-limit'] = 50;ytspf.config['navigate-lifetime'] = 64800000;"

      // then wrap the ytspf object with a proxy of the same name with a "set"-trap to deny the re-definition attempt by yt
      code = code + "ytspf = new Proxy(window.ytspf, { set(target, prop, val) { return false } }); let spf0 = {}; if (typeof spf == 'object') { spf0 = spf };"// else var spf = {};"
      if (typeof _yt_player == 'undefined') { code = code + "window.classic = window.classic || {}; var _yt_player = {};"+


        "let polymer_ = '';"+

        "(function() {"+ //important to do this ahead of other stuff
        //"  document.lastChild.removeChild(document.getElementsByTagName('head')[0]);"+
        "  var z = document.getElementsByTagName('head')[0].children;"+
        "  for (var i=0;i < z.length; i++) {"+//console.log(z[i]);
        "    if (z[i].tagName == 'SCRIPT') if (z[i].id != 'ytspf-id') { if (z[i].src) delete z[i].src; z[i].innerHTML = '' } else z[i].parentNode.removeChild(z[i])"+
        "  };"+
        "})();"+


        "      function clone(obj) {"+
        "        var copy;"+

                 // Handle the 3 simple types, and null or undefined
        "        if (null == obj || 'object' != typeof obj) return obj;"+

                 // Handle Date
        "        if (obj instanceof Date) {"+
        "          copy = new Date();"+
        "          copy.setTime(obj.getTime());"+
        "          return copy;"+
        "        };"+

                 // Handle Array
        "        if (obj instanceof Array) {"+
        "          copy = [];"+
        "          for (var i = 0, len = obj.length; i < len; i++) {"+
        "            copy[i] = clone(obj[i]);"+
        "          };"+
        "          return copy;"+
        "        }"+

                 // Handle Object
        "        if (obj instanceof Object) {"+
        "          copy = {};"+
        "          for (var attr in obj) {"+
        "            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);"+
        "          };"+
        "          return copy"+
        "        };"+

                 //alert("Unable to copy obj! Its type isn't supported.")
        "      };"+

        "  window.classic.location = clone(window.location.href);"+




        "function script_copy() {"+


        "  if (!(window.frames && window.frames.messageTxt && window.frames.messageTxt.document.body.lastChild)) return void 0;"+
        "  var extText = '',i,source;"+
        "  source = window.frames.messageTxt.document.body.lastChild.childNodes;"+//.lastChild.data.replace('var _yt_player','_yt_player');"+
        "  for(i=0;i < source.length;i++) if (source[i].data) extText = extText + ( (i == 0) ? source[i].data.replace('var _yt_player={}','if \\\( window.classic_load_time != \\\'loading\\\'\\\) { body2.base = window.classic.new_base; window.classic.onload\\\(\\\); exit\\\(\\\) }; _yt_player={};var _yt_player2={}') : source[i].data );"+
        "  extText = extText + \";window.snarl4nav = true; if (!body2.base) if (window.classic.new_base) { body2.base = window.classic.new_base } else try { body2.base = clone(document.getElementById('movie_player').getAttribute('data-version')) } catch(err){}; window.classic.onload();\";"+
        //  "if (extText == '' && window.frameElement) extText = window.frameElement.ownerDocument.documentElement.innerText.replace('var _yt_player','');"+
        //  "extText = extText.replace(/[\r\n]/g, ' ');"+


        // find the function responsible for signature decryption
        "  var r = extText;"+
        //  "var fcnm = r.split('=function(a){a=a.split(\"\")')[0]; fcnm = (fcnm) ? fcnm.substr(fcnm.length-2, 3) : null;"+
        "  var array = r.split('=function(a){a=a.split(\"\")');"+
        "  if (array == r) { var alt = 1; array = r.split('(a){a=a.split(\"\")') } else var alt = 0;"+
        "  if (array.length) for (i=0;i<array.length;i++) {"+
        "    var x = array[i], y = array[i+1];"+ //console.log(x);
        "    if (y && y.indexOf(';var ') == 0) {"+
        "      fcnm = null; continue;"+
        "    } else {"+
        "        fcnm = (x) ? x.substr(x.length-2,3) : null; x = null; y = null; break;"+
        "      }"+
        "  };"+

        "  function sprintf(nw) {"+
        "    var i = 0;"+
        "    while (/%s/.test(nw))"+
        "      nw = nw.replace('%s', arguments[++i]);"+
        "    return nw;"+
        "  };"+
        "  var fs = new RegExp(    sprintf('\\\\W+%s=function[^\}]+\}', fcnm.replace('$', '\\\\$'))  );"+
        "  var fs = r.match(fs)[0];"+

        // find the variable name which refers to the object with the signature-descrambling methods
        "  function fcobj(){"+
        "    var mch = fs, i, j; mch = mch.split('');"+
        "    for (j=0;j<mch.length;j++) if (mch[j] === \"$\") mch[j]=\"\\\\$\";"+
        "    var mch = mch.join('');"+
        "    var mch = mch.split('\\;');"+
        "    for (i=0;i<mch.length;i++) {"+
        "      var zzx = mch[i].substring(0,3);"+ // the name is either 2 letter, in which case the 3rd character must be a dot
        "      if ((zzx === zzy) && (zzx.charAt(2)==='.')) { var zzz = zzy.substring(0,2) };"+
        "      var zzy = zzx"+
        "    }"+
        "    if (typeof zzz === 'undefined') {"+
        "      for (i=0;i<mch.length;i++) {"+
        "        var zzx = mch[i].substring(0,4);"+ // or it is 3 letter, and the 4th char is the dot
        "        if ((zzx === zzy) && (zzx.charAt(3)==='.')) { var zzz = zzy.substring(0,3) };"+
        "        var zzy = zzx"+
        "      }"+
        "    }"+
        "    var mch = new RegExp('var ' + zzz + '[^}]+}[^}]+}[^}]+}};');"+
        "    if (mch) try { var mch2 = mch.split(\"return a.join('')}\")[0] + \"return a.join('')}\"; mch = mch2 } catch(e){}; "+
        "    return [mch,zzz]"+
        "  };"+

        //
        "  if (fs) {"+
        "    var f1 = fcobj()[0];"+ //regular expression including the object name
        "    var f2 = fcobj()[1];"+ //object name
        "    var decrypt0 = r.match(f1)[0];"+//.split(\" \" + f2 + \"=\").join(\" dekrypt0=\");"+

        "    window.snarl4obj = decrypt0.split(\"var \" + f2 + \"=\").join(\"window.snarl4obj=\");"+

        "    if (fs && fs.split(';')[0] && fs.split(';')[0].indexOf('function') == -1 && fs.split(';')[1].indexOf('function') != -1) {"+
        "      var fs0 = (fs.match(/;/g) || []).length;"+
        "      var fs1 = fs.split(';');"+
        "      var fs2 = '';"+
        "      for(i=1;i<fs0+1;i++){"+
        "        var fs2 = fs2 + fs1[i] + ';';"+
        "      };"+
        "    } else {"+

        "        var index = findClosingBracketMatchIndex(fs,fs.indexOf('\{'));"+
        "        if (typeof index == 'number' && index != -1) var fs2 = fs.substring(0,(index + 1));"+
        "      }"+

        "    window.snarl4fun = 'window.snarl4fun=function\(' + fs2.split(f2).join('window.snarl4obj').split('=function(')[1];"+

        "    var fcnm = 'function fcnm(' + fs2.split(\"(\")[1].split(\")\")[0] + '){ ' + decrypt0 + '; ' + fs2.split(\"\\\"\").join(\"'\").split(\"){\")[1];"+//.split(f2+\".\").join(\"dekrypt0.\").split(f2+\"['\").join(\"dekrypt0['\").split(f2+\"[\\\"\").join(\"dekrypt0['\")
        "    var fcnm = \"function \" + fcnm.split(\"function \")[1];"+
        "    eval(fcnm); eval(window.snarl4fun); eval(window.snarl4obj);"+
        "  };"+

        "  if (typeof fcnm != 'undefined') {"+
        "    var r = document.getElementById('ytassetsjs') || document.createElement('div'); r.id = 'ytassetsjs'; r.innerHTML = fcnm.toString(); r.fcnm = fcnm; if (r != document.getElementById('ytassetsjs')) document.body.appendChild(r); r.style.display = 'none';"+
        "  };"+


        "  try { var t = document.getElementById('player-api'); t.insertBefore(document.getElementById('movie_player'), t.firstChild) } catch(e){}; var js = '/yts/jsbin/player_ias-vfl5eNx6Z/en_US/base.js', form = document.getElementById('outputText'); if (form) form.nMessage.value = extText;"+
        "  var t = (document.getElementsByClassName('html5-video-player')[0]) ? document.getElementsByClassName('html5-video-player')[0].parentNode : (document.getElementById('movie_player') || document.getElementsByTagName('ytd-third-party-manager')[0] || document.getElementsByTagName('ytd-page-manager')[0]);"+
        //  "if (t && form) t.appendChild(document.getElementById('outputText'));"+
        "  if (!document.getElementById('yt-classic-player')) {"+

        //"    ytplayer.config.attrs = {}; ytplayer.config.attrs.id = 'movie_player'; ytplayer.config.assets = {}; ytplayer.config.assets.js = js;"+
        "    if (!ytplayer) ytplayer = window.ytplayer = {}; if (!ytplayer.config) ytplayer.config = {}; ytplayer.config.attrs = {}; ytplayer.config.attrs.id = 'movie_player'; ytplayer.config.assets = {};"+
        "    ytplayer.config.assets.js = ((ytplayer.config.web_player_context_config) ? ytplayer.config.web_player_context_config.jsUrl : body2.base);"+
        "    if (ytplayer.config.web_player_context_config) ytplayer.config.web_player_context_config.playerStyle = 'classic-desktop';"+ //<--
        "    var z; try { document.getElementsByTagName('body')[1].querySelector('#start') || document.getElementsByTagName('body')[1].querySelector('#masthead-logo') } catch(e){};"+
        "    if (z) {"+

        "      if (z.id == 'start') {"+
        "      var href = new MutationObserver((mutations) => {"+
        "        mutations.forEach((mutation) => {"+
        "            var node = mutation.target; "+
        "            var a = document.getElementsByTagName('ytd-consent-bump-lightbox')[0]; if (a) { document.body.appendChild(a); href.disconnect() };"+
        "            if (node.tagName == 'A' && node.id == 'logo') { "+
        "              node.setAttribute('class', node.getAttribute('class').replace('yt-simple-endpoint',''));"+
        "              node.setAttribute('onclick','(function(){ var z = document.getElementsByTagName(\\'body\\'); if (z[1]) { z[0].style.display = \\'block\\'; z[1].style.display = \\'none\\' }; })(); return false;');"+
        "              href.disconnect();"+
        "            }; if (node.id == 'start') href.disconnect();"+
        "        })"+
        "      });"+
        "      href.observe(z, {"+
        "        childList: true, subtree: true, attributes: true, characterData: true"+
        "      });"+
        "      };"+

        "      z = z.getElementsByTagName('a')[0];"+
        "      if (z) {"+
        "        z.setAttribute('onclick','(function(){ var z = document.getElementsByTagName(\\'body\\'); if (z[1]) { z[0].style.display = \\'block\\'; z[1].style.display = \\'none\\' }; })(); return false;');"+
        "      }"+
        "    };"+


        "    function onload() {"+

        "      $waitUntil(function(){ if (typeof ytInitialData != 'undefined') return true }, function() {"+

        "        window.classic.convert(clone(ytInitialData));"+

        "      }, 300, 6000)"+


        "    };"+//onload


        "    window.snarl4nav = false;"+


        "    var s = document.getElementById('yt-new-player'); if (s) { onload() } else"+
        "    try {"+
        "      var s = document.createElement('script'), t = (document.getElementById('frameholder') || document.body);"+
        //"      s.src = window.frames.messageTxt.location;"+
        "      s.id = 'yt-new-player'; window.classic.onload = onload;"+
        "      s.onload = onload;"+//$waitUntil(function(){ if (window.snarl4nav) return true }, function() { onload() },800,8000);"+//setTimeout(function(){},500)
        "  	   s.appendChild(document.createTextNode(extText));"+
        "      t.appendChild(s);"+
        "    } catch (e) {alert(e);"+
        "        try {"+
        "          s.text = code; t.appendChild(s);"+
        "        } catch (e) {}"+
        "      };"+

        //"  try { window.frames.ytInit.location = location.href } catch(e){}"+

        "  };"+



        "};"+


        //"window.onload = script_copy;"+




        // monitor elements newly being added to the document body by the YT engine, react when necessary and disconnect when ready
        "let body2 = new MutationObserver((mutations) => {"+
        "            mutations.forEach((mutation) => {"+
        "            if (!mutation.addedNodes) return;"+
        "              for (var i = 0; i < mutation.addedNodes.length; i++) {"+

        "                var node = mutation.addedNodes[i]; if (!node.parentNode) continue;"+
        "                var a = document.getElementById('player-api'), p = document.getElementById('movie_player');"+

        "                if (a && p && a != p.parentNode) { "+//a.insertBefore(p, a.firstChild);

        "                  body2.disconnect_('2');"+//try { p.destroy() } catch(e){ p.parentNode.removeChild(p); };"+
//        "                  var b = document.getElementsByClassName('ytp-prev-button')[1], c = document.getElementsByClassName('ytp-next-button')[0];"+
//        "                  if (b && c) t = document.getElementsByClassName('ytp-left-controls')[0]; if (t) {"+
//        "                    t.insertBefore(b.nextSibling.nextSibling, c); t.insertBefore(b, c.previousSibling.previousSibling); t.removeChild(document.getElementsByClassName('ytp-next-button')[1]);"+
//        "                    a.appendChild(p);"+
//        "                  }"+// var z = document.getElementsByTagName('ytd-page-manager')[0]; if (z) { var y = document.createElement('ytd-watch'); z.appendChild(y); y.setAttribute('class','style-scope ytd-page-manager hide-skeleton'); y.setAttribute('video-id', z.firstElementChild.getAttribute('video_id')); y.setAttribute('js-panel-height_',''); y.setAttribute('player-touch-gestures',''); y.setAttribute('is-four-three-to-sixteen-nine-video',''); y.setAttribute('is-two-columns',''); y.setAttribute('large-window',''); y.setAttribute('role','main'); y.setAttribute('playlist',''); y.setAttribute('style','--ytd-watch-scrollbar-width:15px; --ytd-watch-panel-max-height:502px; --ytd-watch-chat-max-height:661px; --ytd-watch-width-ratio:1; --ytd-watch-height-ratio:0.75;'); if (z.getElementsByTagName('ytd-watch-flexy')[0]) z.removeChild(z.getElementsByTagName('ytd-watch-flexy')[0]) } };"+
        "                  if (typeof node.className == 'string' && node.className.indexOf('html5-video-player') > -1) { try { a.insertBefore(node.parentNode.parentNode, a.firstChild); p.nextSibling.destroy() } catch(e){ if (p.nextSibling) p.parentNode.removeChild(p.nextSibling); }; body2.disconnect() };"+
        "                };"+

        "                if (!(typeof node.tagName == 'string' && node.tagName.indexOf('SCRIPT') > -1)) continue;"+
        "                var src = (typeof node.getAttribute == 'function' && node.getAttribute('src')) ? node.getAttribute('src') : ' ', sText = (node.innerHTML && node.innerHTML.toString()) ? node.innerHTML.toString() : '';"+//src.indexOf('/desktop_polymer')
        "                if (src == ' ') { var conf = node.innerHTML.toString(); if (document.getElementById('player-api') && document.getElementById('player-api').getElementsByTagName('script')[0]) document.getElementById('player-api').getElementsByTagName('script')[0].innerHTML = conf; };"+
        "                if (sText) {"+
        "                  if (sText.indexOf('var ytInitialData') == 0) { node.id = 'ytInitialData-script' };"+
        "                };"+
        "                if (src)"+// && ( src == ' ' || (src.indexOf('/desktop_polymer') > -1 || src.split('spf-vflset/spf')[1] || sText.split('_spf_state')[1] || sText.split('spf.script.path')[1] || sText.split('yt.setConfig')[1]) ) && node.parentNode == document.getElementsByTagName('body')[1])"+//
        "                  {"+
        "                     if (document.getElementsByTagName('body')[1]) document.getElementsByTagName('body')[1].style.display = 'none'; "+//body2.disconnect(); "+ //document.lastChild.removeChild(document.getElementsByTagName('body')[1]);
        "                     if (src.indexOf('player_ias.vflset') > -1 && src.indexOf('/base.js') > -1) { body2.base = src };"+
        //"                     console.log(sText); console.log(node);"+
    //    "                     if ((node.parentNode == document.getElementsByTagName('body')[1] || node.parentNode == document.getElementsByTagName('head')[0]))"+
        "                       if ( sText.indexOf('ytcfg.set({\"CSI_SERVICE_NAME') > -1 && !body2.base && !(document.getElementsByTagName('ytd-app')[0] && document.getElementsByTagName('ytd-app')[0].querySelector('#content'))  ) { "+// ytplayer.web_player_context_config =
        //"                         document.lastChild.removeChild(document.getElementsByTagName('body')[1]); window.stop(); "+
        "                         body2.disconnect_('1')"+
        "                       }"+
        "                       else if (sText.indexOf('ytInitialPlayerResponse') == -1 ) { if (a && p && a == p.parentNode) body2.disconnect_('0');"+//node.parentNode.innerHTML = ''; console.log('!');"+
        //"                            } else { body2.disconnect_('0'); var p = document.getElementsByClassName('html5-video-player')[0]; if (p) { p.id = 'movie_player'; p.setAttribute('name','movie_player') } "+//if (node.parentNode && (node.parentNode.tagName == 'HEAD' || (node.parentNode.tagName == 'BODY' && sText.indexOf('ytInitialPlayerResponse') == -1)) ) { node.parentNode.innerHTML = '' }; }"+// //if (window.classic) { var head = window.classic.head, body = window.classic.body; document.write( head + body) };
        "                       }"+
        "                  }"+

        "              }"+
        "            })"+
        "});"+
        "body2.postponed_scripts = [];"+
        "body2.disconnect_ = function(x) {"+
        //"  if (document.getElementById('ytInitialData-script')) { console.log('disconnect-'+ x +' '+ body2.base);"+
        "    body2.disconnect()"+
        //"  };"+
        "};"+

        "body2.observe(document.lastChild, {"+
        "  childList: true, subtree: true, attributes: false, characterData: false"+
        "});"+


        //"var video_id = (location.href.split('v=')[1] || location.href.split('/v/')[1]); video_id = (video_id) ? video_id.split('&')[0].split('/')[0] : null;"+



        "function $waitUntil(check,onComplete,delay,timeout) {"+

        "  if (check()) {"+
        "    onComplete();"+
        "    return"+
        "  };"+

        "  if (!delay) delay=100;"+

        "  var timeoutPointer;"+
        "  var intervalPointer=setInterval(function () {"+
        "    if (!check()) return;"+
        "    clearInterval(intervalPointer);"+
        "    if (timeoutPointer) clearTimeout(timeoutPointer);"+
        "    if (typeof onComplete == 'function') onComplete();"+
        "  },delay);"+

        "  if (timeout) timeoutPointer=setTimeout(function () {"+
        "    clearInterval(intervalPointer)"+
        "  },timeout)"+
        "};"+





        "function script_load(t) {"+
        "  var tt = t;"+
        "  if (!t || (t && t.id == 'yt-classic-html')) try { t = document.getElementsByTagName('classic-body')[0].getElementsByTagName('body')[0] || document.getElementsByTagName('body')[0] } catch(err) { t = document.getElementsByTagName('body')[0] }; "+
        "  var cb = document.getElementsByTagName('classic-body')[0] || document.lastChild;"+

          // invoke scripts in HEAD element
          "var a = document.getElementsByTagName('head')[document.getElementsByTagName('head').length-1].children;"+ //(document.getElementsByTagName('head')[1] || document.getElementsByTagName('head')[0]).children; "+

          // inline-scripts first, then the rest
          "for(var j=0;j < 2; j++) {"+

          "  for(var i=0;i < a.length; i++) {"+
          "    if (a[i].tagName != 'SCRIPT' || a[i].id == 'ytspf-id')"+// ||"+
          //"      (a[i].tagName == 'SCRIPT' &&"+
          //"       (a[i].innerHTML && (a[i].innerHTML.toString().indexOf('ytcfg.set(\"EVENT_ID\"') > -1 ||"+
          //"                           a[i].innerHTML.toString().indexOf('kutyagumi') > -1"+
          //"       )"+
          //"        || (a[i].src && (a[i].src.indexOf('/annotations_module.js') > -1 || a[i].src.indexOf('/endscreen.js') > -1 || a[i].src.indexOf('/remote.js') > -1))"+//a[i].src.indexOf('/base.js') > -1 ||
          //"     )))"+
          "      continue;"+

          "    var s = document.createElement('script'), sText = a[i].innerHTML; if (a[i].src) s.src = a[i].src; s.id = 'yt-classic'; "+//console.log(a[i]);

          // the base.js is an exception, needs extra steps
          "    if (s.src && s.src.indexOf('/base.js') > -1 ) {"+//("onDompaused"))};"  var z = prompt(a[i].src +' '+sText); if (z) "+
          "      if (!tt) continue;"+
          "      var dump = document.createElement('div'), frame = document.createElement('iframe'), form = document.createElement('form');"+
          "      frame.src = body2.base || a[i].src;"+
          "      frame.name = 'messageTxt';"+
          "      frame.onload = script_copy;"+
          "      form.id = 'outputText';"+
          "      dump.id = 'frameholder';"+
          "      dump.src = body2.base || a[i].src;"+
          "      var polymer_head = document.getElementsByTagName('head')[0];"+
          //"      polymer_head.innerHTML = '';"+
          "      polymer_head.appendChild(dump); dump.appendChild(frame); dump.appendChild(form); "+
          "      form.innerHTML = '<textarea name=nMessage maxlength=2097152></textarea><input type=button value=click onClick=script_copy()>';"+
          "      continue;"+
          "    };"+

          "    if ((j==0 && sText) || (j==1 && s.src))"+
          "      try { s.appendChild(document.createTextNode(sText)); cb.appendChild(s); } catch (e) { try { s.text = sText; cb.appendChild(s); } catch (e) {} }"+
          "  }"+

          // invoke scripts in BODY element
          "  var a = t.children; "+// document.getElementsByTagName('body')[0].children; console.log(a);
          "  for(var i=0;i < a.length; i++) {"+
          "    if (a[i].tagName != 'SCRIPT') continue;"+// || (a[i].tagName == 'SCRIPT' && typeof a[i].src == 'string' && (a[i].src.indexOf('/base.js') > -1))
          "    var s = document.createElement('script'), sText = a[i].innerHTML; if (a[i].src) { s.src = a[i].src }; s.id = 'yt-classic';"+//console.log(a[i]);
          "    if ((j==0 && sText) || (j==1 && s.src))"+
          "      try { s.appendChild(document.createTextNode(sText)); cb.appendChild(s); } catch (e) { try { s.text = sText; cb.appendChild(s); } catch (e) {} }"+
          "  };"+

          "};"+

          "var z = document.createElement('div'); z.id = 'spf-navigation-response'; document.getElementsByTagName('body')[document.getElementsByTagName('body').length-1].appendChild(z); z.setAttribute('hidden',''); z.setAttribute('style','display: none');"+

        "};"+



        "function classic_yt(ev) { polymer = Polymer; var t = ev || window.event, t = (t) ? t.target || t.srcElement : null;"+//document.getElementsByTagName('head')[0].innerHTML = '';"+



        "  (document.getElementsByTagName('head')[1] || document.getElementsByTagName('head')[0]).innerHTML = classic.head;"+

        "  if (!t) t = ev; if (!t || (t && t.id == 'yt-classic-html')) try { t = document.getElementsByTagName('classic-body')[0].getElementsByTagName('body')[0] || document.getElementsByTagName('body')[0] } catch(err) { t = document.getElementsByTagName('body')[0] }; "+
        "  t.innerHTML = classic.body;"+
        "  t.setAttribute('dir','ltr'); t.setAttribute('id','body'); t.setAttribute('class','visibility-logging-enabled ltr gecko gecko-68 exp-kevlar-settings exp-mouseover-img exp-responsive exp-search-big-thumbs site-center-aligned site-as-giant-card sitewide-consent-visible appbar-hidden not-nirvana-dogfood flex-width-enabled flex-width-enabled-snap page-loaded'); t.setAttribute('data-spf-name','watch');"+//exp-invert-logo
        //"  var s = document.createElement('script');s.id = 'yt-classic-player';s.src = '/yts/jsbin/player_ias-vfl5eNx6Z/en_US/base.js';document.getElementsByTagName('body')[0].appendChild(s);"+


        "  script_load(t);"+


            // url of base.js needs to be updated for correct video scaling in fullscreen mode
        "  if (typeof _spf_state != 'undefined' && _spf_state['rsrc-s']) {"+ // ? Firefox would load the old, Chromium the new base.js
        "    for(j in _spf_state['rsrc-s']) if (typeof j == 'string' && j.indexOf('/base.js') > -1) {"+
        "      window.classic.new_base = clone('http'+ j.split('js-http')[1]);"+
        //"      if (classic.new_base.split('/yts/')[1]) classic.new_base = '/s/player/e0d06a61/player_ias.vflset/en_US/base.js';"+
        "      if (typeof _yt_player2 == 'undefined') script_copy();"+
        "      break"+
        "    };"+
        "  };"+



        "};"+





        "(function(){"+


          "if (!document.getElementById('yt-classic-html')) {"+


          // create an extra head and body element

          "  var a = document.getElementsByTagName('head')[0]; if (a) {"+
          "    document.lastChild.insertBefore(document.createElement('head'), a);"+
          "  } else document.lastChild.appendChild(document.createElement('head'));"+ //((document.getElementsByTagName('head')[0]) ? (document.getElementsByTagName('head')[0].nextSibling || document.lastChild.lastChild) : document.lastChild.lastChild ));"+
          "  var a = document.getElementsByTagName('head')[1]; if (a) document.lastChild.insertBefore(a, document.getElementsByTagName('head')[0]);"+

          //"document.lastChild.replaceChild(document.createElement('classic-body'), document.lastChild.firstChild);"+
          "  document.getElementsByTagName('head')[0].appendChild(document.createElement('classic-body') );"+

          "  var b = document.getElementsByTagName('body')[0]; if (b) {"+
          "    document.lastChild.insertBefore(document.createElement('body'), b);"+
          "  } else { ( document.lastChild || document.getElementsByTagName('classic-body')[0] ).appendChild(document.createElement('body') ) };"+


          "  var d = window.document, b; try { b = document.getElementsByTagName('body')[0] } catch(err) {};"+//document.body =
          "  if (b) { b.setAttribute('dir','ltr'); b.setAttribute('id','body'); b.setAttribute('class','visibility-logging-enabled ltr gecko gecko-68 exp-invert-logo exp-kevlar-settings exp-mouseover-img exp-responsive exp-search-big-thumbs site-center-aligned site-as-giant-card sitewide-consent-visible appbar-hidden not-nirvana-dogfood flex-width-enabled flex-width-enabled-snap page-loaded'); b.setAttribute('data-spf-name','watch') };"+




          "  var s = document.createElement('script');"+
          "  s.id = 'yt-classic-html';"+
          "  s.src = 'https://cdn.jsdelivr.net/gh/snarly/yt6@d2f9c4d9d9fbbc784964fa63570977af79d7367e/yts/yt_classic.js';"+
          "  s.onload = classic_yt;"+
          "  document.lastChild.appendChild(s);"+


          "}"+

        "})();"

      }

        // append the script element to the document head
        try {
          s.appendChild(document.createTextNode(code))
          h.appendChild(s)
        } catch (e) {
            try {
              s.text = code
              h.appendChild(s)
            } catch (e) {}
          }
    }



})()