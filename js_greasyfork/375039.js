// ==UserScript==
// @name         AliExpress Tools
// @namespace    http://tampermonkey.net/
// @version      0.2.8
// @description  try to take over the world!
// @author       Everest
// @match        https://trade.aliexpress.com/orderList.htm*
// @grant       GM_log
// @grant       GM_xmlhttpRequest
//@require      http://libs.baidu.com/jquery/2.0.0/jquery.js
// @icon data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQu5kAELua3BC7m8QQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELubxBC7mtwQu5kAAAAAAAAAAAAAAAAAELuZ0BC7m/QQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/QQu5nQAAAAABC7mQAQu5v0ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/QQu5kAELua3BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7mtwQu5vEELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELubxBC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BS/m/yVJ6f89Xuv/PV7r/yVJ6f8FL+b/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/MFPq/5ys9f/p7fz//v7+/////////////v7+/+nt/P+crPX/MFPq/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/DTbm/5eo9P/8/P7////////////////////////////////////////////8/P7/l6j0/w025v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/xY95//K0/n////////////6+/7/sL33/2uE8P9JaOz/SWjs/2uE8P+wvff/+vv+////////////ytP5/xY95/8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8JMub/w835////////////v8r4/yhM6f8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8oTOn/v8r4////////////w835/wky5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/4CV8v///////////6a19v8IMeb/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8IMeb/prX2////////////gJXy/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8YP+j/9PX9///////P1/r/CjPm/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8KM+b/z9f6///////09f3/GD/o/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/3SL8f///////v7+/0Ni7P8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v9DYuz//v7+//////90i/H/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/vMf4///////a4Pv/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v/a4Pv//////7zH+P8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v/p7Pz//////56u9f8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/56u9f//////6ez8/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BjDm//r7/v//////hZny/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/hZny///////6+/7/BjDm/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/qrj2/+vu/f88XOv/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v88XOv/6+/9/6m49v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/Bi/m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8GL+b/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wMv5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8DL+b/Az7p/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wM+6f8CYPH/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/AmDx/wCR/f8DOej/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wM56P8Akf3/AJn//wCF+v8DOej/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8ELub/BC7m/wQu5v8DOej/AIX6/wCZ//8Amf/xAJn//wCR/f8BYvL/A0Dq/wMy5/8DMeb/AzHm/wMx5v8DMeb/AzHm/wMx5v8DMeb/AzHm/wMx5v8DMeb/AzHm/wMx5v8DMeb/AzHm/wMx5v8DMeb/AzHm/wMx5v8DMeb/AzHm/wMy5/8DQOr/AWLy/wCR/f8Amf//AJn/8QCZ/rcAmf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf+3AJn/QACZ//0Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//QCZ/0AAAAAAAJn/dACZ//0Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//0Amf90AAAAAAAAAAAAAAAAAJn/QACZ/7cAmf7xAJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ//8Amf//AJn//wCZ/vEAmf+3AJn/QAAAAAAAAAAA4AAAB8AAAAOAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABwAAAA+AAAAc=
// @downloadURL https://update.greasyfork.org/scripts/375039/AliExpress%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/375039/AliExpress%20Tools.meta.js
// ==/UserScript==

let threadNum = 10;
let currencyRate = 6.9;
let getCurrencyRate = false;
let checkUrl1 = "https://ilogistics.aliexpress.com/warehouse_order_list.htm";
let checkUrl2 = "https://cainiao.aliexpress.com/export/ae/logistics/order/getDetail.htm?lgOrderCode=";

