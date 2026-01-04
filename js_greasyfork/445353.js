// ==UserScript==
// @name         CurrencyRate
// @namespace    Pokeclicker Scripts
// @version      0.3
// @description  Display curency rate
// @author       Maxteke
// @match        https://www.pokeclicker.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445353/CurrencyRate.user.js
// @updateURL https://update.greasyfork.org/scripts/445353/CurrencyRate.meta.js
// ==/UserScript==

function currencyCard() {
    var card = document.createElement('div');
    card.id = 'curencyRate';
    card.classList.add('card')
    card.classList.add('sortable')
    card.classList.add('border-secondary')
    card.classList.add('mb-3')
    
    var header = document.createElement('div');
    header.classList.add('card-header');
    header.classList.add('p-0');
    header.setAttribute('data-toggle', 'collapse');
    header.setAttribute('href', '#curencyRateBody');
    var title = document.createElement('span');
    title.innerHTML = 'Currency rate';
    
    header.appendChild(title);
    card.appendChild(header);
    
    var bodyDiv = document.createElement('div');
    bodyDiv.id = 'curencyRateBody'
    bodyDiv.classList.add('card-body');
    bodyDiv.classList.add('p-0');
    bodyDiv.classList.add('collapse');
    bodyDiv.classList.add('show');
    
    var container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignContent = 'center';
    container.style.alignItems = 'center';

    var range = 1;
    if (localStorage.getItem("range") != null){
        range = parseInt(localStorage.getItem("range"));
    }
    else {
        localStorage.setItem("range", range);
    }

    var input = document.createElement('input');
    input.id = 'currency-rate-input';
    input.type = 'number';
    input.value = range;
    input.min = '1';
    input.max = '60';
    input.name = 'refreshRange';
    input.classList.add('outline-dark');
    input.classList.add('form-control');
    input.classList.add('form-control-number');
    container.appendChild(input);

    bodyDiv.appendChild(container);
    card.appendChild(bodyDiv);
    
    document.getElementById('left-column').prepend(card);
    return {"container": container, "input": input};
}

function currencyMoneyDiv(card) {
    var span = document.createElement('span');
    span.style.display = 'inline';
    span.style.position = 'relative';

    var img = document.createElement('img');
    img.title = 'Money';
    img.src = 'assets/images/currency/money.svg';
    img.setAttribute('height', '25px');
    span.appendChild(img);

    var value = document.createElement('span');
    value.id = 'currency-rate-money';
    value.style.paddingLeft = '5px';
    value.innerHTML = '0/10s';
    span.appendChild(value);

    card.appendChild(span);
    return value;
}

function currencyDungeonDiv(card) {
    var span = document.createElement('span');
    span.style.display = 'inline';
    span.style.position = 'relative';

    var img = document.createElement('img');
    img.title = 'Dungeon Tokens Gained by capturing Pokémon';
    img.src = 'assets/images/currency/dungeonToken.svg';
    img.setAttribute('height', '25px');
    span.appendChild(img);

    var value = document.createElement('span');
    value.id = 'currency-rate-dungeon';
    value.style.paddingLeft = '5px';
    value.innerHTML = '0/10s';
    span.appendChild(value);

    card.appendChild(span);
    return value;
}

function setMoneyRate(moneyRate, span, range) {
    var mean = 0;
    for (var rate of moneyRate) {
        mean += rate;
    }
    mean /= moneyRate.length;
    span.innerHTML = Math.round(mean * range).toLocaleString('en-US') + ' / ' + range + 's';
}

function setDungeonRate(dungeonRate, span, range) {
    var mean = 0;
    for (var rate of dungeonRate) {
        mean += rate;
    }
    mean /= dungeonRate.length;
    span.innerHTML = Math.round(mean * range).toLocaleString('en-US') + ' / ' + range + 's';
}

function currencyLoop(money, dungeon, range) {
    var oldMonyCurrency = App.game.wallet.currencies[GameConstants.Currency.money]();
    var moneyRate = [];
    var moneyIndex = 0;

    var oldDungeonCurrency = App.game.wallet.currencies[GameConstants.Currency.dungeonToken]();
    var dungeonRate = [];
    var dungeonIndex = 0;
    setInterval(function () {
        if (parseInt(range.value) < 1)
            range.value = 1;
        
        var mRate = App.game.wallet.currencies[GameConstants.Currency.money]() - oldMonyCurrency;
        var dRate = App.game.wallet.currencies[GameConstants.Currency.dungeonToken]() - oldDungeonCurrency;

        if (mRate >= 0) {
            moneyRate[moneyIndex] = mRate;
            moneyIndex = (moneyIndex + 1) % 10;
        }

        if (dRate >= 0) {
            dungeonRate[dungeonIndex] = dRate;
            dungeonIndex = (dungeonIndex + 1) % 10;
        }

        setMoneyRate(moneyRate, money, parseInt(range.value));
        oldMonyCurrency = App.game.wallet.currencies[GameConstants.Currency.money]();

        setDungeonRate(dungeonRate, dungeon, parseInt(range.value));
        oldDungeonCurrency = App.game.wallet.currencies[GameConstants.Currency.dungeonToken]();

        localStorage.setItem("range", parseInt(range.value));
    }, 1000);
}

function initCurrencyRate() {
    var card = currencyCard();
    var money = currencyMoneyDiv(card.container);
    var dungeon = currencyDungeonDiv(card.container);
    currencyLoop(money, dungeon, card.input);
}

function loadScript(){
    var oldInit = Preload.hideSplashScreen

    Preload.hideSplashScreen = function(){
        var result = oldInit.apply(this, arguments)
        initCurrencyRate()
        console.log(`[${GameConstants.formatDate(new Date())}] %cCurrency rate loaded`, 'color:#8e44ad;font-weight:900;');
        return result
    }
}

var scriptName = 'currencyRate'

if (document.getElementById('scriptHandler') != undefined){
    var scriptElement = document.createElement('div')
    scriptElement.id = scriptName
    document.getElementById('scriptHandler').appendChild(scriptElement)
    if (localStorage.getItem(scriptName) != null){
        if (localStorage.getItem(scriptName) == 'true'){
            loadScript()
        }
    }
    else{
        localStorage.setItem(scriptName, 'true')
        loadScript()
    }
}
else{
    loadScript();
}