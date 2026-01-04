// ==UserScript==
// @name         AMD.com Add To Cart Button
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Script to make it possible to add an item to AMD.com cart when it's in stock behind the scenes but not on the client side.
// @author       Dave#3150
// @match        https://www.amd.com/en/direct-buy/*
// @icon         https://www.google.com/s2/favicons?domain=amd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424692/AMDcom%20Add%20To%20Cart%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/424692/AMDcom%20Add%20To%20Cart%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the constants that we need.
    const url = window.location.href;
    const productId = url.split('direct-buy/')[1].split('/')[0];
    const btnStyle = 'padding: 20px; background: #de191f; color: #fff; border: none; border-radius: 5px; margin-top: 5px; margin-right: 5px;';
    const alarm = new Audio('https://www.e2s.com/system/1/assets/files/000/000/423/423/854c33e83/original/TF050.WAV');
    let loop = true;
    let alarmPlayed = false;
    let checkoutOpened = false;

    // Create script title span.
    let info = document.createElement('span');
    info.classList.add('daves-span2');
    info.setAttribute('style', 'margin-top: 20px; color: red; background: #000; padding: 10px; display: block; text-align: center;');
    info.innerHTML = 'Dave\'s Add To Cart Buttons';
    document.querySelector('.product-page-description').appendChild(info);

    // Create the first button.
    let btn = document.createElement('button');
    btn.classList.add('daves-btn');
    btn.setAttribute('style', btnStyle);
    btn.innerHTML = 'Add To Cart';
    document.querySelector('.product-page-description').appendChild(btn);

    // Create the second button.
    let btn2 = document.createElement('button');
    btn2.classList.add('daves-btn2');
    btn2.setAttribute('style', btnStyle);
    btn2.innerHTML = 'Add To Cart Every 10 Sec';
    document.querySelector('.product-page-description').appendChild(btn2);

    // Create loading indicator.
    let loading = document.createElement('span');
    loading.classList.add('daves-span');
    loading.setAttribute('style', 'margin-top: 20px; color: red; display: none;');
    document.querySelector('.product-page-description').appendChild(loading);

    // Create the event listener.
    document.querySelector('.daves-btn').addEventListener('click', handleClick);

    // Create the event listener.
    document.querySelector('.daves-btn2').addEventListener('click', handleClickAuto);

    // Click event handler.
    function handleClick(e){
        if(e){
            e.preventDefault();
        }

        // Don't call again when the dialog is being displayed.
        if(document.querySelector('.ui-dialog-title')){
            return;
        }

        // Don't execute if already succeeded.
        if(!loop){
            return;
        }

        // Send the call to try and add it to the cart.
        loading.innerHTML = 'Trying to add to cart....';
        document.querySelector('.daves-span').style.display = 'block';

        // Use Drupal integrated request handler.
        var ajaxSettings = {
            url: Drupal.url('direct-buy/add-to-cart/' + productId + '?_wrapper_format=drupal_ajax'),
            progress: false,
            base: false,
            element: false,
        };
        var myAjaxObject = Drupal.ajax(ajaxSettings);
        myAjaxObject.execute();

        /*fetch('https://www.amd.com/en/direct-buy/add-to-cart/' + productId + '?_wrapper_format=drupal_ajax', {
            'credentials': 'include',
            'referrer': 'https://www.amd.com/en/direct-buy/' + productId + '/us',
            'body': '',
            'method': 'POST',
            'mode': 'cors'
        }).then(async xhr => {
            const responseText = await xhr.text();
            if(!responseText || responseText.includes('Web Site Maintenance') || responseText.includes('Product could not be added to the cart')){
                loading.innerHTML = 'Failed to add to cart.';
            }else{
                // Open payment window?
                const match = /https:[^\s]+\/checkout\/payment\/([0-9]+)\/[a-z]{2}/.exec(responseText)
                if(match){
                    loop = false;
                    alarm.play();
                    window.location = match[0];
                }
            }
        }).catch(() => {
            loading.innerHTML = 'Failed to add to cart.';
        });*/
    }

    // Click event handler for auto feature.
    function handleClickAuto(e){
        e.preventDefault();
        document.querySelector('.daves-btn').style.opacity = '0.5';
        document.querySelector('.daves-btn2').style.opacity = '0.5';
        document.querySelector('.daves-btn').setAttribute('disabled', 'disabled');
        document.querySelector('.daves-btn2').setAttribute('disabled', 'disabled');
        loop = true;
        alarmPlayed = false;
        handleClick(null);
        setInterval(function(){
            handleClick(null);
        }, 10000);
    }

    setInterval(function(){
        if(document.querySelector('.ui-dialog-title') && !alarmPlayed){
            loop = false;
            alarmPlayed = true;
            document.querySelector('.daves-btn').style.opacity = '1';
            document.querySelector('.daves-btn2').style.opacity = '1';
            document.querySelector('.daves-btn').removeAttribute('disabled');
            document.querySelector('.daves-btn2').removeAttribute('disabled');
            loading.innerHTML = 'Solve the captcha to add to cart.';
            alarm.play();
        }

        if(document.querySelector('.cart-buttons .btn-transparent-black.checkout') && !checkoutOpened){
            checkoutOpened = true;
            jQuery('.cart-buttons .btn-transparent-black.checkout')[0].click();
        }
    }, 1000);
})();