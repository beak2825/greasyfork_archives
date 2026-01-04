// ==UserScript==
// @name         农民世界(Farmers World)监控网页插件
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  估算农民世界三大件的实时价格,并为各装备增加RMB价格显示
// @author       JimmyCHEN(jimone@qq.com)
// @match        https://fw.botuan.com/
// @match        https://fw.umaske.com/
// @require      http://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @connect      usd-cny.com
// @icon         https://fw.umaske.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/441016/%E5%86%9C%E6%B0%91%E4%B8%96%E7%95%8C%28Farmers%20World%29%E7%9B%91%E6%8E%A7%E7%BD%91%E9%A1%B5%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441016/%E5%86%9C%E6%B0%91%E4%B8%96%E7%95%8C%28Farmers%20World%29%E7%9B%91%E6%8E%A7%E7%BD%91%E9%A1%B5%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isUpdating = false;// 是否正在更新价格途中
    var fxUsdCny = '', fxDatetime='';// 人民币兑美元汇率行情和行情日期时间, 可从 https://www.usd-cny.com/cny/hl/1.js 中获取
    // 更新RMB美元汇率
    GM_xmlhttpRequest({
        method: "get",
        //要想跨域请求成功, 必须在头部添加 @connect 域名
        url: 'https://www.usd-cny.com/', //因发现 1.js 中的汇率不够及时, 改为从首页分析获取
        referer: 'https://www.usd-cny.com/usd-rmb.htm',
        onload: function(resp) {
            if(resp.status==200 && resp.responseText) {
                // 获取RMB美元汇率行情
                //从首页分析获取(因它家的js文件里的汇率不够及时), 网页源码内格式: <a href="//www.usd-cny.com/usd-rmb.htm">美元</a></td><td>631.31</td><td>626.18</td><td>633.99</td><td>633.99</td></tr><!--02-20 10:30-->
                const matches = resp.responseText.match(/usd-rmb\.htm[^\d]+([\d\.]+)[^\d]+([\d\.]+)[^\d]+([\d\.]+)[^\d]+([\d\.]+)[^\d]+<!--([\d \:\-]+)-->/i);
                if(matches.length > 0) {
                    //fxUsdCny = matches[1].split(',')[2];//for "usd-cny.com/cny/hl/1.js"
                    //matches:1.现汇买入价631.31	2.现钞买入价626.18	3.现汇卖出价633.99	4.现钞卖出价633.99 (美元)
                    fxUsdCny = Math.max(matches[1], matches[2], matches[3], matches[4]) / 100; // 4个价格取最大值
                    if(fxUsdCny) {
                        fxUsdCny = fxUsdCny.toFixed(4);
                        $('input#t3-fx-usd-price').val(fxUsdCny); // 更新到输入框
                        fxDatetime = new Date().getFullYear() + '-' + matches[5];// 汇率的日期时间
                        $('#t3-fx-date, #t3-fx-link').attr('title', fxDatetime); // 同时更新两个element
                    }
                }
            }
        }
    });
    // 为 console 输出增加日期时间戳
    //e.g. "2021-09-30 09:20:21.395[LOG] App starting..."
    let now = function() {
        let date = new Date();
        let y = date.getFullYear().toString();
        let mm = (date.getMonth() + 1).toString();
        let d = date.getDate().toString();
        let h = date.getHours().toString();
        let m = date.getMinutes().toString();
        let s = date.getSeconds().toString();
        let ms = date.getMilliseconds().toString();
        // 返回值: "2021-09-30 09:20:21.395"
        return y + '-' + mm.padStart(2,'0') + '-' + d.padStart(2,'0') + ' ' + h.padStart(2,'0') + ':' + m.padStart(2,'0') +
            ':' + s.padStart(2,'0') + '.' + ms.padStart(3,'0');
    };
    //增强WAX价格标签
    let elWaxUsdt = $('span#wax-price-usdt');
    let spanWaxUsdt = $(elWaxUsdt[0].parentNode);
    spanWaxUsdt.attr('title', '点击打开WAXP_USDT行情');
    spanWaxUsdt.click(function(e) {
        window.open("https://www.gate.ac/cn/trade/WAXP_USDT", 'gate_waxp_usdt');
    });
    // 添加控件
    let div = $('div.price-box');
    //div.append('<div id="t3-row-2"></div>'); div = $('div#t3-row-2');//另起一行
    div.append('<span class="el-tag el-tag--light"><span id="t3-fx-date" style="color:#606266;">$汇率:</span><input type="text" id="t3-fx-usd-price" value="'+fxUsdCny+'" class="info-label" style="width:44px"/></span>');
    div.append('<span class="el-tag el-tag--light"><input id="t3-result-msg" value="" style="width:1px;height:1px" alt="复制"/><span id="t3-label" style="color:#606266;" title="右键复制">三大件估价:</span></span>');
    div.append('<span class="el-tag el-tag--light"><span id="t3-result" title="点击更新,右键复制">¥0000</span></span>');
    div.append('<span class="el-tag el-tag--light"><input id="t3-tool-msg" value="" style="width:1px;height:1px" alt="复制"/><a id="t3-fx-link" href="https://www.usd-cny.com/" target="_blank" class="header-link">外汇牌价</a></span>');
    // 添加事件响应

    const updatePrices = function(event){ // 计算更新三大件和各装备的RMB价格
        if(event) {
            var t = event.target;
            /*
            if(t.id == 't3-result'){
                if(event.type != 'click') return;//忽略在计算结果标签上的非点击事件
                console.debug(t.localName + (t.id ? '#' + t.id : (t.className ? '.'+ t.className : '')), 'clicked')
            } else
                console.debug(t.localName + (t.id ? '#' + t.id : (t.className ? '.'+ t.className : '')), t.innerText)
            */
            //console.debug(now() + '[DEBUG] ' + t.localName + (t.id ? '#' + t.id : (t.className ? '.'+ t.className : '')), t.innerText)
        }

        let waxUsdt = elWaxUsdt.text(); //wax兑usdt汇率
        if(!(waxUsdt && waxUsdt > 0)) {
            //console.debug('Wax对USDT汇率不正确,请等待数据加载完成!');
            return false;
        }
        let usdCny = $('input#t3-fx-usd-price').val();
        if(!(usdCny && usdCny > 0)) {
            //console.debug('美元兑人民币汇率不正确,请填写完整!');
            //$('input#t3-fx-usd-price').focus();
            return false;
        }
        /*************1.三大件的合成价***********/
        // 取得所有包含"合成价"的div
        let divs = $('.el-card__body .nft-col.el-col div:contains("合成价")');
        let t1 = divs[0].childNodes[1].data;//大件1:渔船(肉系)
        let t2 = divs[3].childNodes[1].data;//大件2:电锯(木系)
        let t3 = divs[8].childNodes[1].data;//大件3:矿机(金系)
        if(!(t1 && t2 && t3)) {
            //console.debug('三大件的合成价不正确,请等待数据加载完成!');
            return false;
        }
        if(isUpdating) return false;
        isUpdating = true; // 正在更新的标志, 防止重入

        waxUsdt = parseFloat(waxUsdt); usdCny = parseFloat(usdCny);
        let waxCny = waxUsdt * usdCny;
        let wax = parseFloat(t1) + parseFloat(t2) + parseFloat(t3);
        let rmb = wax * waxCny, usd = wax * waxUsdt;
        let t3price = '￦'+wax.toFixed(0) + '/$' + usd.toFixed(1) + '/¥' + rmb.toFixed(0) + '元';
        $('#t3-result').text(t3price);
        let fwf = $('.price-box a[href*=fwf-farmerstoken]').text();
        let fww = $('.price-box a[href*=fww-farmerstoken]').text();
        let fwg = $('.price-box a[href*=fwg-farmerstoken]').text();
        let msg = '1￦='+waxUsdt+'$,FWF:'+fwf+',FWW:'+fww+',FWG:'+fwg+',$汇率:'+usdCny.toFixed(4)+',三大件估价:'+t3price;
        //console.debug(msg);
        $('input#t3-result-msg').val(msg);
        /*************2.每个装备的各种价格/价值***********/
        divs = $('.el-row .el-col div:contains("￦"), .el-row .el-col span:contains("￦")');
        for(let i=0; i < divs.length;i++) {
            let node = divs[i].lastChild;
            let matches = node.data?.match(/([\d\.]+)￦/);
            if(!matches) continue;
            let wax = parseFloat(matches[1]);
            if(wax > 0) {
                let rmb = wax * waxCny;
                node.data = matches[0] + '/' + rmb.toFixed(1) +'¥';
            }
        }
        isUpdating = false;
    };
    $('#t3-result').click(updatePrices);
    // 右键复制行情价格信息
    const copyQuote = function(e) {
        if(!($('#t3-result-msg').val())) {
            alert('尚未获得行情或价格! 请稍候再试');
            return false;
        }
        if(confirm('复制完整的行情和价格信息?')) {
            let input = $('input#t3-result-msg');//专用于执行复制操作的input框
            //let text = input.val(); // 这样无法取得!
            input.select(); // 选择文本
            document.execCommand("Copy"); // 执行浏览器复制命令
            //alert('行情价格信息复制成功!');
        }
        return false;//阻止浏览器的右键菜单
    };
    const ToolNames = {fishingboat:"渔船", fishingnet:"渔网", fishingrod:"鱼竿",
                       chainsaw:"电锯",saw:"手锯",axe:"铁斧", stoneaxe:"石斧",ancientstonaxe:"原始石斧",
                       miningexcavator:"挖矿机"};
    const copyToolInfo = function(e) {
        let target = e.target;
        //回溯到 el-card 顶层 el-row
        let row = target.parentNode?.parentNode?.parentNode;
        if(!row) return;
        let html = row.firstChild?.innerHTML;//第一个子节点是图片框, 图片地址<img src="https://static.umaske.com/fw/fishingboat.png" />
        if(!html) return;
        let found = html.match(/\/fw\/(\w+)\.png/i);
        if(!found) return;
        let toolName = ToolNames[found[1]];
        if(!toolName) return;
        if(confirm('复制['+toolName + ']的行情和价格信息?')) {
            let txt = toolName + ':';
            let t1 = $(row).find('span.info-label:contains("每日收益")')?.parent();
            t1 = t1?.text();
            txt += t1 + ',';
            let t2 = $(row).find('span.info-label:contains("回本周期")')?.parent();
            t2 = t2?.text();
            txt += t2 + ',';
            let t3 = $(row).find('span.info-label:contains("合成价")')?.parent();
            t3 = t3?.text();
            txt += t3;

            let input = $('input#t3-tool-msg');//专用于执行复制操作的input框
            input.val(txt); // 写入文本
            input.select(); // 选择文本
            document.execCommand("Copy"); // 执行浏览器复制命令
            //alert('['+toolName+']行情价格信息复制成功!');
            return false;//阻止弹出右键菜单
        }
        return false;
    }
    $('#t3-label').contextmenu(copyQuote);
    $('#t3-result').contextmenu(copyQuote);
    let spans = $('.info-label:contains("合成价"), .info-label:contains("每日收益"), .info-label:contains("回本周期")');//只监听这三个标签
    spans.contextmenu(copyToolInfo);
    //监听几个标签的内容数据更新
    $('div.price-box span#wax-price-usdt, div.price-box span a').bind('DOMCharacterDataModified', updatePrices); // 顶部条
    $('.el-card__header .card-title .el-link--inner').bind('DOMCharacterDataModified', updatePrices); // 三大件卡片的header    
})();