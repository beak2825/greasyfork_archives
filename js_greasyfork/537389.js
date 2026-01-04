// ==UserScript==
// @name         HentaiNexusTagsEnhancer
// @namespace    https://greasyfork.org/es/users/1169184-horimiya
// @version      04-07-2025-V1.3.1
// @description  select tags in "hentainexus" without having to type them.
// @author       Horimiya
// @match        https://hentainexus.com/
// @match        https://hentainexus.com/page/*
// @match        https://hentainexus.com/?q=*
// @match        https://hentainexus.com/*?q=*
// @match        https://hentainexus.com/favorites*
// @icon         https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F58%2F24%2F38%2F582438ff9d7acfe7874dd2ee543242e6.png&f=1&nofb=1&ipt=029952002808399bd0a13a7b15a9b0ca6f9505ed4d32a74229f5c8755b4fcb9a
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537389/HentaiNexusTagsEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/537389/HentaiNexusTagsEnhancer.meta.js
// ==/UserScript==

"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/styles/global.css
  var init_global = __esm({
    "src/styles/global.css"() {
      "use strict";
      (function() {
        if (!document.getElementById("5c1d11d4db738a14d2ec02b6b7f2c806b9697c35e825a7701e0b2c3167c093f3")) {
          var e = document.createElement("style");
          e.id = "5c1d11d4db738a14d2ec02b6b7f2c806b9697c35e825a7701e0b2c3167c093f3";
          e.textContent = `/* styles/global.css */

/* Estilos para el modal de géneros */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: none;
}

.genre-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 900px;
  height: 80vh;
  background-color: #2b3e50;
  border-radius: 8px;
  z-index: 1001;
  padding: 0;
  overflow: hidden;
  display: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.open-genre-modal-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  background-color: #df691a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 999;
  font-weight: bold;
  transition: all 0.2s ease;
}

.open-genre-modal-button:hover {
  background-color: #c85e17;
  transform: translateY(-2px);
}

/* Contenedor principal de géneros */
.genre-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Categorías de géneros */
.genre-category {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 12px;
}

.genre-category-title {
  margin: 0 0 12px 0;
  padding: 0;
  color: #df691a;
  font-size: 1rem;
  font-weight: bold;
  text-transform: capitalize;
  letter-spacing: 0.5px;
}

/* Contenedor de botones */
.genre-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px;
}

/* Botones de género */
.genre-button {
  padding: 6px 12px;
  background: #df691a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  white-space: nowrap;
}

.genre-button:hover {
  background: #c85e17;
  transform: translateY(-1px);
}

/* Estados de los botones */
.genre-button.estado-1 {
  background: #8d08cf;
}

.genre-button.estado-2 {
  background: #c40000;
}

/* Animación para reset */
@keyframes genreReset {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.genre-button.reset-animation {
  animation: genreReset 0.3s ease;
}

/* Estilos responsive */
@media (max-width: 768px) {
  .genre-modal {
    width: 95%;
    height: 85vh;
  }

  .genre-container {
    padding: 15px;
  }

  .genre-category-title {
    font-size: 0.9rem;
  }

  .genre-button {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
}

/* Scrollbar personalizada */
.genre-container::-webkit-scrollbar {
  width: 8px;
}

.genre-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.genre-container::-webkit-scrollbar-thumb {
  background: #df691a;
  border-radius: 4px;
}

.genre-container::-webkit-scrollbar-thumb:hover {
  background: #c85e17;
}
`;
          document.head.appendChild(e);
        }
      })();
    }
  });

  // src/dom.ts
  var navBar, section;
  var init_dom = __esm({
    "src/dom.ts"() {
      "use strict";
      navBar = document.querySelector("#searchbox");
      section = document.querySelector(".section");
    }
  });

  // src/data/genres.ts
  var locations_and_worlds, fetishes, sexual_acts, participants, characters_and_costumes, body, age, options, orientarions, number_of_pages, genres, genres_default;
  var init_genres = __esm({
    "src/data/genres.ts"() {
      "use strict";
      locations_and_worlds = [
        "bathhouse",
        "bathroom",
        "beach",
        "hotspring",
        "isekai",
        "love hotel",
        "pool",
        "sci-fi",
        "slice of life"
      ];
      fetishes = [
        "ahegao",
        "armpit fetish",
        "bdsm",
        "biting",
        "body swap",
        "bondage",
        "bss",
        "bukkake",
        "cheating",
        "chikan",
        "comedy",
        "condom",
        "creampie",
        "double penetration",
        "ecchi",
        "exhibitionism",
        "fantasy",
        "femboy",
        "femdom",
        "fenderbend",
        "filming",
        "first time",
        "forced",
        "horror",
        "humiliation",
        "impregnation",
        "incest",
        "inseki",
        "interview",
        "kuudere",
        "lactation",
        "lotion play",
        "love potion",
        "netorare",
        "netorase",
        "netori",
        "ongoing",
        "orgasm denial",
        "outdoors",
        "pegging",
        "piercing",
        "smell fetish",
        "spanking",
        "spread",
        "squirting",
        "swallowing",
        "swinging",
        "tentacles",
        "tomboy",
        "toys",
        "tsundere",
        "ugly bastard",
        "vanilla",
        "voyeurism",
        "whiteout",
        "wrestling",
        "x-ray",
        "yandere",
        "zero gravity"
      ];
      sexual_acts = [
        "anal",
        "blowjob",
        "breast sucking",
        "cunnilingus",
        "deepthroat",
        "facesitting",
        "facial",
        "fingering",
        "footjob",
        "handjob",
        "leg lock",
        "masturbation",
        "paizuri",
        "matingpress",
        "rimjob",
        "sixty-nine",
        "thigh job"
      ];
      participants = [
        "females only",
        "fffm foursome",
        "ffm threesome",
        "fivesome plus",
        "group",
        "harem",
        "males only",
        "mmf threesome",
        "orgy",
        "mmmf foursome"
      ];
      characters_and_costumes = [
        "apron",
        "blindfold",
        "bloomers",
        "body writing",
        "bunny girl",
        "catgirl",
        "cheerleader",
        "christmas",
        "cosplay",
        "co-workers",
        "crossdressing",
        "deity",
        "delinquent",
        "demon",
        "doctor",
        "elf",
        "eyepatch",
        "face mask",
        "fishnets",
        "fox girl",
        "glasses",
        "gyaru",
        "headphones",
        "housewife",
        "idol",
        "kimono",
        "kogal",
        "lingerie",
        "magical girl",
        "maid",
        "miko",
        "monster girl",
        "ninja",
        "nun",
        "nurse",
        "office lady",
        "ojousama",
        "oni",
        "osananajimi",
        "pantyhose",
        "qipao",
        "robot",
        "schoolgirl outfit",
        "scientist",
        "shimapan",
        "socks",
        "spats",
        "spirit",
        "sportswear",
        "stockings",
        "succubus",
        "swimsuit",
        "tanlines",
        "tattoo",
        "teacher",
        "vtuber",
        "waitress",
        "witch"
      ];
      body = [
        "beauty mark",
        "big areolae",
        "big dick",
        "booty",
        "bun hair",
        "busty",
        "chubby",
        "crotch tattoo",
        "curly hair",
        "dark skin",
        "eyebrows",
        "fangs",
        "foreigner",
        "freckles",
        "hairy armpit",
        "heart pupils",
        "horns",
        "huge boobs",
        "inverted nipples",
        "kemonomimi",
        "light hair",
        "muscles",
        "over-eye bangs",
        "petite",
        "ponytail",
        "pregnant",
        "pubic hair",
        "shark teeth",
        "short hair",
        "shortstack",
        "tall girl",
        "twintails",
        "very long hair"
      ];
      age = ["shota", "loli", "dilf", "milf"];
      options = [
        "uncensored",
        "unlimited",
        "story arc",
        "doujin",
        "paperback",
        "non-h",
        "no sex",
        "mosaics",
        "light novel",
        "illustration",
        "historical",
        "hentai",
        "free",
        "full color",
        "semi-color",
        "color",
        "cg set",
        "book",
        "box set",
        "webtoon",
        "western"
      ];
      orientarions = ["yaoi", "yuri", "trans", "futanari", "newhalf", "genderbend"];
      number_of_pages = [
        "pages:<=20",
        "pages:<=50",
        "pages:<=100",
        "pages:>=10",
        "pages:>=20",
        "pages:>=50",
        "pages:>=100",
        "pages:>=200",
        "pages:>=300",
        "pages:>=400",
        "pages:>=500"
      ];
      genres = [
        { title: "options", genres: options },
        { title: "orientations", genres: orientarions },
        { title: "age", genres: age },
        { title: "body", genres: body },
        { title: "characters_and_costumes", genres: characters_and_costumes },
        { title: "participants", genres: participants },
        { title: "sexual_acts", genres: sexual_acts },
        { title: "fetishes", genres: fetishes },
        { title: "locations_and_worlds", genres: locations_and_worlds },
        { title: "number_of_pages", genres: number_of_pages }
      ];
      genres_default = genres;
    }
  });

  // src/components/functions/actualizarNavTag.ts
  function actualizarNavTag(genre, estado) {
    if (!navBar) return;
    const existente = navBar.querySelector(`[data-genre="${genre}"]`);
    if (estado === 0) {
      existente?.remove();
      return;
    }
    if (!existente) {
      const tag2 = document.createElement("span");
      tag2.className = "genre-tag";
      tag2.dataset.genre = genre;
      navBar.appendChild(tag2);
    }
    const tag = navBar.querySelector(`[data-genre="${genre}"]`);
    if (tag) {
      const quoted = genre.includes(" ") ? `"${genre}"` : genre;
      tag.textContent = estado === 1 ? `tag:${quoted}` : `-tag:${quoted}`;
    }
  }
  var actualizarNavTag_default;
  var init_actualizarNavTag = __esm({
    "src/components/functions/actualizarNavTag.ts"() {
      "use strict";
      init_dom();
      actualizarNavTag_default = actualizarNavTag;
    }
  });

  // src/components/buttonFilter.ts
  var contenedorGeneros, input, estados, createTitleElement;
  var init_buttonFilter = __esm({
    "src/components/buttonFilter.ts"() {
      "use strict";
      init_genres();
      init_actualizarNavTag();
      init_global();
      contenedorGeneros = document.createElement("div");
      contenedorGeneros.className = "genre-container";
      input = document.querySelector("input.navbar-search-box");
      estados = /* @__PURE__ */ new Map();
      createTitleElement = (title) => {
        const titleElement = document.createElement("h3");
        titleElement.className = "genre-category-title";
        titleElement.textContent = title.replace(/_/g, " ");
        return titleElement;
      };
      genres_default.forEach((category) => {
        const categoryContainer = document.createElement("div");
        categoryContainer.className = "genre-category";
        categoryContainer.appendChild(createTitleElement(category.title));
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "genre-buttons-container";
        category.genres.forEach((genre) => {
          const boton = document.createElement("button");
          boton.className = "genre-button estado-0";
          boton.textContent = genre;
          boton.title = `Filtrar por ${genre}`;
          boton.addEventListener("click", (e) => {
            e.preventDefault();
            if (!input) return;
            let estado = estados.get(genre) || 0;
            const isPageFilter = category.title === "number_of_pages";
            const quoted = genre.includes(" ") ? `"${genre}"` : genre;
            const regex = isPageFilter ? new RegExp(`(^|\\s)(-?)(${genre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?=\\s|$)`, "g") : new RegExp(`(^|\\s)(-?tag:)(?:"${genre}"|${genre})(?=\\s|$)`, "g");
            input.value = input.value.replace(regex, "").replace(/\s{2,}/g, " ").trim();
            estado = (estado + 1) % 3;
            estados.set(genre, estado);
            if (estado === 1) {
              input.value += (input.value ? " " : "") + (isPageFilter ? genre : `tag:${quoted}`);
            } else if (estado === 2) {
              input.value += (input.value ? " " : "") + (isPageFilter ? `-${genre}` : `-tag:${quoted}`);
            }
            boton.classList.remove("estado-0", "estado-1", "estado-2");
            boton.classList.add(`estado-${estado}`);
            input.focus();
            actualizarNavTag_default(genre, estado);
          });
          buttonsContainer.appendChild(boton);
        });
        categoryContainer.appendChild(buttonsContainer);
        contenedorGeneros.appendChild(categoryContainer);
      });
    }
  });

  // src/components/clearButton.ts
  function clearButton() {
    if (!input2) return;
    const button = document.createElement("button");
    button.className = "button";
    button.title = "Limpiar búsqueda";
    button.type = "button";
    button.innerHTML = `
    <svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="trash-o" class="svg-inline--fa fa-trash-o" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.9a24 24 0 0 0-21.5 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h16l21.2 339a48 48 0 0 0 47.9 45H346.9a48 48 0 0 0 47.9-45L416 96h16a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM166.4 43.2a6 6 0 0 1 5.4-3.2h80.4a6 6 0 0 1 5.4 3.2L264.8 64H183.2zM352 432a16 16 0 0 1-15.9 15H111.9a16 16 0 0 1-15.9-15L75.2 96h297.6zM176 400a16 16 0 0 1-32 0V176a16 16 0 0 1 32 0zm64 0a16 16 0 0 1-32 0V176a16 16 0 0 1 32 0zm64 0a16 16 0 0 1-32 0V176a16 16 0 0 1 32 0z"></path>
    </svg>
  `;
    button.addEventListener("click", () => {
      input2.value = "";
      input2.focus();
      const navBar2 = document.querySelector(".nav-bar") || document.querySelector("#navbar-tags");
      if (navBar2) {
        navBar2.innerHTML = "";
      }
      const botones = document.querySelectorAll("button.genre-button");
      botones.forEach((boton) => {
        boton.classList.remove("estado-1", "estado-2");
        boton.classList.add("estado-0");
        boton.classList.add("reset-animation");
        setTimeout(() => boton.classList.remove("reset-animation"), 300);
      });
      estados.clear();
    });
    return button;
  }
  var input2, clearButton_default;
  var init_clearButton = __esm({
    "src/components/clearButton.ts"() {
      "use strict";
      init_buttonFilter();
      input2 = document.querySelector("input.navbar-search-box");
      clearButton_default = clearButton;
    }
  });

  // src/components/ui/GenreModal.ts
  var GenreModal, GenreModal_default;
  var init_GenreModal = __esm({
    "src/components/ui/GenreModal.ts"() {
      "use strict";
      init_buttonFilter();
      GenreModal = class {
        constructor() {
          this.modal = document.createElement("div");
          this.overlay = document.createElement("div");
          this.openButton = document.createElement("button");
          this.setupModal();
          this.setupOverlay();
          this.setupOpenButton();
          this.addEventListeners();
        }
        setupModal() {
          this.modal.className = "genre-modal";
          this.modal.style.display = "none";
          this.modal.style.position = "fixed";
          this.modal.style.top = "50%";
          this.modal.style.left = "50%";
          this.modal.style.transform = "translate(-50%, -50%)";
          this.modal.style.width = "80%";
          this.modal.style.height = "80%";
          this.modal.style.backgroundColor = "#2b3e50";
          this.modal.style.borderRadius = "8px";
          this.modal.style.zIndex = "1001";
          this.modal.style.padding = "0";
          this.modal.style.overflow = "hidden";
          contenedorGeneros.style.width = "100%";
          contenedorGeneros.style.height = "100%";
          contenedorGeneros.style.overflowY = "auto";
          contenedorGeneros.style.padding = "15px";
          contenedorGeneros.style.boxSizing = "border-box";
          this.modal.appendChild(contenedorGeneros);
        }
        setupOverlay() {
          this.overlay.className = "modal-overlay";
          this.overlay.style.display = "none";
          this.overlay.style.position = "fixed";
          this.overlay.style.top = "0";
          this.overlay.style.left = "0";
          this.overlay.style.width = "100%";
          this.overlay.style.height = "100%";
          this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
          this.overlay.style.zIndex = "1000";
        }
        setupOpenButton() {
          this.openButton.className = "open-genre-modal-button";
          this.openButton.textContent = "Filters";
          this.openButton.style.position = "fixed";
          this.openButton.style.bottom = "20px";
          this.openButton.style.right = "20px";
          this.openButton.style.padding = "10px 15px";
          this.openButton.style.backgroundColor = "#df691a";
          this.openButton.style.color = "white";
          this.openButton.style.border = "none";
          this.openButton.style.borderRadius = "4px";
          this.openButton.style.cursor = "pointer";
          this.openButton.style.zIndex = "999";
        }
        addEventListeners() {
          this.openButton.addEventListener("click", () => this.openModal());
          this.overlay.addEventListener("click", () => this.closeModal());
          this.modal.addEventListener("click", (e) => e.stopPropagation());
        }
        openModal() {
          this.overlay.style.display = "block";
          this.modal.style.display = "block";
          document.body.style.overflow = "hidden";
        }
        closeModal() {
          this.overlay.style.display = "none";
          this.modal.style.display = "none";
          document.body.style.overflow = "";
        }
        init() {
          document.body.appendChild(this.overlay);
          document.body.appendChild(this.modal);
          document.body.appendChild(this.openButton);
        }
      };
      document.addEventListener("DOMContentLoaded", () => {
        const genreModal = new GenreModal();
        genreModal.init();
      });
      GenreModal_default = GenreModal;
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"() {
      init_global();
      init_dom();
      init_clearButton();
      init_GenreModal();
      var genreModal = new GenreModal_default();
      genreModal.init();
      var buttonElement = clearButton_default();
      if (buttonElement) {
        const searchItem = document.querySelector("#navbar-search-item .field.has-addons");
        if (searchItem) {
          searchItem.appendChild(buttonElement);
        } else {
          navBar?.appendChild(buttonElement);
        }
      }
    }
  });
  require_main();
})();
