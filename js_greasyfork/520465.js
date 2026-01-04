// ==UserScript==
// @name         Wirelyre Select Saves (with next pc save)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  save selection
// @author       13pake, TamTheBoss111
// @match        https://wirelyre.github.io/tetra-tools/pc-solver.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520465/Wirelyre%20Select%20Saves%20%28with%20next%20pc%20save%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520465/Wirelyre%20Select%20Saves%20%28with%20next%20pc%20save%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle("#solutions > a { border-radius: 4px; }");
    GM_addStyle("#solutions { row-gap: 20px; }");
    GM_addStyle("#select-save { background-color: rgba(0,0,0,0.2); color: #fff; border: 1px solid rgba(0,0,0,0.3); margin-left: 5px; }");
    GM_addStyle("#label-save { margin-top: 10px; }");

    // Constants
    var pieces = ['T', 'I', 'L', 'J', 'S', 'Z', 'O'];
    var colors = [
        'rgb(180, 81, 172)', // purple
        'rgb(65, 175, 222)', // cyan
        'rgb(239, 149, 54)', // orange
        'rgb(24, 131, 191)', // blue
        'rgb(102, 198, 92)', // green
        'rgb(239,  98, 77)', // red
        'rgb(247, 211, 62)', // yellow
    ];
    var remainingPieces = [4, 1, 5, 2, 6, 3, 7];
    var piecesUsed = [3, 6, 2, 5, 1, 4, 0];
    var pcNumSelectOptions = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"]


    window.onload = function() {

        // Add save selection
        var label = document.createElement('label');
        label.id = 'label-save';
        label.innerHTML = 'Save';
        document.querySelectorAll('#query > div:nth-child(6)')[0].appendChild(label);

        var select = document.createElement('select');
        label.appendChild(select);
        select.id = 'select-save';

        var selectOptions = ['All', ...pieces];

        for (var i = 0; i < selectOptions.length; i++) {
            var option = document.createElement('option');
            option.value = selectOptions[i];
            option.text = selectOptions[i];
            select.appendChild(option);
        }

        // Add pc num selection
        var pcNumLabel = document.createElement('label');
        pcNumLabel.id = 'label-pc-num';
        pcNumLabel.innerHTML = 'PC # ';
        document.querySelectorAll('#query > div:nth-child(6)')[0].appendChild(pcNumLabel);

        // Create the slider
        var pcNumSlider = document.createElement('input');
        pcNumSlider.type = 'range';
        pcNumSlider.id = 'slider-pc-num';
        pcNumSlider.min = '1';
        pcNumSlider.max = '7';
        pcNumSlider.step = '1';
        pcNumSlider.value = '1';
        pcNumLabel.appendChild(pcNumSlider);

        // Display the selected value
        var pcNumDisplay = document.createElement('span');
        pcNumDisplay.id = 'slider-value';
        pcNumDisplay.innerHTML = '1'; // Default value
        pcNumLabel.appendChild(pcNumDisplay);

        // Update the displayed value when the slider changes
        pcNumSlider.addEventListener('input', function () {
            pcNumDisplay.innerHTML = pcNumSlider.value;

            var queue = document.getElementById('queue').value;

            // check if queue is just pieces
            var piecesOnlyMatch = queue.match(/^[TILJSZO]*$/);
            if (piecesOnlyMatch) {
                //console.log('good queue');
            } else {
                return;
            }

            var queuePieces = pieces.map(function(piece) {
                return (queue.split(piece).length - 1);
            });

            // We're just gonna assume the queue length is correct !!!

            //console.log('queue pieces', queuePieces);
            var solutionsContainer = document.getElementById('solutions');

            // Loop over all 'a' tags inside the solutions container
            var aTags = solutionsContainer.getElementsByTagName('a');
            for (let aNode of aTags) {
                    // console.log('A child node has been added or removed.', mutation.addedNodes[0]);
                    try {
                        var dataField = aNode.firstChild.getAttribute('data-field');
                        var solutionPieces = pieces.map(function(piece) {
                            return (dataField.split(piece).length - 1) / 4;
                        });
                        //console.log('pieces used', solutionPieces);

                        // get difference between arrays
                        var differentIndex = -1;
                        for (let i = 0; i < queuePieces.length; i++) {
                            if (queuePieces[i] !== solutionPieces[i]) {
                                differentIndex = i;
                            }
                        }
                        // console.log('saved piece', pieces[differentIndex]);
                        aNode.style.borderTop = "10px solid " + colors[differentIndex];
                        aNode.classList.add(pieces[differentIndex]);

                        // Calculate what PC comes from this save
                        let bag = new Set(["T", "I", "J", "L", "O", "S", "Z"]);
                        // console.log("queuevalue", queue)

                        let currentPCNum = pcNumSlider.value - 1; // -1 so that its an index starting from 0

                        // If there is a saved piece (4p setup with see7/3p setup with see8)
                        if (differentIndex != -1) {
                            // console.log(piecesUsed[currentPCNum], currentPCNum);
                            for (let j = 1; j < piecesUsed[currentPCNum] + 2; j++) {
                                // console.log("inloop")
                                // console.log("piece to remove", queue[queue.length - j])
                                bag.delete(queue[queue.length - j]) // bag ends up being the pieces left in the bag
                                // console.log("bag currently: ", Array.from(bag).join(""))
                            }
                            var save = Array.from(bag).join("");
                            //console.log("final save", save);
                            // Add the saved piece

                            // If there is a saved piece (4p setup with see7/3p setup with see8)
                            save += pieces[differentIndex];
                            // console.log("final save", save);

                            // Reorder the string
                            const chars = save.split("");

                            const correctOrder = "TIJLOSZ";

                            // Sort the characters based on their position in the custom order
                            chars.sort((a, b) => correctOrder.indexOf(a) - correctOrder.indexOf(b));

                            save = chars.join("");
                        } else if (differentIndex == -1) {
                            // console.log(piecesUsed[currentPCNum], currentPCNum);
                            for (let j = 1; j < piecesUsed[currentPCNum] + 1; j++) {
                                // console.log("inloop")
                                // console.log("piece to remove", queue[queue.length - j])
                                bag.delete(queue[queue.length - j]) // bag ends up being the pieces left in the bag
                                // console.log("bag currently: ", Array.from(bag).join(""))
                            }
                            var save = Array.from(bag).join("");
                        }

                        // hard coded stuff:
                        //console.log(pcNumSelect.value)
                        if (pcNumSlider.value == 2) { // for dealing with some 3+1setups on 2nd for 3rd pc saves
                            save = pieces[differentIndex];
                        }
                        if (pcNumSlider.value == 3) { // for renaming 4th pc
                            const reference = "TIJLOSZ";

                            const missing = reference.split("").filter(letter => !save.includes(letter));
                            let dupe = "";
                            if (save.includes("TT")) {
                                dupe = "T"
                            } else if (save.includes("II")) {
                                dupe = "I"
                            } else if (save.includes("JJ")) {
                                dupe = "J"
                            } else if (save.includes("LL")) {
                                dupe = "L"
                            } else if (save.includes("OO")) {
                                dupe = "O"
                            } else if (save.includes("SS")) {
                                dupe = "S"
                            } else if (save.includes("ZZ")) {
                                dupe = "Z"
                            }
                            // console.log(missing, dupe)

                            if (missing.length > 0 && dupe == "") {
                                save = `no ${missing.join("")}`;
                            } else {
                                // console.log("dupe")
                                save = `${dupe}>${missing.join("")}`;
                                // console.log("save", save)
                            }
                        }
                        if (pcNumSlider.value == 5) { // for renaming 6th pc
                            const reference = "TIJLOSZ";

                            const missing = reference.split("").filter(letter => !save.includes(letter));
                            let dupe = "";
                            if (save.includes("TT")) {
                                dupe = "T"
                            } else if (save.includes("II")) {
                                dupe = "I"
                            } else if (save.includes("JJ")) {
                                dupe = "J"
                            } else if (save.includes("LL")) {
                                dupe = "L"
                            } else if (save.includes("OO")) {
                                dupe = "O"
                            } else if (save.includes("SS")) {
                                dupe = "S"
                            } else if (save.includes("ZZ")) {
                                dupe = "Z"
                            }
                            // console.log(missing, dupe)

                            if (missing.length > 0 && dupe == "") {
                                save = `no ${missing.join("")}`;
                            } else {
                                // console.log("dupe")
                                save = `${dupe}>${missing.join("")}`;
                                // console.log("save", save)
                            }
                        }
                        if (pcNumSlider.value == 7) { // for renaming 1st/8th pc
                            const reference = "TIJLOSZ";

                            const missing = reference.split("").filter(letter => !save.includes(letter));
                            let dupe = "";
                            if (save.includes("TT")) {
                                dupe = "T"
                            } else if (save.includes("II")) {
                                dupe = "I"
                            } else if (save.includes("JJ")) {
                                dupe = "J"
                            } else if (save.includes("LL")) {
                                dupe = "L"
                            } else if (save.includes("OO")) {
                                dupe = "O"
                            } else if (save.includes("SS")) {
                                dupe = "S"
                            } else if (save.includes("ZZ")) {
                                dupe = "Z"
                            }
                            // console.log(missing, dupe)

                            if (missing.length == 0) {
                                save = "1st PC";
                            } else {
                                // console.log("dupe")
                                save = `${dupe}>${missing.join("")} 8th PC`;
                                // console.log("save", save)
                            }
                        }

                        // checks if the datafield is full and hence there is a pc
                        if (!dataField.includes("_") && save != undefined) {
                            if (currentPCNum != 6) {
                                save += " " + pcNumSelectOptions[currentPCNum + 1]
                            }
                            // Check if there is an old text node there and delete it
                            let existingTextNode = aNode.firstChild.firstChild.querySelector('text');
                            // console.log(existingTextNode);

                            if (existingTextNode) {
                                // If an existing text node is found, remove it
                                aNode.firstChild.firstChild.removeChild(existingTextNode);
                            }
                            // Create the new text elem and add it
                            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                            text.setAttribute("x", "100"); // Set x to the center
                            text.setAttribute("y", "15"); // Adjust y as needed
                            text.setAttribute("fill", "black");
                            text.setAttribute("text-anchor", "middle"); // Center the text horizontally
                            text.setAttribute("font-size", "15"); // Font size
                            text.textContent = save;
                            aNode.firstChild.firstChild.appendChild(text);
                        }





                    } catch (e) {
                        // do nothing lol
                    }


            }

        });

        // On select change
        select.onchange = function(event) {
            selectSave(event.target.value);
        }

        function selectSave(value) {
            if (value !== 'All') {
                document.querySelectorAll('#solutions > a').forEach(function(a) {
                    a.style.display = 'none';
                    // a.style.borderTopWidth = '0'; commented out by tam
                });
                document.querySelectorAll('#solutions > a.' + value).forEach(function(a) {
                    a.style.display = 'block';
                });
            } else if (value == 'All') {
                document.querySelectorAll('#solutions > a').forEach(function(a) {
                    a.style.display = 'block';
                    a.style.borderTopWidth = '10px';
                });
            }
        }

        // Add listener for solutions and also the whole body for the slider
        var targetNode = document.getElementById('solutions');
        var config = {
            // attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        };

        var observer = new MutationObserver(function(mutationsList) {

            var queue = document.getElementById('queue').value;

            // check if queue is just pieces
            var piecesOnlyMatch = queue.match(/^[TILJSZO]*$/);
            if (piecesOnlyMatch) {
                //console.log('good queue');
            } else {
                return;
            }

            var queuePieces = pieces.map(function(piece) {
                return (queue.split(piece).length - 1);
            });

            // We're just gonna assume the queue length is correct !!!

            //console.log('queue pieces', queuePieces);

            for (var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    // console.log('A child node has been added or removed.', mutation.addedNodes[0]);
                    try {
                        var aNode = mutation.addedNodes[0];
                        var dataField = aNode.firstChild.getAttribute('data-field');
                        var solutionPieces = pieces.map(function(piece) {
                            return (dataField.split(piece).length - 1) / 4;
                        });
                        //console.log('pieces used', solutionPieces);

                        // get difference between arrays
                        var differentIndex = -1;
                        for (let i = 0; i < queuePieces.length; i++) {
                            if (queuePieces[i] !== solutionPieces[i]) {
                                differentIndex = i;
                            }
                        }
                        // console.log('saved piece', pieces[differentIndex]);
                        aNode.style.borderTop = "10px solid " + colors[differentIndex];
                        aNode.classList.add(pieces[differentIndex]);

                        // Calculate what PC comes from this save
                        let bag = new Set(["T", "I", "J", "L", "O", "S", "Z"]);
                        // console.log("queuevalue", queue)

                        let currentPCNum = pcNumSlider.value - 1; // -1 so that its an index starting from 0

                        // If there is a saved piece (4p setup with see7/3p setup with see8)
                        if (differentIndex != -1) {
                            // console.log(piecesUsed[currentPCNum], currentPCNum);
                            for (let j = 1; j < piecesUsed[currentPCNum] + 2; j++) {
                                // console.log("inloop")
                                // console.log("piece to remove", queue[queue.length - j])
                                bag.delete(queue[queue.length - j]) // bag ends up being the pieces left in the bag
                                // console.log("bag currently: ", Array.from(bag).join(""))
                            }
                            var save = Array.from(bag).join("");
                            //console.log("final save", save);
                            // Add the saved piece

                            // If there is a saved piece (4p setup with see7/3p setup with see8)
                            save += pieces[differentIndex];
                            // console.log("final save", save);

                            // Reorder the string
                            const chars = save.split("");

                            const correctOrder = "TIJLOSZ";

                            // Sort the characters based on their position in the custom order
                            chars.sort((a, b) => correctOrder.indexOf(a) - correctOrder.indexOf(b));

                            save = chars.join("");
                        } else if (differentIndex == -1) {
                            // console.log(piecesUsed[currentPCNum], currentPCNum);
                            for (let j = 1; j < piecesUsed[currentPCNum] + 1; j++) {
                                // console.log("inloop")
                                // console.log("piece to remove", queue[queue.length - j])
                                bag.delete(queue[queue.length - j]) // bag ends up being the pieces left in the bag
                                // console.log("bag currently: ", Array.from(bag).join(""))
                            }
                            var save = Array.from(bag).join("");
                        }

                        // hard coded stuff:
                        //console.log(pcNumSelect.value)
                        if (pcNumSlider.value == 2) { // for dealing with some 3+1setups on 2nd for 3rd pc saves
                            save = pieces[differentIndex];
                        }
                        if (pcNumSlider.value == 3) { // for renaming 4th pc
                            const reference = "TIJLOSZ";

                            const missing = reference.split("").filter(letter => !save.includes(letter));
                            let dupe = "";
                            if (save.includes("TT")) {
                                dupe = "T"
                            } else if (save.includes("II")) {
                                dupe = "I"
                            } else if (save.includes("JJ")) {
                                dupe = "J"
                            } else if (save.includes("LL")) {
                                dupe = "L"
                            } else if (save.includes("OO")) {
                                dupe = "O"
                            } else if (save.includes("SS")) {
                                dupe = "S"
                            } else if (save.includes("ZZ")) {
                                dupe = "Z"
                            }
                            // console.log(missing, dupe)

                            if (missing.length > 0 && dupe == "") {
                                save = `no ${missing.join("")}`;
                            } else {
                                // console.log("dupe")
                                save = `${dupe}>${missing.join("")}`;
                                // console.log("save", save)
                            }
                        }
                        if (pcNumSlider.value == 5) { // for renaming 6th pc
                            const reference = "TIJLOSZ";

                            const missing = reference.split("").filter(letter => !save.includes(letter));
                            let dupe = "";
                            if (save.includes("TT")) {
                                dupe = "T"
                            } else if (save.includes("II")) {
                                dupe = "I"
                            } else if (save.includes("JJ")) {
                                dupe = "J"
                            } else if (save.includes("LL")) {
                                dupe = "L"
                            } else if (save.includes("OO")) {
                                dupe = "O"
                            } else if (save.includes("SS")) {
                                dupe = "S"
                            } else if (save.includes("ZZ")) {
                                dupe = "Z"
                            }
                            // console.log(missing, dupe)

                            if (missing.length > 0 && dupe == "") {
                                save = `no ${missing.join("")}`;
                            } else {
                                // console.log("dupe")
                                save = `${dupe}>${missing.join("")}`;
                                // console.log("save", save)
                            }
                        }
                        if (pcNumSlider.value == 7) { // for renaming 1st/8th pc
                            const reference = "TIJLOSZ";

                            const missing = reference.split("").filter(letter => !save.includes(letter));
                            let dupe = "";
                            if (save.includes("TT")) {
                                dupe = "T"
                            } else if (save.includes("II")) {
                                dupe = "I"
                            } else if (save.includes("JJ")) {
                                dupe = "J"
                            } else if (save.includes("LL")) {
                                dupe = "L"
                            } else if (save.includes("OO")) {
                                dupe = "O"
                            } else if (save.includes("SS")) {
                                dupe = "S"
                            } else if (save.includes("ZZ")) {
                                dupe = "Z"
                            }
                            // console.log(missing, dupe)

                            if (missing.length == 0) {
                                save = "1st PC";
                            } else {
                                // console.log("dupe")
                                save = `${dupe}>${missing.join("")} 8th PC`;
                                // console.log("save", save)
                            }
                        }

                        // checks if the datafield is full and hence there is a pc
                        if (!dataField.includes("_") && save != undefined) {
                            if (currentPCNum != 6) {
                                save += " " + pcNumSelectOptions[currentPCNum + 1]
                            }

                            // Create the new text elem and add it
                            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                            text.setAttribute("x", "100"); // Set x to the center
                            text.setAttribute("y", "15"); // Adjust y as needed
                            text.setAttribute("fill", "black");
                            text.setAttribute("text-anchor", "middle"); // Center the text horizontally
                            text.setAttribute("font-size", "15"); // Font size
                            text.textContent = save;
                            aNode.firstChild.firstChild.appendChild(text);
                        }





                    } catch (e) {
                        // do nothing lol
                    }

                }
            }
        });

        observer.observe(targetNode, config);
    }
})();