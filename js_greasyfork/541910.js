// ==UserScript==
// @name         Replace Monospace Fonts Globally With PragmataPro
// @namespace    https://github.com/pindab0ter
// @version      1.1
// @description  Replaces all monospace/programming fonts with PragmataPro
// @author       pindab0ter
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541910/Replace%20Monospace%20Fonts%20Globally%20With%20PragmataPro.user.js
// @updateURL https://update.greasyfork.org/scripts/541910/Replace%20Monospace%20Fonts%20Globally%20With%20PragmataPro.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // List of programming/monospace fonts to match (edit as needed)
  const programmingFonts = [
    'monospace',
    'ui-monospace',
    'SFMono-Regular',
    'SF Mono',
    'Menlo',
    'Consolas',
    'Liberation Mono',
    'Geist Mono',
    'Cascadia Code',
    'Fira Mono',
    'JetBrains Mono',
    'PragmataPro',
    'Monaspace Neon'
  ].map(f => f.toLowerCase());

  // Add the PragmataPro font-face
  function ensureFontFace() {
    const fontFaceRule = `
@font-face {
    font-family: PragmataPro;
    src: local("PragmataPro Liga"), local("PragmataPro");
}`;

    // Use GM_addStyle for normal sites
    if (![...document.styleSheets].some(sheet =>
      [...(sheet.cssRules || [])].some(rule =>
        rule instanceof CSSFontFaceRule &&
        /font-family\s*:\s*(['"]?)PragmataPro\1/i.test(rule.cssText)
      )
    )) {
      GM_addStyle(fontFaceRule);
    }
  }

  // Helper to check if a font-family string contains any programming font
  function containsProgrammingFont(familyString, variableResolver) {
    if (!familyString) return false;

    // Check for CSS variables
    const varMatch = familyString.match(/var\((--[^),\s]+)(?:,([^)]+))?\)/);
    if (varMatch) {
      const [_, varName, fallback] = varMatch;
      // Check the fallback directly if it exists
      if (fallback && programmingFonts.some(font =>
        new RegExp(`(^|,|\\s)${font.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}(,|$|\\s)`, 'i').test(fallback))) {
        return true;
      }

      // Also try to resolve the variable
      const resolvedVar = variableResolver && variableResolver(varName.trim());
      if (resolvedVar && containsProgrammingFont(resolvedVar, variableResolver)) {
        return true;
      }
    }

    // Original check on the full string
    return programmingFonts.some(font =>
      new RegExp(`(^|,|\\s)${font.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}(,|$|\\s)`, 'i').test(familyString)
    );
  }

  // Get variable value
  function getCSSVariableValue(varName, el = document.documentElement) {
    return getComputedStyle(el).getPropertyValue(varName)?.trim() || '';
  }

  // Rewrite a font-family string to prepend PragmataPro
  function rewriteFontFamily(original, variableResolver) {
    if (!original) return '"PragmataPro"';

    let expandedString = original.replace(/var\((--[^),\s]+)(?:,([^)]+))?\)/g, (_, varName, fallback) => {
      let resolved = variableResolver && variableResolver(varName.trim());
      if (resolved) return resolved;
      if (fallback) return fallback.trim();
      return '';
    });

    let families = expandedString.split(',').map(f => f.trim()).filter(f => f && !/^["']?PragmataPro["']?$/i.test(f));
    return ['"PragmataPro"', ...families].join(', ');
  }

  // Process stylesheets with CSP workarounds
  function processStyleSheet(sheet) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch (e) {
      return; // Cross-origin protection
    }
    if (!rules) return;
    for (const rule of rules) {
      if (rule.constructor.name === 'CSSStyleRule') {
        const style = rule.style;
        if (!style) continue;

        try {
          const fontFamily = style.getPropertyValue('font-family');
          if (fontFamily && containsProgrammingFont(fontFamily, v => getCSSVariableValue(v, rule.parentStyleSheet.ownerNode?.ownerDocument?.documentElement || document.documentElement))) {
            style.setProperty(
              'font-family',
              rewriteFontFamily(fontFamily, v => getCSSVariableValue(v, rule.parentStyleSheet.ownerNode?.ownerDocument?.documentElement || document.documentElement)),
              style.getPropertyPriority('font-family')
            );
          }
        } catch (e) {
          // Skip if we can't modify this rule due to CSP
        }
      } else if (rule.constructor.name === 'CSSImportRule' && rule.styleSheet) {
        processStyleSheet(rule.styleSheet);
      }
    }
  }

  // Process all stylesheets
  function processAllStyleSheets() {
    for (const sheet of document.styleSheets) {
      try {
        processStyleSheet(sheet);
      } catch (e) {
        // Skip stylesheet if we can't access it
      }
    }
  }

  // Process inline styles
  function processInlineStyles() {
    for (const el of document.querySelectorAll('[style*="font-family"]')) {
      try {
        const styleVal = el.style.fontFamily;
        if (styleVal && containsProgrammingFont(styleVal, v => getCSSVariableValue(v, el))) {
          el.style.fontFamily = rewriteFontFamily(styleVal, v => getCSSVariableValue(v, el));
        }
      } catch (e) {
        // Skip if we can't modify this element's style due to CSP
      }
    }
  }

  // Process CSS variables in :root
  function processCSSVariables() {
    for (const sheet of document.styleSheets) {
      try {
        const rules = sheet.cssRules;
        if (!rules) continue;

        for (const rule of rules) {
          // Look for :root or html selector rules that might contain CSS variables
          if (rule.constructor.name === 'CSSStyleRule' &&
            (rule.selectorText === ':root' || rule.selectorText === 'html')) {

            // Check all CSS variables in the rule
            for (let i = 0; i < rule.style.length; i++) {
              const prop = rule.style[i];
              if (prop.startsWith('--') && (prop.toLowerCase().includes('mono') || prop.toLowerCase().includes('font'))) {
                try {
                  const value = rule.style.getPropertyValue(prop);

                  if (containsProgrammingFont(value, getCSSVariableValue)) {
                    const newValue = rewriteFontFamily(value, getCSSVariableValue);
                    rule.style.setProperty(prop, newValue, rule.style.getPropertyPriority(prop));
                  }
                } catch (e) {
                  // Skip if we can't modify this variable due to CSP
                }
              }
            }
          }
        }
      } catch (e) {
        // Skip stylesheet if we can't access it
      }
    }
  }

  // Observe for style changes
  function observeStyles() {
    const observer = new MutationObserver(mutations => {
      let needsProcessing = false;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
              needsProcessing = true;
            } else if (node.hasAttribute && node.hasAttribute('style')) {
              processInlineStyles();
            } else if (node.querySelectorAll) {
              // Check if any children have style attributes
              if (node.querySelectorAll('[style*="font-family"]').length > 0) {
                processInlineStyles();
              }
            }
          }
        }
      }

      if (needsProcessing) {
        setTimeout(() => {
          processAllStyleSheets();
          processCSSVariables();
        }, 20);
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  // Initial setup
  function initialize() {
    ensureFontFace();

    // Process existing styles
    processAllStyleSheets();
    processInlineStyles();
    processCSSVariables();

    // Set up observer for changes
    observeStyles();
  }

  // Start ASAP
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Re-run after full load to catch late-loaded styles
  window.addEventListener('load', () => {
    processAllStyleSheets();
    processInlineStyles();
    processCSSVariables();
  });
})();
