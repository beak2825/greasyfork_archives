// ==UserScript==
// @name         0Skins Price Ratio V5FOX
// @namespace    out
// @version      0.1
// @icon         https://www.v5fox.com/favicon.ico
// @description  items proportion
// @author       MarinesPanda
// @match        *://www.v5fox.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @connect      steamcommunity.com
// @downloadURL https://update.greasyfork.org/scripts/368426/0Skins%20Price%20Ratio%20V5FOX.user.js
// @updateURL https://update.greasyfork.org/scripts/368426/0Skins%20Price%20Ratio%20V5FOX.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function(){
        $("div.list-box a").attr("target","_blank");
        var headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36",
                       "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
                      };
        var appId,itemEnName,itemImage;

        var itemName = encodeURI($($("span.l")[0]).text());

        //CSGO
        if(window.location.href.indexOf("csgo/item-")>0){
            appId = '730';
        }

        //DOTA2
        if(window.location.href.indexOf("dota2/item-")>0){
            appId = '570';
        }

        //PUBG
        if(window.location.href.indexOf("pubg/item-")>0){
            appId = '578080';
        }

        //H1Z1
        if(window.location.href.indexOf("h1z1/kotk/item-")>0){
            appId = '433850';
        }

        getItemEnName(itemName);

        //获取饰品英文名字
        function getItemEnName(name) {
            GM_log('getItemEnName\n'+'https://steamcommunity.com/market/search?q=' + name + '&appid=' + appId + '#p1_default_desc');
            GM_xmlhttpRequest({
                method: 'GET',
                headers: headers,
                url: 'https://steamcommunity.com/market/search?q=' + name + '&appid=' + appId + '#p1_default_desc',
                onload: setItemEnName
            });
        }

        function setItemEnName(e) {
            if (e.responseText != null) {
                var start = e.responseText.indexOf('<div id="searchResultsRows"');
                var end = e.responseText.indexOf('<div id="searchResults_ctn"');
                var contents = e.responseText.substr(start, end);
                $('div.footer-content').after('<div id="tempcontent" style="display:none">' + contents + '</div>');
                var resHashName = document.querySelector('#result_0').getAttribute('data-hash-name');
                var resGameId = document.querySelector('#result_0').getAttribute('data-appid');
                var resImageUrls = document.querySelector('#result_0_image').getAttribute('srcset');
                var resImages = resImageUrls.split(',')[1];
                var resImage = resImages.substr(0, resImages.length - 3);
                console.log(resGameId+resHashName);
                if (resGameId == appId) {
                    itemEnName = encodeURI(resHashName);
                    itemImage = resImage;
                    document.querySelector("#tempcontent").remove();
                    console.log('setItemEnName\n');
                    getJsonContent();
                }
            }
        }

        //访问接口
        function getJsonContent(){
            GM_xmlhttpRequest({
                method: "GET",
                headers: headers,
                url: "https://steamcommunity.com/market/priceoverview/?currency=23&appid="+appId+"&market_hash_name="+itemEnName,
                onload: parseContent
            });
        }

        //计算并显示比例
        function parseContent(e){
            if(e.responseText!=="null"){
                var resJsonInfo =  JSON.parse(e.responseText);
                if(resJsonInfo.success){
                    var steamPrice = resJsonInfo.lowest_price;
                    steamPrice = parseFloat(steamPrice.replace(/[^0-9.]/ig,''));
                    //v5fox当前最低价
                    var v5foxLowestPrice = parseFloat($($("div.goods-details-r h5>em")[0]).text().replace(/[^0-9.]/ig,''));
                    //饰品详情页第一页最高价
                    var v5foxTopPrice = parseFloat($($("div.goods-details-r h5>em")[$("div.goods-details-r h5>em").length-1]).text().replace(/[^0-9.]/ig,''));
                    //steam税后价
                    var exTax = (steamPrice / 1.15).toFixed(2);
                    //计算最优比列
                    var proportion = (v5foxLowestPrice / exTax).toFixed(2);
                    //参考比例
                    var refProportion = (v5foxTopPrice / exTax).toFixed(2);
                    //隐藏无关信息
                    $($("div.goods-details-r h3")).hide();
                    $($("div.goods-details-r h4")).hide();
                    $($(".clearfix .h3-div")).hide();
                    $("div.goods-details-r h2").after("<h2 class='l'><span>饰品最优比例：</span><em style='color:#ffff00'>"+proportion
                                                      +"</em><br/><span>接口即时价格：</span><em style='color:#ff0000'>"+steamPrice
                                                      +"</em><br/><span>饰品参考比例：</span><em style='color:#ffff00'>"+refProportion
                                                      +"<br/>税后价格："+exTax
                                                      +"<br /><a class='btn-02 batch-btn' href='https://steamcommunity.com/market/listings/"+appId+"/"+itemEnName
                                                      +"' target='_blank'>市场链接</a><div style='width:124px;height:124px;border-style:dotted;border-color:#ffff00'><img style='width:124px;height:124px' src='" +
                                                      itemImage + "'></div></h2>");


                    //首页所有比例
                    var priceList = document.querySelectorAll('.list-pri');
                    for(var pl=0;pl<priceList.length;pl++){
                        var itemPr = priceList[pl].innerText.replace(/[^0-9.]/ig,'');
                        var itemPro = (itemPr / exTax).toFixed(2);
                        priceList[pl].innerHTML+="<span style='color:yellow'>（"+itemPro+"）</span>";
                    }
                }

            }

        }



        /*
        //列表页显示比例
        var items = $(".list-text-box h5");
        for(var n=0;n<items.length;n++){
            (function(n){
                window.setTimeout(function(){
                    var item = items[n];
                    //获取饰品名字
                    var hashName = encodeURI($(item).text());
                    //获取steam价格
                    GM_xmlhttpRequest({
                        method: 'GET',
                        headers: headers,
                        url: 'https://steamcommunity.com/market/priceoverview/?currency=23&appid='+appId+'&market_hash_name='+itemEnName,
                        onload: function(e){
                            if(e.responseText!=null){
                                var steamMarketInfo = JSON.parse(e.responseText);
                                var v5fox1 = item.nextSibling;
                                var v5fox2 = v5fox1.nextSibling;
                                if(steamMarketInfo.success){
                                    var steamLowestPrice = steamMarketInfo.lowest_price;
                                    var steamPrice = parseFloat(steamLowestPrice.replace(/[^0-9.]/ig,''));
                                    //v5fox当前最低价
                                    var v5foxLp = parseFloat($(v5fox2).text().replace(/[^0-9.]/ig,''));
                                    //steam税后价
                                    var exTax = (steamPrice / 1.15).toFixed(2);
                                    //计算比列
                                    var proportion = (v5foxLp / exTax).toFixed(2);
                                    //显示比例
                                    $(v5fox2).after("<h5><span>比例：</span><em id='proportion' style='color:yellow'>"+proportion
                                                    +"</em><em>  =>  <a class='btn-02 batch-btn' href='https://steamcommunity.com/market/listings/"+appId+"/"+itemEnName
                                                    +"' target='_blank'>市场链接</a></em></h5>");

                                }
                            }
                        }
                    });

                },n*6666);
            })(n);
        }
*/
    });
})();