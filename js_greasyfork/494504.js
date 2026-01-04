// ==UserScript==
// @name         SoundCloud Auto-reload on Connection
// @name:ru      SoundCloud Автоматическая перезагрузка при подключении
// @name:de      SoundCloud Automatisches Neuladen bei Verbindung
// @name:fr      SoundCloud Rechargement automatique lors de la connexion
// @name:es      SoundCloud Recarga automática al conectarse
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically reloads the SoundCloud page when online or when the internet connection is re-established.
// @description:ru Автоматически перезагружает страницу SoundCloud при наличии подключения к интернету или при восстановлении интернет-соединения.
// @description:de Lädt die SoundCloud-Seite automatisch neu, wenn eine Verbindung zum Internet besteht oder die Internetverbindung wiederhergestellt wurde.
// @description:fr Recharge automatiquement la page SoundCloud lorsque vous êtes en ligne ou lorsque la connexion Internet est rétablie.
// @description:es Recarga automáticamente la página de SoundCloud cuando estás en línea o cuando se restablece la conexión a Internet.
// @author       Levi Somerset
// @match        https://soundcloud.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soundcloud.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494504/SoundCloud%20Auto-reload%20on%20Connection.user.js
// @updateURL https://update.greasyfork.org/scripts/494504/SoundCloud%20Auto-reload%20on%20Connection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to reload if online
    function reloadIfOnline() {
        if (navigator.onLine) {
            const offlineMessage = document.querySelector('h1');
            if (offlineMessage && /Not available while you’re offline|Seite nicht verfügbar offline|No disponible sin conexión/i.test(offlineMessage.textContent)) {
                window.location.reload();
            }
        }
    }

    // Listen for the browser regaining connection
    window.addEventListener('online', reloadIfOnline);

    // Initial check in case the page loads while offline
    reloadIfOnline();

    // Regularly check in case the online event is missed
    setInterval(reloadIfOnline, 5000); // Check every 5 seconds
})();