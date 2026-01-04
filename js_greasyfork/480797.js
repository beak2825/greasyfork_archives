// ==UserScript==
// @name         Limpieza de Lista "Ver Más Tarde" de YouTube con Botones Animados
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Elimina automáticamente los videos de la lista "Ver Más Tarde" de YouTube. Añade botones con animaciones para una mejor interacción.
// @author       Sebastián Riquelme - GitHub: SebastianRiquelmeM
// @match        https://www.youtube.com/playlist?list=WL*
// @grant        none
// @license      MIT
// @supportURL   https://github.com/SebastianRiquelmeM/TamperMonkeyEliminarVerMasTardeYoutube/issues
// @downloadURL https://update.greasyfork.org/scripts/480797/Limpieza%20de%20Lista%20%22Ver%20M%C3%A1s%20Tarde%22%20de%20YouTube%20con%20Botones%20Animados.user.js
// @updateURL https://update.greasyfork.org/scripts/480797/Limpieza%20de%20Lista%20%22Ver%20M%C3%A1s%20Tarde%22%20de%20YouTube%20con%20Botones%20Animados.meta.js
// ==/UserScript==

(function () {
	"use strict";

	var intervalId;

	function removeVideo() {
		var video = document.querySelector("ytd-playlist-video-renderer");
		if (!video) return;

		var menuButton = video.querySelector("ytd-menu-renderer #button");
		if (menuButton) {
			menuButton.click();
		}

		setTimeout(function () {
			var removeButton = Array.from(
				document.querySelectorAll("ytd-menu-service-item-renderer")
			).find((el) => el.innerText.includes("Eliminar de Ver más tarde"));

			if (removeButton) {
				removeButton.click();
			}
		}, 500);
	}

	function applyBootstrapStyle(button, color, hoverColor) {
		button.style.padding = "10px 15px";
		button.style.fontSize = "14px";
		button.style.lineHeight = "1.5";
		button.style.borderRadius = "0.25rem";
		button.style.border = "1px solid transparent";
		button.style.color = "white";
		button.style.backgroundColor = color;
		button.style.transition =
			"color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out, transform .2s";
		button.onmouseover = function () {
			this.style.backgroundColor = hoverColor;
			this.style.transform = "scale(1.05)";
		};
		button.onmouseout = function () {
			this.style.backgroundColor = color;
			this.style.transform = "scale(1)";
		};
	}

	function createButtons() {
		var sortButton = document.querySelector(
			"yt-sort-filter-sub-menu-renderer"
		);
		if (!sortButton) return;

		var buttonContainer = document.createElement("div");
		buttonContainer.style.display = "flex";
		buttonContainer.style.marginRight = "10px";

		var startButton = document.createElement("button");
		startButton.textContent = "🗑️ Comenzar a eliminar todos los videos";
		startButton.style.cursor = "pointer";
		startButton.style.marginRight = "10px";
		applyBootstrapStyle(startButton, "#28a745", "#218838"); // Verde con hover más oscuro
		startButton.addEventListener("click", function () {
			intervalId = setInterval(removeVideo, 1000);
			startButton.disabled = true;
		});

		var stopButton = document.createElement("button");
		stopButton.textContent = "🛑 Detener Eliminación";
		stopButton.style.cursor = "pointer";
		applyBootstrapStyle(stopButton, "#dc3545", "#c82333"); // Rojo con hover más oscuro
		stopButton.addEventListener("click", function () {
			clearInterval(intervalId);
			startButton.disabled = false;
		});

		buttonContainer.appendChild(startButton);
		buttonContainer.appendChild(stopButton);

		sortButton.parentNode.insertBefore(buttonContainer, sortButton);
	}

	// Retrasa la creación de los botones para asegurarse de que el contenedor ha cargado
	setTimeout(createButtons, 3000);
})();
