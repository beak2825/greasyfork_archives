// ==UserScript==
// @name         ShellShockers Theme Manager
// @version      2.5
// @description  Shellshockers theme manager.
// @author       helloworld
// @match        https://shellshock.io/*
// @grant        none
// @namespace https://greasyfork.org/users/841667
// @downloadURL https://update.greasyfork.org/scripts/436200/ShellShockers%20Theme%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/436200/ShellShockers%20Theme%20Manager.meta.js
// ==/UserScript==

/*
  Thank you to TDStuart for some code snippets
  And Thank you to all the people who created the themes for the game!
*/

(function () {
  let hideKey = localStorage.getItem("themeHideKey")
  if (hideKey == "undefined" || hideKey == undefined) {
    localStorage.setItem("themeHideKey", "KeyX")
  }
  document.addEventListener("keyup", e => {
    if (e.code == localStorage.themeHideKey) { //default key is KeyX.
      if (window.themeGui.panel) {
        window.themeGui.panel.container.hidden = !window.themeGui.panel.container.hidden;
      }
    }
  })
  let themes = localStorage.getItem("themes");
  if (themes == "undefined" || themes == undefined) {
    localStorage.themes = `{"Professor Jax":{"stylecss":"https://myclientsites.com/adamx/profjax/style.css","gamecss":"https://myclientsites.com/adamx/profjax/game.css"},"Nipper Ninja":{"stylecss":"https://www.myclientsites.com/adamx/shell-themes/nipperstyle.css","gamecss":"https://www.myclientsites.com/adamx/shell-themes/nippergame.css"},"Black-Green":{"stylecss":"https://myclientsites.com/adamx/shell-themes/Black-Green/style.css","gamecss":"https://myclientsites.com/adamx/shell-themes/Black-Green/game.css"},"Purple-Pink":{"stylecss":"https://www.myclientsites.com/shell-themes/Purple-Pink.css"},"Grey":{"stylecss":"https://www.myclientsites.com/shell-themes/Grey.css"},"Black-Red":{"stylecss":"https://www.myclientsites.com/shell-themes/Black-Red.css"},"Black-Red-Blue":{"stylecss":"https://www.myclientsites.com/shell-themes/Black-Red-Blue.css"},"Darkmode Goon (by MK)":{"stylecss":"https://shellmods.helloworld1976.repl.co/themes/darktheme.css"}}`
    themes = JSON.parse(localStorage.getItem("themes"))
  }
  else { themes = JSON.parse(localStorage.getItem("themes")) }

  window.themeMod = {
    loadGui: () => { },
    loadComponents: () => { },
    deleteComponents: () => { },
    modMenu: {
      themeSettings: {
        type: "None",
        container: {
          label: {},
        },
      },
    },
  };
  window._utils = {};
  window._utils.requirelib = async function (url, global) {
    return new Promise(async function (resolve) {
      async function getCode() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
      }
      let code = await getCode();

      if (global) {
        code += 'window["' + global + '"] = ' + global + ";";
      }
      let evaluateCode = new Function(code);
      evaluateCode();
      resolve("done");
    });
  };
  window._utils.requirelib("https://unpkg.com/guify@0.12.0/lib/guify.min.js")
    .then(() => {
      window.themeMod.loadGui();
    });

  function updateTheme(theme) {
    localStorage.setItem("theme", theme);
    if (theme == "Default") { removeTheme() }
    else { removeTheme(); loadTheme(); }
  }
  function loadTheme() {
    const loadtheme = localStorage.getItem("theme")
    if (loadtheme == "Default" || !loadtheme || loadtheme == undefined || loadtheme == "undefined") { return; }
    const addScript = () => {
      let style = document.createElement('link');
      style.id = "customstylecss"
      style.rel = 'stylesheet';
      style.href = themes[loadtheme].stylecss;
      document.head.appendChild(style);
      if (themes[loadtheme].gamecss) {
        let style2 = document.createElement('link');
        style2.id = "customgamecss"
        style2.rel = 'stylesheet';
        style2.href = themes[loadtheme].gamecss;
        document.head.appendChild(style2)
      }
    }
    if (document.body) {
      addScript();
    }
    else {
      document.addEventListener('DOMContentLoaded', function (e) {
        addScript();
      })
    }
  }
  function removeTheme() {
    if (document.getElementById("customstylecss")) { document.getElementById("customstylecss").remove() }
    if (document.getElementById("customgamecss")) { document.getElementById("customgamecss").remove() }
  }

  if (localStorage.getItem("theme")) { loadTheme(); }
  if (localStorage.getItem("theme") == undefined || localStorage.getItem("theme") == "undefined") { localStorage.setItem("theme", "default"); }
  function changeHideHotkey() {
    let newkey = prompt(`Enter key name (eg. "KeyX")`)
    if (newkey.startsWith("Key") && newkey.length == 4) {
      localStorage.themeHideKey = newkey
    }
    else {
      alert(`The new key must start with "Key" (eg. "KeyX")`)
    }
  }
  function addThemeSheet() {
    let url = prompt("Please enter theme stylesheet url"),
      name = prompt("Please enter name", "New Theme")
    if (url.startsWith("https://") && !name.includes('"')) {
      themes[name] = { stylecss: url };
      localStorage.themes = JSON.stringify(themes);
      window.themeMod.deleteComponents()
      window.themeMod.loadComponents()
    }
    else {
      alert(`url must start with "https://" and name must not include "`)
    }
  }
  function removeThemeSheet() {
    if (localStorage.theme !== "Default") {
      try {
        delete themes[localStorage.theme]
        localStorage.themes = JSON.stringify(themes);
        window.themeMod.deleteComponents()
        window.themeMod.loadComponents()
        updateTheme("Default")
      }
      catch {
        alert("Something went wrong.")
      }

    }
  }
  let menu, addThemeButton, removeThemeButton, hideButton, credits;
  window.themeMod.loadGui = function () {
    window.themeGui = new window.guify({
      title: "ShellShockers Theme Manager",
      theme: "dark",
      align: "left",
      width: 400,
      barMode: "none",
      opacity: 0.90,
      root: document.body,
      open: true,
    });
    window.themeMod.loadComponents()
  };
  window.themeMod.deleteComponents = () => {
    window.themeGui.Remove(menu)
    window.themeGui.Remove(addThemeButton)
    window.themeGui.Remove(removeThemeButton)
    window.themeGui.Remove(hideButton)
    window.themeGui.Remove(credits)
  }
  window.themeMod.loadComponents = () => {
    menu = window.themeGui.Register({
      type: "select",
      label: "Theme",
      object: window.themeMod.modMenu.themeSettings,
      property: "type",
      initial: localStorage.theme,
      options: ["Default", ...Object.keys(themes)],
      onChange: updateTheme,
    });
    addThemeButton = window.themeGui.Register({
      type: "button",
      label: "Add Theme",
      action: addThemeSheet,
    });
    removeThemeButton = window.themeGui.Register({
      type: "button",
      label: "Remove Current Theme",
      action: removeThemeSheet,
    });
    hideButton = window.themeGui.Register({
      type: "button",
      label: "Change Hide Hotkey",
      action: changeHideHotkey,
    });
    credits = window.themeGui.Register({
      type: "text",
      label: "Credits",
    });
    credits.container.innerHTML = `<p style="color:gray;font-size: medium;margin-bottom: 0px;padding-left: 15px;">Made by Helloworld</p>`;
  }
})();

