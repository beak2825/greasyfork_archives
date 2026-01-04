// ==UserScript==
// @name         Ranked History
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  This script will generate a log of all locations. where you played ranked matches. To access the map, wait for the game page to load completely and press the "H" key on your keyboard.
// @author       HenriqueM
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/js/jsvectormap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsvectormap/1.4.3/maps/world.js
// @resource     IMPORTED_CSS https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/css/jsvectormap.min.css
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492077/Ranked%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/492077/Ranked%20History.meta.js
// ==/UserScript==

let globalUserId

function showRanked() {
    // Seleciona a div com id "world-map-normal"
    var normalMap = document.getElementById('world-map-normal');
    // Seleciona a div com id "world-map-ranked"
    var rankedMap = document.getElementById('world-map-ranked');
    
    // Adiciona "display: none" à div "world-map-normal"
    normalMap.style.display = 'none';
    // Adiciona "display: block" à div "world-map-ranked"
    rankedMap.style.display = 'block';
}

function showNormal() {
    // Seleciona a div com id "world-map-normal"
    var normalMap = document.getElementById('world-map-normal');
    // Seleciona a div com id "world-map-ranked"
    var rankedMap = document.getElementById('world-map-ranked');
    
    // Adiciona "display: block" à div "world-map-normal"
    normalMap.style.display = 'block';
    // Adiciona "display: none" à div "world-map-ranked"
    rankedMap.style.display = 'none';
}

function loadMap() {
    // Criação da div do modal
    var modalDiv = document.createElement("div");
    modalDiv.id = "map-modal";
    modalDiv.style.position = "fixed";
    modalDiv.style.top = "0";
    modalDiv.style.right = "0";
    modalDiv.style.display = "flex";
    modalDiv.style.zIndex = "100";
    modalDiv.style.background = "white";
    modalDiv.style.justifyContent = "center";
    // modalDiv.style.padding = "1rem";
    modalDiv.style.margin = "1rem";
    modalDiv.style.left = "50%";
    modalDiv.style.transform = "translate(-50%, 0)";
    modalDiv.style.width = "90vw";
    modalDiv.style.height = "90vh";

    // Adicionando a div do modal ao final do body do documento
    document.body.appendChild(modalDiv);

    document.getElementById('map-modal').innerHTML = `
        <div id="map-holder">
            <header style="background: lightgray; display: flex; gap: 1rem; padding: 1rem;">
                <button class="button-59" id="btn-ranked">Ranked</button>
                <button class="button-59" id="btn-normal">Normal</button>
            </header>
            
            <div id="world-map-ranked" style="width: 90vw; height: calc(90vh - 80px); display: block;"></div>
            <div id="world-map-normal" style="width: 90vw; height: calc(90vh - 80px); display: block;"></div>
        </div>
    `;

    var btnRanked = document.getElementById('btn-ranked');
    btnRanked.addEventListener('click', function() {
        showRanked();
    });

    var btnNormal = document.getElementById('btn-normal');
    btnNormal.addEventListener('click', function() {
        showNormal();
    });

    const map = new jsVectorMap({
        selector: '#world-map-normal',
        map: 'world',
        markerStyle: {
            initial: {
                strokeWidth: 0,
                fill: '#ff5566',
                fillOpacity: 1,
                r: 4,
            },
            hover: {},
        },
        showTooltip: false,
        markers: getAllGameLocations()
    })

    const mapRanked = new jsVectorMap({
        selector: '#world-map-ranked',
        map: 'world',
        markerStyle: {
            initial: {
                strokeWidth: 0,
                fill: '#ff5566',
                fillOpacity: 1,
                r: 4,
            },
            hover: {},
        },
        showTooltip: false,
        markers: getAllCompetitiveLocations()
    })
  

}

