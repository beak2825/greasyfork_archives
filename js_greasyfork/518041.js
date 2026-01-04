// ==UserScript==
// @name                ᵂᵒˡᶠ-A R E S croxy açma
// @description         EN İYİ CROXY AÇICI
// @version             1.8
// @match               *://gartic.io/*
// @match               *://cdn.blockaway.net/*
// @grant               GM_addStyle
// @grant               GM_openInTab
// @license             MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @namespace           ᵂᵒˡᶠ-A R E S
// @downloadURL https://update.greasyfork.org/scripts/518041/%E1%B5%82%E1%B5%92%CB%A1%E1%B6%A0-A%20R%20E%20S%20croxy%20a%C3%A7ma.user.js
// @updateURL https://update.greasyfork.org/scripts/518041/%E1%B5%82%E1%B5%92%CB%A1%E1%B6%A0-A%20R%20E%20S%20croxy%20a%C3%A7ma.meta.js
// ==/UserScript==
let site = location.href.toLowerCase();
if (site.indexOf('gartic.io') != -1) {

    let container = document.createElement('div');
    container.setAttribute('id', 'ares');
    container.style.position = 'fixed';
    container.style.right = '20px';
    container.style.top = '20px';
    container.style.width = '250px';
    container.style.height = '150px';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.flexDirection = 'column';
    container.style.backgroundImage = 'url(https://upload.wikimedia.org/wikipedia/commons/4/4b/Ares_Louvre_Ma368_n2.jpg)';
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
    container.style.borderRadius = '15px';
    container.style.boxShadow = '0 0 20px rgba(0,0,0,0.7)';

    let title = document.createElement('div');
    title.innerText = 'ᵂᵒˡᶠ-A R E S';
    title.style.color = '#FFFFFF';
    title.style.fontSize = '24px';
    title.style.fontWeight = 'bold';
    title.style.textShadow = '0 0 5px rgba(255,255,255,0.9)';
    title.style.marginBottom = '15px';
    container.appendChild(title);

    let inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.alignItems = 'center';

    let input = document.createElement('input');
    input.type = 'number';
    input.value = '';
    input.placeholder = 'Kaç site açılsın?';
    input.style.width = '100px';
    input.style.padding = '10px';
    input.style.textAlign = 'center';
    input.style.borderRadius = '5px';
    input.style.border = '2px solid #FFFFFF';
    input.style.backgroundColor = 'rgba(30, 30, 30, 0.8)';
    input.style.color = '#FFFFFF';
    input.style.marginRight = '10px';
    input.style.outline = 'none';
    inputContainer.appendChild(input);

    let button = document.createElement('button');
    button.innerText = 'Aç';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '5px';
    button.style.border = 'none';
    button.style.backgroundColor = '#28a745';
    button.style.color = '#FFFFFF';
    button.style.fontWeight = 'bold';
    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.3s';
    button.addEventListener('mouseover', () => button.style.backgroundColor = '#218838');
    button.addEventListener('mouseout', () => button.style.backgroundColor = '#28a745');
    button.addEventListener("click", () => openproxy(parseInt(input.value) || 20));
    inputContainer.appendChild(button);

    container.appendChild(inputContainer);
    document.body.appendChild(container);

    function openproxy(count) {
        let link = "https://cdn.blockaway.net/_tr/?successMessage=WW91ciBhZHZlcnRpc2VtZW50IHN1YnNjcmlwdGlvbiBzdWNjZXNzZnVsbHkgY2FuY2VsbGVk&__cpLangSet=1/#" + window.location.href;
        for (let i = 0; i < count; i++) {
            GM_openInTab(link);
        }
    }
}

setInterval(function () {
    let linkyeri = document.querySelector('input[id="url"]');
    if (site.indexOf('cdn.blockaway.net') != -1) {
        if (linkyeri && linkyeri.value === "") {
            linkyeri.value = "https://gartic.io/";
            let goButton = document.querySelector('i[class="fa fa-arrow-right"]');
            if (goButton) {
                goButton.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }));
            }
        }
    }
}, 300);

GM_addStyle(`
    #ares:hover {
        cursor: default;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.9);
        transform: scale(1.05);
    }

    @keyframes rgbGlow {
        0% { border-color: rgb(255, 0, 0); box-shadow: 0 0 20px rgb(255, 0, 0); }
        50% { border-color: rgb(255, 127, 0); box-shadow: 0 0 30px rgb(255, 127, 0); }
        100% { border-color: rgb(255, 0, 0); box-shadow: 0 0 20px rgb(255, 0, 0); }
    }

    #ares {
        border: 2px solid rgb(255, 0, 0);
        animation: rgbGlow 1.5s infinite;
    }
`);