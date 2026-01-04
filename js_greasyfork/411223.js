// ==UserScript==
// @name         amazon asin prices
// @namespace    ppcross.com
// @version      0.2
// @description  amazon price history
// @author       ppcross.com
// @match        *://*.amazon.cn/*
// @match        *://*.amazon.com/*
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/echarts/4.8.0/echarts.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/411223/amazon%20asin%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/411223/amazon%20asin%20prices.meta.js
// ==/UserScript==
if(/(dp|gp\/product)\/(\w+\/)?(\w{10})/.test(window.location.href)) {
} else {
    return
}

var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver
    return function (obj, callback) {
        var obs = new MutationObserver(function (mutations, observer) {
            if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
                callback(observer);
            }
        });
        obs.observe(obj, {
            childList: true,
            subtree: true
        });
    };
})();

function injectScriptCode(code, node) {
    var th = document.getElementsByTagName(node)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('language', 'JavaScript');
    script.textContent = code;
    th.appendChild(script);
}

function formatDateTime(timeStamp) { 
    let date = new Date(timeStamp);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    month = month < 10 ? "0"+month:month;
    day = day < 10 ? "0"+day:day;
    let d = year+'-'+month+'-'+day;
    return d   
};
let arrData1 = []
let arrData2 = []
function initHistoryByTool168() {
    let item_url = window.location.href
    // let url_01 = 'http://www.tool168.cn/?m=history&a=view&k={0}&btnSearch={1}'.format(encodeURIComponent(item_url), encodeURIComponent('搜索'))
    let url_01 = 'http://www.tool168.cn/?m=history&a=view&k=' + item_url + '&btnSearch=' + '搜索'
    GM_xmlhttpRequest({
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        url: url_01,
        onload: function (res) {
            let data = res.response
console.log(JSON.stringify($(data).find("#checkCodeId")))
            let checkCode = $(data).find("#checkCodeId")[0].value;
            console.log(checkCode)
            let url_02 = "http://www.tool168.cn/dm/ptinfo.php"
            GM_xmlhttpRequest({
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: 'checkCode=' + checkCode + '&con=' + item_url ,
                url: url_02,
                onload: function (res) {
                    let code = JSON.parse(res.response).code ;
                    let url_03 = "http://www.tool168.cn/dm/history.php?" + 'code=' + code + '&t='
                    GM_xmlhttpRequest({
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        url: url_03,
                        onload: function (res) {
                            let jsonData = res.response
                            let datas = (jsonData.match(/(?<=\[).*?(?=\])/g))
                            
                            var arr = datas.map(function (d) {
                                ary = eval('[' + d + ']')
                                arrData1.push(formatDateTime(ary[0]))
                                arrData2.push(ary[1])
                                //ary = d.split(',')
                                // return {
                                //     dt: ary[0],
                                //     pr: ary[1],
                                //     yh: ''
                                // };
                            });
                            console.log(arrData1)
                            console.log(arrData2)
                        }
                    });
                }
            });
        }
    });
}
initHistoryByTool168()
function initialChart() {
    if (typeof (echarts) == "undefined") {
        setTimeout(function () {
            initialChart();
        }, 50)
    } else {
        item.removeAttribute('_echarts_instance_');
        var myChart = echarts.init(document.getElementById('item'), null, {
            renderer: 'svg'
        });
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: ''
            },
            tooltip: {},
            legend: {
                data: ['销量']
            },
            xAxis: {
                // data: ['2000', '2001', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
                data: arrData1

            },
            yAxis: {
                type: 'value'
            },
            series: [{
                    name: '销量',
                    type: 'line',
                    // data: [5, 20, 36, 10, 22, 60, 20, 1, 10, 10, 20, 20, 5, 5, 10, 20, 20, 36, 10, 10, 20, 40]
                    data: arrData2
                }
            ]
        };
        myChart.setOption(option);
    }
}
let initialone = true;
let div = document.createElement("div");
div.style.cssText = "width:8vw;height:8vw;position: fixed;right: 10px;top: 200px;border-radius: 50%;opacity: 0.7;z-index:999;-webkit-box-shadow: 3px 5px 7px -1px #c1b1b1;'";
var bagimg = document.createElement("img");
bagimg.src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595496026210&di=904958e5fd6c63b7de9faa177899f730&imgtype=0&src=http%3A%2F%2Feaassets-a.akamaihd.net%2Fbattlelog%2Fprod%2Femblem%2F263%2F734%2F256%2F2955060603055711583.png%3Fv%3D1398783483";
bagimg.style.cssText = "width:8vw;height:8vw;border-radius: 50%;opacity: 0.8;z-index:999;"
div.appendChild(bagimg);
document.body.appendChild(div);
let div2 = document.createElement("div");
div2.innerHTML = `<div id='bag' style='width: 100%;height: 100%;position: fixed;top: 0;left: 0;display: none;z-index:1000;'>
<div id='item' style='z-index:1001;width: 100%;height:35vh;background:#fff;position: fixed;top: 25vh;-webkit-box-shadow: 3px 5px 13px 3px #c1b1b1;'></div>
<div id='Advertising' style='overflow-y: auto;width: 100%;min-height:20vw;max-height:50vh;background:#fff;position: fixed;top: 25vh;-webkit-box-shadow: 3px 5px 13px 3px #c1b1b1;display: none;z-index:1002'>
</div>
<div style='z-index:1002;position: fixed;left:0;height:4.5vh;top: 20.5vh;background: #e4e7ed;border-bottom: 1px solid #e4e7ed;margin: 0;display: flex;border: #e4e7ed solid 1px;box-sizing: border-box;'>
<div id='logoimg' style='font-size: 1.5rem;background:#ccc;height:4.5vh;text-align: center;line-height: 4.5vh;'>
    <img style='height:4.5vh;width:4.5vh;' src='https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=246322238,2783736859&fm=26&gp=0.jpg'></img>
</div>
<div id='Statement' style='padding:0 0.5rem;font-size: 1.5rem;background:#fff;color: #409eff;height:4.5vh;text-align: center;line-height: 4.5vh;'>price history</div>
<div id='plot' style='padding:0 0.5rem;font-size: 1.5rem;color: #909399;background:#e4e7ed;height:4.5vh;text-align: center;line-height: 4.5vh;'>coupon</div>
</div>
</div>`
document.body.appendChild(div2);
let item = document.getElementById('item');
let bag = document.getElementById('bag');
let plot = document.getElementById('plot');
let Statement = document.getElementById('Statement');
let Advertising = document.getElementById('Advertising');
let isshow = true;
bag.onclick = (function () {
    bag.style.display = "none";
    div.style.display = "block";
})
div.onclick = (function () {
    bag.style.display = 'block';
    div.style.display = 'none';
    initHistoryByTool168()
    if (initialone) {
        //关闭曲线图
        initialChart()
        initialone = false;
    }
})
function stopBubble(e) {//阻止冒泡
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    } else {
        window.event.returnValue = false;
        window.event.cancelBubble = true;
    }
}
plot.onclick = (function (e) {
    stopBubble(e)
    plot.style.background = "#fff";
    plot.style.color = "#409eff";
    Statement.style.background = "#e4e7ed";
    Statement.style.color = "#909399";
    Advertising.style.display = "block";
    item.style.display = "none";
})
Statement.onclick = (function (e) {
    stopBubble(e)
    Statement.style.background = "#fff";
    Statement.style.color = "#409eff";
    plot.style.background = "#e4e7ed";
    plot.style.color = "#909399";
    Advertising.style.display = "none";
    item.style.display = "block";
})
item.onclick = function (e) { 
    stopBubble(e);
}
// ---------------.获取推荐数据
function get_(url, fn) {
    var xhr = new XMLHttpRequest();            
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
            climb(xhr.responseText);
        }
    };
    xhr.send();
}
var xpath_ = function(xpathToExecute,data){
    var result = [];
    var nodesSnapshot = document.evaluate(xpathToExecute, data, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    for ( var i=0 ; i < nodesSnapshot.snapshotLength; i++ ){
        result.push( nodesSnapshot.snapshotItem(i) );
    }
    return result;
}
function climb(data) {
    let ama = document.createElement("div");
    ama.innerHTML = data;
    let arr = [];
    var noot = document.evaluate("//div[@class='s-result-item s-asin sg-col sg-col-12-of-12']", ama, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    for ( var i=0 ; i < noot.snapshotLength; i++ ){
        if (noot.snapshotItem(i).innerHTML.indexOf('a-price-symbol') > 0){
            let eme = document.createElement("div");
            eme.appendChild(noot.snapshotItem(i));
            let obj = {};
            obj.img = document.evaluate("//img[@class='s-image']", eme).iterateNext().src;
            obj.grade = document.evaluate("//div[@class='a-section a-spacing-none a-spacing-top-mini']", eme).iterateNext();
            obj.a = document.evaluate("//a[@class='a-link-normal s-faceout-link a-text-normal']", eme).iterateNext().href;
            obj.title = document.evaluate("//span[@class='a-size-base a-color-base a-text-normal']", eme).iterateNext().innerText;
            let pri = xpath_("//span[@class='a-offscreen']", eme)
            for( let i=0 ; i < pri.length; i++ ){
                if(i == 0) {
                    obj.price = pri[i].innerHTML;
                } else {
                    obj.discountPrice = pri[i].innerHTML;
                }
            }
            arr.push(obj);
        }
    }
    if(arr.length == 0){
        // Advertising.innerText = "暂无数据";
        // Advertising.style["text-align"] = "center";
        // Advertising.style["line-height"] = "20vw";
        // Advertising.style.color = "#777";
        plot.style.display = "none"
    }else{
        coated(arr);
    }
    
}
function coated(data) {
    for( let i=0 ; i < data.length; i++ ){
        let a = document.createElement('a');
        a.setAttribute('href', data[i].a);
        a.setAttribute('target', '_blank');
        a.setAttribute('id', 'startTelMedicine');
        let content = document.createElement("div");
        content.style.cssText = "padding:2.5vw 0 2.5vw 2.5vw;display:flex;border-bottom:.1rem solid #e7e7e7;";
        let img = new Image();
        img.style.cssText = "width:15vw;height:15vw;margin-right:3vw;";
        img.src = data[i].img;
        let right = document.createElement("div");
        right.style.cssText = "width:60vw;display:flex;margin-right:2vw;flex-direction:column";
        let title = document.createElement("div");
        title.innerText = data[i].title;
        title.style.cssText = "font-size: 1.3rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:100%;";
        let jiage = document.createElement("div");
        jiage.style.cssText = "display:flex;width:17.5vw;flex-direction:column;";
        let price = document.createElement("div");
        price.innerText = data[i].price;
        price.style.cssText = "font-size: 1.3rem;width:17.5vw;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#555;";
        jiage.appendChild(price);
        if(data[i].discountPrice){
            let discountPrice = document.createElement("div");
            discountPrice.innerText = data[i].discountPrice;
            discountPrice.style.cssText = "font-size: 1.15rem;width:17.5vw;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#999;text-decoration:line-through";
            jiage.appendChild(discountPrice);
        }
        right.appendChild(title);
        if(data[i].grade) {
            right.appendChild(data[i].grade);
        }
        content.appendChild(img);
        content.appendChild(right);
        content.appendChild(jiage);
        a.appendChild(content);
        Advertising.appendChild(a);
    }
}
let title = document.getElementById('title');
let url = "/s?k=" + title.innerText.replace(/^\s*|\s*$/g,"") + "&i=coupons&srs=2231352011&aff=xxx&aff=xxx&pldnSite=1&sa-no-redirect=1"
get_(url)