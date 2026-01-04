// ==UserScript==
// @name         Geoguessr Finder
// @namespace    http://tampermonkey.net/
// @version      70.0
// @description  DOĞRU API
// @author       Ferres
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543340/Geoguessr%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/543340/Geoguessr%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Değişkenler ---
    let currentRoundCoordinates = { lat: null, lng: null };

    // --- SENİN VERDİĞİN MANTIKLA AĞI DİNLEME ---
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // Sadece bu iki, en önemli ve doğru sonucu veren API adresini dinle.
        if (method.toUpperCase() === 'POST' &&
            (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
             url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

            this.addEventListener('load', function () {
                try {
                    const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
                    // Gelen yanıtta koordinat varsa al. Yoksa hata verir, catch bloğu yakalar.
                    const match = this.responseText.match(pattern);
                    if (match && match.length > 0) {
                        const coords = match[0].split(",");
                        const lat = Number.parseFloat(coords[0]);
                        const lng = Number.parseFloat(coords[1]);

                        // Yakalanan en son doğru konumu değişkene yaz.
                        currentRoundCoordinates.lat = lat;
                        currentRoundCoordinates.lng = lng;
                    }
                } catch(e) {
                    // Hata olursa (örn. yanıtta koordinat yoksa) görmezden gel, program çökmesin.
                }
            });
        }
        // Diğer tüm isteklerin orijinal şekilde çalışmasına izin ver.
        return originalOpen.apply(this, arguments);
    };


    // --- Arayüz (Taş gibi, dokunulmadı) ---
    let mapInitialized = false;
    function setupMapOnce() {
        if (mapInitialized) return;
        mapInitialized = true;
        GM_addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
            @keyframes rgb-text-animation { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
            #ferres-map-container { position: fixed; top: 10%; left: 70%; width: 470px; height: 380px; min-width: 300px; min-height: 200px; z-index: 20000; background-color: #f0f0f0; border-top: none; border-left: 5px solid #5a009c; border-right: 5px solid #5a009c; border-bottom: 5px solid #5a009c; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.6); display: none; font-family: sans-serif; }
            #ferres-map-header { width: 100%; padding: 6px 0; background-color: #5a009c; text-align: center; font-family: 'Orbitron', sans-serif; font-size: 1.3em; cursor: move; user-select: none; border-top-left-radius: 4px; border-top-right-radius: 4px; color: #ff00de; animation: rgb-text-animation 5s linear infinite; }
            #location-iframe { width: 100%; height: calc(100% - 42px); border: none; pointer-events: none; }
            .resizer { position: absolute; background: transparent; z-index: 10; } .resizer.top-left { top: -5px; left: -5px; width: 10px; height: 10px; cursor: nwse-resize; } .resizer.top-right { top: -5px; right: -5px; width: 10px; height: 10px; cursor: nesw-resize; } .resizer.bottom-left { bottom: -5px; left: -5px; width: 10px; height: 10px; cursor: nesw-resize; } .resizer.bottom-right { bottom: -5px; right: -5px; width: 10px; height: 10px; cursor: nwse-resize; } .resizer.top { top: -5px; left: 5px; right: 5px; height: 10px; cursor: ns-resize; } .resizer.bottom { bottom: -5px; left: 5px; right: 5px; height: 10px; cursor: ns-resize; } .resizer.left { left: -5px; top: 5px; bottom: 5px; width: 10px; cursor: ew-resize; } .resizer.right { right: -5px; top: 5px; bottom: 5px; width: 10px; cursor: ew-resize; }
        `);
        const mapContainer = document.createElement('div'); mapContainer.id = 'ferres-map-container';
        const header = document.createElement('div'); header.id = 'ferres-map-header'; header.textContent = 'Ferres';
        const iframe = document.createElement('iframe'); iframe.id = 'location-iframe';
        mapContainer.appendChild(header); mapContainer.appendChild(iframe); document.body.appendChild(mapContainer);
        window.geoguessrMapInfo = { mapContainer, iframe };
        dragElement(mapContainer, header); makeResizable(mapContainer);
    }
    function dragElement(elmnt, header) { let p1=0,p2=0,p3=0,p4=0;header.onmousedown=e=>{e.preventDefault();p3=e.clientX;p4=e.clientY;document.onmouseup=()=>{document.onmouseup=null;document.onmousemove=null;};document.onmousemove=e=>{e.preventDefault();p1=p3-e.clientX;p2=p4-e.clientY;p3=e.clientX;p4=e.clientY;elmnt.style.top=(elmnt.offsetTop-p2)+"px";elmnt.style.left=(elmnt.offsetLeft-p1)+"px";};}; }
    function makeResizable(el) { const r=['top-left','top-right','bottom-left','bottom-right','top','bottom','left','right'];r.forEach(dir=>{const d=document.createElement('div');d.className=`resizer ${dir}`;el.appendChild(d);d.addEventListener('mousedown',e=>{e.stopPropagation();e.preventDefault();const mv=(ev)=>rs(ev,d.classList),up=()=>stop(mv,up);window.addEventListener('mousemove',mv,false);window.addEventListener('mouseup',up,false);},false);});const o={};function rs(e,c){if(!o.w){o.w=parseFloat(getComputedStyle(el,null).getPropertyValue('width').replace('px',''));o.h=parseFloat(getComputedStyle(el,null).getPropertyValue('height').replace('px',''));o.x=el.offsetLeft;o.y=el.offsetTop;o.mx=e.pageX;o.my=e.pageY;}const xd=e.pageX-o.mx,yd=e.pageY-o.my;if(c.contains('bottom')||c.contains('bottom-left')||c.contains('bottom-right')){const h=o.h+yd;if(h>200)el.style.height=h+'px';}if(c.contains('top')||c.contains('top-left')||c.contains('top-right')){const h=o.h-yd;if(h>200){el.style.height=h+'px';el.style.top=o.y+yd+'px';}}if(c.contains('right')||c.contains('top-right')||c.contains('bottom-right')){const w=o.w+xd;if(w>300)el.style.width=w+'px';}if(c.contains('left')||c.contains('top-left')||c.contains('bottom-left')){const w=o.w-xd;if(w>300){el.style.width=w+'px';el.style.left=o.x+xd+'px';}}}function stop(mv,up){Object.keys(o).forEach(k=>delete o[k]);window.removeEventListener('mousemove',mv,false);window.removeEventListener('mouseup',up,false);}}

    function showLocation() {
        if (!mapInitialized || !window.geoguessrMapInfo) return;
        const { iframe } = window.geoguessrMapInfo;
        if (currentRoundCoordinates.lat !== null) {
            const { lat, lng } = currentRoundCoordinates;
            const zoomOffset = 3.0; // Ülkeyi görecek kadar geniş bir zoom
            iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-zoomOffset},${lat-zoomOffset},${lng+zoomOffset},${lat+zoomOffset}&layer=mapnik&marker=${lat},${lng}`;
        } else {
            alert('Henüz konum alınamadı. Turun başlamasını bekleyin.');
        }
    }

    function toggleMap() {
        if (!mapInitialized) setupMapOnce();
        window.geoguessrMapInfo.mapContainer.style.display = window.geoguessrMapInfo.mapContainer.style.display === 'none' ? 'block' : 'none';
    }

    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'Insert') toggleMap();
        if (e.key.toLowerCase() === 'q' && mapInitialized && window.geoguessrMapInfo.mapContainer.style.display !== 'none') {
            showLocation();
        }
    });

})();