// ==UserScript==
// @name         Jkanime Lista Negra Visual Completa
// @namespace    https://greasyfork.org/es/scripts/537406/
// @version      1.81
// @description  Control visual de lista negra en Jkanime.net con portada, importación y exportación JSON 🛠️📤❌➕🖼️✅
// @author       @tronkeis
// @match        https://jkanime.net/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537406/Jkanime%20Lista%20Negra%20Visual%20Completa.user.js
// @updateURL https://update.greasyfork.org/scripts/537406/Jkanime%20Lista%20Negra%20Visual%20Completa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = 'animesBloqueados';
    const popularAnimesBanner = true;
    const animesBorrados = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'));

    function guardarLista() {
        localStorage.setItem(storageKey, JSON.stringify([...animesBorrados]));
    }

    function normalizarNombre(nombre) {
        return nombre
            .replace(/:/g, '')
            .replace(/\s*-\s*\d+$/, '')
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, '')
            .replace(/(\d+)\.(\d+)/g, '$1$2')
            .replace(/['’]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function removeAnime() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const titleElement = card.querySelector('h5.strlimit.card-title');
            const title = titleElement?.textContent?.trim();
            if (!title) return;

            const img = card.querySelector('img.card-img-top');

            for (const item of animesBorrados) {
                const itemNombre = item.split('.').slice(1).join('.').trim();
                if (itemNombre === title) {
                    card.closest('.dir1')?.remove();
                    return;
                }
            }


        });

        if (popularAnimesBanner) {
            const heroSection = document.querySelector("body > div.page-content > section.hero");
            if (heroSection) heroSection.remove();
        }
    }

    // Botón flotante
    const toggleBtn = document.createElement('div');
    toggleBtn.textContent = '📂 Lista Negra';
    toggleBtn.style.cssText = `
        position: fixed; top: 50%; right: 0; transform: translateY(-50%);
        background: #111; color: white; padding: 10px;
        border-radius: 5px 0 0 5px; cursor: pointer; z-index: 99999;
        font-family: sans-serif; writing-mode: vertical-lr; text-align: center;
    `;
    document.body.appendChild(toggleBtn);

    // Panel visual
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.96); color: white; z-index: 99998;
        display: none; flex-direction: column; padding: 20px;
        box-sizing: border-box; font-family: sans-serif;
    `;
    document.body.appendChild(panel);

    // Input + Botón Agregar
    const controlDiv = document.createElement('div');
    controlDiv.style.cssText = 'margin-bottom: 15px; display: flex; gap: 10px;';

    const inputAnime = document.createElement('input');
    inputAnime.type = 'text';
    inputAnime.placeholder = 'Nombre del anime...';
    inputAnime.style.cssText = 'flex: 1; padding: 8px; border-radius: 5px; border: none;';

    const agregarBtn = document.createElement('button');
    agregarBtn.textContent = '➕ Agregar';
    agregarBtn.style.cssText = 'padding: 8px 15px; border: none; background: green; color: white; border-radius: 5px; cursor: pointer;';
    agregarBtn.onclick = () => {
        const nombre = inputAnime.value.trim();
        if (nombre) {
            // Buscar el siguiente número disponible
            const numeros = [...animesBorrados]
                .map(n => parseInt(n.split('.')[0]))
                .filter(n => !isNaN(n));
            const siguienteNumero = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;

            const entradaFormateada = `${siguienteNumero}.${nombre}`;
            if (!animesBorrados.has(entradaFormateada)) {
                animesBorrados.add(entradaFormateada);
                guardarLista();
                inputAnime.value = '';
                renderLista();
                removeAnime();
            }
        }

    };

    inputAnime.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') agregarBtn.click();
    });

    controlDiv.appendChild(inputAnime);
    controlDiv.appendChild(agregarBtn);
    panel.appendChild(controlDiv);

    // Contenedor de portadas
    const contenedorAnimes = document.createElement('div');
    contenedorAnimes.style.cssText = `
        display: flex; flex-wrap: wrap; gap: 20px; overflow-y: auto; flex: 1;
    `;
    panel.appendChild(contenedorAnimes);

    // Zona inferior: importar / exportar
    const footerControls = document.createElement('div');
    footerControls.style.cssText = `
       margin-top: 15px; display: flex; gap: 10px;
       justify-content: flex-end; align-items: center;
    `;


    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📤 Exportar JSON';
    exportBtn.style.cssText = 'padding: 8px 12px; background: #444; color: white; border: none; border-radius: 5px; cursor: pointer;';
    exportBtn.onclick = () => {
        const blob = new Blob([JSON.stringify([...animesBorrados], null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lista-negra-jkanime.json';
        a.click();
    };

    const importBtn = document.createElement('button');
    importBtn.textContent = '📥 Importar JSON';
    importBtn.style.cssText = 'padding: 8px 12px; background: #444; color: white; border: none; border-radius: 5px; cursor: pointer;';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';

    importBtn.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    data.forEach(n => animesBorrados.add(n));
                    guardarLista();
                    renderLista();
                    removeAnime();
                    alert('✅ Lista importada correctamente');
                } else {
                    alert('❌ El archivo no es válido');
                }
            } catch {
                alert('❌ Error al leer el archivo');
            }
        };
        reader.readAsText(file);
    };

    const borrarTodoBtn = document.createElement('button');
    borrarTodoBtn.textContent = '🗑️ Borrar Todo';
    borrarTodoBtn.style.cssText = 'padding: 8px 12px; background: darkred; color: white; border: none; border-radius: 5px; cursor: pointer;';
    borrarTodoBtn.onclick = () => {
        if (confirm('¿Estás seguro de que quieres borrar toda la lista negra?')) {
            animesBorrados.clear();
            guardarLista();
            renderLista();
            removeAnime();
        }
    };

    footerControls.appendChild(borrarTodoBtn);
    footerControls.appendChild(exportBtn);
    footerControls.appendChild(importBtn);
    footerControls.appendChild(fileInput);
    // Cerrar botón (más pequeño y al lado)
    const cerrarBtn = document.createElement('button');
    cerrarBtn.textContent = '✖';
    cerrarBtn.style.cssText = `
    padding: 6px 10px; background: red; color: white;
    border: none; border-radius: 5px; cursor: pointer;
    font-size: 14px;
    `;
    cerrarBtn.onclick = () => panel.style.display = 'none';

    footerControls.appendChild(cerrarBtn);
    panel.appendChild(footerControls);

    function renderLista() {
        contenedorAnimes.innerHTML = '';

        [...animesBorrados]
        .filter(n => /^\d+\./.test(n)) // solo entradas válidas con número
            .sort((a, b) => {
                const numA = parseInt(a.split('.')[0]);
                const numB = parseInt(b.split('.')[0]);
                return numB - numA; // orden descendente (más nuevo primero)
            })
            .forEach(nombreCompleto => {
                const nombre = nombreCompleto.split('.').slice(1).join('.').trim();
                const slug = normalizarNombre(nombre);

                const item = document.createElement('div');
                item.className = 'animeItem';
                item.style.cssText = `position: relative; width: 140px; text-align: center;`;

                const img = document.createElement('img');
                img.src = `https://cdn.jkdesu.com/assets/images/animes/image/${slug}.jpg`;
                img.style.cssText = `
                width: 100%; border-radius: 5px; transition: 0.3s;
                aspect-ratio: 1 / 1.5; object-fit: cover;
            `;

                const overlayBtn = document.createElement('div');
                overlayBtn.textContent = '❌';
                overlayBtn.style.cssText = `
                position: absolute; top: 5px; right: 5px;
                background: rgba(255,0,0,0.8); padding: 4px 8px;
                border-radius: 50%; cursor: pointer; font-size: 14px;
                display: block;
            `;
                overlayBtn.onclick = () => {
                    // buscar el nombre completo original para borrar
                    for (const item of animesBorrados) {
                        if (item.split('.').slice(1).join('.').trim() === nombre) {
                            animesBorrados.delete(item);
                            break;
                        }
                    }
                    guardarLista();
                    renderLista();
                    removeAnime();
                };

                const label = document.createElement('div');
                label.textContent = nombre;
                label.style.marginTop = '5px';

                item.appendChild(img);
                item.appendChild(overlayBtn);
                item.appendChild(label);
                contenedorAnimes.appendChild(item);
            });
    }


    toggleBtn.onclick = () => {
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        renderLista();
    };

    // Mover el botón flotante con ← →
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            toggleBtn.style.left = '0';
            toggleBtn.style.right = 'unset';
        } else if (e.key === 'ArrowRight') {
            toggleBtn.style.right = '0';
            toggleBtn.style.left = 'unset';
        }
    });

    removeAnime();
    const observer = new MutationObserver(removeAnime);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();