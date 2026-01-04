// ==UserScript==
// @name         SpoilerMan
// @namespace    codesidian.com
// @description  Want to blurr spoilers? Spoiler man to the rescue!
// @version      1.2
// @match        *://*/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @author       Joshua Latham (codesidian.com) & Gemini 2.5 Pro
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/540139/SpoilerMan.user.js
// @updateURL https://update.greasyfork.org/scripts/540139/SpoilerMan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLASS_STORAGE_KEY = 'spoilerManBlurredClasses';
    const MODE_STORAGE_KEY = 'spoilerManMode'; // Stores 'blur' or 'hide'
    const BLUR_STRENGTH_KEY = 'spoilerManBlurStrength'; // Stores the blur strength
    let lastHoveredElement = null;
    const highlightStyle = '2px dashed red';

    function getBlurredClasses() {
        return GM.getValue(CLASS_STORAGE_KEY, []);
    }

    function getDisplayMode() {
        return GM.getValue(MODE_STORAGE_KEY, 'blur');
    }

    function getBlurStrength() {
        return GM.getValue(BLUR_STRENGTH_KEY, 40);
    }

    async function addBlurredClass(className) {
        if (!className || className.trim() === '') return;
        const classes = await getBlurredClasses();
        if (!classes.includes(className)) {
            classes.push(className);
            await GM.setValue(CLASS_STORAGE_KEY, classes);
            window.location.reload();
        } else {
            alert(`'${className}' is already in the blur list.`);
        }
    }

    async function clearBlurredClasses() {
        if (confirm("Are you sure you want to clear all spoiler rules?")) {
            await GM.setValue(CLASS_STORAGE_KEY, []);
            window.location.reload();
        }
    }

    async function toggleDisplayMode() {
        const currentMode = await getDisplayMode();
        const newMode = currentMode === 'blur' ? 'hide' : 'blur';
        await GM.setValue(MODE_STORAGE_KEY, newMode);
        window.location.reload();
    }

    async function setBlurStrength() {
        const currentStrength = await getBlurStrength();
        const newStrengthStr = prompt("Enter new blur strength in pixels (e.g., 20):", currentStrength);
        if (newStrengthStr) {
            const newStrength = parseInt(newStrengthStr, 10);
            if (!isNaN(newStrength) && newStrength >= 0) {
                await GM.setValue(BLUR_STRENGTH_KEY, newStrength);
                window.location.reload();
            } else {
                alert("Invalid input. Please enter a valid non-negative number.");
            }
        }
    }


    function applySpoilerEffect(className, mode, blurStrength) {
        const elementsToModify = document.querySelectorAll('.' + className);
        elementsToModify.forEach(element => {
            if (mode === 'blur') {
                const blurValue = `${blurStrength}px`;
                element.style.display = ''; // Ensure element is visible
                element.style.filter = `blur(${blurValue})`;
                element.style.transition = 'filter 1s ease';
                element.addEventListener('mouseenter', () => element.style.filter = 'blur(0px)');
                element.addEventListener('mouseleave', () => element.style.filter = `blur(${blurValue})`);
            } else {
                element.style.display = 'none';
            }
        });
    }


    function findTargetWithClasses(element) {
        let current = element;
        while (current) {
            if (current.classList && current.classList.length > 0) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    const clickListener = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const usefulTarget = findTargetWithClasses(event.target);
        deactivateSelectionMode();

        if (usefulTarget) {
            addBlurredClass(usefulTarget.classList[0].trim());
        } else {
            alert("Could not find any usable classes for the clicked element or its parents.");
        }
    };

    const hoverListener = (event) => {
        const target = event.target;
        if (lastHoveredElement) {
            lastHoveredElement.style.outline = '';
        }
        target.style.outline = highlightStyle;
        lastHoveredElement = target;
    };

    function deactivateSelectionMode() {
        if (lastHoveredElement) {
            lastHoveredElement.style.outline = '';
        }
        document.body.style.cursor = 'default';
        document.removeEventListener('mouseover', hoverListener);
        document.removeEventListener('click', clickListener, true);
    }

    function activateSelectionMode() {
        alert("Selection mode activated. Hover over elements to highlight them, then click the one you want to blur/hide.");
        document.body.style.cursor = 'crosshair';
        document.addEventListener('mouseover', hoverListener);
        document.addEventListener('click', clickListener, true);
    }

    async function registerMenuCommands() {
        GM.registerMenuCommand('🎯 Select an element to spoil', activateSelectionMode);
        GM.registerMenuCommand('❌ Clear all spoiler rules', clearBlurredClasses);
        GM.registerMenuCommand('⚙️ Set Blur Strength', setBlurStrength);

        const currentMode = await getDisplayMode();
        const nextModeText = currentMode === 'blur' ? 'Hide' : 'Blur';
        GM.registerMenuCommand(`🔄 Switch to ${nextModeText} Mode`, toggleDisplayMode);
    }


    async function main() {
        await registerMenuCommands();

        const classesToAffect = await getBlurredClasses();
        const mode = await getDisplayMode();
        const blurStrength = await getBlurStrength();

        console.log(`SpoilerMan active in '${mode}' mode with blur strength ${blurStrength}px.`);

        if (classesToAffect.length > 0) {
            classesToAffect.forEach(className => {
                applySpoilerEffect(className, mode, blurStrength);
            });
        }
    }

    main();

})();