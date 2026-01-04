// ==UserScript==
// @name         Uptobox Tools V1
// @description  Des Tools pour lien Uptobox
// @author       Invincible812
// @version      1.0
// @match        https://www2.darkino.net/404.html
// @icon         https://uptobox.com/assets/images/utb.png
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @namespace https://greasyfork.org/fr/users/868328-invincible812
// @downloadURL https://update.greasyfork.org/scripts/460141/Uptobox%20Tools%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/460141/Uptobox%20Tools%20V1.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
  let TOKEN = ``; // METTRE ICI SON TOKEN UPTOBOX
  document.body.insertAdjacentHTML("beforeend",`<h1>Uptobox Tools</h1><textarea placeholder="INPUT : Coller liens uptobox ici" id="input" rows="25" cols="40"></textarea><textarea placeholder="SORTIE LIENS DE DL" id="output1" rows="25" cols="40"></textarea>`);
  document.body.insertAdjacentHTML("beforeend",`<button id="btn-test">LINK DE DL</button><button id="btn-reset">RESET</button><div id="output"></div>`);
  const input = document.getElementById("input"); // Là où sont coller les liens
  const output1 = document.getElementById("output1");

  function createDirectDownloadLink(link) {
    return new Promise((resolve, reject) => {
      let id = link.replace('https://uptobox.com/','');
      GM.xmlHttpRequest({
        method: "GET",
        url: `https://uptobox.com/api/link?token=${TOKEN}&file_code=${id}`,
        onload: function(response){
          let repenjson = JSON.parse(response.response);
          resolve(repenjson.data.dlLink);
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  }

  document.getElementById('btn-test').addEventListener('click', async function() {
    const lines = input.value.split('\n');
    const lineCount = lines.length;
    const dlLinks = [];

    for (let a = 0; a < lineCount; a++) {
      try {
        const dlLink = await createDirectDownloadLink(lines[a]);
        dlLinks.push(dlLink);
      } catch (error) {
        console.error(error);
      }
    }

    output1.innerHTML = dlLinks.join('\n');
  });

  document.getElementById('btn-reset').addEventListener('click', function() {
    output1.innerHTML = "";
  });
});