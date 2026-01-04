// ==UserScript==
// @name         Auto Fill Travian
// @namespace    https://travian.com
// @version      1.4
// @description  يحفظ عدد القوات عند الضغط على "تعبئة الآن" ويعبئها تلقائيًا عند الدخول مرة أخرى
// @author       Fahad
// @include        *://*.travian.*
// @include        *://*/*.travian.*
// @exclude     *://support.travian.*
// @exclude     *://blog.travian.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529700/Auto%20Fill%20Travian.user.js
// @updateURL https://update.greasyfork.org/scripts/529700/Auto%20Fill%20Travian.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = location.pathname.includes('gid=19') ? "stableTroops" : "barracksTroops";

    function saveTroops() {
        let troopsData = {};
        document.querySelectorAll('input.text[name^="t"]').forEach(input => {
            troopsData[input.name] = input.value;
        });

        localStorage.setItem(storageKey, JSON.stringify(troopsData));
        alert("✅ تم حفظ الأعداد بنجاح! سيتم تعبئتها تلقائيًا عند الدخول مرة أخرى.");
    }

    function loadTroops() {
        let storedData = localStorage.getItem(storageKey);
        if (storedData) {
            let troopsData = JSON.parse(storedData);
            Object.keys(troopsData).forEach(troop => {
                let inputField = document.querySelector(`input.text[name="${troop}"]`);
                if (inputField) {
                    inputField.value = troopsData[troop];
                }
            });
        }
    }

    // تعبئة الأعداد المحفوظة تلقائيًا عند الدخول
    loadTroops();

    // إنشاء الزر وإضافته داخل الصفحة
    function createSaveButton() {
        let buttonContainer = document.querySelector('.buildActionOverview');
        if (!buttonContainer) {
            console.warn("⚠️ لم يتم العثور على مكان مناسب للزر!");
            return;
        }

        let button = document.createElement("button");
        button.innerText = "💾 تعبئة الآن وحفظ";
        button.style.display = "block";
        button.style.margin = "10px auto";
        button.style.padding = "8px 15px";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";
        button.style.border = "1px solid #fff";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.borderRadius = "5px";

        button.onclick = saveTroops;

        buttonContainer.appendChild(button);
    }

    // انتظار تحميل الصفحة ثم إضافة الزر
    window.addEventListener("load", createSaveButton);

})();