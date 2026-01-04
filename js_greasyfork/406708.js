// ==UserScript==
// @name         AutoSendMessageTelegram
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       JustBruck
// @match        *://web.telegram.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406708/AutoSendMessageTelegram.user.js
// @updateURL https://update.greasyfork.org/scripts/406708/AutoSendMessageTelegram.meta.js
// ==/UserScript==

// Words database


let messages1 = [
"Всем привет",
"Пхах, ага",
"Как дела?",
"Если что, у меня нормик",
"Дора, а у тебя?",
"Дора, Дораааа",
"Пхах",
"Дора как у тебя дела ?",
"Есть актив, то в чате ?",
"Чуток скучно",
"Вот хз",
"МБ пойти попрогить ?",
"Я недопрогер на JS :D",
"Лан ББ, я пошел прогить :)"
];

let messages2 = [
"Привет",
"Как дела?",
"Дора",
"Дора погода Москва",
"Дора погода Сочи ",
"Дора го фотку",
"Дора го фотку",
"Дора скажи слово 1",
"Дора время",
"Доорааа, я шизик :D",
"Как дела у вас?",
"Ладно понятно",
"Удачи",
"Спасибо",
"Что делаешь?",
"Дора, а какие твои любимые занятия ?",
"Дора - прекрасное имя.",
"Дора, мне скучно развлеки меня :D",
"Какой у тебя рост ?",
"Кхмм, но какой у тебя размер ))))",
"Лан пойду чай попью",
"Хотяяяя",
"Стопе не буду )",
"Дора, как думаешь ИИ захватят мир ????",
"Ты одна из них ???",
"Почему ты такая милая ???",
"Ты Багиня!!!",
"Фантастика прям",
"Кстати, Дора, что тебе больше нравится ЭПЛ или Винда? Или вообще Линукс ?? ))",
"Жаль ответа нет...",
"Хз почему так интересно, но тебе кто больше нравятся бомжы или бомжы ?",
"Лан шучу",
"Я уже прям с ума схожу",
"пахпахпахпахпха",
"Пойду всё таки чайка попью )))"
];

let messages3 = [
"Дора погода Сочи",
"Сегодня чудесная погода",
"Я тоже согласен",
"Дора, как дела?",
"Я просто болтаю сам с собой",
"Ну чего - если тут ещё кто живой есть, то складывайте поздравления сюда. :)",
"Кстате я тут видео посмотрел",
"А не скажу, ой ля",
"Дора",
"Дора ты Дура",
"Дора Дура Супер Дура дора Дура",
"Азазааззаа",
"Дора как дела?",
"Ясно",
"Дора что ты умеешь?",
"Классно",
"Дора кто тебя создал",
"Давайте я скажу что то по филосовски",
"Интеллект естественно понимает под собой интеллигибельный закон внешнего мира, открывая новые горизонты. Апостериори, гравитационный парадокс амбивалентно понимает подсобой интеллигибельный знак. Дедуктивный метод решительно далбаебизм. ",
"Ух ты, а я филосов",
"Я хочу процетировать",
"Не бойтесь делать то, что не умеете. Помните, Ковчег построил любитель, профессионалы построили Титани",
"азазазазазаз",
"Ладно",
"Харе фигней страдать, пойду прогить."
];

let messages4 = [
"Блин так скучноооооооо",
"Нефиг чем занятся",
"Прогить нету желания",
"А аниме такое",
"Эххххххх",
"Надо потом мой нубский вирус допилить",
"Лан пацаны",
"Пойуд посплю )",
"Хотяяя, нееет",
"Буду пентагон через термукс ламать",
"Я хацкир"
];


setTimeout(function(){
let mainInput = document.querySelector('div[style="left: -12px; width: calc(100% + 24px); padding-left: 14px; padding-right: 40px;"]');
let mainButton = document.querySelector("button[ng-class=\"draftMessage.type == 'edit' ? 'im_submit_edit' : 'im_submit_send'\"]");
let mainFooter = document.querySelector('div[class="im_bottom_panel_wrap"]');
let switcher = document.createElement("div");
let targetNode = mainButton;
let b = 0;

let wordDataBase = prompt("Выбери словарь цифрой от 1 до 4. Полный список словарей сдесь: https://pastebin.com/tXgT16Uz", 1);
let valueInterval = prompt("Выбери интервал отправки сообщения в секундах. Т.е. сообщения будут отправляться каждые X секунд.", 6);
let valueTry = prompt("Сколько раз повторить использование базы данных", 1);
valueInterval = valueInterval * 1000;
console.log(valueInterval);


switcher.innerHTML = `
<span id="spanSwitch" style="font-size:20px;font-weight:bold;">Выключен</span>
`;
switcher.style = "margin:0 auto;width:50px;";
mainFooter.appendChild(switcher);

switcher.onclick = function(){
if(document.getElementById("spanSwitch").innerHTML == "Выключен"){
document.getElementById("spanSwitch").innerHTML = "Включен";
sendMessage();
console.log("Включил")
}else{
console.log('Что бы перезапустить функцию или начать всё заного перезагрузи страничку.');
}
};


function sendMessage(){
b++;
if(wordDataBase == 1){
for(let i = 0, value = 0;i < messages1.length;i++){
value = value + valueInterval;
setTimeout(function(){mainInput.innerText = messages1[i]},value);
setTimeout(simulateClick, value);

if(i == messages1.length - 1 && valueTry > b){
setTimeout(sendMessage, valueInterval + value);
console.log((valueInterval + value) / 1000);
}
console.log(value + "Цыкл1");
}
}
else if(wordDataBase == 2){
for(let i = 0, value = 0;i < messages2.length;i++){
value = value + valueInterval;
setTimeout(function(){mainInput.innerText = messages2[i]},value);
setTimeout(simulateClick, value);

if(i == messages2.length - 1 && valueTry > b){
setTimeout(sendMessage, valueInterval + value);
}
}
}
else if(wordDataBase == 3){
for(let i = 0, value = 0;i < messages3.length;i++){
value = value + valueInterval;
setTimeout(function(){mainInput.innerText = messages3[i]},value);
setTimeout(simulateClick, value);

if(i == messages3.length - 1 && valueTry > b){
setTimeout(sendMessage, valueInterval + value);
}
}
}
else if(wordDataBase == 4){
for(let i = 0, value = 0;i < messages4.length;i++){
value = value + valueInterval;
setTimeout(function(){mainInput.innerText = messages4[i]},value);
setTimeout(simulateClick, value);

if(i == messages4.length - 1 && valueTry > b){
setTimeout(sendMessage, valueInterval + value);
}
}
}
};

function simulateClick(){
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else{
    console.log ("*** Target node not found!");
}

function triggerMouseEvent (node, eventType) {
    let clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

console.log("Цыкл автоклика перезагружается");
};






console.log("Сработало");
},5000);