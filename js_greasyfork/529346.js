// ==UserScript==
// @name         Quermed Filter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://queermed-deutschland.de/nach-empfehlungen-suchen/?filter=1*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license Luna-Lolita
// @downloadURL https://update.greasyfork.org/scripts/529346/Quermed%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/529346/Quermed%20Filter.meta.js
// ==/UserScript==

function qmRec() {
	console.log("qm rec");

	var newTheras = [];

	var openTheras = [];

	var priv = createLiElement("privat");

	var ges = createLiElement("gesetzlich");

	var ges_priv = createLiElement("gesetzlich_privat");

	var privatTheras = [ ];

	var gesetzlichTheras = [ ];

	var gesetzlich_privat_theras = [ ];

	function createLiElement(elementTitle) {
		var ul = document.createElement('li');
		ul.setAttribute('id',elementTitle + "Li");
		ul.setAttribute('style','transition-delay: 0s');
		ul.classList.add('list__item');
		ul.classList.add(elementTitle);
		ul.innerHTML = '<div class="list__item-header header"><div class="header__arrows"></div><h2 class="header__title">' + elementTitle + '</h2></div>';
		ul.addEventListener("click", function(e) {
			let newElements = document.querySelectorAll('.qm-recommendations__list.'+elementTitle+' .list__item.'+elementTitle);
			for (let i = 0; i < newElements.length; ++i) {
				newElements[i].classList.toggle('hide');
			}
			document.querySelector('#gesetzlichLi').classList.toggle('hide', false);
			document.querySelector('#privatLi').classList.toggle('hide', false);
			document.querySelector('#gesetzlich_privatLi').classList.toggle('hide', false);
		});
		return ul;
	}

	function createUlElement(elementTitle) {
		var ul = document.createElement('ul');
		ul.setAttribute('id',elementTitle + "Ul");
		ul.classList.add('qm-recommendations__list');
		ul.classList.add('list');
		ul.classList.add(elementTitle);
		ul.addEventListener("click", function(e) {
			ul.classList.toggle('hide');
		});
		return ul;
	}

	function addElementQmRec(elementTitle) {
		var target = document.querySelector("#content .qm-recommendations .qm-recommendations__container .qm-recommendations__list");
		let elementul = createUlElement(elementTitle);
		target.parentNode.insertBefore(elementul, target.nextSibling);
		return document.querySelector("#"+elementTitle + "Ul");
	}

	function setTherasOpen() {
		var haveTheras = true;

		while(haveTheras) {
			var theras = document.querySelectorAll("#content .qm-recommendations li.list__item:not(.list__item--open)");

			for (let i = 0; i < theras.length; ++i) {

				var thera = theras[i].querySelector("button.header__button");

				thera.click();
			}

			theras = document.querySelectorAll("#content .qm-recommendations li.list__item:not(.list__item--open)");

			haveTheras = theras.length > 0;
		}
	}

	function setTherasClose() {
		var haveTheras = true;

		while(haveTheras) {
			var theras = document.querySelectorAll("#content .qm-recommendations li.list__item.list__item--open");

			for (let i = 0; i < theras.length; ++i) {

				var thera = theras[i].querySelector("button.header__button");

				thera.click();
			}

			theras = document.querySelectorAll("#content .qm-recommendations li.list__item.list__item--open");

			haveTheras = theras.length > 0;
		}
	}

	function start() {
		setTherasOpen();

		document.querySelector("#content .qm-recommendations .qm-recommendations__list").classList.toggle('first-tree', true);

		var theras = document.querySelectorAll("#content .qm-recommendations li.list__item");

		for (let i = 0; i < theras.length; ++i) {

			var thera = theras[i];

			var theraContent = thera.querySelector(".list__item-content.content .content__row-top");

			var theraContentFurther = theraContent.querySelector(".content__container--further-informations");

			if (theraContentFurther === null) {
				newTheras.push(thera);
				continue;
			}

			var theraContentFurtherAll = theraContentFurther.querySelectorAll(".content__container-item");

			var furtherListTheraLove = [
				"Terminvereinbarung online (per eigener Website oder Ähnlichem)",
				"Videosprechstunde möglich (Webcam)",
			]

			var furtherListTheraLoveMustFound = furtherListTheraLove.length - 1;
			var furtherListTheraLoveFounded = 0;

			for (let j = 0; j < theraContentFurtherAll.length; ++j) {
				if ( furtherListTheraLove.indexOf(theraContentFurtherAll[j].innerHTML) !== -1 ) {
					furtherListTheraLoveFounded++;
				}
			}

			if ( furtherListTheraLoveFounded < furtherListTheraLoveMustFound) {
				newTheras.push(thera);
				continue;
			}

			var theraContentEmphohlen = theraContent.querySelector(".content__container--groups-of-people");

			if (theraContentEmphohlen === null) {
				newTheras.push(thera);
				continue;
			}

			var theraContentEmphohlenAll = theraContentEmphohlen.querySelectorAll(".content__container-item");

			var emphohlenListTheraLove = [
				"nonbinär",
				">trans*",
				"trans* Männlichkeiten",
				"männlich gelesen",
				"weiblich gelesen",
				"queer / lesbisch / schwul / bi / pan",
				"neurodivergent",
				"polyamor",
			];

			var emphohlenListTheraLoveMustFound = emphohlenListTheraLove.length - 4;
			var emphohlenListTheraLoveFounded = 0;
			for (let j = 0; j < theraContentEmphohlenAll.length; ++j) {
				if ( emphohlenListTheraLove.indexOf(theraContentEmphohlenAll[j].innerHTML) !== -1) {
					emphohlenListTheraLoveFounded++;
				}
			}

			if ( emphohlenListTheraLoveFounded < emphohlenListTheraLoveMustFound) {
				newTheras.push(thera);
				continue;
			}

            const queryString = window.location.search;

            const urlParams = new URLSearchParams(queryString);

            var theraKontakt = null;

            if (!urlParams.has('no_email')) {
                theraKontakt = theraContent.querySelector(".content__contact");

                if (theraKontakt === null) {
                    newTheras.push(thera);
                    continue;
                }

                var theraKontaktAll = theraContentEmphohlen.querySelectorAll(".content__contact-item");

                for (let j = 0; j < theraKontaktAll.length; ++j) {
                    if ( theraKontaktAll[j].classList.indexOf('content__contact-item--email') === -1 ) {
                        newTheras.push(thera);
                        continue;
                    }
                }
            }

			var theraContentSprachen = theraContent.querySelector(".content__container--languages");

			if (theraContentSprachen === null) {
				newTheras.push(thera);
				continue;
			}

			var theraContentSprachenAll = theraContentEmphohlen.querySelectorAll(".content__container-item");

			var sprachenListTheraLove = [
				"Deutsch",
				"Englisch",
			];

			var sprachenListTheraLoveMustFound = sprachenListTheraLove.length - 1;
			var sprachenListTheraLoveFounded = 0;
			for (let j = 0; j < theraContentSprachenAll.length; ++j) {
				if ( sprachenListTheraLove.indexOf(theraContentSprachenAll[j].innerHTML) !== -1  ) {
					sprachenListTheraLoveMustFound++;
				}
			}

			if ( sprachenListTheraLoveMustFound < sprachenListTheraLoveMustFound ) {
				newTheras.push(thera);
				continue;
			}

			var theraKassenPrivat = theraContent.querySelector(".content__container--insurance-status");

			if (theraKassenPrivat === null) {
				newTheras.push(thera);
				continue;
			}

			var theraContentKassenPrivatAll = theraKassenPrivat.querySelectorAll(".content__container-item");

			var kasseListTheraLove = [
				"gesetzlich",
				"privat",
			];

			let hide = false;
			if (thera.classList.contains('list__item--open')) {
				hide = false;
			} else {
				hide = true;
			}
			thera.classList.toggle('first-tree', true);

			for (let j = 0; j < theraContentKassenPrivatAll.length; j += 2) {
				let cur = theraContentKassenPrivatAll[j].innerHTML;
				let nex = (j + 1 < theraContentKassenPrivatAll.length) ? (theraContentKassenPrivatAll[j+1].innerHTML) : "ssssssssssssssssssssssssssss";
			    let isg = kasseListTheraLove[0].indexOf(cur) !== -1  || kasseListTheraLove[0].indexOf(nex) !== -1;
				let isp = kasseListTheraLove[1].indexOf(cur) !== -1  || kasseListTheraLove[1].indexOf(nex) !== -1;
				let isb = isg && isp;
				if (isb) {
					thera.classList.toggle('gesetzlich_privat', true);
					gesetzlich_privat_theras.push(thera);
				} else if(isg) {
					thera.classList.toggle('gesetzlich', true);
					gesetzlichTheras.push(thera);
				} else if(isp) {
					thera.classList.toggle('privat', true);
					privatTheras.push(thera);
				}
			}

			openTheras.push(thera);
		}

		setTherasClose();

		let gesetzlich_privat = addElementQmRec("gesetzlich_privat");

		gesetzlich_privat.classList.toggle('gesetzlich_privat', true);

		gesetzlich_privat.classList.toggle('second', true);

		for (let i = 0; i < gesetzlich_privat_theras.length; i++) {
			gesetzlich_privat.appendChild(gesetzlich_privat_theras[i]);
		}

		let gesetzlich = addElementQmRec("gesetzlich");

		gesetzlich.classList.toggle('gesetzlich', true);

		gesetzlich.classList.toggle('second', true);

		for (let i = 0; i < gesetzlichTheras.length; i++) {
			gesetzlich.appendChild(gesetzlichTheras[i]);
		}

		let privat = addElementQmRec("privat");

		privat.classList.toggle('privat', true);

		privat.classList.toggle('second', true);

		for (let i = 0; i < privatTheras.length; i++) {
			privat.appendChild(privatTheras[i]);
		}

		console.log(theras);

		for (let i = 0; i < newTheras.length; ++i) {
			newTheras[i].style="display: none";
			newTheras[i].remove();
		}

		let newT = document.querySelector("#content .qm-recommendations ul.qm-recommendations__list.list[data-number-first-loaded-items]");
		newT.prepend(ges_priv);
		newT.prepend(ges);
		newT.prepend(priv);

		const style = document.createElement("style");
        style.innerHTML = `
				.qm-recommendations__list.gesetzlich_privat .list__item.gesetzlich_privat.hide,
				.qm-recommendations__list.gesetzlich .list__item.gesetzlich.hide,
				.qm-recommendations__list.privat .list__item.privat.hide {
					display: none;
				};
		`
		document.head.appendChild(style);
		let newElements = document.querySelectorAll('.qm-recommendations__list.gesetzlich_privat .list__item.gesetzlich_privat');
        for (let i = 0; i < newElements.length; ++i) {
            newElements[i].classList.toggle('hide', true);
        }
		newElements = document.querySelectorAll('.qm-recommendations__list.gesetzlich .list__item.gesetzlich');
        for (let i = 0; i < newElements.length; ++i) {
            newElements[i].classList.toggle('hide', true);
        }
		newElements = document.querySelectorAll('.qm-recommendations__list.privat .list__item.privat');
        for (let i = 0; i < newElements.length; ++i) {
            newElements[i].classList.toggle('hide', true);
        }
		document.querySelector('#gesetzlichLi').classList.toggle('hide', false);
		document.querySelector('#privatLi').classList.toggle('hide', false);
		document.querySelector('#gesetzlich_privatLi').classList.toggle('hide', false);
	}
	start();
};

