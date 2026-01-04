// ==UserScript==
// @name         AliSliderExpander
// @namespace    AliSliderExpander
// @version      0.1
// @description  Добавляет блоки с изображениями для удобного просмотра
// @author       rayfish
// @match        https://aliexpress.ru/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/476022/AliSliderExpander.user.js
// @updateURL https://update.greasyfork.org/scripts/476022/AliSliderExpander.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var OptFlag = true;
    var SliFlag = true;
    var Layout = document.getElementById("__aer_root__");
    var NewContainer = document.createElement("div");
    NewContainer.style.display = "grid";

// Опции

    if (OptFlag)
    {
        var Options = Layout.querySelector("div[class^='SnowSku_SkuPropertyItem__skuProp']");
        var OptBlock = document.createElement("div");
        if (Options)
        {
            var OptImgs = Options.querySelectorAll("img");
            var OptText = document.createElement("h1");
            OptText.textContent = "Изображения вариантов: " + OptImgs.length + " шт.";
            OptBlock.appendChild(OptText);
            var OptNewImgs = [];
            if (OptImgs.length > 0)
            {
                for (let i = 0; i < OptImgs.length; i += 1)
                {
                    OptNewImgs[i] = document.createElement("img");
                    let Src = OptImgs[i].src;
                    OptNewImgs[i].src = Src.substring(0, Src.indexOf("_"));
                    OptNewImgs[i].style.maxWidth="10%";
                    OptNewImgs[i].onclick = function() {if (this.style.maxWidth == "100%") {this.style.maxWidth = "10%";} else {this.style.maxWidth = "100%";}};
                    OptNewImgs[i].align="left";
                    OptBlock.appendChild(OptNewImgs[i]);
                }
            }
        }
    else
    {
        OptBlock.textContent = "Опций нет";
    }
        NewContainer.prepend(OptBlock);
    }

//Разделитель

    var Separator = document.createElement("hr");
    NewContainer.prepend(Separator);

// Слайдер

    if (SliFlag)
    {
        var Slider = Layout.querySelector("div[class^='SnowProductGallery_SnowProductGallery__container']");
        var SliBlock = document.createElement("div");
        if (Slider)
        {
            var SliImgs = Slider.querySelectorAll("img");
            var SliText = document.createElement("h1");
            SliText.textContent = "Изображения слайдера: " + SliImgs.length + " шт.";
            SliBlock.appendChild(SliText);
            var SliNewImgs = [];
            if (SliImgs.length > 0)
            {
                for (let i = 0; i < SliImgs.length; i += 1)
                {
                    SliNewImgs[i] = document.createElement("img");
                    let Src = SliImgs[i].src;
                    SliNewImgs[i].src = Src;
                    SliNewImgs[i].style.maxWidth="10%";
                    SliNewImgs[i].onclick = function() {if (this.style.maxWidth == "100%") {this.style.maxWidth = "10%";} else {this.style.maxWidth = "100%";}};
                    SliNewImgs[i].align="left";
                    SliBlock.appendChild(SliNewImgs[i]);
               }
            }
        }
    else
    {
        SliBlock.textContent = "Слайдера нет";
    }
        NewContainer.prepend(SliBlock);
    }
    document.body.prepend(NewContainer);

})();