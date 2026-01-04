// ==UserScript==
// @name         屏蔽博客园和CSDN动态背景
// @namespace    https://www.cnblogs.com/
// @version      0.4
// @description  移除博客园和CSDN页面上的动态背景和特效
// @author       yakoye
// @match        *://*.cnblogs.com/*
// @match        https://blog.csdn.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497169/%E5%B1%8F%E8%94%BD%E5%8D%9A%E5%AE%A2%E5%9B%AD%E5%92%8CCSDN%E5%8A%A8%E6%80%81%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/497169/%E5%B1%8F%E8%94%BD%E5%8D%9A%E5%AE%A2%E5%9B%AD%E5%92%8CCSDN%E5%8A%A8%E6%80%81%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

// 测试网页 CSDN： https://blog.csdn.net/m0_63574813/article/details/130313383
//        博客园：https://www.cnblogs.com/brady-wang/p/10565156.html
(function() {
    'use strict';

    console.log("Tampermonkey script loaded");

    // Function to remove the particle effect scripts and canvases on cnblogs
    function removeParticleEffects() {
        // Get all script elements
        var scripts = document.getElementsByTagName('script');

        // Iterate over the script elements
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];

            // Check if the script contains particle effect initialization
            if (script.src.includes("particles.min.js") || script.innerHTML.includes("particlesJS")) {
                script.remove();
                console.log("Removed particle effect script:", script);
            }
        }

        // Remove canvas elements related to particle effects
        var canvases = document.getElementsByTagName('canvas');
        for (var j = 0; j < canvases.length; j++) {
            var canvas = canvases[j];
            canvas.remove();
            console.log("Removed canvas element:", canvas);
        }
    }

    // Function to remove the dynamic background images on CSDN
    function removeCSDNBackground() {
        var hasAnimatedBackground = false;
        try {
            var element = document.querySelector('body');
            var styles = window.getComputedStyle(element);
            if (styles.backgroundImage.indexOf(".gif") !== -1) {
                hasAnimatedBackground = true;
            }
        } catch (e) {}

        if (hasAnimatedBackground) {
            var style = document.createElement('style');
            style.innerHTML = `
            * {
                animation: none !important;
                transition: none !important;
            }
            body {
                background-image: none !important;
            }
            `;
            document.head.appendChild(style);

            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    var addedNodes = mutation.addedNodes;
                    addedNodes.forEach(function (node) {
                        if (node.nodeType !== Node.ELEMENT_NODE) {
                            return;
                        }

                        var nodeStyle = node.getAttribute("style");
                        if (nodeStyle != null) {
                            if (nodeStyle.includes("animation")) {
                                node.style.animation = "none";
                            }
                            if (nodeStyle.includes("transition")) {
                                node.style.transition = "none";
                            }
                        }

                        var bgStyle = node.style.backgroundImage;
                        if (bgStyle.indexOf(".gif") !== -1) {
                            node.style.backgroundImage = "none";
                        }
                    });
                });
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }

    // Detect if the site is CSDN or cnblogs and run the respective function
    if (window.location.host.indexOf('cnblogs.com') > -1) {
        console.log("Running script for cnblogs");
        // Run the function to remove particle effects
        removeParticleEffects();

        // Observe for added scripts dynamically
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    removeParticleEffects();
                }
            });
        });

        // Observe changes in the document
        observer.observe(document.documentElement, { childList: true, subtree: true });

    } else if (window.location.host.indexOf('csdn.net') > -1) {
        console.log("Running script for csdn");
        // Run the function to remove CSDN background
        removeCSDNBackground();
    }

})();
