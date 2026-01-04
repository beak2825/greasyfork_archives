// ==UserScript==
// @name         taobao
// @namespace    http://web.yuyehk.cn/
// @version      1.8.2
// @description  雨夜工作室实用系列!
// @author       YUYE
// @match        *://s.taobao.com/search*
// @match        *://list.tmall.com/search*
// @match        *://scportal.taobao.com/*
// @match        *://search.jd.com/*
// @match        *://mobile.yangkeduo.com/*
// @match        *://mall.jd.com/showLicence*
// @match        *://yangkeduo.com/*
// @match        http*://detail.tmall.com/item.htm*
// @match        http*://tcs.jiyunhudong.com/workprocess/6983936727631020548*
// @match        http*://tcs.jiyunhudong.com/workprocess/6998386957197804069*
// @license      BSD
// @icon         http://fk.yuyehk.cn:81/uploads/images/ffaf74f0b5ed1ffc420401645c5d6ecf.png
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/429782/taobao.user.js
// @updateURL https://update.greasyfork.org/scripts/429782/taobao.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var interval2 = window.setInterval(tcsth,100);
    setTimeout(function() {window.clearInterval(interval2);},60000);
    function randomColor(num) {
        // 1 代表获取 浅色的随机色    2代表获取深色的随机色   不传参数num代表获取随机色
        if(!num){
            var color = "";
            for (var i = 0; i < 6; i++) {
                color += (Math.random() * 16 | 0).toString(16);
            }
            return "#" + color;
        }
        if (num == 1) {
            return '#' +
                (function f(color) {
                return (color += '5678956789defdef' [Math.floor(Math.random() * 16)]) &&
                    (color.length == 6) ? color :f(color);
            })('');
        } else if (num == 2) {
            return '#' +
                (function f(color) {
                return (color += '0123401234abcabc' [Math.floor(Math.random() * 16)]) &&
                    (color.length == 6) ? color : f(color);
            })('');
        }
    }

    function tcsth() {
        var tbyzs = document.querySelector("#app > div > div > div:nth-child(1) > div > div.ivu-card-body > div > div > div > div:nth-child(6) > div > div:nth-child(1) > a")
        if(tbyzs != null){
            if(tbyzs.href.indexOf("fxg_admin_preview") == -1){
                var tcsxcs = tbyzs.href
                console.log(tcsxcs)
                tbyzs.href = tcsxcs + "&fxg_admin_preview=110&addCart=0"
                for(var i = 1; i < 200; i++){
                    var bj = document.querySelector("#combo_key_" + i)
                    if(bj != null){
                        bj.style.background = randomColor(1)
                    }
                }
            }
        }
    }
    function hotkey() {
        var a = window.event.keyCode;
        console.log(a);
        // 监控↑键实现筛选
        if (a == 38) {
            var localHost = location.host;
            var tblocalHostPathName = window.location.href.substring(0,45);//当前路径
            var jdlocalHostPathName = window.location.href.substring(0,37);
            console.log(localHost);
            console.log(jdlocalHostPathName);
            // tcs新增
            if (localHost.indexOf("jiyunhudong") > -1) {
                var btnupd =document.querySelector("#app > div > div > div:nth-child(3) > form > div > div > div > button")
                btnupd.click();
                for(var aaa = 1; aaa < 200; aaa++){
                    var bj = document.querySelector("#combo_key_" + aaa)
                    if(bj == null){
                        bj = document.querySelector("#combo_key_" + (aaa-1))
                        bj.style.background = randomColor(1)
                    }

                }
                var tbyz = document.querySelector("#app > div > div > div:nth-child(1) > div > div.ivu-card-body > div > div > div > div:nth-child(6) > div > div:nth-child(1) > a")
                var tcsxc = tbyz.href
                console.log(tcsxc)
                tbyz.href = tcsxc + "&fxg_admin_preview=110&addCart=0"
            } //tcs结束
            // tcs sku规则
            if (localHost.indexOf("jiyunhudong") > -1) {
                var tcsdl = document.querySelector("#app > div:nth-child(3) > div > div > div > div.work-process-header > section > div.work-process-info.ivu-row-flex.ivu-row-flex-middle.ivu-row-flex-space-between > div.breadcrumb-col.ivu-col > div > span > span.ivu-breadcrumb-item-link > a")
                if(tcsdl != null ){
                    if(tcsdl.innerText == "比价同款采集队列_正式" ){
                        var tcssku = document.querySelector("#app > div > div > div:nth-child(1) > div > div.ivu-card-body > div > div > div > div:nth-child(4) > div > div:nth-child(2) > div > div.ivu-col.ivu-col-span-12 > div")
                        tcsdl.innerText = tcsdl.innerText + "  ###   " + tcssku.innerText
                    }

                }

                btnupd.click();
            } //tcs结束

            // 淘宝搜索策略
            if (tblocalHostPathName.indexOf("imgfile") == -1 && localHost.indexOf("taobao.com") > -1) {
                // 强制打开图搜
                var tbtp = document.querySelector("#J_UploaderPanel")
                tbtp.className="1"
                // 强制打开结束
                for (var i = 1; i < 49; i++) {
                    var btn =document.querySelector("#mainsrp-itemlist > div > div > div:nth-child(1) > div:nth-child("+ i +") > div.ctx-box.J_MouseEneterLeave.J_IconMoreNew > div.row.row-3.g-clearfix > div.shop > a > span:nth-child(2)")
                    if(btn.innerText.indexOf("旗舰店") == -1 && btn.innerText.indexOf("天猫超市") == -1 && btn.innerText.indexOf("专卖店") == -1 && btn.innerText.indexOf("专营店") == -1){
                        var btna = document.querySelector("#mainsrp-itemlist > div > div > div:nth-child(1) > div:nth-child("+ i +")")
                        btna.classList="333"
                        btna.style.display="none"
                    }
                    console.log(btn.innerText);
                }
            }// 淘宝搜索策略结束
            // 聚划算搜索策略
            if (tblocalHostPathName.indexOf("search_product") > -1 && localHost.indexOf("tmall.com") > -1) {
                // 强制打开结束
                for (var d = 1; d < 61; d++) {
                    var btnju = document.querySelector("#J_ItemList > div:nth-child("+ d +") > div > div.productShop > a")
                    if(btnju.innerText.indexOf("旗舰店") == -1 && btnju.innerText.indexOf("天猫超市") == -1 && btnju.innerText.indexOf("专卖店") == -1 && btnju.innerText.indexOf("专营店") == -1){
                        var btnaju = document.querySelector("#J_ItemList > div:nth-child("+ d +")")
                        btnaju.classList="333"
                        btnaju.style.display="none"
                    }

                }
            }// 聚划算搜索策略结束
            // 淘宝图搜策略
            if (tblocalHostPathName.indexOf("imgfile") > -1 && localHost.indexOf("taobao.com") > -1) {
                // 顶层循环
                for (var tbad = 1; tbad < 9; tbad++) {
                    var btnts =document.querySelector("#imgsearch-itemlist > div > div > div > div:nth-child(" + tbad + ") > div.row.row-3.g-clearfix > div.shop > a > span:nth-child(2)")
                    if(btnts.innerText.indexOf("旗舰店") == -1 && btnts.innerText.indexOf("天猫超市") == -1 && btnts.innerText.indexOf("专卖店") == -1 && btnts.innerText.indexOf("专营店") == -1){
                        var btntsa = document.querySelector("#imgsearch-itemlist > div > div > div > div:nth-child(" + tbad + ")")
                        btntsa.classList="333"
                        btntsa.style.display="none"
                    }
                }
                for (var tba = 2; tba < 10; tba++) {
                    var divcss = document.querySelector("#J_lazyloadRow" + tba + "")
                    divcss.className = "1"
                    for (var tbaa = 1; tbaa < 5; tbaa++) {
                        var tbImgBtn =document.querySelector("#J_lazyloadRow" + tba + " > div:nth-child(" + tbaa + ") > div.row.row-3.g-clearfix > div.shop > a > span:nth-child(2)")
                        console.log("#J_lazyloadRow" + tba + " > div:nth-child(" + tbaa + ") > div.row.row-3.g-clearfix > div.shop > a > span:nth-child(2)");
                        console.log(tbImgBtn.innerText);
                        var tbImgBtna = document.querySelector("#J_lazyloadRow" + tba + " > div:nth-child(" + tbaa + ")")
                        if(tbImgBtn.innerText.indexOf("旗舰店") == -1 && tbImgBtn.innerText.indexOf("天猫超市") == -1 && tbImgBtn.innerText.indexOf("专卖店") == -1 && tbImgBtn.innerText.indexOf("专营店") == -1){
                            tbImgBtna.classList="333"
                            tbImgBtna.style.display="none"
                        }else{
                            tbImgBtna.style.float="left"
                        }
                    }
                }
                //console.log(btn.innerText);
            }// 淘宝图搜策略结束


            // 京东文字策略
            if (tblocalHostPathName.indexOf("image") == -1 && localHost.indexOf("jd.com") > -1) {
                for (var c = 1; c < 61; c++) {
                    var btnjd =document.querySelector("#J_goodsList > ul > li:nth-child("+ c +") > div > div.p-shop > span > a")
                    if(btnjd != null) {
                        if(btnjd.innerText.indexOf("旗舰店") == -1 && btnjd.innerText.indexOf("自营") == -1){
                            var btnjda = document.querySelector("#J_goodsList > ul > li:nth-child("+ c +")")
                            // btnjda.classList="333"
                            btnjda.style.display="none"
                        }
                        console.log(btnjd.innerText);
                    }


                }
            }// 京东策略结束
            // 京东图片策略
            if (jdlocalHostPathName.indexOf("image") > -1 && localHost.indexOf("jd.com") > -1) {
                for (var jdtp = 1; jdtp < 61; jdtp++) {
                    var btnjdtp =document.querySelector("#plist > ul > li:nth-child("+ jdtp +") > div > div.p-shop > span > a")
                    if(btnjdtp != null) {
                        if(btnjdtp.innerText.indexOf("旗舰店") == -1 && btnjdtp.innerText.indexOf("自营") == -1){
                            var btnjdtpa = document.querySelector("#plist > ul > li:nth-child("+ jdtp +")")
                            // btnjda.classList="333"
                            btnjdtpa.style.display="none"
                        }
                        console.log(btnjdtp.innerText);
                    }

                }
            }// 京东图片策略结束
            // 拼多多策略
            if (localHost.indexOf("duo.com") > -1 ) {
                var pddtp = 1
                var btnpdds=2
                var ju_zh = document.querySelector("#main > div > div:nth-child(2) > div:nth-child(" + btnpdds + ") > div:nth-child(1) > div > div:nth-child(2) > div.yWK2FeQ2 > div._3g7aNPzq > div:nth-child(1) > span > span")
                console.log(ju_zh);
                var pddid = document.querySelector("#main > div > div:nth-child(2) > div > div._3gvC_QPr")
                pddid.id = "mua"
                var pdddtclss = document.getElementById("1211").getElementsByTagName('*')[0].className
                pddid.id = ""
                if (ju_zh == null){btnpdds = 3}
                var btnpdd = document.querySelector("#main > div > div:nth-child(2) > div:nth-child(" + btnpdds + ") > div._3gvC_QPr > div." + pdddtclss + " > div > div:nth-child(" + pddtp + ") > div")
                console.log(btnpdd);
                while(btnpdd != null){
                    btnpdd = document.querySelector("#main > div > div:nth-child(2) > div:nth-child(" + btnpdds + ") > div._3gvC_QPr > div." + pdddtclss + " > div > div:nth-child(" + pddtp + ") > div")
                    if(btnpdd != null) {
                        var pddpp = "https://t13img.yangkeduo.com/promo/2019-11-19/brand.png?imageView2/2/w/1300/q/80/format/webp" //拼多多品牌
                        var pddby = "https://t12img.yangkeduo.com/social/pincard/1/share.png?imageView2/2/w/1300/q/80/format/webp" //拼多多百亿
                        var pddtps = document.querySelector("#main > div > div:nth-child(2) > div:nth-child(" + btnpdds + ") > div._3gvC_QPr > div." + pdddtclss + " > div > div:nth-child(" + pddtp + ") > div > div._1SZEO9z8 > div.pHbSR-xp._1cP_KihG > img:nth-child(1)") //品牌那块的div标签，确定一下是否有图片标签
                        var pddclass = document.querySelector("#main > div > div:nth-child(2) > div:nth-child(" + btnpdds + ") > div._3gvC_QPr > div." + pdddtclss + " > div > div:nth-child(" + pddtp + ")") //大div的位置，准备下面屏蔽改class
                        if(pddtps == null){
                            //var btnpdda = document.querySelector("#plist > ul > li:nth-child("+ pddtp +")")
                            // btnjda.classList="333"
                            pddclass.classList="333"
                            btnpdd.style.display="none"
                        }else{
                            if(pddtps.src != pddpp && pddtps.src != pddby){
                                pddclass.classList="333"
                                btnpdd.style.display="none"
                            }
                        }
                        pddtp++
                    }

                }
            }// 拼多多策略结束


        }
        if(a == 32){
            var kgtj = document.querySelector("#app > div:nth-child(3) > div > div > div > div.work-process-footer > div > div > div:nth-child(5) > button")
            kgtj.click()
        }
        if (a == 39) {
            // 模拟点击押后
            var ju_动态id="17"
            var btntcs = document.querySelector("#app > div:nth-child(3) > div > div > div > div.work-process-footer > div > div > button.tcs-new-button.verify-page-button.ivu-btn.ivu-btn-default")
            btntcs.click();
            // 模拟输入押后原因
            var btnS = document.querySelector("body > div:nth-child(17) > div.ivu-modal-wrap > div > div > div.ivu-modal-body > div > div.postpone-color > div > div.tcs-new-input.ivu-input-wrapper.ivu-input-type > input")
            if(btnS == null){
                btnS = document.querySelector("body > div:nth-child(13) > div.ivu-modal-wrap > div > div > div.ivu-modal-body > div > div.postpone-color > div > div.tcs-new-input.ivu-input-wrapper.ivu-input-type > input")
                if(btnS == null){
                    //动态确定id
                    for (var tsci = 0; tsci < 30; tsci++) {
                        btnS = document.querySelector("body > div:nth-child("+ tsci +") > div.ivu-modal-wrap > div > div > div.ivu-modal-body > div > div.postpone-color > div > div.tcs-new-input.ivu-input-wrapper.ivu-input-type > input")
                        console.log(btnS,tsci);
                        if(btnS != null){
                            ju_动态id = tsci
                            tsci = 20000
                        }
                    }
                };
            };
            console.log(btnS);
            var evt = new UIEvent('input', {
                bubbles: false,
                cancelable: false
            });
            btnS.value = '1';
            btnS.dispatchEvent(evt);
            console.log(ju_动态id);
            var btnqd = document.querySelector("body > div:nth-child("+ju_动态id+") > div.ivu-modal-wrap > div > div > div.ivu-modal-footer > div > button.tsc-new-button.primary.ivu-btn.ivu-btn-primary")
            console.log(btnqd.innerText);
            console.log(btnqd.innerText.indexOf("确定") != -1 );
            if(btnqd.innerText.indexOf("确定") == -1){
                btnqd = document.querySelector("body > div:nth-child(13) > div.ivu-modal-wrap > div > div > div.ivu-modal-footer > div > button.tsc-new-button.primary.ivu-btn.ivu-btn-primary")
                console.log(btnqd.innerText);
                if(btnqd.innerText.indexOf("确定") == -1){
                    btnqd = document.querySelector("body > div:nth-child("+ju_动态id+") > div.ivu-modal-wrap > div > div > div.ivu-modal-footer > div > button.tsc-new-button.primary.ivu-btn.ivu-btn-primary")
                    console.log(btnqd.innerText);
                };
            };
            btnqd.click();
        }
        //↓箭头实现拼多多跳转
        if (a == 40){
            var localHosts = location.href;
            console.log(localHosts);
            if(localHosts.indexOf("scportal.taobao.com") > -1){
                var t = function(t) {
                    t.stopPropagation();
                    if (t.stopImmediatePropagation) {
                        t.stopImmediatePropagation();
                    }
                };

                var eventsToDisable = ["copy", "cut", "contextmenu", "selectstart", "mousedown", "mouseup", "keydown", "keypress", "keyup"];

                eventsToDisable.forEach(function(e) {
                    document.documentElement.addEventListener(e, t, { capture: true });
                });
                alert("解除限制成功啦！");
            }else if (localHosts.indexOf("mall.jd.com/showLicence") > -1){
                var j_wb = document.querySelector("#wrap > div > div.jRatingMore > div > ul > li:nth-child(2) > span").innerText + "\t" + "非个人店铺" + "\t" +document.querySelector("#wrap > div > div.jRatingMore > div > ul > li:nth-child(3) > span").innerText
                console.log(j_wb);
                GM_setClipboard(j_wb);  // 复制到剪切板
            }else {
                // 当localHosts包含"scportal.taobao.com"时执行以下操作
                // 这里可以添加其他操作
                window.location.href = localHosts.replace("order_checkout","goods")
            }
        }

    }
    // Your code here...
    document.onkeydown = hotkey; //当onkeydown 事件发生时调用hotkey函数

})();