(function() {
    'use strict';

    usdcny();

    function startCheck() {
        let domsArr = $("tr.order-head");
        //console.log(/orderId=([0-9]*)/.exec(domsArr[0].innerHTML));
        for(let i = 0; i < domsArr.length; i ++){

            let img = `<img id="currentImg" onload="" src="https://loading.io/spinners/microsoft/index.rotating-balls-spinner.svg" width="50" height="50" style="margin-left:30px;top: 35px; left: 70px; width: 33px; height: 33px; cursor: pointer; display: block;" title="正在获取数据...">`;
            //let img = `<img id="currentImg" onload="" src="http://img0.imgtn.bdimg.com/it/u=1775335950,1955496540&amp;fm=214&amp;gp=0.jpg" width="50" height="50" style="margin-left:30px;top: 35px; left: 70px; width: 33px; height: 33px; cursor: pointer; display: block;" title="正在获取数据...">`;
            //let img = `<img id="currentImg" onload="" src="http://www.sucaijishi.com/uploadfile/2015/0210/20150210104950809.gif" width="32" height="32" style="margin-left:35px;top: 30px; left: 30px; width: 32px; height: 32px; cursor: pointer; display: block;" title="正在获取数据...">`;
            let node = domsArr[i].parentNode.querySelector(".product-action");
            node.innerHTML = node.innerHTML + img;
            let amountNode = domsArr[i].querySelectorAll("td")[2];
            let amount = /\$\s*([0-9\.]*).*<\/strong>/.exec(amountNode.innerHTML)[1];

            let span0 = document.createElement("span");
            span0.setAttribute("class", "f-left")
            span0.setAttribute("style", "word-wrap:break-word;");
            span0.innerHTML = "<strong>$ " + amount + " x " + currencyRate + " = <font color=red>CNY "  + Math.floor(amount * currencyRate * 100)/100 + "</font></strong>";
            amountNode.append(span0);
        }

        checkAll(domsArr, 0);
    }
    function checkAll(domsArr, index){
        for(let i = index; i < domsArr.length; i++){
            checkLogisticsInfo(domsArr[i]);
            if((i+1) % threadNum  == 0 && (i+1) < domsArr.length) {
                setTimeout(function(){checkAll(domsArr, ++i);}, 1000);
                break;
            }
        }
    }

    function getLogisticsDetail(dom, detailUrl) {
        GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {"Accept": "text/html"},
        url : detailUrl,
        onload : function (response) {
            //console.log(response.responseText);
            let status = /class="status-success.*>\s*(.*)\s*(<span>(.*)<\/span>)*\s*<\/div>/.exec(response.responseText);
            status = status && status[3] ? status[1] + status[3] : status[1];
            let fee = /总金额:\s*.*\s*.*CNY : ([\.0-9]*)/.exec(response.responseText);
            let address = /收货地址:<\/td>\s*.*((\s*.*){7})/.exec(response.responseText);
            if (address) {
                address = address[1].replace(/\s{2,}/g, "");
                address = address.replace(/<\/td>.*$/g, "");
            } else {
                address = "暂无信息";
            }
            //console.log(address);
            let loadingNode = dom.parentNode.querySelector("#currentImg");
            loadingNode && loadingNode.setAttribute("style","display:none;");
            status = fee && fee[1] ? status + " <font color=red>CNY: " + fee[1] + "</font>": status;
            console.log(status);
            let insertNode = dom.parentNode.querySelector(".product-action");
            let html = '<a class="TP_MakePoint" target="_blank" href="' + detailUrl + '"> ' + status + '</a>';
            let span1 = document.createElement("span");
            span1.setAttribute("class", "f-left")
            span1.setAttribute("style", "word-wrap:break-word;");
            span1.innerHTML = address;
            let span2 = document.createElement("span");
            span2.setAttribute("class", "f-left")
            span2.innerHTML = html;
            insertNode.appendChild(span1);
            insertNode.appendChild(span2);
			if (fee && fee[1]) {
                let amountNode = dom.querySelectorAll("td")[2];
                let amount = /\$\s*([0-9\.]*).*<\/strong>/.exec(amountNode.innerHTML)[1];
                let cny = Math.floor(amount * currencyRate * 100)/100;
                let profit = Math.floor((cny - parseFloat(fee[1])) * 100) / 100;
                let span3 = document.createElement("span");
                span3.setAttribute("class", "f-left");
                span3.setAttribute("style", "word-wrap:break-word");

                span3.innerHTML = "<font color=#06c>" + cny + " - " + fee[1] + " = </font><font color="+ (profit > 0 ? "#E62E04" : "green") + ">" + profit + "</font>";
                insertNode.appendChild(span3);
            }
            //setTimeout(function(){checkLogisticsInfo(domsArr, ++index);}, 200);
          }
        });
    }
    function checkLogisticsInfo(dom) {
      
        let tradeId = /orderId=([0-9]*)/.exec(dom.innerHTML)[1];
        console.log(tradeId);
        GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {"Accept": "text/html"},
        url : checkUrl1 + "?page=1&tradeOrderId=" + tradeId + "&intlTrackingNo=&warehouseOrderId=&logisticsChannel=&warehouseCode=&logisticsStatus=all&gmtStartStr=&gmtEndStr=",
        onload : function (response) {
            //index++;
            //匿名函数封装解决setTimeout传递参数问题
            //console.log(response);

            let detailUrl = /href="(.*cainiao.aliexpress.com.*?)"\s*.*查看详情/.exec(response.responseText);
            //console.log(detailUrl);

            if(!detailUrl || !detailUrl[1]) {
                let loadingNode = dom.parentNode.querySelector("#currentImg");
                loadingNode && loadingNode.setAttribute("style","display:none;");
                let insertNode = dom.parentNode.querySelector(".product-action");
                let span1 = document.createElement("span");
                span1.setAttribute("class", "f-left")
                span1.setAttribute("style", "word-wrap:break-word;word-break:break-all;");
                span1.innerHTML = "<br>暂无信息";
                insertNode.appendChild(span1);

                //setTimeout(function(){checkLogisticsInfo(domsArr, ++index);}, 200);
            } else {
                getLogisticsDetail(dom, detailUrl[1]);
            }

          }
        });
    }

    function usdcny(){
        try {
            let sina_s = Math.floor(Math.random() * 100 + 1);
            GM_xmlhttpRequest({ //获取列表
                method : "GET",
                headers: {"Accept": "*/*",
                          "Accept-Encoding": "gzip, deflate",
                          "Accept-Language": "zh-CN,zh;q=0.9",
                          "AlexaToolbar-ALX_NS_PH": "AlexaToolbar/alx-4.0.1",
                          "Connection": "keep-alive",
                          "Host": "hq.sinajs.cn",
                          "Referer": "http://finance.sina.com.cn/money/forex/hq/USDCNY.shtml",
                          "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
                         },
                //url : 'http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=33675&sign=9e3944cf2ae6e4833818132430aa1da2&format=json',
                url : 'http://hq.sinajs.cn/rn='+new Date().getTime()+sina_s+'list=fx_susdcny',
                onload : function (res) {
                    console.log(res);
                    if (res.status == 200) {
                        let rs = res.responseText.split(",");
                        currencyRate = rs && rs[1] ? rs[1] : currencyRate;
                        getCurrencyRate = true;
                        startCheck();
                    }
                }
            });

        } catch(e){
            console.log("usdcny faild");
            if(!getCurrencyRate) {
                startCheck();
            }
        } finally {

        }
    }
})();