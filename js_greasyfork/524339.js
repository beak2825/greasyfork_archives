// ==UserScript==
// @name         Google Street View Panorama Info
// @namespace    https://greasyfork.org/users/1340965-zecageo
// @version      1.19
// @description  Displays the country name, coordinates, panoId and share link for a given Google Street View panorama
// @author       ZecaGeo <zecageo@protonmail.com>
// @run-at       document-end
// @match        https://www.google.com/maps/*
// @match        https://www.google.at/maps/*
// @match        https://www.google.ca/maps/*
// @match        https://www.google.de/maps/*
// @match        https://www.google.fr/maps/*
// @match        https://www.google.it/maps/*
// @match        https://www.google.ru/maps/*
// @match        https://www.google.co.uk/maps/*
// @match        https://www.google.co.jp/maps/*
// @match        https://www.google.com.br/maps/*
// @exclude      https://ogs.google.com/
// @exclude      https://accounts.google.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @connect      nominatim.openstreetmap.org
// @license      MIT
// @copyright    2025, zecageo
// @downloadURL https://update.greasyfork.org/scripts/524339/Google%20Street%20View%20Panorama%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/524339/Google%20Street%20View%20Panorama%20Info.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const locationInfoSelector = '.a486Ib',
        titleCardSelector = '#titlecard';

  let zgDebugMode,
      zgSVPanorama;

  const init = () => {
    zgDebugMode = new ZGDebug(settings.debugMode);
    ZGDOM.waitForElement(locationInfoSelector, updateTitleCard, titleCardSelector);
  }

  const updateTitleCard = async (referenceElement) => {
    const lastChild = referenceElement.lastElementChild;
    zgSVPanorama = new ZGStreetViewPanorama();
    zgDebugMode.debug('zgSVPanorama:', zgSVPanorama);

    referenceElement.insertBefore(
      ZGDOM.cloneNode('zg-country', await countryName(zgSVPanorama.latitude, zgSVPanorama.longitude)),
      lastChild
    );
    referenceElement.insertBefore(
      ZGDOM.cloneNode('zg-lat',zgSVPanorama.latitude, true),
      lastChild
    );
    referenceElement.insertBefore(
      ZGDOM.cloneNode('zg-lng',zgSVPanorama.longitude, true),
      lastChild
    );
    referenceElement.insertBefore(ZGDOM.cloneNode('zg-panoid', zgSVPanorama.panoId, true), lastChild);

    if (!referenceElement) {
      zgDebugMode.error('Reference element not found.');
      return;
    }

    const shareLinkNode = referenceElement.insertBefore(
      ZGDOM.cloneNode('zg-sharelink', 'Click to generate a share link', true),
      lastChild
    );
    shareLinkNode.onclick = shareLinkOnClickHandler;

    ZGDOM.waitForElementRemoval('zg-panoid', () => {
      updateTitleCard(document.querySelector(locationInfoSelector));
    }, titleCardSelector);
  }

  const shareLinkOnClickHandler = async (event) => {
    await generatePanoramaShareLink(zgSVPanorama);
    zgDebugMode.debug('zgSVPanorama:', zgSVPanorama);
    event.target.innerText = zgSVPanorama.shareLink;
    GM_setClipboard(zgSVPanorama.shareLink);
  }

  const countryName = async (latitude, longitude) => {
    const currentEpochTime = Date.now();

    if (currentEpochTime - sessionStorage.lastOSMRequestTime < settings.osmRequestInterval) {
      zgDebugMode.debug('OSM request interval not reached. Retrieving country name from session storage.');
      zgDebugMode.debug('Country:', sessionStorage.country);
      return sessionStorage.country;
    }

    if (!latitude || !longitude) {
      zgDebugMode.error('Latitude/longitude is invalid or missing.');
      return defaultState.country;
    }

    const countryName = await requestCountryName(latitude, longitude);
    sessionStorage.country = countryName;
    sessionStorage.lastOSMRequestTime = currentEpochTime;
    return countryName;
  }

  const requestCountryName = async (latitude, longitude) => {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en-US`;
    const response = await ZGNetwork.promiseRequest(osmUrl);
    const data = JSON.parse(response.responseText);
    return data?.address?.country ?? defaultState.country;
  }

  const generatePanoramaShareLink = async () => {
    const response = await ZGNetwork.promiseRequest(zgSVPanorama.generateShareLinkRequestUrl());
    zgDebugMode.debug('Share link request response:', response);
    zgSVPanorama.parseShareLinkResponse(response.responseText);
  }

  /** Google Street View Panorama */
  class ZGStreetViewPanorama {
    url;
    latitude;
    longitude;
    panoId;
    thumb;
    fov;
    zoom;
    heading;
    pitch;
    shareLink;

    constructor() {
      this.#update();
    }

    #update() {
      this.url = window.location.href;
      const tempUrl = new URL(this.url);
      const pathname = tempUrl.pathname;
      let pathnameRegex = new RegExp(
        /@([^,]+),([^,]+),(\d+)a,([^y]+)y,([^h]+)h,([^t]+)t\/.*?!1s([^!]+)!2e/
      );
      let matches = pathnameRegex.exec(pathname);
      if (matches && matches.length === 8) {
        this.latitude = parseFloat(matches[1]);
        this.longitude = parseFloat(matches[2]);
        this.thumb = parseInt(matches[3]);
        this.fov = parseFloat(matches[4]);
        this.zoom = Math.log(180 / this.fov) / Math.log(2);
        this.heading = parseFloat(matches[5]);
        this.pitch = Math.round((parseFloat(matches[6]) - 90) * 100) / 100;
        this.panoId = matches[7];
        return;
      }

      // Sometimes the heading is missing in the URL, so ignore it in the regex expression
      if(!matches) {
        pathnameRegex = new RegExp(/@([^,]+),([^,]+),(\d+)a,([^y]+)y,([^t]+)t\/.*?!1s([^!]+)!2e/);
        matches = pathnameRegex.exec(pathname);
        if (matches && matches.length === 7) {
          this.latitude = parseFloat(matches[1]);
          this.longitude = parseFloat(matches[2]);
          this.thumb = parseInt(matches[3]);
          this.fov = parseFloat(matches[4]);
          this.zoom = Math.log(180 / this.fov) / Math.log(2);
          this.heading = 0; // Default heading
          this.pitch = Math.round((parseFloat(matches[5]) - 90) * 100) / 100;
          this.panoId = matches[6];
          return;
        }
      }

      // Check for panorama URL format, reload if needed
      // https://www.google.com/maps/@?api=1&map_action=pano&pano=N1urugTwzyUNI_u5MRHcCg
      // https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=45.571007921645005%2C25.280849505993164&heading=0&pitch=0&fov=180
      // pathnameRegex = new RegExp(
      //   /@?api=1&map_action=pano&viewpoint=([^,]+),([^,]+)&heading=([^&]+)&pitch=([^&]+)&fov=([^&]+)/
      // );
      const searchRegex = new RegExp(/\?api=1&map_action=pano/);
      const search = tempUrl.search;
      matches = searchRegex.exec(search);
      if(matches && matches.length > 0) {
        const params = new URLSearchParams(search);
        this.latitude = parseFloat(params.get('viewpoint').split(',')[0]);
        this.longitude = parseFloat(params.get('viewpoint').split(',')[1]);
        this.heading = parseFloat(params.get('heading')) || 0;
        this.pitch = parseFloat(params.get('pitch')) || 0;
        this.fov = parseFloat(params.get('fov')) || 180;
        this.panoId = params.get('pano') || null;
        this.thumb = 3;
        this.zoom = Math.log(180 / this.fov) / Math.log(2);

        if(!this.panoId) {
          this.panoId = 'No panoId. Refreshing the page...';
          setTimeout(() => {
            document.location.reload(true);
          }, 1500);
        }
        return;
      }

      console.error('Invalid Google Street View URL format.', this.url);
    }

    generateShareLinkRequestUrl = () => {
      this.#update();
      const encodedUrl = encodeURIComponent(this.url.replaceAll('!', '*21'));
      return `https://www.google.com/maps/rpc/shorturl?pb=!1s${encodedUrl}!2m1!7e81!6b1`;
    }

    parseShareLinkResponse = (response) => {
      this.shareLink = response.substring(7, response.length - 2);
    }
  }

  ZGStreetViewPanorama.prototype.toString = function () {
    return `
      Panorama: {
        panoId: ${this.panoId},
        latitude: ${this.latitude},
        longitude: ${this.longitude},
        thumb: ${this.thumb},
        fov: ${this.fov},
        zoom: ${this.zoom},
        heading: ${this.heading},
        pitch: ${this.pitch},
        shareLink: ${this.shareLink}
      }`;
  };

  /** DOM manipulation */
  class ZGDOM {
    static cloneNode(id, value, isClickable = false) {
      let h2Element = document.createElement('h2');
      h2Element.setAttribute('class', 'lsdM5 fontBodySmall');

      let divElement = document.createElement('div');
      divElement.appendChild(h2Element);
      divElement.id = id;

      let node = divElement.cloneNode(true);
      node.querySelector('h2').innerText = value;
      if (isClickable) {
        node.style.cursor = 'pointer';
        node.onclick = () => GM_setClipboard(value);
      }
      return node;
    }

    static waitForElement = (selector, callback, rootNode) => {
      new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const matchingElement = document.querySelector(selector);
            if (matchingElement) {
              observer.disconnect();
              callback(matchingElement);
              return;
            }
          }
        }
      }).observe(
        rootNode ? document.querySelector(rootNode) : document.body,
        {
          childList: true,
          subtree: true,
        }
      );
    };

    static waitForElementRemoval = (selectorId, callback, targetNode) => {
      new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const removedNodes = mutation.removedNodes;
            if (removedNodes.length > 0 &&
              removedNodes[0] instanceof Element &&
              removedNodes[0].id === selectorId) {
              zgDebugMode.debug('Removed node:\n', removedNodes[0]);
              observer.disconnect();
              callback();
              return;
            }
          }
        }
      }).observe(document.querySelector(targetNode),
        {
          childList: true,
          subtree: true,
        }
      );
    };
  }

  /** Networking */
  class ZGNetwork {
    static promiseRequest = (url, method = 'GET') => {
      if (!url) return Promise.reject('URL is empty');

      zgDebugMode.debug(
        [
          '---PROMISEREQUEST---',
          '\tmethod: ' + method,
          '\turl: ' + url,
          '---PROMISEREQUEST---',
        ].join('\n')
      );

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: method,
          url: url,
          onload: (result) => {
            this.responseInfo(result);
            if (result.status >= 200 && result.status < 300) {
              resolve(result);
            } else {
              reject(result.responseText);
            }
          },
          ontimeout: () => {
            let l = new URL(url);
            reject(
              ' timeout detected: "no answer from ' +
              l.host +
              ' for ' +
              l.timeout / 1000 +
              's"'
            );
          },
          onerror: (result) => {
            this.responseInfo(result);
            reject(
              ' error: ' + result.status + ', message: ' + result.statusText
            );
          },
        });
      });
    }

    static responseInfo = (response) => {
      zgDebugMode.debug(
        [
          '',
          'finalUrl: \t\t' + (response.finalUrl || '-'),
          'status: \t\t' + (response.status || '-'),
          'statusText: \t' + (response.statusText || '-'),
          'readyState: \t' + (response.readyState || '-'),
          'responseHeaders: ' +
          (response.responseHeaders.replaceAll('\response\n', ';') || '-'),
          'responseText: \t' + (response.responseText || '-'),
        ].join('\n')
      );
    }
  }

  /** Debugging */
  class ZGDebug {
    constructor(debugMode) {
      this.debugMode = debugMode;
    }

    #debugLog = (level, ...msg) => {
      if (this.debugMode) {
        console[level](...msg);
      }
    };

    debug = (...msg) => {
      this.#debugLog('log', ...msg);
    };

    warn = (...msg) => {
      this.#debugLog('warn', ...msg);
    };

    error = (...msg) => {
      this.#debugLog('error', ...msg);
    };
  }

   /** Settings */
   const defaultState = {
    debugMode: false,
    country: 'Country not found',
    lastOSMRequestTime: 0,
    osmRequestInterval: 30000, // 30 seconds
    reloadInterval: 2000, // 2 seconds
  };

  const settings = {
    get debugMode() {
      return GM_getValue('zgDebugMode', defaultState.debugMode);
    },
    set debugMode(value) {
      GM_setValue('zgDebugMode', value);
    },
    get osmRequestInterval() {
      return GM_getValue('zgOSMRequestInterval', defaultState.osmRequestInterval);
    },
    set osmRequestInterval(value) {
      GM_setValue('zgOSMRequestInterval', value);
    },
    get reloadInterval() {
      return GM_getValue('zgReloadInterval', defaultState.reloadInterval);
    },
    set reloadInterval(value) {
      GM_setValue('zgReloadInterval', value);
    },
  };

  /** Session storage */
  const sessionStorage = {
    get country() {
      return ZGSessionStorage.getItem('zgCountry', defaultState.country);
    },
    set country(value) {
      ZGSessionStorage.setItem('zgCountry', value);
    },
    get lastOSMRequestTime() {
      return ZGSessionStorage.getItem('zgLastOSMRequestTime', defaultState.lastOSMRequestTime);
    },
    set lastOSMRequestTime(value) {
      ZGSessionStorage.setItem('zgLastOSMRequestTime', value);
    }
  };

  class ZGSessionStorage {
    static getItem = (key, defaultValue = null) => {
      const value = window.sessionStorage.getItem(key);
      return value !== null ? value : defaultValue;
    }
    static setItem = (key, value) => {
      window.sessionStorage.setItem(key, value);
    }
  }

  init();
})();
