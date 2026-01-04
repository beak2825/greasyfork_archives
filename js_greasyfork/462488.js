// ==UserScript==
// @name         FitGirl search by genre or size
// @version      1.0
// @license      MIT
// @description  Search for Genres or Size on https://fitgirl-repacks.site/
// @author       TheEmptynessProject
// @match        https://fitgirl-repacks.site/*
// @namespace    https://github.com/TheEmptynessProject/fitgirl-search-genreORsize
// @downloadURL https://update.greasyfork.org/scripts/462488/FitGirl%20search%20by%20genre%20or%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/462488/FitGirl%20search%20by%20genre%20or%20size.meta.js
// ==/UserScript==
function GET_storage_underX(sizevar) {
	const url = JSON.parse(localStorage.getItem("urlArray")) || [];
	const retri = JSON.parse(localStorage.getItem("sizeArray")) || [];
	if (retri == []) {
		return null;
	}
	for (let i = 0; i < retri.length; i++) {
		if (retri[i] <= sizevar) {
			console.log(`${retri[i]}: ${url[i]}\n`)
		}
	}
}

function convertToMB(sizevar) {
	const regex = /(\d+(\.\d+)?)\s*(GB|MB)/i;
	const match = sizevar.match(regex);

	if (match) {
		const value = parseFloat(match[1]);
		const unit = match[3].toUpperCase();

		if (unit === 'GB') {
			return value * 1024;
		} else {
			return value;
		}
	} else {
		return null;
	}
}

