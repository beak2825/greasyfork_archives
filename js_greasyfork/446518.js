// ==UserScript==
// @name         HotKeyHWM
// @namespace    https://greasyfork.org/uk/scripts/446518-hotkeyhwm
// @version      0.21
// @description  горячие клавиши в бою
// @author       Жмотярыч
// @include      /^https{0,1}:\/\/((www|qrator|my)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/war\.php/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446518/HotKeyHWM.user.js
// @updateURL https://update.greasyfork.org/scripts/446518/HotKeyHWM.meta.js
// ==/UserScript==

try {
    (() => {
        let unsafeWindow = this.unsafeWindow;
        (function () {
            let test_scr = document.createElement("script");
            let tid = ("t" + Math.random() + +(new Date())).replace(/\./g, "");
            test_scr.text = "window." + tid + "=true";
            document.querySelector("body").appendChild(test_scr);
            if (typeof (unsafeWindow) == "undefined" || !unsafeWindow[tid]) {
                if (window[tid]) {
                    unsafeWindow = window;
                } else {
                    let scr = document.createElement("script");
                    scr.text = "(" +
                        (function () {
                        let el = document.createElement('unsafeWindow');
                        el.style.display = 'none';
                        el.onclick = function () {
                            return window
                        };
                        document.body.appendChild(el);
                    }).toString() + ")()";
                    document.querySelector("body").appendChild(scr);
                    this.unsafeWindow = document.querySelector("unsafeWindow").onclick();
                    unsafeWindow = this.unsafeWindow;
                }
            }
        })();
        let auto_button_on = document.getElementById('fastbattle_on'),
            auto_button_off = document.getElementById('fastbattle_off'),
            back_to_game = document.getElementById('back_to_game'),
            oneskill_button = document.getElementById('oneskill_button'),
            oneskill_button_close = document.getElementById('oneskill_button_close'),
            magicbook_button = document.getElementById('magicbook_button'),
            magicbook_button_close = document.getElementById('magicbook_button_close'),
            make_ins = document.getElementById('make_ins'),
            confirm_ins = document.getElementById('confirm_ins'),
            btn_continue_WatchBattle = document.getElementById('btn_continue_WatchBattle'),
            magic_book = document.getElementById('magic_book'),
            i = 0,
            enableHotKey = true;
            //startBattle = true;
        magicbook_button.addEventListener("click", function() {
            let elements = document.getElementsByClassName("spell_btn_Desktop");
            changeElementsSelect(null, elements[i]);
        })
        document.getElementById('book_next').addEventListener("click", function() {
            let elements = document.getElementsByClassName("spell_btn_Desktop");
            i = 0;
            changeElementsSelect(null, elements[i]);
        })
        document.getElementById('book_prev').addEventListener("click", function() {
            let elements = document.getElementsByClassName("spell_btn_Desktop");
            i = elements.length - 1;
            changeElementsSelect(elements[i + 1], elements[i]);
        })
        document.getElementById('chattext').addEventListener("focusin", function() {
            enableHotKey = false
//             if(startBattle){
//                 enableHotKey = true;
//                 document.getElementById('chattext').blur();
//                 startBattle = false;
//             }
        })
        document.getElementById('chattext').addEventListener("focusout", function() { enableHotKey = true})
        addEventListener('keypress', function() {
            if(!enableHotKey) return;

            let code = event.code;
            //console.log(code);
            if (code == "KeyA" && magic_book.style.display == "none") {

                if(make_ins.style.display != "none"){
                    //auto rastanovka
                    triggerMouseUpEvent(make_ins);
                } else if(auto_button_on.style.display != "none"){
                    //auto button on
                    triggerMouseUpEvent(auto_button_on);
                } else if(auto_button_off.style.display != "none"){
                    //auto button off
                    triggerMouseUpEvent(auto_button_off);
                }
            } else if(code == "KeyD" && magic_book.style.display == "none"){
                //start battle button
                if(confirm_ins.style.display != "none"){
                    triggerMouseUpEvent(confirm_ins);
                } else if(back_to_game.style.display != "none"){
                    triggerMouseUpEvent(btn_continue_WatchBattle);
                }
            } else if(code == "KeyS"){
                if(magic_book.style.display != "none"){
                    let spell = document.getElementById('spell' + (i + 1));
                    if(spell){
                        triggerMouseUpEvent(spell);
                    }
                } else if(oneskill_button.style.display != "none"){
                    triggerMouseUpEvent(oneskill_button);
                } else if(oneskill_button_close.style.display != "none"){
                    triggerMouseUpEvent(oneskill_button_close);
                } else if(magicbook_button.style.display != "none"){
                    triggerMouseUpEvent(magicbook_button);
                } else if(magicbook_button_close.style.display != "none"){
                    triggerMouseUpEvent(magicbook_button_close);
                }
            }

            if(magic_book.style.display != "none"){
                let elements = document.getElementsByClassName("spell_btn_Desktop");
                changeElementsSelect(null, elements[i]);

                if(code == "KeyA"){
                    //console.log(i);
                    --i;
                    if(i < 0) {
                        let book_prev = document.getElementById('book_prev');
                        if(book_prev.style.display != "none"){
                            triggerMouseUpEvent(book_prev);
                            i = elements.length - 1;
                        } else i = 0;
                    }

                    changeElementsSelect(elements[i + 1], elements[i]);
                } else if(code == "KeyD"){
                    //console.log(i);
                    if(i == (elements.length - 1)) {
                        let book_next = document.getElementById('book_next');
                        if(book_next.style.display != "none"){
                            triggerMouseUpEvent(book_next);
                            i = 0;
                            changeElementsSelect(null, elements[i]);
                        }
                    } else {
                        ++i;
                        changeElementsSelect(elements[i - 1], elements[i]);
                    }
                }
            }
        }, false)

        function triggerMouseUpEvent(element) {
            let clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent("mouseup", true, true);
            element.dispatchEvent(clickEvent);
        }
        function changeElementsSelect(elementOld, elementNew) {
            if(elementOld){
                elementOld.style.background = null;
                elementOld.style.opacity = null;
            }
            if(elementNew){
                elementNew.style.background = "#592c08";
                elementNew.style.opacity = 0.4;
            }
        }
    })();
} catch (e) {
    // alert(e)
    console.log(e)
}