// ==UserScript==
// @name         amount of products on the product page
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Shows the amount of products at the top of the products table, enlarges the order history field, adds item tax to table
// @author       Ruben Van Hee @ Lightspeedhq
// @run-at       document-end
// @match        https://*.webshopapp.com/admin/orders/*
// @match        https://*.shoplightspeed.com/admin/orders/*
// @downloadURL https://update.greasyfork.org/scripts/394189/amount%20of%20products%20on%20the%20product%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/394189/amount%20of%20products%20on%20the%20product%20page.meta.js
// ==/UserScript==

!function(){
function itemCount(){
/* unique product count */
    var count = document.getElementsByClassName("order-product-item");
    count = count.length;
/* total amount count */
    let total = 0;
    $('table.-no-border.-no-shadow tr[id] > td.NoWrap > div').each((i, amount)=>{
        total = total + parseInt(amount.innerText.split(' x ')[0],10);
    })
/* painting */
    console.log("there are " +count+ " unique items in the order, "+total+" in total");
    document.querySelectorAll('h2.P1')[2].insertAdjacentHTML('beforeend', " | unique:(" +count+ "), total:(" +total+ ")");
    document.getElementsByClassName('order-events')[0].style.height = "100%";
/* tax per product */
    let t;
    let url = location.origin + location.pathname+'.json';
    let e = new XMLHttpRequest();
    	e.open("GET", url, true),
    	e.onload = function(){
    	if ( e.status >= 200 && e.status < 400 ){
                t = JSON.parse( e.responseText );
                document.querySelectorAll('th[class="-auto tr"]')[0].parentNode.insertAdjacentHTML('beforeEnd','<th><span>VAT</span></th>');
                t.order.order_products.forEach((item,i) => {
                    document.querySelectorAll(`tr[data-id='${item.id}']`)[0].insertAdjacentHTML('beforeEnd','<td class="NoWrap">'+item.variant.tax.tax_format+'</td>');
                })
            }
        },
        e.send();
    setTimeout(function(){console.log(t);},1000);
    }
document.addEventListener("DOMContentLoaded", itemCount);  //calls function when loaded
}();