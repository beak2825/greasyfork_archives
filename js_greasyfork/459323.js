// ==UserScript==
// @name         Rodeo Bar
// @namespace    https://github.com/samoore036/CF-TamperMonkey-Scripts
// @version      2.2.2
// @description  Rodeo resource bar to display metrics to increase visibility for CF leads and sites alike
// @author       mooshahe
// @match        https://rodeo-iad.amazon.com/*/ExSD*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/459323/Rodeo%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/459323/Rodeo%20Bar.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const fc = document.getElementById("fcpn-site-input").value;

    //Thresholds - TNS/ARNS
    //Check for setting thresholds
    let type;
    switch(fc) {
        case "SAT1":
        case "DFW6":
        case "TPA2":
        case "OAK3":
        case "BFI3":
            type = "ARNS";
            break;
        default:
            type = "TNS";
    }

    const scannedThreshold = type === "ARNS" ? 800 : 350;
    const psThreshold = type === "ARNS" ? 100 : 50;

    //get rid of current text to make room for new div
    document.getElementsByClassName('process-path-title')[0].textContent = '';
    let parentDiv = document.getElementsByClassName('process-path-title')[0].parentElement;
    editParentDiv(parentDiv);

    makeCfDisplay();

    //edit the original parent div that the new divs will go into
    function editParentDiv(div) {
        let style = div.style;
        style.paddingTop = '1rem';
        style.paddingLeft = '3rem';
        style.display = 'flex';
    }

    //make all of the divs and put it into a main div that attaches to original parent div
    function makeCfDisplay() {
        const wipDiv = makeWipDiv();
        const pickableDiv = makePickableDiv();
        const psolveDiv = makePsolveDiv();
        const scannedDiv = makeScannedDiv();
        const divs = [wipDiv, pickableDiv, psolveDiv, scannedDiv];
        makeDisplayParentDiv(divs);
    }

    //make main div
    function makeDisplayParentDiv(divs) {
        let displayDiv = document.createElement('div');
        let style = displayDiv.style;
        style.display = 'flex';
        style.gap = '1vw';
        divs.forEach(div => displayDiv.appendChild(div));
        parentDiv.appendChild(displayDiv);
    }

    //wip is picking picked + rebin buffered + sorted for TNS. ARNS is the same + induct
    function makeWipDiv() {
        let totWip, rebinBuffered, sorted, induct
        let newDiv = document.createElement('div');

        const pickingPicked = document.getElementById('PickingPickedTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].textContent.trim();
        if (document.getElementById('RebinBufferedTable') === null) {
            rebinBuffered = 0;
        } else {
            rebinBuffered = document.getElementById('RebinBufferedTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].textContent.trim();
        }
        //check if there is anything in sorted to begin with
        if (document.getElementById('SortedTable') === null) {
            sorted = 0;
        } else {
            sorted = document.getElementById('SortedTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].textContent.trim();
        }

        if (type === 'ARNS') {
            if (document.getElementById('InductedTable') !== null) {
                induct = document.getElementById('InductedTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].textContent.trim();
            }
            totWip = parseInt(pickingPicked) + parseInt(induct) + parseInt(rebinBuffered) + parseInt(sorted);
            newDiv.textContent = `Total WIP: ${totWip} | PP: ${pickingPicked} | Induct: ${induct} | Rebin: ${rebinBuffered} | Sorted: ${sorted}`;
        } else {
            totWip = parseInt(pickingPicked) + parseInt(rebinBuffered) + parseInt(sorted);
            newDiv.textContent = `Total WIP: ${totWip} | PP: ${pickingPicked} | Rebin: ${rebinBuffered} | Sorted: ${sorted}`;
        }

        styleDiv(newDiv);
        return newDiv;
    }

    //psolve will flag yellow at 80% of threshold and red at 100% of threshold
    function makePsolveDiv() {
        let psolveTot;
        if (document.getElementById('ProblemSolvingTable') === null) {
            psolveTot = 0;
        } else {
            psolveTot = document.getElementById('ProblemSolvingTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].textContent.trim();
        }

        let newDiv = document.createElement('div');
        let style = newDiv.style;
        if (parseInt(psolveTot) < psThreshold * .8) {
            style.backgroundColor = '#C6EFCE'; style.color = '#006100';
        }
        if (parseInt(psolveTot) >= psThreshold * .8) {
            style.backgroundColor = '#FFEB9C'; style.color = '#9C6500';
        }
        if (parseInt(psolveTot) >= psThreshold) {
            style.backgroundColor = '#FFC7CE'; style.color = '#9C0006';
        }
        newDiv.textContent = `PS: ${psolveTot}`;
        styleDiv(newDiv);
        return newDiv;
    }

    //scanned will flag yellow at 80% of threshold and red at 100% of threshold
    function makeScannedDiv() {
        let scannedTot;
        if (document.getElementById('ScannedTable') === null) {
            scannedTot = 0;
        } else {
            scannedTot = document.getElementById('ScannedTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].textContent.trim();
        }

        let newDiv = document.createElement('div');
        let style = newDiv.style;
        if (parseInt(scannedTot) < scannedThreshold * .8) {
            style.backgroundColor = '#C6EFCE'; style.color = '#006100';
        }
        if (parseInt(scannedTot) >= scannedThreshold * .8 ) {
            style.backgroundColor = '#FFEB9C'; style.color = '#9C6500';
        }
        if (parseInt(scannedTot) >= scannedThreshold) {
            style.backgroundColor = '#FFC7CE'; style.color = '#9C0006';
        }
        newDiv.textContent = `Scanned: ${scannedTot}`;
        styleDiv(newDiv);
        return newDiv;
    }

    //pickable is RTP TOT + PNYP TOT - RTP NP TOT - PNYP NP TOT
    function makePickableDiv() {
        let rtpTot, rtpNpTot, pnypNpTot
        if (!document.getElementById('ReadyToPickTable')) {
            rtpTot = 0;
            rtpNpTot = 0;
        } else {
            if (!document.getElementById('ReadyToPickHardCappedTable')) {
                rtpNpTot = 0
            } else {
                rtpNpTot = document.getElementById('ReadyToPickHardCappedTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].textContent.trim();
            }
            rtpTot = document.getElementById('ReadyToPickTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].textContent.trim();
        }
        
        const pnypTot = document.getElementById('PickingNotYetPickedTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].textContent.trim();
        if (!document.getElementById('PickingNotYetPickedHardCappedTable')) {
            pnypNpTot = 0
        } else {
            pnypNpTot = document.getElementById('PickingNotYetPickedHardCappedTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].textContent.trim();
        }
        const pickable = parseInt(rtpTot) + parseInt(pnypTot) - parseInt(rtpNpTot) - parseInt(pnypNpTot);

        let newDiv = document.createElement('div');
        newDiv.textContent = `Total Pickable: ${pickable}`;
        styleDiv(newDiv);
        return newDiv;
    }

    //common styling for each div
    function styleDiv(div) {
        const style = div.style;
        style.padding = '1rem';
        style.border = '1px solid #e6e6e6';
        style.borderRadius = '5px';
        style.fontSize = '1.3rem';
        style.display = 'flex';
        return div;
    }
}());
