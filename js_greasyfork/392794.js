// ==UserScript==
// @name             PrivateBot for PetriDish.pw!
// @name:ru          ПриватныйБот для Чашка Петри!
// @version          1.1.0
// @description      Fedd|Bots|Say mass|Check server|Info|And More
// @description:ru   МАКРОСЫ|БОТЫ|Масса в чат|Чек серверов|И многое ещё
// @match            http://petridish.pw/ru/
// @match            http://petridish.pw/en/
// @match            http://petridish.pw/fr/
// @namespace        https://greasyfork.org/users/83424
// @downloadURL https://update.greasyfork.org/scripts/392794/PrivateBot%20for%20PetriDishpw%21.user.js
// @updateURL https://update.greasyfork.org/scripts/392794/PrivateBot%20for%20PetriDishpw%21.meta.js
// ==/UserScript==



console.clear();
console.log("%cСкрипт успешно загружен!", "color:red;");
console.log("Инструкция:");
console.log('%cНажмите '+'%cNumpad 0, '+"%cчтобы посмотреть дополнительные команды!", "color:black;", "color:blue;", "color:black;"); // Ссылка на функцию help()
console.log('%c     1. Автоматическая стрельба на W активирована по зажатию!', 'background: rgba(0, 0, 255, .7); color: #bada55; padding: 3px;'); // Пока не сделано
console.log('%c     2. Перезаход на сервер игроком! NumPad 1 - активация!', 'background: rgba(0, 0, 255, .7); color: #bada55; padding: 3px;'); // Готово
console.log('%c     3. Перезаход на сервер спектором! NumPad 2 - активация!', 'background: rgba(0, 0, 255, .7); color: #bada55; padding: 3px;'); // Готово
console.log('%c     4. Включение рекомендуемых настроек игры(Недоделано)! NumPad 3 - активация!', 'background: rgba(0, 0, 255, .7); color: #bada55;padding: 3px;'); // Готово
console.log('%c     5. Написание массы в чат(Недоделано)! NumPad 4 - активация!', 'background: rgba(0, 0, 255, .7); color: #bada55; padding: 3px;'); // Готово



document.getElementById("top-game").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_C'>   PrivateBot for Petrdish.pw! </span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_z'>  <b></b> _____________ </span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_u'>  <b></b> NumPad 1 - reconnect to player </span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'>  <b></b> NumPad 2 - reconnect to spect </span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_h'>  <b></b> NumPad 4 - Say mass </span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_z'>  <b></b> NumPad 5 - Menu On </span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_z'>  <b></b> NumPad 6 - Menu Off </span></span></center>";

document.getElementById("top-game").innerHTML += "<center><span class='text-muted2'><span data-itr='instructions_C1'></span>1. w spam: S/D activate</span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted2'><span data-itr='instructions_C1'></span>2. r spam: not work!</span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted2'><span data-itr='instructions_z1'>  <b></b>3. Alt+4: fast respawn and jump</span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted2'><span data-itr='instructions_u1'>  <b></b>4. Alt+5: connect to server</span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted2'><span data-itr='instructions_31'>  <b></b>5. Alt+6: Player >= 2</span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted2'><span data-itr='instructions_h1'>  <b></b>7. Alt+7: Check OneShot</span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted2'><span data-itr='instructions_h1'>  <b></b>8. Alt+8: List closed Server in console</span></span></center>";
document.getElementById("top-game").innerHTML += "<center><span class='text-muted2'><span data-itr='instructions_h1'>  <b></b>9. Alt+9: Check open server</span></span></center>";

$('#top-game > center:nth-child(11)').hide();
$('#top-game > center:nth-child(12)').hide();
$('#top-game > center:nth-child(13)').hide();
$('#top-game > center:nth-child(14)').hide();
$('#top-game > center:nth-child(15)').hide();
$('#top-game > center:nth-child(16)').hide();
$('#top-game > center:nth-child(17)').hide();
$('#top-game > center:nth-child(18)').hide();


var dkey = [87, 83, 68]
key = dkey;


var rdd = {

	set: function (s, tx) {
		console.log("%c%s ", 'background: #7aa1bd; color: #fff;margin: 0; padding: 3px;', s.toUpperCase(), tx);
	}
}

window.addEventListener("keydown", keydown),
window.addEventListener("keyup", keyup);


function keydown(event) {
	if (event.keyCode == 96) {
help();                      // Перезаход на сервер игроком!Нумпад0
}	
	if (event.keyCode == key[1] && !rdd.feed) {
			rdd.feed = true;
			feed();
	}
	if (event.keyCode == key[0] && !rdd.feed) {
			rdd.feed = true;
			feed();
		}

   else	if (event.keyCode == 97) {
server_reboot();                      // Перезаход на сервер игроком! Нумпад1
}
	else if (event.keyCode == 98) {
server_reboot_spect();                      // Перезаход на сервер спектом! Нумпад2
}
	else if (event.keyCode == 99) {
recomed_setting();                      // Рекомендуемые настройки! Нумпад3
}
	else if (event.keyCode == 100) {
send_mass();                      // Написание массы в чат! Нумпад4
}

// Это активация для дополнительных функций
	else if (event.altKey && event.keyCode == 49) {
start_w();                      // 1.!Alt + Нумпад1
}
	else if (event.altKey && event.keyCode == 50) {
start_r();                      // 2.!Alt + Нумпад2
}

	else if (event.altKey && event.keyCode == 51) {
nickname_base();                      // 3.!Alt + Нумпад3
}

	else if (event.altKey && event.keyCode == 52) {
play_jump();                      // 4.!Alt + Нумпад4
}

	else if (event.altKey && event.keyCode == 53) {
gotoserver();                      // 5.!Alt + Нумпад5
}

	else if (event.altKey && event.keyCode == 54) {
entry_check();                      // 6.!Alt + Нумпад6
}

	else if (event.altKey && event.keyCode == 55) {
stage1();                      // 7.!Alt + Нумпад7
}

	else if (event.altKey && event.keyCode == 56) {
closedserver();                      // 8.!Alt + Нумпад8
}

	else if (event.altKey && event.keyCode == 57) {
startcheck();                      // 9.!Alt + Нумпад9
}
	else if (event.keyCode == 101) {
$('#top-game > center:nth-child(3)').hide() // 1 месседж
$('#top-game > center:nth-child(4)').hide() // 2 месседж
$('#top-game > center:nth-child(5)').hide() // 3 месседж
$('#top-game > center:nth-child(6)').hide() // 4 месседж
$('#top-game > center:nth-child(7)').hide() // 5 месседж
$('#top-game > center:nth-child(8)').hide() // 6 месседж
$('#top-game > center:nth-child(9)').hide() // 7 месседж
$('#top-game > center:nth-child(10)').hide() // 7 месседж


$('#top-game > center:nth-child(11)').show()
$('#top-game > center:nth-child(12)').show()
$('#top-game > center:nth-child(13)').show()
$('#top-game > center:nth-child(14)').show()
$('#top-game > center:nth-child(15)').show()
$('#top-game > center:nth-child(16)').show()
$('#top-game > center:nth-child(17)').show()
$('#top-game > center:nth-child(18)').show()
}
	else if (event.keyCode == 102) {
$('#top-game > center:nth-child(11)').hide()
$('#top-game > center:nth-child(12)').hide()
$('#top-game > center:nth-child(13)').hide()
$('#top-game > center:nth-child(14)').hide()
$('#top-game > center:nth-child(15)').hide()
$('#top-game > center:nth-child(16)').hide()
$('#top-game > center:nth-child(17)').hide()
$('#top-game > center:nth-child(18)').hide()

$('#top-game > center:nth-child(3)').show() // 1 месседж
$('#top-game > center:nth-child(4)').show() // 2 месседж
$('#top-game > center:nth-child(5)').show() // 3 месседж
$('#top-game > center:nth-child(6)').show() // 4 месседж
$('#top-game > center:nth-child(7)').show() // 5 месседж
$('#top-game > center:nth-child(8)').show() // 6 месседж
$('#top-game > center:nth-child(9)').show() // 7 месседж
$('#top-game > center:nth-child(10)').show() // 7 месседж
}
};

function keyup(event) {
	if (!isTyping) {
		if (event.keyCode == key[2]) {
			rdd.feed = false;
		}
		if (event.keyCode == key[0]) {
			rdd.feed = false;
		}
	}
}

