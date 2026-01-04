// ==UserScript==
// @name         Mannco.Store - Item Page Enhancer
// @namespace    https://github.com/LucasHenriqueDiniz
// @version      0.3
// @description  Mannco Store Enhancer is a browser extension that enhances the Mannco Store website with a range of features to make your shopping experience more efficient and streamlined.
// @author       Lucas Diniz
// @license      MIT
// @match        *://mannco.store/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mannco.store
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/GM_config/1.6.0/gm_config.min.js

// @homepageURL  https://github.com/LucasHenriqueDiniz/Mannco.Store-Item_Page_Enhancer
// @supportURL   https://github.com/LucasHenriqueDiniz/Mannco.Store-Item_Page_Enhancer/issues
// @downloadURL https://update.greasyfork.org/scripts/463282/ManncoStore%20-%20Item%20Page%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/463282/ManncoStore%20-%20Item%20Page%20Enhancer.meta.js
// ==/UserScript==

(function () {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //def const DOMS
    const itemPriceBox = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7 > div.input-group.mb-3 > input");
    const quantityBox = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7 > div.form-group > input")
    const itemPriceBoxBox = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7")
    const pageSidebar = document.querySelector("#page-sidebar")

    let highestBuyOrder = Number(document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody > tr:nth-child(2) > td:nth-child(1)").textContent.slice(1))
    if (isNaN(highestBuyOrder)) {
        highestBuyOrder = 0.00
    }
    const itemPrice = parseFloat(document.querySelector("#content > div.row > div:nth-child(1) > div > div > span.important-text > span").textContent.slice(1))
    const quantidadeBuyOrders = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody").childElementCount - 1
    const moneyAvaible = parseFloat(document.querySelector("#account-dropdown > div > span.account-balance.ecurrency").textContent.replace('$','').trim())

    const parentDiv = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7 > div.input-group.mb-3")
    const firstItemConteiner = document.querySelector("#page-sidebar > div.card.mb-0 > div > div.item-info > ul > li:nth-child(1) > dl > dd").textContent
    const utmSource = '&utm_source=https://github.com/LucasHenriqueDiniz'

    const currency = 1 //1 = $ | 2 = £ | 3 Euro | 4 CHLF | 5 py6 | 6 polony | 7 R$
    const itemName = document.querySelector("#page-sidebar > div > div > div.card-item > h2 > span").textContent.trim()
    var appID = window.location.href.match(/(?<=\/)[0-9]{3,6}/g)
    if (appID != 440 && appID != 730 && appID != 252490 && appID != 570) {
        var dt = document.querySelectorAll('dt')
        if (dt[dt.length - 1].textContent === "SKU") {
            appID = 440;
            console.log(appID)
        } else if (dt[dt.length - 2].textContent === "Hero") {
            appID = 570;
            console.log(appID)
        } else if (dt.length === 2) {
            appID = 252490;
            console.log("lenght = 2 - appID = " + appID)
        } else if (dt.length === 4) {
            appID = 730;
            console.log(appID)
        } else {
            console.log("SKU NOT FOUND")
            appID = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Maps
    //  Translator appID -> gameName
    var gameIdMap = {
        440: 'tf2',
        730: 'csgo',
        252490: 'rust',
        570: 'dota2'
    }
    // Mapeamento de sites para links e imagens
    const siteMap = {
        'Tradeit.gg': {
            link: '',
            imgSrc: 'https://tradeit.gg/_nuxt/img/logo_horizontal.8189732.svg',
            fees: '5'
        },
        'Market CSGO': {
            link: '',
            imgSrc: 'https://i.imgur.com/SucZNHt.png',
            fees: '5'
        },
        'ShadowPay': {
            link: '',
            imgSrc: 'https://docs.shadowpay.com/images/logo.png',
            fees: '5'
        },
        'DMarket':{
            link: `https://dmarket.com/ingame-items/item-list/${gameIdMap[appID]}-skins?title=${encodeURIComponent(itemName)}`,
            imgSrc: 'https://cdn.freebiesupply.com/logos/large/2x/dmarket-logo-svg-vector.svg',
            fees: '3'
        },
        'Bitskins': {
            link: '',
            imgSrc: 'https://csgo-bets.org/wp-content/uploads/2021/07/bitskins.png',
            fees: '2'
        },
        'BUFF163': {
            link: '',
            imgSrc: 'https://i.imgur.com/OgdAZZ2.png',
            fees: '5'
        },
        'Mannco.store': {
            link: '',
            imgSrc: 'https://mannco.store/statics/img/logo.svg',
            fees: '5'
        },
        'Skinport': {
            link: '',
            imgSrc: 'https://docs.skinport.com/source/images/logo.png',
            fees: '0'
        },
        'Steam': {
            link: `https://steamcommunity.com/market/listings/${appID}/${itemName}`,
            imgSrc: 'https://logodownload.org/wp-content/uploads/2018/01/steam-logo-2.png',
            fees: '5'
        },
        'CSGOFloat': {
            link: '',
            imgSrc: 'https://csgofloat.com/assets/full_logo.png',
            fees: '5'
        },
        'WAXPEER': {
            link: '',
            imgSrc: 'https://globalcsgo.com/wp-content/uploads/2021/02/waxpeer-logo-1.png',
            fees: '5'
        },
        'GamerPay': {
            link: '',
            imgSrc: 'https://i.imgur.com/uaBBvGh.png',
            fees: '5'
        },
        'Lis Skins': {
            link: '',
            imgSrc: 'https://csgo.steamanalyst.com/images/lisskins-logo.png',
            fees: '5'
        },
        'SkinBid': {
            link: '',
            imgSrc: 'https://s3.eu-west-3.amazonaws.com/skinsnipe.com/img/common/logos/markets/logo-skinbid.png',
            fees: '5'
        },
        'SkinBaron': {
            link: '',
            imgSrc: 'https://tradeplz.com/wp-content/uploads/2016/06/skinbaron-logo.png',
            fees: '5'
        },
        'CS.DEALS': {
            link: '',
            imgSrc: 'https://cs.deals/pt/assets/media-kit/logo-horizontal-full.png',
            fees: '5'
        },
        'SWAP.GG': {
            link: '',
            imgSrc: 'https://blog.swap.gg/content/images/2019/04/logo.png',
            fees: '2'
        },
        'CS.MONEY': {
            link: '',
            imgSrc: 'https://assets.csgocaptain.com/cs-money.png',
            fees: '3'
        },
        'BUFF Market': {
            link: '',
            imgSrc: 'https://i.imgur.com/Wijajmv.png',
            fees: '2'
        },
        'BitSkins': {
            link: '',
            imgSrc: 'https://csgo-bets.org/wp-content/uploads/2021/07/bitskins.png',
            fees: '1'
        },
        'CS.TRADE': {
            link: '',
            imgSrc: 'https://cs.trade/images/page/cstrade-logo.png',
            fees: '2'
        },
        'LOOT.FARM': {
            link: `https://loot.farm/#skin=${appID}_${itemName}`,
            imgSrc: 'https://i.imgur.com/IQ5VVGr.png',
            fees: '2'
        },
        'TF2.tm': {
            link: '',
            imgSrc: 'https://i.imgur.com/VMONvM3.png',
            fees: '2'
        },
        /*
    '': {
        link: '',
        imgSrc: '',
        fees: ''
    },
*/
    };
    // create an array of objects with necessary information
    const items = [
        //{ imgSrc: '...', fees: '...', volume: '...', price: 10, link: '...' },
    ];
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //styles
    var title = 'font-weight: 700;font-size: 1.5rem;color: #fff;margin-bottom: 3px;-webkit-text-stroke-width: thin;'
    var text = 'font-weight: 700;font-size: 1.20rem;color: #fff;'
    //css STYLES
    const cssStyles = `
    .overlay {
        position: fixed;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        z-index: 9;
        display: none;
    }
    .whiteboard {
        display: inline-flex;
        position: fixed;
        top: 50%;
        left: 50%;
        height: 50%;
        text-align: start;
        font-size: 20px;
        font-weight: 700;
        transform: translate(-50%, -50%);
        padding: 10px;
        background: linear-gradient(45deg, #6197a3, #7db0bd);
        color: white;
        border-radius: 10px;
        align-items: left;
        white-space: nowrap;
        flex-direction: column;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        overflow-y: scroll;
        flex-wrap: nowrap;
        justify-content: flex-start;
        white-space: nowrap; box-shadow: 0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.5);
        margin-top: 20px;
     }
     .close-config-button {
        position: absolute;
        top: 5px;
        right: 10px;
        background-color: transparent;
        cursor: pointer;
     }
        @keyframes spinner {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(1080deg); }
        }
        .back-to-top {
            position: fixed;
            bottom: 20px;
            width: 50px;
            height: 50px;
            right: 1%;
            border: none;
            display: none;
            -webkit-text-stroke: thick;
            color: white;
            border-radius: 50%;
            background-color: rgb(50, 51, 81);
            font-size: 20px;
            text-align: center;
            box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);
            cursor: pointer;
  	        transform: translateY(0%);
  	        transition: ease-out 250ms;
	        transition-property: transform, background-color, text-decoration, color, display;
        }
	    .back-to-top.show {
	         display: block;
	    }

        .hover-full-button {
	    	transition-property: color,background-color,border-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,font-size;
		    transition-timing-function: cubic-bezier(.4,0,.2,1);
	    	transition-duration: .5s;

	        margin-top: 5%;
	        font-weight: 700;
	        font-size: 22px;
	        line-height: 25px;
	        box-sizing: border-box;
	        padding-bottom: 0.5rem;
	        padding-left: 1rem;
	        padding-right: 1rem;
            padding-top: 3px;
	        text-align-last: center;
	        background-color: rgba(255, 255, 255, 0);
	        text-align: center;
	        color: rgb(255, 255, 255);
	        outline: white;
	        outline-width: thin;
	        outline-style: auto;
	    	cursor: pointer;
            border-radius: 0.4em;
        }
       .hover-full-button:hover {
           background-color: rgba(255, 255, 255, 1);
           color: black;
           font-size: 23px;
        }
        #next-arrow {
           font-size: 50px;
           color: white;
           position: absolute;
           top: 50%;left: 7%;
           transition: ease-out 250ms;
           transition-property: transform, font-size, color, box-shadow, backgroundColor;
           transform: translate(-50%, -50%);
           border-radius: 2rem;
        }
       #next-arrow:target {
          transform: translate(-50%, -50%) scale(0.5);
       }
       #next-arrow:hover {
           transform: translate(-50%, -50%) scale(1.5);
           color: #2dc5e2;
       }
       .volume-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
          border-radius: 0rem 0rem 1rem 1rem;
          padding: 0px 0px 0px 0px;
          transition: ease-out 400ms;
          transition-property: all;
        }
        .volume-wrapper:hover {
          transform: scale(1.005);
          padding: 0px 5px 0px 5px;
          background-color: #5ad1e8;
        }
        .vertical-market {
            overflow-y: scroll;
            max-height: 425px;
            overflow-x: clip;
            margin-top: 5px;
            transition: height 200ms ease-out 0s;
        }
        .vertical-market::-webkit-scrollbar {
            width: 5px;
        }

        .vertical-market::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        .vertical-market::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 5px;
            border: 1px solid #555;
        }
        .vertical-market::-webkit-scrollbar-thumb {
            transition: all 0.3s ease-in-out;
        }
        .vertical-market::-webkit-scrollbar-thumb:hover {
            background-color: #555;
            transform: scale(1.2);
        }
        [id^="hide-arrow"] {
        }

        [id^="hide-arrow"]:hover {
           transform: scale(1.5) translateY(1.5px);
           color: rgba(255, 255, 255, 1)!important;
        }
        .button-configs {
           padding: 0.5rem 1rem;
           font-size: 0rem;
           font-weight: 700;
           color: white;
           transition: height 200ms ease-out 0s;
           transition-property: transform, font-size, color, width;
           vertical-align: middle;
           display: flex;
           align-items: center;
           justify-content: center;
           background-color: #38c8e3;
           border-color: #2dc5e2;
           line-height: 1.5;
           border-radius: 2rem;
           text-align: center;
           -webkit-appearance: button;
       }
       .button-configs:hover {
           background-color: #1ba6c1;
           border-color: #1ba6c1;
           font-size: 1rem;
       }

       [id^="scale-arrow"] {
           transition: height 200ms ease-out 0s;
           transition-property: transform;
        }

       [id^="scale-arrow"]:hover {
           transform: scale(1.25);
        }
        .config-header {
           display: flex;
           flex-direction: column;
        }
        .config-title {
            background-color: #323351;
            text-align: center;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 0px;
        }
        .config-ul {
          border-style: none groove groove groove;
          border-color: #323351;
          overflow-y: hidden;
          max-height: 0px;
          transition: 300ms ease-in-out 0s;
          transition-property: height, max-height;
          border-radius: 0rem 0rem 1rem 1rem;
        }

    `;

    const backToTopGoogleIcon = `
    font-size: 45;
    transform: rotate(-90deg);
    text-align: center;
    display: flex;
    justify-content: center;
    `
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(cssStyles));
    document.head.appendChild(style);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // GM settings
    // Objeto que armazena os valores de configuração
    const settings = GM_getValue('settings', {});
    // Função para criar uma checkbox com valor booleano
    const createCheckbox = (text, name, defaultValue, title, appendElement) => {
        // Cria a checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.title = title
        checkbox.checked = settings[name] ?? defaultValue;
        checkbox.style.marginRight = '10px';

        // Atualiza o valor da configuração correspondente quando a checkbox é clicada
        checkbox.addEventListener('change', () => {
            settings[name] = checkbox.checked;
            localStorage.setItem('settings', JSON.stringify(settings));
        });

        // Cria a label
        const label = document.createElement('label');
        label.innerText = text;
        label.style.fontSize = "calc(0.5em + 0.5vw)";
        label.title = title
        if (appendElement.children.length === 2) {
            label.style.marginTop = '4rem';
        }
        label.style.marginRight = '10px';
        label.style.marginBottom = '0.5rem';
        label.style.display = 'flex';

        const space = document.createElement('span');
        space.title = title
        space.style.marginRight = '10px'

        label.appendChild(space);
        label.appendChild(checkbox);

        appendElement.appendChild(label);

        // Retorna o valor da configuração correspondente à checkbox
        return checkbox.checked;
    }
    //create a selector using a funtion, define optins before!
    const selector = (text, options, defaultValue, appendElement, title, name) => {
        // Cria a div que contém a label e o select
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.title = title
        container.style.alignItems = 'center';
        container.style.marginBottom = '10px';

        // Cria a label
        const label = document.createElement('div');
        label.innerText = text;
        label.style.fontSize = "calc(0.5em + 0.5vw)";
        label.title = title
        if (appendElement.children.length === 2) {
            label.style.marginTop = '4rem';
        }
        label.style.marginRight = '10px';
        label.style.marginBottom = '0.5rem';
        label.style.display = 'flex';
        container.appendChild(label);

        // Cria o select
        const select = document.createElement('select');
        select.style.marginRight = '10px';
        select.name = name; // Define o nome do select como o nome da configuração

        // Adiciona as opções
        options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            select.add(optionElement);
        });

        // Recupera o valor da configuração correspondente do armazenamento local
        const savedValue = localStorage.getItem(name);

        // Seleciona o valor salvo ou o valor padrão
        select.value = savedValue ?? defaultValue;

        // Atualiza o valor da configuração correspondente quando a opção é selecionada
        select.addEventListener('change', () => {
            settings[name] = select.value;
            localStorage.setItem('settings', JSON.stringify(settings)); // Salva o objeto completo no armazenamento local
        });

        // Adiciona o select à div do container
        container.appendChild(select);

        // Adiciona a div do container ao elemento de destino
        appendElement.appendChild(container);

        // Recupera as configurações salvas do armazenamento local
        const savedSettings = JSON.parse(localStorage.getItem('settings'));
        if (savedSettings && savedSettings[name]) {
            // Se a configuração específica já foi salva, usa o valor salvo em vez do valor padrão
            select.value = savedSettings[name];
            settings[name] = savedSettings[name];
        } else {
            // Senão, usa o valor padrão e adiciona a configuração ao objeto
            settings[name] = defaultValue;
        }

        // Retorna o valor da configuração correspondente à opção selecionada
        return select.value;
    };
    //create a valuebox using a fucntion
    const createNumberInput = (text, name, defaultValue, minValue, title, appendElement) => {
        // Cria o input de número
        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.title = title;
        numberInput.value = settings[name] ?? defaultValue;
        numberInput.min = minValue;
        numberInput.style.marginRight = '10px';

        // Atualiza o valor da configuração correspondente quando o input é alterado
        numberInput.addEventListener('change', () => {
            settings[name] = Number(numberInput.value);
            localStorage.setItem('settings', JSON.stringify(settings));
        });

        // Cria a label
        const label = document.createElement('label');
        label.innerText = text;
        label.style.fontSize = "calc(0.5em + 0.5vw)";
        label.title = title
        if (appendElement.children.length === 2) {
            label.style.marginTop = '4rem';
        }
        label.style.marginRight = '10px';
        label.style.marginBottom = '0.5rem';
        label.style.display = 'flex';

        const space = document.createElement('span');
        space.title = title;
        space.style.marginRight = '10px';

        label.appendChild(space);
        label.appendChild(numberInput);

        appendElement.appendChild(label);

        // Retorna o valor da configuração correspondente ao input de número
        return Number(numberInput.value);
    }
    // Função para salvar as configurações
    const saveSettings = () => {
        console.log('saving...')
        console.log(GM_setValue('settings', settings))
        GM_setValue('settings', settings);
        Type.alert.success('Configs Updated','')
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //iziToast question function
    function showQuestionToast(title, onYes, onNo) {
        iziToast.question({
            timeout: 10000,
            transitionIn: 'bounceInUp',
            transitionOut: 'bounceInDown',
            layout: 1,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            backgroundColor: 'red',
            iconColor: 'white',
            titleSize: '25',
            titleColor: 'white',
            messageSize: '25',
            zindex: 999,
            title: title,
            closeOnEscape: true,
            message: '',
            position: 'center',
            buttons: [
                ['<button><b>YES</b></button>', function (instance, toast) {
                    onYes();
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true],
                ['<button>NO</button>', function (instance, toast) {
                    onNo();
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }],
            ],
            onClosing: function (instance, toast, closedBy) {
                console.info('Closing | closedBy: ' + closedBy);
            },
            onClosed: function (instance, toast, closedBy) {
                console.info('Closed | closedBy: ' + closedBy);
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Buttons FUnctions
    //refresh page
    function RefreshPage() {
        console.log('funcion called')
        window.location.reload();
    }
    // Função para adicionar 1 centavo à maior buy order
    function plusOneCent() {
        quantityBox.value = quantidade;
        itemPriceBox.value = (highestBuyOrder + 0.01).toFixed(2);
        Item.addBuyOrder()
        switch (RefreshAfterButton) {
            case true:
                window.location.reload();
                break;
            case false:
                break;
            default:
                console.log('error with the refreshAfter button', RefreshAfterButton)
        }

    }
    //function to calculate a profit from a buy order
    function calculateFees(x) {
        var valor = 0
        if (typeof x === 'string' && x.indexOf(',') !== -1) {
            valor = parseFloat(x.replace(',','.'))
        } else {
            valor = parseFloat(x)
        }

        if (valor <= 0.00) {
            return parseFloat(0.00)
        } else if (valor === 0.01) {
            return parseFloat(valor).toFixed(2)
        } else if (valor <= 0.10) {
            return parseFloat(valor - 0.01).toFixed(2)
        } else if (valor <= 0.20) {
            return parseFloat(valor - 0.02).toFixed(2)
        } else {
            return parseFloat(valor - (valor * 5/100)).toFixed(2)
        }
    }
    //
    function CheckLucro(BuyOrder) {
        let FixedOrder = parseFloat(BuyOrder).toFixed(2)
        var AfterFees = parseFloat(calculateFees(itemPrice));

        var profit = (AfterFees - FixedOrder).toFixed(2);
        console.log(FixedOrder, AfterFees, profit);
        return parseFloat(profit);
    }
    //function to update the value of the afterFees function
    function updateAfterFees() {
        var value = parseFloat(itemPriceBox.value);
        var afterFees = parseFloat(calculateFees(value)).toFixed(2);
        var profit = parseFloat(CheckLucro(value))
        let quantity = quantityBox.value
        if (quantityBox.value === '') {
            quantity = 1
        }

        var totalProfit = (profit * quantity).toFixed(2)

        // verificação do valor de afterFees
        if (isNaN(afterFees)) {
            afterFeesElement.textContent = "After fees: $NaN";
        } else {
            afterFeesElement.textContent = `After fees: ${afterFees}`
            afterFeesElement.title = `Basically, the fees are calculated as follows: for amounts greater than 0.10, a fee of -0.01 is applied; for amounts greater than 0.20, a fee of -0.02 is applied; for amounts less than 0.20, a fee of -5% is applied`;
        }
        if (isNaN(profit)) {
            ProfitElement.textContent = "Profit: $NaN"
        } else {
            ProfitElement.textContent = `Profit - One: ${profit}, Total: ${totalProfit}`
            ProfitElement.title = `The profit is calculated by \nsubtracting the fees (after fees = ${calculateFees(itemPrice)}) and your buy order (${value}) from the current selling price (${itemPrice}),\n and then multiplying the result by the current quantity (${quantity}). This gives the total profit (${profit}).`;
        }
    }
    //adds a function for just one cent
    function justOneCentFunction() {
        itemPriceBox.value = 0.01
        try {
            quantidade = customQuantityJustOneCent;
        } catch (err) {
            quantidade = 50
            console.log('error with customQuantityJustOneCent, value:', customQuantityJustOneCent)
        }
        switch (ajustWithAvaibleMoney) {
            case true:
                // Verifica se é necessário diminuir a quantidade
                if ((0.01) * quantidade > moneyAvaible) {
                    quantidade = Math.floor(moneyAvaible / (0.01));
                }
                break;
            case false:
                break;
            default:
                console.log('error with ajustWithAvaibleMoney, value:', ajustWithAvaibleMoney)

        }
    }
    //function to a loading circle
    function loadingCircle(element) {

        var loader = document.createElement('div');
        // add the "loader" class to the div element
        loader.classList.add('loader');
        loader.id = 'loadingCircle'

        // set the styles for the loader
        loader.style.margin = 'auto';
        loader.style.border = '5px solid #5ad1e8';
        loader.style.borderRadius = '50%';
        loader.style.borderTop = '5px solid #0f111e';
        loader.style.width = '25px';
        loader.style.height = '25px';
        loader.style.animation = 'spinner 4s linear infinite';
        element.appendChild(loader);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // GOOGLE ICONS
    //Adds google icons to the page
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0';
    document.head.appendChild(link);
    // function to create a google icon and append to the element
    function googleIcon(iconName,IDname , element, cssStyle) {
        //iconName the name of the icon 'navigate_next, navigate_before'
        //iconSize the size of the icon "INT"
        //element = where you want the icon to be appeneded
        const icon = document.createElement('span');
        if (cssStyle != 'none' && cssStyle != 0) {
            icon.style.cssText = cssStyle
        }
        icon.classList.add('icon-asset', 'material-symbols-outlined');
        icon.id = IDname
        icon.textContent = iconName.toLowerCase()
        element.appendChild(icon);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  APICALLS functions
    //add decimal 420 -> 4.20 699 -> 6.99
    function addDecimal(num) {
        // Converte o número em uma string
        let numStr = num.toString();

        // Adiciona um zero à esquerda se o número for menor do que 100
        if (numStr.length < 3) {
            numStr = '0' + numStr;
        }

        // Insere um ponto duas casas à esquerda do final da string
        let resultStr = numStr.slice(0, -2) + '.' + numStr.slice(-2);

        // Converte a string resultante de volta em um número e retorna
        return parseFloat(resultStr);
    }
    //
    function createRow(imgSrc, fees, volume, price, link) {
        let marketRow = document.createElement('div');
        marketRow.style.cssText = `
           align-items: center;
           position: relative;
           background: rgb(51, 51, 81);
           border-radius: 1rem;
           width: 100%;
           margin-bottom: 4px!important;
           margin-right: 0!important;
           padding: 0;
           margin: 12px 0;
           `;

        let imgHolder = document.createElement('div');
        imgHolder.style.display = 'flex';
        imgHolder.style.justifyContent = 'center';
        marketRow.appendChild(imgHolder)

        let icon = document.createElement('img');
        icon.src = imgSrc;
        icon.style.maxWidth = '80%';
        icon.style.maxHeight = '80px';
        icon.style.paddingTop = '10px';
        imgHolder.appendChild(icon);

        let feesValue = document.createElement('div');
        feesValue.innerText = fees + "%";
        feesValue.style.fontSize = '16px';
        feesValue.style.padding = '0px 0px 0px 10px';
        feesValue.style.color = 'white';
        feesValue.style.display = 'flex';
        feesValue.style.flexDirection = 'column';
        feesValue.style.justifyContent = 'center';
        feesValue.title = "This value is the current fees from the marketplace";
        imgHolder.appendChild(feesValue);

        googleIcon('Info', 'back-arrow', feesValue, 'font-size: 15px; margin-left: 3px; color: #9EA7B3')

        let divider = document.createElement('hr');
        divider.style.border = 'none';
        divider.style.borderTop = '1px solid rgba(16,24,34,.5)';
        divider.style.marginTop = '8px';
        divider.style.marginBottom = '0px';
        marketRow.appendChild(divider);

        let priceVolumeWrapper = document.createElement('div');
        priceVolumeWrapper.className = 'volume-wrapper'
        priceVolumeWrapper.addEventListener('click', function() {
            //ex -> `https://steamcommunity.com/market/listings/${appID}/${encodeURIComponent(itemName)}`;
            window.open(link)
        })

        marketRow.appendChild(priceVolumeWrapper);

        let itemVolume = document.createElement('div');
        itemVolume.innerText = volume + " available";
        itemVolume.style.fontSize = '16px';
        itemVolume.style.color = 'white';
        itemVolume.style.padding = '0px 15px 15px 15px'
        itemVolume.style.display = 'flex'
        itemVolume.style.flexDirection = 'column-reverse'
        priceVolumeWrapper.appendChild(itemVolume);

        let buy = document.createElement('span');
        buy.innerText = "Buy";
        buy.style.fontSize = '12px';
        buy.style.color = '#3b84af';
        buy.style.marginRight = '5px';
        buy.style.margiTop = '5px';
        buy.style.transform = 'translateY(10%)';
        itemVolume.appendChild(buy);

        let itemPrice = document.createElement('div');
        itemPrice.innerText = price;
        itemPrice.style.fontSize = '24px';
        itemPrice.style.fontWeight = 'bold';
        itemPrice.style.color = 'white';
        itemPrice.style.padding = '10px 15px 15px 0px'
        itemPrice.style.display = 'flex';
        itemPrice.style.flexDirection = 'row-reverse';
        itemPrice.style.alignItems = 'flex-end';
        priceVolumeWrapper.appendChild(itemPrice);

        let from = document.createElement('span');
        from.innerText = "from";
        from.style.fontSize = '12px';
        from.style.color = '#3b84af';
        from.style.transform = 'translateY(-15%)';
        from.style.marginRight = '5px';
        itemPrice.appendChild(from);


        verticalMarkets.appendChild(marketRow);
    }
    //WEBSCRAPPER
    async function webScrapping(name, url, mode, volumeElement, priceElement) {
        return new Promise(resolve => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: async function(response) {
                    let parser = new DOMParser();
                    let htmlDocument = parser.parseFromString(response.responseText, "text/html");
                    console.log(`Requesting value for ${name}`)

                    let volume = null;
                    let price = null;
                    let link = null;
                    let count = 0;

                    const intervalId = setInterval(async function() {
                        if (count < 5) {
                            console.log(`${name} | waiting to load...`)
                            if (htmlDocument.querySelector(priceElement)) {
                                console.log(`${name} | price element check pass`)
                                switch (mode) {
                                    case 'count':
                                        volume = htmlDocument.querySelectorAll(volumeElement).length
                                        break;
                                    case 'text':
                                        volume = volumeElement.textContent
                                        break;
                                    case 'command':
                                        volume = volumeElement
                                        break;
                                    case 'children':
                                        volume = volumeElement.children.length
                                        break;
                                    default:
                                        console.log(`\n \u001b[31m ${name} | Not a valid mode, please use "count" to count how many child elements, "text" to take an textContent from the elemnet and 'command' to use a command  \n`)
                                        break;
                                }
                                let test = htmlDocument.querySelector(priceElement);

                                try{
                                    price = test.textContent.replaceAll('\n', '').trim()
                                }
                                catch (err) {
                                    console.log(`\n \u001b[31m ${name} | error with the price element in the webscrapping of the site ${name} \n`)
                                }
                                link = url + utmSource
                                if (price) {
                                    console.log(`${name} - Encontrado! O item "${itemName}" custa: ${price} | volume: ${volume}`);
                                    const { imgSrc, fees } = siteMap[name]
                                    items.push({
                                        imgSrc,
                                        fees,
                                        volume,
                                        price,
                                        link
                                    });
                                    displayItems()
                                } else {
                                    console.log("\n O item não foi encontrado na lista de resultados. \n");
                                }
                                clearInterval(intervalId)
                            }
                            count++;
                        } else {
                            clearInterval(intervalId);
                            console.log(`\n \u001b[31m give up in the webscrapping of the site ${name} \n`)
                            console.log('url : ', url)
                            console.log('priceElem: ', priceElement)
                            console.log('volumeElem: ', volumeElement)
                        }
                    }, 10000);
                    resolve();
                },
                onerror: function(error) {
                    console.error(error);
                    resolve();
                }
            });
        });
    }
    //Create a row using items arr
    function displayItems() {
        const verticalMarket = document.querySelector(".vertical-market")

        console.log('Updating items arr and display box')

        document.querySelector("#page-sidebar > div.vertical-market").innerHTML = "";

        items.sort((a, b) => parseFloat(a.price.replace('$','').trim()) - parseFloat(b.price.replace('$','').trim()));

        items.forEach(item => {
            createRow(item.imgSrc, item.fees, item.volume, item.price, item.link);
        });

        if (verticalMarket.children >= 3) {
            verticalMarket.style.maxHeight = verticalMarket.children[0].clientHeight + verticalMarket.children[1].clientHeight + verticalMarket.children[2].clientHeight + 10 * 3 + 'px'
        }

        if (verticalMarket.children.length === 4 && !document.querySelector("#hide-arrow\\ markets")) {
            console.log('3 children')

            var colapseButton = document.createElement('div')
            pageSidebar.appendChild(colapseButton)
            googleIcon('expand_more', 'hide-arrow markets' , colapseButton, 'font-size: 50px; transition: height 200ms ease-out 0s; transition-property: transform, color; color: rgba(0,0,0,0.5);}')

            colapseButton.addEventListener('click', () => {
                if (itemHideButton.dataset.value === "off") {
                    itemHideButton.dataset.value = "on";
                    document.querySelector("#hide-arrow\\ markets").innerHTML = 'expand_more'
                    itemHideButton.title = "Colapse markets box";
                    document.querySelector("#page-sidebar > div.vertical-market").style.maxHeight = verticalMarket.children[0].clientHeight + verticalMarket.children[1].clientHeight + verticalMarket.children[2].clientHeight + 10 * 3 + 'px';
                } else {
                    itemHideButton.dataset.value = "off";
                    document.querySelector("#hide-arrow\\ markets").innerHTML = 'expand_less'
                    itemHideButton.title = "Hide markets box";
                    document.querySelector("#page-sidebar > div.vertical-market").style.maxHeight = '5000px';
                }
            })
        }
    }
    //DMarket
    function DMarketAPI() {
        const apiUrl = `https://api.dmarket.com/exchange/v1/market/items?gameId=${gameIdMap[appID]}&limit=100&title=${encodeURIComponent(itemName)}&currency=USD&bestPrice=true&orderBy=price&orderDir=asc`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            console.log('Requesting value for DMarket');

            let volume = null;
            let price = null;

            const { imgSrc, fees, link } = siteMap["DMarket"];
            const { objects } = data;
            volume = objects.length;
            price = `$${addDecimal(objects[0].price.USD)}`;

            if (volume || price) {
                console.log(`DMakert | Encontrado! O item "${itemName}" custa: ${price} | volume: ${volume}`);
                items.push({
                    imgSrc,
                    fees,
                    volume,
                    price,
                    link
                });
                displayItems();
            } else {
                console.log(`\n \u001b[31m Dmarket | problem finding the price for DMkaret \n`)
            }
        })
            .catch(error => console.error(error));
    }
    //SWAP.GG
    function SwapGGAPI () {
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://market-api.swap.gg/v1/pricing/lowest?appId=${appID}`,
            onload: function(response) {
                const obj = JSON.parse(response.responseText);
                console.log('Requesting Swap.gg item price')

                // Converter o objeto JSON em um array JSON
                let arr = Object.entries(obj.result);

                // Encontrar o primeiro item que corresponde ao critério de pesquisa
                let result = arr.find(([name]) => name.includes(itemName));

                // Verificar se o item foi encontrado e obter suas propriedades
                if (result) {
                    let [name, { price, quantity, link }] = result;

                    // Formatar o preço como uma string com separador de milhares e casas decimais
                    let formattedPrice = String(`$` + addDecimal(price));
                    let fullLink = link + utmSource
                    console.log(`SWAP.GG | Encontrado! O item "${name}" custa: ${formattedPrice} | volume: ${quantity} | link: ${link}`);

                    // Adicionar o item à lista de itens e exibir a lista
                    let { imgSrc, fees } = siteMap["SWAP.GG"];
                    items.push({
                        imgSrc,
                        fees,
                        volume: quantity,
                        price: formattedPrice,
                        link: fullLink
                    });
                    displayItems();
                } else {
                    console.log(`\n \u001b[31m SWAP.GG | problem finding the price for SWAP.gg \n`)
                }
            }
        });
    }
    //SkinportAPI
    function SkinportAPI() {
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://api.skinport.com/v1/items?app_id=${appID}&currency=USD&tradable=0`,
            responseType: "json",
            onload: function(response) {

                const obj = JSON.parse(response.responseText);
                // Converter o objeto JSON em um array JSON
                console.log("Requesting Skinport items");

                let volume = null
                let price = null
                let link = null

                const filteredResults = obj.filter(item => item.market_hash_name === itemName);

                volume = filteredResults[0].quantity
                price = filteredResults[0].min_price
                link = filteredResults[0].market_page + utmSource

                console.log(volume, price, link)
                console.log(filteredResults)
                const { imgSrc, fees } = siteMap["Skinport"];

                if (price || volume) {
                    console.log(`Skinport | Encontrado! O item ${itemName} custa: $${price} | volume: ${volume} | link: ${link}`);
                    items.push({
                        imgSrc,
                        fees,
                        volume,
                        price: '$' + price,
                        link
                    });
                    displayItems();

                } else {
                    console.log(`\n \u001b[31m Skinport | Problem finding the price for Skinport \n`)
                }
            },
            onerror: function(error) {
                console.error(error);
            }
        });
    }
    //CSTRADE
    function CSTRADE() {
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://cdn.cs.trade:8443/api/getInventoryCmp?order_by=price_desc&bot=all`,
            responseType: "json",
            onload: function(response) {
                const obj = JSON.parse(response.responseText).inventory;
                // Converter o objeto JSON em um array JSON
                console.log("Requesting CS.trade items");

                let link = `https://cs.trade/?sort_by=price_asc&market_name=${itemName}` + utmSource

                let result = obj.find(item => item.n === itemName);
                let price = result ? result.p : null;
                let volume = obj.reduce((count, item) => item.n === itemName ? count + 1 : count, 1);


                const { imgSrc, fees } = siteMap["CS.TRADE"];

                if (price) {
                    let formattedPrice = price.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2})
                    console.log(`CS.TRADE | Encontrado! O item ${itemName} custa: $${price} | volume: ${volume} | link: ${link}`);
                    items.push({
                        imgSrc,
                        fees,
                        volume,
                        price: formattedPrice,
                        link
                    });
                    displayItems();

                } else {
                    console.log("CS.TRADE | O item não foi encontrado na lista de resultados.");
                }
            },
            onerror: function(error) {
                console.error(error);
            }
        });
    }
    //LOOTFARM api
    function LOOTFARM() {
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://loot.farm/botsInventory_${appID}.json`,
            onload: function(response) {
                // Analisa a resposta em JSON
                let obj = Object.values(JSON.parse(response.responseText).result);
                // Imprime os dados no console
                let result = obj.find(item => item.n === itemName);
                let price = result ? result.p : null;
                let arrayCount = 0;
                let volume = 0;

                for (let key in result.u) {
                    let value = result.u[key];
                    if (Array.isArray(value)) {
                        arrayCount++;
                        volume += value.length;
                    }
                }

                console.log("LOOT.FARM | Soma dos comprimentos dos arrays em u:", volume);
                let formattedPrice = `$${addDecimal(price)}`;

                const { imgSrc, fees } = siteMap["LOOT.FARM"];

                if (price) {
                    console.log(`LOOT.FARM |Encontrado! O item ${itemName} custa: $${price} | volume: ${volume} | link: ${link}`);
                    items.push({
                        imgSrc,
                        fees,
                        volume,
                        price: formattedPrice,
                        link
                    });
                    //displayItems();

                } else {
                    console.log(`\n \u001b[31m LOOT.FARM | Problem finding the price for LOOT.FARM \n`)
                }
            },
            onerror: function(error) {
                console.error(error);
            }
        });
    }
    //Reqeust steam prices
    function SteamAPI() {
        var apiLink = `https://steamcommunity.com/market/priceoverview/?appid=${appID}&currency=${currency}&market_hash_name=${encodeURIComponent(itemName)}`
        GM.xmlHttpRequest({
            method: "GET",
            url: apiLink,
            responseType: "json",
            onload: function (response) {
                var obj = JSON.parse(response.responseText);
                let volumeSteam = obj.volume ? obj.volume : 0;
                let lowestPriceSteam = obj.lowest_price ? obj.lowest_price : null;

                const { imgSrc, fees, link } = siteMap["Steam"];

                if (lowestPriceSteam) {
                    console.log(`Encontrado! O item "${itemName}" custa: ${lowestPriceSteam} | volume: ${volumeSteam}`);
                    items.push({
                        imgSrc,
                        fees,
                        volume: volumeSteam,
                        price: lowestPriceSteam,
                        link
                    });
                    displayItems();
                } else {
                    console.log("O item não foi encontrado na lista de resultados.");
                }
            }
        });
    }
    ////WEB-SCRAPPERS
    //TRade it GG
    async function TradeITgg() {
        await webScrapping('Tradeit.gg', `https://tradeit.gg/${gameIdMap[appID]}/store?search=${encodeURIComponent(itemName)}&aff=SIH`, 'text', "#siteInventoryContainer .item-details .flex span", "#siteInventoryContainer .store-price-wrapper .price")
    }
    //BITSKINS
    async function Bitskins() {
        await webScrapping('Bitskins', `https://bitskins.com/?market_hash_name=${encodeURIComponent(itemName)}&advanced=1&appid=${appID}&show_trade_delayed_items=0&sort_by=bumped_at&sort_by=price&order=asc`, 'count',".col-lg-3.col-md-4.col-sm-5.col-xs-12.item-solo", "body > div:nth-child(10) > div > div:nth-child(3) > div > div > div:nth-child(1) > div > div.item-icon.lazy > h5 > span")
    }

    //Call for csgoskins.
    function requestCsgoSkins() {
        // Criando um objeto com as informações de float e seus respectivos links
        const floatMap = {
            'Factory New': 'factory-new',
            'Minimal Wear': 'minimal-wear',
            'Field-Tested': 'field-tested',
            'Well-Worn': 'well-worn',
            'Battle-Scarred': 'battle-scarred'
        };

        function getFloat(itemName) {
            for (let float in floatMap) {
                if (itemName.includes(float)) {
                    return floatMap[float];
                }
            }
        }

        const result = [];
        let float = getFloat(itemName);
        let link = `https://csgoskins.gg/items/${itemName.replace(' |', '').replace(/StatTrak™ ?/, '').replace(/\(.*\)/, '').replace(/★ /, '').trim().replace(/ /g, '-').toLowerCase()}/`;

        if ((itemName.includes('StatTrak™'))) {
            link += 'stattrak-'
        }

        if (float) {
            link += `${float}`;
        }
        GM.xmlHttpRequest({
            method: 'GET',
            url: link,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                const elements = doc.querySelectorAll('.my-4');
                const offerNodes = Array.from(elements).filter(el => el.tagName != 'BUTTON');


                offerNodes.forEach(offer => {
                    const site = offer.querySelector('.w-1\\/2.sm\\:w-1\\/4.p-4.flex-none').firstElementChild.textContent.trim();
                    const activeOffers = offer.querySelector('.w-1\\/4.p-4.flex-none.hidden.sm\\:block').lastElementChild?.textContent?.trim() || "N/A";
                    const price = offer.querySelector(".font-bold.text-xl").textContent.trim();

                    result.push({
                        site,
                        activeOffers,
                        price
                    });
                });
                console.log(result)
                const rows = result.map(({ site, activeOffers, price }) => {
                    const { link, imgSrc, fees } = siteMap[site] || {}; // Obter o link e imagem correspondentes
                    const volume = activeOffers;
                    //return createRow(imgSrc, fees, volume, price, link); // Chamar a função createRow com os valores apropriados
                    items.push({
                        imgSrc,
                        fees,
                        volume,
                        price,
                        link
                    });
                    displayItems()
                });
            },
            onerror: function(error) {
                console.error(error);
            }
        });
    }



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // make the extenion button for configs
    document.querySelector("#content > h2").style.display = 'flex';
    document.querySelector("#content > h2").style.justifyContent = 'space-between';
    let ItemPageConfigsButton = document.createElement('button');
    ItemPageConfigsButton.className = "button-configs";
    ItemPageConfigsButton.textContent = "Item Page Enhancer Configs";
    ItemPageConfigsButton.title = "Open configuration menu for the extension (item page enhancer)"
    //gear icon
    googleIcon('Settings','scale-arrow settings' , ItemPageConfigsButton, 'font-size: 2rem; padding: 5px')
    document.querySelector("#content > h2").appendChild(ItemPageConfigsButton);
    ItemPageConfigsButton.addEventListener('click', () => {
        showOverlay()
    })

    //create a black overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay'
    document.body.appendChild(overlay);

    //creates que whiteboard for all the elements be shown
    const whiteboard = document.createElement('div');
    whiteboard.className = 'whiteboard';
    overlay.appendChild(whiteboard);

    //Title
    const ConfigTitle = document.createElement('h2');
    ConfigTitle.textContent = 'Mannco.Store - Item Page Enhancer';
    whiteboard.appendChild(ConfigTitle);

    //clsoe button for the whiteboard
    const closeButton = document.createElement('span');
    googleIcon('Close','scale-arrow close' , closeButton, 'font-size: 2rem; color: red')
    closeButton.className = 'close-config-button'
    whiteboard.appendChild(closeButton)
    closeButton.addEventListener('click', function () {
        hideOverlay();
        saveSettings()
        showQuestionToast(
            'Refresh the page? (recommended)',
            RefreshPage,
            function() {
                console.log('NO clicked');
            }
        );
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Configs Options

    function addColapse(button, element) {
        var colapseButton = document.querySelector(button)
        var heightElem = document.querySelector(element)

        colapseButton.addEventListener('click', () => {
            if (colapseButton.dataset.value === "off") {
                colapseButton.dataset.value = "on";
                colapseButton.style.transform = 'rotate(0deg)';
                colapseButton.title = "Expand Menu";
                heightElem.style.maxHeight = ''
            } else {
                colapseButton.dataset.value = "off";
                colapseButton.style.transform = 'rotate(90deg)';
                colapseButton.title = "Hide menu";
                heightElem.style.maxHeight = '1000px'
            }
        })
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    //BUTTONS
    const BuyOrderButtons = document.createElement('div')
    BuyOrderButtons.className = 'config-header buyorder-buttons'
    whiteboard.appendChild(BuyOrderButtons)


    const ulBuyOrderButtons = document.createElement('ul');
    ulBuyOrderButtons.className = 'config-ul buyorder-buttons'

    // cria um cabeçalho para page configs
    const headerButtonBuyOrder = document.createElement('h4');
    headerButtonBuyOrder.className = 'config-title buyorder-buttons'
    headerButtonBuyOrder.textContent = 'BuyOrder buttons';
    BuyOrderButtons.appendChild(headerButtonBuyOrder)


    const BoB1 = document.createElement('li');
    const BoB2 = document.createElement('li');
    const BoB3 = document.createElement('li');
    ulBuyOrderButtons.appendChild(BoB1)
    ulBuyOrderButtons.appendChild(BoB2)
    ulBuyOrderButtons.appendChild(BoB3)
    // adiciona o ul de page configs ao elemento whiteboard
    BuyOrderButtons.appendChild(ulBuyOrderButtons);

    googleIcon('chevron_right','scale-arrow buttons-colapse' , headerButtonBuyOrder, 'font-size: 2.5rem')
    addColapse("#scale-arrow\\ buttons-colapse", ".config-ul.buyorder-buttons")

    //buttons
    const Add1CentButton = createCheckbox('"Boost Order" button: ', '+1cent', true, 'Adds a button to automatically create a buy order for the highest value plus 0.01 cents.', BoB1);
    const AddJustOneCentButton = createCheckbox('"Buy for One Cent" button: ', 'JustOneCent', false, '"Adds a button to automatically create a buy order for 0.01 cents.', BoB2);
    const AddMatchButton = createCheckbox('"Create Matching Order" button: ', 'MatchBuyOrder', false, '"Adds a button to automatically create a buyorder with the same value as the highest buy order', BoB3);
    //////////////////////////////////////////////////////////////////////////////////////////
    //BUTTON CONFIGS
    const ButtonsConfigsDiv = document.createElement('div')
    ButtonsConfigsDiv.className = 'config-header buttons-config'
    whiteboard.appendChild(ButtonsConfigsDiv)
    // cria outro elemento ul para button configs
    const ulButtonConfigs = document.createElement('ul');
    ulButtonConfigs.className = 'config-ul buttons-config'
    // cria um cabeçalho para button configs
    const headerButtonConfigs = document.createElement('h4');
    headerButtonConfigs.className = 'config-title buttons-config'
    headerButtonConfigs.textContent = 'Button Configs';
    const BC1 = document.createElement('li');
    const BC2 = document.createElement('li');
    const BC3 = document.createElement('li');
    const BC4 = document.createElement('li');
    const BC5 = document.createElement('li');
    const BC6 = document.createElement('li');
    const BC7 = document.createElement('li');
    const BC8 = document.createElement('li');

    ButtonsConfigsDiv.appendChild(headerButtonConfigs)
    ulButtonConfigs.appendChild(BC1)
    ulButtonConfigs.appendChild(BC2)
    ulButtonConfigs.appendChild(BC3)
    ulButtonConfigs.appendChild(BC4)
    ulButtonConfigs.appendChild(BC5)
    ulButtonConfigs.appendChild(BC6)
    ulButtonConfigs.appendChild(BC7)
    ulButtonConfigs.appendChild(BC8)

    ButtonsConfigsDiv.appendChild(ulButtonConfigs);

    googleIcon('chevron_right','scale-arrow configs-colapse' , headerButtonConfigs, 'font-size: 2.5rem')
    addColapse("#scale-arrow\\ configs-colapse", ".config-ul.buttons-config")
    //buttons organize and configs
    const OrganizeButtons = createCheckbox('Organize buttons layout: ', 'OrganizeButtons', true, 'Changes the layout for the buttons making better ( in my opnion )', BC1); // in future more options nad make a selection box
    const RefreshAfterButton = createCheckbox('Auto Refresh page after +1cent/JustOneCent/MatchBuyOrder click: ', 'Refresh+1andJust', false,'Automatically refreshes the page after clicking the Boost Order, Buy for One Cent, or Match Buy Order buttons, to ensure that the buy order has been added or updated.', BC2);
    const OnKeyPress1Cent = createCheckbox('Activate +1cent feature on keypress: ', '1CentOnKeyPress', false,'In Development', BC3);
    const OnKeyPressJustOneCent = createCheckbox('Activate JustOneCent feature on keypress: ', 'JustOneCentOnKeyPress', false,'In Development', BC4);
    const customQuantity1Cent = createNumberInput('Custom "Boost Order" BuyOrder quantity: ', 'customQuantity1Cent', '0', '0', 'Enables customization of the quantity for buy orders from the "Boost Order" button. The default values are: 20 for 0.02 or less, 10 for 0.05 or less, 5 for 3.00 or less, and 1 for prices above that. Entering a value will make all buy orders have the same quantity, independent of the item price. ( 0 = default )', BC5)
    const customQuantityJustOneCent = createNumberInput('Custom "Buy for One Cent" BuyOrder quantity: ', 'customQuantityJustOneCent', '50', '0', 'Enables customization of the quantity for buy orders from the "Boost Order" button. The default value is (50) entering a value will make all buy orders have that quantity', BC6)
    const customQuantityMatchingOrder = createNumberInput('Custom "Create Matching Order" BuyOrder quantity: ', 'customQuantityMatchingBuyOrder', '10', '0', 'Enables customization of the quantity for buy orders from the "Create Matching Order" button. The default value is (10) entering a value will make all buy orders have that quantity', BC7)
    const ajustWithAvaibleMoney = createCheckbox('Automatically adjust the buy order quantity based on the available funds in the wallet: ', 'ajustWithAvaibleMoney', true, 'Automatically adjust the buy orders from the buttons based on the available funds in the wallet. For example, if you have $5.00 in your wallet and the buy order is for 10 items at $1.00 each, the order will be adjusted to 5 items.', BC8)

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //page configuration
    const pageConfigDiv = document.createElement('div')
    pageConfigDiv.className = 'config-header page-config'
    whiteboard.appendChild(pageConfigDiv)
    // cria outro elemento ul para button configs
    const ulPageConfig = document.createElement('ul');
    ulPageConfig.className = 'config-ul page-config'
    // cria um cabeçalho para button configs
    const headerPageConfig = document.createElement('h4');
    headerPageConfig.className = 'config-title page-config'
    headerPageConfig.textContent = 'Misc page configuration';
    const PG1 = document.createElement('li');
    const PG2 = document.createElement('li');
    const PG3 = document.createElement('li');
    const PG4 = document.createElement('li');
    const PG5 = document.createElement('li');
    const PG6 = document.createElement('li');
    const PG7 = document.createElement('li');
    const PG8 = document.createElement('li');

    pageConfigDiv.appendChild(headerPageConfig)
    ulPageConfig.appendChild(PG1)
    ulPageConfig.appendChild(PG2)
    ulPageConfig.appendChild(PG3)
    ulPageConfig.appendChild(PG4)
    ulPageConfig.appendChild(PG5)
    ulPageConfig.appendChild(PG6)
    ulPageConfig.appendChild(PG7)
    ulPageConfig.appendChild(PG8)

    pageConfigDiv.appendChild(ulPageConfig);

    const ChangeBackGroundForNoBuyOrderOptions = ['Red/Green Background', 'Red/Green border', 'none'];
    const ChangeBackGroundForNoBuyOrder = selector("Changes buy orders background if no matching buy order: ", ChangeBackGroundForNoBuyOrderOptions, "Red/Green Background", PG1,'Select between a Red/Green border, Red/Green background, or none. The chosen selection will create a green or red highlight depending on whether you have the highest buy order (green) or not (red).' ,"ChangeBackGroundForNoBuyOrderOptions");
    const backToTheTopButton = createCheckbox('Add a button to go to the top of the page: ', 'backToTheTopButton', true, 'add back to the top button', PG2)
    const ProfitCalculator = createCheckbox('Profit Calculator :', 'ProfitCalculator', true,'Displays an estimate of profits based on the buy orders, current sell value, and fees for buy orders made by other users. ( from the buy orders box )', PG3);
    const FeesCalculator = createCheckbox('Show fees value in itemPrice', 'FeesCalcualtor', true,'Adds text showing the fees value and the profit with the current buy order.', PG4);
    const viewOnSwapGG = createCheckbox('add a button to open csgo skin in swap.gg', 'viewOnSwapGG', true, 'adds a button who open a link with the swap.gg inspect tool.', PG5);
    const smallFixes = createCheckbox('Small Fixes: ', 'smallFixes', true,'Fix some small things that annoy me', PG6);
    const GraphButtonOptions = ['button', 'remove', 'default'];
    const GraphButton = selector('Button/Remove Sales Graph: ', GraphButtonOptions, "button", PG7, "This selection box allows you to customize the display of the sales chart on the website. Choose 'default' to keep it as it is, 'none' to remove the sales chart altogether, or 'button' to create a button that can expand and collapse the chart as needed.");
    const copyPriceToClipboard = createCheckbox('Add button to copy item price to cliboard: ', 'copyPriceToClipboard', true,'add a button to copy the price from the page', PG8);
    googleIcon('chevron_right','scale-arrow page-configs-colapse' , headerPageConfig, 'font-size: 2.5rem')
    addColapse("#scale-arrow\\ page-configs-colapse", ".config-ul.page-config")

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const marketplacesDiv = document.createElement('div')
    marketplacesDiv.className = 'config-header marketplaces'
    whiteboard.appendChild(marketplacesDiv)


    const ulMarketplaces = document.createElement('ul');
    ulMarketplaces.className = 'config-ul marketplaces'

    // cria um cabeçalho para page configs
    const headerMarketplaces = document.createElement('h4');
    headerMarketplaces.className = 'config-title marketplaces'
    headerMarketplaces.textContent = 'Marketplaces information configuration';
    marketplacesDiv.appendChild(headerMarketplaces)


    const M1 = document.createElement('li');
    const M2 = document.createElement('li');
    const M3 = document.createElement('li');
    ulMarketplaces.appendChild(M1)
    ulMarketplaces.appendChild(M2)
    ulMarketplaces.appendChild(M3)

    // adiciona o ul de page configs ao elemento whiteboard
    marketplacesDiv.appendChild(ulMarketplaces);

    googleIcon('chevron_right','scale-arrow marketplaces-colapse' , headerMarketplaces, 'font-size: 2.5rem')
    addColapse("#scale-arrow\\ marketplaces-colapse", ".config-ul.marketplaces")

    //Marktplaces status
    const SteamStatus = createCheckbox('SteamStatus: ', 'SteamStatus', true,'Adds a box showing the values for in steam for the item', M1);
    const backpackTFstatus = createCheckbox('Backpack.tf item status: ', 'BPTFstatus', true, 'AddDesc', M2);
    const ExtraStatus = createCheckbox('Show Status for more sites?', 'ExtraStatus', false,'In Development', M3);/*
                //bitskins
                Bitskins()
                //DMarket
                DMarketAPI()
                //SWAP.GG
                SwapGGAPI()
                //Skinport
                SkinportAPI()
                //CS.TRADE
                CSTRADE()
                //LOOTFARM
                LOOTFARM()
                //TradeITgg
                TradeITgg()*/
    //const chooseCurrencyOptions = ['$ - Dolar', 'Euro', '3', '4', '5', '6', 'R$ - Real']
    //const chooseCurrency = selector('choose the currency for the steamStatus and others', chooseCurrencyOptions, "$- Dolar", whiteboard, 'Choose the currency for the steam price and such')


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //functions for the close button
    function showOverlay() {
        overlay.style.display = 'block';
        whiteboard.style.display = 'flex';
        ;
    }
    function hideOverlay() {
        overlay.style.display = 'none';
        whiteboard.style.display = 'none';
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Show/Hide Graph Button
    switch (GraphButton) {
        case 'remove':
            document.querySelector("#content > div:nth-child(3)").style.display = 'none'
            break;
        case 'button':
            var header = document.querySelector("#content > div:nth-child(3) > div > h3");
            var content = document.querySelector("#content > div:nth-child(3) > div");
            //Makes default hide
            content.style.maxHeight = "50px";
            content.style.transitionProperty = 'max-height, height'
            content.style.transition = 'ease-out 200ms'
            // Cria o botão
            var salesGraphicBtn = document.createElement('button');
            salesGraphicBtn.textContent = "Show sales graphic";
            salesGraphicBtn.style.position = 'absolute';
            salesGraphicBtn.style.top = '15px';
            salesGraphicBtn.style.right = '20px';

            salesGraphicBtn.className = "btn btn-primary salesGraphicBtn";
            salesGraphicBtn.title = "Show the sales History graphic with the sales details for this item";
            //salesGraphicBtn.classList.add("");
            header.appendChild(salesGraphicBtn);

            // Define o comportamento do botão
            salesGraphicBtn.addEventListener('click', () => {
                if (salesGraphicBtn.dataset.value === "off") {
                    salesGraphicBtn.dataset.value = "on";
                    salesGraphicBtn.textContent = "Show sales graphic";
                    content.style.maxHeight = "50px";
                } else {
                    salesGraphicBtn.dataset.value = "off";
                    salesGraphicBtn.textContent = "Hide sales graphic";
                    content.style.maxHeight = "500px";
                }
            });
            break;
        case 'default':
            console.log('default')
            break;
        default:
            console.log('problem with the GraphButton, value: ', GraphButton)
            break;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //1+CentButton
    switch (Add1CentButton) {
        case true:
            // Definir quantidade de buy orders de maneira segura
            var quantidade;
            if (customQuantity1Cent === 0) {
                quantidade = (highestBuyOrder < 0.02) ? 20 :
                (highestBuyOrder < 0.10) ? 10 :
                (highestBuyOrder < 1) ? 5 : 1;
            } else {
                quantidade = customQuantity1Cent;
            }
            switch (ajustWithAvaibleMoney) {
                case true:
                    // Verifica se é necessário diminuir a quantidade
                    if ((highestBuyOrder + 0.01) * quantidade > moneyAvaible) {
                        quantidade = Math.floor(moneyAvaible / (highestBuyOrder + 0.01));
                    }
                    break;
                case false:
                    break;
                default:
                    console.log('error with ajustWithAvaibleMoney, value:', ajustWithAvaibleMoney)

            }

            // Cria botão para a ordem de compra de 1 centavo
            var centOrder = document.createElement("button");
            centOrder.id = "AutoOrder";
            centOrder.className = "btn btn-primary AutoOrder";
            centOrder.style.marginTop = '5px';
            centOrder.innerHTML = "Boost Order";
            centOrder.title = 'Create a buy order using the (highest buy order value + 0.01)'
            itemPriceBoxBox.appendChild(centOrder);
            centOrder.addEventListener("click", plusOneCent);
            break;
        case false:
            break;
        default:
            console.log('Problem with the Add1Cent, value:', Add1CentButton)
            break
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Just One Cent Button
    switch (AddJustOneCentButton) {
        case true:
            var justOneCent = document.createElement("button");
            justOneCent.id = "AutoOrder";
            justOneCent.className = "btn btn-primary AutoOrder";
            justOneCent.style.marginTop = '5px'
            justOneCent.innerHTML = "Buy for One Cent"
            justOneCent.title = "Create a buy order for 0.01";
            itemPriceBoxBox.appendChild(justOneCent);
            justOneCent.addEventListener("click", justOneCentFunction);
            break;
        case false:
            break;
        default:
            console.log('Error with AddJustOneCentButton, value:',AddJustOneCentButton)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Create Matching Order
    //switch
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Organize Buttons
    switch (OrganizeButtons) {
        case true:
            itemPriceBoxBox.childNodes[11].style.marginLeft = '0'
            itemPriceBoxBox.childNodes[11].style.display = 'flex';
            itemPriceBoxBox.childNodes[11].style.flexDirection = 'column';
            document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7 > form > button").style.marginTop = '5px';
            itemPriceBoxBox.style.display = 'flex';
            itemPriceBoxBox.style.flexDirection = 'column';
            break;
        case false:
            console.log('dont organize sadpepe')
            break;
        default:
            console.log('Problem with OrganizeButtons value:', OrganizeButtons)
            break;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //SteamStatus
    switch (SteamStatus) {
        case true:
            var verticalMarkets = document.createElement('div');
            verticalMarkets.className = 'vertical-market'
            pageSidebar.appendChild(verticalMarkets);
            if (appID == 730) {
                requestCsgoSkins()
            } else {
                //STEAM
                SteamAPI()
                //bitskins
                Bitskins()
                //DMarket
                DMarketAPI()
                //SWAP.GG
                SwapGGAPI()
                //Skinport
                SkinportAPI()
                //CS.TRADE
                CSTRADE()
                //LOOTFARM
                LOOTFARM()
                //TradeITgg
                TradeITgg()
            }
            break;
        case false:
            break;
        default:
            console.log('Problem with the vertical markets.')
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //ExtraStatus
    //switch
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //onKeyPress exec 1+ cent
    //switch
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Red/Green Border/NoBorder None background for box
    //switch
    switch (ChangeBackGroundForNoBuyOrder) {
        case 'Red/Green Background':
            if (itemPriceBox.value === highestBuyOrder) {
                itemPriceBoxBox.parentElement.parentElement.style.backgroundColor = 'green'
            } else {
                itemPriceBoxBox.parentElement.parentElement.style.backgroundColor = 'red'
            }
            break;
        case 'Red/Green border':
            if (itemPriceBox.value === highestBuyOrder) {
                itemPriceBoxBox.parentElement.parentElement.style.borderStyle = 'inset';
                itemPriceBoxBox.parentElement.parentElement.style.borderRadius = 'inherit';
                itemPriceBoxBox.parentElement.parentElement.style.borderColor = 'green';
            } else {
                itemPriceBoxBox.parentElement.parentElement.style.borderStyle = 'inset';
                itemPriceBoxBox.parentElement.parentElement.style.borderRadius = 'inherit';
                itemPriceBoxBox.parentElement.parentElement.style.borderColor = 'red';
            }
            break;
        case 'none':
            break;
        default:
            console.log('error in ChangeBackGroundForNoBuyOrder', ChangeBackGroundForNoBuyOrder)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Profit Calculator
    switch (ProfitCalculator) {
        case true:
            var ProfitLabel = document.createElement('th')
            ProfitLabel.scope = 'col'
            ProfitLabel.title = 'The profit is calculated by [(fees - BuyValue) - SellValue]'
            ProfitLabel.textContent = "Profit"
            document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody > tr:nth-child(1)").appendChild(ProfitLabel)
            for (var i = 1; quantidadeBuyOrders >= i; i++) {
                let currentBuyOrderRaw = document.querySelector(`#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody > tr:nth-child(${i + 1}) > td:nth-child(1)`);
                let currentBuyOrder = currentBuyOrderRaw.textContent.slice(1).replace(' or less', '');

                currentBuyOrderRaw.parentElement.addEventListener('click', () => {
                    itemPriceBox.value = currentBuyOrder;
                    try {
                        updateAfterFees()
                    } catch(err) {
                        console.log(updateAfterFees())
                        console.log(err)
                    }
                });
                currentBuyOrderRaw.parentNode.addEventListener('mouseover', () => {
                    currentBuyOrderRaw.parentNode.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    currentBuyOrderRaw.parentNode.style.transition = 'background-color 0.2s ease 0s';
                });

                currentBuyOrderRaw.parentNode.addEventListener('mouseout', () => {
                    currentBuyOrderRaw.parentNode.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    currentBuyOrderRaw.parentNode.style.transition = 'background-color 0.2s ease 0s';
                });


                var NewElement = document.createElement('td')
                NewElement.textContent = ("$" + CheckLucro(currentBuyOrder))
                document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody").children[i].appendChild(NewElement)
                try {
                    if (i % 2 != 0) {
                        currentBuyOrder.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                    }
                } catch (TypeError) {
                }
            }
            break;
        case false:
            break;
        default:
            console.log('some error with the profit calculator, value: ', ProfitCalculator)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //AfterFees and PRofit with current BUy Order
    switch (FeesCalculator) {
        case true:
            var afterFeesElement = document.createElement("div");
            afterFeesElement.textContent = "After fees: $NaN"; // definindo o conteúdo inicial
            afterFeesElement.style.color = "gray";
            afterFeesElement.style.position = "absolute";
            afterFeesElement.style.bottom = "0";
            afterFeesElement.style.left = "0";
            afterFeesElement.style.width = "100%";
            afterFeesElement.style.textAlign = "center";
            afterFeesElement.style.paddingBottom = '5px';
            itemPriceBox.parentNode.appendChild(afterFeesElement);
            afterFeesElement.style.height = (afterFeesElement.offsetHeight * 2 + 'px')

            var ProfitElement = document.createElement("div");
            ProfitElement.textContent = "Profit: $NaN"; // definindo o conteúdo inicial
            ProfitElement.style.color = "gray";
            ProfitElement.style.position = "absolute";
            ProfitElement.style.bottom = "0";
            ProfitElement.style.left = "0";
            ProfitElement.style.width = "100%";
            ProfitElement.style.textAlign = "center";
            ProfitElement.style.paddingBottom = '5px';
            itemPriceBox.parentNode.appendChild(ProfitElement);

            // small fixes
            itemPriceBoxBox.childNodes[1].style.marginBottom = '25px';
            itemPriceBoxBox.childNodes[1].style.fontSize = '1.5rem'
            itemPriceBox.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            itemPriceBox.style.borderRadius = '1rem 0 1rem 0'
            //add update function to itemPricebox
            itemPriceBox.addEventListener("input", updateAfterFees);
            itemPriceBox.addEventListener("change", updateAfterFees);

            var parentHeight = itemPriceBox.offsetHeight + afterFeesElement.offsetHeight + 10;
            parentDiv.style.height = parentHeight + "px";
            parentDiv.style.backgroundColor = '#202334'
            parentDiv.style.borderRadius = '1rem';

            document.querySelector("#recipient-username-addon").style.borderBottomRightRadius = '2rem'
            document.querySelector("#recipient-username-addon").style.borderTopRightRadius = '1rem'
            break;
        case false:
            break;
        default:
            console.log('error in the fees calculator')
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //small fixes
    switch (smallFixes) {
        case true:
            document.querySelector("#header-navbar > ul.navbar-nav.header__navbar-links > li:nth-child(1)").remove()
            document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7 > p").style.display = 'none'
            itemPriceBoxBox.parentElement.parentElement.style.borderRadius = '1rem'
            itemPriceBoxBox.childNodes[1].style.marginBottom = '10px';
            itemPriceBoxBox.childNodes[1].style.fontSize = '1.5rem'
            var cardBodies = document.querySelectorAll('.card-body');
            cardBodies.forEach(cardBody => {
                cardBody.style.boxShadow = '3 3 15px rgba(0, 0, 0, 0.3)';
            });
            break;
        case false:
            break;
        default:
            console.log('Problem with smallFixes, value:', smallFixes)
            break
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //options ask if want to RefreshPage() after the +1cent and JustOneCent
    // in the plusOneCent and JustOneCent functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Back to the top button
    switch (backToTheTopButton) {
        case true:
            var backToTopButton = document.createElement("button");
            backToTopButton.innerHTML = "";
            googleIcon('navigate_next', 'navigateNext', backToTopButton, backToTopGoogleIcon)
            backToTopButton.title = 'go back to the top of the page'
            backToTopButton.classList.add("back-to-top");
            document.body.appendChild(backToTopButton);

            // had a hardtime working with cssstyles so i decided just implemente everything using js fuckit
            backToTopButton.addEventListener("click", function() {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
            backToTopButton.addEventListener('mouseover', () => {
                backToTopButton.style.backgroundColor = 'rgb(90 209 232)'
                backToTopButton.style.color = 'black'
                backToTopButton.style.borderTopStyle = 'outset'
                backToTopButton.style.borderTopColor = 'rgba(255,255,255,0.3)'
                backToTopButton.style.borderTopWidth = 'medium'
                backToTopButton.style.borderBottomStyle = 'outset'
                backToTopButton.style.borderBottomColor = 'rgba(0,0,0,0.5)'
                backToTopButton.style.borderBottomWidht = 'medium'
                backToTopButton.style.boxShadow = '4px 4px 10px rgba(255, 255, 255, 0.3)'
                backToTopButton.style.transform = "translateY(-22%)";

            });
            backToTopButton.addEventListener('mouseout', () => {
                backToTopButton.style.boxShadow = '4px 4px 10px rgba(0, 0, 0, 0.5)'
                backToTopButton.style.backgroundColor = 'rgb(50, 51, 81)'
                backToTopButton.style.border = 'none'
                backToTopButton.style.color = 'white'
                backToTopButton.style.transform = "translateY(0%)";
            });
            window.addEventListener("scroll", function() {
                // Calcula a posição atual da rolagem em relação à altura total da página
                const scrollPosition = window.scrollY;
                const totalHeight = document.body.clientHeight - window.innerHeight;
                const scrollPercentage = scrollPosition / totalHeight * 100;

                // Atualiza a classe do botão com base na posição atual da rolagem
                if (scrollPercentage > 75) {
                    backToTopButton.classList.add("show");
                } else {
                    backToTopButton.classList.remove("show");
                }
            });
            break;
        case false:
            break;
        default:
            console.log('problem with back to the top, value: ', backToTheTopButton)
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //copy prices
    switch (copyPriceToClipboard) {
        case true:
            var itemPriceText = document.querySelector("#content > div.row > div:nth-child(1) > div > div > span.important-text")
            googleIcon('content_copy', 'scale-arrow copy-icon', itemPriceText, 'font-size: 1.25rem; translate: 0px -1rem;')
            document.querySelector("#scale-arrow\\ copy-icon").addEventListener('click', () => {
                console.log(`copied the price to the clipboard, price = ${itemPrice}`)
                GM_setClipboard(itemPrice)
            })
            break;
        case false:
            break;
        default:
            console.log('problem with copy to clipboard')
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Header beautify
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //hide/show item status
    //switch (hideShowItemStatus) {
    pageSidebar.style.display = 'flex'
    pageSidebar.style.flexDirection = 'column'
    pageSidebar.style.alignItems = 'center'

    const itemCard = document.querySelector("#page-sidebar > div.card.mb-0")
    const total = itemCard.clientHeight

    itemCard.style.height = document.querySelector("#page-sidebar > div.card.mb-0 > div > div.card-item").clientHeight + 60 + 'px'
    itemCard.style.overflow = 'hidden'
    itemCard.style.transition = 'ease-out 200ms'
    itemCard.style.transitionProperty = 'height'

    var itemHideButton = document.createElement('div')
    googleIcon('expand_more', 'hide-arrow item' , itemHideButton, 'font-size: 25px; transition: height 200ms ease-out 0s; transition-property: transform, color; color: rgba(0,0,0,0.5);}')
    itemHideButton.style.transform = "translateY(-100%)"

    if (document.querySelector('.vertical-market')) {
        document.querySelector("#page-sidebar").insertBefore(itemHideButton, document.querySelector('.vertical-market'))
    } else {
        document.querySelector("#page-sidebar").appendChild(itemHideButton)
    }
    itemHideButton.addEventListener('click', () => {
        if (itemHideButton.dataset.value === "off") {
            itemHideButton.dataset.value = "on";
            document.querySelector("#hide-arrow\\ item").innerHTML = 'expand_more'
            itemHideButton.title = "Show item status";
            itemCard.style.height = document.querySelector("#page-sidebar > div.card.mb-0 > div > div.card-item").clientHeight + 60 + 'px'
        } else {
            itemHideButton.dataset.value = "off";
            document.querySelector("#hide-arrow\\ item").innerHTML = 'expand_less'
            itemHideButton.title = "Hide item status";
            itemCard.style.height = total +'px'
        }
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //View on swap.gg
    switch(viewOnSwapGG) {
        case true:
            if (appID == 730) {
                let itemssactions = document.querySelectorAll("#transacContent > tr > td.table-itemsactions.table-items__actions")

                for (let i=0;i < itemssactions.length;i++) {
                    let inspectLink = itemssactions[i].lastElementChild.previousElementSibling.getAttribute('href');
                    let button = document.createElement('button')
                    button.textContent = 'view on swap.gg'
                    button.className = 'btn btn-secondary'
                    button.onclick = function() {
                        window.open(`https://market.swap.gg/screenshot?inspectLink=${inspectLink}`)
                    };
                    itemssactions[i].appendChild(button)
                }
            }
            break;
        case false:
            break;
        default:
            console.log('problem with th e swap.gg button, value: ', viewOnSwapGG)
    }


})();
