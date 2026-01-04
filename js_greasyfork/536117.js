// ==UserScript==
// @name         Selecionar valor em #loja-nome
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  Seleciona um valor específico no select #loja-nome
// @match        https://gestor.elevamerchandising.com.br/cobertura/edita/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536117/Selecionar%20valor%20em%20loja-nome.user.js
// @updateURL https://update.greasyfork.org/scripts/536117/Selecionar%20valor%20em%20loja-nome.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const lojas = [22200, 22083, 22078, 23078, 2582, 2570, 23054, 2563, 21190, 2569, 2566, 2568, 2567, 2572, 2565, 2564, 2561, 2559, 23215, 2554, 2553, 2550, 2549, 2548, 2546, 2545, 2544, 2543, 2541, 2539, 2538, 7421, 2536, 19858, 2534, 2533, 23217, 7423, 21251, 2528, 22238, 21608, 6099, 6100, 20934, 2192, 20551, 2512, 2511, 2510, 2286, 2275, 2256, 2254, 21906, 22255, 21151, 23219, 22596, 2465, 2464, 2467, 2466, 21653, 23235, 2444, 2443, 2442, 2441, 2438, 2437, 2435, 2434, 2433, 2431, 2428, 2427, 2426, 2425, 2424, 2421, 2419, 2418, 2417, 2415, 2414, 2412, 2410, 2409, 2408, 2407, 2406, 2405, 2404, 2401, 2396, 2394, 2386, 2385, 2186, 2384, 2383, 21139, 2388, 2382, 2381, 2380, 6372, 6373, 20242, 23036, 21485, 2376, 2375, 2374, 2373, 2372, 2371, 2365, 2367, 19854, 22178, 22643, 2357, 2356, 2354, 2358, 2352, 2351, 2350, 2344, 22085, 21554, 21553, 2182, 21217, 20245, 21970, 17890, 17903, 2318, 2314, 3473, 2308, 21600, 2306, 2305, 2304, 2303, 2302, 17901, 17900, 2301, 17902, 6589, 20232, 22027, 2296, 2294, 2288, 2287, 2282, 2278, 2276, 2273, 2269, 2268, 2292, 22084, 22034, 21473, 22245, 21566, 2245, 2243, 2498, 2497, 19860, 21250, 2496, 2495, 2494, 2227, 21446, 21570, 21631, 21776, 21779, 21777, 21995, 7537, 21971, 22111, 22248, 21445, 22769, 22003, 22185, 22246, 19846, 22235, 22247, 22645, 22613, 21022, 23202, 23089, 23015, 2226, 23058, 23188, 21183, 2223, 21462, 7420, 21182, 2225, 21248, 2224, 21444, 3527, 2222, 19889, 23220, 21157, 2216, 23225, 2473, 2214, 21694, 23231, 2461, 2506, 2207, 6127, 21494, 22909, 2471, 23216, 23224, 21560, 21931, 23218, 2476, 23223, 21153, 21932, 2247, 23222, 22918, 23221, 2179, 2172, 2171, 23229, 23230, 21693, 2160, 2142, 2180, 23226, 2141, 23227, 2140, 2136, 21948, 22183, 21850, 21936, 22210, 21441, 21259, 21489, 23059, 21589, 23040, 21808, 22607, 22031, 2717, 23228, 19938, 19931, 22625, 19930, 2126, 2125, 2124, 2123, 2122, 2121, 2120, 2119, 2118, 2117, 2116, 2115, 2114, 2113, 2112, 2111, 21507, 2110, 2109, 2108, 2107, 2106, 2105, 2103, 2104, 21508, 21975, 3526, 7149, 2674, 2673, 2672, 2671, 2670, 2667, 2669, 2668];
    const storageKey = 'lojaAtualIndex';
    let lojaAtual = parseInt(localStorage.getItem(storageKey)) || 0;

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function selecionarLojaEEnviar() {
    const select = document.querySelector('#loja-nome');
    if (!select) return;

    // Se já estiver na última loja da lista, mostra mensagem e não faz nada
    if (lojaAtual >= lojas.length) {
        alert('✅ Terminado');
        return;
    }

    const valor = lojas[lojaAtual].toString();
    const option = Array.from(select.options).find(opt => opt.value === valor);
    if (!option) return;

    select.value = option.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    await wait(1000);

    const botao = document.querySelector('button[type="submit"][title="Pesquisar"].btn.btn-default');
    if (botao) botao.click();

    lojaAtual++;

    if (lojaAtual >= lojas.length) {
        alert('✅ Terminado');
    } else {
        localStorage.setItem(storageKey, lojaAtual);
    }
}


    document.addEventListener('keydown', function (e) {
        if (e.code === 'Space' && !e.repeat) {
            e.preventDefault();
            selecionarLojaEEnviar();
        }
    });
setTimeout (()=>{
    const tbody = document.querySelector('#resultsd');
    if (!tbody) return;

    const linhas = Array.from(tbody.querySelectorAll('tr'));
    let maiorMarcados = 0;
    let linhaComMaisMarcados = null;
    let infoCliente = '';

    const nomesDias = ['seg', 'ter', 'quart', 'quint', 'sex', 'sab'];

    linhas.forEach((linha, index) => {
        const diasCheckboxes = linha.querySelectorAll('input[type="checkbox"]');
        const diasMarcados = Array.from(diasCheckboxes).filter(cb =>
            nomesDias.includes(cb.name) && cb.checked
        ).length;

        const cliente = linha.querySelector('td')?.innerText.trim() || `Linha ${index + 1}`;
        if (diasMarcados > maiorMarcados) {
            maiorMarcados = diasMarcados;
            linhaComMaisMarcados = linha;
            infoCliente = cliente;
        }
    });

    if (linhaComMaisMarcados) {
        const checkboxAtivador = linhaComMaisMarcados.querySelector('input[type="checkbox"][onclick*="altera_atendiment"]');
        if (checkboxAtivador) {
            checkboxAtivador.click();
            wait(1000).then(() => {
                const botaoOk = document.querySelector('#popup_ok');
                if (botaoOk) botaoOk.click();
                wait(1000).then(() => {
                    const botaoOk2 = document.querySelector('#popup_ok');
                    if (botaoOk2) botaoOk2.click();
                    wait(3000).then(() => selecionarLojaEEnviar());
                });
            });
        }
    }

    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔁 Reiniciar Lojas';
    resetBtn.style.position = 'fixed';
    resetBtn.style.bottom = '20px';
    resetBtn.style.right = '20px';
    resetBtn.style.zIndex = '9999';
    resetBtn.style.padding = '10px 15px';
    resetBtn.style.backgroundColor = '#f44336';
    resetBtn.style.color = '#fff';
    resetBtn.style.border = 'none';
    resetBtn.style.borderRadius = '8px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    resetBtn.title = 'Clique para reiniciar a contagem de lojas';

    resetBtn.addEventListener('click', () => {
        localStorage.removeItem(storageKey);
        alert('✅ Contador de lojas reiniciado!');
        location.reload();
    });

    document.body.appendChild(resetBtn);
},3000);
})();
