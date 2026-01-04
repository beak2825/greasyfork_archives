// ==UserScript==
// @name         Notificador de nuevas materias
// @namespace    tampermonkey.com
// @include      https://autogestion.guarani.unc.edu.ar/cursada
// @version      0.1.1
// @description  Chequear si nuevas materias estan disponibles en SIU Guarani
// @author       LautronB
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441156/Notificador%20de%20nuevas%20materias.user.js
// @updateURL https://update.greasyfork.org/scripts/441156/Notificador%20de%20nuevas%20materias.meta.js
// ==/UserScript==
function getFromStorage(id, promptStr, default_){
    let result = window.localStorage.getItem(id)
    if (!result) {
        result = prompt(promptStr, default_)
        window.localStorage.setItem(id, result)
    }
    return parseInt(result)
}

(function() {
    'use strict';

    // Your code here...

    let notifsAvailable;
    console.log(`To delete config please use:
    localStorage.removeItem('checkingTimeout');
    localStorage.removeItem('initialAmount');`)
    try {
      notifsAvailable = true;
      Notification.requestPermission().then();
    } catch(e) {
      console.log("Notifications not available");
      notifsAvailable = false;
    }

  function checkMaterias(currentValue) {
      let materias = document.getElementsByClassName("nav nav-list")[0].childElementCount
      let notification;
      if (materias > currentValue) {
	      notification = notifsAvailable ? new Notification('Nuevas materias disponibles') : alert("Nuevas materias disponibles");
      } else {
          notification = new Notification('No hay nuevas materias aun');
          location.reload(true)
      }
 }
    setTimeout(() => {
        let timeout = getFromStorage("checkingTimeout", "Cada cuantos minutos chequear si hay nuevas materias?", 3600)
        console.log("Se comenzó a observar si hay nuevas materias cada " + timeout + " minutos");
        let initialAmount = getFromStorage("initialAmount", "Cuantas materias aparecen actualmente?", 8)
        setInterval(() => checkMaterias(initialAmount), timeout * 60 * 100)
    }, 5000)
})();