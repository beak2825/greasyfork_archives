// ==UserScript==
// @name         Neopets: Scratchcard scratcher
// @namespace    http://clraik.com/forum/showthread.php?61862-Neopets-scratchcard-scratcher
// @version      1.1
// @description  Plays scratchcards for you on Deserted Fairground Scratchcards and Scratchcard Kiosk
// @author       Nyu (clraik)
// @match        *://*.neopets.com/halloween/*scratch*.phtml*
// @match        *://*.neopets.com/winter/*kiosk*.phtml*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/33066/Neopets%3A%20Scratchcard%20scratcher.user.js
// @updateURL https://update.greasyfork.org/scripts/33066/Neopets%3A%20Scratchcard%20scratcher.meta.js
// ==/UserScript==



var scratch_random=true;//if set to false, set the numbers you want to scratch

// List which ones you'd like to scratch.
// [1] [2] [3]
// [4] [5] [6]
// [7] [8] [9]
var scratch_values=[1,2,3,7,8,9];



if(document.URL.indexOf("halloween/process_scratch.phtml?") != -1) {
  history.back();
}
if(document.URL.indexOf("winter/process_kiosk.phtml?") != -1) {
  history.back();
}

if(document.URL.indexOf("halloween/scratch2.phtml") != -1) {
	if (document.body.innerHTML.indexOf('sscratchcardss can be sscratched a day!!!') != -1) {
	   alert("You can only scratch five cards a day.\nCome back tomorrow!");
	}
	else if(!scratch_random){
		var i = GM_getValue('toScratch', 0);
		GM_setValue('toScratch', i + 1);
		if (i<=5){
			  var ts=scratch_values[i];
			$('a[href="process_scratch.phtml?type=scratch&loc='+ts+'"]')[0].click();
		}
		else{
			GM_setValue('toScratch', 0);
			try{
				var wonL=winLevel();
				if (wonL>=3){
					alert("You won a level!");
				}
				var wonJ=winJackpot();
				if (wonJ>=3){
					alert("You won a level!");
				}
				location.href="scratch.phtml";
			}catch(no){
				location.href="scratch.phtml";
			}
		}
	}else{
		var ns=unscratched();
		var random_scratch=Math.floor(Math.random() * ((ns-1) + 1));
		if (ns>3){
			$('img[src="//images.neopets.com/halloween/scratch/scratched.gif"]')[random_scratch].click();
		}else{
			try{
				var wonL=winLevel();
				if (wonL>=3){
					alert("You won a level!");
				}
				var wonJ=winJackpot();
				if (wonJ>=3){
					alert("You won a level!");
				}
				location.href="scratch.phtml";
			}catch(no){
				location.href="scratch.phtml";
			}
		}
	}
}
if(document.URL.indexOf("winter/kiosk2.phtml") != -1) {
	if (document.body.innerHTML.indexOf('You are only allowed to scratch five cards a day!') != -1) {
	   alert("You can only scratch five cards a day.\nCome back tomorrow!");
	}
	else if(!scratch_random){
		var i = GM_getValue('toScratch', 0);
		GM_setValue('toScratch', i + 1);
		if (i<=5){
				var ts=scratch_values[i];
        $('a[href="process_kiosk.phtml?type=scratch&loc='+ts+'"]')[0].click();
		}
		else{
			GM_setValue('toScratch', 0);
			try{
				var wonL=winLevel();
				if (wonL>=3){
					alert("You won a level!");
				}
				var wonJ=winJackpot();
				if (wonJ>=3){
					alert("You won a level!");
				}
				location.href="kiosk.phtml";
			}catch(no){
				location.href="kiosk.phtml";
			}
		}
	}else{
		var ns=unscratched();
		var random_scratch=Math.floor(Math.random() * ((ns-1) + 1));
		if (ns!=3){
			$('img[src="http://images.neopets.com/winter/scratchcard/not_scratched.gif"]')[random_scratch].click();
		}else{
			try{
				var wonL=winLevel();
				if (wonL>=3){
					alert("You won a level!");
				}
				var wonJ=winJackpot();
				if (wonJ>=3){
					alert("You won a level!");
				}
				location.href="kiosk.phtml";
			}catch(no){
				location.href="kiosk.phtml";
			}
		}
	}
}
if(document.URL.indexOf("halloween/scratch.phtml") != -1) {
	try{
		$("select[name='card_id'] option:contains(' Scratchcard')").attr("selected","selected");
		GM_setValue('scratchedCards', i + 1);
		$('[value="Sscratch!"]').click();
	}
	catch(no){
	}
}
if(document.URL.indexOf("winter/kiosk.phtml") != -1) {
	try{
		$("select[name='card_id'] option:contains(' Scratchcard')").attr("selected","selected");
		GM_setValue('scratchedCards', i + 1);
		$("[value='Scratch!']").click();
	}
	catch(no){
	}
}
function unscratched(){
	var notScratched=$("table[width='300'][border='0'][cellpadding='0'][cellspacing='0']")[0].innerHTML;
	if(notScratched.includes("not_scratched.gif")){
		var t = notScratched.replace(/\r?\n?/g, "").replace(/\s{2,}/g, " "),cont = new RegExp("not_scratched.gif", "gi");
		return t.match(cont).length;
	}else if(notScratched.includes("scratch/scratched.gif")){
		var t2 = notScratched.replace(/\r?\n?/g, "").replace(/\s{2,}/g, " "),cont2 = new RegExp("scratch/scratched.gif", "gi");
		return t2.match(cont2).length;
	}else{
		return 0;
	}
}
function winLevel(){
	var scratched=$("table[width='300'][border='0'][cellpadding='0'][cellspacing='0']")[0].innerHTML;
	if(scratched.includes("images.neopets.com/halloween/scratch/6.gif")){
		var t = scratched.replace(/\r?\n?/g, "").replace(/\s{2,}/g, " "),cont = new RegExp("images.neopets.com/halloween/scratch/6.gif", "gi");
		return t.match(cont).length;
	}else if(scratched.includes("images.neopets.com/winter/scratchcard/6.gif")){
		var t2 = scratched.replace(/\r?\n?/g, "").replace(/\s{2,}/g, " "),cont2 = new RegExp("images.neopets.com/halloween/scratch/9.gif", "gi");
		return t2.match(cont2).length;
	}else{
		return 0;
	}
}
function winJackpot(){
	var scratched=$("table[width='300'][border='0'][cellpadding='0'][cellspacing='0']")[0].innerHTML;
	if(scratched.includes("images.neopets.com/halloween/scratch/9.gif")){
		var t = scratched.replace(/\r?\n?/g, "").replace(/\s{2,}/g, " "),cont = new RegExp("images.neopets.com/halloween/scratch/6.gif", "gi");
		return t.match(cont).length;
	}else if(scratched.includes("images.neopets.com/winter/scratchcard/9.gif")){
		var t2 = scratched.replace(/\r?\n?/g, "").replace(/\s{2,}/g, " "),cont2 = new RegExp("images.neopets.com/halloween/scratch/9.gif", "gi");
		return t2.match(cont2).length;
	}else{
		return 0;
	}
}