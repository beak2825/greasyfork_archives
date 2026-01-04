// ==UserScript==
// @name         Spend Elon Fortune Hack Menu/Mod Menu
// @namespace    https://www.spend-elon-fortune.com/
// @version      0.21
// @description  Yup. Have fun messing around with stuff.
// @author       You
// @match        https://www.spend-elon-fortune.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spend-elon-fortune.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474430/Spend%20Elon%20Fortune%20Hack%20MenuMod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/474430/Spend%20Elon%20Fortune%20Hack%20MenuMod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

  const htmlContent = `
<style>

.window {
	position: fixed;
	width: 400px;
	height: 250px;
	border-radius: 10px;
	border: none;
	box-shadow: 1px 1px 4px rgba(0,0,0,0,0.9), -1px 1px 4px rgba(0,0,0,0,0.9);
	background: #fff;
	z-index: 99999999999999999;
}

.window-content {
	background: #000;
	color: #fff;
	height: 100%;
	font-family: monospace;
	padding: 5px;
	font-size: 14px;
}

.window-input {
	display: block;
	font-family: monospace;
	width: calc(100% - 12px);
	background-color: #000;
	color: #fff;
	border: 4px solid #fff;
	border-bottom-right-radius: 5px;
	border-bottom-left-radius: 5px;
	padding: 2px;
	position: relative;
	bottom: 0;
	left: 0;
	right: 0;
	outline: 0;
}
.window > p, b {
margin: 0;
padding: 0;
}
a {
color: white;
}

.window-top, .window-top-no-bind {
	cursor: move;
	text-align: right;
	height: 20px;
	border-bottom: 1px solid rgba(0,0,0,0.5);
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
	padding: 5px;
	background-color: #ddd;
}

.window-top-no-bind {
	cursor: inherit;
}

.round {
	height: 16px;
	width: 16px;
	border-radius: 50%;
	border: none;
	margin-right: 6px;
	box-shadow: 1px 1px 2px #000;
}

.green {
	background-color: limegreen;
}

.yellow {
	background-color: yellow;
}

.red {
	cursor: pointer;
	background-color: red;
}

#myWindow {
	z-index: 999;
}

#myWindow2 {
	top: 0;
	left: 500px;
}
.coninput {
border: unset;
font-family: monospace;
color: white;
background-color: unset;
}
textarea:focus, input:focus{
    outline: none;
}
.button {
background-color: black;
font-family: monospace;
color: white;
width: 35px;
height: 35px;
font-size: 20px;
	position: fixed;
	z-index: 99999999999999999;
}

</style>
<a href='javascript:(function() {
		const menu = document.getElementById("modmenu");
		if (menu.style.display == "none") {
		menu.style.display = "unset";
		} else {
		menu.style.display = "none";
		}
		})();' style="text-decoration: none;">
<div class="button">
<p style="padding-left: 12.5px;padding-top: 7.5px;">$</p>
</div>
</a>
<br><br>
<div id="modmenu" class="window" style="display: none;">
	<div class="window-content">
		&gt; Spend Elon's Fortune Mod Menu
		<div style="width: 100%;height: 2px;background-color:white;margin-top:10px;margin-bottom:10px;"></div>
		<div style="border:1px solid white;margin:0;padding:0;width:170px;float:left;">
		<b>Set Money</b>&nbsp;<i class="fa-regular fa-circle-info" title="Allows you to set your amount of money that you have. Amount cannot be in commas like 2,314, instead do 2314."></i>
		<br>
		Amount | <input class="coninput" id="money" style="width: 40%;" /><br><a href='javascript:(function() {
		const amount = Number(document.getElementById("money").value);
		elonFortune = amount;
		updateTotalAndPercentage();
		})();'>[ Set ]</a>
		</div>
		<div style="border:1px solid white;margin:0;padding:0;width:200px;float:right;">
		<b>Bulk Buy</b>&nbsp;<i class="fa-regular fa-circle-info" title="Allows you to buy items in amounts. After 700-1000 or so amounts it will begin to lag for the items to buy in the specified amounts."></i>
		<br>
		Product | <input class="coninput" id="product" style="width: 50%;"/><br>Times | <input class="coninput" id="times" style="width: 50%;"/><br><a href="javascript:(function() {
		const product = document.getElementById('product').value;
		const times = Number(document.getElementById('times').value);
		const divElements = document.querySelectorAll('div.element');
		function repeat(func, timez) {
    func();
    timez && --timez && repeat(func, timez);
	}

divElements.forEach(divElement => {
  const paragraphElement = divElement.querySelector('p#name');

  if (paragraphElement && paragraphElement.textContent === product) {
    const ele = divElement.querySelector('div.buyAndSellContainer');
	repeat(function () { buyItem(ele); }, times);
  }
});
		})();">[ Buy ]</a>
		</div>
				<div style="border:1px solid white;margin:0;margin-top:10px;padding:0;width:170px;float:left;">
		<b>Bulk Sell</b>&nbsp;<i class="fa-regular fa-circle-info" title="Allows you to sell items in amounts. After 700-1000 or so amounts it will begin to lag for the items to sell in the specified amounts. Amount cannot be in commas like 2,314, instead do 2314."></i>
		<br>
		Product | <input class="coninput" id="product2" style="width: 50%;"/><br>Times | <input class="coninput" id="times2" style="width: 50%;"/><br><a href="javascript:(function() {
		const product = document.getElementById('product2').value;
		const times = Number(document.getElementById('times2').value);
		const divElements = document.querySelectorAll('div.element');
		function repeat(func, timez) {
    func();
    timez && --timez && repeat(func, timez);
	}

divElements.forEach(divElement => {
  const paragraphElement = divElement.querySelector('p#name');

  if (paragraphElement && paragraphElement.textContent === product) {
    const ele = divElement.querySelector('div.buyAndSellContainer');
	repeat(function () { sellItem(ele); }, times);
  }
});
		})();">[ Sell ]</a>
		</div>
						<div style="border:1px solid white;margin:0;margin-top:10px;padding:0;width:200px;float:right;">
		<b>Add Custom Item</b>&nbsp;<i class="fa-regular fa-circle-info" title="Allows you to add another item for you to buy/sell. Price cannot be in commas like 2,314, instead do 2314."></i>
		<br>
		Name | <input class="coninput" id="prname" style="width: 50%;"/><br>Image URL | <input class="coninput" id="primage" style="width: 50%;"/><br>Price | <input class="coninput" id="prprice" style="width: 50%;"/><br><a href="javascript:(function() {
  const name = document.getElementById('prname').value;
  const image = document.getElementById('primage').value;
  const items = document.getElementById('allElements');
  const price = Number(document.getElementById('prprice').value);

  const elementDiv = document.querySelector('.element');

  const clonedDiv = elementDiv.cloneNode(true);
  const namep = clonedDiv.querySelector('#name');
  namep.innerText = name;
  const pricep = clonedDiv.querySelector('#price');
  pricep.innerText = 'USD ' + price.toLocaleString('en-US');
  const img = clonedDiv.querySelector('img');
  img.src = image;
  img.alt = name;
  const basc = clonedDiv.querySelector('.buyAndSellContainer');
  basc.setAttribute('data-price', price);
  items.appendChild(clonedDiv);

})();">[ Add ]</a>
  	</div>
	<div style="border:1px solid white;margin:0;margin-top:10px;padding:0;width:170px;float:left;">
		<b>Remove Item</b>&nbsp;<i class="fa-regular fa-circle-info" title="Allows you to remove items, if you for example mess up your custom item."></i>
		<br>
		Product | <input class="coninput" id="product3" style="width: 50%;"><br><a href="javascript:(function() {
		const product = document.getElementById('product3').value;
		const divElements = document.querySelectorAll('div.element');
divElements.forEach(divElement => {
  const paragraphElement = divElement.querySelector('p#name');

  if (paragraphElement &amp;&amp; paragraphElement.textContent === product) {
	divElement.remove();
  }
});
		})();">[ Remove ]</a>
		</div>
	</div>
</div>`;
document.head.insertAdjacentHTML('afterbegin', '<link rel="stylesheet" href="https://kit-pro.fontawesome.com/releases/v6.4.0/css/pro.min.css">');
document.body.insertAdjacentHTML('afterbegin', htmlContent);
})();