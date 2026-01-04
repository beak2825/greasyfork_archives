// ==UserScript==
// @name         MolView Keybindings
// @namespace    https://shitchell.com/
// @description  Add keybindings to molview.org
// @author       Shaun Mitchell <shaun@shitchell.com>
// @license      wtfpl
// @grant        GM_addStyle
// @match        https://molview.org/*
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/411314/MolView%20Keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/411314/MolView%20Keybindings.meta.js
// ==/UserScript==

// Send stuff to the console
var DEBUG = true;
var clickedToU = false;
var observer = null;

function debug()
{
    if (DEBUG)
    {
        let args = Array.from(arguments);
        args.unshift("[MolView KeyBindings]");
        console.log.apply(null, args);
    }
}

// Binds a key to clicking an element with the given id
function keyBindId(key, id)
{
    document.body.addEventListener('keypress', function(ev) {
        if (ev.key === key && ev.target === document.body)
        {
            debug("got keypress event", ev, "matching keybinding for", document.getElementById(id));
            document.getElementById(id).click()
        }
    });
}

function keyBindFunction(key, func)
{
    document.body.addEventListener('keypress', function(ev) {
        if (ev.key === key)
        {
            debug("got keypress event", ev, "matching function", func);
            func();
        }
    });
}

// Accepts the shortform of an element (e.g. C, S, Cl...)
function setElement(element)
{
    unsafeWindow.Sketcher.molpad.setTool("atom", {
        element: element
    });
    unsafeWindow.MolView.hideDialogs()
}

// Creates a dialog to enter an element name
function createElementDialog()
{
    // Create the input element
    let input = document.createElement('input');
    input.id = 'element-input';
    input.placeholder = 'Element Symbol';

    // Create the form
    let form = document.createElement('form');
    form.id = 'element-input-form';
    form.onsubmit = function(e) {
        e.preventDefault();
        e.stopPropagation();
        let elementShortName = document.getElementById('element-input').value;
        debug("input element", elementShortName);
        // Verify that this is a valid element
        if (elementShortName in unsafeWindow.ElementsMolarTable)
        {
            // Set the element
            setElement(elementShortName);

            // Remove the element input form
            form.parentElement.removeChild(form);
        } else {
            debug("element not found", elementShortName);
        }
    }

    // Text color reflects validity of element and escape exits
    input.addEventListener('keyup', function(ev) {
        // Get the current input text
        let elementShortName = document.getElementById('element-input').value;

        if (ev.key === 'Escape')
        {
            // Remove the dialog box
            form.parentElement.removeChild(form);
        } else if (elementShortName === "") {
            this.classList.remove('invalid');
        } else {
            // Validate the element symbol
            if (elementShortName in unsafeWindow.ElementsMolarTable)
            {
                this.classList.remove('invalid');
            } else {
                this.classList.add('invalid');
            }
        }
    });

    // Add the input box to the form
    form.appendChild(input);

    // Add the form to the page
    document.body.appendChild(form);

    // Focus the input box
    input.focus();
}

// Watch for new elements (all of this mutation crap is strictly to click the initial "Close" button on the ToU
function isElement(obj) {
    return obj instanceof Element || obj instanceof HTMLDocument;
}
function closeWelcome() {
    let closeBtn = document.querySelector("#welcome-button-bar .btn.close");
    debug("checking for closeBtn", closeBtn);
    if (isElement(closeBtn))
    {
        // Close the dialog
        debug("clicking close button and killing observer");
        unsafeWindow.MolView.hideDialogs();

        // Remove the style to hide the dialog
        GM_addStyle(`#dialog-overlay {
            display: block;
        }`);

        // Kill the observer
        observer.disconnect();
        observer = null;
    }
}

(function()
 {
    'use strict';

    // Hide the agreement popup
    GM_addStyle(`#dialog-overlay {
        display: none;
    }`);

    // Style the element input dialog
    GM_addStyle(`#element-input {
		position: fixed;
		width: 10em;
		height: 1.5em;
		z-index: 9001;
		bottom: 1em;
		left: 1em;
		border: none;
		background-image: none;
		background-color: transparent;
		-webkit-box-shadow: none;
		-moz-box-shadow: none;
		box-shadow: none;
		border-bottom: 1px solid black;
		background: rgba(255, 255, 255, 0.9);
    }`);
    GM_addStyle(`#element-input.invalid {
        color: red;
    }`);
    GM_addStyle(`#element-input::before {
        content: 'Element: ';
    }`);

    // Click the agreement button when it loads
    observer = new MutationObserver(function(mutations) {
        closeWelcome();
    });
    observer.observe(document, {
        attributes: false,
        childList: true,
        characterData: false,
        subtree:true
    });

    //// Tools

    // m: drag tool
    keyBindId('m', 'action-mp-drag');

    // c: clean structure
    keyBindId('c', 'action-mp-clean');

    // e: eraser
    keyBindId('e', 'action-mp-eraser');

    // u: update 3d model
    keyBindId('u', 'action-resolve');

    // s: single bond
    keyBindId('s', 'action-mp-bond-single');

    // d: double bond
    keyBindId('d', 'action-mp-bond-double');

    // t: triple bond
    keyBindId('t', 'action-mp-bond-triple');

    // =: add charge
    keyBindId('=', 'action-mp-charge-add');

    // -: subtract charge
    keyBindId('-', 'action-mp-charge-sub');

    //// Elements

    // -: subtract charge
    keyBindId('C', 'action-mp-atom-c');

    // -: subtract charge
    keyBindId('H', 'action-mp-atom-h');

    // -: subtract charge
    keyBindId('N', 'action-mp-atom-n');

    // -: subtract charge
    keyBindId('O', 'action-mp-atom-o');

    // E: enter element
    keyBindFunction('E', createElementDialog);
})();