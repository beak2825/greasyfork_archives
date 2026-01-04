// ==UserScript==
// @name         MCFunction Downloader
// @version      0.3.4
// @license      MIT
// @description  A simple quick and dirty hack to add an button for mcfunction downloads
// @author       Xemorph
// @match        https://minecraftshapes.com/
// @icon         https://www.google.com/s2/favicons?domain=minecraftshapes.com
// @grant        none
// @namespace https://greasyfork.org/users/883400
// @downloadURL https://update.greasyfork.org/scripts/440990/MCFunction%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/440990/MCFunction%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let uiHelper = {
        addRow: function(controls) {
            var tbody = document.querySelector("#ctrls > table > tbody");
            var row = document.createElement("tr");
            controls.forEach(x => {
                var td = document.createElement("td");
                if (x && x.nodeType) {
                    td.appendChild(x);
                } else {
                    td.innerHTML = x;
                }

                row.appendChild(td);
            });
            tbody.appendChild(row);
            return row;
        },
        createButton: function(text, callbackfn) {
            var button = document.createElement("button");
            button.innerHTML = text;
            button.onclick = callbackfn;
            return button;
        },
        createCheckbox: function() {
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            return checkbox;
        },
        createDropdown: function(items) {
            var select = document.createElement("select");
            items.forEach(x => {
                var option = document.createElement("option");
                option.value = x;
                option.innerHTML = x;
                select.appendChild(option);
            });
            return select;
        },
        createInputTextBox: function(placeholder = "") {
            var input = document.createElement("input");
            input.type = "text";
            input.placeholder = placeholder;
            return input;
        }
    }

    let commandGen = {
        svgToBlocksArray: function() {
            var raw_blocks = document.querySelectorAll("#svgElem > rect.filled");
            var blocks = [];

            raw_blocks.forEach(x => {
                var coords = x.children[0].textContent.match(/\d+/g).map(Number);
                blocks.push(coords);
            });
            return blocks;
        },
        blockToCommand: function(block, height) {

            var blocktype = document.querySelector("#ctrls > table > tbody > tr:nth-child(15) > td:nth-child(2) > input[type=text]").value;
            var command = `setblock ~${block[0]} ~${height} ~${block[1]} ${blocktype}`;
            return command;
        },
        blocksToCommand: function(blocks) {
            var cmd = "";
            var height = parseInt(document.querySelector("#ctrls > table > tbody > tr:nth-child(16) > td:nth-child(2) > input[type=number]").value);
            for (let index = 0; index < height; index++) {
                blocks.forEach(x => {
                    cmd += commandGen.blockToCommand(x, index) + "\n";
                });
            }

            return cmd;
        },
        buttonClick: function(origin) {
            let blocks = commandGen.svgToBlocksArray();

            var center = commandGen.getNewCenter(origin);
            blocks = commandGen.adjustBlockCoords(blocks, center);

            let command = commandGen.blocksToCommand(blocks);

            var blob = new Blob([command], {
                type: "text/plain"
            });            
            var shape = document.querySelector("#shape").options[document.querySelector("#shape").selectedIndex].text;

            window.saveAs(blob, `${shape.toLowerCase()}.mcfunction`);
        },
        getNewCenter: function(origin) {
            //"Top-Left", "Top-Middle", "Top-Right", "Middle-Left", "Center", "Middle-Right", "Bottom-Left", "Bottom-Middle", "Bottom-Right", "Custom"
            let size = commandGen.getSize();
            let centerX = Math.trunc((size[0] - 1) / 2)
            let centerY = Math.trunc((size[1] - 1) / 2);
            switch (origin) {
                case "Custom":
                    var markers = commandGen.getMarker();
                    if (markers.length == 0) {
                        alert("No marker set!");
                        throw Error("No marker set");
                    } else if (markers.length > 1) {
                        alert("More than one (1) marker set!");
                        throw Error("Too many markers Isaac");
                    } else {
                        return markers[0].children[0].textContent.match(/\d+/g).map(Number);
                    }

                    case "Top-Left":
                        return [0, 0];
                    case "Top-Middle":
                        return [centerX, 0]
                    case "Top-Right":
                        return [size[0] - 1, 0]
                    case "Middle-Left":
                        return [0, centerY];
                    case "Center":
                        return [centerX, centerY];
                    case "Middle-Right":
                        return [size[0] - 1, centerY];
                    case "Bottom-Left":
                        return [0, size[1] - 1];
                    case "Bottom-Middle":
                        return [centerX, size[1] - 1];
                    case "Bottom-Right":
                        return [size[0] - 1, size[1] - 1];
            }

        },
        adjustBlockCoords: function(blocks, newCenter) {
            return blocks.map(point => {
                return [point[0] - newCenter[0], point[1] - newCenter[1]];
            });
        },
        getSize: function(blocks) {
            var lines = Array.from(document.querySelectorAll("#svgElem > line"));
            var width = lines.filter(x => x.y1.baseVal.value == 0).length + 1;
            var height = lines.filter(x => x.x1.baseVal.value == 0).length + 1;
            return [width, height];
        },
        getMarker: function() {
            var markers = Array.from(document.querySelectorAll("#svgElem > rect.square.tog"));
            return markers;
        }
    }

    var dropdown = uiHelper.createDropdown(["Top-Left", "Top-Middle", "Top-Right", "Middle-Left", "Center", "Middle-Right", "Bottom-Left", "Bottom-Middle", "Bottom-Right", "Custom"]);

    uiHelper.addRow(["Generation Origin", dropdown]);

    var inputBox = uiHelper.createInputTextBox("block");
    inputBox.value = "minecraft:white_concrete";
    uiHelper.addRow(["Block", inputBox]);
    var heightBox = uiHelper.createInputTextBox("height");
    heightBox.type = "number";
    heightBox.min = "1";
    heightBox.value = "1";
    uiHelper.addRow(["Generation Height", heightBox]);

    var generateButton = uiHelper.createButton("mcfunction", () => {
        commandGen.buttonClick(dropdown.value);
    });
    uiHelper.addRow(["Generate", generateButton])

})();