function help() {
console.log ("1. Чтобы активировать зажатую клавишу W по биндам, введите " + "%cAlt + 1" + "%c S - включение; D - выключение!","color:blue;" ,"color:black;"); // есть
console.log ("2. Чтобы активировать зажатую клавишу R по биндам, введите " + "%cAlt + 2" + "%c S - включение; D - выключение!","color:blue;" ,"color:black;"); // есть
console.log ("3. Чтобы просмотреть доступные никнеймы и сменить на желаемый, введите " + "%cAlt + 3","color:blue;"); // нет
console.log ("4. Для активация рестарта после смерти и пробелов в игре, введите " + "%cAlt + 4","color:blue;"); // есть
console.log ("5. Чтобы попасть на указанный сервер по IP, введите " + "%cAlt + 5","color:blue;"); // есть
console.log ("6. Чтобы запустить проверку сервера на вход игрока(Закрытые ваншонты, мониторинг 1 И 19 сервера, вызов сообщения если неизвестный игрок пришёл), введите " + "%cAlt + 6","color:blue;"); // есть
console.log ("7. Чтобы запустить проверку закрытых серверов ваншотов мегасплит, введите, " + "%cAlt + 7","color:blue;"); // есть
console.log ("8. Чтобы узнать IP закрытых серверов, введите " + "%cAlt + 8","color:blue;"); // есть
console.log ("9. Чтобы чекнуть открытые сервера на наличие сходки единоразово, введите " + "%cAlt + 9","color:blue;"); // есть
}




//игрок. Нумпад1
function server_reboot() {
$('.server-item.active').prev('[style="display: flex;"]').click()
spectatebtnclick();
$('.server-item.active').next('[style="display: flex;"]').click()
goplay()
}
//спект. Нумпад2
function server_reboot_spect() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
}


// Включение рекомендуемых настроек! PS. Сделать проверку на актив конкретных настроек!!!!!! Нумпад3



function recomed_setting() {
$("#option-common > ul > li:nth-child(1) > label").click();
$("#option-common > ul > li:nth-child(3) > label").click();
$("#option-chat > ul > li:nth-child(1) > label").click();
$("#option-chat > ul > li:nth-child(2) > label").click();
$("#option-graphic > ul > li:nth-child(2) > label").click();
$("#option-graphic > ul > li:nth-child(3) > label").click();
$("#option-graphic > ul > li:nth-child(4) > label").click();
$("#option-graphic > ul > li:nth-child(21) > label").click();
$("#option-graphic > ul > li:nth-child(22) > label").click();
$("#option-graphic > ul > li:nth-child(23) > label").click();
$("#option-graphic > ul > li:nth-child(24) > label").click();
$("#option-graphic > ul > li:nth-child(25) > label").click();
$("#option-graphic > ul > li:nth-child(26) > label").click();
}


//Написание массы в чат! Нумпад4


function send_mass() {
var isCyrillic = function (text) {
return /[а-я]/i.test(text);
}
var test = document.getElementById( 'ingamenowmass' );
var ez123 = ( test.textContent );
if ((isCyrillic(ez123)) == true) send_mass_rus();
if ((isCyrillic(ez123)) == false) send_mass_eng();




function send_mass_eng() {
var test = document.getElementById( 'ingamenowmass' );
var ez = ( test.textContent );
text = ez.slice(0, ez.lastIndexOf("Mass"));
$("#chattextbox").val("Mass: " + text);
$("body").trigger($.Event("keydown", {keyCode: 13}));
$("body").trigger($.Event("keyup", {keyCode: 13}));
$("body").trigger($.Event("keydown", {keyCode: 13}));
$("body").trigger($.Event("keyup", {keyCode: 13}));
}


function send_mass_rus() {
var test = document.getElementById( 'ingamenowmass' );
var ez = ( test.textContent );
text = ez.slice(0, ez.lastIndexOf("Масса"));
$("#chattextbox").val("Mass: " + text);
$("body").trigger($.Event("keydown", {keyCode: 13}));
$("body").trigger($.Event("keyup", {keyCode: 13}));
$("body").trigger($.Event("keydown", {keyCode: 13}));
$("body").trigger($.Event("keyup", {keyCode: 13}));
}
}


function start_r() {
console.log("%cАвтоматическое очищение карты на S/D активирована!", "color:red;");
function keydown(a) {
rdd.dev && rdd.log("Click = " + a.keyCode), 83 !== a.keyCode || rdd.feed || (rdd.feed = !0, feed());
}
function keyup(a) {
rdd.dev && rdd.log("UP = " + a.keyCode), 68 === a.keyCode && (rdd.feed = !1);
}
function feed() {
rdd.feed && "" !== currentmode && (window.onkeydown({
keyCode: 82
}), window.onkeyup({
keyCode: 82
}), setTimeout(feed, rdd.speedw))
}
var rdd = {
log: function (a) {
},
};
window.addEventListener("keydown", keydown),
window.addEventListener("keyup", keyup);
};




// Автоматический ццц и S/D

function feed() {
	if (rdd.feed && currentmode !== 'SNAKERDISH') {
		$("body").trigger($.Event("keydown", {
				keyCode: 87
			}));
		$("body").trigger($.Event("keyup", {
				keyCode: 87
			}));
		setTimeout(feed, rdd.sw);
	}
}





function play_jump() {
let timerId = setInterval(() => console.log(goplay()), 1000);
let timerId1 = setInterval(() => console.log(w1()), 500);

function w1() {
$("body").trigger($.Event("keydown", {keyCode: 32}));
$("body").trigger($.Event("keyup", {keyCode: 32}));
};
};


function gotoserver() {
var age = prompt('На какой сервер хотите попасть?',);
$("li:nth-child(93)").attr("data-ip", age);
$("li:nth-child(93)").click();
goplay();
};



function entry_check() {
	var date = new Date();
var timerId = setInterval(function() {
if (onlinestat >= 2) console.log (pidor());
if (onlinestat >= 2) alert ('Левый игрок пришёл');
if (onlinestat >= 2) stop();
if (onlinestat >= 2) blyat();

}, 100);

function stop() {
clearInterval(timerId);
}

function blyat() {
var date = new Date();
var timerId2 = setInterval(function() {
if (onlinestat == 1) console.log (one());
if (onlinestat == 1) console.log (stop2());

}, 100);

function stop2() {
clearInterval(timerId2);
}
}

function pidor() {
var date = new Date();
var $1 = "=======================================================";
if (onlinestat == 1) {
console.log (one());
}
console.log(console.clear());
console.log($1);
console.log (date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds() + " : " + date.getMilliseconds() + " - Время входа игрока на сервер.");
console.log($1);
}

function one() {
var $1 = "=======================================================";
var date = new Date();
console.log($1);
console.log (date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds() + " : " + date.getMilliseconds() + " - Время ухода игрока с сервера.");
console.log($1);
};
};








function OS2server5razreboot() {


let timerId2 = setInterval(() => console.log ( OS2server() ), 10000);
setTimeout(() => { clearInterval(timerId2); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId2); console.log (nextserver2()); }, 60000);




};


function OS2server() {

console.log(OneShot2servernext());

function OneShot2servernext() {
function OneShot2serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot2serverprev());
};
setTimeout(OneShot2serverCheck, 3000)
};


function OneShot2serverprev() {
function OneShot2serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot2serverCheckPrev, 3000)
};

};




// 3 вш
function OS3server5razreboot() {


let timerId3 = setInterval(() => console.log ( OS3server() ), 10000);
setTimeout(() => { clearInterval(timerId3); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId3); console.log (nextserver3()); }, 60000);




};


function OS3server() {

console.log(OneShot3servernext());

function OneShot3servernext() {
function OneShot3serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot3serverprev());
};
setTimeout(OneShot3serverCheck, 3000)
};


function OneShot3serverprev() {
function OneShot3serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot3serverCheckPrev, 3000)
};

};


// 5 вш
function OS5server5razreboot() {


let timerId5 = setInterval(() => console.log ( OS5server() ), 10000);
setTimeout(() => { clearInterval(timerId5); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId5); console.log (nextserver5()); }, 60000);




};



function OS5server() {

console.log(OneShot5servernext());


function OneShot5servernext() {
function OneShot5serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot5serverprev());
};
setTimeout(OneShot5serverCheck, 3000)
};


function OneShot5serverprev() {
function OneShot5serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot5serverCheckPrev, 3000)
};

};



// 6 вш
function OS6server5razreboot() {


let timerId6 = setInterval(() => console.log ( OS6server() ), 10000);
setTimeout(() => { clearInterval(timerId6); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId6); console.log (nextserver6()); }, 60000);




};


function OS6server() {

console.log(OneShot6servernext());

function OneShot6servernext() {
function OneShot6serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot6serverprev());
};
setTimeout(OneShot6serverCheck, 3000)
};


function OneShot6serverprev() {
function OneShot6serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot6serverCheckPrev, 3000)
};

};



// 7 вш
function OS7server5razreboot() {


let timerId7 = setInterval(() => console.log ( OS7server() ), 10000);
setTimeout(() => { clearInterval(timerId7); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId7); console.log (nextserver7()); }, 60000);




};


function OS7server() {

console.log(OneShot7servernext());

function OneShot7servernext() {
function OneShot7serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot7serverprev());
};
setTimeout(OneShot7serverCheck, 3000)
};


function OneShot7serverprev() {
function OneShot7serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot7serverCheckPrev, 3000)
};

};




// 8 вш
function OS8server5razreboot() {


let timerId8 = setInterval(() => console.log ( OS8server() ), 10000);
setTimeout(() => { clearInterval(timerId8); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId8); console.log (nextserver8()); }, 60000);




};


