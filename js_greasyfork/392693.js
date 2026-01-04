// ==UserScript==
// @name         新商盟Mobile
// @namespace    https://gd.xinshangmeng.com/eciop/orderForCC/cgtListForCC.htm
// @version      1.5
// @description  新商盟自动加载库存
// @author       MHyun
// @match        http://www.xinshangmeng.com/*
// @match        https://www.xinshangmeng.com/*
// @match        https://gd.xinshangmeng.com/eciop/orderForCC/cgtListForCC.htm?*
// @match        http://gd.xinshangmeng.com/eciop/orderForCC/cgtListForCC.htm?*
// @match        http://gd.xinshangmeng.com:9090/eciop/orderForCC/cgtOtherListForCC.htm?*
// @match        https://gd.xinshangmeng.com:9090/eciop/orderForCC/cgtOtherListForCC.htm?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392693/%E6%96%B0%E5%95%86%E7%9B%9FMobile.user.js
// @updateURL https://update.greasyfork.org/scripts/392693/%E6%96%B0%E5%95%86%E7%9B%9FMobile.meta.js
// ==/UserScript==

(function() {

    var cgtListForCC = "cgtListForCC.htm";
    var cgtOtherListForCC = "cgtOtherListForCC.htm";
    var xinshangmeng = "www.xinshangmeng.com";
    var currentUrl = window.location.href;
    //添加自适应
    var head = document.querySelector('head').innerHTML;
    document.querySelector('head').innerHTML = head + '<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />';
    if(currentUrl.indexOf(cgtListForCC) != -1 || currentUrl.indexOf(cgtOtherListForCC) != -1){
        //隐藏无用列
        document.getElementById('spbm-btn').style.display = 'none';
        document.getElementById('zdj-btn').style.display = 'none';
        document.getElementById('ord-btn').style.display = 'none';
        document.getElementById('umsale-btn').style.display = 'none';
        document.getElementById('btndiv').style.width = '100%';
        var col = document.getElementsByClassName('cgt-col-short-code');
        for(var i = 0; i<col.length; i++){
            col[i].style.display = 'none'
        }
        var icon = document.getElementsByClassName('cgt-icon');
        for(var j = 0; j<icon.length; j++){
            icon[j].style.display = 'none'
        }
        var icon2 = document.getElementsByClassName('cgt-icon2');
        for(var k = 0; k<icon2.length; k++){
            icon2[k].style.display = 'none'
        }
        document.getElementById('num-btn1').style.width = '10%'
        document.getElementById('kyl-btn').style.width = '15%'
        document.getElementById('kyl-btn').style.fontSize='0.5em';
        document.getElementById('num-btn1').style.fontSize='0.5em';
        document.getElementById('spmc-btn').style.fontSize='0.5em';
        document.getElementById('spmc-btn').style.width='18%';
        document.getElementById('pfj-btn').style.width='20%';
        document.getElementById('pfj-btn').style.fontSize='0.5em';
        document.getElementById('req-btn').style.fontSize='0.5em';
        document.getElementById('req-btn').style.width='30%';

        document.querySelector('#btndiv > div:nth-child(1)').style.fontSize = '0.5em';
        var ids = document.getElementsByClassName('cgt-col-row-num');
        for(var id = 0; id<ids.length; id++){
            ids[id].style.width = '10%';
        }
        var idrows = document.getElementsByClassName('cgt-row-num');
        for(var idrow = 0; idrow<idrows.length; idrow++){
            idrows[idrow].style.marginLeft='40%';
            idrows[idrow].style.fontSize='0.5em';
        }
        var lazys = document.getElementsByClassName('lazy');
        for(var lazy = 0; lazy<lazys.length; lazy++){
            lazys[lazy].style.display = 'none';
        }
        var names = document.getElementsByClassName('cgt-name');
        for(var name = 0; name<names.length; name++){
            names[name].style.width='100%';
        }
        var nameboxs = document.getElementsByClassName('cgt-col-img-name');
        for(var namebox = 0; namebox<nameboxs.length; namebox++){
            nameboxs[namebox].style.width = '25%'
        }
        var guides = document.getElementsByClassName('cgt-col-guide-price');
        for(var guide = 0; guide<guides.length; guide++){
            guides[guide].style.display = 'none';
        }
        var prices = document.getElementsByClassName('cgt-col-price');
        for(var price = 0; price<prices.length; price++){
            prices[price].style.textAlign = 'auto';
            prices[price].style.width = '15%'
        }
        var colords = document.getElementsByClassName('cgt-col-ord');
        for(var cgtcol = 0; cgtcol<colords.length; cgtcol++){
            colords[cgtcol].style.display = 'none';
        }
        var qtlmts = document.getElementsByClassName('cgt-col-qtl-lmt');
        for(var qtlmt = 0; qtlmt<qtlmts.length; qtlmt++){
            qtlmts[qtlmt].style.width = '15%';
            qtlmts[qtlmt].style.marginLeft = '2%';
            qtlmts[qtlmt].style.marginRight = '2%';
        }
        var sales = document.getElementsByClassName('cgt-col-um-sale-name');
        for(var sale = 0; sale<sales.length; sale++){
            sales[sale].style.display = 'none';
        }
        var iconfs = document.getElementsByClassName('iconfont');
        for(var iconf = 0; iconf<iconfs.length; iconf++){
            iconfs[iconf].style.display = 'none';
        }
        var reqtys = document.getElementsByClassName('cgt-col-req-qty');
        for(var reqty = 0; reqty<reqtys.length; reqty++){
            reqtys[reqty].style.width = 'none';
        }



        //消除公告
        //document.querySelector('#wrap > div.iop-header > div > a').remove();
        document.querySelector('#qd-header-bottom').style.display = 'none'
        document.getElementById('content').style.width = '100%';
        document.getElementById('menu').style.width = '100%';
        document.getElementById('searchDiv').style.display = 'none';
        document.getElementById('rightContent').style.display = 'none';
        document.querySelector('#cgt > div.orderinfo > div.timeinfo > span > strong.list-slsInfo').style.display = 'none';
        document.querySelector('#cgt > div.orderinfo > div.timeinfo > label:nth-child(2)').style.display = 'none'
        document.querySelector('#cgt > div.orderinfo > div.timeinfo > label:nth-child(3)').style.display = 'none'
        document.querySelector('#wrap > div.iop-contenter').style.display = 'none';
        document.querySelector('#wrap > div.iop-header').style.display = 'none';
        document.querySelector('#btndiv > div:nth-child(1)').style.height = 'auto';
        document.getElementById('menu').id = 'new_menu';
        console.log(document.querySelector('#wrap'));
        function fireKeyEvent(el, evtType, keyCode){
            var doc = el.ownerDocument,
                win = doc.defaultView || doc.parentWindow,
                evtObj;
            if(doc.createEvent){
                if(win.KeyEvent) {
                    evtObj = doc.createEvent('KeyEvents');
                    evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
                }
                else {
                    evtObj = doc.createEvent('UIEvents');
                    Object.defineProperty(evtObj, 'keyCode', {
                        get : function() { return this.keyCodeVal; }
                    });
                    Object.defineProperty(evtObj, 'which', {
                        get : function() { return this.keyCodeVal; }
                    });
                    evtObj.initUIEvent( evtType, true, true, win, 1 );
                    evtObj.keyCodeVal = keyCode;
                    if (evtObj.keyCode !== keyCode) {
                        console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
                    }
                }
                el.dispatchEvent(evtObj);
            }
            else if(doc.createEventObject){
                evtObj = doc.createEventObject();
                evtObj.keyCode = keyCode;
                el.fireEvent('on' + evtType, evtObj);
            }
        }
        var box = document.getElementById('accerror');
        var boxHtml = box.innerHTML;
        box.innerHTML = '<span id="loadStock" class="xsm-pribtn" style="padding:7px;"><span id="tips">查询库存</span></span>' + boxHtml;
        $("#loadStock").bind("click",
                             function() {
            var tips = document.getElementById('tips');
            tips.innerText = '加载中，请稍等…'
            var newul = document.getElementById("newul");
            var li = newul.getElementsByTagName("li");
            var i = 0;
            setNum();
            function setNum() {
                if (i < li.length) {
                    var code = li[i].getAttribute("data-cgt-code");
                    var title = li[i].getAttribute("title");
                    var host = window.location.host;
                    var url = document.location.protocol + "//" + host + "/eciop/order/cgtCo.do?";
                    url = url + "method=getBusiCgtLmt";
                    var orgCode = document.getElementById("orgCode").value;
                    url = url + "&orgCode=" + orgCode;
                    var custCode = document.getElementById("custCode").value;
                    url = url + "&custCode=" + custCode;
                    url = url + "&cgtCode=" + code;
                    url = url + "&orderId=" + "";
                    var orderDate = document.getElementById("orderDate").value;
                    url = url + "&orderDate=" + orderDate;
                    url = url + "&zone=" + orgCode;
                    var d = new Date().getTime();
                    url = url + "&v=" + d;
                    url = url + "&_view=async";
                    $.get(url,
                          function(result) {
                        var data = eval(result);
                        var num = data[0].CGT_CARTON_CODE;
                        var lmt = data[0].QTY_LMT;
                        document.getElementById("qty_lmt_" + num).innerText = lmt;
                        document.getElementById("req_qty_" + num).value = lmt;
                        tips.innerText = "正在查找" + title + "请稍后…";
                        i++;
                        if (i < li.length) {
                            var el = document.getElementById("req_qty_" + num);
                            var evtType = "keydown";
                            var keyCode = 13;
                            fireKeyEvent(el, evtType, keyCode);
                            setNum();
                        } else {
                            var count = parseInt(document.getElementById('list-co-lmt-remain').innerText);
                            if(count>0) {
                                alert('网络异常，本次查询可能不完成，建议重新查询或查看本次剩余量是否正常');
                                tips.innerText = '重新查询';
                            }
                            tips.innerText = '查询完毕';
                            document.getElementById('back-to-top').click();
                            document.getElementById('kyl-btn').click();
                            document.getElementById('kyl-btn').click();
                        }
                    }).fail(function () {
                        document.getElementById('back-to-top').click();
                        tips.innerText = '加载' + title + '失败，请点击重试';
                        alert('加载' + title + '失败，请点击重试');
                    });
                }
            };
        });
    } else if(currentUrl.indexOf(xinshangmeng) != -1){
    document.querySelector('body > div.header').style.width = "100%";
    document.querySelector('body > div.content').style.width = "100%";
    document.querySelector('body > div.content').style.background = "#FFFFFF";
    document.querySelector('body > div.content-shadow').style.width = "100%";
    document.querySelector('body > div.footer').style.width = "100%";
    document.getElementById('login-form').style.background = "#FFFFFF";
    document.getElementById('login-form').style.paddingBottom= "35px";
    document.getElementById('login-form').style.width= "70%";
    document.getElementById('login-form').style.marginLeft= "15%";
    document.getElementById('login-form').style.top= "auto";
    document.getElementById('login-form').style.right= "auto";
    document.getElementById('login-form').style.left= "auto";
}
})();