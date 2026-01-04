// ==UserScript==
// @name          Команда 1Wmobile
// @namespace     https://forum.1wmobile.gg/
// @version      2.0
// @description  Скрипт для моих любимых админчиков <3
// @author       Jordan Hercules
// @match         https://forum.1wmobile.gg/*
// @include       https://forum.1wmobile.gg/
// @grant        none
// @license 	 @Hercules115
// @icon         https://i.ytimg.com/vi/A7G7PjljgR4/maxresdefault.jpg
// @downloadURL https://update.greasyfork.org/scripts/518873/%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%B0%201Wmobile.user.js
// @updateURL https://update.greasyfork.org/scripts/518873/%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%B0%201Wmobile.meta.js
// ==/UserScript==

function falingSnowInit() {

    var snowmax, marginbottom, marginright, text1El;

    // -------------------------
    // ***Настройки снега***
    // -------------------------

    // Запуск снега по дефолту, можно использовать или 0 или 1,  (если 0 - снег по дефолту не запускать если 1 - запускать) по дефолту установлено в 1
    var defaultStart = 1;

    // Запуск снега по дефолту именно для дат c 30 декабря по 2 января (Новогодние дни) и 7 января (Рождественнские дни) можно использовать или 0 или 1,  (если 0 - снег по дефолту не запускать если 1 - запускать)
    var holydaysstart = 1;

    // Отступ снизу для кнопки управления снегом (в px), по дефолту установлено 40 (значение должно быть целым числом)
    var bottompos = 40;

    // Отступ справа для кнопки управления снегом, по дефолту установлено 20
    var rightpos = 50;

    // - Скорость падения снега на странице ** от 0 до 1 **, по дефолту рекомендуется 0.6
    var sinkspeed=0.7;

    // Количество снежинок (густота снега) на странице, для десктопов ( от 12 до 50 ), по дефолту рекомендуется 28
    var snowmaxDsctp=50;

    // Количество снежинок (густота снега) на странице, для мобильных ( от 6 до 34 ), по дефолту рекомендуется 12
    var snowmaxMob=30;

    // Максимальный размер снежинки (для font-size  в единицах px), ( от 22 до 56 ), по дефолту рекомендуется 33
    var snowmaxsize=33;

    // Минимальный размер снежинки (для font-size  в единицах px), ( от 3 до 18 ), по дефолту рекомендуется 7
    var snowminsize=7;

    // Варианты цветов в которые может окрасится снежинка случайным образом (рендомно)
    var snowcolor=new Array("#AAAACC","#DDDDFF","#CCCCDD","#F3F3F3","#F0FFFF","#FFFFFF","#EFF5FF");

    // Варианты шрифтов которым может стать снежинка случайным образом (рендомно)
    var snowtype=new Array("Arial", "Arial Black", "Calibri", "Cambria", "Verdana", "Tahoma", "Gabriola", "Sans serif","Times","Comic Sans MS","Georgia","Candara","MS Gothic","Yu Gothic");

    // Символ для снежинки, по дефолту рекомендуется *
    var snowletter="*";

    // Системные настройки (менять не рекомендуется)
    var snowingzone=1;
    var snow=new Array();
    var i_snow=0;
    var x_mv=new Array();
    var crds=new Array();
    var lftrght=new Array();
    var browserinfos=navigator.userAgent;
    var ie5=document.all&&document.getElementById&&!browserinfos.match(/Opera/);
    var ns6=document.getElementById&&!document.all;
    var opera=browserinfos.match(/Opera/);
    var browserok=ie5||ns6||opera;
    var defaultStartRes = defaultStart === 1 ? defaultStart :  checkHolidays() ? holydaysstart : defaultStart;

    if (window.screen.width > 700) {snowmax = snowmaxDsctp;
    }else{snowmax = snowmaxMob;}

    var choiceUStart = localStorage.getItem('chstart') ? Number(localStorage.getItem('chstart')) : defaultStartRes;

    if (isNaN(choiceUStart)) {
        choiceUStart = 0;
    }

    function randommaker(range) {
        rand=Math.floor(range*Math.random());
        return rand;
    }
    function movesnow() {
        for(i=0;i<=snowmax;i++) {
            crds[i]+=x_mv[i];
            snow[i].posy+=snow[i].sink;
            snow[i].style.left=snow[i].posx+lftrght[i]*Math.sin(crds[i])+"px";
            snow[i].style.top=snow[i].posy+"px";
            if (snow[i].posy>=marginbottom-2*snow[i].size || parseInt(snow[i].style.left)>(marginright-3*lftrght[i])) {
                if (snowingzone==1) {snow[i].posx=randommaker(marginright-snow[i].size)}
                if (snowingzone==2) {snow[i].posx=randommaker(marginright/2-snow[i].size)}
                if (snowingzone==3) {snow[i].posx=randommaker(marginright/2-snow[i].size)+marginright/4}
                if (snowingzone==4) {snow[i].posx=randommaker(marginright/2-snow[i].size)+marginright/2}
                snow[i].posy=0;
            }
        }
        if (choiceUStart) {
            setTimeout(movesnow,60);
        }
    }
    function checkHolidays() {
        var nowDate = new Date();
        if (nowDate.getMonth() == 0) {
            if (nowDate.getDate() == 1 || nowDate.getDate() == 2 || nowDate.getDate() == 7) {
                return true;
            }
        }else if (nowDate.getMonth() == 11) {
            if (nowDate.getDate() == 30 || nowDate.getDate() == 31) {
                return true;
            }
        } else {return false;}
    }
    // Рендер кнопки
    function renderSnowControl() {
        var btnControl = document.createElement('button');
        btnControl.style.backgroundColor = "#312877";
        btnControl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="26px" height="26px" viewBox="0 0 1280.000000 1096.000000" preserveAspectRatio="xMidYMid meet" style="cursor:pointer">' +
            '<g transform="translate(0.000000,1096.000000) scale(0.100000,-0.100000)" fill="#F0FFFF" stroke="none">' +
                '<path d="M3146 10652 c-23 -48 -89 -185 -146 -304 l-102 -217 347 -581 c191 -320 350 -591 352 -601 5 -18 -13 -19 -643 -21 l-649 -3 -163 -305 c-89 -168 -161 -312 -158 -321 2 -9 68 -124 146 -256 l143 -240 156 -6 c86 -4 539 -16 1006 -27 468 -12 859 -23 871 -26 16 -3 158 -233 563 -910 311 -519 539 -910 534 -915 -5 -5 -479 -8 -1088 -7 l-1079 3 -477 805 c-262 443 -482 811 -488 818 -9 9 -97 12 -376 12 l-365 0 -130 -260 c-71 -143 -130 -264 -130 -269 0 -5 144 -250 320 -544 287 -480 327 -551 318 -559 -2 -2 -352 -5 -778 -8 l-774 -5 -178 -284 c-98 -156 -178 -288 -178 -293 0 -5 10 -22 21 -38 12 -16 92 -147 178 -292 l157 -263 724 -5 c636 -4 725 -7 724 -20 -1 -8 -137 -222 -304 -475 l-302 -460 122 -240 c68 -132 138 -268 157 -302 l34 -62 337 -3 c185 -2 342 -2 347 0 6 1 228 351 494 777 266 426 490 776 498 780 8 3 503 5 1099 5 942 0 1085 -2 1090 -15 5 -13 -967 -1656 -1003 -1695 -12 -13 -135 -15 -991 -15 l-977 0 -172 -285 c-94 -157 -177 -294 -183 -306 -11 -19 7 -47 157 -260 l168 -239 655 -5 c595 -5 655 -6 654 -21 -1 -9 -171 -299 -378 -643 -207 -345 -376 -635 -376 -644 1 -9 76 -147 169 -307 l167 -290 360 -2 359 -2 360 604 c239 402 365 604 375 602 8 -1 131 -217 275 -479 143 -263 265 -482 270 -487 6 -5 163 -19 349 -31 330 -21 340 -21 353 -3 8 10 89 139 180 286 144 234 164 271 155 291 -5 12 -206 363 -446 779 -240 416 -441 767 -447 780 -9 20 50 124 521 910 298 497 537 886 543 884 22 -7 987 -1631 984 -1653 -2 -12 -223 -382 -491 -822 l-487 -801 177 -298 c97 -164 182 -303 188 -309 8 -9 88 -6 308 10 163 11 298 23 301 26 3 3 147 241 322 530 174 289 323 532 332 540 13 13 17 12 31 -9 10 -14 184 -304 388 -645 l370 -621 230 -7 c126 -5 285 -7 354 -5 l125 2 177 290 c97 160 177 296 177 304 1 7 -159 281 -355 609 -226 379 -352 598 -346 604 7 7 198 2 529 -11 285 -12 541 -21 570 -21 l52 0 178 255 c97 140 184 265 191 278 14 22 6 39 -154 315 l-169 292 -70 1 c-38 0 -462 8 -942 17 -747 15 -874 19 -887 32 -33 34 -997 1663 -992 1676 5 12 155 14 1028 12 l1023 -3 467 -780 468 -780 87 -3 c49 -2 196 0 328 3 l240 7 178 267 c97 146 177 272 177 279 0 7 -126 231 -281 497 -167 289 -279 491 -275 500 5 13 93 15 703 15 l698 0 188 303 c104 166 194 310 200 320 8 11 9 22 2 31 -6 8 -95 129 -200 270 l-190 255 -706 1 c-553 0 -709 3 -717 13 -7 9 73 150 300 527 170 283 314 525 320 537 9 18 -14 57 -186 311 -107 159 -203 292 -212 296 -8 3 -143 6 -298 6 -257 0 -284 -2 -298 -17 -9 -10 -248 -385 -532 -833 -285 -448 -525 -821 -534 -827 -24 -19 -1990 -19 -1998 0 -4 12 1028 1750 1063 1789 15 17 76 18 952 20 l936 3 158 268 157 269 -151 281 c-83 155 -155 285 -158 290 -4 4 -270 12 -591 17 -333 5 -587 13 -593 19 -5 5 124 230 338 587 211 353 344 585 342 596 -3 9 -87 160 -187 333 l-183 317 -31 -5 c-17 -3 -170 -18 -340 -33 -170 -16 -313 -33 -319 -39 -5 -5 -165 -271 -356 -590 -207 -346 -353 -580 -361 -580 -9 0 -144 216 -334 534 l-320 533 -160 -7 c-89 -4 -253 -12 -366 -19 l-205 -11 -147 -245 c-82 -134 -148 -250 -148 -257 0 -6 219 -399 486 -873 l486 -860 -507 -848 c-279 -466 -513 -854 -521 -862 -9 -9 -17 -11 -23 -5 -18 19 -1101 1839 -1101 1851 0 6 208 355 461 775 254 420 464 771 466 780 6 23 -315 549 -336 549 -9 0 -151 7 -316 15 -165 8 -310 15 -322 15 -18 0 -72 -81 -319 -477 -163 -263 -302 -483 -308 -490 -6 -7 -16 -9 -22 -5 -6 4 -165 267 -355 585 -246 413 -350 579 -364 582 -11 2 -185 6 -388 9 l-367 5 -44 -87z"/>' +
            '</g>' +
        '</svg>';
        btnControl.style.position = "fixed";
        btnControl.style.zIndex = "999";
        btnControl.style.padding = "4px";
        btnControl.style.width = "36px";
        btnControl.style.height = "36px";
        btnControl.style.bottom = '100%';
        btnControl.style.right = rightpos + 'px';
        btnControl.style.border = "1px solid #EFF5FF";
        btnControl.style.borderRadius = "50%";
        btnControl.style.transition.bottom = "3s";
        choiceUStart ? btnControl.title = "Отключить снег" : btnControl.title = "Включить снег";
        choiceUStart ? btnControl.setAttribute("data-status", "run"): btnControl.setAttribute("data-status", "stop");

        btnControl.addEventListener("mouseover", function() {
            btnControl.style.boxShadow = "0px 0px 0px 1px #f0f0f0";
            if (this.getAttribute('data-status') == 'stop') {
                btnControl.style.backgroundColor = "#28a745";
            }else {
                btnControl.style.backgroundColor = "#dc3545";
            }
        });
        btnControl.addEventListener("mouseout", function() {
            btnControl.style.backgroundColor = "#312877";
            btnControl.style.boxShadow = "none";
        });
        btnControl.addEventListener("click", function() {
            if (this.getAttribute('data-status') == 'stop') {
                this.setAttribute("data-status", "run");
                choiceUStart = 1;
                initsnow();
                localStorage.setItem('chstart', 1);
                this.title="Отключить снег";
                btnControl.style.backgroundColor = "#dc3545";
            }else {
                this.setAttribute("data-status", "stop");
                stopSnow();
                localStorage.setItem('chstart', 0);
                this.title="Включить снег";
                btnControl.style.backgroundColor = "#28a745";
            }

        });
        document.body.append(btnControl);
        btnControl.style.bottom = bottompos + 'px';
        function renderText1() {
            var alreadySC = 0;
            if (localStorage.getItem('chstart')) {return;}
            if (localStorage.getItem('alreadysc')) {
                alreadySC = Number(localStorage.getItem('alreadysc'));
                if (alreadySC >= 1) {return;}
                alreadySC += 1;
                localStorage.setItem('alreadysc', alreadySC)
            }else {localStorage.setItem('alreadysc', 0);}

            var text1 = document.createElement('span');
            text1.style.display = "inline-block";
            text1.style.padding = "2px 6px";
            text1.style.backgroundColor = "#ffffff";
            text1.style.borderRadius = "3px";
            text1.style.boxShadow = "0px 0px 0px 1px #f0f0f0";
            text1.style.fontSize = "8px";
            text1.style.fontWeight = "600";
            text1.style.position = "absolute";
            text1.style.top = "-25px";
            text1.style.left = "-9px";
            choiceUStart ? text1.innerHTML = 'Отключить снег' : text1.innerHTML = 'Включить снег';
            btnControl.append(text1);
            var showInfo = setInterval(function () {
                text1.style.display = "inline-block";
                setTimeout(function() {
                    text1.style.display = "none";
                },1400);
            }, 2200);
            setTimeout(function() {
                clearInterval(showInfo);
            },4500);
        }

        setTimeout(function() {
            renderText1();
        },4000);
    }
    function removeEl(el) {
        el.parentNode.removeChild(el);
    }
    // Инициализация (запуск) снежинок
    function initsnow() {

        // Добавляем снежинки на страницу (в конец тега body)
        for (i=0;i<=snowmax;i++) {
            var span = document.createElement('span');
            span.id = 's' + i;
            span.style.position = "fixed";
            span.style.zIndex = "9";
            span.style.pointerEvents = "none";
            span.style.top = snowmaxsize + "px";
            span.style.fontFamily=snowtype[randommaker(snowtype.length)];
            span.append(snowletter);
            document.body.append(span);
        }

        if (ie5 || opera) {
            marginbottom=document.body.clientHeight;
            marginright=document.body.clientWidth;
        }
        else if (ns6) {
            marginbottom=window.innerHeight;
            marginright=window.innerWidth;
        }
        var snowsizerange=snowmaxsize-snowminsize;
        for (i=0;i<=snowmax;i++) {
            crds[i]=0;
            lftrght[i]=Math.random()*15;
            x_mv[i]=0.03+Math.random()/10;
            snow[i]=document.getElementById("s"+i);
            snow[i].size=randommaker(snowsizerange)+snowminsize;
            snow[i].style.fontSize=snow[i].size+"px";
            snow[i].style.color=snowcolor[randommaker(snowcolor.length)];
            snow[i].sink=sinkspeed*snow[i].size/5;
            if (snowingzone==1) {snow[i].posx=randommaker(marginright-snow[i].size)}
            if (snowingzone==2) {snow[i].posx=randommaker(marginright/2-snow[i].size)}
            if (snowingzone==3) {snow[i].posx=randommaker(marginright/2-snow[i].size)+marginright/4}
            if (snowingzone==4) {snow[i].posx=randommaker(marginright/2-snow[i].size)+marginright/2}
            snow[i].posy=randommaker(2*marginbottom-marginbottom-2*snow[i].size);
            snow[i].style.left=snow[i].posx+"px";
            snow[i].style.top=(snow[i].posy ) +"px";
        }
        movesnow();
    }
    // Остановка снега
    function stopSnow() {
        for (i=0;i<=snowmax;i++) {
            snow[i]=document.getElementById("s"+i);
            if (snow[i]) {
                snow[i].parentNode.removeChild(snow[i]);
            }
        }
        choiceUStart = 0;
    }

    if (browserok) {
        setTimeout(function() {
            if (choiceUStart) {
                initsnow();
            }
            // Добавляем кнопку управления снегом на страницу
            renderSnowControl();
        }, 1500);
    }
}
window.onload = function() {
    var nowDate = new Date();
    var thisMonth = nowDate.getMonth();
    // Если это декабрь и январь
    if (thisMonth == 11 || thisMonth == 0) {
        falingSnowInit();
    }
};
console.timeEnd('speed falling-snow js');
// ============Виджет падающего снега (конец) ====================