function OS8server() {

console.log(OneShot8servernext());

function OneShot8servernext() {
function OneShot8serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot8serverprev());
};
setTimeout(OneShot8serverCheck, 3000)
};


function OneShot8serverprev() {
function OneShot8serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot8serverCheckPrev, 3000)
};

};



// 9 вш
function OS9server5razreboot() {


let timerId9 = setInterval(() => console.log ( OS9server() ), 10000);
setTimeout(() => { clearInterval(timerId9); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId9); console.log (nextserver9()); }, 60000);




};


function OS9server() {

console.log(OneShot9servernext());

function OneShot9servernext() {
function OneShot9serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot9serverprev());
};
setTimeout(OneShot9serverCheck, 3000)
};


function OneShot9serverprev() {
function OneShot9serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot9serverCheckPrev, 3000)
};

};



// 10 вш
function OS10server5razreboot() {


let timerId10 = setInterval(() => console.log ( OS10server() ), 10000);
setTimeout(() => { clearInterval(timerId10); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId10); console.log (nextserver10()); }, 60000);




};


function OS10server() {

console.log(OneShot10servernext());

function OneShot10servernext() {
function OneShot10serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot10serverprev());
};
setTimeout(OneShot10serverCheck, 3000)
};


function OneShot10serverprev() {
function OneShot10serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot10serverCheckPrev, 3000)
};

};



// 11 вш
function OS11server5razreboot() {


let timerId11 = setInterval(() => console.log ( OS11server() ), 10000);
setTimeout(() => { clearInterval(timerId11); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId11); console.log (nextserver11()); }, 60000);




};

function OS11server() {

console.log(OneShot11servernext());

function OneShot11servernext() {
function OneShot11serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot11serverprev());
};
setTimeout(OneShot11serverCheck, 3000)
};


function OneShot11serverprev() {
function OneShot11serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot11serverCheckPrev, 3000)
};

};




// 12 вш
function OS12server5razreboot() {


let timerId12 = setInterval(() => console.log ( OS12server() ), 10000);
setTimeout(() => { clearInterval(timerId12); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId12); console.log (nextserver12()); }, 60000);




};

function OS12server() {

console.log(OneShot12servernext());

function OneShot12servernext() {
function OneShot12serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot12serverprev());
};
setTimeout(OneShot12serverCheck, 3000)
};


function OneShot12serverprev() {
function OneShot12serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot12serverCheckPrev, 3000)
};

};




// 13 вш
function OS13server5razreboot() {


let timerId13 = setInterval(() => console.log ( OS13server() ), 10000);
setTimeout(() => { clearInterval(timerId13); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId13); console.log (nextserver13()); }, 60000);




};


function OS13server() {

console.log(OneShot13servernext());

function OneShot13servernext() {
function OneShot13serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot13serverprev());
};
setTimeout(OneShot13serverCheck, 3000)
};


function OneShot13serverprev() {
function OneShot13serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot13serverCheckPrev, 3000)
};

};




// 14 вш
function OS14server5razreboot() {


let timerId14 = setInterval(() => console.log ( OS14server() ), 10000);
setTimeout(() => { clearInterval(timerId14); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId14); console.log (nextserver14()); }, 60000);




};

function OS14server() {

console.log(OneShot14servernext());

function OneShot14servernext() {
function OneShot14serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot14serverprev());
};
setTimeout(OneShot14serverCheck, 3000)
};


function OneShot14serverprev() {
function OneShot14serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot14serverCheckPrev, 3000)
};

};




// 15 вш
function OS15server5razreboot() {


let timerId15 = setInterval(() => console.log ( OS15server() ), 10000);
setTimeout(() => { clearInterval(timerId15); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId15); console.log (nextserver15()); }, 60000);




};

function OS15server() {

console.log(OneShot15servernext());

function OneShot15servernext() {
function OneShot15serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot15serverprev());
};
setTimeout(OneShot15serverCheck, 3000)
};


function OneShot15serverprev() {
function OneShot15serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot15serverCheckPrev, 3000)
};

};




// 16 вш
function OS16server5razreboot() {


let timerId16 = setInterval(() => console.log ( OS16server() ), 10000);
setTimeout(() => { clearInterval(timerId16); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId16); console.log (nextserver16()); }, 60000);




};

function OS16server() {

console.log(OneShot16servernext());

function OneShot16servernext() {
function OneShot16serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot16serverprev());
};
setTimeout(OneShot16serverCheck, 3000)
};


function OneShot16serverprev() {
function OneShot16serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot16serverCheckPrev, 3000)
};

};




// 17 вш
function OS17server5razreboot() {


let timerId17 = setInterval(() => console.log ( OS17server() ), 10000);
setTimeout(() => { clearInterval(timerId17); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId17); console.log (nextserver17()); }, 60000);




};

function OS17server() {

console.log(OneShot17servernext());

function OneShot17servernext() {
function OneShot17serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot17serverprev());
};
setTimeout(OneShot17serverCheck, 3000)
};


function OneShot17serverprev() {
function OneShot17serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot17serverCheckPrev, 3000)
};

};




// 18 вш
function OS18server5razreboot() {


let timerId18 = setInterval(() => console.log ( OS18server() ), 10000);
setTimeout(() => { clearInterval(timerId18); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId18); console.log (nextserver18()); }, 60000);




};

function OS18server() {

console.log(OneShot18servernext());

function OneShot18servernext() {
function OneShot18serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot18serverprev());
};
setTimeout(OneShot18serverCheck, 3000)
};


function OneShot18serverprev() {
function OneShot18serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot18serverCheckPrev, 3000)
};

};




// 19 вш
function OS19server5razreboot() {


let timerId19 = setInterval(() => console.log ( OS19server() ), 10000);
setTimeout(() => { clearInterval(timerId19); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId19); console.log (nextserver19()); }, 60000);




};

function OS19server() {

console.log(OneShot19servernext());

function OneShot19servernext() {
function OneShot19serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot19serverprev());
};
setTimeout(OneShot19serverCheck, 3000)
};


function OneShot19serverprev() {
function OneShot19serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot19serverCheckPrev, 3000)
};

};







// 4 вш
function OS4server5razreboot() {


let timerId4 = setInterval(() => console.log ( OS4server() ), 10000);
setTimeout(() => { clearInterval(timerId4); console.log ('stop'); }, 50000);
setTimeout(() => { clearInterval(timerId4); console.log (nextserver4()); }, 60000);




};

function OS4server() {

console.log(OneShot4servernext());

function OneShot4servernext() {
function OneShot4serverCheck() {

$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log(OneShot4serverprev());
};
setTimeout(OneShot4serverCheck, 3000)
};


function OneShot4serverprev() {
function OneShot4serverCheckPrev() {
$('.server-item.active').prev('[style="display: flex;"]').click()
goplay();

};
setTimeout(OneShot4serverCheckPrev, 3000)
};

};


//Основная часть бота для чека вш!


 




















//Panel
function callstage1() { console.log ( stage1() ) };
function callstage2() { console.log ( stage2() ) };
function callstage3() { console.log ( stage3() ) };




function stage1() {
var timerId = setInterval(function() {
$('li#CRSPL.mode-item').click();
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:951");
console.log ( 'Заменён айпи на 2-ой ваншот.' )
console.log ( stap() )
console.log ( next2() )
}, 3000);
function stap() {
clearInterval(timerId);
};
};

function next2() {
var timerId2 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:952");
console.log ( 'Заменён айпи на 3-ий ваншот.' )
console.log ( stap2() )
console.log ( next3() )
}, 3000);
function stap2() {
clearInterval(timerId2);
};
};

function next3() {
var timerId3 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:954");
console.log ( 'Заменён айпи на 5-ый ваншот.' )
console.log ( stap3() )
console.log ( next4() )
}, 3000);
function stap3() {
clearInterval(timerId3);
};
};




function next4() {
var timerId4 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:955");
console.log ( 'Заменён айпи на 6-ой ваншот.' )
console.log ( stap4() )
console.log ( next5() )
}, 3000);
function stap4() {
clearInterval(timerId4);
};
};


function next5() {
var timerId5 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:956");
console.log ( 'Заменён айпи на 7-ой ваншот.' )
console.log ( stap5() )
console.log ( next6() )
}, 3000);
function stap5() {
clearInterval(timerId5);
};
};


function next6() {
var timerId6 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:957");
console.log ( 'Заменён айпи на 8-ой ваншот.' )
console.log ( stap6() )
console.log ( next7() )
}, 3000);
function stap6() {
clearInterval(timerId6);
};
};


function next7() {
var timerId7 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:958");
console.log ( 'Заменён айпи на 9-ый ваншот.' )
console.log ( stap7() )
console.log ( next8() )
}, 3000);
function stap7() {
clearInterval(timerId7);
};
};


function next8() {
var timerId8 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:959");
console.log ( 'Заменён айпи на 10-ый ваншот.' )
console.log ( stap8() )
console.log ( next9() )
}, 3000);
function stap8() {
clearInterval(timerId8);
};
};

