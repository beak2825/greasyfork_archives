// ==UserScript==
// @name         Cargador de Notas
// @namespace    http://www.frc.utn.edu.ar/
// @version      3.17
// @description  Carga de notas en Autogestión
// @author       Leonardo Giordano
// @match        https://www.frc.utn.edu.ar/academico3/transacciones/ajax/comisionXml.asp?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452570/Cargador%20de%20Notas.user.js
// @updateURL https://update.greasyfork.org/scripts/452570/Cargador%20de%20Notas.meta.js
// ==/UserScript==

/* Historial de Cambios
   Versión 3.17
   1) Para Física, se deben aprobar 3 de los 4 TPs
   Versión 3.16
   1) Cambios en figura de "Abandonó" y "Libre"
   Versión 3.15
   1) Se agrega condición final "No Cursó" 
   Versión 3.14
   1) Se agrega Física 1 y 2. 
   2) Revisión de código general (simplificación)
   Versión 3.12
   1) Actualizacion para Sistemas de Representación de Industrial
   Versión 3.12
   1) Actualizacion para Informática 2 de Industrial
   Versión 3.11
   1) Actualizacion para Pensamiento Sistémico
   Versión 3.10
   1) Se agrega Fundamentos de Informática para CIVIL.
   Versión 3.09
   1) Se adapta a nuevo esquema de regularización para Análisis 1.

   Version 3.03 - 3.08
   1) Se agregaron condiciones de regularidad para Pensamiento Sistémico.
   Version 3.02
   1) El número de versión se obtiene del metaobjeto GM.
   Version 3.01
   1) Cambio en deteccion de la tabla de notas.
   Version 3.00
   1) Cambios en UI
   Version 2.76
   1) Se agregó Sistemas de Representación.
   Version 2.74
   1) Si el legajo viene vacío, no se lo procesa.
   Version 2.73
   1) Si la nota viene vacía, no se carga nada (se ponía NaN)
   Version 2.72
   1) Corrección de palabras en mensajes.
   Version 2.71
   1) Se corrigio la funcion para poner condicion final de AM1 y AM2.
   Version 2.70
   1) Se redondean notas.
   Version 2.69
   1) Se mostraban duplicados al controlar notas.

   Version 2.67
   1) Se muestran/ocultan botones para cargar promedios y condición académica de acuerdo a la materia seleccionada.
   2) En AM2, no existe mas la condición "Promocionó", es Regular.
   3) Se permite cargar/controlar la nota en la columna "Nota Final"
   4) Cuando se controlan notas, se marcan en rojo los edits con diferencias.
   5) Al cargar notas, se alerta si se van a sobre-escribir notas y el usuario debe confirmar si sigue o no.
*/

let clipboard = ""; // Aca dejo una copia del clipboard
let legNotas = []; // Array de Legajos/Notas

/* 
Aca se definen las materias que sé como poner condiciones finales y promedios.
También se indican los botones que deben mostrarse y las funciones asignadas a cada botón.
*/
const materias = [
    {
        text: "----",
        botones: {}
    },
    {
        text: "Análisis Matemático 1",
        botones: {
            practico: ponerPromPracticoAM1Nuevo,
            teorico: ponerPromTeoricoAM1Nuevo,
            final: ponerNotaFinalAM1Nuevo,
            cond: ponerCondicionFinalAM1Nuevo
        }
    },
    {
        text: "Análisis Matemático 2",
        botones: {
            final: ponerNotaFinalAM2,
            cond: ponerCondicionFinalAM2
        }
    },
    {
        text: "Sist. Representación - Civil",
        botones: {
            final: ponerNotaFinalSistRep,
            cond: ponerCondicionFinalSistRep
        }
    },
    {
        text: "Pensamiento Sistémico",
        botones: {
            cond: ponerCondicionFinalPenSis
        }
    },
    {
        text: "Fundamentos de Informática Civil",
        botones: {
            final: ponerNotaFinalFDI_C_2023,
            cond: ponerCondicionFinalFDI_C_2023
        }
    },
    {
        text: "Informática 2 - Industrial",
        botones: {
            cond: ponerCondicionFinalInfo2
        }
    },
    {
        text: "Sist. Representación - Industrial",
        botones: {
            cond: ponerCondicionFinalSistRepIndus
        }
    },
    {
        text: "Física 1 y 2",
        botones: {
            cond: ponerCondicionFinalFisica
        }
    },
];

// Nombres de los botones
const allButtons = {
    practico: "btnPromPractico",
    teorico: "btnPromTeorico",
    final: "btnNotaFinal",
    cond: "btnCondFinal"
};

// Esta funcion obtiene la tabla de notas del HTML de la página de autogestión
function getTablaNotas() {
    let tables = document.getElementsByTagName("table");
    console.log(tables);

    for (let i = 0; i < tables.length; i++) {
        if (tables[i].innerText.indexOf("Legajo") == 0) {
            console.log(tables[i]);
            return tables[i];
        }
    }
}

// Esta funcion copia los legajos y notas desde el clipboard, para luego usar esos datos
function onCopiarLegajos(event) {
    event.preventDefault();// Para que no haga submit del form

    navigator.clipboard.readText().then(
        clipText => {
            clipboard = clipText;
            let valid = false;
            legNotas.length = 0;
            if (clipboard.length > 0) {
                let s = clipboard.split("\n");
                if (s.length) {
                    for (let i = 0; i < s.length; i++) {
                        if (s[i].length) {
                            let x = s[i].split("\t");
                            if (x.length >= 2 && x[0].length > 0) {
                                let n;
                                if (x[x.length - 1].length) {
                                    n = Math.round(parseFloat(x[x.length - 1].replace(',', '.')));
                                    if (isNaN(n)) {
                                        continue;
                                    }
                                }
                                else {
                                    continue;
                                }
                                let leg = { legajo: x[0], nota: n, changedByMe: false };
                                legNotas.push(leg);
                            }
                        }
                    }
                    valid = true;
                }
            }
            let btn;
            if (!valid || legNotas.length == 0) {
                alert("Debe copiar legajos y notas (seleccionar en planilla y presionar CTRL+C)");
                btn = document.getElementById("btnProcess");
                btn.disabled = true;
                btn = document.getElementById("btnCheckNot");
                btn.disabled = true;
                btn = document.getElementById("btnCheckLeg");
                btn.disabled = true;
            }
            else {
                let msg = document.getElementById("stsMsg");
                msg.innerHTML = "Se importaron " + legNotas.length + " legajos/notas";
                if (legNotas.length > 0) {
                    btn = document.getElementById("btnProcess");
                    btn.disabled = false;
                    btn = document.getElementById("btnCheckNot");
                    btn.disabled = false;
                    btn = document.getElementById("btnCheckLeg")
                        ;
                    btn.disabled = false;
                }
            }
        });
}

// Esta funcion controla los legajos del clipboard con los legajos en la página
function onVerificarLegajos(event) {
    event.preventDefault();// Para que no haga submit del form

    if (legNotas.length == 0) {
        alert("No hay legajos para controlar");
        return;
    }
    let legError = [];
    let col = 1;
    for (let i = 0; i < legNotas.length; i++) {
        let x = getNotaEdit(col, legNotas[i].legajo);
        if (x.length != 1) {
            legError.push(legNotas[i].legajo);
            console.log("Error al buscar legajo " + legNotas[i].legajo);
        }
    }
    let msg = document.getElementById("controlMsg");
    if (legError.length == 0) {
        msg.innerHTML = "Se controlaron " + legNotas.length + " legajos sin problema!";
    }
    else {
        msg.innerHTML = "Hay " + legError.length + " legajo(s) no encontrado(s)!";

        let t = "Legajos en Total:  " + legNotas.length + "\n";
        t += "Legajo(s) no encontrado(s): " + legError.length + "\n";
        for (let j = 0; j < legError.length; j++) {
            t += legError[j] + " ";
        }
        alert(t);
    }
}

