// ==UserScript==
// @name        bug2
// @description Automating
// @namespace   bug2
// @version     1.6
// @grant       unsafeWindow
// @license     MIT
// @run-at      document-start
// @include     https://*.tribalwars2.com/game.php*
// @author      -
// @description 28/12/2023, 16:24:45
// @downloadURL https://update.greasyfork.org/scripts/483352/bug2.user.js
// @updateURL https://update.greasyfork.org/scripts/483352/bug2.meta.js
// ==/UserScript==


var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);


(function () {
    'use strict';

    // Adiciona os estilos ao documento
    const styles = `
 .bug2-div {
            position: absolute;
            top: 90px;
            left: 300px;
            width: 90px;
            z-index: 10;
        }
                @media (max-width: 1100px) {
            .bug2-div {
                left: 200px;
            }
        }

        .button-74 {
            background-color: #fbeee0;
            border: 2px solid #422800;
            border-radius: 30px;
            box-shadow: #422800 4px 4px 0 0;
            color: #422800;
            cursor: pointer;
            display: inline-block;
            font-weight: 600;
            padding: 0 10px;
            line-height: 20px;
            text-align: center;
            text-decoration: none;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            max-height: 50px;
            font-size:12px;
            min-width: 60px;
        }

        .button-74:hover {
            background-color: #fff;
        }

        .button-74:active {
            box-shadow: #422800 2px 2px 0 0;
            transform: translate(2px, 2px);
        }

        .form-bg2 {
            background-color: #fbeee0;
            border: 2px solid #422800;
            border-radius: 30px;
            box-shadow: #422800 4px 4px 0 0;
            color: #422800;
            padding: 10px;
            max-width: fit-content;
            display: none;
            position: absolute;
            margin-top: 40px;
        }

        .form-bg2 input[type="number"]::placeholder {
            color: #422800;
            font-weight: bold;
            font-size:12px;
        }


        .form-bg2 input[type="number"]:-webkit-autofill, input[type="number"]:-webkit-autofill:hover, input[type="number"]:-webkit-autofill:focus, input[type="number"]:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #fbeee0 inset !important;
            -webkit-text-fill-color: #422800 !important;
        }


        .form-bg2 input[type="number"] {
            border: 2px solid #422800;
            border-radius: 30px;
            box-shadow: #422800 4px 4px 0 0;
            background-color: #fff;
            color: #422800;
            width: 60px;
            padding: 3px 6px; !important;
        }

        .form-bg2 label
        {
          font-size:12px !important;
          font-weight:bold !important;
        }

        .form-bg2 input[type="number"]:focus {
            outline: none;
        }

        .coordenadas {
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            gap: 10px;
        }

        .bug2-div {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: 50px;
        }

        .vila-info {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            gap: 20px;
        }

        .troops-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 10px;
        }

        #time{
            border: 2px solid #422800;
            border-radius: 30px;
            box-shadow: #422800 4px 4px 0 0;
            background-color: #fff;
            color: #422800;
            width: 80px;
            padding: 3px 6px; !important;
            font-size:12px;
        }

        #time:focus {
            outline: none;
        }

        #time::placeholder {
            color: #422800;
            font-weight: bold;
            font-size:12px;
        }

        .bug-div{
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
    `;


    function createButton(id, text) {
        const button = document.createElement("button");
        button.className = "button-74";
        button.id = id;
        button.textContent = text;
        return button;
    }

    function createFormDiv(id, innerHTML) {
        const formDiv = document.createElement("div");
        formDiv.className = "form-bg2";
        formDiv.innerHTML = innerHTML;
        return formDiv;
    }

    function toggleDisplay(element) {
        element.style.display = element.style.display === 'block' ? 'none' : 'block';
    }
    function hideAllExcept(element) {
        var forms = document.querySelectorAll('.form-bg2');
        for (var i = 0; i < forms.length; i++) {
            if (forms[i] !== element) {
                forms[i].style.display = 'none';
            }
        }
    }

    function setupEventListeners() {
        document.getElementById('menu-bug1').addEventListener('click', function () {
            var form = this.parentNode.querySelector('.form-bg2');
            hideAllExcept(form);
            toggleDisplay(form);
        });
        document.getElementById('menu-bug2').addEventListener('click', function () {
            var form = this.parentNode.querySelector('.form-bg2');
            hideAllExcept(form);
            toggleDisplay(form);
        });
        document.getElementById('menu-bug3').addEventListener('click', function () {
            var form = this.parentNode.querySelector('.form-bg2');
            hideAllExcept(form);
            toggleDisplay(form);
        });
        $(document).on('submit', '#form1', (e) => sendCommands(e, 'form1'));
        $(document).on('submit', '#form2', (e) => sendCommands(e, 'form2'));
        $(document).on('submit', '#form3', (e) => sendCommands(e, 'form3'));

        const timeElement = document.getElementById('time');
        if (timeElement) {
            timeElement.addEventListener('input', function (e) {
                var input = e.target.value;
                // Remove any non-digit characters
                input = input.replace(/\D/g, '');

                // Adiciona os caracteres ":" com base no comprimento da entrada
                var output = '';
                if (input.length > 2) {
                    output += input.substring(0, 2) + ':';
                } else {
                    output += input.substring(0, 2);
                }
                if (input.length > 4) {
                    output += input.substring(2, 4) + ':';
                } else {
                    output += input.substring(2, 4);
                }
                output += input.substring(4, 6);

                e.target.value = output;
            });
        }

        $(document).on('keydown', function (e) {
            if (e.key === 'z' || e.key === 'Z') {
                sendCommands(e, 'form1');
            } else if (e.key === 'x' || e.key === 'X') {
                sendCommands(e, 'form2');
            }
        });
    }



    function addButtonAndForm() {
        const menuContainer = document.querySelector('.two-menu-container');
        if (!menuContainer || document.querySelector('.bug2-div')) return;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const container = document.createElement("div");
        container.className = "bug2-div";

        const form1HTML = `   <form id="form1">
        <span class="coordenadas">
          <h5>Informações  da Aldeia</h5>
          <div class="vila-info">

            <input type="number" name="x" id="x" placeholder="x" autocomplete="off">
            <input type="number" name="y" id="y" placeholder="y" autocomplete="off">
            <input type="number" name="count" id="atqs" placeholder="ATQs" autocomplete="off">
            <button class="button-74" type="submit">Enviar</button>
            </div>
        </span>
    </form>`;
        const form2HTML = `  <form id="form2">
        <span class="coordenadas">
          <h5>Informações  da Aldeia</h5>
        <div class="vila-info">

            <input type="number" name="x" id="x1" placeholder="x1" autocomplete="off">
            <input type="number" name="y" id="y1" placeholder="y1" autocomplete="off">
            <input type="number" name="count" id="atqs1" placeholder="ATQs" autocomplete="off">
        </div>
<h5>Tipo e Qtd de Tropas</h5>
        <div class="troops-info">

        <label>
        <input type="radio" name="troop" value="spear"> Spear
        <input type="number" name="spear_count" min="0" max="100" placeholder="Qtd">
        </label>
        <label>
        <input type="radio" name="troop" value="sword"> Sword
        <input type="number" name="sword_count" min="0" max="100" placeholder="Qtd">
        </label>
        <label>
        <input type="radio" name="troop" value="axe"> Axe
        <input type="number" name="axe_count" min="0" max="100" placeholder="Qtd">
        </label>
        <label>
        <input type="radio" name="troop" value="light_cavalry"> CL
        <input type="number" name="light_cavalry_count" min="0" max="100" placeholder="Qtd">
        </label>
        <label>
        <input type="radio" name="troop" value="heavy_cavalry"> CP
        <input type="number" name="heavy_cavalry_count" min="0" max="100" placeholder="Qtd">
        </label>
        <label>
        <input type="radio" name="troop" value="mounted_archer"> AM
        <input type="number" name="mounted_archer_count" min="0" max="100" placeholder="Qtd">
        </label>
        </div>
            <button class="button-74" type="submit">Enviar</button>
        </span>
    </form>`;

        const form3HTML = `  <form id="form3">
    <span class="coordenadas">
      <h5>Informações  da Aldeia</h5>
    <div class="vila-info">

        <input type="number" name="x" id="x2" placeholder="x1" autocomplete="off">
        <input type="number" name="y" id="y2" placeholder="y1" autocomplete="off">
        <input type="number" name="count" id="atqs2" placeholder="ATQs" autocomplete="off">
    </div>
<h5>Tipo e Qtd de Tropas</h5>
    <div class="troops-info">

    <label>
    <input type="radio" name="troop" value="spear"> Spear
    <input type="number" name="spear_count1" min="0" max="100" placeholder="Qtd">
    </label>
    <label>
    <input type="radio" name="troop" value="sword"> Sword
    <input type="number" name="sword_count1" min="0" max="100" placeholder="Qtd">
    </label>
    <label>
    <input type="radio" name="troop" value="axe"> Axe
    <input type="number" name="axe_count1" min="0" max="100" placeholder="Qtd">
    </label>
    <label>
    <input type="radio" name="troop" value="light_cavalry"> CL
    <input type="number" name="light_cavalry_count1" min="0" max="100" placeholder="Qtd">
    </label>
    <label>
    <input type="radio" name="troop" value="heavy_cavalry"> CP
    <input type="number" name="heavy_cavalry_count1" min="0" max="100" placeholder="Qtd">
    </label>
    <label>
    <input type="radio" name="troop" value="mounted_archer"> AM
    <input type="number" name="mounted_archer_count1" min="0" max="100" placeholder="Qtd">
    </label>



    </div>
<div>
    <label for="time">Tempo de viagem</label>
<input type="text" placeholder="HH:MM:SS" id="time" name="time" pattern="\\d{2}:\\d{2}:\\d{2}" autocomplete="off">
</div>
<h5>Tropa a ser recrutada</h5>
<div class="troops-info">
<label>
<input type="radio" name="troop_recruit" value="spear"> Spear
<input type="number" id="spear_count_recruit" min="0" placeholder="Qtd">
</label>
<label>
<input type="radio" name="troop_recruit" value="sword"> Sword
<input type="number" id="sword_count_recruit" min="0" placeholder="Qtd">
</label>
<label>
<input type="radio" name="troop_recruit" value="axe"> Axe
<input type="number" id="axe_count_recruit" min="0" placeholder="Qtd">
</label>
<label>
<input type="radio" name="troop_recruit" value="light_cavalry"> CL
<input type="number" id="light_cavalry_count_recruit" min="0" placeholder="Qtd">
</label>
<label>
<input type="radio" name="troop_recruit" value="heavy_cavalry"> CP
<input type="number" id="heavy_cavalry_count_recruit" min="0" placeholder="Qtd">
</label>
<label>
<input type="radio" name="troop_recruit" value="mounted_archer"> AM
<input type="number" id="mounted_archer_count_recruit" min="0" placeholder="Qtd">
</label>
<label>
<input type="radio" name="troop_recruit" value="ram"> Aríete
<input type="number" id="ram_count_recruit" min="0" placeholder="Qtd">
</label>
<label>
<input type="radio" name="troop_recruit" value="catapult"> Cata
<input type="number" id="catapult_count_recruit" min="0" placeholder="Qtd">
</label>
<label>
<input type="radio" name="troop_recruit" value="trebuchet"> Trab
<input type="number" id="trebuchet_count_recruit" min="0" placeholder="Qtd">
</label>

</div>

<div>
<input type="number" name="delay-recruit" id="delay" placeholder="Delay" autocomplete="off">
<input type="number" name="count-recruit" id="count-recruit" placeholder="Recruits" autocomplete="off">
</div>


        <button class="button-74" type="submit">Enviar</button>
    </span>
</form>`;


        let bug1Div = document.createElement("div");
        bug1Div.className = "bug-div";
        bug1Div.id = "bug1-div";

        let bug2Div = document.createElement("div");
        bug2Div.className = "bug-div";
        bug2Div.id = "bug2-div";


        let autoBugDiv = document.createElement("div");
        autoBugDiv.className = "bug-div";
        autoBugDiv.id = "auto-bug-div";



        bug1Div.appendChild(createButton("menu-bug1", "Bug 1"));
        bug1Div.appendChild(createFormDiv("form2", form2HTML));

        bug2Div.appendChild(createButton("menu-bug2", "Bug 2"));
        bug2Div.appendChild(createFormDiv("form1", form1HTML));

        autoBugDiv.appendChild(createButton("menu-bug3", "AutoBug"));
        autoBugDiv.appendChild(createFormDiv("form3", form3HTML));


        container.appendChild(bug1Div);
        container.appendChild(bug2Div);
        container.appendChild(autoBugDiv);

        menuContainer.parentNode.insertBefore(container, menuContainer.nextSibling);
        setupEventListeners();


        clearInterval(checkExist);
    }

    function getIdVilaAtual() {
        return new Promise((resolve, reject) => {
            const socketService = injector.get('socketService');
            const routeProvider = injector.get('routeProvider');
            const modelDataService = injector.get('modelDataService');
            const span = document.querySelector('span[ng-show*="character.getSelectedVillage().getX()"]');
            if (!span) {
                reject("Elemento span não encontrado");
                return;
            }

            const coordsText = span.textContent;
            const [x, y] = coordsText.replace(/[()]/g, '').split('|').map(Number);

            socketService.emit(routeProvider.MAP_GETVILLAGES, { x: x, y: y, width: 1, height: 1 }, function (data) {
                if (data && data.villages && data.villages.length > 0) {
                    var idvila = data.villages[0]['id'];
                    resolve(idvila);
                } else {
                    reject("Dados da vila não encontrados");
                }
            });
        });
    }
    let recruitQueue = [];

    function sendCommands(e, formId) {
        e.preventDefault();
        let x, y, atqs, unitVal, unitCount, time, unitValRecruit, unitCountRecruit;

        // Dados comuns
        x = parseInt($(`#${formId} input[name='x']`).val(), 10);
        y = parseInt($(`#${formId} input[name='y']`).val(), 10);
        atqs = parseInt($(`#${formId} input[name='count']`).val(), 10);

        console.log(x, y, atqs)

        const socketService = injector.get('socketService');
        const routeProvider = injector.get('routeProvider');
        const modelDataService = injector.get('modelDataService');

        let count = 0;

        socketService.emit(routeProvider.MAP_GETVILLAGES, { x: x, y: y, width: 1, height: 1 }, function (data) {
            var idvila = data.villages[0]['id'];
            console.log(idvila);

            const attackInterval = setInterval(() => {
                let army = {};

                if (formId === 'form2') {
                    unitVal = $('input[name="troop"]:checked').val();
                    unitCount = parseInt($('input[name="' + unitVal + '_count"]').val(), 10);
                    army[unitVal] = unitCount;
                }

                else if (formId === 'form3') {
                    unitVal = $('input[name="troop"]:checked').val();
                    unitCount = parseInt($('input[name="' + unitVal + '_count1"]').val(), 10);
                    army[unitVal] = unitCount;
                    let delay = parseInt($(`#${formId} input[name='delay-recruit']`).val(), 10);
                    let countRecruit = parseInt($(`#${formId} input[name='count-recruit']`).val(), 10);

                    time = $(`#form3 input[name='time']`).val();
                    // Dividindo o tempo em horas, minutos e segundos
                    let [hours, minutes, seconds] = time.split(':').map(num => parseInt(num, 10));
                    // Convertendo para milissegundos
                    let totalMilliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;

                    let horaAgora = new Date();
                    let horaChegada = new Date(horaAgora.getTime() + totalMilliseconds);
                    let horaRecrutamento = new Date(horaChegada.getTime() + delay * 1000); // Adicionando delay
                    console.log("Hora de recrutamento:", horaRecrutamento)



                    //tropa a ser recrutada:
                    unitValRecruit = $('input[name="troop_recruit"]:checked').val();
                    unitCountRecruit = parseInt($(`#${unitValRecruit}_count_recruit`).val(), 10);

                    recruitQueue.push({
                        idvila: null, // Este valor será preenchido depois
                        unitValRecruit,
                        unitCountRecruit,
                        horaRecrutamento,
                        countRecruit
                    });

                    // Processar a fila
                    processRecruitQueue();


                }
                else {
                    // Defina aqui o comportamento padrão para form1
                    army = { saajhsajsa: 1 };
                }

                socketService.emit(routeProvider.SEND_CUSTOM_ARMY, {
                    start_village: modelDataService.getSelectedVillage().getId(),
                    target_village: idvila,
                    type: "attack",
                    units: army,
                    icon: 0,
                    officers: {},
                    catapult_target: false
                });

                console.log('Enviando ataque...', (count + 1));
                count++;

                if (count === atqs) {
                    clearInterval(attackInterval);
                    console.log('Ataques enviados!')
                }
            }, 0);
        });
    }

    function processRecruitQueue() {

        const socketService = injector.get('socketService');
        const routeProvider = injector.get('routeProvider');

        if (recruitQueue.length === 0) {
            console.log("Fila de recrutamento vazia");
            return; // Nada para processar
        }
        const recruitDetails = recruitQueue.shift(); // Obtém o primeiro item da fila

        const span = document.querySelector('span[ng-show*="character.getSelectedVillage().getX()"]');
        if (!span) {
            console.log("Elemento span não encontrado");
            return;
        }


        const coordsText = span.textContent;
        const [xvila, yvila] = coordsText.replace(/[()]/g, '').split('|').map(Number);

        socketService.emit(routeProvider.MAP_GETVILLAGES, { x: xvila, y: yvila, width: 1, height: 1 }, function (data) {
            if (data && data.villages && data.villages.length > 0) {
                recruitDetails.idvila = data.villages[0]['id']; // Atualiza o idvila

                for (let i = 0; i < recruitDetails.countRecruit; i++) {
                    setTimeout(() => {
                        socketService.emit(routeProvider.BARRACKS_RECRUIT, {
                            "village_id": recruitDetails.idvila,
                            "unit_type": recruitDetails.unitValRecruit,
                            "amount": recruitDetails.unitCountRecruit
                        });
                    }, recruitDetails.horaRecrutamento.getTime() - Date.now());
                }
            } else {
                console.log("Dados da vila não encontrados");
                return;
            }
        });


    }

    let checkExist = setInterval(addButtonAndForm, 1000);



})();