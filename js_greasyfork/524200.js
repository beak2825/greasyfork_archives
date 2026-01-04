// ==UserScript==
// @name							Wykop XS - Obrazki+
// @name:pl							Wykop XS - Obrazki+
// @name:en							Wykop XS - Images+

// @version							3.0.81

// @description 					Otwiera obrazki z wykopu poprzez www.wykopx.pl - z dodatkowymi funkcjami. Otwórz dowolny obrazek na wykopie i zamień w adresie URL 'wykop.pl' na 'wykopx.pl'. Obrazek możesz obrócić, odbić lustrzanie, udostępnić, skopiować, zapisać, włączyć pełny ekran. Oprócz przycisków masz też wygodne skróty klawiaturowe do każdej z tych akcji.  | Wejdź na Mikroczat: https://mikroczat.pl Projekt Wykop X: https://wykopx.pl Wiki projektu Wykop X: https://wiki.wykopx.pl
// @description:en 					Otwiera obrazki z wykopu poprzez www.wykopx.pl - z dodatkowymi funkcjami. Otwórz dowolny obrazek na wykopie i zamień w adresie URL 'wykop.pl' na 'wykopx.pl'. Obrazek możesz obrócić, odbić lustrzanie, udostępnić, skopiować, zapisać, włączyć pełny ekran. Oprócz przycisków masz też wygodne skróty klawiaturowe do każdej z tych akcji.  | Wykop Live Chat: https://mikroczat.pl | Wykop X Project: https://wykopx.pl | Wiki: https://wiki.wykopx.pl


// Chcesz wesprzeć projekt Wykop X? Postaw kawkę:
// @contributionURL					https://buycoffee.to/wykopx

// @author							Wykop X <wykopx@gmail.com>






// @run-at document-start

// @match							https://wykop.pl/cdn/*
// @supportURL						http://wykop.pl/tag/wykopx
// @namespace						Violentmonkey Scripts
// @compatible						chrome, firefox, opera, safari, edge
// @license							No License
// @icon							https://www.google.com/s2/favicons?sz=64&domain=wykop.pl


// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/524200/Wykop%20XS%20-%20Obrazki%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/524200/Wykop%20XS%20-%20Obrazki%2B.meta.js
// ==/UserScript==
document.documentElement.style.backgroundColor = "rgb(18, 18, 20)";
document.documentElement.style.borderTop = "48px solid rgb(60, 60, 60)";

const body = document.querySelector("body");
if (body)
{
	const img = body.querySelector("img");
	img.style.display = "none";
	img.style.opacity = "0";
	body.style.backgroundColor = "rgb(18, 18, 20)";
	body.style.overflow = "hidden";
}
if (unsafeWindow.location.href.startsWith("https://wykop.pl/cdn/"))
{
	unsafeWindow.location.replace(unsafeWindow.location.href.replace("https://wykop.pl", "https://wykopx.pl"));
}



