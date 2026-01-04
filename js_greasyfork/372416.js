// ==UserScript==
// @name Kellokortti.fi-korjauksia
// @version 1.3.2
// @description Käytettävyysparannuksia Kellokortti.fi -palveluun
// @namespace raina
// @match https://app.kellokortti.fi/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/372416/Kellokorttifi-korjauksia.user.js
// @updateURL https://update.greasyfork.org/scripts/372416/Kellokorttifi-korjauksia.meta.js
// ==/UserScript==


// Estää päävalikon sulkeutumisen rosvosektoria klikattaessa
[].forEach.call(document.querySelectorAll('.rmRootLink, .rmLink[href="#"]'), el => {
	el.addEventListener("click", ev => {
		ev.preventDefault()
		ev.stopPropagation();
	});
});


// Oma leimauspääte päävalikkoon, kyllä on hienot systeemit.
let paavali = document.querySelector('#ctl00_paavalikko1_mnumain ul.rmGroup');
let omaleima = paavali.querySelector('li:first-child').cloneNode("true");
omaleima.classList.remove("rmFirst");
omaleima.querySelector('a').href = "/app/omaleimaus";
omaleima.querySelector('a').onclick = function(ev) { ev.preventDefault(); ev.stopPropagation(); location.href = this.href; };
omaleima.querySelector('span').textContent = "Oma leimauspääte";
omaleima.addEventListener("mouseover", function() {
	let alaots = paavali.querySelector('.rmExpanded');
	if (!alaots) return;
	let alavali = paavali.querySelector('.rmExpanded + .rmSlide');
	alavali.querySelector('.rmGroup').style.transition = "left .45s cubic-bezier(0.165, 0.84, 0.44, 1), visibility 0s .45s";
	alavali.querySelector('.rmGroup').style.visibility = "hidden";
	alavali.querySelector('.rmGroup').style.left = "-199px";
	alavali.style.zIndex = "0";
	alavali.style.overflow = "hidden";
	alaots.parentElement.style.zIndex = "0";
	alaots.classList.remove("rmExpanded");
});
let what = function() {
	setTimeout(fuu => paavali.insertBefore(omaleima, paavali.querySelector('li:nth-child(3)')));
	document.querySelector('.rmRootLink').removeEventListener("mouseover", what);
};
document.querySelector('.rmRootLink').addEventListener("mouseover", what);


// Etusivun pikkuisten linkkien suurennus säiliöidensä mittoihin
if ("/app/" == location.pathname) {
	let style = document.createElement("style");
	style.textContent = `
		#oikeapalsta .box {
			position: relative;
		}

		#oikeapalsta .box table a {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			padding: 45% 1ex 1ex 1ex;
			box-sizing: border-box;
			transition: background .1s;
		}

		#oikeapalsta .box table a:hover {
			background: rgba(0, 0, 0, .05);
			transition-duration: 0s;
		}
	`;
	document.head.appendChild(style);
}


// Automaattinen viikko-näkymän päivitys, jos sivu on viimeksi ladattu yli 15min sitten
if ("/app/viikko" == location.pathname) {
	window.loaded = Date.now();
	window.addEventListener("focus", () => {
		if (Date.now() - window.loaded > 1000 * 60 * 15) {
			location.reload();
		}
	});
}
