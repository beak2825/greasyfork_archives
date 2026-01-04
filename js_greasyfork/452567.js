// ==UserScript==
// @name         哆奇查訂單
// @namespace    https://mesak.tw
// @version      1.1
// @description  幫你查訂單
// @author       Mesak
// @match        https://www.dokiitoys.com/member/orderlist
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dokiitoys.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452567/%E5%93%86%E5%A5%87%E6%9F%A5%E8%A8%82%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/452567/%E5%93%86%E5%A5%87%E6%9F%A5%E8%A8%82%E5%96%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var token = document.querySelector('input[name="_token"]').value;
    var orderUrl = document.querySelector('#orderquery').getAttribute('action');
    console.log( token) ;
    for (let orderNode of document.querySelectorAll('.order_list_inner')) {
        let no = orderNode.querySelector('.item_orders_number').dataset.no;
        let parent = orderNode.parentNode;
            parent.classList.add('ordersearch_area');
        let list = parent.dataset.list;
        let div = document.createElement("div");
            div.setAttribute('class','cart_detail_area' )
            parent.append(div);
        orderNode.querySelector('.order_again').innerHTML = `<button class="js_view_order el_btn sm solid el_rounded el_text m-0 w-100 js_hover_effect" data-no="${no}" data-list="${list}">查看訂單</button>`
    }
    document.querySelector('.order_list_area').addEventListener('click', (event) => {
        if( event.target.classList.contains('js_view_order') ){
         let node = event.target
          getOrder( node.dataset.no).then(( subDocument )=>{
               //console.log( subDocument.querySelector("#js_order_cart_list") )
               let productArea = '';
               for (let itemProductNode of subDocument.querySelectorAll("#js_order_cart_list .item_product")) {
                   productArea += itemProductNode.outerHTML
               }
               document.querySelector(`.group_list_area[data-list="${node.dataset.list}"] > .cart_detail_area`).innerHTML = productArea
          })
        }
    })
    function getOrder(no){
        return fetch(orderUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token : token ,
                order_no : no
            }),
        }).then((response) => {
            return response.text().then(body => new DOMParser().parseFromString(body, "text/html"))
        })
    }
})();