// Esta funcion controla las notas del clipboard con las notas en la página
function onVerificarNotas(event) {
    event.preventDefault();// Para que no haga submit del form
    if (legNotas.length == 0) {
        alert("No hay legajos para controlar");
        return;
    }
    let legError = [];
    let col = document.getElementById("columnaCargaControl").selectedIndex + 1;
    for (let i = 0; i < legNotas.length; i++) {
        let x = getNotaEdit(col, legNotas[i].legajo);
        if (x.length != 1) {
            legError.push(legNotas[i].legajo);
            console.log("Error al buscar legajo " + legNotas[i].legajo);
        }
        else {
            if (legNotas[i].nota != x[0].value) {
                x[0].style.backgroundColor = "red";
                legError.push(legNotas[i].legajo);
                console.log("Nota de " + legNotas[i].legajo + " no coincide (" + x[0].value + ")");
            }
            else {
                x[0].style.backgroundColor = "";
            }
        }
    }
    if (legError.length == 0) {
        alert("Se controlaron " + legNotas.length + " notas sin diferencias!");
    }
    else {
        let t = "Legajos en Total:  " + legNotas.length + "\n";
        t += "Legajos/Notas con diferencias: " + legError.length + "\n";
        for (let j = 0; j < legError.length; j++) {
            t += legError[j] + " ";
        }
        alert(t);
    }
}

// Esta funcion carga las notas desde el clipboard a la página
function onCargarNotas(event) {
    event.preventDefault();// Para que no haga submit del form
    if (legNotas.length == 0) {
        alert("No hay legajos para controlar");
        return;
    }
    let legError = [];
    let col = document.getElementById("columnaCargaControl").selectedIndex + 1;
    // Aca voy a controlar si la columna NO esta vacia (y lo alerto en tal caso)
    for (let i = 0; i < legNotas.length; i++) {
        let x = getNotaEdit(col, legNotas[i].legajo);
        if (x.length != 1) {
            //            legError.push(legNotas[i].legajo);
            //            console.log("Error al buscar legajo " + legNotas[i].legajo);
        }
        else {
            if (x[0].value != "" && legNotas[i].nota != x[0].value) {
                if (confirm("Se van a sobre-escribir notas! Presione Aceptar para continuar con la carga de notas.")) {
                    break;
                }
                else {
                    return;
                }
            }
        }
    }
    let sendToServer = document.getElementById("cbSendToServer").checked;
    for (i = 0; i < legNotas.length; i++) {
        x = getNotaEdit(col, legNotas[i].legajo);
        if (x.length != 1) {
            legError.push(legNotas[i].legajo);
            console.log("Error al buscar legajo " + legNotas[i].legajo);
        }
        else {
            if (legNotas[i].nota != x[0].value || legNotas[i].changedByMe) {
                x[0].value = legNotas[i].nota;
                // En el caso que el usuario haga un preview (no envia al servidor)
                // Si luego activa enviar al servidor no va a funcionar porque no hay cambio de nota
                // Entonces dejo marcada que esta nota fue cambiada por mi (preview)
                legNotas[i].changedByMe = true;
                if (sendToServer) {
                    x[0].focus();
                    x[0].blur();
                }
            }
        }
    }
    let t;
    if (legError.length == 0) {
        t = "Se cargaron " + legNotas.length + " notas sin problema!\n";
        if (!sendToServer) {
            t += "IMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue habilitado)";
        }
    }
    else {
        t = "Legajos en Total:  " + legNotas.length + "\n";
        t += "Legajos no procesados: " + legError.length + "\n";
        for (let j = 0; j < legError.length; j++) {
            t += legError[j] + " ";
        }
        if (!sendToServer) {
            t += "\nIMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue solicitado)";
        }
    }
    alert(t);
}

/*
function onCargarPromedio(event) {
    event.preventDefault();// Para que no haga submit del form

    let col = document.getElementById("columnaCargaPromedio").selectedIndex + 1;

    // Me fijo que al menos 2 columnas estén seleccionadas
    let count = 0;
    for (let i = 1; i <= 10; i++) {
        let colChecked = document.getElementById("promCol" + i).checked;
        if (colChecked) {
            count++;

            if (i == col) {
                alert("La columna donde se carga el promedio no puede ser usada para el cálculo del mismo");
                return;
            }
        }
    }

    if (count < 2) {
        alert("Debe seleccionar al menos 2 columnas para el calculo del promedio.");
        return;
    }


    let rows = document.getElementsByTagName("table")[8].rows;
    //    console.log(rows);
    let sendToServer = document.getElementById("cbSendToServerPromedio").checked;

    for (let i = 1; i < rows.length; i++) {
        //        console.log(rows[i]);
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        //        console.log(legajo);
        let promTeorico = 0;
        let notasT = getNotasValidas(getNotaEdit(7, legajo), getNotaEdit(8, legajo), getNotaEdit(9, legajo));
        //        console.log(notasT);
        if (notasT[0] >= 7 && notasT[1] >= 7) {
            promTeorico = (notasT[0] + notasT[1]) / 2.0;
            let editTeor = getNotaEdit(10, legajo);
            editTeor[0].value = Math.round(promTeorico);
            //            console.log("Prom Teorico: " + promTeorico);
            legPromDone++;
            if (sendToServer) {
                editTeor[0].focus();
                editTeor[0].blur();
            }
        }
    }
    // let t;
    // t = "Se cargaron " + legPromDone + " promedios.\n";
    // if (!sendToServer) {
    //     t += "IMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue habilitado)";
    // }
    // alert(t);




    // Ahora si hago el calculo
    for (i = 0; i < legNotas.length; i++) {
        let suma = 0;

        x = getNotaEdit(col, legNotas[i].legajo);
        if (x.length != 1) {
            legError.push(legNotas[i].legajo);
            console.log("Error al buscar legajo " + legNotas[i].legajo);
        }
        else {
        }
    }

    for (let i = 1; i <= 10; i++) {
        let colChecked = document.getElementById("promCol" + i).checked;
        if (colChecked) {
        }
    }

}
*/

// Esta funcion devuelve el edit correspondiente a un legajo y una columna.
// En autogestión, hay 10 columnas de notas (numeradas) más la columna "final"
function getNotaEdit(col, legajo) {
    if (Number.isInteger(col)) {
        if (col > 10) {
            col = "final";
        }
    }
    let edit = document.getElementsByName('nota' + col + 'L' + legajo);
    return edit;
}

// Devuelve la nota de un edit o 0 si el edit no tiene nota.
function getNotaFromEdit(edit) {
    if (edit[0].value.length) {
        return parseInt(edit[0].value);
    }
    return 0;
}

