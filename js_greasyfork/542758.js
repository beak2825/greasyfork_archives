// ==UserScript==
// @name         Tix Pro (for Roblox)
// @namespace    rblx.cash
// @version      1337
// @description  Extremely simple $RBLX & Robux price conversion widget with multiple currencies.
// @author       mobs2r
// @match        https://www.roblox.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      query1.finance.yahoo.com
// @connect      api.exchangerate-api.com
// @connect      api.frankfurter.app
// @downloadURL https://update.greasyfork.org/scripts/542758/Tix%20Pro%20%28for%20Roblox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542758/Tix%20Pro%20%28for%20Roblox%29.meta.js
// ==/UserScript==

(function() {
'use strict';
const ROBUX_RATE_USD = 0.0035;
const CURRENCIES = {
    USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
    GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    CAD: { symbol: '$', name: 'Canadian Dollar', flag: '🇨🇦' },
    AUD: { symbol: '$', name: 'Australian Dollar', flag: '🇦🇺' }
};

function createTicker() {
    const tickerContainer = document.createElement('div');
    tickerContainer.id = 'rblx-ticker-container';
    tickerContainer.style.cssText = `position:fixed;top:15px;right:15px;background:rgba(30,30,30,0.95);border-radius:8px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.5);border:1px solid #3a3a3a;width:40px;height:40px;font-family:'Gotham SSm A','Gotham SSm B',Arial,sans-serif;cursor:move;transition:all 0.2s ease;overflow:hidden;display:flex;flex-direction:column;align-items:center;`;
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'rblx-toggle';
    toggleBtn.style.cssText = `width:100%;height:40px;display:flex;align-items:center;justify-content:center;position:relative;`;
    const logoContainer = document.createElement('div');
    logoContainer.id = 'rblx-logo-container';
    logoContainer.style.cssText = `display:flex;align-items:center;justify-content:center;width:24px;height:24px;cursor:pointer;`;
    const logoSvg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    logoSvg.setAttribute('width','24');
    logoSvg.setAttribute('height','24');
    logoSvg.setAttribute('viewBox','0 0 24 24');
    logoSvg.id = 'rblx-logo';
    logoSvg.style.cssText = 'transition:transform 0.2s;';
    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('x','2');
    rect.setAttribute('y','2');
    rect.setAttribute('width','20');
    rect.setAttribute('height','20');
    rect.setAttribute('rx','4');
    rect.setAttribute('fill','#00ff88');
    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x','12');
    text.setAttribute('y','12');
    text.setAttribute('text-anchor','middle');
    text.setAttribute('dominant-baseline','middle');
    text.setAttribute('font-size','14');
    text.setAttribute('font-weight','bold');
    text.setAttribute('fill','#1e1e1e');
    text.textContent = 'R';
    logoSvg.appendChild(rect);
    logoSvg.appendChild(text);
    logoContainer.appendChild(logoSvg);
    const title = document.createElement('span');
    title.id = 'rblx-title';
    title.textContent = 'Tix Pro';
    title.style.cssText = `display:none;font-size:14px;font-weight:bold;margin-left:5px;color:#00ff88;text-transform:uppercase;letter-spacing:0.5px;`;
    toggleBtn.appendChild(logoContainer);
    toggleBtn.appendChild(title);
    const content = document.createElement('div');
    content.id = 'rblx-content';
    content.style.cssText = `display:none;width:100%;padding:15px;`;
    const stockRow = document.createElement('div');
    stockRow.style.cssText = `display:flex;justify-content:space-between;margin-bottom:12px;`;
    const stockLabel = document.createElement('span');
    stockLabel.textContent = '$RBLX:';
    stockLabel.style.cssText = `font-size:14px;color:#b8b8b8;`;
    const stockValue = document.createElement('span');
    stockValue.id = 'rblx-stock-value';
    stockValue.textContent = 'Loading...';
    stockValue.style.cssText = `font-size:14px;font-weight:700;color:#fff;`;
    stockRow.appendChild(stockLabel);
    stockRow.appendChild(stockValue);
    const robuxRow = document.createElement('div');
    robuxRow.style.cssText = `display:flex;justify-content:space-between;margin-bottom:15px;`;
    const robuxLabel = document.createElement('span');
    robuxLabel.textContent = 'Robux:';
    robuxLabel.style.cssText = `font-size:14px;color:#b8b8b8;`;
    const robuxValue = document.createElement('span');
    robuxValue.id = 'rblx-robux-value';
    robuxValue.textContent = 'Loading...';
    robuxValue.style.cssText = `font-size:14px;font-weight:700;color:#fff;display:flex;align-items:center;`;
    const robuxCurrencyIcon = document.createElement('span');
    robuxCurrencyIcon.id = 'rblx-robux-currency';
    robuxCurrencyIcon.style.cssText = `margin-right:4px;font-size:12px;`;
    robuxValue.prepend(robuxCurrencyIcon);
    robuxRow.appendChild(robuxLabel);
    robuxRow.appendChild(robuxValue);
    const currencyRow = document.createElement('div');
    currencyRow.style.cssText = `display:flex;justify-content:space-between;align-items:center;margin-top:15px;padding-top:15px;border-top:1px solid #3a3a3a;`;
    const currencyLabel = document.createElement('span');
    currencyLabel.textContent = 'Currency:';
    currencyLabel.style.cssText = `font-size:13px;color:#b8b8b8;`;
    const currencySwitcher = document.createElement('div');
    currencySwitcher.id = 'rblx-currency-switcher';
    currencySwitcher.style.cssText = `display:flex;gap:8px;`;
    Object.keys(CURRENCIES).forEach(currency => {
        const flag = document.createElement('span');
        flag.textContent = CURRENCIES[currency].flag;
        flag.dataset.currency = currency;
        flag.style.cssText = `cursor:pointer;font-size:18px;transition:transform 0.2s;`;
        flag.addEventListener('click',function(e){e.stopPropagation();switchCurrency(currency);setTimeout(()=>location.reload(),300);});
        currencySwitcher.appendChild(flag);
    });
    currencyRow.appendChild(currencyLabel);
    currencyRow.appendChild(currencySwitcher);
    content.appendChild(stockRow);
    content.appendChild(robuxRow);
    content.appendChild(currencyRow);
    tickerContainer.appendChild(toggleBtn);
    tickerContainer.appendChild(content);
    document.body.appendChild(tickerContainer);
    makeDraggable(tickerContainer);
    logoContainer.addEventListener('click',function(e){e.stopPropagation();toggleDockedState(tickerContainer);});
    return{container:tickerContainer,stockValue,robuxValue,robuxCurrencyIcon,currencySwitcher};
}

function makeDraggable(element){
    let isDragging=false;let offsetX,offsetY;
    element.addEventListener('mousedown',function(e){
        if(e.target.id==='rblx-logo-container'||e.target.id==='rblx-logo'||e.target.tagName==='text')return;
        isDragging=true;
        offsetX=e.clientX-element.getBoundingClientRect().left;
        offsetY=e.clientY-element.getBoundingClientRect().top;
        element.style.cursor='grabbing';
        element.style.zIndex='10000';
        element.style.boxShadow='0 10px 30px rgba(0,0,0,0.5)';
        element.style.transition='none';
        e.preventDefault();
    });
    document.addEventListener('mousemove',function(e){
        if(!isDragging)return;
        const x=e.clientX-offsetX;
        const y=e.clientY-offsetY;
        const maxX=window.innerWidth-element.offsetWidth;
        const maxY=window.innerHeight-element.offsetHeight;
        element.style.left=Math.max(0,Math.min(maxX,x))+'px';
        element.style.top=Math.max(0,Math.min(maxY,y))+'px';
        element.style.right='auto';
        element.style.bottom='auto';
    });
    document.addEventListener('mouseup',function(){
        if(!isDragging)return;
        isDragging=false;
        element.style.cursor='move';
        element.style.zIndex='9999';
        element.style.boxShadow='0 4px 20px rgba(0,0,0,0.5)';
        element.style.transition='all 0.2s ease';
        GM_setValue('widgetPosition',{left:element.style.left,top:element.style.top,open:element.classList.contains('open')});
    });
}

function toggleDockedState(element){
    if(element.style.transition==='none')return;
    const savedPosition=GM_getValue('widgetPosition');
    let left=parseInt(savedPosition?.left||'15px',10);
    let top=parseInt(savedPosition?.top||'15px',10);
    if(element.classList.contains('open')){
        element.classList.remove('open');
        element.style.width='40px';
        element.style.height='40px';
        document.getElementById('rblx-content').style.display='none';
        const maxX=window.innerWidth-40;
        const maxY=window.innerHeight-40;
        left=Math.max(0,Math.min(maxX,left));
        top=Math.max(0,Math.min(maxY,top));
    }else{
        element.classList.add('open');
        element.style.width='250px';
        element.style.height='auto';
        document.getElementById('rblx-content').style.display='block';
        const maxX=window.innerWidth-250;
        const maxY=window.innerHeight-200;
        left=Math.max(0,Math.min(maxX,left));
        top=Math.max(0,Math.min(maxY,top));
    }
    element.style.left=left+'px';
    element.style.top=top+'px';
    element.style.right='auto';
    element.style.bottom='auto';
    element.style.cursor='move';
    GM_setValue('widgetPosition',{left:element.style.left,top:element.style.top,open:element.classList.contains('open')});
}

function fetchStockData(){
    return new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({method:"GET",url:"https://query1.finance.yahoo.com/v8/finance/chart/RBLX",onload:function(response){
            try{const data=JSON.parse(response.responseText);if(data.chart?.result?.[0]?.meta){const price=data.chart.result[0].meta.regularMarketPrice;const change=data.chart.result[0].meta.regularMarketChange;resolve({price,change});}else{reject('Invalid stock data response');}}catch(e){reject('Error parsing stock data: '+e.message);}},onerror:function(error){reject('Stock fetch error: '+error.statusText);},ontimeout:function(){reject('Stock fetch timeout');}});
    });
}

