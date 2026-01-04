// ==UserScript==
// @name         Traducciones de Lugares
// @namespace    https://greasyfork.org/es-419/users/67894-crotalo
// @version      1.3
// @description  Traduce categorías de lugares en Waze Map Editor al español
// @author       crotalo
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @grant        none
// @license      MIT
// @supportURL   https://greasyfork.org/scripts/your-script-url
// @icon         https://www.waze.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/531437/Traducciones%20de%20Lugares.user.js
// @updateURL https://update.greasyfork.org/scripts/531437/Traducciones%20de%20Lugares.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.traduccionesWME) {
        const CATEGORY_TRANSLATIONS = {
            "restaurant": "Restaurante",
            "cafe": "Cafetería",
            "hotel": "Hotel",
            "gas station": "Estación de servicio",
            "hospital": "Hospital",
            "pharmacy": "Farmacia",
            "bank": "Banco",
            "atm": "Cajero automático",
            "parking": "Estacionamiento",
            "school": "Escuela",
            "university": "Universidad",
            "museum": "Museo",
            "park": "Parque",
            "mall": "Centro comercial",
            "supermarket": "Supermercado",
            "gym": "Gimnasio",
            "church": "Iglesia",
            "police": "Comisaría",
            "fire station": "Estación de bomberos",
            "library": "Biblioteca",
            "stadium": "Estadio",
            "cinema": "Cine",
            "theater": "Teatro",
            "zoo": "Zoológico",
            "airport": "Aeropuerto",
            "train station": "Estación de tren",
            "bus station": "Estación de autobuses",
            "car wash": "Lavado de coches",
            "car repair": "Taller mecánico",
            "dentist": "Dentista",
            "doctor": "Médico",
            "clinic": "Clínica",
            "veterinary": "Veterinario",
            "post office": "Oficina de correos",
            "shopping": "Tiendas",
            "bakery": "Panadería",
            "butcher": "Carnicería",
            "market": "Mercado",
            "florist": "Florería",
            "book store": "Librería",
            "electronics": "Electrónica",
            "furniture": "Mueblería",
            "jewelry": "Joyería",
            "optician": "Óptica",
            "pet store": "Tienda de mascotas",
            "sports": "Artículos deportivos",
            "toy store": "Juguetería",
            "department store": "Grandes almacenes"
        };

        window.traduccionesWME = traducciones;
        console.log('[Traducciones WME] ✅ Diccionario cargado correctamente');
    } else {
        console.warn('[Traducciones WME] ⚠️ El diccionario ya estaba cargado');
    }
})();