// Devuelve arrays con las notas de un legajo. 
// 'cols' es un array que indica de donde obtener las notas
// 'recupCols' es un array que indica de donde obtener recuperatorios (si los hubiera)
function getNotasValidasNew(legajo, cols, recupCols) {
    let notas = [];
    for (let i = 0; i < cols.length; i++) {
        // Nota principal
        let nota = getNotaFromEdit(getNotaEdit(cols[i], legajo));

        // Si hay columna de recuperatorio asociada
        if (recupCols && recupCols[i] !== undefined) {
            let recup = getNotaFromEdit(getNotaEdit(recupCols[i], legajo));
            if (recup > 0) { // Si existe recuperatorio, reemplaza
                nota = recup;
            }
        }

        notas.push(nota);
    }
    return notas;
}

// Esta funcion devuelve el promedio de un array
function promedio(arr) {
    if (arr.length === 0) return 0; // evitar división por cero
    let suma = arr.reduce((acc, n) => acc + n, 0);
    return suma / arr.length;
}

// Esta función hace el envío al backoffice del select de condición final
function sendSelect(select) {
    select.onchange();
}

// Esta funcion pone la nota final para AM1
function ponerNotaFinalAM1Nuevo() {

    let table = getTablaNotas();
    let rows = table.rows;

    //    console.log(rows);
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    let legPromDone = 0;
    for (let i = 1; i < rows.length; i++) {
        //        console.log(rows[i]);
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        //        console.log(legajo);
        let promoNotaFinal = 0;

        let notas = getNotasValidasNew(legajo, [4, 9, 10]);
        // En notas me queda:
        // notas[0]: Promedio Práctico
        // notas[1]: Promedio Teórico
        // notas[2]: Eval. Formativa

        if (notas[0] >= 6 && notas[1] >= 6 && notas[2] >= 6) {
            promoNotaFinal = (notas[0] + notas[1]) / 2.0;
            let notaFinal = getNotaEdit("final", legajo);
            notaFinal[0].value = Math.round(promoNotaFinal);
            legPromDone++;
            if (sendToServer) {
                notaFinal[0].focus();
                notaFinal[0].blur();
            }

        }
    }
    let t;
    t = "Se cargaron " + legPromDone + " notas finales.\n";
    if (!sendToServer) {
        t += "IMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue habilitado)";
    }
    alert(t);
}

// Esta funcion pone la nota final para AM2
function ponerNotaFinalAM2() {

    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    let legPromDone = 0;
    //    console.log(rows);

    for (let i = 1; i < rows.length; i++) {
        //        console.log(rows[i]);
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        //        console.log(legajo);
        let promPractico = 0;
        let notasP = getNotasValidasNew(legajo, [1, 2, 3]);
        if (notasP[2] > 0) {
            // Si tengo recuperatorio, reemplazo la nota
            if (notasP[0] < notasP[1]) {
                notasP[0] = notasP[2];
            }
            else {
                notasP[1] = notasP[2];
            }
        }

        //        console.log(notasP);
        if (notasP[0] >= 6 && notasP[1] >= 6) {
            promPractico = (notasP[0] + notasP[1]) / 2.0;
            //            console.log("Prom Practico: " + promPractico);
        }
        let promTeorico = 0;

        let notasT = getNotasValidasNew(legajo, [4, 5, 6]);
        if (notasT[2] > 0) {
            // Si tengo recuperatorio, reemplazo la nota
            if (notasT[0] < notasT[1]) {
                notasT[0] = notasT[2];
            }
            else {
                notasT[1] = notasT[2];
            }
        }

        //        console.log(notasT);
        if (notasT[0] >= 6 && notasT[1] >= 6) {
            promTeorico = (notasT[0] + notasT[1]) / 2.0;
            //            console.log("Prom Teorico: " + promTeorico);
        }

        // Coloquio
        let notaC = getNotaEdit(7, legajo);

        if (notaC[0].value != "") {
            // Tengo nota de coloquio
            if (promTeorico > 0 && promPractico > 0 && parseInt(notaC[0].value) >= 6) {
                let notaFinal = getNotaEdit("final", legajo);
                notaFinal[0].value = Math.round((promPractico + promTeorico + parseInt(notaC[0].value)) / 3.0);
                legPromDone++;
                if (sendToServer) {
                    notaFinal[0].focus();
                    notaFinal[0].blur();
                }
            }

        }
        else {
            if (promTeorico > 0 && promPractico > 0) {
                let notaFinal = getNotaEdit("final", legajo);
                notaFinal[0].value = Math.round((promPractico + promTeorico) / 2.0);
                legPromDone++;
                if (sendToServer) {
                    notaFinal[0].focus();
                    notaFinal[0].blur();
                }
            }

        }
    }
    let t;
    t = "Se cargaron " + legPromDone + " notas finales.\n";
    if (!sendToServer) {
        t += "IMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue habilitado)";
    }
    alert(t);
}

// Esta funcion pone la nota final para Fundamentos de Informática 2023
function ponerNotaFinalFDI_C_2023() {
    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    let legPromDone = 0;
    for (let i = 1; i < rows.length; i++) {
        //console.log(rows[i]);
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        //console.log(legajo);
        let promPractico = 0;
        let notasP = getNotasValidasNew(legajo, [1, 2, 4, 3]);

        if (notasP[3] > 0) {
            if (notasP[0] < notasP[1]) {
                notasP[0] = notasP[3];
            }
            else {
                notasP[1] = notasP[3];
            }

        }

        //console.log(notasP);
        if (notasP[0] >= 6 && notasP[1] >= 6 && notasP[2] >= 6) {
            promPractico = (notasP[0] + notasP[1] + notasP[2]) / 3.0;
            let editProm = getNotaEdit(11, legajo);
            editProm[0].value = Math.round(promPractico);
            legPromDone++;
            if (sendToServer) {
                editProm[0].focus();
                editProm[0].blur();
            }
            //console.log("Prom Practico: " + promPractico);
        }
    }
    let t;
    t = "Se cargaron " + legPromDone + " promedios.\n";
    if (!sendToServer) {
        t += "IMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue habilitado)";
    }
    alert(t);
}

// Esta funcion pone la nota final para Sistemas de Representación
function ponerNotaFinalSistRep() {
    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    let legPromDone = 0;
    for (let i = 1; i < rows.length; i++) {

        let legajo = rows[i].cells[0].childNodes[0].innerHTML;

        let notasTP = getNotasValidasNew(legajo, [1, 2, 3, 4, 6, 7, 8]);
        if (notasTP.some(n => n == 0)) {
            continue;
        }
        let notasP = getNotasValidasNew(legajo, [5, 9, 10]);
        if (notasP.some(n => n == 0)) {
            continue;
        }
        if (!notasTP.every(n => n >= 4)) {
            continue;
        }
        if (!notasP.every(n => n >= 4)) {
            continue;
        }

        let averageTps = promedio(notasTP);
        let averageParciales = promedio(notasP);
        let averageFinal = Math.round((averageTps + averageParciales) / 2.0);
        if (averageFinal >= 6) {
            let notaFinal = getNotaEdit("final", legajo);
            notaFinal[0].value = averageFinal;
            legPromDone++;
            if (sendToServer) {
                notaFinal[0].focus();
                notaFinal[0].blur();
            }
        }

    }
    let t;
    t = "Se cargaron " + legPromDone + " notas finales.\n";
    if (!sendToServer) {
        t += "IMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue habilitado)";
    }
    alert(t);
}

