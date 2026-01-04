// ==UserScript==
// @name         Michollo API Check
// @icon         https://www.google.com/s2/favicons?sz=64&domain=michollo.com
// @version      3.2.7
// @description  Comprobar si un producto está subido a web
// @author       xxdamage
// @match        https://www.miravia.es/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.co.uk/*
// @match        https://es.aliexpress.com/*
// @match        https://www.elcorteingles.es/*
// @match        https://www.mediamarkt.es/*
// @match        https://www.carrefour.es/*
// @match        https://www.pccomponentes.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @namespace https://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/464816/Michollo%20API%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/464816/Michollo%20API%20Check.meta.js
// ==/UserScript==

// INTRODUCE AQUÍ TU ID DE USUARIO DE TELEGRAM.
var user_id = ''

function copyToClipboard(text) {
    GM_setClipboard(text);
}

function getImageFromURL(url) {
  let imageURL = false;

  if (url.includes('amazon.') && url.match(/\b(([0-9]{9}[0-9X])|(B[0-9A-Z]{9}))\b/)) {
    let imageElement = document.getElementById('landingImage');
    if (imageElement && imageElement.hasAttribute('data-old-hires')) {
      imageURL = imageElement.getAttribute('data-old-hires');
    }
    if (!imageURL) {
      imageElement = document.querySelector('#imgTagWrapperId img');
      imageURL = imageElement.getAttribute('src');
    }
  } else if (url.includes('es.aliexpress.com') && (url.includes('/item/') || url.includes('/product/'))) {
    const imageElement = document.querySelector('.magnifier-image');
    if (imageElement && imageElement.hasAttribute('src')) {
      imageURL = imageElement.getAttribute('src');
    }
  }

  if (!imageURL) {
    const imageElement = document.querySelector('meta[property="og:image"]');
    if (imageElement) {
      imageURL = imageElement.getAttribute('content');
    }
  }

  if (url.includes('carrefour.es')){
    imageURL = imageURL.replace('100x', '1000x');
  }

  return imageURL;
}


function htmlToText(html) {
  var temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.innerText;
}

