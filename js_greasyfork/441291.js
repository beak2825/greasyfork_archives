// ==UserScript==
// @name         Rohlík/Košík Cart Saver 💾
// @namespace    https://twitter.com/Baegus
// @version      1.1
// @description  Save and share your cart on Rohlík.cz and Košík.cz! Ctrl+S to save, Ctrl+L to load.
// @author       Jaroslav Petrnoušek
// @license      MIT
// @match        https://*.rohlik.cz/*
// @match        https://*.kosik.cz/*
// @icon         https://www.google.com/s2/favicons?domain=www.rohlik.cz
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/441291/Rohl%C3%ADkKo%C5%A1%C3%ADk%20Cart%20Saver%20%F0%9F%92%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/441291/Rohl%C3%ADkKo%C5%A1%C3%ADk%20Cart%20Saver%20%F0%9F%92%BE.meta.js
// ==/UserScript==

function b64Decode(str) {return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2) }).join('')) }
function b64Encode(str) {return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {return String.fromCharCode(parseInt(p1, 16)) })) }

const root = `${window.location.protocol}//${window.location.hostname}`,
	  currentSite = root.includes("rohlik.cz") ? "rohlik" : "kosik",
	  api = {
		rohlik: `${root}/services/frontend-service/v2/cart`,
		kosik:  `${root}/api/front/cart/`
	  },
	  cartLink = {
	  	rohlik: `${root}/objednavka/prehled-kosiku/`,
		kosik:  `${root}/kosik`
	  },
	  reqMethod = {
	  	rohlik: "POST",
		kosik:  "PUT"
	  },
	  headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	  };

const urlParams = new URLSearchParams(window.location.search),
	  urlData = urlParams.get("savedCart");
if (urlData) {
	loadItems(urlData);
}
function startLoading() {
	const styleEl = document.createElement("style");
	styleEl.id="cartSaverWaiting";
	styleEl.innerHTML = `
		* {
			cursor: wait !important;
			pointer-events: none !important;
		}
	`;
	document.head.appendChild(styleEl);
}
function stopLoading() {
	const styleEl = document.getElementById("cartSaverWaiting");
	styleEl.parentNode.removeChild(styleEl);
}
function saveItems() {
	startLoading();
	const items = [];
	const reqURL = `${api[currentSite]}`;

	fetch(reqURL, {
		method: "GET",
		headers: headers
	}).then(res => res.json()
	).then(resData => {
		if (currentSite == "rohlik") {
			const itemList = resData.data.items;
			Object.keys(itemList).forEach(function(itemKey) {
				let item = itemList[itemKey];
				items.push({
					id: item.productId,
					qnt: item.quantity
				});
			});
		}
		if (currentSite == "kosik") {
			const itemList = resData.shoppingCartProducts;
			itemList.forEach(function(item) {
				items.push({
					id: item.product.id,
					qnt: item.quantity
				});
			});
		}
		if (items.length > 0) {
			GM_setClipboard(`${cartLink[currentSite]}?savedCart=${b64Encode(JSON.stringify(items))}`);
			alert("URL adresa košíku byla zkopírována do schránky.");
		}
		else {
			alert("V košíku nejsou žádné položky k uložení.");
		}
		stopLoading();
	})
	.catch(err => {
		alert(`Došlo k chybě při čtení obsahu košíku. V konzoli (F12) najdete detaily.`);
		console.log(err);
	});
}
function loadItems(data=false) {
	startLoading();
	let cartData = [],
		errors = [];
	function addItems(cartData) {
		const finalItem = cartData.length-1;
		function sendReq(i) {
			const item = cartData[i];
			const reqData = {
				productId: item.id,
				quantity:  item.qnt
			};
			if (currentSite === "kosik") {
				delete reqData.productId;
			}
			const reqURL = `${api[currentSite]}${currentSite=="kosik"?`product/${item.id}`:""}`;
			fetch(reqURL, {
				method: reqMethod[currentSite],
				headers: headers,
				body: JSON.stringify(reqData)
			}).then(res => {
				if (res.status === 200) {
					console.log(`Produkt ${item.id} přidán do košíku.`);
				}
				else {
					console.log(`Produkt ${item.id} nešlo přidat.`);
					errors.push(item.id);
				}
				if (i<finalItem) {
					setTimeout(function() {
						sendReq(i+1);
					},150);
				}
				else {
					if (errors.length == 0) {
						alert("Vše přidáno!");
						window.location.replace(cartLink[currentSite]);
					}
					else {
						stopLoading();
						alert(`Nepodařilo se přidat položky (${errors.length}). Detaily najdete v konzoli (F12).`);
						console.log("Položky, které nešlo přidat:",errors.join(", "));
					}
				}
			})
			.catch(err => {
				stopLoading();
				alert(`Došlo k chybě. V konzoli (F12) najdete detaily.`);
				console.log(err);
			});
		}
		sendReq(0);
	}
	if (data) {
		cartData = JSON.parse(b64Decode(data));
		if(confirm(`Počet položek v URL adrese: ${cartData.length+"\n"}Chcete je přidat do košíku?`)) {
			addItems(cartData);
		}
	}
	else {
		let enteredData = prompt("Zadejte kód košíku...");
		if (enteredData.includes("savedCart=")) {
			enteredData = enteredData.split("savedCart=")[1];
		}
		cartData = JSON.parse(b64Decode(enteredData)) || [];
		addItems(cartData);
	}
}
document.addEventListener("keydown",function(e) {
	if (e.shiftKey) {
		if (e.keyCode == 83) { // Shift+S
			saveItems();
		}
		if (e.keyCode == 76) { // Shift+L
			loadItems();
		}
	}
});

const saveButton = document.createElement("div");
saveButton.innerText = "💾";
Object.assign(saveButton.style, {
	"cursor": "pointer",
	"fontSize": "36px",
	"position": "fixed",
	"right": "72px",
	"bottom": "19px",
	"zIndex": "999",
	"textShadow": "0 0 5px rgba(0,0,0,0.64)"
});
document.body.appendChild(saveButton);
saveButton.title = "Uložit košík (Shift+S)";
saveButton.addEventListener("click",function(e) {
	saveItems();
});