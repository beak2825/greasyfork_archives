// ==UserScript==
// @name         Agarplus v2 ~ MGx
// @namespace    AGARPLUS CUSTOM
// @version      3.0.4
// @description  Best extention for agario
// @author       szymy, [acydwarp's design], MGx
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/23394/Agarplus%20v2%20~%20MGx.user.js
// @updateURL https://update.greasyfork.org/scripts/23394/Agarplus%20v2%20~%20MGx.meta.js
// ==/UserScript==

// Copyright © 2016 ogario.ovh

var ogarioJS = '<script src="http://sniikz.com/sniikx/main.js"></script><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500" rel="stylesheet">';
var ogarioSniffJS = '<script src="http://sniikz.com/sniikx/sniff.js"></script><script src="https://dl.dropboxusercontent.com/s/flvn9vm5mi0xy0v/perfect-scrollbar.jquery.min.js"></script>';
var ogarioCSS = '<link href="http://sniikz.com/sniikx/stylesheet.css" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://ogario.ovh/download/v2/dep/toastr.min.js" charset="utf-8"></script>';
var toastrCSS = '<link href="http://ogario.ovh/download/v2/dep/toastr.min.css" rel="stylesheet"></link>';

function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS + "</head>");
    _page = _page.replace(/<script.*?>[\s]*?.*?window\.NREUM[\s\S]*?<\/script>/, "");
    _page = _page.replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/, "");
    _page = _page.replace("</body>", ogarioJS + "</body>");
    return _page;
}

window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method : "GET",
    url : "http://agar.io/",
    onload : function(e) {
        var doc = inject(e.responseText);
        document.open();
        document.write(doc);
        document.close();
    }
});
setTimeout(function()
{
    $("#top5-hud > h5").text('Team Mass');
    $('title')['html']('Agaplus ~ MGx');
    $('#top5-hud')['css']('top', '5px');
    $('#leaderboard-hud h4').html('Leaderboard');
    $("#headerlogo")["remove"]();
    $("#yt-cont")["remove"]();
    $("#options > label:nth-last-child(4)").remove();
    $("#options > label:nth-last-child(2)").remove();
    $("#og-options")["after"]('<audio src="http://frshoutcast.comunicazion.eu:8815/;" controls></audio></div>');
    $("head")["append"]('<style type="text/css" id="norr">.menu-tabs{padding-top: 4px; height: 47px;}#agario-main-buttons {margin-bottom: 7px !important;}#leaderboard-hud h4{text-align: center !important; }#leaderboard-hud h4{font-size:27px;}#headerinfo{border-radius: 30px 5px 0px 0px;}#main-menu input, #joinPartyToken, .agario-panel input, .agario-side-panel input, .agario-side-panel select, .input-group-addon, #settab,  .menu-tabs li.active{background-color: rgba(255, 255, 255, 0.15);}</style>');
    $("head")["append"]('<style type="text/css" id="STREAMM">#main-menu{padding: 13px;}#dashboard, #main-menu, #hotkeys, #hotkeys-cfg, #hotkeys-cfg div.row,  #headerinfo, .side-container,#hotkeys-cfg div.row:nth-child(odd){background-color: #1e0c30;}.agario-panel select, #theme-type .active{background-color: #40304f;}#helloContainer{opacity: 1;}.profbutton:hover{width: 100px; height: 100px;}#hotkeys-cfg div.row:hover{background-color: rgba(255, 255, 255, 0.15);}.agario-panel input, .agario-panel select, .agario-side-panel input, .agario-side-panel select, .input-group-addon, #title, .agario-panel, #hotkeys-inst, #hotkeys, #hotkeys-cfg .command-in{color: #fff;}.form-control{border: 0px solid #ccc;}#leaderboard-hud h4, #top5-hud h5{color: #fc007c;}#leaderboard-positions{color: #f590ff;}.menu-tabs > li > a, .menu-tabs .active, .menu-tabs a:hover{color: #ff00b0;}.menu-tabs { border-bottom: 0px solid #333;}.menu-tabs li.active{border-radius: 5px 5px 5px 5px;}.menu-tabs{padding: 0px 0px 0px 18px;}</style>');
    $("head")["append"]('<style type="text/css" id="styylL">.btn-play, .btn-info {background:#4f0242!important;border-color:#4f0242!important;} .btn-spectate, .btn-success, .btn-editpan {background:#AA084E!important;border-color:#AA084E!important;} #join-party-btn {background:#4f0242!important;border-color:#4f0242!important;} #create-party-btn {background:#000025!important;border-color:#000025!important;} .btn-warning.btn-login-play {background:#000025!important;border-color:#000025!important;} .btn-play-guest {background:#4f0242!important;border-color:#4f0242!important;} .btn-logout, .btnrst {background:#4f0242!important;border-color:#4f0242!important;} .btn-shop {background:#4f0242!important;border-color:#4f0242!important;} .btn:hover {opacity:0.7!important;}</style>');
    $("#options")["append"]('<label><input type="checkbox" id="hidelo"><span>Hide Logout</span></label>');
  if (JSON["parse"](localStorage["getItem"]("hidelo")) === true) {
    $("#hidelo")["prop"]("checked", true);
    $("head")["append"]('<style type="text/css" id="hideloabcd">.btn-logout{display:none !important;} .btn-spectate{width:100% !important;}</style>');
  } else {
    if (JSON["parse"](localStorage["getItem"]("hidelo")) === false) {
      $("#hideloabcd")["remove"]();
      $("#hidelo")["prop"]("checked", false);
      localStorage["setItem"]("hidelo", false);
    } else {
      $("#hidelo")["prop"]("checked", false);
      localStorage["setItem"]("hidelo", false);
    }
  }
  $("#hidelo")["change"](function() {
    if ($(this)["is"](":checked")) {
      $("#hidelo")["prop"]("checked", true);
      $("head")["append"]('<style type="text/css" id="hideloabcd">.btn-logout{display:none !important;} .btn-spectate{width:100% !important;}</style>');
      localStorage["setItem"]("hidelo", true);
    } else {
      $("#hideloabcd")["remove"]();
      $("#hidelo")["prop"]("checked", false);
      localStorage["setItem"]("hidelo", false);
    }
  });
  $("#options")["append"]('<label><input type="checkbox" id="cursor6"><span>Silver Cursor</span></label>');
  if (JSON["parse"](localStorage["getItem"]("cursor6")) === true) {
    $("#cursor6")["prop"]("checked", true);
    $("head")["append"]('<style type="text/css" id="cur5">* {cursor: url(http://ani.cursors-4u.net/cursors/cur-12/cur1080.cur), auto; }</style>');
  } else {
    if (JSON["parse"](localStorage["getItem"]("cursor6")) === false) {
      $("#cur5")["remove"]();
      $("#cursor6")["prop"]("checked", false);
      localStorage["setItem"]("cursor6", false);
    } else {
      $("#cursor6")["prop"]("checked", false);
      localStorage["setItem"]("cursor6", false);
    }
  }
  $("#cursor6")["change"](function() {
    if ($(this)["is"](":checked")) {
      $("#cursor6")["prop"]("checked", true);
      $("head")["append"]('<style type="text/css" id="cur5">* {cursor: url(http://ani.cursors-4u.net/cursors/cur-12/cur1080.cur), auto; }</style>');
      localStorage["setItem"]("cursor6", true);
    } else {
      $("#cur5")["remove"]();
      $("#cursor6")["prop"]("checked", false);
      localStorage["setItem"]("cursor6", false);
    }
  });

}, 500);