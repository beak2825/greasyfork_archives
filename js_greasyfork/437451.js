// ==UserScript==
// @name         Traffic Lights
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       Tishka
// @license		 mit
// @match        https://my.livechatinc.com/*
// @icon         https://www.google.com/s2/favicons?domain=livechatinc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437451/Traffic%20Lights.user.js
// @updateURL https://update.greasyfork.org/scripts/437451/Traffic%20Lights.meta.js
// ==/UserScript==

// 24.12.2021 (0.1.1) изменена логика отсчета: берет последнее сообщение, но первое их время. считает от последнего сообщения как юзера, так и агента
// 26.12.2021 (0.1.2) два типа таймера: сообщение агента только синим и сообщения юзера 5 промежутков: фиолетовый, зеленый, желтый, красный, черный, белый. Инактив пустой цвет фикс бага при новом чате


(async function() {
	'use strict';

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	function normalizeTime(timeString){
		let Datee = new Date();
		let dateToday = new Date(Datee.getFullYear(), Datee.getMonth(), Datee.getDate());
		let regExTime = /([0-9]?[0-9]):([0-9][0-9]):([0-9][0-9])/;
		let regExTimeArr = regExTime.exec(timeString); // ["01:12:33", "01", "12", "33", index: 0, input: "01:12:33", groups: undefined]
		let timeHr = regExTimeArr[1] * 3600 * 1000;
		let timeMin = regExTimeArr[2] * 60 * 1000;
		let timeSec = regExTimeArr[3] * 1000;

		let timeMs = timeHr + timeMin + timeSec;
		return (timeMs + dateToday.getTime()) / 1000; // функция отдает время в СЕКУНДАХ!
	}
	var setFlag = function(chatid, color, text)
	{
		document.querySelector("[data-testid^=chat-item-"+chatid).querySelector(".user-symbol-content").innerHTML = "";
		document.querySelector("[data-testid^=chat-item-"+chatid).querySelector(".user-symbol-content").style.backgroundColor = color;
		if(text){
			document.querySelector("[data-testid^=chat-item-"+chatid).querySelector(".user-symbol-content").innerText = text;
		}


	}

	var chatsData = new Object(); // Инфа о чатах сохраняется сюда

	for(;;){
		await sleep(100);
		let currentLocation = window.location.href;
		if(currentLocation.split("/")[3] != "chats" && !currentLocation.split("/")[5]){continue;} // скип цикла если не в чатах
		// ID текущего чата берем из строки
		let currentChatID = currentLocation.split("/")[5]; // ID чата из строки браузера

		// выборка списка чатов и авы
		let chatsListSelector = ".css-5ijrzv"; // блок слева со списком чатов // document.querySelector(".css-5ijrzv"); // слева весь блок
		let chatsListElem = document.querySelector(chatsListSelector);
		let chatSelector = "li[data-testid^=chat-item-"; // селектор самих чатов // document.querySelectorAll("li[data-testid^=chat-item-") // отдаст массив с
		let userSymbolSelector = ".user-symbol-content"; // иконка аватарка
		//
		// выборка списка сообщений
		let messagesSelector = ".css-19db2xt";
		let messagesListSelector = "[data-test=messages-list]";
		let messageFromSelector = ".css-1yuqpww"; // селектор кто писал сообщение
		let messageTimeSelectorAgent = ".css-kwowz4.css-1cv7v26"; // селектор времени из сообщений от агента
		let messageTimeSelectorUser = ".css-kwowz4.css-12j82s1"; // селектор от юзера
		let messageTextSelector = ".css-8writ1.eovu8nx0"; // селектор сообщения. для получения сообщения innerText
		let messageTypeIndicatorSelector = ".css-1kwdl1l"; // индикатор набора текста в самих сообщениях
		let messageSneakPeekIndicatorSelector = ".css-7xlva6.fs-mask"; // индиактор набора текста в доке
		let messageTextDockSelector = ".css-1m8zxho.fs-mask"; // селектор сообщения в доке. для получения сообщения innerText
		let messageTextDockNewSelector = ".fs-mask.css-1gia3oa";
		//
		let isIdleSelector = ".css-his3f2";


		// Чекаем список чатов и ставим время согласно базе, если времени нет - ставим красный флаг
		if(chatsListElem){
			let chatsLeftDock = document.querySelectorAll(chatSelector);
			for(let value of chatsLeftDock){
				let isIdle = value.querySelector(isIdleSelector);
				let isTyping = value.querySelector(messageSneakPeekIndicatorSelector);

				// ид чата и дата сейчас в секундах
				let dataTestId = value.getAttribute("data-testid");
				let chatID = dataTestId.split("-")[2];
				let dateNow = new Date();
				dateNow = dateNow.getTime() / 1000;
				if(chatsData[chatID] == undefined)
				{
					if(value.querySelector(messageTextDockSelector)){
						chatsData[chatID] = {messageText: value.querySelector(messageTextDockSelector).innerText};
						chatsData[chatID]["messageTime"] = dateNow;
					}
					else
					{
						chatsData[chatID] = {messageText: value.querySelector(messageTextDockNewSelector).innerText};
						chatsData[chatID]["messageTime"] = dateNow;
					}

				}


				if(isIdle){setFlag(chatID, "whitesmoke");continue;} // черную аву и скип, если инактивен
				// если набирает, скип
				//////////////////////////////////////
				// uploaded an attachment если загрузил фотку
				if(chatsData[chatID] != undefined){ // здесь должно брать ИД ЧАТА НЕ ТЕКУЩИЙ! А ЭЛЕМЕНТА СПИСКА ЧАТОВ!!!
					if(isTyping){
						let timeDiff = dateNow - chatsData[chatID]["messageTime"];
						if(chatsData[chatID]["messageFrom"] == "agent"){ setFlag(chatID, "royalblue", Math.round(timeDiff));continue;}
						// let chatLastMsgDockElem = value.querySelector(messageTextDockSelector);
						// if(chatLastMsgDockElem){console.log(chatLastMsgDockElem.innerText);}
						let status = "";
						//console.log(dateNow, chatsData[currentChatID]["lastMessageTime"],timeDiff);
						//setFlag(chatID, "#9b59b6");
						if(timeDiff < 15)
						{
							status = ">15";
							setFlag(chatID, "#9b59b6", Math.round(timeDiff)); // зеленый
						}
						else if(timeDiff > 15 && timeDiff < 60 ){
							status = ">15";
							setFlag(chatID, "#2ecc71", Math.round(timeDiff)); // зеленый
						}
						else if(timeDiff > 60 && timeDiff < 120 ) {
							status = " >60";
							setFlag(chatID, "#f1c40f", Math.round(timeDiff)); // желтый
						}
						else if(timeDiff > 120 && timeDiff < 180 ) {
							status = ">120";
							setFlag(chatID, "tomato",  Math.round(timeDiff)); // красный
						}
						else if(timeDiff > 180 && timeDiff < 240 ) {
							status = ">120";
							setFlag(chatID, "black",  Math.round(timeDiff)); // серый
						}
						else if(timeDiff > 240) {
							status = ">120";
							setFlag(chatID, "white",  Math.round(timeDiff)); // красный
						}
						continue;
					}


					if(value.querySelector(messageTextDockNewSelector))
					{
						if(value.querySelector(messageTextDockNewSelector).innerText != chatsData[chatID]["messageText"] && chatsData[chatID]["messageFrom"] == "agent")
						{
							// если текста сообщений отличаются, и последнее от агента, то меняем, что последнее от юзера
							//console.log("в доке"+value.querySelector(messageTextDockNewSelector).innerText);
							//console.log(chatsData[chatID]["messageFrom"]);
							chatsData[chatID]["messageFrom"] = "customer";
							chatsData[chatID]["messageText"] = value.querySelector(messageTextDockNewSelector).innerText;
							chatsData[chatID]["messageTime"] = dateNow;
							//console.log(chatsData[chatID]["messageFrom"], chatsData[chatID]["messageText"]);
						}
					}
					//console.log(chatsData[chatID]["messageFrom"] , chatsData[chatID]["messageText"]);
					let timeDiff = dateNow - chatsData[chatID]["messageTime"];
					if(chatsData[chatID]["messageFrom"] == "agent"){ setFlag(chatID, "royalblue", Math.round(timeDiff));continue;}
					// let chatLastMsgDockElem = value.querySelector(messageTextDockSelector);
					// if(chatLastMsgDockElem){console.log(chatLastMsgDockElem.innerText);}
					let status = "";
					//console.log(dateNow, chatsData[currentChatID]["lastMessageTime"],timeDiff);
					//setFlag(chatID, "#9b59b6");
					if(timeDiff < 15)
					{
						status = ">15";
						setFlag(chatID, "#9b59b6", Math.round(timeDiff)); // зеленый
					}
					else if(timeDiff > 15 && timeDiff < 60 ){
						status = ">15";
						setFlag(chatID, "#2ecc71", Math.round(timeDiff)); // зеленый
					}
					else if(timeDiff > 60 && timeDiff < 120 ) {
						status = " >60";
						setFlag(chatID, "#f1c40f", Math.round(timeDiff)); // желтый
					}
					else if(timeDiff > 120 && timeDiff < 180 ) {
						status = ">120";
						setFlag(chatID, "tomato",  Math.round(timeDiff)); // красный
					}
					else if(timeDiff > 180 && timeDiff < 240 ) {
						status = ">120";
						setFlag(chatID, "black",  Math.round(timeDiff)); // серый
					}
					else if(timeDiff > 240) {
						status = ">120";
						setFlag(chatID, "white",  Math.round(timeDiff)); // красный
					}

					//console.log(chatID + " " + status + " " + timeDiff);
				}
				else{
					// если для чато не нашло инфы
					//console.log("Для чата не найдены данные " + value.querySelector(userSymbolSelector).innerHTML);
					setFlag(chatID, "#e74c3c");
				}

				// тут будет что мы делаем с каждым чатом в доке, т.е. установка флага
				// let chatFlag = value.querySelector(userSymbolSelector);
				// console.log(chatFlag.innerHTML);
			}

		}
		else{continue;} // ничего не делаем если нет левого дока

		// получаем последнее сообщение из чата, поскольку мы в любом случае в чате, иначе скрипт не сработает
		let messagesList = document.querySelectorAll(messagesSelector);
		if(messagesList != null){
			let lastMessageInfo = messagesList[messagesList.length-1]; // последнее сообщение, но сработает в том случае если есть сообщения с селектором сообщений, весь блок сообщения
			//console.log(lastMessageInfo);
			if(lastMessageInfo != null)
			{
				if(lastMessageInfo.querySelector(messageTypeIndicatorSelector)){continue;} // если сообщение набирается, то скип
				let messageTime = ""; // инит переменной которая хранит время
				let messageFromElem = lastMessageInfo.querySelector(messageFromSelector); // получаем, кто отправил сообщение. получаем сам элемент
				if(!messageFromElem){continue;}
				let messageFromAttribute = messageFromElem.getAttribute("data-testid");// если нет элемента с временем, след итерация иначе пишем в мессаджфром текст из атрибута
				let messageText = "";
				//console.log(messageFromAttribute);
				let messageFrom;
				if(messageFromAttribute.match(/customer/)){
					if(messageFromAttribute.match(/attachment/)){messageText = "attachment"} // если аттачмент
					else{messageText = lastMessageInfo.querySelectorAll(messageTextSelector)[lastMessageInfo.querySelectorAll(messageTextSelector).length-1].innerText;} // текст берется из последнего сообщения}
					messageFrom = "customer";
					messageTime = normalizeTime(lastMessageInfo.querySelectorAll(messageTimeSelectorUser)[0].innerHTML.split("<")[0]);
					chatsData[currentChatID] = {messageFrom: messageFrom, messageTime: messageTime, messageText: messageText, timerNeeded: 1};
				}

				else if(messageFromAttribute.match(/agent/)){
					if(messageFromAttribute.match(/attachment/)){messageText = "attachment"} // если аттачмент
					else{messageText = lastMessageInfo.querySelectorAll(messageTextSelector)[lastMessageInfo.querySelectorAll(messageTextSelector).length-1].innerText;}
					messageFrom = "agent";
					messageTime = normalizeTime(lastMessageInfo.querySelectorAll(messageTimeSelectorAgent)[0].innerHTML.split("<")[0]);
					messageText = lastMessageInfo.querySelectorAll(messageTextSelector)[lastMessageInfo.querySelectorAll(messageTextSelector).length-1].innerText; // текст берется из последнего сообщения
					chatsData[currentChatID] = {messageFrom: messageFrom, messageTime: messageTime, messageText: messageText, timerNeeded: 0};
				}
				else{messageFrom = "other";}
				//console.log(chatsData[currentChatID]);


			}

		}

		//
		//<div data-test="typing-indicator" class="css-1yb9icf"><span></span><span></span><span></span></div>
		//<span class="css-7xlva6 fs-mask" data-testid="sneak-peek-text">сраооаоаоаооп</span>

	} // конец FOR
})();