async function getDealInfo(deal_id){
    let url = 'https://app.michollo.com/api/deals/'+deal_id
    const response = await fetch(url)
    var jdat = await response.json();
    console.log(jdat)
    if (!jdat){
        console.log('Error en la url '+url)
    }
    let name = jdat.deal.name
    console.log(name)
    let sale_price = jdat.deal.sale_price
    let old_price = jdat.deal.old_price
    //let offer_url = jdat.deal.offer_url
    let image_url = jdat.deal.image_url
    let user = jdat.deal.user.username
    let userid = jdat.deal.user.id
    var store = ''
    if (jdat.deal.store){
        store = (jdat.deal.store[0].name)
        store = store.replace(' ', '')
        store = store.replace('-', '')
        store = store.match(/(\w+)\.?/)
        store = store[1]
    }else{
        store = ''
    }

    if (old_price){
        old_price = (old_price/100)+'€'
        old_price = old_price.replace('.', ',')
    }else{

    }
    var sale_price_txt = ''
    if (sale_price){
        sale_price_txt = ' solo ' +(sale_price/100)+'€'
        sale_price = (sale_price/100)+'€'
        sale_price = sale_price.replace('.', ',')
        sale_price_txt = sale_price_txt.replace('.', ',')
    }
    if (sale_price!== null && sale_price == '0'){
        sale_price_txt = ' GRATIS'
        sale_price = 'GRATIS'
    }
    if (!sale_price){
        sale_price_txt = ''
        sale_price = ''
    }
    var coupon = ''
    if (jdat.deal.coupons && jdat.deal.coupons[0] && jdat.deal.coupons[0].code){
        coupon = jdat.deal.coupons[0].code
    }else{
        coupon = ''
    }

    var description = jdat.deal.description;

    var cleanDescription = description.replace(/(\[https?:\/\/[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9\\u00C0-\\u00FF@:%_+.~#?&\/\/=*|;,()]*\])\s?/g, '')
    cleanDescription = htmlToText(cleanDescription)
    cleanDescription = cleanDescription.match(/^([\s\S]*?)(❗|🛡|✅|❕|$)/)[1]
    var text = `/plantilla #formulario
cabecera=PRECIAZO
enlace=${jdat.deal.offer_url}
hashtag=${store}
titulo=${jdat.deal.name}
precio=${sale_price}
pvp=${old_price}
cupon=${coupon}
imagen=${image_url}
editarimagen=si
canal=
tienda=${store}
bandera=
extra=
pagado=
autoapp=si
campaña=
descripcion_imagen=
descripcion=${cleanDescription}`
    return text
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


function checkIfIsProduct(url){
    switch(url) {
        case 'amazon':
            if (url.match(/\b(([0-9]{9}[0-9X])|(B[0-9A-Z]{9}))\b/)){return true}
            break;
        case 'mediamarkt':
            if (url.match(/(product\/.+\.html)/)){return true}
            break;
    }
}

function checkUploadedDate(fecha) {
  let splitDate = fecha.split("/");
  let day = splitDate[0];
  let month = splitDate[1] - 1;
  let year = splitDate[2];
  let nowDate = new Date();
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  let inputDate = new Date(year, month, day);

  nowDate.setHours(0, 0, 0, 0);
  yesterdayDate.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate.getTime() === nowDate.getTime()) {
    return "today";
  } else if (inputDate.getTime() === yesterdayDate.getTime()) {
    return "yesterday";
  } else {
    let diffDays = Math.floor((nowDate - inputDate) / (1000 * 60 * 60 * 24));

    if (diffDays >= 2 && diffDays <= 10) {
      return diffDays + " días";
    } else {
      return false;
    }
  }
}


function showPopupAlert(message) {
  var popupAlert = document.createElement('div');
  popupAlert.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background-color: #fff; border: 1px solid #ccc; padding: 10px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);';
  var alertText = document.createTextNode(message);
  popupAlert.appendChild(alertText);
  document.body.appendChild(popupAlert);
  setTimeout(function() {
    popupAlert.parentNode.removeChild(popupAlert);
  }, 3000);
}

async function createAlert(text, link, weblink) {
    var deal_id = weblink.match(/\d+(?=\/$)/)
    var editPanelButton = document.createElement('button');
    editPanelButton.textContent = '✏️ PANEL';
    editPanelButton.style.padding = '10px';
    editPanelButton.style.borderRadius = '20px';
    editPanelButton.style.backgroundColor = '#7d7a7b';
    editPanelButton.style.color = 'white';
    editPanelButton.style.cursor = 'pointer';
    editPanelButton.style.outline = 'none';
    editPanelButton.style.border = 'none'
    editPanelButton.style.fontSize = '15px';
    editPanelButton.addEventListener('click', function() {
        window.open(link, '_blank');
    });

    var closeButton = document.createElement('button');
    closeButton.textContent = '❌';
    closeButton.style.padding = '5px';
    closeButton.style.backgroundColor = '#b7b1fc';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.style.outline = 'none';
    closeButton.style.border = 'none'
    closeButton.addEventListener('click', function() {
        alert.remove();
    });

    var viewWeb = document.createElement('button');
    viewWeb.textContent = '🌐 WEB';
    viewWeb.style.padding = '5px';
    viewWeb.style.borderRadius = '20px';
    viewWeb.style.backgroundColor = '#7d7a7b';
    viewWeb.style.color = 'white';
    viewWeb.style.cursor = 'pointer';
    viewWeb.style.outline = 'none';
    viewWeb.style.border = 'none'
    viewWeb.style.fontSize = '15px';
    viewWeb.addEventListener('click', function() {
        window.open(weblink, '_blank');
    });

    var formTG = document.createElement('button');
    formTG.textContent = '📝 Form';
    formTG.style.padding = '5px';
    formTG.style.borderRadius = '20px';
    formTG.style.backgroundColor = '#7d7a7b';
    formTG.style.color = 'white';
    formTG.style.cursor = 'pointer';
    formTG.style.outline = 'none';
    formTG.style.border = 'none'
    formTG.style.fontSize = '15px';
    formTG.addEventListener('click', async function() {
        if (user_id == ''){
            return window.alert('❌ Especifica tu ID de usuario arriba de todo, en var user_id = \'\'. Para saber tu ID de usuario mándale un mensaje a @getidsbot')
        }
        formTG.disabled = true
        var formText = await getDealInfo(deal_id);
        var url = "https://api.telegram.org/bot1544163969:AAGc3g9UFSLT7sEeN2IWHnKmx21QZIYl0vI/sendMessage?chat_id="+parseInt(user_id)+"&text=" + encodeURIComponent(formText);
        await fetch(url);
        formTG.textContent = '✅ Hecho';
        setTimeout(function() {
            formTG.textContent = '📝 Form';
            formTG.disabled = false;
        }, 2000);
    });

    var duplicatePost = document.createElement('button');
    duplicatePost.textContent = '🔄 Vuelker';
    duplicatePost.style.padding = '5px';
    duplicatePost.style.borderRadius = '20px';
    duplicatePost.style.backgroundColor = '#7d7a7b';
    duplicatePost.style.color = 'white';
    duplicatePost.style.cursor = 'pointer';
    duplicatePost.style.outline = 'none';
    duplicatePost.style.border = 'none'
    duplicatePost.style.fontSize = '15px';
    duplicatePost.addEventListener('click', async function() {
        try {
            formTG.disabled = true
            duplicatePost.textContent = '🔄 Cargando...';
            var duplicateResult = await duplicateDealToMC(deal_id)
            var link = 'https://paneladmin.michollo.com/#/post/edicion/' + duplicateResult.deal_id;
            window.open(link, '_blank');
            duplicatePost.textContent = '🔄 Vuelker ';
            duplicatePost.disabled = false;
        } catch (error) {
            console.error(error);
        }
    });

    var copyProductImage = document.createElement('button');
    copyProductImage.textContent = '🌄 Cop.Img';
    copyProductImage.style.padding = '5px';
    copyProductImage.style.borderRadius = '20px';
    copyProductImage.style.backgroundColor = '#7d7a7b';
    copyProductImage.style.color = 'white';
    copyProductImage.style.cursor = 'pointer';
    copyProductImage.style.outline = 'none';
    copyProductImage.style.border = 'none'
    copyProductImage.style.fontSize = '15px';
    copyProductImage.addEventListener('click', async function() {
        copyProductImage.disabled = true
        var image = getImageFromURL(visitedUrl)
        copyToClipboard(image)
        copyProductImage.textContent = '✅ Img copiada';
        setTimeout(function() {
            copyProductImage.textContent = '🌄 Cop.Img';
            copyProductImage.disabled = false;
        }, 2000);
    });

    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-evenly';
    buttonsContainer.style.gap = '5px'

    buttonsContainer.appendChild(closeButton);
    buttonsContainer.appendChild(viewWeb);
    buttonsContainer.appendChild(editPanelButton);
    buttonsContainer.appendChild(formTG);
    buttonsContainer.appendChild(duplicatePost);
    buttonsContainer.appendChild(copyProductImage);
    buttonsContainer.style.marginTop = '5px';

    var alert = document.createElement('div');
    alert.innerHTML = text;
    alert.style.fontSize = "15px";
    alert.style.marginBottom = '20px';
    alert.style.position = 'fixed';
    alert.style.top = '100px';
    alert.style.right = '20px';
    alert.style.borderRadius = '20px';
    alert.style.maxWidth = '400px';
    alert.style.maxHeight = '300px';
    alert.style.padding = '10px';
    alert.style.backgroundColor = '#b7b1fc';
    alert.style.color = 'black';
    alert.style.textAlign = 'center';
    //alert.style.opacity = '0.7';
    alert.style.zIndex = '9999';
    alert.appendChild(buttonsContainer);
    document.body.appendChild(alert);
}


async function uploadDealToMC(productURL) {
    var description = ``
    if (productURL.includes('miravia')){
        description = `<p>&nbsp;</p><p>❗️ Coge el <a href="https://a.michollo.to/nZT4K">cup&oacute;n de bienvenida del 20%</a><br />🛡 <a href="${productURL}">${productURL} </a></p>`
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://app.michollo.com/api/admin/deals-uploadDeal", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr.statusText);
                }
            }
        };
        const postData = {
            offer_url: productURL,
            description: description
        };
        xhr.send(JSON.stringify(postData));
    });
}

