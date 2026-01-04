// ==UserScript==
// @name         p bandai item
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  try to take over the world!
// @author       Kim
// @match        https://p-bandai.com/hk/*
// @icon         https://p-bandai.com/icon/favicon.ico
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/448914/p%20bandai%20item.user.js
// @updateURL https://update.greasyfork.org/scripts/448914/p%20bandai%20item.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // $(document).ready(function(){
    //random second
    var random1 = 5;
    var random2 = 20;
    var random = 0;
    var superInterval;
    var errorInterval;
    var cartUrl = "https://p-bandai.com/hk/cart";
    var currentPath = window.location.pathname;
    var retryLimit = 10;
    var retry = 0;
    var qty = 1;
    // var startTime = Date.now();
    // var currentTime;
    var success = false;

    const targetStartTime = new Date();
    targetStartTime.setHours(14, 59, 59, 0); // Set to 14:59:59.000
    var headData = {};

    const qtyInput = document.createElement('input');
    qtyInput.type = 'text';
    qtyInput.value = qty;
    qtyInput.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px; background-color: #007bff; color: white; cursor: pointer;';
    qtyInput.id = "qty-input";

    const qtyInputLabel = document.createElement('label');
    qtyInputLabel.htmlFor = "qty-input";
    qtyInputLabel.textContent = "QTY:"
    qtyInputLabel.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px;';

    const maxQtyButton = document.createElement('button');
    maxQtyButton.textContent = 'Max Qty';
    maxQtyButton.style.cssText = 'position: fixed; top: 50px; right: 10px; z-index: 9999; padding: 10px; background-color: #007bff; color: white; border: none; cursor: pointer;';

    function reloadTimer (error=null) {
        console.log(`${random/1000} second(s) to reload`);
        setTimeout( function() {
            console.log("reload");
            if (error) {
                window.location.replace(document.referrer);
            } else {
                location.reload();
            }
        }, random);
    }

    function reloadRandom () {
        random = Math.floor((Math.random() * random2) + random1) * 100;
        console.log(`${random/1000} second(s) to reload`);
    }

    reloadRandom();

    function getInfoFromHeadScripts() {
        var result={};
        if (!document.head) {
            console.error("document.head is not available yet.");
            return null;
        }
        const scripts = document.head.querySelectorAll('script');
        scripts.forEach(script => {
            // for (const script of scripts) {
            const scriptContent = script.innerHTML;
            if(scriptContent) {
                const csrfTokenMatch = scriptContent.match(/"csrfToken":"([^"]+)"/);
                const areaItemNoMatch = scriptContent.match(/"areaItemNos":\["([^"]+)"\]/);
                const maxQuantityMatch = scriptContent.match(/"maxQuantity":\s*(\d+)/);
                if (csrfTokenMatch && csrfTokenMatch[1]) {
                    result.csrfToken = csrfTokenMatch[1];
                }
                if (areaItemNoMatch && areaItemNoMatch[1]) {
                    result.areaItemNo = areaItemNoMatch[1];
                }
                if (maxQuantityMatch && maxQuantityMatch[1]) {
                    result.maxQty = maxQuantityMatch[1];
                }
                console.log(result);
                // return result;
            }
        });
        return result;
    }

    let csrfToken, areaItemNo, maxQty;

    setTimeout(()=> {
        headData = getInfoFromHeadScripts();

        csrfToken = headData.csrfToken;
        areaItemNo= headData.areaItemNo;
        maxQty = headData.maxQty;

        if (currentPath.includes('item')){
            document.body.appendChild(qtyInput);
            document.body.appendChild(qtyInputLabel);
            document.body.appendChild(maxQtyButton);
            if (csrfToken && areaItemNo) {
                console.log('Successfully extracted CSRF Token:', csrfToken, 'and areaItemNo:', areaItemNo);
                // Start checking
                checkAndStart();
            } else {
                console.warn('CSRF Token not found in head scripts. Please inspect the page source to find its exact location and pattern.');
                // You might want to halt execution or display an error to the user if the token is critical and cannot be found.
                reloadTimer();
            }
        }}, 1000);
    qtyInput.addEventListener('change', function(e) {
        // console.log('Tampermonkey button clicked!');
        // addToCartResult = addToCart();
        qty = e.target.value;
        console.log("Qty changed to ", qty);
    });
    maxQtyButton.addEventListener('click', function() {
        qty = maxQty;
        qtyInput.value = qty;
        console.log("Qty changed to ", qty, " (max qty)");
    });

    async function addToCart() {
        const url = 'https://p-bandai.com/api/cart/addToCart';
        const headers = {
            'Content-Type': 'application/json', // Change this based on your inspection (e.g., 'application/x-www-form-urlencoded')
            'X-CSRF-TOKEN': csrfToken, // Crucial for many sitesk
            'Accept': 'application/json, text/plain, */*',
            'X-Requested-With': 'XMLHttpRequest', // Often sent with AJAX requests
            // 'Referer': 'https://p-bandai.com/hk/item/A2805123001', // Sometimes needed
            // 'Origin': 'https://p-bandai.com',
            'X-G1-Area-Code': 'hk',
            // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
            // Add any other critical headers you found
        };
        const payloadData = [{areaItemNo: areaItemNo, "qty":qty}];
        const requestPayload = JSON.stringify(payloadData);

        // GM_xmlhttpRequest({
        //     method: "POST",
        //     url: url,
        //     headers: headers,
        //     data: requestPayload,
        //     onload: function(response) {
        //         console.log("Response from server:", response);
        //     },
        //     onerror: function(error) {
        //         console.error("Error connecting to server:", error);
        //     }
        // });
        // fetch(url, {
        //     method: 'POST',
        //     headers: headers,
        //     body: requestPayload,
        //     credentials: 'same-origin'
        // }).then(res=>{
        //     console.log(res);
        // }).then(data=>{
        //     console.log(data)
        // }).catch(error=>{
        //     console.error(error)
        // });
        const result = await axios.post(url, payloadData, { headers: headers }).then(res=>{
            console.log(res);
            if (res.status === "200" || res.status === 200) {
                success = true;
                clearInterval(superInterval);
                superInterval = null;
                console.log("Button clicked, clear interval");
            }
            return res;
        }).catch(error=>{
            console.error(error);
            retry++;
            return error;
        });
        return result;
    }

    function checkError() {
        if ($("body").length >= 1) {
            if ($("body").hasClass("p-error")) {
                console.warn("Website error!");
                // clearInterval(errorInterval);
                reloadTimer(true);
            }
            var busy = $(document).find(".p-error__heading");
            var title = document.title;
            if (busy && busy.text().includes("network congestion") && title === "PREMIUM BANDAI [Official]") {
                console.warn("busy");
                // clearInterval(errorInterval);
                reloadTimer(true);
            }
            console.log("checked");
            // clearInterval(errorInterval);
            console.log("clear");
        }
    }

    async function checkCheckOut () {
        // const checkOut = $(".p-button.p-button--red");
        // const qtySelector = $("#sc_p07_01_purchaseNumber");
        // const itemName = checkOut.closest(.o-product__description").find(".o-product__name");
        // var popupInterval;
        // var addToCartResult;
        console.log(superInterval);
        if(retry === retryLimit){
            clearInterval(superInterval);
            superInterval = null;
            console.error("Mission Failed");
            showBrowserNotification(false, $('.o-items__sidebar-title').text(), 'Failed to add cart, see you next time!', 'https://p-bandai.com/icon/favicon.ico');
            return;
        } else if (csrfToken && areaItemNo && superInterval/*checkOut.length > 0 && qtySelector.length > 0 && */) {
            // console.log("check out button OK, qty OK");
            // if (qtySelector.val() !== qty) {
            //     qtySelector.val(qty).change();
            //     console.log("Qty change to ", qty);
            // }
            // if (!!checkOut.attr("disabled")||checkOut.attr("disabled") === "disabled"){
            //     console.log("Force enabled addToCartButton");
            //     checkOut.removeAttr('disabled');
            // }
            // console.log("Qty OK");
            // checkOut[0].click();
            // setTimeout(function() {
            // checkOut.trigger("click");
            // }, 1000);
            const addToCartResult = await addToCart();

            if(addToCartResult.status === 200){
                showBrowserNotification(true, $('.o-items__sidebar-title').text(), 'Added to cart, congrats', 'https://p-bandai.com/icon/favicon.ico');
            } else {
                // console.error(addToCartResult.message);
                reloadRandom();
                return;
            }

            // popupInterval = setInterval(function(){
            //     if($("#addToCartLayer").length === 0) {
            //         console.log("nothing");
            //         return;
            //     } else if($("#addToCartLayer").length > 0 && $(".a-alert.a-alert--danger.a-alert--center").length < 5){
            //         const cart = $("#addToCartLayer").find(".o-modal__content").find(".m-btn-group").find("a");
            //         clearInterval(popupInterval);
            //         console.log("Adding to cart");
            //         GM_notification({text:itemName.text(), title:"STOCK!", onclick: function(){
            //             GM_openInTab(cartUrl);
            //         }});
            //         // clearTimeout(loadTimer);
            //         clearInterval(superInterval);
            //         // console.log("Timer stopped")
            //         if (cart.length > 0) {
            //             cart[0].click();
            //             // cart.trigger("click");
            //         }
            //     } else if($("#addToCartLayer").length > 0 && cart.length === 0) {
            //         clearInterval(popupInterval);
            //         // location.reload();
            //         console.warn("Cannot add to cart");
            //         if ($('.o-modal__close.a-close') && $('.o-modal__close.a-close').length > 0) {
            //             // $('.o-modal__close.a-close')[0].click();
            //             $('.o-modal__close.a-close').trigger("click");
            //         } else {
            //             // reloadTimer();
            //             return;
            //         }
            //     }
            // }, 500);
        } else {
            // location.reload();
        }
    }

    // Function to check if the current time is past the target start time
    function checkAndStart() {
        console.log("Checking time");
        const now = new Date();
        if (now >= targetStartTime && !success) {
            // errorInterval = setInterval(checkError, 100);
            // checkError();
            // Start calling goPurchase every 100 milliseconds
            console.log("Game Start");
            superInterval ??= setInterval(checkCheckOut, random);
        } else {
            // Check again after a short delay
            // console.log("Not yet");
            setTimeout(checkAndStart, 500);
        }
    }

    // if (window.location.href !== cartUrl) {
    // reloadTimer();
    //         var intervalId = setInterval(() => {
    //             currentTime = Date.now();
    //             var elapsedTime = currentTime - startTime; // Calculate elapsed time in milliseconds

    //             // Convert elapsed time to seconds
    //             var seconds = Math.floor(elapsedTime / 1000);

    //             // console.log(`Elapsed time: ${seconds} seconds`, currentTime);
    //             checkError(intervalId);
    //             checkCheckOut(intervalId, timer);
    //         }, 100); // Run every 1000 milliseconds (0.1 second)

    //         setTimeout(() => {
    //            clearInterval(intervalId);
    //            console.log('Stopped tracking time.');
    //         }, 10000 * 6 * 30); // Stops after 0.5 hour


    //         if(checkOut && checkOut.length > 0 && !checkOut.attr("disabled")){
    //             if($("#sc_p07_01_purchaseNumber") && $("#sc_p07_01_purchaseNumber").length > 0 && $("#sc_p07_01_purchaseNumber").val() === qty) {
    //                 console.log("Qty = ", qty);
    //                 checkOut.click();
    //                 console.log("Adding to cart");
    //             } else {
    //                 $("#sc_p07_01_purchaseNumber").val(qty);
    //                 console.log("Qty abnormal, change to ", qty);
    //                 checkOut.click();
    //                 console.log("Adding to cart");
    //             }
    //             } else {
    //                 console.log("Add to cart button disabled");
    //             }
    // }

    function showBrowserNotification(success = false, title, message, imageUrl = '') {
        // Check if the browser supports notifications
        if (!("Notification" in window)) {
            console.warn("This browser does not support desktop notification");
            return;
        }

        // Check if notification permission has been granted
        if (Notification.permission === "granted") {
            const noti = new Notification(title, {
                body: message,
                icon: imageUrl // Optional: URL to an image for the notification icon
            });
            if (success) {
                noti.onclick = (event) => {
                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                    window.open(cartUrl, "_blank");
                };
            } else {
                noti.onclick = (event) => {
                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                    window.open(window.location.href, "_self");
                };
            }
        } else if (Notification.permission !== "denied") {
            // Request permission from the user
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    new Notification(title, {
                        body: message,
                        icon: imageUrl
                    });
                } else {
                    console.warn("Notification permission denied.");
                }
            });
        } else {
            console.warn("Notification permission previously denied by user.");
        }
    }

    // Usage:
    // showBrowserNotification("Item Added!", "Your item has been successfully added to the cart.", "https://example.com/icon.png");

    // if (window.location.href === cartUrl) {
    //     const cartQty = $(".m-cart__item.m-cart__item--quantity").find(".a-input-select").find("span").text();
    //     if (cartQty === qty) {
    //         console.log("Qty OK!, let's process payment");
    //         const checkOutButton = $('.o-cart__item.o-cart__foot').find('.m-cart--foot__fee__btn').find('a');
    //         if (checkOutButton.length > 0) {
    //             GM_notification({text:'P-bandai', title:"GO PAYMENT!", onclick: function(){
    //                 GM_openInTab(cartUrl);
    //             }});
    //             // checkOutButton.click();
    //             checkOutButton.trigger("click");
    //         } else {
    //             console.warn("Checkout button error, trying again");
    //             reloadTimer();
    //         }
    //     } else if (cartQty === "0") {
    //         console.warn("No stock, trying again");
    //         reloadTimer();
    //     }
    // }
    // })
})();