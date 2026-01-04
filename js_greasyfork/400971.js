// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://sellercentral.amazon.es/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400971/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/400971/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top != window.self)
    {
        return;
    }

    var incompleteOrderIds = JSON.parse(localStorage.getItem("incomplete_order_ids") || '[]')
    createButton();

    if(incompleteOrderIds.length > 0)
    {
        const currentOrderId = incompleteOrderIds.shift();
        if(window.location.href === "https://sellercentral.amazon.es/orders-v3/order/" + currentOrderId)
        {
            parseOrderData(currentOrderId);
        }
        else
        {
            redirectToNextOrderPage(currentOrderId);
        }
    }
    else
    {
        const orderData = localStorage.getItem("order_data");
        if(orderData !== null)
        {
            sendOrderData(orderData);
        }
    }

    function createButton()
    {
        const button = document.createElement("button");
        button.style.position = "fixed";
        button.style.right = "20px";
        button.style.bottom = "20px";
        button.style.padding = "10px";

        if(incompleteOrderIds.length === 0)
        {
            button.innerHTML = "Scrapear información de pedidos";
            button.addEventListener("click", getIncompleteOrderIds);
        }
        else
        {
            button.innerHTML = "Scrapeando pedido " + incompleteOrderIds[0] + ", faltan " + incompleteOrderIds.length + "...";
        }

        document.body.appendChild(button);
        return button;
    }

    function getIncompleteOrderIds()
    {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if(request.readyState === XMLHttpRequest.DONE)
            {
                localStorage.setItem("incomplete_order_ids", request.responseText);
                redirectToNextOrderPage();
            }
        };
        request.open("GET", "https://www.electropolis.es/openboxes/get_incomplete_orders.php");
        request.send();
    }

    function sendOrderData(orderData)
    {
        var formData = new FormData();
        formData.append("order_data", orderData);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE)
            {
                if(xhr.status === 201)
                {
                    localStorage.removeItem("order_data");
                }
            }
        };
        xhr.open("POST", "https://www.electropolis.es/openboxes/receive_order_data.php");
        xhr.send(formData);
    }

    function parseOrderData(orderId)
    {
        const continueToNextOrder = function()
        {
            localStorage.setItem("incomplete_order_ids", JSON.stringify(incompleteOrderIds));
            window.setTimeout(function() {
                redirectToNextOrderPage(incompleteOrderIds.shift());
            }, Math.round(Math.random() * 3000));
        };

        const interval = window.setInterval(function()
        {
            // Si detectamos que el pedido ha sido cancelado pasamos directamente al siguiente
            const alerts = document.querySelectorAll(".a-alert-heading")
            for(var i=0; i<alerts.length; i++)
            {
                const alert = alerts[i];
                if(alert.innerText === "Pedido cancelado")
                {
                    clearInterval(interval);
                    console.log("Pedido cancelado, seguimos con el siguiente...");
                    continueToNextOrder();
                    return;
                }
            }

            // Si todavía no se han mostrado los datos de la dirección esperamos un poco más
            if(document.querySelector('[data-test-id="shipping-section-buyer-address"] span:nth-child(1)') === null)
            {
                return;
            }

            clearInterval(interval);

            const name = document.querySelector('[data-test-id="shipping-section-buyer-address"] span:nth-child(1)').innerText;
            const street1 = document.querySelector('[data-test-id="shipping-section-buyer-address"] span:nth-child(2)').innerText;
            var street2 = "";
            var telephone = "";
            if(document.querySelector('[data-test-id="shipping-section-phone"]') !== null)
            {
                telephone = document.querySelector('[data-test-id="shipping-section-phone"]').innerText;
            }

            if(document.querySelector('[data-test-id="shipping-section-buyer-address"]').children.length > 6)
            {
                street2 = document.querySelector('[data-test-id="shipping-section-buyer-address"] span:nth-child(3)').innerText;
            }

            console.log(name);
            console.log(street1);
            console.log(street2);
            console.log(telephone);

            var orderData = JSON.parse(localStorage.getItem("order_data") || "{}");
            orderData[orderId] = {
                name: name,
                street1: street1,
                street2: street2,
                telephone: telephone
            };
            localStorage.setItem("order_data", JSON.stringify(orderData));
            continueToNextOrder();

        }, 200);
    }

    function redirectToNextOrderPage(orderId)
    {
        if(orderId !== undefined)
        {
            window.location = "https://sellercentral.amazon.es/orders-v3/order/" + orderId;
        }
        else
        {
            window.location = "https://sellercentral.amazon.es/";
        }
    }

})();