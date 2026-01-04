// ==UserScript==
// @name         WME Segment Shift Utility
// @namespace    https://github.com/kid4rm90s/Segment-Shift-Utility
// @version      2025.12.27.02
// @description  Utility for shifting street segments in WME without disconnecting nodes
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/*
// @author       kid4rm90s
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/560385/code/WazeToastr.js
// @require      https://cdn.jsdelivr.net/gh/wazeSpace/wme-sdk-plus@06108853094d40f67e923ba0fe0de31b1cec4412/wme-sdk-plus.js
// @exclude      https://cdn.jsdelivr.net/gh/WazeSpace/wme-sdk-plus@latest/wme-sdk-plus.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537258/WME%20Segment%20Shift%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/537258/WME%20Segment%20Shift%20Utility.meta.js
// ==/UserScript==

/* global getWmeSdk */
/* global initWmeSdkPlus */
/* global WazeToastr */
/* global turf */
/* global $ */
/* global jQuery */
/* global I18n */
/* eslint curly: ["warn", "multi-or-nest"] */

/*Scripts modified from WME RA Util (https://greasyfork.org/en/scripts/23616-wme-ra-util)
orgianl author: JustinS83 Waze*/
(function () {
  const updateMessage = ' <strong>Fixed :</strong><br> - Temporary fix for alerts not displaying properly.';
  const scriptVersion = GM_info.script.version.toString();
  const scriptName = GM_info.script.name;
  const downloadUrl = GM_info.script.downloadURL;
  const forumURL = 'https://greasyfork.org/scripts/537258-segment-shift-utility/feedback';

  const DIRECTION = {
    NORTH: 0,
    EAST: 90,
    SOUTH: 180,
    WEST: 270,
  };

  let sdk;
  let _settings;

  async function bootstrap() {
    const wmeSdk = getWmeSdk({ scriptId: 'wme-ss-util', scriptName: 'WME SS Util' });
    const sdkPlus = await initWmeSdkPlus(wmeSdk, {
      hooks: ['Editing.Transactions'],
    });
    sdk = sdkPlus || wmeSdk;
    sdk.Events.once({ eventName: 'wme-ready' }).then(() => {
      init();
    });
  }

  function waitForWME() {
    if (!unsafeWindow.SDK_INITIALIZED) {
      setTimeout(waitForWME, 500);
      return;
    }
    unsafeWindow.SDK_INITIALIZED.then(bootstrap);
  }
  waitForWME();

function scriptupdatemonitor() {
  if (WazeToastr?.Ready) {
    // Create and start the ScriptUpdateMonitor
    const updateMonitor = new WazeToastr.Alerts.ScriptUpdateMonitor(scriptName, scriptVersion, downloadUrl, GM_xmlhttpRequest);

    // Check immediately on page load, then every 2 hours
    updateMonitor.start(2, true); // checkImmediately = true

    // Show the update dialog for the current version
    WazeToastr.Interface.ShowScriptUpdate(scriptName, scriptVersion, updateMessage, downloadUrl);
  } else {
    setTimeout(scriptupdatemonitor, 250);
  }
}
  scriptupdatemonitor();
  
  function init() {
    console.log('SS UTIL', GM_info.script);
    injectCss();
    // UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry'); // Replaced by SDK
    // MoveNode = require("Waze/Action/MoveNode"); // Replaced by SDK
    // MultiAction = require("Waze/Action/MultiAction"); // Replaced by SDK

    SSUtilWindow = document.createElement('div');
    SSUtilWindow.id = 'SSUtilWindow'; // Consistent ID
    SSUtilWindow.style.position = 'fixed';
    SSUtilWindow.style.visibility = 'hidden';
    SSUtilWindow.style.top = '15%';
    SSUtilWindow.style.left = '25%';
    SSUtilWindow.style.width = '250px';
    SSUtilWindow.style.zIndex = 100;
    SSUtilWindow.style.backgroundColor = '#FFFFFE';
    SSUtilWindow.style.borderWidth = '0px';
    SSUtilWindow.style.borderStyle = 'solid';
    SSUtilWindow.style.borderRadius = '10px';
    SSUtilWindow.style.boxShadow = '5px 5px 10px Silver';
    SSUtilWindow.style.padding = '4px';

    let SSUtilWindowHTML =
      '<div id="header" style="padding: 4px; background-color:#92C3D3; border-radius: 5px;-moz-border-radius: 5px;-webkit-border-radius: 5px; color: white; font-weight: bold; text-align:center; letter-spacing: 1px;text-shadow: black 0.1em 0.1em 0.2em;"><img src="https://storage.googleapis.com/wazeopedia-files/1/1e/RA_Util.png" style="float:left"></img> Segment Shift Utility <a data-toggle="collapse" href="#divWrappers1" id="collapserLink1" style="float:right"><span id="collapser1" style="cursor:pointer;padding:2px;color:white;" class="fa fa-caret-square-o-up"></a></span></div>';
    // start collapse // I put it al the beginning
    SSUtilWindowHTML += '<div id="divWrappers1" class="collapse in">';
    //***************** Disconnect Nodes Checkbox **************************
    SSUtilWindowHTML += '<p style="margin: 10px 0px 0px 20px;"><input type="checkbox" id="chkDisconnectNodes"> Disconnect Nodes</p>';
    //***************** Shift Amount **************************
    // Define BOX
    SSUtilWindowHTML +=
      '<div id="contentShift" style="text-align:center;float:left; width: 120px;max-width: 49%;height: 170px;margin: 1em 5px 0px 0px;opacity:1;border-radius: 2px;-moz-border-radius: 2px;-webkit-border-radius: 4px;border-width:1px;border-style:solid;border-color:#92C3D3;padding:2px;}">';
    SSUtilWindowHTML +=
      '<b>Shift amount</b></br><input type="text" name="shiftAmount" id="shiftAmount" size="1" style="float: left; text-align: center;font: inherit; line-height: normal; width: 30px; height: 20px; margin: 5px 4px; box-sizing: border-box; display: block; padding-left: 0; border-bottom-color: rgba(black,.3); background: transparent; outline: none; color: black;" value="1"/> <div style="margin: 5px 4px;">Metre(s)';
    // Shift amount controls
    SSUtilWindowHTML +=
      '<div id="controls" style="text-align:center; padding:06px 4px;width=100px; height=100px;margin: 5px 0px;border-style:solid; border-width: 2px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1);-moz-box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1);-webkit-box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1); background:#92C3D3;align:center;">';
    //Single Shift Up Button
    SSUtilWindowHTML += '<span id="SSShiftUpBtn" style="cursor:pointer;font-size:14px;">';
    SSUtilWindowHTML += '<i class="fa fa-angle-double-up fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; vertical-align: top;"> </i>';
    SSUtilWindowHTML += '<span id="UpBtnCaption" style="font-weight: bold;"></span>';
    SSUtilWindowHTML += '</span><br>';
    //Single Shift Left Button
    SSUtilWindowHTML += '<span id="SSShiftLeftBtn" style="cursor:pointer;font-size:14px;margin-left:-40px;">';
    SSUtilWindowHTML += '<i class="fa fa-angle-double-left fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; vertical-align: middle"> </i>';
    SSUtilWindowHTML += '<span id="LeftBtnCaption" style="font-weight: bold;"></span>';
    SSUtilWindowHTML += '</span>';
    //Single Shift Right Button
    SSUtilWindowHTML += '<span id="SSShiftRightBtn" style="float: right;cursor:pointer;font-size:14px;margin-right:5px;">';
    SSUtilWindowHTML += '<i class="fa fa-angle-double-right fa-2x" style="color: white;text-shadow: black 0.1em 0.1em 0.2em;  vertical-align: middle"> </i>';
    SSUtilWindowHTML += '<span id="RightBtnCaption" style="font-weight: bold;"></span>';
    SSUtilWindowHTML += '</span><br>';
    //Single Shift Down Button
    SSUtilWindowHTML += '<span id="SSShiftDownBtn" style="cursor:pointer;font-size:14px;margin-top:0px;">';
    SSUtilWindowHTML += '<i class="fa fa-angle-double-down fa-2x" style="color: white;text-shadow: black 0.1em 0.1em 0.2em;  vertical-align: middle"> </i>';
    SSUtilWindowHTML += '<span id="DownBtnCaption" style="font-weight: bold;"></span>';
    SSUtilWindowHTML += '</span>';
    SSUtilWindowHTML += '</div></div></div>';

    SSUtilWindow.innerHTML = SSUtilWindowHTML;
    document.body.appendChild(SSUtilWindow);

    $('#SSShiftLeftBtn').click(SSShiftLeftClick);
    $('#SSShiftRightBtn').click(SSShiftRightClick);
    $('#SSShiftUpBtn').click(SSShiftUpClick);
    $('#SSShiftDownBtn').click(SSShiftDownClick);

    $('#shiftAmount').keypress(function (event) {
      if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) event.preventDefault();
    });

    // Keyboard shortcut support for direction shift (Alt+Arrow)
    document.addEventListener(
      'keydown',
      function (e) {
        if (!e.altKey) return;
        // Prevent triggering when focus is in an input or textarea
        const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea') return;
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            SSShiftLeftClick(e);
            break;
          case 'ArrowRight':
            e.preventDefault();
            SSShiftRightClick(e);
            break;
          case 'ArrowUp':
            e.preventDefault();
            SSShiftUpClick(e);
            break;
          case 'ArrowDown':
            e.preventDefault();
            SSShiftDownClick(e);
            break;
        }
      },
      false
    );

    $('#collapserLink1').click(function () {
      $('#divWrappers1').slideToggle('fast');
      if ($('#collapser1').attr('class') == 'fa fa-caret-square-o-down') {
        $('#collapser1').removeClass('fa-caret-square-o-down');
        $('#collapser1').addClass('fa-caret-square-o-up');
      } else {
        $('#collapser1').removeClass('fa-caret-square-o-up');
        $('#collapser1').addClass('fa-caret-square-o-down');
      }
      saveSettingsToStorage();
    });

    const loadedSettings = JSON.parse(localStorage.getItem('WME_SSUtil'));
    const defaultSettings = {
      divTop: '15%',
      divLeft: '25%',
      Expanded: true,
      DisconnectNodes: false, // default to false (normal behavior)
    };
    _settings = loadedSettings ?? defaultSettings;

    $('#SSUtilWindow').css('left', _settings.divLeft);
    $('#SSUtilWindow').css('top', _settings.divTop);
    $('#chkDisconnectNodes').prop('checked', _settings.DisconnectNodes); // Set checkbox state from settings

    if (!_settings.Expanded) {
      $('#divWrappers1').hide();
      $('#collapser1').removeClass('fa-caret-square-o-up');
      $('#collapser1').addClass('fa-caret-square-o-down');
    }

    sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: checkDisplayTool });
  }

  function saveSettingsToStorage() {
    if (localStorage) {
      _settings.divLeft = $('#SSUtilWindow').css('left');
      _settings.divTop = $('#SSUtilWindow').css('top');
      _settings.Expanded = $('#collapser1').attr('class').indexOf('fa-caret-square-o-up') > -1;
      _settings.DisconnectNodes = $('#chkDisconnectNodes').is(':checked'); // Save checkbox state
      localStorage.setItem('WME_SSUtil', JSON.stringify(_settings));
    }
  }

  function checkDisplayTool() {
    if (sdk.Editing.getSelection()?.objectType === 'segment') {
      if (sdk.Editing.getSelection().length === 0) {
        $('#SSUtilWindow').css({ visibility: 'hidden' });
      } else {
        $('#SSUtilWindow').css({ visibility: 'visible' });
        if (typeof jQuery.ui !== 'undefined') {
          $('#SSUtilWindow').draggable({
            //Gotta nuke the height setting the dragging inserts otherwise the panel cannot collapse
            stop: () => {
              $('#SSUtilWindow').css('height', '');
              saveSettingsToStorage();
            },
          });
        }
      }
    } else {
      $('#SSUtilWindow').css({ visibility: 'hidden' });
      if (typeof jQuery.ui !== 'undefined') {
        $('#SSUtilWindow').draggable({
          stop: () => {
            $('#SSUtilWindow').css('height', '');
            saveSettingsToStorage();
          },
        });
      }
    }
  }

  function ShiftSegmentNodesLat(offset) {
    const selectedSegmentIds = sdk.Editing.getSelection()?.ids;
    if (!selectedSegmentIds || selectedSegmentIds.length === 0) {
      return;
    }

    const numOffset = parseFloat(offset);
    if (isNaN(numOffset)) {
      console.error('SS UTIL: Invalid shift amount for Latitude.');
      return;
    }

    const disconnectNodes = $('#chkDisconnectNodes').is(':checked'); // Checkbox state

    sdk.Editing.doActions(() => {
      const uniqueNodeIds = new Set();

      if (!disconnectNodes) {
        // Collect unique nodes from selected segments
        for (const segmentId of selectedSegmentIds) {
          const currentSegment = sdk.DataModel.Segments.getById({ segmentId });
          if (currentSegment) {
            uniqueNodeIds.add(currentSegment.fromNodeId);
            uniqueNodeIds.add(currentSegment.toNodeId);
          }
        }

        // Shift unique nodes
        for (const nodeId of uniqueNodeIds) {
          const node = sdk.DataModel.Nodes.getById({ nodeId });
          if (node) {
            let newNodeGeometry = structuredClone(node.geometry);
            const nodeBearing = numOffset > 0 ? DIRECTION.NORTH : DIRECTION.SOUTH;
            const nodeDistance = Math.abs(numOffset);
            const currentNodePoint = node.geometry.coordinates;
            const newNodePoint = turf.destination(currentNodePoint, nodeDistance, nodeBearing, { units: 'meters' });
            newNodeGeometry.coordinates = newNodePoint.geometry.coordinates;
            sdk.DataModel.Nodes.moveNode({ id: node.id, geometry: newNodeGeometry });
          }
        }
      }

      // Update Segment Geometries
      for (const segmentId of selectedSegmentIds) {
        const currentSegment = sdk.DataModel.Segments.getById({ segmentId });
        if (currentSegment) {
          let newGeometry = structuredClone(currentSegment.geometry);
          const originalLength = currentSegment.geometry.coordinates.length;
          const shiftDistance = Math.abs(numOffset);
          const shiftBearing = numOffset > 0 ? DIRECTION.NORTH : DIRECTION.SOUTH;

          if (disconnectNodes) {
            // Shift all points including end nodes
            for (let j = 0; j < originalLength; j++) {
              const currentPoint = currentSegment.geometry.coordinates[j];
              const newPoint = turf.destination(currentPoint, shiftDistance, shiftBearing, { units: 'meters' });
              newGeometry.coordinates[j] = newPoint.geometry.coordinates;
            }
          } else {
            // Shift only inner points
            for (let j = 1; j < originalLength - 1; j++) {
              const currentPoint = currentSegment.geometry.coordinates[j];
              const newPoint = turf.destination(currentPoint, shiftDistance, shiftBearing, { units: 'meters' });
              newGeometry.coordinates[j] = newPoint.geometry.coordinates;
            }
            // Update end points to match (potentially) moved nodes
            const fromNodeAfterMove = sdk.DataModel.Nodes.getById({ nodeId: currentSegment.fromNodeId });
            const toNodeAfterMove = sdk.DataModel.Nodes.getById({ nodeId: currentSegment.toNodeId });

            if (fromNodeAfterMove && newGeometry.coordinates.length > 0) {
              newGeometry.coordinates[0] = fromNodeAfterMove.geometry.coordinates;
            }
            if (toNodeAfterMove && newGeometry.coordinates.length > 1) {
              newGeometry.coordinates[originalLength - 1] = toNodeAfterMove.geometry.coordinates;
            }
          }
          sdk.DataModel.Segments.updateSegment({ segmentId: currentSegment.id, geometry: newGeometry });
        }
      }
    }, 'Shifted segments vertically');
  }

  function ShiftSegmentNodesLon(offset) {
    const selectedSegmentIds = sdk.Editing.getSelection()?.ids;
    if (!selectedSegmentIds || selectedSegmentIds.length === 0) {
      return;
    }

    const numOffset = parseFloat(offset);
    if (isNaN(numOffset)) {
      console.error('SS UTIL: Invalid shift amount for Longitude.');
      return;
    }

    const disconnectNodes = $('#chkDisconnectNodes').is(':checked'); // Checkbox state

    sdk.Editing.doActions(() => {
      const uniqueNodeIds = new Set();

      if (!disconnectNodes) {
        for (const segmentId of selectedSegmentIds) {
          const currentSegment = sdk.DataModel.Segments.getById({ segmentId });
          if (currentSegment) {
            uniqueNodeIds.add(currentSegment.fromNodeId);
            uniqueNodeIds.add(currentSegment.toNodeId);
          }
        }

        for (const nodeId of uniqueNodeIds) {
          const node = sdk.DataModel.Nodes.getById({ nodeId });
          if (node) {
            let newNodeGeometry = structuredClone(node.geometry);
            const nodeBearing = numOffset > 0 ? DIRECTION.EAST : DIRECTION.WEST;
            const nodeDistance = Math.abs(numOffset);
            const currentNodePoint = node.geometry.coordinates;
            const newNodePoint = turf.destination(currentNodePoint, nodeDistance, nodeBearing, { units: 'meters' });
            newNodeGeometry.coordinates = newNodePoint.geometry.coordinates;
            sdk.DataModel.Nodes.moveNode({ id: node.id, geometry: newNodeGeometry });
          }
        }
      }

      for (const segmentId of selectedSegmentIds) {
        const currentSegment = sdk.DataModel.Segments.getById({ segmentId });
        if (currentSegment) {
          let newGeometry = structuredClone(currentSegment.geometry);
          const originalLength = currentSegment.geometry.coordinates.length;
          const shiftDistance = Math.abs(numOffset);
          const shiftBearing = numOffset > 0 ? DIRECTION.EAST : DIRECTION.WEST;

          if (disconnectNodes) {
            for (let j = 0; j < originalLength; j++) {
              const currentPoint = currentSegment.geometry.coordinates[j];
              const newPoint = turf.destination(currentPoint, shiftDistance, shiftBearing, { units: 'meters' });
              newGeometry.coordinates[j] = newPoint.geometry.coordinates;
            }
          } else {
            for (let j = 1; j < originalLength - 1; j++) {
              const currentPoint = currentSegment.geometry.coordinates[j];
              const newPoint = turf.destination(currentPoint, shiftDistance, shiftBearing, { units: 'meters' });
              newGeometry.coordinates[j] = newPoint.geometry.coordinates;
            }
            const fromNodeAfterMove = sdk.DataModel.Nodes.getById({ nodeId: currentSegment.fromNodeId });
            const toNodeAfterMove = sdk.DataModel.Nodes.getById({ nodeId: currentSegment.toNodeId });

            if (fromNodeAfterMove && newGeometry.coordinates.length > 0) {
              newGeometry.coordinates[0] = fromNodeAfterMove.geometry.coordinates;
            }
            if (toNodeAfterMove && newGeometry.coordinates.length > 1) {
              newGeometry.coordinates[originalLength - 1] = toNodeAfterMove.geometry.coordinates;
            }
          }
          sdk.DataModel.Segments.updateSegment({ segmentId: currentSegment.id, geometry: newGeometry });
        }
      }
    }, 'Shifted segments horizontally');
  }

  //Left
  function SSShiftLeftClick(e) {
    e.stopPropagation();
    ShiftSegmentNodesLon(-parseFloat($('#shiftAmount').val())); // Negative for West
    WazeToastr.Alerts.info('WME Segment Shift Utility', `The segments are shifted by <b>${$('#shiftAmount').val()} Metres</b> to the left.`, false, false, 1500);
  }
  //Right
  function SSShiftRightClick(e) {
    e.stopPropagation();
    ShiftSegmentNodesLon(parseFloat($('#shiftAmount').val())); // Positive for East
    WazeToastr.Alerts.info('WME Segment Shift Utility', `The segments are shifted by <b>${$('#shiftAmount').val()} Metres</b> to the right.`, false, false, 1500);
  }
  //Up
  function SSShiftUpClick(e) {
    e.stopPropagation();
    ShiftSegmentNodesLat(parseFloat($('#shiftAmount').val()));
    WazeToastr.Alerts.info('WME Segment Shift Utility', `The segments are shifted by <b>${$('#shiftAmount').val()} Metres</b> to the up.`, false, false, 1500);
  }
  //Down
  function SSShiftDownClick(e) {
    e.stopPropagation();
    ShiftSegmentNodesLat(-parseFloat($('#shiftAmount').val()));
    WazeToastr.Alerts.info('WME Segment Shift Utility', `The segments are shifted by <b>${$('#shiftAmount').val()} Metres</b> to the down.`, false, false, 1500);
  }

  function injectCss() {
    const css = [].join(' '); // No custom CSS needed if these were the only ones
    $('<style type="text/css">' + css + '</style>').appendTo('head');
  }
  /*
  Changelog
  2025.07.04.01
  -  Added keyboard shortcuts (Alt + Arrow keys) for quick segment shifting in all four directions. This improves workflow speed and matches the behavior of other WME utility scripts.
  */
})();
