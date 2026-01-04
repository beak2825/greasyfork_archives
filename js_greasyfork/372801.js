// ==UserScript==
// @name        Pinterest - Remove Unwanted Pins (dev)
// @namespace   valacar.pinterest.remove-picked-for-you-dev
// @author      valacar
// @version     0.8.2.dev
// @description Remove unwanted pins on Pinterest, like "Promoted", "Sponsored", "Picked for you"
// @include     https://*.pinterest.tld/*
// @exclude     /^https://(help|blog|about|buisness|developers|engineering|careers|policy|offsite)\.pinterest/
// @grant       none
// @run-at      document-start
// @noframes
// @license     MIT
// @compatible  firefox Firefox
// @compatible  chrome Chrome
// @downloadURL https://update.greasyfork.org/scripts/372801/Pinterest%20-%20Remove%20Unwanted%20Pins%20%28dev%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372801/Pinterest%20-%20Remove%20Unwanted%20Pins%20%28dev%29.meta.js
// ==/UserScript==

(function unwantedPins() {
  "use strict";

  const DEBUGGING = 1;
  const ENABLE_KEYS = 1;
  const JSON_DUMP = 1;

  const badDomains = [
    //"plus.google.com",
    "etsy.com",
    "buzzfeed.com",
    "shopamazon.com",
    "overstock.com",
    "younghopes.com",
    "internetdiscountstore.info",
    "hifeelings.com",
    "hm.com",
    "wishbonebear.com",
    "timeshood.com",
    "enioken.com"
  ];

  const badImageSignature = [
    "748e73d75f47e30ae058acad9f4efb44",
    "fa69d9f3f895491b3a41a1fc8be592f2",
    "47b7c55456c9d98f9ca16739be63ed51"
  ];

  const badStoryType = [
    "real_time_boards", // ideas for you
    "BUBBLE_TRAY_CAROUSEL", // ideas you might love
    "PINART_INTEREST", // topics for you
    "single_column_recommended_board",
    "recommended_searches", // searches to try
    "RECOMMENDED_TOPICS"
  ];

  const badRecommendation = [
    //"RECOMMENDED_TOPICS",
    //"CLICKTHROUGH",
    //"INTENTIONAL_DISTRIBUTION_GEMINI" // these usually look like ads, but not sure yet
  ];

  const badPinUser = [
    "valentinillanes",
    "cristiandener"
  ];

  const badDomainSet = new Set(badDomains);
  const badImageSignatureSet = new Set(badImageSignature);
  const badStoryTypeSet = new Set(badStoryType);
  const badRecommendationSet = new Set(badRecommendation);
  const badPinUserSet = new Set(badPinUser);

  const displayNoneClass = "unwanted";

  let cachedHandler;
  let cachedGrid;

  const debugLog = DEBUGGING
    ? console.log.bind(console, "[unwanted]")
    : function() {};

  /* ---------------------------- */

  function appendStyle(cssString)
  {
    const parent = document.head || document.documentElement;
    if (parent) {
      const style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.textContent = cssString;
      parent.appendChild(style);
    }
  }

  appendStyle(`.${displayNoneClass} { visibility: hidden !important; .dbg { outline: 2px dashed red !important; }`);
  //appendStyle(`.${displayNoneClass} { outline: 2px solid red !important; }`);

  function poll(fn, timeout, interval) {
      var endTime = Number(new Date()) + (timeout || 2000);
      interval = interval || 100;
      var checkCondition = function(resolve, reject) {
          // If the condition is met, we're done!
          var result = fn();
          if(result) { resolve(result); }
          // If the condition isn't met but the timeout hasn't elapsed, go again
          else if (Number(new Date()) < endTime) {
              setTimeout(checkCondition, interval, resolve, reject);
          }
          // Didn't match and too much time, reject!
          else {
              reject(new Error('timed out for ' + fn + ': ' + arguments));
          }
      };
      return new Promise(checkCondition);
  }

  // https://stackoverflow.com/questions/13861254/json-stringify-deep-objects
  // by dystroy and Gili
  function toJSON(object,objectMaxDepth,arrayMaxLength,indent){function quote(string){escapable.lastIndex=0;
  var escaped;if(escapable.test(string)){escaped=string.replace(escapable,function(a){var replacement=replacements[a];
  if(typeof replacement==="string")return replacement;return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}else escaped=string;
  return'"'+escaped+'"'}function toString(path,value,cumulativeIndent,depth){switch(typeof value){case"string":return quote(value);
  case"number":{if(isFinite(value))return String(value);return"null"}case"boolean":return String(value);
  case"object":{if(!value)return"null";var valueIndex=values.indexOf(value);if(valueIndex!==-1)return"Reference => "+paths[valueIndex];
  values.push(value);paths.push(path);if(depth>objectMaxDepth)return"...";var partial=[];
  var i;if(Object.prototype.toString.apply(value)==="[object Array]"){var length=Math.min(value.length,arrayMaxLength);
  for(i=0;i<length;++i){partial[i]=toString(path+"."+i,value[i],cumulativeIndent+indent,depth,arrayMaxLength)}
  if(i<value.length){partial[i]="..."}return"\n"+cumulativeIndent+"["+partial.join(", ")+"\n"+cumulativeIndent+"]"}
  for(var subKey in value){if(Object.prototype.hasOwnProperty.call(value,subKey)){var subValue;
  try{subValue=toString(path+"."+subKey,value[subKey],cumulativeIndent+indent,depth+1);
  partial.push(quote(subKey)+": "+subValue)}catch(e){if(e.message)subKey=e.message;
  else subKey="access denied"}}}var result="\n"+cumulativeIndent+"{\n";
  for(i=0;i<partial.length;++i)result+=cumulativeIndent+indent+partial[i]+",\n";
  if(partial.length>0){result=result.slice(0,result.length-2)+"\n"}result+=cumulativeIndent+"}";
  return result}default:return"null"}}if(indent===undefined)indent="  ";if(objectMaxDepth===undefined)objectMaxDepth=0;
  if(arrayMaxLength===undefined)arrayMaxLength=50;
  var escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var replacements={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};
  var values=[];var paths=[];return toString("root",object,"",0)}


  function validChain(object, path) {
    return path.split('.').reduce((a, b) => (a || {})[b], object) !== undefined;
  }

  function getEventHandler(node)
  {
    return Object.keys(node).find(
      prop => prop.startsWith("__reactEventHandlers")
    );
  }

  function isPromotedPin(data, pin)
  {
    let result = (data.is_promoted && data.is_promoted === true) ||
      data.promoter ||
      pin.dataset.testId === "oneTapPromotedPin";
    if (result) debugLog("--- removed PROMOTED pin:", data.domain);
    return result;
  }

  function isIdeaPin(data)
  {
    let result =
      data.type &&
      data.type === "story" &&
      badStoryTypeSet.has(data.story_type);
    if (result) {
      debugLog("--- removed IDEAS/TOPICS for you pin:", data.story_type);
    }
    return result;
  }

  function isCommercePin(data)
  {
    let result = data.shopping_flags && data.shopping_flags.length > 0;
    if (result) debugLog("--- removed COMMERCE pin:", data.domain);
    return result;
  }

  function isBadDomainPin(data)
  {
    const domain = data.domain;
    if (!domain) return false;
    let result = badDomainSet.has(domain);
    if (result) debugLog("--- removed BAD DOMAIN pin:", data.domain);
    return result;
  }

  function isSpecificImage(data)
  {
    if (!data.image_signature) return false;
    let result = badImageSignatureSet.has(data.image_signature);
    if (result) {
      debugLog(
        "--- removed SPECIFIC IMAGE:",
        data.domain,
        data.image_signature
      );
    }
    return result;
  }

  function isBadRecommendation(data)
  {
    let result = data.recommendation_reason &&
      badRecommendationSet.has(data.recommendation_reason.reason);
    if (result) {
      debugLog("--- removed RECOMMENDED pin:", data.recommendation_reason.reason);
    }
    return result;
  }

  function isBadPinUser(data)
  {
    let result = data.pinner && data.pinner.username &&
      badPinUserSet.has(data.pinner.username);
    if (result) {
      debugLog("--- removed BAD USER pin:", data.pinner.username);
    }
    return result;
  }

  function isBadPin(pin)
  {
    let handler = cachedHandler || getEventHandler(pin);
    if (!handler) {
      return false;
    }
    cachedHandler = handler; // cache React handler
    let data;
    let wrapper = pin.querySelector(".pinWrapper");
    if (wrapper) {
      // FIXME: children and other properties could be null
      if (!wrapper[handler].children.length >= 2) debugLog("???: wrapper .children array", wrapper);
      if (!wrapper[handler].children[1].props) debugLog("???: wrapper .props", wrapper);
      if (!wrapper[handler].children[1].props.pin) debugLog("???: wrapper .pin", wrapper);
      data = wrapper[handler].children[1].props.pin;
    } else {
      // FIXME: children and other properties could be null
      if (!pin[handler].children) debugLog("???: pin .children", pin);
      if (!pin[handler].children.props) debugLog("???: pin .props", pin);
      if (!pin[handler].children.props.data) debugLog("???: pin .data", pin);
      data = pin[handler].children.props.data;
    }
    if (
      data &&
      (isPromotedPin(data, pin) ||
        isIdeaPin(data) ||
        isCommercePin(data, pin) ||
        isBadDomainPin(data) ||
        isSpecificImage(data) ||
        isBadPinUser(data))
    ) {
      return true;
    }
    if (isBadRecommendation(data)) {
      pin.classList.add("dbg");
    }
  }

  function modifyBadPin(pin)
  {
    if (isBadPin(pin)) {
      pin.classList.add(displayNoneClass);
    }
  }

  function processPins(pins)
  {
    debugLog("::: Processing", pins.length, "pins");
    for (let i = 0, len = pins.length; i < len; ++i) {
      modifyBadPin(pins[i]);
    }
  }

  // FIXME: easier way to get grid?
  // temp0.__reactEventHandlers$vywvx0rnvg.children._owner.stateNode.gridWrapper
  // where temp0 is a pin ([data-grid-item])
  function findGrid()
  {
    if (cachedGrid && cachedGrid.isConnected) {
      return cachedGrid; // return early
    }
    const gridItems = document.querySelectorAll("[data-grid-item]");
    if (gridItems.length) {
      const gridItemParent = gridItems[0].parentNode;
      if (gridItemParent) {
        debugLog("### Found grid:", gridItemParent);
        cachedGrid = gridItemParent; // remember grid, so we don't have to find it again
        processPins(gridItems); // when new grid is found, process "static" pins
        return gridItemParent;
      }
    } else {
      debugLog("!!! Can't find data-grid-item");
    }
  }

  function searchAndDestroy()
  {
    debugLog(">>> searching and destroying");
    const grid = findGrid();
    if (grid) {
      const gridItems = grid.querySelectorAll("[data-grid-item]");
      processPins(gridItems);
    }
  }

  function mutationCallback(mutations)
  {
    findGrid();
    for (let mutation of mutations) {
      for (let i = 0, len = mutation.addedNodes.length; i < len; ++i) {
        let added = mutation.addedNodes[i];
        if (added.nodeType === 1) { // FIXME: can I use NodeFilter.SHOW_ELEMENT instead of '1'?
          if (added.hasAttribute("data-grid-item")) {
            modifyBadPin(added);
          }
        }
      }
    }
  }

  let foundHandler = false;

  function mutationCallback2(mutations, observer)
  {
    //if (filteredStatic === true) observer.disconnect();
    for (let mutation of mutations) {

      for (let i = 0, len = mutation.removedNodes.length; i < len; ++i) {
        let removed = mutation.removedNodes[i];
        if (removed.nodeType === 1) { // FIXME: can I use NodeFilter.SHOW_ELEMENT instead of '1'?
          if (removed.classList.contains("static")) {
            debugLog("--- Static pin removed");
            modifyBadPin(removed);
          }
        }
      }

      for (let i = 0, len = mutation.addedNodes.length; i < len; ++i) {
        let added = mutation.addedNodes[i];
        if (added.nodeType === 1) { // FIXME: can I use NodeFilter.SHOW_ELEMENT instead of '1'?
          const handler = getEventHandler(added);
          if (!foundHandler && handler) {
            debugLog("::: Found handler when adding node", added, handler);
            foundHandler = true;
          }
          //if (handler && added.hasAttribute("data-grid-item")) {
          //  debugLog("::: Pin with handler:", added);
          //}
        }
      }

    }
  }

  // Simplify creating a Mutation Observer (from document root)
  function createObserver(target, callbackFunction, rules)
  {
    let targetElement;
    if (typeof target === "string") {
      targetElement = document.querySelector(target);
    } else {
      // XXX: assume it's an element for now
      targetElement = target;
      debugLog(targetElement);
    }
    if (targetElement) {
      const observer = new MutationObserver(callbackFunction);
      observer.observe(targetElement, rules);
      debugLog("::: Observer created for", target);
    } else {
      debugLog("::: Observer could't find target", target);
    }
  }

  function dumpData()
  {
    let data;
    let pin;
    let handler;
    let path;
    const hoveredElements = document.querySelectorAll(':hover');
    for (let el of hoveredElements) {
      if (handler === undefined) handler = getEventHandler(el);
      if (!handler) continue;
      if (el.hasAttribute("data-grid-item")) { // normal pin
        const wrapper = el.querySelector(".pinWrapper");
        if (wrapper) {
          data = wrapper[handler].children[1].props.pin;
          path = "wrapper[handler].children[1].props.pin";
          pin = wrapper;
        } else {
          data = el[handler].props.data;
          path = "el[handler].props.data";
          pin = el;
        }
        break;
      } else if (el.parentNode &&
        el.parentNode.classList &&
        el.parentNode.classList.contains("containCloseup") )
      { // closeup image
        data = el[handler];
        pin = el;
        path = "closeup el[handler].props.data";
        break;
      }
    }
    if (JSON_DUMP) {
      debugLog("DUMP", pin, "\n", path, toJSON(data, 4, 20, "  "));
    } else {
      debugLog("DUMP", pin, "\n", path, data);
    }
  }

  if (DEBUGGING || ENABLE_KEYS) {
    window.addEventListener(
      "keydown",
      function(event) {
        if (
          event.defaultPrevented ||
          /(input|textarea)/i.test(document.activeElement.nodeName) ||
          document.activeElement.matches('[role="textarea"]')
        ) {
          return;
        }
        switch (event.key) {
          case "s": // find grid and hide unwanted pins
            console.log(
              "%cSearch and destroy!",
              "color: #fff; background: #600; font-weight: bold; display: block;"
            );
            searchAndDestroy();
            break;
          case "r": // temporary restore hidden pins
            document
              .querySelectorAll("." + displayNoneClass)
              .forEach(pin => {
                pin.classList.remove(displayNoneClass);
              });
            break;
          case "d": // dump react data
            dumpData();
            break;
          default:
            return;
        }
        event.preventDefault();
      },
      true
    );
  }

  debugLog("*** STARTING ***");
  //searchAndDestroy();

  // Note: this event comes after DOMContentLoaded
  window.addEventListener("load", () => {
    debugLog("::: load event");
    createObserver(".mainContainer", mutationCallback, {
      childList: true,
      subtree: true
    });
    searchAndDestroy();
  });

  window.addEventListener("DOMContentLoaded", () => {
    // Note: pin with react handler is found about a second after this event
    // FIXME: find alternative to setTimeout
    setTimeout(() => {
      debugLog("::: search and destroy with setTimeout");
      searchAndDestroy();
    }, 1500);
    const reactContainer = document.querySelector("[data-reactcontainer]");
    if (reactContainer) {
      debugLog("::: reactContainer exists at DOMContentLoaded", reactContainer);
    }
    createObserver("body", mutationCallback2, {
      childList: true,
      subtree: true
    });
  });

})();
