// ==UserScript==
// @name Chegg Device
// @namespace Chegg Device
// @match https://www.chegg.com/*
// @grant none
// @description Remove Chegg device-limitation prompt
// @version 0.0.4.202109060101
// @downloadURL https://update.greasyfork.org/scripts/421504/Chegg%20Device.user.js
// @updateURL https://update.greasyfork.org/scripts/421504/Chegg%20Device.meta.js
// ==/UserScript==

$("head").append(`
<style>
#cs-dm-swap {
    display: none !important;
}

html.cs-dm-swap, body.cs-dm-swap {
    overflow: inherit !important;
}

#C-common-devicemanager-add{
  display: none;
}

.cs-dm-add, html.cs-dm-add, body.cs-dm-add{
  overflow: auto !important;
}
</style>
`);

$("#cs-dm-swap").remove();
$("#C-common-devicemanager-add").remove();
$("body").removeClass("cs-dm-add");