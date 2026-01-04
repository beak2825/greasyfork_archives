// ==UserScript==
// @name         Ofertas flash de Miravia
// @namespace    http://tampermonkey.net/
// @icon         https://img.mrvcdn.com/us/media/7bada92e11dd275f27772c5ee02194ae.png
// @version      1.1
// @description  Muestra que ofertas flash de Miravia están subidas a MC
// @author       Tu nombre
// @match        https://www.miravia.es/flashsale/home*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468287/Ofertas%20flash%20de%20Miravia.user.js
// @updateURL https://update.greasyfork.org/scripts/468287/Ofertas%20flash%20de%20Miravia.meta.js
// ==/UserScript==

(async function() {
  const processedHrefs = new Set();

  async function checkIfUploaded(url) {
    const apiURL = `https://app.michollo.com/api/deals/isDealDuplicated?url=${encodeURIComponent(url)}`;

    try {
      const response = await fetch(apiURL, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': 'Bearer API_asistenteninja;'
        }
      });

      const data = await response.text();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function checkUploadedDate(fecha) {
    const splitDate = fecha.split("/");
    const day = splitDate[0];
    const month = splitDate[1] - 1;
    const year = splitDate[2];
    const nowDate = new Date();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    const inputDate = new Date(year, month, day);

    nowDate.setHours(0, 0, 0, 0);
    yesterdayDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate.getTime() === nowDate.getTime()) {
      return "today";
    } else if (inputDate.getTime() === yesterdayDate.getTime()) {
      return "yesterday";
    } else {
      const diffDays = Math.floor((nowDate - inputDate) / (1000 * 60 * 60 * 24));

      if (diffDays >= 2 && diffDays <= 10) {
        return diffDays + " días";
      } else {
        return false;
      }
    }
  }

 function resolveEditor(name) {
    const editorMap = {
      "Mr Cronjob": "Aitor",
      "sincoleta": "Aitor",
      "BotMaster": "Aitor",
      "Finalizador": "Aitor",
      "Yeeei": "Aitor",
      "TL": "Aitor",
      "Crazy Dog": "Aitor",
      "Watch Dogs": "Aitor",
      "SamwellT": "Daniel",
      "Nereita23": "Daniel",
      "elpianista": "Daniel",
      "Señor Recio": "Daniel",
      "chemoca": "Daniel",
      "Edelmiru": "Daniel",
      "eleconomista": "Diego",
      "Dvid Mitchell": "Diego",
      "NinjaMan": "Diego",
      "Tentaculos": "Diego",
      "Dimoco": "Chema",
      "Jolin Juan": "Chema",
      "Charofertas": "Chema",
      "VuelcaTocinos": "Chema",
      "ChetomAli": "Chema",
      "Orejinas": "Chema",
      "Vuelker": "Chema",
      "FailMary": "Chema",
      "SimonDiceChollo": "Chema",
      "baldoFaraldo": "Chema",
      "Copy & Paste": "Sergio",
      "Steve Jobs": "Sergio",
      "Reacoman": "Sergio",
      "Baby Yoda": "Sergio",
      "BLOSTE": "Sergio",
      "Ruka": "Sergio",
      "elchollista": "Sergio",
      "Chollista": "Sergio",
      "Señor X": "Sergio",
      "Error 404": "Sergio",
      "Buscachollos": "Sergio",
      "El Moreno": "Hulio",
      "Maritoñi": "Hulio",
      "Burrofax": "Hulio",
      "falconeti": "Hulio",
      "balconeitor": "Hulio",
      "CEO": "Hulio",
      "Sanchinflas": "Hulio",
      "Wallatroll": "Hulio",
      "Jordi_ENP": "Hulio",
      "balda": "Hulio",
      "Angelfalls": "Joel",
      "CazadorVE": "Joel",
      "Chamo15": "Joel",
      "LatinPower": "Joel",
      "OlivoV": "Joel",
      "Lord Chollito": "Jesus",
      "Zoe Zalander": "Jesus",
      "Scaneitor": "Jesus",
      "Monitor Oller": "Jesus",
      "Merideño": "Jesus",
      "Don Copy": "Jesus",
      "Natch Scratch": "Jesus",
      "José Pinto": "Jesus",
      "Driver": "Shurperro",
      "El Bartolo": "Shurperro",
      "Gatete": "Shurperro",
      "Petinto": "Shurperro",
      "Suricato": "Shurperro",
      "Playero": "Shurperro",
      "Analista": "Shurperro"
    };

    return editorMap[name] || "";
  }

async function getDealPrice(deal_id) {
    try {
        const url = 'https://app.michollo.com/api/deals/' + deal_id;
        const response = await fetch(url);
        const jdat = await response.json();

        if (!jdat) {
            console.log('Error en la url ' + url);
        }

        if (jdat.ok === false) {
            return '';
        }

        let sale_price = jdat.deal.sale_price;

        if (sale_price) {
            sale_price = (sale_price / 100).toFixed(2) + '€';
            sale_price = sale_price.replace('.', ',');
        } else {
            sale_price = '';
        }

        if (sale_price !== null && sale_price === '0') {
            sale_price = 'GRATIS';
        }

        return sale_price;
    } catch (error) {
        console.error('Error en la función getDealPrice:', error);
        return '';
    }
}

function addUploadedText(element) {
    const href = element.getAttribute('href').match(/(.+\.html)/)[0];

    if (processedHrefs.has(href)) {
      return;
    }

    checkIfUploaded(href)
      .then(async (isUploaded) => {
        const data = JSON.parse(isUploaded);
        if (data && data.ok === true) {
          const date = data.deal.created_at.split("-").reverse().join("-");
          const dateFormatted = date.replace(/-/g, '/');
          const whenIsUploaded = checkUploadedDate(dateFormatted);
          let uploadedDateText;
          if (whenIsUploaded === 'today') {
            uploadedDateText = '<strong style="color: red;">HOY</strong>';
          } else if (whenIsUploaded === 'yesterday') {
            uploadedDateText = '<strong style="color: red;">AYER</strong>';
          } else if (whenIsUploaded !== false) {
            uploadedDateText = 'hace <strong style="color: blue;">' + whenIsUploaded + '</strong>';
          } else {
            uploadedDateText = 'el <strong style="color: blue;">' + date + '</strong>';
          }

          var username = data.deal.username;
          var linkWeb = data.deal.webpage_url
          var deal_id = linkWeb.match(/\d+(?=\/$)/)
          var dealPrice = await getDealPrice(deal_id)
          let priceTxt
          if (dealPrice !== undefined && dealPrice !== '') {
           priceTxt = ' a <b>'+dealPrice+'</b>'
          }
          var editor = resolveEditor(username);
          var resolvedUsername = editor !== "" ? " (" + editor + ")" : "";
          var text = 'Subido '+uploadedDateText+' por <b>' + username + resolvedUsername + '</b>'+priceTxt;
          console.log("añadimos div")
          const div = document.createElement('div');
            div.innerHTML = text;
            div.style.fontSize = '17px';
            div.style.display = 'inline-block';
            div.style.border = '3px solid green';
            div.style.padding = '10px';
            div.style.width = 'fit-content';
            div.style.height = 'fit-content';
            element.insertBefore(div, element.firstChild);
            processedHrefs.add(href);

        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function handleNewElements(elements) {
    elements.forEach((element) => {
      addUploadedText(element);
    });
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        const newElements = Array.from(mutation.addedNodes).filter(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE &&
            node.matches('.ProductCard--product_container--bUQ7fDO')
        );
        handleNewElements(newElements);
      }
    });
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);

  window.onload = async (event) => {
    'use strict';
    const elements = document.querySelectorAll('.ProductCard--product_container--bUQ7fDO');
    const promises = [];

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const href = element.getAttribute('href').match(/(.+\.html)/)[0];

      if (processedHrefs.has(href)) {
        continue;
      }

      const promise = checkIfUploaded(href).then(async (isUploaded) => {
        const data = JSON.parse(isUploaded);
        if (data && data.ok === true) {
          const date = data.deal.created_at.split("-").reverse().join("-");
          const dateFormatted = date.replace(/-/g, '/');
          const whenIsUploaded = checkUploadedDate(dateFormatted);
          let uploadedDateText;
          if (whenIsUploaded === 'today') {
            uploadedDateText = '<strong style="color: red;">HOY</strong>';
          } else if (whenIsUploaded === 'yesterday') {
            uploadedDateText = '<strong style="color: red;">AYER</strong>';
          } else if (whenIsUploaded !== false) {
            uploadedDateText = 'hace <strong style="color: blue;">' + whenIsUploaded + '</strong>';
          } else {
            uploadedDateText = 'el <strong style="color: blue;">' + date + '</strong>';
          }

          var username = data.deal.username;

          var editor = resolveEditor(username);
          var resolvedUsername = editor !== "" ? " (" + editor + ")" : "";
          var linkWeb = data.deal.webpage_url
          var deal_id = linkWeb.match(/\d+(?=\/$)/)
          var dealPrice = await getDealPrice(deal_id)
          let priceTxt
          if (dealPrice !== undefined && dealPrice !== '') {
           priceTxt = ' a <b>'+dealPrice+'</b>'
          }
          var text = 'Subido '+uploadedDateText+' por <b>' + username + resolvedUsername + '</b>'+priceTxt;
          console.log("añadimos div")
          const div = document.createElement('div');
          div.innerHTML = text;
          div.style.fontSize = '17px';
          div.style.display = 'inline-block';
          div.style.border = '3px solid green';
          div.style.padding = '10px';
          div.style.width = 'fit-content';
          div.style.height = 'fit-content';
          element.insertBefore(div, element.firstChild);
          processedHrefs.add(href);
        }
      }).catch((error) => {
        console.error('Error:', error);
      });

      promises.push(promise);
    }

    await Promise.all(promises);
  };
})();