function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutations, observer) => {
        const element = document.querySelector(selector);
        if (element) {
            observer.disconnect();
            callback(element);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

// Usage

$(document).ready(function() {
    waitForElement('#BorlabsCookieBox .brlbs-cmpnt-dialog-box-entrance .brlbs-cpmnt-dialog-box-buttons .brlbs-btn-accept-all', function(element) {
        console.log('Element exists:', element);
        $(element).trigger("click");
    });
    waitForElement('#content', function(element) {
        console.log('Element exists:', element);
    });
    waitForElement('.filter__settings', function(element) {
        console.log('Element exists:', element);
    });
    waitForElement('.filter__search-container', function(element) {
        console.log('Element exists:', element);
    });
    waitForElement('.filter__settings .filter__search-container--show-field', function(element) {
        console.log('Element exists:', element);
    });
    waitForElement('.filter__settings .filter__search-container--show-field', function(element) {
        console.log('Element exists:', element);
         let filter_search_button = element.querySelector("button.filter__search-button");
         let filter_search_field = element.querySelector("div.filter__search-field-container .filter__search-field");
         filter_search_field.setAttribute('value', 'Psychotherapie');
         $(filter_search_button).trigger("click");
    });
    waitForElement('.filter__value-button.button[data-id="qm_category-psychotherapie"]', function(element) {
        console.log('Element exists:', element);
        $(element).trigger("click");
    });
    waitForElement('#content .load-more', function(element) {
        console.log('Element exists:', element);
        let load_more = element;
        let content = document.querySelector("#content");
        window.reloadInterval = 0;
        window.currentScrollHeight = document.body.scrollHeight;
        function reloadLoadMore() {
            document.querySelector("#content .load-more button").click();
            if (window.currentScrollHeight == document.body.scrollHeight) {
                clearInterval(window.reloadInterval);
                qmRec();
            }
            window.currentScrollHeight = document.body.scrollHeight;
            window.scrollTo(0, window.currentScrollHeight);
        };
        window.reloadInterval = setInterval(reloadLoadMore, 1000);
    });
});