function fetchExchangeRates(){
    return new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({method:"GET",url:"https://api.exchangerate-api.com/v4/latest/USD",onload:function(response){
            try{const data=JSON.parse(response.responseText);if(data.rates){resolve(data.rates);}else{fetchExchangeRatesFallback().then(resolve).catch(reject);}}catch(e){fetchExchangeRatesFallback().then(resolve).catch(reject);}},onerror:function(error){fetchExchangeRatesFallback().then(resolve).catch(reject);},ontimeout:function(){fetchExchangeRatesFallback().then(resolve).catch(reject);}});
    });
}

function fetchExchangeRatesFallback(){
    return new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({method:"GET",url:"https://api.frankfurter.app/latest?from=USD",onload:function(response){
            try{const data=JSON.parse(response.responseText);if(data.rates){resolve(data.rates);}else{reject('No rates data in fallback API response');}}catch(e){reject('Error parsing fallback exchange rates: '+e.message);}},onerror:function(error){reject('Fallback exchange rate fetch error: '+error.statusText);},ontimeout:function(){reject('Fallback exchange rate fetch timeout');}});
    });
}

function switchCurrency(currency){
    GM_setValue('selectedCurrency',currency);
}

async function updateTicker(currency){
    const currencyData=CURRENCIES[currency]||CURRENCIES.USD;
    try{
        const[stockData,exchangeRates]=await Promise.all([fetchStockData(),fetchExchangeRates()]);
        const rate=exchangeRates[currency]||1;
        const stockValue=document.getElementById('rblx-stock-value');
        stockValue.textContent=`${(stockData.price*rate).toFixed(2)}`;
        stockValue.className=stockData.change>=0?'positive':'negative';
        const robuxValue=document.getElementById('rblx-robux-value');
        const robuxCurrencyIcon=document.getElementById('rblx-robux-currency');
        robuxValue.textContent=`${(ROBUX_RATE_USD*rate).toFixed(4)}`;
        robuxCurrencyIcon.textContent=currencyData.symbol;
        document.querySelectorAll('#rblx-currency-switcher span').forEach(flag=>{
            flag.style.opacity=flag.dataset.currency===currency?'1':'0.6';
            flag.style.transform=flag.dataset.currency===currency?'scale(1.2)':'scale(1)';
        });
    }catch(error){
        console.error('Tix Pro Error:',error);
        document.getElementById('rblx-stock-value').textContent='Error';
        document.getElementById('rblx-robux-value').textContent='Error';
        document.getElementById('rblx-stock-value').className='negative';
    }
}

