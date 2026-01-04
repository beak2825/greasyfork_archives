// ==UserScript==
// @name         Button to Toggle Preview for Yellow Images
// @namespace    https://t.me/MockUp_Box
// @version      0.3.4
// @description  Попытка завоевать мир!
// @author       AmunRa
// @match        https://yellowimages.com/*
// @exclude      https://yellowimages.com/all/store*
// @exclude      https://yellowimages.com/creative-fonts/*
// @exclude      https://yellowimages.com/images-360*
// @exclude      https://yellowimages.com/search?q=*&c=1
// @exclude      https://yellowimages.com/search?q=*&c=2599
// @exclude      https://yellowimages.com/search?q=*&c=28140
// @exclude      https://yellowimages.com/search?c=*&q=*
// @exclude      https://yellowimages.com/object-mockups/sets*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466280/Button%20to%20Toggle%20Preview%20for%20Yellow%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/466280/Button%20to%20Toggle%20Preview%20for%20Yellow%20Images.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Добавление стилей
	var css = `
        label {
            margin: 0px;
        }

        .checkbox-ios {
            display: inline-block;
            height: 28px;
            line-height: 28px;
            position: relative;
            font-size: 14px;
            user-select: none;
            margin-left: 15px;
        }

        .checkbox-ios .checkbox-ios-switch {
            position: relative;
            display: inline-block;
            box-sizing: border-box;
            width: 56px;
            height: 28px;
            border: 1px solid rgba(0, 0, 0, .1);
            border-radius: 25%/50%;
            vertical-align: top;
            background: #eee;
            transition: .2s;
        }

        .checkbox-ios .checkbox-ios-switch:before {
            content: "";
            position: absolute;
            top: 1px;
            left: 1px;
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
            transition: .15s;
        }

        .checkbox-ios input[type=checkbox] {
            display: block;
            width: 0;
            height: 0;
            position: absolute;
            z-index: -1;
            opacity: 0;
        }

        .checkbox-ios input[type=checkbox]:not(:disabled):active + .checkbox-ios-switch:before {
            box-shadow: inset 0 0 2px rgba(0, 0, 0, .3);
        }

        .checkbox-ios input[type=checkbox]:checked + .checkbox-ios-switch {
            background: #fffb1f;
        }

        .checkbox-ios input[type=checkbox]:checked + .checkbox-ios-switch:before {
            transform: translateX(28px);
        }
    `;

	var style = document.createElement('style');
	style.innerHTML = css;
	document.head.appendChild(style);

	// Создаем переключатель
	var label = document.createElement('label');
	label.className = 'checkbox-ios';

	var input = document.createElement('input');
	input.type = 'checkbox';

	var span = document.createElement('span');
	span.className = 'checkbox-ios-switch';

	// Добавляем плавное появление
	span.style.opacity = '0';
	span.style.transition = 'opacity 0.2s ease-in-out';
	setTimeout(function () {
		span.style.opacity = '1';
	}, 10);

	// Добавляем элементы в документ
	label.appendChild(input);
	label.appendChild(span);
	document.body.appendChild(label);

	// Создаем новый div и помещаем в него переключатель
	var newDiv = document.createElement('div');
	newDiv.id = 'myDiv'; // Присваиваем идентификатор 'myDiv'
	newDiv.style.display = 'flex';
	newDiv.style.alignItems = 'center';
	newDiv.appendChild(label);

	// Находим div, в который нужно добавить новый div
	var originalDiv = document.querySelector('.filters__right');

	originalDiv.appendChild(newDiv);

	// Запоминаем состояние переключателя
	var checkboxState = localStorage.getItem('checkboxState');
	if (checkboxState === 'checked') {
		input.checked = true;
	}

	// Функция для изменения прозрачности элементов при наведении
	function toggleOpacityOnHover() {
		// Найти все элементы с классом "card__background"
		var elements = document.querySelectorAll('.card__background');

		// Пройти по всем элементам и добавить обработчики событий для наведения и ухода курсора
		elements.forEach(function (element) {
			element.style.transition = 'opacity 0.2s ease';
			element.addEventListener('mouseover', handleMouseOver);
			element.addEventListener('mouseout', handleMouseOut);
			if (input.checked) {
				element.style.opacity = '1';
			} else {
				element.style.opacity = '0';
			}
		});
	}

	// Навешиваем обработчик события на родительский элемент
	originalDiv.addEventListener('mouseover', toggleOpacityOnHover);
	originalDiv.addEventListener('mouseout', toggleOpacityOnHover);

	// Обработчик события наведения курсора
	function handleMouseOver(event) {
		event.target.style.opacity = input.checked ? '0' : '1';
	}

	// Обработчик события ухода курсора
	function handleMouseOut(event) {
		event.target.style.opacity = input.checked ? '1' : '0';
	}

	// Обработчик события изменения состояния переключателя
	input.addEventListener('change', function () {
		if (input.checked) {
			localStorage.setItem('checkboxState', 'checked');
		} else {
			localStorage.removeItem('checkboxState');
		}
		toggleOpacityOnHover(); // Вызвать функцию для изменения прозрачности элементов при наведении
	});

	// Вызвать функцию при загрузке страницы
	toggleOpacityOnHover();

	// Создаем MutationObserver
	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.target.id === 'products-list') {
				// Выводим алерт о добавлении контента
				// alert('Контент был динамически добавлен в список продуктов!');
				toggleOpacityOnHover();
			}
		});
	});

	// Находим целевой элемент для отслеживания изменений
	var productsList = document.getElementById('products-list');

	// Настройка конфигурации для наблюдателя (observer)
	var config = {
		childList: true,
		subtree: true
	};

	// Запускаем наблюдение за изменениями
	observer.observe(productsList, config);
})();