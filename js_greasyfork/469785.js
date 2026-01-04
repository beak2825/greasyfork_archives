// ==UserScript==
// @name         Google Maps Iframe Generator
// @namespace    _derreck_
// @version      2.0
// @description  Generates a Google Maps iframe code based on user input
// @match        *platesmania.com/admin/edit_dopol.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469785/Google%20Maps%20Iframe%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/469785/Google%20Maps%20Iframe%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create button to open the iframe generator
    const button = document.createElement('button');
    button.textContent = 'Add gMaps icon';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    document.body.appendChild(button);

    // Button click event handler
    button.addEventListener('click', openIframeGenerator);

    // Function to open the iframe generator window
    function openIframeGenerator() {
        const generatorWindow = window.open('', '_blank', 'width=600,height=400');
        generatorWindow.document.write(`
            <h1>Generate code for your description box!</h1>
            <label for="customText1">Text before the Map button:</label>
            <input type="text" id="customText1"><br><br>
            <label for="customText2">Text after the Map button:</label>
            <input type="text" id="customText2"><br><br>
            <label for="customText3">Text below the line that contains the map button (good for hashtags etc) (will not show below in the preview, but in the end result it will)</label>
            <input type="text" id="customText3"><br><br>
            <label for="location">Location:</label>
            <input type="text" id="location"><br><br>
            <label for="mapView">Map View:</label>
            <select id="mapView">
                <option value="m">Map</option>
                <option value="h">Satellite + Street names</option>
                <option value="k">Satellite</option>
                <option value="p">Terrain</option>
            </select><br><br>
            <label for="zoomLevel">Zoom Level:</label>
            <input type="number" id="zoomLevel" min="1" max="20"><br><br>
            <button id="previewButton">Preview</button>
            <button id="insertButton">Insert</button>
        `);

        // Preview button click event handler
        generatorWindow.document.getElementById('previewButton').addEventListener('click', generatePreview);

        // Insert button click event handler
        generatorWindow.document.getElementById('insertButton').addEventListener('click', insertCode);

        // Function to generate the preview
        function generatePreview() {
            const customText1 = generatorWindow.document.getElementById('customText1').value;
            const customText2 = generatorWindow.document.getElementById('customText2').value;
            const customText3 = generatorWindow.document.getElementById('customText3').value;
            const location = generatorWindow.document.getElementById('location').value;
            const mapView = generatorWindow.document.getElementById('mapView').value;
            const zoomLevel = generatorWindow.document.getElementById('zoomLevel').value;

            const previewContainer = generatorWindow.document.createElement('div');
            previewContainer.innerHTML = `
                <p style="text-align: center;">
                    ${customText1}<button style="border: none; background: none; cursor: pointer;" onclick="event.preventDefault(); if (window.location.href.indexOf('gallery') === -1) { document.getElementById('gmap_canvas').style.display = 'block'; }">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/167px-Google_Maps_icon_%282020%29.svg.png" alt="Map" style="width: 11px; height: 16px;">
                    </button>${customText2}
                    <iframe display="none" scrolling="no" marginheight="0" marginwidth="0" id="gmap_canvas" src="https://maps.google.com/maps?width=520&height=400&hl=en&q=%20+(${location})&t=${mapView}&z=${zoomLevel}&ie=UTF8&iwloc=B&output=embed" width="520" height="400" frameborder="0" style="display: none;"></iframe>
                    ${customText3} </p>`;


            generatorWindow.document.body.appendChild(previewContainer);
        }

        // Function to insert the generated code into the text box on the website
        function insertCode() {
            const customText1 = generatorWindow.document.getElementById('customText1').value;
            const customText2 = generatorWindow.document.getElementById('customText2').value;
            const customText3 = generatorWindow.document.getElementById('customText3').value;
            const location = generatorWindow.document.getElementById('location').value;
            const mapView = generatorWindow.document.getElementById('mapView').value;
            const zoomLevel = generatorWindow.document.getElementById('zoomLevel').value;

            const code = `<p style="text-align: center;">${customText1}<button style="border: none; background: none; cursor: pointer;" onclick="event.preventDefault(); if (window.location.href.indexOf('gallery') === -1) { document.getElementById('gmap_canvas').style.display = 'block'; }"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/167px-Google_Maps_icon_%282020%29.svg.png" alt="Map" style="width: 11px; height: 16px;"></button>${customText2}<iframe display="none" scrolling="no" marginheight="0" marginwidth="0" id="gmap_canvas" src="https://maps.google.com/maps?width=520&height=400&hl=en&q=%20+(${location})&t=${mapView}&z=${zoomLevel}&ie=UTF8&iwloc=B&output=embed" width="520" height="400" frameborder="0" style="display: none;"></iframe>
${customText3} </p>`;

            // Insert the code into the text box on the website
            const targetTextBox = document.getElementsByName('dop')[0];
            if (targetTextBox) {
                targetTextBox.value = code;
                generatorWindow.close();
            } else {
                alert('Target text box not found!');
            }
        }
    }
})();