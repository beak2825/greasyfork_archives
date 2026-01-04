// ==UserScript==
// @name         Nhentai Favorites Extention
// @namespace    https://greasyfork.org/es/users/1169184-horimiya
// @version      21-06-2025-v1.2.4
// @description  Extensión para mejorar la página de favoritos de Nhentai, añadiendo un diccionario de tags y reorganizando la barra de búsqueda.
// @author       Horimiya
// @license      MIT
// @match        https://nhentai.net/favorites/*
// @match        https://nhentai.net/
// @match        https://nhentai.net/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537366/Nhentai%20Favorites%20Extention.user.js
// @updateURL https://update.greasyfork.org/scripts/537366/Nhentai%20Favorites%20Extention.meta.js
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
        if (!document.getElementById("141bbedc15f5fc7379cf3573c50fb097dad72c8884114102ee8fbac1e7700ca7")) {
          var e = document.createElement("style");
          e.id = "141bbedc15f5fc7379cf3573c50fb097dad72c8884114102ee8fbac1e7700ca7";
          e.textContent = `/* ============ ESTILOS GENERALES ============ */
#content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ============ BARRA DE BÚSQUEDA ============ */
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 10px auto;
  gap: 10px;
}

#dynamic-search-form {
  flex-grow: 1;
  max-width: 600px;
  display: flex;
}

#dynamic-search-form input[type='search'] {
  width: 100%;
  min-width: 300px;
  height: 40px;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 4px 0 0 4px;
  border: 1px solid #ddd;
  border-right: none;
}

#dynamic-search-form button[type='submit'] {
  height: 40px;
  width: 50px;
  border-radius: 0 4px 4px 0;
  border-left: none;
}

/* ============ BOTONES ============ */
#favorites-random-button,
#dynamic-clear-button {
  height: 40px;
  padding: 0 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

#dynamic-clear-button {
  transition: all 0.3s ease;
  margin-left: 10px;
}

#dynamic-clear-button:hover {
  opacity: 0.8;
}

/* ============ DICCIONARIO AVANZADO ============ */
.advanced-search-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 999;
  padding: 10px 15px;
  border-radius: 4px;
  background-color: #ed2553;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.advanced-search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* ============ MODAL ============ */
.modal-content-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #2a2a2a;
  color: #f1f1f1;
}

.modal-tags-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Categorías */
.category-wrapper {
  width: 100%;
  margin: 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ed2553;
}

.category-title {
  margin: 0 0 10px 0;
  color: #fdeaee;
  font-size: 1.1rem;
}

/* Tags */
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-button {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #4d4d4d;
  background-color: #1f1f1f;
  color: #fdeaee;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.tag-button:hover {
  background-color: #ed2553;
  color: white;
}

.tag-included {
  background-color: #ed2553;
  color: white;
}

.tag-excluded {
  background-color: #6825be;
  color: white;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    align-items: stretch;
    padding: 0 10px;
    gap: 5px;
  }

  #dynamic-search-form {
    flex-direction: row;
    max-width: 100%;
  }

  #dynamic-search-form input[type='search'] {
    min-width: 100%;
    border-right: 1px solid #ddd;
  }

  #dynamic-search-form button[type='submit'] {
    width: 50px;
    border-radius: 0 4px 4px 0;
    border-left: none;
  }

  #favorites-random-button,
  #dynamic-clear-button {
    width: 100%;
    margin-left: 0;
    margin-top: 5px;
  }

  .advanced-search-btn {
    bottom: 15px;
    left: 15px;
    padding: 8px 12px;
    font-size: 14px;
  }

  .modal-tags-container {
    padding: 15px;
  }

  .tags-wrapper {
    gap: 6px;
  }

  .tag-button {
    padding: 5px 10px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  #dynamic-search-form input[type='search'] {
    height: 36px;
    font-size: 13px;
    padding: 8px 10px;
  }

  #dynamic-search-form button[type='submit'],
  #favorites-random-button,
  #dynamic-clear-button {
    height: 36px;
    font-size: 13px;
    padding: 8px 10px;
  }
}
`;
          document.head.appendChild(e);
        }
      })();
    }
  });

  // src/components/reorganizarElementos.ts
  var reorganizarElementos;
  var init_reorganizarElementos = __esm({
    "src/components/reorganizarElementos.ts"() {
      "use strict";
      reorganizarElementos = (form) => {
        const content = document.getElementById("content") || document.body;
        const randomBtn = document.getElementById("favorites-random-button") || document.querySelector(".random-button");
        const searchContainer = document.createElement("div");
        searchContainer.className = "search-container";
        content.insertBefore(
          searchContainer,
          content.querySelector("#favcontainer") || content.firstChild
        );
        searchContainer.appendChild(form);
        if (randomBtn) searchContainer.appendChild(randomBtn);
      };
    }
  });

  // src/components/crearBotonBorrar.ts
  var crearBotonBorrar;
  var init_crearBotonBorrar = __esm({
    "src/components/crearBotonBorrar.ts"() {
      "use strict";
      crearBotonBorrar = (form) => {
        const botonBorrar = document.createElement("button");
        botonBorrar.className = "btn btn-primary";
        botonBorrar.id = "dynamic-clear-button";
        const icono = document.createElement("i");
        icono.className = "fa fa-eraser fa-lg";
        botonBorrar.appendChild(document.createTextNode(" "));
        botonBorrar.appendChild(icono);
        botonBorrar.addEventListener("click", (e) => {
          e.preventDefault();
          const input = form.querySelector('input[type="search"]');
          if (input) {
            input.value = "";
            input.focus();
          }
        });
        const randomButton = document.getElementById("favorites-random-button");
        if (randomButton) {
          randomButton.parentNode?.insertBefore(botonBorrar, randomButton.nextSibling);
        } else {
          form.parentNode?.insertBefore(botonBorrar, form.nextSibling);
        }
        return botonBorrar;
      };
    }
  });

  // src/data/genres.ts
  var languageList, formatList, ageList, bodyList, fetishesList, sexualThemesList, sexualOrientationList, charactersAndRelationshipsList, noGoodActivitiesList, charactersTypeList, monstersAndFantasiaList, costumeList, objectsList, numberofpagesList, timeUploadedList, categorias;
  var init_genres = __esm({
    "src/data/genres.ts"() {
      "use strict";
      languageList = [
        "english",
        "spanish",
        "japanese",
        "korean",
        "chinese",
        "translated",
        "rough translation",
        "rough grammar"
      ];
      formatList = [
        "original",
        "manga",
        "doujinshi",
        "story arc",
        "tankoubon",
        "webtoon",
        "multi-work series",
        "anthology",
        "artbook",
        "artistcg",
        "full color",
        "full censorship",
        "mosaic censorship",
        "uncensored",
        "redraw"
      ];
      ageList = [
        "age progression",
        "age regression",
        "dilf",
        "infantilism",
        "kodomo doushi",
        "lolicon",
        "milf",
        "old lady",
        "old man",
        "shotacon",
        "low shotacon"
      ];
      bodyList = [
        "albino",
        "dark skin",
        "tanlines",
        "beauty mark",
        "bald",
        "ponytail",
        "twintails",
        "very long hair",
        "facial hair",
        "freckles",
        "thick eyebrows",
        "heterochromia",
        "scar",
        "big breasts",
        "small breasts",
        "oppai loli",
        "big penis",
        "small penis",
        "penis enlargement",
        "penis reduction",
        "hairy",
        "hairy armpits",
        "hair buns",
        "lactation",
        "inverted nipples",
        "breast expansion",
        "tall man",
        "tall girl",
        "pregnant",
        "bbw",
        "bbm",
        "amputee",
        "big muscles",
        "body modification",
        "body swap",
        "doll joints",
        "invisible",
        "multiple arms",
        "multiple breasts",
        "multiple penises",
        "muscle",
        "muscle growth",
        "petrification",
        "shrinking",
        "feminization",
        "futanarization",
        "gender change",
        "weight gain",
        "wings",
        "phimosis"
      ];
      fetishesList = [
        "ahegao",
        "blowjob face",
        "bondage",
        "humiliation",
        "exhibitionism",
        "hidden sex",
        "sleeping",
        "time stop",
        "filming",
        "multiple orgasms",
        "breast feeding",
        "femdom",
        "smalldom",
        "domination loss",
        "giantess",
        "tentacles",
        "harem",
        "vanilla",
        "group",
        "guro",
        "enema",
        "sweating",
        "farting",
        "smegma",
        "impregnation",
        "milking",
        "miniguy",
        "minigirl",
        "mesugaki",
        "netorare",
        "netorase",
        "swinging",
        "cheating",
        "saliva",
        "urination",
        "piss drinking",
        "coprophagia",
        "vore",
        "petplay",
        "bestiality",
        "low bestiality",
        "emotionless sex",
        "mind break",
        "moral degeneration",
        "possession",
        "shared senses",
        "smell",
        "voyeurism",
        "smoking",
        "food on body",
        "x-ray"
      ];
      sexualThemesList = [
        "masturbation",
        "kissing",
        "fingering",
        "cunnilingus",
        "defloration",
        "virginity",
        "anal",
        "anal intercourse",
        "handjob",
        "blowjob",
        "deepthroat",
        "footjob",
        "multiple footjob",
        "rimjob",
        "pantyjob",
        "sockjob",
        "sumata",
        "assjob",
        "legjob",
        "paizuri",
        "kneepit sex",
        "ball caressing",
        "ball sucking",
        "autofellatio",
        "nakadashi",
        "squirting",
        "tribadism",
        "pegging",
        "mmf threesome",
        "ffm threesome",
        "mtf threesome",
        "fft threesome",
        "ttf threesome",
        "fff threesome",
        "mmm threesome",
        "no penetration",
        "double penetration",
        "triple penetration",
        "double vaginal",
        "double anal",
        "triple vaginal",
        "triple anal",
        "all the way through",
        "dickgirl on dickgirl",
        "dickgirl on female",
        "dickgirl on male",
        "male on dickgirl",
        "prostate massage",
        "frottage",
        "bukkake",
        "fisting"
      ];
      sexualOrientationList = [
        "heterosexual",
        "bisexual",
        "yaoi",
        "yuri",
        "futanari",
        "otokofutanari",
        "shemale",
        "cuntboy",
        "sole female",
        "sole male"
      ];
      charactersAndRelationshipsList = [
        "incest",
        "inseki",
        "selfcest",
        "oyakodon",
        "shimaidon",
        "twins",
        "sister",
        "brother",
        "mother",
        "father",
        "son",
        "daughter",
        "cousin",
        "niece",
        "aunt",
        "uncle",
        "grandmother",
        "grandfather",
        "granddaughter"
      ];
      noGoodActivitiesList = [
        "prostitution",
        "rape",
        "gang rape",
        "blackmail",
        "confinement",
        "forced exposure",
        "torture",
        "mind control"
      ];
      charactersTypeList = [
        "teacher",
        "tutor",
        "maid",
        "tomgirl",
        "nurse",
        "nun",
        "priest",
        "magical girl",
        "policewoman",
        "waitress",
        "cheerleader",
        "kunoichi",
        "ninja",
        "miko",
        "slut",
        "widow",
        "witch",
        "gyaru",
        "slave"
      ];
      monstersAndFantasiaList = [
        "alien",
        "alien girl",
        "angel",
        "monster girl",
        "monster",
        "corpse",
        "slime girl",
        "demon",
        "demon girl",
        "elf",
        "fairy",
        "furry",
        "ghost",
        "goblin",
        "harpy",
        "kappa",
        "oni",
        "orc",
        "kemonomimi",
        "lizard girl",
        "lizard guy",
        "mermaid",
        "merman",
        "minotaur",
        "midget",
        "centaur",
        "plant girl",
        "robot",
        "lamia",
        "arachne",
        "spider girl",
        "catgirl",
        "bunny girl",
        "dog girl",
        "fox girl",
        "pig girl",
        "vampire",
        "zombie"
      ];
      costumeList = [
        "schoolgirl uniform",
        "school gym uniform",
        "school swimsuit",
        "hotpants",
        "bride",
        "apron",
        "bodysuit",
        "tracksuit",
        "business suit",
        "chinese dress",
        "crossdressing",
        "kimono",
        "lab coat",
        "sundress",
        "swimsuit",
        "tracksuit",
        "transparent clothing",
        "wet clothes",
        "christmas",
        "leotard",
        "lingerie",
        "thigh high boots",
        "metal armor"
      ];
      objectsList = [
        "crown",
        "collar",
        "gloves",
        "gasmask",
        "masked face",
        "mouth mask",
        "blindfold",
        "chastity belt",
        "strap-on",
        "tail plug",
        "leash",
        "wooden horse",
        "harness",
        "latex",
        "nose hook",
        "chloroform",
        "gag",
        "stockings",
        "apron",
        "garter belt",
        "sex toys",
        "piercing",
        "nipple piercing",
        "genital piercing",
        "condom",
        "cosplaying",
        "glasses",
        "eyepatch",
        "oil",
        "drugs",
        "tail plug",
        "sunglasses",
        "high heels",
        "crotch tattoo",
        "fundoshi",
        "bloomers"
      ];
      numberofpagesList = [
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
      timeUploadedList = [
        "uploaded:<1h",
        "uploaded:<6h",
        "uploaded:<12h",
        "uploaded:<1d",
        "uploaded:<3d",
        "uploaded:<1w",
        "uploaded:<1m",
        "uploaded:<3m",
        "uploaded:<6m",
        "uploaded:<1y",
        "uploaded:<2y",
        "uploaded:<3y",
        "uploaded:<5y",
        "uploaded:<10y",
        "uploaded:>1h",
        "uploaded:>6h",
        "uploaded:>12h",
        "uploaded:>1d",
        "uploaded:>3d",
        "uploaded:>1w",
        "uploaded:>1m",
        "uploaded:>3m",
        "uploaded:>6m",
        "uploaded:>1y",
        "uploaded:>2y",
        "uploaded:>3y",
        "uploaded:>5y",
        "uploaded:>10y"
      ];
      categorias = [
        {
          titulo: "Languages",
          tags: languageList
        },
        {
          titulo: "Format",
          tags: formatList
        },
        {
          titulo: "Age",
          tags: ageList
        },
        {
          titulo: "Body",
          tags: bodyList
        },
        {
          titulo: "Sexual orientation",
          tags: sexualOrientationList
        },
        {
          titulo: "Sexual themes",
          tags: sexualThemesList
        },
        {
          titulo: "Characters & Relationships",
          tags: charactersAndRelationshipsList
        },
        {
          titulo: "Fetishes",
          tags: fetishesList
        },
        {
          titulo: "Characters Type",
          tags: charactersTypeList
        },
        {
          titulo: "Costumes",
          tags: costumeList
        },
        {
          titulo: "Monsters & Fantasia",
          tags: monstersAndFantasiaList
        },
        {
          titulo: "Objects",
          tags: objectsList
        },
        {
          titulo: "Not Good Activities",
          tags: noGoodActivitiesList
        },
        {
          titulo: "Number of Pages",
          tags: numberofpagesList
        },
        {
          titulo: "Time Uploaded",
          tags: timeUploadedList
        }
      ];
    }
  });

  // src/components/modal.component.ts
  var template, ModalComponent;
  var init_modal_component = __esm({
    "src/components/modal.component.ts"() {
      "use strict";
      template = document.createElement("template");
      template.innerHTML = `
  <style>
    :host {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 1000;
    }

    .modal-container {
      background-color: #1a1a1a;
      width: 100%;
      height: 65vh;
      max-height: 65vh;
      position: fixed;
      bottom: 0;
      left: 0;
      overflow-y: none;
      animation: slideUp 0.3s ease-out;
      color: #e0e0e0;
    }

    .modal-content {
      padding: 20px;
      height: 100%;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Scrollbar personalizada */
    .modal-container::-webkit-scrollbar {
      width: 8px;
    }

    .modal-container::-webkit-scrollbar-track {
      background: #2a2a2a;
    }

    .modal-container::-webkit-scrollbar-thumb {
      background: #555;
      border-radius: 4px;
    }

    .modal-container::-webkit-scrollbar-thumb:hover {
      background: #666;
    }
  </style>

  <div class="modal-container" part="container">
    <div class="modal-content" part="content">
      <slot></slot>
    </div>
  </div>
`;
      ModalComponent = class extends HTMLElement {
        constructor() {
          super();
          this._isOpen = false;
          this.attachShadow({ mode: "open" });
          this.shadowRoot?.appendChild(template.content.cloneNode(true));
        }
        static get observedAttributes() {
          return ["open"];
        }
        connectedCallback() {
          this.addEventListener("click", (e) => {
            if (e.target === this) {
              this.close();
            }
          });
          document.addEventListener("keydown", this.handleKeyDown.bind(this));
        }
        disconnectedCallback() {
          document.removeEventListener("keydown", this.handleKeyDown);
        }
        attributeChangedCallback(name, oldValue, newValue) {
          if (name === "open") {
            this.isOpen = newValue !== null;
          }
        }
        handleKeyDown(e) {
          if (e.key === "Escape" && this.isOpen) {
            this.close();
          }
        }
        get isOpen() {
          return this._isOpen;
        }
        set isOpen(value) {
          if (this._isOpen === value) return;
          this._isOpen = value;
          if (value) {
            this.style.display = "block";
            document.body.style.overflow = "hidden";
            this.setAttribute("open", "");
            this.dispatchEvent(new CustomEvent("modal-open"));
          } else {
            this.style.display = "none";
            document.body.style.overflow = "";
            this.removeAttribute("open");
            this.dispatchEvent(new CustomEvent("modal-close"));
          }
        }
        open() {
          this.isOpen = true;
        }
        close() {
          this.isOpen = false;
        }
      };
      customElements.define("app-modal", ModalComponent);
    }
  });

  // src/components/crearDiccionario.ts
  var crearDiccionario;
  var init_crearDiccionario = __esm({
    "src/components/crearDiccionario.ts"() {
      "use strict";
      init_genres();
      init_modal_component();
      crearDiccionario = (form) => {
        const contenedorBusqueda = document.querySelector(".search-container");
        if (!form || !contenedorBusqueda) return;
        const botonActivador = document.createElement("button");
        botonActivador.className = "advanced-search-btn";
        botonActivador.textContent = "Advanced Search";
        const modal = document.createElement("app-modal");
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content-container";
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "modal-tags-container";
        categorias.forEach((categoria) => {
          const categoryWrapper = document.createElement("div");
          categoryWrapper.className = "category-wrapper";
          const categoryTitle = document.createElement("h4");
          categoryTitle.className = "category-title";
          categoryTitle.textContent = categoria.titulo;
          categoryWrapper.appendChild(categoryTitle);
          const tagsWrapper = document.createElement("div");
          tagsWrapper.className = "tags-wrapper";
          categoria.tags.forEach((termino) => {
            const tagButton = document.createElement("button");
            tagButton.className = "tag-button";
            tagButton.textContent = termino;
            tagButton.dataset.state = "0";
            tagButton.addEventListener("click", (e) => {
              e.preventDefault();
              const input = form.querySelector('input[type="search"]');
              if (!input) return;
              const currentState = parseInt(tagButton.dataset.state || "0");
              const newState = (currentState + 1) % 3;
              tagButton.dataset.state = newState.toString();
              tagButton.classList.remove("tag-included", "tag-excluded");
              if (newState === 1) tagButton.classList.add("tag-included");
              if (newState === 2) tagButton.classList.add("tag-excluded");
              const terminoFormateado = termino.includes(" ") ? `"${termino}"` : termino;
              const regex = new RegExp(
                `(^|\\s)-?"?${termino.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}"?(?=\\s|$)`,
                "g"
              );
              input.value = input.value.replace(regex, "").replace(/\s{2,}/g, " ").trim();
              if (newState === 1) {
                input.value += (input.value ? " " : "") + terminoFormateado;
              } else if (newState === 2) {
                input.value += (input.value ? " " : "") + "-" + terminoFormateado;
              }
              input.focus();
            });
            tagButton.addEventListener("mouseover", () => {
              if (tagButton.dataset.state === "0") {
                tagButton.classList.add("tag-hover");
              }
            });
            tagButton.addEventListener("mouseout", () => {
              tagButton.classList.remove("tag-hover");
            });
            tagsWrapper.appendChild(tagButton);
          });
          categoryWrapper.appendChild(tagsWrapper);
          tagsContainer.appendChild(categoryWrapper);
        });
        modalContent.appendChild(tagsContainer);
        modal.appendChild(modalContent);
        botonActivador.addEventListener("click", () => {
          modal.open();
        });
        document.body.appendChild(modal);
        document.body.appendChild(botonActivador);
      };
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"() {
      init_global();
      init_reorganizarElementos();
      init_crearBotonBorrar();
      init_crearDiccionario();
      function obtenerFormularioBusqueda() {
        const path = window.location.pathname;
        if (path.includes("/favorites/")) {
          return document.getElementById("favorites-search");
        } else {
          let form = document.querySelector('form[role="search"]');
          if (!form) {
            form = document.createElement("form");
            form.role = "search";
            form.action = "/search/";
            form.className = "search";
            const input = document.createElement("input");
            input.type = "search";
            input.name = "q";
            input.required = true;
            input.autocapitalize = "none";
            input.placeholder = 'e.g. tag:"big breasts" pages:>15 -milf';
            const button = document.createElement("button");
            button.type = "submit";
            button.className = "btn btn-primary btn-square";
            const icon = document.createElement("i");
            icon.className = "fa fa-search fa-lg";
            button.appendChild(icon);
            form.appendChild(input);
            form.appendChild(button);
            const header = document.querySelector("header") || document.body;
            header.prepend(form);
          }
          return form;
        }
      }
      function main() {
        const form = obtenerFormularioBusqueda();
        if (!form) return;
        form.id = "dynamic-search-form";
        reorganizarElementos(form);
        crearBotonBorrar(form);
        crearDiccionario(form);
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", main);
      } else {
        main();
      }
    }
  });
  require_main();
})();
