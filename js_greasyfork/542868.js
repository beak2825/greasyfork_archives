// ==UserScript==
// @name         The West - Auto Work & Energy
// @namespace    https://the-west.com.br/
// @version      1.0
// @description  Executa trabalhos automaticamente e recupera energia usando hotel ou itens.
// @author       Você
// @match        https://*.the-west.com.br/*
// @icon         https://www.the-west.com.br/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542868/The%20West%20-%20Auto%20Work%20%20Energy.user.js
// @updateURL https://update.greasyfork.org/scripts/542868/The%20West%20-%20Auto%20Work%20%20Energy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let autoMode = false;
    let intervalId = null;

    const ENERGY_THRESHOLD = 20; // mínima energia antes de descansar
    const INTERVAL = 10000; // intervalo entre verificações (ms)

    function log(msg) {
        console.log(`[AutoWork]: ${msg}`);
    }

    function useEnergyItem() {
        const energyItems = ['guarana', 'coffee', 'sandwich']; // IDs fictícios, ajustar conforme inventário
        for (let item of energyItems) {
            const obj = ItemManager.getItems().find(i => i.name.toLowerCase().includes(item));
            if (obj) {
                log(`Usando item de energia: ${obj.name}`);
                Ajax.remoteCall("item", "use", { id: obj.item_id }, () => {});
                return true;
            }
        }
        return false;
    }

    function restAtHotel() {
        log("Energia baixa. Iniciando descanso...");
        new TaskSleep({ building: { obj_id: Character.home_town.town_id } }).start();
    }

    function doWork() {
        const workWindow = WorkWindow.getInstance();
        const currentJob = WorkController.currentWork;

        if (!currentJob || !workWindow) {
            log("Nenhum trabalho selecionado.");
            return;
        }

        if (Character.energy < ENERGY_THRESHOLD) {
            if (!useEnergyItem()) {
                restAtHotel();
            }
            return;
        }

        log("Iniciando trabalho...");
        workWindow.startWork();
    }

    function toggleAuto() {
        autoMode = !autoMode;
        if (autoMode) {
            log("Modo automático ATIVADO");
            intervalId = setInterval(doWork, INTERVAL);
        } else {
            log("Modo automático DESLIGADO");
            clearInterval(intervalId);
        }
    }

    function createUI() {
        const icon = document.createElement("div");
        icon.innerText = "⚙️";
        icon.style.position = "absolute";
        icon.style.top = "80px";
        icon.style.left = "5px";
        icon.style.zIndex = 10000;
        icon.style.background = "white";
        icon.style.border = "1px solid black";
        icon.style.borderRadius = "8px";
        icon.style.padding = "6px";
        icon.style.cursor = "pointer";
        icon.title = "Clique para ligar/desligar o modo automático";
        icon.onclick = toggleAuto;
        document.body.appendChild(icon);
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            createUI();
            log("Script carregado.");
        }, 3000);
    });
})();
