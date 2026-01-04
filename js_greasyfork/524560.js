// ==UserScript==
// @name         MDA linkedin improvements
// @namespace    http://tampermonkey.net/
// @version      1.5.7
// @description  my linkedin improvements started 2025-01-11
// @author       mr-d-r
// @license      MIT
// @match        http*://*.linkedin.com/*
// @grant        GM_addStyle
// @require      https://update.greasyfork.org/scripts/524553/1525219/MDA%20library.js
// @downloadURL https://update.greasyfork.org/scripts/524560/MDA%20linkedin%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/524560/MDA%20linkedin%20improvements.meta.js
// ==/UserScript==

// update check 27.01.2025

(function() {
    'use strict';
	var dbg=0, 	aa, bb;

	if( window.location.hostname.match("merchantpool1") )	{  log(`${GM.info.script.name}:  ${window.location.hostname} skipped !!!`);	return;  }
	console.log("\n", "\n", `${GM.info.script.name}: start ${window.location.hostname} debug=${(typeof dbg == "undefined") ? "absent" : dbg}  MDAlib=${(typeof MDAlib == "undefined") ? "absent" : MDAlib}` );

// end of script


	function myActions (caller) { var a, b,			fn=fnName();
		log(`${fn}(${caller}) @${window.location.hostname}: start`);
		click_ShowMore();

		qSA(".ad-banner").forEach(item =>{
			item.remove();	log(`ad had been removed`);		//if( item?.style?.display && item?.style?.display != 'none' )  item.style.display='none';	log(`ad had been hidden`);
		});
		qSA("div[id='sub-frame-error']").forEach(item =>{ 	item?.remove();	log(`sub-frame-error removed`);		});

		qSA("article.mb3").forEach(item =>{
			if( a=qS("use[href='#close-small']") )  {  a.parentNode.parentNode.click();	log(`linkedin app AD found - closed`);  }
		});

		// WORKS, вроде реально норм, но под настроение еще искать более точные критерии для рекламы
		document.querySelectorAll(".relative > div[id*='ember']").forEach(i =>{
			i.querySelectorAll("span[aria-hidden='true']").forEach(j =>{
				if( j.textContent == "Promoted" )  {
						a=i.querySelector(".update-components-actor__image"); // ADs title
					  	console.log("promoted1 - removed", a?.ariaLabel);
					  	i.remove(); // j.textContent=`${j.textContent}_Removed!!!`;  i.style.display='none';  	// i.remove();
				}
			});
			i.querySelectorAll(".update-components-actor__sub-description-button-text").forEach(j =>{
				if( j.textContent.match(/Book an appointment/i) )  {
					  	console.log("Book an appointment - removed", a?.ariaLabel);
					  	i.remove(); // j.textContent=`${j.textContent}_Removed!!!`;  i.style.display='none';  	// i.remove();
				}
			});
		});

		//     например если .update-components-header__text-view сразу <span> и сразу href="https://www.linkedin.com/company/*"
		document.querySelectorAll(".relative > div[id*='ember']").forEach(i =>{
			i.querySelectorAll(".update-components-actor__container [href*='/company']").forEach(j =>{  // document.querySelectorAll(".update-components-actor__container [href*='/company']")[10].href
					  	console.log("promoted2 - removed", j?.href);
						i.remove();
			});
		});

/*  2finish
		document.querySelectorAll(".relative > z&*&^*&^*^zxzx").forEach(i =>{
			i.querySelectorAll(".update-components-actor__meta-link [href*='/company']").forEach(j =>{  // document.querySelectorAll(".update-components-actor__container [href*='/company']")[10].href
					  	console.log("promoted22 - removed", j?.href);
						i.remove();
			});
		});
*/


	} // myActions()


	window.addEventListener('load', function() {	var fn=fnName();
		ttout(300,   ()=>{	myActions(`onLoad`);	});
		ttout(2500,  ()=>{	myActions(`onLoad`);	});

		// ttout(onLOADlckTMOUT,  ()=>{ 	onLOADlck=false; 					});  	// 3000 ms IMPORTANT !!!
	}); // window.addEventListener('load'...) // onload


	window.navigation.addEventListener("navigate", (event) => {  // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
	});


window.addEventListener('keydown', (e) => {     // window.addEventListener("keyup", async (e) => {
    var a, b, aa, bb, cc, c1, c2; //     if(dbg)  log("parent " +e.code);
	if( anyActiveInput() ) 	{ log(`on ${e.code}:  active input detected`);				return; 	}

    switch (e.code) {  // see https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/
    	 case "KeyA":
				//log(`KeyA: clicked`);
				myActions(`onKeyA`);  // chk upd 111 222 333 444 555
				e.preventDefault();
				break;
    	 case "KeyE":  // Endorse
				if (e.ctrlKey || e.altKey || e.shiftKey)  break;
				aa=document.querySelectorAll(".artdeco-button__text").length;
				cc=0; document.querySelectorAll(".artdeco-button__text").forEach(item => {
					if(item.textContent.match(/Endorse\n/)) { console.log(item); 	cc++; 	item.click(); } ;
				});
				c1=0; document.querySelectorAll(".artdeco-button__text").forEach(item => {
					if(item.textContent.match(/Endorse\n/)) { c1++; } ;
				});
				c2=0; document.querySelectorAll(".artdeco-button__text").forEach(item => {
					if(item.textContent.match(/Endorse\n/)) { c2++; } ;
				});
				log(`KeyE: endorse clicked: ${cc},  endorse left: ${c1},  endorsed found: ${c2}`);
				e.preventDefault();
				break;
    	 case "KeyM":  // чаще всего кнопка "Show more feed updates" показывается при запущенном devtool !!!
				if (e.ctrlKey || e.altKey || e.shiftKey)  break;
				log(`KeyM: "Show more feed updates"`);
				document.querySelectorAll(".display-flex").forEach(item => {
  					a=item.querySelector(".artdeco-button__text");
    				if (a) b=a.innerText;
    				if (b)  console.log("bbb", b == "Show more feed updates");
  					if( b == "Show more feed updates") {
        				console.log(a);  a.parentNode.click();		// WORKS, но орет Uncaught TypeError: Cannot read properties of null (reading 'parentNode') !!!
					}
				});
				e.preventDefault();
				break;

     } // end of switch
     return;
}); // end of  window.addEventListener("keydown", (e) =>


var onScrollLOCK=false, onScrollTMOUT=300, scrollBefore = 0, tickCURR, tickPROC;
window.addEventListener('scroll',function(e){  // !!! https://stackoverflow.com/questions/4670834/capturing-the-scroll-down-event
    const scrolled = window.scrollY;
	var a, procCNT=0;

	if( onScrollLOCK ) return;		onScrollLOCK=true; 		ttout(onScrollTMOUT,  ()=>{	onScrollLOCK=false;	});

	//if( ! onLoadDONE )  return;

    if(scrollBefore > scrolled){
        console.log("ScrollUP");
        scrollBefore = scrolled;
        //Desired action
    } else {
        scrollBefore = scrolled;
        //console.log("ScrollDOWN");
			// tickCURR, tickPROC - MUST BE GLOBAL !!!
			tickCURR=Date.now();
			if (!tickPROC) 		tickPROC=setInterval(function () {  // если быстро нажали Ctrl +/- несколько раз подряд, то отработать только последнее
											let cu=Date.now();
											procCNT++;
											if ((cu-tickCURR) < 300) { 	if(dbg && dbg>5)  console.log("interv: <600 - skip");					}
											else { 	clearInterval(tickPROC); tickPROC=null; //	log("finally fire on scrollDOWN 557732" +procCNT);
													myActions(`onScrollDOWN`);
											}
								}, 600);
    }

}) // 'scroll'

	function click_ShowMore () {
			if( a=qS(".jobs-description__footer-button[aria-expanded='false']") ) 	{ 	log(`${window.location.hostname} "See more" clicked`); 	a.click(); 	}
			//else log(`${window.location.hostname} "See more" is not found`);

			qSA(".artdeco-button").forEach(item => {
					let x=item?.textContent;
					if( x.match(/Show more/) ) 	if( ! x.match(/Show more feed updates/) ) {
							console.log(`Show more  COULD BE clicked: ${x}`);   // item.click();
					} ;
			});
	} // click_ShowMore()
})();

