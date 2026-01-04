// ADV Ride Report De-crufter
// version 4.2
// Release Date: 2018.09.11
// http://devourmiles.com
// Copyright (c) 2009-2018, All Rights Reserved (except where
// otherwise noted)
//
// You may modify this script for your own personal use,
// but please contact me first before releasing any changes.
//
// ***** INSTRUCTIONS *****
//
// This is a Greasemonkey user script.
//
// To use this script, get Greasemonkey: http://greasemonkey.mozdev.org/
// After you've installed it, come back to this page. A dialog box will
// appear asking you if you want to install this script. Believe me, you do.
//
// To uninstall, go to Tools->Greasemonkey->Manage User Scripts, select
// "ADV Ride Report De-crufter" from the list on the left, and click
// Uninstall.
//
//
// ==UserScript==
// @name           ADV Ride Report De-crufter
// @namespace      http://devourmiles.com
// @version        4.2
// @description    Remove cruft from ride reports on ADVRider, i.e. only show posts from the member who started the thread.
//
// @include        https://www.advrider.com/*
// @include        https://advrider.com/*
// @downloadURL https://update.greasyfork.org/scripts/31745/ADV%20Ride%20Report%20De-crufter.user.js
// @updateURL https://update.greasyfork.org/scripts/31745/ADV%20Ride%20Report%20De-crufter.meta.js
// ==/UserScript==

function Querystring(qs) {
  this.qstr = '';
  this.params = [];

  if (qs == null) qs = location.search.substring(1, location.search.length);
  if (qs.length == 0) return;

  qs = qs.replace(/\+/g, ' ');
  this.qstr = qs;
  this.params = qs.split('/');
}

Querystring.prototype.contains = function(key) {
  for (var i=0; i<this.params.length; i++) {
    if (this.params[i] == key) {
      return true;
    }
    return false;
  }
}

/* xpath helper
 * http://wiki.greasespot.net/Code_snippets#XPath_helper
 */
