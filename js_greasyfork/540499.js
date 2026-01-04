// ==UserScript==
// @name         Transfer artifact
// @namespace    http://tampermonkey.net/
// @description  Artifacts transfer helper
// @version      1.7
// @author       Julian Delphiki II
// @match        https://www.heroeswm.ru/inventory.php*
// @match        https://www.heroeswm.ru/art_transfer.php*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540499/Transfer%20artifact.user.js
// @updateURL https://update.greasyfork.org/scripts/540499/Transfer%20artifact.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Read parameters from hash instead of query string
    const hashParams = window.location.hash.substring(1); // Remove the # character
    const params = new URLSearchParams(hashParams);
    const rentArt     = params.get('rent_art')?.trim();
    const artName     = params.get('art_id')?.trim();
    const nick        = params.get('nick')?.trim();
    const bcountParam = params.get('bcount')?.trim();

    // Modal helper for multiple artifacts
    function showChoiceModal(matches, callback) {
        const overlay = document.createElement('div');
        overlay.style = 'position:fixed;top:0;left:0;width:100%;height:100%;'
            + 'background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
        const box = document.createElement('div');
        box.style = 'background:#fff;padding:20px;border-radius:6px;max-width:500px;width:90%;';
        const title = document.createElement('h3');
        title.textContent = `Choose artifact for "${artName}"`;
        box.appendChild(title);
        matches.forEach((a,i) => {
            const label = document.createElement('label');
            label.style = 'display:block;margin:8px 0;';
            const radio = document.createElement('input');
            radio.type = 'radio'; radio.name = 'tm-art-select'; radio.value = i;
            if(i===0) radio.checked=true;
            label.append(radio, document.createTextNode(
                ` ID:${a.id} slot:${a.slot} dur:${a.durability1}/${a.durability2}`
                + (a.suffix?` suffix:${a.suffix}`:'')
            ));
            box.appendChild(label);
        });
        const bar = document.createElement('div'); bar.style='text-align:right;margin-top:12px;';
        const btnCancel = document.createElement('button'); btnCancel.textContent='Cancel';
        btnCancel.style='margin-right:8px;padding:6px 12px;';
        btnCancel.onclick = ()=>document.body.removeChild(overlay);
        const btnOk = document.createElement('button'); btnOk.textContent='Transfer';
        btnOk.style='padding:6px 12px;';
        btnOk.onclick = () => {
            const sel = box.querySelector('input[name="tm-art-select"]:checked');
            const idx = sel?parseInt(sel.value,10):0;
            document.body.removeChild(overlay);
            callback(idx);
        };
        bar.append(btnCancel,btnOk);
        box.appendChild(bar);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    // 1) Inventory page: find art and redirect
    if(artName && rentArt && location.pathname.endsWith('/inventory.php') && rentArt==='1'){
        const lookupAndRedirect=()=>{
            if(!window.arts||!Array.isArray(arts)){
                return setTimeout(lookupAndRedirect,200);
            }
            const matches=arts.filter(a=>a.art_id===artName);
            if(matches.length===0){
                return alert(`No artifacts for art_id="${artName}"`);
            }
            const doRedirect=art=>{
                const url=new URL('https://www.heroeswm.ru/art_transfer.php');
                // Keep 'id' as query parameter for the website
                url.searchParams.set('id',art.id);
                // Put our custom parameters in hash
                const hashParams = new URLSearchParams();
                if(nick) hashParams.set('nick',nick);
                if(bcountParam) hashParams.set('bcount',bcountParam);
                if(hashParams.toString()) {
                    url.hash = hashParams.toString();
                }
                location.href=url;
            };
            matches.length===1?doRedirect(matches[0]):
                showChoiceModal(matches,idx=>doRedirect(matches[idx]));
        };
        return lookupAndRedirect();
    }

    // 2) art_transfer page: fill fields
    if(location.pathname.endsWith('/art_transfer.php')){
        // hero nick
        if(nick){
            const selEl=document.getElementById('nick_select');
            if(selEl){
                const normalize=s=>s.trim().split('[')[0].trim();
                $(selEl).select2({tags:true,allowClear:true});
                const opt=Array.from(selEl.options)
                    .find(o=>normalize(o.text)===nick);
                if(opt) $(selEl).val(opt.value).trigger('change');
                else{const o=new Option(nick,nick,true,true);selEl.append(o);$(selEl).val(nick).trigger('change');}
                $(selEl).on('select2:open',()=>$('.select2-search__field')
                    .attr('placeholder','Введите имя героя'));
            }
        }
        // price gold=1
        const gold=document.getElementById('gold');
        if(gold){gold.value='1';gold.dispatchEvent(new Event('input',{bubbles:true}));}
        // transfer with return
        const r2=document.querySelector('input[name="sendtype"][value="2"]');
        if(r2){r2.checked=true; if(typeof show_arenda==='function') show_arenda(2);}
        // set bcount & dtime
        const bc=parseFloat(bcountParam)||0;
        const bcIn=document.querySelector('input[name="bcount"]');
        if(bcIn){bcIn.value=bc;bcIn.dispatchEvent(new Event('input',{bubbles:true}));}
        const dtIn=document.querySelector('input[name="dtime"]');
        if(dtIn){dtIn.value=(0.1*bc).toFixed(1);dtIn.dispatchEvent(new Event('input',{bubbles:true}));}
    }
})();