async function duplicateDealToMC(deal_id) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://app.michollo.com/api/admin/deal-duplicate", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr.statusText);
                }
            }
        };
        const postData = {
            deal_id: deal_id,
        };
        xhr.send(JSON.stringify(postData));
    });
}



async function createAlertUploadToMC(productURL) {
    var closeButton = document.createElement('button');
    closeButton.textContent = '❌';
    closeButton.style.padding = '5px';
    //closeButton.style.borderRadius = '20px';
    closeButton.style.backgroundColor = '#b7b1fc';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.style.outline = 'none';
    closeButton.style.border = 'none'
    closeButton.addEventListener('click', function() {
        alert.remove();
    });
    var uploadToMcButton = document.createElement('button');
    uploadToMcButton.textContent = '➕ Subir a PANEL';
    uploadToMcButton.style.padding = '10px';
    uploadToMcButton.style.borderRadius = '20px';
    uploadToMcButton.style.backgroundColor = '#7d7a7b';
    uploadToMcButton.style.color = 'white';
    uploadToMcButton.style.cursor = 'pointer';
    uploadToMcButton.style.outline = 'none';
    uploadToMcButton.style.border = 'none';
    uploadToMcButton.addEventListener('click', async function() {
        try {
            uploadToMcButton.textContent = '🔄 Cargando...';
            uploadToMcButton.disabled = true;
            var sendPost = await uploadDealToMC(productURL);

            var link = 'https://paneladmin.michollo.com/#/post/edicion/' + sendPost.deal_id;
            alert.remove();
            window.open(link, '_blank');
        } catch (error) {
            console.error(error);
        }
    });

    var copyProductImage = document.createElement('button');
    copyProductImage.textContent = '🌄 Cop.Img';
    copyProductImage.style.padding = '5px';
    copyProductImage.style.borderRadius = '20px';
    copyProductImage.style.backgroundColor = '#7d7a7b';
    copyProductImage.style.color = 'white';
    copyProductImage.style.cursor = 'pointer';
    copyProductImage.style.outline = 'none';
    copyProductImage.style.border = 'none'
    copyProductImage.style.fontSize = '15px';
    copyProductImage.addEventListener('click', async function() {
        copyProductImage.disabled = true
        var image = getImageFromURL(visitedUrl)
        copyToClipboard(image)
        copyProductImage.textContent = '✅ Img copiada';
        setTimeout(function() {
            copyProductImage.textContent = '🌄 Cop.Img';
            copyProductImage.disabled = false;
        }, 2000);
    });

    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-evenly';

    buttonsContainer.appendChild(closeButton);
    buttonsContainer.appendChild(uploadToMcButton);
    buttonsContainer.appendChild(copyProductImage);
    buttonsContainer.style.marginTop = '5px';

    var alert = document.createElement('div');
    alert.innerHTML = '<b>Pulsa el botón para subir este producto a panel</b>';
    alert.style.marginBottom = '20px';
    alert.style.position = 'fixed';
    alert.style.top = '100px';
    alert.style.right = '20px';
    alert.style.borderRadius = '20px';
    alert.style.maxWidth = '400px';
    alert.style.maxHeight = '300px';
    alert.style.padding = '10px';
    alert.style.backgroundColor = '#b7b1fc';
    alert.style.color = 'black';
    alert.style.textAlign = 'center';
    alert.style.zIndex = '9999';
    alert.appendChild(buttonsContainer);
    document.body.appendChild(alert);
}

