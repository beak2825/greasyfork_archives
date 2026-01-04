// ==UserScript==
// @name         AnimeFLV Bigger Player
// @namespace    https://twitter.com/Ale_v_q
// @version      1.0
// @description  Script para agrandar el reproductor de video
// @author       Txandro
// @icon         https://icons.iconarchive.com/icons/bokehlicia/pacifica/256/multimedia-video-player-icon.png
// @match        *.animeflv.net/ver/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489217/AnimeFLV%20Bigger%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/489217/AnimeFLV%20Bigger%20Player.meta.js
// ==/UserScript==

(function() {

	const $ = window.jQuery;
	const txn = {
		url: `${window.location.protocol}//${window.location.hostname}`,
		uri: location.href
			.substring(`${window.location.protocol}//${window.location.hostname}/`.length)
			.split('/')
	};

	if(txn.uri[0] == 'ver') {
		var btn = $("#XpndCn > div.CpCnB > div.CapOptns.ClFx.show > span.BtnNw.Xpnd.BxSdw.AAShwHdd-lnk");
        if (btn){
            window.setTimeout(function() {
            btn.click()
        }, 1000);}

        var container = $(".Container");
        if (container){
            container.css("max-width", "90dvw");
        }

        var player = $(".CapiTcn");
        if (player){
            player.css("height", "880");
        }

        $('html, body').animate({
            scrollTop: $("#XpndCn > div.CpCnA > ul").offset().top
        }, 1000);
	}

})();