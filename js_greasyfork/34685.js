// ==UserScript==
// @name         Items Market, Travel and other
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Easy access to torn city Items Market
// @author       Limits (edited by Flambo)
// @match        http://*.torn.com/*
// @match        https://*.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34685/Items%20Market%2C%20Travel%20and%20other.user.js
// @updateURL https://update.greasyfork.org/scripts/34685/Items%20Market%2C%20Travel%20and%20other.meta.js
// ==/UserScript==
//$('#areas-list-menu li:eq(1)').after('<li><div class="list-link" id="nav-mansion"><a href="/travelagency.php"><i class="cql-travel-agency left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Travel</span></a></div>');
$('#areas-list-menu li:eq(1)').after('<li><div class="list-link" id="nav-items"><a href="/imarket.php#/p=market&cat=melee-weapon"><i class="cql-item-market left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Item Market</span></a></div>');
//$('#areas-list-menu li:eq(1)').after('<li><div class="list-link" id="nav-travel"><a href="/properties.php#"><i class="cql-your-property left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Mansion</span></a></div>');
document.getElementById('nav-hospital').innerHTML = '<a href="/hospitalview.php"><i class="cql-hospital left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Hospital</span></a>';
document.getElementById('nav-jail').innerHTML = '<a href="/jailview.php"><i class="cql-jail left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Jail</span></a>';
document.getElementById('nav-properties').innerHTML = '<a href="/properties.php#"><i class="cql-estate-agents left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Properties</span></a>';
document.getElementById('nav-missions').innerHTML = '<a href="/loader.php?sid=missions"><i class="cql-missions left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Missions</span></a>';
document.getElementById('nav-forums').parentNode.removeChild(document.getElementById('nav-forums'));