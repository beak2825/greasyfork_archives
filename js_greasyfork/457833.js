// ==UserScript==
// @name         trolloscript osu! profile beatmaps downloader
// @namespace    https://osu.ppy.sh/users/9228032
// @version      0.3.1.3
// @description  download all the ranked/gd/pending/graveyard beatmaps by a user
// @author       trollocat
// @match        http://osu.ppy.sh/users/*
// @match        https://osu.ppy.sh/users/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457833/trolloscript%20osu%21%20profile%20beatmaps%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/457833/trolloscript%20osu%21%20profile%20beatmaps%20downloader.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /////////////
  // constantes
  const beatmapTitulos = [
    "Favourite",
    "Ranked",
    "Loved",
    "Guest",
    "Pending",
    "Graveyard",
    "Nominated",
  ];
  // fin constantes
  /////////////////

  // helper function
  const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };

  const getBeatmapsPanel = () => {
    // agarrar el panel de Beatmaps
    const paneles = document.getElementsByClassName(
      "js-switchable-mode-page--scrollspy"
    );
    for (let i = 0; i < paneles.length; i++) {
      if (paneles[i].dataset.pageId === "beatmaps") {
        return paneles[i];
      }
    }
  };

  const buscarLinks = (index) => {
    // funcion que busca genericamente todos los links en el arrayTitulo[index] que le digas (ranked, pending, gd, etc)
    // y devuelve un array con los link mirrors listos para descargar

    const beatmapsPanel = getBeatmapsPanel();

    const arrayTitulos = beatmapsPanel.getElementsByClassName(
      "title--page-extra-small"
    );

    let beatmapsTitle = arrayTitulos[index];
    let cantidadDeMapas = arrayTitulos[index].innerText.split("Beatmaps")[1]; // el numerito de cantidad de mapas de X Beatmaps

    if (cantidadDeMapas == 0) return [];

    // lo siguiente al titulo X Beatmaps, o sea toda la lista de mapas, y me guardo todos los tag "a" (links)
    let arrayDeAs = Array.from(
      beatmapsTitle.nextElementSibling.getElementsByTagName("a")
    );

    // solo quiero la propiedad href guardada en el array
    let arrayDeHrefs = arrayDeAs.map((a) => a.href);

    // filtro los elementos para que Sí tengan formato de link de beatmap y No terminen en /download
    let arrayDeHrefsSeleccionados = arrayDeHrefs.filter(
      (href) =>
        href.startsWith("https://osu.ppy.sh/beatmapsets/") &&
        !href.endsWith("/download")
    );

    // lo filtro de vuelta para remover duplicados
    let arrayDeHrefsUnicos = removeDuplicates(arrayDeHrefsSeleccionados);

    // ahora sí creo links con los beatmapsetID en los mirrors :3
    let arraySayoNeriChimu = arrayDeHrefsUnicos.map((link, i) => {
      // uso i para crear un patrón alternado entre los 3 mirror servers
      switch (i%3) {
        case 0:
          // nerinyan no video
          return `https://api.nerinyan.moe/d/${
            link.split("https://osu.ppy.sh/beatmapsets/")[1]
          }?nv=1`;
        case 1:
          // sayobot no video
          return `https://dl.sayobot.cn/beatmaps/download/novideo/${
            link.split("https://osu.ppy.sh/beatmapsets/")[1]
          }`;
        case 2:
          // chimu.moe
          return `https://api.chimu.moe/v1/download/${
            link.split("https://osu.ppy.sh/beatmapsets/")[1]
          }?n=1`;
      }
    });
    console.log(arraySayoNeriChimu);
    return arraySayoNeriChimu;
  };

  // tengo ver los checkboxes marcados del 0 al 6, cada uno tiene un array vacio por defecto y en el arrayTotal
  // los sumo tipo [...arrayFavourites, ...arrayRanked, etc] // al final habia una funcion para eso XD .flat()
  // tendria que hacer una funcion generica que retorne un array de los links y usarla en cada uno de los 7 casos
  // y despues los sumo en el array final
  const buscarAllLinksCheckeados = () => {
    const checkboxes = [];
    const arrDeArraysSayoNeriChimu = [];

    // for para almacenar los checkbox como htmlelements
    for (let i = 0; i <= 6; i++) {
      checkboxes.push(
        document.getElementById("checkbox-" + beatmapTitulos[i].toLowerCase())
      );
    }

    // voy a tener los checkbox en un array checkboxes y les voy a hacer if(checkboxes[i].checked)
    // si es true llamo a buscarLinks(i) y lo pusheo en arrDeArraysSayoNeriChimu

    for (let i = 0; i <= 6; i++) {
      if (checkboxes[i].checked) arrDeArraysSayoNeriChimu.push(buscarLinks(i));
    }

    // al final flateo todos los arrays dentro del array en uno solo gigante concatenado
    return arrDeArraysSayoNeriChimu.flat();
  };

  const crearTrollodescargador = () => {
    // me agarro el espacio donde aparecen los amigos y suscriptores y le agrego ahi un boton mio duplicado
    // boton trollodescargador

    const [profileBar] = document.getElementsByClassName("profile-detail-bar");

    let divBtn = document.createElement("div");
    let buttonBtn = document.createElement("button");
    let spanBtn = document.createElement("span");

    divBtn.title = "trollocat";
    buttonBtn.className = "user-action-button user-action-button--profile-page";
    buttonBtn.id = "trolloBtn";
    spanBtn.className = "user-action-button__counter";
    spanBtn.innerHTML = "trollodescargador";
    spanBtn.style.padding = "0 5px 0 5px";

    profileBar
      .insertBefore(divBtn, profileBar.children[2])
      .appendChild(buttonBtn)
      .appendChild(spanBtn);

    // hacer funcion de click trollodescargador
    buttonBtn.addEventListener("click", trollodescargadorHandler);
  };

  const crearCheckboxes = () => {
    // checkboxes
    //   fav, rank, lov, gd, pd, grave, nom
    //    0    1     2   3    4    5     6

    const [profileBar] = document.getElementsByClassName("profile-detail-bar");

    let divChBx = document.createElement("div");
    divChBx.className = "div-checkboxes";
    divChBx.style.display = "flex";
    divChBx.style.paddingLeft = ".85rem";
    profileBar.appendChild(divChBx);

    for (let i = 0; i < beatmapTitulos.length; i++) {
      let divElemento = document.createElement("div");
      divElemento.id = "elemento-" + i;
      divElemento.style.display = "flex";
      divElemento.style.alignItems = "center";
      divChBx.appendChild(divElemento);

      let checkbox = document.createElement("input");
      checkbox.id = "checkbox-" + beatmapTitulos[i].toLowerCase();
      checkbox.type = "checkbox";
      checkbox.style.margin = "0";
      divElemento.appendChild(checkbox);

      let label = document.createElement("label");
      label.id = "label-" + beatmapTitulos[i].toLowerCase();
      label.innerHTML = beatmapTitulos[i];
      label.style.paddingLeft = "2px";
      label.style.paddingRight = "8px";
      label.style.textAlign = "left";
      label.style.margin = "0";
      label.style.userSelect = "none";
      // hacer que tocar el label funcione igual que tocar al checkbox (que esta justo atras, por eso previous)
      label.addEventListener(
        "click",
        (e) =>
          (e.target.previousElementSibling.checked =
            !e.target.previousElementSibling.checked)
      );
      divElemento.appendChild(label);
    }
  };

  const crearShowMoreStatus = () => {
    const [profileBar] = document.getElementsByClassName("profile-detail-bar");

    const loadStatus = document.createElement("label");
    loadStatus.id = "loadStatus";
    loadStatus.innerHTML = "Cargar mapas";
    loadStatus.style.color = "#999999";
    loadStatus.style.display = "flex";
    loadStatus.style.borderRadius = "5rem";
    loadStatus.style.padding = "0 1rem 0 1rem";
    loadStatus.style.margin = "0 0 0 22.3rem";
    loadStatus.style.alignItems = "center";
    loadStatus.style.justifyContent = "center";
    loadStatus.style.width = "14.3rem";
    // loadStatus.style.whiteSpace = "nowrap";
    loadStatus.style.backgroundColor = "#1C1719";

    profileBar.appendChild(loadStatus);

    loadStatus.addEventListener("click", cargarMapas);
  };

  const cargarMapas = () => {
    // elemento html
    let loadStatus = document.getElementById("loadStatus");
    loadStatus.innerHTML = "X Cargando mapas...";
    loadStatus.style.color = "#bf2e2e";

    const beatmapsPanel = getBeatmapsPanel();

    const tocarShowMores = (panel) => {
      // funcion que toca todos los "Show More" dentro de un panel
      let showMores = panel.getElementsByClassName("show-more-link");
      for (let i = 0; i < showMores.length; i++) showMores[i].click();
      if (showMores.length === 0) {
        clearInterval(interval);
        loadStatus.innerHTML = "✔️ Mapas cargados";
        loadStatus.style.color = "#4dbf2e";
        // alert("Terminaron de cargarse en pantalla los mapas!");
      }
    };

    let interval = setInterval(tocarShowMores, 500, beatmapsPanel);
  };

  const trollodescargadorHandler = () => {
    // links de mirrors
    let urls = buscarAllLinksCheckeados();

    if (!urls.length) {
      return alert("No hay mapas en las categorías seleccionadas.");
    }

    const download = (urls) => {
      let url = urls.pop();

      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "");
      a.setAttribute("target", "_blank");
      a.click();

      if (urls.length == 0) {
        clearInterval(interval);
      }
    };

    let interval = setInterval(download, 2500, urls);
  };

  ////////////////////////////////////////////////////////
  // constructor de elementos HTML cuando cargue la pagina
  setTimeout(() => {
    crearTrollodescargador();
    crearShowMoreStatus();
    crearCheckboxes();
  }, 1500);
  // fin de constructor de elementos HTML cuando cargue la pagina
  ///////////////////////////////////////////////////////////////
})();
