// ==UserScript==
// @name         MooMoo.io Visuals
// @name:es      MooMoo.io Visuales
// @name:ru      Визуальные улучшения для MooMoo.io
// @name:fr      Améliorations visuelles pour MooMoo.io
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Visually improve moomoo.io by changing the style of certain elements and showing weapon reload bars.
// @description:es  Mejora visualmente moomoo.io cambiando el estilo de ciertos elementos y mostrando barras de recarga de armas.
// @description:ru  Визуальное улучшение для moomoo.io путем изменения стиля элементов и отображения полос перезарядки оружия.
// @description:fr  Améliorez visuellement moomoo.io en modifiant le style de certains éléments et en affichant des barres de rechargement d'armes.
// @author       Tu Nombre
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @require      https://update.greasyfork.org/scripts/480301/1322984/CowJS.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495898/MooMooio%20Visuals.user.js
// @updateURL https://update.greasyfork.org/scripts/495898/MooMooio%20Visuals.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Functionality from MooMoo.io Visuals
    let mouse = { x: 0, y: 0 };
    let width;
    let height;
    let coreURL = new URL(window.location.href);
    window.sessionStorage.force = coreURL.searchParams.get("fc");
    var ws;
    var msgpack5 = window.msgpack;
    document.msgpack = window.msgpack;
    WebSocket.prototype.oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(message) {
        if (!ws) {
            document.ws = this;
            ws = this;
        }
        this.oldSend(message);
    };
    let keys = {};

    function sendPacket(packetName) {
        let content = Array.prototype.slice.call(arguments, 1);
        ws.send(msgpack5.encode([packetName, content]));
    }

    function chat(message) {
        sendPacket("6", message);
    }
    let prevCount = 0;
    const handleMutations = mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.target.id === "killCounter") {
                const count = parseInt(mutation.target.innerText, 10) || 0;
                if (count > prevCount) {
                    chat("gg - MooMoo.io Visuals");
                    prevCount = count;
                }
            }
        }
    };
    const observer = new MutationObserver(handleMutations);
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    function changeStyle() {
        var storeHolder = document.getElementById("storeHolder");
        var chatBox = document.getElementById("chatBox");
        var ageBarBody = document.getElementById("ageBarBody");
        if (storeHolder) {
            storeHolder.style.height = "600px";
            storeHolder.style.width = "400px";
        }
        if (chatBox) {
            chatBox.style.backgroundColor = "rgb(0 0 0 / 0%)";
        }
        if (ageBarBody) {
            ageBarBody.style.backgroundColor = "rgba(0, 128, 0, 0.8)";
            ageBarBody.style.border = "2px solid rgba(0, 128, 0, 0.5)";
        }
        if (storeHolder && chatBox && ageBarBody) {
            clearInterval(intervalId);
        }
    }
    var intervalId = setInterval(changeStyle, 500);

    // Functionality from MooMoo.io Reload Bars
    window.Cow.setCodec(window.msgpack);
    CanvasRenderingContext2D.prototype._roundRect = CanvasRenderingContext2D.prototype.roundRect;
    window.Cow.addRender("global", () => {
        window.Cow.playersManager.eachVisible(player => {
            if (player === null || player === undefined || !player.alive) return;

            function renderBar({ width, innerWidth, xOffset, yOffset, color }) {
                const context = window.Cow.renderer.context;
                const healthBarPad = window.config.healthBarPad;
                const height = 17;
                const radius = 8;
                context.save();
                context.fillStyle = "#3d3f42";
                context.translate(xOffset, yOffset);
                context.beginPath();
                context._roundRect(-width - healthBarPad, -8.5, 2 * width + 2 * healthBarPad, height, radius);
                context.fill();
                context.restore();
                context.save();
                context.fillStyle = color;
                context.translate(xOffset, yOffset);
                context.beginPath();
                context._roundRect(-width, -8.5 + healthBarPad, 2 * innerWidth, height - 2 * healthBarPad, radius - 1);
                context.fill();
                context.restore();
            }
            const width = window.config.healthBarWidth / 2 - window.config.healthBarPad / 2;
            const primaryReloadCount = Math.min(Math.max(player.reloads.primary.count / player.reloads.primary.max, 0), 1);
            const secondaryReloadCount = Math.min(Math.max(player.reloads.secondary.count / player.reloads.secondary.max, 0), 1);
            const yOffset = player.renderY + player.scale + window.config.nameY - 5;
            renderBar({
                width,
                innerWidth: width * primaryReloadCount,
                xOffset: player.renderX - width * 1.19,
                yOffset,
                color: player.isAlly ? "#8ecc51" : "#cc5151"
            });
            renderBar({
                width,
                innerWidth: width * secondaryReloadCount,
                xOffset: player.renderX + width * 1.19,
                yOffset,
                color: player.isAlly ? "#8ecc51" : "#cc5151"
            });
        });
    });
})();