// Esta funcion pone el promedio práctico para AM1
function ponerPromPracticoAM1Nuevo() {


    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    let legPromDone = 0;
    for (let i = 1; i < rows.length; i++) {
        //console.log(rows[i]);
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        //console.log(legajo);
        let promPractico = 0;

        let notasP = getNotasValidasNew(legajo, [1, 2, 3]);
        if (notasP[2] > 0) {
            // Si tengo recuperatorio, reemplazo la nota
            if (notasP[0] < notasP[1]) {
                notasP[0] = notasP[2];
            }
            else {
                notasP[1] = notasP[2];
            }
        }
        //console.log(notasP);
        if (notasP[0] >= 6 && notasP[1] >= 6) {
            promPractico = (notasP[0] + notasP[1]) / 2.0;
            let editProm = getNotaEdit(4, legajo);
            editProm[0].value = Math.round(promPractico);
            legPromDone++;
            if (sendToServer) {
                editProm[0].focus();
                editProm[0].blur();
            }
            //console.log("Prom Practico: " + promPractico);
        }
    }
    let t;
    t = "Se cargaron " + legPromDone + " promedios.\n";
    if (!sendToServer) {
        t += "IMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue habilitado)";
    }
    alert(t);
}

// Esta funcion pone el promedio práctico para AM2
function ponerPromPracticoAM2() {
    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    let legPromDone = 0;
    for (let i = 1; i < rows.length; i++) {
        //        console.log(rows[i]);
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        //        console.log(legajo);
        let promPractico = 0;

        let notasP = getNotasValidasNew(legajo, [1, 2, 3]);
        if (notasP[2] > 0) {
            // Si tengo recuperatorio, reemplazo la nota
            if (notasP[0] < notasP[1]) {
                notasP[0] = notasP[2];
            }
            else {
                notasP[1] = notasP[2];
            }
        }
        //        console.log(notasP);
        if (notasP[0] >= 6 && notasP[1] >= 6) {
            promPractico = (notasP[0] + notasP[1]) / 2.0;
            legPromDone++;
            //            console.log("Prom Practico: " + promPractico);
            if (sendToServer) {
                notasP[0].focus();
                notasP[0].blur();
            }
        }
    }
    let t;
    t = "Se cargaron " + legPromDone + " promedios.\n";
    if (!sendToServer) {
        t += "IMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue habilitado)";
    }
    alert(t);
}

// Esta funcion pone el promedio teórico para AM1
function ponerPromTeoricoAM1Nuevo() {
    let table = getTablaNotas();
    let rows = table.rows;
    //    console.log(rows);
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    let legPromDone = 0;
    for (let i = 1; i < rows.length; i++) {
        //        console.log(rows[i]);
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        //        console.log(legajo);
        let promTeorico = 0;
        let notasT = getNotasValidasNew(legajo, [6, 7, 8]);
        if (notasT[2] > 0) {
            // Si tengo recuperatorio, reemplazo la nota
            if (notasT[0] < notasT[1]) {
                notasT[0] = notasT[2];
            }
            else {
                notasT[1] = notasT[2];
            }
        }//        console.log(notasT);
        if (notasT[0] >= 6 && notasT[1] >= 6) {
            promTeorico = (notasT[0] + notasT[1]) / 2.0;
            let editTeor = getNotaEdit(9, legajo);
            editTeor[0].value = Math.round(promTeorico);
            //            console.log("Prom Teorico: " + promTeorico);
            legPromDone++;
            if (sendToServer) {
                editTeor[0].focus();
                editTeor[0].blur();
            }
        }
    }
    let t;
    t = "Se cargaron " + legPromDone + " promedios.\n";
    if (!sendToServer) {
        t += "IMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue habilitado)";
    }
    alert(t);
}

// Esta funcion pone el promedio teórico para AM2
function ponerPromTeoricoAM2() {
    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    let legPromDone = 0;
    for (let i = 1; i < rows.length; i++) {
        //        console.log(rows[i]);
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        //        console.log(legajo);
        let promTeorico = 0;
        let notasT = getNotasValidasNew(legajo, [4, 5, 6]);
        if (notasT[2] > 0) {
            // Si tengo recuperatorio, reemplazo la nota
            if (notasT[0] < notasT[1]) {
                notasT[0] = notasT[2];
            }
            else {
                notasT[1] = notasT[2];
            }
        }//        console.log(notasT);
        if (notasT[0] >= 6 && notasT[1] >= 6) {
            promTeorico = (notasT[0] + notasT[1]) / 2;
            //            console.log("Prom Teorico: " + promTeorico);
            legPromDone++;
            if (sendToServer) {
                notasT[0].focus();
                notasT[0].blur();
            }
        }
    }
    let t;
    t = "Se cargaron " + legPromDone + " promedios.\n";
    if (!sendToServer) {
        t += "IMPORTANTE: Las notas NO fueron enviadas a Autogestión (no fue habilitado)";
    }
    alert(t);
}

// Esta funcion pone la condición final para AM1
function ponerCondicionFinalAM1Nuevo() {
    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;

    for (let i = 1; i < rows.length; i++) {
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        let select = document.getElementById("cmdtmpestadoL" + legajo);
        if (select != null) {
            let notaFinal = getNotaEdit("final", legajo);
            /*
            0: Inscripto
            1: Libre
            2: Regular
            3: Promocionó
            4: Ap. Directa
           -1: Abandonó
           -2: No Cursó
            */
            if (notaFinal[0].value.length) {
                select.value = 4;// Ap Directa
            }
            else {

                let notasP = getNotasValidasNew(legajo, [1, 2, 3]);
                if (notasP[2] > 0) {
                    // Si tengo recuperatorio, reemplazo la nota
                    if (notasP[0] < notasP[1]) {
                        notasP[0] = notasP[2];
                    }
                    else {
                        notasP[1] = notasP[2];
                    }
                }

                let notasT = getNotasValidasNew(legajo, [6, 7, 8]);
                if (notasT[2] > 0) {
                    // Si tengo recuperatorio, reemplazo la nota
                    if (notasT[0] < notasT[1]) {
                        notasT[0] = notasT[2];
                    }
                    else {
                        notasT[1] = notasT[2];
                    }
                }

                // Los arrays notasP y notasT solo tienen 2 elementos, ya que si hubiera un recuperatorio, se reemplaza la nota mas baja
                //console.log(notasP);
                if (notasP[0] == 0 && notasP[1] == 0 && 
                    notasT[0] == 0 && notasT[1] == 0) {
                    // No rindio ningun parcial
                    select.value = -2; // No Cursó
                }
                else {
                    if (notasP[0] == 0 || notasP[1] == 0) {
                        // Si le falta alguna nota de parciales prácticos, es Abandonó (tener en cuenta que si llego hasta acá, es porque algo hizo)
                        select.value = -1;// Abandonó
                    }
                    //  Libre, Regular o Promociona TP
                    else if ((notasP[0] < 4 || notasP[1] < 4)) {
                        // Tiene al menos un  parcial práctico reprobado (ya teniendo en cuenta el recuperatorio)
                        select.value = 1; // Libre
                    }                     
                    else {
                        // Tiene al menos 2 notas >= a 4, veamos si tiene 2 notas >=6 para promocionar parte practica
                        if ((notasP[0] >= 6 && notasP[1] >= 6)) {
                            select.value = 3;// Promociona
                        }
                        else {
                            select.value = 2;// Regular
                        }
                    }
                }
            }
            if (sendToServer) {
                setTimeout(sendSelect, i * 10, select);
            }
        }
    }
}

