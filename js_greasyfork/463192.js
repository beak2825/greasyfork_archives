// ==UserScript==
// @name         MyAnimeList Synopsis Auto-Translator
// @namespace    https://greasyfork.org/scripts/463192
// @version      2.9.2
// @description:en Automatically translates MyAnimeList anime and manga descriptions.
// @description:es Traduce automáticamente las descripciones de anime y manga en MyAnimeList.
// @author       Shu2Ouma
// @icon         https://cdn.myanimelist.net/images/favicon.ico
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @description Traduce la descripción del anime y manga en MyAnimeList de manera automática.
// @downloadURL https://update.greasyfork.org/scripts/463192/MyAnimeList%20Synopsis%20Auto-Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/463192/MyAnimeList%20Synopsis%20Auto-Translator.meta.js
// ==/UserScript==

// Define los idiomas disponibles
const idiomas = [
  { codigo: "af", bandera: "🇿🇦", nombre: "Afrikaans" }, // Afrikaans
  { codigo: "am", bandera: "🏳️", nombre: "አማርኛ" }, // Amharic (bandera de reserva)
  { codigo: "ar", bandera: "🇸🇦", nombre: "العربية" }, // Arabic
  { codigo: "az", bandera: "🇦🇿", nombre: "Azərbaycanca" }, // Azerbaijani
  { codigo: "be", bandera: "🇧🇾", nombre: "Беларуская" }, // Belarusian
  { codigo: "bg", bandera: "🇧🇬", nombre: "Български" }, // Bulgarian
  { codigo: "bn", bandera: "🇧🇩", nombre: "বাংলা" }, // Bengali
  { codigo: "bs", bandera: "🇧🇦", nombre: "Bosanski" }, // Bosnian
  { codigo: "ca", bandera: "🇪🇸", nombre: "Català" }, // Catalan
  { codigo: "ceb", bandera: "🇵🇭", nombre: "Cebuano" }, // Cebuano
  { codigo: "cs", bandera: "🇨🇿", nombre: "Čeština" }, // Czech
  { codigo: "cy", bandera: "🏳️", nombre: "Cymraeg" }, // Welsh
  { codigo: "da", bandera: "🇩🇰", nombre: "Dansk" }, // Danish
  { codigo: "de", bandera: "🇩🇪", nombre: "Deutsch" }, // German
  { codigo: "el", bandera: "🇬🇷", nombre: "Ελληνικά" }, // Greek
  { codigo: "en", bandera: "🇬🇧", nombre: "English" }, // English
  { codigo: "eo", bandera: "🇪🇸", nombre: "Esperanto" }, // Esperanto
  { codigo: "es", bandera: "🇪🇸", nombre: "Español (España)" }, // Spanish (Spain)
  { codigo: "es-MX", bandera: "🇲🇽", nombre: "Español (México)" }, // Spanish (Mexico)
  { codigo: "et", bandera: "🇪🇪", nombre: "Eesti" }, // Estonian
  { codigo: "eu", bandera: "🇪🇸", nombre: "Euskara" }, // Basque
  { codigo: "fa", bandera: "🇮🇷", nombre: "فارسی" }, // Persian
  { codigo: "fi", bandera: "🇫🇮", nombre: "Suomi" }, // Finnish
  { codigo: "fil", bandera: "🇵🇭", nombre: "Filipino" }, // Filipino
  { codigo: "fr", bandera: "🇫🇷", nombre: "Français" }, // French
  { codigo: "fy", bandera: "🇳🇱", nombre: "Frysk" }, // Frisian
  { codigo: "ga", bandera: "🇮🇪", nombre: "Gaeilge" }, // Irish
  { codigo: "gd", bandera: "🇬🇧", nombre: "Gàidhlig" }, // Scottish Gaelic
  { codigo: "gl", bandera: "🇪🇸", nombre: "Galego" }, // Galician
  { codigo: "gu", bandera: "🇮🇳", nombre: "ગુજરાતી" }, // Gujarati
  { codigo: "ha", bandera: "🇳🇬", nombre: "Hausa" }, // Hausa
  { codigo: "haw", bandera: "🇺🇸", nombre: "ʻŌlelo Hawaiʻi" }, // Hawaiian
  { codigo: "hi", bandera: "🇮🇳", nombre: "हिन्दी" }, // Hindi
  { codigo: "hmn", bandera: "🇲🇲", nombre: "Hmong" }, // Hmong
  { codigo: "hr", bandera: "🇭🇷", nombre: "Hrvatski" }, // Croatian
  { codigo: "ht", bandera: "🇭🇹", nombre: "Kreyòl Ayisyen" }, // Haitian Creole
  { codigo: "hu", bandera: "🇭🇺", nombre: "Magyar" }, // Hungarian
  { codigo: "hy", bandera: "🇦🇲", nombre: "Հայերեն" }, // Armenian
  { codigo: "id", bandera: "🇮🇩", nombre: "Bahasa Indonesia" }, // Indonesian
  { codigo: "ig", bandera: "🇳🇬", nombre: "Igbo" }, // Igbo
  { codigo: "is", bandera: "🇮🇸", nombre: "Íslenska" }, // Icelandic
  { codigo: "it", bandera: "🇮🇹", nombre: "Italiano" }, // Italian
  { codigo: "ja", bandera: "🇯🇵", nombre: "日本語" }, // Japanese
  { codigo: "jv", bandera: "🇮🇩", nombre: "Basa Jawa" }, // Javanese
  { codigo: "ka", bandera: "🇬🇪", nombre: "ქართული" }, // Georgian
  { codigo: "kk", bandera: "🇰🇿", nombre: "Қазақ Тілі" }, // Kazakh
  { codigo: "km", bandera: "🇰🇭", nombre: "ភាសាខ្មែរ" }, // Khmer
  { codigo: "kn", bandera: "🇮🇳", nombre: "ಕನ್ನಡ" }, // Kannada
  { codigo: "ko", bandera: "🇰🇷", nombre: "한국어" }, // Korean
  { codigo: "ku", bandera: "🇹🇯", nombre: "Kurdî" }, // Kurdish
  { codigo: "ky", bandera: "🇰🇬", nombre: "Кыргызча" }, // Kyrgyz
  { codigo: "la", bandera: "🏳️", nombre: "Latina" }, // Latin
  { codigo: "lb", bandera: "🇱🇺", nombre: "Lëtzebuergesch" }, // Luxembourgish
  { codigo: "lo", bandera: "🇱🇦", nombre: "ພາສາລາວ" }, // Lao
  { codigo: "lt", bandera: "🇱🇹", nombre: "Lietuvių" }, // Lithuanian
  { codigo: "lv", bandera: "🇱🇻", nombre: "Latviešu" }, // Latvian
  { codigo: "mg", bandera: "🇲🇬", nombre: "Malagasy" }, // Malagasy
  { codigo: "mi", bandera: "🇳🇿", nombre: "Māori" }, // Māori
  { codigo: "mk", bandera: "🇲🇰", nombre: "Македонски" }, // Macedonian
  { codigo: "ml", bandera: "🇮🇳", nombre: "മലയാളം" }, // Malayalam
  { codigo: "mn", bandera: "🇲🇳", nombre: "Монгол" }, // Mongolian
  { codigo: "mr", bandera: "🇮🇳", nombre: "मराठी" }, // Marathi
  { codigo: "ms", bandera: "🇲🇾", nombre: "Bahasa Melayu" }, // Malay
  { codigo: "mt", bandera: "🇲🇹", nombre: "Malti" }, // Maltese
  { codigo: "my", bandera: "🇲🇲", nombre: "မြန်မာ" }, // Burmese
  { codigo: "ne", bandera: "🇳🇵", nombre: "नेपाली" }, // Nepali
  { codigo: "nl", bandera: "🇳🇱", nombre: "Nederlands" }, // Dutch
  { codigo: "no", bandera: "🇳🇴", nombre: "Norsk" }, // Norwegian
  { codigo: "ny", bandera: "🇲🇺", nombre: "Chichewa" }, // Chichewa
  { codigo: "or", bandera: "🇮🇳", nombre: "ଓଡ଼ିଆ" }, // Oriya
  { codigo: "pa", bandera: "🇮🇳", nombre: "ਪੰਜਾਬੀ" }, // Punjabi
  { codigo: "pl", bandera: "🇵🇱", nombre: "Polski" }, // Polish
  { codigo: "ps", bandera: "🇵🇰", nombre: "پښتو" }, // Pashto
  { codigo: "pt", bandera: "🇵🇹", nombre: "Português" }, // Portuguese
  { codigo: "ro", bandera: "🇷🇴", nombre: "Română" }, // Romanian
  { codigo: "ru", bandera: "🇷🇺", nombre: "Русский" }, // Russian
  { codigo: "sd", bandera: "🇵🇰", nombre: "سنڌي" }, // Sindhi
  { codigo: "si", bandera: "🇱🇰", nombre: "සිංහල" }, // Sinhala
  { codigo: "sk", bandera: "🇸🇰", nombre: "Slovenčina" }, // Slovak
  { codigo: "sl", bandera: "🇸🇮", nombre: "Slovenščina" }, // Slovenian
  { codigo: "sm", bandera: "🇲🇸", nombre: "Gagana Samoa" }, // Samoan
  { codigo: "sn", bandera: "🇿🇼", nombre: "ChiShona" }, // Shona
  { codigo: "so", bandera: "🇲🇱", nombre: "Soomaaliga" }, // Somali
  { codigo: "sq", bandera: "🇦🇱", nombre: "Shqip" }, // Albanian
  { codigo: "sr", bandera: "🇷🇸", nombre: "Српски" }, // Serbian
  { codigo: "st", bandera: "🇱🇸", nombre: "Sesotho" }, // Sesotho
  { codigo: "su", bandera: "🇮🇩", nombre: "Basa Sunda" }, // Sundanese
  { codigo: "sv", bandera: "🇸🇪", nombre: "Svenska" }, // Swedish
  { codigo: "sw", bandera: "🇰🇪", nombre: "Kiswahili" }, // Swahili
  { codigo: "ta", bandera: "🇮🇳", nombre: "தமிழ்" }, // Tamil
  { codigo: "te", bandera: "🇮🇳", nombre: "తెలుగు" }, // Telugu
  { codigo: "tg", bandera: "🇹🇯", nombre: "Тоҷикӣ" }, // Tajik
  { codigo: "th", bandera: "🇹🇭", nombre: "ไทย" }, // Thai
  { codigo: "tl", bandera: "🇵🇭", nombre: "Tagalog" }, // Filipino (Tagalog)
  { codigo: "tr", bandera: "🇹🇷", nombre: "Türkçe" }, // Turkish
  { codigo: "uk", bandera: "🇺🇦", nombre: "Українська" }, // Ukrainian
  { codigo: "ur", bandera: "🇵🇰", nombre: "اردو" }, // Urdu
  { codigo: "uz", bandera: "🇺🇿", nombre: "Oʻzbekcha" }, // Uzbek
  { codigo: "vi", bandera: "🇻🇳", nombre: "Tiếng Việt" }, // Vietnamese
  { codigo: "xh", bandera: "🇿🇦", nombre: "isiXhosa" }, // Xhosa
  { codigo: "yi", bandera: "🇮🇱", nombre: "יידיש" }, // Yiddish
  { codigo: "yo", bandera: "🇳🇬", nombre: "Yorùbá" }, // Yoruba
  { codigo: "zh-CN", bandera: "🇨🇳", nombre: "中文 (简体)" }, // Chinese Simplified
  { codigo: "zh-TW", bandera: "🇹🇼", nombre: "中文 (繁體)" }, // Chinese Traditional
  { codigo: "zu", bandera: "🇿🇦", nombre: "isiZulu" }, // Zulu
];

