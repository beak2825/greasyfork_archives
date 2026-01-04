// ==UserScript==
// @name         BTCSPİNNER AUTO SPİN
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Çok Yakında Youtube Kanalında
// @author       DARK
// @match        https://btcspinner.io/spinner
// @match        https://btcspinner.io/store
// @match        https://btcspinner.io/store/faucet
// @icon         https://www.google.com/s2/favicons?domain=btcspinner.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436665/BTCSP%C4%B0NNER%20AUTO%20SP%C4%B0N.user.js
// @updateURL https://update.greasyfork.org/scripts/436665/BTCSP%C4%B0NNER%20AUTO%20SP%C4%B0N.meta.js
// ==/UserScript==

(($) => {

	var Url_Path = window.location.pathname.split('/').pop();
	//console.log(Url_Path)
	switch(Url_Path) {
	  case "spinner":
		setInterval(function() {
			var priceEls = document.getElementsByClassName("m-0");
			var price = priceEls[1].innerText;
			var numbers = parseInt(price.match(/\d+/g).map(Number));
			if (numbers > 0) {
				if (document.getElementsByClassName("fas fa-eraser").length > 0 && numbers > 0) {
					document.getElementsByClassName("fas fa-eraser")[0].click();
					try {
						document.getElementsByClassName("fas fa-eraser")[0].click();
					} catch (e) {
						//console.log(e);
					}

					try {
						document.getElementsByClassName("fas fa-box")[0].click();
					} catch (e) {
						//console.log(e);
					}
				} else if (document.getElementsByClassName("swal2-confirm swal2-styled").length > 0 && numbers > 0) {
					document.getElementsByClassName("swal2-confirm swal2-styled")[0].click();
					try {
						document.getElementsByClassName("fas fa-eraser")[0].click();
					} catch (e) {
						//console.log(e);
					}

					try {
						document.getElementsByClassName("fas fa-box")[0].click();
					} catch (e) {
						//console.log(e);
					}
				} else if (document.getElementsByClassName("btn btn-dark btn-lg btn-block rounded-pill").length > 0 && numbers > 0) {
					document.getElementsByClassName("fas fa-box")[0].click();
				} else if (document.getElementsByClassName("swal2-confirm swal2-styled").length > 0) {
					document.getElementsByClassName("swal2-confirm swal2-styled")[0].click();
					try {
						document.getElementsByClassName("fas fa-eraser")[0].click();
					} catch (e) {
						//console.log(e);
					}

					try {
						document.getElementsByClassName("fas fa-box")[0].click();
					} catch (e) {
						//console.log(e);
					}
				} else if (document.getElementsByClassName("btn btn-primary btn-lg btn-block rounded-pill").length > 0 && numbers > 0) {
					document.getElementsByClassName("btn btn-primary btn-lg btn-block rounded-pill")[0].click();
					try {
						document.getElementsByClassName("fas fa-eraser")[0].click();
					} catch (e) {
						//console.log(e);
					}

					try {
						document.getElementsByClassName("fas fa-box")[0].click();
					} catch (e) {
						//console.log(e);
					}
				} else if (document.getElementsByClassName("btn btn-success btn-lg btn-block rounded-pill").length > 0 && numbers > 0) {
					document.getElementsByClassName("btn btn-success btn-lg btn-block rounded-pill")[0].click();
					try {
						document.getElementsByClassName("fas fa-eraser")[0].click();
					} catch (e) {
						//console.log(e);
					}

					try {
						document.getElementsByClassName("fas fa-box")[0].click();
					} catch (e) {
						//console.log(e);
					}
				} else {
					//console.log("HATA!");
					clearInterval();
				}
			} else {
				if (numbers == 0) {
					try {
						document.getElementsByClassName("fas fa-sync")[0].click();
					} catch (e) {
						//console.log(e);
					}
					window.location.href = 'https://btcspinner.io/store';
				}
			}
		}, 2000);
		setTimeout(function() { location.reload(); }, 180000);
	  break;
	  case "store":
		var priceEls = document.getElementsByClassName("m-0");
		var price = priceEls[1].innerText;
		var numbers = price.match(/\d+/g).map(Number);
		function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		async function dene() {
			if(document.getElementsByClassName("fas fa-dice-five").length>0 && numbers==0){
				try{
					document.getElementsByClassName("fas fa-dice-five")[0].click();
				}catch(e){
					console.log(e);
				}
					await sleep(5000);
			}
		}
		dene();
		if(numbers>0){
			window.location.href = 'https://btcspinner.io/spinner';
		}
	  break;
	  case "faucet":
		window.location.href = 'https://btcspinner.io/spinner';
	  break;
	  default:
		// code block
	}

	if(navigator.userAgentData.mobile){
		document.head.insertAdjacentHTML('afterbegin', '<meta name="theme-color" content="#000" />');
        document.body.style.backgroundColor = "#000";
        document.querySelector("nav.shadow-sm").style.backgroundColor = "#343a40";
        document.querySelector("nav.bg-white").classList.remove("bg-white");
        document.querySelector(".card.rounded-lg").style.backgroundColor = "#343a40";
        if(document.querySelector(".form-group")){
            document.querySelector(".form-group").offsetParent.remove();
            document.querySelector(".form-group").offsetParent.remove()
        }
		const requestWakeLock = async () => {
			try {
				const wakeLock = await navigator.wakeLock.request('screen');
			}catch (err) {
				//console.log(`${err.name}, ${err.message}`);
			}
		}
		requestWakeLock();
	}

	function temizle(){
		clearInterval();
		clearTimeout();
	}

	window.addEventListener("online", 
		()=> location.reload()
	);
	window.addEventListener("offline", 
		()=> temizle()
	);

})(window.jQuery)