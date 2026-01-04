// ==UserScript==
// @name         Dashboard do tecnico - AngryDucks
// @namespace    https://www.footmundo.com/
// @version      1.1
// @description  Interage automaticamente com todos os jogadores na lista de relacionamentos no Footmundo.
// @author       Vicente Ayuso
// @match        https://www.footmundo.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465283/Dashboard%20do%20tecnico%20-%20AngryDucks.user.js
// @updateURL https://update.greasyfork.org/scripts/465283/Dashboard%20do%20tecnico%20-%20AngryDucks.meta.js
// ==/UserScript==

//changelog: ver 1.5 - agora vai ao local das pessoas

(function() {
    'use strict';



      const style = `
        <style>
          #detailstecnico {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

          }
          #dashboardtecnico summary:hover,
          .dashboard-tab:hover {
            cursor: pointer;
            background-color: #f0f0f0;
          }
          #dashboardtecnico ul {
            display: flex;
            list-style-type: none;
            padding: 0;
            margin-bottom: 15px;
            text-align:center;
          }

          #dashboardtecnico li {
            margin-right: 15px;
            text-align:left;
          }
          .dashboard-content {
            display: none;
          }
          #my-iframe {
            overflow: hidden;
            position: relative;
            width: 100%;
            height: 1500px;
            border: none;
          }

          #agendar-treino {
            overflow: hidden;
            position: relative;
            max-height:140px
          }

          .habilidades-jogadores {
            border-collapse: collapse;
            width: 100%;
          }
          .habilidades-jogadores th,
          .habilidades-jogadores td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
          .habilidades-jogadores th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .habilidades-jogadores tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          #jogadores li {
          padding: 5px 0;
          }

  #atributos{
    display:none;
  }
      .habilidades-jogadores {
      width: 100%;
      max-width: 300px;
      border-collapse: collapse;
      font-family: Arial, sans-serif;
      margin-bottom: 16px;
    }
    .habilidades-jogadores th,
    .habilidades-jogadores td {
      border: 1px solid #ccc;
      padding: 4px 8px;
      text-align: left;
    }
    .habilidades-jogadores th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    .player-strength {
      background-color: #f8f8f8;
      border-radius: 4px;
      padding: 8px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      font-size:11px;
      font-weight:bold;
    }
    .player-strength p {
      margin: 0 0 8px;
      flex-basis: calc(33.333% - 8px);
    }
    .player-strength p:last-child {
      margin-bottom: 0;
    }
        </style>
      `;

      $('head').append(style);

        $(document).on('mouseover', 'summary', function() {
        $(this).css('cursor', 'pointer');
      });
        // Armazenar o id e o nome do local
        const jogadores = [
          {id: '1678', nome: 'Sofia Zecchin'},
          {id: '1861', nome: 'Breno Raimundo'},
          {id: '1901', nome: 'Cássia Vilar Brasileiro'},
          {id: '1969', nome: 'Nina Marion'},
          {id: '2010', nome: 'Henri de Assis Lira'},
          {id: '2009', nome: 'Adelaide Castro'},
          {id: '2011', nome: 'Lílian Donizeti Benites'},
          {id: '2012', nome: 'Olavo de Carvalho'},
          {id: '2013', nome: 'Manoel Gomes'},
          {id: '2025', nome: 'Fernando Gayer Junior'},
          {id: '2047', nome: 'Diego Souza'},
          {id: '2029', nome: 'Elisa Akemi'},
          {id: '2048', nome: 'Júnior Vale Junior'},
          {id: '2044', nome: 'Heloísa Zanette'},
          {id: '2046', nome: 'Abelardo Antão'},
          {id: '2045', nome: 'Neuza Abdalla'},
          {id: '1883', nome: 'Kelly Keller'},
          {id: '1620', nome: 'Theseu Spilborghs'},
          {id: '2054', nome: 'Jason Zampieiri'},
        ];

        jogadores.sort((a, b) => {
          if (a.nome < b.nome) {
            return -1;
          } else if (a.nome > b.nome) {
            return 1;
          } else {
            return 0;
          }
        });





    const playerSkills = {}; // Adicione esta linha antes da função loadPlayerSkills para armazenar as habilidades de todos os jogadores

    async function loadPlayerSkills(event) {
      return new Promise(async (resolve) => {
        const playerId = event.target.dataset.id;
        const playerName = event.target.textContent;
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `https://www.footmundo.com/habilidades/jogador/${playerId}`;

        iframe.addEventListener('load', () => {
          const strongElement = iframe.contentDocument.querySelector('strong');
          const tableElement = iframe.contentDocument.querySelector('.padrao');

          if (strongElement && tableElement) {
            const newTableElement = tableElement.cloneNode(true);
            newTableElement.classList.remove('padrao');
            newTableElement.classList.add('habilidades-jogadores');
            event.target.parentNode.querySelector('.player-container').appendChild(newTableElement);
            event.target.removeEventListener('click', loadPlayerSkills);

            const skills = [];
            const rows = newTableElement.querySelectorAll('tr');
            rows.forEach((row) => {
              const skillName = row.querySelector('td:first-child')?.textContent;
              const skillLevel = row.querySelector('td:nth-child(2)')?.textContent;

              if (skillName && skillLevel) {
                skills.push({ name: skillName, level: parseInt(skillLevel, 10) });
              }
            });

            if (!playerSkills[playerName]) {
              playerSkills[playerName] = { skills: skills };
            } else {
              playerSkills[playerName].skills = skills;
            }
          }
          resolve();
        });

        document.body.appendChild(iframe);
      });
    }


    async function loadPlayerAttributes(event) {
      return new Promise(async (resolve) => {
        const playerId = event.target.dataset.id;
        const playerName = event.target.textContent;
        const iframeattr = document.createElement('iframe');
        iframeattr.style.display = 'none';
        iframeattr.src = `https://www.footmundo.com/atributos/jogador/${playerId}`;

        iframeattr.addEventListener('load', () => {
          const strongElement = iframeattr.contentDocument.querySelector('strong');
          const tableElement = iframeattr.contentDocument.querySelector('.padrao');

          if (strongElement && tableElement) {
            const newTableElement = tableElement.cloneNode(true);
            const rows = newTableElement.querySelectorAll('tr');

            rows.forEach((row) => {
              const attributeName = row.querySelector('td:first-child')?.textContent;
              const attributeValue = row.querySelector('td:nth-child(2) a')?.title;

              if (attributeName && attributeValue) {
                const valueBeforeSlash = attributeValue.split('/')[0].trim();
                row.querySelector('td:nth-child(2)').textContent = valueBeforeSlash;
              }
            });

            newTableElement.classList.remove('padrao');
            newTableElement.classList.add('habilidades-jogadores');
            event.target.parentNode.querySelector('.player-container').appendChild(newTableElement);
            event.target.removeEventListener('click', loadPlayerAttributes);

            const attributes = [];
            rows.forEach((row) => {
              const attributeName = row.querySelector('td:first-child')?.textContent;
              const attributeValue = row.querySelector('td:nth-child(2)')?.textContent;

              if (attributeName && attributeValue) {
                attributes.push({ name: attributeName, value: parseInt(attributeValue, 10) });
              }
            });

            if (!playerSkills[playerName]) {
              playerSkills[playerName] = { attributes: attributes };
            } else {
              playerSkills[playerName].attributes = attributes;
            }
          }
          resolve();
        });

        document.body.appendChild(iframeattr);
      });
    }

  function calculatePlayerStrength(skills, attributes, positionSkills, positionAttributes) {
  let skillTotal = 0;
  let attributeTotal = 0;

  skills.forEach((skill) => {
    if (positionSkills.includes(skill.name)) {
      skillTotal += skill.level;
    }
  });

  attributes.forEach((attribute) => {
    if (positionAttributes.includes(attribute.name)) {
      attributeTotal += attribute.value;
    }
  });

  const skillStrength = skillTotal * 0.0045454545;
  const attributeStrength = attributeTotal * 0.15;
  const totalStrength = skillStrength + attributeStrength;

  return totalStrength.toFixed(2);
}

function displayPlayerStrength() {
  const playerName = this.textContent;
  const playerData = playerSkills[playerName];

  if (playerData && playerData.skills && playerData.attributes) {
    const positionSkills = {
      GK: [
        "Visão de jogo",//ok
        "Domínio",//ok
        "Defesa",//ok
        "Espalmar",//ok
        "Equilíbrio",//ok
        "Posicionamento",//ok
        "Saltar",//ok
        "Futebol",//ok
        "Futebol Profissional",//ok
        "Deslocamento",//ok

      ],
      LT: [
        "Visão de jogo",//OK
        "Domínio",//OK
        "Defesa",//OK
        "Passe",//OK
        "Equilíbrio",//OK
        "Cruzamento",//OK
        "Posicionamento",//OK
        "Futebol",//ok
        "Futebol Profissional",//OK
        "Ataque", // ok
      ],
      ZG: [
        "Visão de jogo",//ok
        "Domínio",//ok
        "Defesa",//ok
        "Cabeceio",//ok
        "Equilíbrio",//ok
        "Desarmar",//ok
        "Posicionamento",//ok
        "Saltar",//ok
        "Futebol",//ok
        "Futebol Profissional",//ok
      ],
      VL: [
        "Visão de jogo",//OK
        "Domínio",//OK
        "Defesa",//OK
        "Passe",//OK
        "Equilíbrio",//OK
        "Desarmar",//ok
        "Posicionamento",//ok
        "Futebol",//OK
        "Futebol Profissional",//OK
        "Deslocamento",//ok
      ],
      MC: [
        "Ataque",//ok
        "Visão de jogo",//ok
        "Domínio",//ok
        "Passe",//ok
        "Defesa",// ok
        "Equilíbrio",//ok
        "Lançamento",//OK
        "Posicionamento",//OK
        "Futebol",//ok
        "Futebol Profissional",//ok
      ],
      MA: [
        "Ataque",//ok
        "Visão de jogo",//ok
        "Equilíbrio",//ok
        "Passe",//ok
        "Posicionamento",//ok
        "Drible",//
        "Futebol",//ok
        "Futebol Profissional",//ok
        "Chute",//ok
        "Lançamento",//ok
      ],
      SA: [
        "Ataque",//ok
        "Visão de jogo",//ok
        "Domínio",//ok
        "Cabeceio",//ok
        "Equilíbrio",//ok
        "Chute",//ok
        "Posicionamento",//ok
        "Drible",//ok
        "Futebol",//ok
        "Futebol Profissional",//ok
      ],
      AT: [
        "Ataque",//ok
        "Visão de jogo",//ok
        "Domínio",//ok
        "Cabeceio",//ok
        "Equilíbrio",//ok
        "Posicionamento",//ok
        "Saltar",//ok
        "Futebol", //ok
        "Futebol Profissional",//ok
        "Chute",//ok
      ],
    };

    const positionAttributes = {
      GK: ["Inteligência", "Agilidade", "Reflexo"],
      LT: ["Inteligência", "Agilidade", "Velocidade"],
      ZG: ["Inteligência", "Físico", "Agilidade"],
      VL: ["Inteligência", "Físico", "Agilidade"],
      MC: ["Inteligência", "Agilidade", "Velocidade"],
      MA: ["Inteligência", "Agilidade", "Velocidade"],
      SA: ["Inteligência", "Agilidade", "Velocidade"],
      AT: ["Inteligência", "Agilidade", "Físico"],
    };

    const strengthDiv = document.createElement('div');
    strengthDiv.classList.add('player-strength');

    Object.keys(positionSkills).forEach((position) => {
      const strength = calculatePlayerStrength(
        playerData.skills,
        playerData.attributes,
        positionSkills[position],
        positionAttributes[position]
      );

      const strengthElement = document.createElement('p');
      strengthElement.textContent = `${position}: ${strength}`;
      strengthDiv.appendChild(strengthElement);
    });

    this.parentNode.querySelector('.player-container').appendChild(strengthDiv);
    this.removeEventListener('click', displayPlayerStrength);
  }
}








      // 1. Estrutura HTML
      const dashboardHTML = `
  <details id="detailstecnico">
      <summary>Dashboard do Técnico</summary>
      <div id="dashboardtecnico">
          <ul>
              <li><span id="jogadores-tab" class="dashboard-tab" style=color:black;>Jogadores</span></li>
              <li><span id="agendar-treino-tab" class="dashboard-tab" style=color:black;>Agendar Treino<div id=iframe-treino></div></span></li>

          </ul>
          <div id="jogadores" class="dashboard-content">
            <!-- Conteúdo da aba Jogadores será adicionado aqui -->
          </div>
          <div id="jogadores-iframe" class="dashboard-content">
            <iframe id="jogadores-iframe-content"></iframe>
          </div>
          <div id="agendar-treino" class="dashboard-content">
              <!-- Conteúdo da aba Agendar Treino -->
          </div>
      </div>
  </details>
  `;
      function showDashboardContent() {
          const targetId = $(this).attr('id').replace('-tab', '');
          $('.dashboard-content').hide();
          $('#' + targetId).show();
      }

    $('body').prepend(dashboardHTML);

    // Mova esta linha para depois de adicionar o dashboardHTML ao DOM
    $('.dashboard-tab').on('click', showDashboardContent);



    // 2. Conteúdo da aba Jogadores
    const jogadoresHTML = jogadores.map((jogador) => {
      return `
        <li>
          <details>
            <summary data-id="${jogador.id}">${jogador.nome}</summary>
            <div class="player-container"></div> <!-- Adicione esta linha -->
          </details>
        </li>
      `;
    }).join('');

    const listaJogadoresHTML = `
        <ol>
            ${jogadoresHTML}
        </ol>
    `;

    $('#jogadores').html(listaJogadoresHTML);

    // Adicione esta linha para registrar o evento de clique nos elementos 'summary'
    $('#jogadores summary').on('click', async function (event) {
      const playerId = event.target.dataset.id;
      const playerName = event.target.textContent;

      // Aguarda o término de loadPlayerSkills e loadPlayerAttributes
      await Promise.all([
        loadPlayerSkills(event),
        loadPlayerAttributes(event),
      ]);

      displayPlayerStrength.call(this);
    });

$('#jogadores-tab').on('click', function() {
const iframe = document.createElement('iframe');
  iframe.id = 'my-iframe';
  iframe.src = 'https://www.footmundo.com/agendar-treino/time/176';

  iframe.addEventListener('load', () => {
    const targetDivSelector = 'table';
    const targetDiv = iframe.contentDocument.querySelector(targetDivSelector);
    if (targetDiv) {
      const { top, left } = targetDiv.getBoundingClientRect();
      iframe.style.transform = `translate(-${left}px, -${top}px)`;
      iframe.style.width = `${targetDiv.offsetWidth}px`;
      iframe.style.height = `${targetDiv.offsetHeight}px`;
    }
  });

  const jogadoresDiv = document.getElementById('jogadores-iframe');
  jogadoresDiv.innerHTML = '';
  jogadoresDiv.appendChild(iframe);
});



function showIframeContent() {
  const iframe = document.createElement('iframe');
  iframe.id = 'my-iframe';
  iframe.src = 'https://www.footmundo.com/agendar-treino/time/176';

  iframe.addEventListener('load', () => {
    const targetDivSelector = '#conteudo';
    const targetDiv = iframe.contentDocument.querySelector(targetDivSelector);
    if (targetDiv) {
      const { top, left } = targetDiv.getBoundingClientRect();
      iframe.style.transform = `translate(-${left}px, -${top}px)`;
    }
  });

  const agendarTreinoDiv = document.getElementById('agendar-treino');
  agendarTreinoDiv.innerHTML = '';
  agendarTreinoDiv.appendChild(iframe);
}

// Adicione este código para carregar o iframe ao clicar na aba "Agendar Treino"
document.getElementById('agendar-treino-tab').addEventListener('click', showIframeContent);




})();