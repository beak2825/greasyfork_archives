// ==UserScript==
// @name        HV - Item World Cost Calculator
// @grant       none
// @include     http://hentaiverse.org/pages/showequip.php?eid=*&key=*
// @version 0.0.1.20180326024541
// @namespace https://greasyfork.org/users/2233
// @description Calculates various numbers related to IW service
// @downloadURL https://update.greasyfork.org/scripts/13556/HV%20-%20Item%20World%20Cost%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/13556/HV%20-%20Item%20World%20Cost%20Calculator.meta.js
// ==/UserScript==

/*** Settings ***/
var price_per_pxp = 12
var pxp_multiplier = 16.0

/*** Enf of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var m = $('#equipment').textContent.match(/Potency Tier:(.*?)\((.*?)\)/)
if(m) {
    var lv = parseInt(m[1])
    if(lv == 10) { console.log('The equipment is already Lv.10.') }
    else {
        var p_now = parseInt(m[2].match(/(\d+).*?\//)[1])
        var p_max = parseInt(m[2].match(/\/.*?(\d+)/)[1])

        // PXP(1)
        var p1
        if(lv == 0) { p1 = p_max }
        else {
            for(var i=1, p_test=1, smallest=Infinity, tmp; i<=1000; i++) {
                p_test = i * Math.pow((1 + i/1000), lv)
                tmp = Math.abs(p_test - p_max)
                if(tmp < smallest) { smallest = tmp; p1 = i }
            }
        }

        // PXP(2), PXP(3), ... , PXP(10)
        var p = { 1:p1 }
        for(var i=2; i<=10; i++) { p[i] = Math.ceil(p1 * Math.pow((1 + p1/1000), i-1)) }
        console.log('PXP(i) = ' + JSON.stringify(p))

        // Sum of PXP(i), where i = 1 to 10
        var p_all = 0
        for(var i=1; i<=10; i++) { p_all += p[i] }
        console.log('PXP(1)+PXP(2)+...+PXP(10) = ' + p_all)
        console.log('PXP(1)+PXP(2)+...+PXP(10) = ' + Math.ceil(1000 * (Math.pow((1 + p1/1000), 10) - 1)))

        // Sum of PXP(i), where i = now to 10
        var p_partial = p_max - p_now
        for(var i=lv+2; i<=10; i++) { p_partial += p[i] }
        console.log('PXP(' + lv + ')+...+PXP(10) = ' + p_partial)

        // The quality of the equipment
        var q = (p1 - 100) / 250
        console.log('The quality of the equipment = ' + q)

        // Number of rounds in one run
        var round = Math.ceil(75 * Math.pow(q, 3))
        if(round < 10) { round = 10 }
        if(round > 100) { round = 100 }
        console.log('Number of rounds in one run = ' + round)

        // PXP per run
        var p_gain = Math.ceil(round * pxp_multiplier * ($('#equipment').textContent.indexOf('Soulbound') != -1 ? 2 : 1))
        console.log('PXP per run = ' + p_gain)

        // Price per run
        var price_per_run = p_gain * price_per_pxp
        console.log('Price per run = ' + price_per_run)

        // Number of runs (Lv.0 to Lv.10)
        var run_all = Math.ceil(p_all / p_gain)
        console.log('Number of runs (Lv.0 to Lv.10) = ' + run_all)

        // Total cost (Lv.0 to Lv.10)
        var cost_all = price_per_run * run_all
        console.log('Total cost (Lv.0 to Lv.10) = ' + cost_all)

        // Number of runs (Lv.now to Lv.10)
        var run_partial = Math.ceil(p_partial / p_gain)
        console.log('Number of runs (Lv.now to Lv.10) = ' + run_partial)

        // Total cost (Lv.now to Lv.10)
        var cost_partial = price_per_run * run_partial
        console.log('Total cost (Lv.now to Lv.10) = ' + cost_partial)
    }
}
