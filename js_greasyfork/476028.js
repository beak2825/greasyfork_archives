// ==UserScript==
// @name         Reddit B64 Decoder
// @namespace    https://greasyfork.org/es/scripts/476028
// @version      1.5.5
// @description  Decode Base64-encoded text in Reddit posts and convert URLs to clickable links.
// @author       Shu2Ouma
// @icon         https://www.redditstatic.com/shreddit/assets/favicon/192x192.png
// @license      MIT
// @match        https://new.reddit.com/r/*
// @match        https://old.reddit.com/r/*
// @match        https://www.reddit.com/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476028/Reddit%20B64%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/476028/Reddit%20B64%20Decoder.meta.js
// ==/UserScript==

// Mapa de íconos con nombre de página y URL del ícono
const iconMap = {
  'mediafire.com': { name: 'Mediafire', iconUrl: 'https://img.icons8.com/?size=512&id=IYtT6OXWgtB2&format=png' },
  'mega.nz': { name: 'MEGA', iconUrl: 'https://img.icons8.com/?size=512&id=doAYX1PwPI9p&format=png' },
  '1fichier.com': { name: '1Fichier', iconUrl: 'https://i.imgur.com/rcwgt7W.png' },
  'youtube.com': { name: 'YouTube', iconUrl: 'https://img.icons8.com/?size=512&id=19318&format=png' },
  'youtu.be': { name: 'YouTube', iconUrl: 'https://img.icons8.com/?size=512&id=19318&format=png' },
  'reddit.com': { name: 'Reddit', iconUrl: 'https://img.icons8.com/?size=512&id=FLisMqR76b1i&format=png' },
  'bilibili.com': { name: 'Bilibili', iconUrl: 'https://img.icons8.com/?size=512&id=5E24fZ9ORelo&format=png' },
  'video.twimg.com': { name: 'Twitter', iconUrl: 'https://img.icons8.com/?size=512&id=yoQabS8l0qpr&format=png' },
  'twitter.com': { name: 'Twitter', iconUrl: 'https://img.icons8.com/?size=512&id=yoQabS8l0qpr&format=png' },
  'x.com': { name: 'Twitter', iconUrl: 'https://img.icons8.com/?size=512&id=yoQabS8l0qpr&format=png' },
  'drive.google.com': { name: 'Google Drive', iconUrl: 'https://img.icons8.com/?size=512&id=ya4CrqO7PgnY&format=png' },
  'filecrypt.cc': { name: 'Filecrypt', iconUrl: 'https://img.icons8.com/?size=512w&id=I2lKi8lyTaJD&format=png' },
  'qiwi.gg': { name: 'Qiwi', iconUrl: 'https://img.icons8.com/?size=512w&id=BEvy82loG811&format=png' },
  'telegram.org': { name: 'Telegram', iconUrl: 'https://img.icons8.com/?size=512&id=63306&format=png' },
  't.me': { name: 'Telegram', iconUrl: 'https://img.icons8.com/?size=512&id=63306&format=png' },
  'image': { name: 'Imagen', iconUrl: 'https://img.icons8.com/?size=512&id=42840&format=png' },
  'default': { name: 'Enlace', iconUrl: 'https://img.icons8.com/?size=512w&id=n9d0Hm43JCPK&format=png' }
};

// Función para decodificar texto codificado en Base64 y convertir URLs en íconos clicables
function decodeBase64AndLinkify(text) {
  const base64Regex = /([A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)*/g;

  return text.replace(base64Regex, match => {
    try {
      const decoded = atob(match);
      if (decoded.includes('https://') || decoded.includes('http://')) {
        return decoded.replace(/(https?:\/\/[^\s<]+)/g, url => {
          try {
            const { hostname, pathname } = new URL(url);
            const cleanedHostname = hostname.replace('www.', '');

            // Determinar si es una URL de imagen
            const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|ico)$/i.test(pathname);

            const icon = isImage ? iconMap['image'] : iconMap[cleanedHostname] || iconMap['default'];
            if (icon) {
              return `<a href="${url}" target="_blank" rel="noreferrer noopener" style="text-decoration: none; display: inline-flex; align-items: center; line-height: 20px;">
                        <span style="position: relative; display: inline-block;">
                          <img src="${icon.iconUrl}" alt="${icon.name}" style="width: 20px; height: 20px; position: absolute; left: 0; top: 50%; transform: translateY(-50%);" />
                          <span style="padding-left: 24px; line-height: 20px;">${icon.name}</span>
                        </span>
                      </a><br>`;
            } else {
              return `<a href="${url}" target="_blank" rel="noreferrer noopener" style="text-decoration: underline; text-underline-offset: 2px;">${url}</a><br>`;
            }
          } catch (urlError) {
            console.error(`Error processing URL: ${url}`, urlError);
            return `${url}<br>`;
          }
        });
      }
    } catch (error) {
      console.error(`Error decoding Base64: ${match}`, error);
    }
    return match;
  });
}

// Función para procesar el contenido en función del tipo de página de Reddit
function processRedditPosts() {
  const url = window.location.href;
  let postContents;

  if (url.includes('new.reddit.com')) {
    // new.reddit.com
    postContents = document.querySelectorAll('.rpBJOHq2PR60pnwJlUyP0 p, .uI_hDmU5GSiudtABRz_37 p');
  } else if (url.includes('old.reddit.com')) {
    // old.reddit.com
    postContents = document.querySelectorAll('div.md p');
  } else {
    // www.reddit.com
    postContents = document.querySelectorAll('p');
  }

  if (postContents.length > 0) {
    postContents.forEach(post => {
      const decodedText = decodeBase64AndLinkify(post.textContent);
      if (decodedText !== post.textContent) {
        post.innerHTML = decodedText;
      }
    });
  } else {
    console.warn('No se encontró contenido para procesar.');
  }
}

// Función para inicializar el proceso
function setupScript() {
  // Procesar el contenido inicial
  initialProcess();

  // Configurar el observer para observar cambios en el DOM
  setupMutationObserver();
}

// Función para procesar el contenido inicial de la página
function initialProcess() {
  setTimeout(processRedditPosts, 1500); // Ajusta el tiempo según sea necesario
}

// Función para configurar el observador de cambios en el DOM
function setupMutationObserver() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        processRedditPosts();
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Ejecutar el script al cargar la página
setupScript();