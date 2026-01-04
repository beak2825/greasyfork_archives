// ==UserScript==
// @name         ygg Bouton Téléchargement
// @namespace    https://greasyfork.org/scripts/520362
// @version      3.1
// @description  Ajoute boutons download + magnet dans Ygg torrents
// @include      /^https?\:\/\/.*\.yggtorrent\..*\/.*$/
// @include      /^https?\:\/\/.*\.ygg\..*\/.*$/
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js
// @downloadURL https://update.greasyfork.org/scripts/520362/ygg%20Bouton%20T%C3%A9l%C3%A9chargement.user.js
// @updateURL https://update.greasyfork.org/scripts/520362/ygg%20Bouton%20T%C3%A9l%C3%A9chargement.meta.js
// ==/UserScript==

addCustomStyles();
document.body.insertAdjacentHTML('beforeend', '<iframe name="magnetframe" style="display:none"></iframe>');

const OBS = new MutationObserver(mutations => checkExistingSections());
OBS.observe(document.body, {childList:true, subtree:true});

const path = window.location.pathname;
if ((path.startsWith('/torrents/exclus') || path.startsWith('/engine/search'))) { checkExistingSections(); }

function addCustomStyles() {
    const css = `
      .results td { max-width:100vh }
      .results td:nth-child(2) { width:48%!important; white-space:normal!important; word-break:break-word!important }
      button.download-btn, button.magnet-btn { padding:5px!important; margin:0!important; }
    `;
    document.head.appendChild(Object.assign(document.createElement('style'), {textContent:css}));
}

function checkExistingSections() {
    document.querySelectorAll('.table-responsive.results .table').forEach(table => {
        addHeaders(table);
        addButtons(table);
    });
}

function addHeaders(table) {
    const ths = [...table.tHead.rows[0].cells];
    if (ths.some(th=>th.querySelector('.ico_download'))) return;
    const idx = ths.findIndex(th=>th.textContent.trim()==='NFO');
    if (idx>=0) {
        ['ico_download','ico_magnet'].forEach((cls,i)=>{
            const th = document.createElement('th');
            th.className='no'; th.style.width='10px';
            th.innerHTML=`<span class="${cls}"></span>`;
            table.tHead.rows[0].insertBefore(th, table.tHead.rows[0].cells[idx+1+i]);
        });
    }
}

function addButtons(table) {
    const downloadIdx = [...table.tHead.rows[0].cells].findIndex(th=>th.querySelector('.ico_download'));
    const magnetIdx = downloadIdx+1;
    table.tBodies[0].querySelectorAll('tr').forEach(row=>{
        if (row.querySelector('.download-btn')) return;
        const link = row.cells[1]?.querySelector('a');
        if (!link) return;
        const id = link.href.split('/').pop().split('-')[0];
        ['download','magnet'].forEach((type,i)=>{
            const td = document.createElement('td');
            const btn = document.createElement('button');
            btn.className = type+'-btn';
            btn.innerHTML=`<span class="ico_${type}"></span>`;
            btn.style.setProperty('width', '40px', 'important');
            btn.style.display = 'table-cell';
            btn.onclick = ()=> type==='download' ? location.href=`/engine/download_torrent?id=${id}` : openMagnet(id);
            row.insertBefore(td.appendChild(btn).parentNode, row.cells[type==='download'?downloadIdx:magnetIdx]);
        });
    });
}

function openMagnet(id) {
    return downloadTorrentBlob(id)
      .then(blob=>new Promise(resolve=>new WebTorrent().add(blob,t=>resolve(t.magnetURI))))
      .then(uri=>{ window.open(uri, 'magnetframe'); });
}

function downloadTorrentBlob(id) {
    return new Promise((res,rej)=>{
        GM_xmlhttpRequest({
            method:'GET', url:`/engine/download_torrent?id=${id}`, responseType:'blob',
            onload:r=> r.status===200 ? res(r.response) : rej(r)
        });
    });
}
