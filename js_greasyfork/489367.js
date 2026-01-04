// ==UserScript==
// @name         Superjob resumes updater
// @version      0.1
// @grant        L.A.P.S. Lab
// @author       sovtem@gmail.com
// @include      https://superjob.ru/*
// @license      MIT
// @namespace    prolaps.ru
// @description  "На страницах домена https://superjob.ru/ скрипт запускается каждые 10 минут находит кнопки поднятия резюме и активирует их так, будто бы пользователь кликнул их мышкой. Логи смотрите в разделе [F12] -> [КОНСОЛЬ] -> 'ИНФО' "
// @downloadURL https://update.greasyfork.org/scripts/489367/Superjob%20resumes%20updater.user.js
// @updateURL https://update.greasyfork.org/scripts/489367/Superjob%20resumes%20updater.meta.js
// ==/UserScript==

console.info("Hello from L.A.P.S. Lab!");
console.info(
  "Хочешь разрабатывать с нами новые полезные приложения для пользователей, браузерные расширения, новые фичи? Заходи на сайт проекта https://prolaps.ru! Там можно найти всю требуемую информацию! Присоединяйся к команде!"
);

// init app
const w = window;
const d = document;
const targetClass = "f-test-button-Podnyat_v_poiske";
const intervalToUpdate = 1000 * 60 * 10;

const updater = () => {
	console.info(`updater wake up!`);
	const closeBanner = () => {
		const btns = d.querySelectorAll(".f-test-button-Obnovit");
		if(btns) {
			btns.forEach(btn => btn.click());
			console.info(`banner found, button clicked`);
			window.location.reload();
		} else {
			console.info(`banner button not found`);
		}
	}

	const all_btns = d.querySelectorAll("button");
	
	all_btns.forEach((btn)=> {
		if(btn.classList.contains(targetClass)){
			btn.click();
			console.info("resume updated!");
			setTimeout(closeBanner, 2500);
		} else {
			console.info(`update buttons not found`);
		}
	})
}

const updateSheduler = () => {
	setInterval(updater, intervalToUpdate);
	console.info(`update sheduled for every ${intervalToUpdate / (1000 * 60)} minutes`);
}

w.addEventListener("load", updateSheduler);