// Función para crear la lista desplegable de idiomas
const crearListaDesplegable = () => {
  const selectIdioma = document.createElement('select');
  selectIdioma.id = 'selectIdioma';
  selectIdioma.style.cssText = 'background-color: #fff; border: #bebebe 1.1px solid; border-radius: 4px; color: #323232; display: inline-block; font-family: Avenir,lucida grande,tahoma,verdana,arial,sans-serif; font-size: 11px; padding: 3.5px 8px; text-align: left; text-decoration: none; vertical-align: middle; margin-left: 8px;';

  idiomas.sort((a, b) => a.nombre.localeCompare(b.nombre));

  idiomas.forEach(idioma => {
    const option = document.createElement('option');
    option.value = idioma.codigo;
    option.text = `${idioma.bandera} ${idioma.nombre}`;
    selectIdioma.appendChild(option);
  });

  return selectIdioma;
};

const inicializarIdioma = () => {
  const idiomaGuardado = localStorage.getItem('idiomaSeleccionado') || 'en';
  document.querySelector('#selectIdioma').value = idiomaGuardado;

  if (idiomaGuardado !== 'en') {
    traducirDescripciones(idiomaGuardado);
  }
};

const manejarCambioIdioma = () => {
  const idiomaSeleccionado = document.querySelector('#selectIdioma').value;
  localStorage.setItem('idiomaSeleccionado', idiomaSeleccionado);
  traducirDescripciones(idiomaSeleccionado);
};

