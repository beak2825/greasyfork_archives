// ==UserScript==
// @name         baiSiMaiScript
// @namespace    http://tampermonkey.net/
// @version      2024-06-19-3
// @description  bsm集中商品信息
// @author       You
// @match        https://www.bestbuy.com/site/*skuId*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.66
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498323/baiSiMaiScript.user.js
// @updateURL https://update.greasyfork.org/scripts/498323/baiSiMaiScript.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function    pageShow(){
        let html=
                `<div style="
                        width: 800px;
                        background: #f7ffea;
                        overflow: auto;
                        position: fixed;
                        right: 0px;
                        top: 0px;
                        z-index: 9999;">
                    <div style="height:20px;cursor: pointer;" id="showOrHide">
                        点击显示隐藏
                    </div>

                    <div id="content" style="height:800px;overflow:scroll;">
                    <!--<div>
                             转换为英寸（X*X*X cm）:
                             <input id="lengthConversion" style="width: 140px;height:30px;"></input>
                             <button id="lengthConversionBut">获取英寸</button>
                             <input id="lengthConversionResult" style="width: 200px;height:30px;"></input>
                    </div>-->
                        <div>
                            <textarea id="titleVal" style="width: 700px;height:40px;"></textarea>
                            <button class="copyBtn">复制标题</button>
                        </div>

                        <div id="listImg">

                        </div>

                        <div>
                            <input id="skuVal" style="width: 700px;height:20px;"></input>
                            <button class="copyBtn">复制SKU</button>
                        </div>

                        <div>
                            <input id="modelVal" style="width: 700px;height:20px;"></input>
                            <button class="copyBtn">复制model</button>
                        </div>


                        <div>
                            <input id="typeVal" style="width: 700px;height:20px;"></input>
                            <button class="copyBtn">复制type</button>
                        </div>

                         <div>
                            <textarea id="describeVal" style="width: 700px;height:auto;resize: none;overflow-y: hidden;"></textarea>
                            <button class="copyBtn">复制描述</button>
                        </div>

                        <div>
                            <input id="priceVal" disabled style="width: 60px;height:20px;"></input>
                            *
                            <input id="titleVal" disabled style="width: 60px;height:20px;" value='0.93'></input>
                            =
                            <input id="newTitleVal" style="width: 551px;height:20px;"></input>
                            <button class="copyBtn">复制价格</button>
                        </div>



                    </div>
                </div>`
        $("body").append(html)
    }


    async function copyContent(text) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Content copied to clipboard');
            layer.msg('复制成功');
            /* Resolved - 文本被成功复制到剪贴板 */
        } catch (err) {
            console.error('Failed to copy: ', err);
            layer.msg('复制失败');
            /* Rejected - 文本未被复制到剪贴板 */
        }
    }

    function dataInit(){
        let titleVal = $(".sku-title .heading-5").text()
        $("#titleVal").val(titleVal.substring(titleVal.indexOf(" ") + 1).trim())

        //sku
        let skuVal = $(".shop-product-title .sku .product-data-value").text().trim()
        $("#skuVal").val(skuVal+"-bsm")

        //model
        let modelVal = $(".shop-product-title .model .product-data-value").text().trim()
        $("#modelVal").val(modelVal)

        //type
        let navList = $("ol.c-breadcrumbs-order-list li")

        $("#typeVal").val($(navList[navList.length-1]).text())


        //价格
        let priceText = $($('div[data-testid="large-price"] .priceView-hero-price.priceView-customer-price').find("span")[0]).text().match(/\d+\.\d+/)[0]
        let priceVal = parseFloat(priceText)
        $("#priceVal").val(priceVal)
        $("#newTitleVal").val(priceVal*0.93)

        //图片
        let imgHtml=""
        $(".media-gallery-base-content.thumbnails .seo-list a").each(function(){
            let imgSrc = $(this).prop("href")
            if(imgSrc.includes('products')){
                imgHtml += `<img style="width:100px;height:100px;margin-right: 10px" src="${imgSrc}">`
            }
        })
        $("#listImg").html(imgHtml)


    }

    function convertToInches(valueInCm) {
        // 将厘米转换为英寸并保留两位小数
        return (valueInCm / 2.54).toFixed(1);
    }

    function main(){
        pageShow()
        dataInit()


        $("body").on("click",".copyBtn",function () {
            let text = $(this).prev().val()
            copyContent(text)
        })
        $("body").on("click","#showOrHide",function () {
            $("#content").toggle()
        })

        $("body").on("click","#lengthConversionBut",function () {
             let inputString = $("#lengthConversion").val()
             inputString = inputString.trim().replace("cm", "");
             // 将字符串分割成数字数组
             const numbers = inputString.split('*').map(Number);

            // 转换为英寸并用*连接输出
            const inches = numbers.map(convertToInches).join('*');

            $("#lengthConversionResult").val(inches + " in")

        })




    }

    main()
    // Your code here...
    })();