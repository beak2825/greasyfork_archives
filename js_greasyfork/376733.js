// ==UserScript==
// @name         Erev2 Laws
// @namespace    Erev2 Laws
// @description  Feel free to donate https://www.erev2.com/en/profile/182
// @version      0.1
// @author       tyrlaka
// @match        https://www.erev2.com/*/country/law/*
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/376733/Erev2%20Laws.user.js
// @updateURL https://update.greasyfork.org/scripts/376733/Erev2%20Laws.meta.js
// ==/UserScript==
jQuery(document).ready(function(){var law=$('.main-box-body .table tbody td script').text().split(":");var times=law[1].split(',');times=times[0].split('+');times=parseInt(times[1]);var blf=new Date();blf.setSeconds(blf.getSeconds()+times);var bf=blf.toString();var blft=bf.split('GMT');var bls=new Date();bls.setSeconds(bls.getSeconds()+(times-86400));var bs=bls.toString();var blst=bs.split('GMT');$('.table .clearfix').after("<br /> BG TIME:<br />Law started at: <b>"+blst[0]+"</b><br /><br /> Law finished at: <b>"+blft[0]+"</b> <br /><br />");var slf=new Date();slf.setSeconds(slf.getSeconds()+(times-10*60*60));var sf=slf.toString();var slft=sf.split('GMT');var sls=new Date();sls.setSeconds(sls.getSeconds()+((times-86400)-10*60*60));var ss=sls.toString();var slst=ss.split('GMT');$('.table .clearfix').after("<br /> SERVER TIME:<br />Law started at: <b>"+slst[0]+"</b><br /><br /> Law finished at: <b>"+slft[0]+"</b> <br /><br />")})