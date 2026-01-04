// ==UserScript==
// @name         saiYingScript
// @namespace    http://tampermonkey.net/
// @version      2024-04-27
// @description  saiying集中商品信息
// @author       You
// @match        https://www.saleyee.cn/item/*
// @match        https://www.ebay.com/lstng?*
// @match        https://www.saleyee.cn/allsearch_page*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.66
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/493525/saiYingScript.user.js
// @updateURL https://update.greasyfork.org/scripts/493525/saiYingScript.meta.js
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
                             转换为英寸（X*X*X cm）:
                             <input id="lengthConversion" style="width: 140px;height:30px;"></input>
                             <button id="lengthConversionBut">获取英寸</button>
                             <input id="lengthConversionResult" style="width: 200px;height:30px;"></input>
                        </div>

                        <div>
                            <input id="spuVal" style="width: 700px;height:20px;"></input>
                            <button class="copyBtn">复制SPU</button>
                        </div>

                         <div>
                            <textarea id="describeVal" style="width: 700px;height:auto;resize: none;overflow-y: hidden;"></textarea>
                            <button class="copyBtn">复制描述</button>
                        </div>

                        <div>
                            <input id="priceVal" disabled style="width: 60px;height:20px;"></input>
                            *
                            <input id="titleVal" disabled style="width: 60px;height:20px;" value='1.3'></input>
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
        let titleVal = $(".choose_h3").text()
        $("#titleVal").val(titleVal)
        //SKU
        let skuVal = $(".goodssku.choose_sku").text().split(":")[1]+"-SY"
        $("#skuVal").val(skuVal)

        //Spu
        let spuVal = $(".goodssku.choose_sku").next().text().split("：")[1]
        $("#spuVal").val(spuVal)

        //图片
        let imgHtml=""
        $("#magnifier1 .magnifier-assembly img").each(function(){
            let imgSrc = $(this).prop("src")
            imgHtml += `<img style="width:100px;height:100px;margin-right: 10px" src="${imgSrc}">`
        })
        $("#listImg").html(imgHtml)

        //价格
        let priceVal = 0
        if($(".oprice").length>0 && $(".oprice").text()){
           priceVal = $(".oprice").text()
        }else{
           priceVal = $(".currPrice").text()
        }


        priceVal = parseFloat(priceVal.match(/\d+\.\d+/))
        $("#priceVal").val(priceVal)
        $("#newTitleVal").val(priceVal*1.3)

        //获取描述
        var element = $('.choose_description')[0]; // 获取元素
        if (document.body.createTextRange) { // 兼容 IE 浏览器
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) { // 兼容其他现代浏览器
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        let describeVal = window.getSelection().toString()
        $("#describeVal").val(describeVal)
        $("#describeVal")[0].style.height = $("#describeVal")[0].scrollHeight + 'px';
        $('html, body').animate({scrollTop: 0}, 'slow');

    }

    function convertToInches(valueInCm) {
        // 将厘米转换为英寸并保留两位小数
        return (valueInCm / 2.54).toFixed(1);
    }

    function main(){
        pageShow()
        dataInit()
        if($("#ktotal").text()<3){
            alert("库存数小于3，请停止操作！！！")
        }

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
    function main1(){
        $("input[name=price]").change(function(){
            $("input[name=quantity]").val(3)
            $("input[name=quantity]").change()
        })
        $(".smry.summary__cta").css({"position": "fixed","bottom": 0,"right": 0})

    }
    function main2(){
        $(".check-all").css({"position": "fixed"})
    }

    let url = window.location.href
    if(url.indexOf("saleyee.cn/item")!=-1){
      main()
    }
    if(url.indexOf("ebay.com/lstng")!=-1){
      main1()
    }
    if(url.indexOf("saleyee.cn/allsearch_page")!=-1){
      main2()
    }
    // Your code here...
    })();