// ==UserScript==
// @name         Grupos y Chat Privado en Drawaria
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Añade grupos privados en la sección de amigos en Drawaria.
// @author       TuNombre
// @match        https://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539659/Grupos%20y%20Chat%20Privado%20en%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/539659/Grupos%20y%20Chat%20Privado%20en%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cargar datos desde localStorage
    let grupos = JSON.parse(localStorage.getItem("grupos") || "{}");
    let invitaciones = JSON.parse(localStorage.getItem("invitaciones") || "{}");

    // Función para añadir la sección de grupos dentro del menú de amigos
    function integrarGruposEnAmigos() {
        let menuAmigos = document.querySelector(".friends-menu"); // Ajusta si la clase es distinta
        if (!menuAmigos || document.getElementById("grupoControl")) return; // Evita duplicados

        let grupoControl = document.createElement("div");
        grupoControl.id = "grupoControl";
        grupoControl.style.padding = "10px";
        grupoControl.style.background = "#222";
        grupoControl.style.color = "white";
        grupoControl.style.borderRadius = "5px";
        grupoControl.innerHTML = `
            <b>Gestión de Grupos</b><br>
            <button id="crearGrupo">Crear Grupo</button>
            <button id="verInvitaciones">Ver Invitaciones</button>
            <div id="listaGrupos"></div>
        `;
        menuAmigos.appendChild(grupoControl);

        // Evento para crear grupos
        document.getElementById("crearGrupo").addEventListener("click", function() {
            let nombreGrupo = prompt("Nombre del grupo:");
            if (nombreGrupo) {
                grupos[nombreGrupo] = [];
                localStorage.setItem("grupos", JSON.stringify(grupos));
                actualizarListaGrupos();
            }
        });

        // Ver invitaciones
        document.getElementById("verInvitaciones").addEventListener("click", function() {
            let jugador = prompt("Tu nombre:");
            if (invitaciones[jugador]) {
                let grupo = invitaciones[jugador];
                let aceptar = confirm(`Has sido invitado al grupo "${grupo}". ¿Aceptar?`);
                if (aceptar) {
                    grupos[grupo].push(jugador);
                    delete invitaciones[jugador];
                    localStorage.setItem("grupos", JSON.stringify(grupos));
                    actualizarListaGrupos();
                }
            } else {
                alert("No tienes invitaciones pendientes.");
            }
        });

        actualizarListaGrupos();
    }

    // Función para actualizar la lista de grupos dentro del menú de amigos
    function actualizarListaGrupos() {
        let lista = document.getElementById("listaGrupos");
        if (!lista) return;
        lista.innerHTML = "<b>Grupos:</b><br>";
        Object.keys(grupos).forEach(grupo => {
            lista.innerHTML += `
                ${grupo} <button onclick="invitar('${grupo}')">Invitar</button>
                <button onclick="abrirChat('${grupo}')">Chat</button><br>
            `;
        });
    }

    // Función para detectar si el usuario abre la sección de amigos
    let observador = new MutationObserver((mutaciones) => {
        mutaciones.forEach(m => {
            if (m.addedNodes.length) {
                integrarGruposEnAmigos();
            }
        });
    });

    observador.observe(document.body, { childList: true, subtree: true });

})();