function next9() {
var timerId9 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:960");
console.log ( 'Заменён айпи на 11-ый ваншот.' )
console.log ( stap9() )
console.log ( next10() )
}, 3000);
function stap9() {
clearInterval(timerId9);
};
};

function next10() {
var timerId10 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:961");
console.log ( 'Заменён айпи на 12-ый ваншот.' )
console.log ( stap10() )
console.log ( next11() )
}, 3000);
function stap10() {
clearInterval(timerId10);
};
};

function next11() {
var timerId11 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:962");
console.log ( 'Заменён айпи на 13-ый ваншот.' )
console.log ( stap11() )
console.log ( next12() )
}, 3000);
function stap11() {
clearInterval(timerId11);
};
};

function next12() {
var timerId12 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","5.189.239.69:940");
console.log ( 'Заменён айпи на 14-ый ваншот.' )
console.log ( stap12() )
console.log ( next13() )
}, 3000);
function stap12() {
clearInterval(timerId12);
};
};

function next13() {
var timerId13 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","5.189.239.69:941");
console.log ( 'Заменён айпи на 15-ый ваншот.' )
console.log ( stap13() )
console.log ( next14() )
}, 3000);
function stap13() {
clearInterval(timerId13);
};
};

function next14() {
var timerId14 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","5.189.239.69:942");
console.log ( 'Заменён айпи на 16-ый ваншот.' )
console.log ( stap14() )
console.log ( next15() )
}, 3000);
function stap14() {
clearInterval(timerId14);
};
};

function next15() {
var timerId15 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","5.189.239.69:943");
console.log ( 'Заменён айпи на 17-ый ваншот.' )
console.log ( stap15() )
console.log ( next16() )
}, 3000);
function stap15() {
clearInterval(timerId15);
};
};

function next16() {
var timerId16 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","5.189.239.69:944");
console.log ( 'Заменён айпи на 18-ый ваншот.' )
console.log ( stap16() )
console.log ( next17() )
}, 3000);
function stap16() {
clearInterval(timerId16);
};
};

function next17() {
var timerId17 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.182:985");
console.log ( 'Заменён айпи на 19-ый ваншот.' )
console.log ( stap17() )
console.log ( next18() )
}, 3000);
function stap17() {
clearInterval(timerId17);
};
};

function next18() {
var timerId18 = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
$("li.server-item.active").attr("data-ip","213.32.7.181:983");
console.log ( 'Заменён айпи на 4-ый ваншот.' )
console.log ( stap18() )
console.log ( 'Работа завершена!' )

console.log ( callstage2() )


}, 3000);
function stap18() {
clearInterval(timerId18);
};
};




// 2 вш
function stage3() {
var check1server = setInterval(function() {
$('.server-item.active').prev('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop1() )
console.log (onlinestat)


function sayHi2() { if (onlinestat == 1) console.log ( nextserver2() ); } setTimeout(sayHi2, 3000);
function sayHi2q() { if (onlinestat == 2) console.log ( nextserver2() ); } setTimeout(sayHi2q, 3000);
function sayHi2qq() { if (onlinestat >= 3) console.log ( OS2server5razreboot() ); } setTimeout(sayHi2qq, 3000);


}, 3000);

function stop1() {
clearInterval(check1server);
};
};

// 3 вш
function nextserver2() {
var check2server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop2() )
function sayHi3() { if (onlinestat == 1) console.log ( nextserver3() ); } setTimeout(sayHi3, 3000);
function sayHi3q() { if (onlinestat == 2) console.log ( nextserver3() ); } setTimeout(sayHi3q, 3000);
function sayHi3qq() { if (onlinestat >= 3) console.log ( OS3server5razreboot() ); } setTimeout(sayHi3qq, 3000);

}, 3000);

function stop2() {
clearInterval(check2server);
};
};

// 5 вш
function nextserver3() {
var check3server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop3() )
function sayHi5() { if (onlinestat == 1) console.log ( nextserver4() ); } setTimeout(sayHi5, 3000);
function sayHi5q() { if (onlinestat == 2) console.log ( nextserver4() ); } setTimeout(sayHi5q, 3000);
function sayHi5qq() { if (onlinestat >= 3) console.log ( OS5server5razreboot() ); } setTimeout(sayHi5qq, 3000);
}, 3000);

function stop3() {
clearInterval(check3server);
};
};

// 6 вш
function nextserver4() {
var check4server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop4() )
function sayHi6() { if (onlinestat == 1) console.log ( nextserver5() ); } setTimeout(sayHi6, 3000);
function sayHi6q() { if (onlinestat == 2) console.log ( nextserver5() ); } setTimeout(sayHi6q, 3000);
function sayHi6qq() { if (onlinestat >= 3) console.log ( OS6server5razreboot() ); } setTimeout(sayHi6qq, 3000);

}, 3000);

function stop4() {
clearInterval(check4server);
};
};

// 7 вш
function nextserver5() {
var check5server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop5() )
function sayHi7() { if (onlinestat == 1) console.log ( nextserver6() ); } setTimeout(sayHi7, 3000);
function sayHi7q() { if (onlinestat == 2) console.log ( nextserver6() ); } setTimeout(sayHi7q, 3000);
function sayHi7qq() { if (onlinestat >= 3) console.log ( OS7server5razreboot() ); } setTimeout(sayHi7qq, 3000);

}, 3000);

function stop5() {
clearInterval(check5server);
};
};

// 8 вш
function nextserver6() {
var check6server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop6() )
function sayHi8() { if (onlinestat == 1) console.log ( nextserver7() ); } setTimeout(sayHi8, 3000);
function sayHi8q() { if (onlinestat == 2) console.log ( nextserver7() ); } setTimeout(sayHi8q, 3000);
function sayHi8qq() { if (onlinestat >= 3) console.log ( OS8server5razreboot() ); } setTimeout(sayHi8qq, 3000);

}, 3000);

function stop6() {
clearInterval(check6server);
};
};

// 9 вш
function nextserver7() {
var check7server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop7() )
function sayHi9() { if (onlinestat == 1) console.log ( nextserver8() ); } setTimeout(sayHi9, 3000);
function sayHi9q() { if (onlinestat == 2) console.log ( nextserver8() ); } setTimeout(sayHi9q, 3000);
function sayHi9qq() { if (onlinestat >= 3) console.log ( OS9server5razreboot() ); } setTimeout(sayHi9qq, 3000);

}, 3000);

function stop7() {
clearInterval(check7server);
};
};

// 10 вш
function nextserver8() {
var check8server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop8() )
function sayHi10() { if (onlinestat == 1) console.log ( nextserver9() ); } setTimeout(sayHi10, 3000);
function sayHi10q() { if (onlinestat == 2) console.log ( nextserver9() ); } setTimeout(sayHi10q, 3000);
function sayHi10qq() { if (onlinestat >= 3) console.log ( OS10server5razreboot() ); } setTimeout(sayHi10qq, 3000);

}, 3000);

function stop8() {
clearInterval(check8server);
};
};

// 11 вш
function nextserver9() {
var check9server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop9() )
function sayHi11() { if (onlinestat == 1) console.log ( nextserver10() ); } setTimeout(sayHi11, 3000);
function sayHi11q() { if (onlinestat == 2) console.log ( nextserver10() ); } setTimeout(sayHi11q, 3000);
function sayHi11qq() { if (onlinestat >= 3) console.log ( OS11server5razreboot() ); } setTimeout(sayHi11qq, 3000);

}, 3000);

function stop9() {
clearInterval(check9server);
};
};

// 12 вш
function nextserver10() {
var check10server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop10() )
function sayHi12() { if (onlinestat == 1) console.log ( nextserver11() ); } setTimeout(sayHi12, 3000);
function sayHi12q() { if (onlinestat == 2) console.log ( nextserver11() ); } setTimeout(sayHi12q, 3000);
function sayHi12qq() { if (onlinestat >= 3) console.log ( OS12server5razreboot() ); } setTimeout(sayHi12qq, 3000);
}, 3000);

function stop10() {
clearInterval(check10server);
};
};

// 13 вш
function nextserver11() {
var check11server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop11() )
function sayHi13() { if (onlinestat == 1) console.log ( nextserver12() ); } setTimeout(sayHi13, 3000);
function sayHi13q() { if (onlinestat == 2) console.log ( nextserver12() ); } setTimeout(sayHi13q, 3000);
function sayHi13qq() { if (onlinestat >= 3) console.log ( OS13server5razreboot() ); } setTimeout(sayHi13qq, 3000);

}, 3000);

function stop11() {
clearInterval(check11server);
};
};

// 14 вш
function nextserver12() {
var check12server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop12() )
function sayHi14() { if (onlinestat == 1) console.log ( nextserver13() ); } setTimeout(sayHi14, 3000);
function sayHi14q() { if (onlinestat == 2) console.log ( nextserver13() ); } setTimeout(sayHi14q, 3000);
function sayHi14qq() { if (onlinestat >= 3) console.log ( OS14server5razreboot() ); } setTimeout(sayHi14qq, 3000);

}, 3000);

function stop12() {
clearInterval(check12server);
};
};

