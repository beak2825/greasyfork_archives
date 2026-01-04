// ==UserScript==
// @name         Komodo - Mods for Komoot
// @namespace    https://github.com/jerboa88
// @version      2.2.0
// @author       John Goodliff
// @description  A userscript for Komoot.com that adds additional features for route planning.
// @license      MIT
// @icon         data:image/png;base64,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
// @homepage     https://johng.io/p/komodo
// @homepageURL  https://johng.io/p/komodo
// @source       https://github.com/jerboa88/komodo.git
// @supportURL   https://github.com/jerboa88/komodo/issues
// @match        https://www.komoot.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545361/Komodo%20-%20Mods%20for%20Komoot.user.js
// @updateURL https://update.greasyfork.org/scripts/545361/Komodo%20-%20Mods%20for%20Komoot.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  const globalCss = ':root{--komodo-spacing: .375rem;--komodo-pill-bg-color: var(--theme-ui-colors-primary);--komodo-pill-text-color: var(--theme-ui-colors-textOnDark);--komodo-button-bg-color: var(--theme-ui-colors-white);--komodo-button-border-color: var(--komodo-button-bg-color);--komodo-button-text-color: var(--theme-ui-colors-secondary);--komodo-button-hover-bg-color: rgba(0, 119, 217, .1);--komodo-button-hover-border-color: #0065b8;--komodo-button-hover-text-color: #0065b8;--komodo-button-disabled-bg-color: var(--theme-ui-colors-muted);--komodo-button-disabled-border-color: var(--komodo-button-disabled-bg-color);--komodo-button-disabled-text-color: var(--theme-ui-colors-disabled)}div:has(>a[href="/upload"]){align-items:center}.komodo-pill{align-items:center;background-color:var(--komodo-pill-bg-color);border-radius:4px;color:var(--komodo-pill-text-color);display:inline-flex;justify-content:center;min-width:2em;text-align:center;font-size:12px;font-weight:700;padding:.25em .5em;text-transform:inherit;flex-shrink:0}.komodo-tag-pill-container{display:flex;flex-wrap:wrap;gap:var(--komodo-spacing)}.komodo-tag-pill-container>.komodo-pill>div>span:nth-child(2){white-space:pre}.komodo-button{align-items:center;appearance:none;background-color:var(--komodo-button-bg-color);border-color:var(--komodo-button-border-color);border-radius:8px;border-style:solid;color:var(--komodo-button-text-color);cursor:pointer;display:inline-flex;justify-content:center;pointer-events:auto;text-align:center;width:unset;border-width:.0625rem;text-decoration:none;transition:all .2s;font-size:16px;font-weight:700;line-height:1.5rem;padding:.4375rem .6875rem}.komodo-button:hover{background-color:var(--komodo-button-hover-bg-color);border-color:var(--komodo-button-hover-border-color);color:var(--komodo-button-hover-text-color)}.komodo-button:disabled{cursor:default;background-color:var(--komodo-button-disabled-bg-color);border-color:var(--komodo-button-disabled-border-color);color:var(--komodo-button-disabled-text-color)}.komodo-button>svg{color:inherit}.komodo-button>span{display:inline-flex;text-align:center;flex-flow:column;padding-left:.25rem;padding-right:0}.komodo-new{position:relative}.komodo-new:after{content:"🦎";position:absolute;top:0;right:calc(var(--komodo-spacing) * -1);z-index:1;font-size:small;line-height:0}';
  importCSS(globalCss);
  const PROJECT = {
    EMOJI: "🦎",
    NAME: "Komodo"
  };
  const prefix = PROJECT.NAME.toLowerCase();
  const CLASS = {
    NEW: `${prefix}-new`,
    HIDE: `${prefix}-hide`,
    SCROLLABLE: `${prefix}-scrollable`,
    DIVIDER: `${prefix}-divider`,
    FILTER_CONTAINER: `${prefix}-filter-container`,
    TAG_FILTER_CONTAINER: `${prefix}-tag-filter-container`,
    TAG_FILTER: `${prefix}-tag-filter`,
    TAG_PILL_CONTAINER: `${prefix}-tag-pill-container`,
    PILL: `${prefix}-pill`,
    BUTTON: `${prefix}-button`
  };
  const DATA_ATTRIBUTE = {
TOUR_ID: "tourId",
    TAG_NAME: `${prefix}TagName`,
    TAG_VALUE: `${prefix}TagValue`
  };
  const TAG_DELIMITER = {
    START: "[",
    END: "]",
    KEY_VALUE: ":",
    VALUE: ","
  };
  const SCRIPT_NAME = `${PROJECT.EMOJI} ${PROJECT.NAME}`;
  class Logger {
    scope;
    static colorMap = (() => {
      const htmlNode = window.getComputedStyle(document.documentElement);
      return {
        primary: htmlNode.getPropertyValue("--theme-ui-colors-primaryOnDark"),
        debug: htmlNode.getPropertyValue("--theme-ui-colors-info"),
        info: htmlNode.getPropertyValue("--theme-ui-colors-success"),
        warn: htmlNode.getPropertyValue("--theme-ui-colors-warning"),
        error: htmlNode.getPropertyValue("--theme-ui-colors-error")
      };
    })();
    debug;
    info;
    warn;
    error;
    constructor(scope) {
      this.scope = scope;
      this.debug = this.buildLogFn("debug");
      this.info = this.buildLogFn("info");
      this.warn = this.buildLogFn("warn");
      this.error = this.buildLogFn("error");
    }
    buildLogPrefix(severity) {
      return [
        `%c${SCRIPT_NAME} %c${severity}(${this.scope})`,
        `font-style:italic;color:${Logger.colorMap.primary};`,
        `color:${Logger.colorMap[severity]};`
      ];
    }
    buildLogFn(severity) {
      const logFn = console[severity];
      const logPrefix = this.buildLogPrefix(severity);
      return (...args) => logFn(...logPrefix, ...args);
    }
  }
  const styleCss$2 = "a[data-test-id=tours_list_item_title]{display:block;margin-bottom:var(--komodo-spacing)}.komodo-filter-container{flex-wrap:wrap;gap:var(--komodo-spacing)}.komodo-filter-container>button{margin-right:0!important}.komodo-divider{border-bottom-width:1px;border-color:var(--theme-ui-colors-border);border-style:solid;width:100%;justify-self:stretch}.komodo-tag-filter-container{flex:1 1 auto;display:flex;flex-wrap:wrap;gap:var(--komodo-spacing)}.komodo-tag-filter{border-width:1px;font-weight:700;border-radius:8px;flex:1 1 0%;background-color:var(--theme-ui-colors-card);color:var(--theme-ui-colors-text);border-color:var(--theme-ui-colors-black20)}.komodo-tag-filter:hover{border-color:var(--theme-ui-colors-black30)}.komodo-tag-filter>p{align-items:center;display:flex;flex-direction:row;gap:1.5rem;justify-content:space-between;padding:1rem;width:initial;align-self:stretch}.komodo-tag-filter fieldset{align-items:stretch;display:flex;flex-direction:column;gap:.75rem;justify-content:end;padding:1rem;width:initial;align-self:stretch}.komodo-tag-filter fieldset>label{align-items:center;border-color:var(--theme-ui-colors-border);border-radius:8px;border-style:solid;color:var(--theme-ui-colors-text);cursor:pointer;display:flex;flex-direction:row;gap:1.5rem;grid-area:grid-item-0;justify-content:space-between;padding:.5rem;width:initial;align-self:stretch;border-width:1px}.komodo-tag-filter fieldset>label:hover{border-color:var(--theme-ui-colors-whisper)}.komodo-tag-filter fieldset>label:has(input[type=checkbox][value=true]){color:var(--theme-ui-colors-primary)}.komodo-tag-filter fieldset>label:has(input[type=checkbox][value=false]){color:var(--theme-ui-colors-error)}.komodo-tag-filter fieldset>label>input[type=checkbox][value=true]{accent-color:var(--komodo-pill-bg-color)}.komodo-tag-filter fieldset>label>input[type=checkbox][value=false]{accent-color:var(--theme-ui-colors-error)}.komodo-tag-filter>select{display:block;width:fit-content;margin-top:var(--komodo-spacing)}.komodo-hide{display:none}.komodo-scrollable{max-height:350px;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin}";
  const assertDefined = (value, label = "value") => {
    if (value == null) {
      throw new Error(`Expected ${label} to be defined, but it was not`);
    }
    return value;
  };
  const toElementId = (value) => {
    if (!value) {
      return "id_empty";
    }
    const validChar = /^[a-zA-Z0-9\-_:.]+$/;
    let result = "";
    for (const ch of value) {
      if (validChar.test(ch)) {
        result += ch;
      } else {
        const code = ch.codePointAt(0)?.toString(16).padStart(4, "0");
        result += `_u${code}_`;
      }
    }
    if (!/^[a-zA-Z]/.test(result)) {
      result = `id_${result}`;
    }
    return result;
  };
  const logger$5 = new Logger("NodeAddObserver");
  class NodeAddObserver {
    observer;
    stopProcessing = false;
    target;
    options;
constructor(callback, target, options) {
      this.observer = new MutationObserver((mutations) => {
        this.stopProcessing = false;
        for (const mutation of mutations) {
          for (const newNode of mutation.addedNodes) {
            if (this.stopProcessing) {
              return;
            }
            callback(newNode, this);
          }
        }
      });
      if (options) {
        this.options = options;
      }
      if (target) {
        this.target = target;
        this.observe(target, options);
      }
    }
disconnect() {
      this.observer.disconnect();
      logger$5.debug("Disconnected");
    }
observe(target, options = {}) {
      this.observer.observe(target, { childList: true, ...options });
      logger$5.debug("Observing:", target);
    }
reobserve(beforeObserve) {
      const target = assertDefined(this.target);
      this.disconnect();
      beforeObserve();
      this.observe(target, this.options);
    }
stop() {
      this.stopProcessing = true;
    }
  }
  const logger$4 = new Logger("dom");
  const createElement = (tagName, attributeMap = {}) => {
    const element = document.createElement(tagName);
    for (const [key, value] of Object.entries(attributeMap)) {
      if (key === "classList" && Array.isArray(value)) {
        element.classList.add(...value);
      } else if (key === "dataset" && typeof value === "object" && value !== null) {
        for (const [dataKey, dataVal] of Object.entries(value)) {
          element.dataset[dataKey] = dataVal;
        }
      } else if (value !== void 0) {
        if (key in element) {
          element[key] = value;
        } else {
          element.setAttribute(key, String(value));
        }
      }
    }
    return element;
  };
  const createElementTemplate = (nullableReferenceElement) => {
    const referenceElement = assertDefined(
      nullableReferenceElement,
      "reference element"
    );
    const elementTemplate = referenceElement.cloneNode(true);
    elementTemplate.classList.add(CLASS.NEW);
    return elementTemplate;
  };
  const createPill = (text) => {
    const div = createElement("div", {
      classList: [CLASS.NEW, CLASS.PILL]
    });
    return div;
  };
  const createButton = (text, icon, handleClick) => {
    const button = createElement("button", {
      classList: [CLASS.NEW, CLASS.BUTTON]
    });
    const span = createElement("span", {
      textContent: text
    });
    button.addEventListener("click", (event) => {
      logger$4.debug("Button clicked:", text);
      handleClick(event, button, span, icon);
    });
    button.appendChild(icon);
    button.appendChild(span);
    return button;
  };
  const createTriStateCheckbox = (() => {
    const stateMap = {
      undefined: void 0,
      true: true,
      false: false
    };
    const states = Object.values(stateMap);
    const updateCheckboxState = (checkbox, checkedState) => {
      checkbox.checked = checkedState === true;
      checkbox.indeterminate = checkedState === false;
      checkbox.value = String(checkedState);
    };
    return (id, initialCheckedState, onClick) => {
      const checkbox = createElement("input", {
        type: "checkbox",
        id
      });
      checkbox.addEventListener("click", () => {
        let checkedState = stateMap[checkbox.value];
        const newCheckedStateIndex = (states.indexOf(checkedState) + 1) % states.length;
        checkedState = states[newCheckedStateIndex];
        updateCheckboxState(checkbox, checkedState);
        onClick(checkedState);
      });
      updateCheckboxState(checkbox, initialCheckedState);
      return checkbox;
    };
  })();
  const showElement = (element, visible) => {
    const shouldHide = !visible;
    const isHidden = element.classList.contains(CLASS.HIDE);
    if (isHidden === shouldHide) {
      return false;
    }
    element.classList.toggle(CLASS.HIDE, shouldHide);
    return true;
  };
  const onReactMounted = (callback) => {
    const canaryClassName = "ReactModalPortal";
    const continueCall = () => {
      logger$4.debug("React has been mounted");
      callback();
    };
    const canaries = document.body.getElementsByClassName(canaryClassName);
    if (canaries.length > 0) {
      continueCall();
      return;
    }
    logger$4.debug("Waiting for React to be mounted");
    new NodeAddObserver((newNode, observer) => {
      if (newNode instanceof HTMLElement && newNode.classList.contains(canaryClassName)) {
        observer.disconnect();
        continueCall();
        observer.stop();
      }
    }, document.body);
  };
  const createTagPill = (tag) => {
    const pill = createPill();
    const container = createElement("div");
    const valueSpan = createElement("span", {
      textContent: tag.value
    });
    pill.dataset[DATA_ATTRIBUTE.TAG_VALUE] = tag.value;
    if (tag.name) {
      const nameSpan = createElement("span", {
        textContent: tag.name
      });
      const separatorSpan = createElement("span", {
        textContent: ": "
      });
      pill.dataset[DATA_ATTRIBUTE.TAG_NAME] = tag.name;
      container.appendChild(nameSpan);
      container.appendChild(separatorSpan);
    }
    container.appendChild(valueSpan);
    pill.appendChild(container);
    return pill;
  };
  const createTagPillContainer = (routeTagMap) => {
    const div = createElement("div", {
      classList: [CLASS.TAG_PILL_CONTAINER]
    });
    for (const tag of routeTagMap) {
      div.appendChild(createTagPill(tag));
    }
    return div;
  };
  const logger$3 = new Logger("TagMap");
  class TagMap {
    tagMap = new Map();
    startDelimiter;
    endDelimiter;
    keyValueDelimiter;
    valueDelimiter;
    constructor(startDelimiter = "[", endDelimiter = "]", keyValueDelimiter = ":", valueDelimiter = ",") {
      this.startDelimiter = startDelimiter;
      this.endDelimiter = endDelimiter;
      this.keyValueDelimiter = keyValueDelimiter;
      this.valueDelimiter = valueDelimiter;
    }
    getValueToInclusionMap(name) {
      const valueToInclusionMap = this.tagMap.get(name);
      if (!valueToInclusionMap) {
        throw new Error(
          "TagMap: Expected valueToInclusionMap to be defined, but it was not"
        );
      }
      return valueToInclusionMap;
    }
add(name, value) {
      if (!this.tagMap.has(name)) {
        this.tagMap.set(name, new Map());
      }
      const valueToInclusionMap = this.getValueToInclusionMap(name);
      if (valueToInclusionMap.has(value)) {
        return false;
      }
      valueToInclusionMap.set(value, void 0);
      return true;
    }
setInclusion(name, value, isIncluded) {
      const valueToInclusionMap = this.tagMap.get(name);
      if (!valueToInclusionMap || !valueToInclusionMap.has(value)) {
        return false;
      }
      const current = valueToInclusionMap.get(value);
      if (current === isIncluded) {
        return false;
      }
      valueToInclusionMap.set(value, isIncluded);
      return true;
    }
getAsMap = () => {
      return this.tagMap;
    };
*[Symbol.iterator]() {
      const sortedNames = Array.from(this.tagMap.keys()).sort();
      for (const name of sortedNames) {
        const valueToInclusionMap = this.getValueToInclusionMap(name);
        const sortedValues = Array.from(valueToInclusionMap.keys()).sort();
        for (const value of sortedValues) {
          yield { name, value, isIncluded: valueToInclusionMap.get(value) };
        }
      }
    }
parseAndAdd(input) {
      const parsedTagMap = new TagMap(
        TAG_DELIMITER.START,
        TAG_DELIMITER.END,
        TAG_DELIMITER.KEY_VALUE,
        TAG_DELIMITER.VALUE
      );
      let text = "";
      let wasUpdated = false;
      let i = 0;
      while (i < input.length) {
        if (input[i] === this.startDelimiter) {
          i++;
          let inside = "";
          while (i < input.length && input[i] !== this.endDelimiter) {
            inside += input[i++];
          }
          if (i < input.length && input[i] === this.endDelimiter) {
            i++;
          }
          const kvIndex = inside.indexOf(this.keyValueDelimiter);
          let tagName;
          let values = [];
          if (kvIndex >= 0) {
            tagName = inside.slice(0, kvIndex).trim();
            values = inside.slice(kvIndex + 1).split(this.valueDelimiter).map((v) => v.trim()).filter((v) => v.length > 0);
          } else {
            values = inside.split(this.valueDelimiter).map((v) => v.trim()).filter((v) => v.length > 0);
          }
          for (const v of values) {
            const wasAdded = this.add(tagName, v);
            parsedTagMap.add(tagName, v);
            if (wasAdded) wasUpdated = true;
          }
        } else {
          text += input[i++];
        }
      }
      return { text, parsedTagMap, wasUpdated };
    }
matches(candidate) {
      for (const { name, value, isIncluded } of this) {
        const candidateValueToInclusionMap = candidate.tagMap.get(name);
        const existsInCandidate = candidateValueToInclusionMap?.has(value) ?? false;
        if (isIncluded === true && !existsInCandidate) {
          logger$3.debug(
            `${name}:${value} is included in reference but not in candidate`
          );
          return false;
        }
        if (isIncluded === false && existsInCandidate) {
          logger$3.debug(
            `${name}:${value} is excluded in reference but exists in candidate`
          );
          return false;
        }
      }
      return true;
    }
  }
  const ROUTE_NAME$2 = "tour list";
  const ROUTE_PATTERN$2 = /^\/user\/\d*?\/(routes|activities)$/;
  const logger$2 = new Logger(ROUTE_NAME$2);
  const init$3 = async (...capturingGroups) => {
    importCSS(styleCss$2);
    const isRouteListPage = capturingGroups?.[0] === "routes";
    const tagMap = new TagMap(
      TAG_DELIMITER.START,
      TAG_DELIMITER.END,
      TAG_DELIMITER.KEY_VALUE,
      TAG_DELIMITER.VALUE
    );
    const savedRoutesAnchor = assertDefined(
      document.body.querySelector(
        'a[href^="/user/"][href$="/routes"]'
      ),
      "saved routes link anchor (a)"
    );
    const ul = assertDefined(
      document.body.querySelector(
        'ul[data-test-id="tours-list"]'
      ),
      "tour list (ul)"
    );
    const getLis = () => [...ul.children].filter((li) => li.nodeName === "LI");
    const scrollToLoadAll = async () => {
      logger$2.debug("Force loading all tours");
      const initialScrollPos = window.scrollY;
      const totalNumOfTours = Number(
        assertDefined(
          savedRoutesAnchor.lastElementChild?.textContent,
          "total number of tours label"
        )
      );
      logger$2.debug(`Found ${totalNumOfTours} total tours`);
      const loadMore = async () => {
        ul.scrollTop = ul.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 100));
        return totalNumOfTours > getLis().length;
      };
      while (await loadMore()) ;
      logger$2.debug(`Restoring scroll position: ${initialScrollPos}`);
      window.scrollTo(0, initialScrollPos);
    };
    const addLoadAllToursButton = () => {
      logger$2.debug("Adding load all tours button to page");
      const title = isRouteListPage ? "Load All Routes" : "Load All Activities";
      const importLinkAnchor = assertDefined(
        document.body.querySelector('a[href="/upload"]'),
        "import link anchor (a)"
      );
      const container = assertDefined(
        importLinkAnchor.parentElement,
        "import link anchor parent"
      );
      const icon = createElementTemplate(
        savedRoutesAnchor.firstElementChild
      );
      const button = createButton(title, icon, async (_event, button2, span) => {
        button2.disabled = true;
        span.textContent = "Loading...";
        await scrollToLoadAll();
        span.textContent = "Loaded";
      });
      container.insertBefore(button, importLinkAnchor);
    };
    const createTagFilterSet = (tagName, tagValueToInclusionMap) => {
      const div = createElement("div", {
        classList: [CLASS.SCROLLABLE]
      });
      const fieldset = createElement("fieldset");
      const sortedTagValueEntries = [...tagValueToInclusionMap.entries()].sort(
        ([tagValueA], [tagValueB]) => tagValueA.localeCompare(tagValueB)
      );
      for (const [tagValue, isIncluded] of sortedTagValueEntries) {
        const handleClick = (checkedState) => {
          tagMap.setInclusion(tagName, tagValue, checkedState);
          applyFilters();
        };
        const checkboxId = `${toElementId(tagName)}-${toElementId(tagValue)}`;
        const checkbox = createTriStateCheckbox(
          checkboxId,
          isIncluded,
          handleClick
        );
        const label = createElement("label", {
          dataset: {
            [DATA_ATTRIBUTE.TAG_VALUE]: tagValue
          }
        });
        const span = createElement("span", {
          textContent: tagValue
        });
        label.appendChild(span);
        label.appendChild(checkbox);
        fieldset.appendChild(label);
        div.appendChild(fieldset);
      }
      return div;
    };
    const createTagFiltersContainer = () => {
      logger$2.debug("Creating tag filters container");
      const tagFiltersContainer = createElement("form", {
        classList: [CLASS.TAG_FILTER_CONTAINER]
      });
      for (const [tagName, tagValueToInclusionMap] of tagMap.getAsMap()) {
        const tagFilter = createElement("div", {
          classList: [CLASS.NEW, CLASS.TAG_FILTER],
          dataset: {
            [DATA_ATTRIBUTE.TAG_NAME]: tagName
          }
        });
        const filterSetTitle = createElement("p", {
          textContent: tagName ?? "..."
        });
        const divider = createElement("div", {
          classList: [CLASS.DIVIDER]
        });
        tagFilter.appendChild(filterSetTitle);
        tagFilter.appendChild(divider);
        const container = createTagFilterSet(tagName, tagValueToInclusionMap);
        tagFilter.appendChild(container);
        tagFiltersContainer.appendChild(tagFilter);
      }
      return tagFiltersContainer;
    };
    const updateTagFilterControls = () => {
      logger$2.debug("Updating tag filter controls on page");
      const filterContainer = document.querySelector(
        '#js-filter-anchor div:not([data-bottomsheet-scroll-ignore="true"]):has(> button:not([type="button"])'
      );
      const existingTagFilterContainer = filterContainer?.getElementsByClassName(
        CLASS.TAG_FILTER_CONTAINER
      )?.[0];
      const tagFilterControls = createTagFiltersContainer();
      existingTagFilterContainer ? existingTagFilterContainer.replaceWith(tagFilterControls) : filterContainer?.appendChild(tagFilterControls);
      filterContainer?.classList.add(CLASS.FILTER_CONTAINER);
    };
    const updateLiTitle = (a) => {
      if (!a) {
        logger$2.warn("No a element found in li element", a);
        return {
          tourTagMap: new TagMap(),
          updated: false
        };
      }
      const originalTitle = assertDefined(
        a.textContent,
        "tour title anchor text content (a.textContent)"
      );
      const {
        text,
        parsedTagMap: tourTagMap,
        wasUpdated
      } = tagMap.parseAndAdd(originalTitle);
      a.textContent = text;
      a.title = originalTitle;
      return { tourTagMap, wasUpdated };
    };
    const parseLiTagPills = (li) => {
      const pills = li.getElementsByClassName(
        CLASS.PILL
      );
      const tourTagMap = new TagMap();
      for (const pill of pills) {
        const name = pill.dataset[DATA_ATTRIBUTE.TAG_NAME];
        const value = assertDefined(
          pill.dataset[DATA_ATTRIBUTE.TAG_VALUE],
          `${pill.textContent} tag value`
        );
        tourTagMap.add(name, value);
      }
      return tourTagMap;
    };
    const updateLi = (li) => {
      logger$2.debug("Updating li element");
      const a = assertDefined(
        li.querySelector(
          'a[data-test-id="tours_list_item_title"]'
        ),
        "tour title anchor (a)"
      );
      const { tourTagMap, wasUpdated } = updateLiTitle(a);
      a.parentElement?.appendChild(createTagPillContainer(tourTagMap));
      if (wasUpdated) {
        updateTagFilterControls();
      }
      filterLi(li, tourTagMap);
    };
    const filterLi = (li, tourTagMap) => {
      const doesMatchFilter = tagMap.matches(tourTagMap);
      const wasVisibilityChanged = showElement(li, doesMatchFilter);
      if (wasVisibilityChanged) {
        const msgPrefix = doesMatchFilter ? "Showing" : "Hiding";
        logger$2.debug(
          `${msgPrefix} li element: ${li.dataset[DATA_ATTRIBUTE.TOUR_ID]}`
        );
      }
    };
    const applyFilters = () => {
      logger$2.debug("Applying filters");
      const lis = getLis();
      for (const li of lis) {
        const tourTagMap = parseLiTagPills(li);
        filterLi(li, tourTagMap);
      }
    };
    logger$2.debug("Waiting for li elements to be added to the list");
    new NodeAddObserver((newNode) => {
      if (newNode.nodeName === "LI") {
        updateLi(newNode);
      }
    }, ul);
    getLis().forEach(updateLi);
    addLoadAllToursButton();
    updateTagFilterControls();
  };
  const handler$2 = (...capturingGroups) => onReactMounted(() => init$3(...capturingGroups));
  const tourListRoute = {
    name: ROUTE_NAME$2,
    pattern: ROUTE_PATTERN$2,
    handler: handler$2
  };
  const styleCss$1 = "dialog[data-test-id=rename-tour-dialog]>div{width:100%;max-width:64rem}h1>span[data-test-id=tour-title]:has(>.komodo-tag-pill-container){display:flex;flex-direction:column;gap:var(--komodo-spacing)}";
  const ROUTE_NAME$1 = "tour view";
  const ROUTE_PATTERN$1 = /^\/tour\/\d*?$/;
  const logger$1 = new Logger(ROUTE_NAME$1);
  const init$2 = async () => {
    importCSS(styleCss$1);
    const tagMap = new TagMap(
      TAG_DELIMITER.START,
      TAG_DELIMITER.END,
      TAG_DELIMITER.KEY_VALUE,
      TAG_DELIMITER.VALUE
    );
    const h1 = document.body.getElementsByTagName("h1")?.[0];
    const span = assertDefined(
      h1.querySelector('span[data-test-id="tour-title"]'),
      "tour title span (h1.span)"
    );
    let originalTourTitle;
    let tourTitle;
    const getBreadcrumbs = () => assertDefined(
      document.body.querySelectorAll(
        'a[href^="/user/"] ~ p'
      ),
      "breadcrumb (a.p)"
    );
    const parseTourTitle = () => {
      logger$1.debug("Parsing tour title");
      originalTourTitle = assertDefined(
        span.textContent,
        "tour title span text content (span.textContent)"
      );
      tourTitle = tagMap.parseAndAdd(originalTourTitle).text;
    };
    const updateTourTitle = () => {
      logger$1.debug("Updating tour title");
      h1.title = originalTourTitle;
      document.title = tourTitle;
      span.textContent = tourTitle;
      span.appendChild(createTagPillContainer(tagMap));
    };
    const updateBreadcrumb = (p) => {
      logger$1.debug("Updating breadcrumb");
      p.title = originalTourTitle;
      p.textContent = tourTitle;
    };
    parseTourTitle();
    updateTourTitle();
    for (const breadcrumb of getBreadcrumbs()) {
      updateBreadcrumb(breadcrumb);
    }
    const breadcrumbObserver = new NodeAddObserver((newNode, observer) => {
      if (newNode.nodeName === "P") {
        observer.disconnect();
        updateBreadcrumb(newNode);
      }
    });
    logger$1.debug("Waiting for title to be edited");
    new NodeAddObserver((_newNode, observer) => {
      observer.reobserve(() => {
        parseTourTitle();
        updateTourTitle();
      });
      for (const breadcrumb of getBreadcrumbs()) {
        const parent = assertDefined(
          breadcrumb.parentElement,
          "breadcrumb parent"
        );
        logger$1.debug("Waiting for breadcrumb to be updated");
        breadcrumbObserver.observe(parent);
      }
    }, span);
  };
  const handler$1 = () => onReactMounted(init$2);
  const tourViewRoute = {
    name: ROUTE_NAME$1,
    pattern: ROUTE_PATTERN$1,
    handler: handler$1
  };
  const styleCss = "h1:has(>.komodo-tag-pill-container){display:flex;flex-direction:row;justify-content:center;align-items:center;gap:var(--komodo-spacing)}";
  const ROUTE_NAME = "tour zoom";
  const ROUTE_PATTERN = /^\/tour\/\d*?\/zoom$/;
  const init$1 = async () => {
    importCSS(styleCss);
    const tagMap = new TagMap(
      TAG_DELIMITER.START,
      TAG_DELIMITER.END,
      TAG_DELIMITER.KEY_VALUE,
      TAG_DELIMITER.VALUE
    );
    const updatePageTitle = () => {
      const h1 = assertDefined(
        document.body.getElementsByTagName("h1")?.[0],
        "h1"
      );
      const originalTitle = assertDefined(h1.textContent);
      const { text, parsedTagMap: tourTagMap } = tagMap.parseAndAdd(originalTitle);
      document.title = text;
      h1.textContent = text;
      h1.title = originalTitle;
      h1.appendChild(createTagPillContainer(tourTagMap));
    };
    updatePageTitle();
  };
  const handler = () => onReactMounted(init$1);
  const tourZoomRoute = {
    name: ROUTE_NAME,
    pattern: ROUTE_PATTERN,
    handler
  };
  const logger = new Logger("router");
  const registerRouteHandlers = (routes) => {
    const path = location.pathname;
    for (const { name, pattern, handler: handler2 } of routes) {
      const match = pattern.exec(path);
      if (match) {
        logger.debug(`Router: Calling handler for '${name}' route`);
        handler2(...match.slice(1));
        break;
      }
    }
  };
  const init = () => {
    logger.debug("Script loaded");
    registerRouteHandlers([tourListRoute, tourViewRoute, tourZoomRoute]);
    logger.debug("Script unloaded");
  };
  init();

})();