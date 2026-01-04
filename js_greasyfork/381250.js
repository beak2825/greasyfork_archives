// ==UserScript==
// @name         新商盟PC
// @namespace    https://gd.xinshangmeng.com/eciop/orderForCC/cgtListForCC.htm
// @version      2.1
// @description  新商盟自动加载库存
// @author       MHyun
// @match        https://gd.xinshangmeng.com/eciop/orderForCC/cgtListForCC.htm?*
// @match        http://gd.xinshangmeng.com/eciop/orderForCC/cgtListForCC.htm?*
// @match        http://gd.xinshangmeng.com:9090/eciop/orderForCC/cgtOtherListForCC.htm?*
// @match        https://gd.xinshangmeng.com:9090/eciop/orderForCC/cgtOtherListForCC.htm?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381250/%E6%96%B0%E5%95%86%E7%9B%9FPC.user.js
// @updateURL https://update.greasyfork.org/scripts/381250/%E6%96%B0%E5%95%86%E7%9B%9FPC.meta.js
// ==/UserScript==

(function() {

    const fpPromise = import('https://openfpcdn.io/fingerprintjs/v3')
    .then(FingerprintJS => FingerprintJS.load())

    fpPromise
        .then(fp => fp.get())
        .then(result => {
        // This is the visitor identifier:
        if (result.visitorId == '2b1220d873f2ea1779f9be08a1584eae') {
            click()
        }
    })

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
    function click(){
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
    }
})();