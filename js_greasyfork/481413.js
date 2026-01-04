// ==UserScript==
// @name         CivitAi Utilities
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  A script that adds new tools to the civitai image generator
// @author       Pedro6159
// @match        https://civitai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=civitai.com
// @run-at document-end
// @license      MIT
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481413/CivitAi%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/481413/CivitAi%20Utilities.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Editable variables for users
    var delay = 500 // Milliseconds to wait for the script to start injecting into the website.
    var enable_infolabels = true; // Creates labels that show positive and negative prompt size
    var enable_taglist = true; // Enable tag list box
    var tag_list_url = "https://drive.google.com/uc?id=1uR_hEn_6BQz3gP4gO0nhVfF9TY97JSNP"; // You must have a raw tag list url

    // code

    // Url
    var u = window.document.URL;
    var datalist = undefined;
    var datalist_bkp = undefined;


    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    // Ele filtra a string para retornar apenas a palavra, remove sintaxes do stable diffusion como "()", "[]", "{}", e os pesos ":x.x"
    String.prototype.sdfilter = function () {
        return this.toString().replace(/[()\[\]{}'"]|\W[:\d+(\.\d+)?]/g, "").trim().toLowerCase();
    };
    function addlabels(element) {
        // Prompt Label Length
        let _pll = document.createElement("span");
        _pll.id = "promptlength"; _pll.innerText = "Prompt Length : 0/1024";
        // Prompt Label Negativo
        let _negpll = document.createElement("span");
        _negpll.id = "negpromptlength"; _negpll.innerText = "Neg Prompt Length : 0/1024";
        // Adiciona os dois na ordem
        element.append(_pll);
        element.insertBefore(_pll, element.childNodes[0]);
        element.append(_negpll);
        element.insertBefore(_negpll, element.childNodes[1]);
    }
    function initialize_gui(gui) {
        const promptarea = getElementByXpath("(//textarea[contains(@class,'input')])[1]")
        const negpromptarea = getElementByXpath("(//textarea[contains(@class,'input')])[2]")
        promptarea.addEventListener('input', () => {
            updatelabel()
        });
        negpromptarea.addEventListener('input', () => {
            updatelabel()
        });
        if (enable_infolabels)
            addlabels(gui.childNodes[0]);
        if (enable_taglist)
            initialize_autocomplete(gui.childNodes[0]);
        console.log("Loaded UI");
    }

    // INICIA A CONSTRUÇÃO DO AUTO COMPLETE
    function initialize_autocomplete(element) {
        let infodiv = document.createElement("div");
        infodiv.id = "infodiv";
        element.append(infodiv);
        element.insertBefore(infodiv, element.childNodes[2]);
        // Infodiv pega o elemento criado pelo script com mesmo ID, então suporta ambas interfaces
        // Começa a adicionar o div na interface
        let ac_div = document.createElement("div");
        ac_div.style = "border: 3px solid rgb(52 52 52); overflow: auto;min-height:100px;height:250px;resize: vertical;";
        ac_div.id = "infoautocomplete";
        ac_div.beforeunload = function () { alert("deletado") };
        infodiv.append(ac_div);
        var order_type = 1;
        var btn_order = document.createElement("span");
        btn_order.style = "font-weight: bold; display: inline-block;border:thin solid;margin: 0 1px;padding:5px;cursor:pointer;"
        btn_order.innerText = "Sort (Normal)";
        btn_order.onclick = () => {
            if (order_type == 1) { // Mudar para ordem alfabetica (A-Z)
                datalist.sort();
                btn_order.innerText = "Sort (A-Z)";
                btn_order.style.color = "#8f9cff";
                order_type = 2;
            }
            else if (order_type == 2) {
                datalist.reverse();
                btn_order.innerText = "Sort (Z-A)";
                btn_order.style.color = "#90ff8f";
                order_type = 3;
            }
            else if (order_type == 3) {
                shuffle(datalist);
                btn_order.innerText = "Sort (Random)";
                btn_order.style.color = "rgb(255 55 219)";
                order_type = 4;
            }
            else if (order_type == 4) {
                datalist = Array.from(datalist_bkp);
                btn_order.innerText = "Sort (Normal)";
                btn_order.style.color = "White";
                order_type = 1;
            }
            autocompletelist.innerHTML = "";
            let results = getResults(selectedword[1].sdfilter());
            showtags(results);
        };
        ac_div.append(btn_order);
        var order_type_2 = 1;
        var btn_order2 = document.createElement("span");
        btn_order2.style = "font-weight: bold; display: inline-block;border:thin solid;margin: 0 1px;padding:5px;cursor:pointer;"
        btn_order2.innerText = "View (Inline)";
        btn_order2.onclick = () => {
            if (order_type_2 == 1) { // Mudar para ordem alfabetica (A-Z)
                btn_order2.innerText = "View (Vertical)";
                btn_order2.style.color = "#8f9cff";
                autocompletelist.style.display = "grid";
                order_type_2 = 2;
            }
            else if (order_type_2 == 2) {
                datalist.reverse();
                btn_order2.innerText = "View (Inline)";
                btn_order2.style.color = "White";
                autocompletelist.style.display = "inline";
                order_type_2 = 1;
            }
        };
        ac_div.append(btn_order2);
        ac_div.append(document.createElement("br"));

        if (datalist == undefined) {
            // Label dizendo que esta carregando a lista
            var labelloading = document.createElement("p");
            labelloading.id = "loadlabel";
            labelloading.style = "font-size:24px;font-weight: bold;color:Cyan"
            labelloading.innerText = "Loading TagList...";
            ac_div.append(labelloading);
        }
        // Elemento de lista de resultados
        var autocompletelist = document.createElement("ul");
        autocompletelist.style = "display:inline;padding-left: 0px;";
        autocompletelist.id = "results";
        ac_div.append(autocompletelist);



        if (datalist == undefined) {
            GM_xmlhttpRequest({
                method: "GET",
                // Url da lista de TAgs
                url: tag_list_url,
                onload: (ev) => {
                    // Foi carregado e atualiza o label
                    datalist = ev.responseText.match(/[^\r\n]+/g);
                    var versioninfo = datalist[0];
                    if (!versioninfo.startsWith("("))
                        versioninfo = "Customized";
                    labelloading.innerText = "Tag list loaded.\r\nCurrent version : " + versioninfo;
                    console.log("AutoComplete Tags Loaded | " + versioninfo);
                    labelloading.style.color = "#66FF99";
                    labelloading.style.cursor = "pointer";
                    datalist.shift();
                    datalist_bkp = Array.from(datalist);
                    // Avisar que foi carregado e fazer animação do label desaparecer lentamente
                    var o = 0;
                    var fade = setInterval(function () {
                        if (o < 100) {
                            labelloading.style.opacity = ((100 - o) + "%"); o = o + 0.11;
                        }
                        else {
                            clearInterval(fade); labelloading.remove();
                        }
                    }, 1);
                    labelloading.onclick = function () {
                        labelloading.remove();
                        clearInterval(fade);
                    }
                },
                onerror: () => {
                    console.error("List not loaded, invalid url.");
                }
            });
        }

        var promptarea = getElementByXpath("(//textarea[contains(@class,'input')])[1]");
        // Pega a caixa de texto do prompt dependendo da interface
        var selectedword;
        promptarea.oninput = function () {
            // Esse limpa tudo.
            autocompletelist.innerHTML = "";
            // Começa a progurar por tags
            selectedword = getWord(promptarea);
            let results = getResults(selectedword[1].sdfilter());
            showtags(results);
        };
        function showtags(results) {
            if (results.length > 0) {
                // Ele exibe a lista de tags em relação aos caractere que tu escreveu
                let i = 0;
                for (i; i < results.length; i++) {
                    const tags = document.createElement("li");
                    tags.style = "display: inline-block;padding: 0.5rem;border-color:white;border:solid;border-width:thin";
                    tags.className = "tags";
                    if (results[i][1] == 1) {
                        tags.style["background-color"] = "#302D00";
                        tags.innerText = results[i][0];
                        autocompletelist.append(tags);
                        autocompletelist.insertBefore(tags, autocompletelist.childNodes[0]);
                    }
                    else {
                        tags.innerText = results[i][0];
                        autocompletelist.append(tags);
                    }

                }
                // Caso chegue até o final, não vai adicionar o botão de "Mostrar Mais"
                if (i > 40) {
                    autocompletelist.innerHTML += "<li id='showmore' style='display: inline-block;padding: 0.5rem;border-color:white;border:solid;border-width:thin;background-color:darkblue'>Show More</li>";
                    // Função de mostrar mais
                    document.getElementById("showmore").onclick = () => {
                        // O texto da ultima tag
                        const lasttagarea = autocompletelist.childNodes[autocompletelist.childNodes.length - 2].innerText;
                        // Começa a procurar mais tags
                        let results = getResults(selectedword[1].sdfilter(), lasttagarea);
                        // Remove o "Show More"
                        autocompletelist.childNodes[autocompletelist.childNodes.length - 1].remove();
                        showtags(results);
                    };
                }
            }
        }
        // Obtem o array a partir da palavra que você escreveu para auto completar, que tem relação a lista de tags
        function getResults(input, last) {
            input = input.replace(/[_+-]+/g, " ");
            const results = [];
            let i = 0;
            // Caso você tiver clicado em "Mostrar Mais", ele pega a ultima tag da lista e continua a procurar por mais
            if (last) {
                i = searchStringInArray(last, datalist) + 1
            }

            // Pega palavras proximas
            const l = datalist.length;
            for (i; i < l; i++) {
                if (input === datalist[i].slice(0, input.length)) {
                    if (input == datalist[i])
                        results.push([datalist[i], 1]); // 1 a palavra é igual a tag
                    else
                        results.push([datalist[i], 0]); // 0 sugestoes de tag

                    if (results.length > 40)
                        break;
                }

            }
            return results;
        }
        // Quando você clicar em umas das tags para completar a palavra
        autocompletelist.onclick = function (event) {
            // Identificador tags, para não pensar que é aquele botão de 'mostrar mais'
            if (event.target.className != "tags")
                return;
            const setValue = event.target.innerText;
            // Separa o prompt em virgulas e remove espaços vazios
            let valuetext = promptarea.value.split(",").map(function (word) {
                return word.trim();
            });
            // Começa a procurar a palavra no array separado em virgula e depois substituir
            for (let i = 0; i < valuetext.length; i++) {
                if (valuetext[i].trim() == selectedword[1]) {
                    // Preserva os parenteses e a sintaxe de peso
                    const word = valuetext[i].sdfilter();
                    valuetext[i] = valuetext[i].replace(word, setValue);
                }
            }
            promptarea.value = valuetext.join(", ");
            this.innerHTML = "";
        };
    }

    // Procura a string no array retornando apenas o index
    function searchStringInArray(str, strArray) {
        const l = strArray.length;
        for (var j = 0; j < l; j++) {
            if (strArray[j].match(str)) return j;
        }
        return -1;
    };
    function getWord(textarea) {
        var cursorPos = textarea.selectionStart;
        var text = textarea.value;

        // Encontrar a palavra na posição do cursor
        var start = text.lastIndexOf(',', cursorPos - 1) + 1;
        var end = text.indexOf(',', cursorPos);
        end = end === -1 ? text.length : end;

        // Extrair a palavra
        var selectedWord = text.substring(start, end).trim();

        // Separar as palavras por vírgula
        var wordsArray = text.split(',').map(function (word) {
            return word.trim();
        });
        var selectedIndex = wordsArray.indexOf(selectedWord);
        //console.log("Posição do cursor:", cursorPos);
        //console.log("Palavra selecionada:", selectedWord);
        //console.log("Array de palavras:", wordsArray);
        return [selectedIndex, selectedWord.trim(), wordsArray];
    };
    // Aleatorizar Array
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    };
    // Atualiza as informações do tamanho do prompt positivo e negativo
    function updatelabel() {
        document.getElementById("promptlength").innerText = "Prompt Length : " + getElementByXpath("(//textarea[contains(@class,'input')])[1]").value.length;
        document.getElementById("negpromptlength").innerText = "Neg Prompt Length : " + getElementByXpath("(//textarea[contains(@class,'input')])[2]").value.length;
    };
    window.onload = function () {
        if (document.readyState == 'complete') {
            var gui;
            console.log("Trying to find the interface to inject the script...");
            var tempo = setInterval(function () {
                if (!document.getElementById("infodiv")) {
                    gui = getElementByXpath("//form/div[1]/div[1]/div[not(@style)]/div[3]");
                    if (gui) {
                        initialize_gui(gui);
                    }
                }
            }, delay);
            window.onload = null;
        }
    };
})();