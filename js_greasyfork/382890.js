// ==UserScript==
// @name Squawkr copy release name
// @description  A simple script that adds a button on the archive page of Squawkr.io to show and copy release names
// @version 1.0
// @copyright 2019, SilverBull (https://openuserjs.org/users/SilverBull)
// @namespace Violentmonkey Scripts
// @match https://squawkr.io/archive.php
// @grant none
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/382890/Squawkr%20copy%20release%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/382890/Squawkr%20copy%20release%20name.meta.js
// ==/UserScript==
// 
//

var script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

$("th.mdl-data-table__cell--non-numeric:nth-child(3)").append('<span class="showNames btn btn-primary btn-mini">Show release names</span><span class="hideNames btn btn-primary btn-mini">Hide release names</span>');

$(".showNames").append('<style>.showNames{margin-left:1em;}.hideNames{margin-left:1em;}.releaseStyler{margin:0 0.5em;}</style>');
$(".hideNames").hide();

$(".showNames").click(function () {
  $(".hideNames").show();
  $(".showNames").hide();

  $.each($(".rlstooltip"), function (element) {
    $(this).parent().append('<span id="release' + element + '" class="releaseStyler">' + $(this).data("jBoxGetContent") + '</span>');
    $(this).parent().append('<button class="btn releaseStyler" data-clipboard-target="#release' + element + '"> <i class="fa fa-clipboard" aria-hidden="true"></i> </button>');
  });
});

$(".hideNames").click(function () {
  $(".releaseStyler").remove();
  $(".hideNames").hide();
  $(".showNames").show();
});

$(document).ready(function () {
  var clipboard = new ClipboardJS('.btn');

  clipboard.on('success', function (e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
  });

  clipboard.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  });

});
