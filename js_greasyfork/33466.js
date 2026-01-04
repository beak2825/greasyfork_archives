// ==UserScript==
// @name         Supreme Gods Extension
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  marica el que lee
// @author       Sike
// @match        http://dual-agar.me/*
// @match        http://agar.io/*
// @match        http://dual-agar.online/*
// @match        http://gota.io/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33466/Supreme%20Gods%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/33466/Supreme%20Gods%20Extension.meta.js
// ==/UserScript==

// lo k kieras :v

! function(c) {
    var host = "agar.io"; // Anti Moneyclip :V
    if (location.host == host) {
        location.href = "http://dual-agar.me/";
        return;
    }

    c(document).ready(function() {
        Dual();
    });

    function Dual() {
        RegExpT2();
        SetNormalLB();
        Misc();
        Balls();
        ThTab();
    }

    function onPageLoad() {
        SetNormalLB();
        ThTab();
    }

    var values;var round;var colors;
    values = {
        ldb: '#lb_caption',
        lbval: 'ホネx'
    };
    round = {
        r1: '.round.red',
        r2: '.round.mahogany',
        r3: '.round.dulllime',
        r4: '.round.peru',
        r5: '.round.tuftsblue',
        r6: '.round.raspberry',
        r7: '.round.awesome',
        r8: '.round.aqua',
        r9: '.round.lawngreen',
        r10: '.round.magenta',
        r11: '.round.aztec',
        r12: '.round.yellow',
        r13: '.round.orange',
    };
    colors = {
        r1: '#ff0000',
        r2: '#ce4242',
        r3: '#42ce42',
        r4: '#ce8842',
        r5: '#4288ce',
        r6: '#d35695',
        r7: '#ff1744',
        r8: '#18ffff',
        r9: '#76ff03',
        r10: '#e040fb',
        r11: '#893bff',
        r12: '#ffff00',
        r13: '#ff8000',
    };

    c("#pelletColorGroup").append("<input id='lbh' style='width: 300px;margin-top: 20px;height: 30px;' placeholder='Cambiar Nombre del Top'></input>");
    function isWriting() {
        c("#lbh").on("input", function() {
            c(values.ldb).text(c("#lbh").val());
        });
    }

    function RegExpT2() {
        var t = c(values.ldb).text(),
            i = isWriting();
        t = t.replace(/(?:(?:[0-9]*)\D)+/g, i); // no wa hacer na con esto :vv
        c(values.ldb).html(t);
    }
    function SetNormalLB() {
        if (c(values.ldb).val() !== undefined || c(values.ldb).val() !== "DUAL AGAR") {
            c(values.ldb).text(values.lbval);
        } else {
            console.log("nope");
        }
    }

    function RemoveLbFromTheme(a) { // test :v
        c("#lb_caption").css({color: a});
    }

    function Misc() {
        function addGlobalStyle(css) {var head, style;head = document.getElementsByTagName('head')[0];if (!head) { return; }style = document.createElement('style');style.type = 'text/css';style.innerHTML = css;head.appendChild(style);}
        addGlobalStyle('#preview-img-area2 {width: 0px!important;height:0px!important }');
        addGlobalStyle('#helloContainer{transform: translate(-32%, -50%) scale(0.976758)!important}');
        addGlobalStyle('#preview-img{width: 160px;height: 160px}');
        addGlobalStyle('.preview-img-area{width: 160px;height: 160px}'); //for da skin
        addGlobalStyle('input, .agario-panel {border-radius: 4px!important;float: left;}');
        addGlobalStyle('.right_side_container {display:inline;float: null;}');
        addGlobalStyle('#right_side_container, #mainPanel.agario-panel{    float: left!important;}');
        c("#theming").append('<div style="margin-top:20px!important;cursor: default;"><font style="text-transform: uppercase!important; font-size:10px!important;">Leaderboard Color</font><br><a class="round red"></a>&nbsp;<a class="round mahogany"></a>&nbsp;<a class="round dulllime"></a>&nbsp;<a class="round peru"></a>&nbsp;<a class="round tuftsblue"></a>&nbsp;<a class="round raspberry"></a>&nbsp;<a class="round awesome"></a>&nbsp;<a class="round aqua"></a>&nbsp;<a class="round lawngreen"></a>&nbsp;<a class="round magenta"></a>&nbsp;<a class="round aztec"></a>&nbsp;<a class="round yellow"></a></div><style>.round { margin-top:5px; display:inline-block; width:20px; height:20px; border-radius: 50%; text-decoration:none; }.round:hover { opacity: 0.6; }.red { background: red;} .mahogany { background: #CE4242; } .dulllime { background: #42CE42; } .peru { background: #CE8842; } .tuftsblue { background: #4288CE; } .raspberry { background: #D35695; } .awesome { background: #FF1744; } .aqua { background: #18FFFF; } .lawngreen { background: #76FF03; } .magenta { background: #E040FB; } .aztec { background: #893BFF;} .yellow { background: #FFFF00;}</style></div>');
        c("#theming > div:nth-child(4)").prepend('<audio src="http://frshoutcast.comunicazion.eu:8815/;" controls></audio>');
        c("#preview-img2").css("visibility", "hidden");
        c("#home > div:nth-child(9)").remove();
        c("#site_instruction_container").remove();
        c("#ex_server_links").remove();
        c("#helloContainer > div.side-container.left-side > div:nth-child(1)").hide();
        c("#profile-pic").insertBefore("#teamNameContainer");
    }

    function ThTab() {
        if (c("#tab_theme").text().indexOf() !== "TEMAS") {
            c("#tab_theme").text("MISC");
        }
    }
    //ThTab();
    function Balls() {
        c(round.r1).on("click", function() {c(values.ldb).css({color: colors.r1});});c(round.r2).on("click", function() {c(values.ldb).css({color: colors.r2});});c(round.r3).on("click", function() {c(values.ldb).css({color: colors.r3});});c(round.r4).on("click", function() {c(values.ldb).css({color: colors.r4});});c(round.r5).on("click", function() {c(values.ldb).css({color: colors.r5});});c(round.r6).on("click", function() {c(values.ldb).css({color: colors.r6});});c(round.r7).on("click", function() {c(values.ldb).css({color: colors.r7});});c(round.r8).on("click", function() {c(values.ldb).css({color: colors.r8});});c(round.r9).on("click", function() {c(values.ldb).css({color: colors.r9});});c(round.r10).on("click", function() {c(values.ldb).css({color: colors.r10});});c(round.r11).on("click", function() {c(values.ldb).css({color: colors.r11});});c(round.r12).on("click", function() {c(values.ldb).css({color: colors.r12});});
    }

    setTimeout(function() {
        onPageLoad();
        RemoveLbFromTheme();
    }, 3000);
}(window.jQuery);
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms
var speed = .9; //in ms


function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key E
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // key E
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key E
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}

//© 2017. Zirk. All Rights Reserved