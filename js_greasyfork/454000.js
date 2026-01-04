// ==UserScript==
// @name         Digital EDOC URL Search
// @name:tr      Digital EDOC URL Araması
// @namespace    https://github.com/nhtctn
// @version      1.0
// @description  Search a text on Digital EDOC via Url with all fields checked. (https://edoc.uchicago.edu/edoc2013/digitaledoc_linearformat.php?q=切韻  &  https://edoc.uchicago.edu/edoc2013/digitaledoc_tableformat.php?q=切韻)
// @description:tr Digital EDOC sitesinde tüm alanlar seçili şekilde URL'den arama yapar. (https://edoc.uchicago.edu/edoc2013/digitaledoc_linearformat.php?q=切韻  &  https://edoc.uchicago.edu/edoc2013/digitaledoc_tableformat.php?q=切韻)
// @author       nht.ctn
// @license      MIT
// @match        *://edoc.uchicago.edu/edoc2013/digitaledoc_linearformat.php?q=*
// @match        *://edoc.uchicago.edu/edoc2013/digitaledoc_tableformat.php?q=*
// @grant        none
// @require	     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/454000/Digital%20EDOC%20URL%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/454000/Digital%20EDOC%20URL%20Search.meta.js
// ==/UserScript==
/* global $ */
/*jshint esversion: 6 */
(function() {
    'use strict';

	$('head').prepend('<meta charset="Shift-JIS"/>');
	var urlParams = new URLSearchParams(window.location.search);
	var postKeyword = urlParams.get('q');
	var baseUrl = window.location.href.replace(/\.php.+/, ".php");

	if (urlParams.get('q') && postKeyword !== '') {
		$('#text_input').val(postKeyword);
		$(`[onclick="checkedAll('qygy[]');"]`).click();
		$(`[onclick="checkedAll('bs2012[]');"]`).click();
		$(`[onclick="checkedAll('edoc[]');"]`).click();
		$(`[name="Run_button"]`).click();
	}
	else{
		document.location = baseUrl;
	}
})();