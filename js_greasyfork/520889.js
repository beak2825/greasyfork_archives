// ==UserScript==
// @name         WME Segment Nudger
// @author       DiffLok
// @namespace    DiffLok
// @version      2024.11.03.02
// @description  Provides utility for shifting street segments and nodes by a precise meter amount
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520889/WME%20Segment%20Nudger.user.js
// @updateURL https://update.greasyfork.org/scripts/520889/WME%20Segment%20Nudger.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global OpenLayers */
/* global require */
/* global $ */
/* global _ */

(function() {
    var UpdateSegmentGeometry;
    var MoveNode;
    var MultiAction;

    function bootstrap(tries = 1) {
        if (W && W.map && W.model && require && WazeWrap.Ready) {
            init();
        } else if (tries < 1000) {
            setTimeout(function() { bootstrap(++tries); }, 200);
        }
    }

    bootstrap();

    function init() {
        injectCss();
        UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry');
        MoveNode = require("Waze/Action/MoveNode");
        MultiAction = require("Waze/Action/MultiAction");

        // Listen for selection changes and add UI if a segment is selected
        W.selectionManager.events.register("selectionchanged", null, onSelectionChanged);
    }

    function onSelectionChanged() {
        const selectedFeatures = W.selectionManager.getSelectedFeatures();
        const hasSegment = selectedFeatures.some(f => f.featureType === 'segment');

        if (hasSegment) {
            injectMoverUI();
        } else {
            removeMoverUI(); // Clean up if no segment is selected
        }
    }

    function injectMoverUI() {
        const attributesForm = document.querySelector(".attributes-form.side-panel-section");
        if (attributesForm && !document.querySelector("#nudgerContainer")) {
            const container = document.createElement("div");
            container.id = "nudgerContainer";
            container.classList.add("segment-edit-section");

            const label = document.createElement("wz-label");
            label.innerText = "Segment Nudger";

            const controlsContainer = document.createElement("div");
            controlsContainer.classList.add("text-center");
            controlsContainer.innerHTML = `
                <div style="display: relative; justify-content: center;">
                    <button id="ShiftUpLeftBtn" data-direction="up-left" class="mover-button"><i class="fa fa-arrow-left fa-rotate-45"></i></button>
                    <button id="ShiftUpBtn" data-direction="up" class="mover-button"><i class="fa fa-arrow-up"></i></button>
                    <button id="ShiftUpRightBtn" data-direction="up-right" class="mover-button"><i class="fa fa-arrow-up fa-rotate-45"></i></button>
                </div>

                <div style="display: relative; justify-content: space-around; align-items: center;">
                    <button id="ShiftLeftBtn" data-direction="left" class="mover-button" style="margin-right:42px;"><i class="fa fa-arrow-left"></i></button>
                    <button id="ShiftRightBtn" data-direction="right" class="mover-button"><i class="fa fa-arrow-right"></i></button>
                </div>
                <div style="display: relative; justify-content: space-between; margin-bottom: 10px;"">
                    <button id="ShiftDownLeftBtn" data-direction="down-left" class="mover-button"><i class="fa fa-arrow-down fa-rotate-45"></i></button>
                    <button id="ShiftDownBtn" data-direction="down" class="mover-button"><i class="fa fa-arrow-down"></i></button>
                    <button id="ShiftDownRightBtn" data-direction="down-right" class="mover-button"><i class="fa fa-arrow-right fa-rotate-45"></i></button>
                </div>
                <div style="text-align:center;">
                    Shift by <input type="text" id="shiftAmount" style="text-align: center; width: 40px;" value="1"> meter(s)
                </div>`
            ;

            container.appendChild(label);
            container.appendChild(controlsContainer);
            attributesForm.appendChild(container); // Insert into attributes form

            // Add event listeners for each button using a single function
            const buttons = container.querySelectorAll(".mover-button");
            buttons.forEach(button => {
                button.addEventListener("click", handleShift);
            });
        }
    }

    function removeMoverUI() {
        const container = document.querySelector("#nudgerContainer");
        if (container) {
            container.remove();
        }
    }

    function handleShift(event) {
        const direction = event.currentTarget.getAttribute("data-direction");
        shiftSegments(direction);
    }

    function shiftSegments(direction) {
        const segments = W.selectionManager.getSelectedFeatures().filter(f => f.featureType === 'segment').map(f => f._wmeObject);
        const shiftAmountMeters = parseFloat($('#shiftAmount').val());

        const multiAction = new MultiAction();

        segments.forEach(segment => {
            const newGeometry = structuredClone(segment.attributes.geoJSONGeometry);
            const originalLength = newGeometry.coordinates.length;

            const [longOffset, latOffset] = calculateDirectionalOffsets(shiftAmountMeters, direction);

            // Move only intermediate nodes
            for (let i = 1; i < originalLength - 1; i++) {
                newGeometry.coordinates[i][1] += latOffset;
                newGeometry.coordinates[i][0] += longOffset;
            }

            multiAction.doSubAction(W.model, new UpdateSegmentGeometry(segment, segment.attributes.geoJSONGeometry, newGeometry));
        });

        moveNodes(segments, multiAction, direction);

        W.model.actionManager.add(multiAction);
    }

    function moveNodes(segments, multiAction, direction) {
        const junctionNodes = new Set();

        segments.forEach(segment => {
            const terminalNodeIds = [segment.attributes.fromNodeID, segment.attributes.toNodeID];

            terminalNodeIds.forEach(nodeId => {
                const node = W.model.nodes.getObjectById(nodeId);
                if (!node) return;

                const connectedSegments = node.attributes.segIDs.filter(segId =>
                    segments.some(seg => seg.attributes.id === segId)
                );

                if (node.attributes.segIDs.length === 1 || connectedSegments.length > 1) {
                    // Add terminal or junction node to the set for movement
                    junctionNodes.add(nodeId);
                }
            });
        });

        junctionNodes.forEach(nodeId => {
            const node = W.model.nodes.getObjectById(nodeId);
            if (!node || !node.attributes.geoJSONGeometry) return;

            const newNodeGeometry = structuredClone(node.attributes.geoJSONGeometry);
            const [longOffset, latOffset] = calculateDirectionalOffsets(parseFloat($('#shiftAmount').val()), direction);

            newNodeGeometry.coordinates[1] += latOffset;
            newNodeGeometry.coordinates[0] += longOffset;

            const connectedSegObjs = {};
            node.attributes.segIDs.forEach(segId => {
                const seg = W.model.segments.getObjectById(segId);
                if (seg) {
                    connectedSegObjs[segId] = structuredClone(seg.attributes.geoJSONGeometry);
                }
            });

            multiAction.doSubAction(W.model, new MoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {}));
        });
    }

    function calculateDirectionalOffsets(distanceMeters, direction) {
        const earthRadius = 6378137;

        const latOffset = (distanceMeters / earthRadius) * (180 / Math.PI);
        const longOffset = (distanceMeters / (earthRadius * Math.cos(0))) * (180 / Math.PI);

        let adjustedLatOffset = 0, adjustedLongOffset = 0;
        switch (direction) {
            case "up":
                adjustedLatOffset = latOffset;
                break;
            case "down":
                adjustedLatOffset = -latOffset;
                break;
            case "left":
                adjustedLongOffset = -longOffset;
                break;
            case "right":
                adjustedLongOffset = longOffset;
                break;
            case "up-left":
                adjustedLatOffset = latOffset;
                adjustedLongOffset = -longOffset;
                break;
            case "up-right":
                adjustedLatOffset = latOffset;
                adjustedLongOffset = longOffset;
                break;
            case "down-left":
                adjustedLatOffset = -latOffset;
                adjustedLongOffset = -longOffset;
                break;
            case "down-right":
                adjustedLatOffset = -latOffset;
                adjustedLongOffset = longOffset;
                break;
        }

        return [adjustedLongOffset, adjustedLatOffset];
    }

    function injectCss() {
        $('<style type="text/css">' + `
            .mover-button {
                background-color: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 5px;
                width: 35px;
                height: 35px;
                font-size: 18px;
                text-align: center;
                line-height: 35px;
                margin: 1px;
                cursor: pointer;
            }
            .mover-button:hover {
                background-color: #e0e0e0;
            }
            .fa-rotate-45 {
                -webkit-transform: rotate(45deg);
                -moz-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                -o-transform: rotate(45deg);
                transform: rotate(45deg);
            }
        ` + '</style>').appendTo('head');
    }

})();
