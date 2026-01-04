// ==UserScript==
// @name           AuthorTodayImprover
// @name:ru        AuthorTodayImprover
// @namespace      90h.yy.zz
// @version        0.2.0
// @author         Ox90
// @match          https://author.today/reader/*
// @description    The script allows you to select text and use the context menu when reading a book.
// @description:ru Скрипт возвращает возможность выделять текст и использовать контекстное меню при чтении на сайте.
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/457145/AuthorTodayImprover.user.js
// @updateURL https://update.greasyfork.org/scripts/457145/AuthorTodayImprover.meta.js
// ==/UserScript==

(function start() {
	"use strict";

const reader_selectors = [ "#reader.page-content", "div.text-wrapper" ];

let active = true;

/**
 * Старт скрипта. Вызывается после загрузки DOM-дерева.
 *
 * @return void
 */
function run() {
	if (testNoselect()) {
		active = getValue("disabled", "no") !== "yes";
		if (active) processReaderElements();
		updateToolbar();
	}
}

/**
 * Обрабатывает все возможные элементы читалки по списку селекторов
 *
 * @return void
 */
function processReaderElements() {
	reader_selectors.forEach(sel => {
		const el = document.querySelector(sel);
		el && processElement(el);
	});
}

/**
 * Обрабатывает переданный DOM-элемент.
 * Если у элемента нет класса loading, то он обрабатывается немедленно,
 * в ином случае на него вешается наблюдатель, а обработка откладывается.
 *
 * @param Element el Обрабатываемый DOM-элемент
 *
 * @return void
 */
function processElement(el) {
	if (!el.classList.contains("loading")) {
		fixStyles(removeEvents(el));
		return;
	}
	(new MutationObserver(function(mutations, observer) {
		observer.disconnect();
		processElement(el);
	})).observe(el, { attributes: true, attributeFilter: [ "class" ] });
}

/**
 * Подменяет переданный элемент новым. В новый элемент переносятся дети из старого элемента
 * и производится копирование атрибутов из старого элемента в новый за исключением атрибутов,
 * которые блокируют привычную функциональность как: выделение текста, вызов контекстное меню.
 * el.cloneNode(true) здесь не используется, чтобы избежать потери обработчиков у вложенных элементов.
 *
 * @param Element el DOM-элемент для замены
 *
 * @return Element Вновь созданный элемент
 */
function removeEvents(el) {
	const evil_attributes = [
		"oncontextmenu", "onmousedown", "onselectstart", "unselectable"
	];

	const new_el = document.createElement(el.tagName);
	for (let attr of el.attributes) {
		if (!evil_attributes.includes(attr.name)) {
			new_el.setAttribute(attr.name, attr.value);
		}
	}
	while (el.childNodes[0]) {
		new_el.appendChild(el.childNodes[0]);
	}
	el.replaceWith(new_el);
	return new_el;
}

/**
 * Тестирует стили на наличие запрета выделять текст
 *
 * @return bool
 */
function testNoselect() {
	return reader_selectors.some(sel => !!document.querySelector(sel + ".noselect"));
}

/**
 * Исправляет стили элемента таким образом, чтобы они не блокировали привычную для пользователя функциональность.
 *
 * @param Element el DOM-элемент для исравления
 *
 * @return void
 */
function fixStyles(el) {
	el.classList.remove("noselect");
	el.style.userSelect = "text";
}

/**
 * Добавляет кнопку скрипта на тулбар или обновляет, если уже добавлена
 *
 * @return void
 */
function updateToolbar() {
	let mobile = false;
	let tb = document.querySelector("section>header>nav>.navbar-right");
	if (!tb) {
		mobile = true;
		tb = document.querySelector("div.main-navbar div.right");
	}
	if (!tb) return;
	const bt = (() => {
		let el = tb.querySelector(".ati-button");
		if (!el) {
			if (!mobile) {
				el = document.createElement("button");
				el.classList.add("btn", "btn-brd", "btn-only-icon", "pull-left", "mr", "hint-bottom");
				el.setAttribute("style", "padding:0 !important");
			} else {
				el = document.createElement("a");
				el.classList.add("link", "icon-only", "open-popup");
				el.href = "";
			}
			el.classList.add("ati-button");
			el.textContent = "ATI";
			el.addEventListener("click", event => {
				event.preventDefault();
				active = !active;
				setValue("disabled", active && "no" || "yes");
				updateToolbar();
				if (active) {
					processReaderElements();
				} else {
					document.location.reload();
				}
			});
		}
		return el;
	})();
	if (!mobile) {
		bt.style.color = active && "green" || "gray";
	} else {
		bt.style.color = active && "white" || "darkgray";
	}
	bt.title = "ATI: Копирование текста " + (active && "разблокировано" || "заблокировано");
	tb.prepend(bt);
}

/**
 * Извлекает и возвращает сохраненный элемент данных из локального хранилища
 *
 * @param string name   Имя
 * @param string defval Значение по умолчанию
 *
 * @return string
 */
function getValue(name, defval) {
	if (localStorage !== undefined) {
		const val = localStorage.getItem("ati-" + name);
		if (val !== null) return val;
	}
	return defval;
}

/**
 * Сохраняет переданный элемент данных в локальном хранилище
 *
 * @param string name  Имя
 * @param mixed  value Значение
 *
 * @return void
 */
function setValue(name, value) {
	if (localStorage !== undefined) {
		localStorage.setItem("ati-" + name, value);
	}
}

//----------

if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", run);
	else run();

})();
