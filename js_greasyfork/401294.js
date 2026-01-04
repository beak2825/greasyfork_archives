// ==UserScript==
// @name         Pardus Y-Hole Jumper
// @author       Math (Orion)
// @namespace    fear.math@gmail.com
// @include      http*://*.pardus.at/*main.php*
// @version      1.1
// @description  Allows you to pre-select a destination for y-holes and jump with one keypress to avoid sniping.
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/401294/Pardus%20Y-Hole%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/401294/Pardus%20Y-Hole%20Jumper.meta.js
// ==/UserScript==

// Global constants
const X_HOLES = {
    'Nex Kataam (WPR)' : 47811,
    'Nex 0001 (Lane)'  : 83339,
    'Nex 0002 (NPR)'   : 44580,
    'Nex 0003 (SPR)'   : 55343,
    'Nex 0004 (EPR)'   : 97698,
    'Nex 0005 (Split)' : 324730,
    'Nex 0006 (Gap)'   : 379305
};

const DEFAULT_X_HOLE = 44580; // Nex 0002 (NPR)
const DEFAULT_KEY    = 'Y';
const DIV_WIDTH      = 400;
const DIV_HEIGHT     = 175;
const FORM_WIDTH     = 179;
const BUTTON_WIDTH   = 130;

// Get xhole and jump key from memory
let selectedXHole = GM_getValue('yj_xhole', DEFAULT_X_HOLE);
let jumpKey       = GM_getValue('yj_key', DEFAULT_KEY);

// Create configuration div
let configDiv = getConfigurationDiv();

// Add listener for jump/config key
window.addEventListener('keydown', function(key) {
    if (String.fromCharCode(key.keyCode) != jumpKey) {
        return;
    }

    let form    = document.getElementById('xholebox');
    let canJump = !!form;

    if (canJump) {
        // Select desired xhole and jump
        let xHoleDropdown   = form.children[0];
        xHoleDropdown.value = selectedXHole;

        form.submit();
    }
    else {
        // Show configuration div when key is pressed
        configDiv.style.display = 'initial';
    }
});


// Credit to Victoria Axworthy (Orion), whose SG Combat script configurator this is based on
function getConfigurationDiv() {
    // Create main div
    let configDiv = document.createElement('div');

    configDiv.style.backgroundColor = '#00002C';
    configDiv.style.border = '2px outset #335';
    configDiv.style.borderRadius = '8px';
    configDiv.style.left = '50%';
    configDiv.style.top = '35%';
    configDiv.style.width = DIV_WIDTH + 'px';
    configDiv.style.height = DIV_HEIGHT + 'px';
    configDiv.style.marginLeft = -DIV_WIDTH / 2 + 'px';
    configDiv.style.marginTop = -DIV_HEIGHT / 2 + 'px';
    configDiv.style.position = 'fixed';
    configDiv.style.zIndex = 9;
    configDiv.style.display = 'none';

    document.body.appendChild(configDiv);

    // Add header and description at the top
    let header = document.createElement('h3');
    header.style.textAlign = 'center';
    header.innerHTML = 'Y-Hole Jumper';
    configDiv.appendChild(header);

    let description = document.createElement('p');
    description.style.textAlign = 'center';
    description.innerHTML = 'Select the x-hole you would like to jump to, then press the jump key on an x-hole or y-hole to jump there. If you are not on an x-hole or y-hole, the jump key will open this configuration page.';
    configDiv.appendChild(description);

    // Add form for x-hole and jump key
    let configForm = document.createElement('form');
    configForm.style.marginLeft = (DIV_WIDTH - FORM_WIDTH) / 2 + 'px';
    configForm.style.display = 'table';
    configDiv.appendChild(configForm);

    let xHoleOptions = Object.keys(X_HOLES).map(function(xHoleName) {
        let xHoleValue = X_HOLES[xHoleName];
        let isSelected = xHoleValue == selectedXHole ? ' selected' : '';

        return `<option value="${xHoleValue}"${isSelected}>${xHoleName}</option>`;
    }).join('');

    configForm.innerHTML = `<p style="display: table-row;">
<label for="yj-xhole" style="display: table-cell;">X-hole:</label>
<select id="yj-xhole" style="display: table-cell;">
${xHoleOptions}
</select>
</p>
<p style="display: table-row;">
<label for="yj-key" style="display: table-cell; padding-top: 8px;">Jump Key:&nbsp;</label>
<input id="yj-key" style="text-align: center; display: table-cell;" size="1" type="text" value="${jumpKey}">
</p>`;

    // Add Save and Cancel buttons
    let buttonContainer = document.createElement('div');
    buttonContainer.style.width = BUTTON_WIDTH + 'px';
    buttonContainer.style.margin = 'auto';
    configDiv.appendChild(buttonContainer);

    let cancelButton = document.createElement('button');
    cancelButton.style.margin = '5px';
    cancelButton.innerHTML = 'Cancel';
    cancelButton.addEventListener('click', cancel);
    buttonContainer.appendChild(cancelButton);

    let saveButton = document.createElement('button');
    saveButton.style.margin = '5px';
    saveButton.innerHTML = 'Save';
    saveButton.addEventListener('click', save);
    buttonContainer.appendChild(saveButton);

    return configDiv;
}


function save() {
    let xHoleSelector = document.getElementById('yj-xhole');
    let jumpKeySelector = document.getElementById('yj-key');

    let newJumpKey = jumpKeySelector.value;

    if (newJumpKey.length == 0) {
        alert('Your jump key cannot be blank.');
        return;
    }

    if (newJumpKey.length > 1) {
        alert('Your jump key cannot be more than one character.');
        return;
    }

    selectedXHole = xHoleSelector.value;
    jumpKey = newJumpKey.toUpperCase();
    jumpKeySelector.value = jumpKey;

    GM_setValue('yj_xhole', selectedXHole);
    GM_setValue('yj_key', jumpKey);

    close();
}


function cancel() {
    document.getElementById('yj-xhole').value = selectedXHole;
    document.getElementById('yj-key').value = jumpKey;

    close();
}


function close() {
    configDiv.style.display = 'none';
}
