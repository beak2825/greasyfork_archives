// ==UserScript==
// @name         Musescore Free PDF Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       malatia
// @match        https://musescore.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musescore.com
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.16.0/pdf-lib.min.js
// @description  An automatic and free score downloader for musescore
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487678/Musescore%20Free%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/487678/Musescore%20Free%20PDF%20Downloader.meta.js
// ==/UserScript==

// Idea from MuseScore Download By flancast90

let DEBUG = true


function get_lazy_imgs() {
    console.log("Début get_lazy_images");
    return new Promise((resolve, reject) => {
        // Fonction récursive pour récupérer les images
        function fetchImages() {

            scrollContainer = document.getElementById('jmuse-scroller-component');
            scrollHeight = scrollContainer.scrollHeight;

            if (scrolled < scrollHeight) {
                // Faire défiler la fenêtre
                scrollContainer.scrollTop = scrolled;
                scrolled += height;

                // Attendre un peu avant de récupérer les images
                setTimeout(() => {
                    // Récupérer les images
                    const images = document.getElementsByClassName('KfFlO');
                    if (images.length > 0) {
                        // Ajouter les URLs des images au tableau
                        urls.push(images[images.length - 1].src);
                    }

                    // Rappel récursif jusqu'à ce que le scroll atteigne la fin
                    fetchImages();
                }, 1000);
            } else {
                // Résoudre la promesse avec les URLs des images
                resolve(urls);
                console.log("Fin get_lazy_images");
            }
        }

        // Début de la récupération des images
        fetchImages();
    });
}

async function download_pdf() {
    console.log("Avant get_lazy_images");
    await get_lazy_imgs(); // Attendre la récupération de toutes les URLs d'images
    console.log("Après get_lazy_images");
    console.log("Avant fetchAndAssemble");
    await fetchAndAssemblePDF(urls); // Utiliser les URLs pour générer le PDF
    console.log("Après fetchAndAssemble");
    scrolled = 0; // Réinitialiser le défilement
}

function createFloatingIframeButton() {
  if (document.getElementById('tm-fab-frame')) return;

  const iframe = document.createElement('iframe');
  iframe.id = 'tm-fab-frame';
  Object.assign(iframe.style, {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    width: '160px',
    height: '48px',
    border: '0',
    padding: '0',
    margin: '0',
    zIndex: '2147483647',
    background: 'transparent',
    pointerEvents: 'auto'
  });

  // Contenu interne de l'iframe (même origine → on peut y accéder)
  iframe.srcdoc = `
<!doctype html><html><head><meta charset="utf-8">
<style>
html,body{margin:0;padding:0;background:transparent}
#btn{
  all:unset; display:inline-block; padding:10px 14px; border-radius:9999px;
  box-shadow:0 8px 30px rgba(0,0,0,.25);
  background:#0dbc79; color:#fff; font:14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
  cursor:pointer; user-select:none;
}
#btn:hover{filter:brightness(1.06)}
#btn:active{transform:translateY(1px)}
</style></head><body>
<button id="btn" title="Télécharger le PDF">Télécharger PDF</button>
</body></html>`.trim();

  document.documentElement.appendChild(iframe);

  // Quand l'iframe est prête, on accroche NOTRE handler (dans le contexte userscript)
  iframe.addEventListener('load', () => {
    const doc = iframe.contentDocument;
    const btn = doc && doc.getElementById('btn');
    if (!btn) return;
    btn.addEventListener('click', download_pdf_wrapper); // ici, le site ne peut pas bloquer
    console.log('[TM] Bouton flottant (iframe) prêt.');
  });
}

async function download_pdf_wrapper(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
  try {
    // On repart de zéro à chaque run
    scrolled = 0;
    urls = [];

    // Si la page n'a pas encore initialisé height/scrollContainer, on tente ici
    if (!height) {
      const firstImg = document.getElementsByClassName('KfFlO')[0];
      if (firstImg) height = parseInt(firstImg.height);
    }
    if (!scrollContainer) {
      scrollContainer = document.getElementById('jmuse-scroller-component');
    }

    await download_pdf();
  } catch (err) {
    console.error('[TM] download_pdf_wrapper error:', err);
    alert('Échec du téléchargement PDF. Regarde la console pour les détails.');
  }
}


