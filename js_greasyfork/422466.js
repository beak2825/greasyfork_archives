 // ==UserScript==
// @name         НКРЯ Датасеты
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Инструмент для быстрого добавления и сохранения данных из НКРЯ в JSON формат
// @author       Fyodor Sizov
// @match        https://processing.ruscorpora.ru/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/422466/%D0%9D%D0%9A%D0%A0%D0%AF%20%D0%94%D0%B0%D1%82%D0%B0%D1%81%D0%B5%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422466/%D0%9D%D0%9A%D0%A0%D0%AF%20%D0%94%D0%B0%D1%82%D0%B0%D1%81%D0%B5%D1%82%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class Item {
        constructor(title, text, itemURL, itemPageIndex, indexInPage) {
            this.title = title;
            this.text = text;
            this.itemURL = itemURL;
            this.itemPageIndex = itemPageIndex;
            this.indexInPage = indexInPage;
        }
    }

    class Dataset {
        constructor () {
            this.nameDefault = "nameDefault";
            this.contentDefault = {
                items: [],
                processedNumber: 0
            };
            if (this.nameInMemory() === null) {
                this.name = this.nameDefault;
                this.content = this.contentDefault;
            }
        }

        get name() {
            console.log("get method called");
            return localStorage.getItem("nk:datasetName");
        }

        set name (value) {
            console.log("set method called: " + value);
            localStorage.setItem("nk:datasetName", value);
        }

        get content() {
            var j = localStorage.getItem("nk:datasetContent");
            return JSON.parse(j);
        }

        set content(jsonValue) {
            localStorage.setItem("nk:datasetContent", JSON.stringify(jsonValue));
        }

        nameInMemory () {
            return localStorage.getItem("nk:datasetName");
        }

        loadToMemory () {

        }
    }

    class DatasetWizard {
        constructor (dataset) {
            this.url = window.location.href;
            this.dataset = dataset;
            if (this.canInsert()) {
                this.makeHolder();
                this.putIndices();
                for (var button of this.getButtons()) {
                    button.style.marginLeft = "10px";
                    button.style.marginRight = "10px";
                    wizardControls.appendChild(button);
                }
                this.addSelectButtons();
            }
        }

        canInsert () {
            return document.querySelector('[href*="stat.xml"]') !== null;
        }

        makeHolder () {
            var statLink = document.querySelector('[href*="stat.xml"]');
            statLink.outerHTML = '<div id="wizardControls">' + statLink.outerHTML + '</div>';
            wizardControls.style.display = "inline";
        }

        putIndices () {
            var _ol = document.querySelector("ol");
            var _i = Number(_ol.getAttribute("start"));
            for (var olChild of _ol.children) {
                olChild.setAttribute("index-in-page", _i.toString());
                _i ++;
            }
        }

        addSelectButtons () {
            var ex = document.querySelectorAll(".b-doc-expl");
            for (var exampleElement of ex) {
                var matches = exampleElement.parentNode.querySelectorAll("li");
                for (var m of matches) {
                    this.addButtonToMatch(m);
                }
            }
        }

        addButtonToMatch (matchLi) {
            var button = document.createElement("button");
            button.setAttribute("onclick", "window.wizard.markAsSelected(this)");
            button.style.marginRight = "10px";
            button.innerHTML = "\u2713";
            button.className = "matcher-button";
            matchLi.innerHTML = button.outerHTML + matchLi.innerHTML;
        }

        getButtons () {
            var buttons = [];
            buttons.push(document.createElement("button"));
            buttons[0].innerHTML = "Переименовать датасет";
            buttons.push(document.createElement("button"));
            buttons[1].innerHTML = "Очистить датасет";
            buttons.push(document.createElement("button"));
            buttons[2].innerHTML = "Скачать датасет";
            buttons.push(document.createElement("button"));
            buttons[3].innerHTML = "Выбрать все";
            buttons.push(document.createElement("button"));
            buttons[4].innerHTML = "След.";

            return buttons;
        }

        renameDataset () {
            var name = prompt(
                "Имя датасета:",
                (localStorage.getItem("nk:datasetName") !== null ? localStorage.getItem("nk:datasetName") : "")
            );
            console.log(name);
            this.dataset.name = name;
        }

        clearDataset () {
            localStorage.removeItem("nk:datasetName");
            localStorage.removeItem("nk:datasetContent");
            this.dataset.name = this.dataset.nameDefault;
            this.dataset.content = this.dataset.contentDefault;
        }

        loadDataset () {
            var wrapObjectString = JSON.stringify({
                "nk:datasetName": this.dataset.name,
                "nk:datasetContent": this.dataset.content
            })
            window.location.href = "data:application/octet-stream," + encodeURIComponent(wrapObjectString);
        }

        goNext () {
            var here = document.querySelectorAll(".matcher-button").length;
            var c = this.dataset.content;
            c.processedNumber += here;
            this.dataset.content = c;
            document.querySelector(".pager a:last-child").click();
        }

        markAsSelected (matchLiButton) {
            var matchLi = matchLiButton.parentNode;
            matchLiButton.style.backgroundColor = "lightgreen";
            var example = matchLi;
            while (example.nodeName != "LI" || example.parentNode.nodeName != "OL") {
                example = example.parentNode;
            }
            console.log(example);
            var item = new Item(
                example.querySelector(".b-doc-expl").innerText,
                this.getTextList(matchLi),
                window.location.href,
                document.querySelector(".pager b").innerText,
                example.getAttribute("index-in-page")
            );
            var _content = this.dataset.content;
            _content.items.push(item);
            this.dataset.content = _content;
        }

        getTextList(matchLi) {
            matchLi.innerHTML = matchLi.innerHTML.replace(/(<\/span>)([^<]+)(<span)/g, '$1<span class="contains-text">$2</span>$3')
            for (var every of matchLi.querySelectorAll(".b-wrd-expl")) {
                every.className += " contains-text";
            }
            var textList = [];
            for (var _every of matchLi.querySelectorAll(".contains-text")) {
                var localObject = {};
                localObject.text = _every.innerText;
                if (_every.className.match(/b-wrd-expl/)) {
                    if (_every.className.match(/g-em/)) {
                        localObject.status = "selected";
                    } else {
                        localObject.status = "token";
                    }
                } else {
                    localObject.status = "special";
                }
                textList.push(localObject);
            }
            return textList;
        }

        clickAllButtons () {
            for (var _ev of document.querySelectorAll(".matcher-button")) {
                _ev.click();
            }
        }
    }

    window.dataset = new Dataset()
    window.wizard = new DatasetWizard(window.dataset);
    var btn = wizardControls.querySelectorAll("button");
    btn[0].onclick = function() { window.wizard.renameDataset() };
    btn[1].onclick = function () { window.wizard.clearDataset() };
    btn[2].onclick = function () { window.wizard.loadDataset() };
    btn[3].onclick = function () { window.wizard.clickAllButtons() };
    btn[4].onclick = function () { window.wizard.goNext() };

})();