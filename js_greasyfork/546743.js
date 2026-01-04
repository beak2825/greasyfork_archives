// ==UserScript==
// @name         GuideC
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  GuideC - Empfohlene Geocaches
// @author       GuideC
// @match        https://www.geocaching.com/geocache/*
// @match        https://www.geocaching.com/seek/cache_details.aspx*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @connect      pastebin.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/546743/GuideC.user.js
// @updateURL https://update.greasyfork.org/scripts/546743/GuideC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DATA_URL = "https://pastebin.com/raw/32exgsJG";
    const SUGGEST_URL = "https://www.geocaching.com/p/?u=GuideCachelin";
    const GREASYFORK_URL = "https://greasyfork.org/de/scripts/546743-guidec";
    const VERSION = "0.22";

    let allCaches = [];

    // === GC-Code Erkennung (neu + alt) ===
    let gcCode = null;

    // Neues URL-Format (/geocache/GCxxxx)
    const m1 = window.location.pathname.match(/\/geocache\/(GC[0-9A-Z]+)/i);
    if (m1) {
        gcCode = m1[1].toUpperCase();
    }

    // Altes URL-Format (?wp=GCxxxx)
    if (!gcCode) {
        const params = new URLSearchParams(window.location.search);
        const wp = params.get("wp");
        if (wp && /^GC[0-9A-Z]+$/i.test(wp)) {
            gcCode = wp.toUpperCase();
        }
    }

    if (!gcCode) return;

    // Leaflet einbinden
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(leafletCSS);
    const leafletJS = document.createElement("script");
    leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    document.head.appendChild(leafletJS);

    GM_xmlhttpRequest({
        method:"GET",
        url: DATA_URL + "?t=" + Date.now(),
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
        onload:function(response){
            if(response.status !== 200 || !response.responseText) return showSuggestBox();
            try{
                const raw = response.responseText.replace(/^\uFEFF/,"");
                const lines = raw.split("\n").map(l=>l.trim()).filter(l=>l && !l.startsWith("#") && /^GC[0-9A-Z]+/i.test(l));
                allCaches = lines.map(line=>{
                    const parts = line.split("|");
                    if(parts.length<3) return null;
                    const code = parts[0].trim().toUpperCase();
                    const link = parts[1].trim();
                    const text = parts[2].trim();
                    let coords = null;
                    if(parts[3]) coords = parseCoords(parts[3].trim());
                    return { code, link, text, ...(coords||{}) };
                }).filter(Boolean);
                const found = allCaches.find(c=>c.code===gcCode);
                if(found) showGoldBox(found.link,found.text);
                else showSuggestBox();
            }catch(e){
                console.error("GuideC: Fehler beim Parsen der TXT",e);
                showSuggestBox();
            }
        },
        onerror: showSuggestBox
    });

    function parseCoords(str){
        const regex=/([NS])\s*(\d{1,3})[°\s]+([\d.]+)\s+([EW])\s*(\d{1,3})[°\s]+([\d.]+)/i;
        const m=str.match(regex);
        if(!m) return null;
        let lat = parseInt(m[2],10)+parseFloat(m[3])/60;
        let lon = parseInt(m[5],10)+parseFloat(m[6])/60;
        if(m[1].toUpperCase()==="S") lat=-lat;
        if(m[4].toUpperCase()==="W") lon=-lon;
        return {lat,lon};
    }

    function createFooter(box,color="#000"){
        const f = document.createElement("a");
        f.href = GREASYFORK_URL;
        f.textContent = `GuideC v${VERSION} - Beta-Version`;
        f.target="_blank"; f.rel="noopener";
        Object.assign(f.style,{
            position:"absolute", bottom:"8px", left:"12px", fontSize:"10px",
            color: color, textDecoration:"underline", fontFamily:"Segoe UI, Tahoma, Verdana, sans-serif"
        });
        box.appendChild(f);
    }

    function createCloseButton(box){
        const btn=document.createElement("button");
        btn.type="button"; btn.setAttribute("aria-label","Box schließen"); btn.textContent="×";
        Object.assign(btn.style,{
            position:"absolute", top:"12px", right:"12px",
            width:"28px", height:"28px", border:"none", borderRadius:"50%",
            background:"#ff4b4b", color:"#fff", fontWeight:"bold", fontSize:"16px",
            cursor:"pointer", boxShadow:"0 2px 6px rgba(0,0,0,0.3)",
            display:"inline-flex", alignItems:"center", justifyContent:"center",
            transition:"background 0.2s", zIndex:"10"
        });
        btn.addEventListener("mouseover",()=>btn.style.background="#d93636");
        btn.addEventListener("mouseout",()=>btn.style.background="#ff4b4b");
        btn.addEventListener("click",()=>box.remove());
        box.appendChild(btn);
    }

    function baseOverlay({bg,fg,paddingTop="28px",paddingBottom="36px",footerColor="#000"}){
        const box=document.createElement("div");
        Object.assign(box.style,{
            position:"fixed", bottom:"24px", right:"24px", background:bg, color:fg,
            padding:`${paddingTop} 22px ${paddingBottom} 22px`, borderRadius:"12px",
            boxShadow:"0 8px 20px rgba(0,0,0,0.25)", zIndex:"2147483646",
            fontSize:"15px", maxWidth:"380px", fontFamily:"Segoe UI, Tahoma, Verdana, sans-serif",
            lineHeight:"1.35", textAlign:"center", transition:"transform 0.3s ease, opacity 0.3s ease",
            backdropFilter:"blur(4px)"
        });
        createCloseButton(box);
        createFooter(box,footerColor);
        document.body.appendChild(box);
        return box;
    }

    function showGoldBox(link,text){
        const box=baseOverlay({bg:"linear-gradient(145deg,#FFD700,#FFC000)",fg:"#000",footerColor:"#000"});
        const img=document.createElement("img");
        img.src="https://s3.amazonaws.com/gs-geo-images/bce612ad-c219-4719-82fd-c7ceb2c4e5bb_sq250.png";
        img.alt="GuideCachelin"; img.style.maxWidth="50px"; img.style.marginBottom="8px"; img.style.borderRadius="6px"; box.appendChild(img);
        const prefix=document.createElement("div");
        prefix.textContent="Empfohlen von GuideCachelin"; prefix.style.fontWeight="600"; prefix.style.fontSize="15px"; prefix.style.marginBottom="6px"; box.appendChild(prefix);
        const a=document.createElement("a"); a.href=link||"#"; a.textContent=text||""; a.target="_blank"; a.rel="noopener";
        Object.assign(a.style,{color:"#000",textDecoration:"underline",fontWeight:"600",wordBreak:"break-word",transition:"color 0.2s",cursor:"pointer"});
        a.addEventListener("mouseover",()=>a.style.color="#1a1aff"); a.addEventListener("mouseout",()=>a.style.color="#000"); box.appendChild(a);
        const listLink=document.createElement("a"); listLink.href="#"; listLink.textContent="Alle empfohlenen Caches anzeigen";
        Object.assign(listLink.style,{display:"block",marginTop:"12px",fontWeight:"600",color:"#333",textDecoration:"underline",cursor:"pointer",transition:"color 0.2s"});
        listLink.addEventListener("mouseover",()=>listLink.style.color="#1a1aff"); listLink.addEventListener("mouseout",()=>listLink.style.color="#333");
        listLink.addEventListener("click",(ev)=>{ev.preventDefault(); showAllCachesList();});
        box.appendChild(listLink);
    }

    function showSuggestBox(){
        const box=baseOverlay({bg:"linear-gradient(145deg,#0e3e26,#1c5b3d)",fg:"#fff",footerColor:"#fff"});
        const a=document.createElement("a"); a.href=SUGGEST_URL; a.textContent="Diesen Cache vorschlagen für GuideCachelin."; a.target="_blank"; a.rel="noopener";
        Object.assign(a.style,{color:"#fff",fontWeight:"700",textDecoration:"underline",wordBreak:"break-word",transition:"color 0.2s",cursor:"pointer"});
        a.addEventListener("mouseover",()=>a.style.color="#FFD700"); a.addEventListener("mouseout",()=>a.style.color="#fff"); box.appendChild(a);
        const listLink=document.createElement("a"); listLink.href="#"; listLink.textContent="Alle empfohlenen Caches anzeigen";
        Object.assign(listLink.style,{display:"block",marginTop:"12px",fontWeight:"600",color:"#fff",textDecoration:"underline",cursor:"pointer",transition:"color 0.2s"});
        listLink.addEventListener("mouseover",()=>listLink.style.color="#FFD700"); listLink.addEventListener("mouseout",()=>listLink.style.color="#fff");
        listLink.addEventListener("click",(ev)=>{ev.preventDefault(); showAllCachesList();});
        box.appendChild(listLink);
    }

    function showAllCachesList(){
        const overlay=document.createElement("div");
        Object.assign(overlay.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",background:"rgba(0,0,0,0.7)",zIndex:"2147483647",display:"flex",alignItems:"center",justifyContent:"center"});
        const listBox=document.createElement("div");
        Object.assign(listBox.style,{background:"#1b4d37",color:"#fff",padding:"36px 24px 24px 24px",borderRadius:"12px",maxWidth:"850px",width:"850px",maxHeight:"85%",overflowY:"auto",position:"relative",fontFamily:"Segoe UI, Tahoma, Verdana, sans-serif",boxShadow:"0 10px 25px rgba(0,0,0,0.4)"});
        const title=document.createElement("h2"); title.textContent="Alle empfohlenen Caches von GuideCachelin";
        Object.assign(title.style,{marginTop:"0",marginBottom:"14px",textAlign:"center",color:"#FFD700"}); listBox.appendChild(title);

        // Tabs
        const tabDiv=document.createElement("div"); Object.assign(tabDiv.style,{marginBottom:"12px",display:"flex",justifyContent:"center",gap:"4px"});
        const listBtn=document.createElement("button"), mapBtn=document.createElement("button");
        [listBtn,mapBtn].forEach(btn=>{ Object.assign(btn.style,{padding:"6px 14px",border:"none",borderRadius:"6px",cursor:"pointer",fontWeight:"600",fontSize:"14px"}); tabDiv.appendChild(btn); });
        listBtn.textContent="Liste"; mapBtn.textContent="Karte";
        listBtn.style.background="#3da066"; mapBtn.style.background="#2c6b4b"; listBtn.style.color="#fff"; mapBtn.style.color="#fff";
        listBox.appendChild(tabDiv);

        // Search only for list
        const search=document.createElement("input"); search.type="text"; search.placeholder="Suchen...";
        Object.assign(search.style,{width:"95%",padding:"8px 12px",marginBottom:"14px",borderRadius:"8px",border:"1px solid #ccc",fontSize:"14px",color:"#000",outline:"none",transition:"border 0.2s"}); search.addEventListener("focus",()=>search.style.border="1px solid #FFD700"); search.addEventListener("blur",()=>search.style.border="1px solid #ccc"); listBox.appendChild(search);

        allCaches.sort((a,b)=>a.code.localeCompare(b.code));
        const table=document.createElement("table"); Object.assign(table.style,{width:"100%",borderCollapse:"collapse"});
        allCaches.forEach(c=>{
            const row=document.createElement("tr");
            row.style.transition="background 0.2s"; row.addEventListener("mouseover",()=>row.style.background="#2c6b4b"); row.addEventListener("mouseout",()=>row.style.background="transparent");
            const codeCell=document.createElement("td"); const codeLink=document.createElement("a"); codeLink.href="http://coord.info/"+c.code; codeLink.textContent=c.code; Object.assign(codeLink.style,{color:"#FFD700",textDecoration:"underline",fontWeight:"700"}); codeLink.addEventListener("mouseover",()=>codeLink.style.color="#fff"); codeLink.addEventListener("mouseout",()=>codeLink.style.color="#FFD700"); codeCell.appendChild(codeLink); codeCell.style.paddingRight="16px"; codeCell.style.textAlign="right"; row.appendChild(codeCell);
            const nameCell=document.createElement("td"); const nameLink=document.createElement("a"); nameLink.href=c.link; nameLink.textContent=c.text; Object.assign(nameLink.style,{color:"#FFFFFF",textDecoration:"underline",fontWeight:"600"}); nameLink.addEventListener("mouseover",()=>nameLink.style.color="#FFD700"); nameLink.addEventListener("mouseout",()=>nameLink.style.color="#FFFFFF"); nameCell.appendChild(nameLink); nameCell.style.textAlign="left"; row.appendChild(nameCell);
            table.appendChild(row);
        });
        listBox.appendChild(table);

        // Map
        const mapDiv=document.createElement("div"); Object.assign(mapDiv.style,{width:"100%",height:"600px",display:"none",marginTop:"10px",borderRadius:"12px",overflow:"hidden",boxShadow:"0 6px 20px rgba(0,0,0,0.4)"}); listBox.appendChild(mapDiv);
        let mapInitialized=false, map;
        function initMap(){ if(mapInitialized) return; try { map=L.map(mapDiv).setView([51.163,10.447],6); L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(map); allCaches.forEach(c=>{if(c.lat&&c.lon){const marker=L.marker([c.lat,c.lon]).addTo(map); marker.bindTooltip(c.text); marker.bindPopup(`<a href="${c.link}" target="_blank">${c.code}</a>`);}}); const markers=allCaches.filter(c=>c.lat&&c.lon).map(c=>[c.lat,c.lon]); if(markers.length) map.fitBounds(L.latLngBounds(markers)); mapInitialized=true; } catch(e){ console.error("GuideC: Leaflet Fehler",e);} }
        listBtn.addEventListener("click",()=>{ listBtn.style.background="#3da066"; mapBtn.style.background="#2c6b4b"; table.style.display=""; mapDiv.style.display="none"; search.style.display=""; });
        mapBtn.addEventListener("click",()=>{ mapBtn.style.background="#3da066"; listBtn.style.background="#2c6b4b"; table.style.display="none"; mapDiv.style.display=""; search.style.display="none"; initMap(); setTimeout(()=>map.invalidateSize(),200); });
        listBtn.click();
        search.addEventListener("input",()=>{ const term=search.value.toLowerCase(); [...table.querySelectorAll("tr")].forEach(row=>{ row.style.display=row.innerText.toLowerCase().includes(term)?"":"none"; }); });

        // close
        const closeBtn=document.createElement("button"); closeBtn.textContent="×"; Object.assign(closeBtn.style,{position:"absolute",top:"12px",right:"12px",background:"#ff4b4b",color:"#fff",border:"none",borderRadius:"50%",width:"34px",height:"34px",fontSize:"18px",fontWeight:"bold",cursor:"pointer",boxShadow:"0 2px 6px rgba(0,0,0,0.3)",transition:"background 0.2s",zIndex:"10"}); closeBtn.addEventListener("mouseover",()=>closeBtn.style.background="#d93636"); closeBtn.addEventListener("mouseout",()=>closeBtn.style.background="#ff4b4b"); closeBtn.addEventListener("click",()=>overlay.remove()); listBox.appendChild(closeBtn);

        function escHandler(e){if(e.key==="Escape"){overlay.remove();document.removeEventListener("keydown",escHandler);}}
        document.addEventListener("keydown",escHandler);
        overlay.appendChild(listBox); document.body.appendChild(overlay);
    }

})();
