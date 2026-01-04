// ==UserScript==
// @name         RARBG Assistant
// @namespace    https://github.com/PoLaKoSz
// @version      1.8.3
// @description  Userscript for RARBG.to to make it more user friendly.
// @author       Tom PoLáKoSz
// @grant        none
// @icon         https://raw.githubusercontent.com/PoLaKoSz/RARBG-Assistant/master/assets/icon.png
// @run-at       document-start
// @include      https://rarbg.to/trailers.php*
// @downloadURL https://update.greasyfork.org/scripts/432946/RARBG%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/432946/RARBG%20Assistant.meta.js
// ==/UserScript==

'use strict';

class KeyDetector {
  isEscPressed(event) {
    event = event || window.event;
    if ("key" in event) {
        return event.key === "Escape" || event.key === "Esc";
    }

    return event.keyCode === 27;
  }
}

class RarbgAssistant {
  constructor() {
    this.requestCatcher = new XMLHttpRequestCatcher();
    this.trailersPage = new TrailersPage();
  }

  initalize() {
    this.requestCatcher.register("/ajax.php?mode=trailers&mode2=list", this.trailersPage);

    document.addEventListener('DOMContentLoaded', function() {
      const trailerWindow = new TrailerWindow();
      trailerWindow.float();
      trailerWindow.onOpen([
        {
          instance: trailerWindow,
          method: trailerWindow.addSearchButton,
        },
        {
          instance: trailerWindow,
          method: trailerWindow.fixOverlayForAdblockers,
        },
        {
          instance: trailerWindow,
          method: trailerWindow.hideScrollbar,
        },
      ]);
      trailerWindow.onClose([
        {
          instance: trailerWindow,
          method: trailerWindow.showScrollbar,
        },
      ]);

      document.onkeydown = function(event) {
        const keyDetector = new KeyDetector();
        if (keyDetector.isEscPressed(event)) {
          trailerWindow.close();
        }
      };
    });
  }
}

class TrailersPage {
  invoke(payload) {
    const trailerIds = payload.match(/(?<=id="trailer_)(\d+)/g);
    if (!trailerIds) {
      const message = 'Couldn\'t find any trailer Id!';
      console.log(message, { payload: payload });
      throw message;
    }

    trailerIds.forEach(id => {
      let trailerContainerNode = document.querySelector(`#trailer_${id}`);
      const anchors = trailerContainerNode.querySelectorAll("a");
      anchors.forEach(anchor => {
        let proxiedClick = anchor.onclick;
        anchor.onclick = function() {
          proxiedClick();
          return false;
        }
      })
    });
  }
}

class TrailerWindow {
  constructor() {
    this.trailerModalNode = document.querySelector("#trailer_modal");
    this.openEventSubscribers = [];
    this.closeEventSubscribers = [];
  }

  float() {
    document.body.appendChild(this.trailerModalNode);
    this.trailerModalNode.classList.add("trailer-modal");
  }

  close() {
    this.getCloseFunction()("#");
  }

  onOpen(actions) {
    this.openEventSubscribers = actions;
    this.attachEventToWindowOpen();
  }

  addSearchButton(self) {
    const titleContainerNode = self.trailerModalNode.querySelector("table:nth-child(3) > tbody > tr > td:nth-child(1)");
    const titleNode = titleContainerNode.querySelector("b");
    const button = `
      <span>
        <a href="https://rarbg.to/torrents.php?search=${titleNode.innerText}" target="_blank">
          <i class="icon-search"></i>
          Search for ${titleNode.innerText}
        </a>
      </span>
      `;
    titleContainerNode.innerHTML += button;
  }

  attachEventToWindowOpen() {
    const proxied = jQuery.fn.jqm;
    const eventSubscribers = this.openEventSubscribers;
    jQuery.fn.jqm = function() {
      arguments[0]['onLoad'] = function() {
        eventSubscribers.forEach(subscriber => {
          subscriber.method(subscriber.instance);
        });
      }

      return proxied.apply(this, arguments);
    };
  }

  fixOverlayForAdblockers() {
    const overlayNode = document.querySelector(".jqmOverlay");
    overlayNode.classList.remove("jqmOverlay");
    overlayNode.setAttribute("id", "jqmOverlay");
    overlayNode.style.backgroundColor = "#000";
    const instance = this.instance;
    overlayNode.onclick = function() {
      instance.close();
    }
  }

  hideScrollbar() {
    const originalWidth = document.body.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.width = `${originalWidth}px`;
  }

  showScrollbar() {
    document.body.style.overflow = "visible";
    document.body.style.width = "auto";
  }

  onClose(actions) {
    this.closeEventSubscribers = actions;
    this.attachEventToWindowClose();
  }
  
  attachEventToWindowClose() {
    const eventSubscribers = this.closeEventSubscribers;
    const proxied = this.getCloseFunction();
    window.closejqm = function() {
      eventSubscribers.forEach(subscriber => {
        subscriber.method(subscriber.instance);
      });

      return proxied.apply(this, arguments);
    };
  }

  getCloseFunction() {
    const closeFunction = window.closejqm;
    if (closeFunction === undefined) {
      throw "RARBG developers removed closejqm global function!";
    }

    return closeFunction;
  }
}

class XMLHttpRequestCatcher {
  constructor() {
    const proxied = window.XMLHttpRequest.prototype.send;
    const requestCatcher = this;
    window.XMLHttpRequest.prototype.send = function() {
      const request = this;
      const intervalId = window.setInterval(function() {
        if(request.readyState != 4) {
          return;
        }

        requestCatcher.invokeActionIfExists(request);
        clearInterval(intervalId);
      }, 1);
      return proxied.apply(this, [].slice.call(arguments));
    };
    this.lookupTable = {};
  }

  register(url, action) {
    url = new URL(`https://rarbg.to${url}`);
    this.lookupTable[url] = action;
  }

  invokeActionIfExists(request) {
    // sometimes responseURL is empty
    if (!request.responseURL) {
      return;
    }

    const requestURL = new URL(request.responseURL);
    Object.keys(this.lookupTable).forEach(key => {
      const registeredURL = new URL(key);
      if (registeredURL.pathname !== requestURL.pathname) {
        return;
      }

      const registeredSearchParams = Array.from(registeredURL.searchParams.keys());
      const requestSearchParams = Array.from(requestURL.searchParams.keys());
      if (registeredSearchParams.length > requestSearchParams.length) {
        return;
      }

      let matchCount = 0;
      registeredSearchParams.forEach(registeredSearchParam => {
        matchCount += registeredURL.searchParams.get(registeredSearchParam) === requestURL.searchParams.get(registeredSearchParam);
      });
      if (matchCount != registeredSearchParams.length) {
        return;
      }

      this.lookupTable[key].invoke(request.responseText);
    });
  }
}

const rarbgAssistant = new RarbgAssistant();
rarbgAssistant.initalize();


const styleNode = document.createElement('style');
styleNode.type = 'text/css';
styleNode.innerText = '.trailer-modal{position:fixed!important}';
document.head.appendChild(styleNode);