// Esta funcion pone la condición final para AM2
function ponerCondicionFinalAM2() {
    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    for (let i = 1; i < rows.length; i++) {
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        let select = document.getElementById("cmdtmpestadoL" + legajo);
        if (select != null) {
            let notaFinal = getNotaEdit("final", legajo);
            /*
            0: Inscripto
            1: Libre
            2: Regular
            3: Promocionó
            4: Ap. Directa
           -1: Abandonó
            */
            if (notaFinal[0].value.length) {
                select.value = 4;// Ap Directa
            }
            else {

                let notasP = getNotasValidasNew(legajo, [1, 2, 3]);
                if (notasP[2] > 0) {
                    // Si tengo recuperatorio, reemplazo la nota
                    if (notasP[0] < notasP[1]) {
                        notasP[0] = notasP[2];
                    }
                    else {
                        notasP[1] = notasP[2];
                    }
                }

                let notasT = getNotasValidasNew(legajo, [4, 5, 6]);
                if (notasT[2] > 0) {
                    // Si tengo recuperatorio, reemplazo la nota
                    if (notasT[0] < notasT[1]) {
                        notasT[0] = notasT[2];
                    }
                    else {
                        notasT[1] = notasT[2];
                    }
                }

                // Los arrays notasP y notasT solo tienen 2 elementos, ya que si hubiera un recuperatorio, se reemplaza la nota mas baja
                if (notasP[0] == 0 && notasP[1] == 0 &&
                    notasT[0] == 0 && notasT[1] == 0) {
                    // No rindio ningun parcial
                    select.value = -2; // No Cursó
                }
                else {
                    // Abandonó, Libre, Regular o Promociona TP
                    if (notasP[0] == 0 || notasP[1] == 0) {
                        // Si le falta alguna nota del práctico, es Abandonó (tener en cuenta que si llega hasta acá, es porque algo tiene hecho)
                        select.value = -1;// Abandonó
                    }
                    else if ((notasP[0] < 6 || notasP[1] < 6)) {
                        // Tiene al menos un  parcial práctico reprobado (ya teniendo en cuenta el recuperatorio)
                        select.value = 1;// Libre?
                    }
                    else {
                        // Tiene al menos 2 notas >= a 6, en AM2 la condición es Regular (que quiere decir que promociona el práctico)
                        select.value = 2;// Regular
                    }
                }
            }
            if (sendToServer) {
                setTimeout(sendSelect, i * 10, select);
            }

        }
    }

}

function ponerCondicionFinalSistRep() {
    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    for (let i = 1; i < rows.length; i++) {
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        let select = document.getElementById("cmdtmpestadoL" + legajo);
        if (select != null) {
            let notaFinal = getNotaFromEdit(getNotaEdit("final", legajo));

            let notasTP = getNotasValidasNew(legajo, [1, 2, 3, 4, 6, 7, 8]);
            let notasP = getNotasValidasNew(legajo, [5, 9, 10]);

            let tpsNotEmpty = notasTP.every(n => n != 0);
            let tpsNotLess4 = notasTP.every(n => n >= 4);
            let parNotEmpty = notasP.every(n => n != 0);
            let parNotLess4 = notasP.every(n => n >= 4);

            if (notaFinal >= 6) {
                select.value = 4; // Ap Directa
            }
            else if (notaFinal >= 4 && tpsNotEmpty && tpsNotLess4 && parNotEmpty && parNotLess4) {
                select.value = 2; // Regular
            }
            else if (tpsNotEmpty && parNotEmpty) {
                select.value = 1; // Libre?
            }
            else if (tpsNotEmpty || parNotEmpty) {
                select.value = -1; // Abandono
            }
            else {
                select.value = -2; // No cursó
            }
            if (sendToServer) {
                setTimeout(sendSelect, i * 10, select);
            }
        }
    }

}

// Esta funcion pone la condición final para Fundamentos de Informática 2023
function ponerCondicionFinalFDI_C_2023() {
    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    for (let i = 1; i < rows.length; i++) {
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        let select = document.getElementById("cmdtmpestadoL" + legajo);
        if (select != null) {
            let notaFinal = getNotaEdit("final", legajo);
            /*
            0: Inscripto
            1: Libre
            2: Regular
            3: Promocionó
            4: Ap. Directa
           -1: Abandonó
            */
            if (notaFinal[0].value.length) {
                select.value = 4;// Ap Directa
            }
            else {

                let notasP = getNotasValidasNew(legajo, [1, 2, 4, 3]);
                if (notasP[3] > 0) {
                    if (notasP[0] < notasP[1]) {
                        notasP[0] = notasP[3];
                    }
                    else {
                        notasP[1] = notasP[3];
                    }

                }


                // notasP y notasT solo tienen 2 elementos, ya que si hubiera un recuperatorio, se reemplaza la nota mas baja
                if (notasP[0] == 0 && notasP[1] == 0) {
                    select.value = -2; // No cursó
                }
                else {
                    // Abandonó, Libre, Regular o Promociona TP
                    if (notasP[0] == 0 || notasP[1] == 0) {
                        select.value = -1; // Abandonó
                    }
                    else if (notasP[0] >= 6 && notasP[1] >= 6) {
                        // Tiene al menos un  parcial reprobado (ya teniendo en cuenta el recuperatorio)
                        select.value = 3;// Promocion
                    }
                    else {
                        if (notasP[0] < 4 || notasP[1] < 4) {
                            // Tiene al menos un  parcial reprobado (ya teniendo en cuenta el recuperatorio)
                            select.value = 1;// Libre?
                        }
                        else {
                            // Tiene al menos 2 notas mayores a 6, en AM2 la condición es Regular (que quiere decir que promociona el práctico)
                            select.value = 2;// Regular
                        }
                    }

                }
            }
            if (sendToServer) {
                setTimeout(sendSelect, i * 10, select);
            }

        }
    }

}

// Esta funcion pone la condición final para Informática 2
function ponerCondicionFinalInfo2() {

    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    for (let i = 1; i < rows.length; i++) {
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        let select = document.getElementById("cmdtmpestadoL" + legajo);
        if (select != null) {

            /*
            Y tengo dividido en 7 columnas. 5 prácticos las primeras y la 6 y 7 son el primer y segundo parcial

            Hago un promedio de los prácticos y de los parciales por separado, y después hago un promedio entre esos 2 promedios. 
            Si tienen TODAS las instancias de evaluación aprobadas (+6) y me da más de 7,5 en prácticos y también en parciales, les doy Aprobación directa. 
            Entre 6 y 7,5 quedan regulares (+TODO aprobado). 
            Si usaron todas las instancias de evaluación y tienen alguna NO aprobada, quedan LIBRES. 
            Si tienen UNA cualquiera de las instancias de evaluación NO PRESENTADAS, quedan en condición de ABANDONÓ.
            */
            let todoAprobado = true;    // Por ahora, supongo que aprobó todas las instancias (lo vamos a chequear)
            let promPractico = 0;       // Promedio de prácticos (se calcula)
            let promParciales = 0;      // Promedio de parciales (se calcula)
            let ausente = false;        // Aca indico si tuvo alguna instancia ausente

            // Obtengo las notas de los prácticos
            for (let i = 1; i <= 5; i++) {
                let p = getNotaEdit(i, legajo);
                let nota = 0;
                if (p[0].value.length) {
                    nota = parseInt(p[0].value);
                }
                else {
                    //                    nota = 0;
                    ausente = true;
                }

                if (nota < 6) {
                    todoAprobado = false;
                }
                promPractico += nota;
            }
            // Calculo el promedio
            promPractico /= 5.0;

            // Obtengo las notas de los prácticos
            for (let i = 6; i <= 7; i++) {
                let p = getNotaEdit(i, legajo);
                let nota = 0;
                if (p[0].value.length) {
                    nota = parseInt(p[0].value);
                }
                else {
                    //                    nota = 0;
                    ausente = true;
                }

                if (nota < 6) {
                    todoAprobado = false;
                }
                promParciales += nota;
            }
            // Calculo el promedio
            promParciales /= 2.0;

            // Ahora calculo la condicion:
            if (todoAprobado) {

                if ((promParciales >= 7.5) && (promPractico >= 7.5)) {
                    select.value = 4;   // Ap Directa

                    let notaFinal = getNotaEdit("final", legajo);
                    notaFinal[0].value = Math.round((promParciales + promPractico) / 2);
                    if (sendToServer) {
                        notaFinal[0].focus();
                        notaFinal[0].blur();
                    }

                }
                else if ((promParciales >= 6) && (promPractico >= 6)) {
                    select.value = 2;   // Regular
                }
                else {
                    // Este caso no se puede dar, porque si está todo aprobado los promedios son necesariamente >= 6
                }
            }
            else {
                if (ausente) {
                    select.value = -1;  // Abandono
                }
                else {
                    select.value = 1;   // Libre
                }
            }

            if (sendToServer) {
                setTimeout(sendSelect, i * 10, select);
            }
        }

    }   // del for

}

