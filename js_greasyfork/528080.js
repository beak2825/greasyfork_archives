// ==UserScript==
//
// @name         Cuandollega
// @license      MIT
// @namespace    http://mardelplata.gob.ar
// @version      2024-03-01
// @description  Agrega boton de favoritos a cuando llega
// @author       You
// @match        https://appsl.mardelplata.gob.ar/app_cuando_llega/cuando.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gob.ar
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/528080/Cuandollega.user.js
// @updateURL https://update.greasyfork.org/scripts/528080/Cuandollega.meta.js
// ==/UserScript==

(function () {
  "use strict"

  var trashIcon = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="20px" height="20px" viewBox="0 0 16 16" fill="red" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 8L6 2H16V14H6L0 8ZM6.79289 6.20711L8.58579 8L6.79289 9.79289L8.20711 11.2071L10 9.41421L11.7929 11.2071L13.2071 9.79289L11.4142 8L13.2071 6.20711L11.7929 4.79289L10 6.58579L8.20711 4.79289L6.79289 6.20711Z" fill="#000000"/>
</svg>`

  //Form elements
  const linea = document.querySelector("#Slineas")
  const calle = document.querySelector("#ScallesInt")
  const interseccion = document.querySelector("#ScallesPrinc")
  const parada = document.querySelector("#Sparadas")
  const queryBtn = document.querySelector('#a_actualizar')

  const container = document.querySelector("div.container")
  const containerToCorrect = document.querySelector(".containe-fluid")
  const footer = document.querySelector("footer")

  const divFormGroupNode = document.createElement("div")
  const anchorBtnToggleNode = document.createElement("a")
  const ulNode = document.createElement("ul")
  const divBtnGroupNode = document.createElement('div')
  const buttonSaveNode = document.createElement("button");

  // getting rid of the useless instrucctions dropdown
  document.querySelector("#fader").remove()
  document.querySelector("#fade").remove()
  document.querySelector(".header").after(containerToCorrect)

  // correct the placement of nodes in the DOM
  containerToCorrect.classList = "container-fluid"
  containerToCorrect.after(footer)

  ulNode.classList = "list-group collapse"
  ulNode.id = "collapsable"
  anchorBtnToggleNode.classList = "btn btn-success collapsed"
  anchorBtnToggleNode.setAttribute("href", "#collapsable")
  anchorBtnToggleNode.setAttribute("data-toggle", "collapse")
  anchorBtnToggleNode.innerText = "Favoritos ▼"
  //TODO: close list group on focus lost
  anchorBtnToggleNode.addEventListener("onblur", () => anchorBtnToggleNode.classList.add("collapsed"))

  buttonSaveNode.innerHTML = "⭐"
  buttonSaveNode.classList = "btn btn-info";

  //TODO: Disable the saveButton depending on the context
  // if (
  // 	Slineas.value === "-1" ||
  // 	Slineas.value === "" ||
  // 	ScallesPrinc.value === "-1" ||
  // 	ScallesPrinc.value === "" ||
  // 	ScallesInt.value === "-1" ||
  // 	ScallesInt.value === ""
  // ) {
  // 	favBtn.setAttribute('disabled', "")
  // } else {
  // 	favBtn.removeAttribute('disabled')
  // }


  divFormGroupNode.classList = "form-group"
  divFormGroupNode.append(anchorBtnToggleNode)
  container.prepend(divFormGroupNode, ulNode)
  divBtnGroupNode.classList = "btn-group container-fluid"

  buttonSaveNode.addEventListener("click", () => {
    localStorage.setItem(localStorage.length, JSON.stringify({
      bus: { bus: linea.options[linea.selectedIndex].text, value: linea.value },
      mainST: { street: interseccion.options[interseccion.selectedIndex].text, value: interseccion.value },
      intersection: { street: calle.options[calle.selectedIndex].text, value: calle.value },
      stop: { stop: parada.options[parada.selectedIndex].text, value: parada.value }
    }))
    loadFavorites()
  });

  divBtnGroupNode.appendChild(queryBtn)
  divBtnGroupNode.appendChild(buttonSaveNode)
  container.appendChild(divBtnGroupNode);

  loadFavorites();

  function loadFavorites() {
    ulNode.textContent = ''
    for (let i = 0; i < localStorage.length; i++) {
      const element = JSON.parse(localStorage[localStorage.key(i)]);

      let liNode = document.createElement("li");
      let text = document.createElement("div");

      // text.innerHTML = localStorage.key(i);
      text.addEventListener("click", async () => {
        getBus(element.bus.value, element.stop.value)
      });

      let delBtn = document.createElement("div")
      // delBtn.classList = "btn btn-danger"
      delBtn.innerHTML = trashIcon
      delBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        localStorage.removeItem(localStorage.key(i))
        loadFavorites()
      })
      delBtn.addEventListener('mouseover', () => {
        delBtn.style.outline = 'red'
      })
      liNode.classList = "list-group-item list-group-item-action"
      liNode.style.display = "flex"
      liNode.style.justifyContent = "space-between"

      text.textContent = `${element.bus.bus} -> ${element.stop.stop}`
      text.style.cursor = 'pointer'
      liNode.appendChild(text)
      liNode.appendChild(delBtn)
      // liNode.insertAdjacentElement("beforeend", delBtn)
      ulNode.appendChild(liNode);
    }

    if (ulNode.childElementCount == 0) {
      ulNode.insertAdjacentHTML('beforeend', "<li class='list-group-item'>No hay favoritos</li>")
    }
  }

  async function getBus(codigoLineaParada = 110, identificadorParada = P2417,) {
    let x = await fetch("https://appsl.mardelplata.gob.ar/app_cuando_llega/webWS.php", {
      "credentials": "include",
      "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.7,es-AR;q=0.3",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Sec-GPC": "1",
        "Priority": "u=0",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
      },
      "referrer": "https://appsl.mardelplata.gob.ar/app_cuando_llega/cuando.php",
      "body": `accion=RecuperarProximosArribosW&identificadorParada=${identificadorParada}&codigoLineaParada=${codigoLineaParada}`,
      "method": "POST",
      "mode": "cors"
    })

    x.json().then(y => {
      var table = document.querySelector("#t_arribo")
      table.textContent = ''
      console.log(y)
      if (y.CodigoEstado === -1) {
        $.confirm({
          content: y.MensajeEstado,
          title: false,
          type: "red",
          backgroundDismiss: true,
          buttons: {
            Aceptar: {
              btnClass: 'btn-danger',
              action: function () {
              }
            }
          }
        })
        return
      }
      for (var i = 0; i < y.arribos.length; i++) {

        var tableRow = document.createElement('tr')
        var ramal = document.createElement('td')
        var arribo = document.createElement('td')

        ramal.textContent = y.arribos[i].DescripcionBandera
        arribo.textContent = y.arribos[i].Arribo


        tableRow.appendChild(ramal)
        tableRow.appendChild(arribo)

        table.appendChild(tableRow)
      }
      table.parentNode.classList.add('mostrarTabla')
    })
  }



})();