// Espera a que se cargue completamente la página
window.addEventListener('load', () => {
  const selectIdioma = crearListaDesplegable();

  let divElement = document.querySelector('.header-right-link'); // Elemento adecuado para insertar la lista
  if (divElement) {
    divElement.appendChild(selectIdioma);
  }

  inicializarIdioma();
  selectIdioma.addEventListener('change', manejarCambioIdioma);
});

const clonarEstilos = (origen, destino, agregarMarginLeft = true) => {
  const estilos = window.getComputedStyle(origen);
  const propiedades = [
    'background-color', 'border', 'border-radius', 'color', 'display',
    'font-family', 'text-align', 'text-decoration', 'vertical-align',
    'cursor', 'font-size', 'font-weight', 'margin-right', 'padding',
    '-webkit-transition-duration', 'transition-duration', '-webkit-transition-property',
    'transition-property', '-webkit-transition-timing-function', 'transition-timing-function'
  ];
  destino.style.cssText = propiedades
    .filter(prop => estilos.getPropertyValue(prop)) // Filtra propiedades que tienen valor
    .map(prop => `${prop}: ${estilos.getPropertyValue(prop)};`) // Aplica el estilo
    .join(' ');

  // Aplicar margin-left si se requiere
  if (agregarMarginLeft) {
    destino.style.setProperty('margin-left', '8px', 'important');
  }
};

