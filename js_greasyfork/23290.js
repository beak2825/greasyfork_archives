// ==UserScript==
// @name        Vimilie
// @description Télécharge tes putains de vidéos vimeo
// @namespace   Greg le bg
// @include     https://vimeo.com/*
// @version     0.1
// @include     http://code.jquery.com/jquery-2.2.4.min.js
// @include     https://use.fontawesome.com/811631e803.js
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/23290/Vimilie.user.js
// @updateURL https://update.greasyfork.org/scripts/23290/Vimilie.meta.js
// ==/UserScript==

setTimeout(function() {
    $("head").append("<link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css' type='text/css' rel='stylesheet'>");
    var downloadBox = '<div class="box"><button id="downloadbutton-usc" class="rounded-box" aria-label="Share"> <i class="fa fa-download" style="color: white; font-size: 18px;"></i> </button></div>';
    $(".player .controls-wrapper .sidedock").append(downloadBox);
}, 500);

$("body").on("click", '#downloadbutton-usc', function () {
    $(this).find("i").attr("class", "fa fa-circle-o-notch fa-spin fa-3x fa-fw");
    var body = $("body").html().toString();
    var arr = body.match(/\("GET","(https:\/\/player\.vimeo\.com\/video\/.*)",/);
    var json = arr[1].replace('"', '');
    $.get(json, function(data) {
        var url = data.request.files.progressive[0].url;
        $(".sidedock").find(".fa").attr("class", "fa fa-check");
        console.log(url);
        window.open(url, "_blank");
    });
});