// ==UserScript==
// @name         Controlador do vicente
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Controla o vicente
// @author       Você
// @match        https://www.footmundo.com/jogador/*
// @grant        none
// @license      M.I.TT
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/487206/Controlador%20do%20vicente.user.js
// @updateURL https://update.greasyfork.org/scripts/487206/Controlador%20do%20vicente.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var server = 'https://us-central1-calcfootmundo.cloudfunctions.net';
    var cssInject = `
    .h6modal{
    font-size:14px;
    }
        .buttons-vicente {
            background-color: #4ba7d0;
            border: none;
            color: white;
            width: 78px;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 4px 2px;
            transition-duration: 0.4s;
            cursor: pointer;
            border-radius: 8px;
            height: 43px;
        }
        .buttons-vicente:hover {
            background-color: white;
            color: black;
            border: 1px solid #4ba7d0;
        }
        .buttons-vicente:active {
            background-color: #4ba7d0;
            color: white;
            border: 1px solid #4ba7d0;
        }
        div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm{
            background-color: #cc7ffe;
        }


    `;
    var style = document.createElement('style');
    if (style.styleSheet) {
        style.styleSheet.cssText = cssInject;
    }
    else {
        style.appendChild(document.createTextNode(cssInject));
    }
    document.getElementsByTagName('head')[0].appendChild(style);



    function mudarFocoOuLazer(endpoint) {
        console.log("clicado");
        Swal.fire({
            title: 'Processando...',
            html: 'Por favor, aguarde enquanto fazemos Vicentinho fazer a ação',
            allowOutsideClick: false, // Impede que o alerta seja fechado clicando fora
            didOpen: () => {
                Swal.showLoading(); // Mostra o loader
            }
        });
        fetch(server + `/${endpoint}`)
            .then(response => response.json())
            .then(data => {
                Swal.close();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000, // O toast desaparece após 3 segundos
                    timerProgressBar: true,
                    icon: 'success',
                    title: data.message // Use a mensagem da API aqui
                });
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
                // Opcional: Exibir um toast de erro se a requisição falhar
                Swal.close();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000, // O toast desaparece após 3 segundos
                    timerProgressBar: true,
                    icon: 'error',
                    title: 'Falha ao mudar o lazer'
                });
            });
    }


    function showModal() {
        Swal.fire({
            title: 'Escolha uma ação',
            html: `
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    <div style="flex: 1;">
                        <h6 class="h6modal">Mudar Lazer</h6>

                        <button id="mudar-lazer-passear" class="buttons-vicente" style="cursor:pointer;">Passear</button>
                        <button id="mudar-lazer-descansar" class="buttons-vicente" style="cursor:pointer;">Descansar</button>
                    </div>
                    <div style="flex: 1;">
                        <h6>Mudar Foco</h6>
                        <button id="mudar-foco-treinar" class="buttons-vicente" style="cursor:pointer;">Treinar</button>
                        <button id="mudar-foco-imprensa" class="buttons-vicente" style="cursor:pointer;">Imprensa</button>
                    </div>
                    <div style="flex: 1;">
                        <h6>Boost</h6>
                        <button id="/ver-boost" class="buttons-vicente" style="cursor:pointer;">Ver % do Boost</button>
                        <button id="/usar-boost" class="buttons-vicente" style="cursor:pointer;">Usar Boost</button>
                    </div>
                    <div style="flex: 1;">
                        <h6>Usar XP</h6>
                        <button id="/usar-xp-humor" class="buttons-vicente" style="cursor:pointer;">Humor</button>
                        <button id="/usar-xp-saude" class="buttons-vicente" style="cursor:pointer;">Saúde</button>
                        <button id="/verXP" class="buttons-vicente" style="cursor:pointer">Ver XP</button>
                    </div>
                </div>
            `,
            focusConfirm: false,
            didRender: () => {
                document.getElementById('mudar-lazer-passear').addEventListener('click', () => mudarFocoOuLazer('mudarLazerPassear'));
                document.getElementById('mudar-lazer-descansar').addEventListener('click', () => mudarFocoOuLazer('mudarLazerDescansar'));
                document.getElementById('mudar-foco-treinar').addEventListener('click', () => mudarFocoOuLazer('mudarFocoTreinar'));
                document.getElementById('mudar-foco-imprensa').addEventListener('click', () => mudarFocoOuLazer('mudarFocoImprensa'));
                document.getElementById('/usar-xp-humor').addEventListener('click', () => mudarFocoOuLazer('usarXpHumor'));
                document.getElementById('/usar-xp-saude').addEventListener('click', () => mudarFocoOuLazer('usarXpSaude'));
                document.getElementById('/ver-boost').addEventListener('click', () => mudarFocoOuLazer('verBoost'));
                document.getElementById('/usar-boost').addEventListener('click', () => mudarFocoOuLazer('usarBoost'));
                document.getElementById('/verXP').addEventListener('click', () => mudarFocoOuLazer('verXP'));

            }
        });
    }


    var ul = document.getElementById('ul-header-links');
    if (ul) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.textContent = 'Vicente';
        a.id = 'vicente-link';
        a.style.cursor = 'pointer';
        li.appendChild(a);
        ul.appendChild(li);

        a.addEventListener('click', showModal);
    }


})();