// 15 вш
function nextserver13() {
var check13server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop13() )
function sayHi15() { if (onlinestat == 1) console.log ( nextserver14() ); } setTimeout(sayHi15, 3000);
function sayHi15q() { if (onlinestat == 2) console.log ( nextserver14() ); } setTimeout(sayHi15q, 3000);
function sayHi15qq() { if (onlinestat >= 3) console.log ( OS15server5razreboot() ); } setTimeout(sayHi15qq, 3000);
}, 3000);

function stop13() {
clearInterval(check13server);
};
};

// 16 вш
function nextserver14() {
var check14server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop14() )
function sayHi16() { if (onlinestat == 1) console.log ( nextserver15() ); } setTimeout(sayHi16, 3000);
function sayHi16q() { if (onlinestat == 2) console.log ( nextserver15() ); } setTimeout(sayHi16q, 3000);
function sayHi16qq() { if (onlinestat >= 3) console.log ( OS16server5razreboot() ); } setTimeout(sayHi16qq, 3000);

}, 3000);

function stop14() {
clearInterval(check14server);
};
};

// 17 вш
function nextserver15() {
var check15server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop15() )
function sayHi17() { if (onlinestat == 1) console.log ( nextserver16() ); } setTimeout(sayHi17, 3000);
function sayHi17q() { if (onlinestat == 2) console.log ( nextserver16() ); } setTimeout(sayHi17q, 3000);
function sayHi17qq() { if (onlinestat >= 3) console.log ( OS17server5razreboot() ); } setTimeout(sayHi17qq, 3000);

}, 3000);

function stop15() {
clearInterval(check15server);
};
};

// 18 вш
function nextserver16() {
var check16server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop16() )
function sayHi18() { if (onlinestat == 1) console.log ( nextserver17() ); } setTimeout(sayHi18, 3000);
function sayHi18q() { if (onlinestat == 2) console.log ( nextserver17() ); } setTimeout(sayHi18q, 3000);
function sayHi18qq() { if (onlinestat >= 3) console.log ( OS18server5razreboot() ); } setTimeout(sayHi18qq, 3000);

}, 3000);

function stop16() {
clearInterval(check16server);
};
};

// 19 вш
function nextserver17() {
var check17server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop17() )
function sayHi19() { if (onlinestat == 1) console.log ( nextserver18() ); } setTimeout(sayHi19, 3000);
function sayHi19q() { if (onlinestat == 2) console.log ( nextserver18() ); } setTimeout(sayHi19q, 3000);
function sayHi19qq() { if (onlinestat >= 3) console.log ( OS19server5razreboot() ); } setTimeout(sayHi19qq, 3000);

}, 3000);

function stop17() {
clearInterval(check17server);
};
};

// 4 вш
function nextserver18() {
var check18server = setInterval(function() {
$('.server-item.active').next('[style="display: flex;"]').click()
spectatebtnclick();
console.log ( stop18() )
function sayHi20() { if (onlinestat == 1) console.log ( callstage2()() ); } setTimeout(sayHi20, 3000);
function sayHi20q() { if (onlinestat == 2) console.log ( callstage2()() ); } setTimeout(sayHi20q, 3000);
function sayHi20qq() { if (onlinestat >= 3) console.log ( OS4server5razreboot() ); } setTimeout(sayHi20qq, 3000);

console.log ( "Работа скрипта по чеку завершена" )
//console.log ( callstage2() )
}, 3000);

function stop18() {
clearInterval(check18server);

};
};





function restartBot() {
var resBot = setInterval(function() {

console.log ( callstage3() )
console.log ( stop19() )


}, 10000); // 1 минута

function stop19() {
clearInterval(resBot);

};
};

function stage2() {
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
$('.server-item.active').prev('[style="display: flex;"]').click()
console.log ( restartBot() )
};






//Все IP закрытых серверов!

function closedserver() {
	
console.log ("%cOneShot server: ", "background: orange");
console.log ("213.32.7.181:941 - OneShotFFA2");
console.log ("213.32.7.181:942 - OneShotFFA3");
console.log ("213.32.7.181:943 - OneShotFFA4");
console.log ("213.32.7.181:944 - OneShotFFA5");
console.log ("213.32.7.181:946 - OneShotFFA6");
console.log ("213.32.7.181:947 - OneShotFFA7");
console.log ("213.32.7.181:948 - OneShotFFA8");
console.log ("213.32.7.181:949 - OneShotFFA9");
console.log ("213.32.7.181:950 - OneShotFFA10");
console.log ("213.32.7.181:951 - OneShotMegaSplit #2");
console.log ("213.32.7.181:952 - OneShotMegaSplit #3");
console.log ("213.32.7.181:983 - OneShotMegaSplit #4");
console.log ("213.32.7.181:954 - OneShotMegaSplit #5");
console.log ("213.32.7.181:955 - OneShotMegaSplit #6");
console.log ("213.32.7.181:956 - OneShotMegaSplit #7");
console.log ("213.32.7.181:957 - OneShotMegaSplit #8");
console.log ("213.32.7.181:958 - OneShotMegaSplit #9");
console.log ("213.32.7.181:959 - OneShotMegaSplit #10");
console.log ("213.32.7.181:960 - OneShotMegaSplit #11");
console.log ("213.32.7.181:961 - OneShotMegaSplit #12");
console.log ("213.32.7.181:962 - OneShotMegaSplit #13");
console.log ("5.189.239.69:940 - OneShotMegaSplit #14");
console.log ("5.189.239.69:941 - OneShotMegaSplit #15");
console.log ("5.189.239.69:942 - OneShotMegaSplit #16");
console.log ("5.189.239.69:943 - OneShotMegaSplit #17");
console.log ("5.189.239.69:944 - OneShotMegaSplit #18");
console.log ("213.32.7.182:985 - OneShotMegaSplit #19");
console.log ("%c                                                     ", "background:white");

console.log ("%cCrazy FFA server: ", "background: orange");
console.log ("213.32.7.181:902 - Crazy FFA #3");
console.log ("213.32.7.181:910 - Crazy FFA #4");
console.log ("Неизвестно - Crazy FFA #5");
console.log ("5.189.239.69:906 - Crazy FFA #6");
console.log ("%c                                                     ", "background:white");

console.log ("%cSnakerDish server: ", "background: orange");
console.log ("213.32.7.188:960 - SnakerDish #2");
console.log ("213.32.7.188:961 - SnakerDish #3");
console.log ("213.32.7.188:962 - SnakerDish #4");
console.log ("213.32.7.182:930 - SnakerDish #5");
console.log ("213.32.7.182:931 - SnakerDish #6");
console.log ("213.32.7.182:932 - SnakerDish #7");
console.log ("213.32.7.182:933 - SnakerDish #8");
console.log ("213.32.7.182:934 - SnakerDish #9");
console.log ("%c                                                     ", "background:white");

console.log ("%cSpace server: ", "background: orange");
console.log ("193.70.80.50:913 - Space #2");
console.log ("193.70.80.50:914 - Space #3");
console.log ("193.70.80.50:915 - Space #4");
console.log ("193.70.80.50:916 - Space #5");
console.log ("193.70.80.50:917 - Space #6");
console.log ("193.70.80.50:918 - Space #7");
console.log ("193.70.80.50:919 - Space #8");
console.log ("5.189.239.69:912 - Space #9");
console.log ("5.189.239.69:913 - Space #10");
console.log ("5.189.239.69:914 - Space #11");
console.log ("5.189.239.69:915 - Space #12");
console.log ("213.32.7.193:940 - Space #13");
console.log ("213.32.7.193:941 - Space #14");
console.log ("213.32.7.193:942 - Space #15");
console.log ("213.32.7.193:943 - Space #16");
console.log ("213.32.7.193:944 - Space #17");
console.log ("213.32.7.193:945 - Space #18");
console.log ("213.32.7.193:946 - Space #19");
console.log ("213.32.7.193:947 - Space #20");
console.log ("%c                                                     ", "background:white");



};


function sayHi() {
document.getElementById("chatlog").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_u'> <b></b>***** GameInfo Global Message *****:</a> Внимание! На сервере oneshotmegasplit15 игроком |...| HiresSuck! был установлен новый Рекорд - 635102! Поздравляем!</span></span></center>";
document.querySelector('#chatlog > center').style.backgroundColor = "red";
document.querySelector('#chatlog > center > span > span').style.color = "yellow";
document.querySelector('#chatlog > center').style.borderRadius = "5px";
document.querySelector('#chatlog > center').style.padding = "5px";
document.querySelector('#chatlog > center').style.textAlign = "left";
}

setTimeout(sayHi, 240000);





//Чек открытых серверов 1 раз вызовом функции!



function startcheck() {
console.log ( CheckMS5kServers() );
console.log ( CrazyFFAServers() );
console.log ( HardCoreEXPServers() );
console.log ( CrazySplitservers() );
console.log ( VirusWarsffaServers() );
console.log ( oneshotmegasplitServers() );
console.log ( MegasplitServers() );
console.log ( ExperimentalServers() );
console.log ( TeamServers() );
console.log ( FastFoodFFAervers() );
console.log ( HardCoreFFAervers() );
}



