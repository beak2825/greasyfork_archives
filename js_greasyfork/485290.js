// ==UserScript==
// @name         fill_sku_price
// @namespace    ptc
// @version      0.4
// @description  fill sku price
// @author       shijian
// @match        https://www.temu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485290/fill_sku_price.user.js
// @updateURL https://update.greasyfork.org/scripts/485290/fill_sku_price.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // const skuInterval = setInterval("readPrice()", 10)

    setTimeout(()=>{ // dom ready in En
        // test read name
        const productName2 = $('link[rel="canonical"]').attr('href')
        // console.log('productName2', productName2, productName2.split('-g-')[0].substring(productName2.split('-g-')[0].lastIndexOf('/')+1))
        const pid = productName2.split('.html')[0].substring(productName2.split('.html')[0].lastIndexOf('-')+1)
        // email context
        if(!pid){
            console.log('pid', pid)
            return;
        }
        // update price and sku
        let domKeys = {productName: '._2rn4tqXP', productMedia: '._22_BWn2A', videoMedia: '.CVmcgVkH', colorSku: '._2bzGqXzH', sizeSku: '._2ZDZJTUw', secondSizeSku: '.p9maYisg', defaultSku: '._3cTw9-q9', detailMedia: '._3NKWJjn8', category: '._2LmAUJYN', details: '._1YBVObhm', secondDetails: '._3xcJKtRB', skuPrice: '._3cZnvUvE'} // to do dynamic dom with map
        // invalid product
        console.log('_2woWWWUD', $('._2woWWWUD').length)
        if($('._2woWWWUD').length > 0){
            $.ajax({
                type: "post",
                url: "http://localhost:8156/ptc/productReserve/updateStatus",
                data: JSON.stringify({productId: pid}),
                headers: {loginToken: localStorage.getItem('loginToken'),  "Access-Control-Allow-Origin": `*`, 'Content-Type': 'application/json; charset=utf-8'},
                success:(res)=>{
                    // console.log('res', res)
                    // return
                    if(!res.error){
                        if(res.data.origUrl){
                            setTimeout(()=>{
                                location.href = res.data.origUrl
                            },  1000)
                        }else{
                            alert('Done');
                        }
                    }else{
                        alert(res.error);
                    }
                }

            })

            return
        }

        const skuPrice = $(domKeys.skuPrice).attr('aria-label')
        // robot stoped at pid
        // read sku——color
        const productSkuList = []
        if($(domKeys.colorSku).length > 0){
            let colorSku = []
            const cs = $(domKeys.colorSku)
            cs.map((item, index)=>{
                // console.log('item', item, index)
                colorSku.push({standardName: $(index).attr("aria-label"), img: $(index).find("img").attr("src")})
            })
            // console.log('colorSku', colorSku)
            productSkuList.push({skuStandard: 'color', standardNameList: colorSku})
            // try to download and reduce
            // 生成分组时间戳
            const currentSku = new Date().getTime()
            colorSku.map((item,index)=>{
                // console.log('index',index, item.img)
                // saveImage(item.img, currentSku+'-'+index+'.jpg')

            })


        }

        if($(domKeys.sizeSku).length > 0){
            // read sku——size
            // alert($('.shaking').find('._2ZDZJTUw').length)
            let sizeSku = []
            const ss = $(domKeys.sizeSku)
            ss.map((item, index)=>{
                // console.log('item', item, index)
                if($(index).find(domKeys.secondSizeSku).find('svg').length > 0){
                    sizeSku.push({standardName: $(index).find(domKeys.secondSizeSku).find('svg').attr('aria-label')})
                }else{
                    if($(index).find(domKeys.secondSizeSku).find('span').length > 0){
                        sizeSku.push({standardName: $(index).find(domKeys.secondSizeSku).find('span').html()})
                    }else{
                        sizeSku.push({standardName: $(index).find(domKeys.secondSizeSku).html()})
                    }

                }

            })
            // console.log('sizeSku', sizeSku)
            productSkuList.push({skuStandard: 'size', standardNameList: sizeSku})

        }

        if($(domKeys.defaultSku).length > 0){
            // read sku——default
            // alert($('.shaking').find('._2ZDZJTUw').length)
            let defaultSku = []
            const ds = $(domKeys.defaultSku)
            ds.map((item, index)=>{
                // console.log('item', item, $(index).html().replace('<em>', '').replace('</em>','').replace('<!-- -->', ''))
                defaultSku.push($(index).html().replace('<em>', '').replace('</em>','').replace('&nbsp;', '').replace('<!-- -->', ''))

            })
            // console.log('defaultSku', defaultSku)
            productSkuList.push({skuStandard: 'default', standardNameList: [{standardName: defaultSku.join('')}]})

        }


        console.log('skuPrice', skuPrice)
        if(!skuPrice){
            //send email here
            $.ajax({
                type: "post",
                url: "https://win.cash.app/ptc/productReserve/getNext",
                data: JSON.stringify({}),
                headers: {loginToken: localStorage.getItem('loginToken'),  "Access-Control-Allow-Origin": `*`, 'Content-Type': 'application/json; charset=utf-8'},
                success:(res)=>{
                    // console.log('res', res)
                    if(!res.error){
                        location.href = res.data.origUrl
                    }else{
                        alert(res.error);
                    }
                }

            })
            return
        }
        // combine json
        const productReserveDTOList = []
        productReserveDTOList.push({productId: pid, productSkuList, price: skuPrice.substring(1)})
        console.log('productReserveDTOList', productReserveDTOList, JSON.stringify(productReserveDTOList[0]))


        //update and router next product
        $.ajax({
            type: "post",
            url: "http://localhost:8156/ptc/productReserve/update",
            data: JSON.stringify(productReserveDTOList[0]),
            headers: {loginToken: localStorage.getItem('loginToken'),  "Access-Control-Allow-Origin": `*`, 'Content-Type': 'application/json; charset=utf-8'},
            success:(res)=>{
                // console.log('res', res)
                // return
                if(!res.error){
                    if(res.data.origUrl){
                        setTimeout(()=>{
                            location.href = res.data.origUrl
                        },  10)
                    }else{
                        alert('Done');
                    }
                }else{
                    alert(res.error);
                }
            }

        })

    },  2000) // timeout depend on network



})();
