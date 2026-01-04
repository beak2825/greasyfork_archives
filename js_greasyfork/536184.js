// ==UserScript==
// @name         Check website perf
// @description  Obtain the website perfs on a new tab after time second.
// @namespace    http://tampermonkey.net/
// @version      2025.05.16
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536184/Check%20website%20perf.user.js
// @updateURL https://update.greasyfork.org/scripts/536184/Check%20website%20perf.meta.js
// ==/UserScript==

function getAllParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
  const hashParams = new URLSearchParams(hash);

  // Fusionne les deux : search > hash (si même clé présente deux fois)
  const combined = new Map([...hashParams.entries(), ...searchParams.entries()]);
  return Object.fromEntries(combined);
}

function isValidParams(params) {
  return (
    params.check_perfs === "true" &&
    typeof params.time === "string" &&
    /^\d+$/.test(params.time)
  );
}

function collectWebPerfMetrics() {
    window.rw_toolkit = window.rw_toolkit || {};

    const timing = window.performance.timing;
    const navStart = timing.navigationStart;
    let formattedTiming = [];

    for (const key in timing) {
        if (typeof timing[key] === 'number') {
            const value = timing[key] - navStart;
            formattedTiming.push({
                key: key,
                value: value >= 0 ? value : 'N/A'
            });
        }
    }

    let memoryInfo = 'Non disponible';
    if (window.performance.memory) {
        const mem = window.performance.memory;
        memoryInfo = {
            jsHeapSizeLimit: (mem.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + ' Mo',
            totalJSHeapSize: (mem.totalJSHeapSize / (1024 * 1024)).toFixed(2) + ' Mo',
            usedJSHeapSize: (mem.usedJSHeapSize / (1024 * 1024)).toFixed(2) + ' Mo'
        };
    }

    window.rw_toolkit.cwv = {
        timing: window.performance.timing, // Objet timing de performance
        navigation: window.performance.navigation, // Objet de navigation
        memory: memoryInfo, // Informations sur la mémoire (à définir ailleurs si nécessaire)
        paint: {
            firstPaint: null, // Initialisation des propriétés spécifiques aux peintures
            firstContentfulPaint: null
        },
        metrics: {
            cls: 0, // Cumulative Layout Shift (CLS)
            fid: 0 // First Input Delay (FID)
        },
        resources: [], // Tableau pour les ressources
        longtasks: [], // Tableau pour les tâches longues
        frames: [], // Tableau pour les frames
        userTiming: [], // Tableau pour les timings utilisateur
        events: [] // Tableau pour les événements
    };

    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
        window.rw_toolkit.cwv.paint[entry.name] = entry.startTime;
    });

    // Observation des performances
    const po = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            switch (entry.entryType) {
                case 'navigation':
                    // Stocker les informations sur la navigation dans un objet dédié
                    window.rw_toolkit.cwv.navigation = entry;
                    break;
                case 'resource':
                    // Ajouter les ressources au tableau resources
                    window.rw_toolkit.cwv.resources.push(entry);
                    break;
                case 'longtask':
                    // Ajouter les tâches longues au tableau longtasks
                    window.rw_toolkit.cwv.longtasks.push(entry);
                    break;
                case 'frame':
                    // Ajouter les frames au tableau frames
                    window.rw_toolkit.cwv.frames.push(entry);
                    break;
                case 'paint':
                    // Stocker les événements de peinture dans l'objet paint
                    if (entry.name === 'first-paint') {
                        window.rw_toolkit.cwv.paint.firstPaint = entry.startTime;
                    } else if (entry.name === 'first-contentful-paint') {
                        window.rw_toolkit.cwv.paint.firstContentfulPaint = entry.startTime;
                    }
                    break;
                case 'layout-shift':
                    // Mettre à jour CLS si le layout shift ne provient pas d'une interaction récente
                    if (!entry.hadRecentInput) {
                        window.rw_toolkit.cwv.metrics.cls += entry.value;
                    }
                    break;
                case 'user-timing':
                    // Ajouter les entrées de user-timing au tableau userTiming
                    window.rw_toolkit.cwv.userTiming.push(entry);
                    break;
                case 'first-input':
                    // Mettre à jour FID avec la différence entre le startTime et processingStart
                    window.rw_toolkit.cwv.metrics.fid = entry.processingStart - entry.startTime;
                    break;
                case 'event':
                    // Ajouter les événements au tableau events
                    window.rw_toolkit.cwv.events.push(entry);
                    break;
                default:
                    break;
            }
        });
    });

    // Commencer l'observation des types de performance souhaités
    po.observe({ type: 'navigation', buffered: true });
    po.observe({ type: 'resource', buffered: true });
    po.observe({ type: 'longtask', buffered: true });
    po.observe({ type: 'frame', buffered: true });
    po.observe({ type: 'paint', buffered: true });
    po.observe({ type: 'layout-shift', buffered: true });
    po.observe({ type: 'user-timing', buffered: true });
    po.observe({ type: 'first-input', buffered: true });
    po.observe({ type: 'event', buffered: true });
}

function monitorMemoryOverTime(durationInSeconds = 30, time_interval = 1000) {
    if (!window.performance.memory) {
        console.warn('window.performance.memory non supporté par ce navigateur.');
        return;
    }

    const memorySamples = [];
    const startTime = performance.now();

    const interval = setInterval(() => {
        const now = performance.now();
        const elapsed = (now - startTime).toFixed(0); // Temps écoulé en ms

        const mem = window.performance.memory;
        memorySamples.push({
            time: `${elapsed} ms`,
            usedJSHeapSize: (mem.usedJSHeapSize / (1024 * 1024)).toFixed(2) + ' Mo',
            totalJSHeapSize: (mem.totalJSHeapSize / (1024 * 1024)).toFixed(2) + ' Mo',
            jsHeapSizeLimit: (mem.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + ' Mo'
        });
    }, time_interval);

    setTimeout(() => {
        clearInterval(interval);
        // Stocker les échantillons dans l'objet rw_toolkit
        if (!window.rw_toolkit.cwv.memorySamples) {
            window.rw_toolkit.cwv.memorySamples = [];
        }
        window.rw_toolkit.cwv.memorySamples = memorySamples;
        console.log('Surveillance mémoire terminée. Données disponibles dans rw_toolkit.cwv.memorySamples');
    }, durationInSeconds * 1000);
}


function openRWToolkitInNewTab() {
    const data = window.rw_toolkit;
    const json = JSON.stringify(data, null, 2); // Mise en forme lisible

    const htmlContent = `
        <html>
        <head>
            <title>Données de rw_toolkit</title>
            <style>
                body { font-family: monospace; white-space: pre-wrap; padding: 1em; background: #f5f5f5; color: #333; }
                pre { background: white; padding: 1em; border: 1px solid #ccc; overflow-x: auto; }
            </style>
        </head>
        <body>
            <h1>Données de window.rw_toolkit</h1>
            <pre>${sanitizeHtml(json)}</pre>
        </body>
        </html>
    `;

    const newWindow = window.open();
    if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    } else {
        alert("Impossible d'ouvrir un nouvel onglet (bloqué par le navigateur ?)");
    }
}

// Fonction utilitaire pour éviter toute injection dans le HTML
function sanitizeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function main() {
    const params = getAllParams();

    if (isValidParams(params)) {
        const time = params.time;
        const timeout = time * 1000;
        const interval = params.interval;


        collectWebPerfMetrics();
        monitorMemoryOverTime(time, interval);

        setTimeout(() => {
            openRWToolkitInNewTab();
        }, timeout);
    }
}

main();