//МС5К
function CheckMS5kServers() {
var MS5K2server = document.getElementById( 'nowmegasplit5k2' ); 
if ( MS5K2server.textContent > 20 ) console.log('%c На режиме МС5К 2 сервер сходка! ', 'background: #222; color: #bada55');
if ( MS5K2server.textContent > 20 ) console.log ( MS5K2server.textContent + " игроков" + " - 2 сервер режима МС5К" )
if ( MS5K2server.textContent > 20 ) alert ( MS5K2server.textContent + " игроков" + " - 2 сервер режима МС5К" )

var MS5K3server = document.getElementById( 'nowmegasplit5k3' );
if ( MS5K3server.textContent > 15 ) console.log('%c На режиме МС5К 3 сервер сходка! ', 'background: #222; color: #bada55');
if ( MS5K3server.textContent > 15 ) console.log ( MS5K3server.textContent + " игроков" + " - 3 сервер режима МС5К" )
if ( MS5K3server.textContent > 20 ) alert ( MS5K3server.textContent + " игроков" + " - 3 сервер режима МС5К" )

var MS5K4server = document.getElementById( 'nowmegasplit5k4' );
if ( MS5K4server.textContent > 15 ) console.log('%c На режиме МС5К 4 сервер сходка! ', 'background: #222; color: #bada55');
if ( MS5K4server.textContent > 15 )console.log ( MS5K4server.textContent + " игроков" + " - 4 сервер режима МС5К" )

var MS5K5server = document.getElementById( 'nowmegasplit5k5' );
if ( MS5K5server.textContent > 15 ) console.log('%c На режиме МС5К 5 сервер сходка! ', 'background: #222; color: #bada55');
if ( MS5K5server.textContent > 15 ) console.log ( MS5K5server.textContent + " игроков" + " - 5 сервер режима МС5К")

var MS5K6server = document.getElementById( 'nowmegasplit5k6' );
if ( MS5K6server.textContent > 15 ) console.log('%c На режиме МС5К 6 сервер сходка! ', 'background: #222; color: #bada55');
if ( MS5K6server.textContent > 15 ) console.log ( MS5K6server.textContent + " игроков" + " - 6 сервер режима МС5К")

var MS5K7server = document.getElementById( 'nowmegasplit5k7' );
if ( MS5K7server.textContent > 15 ) console.log('%c На режиме МС5К 7 сервер сходка! ', 'background: #222; color: #bada55');
if ( MS5K7server.textContent > 15 ) console.log ( MS5K7server.textContent + " игроков" + " - 7 сервер режима МС5К")

var MS5K8server = document.getElementById( 'nowmegasplit5k8' );
if ( MS5K8server.textContent > 15 ) console.log('%c На режиме МС5К 8 сервер сходка! ', 'background: #222; color: #bada55');
if ( MS5K8server.textContent > 15 ) console.log ( MS5K8server.textContent + " игроков" + " - 8 сервер режима МС5К")

var MS5K9server = document.getElementById( 'nowmegasplit5k9' );
if ( MS5K9server.textContent > 15 ) console.log('%c На режиме МС5К 9 сервер сходка! ', 'background: #222; color: #bada55');
if ( MS5K9server.textContent > 15 ) console.log ( MS5K9server.textContent + " игроков" + " - 9 сервер режима МС5К")

var MS5K10server = document.getElementById( 'nowmegasplit5k10' );
if ( MS5K10server.textContent > 15 ) console.log('%c На режиме МС5К 10 сервер сходка! ', 'background: #222; color: #bada55');
if ( MS5K10server.textContent > 15 ) console.log ( MS5K10server.textContent + " игроков" + " - 10 сервер режима МС5К")

var MS5K18server = document.getElementById( 'nowmegasplit5k18' );
if ( MS5K18server.textContent > 15 ) console.log('%c На режиме МС5К 18 сервер сходка! ', 'background: #222; color: #bada55');
if ( MS5K18server.textContent > 15 ) console.log ( MS5K18server.textContent + " игроков" + " - 18 сервер режима МС5К")
};

//КС ФФА
function CrazyFFAServers() {
var CrazyFFA1server = document.getElementById( 'nowcrazy1' ); 
if ( CrazyFFA1server.textContent > 20 ) console.log('%c На Crazy FFA 1 сервер сходка! ', 'background: #222; color: #bada55');
if ( CrazyFFA1server.textContent > 20 ) console.log ( CrazyFFA1server.textContent + " игроков" + " - 1 сервер режима Crazy FFA" )

var CrazyFFA2server = document.getElementById( 'nowcrazy2' );
if ( CrazyFFA2server.textContent > 15 ) console.log('%c На Crazy FFA 2 сервер сходка! ', 'background: #222; color: #bada55');
if ( CrazyFFA2server.textContent > 15 ) console.log ( CrazyFFA2server.textContent + " игроков" + " - 2 сервер режима Crazy FFA" )
};

//Хард ЕКСП
function HardCoreEXPServers() {
var HardCoreEXP2server = document.getElementById( 'nowhardcoreexp2' ); 
if ( HardCoreEXP2server.textContent > 20 ) console.log ("На HardCoreEXP 2 сервер сходка!"); 
if ( HardCoreEXP2server.textContent > 20 ) console.log ( HardCoreEXP2server.textContent + " игроков" + " - 2 сервер режима HardCoreEXP" )

var HardCoreEXP3server = document.getElementById( 'nowhardcoreexp3' );
if ( HardCoreEXP3server.textContent > 15 ) console.log ("На HardCoreEXP 3 сервер сходка!");
if ( HardCoreEXP3server.textContent > 15 ) console.log ( HardCoreEXP3server.textContent + " игроков" + " - 3 сервер режима HardCoreEXP" )

var HardCoreEXP4server = document.getElementById( 'nowhardcoreexp4' );
if ( HardCoreEXP4server.textContent > 15 ) console.log ("На HardCoreEXP 4 сервер сходка!");
if ( HardCoreEXP4server.textContent > 15 ) console.log ( HardCoreEXP4server.textContent + " игроков" + " - 4 сервер режима HardCoreEXP" )

var HardCoreEXP5server = document.getElementById( 'nowhardcoreexp5' );
if ( HardCoreEXP5server.textContent > 15 ) console.log ("На HardCoreEXP 5 сервер сходка!");
if ( HardCoreEXP5server.textContent > 15 ) console.log ( HardCoreEXP5server.textContent + " игроков" + " - 5 сервер режима HardCoreEXP")

var HardCoreEXP6server = document.getElementById( 'nowhardcoreexp6' );
if ( HardCoreEXP6server.textContent > 15 ) console.log ("На HardCoreEXP 6 сервер сходка!");
if ( HardCoreEXP6server.textContent > 15 ) console.log ( HardCoreEXP6server.textContent + " игроков" + " - 6 сервер режима HardCoreEXP")

var HardCoreEXP7server = document.getElementById( 'nowhardcoreexp7' );
if ( HardCoreEXP7server.textContent > 15 ) console.log ("На HardCoreEXP 7 сервер сходка!");
if ( HardCoreEXP7server.textContent > 15 ) console.log ( HardCoreEXP7server.textContent + " игроков" + " - 7 сервер режима HardCoreEXP")

var HardCoreEXP8server = document.getElementById( 'nowhardcoreexp8' );
if ( HardCoreEXP8server.textContent > 15 ) console.log ("На HardCoreEXP 8 сервер сходка!");
if ( HardCoreEXP8server.textContent > 15 ) console.log ( HardCoreEXP8server.textContent + " игроков" + " - 8 сервер режима HardCoreEXP")

var HardCoreEXP9server = document.getElementById( 'nowhardcoreexp9' );
if ( HardCoreEXP9server.textContent > 15 ) console.log ("На HardCoreEXP 9 сервер сходка!");
if ( HardCoreEXP9server.textContent > 15 ) console.log ( HardCoreEXP9server.textContent + " игроков" + " - 9 сервер режима HardCoreEXP")

var HardCoreEXP10server = document.getElementById( 'nowhardcoreexp10' );
if ( HardCoreEXP10server.textContent > 15 ) console.log ("На HardCoreEXP 10 сервер сходка!");
if ( HardCoreEXP10server.textContent > 15 ) console.log ( HardCoreEXP10server.textContent + " игроков" + " - 10 сервер режима HardCoreEXP")

var HardCoreEXP21server = document.getElementById( 'nowhardcoreexp21' );
if ( HardCoreEXP21server.textContent > 15 ) console.log ("На HardCoreEXP 21 сервер сходка!");
if ( HardCoreEXP21server.textContent > 15 ) console.log ( HardCoreEXP21server.textContent + " игроков" + " - 21 сервер режима HardCoreEXP")

var HardCoreEXP22server = document.getElementById( 'nowhardcoreexp22' );
if ( HardCoreEXP22server.textContent > 15 ) console.log ("На HardCoreEXP 22 сервер сходка!");
if ( HardCoreEXP22server.textContent > 15 ) console.log ( HardCoreEXP22server.textContent + " игроков" + " - 22 сервер режима HardCoreEXP")

var HardCoreEXP41server = document.getElementById( 'nowhardcoreexp41' );
if ( HardCoreEXP41server.textContent > 15 ) console.log ("На HardCoreEXP 41 сервер сходка!");
if ( HardCoreEXP41server.textContent > 15 ) console.log ( HardCoreEXP41server.textContent + " игроков" + " - 41 сервер режима HardCoreEXP")

var HardCoreEXP50server = document.getElementById( 'nowhardcoreexp50' );
if ( HardCoreEXP50server.textContent > 15 ) console.log ("На HardCoreEXP 50 сервер сходка!");
if ( HardCoreEXP50server.textContent > 15 ) console.log ( HardCoreEXP50server.textContent + " игроков" + " - 50 сервер режима HardCoreEXP")
};

