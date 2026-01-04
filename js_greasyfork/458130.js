// ==UserScript==
// @name         Platform - Fill query parameters
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Fill automatically query parameters
// @author       Victor Ros
// @match        https://*.loopsoftware.fr/YPND/*/*/platform/*
// @match        https://*.loopsoftware.fr/YPN/*/*/platform/*
// @icon         https://img.icons8.com/color/512/oil-offshore-rig.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458130/Platform%20-%20Fill%20query%20parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/458130/Platform%20-%20Fill%20query%20parameters.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const VERSION_REGEX = /\/(?:\d+\.\d+\.\d+)\.(\d+\.\d+\.\d+)\//g;

    // Si c'est une string, cela pré-remplira le champs avec la valeur
    // Si c'est un tableau, cela crééra autant de boutons qu'il y a de valeurs ; au clic sur le bouton cela remplira le champ texte avec la valeur
    // Si c'est un objet, cela crééra autant de boutons qu'il y a de propriétés ; la clé sera utilisée pour l'affichage ; au clic sur le bouton cela remplira le champ texte avec la valeur
    const params = {
        commandType: "full",
        dbId: [
            "DBCONFIG",
            "DBPARAMETRE",
            "DBMODELE",
            "DBARPEGE"
        ],
        domain: [
            "ARPEGE",
            "COMETE",
            "CABVICTOR",
            "RDD"
        ],
        force: true,
        grants: "vros@domain.com",
        instanceId: {
            CAB: "99b034e4-e7b6-47ed-ad1a-f0e8fffdbb51",
            DOS: "1065009e-5ad4-44dc-978d-b32ccc03e618",
            MOD: "ed7c4159-7235-45a1-9814-b4500faeafd5"
        },
        namespace: [
            "cabinet",
            "config",
            "conventionnel",
            "dossier",
            "dossierPaie",
            "modele",
            "parametre"
        ],
        packageId: "D9E3B0EE-FFB6-4155-9A7D-2B7D66F3208A",
        replace: "always",
        reportFormat: "human",
        version: VERSION_REGEX.exec(window.location.href)[1]
    };

    Object.entries(params).map((_entry) => {
        const key = _entry.shift();
        const property = _entry.pop();

        const id = `${key}_paramID`;
        const elt = document.getElementById(id);

        if (elt) {
            if (typeof property === "string" || typeof property === "number") {
                elt.value = property;
            } else if (typeof property === "boolean") {
                elt.checked = property;
            } else if (Array.isArray(property) || typeof property === "object") {
                const rowParent = elt.closest("tr");
                if (rowParent) {
                    const td = document.createElement("td");
                    if (Array.isArray(property)) {
                        property.forEach((_property) => {
                            addInputToTd(elt, td, _property, _property);
                        });
                    } else {
                        Object.entries(property).forEach(([_key, _value]) => {
                            addInputToTd(elt, td, _key, _value);
                        });
                    }
                    rowParent.appendChild(td);
                }
            }
        }
    });

    function addInputToTd(_elt, _td, _displayName, _value) {
        const input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("name", _value);
        input.setAttribute("value", _displayName);
        input.addEventListener("click", () => {
            _elt.value = input.name;
        });
        _td.appendChild(input);
    }
})();
