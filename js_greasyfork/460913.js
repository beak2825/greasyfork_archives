// ==UserScript==
// @name         zherop小工具
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  一键无图、隐藏图片、查看源代码、爱问财选股
// @author       zherop@163.com
// @match        *://*/*
// @connect  static.61read.com
// @connect  basic.10jqka.com.cn
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @grant GM_download
// @grant GM_openInTab
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/460913/zherop%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/460913/zherop%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义
    var menus = [
        {"code":"noPic","name":"一键无图","event":"noPic"},
        {"code":"hidePic","name":"隐藏图片","event":"hidePic"},
        {"code":"viewSource","name":"查看源代码","event":"viewSource"},
        {"code":"downloadPng","name":"下载图片","event":"downloadPng","domain":"http://static.61read.com/"},
        {"code":"openIframe","name":"访问iframe","event":"openIframe"},
        {"code":"checkTargetInIwencai","name":"标的筛选","event":"checkTargetInIwencai","domain":"https?://www.iwencai.com/"},
        {"code":"queryStockInfo","name":"查看标的信息","event":"queryStockInfo","domain":"https?://www.iwencai.com/"}
    ]

    // 菜单样式
    function menuStyle() {
        return `
            <style>
            .zp-menu {
                left: 0px;
                display: block;
                top: 50%;
                position: fixed;
                z-index: 9999;
                background: green;
                color: white;
                text-align: center;
                border-radius: 0 7px 7px 0px;
                font-size: 13px;
            }
            .zp-menu-item {
                padding: 5px;
                border: 1px solid;
                cursor: pointer;
            }

            @media screen and (max-width:768px) {
                .zp-menu {
                    font-size: 3.5vw
                }

            }

            </style>
         `
        }

    // 创建菜单DOM
    function createMenuDom() {
        var html = '<div id="zp-menu" class="zp-menu">'
        menus.forEach(item => {
            var regexObject = new RegExp(item.domain);
            if(!item.domain || item.domain == "*" || regexObject.test(window.location.href)) {
                html += `<div class="zp-menu-item" type="${item.code}">${item.name}</div>`
            }
        })
        html += '</div>'
        return html;
    }

    //  菜单事件
    // 一键无图
    function noPic(){
        $("img").remove();
        $("svg").remove();
    }

    // 隐藏图片
    function hidePic(){
        $("img").hide();
        $("svg").hide();
    }

    // 查看源代码
    function viewSource() {
        GM_openInTab('view-source:' + window.location.href)
    }

    // 下载图片
    function downloadPng() {
        var currentHref = window.location.href
        if(currentHref.startsWith('http://static.61read.com/')) {
            var baseURL = currentHref.substr(0,currentHref.lastIndexOf('/'))
            var xmlFile = unsafeWindow.xmlFile
            var pageFile = unsafeWindow.pageFile
            GM_xmlhttpRequest({
                method: "GET",
                url: baseURL + '/'+ pageFile + xmlFile,
                headers: {
                    "Content-Type": "application/xml"
                },
                onload: function(response) {
                    var responseXML = response.responseXML
                    var items = responseXML.getElementsByTagName('item')
                    for(var i=0;i<items.length;i++){
                        var path = items[i].getAttribute('href')
                        var imageURL = baseURL + '/'+ pageFile + path
                        console.log(imageURL)
                        var name = i + '.png'
                        if(path.lastIndexOf('/') > 0) {
                            name = path.substring(path.lastIndexOf('/') + 1)
                        }
                        download(imageURL,name);
                    }
                }
            });
        } else {
        }
    }

    function download(filePath,name){
        fetch(filePath).then(res => res.blob()).then(blob => {
            const a = document.createElement('a');
            document.body.appendChild(a)
            a.style.display = 'none'
            // 使用获取到的blob对象创建的url
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            // 指定下载的文件名
            a.download = name;
            a.click();
            document.body.removeChild(a)
            // 移除blob对象的url
            window.URL.revokeObjectURL(url);
        });
    }

    function download2(url,name) {
        GM_download({
            url: url,
            onerror: function (error) {
                console.log(error)
            },
            onprogress: (pro) => {
                console.log(pro.loaded) //文件加载量
                console.log(pro.totalSize) //文件总大小
            },
            ontimeout: () => {
                //如果此下载由于超时而失败，则要执行的回调
            },
            onload: () => {
                //如果此下载完成，则要执行的回调
            }
        })
    }

    // 打开iframe
    function openIframe() {
        if(document.getElementsByTagName("iframe").length > 0){
            window.open(document.getElementsByTagName("iframe")[0].src)
        } else {
            console.log('不存在iframe')
        }
    }

    function copyText(text) {
        if($('#zp-copy').length <= 0) {
            $("body").append('<textarea id="zp-copy" style="display:none;"></textarea>')
        }
        $('#zp-copy').text(text).show();
        var ele = document.getElementById("zp-copy");
        ele.select();
        if (document.queryCommandEnabled('copy')) {
            try {
                document.execCommand('copy');
                console.log('文本已复制到剪贴板');
            } catch (error) {
                console.error('复制到剪贴板失败:', error);
            }
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                console.log('文本已复制到剪贴板');
            })
                .catch((error) => {
                console.error('复制到剪贴板失败:', error);
            });
        } else {
            console.error('复制命令不可用');
        }
        $('#zp-copy').hide();
    }

    function getRequest(url,mimeType) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                overrideMimeType: mimeType ? mimeType:"text/html; charset=utf-8",
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject("Failed to fetch HTML page.");
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    async function checkTargetInIwencai() {
        console.log('checkTarget');
        if(window.location.href.startsWith("http://www.iwencai.com/")) {
            let trs = $(".iwc-table-scroll").find("tr");
            let data = []
            for(let i=0;i<trs.length;i++) {
                let tds = $(trs[i]).find("td");
                let obj = {}
                // checkbox元素
                obj.checkbox = $(tds[1]);
                // 标的代码
                obj.code = $(tds[2]).text();
                // 标的名称
                obj.name =  $(tds[3]).text();
                obj.price =  $(tds[4]).text();
                // ROE
                obj.r1 = $(tds[14]).text();
                obj.r2 = $(tds[15]).text();
                obj.r3 = $(tds[16]).text();
                obj.r4 = $(tds[17]).text();
                obj.r5 = $(tds[18]).text();
                // 净利润现金含量
                obj.c1 = $(tds[19]).text();
                obj.c2 = $(tds[20]).text();
                obj.c3 = $(tds[21]).text();
                obj.c4 = $(tds[22]).text();
                obj.c5 = $(tds[23]).text();
                // 毛利率
                obj.m1 = $(tds[24]).text();
                obj.m2 = $(tds[25]).text();
                obj.m3 = $(tds[26]).text();
                obj.m4 = $(tds[27]).text();
                obj.m5 = $(tds[28]).text();

                data.push(obj);
            }

            // 根据规则选中符合要求的标的
            let selectedData = []
            for(let j=0;j<data.length;j++) {
                let selected = false;
                let obj = data[j];

                // 连续5年的ROE中，平均值并且最近1年的数值高于20%的
                let rf = parseFloat(obj.r1);
                let rt = (parseFloat(obj.r1) + parseFloat(obj.r2) + parseFloat(obj.r3) + parseFloat(obj.r4) + parseFloat(obj.r5))/5;
                obj.rt = rt;
                if(rf >= 20 && rt >= 20) {
                    selected = true;
                } else {
                    selected = false;
                }

                // 连续5年的平均净利润现金含量高于100%的
                let ct = (parseFloat(obj.c1) + parseFloat(obj.c2) + parseFloat(obj.c3) + parseFloat(obj.c4) + parseFloat(obj.c5))/5;
                obj.ct = ct;
                if(ct >= 100) {
                    selected = selected && true;
                } else {
                    selected = selected && false;
                }

                // 连续5年的毛利率中，平均值并且最近1年的数值高于40%的
                let mf = parseFloat(obj.m1);
                let mt = (parseFloat(obj.m1) + parseFloat(obj.m2) + parseFloat(obj.m3) + parseFloat(obj.m4) + parseFloat(obj.m5))/5;
                obj.mt = mt;
                if(mt >= 40 && mf >= 40) {
                    selected = selected && true;
                } else {
                    selected = selected && false;
                }

                // 连续5年的资产负债率中，平均值且最近1年的数值小于60%
                if(selected) {
                    // 获取资产负债率
                    let htmlContent = await getRequest("http://basic.10jqka.com.cn/" + obj.code + "/finance.html","text/html; charset=gbk");
                    let financeData = parseFinance(htmlContent);
                    obj.financeData = financeData;
                    for(let i=0;i<financeData.length && i<5;i++){
                        if(parseFloat(financeData[i].value) > 60) {
                            selected = selected && false;
                            break;
                        }
                    }
                }

                // 连续5年的派息比率中，每年都大于25%
                if(selected){
                    // 获取派息比率数据
                    let htmlContent = await getRequest("http://basic.10jqka.com.cn/" + obj.code + "/bonus.html","text/html; charset=gbk");
                    let bonusData = parseBonus(htmlContent);
                    obj.bonusData = bonusData;
                    for(let i=0;i<bonusData.length && i<5;i++){
                        if(parseFloat(bonusData[i].value) < 25) {
                            selected = selected && false;
                            break;
                        }
                    }
                }

                if(selected) {
                    selectedData.push(obj);
                    obj.checkbox.click();
                }
            }

            // 复制选中的结果
            let content = "";
            for(let index in selectedData){
                content += "代码：" + selectedData[index].code + "\n";
                content += "名称：" + selectedData[index].name + "\n";
                content += "现价：" + selectedData[index].price + "\n";
                content += "连续5年的ROE平均值：" + selectedData[index].rt.toFixed(2) + "%\n";
                content += "连续5年的净利润现金含量平均值：" + selectedData[index].ct.toFixed(2) + "%\n";
                content += "连续5年的毛利率平均值：" + selectedData[index].mt.toFixed(2) + "%\n";
                let f = "";
                for(let i=0;i<selectedData[index].financeData.length && i<5;i++){
                    f += selectedData[index].financeData[i].title + " " + selectedData[index].financeData[i].value + "  ";
                }
                content += "连续5年的资产负债率：" + f + "\n";
                let b = "";
                for(let i=0;i<selectedData[index].bonusData.length && i<5;i++){
                    b += selectedData[index].bonusData[i].title + " " + selectedData[index].bonusData[i].value + "  ";
                }
                content += "连续5年的的派息比率：" + b + "\n";
                content += "--------------------------------------\n";
            }
            console.log(content);
            const result = confirm("筛选完成，是否复制选中标的信息？");
            if (result) {
                copyText(content);
            } else {
                console.log("用户点击了取消按钮。");
            }
        }

    }

    function parseFinance(htmlContent){
        let data = []
        let content = $(htmlContent).find("#main").text();
        let json = JSON.parse(content);
        let years = json.year[0];
        let values = json.year[json.year.length-1];
        for(let i=0;i<years.length;i++){
            let obj = {}
            obj.title = years[i];
            obj.value = values[i];
            data.push(obj);
        }
        return data;
    }

    // 解析i问财分红融资页面，获取派息比率数据
    function parseBonus(htmlContent){
        let trs = $(htmlContent).find("#bonus_table").find("tr");
        let data = []
        for(let i = 0;i< trs.length;i++) {
            let tds = $(trs[i]).find("td");
            let title = $(tds[0]).text();
            let value = $(tds[9]).text();
            if(value != "--") {
                let obj = {}
                obj.title = title;
                obj.value = value;
                data.push(obj);
            }
        }
        return data;
    }

    // 查看标的信息
    function queryStockInfo(){
        document.execCommand('copy');
        let stockCode = prompt("输入标的代码：");
        if(stockCode) {
            GM_openInTab("http://stockpage.10jqka.com.cn/" + stockCode);
        }

    }

    $(function(){
        $("head").append(menuStyle())
        $("body").append(createMenuDom())

        if(document.getElementsByTagName("iframe").length == 0){
            $(".zp-menu-item[type='openIframe']").hide()
        }


        // 菜单绑定事件
        $("#zp-menu .zp-menu-item").click(function(){
            var opType = $(this).attr("type")
            var currentMenu = menus.find(item => item.code===opType)
            if(currentMenu) {
                eval(currentMenu.event + "()")
            }
        })
    })
})();