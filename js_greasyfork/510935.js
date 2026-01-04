// ==UserScript==
// @name         Migros online, auto-add basket
// @namespace    http://tampermonkey.net/
// @version      2025.12.11
// @description  list migro online - alpha phase
// @author       You
// @match        https://www.migros.ch/fr/product/*
// @match        https://127.0.0.1/recipeshopping/web/index.php?r=shopping-list*
// @match        https://ace-developement.ch/recipeshopping/web/index.php?r=shopping-list%2Fview-online*
// @match        https://ace-developement.ch/recipeshopping/web/index.php?r=shopping-list/view-online*
// @match        https://www.migros.ch/fr/404?url=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=migros.ch
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510935/Migros%20online%2C%20auto-add%20basket.user.js
// @updateURL https://update.greasyfork.org/scripts/510935/Migros%20online%2C%20auto-add%20basket.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log('clinely is also watching u')
    const queryString = window.location.search; //?context=online&rsclick=mo-product-detail-add-to-basket%20span
    const urlParams = new URLSearchParams(queryString);
    const rs_click = urlParams.get('rsclick'); //mo-product-detail-add-to-basket span
    const rs_mode = urlParams.get('rsmode');
    const rs_next = urlParams.get('rsnext');

    const shopping_list = ((urlParams.get('r')=='shopping-list/view-online') ? true : false);
    const query_btn_basket = 'mo-add-to-shopping-list-details-page button';//mo-product-detail-add-to-basket span
    const query_btn_plus = 'button.btn-plus';
    const query_missing_item = 'mo-product-detail-hints div';

    const default_product = {
        'availability':'unknown'
    }
    const s_n = 'rsmigrosstore';
    const c_n = 'rsmigroscart';
    var id = '';

    check_404(window.location.href)

    const observeUrlChange = () => {
        let oldHref = document.location.href;
        const body = document.querySelector('body');
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;

                console.log('changed url',oldHref)
                check_404(oldHref)
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    };

    window.onload = observeUrlChange;



    if(rs_mode || shopping_list){

        var store = {};
        var product = {};

        function checkGMdata(refresher) {
            var elm = refresher.nextElementSibling.querySelector('.migros-id')
            if(elm){
                var tmpid = elm.getAttribute('migros-id')
                GM.getValue(s_n+'-'+tmpid, "{}").then((res)=>{
                    if(res!="{}"){
                        elm.innerText = res;
                        elm.setAttribute('ajax-value',res);
                        var old = elm.getAttribute('data-migros-old')
                        if(res != old){
                            console.log(tmpid,'not same',res,'vs',old)
                            try {
                                var old_json = JSON.parse(old)
                                if(old_json['date']){
                                    console.log(tmpid,'oldjson has date',old_json['date'])
                                    if(JSON.parse(res)['date']){
                                        console.log(tmpid,'newjson has date',JSON.parse(res)['date'])

                                        if((new Date(old_json['date'])) < (new Date(JSON.parse(res)['date']))){
                                            elm.click();
                                        }
                                        else console.log(tmpid,'olddate older')
                                    }
                                    else {
                                        //elm.click();
                                        console.log(tmpid,'newjson doesnt have a date')
                                    }
                                }

                                else elm.click();
                            } catch (error) {
                                elm.click();
                            }

                        }
                    }
                    setTimeout(function() { checkGMdata(refresher); }, 4000); // somehow this stops when it should not (d'esnt get called when it should)

                });
            }
            else console.log("FAILED",refresher)
        }

        if(shopping_list){

            waitForElmLoop('.row-refresher',function(elm){ checkGMdata(elm); })

            function checkCartdata() {
                GM.getValue(c_n, "{}").then((cart)=>{

                    if(cart!="{}"){
                        console.log('cart2',cart)
                        waitForElm('.current-cart').then(basketdiv => {
                            basketdiv.innerText = cart;
                            basketdiv.setAttribute('ajax-value',cart);
                            var old = basketdiv.getAttribute('data-migros-old')
                            if(cart != old){
                                console.log('cart not same')
                                try {
                                    var old_json = JSON.parse(old)
                                    if(old_json['date']){
                                        console.log('cart oldjson has date',old_json['date'])
                                        if((new Date(old_json['date'])) < (new Date(JSON.parse(cart)['date']))){
                                            basketdiv.click();
                                        }
                                    }

                                    else basketdiv.click();
                                } catch (error) {
                                    basketdiv.click();
                                }

                            }
                            else console.log('cart == old',cart,old)
                            setTimeout(function() { checkCartdata(); }, 4000);
                        });
                    } else setTimeout(function() { checkCartdata(); }, 4000);

                });
            }
            checkCartdata();



        }

        if(rs_mode == 'gather'){
            id = (window.location.href).split('?')[0].split("product/").pop();

            console.log('gather');

            waitForElm(query_btn_basket+','+query_btn_plus).then(btn_basket =>{

                console.log('btn_basket',btn_basket);

                var currentdate = new Date();
                var datetime = ""
                + currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1) + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

                var price_quantity = document.querySelector('mo-product-detail-price-quantity')
                if(price_quantity)
                    price_quantity = price_quantity.innerText
                else price_quantity = ''

                product = {
                    'availability':'yes',
                    'price':document.querySelector('mo-product-detail-price *[id]').innerText,
                    'quantity':document.querySelector('mo-product-detail-quantity *[id]').innerText, //cdk-visually-hidden
                    'price-quantity':price_quantity,
                    'date':datetime
                }

                GM.setValue(s_n+'-'+id, JSON.stringify(product)).then(()=>{
                    console.log('set btn_basket',product);
                    nextProduct('available');
                });
            })
            waitForElm(query_missing_item).then(error_message =>{

                console.log('error_message',error_message.innerText);

                var currentdate = new Date();
                var datetime = ""
                + currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1) + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

                product = {
                    'availability':error_message.innerText,
                    'date':datetime
                }
                GM.setValue(s_n+'-'+id, JSON.stringify(product)).then(()=>{
                    console.log('set error_message');
                    nextProduct('not_available');
                });
            })
            setTimeout(() => {
                console.log('timeout')
                if(document.querySelector(query_btn_basket+','+query_btn_plus)){}else{


                    console.log('btn still not found')
                    if(check_404(window.location.href)){
                        console.log('was actually 404')
                    }else{
                        console.log('not 404, so let\'s skip')
                        var currentdate = new Date();
                        var datetime = ""
                        + currentdate.getFullYear() + "-"
                        + (currentdate.getMonth()+1) + "-"
                        + currentdate.getDate() + " "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":"
                        + currentdate.getSeconds();

                        product = {
                            'availability':'pas dispo, mais pas d\'info',
                            'date':datetime
                        }
                        GM.setValue(s_n+'-'+id, JSON.stringify(product)).then(()=>{
                            console.log('set error_message');
                            nextProduct('not_available');
                        });

                    }
                }
            },"15000");

        }

        else if(rs_mode == 'addbasket'){
            console.log('mode',rs_mode)
            waitForElm(query_btn_basket).then(btnBasket => {
                console.log('rsclick : ',rs_click)
                btnBasket.click();
                const rsAmount = urlParams.get('rsamount');
                if(rsAmount && rsAmount > 1){
                    console.log('rsamount : ',rsAmount)
                    waitForElm(query_btn_plus).then(btnPlus =>{
                        for (let i = 1; i < rsAmount; i++)
                            btnPlus.click();
                        nextProduct('clicked');
                    })


                } else nextProduct('clicked');
            });

        }

    }else {
        console.log('nothing clinely')
        get_basket();
    }

    function nextProduct(status,force_url=false){
        console.log('next',id)
        var tmpparams = new URLSearchParams(queryString)
        if(force_url)
            tmpparams = new URLSearchParams(force_url)

        var tmp_rs_next = tmpparams.get('rsnext')
        var tmp_rs_mode = tmpparams.get('rsmode')

        if(tmp_rs_next){
            console.log('tmp_rs_next',tmp_rs_next)
            function redirect(){
                setTimeout(() => {
                    console.log("Delayed for 1 second.");
                    var url = 'https://www.migros.ch/fr/product/';

                    const parts = tmpparams.get('rsnext').split('-');
                    var next_id = parts[0];
                    var rsnext_new = (parts.length < 2)?tmp_rs_next:parts.slice(1).join('-')

                    tmpparams.delete('rsnext')
                    if(rsnext_new != tmp_rs_next)
                        tmpparams.append('rsnext',rsnext_new)

                    url += next_id
                    url += "?"+tmpparams.toString()

                    console.log('url',url)

                    //alert('redirect : '+url)
                    window.location = url
                }, "10000");
            }
            if(tmp_rs_mode == 'gather'){
                redirect();
            }
            else{
                waitForElm('aside a[href*="/'+id+'"]').then(cart_product => {

                    console.log(cart_product);
                    redirect();

                })
            }
        }
        else {
            // Get the current URL without parameters
            const urlWithoutParams = window.location.origin + window.location.pathname;

            // Update the URL using history.pushState
            window.history.pushState({}, document.title, urlWithoutParams);

            get_basket();

        }

    }
    function get_basket(){
        document.querySelectorAll('mo-shopping-list mo-shopping-list-item article')

        waitForElm('mo-shopping-list mo-shopping-list-item article').then(el =>{
            var currentdate = new Date();
            var datetime = ""
            + currentdate.getFullYear() + "-"
            + (currentdate.getMonth()+1) + "-"
            + currentdate.getDate() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
            var cart = {'date':datetime}
            document.querySelectorAll('mo-shopping-list mo-shopping-list-item article').forEach(article => {
                cart[article.querySelector('a').getAttribute('href').split("product/").pop()] = article.querySelector('mo-shopping-list-quantity-edition .quantity-value').innerText

            })
            console.log('cart',cart)
            GM.setValue(c_n, JSON.stringify(cart)).then(()=>{
                console.log('set cart');
                GM.getValue(c_n, "{}").then((cart)=>{
                    console.log('cart2',cart)
                });
            });
        })
    }

    function check_404(href) {
        if((href).includes('migros.ch/fr/404?url')){
            const tmp_urlParams  = new URLSearchParams( document.location.search)
            const redirect_url = tmp_urlParams.get('url');
            console.log('url',redirect_url);
            if(redirect_url.includes('rsmode')){

                id = redirect_url.split('?')[0].split("product/").pop();
                console.log('gathering', redirect_url.split('?')[1])
                console.log('gathering', (new URLSearchParams(redirect_url.split('?')[1])).get('rsmode'))

                console.log('gathering',id)


                var currentdate = new Date();
                var datetime = ""
                + currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1) + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();



                product = {
                    'availability':'page 404',
                    'date':datetime
                }
                GM.setValue(s_n+'-'+id, JSON.stringify(product)).then(()=>{
                    console.log('set notavailable',s_n+'-'+id)
                    nextProduct('not_available',redirect_url.split('?')[1]);
                });
                return true;

            }
            return false;
        }
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });

    }

    function waitForElmLoop(search,then_do){
        waitForElm(search+':not(.watched)').then((elm) => {
            then_do(elm);
            elm.classList.add('watched')
            waitForElmLoop(search,then_do)
        });
    }


})();