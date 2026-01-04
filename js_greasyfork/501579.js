// ==UserScript==
// @name         开发环境下登录自动更新cookie
// @namespace    https://github.com/KazooTTT/auto-update-cookie
// @version      0.0.1
// @author       KazooTTT
// @description  开发环境下登录自动更新cookie，减少手动更新cookie
// @license      MIT
// @icon         https://cdn.ihan.club/club.ico
// @match        http://localhost:*/*
// @downloadURL https://update.greasyfork.org/scripts/501579/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/501579/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0cookie.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*! js-cookie v3.0.5 | MIT */
  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target;
  }
  var defaultConverter = {
    read: function(value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    },
    write: function(value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      );
    }
  };
  function init(converter, defaultAttributes) {
    function set(name, value, attributes) {
      if (typeof document === "undefined") {
        return;
      }
      attributes = assign({}, defaultAttributes, attributes);
      if (typeof attributes.expires === "number") {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }
      name = encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      var stringifiedAttributes = "";
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue;
        }
        stringifiedAttributes += "; " + attributeName;
        if (attributes[attributeName] === true) {
          continue;
        }
        stringifiedAttributes += "=" + attributes[attributeName].split(";")[0];
      }
      return document.cookie = name + "=" + converter.write(value, name) + stringifiedAttributes;
    }
    function get(name) {
      if (typeof document === "undefined" || arguments.length && !name) {
        return;
      }
      var cookies = document.cookie ? document.cookie.split("; ") : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split("=");
        var value = parts.slice(1).join("=");
        try {
          var found = decodeURIComponent(parts[0]);
          jar[found] = converter.read(value, found);
          if (name === found) {
            break;
          }
        } catch (e) {
        }
      }
      return name ? jar[name] : jar;
    }
    return Object.create(
      {
        set,
        get,
        remove: function(name, attributes) {
          set(
            name,
            "",
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function(attributes) {
          return init(this.converter, assign({}, this.attributes, attributes));
        },
        withConverter: function(converter2) {
          return init(assign({}, this.converter, converter2), this.attributes);
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    );
  }
  var api = init(defaultConverter, { path: "/" });
  function interceptXHR() {
    XMLHttpRequest.prototype.originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
      const xhr = this;
      xhr.onreadystatechange = function() {
        if (xhr.responseURL.endsWith("/auth/login")) {
          const { token } = JSON.parse(xhr.responseText);
          api.set("token", token, { path: "/", domain: window.location.hostname, expires: null });
        }
      };
      xhr.originalSend.apply(xhr, arguments);
    };
  }
  interceptXHR();

})();
