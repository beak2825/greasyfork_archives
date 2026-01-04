// ==UserScript==
// @name        Icy-veins.com - Eu/de Battle net external links 
// @namespace   icy-veins.com
// @description Changes the external item and skill links from us/en battle net to eu/de region.
// @include     https://www.icy-veins.com/d3/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       all
// @run-at      document-end
// @version 0.0.1.20190126155827
// @downloadURL https://update.greasyfork.org/scripts/377117/Icy-veinscom%20-%20Eude%20Battle%20net%20external%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/377117/Icy-veinscom%20-%20Eude%20Battle%20net%20external%20links.meta.js
// ==/UserScript==

var Art = "Enabled"; // Type "Enabled" to replace external battle net links to eu/de region, "disabled" to use icy-veins default links (en/us).  

    switch (Art)
    {    
        case "Enabled":
        {
        $("body").html($("body").html().replace(/us.battle.net\/d3\/en/g,'eu.battle.net/d3/de'));    
        }
        break;
        case "Disabled":
        {        
        }
    }