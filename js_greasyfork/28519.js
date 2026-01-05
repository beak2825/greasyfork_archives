// ==UserScript==
// @name        no-ads clean layout Chia-anime
// @description ;-;
// @namespace   hebiohime
// @match       *://chia-anime.tv/*
// @match       *://www.chia-anime.tv/*
// @version     2016.10.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28519/no-ads%20clean%20layout%20Chia-anime.user.js
// @updateURL https://update.greasyfork.org/scripts/28519/no-ads%20clean%20layout%20Chia-anime.meta.js
// ==/UserScript==
 
$('#cute').remove();
$('#VelBar').remove();
$('.VelBarContent').remove();
$('div[style*=\'position: fixed; top: 0px; left: 0px; z-index: 100; width: 100%; height: 768px; overflow: hidden; visibility: hidden;\']').remove();
$('div[style*=\'bottom: 0px; font: 11px/40px Arial,sans-serif ! important; position: fixed ! important; left: 0px ! important; top: auto ! important; z-index: 990005 ! important; overflow: visible ! important; height: 40px ! important; padding: 0px; margin: 0px; background-color: rgb(229, 229, 229); border: 1px solid rgb(181, 181, 181); width: 1135px;\']').remove();
/*
$('a[href*=\'http://kissasian.com/Message/ReportError\']').parent().remove();
$('#selectEpisode').css('margin-bottom', '10px');
$('div[style*=\'margin: 10px 48px 10px 0\']').css('margin-top', '0px !important');
*/