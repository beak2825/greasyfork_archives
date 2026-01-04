// ==UserScript==
// @name         Farmerama - Outer log
// @namespace    scriptomatika
// @author       mouse-karaganda
// @description  Outer log
// @license      MIT
// @match        https://www.farmerama.com/?action=internalGameUnity*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmerama.com
// @version      1.5
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/497289/Farmerama%20-%20Outer%20log.user.js
// @updateURL https://update.greasyfork.org/scripts/497289/Farmerama%20-%20Outer%20log.meta.js
// ==/UserScript==

(function() {
    document.title = "Система электронного документооборота";
    console.log('Userscript run at == ', location.href);

    let $ = jQuery;
    let _console = {
        //listenDiv: '#gameContent',
        listenDiv: '#unity-container',
        //listenDiv: '#unity-canvas',

        boxClass: 'consoleBox',
        displayClass: 'consoleNotDisplay',
        get boxSelector() {
            return '#' + this.boxClass;
        },

        createStyle: function() {
            let styleContent = [
                '#consoleBox { position: fixed; z-index: 10000; bottom: 0; right: 0; }',
                '#consoleBox .consoleToolbar { position: absolute; }',
                '#consoleBox .consoleButton { display: inline-block; background: yellow; margin: 0 5px 5px 0; padding: 5px 10px; border: 1px solid black; border-radius: 10px; cursor: pointer; white-space: nowrap; }',
                '#consoleBox .consoleButton:hover { background: white; }',
                '#consoleBox .consoleClose { top: 5px; right: 0; }',
                '#consoleBox .consoleOpen { bottom: 0; right: 0; }',
                '#consoleBox .consoleOuter { position: relative; padding: 37px 20px 5px 5px; background: #97b318; border: 3px double black; border-width: 3px 0 0 3px; border-radius: 15px 0 0 0; }',
                '#consoleBox .consoleInner { width: 500px; height: 350px; overflow: auto; font-family: monospace; }',
                '#consoleBox .consoleNotDisplay { display: none; }'
            ];
            $('<style type="text/css" />').appendTo('head').text(styleContent.join('\n'));
        },

        createPanel: function() {
            let _this = this;
            let box = $('<div />').attr('id', _this.boxClass).appendTo('body');
            _this.outer = $('<div class="consoleOuter" />').appendTo(box)
                .addClass(_this.displayClass);
            _this.inner = $('<div class="consoleInner" />').appendTo(_this.outer);

            let toolbarClose = $('<div class="consoleToolbar consoleClose" />').appendTo(_this.outer);
            _this.btnAdd = $('<div class="consoleButton" />').appendTo(toolbarClose).text('Add map')
                .attr('title', 'Добавить карту')
                .on('click', _this.addMap);
            _this.btnDel = $('<div class="consoleButton" />').appendTo(toolbarClose).text('Del map')
                .attr('title', 'Удалить карту')
                .on('click', _this.delMap);
            _this.btnStop = $('<div class="consoleButton" />').appendTo(toolbarClose).text('Stop map').hide()
                .attr('title', 'Остановить запись карты')
                .on('click', _this.stopMap);
            let btnTrigger = $('<div class="consoleButton" />').appendTo(toolbarClose).text('Trigger').hide()
                .attr('title', 'Имитация')
                .on('click', _this.triggerOne);
            let btnTrash = $('<div class="consoleButton" />').appendTo(toolbarClose).text('🗑️')
                .attr('title', 'Очистить консоль')
                .on('click', _this.clearPanel);
            let btnClose = $('<div class="consoleButton" />').appendTo(toolbarClose).text('🗙')
                .attr('title', 'Закрыть консоль')
                .on('click', _this.togglePanel);

            _this.toolbarOpen = $('<div class="consoleToolbar consoleOpen" />').appendTo(box);
            let btnOpen = $('<div class="consoleButton" />').appendTo(_this.toolbarOpen).text('Open log')
                .attr('title', 'Открыть консоль')
                .on('click', _this.togglePanel);
        },

        togglePanel: function(eventObj) {
            let _this = _console;
            _this.outer.toggleClass(_this.displayClass);
            _this.toolbarOpen.toggleClass(_this.displayClass);
        },

        clearPanel: function(eventObj) {
            let _this = _console;
            _this.inner.html('');
        },

        createListener: function() {
            let _this = _console;
            $(_this.listenDiv).on('click', function(eventObj) {
                let e = eventObj.originalEvent;
                let logEvent = { empty: 0 };
                if (e) {
                    if (false) {
                        logEvent = {};
                        for (let name in e) {
                            logEvent[name] = e[name];
                        }
                    } else {
                        logEvent = {
                            screenX: e.screenX,
                            screenY: e.screenY,
                            timeStamp: e.timeStamp,
                            clientX: e.clientX,
                            clientY: e.clientY,
                            pageX: e.pageX,
                            pageY: e.pageY,
                            //altKey: e.altKey,
                            //ctrlKey: e.ctrlKey,
                            //shiftKey: e.shiftKey,
                            //buttons: e.buttons,
                            //button: e.button,
                        };
                    }
                }
                _console.logObj(logEvent);
            });
        },

        triggerOne: function() {
            let _this = _console;
            let newEvent;

            if (false) {
                newEvent = $.Event('click');
                newEvent.pageX = 832;
                newEvent.pageY = 487;
                $(_this.listenDiv).trigger(newEvent);
            } else {
                newEvent = new MouseEvent('click', {
                    bubbles: true,
                    view: window,
                    buttons: 1,
                    button: 0,
                    clientX: 718,
                    clientY: 331,
                    //pageX: 718,
                    //pageY: 545,
                    screenX: 718,
                    screenY: 444
                });
                $(_this.listenDiv).get(0).dispatchEvent(newEvent);
            }
        },

        addMap: function() {
            let _this = _console;

            let fieldMapValue = localStorage["fieldMap"];
            if (!fieldMapValue) {
                fieldMapValue = '{}';
            }
            try {
                _this.fieldMap = JSON.parse(fieldMapValue);
            } catch (e) {
                _this.logObj({ error: e.message });
                return;
            }

            let nameList = [];
            for (let name in _this.fieldMap) {
                nameList.push(name);
            }
             _this.logObj({ nameList: nameList });

            setTimeout(_this.chooseMap, 200);
        },

        chooseMap: function() {
            let _this = _console;

            let mapName = prompt("Введите имя для карты", "Новая карта");
            if (!mapName || mapName.trim() == "") {
                return;
            }
            if (mapName in _this.fieldMap) {
                let confirmMapName = confirm(`Карта [${mapName}] уже существует.\nВы действительно хотите заменить её?`);
                if (!confirmMapName) {
                    return;
                }
            }

            // Готовимся к записи карты
            _this.btnAdd.hide();
            _this.btnStop.show();

            _this.log(`Началась запись карты [${mapName}]`);
            _this.mapName = mapName;
            _this.fieldMap[mapName] = [];
            $(_this.listenDiv).on('click', _this.writeToMap);
        },

        writeToMap: function(eventObj) {
            let _this = _console;
            let e = eventObj.originalEvent;
            let newPoint = {
                screenX: e.screenX,
                screenY: e.screenY,
                timeStamp: e.timeStamp,
                timeAfter: 0
            };
            let currentLen = _this.fieldMap[_this.mapName].length;
            if (currentLen > 0) {
                newPoint.timeAfter = (newPoint.timeStamp - _this.fieldMap[_this.mapName][currentLen - 1].timeStamp);
            }
            _this.fieldMap[_this.mapName].push(newPoint);
        },

        stopMap: function() {
            let _this = _console;
            $(_this.listenDiv).off('click', _this.writeToMap);

            _this.logObj(_this.fieldMap);
            localStorage["fieldMap"] = JSON.stringify(_this.fieldMap);
            _this.log(`Остановлена запись карты [${_this.mapName}]`);
            delete _this.mapName;
            delete _this.fieldMap;

            _this.btnAdd.show();
            _this.btnStop.hide();
        },

        delMap: function() {
        },

        log: function(addText) {
            let _this = this;
            $('<p />').appendTo(_this.inner).text(addText);
            let ruler = $('<hr />').appendTo(_this.inner);
            ruler.get(0).scrollIntoView();
        },

        logObj: function(obj) {
            this.log(JSON.stringify(obj, null, 2));
        },

        start: function() {
            this.createStyle();
            this.createPanel();
            this.createListener();
        }
    };
    _console.start();
})();