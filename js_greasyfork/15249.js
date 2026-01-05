// ==UserScript==
// @name        Writer - Count Forums
// @namespace   HF
// @description It is sometimes annoying to have to add all this values..
// @include     *hackforums.net
// @include     *hackforums.net/
// @include     *hackforums.net/#
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     0.1
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/15249/Writer%20-%20Count%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/15249/Writer%20-%20Count%20Forums.meta.js
// ==/UserScript==



$(".active").append(" - <a href='#' id='countThisShit'>Writer : Count forum</a>");


$("#countThisShit").on("click", function() {
	
	var arr = 0, plifet = 0, plifep = 0, contestst = 0, contestsp = 0, srppt = 0, srppp = 0, aat = 0, aap = 0, newst = 0, newsp = 0, melodyt = 0, melodyp = 0, moviest = 0, moviesp = 0, lounget = 0, loungep = 0, renft = 0, renfp = 0;
	
	tab = $("#menutabs a[class='selected']").attr("rel");


	
		
		arr = $("#cat_7_e > tr:nth-child(3) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		plifet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		plifep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_7_e > tr:nth-child(4) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		contestst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		contestsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_7_e > tr:nth-child(5) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		srppt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		srppp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_7_e > tr:nth-child(6) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		aat = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		aap = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_7_e > tr:nth-child(7) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		newst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		newsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_7_e > tr:nth-child(8) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		melodyt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		melodyp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_7_e > tr:nth-child(9) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		moviest = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		moviesp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_7_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		lounget = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		loungep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_1_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		ranft = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		ranfp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		
		alert("Common : \n\nLounge threads - posts : " + lounget + " - " + loungep + "\nRANF threads - posts : " + ranft + " - " + ranfp + "\nTotal threads : " +  (plifet + contestst + srppt + aat + newst + melodyt + moviest + lounget + ranft) + "\nTotal posts : " + (plifep + contestsp + srppp + aap + newsp + melodyp + moviesp + loungep + ranfp));
		
		
		
		arr = $("#cat_45_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		plifet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		plifep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_45_e > tr:nth-child(3) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		contestst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		contestsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_45_e > tr:nth-child(4) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		srppt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		srppp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_45_e > tr:nth-child(5) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		ranft = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		ranfp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_45_e > tr:nth-child(6) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		aat = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		aap = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_45_e > tr:nth-child(7) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		newst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		newsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_45_e > tr:nth-child(8) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		melodyt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		melodyp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_45_e > tr:nth-child(9) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		moviest = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		moviesp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_45_e > tr:nth-child(10) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		lounget = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		loungep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		alert("Hack : \n\nTotal threads : " + (plifet + contestst + srppt + aat + newst + melodyt + moviest + lounget + ranft) + "\nTotal posts : " + (plifep + contestsp + srppp + aap + newsp + melodyp + moviesp + loungep + ranfp));
		
		
		arr = $("#cat_88_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		plifet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		plifep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_88_e > tr:nth-child(3) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		contestst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		contestsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_88_e > tr:nth-child(4) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		srppt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		srppp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_88_e > tr:nth-child(5) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		ranft = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		ranfp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_88_e > tr:nth-child(6) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		aat = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		aap = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_88_e > tr:nth-child(7) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		newst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		newsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_88_e > tr:nth-child(8) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		melodyt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		melodyp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_88_e > tr:nth-child(9) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		moviest = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		moviesp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		
		alert("Tech : \n\nTotal threads : " + (plifet + contestst + srppt + aat + newst + melodyt + moviest + ranft) + "\nTotal posts : " + (plifep + contestsp + srppp + aap + newsp + melodyp + moviesp + ranfp));
		
		
		arr = $("#cat_151_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		plifet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		plifep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_151_e > tr:nth-child(3) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		contestst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		contestsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_151_e > tr:nth-child(4) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		srppt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		srppp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_151_e > tr:nth-child(5) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		ranft = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		ranfp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_151_e > tr:nth-child(6) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		aat = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		aap = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_151_e > tr:nth-child(7) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		newst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		newsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_151_e > tr:nth-child(8) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		melodyt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		melodyp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_151_e > tr:nth-child(9) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		moviest = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		moviesp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_151_e > tr:nth-child(10) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		lounget = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		loungep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		alert("Code : \n\nTotal threads : " + (plifet + contestst + srppt + aat + newst + melodyt + moviest + lounget + ranft) + "\nTotal posts : " + (plifep + contestsp + srppp + aap + newsp + melodyp + moviesp + loungep + ranfp));
		
		
		arr = $("#cat_80_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		plifet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		plifep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_80_e > tr:nth-child(3) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		contestst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		contestsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_80_e > tr:nth-child(4) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		srppt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		srppp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_80_e > tr:nth-child(5) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		ranft = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		ranfp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_80_e > tr:nth-child(6) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		aat = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		aap = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_80_e > tr:nth-child(7) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		newst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		newsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_80_e > tr:nth-child(8) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		melodyt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		melodyp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_80_e > tr:nth-child(9) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		moviest = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		moviesp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_80_e > tr:nth-child(10) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		lounget = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		loungep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_80_e > tr:nth-child(11) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		mobilet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		mobilep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_80_e > tr:nth-child(12) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		nintendot = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		nintendop = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
				
		alert("Game : \n\nTotal threads : " + (plifet + contestst + srppt + aat + newst + melodyt + moviest + lounget + ranft + mobilet + nintendot) + "\nTotal posts : " + (plifep + contestsp + srppp + aap + newsp + melodyp + moviesp + loungep + ranfp + mobilep + nintendop));
		
		
		arr = $("#cat_53_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		plifet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		plifep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		alert("Groups : \n\nTotal threads : " + plifet + "\nTotal posts : " + plifep);
		
		
		arr = $("#cat_141_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		plifet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		plifep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_141_e > tr:nth-child(3) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		contestst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		contestsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_141_e > tr:nth-child(4) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		srppt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		srppp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_141_e > tr:nth-child(5) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		ranft = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		ranfp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_141_e > tr:nth-child(6) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		aat = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		aap = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_141_e > tr:nth-child(7) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		newst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		newsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		alert("Web : \n\nTotal threads : " + (plifet + contestst + srppt + aat + newst + ranft) + "\nTotal posts : " + (plifep + contestsp + srppp + aap + newsp + ranfp));
		
		
		arr = $("#cat_156_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		plifet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		plifep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_156_e > tr:nth-child(3) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		contestst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		contestsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_156_e > tr:nth-child(4) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		srppt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		srppp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_156_e > tr:nth-child(5) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		ranft = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		ranfp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_156_e > tr:nth-child(6) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		aat = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		aap = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_156_e > tr:nth-child(7) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		newst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		newsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_156_e > tr:nth-child(8) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		yolot = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		yolop = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		alert("GFX : \n\nTotal threads : " + (plifet + contestst + srppt + aat + newst + ranft + yolot) + "\nTotal posts : " + (plifep + contestsp + srppp + aap + newsp + ranfp + yolop));
		
		
		arr = $("#cat_105_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		plifet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		plifep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_105_e > tr:nth-child(3) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		contestst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		contestsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_105_e > tr:nth-child(4) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		srppt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		srppp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_105_e > tr:nth-child(5) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		ranft = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		ranfp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_105_e > tr:nth-child(6) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		aat = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		aap = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_105_e > tr:nth-child(7) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		newst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		newsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_105_e > tr:nth-child(8) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		melodyt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		melodyp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_105_e > tr:nth-child(9) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		moviest = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		moviesp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_105_e > tr:nth-child(10) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		lounget = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		loungep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		alert("Market : \n\nTotal threads : " + (plifet + contestst + srppt + aat + newst + melodyt + moviest + lounget + ranft) + "\nTotal posts : " + (plifep + contestsp + srppp + aap + newsp + melodyp + moviesp + loungep + ranfp));
		
		
		arr = $("#cat_241_e > tr:nth-child(2) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		plifet = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		plifep = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_241_e > tr:nth-child(3) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		contestst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		contestsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_241_e > tr:nth-child(4) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		srppt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		srppp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_241_e > tr:nth-child(5) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		ranft = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		ranfp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_241_e > tr:nth-child(6) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		aat = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		aap = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_241_e > tr:nth-child(7) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		newst = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		newsp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_241_e > tr:nth-child(8) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		melodyt = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		melodyp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		arr = $("#cat_241_e > tr:nth-child(9) > td:nth-child(3)").html();
		arr = arr.replace(/,/ig, "");
		moviest = arr.replace(/^(.*?)<br>(.*?)$/ig, "$1") * 1;
		moviesp = arr.replace(/^(.*?)<br>(.*?)$/ig, "$2") * 1;
		
		alert("Money : \n\nTotal threads : " + (plifet + contestst + srppt + aat + newst + melodyt + moviest + ranft) + "\nTotal posts : " + (plifep + contestsp + srppp + aap + newsp + melodyp + moviesp + ranfp));
});