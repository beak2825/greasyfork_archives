// ==UserScript==
// @name         WME - URs Colombia
// @namespace    http://waze.com/
// @version      2026.01.28
// @description  Panel de Ur´s de Colombia integrado en el WME
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
    let CACHED_DATA = [];

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

                .ur-row { padding: 10px 15px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.2s; }
                .ur-row:hover { background-color: #f9fcff; border-left: 3px solid #3498db; }
                .ur-selected { background-color: #fff9c4 !important; border-left: 4px solid #f1c40f !important; }

                .ur-desc { color: #333; margin-bottom: 4px; line-height: 1.3; }
                .ur-meta { color: #888; font-size: 11px; display: flex; justify-content: space-between; align-items: center; }
                .ur-tag { background: #eee; padding: 1px 5px; border-radius: 3px; font-size: 10px; }

                .menu-btn { display: block; width: 90%; margin: 15px auto; padding: 15px; background: #fff; border: 1px solid #ddd; border-radius: 8px; text-align: left; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                .menu-btn:hover { border-color: #3498db; background: #f0f8ff; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                .menu-title { font-size: 14px; font-weight: bold; color: #2c3e50; display: block; margin-bottom: 5px; }
                .menu-desc { font-size: 11px; color: #7f8c8d; }

                .dept-btn { padding: 12px 20px; border-bottom: 1px solid #eee; cursor: pointer; display: flex; justify-content: space-between; color: #444; }
                .dept-btn:hover { background-color: #f9f9f9; color: #3498db; }
                .dept-count { background: #eee; padding: 2px 6px; border-radius: 10px; font-size: 10px; color: #666; }
            </style>
        `;

        document.body.appendChild(panel);
        document.getElementById("ur-close").onclick = () => panel.style.display = "none";
        document.getElementById("ur-refresh").onclick = fetchData;
        document.getElementById("ur-back").onclick = showHome;

        fetchData();
    }

    function fetchData() {
        const container = document.getElementById("ur-content");
        const countSpan = document.getElementById("ur-count");
        const backBtn = document.getElementById("ur-back");

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
        backBtn.style.display = "none";
        container.scrollTop = 0;
        container.innerHTML = `
            <div style="padding: 20px 0;">
                <h3 style="text-align:center; color:#333; margin-bottom:20px;">Selecciona una opción</h3>
                <div class="menu-btn" id="btn-show-all"><span class="menu-title">🌎 Ver Todas las URs</span></div>
                <div class="menu-btn" id="btn-show-depts"><span class="menu-title">🏛️ Filtrar por Departamento</span></div>
            </div>`;
        document.getElementById("btn-show-all").onclick = () => renderList(CACHED_DATA, "Todas", true);
        document.getElementById("btn-show-depts").onclick = showDepartmentsList;
    }

    function showDepartmentsList() {
        const container = document.getElementById("ur-content");
        const backBtn = document.getElementById("ur-back");
        backBtn.style.display = "block";
        backBtn.onclick = showHome;
        container.scrollTop = 0;

        const depts = {};
        CACHED_DATA.forEach(ur => { let s = ur.state ? ur.state.trim() : "Desconocido"; depts[s] = (depts[s]||0)+1; });
        const sortedDepts = Object.keys(depts).sort();

        let html = `<div style="padding-bottom:20px;">`;
        sortedDepts.forEach(dept => {
            html += `<div class="dept-btn" data-dept="${dept}"><span>${dept}</span><span class="dept-count">${depts[dept]}</span></div>`;
        });
        html += `</div>`;
        container.innerHTML = html;
        container.querySelectorAll(".dept-btn").forEach(btn => {
            btn.onclick = () => {
                const d = btn.getAttribute("data-dept");
                renderList(CACHED_DATA.filter(ur => (ur.state?ur.state.trim():"Desconocido") === d), d, false);
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

        const header = document.createElement("div");
        header.style.cssText = "padding:10px; background:#fafafa; border-bottom:1px solid #eee; font-weight:bold; font-size:12px;";
        header.innerText = `Vista: ${title} (${data.length})`;
        container.appendChild(header);

        data.forEach(item => {
            if (item.coordinates) {
                const parts = item.coordinates.trim().split(" ");
                const lat = parseFloat(parts[0]);
                const lon = parseFloat(parts[1]);
                const urId = item.urid;

                let d = document.createElement("div"); d.innerHTML = item.description||"";
                let desc = (d.textContent||d.innerText||"Sin descripción").replace("On opening by Wazer:","").trim().substring(0,80)+"...";

                const row = document.createElement("div");
                row.className = "ur-row";
                row.id = `ur-row-${urId}`;
                row.innerHTML = `<div class="ur-desc">📍 ${desc}</div><div class="ur-meta"><span>👤 ${item.updatedby}</span><span>🕒 ${item.age}d</span></div>`;

                row.onclick = function() {
                    // Visual
                    document.querySelectorAll('.ur-selected').forEach(el => el.classList.remove('ur-selected'));
                    this.classList.add('ur-selected');
                    // Ejecutar lógica solicitada
                    centrarYAbirUR(urId, lat, lon);
                };
                container.appendChild(row);
            }
        });
    }


    function centrarYAbirUR(id, lat, lon) {
        if (!W || !W.map) return;

        console.log(`Intentando abrir UR ${id}...`);


        var center = new OpenLayers.LonLat(lon, lat).transform('EPSG:4326', 'EPSG:900913');
        W.map.setCenter(center, 17); // Zoom 17 es detalle


        let intentos = 0;

        const intervalo = setInterval(() => {
            intentos++;

            const urObj = W.model.mapUpdateRequests.getObjectById(parseInt(id, 10));

            if (urObj) {
                clearInterval(intervalo);


                if (W.problemsController && typeof W.problemsController.showProblem === 'function') {
                     W.problemsController.showProblem(urObj);
                     console.log(`Abriendo panel para UR ${id} (Método problemsController)`);
                }

                else if (W.selectionManager) {
                     W.selectionManager.setSelectedModels([urObj]);
                     console.log(`Abriendo panel para UR ${id} (Método selectionManager)`);
                } else {
                     console.error("No se encontró método para abrir la UR");
                }

            } else {
                if (intentos > 20) {
                    clearInterval(intervalo);
                    console.log(`UR ${id} no cargó a tiempo.`);
                }
            }
        }, 500);
    }


    function cleanAndParse(str) {
        str = str.replace(/,\s*\]$/, "]");
        str = str.replace(/\\n/g, "").replace(/\\r/g, "").replace(/\\t/g, "");
        str = str.replace(/\\'/g, "__SQ__").replace(/\\"/g, "__DQ__").replace(/\\\\/g, "__BS__");
        str = str.replace(/\\/g, "\\\\"); str = str.replace(/'/g, '"'); str = str.replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":');
        str = str.replace(/__SQ__/g, "'").replace(/__DQ__/g, '\\"').replace(/__BS__/g, "\\\\");
        return JSON.parse(str);
    }

    function addLauncher() {
        const i = setInterval(() => {
            const s = document.getElementById("sidebar");
            if (s) {
                clearInterval(i);
                if (document.getElementById("btn-ur-panel")) return;
                const b = document.createElement("button");
                b.id = "btn-ur-panel"; b.innerText = "🇨🇴 URs Colombia";
                Object.assign(b.style, { display:"block", width:"90%", margin:"10px auto", padding:"8px 0", background:"#2ecc71", color:"white", border:"none", borderRadius:"20px", fontWeight:"bold", cursor:"pointer" });
                b.onclick = () => { const p=document.getElementById("wme-ur-panel"); if(p) p.style.display=(p.style.display=="none"?"flex":"none"); else createPanel(); };
                s.insertBefore(b, s.firstChild);
            }
        }, 1000);
    }

    bootstrap();
})();