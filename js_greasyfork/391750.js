// ==UserScript==
// @name        Diep.io Клоны (Рус)
// @description Позволяет контролировать больше одного танка
// @author      https://greasyfork.org/ru/users/393261-фелкис
// @version     Полная - 1.3
// @include     http://Diep.io/*
// @include     https://Diep.io/*
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @namespace https://greasyfork.org/users/393261
// @downloadURL https://update.greasyfork.org/scripts/391750/Diepio%20%D0%9A%D0%BB%D0%BE%D0%BD%D1%8B%20%28%D0%A0%D1%83%D1%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/391750/Diepio%20%D0%9A%D0%BB%D0%BE%D0%BD%D1%8B%20%28%D0%A0%D1%83%D1%81%29.meta.js
// ==/UserScript==

//Назначение клавиш
//V (Рус. М) (Удерживайте) - Отключает репликатор на время удержания клавиши, однако ваши клоны продолжают повторять ваши последние действия

//Почему это? Ведь уже есть 1.6!
// + Да, согласен, но я в разы уменьшил лаги за счет ограничения клавиш и фокусировки документа
// + Видимо, только я додумался добавить клавишу "V", что бы у вас было не только силовое, но и тактическое преимущество

//Англоязычный коллега
//https://greasyfork.org/ru/scripts/401910-diep-io-tool
//Внимание! Его скрипт реализован через Diepsocket, он кушает меньше RAM, но не сможет обеспечить вам больше 5 ботов (А я смогу :D)

//Пакеты контроля
var KeycodesTrick;
//KeycodesTrick = [87,65,83,68,13,32,16,69,67,49,50,51,52,53,54,55,56,77,85,72,75,79] //Полный пакет + (Все клавиши, но может тормозить)
KeycodesTrick = [87,65,83,68,13,32,16,69,67,49,50,51,52,53,54,55,56,77,85,72] //Полный пакет (Все клавиши, кроме Sandbox)
//KeycodesTrick = [87,65,83,68,13,32,16,69,67,49,50,51,52,53,54,55,56,77,85] //Универсальный (Нет клавиш режимов)
//KeycodesTrick = [87,65,83,68,13,32,16,69,67,49,50,51,52,53,54,55,56] //Достаточный (Нет клавиш U и M)
//KeycodesTrick = [87,65,83,68,13,32,16,69,67] //Уменьшенный 1 (Отключены клавиши с 1 до 8)
//KeycodesTrick = [87,65,83,68,13,69,67] //Уменьшенный 2 (Отключены клавиши Shift и Emptyspace)
//KeycodesTrick = [87,65,83,68,13] //Минимальный (Только необходимое, нет клавиш C и E)

var KeycodesState = []; // < Здесь все прожимаемые в данном окне кнопки
var MouseState = false; // < А здесь мышь
GM_setValue("Keys86", false);

//Подключение клавиатуры
document.addEventListener("keyup",function(key){
    if (document.hasFocus()){
        key = key.keyCode || key.which;
        GM_setValue("Keys"+key,false);
    };
});
document.addEventListener("keydown",function(key){
    if (document.hasFocus()){
        key = key.keyCode || key.which;
        GM_setValue("Keys"+key,true);
    };
});

//Подключение мыши
document.addEventListener("mouseup",function(but){
    if (document.hasFocus()){
        GM_setValue("Click",false);
        MouseState = false;
    };
});
document.addEventListener("mousedown",function(but){
    if (document.hasFocus()){
        GM_setValue("Click",true);
        MouseState = true;
    };
});
document.addEventListener("mousemove",function(mouse){
    if (document.hasFocus()){
        GM_setValue("GlobalX",mouse.clientX/window.innerWidth);
        GM_setValue("GlobalY",mouse.clientY/window.innerHeight);
    };
});

//Тик репликации (Осторожно: рекурсивная функция!)
function Trick(){
    console.log(document.hasFocus());
    if (!document.hasFocus()){
        if (!GM_getValue("Keys"+86)){
            //Синхронизация (Подготовка переменных)
            var Frame = [];
            KeycodesTrick.forEach(function(key){
                Frame[key] = GM_getValue("Keys"+key);
            });
            Frame.LocalX = GM_getValue("GlobalX")*window.innerWidth;
            Frame.LocalY = GM_getValue("GlobalY")*window.innerHeight;
            Frame.MouseState = GM_getValue("Click");
            //Синхронизация (Обработка события)
            //... [Клавиатура]
            KeycodesTrick.forEach(function(key){
                if (KeycodesState[key] != Frame[key]){
                    KeycodesState[key] = Frame[key];
                    var Reply = document.createEvent("Event");
                    if (Frame[key]) {
                        Reply.initEvent("keydown",true,true);
                        Reply.keyCode = key;
                    } else {
                        Reply.initEvent("keyup",true,true);
                        Reply.keyCode = key;
                    };
                    window.dispatchEvent(Reply);
                };
            });
            //...[Курсор]
            if (isFinite(Frame.LocalX) && isFinite(Frame.LocalY)){
                if (Frame.MouseState != MouseState){
                    MouseState = Frame.MouseState;
                    if (MouseState){
                        canvas.dispatchEvent(new MouseEvent('mousedown',{'clientX':Frame.LocalX,'clientY':Frame.LocalY,'button':0,'mozPressure':1.0}));
                    } else {
                        canvas.dispatchEvent(new MouseEvent('mouseup',{'clientX':Frame.LocalX,'clientY':Frame.LocalY,'button':0,'mozPressure':1.0}));
                    };
                };
                canvas.dispatchEvent(new MouseEvent('mousemove',{'clientX':Frame.LocalX,'clientY':Frame.LocalY}));
             };
        };
    };
    setTimeout(Trick,5);
};

alert("Репликатор успешно загружен!");
setTimeout(Trick,10);