function checkVisitedUrl(visitedUrl) {
    if (visitedUrl.includes('amazon') && !visitedUrl.match(/\b(([0-9]{9}[0-9X])|(B[0-9A-Z]{9}))\b/)) {
        return false;
    }

    if (visitedUrl.includes('mediamarkt') && !visitedUrl.includes('product/')) {
        return false;
    }

    if (visitedUrl.includes('miravia') && !visitedUrl.includes('p/')) {
        return false;
    }

    return true;
}

var visitedUrl = window.location.href;

function resolveEditor(name) {
  let editor;

  switch (name) {
    case "Mr Cronjob":
    case "sincoleta":
    case "BotMaster":
    case "Finalizador":
    case "Yeeei":
    case "TL":
    case "Crazy Dog":
    case "Watch Dogs":
      editor = "Aitor";
      break;
    case "SamwellT":
    case "Nereita23":
    case "elpianista":
    case "Señor Recio":
    case "chemoca":
    case "Edelmiru":
      editor = "Daniel";
      break;
    case "eleconomista":
    case "Dvid Mitchell":
    case "NinjaMan":
    case "Tentaculos":
      editor = "Diego";
      break;
    case "Dimoco":
    case "Jolin Juan":
    case "Charofertas":
    case "VuelcaTocinos":
    case "ChetomAli":
    case "Orejinas":
    case "Vuelker":
    case "FailMary":
    case "SimonDiceChollo":
    case "baldoFaraldo":
      editor = "Chema";
      break;
    case "Copy & Paste":
    case "Steve Jobs":
    case "Reacoman":
    case "Baby Yoda":
    case "BLOSTE":
    case "Ruka":
    case "elchollista":
    case "Chollista":
    case "Señor X":
    case "Error 404":
    case "Buscachollos":
    case "Señor X":
      editor = "Sergio";
      break;
    case "El Moreno":
    case "Maritoñi":
    case "Burrofax":
    case "falconeti":
    case "balconeitor":
    case "CEO":
    case "Sanchinflas":
    case "Wallatroll":
    case "Jordi_ENP":
    case "balda":
      editor = "Hulio";
    break;
    case "Angelfalls":
    case "CazadorVE":
    case "Chamo15":
    case "LatinPower":
    case "OlivoV":
      editor = "Joel";
      break;
    case "Lord Chollito":
    case "Zoe Zalander":
    case "Scaneitor":
    case "Monitor Oller":
    case "Merideño":
    case "Don Copy":
    case "Natch Scratch":
    case "José Pinto":
      editor = "Jesus";
      break;
    case "Driver":
    case "El Bartolo":
    case "Gatete":
    case "Petinto":
    case "Suricato":
    case "Playero":
    case "Analista":
      editor = "Shurperro";
      break;
    default:
      editor = "";
      break;
  }

  return editor;
}


