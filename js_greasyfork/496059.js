// ==UserScript==
// @name         SecondLife MarketPlace Mod
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Add useful features for SecondLife MarketPlace
// @author       JMRY
// @match        https://marketplace.secondlife.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=secondlife.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/496059/SecondLife%20MarketPlace%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/496059/SecondLife%20MarketPlace%20Mod.meta.js
// ==/UserScript==
/*
1.1.5 20250818
- 优化商品列表，显示商品URL。

1.1.4 20250730
- 加入一键获取所有收藏、愿望单、订单功能。

1.1.3 20250613
- 调整已购、收藏、愿望单标记的优先级。
- 修复商品页面只显示第一个商品日期的bug。

1.1.2 20250612
- 加入收藏夹和愿望单标记显示。
- 优化数据库结构，提升性能。
- 优化文本布局，适配新版商店页面。
- 修复已购商品有可能无法正确记录的bug。

1.1.1 20250526
- 优化数据结构，提升性能。
- 优化数据读取逻辑，降低异步时出现异常的概率。

1.1.0 20250520
- 优化订单页图片加载机制，通过记忆商品图片URL以减轻服务器负担。
- 优化数据存储机制，将LocalStorage迁移到indexedDB，以增加存储容量。

1.0.5.4 20250516
- 加入订单页图片加载失败重试机制。
- 优化脚本结构，加快载入速度。
- 优化订单页图片加载逻辑，提升加载速度。
- 修复商品页面没有Version字段时，上传时间不显示的bug。

1.0.5.3 20250512
- 适配新版商品页面。

1.0.5.2 20250217
- 修复订单列表中有订阅时，商品图会错位的bug。

1.0.5.1 20250108
- 加入搜索文本高亮功能。
- 修复搜索bugs。

1.0.5 20250108
- 加入收藏夹、愿望单、收藏商店搜索功能（仅限本地）。

1.0.4 20241107
- 加入已购商品标记功能（仅限本地）。

1.0.3 20241018
- 适配新版页面，修复商品日期不显示、订单页不显示图片的bug。

1.0.2 20240701
- 加入订单搜索页、送礼页显示商品图片功能。

1.0.1 20240604
- 加入订单页显示商品图片功能。

1.0 20240525
- 完成商店页、商品页显示日期时间功能。
*/

