// ==UserScript==
// @name         OGARio - SYx [Recovered] By Generator
// @namespace    ogario.le
// @version      1.5.1
// @description  OGARio Edited
// @author       Fuse, Generator
// @match        http://agar.io/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/21298/OGARio%20-%20SYx%20%5BRecovered%5D%20By%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/21298/OGARio%20-%20SYx%20%5BRecovered%5D%20By%20Generator.meta.js
// ==/UserScript==

var ogarioJS = '<script src="http://ogario.ovh/le/ogario.le.js"></script>';
var ogarioSniffJS = '<script src="http://ogario.ovh/le/ogario.sniff.js"></script>';
var ogarioCSS = '<link href="http://ogario.ovh/le/ogario.le.css" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/js/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/css/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>';
var toastrCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet"></link>';

// Inject OGARio LE
function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS +"</head>");
    _page = _page.replace("agario.core.js", "");
    _page = _page.replace("</body>", ogarioJS+ "</body>");
    return _page;
}
window.stop();
document.documentElement.innerHTML = null;
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

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

setTimeout(function(){
addGlobalStyle('* {font-weight:500!important;}');
addGlobalStyle('#main-menu {border-bottom:0px solid black!important; border-top:7px solid #004C70!important;} .agario-side-panel {border-top:7px solid #004C70;}');
addGlobalStyle('.menu-tabs {padding:7px!important;} .menu-tabs .active {color:white!important;} #create-party-btn {width:100%!important;} label {font-size:11.5px!important;}');
addGlobalStyle('.menu-tabs {text-transform:uppercase!important;font-size:12.5px!important;} .btn-spectate {width:100%!important;} #og-options {margin:6px 0!important;}');
addGlobalStyle('.btn {height:35px!important;text-transform:uppercase!important;font-size:12.5px!important;} #freeCoins {margin-bottom:6px!important;} #skinprev {margin-bottom:8px!important;}');
addGlobalStyle('.input-group-addon {background:#333333!important;border-color:#333333!important;} #fps-hud {top:95%!important;} .form-group {margin-bottom:6px!important;} #ogario-party {padding-bottom:0px!important;}');
addGlobalStyle('#helloContainer {top:110px!important;opacity:1!important;} #join-party-btn {width: 33%!important; float: right!important; margin: 0px 0 0 2%!important;}');
addGlobalStyle('#fps-hud {color:white!important;} input, select, .menu-tabs a {color: #CCC!important;} .btn-copy-leaderboard {margin:10px 0px!important;} #leaderboard-positions {text-align:left!important;padding-left:10px!important;}');
addGlobalStyle('.hideskin {background:#d9534f!important;border-color:#d9534f!important;cursor:pointer;} .showskin {background:#b71b50!important;border-color:#b71b50!important;cursor:pointer;}');
addGlobalStyle('.agario-profile-panel .agario-profile-name-container {height:0px!important;} .btn-logout {width:100%!important; float:left!important; margin:0px!important;}');
addGlobalStyle('.agario-panel-freecoins, .vertical-line, .agario-party-1, .agario-party-5, .agario-party-6, .party-panel, .close, #promo-badge-container, #user-id-tag, #version-tag, .copy-party-token {display:none!important;}');
addGlobalStyle('.leaderboard-panel {width:95px!important;padding:15px!important;} #profiles {border-radius:50%; width:65px; height:65px; margin-bottom:10px;cursor:pointer} #profile-bg {margin-bottom:10px;background-size:65px!important;;height:65px;width:65px;}');
addGlobalStyle('.modal-content { background:#222!important;border-radius:0px!important;color:white!important;border-top:7px solid #004C70!important;}');
addGlobalStyle('.profile-control {margin-bottom:6px;background:#333;color:#ccc;width:50%;border-width:0px;} .leaderboard-panel {margin-right:0px!important;margin-bottom:0px!important;padding-bottom:0px!important;} .lb-2{margin-left:0px!important;}');
addGlobalStyle('.modal-body { max-height: calc(100vh - 210px)!important;; overflow-y: auto!important;}');

$("title").text("OGARio - Generator");
$("head").append('<script src="http://isyx.me.pn/syx/hideskin.js"></script>');
$("#ogario-ad, h2, #version, .ogario-yt-panel").remove();
$("#joinPartyToken").after("<h10></h10>");
$("#join-party-btn").appendTo("h10");
$("h1").replaceWith('<div align="center" id="skinprev"><div style="background:#333;border-radius:50%;width:200px;height:200px;"><img class="skinpreview" src="" height="200px" width="200px" style="border-radius:50%;"/></div></div>');
$(".skinpreview").attr("src", $("#skin").val());
$("#options").after('<br><label style="font-size:13px!important;">OGARio -</label><br>');
$("#tags-container").before('<br><label style="font-size:13px!important;">SYx -</label><div id="og-options"><label><input id="opt_stream_mode" type="checkbox">Stream Mode</label><label><input id="opt_hide_fb_panel" type="checkbox">Hide Facebook Panel</label><label><input id="opt_hide_shop" type="checkbox">Hide Shop Panel</label><label><input id="opt_hide_profiles" type="checkbox">Hide Profiles</label><label><input id="opt_disable_shop_levels" type="checkbox">Disable Shop/Levels</label></div><br>');
$("h4").replaceWith('<h4 class="main-color" style="font-size:26px!important;color:#8b053e!important;">Leaderboard</h4>');
$(".btn-logout").appendTo("#tags-container");
$("head").append("<style>#syxlogin {display:none!important;}</style>");
$(".leaderboard-panel").empty();
$(".leaderboard-panel").append('<div id="profile-bg" style="background:url(http://i.imgur.com/WQMyFfk.png);"><img id="profiles" class="profile-one" src=""/></div>');
$(".leaderboard-panel").append('<div id="profile-bg" style="background:url(http://i.imgur.com/fWSf996.png);"><img id="profiles" class="profile-two"/></div>');
$(".leaderboard-panel").append('<div id="profile-bg" style="background:url(http://i.imgur.com/bf4riGt.png);"><img id="profiles" class="profile-three"/></div>');
$(".leaderboard-panel").append('<div id="profile-bg" style="background:url(http://i.imgur.com/M4yrRt7.png);"><img id="profiles" class="profile-four"/></div>');
$(".leaderboard-panel").append('<div id="profile-bg" style="background:url(http://i.imgur.com/CAQ3Su9.png);"><img id="profiles" class="profile-five"/></div>');
$('.leaderboard-panel').after('<div class="agario-panel agario-side-panel leaderboard-panel lb-2" style="margin-left:0px!important;"></div>');
$(".lb-2").append('<div id="profile-bg" style="background:url(http://i.imgur.com/KRxpM9f.png);"><img id="profiles" class="profile-six"/></div>');
$(".lb-2").append('<div id="profile-bg" style="background:url(http://i.imgur.com/fPcuqzO.png);"><img id="profiles" class="profile-seven"/></div>');
$(".lb-2").append('<div id="profile-bg" style="background:url(http://i.imgur.com/hdhb111.png);"><img id="profiles" class="profile-eight"/></div>');
$(".lb-2").append('<div id="profile-bg" style="background:url(http://i.imgur.com/41riMKN.png);"><img id="profiles" class="profile-nine"/></div>');
$(".lb-2").append('<div id="profile-bg" style="background:url(http://i.imgur.com/62eOpMn.png);"><img id="profiles" class="profile-ten"/></div>');
$(".lb-2").after('<div class="agario-panel agario-side-panel edit-panel"><button id="edit-profiles" class="btn btn-primary btn-success" style="width: 100%; float: left;" data-toggle="modal" data-target="#myModal">Edit</button></div>');
$("body").append('<div id="myModal" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Edit Profiles</h4></div><div class="modal-body"><p>Profile 1:</p><input id="name-1" class="form-control profile-control" placeholder="Name 1" maxlength="15" autofocus=""><input id="skin-1" class="form-control profile-control" placeholder="Skin URL 1 (imgur.com direct link)"><p>Profile 2:</p><input id="name-2" class="form-control profile-control" placeholder="Name 2" maxlength="15" autofocus=""><input id="skin-2" class="form-control profile-control" placeholder="Skin URL 2 (imgur.com direct link)"></div><div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal">Close</button></div></div></div></div>');
$("#skin-2").after('<p>Profile 3:</p><input id="name-3" class="form-control profile-control" placeholder="Name 3" maxlength="15" autofocus=""><input id="skin-3" class="form-control profile-control" placeholder="Skin URL 3 (imgur.com direct link)">');
$("#skin-3").after('<p>Profile 4:</p><input id="name-4" class="form-control profile-control" placeholder="Name 4" maxlength="15" autofocus=""><input id="skin-4" class="form-control profile-control" placeholder="Skin URL 4 (imgur.com direct link)">');
$("#skin-4").after('<p>Profile 5:</p><input id="name-5" class="form-control profile-control" placeholder="Name 5" maxlength="15" autofocus=""><input id="skin-5" class="form-control profile-control" placeholder="Skin URL 5 (imgur.com direct link)">');
$("#skin-5").after('<p>Profile 6:</p><input id="name-6" class="form-control profile-control" placeholder="Name 6" maxlength="15" autofocus=""><input id="skin-6" class="form-control profile-control" placeholder="Skin URL 6 (imgur.com direct link)">');
$("#skin-6").after('<p>Profile 7:</p><input id="name-7" class="form-control profile-control" placeholder="Name 7" maxlength="15" autofocus=""><input id="skin-7" class="form-control profile-control" placeholder="Skin URL 7 (imgur.com direct link)">');
$("#skin-7").after('<p>Profile 8:</p><input id="name-8" class="form-control profile-control" placeholder="Name 8" maxlength="15" autofocus=""><input id="skin-8" class="form-control profile-control" placeholder="Skin URL 8 (imgur.com direct link)">');
$("#skin-8").after('<p>Profile 9:</p><input id="name-9" class="form-control profile-control" placeholder="Name 9" maxlength="15" autofocus=""><input id="skin-9" class="form-control profile-control" placeholder="Skin URL 9 (imgur.com direct link)">');
$("#skin-9").after('<p>Profile 10:</p><input id="name-10" class="form-control profile-control" placeholder="Name 10" maxlength="15" autofocus=""><input id="skin-10" class="form-control profile-control" placeholder="Skin URL 10 (imgur.com direct link)">');
$('head').append('<style>.lb-2 {margin-left:0px!important;} .edit-panel {margin-top:0px!important;width:190px!important;border-top:0px solid black!important;padding-top:0px!important;padding-bottom:15px!important;}.agario-shop-panel{border-top:0px solid black!important;width:100%!important;text-align:center!important;}</style>');
$('head').append('<script>function hideUrl() {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","hidden"); } function showUrl() {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); $(".showskin").replaceWith(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","shown"); } if (localStorage.getItem("S_skin_url") == "hidden") {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); } else {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); } $(\'#mainPanel .input-group\').append(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\');</script>');

    $('.agario-shop-panel').appendTo('#misc');
    $("#settingsChoice").replaceWith('<div class="zoomSpeed">Zoom speed: <span id="txt_zoom_speed">0.88</span><input oninput="$(\'#txt_zoom_speed\').text(this.value);" style="width: 100%;" type="range" id="opt_zoom_speed" name="opt_zoom_speed" min="0.88" max="0.99" step="0.01" value="0.9"></div><br>');

    $("#txt_zoom_speed").text($("#opt_zoom_speed").val());

    $('#opt_zoom_speed').on('input', function() {
        var zoomSpeed = $("#txt_zoom_speed").text();
        window.ogario.zoomSpeedValue = zoomSpeed;
    });
    $("head").append("<style>.menu-tabs {background:#373340!important;padding:10px!important;} .btn-play {background:#000036!important;border-color:#660066!important;} .btn-spectate {background:#660066!important;border-color:#000036!important;} #join-party-btn {background:#660066!important;border-color:#000036!important;} #create-party-btn {background:#000036!important;border-color:#660066!important;} .agario-panel {background:#373340!important;} #clantag{background:#373340!important;} #nick{background:#373340!important;} #skin{background:#373340!important;} #region{background:#373340!important;} #gamemode{background:#373340!important;} #joinPartyToken{background:#373340!important;} .btn:hover {opacity:0.9!important;} .active {background:#ffffff!important;} .agario-panel input, .agario-panel select {background:#a5084b!important;border:2px solid rgba(255,255,255,0.3)!important;} .input-group-addon {background-color:#373340!important;border-color:#373340!important;} .showskin {background:#000021!important;} .hideskin {background:#000036!important;}</style>");
    $("#main-menu, .agario-side-panel").css("cssText", "border-color:#17141E!important;border-width:0px!important;");
    $(".menu-tabs a").css("cssText", "color:#EE0BDB!important;");
    $("h4").attr('style', 'color:#EE0BDB!important;font-size:17px!important;font-weight:600!important;text-align:center!important');
    $('#minimap-sectors').replaceWith('<img id="minimap-sectors" width="182" height="182" src="http://i.imgur.com/8ckyoYM.png">');

    $('#skin').focusout(function() {
        $(".skinpreview").attr("src", $("#skin").val());
    });

  $(".profile-one").click(function() {
  var np1 = $('#name-1').val();
  var sp1 = $('#skin-1').val();
  $("#nick").val( np1 );
  $("#skin").val( sp1 );
  $(".skinpreview").attr("src", $("#skin").val());
});
    $(".profile-two").click(function() {
  var np2 = $('#name-2').val();
  var sp2 = $('#skin-2').val();
  $("#nick").val( np2 );
  $("#skin").val( sp2 );
  $(".skinpreview").attr("src", $("#skin").val());
});
        $(".profile-three").click(function() {
  var np3 = $('#name-3').val();
  var sp3 = $('#skin-3').val();
  $("#nick").val( np3 );
  $("#skin").val( sp3 );
  $(".skinpreview").attr("src", $("#skin").val());
});
    $(".profile-four").click(function() {
  var np4 = $('#name-4').val();
  var sp4 = $('#skin-4').val();
  $("#nick").val( np4 );
  $("#skin").val( sp4 );
  $(".skinpreview").attr("src", $("#skin").val());
});
    $(".profile-five").click(function() {
  var np5 = $('#name-5').val();
  var sp5 = $('#skin-5').val();
  $("#nick").val( np5 );
  $("#skin").val( sp5 );
  $(".skinpreview").attr("src", $("#skin").val());
});
    $(".profile-six").click(function() {
  var np6 = $('#name-6').val();
  var sp6 = $('#skin-6').val();
  $("#nick").val( np6 );
  $("#skin").val( sp6 );
  $(".skinpreview").attr("src", $("#skin").val());
});
    $(".profile-seven").click(function() {
  var np7 = $('#name-7').val();
  var sp7 = $('#skin-7').val();
  $("#nick").val( np7 );
  $("#skin").val( sp7 );
  $(".skinpreview").attr("src", $("#skin").val());
});
    $(".profile-eight").click(function() {
  var np8 = $('#name-8').val();
  var sp8 = $('#skin-8').val();
  $("#nick").val( np8 );
  $("#skin").val( sp8 );
  $(".skinpreview").attr("src", $("#skin").val());
});
    $(".profile-nine").click(function() {
  var np9 = $('#name-9').val();
  var sp9 = $('#skin-9').val();
  $("#nick").val( np9 );
  $("#skin").val( sp9 );
  $(".skinpreview").attr("src", $("#skin").val());
});
    $(".profile-ten").click(function() {
  var np10 = $('#name-10').val();
  var sp10 = $('#skin-10').val();
  $("#nick").val( np10 );
  $("#skin").val( sp10 );
  $(".skinpreview").attr("src", $("#skin").val());
});

    $('#skin-1').focusout(function() {
        $(".profile-one").attr("src", $("#skin-1").val());
        var skinp1 = $("#skin-1").val();
        localStorage.setItem("skinp1", skinp1);
    });
    $('#name-1').focusout(function() {
        var namep1 = $("#name-1").val();
        localStorage.setItem("namep1", namep1);
    });
    $("#name-1").val(localStorage.getItem("namep1"));
    $("#skin-1").val(localStorage.getItem("skinp1"));
    $(".profile-one").attr("src", $("#skin-1").val());

    $('#skin-2').focusout(function() {
        $(".profile-two").attr("src", $("#skin-2").val());
        var skinp2 = $("#skin-2").val();
        localStorage.setItem("skinp2", skinp2);
    });
    $('#name-2').focusout(function() {
        var namep2 = $("#name-2").val();
        localStorage.setItem("namep2", namep2);
    });
    $("#name-2").val(localStorage.getItem("namep2"));
    $("#skin-2").val(localStorage.getItem("skinp2"));
    $(".profile-two").attr("src", $("#skin-2").val());

    $('#skin-3').focusout(function() {
        $(".profile-three").attr("src", $("#skin-3").val());
        var skinp3 = $("#skin-3").val();
        localStorage.setItem("skinp3", skinp3);
    });
    $('#name-3').focusout(function() {
        var namep3 = $("#name-3").val();
        localStorage.setItem("namep3", namep3);
    });
    $("#name-3").val(localStorage.getItem("namep3"));
    $("#skin-3").val(localStorage.getItem("skinp3"));
    $(".profile-three").attr("src", $("#skin-3").val());

    $('#skin-4').focusout(function() {
        $(".profile-four").attr("src", $("#skin-4").val());
        var skinp4 = $("#skin-4").val();
        localStorage.setItem("skinp4", skinp4);
    });
    $('#name-4').focusout(function() {
        var namep4 = $("#name-4").val();
        localStorage.setItem("namep4", namep4);
    });
    $("#name-4").val(localStorage.getItem("namep4"));
    $("#skin-4").val(localStorage.getItem("skinp4"));
    $(".profile-four").attr("src", $("#skin-4").val());

    $('#skin-5').focusout(function() {
        $(".profile-five").attr("src", $("#skin-5").val());
        var skinp5 = $("#skin-5").val();
        localStorage.setItem("skinp5", skinp5);
    });
    $('#name-5').focusout(function() {
        var namep5 = $("#name-5").val();
        localStorage.setItem("namep5", namep5);
    });
    $("#name-5").val(localStorage.getItem("namep5"));
    $("#skin-5").val(localStorage.getItem("skinp5"));
    $(".profile-five").attr("src", $("#skin-5").val());

    $('#skin-6').focusout(function() {
        $(".profile-six").attr("src", $("#skin-6").val());
        var skinp6 = $("#skin-6").val();
        localStorage.setItem("skinp6", skinp6);
    });
    $('#name-6').focusout(function() {
        var namep6 = $("#name-6").val();
        localStorage.setItem("namep6", namep6);
    });
    $("#name-6").val(localStorage.getItem("namep6"));
    $("#skin-6").val(localStorage.getItem("skinp6"));
    $(".profile-six").attr("src", $("#skin-6").val());

    $('#skin-7').focusout(function() {
        $(".profile-seven").attr("src", $("#skin-7").val());
        var skinp7 = $("#skin-7").val();
        localStorage.setItem("skinp7", skinp7);
    });
    $('#name-7').focusout(function() {
        var namep7 = $("#name-7").val();
        localStorage.setItem("namep7", namep7);
    });
    $("#name-7").val(localStorage.getItem("namep7"));
    $("#skin-7").val(localStorage.getItem("skinp7"));
    $(".profile-seven").attr("src", $("#skin-7").val());

    $('#skin-8').focusout(function() {
        $(".profile-eight").attr("src", $("#skin-8").val());
        var skinp8 = $("#skin-8").val();
        localStorage.setItem("skinp8", skinp8);
    });
    $('#name-8').focusout(function() {
        var namep8 = $("#name-8").val();
        localStorage.setItem("namep8", namep8);
    });
    $("#name-8").val(localStorage.getItem("namep8"));
    $("#skin-8").val(localStorage.getItem("skinp8"));
    $(".profile-eight").attr("src", $("#skin-8").val());

    $('#skin-9').focusout(function() {
        $(".profile-nine").attr("src", $("#skin-9").val());
        var skinp9 = $("#skin-9").val();
        localStorage.setItem("skinp9", skinp9);
    });
    $('#name-9').focusout(function() {
        var namep9 = $("#name-9").val();
        localStorage.setItem("namep9", namep9);
    });
    $("#name-9").val(localStorage.getItem("namep9"));
    $("#skin-9").val(localStorage.getItem("skinp9"));
    $(".profile-nine").attr("src", $("#skin-9").val());

    $('#skin-10').focusout(function() {
        $(".profile-ten").attr("src", $("#skin-10").val());
        var skinp10 = $("#skin-10").val();
        localStorage.setItem("skinp10", skinp10);
    });
    $('#name-10').focusout(function() {
        var namep10 = $("#name-10").val();
        localStorage.setItem("namep10", namep10);
    });
    $("#name-10").val(localStorage.getItem("namep10"));
    $("#skin-10").val(localStorage.getItem("skinp10"));
    $(".profile-ten").attr("src", $("#skin-10").val());




    $("#opt_stream_mode").change(function () {
    if(this.checked) {
        $("#clantag, .partyToken").css("cssText", "color: transparent!important;");
        $("head").append("<style>::selection {color: transparent!important;background: #F2635F!important;}</style>");
       localStorage.setItem("S_opt_stream_mode","true");
    }
        else {
        $("#clantag, .partyToken").css("cssText", "color: #CCC!important;");
        $("head").append("<style>::selection {color: #CCC!important;background: #F2635F!important;}</style>");
        localStorage.setItem("S_opt_stream_mode","false");
    }
    });

    $("#opt_hide_fb_panel").change(function () {
    if(this.checked) {
    $(".agario-profile-panel").hide();
    localStorage.setItem("S_opt_hide_fb_panel","true");
    }
        else {
            $(".agario-profile-panel").show();
            localStorage.setItem("S_opt_hide_fb_panel","false");
            }
    });

    $("#opt_hide_shop").change(function () {
    if(this.checked) {
    $("head").append("<style>.agario-shop-panel {display:none!important;}</style>");
    localStorage.setItem("S_opt_hide_shop","true");
    }
        else {
            $("head").append("<style>.agario-shop-panel {display:block!important;}</style>");
            localStorage.setItem("S_opt_hide_shop","false");
            }
    });

    $("#opt_hide_profiles").change(function () {
    if(this.checked) {
    $(".leaderboard-panel").hide();
    localStorage.setItem("S_opt_hide_profiles","true");
    }
        else {
            $(".leaderboard-panel").show();
    localStorage.setItem("S_opt_hide_profiles","false");
            }
    });

     $("#opt_disable_shop_levels").change(function () {
    if(this.checked) {
    $('head').append('<style>#openfl-content, #openfl-overlay {visibility:hidden;}</style>');
    localStorage.setItem("S_opt_disable_shop_levels","true");
    }
        else {
            $('head').append('<style>#openfl-content, #openfl-overlay {visibility:visible;}</style>');
    localStorage.setItem("S_opt_disable_shop_levels","false");
            }
    });

    setTimeout(function(){
        if (localStorage.getItem("S_opt_stream_mode") == "true") {
            $("#opt_stream_mode").prop("checked",true);
            $("#opt_stream_mode").trigger("change");
        } else {
            $("#opt_stream_mode").prop("checked",false);
            $("#opt_stream_mode").trigger("change");
        }
        if (localStorage.getItem("S_opt_hide_fb_panel") == "true") {
            $("#opt_hide_fb_panel").prop("checked",true);
            $("#opt_hide_fb_panel").trigger("change");
        } else {
            $("#opt_hide_fb_panel").prop("checked",false);
            $("#opt_hide_fb_panel").trigger("change");
        }
        if (localStorage.getItem("S_opt_hide_shop") == "true") {
            $("#opt_hide_shop").prop("checked",true);
            $("#opt_hide_shop").trigger("change");
        } else {
            $("#opt_hide_shop").prop("checked",false);
            $("#opt_hide_shop").trigger("change");
        }
        if (localStorage.getItem("S_opt_hide_profiles") == "true") {
            $("#opt_hide_profiles").prop("checked",true);
            $("#opt_hide_profiles").trigger("change");
        } else {
            $("#opt_hide_profiles").prop("checked",false);
            $("#opt_hide_profiles").trigger("change");
        }
        if (localStorage.getItem("S_opt_disable_shop_levels") == "true") {
            $("#opt_disable_shop_levels").prop("checked",true);
            $("#opt_disable_shop_levels").trigger("change");
        } else {
            $("#opt_disable_shop_levels").prop("checked",false);
            $("#opt_disable_shop_levels").trigger("change");


        }
    }, 1000);
 function localTime(){
    var d = new Date();
    var y = d.getDate();
    if(y < 10){
      y = "0" + y;
    }
    var t = d.getMonth() + 1;
    if(t < 10){
      t = "0" + t;
    }
    var a = d.getFullYear();
    if(a < 10){
      a = "0" + a;
    }
    var h = d.getHours();
    if(h < 10){
        h = "0" + h;
    }
    var m = d.getMinutes();
    if(m < 10){
      m = "0" + m;
    }
    var s = d.getSeconds();
    if(s < 10){
      s = "0" + s;
    }
    var txt = $("h4").text(y + '/' + t + '/' + a + ' | ' + h + ' : ' + m + ' : ' + s);
}
setInterval(localTime, 1000);
localTime();
}, 1000);