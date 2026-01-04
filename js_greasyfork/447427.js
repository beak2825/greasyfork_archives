// ==UserScript==
// @name         金豆發大財
// @namespace    http://tampermonkey.net/
// @version      87.41
// @description  6666666666999999999
// @author       You
// @match        https://gamafun.beanfun.com/game_beans.html
// @match        https://gamafun.beanfun.com/game_bottle.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447427/%E9%87%91%E8%B1%86%E7%99%BC%E5%A4%A7%E8%B2%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/447427/%E9%87%91%E8%B1%86%E7%99%BC%E5%A4%A7%E8%B2%A1.meta.js
// ==/UserScript==

goal1=function(){$.each($(".bean1"),function(){$(".game_num1").text(score1+1),score1=parseInt($(".game_num1").text()),$(this).remove(),$(".hint").addClass("on"),setTimeout(function(){$(".hint").removeClass("on")},500)})},goal2=function(){$.each($(".bean2"),function(){$(".game_num2").text(score2+3),score2=parseInt($(".game_num2").text()),$(this).remove(),$(".hint").addClass("on"),setTimeout(function(){$(".hint").removeClass("on")},500)})},shoot_pc=function(){var b=$(".bt_1").position().left,c=$(".bt_2").position().left;c_left=$(".bt_3").position().left,d_left=$(".bt_4").position().left,e_left=$(".bt_5").position().left,f_left=$(".bt_6").position().left,g_left=$(".bt_7").position().left;var d=$("#target").width(),a=target+d;return b<a&&b>=target?($(".bt_1").fadeOut(50),setTimeout(function(){$(".bt_1").show(0)},2e3)):c<a&&c>=target?($(".bt_2").fadeOut(50),setTimeout(function(){$(".bt_2").show(0)},2e3)):c_left<a&&c_left>=target?($(".bt_3").fadeOut(50),setTimeout(function(){$(".bt_3").show(0)},2e3)):d_left<a&&d_left>=target?($(".bt_4").fadeOut(50),setTimeout(function(){$(".bt_4").show(0)},2e3)):e_left<a&&e_left>=target?($(".bt_5").fadeOut(50),setTimeout(function(){$(".bt_5").show(0)},2e3)):f_left<a&&f_left>=target?($(".bt_6").fadeOut(50),setTimeout(function(){$(".bt_6").show(0)},2e3)):g_left<a&&g_left>=target&&($(".bt_7").fadeOut(50),setTimeout(function(){$(".bt_7").show(0)},2e3)),score=40,$("#score").text(score),$(".finalscore").text(score),!1}