function $x() {
  var x='',          // default values
  node=document,
  type=0,
  fix=true,
  i=0,
  toAr=function(xp){      // XPathResult to array
    var final=[], next;
    while(next=xp.iterateNext())
      final.push(next);
    return final
  },
  cur;
  while (cur=arguments[i++])      // argument handler
    switch(typeof cur) {
  case "string":x+=(x=='') ? cur : " | " + cur;continue;
  case "number":type=cur;continue;
  case "object":node=cur;continue;
  case "boolean":fix=cur;continue;
  }
  if (fix) {      // array conversion logic
    if (type==6) type=4;
    if (type==7) type=5;
  }
  if (!/^\//.test(x)) x="//"+x;                 // selection mistake helper
  if (node!=document && !/^\./.test(x)) x="."+x;  // context mistake helper
  var temp=document.evaluate(x,node,null,type,null); //evaluate!
  if (fix)
    switch(type) {                   // automatically return special type
  case 1:return temp.numberValue;
  case 2:return temp.stringValue;
  case 3:return temp.booleanValue;
  case 8:return temp.singleNodeValue;
  case 9:return temp.singleNodeValue;
  }
  return fix ? toAr(temp) : temp;
}

/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
  var registeredInModuleLoader;
  if (typeof define === 'function' && define.amd) {
    define(factory);
    registeredInModuleLoader = true;
  }
  if (typeof exports === 'object') {
    module.exports = factory();
    registeredInModuleLoader = true;
  }
  if (!registeredInModuleLoader) {
    var OldCookies = window.Cookies;
    var api = window.Cookies = factory();
    api.noConflict = function () {
      window.Cookies = OldCookies;
      return api;
    };
  }
}(function () {
  function extend () {
    var i = 0;
    var result = {};
    for (; i < arguments.length; i++) {
      var attributes = arguments[ i ];
      for (var key in attributes) {
        result[key] = attributes[key];
      }
    }
    return result;
  }

  function decode (s) {
    return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  }

  function init (converter) {
    function api() {}

    function set (key, value, attributes) {
      if (typeof document === 'undefined') {
        return;
      }

      attributes = extend({
        path: '/'
      }, api.defaults, attributes);

      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
      }

      // We're using "expires" because "max-age" is not supported by IE
      attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

      try {
        var result = JSON.stringify(value);
        if (/^[\{\[]/.test(result)) {
          value = result;
        }
      } catch (e) {}

      value = converter.write ?
        converter.write(value, key) :
        encodeURIComponent(String(value))
          .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

      key = encodeURIComponent(String(key))
        .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
        .replace(/[\(\)]/g, escape);

      var stringifiedAttributes = '';
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue;
        }
        stringifiedAttributes += '; ' + attributeName;
        if (attributes[attributeName] === true) {
          continue;
        }

        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }

      return (document.cookie = key + '=' + value + stringifiedAttributes);
    }

    function get (key, json) {
      if (typeof document === 'undefined') {
        return;
      }

      var jar = {};
      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var i = 0;

      for (; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var cookie = parts.slice(1).join('=');

        if (!json && cookie.charAt(0) === '"') {
          cookie = cookie.slice(1, -1);
        }

        try {
          var name = decode(parts[0]);
          cookie = (converter.read || converter)(cookie, name) ||
            decode(cookie);

          if (json) {
            try {
              cookie = JSON.parse(cookie);
            } catch (e) {}
          }

          jar[name] = cookie;

          if (key === name) {
            break;
          }
        } catch (e) {}
      }

      return key ? jar[key] : jar;
    }

    api.set = set;
    api.get = function (key) {
      return get(key, false /* read as raw */);
    };
    api.getJSON = function (key) {
      return get(key, true /* read as json */);
    };
    api.remove = function (key, attributes) {
      set(key, '', extend(attributes, {
        expires: -1
      }));
    };

    api.defaults = {};

    api.withConverter = init;

    return api;
  }

  return init(function () {});
}));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* begin de-crufter code... */

