// ==UserScript==
// @name         FR:Reborn - Agents extension
// @namespace    https://www.reddit.com/user/RobotOilInc
// @version      2.3.4
// @description  Upload QCs from your favorite agent to Imgur + QC server
// @author       RobotOilInc
// @match        https://www.basetao.com/*my_account/order/*
// @match        https://basetao.com/*my_account/order/*
// @match        https://www.cssbuy.com/*name=orderlist*
// @match        https://cssbuy.com/*name=orderlist*
// @match        https://superbuy.com/order*
// @match        https://www.superbuy.com/order*
// @match        https://wegobuy.com/order*
// @match        https://www.wegobuy.com/order*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @license      MIT
// @homepageURL  https://www.fashionreps.page/
// @supportURL   https://greasyfork.org/en/scripts/426977-fr-reborn-agents-extension
// @include      https://www.basetao.com/index/orderphoto/itemimg/*
// @include      https://basetao.com/index/orderphoto/itemimg/*
// @require      https://unpkg.com/sweetalert2@11.10.6/dist/sweetalert2.js
// @require      https://unpkg.com/js-logger@1.6.1/src/logger.js
// @require      https://unpkg.com/spark-md5@3.0.2/spark-md5.js
// @require      https://unpkg.com/@zip.js/zip.js@2.3.15/dist/zip-full.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.js
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js
// @require      https://unpkg.com/jquery.ajax-retry@0.2.7/src/jquery.ajax-retry.js
// @require      https://unpkg.com/@sentry/browser@6.19.7/build/bundle.js
// @require      https://unpkg.com/@sentry/tracing@6.19.7/build/bundle.tracing.js
// @require      https://unpkg.com/swagger-client@3.26.0/dist/swagger-client.browser.js
// @require      https://greasyfork.org/scripts/11562-gm-config-8/code/GM_config%208+.js?version=66657
// @resource     sweetalert2 https://unpkg.com/sweetalert2@11.0.15/dist/sweetalert2.min.css
// @run-at       document-end
// @icon         https://i.imgur.com/mYBHjAg.png
// @downloadURL https://update.greasyfork.org/scripts/426977/FR%3AReborn%20-%20Agents%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/426977/FR%3AReborn%20-%20Agents%20extension.meta.js
// ==/UserScript==

// Define default toast
const Toast = Swal.mixin({
  showConfirmButton: false,
  timerProgressBar: true,
  position: 'top-end',
  timer: 4000,
  toast: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

/**
 * @param text {string}
 * @param type {null|('success'|'error'|'warning'|'info')}
 */
const Snackbar = function (text, type = null) {
  Toast.fire({ title: text, icon: type != null ? type : 'info' });
};

/**
 * @return {Promise<boolean>}
 */
const ConfirmDialog = async function () {
  return new Promise((resolve) => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => resolve(result.isConfirmed));
  });
};

class ImgurError extends Error {
  /**
   * @param message {string}
   * @param previous {Error}
   */
  constructor(message, previous) {
    super(message);
    this.name = 'ImgurError';
    this.previous = previous;
  }
}

class ImgurSlowdownError extends ImgurError {
  constructor(message, previous) {
    super(`Imgur is telling us to slow down:\n${message}`, previous);
  }
}

// Possible websites
const WEBSITE_1688 = '1688';
const WEBSITE_TAOBAO = 'taobao';
const WEBSITE_TMALL = 'tmall';
const WEBSITE_YUPOO = 'yupoo';
const WEBSITE_WEIDIAN = 'weidian';
const WEBSITE_XIANYU = 'xianyu';
const WEBSITE_UNKNOWN = 'unknown';

/**
 * @internal
 * @param url {string}
 * @returns {string}
 */
const ensureNonEncodedURL = (url) => {
  if (url === decodeURIComponent(url || '')) {
    return url;
  }

  // Grab the encoded URL
  const encodedURL = new URL(url).searchParams.get('url') || '';
  if (encodedURL.length === 0) {
    return url;
  }

  // Decode said encoded URL
  const decodedURL = decodeURIComponent(encodedURL);
  if (decodedURL.length === 0) {
    return url;
  }

  return decodedURL;
};

/**
 * @param url {string}
 * @returns {boolean}
 */
const isUrl = (url) => { try { return Boolean(new URL(url)); } catch (e) { return false; } };

/**
 * @param originalUrl {string}
 * @param website {string}
 * @returns {string}
 */
const cleanPurchaseUrl = (originalUrl, website) => {
  const url = ensureNonEncodedURL(originalUrl);

  const idMatches = url.match(/[?&]id=(\d+)|[?&]itemID=(\d+)|\/?[albums]\/(\d+)|offer\/(\d+)/i);
  const authorMatches = url.match(/https?:\/\/(.+)\.x\.yupoo\.com/);

  if (website === WEBSITE_TAOBAO && idMatches[1].length !== 0) {
    return `https://item.taobao.com/item.htm?id=${idMatches[1]}`;
  }

  if (website === WEBSITE_TMALL && idMatches[1].length !== 0) {
    return `https://detail.tmall.com/item.htm?id=${idMatches[1]}`;
  }

  if (website === WEBSITE_XIANYU && idMatches[1].length !== 0) {
    return `https://2.taobao.com/item.htm?id=${idMatches[1]}`;
  }

  if (website === WEBSITE_WEIDIAN && idMatches[2].length !== 0) {
    return `https://weidian.com/item.html?itemID=${idMatches[2]}`;
  }

  if (website === WEBSITE_YUPOO && idMatches[3].length !== 0 && authorMatches[1].length !== 0) {
    return `https://${authorMatches[1]}.x.yupoo.com/albums/${idMatches[3]}`;
  }

  if (website === WEBSITE_1688 && idMatches[4].length !== 0) {
    return `https://detail.1688.com/offer/${idMatches[4]}.html`;
  }

  // Just return the original URL with some clean up
  return originalUrl.replace('http://', 'https://').replace('?uid=1', '').trim();
};

/**
 * @param originalUrl {string}
 * @returns {string}
 */
const determineWebsite = (originalUrl) => {
  if (originalUrl.indexOf('1688.com') !== -1) {
    return WEBSITE_1688;
  }

  // Check more specific taobao first
  if (originalUrl.indexOf('market.m.taobao.com') !== -1 || originalUrl.indexOf('2.taobao.com') !== -1) {
    return WEBSITE_XIANYU;
  }

  if (originalUrl.indexOf('taobao.com') !== -1) {
    return WEBSITE_TAOBAO;
  }

  if (originalUrl.indexOf('detail.tmall.com') !== -1) {
    return WEBSITE_TMALL;
  }

  if (originalUrl.indexOf('weidian.com') !== -1 || originalUrl.indexOf('koudai.com') !== -1) {
    return WEBSITE_WEIDIAN;
  }

  if (originalUrl.indexOf('yupoo.com') !== -1) {
    return WEBSITE_YUPOO;
  }

  return WEBSITE_UNKNOWN;
};

const removeWhitespaces = (item) => item.trim().replace(/\s(?=\s)/g, '');

/**
 * @param input {string}
 * @param maxLength {number} must be an integer
 * @returns {string}
 */
const truncate = function (input, maxLength) {
  function isHighSurrogate(codePoint) {
    return codePoint >= 0xd800 && codePoint <= 0xdbff;
  }

  function isLowSurrogate(codePoint) {
    return codePoint >= 0xdc00 && codePoint <= 0xdfff;
  }

  function getLength(segment) {
    if (typeof segment !== 'string') {
      throw new Error('Input must be string');
    }

    const charLength = segment.length;
    let byteLength = 0;
    let codePoint = null;
    let prevCodePoint = null;
    for (let i = 0; i < charLength; i++) {
      codePoint = segment.charCodeAt(i);
      // handle 4-byte non-BMP chars
      // low surrogate
      if (isLowSurrogate(codePoint)) {
        // when parsing previous hi-surrogate, 3 is added to byteLength
        if (prevCodePoint != null && isHighSurrogate(prevCodePoint)) {
          byteLength += 1;
        } else {
          byteLength += 3;
        }
      } else if (codePoint <= 0x7f) {
        byteLength += 1;
      } else if (codePoint >= 0x80 && codePoint <= 0x7ff) {
        byteLength += 2;
      } else if (codePoint >= 0x800 && codePoint <= 0xffff) {
        byteLength += 3;
      }
      prevCodePoint = codePoint;
    }

    return byteLength;
  }

  if (typeof input !== 'string') {
    throw new Error('Input must be string');
  }

  const charLength = input.length;
  let curByteLength = 0;
  let codePoint;
  let segment;

  for (let i = 0; i < charLength; i += 1) {
    codePoint = input.charCodeAt(i);
    segment = input[i];

    if (isHighSurrogate(codePoint) && isLowSurrogate(input.charCodeAt(i + 1))) {
      i += 1;
      segment += input[i];
    }

    curByteLength += getLength(segment);

    if (curByteLength === maxLength) {
      return input.slice(0, i + 1);
    }
    if (curByteLength > maxLength) {
      return input.slice(0, i - segment.length + 1);
    }
  }

  return input;
};

