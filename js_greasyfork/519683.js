// ==UserScript==
// @name        Search Listing Enhancer
// @namespace   https://github.com/robartsd
// @match       https://www.rabbitears.info/searchmap.php*
// @grant       none
// @version     1.1.2
// @author      robartsd
// @description Shows subchannel information (from the market listing page) when clicking on the cell in the channel column for a station; click again to hide.
// @license     GPL-3.0-or-later: https://choosealicense.com/licenses/gpl-3.0/
// @downloadURL https://update.greasyfork.org/scripts/519683/Search%20Listing%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/519683/Search%20Listing%20Enhancer.meta.js
// ==/UserScript==

const parser = new DOMParser();

function addSubchannelInfo(marketListingUrl) {
  const request = new XMLHttpRequest();
  request.addEventListener("load", function() {
    const response = parser.parseFromString(this.responseText, "text/html");
    response.querySelectorAll("table.marketdetail > tbody > tr:not(.spacerh4, .stationcell)").forEach((e)=>{
      const callsign = e.querySelector("td:nth-child(3) a nobr").innerText;
      const stationLink = e.querySelector("td:nth-child(3) a").getAttribute("href");
      const channels = [...e.querySelector("td:nth-child(2)").innerText.matchAll(/\b\d+\b/g)].map((match)=>match[0]);
      const stationchannels = e.nextElementSibling.querySelector("table.stationchannels:has(tbody)");
      console.log(callsign, channels, stationLink);
      channels.forEach((rf)=>{
        const target = document.querySelector(`tr[data-rf="${rf}"]:has(a[href="${stationLink}"]) > td:first-child:not(:has(div.subchannels))`);
        if (target) {
          const subchannels = document.createElement("div");
          subchannels.classList.add("subchannels");
          if (stationchannels) {
          subchannels.appendChild(stationchannels.cloneNode(true));
          const tbody = subchannels.querySelector("tbody");
          tbody.querySelectorAll("tr").forEach((tr)=>{
              const physical = tr.querySelector('td:nth-child(1)[colspan="2"]+td, td:nth-child(1):not([colspan])+td:not([colspan])+td');
              if (!physical || !physical.innerText.startsWith(rf)) {
                tbody.removeChild(tr);
              }
          });
          } else {
            subchannels.innerHTML = `<table width="300" class="stationchannels"><tr><td>No subchannel listing found for this station</td></tr></table>`;
          };
          target.appendChild(subchannels);
        }
      });
    });
  });
  request.open("GET", marketListingUrl);
  request.send();
}

const style = document.createElement("style");
style.innerText = "tr.hideStation, div.subchannels {display: none} tr.showSubchannels div.subchannels {display: block} div.subchannels {width: 0; margin: .2em} table.stationchannels {position: relative; background:#dddddd; left: -2.2em} tr.showSubchannels > td {vertical-align: top}";
document.querySelector("head").appendChild(style);

document.querySelectorAll("table.sortable tbody tr").forEach(
  (e)=>{
    if (e.querySelector("td[style*='background:#ffccff'], td[style*='background: rgb(255, 204, 255)']")) {
      e.dataset.status="off-air";
    } else if (e.querySelector("td[style*='background:#ccffcc'], td[style*='background: rgb(204, 255, 204)']")) {
      e.dataset.status="ATSC3";
    }
    e.dataset.rating = e.querySelector("td:nth-child(10) span").innerText.trim();
    e.dataset.rf = parseInt(e.querySelector("td:nth-child(1) a").innerText);
    e.dataset.band = e.dataset.rf < 7 ? "VHF-low" : e.dataset.rf < 14 ? "VHF-high" : "UHF";
    e.dataset.distance = parseFloat(e.querySelector("td:nth-child(7)").innerText);
    e.dataset.direction_true = parseFloat(e.querySelector("td:nth-child(8)").innerText);
    e.dataset.direction_magnetic = parseFloat(e.querySelector("td:nth-child(9)").innerText);
    e.dataset.field_strength = parseFloat(e.querySelector("td:nth-child(10)").innerText);
    e.dataset.signal_margin = parseFloat(e.querySelector("td:nth-child(11)").innerText);
    e.dataset.callsign = e.querySelector("td:nth-child(2) a:first-child").innerText.trim();
    e.dataset.station_info = e.querySelector("td:nth-child(2) a:first-child").getAttribute("href");
    e.querySelector("td:first-child").addEventListener("click", ()=>{
      e.classList.toggle("showSubchannels");
      if (!e.querySelector("td:first-child:has(div.subchannels)")) {
        addSubchannelInfo(e.dataset.station_info);
      }
    });
  }
);

