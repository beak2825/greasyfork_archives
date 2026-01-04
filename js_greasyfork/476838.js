// ==UserScript==
// @name         Mostrar Notas
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1.551
// @description  Script para mostrar las notas actuales de todos los usuarios en el scoreboard del CTFd. (TODO: Manejo de errores en las requests)
// @author       Neftalí Toledo
// @match        https://ic.catedras.linti.unlp.edu.ar/scoreboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.ar
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/476838/Mostrar%20Notas.user.js
// @updateURL https://update.greasyfork.org/scripts/476838/Mostrar%20Notas.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    
    const ENDPOINT = "https://ic.catedras.linti.unlp.edu.ar/api/v1/users/USER_ID/solves";
    const RETOS_ENDPOINT = "https://ic.catedras.linti.unlp.edu.ar/api/v1/challenges"

    // Define los valores de suma correspondientes a cada categoría para el promedio ponderado
    //const cantidad_dificultades = 3; (SIN USO)
    const valorEasy = 4;
    const valorMedium = 3;
    const valorHard = 3;

    const valoresTotales = await obtenerValoresTotales(); //Obtiene los totales para calcular el promedio

    // Categorias que no se van a tener en cuenta para el calculo de la nota
    const categoriasExcluidas = [
        "Extras-(no-suman-nota)",
        "Practica-0_Scripting"
    ]

    //Promedio

    function calcularPromedioPonderado(cantidadEasy, cantidadMedium, cantidadHard, categoria) {
        // Calcula la suma ponderada
        const promedioEasy = calcularPromedio(cantidadEasy, valoresTotales[categoria]["Easy"] || 1);
        const promedioMedium = calcularPromedio(cantidadMedium, valoresTotales[categoria]["Medium"] || 1);
        const promedioHard = calcularPromedio(cantidadHard, valoresTotales[categoria]["Hard"] || 1);

        return (promedioEasy * valorEasy + promedioMedium * valorMedium + promedioHard * valorHard);
    }

    function calcularPromedio(retos_resueltos, total) {
        return (retos_resueltos / total);
    }

    // Filtros

    function filtrarDesafios(data, total = false) {
        const result = {};
    
        data.forEach(item => {
            const categoryKey = total ? item.category : item.challenge.category;
            const [categoria, dificultad] = categoryKey.split(" - ");
    
            result[categoria] = result[categoria] || {};
            result[categoria][dificultad] = (result[categoria][dificultad] || 0) + 1;
        });
    
        return result;
    }
    
    // Exclusiones

    function excluirCategorias(categorias) {
        const categoriasExcluidasSet = new Set(categoriasExcluidas); // Se convierte en Set por eficiencia para muchas categorías excluidas
        return categorias.filter(categoria => !categoriasExcluidasSet.has(categoria));
    }

    // Obtener la cantidad de retos resueltos por el usuario

    async function obtenerRetosResueltos(user) {
        const req = ENDPOINT.replace("USER_ID", user);
        const response = await fetch(req);
        const dataJSON = await response.json();
        
        return dataJSON;
    }

    // Obtener nota para cada practica

    function obtenerNotas(data) {
        const retos_resueltos = filtrarDesafios(data);
        const categorias = excluirCategorias(Object.keys(retos_resueltos));
        
        const notas = categorias
            .filter(categoria => Object.keys(retos_resueltos[categoria]).length > 0)
            .map(categoria => {
                const cantidadEasy = retos_resueltos[categoria]["Easy"] || 0;
                const cantidadMedium = retos_resueltos[categoria]["Medium"] || 0;
                const cantidadHard = retos_resueltos[categoria]["Hard"] || 0;
                
                const promedioPonderado = calcularPromedioPonderado(cantidadEasy, cantidadMedium, cantidadHard, categoria);
                return `${categoria}: ${parseFloat(promedioPonderado).toPrecision(3)}`;
            })
            .reverse().join("<br>");
    
        return notas;
    }

    // Obtener el total de retos por categoría
    async function obtenerValoresTotales(){
        const response = await fetch(RETOS_ENDPOINT);
        const retosJSON = await response.json();
        const retos_total = filtrarDesafios(retosJSON.data, true);
        return retos_total;
    }

    // Obtenemos la tabla de usuarios y sus filas
    const tablaUsuarios = document.querySelector(".table-striped");
    const filas = tablaUsuarios.querySelectorAll("tr");

    // Añadir columna de notas
    const columnaNotas = document.createElement("td");
    columnaNotas.setAttribute("scope", "col");
    columnaNotas.innerHTML = "<b>Notas</b>";
    filas[0].appendChild(columnaNotas);

    // Obtener las notas de cada usuario
    const userPromises = [];
    for (let i = 1; i < filas.length; i++) {
        //A veces este link cambia a "https://ic.catedras.linti.unlp.edu.ar/teams/" en vez de "https://ic.catedras.linti.unlp.edu.ar/users/"
        // No se por qué pasa
        const userID = parseInt(filas[i].querySelector("td a").href.replace("https://ic.catedras.linti.unlp.edu.ar/users/", ""));
        userPromises.push(obtenerRetosResueltos(userID));
    }

    // Esperar a que se resuelvan todas las promesas
    const userNotes = await Promise.all(userPromises);

    // Construir notas como una cadena HTML
    const notasHTML = userNotes.map(userNote => {
        const notas = obtenerNotas(userNote.data);
        return notas || "No resolvió ningún reto";
    });

    // Añadir notas a cada fila
    for (let i = 1; i < filas.length; i++) {
        const elementoNota = document.createElement("td");
        elementoNota.innerHTML = notasHTML[i - 1];
        filas[i].appendChild(elementoNota);
    }
})();
