// ==UserScript==

// @name               Shopee shopping cart display liked products
// @name:zh-Han        蝦皮購物車顯示喜愛的商品
// @name:zh-TW         蝦皮購物車顯示喜愛的商品
// @name:zh-CN         虾皮购物车显示喜爱的商品
// @description        Products that have been liked are displayed below the Shopee shopping cart.
// @description:zh-Han 在蝦皮購物車下方顯示已按過喜歡的商品。
// @description:zh-TW  在蝦皮購物車下方顯示已按過喜歡的商品。
// @description:zh-CN  在虾皮购物车下方显示已按过喜欢的商品。
// @copyright          2024, HrJasn (https://greasyfork.org/zh-TW/users/142344-jasn-hr)
// @license            GPL3
// @license            Copyright HrJasn
// @icon               https://www.google.com/s2/favicons?domain=shopee.tw
// @homepageURL        https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @supportURL         https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @version            1.3
// @namespace          https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @grant              none
// @match              http*://shopee.tw
// @match              http*://shopee.tw/*

// @downloadURL https://update.greasyfork.org/scripts/497922/Shopee%20shopping%20cart%20display%20liked%20products.user.js
// @updateURL https://update.greasyfork.org/scripts/497922/Shopee%20shopping%20cart%20display%20liked%20products.meta.js
// ==/UserScript==