function getAllGameLocations() {
    let storageData = localStorage.getItem('gameLocations');
        if (storageData) {
            // A LocalStorage está definida, então analisar o conteúdo como JSON
            storageData = JSON.parse(storageData);
    
            // Verificar se o conteúdo é um array
            if (!Array.isArray(storageData)) {
                return []
            } else {
                const arrayDeArrays = storageData.map(game => game.rounds)
                const arrayDeArrays2 = storageData.map(game => game.player.guesses)

                const arrayAchatado = arrayDeArrays.reduce(function(acumulador, valorAtual) {
                    // Concatenar cada array no acumulador
                    return acumulador.concat(valorAtual);
                }, []);

                const arrayAchatado2 = arrayDeArrays2.reduce(function(acumulador, valorAtual) {
                    // Concatenar cada array no acumulador
                    return acumulador.concat(valorAtual);
                }, []);

                const formatado = arrayAchatado.map((l, i) => {
                    return {
                        coords: [l.lat, l.lng],
                        style: { fill: calcularCor(arrayAchatado2[i].roundScore.amount) }
                    }
                })

                return formatado;
            }
        } else {
            return []
        }
}

function getAllCompetitiveLocations() {
    let storageData = localStorage.getItem('competitiveLocations');
        if (storageData) {
            // A LocalStorage está definida, então analisar o conteúdo como JSON
            storageData = JSON.parse(storageData);
    
            // Verificar se o conteúdo é um array
            if (!Array.isArray(storageData)) {
                return []
            } else {
                const arrayDeArrays = storageData.map(game => game.rounds)
                const arrayDeArrays2 = storageData.map(game => {

                    const index = game.teams.findIndex(team => team.players[0].playerId === globalUserId);
                    return game.teams[index].roundResults;
                })

                const arrayAchatado = arrayDeArrays.reduce(function(acumulador, valorAtual) {
                    // Concatenar cada array no acumulador
                    return acumulador.concat(valorAtual);
                }, []);

                const arrayAchatado2 = arrayDeArrays2.reduce(function(acumulador, valorAtual) {
                    // Concatenar cada array no acumulador
                    return acumulador.concat(valorAtual);
                }, []);

                const formatado = arrayAchatado.map((l, i) => {
                    return {
                        coords: [l.panorama.lat, l.panorama.lng],
                        style: { fill: calcularCor(arrayAchatado2[i].score) }
                    }
                })

                return formatado;
            }
        } else {
            return []
        }
}

function getGameMode() {
    if(location.pathname.includes("/battle-royale/") ) {
        return 'battle-royale'
    }
    if(location.pathname.includes("/duels/") ) {
        return 'duels'
    }

    return null
}

function calcularCor(valor) {
    if(valor == 5000) {
        return 'yellow';
    }
    // Normalizar o valor para um intervalo entre 0 e 1
    const normalizedValue = valor / 5000;

    // Calcular os componentes RGB da cor
    const red = Math.round(255 * (1 - normalizedValue));
    const green = Math.round(255 * normalizedValue);
    const blue = 0; // Sem azul para esta transição

    // Formatar a cor no formato RGB
    const cor = `rgb(${red}, ${green}, ${blue})`;

    return cor;
}


