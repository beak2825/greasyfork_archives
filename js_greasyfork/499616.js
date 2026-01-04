const HtmlSanitizer = {
  tempElement: document.createElement("div"),
  sanitize: function (/** @type {string} */ htmlString) {
    this.tempElement.innerText = htmlString;
    return this.tempElement.innerHTML;
  },
};

// Feature detection for Trusted Types
let trustedHTMLPolicy;
if (window.trustedTypes && window.trustedTypes.createPolicy) {
  trustedHTMLPolicy = window.trustedTypes.createPolicy('mmHtmlPolicy', {
    createHTML: (input) => input // Add sanitization logic here if necessary
  });
}

class HtmlString extends String {
  /**@type {HTMLElement|null} */
  element = null;

  /**@param {string} value */
  constructor(value) {
    super(value);
  }

  /**@returns {HTMLElement} */
  asElement() {
    if (this.element !== null) {
      return this.element;
    }

    const temp = document.createElement("div");
    
    // Use Trusted Types if available, otherwise fall back to direct assignment
    if (trustedHTMLPolicy) {
      temp.innerHTML = trustedHTMLPolicy.createHTML(this.valueOf());
    } else {
      temp.innerHTML = this.valueOf();
    }
    
    if (temp.childElementCount > 1) {
      throw new Error("html template does not accept more than 1 element");
    }

    this.element = /**@type {HTMLElement} */ (temp.firstElementChild);
    return /**@type {HTMLElement} */ (this.element);
  }
}

/**
 * @param {string} selector
 * @param {HTMLElement|Document} rootElement
 * @returns {HTMLElement|null}
 */
function $findElm(selector, rootElement = document) {
  return /**@type {HTMLElement|null} */ (rootElement.querySelector(selector));
}

/**
 * @param {string} selector
 * @param {HTMLElement|Document} rootElement
 * @returns {HTMLElement}
 */
function $findElmStrictly(selector, rootElement = document) {
  const element = /**@type {HTMLElement|null} */ (rootElement.querySelector(selector));
  if (element === null) {
    throw new Error(`Element with selector '${selector}' not found`);
  }

  return element;
}

/**
 * @param {string} selector
 * @returns {NodeListOf<HTMLElement>}
 */
function $findAll(selector) {
  return /**@type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(selector));
}

/**@typedef {string|HtmlString|number|boolean} TInterpolatedValue */

/**
 * safe html interpolation
 * @param {TemplateStringsArray} literalValues
 * @param {TInterpolatedValue[]|TInterpolatedValue[][]} interpolatedValues
 * @returns {HtmlString}
 */
function html(literalValues, ...interpolatedValues) {
  let result = "";

  interpolatedValues.forEach((currentInterpolatedVal, idx) => {
    let literalVal = literalValues[idx];
    let interpolatedVal = "";
    if (Array.isArray(currentInterpolatedVal)) {
      interpolatedVal = currentInterpolatedVal.join("\n");
    } else if (typeof currentInterpolatedVal !== "boolean") {
      interpolatedVal = currentInterpolatedVal.toString();
    }

    const isSanitize = !literalVal.endsWith("$");
    if (isSanitize) {
      result += literalVal;
      result += HtmlSanitizer.sanitize(interpolatedVal);
    } else {
      literalVal = literalVal.slice(0, -1);

      result += literalVal;
      result += interpolatedVal;
    }
  });

  result += literalValues.slice(-1);
  return new HtmlString(result);
}

/**
 * wait for element to be added to the DOM
 * @param {string} selector
 * @param {number} timeout
 * @param {(element: HTMLElement) => void} callback
 * @returns {CallableFunction | null} callback to stop observing
 */
function waitForElement(selector, timeout, callback) {
  let matchingElement = /**@type {HTMLElement|null} */ (document.querySelector(selector));
  if (matchingElement) {
    callback(matchingElement);
    return null;
  }

  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (!mutation.addedNodes) continue;

      for (let node of mutation.addedNodes) {
        if (node.matches && node.matches(selector)) {
          callback(node);
          observer.disconnect();
          clearTimeout(timeoutId);
          return;
        }
        if (node.querySelector) {
          matchingElement = /**@type {HTMLElement|null} */ (node.querySelector(selector));
          if (matchingElement !== null) {
            callback(matchingElement);
            observer.disconnect();
            clearTimeout(timeoutId);
            return;
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  const timeoutId = setTimeout(() => {
    observer.disconnect();
    console.log(`Timeout reached: Element "${selector}" not found`);
  }, timeout);

  return () => {
    observer.disconnect();
  };
}

/**
 * Smoothly scrolls the page to the given element with an optional offset above it.
 *
 * @param {HTMLElement} el - The target element to scroll to.
 * @param {number} [offset=20] - The number of pixels to offset above the element.
 * @returns {void}
 */
function scrollToElementWithOffset(el, offset = 20) {
  const rect = el.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const targetY = rect.top + scrollTop - offset;

  window.scrollTo({
    top: targetY,
    behavior: 'smooth'
  });
}

/**
 * Appends a <style> tag with class 'mm-styles' and the given CSS rules to the document head.
 *
 * @param {string} cssText - The CSS rules to insert into the style tag.
 * @returns {HTMLStyleElement} The created style element.
 */
function addStyles(cssText) {
  const styleEl = document.createElement('style');
  styleEl.className = 'mm-styles';
  styleEl.textContent = cssText;
  document.head.appendChild(styleEl);
  return styleEl;
}
