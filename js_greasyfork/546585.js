// ==UserScript==
// @name         bepis++
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block users
// @author       lialyhina10
// @match        https://db.bepis.moe/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/546585/bepis%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/546585/bepis%2B%2B.meta.js
// ==/UserScript==

//Follow me on x twitter lialyhina10 and yell at me how bad I code.
(function () {
    'use strict';

    const trustedKey = 'listaVerde';
    const blockedKey = 'bloqueados';
    const listaVerde = JSON.parse(localStorage.getItem(trustedKey) || '[]');
    const bloqueados = JSON.parse(localStorage.getItem(blockedKey) || '[]');
    const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    document.querySelectorAll('.comment-header a[href*="/user/view/"]').forEach(link => {
        const username = link.textContent.trim();
        const userId = link.href.split('/').pop();
        const commentBody = link.closest('.comment-body.w-100.p-2.my-1');
        const header = link.closest('.comment-header');
        if (bloqueados.includes(userId)) {
            if (commentBody) commentBody.remove();
            return;
        }
        if (listaVerde.includes(userId)) {
            link.style.color = 'green';
            link.textContent += ' 😀';
            return;
        }
        const check = document.createElement('span');
        check.textContent = '✔️';
        check.style.cursor = 'pointer';
        check.style.marginRight = '6px';
        check.onclick = () => {
            listaVerde.push(userId);
            save(trustedKey, listaVerde);
            link.style.color = 'green';
            link.textContent += ' 😀';
            check.remove();
        };
header.insertBefore(check, header.firstChild);
        const block = document.createElement('span');
        block.textContent = '🚫';
        block.style.cursor = 'pointer';
        block.style.marginLeft = '6px';
        block.onclick = () => {
            bloqueados.push(userId);
            save(blockedKey, bloqueados);
            if (commentBody) commentBody.remove();
        };
        link.parentNode.appendChild(block);
    });
    // Panel de gestión, no encontré mejor lugar donde ponerlo XD
    //h4.d-block.text-center
    //px-4 py-3 h-100
        const configTarget = document.querySelector('h4.d-block.text-center');
    if (configTarget) {
        const gear = document.createElement('span');
        gear.textContent = '⚙️';
        gear.style.position = 'relative';
        gear.style.top = '-50px';
        gear.style.cursor = 'pointer';
        gear.style.fontSize = '40px';
        gear.style.marginLeft = '1px';
        gear.onclick = () => {
            const panel = document.createElement('div');
            panel.style.position = 'fixed';
            panel.style.top = '50%';
            panel.style.left = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
            panel.style.background = '#fff';
            panel.style.border = '2px solid #000';
            panel.style.padding = '30px';
            panel.style.zIndex = '9999';

            const clearBlocked = document.createElement('button');
            clearBlocked.textContent = '🧹 Borrar bloqueados';
            clearBlocked.onclick = () => {
                localStorage.removeItem(blockedKey);
                alert('Bloqueados borrados');
                panel.remove();
            };
            const clearTrusted = document.createElement('button');
            clearTrusted.textContent = '🧹 Borrar lista verde';
            clearTrusted.style.marginLeft = '10px';
            clearTrusted.onclick = () => {
                localStorage.removeItem(trustedKey);
                alert('Lista verde borrada');
                panel.remove();
            };

        const expobutton = document.createElement('button');
            expobutton.textContent = '↓Exportar/importar abajo↓';
            expobutton.style.marginLeft = '10px';
                expobutton.onclick = () => {
                window.scrollTo({
               top: document.body.scrollHeight,
        behavior: 'smooth'
    });
};
            const cerrar = document.createElement('button');
            cerrar.textContent = 'cerrar';
            cerrar.style.marginLeft = '10px';
              cerrar.onclick = () => {
        panel.remove();
    };

            panel.appendChild(clearBlocked);
            panel.appendChild(clearTrusted);
            panel.appendChild(expobutton);
            panel.appendChild(cerrar);
            document.body.appendChild(panel);
        };
        configTarget.parentNode.insertBefore(gear, configTarget.nextSibling);
let panelVisible = false;
let panel = null;

const configBtn = document.createElement('button');
configBtn.textContent = '⚙️';
configBtn.style.fontSize = '20px';
configBtn.style.cursor = 'pointer';
configBtn.style.margin = '10px';
document.body.appendChild(configBtn);

configBtn.onclick = () => {
        window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });

    if (panelVisible) {
        panel.remove();
        panelVisible = false;
        return;
    }

    panel = document.createElement('div');
    panel.style.padding = '10px';
    panel.style.border = '1px solid #ccc';
    panel.style.margin = '10px 0';
    panel.style.background = '#f9f9f9';
    panel.style.fontFamily = 'sans-serif';
    panel.style.maxWidth = '500px';

    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📤 Exportar registros';
    exportBtn.style.marginRight = '10px';
    exportBtn.onclick = () => {
        const data = {
            bloqueados: JSON.parse(localStorage.getItem('bloqueados') || '[]'),
            listaVerde: JSON.parse(localStorage.getItem('listaVerde') || '[]')
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'registros_av.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    panel.appendChild(exportBtn);

    const importInput = document.createElement('textarea');
    importInput.placeholder = 'Pega aquí el JSON de tus registros';
    importInput.style.width = '100%';
    importInput.style.height = '100px';
    importInput.style.marginTop = '10px';
    panel.appendChild(importInput);

       const importBtn = document.createElement('button');
    importBtn.textContent = '📥 Importar registros';
    importBtn.style.marginTop = '10px';
    importBtn.onclick = () => {
        try {
            const data = JSON.parse(importInput.value);
            if (data.bloqueados && Array.isArray(data.bloqueados)) {
                localStorage.setItem('bloqueados', JSON.stringify(data.bloqueados));
            }
            if (data.listaVerde && Array.isArray(data.listaVerde)) {
                localStorage.setItem('listaVerde', JSON.stringify(data.listaVerde));
            }
            alert('Registros importados correctamente');
            location.reload();
        } catch (e) {
            alert('Error al importar: formato inválido');
        }
    };
    panel.appendChild(importBtn);
    document.body.appendChild(panel); // A ver donde lo coloco... mmmmm....
    panelVisible = true;
};
}
})();