// ==UserScript==
// @name         MZScout
// @namespace    http://tampermonkey.net/
// @version      0.6.6
// @description  Narzędzie do oceny zawodników na podstawie wskazanych wag umiejętności
// @author       kajczyn
// @match        https://www.managerzone.com/?p=players
// @match        https://www.managerzone.com/?p=players&pid=*
// @match        https://www.managerzone.com/?p=players&tid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542946/MZScout.user.js
// @updateURL https://update.greasyfork.org/scripts/542946/MZScout.meta.js
// ==/UserScript==

(function() {
'use strict';
const pozycjeDomyslne = [
"Bramkarz","Obrońca","Boczny obrońca","ŚPD","ŚP","ŚPO","Skrzydłowy","Napastnik","Głowacz"
];
const umiejetnosci = [
"Szybkość","Kondycja","Przegląd gry","Podania dołem","Strzał","Gra głową","Gra na bramce",
"Panowanie","Odbiór piłki","Podania górą","Stałe fragmenty","Doświadczenie","Forma"
];
const wagiMinDefaults = {
"Bramkarz": {"Szybkość":{w:5,m:0},"Kondycja":{w:8,m:0},"Przegląd gry":{w:9,m:0}, "Podania dołem":{w:0,m:0}, "Strzał":{w:0,m:0},"Gra głową":{w:0,m:0},"Gra na bramce":{w:10,m:9}, "Panowanie":{w:7,m:0},"Odbiór piłki":{w:0,m:0},"Podania górą":{w:7,m:0},"Stałe fragmenty":{w:0,m:0},"Doświadczenie":{w:8,m:0},"Forma":{w:8,m:0}},
"Obrońca": {"Szybkość":{w:7.5,m:0},"Kondycja":{w:8.5,m:0},"Przegląd gry":{w:9,m:0}, "Podania dołem":{w:6,m:0}, "Strzał":{w:0,m:0}, "Gra głową":{w:6,m:0},"Gra na bramce":{w:0,m:0},"Panowanie":{w:8,m:0},"Odbiór piłki":{w:10,m:0},"Podania górą":{w:8,m:0},"Stałe fragmenty":{w:0,m:0},"Doświadczenie":{w:8,m:0},"Forma":{w:3,m:0}},
"Boczny obrońca": {"Szybkość":{w:8.5,m:0},"Kondycja":{w:8.5,m:0},"Przegląd gry":{w:9,m:0}, "Podania dołem":{w:6.5,m:0}, "Strzał":{w:0,m:0},"Gra głową":{w:1,m:0},"Gra na bramce":{w:0,m:0},"Panowanie":{w:8,m:0},"Odbiór piłki":{w:10,m:0},"Podania górą":{w:8,m:0},"Stałe fragmenty":{w:0,m:0},"Doświadczenie":{w:8,m:0},"Forma":{w:3,m:0}},
"ŚPD": {"Szybkość":{w:7,m:0},"Kondycja":{w:8,m:0},"Przegląd gry":{w:8,m:0}, "Podania dołem":{w:8,m:0}, "Strzał":{w:0,m:0},"Gra głową":{w:0,m:0},"Gra na bramce":{w:0,m:0},"Panowanie":{w:2,m:0},"Odbiór piłki":{w:8,m:0},"Podania górą":{w:7,m:0},"Stałe fragmenty":{w:0,m:0},"Doświadczenie":{w:8,m:0},"Forma":{w:8,m:0}},
"ŚP": {"Szybkość":{w:8,m:0},"Kondycja":{w:8.5,m:0},"Przegląd gry":{w:9,m:0}, "Podania dołem":{w:7,m:0}, "Strzał":{w:6,m:0},"Gra głową":{w:0,m:0},"Gra na bramce":{w:0,m:0},"Panowanie":{w:9,m:0},"Odbiór piłki":{w:9,m:0},"Podania górą":{w:9,m:0},"Stałe fragmenty":{w:0,m:0},"Doświadczenie":{w:8,m:0},"Forma":{w:8,m:0}},
"ŚPO": {"Szybkość":{w:6,m:0},"Kondycja":{w:8,m:0},"Przegląd gry":{w:8,m:0}, "Podania dołem":{w:8,m:0}, "Strzał":{w:8,m:0},"Gra głową":{w:0,m:0},"Gra na bramce":{w:0,m:0},"Panowanie":{w:7,m:0},"Odbiór piłki":{w:7,m:0},"Podania górą":{w:7,m:0},"Stałe fragmenty":{w:0,m:0},"Doświadczenie":{w:8,m:0},"Forma":{w:8,m:0}},
"Skrzydłowy": {"Szybkość":{w:9,m:0},"Kondycja":{w:8,m:0},"Przegląd gry":{w:9.5,m:0}, "Podania dołem":{w:5,m:0}, "Strzał":{w:6,m:0},"Gra głową":{w:0,m:0},"Gra na bramce":{w:0,m:0},"Panowanie":{w:9.5,m:0},"Odbiór piłki":{w:6,m:0},"Podania górą":{w:10,m:0},"Stałe fragmenty":{w:0,m:0},"Doświadczenie":{w:8,m:0},"Forma":{w:8,m:0}},
"Napastnik": {"Szybkość":{w:8,m:0},"Kondycja":{w:8.5,m:0},"Przegląd gry":{w:9,m:0}, "Podania dołem":{w:0,m:0}, "Strzał":{w:10,m:0},"Gra głową":{w:2,m:0},"Gra na bramce":{w:0,m:0},"Panowanie":{w:8,m:0},"Odbiór piłki":{w:4,m:0},"Podania górą":{w:3,m:0},"Stałe fragmenty":{w:0,m:0},"Doświadczenie":{w:8,m:0},"Forma":{w:8,m:0}},
"Głowacz": {"Szybkość":{w:7,m:0},"Kondycja":{w:8.5,m:0},"Przegląd gry":{w:9,m:0}, "Podania dołem":{w:0,m:0}, "Strzał":{w:10,m:0},"Gra głową":{w:10,m:0},"Gra na bramce":{w:0,m:0},"Panowanie":{w:8,m:0},"Odbiór piłki":{w:4,m:0},"Podania górą":{w:3,m:0},"Stałe fragmenty":{w:0,m:0},"Doświadczenie":{w:8,m:0},"Forma":{w:8,m:0}}
};
function getCurrentStore(){
    let d = localStorage.getItem('mz_weights_adv');
    if(d) try{ return JSON.parse(d); }catch(e){}
    return {
        useMin: true,
        pozycje: JSON.parse(JSON.stringify(pozycjeDomyslne)),
        wagi: JSON.parse(JSON.stringify(wagiMinDefaults)),
        custom: []
    }
}
function setCurrentStore(obj){
    localStorage.setItem('mz_weights_adv', JSON.stringify(obj));
}
function showPopup(msg) {
    let pop = document.createElement('div');
    pop.style='position:fixed;top:30%;left:50%;transform:translate(-50%,-50%);z-index:233200;background:#232d50;color:#fff;padding:18px 34px;border:2px solid #ffe65f;border-radius:13px;font-size:18px;font-family:Segoe UI,sans-serif;box-shadow:0 5px 16px #140d29a8;opacity:0;transition:opacity .14s;';
    pop.innerHTML = '<span style="color:#ffe65f;font-weight:bold;">'+msg+'</span>';
    document.body.appendChild(pop);
    setTimeout(()=>{pop.style.opacity='1';},20);
    setTimeout(()=>{pop.style.opacity='0'; setTimeout(()=>pop.remove(),210)},990);
}
function showWeightsEditor() {
    if(document.querySelector('.mz-modal-overlay')) return;
    let store = getCurrentStore();
    let modal = document.createElement('div');
    modal.className = 'mz-modal-overlay';
    modal.style = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:rgba(23,25,45,.97);display:flex;align-items:center;justify-content:center;';
    let content = document.createElement('div');
    content.className = 'mz-modal-content';
    content.style = 'background:#181d34;padding:25px 28px 14px 28px;border-radius:15px;box-shadow:0 5px 32px #161a30;max-height:97vh;overflow-y:auto;min-width:320px;max-width:97vw;border:2px solid #3a4f80;position:relative;';
    content.innerHTML = `
        <span id="mzclosegui" style="position:absolute;top:10px;right:14px;cursor:pointer;font-size:25px;color:#ffe65f;font-weight:bold;line-height:1;">&#10005;</span>
        <h3 style="margin:0 0 11px 0;color:#ffe65f;text-shadow:0 2px 10px #090c17;font-weight:700;font-size:21.5px;">MZScout ustawienia</h3>
        <div style="margin-bottom: 11px;">
            <label><input type="checkbox" id="min_checkbox" ${store.useMin ? "checked" : ""} style="vertical-align:middle;margin-top:-2px;"> <b style="color:#ffe65f">Uwzględniaj minima</b></label>
        </div>
        <div style="margin-bottom:8px;">
            <label style="font-weight:600;color:#ffe65f;margin-right:8px;">Pozycja:</label>
            <select id="position_select" style="border-radius:7px;font-size:15px;padding:3.5px 12px 3.5px 3.5px;background: #232d50;color:#fff;border:1px solid #4d6ca6;">
            ${store.pozycje.map(p=>`<option>${p}</option>`).join('')}
            </select>
            <button type="button" id="add_custom_position" style="margin-left:10px;padding:2px 9px 3px 9px;font-size:15px;background:#ffe65f;color:#181d34;border-radius:5px;border:none;cursor:pointer;font-weight:bold;">Dodaj pozycję</button>
        </div>
        <div id="umiejetnosci_fields"></div>
        <div style="margin-top:10px;display:flex;gap:13px;border-top:1px solid #2c3254;padding-top:9px;">
            <button type="button" id="mz_weight_save" style="flex:1 1 0;border-radius:8px;font-size:15px;padding:8px 0;background:#ffe65f;color:#1d243d;border:none;font-weight:bold;cursor:pointer;transition:.18s;">Zapisz</button>
            <button type="button" id="mz_weight_cancel" style="flex:1 1 0;border-radius:8px;font-size:15px;padding:8px 0;background:#242d4b;color:#fff;border:none;font-weight:normal;cursor:pointer;transition:.18s;">Anuluj</button>
            <button type="button" id="mz_weight_reset" style="flex:1 1 0;border-radius:8px;font-size:15px;padding:8px 0;background:#242d4b;color:#fff;border:none;font-weight:normal;cursor:pointer;transition:.18s;">Domyślne</button>
            <button type="button" id="del_position" style="flex:1 1 0;border-radius:8px;font-size:15px;padding:8px 0;background:#bc4242;color:#fff;border:none;font-weight:normal;cursor:pointer;transition:.18s;${store.pozycje.length===pozycjeDomyslne.length?"display:none":""}">Usuń pozycję</button>
        </div>
        <div style="margin-top:8px;font-size:13px;color:#bbbbcc">Możesz nadać własne pozycje, usuwać je i ustalać wymagane minimum skilla</div>
        <div id="addcustomrow" style="margin-top:9px;display:none;">
            <span style="color:#ffe65f;font-weight:bold;">Nowa pozycja:</span>
            <input id="inp_custom_pos" type="text" maxlength="30"
             style="font-size:15px;padding:2px 7px;border-radius:6px;width:140px;margin-right:7px;background:#283959;color:#fff;border:1px solid #4d6ca6;">
            <button id="okcustompos" style="background:#ffe65f;color:#181d34;font-size:15px;font-weight:bold;padding:2px 13px;border-radius:6px;border:none;cursor:pointer">Dodaj</button>
            <button id="closecustompos" style="background:#fff;color:#464646;font-size:12px;padding:1.5px 12px;border-radius:6px;border:none;cursor:pointer;font-weight:bold">×</button>
        </div>
        <div style="margin-top:15px;text-align:center;color:#ffe65f;font-size:15px;font-family:Segoe UI,sans-serif;padding:2px 0 0 0;letter-spacing:0.2px;"><b>&copy;&nbsp;kajczyn</b></div>
         `;
    modal.appendChild(content);
    document.body.appendChild(modal);
    let sel = content.querySelector('#position_select');
    let wagiBufor = JSON.parse(JSON.stringify(store.wagi));
    let currentPosition = store.pozycje[0];
    function renderFields(pos){
        let html = '<div style="font-size:14px;padding-bottom:7px;"><span style="display:inline-block;width:154px;color:#ffe65f;">Umiejętność</span><span style="display:inline-block;width:60px;color:#ffe65f;">Waga</span><span style="display:inline-block;width:56px;color:#ffe65f;">Min</span></div>';
        umiejetnosci.forEach(um=>{
            let rec=wagiBufor[pos][um]||{w:0,m:0};
            html+=`<div style="margin-bottom:7px;">
            <label style="display:inline-block;width:142px;font-size:15px;color:#fff;font-weight:500;">${um}:</label>
            <input type="text" inputmode="decimal" name="w_${um}" value="${rec.w}"
                style="width:44px;background:#222f47;color:#fff;padding:3.5px 9px;border-radius:8px;border:1.5px solid #3c477a;font-size:15px;">
            <input type="text" inputmode="numeric" name="m_${um}" value="${rec.m}"
                style="width:36px;background:#232a40;color:#fff;padding:3.5px 7px;margin-left:7px;border-radius:8px;border:1.5px solid #3c477a;font-size:15px;">
            </div>`;
        });
        content.querySelector('#umiejetnosci_fields').innerHTML = html;
        umiejetnosci.forEach(um=>{
            let wInp = content.querySelector(`input[name="w_${um}"]`);
            let mInp = content.querySelector(`input[name="m_${um}"]`);
            if(wInp) wInp.oninput = function(){wagiBufor[currentPosition][um]={w:parseFloat((wInp.value+'').replace(',','.'))||0,m:parseFloat((mInp.value+'').replace(',','.'))||0};};
            if(mInp) mInp.oninput = function(){wagiBufor[currentPosition][um]={w:parseFloat((wInp.value+'').replace(',','.'))||0,m:parseFloat((mInp.value+'').replace(',','.'))||0};};
        });
    }
    renderFields(currentPosition);
    sel.onchange = function(){
        currentPosition=this.value;
        renderFields(currentPosition);
        content.querySelector("#del_position").style.display = store.pozycje.indexOf(currentPosition)>=pozycjeDomyslne.length ? "" : "none";
    };
    content.querySelector("#mz_weight_cancel").onclick = function(){document.body.removeChild(modal);};
    content.querySelector("#mzclosegui").onclick = function(){document.body.removeChild(modal);};
    content.querySelector("#mz_weight_reset").onclick = function(){
        if(confirm("Przywrócić domyślne wagi/pozycje?")) {
            let fresh = {
                useMin: true,
                pozycje: JSON.parse(JSON.stringify(pozycjeDomyslne)),
                wagi: JSON.parse(JSON.stringify(wagiMinDefaults)),
                custom: []
            };
            setCurrentStore(fresh);
            document.body.removeChild(modal);
            showPopup("Przywrócono domyślne wagi/pozycje!");
            rerenderPlayerScores();
        }
    };
    content.querySelector("#mz_weight_save").onclick = function() {
        let useMin = content.querySelector('#min_checkbox').checked;
        store.wagi = wagiBufor;
        store.useMin = useMin;
        setCurrentStore(store);
        document.body.removeChild(modal);
        showPopup("Zapisano zmiany wag!");
        rerenderPlayerScores();
    };
    content.querySelector("#min_checkbox").onclick = () => {};
    let delpos = content.querySelector("#del_position");
    delpos.onclick = function() {
        if(store.pozycje.indexOf(currentPosition)<pozycjeDomyslne.length) return;
        if(confirm("Usunąć pozycję '"+currentPosition+"'?")) {
            let i = store.pozycje.indexOf(currentPosition);
            store.pozycje.splice(i,1);
            delete wagiBufor[currentPosition];
            currentPosition = store.pozycje[0];
            sel.innerHTML = store.pozycje.map(p=>`<option>${p}</option>`).join('');
            sel.value = currentPosition;
            renderFields(currentPosition);
            this.style.display = store.pozycje.indexOf(currentPosition)>=pozycjeDomyslne.length?"":"none";
        }
    }
    content.querySelector("#add_custom_position").onclick = function(){
        content.querySelector("#addcustomrow").style.display='';
    }
    content.querySelector("#closecustompos").onclick = function(){
        content.querySelector("#addcustomrow").style.display='none';
        content.querySelector("#inp_custom_pos").value = '';
    };
    content.querySelector("#okcustompos").onclick = function(){
        let val = content.querySelector("#inp_custom_pos").value.trim();
        if(!val) return;
        if(store.pozycje.includes(val)) { alert("Taka pozycja już istnieje!"); return; }
        store.pozycje.push(val);
        let obj={}; umiejetnosci.forEach(u=>obj[u]={w:0,m:0});
        wagiBufor[val]=obj;
        sel.innerHTML = store.pozycje.map(p=>`<option>${p}</option>`).join('');
        sel.value = val;
        currentPosition = val;
        renderFields(currentPosition);
        content.querySelector("#addcustomrow").style.display = 'none';
        content.querySelector("#inp_custom_pos").value = '';
        delpos.style.display = "";
    };
}

let przycisk = document.createElement("button");
przycisk.textContent = "⚙️ MZScout Ustawienia";
przycisk.style = "position:fixed;top:17px;right:26px;z-index:99999;padding:8px 18px 9px 18px;font-size:16px;background:#232d50;color:#ffe65f;border-radius:11px;border:2px solid #415d8d;font-family:'Segoe UI',Arial,sans-serif;font-weight:bold;cursor:pointer;transition:.18s;box-shadow:0 2px 14px #1a191c88;";
przycisk.onmouseenter = function(){przycisk.style.background='#ffe65f';przycisk.style.color="#233";};
przycisk.onmouseleave = function(){przycisk.style.background='#232d50';przycisk.style.color="#ffe65f";};
przycisk.onclick = showWeightsEditor;
document.body.appendChild(przycisk);

function rerenderPlayerScores() {
    let store = getCurrentStore();
    let wagiAktual = store.wagi;
    let useMin = !!store.useMin;
    let players_container = document.getElementById("players_container");
    if (!players_container) return;
    let players_html = players_container.children;
    function obliczOceneDlaPozycji(zaw,poz){
        let suma=0,sumaWag=0;
        umiejetnosci.forEach(u=>{
            let sk=parseFloat(zaw[u]);
            let rec=wagiAktual[poz][u]||{w:0,m:0};
            let waga = +rec.w, min = +rec.m||0;
            if(!waga) return;
            if(useMin && (sk<min)) sk=0;
            if(!isNaN(sk)&&!isNaN(waga)){suma+=sk*waga;sumaWag+=waga;}
        });
        return sumaWag?suma/sumaWag:0;
    }
    function pobierzUmiejetnosciZawodnika(allskillval){
        let licznik=0,zaw={};
        for(let i=0;i<allskillval.length&&licznik<umiejetnosci.length;i++)
            if(!allskillval[i].innerText.includes("%"))
                zaw[umiejetnosci[licznik++]]=allskillval[i].innerText.replace(/[()]/g,"");
        return zaw;
    }
    for(let i=0;i<players_html.length;i++){
        let player=players_html[i];
        let header=player.getElementsByClassName("subheader clearfix")[0];
        if(!header)continue;
        let allskillval=player.getElementsByClassName("skillval");
        let zawodnik=pobierzUmiejetnosciZawodnika(allskillval);
        header.querySelectorAll('span.mzCustomScore,br.mzCustomScore').forEach(x=>x.remove());
        let lista = store.pozycje.map(poz => ({nazwa: poz, ocena: obliczOceneDlaPozycji(zawodnik,poz) }));
        lista.sort((a,b)=>(a.ocena>b.ocena)?-1:1);
        let stringOceny = lista.map(poz=>`${poz.nazwa}: ${poz.ocena.toFixed(3)}`).join(' || ');
        let ocena=document.createElement("span");
        ocena.className="mzCustomScore";
        ocena.textContent=stringOceny+' ';
        let nowaLinia=document.createElement("br");
        nowaLinia.className="mzCustomScore";
        if(!window.location.href.includes("transfer"))header.appendChild(nowaLinia);
        header.appendChild(ocena);
    }
}
let interval = setInterval(()=>{
    let players_container = document.getElementById("players_container");
    if(players_container){
        clearInterval(interval);
        rerenderPlayerScores();
    }
}, 500);

})();
