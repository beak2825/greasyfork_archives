// ==UserScript==
// @name         TdtVts
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  tdt vts
// @author       mumumi
// @match        https://map.tianditu.gov.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tianditu.gov.cn
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @connect      localhost
// @licence      Anti-996
// @downloadURL https://update.greasyfork.org/scripts/539812/TdtVts.user.js
// @updateURL https://update.greasyfork.org/scripts/539812/TdtVts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const defaultSpeed = 100; //1-100
    const minZoom = 3;
    const tiles = [];
    unsafeWindow.speed = defaultSpeed;
    unsafeWindow.tiles = tiles;

    function move(map, fx, fy) {
        const s = unsafeWindow.speed || defaultSpeed;
        const b = map.getBounds(), z = map.getZoom(),
              dx = b._ne.lng - b._sw.lng, dy = b._ne.lat - b._sw.lat;
        b._ne.lng += s * fx * dx / 100; b._ne.lat += s * fy * dy / 100;
        b._sw.lng += s * fx * dx / 100; b._sw.lat += s * fy * dy / 100;
        map.fitBounds(b, {duration:0}); map.setZoom(z);
    }

    function createButton(text, onClick) {
        const button = Object.assign(document.createElement('div'), {
            innerText: text,
            style: 'position:absolute;display:flex;align-items:center;justify-content:center;width:6vh;height:6vh;border-radius:3vh;border:1px solid #0078D7;background-color:white;font-size:4vh;cursor:pointer;user-select:none;z-index:100;',
            onclick: onClick
        });
        ({ '↑': () => { button.style.top = '4vh'; button.style.left = '50%'; button.style.transform = 'translateX(-50%)' },
          '→': () => { button.style.right = '4vh'; button.style.top = '50%'; button.style.transform = 'translateY(-50%)' },
          '↓': () => { button.style.bottom = '4vh'; button.style.left = '50%'; button.style.transform = 'translateX(-50%)' },
          '←': () => { button.style.left = '4vh'; button.style.top = '50%'; button.style.transform = 'translateY(-50%)' }
         })[text]?.();
        return button;
    }

    function send(s, x, y, z, b) {
        const mime = "application/octet-stream";
        const k = `${encodeURIComponent(s)}/${z}/${x}/${y}`;
        if (tiles.indexOf(k) < 0) {
            const url = `http://localhost:7788/event/v3/${k}`;
            //console.log('Sending', b)
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                data: new Blob([b], { type: mime }),
                binary: true,
                headers: { "Content-Type": mime },
                onload: function (response) {
                    //console.log('Sent', k);
                },
                onerror: function(response) {
                    if (tiles.indexOf(k) >= 0) tiles.splice(tiles.indexOf(k), 1);
                    console.error("Error", k, response);
                }
            });
            tiles.push(k);
        }
    }

    let nvt = setInterval(() => {
        const map = unsafeWindow.singleMap;
        if (map) {
            clearInterval(nvt);
            map.on('sourcedata', e => {
                if (e.isSourceLoaded && e.style.map.getZoom() >= minZoom) {
                    const ls = Object.entries(e.style.map.style._layers).filter(([k, v]) => e.sourceId === v.source).map(([k, v]) => v.sourceLayer);
                    [...new Set(ls)].forEach(sl =>{
                        e.style.map.querySourceFeatures(e.sourceId, { sourceLayer: sl }).forEach(f => {
                            if (f._vectorTileFeature) f = f._vectorTileFeature;
                            send(e.sourceId, f._x, f._y, f._z, f._pbf.buf);
                        });
                    });
                }
            });
            const topHeadDiv = document.getElementById('top_head');
            if (!topHeadDiv) return;
            const inputStyle = 'width:50px;text-align:center;';
            const zi = Object.assign(document.createElement('input'), {
                id: 'mapLevel', style: inputStyle, type: 'number', min: '2', max: '18', step: '1', value: parseInt(map.getZoom())
            });
            zi.addEventListener('change', ({ target: { value } }) => {
                const l = parseInt(value);
                isNaN(l) || l < 2 || l > 18 ? (zi.value = parseInt(map.getZoom())) : map.setZoom(l);
            });
            map.on('zoomend', () => zi.value = map.getIntZoom());
            const zl = Object.assign(document.createElement('label'), {
                htmlFor: "mapLevel",
                textContent: " 层级："
            });
            const si = Object.assign(document.createElement('input'), {
                id: 'moveSpeed', style: inputStyle, type: 'number', min: '1', max: '100', step: '1', value: defaultSpeed
            });
            si.addEventListener('change', ({ target: { value } }) => {
                const s = parseInt(value);
                isNaN(s) || s < 1|| s > 100 ? (si.value = unsafeWindow.speed) : (unsafeWindow.speed = s);
            });
            const sl = Object.assign(document.createElement('label'), {
                htmlFor: "moveSpeed",
                textContent: " 动幅："
            });
            const div = document.createElement('div');
            div.appendChild(zl);
            div.appendChild(zi);
            div.appendChild(sl);
            div.appendChild(si);
            topHeadDiv.insertBefore(div, topHeadDiv.lastChild);
            const buttons = {
                up: createButton('↑', move.bind(null, map, 0, 1)),
                right: createButton('→', move.bind(null, map, 1, 0)),
                down: createButton('↓', move.bind(null, map, 0, -1)),
                left: createButton('←', move.bind(null, map, -1, 0)),
            };
            const mapDiv = document.getElementById('tdt_map');
            mapDiv.appendChild(buttons.up);
            mapDiv.appendChild(buttons.right);
            mapDiv.appendChild(buttons.down);
            mapDiv.appendChild(buttons.left);
        }
    }, 100);
})();
