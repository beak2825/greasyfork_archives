// ==UserScript==
// @name       PcMasterRace_Gloria
// @version    0.1
// @description  Something here
// @namespace MatthewAllen
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match      http://www.pcmasterrace.net/*
// @copyright  2014+, Terrii
// @downloadURL https://update.greasyfork.org/scripts/4676/PcMasterRace_Gloria.user.js
// @updateURL https://update.greasyfork.org/scripts/4676/PcMasterRace_Gloria.meta.js
// ==/UserScript==

var $div = $("<div id='gmSomeID' style='width:100px;height:100px;left:0;bottom:0;position:fixed;background-image:url(\"http://www.pcmasterrace.net/gloria.png\");background-size:100%;'></div>").appendTo('body');
$div.attr('id', 'holdy');