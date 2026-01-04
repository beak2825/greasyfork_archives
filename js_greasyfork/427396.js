// ==UserScript==
// @name         Resource Value Saver
// @namespace    http://www.knightsradiant.pw
// @version      0.11
// @description  Store resource values from the ticker for calculation in other scripts
// @author       Talus
// @match        https://politicsandwar.com/index.php?id=26*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427396/Resource%20Value%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/427396/Resource%20Value%20Saver.meta.js
// ==/UserScript==

(function(){
    var tickerSelectPath = '#rightcolumn > p.alert.alert-warning > marquee';
    var resourceRE = /Food: \$(?<food>[\d,]+) Steel: \$(?<steel>[\d,]+) Aluminum: \$(?<aluminum>[\d,]+) Munitions: \$(?<munitions>[\d,]+) Gasoline: \$(?<gasoline>[\d,]+) Coal: \$(?<coal>[\d,]+) Oil: \$(?<oil>[\d,]+) Uranium: \$(?<uranium>[\d,]+) Iron: \$(?<iron>[\d,]+) Bauxite: \$(?<bauxite>[\d,]+) Lead: \$(?<lead>[\d,]+) Credits: \$(?<credits>[\d,]+)/;
    var $ = window.jQuery;
    var tickerText = $(tickerSelectPath).text();
    var resourceValues = tickerText.match(resourceRE).groups;
    for (const property in resourceValues) {
        resourceValues[property] = resourceValues[property].replaceAll(',','');
    }
    localStorage.setItem('resourceValues', JSON.stringify(resourceValues));
})();