// Define el estilo de texto que se aplicará a las etiquetas <p> y <span>
const estiloTexto = "font-size: 115%;"; // Cambiar el valor para ajustar el tamaño del texto

// Traduce las descripciones al idioma seleccionado
const traducirDescripciones = idiomaSeleccionado => {
  const descripciones = document.querySelectorAll('p.preline, p[itemprop="description"], span[itemprop="description"], div.synopsis.js-synopsis p, div.pt4, div.relation');
  descripciones.forEach(descripcion => {
    if ((descripcion.tagName === "P" && descripcion.getAttribute("itemprop") === "description") ||
        (descripcion.tagName === "SPAN" && descripcion.getAttribute("itemprop") === "description") ||
        descripcion.classList.contains("relation")) {
      descripcion.style = estiloTexto;
    }

    let textoLinea = descripcion.innerHTML.trim();

    // Si es un elemento con la clase 'relation', excluye el contenido entre paréntesis de la traducción
    if (descripcion.classList.contains("relation")) {
      // Divide el texto en partes, excluyendo el contenido específico entre paréntesis
      const partes = textoLinea.split(/(\(Light Novel\)|\(TV\)|\(manga\)|\(Novel\))/i);

      // Traducir solo las partes que no son "Light Novel", "TV" o "manga" dentro de los paréntesis
      const partesTraducibles = partes.map(parte => {
        // Si la parte es uno de los textos omitidos, agrégale un espacio antes
        if (parte.toLowerCase() === '(light novel)' || parte.toLowerCase() === '(tv)' || parte.toLowerCase() === '(novel)' || parte.toLowerCase() === '(manga)') {
          return ` ${parte}`;
        } else {
          return translateText(parte, idiomaSeleccionado);
        }
      });

      // Combinar las partes traducidas con las partes excluidas sin cambios
      Promise.all(partesTraducibles).then(partesTraducidas => {
        descripcion.innerHTML = partesTraducidas.join('');
      });
    } else {
      // Traducir el texto completo si no tiene la clase 'relation'
      translateText(textoLinea, idiomaSeleccionado).then(textoTraducido => {
        descripcion.innerHTML = textoTraducido;
      });
    }
  });
};

