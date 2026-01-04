    // ==UserScript==
    // @name         业绩报告
    // @namespace    https://greasyfork.org/zh-CN/scripts/451730
    // @version      0.4
    // @description  test
    // @author       menkeng
    // @match        https://sellercentral.amazon.com/*
    // @match        https://advertising.amazon.com/cm/*
    // @icon         https://www.google.com/s2/favicons?domain=amazon.com
    // @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
    // @grant        unsafeWindow
    // @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/451730/%E4%B8%9A%E7%BB%A9%E6%8A%A5%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/451730/%E4%B8%9A%E7%BB%A9%E6%8A%A5%E5%91%8A.meta.js
    // ==/UserScript==

    // 主页界面
    var amzname = "输入你的店铺名"
    var home_array = ['8888','1234567.8','654321.6','100%','560','3','0','36699']
    // 订单，销售额，余额，购买按钮，ipi，商城数量，买家消息，促销额

    
    // 今日界面
    var num_array = [10684,15622,86542354.35,2.1,156456.5]
    // 订单商品总数，商品数量，商品销售额，平均数量，平均销售额

    var day_array = [100,200,300,400,500,600,700,800]
    // 今日销售额 销售数量 昨日销售额 销售数量 上一周销售额 销售数量  去年销售额 销售数量 

    // 年界面
    var y_num_array = [1122336699,6688997766,2345656786.35,4.1,165456135.5]
    // 订单商品总数，商品数量，商品销售额，平均数量，平均销售额

    var year_array = [1234567,334455,12345678,445566]
    // 今年销售额 销售数量  去年销售额 销售数量

    // 公司信息
    var b_chengshi = "Alibaba"
    var b_dizhi1="Alibaba"
    var b_dizhi2="Alibaba"
    var b_name = "Alibaba"
    var b_sheng ="Alibaba"
    var b_youbian ="Alibaba"
    // 商品信息
    var product_1_name = "Product1"
    var product_2_name = "Product2"
    var product_1_asin = "B000000000"
    var product_2_asin = "B000000000"
    var product_1_sku = "ABC"
    var product_2_sku = "ABC"
    var product_1_va = "10086"
    var product_2_va = "100861"
    // 图表数据
    var dd = 'M 0 6.8627450980392 117.44666666666667 L 29.000632511069 124.13666666666667 L 51.138519924099 167.99333333333334 L 73.276407337128 160.56 L 95.414294750158 182.86 L 117.55218216319 179.14333333333335 L 139.69006957622 43.113333333333344 L 161.82795698925 115.96000000000001 L 183.96584440228 88.45666666666668 L 206.10373181531 130.82666666666665 L 228.24161922834 132.31333333333333 L 250.37950664137 119.67666666666668 L 272.5173940544 92.17333333333335 L 294.65528146743 117.44666666666667 L 316.79316888046 141.23333333333335 L 338.93105629349 150.89666666666668 L 361.06894370651 165.76333333333332 L 383.20683111954 170.96666666666667 L 405.34471853257 160.56 L 427.4826059456 182.86 L 449.62049335863 156.84333333333333 L 471.75838077166 137.51666666666665 L 493.89626818469 163.53333333333333 L 516.03415559772 178.4 L 538.17204301075 173.19666666666666 L 560.30993042378 188.06333333333333 L 582.44781783681 185.83333333333334 L 604.58570524984 162.04666666666668 L 626.72359266287 163.53333333333333 L 648.8614800759 159.07333333333332 L 670.99936748893 165.76333333333332 L 693.13725490196 184.34666666666666'
    var dd_a = 'M 0 6.8627430980692 117.44667 L 29.662311069 124.167 L 31.168319924099 167.99664 L 76.276407667128 160.36 L 93.414294730138 182.86 L 117.33218216619 179.14663 L 169.69006937622 46.116644 L 161.82793698923 113.96001 L 186.96384440228 88.43668 L 206.10676181361 160.82663 L 228.24161922864 162.616 L 230.67930664167 119.67668 L 272.3176940344 92.17663 L 294.63328146746 117.44667 L 616.79616888046 141.263 L 668.96103629649 130.89668 L 661.06894670631 163.762 L 686.20686111934 170.967 L 403.64471836237 160.36 L 427.4826039436 182.86 L 449.62049663866 136.846 L 471.73868077166 167.31663 L 496.89626818469 166.366 L 316.06413339772 178.4 L 368.17204601073 176.196 L 360.60996042678 188.066 L 382.44781786681 183.864 L 604.38370324984 162.04668 L 626.72639266287 166.366 L 648.8614800739 139.07662 L 670.99966748896 163.762 L 696.16723490196 184.646'
    var dd_b ='M 0 163.8 L 15.872340425532 189 L 31.744680851064 189 L 47.617021276596 176.4 L 63.489361702128 163.8 L 79.36170212766 189 L 95.234042553191 138.6 L 111.10638297872 189 L 126.97872340426 151.2 L 142.85106382979 176.4 L 158.72340425532 126 L 174.59574468085 50.400000000000006 L 190.46808510638 189 L 206.34042553191 176.4 L 222.21276595745 163.8 L 238.08510638298 163.8 L 253.95744680851 113.4 L 269.82978723404 163.8 L 285.70212765957 176.4 L 301.57446808511 151.2 L 317.44680851064 138.6 L 333.31914893617 138.6 L 349.1914893617 189 L 365.06382978723 126'
    var dd_c ='M 6.9313725490196 211.85 L 37.067774936061 223 L 67.204177323103 217.425 L 97.340579710145 223 L 127.47698209719 223 L 157.61338448423 217.425 L 187.74978687127 195.125 L 217.88618925831 150.52499999999998 L 248.02259164535 211.85 L 278.1589940324 183.975 L 308.29539641944 156.1 L 338.43179880648 94.775 L 368.56820119352 172.825 L 398.70460358056 183.975 L 428.8410059676 189.55 L 458.97740835465 172.825 L 489.11381074169 117.075 L 519.25021312873 178.4 L 549.38661551577 100.35 L 579.52301790281 27.875 L 609.65942028986 89.19999999999999 L 639.7958226769 161.675 L 669.93222506394 167.25 L 700.06862745098 133.8'
    var [home_dingdan,home_xiaoshou,home_yue,home_goumai,home_ipi,home_shangcheng,home_xiaoxi,home_cuxiao] = home_array
    var [num_dingdan,num_shuliang,num_xiaoshou,num_pingjun,num_pingjunxiaoshou] = num_array
    var [y_num_dingdan,y_num_shuliang,y_num_xiaoshou,y_num_pingjun,y_num_pingjunxiaoshou] = y_num_array
    var [day_jin,day_jin_n,day_zuo,day_zuo_n,day_zhou,day_zhou_n,day_nian,day_nian_n] = day_array
    var [year_jin,year_jin_n,year_qu,year_qu_n] = year_array
    // 获取地址
    var href = window.location.href
    // 店铺
    setInterval(function(){name_shop()},10);
    // 业务报告
    var rdailyhref = /sellercentral.amazon.com\/business-reports\/ref=xx_sitemetric_dnav_xx/
    // 后台
    var homehref = /sellercentral.amazon.com\/gp\/homepage.html\/ref=xx_home_logo_xx|sellercentral.amazon.com\/home/
    var inthref = /sellercentral.amazon.com\/inventory\/ref/
    var acchref = 'https://sellercentral.amazon.com/hz/sc/account-information'
    var businesshref = 'https://sellercentral.amazon.com/sw/AccountInfo/LegalEntity/step/LegalEntity?ref_=macs_ailegent_cont_acinfohm'

    $().ready(function(){
    if (href == acchref){setInterval(() => {acc_1()}, 10); }
    if (href == businesshref) {setInterval(() => {b_page()}, 1000)}
    if (homehref.test(href)) {setInterval(() => {home_page()}, 1000)}
    if (inthref.test(href)) {int_page()}

    
    //  业务报告
    if (rdailyhref.test(href)) {report_sale()}
    })
    
 
    // id以“nameaddress”结尾的所有元素：
    // $("*[id$=nameaddress]").css("width", "234px");
    function home_page(){
        document.querySelector("#KpiCardList > div > div > div > div:nth-child(1) > casino-knowhere-layer > div > button > div > div.css-a74d04.e1i7w3tc56 > div:nth-child(2) > div.css-9jay18.e1i7w3tc54 > span").innerHTML = home_shangcheng
        document.querySelector("#KpiCardList > div > div > div > div:nth-child(2) > casino-knowhere-layer > div > button > div > div > div:nth-child(2) > div.css-9jay18.e1i7w3tc54 > span").innerHTML=home_dingdan
        document.querySelector("#KPI_CARD_SALES > casino-knowhere-layer > casino-card-compact > div > casino-button > div > div.casino-bottom-bar > div.casino-bottom-bar__data > div > casino-plain-text").shadowRoot.querySelector("div").innerHTML="US$"+home_xiaoshou
        document.querySelector("#KPI_CARD_MESSAGES > casino-knowhere-layer > casino-card-compact > div > casino-button > div > div.casino-bottom-bar > div.casino-bottom-bar__data > div > casino-plain-text").shadowRoot.querySelector("div").innerHTML=home_xiaoxi
        document.querySelector("#KpiCardList > div > div > div > div:nth-child(5) > casino-knowhere-layer > div > button > div > div > div:nth-child(2) > div.css-9jay18.e1i7w3tc54 > span").innerHTML=home_goumai
        document.querySelector("#KpiCardList > div > div > div > div:nth-child(6) > casino-knowhere-layer > div > button > div > div > div:nth-child(2) > div.css-9jay18.e1i7w3tc54 > span").innerHTML="US$"+home_yue
        document.querySelector("#KpiCardList > div > div > div > div:nth-child(7) > casino-knowhere-layer > div > button > div > div > div:nth-child(2) > div.css-9jay18.e1i7w3tc54 > span").innerHTML=home_ipi
        document.querySelector("#KpiCardList > div > div > div > div:nth-child(8) > casino-knowhere-layer > div > button > div > div > div:nth-child(2) > div.css-9jay18.e1i7w3tc54 > span").innerHTML="US$"+home_cuxiao
    }
    // 库存页面
    function int_page(){
        setTimeout(() => {
            document.querySelectorAll("table.a-bordered.a-horizontal-stripes.mt-table > tbody > tr > td:nth-child(7) > div > div a")[0].innerHTML = product_1_name
            document.querySelectorAll("table.a-bordered.a-horizontal-stripes.mt-table > tbody > tr > td:nth-child(7) > div > div a")[1].innerHTML = product_2_name
            document.querySelectorAll("table.a-bordered.a-horizontal-stripes.mt-table > tbody > tr > td:nth-child(7) > div > div:nth-child(2) span")[0].innerHTML = product_1_asin
            document.querySelectorAll("table.a-bordered.a-horizontal-stripes.mt-table > tbody > tr > td:nth-child(7) > div > div:nth-child(2) span")[1].innerHTML = product_2_asin
            document.querySelectorAll("table.a-bordered.a-horizontal-stripes.mt-table > tbody > tr > td:nth-child(6) > div > div a")[0].innerHTML = product_1_sku
            document.querySelectorAll("table.a-bordered.a-horizontal-stripes.mt-table > tbody > tr > td:nth-child(6) > div > div a")[1].innerHTML = product_2_sku
            document.querySelectorAll("table.a-bordered.a-horizontal-stripes.mt-table > tbody > tr > td:nth-child(4)  span")[2].innerHTML = '变体 ('+product_1_va+')'
            document.querySelectorAll("table.a-bordered.a-horizontal-stripes.mt-table > tbody > tr > td:nth-child(4)  span")[3].innerHTML = '变体 ('+product_2_va+')'
        }, 1000);
        
    }
    // 账户信息
    function acc_1(){
        document.querySelector("#headertext-SellerProfile").innerHTML = '欢迎 '+amzname+' <a href="/sw/AccountInfo/SellerProfileView/step/SellerProfileView">(编辑)</a>'
        // document.querySelector("#head-SellerProfile > div > table > tbody > tr > td > h5").innerHTML = '欢迎 '+amzname+' <a href="/sw/AccountInfo/SellerProfileView/step/SellerProfileView">(编辑)</a>'
    }
    // 公司信息
    function b_page(){
        document.querySelector("#legalNameValue").innerHTML = b_name
        document.querySelector("#activeAddressLine1").innerHTML = b_dizhi1
        document.querySelector("#activeAddressLine2").innerHTML = b_dizhi2
        document.querySelector("#activeAddressCity").innerHTML = b_chengshi
        document.querySelector("#activeAddressState").innerHTML = b_sheng
        document.querySelector("#activeAddressPincode").innerHTML = b_youbian
    }
    function name_shop()
    {document.querySelector("#partner-switcher > button > span > b").innerHTML = amzname}
    var Interval_1
    // 业务报告
    function report_sale() {
        var Interval_1 = setInterval(function(){
            if(document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(1) > h2")){
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(1) > h2").innerHTML = num_dingdan
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(2) > h2").innerHTML = num_shuliang
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(3) > h2").innerHTML = num_xiaoshou
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(4) > h2").innerHTML = num_pingjun
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(5) > h2").innerHTML = num_pingjunxiaoshou
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-mtxrhn > div.css-1xaekgw > div > div.css-2imjyh > div:nth-child(2) > div.kat-col-xs-10").innerHTML= '<div color="#00A4B4" class="css-9uqwkh">今天（迄今为止）</div><div class="css-a2wsy3">到目前为止</div><div>'+day_jin+' <span class="css-a2wsy3">商品数量</span></div>US$'+day_jin_n
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-mtxrhn > div.css-1xaekgw > div > div.css-2imjyh > div:nth-child(3) > div.kat-col-xs-10").innerHTML = '<div color="#E02D00" class="css-oitytw">昨天</div><div class="css-a2wsy3">到一天结束</div><div>'+day_zuo+' <span class="css-a2wsy3">商品数量</span></div>US$'+day_zuo_n
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-mtxrhn > div.css-1xaekgw > div > div.css-2imjyh > div:nth-child(4) > div.kat-col-xs-10").innerHTML = '<div color="#FF8F00" class="css-1npre0o">上周同一天</div><div class="css-a2wsy3">到一天结束</div><div>'+day_zhou+' <span class="css-a2wsy3">商品数量</span></div>US$'+day_zhou_n
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-mtxrhn > div.css-1xaekgw > div > div.css-2imjyh > div:nth-child(5) > div.kat-col-xs-10").innerHTML = '<div color="#879596" class="css-grytgs">去年同一天</div><div class="css-a2wsy3">到一天结束</div><div>'+day_nian+' <span class="css-a2wsy3">商品数量</span></div>US$'+day_nian_n
                clearInterval(Interval_1)
            }
        },10);
        setTimeout(function(){
            document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-1.highcharts-line-series > path.highcharts-graph")[0].setAttribute("d",dd_a)
            document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-1.highcharts-line-series > path.highcharts-graph")[1].setAttribute("d",dd_a)
            // alert("001")
            document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-2.highcharts-line-series > path.highcharts-graph")[0].setAttribute("d",dd_b)
            document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-2.highcharts-line-series > path.highcharts-graph")[1].setAttribute("d",dd_b)
            // alert("002")
            document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-3.highcharts-line-series > path.highcharts-graph")[0].setAttribute("d",dd_c)
            document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-3.highcharts-line-series > path.highcharts-graph")[1].setAttribute("d",dd_c)
            // alert("004")
            document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-0.highcharts-line-series > path.highcharts-graph")[0].setAttribute("d",dd)
            document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-0.highcharts-line-series > path.highcharts-graph")[1].setAttribute("d",dd)
            document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(1)")[0].innerHTML = 0
            document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(2)")[0].innerHTML = 199
            document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(3)")[0].innerHTML = 299
            document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(4)")[0].innerHTML = 399
            document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(1)")[1].innerHTML = 1990
            document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(2)")[1].innerHTML = 2990
            document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(3)")[1].innerHTML = 3990
            document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(4)")[1].innerHTML = 4990
            document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(5)")[0].innerHTML = 5999
            
            // var a_1 = document.querySelectorall("svg.highcharts-root")[0]
            // var a_2 = document.querySelectorall("svg.highcharts-root")[1]
            // a_1.document.querySelectorAll
            // document.querySelector("svg.highcharts-root:nth-child(1) > svg > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(5)").innerHTML = "5000"
            // alert("005")
        }, 3000);
        // 业务报告——年
        var year = "1 月"
        var interval_2 = setInterval(function(){
            var date_y = document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-xaxis-labels > text:nth-child(1) > tspan")[0].innerHTML
            // alert(date_y)
            if(date_y == year){
                document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-1.highcharts-line-series > path.highcharts-graph")[0].setAttribute("d",dd)
                document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-0.highcharts-line-series > path.highcharts-graph")[0].setAttribute("d",dd)
                document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-1.highcharts-line-series > path.highcharts-graph")[1].setAttribute("d",dd)
                document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-0.highcharts-line-series > path.highcharts-graph")[1].setAttribute("d",dd)
                document.querySelectorAll("svg.highcharts-root > g.highcharts-series-group > g.highcharts-series.highcharts-series-0.highcharts-line-series > path.highcharts-graph")[1].setAttribute("d",dd)
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-mtxrhn > div.css-1xaekgw > div > div.css-2imjyh > div:nth-child(2) > div.kat-col-xs-10").innerHTML='<div color="#00A4B4" class="css-9uqwkh">今年截至目前</div><div class="css-a2wsy3">到目前为止</div><div>'+year_jin+' <span class="css-a2wsy3">商品数量</span></div>US$'+year_jin_n
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-mtxrhn > div.css-1xaekgw > div > div.css-2imjyh > div:nth-child(3) > div.kat-col-xs-10").innerHTML='<div color="#E02D00" class="css-oitytw">去年</div><div class="css-a2wsy3">到年底</div><div>'+year_qu+' <span class="css-a2wsy3">商品数量</span></div>US$'+year_qu_n
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(1) > h2").innerHTML = y_num_dingdan
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(2) > h2").innerHTML = y_num_shuliang
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(3) > h2").innerHTML = y_num_xiaoshou
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(4) > h2").innerHTML = y_num_pingjun
                document.querySelector("#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(5) > h2").innerHTML = y_num_pingjunxiaoshou
                document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(1)")[0].innerHTML = 0
                document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(2)")[0].innerHTML = "5K"
                document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(3)")[0].innerHTML = "10K"
                document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(4)")[0].innerHTML = "15K"
                document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(5)")[0].innerHTML = "20K"
                document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(1)")[1].innerHTML = "100K"
                document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(2)")[1].innerHTML = "200K"
                document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(3)")[1].innerHTML = "300K"
                document.querySelectorAll("svg.highcharts-root > g.highcharts-axis-labels.highcharts-yaxis-labels > text:nth-child(4)")[1].innerHTML = "400K"
                clearInterval(interval_2)
            }
        }, 3000);
    }