/**
 * @param url {string}
 * @returns {Promise<string>}
 */
const toDataURL = (url) => fetch(url)
  .then((response) => response.blob())
  .then((blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));

/**
 * @param base64Data {string}
 * @returns {Promise<string>}
 */
const WebpToJpg = function (base64Data) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = base64Data;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      resolve(canvas.toDataURL('image/jpeg'));
    };
  });
};

/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 */
/**
 * @param selector {string}
 * @returns {Promise<Element>}
 */
const elementReady = function (selector) {
  return new Promise((resolve) => {
    // Check if the element already exists
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
    }

    // It doesn't so, so let's make a mutation observer and wait
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((foundElement) => {
        // Resolve the element that we found
        resolve(foundElement);

        // Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  });
};

class BaseTaoElement {
  constructor($element, data) {
    this.element = $element;
    this.data = data;

    // Set the order id
    this.orderId = data.oid;

    // Item name
    this.title = truncate(removeWhitespaces(data.goodsname), 255);

    // Item and shipping prices
    this.itemPrice = `CNY ${data.goodsprice}`;
    this.freightPrice = `CNY ${data.sendprice}`;

    // URL related stuff
    this.url = data.goodsurl;
    this.website = determineWebsite(this.url);

    // QC images location
    this.qcImagesUrl = `https://www.basetao.com/best-taobao-agent-service/purchase/order_img/${data.oid}.html`;

    // Item sizing (if any)
    let sizing = removeWhitespaces(data.goodssize);
    sizing = (sizing !== '-' && sizing.toLowerCase() !== 'no') ? truncate(sizing, 255) : '';
    this.sizing = sizing.length !== 0 ? sizing : null;

    // Item color (if any)
    let color = removeWhitespaces(data.goodscolor);
    color = (color !== '-' && color.toLowerCase() !== 'no') ? truncate(color, 255) : '';
    this.color = color.length !== 0 ? color : null;

    // Item weight
    const weight = removeWhitespaces(data.orderweight);
    this.weight = weight.length !== 0 ? `${weight} gram` : null;

    // Image url storage, for later
    this.imageUrls = [];

    // Set at a later date, if ever
    this.albumId = null;
  }

  /**
   * @return {string}
   */
  get albumUrl() {
    return `https://imgur.com/a/${this.albumId}`;
  }

  /**
   * @param imageUrls {string[]}
   */
  set images(imageUrls) {
    this.imageUrls = imageUrls;
  }

  /**
   * @returns {string}
   */
  get purchaseUrl() {
    return cleanPurchaseUrl(this.url, this.website);
  }
}

const ImgurIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACl0lEQVQ4jX2TS0jUURSHv3v/d9TRMh0tzYrQiF7qpgijaFERRhlkxSwyiggXKdEiCjLBCi10UVirau0mCgzMVQQ96EHv1GxRWWBoKTbK2H+c+2gx6ZRIZ3U238c59/yuAFjQebQSqAeKcSj+VwINdAHn+re13hJ/4Ju4/2IziQB2K6B+JlgKQSglg0wVJF2lEhAeFseAH2HQj4ADBPUKKJ6C4nBxdRVrQ0VkBjL4aWOMuTi/nEHjkEKyVGWy42EzX8eHAYrV5M7Ot7jLETa1r+TE4F0ej39DegrpKYSnkCrRN4fWsSiYkxA4lJyEo40DzPmeQnjPWc5kb2RlaghrNNZonNFYneits0ghkqs63xK7MITpjVFVtZneD1958eA9+7JLEuA0SQoS30wkBbp5hKZD+ykpLaSxqY0zDQdIX59LXV9nEvxLMksEGNX+lEB5Hw3OOYJpqVxurWVBxWJqP9xAS4n0EpGQgP0DZMkURuLR5ATRqM/J49ep2FlGwfaFHOluI6ZjOBPHGo2whtPzk28SkmkMx8b+OrcTOOeYm5tF11g/Ezo2NbK0hguLy5n7RnMpdyvr0gsYjUcxLhkcCYJdlRtoPNdGub+McP4anNEIa2lZspPYvSGuXuvgYPg8zTmbeT7y+d9AZgUr40IKZZwhLz+b9o4Gbqtuls+ez8T9CLU1V/D9CYy1hMpyEMeyMJ6bjLOWONFVUlqIcIL8vGzKt9RR9DKDwfZvVB++REtLNaWlRQRWBDE1s5Nworq8oFr1Y3BgJJyaFmBveCOPH/Vwp+MZkUiUL33fef3qE32BYdJP5SHS5PTPVOP5uud9UK16Z7Rd9vRJb64xTlrjcM4xOjrOr4WWYN28JCzQCN4CNf3bWm/9BkZ7QCBmf01HAAAAAElFTkSuQmCC';
const Loading = 'data:image/gif;base64,R0lGODlhEAAQAPMAAP////r6+paWlr6+vnx8fIyMjOjo6NDQ0ISEhLa2tq6urvDw8MjIyODg4J6enqampiH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAEAAQAAAETBDISau9NQjCiUxDYGmdhBCFkRUlcLCFOA3oNgXsQG2HRh0EAYWDIU6MGSSAR1G4ghRa7KjIUXCog6QzpRhYiC1HILsOEuJxGcNuTyIAIfkECQoAAAAsAAAAABAAEAAABGIQSGkQmzjLQkTTWDAgRGmAgMGVhAIESxZwBUMgSyAUATYQPIBg8OIQJwLCQbJkdjAlUCA6KfU0VEmyGWgenpNfcCAoEo6SmWtBYtCukxhAwQKeQAYWYgAHNZIFKBoMCHcTEQAh+QQJCgAAACwAAAAAEAAQAAAEWhDIOZejGDNysgyDQBAIGWRGMa7jgAVq0TUj0lEDUZxArvAU0a1nAAQOrsnIA1gqCZ6AUzI4nAxJwIEgyAQUhCQsjDmUCI1jDEhlrQrFV+ksGLApWwYz41jsIwAh+QQJCgAAACwAAAAAEAAQAAAEThDISau9IIQahiCEMGhCQxkFqBLFZ0pBWhzSkYIvMLAb/OGTBII2+QExSEBjuexhVgrKAZGgqKKTGGFgBc00Np71cVsVDJVo5ydyJt/wCAAh+QQJCgAAACwAAAAAEAAQAAAEWhDISau9OAxBiBjBtRRdSRTGpRRHeJBFOKWALAXkAKQNoSwWBgFRQAA4Q5DkgOwwhCXBYTJAdAQAopVhWSgIjR1gcLLVQrQbrBV4CcwSA8l0Alo0yA8cw+9TIgAh+QQJCgAAACwAAAAAEAAQAAAEWhDISau9WA5CxAhWMDDAwXGFQR0IgQRgWRBF7JyEQgXzIC2MFkc1MQkonMbAhyQ0Y5pBg0MREA4UwwnBWGhoUIAC55DwaAcQrIXATgyzE/bwCQ2sBGZmz7dEAAA7';

class Imgur {
  /**
   * @param version {string}
   * @param config {GM_config}
   * @param agent {string}
   * @constructor
   */
  constructor(version, config, agent) {
    this.version = version;
    this.agent = agent;

    if (config.get('imgurApi') === 'imgur') {
      this.headers = {
        authorization: `Client-ID ${config.get('imgurClientId')}`,
        'Content-Type': 'application/json',
      };
      this.host = config.get('imgurApiHost');

      return;
    }

    if (config.get('imgurApi') === 'rapidApi') {
      this.headers = {
        authorization: `Bearer ${config.get('rapidApiBearer')}`,
        'x-rapidapi-key': config.get('rapidApiKey'),
        'x-rapidapi-host': config.get('rapidApiHost'),
      };
      this.host = config.get('rapidApiHost');

      return;
    }

    throw new Error('Invalid Imgur API has been chosen');
  }

  /**
   * @param options
   * @returns {Promise<*|null>}
   */
  async CreateAlbum(options) {
    const requestData = {
      url: `https://${this.host}/3/album`,
      type: 'POST',
      headers: this.headers,
      data: JSON.stringify({
        title: options.title,
      }),
    };
    Sentry.addBreadcrumb({
      category: 'Imgur',
      message: 'Creating album',
      data: requestData,
    });

    Logger.debug('Creating album', requestData);

    return $.ajax(requestData).retry({ times: 3 }).catch((err) => {
      // Check if Imgur is being a bitch
      if (typeof err.responseJSON === 'undefined') {
        // Store request so we know what was asked
        this._storeRequestError(err);

        throw new ImgurError('Could not make an album, because Imgur is returning empty responses. Please try again later...', err);
      }

      this._handleImgurError(err);
    });
  }

  /**
   * @param base64Image {string}
   * @param albumDeleteHash {string}
   * @param purchaseUrl {string}
   * @returns {Promise<boolean>}
   */
  async AddBase64ImageToAlbum(base64Image, albumDeleteHash, purchaseUrl) {
    // First step, upload the image
    const requestData = {
      url: `https://${this.host}/3/image`,
      headers: this.headers,
      type: 'POST',
      data: JSON.stringify({
        album: albumDeleteHash,
        type: 'base64',
        image: base64Image,
        description: this._getImageDescription(purchaseUrl),
      }),
    };

    Logger.debug('Adding image to album', requestData);
    Sentry.addBreadcrumb({
      category: 'Imgur',
      message: 'Adding image to album',
      data: requestData,
    });

    await $.ajax(requestData).retry({ times: 3 }).catch((err) => {
      // Check if Imgur is being a bitch
      if (typeof err.responseJSON === 'undefined') {
        // Store request so we know what was asked
        this._storeRequestError(err);
      }

      this._handleImgurError(err);
    });
  }

  /**
   * @param imageUrl {string}
   * @param albumDeleteHash {string}
   * @param purchaseUrl {string}
   * @returns {Promise<*|null>}
   */
  async AddImageToAlbum(imageUrl, albumDeleteHash, purchaseUrl) {
    // First step, upload the image
    const requestData = {
      url: `https://${this.host}/3/image`,
      headers: this.headers,
      type: 'POST',
      data: JSON.stringify({
        album: albumDeleteHash,
        image: imageUrl,
        description: this._getImageDescription(purchaseUrl),
      }),
    };

    Logger.debug('Adding image to album', requestData);
    Sentry.addBreadcrumb({
      category: 'Imgur',
      message: 'Adding image to album',
      data: requestData,
    });

    await $.ajax(requestData).retry({ times: 3 }).catch((err) => {
      // Check if Imgur is being a bitch
      if (typeof err.responseJSON === 'undefined') {
        // Store request so we know what was asked
        this._storeRequestError(err);
      }

      this._handleImgurError(err);
    });
  }

  /**
   * @param deleteHash {string}
   */
  RemoveAlbum(deleteHash) {
    const requestData = {
      url: `https://${this.host}/3/album/${deleteHash}`,
      headers: this.headers,
      type: 'DELETE',
    };
    Sentry.addBreadcrumb({
      category: 'Imgur',
      message: 'Removing album',
      data: requestData,
    });

    $.ajax(requestData).retry({ times: 3 }).catch(() => {});
  }

  _getAlbumDescription() {
    return `Auto uploaded using FR:Reborn - ${this.agent} ${this.version}`;
  }

  /**
   * @param purchaseUrl {string}
   */
  _getImageDescription(purchaseUrl) {
    return purchaseUrl.length === 0 ? this._getAlbumDescription() : `W2C: ${purchaseUrl}`;
  }

  /**
   * @private
   * @param err {Error}
   */
  _storeRequestError(err) {
    Sentry.addBreadcrumb({
      category: 'Imgur',
      message: `Imgur returned: '${err.statusText}'`,
      data: err,
      level: Sentry.Severity.Error,
    });
  }

  /**
   * @private
   * @param err {Error}
   */
  _handleImgurError(err) {
    // If there is a server error, let the user now
    if (err.status === 503 || (err.responseJSON && err.responseJSON.status === 503)) {
      throw new ImgurError('Imgur is either down, over-capacity or you did too many requests. Try again later', err);
    }

    // If we uploaded too many files, re-throw as proper error (checking via old response setup, new response setup and a simple fallback)
    if (err.responseJSON && err.responseJSON.data && err.responseJSON.data.error && err.responseJSON.data.error.code === 429) {
      throw new ImgurSlowdownError(err.responseJSON.data.error.message, err);
    } else if (err.responseJSON && err.responseJSON.errors && err.responseJSON.errors.length === 1 && err.responseJSON.errors[0] && err.responseJSON.errors[0].code === 429) {
      throw new ImgurSlowdownError(err.responseJSON.errors[0].detail, err);
    } else if (err.status === 429 || (err.responseJSON && err.responseJSON.status === 429)) {
      throw new ImgurSlowdownError('Too Many Requests', err);
    }

    // Store request so we know what was asked
    this._storeRequestError(err);

    // If we have error data from Imgur, throw it (checking via the old response setup and the new one)
    if (err.responseJSON && err.responseJSON.data && err.responseJSON.data.error) {
      throw new ImgurError(`An error happened when uploading the image:\n${err.responseJSON.data.error.message}`, err);
    } else if (err.responseJSON && err.responseJSON.errors && err.responseJSON.errors.length !== 0 && err.responseJSON.errors[0].detail) {
      throw new ImgurSlowdownError(`An error happened when uploading the image:\n${err.responseJSON.errors[0].detail}`, err);
    }

    // If not, just show the full JSON
    throw new ImgurError(`An error happened when uploading the image:\n${err.responseJSON}`, err);
  }
}

const buildSwaggerHTTPError = function (response) {
  // Build basic error (and use response as extra)
  const error = new Error(`${response.body.detail}: ${response.url}`);

  // Add status and status code
  error.status = response.body.status;
  error.statusCode = response.body.status;

  return error;
};

class QC {
  /**
   * @param version {string}
   * @param client {SwaggerClient}
   * @param userHash {string}
   * @param identifier {string}
   * @param agent {string}
   */
  constructor(version, client, userHash, identifier, agent) {
    this.version = version;
    this.client = client;
    this.userHash = userHash;
    this.identifier = identifier;
    this.agent = agent;
  }

  /**
   * @param element {BaseTaoElement|CSSBuyElement|WeGoBuyElement}
   * @returns {Promise<null|string>}
   */
  existingAlbumByOrderId(element) {
    const request = { url: element.url, orderId: element.orderId };

    return this.client.apis.QualityControl.uploaded(request).then((response) => {
      if (typeof response.body === 'undefined') {
        return null;
      }

      if (!response.body.success) {
        return null;
      }

      // Force add the album ID to the element
      element.albumId = response.body.albumId; // eslint-disable-line no-param-reassign

      return response.body.albumId;
    }).catch((reason) => {
      Logger.error(`Could not check if the album for order '${element.orderId}' exists on the QC server`, reason);

      // For some reason we couldn't fetch information, just return, server probably down or something
      if (reason.message.includes('Failed to fetch') || reason.message.includes('NetworkError when attempting to fetch resource')) {
        return '-1';
      }

      // Add breadcrumb with actual request we did
      Sentry.addBreadcrumb({
        category: 'Swagger',
        message: 'existingAlbumByOrderId',
        data: { request },
        level: Sentry.Severity.Debug,
      });

      // Add breadcrumb with the error
      Sentry.addBreadcrumb({
        category: 'Swagger - Error',
        message: 'existingAlbumByOrderId',
        data: { error: reason },
        level: Sentry.Severity.Error,
      });

      // Swagger HTTP error
      if (typeof reason.response !== 'undefined') {
        Sentry.captureException(buildSwaggerHTTPError(reason));

        return '-1';
      }

      Sentry.captureException(new Error(`Could not check if the album for order '${element.orderId}' exists on the QC server`));

      return '-1';
    });
  }

  /**
   * @param url {string}
   * @returns {Promise<boolean>}
   */
  exists(url) {
    const request = { url };

    return this.client.apis.QualityControl.exists(request).then((response) => {
      if (typeof response.body === 'undefined') {
        return null;
      }

      if (!response.body.success) {
        return null;
      }

      return response.body.exists;
    }).catch((reason) => {
      Logger.error(`Could not check if any album exists on the QC server, URL: '${url}'`, reason);

      // For some reason we couldn't fetch information, just return, server probably down or something
      if (reason.message.includes('Failed to fetch') || reason.message.includes('NetworkError when attempting to fetch resource') || reason.message.includes('response status is 200')) {
        return '-1';
      }

      // Add breadcrumb with actual request we did
      Sentry.addBreadcrumb({
        category: 'Swagger',
        message: 'exists',
        data: { request },
        level: Sentry.Severity.Debug,
      });

      // Add breadcrumb with the error
      Sentry.addBreadcrumb({
        category: 'Swagger - Error',
        message: 'exists',
        data: { error: reason },
        level: Sentry.Severity.Error,
      });

      // Swagger HTTP error
      if (typeof reason.response !== 'undefined') {
        Sentry.captureException(buildSwaggerHTTPError(reason));

        return false;
      }

      Sentry.captureException(new Error(`Could not check if any album exists on the QC server, URL: '${url}'`));

      return false;
    });
  }

  /**
   * @param element {BaseTaoElement|CSSBuyElement|WeGoBuyElement}
   * @param album {string}
   */
  uploadQc(element, album) {
    const request = {
      method: 'post',
      requestContentType: 'application/json',
      requestBody: {
        usernameHash: this.userHash,
        identifier: this.identifier,
        albumId: album,
        color: element.color,
        orderId: element.orderId,
        purchaseUrl: element.purchaseUrl,
        sizing: element.sizing,
        itemPrice: element.itemPrice,
        freightPrice: element.freightPrice,
        weight: element.weight,
        source: `${this.agent} to Imgur ${this.version}`,
        website: element.website,
      },
    };

    Logger.log('Adding new QC to FR: Reborn', request);

    return this.client.apis.QualityControl.postQualityControlCollection({}, request).catch((reason) => {
      Logger.error('Could not upload QC to the QC server', reason);

      // For some reason we couldn't fetch information, just return, server probably down or something
      if (reason.message.includes('Failed to fetch') || reason.message.includes('NetworkError when attempting to fetch resource')) {
        return;
      }

      // If the order already exists, just ignore the error
      if (reason.message.includes('orderId: This value is already used')) {
        return;
      }

      // Add breadcrumb with actual request we did
      Sentry.addBreadcrumb({
        category: 'Swagger',
        message: 'postQualityControlCollection',
        data: { request, element },
        level: Sentry.Severity.Debug,
      });

      // Add breadcrumb with the error
      Sentry.addBreadcrumb({
        category: 'Swagger - Error',
        message: 'postQualityControlCollection',
        data: { error: reason },
        level: Sentry.Severity.Error,
      });

      // Swagger HTTP error
      if (typeof reason.response !== 'undefined') {
        Sentry.captureException(buildSwaggerHTTPError(reason.response));

        return;
      }

      Sentry.captureException(new Error('Could not upload QC to the QC server'));
    });
  }
}

class BaseTao {
  constructor() {
    this.setup = false;
  }

  /**
   * @param hostname {string}
   * @returns {boolean}
   */
  supports(hostname) {
    return hostname.includes('basetao.com');
  }

  /**
   * @returns {string}
   */
  name() {
    return 'BaseTao';
  }

  /**
   * @param client {Promise<SwaggerClient>}
   * @returns {Promise<BaseTao>}
   */
  async build(client) {
    // If already build before, just return
    if (this.setup) {
      return this;
    }

    // Get the username
    let username = $('[aria-labelledby="profileDropdown"] a:first').text();
    if (typeof username === 'undefined' || username == null || username === '') {
      Snackbar('You need to be logged in to use this extension.');
      throw new Error('You need to be logged in to use this extension.');
    }

    // Trim the username
    username = username.trim();

    // Hash the username (and add an extra space, since this was a bug in the past)
    const userHash = SparkMD5.hash(`${username} `);

    // Ensure we know who triggered errors
    Sentry.setUser({ id: userHash, username });

    // Build all the clients
    this.imgurClient = new Imgur(GM_info.script.version, GM_config, this.name());
    this.qcClient = new QC(GM_info.script.version, await client, userHash, username, this.name());

    // Mark that this agent has been set up
    this.setup = true;

    return this;
  }

  /**
   * @return {Promise<void>}
   */
  async process() {
    if (this.setup === false) {
      throw new Error('Agent is not setup, so cannot be used');
    }

    // Make copy of the current this, so we can use it later
    const agent = this;

    // Get the container (unsafe, because we want the actual jQuery table)
    const $container = window.unsafeWindow.jQuery('#table').first();

    // Start processing once the table has been loaded
    elementReady('.details-tr i.bi.bi-image-fill').then(() => {
      const rowData = $container.bootstrapTable('getData');
      $container.find('i.bi.bi-image-fill').each(function () {
        const $element = $(this);
        const orderId = $element.parents('td').find('[data-row]').data('row');
        agent._buildElement($element, rowData.find(agent._getRowData(orderId)));
      });

      $container.on('load-success.bs.table', (event, data) => {
        $container.find('i.bi.bi-image-fill').each(function () {
          const $element = $(this);
          const orderId = $element.parents('td').find('[data-row]').data('row');
          agent._buildElement($(this), data.rows.find(agent._getRowData(orderId)));
        });
      });

      // Ensure tooltips
      $container.tooltip({ selector: '.qc-tooltip' });
    });
  }

  /**
   * @private
   * @param $this
   * @param {RowData} data
   * @return {Promise<BaseTaoElement>}
   */
  async _buildElement($this, data) {
    const element = new BaseTaoElement($this, data);
    const $imageIcon = element.element.parents('a').first();

    // Append download button if enabled
    if (GM_config.get('showImagesDownloadButton')) {
      const $download = $('<span style="cursor: pointer;padding-left: 5px;" class="bi bi-download text-orange" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Download all photos"></span>');
      $download.on('click', () => this._downloadHandler($download, element));
      $imageIcon.parent().append($download);
    }

    // This plugin only works for certain websites, so check if element is supported
    if (element.website === WEBSITE_UNKNOWN) {
      const $upload = $(`<div><span style="cursor: pointer;"><img src="${ImgurIcon}" alt="Create a basic album"></span></div>`);
      $upload.find('span').first().after($('<span class="qc-marker qc-tooltip" style="cursor:help;margin-left:5px;color:red;font-weight: bold;" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Not a supported URL, but you can still create an album. The QC\'s are not stored and you\'ll have to create a new album if you lose the link.">✖</span>'));
      $upload.on('click', () => {
        this._uploadHandler(element);
      });

      $this.parents('td').first().append($upload);

      return element;
    }

    const $loading = $(`<div><span class="qc-tooltip" style="cursor: wait;" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Loading..."><img src="${Loading}" alt="Loading..."></span></div>`);
    $this.parents('td').first().append($loading);

    // Define upload object
    const $upload = $(`<div><span class="qc-marker qc-tooltip" style="cursor: pointer;" style="cursor: wait;" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Upload your QC"><img src="${ImgurIcon}" alt="Upload your QC"></span></div>`);

    // If we couldn't talk to FR:Reborn, assume everything is dead and use the basic uploader.
    const albumId = await this.qcClient.existingAlbumByOrderId(element);
    if (albumId === '-1') {
      $upload.find('span').first().html($('<span class="qc-marker qc-tooltip" style="cursor:help;color:red;font-weight: bold;" data-bs-toggle="tooltip" data-bs-placement="bottom" title="FR:Reborn returned an error or could not load your album.">⚠️</span>'));

      $this.parents('td').first().append($upload);
      $loading.remove();

      return element;
    }

    // Have you ever uploaded a QC? If so, link to that album
    const $image = $upload.find('img');
    if (albumId !== null && albumId !== '-1') {
      $upload.find('span').first().after($('<span class="qc-marker qc-tooltip" style="cursor:help;margin-left:5px;color:green;font-weight: bold;" data-bs-toggle="tooltip" data-bs-placement="bottom" title="You have uploaded a QC">✓</span>'));
      $image.wrap(`<a href='${element.albumUrl}' target='_blank' data-bs-toggle="tooltip" data-bs-placement="bottom" title='Go to album'></a>`);
      $image.removeAttr('title');

      $this.parents('td').first().append($upload);
      $loading.remove();

      return element;
    }

    // Has anyone ever uploaded a QC, if not, show a red marker
    const exists = await this.qcClient.exists(element.purchaseUrl);
    if (!exists) {
      $upload.find('span').first().after($('<span class="qc-marker qc-tooltip" style="cursor:help;margin-left:5px;color:red;font-weight: bold;" data-bs-toggle="tooltip" data-bs-placement="bottom" title="No QC in database, please upload.">(!)</span>'));
      $upload.on('click', () => {
        this._uploadHandler(element);
      });

      $this.parents('td').first().append($upload);
      $loading.remove();

      return element;
    }

    // A previous QC exists, but you haven't uploaded yours yet, show orange marker
    $upload.find('span').first().after($('<span class="qc-marker qc-tooltip" style="cursor:help;margin-left:5px;color:orange;font-weight: bold;" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Your QC is not yet in the database, please upload.">(!)</span>'));
    $upload.on('click', () => {
      this._uploadHandler(element);
    });

    $this.parents('td').first().append($upload);
    $loading.remove();

    return element;
  }

  /**
   * @private
   * @param element {BaseTaoElement}
   * @returns {Promise<void>}
   */
  async _uploadToImgur(element) {
    if (this.setup === false) {
      throw new Error('Agent is not setup, so cannot be used');
    }

    if (element.imageUrls.length === 0) {
      Snackbar(`No pictures found for order ${element.orderId}, skipping,..`);
      return;
    }

    const $processing = $(`<span style="cursor: wait;"><img src="${Loading}" alt="Processing..."></span>`);
    const $base = element.element.parents('td').first().find('div').first();
    $base.after($processing).hide();

    // Start the process
    Snackbar(`Pictures for '${element.orderId}' are being uploaded...`);

    // Temp store deleteHash
    let deleteHash;

    try {
      // Create the album
      const response = await this.imgurClient.CreateAlbum(element);
      if (typeof response === 'undefined' || response == null) {
        return;
      }

      // Extract and build information needed
      deleteHash = response.data.deletehash;
      const albumId = response.data.id;

      // Upload all QC images
      const promises = [];
      $.each(element.imageUrls, (key, imageUrl) => {
        // Convert to base64, since Imgur cannot access our images
        promises.push(toDataURL(imageUrl).then(async (data) => {
          // Store our base64 and if the file is WEBP, convert it to JPG
          let base64Image = data;
          if (base64Image.indexOf('image/webp') !== -1) {
            base64Image = await WebpToJpg(base64Image);
          }

          // Remove the unnecessary `data:` part
          const cleanedData = base64Image.replace(/(data:image\/.*;base64,)/, '');

          // Upload the image to the album
          return this.imgurClient.AddBase64ImageToAlbum(cleanedData, deleteHash, element.purchaseUrl);
        }));
      });

      // Wait until everything has been tried to be uploaded
      await Promise.all(promises);

      // Set albumId in element, so we don't upload it again (when doing a pending haul upload)
      element.albumId = albumId; // eslint-disable-line no-param-reassign

      // Tell the user it was uploaded and open the album in the background
      Snackbar('Pictures have been uploaded!', 'success');
      GM_openInTab(element.albumUrl, true);

      // Tell QC Suite about our uploaded QC's (if it's supported)
      if (element.website !== WEBSITE_UNKNOWN) {
        this.qcClient.uploadQc(element, albumId);
      }

      // Wrap the logo in a href to the new album
      const $image = $base.find('img');
      $image.wrap(`<a href='${element.albumUrl}' target='_blank' data-bs-toggle="tooltip" data-bs-placement="bottom" title='Go to album'></a>`);
      $image.removeAttr('title');

      // Remove processing
      $processing.remove();

      // Update the marker
      const checkMarkMessage = element.website !== WEBSITE_UNKNOWN ? 'You have uploaded a QC' : 'Album has been created';
      const $qcMarker = $base.find('.qc-marker:not(:first-child)').first();
      $qcMarker.attr('title', checkMarkMessage)
        .css('cursor', 'help')
        .css('color', 'green')
        .text('✓');

      // Remove the click handler
      $base.off();

      // Show it again
      $base.show();
    } catch (err) {
      // Remove the created album
      this.imgurClient.RemoveAlbum(deleteHash);

      // Reset the button
      $processing.remove();
      $base.show();

      // Show the error
      Snackbar(err.message, 'error');

      // If it's the slow down error, don't log it
      if (err instanceof ImgurSlowdownError) {
        return;
      }

      // Log the error
      Sentry.captureException(err);
      Logger.error(err);
    }
  }

  /**
   * @private
   * @param $download
   * @param element {BaseTaoElement}
   */
  async _downloadHandler($download, element) {
    if (this.setup === false) {
      throw new Error('Agent is not setup, so cannot be used');
    }

    if (!await ConfirmDialog()) {
      return;
    }

    // Remove button so people don't do dumb shit
    $download.remove();

    // Go to the QC pictures URL, grab all image sources and upload the element
    await $.get(element.qcImagesUrl).then(async (data) => {
      if (data.indexOf('long time no operation ,please sign in again') !== -1) {
        Snackbar('You are no longer logged in, reloading page....', 'warning');
        Logger.info('No longer logged in, reloading page for user...');
        window.location.reload();

        return null;
      }

      Snackbar('Zipping images, this might take a while....', 'info');

      // Create a zip file writer
      const zipWriter = new zip.ZipWriter(new zip.Data64URIWriter('application/zip'));

      // Download all the images and add to the zip
      const promises = [];
      $('<div/>').html(data).find('.card > img').each(function () {
        const src = $(this).attr('src');
        promises.push(new Promise((resolve) => toDataURL(src)
          .then((dataURI) => zipWriter.add(src.substring(src.lastIndexOf('/') + 1), new zip.Data64URIReader(dataURI)))
          .then(() => resolve())));
      });

      // Wait for all images to be added to the ZIP
      await Promise.all(promises);

      // Close the ZipWriter object and download to computer
      saveAs(await zipWriter.close(), `${element.orderId}.zip`);

      Snackbar(`Downloading ${element.orderId}.zip`, 'success');

      return null;
    }).catch((err) => {
      Snackbar(`Could not get all images for order ${element.orderId}`);
      Logger.error(`Could not get all images for order ${element.orderId}`, err);
    });
  }

  /**
   * @private
   * @param element {BaseTaoElement}
   * @returns {Promise<void>}
   */
  async _uploadHandler(element) {
    if (this.setup === false) {
      throw new Error('Agent is not setup, so cannot be used');
    }

    // Go to the QC pictures URL, grab all image sources and upload the element
    await $.get(element.qcImagesUrl).then(async (data) => {
      if (data.indexOf('long time no operation ,please sign in again') !== -1) {
        Snackbar('You are no longer logged in, reloading page....', 'warning');
        Logger.info('No longer logged in, reloading page for user...');
        window.location.reload();

        return null;
      }

      // Add all image urls to the element
      $('<div/>').html(data).find('main div.container.container img').each(function () {
        element.imageUrls.push($(this).attr('src'));
      });

      // Finally go and upload the order
      return this._uploadToImgur(element);
    }).catch((err) => {
      Snackbar(`Could not get all images for order ${element.orderId}`);
      Logger.error(`Could not get all images for order ${element.orderId}`, err);
    });
  }

  /**
   * @private
   * @param orderId
   */
  _getRowData(orderId) {
    return (item) => Number(item.oid) === Number(orderId);
  }
}

class CSSBuyElement {
  constructor($element) {
    this.element = $element;

    // Create empty array for images
    this.imageUrls = [];

    // Temporary items
    const parentTableEntry = $element.parentsUntil('tbody');
    const itemLink = parentTableEntry.find('td.tabletd3 > a');
    const splitText = parentTableEntry.find('td.tabletd3 > span:nth-child(3)').html().split('<br>');

    // Order details
    this.orderId = this.element.parent().attr('data-id');

    // Item name
    this.title = truncate(removeWhitespaces(itemLink.text()), 255);

    // Purchase details
    this.website = determineWebsite(itemLink.attr('href'));
    this.purchaseUrl = cleanPurchaseUrl(itemLink.attr('href'), this.website);

    // Item price
    this.itemPrice = `CNY ${removeWhitespaces(parentTableEntry.find('td:nth-child(4) > span:nth-child(1)').text())}`;

    // Freight price
    this.freightPrice = `CNY ${removeWhitespaces(parentTableEntry.find('td:nth-child(5) span').text())}`;

    // Item weight
    const weight = removeWhitespaces(parentTableEntry.find('td:nth-child(7) span').text());
    this.weight = weight.length !== 0 ? `${weight} gram` : null;

    // Item sizing and color (if any)
    this.color = null;
    this.sizing = null;

    try {
      if (splitText.length === 1) {
        let color = splitText[0].split(' : ')[1];
        color = (typeof color !== 'undefined' && color !== '-' && color.toLowerCase() !== 'no') ? truncate(color, 255) : '';
        this.color = color.length !== 0 ? color : null;
      } else if (splitText.length === 2) {
        let sizing = (splitText[0].split(' : ')[1]);
        sizing = (typeof sizing !== 'undefined' && sizing !== '-' && sizing.toLowerCase() !== 'no') ? truncate(sizing, 255) : '';
        this.sizing = sizing.length !== 0 ? sizing : null;

        let color = (splitText[1].split(' : ')[1]);
        color = (typeof color !== 'undefined' && color !== '-' && color.toLowerCase() !== 'no') ? truncate(color, 255) : '';
        this.color = color.length !== 0 ? color : null;
      } else if (splitText.length !== 0) {
        this.sizing = splitText.join('\n');
      }
    } catch (e) {
      Logger.info('Could not figure out sizing/color', e);
    }

    // Set at a later date, if ever
    this.albumId = null;
  }

  /**
   * @return {string}
   */
  get albumUrl() {
    return `https://imgur.com/a/${this.albumId}`;
  }
}

/* eslint-disable no-return-await */
class OSS {
  constructor() {
    this.setup = false;
    this.window = window.unsafeWindow;
  }

  async build() {
    if (this.setup) {
      return this;
    }

    // Try and build the OSS client
    try {
      // Grab the OSS client
      const WindowOSS = await this._waitForValue('OSS');

      // Build the config for the bucket
      const config = {
        region: await this._waitForValue('c_region'),
        accessKeyId: await this._waitForValue('c_accessid'),
        accessKeySecret: await this._waitForValue('c_accesskey'),
        bucket: await this._waitForValue('c_bucket'),
        endpoint: `https://${await this._waitForValue('c_region')}.aliyuncs.com/`,
      };

      // Log the config, for ease of use
      Logger.info('OSS config build', config);

      // Set up the bucket for easy use
      this.window.client = new WindowOSS.Wrapper(config);

      // Mark as ready
      this.setup = true;
    } catch (e) {
      throw new Error(e);
    }

    return this;
  }

  /**
   * @param {string} orderId
   *
   * @return Promise<object>
   */
  async list(orderId) {
    if (this.setup === false) {
      throw new Error('OSS is not setup, so cannot be used');
    }

    return await this.window.client.list({
      'max-keys': 100,
      prefix: `o/${orderId}/`,
    });
  }

  _waitForValue(value) {
    return new Promise((resolve) => {
      // Check if the element already exists
      if (this.window[value]) {
        resolve(this.window[value]);

        return;
      }

      const _waitForGlobal = () => {
        if (this.window[value]) {
          resolve(this.window[value]);

          return;
        }

        // Wait until we have it
        setTimeout(() => { _waitForGlobal(value, resolve); }, 100);
      };

      // It doesn't so, so let's start waiting for it
      _waitForGlobal(value, resolve);
    });
  }
}

class CSSBuy {
  constructor() {
    this.setup = false;
  }

  /**
  * @param hostname {string}
  * @returns {boolean}
  */
  supports(hostname) {
    return hostname.includes('cssbuy.com');
  }

  /**
   * @returns {string}
   */
  name() {
    return 'CSSBuy';
  }

  /**
   * @param client {Promise<SwaggerClient>}
   * @returns {Promise<CSSBuy>}
   */
  async build(client) {
    // If already build before, just return
    if (this.setup) {
      return this;
    }

    // Get the username
    const username = removeWhitespaces($(await $.get('/?go=m')).find('.userxinix > div:nth-child(1) > p').text());
    if (typeof username === 'undefined' || username == null || username === '') {
      Snackbar('You need to be logged in to use this extension.');

      return this;
    }

    // Ensure we know who triggered the error
    const userHash = SparkMD5.hash(username);
    Sentry.setUser({ id: userHash, username });

    // Build all the clients
    this.imgurClient = new Imgur(GM_info.script.version, GM_config, this.name());
    this.qcClient = new QC(GM_info.script.version, await client, userHash, username, this.name());

    // Mark that this agent has been set up
    this.setup = true;

    return this;
  }

  async process() {
    if (this.setup === false) {
      throw new Error('Agent is not setup, so cannot be used');
    }

    // Make copy of the current this, so we can use it later
    const agent = this;

    // If there is nothing to process, just return here (so we don't try to build the OSS client and die)
    const $elements = $(".oss-photo-view-button > a:contains('QC PIC')");
    if ($elements.length === 0) {
      return;
    }

    // Build OSS client
    this.ossClient = new OSS();
    await this.ossClient.build();

    if (this.ossClient.setup === false) {
      Snackbar('Could not build the OSS client, check the console for errors.');
    }

    // Add icons to all elements
    $elements.each(function () { agent._buildElement($(this)); });
  }

  /**
   * @private
   * @param $this
   * @return {Promise<void>}
   */
  async _buildElement($this) {
    const element = new CSSBuyElement($this);

    // Check if it has any images to begin with
    const result = await this.ossClient.list(element.orderId);
    if (typeof result.objects === 'undefined') {
      return;
    }

    // This plugin only works for certain websites, so check if element is supported
    if (element.website === WEBSITE_UNKNOWN) {
      const $upload = $(`<ul class="badge-lists"><li style="cursor: pointer"><img src="${ImgurIcon}" alt="Create a basic album" style="width: 100%"></li></ul>`);
      $upload.find('li').first().after($('<li class="btn btn-xs qc-marker" style="cursor:help;color:red;font-weight: bold;" title="Not a supported URL, but you can still create an album. The QC\'s are not stored and you\'ll have to create a new album if you lose the link.">✖</li>'));
      $upload.on('click', () => { this._uploadToImgur(element); });

      $this.parents('ul').first().after($upload);

      return;
    }

    // Define column in which to show buttons
    const $other = $this.parents('ul').first();

    // Show simple loading animation
    const $loading = $(`<ul class="badge-lists"><li style="cursor: wait"><img src="${Loading}" alt="Loading..." style="width: 100%"></li></ul>`);
    $other.after($loading);

    // Define upload object
    const $upload = $(`<ul class="badge-lists"><li class="btn btn-xs qc-marker" style="cursor: pointer"><img src="${ImgurIcon}" alt="Upload your QC"  style="width: 100%"></li></ul>`);

    // If we couldn't talk to FR:Reborn, assume everything is dead and use the basic uploader.
    const albumId = await this.qcClient.existingAlbumByOrderId(element);
    if (albumId === '-1') {
      $upload.find('li').first().after($('<li class="btn btn-xs qc-marker" style="cursor:help;color:red;font-weight: bold;" title="FR:Reborn returned an error, but you can still create an album. The QC\'s are not stored and you\'ll have to create a new album if you lose the link.">⚠️</li>'));
      $upload.on('click', () => { this._uploadToImgur(element); });

      $other.after($upload);
      $loading.remove();

      return;
    }

    // Have you ever uploaded a QC? If so, link to that album
    const $image = $upload.find('img');
    if (albumId !== null && albumId !== '-1') {
      $upload.find('li').first().after($('<li class="btn btn-xs qc-marker" style="cursor:help;color:green;font-weight: bold;" title="You have uploaded a QC">✓</li>'));
      $image.wrap(`<a href='https://imgur.com/a/${albumId}' target='_blank' title='Go to album'></a>`);
      $image.removeAttr('title');

      $other.after($upload);
      $loading.remove();

      return;
    }

    // Has anyone ever uploaded a QC, if not, show a red marker
    const exists = await this.qcClient.exists(element.purchaseUrl);
    if (!exists) {
      $upload.find('li').first().after($('<li class="btn btn-xs qc-marker" style="cursor:help;color:red;font-weight: bold;" title="No QC in database, please upload.">(!)</li>'));
      $upload.on('click', () => { this._uploadToImgur(element); });

      $other.after($upload);
      $loading.remove();

      return;
    }

    // A previous QC exists, but you haven't uploaded yours yet, show orange marker
    $upload.find('li').first().after($('<li class="btn btn-xs qc-marker" style="cursor:help;color:orange;font-weight: bold;" title="Your QC is not yet in the database, please upload.">(!)</li>'));
    $upload.on('click', () => { this._uploadToImgur(element); });

    $other.after($upload);
    $loading.remove();
  }

  /**
   * @param element {CSSBuyElement}
   * @returns {Promise<void>}
   */
  async _uploadToImgur(element) {
    if (this.setup === false) {
      throw new Error('Agent is not setup, so cannot be used');
    }

    const $processing = $(`<ul class="badge-lists"><li style="cursor: wait"><img src="${Loading}" alt="Processing..." style="width: 100%"></li></ul>`);
    const $base = element.element.parents('td').first().find('.badge-lists');
    $base.after($processing).hide();

    const result = await this.ossClient.list(element.orderId);
    if (typeof result.objects === 'undefined') {
      Snackbar(`No pictures found for order ${element.orderId}, skipping,..`);
      return;
    }

    result.objects.forEach((item) => {
      element.imageUrls.push((item.url));
    });

    if (element.imageUrls.length === 0) {
      Snackbar(`No pictures found for order ${element.orderId}, skipping,..`);
      return;
    }

    // Start the process
    Snackbar(`Pictures for '${element.orderId}' are being uploaded...`);

    // Temp store deleteHash
    let deleteHash;

    try {
      // Create the album
      const response = await this.imgurClient.CreateAlbum(element);
      if (typeof response === 'undefined' || response == null) {
        return;
      }

      // Extract and build information needed
      deleteHash = response.data.deletehash;
      const albumId = response.data.id;

      // Upload all QC images
      const promises = [];
      $.each(element.imageUrls, (key, imageUrl) => {
        promises.push(this.imgurClient.AddImageToAlbum(imageUrl, deleteHash, element.purchaseUrl));
      });

      // Wait until everything has been tried to be uploaded
      await Promise.all(promises);

      // Set albumId in element, so we don't upload it again (when doing a pending haul upload)
      element.albumId = albumId; // eslint-disable-line no-param-reassign

      // Tell the user it was uploaded and open the album in the background
      Snackbar('Pictures have been uploaded!', 'success');
      GM_openInTab(element.albumUrl, true);

      // Tell QC Suite about our uploaded QC's (if it's supported)
      if (element.website !== WEBSITE_UNKNOWN) {
        this.qcClient.uploadQc(element, albumId);
      }

      // Wrap the logo in a href to the new album
      const $image = $base.find('img');
      $image.wrap(`<a href='${element.albumUrl}' target='_blank' title='Go to album'></a>`);
      $image.removeAttr('title');

      // Remove processing
      $processing.remove();

      // Update the marker
      const checkMarkMessage = element.website !== WEBSITE_UNKNOWN ? 'You have uploaded a QC' : 'Album has been created';
      const $qcMarker = $base.find('.qc-marker:not(:first-child)').first();
      $qcMarker.attr('title', checkMarkMessage)
        .css('cursor', 'help')
        .css('color', 'green')
        .text('✓');

      // Remove the click handler
      $base.off();

      // Show it again
      $base.show();
    } catch (err) {
      // Remove the created album
      this.imgurClient.RemoveAlbum(deleteHash);

      // Reset the button
      $processing.remove();
      $base.show();

      // Show the error
      Snackbar(err.message, 'error');

      // If it's the slow down error, don't log it
      if (err instanceof ImgurSlowdownError) {
        return;
      }

      // Log the error
      Sentry.captureException(err);
      Logger.error(err);
    }
  }
}

class WeGoBuyElement {
  constructor($element) {
    this.element = $element;

    // Order details
    this.orderId = removeWhitespaces($element.find('td:nth-child(1) > p').text());
    this.imageUrls = $element.find('.lookPic').map((key, value) => $(value).attr('href')).get();

    // Item name
    this.title = truncate(removeWhitespaces($element.find('.js-item-title').text()), 255);

    // Item sizing (if any)
    const sizing = removeWhitespaces($element.find('.user_orderlist_txt').text());
    this.sizing = sizing.length !== 0 ? truncate(sizing, 255) : null;

    // Item color (WeGoBuy doesn't support separation of color, so just null)
    this.color = null;

    // Item price
    const itemPriceMatches = truncate(removeWhitespaces($element.parents('tbody').find('tr > td:nth-child(2)').text()), 255).match(/([A-Z]{2})\W+([.,0-9]+)/);
    this.itemPrice = `${itemPriceMatches[1]} ${itemPriceMatches[2]}`;

    // Freight price
    const freightPriceMatches = truncate(removeWhitespaces($element.parents('tbody').find('tr:nth-child(1) > td:nth-child(8) > p:nth-child(2)').text()), 255).match(/([A-Z]{2})\W+([.,0-9]+)/);
    this.freightPrice = `${freightPriceMatches[1]} ${freightPriceMatches[2]}`;

    // Item weight
    this.weight = null;

    // Purchase details
    const possibleUrl = removeWhitespaces($element.find('.js-item-title').attr('href')).trim();
    this.url = isUrl(possibleUrl) ? possibleUrl : '';
    this.website = determineWebsite(this.url);

    // Set at a later date, if ever
    this.albumId = null;
  }

  /**
   * @return {string}
   */
  get albumUrl() {
    return `https://imgur.com/a/${this.albumId}`;
  }

  /**
   * @param imageUrls {string[]}
   */
  set images(imageUrls) {
    this.imageUrls = imageUrls;
  }

  /**
   * @returns {string}
   */
  get purchaseUrl() {
    return cleanPurchaseUrl(this.url, this.website);
  }
}

class WeGoBuy {
  constructor() {
    this.setup = false;
  }

  /**
   * @param hostname {string}
   * @returns {boolean}
   */
  supports(hostname) {
    return hostname.includes('wegobuy.com')
      || hostname.includes('superbuy.com');
  }

  /**
   * @returns {string}
   */
  name() {
    return 'WeGoBuy';
  }

  /**
   * @param client {Promise<SwaggerClient>}
   * @returns {Promise<WeGoBuy>}
   */
  async build(client) {
    // If already build before, just return
    if (this.setup) {
      return this;
    }

    // Ensure the toast looks decent on SB/WGB
    GM_addStyle('.swal2-popup.swal2-toast .swal2-title {font-size: 1em; font-weight: bolder}');

    // Get the username
    const username = (await $.get('/ajax/user-info')).data.user_name;
    if (typeof username === 'undefined' || username == null || username === '') {
      Snackbar('You need to be logged in to use this extension.');

      return this;
    }

    // Ensure we know who triggered the error
    const userHash = SparkMD5.hash(username);
    Sentry.setUser({ id: userHash, username });

    // Build all the clients
    this.imgurClient = new Imgur(GM_info.script.version, GM_config, this.name());
    this.qcClient = new QC(GM_info.script.version, await client, userHash, username, this.name());

    // Mark that this agent has been setup
    this.setup = true;

    return this;
  }

  async process() {
    if (this.setup === false) {
      throw new Error('Agent is not setup, so cannot be used');
    }

    // Make copy of the current this, so we can use it later
    const agent = this;

    // Add icons to all elements
    $('.pic-list.j_picList').each(function () {
      agent._buildElement($(this).parents('tr'));
    });
  }

  /**
   * @private
   * @param $this
   * @return {Promise<void>}
   */
  async _buildElement($this) {
    const element = new WeGoBuyElement($this);

    // No pictures (like rehearsal orders), no QC options
    if (element.imageUrls.length === 0) {
      return;
    }

    // Define column in which to download button
    const $inspection = $this.find('td:nth-child(6)').first();

    // Append download button if enabled
    if (GM_config.get('showImagesDownloadButton')) {
      const $download = $('<div style="padding:5px;"><p><span style="color: rgb(255, 140, 60);cursor: pointer;margin-top: 5px;">Download</span></p></div>');
      $download.on('click', () => this._downloadHandler($download, element));
      $inspection.append($download);
    }

    // This plugin only works for certain websites, so check if element is supported
    if (element.website === WEBSITE_UNKNOWN || element.url.length === 0) {
      const $upload = $(`<div style="padding:5px;"><span style="cursor: pointer;"><img src="${ImgurIcon}" alt="Create a basic album"></span></div>`);
      $upload.find('span').first().after($('<span class="qc-marker" style="cursor:help;margin-left:5px;color:red;font-weight: bold;" title="Not a supported URL, but you can still create an album. The QC\'s are not stored and you\'ll have to create a new album if you lose the link.">✖</span>'));
      $upload.on('click', () => {
        this._uploadToImgur(element);
      });

      $inspection.append($upload);

      return;
    }

    // Show simple loading animation
    const $loading = $(`<div style="padding:5px;"><span style="cursor: wait;"><img src="${Loading}" alt="Loading..."></span></div>`);
    $inspection.append($loading);

    // Define upload object
    const $upload = $(`<div style="padding:5px;"><span class="qc-marker" style="cursor: pointer;"><img src="${ImgurIcon}" alt="Upload your QC"></span></div>`);

    // If we couldn't talk to FR:Reborn, assume everything is dead and use the basic uploader.
    const albumId = await this.qcClient.existingAlbumByOrderId(element);
    if (albumId === '-1') {
      $upload.find('span').first().after($('<span class="qc-marker" style="cursor:help;margin-left:5px;color:red;font-weight: bold;" title="FR:Reborn returned an error, but you can still create an album. The QC\'s are not stored and you\'ll have to create a new album if you lose the link.">⚠️</span>'));
      $upload.on('click', () => {
        this._uploadToImgur(element);
      });

      $inspection.append($upload);
      $loading.remove();

      return;
    }

    // Have you ever uploaded a QC? If so, link to that album
    const $image = $upload.find('img');
    if (albumId !== null && albumId !== '-1') {
      $upload.find('span').first().after($('<span class="qc-marker" style="cursor:help;margin-left:5px;color:green;font-weight: bold;" title="You have uploaded a QC">✓</span>'));
      $image.wrap(`<a href='https://imgur.com/a/${albumId}' target='_blank' title='Go to album' style="display: initial;"></a>`);
      $image.removeAttr('title');

      $inspection.append($upload);
      $loading.remove();

      return;
    }

    // Has anyone ever uploaded a QC, if not, show a red marker
    const exists = await this.qcClient.exists(element.purchaseUrl);
    if (!exists) {
      $upload.find('span').first().after($('<span class="qc-marker" style="cursor:help;margin-left:5px;color:red;font-weight: bold;" title="No QC in database, please upload.">(!)</span>'));
      $upload.on('click', () => {
        this._uploadToImgur(element);
      });

      $inspection.append($upload);
      $loading.remove();

      return;
    }

    // A previous QC exists, but you haven't uploaded yours yet, show orange marker
    $upload.find('span').first().after($('<span class="qc-marker" style="cursor:help;margin-left:5px;color:orange;font-weight: bold;" title="Your QC is not yet in the database, please upload.">(!)</span>'));
    $upload.on('click', () => {
      this._uploadToImgur(element);
    });

    $inspection.append($upload);
    $loading.remove();
  }

  /**
   * @private
   * @param $download
   * @param element {WeGoBuyElement}
   */
  async _downloadHandler($download, element) {
    if (this.setup === false) {
      throw new Error('Agent is not setup, so cannot be used');
    }

    if (!await ConfirmDialog()) {
      return;
    }

    // Remove button so people don't do dumb shit
    $download.remove();

    Snackbar('Zipping images, this might take a while....', 'info');

    // Create a zip file writer
    const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'));

    // Download all the images and add to the zip
    const promises = [];
    $.each(element.imageUrls, (key, imageUrl) => {
      promises.push(toDataURL(imageUrl.replace('http://', 'https://'))
        .then((dataURI) => zipWriter.add(imageUrl.substring(imageUrl.lastIndexOf('/') + 1), new zip.Data64URIReader(dataURI))));
    });

    // Wait for all images to be added to the ZIP
    await Promise.all(promises);

    // Close the ZipWriter object and download to computer
    saveAs(await zipWriter.close(), `${element.orderId}.zip`);

    Snackbar(`Downloading ${element.orderId}.zip`, 'success');
  }

  /**
   * @param element {WeGoBuyElement}
   * @returns {Promise<void>}
   */
  async _uploadToImgur(element) {
    if (this.setup === false) {
      throw new Error('Agent is not setup, so cannot be used');
    }

    const $processing = $(`<div style="padding:5px;"><span style="cursor: wait;"><img src="${Loading}" alt="Processing..."></span></div>`);
    const $options = element.element.find('td:nth-child(6)').first();
    const $base = $options.find('div').last();
    $base.after($processing).hide();

    // Start the process
    Snackbar(`Pictures for '${element.orderId}' are being uploaded...`);

    // Temp store deleteHash
    let deleteHash;

    try {
      // Create the album
      const response = await this.imgurClient.CreateAlbum(element);
      if (typeof response === 'undefined' || response == null) {
        return;
      }

      // Extract and build information needed
      deleteHash = response.data.deletehash;
      const albumId = response.data.id;

      // Upload all QC images
      const promises = [];
      $.each(element.imageUrls, (key, imageUrl) => {
        promises.push(this.imgurClient.AddImageToAlbum(imageUrl, deleteHash, element.purchaseUrl));
      });

      // Wait until everything has been tried to be uploaded
      await Promise.all(promises);

      // Set albumId in element, so we don't upload it again (when doing a pending haul upload)
      element.albumId = albumId; // eslint-disable-line no-param-reassign

      // Tell the user it was uploaded and open the album in the background
      Snackbar('Pictures have been uploaded!', 'success');
      GM_openInTab(element.albumUrl, true);

      // Tell QC Suite about our uploaded QC's (if it's supported)
      if (element.website !== WEBSITE_UNKNOWN) {
        this.qcClient.uploadQc(element, albumId);
      }

      // Remove processing
      $processing.remove();
      $base.remove();

      // Add new buttons
      const checkMarkMessage = element.website !== WEBSITE_UNKNOWN ? 'You have uploaded a QC' : 'Album has been created';
      $options.append($('<div style="padding:5px;">'
        + `<span class="qc-marker" style="cursor:pointer;"><a href='${element.albumUrl}' target='_blank' title='Go to album' style="display: initial;"><img src="${ImgurIcon}" alt="Go to album"></a></span>`
        + `<span class="qc-marker" style="cursor:help;margin-left:5px;color:green;font-weight: bold;" title="${checkMarkMessage}">✓</span>`
        + '</div>'));

      // Remove the click handler
      $base.off();

      // Show it again
      $base.show();
    } catch (err) {
      // Remove the created album
      this.imgurClient.RemoveAlbum(deleteHash);

      // Reset the button
      $processing.remove();
      $base.show();

      // Show the error
      Snackbar(err.message, 'error');

      // If it's the slow down error, don't log it
      if (err instanceof ImgurSlowdownError) {
        return;
      }

      // Log the error
      Sentry.captureException(err);
      Logger.error(err);
    }
  }
}

/**
 * @param hostname {string}
 *
 * @returns {BaseTao|CSSBuy|WeGoBuy|null}
 */
function getAgent(hostname) {
  const agents = [new BaseTao(), new CSSBuy(), new WeGoBuy()];

  let agent = null;
  Object.values(agents).forEach((value) => {
    if (agent == null && value.supports(hostname)) {
      agent = value;
    }
  });

  return agent;
}

// Inject snackbar css style
GM_addStyle(GM_getResourceText('sweetalert2'));

// Setup proper settings menu
GM_config.init('Settings', {
  serverSection: {
    label: 'QC Server settings',
    type: 'section',
  },
  swaggerDocUrl: {
    label: 'Swagger documentation URL',
    type: 'text',
    default: 'https://www.fashionreps.page/api/doc.json',
  },
  generalSection: {
    label: 'General options',
    type: 'section',
  },
  showImagesDownloadButton: {
    label: 'Show the images download button/text',
    type: 'checkbox',
    default: 'true',
  },
  uploadSection: {
    label: 'Upload API Options',
    type: 'section',
  },
  imgurApi: {
    label: 'Select your Imgur API',
    type: 'radio',
    default: 'imgur',
    options: {
      imgur: 'Imgur API (Free)',
      rapidApi: 'RapidAPI (Freemium)',
    },
  },
  imgurSection: {
    label: 'Imgur Options',
    type: 'section',
  },
  imgurApiHost: {
    label: 'Imgur host',
    type: 'text',
    default: 'api.imgur.com',
  },
  imgurClientId: {
    label: 'Imgur Client-ID',
    type: 'text',
    default: 'e4e18b5ab582b4c',
  },
  rapidApiSection: {
    label: 'RadidAPI Options',
    type: 'section',
  },
  rapidApiHost: {
    label: 'RapidAPI host',
    type: 'text',
    default: 'imgur-apiv3.p.rapidapi.com',
  },
  rapidApiKey: {
    label: 'RapidAPI key (only needed if RapidApi select above)',
    type: 'text',
    default: '',
  },
  rapidApiBearer: {
    label: 'RapidAPI access token (only needed if RapidApi select above)',
    type: 'text',
    default: '',
  },
});

// Reload page if config changed
GM_config.onclose = (saveFlag) => {
  if (saveFlag) {
    window.location.reload();
  }
};

// Register menu within GM
GM_registerMenuCommand('Settings', GM_config.open);

// Setup Sentry for proper error logging, which will make my lives 20x easier, use XHR since fetch dies.
Sentry.init({
  dsn: 'https://474c3febc82e44b8b283f23dacb76444@o740964.ingest.sentry.io/5802425',
  tunnel: 'https://www.fashionreps.page/sentry/tunnel',
  transport: Sentry.Transports.XHRTransport,
  release: GM_info.script.version,
  defaultIntegrations: false,
  integrations: [
    new Sentry.Integrations.InboundFilters(),
    new Sentry.Integrations.FunctionToString(),
    new Sentry.Integrations.LinkedErrors(),
    new Sentry.Integrations.UserAgent(),
  ],
  environment: 'production',
  normalizeDepth: 5,
});

// eslint-disable-next-line func-names
(async function () {
  // Setup the logger.
  Logger.useDefaults();

  // Log the start of the script.
  Logger.info(`Starting extension '${GM_info.script.name}', version ${GM_info.script.version}`);

  // Get the proper agent, if any
  const agent = getAgent(window.location.hostname);
  if (agent === null) {
    Sentry.captureMessage(`Unsupported website ${window.location.hostname}`);
    Logger.error('Unsupported website');

    return;
  }

  Logger.info(`Agent '${agent.name()}' detected`);

  // Finally, try to build the proper agent and process the page
  try {
    await agent.build(new SwaggerClient({ url: GM_config.get('swaggerDocUrl') }));
    await agent.process();
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('attempting to fetch resource')) {
      Snackbar('We are unable to connect to FR:Reborn, features will be disabled.');
      Logger.error(`We are unable to connect to FR:Reborn: ${GM_config.get('swaggerDocUrl')}`, error);

      return;
    }

    Snackbar(`An unknown issue has occurred when trying to setup the agent extension: ${error.message}`);
    Logger.error('An unknown issue has occurred', error);
  }
}());