// Esta funcion pone la condición final para Sistemas de Representación en Industrial
function ponerCondicionFinalSistRepIndus() {

    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    for (let i = 1; i < rows.length; i++) {
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        let select = document.getElementById("cmdtmpestadoL" + legajo);
        if (select != null) {

            let todoAprobado = true;    // Por ahora, supongo que aprobó todas las instancias (lo vamos a chequear)
            let promPractico = 0;       // Promedio de prácticos (se calcula)
            let promParciales = 0;      // Promedio de parciales (se calcula)
            let abandono = true;        // Por ahora, supongo que abonodono (se chequea)

            // Obtengo las notas de los prácticos
            for (let i = 1; i <= 3; i++) {
                let p = getNotaEdit(i, legajo);
                let nota = 0;
                if (p[0].value.length) {
                    nota = parseInt(p[0].value);
                    if (i > 1) {
                        abandono = false;
                    }
                }
                else {
                    //                    nota = 0;
                }

                if (nota < 6) {
                    todoAprobado = false;
                }

                promPractico += nota;
            }
            // Calculo el promedio
            promPractico /= 3.0;

            // Obtengo las notas de los prácticos
            for (let i = 4; i <= 5; i++) {
                let p = getNotaEdit(i, legajo);
                let nota = 0;
                if (p[0].value.length) {
                    nota = parseInt(p[0].value);
                    if (i > 4) {
                        abandono = false;
                    }
                }
                else {
                    //                    nota = 0;
                }

                if (nota < 6) {
                    todoAprobado = false;
                }
                promParciales += nota;
            }
            // Calculo el promedio
            promParciales /= 2.0;

            // Ahora calculo la condicion:
            if (todoAprobado) {

                if ((promParciales >= 7.5) && (promPractico >= 7.5)) {
                    select.value = 4;   // Ap Directa

                    let notaFinal = getNotaEdit("final", legajo);
                    notaFinal[0].value = Math.round((promParciales + promPractico) / 2);
                    if (sendToServer) {
                        notaFinal[0].focus();
                        notaFinal[0].blur();
                    }

                }
                else if ((promParciales >= 6) && (promPractico >= 6)) {
                    select.value = 2;   // Regular
                }
                else {
                    // Este caso no se puede dar, porque si está todo aprobado los promedios son necesariamente >= 6
                }
            }
            else {
                if (abandono) {
                    select.value = -1;  // Abandono
                }
                else {
                    select.value = 1;   // Libre
                }
            }

            if (sendToServer) {
                setTimeout(sendSelect, i * 10, select);
            }
        }

    }   // del for
}

// Esta funcion pone la condición final para Pensamiento Sistémico
function ponerCondicionFinalPenSis() {
    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;
    for (let i = 1; i < rows.length; i++) {
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        let select = document.getElementById("cmdtmpestadoL" + legajo);
        if (select != null) {

            /*
            Ap directa: ((P1>=8 && P2>=8) || ((P1>=8 || P2>=8) && Rec>=8)) && (TP>=8)                    
            Regular:    ((P1>=6 && P2>=6) || ((P1>=6 || P2>=6) && Rec>=6)) && (TP>=6)
            Libre:      (Rec<>"")
            Abandonó:   (Rec="")
            */


            let notas = getNotasValidasNew(legajo, [1, 2, 3, 4]);
            // notas[0] y notas[1] tienen los parciales 1 y 2 respectivamente
            // notas[2] es el TP
            // notas[3] es el Recuperatorio
            if (notas[0] == 0 && notas[1] == 0 && notas[2] == 0 && notas[3] == 0) {
                select.value = -2; // No cursó
            }
            else if (((notas[0] >= 8 && notas[1] >= 8) || ((notas[0] >= 8 || notas[1] >= 8) && notas[3] >= 8)) && (notas[2] >= 8)) {
                select.value = 4;// Ap Directa
            }
            else if (((notas[0] >= 6 && notas[1] >= 6) || ((notas[0] >= 6 || notas[1] >= 6) && notas[3] >= 6)) && (notas[2] >= 6)) {
                select.value = 2;// Regular
            }
            else if (notas[2] != 0) {
                select.value = 1;// Libre?
            }
            else {
                select.value = -1;// Abandono
            }

            if (sendToServer) {
                setTimeout(sendSelect, i * 10, select);
            }
        }
    }
}

/* Esta funcion pone la condición final para las materias Física 1 y 2 según:
Las notas que deben cargar los docentes son: 
Columna 1: Primer parcial
Columna 2: Segundo Parcial
Columna 3: Trabajo práctico de laboratorio 1
Columna 4: Trabajo práctico de laboratorio 2
Columna 5: Trabajo práctico de laboratorio 3
Columna 6: Trabajo práctico de laboratorio 4 
Las condiciones académicas que se pueden asignar son: 
Abandonó: Ésta condición se coloca cuando no hay notas en la columna 1 y 2 
Regular: El alumno debe tener nota 6 o más en las columnas 3, 4, 5 y 6 y nota mayor o igual a 4 en las columnas 1 y 2 
         pero menor a 6 en alguna de las columnas 1 y 2. 
Ap. Directa: El alumno debe tener nota 6 o más en todas las columnas 
Libre: Si tiene alguna nota en las columnas 1 y 2 pero no cumple ninguna de las condiciones académicas anteriores. 
NOTA FINAL
Si la condición es Ap. Directa entonces se puede cargar la nota final que surge del promedio de las notas de las columnas 1 y 2.
*/
function ponerCondicionFinalFisica() {
    let table = getTablaNotas();
    let rows = table.rows;
    let sendToServer = document.getElementById("cbSendToServerCondiciones").checked;

    for (let i = 1; i < rows.length; i++) {
        let legajo = rows[i].cells[0].childNodes[0].innerHTML;
        let select = document.getElementById("cmdtmpestadoL" + legajo);
        if (select != null) {

            let notasP  = getNotasValidasNew(legajo, [1, 2]);
            let notasTP = getNotasValidasNew(legajo, [3, 4, 5, 6]);
     
            if (notasP.every(n => n == 0) ) {
                // No rindio ningun parcial
                if (notasTP.every(n => n == 0)) {
                    // Tampoco hizo ningun TP
                    select.value = -2; // No cursó
                }
                else {
                    // Tiene al menos un TP hecho
                    select.value = -1; // Abandono
                }
            }
            else {
                // Tiene al menos un parcial rendido

                if (notasTP.filter(n => n >= 6).length >= 3) {
                    // al menos 3 de 4 TPs aprobados 
                    if (notasP.every(n => n >=4)) {
                        // Todos los parciales >= 4 (o sea aprobados)
                        if (notasP.some(n => n < 6)) {
                            // Algun parcial tiene nota 4 o 5
                            select.value = 2; // Regular
                        }
                        else {
                            // Todos los parciales con nota >=6
                            select.value = 4; // Ap Directa

                            // Solo en este caso, también se pone la nota final:
                            let notaFinal = getNotaEdit("final", legajo);

                            notaFinal[0].value = Math.round((notasP[0] + notasP[1]) / 2);
                            if (sendToServer) {
                                notaFinal[0].focus();
                                notaFinal[0].blur();
                            }
                        }    
                    }
                    else {
                        // Algún parcial no está aprobado (nota < 4)
                        select.value = 1; // Libre
                    }
                }
                else {
                    // Tiene más de 1 TP reprobado
                    select.value = 1; // Libre
                }
            }

            if (sendToServer) {
                setTimeout(sendSelect, i * 10, select);
            }
        }
    }
}

