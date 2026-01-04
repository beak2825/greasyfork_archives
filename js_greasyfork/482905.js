// ==UserScript==
// @name     Better BikeCloset
// @version  2
// @grant    GM_addStyle
// @match *://bikecloset.com/product-category/im-cheap/
// @namespace https://greasyfork.org/users/1237493
// @description BikeCloset - I'm Cheap page filtering
// @downloadURL https://update.greasyfork.org/scripts/482905/Better%20BikeCloset.user.js
// @updateURL https://update.greasyfork.org/scripts/482905/Better%20BikeCloset.meta.js
// ==/UserScript==

GM_addStyle(`
#better-product-container {
    margin-left: 70px;  
}

label {
    padding-right:10px;
}

.better-product-product {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
}

.better-product-text {
    display: flex;
    flex-direction: column;
}

.better-product-subtext {
    display: flex;
    gap: 10px;
}

.better-product-date {
    color: gray;
    font-style: italic;
}

.better-product-new {
    color: red;
    font-size: 20px;
}
` );


let hideOutOfStock = true;
let hideOld = false;
let localstorageKey = "betterProduct:products"

function getStoredProducts() {
    storedProductsString = localStorage.getItem(localstorageKey);

    if (storedProductsString) {
        return JSON.parse(storedProductsString);
    } else{
        return {};
    }
}

function saveProducts(products) {
    localStorage.setItem(localstorageKey, JSON.stringify(products));
}

function renderToolbar() {
    let toolbar = document.createElement('div');

    let outOfStockCheckbox = document.createElement('input'); 
    outOfStockCheckbox.type = "checkbox";
    outOfStockCheckbox.id = "outOfStockCheckbox";
    outOfStockCheckbox.checked = hideOutOfStock;

    var outOfStockLabel = document.createElement('label')
    outOfStockLabel.htmlFor = "outOfStockCheckbox";
    outOfStockLabel.appendChild(document.createTextNode('Hide out of stock'));
    
    outOfStockCheckbox.addEventListener('change', (event) => {
        hideOutOfStock = !hideOutOfStock;
        render();
    });

    let hideOldCheckbox = document.createElement('input'); 
    hideOldCheckbox.type = "checkbox";
    hideOldCheckbox.id = "hideOldCheckbox";
    hideOldCheckbox.checked = hideOld;
    toolbar.appendChild(hideOldCheckbox);

    var hideOldLabel = document.createElement('label')
    hideOldLabel.htmlFor = "hideOldCheckbox";
    hideOldLabel.appendChild(document.createTextNode('Hide old'));
    

    hideOldCheckbox.addEventListener('change', (event) => {
        hideOld = !hideOld;
        render();
    });

    toolbar.appendChild(outOfStockCheckbox);
    toolbar.appendChild(outOfStockLabel);
    toolbar.appendChild(hideOldCheckbox);
    toolbar.appendChild(hideOldLabel);

    return toolbar;
}

function renderBetterProducts() {
    let betterContainer = document.createElement("div");

    let products = document.getElementsByClassName('content-product');
    let storedProducts = getStoredProducts();
    let productsToStore = {};

    for (let container of products) {
        let betterProduct = document.createElement('div');
        betterProduct.className = 'better-product-product'
        
        let image = document.createElement('img');
        image.width = '50';
        image.height = '50';
        image.src = container.querySelector('.product-content-image img').getAttribute('data-src');

        let price = container.querySelector('.price').cloneNode(true);
        let outOfStock = container.getElementsByClassName('out-of-stock').length > 0;
        let title = container.getElementsByClassName('product-title')[0];
        let anchor = title.getElementsByTagName('a')[0];
        let label = document.createElement('div');
        anchorText = anchor.text + (outOfStock ? ' (Out of Stock)' : '');
        label.innerHTML = `<a href="${anchor.href}">${anchorText}</a>`;

        let storedProduct = storedProducts[anchorText] || {title: anchorText, displayDate: new Date().toLocaleString(), epoch: Date.now()};
        productsToStore[anchorText] = storedProduct;

        let dateAdded = document.createElement("div");
        dateAdded.className = 'better-product-date';
        let isNew = new Date().setHours(0, 0, 0, 0) == new Date(storedProduct.epoch).setHours(0, 0, 0, 0);

        dateAdded.innerText = `Added: ${storedProduct.displayDate}` + (isNew ? ' New!' : '');

        let textContainer = document.createElement("div");
        textContainer.className = 'better-product-text';
        let subtextContainer = document.createElement("div");
        subtextContainer.className = 'better-product-subtext';

        textContainer.appendChild(label);
        subtextContainer.appendChild(price);
        subtextContainer.appendChild(dateAdded);
        textContainer.appendChild(subtextContainer);
        
        betterProduct.appendChild(textContainer);
        betterProduct.appendChild(image);

        if (isNew) {
            let isNewContainer = document.createElement('div');
            isNewContainer.className = "better-product-new";
            isNewContainer.innerText = "New!";
            betterProduct.appendChild(isNewContainer);
        }

        let hide = false;

        if(hideOutOfStock && outOfStock) {
            hide = true;
        } else if (hideOld && !isNew) {
            hide = true;
        }

        if (!hide) {
            betterContainer.appendChild(betterProduct);
        }
    }

    saveProducts(productsToStore);

    return betterContainer;
}

function render() {
    let container = document.getElementById('better-product-container');
    container.innerHTML = '';
    container.appendChild(renderToolbar());
    container.appendChild(renderBetterProducts());
}

let container = document.createElement('div');
container.id = 'better-product-container';
document.getElementsByClassName('page-heading')[0].after(container);

render();