// ==UserScript==
// @name         Items Market, Travel, Notebook, Faction Armoury & Vault
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Side bar extension
// @author       Limits & Sil3nced
// @match        *.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21335/Items%20Market%2C%20Travel%2C%20Notebook%2C%20Faction%20Armoury%20%20Vault.user.js
// @updateURL https://update.greasyfork.org/scripts/21335/Items%20Market%2C%20Travel%2C%20Notebook%2C%20Faction%20Armoury%20%20Vault.meta.js
// ==/UserScript==

$('#areas-list-menu li:eq(1)').after('<li><div class="list-link" id="nav-items"><a href="/factions.php?step=your#/tab=armoury"><i class="my-faction-navigation-icons left"></i><span class="border-1"></span><span class="border-r"></span><span class="list-link-name">Faction Armoury</span></a></div>');
$('#areas-list-menu li:eq(1)').after('<li><div class="list-link" id="nav-items"><a href="/notebook.php"><i class="newspaper-navigation-icons left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Notebook</span></a></div>');
$('#areas-list-menu li:eq(1)').after('<li><div class="list-link" id="nav-items"><a href="/travelagency.php"><i class="missions-navigation-icons left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Travel</span></a></div>');
$('#areas-list-menu li:eq(1)').after('<li><div class="list-link" id="nav-items"><a href="/properties.php#/p=options&tab=vault"><i class="home-navigation-icons left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Vault</span></a></div>');
$('#areas-list-menu li:eq(1)').after('<li><div class="list-link" id="nav-items"><a href="/imarket.php#/p=market&cat=melee-weapon"><i class="items-navigation-icons left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Items Market</span></a></div>');