//КС
function CrazySplitservers() {
var CrazySplit2server = document.getElementById( 'nowcrazysplit2' ); 
if ( CrazySplit2server.textContent > 15 ) console.log ("На CrazySplit 2 сервер сходка!"); 
if ( CrazySplit2server.textContent > 15 ) console.log ( CrazySplit2server.textContent + " игроков" + " - 2 сервер режима Crazy FFA" )

var CrazySplit3server = document.getElementById( 'nowcrazysplit3new' );
if ( CrazySplit3server.textContent > 15 ) console.log ("На CrazySplit 3 сервер сходка!");
if ( CrazySplit3server.textContent > 15 ) console.log ( CrazySplit3server.textContent + " игроков" + " - 3 сервер режима Crazy FFA" )

var CrazySplit4server = document.getElementById( 'nowcrazysplit4' );
if ( CrazySplit4server.textContent > 15 ) console.log ("На CrazySplit 4 сервер сходка!");
if ( CrazySplit4server.textContent > 15 ) console.log ( CrazySplit4server.textContent + " игроков" + " - 4 сервер режима Crazy FFA" )

var CrazySplit5server = document.getElementById( 'nowcrazysplit5' );
if ( CrazySplit5server.textContent > 15 ) console.log ("На CrazySplit 5 сервер сходка!");
if ( CrazySplit5server.textContent > 15 ) console.log ( CrazySplit5server.textContent + " игроков" + " - 5 сервер режима Crazy FFA" )

var CrazySplit6server = document.getElementById( 'nowcrazysplit6' );
if ( CrazySplit6server.textContent > 15 ) console.log ("На CrazySplit 6 сервер сходка!");
if ( CrazySplit6server.textContent > 15 ) console.log ( CrazySplit6server.textContent + " игроков" + " - 6 сервер режима Crazy FFA" )

var CrazySplit7server = document.getElementById( 'nowcrazysplit7' );
if ( CrazySplit7server.textContent > 15 ) console.log ("На CrazySplit 7 сервер сходка!");
if ( CrazySplit7server.textContent > 15 ) console.log ( CrazySplit7server.textContent + " игроков" + " - 7 сервер режима Crazy FFA" )

var CrazySplit8server = document.getElementById( 'nowcrazysplit8' );
if ( CrazySplit8server.textContent > 15 ) console.log ("На CrazySplit 8 сервер сходка!");
if ( CrazySplit8server.textContent > 15 ) console.log ( CrazySplit8server.textContent + " игроков" + " - 8 сервер режима Crazy FFA" )

var CrazySplit9server = document.getElementById( 'nowcrazysplit9' );
if ( CrazySplit9server.textContent > 15 ) console.log ("На CrazySplit 9 сервер сходка!");
if ( CrazySplit9server.textContent > 15 ) console.log ( CrazySplit9server.textContent + " игроков" + " - 9 сервер режима Crazy FFA" )

var CrazySplit10server = document.getElementById( 'nowcrazysplit10' );
if ( CrazySplit10server.textContent > 15 ) console.log ("На CrazySplit 10 сервер сходка!");
if ( CrazySplit10server.textContent > 15 ) console.log ( CrazySplit10server.textContent + " игроков" + " - 10 сервер режима Crazy FFA" )

var CrazySplit11server = document.getElementById( 'nowcrazysplit11' );
if ( CrazySplit11server.textContent > 15 ) console.log ("На CrazySplit 11 сервер сходка!");
if ( CrazySplit11server.textContent > 15 ) console.log ( CrazySplit11server.textContent + " игроков" + " - 11 сервер режима Crazy FFA" )

var CrazySplit12server = document.getElementById( 'nowcrazysplit12' );
if ( CrazySplit12server.textContent > 15 ) console.log ("На CrazySplit 12 сервер сходка!");
if ( CrazySplit12server.textContent > 15 ) console.log ( CrazySplit12server.textContent + " игроков" + " - 12 сервер режима Crazy FFA" )

var CrazySplit13server = document.getElementById( 'nowcrazysplit13' );
if ( CrazySplit13server.textContent > 15 ) console.log ("На CrazySplit 13 сервер сходка!");
if ( CrazySplit13server.textContent > 15 ) console.log ( CrazySplit13server.textContent + " игроков" + " - 13 сервер режима Crazy FFA" )

var CrazySplit14server = document.getElementById( 'nowcrazysplit14' );
if ( CrazySplit14server.textContent > 15 ) console.log ("На CrazySplit 14 сервер сходка!");
if ( CrazySplit14server.textContent > 15 ) console.log ( CrazySplit14server.textContent + " игроков" + " - 14 сервер режима Crazy FFA" )

var CrazySplit15server = document.getElementById( 'nowcrazysplit15' );
if ( CrazySplit15server.textContent > 15 ) console.log ("На CrazySplit 15 сервер сходка!");
if ( CrazySplit15server.textContent > 15 ) console.log ( CrazySplit15server.textContent + " игроков" + " - 15 сервер режима Crazy FFA" )

var CrazySplit16server = document.getElementById( 'nowcrazysplit16' );
if ( CrazySplit16server.textContent > 15 ) console.log ("На CrazySplit 16 сервер сходка!");
if ( CrazySplit16server.textContent > 15 ) console.log ( CrazySplit16server.textContent + " игроков" + " - 16 сервер режима Crazy FFA" )

var CrazySplit17server = document.getElementById( 'nowcrazysplit17' );
if ( CrazySplit17server.textContent > 15 ) console.log ("На CrazySplit 17 сервер сходка!");
if ( CrazySplit17server.textContent > 15 ) console.log ( CrazySplit17server.textContent + " игроков" + " - 17 сервер режима Crazy FFA" )

var CrazySplit18server = document.getElementById( 'nowcrazysplit18' );
if ( CrazySplit18server.textContent > 15 ) console.log ("На CrazySplit 18 сервер сходка!");
if ( CrazySplit18server.textContent > 15 ) console.log ( CrazySplit18server.textContent + " игроков" + " - 18 сервер режима Crazy FFA" )

var CrazySplit19server = document.getElementById( 'nowcrazysplit19' );
if ( CrazySplit19server.textContent > 15 ) console.log ("На CrazySplit 19 сервер сходка!");
if ( CrazySplit19server.textContent > 15 ) console.log ( CrazySplit19server.textContent + " игроков" + " - 19 сервер режима Crazy FFA" )

var CrazySplit20server = document.getElementById( 'nowcrazysplit20' );
if ( CrazySplit20server.textContent > 15 ) console.log ("На CrazySplit 20 сервер сходка!");
if ( CrazySplit20server.textContent > 15 ) console.log ( CrazySplit20server.textContent + " игроков" + " - 20 сервер режима Crazy FFA" )

var CrazySplit21server = document.getElementById( 'nowcrazysplit21' );
if ( CrazySplit21server.textContent > 70 ) console.log ("На CrazySplit 21 сервер сходка!");
if ( CrazySplit21server.textContent > 70 ) console.log ( CrazySplit21server.textContent + " игроков" + " - 21 сервер режима Crazy FFA" )
};

//ВирусВарс
function VirusWarsffaServers() {
var VirusWarsffaserver = document.getElementById( 'nowviruswarsffa6' ); 
if ( VirusWarsffaserver.textContent > 20 ) console.log ("На VirusWarsffa 1 сервер сходка!"); 
if ( VirusWarsffaserver.textContent > 20 ) console.log ( VirusWarsffaserver.textContent + " игроков" + " - 1 сервер режима VirusWarsffa" )
};

//ВШ
function oneshotmegasplitServers() {
var oneshotmegasplit1server = document.getElementById( 'nowoneshotmegasplit1' ); 
if ( oneshotmegasplit1server.textContent > 20 ) console.log ("На oneshotmegasplit 1 сервер сходка!"); 
if ( oneshotmegasplit1server.textContent > 20 ) console.log ( oneshotmegasplit1server.textContent + " игроков" + " - 1 сервер режима oneshotmegasplit" )

var oneshotmegasplit30server = document.getElementById( 'nowoneshotmegasplit20' ); 
if ( oneshotmegasplit30server.textContent > 20 ) console.log ("На oneshotmegasplit 30 сервер сходка!"); 
if ( oneshotmegasplit30server.textContent > 20 ) console.log ( oneshotmegasplit30server.textContent + " игроков" + " - 30 сервер режима oneshotmegasplit" )
};

