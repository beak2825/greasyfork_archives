// ==UserScript==
// @name         Crushon.ai Character Circle Counter
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Dynamic Character counter for CrushOn.ai
// @author       Discord: @Squishything (functionality) and @alphawuff (minor styling)
// @match        https://crushon.ai/character*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/535158/Crushonai%20Character%20Circle%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/535158/Crushonai%20Character%20Circle%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addCharacterCounter() {
        const textarea = document.querySelector('textarea');
        if (!textarea) {
            setTimeout(addCharacterCounter, 500);
            return;
        }

        if (document.querySelector('.circle-counter-container')) return;

        const container = document.createElement('div');
        container.className = 'circle-counter-container';
        container.style.position = 'relative';
        container.style.width = '40px';
        container.style.height = '40px';
        container.style.marginTop = '10px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.pointerEvents = 'none';

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "40");
        svg.setAttribute("height", "40");
        svg.style.transform = "rotate(-90deg)";

        const r = 20;
        const cx = 20;
        const cy = 20;
        const strokeWidth = 3;
        const circumference = 2 * Math.PI * r;

        const bgCircle = document.createElementNS(svgNS, "circle");
        bgCircle.setAttribute("cx", cx);
        bgCircle.setAttribute("cy", cy);
        bgCircle.setAttribute("r", r);
        bgCircle.setAttribute("stroke", "#444");
        bgCircle.setAttribute("stroke-width", strokeWidth);
        bgCircle.setAttribute("fill", "none");

        const progressCircle = document.createElementNS(svgNS, "circle");
        progressCircle.setAttribute("cx", cx);
        progressCircle.setAttribute("cy", cy);
        progressCircle.setAttribute("r", r);
        progressCircle.setAttribute("stroke", "green");
        progressCircle.setAttribute("stroke-width", strokeWidth);
        progressCircle.setAttribute("fill", "none");
        progressCircle.setAttribute("stroke-dasharray", circumference.toString());
        progressCircle.setAttribute("stroke-dashoffset", circumference.toString());
        progressCircle.style.transition = 'stroke-dashoffset 0.3s ease, stroke 0.3s ease';

        const text = document.createElement('div');
        text.className = 'circle-counter-text';
        text.style.position = 'absolute';
        text.style.fontSize = '10px';
        text.style.fontWeight = 'bold';
        text.style.color = 'white';
        text.style.textShadow = '0px 0px 3px green';
        text.textContent = '0';

        svg.appendChild(bgCircle);
        svg.appendChild(progressCircle);
        container.appendChild(svg);
        container.appendChild(text);

        // Insert directly after the textarea
        textarea.parentNode.insertBefore(container, textarea.nextSibling);

        function resetCounter() {
              if(textarea.value.length < 3000){
                   setTimeout(function() {
                      text.textContent = '0';
                      text.style.color = 'white';
                      text.style.textShadow = '0px 0px 3px white';
                      const offset = circumference * (1 - 0);
                      progressCircle.setAttribute("stroke-dashoffset", offset.toString());
                      //textarea.value = '';
                  }, 500);
              }
            }

            textarea.addEventListener('change', function() {
                resetCounter();
            });

        function updateCircleCounter() {
            const count = textarea.value.length;
            const max = 3000;
            const warning = 2800;

            const percent = Math.min(count / max, 1);
            const offset = circumference * (1 - percent);
            progressCircle.setAttribute("stroke-dashoffset", offset.toString());
            text.textContent = count.toString();

            if (count > warning) {
                progressCircle.setAttribute("stroke", "red");
                text.style.color = 'orange';
                text.style.textShadow = '0 0 4px red';
            } else {
                progressCircle.setAttribute("stroke", "green");
                text.style.color = 'white';
                text.style.textShadow = '0 0 3px green';
            }
        }

        textarea.addEventListener('input', updateCircleCounter);

        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                addCharacterCounter();
            }
        }).observe(document, { subtree: true, childList: true });

        updateCircleCounter();
    }

    window.addEventListener('load', addCharacterCounter);
})();