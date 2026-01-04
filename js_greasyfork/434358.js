// ==UserScript==
// @name         BS Favorites Backup
// @namespace    http://bs.to/
// @version      0.1
// @description  Backup and Restore Burning Series Favorites
// @author       Seker61
// @match        https://bs.to/settings/series
// @icon         https://www.google.com/s2/favicons?domain=bs.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434358/BS%20Favorites%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/434358/BS%20Favorites%20Backup.meta.js
// ==/UserScript==

(function () {
  // Insert Developer Menu
  const menue = document.getElementsByClassName('navigation menu-intern')[0];
  const setting = document.createElement('section');
  setting.classList.add('navigation', 'menu-intern');
  setting.style.margin = '10px 0 0 0';
  setting.innerHTML = '<div>Developer</div><a onclick="backup();">Favoriten Backup</a><label for="restore" id="lRestore">Favoriten Restore</label><input type="file" id="restore" name="restore" accept=".json" onchange="importJson();"></input>';
  menue.appendChild(setting);

  // Insert CSS Block
  const css = document.createElement('style');
  css.innerHTML = '#restore {display: none;} .menu-intern > a, .menu-intern > label { cursor: pointer; }';
  css.innerHTML += '#lRestore { border: 1px solid #ccc; border-top: 0px; padding: 5px 10px; width: 100%; margin: 0; background: rgba(0,0,0,0) linear-gradient(to bottom,#f6f6f6 0,#e2e2e2 100%) repeat scroll 0 0; }';
  css.innerHTML += '#lRestore:hover { background: none; }';
  document.getElementsByTagName('head')[0].appendChild(css);

  // Insert JS Block
  const js = document.createElement('script');
  js.innerHTML = `
  function backup() {
    const favoLinks = document.getElementById('series-menu').children;
    const favorites = [];

    for (const element of favoLinks) {
      favorites.push({
        id: element.dataset.id,
        name: element.innerText,
      });
    }
    exportJson(favorites);
  }

  function exportJson(exportObj) { // Export JSON File
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
    const downloadAnchorNode = document.createElement('a');

    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'BS_Favorites.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  `;
  js.innerHTML += `
  function importJson() { // Import JSON File
    const fileImport = document.getElementById('restore');
    const file = fileImport.files[0];
    const reader = new FileReader();

    if (file === undefined || file === null || file === '') {
      document.getElementById('msg').innerHTML = 'Fehler beim lesen der Datei!';
      return;
    }

    reader.onload = function read() {
      let ImportData;
      let series = [];
      try {
        ImportData = JSON.parse(reader.result);
      } catch (e) {
        document.getElementById('msg').innerHTML = 'Fehler beim parsen der Datei!';
        return;
      }
      updateFavos(ImportData);
    };
    reader.readAsText(file);
  }
  `;

  js.innerHTML += `
  function updateFavos(data) {
    let params = "token=" + document.head.querySelector('meta[name="security_token"]').content;
    data.forEach(element => {
      params += "&series%5B%5D=" + element.id;
    });

    fetch('ajax/edit-seriesnav.php', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'same-origin',
      method: 'POST',
      body: params,
    }).then((res) => {
      location.reload();
    });
  }
  `;
  document.getElementsByTagName('head')[0].appendChild(js);
}());
