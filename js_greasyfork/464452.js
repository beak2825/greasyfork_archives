// ==UserScript==
// @name         WME - URs Colombia
// @namespace    http://waze.com/
// @version      2026.01.24
// @description  Panel de URs con menú de inicio, filtro por departamento y parser robusto.
// @author       Crotalo
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        GM_xmlhttpRequest
// @connect      wmebr.info
// @downloadURL https://update.greasyfork.org/scripts/464452/WME%20-%20URs%20Colombia.user.js
// @updateURL https://update.greasyfork.org/scripts/464452/WME%20-%20URs%20Colombia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_URL = "https://wmebr.info/ur/urs_on_state.php?state=All&country=Colombia&all=true";
    let CACHED_DATA = []; // Almacén de datos en memoria

    function bootstrap() {
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            init();
        } else {
            document.addEventListener("wme-ready", init, { once: true });
        }
    }

    function init() {
        console.log("WME URs Colombia: Listo.");
        addLauncher();
    }

    function createPanel() {
        if (document.getElementById("wme-ur-panel")) return;

        const panel = document.createElement("div");
        panel.id = "wme-ur-panel";

        Object.assign(panel.style, {
            position: "fixed", top: "60px", right: "20px", width: "400px", height: "75vh",
            backgroundColor: "white", border: "1px solid #ddd", borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: "10000",
            display: "flex", flexDirection: "column", fontFamily: '"Open Sans", sans-serif',
            fontSize: "13px"
        });

        panel.innerHTML = `
            <div style="padding: 12px 15px; background: #f0f4f7; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0;">
                <div style="display:flex; align-items:center;">
                    <button id="ur-back" style="display:none; cursor:pointer; background:none; border:none; font-size:16px; margin-right:10px; color:#3498db;">⬅</button>
                    <strong style="color: #354148;">URs Colombia (<span id="ur-count">0</span>)</strong>
                </div>
                <div>
                    <button id="ur-refresh" style="cursor:pointer; background:white; border:1px solid #ccc; padding:4px 8px; border-radius:4px; margin-right:5px;" title="Recargar datos">↻</button>
                    <button id="ur-close" style="cursor:pointer; background:none; border:none; color:#999; font-weight:bold; font-size:16px;" title="Cerrar">✕</button>
                </div>
            </div>
            
            <div id="ur-content" style="flex-grow: 1; overflow-y: auto; padding: 0; background: #fff; position: relative;">
                <div id="ur-loading" style="padding: 40px; text-align: center; color: #888;">
                    <p>Cargando datos...</p>
                    <div style="border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                </div>
            </div>

            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                
                /* Estilos Generales */
                .ur-row { padding: 10px 15px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.2s; }
                .ur-row:hover { background-color: #f9fcff; border-left: 3px solid #3498db; }
                .ur-desc { color: #333; margin-bottom: 4px; line-height: 1.3; }
                .ur-meta { color: #888; font-size: 11px; display: flex; justify-content: space-between; align-items: center; }
                .ur-tag { background: #eee; padding: 1px 5px; border-radius: 3px; font-size: 10px; }
                
                /* Estilos Menú Principal */
                .menu-btn {
                    display: block; width: 90%; margin: 15px auto; padding: 15px;
                    background: #fff; border: 1px solid #ddd; border-radius: 8px;
                    text-align: left; cursor: pointer; transition: all 0.2s;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .menu-btn:hover { border-color: #3498db; background: #f0f8ff; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                .menu-title { font-size: 14px; font-weight: bold; color: #2c3e50; display: block; margin-bottom: 5px; }
                .menu-desc { font-size: 11px; color: #7f8c8d; }

                /* Estilos Lista Departamentos */
                .dept-btn {
                    padding: 12px 20px; border-bottom: 1px solid #eee; cursor: pointer;
                    display: flex; justify-content: space-between; color: #444;
                }
                .dept-btn:hover { background-color: #f9f9f9; color: #3498db; }
                .dept-count { background: #eee; padding: 2px 6px; border-radius: 10px; font-size: 10px; color: #666; }
            </style>
        `;

        document.body.appendChild(panel);

        
        document.getElementById("ur-close").onclick = () => panel.style.display = "none";
        document.getElementById("ur-refresh").onclick = fetchData;
        document.getElementById("ur-back").onclick = showHome; // Por defecto vuelve al home

        fetchData();
    }

    -

    function fetchData() {
        const container = document.getElementById("ur-content");
        const countSpan = document.getElementById("ur-count");
        const backBtn = document.getElementById("ur-back");
        
        // Reset UI
        container.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #888;">
                <p>Actualizando base de datos...</p>
                <div style="border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>`;
        countSpan.innerText = "-";
        backBtn.style.display = "none";

        GM_xmlhttpRequest({
            method: "GET",
            url: TARGET_URL,
            onload: function(response) {
                // Parsing
                const dataScript = extractScript(response.responseText);
                if (dataScript) {
                    try {
                        CACHED_DATA = cleanAndParse(dataScript);
                        countSpan.innerText = CACHED_DATA.length;
                        showHome(); 
                    } catch (e) {
                        console.error(e);
                        container.innerHTML = `<p style="padding:20px; color:red;">Error parseando datos.<br><small>${e.message}</small></p>`;
                    }
                } else {
                    container.innerHTML = '<p style="padding:20px; color:red;">No se encontraron datos.</p>';
                }
            },
            onerror: () => container.innerHTML = '<p style="padding:20px; color:red;">Error de conexión.</p>'
        });
    }

    function extractScript(html) {
        const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
        let match, dataScript = "", maxLen = 0;
        while ((match = scriptRegex.exec(html)) !== null) {
            if (match[1].length > maxLen && !match[1].includes("jquery")) {
                maxLen = match[1].length;
                dataScript = match[1];
            }
        }
        const start = dataScript.indexOf('[');
        const end = dataScript.lastIndexOf(']');
        return (start !== -1 && end > start) ? dataScript.substring(start, end + 1) : null;
    }



    function showHome() {
        const container = document.getElementById("ur-content");
        const backBtn = document.getElementById("ur-back");
        
        backBtn.style.display = "none"; // Ocultar atrás en el home
        container.scrollTop = 0;

        container.innerHTML = `
            <div style="padding: 20px 0;">
                <h3 style="text-align:center; color:#333; margin-bottom:20px;">Selecciona una opción</h3>
                
                <div class="menu-btn" id="btn-show-all">
                    <span class="menu-title">🌎 Ver Todas las URs</span>
                    <span class="menu-desc">Muestra la lista completa de ${CACHED_DATA.length} reportes sin filtrar.</span>
                </div>

                <div class="menu-btn" id="btn-show-depts">
                    <span class="menu-title">🏛️ Filtrar por Departamento</span>
                    <span class="menu-desc">Selecciona un departamento específico (Antioquia, Bogotá, Valle, etc).</span>
                </div>
            </div>
        `;

        document.getElementById("btn-show-all").onclick = () => renderList(CACHED_DATA, "Todas", true);
        document.getElementById("btn-show-depts").onclick = showDepartmentsList;
    }

    function showDepartmentsList() {
        const container = document.getElementById("ur-content");
        const backBtn = document.getElementById("ur-back");
        
        // Configurar botón atrás para volver al Home
        backBtn.style.display = "block";
        backBtn.onclick = showHome;
        container.scrollTop = 0;

        
        const depts = {};
        CACHED_DATA.forEach(ur => {
            const st = ur.state ? ur.state.trim() : "Desconocido";
            depts[st] = (depts[st] || 0) + 1;
        });

        
        const sortedDepts = Object.keys(depts).sort();

        
        let html = `<div style="padding-bottom:20px;">`;
        if (sortedDepts.length === 0) html += `<p style="padding:20px; text-align:center;">No hay departamentos disponibles.</p>`;
        
        sortedDepts.forEach(dept => {
            html += `
                <div class="dept-btn" data-dept="${dept}">
                    <span>${dept}</span>
                    <span class="dept-count">${depts[dept]}</span>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;

        
        const buttons = container.querySelectorAll(".dept-btn");
        buttons.forEach(btn => {
            btn.onclick = () => {
                const selectedDept = btn.getAttribute("data-dept");
                // Filtrar datos
                const filteredData = CACHED_DATA.filter(ur => {
                    const st = ur.state ? ur.state.trim() : "Desconocido";
                    return st === selectedDept;
                });
                renderList(filteredData, selectedDept, false);
            };
        });
    }

    function renderList(data, title, isHomeBack) {
        const container = document.getElementById("ur-content");
        const backBtn = document.getElementById("ur-back");
        const countSpan = document.getElementById("ur-count");
        
        
        backBtn.style.display = "block";
        
        backBtn.onclick = isHomeBack ? showHome : showDepartmentsList;

        countSpan.innerText = data.length;
        container.innerHTML = "";
        container.scrollTop = 0;

        
        const header = document.createElement("div");
        header.style.cssText = "padding: 10px 15px; background: #fafafa; border-bottom: 1px solid #eee; color: #555; font-size: 12px; font-weight: bold;";
        header.innerText = `Vista: ${title} (${data.length})`;
        container.appendChild(header);

        if (data.length === 0) {
            container.innerHTML += '<p style="padding:20px; text-align:center; color:#888;">No hay URs en esta selección.</p>';
            return;
        }

        data.forEach(item => {
            if (item.coordinates) {
                const parts = item.coordinates.trim().split(" ");
                const lat = parts[0];
                const lon = parts[1];

                let tempDiv = document.createElement("div");
                tempDiv.innerHTML = item.description || "";
                let cleanDesc = tempDiv.textContent || tempDiv.innerText || "Sin descripción";
                cleanDesc = cleanDesc.replace("On opening by Wazer:", "").trim();
                if(cleanDesc.length > 80) cleanDesc = cleanDesc.substring(0, 80) + "...";

                const urId = item.urid;
                const user = item.updatedby || "Anónimo";
                const age = item.age + " días";
                const type = item.type;
                const state = item.state || "";

                const row = document.createElement("div");
                row.className = "ur-row";
                row.innerHTML = `
                    <div class="ur-desc">📍 ${cleanDesc}</div>
                    <div class="ur-meta">
                        <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 65%;" title="${user} - ${state}">
                            👤 ${user} <span style="color:#888; font-weight:normal;">• ${state}</span>
                        </span>
                        <span style="flex-shrink: 0;">🕒 ${age}</span>
                    </div>
                    <div class="ur-meta" style="margin-top:3px;">
                        <span class="ur-tag">${type}</span>
                        <span style="color:#3498db; font-weight:bold;">Ir ➜</span>
                    </div>
                `;

                row.onclick = () => {
                    if (W && W.map) {
                         const center = new OpenLayers.LonLat(parseFloat(lon), parseFloat(lat)).transform('EPSG:4326', 'EPSG:900913');
                         W.map.setCenter(center, 17);
                    }
                };
                container.appendChild(row);
            }
        });
    }

    
    function cleanAndParse(str) {
        str = str.replace(/,\s*\]$/, "]");
        str = str.replace(/\\n/g, "___NL___").replace(/\\r/g, "___CR___").replace(/\\t/g, "___TAB___");
        str = str.replace(/\\'/g, "___SQ_ESC___").replace(/\\"/g, "___DQ_ESC___").replace(/\\\\/g, "___BS_ESC___");
        str = str.replace(/\\/g, "\\\\");
        str = str.replace(/'/g, '"');
        str = str.replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":');
        str = str.replace(/___SQ_ESC___/g, "'").replace(/___DQ_ESC___/g, '\\"').replace(/___BS_ESC___/g, "\\\\");
        str = str.replace(/___NL___/g, "\\n").replace(/___CR___/g, "\\r").replace(/___TAB___/g, "\\t");
        return JSON.parse(str);
    }

    function addLauncher() {
        const checkInterval = setInterval(() => {
            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                clearInterval(checkInterval);
                if (document.getElementById("btn-ur-panel")) return;

                const btn = document.createElement("button");
                btn.id = "btn-ur-panel";
                btn.textContent = "🇨🇴 URs Colombia";
                Object.assign(btn.style, {
                    display: "block", width: "90%", margin: "10px auto", padding: "8px 0",
                    backgroundColor: "#2ecc71", color: "white", border: "none",
                    borderRadius: "20px", fontWeight: "bold", fontSize: "13px",
                    cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                });
                btn.onmouseover = () => btn.style.backgroundColor = "#27ae60";
                btn.onmouseout = () => btn.style.backgroundColor = "#2ecc71";
                btn.onclick = () => {
                    const panel = document.getElementById("wme-ur-panel");
                    if (!panel) createPanel();
                    else panel.style.display = (panel.style.display === "none") ? "flex" : "none";
                };
                sidebar.insertBefore(btn, sidebar.firstChild);
            }
        }, 500);
    }

    bootstrap();

})();