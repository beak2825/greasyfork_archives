// ==UserScript==
// @name         wirelyre select save
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  save selection
// @author       13pake
// @match        https://wirelyre.github.io/tetra-tools/pc-solver.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476857/wirelyre%20select%20save.user.js
// @updateURL https://update.greasyfork.org/scripts/476857/wirelyre%20select%20save.meta.js
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

        // On select change
        select.onchange = function(event) {
            selectSave(event.target.value);
        }

        function selectSave(value) {
            if (value !== 'All') {
                document.querySelectorAll('#solutions > a').forEach(function(a) {
                    a.style.display = 'none';
                    a.style.borderTopWidth = '0';
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

        // Add listener for solutions
        var targetNode = document.getElementById('solutions');
        var config = {
            // attributes: true,
            childList: true,
            subtree: true
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
                        //console.log('saved piece', pieces[differentIndex]);
                        aNode.style.borderTop = "10px solid " + colors[differentIndex];
                        aNode.classList.add(pieces[differentIndex]);


                    } catch (e) {
                        // do nothing lol
                    }

                }
            }
        });

        observer.observe(targetNode, config);
    }
})();