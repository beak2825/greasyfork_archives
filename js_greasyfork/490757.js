// ==UserScript==
// @name         Tradutor do Character.AI
// @name:en      Character AI Translator
// @name:es      Traductor de Character.AI
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description     Um script que adiciona o sistema de tradução do Character AI, você pode traduzir as conversas do persoangens.
// @description:en  A script that adds Character AI's translation system, you can translate characters' conversations.
// @description:es  Un script que agrega el sistema de traducción de Character AI, puedes traducir las conversaciones de los personajes.
// @author       Zlajoyast
// @match        https://character.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/490757/Tradutor%20do%20CharacterAI.user.js
// @updateURL https://update.greasyfork.org/scripts/490757/Tradutor%20do%20CharacterAI.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getElementByXpath(path, elem = undefined) {
        let e = elem;
        if (e == undefined)
            e = document
        return document.evaluate(path, e, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function getElementsByXpath(path, elem = undefined) {
        let e = elem;
        if (e == undefined)
            e = document
        var nodes = document.evaluate(path, e, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        var result = [];
        for (var i = 0; i < nodes.snapshotLength; i++) {
            result.push(nodes.snapshotItem(i));
        }
        return result;
    }
    // VARIAVEL DAS CONFIGURAÇÕES
    var Config = {
        LanguageFrom: "en", // IDIOMA INICIAL. deixe "auto" para detectar idioma automaticamente
        LanguageTo: "auto", // TRADUÇÃO OFINAL. deixe "auto" para tradução no idioma do seu navegador
        AutoTranslate: false,
        delay: 1000,
        TextColor: "cyan" // COR DO TEXTO QUANDO TRADUZIDO
    }
    var activetranslate;
    const _IconTranslator = "M 16.848 8.0654 H 15.3014 l -1.8144 4.8038 A 12.528 12.528 90 0 1 8.8992 10.7611 a 12.4243 12.4243 90 0 0 3.0715 -6.2597 h 2.2507 a 0.864 0.864 90 0 0 0 -1.728 H 8.4974 V 0.864 a 0.864 0.864 90 1 0 -1.728 0 V 2.7734 H 1.0411 a 0.864 0.864 90 0 0 0 1.728 H 3.2962 a 12.4114 12.4114 90 0 0 3.0672 6.2597 A 12.7483 12.7483 90 0 1 1.4126 12.96 a 0.864 0.864 90 0 0 0.1858 1.728 a 0.6955 0.6955 90 0 0 0.1901 -0.0216 a 14.0659 14.0659 90 0 0 5.845 -2.7 a 13.824 13.824 90 0 0 5.2402 2.5488 L 9.8626 22.464 H 12.096 l 1.1664 -3.3523 H 18.8525 L 20.0318 22.464 h 2.255 Z m -6.6096 -3.564 a 10.2643 10.2643 90 0 1 -2.592 5.1235 a 10.2427 10.2427 90 0 1 -2.592 -5.1235 Z m 3.7498 12.5928 l 2.0866 -5.9746 L 18.144 17.0942 Z";
    function Build_UI_Dialog(div) {
        if (div == null) {
            console.warn("Não foi encontrado o div");
            return;
        }

        let button = div.childNodes[0].childNodes[0].cloneNode(true);
        button.childNodes[0].childNodes[0].setAttribute("d", _IconTranslator);
        button.childNodes[0].childNodes[0].setAttribute("stroke-width", "1");
        button.title = "Traduzir Tudo";
        button.id = "TRANSLATORBUTTON";
        button.className = button.className.replace("hover:bg-surface-elevation-1", "");
        button.onclick = () => {
            if (Config.AutoTranslate == false) {
                button.className = button.className += " bg-primary";
                Save_Config("AutoTranslate", true);
                AutoTranslate();
            }
            else {
                Save_Config("AutoTranslate", false);
                button.className = button.className.replace(" bg-primary", "");
                AutoTranslate(true);
            }
        }
        if (Config.AutoTranslate)
            button.className = button.className += " bg-primary";
        div.appendChild(button);
        div.insertBefore(button, div.childNodes[1]);
    }
    async function Initialize_Script() {
        console.log("iniciado");
        if (Config.AutoTranslate == true) {
            AutoTranslate();
        }
        let maindialog = getElementByXpath("//main[contains(@class,'flex')]/div/div/div[2]/div[2]");
        Build_UI_Dialog(maindialog);
        // ADICIONA O EVENTO DE CLICK NOS 3 PONTINHOS EM CADA DIALOGO
        setInterval(() => {
            if (u.href.startsWith("https://character.ai/chat/")) {
                var dialogs = getElementByXpath("//main[contains(@class,'flex')]/div/div/div/div[2]/div").childNodes;
                dialogs.forEach((element, index) => {
                    let _id = makeid(5)
                    if (element.getAttribute("idtranslation") == undefined)
                        element.setAttribute("idtranslation", _id)
                    let button = getElementByXpath("div[2]/button", element);
                    if (button == null)
                        return;
                    if (button.getAttribute("onck") == null || button.getAttribute("onck") != "true") {
                        button.onclick = () => {
                            _clicked()
                        }
                        button.addEventListener("touchend", () => { // PARA USUÁRIOS MOVEIS
                            _clicked()
                        });
                        function _clicked() {
                            setTimeout(() => {
                                let div = getElementByXpath("//div[@data-radix-popper-content-wrapper]");
                                let buttondiv = div.childNodes[0].childNodes[0].cloneNode(true);
                                buttondiv.childNodes[0].childNodes[0].textContent = "Translate Dialog";
                                buttondiv.childNodes[0].childNodes[2].childNodes[0].setAttribute("d",_IconTranslator)
                                buttondiv.onclick = () => {
                                    TranslateDialog(_id);
                                };
                                div.childNodes[0].appendChild(buttondiv);
                            }, 1)
                        }
                        button.setAttribute("onck", "true");
                    }
                });
            }
        }, 1000);

        // ADICIONA BOTÃO DE TRADUÇÃO AO LADO DO TEXTAREA
        let sendbutton = getElementByXpath("//textarea").parentNode.parentNode.parentNode.childNodes[1];
        let translatorbutton = sendbutton.cloneNode(true);
        translatorbutton.childNodes[0].childNodes[0].childNodes[0].setAttribute("d", _IconTranslator);
        translatorbutton.onclick = () => {
            let textarea = getElementByXpath("//textarea");
            var response = Translate(textarea.innerHTML, Config.LanguageTo, Config.LanguageFrom);
            response.then((a) => {
                textarea.focus();
                textarea.select();
                document.execCommand("insertText", false, a)
            })

        }
        sendbutton.parentNode.appendChild(translatorbutton);
    }
    function Initialize_Observer() {
        // OBSERVA SE O MENU A DIREITA FOR ABERTO, ASSIM EXECUTANDO A FUNÇÃO
        const observer = new MutationObserver(function (mutations_list) {
            mutations_list.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (added_node) {
                    if (added_node.role == 'dialog') {
                        On_Dialog_Open();
                    }
                });
            });
        });
        observer.observe(document.body, { subtree: false, childList: true });
    }
    function On_Dialog_Open() {
        let dialog = getElementByXpath("//body/div[@role='dialog']/div[2]");
        Build_UI_Dialog(dialog);
    }
    function AutoTranslate(remove = false) { // TRADUÇÃO AUTOMATICA
        if (remove) {
            clearInterval(activetranslate)
            activetranslate = undefined;
            return;
        }
        if (activetranslate != undefined)
            return;

        activetranslate = setInterval(() => {
            TranslateDialog();
        }, 1000)

    }
    function TranslateDialog(id = undefined) { // TRADUZIR DIALOGOS
        var dialog;
        if (id != undefined)
            dialog = [getElementByXpath("//main[contains(@class,'flex')]/div/div/div/div[2]/div/div[@idtranslation='" + id + "']")] // ENCONTRA O ELEMENTO DE CADA INTERAÇÃO DA CONVERÇA
        else
            dialog = getElementByXpath("//main[contains(@class,'flex')]/div/div/div/div[2]/div").childNodes;
        dialog.forEach((d) => {
            let dialogversions = getElementsByXpath("div//div[contains(@class,'prose')]", d) // ENCONTRA O TEXTO
            dialogversions.forEach(prose => {
                if (prose.getAttribute("translated") == "true" && id != undefined) {
                    if (prose.parentNode.childNodes[2] != undefined)
                        prose.parentNode.childNodes[2].remove(); // REMOVE O DIALOGO TRADUZIDO
                } else 
                {
                    if (prose.getAttribute("translated") == "true")
                        return;
                }
                // DUBPLICA
                prose.setAttribute("translated", "true");
                const proseClone = prose.cloneNode(true);
                proseClone.setAttribute("scripttranslation", "true");
                proseClone.childNodes.forEach((p) => { // COMEÇA A TRADUÇÃO DO TEXTO
                    if (p.nodeName == "P") // ENCONTRA APENAS ELEMENTO P DA PROSE
                    {
                        var response = Translate(p.innerHTML, Config.LanguageFrom, Config.LanguageTo);
                        response.then((a) => {
                            p.innerHTML = a;
                            p.style.color = Config.TextColor;
                        })
                    }
                });
                prose.parentNode.appendChild(proseClone);
            });
        })

    }
    window.document.translate = (text, from, to) => { // TESTE
        Translate(text, from, to).then((e) => { console.log(e) });
    }
    function Translate(text, from, to) {
        if (to == "auto")
            to = navigator.language;
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(text)}`,
                onload: (ev) => {
                    var json = JSON.parse(ev.responseText);
                    let final = "";
                    json[0].forEach((t) => {
                        final += t[0];
                    })
                    // Colorir elementos
                    final = final.replaceAll("<strong>", "<strong style=\"color:" + Config.TextColor + "\">");
                    final = final.replaceAll("<b>", "<b style=\"color:" + Config.TextColor + "\">");
                    final = final.replaceAll("<i>", "<i style=\"color:" + Config.TextColor + "\">");
                    console.log("Tradução : ", text, final);
                    resolve(final);
                },
                onerror: () => {
                    console.error("Error");
                }
            });
        })

    }
    function Save_Config(name, value) {
        // SALVA O VALOR DE UMA VARIAVEL E MANTEM OS OUTROS
        if (name != undefined) {
            Config[name] = value;
            GM.setValue("Config", Config);
            return;
        }
        // SALVA TUDO
        GM.setValue("Config", Config);

    };
    async function Load_Config() {// OBTEM OS VALORES DA CONFIGURAÇÃO
        let _config = await GM.getValue("Config");
        if (_config != undefined) {
            for (var k in _config) {
                Config[k] = _config[k]
            }
        }
        console.log("Script Settings", _config);
        Load();
    };
    function Load() {
        let interval = setInterval(function () {
            if (u.href.startsWith("https://character.ai/chat/")) {
                if (getElementByXpath("//main[contains(@class,'flex')]") != null) {
                    Initialize_Script();
                    clearInterval(interval);
                }
            }
        }, Config.delay);
    }
    var u = new URL(window.document.URL);
    navigation.addEventListener('navigate', (e) => { // DETECTA MUDANÇAS NO URL
        let newurl = new URL(e.destination.url);
        if (!newurl.pathname.startsWith("/chat/")) {
            u = newurl;
        } else {
            let oldurl = new URL(u);
            if (oldurl.pathname != newurl.pathname) {
                u = newurl;
                Load();

            }
        }
        console.log("URL changed to : " + newurl);
    })
    Initialize_Observer();
    Load_Config();

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    GM_registerMenuCommand("Set the color of translated text", () => {
        let input = window.prompt(`Current : ${Config.TextColor}\r\nDefault : cyan`,Config.TextColor);
        if (input == null || input == "")
            return;
        Save_Config("TextColor",input);
    });
    GM_registerMenuCommand("Change the translation language", () => {
        let to = Config.LanguageTo == "auto" ? navigator.language : Config.LanguageTo;
        let input = window.prompt(`Current : ${to}\r\nDefault : auto`,Config.LanguageTo);
        if (input == null || input == "")
            return;
        Save_Config("LanguageTo",input);
    });
})();