(async function() {
    const customStyle=`
    .product-favorite{
        background:#ffeedd !important;
    }
    .product-wishlist{
        background:#ffbbee !important;
    }
    .product-bought{
        background:#bdebcc !important;
    }
    .line_items img, .line-item-gift img{
        max-width:100px;
    }
    .product-listing.gallery .gallery-item{
        height:auto !important;
    }
    .product-row p.small{
        padding-left:2px;
    }
    `;
    function urlMatch(url){
        if(window.location.href.includes(url)){
            return true;
        }else{
            return false;
        }
    }
    String.prototype.replaceAll=function(org,tgt){
        return this.split(org).join(tgt);
    }
    Date.prototype.format = function(fmt) {
        let o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            S: this.getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
                );
            }
        return fmt;
    }
    function ajaxPromise(url, type=`GET`, post){
        return new Promise((resolve, reject)=>{
            $.ajax({
                url: url,
                type: type,
                data: post,
                success: function(rs){
                    resolve(rs);
                },
                error: function(rs){
                    reject(rs);
                }
            });
        });
    }

    async function loadLDB(key){
        return new Promise(resolve=>{
            const dbRequest = indexedDB.open(`localDB`, 1);
            dbRequest.onupgradeneeded = (event) => {
                let db = event.target.result;
                if (!db.objectStoreNames.contains(`content`)) {
                    db.createObjectStore(`content`, { keyPath: `key`});
                }
            };
            dbRequest.onsuccess = (event) => {
                let db = event.target.result;
                let tx = db.transaction(`content`, `readonly`);
                let store = tx.objectStore(`content`);

                let getRequest = store.get(key);
                getRequest.onsuccess = async (event) => {
                    if (event.target.result) {
                        resolve(event.target.result.data);
                    }else{
                        resolve(null);
                    }
                };
            };
        });
    }

    async function saveLDB(key,data){
        return new Promise((resolve,reject)=>{
            const dbRequest = indexedDB.open(`localDB`, 1);
            dbRequest.onupgradeneeded = (event) => {
                let db = event.target.result;
                if (!db.objectStoreNames.contains(`content`)) {
                    db.createObjectStore(`content`, { keyPath: `key` });
                }
            };
            dbRequest.onsuccess = (event) => {
                let db = event.target.result;
                let tx = db.transaction(`content`, `readwrite`);
                let store = tx.objectStore(`content`);
                store.put({key:key,data});

                tx.oncomplete = () => resolve(data);
                tx.onerror = (e) => reject(e);
            };
        });
    }

    async function delLDB(key){
        return new Promise((resolve,reject)=>{
            const dbRequest = indexedDB.open(`localDB`, 1);
            dbRequest.onupgradeneeded = (event) => {
                let db = event.target.result;
                if (!db.objectStoreNames.contains(`content`)) {
                    db.createObjectStore(`content`, { keyPath: `key` });
                }
            };
            dbRequest.onsuccess = (event) => {
                let db = event.target.result;
                let tx = db.transaction(`content`, `readwrite`);
                let store = tx.objectStore(`content`);
                store.delete(key);
                tx.oncomplete = () => resolve();
                tx.onerror = (e) => reject(e);
            };
        });
    }

    /*
    let defaultLocalStorageData={
        boughtProducts:{},
    };
    let localStorageData={};
    async function loadStorage(){
        let cd=await loadLDB(`localStorageData`);
        if(cd==null){
            localStorageData={
                ...defaultLocalStorageData,
            };
            await saveStorage();
        }else{
            localStorageData=cd;
        }
        return localStorageData;
    }

    async function saveStorage(){
        await saveLDB(`localStorageData`,localStorageData);
        return localStorageData;
    }
    */

    let boughtProducts;
    let boughtProductsMap=new Map();
    async function initBoughtProduct(){
        boughtProducts=await loadLDB(`boughtProducts`);
        if(!boughtProducts){
            boughtProducts={};
            await saveLDB(`boughtProducts`,boughtProducts);
        }
        for(let b in boughtProducts){
            boughtProductsMap.set(b, boughtProducts[b]);
        }
    }
    async function addBoughtProduct(url, date, imgsrc, refresh=true){
        //boughtProducts=await loadLDB(`boughtProducts`);
        if(!boughtProducts){
            boughtProducts=await loadLDB(`boughtProducts`);
        }
        let urlSp=url.split(`/`);
        let productId=urlSp[urlSp.length-1];
        let productName=urlSp[urlSp.length-2];
        boughtProducts[productId]=boughtProducts[productName]={
            id:productId, name:productName, url:url, date:new Date(date).format(`yyyy-MM-dd`), img:imgsrc,
        };
        //await saveLDB(`boughtProducts`,boughtProducts);
        if(refresh){
            await saveLDB(`boughtProducts`,boughtProducts);
            await initBoughtProduct();
        }
    }
    function getBoughtProduct(url){
        if(!url) return null;
        let urlSp=url.split(`/`);
        let productId=urlSp[urlSp.length-1];
        let productName=urlSp[urlSp.length-2];
        return boughtProductsMap.get(productName) || boughtProductsMap.get(productId);
    }
    function clearBoughtProduct(){
        boughtProducts={};
        saveLDB(`boughtProducts`,boughtProducts).then(()=>{
            initBoughtProduct();
        });
    }

    async function addFavoriteSearch(p){
        p=p.split(`?`)[0];
        $(`#wishlist-display, #favorite_stores-display`).prepend(`<input id="favSearchInput" style="height:32px;width:256px;padding-left:8px;padding-right:8px;"></input> <button id="favSearchBu">Search</button> <button id="favClearBu">Clear</button> <button id="favGetAllBu">Get All</button>`);
        $(`#favSearchInput`).bind(`keypress`,function(e){
            if (e.key === 'Enter' || e.keyCode === 13) {
                showSearchContainer($(`#favSearchInput`).val(), p);
            }
        });
        $(`#favSearchBu`).bind(`click`,function(){
            showSearchContainer($(`#favSearchInput`).val(), p);
        });
        $(`#favClearBu`).bind(`click`,function(){
            $(`#favSearchInput`).val(``);
            showSearchContainer();
        });
        $(`#favGetAllBu`).bind(`click`,function(){
            getAllFavorite(p);
        });
        await getFavoriteHtml(p);
    }

    async function getAllFavorite(p){
        let totalPages=parseInt($(`.page.next`).prev().text());
        if(!totalPages || isNaN(totalPages)) return;
        for(let i=1; i<=totalPages; i++){
            $(`#favGetAllBu`).html(`Get All: ${i} / ${totalPages}`);
            let url=`/${p}?page=${i}`;
            let html=await ajaxPromise(url);
            await getFavoriteHtml(p, html);
        }
        $(`#favGetAllBu`).html(`Get All: OK`);
    }

    let favoriteData;
    let favoriteProductData;
    async function initFavoriteData(){
        favoriteData=await loadLDB(`favoriteData`);
        favoriteProductData=await loadLDB(`favoriteProductData`);
        if(!favoriteData){
            favoriteData={};
            favoriteProductData={};
            await saveLDB(`favoriteData`,favoriteData);
            await saveLDB(`favoriteProductData`,favoriteProductData);
        }
    }
    async function getFavoriteHtml(p, html){
        //favoriteData=await loadLDB(`favoriteData`);
        if(!favoriteData[p]){
            favoriteData[p]=[];
        }
        if(!favoriteProductData[p]){
            favoriteProductData[p]={};
        }
        let tableEl=$(html || `body`).find(`#wishlist-list, #favorite-stores-list`).find(`tr`);
        for(let i=1; i<tableEl.length; i++){
            let cur=tableEl.eq(i);
            let curHtml=cur[0].outerHTML;
            if(!favoriteData[p].includes(curHtml)){
                favoriteData[p].push(curHtml);

                let url=cur.find(`a.listing-title`).attr(`href`);
                let urlSp=url.split(`/`);
                let productId=urlSp[urlSp.length-1];
                let productName=urlSp[urlSp.length-2];
                let productImg=cur.find(`img`).eq(0).attr(`src`);
                favoriteProductData[p][productId]=favoriteProductData[p][productName]={
                    id:productId, name:productName, url:url, imgsrc:productImg, html:curHtml,
                };
            }
        }
        await saveLDB(`favoriteData`,favoriteData);
        await saveLDB(`favoriteProductData`,favoriteProductData);
    }
    function getFavoriteProduct(p, url){
        if(!p || !url) return null;
        let urlSp=url.split(`/`);
        let productId=urlSp[urlSp.length-1];
        let productName=urlSp[urlSp.length-2];
        try{
            return favoriteProductData[p][productName] || favoriteProductData[p][productId];
        }catch(e){
            return null;
        }
    }

    async function showSearchContainer(search, p){
        await loadLDB(`favoriteData`);
        $(`#wishlist-list-search`).remove();
        let container=$(`#wishlist-list, #favorite-stores-list`);
        if(!search){
            container.css(`display`,``);
            $(`.footer-paginate`).css(`display`,``);
            return;
        }
        // 处理转义符
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        for(let e in entities){
            search=search.replaceAll(e,entities[e]);
        }
        let keywords=search.trim().split(` `);
        // 处理搜索结果
        let searchList=[];
        let favList=favoriteData[p];
        for(let i=0; i<favList.length; i++){
            let cur=favList[i];
            let isAllMatch=true;
            for(let kw of keywords){
                if(!cur.toLowerCase().includes(kw.toLowerCase())){
                    isAllMatch=false;
                }
            }
            if(isAllMatch){
                searchList.push(cur);
            }
        }
        container.css(`display`,`none`);
        $(`.footer-paginate`).css(`display`,`none`);
        container.after(`<table id="wishlist-list-search" class="index"><thead><tr><th><input type="hidden" name="select_all_products" id="select_all_products" value=""></th><th colspan="3">Product</th></tr></thead><tbody>${searchList.join(``)}</tbody></table>`);
        // 处理已购
        if(urlMatch(`/favorites`) || urlMatch(`/wishlist`)){
            let productEl=$(`#wishlist-list-search`).find(`tr`);
            for(let i=1; i<productEl.length; i++){
                let curEl=productEl.eq(i);

                let txtEl=curEl.find(`p`);
                let hlEl=[
                    txtEl.eq(0).find(`.listing-title`),
                    txtEl.eq(1),
                    txtEl.eq(3).find(`a, span`),
                ];
                for(let h=0; h<hlEl.length; h++){
                    hlEl[h].html(highlight(hlEl[h].html(), keywords));
                }

                let productUrl=curEl.find(`.listing-title`).attr(`href`);
                let productBought=getBoughtProduct(productUrl);
                if(productBought){
                    curEl.addClass(`product-bought`);
                    //curEl.find(`.small`).eq(-1).append(`<p class="small">Bought: ${productBought.date}</p>`);
                }
            }
        }else if(urlMatch(`/favorite_stores`)){
            let productEl=$(`#wishlist-list-search`).find(`tr`);
            for(let i=0; i<productEl.length; i++){
                let curEl=productEl.eq(i);
                let childEl=curEl.find(`.top-row`).find(`.column`);
                for(let j=0; j<childEl.length; j++){
                    let cEl=childEl.eq(j);

                    let txtEl=$(`.info`);
                    txtEl.html(highlight(txtEl.html(), keywords));

                    let productUrl=cEl.find(`.info`).attr(`href`);
                    let productBought=getBoughtProduct(productUrl);
                    if(productBought){
                        cEl.addClass(`product-bought`);
                        //cEl.find(`.info`).eq(0).append(`<p class="small">Bought: ${productBought.date}</p>`);
                    }
                }
            }
        }
    }

    function highlight(txt, kw){
        let keywords;
        if(typeof kw==`object`){
            keywords=kw;
        }else if(typeof kw==`string`){
            keywords=kw.split(` `);
        }else{
            return txt;
        }
        for(let k of keywords){
            let k_cases=[
                k,
                k.toLowerCase(),
                k.toUpperCase(),
                k.charAt(0).toUpperCase() + k.slice(1).toLowerCase(),
                k.charAt(0).toLowerCase() + k.slice(1).toUpperCase(),
            ];
            for(let c of k_cases){
                txt=txt.replaceAll(c, `<span style="background:#FF0 !important">${c}</span>`);
            }
        }
        return txt;
    }

    function insertStore(){
        //商店列表
        if(urlMatch(`/stores`) || urlMatch(`/products`) || urlMatch(`/search`)){
            let productEl=$(`.gallery-item`);
            for(let i=0; i<productEl.length; i++){
                let curEl=productEl.eq(i);
                let imgUrl=curEl.find(`img`).eq(0).attr(`src`);
                let imgTs=imgUrl.split(`?`)[1];
                if(imgTs){
                    let date=new Date(imgTs*1000).format(`yyyy-MM-dd hh:mm:ss`);
                    //curEl.find(`.item-description`).eq(0).append(`<p class="small">Upload: ${date}</p>`);
                    curEl.find(`.item-description`).eq(0).before(`<p class="small">Upload: ${date}</p>`);
                }

                //let productUrl=curEl.find(`.product-title`).attr(`href`);
                let productUrl=curEl.find(`a`).eq(0).attr(`href`);
                let productBought=getBoughtProduct(productUrl);
                let productFavorite=getFavoriteProduct(`favorites`,productUrl);
                let productWishlist=getFavoriteProduct(`wishlist`,productUrl);
                if(productBought){
                    curEl.attr(`title`,`${productUrl}\nBought`);
                    curEl.addClass(`product-bought`);
                    //curEl.find(`.item-description`).eq(0).append(`<p class="small">Bought: ${productBought.date}</p>`);
                }else if(productWishlist){
                    curEl.attr(`title`,`${productUrl}\nWishlist`);
                    curEl.addClass(`product-wishlist`);
                }else if(productFavorite){
                    curEl.attr(`title`,`${productUrl}\nFavorite`);
                    curEl.addClass(`product-favorite`);
                }else{
                    curEl.attr(`title`,`${productUrl}`);
                }
            }
        }
        //产品页
        else if(urlMatch(`/p`)){
            //let productImgEl=$(`#main-product-image`);
            let productImgEl=$(`.main-image`);
            let imgUrl=productImgEl.find(`img`).eq(0).attr(`src`);
            let imgTs=imgUrl.split(`?`)[1];
            if(imgTs){
                let date=new Date(imgTs*1000).format(`yyyy-MM-dd hh:mm:ss`);
                //$(`#product-main`).find(`h1`).append(` <span class="version">Upload: ${date}</span>`);
                $(`.title2`).append(`<span class="version date"> Upload: ${date}</span>`);
            }
            let flashNotice=$(`#flash_notice`);
            if(flashNotice.length>0 && flashNotice.find(`a`).length>0){
                addBoughtProduct(window.location.href, flashNotice.find(`a`).eq(0).text().trim(), imgUrl);
            }
        }
    }

    function insertFavorite(){
        //收藏和愿望单页
        if(urlMatch(`/favorites`) || urlMatch(`/wishlist`)){
            let productEl=$(`#wishlist-list`).find(`tr`);
            for(let i=0; i<productEl.length; i++){
                let curEl=productEl.eq(i);
                let imgUrl=curEl.find(`img`).eq(0).attr(`src`);
                if(!imgUrl) continue;
                let imgTs=imgUrl.split(`?`)[1];
                if(imgTs){
                    let date=new Date(imgTs*1000).format(`yyyy-MM-dd hh:mm:ss`);
                    curEl.find(`.small`).eq(-1).append(`<p class="small">Upload: ${date}</p>`);
                }

                let productUrl=curEl.find(`.listing-title`).attr(`href`);
                let productBought=getBoughtProduct(productUrl);
                if(productBought){
                    curEl.addClass(`product-bought`);
                    //curEl.find(`.small`).eq(-1).append(`<p class="small">Bought: ${productBought.date}</p>`);
                }
            }
            addFavoriteSearch(window.location.href.split(`/`).at(-1));
        }
        //商店收藏页
        if(urlMatch(`/favorite_stores`)){
            let productEl=$(`#favorite-stores-list`).find(`tr`);
            for(let i=0; i<productEl.length; i++){
                let curEl=productEl.eq(i);
                let childEl=curEl.find(`.top-row`).find(`.column`);
                for(let j=0; j<childEl.length; j++){
                    let cEl=childEl.eq(j);
                    let imgUrl=cEl.find(`img`).eq(0).attr(`src`);
                    if(!imgUrl) continue;
                    let imgTs=imgUrl.split(`?`)[1];
                    if(imgTs){
                        let date=new Date(imgTs*1000).format(`yyyy-MM-dd hh:mm:ss`);
                        cEl.find(`.info`).eq(0).after(`<p class="small">${date}</p>`);
                    }

                    let productUrl=cEl.find(`.info`).attr(`href`);
                    let productBought=getBoughtProduct(productUrl);
                    if(productBought){
                        cEl.addClass(`product-bought`);
                        //cEl.find(`.info`).eq(0).append(`<p class="small">Bought: ${productBought.date}</p>`);
                    }
                }
            }
            addFavoriteSearch(window.location.href.split(`/`).at(-1));
        }
    }

    async function insertOrder(html){
        //订单页、订单搜索页、礼品页
        if(urlMatch(`/orders`) || urlMatch(`/order_search`) || urlMatch(`/gifts`) || html){
            if(!html){
                $(`.small.show-order-type`).after(`<button id="orderGetAllBu">Get All</button>`);
                $(`#orderGetAllBu`).bind(`click`,function(){
                    getAllOrder();
                });
            }
            let productEl;
            switch(true){
                case urlMatch(`/orders`): default:
                    productEl=$(html || `body`).find(`.line-item-row`);
                    break;
                case urlMatch(`/order_search`): case urlMatch(`/gifts`):
                    productEl=$(html || `body`).find(`.line_items`).find(`tr`);
                    break;
            }
            let productUrlList=[];
            let promiseList=[];

            for(let i=0; i<productEl.length; i++){
                let curEl=productEl.eq(i);
                let productUrl=curEl.find(`h4`).find(`a`).attr(`href`);
                let isGift=(curEl.text().includes(`Gift for `)/* && curEl.text().includes(` Resident`)*/);
                let orderDate=curEl.find(`.date`).text().trim();
                if(productUrl){
                    promiseList.push((async ()=>{
                        let boughtProductData=getBoughtProduct(productUrl);
                        let retry=3;
                        for(let r=0; r<retry; r++){
                            let productHtml;
                            if(!boughtProductData || !boughtProductData.img || !typeof boughtProductData.img==`string`){
                                try{
                                    productHtml=await ajaxPromise(productUrl);
                                }catch(e){
                                    console.error(`${productUrl}`,e);
                                    continue;
                                }
                            }
                            if(productHtml || (boughtProductData && boughtProductData.img)){
                                let imgUrl;
                                if(boughtProductData && boughtProductData.img){
                                    imgUrl=boughtProductData.img;
                                }else{
                                    let pEl=$(productHtml);
                                    let imgEl=pEl.find(`.main-image`);
                                    if(imgEl.length>0){
                                        imgUrl=imgEl.find(`img`).attr(`src`).replaceAll(`view_large`,`thumbnail`);
                                    }
                                }
                                if(imgUrl){
                                    let errUrl=`https://marketplace.secondlife.com/assets/theme_slm/noimage/view_large-7714f184f17e7085fd4e4917071acb032ef0a33848213a74e7e53e59895a4fd4.jpg`;
                                    let imgTs=imgUrl.split(`?`)[1];
                                    let dateP=``;
                                    if(imgTs){
                                        let date=new Date(imgTs*1000).format(`yyyy-MM-dd hh:mm:ss`);
                                        dateP=`<p class="small">Upload: ${date}</p>`;
                                    }
                                    switch(true){
                                        case urlMatch(`/orders`): case urlMatch(`/order_search`):
                                            curEl.find(`.line-item-gift`).append(`<a href="${productUrl}" target="_blank"><img src="${imgUrl}" onerror="this.src='${errUrl}'"></img></a>${dateP}`);
                                            break;
                                        case urlMatch(`/gifts`):
                                            curEl.find(`.details`).after(`<td><a href="${productUrl}" target="_blank"><img src="${imgUrl}" onerror="this.src='${errUrl}'"></img></a>${dateP}</td>`);
                                            break;
                                    }
                                }
                                if(!isGift){
                                    addBoughtProduct(productUrl, orderDate, imgUrl, false); // 传false则不走保存和刷新，同步完成
                                }
                            }
                            return;
                        }
                    })());
                }
            }
            await Promise.allSettled(promiseList); //必须等所有Promise异步完成，才能保存并刷新
            await saveLDB(`boughtProducts`,boughtProducts);
            await initBoughtProduct();

            /*
        for(let i=0; i<productEl.length; i++){
            let curEl=productEl.eq(i);
            let productUrl=curEl.find(`h4`).find(`a`).attr(`href`);
            let isGift=(curEl.text().includes(`Gift for `) && curEl.text().includes(` Resident`));
            let orderDate=curEl.find(`.date`).text().trim();
            if(productUrl){
                productUrlList.push(productUrl);
                promiseList.push(ajaxPromise(productUrl));
                if(!isGift){
                    addBoughtProduct(productUrl, orderDate);
                }
            }else{
                productUrlList.push(null);
            }
        }

        Promise.all(promiseList).then((rs)=>{
            for(let i=0; i<rs.length; i++){
                let productHtml=rs[i];
                if(productHtml){
                    let curEl=productEl.eq(i);
                    let pEl=$(productHtml);
                    //let imgEl=pEl.find(`#main-product-image`);
                    let imgEl=pEl.find(`.main-image`);
                    if(imgEl.length>0){
                        let imgUrl=imgEl.find(`img`).attr(`src`).replaceAll(`view_large`,`thumbnail`);
                        let imgTs=imgUrl.split(`?`)[1];
                        let dateP=``;
                        if(imgTs){
                            let date=new Date(imgTs*1000).format(`yyyy-MM-dd hh:mm:ss`);
                            dateP=`<p class="small">Upload: ${date}</p>`;
                        }
                        switch(true){
                            case urlMatch(`/orders`): case urlMatch(`/order_search`):
                                curEl.find(`.line-item-gift`).append(`<a href="${productUrlList[i]}" target="_blank"><img src="${imgUrl}"></img></a>${dateP}`);
                            break;
                            case urlMatch(`/gifts`):
                                curEl.find(`.details`).after(`<td><a href="${productUrlList[i]}" target="_blank"><img src="${imgUrl}"></img></a>${dateP}</td>`);
                            break;
                        }
                    }
                }
            }
        });
        */
        }
    }

    async function getAllOrder(){
        let totalPages=parseInt($(`.page.next`).prev().text());
        if(!totalPages || isNaN(totalPages)) return;
        for(let i=1; i<=totalPages; i++){
            $(`#orderGetAllBu`).html(`Get All: ${i} / ${totalPages}`);
            let url=`${window.location.pathname}?page=${i}`;
            let html=await ajaxPromise(url);
            await insertOrder(html);
        }
        $(`#orderGetAllBu`).html(`Get All: OK`);
    }

    function main(){
        $(`head`).append(`<style>${customStyle}</style>`);
        insertStore();
        insertFavorite();
        insertOrder();
    }

    Promise.all([
        initBoughtProduct(),
        initFavoriteData(),
    ]).then(()=>{
        main();
    });
})();