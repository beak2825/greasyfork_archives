/* eslint-disable */
// ==UserScript==
// @name         The Noun Project - Download PNG Icon
// @description  Bypasses registration and downloads the SVG when clicking the download button
// @version      0.12
// @namespace    https://greasyfork.org/users/40601
// @homepage     https://greasyfork.org/scripts/39196
// @supportURL   https://greasyfork.org/scripts/39196/feedback
// @author       Leeroy
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/3rlituyucv3ixk6j56inbxf26dtq
// @match        *://thenounproject.com/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/39196/The%20Noun%20Project%20-%20Download%20PNG%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/39196/The%20Noun%20Project%20-%20Download%20PNG%20Icon.meta.js
// ==/UserScript==
/* eslint-enable */

/* eslint-env browser, greasemonkey */

'use strict';

const Util = {
  getFilename(el) {
    try {
      // https://thenounproject.com/icon/pyjamas-409746/
      return new URL(el.href).pathname.slice(0, -1).replace(/\/icon\//g, '');
    } catch (err) {
      return 'unknown.svg';
    }
  },
  elFactory(type, attributes) {
    const el = document.createElement(type);
    for (let key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
    return el;
  }
};

const SaveHelper = {
  selectors: {
    icon: '[class^="styles__IconEditorContainer"] img',
    button: 'button[class*="styles__GetIconButton"]',
    filename: 'link[rel="canonical"]'
  },
  save(
    data = document.querySelector(this.selectors.icon).src,
    filename = Util.getFilename(document.querySelector(this.selectors.filename))
  ) {
    const markup = Util.elFactory('a', {
      href: data,
      download: filename
    });
    document.body.appendChild(markup);
    markup.click();
    document.body.removeChild(markup);
  },
  handleClick(event) {
    // Block the button's usual functionality (login modal)
    event.stopPropagation();
    SaveHelper.save();
  },
  override(buttonElement = document.querySelector(this.selectors.button)) {
    if (!buttonElement) return;
    // Anonymous functions would get attached multiple times
    buttonElement.addEventListener('click', SaveHelper.handleClick);
    buttonElement.textContent = 'Get this icon now';
  },
  watch(sel = this.selectors.icon, cb = this.override) {
    const icon = document.querySelector(sel);

    if (icon.complete) {
      cb.apply(this);
    } else {
      icon.addEventListener('load', cb.apply(this));
    }
  }
};

SaveHelper.watch();