function addStyles(){
    GM_addStyle(`
        .positive{color:#00ff88!important;}
        .negative{color:#ff4d4d!important;}
        #rblx-currency-switcher span:hover{transform:scale(1.2);opacity:0.9!important;}
        #rblx-logo-container:hover{transform:scale(1.1);}
        #rblx-ticker-container.open{width:250px;height:auto;padding-bottom:10px;}
        #rblx-ticker-container{transition:all 0.2s ease,box-shadow 0.2s ease;}
        #rblx-ticker-container:hover{transform:translateY(-3px);box-shadow:0 8px 25px rgba(0,0,0,0.6);}
        #rblx-ticker-container.open #rblx-title{display:inline-block;}
        .status-indicator{display:inline-block;width:10px;height:10px;border-radius:50%;margin-left:8px;vertical-align:middle;}
        .status-active{background-color:#00ff88;box-shadow:0 0 5px #00ff88;}
        .status-inactive{background-color:#ff4d4d;box-shadow:0 0 5px #ff4d4d;}
        #rblx-currency-switcher span{opacity:0.6;transition:all 0.2s ease;}
        #rblx-currency-switcher span:hover{opacity:0.9;}
    `);
}

async function init(){
    addStyles();
    const{container}=createTicker();
    const savedCurrency=GM_getValue('selectedCurrency','USD');
    const savedPosition=GM_getValue('widgetPosition');
    if(savedPosition){
        const left=parseInt(savedPosition.left,10);
        const top=parseInt(savedPosition.top,10);
        const maxX=window.innerWidth-(savedPosition.open?250:40);
        const maxY=window.innerHeight-(savedPosition.open?200:40);
        container.style.left=`${Math.max(0,Math.min(maxX,left))}px`;
        container.style.top=`${Math.max(0,Math.min(maxY,top))}px`;
        if(savedPosition.open){
            container.classList.add('open');
            container.style.width='250px';
            container.style.height='auto';
            document.getElementById('rblx-content').style.display='block';
        }
    }else{
        container.classList.remove('open');
        container.style.width='40px';
        container.style.height='40px';
        document.getElementById('rblx-content').style.display='none';
    }
    await updateTicker(savedCurrency);
}

init();
})();