// ==UserScript==
// @name          TradingView: Old Dark Theme (Desktop and Mobile)
// @description   Changes color theme back to original dark theme
// @version       4.4.2
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @match         https://www.tradingview.com/*
// @run-at        document-start
// @grant         GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/528075/TradingView%3A%20Old%20Dark%20Theme%20%28Desktop%20and%20Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528075/TradingView%3A%20Old%20Dark%20Theme%20%28Desktop%20and%20Mobile%29.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function() {
  'use strict';

  const DOM_REPLACE_LIST = [
    {
      propNameRegex: /^--color-cold-gray-200$/i,
      propValues: {
        '#dbdbdb': '#d5d7e1', // most text except broker tables
      },
    },

    {
      propNameRegex: /^--color-cold-gray-900$/i,
      propValues: {
        '#0f0f0f': '#131722', // main ui
      },
    },

    {
      propNameRegex: /^--color-cold-gray-800$/i,
      propValues: {
        '#2e2e2e': '#2c313b', // canvas outline and dividers and also button hover
      },
    },

    {
      propNameRegex: /^--color-cold-gray-700$/i,
      propValues: {
        '#4a4a4a': '#454a53', // dividers and outlines
      },
    },

    {
      propNameRegex: /^--color-cold-gray-750$/i,
      propValues: {
        '#3d3d3d': '#2c313b', // another divider type
      },
    },

    {
      propNameRegex: /^--color-cold-gray-850$/i,
      propValues: {
        '#1f1f1f': '#1d222e', // favorites toolbar and dialogue boxes
      },
    },
  ];

  const CANVAS_METHODS = {
    fill: {
      original: CanvasRenderingContext2D.prototype.fill,
      replaceMap: {
        '#0f0f0f': '#131722', // chart widget background except new "delete" button on alerts
      },
    },

    fillRect: {
      original: CanvasRenderingContext2D.prototype.fillRect,
      replaceMap: {
        '#303030': '#2c313b', // don't know what this does
      },
    },

    fillText: {
      original: CanvasRenderingContext2D.prototype.fillText,
      replaceMap: {
        '#d9d9d9': '#d5d7e1', // don't know what this does
      },
    },
  };

  for (const method in CANVAS_METHODS) {
    CanvasRenderingContext2D.prototype[method] = function(...args) {
      const newColor = CANVAS_METHODS[method].replaceMap[this.fillStyle];

      if (newColor) this.fillStyle = newColor;

      return CANVAS_METHODS[method].original.apply(this, args);
    };
  }

  DOM_REPLACE_LIST.forEach((item) => {
    Object.keys(item.propValues).forEach((hex) => {
      item.propValues[hexToRgb(hex)] = item.propValues[hex];
    });
  });

  await waitForHead();

  GM_addStyle([
    // Miscellaneous conflicts fixes
    `
      div[class*="firstItem-"] {
        border-top-color: #0000 !important;
      }
    `,

    `
      tr[data-row-linked=true] div[class*="title-"] {
        background-color: #2962ff !important;
      }
    `,

    // Get back buttons that used to be blue
    `
      html.theme-dark button[class*="black-"][class*="secondary-"] {
        --ui-lib-button-default-color-content: #4364c7 !important;
        --ui-lib-button-default-color-border: #4364c7 !important;
        --ui-lib-button-default-color-bg: none !important;
      }

      html.theme-dark button[class*="black-"][class*="secondary-"]:hover {
        --ui-lib-button-default-color-content: white !important;
        --ui-lib-button-default-color-border: #4364c7 !important;
        --ui-lib-button-default-color-bg: #2863ff !important;
      }

      html.theme-dark button[class*="black-"][class*="primary-"] {
        --ui-lib-button-default-color-content: white !important;
        --ui-lib-button-default-color-border: #4364c7 !important;
        --ui-lib-button-default-color-bg: #2863ff !important;
      }

      html.theme-dark button[class*="black-"][class*="primary-"]:hover {
        --ui-lib-button-default-color-content: white !important;
        --ui-lib-button-default-color-border: #4364c7 !important;
        --ui-lib-button-default-color-bg: #2559e9 !important;
      }
    `,
  ].join(' '));

  const handledStylesheets = new WeakSet();
  const overrideStyle = GM_addStyle();
  let previousStylesheetsAmount = 0;

  new MutationObserver(() => main()).observe(document.head, { childList: true });

  main();

  function main() {
    if (document.styleSheets.length === previousStylesheetsAmount) return;

    previousStylesheetsAmount = document.styleSheets.length;

    const newRules = [];

    for (const sheet of document.styleSheets) {
      if (handledStylesheets.has(sheet)) continue;

      try {
        newRules.push(...(getNewRulesFromCSSRules(sheet.cssRules)));

        handledStylesheets.add(sheet);
      } catch (e) {
        if (!e.message.includes('Not allowed to access cross-origin stylesheet')) {
          console.error(e);
        }
      }
    }

    if (newRules.length) {
      document.head.appendChild(overrideStyle);

      overrideStyle.textContent = `${overrideStyle.textContent} ${newRules.join(' ')}`;
    }
  }

  // utils --------------------------------------------------------------------------------

  function getNewRulesFromCSSRules(rules) {
    const newRules = [];

    for (const rule of rules) {
      if (
        rule instanceof CSSMediaRule ||
        rule instanceof CSSSupportsRule
      ) {
        const newRulesOfRule = getNewRulesFromCSSRules(rule.cssRules);

        if (newRulesOfRule.length) {
          newRules.push(
            `@${rule instanceof CSSMediaRule ? 'media' : 'support'} ${rule.conditionText} {${newRulesOfRule.join(' ')}}`
          );
        }
      }

      else if (rule instanceof CSSStyleRule) {
        const updatedProps = getUpdatedCSSStyleRuleProps(rule);

        if (updatedProps.length) {
          let newRuleContent = '';

          for (const updated of updatedProps) {
            newRuleContent += `${updated.propName}: ${updated.propValue};`;
          }

          newRules.push(`${rule.selectorText} {${newRuleContent}}`);
        }
      }
    }

    return newRules;
  }

  function getUpdatedCSSStyleRuleProps(rule) {
    const updatedProps = [];

    // Remove selector, remove parenthesis and spaces near them
    let parsedRule = rule.cssText
      .slice(rule.selectorText.length)
      .replace(/\s*{\s*|\s*}\s*/g, '');

    if (!parsedRule) return updatedProps;

    // Remove ";" if it is a last char,
    // split rule by ";" if it is not followed by "base64",
    // split rule entry by ":" and trim
    // which results in an array of [propName, propValue] arrays
    parsedRule = parsedRule
      .replace(/;$/, '').split(/;(?!base64)/)
      .map(rule => rule.split(':').map(s => s.trim()));

    // Lowercase prop values and remove spaces between comas to unify rgb notation.
    // Example: rgb(1, 2, 3) -> rgb(1,2,3)
    parsedRule = parsedRule.map(([propName, propValue]) => {
      return [propName, propValue.replace(/\s*,\s*/g, ',').toLowerCase()];
    });

    for (const { propNameRegex, propValues } of DOM_REPLACE_LIST) {
      for (const [propName, propValue] of parsedRule) {
        if (!propNameRegex.test(propName)) continue;

        for (const [from, to] of Object.entries(propValues)) {
          if (propValue.includes(from)) {
            updatedProps.push({
              propName,
              propValue: propValue.replaceAll(from, to),
            });

            break;
          }
        }
      }
    }

    return updatedProps;
  }

  function hexToRgb(hex) {
    const parseResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!parseResult) throw new Error('Bad input');

    const r = parseInt(parseResult[1], 16);
    const g = parseInt(parseResult[2], 16);
    const b = parseInt(parseResult[3], 16);

    return `rgb(${r},${g},${b})`;
  }

  async function waitForHead() {
    if (!document.head) {
      await new Promise(r => setTimeout(r));
      return waitForHead();
    }
  }
}());