async function processOnLoad(visitedUrl) {
  'use strict';
  var allowProcess = checkVisitedUrl(visitedUrl)
  if (!allowProcess) {
    return false;
  }
  const url = 'https://app.michollo.com/api/deals/isDealDuplicated?url=' + encodeURIComponent(visitedUrl);
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    headers: {
      'Authorization': 'Bearer API_asistenteninja;'
    },

    onload: async function(response) {
      var data = JSON.parse(response.responseText);
      if (data && data.ok == true) {
        var date = data.deal.created_at.split("-").reverse().join("-");
        var dateFormatted = date.replace(/-/g, '/');
        var whenIsUploaded = checkUploadedDate(dateFormatted);
        var uploadedDateText = '';

        if (whenIsUploaded == 'today') {
          uploadedDateText = '<strong style="color: red;">HOY</strong>';
        } else if (whenIsUploaded == 'yesterday') {
          uploadedDateText = '<strong style="color: red;">AYER</strong>';
        } else if (whenIsUploaded !== false) {
          uploadedDateText = 'hace <strong style="color: red;">' + whenIsUploaded + '</strong>';
        } else {
          uploadedDateText = 'el <strong style="color: red;">' + date + '</strong>';
        }
        var linkWeb = data.deal.webpage_url
        var link = data.deal.link_panel;
        var username = data.deal.username;

        var deal_id = linkWeb.match(/\d+(?=\/$)/)
        var dealPrice = await getDealPrice(deal_id)
        var editor = resolveEditor(username);
        var resolvedUsername = editor !== "" ? " (" + editor + ")" : "";
        var text = '<b>[' + dealPrice + ']</b> Producto subido a MC ' + uploadedDateText + ' por usuario <b>' + username + resolvedUsername + '</b>';
        createAlert(text, link, linkWeb)
      } else {
        await createAlertUploadToMC(visitedUrl)
      }
    }
  });
}

