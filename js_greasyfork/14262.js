// ==UserScript==
// ==UserScript==
// @name remove func
// @namespace https://example.com
// @description remove_func
// @author xxx from reek's aak
// @version 1.9
// @license Creative Commons BY-NC-SA
// @encoding utf-8
// @homepage example.com
// @include http*://*
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_log
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_info
// @grant GM_getMetadata
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/14262/remove%20func.user.js
// @updateURL https://update.greasyfork.org/scripts/14262/remove%20func.meta.js
// ==/UserScript==

mtv = {
  debug : {
	log: true,
    dump : false,
    inserted : false
  },
  initialize : function () {

    // Debug
    if (mtv.debug.dump) {
		
      mtv.log('mtv');
      mtv.log(mtv);
	  
      mtv.log('Local Storage');
      mtv.log(localStorage);
      //localStorage.clear();
	  
      mtv.log('GM Storage');
      mtv.log(mtv.listValues());

      mtv.log('GM API Supported');
      mtv.log(mtv.apiSupported());
    }

    // Stop if user not use Script Manager or not support GM Api
    if (mtv.apiRequires()) {
		
      // Add Command in Greasemonkey Menu
      mtv.addCommands();

      // Detect and Kill
      mtv.kill();
    }
  },
  uw : unsafeWindow || window,
  isTopWindow : !(window.top != window.self),
  ready : function (fn) {
    window.addEventListener('load', fn);
  },
  contains : function (string, search) {
    return string.indexOf(search) != -1;
  },
  log : function (msg, type) {
    if (mtv.debug.log) {
      if (typeof console === 'undefined') {
        console = unsafeWindow.console;
      }
      console[type || 'info']('movietv: ' + msg);
    }
  },
  apiRequires : function () {
    if (typeof GM_xmlhttpRequest != 'undefined' &&
      typeof GM_setValue != 'undefined' &&
      typeof GM_getValue != 'undefined' &&
      typeof GM_addStyle != 'undefined' &&
      typeof GM_registerMenuCommand != 'undefined') {
      return true;
    } else {
      return false;
    }
  },
  apiSupported : function () { 
    if (mtv.isTopWindow) {
      // GM API
      // Doc: http://tinyurl.com/yeefnj5
	  return {
	    GM_xmlhttpRequest : typeof GM_xmlhttpRequest != 'undefined',
	    GM_setValue : typeof GM_setValue != 'undefined',
	    GM_getValue : typeof GM_getValue != 'undefined',
	    GM_addStyle : typeof GM_addStyle != 'undefined',
	    GM_registerMenuCommand : typeof GM_registerMenuCommand != 'undefined',
	    GM_info : typeof GM_info != 'undefined',
	    GM_getMetadata : typeof GM_getMetadata != 'undefined',
	    GM_deleteValue : typeof GM_deleteValue != 'undefined',
	    GM_listValues : typeof GM_listValues != 'undefined',
	    GM_getResourceText : typeof GM_getResourceText != 'undefined',
	    GM_getResourceURL : typeof GM_getResourceURL != 'undefined',
	    GM_log : typeof GM_log != 'undefined',
	    GM_openInTab : typeof GM_openInTab != 'undefined',
	    GM_setClipboard : typeof GM_setClipboard != 'undefined'
	  }
    }
  },
  listValues : function () {
    var list = GM_listValues();
    var obj = {};
    for (var i in list) {
      obj[list[i]] = GM_getValue(list[i]);
    }
    return obj;
  },
  getBrowser : function () {
    var ua = navigator.userAgent;
    if (mtv.contains(ua, 'Firefox')) {
      return "Firefox";
    } else if (mtv.contains(ua, 'MSIE')) {
      return "IE";
    } else if (mtv.contains(ua, 'Opera')) {
      return "Opera";
    } else if (mtv.contains(ua, 'Chrome')) {
      return "Chrome";
    } else if (mtv.contains(ua, 'Safari')) {
      return "Safari";
    } else if (mtv.contains(ua, 'Konqueror')) {
      return "Konqueror";
    } else if (mtv.contains(ua, 'PaleMoon')) {
      return "PaleMoon"; // fork firefox
    } else if (mtv.contains(ua, 'Cyberfox')) {
      return "Cyberfox"; // fork firefox
    } else if (mtv.contains(ua, 'SeaMonkey')) {
      return "SeaMonkey"; // fork firefox
    } else if (mtv.contains(ua, 'Iceweasel')) {
      return "Iceweasel"; // fork firefox
    } else {
      return ua;
    }
  },
  getScriptManager : function () {
    if (mtv.apiRequires()) {
      if (typeof GM_info == 'object') {
        // Greasemonkey (Firefox)
        if (typeof GM_info.uuid != 'undefined') {
          return 'Greasemonkey';
        } // Tampermonkey (Chrome/Opera)
        else if (typeof GM_info.scriptHandler != 'undefined') {
          return 'Tampermonkey';
        }
      } else {
        // Scriptish (Firefox)
        if (typeof GM_getMetadata == 'function') {
          return 'Scriptish';
        } // NinjaKit (Safari/Chrome)
        else if (typeof GM_getResourceText == 'undefined' &&
          typeof GM_getResourceURL == 'undefined' &&
          typeof GM_openInTab == 'undefined' &&
          typeof GM_setClipboard == 'undefined') {
          return 'NinjaKit';
        } // GreaseGoogle (Chrome)
        else if (mtv.getBrowser() == 'Chrome' &&
          typeof GM_setClipboard == 'undefined') {
          return 'GreaseGoogle';
        }
      }
    } else {
      mtv.log('No Script Manager detected');
      return false;
    }
  },
  generateID : function () {
    return 'mtv-' + Math.random().toString(36).substring(4);
  },
  generateUUID : function () {
    // Universally Unique IDentifier
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });
    return uuid;
  },
  addCommands : function () {
  },
  notification : function (message, delay) {
    if (mtv.isTopWindow) {

      // animation
      mtv.addStyle('@-webkit-keyframes mtv-fadeInDown{0%{opacity:0;-webkit-transform:translateY(-20px)}100%{opacity:1;-webkit-transform:translateY(0)}}@keyframes mtv-fadeInDown{0%{opacity:0;transform:translateY(-20px)}100%{opacity:1;transform:translateY(0)}}');

      // box
      mtv.addStyle('#mtv-notice {-webkit-animation:mtv-fadeInDown .5s ease; animation:mtv-fadeInDown .5s ease; padding:0px; color:#000; background-color:#fff; display:block; width:100%; position:fixed; z-index:999999; left: 0; top: 0;  text-align: left; vertical-align:middle; margin:0; font-size:14px; font-family:arial; border-bottom:5px solid #DF3A32; line-height:1.2; font-variant:small-caps;}'.replace(/;/g, ' !important;'));

      // navbar
      mtv.addStyle('#mtv-notice-navbar {background-color:#DF3A32; padding:0px 20px 0px 62px; background-image:url("' + mtv.iconURL + '"); background-repeat:no-repeat; background-position:20px 3px; background-size:32px;}'.replace(/;/g, ' !important;'));

      // link
      mtv.addStyle('.mtv-navbar-link {padding:0px 5px; line-height:35px; color:#fff; display:inline-block; text-decoration:none; transform:skew(345deg, 0deg); background-color:#DF3A32; border-bottom:3px solid #DF3A32;}'.replace(/;/g, ' !important;'));

      // link:hover
      mtv.addStyle('.mtv-navbar-link:hover {color:#fff; background-color:#000; border-bottom:3px solid #fff; text-decoration:none;}'.replace(/;/g, ' !important;'));

      // close
      mtv.addStyle('#mtv-notice-close {color:#fff; float: right; margin:0px 5px; padding:10px 10px 8px 10px; text-decoration: none;}'.replace(/;/g, ' !important;'));

      // brand
      mtv.addStyle('#mtv-notice .brand {padding-right:20px; color:#fff; font-size:14px;}'.replace(/;/g, ' !important;'));

      // content
      mtv.addStyle('#mtv-notice-content {padding:5px 20px; min-height:72px;}'.replace(/;/g, ' !important;'));
      mtv.addStyle('#mtv-notice-content a {color:#DF3A32; text-decoration:none;}'.replace(/;/g, ' !important;'));
      mtv.addStyle('#mtv-notice-content a:hover {text-decoration:underline;}'.replace(/;/g, ' !important;'));

      // remove
      mtv.removeElement('#mtv-notice');

      // close (manually)
      document.querySelector('#mtv-notice-close').onclick = function () {
        mtv.removeElement('#mtv-notice');
      }

      // close (automatically)
      setTimeout(function () {
        mtv.removeElement('#mtv-notice');
      }, delay);

    }
  },
  setStorage : function () {
    if (localStorage) {
      // Le navigateur supporte le localStorage
    } else {
      //throw 'localStorage non supporté';
    }
  },
  getStorage : function () {
    if (localStorage) {
      // Le navigateur supporte le localStorage
    } else {
      //throw 'localStorage non supporté';
    }
  },
  kill : function () {

    // Detect & Kill
    for (var i in mtv.rules) {

      // Current
      var current = mtv.rules[i];

      // RegExp host
      var reHost = new RegExp(current.host.join('|'), 'i');
      // If domains is
      if (reHost.test(location.host)) {
        // On all statements
        if (current.onAlways) {
		  current.onAlways(); // loading
		  window.addEventListener('DOMContentLoaded', current.onAlways); // interactive
		  window.addEventListener('load', current.onAlways); // complete
        }
        // Add Js / Css / Cookie
        if (current.onStart) {
          current.onStart();
        }
        // When Before Script Executed
        if (current.onBeforeScript) {
          if ('onbeforescriptexecute' in document) { // Mozilla Firefox
            window.addEventListener('beforescriptexecute', current.onBeforeScript);
          }
        } // When After Script Executed
        if (current.onAfterScript) {
          if ('onafterscriptexecute' in document) { // Mozilla Firefox
            window.addEventListener('afterscriptexecute', current.onAfterScript);
          }
        }
        // When Window Load
        if (current.onEnd) {
          window.addEventListener('load', current.onEnd);
        }
        // When DOM Load
        if (current.onLoad) {
          window.addEventListener('DOMContentLoaded', current.onLoad);
        }
        // When DOM AttrModified
        if (current.onAttrModified) {
          window.addEventListener('DOMAttrModified', current.onAttrModified, false);
        }
        // When DOM SubtreeModified
        if (current.onSubtreeModified) {
          window.addEventListener('DOMSubtreeModified', current.onSubtreeModified, false);
        }
        // When DOM Elements are Inserted in Document
        if (current.onInsert) {

          // Mutation Observer
          // Doc: http://tinyurl.com/mxxzee4
          // Support: http://tinyurl.com/nepn7vy
          if (typeof window.MutationObserver != 'undefined' ||
            typeof WebKitMutationObserver != 'undefined') {

            // Mutation Observer
            var MutationObserver = window.MutationObserver || WebKitMutationObserver;

            // Create an observer instance
            var obs = new MutationObserver(function (mutations) {
                // We can safely use `forEach` because we already use mutation
                // observers that are more recent than `forEach`. (source: MDN)
                mutations.forEach(function (mutation) {
                  // we want only added nodes
                  if (mutation.addedNodes.length) {
                    //mtv.log(addedNodes);
                    Array.prototype.forEach.call(mutation.addedNodes, function (addedNode) {
                      //mtv.log(addedNode);
                      current.onInsert(addedNode);
                    });
                  }
                });
              });
            // Observer
            obs.observe(document, {
              childList : true,
              subtree : true
            });
          }
          // Mutation Events (Alternative Solution)
          // Doc: http://tinyurl.com/op95rfy
          else {
            window.addEventListener("DOMNodeInserted", function (e) {
              current.onInsert(e.target);
            }, false);
          }
        }
        // When DOM Elements are Removed in Document
        if (current.onRemove) {

          // Mutation Observer
          // Doc: http://tinyurl.com/mxxzee4
          // Support: http://tinyurl.com/nepn7vy
          if (typeof window.MutationObserver != 'undefined' ||
            typeof WebKitMutationObserver != 'undefined') {

            // Mutation Observer
            var MutationObserver = window.MutationObserver || WebKitMutationObserver;

            // Create an observer instance
            var obs = new MutationObserver(function (mutations) {
                // We can safely use `forEach` because we already use mutation
                // observers that are more recent than `forEach`. (source: MDN)
                mutations.forEach(function (mutation) {
                  // we want only removed nodes
                  if (mutation.removedNodes.length) {
                    //mtv.log(mutation.removedNodes);
                    Array.prototype.forEach.call(mutation.removedNodes, function (removedNode) {
                      //mtv.log(removedNode);
                      current.onRemove(removedNode);
                    });
                  }
                });
              });
            // Observer
            obs.observe(document, {
              childList : true,
              subtree : true
            });
          }
          // Mutation Events (Alternative Solution)
          // Doc: http://tinyurl.com/op95rfy
          else {
            window.addEventListener("DOMNodeRemoved", function (e) {
              current.onRemove(e.target);
            }, false);
          }
        }
      }
    }
  },
  confirmLeave : function () {
    window.onbeforeunload = function () {
      return '';
    };
  },
  stopScript : function (e) {
    e.preventDefault();
    e.stopPropagation();
  },
  innerScript : function (e) {
    return e.target.innerHTML;
  },
  addScript : function (code) {
    // Note: Scriptish no support
    if (document.head) {
      if (/\.js$/.test(code)) { // External
        document.head.appendChild(document.createElement('script')).src = code;
      } else { // Inline
        document.head.appendChild(document.createElement('script')).innerHTML = code.toString().replace(/^function.*{|}$/g, '');
      }
    }
  },
  addElement : function (str) { // ex: div.ads or span#ads
    if (mtv.contains(str, '.')) {
      var str = str.replace('.', ':className:');
    } else if (mtv.contains(str, '#')) {
      var str = str.replace('#', ':id:');
    }
    var arr = str.split(':');
    mtv.addScript('function() { document.documentElement.appendChild(document.createElement("' + arr[0] + '")).' + arr[1] + ' = "' + arr[2] + '"; document.querySelector("' + arr[0] + '").innerHTML = "<br>"; }');
  },
  removeElement : function (o) {
    if (o instanceof HTMLElement) {
      return o.parentNode.removeChild(o);
    } else if (typeof o === "string") {
      var elem = document.querySelectorAll(o);
      for (var i = 0; i < elem.length; i++) {
        elem[i].parentNode.removeChild(elem[i]);
      }
    } else {
      return false;
    }
  },
  getElement : function (selector) {
    var elem = document.querySelector(selector) || false;
    if (elem) {
      return elem;
    } else {
      return false;
    }
  },
  setElement : function (selector, props) {
    var elem = mtv.getElement(selector);
    if (elem) {
      for (p in props) {
        elem.setAttribute(p, props[p]);
      }
    } else {
      return false;
    }
  },
  addStyle : function (css) {
    GM_addStyle(css);
  },
  getStyle : function (elem, prop) {
    if (elem.currentStyle)
      return elem.currentStyle[prop];
    else if (window.getComputedStyle)
      return document.defaultView.getComputedStyle(elem, null).getPropertyValue(prop);
  },
  getCookie : function (name) {
    var oRegex = new RegExp("(?:; )?" + name + "=([^;]*);?");
    if (oRegex.test(document.cookie)) {
      return decodeURIComponent(RegExp["$1"]);
    } else {
      return null;
    }
  },
  setCookie : function (name, value, time) {
    var time = (time) ? time : 365 * 24 * 60 * 60 * 1000; // 1 year
    var expires = new Date();
    expires.setTime(new Date().getTime() + time);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + expires.toGMTString() + ";path=/";
  },
  decodeURI : function (str) {
    return decodeURIComponent(str);
  },
  encodeURI : function (str) {
    return encodeURIComponent(str);
  },
  encodeHTML : function (str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
  decodeHTML : function (str) {
    return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  },
  allowfullscreen : function (elem, boolen) {
    var boolen = (boolen) ? boolen : true;
    if (typeof elem == 'string') {
      var elem = document.querySelector(elem);
    }

    var parent = elem.parentNode;
    var clone = elem.cloneNode(true);
    var params = clone.querySelector('param[name="allowfullscreen"]') || false;

    if (params) {
      params.value = boolen;
    }
    if (typeof clone.allowfullscreen != 'undefined') {
      clone.allowfullscreen = boolen;
    }

    // Replace
    parent.replaceChild(clone, elem);
  },
  player : { // http://tinyurl.com/pb6fthj
    in : {
      node : null,
      html : null,
      tag : null,
      parent : null
    },
    out : {
      node : null,
      html : null,
      tag : null,
      parent : null
    },
    nameplayer : 'custom',
    swfvars : null,
    options : {
      method : 'replace',
      output : 'embed'
    },
    flashvars : {
      str : null,
      obj : {}
    },
    attributes : {
      wmode : 'opaque',
      quality : 'high',
      bgcolor : '#000000',
      type : 'application/x-shockwave-flash',
      pluginspage : 'http://www.adobe.com/go/getflash',
      allowscriptaccess : 'always', // never / always
      allowfullscreen : true
    },
    get : function (element) {

      if (element instanceof HTMLElement) {
        this.in.node = element;
      } else if (typeof element == 'string') {
        if (/^[#\.]/.test(element)) {
          this.in.node = document.querySelector(element);
        } else {
          this.in.node = document.getElementById(element);
        }
      } else {
        throw 'Not object or embed player or invalid selector';
      }

      this.in.html = this.getHtml(this.in.node);
      this.in.parent = this.in.node.parentNode;
      this.in.tag = this.in.node.tagName;

      this.attributes.id = this.attributes.name = mtv.generateID();
      this.attributes.height = this.in.node.height || this.in.node.clientHeight || '100%';
      this.attributes.width = this.in.node.width || this.in.node.clientWidth || '100%';

      if (/^(object|embed)$/i.test(this.in.tag)) {

        //
        this.attributes.src = this.in.node.src || this.in.node.data || false;
        this.flashvars.str = this.in.node.flashvars || this.in.node.querySelector('param[name="flashvars"]') && this.in.node.querySelector('param[name="flashvars"]').value || false;
        var swfvars = !this.flashvars.str && this.in.node.data && this.in.node.data.split('?', 2) || false;

        //
        if (swfvars) {
          this.attributes.src = swfvars[0];
          this.flashvars.str = swfvars[1];
        }

        this.splitVars();
        this.joinVars();
      }
      //mtv.log(this);
    },
    custom : function (element, attributes, flashvars, options) {

      //
      this.get(element);

      //
      if (typeof attributes == 'object') {
        this.mergeObj(this.attributes, attributes);
      }

      //
      if (typeof flashvars == 'object') {
        if (flashvars.set) {
          this.setVars(flashvars.set);
        }
        if (flashvars.remove) {
          this.removeVars(flashvars.remove);
        }
      }

      //
      if (typeof options == 'object') {
        if (options.method) {
          this.options.method = options.method;
        }
        if (options.output) {
          this.options.output = options.output;
        }
      }

      this.insert();
      //mtv.log(this);
    },
    log : function (a) {
      var a = (a) ? a : '';
      mtv.log('mtv.player ' + a + ' --> ', this);
    },
    addDownloadBtn : function () {
      var btn = document.createElement("p");
      btn.innerHTML = '<strong>Video: </strong> <a href="' + this.attributes.src + '" download>Download</a>';
      this.out.node.parentNode.insertBefore(btn, this.out.node);
    },
    mergeObj : function (obj1, obj2) {
      for (var prop in obj2) {
        obj1[prop] = obj2[prop];
      }
    },
    setVars : function (flashvars) {
      if (typeof flashvars == 'string') {
        this.flashvars.str = flashvars;
        this.splitVars();
        this.joinVars();
      } else if (typeof flashvars == 'object') {
        this.mergeObj(this.flashvars.obj, flashvars);
        this.joinVars();
        this.splitVars();
      }
    },
    removeVars : function (str) {
      var obj = this.flashvars.obj;
      var splits = str.split(',');
      for (var i = 0; i < splits.length; i++) {
        var k = splits[i];
        if (k in obj)
          delete obj[k];
      }
      this.flashvars.obj = obj;
      this.joinVars();
    },
    splitVars : function () {
      var str = mtv.decodeHTML(this.flashvars.str);
      var arr = str.split('&');
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        var k = arr[i];
        if (k != '' && k.split('=')) {
          var s = k.split('=');
          obj[s[0]] = mtv.decodeURI(s[1]);
        }
      }
      this.flashvars.obj = obj;
    },
    joinVars : function () {
      var obj = this.flashvars.obj;
      var arr = [];
      for (k in obj) {
        arr.push(k + '=' + mtv.encodeURI(obj[k])); // encodeURIComponent
      }
      this.flashvars.str = arr.join('&'); // &amp;
    },
    insert : function () {

      //
      this.swfvars = [this.attributes.src, this.flashvars.str].join('?');

      //
      switch (this.options.output) {
      case 'iframe':
        this.out.node = document.createElement('iframe');
        this.out.node.setAttribute('src', this.swfvars);
        this.out.node.setAttribute('width', this.attributes.width);
        this.out.node.setAttribute('height', this.attributes.height);
        this.out.node.setAttribute('frameborder', 0);
        this.out.node.setAttribute('scrolling', 'no');
        break;
      case 'tab':
        this.log();
        return GM_openInTab(this.swfvars);
        break;
      case 'html5':
        this.out.node = document.createElement('video');
        this.out.node.innerHTML = '<strong>Video not playing ? <a href="' + this.attributes.src + '" download>Download file</a> instead.</strong>';
		for (k in this.attributes) {
		  if (k == 'autoplay') { // fix bug duplicate playing on firefox
		    this.out.node.onloadstart = function () {
		      this.play();
		    }
		  } else {
		    this.out.node.setAttribute(k, this.attributes[k]);
		  }
		}
		this.out.node.onerror = function () { // switch to plugin player
		  mtv.player.plugin(this, {file:mtv.player.attributes.src});
		};
        break;
      default:
        this.out.node = document.createElement('embed');
        for (k in this.attributes) {
          this.out.node.setAttribute(k, this.attributes[k]);
        }
        if (this.flashvars.str) {
          this.out.node.setAttribute('flashvars', this.flashvars.str);
        }
      }

      //
      this.out.html = this.getHtml(this.out.node);
      this.out.tag = this.out.node.tagName;

      //
      if (this.options.output == 'inner') {
        this.in.node.innerHTML = this.out.html;
      } else { // replace
        this.in.parent.replaceChild(this.out.node, this.in.node);
      }
      //this.addDownloadBtn();
      this.log('done');
    },
    getHtml : function (node) {
      var tmp = document.createElement('div');
      tmp.appendChild(node.cloneNode(true))
      return tmp.innerHTML;
    },
    getMime : function (file) {
      var mime = file.match(/\.(flv|mp4|webm|ogv|ogg|mp3|mpeg|mpg|mkv|avi|mov)$/);
      if (mime && mime.length == 2) {
        return 'video/' + mime[1];
      } else {
        return 'video/mp4';
      }
    },
    plugin : function (id, setup) {
      // Web Player (plugin)
      // VLC : http://tinyurl.com/omlzp39
      // WMP :
      // QT :

      this.get(id);
      this.nameplayer = 'plugin';
      this.attributes.autoplay = setup.autostart || setup.autoplay || false;
      this.attributes.src = setup.file || setup.src;
      this.attributes.height = setup.height || this.in.node.clientHeight || "100%";
      this.attributes.width = setup.width || this.in.node.clientWidth || "100%";

      // Plugins
      var plugins = [];
      if (navigator.plugins && (navigator.plugins.length > 0)) {
        for (var i = 0; i < navigator.plugins.length; i++) {
          plugins.push(navigator.plugins[i].name);
        }
        var plugins = plugins.join('|');
        if (mtv.contains(plugins, 'Windows Media Player')) {
          this.attributes.type = "application/x-mplayer2";
          this.attributes.pluginspage = 'http://www.microsoft.com/Windows/MediaPlayer/';
        } else if (mtv.contains(plugins, 'VLC Web Plugin')) {
          this.attributes.type = "application/x-vlc-plugin";
          this.attributes.pluginspage = "http://www.videolan.org";
        } else if (mtv.contains(plugins, 'QuickTime Plug-in')) {
          this.attributes.type = "video/quicktime";
          this.attributes.pluginspage = "http://www.apple.com/quicktime/download/";
        } else {
          mtv.notification('You need install VLC Web Plugin ! <a href="http://www.videolan.org/vlc/" target="_blank">Install</a>', 30000);
          return false;
        }
      }
      this.options.output = 'embed';
      this.insert();
    },
    html5 : function (id, setup) {

      //  Video Tag (html5)
      /* Note:
      https://html5rocks.com/en/tutorials/video/basics/
      http://www.w3schools.com/tags/tag_video.asp

      // Test video
      https://www.joomlacontenteditor.net/images/big_buck_bunny.flv
      http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4
      http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm
      http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv
       */

      this.get(id);
      //this.attributes = {};
      this.attributes.id = this.attributes.name = mtv.generateID();
      this.attributes.height = setup.height || this.in.node.clientHeight || "100%";
      this.attributes.width = setup.width || this.in.node.clientWidth || "100%";
      this.attributes.src = setup.file || setup.src;
      this.attributes.type = this.getMime(this.attributes.src);
      this.attributes.controls = 'controls';
      //this.attributes.preload = 'none';
      if (setup.autostart || setup.autoplay) {
        this.attributes.autoplay = 'autoplay';
      }
      this.options.output = 'html5';
      this.insert();
    }
  },
  rules : {
    // --------------------------------------------------------------------------------------------
    // Specific
    // --------------------------------------------------------------------------------------------
      movie_domains : {
      host : ['movietv.to'],
      onAlways : function () {
        mtv.uw.myFunction = function () {};
      //    for (i in mtv.uw) { mtv.uw[i] = function () {};  }
      }
    },
      gum_domains : {
      host : ['gum-gum-streaming.com','dpstream.net','jeu.info','jemontremesseins.com'],
      onAlways : function () {
         for (i in mtv.uw) { mtv.uw[i] = function () {};  }
      }
    },

  }
};

mtv.initialize();