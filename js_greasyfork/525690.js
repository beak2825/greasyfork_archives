// ==UserScript==
// @name         Custom Scratch Block Maker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Create custom blocks for Scratch
// @author       You
// @match        https://scratch.mit.edu/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525690/Custom%20Scratch%20Block%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/525690/Custom%20Scratch%20Block%20Maker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a sidebar menu for custom blocks
    const sidebar = document.createElement('div');
    sidebar.id = 'custom-block-sidebar';
    sidebar.style.position = 'fixed';
    sidebar.style.top = '10px';
    sidebar.style.left = '10px';
    sidebar.style.backgroundColor = 'white';
    sidebar.style.border = '1px solid #ccc';
    sidebar.style.padding = '10px';
    sidebar.style.zIndex = '1000';

    const header = document.createElement('h3');
    header.innerText = 'Custom Scratch Block Maker';
    sidebar.appendChild(header);

    const blockNameLabel = document.createElement('label');
    blockNameLabel.innerText = 'Block Name: ';
    const blockNameInput = document.createElement('input');
    blockNameInput.type = 'text';
    sidebar.appendChild(blockNameLabel);
    sidebar.appendChild(blockNameInput);

    const blockCategoryLabel = document.createElement('label');
    blockCategoryLabel.innerText = 'Block Category: ';
    const blockCategoryInput = document.createElement('input');
    blockCategoryInput.type = 'text';
    sidebar.appendChild(blockCategoryLabel);
    sidebar.appendChild(blockCategoryInput);

    const createBlockButton = document.createElement('button');
    createBlockButton.innerText = 'Create Block';
    createBlockButton.onclick = function() {
        const blockName = blockNameInput.value;
        const blockCategory = blockCategoryInput.value;
        if (blockName && blockCategory) {
            addCustomBlock(blockName, blockCategory);
        }
    };
    sidebar.appendChild(createBlockButton);

    document.body.appendChild(sidebar);

    // Function to add the custom block to Scratch
    function addCustomBlock(blockName, blockCategory) {
        // Create the custom block element in the Scratch blocks menu
        const customBlock = document.createElement('block');
        customBlock.setAttribute('type', blockName);
        customBlock.setAttribute('category', blockCategory);

        // Add to Scratch's block palette
        const blockMenu = document.querySelector('.blocklyToolbox');
        const newBlockCategory = document.createElement('category');
        newBlockCategory.setAttribute('name', blockCategory);
        newBlockCategory.appendChild(customBlock);
        blockMenu.appendChild(newBlockCategory);

        // Map the block to Scratch's scripting area functionality (simplified)
        const blockly = window.Blockly;
        const blockDef = {
            init: function() {
                this.appendDummyInput()
                    .appendField(blockName);
                this.setColour(160);
                this.setOutput(true, null);
                this.setTooltip('Custom block');
                this.setHelpUrl('');
            }
        };

        blockly.Blocks[blockName] = blockDef;

        // Refresh the Scratch editor to show the new block
        blockly.selected = null;
        blockly.svgResize();
    }
})();
