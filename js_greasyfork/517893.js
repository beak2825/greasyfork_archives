// ==UserScript==
// @name         送料設定の並び替え＆色変更＆ツールチップ設定
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  プルダウンメニューを指定順に並び替え、特定のオプションの色を変更し、ツールチップを設定
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/517893/%E9%80%81%E6%96%99%E8%A8%AD%E5%AE%9A%E3%81%AE%E4%B8%A6%E3%81%B3%E6%9B%BF%E3%81%88%EF%BC%86%E8%89%B2%E5%A4%89%E6%9B%B4%EF%BC%86%E3%83%84%E3%83%BC%E3%83%AB%E3%83%81%E3%83%83%E3%83%97%E8%A8%AD%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/517893/%E9%80%81%E6%96%99%E8%A8%AD%E5%AE%9A%E3%81%AE%E4%B8%A6%E3%81%B3%E6%9B%BF%E3%81%88%EF%BC%86%E8%89%B2%E5%A4%89%E6%9B%B4%EF%BC%86%E3%83%84%E3%83%BC%E3%83%AB%E3%83%81%E3%83%83%E3%83%97%E8%A8%AD%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const shippingSelect = document.getElementById("TbMainproduct送料設定");

        if (shippingSelect) {
            const order = [
                "24", "25", "26", "5", "27", "4", "29", "10",
                "11", "12", "13", "22", "14", "15", "16", "17",
                "18", "19", "20", "21", "23", "8", "28", "9"
            ];
            const unusedOptions = ["23", "8", "28", "9"];
            const tooltips = {
                "24": "12cm×23.5cm以内、厚さ1cm以内\n重さ50g以内",
                "25": "3辺の合計が60cm以内、1辺の最長は34cm以内、厚さ2cm以内\n重さ1kg以内",
                "26": "34×25cm以内、厚さ3cm以内\n重さ50g以内",
                "5": "3辺の合計が60cm以内、1辺の最長は34cm以内、厚さ3cm以内\n重さ1kg以内",
                "27": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ50g以内",
                "4": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ100g以内",
                "29": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ150g以内",
                "10": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ250g以内",
                "11": "3辺の合計が60cm以内\n重さ20kg以内",
                "12": "3辺の合計が80cm以内\n重さ20kg以内",
                "13": "3辺の合計が100cm以内\n重さ20kg以内",
                "22": "3辺の合計が120cm以内\n重さ20kg以内",
                "14": "3辺の合計が140cm以内\n重さ20kg以内",
                "15": "3辺の合計が160cm以内\n重さ20kg以内",
                "16": "3辺の合計が170cm以内\n重さ20kg以内",
                "17": "3辺の合計が180cm以内\n重さ20kg以内",
                "18": "3辺の合計が200cm以内\n重さ20kg以内",
                "19": "3辺の合計が220cm以内\n重さ20kg以内",
                "20": "3辺の合計が240cm以内\n重さ20kg以内",
                "21": "3辺の合計が260cm以内\n重さ20kg以内"
            };

            const options = Array.from(shippingSelect.options);
            const orderedOptions = order.map(value => options.find(option => option.value === value)).filter(Boolean);

            shippingSelect.innerHTML = '';
            for (let option of orderedOptions) {
                shippingSelect.add(option);
            }

            for (let option of shippingSelect.options) {
                if (tooltips[option.value]) {
                    option.title = tooltips[option.value];
                }

                if (unusedOptions.includes(option.value)) {
                    option.style.color = "#8B0000";
                    option.title = `${tooltips[option.value] || ""} 現在使われていません`.trim();
                }
            }
        }
    });
})();
