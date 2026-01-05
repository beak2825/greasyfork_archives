// ==UserScript==
// @name         Adidas Turn Notifier
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Check if we have a slot to purchase Yeezy shoes, and notify the user if so. Intended to be run on multiple tabs with separate sessions and IPs. Will Auto-focus the tab when a slot is available.
// @author       firefish6000
// @match        http://www.adidas.com/*
// @match        https://www.adidas.com/*
// @grant        window.focus
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/28153/Adidas%20Turn%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/28153/Adidas%20Turn%20Notifier.meta.js
// ==/UserScript==

// https://code.jquery.com/jquery-3.1.1.min.js
// Shipping Url:
// https://www.adidas.com/us/delivery-start


// Product ID of the shoe. Currently unused 
var settings = {
    autoRunScript: true,
    autoQuantity: 1,
    autoReload: true,
    autoReloadWait: 5000,
    autoColor: null,
    autoAddToCart: true,
    autoCheckout: false,
    autoPurchase: false,
    choseShoeSound: 'https://www.freesound.org/data/previews/322/322929_5260872-lq.mp3',
    choseShoeIcon: 'http://www.stackoverflow.com/favicon.ico',
    shippingSound: null,
    shippingIcon: null,
    purchasedSound: null,
    purchasedIcon: null,
    shoe: {
        size: 10,
        quantity: 1,
    },
    shipping: {
        first: "John",
        last: "Smith",
        address: "12345 abc dr.",
        city: "johnsvill",
        state: "TN",
        zip: "67890",
        phone: "555-555-5555",
        email: "user@site.domain",
    },
    billing: {
        first: "John",
        last: "Smith",
        address: "12345 abc dr.",
        city: "johnsvill",
        state: "TN",
        zip: "67890",
        phone: "555-555-5555",
        email: "user@site.domain",
    },
    payment: {
        name: "John Smith",
        card: "4111111111111111", // Fake Visa card number
        month: 12,
        year: 2019,
        cvv: 345
    },
    shoeFormNotify: {
        audio: 'https://www.freesound.org/data/previews/322/322929_5260872-lq.mp3',
        icon: 'http://www.stackoverflow.com/favicon.ico',
    },
    shippingFormNotify: {
        audio: null,
        icon: null,
    },
};
settings=JSON.parse(GM_getValue('Adidas_Settings',JSON.stringify(settings)) );
var shared={
    doAutoReload: true,
};

GM_addStyle(`
            
`);

function dbg(txt) {
    console.log(txt);
}