//МС
function MegasplitServers() {
var Megasplit1server = document.getElementById( 'nowmegasplit1' ); 
if ( Megasplit1server.textContent > 60 ) console.log ("На Megasplit 1 сервер сходка!"); 
if ( Megasplit1server.textContent > 60 ) console.log ( Megasplit1server.textContent + " игроков" + " - 1 сервер режима Megasplit" )

var Megasplit2server = document.getElementById( 'nowmegasplit2' ); 
if ( Megasplit2server.textContent > 20 ) console.log ("На Megasplit 2 сервер сходка!"); 
if ( Megasplit2server.textContent > 20 ) console.log (Megasplit2server.textContent + " игроков" + " - 2 сервер режима Megasplit" )

var Megasplit3server = document.getElementById( 'nowmegasplit3' ); 
if ( Megasplit3server.textContent > 20 ) console.log ("На Megasplit 3 сервер сходка!"); 
if ( Megasplit3server.textContent > 20 ) console.log (Megasplit3server.textContent + " игроков" + " - 3 сервер режима Megasplit" )

var Megasplit4server = document.getElementById( 'nowmegasplit4' ); 
if ( Megasplit4server.textContent > 20 ) console.log ("На Megasplit 4 сервер сходка!"); 
if ( Megasplit4server.textContent > 20 ) console.log (Megasplit4server.textContent + " игроков" + " - 4 сервер режима Megasplit" )

var Megasplit10server = document.getElementById( 'nowmegasplit10' ); 
if ( Megasplit10server.textContent > 20 ) console.log ("На Megasplit 10 сервер сходка!"); 
if ( Megasplit10server.textContent > 20 ) console.log (Megasplit10server.textContent + " игроков" + " - 10 сервер режима Megasplit" )

var Megasplit27server = document.getElementById( 'nowmegasplit4' ); 
if ( Megasplit27server.textContent > 20 ) console.log ("На Megasplit 27 сервер сходка!"); 
if ( Megasplit27server.textContent > 20 ) console.log (Megasplit27server.textContent + " игроков" + " - 27 сервер режима Megasplit" )

var Megasplit40server = document.getElementById( 'nowmegasplit4' ); 
if ( Megasplit40server.textContent > 20 ) console.log ("На Megasplit 40 сервер сходка!"); 
if ( Megasplit40server.textContent > 20 ) console.log (Megasplit40server.textContent + " игроков" + " - 40 сервер режима Megasplit" )
};

//ЕКСП
function ExperimentalServers() {
var Experimental1server = document.getElementById( 'nowexp1' ); 
if ( Experimental1server.textContent > 30 ) console.log ("На Experimental 1 сервер сходка!"); 
if ( Experimental1server.textContent > 30 ) console.log ( Experimental1server.textContent + " игроков" + " - 1 сервер режима Experimental" )
};

//ТИМ
function TeamServers() {
var Team1server = document.getElementById( 'nowteam1' ); 
if ( Team1server.textContent > 35 ) console.log ("На Team 1 сервер сходка!"); 
if ( Team1server.textContent > 35 ) console.log ( Team1server.textContent + " игроков" + " - 1 сервер режима Team" )

var Team8server = document.getElementById( 'nowteam8' ); 
if ( Team8server.textContent > 40 ) console.log ("На Team 8 сервер сходка!"); 
if ( Team8server.textContent > 40 ) console.log ( Team8server.textContent + " игроков" + " - 8 сервер режима Team" )

var Team10server = document.getElementById( 'nowteam10' ); 
if ( Team10server.textContent > 35 ) console.log ("На Team 10 сервер сходка!"); 
if ( Team10server.textContent > 35 ) console.log ( Team10server.textContent + " игроков" + " - 10 сервер режима Team" )
};

//ФАСТФУД
function FastFoodFFAervers() {
var fastfood1server = document.getElementById( 'nowfastfood1' ); 
if ( fastfood1server.textContent > 15 ) console.log ("На FastFoodFFA 1 сервер сходка!"); 
if ( fastfood1server.textContent > 15 ) console.log ( fastfood1server.textContent + " игроков" + " - 1 сервер режима FastFoodFFA" )

var fastfood2server = document.getElementById( 'nowfastfood2' ); 
if ( fastfood2server.textContent > 15 ) console.log ("На FastFoodFFA 2 сервер сходка!"); 
if ( fastfood2server.textContent > 15 ) console.log ( fastfood2server.textContent + " игроков" + " - 2 сервер режима FastFoodFFA" )
};

//ХАРДКОР
function HardCoreFFAervers() {
var HardCore1server = document.getElementById( 'nowhardcore1' ); 
if ( HardCore1server.textContent > 25 ) console.log ("На HardCoreFFA 1 сервер сходка!"); 
if ( HardCore1server.textContent > 25 ) console.log ( HardCore1server.textContent + " игроков" + " - 1 сервер режима HardCoreFFA" )

var HardCore2server = document.getElementById( 'nowhardcore2' ); 
if ( HardCore2server.textContent > 30 ) console.log ("На HardCoreFFA 2 сервер сходка!"); 
if ( HardCore2server.textContent > 30 ) console.log ( HardCore2server.textContent + " игроков" + " - 2 сервер режима HardCoreFFA" )

var HardCore3server = document.getElementById( 'nowhardcore3' ); 
if ( HardCore3server.textContent > 65 ) console.log ("На HardCoreFFA 3 сервер сходка!"); 
if ( HardCore3server.textContent > 65 ) console.log ( HardCore3server.textContent + " игроков" + " - 3 сервер режима HardCoreFFA" )

var HardCore4server = document.getElementById( 'nowhardcore4' ); 
if ( HardCore4server.textContent > 30 ) console.log ("На HardCoreFFA 4 сервер сходка!"); 
if ( HardCore4server.textContent > 30 ) console.log ( HardCore4server.textContent + " игроков" + " - 4 сервер режима HardCoreFFA" )

var HardCore5server = document.getElementById( 'nowhardcore5' ); 
if ( HardCore5server.textContent > 40 ) console.log ("На HardCoreFFA 5 сервер сходка!"); 
if ( HardCore5server.textContent > 40 ) console.log ( HardCore5server.textContent + " игроков" + " - 5 сервер режима HardCoreFFA" )

var HardCore6server = document.getElementById( 'nowhardcore6' ); 
if ( HardCore6server.textContent > 35 ) console.log ("На HardCoreFFA 6 сервер сходка!"); 
if ( HardCore6server.textContent > 35 ) console.log ( HardCore6server.textContent + " игроков" + " - 6 сервер режима HardCoreFFA" )

var HardCore7server = document.getElementById( 'nowhardcore7' ); 
if ( HardCore7server.textContent > 35 ) console.log ("На HardCoreFFA 7 сервер сходка!"); 
if ( HardCore7server.textContent > 35 ) console.log ( HardCore7server.textContent + " игроков" + " - 7 сервер режима HardCoreFFA" )

var HardCore8server = document.getElementById( 'nowhardcore8' ); 
if ( HardCore8server.textContent > 35 ) console.log ("На HardCoreFFA 8 сервер сходка!"); 
if ( HardCore8server.textContent > 35 ) console.log ( HardCore8server.textContent + " игроков" + " - 8 сервер режима HardCoreFFA" )

var HardCore9server = document.getElementById( 'nowhardcore9' ); 
if ( HardCore9server.textContent > 85 ) console.log ("На HardCoreFFA 9 сервер сходка!"); 
if ( HardCore9server.textContent > 85 ) console.log ( HardCore9server.textContent + " игроков" + " - 9 сервер режима HardCoreFFA" )

var HardCore10server = document.getElementById( 'nowhardcore10' ); 
if ( HardCore10server.textContent > 20 ) console.log ("На HardCoreFFA 10 сервер сходка!"); 
if ( HardCore10server.textContent > 20 ) console.log ( HardCore10server.textContent + " игроков" + " - 10 сервер режима HardCoreFFA" )

var HardCore12server = document.getElementById( 'nowhardcore12' ); 
if ( HardCore12server.textContent > 20 ) console.log ("На HardCoreFFA 12 сервер сходка!"); 
if ( HardCore12server.textContent > 20 ) console.log ( HardCore12server.textContent + " игроков" + " - 12 сервер режима HardCoreFFA" )

var HardCore26server = document.getElementById( 'nowhardcore26' ); 
if ( HardCore26server.textContent > 20 ) console.log ("На HardCoreFFA 26 сервер сходка!"); 
if ( HardCore26server.textContent > 20 ) console.log ( HardCore26server.textContent + " игроков" + " - 26 сервер режима HardCoreFFA" )

var HardCore7extremeserver = document.getElementById( 'nowextreme7' ); 
if ( HardCore7extremeserver.textContent > 20 ) console.log ("На HardCoreFFA Extreme 7 сервер сходка!"); 
if ( HardCore7extremeserver.textContent > 20 ) console.log ( HardCore2extremeserver.textContent + " игроков" + " - 7 сервер режима HardCoreFFA" )
};


