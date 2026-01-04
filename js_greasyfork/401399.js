// ==UserScript==
// @name        GM XHR
// @author      Ryan Greenberg, Martin Monperrus, Damien Clark, RobotOilInc
// @version     1.1
// @description jQuery AJAX wrapper for GM_xmlhttpRequest
// @homepageURL https://greasyfork.org/scripts/401399-gm-xhr
// @supportURL  https://greasyfork.org/scripts/401399-gm-xhr
// @grant       GM_xmlhttpRequest
// ==/UserScript==

/* jshint esversion: 6 */

function GM_XHR() {
  'use strict';

  this.type = null;
  this.url = null;
  this.async = null;
  this.username = null;
  this.password = null;
  this.status = null;
  this.headers = {};
  this.readyState = null;

  this.abort = function () {
    this.readyState = 0;
  };

  this.getAllResponseHeaders = function (name) {
    if (this.readyState !== 4) return '';
    return this.responseHeaders;
  };

  this.getResponseHeader = function (header) {
    let value = null;
    if (this.responseHeaders) {
      const regex = new RegExp(`^${header}: (.*)$`, 'igm');
      const result = [];

      let match = regex.exec(this.responseHeaders);
      while (match !== null) {
        result.push(match[1]);
        match = regex.exec(this.responseHeaders);
      }

      if (result.length > 0) {
        value = result.join(', ');
      }
    }

    return value;
  };

  this.open = function (type, url, async, username, password) {
    this.type = type || null;
    this.url = url || null;
    this.async = async || null;
    this.username = username || null;
    this.password = password || null;
    this.readyState = 1;
  };

  this.setRequestHeader = function (name, value) {
    this.headers[name] = value;
  };

  this.send = function (data) {
    this.data = data;
    const that = this;

    if (typeof GM.xmlHttpRequest === 'undefined' && typeof GM_xmlhttpRequest === 'undefined') {
      throw new Error("You need to enable 'GM.xmlHttpRequest' or 'GM_xmlhttpRequest'.");
    }

    // Detect if using older GM API (or other userscript engines)
    const agent = (typeof GM_xmlhttpRequest === 'undefined') ? GM.xmlHttpRequest : GM_xmlhttpRequest;

    // https://github.com/scriptish/scriptish/wiki/GM_xmlhttpRequest
    agent({
      method: this.type,
      url: this.url,
      headers: this.headers,
      data: this.data,
      responseType: this.responseType,
      onload(rsp) {
        for (const k in Object.getOwnPropertyNames(rsp)) {
          that[Object.getOwnPropertyNames(rsp)[k]] = rsp[Object.getOwnPropertyNames(rsp)[k]];
        }

        if (that.onload) that.onload(); else that.onreadystatechange();
      },
      onerror(rsp) {
        for (const k in Object.getOwnPropertyNames(rsp)) {
          that[Object.getOwnPropertyNames(rsp)[k]] = rsp[Object.getOwnPropertyNames(rsp)[k]];
        }

        if (that.onload) that.onload(); else that.onreadystatechange();
      },
    });
  };
}