async function checkStore(sellerId) {
    const apiURL = `https://app.michollo.com/api/michollo/search-store-excel?store=${sellerId}`;

    try {
      const response = await fetch(apiURL, {
        method: 'GET',
        mode: 'cors',
      });

      const data = await response.text();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }


function getAmazonSellerID(){
    var sellerProfileTriggerElement = (document.querySelector('#sellerProfileTriggerId') || document.querySelector('span.a-profile-descriptor'));
    if (sellerProfileTriggerElement) {
        var sellerProfileTriggerId = sellerProfileTriggerElement.innerText.trim();
        return sellerProfileTriggerId
    }
    return null
}

function editAmazonProductTitle(data) {
  var productTitleElement = document.querySelector('#productTitle');

  if (productTitleElement) {
    var productTitle = productTitleElement.innerText.trim();
    var color = '';
    var texto = '';

    if (data === 'contrato') {
        color = 'red';
        texto = '[CON CONTRATO]';
    } else if (data === 'contactada') {
        color = 'blue';
        texto = '[CONTACTADA]';
    }

      productTitleElement.innerHTML = '<strong style="color: ' + color + ';">' + texto + '</strong> ' + productTitle;

  }

  return null;
}

function getAliExpressSellerID(){
    var storeNameElement = document.querySelector('h3.store-name');
    if (storeNameElement) {
        var storeName = storeNameElement.innerText.trim();
        return storeName
    }
    return null
}

function editAliExpressProductTitle(data) {
  var productTitleElement = document.querySelector('h1.product-title-text');
  if (productTitleElement) {
    var productTitle = productTitleElement.innerText.trim();
    var color = '';
    var texto = '';

    if (data === 'contrato') {
        color = 'red';
        texto = '[CON CONTRATO]';
    } else if (data === 'contactada') {
        color = 'blue';
        texto = '[CONTACTADA]';
    }

      productTitleElement.innerHTML = '<strong style="color: ' + color + ';">' + texto + '</strong> ' + productTitle;

  }

  return null;
}

function getMiraviaSellerID(){
    var storeNameElement = document.querySelector('h2.xcbFRWwZa2');
    if (storeNameElement) {
        var storeName = storeNameElement.innerText.trim();
        return storeName
    }
    return null
}

function editMiraviaProductTitle(data) {
  var productTitleElement = document.querySelector('h1.LT7WEsjvW0');
  if (productTitleElement) {
    var productTitle = productTitleElement.innerText.trim();
    var color = '';
    var texto = '';

    if (data === 'contrato') {
        color = 'red';
        texto = '[CON CONTRATO]';
    } else if (data === 'contactada') {
        color = 'blue';
        texto = '[CONTACTADA]';
    }

      productTitleElement.innerHTML = '<strong style="color: ' + color + ';">' + texto + '</strong> ' + productTitle;

  }

  return null;
}

var visitedUrl = window.location.href;

async function processStores(){

    if (visitedUrl.includes('amazon.es') && visitedUrl.match(/\b(([0-9]{9}[0-9X])|(B[0-9A-Z]{9}))\b/)) {
        const sellerIdAmazon = getAmazonSellerID();
        const resultAmazon = await checkStore(sellerIdAmazon);
        const dataAmazon = resultAmazon && resultAmazon.store !== null ? JSON.parse(resultAmazon).store : null;

        if (dataAmazon) {
            editAmazonProductTitle(dataAmazon);
        }
    }

    if (visitedUrl.includes('es.aliexpress.com') && visitedUrl.match(/(.+)\.html/)) {
        const sellerIdAliExpress = getAliExpressSellerID();
        const resultAliExpress = await checkStore(sellerIdAliExpress);
        const dataAliExpress = resultAliExpress && resultAliExpress.store !== null ? JSON.parse(resultAliExpress).store : null;

        if (dataAliExpress) {
            editAliExpressProductTitle(dataAliExpress);
        }
    }

    if (visitedUrl.includes('miravia.es') && visitedUrl.match(/\/p\//)) {
        const sellerIdMiravia = getMiraviaSellerID();
        const resultMiravia = await checkStore(sellerIdMiravia);
        const dataMiravia = resultMiravia && resultMiravia.store !== null ? JSON.parse(resultMiravia).store : null;

        if (dataMiravia) {
            editMiraviaProductTitle(dataMiravia);
        }
    }
}

window.onload = async function() {
  await processStores()
  processOnLoad(visitedUrl);
};
