// ==UserScript==
// @name         huinyaebuchaya1.2
// @version      1.4
// @description  [MACRO-FEED-PLAY-COLORS|BOTS|THEME|ZOOM|SPAM|HELP|MORE]
// @match        http://petridish.pw/ru/
// @match        http://petridish.pw/en/
// @match        http://petridish.pw/fr/
// @namespace https://greasyfork.org/users/82280
// @downloadURL https://update.greasyfork.org/scripts/29393/huinyaebuchaya12.user.js
// @updateURL https://update.greasyfork.org/scripts/29393/huinyaebuchaya12.meta.js
// ==/UserScript==
/**Thx for install!**/

(function() { 
var amount = 3; 
var duration = 35; //ms 

var overwriting = function(evt) { 
if (evt.keyCode === 83) { // KEY_S 
for (var i = 0; i < amount; ++i) { 
setTimeout(function() { 
window.onkeydown({keyCode: 30}); // KEY_space 
window.onkeyup({keyCode: 30}); 
}, i * duration); 
} 
} 
}; 

window.addEventListener('keydown', overwriting); 
})();

function kd(a) {
    rdd.dev && rdd.log("Click = " + a.keyCode), 81 !== a.keyCode || rdd.fd || (rdd.fd = !0, fd()), 16 !== a.keyCode ||
        rdd.st || (rdd.st = !0), 113 !== a.keyCode || rdd.cn || (rdd.cn = !0, cr()), 88 !== a.keyCode ||
        isSpectating || (rdd.zm = !0, setUnlimitedZoom(!0), setSpectate(!0)), 115 !== a.keyCode || rdd.rc || (rdd.pn =
            $("#nick")
            .val(), rdd.ps = $("#password")
            .val(), insert(rdd.bot(), "WTF"), rdd.rc = !0, rc()), 120 === a.keyCode && !rdd.nxt &&
        selectedServer && (rdd.pn = $("#nick")
            .val(), rdd.ps = $("#password")
            .val(), insert(rdd.bot(), "WTF"), rdd.nxt = !0, rdd.servv = $('li[style="display: flex;"]'), nx())
}

function ku(a) {
    rdd.dev && rdd.log("UP = " + a.keyCode), 81 === a.keyCode && (rdd.fd = !1), 16 === a.keyCode && setTimeout(rdd.st = !
        1, 1e3), 113 === a.keyCode && (rdd.cn = !1), 88 === a.keyCode && rdd.zm && (rdd.zm = !1,
        setUnlimitedZoom(!1), setSpectate(!1)), 115 === a.keyCode && rdd.rc && (rdd.rc = !1, socketStateNew =
        1, setTimeout(insert(rdd.pn, rdd.ps), rdd.sr)), 120 === a.keyCode && rdd.nxt && (rdd.nxt = !
        1, setTimeout(insert(rdd.pn, rdd.ps), rdd.sr))
}

function cr() {
    rdd.cn && (playbtnclick(), setTimeout(cr, rdd.sc))
}

function fd() {
    rdd.fd && "SNAKERDISH" !== currentmode && (w.onkeydown({
        keyCode: 87
    }), w.onkeyup({
        keyCode: 87
    }), setTimeout(fd, rdd.sw))
}

function rc() {
    if (rdd.rc) return socketStateNew = 0, rdd.st ? (spectatebtnclick(), void spectatebtnclick()) : (playbtnclick(),
        playbtnclick(), void setTimeout(rc, rdd.sr));
    $(".my-sticks li.active")
        .click()
}

function nx() {
    rdd.nxt && (0 === $(".server-item.active")
        .next('[style="display: flex;"]')
        .length ? $('.server-item[style="display: flex;"]')[0].click() : $(".server-item.active")
        .next('[style="display: flex;"]')
        .click(), playbtnclick(), setTimeout(nx, 600))
}
$("#option-common ul")
    .append(
        '<li><span>Color Blink</span> <input type="checkbox" class="checkbox" id="cblink"> <label for="cblink"></label> </li><li><span>Style OFF</span> <input type="checkbox" class="checkbox" id="stule"> <label for="stule"></label> </li><li><span>Dev-Mode</span> <input type="checkbox" class="checkbox" id="devm"> <label for="devm"></label> </li><li class="flex"> <span>Custom botname</span><div> <input id="bname" size="15" style="margin-right: 10px;padding: 0 0;border: 1px solid rgba(0, 0, 0, .10);height: 26px;text-align: center;border-radius: 15px;" size="15"> <input type="checkbox" class="checkbox" id="custbna"> <label for="custbna"></label> </div></li>'
    ), $(".add")
    .replaceWith(
        '<div class="info-landing" style="min-width: 300px; max-height: 280px;"> <h2>Mod support!</h2> <div style="height: 10px;"></div><div class="set-group"> <div class="set"> <div class="hot-latter"> </span></div><p>– Feed</p></div><div class="set"> <div class="hot-latter"></span></div><p>– Fast click play</p></div><div class="set"> <div class="hot-latter"><span>F4</span></div><p>– Reconnect</p></div><div class="set"> <div class="hot-latter"><span>F9</span></div><p>– Next Server</p></div><div class="set"> <div class="hot-latter"></span></div><p>– Inf zoom</p></div><div class="set"> <h3> Check settings!</h3> </div></div></div>'
    ), $("body")
    .append(
        '<link id="stylish-1" rel="stylesheet" type="text/css" href="https://dl.dropbox.com/s/tqi6mflpreg94j3/darkmin.css">'
    );
var rdd = {
    sw: 10,
    sc: 50,
    sr: 400,
    log: function (a) {
        console.log("%cModPD:%c%s ", "background: #F64747; color: #fff; padding: 4px;",
            "background: #E4F1FE; color: #000; padding: 2px;", a)
    },
    bot: function () {
        return "true" == readCookie("custbn") && readCookie("botname") ? readCookie("botname") : "Lихап"
    }
},w = window;
readCookie("botname") && $("#bname").val(readCookie("botname")), "true" == readCookie("custbn") && ($("#custbna").attr("checked",
        "checked"), rdd.log("Custom BotName is on")), readCookie("offstyle") ? ($("#stule").attr("checked", "checked"),
        $("#stylish-1").detach(), rdd.log("Style is off")) : rdd.log("Style is on"), "true" == readCookie("dev") && (rdd.dev = !
        0, $("#devm").attr("checked", "checked"), rdd.log("Dev-Mode is on")), w.addEventListener("keydown", kd),
    w.addEventListener("keyup", ku), $("#cblink").click(function () {
        $("#cblink")
            .is(":checked") ? (sendCol(), interval = setInterval(function () {
                clickColor("#FFFFFF", 0), sendCol()
            }, 1e4)) : clearInterval(interval)
    }), $("#devm").click(function () {
        createCookie("dev", $("#devm").is(":checked"), 10), rdd.dev = $("#devm").is(":checked")
    }), $("#stule").click(function () {
        $("#stule").is(":checked") ? ($("#stylish-1").detach(), createCookie("offstyle", !0, 10)) : ($("#stylish-1").appendTo(
            "body"), eraseCookie("offstyle"))
    }), $("#custbna").click(function () {
        createCookie("custbn", $("#custbna").is(":checked"), 10)
    }), $("#bname").change(function () {
        createCookie("botname", $("#bname").val(), 10)
    }), document.getElementById("bname")
    .onblur = function () {
        isTyping = !1
    }, document.getElementById("bname")
    .onfocus = function () {
        isTyping = !0
    };
/* NOT Last update.*/