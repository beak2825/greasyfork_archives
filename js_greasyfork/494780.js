// ==UserScript==
// @name         Saima customizer
// @name:ru      Saima: кастомизация
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Saima extension customization ( https://saima.ai/ ): fast speed control WPM (words per minute); correct placement of the Saima button at the same time as the SponsorBlock button. To quickly change the speed, move the cursor over the Saima button at the bottom of the video player (as in the image) and roll the mouse wheel.
// @description:ru  Настройка расширения Saima ( https://saima.ai/ ): быстрый контроль скорости WPM (слов в минуту); правильное размещение кнопки Saima одновременно с кнопкой SponsorBlock. Для быстрого изменения скорости наведите курсор на кнопку Saima в нижней части видеоплеера (как на изображении) и крутите колёсико мыши.
// @author       Igor Lebedev
// @license        GNU Generic Public License v3
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match          http://*.youtube.com/*
// @match          https://*.youtube.com/*
// @require        https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/494780/Saima%20customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/494780/Saima%20customizer.meta.js
// ==/UserScript==
//debugger;

/* global GM_config */

(() => {
    'use strict';

    GM_config.init({
        id: 'sc_config',
        title: GM_info.script.name + ' Settings',
        fields: {
            DEBUG_MODE: {
                label: 'Debug mode',
                type: 'checkbox',
                default: false,
                title: 'Log debug messages to the console'
            },
            CHECK_FREQUENCY_LAUNCH_SAIMA: {
                label: 'Check frequency (ms) launch of the Saima extension',
                type: 'number',
                min: 1000,
                default: 5000,
                title: 'The number of milliseconds to wait between checking the launch of the Saima extension'
            },
            CHECK_FREQUENCY_LAUNCH_SPONSOR_BLOCK: {
                label: 'Check frequency (ms) launch of the SponsorBlock extension',
                type: 'number',
                min: 1000,
                default: 5000,
                title: 'The number of milliseconds to wait between checking the launch of the Saima extension'
            },
            WPM_SPEED: {
                label: 'WPM speed with one scroll of the wheel',
                type: 'number',
                min: 1,
                max: 400,
                default: 30,
                title: 'Changing the WPM (words per minute) speed with one scroll of the wheel'
            },
            SPEED_INDICATOR_TRANSPARENT: {
                label: 'Transparency of the speed indicator',
                type: 'number',
                min: 0.1,
                max: 1,
                default: 0.3,
                title: 'Transparency of the speed indicator on the button'
            },
        },
        events: {
            init: onInit
        }
    })

    GM_registerMenuCommand('Settings', () => {
        GM_config.open()
    })

    class Debugger {
        constructor (name, enabled) {
            this.debug = {}
            if (!window.console) {
                return () => { }
            }
            Object.getOwnPropertyNames(window.console).forEach(key => {
                if (typeof window.console[key] === 'function') {
                    if (enabled) {
                        this.debug[key] = window.console[key].bind(window.console, name + ': ')
                    } else {
                        this.debug[key] = () => { }
                    }
                }
            })
            return this.debug
        }
    }

    var DEBUG

    const SELECTORS = {
        PLAYER: '#movie_player',
        StartSegmentButton: '#startSegmentButton',
        SaimaButtonContainer: '#saima-button-container',
        SaimaButtonContainer_button: '#saima-button-container > div > button',
        SaimaButtonContainer_button_canvas: '#saima-button-container > div > button > canvas',
        SaimaTextField: '.__saima__text-field',
    }
    const WPM_Min = 107 // Минимальная скорость (слов в минуту)
    const WPM_Max = 498 // Максимальная скорость (слов в минуту)
    const WPM_IntervalLenght = WPM_Max - WPM_Min // величина рабочего диапазаона скоростей WPM
    let CanvasMaskTransparent = 0.3 // прозрачность маски
    let WheelWPM = 30 // Изменение скорости WPM за одну прокрутку колёсика


    function onInit() {
        DEBUG = new Debugger(GM_info.script.name, GM_config.get('DEBUG_MODE'))

        let CanvasMaskTransparent = GM_config.get('SPEED_INDICATOR_TRANSPARENT')
        WheelWPM = GM_config.get('WPM_SPEED')

        Move_after_SponsorBlock()
        Quick_WPM_speed_control()
    }

    // Перестановка на плеере кнопки Saima правее кнокпи SponsorBlock - во избежание смещений кнопки Saima при наведении на кнопку SponsorBlock
    function Move_after_SponsorBlock(){
        let jsInitChecktimer = null
        function isDownloadElements(evt) {
            function wait () {
                //ожидание загрузки страницы до необходимого значения
                if (watchThresholdReached()) {
                    try {
                        const StartSegmentButton = document.querySelector(SELECTORS.StartSegmentButton)
                        const SaimaButtonContainer = document.querySelector(SELECTORS.SaimaButtonContainer)
                        if (StartSegmentButton && SaimaButtonContainer) {
                            // Перестановка
                            StartSegmentButton.after(SaimaButtonContainer)
                            clearInterval(jsInitChecktimer)
                            jsInitChecktimer = null
                        }
                    } catch (e) {
                        DEBUG.info(`Failed to like video: ${e}. `)
                    }
                }
            }
            jsInitChecktimer = setInterval(wait, GM_config.get('CHECK_FREQUENCY_LAUNCH_SPONSOR_BLOCK'))
        }
        isDownloadElements()
    }

    // Быстрое изменение скорости WPM
    function Quick_WPM_speed_control() {

        let jsInitChecktimer2 = null
        function isDownloadStartSegmentButton(evt) {
            function wait () {
                //ожидание загрузки страницы до необходимого значения
                if (watchThresholdReached()) {
                    try {
                        const SaimaButtonContainer = document.querySelector(SELECTORS.SaimaButtonContainer)
                        const SaimaTextField = document.querySelector(SELECTORS.SaimaTextField)

                        if (SaimaButtonContainer && SaimaTextField) {
                            const SaimaButtonContainer_button = document.querySelector(SELECTORS.SaimaButtonContainer_button)
                            if (SaimaButtonContainer_button) {
                                let SaimaButtonContainer_spanIco_SpeedProp = 1 - (SaimaTextField._value - WPM_Min) / WPM_IntervalLenght

                                let canvas = document.createElement('canvas')
                                let ctx = canvas.getContext('2d')

                                // Предполагая, что размеры контейнера уже установлены
                                canvas.width = SaimaButtonContainer_button.offsetWidth
                                canvas.height = SaimaButtonContainer_button.offsetHeight
                                canvas.style.position = 'absolute'

                                // Добавляем эффект маски
                                ctx.fillStyle = `rgba(0, 0, 0, ${CanvasMaskTransparent})`
                                // ctx.fillRect(0, 0, canvas.width, canvas.height / 2)
                                ctx.fillRect(0, 0, canvas.width, canvas.height * SaimaButtonContainer_spanIco_SpeedProp)

                                // Добавляем canvas в контейнер
                                SaimaButtonContainer_button.appendChild(canvas)
                            }


                            SaimaButtonContainer.addEventListener('wheel', function(event) {

                                // Предотвращаем стандартное поведение прокрутки страницы
                                event.preventDefault()
                                let RepeatedPresses = 1 // Количество нажатий на одну прокрутку колеса мыши
                                let TimeOutMS = 1 // Интервал между нажатиями

                                // A function to simulate a button click
                                function simulateClickWrap(sign) {
                                    function simulateClick() {

                                        let valueNew = SaimaTextField.valueAsNumber + sign * WheelWPM
                                        switch(sign) {
                                            case 1:
                                                if (valueNew > WPM_Max) valueNew = WPM_Max
                                                break
                                            case -1:
                                                if (valueNew < WPM_Min) valueNew = WPM_Min
                                                break
                                        }

                                        SaimaTextField.value = valueNew
                                        SaimaTextField._value = valueNew

                                        // Создаем новое событие 'input'
                                        let eventInput = new Event('input', {
                                            bubbles: true, // Событие будет всплывать вверх по DOM-дереву
                                            cancelable: false // Событие 'input' обычно не предполагает отмену его действий
                                        });

                                        // Искусственно вызываем событие 'input' на элементе input
                                        SaimaTextField.dispatchEvent(eventInput)

                                    }
                                    if ((event.deltaY < 0 && SaimaTextField.valueAsNumber < WPM_Max) || (event.deltaY > 0 && SaimaTextField.valueAsNumber > WPM_Min)) {
                                        for (let i = 0; i < RepeatedPresses; i++) {
                                            setTimeout((function(index) {
                                                return function() {
                                                    simulateClick()
                                                    // console.log('Button clicked:', index);
                                                }
                                            })(i), i * TimeOutMS) // Задержка TimeOutMS между кликами
                                        }
                                    }

                                    const SaimaButtonContainer_button_canvas = document.querySelector(SELECTORS.SaimaButtonContainer_button_canvas)
                                    if (SaimaButtonContainer_button_canvas) {
                                        let SaimaButtonContainer_spanIco_SpeedProp = 1 - (SaimaTextField._value - WPM_Min) / WPM_IntervalLenght

                                        function updateMaskHeight(newHeightFraction) {
                                            let ctx = SaimaButtonContainer_button_canvas.getContext('2d')
                                            // Очистка холста
                                            ctx.clearRect(0, 0, SaimaButtonContainer_button_canvas.width, SaimaButtonContainer_button_canvas.height)

                                            // Перерисовка маски с новой высотой
                                            ctx.fillStyle = `rgba(0, 0, 0, ${CanvasMaskTransparent})`
                                            ctx.fillRect(0, 0, SaimaButtonContainer_button_canvas.width, SaimaButtonContainer_button_canvas.height * newHeightFraction)
                                        }

                                        // Обновление высоты маски от высоты холста
                                        updateMaskHeight(SaimaButtonContainer_spanIco_SpeedProp)
                                    }

                                }

                                // event.deltaY содержит значение, которое указывает направление прокрутки:
                                // положительное значение для прокрутки вниз, отрицательное - вверх.
                                if (event.deltaY < 0) {
                                    // console.log('Прокрутка вверх')
                                    // if (SaimaTextField.valueAsNumber < WPM_Max) simulateClickWrap(1)
                                    simulateClickWrap(1)
                                } else {
                                    // console.log('Прокрутка вниз')
                                    // if (SaimaTextField.valueAsNumber > WPM_Min) simulateClickWrap(-1)
                                    simulateClickWrap(-1)
                                }
                            })

                            clearInterval(jsInitChecktimer2)
                            jsInitChecktimer2 = null
                        }

                    } catch (e) {
                        DEBUG.info(`Failed to like video: ${e}. `)
                    }
                }

            }
            jsInitChecktimer2 = setInterval(wait, GM_config.get('CHECK_FREQUENCY_LAUNCH_SAIMA'))
        }
        isDownloadStartSegmentButton()
    }

    function watchThresholdReached () {
        const player = document.querySelector(SELECTORS.PLAYER)
        if (player) {
            return true
        }
        return false
    }



    // onInit()
    window.addEventListener("yt-navigate-start", e => { onInit() }) // переиницализация при обновлении страницы без перезагрузки скрипта

})();