// ==UserScript==
// @name         mail modifier
// @namespace    http://tampermonkey.net/
// @version      2024-07-09
// @description  Change current email
// @author       wildcat2k21
// @match        https://touch.mail.ru/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mail.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500192/mail%20modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/500192/mail%20modifier.meta.js
// ==/UserScript==
(function(){
	'use strict';

	// Создаем скрытый iframe для доступа к оригинальной консоли
	const iframe = document.createElement('iframe');
	iframe.style.display = 'none';
	document.body.appendChild(iframe);

	// Получаем доступ к оригинальной консоли из контекста iframe
	const originalConsole = iframe.contentWindow.console;

	// Создаем функцию mylog, которая использует оригинальную консоль
	function mylog(...args) {
	  originalConsole.log(...args);
	}

	//индентификатор письма
	let messageDataId = 'eb0172377b50aea0:0'; //'eb0172377b50aea0:0'
	let targetNodeSelectorText = `div[data-id="1:${messageDataId}"]`; //`div[data-id="1:${messageDataId}"]`

	//вывод селектора
	mylog(targetNodeSelectorText);

	//параметры письма
	const messageTitleText = '[Bybit]Апелляция отклонена';
	const messageDateText = '10 Июля 2024, 14:38';
	const senderNameText = 'Bybit <notification@noreply.bybit.com>';
	const senderIconUrl = 'https://filin.mail.ru/pic?width=90&height=90&email=notification@noreply.bybit.com&version=4&build=7&name=Bybit';

	//splitter is ||
	const messageContentText = `Уважаемый трейдер Bybit! В результате рассмотрения аппеляции по вашему недавнему обращению, оператором Службы поддержки было принято решение отказать в удовлетворении Вашей апелляции, ввиду систематического нарушения Вами Правил P2P платформы Bybit.||Это автоматическое сообщение. Пожалуйста, не отвечайте на него.||С Уважением,||Команда Bybit`;

	//фейковый задний фон
	const background = {

		//флаг инициализации
		isInited: false,

		//создание элемента
		element: document.createElement('div'),

		//инициализация
		init: function(){

			if(this.isInited) return;

		    //установка стилей
		    this.element.style = `
				background-color: #e8eef5;
				position: fixed;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: 99999;
				display: none;
			`;

			// Создание элемента <style>
			const animStylesSheet = document.createElement("style");
			animStylesSheet.type = "text/css";

			// Опредление анимации
  			animStylesSheet.innerText = `
	  			@keyframes outer-rotate {
				  0% {
				    transform: rotate(0deg);
				  }
				  25% {
				    transform: rotate(90deg);
				  }
				  50% {
				    transform: rotate(180deg);
				  }
				  75% {
				    transform: rotate(270deg);
				  }
				  100% {
				    transform: rotate(360deg);
				  }
				}

				@keyframes inner-rotate {
				  0% {
				    transform: rotate(0deg);
				  }
				  25% {
				    transform: rotate(-90deg);
				  }
				  50% {
				    transform: rotate(-180deg);
				  }
				  75% {
				    transform: rotate(-270deg);
				  }
				  100% {
				    transform: rotate(-360deg);
				  }
				}
			`;

			// Добавление элемента <style> в заголовок документа
			document.head.appendChild(animStylesSheet);

			//внешняя загрузка (индикатор)
			const outerLoading = document.createElement('div');
			outerLoading.style = `
				margin: 10px 45.5%;
				white-space: nowrap;
				width: 23px;
				height: 23px;
				background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAQAAAD9sOO8AAACj0lEQVR4AbXXT0tUURjH8aeGaP5oNaNFkCChZCoUvg+RaSSSMOs9ZLZp8d1MjX+yICIXWRS0jmijmBgRFJVoEhIMahlIWWRJRNrkDfLhcBiamXvxzPw2x3PP8+HiuYvnkVI/EnQwyDhz/MAjxxeyjJCmnSqkeIo9DHOGx+TwCiTHOF2Eg+MReviE5yPL9BALgrfxHi9AFkn6wyPcyiudpo8UTVQghKimkRQZpvJO3WBHKTzBU6vgO/0cRgqkjl5WrNNP2FcMr2XWHF1jgDhSInu4yJqpWaCuEF7DB3NslhbEZ5p5bereUfM/PMqMOXKfCiRAwtwztZNEyceta7xDCAmYbQyZ+pv5eJt59CAwrbz19q02HjXf9SzR4DCqmM9znrDB6dbNdY4iW0gTv1TqVpwwy7rVj2wxl1RaIrKJd+rGN+JbxnfxVbWTm/gjN++tSas2hggJfuufh5zgB9nQ+9stHFd6GnGUSRVTwhVdDrrCzaX2CWOYC3CUYyqOCnO6bHKGN6uYFX7qstIZHkc/bcHTiLNsV/FPOXA12RBWdRl3iL/4Jz4XFhRvdojXcp1rHBAmFO9AXEe4rPhQOfATir8tB54w3WCDe9z81xkoB35K8VXi7vEIH5UfdI8LPYqv0+Iet1uLmGtcSNpNkWtcuGv4YYLzIS7wjLSpzMOjTFuNaDQQHeOhVnYWbqEXDf+GI77pFqurP1sIF+otfp1eX83/AGtWd15dGBdqmMEzWaGP+oJwPRnsseUV+0sNXBXcxsPOFBlSNFJNCKGSBpJkeJl3apiov1ExqQOM32RpDTLkxjjPsi94iXNEgo/nEbqYKDqej3KanYHHcytVtJNmhCyfyeGxwjyjXKWDvUjx/AXkN/LccSGDyQAAAABJRU5ErkJggg==");
				background-size: contain;
  				background-repeat: no-repeat;
  				animation: outer-rotate 700ms linear infinite;
  			`;

			//внешняя загрузка (индикатор)
			const innerLoading = document.createElement('div');
  			//внутреняя загрузка (индикатор)
  			innerLoading.style = `
  				position: absolute;
  				left: 5px;
				top: 5px;
				width: 13px;
				height: 13px;
  				background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAABWUlEQVR4AZWUz0oCURSHT5ClYkh/HiD7s9T+QNmmlF5DIaIX+dBeoqxVm/Yx2MIUDEoKWim+gekjOIEWcucwjY6jfpvLuee7Xr38jng/7FGkSo8fbHq8cM0+8h/BzTl1hhN4IztZinDDgKEvd0S80gbvDAP4ZN0tRWno1gCLHAkWCZEgj+X6/gZRVLrVcpM04uGUtu6XHCmjZ9VYQSYQ51XvkRlJWmiOK0qMlumqI0JSzzhCppDW+6SEollaSACW6SwKNbO8CJTyzgWFjlkeBEpbprMr9M0vigVKISP1hS/z2hLIEipt88gDuzNIm0b6FmYnZ6TKPNKzkQqzK2f6uIdOKczlH8u+Spy2BlLz9DQqVH3++Jgr0VlHWsA2pTbHY8oJLVXu3cktu0JY5oodIiaEZb8QCquaXX8+WPMOlvDUwTKg5BksSmbOEaYkgSodbPp0qVAg5e35BUgRS7X2rwJlAAAAAElFTkSuQmCC");
				background-size: contain;
  				background-repeat: no-repeat;
  				animation: inner-rotate 350ms linear infinite;;
  			`;

  			//конейнер для загрузки
  			const loadWrapper = document.createElement('div');
  			loadWrapper.style = `
				padding-top: 52px;
  				position: relative;
  			`;

  			//добавление внутренней загрузки во внешнюю
  			outerLoading.appendChild(innerLoading);
  			//гурппировка
  			loadWrapper.appendChild(outerLoading);
  			//добавление внутренней загрузки
  			this.element.appendChild(loadWrapper);

			//id фона
			this.element.id = 'fake-bg-123';
			//добавить задний фон
			document.body.appendChild(this.element);
			//пометить как инициализированный
			this.isInited = true;
		},

		show: function(){
			this.element.style.display = 'block';
		},
		hide: function(){
			this.element.style.display = 'none';
		}
	}

	//инициализация фона сразу
	background.init();
	background.show();

  	//сценарий
  	function main(){

  		try{

  			//остановка загрузки станицы
  			window.stop();

			//пересортировка сообщений
			function resortMessages(messListElem){
				const messageArr = Array.from(messListElem.children);
				const sortedMessages = messageArr.sort((nodeA, nodeB) => {
					//даты
					const dateA = nodeA.querySelector('.messageline__date').textContent;
					const dateB = nodeB.querySelector('.messageline__date').textContent;

					//числовые эквиваленты дат
					let dateNumA, dateNumB;

					//для сообщений за сегодня
					if(dateB.indexOf(':') !== -1){
						dateNumB = Number(dateB.replace(':', ''));
						dateNumB += 1231;

					//для дат с точкой
					}else{
						//числовой эквивалент дат для сравнения
						dateNumB = Number(dateB.split('.')[1] + dateB.split('.')[0]);
					}

					//для сообщений за сегодня
					if(dateA.indexOf(':') !== -1){
						dateNumA = Number(dateA.replace(':', ''));
						dateNumA += 1231;

					//для дат с точкой
					}else{
						//числовой эквивалент дат для сравнения
						dateNumA = Number(dateA.split('.')[1] + dateA.split('.')[0]);
					}

					//сравнение дат
					return dateNumA < dateNumB;
				});

				//удаление старых сообщений
				messageArr.forEach((oldmess, n) => {
					oldmess.remove();
					messListElem.appendChild(sortedMessages[n]);
				})
			}

			//ключевая нода для поиска
			const targetNode = document.querySelector(targetNodeSelectorText);

			//если нужной ноды нет, не прервать сценарий
			if(!targetNode) return;

			//связанные ноды
			const targetMessage = targetNode.closest('.messageline').parentElement;
			const messageList = targetMessage.closest('.messagelist');
			const cloneMessage = targetMessage.cloneNode(true);
			cloneMessage.setAttribute('injected', 'injected');

			//получение заголовков письма
			const messageTitle = cloneMessage.querySelector('.messageline__subject');
			const messagePrevText = cloneMessage.querySelector('.messageline__content');
			const messageDate = cloneMessage.querySelector('.messageline__date');

			const messageAvatarStyle = cloneMessage.querySelector('.messageline__userpick__avatar').style;
			messageAvatarStyle.backgroundImage = `url("${senderIconUrl}")`;
			mylog(messageAvatarStyle);

			//подмена содержимого
			messageTitle.textContent = messageTitleText;
			messagePrevText.textContent = messageContentText.replace('||', ' ').split(' ').slice(0, 10).join(' ');
			messageDate.textContent = formatDate(messageDateText, true);
			targetMessage.remove();

			//клон сообщения
			messageList.prepend(cloneMessage);

			//пересортировка сообщений
			resortMessages(messageList);

			//очищение хранилища
			localStorage.clear();
			sessionStorage.clear();

		}catch(err){
	    	mylog(err);

		}finally{
  			//скрыть задний фон
  			background.hide();
		}
	}

	//подмена письма
	function fakeMail(){

		//остановка загрузки станицы
  		window.stop();

		//опорный элемент письма
		const emailContent = document.querySelector('#style_17199886840418878366_BODY'); //'#style_17199886840418878366_BODY'

		//проверка на опорный элемент
		if(emailContent){

			//селектор к warn блоку
			const warnMessage = document.querySelector('#contentContainer_mr_css_attr > div');
			const latterBody = document.querySelector('.letter__body__content');

			//тест
			// const testParent = document.querySelector('.letter__body');
			// Array.from(testParent.children).forEach(child => {
			// 	child.remove();
			// });

			// testParent.textContent = 'hello world';

			if(warnMessage){
				//удаление warn
				warnMessage.remove()

				//изменение размера письма
				latterBody.style.height = 'fit-content';

				//таблица с полями письма
				const table = document.querySelector('#contentContainer_mr_css_attr');

				//изменение даты письма
				const letterDateEl = document.querySelector('.letter__field__read-created');
				letterDateEl.textContent = messageDateText;

				//замена названия письма
				const letterField = document.querySelector('.letter__field__subject');
				letterField.textContent = messageTitleText;

				//замена отправителя
				const senderEl = document.querySelector('.letter__contact__name');
				senderEl.textContent = senderNameText;

				//замена иконки
				const messageAvatarStyle = document.querySelector('.letter__field__avatar').style;
				messageAvatarStyle.backgroundImage = `url("${senderIconUrl}")`;

				//удаление старого содержимого
				Array.from(table.children).forEach(oldPar => {
					oldPar.remove();
				});

				//добавление нового содержимого для сообщения
				messageContentText.split('||').forEach(text => {
					const pElement = document.createElement('p');
					pElement.textContent = text;
					table.appendChild(pElement);
				})
			}

			//скрыть задний фон
			background.hide();
		}
	}

	//работа с датой сообщения
	function formatDate(dateString, short = false) {
	  const months = {
	    'Января': '01',
	    'Февраля': '02',
	    'Марта': '03',
	    'Апреля': '04',
	    'Мая': '05',
	    'Июня': '06',
	    'Июля': '07',
	    'Августа': '08',
	    'Сентября': '09',
	    'Октября': '10',
	    'Ноября': '11',
	    'Декабря': '12'
	  };

	  // Разбиваем строку даты на части
	  const [day, month, yearTime] = dateString.split(' ');
	  const monthNumber = months[month];
	  
	  if (short) {
	    // Форматируем в "день.месяц"
	    const dayNumber = day.length === 1 ? '0' + day : day;
	    return `${dayNumber}.${monthNumber}`;
	  } else {
	    // Оставляем как есть
	    return dateString;
	  }
	}

	function urlCheck(){
		//текущий url
		const currentUrl = window.location.href;
		// Проверяем наличие части строки в URL
		const isQueryTargetMess = currentUrl.includes(messageDataId);
		const isMainPage = currentUrl.includes('f0') && !currentUrl.includes('readmsg'); //currentUrl.includes('threads')

		return {isQueryTargetMess, isMainPage};
	}

	let targetIsAplied = false;
	//нужная нода и выполнение сценария
	window.addEventListener('load', function(){

		//припроверка URL
		const prevUrlCheck = urlCheck();

		//упаравление поведением цели
		window.addEventListener('popstate', function(event) {

			//проврка URL
			const urlCheckResult = urlCheck();

			//предотвращение SPA поведения на главной странице для повторной инициализации
			if(urlCheckResult.isMainPage){
				background.show();
				location.reload();
			}
			//просмотр страницы для инъекции
			if(urlCheckResult.isQueryTargetMess){
				//показать задний фон
				background.show();
				//выполнение скрипта с задержкой
				setTimeout(() => fakeMail(),3000);
				setTimeout(() => fakeMail(),5000);
				setTimeout(() => fakeMail(),9000);
			}
		});

		//если письмо уже открыто
		if(prevUrlCheck.isQueryTargetMess){
			//показать задний фон
			background.show();
			//выполнение скрипта с задержкой
			setTimeout(() => fakeMail(),3000);
			setTimeout(() => fakeMail(),5000);
			setTimeout(() => fakeMail(),9000);
			return;
		}

		//если это другой домен
		if(!prevUrlCheck.isMainPage){
			background.hide();
			return;
		}

	    // Создаем новый экземпляр MutationObserver
	    const observer = new MutationObserver(function(mutationsList, observer) {
	        for (let mutation of mutationsList) {
	            if (mutation.type === 'childList') {
                // Проверяем добавленные узлы
	                mutation.addedNodes.forEach(function(node) {
	                    // Проверяем, что узел имеет нужный атрибут data-id
	                    if (node instanceof Element) {
	                    	if(node.querySelector(targetNodeSelectorText) && !targetIsAplied){
	                    		targetIsAplied = true;
	                    		setTimeout(main, 3000);
	                    		setTimeout(main, 9000);
	                    		setTimeout(main, 12000);
 								observer.disconnect();
	                    	}
	                    }
	                });
	            }
	        }
	    });

        // Начинаем отслеживать изменения в DOM
    	observer.observe(document.body, { childList: true, subtree: true });
	});
})();
