// ==UserScript==
// @name         Modo cascada
// @namespace    https://hentai-id.tv/
// @version      0.4
// @description  Crea un botón para tener modo cascada en los mangas de esta página H
// @author       mao_o
// @match        https://hentai-id.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentai-id.tv
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.8.0/jszip.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479162/Modo%20cascada.user.js
// @updateURL https://update.greasyfork.org/scripts/479162/Modo%20cascada.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var ruta = window.location.pathname;

  const urls = document.querySelectorAll('a[href^="https://ouo.io/s/lb"]');
  urls.forEach((url) => {
    url.href = url.href.slice(url.href.indexOf("=") + 1, url.href.leght);
    console.log(url.href);
  });

  if (ruta == "/manga.php") {
    // Obtener la barra donde se agregará el botón
    let barra = document.querySelector(
      "body > section > div:nth-child(1) > div > div"
    );
    let imagenes = document.querySelector("body > section > div:nth-child(2)");
    var imagenesLink = [];
    var seccion = document.querySelector("body > section");
    var selector = document.querySelector("#inlineFormCustomSelect");
    var img = document.querySelector(
      "body > section > div:nth-child(2) > a > img"
    ).src;
    var paginas = selector.length;
    var paginaActual = selector.selectedIndex + 1;
    var imgFuente = img.substring(0, img.indexOf(paginaActual + ".jpg"));

    console.log(paginaActual);
    console.log(imgFuente);

    seccion.style.position = "relative";
    selector.addEventListener("change", Selector);


    barra.parentNode.style.position = "fixed";
    barra.parentNode.style.top = 0;
    barra.parentNode.style.width = "50%";
    window.addEventListener("scroll", function () {
      if (window.scrollY > 200) {
        // Hacer algo cuando el scroll haya superado los 200 píxeles
        barra.parentNode.style.display = "none";
        // barra.parentNode.style.top= window.scrollY/1 +"px";
      } else {
        // Hacer algo cuando el scroll esté por debajo de los 200 píxeles
        barra.parentNode.style.display = "block";
      }
    });

    window.addEventListener("resize", resonsive);

    //imagenes.style.position = "relative";
    imagenes.className = "mi-clase";

    // limpiando el menu
    for (let elemento of barra.children) {
      // Hacer algo con cada elemento
      elemento.setAttribute("style", " display: none;");
    }

    // Crear el botónes
    var modo_pagina = document.createElement("button");
    modo_pagina.addEventListener("click", Funcion_Pagina);
    modo_pagina.classList.add("btn", "btn-danger", "m2-title", "m2-titlen");
    modo_pagina.textContent = " 🗎 Pagina";

    var modo_Cascada = document.createElement("button");
    modo_Cascada.addEventListener("click", Funcion_Cascada);
    modo_Cascada.classList.add("btn", "btn-danger", "m2-title", "m2-titlen");
    modo_Cascada.textContent = "🗍 Cascada";

    var descargar = document.createElement("img");
    descargar.addEventListener("click", descargarImagenes);
    descargar.classList.add("btn", "btn-danger", "m2-title", "m2-titlen");
    descargar.src = "https://img.icons8.com/wired/64/zip.png";
    descargar.style.width = "2rem";
    descargar.style.padding = "0";

    var controles = document.createElement("div");
    controles.setAttribute("style", " display: flex;");

    controles.style.display = "flex";
    controles.style.position = "fixed";
    controles.style.justifyContent = "space-between";
    controles.style.width = "100%";
    controles.style.height = "80%";
    controles.style.top = "10%";
    controles.style.opacity = "2%";

    let control1 = document.createElement("div");
    //modo_Cascada.addEventListener("click", Funcion_Cascada);
    control1.setAttribute("style", " background-color: red;");
    control1.style.width = "30%";
    control1.addEventListener("click", paginaAnterior);
    control1.textContent = "🗍 Cascada";

    let control2 = document.createElement("div");
    //modo_Cascada.addEventListener("click", Funcion_Cascada);
    control2.setAttribute("style", " background-color: blue;");
    control2.style.width = "30%";
    control2.addEventListener("click", paginaSiguiente);
    control2.textContent = "ada";

    // Agregamos los elementos
    controles.appendChild(control1);
    controles.appendChild(control2);
    seccion.appendChild(controles);
    barra.appendChild(modo_pagina);
    barra.appendChild(modo_Cascada);
    barra.appendChild(descargar);

    selector.setAttribute("style", " display: inline-block;");
    //selector.setAttribute("onchange", "");
    document
      .querySelector("body > section > div.mi-clase")
      .addEventListener("click", function () {
        if (barra.parentNode.style.display == "block") {
          barra.parentNode.style.display = "none";
        } else {
          barra.parentNode.style.display = "block";
        }
      });
    resonsive();
    Funcion_Cascada();
    Funcion_Pagina();

    function descargarImagenes() {
      alert("Descargando....");
      var zip = new JSZip();

      // Función para cargar imágenes desde la caché
      function cargarImagenDesdeCache(enlace, index) {
        return fetch(enlace, { cache: "force-cache" })
          .then((response) => response.arrayBuffer())
          .then((data) => zip.file("imagen" + index + ".jpg", data));
      }

      Promise.all(imagenesLink.map(cargarImagenDesdeCache))
        .then(function () {
          return zip.generateAsync({ type: "blob" });
        })
        .then(function (content) {
          var aZip = document.createElement("a");
          aZip.href = URL.createObjectURL(content);
          aZip.download = "imagenes.zip";
          aZip.click();
        });
    }
    function Selector() {
      paginaActual = selector.selectedIndex + 1;
      Funcion_Pagina();
    }

    function resonsive() {
      var anchoPantalla = window.innerWidth;
      console.log(anchoPantalla);
      if (anchoPantalla > 989) {
        barra.parentNode.style.top = "5%";
      } else if (anchoPantalla < 418) {
        barra.parentNode.style.top = "90%";
        barra.parentNode.style.width = "65%";
      } else {
        barra.parentNode.style.top = "0";
        barra.parentNode.style.width = "50%";
      }
    }

    function paginaAnterior() {
      if (paginaActual > 1) {
        paginaActual = paginaActual - 1;
        selector.value = paginaActual - 1;
        console.log("presiono anterior");
        Funcion_Pagina();
      }
    }

    function paginaSiguiente() {
      console.log("presiono actual" + paginaActual);
      if (paginaActual < paginas) {
        paginaActual = paginaActual + 1;
        selector.value = paginaActual - 1;
        console.log("presiono actual" + paginaActual);
        Funcion_Pagina();
      }
    }

    function Funcion_Cascada() {
      // Obtener información de las páginas
      selector.setAttribute("style", " display: none;");
      modo_pagina.setAttribute("style", " display:  inline-block;");
      modo_Cascada.setAttribute("style", " display: none;");

      // Crear y agregar las imágenes en cascada
      for (let i = 1; i <= paginas; i++) {
        console.log("paginas... " + i);
        if (imagenes.children.length <= paginas) {
          let imagen = document.createElement("img");
          imagenesLink.push(imgFuente + i + ".jpg");
          imagen.src = imgFuente + i + ".jpg";
          console.log(i + ".jpg");
          imagen.classList.add("img-m2");
          imagenes.appendChild(imagen);
        } else {
          imagenes.children[i].setAttribute("style", " display: inline-block;");
        }
      }
      imagenes.children[paginaActual].scrollIntoView();
      controles.style.display = "none";
      document
        .querySelector("body > section > div:nth-child(2) > a")
        .setAttribute("style", " display: none;");
    }

    function Funcion_Pagina() {
      //console.log("ejecutando... " + paginaActual);

      // Obtener información de las páginas
      selector.setAttribute("style", " display: inline-block;");
      modo_pagina.setAttribute("style", " display: none;");
      modo_Cascada.setAttribute("style", " display:inline-block;");

      //  if (imagenes.children.length > 1) {
      // Utilizando un bucle for...of
      for (let elemento of imagenes.children) {
        // Hacer algo con cada elemento
        elemento.setAttribute("style", " display: none;");
      }
      imagenes.children[paginaActual].setAttribute(
        "style",
        " display: inline-block;"
      );
      controles.style.display = "flex";
      //}
    }
  }
})();
