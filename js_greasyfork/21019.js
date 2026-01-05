// ==UserScript==
// @name         WME My hotkeys
// @description  Some custom shortcuts
// @version      0.6
// @author       Vinkoy
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/editor/*
// @include      https://editor-beta.waze.com/*/editor/*
// @namespace    https://greasyfork.org/en/scripts/21019-wme-my-hotkeys
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21019/WME%20My%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/21019/WME%20My%20hotkeys.meta.js
// ==/UserScript==

function myKey_bootstrap()
{
  /* begin running the code! */
  setTimeout(initialiseHNhotkeyFix, 999);
}

function initialiseHNhotkeyFix()
{
  I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_myKey_poi_place = "New POI (place)";
  Waze.accelerators.addAction("WME_myKey_poi_place", {group: 'default'});
  Waze.accelerators.events.register("WME_myKey_poi_place", null, newPOIplace);
  Waze.accelerators._registerShortcuts({ 'o' : "WME_myKey_poi_place"});

  I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_myKey_poi_point = "New POI (point)";
  Waze.accelerators.addAction("WME_myKey_poi_point", {group: 'default'});
  Waze.accelerators.events.register("WME_myKey_poi_point", null, newPOIpoint);
  Waze.accelerators._registerShortcuts({ 'p' : "WME_myKey_poi_point"});

}

function newPOIplace()
{
    $('.toolbar-group-venues').find('.dropdown-menu').find('.toolbar-group-item').eq(6).find('.polygon').click();
}

function newPOIpoint()
{
    $('.toolbar-group-venues').find('.dropdown-menu').find('.toolbar-group-item').eq(6).find('.point').click();
}

myKey_bootstrap(); 