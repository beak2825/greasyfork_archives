// ==UserScript==
// @name        Amazon.com Item Not FBA
// @description Know when viewing non-FBA item pages
// @author      dehotjava
// @license     MIT
// @namespace   https://greasyfork.org/en/scripts/407562-amazon-item-not-fba
// @match       https://*.amazon.com/dp/*
// @match       https://*.amazon.com/*/dp/*
// @match       https://*.amazon.com/gp/product/*
// @match       https://*.amazon.com/*/ASIN/*
// @match       https://*.amazon.ca/dp/*
// @match       https://*.amazon.ca/*/dp/*
// @match       https://*.amazon.ca/gp/product/*
// @match       https://*.amazon.ca/*/ASIN/*
// @run-at      document-idle
// @version     27
// @grant       none
// @icon        https://www.amazon.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/407562/Amazoncom%20Item%20Not%20FBA.user.js
// @updateURL https://update.greasyfork.org/scripts/407562/Amazoncom%20Item%20Not%20FBA.meta.js
// ==/UserScript==

var txt_caution = null
var txt_caution_cart = null
var selected_section = null

var cart_fly = document.getElementById('nav-flyout-ewc')
var cart_add = document.getElementById('submit.add-to-cart') || document.getElementById('submit.add-to-cart-ubb')
var info_oos = document.getElementById('outOfStock') || document.getElementById('backInStock')
var info_unqual = document.getElementById('unqualifiedBuyBox')

if (cart_add != null) {
    var cart_section = cart_add.closest('.a-box-inner').children
    var info_merchant = cart_add.closest('.a-box-inner').children[0]
}

// normal section and another section (i.e. subscribe and save, used, etc.)
if (document.querySelectorAll('div[role="button"][aria-checked="true"]').length > 0) {
    update_selected_section()

    // check fba again when new/used/etc. section selected
    for (const li of document.querySelectorAll('div[role="button"]')) {
        li.addEventListener('click', function() {
            setTimeout(function() {
                update_selected_section()
                delay_check_fba()
            }, 500)
        })
    }
}

// selected new product variant by drop down menu and etc.
var observer = new MutationObserver(function (event) {
    delay_check_fba()
})

observer.observe(document.getElementById('unifiedPrice_feature_div'), {
    attributes: true,
    attributeFilter: ['class'],
    childList: false,
    characterData: false
})

// selected new product variant by side-by-side buttons
if (document.getElementById('twister') != null) {
    for (const li of document.querySelectorAll('#twister>div>ul>li')) {
        li.addEventListener('click', function() {
            location.href = li.getAttribute('data-dp-url')
        })
    }
}

// check fba after document loaded
check_fba()

function delay_check_fba() {
    setTimeout(function(){
        check_fba()
    }, 500)
}

function update_selected_section() {
    selected_section = document.querySelectorAll('div[role="button"][aria-checked="true"]')[0].parentElement
    info_merchant = document.querySelectorAll('div[role="button"][aria-checked="true"]')[0].parentElement
}

function check_fba() {
    if (info_merchant == null) {
        return
    }

    var info_merchant_txt = info_merchant.textContent.replace(/[]+|[\s]{2,}/g, '\n')

    if (document.getElementById('merchant-info') != null) {
        info_merchant_txt += document.getElementById('merchant-info').textContent.replace(/[]+|[\s]{2,}/g, '\n')
    }

    console.log(info_merchant_txt)

    if (
        (info_merchant_txt.search('Amazon.com Services') == -1 &&
         info_merchant_txt.search('Fulfilled by Amazon') == -1 &&
         info_merchant_txt.search('Ships from and sold by Amazon.') == -1 &&
         info_merchant_txt.search('Ships from\nAmazon') == -1 &&
         info_merchant_txt.search('Ships from:\nAmazon') == -1 &&
         info_merchant_txt.search('To buy, select') == -1 &&
         info_merchant_txt.search('Deal') == -1 &&
         info_merchant_txt.search('Early Access') == -1 &&
         info_merchant_txt.search('Kindle') == -1 &&
         info_merchant_txt.search('audiobook') == -1
        ) &&
        (info_oos == null) &&
        (info_unqual == null)
    ) {

        if (cart_fly != null && document.getElementById('nav-flyout-ewc').style.cssText.search('right') != -1) {
            cart_fly.style.marginRight = '8px'
            cart_fly.style.marginTop = '7px'
            cart_fly.style.clipPath = "inset(0px 0px 14px 0px)"
        }

        if (document.getElementById('skiplink') != null) {
            document.getElementById('skiplink').remove()
        }

        document.body.style.border = 'red'
        document.body.style.borderStyle = 'inset'
        document.body.style.borderWidth = '0.5em'

        if (txt_caution != null) {
            txt_caution.remove()
        }

        if (txt_caution_cart != null) {
            txt_caution_cart.remove()
        }

        txt_caution = document.createElement("p")
        txt_caution.id = 'notfba'
        txt_caution.innerHTML = '* NOT FULFILLED BY AMAZON *'
        txt_caution.style.background = 'black'
        txt_caution.style.color = 'red'
        txt_caution.style.fontSize = 'xx-large'
        txt_caution.style.margin = 'inherit'
        txt_caution.style.textAlign = 'center'
        txt_caution.style.textTransform = 'uppercase'
        document.documentElement.insertAdjacentElement('afterbegin', txt_caution)

        txt_caution_cart = txt_caution.cloneNode(true)
        txt_caution_cart.id = 'notfba_cart'
        txt_caution_cart.innerHTML = '* NOT FBA *'
        txt_caution_cart.style.background = 'inherit'
        txt_caution_cart.style.fontSize = 'medium'
        txt_caution_cart.style.margin = '0 0 14px 0'

        if (cart_add != null) {
            cart_add.parentElement.prepend(txt_caution_cart)
        }

        console.log('Is NOT FBA!')

    } else {
        console.log('Is FBA!')

        document.body.style.border = 'none'

        if (cart_fly != null && document.getElementById('nav-flyout-ewc').style.cssText.search('right') != -1) {
            cart_fly.style.marginRight = 'auto'
            cart_fly.style.marginTop = 'auto'
            cart_fly.style.clipPath = 'none'
        }

        if (txt_caution != null) {
            txt_caution.remove()
        }

        if (txt_caution_cart != null) {
            txt_caution_cart.remove()
        }
    }
}