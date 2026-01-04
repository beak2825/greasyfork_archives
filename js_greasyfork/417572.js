// ==UserScript==
// @name        XCTrails Solver
// @namespace   XCTrails Solver
// @match       https://xctrails.org/ps/*
// @match       https://xctrails.org/ps2/*
// @match       https://www.xctrails.org/ps/*
// @match       https://www.xctrails.org/ps2/*
// @grant       none
// @version     1.1
// @author      Louhikoru
// @namespace   https://greasyfork.org/en/scripts/417572
// @homepageURL https://greasyfork.org/en/scripts/417572
// @supportURL  https://greasyfork.org/en/scripts/417572/feedback
// @description Automagic solving of XCTrail locations
// @license     The Coffeeware License
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/417572/XCTrails%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/417572/XCTrails%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict'
    function addScript(text) {
        const head = document.getElementsByTagName("head")[0] || document.documentElement
        const script = document.createElement('script')
        script.type = "text/javascript"
        script.appendChild(document.createTextNode(text))
        head.appendChild(script)
    }

    function copyToClipboard(str) {
        const el = document.createElement('textarea')
        el.value = str
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
    }

    addScript(`
var g_searchInfo

function solve()
{
  if (g_searchInfo == null)
    return
  let bounds = g_searchInfo.neswBounds.split(';').map(parseFloat)
  if (bounds.length != 4)
    return
  const ne = new google.maps.LatLng(bounds[0], bounds[1])
  const sw = new google.maps.LatLng(bounds[2], bounds[3])
  bounds = new google.maps.LatLngBounds(sw, ne)
  g_searchMap.fitBounds(bounds)
  window.setTimeout(() => {
    g_searchMap.setZoom(g_searchInfo.zoom)
    checkLocation(g_searchMap.solWindow)
  }, 1000)
}
`);

    // Prepare to catch search information
    initSearchMap = (function(_super) {
        return function() {
            _super.apply(this, arguments)
            g_searchInfo = arguments[0]
            let d = document.getElementById("searchInfo")
            d.innerHTML =
                "Lat: " + g_searchInfo.lat + " Lon: " + g_searchInfo.lon +
                " Listed: " + g_searchInfo.listed + " nextId: " + g_searchInfo.nextId +
                " similarity: " + g_searchInfo.similarity + "<br>neswBounds: " + g_searchInfo.neswBounds
            d = document.getElementById("searchAddress")
            d.innerHTML =
                '<input id="lookupAddress" type="text" maxlength="255" style="width: 340px;" value=""/>'+
                '<button style="margin-left:15px" type="button" class="btn btn-primary btn-sm" onclick="showLocation(\'search\')">'+
                '<span data-localize="jumpto">' + t_data.jumpto + '</span></button>'+
                '<button style="margin-left:12px" type="button" class="btn btn-primary btn-sm" onclick="solve()">Solve</button>'
        }
    })(initSearchMap)

    // Automatically copy the solution to clipboard
    updateStatus = (function(_super) {
        return function() {
            copyToClipboard(arguments[0])
            _super.apply(this, arguments)
        }
    })(updateStatus)

    // Add new row for search information
    const tr = document.getElementById("searchAddress").closest('tr')
    const newRow = tr.closest('tbody').insertRow(tr.rowIndex)
    newRow.innerHTML = `<td><div id="searchInfo" style="margin-top: 5px; margin-bottom:5px; font-size: 0.8em;"></div></td>`
})();