(function () {
  'use strict';

const UNACCEPT_PREFIX = 14; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 4; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 4; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 10; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 11; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 14;
const WAITING_PREFIX = 15;
const ZGA_PREFIX = 12; // prefix that will be set when thread seng to sa
const buttons = [

   {
   title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - | На рассмотрении | - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ',
 },
 {
     title: '| ЗАПРОСИЛ ДОК-ВА |',
     content: '[CENTER][size=4][font=georgia][CENTER]Приветствую, уважаемый игрок  {{ user.mention }}.[/font][/CENTER]<br>' +
   "[CENTER][size=4][font=georgia]Запросил доказательства у данного администратора.[/font][/CENTER]<br>" +
   "[CENTER][size=4][font=georgia]Статус:[COLOR=rgb(251, 160, 38)]На рассмотрении[/font][/COLOR][/CENTER]<br>"+
  "[CENTER][size=4][font=georgia]С уважением, Администрация Сервера [COLOR=rgb(0,0,255)]Victoria[/color].[/font][/CENTER]",
     prefix: PIN_PREFIX,
    status: true,
  },
  {
     title: '| НА РАССМОТРЕНИИ |',
     content:  '[CENTER][size=4][font=georgia][CENTER]Приветствую, уважаемый игрок  {{ user.mention }}.[/font][/CENTER]<br>' +
   "[CENTER][size=4][font=georgia]Ваша жалоба взята на [COLOR=rgb(251, 160, 38)] рассмотрение [/font][/COLOR][/CENTER]<br>" +
   "[CENTER][size=4][font=georgia][COLOR=rgb(251, 160, 38)]Ожидайте ответа в данной теме и не создавайте дубликаты[/font][/COLOR].[/CENTER]<br>"+
 "[CENTER][size=4][font=georgia]С уважением, Администрация Сервера [COLOR=rgb(0,0,255)]Victoria[/color].[/size][/font][/CENTER]",
     prefix: PIN_PREFIX,
    status: true,
  },
 {
   title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - | ЖБ одобрено/решено | - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ',
 },
    {
     title: 'ПРОВЕДЕНА БЕСЕДА АДМ',
     content:
        '[CENTER][size=4][font=georgia][CENTER]Приветствую, уважаемый игрок  {{ user.mention }}.[/font][/CENTER]<br>' +
     "[CENTER][size=4][font=georgia]С администратором будет проведена [I]беседа[/I].[/font][/CENTER]<br>" +
     "[CENTER][size=4][font=georgia]Статус:[COLOR=#41a85f]Решено.[/COLOR][/CENTER] [/font]<br>"+
     "[CENTER][size=4][font=georgia]С уважением, Администрация Сервера [COLOR=rgb(0,0,255)]Victoria[/color].[/size][/font][/CENTER]",
   prefix: RESHENO_PREFIX,
   status: false,
   },
  {
     title: 'ПОЛУЧИТ НАКАЗАНИЕ АДМ',
     content:  '[CENTER][size=4][font=georgia][CENTER]Приветствую, уважаемый игрок  {{ user.mention }}.[/font][/CENTER]<br>' +
   "[CENTER][size=4][font=georgia]Данный администратор будет [COLOR=rgb(255, 0, 0)]наказан[/font][/COLOR].[/CENTER]<br>" +
   "[CENTER][size=4][font=georgia]Статус:[COLOR=#41a85f]Одобрено.[/COLOR][/CENTER]<br>[/font]"+
  "[CENTER][size=4][font=georgia]С уважением, Администрация Сервера [COLOR=rgb(0,0,255)]Victoria[/color].[/size][/font][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НАКАЗАНИЕ СНЯТО + БЕСЕДА',
     content:
      '[CENTER][size=4][font=georgia][CENTER]Приветствую, уважаемый игрок  {{ user.mention }}.[/font][/CENTER]<br>' +
   "[CENTER][size=4][font=georgia]С администратором будет проведена [I]беседа[/I].[/CENTER][/font]<<br>" +
   "[CENTER][size=4][font=georgia]Ваше наказание будет аннулировано.[/CENTER][/font]<br>" +
  "[CENTER][size=4][font=georgia]С уважением, Администрация Сервера [COLOR=rgb(0,0,255)]Victoria[/color].[/size][/font][/CENTER]",
   prefix: RESHENO_PREFIX,
   status: false,
   },
   {
     title: 'НАКАЗАНИЕ СНЯТО',
     content:
       '[CENTER][size=4][font=georgia][CENTER]Приветствую, уважаемый игрок  {{ user.mention }}.[/font][/CENTER]<br>' +
    "[CENTER][font=georgia]Ваше наказание будет аннулировано в ближайшее время.[/font][/CENTER]<br>" +
   "[CENTER][size=4][font=georgia]С уважением, Администрация Сервера [COLOR=rgb(0,0,255)]Victoria[/color].[/size][/font][/CENTER]",
   prefix: CLOSE_PREFIX,
   status: false,
   },
   {
     title: 'БУДЕТ СНЯТ',
     content: '[CENTER][size=4][font=georgia][CENTER]Приветствую, уважаемый игрок  {{ user.mention }}.[/font][/CENTER]<br>' +
   "[CENTER][font=georgia]Данный администратор будет [COLOR=rgb(255, 0, 0)]снят[/COLOR] со своей должности.[/font][/CENTER]<br>" +
   "[CENTER][size=4][font=georgia]С уважением, Администрация Сервера [COLOR=rgb(0,0,255)]Victoria[/color].[/size][/font][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
        {
            title: `Нет доказательств`,
            content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок  {{ user.mention }}[/color].[/FONT][/SIZE]<br><br>` +
                     `[SIZE=4][FONT=georgia]Не увидел доказательств, которые подтверждают нарушение администратора.<br>` +
                     `Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br><br>` +
                     `[COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b].[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
            prefix: CLOSE_PREFIX,
            status: false,
              },
      {
             title: `Мало доказательств`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок  {{ user.mention }}[/color].[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Недостаточно доказательств, которые потверждают нарушение администратора.<br><br>`+
             `[COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b] [/COLOR][/CENTER]<br><br>`,
             prefix: CLOSE_PREFIX,
             status: false,
      },
      {
          title: `Нарушений нет`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок  {{ user.mention }}[/color].[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Исходя из выше приложенных доказательств нарушений со стороны администратора я не увидел!<br><br>`+
             `[COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b] [/COLOR][/CENTER]<br><br>`,
             prefix: CLOSE_PREFIX,
             status: false
           },
    {
        title: `Предоставлена док-ва`,
	   content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок  {{ user.mention }}[/color].[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER][SIZE=4][FONT=georgia]Администратор предоставил доказательства.[/CENTER]<br>` +
       `[CENTER]Наказание выдано верно![/CENTER]<br><br>` +
       `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	   prefix: CLOSE_PREFIX,
	   status: false,
        },
    {
        title: `Прошло 72 часа`,
	  content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок  {{ user.mention }}[/color].[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER][SIZE=4][FONT=georgia]С момента выдачи наказания прошло более 72 часов.[/CENTER]<br>` +
      `[CENTER]Обратитесь в раздел обжалований` +
      `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: CLOSE_PREFIX,
	  status: false
        },
      {
           title: `Нарушений нет`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}.[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Исходя из выше приложенных доказательств нарушений со стороны администратора я не увидел!<br><br>`+
             `[COLOR=rgb(255, 0, 0)]Отказано. Приятной игры на серверае Victoria[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
             prefix: CLOSE_PREFIX,
             status: false,
	  },

    {
	  title: `От 3-его лица`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Жалоба создана от третьего лица.[/CENTER]<br>` +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `[COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
            title: `Окно бана`,
            content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER]Зайдите в игру и сделайте скриншот окна с баном, после чего заново напишите жалобу.<br><br>`+
            `[COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
            prefix: CLOSE_PREFIX,
            status:false,
    },
	 {
	   title: `Жалоба не по форме`,
	   content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
	 	`[CENTER]Жалоба составлена не по форме.<br>` +
         `Внимательно прочитайте правила составления жалобы - [URL=https://forum.1wmobile.gg/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1.225/']*ТЫК*[/URL]<br><br>` +
	 	`[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	   prefix: CLOSE_PREFIX,
	   status: false,
	 },
    {
        title: `Опра в соц сети (отказ)`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}<br><br>`+
        `Пожалуйста внимательно прочитайте тему «[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/']Правила подачи жалоб на администрацию[/URL][B]»[/B]<br><br>`+
        `И обратите своё внимание, на данный пункт правил:[/SIZE][/CENTER][/FONT]`+
        `[QUOTE][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]3.6. [/COLOR]Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/CENTER][/QUOTE]`+
        `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]`,
        prefix: CLOSE_PREFIX,
        status: false,
        title: `Не туда написана`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]Пожалуйста, убедительная просьба ознакомится с назначением данного раздела в котором Вы создали тему.<br>`+
            `Ваш запрос никоим образом не относится к предназначению данного раздела.<br><br>`+
            `[COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
        prefix: CLOSE_PREFIX,
        status:false,
    },
    {
        title: `Администратор снят (наказание будет снято)`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER] Администратор был снят/ушел по собственному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
            `[CENTER][COLOR=rgb(0, 255, 0)][center][color=green][b]Рассмотрено[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
        prefix: CLOSE_PREFIX,
        status:false,
    },
	{
	    title: `Смена IP адресса`,
	    content:
		    `[CENTER][COLOR=rgb(255, 0, 0)][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}<br><br>`+
		    `[CENTER]Дело в вашем айпи адресе. <br>` +
            `Попробуйте сменить его на старый с которого вы играли раньше.<br>Смените интернет соединение или же попробуйте использовать впн.<br>` +
            `Ваш аккаунт не в блокировке<br><br>` +
		    `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	},
    {
        title: `В раздел ОБЖ`,
        content:
            `[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}<br><br>`+
            `[CENTER]Пожалуйста обратитесь в раздел - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2864/']Обжалование (кликабельно)[/URL]<br>`+
            `[CENTER][center][color=red][b]Отказано[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/CENTER][/FONT][/SIZE]<br><br>`,
        prefix: CLOSE_PREFIX,
        status: false,
    },

	{
	  title: `Бред в жалобе`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Жалоба бредовая и не содержит в себе смысла.<br>` +
        `Рассмотрению не подлежит.<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},

    {
        title: `- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ПЕРЕАДРЕСАЦИИ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`,
    },
    {
	  title: `В раздел жалоб на игроков`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на игроков.<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел жалоб на лидеров`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на лидеров<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: `Жалобу на теха`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов<br><br><br>`+
       `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
        prefix: CLOSE_PREFIX,
        status: false,

    },
    {
	  title: `Передать Команде Проекта`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Специальному  Администратору<br>`+
        `[COLOR=rgb(251, 160, 38)][center][color=yellow][b]На рассмотрении[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
      prefix: COMMAND_PREFIX,
	  status: true,
	},
    {
	  title: `Передать Теху`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Техническому Специалисту<br>`+
        `[COLOR=rgb(251, 160, 38)][center][color=yellow][b]На рассмотрении[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
      prefix: TEX_PREFIX,
	  status: true,
	},
    {
	  title: `Передать ЗГА`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Заместителю Главного Администратора <br>`+
        `[COLOR=rgb(251, 160, 38)][center][color=yellow][b]На рассмотрении[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
      prefix: ZGA_PREFIX,
	  status: true,
	},
     {
	   title: `Передать ГА`,
	  content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Главному Администратору<br>`+
         `[COLOR=rgb(251, 160, 38)][center][color=yellow][b]На рассмотрении[/b][/color][/center]
[b][color=aqua]Приятной игры на сервере[/color][/b]
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
       prefix: GA_PREFIX,
       status: true,

    title: `- - - - - - - - - - - - - - - - - - - - - - - - - - -  Правила Role Play процесса  - - - - - - - - - - - - - - - - - - - - - - - - - - - -`,
    },
    {
      title: `Нонрп поведение`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=Red]| Jail 30 минут [/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Уход от РП`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нонрп вождение`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.03[/color]. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
     {
       title: `NonRP Обман`,
       content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=Red]| PermBan[/color].[/CENTER]<br><br>` +
         `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix:  ACCEPT_PREFIX,
       status: false,
     },
    {
      title: `Аморал действия`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.08[/color]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
     {
       title: `Слив склада`,
       content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=Red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>` +
         `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix:  ACCEPT_PREFIX,
       status: false,
     },
    {
      title: `РК`,
      content:
      `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.14[/color]. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `ТК`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.15[/color]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=Red]| Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix:  ACCEPT_PREFIX,
        status: false,
      },
      {
        title: `СК`,
        content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.16[/color]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=Red]| Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color]).[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix:  ACCEPT_PREFIX,
        status: false,
      },
      {
        title: `ПГ`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.17[/color]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=Red]| Jail 30 минут[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix:  ACCEPT_PREFIX,
        status: false,
      },
      {
        title: `MG`,
        content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=Red]| Mute 30 минут[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
     {
       title: `ДМ`,
       content:
       `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=Red]| Jail 60 минут[/color].[/CENTER]<br><br>` +
       `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix:  ACCEPT_PREFIX,
       status: false,
     },
     {
       title: `Масс ДМ`,
       content:
     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=Red]| Warn / Ban 3 - 7 дней[/color].[/CENTER]<br><br>` +
       `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix:  ACCEPT_PREFIX,
       status: false,
     },
     {
       title: `ДБ`,
       content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>` +
         `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix:  ACCEPT_PREFIX,
       status: false,
     },
    {
      title: `Стороннее ПО`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][FONT=georgia][B][I]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=Red]|  Ban 15 - 30 дней / PermBan[/color] <br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Реклама сторонние ресурсы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.31[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=Red]| Ban 7 дней / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск адм`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.32[/color]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=Red]| Ban 7 - 15 дней[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Уяз.правил`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.33[/color]. Запрещено пользоваться уязвимостью правил [Color=Red]| Ban 15 дней[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Уход от наказания`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.34[/color]. Запрещен уход от наказания [Color=Red]| Ban 15 - 30 дней[/color]([Color=Orange]суммируется к общему наказанию дополнительно[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix:  ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `IC и OCC угрозы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.35[/color]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=Red]| Mute 120 минут / Ban 7 дней[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `IC конфликты в OOC`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.36[/color]. Запрещено переносить конфликты из IC в OOC и наоборот [Color=Red]| Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: `Угрозы OOC`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.37[/color]. Запрещены OOC угрозы, в том числе и завуалированные [Color=Red]| Mute 120 минут / Ban 7 дней [/color]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Злоуп наказаниями`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.39[/color]. Злоупотребление нарушениями правил сервера [Color=Red]| Ban 7 - 30 дней [/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск проекта`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.40[/color]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=Red]| Mute 300 минут / Ban 30 дней[/color] ([Color=Cyan]Ban выдается по согласованию с главным администратором[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Продажа промо`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.43[/color]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=Red]| Mute 120 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `ЕПП Фура`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.47[/color]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Покупка фам.репы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.48[/color]. Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. [Color=Red]| Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/color]<br><br>` +
        `[CENTER][Color=Orange]Примечание[/color]: скрытие информации о продаже репутации семьи приравнивается к [Color=Red]пункту правил 2.24.[/color][/CENTER]<br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Помеха РП процессу`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.51[/color]. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нонрп акс`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.52[/color]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=Red]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `2.53(Названия маты)`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.53[/color]. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=Red]| Ban 1 день / При повторном нарушении обнуление бизнеса[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Неув обр. к адм`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.54[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=Red]| Mute 180 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Баг аним`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Приветствую, уважаемый игрок[/COLOR]  {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.55[/color]. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=Red]| Jail 60 / 120 минут [/color]<br>` +
        `[Color=Orange]Пример[/color]: если Нарушитель, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=Red]Jail на 120 минут[/COLOR].<br>` +
        `Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. <br>` +
        `[Color=Orange]Пример[/color]: если Нарушитель использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=Red]Jail на 60 минут[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
	        },

         {
      title: '---------------------------------------------Раздел модерации форума---------------------------------------------'
    },
    {
	  title: 'Био одобрена',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша биография получает Статус: [Color=rgb(0,255,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация  [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	  prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
	  title: 'Био отказана',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша биография получает Статус: [Color=rgb(255, 0 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация  [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
	  title: 'На рассмотрение био',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша биография получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация  [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	  prefix: PIN_PREFIX,
    status: false,
    },
    {
	  title: 'Био от 3го лица',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша биография получает Статус: [Color=rgb(255, 00 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Причиной тому послужило: Ваша RP Биография написана не от 3го лица игрового персонажа.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация  [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	  prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
	  title: 'Био не по форме',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша биография получает Статус: [Color=rgb(255, 00 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Причиной тому послужило: Ваша RP Биография была составлена не по форме. Пожалуйста ознакомьтесь с правилами написания RP биографии.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация  [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	  prefix: UNACCEPT_PREFIX,
    status: false,
    },


 {
      title: '----------------------------------------------------- Амнистия -----------------------------------------------------'
    },

 {
	  title: 'Амнистия отказ',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Мы рассмотрели вашу жалобу и приняли решение [COLOR=rgb(255,0,0)]отказа в амнистии.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Наказание выдано по разумному решению, чтобы обеспечить справедливую игровую среду. [/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Спасибо за ваше обращение, а так-же спасибо за понимание![/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
	  title: 'Амнистия в пользу игрока',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Мы рассмотрели вашу жалобу и приняли решение амнистии [COLOR=rgb(0,255,0)]в вашу пользу.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Наказание выдано по разумному решению, чтобы обеспечить справедливую игровую среду. [/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Наказание будет смягчено, чтобы обеспечить справедливую игровую среду. Спасибо за ваше участие![/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
	  title: 'Жалоба пустышка',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Просим вас составить новую жалобу с подробным описанием ситуации и предоставленными доказательствами.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: UNACCEPT_PREFIX,
    status: false,
    },

];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Восстанавливаем фон из localStorage, если он существует
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        $('body').css('background-image', `url(${savedBackground})`); // Устанавливаем сохраненный фон
        $('body').css('background-size', 'cover'); // Устанавливаем размер фона
    }

    // Добавление кнопок при загрузке страницы
    addButton('Меню', 'selectAnswer');
    addButton('Одобрить', 'accepted');
    addButton('Отказать', 'unaccept');
    addButton('На рассмотрение', 'pin');
    addButton('Закрыть', 'CLOSE_PREFIX');
    addButton('Изменить фон', 'changeBackground'); // Добавлена кнопка для изменения фона
    addButton('1Wmobile', 'exit', true); // Изменение здесь для анимации текста

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#GA_PREFIX').click(() => editThreadData(GA_PREFIX, true));
    $('button#WAITING_PREFIX').click(() => editThreadData(WAITING_PREFIX, true));
    $('button#TEX_PREFIX').click(() => editThreadData(TEX_PREFIX, true));
    $('button#SPECIAL_PREFIX').click(() => editThreadData(SPECIAL_PREFIX, true));
    $('button#CLOSE_PREFIX').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#RESHENO_PREFIX').click(() => editThreadData(RESHENO_PREFIX, false));

    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            if (id > 0) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
            } else {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
            }
        });
    });

    // Обработчик для изменения фона
    $('button#changeBackground').click(() => {
        const url = prompt('Введите URL для нового фона:'); // Запрашиваем URL
        if (url) {
            $('body').css('background-image', `url(${url})`); // Устанавливаем новый фон
            $('body').css('background-size', 'cover'); // Устанавливаем размер фона
            localStorage.setItem('backgroundImage', url); // Сохраняем URL в localStorage
        }
    });

    // Синхронизация фона между вкладками
    window.addEventListener('storage', (event) => {
        if (event.key === 'backgroundImage' && event.newValue) {
            $('body').css('background-image', `url(${event.newValue})`);
            $('body').css('background-size', 'cover');
        }
    });

    // Анимация текста
    animateText();
});

// Функция добавления кнопки
function addButton(name, id, animated = false) {
    $('.button--icon--reply').before(
        `<button type="button" class="button rippleButton ${animated ? 'animated-button' : ''}" id="${id}" style="margin: 3px;">
            <span class="text">${name}</span>
        </button>`
    );
}

// Функция анимации текста
function animateText() {
    const button = $('#exit .text'); // Находим текст кнопки
    button.css('animation', 'textGlowFade 1.5s infinite alternate'); // Включаем анимацию
    let toggle = true; // Флаг для переключения текста

    setInterval(() => {
        if (toggle) {
            button.text('Hercules'); // Меняем текст"
        } else {
            button.text('Hercules'); // Меняем текст обратно
        }
        toggle = !toggle; // Переключаем флаг
    }, 1500); // Интервал в 1.5 секунды
}

// Разметка кнопок
function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
        .map(
            (btn, i) =>
                `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px">
                <span class="button-text">${btn.title}</span></button>`
        )
        .join('')}</div>`;
}

// Функция вставки содержимого
function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == true) {
        editThreadData(buttons[id].prefix, buttons[id].status);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}

// Получение данных о теме
function getThreadData() {
    const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
    const authorName = $('a.username').html();
    const hours = new Date().getHours();
    return {
        user: {
            id: authorID,
            name: authorName,
            mention: `[USER=${authorID}]${authorName}[/USER]`,
        },
        greeting: () =>
            4 < hours && hours <= 11
                ? 'Доброе утро'
                : 11 < hours && hours <= 15
                ? 'Добрый день'
                : 15 < hours && hours <= 21
                ? 'Добрый вечер'
                : 'Доброй ночи',
    };
}

// Функция редактирования данных темы
function editThreadData(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;

    fetch(`${document.URL}edit`, {
        method: 'POST',
        body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            sticky: pin ? 1 : 0,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
        }),
    }).then(() => location.reload());
}

// Функция получения данных формы
function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(i => formData.append(i[0], i[1]));
    return formData;
}






// CSS для кнопок и прозрачного фона
const css = `
<style>
.button {
    transition: background-color 0.3s, transform 0.3s;
    border: 1px solid #ddd; /* Граница для 3D эффекта */
    border-radius: 5px; /* Закругленные углы */
    box-shadow: 0 5px 15px rgba(199, 9, 108, 0,8); /* Тень для 3D эффекта */
}
.button:hover {
    background-color: #AFEEEE;
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); /* Увеличенная тень при наведении */
}
.rippleButton {
    position: relative;
    overflow: hidden;
}
.rippleButton:after {
    content: '';
    position: absolute;
    background: rgba(0, 255, 255, 0.7);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
}
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
.animated-button .text {
    animation: textGlowFade 1.5s infinite alternate;
}
@keyframes textGlowFade {
    0% {
        color: #DB7093; /* Ярко-белый */
        text-shadow: 0 0 25px #DB7093, 0 0 35px #DB7093, 0 0 50px #DB7093; /* Усиленный светящийся эффект */
    }
    100% {
        color: transparent; /* Прозрачный */
        text-shadow: none; /* Убираем светящийся эффект */
    }
}
.block--messages.block .message,
.js-quickReply.block .message,
.block--messages .block-row,
.js-quickReply .block-row,
.uix_extendedFooter,
.message-cell.message-cell--user,
.message-cell.message-cell--action,
.fr-box.fr-basic,
.blockStatus { /* Добавлено для .blockStatus */
    background: rgba(0, 0, 0, 0) !important; /* Полностью прозрачный фон */
    transition: background 0.3s; /* Плавный переход фона */
}
.block--messages.block .message:hover,
.js-quickReply.block .message:hover,
.block--messages .block-row:hover,
.js-quickReply .block-row:hover,
.uix_extendedFooter:hover,
.message-cell.message-cell--user:hover,
.message-cell.message-cell--action:hover {
    background: rgb(58 56 56 / 96%) !important; /* Серый полупрозрачный фон при наведении */
}
</style>
`;

$('head').append(css); // Добавление стилей в head
})();
