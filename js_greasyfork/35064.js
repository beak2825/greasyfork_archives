// ==UserScript==
// @name         Quick Links (new sidebar)
// @namespace    MysticBix.tornQuickLinks
// @version      0.3
// @description  Adds more links to sidebar, original script by Limits[1312721]; remade to work with new sidebar
// @author       MysticBix
// @match        http://*.torn.com/*
// @match        https://*.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35064/Quick%20Links%20%28new%20sidebar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35064/Quick%20Links%20%28new%20sidebar%29.meta.js
// ==/UserScript==

$(".account-links-wrap___2CqNb").after('<div class="toggle-block___13zU2"><h2 class="header___30pTh tablet___2Z6iV">Quick Links</h2><div class="area-tablet___2TtHL" id="nav-city"><div class="area-row___51NLj"><a href="/pmarket.php"><i class="cql-points-market" data-reactid=".0.0.0:0.0.9.0.0"></i><span>Points Market</span></a></div></div><div class="area-tablet___2TtHL" id="nav-city"><div class="area-row___51NLj"><a href="/travelagency.php"><i class="cql-travel-agency" data-reactid=".0.0.0:0.0.3.0.0"></i><span>Travel</span></a></div></div><div class="area-tablet___2TtHL" id="nav-city"><div class="area-row___51NLj"><a href="/imarket.php#/p=market&cat=melee-weapon"><i class="cql-item-market" data-reactid=".0.0.0:0.0.7.0.0"></i><span>Items Market</span></a></div></div></div>');
