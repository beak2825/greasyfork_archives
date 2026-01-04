// ==UserScript==
// @name         [DEPRECADO] Highlight de estatísticas do mokoich
// @namespace    watch?v=cE13yvrTfjA
// @version      2.0dep
// @description  Destaca posts recentes na página de estatísticas do mokoich.net |´ー｀)っ
// @match        https://mokoich.net/stats/
// @author       Coletivo sem nome, conhecido como ANONYMOUS
// @license      BEERWARE
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532678/%5BDEPRECADO%5D%20Highlight%20de%20estat%C3%ADsticas%20do%20mokoich.user.js
// @updateURL https://update.greasyfork.org/scripts/532678/%5BDEPRECADO%5D%20Highlight%20de%20estat%C3%ADsticas%20do%20mokoich.meta.js
// ==/UserScript==

/*
 * -----------------------------------------------------------------------------
 * ATENÇÃO : este script está ((DEPRECADO))
 * agora as estatísticas já são exibidas com esse script no mokoich (.net/stats)
 * então aqui fica apenas referência histórica com todas suas qualidades
 * originais e homossexuais intactas. ⊂二二二( ^ω^)二⊃ ブーン
 * sankyuu myuu-san ^^v
 * -----------------------------------------------------------------------------
 */


(function () {
  "use strict";

  // --== CFG ==--
  const defaultcfg = {
    hcolor: "#acb9ff",
    timedsp: "both",
    sord: "default",
  };

  // --== HELPER FUNCTIONS ==--

  function parsedate(dtstr) {
    if (!dtstr) return null;
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dtstr)) {
      // console.warn('mokoich stats script: invalid date format found:', dtstr);
      return null;
    }
    const normstr = dtstr.replace(" ", "T");
    const dt = new Date(normstr);
    return isNaN(dt.getTime()) ? null : dt;
  }

  // calculates relative time string ("5m atrás", "2h atrás")
  function reltime(dt) {
    if (!dt) return "";
    const now = new Date();
    const diff = now.getTime() - dt.getTime();
    const secs = Math.floor(diff / 1000);
    const mins = Math.floor(secs / 60);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `${days}d atrás`;
    if (hrs > 0) return `${hrs}h atrás`;
    if (mins > 0) return `${mins}m atrás`;
    return `${secs}s atrás`;
  }

  // --== CFG MODAL FUNCTIONS ==--
  let cfgmodal = null;
  let msgTIMEOUT = null;

  function showcfgmsg(msg, duration = 3000) {
    if (!cfgmodal) return;
    const msgel = document.getElementById("cfg-msg");
    if (!msgel) return;

    msgel.textContent = msg;
    msgel.style.maxHeight = msgel.scrollHeight + "px";
    msgel.style.opacity = "1";

    clearTimeout(msgTIMEOUT);
    msgTIMEOUT = setTimeout(() => {
      msgel.style.opacity = "0";
      msgel.style.maxHeight = "0";
    }, duration);
  }

  function closecfgmodal() {
    if (cfgmodal) {
      cfgmodal.remove();
      cfgmodal = null;
      clearTimeout(msgTIMEOUT);
    }
  }

  // cfg to storage and applies changes
  function savecfg() {
    const newcfg = { ...cfg };
    let f5required = false;
    let styleapply = false;

    const NEWcolor = document.getElementById("cfg-hcolor").value;
    const NEWtimeopt = document.querySelector(
      'input[name="cfg-timedsp"]:checked',
    ).value;
    const NEWsort = document.querySelector(
      'input[name="cfg-sord"]:checked',
    ).value;

    if (NEWcolor && NEWcolor !== cfg.hcolor) {
      newcfg.hcolor = NEWcolor;
      styleapply = true;
    }

    if (NEWtimeopt !== cfg.timedsp) {
      newcfg.timedsp = NEWtimeopt;
      f5required = true;
    }

    if (NEWsort !== cfg.sord) {
      newcfg.sord = NEWsort;
    }

    // update global cfg and save
    cfg = newcfg;
    GM_setValue("epicwin_cfg", cfg);

    if (styleapply) {
      document.documentElement.style.setProperty(
        "--highlight-base-cfg",
        cfg.hcolor,
      );
      items.forEach((li) => {
        applyhlight(li);
      });
    }

    let msg = "CFG salvada com sucesso.";
    if (f5required) {
      msg += " F5 a página para aplicar mudanças na exibição da hora. PLOX";
    }
    showcfgmsg(msg);
  }

  // --== DRAW FUNCTIONS ==--

  function DrawConfigModal() {
    if (cfgmodal) return;

    cfgmodal = document.createElement("div");
    cfgmodal.id = "cfg-modal";

    cfgmodal.innerHTML = `
            <div class="cfg-modal-content">
                <h3 class="cfg-modal-title">Configurações do Script</h3>
                <div class="cfg-modal-body">
                    <div class="cfg-row">
                        <label for="cfg-hcolor">Cor do destaque:</label>
                        <input type="text" id="cfg-hcolor" value="${cfg.hcolor}">
                    </div>
                    <div class="cfg-row">
                        <label>Time Display:</label>
                        <div class="cfg-select">
                            <label><input type="radio" name="cfg-timedsp" value="relative" ${cfg.timedsp === "relative" ? "checked" : ""}> Relativa</label>
                            <label><input type="radio" name="cfg-timedsp" value="absolute" ${cfg.timedsp === "absolute" ? "checked" : ""}> Absoluta</label>
                            <label><input type="radio" name="cfg-timedsp" value="both" ${cfg.timedsp === "both" ? "checked" : ""}> Ambas</label>
                        </div>
                    </div>
                    <div class="cfg-row">
                        <label>Sort padrão:</label>
                        <div class="cfg-select">
                            <label><input type="radio" name="cfg-sord" value="default" ${cfg.sord === "default" ? "checked" : ""}> Default</label>
                            <label><input type="radio" name="cfg-sord" value="alpha" ${cfg.sord === "alpha" ? "checked" : ""}> Nome</label>
                            <label><input type="radio" name="cfg-sord" value="time" ${cfg.sord === "time" ? "checked" : ""}> Hora</label>
                        </div>
                    </div>
                </div>
                <div class="cfg-modal-footer">
                     <span id="cfg-msg"></span>
                     <div class="cfg-button-container">
                        <button id="cfg-save" class="cfg-button">Salvar</button>
                        <button id="cfg-cancel" class="cfg-button">Cancelar</button>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(cfgmodal);

    document.getElementById("cfg-save").addEventListener("click", savecfg);
    document
      .getElementById("cfg-cancel")
      .addEventListener("click", closecfgmodal);
    cfgmodal.addEventListener("click", (ev) => {
      if (ev.target === cfgmodal) {
        closecfgmodal();
      }
    });
  }

  function DrawSettingsButton(h1Element) {
    if (!h1Element) return;
    const cfgmenuVIEW = document.createElement("span");
    cfgmenuVIEW.id = "settingsc";
    cfgmenuVIEW.textContent = "(SETTINGS)";
    cfgmenuVIEW.title = "Configurações do Script";
    cfgmenuVIEW.style.cssText = `
            cursor: pointer;
            margin-left: 8px;
            font-size: 10px;
            vertical-align: baseline;
            display: inline-block;
            color: var(--subtle-text-color);
            text-decoration: none;
            font-weight: normal;
            text-transform: uppercase;
        `;
    cfgmenuVIEW.addEventListener("click", DrawConfigModal);
    h1Element.appendChild(cfgmenuVIEW);
  }

  // controls bar (sort/filter buttons, etc)
  function DrawControls(parentElement, targetElement) {
    if (!parentElement || !targetElement) return;
    const controlsDIV = document.createElement("div");
    controlsDIV.id = "toolbar";

    controlsDIV.innerHTML = `
             <span>Sort by: </span>
             <button data-sort="default" class="toolbar-button">Default</button>
             <button data-sort="alpha" class="toolbar-button">Nome</button>
             <button data-sort="time" class="toolbar-button">Hora</button>
             <span class="toolbar-separator"> | </span>
             <span>Filtrar: </span>
             <input type="text" id="filter-text" placeholder="((((；ﾟДﾟ))))" class="toolbar-input">
             <label class="checkbox-wrapper" for="filter-new">
                 <input type="checkbox" id="filter-new" class="toolbar-checkbox check-native">
                 <span class="check-style"></span>
                 Mostrar somente novos
             </label>
         `;
    parentElement.insertBefore(controlsDIV, targetElement);

    controlsDIV.addEventListener("click", (ev) => {
      if (ev.target.matches("button.toolbar-button[data-sort]")) {
        sortitems(ev.target.dataset.sort);
      }
    });

    document
      .getElementById("filter-text")
      .addEventListener("input", applyfilters);
    document
      .getElementById("filter-new")
      .addEventListener("change", applyfilters);

    return controlsDIV;
  }

  // moe
  function DrawMascot() {
    const mascotIMG = document.createElement("img");
    mascotIMG.id = "script-mascot";
    mascotIMG.src = "https://mokoich.net/tan.png";
    mascotIMG.style.cssText = `
                position: fixed;
                bottom: -80px;
                right: -70px;
                width: 400px;
                height: auto;
                z-index: 9900;
                pointer-events: none;
                opacity: 0.5;
            `;
    document.body.appendChild(mascotIMG);
  }

  // --== STANDARD ==--

  function applyhlight(li) {
    li.style.backgroundColor = "transparent";
    li.style.fontWeight = "normal";
    li.style.color = "";
    li.classList.remove("new");

    if (li.dataset.isNew === "true") {
      li.classList.add("new");
      li.style.backgroundColor = "var(--highlight-base)";
      li.style.color = "var(--highlight-text)";
      li.style.fontWeight = "bold";
    }
  }

  // sorts based on criteria
  function sortitems(criteria) {
    const itemstosort = Array.from(list.querySelectorAll("li"));

    itemstosort.sort((a, b) => {
      if (criteria === "alpha") {
        const namea = a.dataset.name.toLowerCase();
        const nameb = b.dataset.name.toLowerCase();
        return namea.localeCompare(nameb);
      } else if (criteria === "time") {
        const timea = parseInt(a.dataset.dtstamp || 0);
        const timeb = parseInt(b.dataset.dtstamp || 0);
        return timeb - timea;
      } else {
        // default
        return items.indexOf(a) - items.indexOf(b);
      }
    });
    itemstosort.forEach((li) => list.appendChild(li));

    const controlsDIV = document.getElementById("toolbar");
    if (controlsDIV) {
      controlsDIV
        .querySelectorAll("button.toolbar-button[data-sort]")
        .forEach((btn) => {
          btn.classList.toggle("sort-active", btn.dataset.sort === criteria);
        });
    }
  }

  function applyfilters() {
    const filtertxt = document
      .getElementById("filter-text")
      .value.toLowerCase();
    const shownewonly = document.getElementById("filter-new").checked;
    items.forEach((li) => {
      const name = li.dataset.name.toLowerCase();
      const isnew = li.dataset.isNew === "true";
      const namematch = !filtertxt || name.includes(filtertxt);
      const newmatch = !shownewonly || isnew;
      li.classList.toggle("ない", !(namematch && newmatch));
    });
  }

  // --== MAIN SCRIPT LOGIC ==--

  let cfg = GM_getValue("epicwin_cfg", defaultcfg);
  cfg = { ...defaultcfg, ...cfg };

  document.documentElement.style.setProperty(
    "--highlight-base-cfg",
    cfg.hcolor,
  );

  const lastview = GM_getValue("epicwin_lview", 0);
  const sd = GM_getValue("epicwin", []);

  // --====--
  const h1 = document.querySelector("h1");
  DrawSettingsButton(h1);

  const list = document.querySelector("ul");
  if (!list) return;
  const items = Array.from(list.querySelectorAll("li"))
  let itemsdat = [];
  let hasnew = false;
  const origtitle = document.title;

  items.forEach((li) => {
    const a = li.querySelector("a");
    if (!a) return;

    const link = a.href;
    const orightml = li.innerHTML;
    const txt = li.textContent;
    const rgx = txt.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/);
    const dtstr = rgx ? rgx[0] : null;
    const dt = parsedate(dtstr);

    // li.dataset.originalHtml = orightml;
    li.dataset.name = a.textContent.trim();
    li.dataset.dtstr = dtstr || "";
    li.dataset.dtstamp = dt ? dt.getTime() : 0;

    const itemdata = { link, dateTime: dtstr, el: li, dt };
    itemsdat.push(itemdata);

    const last = sd.find((p) => p.link === link);
    const lastdt = last ? parsedate(last.dateTime) : null;

    let isnew = false;

    if (dt) {
      const dtms = dt.getTime();
      const isupdated = !last || (lastdt && dtms > lastdt.getTime());

      if (isupdated || dtms > lastview) {
        isnew = true;
        hasnew = true;

      }
    }

    li.dataset.isNew = isnew;

    // modify li content
    if (dtstr && dt) {
      let timedispcont = "";
      const datepart = `<span class="date">${rgx[1]}</span>`;
      const timepart = `<span class="time">${rgx[2]}</span>`;
      const relpart = `<span class="relative-time">(${reltime(dt)})</span>`;
      const separator = " | ";

      if (cfg.timedsp === "relative") {
        timedispcont = `${relpart}`;
      } else if (cfg.timedsp === "absolute") {
        timedispcont = `${datepart}${separator}${timepart}`;
      } else {
        // both
        timedispcont = `${datepart}${separator}${timepart} ${relpart}`;
      }
      li.innerHTML = orightml.replace(
        dtstr,
        `<span class="date-time">${timedispcont}</span>`,
      );
    }
    applyhlight(li);
  });

  DrawControls(list.parentNode, list);

  const smalls = document.querySelectorAll("small");
  let lastupdateORIG = null;
  smalls.forEach((sm) => {
    if (sm.textContent.includes("Last updated:")) {
      lastupdateORIG = sm;
    }
  });

  if (lastupdateORIG) {
    const rgx = lastupdateORIG.textContent.match(
      /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/,
    );
    if (rgx) {
      const dt = parsedate(rgx[0]);
      if (dt) {
        lastupdateORIG.innerHTML += ` <span class="relative-time" style="font-weight: bold;">(${reltime(dt)})</span>`;
      }
    }
  }

  // --== CSS ==--
  const css = document.createElement("style");
  css.textContent = `
        :root {
            --bg-color: #fff;
            --text-color: #000;
            --heading-color: #333;
            --subtle-text-color: #666;
            --link-color: blue;
            --link-hover-color: red;
            --separator-color: #ccc;
            --highlight-base-cfg: ${cfg.hcolor};
            --highlight-base: var(--highlight-base-cfg);
            --highlight-text: #000;
            --button-bg-start: #f8f8f8;
            --button-bg-end: #e0e0e0;
            --button-border: #bbb;
            --button-text: #333;
            --button-hover-bg-start: #fff;
            --button-hover-bg-end: #e8e8e8;
            --button-active-bg-start: #d8d8d8;
            --button-active-bg-end: #f0f0f0;
            --input-bg: #fff;
            --input-border: #aaa;
            --modal-bg: #fff;
            --modal-overlay: rgba(0,0,0,0.5);
            --modal-border: #ccc;
            --modal-header-bg: #eee;
            --modal-header-border: #ccc;
            --sort-active-bg-start: var(--button-active-bg-start);
            --sort-active-bg-end: var(--button-active-bg-end);

            --styled-check-bg: #ffffff;
            --styled-check-border-light: #dfdfdf;
            --styled-check-border-dark: #808080;
            --styled-check-mark: #000000;
            --styled-check-active-bg: #f0f0f0;
            --styled-focus-shadow: 0 0 0 2px var(--link-color);
            --tooltip-color: #444;
        }

        body {
            font-family: MS PGothic, sans-serif !important;
            line-height: 1.6; margin: 2em;
            background-color: var(--bg-color);
            color: var(--text-color);
        }
        h1 {
            margin-bottom: 0.5em; font-size: 1.8em;
            color: var(--heading-color);
            font-family: MS PGothic, sans-serif !important;
        }
        small {
            margin-bottom: 0.5em; display: block; font-size: 0.9em;
            color: var(--subtle-text-color);
            font-family: MS PGothic, sans-serif !important;
        }
        small .relative-time { color: var(--subtle-text-color); font-weight: bold; }
        ul { list-style-type: none; padding: 0; font-family: MS PGothic, sans-serif !important; }
        li {
            margin-bottom: 0.5em; font-family: MS PGothic, sans-serif !important;
            padding: 0.2em 0.4em; border-radius: 3px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        li a {
            color: var(--link-color);
            font-family: MS PGothic, sans-serif !important;
            text-decoration: underline;
        }
        li a:hover { color: var(--link-hover-color); }

        .date-time .relative-time { color: var(--subtle-text-color); margin-left: 0.4em; font-weight: bold; }
        .date-time {
            display: inline-block; margin-left: 0.5em;
            color: var(--text-color);
            font-size: 0.9em;
        }
        li.new {
        }

        #toolbar {
            font-family: MS PGothic, sans-serif !important;
            margin-bottom: 1.5em;
            padding-bottom: 1em;
            border-bottom: 1px solid var(--separator-color);
            padding-top: 1em;
            border-top: 1px solid var(--separator-color);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 5px 10px;
        }
        #toolbar > * { margin: 0; }
        .toolbar-separator { color: var(--separator-color); }

        .toolbar-button, .cfg-button {
            font-size: 0.9em; font-family: MS PGothic, sans-serif !important;
            cursor: pointer; padding: 2px 8px;
            border: 1px solid var(--button-border); border-radius: 3px;
            color: var(--button-text);
            background: linear-gradient(to bottom, var(--button-bg-start) 0%, var(--button-bg-end) 100%);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
            transition: background 0.1s ease;
            vertical-align: middle;
            margin: 0 5px;
        }
        .cfg-button { padding: 5px 15px; margin: 0 0 0 10px; }

        .toolbar-button:hover, .cfg-button:hover {
             background: linear-gradient(to bottom, var(--button-hover-bg-start) 0%, var(--button-hover-bg-end) 100%);
        }
        .toolbar-button:active, .cfg-button:active {
            background: linear-gradient(to bottom, var(--button-active-bg-start) 0%, var(--button-active-bg-end) 100%);
            box-shadow: inset 0 1px 1px rgba(0,0,0,0.2);
        }
        .toolbar-button.sort-active {
            background: linear-gradient(to bottom, var(--sort-active-bg-start) 0%, var(--sort-active-bg-end) 100%);
            font-weight: bold;
            box-shadow: inset 0 1px 1px rgba(0,0,0,0.1);
        }

        .toolbar-input {
            font-size: 0.9em; font-family: MS PGothic, sans-serif !important;
            padding: 3px 4px; border-radius: 3px;
            background-color: var(--input-bg);
            border: 1px solid var(--input-border);
            color: var(--text-color);
            vertical-align: middle;
        }
        .ない { display: none; }

        #cfg-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: var(--modal-overlay); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
            font-family: sans-serif !important;
        }
        .cfg-modal-content {
            background: var(--modal-bg); padding: 0;
            border-radius: 5px;
            border: 1px solid var(--modal-border); min-width: 350px; max-width: 505px;
            color: var(--text-color);
            overflow: hidden;
            display: flex; flex-direction: column;
        }
        .cfg-modal-title {
            color: var(--heading-color);
            background-color: var(--modal-header-bg);
            padding: 15px 15px 10px;
            margin: 0;
            font-size: 1.1em;
            text-align: center;
            border-bottom: 1px solid var(--modal-header-border);
            flex-shrink: 0;
        }
        .cfg-modal-body {
            padding: 20px 25px;
            flex-grow: 1;
            overflow-y: auto;
        }
        .cfg-modal-footer {
            padding: 10px 15px 10px 25px;
            border-top: 1px solid var(--modal-header-border);
            background-color: var(--modal-header-bg);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            min-height: 40px;
        }
        #cfg-msg {
             flex-grow: 1;
             margin-right: 15px;
             font-size: 0.9em;
             color: var(--subtle-text-color);
             opacity: 0;
             max-height: 0;
             overflow: hidden;
             transition: opacity 0.5s ease, max-height 0.3s ease;
             line-height: 1.3;
        }
        .cfg-button-container {
             flex-shrink: 0;
        }

        .cfg-row { margin-bottom: 15px; display: flex; align-items: center; font-size: 0.9em;}
        .cfg-row > label:first-child {
            margin-right: 10px; min-width: 150px; text-align: right; flex-shrink: 0;
        }
         .cfg-row input[type="text"] {
            padding: 4px 6px; flex-grow: 1; border-radius: 3px;
            background-color: var(--input-bg);
            border: 1px solid var(--input-border);
            color: var(--text-color);
        }
        .cfg-select { display: flex; flex-grow: 1; }
        .cfg-select label { min-width: initial; margin-right: 15px; font-weight: normal;}
        .cfg-select input { margin-right: 4px; }

        .cfg-tooltip {
            display: inline-block;
            margin-left: 8px;
            font-size: 0.9em;
            color: var(--tooltip-color);
            cursor: help;
            vertical-align: middle;
        }

        .checkbox-wrapper {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            position: relative;
            vertical-align: middle;
            font-size: 0.9em;
            font-family: MS PGothic, sans-serif !important;
            color: var(--text-color);
        }
        .check-native {
            position: absolute;
            opacity: 0;
            width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
            overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap;
        }
        .check-style {
            display: inline-block;
            width: 13px;
            height: 13px;
            background-color: var(--styled-check-bg);
            border-style: solid;
            border-width: 1px;
            border-color: var(--styled-check-border-light) var(--styled-check-border-dark) var(--styled-check-border-dark) var(--styled-check-border-light);
            margin-right: 0.5em;
            position: relative;
            flex-shrink: 0;
             box-shadow: 1px 1px 0px 0px var(--styled-check-border-dark) inset,
                       -1px -1px 0px 0px var(--styled-check-border-light) inset;
             box-sizing: border-box;
             transition: background-color 0.05s linear;
        }
        .check-style::after {
            content: "";
            position: absolute;
            display: none;
            box-sizing: border-box;
            left: 3px;
            top: 1px;
            width: 5px;
            height: 8px;
            border: solid var(--styled-check-mark);
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
            pointer-events: none;
        }
        .check-native:checked + .check-style::after {
            display: block;
        }
        .checkbox-wrapper:active .check-style {
             background-color: var(--styled-check-active-bg);
        }
         .check-native:focus-visible + .check-style {
            outline: none;
            box-shadow: var(--styled-focus-shadow);
        }
        .checkbox-wrapper span:not(.check-style) {
             vertical-align: middle;
        }

    `;
  document.head.appendChild(css);

  // --== OH GRAND FINALE ==--
  sortitems(cfg.sord);

  // might make a native 'keep page open, and it refreshes itself on the bg' kind of thing later (?)
  // sounds really annoying
  if (hasnew) {
    document.title = "* " + origtitle;
  }

  const datatosave = itemsdat.map((d) => ({
    link: d.link,
    dateTime: d.dateTime,
  }));
  GM_setValue("epicwin", datatosave);
  GM_setValue("epicwin_lview", new Date().getTime());

  DrawMascot();

  // --== MENU COMMAND ==--
  GM_registerMenuCommand("CFG", DrawConfigModal);
})();