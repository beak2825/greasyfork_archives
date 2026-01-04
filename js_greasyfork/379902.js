// ==UserScript==
// @name           Include Tools
// @namespace      scriptomatika
// @author         mouse-karaganda
// @description    Общие инструменты для всех страничек
// @version        1.35
// @grant          none
// ==/UserScript==

/* jshint esversion: 6 */

var paramWindow = (typeof unsafeWindow === 'object') ? unsafeWindow : window;

(function(unsafeWindow) {
    var console = unsafeWindow.console;
    var jQuery = unsafeWindow.jQuery;

    unsafeWindow.__krokodil = {
        /**
         * Отрисовывает элемент
         */
        renderElement: function(config) {
            // Определяем параметры по умолчанию
            var newRenderType = this.setRenderType(config.renderType);
            var newConfig = {
                // ~~~ название тега ~~~ //
                tagName: config.tagName || 'div',
                // ~~~ атрибуты тега ~~~ //
                attr: config.attr || {},
                // ~~~ идентификатор ~~~ //
                id: config.id,
                // ~~~ имя класса ~~~ //
                cls: config.cls,
                // ~~~ встроенные стили тега ~~~ //
                style: config.style || {},
                // ~~~ встроенные данные ~~~ //
                dataset: config.dataset || {},
                // ~~~ содержимое элемента ~~~ //
                innerHTML: this.join(config.innerHTML || ''),
                // ~~~ обработчики событий элемента ~~~ //
                listeners: config.listeners || {},
                // ~~~ родительский элемент для нового ~~~ //
                renderTo: this.getIf(config.renderTo),
                // ~~~ способ отрисовки:  append (по умолчанию), insertBefore, insertAfter, insertFirst, none ~~~ //
                renderType: newRenderType
            };
            var newElement;
            if (newConfig.tagName == 'text') {
                // Создаем текстовый узел
                newElement = document.createTextNode(newConfig.innerHTML);
            } else {
                // Создаем элемент
                newElement = document.createElement(newConfig.tagName);
                // Добавляем атрибуты
                this.attr(newElement, newConfig.attr);
                // Добавляем идентификатор, если указан
                if (newConfig.id) {
                    this.attr(newElement, { 'id': newConfig.id });
                }
                //console.log('newElement == %o, config == %o, id == ', newElement, newConfig, newConfig.id);
                // Добавляем атрибут класса
                if (newConfig.cls) {
                    this.attr(newElement, { 'class': newConfig.cls });
                }
                // Наполняем содержимым
                newElement.innerHTML = newConfig.innerHTML;
                // Задаем стиль
                this.css(newElement, newConfig.style);
                // Задаем встроенные данные
                this.extend(newElement.dataset, newConfig.dataset);
                // Навешиваем события
                var confListeners = newConfig.listeners;
                for (var ev in confListeners) {
                    if (ev != 'scope') {
                        //console.log('this.on(newElement == %o, ev == %o, newConfig.listeners[ev] == %o, newConfig.listeners.scope == %o)', newElement, ev, newConfig.listeners[ev], newConfig.listeners.scope);
                        this.on(newElement, ev, newConfig.listeners[ev], newConfig.listeners.scope);
                    }
                }
                //console.log('После: tag == %o, listeners == %o', newConfig.tagName, confListeners);
            }
            // Отрисовываем элемент
            var target, returnRender = true;
            while (returnRender) {
                switch (newConfig.renderType) {
                    // Не отрисовывать, только создать
                    case this.enumRenderType['none']: {
                        returnRender = false;
                        break;
                    };
                    // Вставить перед указанным
                    case this.enumRenderType['insertBefore']: {
                        target = newConfig.renderTo || document.body.firstChild;
                        // если элемент не задан - вернемся к способу по умолчанию
                        if (target) {
                            target.parentNode.insertBefore(newElement, target);
                            returnRender = false;
                        } else {
                            newConfig.renderType = this.enumRenderType['default'];
                        }
                        break;
                    };
                    // Вставить после указанного
                    case this.enumRenderType['insertAfter']: {
                        // если элемент не задан - вернемся к способу по умолчанию
                        if (newConfig.renderTo && newConfig.renderTo.nextSibling) {
                            target = newConfig.renderTo.nextSibling;
                            target.parentNode.insertBefore(newElement, target);
                            returnRender = false;
                        } else {
                            newConfig.renderType = this.enumRenderType['default'];
                        }
                        break;
                    };
                    // Вставить как первый дочерний
                    case this.enumRenderType['prepend']: {
                        // если элемент не задан - вернемся к способу по умолчанию
                        if (newConfig.renderTo && newConfig.renderTo.firstChild) {
                            target = newConfig.renderTo.firstChild;
                            target.parentNode.insertBefore(newElement, target);
                            returnRender = false;
                        } else {
                            newConfig.renderType = this.enumRenderType['default'];
                        }
                        break;
                    };
                    // Вставить как последний дочерний
                    case this.enumRenderType['append']:
                    default: {
                        var parent = newConfig.renderTo || document.body;
                        parent.appendChild(newElement);
                        returnRender = false;
                    };
                }
            }
            // Возвращаем элемент
            return newElement;
        },
        /**
         * Отрисовать несколько одинаковых элементов подряд
         */
        renderElements: function(count, config) {
            for (var k = 0; k < count; k++) {
                this.renderElement(config);
            }
        },
        /**
         * Отрисовать текстовый узел
         */
        renderText: function(config) {
            // Упрощенные настройки
            var newConfig = {
                tagName: 'text',
                innerHTML: config.text,
                renderTo: config.renderTo,
                renderType: config.renderType
            };
            var newElement = this.renderElement(newConfig);
            return newElement;
        },
        /**
         * Отрисовать элемент style
         * @param {String} text Любое количество строк через запятую
         */
        renderStyle: function(text) {
            var stringSet = arguments;
            var tag = this.renderElement({
                tagName: 'style',
                attr: { type: 'text/css' },
                innerHTML: this.format('\n\t{0}\n', this.join(stringSet, '\n\t'))
            });
            return tag;
        },
        /**
         * Возможные способы отрисовки
         */
        enumRenderType: {
            'append': 0,
            'prepend': 1,
            'insertBefore': 2,
            'insertAfter': 3,
            'none': 4,
            'default': 0
        },
        // Назначает способ отрисовки
        setRenderType: function(renderType) {
            if (typeof renderType != 'string') {
                return this.enumRenderType['default'];
            }
            if (this.enumRenderType[renderType] == undefined) {
                return this.enumRenderType['default'];
            }
            return this.enumRenderType[renderType];
        },
        /**
         * Карта кодов клавиш
         */
        keyMap: {
            // Клавиши со стрелками
            arrowLeft: 37,
            arrowUp: 38,
            arrowRight: 39,
            arrowDown: 40
        },
        /**
         * Карта кодов символов
         */
        charMap: {
            arrowLeft: 8592, // ←
            arrowRight: 8594 // →
        },
        /**
         * Ждём, пока отрисуется элемент, и выполняем действия
         * @param {String} selector css-селектор для поиска элемента (строго строка)
         * @param {Function} callback Функция, выполняющая действия над элементом. this внутри неё — искомый DOM-узел
         * @param {Number} maxIterCount Максимальное количество попыток найти элемент
         */
        missingElement: function(selector, callback, maxIterCount) {
            var setLog = false;
            // Итерации 10 раз в секунду
            var missingOne = 100;
            // Ограничим количество попыток разумными пределами
            var defaultCount = 3000;
            if (!this.isNumber(maxIterCount)) {
                maxIterCount = defaultCount;
            }
            if (0 > maxIterCount || maxIterCount > defaultCount) {
                maxIterCount = defaultCount;
            }
            // Запускаем таймер на поиск
            var iterCount = 0;
            var elementTimer = setInterval(this.createDelegate(function() {
                // Сообщение об ожидании
                var showIter = (iterCount % 10 == 0);
                showIter &= (300 > iterCount) || (iterCount > 2700);
                if (showIter) {
                    var secondsMsg = this.numberWithCase(iterCount, 'секунду', 'секунды', 'секунд');
                    if (setLog) console.log('missing: Ждём [%o] %s', selector, secondsMsg);
                }
                var element = this.getAll(selector);
                // Определим, что вышел элемент
                var elementStop = this.isIterable(element) && (element.length > 0);
                // Определим, что кончилось количество попыток
                var iterStop = (iterCount >= maxIterCount);
                if (elementStop || iterStop) {
                    clearInterval(elementTimer);
                    var elementExists = true;
                    // Если элемент так и не появился
                    if (!elementStop && iterStop) {
                        if (setLog) console.log('missing: Закончились попытки [%o]', selector);
                        elementExists = false;
                        return;
                    }
                    // Появился элемент - выполняем действия
                    if (setLog) console.log('missing: Появился элемент [%o] == %o', selector, element);
                    if (this.isFunction(callback)) {
                        if (element.length == 1) {
                            element = element[0];
                        }
                        if (setLog) console.log('missing: Запускаем обработчик [%o] == %o', elementExists, element);
                        callback.call(element, elementExists);
                    }
                }
                iterCount++;
            }, this), missingOne);
        },
        /**
         * Добавить свойства в объект
         */
        extend: function(target, newProperties) {
            if (typeof newProperties == 'object') {
                for (var i in newProperties) {
                    target[i] = newProperties[i];
                }
            }
            return target;
        },
        /**
         * Создать класс-наследник от базового класса или объекта
         */
        inherit: function(base, newConfig) {
            var newProto = (typeof base == 'function') ? new base() : this.extend({}, base);
            this.extend(newProto, newConfig);
            return function() {
                var F = function() {};
                F.prototype = newProto;
                return new F();
            };
        },
        /**
         * Получить элемент по селектору
         */
        get: function(selector, parent) {
            parent = this.getIf(parent);
            return (parent || unsafeWindow.document).querySelector(selector);
        },
        /**
         * Получить массив элементов по селектору
         */
        getAll: function(selector, parent) {
            parent = this.getIf(parent);
            return (parent || unsafeWindow.document).querySelectorAll(selector);
        },
        /**
         * Получить элемент, если задан элемент или селектор
         */
        getIf: function(element) {
            return this.isString(element) ? this.get(element) : element;
        },
        /**
         * Получить массив элементов, если задан массив элементов или селектор
         */
        getIfAll: function(elements) {
            return this.isString(elements) ? this.getAll(elements) : this.toIterable(elements);
        },
        /**
         * Назначим атрибуты элементу или извлечем их
         */
        attr: function(element, attributes) {
            var nativeEl = this.getIf(element);
            if (typeof attributes == 'string') {
                // извлечем атрибут
                var result = '';
                if (nativeEl.getAttribute) {
                    result = nativeEl.getAttribute(attributes);
                }
                if (!result) {
                    result = '';
                }
                return result;
            } else if (typeof attributes == 'object') {
                // назначим атрибуты всем элементам по селектору
                nativeEl = this.getIfAll(element);
                for (var i = 0; i < nativeEl.length; i++) {
                    // назначим атрибуты из списка
                    for (var at in attributes) {
                        try {
                            if (attributes[at] == '') {
                                // Удалим пустой атрибут
                                nativeEl[i].removeAttribute(at);
                            } else {
                                // Запишем осмысленный атрибут
                                nativeEl[i].setAttribute(at, attributes[at]);
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            }
        },
        /**
         * Назначим стили элементу или извлечем их
         */
        css: function(element, properties) {
            var nativeEl = this.getIf(element);
            if (typeof properties == 'string') {
                // извлечем стиль
                var result = '';
                if (nativeEl.style) {
                    var calcStyle = window.getComputedStyle(nativeEl, null) || nativeEl.currentStyle;
                    result = calcStyle[properties];
                }
                if (!result) {
                    result = '';
                }
                return result;
            } else if (typeof properties == 'object') {
                // присвоим стили всем элементам по селектору
                nativeEl = this.getIfAll(element);
                try {
                    for (var i = 0; i < nativeEl.length; i++) {
                        // назначим стили из списка
                        this.extend(nativeEl[i].style, properties);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        },
        /**
         * Показать элемент
         */
        show: function(element, inline) {
            var current = this.getIf(element);
            if (current) {
                var style = current.style;
                style.display = inline ? 'inline' : 'block';
            }
        },
        /**
         * Спрятать элемент
         */
        hide: function(element, soft) {
            var current = this.getIf(element);
            if (current) {
                if (!!soft) {
                    current.style.visibility = 'hidden';
                } else {
                    current.style.display = 'none';
                }
            }
        },
        /**
         * Спрятать элемент, убрав его за границу экрана
         */
        hideFixed: function(element) {
            var current = this.getIf(element);
            if (current) {
                this.css(current, {
                    position: 'fixed',
                    left: '-2000px',
                    top: '-2000px'
                });
            }
        },
        /**
         * Удалить элемент
         */
        del: function(element) {
            var current = this.getIf(element);
            if (current && current.parentNode) {
                current.parentNode.removeChild(current);
            }
        },
        /**
         * Изменить видимость элемента
         */
        toggle: function(element, inline) {
            this.isVisible(element) ? this.hide(element) : this.show(element, inline);
        },
        /**
         * Проверить, виден ли элемент
         */
        isVisible: function(element) {
            return this.getIf(element).style.display != 'none';
        },
        /**
         * Навесить обработчик
         */
        on: function(element, eventType, handler, scope) {
            var elements;
            if (!element) {
                return false;
            }
            if (this.isString(element)) {
                element = this.getIfAll(element);
                if (!(element && this.isIterable(element)))
                    return false;
            }
            if (!this.isIterable(element)) {
                element = this.toIterable(element);
            }
            var eventHandler = handler;
            if (scope) {
                eventHandler = this.createDelegate(handler, scope, handler.arguments);
            }
            this.each(element, function(currentEl) {
                if (currentEl.addEventListener) {
                    currentEl.addEventListener(eventType, eventHandler, false);
                }
                else if (currentEl.attachEvent) {
                    currentEl.attachEvent('on' + eventType, eventHandler);
                }
            }, this);
        },
        /**
         * Запустить событие
         */
        fireEvent: function(element, eventType, keys, bubbles, cancelable) {
            // Определим необходимые параметры
            var eventBubbles = this.isBoolean(bubbles) ? bubbles : true;
            var eventCancelable = this.isBoolean(cancelable) ? cancelable : true;
            // Для клика создадим MouseEvent
            var isMouse = /click|dblclick|mouseup|mousedown/i.test(eventType);
            // Приведем к нужному виду клавиши
            keys = keys || {};
            this.each(['ctrlKey', 'altKey', 'shiftKey', 'metaKey'], function(letter) {
                if (!keys[letter]) {
                    keys[letter] = false;
                }
            });
            // запустим для всех элементов по селектору
            var nativeEl = this.getIfAll(element);
            this.each(nativeEl, function(elem) {
                var evt = document.createEvent(isMouse ? 'MouseEvents' : 'HTMLEvents');
                if (isMouse) {
                    // Событие мыши
                    // event.initMouseEvent(type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
                    evt.initMouseEvent(eventType, eventBubbles, eventCancelable, window, 0, 0, 0, 0, 0, keys.ctrlKey, keys.altKey, keys.shiftKey, keys.metaKey, 0, null);
                } else {
                    // Событие общего типа
                    // event.initEvent(type, bubbles, cancelable);
                    evt.initEvent(eventType, eventBubbles, eventCancelable);
                }
                //var evt = (isMouse ? new MouseEvent() : new UIEvent());
                elem.dispatchEvent(evt);
                //console.log('dispatchEvent elem == %o, event == %o', elem, evt);
            }, this);
        },
        /**
         * Остановить выполнение события
         */
        stopEvent: function(e) {
            var event = e || window.event;
            if (!event) {
                return false;
            }
            event.preventDefault = event.preventDefault || function() {
                this.returnValue = false;
            };
            event.stopPropagation = event.stopPropagation || function() {
                this.cancelBubble = true;
            };
            event.preventDefault();
            event.stopPropagation();
            return true;
        },
        /**
         * Выделить текст в поле ввода
         */
        selectText: function(element, start, end) {
            var current = this.getIf(element);
            if (!current) {
                return;
            }
            if (!end) {
                end = start;
            }
            // firefox
            if ('selectionStart' in element) {
                element.setSelectionRange(start, end);
                element.focus(); // to make behaviour consistent with IE
            }
            // ie win
            else if(document.selection) {
                var range = element.createTextRange();
                range.collapse(true);
                range.moveStart('character', start);
                range.moveEnd('character', end - start);
                range.select();
            }
        },
        /**
         * Определяет, является ли значение строкой
         */
        isString : function(v) {
            return typeof v === 'string';
        },
        /**
         * Определяет, является ли значение числом
         */
        isNumber: function(v) {
            return typeof v === 'number' && isFinite(v);
        },
        /**
         * Определяет, является ли значение булевым
         */
        isBoolean: function(v) {
            return typeof v === 'boolean';
        },
        /**
         * Определяет, является ли значение объектом
         */
        isObject : function(v) {
            return typeof v === 'object';
        },
        /**
         * Определяет, является ли значение функцией
         */
        isFunction: function(v) {
            return typeof v === 'function';
        },
        /**
         * Определяет, является ли значение датой
         */
        isDate: function(v) {
            var result = true;
            this.each([
                'getDay',
                'getMonth',
                'getFullYear',
                'getHours',
                'getMinutes'
            ], function(property) {
                result == result && this.isFunction(v[property]);
            }, this);
            return result;
        },
        /**
         * Переведем число в удобочитаемый вид с пробелами
         */
        numberToString: function(v) {
            var partLen = 3;
            try {
                v = Number(v);
            } catch (e) {
                return v;
            }
            v = String(v);
            var pointPos;
            pointPos = (pointPos = v.indexOf('.')) > 0 ? (pointPos) : (v.length);
            var result = v.substring(pointPos);
            v = v.substr(0, pointPos);
            var firstPart = true;
            while (v.length > 0) {
                var startPos = v.length - partLen;
                if (startPos < 0) {
                    startPos = 0;
                }
                if (!firstPart) {
                    result = ' ' + result;
                }
                firstPart = false;
                result = v.substr(startPos, partLen) + result;
                v = v.substr(0, v.length - partLen);
            }
            return result;
        },
        /**
         * Число с текстом в нужном падеже
         * @param {Number} number Число, к которому нужно дописать текст
         * @param {String} textFor1 Текст для количества 1
         * @param {String} textFor2 Текст для количества 2
         * @param {String} textFor10 Текст для количества 10
         */
        numberWithCase: function(number, textFor1, textFor2, textFor10) {
            // Определяем, какой текст подставить, по последней цифре
            var lastDigit = number % 10;
            var result = {
                number: number,
                text: ''
            };
            // Текст для количества 1
            if (this.inArray(lastDigit, [ 1 ])) {
                result.text = textFor1;
            }
            // Текст для количества 2
            if (this.inArray(lastDigit, [ 2, 3, 4 ])) {
                result.text = textFor2;
            }
            // Текст для количества 10
            if (this.inArray(lastDigit, [ 5, 6, 7, 8, 9, 0 ])) {
                result.text = textFor10;
            }
            // Текст для количества от 11 до 19
            var twoLastDigits = number % 100;
            if (10 < twoLastDigits && twoLastDigits < 20) {
                result.text = textFor10;
            }
            return this.template('{number} {text}', result);
        },
        /**
         * Определить, является ли тип значения скалярным
         */
        isScalar: function(v) {
            return this.isString(v) || this.isNumber(v) || this.isBoolean(v);
        },
        /**
         * Определить, является ли тип значения перечислимым
         */
        isIterable: function(v) {
            var result = !!v;
            if (result) {
                result = result && this.isNumber(v.length);
                result = result && !this.isString(v);
                // У формы есть свойство length - пропускаем её
                result = result && !(v.tagName && v.tagName.toUpperCase() == 'FORM');
            }
            return result;
        },
        /**
         * Сделать значение перечислимым
         */
        toIterable: function(value) {
            if (!value) {
                return value;
            }
            return this.isIterable(value) ? value : [value];
        },
        /**
         * Задать область видимости (scope) для функции
         */
        createDelegate: function(func, scope, args) {
            var method = func;
            return function() {
                var callArgs = args || arguments;
                return method.apply(scope || window, callArgs);
            };
        },
        /**
         * Проверим, является ли значение элементом массива или объекта
         */
        inArray: function(value, array) {
            return this.each(array, function(key) {
                if (key === value) {
                    return true;
                }
            }) !== true;
        },
        /**
         * Найдем значение в массиве и вернем индекс
         */
        findInArray: function(value, array) {
            var result = this.each(array, function(key) {
                if (key === value) {
                    return true;
                }
            });
            return this.isNumber(result) ? result : -1;
        },
        /**
         * Запустить функцию для всех элементов массива или объекта
         * @param {Array} array Массив, в котором значения будут перебираться по индексу элемента
         * @param {Object} array Объект, в котором значения будут перебираться по имени поля
         * @returns {Number} Индекс элемента, на котором досрочно завершилось выполнение, если array - массив
         * @returns {String} Имя поля, на котором досрочно завершилось выполнение, если array - объект
         * @returns {Boolean} True, если выполнение не завершалось досрочно
         */
        each: function(array, fn, scope) {
            if (!array) {
                return;
            }
            if (this.isIterable(array)) {
                for (var i = 0, len = array.length; i < len; i++) {
                    if (this.isBoolean( fn.call(scope || array[i], array[i], i, array) )) {
                        return i;
                    };
                }
            } else {
                for (var key in array) {
                    if (this.isBoolean( fn.call(scope || array[key], array[key], key, array) )) {
                        return key;
                    };
                }
            }
            return true;
        },
        /**
         * Разбить строку, укоротив её и склеив части указанным разделителем
         * @param {String} original Исходная строка
         * @param {Number} maxLength Максимальная длина, до которой нужно усечь исходную строку
         * @param {Number} tailLength Длина второй короткой части
         * @param {String} glue Разделитель, который склеит две части укороченной строки
         */
        splitWithGlue: function(original, maxLength, tailLength, glue) {
            // Разделитель по умолчанию
            if (!this.isString(glue)) {
                glue = '...';
            }
            // По умолчанию строка завершается разделителем
            if (!this.isNumber(tailLength)) {
                tailLength = 0;
            }
            var result = original;
            if (result.length > maxLength) {
                result = this.template('{head}{glue}{tail}', {
                    head: original.substring(0, maxLength - (tailLength + glue.length)),
                    glue: glue,
                    tail: original.substring(original.length - tailLength)
                });
            }
            return result;
        },
        /**
         * форматирование строки, используя объект
         */
        template: function(strTarget, objSource) {
            var s = arguments[0];
            for (var prop in objSource) {
                var reg = new RegExp("\\{" + prop + "\\}", "gm");
                s = s.replace(reg, objSource[prop]);
            }
            return s;
        },
        /**
         * форматирование строки, используя числовые индексы
         */
        format: function() {
            var original = arguments[0];
            this.each(arguments, function(sample, index) {
                if (index > 0) {
                    var currentI = index - 1;
                    var reg = new RegExp("\\{" + currentI + "\\}", "gm");
                    original = original.replace(reg, sample);
                }
            });
            return original;
        },
        /**
         * Быстрый доступ к форматированию
         */
        fmt: function() {
            return this.format.apply(this, arguments);
        },
        /**
         * Выдать строку заданной длины с заполнением символом
         */
        leftPad: function (val, size, character) {
            var result = String(val);
            if (!character) {
                character = ' ';
            }
            while (result.length < size) {
                result = character + result;
            }
            return result;
        },
        /**
        * Определить, какая часть окна ушла вверх при прокрутке
        */
        getScrollOffset: function () {
            var d = unsafeWindow.top.document;
            return top.pageYOffset ? top.pageYOffset : (
                (d.documentElement && d.documentElement.scrollTop) ? (d.documentElement.scrollTop) : (d.body.scrollTop)
            );
        },
        /**
        * Определить размер окна
        */
        getWindowSize: function () {
            var d = unsafeWindow.top.document;
            return {
                width: /*top.innerWidth ? top.innerWidth :*/ (
                    (d.documentElement.clientWidth) ? (d.documentElement.clientWidth) : (d.body.offsetWidth)
                ),
                height: /*top.innerHeight ? top.innerHeight :*/ (
                    (d.documentElement.clientHeight) ? (d.documentElement.clientHeight) : (d.body.offsetHeight)
                )
            };
        },
        /**
         * Склеить строки
         */
        join: function(rows, glue) {
            return Array.prototype.slice.call(this.toIterable(rows), 0).join(glue || '');
        },
        /**
         * Вернем значение cookie
         */
        getCookie: function(name) {
            var value = null;
            // Проверим, есть ли кука с таким именем
            var cookie = unsafeWindow.document.cookie;
            var regKey = new RegExp(name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=(.*?)((; ?)|$)');
            var hasMatch = cookie.match(regKey);
            if (hasMatch && hasMatch[1]) {
                value = decodeURIComponent(hasMatch[1]);
            }
            return value;
        },
        /**
         * Установим значение cookie
         * @param {Object} options Объект с дополнительными значениями
         * - expires Срок действия куки: {Number} количество дней или {Data} дата окончания срока
         * - path Путь, отсчитывая от которого будет действовать кука
         * - domain Домен, в пределах которого будет действовать кука
         * - secure Кука для https-соединения
         */
        setCookie: function(name, value, options) {
            // Можно опустить значение куки, если нужно удалить
            if (!value) {
                value = '';
            }
            options = options || {};
            // Проверяем, задана дата или количество дней
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            // Проставляем другие опции
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = (options.secure === true) ? '; secure' : '';
            unsafeWindow.document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        },
        /**
         * Картинка с большим пальцем
         */
        getThumbHand: function() {
            var thumbSource;
            thumbSource = ( // рука
'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVR42r3SPwsBYRzA8buSlMFi\
MymDd+A1WEiSUDarwS6TwSyjgUkkfxZh4J0YpQwKk8L36R56uu5Rd1ee+izXPd/nN/xMw+cx/xXI\
ooYxhm4DSbRRxAQ5N4EUmqjKKZ4YOAXmeCjfj1ICddyxwVVGxL0dep+AGK2gBA5oYPZjuoWYSheY\
Iq+52EUMAWS8BHxNUJbfo9ij5XWCEl4Y6QIrpG2X4uggjIh84KQLnFHB2uH1kGHtglis7x5scVF+\
uom6Ye3ByxYIoo+lGvB8fAfecvkwEbIZfswAAAAASUVORK5CYII=');
            thumbSource = ( // сообщение
'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABL0lEQVQ4y2P4//8/AyWYgWoGRLTv\
EALipUD8E4j/48G7gFgFmwEbVx689f/3n7//8YEtJ++DDLkNxGxwA4AcHiD+8/ffv/8fvv37//LT\
v//PPv77/+T9v/8P3/37f+/Nv/+3X/39f+cVxPDqBcdBhpghGyCXM/UAWPIFUOOzD//+PwZqfvD2\
3/+7UM3XX/z9f/UZxIDOVWdBBnhjNeApUPOjd1DNr//9v/USovkKUPPFJ7gNgHsB5Pz7QFvvvP77\
/yZQ87Xnf/9fBmq+8ARkwB+wAbWLToAMsMQaiCBDkAHINRce/wUbjBaInLii8Q8syubuuAo36P3n\
H2A+UPwy1mjEhoEK7zx/9xWm8TsQ1xKdEoGKe2duuwLS+AWIC0lKykANSkB8D4hT6JcXBswAAPeL\
DyK+4moLAAAAAElFTkSuQmCC');
            return thumbSource;
        },
        /**
         * Отладка
         */
        thumb: function(text) {
            var bgImage = this.format('background: url("{0}") no-repeat;', this.getThumbHand());
            console.log('%c   ', bgImage, text);
        },
        /**
         * Удалим значение cookie
         */
        removeCookie: function(name) {
            this.setCookie(name, null, { expires: -1 });
        },
        /**
         * Отладка
         */
        groupDir: function(name, object) {
            console.group(name);
            console.dir(object);
            console.groupEnd();
        },
        /**
         * Отладка: ошибка с пользовательским сообщением
         */
        errorist: function(error, text, parameters) {
            var params = Array.prototype.slice.call(arguments, 1);
            params.unshift('#FFEBEB');
            this.coloredLog(params);
            console.error(error);
        },
        /**
         * Отладка: вывод цветной строки
         */
        coloredLog: function(color, text) {
            var params = Array.prototype.slice.call(arguments, 2);
            params.unshift('background-color: ' + color + ';');
            params.unshift('%c' + text);
            console.log.apply(console, params);
        },
        /**
         * XPath-запрос
         */
        xpath: function(selector) {
            var nodes = document.evaluate(selector, document, null, XPathResult.ANY_TYPE, null);
            var thisNode = nodes.iterateNext();
            while (thisNode) {
                //console.log(thisNode.textContent);
                thisNode = nodes.iterateNext();
            }
        },
        /**
         * Упаковать для хранилища
         */
        packToStorage: function(objBox) {
            var clone = this.extend({}, objBox);
            this.each(clone, function(property, index) {
                if (typeof property == 'function') {
                    clone[index] = property.toString();
                }
                if (typeof property == 'object') {
                    clone[index] = this.packToStorage(property);
                }
            }, this);
            return JSON.stringify(clone);
        },
        /**
         * Распаковать из хранилища
         */
        unpackFromStorage: function(objBox) {
            var result = {};
            try {
                result = JSON.parse(objBox);
            } catch (e) {
                try {
                    result = eval('(' + objBox + ')');
                } catch (e) {
                    result = objBox;
                }
            }
            if (typeof result == 'object') {
                for (var property in result) {
                    result[property] = this.unpackFromStorage(result[property]);
                }
            }
            return result;
        },
        /**
         * Проверить соответствие домена, как для Stylish
         */
        mozDocumentDomainIs: function() {
            let result = false;
            let domainList = Array.prototype.slice.call(arguments, 0);
            this.each(domainList, function(domainName, index) {
                let current = (document.domain == domainName) || (document.domain.substring(document.domain.indexOf(domainName) + 1) == domainName);
                result |= current;
            });
            return result;
        },
        /**
         * Проверить начало URL, как для Stylish
         */
        mozDocumentUrlPrefixIs: function() {
            let result = false;
            let prefixList = Array.prototype.slice.call(arguments, 0);
            this.each(prefixList, function(prefix, index) {
                let current = (document.location.href.indexOf(prefix) == 0);
                result |= current;
            });
            return result;
        }
    };

    // Добавляем обратный порядок в jQuery
    if (typeof jQuery != 'undefined') {
        if (typeof jQuery.fn.reverse != 'function') {
            jQuery.fn.reverse = function() {
                return jQuery(this.get().reverse());
            };
        }
        if (typeof jQuery.fn.softHide != 'function') {
            jQuery.fn.softHide = function() {
                return jQuery(this).css({ visibility: 'hidden' });
            };
        }
    }

    unsafeWindow.NodeList.prototype.size = () => this.length;

    // форматирование строки
    unsafeWindow.String.prototype.format = unsafeWindow.__krokodil.format;

    //отладка
    unsafeWindow.console.groupDir = unsafeWindow.__krokodil.groupDir;
    unsafeWindow.console.coloredLog = unsafeWindow.__krokodil.coloredLog;
    unsafeWindow.console.errorist = unsafeWindow.__krokodil.errorist;

    //unsafeWindow.__krokodil.thumb('Include Tools');
    //console.coloredLog('#fffbd6', 'Include Tools');
    //console.errorist('Include Tools');
    console.log('Include Tools 💬 1.35');

})(paramWindow);