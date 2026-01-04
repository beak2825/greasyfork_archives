// ==UserScript==
// @name         ptc
// @namespace    ptc
// @version      1.6
// @description  product collect tool
// @author       You
// @match        https://www.temu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483954/ptc.user.js
// @updateURL https://update.greasyfork.org/scripts/483954/ptc.meta.js
// ==/UserScript==

//加载外部CSS，资源已在上方resource中

const Events = {
    CLICK: 'click'
}
const Selector = {
    $body: $('body')
}


const nonNull = (target) => {
    return typeof (target) !== "undefined" && target != null && target.length !== 0
}

const isNull = (target) => {
    return !nonNull(target)
}

/** test cc file  */
const saveJson = ()=>{
    // 定义要保存为JSON文件的对象
    var data = { name: "John", age: 30 };

    // 转换为JSON字符串
    var jsonData = JSON.stringify(data);

    // 创建Blob对象
    var blob = new Blob([jsonData], { type: 'application/json' });

    // 创建URL对象
    var url = URL.createObjectURL(blob);

    // 创建a标签元素
    var a = document.createElement('a');
    a.href = url;
    a.download = 'data.json'; // 设置下载文件名

    // 模拟点击事件触发下载
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);



}

/** download picuture */
const saveImage2 = (url, filenames)=>{
    $.ajax({
        url,
        method: 'GET',
        //xhrFields: {
        //    responseType: 'blob'
        //},
        success: function(data) {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = filenames;
            a.click();
            // window.URL.revokeObjectURL(url);
        }
    });
}

function saveImage(url, filenames) {
    var img = new Image(); //创建新的img元素

    img.onload = function() {
        var canvas = document.createElement('canvas'); //创建画布

        canvas.width = this.naturalWidth; //设置画布大小为图像原始宽度
        canvas.height = this.naturalHeight; //设置画布高度为图像原始高度

        var context = canvas.getContext('2d'); //获取2D绘图上下文

        context.drawImage(this, 0, 0); //将图像绘制到画布上

        var dataURL = canvas.toDataURL("image/png"); //将画布内容转换成data URL格式

        downloadFile(dataURL, filenames, "image/png"); //调用下载函数进行保存
    };

    img.src = url // '//Users/shijian/Downloads/shopping.png'; //加载图片资源
    console.log('img.src', img.src)
}


//下载函数
function downloadFile(fileUrl, fileName, fileType) {
    var a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    a.type = fileType || 'application/octet-stream';

    if (typeof MouseEvent === 'function') {
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        a.dispatchEvent(event);
    } else if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, null, 0, 0, 0, 80, false, false, false, false, 0, null);
        a.dispatchEvent(event);
    }
}