// Esta funcion cambia las tablas que muestran las opciones de esta herramienta
function onOpcionChange(event) {
    let opt = document.getElementById("opciones").selectedOptions[0];
    let tablaMostrar = opt.dataset.tabla;

    // Todas las tablas posibles
    let tablas = ["tblCargaNotas", "tblCargaCondicion"];

    // Ocultar todas
    tablas.forEach(id => {
        document.getElementById(id).style.display = "none";
    });

    // Mostrar solo la seleccionada (si existe)
    if (tablaMostrar) {
        document.getElementById(tablaMostrar).style.display = "table-cell";
    }
}

// Esta funcion cambia las tablas que muestran las opciones para cada materia
function onMateriaChange() {
    const sel = document.getElementById("materiaCondicion"); // el ID de tu <select>
    let opt = sel.selectedOptions[0];
    let mat = materias[opt.dataset.index];

    // Ocultar todos los botones
    Object.values(allButtons).forEach(id => {
        document.getElementById(id).style.display = "none";
    });

    // Mostrar solo los botones definidos en la materia
    Object.keys(mat.botones).forEach(b => {
        document.getElementById(allButtons[b]).style.display = "inline";
    });
}

/// Esta funcion llama a la funcion de cada boton
function ejecutarBoton(tipo, event) {
    event.preventDefault();// Para que no haga submit del form

    const sel = document.getElementById("materiaCondicion"); // el ID de tu <select>
    let opt = sel.selectedOptions[0];
    let mat = materias[opt.dataset.index];

    if (!mat.botones[tipo]) {
        alert("Este botón no está implementado para esta materia");
        return;
    }

    mat.botones[tipo](); // ejecutar la función asociada
}

/// Esta funcion crea los items del select para elegir donde se cargan notas
function createSelectForColumns(id) {
    let select = document.createElement("SELECT");
    select.setAttribute("id", id);
    select.setAttribute("value", "");
    for (let i = 1; i <= 10; i++) {
        let c = document.createElement("option");
        c.text = i;
        select.options.add(c);
    }
    c = document.createElement("option");
    c.text = "Nota Final";
    select.options.add(c);

    return select;
}