const translateText = (text, targetLang) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURI(text)}`,
      onload: function(response) {
        const resultado = JSON.parse(response.responseText);
        const textoTraducido = resultado[0].map(function(elemento){ return elemento[0]; }).join('');
        resolve(textoTraducido);
      },
      onerror: function(error) {
        reject(error);
      }
    });
  });
};

// Espera a que se cargue completamente la página antes de ejecutar el script
window.addEventListener('load', () => {
  const selectIdioma = crearListaDesplegable();
  const idiomaSeleccionado = localStorage.getItem('idiomaSeleccionado');
  if (idiomaSeleccionado) {
    selectIdioma.value = idiomaSeleccionado;
    traducirDescripciones(idiomaSeleccionado);
  }

  // Agrega el evento de cambio de idioma
  selectIdioma.addEventListener('change', manejarCambioIdioma);

  // Busca el elemento donde deseamos insertar la lista de idiomas
  let divElement = document.querySelector('div.user-status-block.js-user-status-block.fn-grey6.clearfix.al.mt8.po-r[data-type="manga"]');
  if (!divElement) {
    divElement = document.querySelector('div.user-status-block.js-user-status-block.fn-grey6.clearfix.al.mt8.po-r');
  }

  if (!divElement) {
    // Si no se encuentra el elemento de destino, lo manejamos de otra manera
    const targetElement = document.querySelector('.btn-seasonal');
    if (targetElement) {
      // Clona los estilos del <li class="btn-type js-btn-seasonal" data-key="4">Special</li>
      const liEstilos = document.querySelector('li.btn-type.js-btn-seasonal[data-key="4"]');
      if (liEstilos) {
        clonarEstilos(liEstilos, selectIdioma, false); // No agregar margin-left
      }

      // Insertamos la lista desplegable en el lugar correspondiente
      const lastListItem = targetElement.querySelector('li:last-child');
      if (lastListItem) {
        targetElement.insertBefore(selectIdioma, lastListItem.nextSibling);
      } else {
        targetElement.prepend(selectIdioma);
      }
    } else {
      // Si no se encuentra ningún elemento de destino, manejamos la situación de otra manera
      const container = document.createElement('div');
      container.style.cssText = 'position: fixed; right: 10px; top: 50%; transform: translate(0, -50%);';
      document.body.appendChild(container);
      divElement = container;

      // Clona los estilos del <div class="di-ib form-user-episode ml8">
      const divEstilos = document.querySelector('div.di-ib.form-user-episode.ml8');
      if (divEstilos) {
        clonarEstilos(divEstilos, selectIdioma);
      }
    }
  } else {
    // Clona los estilos del <div class="di-ib form-user-episode ml8">
    const divEstilos = document.querySelector('div.di-ib.form-user-episode.ml8');
    if (divEstilos) {
      clonarEstilos(divEstilos, selectIdioma);
    }

    // Insertamos la lista desplegable en el lugar correspondiente
    divElement.appendChild(selectIdioma);
  }

  // Añadimos margen inferior al div principal
  divElement.style.marginBottom = '10px';
});