(async function ($) {
    // 'use strict';
    /** model init */
    setTimeout(()=>{
        // test read name
        let domKeys = {productName: '._2rn4tqXP', productMedia: '._22_BWn2A', videoMedia: '.CVmcgVkH', colorSku: '.wfndu2Un', singleColorSku:'._2aXpqYRk', sizeSku: '._2ZDZJTUw', secondSizeSku: '.p9maYisg', defaultSku: '._3cTw9-q9', detailMedia: '._3NKWJjn8', category: '._2LmAUJYN', details: '._1YBVObhm', secondDetails: '._3xcJKtRB', skuPrice: '._3cZnvUvE'} // to do dynamic dom with map
        $.ajax({
            type: "get",
            url: "http://localhost:8156/ptc/productReserve/getJsonConfig?siteType=temu",
            params: {siteType: 'temu'},
            headers: {loginToken: localStorage.getItem('loginToken'),  "Access-Control-Allow-Origin": `*`, 'Content-Type': 'application/json; charset=utf-8'},
            success:(res)=>{
                // console.log('res', res)
                if(!$(domKeys.productName)){
                    return
                }

                domKeys = res.data.valueJson.temu
                // console.log('domKeys', JSON.stringify({temu: domKeys}))
                const productName = $(domKeys.productName).html() // test element visitility
                console.log('productName', productName)
                if(!productName){
                    // alert('Data read failed, Please try again');
                    return
                }

                // render login context
                const loginToken = localStorage.getItem("loginToken");
                // show fixed button
                if(!loginToken){
                    $('body').append('<div style="position: fixed; top: 200px; right: 100px; z-index: 1000; background: #ececec; width: 200px; height: 200px; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-direction: column; color: #FFF; border: 1px solid #fb7701;"><div><input id="loginToken" placeholder="loginToken" style="border-radius: 6px; height: 30px; padding-left: 6px; margin-bottom: 6px; color: #000;" /></div><div style="width: 100px; height: 30px; border-radius: 6px; background: #fb7701; cursor: pointer; text-align: center; line-height: 30px;" id="loginMo">登录</div></div>')
                }else{
                    $('body').append('<div style="position: fixed; top: 200px; right: 100px; z-index: 1000; background: #ececec; width: 200px; height: 200px; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-direction: column; color: #FFF; border: 1px solid #fb7701;"><div style="width: 100px; height: 30px; border-radius: 6px; background: #fb7701; cursor: pointer; text-align: center; line-height: 30px;" id="tryUploadModel">上传</div></div>')
                }

                /** try upload func  */
                $("#tryUploadModel").click(function(){
                    // console.log('tryUploadModel')
                    if(!productName){
                        alert('未读取到控件元素，请联系管理员！');
                        return
                    }
                    if($("#tryUploadModel").attr('disabled')){
                        return
                    }
                    // saveJson()
                    if(confirm("您确定要上传这个商品数据？")){
                        // read swiper
                        let swip = []
                        const sw = $(domKeys.productMedia).find('img');
                        sw.map((item, index)=>{
                            // console.log('item', item, index)
                            swip.push($(index).attr("src") || $(index).attr("data-src"))
                        })

                        // console.log('swip', swip)
                        const productMedia = {}
                        let mainImg = null
                        if(swip.length > 0){
                            mainImg = swip[0]
                            productMedia.imgs = swip.slice(1)

                        }
                        if($(domKeys.videoMedia)){
                            productMedia.video = [$(domKeys.videoMedia).attr('src')]
                        }

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

                        // 单个颜色sku
                        if($(domKeys.singleColorSku) && productSkuList.length == 0){
                            let singleColorName = $(domKeys.singleColorSku).find("em").html()
                            let singleSkuScript = JSON.parse($('script[type="application/ld+json"]').eq(1).html())
                            // console.log("singleSkuScript", singleSkuScript.image[0].thumbnail)
                            if(singleColorName){
                                productSkuList.push({skuStandard: 'color', standardNameList: [{standardName: singleColorName, img: singleSkuScript.image[0].thumbnail}]})
                            }
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




                        // read imgs
                        const detailMedia = {}
                        let imgs = []
                        const im = $(domKeys.detailMedia).find('img');
                        im.map((item, index)=>{
                            // console.log('item', item, index)
                            imgs.push($(index).attr("src") || $(index).attr("data-src"))
                        })

                        // console.log('imgs', imgs)
                        detailMedia.imgs = imgs


                        // read category
                        const currentCate = $(domKeys.category).find('li');
                        // console.log('currentCate', $(currentCate[currentCate.length -2]).find('a').html())
                        const category = $(currentCate[currentCate.length -2]).find('a').html()

                        // read details
                        $(domKeys.secondDetails).click() // 模拟点击更多
                        const details = []
                        const de = $(domKeys.details);
                        de.map((item, index)=>{
                            details.push({key: $(index).attr('aria-label').split(': ')[0], value: $(index).attr('aria-label').split(': ')[1]})

                        })
                        // console.log('details', details)

                        // combine json
                        const productReserveDTOList = []
                        // stable productName
                        const productName2 = $('link[rel="canonical"]').attr('href')
                        // console.log('productName2', productName2, productName2.split('-g-')[0].substring(productName2.split('-g-')[0].lastIndexOf('/')+1))
                        const pid = productName2.split('.html')[0].substring(productName2.split('.html')[0].lastIndexOf('-')+1)
                        console.log('pid', pid)
                        const skuPrice = $(domKeys.skuPrice).attr('aria-label')
                        productReserveDTOList.push({productId: pid, productName: productName.replace('amp;', ''), productType: 1, category: category.replace('amp;', ''), dept: 1, mainImg, productSkuList, productMedia, detailsList: details, detailMedia, siteType: 'temu', origUrl: location.href.split('?')[0], price: skuPrice.substring(1)})
                        console.log('productReserveDTOList', productReserveDTOList)


                        // download
                        // return
                        $("#tryUploadModel").attr('disabled', true)
                        $("#tryUploadModel").css('background', 'gray')
                        $("#tryUploadModel").html('上传中...')
                        $.ajax({
                            type: "post",
                            url: "http://localhost:8156/ptc/productReserve/add",
                            data: JSON.stringify(productReserveDTOList),
                            headers: {loginToken: localStorage.getItem('loginToken'),  "Access-Control-Allow-Origin": `*`, 'Content-Type': 'application/json; charset=utf-8'},
                            success:(res)=>{
                                console.log('res', res)
                                if(!res.error){
                                    $("#tryUploadModel").html('上传完成')
                                    alert('商品 上传完成');
                                }else{
                                    alert(res.error);
                                }
                            }

                        })


                    }



                });


                // test cate
                $('.pWw9Mlj4').mouseover(function(){
                    setTimeout(()=>{
                        // console.log('first',$('.yarwDwZn').length, 'second', $('._2ydisBcI').length)
                        const firstCate = $('.yarwDwZn');
                        const cateArray = []
                        firstCate.map((index, item)=>{
                            console.log(index, $(item).find('span').html() )
                            let secondCate = $($('._2ydisBcI')[index]).find('a')
                            let secondArray = []
                            secondCate.map((index2, item2)=>{
                                if($(item2).find('._1n85zkuB').html()){
                                    secondArray.push({icon:$(item2).find('img').attr('src') || $(item2).find('img').attr('data-src'), name: $(item2).find('._1n85zkuB').html()})
                                }


                            })

                            cateArray.push({name: $(item).find('span').html(), second: secondArray})

                        })


                        //if(confirm(cateArray.length+' categories read, Do you want to upload then now ?')){
                        //    console.log('cateArray', cateArray)
                        //}


                    }, 1000 * 2)

                })


                $('#loginMo').click(function(){
                    const loginToken = $('#loginToken').val()
                    if(!loginToken){
                        alert('Please input loginToken');
                        return;
                    }


                    if(loginToken.indexOf('unitBegin') < 0){
                        alert('LoginToken is not valide');
                        return;
                    }


                    // checkout when upload
                    localStorage.setItem('loginToken', loginToken)
                    location.reload()

                    //$.ajax({
                    //    type: "post",
                    //    url: "http://erp.muryi.com:8081/desktop/login",
                    //    data: {token: $('#loginToken').val()},
                    //    success:(res)=>{
                    //        console.log('res', res)
                    //    }

                    // })

                })
            }

        })

    }, 1000 * 2)
})(window.jQuery);