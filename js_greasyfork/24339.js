// ==UserScript==
// @name         RainbowMixer
// @namespace    ZababonSoft
// @version      1.200.2
// @description  Перемешивает слова по нажатию Ctrl+Q
// @include     *
// @author       Zababon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24339/RainbowMixer.user.js
// @updateURL https://update.greasyfork.org/scripts/24339/RainbowMixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //переменные-статусы которые следят нажаты ли горячие клавиши
    var shiftKeyPressed = false;
    var ctrlKeyPressed = false;
    var qKeyPressed = false;

    //Функцию которая проверяет нажата ли нужная нам комбинация клавиш ctrl+q
    function checkHotKeysPressed() {
        //console.log(ctrlKeyPressed+' '+qKeyPressed);
        if (ctrlKeyPressed && qKeyPressed) {
            return true;
        }
        return false;
    }

    //Функция проводящая перемешивание набранного в активном поле текста
     function textMixProcedure() {
        //получаем активный элемент
        var activeElement = document.activeElement;
        //определяем тип элемента
        var elementType = activeElement.tagName;
        //console.log(activeElement.tagName);
         
        //достаем содержимое элемента способом соответствующим его типу
        var text;
        switch (elementType) {
            case "BODY":
                return;
            case "INPUT":
                text = activeElement.value;
                break;
            default:
                text = activeElement.innerText;
                break;
        }

        //перемешиваем строку
        text = mixString(text);
        //вставяем новый содержимое соответствующим типу тега способом
        switch (elementType) {
            case "INPUT":
                activeElement.value = text;
                break;
            default:
                activeElement.innerText = text;
                break;
        }
    }

    //Функция непосредственного перемешивания строки
     function mixString(str) {
        //регулярное выражение по поиску слов (находит все подстроки состоящие из буквенных символов длинной 4 или больше)
        var regexp = /[а-яА-ЯёЁa-zA-Z]{4,}/g;
        var result;

        //перебираем найденные в строке слова пока не дойдем до конца строки
        while (result = regexp.exec(str)) {
            //миксуем каждое найденное слово
            var mixedWord = mixWord(result[0]);
            //заменяем в строке старое слово на новое, замиксованное
            str = str.replace(result[0], mixedWord);
        }

        return str;
    }

    //Функция перемешивания отдельных слов
     function mixWord(word) {
        var wordLength = word.length;

        //прекращаем работу функции если длинна слова меньше 4
        if (wordLength < 4) {
            return word;
        }

        //высчитываем количество перемешиваний.
        var swapCount = Math.ceil((wordLength - 2) / 2);
        if (swapCount % 2 === 0) {
            swapCount--;
        }

        while (swapCount--) {
            var firstIndex;
            var secondIndex;

            //случайным образом определяем индекс первой буквы для перемешиваяния (кроме индекса первой и последней буквы)
            firstIndex = Math.floor(Math.random() * (wordLength - 2)) + 1;

            if (firstIndex < wordLength / 2) {
                secondIndex = firstIndex + 1;
            }
            else {
                secondIndex = firstIndex - 1;
            }
            //console.log(swapCount + '.....' + word+ ': ' + firstIndex + '/' + secondIndex);

            //производим обмен букв
            var bufer = word.charAt(firstIndex);
            word = word.replaceAt(firstIndex, word.charAt(secondIndex));
            word = word.replaceAt(secondIndex, bufer);
        }

        return word;
    }

    //функция для замены символа в строке
    String.prototype.replaceAt = function(index, character) {
        return this.substr(0, index) + character + this.substr(index+character.length);
    };

    //событие срабатывающее при нажатии клави клавиатуры
    document.onkeydown = function(event) {
        var keynum;

        //получаем код нажатого символа
        if (window.event) { // IE
            keynum = event.keyCode;
        } else if (event.which) { // Netscape/Firefox/Opera
            keynum = event.which;
        }

        //если это одна из нужных нам клавиш, меняе значение соответствующего ей переменной-статуса
        switch (keynum) {
            case 16: //shift
                shiftKeyPressed = true;
                break;
            case 17: //ctrl
                ctrlKeyPressed = true;
                break;
            case 81: //q
                qKeyPressed = true;
                break;
        }
        //console.log(keynum);
        
        //Проверяем нажата ли нужная нам комбинация клавиш ctrl+q
        //если комбинация нажата, то начинаем процедуру перемешивания текста
        //в активном поле вводе текста.
        if (checkHotKeysPressed()) {
            textMixProcedure();
        }
    };

    //событие срабатывающее при отпускании клави клавиатуры
    document.onkeyup = function(event) {
        var keynum;

        //получаем код нажатого символа
        if (window.event) { // IE
            keynum = event.keyCode;
        } else if (event.which) { // Netscape/Firefox/Opera
            keynum = event.which;
        }

        //если это одна из нужных нам клавиш, меняе значение соответствующего ей переменной-статуса
        switch (keynum) {
            case 16: //shift
                shiftKeyPressed = false;
                break;
            case 17: //ctrl
                ctrlKeyPressed = false;
                break;
            case 81: //q
                qKeyPressed = false;
                break;
        }
    };
})();