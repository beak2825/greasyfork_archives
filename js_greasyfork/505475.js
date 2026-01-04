// ==UserScript==
// @name         Modern Scratch Modifier GUI
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Provides a modern GUI to modify Scratch blocks and create games using the Scratch API.
// @match        *://scratch.mit.edu/*
// @match        *://scratch.mit.edu/projects/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/505475/Modern%20Scratch%20Modifier%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/505475/Modern%20Scratch%20Modifier%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for the modern GUI
    const style = `
        #scratch-modifier-gui {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 350px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
            transition: opacity 0.3s ease;
        }
        #scratch-modifier-gui .section {
            margin-bottom: 15px;
            position: relative;
        }
        #scratch-modifier-gui .close-btn {
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
            color: #333;
            font-size: 18px;
            transition: color 0.3s ease;
        }
        #scratch-modifier-gui .close-btn:hover {
            color: #f00;
        }
        #scratch-modifier-gui h2 {
            font-size: 16px;
            color: #333;
            margin-bottom: 10px;
        }
        #scratch-modifier-gui input[type="color"] {
            border: none;
            border-radius: 4px;
            width: 100%;
            height: 30px;
            cursor: pointer;
            outline: none;
        }
        #scratch-modifier-gui textarea {
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
            resize: vertical;
        }
        #scratch-modifier-gui button {
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            color: #fff;
            padding: 10px 15px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 100%;
            font-size: 14px;
            margin-top: 10px;
        }
        #scratch-modifier-gui button:hover {
            background-color: #0056b3;
        }
        #scratch-modifier-gui #tips {
            background-color: #e9ecef;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            margin-top: 10px;
            display: none;
        }
    `;

    $('<style>').text(style).appendTo('head');

    // Create GUI structure
    const guiHTML = `
        <div id="scratch-modifier-gui">
            <div class="section">
                <div class="close-btn">×</div>
                <h2>Block Modifier</h2>
                <label for="block-color">Block Color:</label>
                <input type="color" id="block-color">
                <label for="inside-color">Inside Color:</label>
                <input type="color" id="inside-color">
                <button id="apply-colors">Apply Colors</button>
            </div>
            <div class="section">
                <h2>Game Generator</h2>
                <textarea id="game-prompt" rows="4" placeholder="Enter your game prompt here..."></textarea>
                <button id="generate-game">Generate Game</button>
            </div>
            <div class="section">
                <h2>Tips & Tricks</h2>
                <button id="show-tips">Show Tips</button>
                <div id="tips">
                    <p>Tip 1: Use variables to keep track of scores.</p>
                    <p>Tip 2: Test your game frequently to catch bugs.</p>
                </div>
            </div>
        </div>
    `;

    $('body').append(guiHTML);

    // Close button functionality
    $('#scratch-modifier-gui .close-btn').click(function() {
        $('#scratch-modifier-gui').fadeOut();
    });

    // Apply colors functionality
    $('#apply-colors').click(function() {
        const blockColor = $('#block-color').val();
        const insideColor = $('#inside-color').val();
        // Here you would use the Scratch API to apply these colors to blocks
        console.log(`Applying Block Color: ${blockColor}, Inside Color: ${insideColor}`);
    });

    // Generate game functionality
    $('#generate-game').click(function() {
        const prompt = $('#game-prompt').val();
        // Here you would use the Scratch API to generate a game based on the prompt
        console.log(`Generating game with prompt: ${prompt}`);
    });

    // Show tips functionality
    $('#show-tips').click(function() {
        $('#tips').toggle();
    });

    // Add additional functionality and API integration as needed
})();
