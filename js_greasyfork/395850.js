// ==UserScript==
// @name             Скам ЧП
// @name:ru          Скам
// @version          68
// @description:ru   Макросы
// @description:en   Macro
// @match            http://petridish.pw/ru/
// @match            http://petridish.pw/en/
// @namespace        https://greasyfork.org/users/834
// @description Макросы
// @downloadURL https://update.greasyfork.org/scripts/395850/%D0%A1%D0%BA%D0%B0%D0%BC%20%D0%A7%D0%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/395850/%D0%A1%D0%BA%D0%B0%D0%BC%20%D0%A7%D0%9F.meta.js
// ==/UserScript==


window.onload = function(){
q = '';
w = '';
e = '';
r = '';
job();
nicknamebaseuse();
let goPlay = setInterval(function() {
if ($("#endgameoverlay")[0].style.display != "none") {
$('#newplaybutton').click()
isSpectating = true;
}
}, 2000)

function qq() {
$("#canvas").trigger($.Event("keydown", { keyCode: q}));
};
let timerId = setInterval(() => qq(), 1300);

function qw() {
	$("#canvas").trigger($.Event("keydown", {
		keyCode: w
	}));
	isSpectating = true;
};
let timerId2 = setInterval(() => qw(), 3900);

function qv() {
	$("#canvas").trigger($.Event("keydown", {
		keyCode: e
	}));
	isSpectating = true;
};
let timerId3 = setInterval(() => qv(), 6500);

function qu() {
	$("#canvas").trigger($.Event("keydown", {
		keyCode: r
	}));
	isSpectating = true;
};
let timerId4 = setInterval(() => qu(), 9100);



//Чек чата и сравнение сообщений
setInterval(function() { 
var textGame = document.querySelector('#chatlog > div:nth-last-child(1)');
var text = textGame.textContent;


var mist_goplay = "Рубль: go"; // Войти в игру
var mist_exit = "Рубль: ex"; // выйти с сервера
var mist_jump = "Рубль: ju"; // сделать прыжок
var mist_offRes = "Рубль: off"; // выключить вкладкам авторес
var mist_onauto = "Рубль: fff"; // Включить автоматический прыжок
var mist_offauto = "Рубль: offj"; // Выключить автоматический прыжок
var mist_offmovie = "Рубль: offmv"; // Выключить движение
var mist_goRight = "Рубль: gh"; // Направить ботов в право
var mist_goLeft = "Рубль: bv"; // Направить ботов в лево
var mist_goUp = "Рубль: cc"; // Направить ботов в верх
var mist_default = "Рубль: cy"; // Направить ботов в левый нижний угол


//Сравнение
if ( text === mist_goplay ) {
	comeGame(); //Это есть
};

if ( text === mist_exit ) {
	quitGame(); //Это есть
};

if ( text === mist_jump ) {
	jump(); //Это есть
};

if ( text === mist_offRes ) {
	stopRespawn(); //Это есть
};

if ( text === mist_onauto ) {
	ttt = true;
	jumpauto();
};

if ( text === mist_offauto ) {
	jumpautooff();
};

if ( text === mist_offmovie ) {
stopmovie();
};
	if ( text === mist_goRight ) {
		q = 39;
		w = 37;
		e = 38;
		r = 40;
	};

	if ( text === mist_goLeft ) {
		q = 37;
		w = 39;
		e = 40;
		r = 38;
	};

	if ( text === mist_goUp ) {
		q = 38;
		w = 40;
		e = 39;
		r = 37;
	};

	if ( text === mist_default ) {
		q = 40;
		w = 38;
		e = 37;
		r = 39;
	};


//войти в игру
function comeGame() {
$('#newplaybutton').click();
}

//выйти с сервера
function quitGame() {
$('.server-item.active').prev('[style="display: flex;"]').click()
spectatebtnclick();
}

//сделать прыжок
function jump() {
$("#canvas").trigger($.Event("keydown", {keyCode: 32})); //прыжок
$("#canvas").trigger($.Event("keyup", {keyCode: 32}));
}

//выключить авторес
function stopRespawn() {
clearTimeout(goPlay);
$('#top-game > center > span').remove();
nojob();
}


//Прыжки без остановки
function jumpauto() {
	timer = setInterval(function() {
		if (ttt == true) {
			$("#canvas").trigger($.Event("keydown", { keyCode: 32 }));
			$("#canvas").trigger($.Event("keyup", { keyCode: 32 }));
		};
	}, 100);
};

//выключить движение
function stopmovie() {
clearInterval(timerId)
clearInterval(timerId2)
clearInterval(timerId3)
clearInterval(timerId4)
}
}, 10)


function nicknamebaseuse() {
var arr = ['ℬℛ|AZZERS','ℬℛ|Ɲαяσ', '个潜在杀手', 'ℬℛ┆Иван.', '/ℬℛ/ Maes', '[ℬℛ+] Меов.', '[ℬℛ+] 糖果', '|ℬℛ| Leon', '[ℬℛ] Боль', '~ℬℛ~ ๖ۣۣۜMist', 'ʙᴀʟʙᴇs', 'ʙᴀʟʙᴇsᴋᴀ'];

var arr1 = ['BR_ZZ_S69','HhtDm69ld1', 'QHZRx2pE6L', 'QqWK7YrZAc', 'oe_la~lo01', 'Y0u_Tube18', 'Y0u_Tube18', 'Uj0EMqJPRS', 'Elki878279', 'kardi88l0l', 'dfiudisufi', 'soifosff1d'];

var rand = Math.floor(Math.random() * arr.length)
var x = document.querySelector('#nick').value = (arr[rand])




if ('ℬℛ|AZZERS' === x) {
document.querySelector('#password').value = (arr1[0])
};
if ('ℬℛ|Ɲαяσ' === x) {
document.querySelector('#password').value = (arr1[1])
};
if ('个潜在杀手' === x) {
document.querySelector('#password').value = (arr1[2])
};
if ('ℬℛ┆Иван.' === x) {
document.querySelector('#password').value = (arr1[3])
};
if ('/ℬℛ/ Maes' === x) {
document.querySelector('#password').value = (arr1[4])
};
if ('[ℬℛ+] Меов.' === x) {
document.querySelector('#password').value = (arr1[5])
};
if ('[ℬℛ+] 糖果' === x) {
document.querySelector('#password').value = (arr1[6])
};
if ('|ℬℛ| Leon' === x) {
document.querySelector('#password').value = (arr1[7])
};
if ('[ℬℛ] Боль' === x) {
document.querySelector('#password').value = (arr1[8])
};
if ('|ℬℛ| 깜박불' === x) {
document.querySelector('#password').value = (arr1[9])
};
if ('~ℬℛ~ ๖ۣۣۜMist' === x) {
document.querySelector('#password').value = (arr1[10])
};
if ('ʙᴀʟʙᴇs' === x) {
document.querySelector('#password').value = (arr1[11])
};
if ('ʙᴀʟʙᴇsᴋᴀ' === x) {
document.querySelector('#password').value = (arr1[12])
};
}; 






function job() {
document.getElementById("top-game").innerHTML += "<center><span class='text'><span data-itr='instructions'>   АвтоРес: <span style = 'color: green'>Работает!</span> </span></span></center>";
}
function nojob() {
document.getElementById("top-game").innerHTML += "<center><span class='text'><span data-itr='instructions'>   АвтоРес: <span style = 'color: red'>Не работает!</span> </span></span></center>";
};
};