(function() {
	'use strict';
	var myArray = JSON.parse(localStorage.getItem('urlArray')) || []
	var sizeArray = JSON.parse(localStorage.getItem('sizeArray')) || []
	const genresWanted = ["Open World"]; //Change to wanted genres, leave empty to search for size
	const maxSize = convertToMB('5 GB') //Change to search for wanted size
	const packsizeBool = true; //Change to check either repack size (true) or real size (false)
	const posts = document.getElementsByClassName("post");
	let stopScript = false;
	for (const post of posts) {
		if (stopScript) {
			break;
		}
		const content = post.getElementsByClassName("entry-content");
		for (const elem of content) {
			if (elem.childNodes.length > 5) {
				const temp = elem.childNodes[3].childNodes;
				if (temp.length > 5) {
					const link = post.querySelector('.entry-header').querySelector('h1.entry-title a').href;
					const child = post.querySelector('.entry-content > p').querySelectorAll('strong');;
					var realsize;
					var packsize;
					for (const xxx of child) {
						if (xxx.previousSibling.textContent.toLowerCase().includes('original')) {
							realsize = convertToMB(xxx.innerHTML)
						} else if (xxx.previousSibling.textContent.toLowerCase().includes('pack')) {
							packsize = convertToMB(xxx.innerHTML)
						}
					}
					if (genresWanted.length == 0) {
						if (packsizeBool) {
							if (packsize <= maxSize) {
								sizeArray.push(packsize)
								myArray.push(link);
								localStorage.setItem('urlArray', JSON.stringify(myArray));
								localStorage.setItem('sizeArray', JSON.stringify(sizeArray))
							}
						} else {
							if (realsize <= maxSize) {
								sizeArray.push(realsize)
								myArray.push(link);
								localStorage.setItem('urlArray', JSON.stringify(myArray));
								localStorage.setItem('sizeArray', JSON.stringify(sizeArray))
							}
						}
					} else {
						for (const genre of genresWanted) {
							if (temp[3].outerText.toLowerCase().includes(genre.toLowerCase())) {
								if (packsizeBool) {
									sizeArray.push(packsize)
								} else {
									sizeArray.push(realsize)
								}
								myArray.push(link);
								localStorage.setItem('urlArray', JSON.stringify(myArray));
								localStorage.setItem('sizeArray', JSON.stringify(sizeArray))
							} else {
								post.style.display = "none";
							}
						}
					}
				}
			}
		}
	}
	const pageLinks = document.querySelectorAll('a.page-numbers');
	let maxPageNum = 0;
	for (let i = 0; i < pageLinks.length; i++) {
		if (!(isNaN(pageLinks[i].innerHTML))) {
			if (parseInt(pageLinks[i].innerHTML) > maxPageNum) {
				maxPageNum = pageLinks[i].innerHTML;
			}
		}
	}
	let underX = document.createElement('button');
	let underInput = document.createElement('input');
	let userInput
	underInput.style.borderBottom = '5px solid #000';
	underInput.style.borderRadius = '15px';
	underInput.className = 'hoverEffect'
	underInput.setAttribute("type", "text");
	underInput.style.color = 'gold'
	underInput.style.backgroundColor = '#363636'
	//underInput.style.zIndex = '99'
	underInput.style.position = 'fixed'
	underInput.style.bottom = '20px'
	underInput.style.width = '250px'
	underInput.style.height = '150px'
	underInput.style.left = '570px';
	underInput.addEventListener('change', function() {
		userInput = underInput.value;
	});
	underX.innerHTML = 'Get storage values lower than:';
	underX.style.color = 'white';
	underX.className = 'hoverEffect'
	underX.style.borderBottom = '5px solid #000';
	underX.style.borderRadius = '15px';
	underX.style.backgroundColor = 'purple';
	//underX.style.zIndex = '99';
	underX.style.position = 'fixed';
	underX.style.bottom = '20px';
	underX.style.width = '250px';
	underX.style.height = '150px';
	underX.style.left = '320px';
	underX.addEventListener('click', function() {
		GET_storage_underX(userInput)
	});
	let button = document.createElement('button');
	button.innerHTML = 'Stop Script';
	button.style.borderBottom = '10px solid #000';
	button.style.borderRadius = '15px';
	button.style.color = 'white';
	button.style.backgroundColor = 'purple';
	//	button.style.zIndex = '99';
	button.style.position = 'fixed';
	button.style.bottom = '20px';
	button.style.width = '300px';
	button.style.height = '200px';
	button.style.left = '20px';
	button.className = 'hoverEffect'
	button.addEventListener('click', function() {
		stopScript = true;
		const retrievedArray = JSON.parse(localStorage.getItem("urlArray")) || JSON.parse(localStorage.getItem("sizeArray")) || [];
		for (let i = 0; i < retrievedArray.length; i++) {
			console.log(retrievedArray[i] + "\n");
		}
	});
	let continueB = document.createElement('button');
	continueB.innerHTML = 'Continue Script';
	continueB.style.color = 'white';
	continueB.style.borderBottom = '10px solid #000';
	continueB.style.borderRadius = '15px';
	continueB.style.backgroundColor = 'blue';
	//	continueB.style.zIndex = '99';
	continueB.className = 'hoverEffect'
	continueB.style.position = 'fixed';
	continueB.style.bottom = '20px';
	continueB.style.width = '300px';
	continueB.style.height = '200px';
	continueB.style.right = '20px';
	continueB.addEventListener('click', function() {
		document.location.reload();
	});
	let clear = document.createElement('button');
	clear.innerHTML = 'Clear Storage';
	clear.style.color = 'white';
	clear.style.backgroundColor = 'red';
	//clear.style.zIndex = '99';
	clear.style.borderBottom = '10px solid #000';
	clear.style.borderRadius = '15px';
	clear.style.position = 'fixed';
	clear.style.bottom = '20px';
	clear.style.width = '300px';
	clear.style.height = '200px';
	clear.className = 'hoverEffect'
	clear.style.right = '320px';
	clear.addEventListener('click', function() {
		localStorage.removeItem('urlArray');
		localStorage.removeItem('sizeArray');
		alert("Cleared Storage")
	});
	document.body.appendChild(button);
	document.body.appendChild(continueB);
	document.body.appendChild(clear);
	document.body.appendChild(underX);
	document.body.appendChild(underInput);

	var styleElement = document.createElement("style");
	styleElement.innerHTML = `
.hoverEffect {
  border: 1px solid #000;
  transition: all 0.3s ease;
  z-index:2;
}

.hoverEffect:hover {
  transform: scale(1.1);
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 3;
}
`
	document.head.appendChild(styleElement);

	const currentPage = parseInt(document.location.href.match(/\/page\/(\d+)\//)?.[1]) || 1;
	if (currentPage < maxPageNum) {
		setTimeout(() => {
			if (!stopScript) {
				document.location.href = `https://fitgirl-repacks.site/page/${currentPage+1}`;
				console.log(myArray)
			}
		}, "2000");

	}
})();