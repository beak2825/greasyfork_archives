// ==UserScript==
// @name         Remove Rounded Corners
// @name:zh-CN   去圆角（低水平自用）
// @namespace    Hypnos
// @version      1.01
// @description  Remove all rounded corners from web page elements
// @description:zh-cn 去援交（误
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/474712/Remove%20Rounded%20Corners.user.js
// @updateURL https://update.greasyfork.org/scripts/474712/Remove%20Rounded%20Corners.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove border-radius from all elements
    var elements = document.querySelectorAll("*");
    for(var i = 0; i < elements.length; i++) {
        elements[i].style.borderRadius = "0";
    }

        function setRadiusToZero(node) {
        if (node.style) {
            for (let prop in node.style) {
                if (prop.toLowerCase().includes("radius")) {
                    node.style[prop] = "0";
                }
            }
        }

        node.childNodes.forEach(child => {
            setRadiusToZero(child);
        });
    }

    setRadiusToZero(document.documentElement);

    // Remove background-image and border-radius from all images
    var images = document.querySelectorAll("img");
    for(var j = 0; j < images.length; j++) {
        images[j].style.backgroundImage = "none";
        images[j].style.borderRadius = "0";
    }

    // Remove any CSS classes with rounded styles
    var stylesheets = document.styleSheets;
    for (var k = 0; k < stylesheets.length; k++) {
        var rules = stylesheets[j].cssRules;
        for (var l = 0; l < rules.length; l++) {
            var rule = rules[l];
            if (rule.selectorText) {
                if (rule.selectorText.includes('border-radius') || rule.selectorText.includes('border-radius')) {
                    stylesheets[k].deleteRule(l);
                    l--;
                }
            }
        }
    }


        //Finds and sets all computed values containing the word "radius" to 0 in Flex containers and items.
      const allFlexContainers = document.querySelectorAll('*[style*="display:flex"], *[style*="display: inline-flex"]');
  const allFlexItems = document.querySelectorAll('*[style*="flex:"], *[style*="inline-flex:"]');

  allFlexContainers.forEach(flexContainer => {
    Array.from(flexContainer.style).forEach(styleProperty => {
      if (styleProperty.includes('radius')) {
        flexContainer.style[styleProperty] = '0';
      }
    });
  });

  allFlexItems.forEach(flexItem => {
    Array.from(flexItem.style).forEach(styleProperty => {
      if (styleProperty.includes('radius')) {
        flexItem.style[styleProperty] = '0';
      }
    });
  });







})();
