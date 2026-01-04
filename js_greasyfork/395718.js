// ==UserScript==
// @name             Тестовый скрипт
// @name:ru          -
// @version          1.8
// @description:ru   Макросы
// @description:en   Macro
// @match            http://petridish.pw/ru/
// @match            http://petridish.pw/en/
// @match            http://petridish.pw/fr/
// @namespace        https://greasyfork.org/en/users/396113-mist161
// @description Макросы
// @downloadURL https://update.greasyfork.org/scripts/395718/%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/395718/%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==

job();
nicknamebaseuse();
let playGame = setInterval(function() {
if ($("#endgameoverlay")[0].style.display != "none") {
$('#newplaybutton').click()
firstTimeClickPlay();
isSpectating = true;
}
}, 2000)



//Чек чата и сравнение сообщений
setInterval(function() { 
var textGame = document.querySelector('#chatlog > div:nth-last-child(1)');
var text = textGame.textContent;

var mist_goplay = "Рубль: go"; // Войти в игру
var mist_goplay_2 = "еее котек: xdf"; // Войти в игру


var mist_exit = "Рубль: ex"; // выйти с сервера
var mist_exit_2 = "еее котек: vgf"; // выйти с сервера


var mist_jump = "Рубль: ju"; // сделать прыжок
var mist_jump_2 = "еее котек: hyt"; // сделать прыжок


var mist_offRes = "Рубль: off"; // выключить вкладкам авторес
var mist_offRes_2 = "еее котек: bvg"; // выключить вкладкам авторес


var mist_onauto = "Рубль: fff"; // Включить автоматический прыжок
var mist_onauto_2 = "еее котек: ser"; // Включить автоматический прыжок


var mist_offauto = "Рубль: offj"; // Выключить автоматический прыжок
var mist_offauto_2 = "еее котек: zxs"; // Выключить автоматический прыжок

var mist_offmovie = "Рубль: offmv"; // Выключить движение
var mist_offmovie_2 = "еее котек: cvf"; // Выключить движение

if ( text === mist_goplay || text === mist_goplay_2 ) {
comeGame();
}

if (text === mist_exit || text === mist_exit_2 ) {
quitGame();
}

if (text === mist_jump || text === mist_jump_2 ) {
jump();
}

if (text === mist_offRes || text === mist_offRes_2 ) {
stopRespawn();
}

if (text === mist_onauto || text === mist_onauto_2 ) {
jumpautostart();
}

if (text === mist_offauto || text === mist_offauto_2 ) {
jumpautooff();
}

if (text === mist_offmovie || text === mist_offmovie_2 ) {
stopmovie();
}


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
clearTimeout(playGame);
$('#top-game > center > span').remove()
nojob()
}

//Начать прыжки без остановки
function jumpautostart() {
jumpauto();
}



//Прыжки без остановки
function jumpauto() {
timer = setInterval(function () {
$("#canvas").trigger($.Event("keydown", {keyCode: 32})); //прыжок
$("#canvas").trigger($.Event("keyup", {keyCode: 32}));
}, 100);
}

//Выключить пржыки без остановки
function jumpautooff() {
clearInterval(timer)
}

//выключить движение
function stopmovie() {
clearInterval(timerId)
clearInterval(timerId2)
}
}, 10)




function qq() {
$("#canvas").trigger($.Event("keydown", {keyCode: 40})); //лево
}
let timerId = setInterval(() => qq(), 1000);

function qw() {
$("#canvas").trigger($.Event("keydown", {keyCode: 38})); //лево
}
let timerId2 = setInterval(() => qw(), 1000);





//Ники
function nicknamebaseuse() {
var arr = ['Михалыч','IBZZI Михалыч', 'IBZZIsensitivit', '[BraZZers]', 'Hypnotic.', 'Алиныч', 'Тигрыч', 'Крысалыч', 'Felicity', 'Янг Барт.', 'Зима [1]', 'Зима [2]'];
var arr1 = ['228322','1231212', '33770', 'michanya99', 'hypnos', 'michanya', 'кыскыс', '1234123', '0p0pkl24', '122334', '56432', '121234'];
var rand = Math.floor(Math.random() * arr.length)
var x = document.querySelector('#nick').value = (arr[rand])
if ('Михалыч' === x) {
document.querySelector('#password').value = (arr1[0])
}
if ('IBZZI Михалыч' === x) {
document.querySelector('#password').value = (arr1[1])
}
if ('IBZZIsensitivit' === x) {
document.querySelector('#password').value = (arr1[2])
}
if ('[BraZZers]' === x) {
document.querySelector('#password').value = (arr1[3])
}
if ('Hypnotic.' === x) {
document.querySelector('#password').value = (arr1[4])
}
if ('Алиныч' === x) {
document.querySelector('#password').value = (arr1[5])
}
if ('Тигрыч' === x) {
document.querySelector('#password').value = (arr1[6])
}
if ('Крысалыч' === x) {
document.querySelector('#password').value = (arr1[7])
}
if ('Felicity' === x) {
document.querySelector('#password').value = (arr1[8])
}
if ('Янг Барт.' === x) {
document.querySelector('#password').value = (arr1[9])
}
if ('Зима [1]' === x) {
document.querySelector('#password').value = (arr1[10])
}
if ('Зима [2]' === x) {
document.querySelector('#password').value = (arr1[11])
};
};


function job() {
document.getElementById("top-game").innerHTML += "<center><span class='text'><span data-itr='instructions'>   АвтоРес: <span style = 'color: green'>Работает!</span> </span></span></center>";
}
function nojob() {
document.getElementById("top-game").innerHTML += "<center><span class='text'><span data-itr='instructions'>   АвтоРес: <span style = 'color: red'>Не работает!</span> </span></span></center>";
}