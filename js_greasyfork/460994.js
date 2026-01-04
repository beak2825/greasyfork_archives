// ==UserScript==
// @name        拍卖详情
// @namespace   Violentmonkey Scripts
// @match       https://*-item.taobao.com/sf_item/*.htm
// @match       https://*-item.taobao.com/auction/*.htm
// @require      https://cdn.staticfile.org/jquery/3.6.3/jquery.min.js
// @grant       none
// @version     2.3
// @license     MIT
// @author      -
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @description 2023/3/2 上午12:37:44
// @downloadURL https://update.greasyfork.org/scripts/460994/%E6%8B%8D%E5%8D%96%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/460994/%E6%8B%8D%E5%8D%96%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

function closeTab() {
    window.opener = null;
    window.open('', '_self');
    window.close();
}

function getLocalTime(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}

function sleep(n) {
    const start = new Date().getTime();
    while (true) {
        if (new Date().getTime() - start > n) {
            break;
        }
    }
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = decodeURIComponent(r[2]);
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

function getGongGao(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false); // 同步请求
    xhr.send();

    // 处理响应
    if (xhr.readyState == 4 && xhr.status == 200) {
        return xhr.responseText
    }
}

function sendData(timer){
    let data = {}
    data.code = window.location.pathname.match(/\d+/)[0]
    data.url = window.location.href
    data.title = document.querySelector("head > title").text
    let addr = document.querySelector("#itemAddress").textContent.split(" ");
    data.shi = addr[1]
    data.qu = addr[2]
    let value = document.querySelector("#J_Coordinate")?.value;
    if (value) {
        let sv = value.split(",")
        data.lat = sv[1]
        data.lng = sv[0]
    }
    // data.biaoqian = ""
    data.jieduan = document.querySelector("#page > div:nth-child(7) > div > div > h1 > span")?.innerText
    data.qipaijia = document.querySelector("#J_HoverShow > tr:nth-child(2) > td:nth-child(1) > span.pay-price > span").innerText.replace(/,/gi, '') * 1
    data.pinggujia = GetQueryString("pgj");
    let time = document.querySelector("#sf-countdown");
    if (time) {
        data.shijian = getLocalTime(time.attributes["data-start"].value)
        data.jieshu = getLocalTime(time.attributes["data-end"].value)
        let tm = document.querySelector("#sf-countdown > span.title.J_TimeTitle")
        if(tm){
            data.zhuangtai = document.querySelector("#sf-countdown > span.title.J_TimeTitle").textContent === '距开始' ? '即将开始' : '进行中'
        }else{
            data.zhuangtai = document.querySelector("#page > div:nth-child(7) > div > div > div.pm-main-l.auction-interaction > div.pm-bid-block > div > h1").innerText
        }
    } else {
        data.zhuangtai = '已结束'
        let s = document.querySelector("#page > div:nth-child(7) > div > div > div.pm-main-l.auction-interaction > div.pm-bid-block > ul > li:nth-child(1) > span.countdown.J_TimeLeft")
        if(!s){
          // let res = confirm('状态异常，点击关闭');
          // if(res == true) {
            closeTab()
          // }else{
          //   return
          // }
        }
        data.jieshu = document.querySelector("#page > div:nth-child(7) > div > div > div.pm-main-l.auction-interaction > div.pm-bid-block > ul > li:nth-child(1) > span.countdown.J_TimeLeft").innerText
    }
    data.dingwei = document.querySelector("#itemAddressDetail").textContent
    data.xiaoqu = document.querySelector("#itemAddressDetail").textContent

    let string = GetQueryString("mj")
    if(string === "0"){
        let matchMianji = document.body.innerText.match(/(\d+\.?\d+) ?平方米/)
        if (!matchMianji) {
            sleep(1000)
            matchMianji = document.body.innerText.match(/建筑面积(.*?)平方米/)
            if (matchMianji) {
                data.mianji = (matchMianji.length === 2 ? matchMianji[1] : matchMianji[0]) * 1
            }
        } else {
            data.mianji = (matchMianji.length === 2 ? matchMianji[1] : matchMianji[0]) * 1
        }
    }else{
      data.mianji = string || '0'
    }

    data.danjia = "0"

    let sx = $("#J_HoverShow").children("tr")
    // let sx = document.querySelectorAll("#J_HoverShow")[0]?.querySelectorAll("td")
    // debugger
    for(var x=0;x<sx.length;x++){
      $(sx[x]).children("td").children("div").remove()
    }
    if (sx.length > 0) {
        data.shuxings = sx[0]?.innerText + ";" + sx[3]?.innerText + ";" + sx[6]?.innerText + ";" + sx[1]?.innerText + ";" + sx[4]?.innerText + ";" + sx[2]?.innerText + ";" + sx[5]?.innerText
    }
    data.shuxings = data.shuxings?.replace(/\t/g,";")

    // data.zhejialv = ""
    data.img_url = document.querySelector("#J_ItemDetailContent > div.video-img > div > div:nth-child(1) > img")["src"]
    let imgs = []
    document.querySelectorAll("#J_ItemDetailContent > div.video-img > div img").forEach((d) => {
        imgs.push(d.src)
    })
    data.img_urls = imgs.join(";") + ";"
    // data.content_1 = ""
    // data.content_2 = ""
    // data.content_3 = ""
    // data.number_1 = "0"
    // data.number_2 = "0"
    // data.number_3 = "0"
    // data.number_4 = "0"
    // data.number_5 = "0"
    // data.number_6 = "0"
    // data.number_7 = "0"
    // data.number_8 = "0"
    data.leixing = GetQueryString("pp") === '1' ? 1 : 2
    // data.create_date =
    // console.log(JSON.stringify(data))

    GM_xmlhttpRequest({
        method: "post",
        url: 'http://localhost:8085/save',
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function (succRes) {
            // code

            console.log("succRes = " + succRes)
            clearInterval(timer)
            closeTab()
        }
    });
}

(function () {
    'use strict';
    // &pm_debug=true
    window.addEventListener('load', (event) => {
        let x = 1;
        let flag = false
        setInterval(function () {
            if (x < 50) {
                window.scrollTo(0, x * 230);
            } else {
                flag = true
            }
            x++
        }, 10)

        let timer = setInterval(() => {
            if (!flag) {
                return
            }
            sendData(timer)
        }, 100)
    })
})();