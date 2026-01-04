// ==UserScript==
// @name        Lumens bulk buy - broadcasthe.net
// @namespace   brownwall
// @match       https://broadcasthe.net/bonus.php
// @grant       none
// @version     1.0.2
// @author      brownwall
// @description Exchange bonus points for lumens in bulk. Specify the number of lumens to buy and let the script do the rest
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/466472/Lumens%20bulk%20buy%20-%20broadcasthenet.user.js
// @updateURL https://update.greasyfork.org/scripts/466472/Lumens%20bulk%20buy%20-%20broadcasthenet.meta.js
// ==/UserScript==

// Loads jQuery and triggers a callback function when jQuery has finished loading
async function addJQuery(callback) {
  let script = document.createElement('script');
  script.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js');
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}


async function main() {
  "use strict";
  let increment = [500, 100, 50, 25, 5, 1];
  let incrementID = [6, 5, 4, 3, 2, 1];
  var inprogress = 0;

  function bulkBuyETA(steps) {
    let intname = ['d', 'h', 'm', 's' ];
    let intval = [60*60*24, 60*60, 60, 1];
    var i = 0;
    while (i < intval.length && intval[i] > steps) i++;
    return '' + ~~(steps/intval[i]) + intname[i] + (i+1<intval.length ? (Math.round((steps%intval[i])/intval[i+1])+intname[i+1]) : '');
  }
  function stepsRequired(lumens) {
    var steps = 0;
    var t = lumens;
    for (let i = 0; i < increment.length; i++) {
      var r = t % increment[i];
      steps += (t-r) / increment[i];
      t = r;
    }
    return steps;
  }

  async function bulkBuy(){
    var lumens = jQ('#lumenBulkBuyAmt').val();
    var steps = 0;
    var totalBP = 0;
    var totalLumens = 0;
    let totalSteps = stepsRequired(lumens);
    if (inprogress) return;
    var error = 0;
    inprogress = 1;
    var j = 0;
    jQ('#lumenBulkBuyProgressDiv').css('display', 'grid');
    var waitUntil = (new Date()).getTime() + 1000;
    var now;
    for (let i = -1; i < totalSteps;) {
      if (i != -1){
        while (j+1 < increment.length && increment[j] > lumens) j++;
        var r = await fetch("bonus.php", {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},body: "action=exchange_lumen&do="+incrementID[j]});
        var rtext = '';
        var f = [];
        if (r.ok) {
          rtext = await r.text();
          f = rtext.split('|');
        }
        if (!r.ok || "success" != f[0]) {
          $("#lumen_exchange_dialog").dialog('close');
          if (totalLumens > 0) {
            rtext = "After successfully exchanging " + totalBP + " for " + totalLumens + " lumens, the server returned the following error: " + rtext;
          }
          errorBox(rtext);
          jQ('#lumenBulkBuyProgressDiv').hide();
          return;
        }
        updateBonusMenu(f[1]);
				updateLumenMenu(f[2]);
        lumens -= Math.floor(f[4]);
        totalLumens += Math.floor(f[4]);
        totalBP += Math.floor(f[3]);
        now = (new Date()).getTime();
        if (now < waitUntil) {
            await new Promise((r) => setTimeout(r, waitUntil-now));
        }
        waitUntil += 1000;
      }
      i++;
      jQ('#lumenBulkBuyProgressText').html('' + ~~(100*i/totalSteps) + '% - ' + bulkBuyETA(totalSteps-i) + ' remaining');
      jQ('#lumenBulkBuyProgressBar').css('width', ~~(100*i/totalSteps) + '%');
    }
    jQ('#lumenBulkBuyProgressDiv').hide();
    inprogress = 0;
    $("#lumen_exchange_dialog").dialog('close');
    successBox("Congratulations! You have successfully exchanged " + totalBP + " Bonus Points for " + totalLumens + " Lumens :)");
  }

  function updateCost(){
    var lumens = jQ('#lumenBulkBuyAmt').val();
    if (jQ.isNumeric(lumens)) {
      var lumensCanical = Math.max(Math.floor(lumens), 0);
      if (lumensCanical != lumens) {
        jQ('#lumenBulkBuyAmt').val(lumensCanical);
      }
      lumens = lumensCanical;
    }
    jQ('#lumenBulkBuyCost').html(jQ.isNumeric(lumens) ? (Math.floor(lumens) * 1200).toLocaleString() : 0);
  }

  function insert(){
    var table = document.getElementById("lumen_exchange_dialog").getElementsByTagName('table')[0];
    var tableRow = jQ(table).find('> tbody > tr').filter(function() { return jQ(this).text().trim() == "Exchange Lumens for Bonus";}).closest("tr");
    var newRow = document.createElement('tr');
    newRow.innerHTML = '<td><form action="#noop" onsubmit="return false;"><input type="number" step="1" value="1" min=0 id=lumenBulkBuyAmt> Lumens for <span id="lumenBulkBuyCost">1200</span> BP</td><td><form action="#noop" onsubmit="return false;"><input type="submit" value="Buy"/></form></td>';
    jQ(newRow).find(':submit').on('click', bulkBuy);
    tableRow.before(newRow);
    tableRow.before('<tr><td id="lumenBulkBuyProgressDiv" style="display: none; grid-template: 1fr / 1fr; z-index: 0; width: 100%; background-color: grey;" colspan=2><div id="lumenBulkBuyProgressText" style="z-index: 2; grid-column: 1/1; grid-row: 1/1; width: 100%; text-align: center;"></div><div id="lumenBulkBuyProgressBar" style="z-index: 1; grid-column: 1/1; grid-row: 1/1; background-color: green; width: 0%;"></div></td></tr>');
    jQ('#lumenBulkBuyAmt').on('input', updateCost);
  }
  insert();

}

// Load jQuery and then execute the main function
addJQuery(main);