function getElementByXpath(path,element=document) {
  return document.evaluate(path, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function getElementsByXpath(xpath, parent=document)
{
  let results = [];
  let query = document.evaluate(xpath,
      parent,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i=0, length=query.snapshotLength; i<length; ++i) {
    results.push(query.snapshotItem(i));
  }
  return results;
}

var win = window.open("", "Adidas Monitor", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=200, height=480, top="+(screen.height-400)+", left="+(screen.width-840));


var gui={};
gui.document = document.createElement('div');
gui.document.innerHTML = `
<!--
<p id="selected_tab_idx">0</p>

<p id="openedN">0</p>
<p id="readyN">0</p>
<p id="activeN">0</p>
<p id="failedN">0</p>

<p id="individualPrice">0</p>
<p id="totalSpent">0</p>
<p id="purchasedN">0</p>

<p id="current_tab_log"></p>
<p id="log"></p>
<p id="errors"></p>
-->
<img src="">
<div id="settings">
<input type="checkbox" id="autoRunScript">
<input type="checkbox" id="autoReload">
<input type="checkbox" id="autoAddToCart">
<input type="checkbox" id="autoCheckout">
<input type="checkbox" id="autoPurchase">

<input type="text" id="autoReloadWait" title="Time to wait in milliseconds before reloading page">
<input type="text" id="choseShoeSound" class="audio">
<input type="text" id="choseShoeIcon" class="icon">
<input type="text" id="shippingSound" class="audio">
<input type="text" id="shippingIcon" class="icon">
<input type="text" id="purchasedSound" class="audio">
<input type="text" id="purchasedIcon" class="icon">

</div>
<div id="shoe">
<input type="text" id="size">
<input type="text" id="quantity">
</div>
<div id="shipping">
<input type="text" id="first">
<input type="text" id="last">
<input type="text" id="address">
<input type="text" id="city">
<input type="text" id="state">
<input type="text" id="phone">
<input type="text" id="email">
</div>
<div id="billing">
<input type="text" id="first">
<input type="text" id="last">
<input type="text" id="address">
<input type="text" id="city">
<input type="text" id="state">
<input type="text" id="phone">
<input type="text" id="email">
</div>
<div id="payment">
<input type="text" id="name">
<input type="text" id="card">
<input type="text" id="month">
<input type="text" id="year">
<input type="text" id="cvv">
</div>

`;
win.document.body.innerHTML = gui.document.innerHTML;
//document.body.appendChild(gui.document);
gui.document=win.document;
gui.opened = getElementByXpath('//*[@id=openedN]',gui.document);
gui.ready  = getElementByXpath('//*[@id=readyN]',gui.document);
gui.active = getElementByXpath('//*[@id=activeN]',gui.document);
gui.failed = getElementByXpath('//*[@id=failedN]',gui.document);
gui.completed = getElementByXpath('//*[@id=completeN]',gui.document);
var fields = getElementsByXpath('//div',gui.document);
for (var i=0;i<fields.length;i++) {
    var input=fields[i];
    var id = input.id;
    if (id === null) {
        continue;
    }
    var label = document.createElement("h1");
    var after = document.createElement("br");
    label.textContent=id.replace(/[A-Z]/g,function(x){return " " + x;});
    input.insertBefore(label,input.firstChild);
    input.parentNode.insertBefore(after,input.nextSibling);
}
var inputs = getElementsByXpath('//input',gui.document);
dbg(inputs);
for (var i=0;i<inputs.length;i++) {
    var input=inputs[i];
    var id = input.id;
    var label = document.createElement("label");
    var after = document.createElement("br");
    label.textContent=id.replace(/[A-Z]/g,function(x){return " " + x;});
    if (input.parentElement.id && input.parentElement.id !== 'settings') {
        if (settings[input.parentElement.id][id]) {
            input.value=settings[input.parentElement.id][id];
            input.checked=settings[input.parentElement.id][id];
        }
        input.onchange=(function(settings,input,id) { return function() {
            var val = input.value;
            if (input.type == 'checkbox') val=input.checked;
            settings[input.parentElement.id][id]=val;console.log(val);
            GM_setValue('Adidas_Settings',JSON.stringify(settings));
        }; })(settings,input,id);
    }
    else {
        if (settings[id]) {
            input.value=settings[id];
            input.checked=settings[id];
        }
        input.onchange=(function(settings,input,id) { return function() {
            var val = input.value;
            if (input.type == 'checkbox') val=input.checked;
            settings[id]=val;
            console.log(val);
            GM_setValue('Adidas_Settings',JSON.stringify(settings));
        }; })(settings,input,id);
    }
    input.parentNode.insertBefore(label,input);
    input.parentNode.insertBefore(after,input.nextSibling);
}



if (! settings.autoRunScript) {
    dbg('Set to not Run');
    return null;
}



function Err(msg) {
}


var PID="BB0188";
var shoeFormXPath = '//*[@id="buy-block"]//form[@name="addProductForm"]';



function GetForm() {
    var form = getElementByXpath(shoeFormXPath);
    return form;
}
function FormHasLoaded(xpath=shoeFormXPath,fullyloadedtest=function(){return true;}) {
    var form = getElementByXpath(xpath);
    dbg(xpath);
    dbg(form);
    if (form) {
        dbg("-----------Form Was detected-----------");
        return fullyloadedtest(form);
    }
    dbg("No Form Yet");
    return false;
}
function TestShoeFormFullyLoaded(form) {
    // Ensure form is fully loaded, and not still dynamicly loading
    AutoDetectPID();
    var sizes = getElementByXpath('//div[@data-ci-test-id="selectSizeDropdown"]//select[@id="size-select-' + PID + '"]',form);
    var span = getElementByXpath('//div[@data-ci-test-id="selectSizeDropdown"]//a[contains(concat(" ", normalize-space(@class), " "), " ffSelectButton ")]/span',form);
    if (sizes && span) {
        dbg("--------------------------------------------------");
        dbg("--------------------------------------------------");
        dbg("---------------Form Is Fully Loaded---------------");
        return true;
    }
    return false;
}
function AutoDetectPID() {
    var sizes = getElementByXpath('//div[@data-ci-test-id="selectSizeDropdown"]//select');
    var tpid = sizes.id.match('size-select-(.*)')[1];
    if (tpid) {
        PID=tpid;
        dbg("Auto-detected PID " + PID);
        return PID;
    }
    dbg("No PID Found");
    return false;
}
function SelectOption(selectWrapper,val,selectText) {// class = ffSelectWrapper
    dbg("Got Select Wraper");
    dbg(selectWrapper);
    var selectList = getElementByXpath('select',selectWrapper);
    dbg(selectList);
    var selectSpan = getElementByXpath('.//a[contains(concat(" ", normalize-space(@class), " "), " ffSelectButton ")]/span',selectWrapper);
    dbg(selectSpan);
    for (var i=0;i<selectList.options.length;i++) {
        dbg("Scanning option " + selectList.options[i].value.trim() + " with id " + i + " for option " + val);
        if (selectList.options[i].value.trim() == val) {
            dbg("Selected option " + val + " with id " + i);
            selectList.selectedIndex=i;
            selectSpan.textContent="Auto Select: " + val;
            break;
        }
    }
}
function SelectSize(size) {
    dbg("Reading Sizes");
    var form = GetForm();
    //var sizes = getElementByXpath('//div[@data-ci-test-id="selectSizeDropdown"]//select');
    var sizes = getElementByXpath('//div[@data-ci-test-id="selectSizeDropdown"]//select[@id="size-select-' + PID + '"]',form);
    dbg("Got Sizes");
    dbg(sizes);
    //var sizes = document.getElementById("size-select-" + PID);
    for (var i=0;i<sizes.options.length;i++) {
        dbg("Scanning size " + sizes.options[i].text.trim() + " with id " + i + " for size " + size);
        //if (parseInt(sizes.options[i].text.trim()) == parseInt(size)) {
        if (sizes.options[i].text.trim() == size) {
            dbg("Selected size " + size + " with id " + i);
            sizes.selectedIndex=i;
            var span = getElementByXpath('//div[@data-ci-test-id="selectSizeDropdown"]//a[contains(concat(" ", normalize-space(@class), " "), " ffSelectButton ")]/span',form);
            span.textContent="Auto Size: " + size;
            return true;
            //break;
        }
    }
    return false;
}
function SelectBtn() {
    dbg("Searching For Add To Cart Button");
    var form = GetForm();
    var buy_btn = getElementByXpath('//button[@name="add-to-cart-button"]',form);
    dbg("Got Btn");
    dbg(buy_btn);
    // Commented out to allow other variations, like Update, UpdateCart, etc.
    //if (buy_btn.textContent.trim() == "Add To Bag") {
    if (buy_btn.textContent.trim() !== "") {
        dbg("Button Confirmed");
        buy_btn.click();
        return true;
    }
    dbg("Wrong button!");
    return false;
}
function SelectMiniCart() {
    dbg("Searching for MiniCart Overlay");
    var form = getElementByXpath('//div[@id="minicart_overlay"]');
    dbg("Got a form:");
    dbg(form);
    var summary = getElementByXpath('//div[contains(concat(" ", normalize-space(@class), " "), " minicart_summery ")]',form);
    var checkout_btn = getElementByXpath('a[@title="Checkout"]',summary);
    dbg(summary);
    dbg("Testing for Checkout Btn");
    dbg(checkout_btn);
    if (checkout_btn.textContent.trim().toLowerCase() == "checkout") {
        dbg("Button Confirmed");
        checkout_btn.click();
        return true;
    }
    dbg("Couldn't Find Checkout Btn");
    return false;
}

function ShippingAutoFill(data) {
    dbg("Auto Filling Shipping");
    var form = getElementByXpath('//form[starts-with(@action,"https://www.adidas.com/us/delivery-start")]');
    dbg(form);
    var first = getElementByXpath('//input[@data-ci-test-id="firstNameField"]',form);
    dbg(first);
    if (!first) {
        return false;
    }
    var last = getElementByXpath('//input[@data-ci-test-id="lastNameField"]',form);
    var address = getElementByXpath('//input[@data-ci-test-id="address1Field"]',form);
    var city = getElementByXpath('//input[@data-ci-test-id="cityField"]',form);
    var state = SelectOption(getElementByXpath('//div[contains(concat(" ", normalize-space(@class), " "), " countyprovince ")]/div/div[contains(concat(" ", normalize-space(@class), " "), " ffSelectWrapper ")]',form),data.state);
    var zip = getElementByXpath('//input[@data-ci-test-id="zipField"]',form);
    var phone = getElementByXpath('//input[@data-ci-test-id="phoneField"]',form);
    var email = getElementByXpath('//input[@data-ci-test-id="eMailField"]',form);
    var submitBtn = getElementByXpath('//button[@data-ci-test-id="reviewAndPayButton"]',form);
    first.value=data.first;
    last.value=data.last;
    address.value=data.address;
    city.value=data.city;
    zip.value=data.zip;
    phone.value=data.phone;
    email.value=data.email;
    var billingBtn = getElementByXpath('//input[@id="dwfrm_delivery_singleshipping_shippingAddress_useAsBillingAddress"]',form);
    if (billingBtn.checked ) {
        billingBtn.click();
    }
    BillingAutoFill(settings.billing);
    if(settings.autoCheckout) {
        setTimeout(function() { submitBtn.click(); },2000); // extra timeout to allow validation to finish
    }
    return true;
}
function BillingAutoFill(data) {
    dbg("Auto Filling Billing");
    var form = getElementByXpath('//form[starts-with(@action,"https://www.adidas.com/us/delivery-start")]');
    form = getElementByXpath('.//div[@data-ci-test-id="yourDetails"]',form);
    dbg(form);
    var first = getElementByXpath('.//input[@data-ci-test-id="firstNameField"]',form);
    dbg(first);
    if (!first) {
        return false;
    }
    var last = getElementByXpath('.//input[@data-ci-test-id="lastNameField"]',form);
    var address = getElementByXpath('.//input[@data-ci-test-id="address1Field"]',form);
    var city = getElementByXpath('.//input[@data-ci-test-id="cityField"]',form);
    var state = SelectOption(getElementByXpath('.//div[contains(concat(" ", normalize-space(@class), " "), " countyprovince ")]/div/div[contains(concat(" ", normalize-space(@class), " "), " ffSelectWrapper ")]',form),data.state);
    var zip = getElementByXpath('.//input[@data-ci-test-id="zipField"]',form);
    var phone = getElementByXpath('.//input[@data-ci-test-id="phoneField"]',form);
    var email = getElementByXpath('.//input[@data-ci-test-id="eMailField"]',form);
    first.value=data.first;
    last.value=data.last;
    address.value=data.address;
    city.value=data.city;
    zip.value=data.zip;
    phone.value=data.phone;
    email.value=data.email;
    return true;
}
function PaymentAutoFill(data) {
    dbg("Auto Filling Payment");
    var form = getElementByXpath('//form[starts-with(@action,"https://www.adidas.com/us/delivery-start")]');
    dbg(form);
    var name = getElementByXpath('.//input[@data-ci-test-id="nameOnCardField"]',form);
    if (!name) {
        return false;
    }
    dbg(name);
    var card = getElementByXpath('.//input[@data-ci-test-id="cardNumberField"]',form);
    var exp_month = SelectOption(getElementByXpath('.//div[@data-ci-test-id="monthDropdown"]//div[contains(concat(" ", normalize-space(@class), " "), " ffSelectWrapper ")]',form),data.month);
    var exp_year = SelectOption(getElementByXpath('.//div[@data-ci-test-id="yearDropdown"]//div[contains(concat(" ", normalize-space(@class), " "), " ffSelectWrapper ")]',form),data.year);
    var cvv = getElementByXpath('.//input[@data-ci-test-id="CVVField"]',form);
    var submitBtn = getElementByXpath('.//div[data-ci-test-id="paymentSubmitButton"]//button',form);
    name.value=data.name;
    card.value=data.card;
    //exp_month.value=data.month;
    //exp_year.value=data.year;
    cvv.value=data.cvv;
    if(settings.autoPayment) {
        setTimeout(function() { submitBtn.click(); },2000); // extra timeout to allow validation to finish
    }
    return true;
}

function NotifyUser(data) {
    var audio = new Audio(data.audio);
    audio.play();
    window.focus();
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    //var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = data.icon;
    document.getElementsByTagName('head')[0].appendChild(link);
}

function OnFormLoad() {
    dbg("Running on Load Functions");
    shared.doAutoReload=false;
    AutoDetectPID();
    NotifyUser(settings.choseShoeSound);
    /****************************
     * Start of auto Selection
     ****************************/
    if (settings.shoe.size !== null && ! SelectSize(settings.shoe.size)) {
        dbg("-----------------------------------");
        dbg("-----------------------------------");
        dbg("Failed to find the correct size!!!!");
        return false;
    }
    if (settings.autoAddToCart && SelectBtn() ) {
        if (settings.autoCheckout) {
            dbg("Waiting for Minicart to load!");
            setTimeout(SelectMiniCart,4000);
        }
    }
}



function CheckLoop() {
    if (FormHasLoaded(shoeFormXPath,TestShoeFormFullyLoaded)) {
        setTimeout(OnFormLoad,500); // extra timeout to allow full form to load
    }
    else {
        setTimeout(CheckLoop, 500);
    }
}
function CheckLoop_v2(formXPath,callback,tries=1000,errcallback=function(xpath) { dbg("Failed to find form '" + xpath + "' within tries limit."); }) {
    if (FormHasLoaded(formXPath)) {
        setTimeout(callback,500); // extra timeout to allow full form to load
    }
    else if (tries !== 0) {
        //dbg(tries);
        setTimeout(function() { CheckLoop_v2(formXPath,callback,tries - 1); }, 500);
    }
    else {
        errcallback(formXPath);
    }
}

function shippingCallback() {
    if (ShippingAutoFill(settings.shipping) || PaymentAutoFill(settings.payment) ) {
        dbg("Autofill complete!");
    }
    else {
        dbg("Failed to do any autofill!");
    }
}
function paymentCallback() {
    //setTimeout(function() {PaymentAutoFill(settings.paymentAutoFill);},1000);
    if (PaymentAutoFill(settings.payment) ) {
        dbg("Autofill complete!");
    }
    else {
        dbg("Failed to do any autofill!");
    }
}

function autoReload() {
    if (settings.autoReload === false || shared.doAutoReload === false) {
        return false;
    }
    var title = getElementByXpath('//section[@id="logo"]//*[@class="site-title"]').textContent;
    dbg(title);
    if ( title && /SOLD OUT/.test(title) ) {
        dbg("Not in Que! Reloading!");
        setTimeout(function(){
            if (settings.autoReload && shared.doAutoReload ) {
                location.reload();
            }
        },settings.autoReloadWait);
    }
    else {
        dbg("Congrats, we are in Que!");
    }
}
function waitForQue() {
    CheckLoop_v2('//section[@id="logo"]//*[@class="site-title"]',autoReload);
}



if (window.location.href == "https://www.adidas.com/us/delivery-start" ) {
    dbg("ENTERING Shipping Form Loop");
    dbg("ENTERING Shipping Form Loop");
    dbg("ENTERING Shipping Form Loop");
    CheckLoop_v2('//form[starts-with(@action,"https://www.adidas.com/us/delivery-start")]',shippingCallback,10);
}
else if (/adidas\.com\/yeezy/.test(window.location.href) ) {
    dbg("Checking if we are in que");
    waitForQue();
    // Also check if the form has loaded, and cancel waitForQue if so
    setTimeout(CheckLoop, 500);
}
else if (/\/COSummary-Start/.test(window.location.href) ) {
    dbg("ENTERING Payment Form Loop");
    CheckLoop_v2('//form[@id="dwfrm_payment"]',paymentCallback,10);
}
else {
    dbg("ENTERING Shoe Form Loop");
    setTimeout(CheckLoop, 500);
}

(function() {
    'use strict';

    // Your code here...
})();