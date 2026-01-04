// ==UserScript==
// @name       Pokaż obraz
// @namespace  https://www.google.*/*
// @version    1.6
// @description Pokaż obraz w google 
// @include    https://www.google.*/*
// @copyright  Arkatch
// @downloadURL https://update.greasyfork.org/scripts/38541/Poka%C5%BC%20obraz.user.js
// @updateURL https://update.greasyfork.org/scripts/38541/Poka%C5%BC%20obraz.meta.js
// ==/UserScript==
{
	window.onload = ()=>{
			return new Promise((resolve, reject)=>{
				let windowObserver = document.getElementById('irc_bg');
				let y = setInterval(()=>{
					if(windowObserver){
						clearInterval(y);
						resolve(windowObserver);
					}
				}, 500);
				}).then ((windowObserver)=>{
					let options = {
						subtree: true,
						childList: true
					};
					let newImg = mutations => {
						let imgs = windowObserver.querySelector('a[tabindex="0"] img.irc_mi');
						let src = imgs.getAttribute('src');
						if(src){
							try{
								document.getElementById('buttonImg').remove();
							}catch(e){}
							observer.disconnect();
								let table = imgs.closest('div.irc_c').querySelector('table[class="_FKw irc_but_r"] tbody tr');
								let td = document.createElement('td');
								let but = document.createElement('input');
								td.setAttribute('id', 'buttonImg');
								but.setAttribute('style',' background-color: #454545;border-style:none;color:#aaa;padding:5px;');
								but.setAttribute('type', 'button');
								but.setAttribute('value', 'Pokaż obraz');
								but.addEventListener('click', ()=>{
									window.open(src, "_blank");
								});
								td.appendChild(but);
								table.appendChild(td);
							observer.observe(windowObserver, options);
						}
					};
                    let observer = new MutationObserver(newImg);
					observer.observe(windowObserver, options);
				});
	};
}

