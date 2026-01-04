// ==UserScript==
// @name         🔎 Roblox Search Filters v1.0.0
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds a sidebar where you can filter your searches on Roblox.
// @author       ru-bem
// @match        https://www.roblox.com/discover/*
// @match        https://www.roblox.com/charts/*
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534860/%F0%9F%94%8E%20Roblox%20Search%20Filters%20v100.user.js
// @updateURL https://update.greasyfork.org/scripts/534860/%F0%9F%94%8E%20Roblox%20Search%20Filters%20v100.meta.js
// ==/UserScript==

(function() {
'use strict';

//// Personalization
const config={
  interfacePosition:{top:'80px',left:'0'},
    interfaceStyles:{
      position:'fixed',
      backgroundColor:'#191a1f',
      border:'0px solid #222',
      padding:'50px 15px 300px 15px',
      borderRadius:'16px',
      zIndex:'9999',
      fontFamily:'Arial, sans-serif',
      cursor:'grab',
      boxShadow:'0 10px 10px rgba(0,0,0,0)'
    },
    layout:{
        groupDirection:'vertical',
        inputAlignment:'rows',
        spacing:{betweenGroups:'30px',betweenInputs:'5px'}
    },
    elementsOrder:['approval','players','button'],
    inputStyles:{
        width:'74px',padding:'5px',margin:'0',borderRadius:'0px',
        backgroundColor:'#222',color:'white',border:'0px solid #333'
    },
    buttonStyles:{
        width:'100%',backgroundColor:'#335fff',color:'white',
        padding:'12px 0',border:'none',borderRadius:'6px',
        cursor:'pointer',marginTop:'15px',fontWeight:'bold'
    },
    defaultFilters:{minApproval:80,maxApproval:100,minPlayers:'',maxPlayers:''},
    selectors:{
        gameCard:['.game-card-container','.list-item.game-card.game-tile'],
        approvalPercentage:'.vote-percentage-label',
        activePlayers:'.playing-counts-label'
    },
    urlKeywords:['/discover/?Keyword=','/charts/']
};

//// Code
function createInterface(){
    if(document.getElementById('approval-filter-interface')) return;

    const interfaceDiv = document.createElement('div');
    interfaceDiv.id = 'approval-filter-interface';
    Object.assign(interfaceDiv.style, config.interfaceStyles);
    interfaceDiv.style.top = config.interfacePosition.top;
    interfaceDiv.style.left = config.interfacePosition.left;

    // Groups
    const groups = {
        approval: createFilterGroup('👍 %Approval', 'minApproval', 'maxApproval'),
        players: createFilterGroup('▶️ Active Players', 'minPlayers', 'maxPlayers'),
        button: createButton()
    };

    // Order elements
    config.elementsOrder.forEach(key => {
        if(groups[key]) {
            groups[key].style.marginBottom = config.layout.spacing.betweenGroups;
            interfaceDiv.appendChild(groups[key]);
        }
    });

    document.body.appendChild(interfaceDiv);
    makeDraggable(interfaceDiv);

    function createFilterGroup(title, minKey, maxKey) {
        const group = document.createElement('div');
        const titleElement = document.createElement('div');
        titleElement.textContent = title;
        titleElement.style.color = '#fff';
        titleElement.style.marginBottom = '10px';

        const inputsContainer = document.createElement('div');
        inputsContainer.style.display = 'flex';
        inputsContainer.style.flexDirection = 'column';
        inputsContainer.style.gap = config.layout.spacing.betweenInputs;

        const minInput = createInput('number', config.defaultFilters[minKey], 'MIN:');
        const maxInput = createInput('number', config.defaultFilters[maxKey], 'MAX:');

        inputsContainer.append(minInput, maxInput);
        group.append(titleElement, inputsContainer);

        group.minInput = minInput.querySelector('input');
        group.maxInput = maxInput.querySelector('input');

        return group;
    }

    function createInput(type, value, labelText) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.color = '#ccc';
        label.style.minWidth = '60px';

        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        Object.assign(input.style, config.inputStyles);

        container.append(label, input);
        return container;
    }

    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Filter';
        Object.assign(button.style, config.buttonStyles);
        button.onclick = () => {
            filterGames(
                parseInt(groups.approval.minInput.value) || 0,
                parseInt(groups.approval.maxInput.value) || 100,
                parseInt(groups.players.minInput.value) || 0,
                parseInt(groups.players.maxInput.value) || Infinity
            );
        };
        return button;
    }
}

function filterGames(minApproval, maxApproval, minPlayers, maxPlayers) {
    document.querySelectorAll(config.selectors.gameCard).forEach(card => {
        const approvalMatch = checkApproval(card, minApproval, maxApproval);
        const playersMatch = checkPlayers(card, minPlayers, maxPlayers);
        card.style.display = (approvalMatch && playersMatch) ? '' : 'none';
    });

    function checkApproval(card, min, max) {
        const element = card.querySelector(config.selectors.approvalPercentage);
        if (!element) return true;
        const percent = parseInt(element.textContent.replace(/\D/g, ''));
        return percent >= min && percent <= max;
    }

    function checkPlayers(card, min, max) {
        const element = card.querySelector(config.selectors.activePlayers);
        if (!element) return true;
        const players = parseInt(element.textContent.replace(/\D/g, ''));
        return players >= min && players <= max;
    }
}

function makeDraggable(element) {
    let isDragging = false;
    let offset = [0, 0];

    element.addEventListener('mousedown', e => {
        if (e.target.tagName === 'INPUT') return;
        isDragging = true;
        offset = [e.clientX - element.offsetLeft, e.clientY - element.offsetTop];
        element.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        element.style.left = `${e.clientX - offset[0]}px`;
        element.style.top = `${e.clientY - offset[1]}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        element.style.cursor = 'grab';
    });
}

// Init
new MutationObserver(() => {
    if (config.urlKeywords.some(kw => location.href.includes(kw))) {
        createInterface();
    }
}).observe(document.body, { subtree: true, childList: true });
})();