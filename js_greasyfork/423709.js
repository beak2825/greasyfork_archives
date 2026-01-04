// ==UserScript==
// @name         Brofist.io Blue Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blue theme for brofist.io
// @author       H336 and xX_DeDa_Xx
// @match        http://brofist.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423709/Brofistio%20Blue%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/423709/Brofistio%20Blue%20Theme.meta.js
// ==/UserScript==

let clr = (elem, color, isColor) => elem.style[isColor ? "color" : "background"] = color,
getElems = nm => Object.values(document.querySelectorAll(nm));
document.head.innerHTML += `<style>
body {background: #000000}
div {color: #fff !important}
</style>`;

var int = setInterval(() => {
	getElems(".title").map(x => clr(x, "#000000"));
	getElems(".subSection").map(x => clr(x, "#000000"));

	if(location.href == "http://brofist.io/editor/index.html" || location.href == "http://brofist.io/logs.html" || location.href == "http://brofist.io/editor/tutorial.html") {
		clearInterval(int);
		return
	};

	if(!getElems("div").filter(x => x.style.background == "rgb(245, 245, 245)")[0]) return
	else clearInterval(int);
	getElems("div").map(x => x.innerText == "OK" && x.click()); // Убрать нижнюю панель (с жёлтой кнопкой)

	getElems("div").map(x => x.style.background == "rgb(245, 245, 245)" && clr(x, "#000000")); // Верхняя панель
	getElems("div").map(x => x.style.cursor == "pointer" && clr(x, "#000000")) // Круглая кнопка с аватаром

	try {
		getElems("svg")[1].parentNode.style.background = "white"; // Код для входа сделать белым (т.к. по умолчанию он чёрный и ничего нельзя разглядеть)
	} catch {};
	getElems(".title").map(x => clr(x, "#000000"));

	getElems(".buttonsContainer").map(x => clr(x, "#000000")); // Всплывающие окошки
	getElems("div").filter(x => x.innerText.startsWith("Send us email") && clr(x, "000000")); // Окошко с восстановлением пароля
	getElems("table").map(x => clr(x, "#000000")); // Панелька

	getElems(".button").map(x => clr(x, "#000000")); // Кнопки "About" и "Rooms"

	setInterval(() => {
		getElems("#timer").map(x => clr(x, "#000"));
		getElems("#startTime").map(x => clr(x, "#000"));
		getElems("#mapCredits").map(x => clr(x, "#000"));
		getElems("#seekerDistance").map(x => clr(x, "#000"));

		getElems("div").filter(x => (x.style.background == "rgb(247, 247, 247)" || x.style.background == "rgb(30, 144, 255)") && (clr(x, "#000000"), clr(x, "00aaff", 1))); // Остальные панельки
		/twoPlayer|hideAndSeek|sandbox/g.test(location.href) &&
			getElems("div").filter(x => x.style.background == "blue" && (clr(x, "#000000"), clr(x, "#00aaff", 1)));

		getElems("img").map(x => ~x.src.search("flag") && clr(x, "#000000")); // Флаги
		getElems("a").map(x => x.innerText == "BROFIST.IO" ? clr(x, "#00aaff", 1) : clr(x, "#00aaff", 1)); // Ссылки
		getElems("div").filter(x => x.innerHTML).filter(x => "Publish PLAY Thanks for voting Vote Save save Sign In Sign Up Refresh Next Back".includes(x.innerHTML) && clr(x, "#00aaff")); // Кнопки

		getElems(".cross").map(x => clr(x, "#00aaff")); // Крестики
		getElems("div").map(x => (x.innerText == '>' || x.innerText == '<') && clr(x, "#00aaff")); // Переключатели

		try {
			clr(getElems("img")[0], "#00aaff") // Кнопка для меню (с 3-мя палочками)
		} catch {};
		location.href.match(/users|shop/) && getElems("div").map(x => "white rgb(253, 253, 253) rgb(255, 255, 255)".includes(x.style.background) && clr(x, "#000000")); // Все белые div'ы переделать в тёмные
	});

	try {
		getElems("img")[0].onmousemove = () => clr(getElems("img")[0], "#00aaff") // Кнопка для меню
	} catch {};
}, 100);