(function() {
    'use strict';

    const myCss = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(myCss);

    async function getLocationObjectGame() {
        const tag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
        const gameMode = getGameMode()
        let game_endpoint = "https://www.geoguessr.com/api/v3/games/" + tag;
        if(gameMode) {
            game_endpoint = `https://game-server.geoguessr.com/api/${gameMode}/${tag}`
        }
        const api_url = game_endpoint

        const res = await fetch(api_url, {
            method: 'GET',
            credentials: 'include'
        });
        return await res.json();
    }

    async function getUserId() {
        const api_url = 'https://geoguessr.com/api/v3/profiles'

        const res = await fetch(api_url, {
            method: 'GET',
            credentials: 'include'
        });
        return await res.json();
    }

    async function getUserIdFromLocalStorage() {
        // Verifica se há um valor na chave "user_id" na LocalStorage
        const userId = localStorage.getItem("user_id");
    
        if (userId) {
            // Se o valor existir, retorna o valor encontrado
            return userId;
        } else {
            // Se o valor não existir, chama a função getUserId()
            const userIdObject = await getUserId();
    
            // Obtém o ID do objeto retornado pela função getUserId()
            const newUserId = userIdObject.user.id;
    
            // Salva o novo ID na LocalStorage
            localStorage.setItem("user_id", newUserId);
    
            // Retorna o novo ID
            return newUserId;
        }
    }

    getUserIdFromLocalStorage().then(userId => {
        globalUserId = userId
    }).catch(error => {
        console.error("Erro ao obter o User ID:", error);
    });

    async function saveGameLocations() {
        const chave = getGameMode() ? 'competitiveLocations' : 'gameLocations'
        const chavePrimaria = getGameMode() ? 'gameId' : 'token'
        // Obter o objeto de localização do jogo
        const gameinfo = await getLocationObjectGame();
    
        // Verificar se a LocalStorage está definida e se é um array
        let storageData = localStorage.getItem(chave);
        if (storageData) {
            // A LocalStorage está definida, então analisar o conteúdo como JSON
            storageData = JSON.parse(storageData);
    
            // Verificar se o conteúdo é um array
            if (!Array.isArray(storageData)) {
                // Se não for um array, definir como um array vazio
                storageData = [];
            } else {
                // Verificar se já existe um objeto com o mesmo token na LocalStorage
                const existingIndex = storageData.findIndex(item => item[chavePrimaria] === gameinfo[chavePrimaria]);
                if (existingIndex !== -1) {
                    // Se um objeto com o mesmo token foi encontrado, substituí-lo pelo novo objeto
                    storageData[existingIndex] = gameinfo;
                } else {
                    // Se não houver um objeto com o mesmo token, adicionar o novo objeto ao array
                    storageData.push(gameinfo);
                }
            }
        } else {
            // Se a LocalStorage não estiver definida, definir como um array contendo apenas o novo objeto
            storageData = [gameinfo];
        }
    
        // Salvar o array atualizado de volta na LocalStorage
        localStorage.setItem(chave, JSON.stringify(storageData));
    }

    

    function checkGameMode() {
        return location.pathname.includes("/game/") 
            || location.pathname.includes("/challenge/") 
            || location.pathname.includes("/battle-royale/") 
            || location.pathname.includes("/duels/");

    };

    

    function doCheck() {
        if (!document.querySelector('div[class*="result-layout_root__"]') && !document.querySelector('div[class*="game-finished-ranked_"]')) {
            sessionStorage.setItem("Checked", 0);
        } else if ((sessionStorage.getItem("Checked") || 0) == 0) {
            saveGameLocations();
            sessionStorage.setItem("Checked", 1);
        }
    };

    let lastDoCheckCall = 0;
    new MutationObserver(async (mutations) => {
        if (!checkGameMode() || lastDoCheckCall >= (Date.now() - 50)) return;
        lastDoCheckCall = Date.now();
        doCheck()
    }).observe(document.body, {
        subtree: true,
        childList: true
    });

    // ---------------
    
    document.addEventListener("keypress", function handleKeyPress(event) {
        // Verificar se a tecla pressionada é "h"
        if (event.key === "h") {
            loadMap()
        }
        if (event.key === "ç") {
            saveGameLocations();
        }
    });
})();

// Crie uma nova tag <style>
var styleTag = document.createElement('style');

// Defina o conteúdo da tag <style> como uma string
var cssContent = `
    .button-59 {
    align-items: center;
    background-color: #fff;
    border: 2px solid #000;
    box-sizing: border-box;
    color: #000;
    cursor: pointer;
    display: inline-flex;
    fill: #000;
    font-family: Inter,sans-serif;
    font-size: 16px;
    font-weight: 600;
    height: 48px;
    justify-content: center;
    letter-spacing: -.8px;
    line-height: 24px;
    min-width: 140px;
    outline: 0;
    padding: 0 17px;
    text-align: center;
    text-decoration: none;
    transition: all .3s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    }

    .button-59:focus {
    color: #171e29;
    }

    .button-59:hover {
    border-color: #06f;
    color: #06f;
    fill: #06f;
    }

    .button-59:active {
    border-color: #06f;
    color: #06f;
    fill: #06f;
    }

    @media (min-width: 768px) {
    .button-59 {
        min-width: 170px;
    }
    }
`;

// Adicione o conteúdo à tag <style>
styleTag.innerHTML = cssContent;

// Adicione a tag <style> ao corpo da página
document.body.appendChild(styleTag);