var advRR = {
  showOptionsDiv: function() {
    // get current settings, if any
    var settings = Cookies.get(advRR.getThreadId());
    if (settings) {
      settings = settings.split(/:/);
      advRR.author = settings[0];
      advRR.filter = (settings[1] == "1" ? true : false);
      if (typeof(settings[2]) != "undefined" || settings[2] != "") {
        if (settings[2] == "") {
          var exception_list = "";
        } else {
          advRR.exceptions = settings[2].split(/,/);
          var exception_list = advRR.exceptions.join(",");
        }
      }
      var op_username = settings[0];
      var advRR_chk = (settings[1] == "1" ? "checked " : "");
    } else {
      var op = $x("//p[@id='pageDescription']/a[@class='username']", XPathResult.FIRST_ORDERED_NODE_TYPE);
      var op_username = op.textContent;
      var advRR_chk = "";
      var exception_list = "";
    }

    if (typeof(op_username) != "undefined") {
      var newNode = document.createElement("div");
      var innerHTML = "Only show <b>" + op_username + "</b>'s posts? <input type='checkbox' id='advRR_chk_show' " + advRR_chk + "> <span style='padding-left:20px'>Exceptions: [<span id='exception_span'>" + exception_list + "</span>] <a href='#' id='exception_edit' style='margin-left:10px'>edit</a> | <a href='#' id='exception_clear'>clear</a></span>";
      newNode.innerHTML = innerHTML;
      newNode.addEventListener ('click', function () {
        advRRToggle(op_username);
      });

      var target = $x("//p[@id='pageDescription']", XPathResult.ANY_UNORDERED_NODE_TYPE);
      target.appendChild(newNode);

      var exceptionEdit = $x("//a[@id='exception_edit']", XPathResult.ANY_UNORDERED_NODE_TYPE);
      exceptionEdit.addEventListener ('click', function (e) {
        e.preventDefault();
        editExceptions();
      });

      var exceptionClear = $x("//a[@id='exception_clear']", XPathResult.ANY_UNORDERED_NODE_TYPE);
      exceptionClear.addEventListener ('click', function (e) {
        e.preventDefault();
        clearExceptions();
      });
    }
  },
  getPosts: function () {
    advRR.posts = $x("//li[contains(@id, 'post')]", XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
  },
  getThreadId: function () {
    return advRR.urlParts[5];
  },
  isFirstPage: function () {
    var pageNavHeader = $x("//span[@class='pageNavHeader']", XPathResult.FIRST_ORDERED_NODE_TYPE);
    if (/Page 1/.test(pageNavHeader.innerHTML)) {
      return true;
    } else {
      return false;
    }
  },
  showError: function (message) {
    var newNode = document.createElement("div");
    newNode.innerHTML = message;
    var target = $x("//p[@id='pageDescription']", XPathResult.ANY_UNORDERED_NODE_TYPE);
    target.appendChild(newNode);
  },
  setGMOption: function (key, value) {
    Cookies.set(key, value, { expires: 3650 });
  },
author: "",
filter: false,
queryStr: {},
urlParts: [],
exceptions: [],
posts: []
} // end advRR

deCruftify = function() {
  for (var i=0; i < advRR.posts.length; i++) {
    var post = advRR.posts[i];
    if (advRR.filter && post.dataset.author != advRR.author && !advRR.exceptions.includes(post.dataset.author)) {
      post.style.display = "none";
    } else {
      post.style.display = "";
    }
  }
}

advRRToggle = function(username) {
  var advRR_chk_show = $x("//input[@id='advRR_chk_show']", XPathResult.FIRST_ORDERED_NODE_TYPE);

  if (advRR_chk_show.checked) {
    advRR.setGMOption(advRR.getThreadId(), username + ":1:" + advRR.exceptions.join(','));
    advRR.author = username;
    advRR.filter = true;
  } else {
    advRR.setGMOption(advRR.getThreadId(), username + ":0:" + advRR.exceptions.join(','));
    advRR.author = username;
    advRR.filter = false;
  }

  // refresh display of posts
  deCruftify();
}

editExceptions = function() {
  var exception_span = $x("//span[@id='exception_span']", XPathResult.FIRST_ORDERED_NODE_TYPE);
  var input = prompt("Make exceptions for? (separate multiple usernames with commas)", advRR.exceptions.join(","));
  if (input == null || input == "") {
    return false;
  } else {
    var newSettings = advRR.author + ":" + (advRR.filter ? "1" : "0") + ":" + input;
    advRR.setGMOption(advRR.getThreadId(), newSettings);
    advRR.exceptions = input.split(",");

    exception_span.innerHTML = input;

    deCruftify();
  }
}

clearExceptions = function() {
  var exception_span = $x("//span[@id='exception_span']", XPathResult.FIRST_ORDERED_NODE_TYPE);
  var c = confirm("Clear exceptions for " + advRR.exceptions.join(",") + "?");
  if (!c) {
    return false;
  } else {
    var newSettings = advRR.author + ":" + (advRR.filter ? "1" : "0") + ":";
    advRR.setGMOption(advRR.getThreadId(), newSettings);
    advRR.exceptions = [];

    exception_span.innerHTML = "";

    deCruftify();
  }
}

async function doIt() {
  console.log("Firing up the ADV RR De-crufter...");
  await sleep(1200); // wait for XenForo to do its thing
  console.log("ADV RR De-crufter ready to go.");

  // get URL and split into an array of parts
  advRR.urlParts = document.URL.split("/");

  // are we even viewing a thread?
  if (!advRR.urlParts[4] == "threads") {
    // nope, so GTFO
    return;
  }

  console.log("De-crufting...");
  advRR.getPosts();
  advRR.showOptionsDiv();
  deCruftify();
}
doIt();
