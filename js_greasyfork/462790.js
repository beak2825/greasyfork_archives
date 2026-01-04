// ==UserScript==
// @name         NP messages
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Auto Complete Nova Poshta New invoice
// @author       e-c
// @license MIT
// @match        https://new.novaposhta.md/invoice-form/invoice/new*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462790/NP%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/462790/NP%20messages.meta.js
// ==/UserScript==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let data = {};
    let NP = {ramburs:0, id:0};
    let errorOrganisation = '!ERROR loggin with ';

	window.opener.postMessage('ready', "*");

	window.addEventListener('message', event => {
	    // IMPORTANT: check the origin of the data!
	    if (event.origin.startsWith('http://robotica.loc') || event.origin.startsWith('https://robotica.md') || event.origin.startsWith('http://ecatalog.loc') || document.referrer === 'https://e-catalog.md/') {/*https://robotica.md*/ /*http://robotica.loc*/
	        // The data was sent from your site.
	        // Data sent with postMessage is stored in event.data:
            // copyToClipboard(event.data);
            // event.source.postMessage(location.href, event.origin);
            console.log(event.data);
            data = event.data;
			setTimeout(function(){
            	fillInput(document.getElementById('mat-input-9'), data.total);
			},400)
	    } else {
	        // The data was NOT sent from your site!
	        // Be careful! Do not use it. This else branch is
	        // here just for clarity, you usually shouldn't need it.
	        return;
	    }
	});

	document.body.addEventListener("keydown", function(e){
	    if (e.keyCode === 83 && e.altKey) {
			window.opener.postMessage("alt+s", "*");
	    }
	});

	setTimeout(function(){
		fillInput(document.getElementById('mat-input-4'), 1);
		fillInput(document.getElementById('mat-input-5'), 10);
		fillInput(document.getElementById('mat-input-6'), 10);
		fillInput(document.getElementById('mat-input-7'), 10);
		fillInput(document.getElementById('mat-input-8'), 'Componente electronice');
		if (data.delivery == null) data.delivery = 0;

		if (document.referrer === 'http://ecatalog.loc/' || document.referrer === 'https://e-catalog.md/') {
			document.querySelector('#mat-radio-12 label').click();
			document.querySelector('#mat-radio-15 label').click();
		}


		let btn = document.querySelector('.bottom-panel__buttons button');
		btn.addEventListener("click", function () {
			setTimeout(function(){
				let btnCreate = document.querySelectorAll('.bottom-panel__buttons button')[1];
				if (btnCreate) {
					// we are on the second page and

					// check if we are logged into right user
					let organizationName = document.querySelector('#mat-input-20').value;
					if ((document.referrer === 'http://ecatalog.loc/' || document.referrer === 'https://e-catalog.md/') && organizationName !== 'Smart Electro Trade SRL') {
						confirm(errorOrganisation + 'Smart Electro Trade');
						return location.href = 'https://new.novaposhta.md/cabinet/invoice/created';
					}

					if ((document.referrer === 'http://robotica.loc/' || document.referrer === 'https://robotica.md/') && organizationName !== 'Fix It SRL') {
						confirm(errorOrganisation + 'FIX IT');
						return location.href = 'https://new.novaposhta.md/cabinet/invoice/created';
					}


					fillInput(document.getElementById('mat-input-15'), data.phone);
					fillInput(document.getElementById('mat-input-16'), 'Anonim');
					fillInput(document.getElementById('mat-input-17'), 'Anonim');
					document.querySelector('#mat-radio-21 label').click();
					fillInput(document.getElementById('mat-input-26'), data.address);
					let rambursToggle = document.querySelector('#mat-slide-toggle-3 label');
					rambursToggle.addEventListener("click", function () {
						NP.ramburs = +!NP.ramburs;
						console.log(NP);
						if (!NP.ramburs) return;
						// w8 after click and add each product to ramburs
						setTimeout(function(){
							//mat-input-27
							fillInput(document.getElementById('mat-input-27'), parseInt(data.total)+parseInt(data.delivery));
							//open all products forms
							data.products.forEach((product) => {
								let all = document.querySelectorAll('.services-list__form button');
								all[all.length-1].click();
							});
							// fill all products info
							setTimeout(function(){
								data.products.forEach((product, index) => {
									let formRows = document.querySelectorAll('.form-row.box-with-controls');
									let lastListItem = formRows[formRows.length - (index+1)];
									let inputs = lastListItem.querySelectorAll('input');
									fillInput(inputs[0], product.name);
									fillInput(inputs[1], product.qty);
									fillInput(inputs[2], product.price);
								});
							},200)
						},500)
					});

					rambursToggle.click(); //ramburs slide

					btnCreate.addEventListener("click", function (e) {
						// w8 to see id
						var timer = setInterval(function(){
							var number = document.querySelector('.invoice-header__number');
							let organizationName = document.querySelector('#mat-input-20').value;
							if (number) {
								clearInterval(timer)
								NP.id = number.innerText;
								window.opener.postMessage(NP, "*");
							}
						},200);

					});
				}

			},500)
		});
	},500)




	function fillInput(elem, val) {
		elem.value=val;
		elem.dispatchEvent(new Event('input'));
	}
})();