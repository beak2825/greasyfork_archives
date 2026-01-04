// ==UserScript==
// @name         Exchange Modal for Facebook Ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a draggable exchange rate modal to the webpage
// @author       Jamir-boop
// @match        https://www.google.com.pe/
// @license		 MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480645/Exchange%20Modal%20for%20Facebook%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/480645/Exchange%20Modal%20for%20Facebook%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Insert CSS for the modal
    const css = `
		#exchangeModal{
		  font-family: 'Montserrat';
		  font-size: 12px;
		}

		#exchangeModal {
		    position: fixed;
		    height: 140px;
            width: 190px;
            bottom: 0;
            right: 0;
		    background-color: #202020; /* Black background with opacity */
		    z-index: 9999;
		    cursor: default; /* Default cursor for modal content */
		    padding: 5px;
		    border: 1px solid #888;
		    text-align: center;
    		color: white;
            border-radius: 10px;
            display: none; /* Hidden by default */
		}

		/* Adjustments for the close button */
		#closeButton {
		  position: absolute;
		  top: -15px;
		  right: 0;
		  background-color: transparent;
		  color: red;
		  border: none;
		  color: white;
		  cursor: pointer;
		  width: 20px;
		  heigth: 20px;
		  padding: 2px;
		}
		#closeButton:hover{
		  background-color: red;
		}

		#exchangeModal h6 {
		  all: unset;
		  display: block;
		  margin-top: 0;
		  padding: 20px 0;
		  color: white;
		  font-weight: bold;
		}

		#usdValue{
			color: black;
		}

		#exchangeModal label {
		  margin-right: 10px;
		}

		#exchangeModal input[type=text] {
		  width: 50px;
		  padding: 3px;
		}

		button {
		  color: white;
		  background-color: transparent;
		  border: 1px solid #FFFFFF;
		  padding: 5px;
		  width: 80px;
		  margin: 20px 5px;
		  cursor: pointer;
          border-radius: 10px;
		}

		button:hover {
		  background-color: grey;
		}

		#showModalButton {
            position: fixed;
            width: 50px;
            height: 50px;
            bottom: 0;
            right: 0;
            background-color: red;
            z-index: 10000;
            cursor: pointer;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    // Insert HTML for the modal
    const modalHtml = `
<img src="https://i.ibb.co/B4GJrX5/Untitled.webp" alt="Untitled" border="0" id="showModalButton">
<div id="exchangeModal">
  <h6 id="modalHeader">Actualizar tipo de cambio</h6> <!-- Draggable area -->
  <button id="closeButton" title="Close">X</button>
  <label for="usdValue">valor USD</label>
  <input type="text" id="usdValue" value="0">
  <br>
  <button id="undoButton">Deshacer</button>
  <button id="applyButton">Aplicar</button>
</div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Make the element draggable
    function dragElement(element, dragHandle) {
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        // if present, the header is where you move the DIV from:
        if (dragHandle) {
            // if header is specified, only start the drag process when the header is clicked
            dragHandle.onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Apply the drag function to your element
    dragElement(document.getElementById("exchangeModal"), document.getElementById("modalHeader"));
    dragElement(document.getElementById("showModalButton"), document.getElementById("showModalButton"));

    // Function to show the modal
    function showModal() {
        fetchExchangeRate();
        document.getElementById('exchangeModal').style.display = 'block';
        document.getElementById('showModalButton').style.display = 'none';
    }

    // Function to hide the modal and show the small box
    function hideModal() {
        document.getElementById('exchangeModal').style.display = 'none';
        document.getElementById('showModalButton').style.display = 'block';
    }

    // Function to fetch the exchange rate
    function fetchExchangeRate() {
        // The URL of the API providing exchange rate data.
        // Make sure to replace `YOUR-API-KEY` with your actual API key if required.
        const apiURL = 'https://api.exchangerate-api.com/v4/latest/USD';

        fetch(apiURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Assuming the API returns a JSON object with a property `rates` containing the rates.
                const rate = data.rates.PEN;
                // Set the exchange rate in your modal.
                document.getElementById('usdValue').value = rate.toFixed(2);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
    fetchExchangeRate();

    // Event listener for close button
    document.getElementById('closeButton').addEventListener('click', hideModal);

    // Event listener for the small box to show the modal
    document.getElementById('showModalButton').addEventListener('click', showModal);

    // Event listeners for other buttons as needed
    // ...
})();