async function img_to_canvas_to_bytes(img) {
    return new Promise((resolve, reject) => {
        // Création d'un canvas pour dessiner l'image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Chargement de l'image dans le canvas
        img.crossOrigin = 'Anonymous'; // Permet d'accéder à l'image cross-origin
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Conversion du contenu du canvas en données PNG
            const pngBytes = canvas.toDataURL('image/png').split(',')[1];
            resolve(pngBytes);
        };
        img.onerror = () => {
            reject(new Error('Échec du chargement de l\'image.'));
        };
        img.src = img.src; // Déclenche le chargement de l'image
    });
}



async function fetchAndAssemblePDF(urls) {
    // Création d'un nouveau document PDF
    const pdfDoc = await PDFLib.PDFDocument.create();

    // Tableau pour stocker les documents PNG générés
    const pngDocs = [];

    // Parcours de chaque URL de fichier img
    console.log("Avant boucle urls")

    for (const url of urls) {

        console.log("url = " + url)
        // Récupération du fichier img à partir de l'URL
        const response = await fetch(url);
        console.log(response)
        const imgText = await response.text();

        if (url.includes(".svg")) {
            const img = new Image();
            const imgLoaded = new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            // Création d'un blob à partir du texte SVG
            const svgBlob = new Blob([imgText], { type: 'image/svg+xml' });

            // Création d'une image à partir du blob SVG
            img.src = URL.createObjectURL(svgBlob);

            // Attente du chargement complet de l'image
            try {
                // Attendre le chargement complet de l'image
                await imgLoaded;
                console.log("Image SVG chargée avec succès");
            } catch (error) {
                console.error("Erreur lors du chargement de l'image SVG:", error);
                continue; // Passe à l'itération suivante dans la boucle
            }

            // Création d'un canvas pour dessiner l'image SVG
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Conversion du canvas en format PNG
            const pngBytes = canvas.toDataURL('image/png').split(',')[1];

            // Incorporation du PNG dans le document PDF
            const pngDoc = await pdfDoc.embedPng(pngBytes);
            pngDocs.push(pngDoc); // Ajout du document PNG au tableau
        }

        else if (url.includes(".png")) {
            console.log("Dans la partie PNG");
            const img = new Image();
            const imgLoaded = new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            // Chargement de l'image à partir de l'URL
            img.src = url;
            // Promesse basée sur le chargement complet de l'image
            try {
                // Attendre le chargement complet de l'image
                await imgLoaded;
                console.log("Image PNG chargée avec succès");
            } catch (error) {
                console.error("Erreur lors du chargement de l'image PNG:", error);
                continue; // Passe à l'itération suivante dans la boucle
            }

            const pngBytes = await img_to_canvas_to_bytes(img)

            // Incorporation de l'image PNG dans le document PDF
            const pngDoc = await pdfDoc.embedPng(pngBytes);
            pngDocs.push(pngDoc);
        }
    }

    // Parcours des documents PNG pour les ajouter au document PDF
    for (const pngDoc of pngDocs) {
        const page = pdfDoc.addPage([pngDoc.width, pngDoc.height]);
        page.drawImage(pngDoc, {
            x: 0,
            y: 0,
            width: pngDoc.width,
            height: pngDoc.height,
        });
    }

    // Enregistrement du document PDF
    const pdfBytes = await pdfDoc.save();

    // Téléchargement du PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    let title = document.title.replace(" ", "_") + ".pdf"
    link.download = title;
    link.click();
}

let scrolled = 0;
let urls = [];
let height;
let scrollHeight;
let scrollContainer



$(document).ready(async function () {
    console.log("SCRIPT LOADED");
    setTimeout(() => {
        console.log("Set timeout");
        // ICI ON PARLE DU CONTENANT AVEC SCROLL
        scrollContainer = parseInt(document.getElementById('jmuse-scroller-component').scrollHeight);
        // ICI ON PARLE DES IMAGES
        height = parseInt(document.getElementsByClassName('KfFlO')[0].height);
        console.log("height = " + height);
        scrollHeight = (scrollContainer - (scrollContainer % height));
        console.log("scrollHeight = " + scrollHeight);

        // installe le bouton iframe (à la fin de ton $(document).ready(...))
        createFloatingIframeButton();

        // (optionnel) réinstalle si le site détruit le nœud
        const mo = new MutationObserver(() => {
            if (!document.getElementById('tm-fab-frame')) createFloatingIframeButton();
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });

        // (optionnel) menu Tampermonkey en secours
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand('Télécharger PDF', () => download_pdf_wrapper());
        }

        // (optionnel) raccourci clavier Ctrl+Alt+D
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                download_pdf_wrapper();
            }
        }, true);


    }, 2000)




});