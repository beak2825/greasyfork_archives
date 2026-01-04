// ==UserScript==
// @name         Трянсляция коэффициентов
// @namespace    tuxuuman:coefficient-translation
// @version      0.4.1
// @description  Трянсляция коэффициентов между сайтами букмекерских контор и калькулятором вилок
// @author       tuxuuman<tuxuuman@gmail.com, vk.com/tuxuuman>
// @match        https://www.fonbet.ru/*
// @match        https://www.parimatch.ru/*
// @match        https://www.pinnacle.com/*
// @match        https://ru.surebet.com/calculator
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/394269/%D0%A2%D1%80%D1%8F%D0%BD%D1%81%D0%BB%D1%8F%D1%86%D0%B8%D1%8F%20%D0%BA%D0%BE%D1%8D%D1%84%D1%84%D0%B8%D1%86%D0%B8%D0%B5%D0%BD%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/394269/%D0%A2%D1%80%D1%8F%D0%BD%D1%81%D0%BB%D1%8F%D1%86%D0%B8%D1%8F%20%D0%BA%D0%BE%D1%8D%D1%84%D1%84%D0%B8%D1%86%D0%B8%D0%B5%D0%BD%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function inputSetValue(element, value) {
        const event = new Event('input', { bubbles: true })
        const previousValue = element.value
        element.value = value;
        if (element._valueTracker) element._valueTracker.setValue(previousValue)
        element.dispatchEvent(event)
    }

    function generateUid() {
        if (!generateUid.counter) generateUid.counter = 0;
        return `${Date.now()}_${generateUid.counter++}`
    }

    function checkBrowserClipboardApi() {
        if (navigator && navigator.clipboard) {
            return true;
            alert("Ваш браузер не поддерживает буфер обмена");
        } else {
            return false;
        }
    }

    function setClipboard(text) {
        if (checkBrowserClipboardApi()) {
            return navigator.clipboard.writeText(text);
        }
    }

    function getClipboard() {
        if (checkBrowserClipboardApi()) {
            return navigator.clipboard.readText();
        } else return "";
    }

    function notify(text, title = "", duration = 2500) {
        console.log("notify", title, text);

        let div = $("<div></div>", {
            css: {
                position: "fixed",
                top: "10px",
                right: "10px",
                minWidth: "100px",
                padding: "20px 10px",
                background: "#76c976",
                zIndex: 9999,
                textAlign: "center"
            },
            html: `<b>${title}</b><br><br>${text}`
        });

        $("body").append(div);

        setTimeout(function() {
            div.fadeTo("slow", 0.3, function() {
                div.remove();
            });
        }, duration);
    }

    function checkNum(text) {
        let m = text.replace(/(\d*)\,(\d*)/, "$1.$2").match(/\d*\.\d*/);
        return m ? +m[0] : 0;
    }

    if (location.href.includes('ru.surebet.com/calculator')) {

        let round = false;

        $('input#round').on('change', () => {
            round = $('input#round').prop("checked");
            console.log("round", round);
        });

        let inputs = {
            "www.fonbet.ru": null,
            "www.parimatch.ru": null,
            "www.pinnacle.com": null
        }

        let stakeInputs = {};

        setInterval(() => {
            for (let key in stakeInputs) {
                if (stakeInputs[key]) {
                    console.log("update stake",key, +stakeInputs[key].value);
                    GM_setValue(key, +stakeInputs[key].value);
                }
            }
        }, 1000);

        unsafeWindow.document.addEventListener("keydown", async function (e) {
            if (e.ctrlKey) {
                switch (e.code) {
                    case "KeyX": {
                        e.preventDefault(); e.stopPropagation();
                        let cbtext = await getClipboard();
                        if (e.target.nodeName == "INPUT" && e.target.classList.contains('koefficient') && inputs.hasOwnProperty(cbtext)) {
                            inputs[cbtext] = e.target;
                            inputs[cbtext].value = GM_getValue(`${cbtext}_coefficient`) || 0;
                            inputs[cbtext].title = "Транслируется из " + cbtext;
                            notify(cbtext, "Транслируется из");
                        }
                    } break;

                    case "KeyZ": {
                        if (e.target.nodeName == "INPUT" && e.target.classList.contains('stake')) {
                            e.preventDefault(); e.stopPropagation();
                            let $input = $(e.target);
                            let id = $input.attr('uid') || `input_${generateUid()}`;
                            $input.attr('uid', id);
                            let valKey = `surebet.com_${id}`;
                            stakeInputs[valKey] = e.target;
                            e.target.title = valKey;
                            GM_setValue(valKey, +e.target.value);
                            await setClipboard(valKey);
                            notify("Выбран инпут для связывания", valKey)
                        }
                    } break;
                }
            }
        }, false);

        for (let key in inputs) {
            GM_addValueChangeListener(`${key}_coefficient`, (name, old_value, new_value, remote) => {
                //if (inputs[key]) inputSetValue(inputs[key], new_value);
                if (inputs[key]){
                    console.log(`${key}_coefficient`, new_value, inputs[key]);
                    inputs[key].value = new_value;
                }
                initCalculator();
                if (round && !$('input#round').prop("checked")) {
                    $('input#round').click();
                }
            });
        }
    } else {
        let activeElement = null;

        function unselectActiveElement() {
            activeElement.style.border = "none";
            activeElement.title = "";
            activeElement = null;
        }

        function selectActiveElement(e) {
            if (activeElement == e) {
                unselectActiveElement();
            } else {
                if (activeElement) unselectActiveElement();
                activeElement = e;
                activeElement.style.border = "2px solid green";
                activeElement.title = "Это значение транслируется";
            }
        }

        if (location.href.includes('www.parimatch.ru')) {
            // для этого сайта нужно немного по другому следить за активным элементом, т.к таблица коэффициентов постоянно "перерисовывается"
            let outcomeId = "";
            document.addEventListener("click", function (e) {
                 if (!e.ctrlKey) return;
                 let outcome = e.target.closest('.event-outcome');
                 if (outcome) {
                     if (activeElement == outcome) {
                         unselectActiveElement();
                         outcomeId = "";
                     } else {
                         selectActiveElement(outcome);
                         outcomeId = $(outcome).attr('outcome-id');
                     }
                 }
            });
            setInterval(() => {
                if (outcomeId) {
                    let outcome = $(`.event-outcome[outcome-id="${outcomeId}"]`);
                    if (outcome.length && activeElement != outcome[0]) {
                        selectActiveElement(outcome[0]);
                    }
                }
            }, 2000);
        } else if(location.href.includes('www.parimatch.ru')) {
            let a = null;
            document.addEventListener("click", function (e) {
                 if (!e.ctrlKey) return;
                 let $e = $(e.target);
                 if ($e.hasClass("price")) {
                     a = $(e.target).parent("a");
                 }
            });
            setInterval(() => {
                if (a != activeElement) {
                    selectActiveElement($(a).find("span.price"));
                }
            }, 1000);
        } else {
             document.addEventListener("click", function (e) {
                 if (!e.ctrlKey) return;

                 if (checkNum(e.target.innerText)) {
                     selectActiveElement(e.target);
                     let cfc = checkNum(activeElement.innerText);
                     notify(cfc, "Транслируемый коэффициент");
                     GM_setValue(`${location.hostname}_coefficient`, cfc);
                 }
             });
        }

        setInterval(() => {
            if (activeElement) {
                let cfc = checkNum(activeElement.innerText);
                GM_setValue(`${location.hostname}_coefficient`, cfc);
            }
        }, 2000);

        let inputListeners = {};

        document.addEventListener("keydown", async (e) => {
            if (e.ctrlKey) {
                if (e.code == "KeyZ") {
                    e.preventDefault(); e.stopPropagation();
                    setClipboard(location.hostname);
                    notify(location.hostname, "Скопировано");
                } else if (e.code == "KeyX") {
                    if (e.target.nodeName == "INPUT") {
                        e.preventDefault(); e.stopPropagation();
                        let inputId = await getClipboard();
                        if (/^(surebet.com_input)/.test(inputId)) {
                            if (inputListeners[inputId]) GM_removeValueChangeListener(inputListeners[inputId]);
                            inputListeners[inputId] = GM_addValueChangeListener(inputId, function (name, old_value, new_value, remote) {
                                console.log(inputId, "change value", old_value, new_value);
                                inputSetValue(e.target, +new_value);
                            });
                            e.target.title = inputId;
                            inputSetValue(e.target, GM_getValue(inputId));
                            notify(inputId, "Связаны значения для");
                        }
                    }
                }
            }
        });
    }
})();