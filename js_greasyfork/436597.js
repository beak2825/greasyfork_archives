// ==UserScript==
// @name         Tehran air pollution
// @name:en      Tehran air pollution
// @name:fa      آلودگی هوای تهران
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tehran air pollution script. saves default values as settings.
// @description:en  Tehran air pollution script. saves default values as settings.
// @description:fa  شاخص آلودگی هوای تهران - تنظیمات شخصی
// @author       Arman Karimi
// @match        https://airnow.tehran.ir/home/OnlineAQI.aspx
// @icon         https://www.google.com/s2/favicons?domain=tehran.ir
// @grant        none
// @license      MIT
// @homepageURL  https://gist.github.com/iArmanKarimi/d46de5bbb59e7bc55d0250156819643b#file-readme-md
// @downloadURL https://update.greasyfork.org/scripts/436597/Tehran%20air%20pollution.user.js
// @updateURL https://update.greasyfork.org/scripts/436597/Tehran%20air%20pollution.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...

var LAST_STATION_NUM_LS = 'last-station'
var COLLAPSE_BUTTON_MAP_LS = 'map-collapsed'
var COLLAPSE_BUTTON_CHART_LS = 'chart-collapsed'
var STATION_DEFAULT_CB_CHECKED_LS = 'station-default-checkbox-checked'

var stations_text_el = document.getElementById('ContentPlaceHolder1_lblStation')
var stations_select_el = document.getElementById('ContentPlaceHolder1_ddlStation')

stations_select_el.addEventListener('change', function () {
	localStorage[LAST_STATION_NUM_LS] = this.value.toString()
})

var clue_collapse_map_el = document.querySelector("#form1 > div.wrapper > div > div > section.content > div:nth-child(2) > div:nth-child(2) > div > div.box-body")
var clue_collapse_chart_el = document.querySelector("#form1 > div.wrapper > div > div > section.content > div:nth-child(2) > div:nth-child(1) > div > div.box-body")

window.addEventListener("beforeunload", function () {
	localStorage[COLLAPSE_BUTTON_MAP_LS] = clue_collapse_map_el.style.display === 'none'
	localStorage[COLLAPSE_BUTTON_CHART_LS] = clue_collapse_chart_el.style.display === 'none'
}, false);

if (localStorage[STATION_DEFAULT_CB_CHECKED_LS] === 'true' &&
	stations_select_el.value !== localStorage[LAST_STATION_NUM_LS].toString()) {
	stations_select_el.value = localStorage[LAST_STATION_NUM_LS]
	stations_select_el.onchange()
}

var default_cb_el = document.createElement('input')
var default_cb_lbl_el = document.createElement('label')
stations_text_el.after(default_cb_el)
stations_text_el.after(default_cb_lbl_el)
default_cb_el.setAttribute('type', 'checkbox')
default_cb_el.setAttribute('name', 'def_station_btn_cb')
default_cb_lbl_el.setAttribute('for', 'def_station_btn_cb')
default_cb_lbl_el.textContent = 'پیش فرض'
default_cb_el.checked = localStorage[STATION_DEFAULT_CB_CHECKED_LS] === 'true'
default_cb_el.addEventListener('change', function () {
	localStorage[STATION_DEFAULT_CB_CHECKED_LS] = default_cb_el.checked
})

var map_btn_icon_el = document.querySelector("#form1 > div.wrapper > div > div > section.content > div:nth-child(2) > div:nth-child(2) > div > div.box-header.with-border > div > button > i")
var chart_btn_icon_el = document.querySelector("#form1 > div.wrapper > div > div > section.content > div:nth-child(2) > div:nth-child(1) > div > div.box-header.with-border > div > button > i")
var map_box_el = document.querySelector("#form1 > div.wrapper > div > div > section.content > div:nth-child(2) > div:nth-child(2) > div")
var chart_box_el = document.querySelector("#form1 > div.wrapper > div > div > section.content > div:nth-child(2) > div:nth-child(1) > div")

if (localStorage[COLLAPSE_BUTTON_MAP_LS] === 'true') {
	map_box_el.className += ' collapsed-box'
	map_btn_icon_el.className = 'fa fa-plus'
	clue_collapse_map_el.style.display = 'none'
}
if (localStorage[COLLAPSE_BUTTON_CHART_LS] === 'true') {
	chart_box_el.className += ' collapsed-box'
	chart_btn_icon_el.className = 'fa fa-plus'
	clue_collapse_chart_el.style.display = 'none'
}

    // END //

})();