(async () => {
    async function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            };
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };
    const adNde = await waitForElm(".shopee-header-section");
    console.log(adNde);

    if (adNde) {

        let userLang = navigator.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage;
        let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        let liked_count = await fetch("https://shopee.tw/api/v4/pages/get_like_count", {
            "method": "GET"
        }).then((response) => {
            return response.json();
        }).then((json) => {
            return json;
        });
        let LikedItemsMaxCount = liked_count.data.total_count || liked_count.data.distribution.product_liked_count || 20;

        const liked_items = await fetch("https://shopee.tw/api/v4/pages/get_liked_items?&cursor=0&limit=" + LikedItemsMaxCount.toString() + "&offset=0&status=0", {
            "method": "GET"
        }).then(response=>response.json()).then(data=>{
            console.log(data);
            return data
        });

        console.log(liked_items);

        if ( (liked_items) && (liked_items.data) ) {

            const liked_items_data_items = liked_items.data.items.reverse();

            for (let lin = 0; lin < liked_items_data_items.length; lin++) {
                let lio = liked_items.data.items[lin];
                let NewDiv = await AddLikedItem(lio);
                console.log(NewDiv);
            };

            async function AddLikedItem(likeitemJson){

                let itemname = likeitemJson.name;
                let contenthref = "/" + itemname + "-i." + likeitemJson.shopid + "." + likeitemJson.itemid;
                let imgid = likeitemJson.image;
                let itemprice = likeitemJson.price / 100000;

                const liketitle = [...document.querySelectorAll('div.shopee-header-section')].find((e)=>{return e.innerText.match(/喜歡|like/)});
                const likelist = liketitle.nextSibling;
                let NewDiv = likelist.insertBefore(document.createElement("div"), likelist.firstChild);
                NewDiv.classList.add("N_YeYe");
                NewDiv.style.transition = 'all 0.2s';
                NewDiv.insertAdjacentHTML('afterbegin', `
                                <div class="shopee_ic" style="display: contents;">
                                    <a class="contents" href="` + contenthref + `">
                                        <div class="flex flex-col bg-white cursor-pointer h-full h-full duration-100 ease-sharp-motion-curve hover:shadow-hover active:shadow-active hover:-translate-y-[1px] active:translate-y-0 relative hover:z-[1] border border-shopee-black9">
                                            <div class="relative z-0 w-full pt-full" style="box-shadow: inset 0px 10px 50px pink;">
                                                <img src="https://down-tw.img.susercontent.com/file/` + imgid + `_tn.webp" alt="` + itemname + `" class="inset-y-0 w-full h-full pointer-events-none object-contain absolute" loading="lazy" aria-hidden="true" style="width:190px; height:190px;">
                                                    <div class="p-2 flex-1 flex flex-col justify-between">
                                                        <div class="mb-1 whitespace-normal line-clamp-2 break-words min-h-[2.5rem] text-sm">` + itemname + `</div>
                                                        <div class="flex justify-between items-center space-x-1">
                                                            <div class="max-w-full flex-grow-1 flex-shrink-0 truncate text-shopee-primary flex items-center font-medium">
                                                                <span aria-label="promotion price"/>
                                                                <div class="truncate flex items-baseline">
                                                                    <span class="text-xs/sp14">$</span>
                                                                    <span class="text-base/5 truncate">` + itemprice + `</span>
                                                                    <span class="text-xs/sp14"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                            `);

                if(likeitemJson.stock == 0){
                    let locateSoldText = {
                        'en':'Sold out',
                        'zh-TW':'已售完',
                        'zh-CN':'已售完'
                    };
                    locateSoldText = locateSoldText[userLang] || locateSoldText.en;
                    let NewSoldDiv = NewDiv.querySelector("img").parentNode.appendChild(document.createElement("div"));
                    let NewSoldDivTextNode = NewSoldDiv.appendChild(document.createTextNode(locateSoldText));
                    NewSoldDiv.style = `
                                    color: #fff;
                                    align-items: center;
                                    background-color: rgba(0, 0, 0, 0.7);
                                    border-radius: 60px;
                                    display: flex;
                                    font-size: 20px;
                                    height: 120px;
                                    justify-content: center;
                                    left: 50%;
                                    position: absolute;
                                    text-transform: capitalize;
                                    top: 50%;
                                    transform: translate(-50%, -50%);
                                    width: 120px;
                                `;
                };

                let NewLikeBtn = NewDiv.querySelector("img").parentNode.appendChild(document.createElement("button"));
                NewLikeBtn.insertAdjacentHTML('afterbegin', `
                                <svg width="24" height="20" class="vgMiJB">
                                    <path d="M19.469 1.262c-5.284-1.53-7.47 4.142-7.47 4.142S9.815-.269 4.532 1.262C-1.937 3.138.44 13.832 12 19.333c11.559-5.501 13.938-16.195 7.469-18.07z" stroke="#FF424F" stroke-width="1.5" fill="#FF424F" fill-rule="evenodd" stroke-linejoin="round"/>
                                </svg>
                            `);
                NewLikeBtn.style = `
                                background-color: transparent;
                                border: 0;
                                display: flex;
                                outline: 0;
                                overflow: visible;
                                position: absolute;
                                bottom: 10px;
                                right: 10px;
                                z-index: 999;
                            `;

                NewLikeBtn.addEventListener("click",async (evnt)=>{
                    console.log(evnt);
                    evnt.preventDefault();
                    evnt.stopPropagation();
                    evnt.stopImmediatePropagation();
                    let ep = evnt.target.querySelector("path") || evnt.target;
                    let pbodyStr = JSON.stringify({
                        "shop_item_ids": [
                            {
                                "shop_id": likeitemJson.shopid,
                                "item_id": likeitemJson.itemid
                            }
                        ]
                    });
                    if(ep.getAttribute('fill') == 'none'){
                        await fetch("https://shopee.tw/api/v4/pages/like_items", {
                            "headers": {
                                "accept": "application/json",
                                "content-type": "application/json"
                            },
                            "body": pbodyStr,
                            "method": "POST",
                            "credentials": "include"
                        });
                        ep.setAttribute('fill', '#FF424F');
                        ep.parentNode.parentNode.parentNode.style.boxShadow = 'pink 0px 10px 50px inset';
                    } else {
                        await fetch("https://shopee.tw/api/v4/pages/unlike_items", {
                            "headers": {
                                "accept": "application/json",
                                "content-type": "application/json"
                            },
                            "body": pbodyStr,
                            "method": "POST",
                            "credentials": "include"
                        });
                        ep.setAttribute('fill', 'none');
                        ep.parentNode.parentNode.parentNode.style.boxShadow = 'gray 0px 10px 50px inset';
                    };
                });

                return NewDiv;
            };
        };
    };
})();