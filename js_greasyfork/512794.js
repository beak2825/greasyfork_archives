// ==UserScript==
// @name         Heart's RW House Helper
// @namespace    http://tampermonkey.net/
// @version      1
// @description  A helper script for pasting content into HTML templates for Heart's RW House
// @author       Heart [3034011]
// @match        https://www.torn.com/forums.php#/p=threads&f=10&t=16390598&b=0&a=0
// @match        https://www.torn.com/forums.php#/p=threads&f=10&t=16390598&b=0&a=*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/512794/Heart%27s%20RW%20House%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/512794/Heart%27s%20RW%20House%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS styles
    GM_addStyle(`
        body {
            background-color: #121212; /* Dark background for dark mode */
            color: #ffffff; /* Light text color */
        }
        .rw-container {
            position: fixed;
            bottom: 60px;
            right: 10px;
            background: #1e1e1e; /* Darker container background */
            border: 1px solid #444;
            padding: 10px;
            z-index: 10000;
            display: none; /* Hidden by default */
            width: 300px;
            height: auto; /* Adjusted for better layout */
            overflow-y: auto;
            border-radius: 8px; /* Rounded corners */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); /* Subtle shadow for depth */
        }
        .rw-button, .paste-button {
            background-color: #007bff; /* Primary button color */
            color: white;
            border: none;
            border-radius: 4px; /* Rounded button corners */
            padding: 5px 10px; /* Padding for buttons */
            margin-top: 5px; /* Margin for spacing */
            cursor: pointer;
            font-size: 14px; /* Font size for buttons */
            transition: background-color 0.3s; /* Transition for hover effect */
        }
        .rw-button:hover, .paste-button:hover {
            background-color: #0056b3; /* Darker shade on hover */
        }
        .rw-output {
            border: 1px solid #444;
            padding: 10px;
            margin-top: 10px;
            white-space: pre-wrap;
            max-height: 100px;
            overflow-y: auto;
            background-color: #222; /* Darker background for output */
            border-radius: 4px; /* Rounded corners for output */
        }
        .add-button {
            position: fixed;
            bottom: 120px; /* Moved higher */
            right: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 18px;
            z-index: 10001;
            cursor: pointer;
        }
    `);

    // Create the "Add" button
    const addButton = document.createElement('button');
    addButton.className = 'add-button';
    addButton.textContent = 'Add';
    document.body.appendChild(addButton);

    // Create the main container
    const container = document.createElement('div');
    container.className = 'rw-container';
    container.innerHTML = `
        <h3>Heart's RW House Helper</h3>
        <textarea id="html1Input" rows="2" cols="30" placeholder="Paste HTML1 here..."></textarea>
        <button class="paste-button" id="html1Button">Paste HTML1</button>
        <br/>
        <textarea id="html2Input" rows="2" cols="30" placeholder="Paste HTML2 here..."></textarea>
        <button class="paste-button" id="html2Button">Paste HTML2</button>
        <br/>
        <button class="rw-button" id="copyOutputButton">Copy Output</button>
        <div id="output" class="rw-output"></div>
    `;
    document.body.appendChild(container);

    const html1 = `
<p style="text-align: center;"><span style="text-decoration: underline;">Unique Visitors</span></p>
<div>
  <a href="https://www.cutercounter.com/hits.php?id=hrxppqpq&nd=6&style=21" target="_blank" rel="noopener">
    <img style="display: block; margin-left: auto; margin-right: auto;"
      src="https://www.cutercounter.com/hits.php?id=hrxppqpq&nd=6&style=21" alt="best free website hit counter"/>
  </a>
</div>
<div style="text-align: center;"><span style="font-size: 24px;">Welcome to Heart's RW House</span><br/><br/></div>
<p>
  <strong><span style="font-size: 16px;">
    I am a trader & BUYING ALMOST EVERYTHING. You can check my 
    <a href="/forums.php#/p=threads&f=10&t=16370774&b=0&a=0" target="_blank" rel="noopener">trading thread</a> 
    for Trading.<br/><br/>Want to Upgrade your loadout? Well, you came to the right place! I've over 70 RW weapons at 
    affordable prices. To avoid bazaar fees in case of mugging, I'm happy to arrange a direct trade. I truly appreciate 
    your interest and would love to make a deal that works for both of us. If you have questions or offers, don’t 
    hesitate to ask. My goal is to clear my inventory, so I'll consider all reasonable offers. Below, you'll find a 
    detailed list of available weapons. Let's make this happen together!
  </span></strong>
</p>

<div style="text-align: center;">
  <span style="color: #d6336c;"><span style="font-size: 18px;">All Weapons are in my Bazaar.</span></span></div>
<div style="text-align: center;">
  <span style="font-size: 30px;"><a href="/bazaar.php?userId=3034011" target="_blank" rel="noopener">Bazaar</a>👈❤️👉
    <a href="/displaycase.php#display/3034011" target="_blank" rel="noopener">Display</a></span>
</div>
<div style="text-align: center;">
  <span style="color: #d6336c;"><span style="font-size: 18px;">If the bazaar is closed, DM/message me.</span></span>
</div>
<div style="text-align: center;">
  <span style="font-size: 18px; color: var(--te-text-color-blue);"><strong>Bazaar Includes Mug Fee</strong></span>
</div>
<!-- Paste code below -->



<!-- Paste code up -->
<div style="display: block;">
  <p style="color: rgb(153, 233, 242); margin-top: 10px; margin-bottom: 10px; font-size: 25px;">
    <span style="font-size: 18px; color: var(--te-text-color-lime);">
      I also buy RW Cache, let me know if you have any. We can always negotiate :) Also buying RW weapons at BB value.
    </span>
  </p>
</div>
<div class="table-wrap">
  <table class="decoda-table">
    <tbody>
          <tr>
            <td>
              <span style="color: #ae3ec9;"><span style="font-size: 24px;">Cache</span></span>
            </td>
            <td>
              <span style="color: #ae3ec9;"><span style="font-size: 24px;">Buying Price</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Small Arm Cache</span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">150m</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Melee Arm Cache</span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">200m</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Medium Arm Cache</span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">230m</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Armor Cache</span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">330m</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Bunker Buck</span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">7.5m/BB</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Cesium </span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">570m</span></span>
            </td>
          </tr>
        </tbody>
  </table>
</div>
`;

    const html2 = `
<p style="text-align: center;"><span style="font-size: 24px;">Heart's RW House</span></p>
<p>Welcome To Heart's RW Trade House. Visit my 
<a href="/forums.php#p=threads&f=10&t=16370774&b=0&a=0" target="_blank" rel="noopener">trading thread</a> for more details. I am 
a trader & BUYING ALMOST EVERYTHING! I've got over 70 RW weapons at affordable prices. Let's negotiate!</p>
<div style="text-align: center;">
  <span style="color: #d6336c;"><span style="font-size: 18px;">All Weapons are in my Bazaar.</span></span></div>
<div style="text-align: center;">
  <span style="font-size: 30px;"><a href="/bazaar.php?userId=3034011" target="_blank" rel="noopener">Bazaar</a>👈❤️👉
    <a href="/displaycase.php#display/3034011" target="_blank" rel="noopener">Display</a></span>
</div>
<!-- Paste code below -->

<!-- Paste code up -->
<div style="display: block;">
  <p style="color: rgb(153, 233, 242); margin-top: 10px; margin-bottom: 10px; font-size: 25px;">
    <span style="font-size: 18px; color: var(--te-text-color-lime);">
      I also buy RW Cache, let me know if you have any. We can always negotiate :) Also buying RW weapons at BB value.
    </span>
  </p>
</div>
<div class="table-wrap">
  <table class="decoda-table">
    <tbody>
          <tr>
            <td>
              <span style="color: #ae3ec9;"><span style="font-size: 24px;">Cache</span></span>
            </td>
            <td>
              <span style="color: #ae3ec9;"><span style="font-size: 24px;">Buying Price</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Small Arm Cache</span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">150m</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Melee Arm Cache</span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">200m</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Medium Arm Cache</span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">230m</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Armor Cache</span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">330m</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Bunker Buck</span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">7.5m/BB</span></span>
            </td>
          </tr>
          <tr>
            <td><span style="font-size: 24px;">Cesium </span></td>
            <td>
              <span style="color: #37b24d;"><span style="font-size: 24px;">570m</span></span>
            </td>
          </tr>
        </tbody>
  </table>
</div>
`;

    // Function to paste HTML
    function pasteHtml(baseHtml, inputId) {
        const textarea = document.getElementById(inputId);
        const output = document.getElementById('output');
        const pastedContent = textarea.value.trim();

        if (pastedContent) {
            const updatedHtml = baseHtml.replace('<!-- Paste code below -->', `<!-- Paste code below -->\n${pastedContent}\n`);
            output.textContent = updatedHtml + '\n<!-- Paste code up -->';
            textarea.value = '';
        } else {
            alert('Please paste some content before proceeding.');
        }
    }

    // Function to copy output
    function copyOutput() {
        const output = document.getElementById('output').textContent;
        if (output) {
            GM_setClipboard(output);
            alert('Output copied to clipboard.');
        } else {
            alert('Nothing to copy.');
        }
    }

    // Event listeners for buttons
    document.getElementById('html1Button').addEventListener('click', () => pasteHtml(html1, 'html1Input'));
    document.getElementById('html2Button').addEventListener('click', () => pasteHtml(html2, 'html2Input'));
    document.getElementById('copyOutputButton').addEventListener('click', copyOutput);

    // Toggle the main interface
    addButton.addEventListener('click', () => {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });
})();