// Esta funcion crea toda la UI
function setupUi() {

    let table = document.getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName('tbody')[0];
    // Voy a insertar unas filas:
    let row = 4;
    let newRow = tbody.insertRow(row++);
    let newCell;
    let btn;

    // Inicio de Header
    newCell = newRow.insertCell(0);
    newCell.innerHTML = 'Carga de Notas y Condición Académica v' + GM_info.script.version + ' - desarrollado por Leonardo Giordano';
    newCell.setAttribute('colspan', '4');
    newCell.setAttribute('style', 'text-align:center; font-weight:bold; background-color:#E0FFDB');
    //newCell.appendChild(newText);

    newRow = tbody.insertRow(row++);
    newCell = newRow.insertCell(0);
    newCell.innerHTML = '';
    newCell.setAttribute("style", "text-align:right");
    newCell = newRow.insertCell(1);
    newCell = newRow.insertCell(2);
    // Fin de Header

    // Opciones
    newRow = tbody.insertRow(row++);
    newCell = newRow.insertCell(0);
    newCell.innerHTML = 'Opciones:';
    newCell.setAttribute("style", "text-align:right");
    newCell = newRow.insertCell(1);
    newCell = newRow.insertCell(2);

    newCell.setAttribute("style", "text-align:left");

    let select = document.createElement("SELECT");
    select.id = "opciones";

    // Opciones con metadata
    let opciones = [
        { text: "Cargar notas", tabla: "tblCargaNotas" },
        { text: "Cargar condición académica", tabla: "tblCargaCondicion" }
        // { text: "Cargar promedio", tabla: "tblCargaPromedio" }   <-- futuro
    ];

    // Crear <option> con data-tabla
    opciones.forEach(o => {
        let c = document.createElement("option");
        c.text = o.text;
        c.dataset.tabla = o.tabla;   // <<--- acá queda asociado
        select.options.add(c);
    });

    select.addEventListener("change", onOpcionChange);
    newCell.appendChild(select);
    // Fin de Opciones

    // Tabla para Carga de notas

    const style = document.createElement('style');
    style.innerHTML = `
        .myTable {
            border-collapse: collapse;
        }

        .myTable td,tr {
            text-align: center;
            vertical-align: middle;
            border: 1px solid black;
            border-collapse: collapse;
            padding:5px;
            }
    `;
    document.head.appendChild(style);
    newRow = tbody.insertRow(row++);
    newCell = newRow.insertCell(0);
    newCell = newRow.insertCell(1);
    newCell = newRow.insertCell(2);

    let tbl = document.createElement('table');
    tbl.setAttribute("id", "tblCargaNotas");
    tbl.setAttribute("class", "myTable");
    //tbl.style.width = '100px';
    //    tbl.style.border = '1px solid black';

    {
        const tr = tbl.insertRow();
        {
            const td = tr.insertCell();
            td.innerHTML = "<B>Paso 1</B>";
        }
        {
            const td = tr.insertCell();
            btn = document.createElement("BUTTON");
            btn.innerHTML = "Importar Legajos/Notas";
            btn.addEventListener("click", onCopiarLegajos);
            td.appendChild(btn);
        }
        {
            const td = tr.insertCell();
            td.setAttribute('colSpan', '3');
            td.setAttribute("id", "stsMsg");
            td.innerHTML = "No hay Legajos/Notas importados para procesar";
        }
    }

    {
        const tr = tbl.insertRow();
        {
            const td = tr.insertCell();
            td.innerHTML = "<B>Paso 2</B>";
        }
        {
            const td = tr.insertCell();
            btn = document.createElement("BUTTON");
            btn.innerHTML = "Controlar Legajos";
            btn.setAttribute("id", "btnCheckLeg");
            btn.addEventListener("click", onVerificarLegajos);
            btn.disabled = true;
            td.appendChild(btn);
        }
        {
            const td = tr.insertCell();
            td.setAttribute('colSpan', '3');
            td.setAttribute("id", "controlMsg");
            td.innerHTML = "";
        }

    }

    {
        const tr = tbl.insertRow();
        {
            const td = tr.insertCell();
            td.innerHTML = "<B>Paso 3</B>";
        }
        {
            const td = tr.insertCell();
            td.innerHTML = "Columna: "
            td.appendChild(createSelectForColumns("columnaCargaControl"));
        }
        {
            const td = tr.insertCell();
            btn = document.createElement("BUTTON");
            btn.innerHTML = "Controlar Notas";
            btn.setAttribute("id", "btnCheckNot");
            btn.setAttribute("style", "margin:5px");
            btn.addEventListener("click", onVerificarNotas);
            btn.disabled = true;
            td.appendChild(btn);
        }
        {
            const td = tr.insertCell();
            btn = document.createElement("BUTTON");
            btn.innerHTML = "Cargar Notas";
            btn.setAttribute("id", "btnProcess");
            btn.setAttribute("style", "margin:5px");
            btn.addEventListener("click", onCargarNotas);
            btn.disabled = true;
            td.appendChild(btn);

        }
        {
            const td = tr.insertCell();
            let x = document.createElement("INPUT");
            td.innerHTML = "Enviar a Autogestión:";
            x.setAttribute("type", "checkbox");
            x.setAttribute("id", "cbSendToServer");
            td.appendChild(x);
            // let newText;
            // newText = document.createTextNode('Enviar a Autogestión');
            // newCell.appendChild(newText);
        }
    }

    newCell.appendChild(tbl);

    newRow = tbody.insertRow(row++);
    newCell = newRow.insertCell(0);
    newCell = newRow.insertCell(1);
    newCell = newRow.insertCell(2);

    /*
    tbl = document.createElement('table');
    tbl.setAttribute("id", "tblCargaPromedio");
    tbl.setAttribute("class", "myTable");
    //tbl.style.width = '100px';
//    tbl.style.border = '1px solid black';

    {
        const tr = tbl.insertRow();
        {
            const td = tr.insertCell();
            td.innerHTML = "Columnas para el cálculo";
        }
        for (let i = 1; i <= 10; i++) {
            const td = tr.insertCell();
            td.innerHTML = "Col " + i;
            let x = document.createElement("INPUT");
            x.setAttribute("type", "checkbox");
            x.setAttribute("id", "promCol"+i);
            td.appendChild(x);
        }
    }
    {
        const tr = tbl.insertRow();
        {
            const td = tr.insertCell();
//            td.innerHTML = "Columna donde se carga el promedio";
        }
        {
            const td = tr.insertCell();
            td.innerHTML = "Columna donde se carga el promedio:";
            td.style.textAlign = "left";
            td.setAttribute('colSpan', '6');
            let select = createSelectForColumns("columnaCargaPromedio");
            td.appendChild(select);
        }

        {
            const td = tr.insertCell();
            td.setAttribute('colSpan', '2');
            btn = document.createElement("BUTTON");
            btn.innerHTML = "Cargar Promedio";
            btn.setAttribute("id", "btnCargarPromedio");
            btn.setAttribute("style", "margin:5px");
            btn.disabled = true;
            btn.addEventListener("click", onCargarPromedio);
            td.appendChild(btn);

        }
        {
            const td = tr.insertCell();
            td.setAttribute('colSpan', '2');

            let x = document.createElement("INPUT");
            td.innerHTML = "Enviar a Autogestión:";
            x.setAttribute("type", "checkbox");
            x.setAttribute("id", "cbSendToServerPromedio");
            td.appendChild(x);
            // let newText;
            // newText = document.createTextNode('Enviar a Autogestión');
            // newCell.appendChild(newText);

        }
    }
    /*
    {
        const tr = tbl.insertRow();
        {
            const td = tr.insertCell();
        }
        {
            const td = tr.insertCell();
            btn = document.createElement("BUTTON");
            btn.innerHTML = "Cargar Promedio";
            btn.setAttribute("id", "btnProcess");
            btn.setAttribute("style", "margin:5px");
            btn.addEventListener("click", onCargarPromedio);
            btn.disabled = true;
            td.appendChild(btn);

        }
        {
            const td = tr.insertCell();
            let x = document.createElement("INPUT");
            td.innerHTML = "Enviar a Autogestión:";
            x.setAttribute("type", "checkbox");
            x.setAttribute("id", "cbSendToServerPromedio");
            td.appendChild(x);
            // let newText;
            // newText = document.createTextNode('Enviar a Autogestión');
            // newCell.appendChild(newText);

        }
    }
    
    newCell.appendChild(tbl);
    */


    newRow = tbody.insertRow(row++);
    newCell = newRow.insertCell(0);
    newCell = newRow.insertCell(1);
    newCell = newRow.insertCell(2);

    tbl = document.createElement('table');
    tbl.setAttribute("id", "tblCargaCondicion");
    tbl.setAttribute("class", "myTable");

    {
        const tr = tbl.insertRow();
        {
            const td = tr.insertCell();
            td.innerHTML = "Materia";
        }
        {
            const td = tr.insertCell();
            td.style.textAlign = "left";



            select = document.createElement("SELECT");
            select.id = "materiaCondicion";
            materias.forEach((m, idx) => {
                let c = document.createElement("option");
                c.text = m.text;
                c.dataset.index = idx; // guardamos índice
                select.options.add(c);
            });

            select.addEventListener("change", onMateriaChange);
            td.appendChild(select);

        }
        {
            const td = tr.insertCell();
            let x = document.createElement("INPUT");
            td.innerHTML = "Enviar a Autogestión:";
            x.setAttribute("type", "checkbox");
            x.setAttribute("id", "cbSendToServerCondiciones");
            td.appendChild(x);
        }

    }

    {
        const tr = tbl.insertRow();
        {
            const td = tr.insertCell();
            td.innerHTML = "Opciones";
        }
        {
            const td = tr.insertCell();
            td.setAttribute('colSpan', '2');

            btn = document.createElement("BUTTON");
            btn.innerHTML = "Cargar Promedio Práctico";
            btn.id = allButtons.practico; 
            btn.style.margin = "5px";
            btn.addEventListener("click", e => ejecutarBoton("practico", e));
            td.appendChild(btn);

            btn = document.createElement("BUTTON");
            btn.innerHTML = "Cargar Promedio Teórico";
            btn.id = allButtons.teorico;
            btn.style.margin = "5px";
            btn.addEventListener("click", e => ejecutarBoton("teorico", e));
            td.appendChild(btn);

            btn = document.createElement("BUTTON");
            btn.innerHTML = "Cargar Nota Final";
            btn.id = allButtons.final;
            btn.style.margin = "5px";
            btn.addEventListener("click", e => ejecutarBoton("final", e));
            td.appendChild(btn);

            btn = document.createElement("BUTTON");
            btn.innerHTML = "Cargar Condición Académica";
            btn.id = allButtons.cond;
            btn.style.margin = "5px";
            btn.addEventListener("click", e => ejecutarBoton("cond", e));
            td.appendChild(btn);

        }
    }
    newCell.appendChild(tbl);



    onOpcionChange();
    // Para que queden los botones de acuerdo al select:
    onMateriaChange();

}

console.log("Carga de Notas - Ing. Leonardo Giordano");
setupUi();

