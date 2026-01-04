// ==UserScript==
// @name         Notify
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Notify Biz!
// @author       JeJeBryant
// @match        https://admincp.etczs.net/issuer-sale-after-order/index*
// @match        http://server.backend.test/issuer-sale-after-order/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540576/Notify.user.js
// @updateURL https://update.greasyfork.org/scripts/540576/Notify.meta.js
// ==/UserScript==
(function() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.appendChild(document.createTextNode("function executeReviewPass(obj) {if(confirm(\"确定要执行审核通过吗？\") == true) {var sn = $(obj).attr('ordersn'); var sign = $(obj).attr('sign');  $.ajax({type:\"post\",url: \"https://api-pre.etczs.net/no-login/execute-review-pass\",dataType: \"json\",async: false,data: {\"sign\":sign,\"order_sn\":sn},complete: function () {},success: function (response) {if (response.code != 0) { alert(response.msg)} else {console.log(response)}},error: function (XMLHttpRequest, textStatus, errorThrown) {alert(errorThrown);}});}}"));
    script.appendChild(document.createTextNode("function executeFinish(obj) {if(confirm(\"确定要执行完成吗？\") == true) {var sn = $(obj).attr('ordersn'); var sign = $(obj).attr('sign');  $.ajax({type:\"post\",url: \"https://api-pre.etczs.net/no-login/execute-finish\",dataType: \"json\",async: false,data: {\"sign\":sign,\"order_sn\":sn},complete: function () {},success: function (response) {if (response.code != 0) { alert(response.msg)} else {console.log(response)}},error: function (XMLHttpRequest, textStatus, errorThrown) {alert(errorThrown);}});}}"));
    document.body.appendChild(script);
    var tbody = $('.content').find('#w1-container').find('tbody')[0];
    var tr = $(tbody).find('tr');
    $.each(tr, function(i, n){
        var eleSn = $(n).find("td[data-col-seq='1']")[0];
        var sn = $(eleSn).html();
        var eleType = $(n).find("td[data-col-seq='4']")[0];
        var type = $(eleType).html();
        var sign = '';
        if(true) {
            $(n).find('.multi-line').append('<hr style="style="border-top: 2px dashed #ccc;margin: 20px 0;">');
            $(n).find('.multi-line').append('<a class="btn btn-danger" href="#" ordersn=' + sn + ' sign = ' + sign + ' onclick="return executeReviewPass(this)">执行审核</a>');
            $(n).find('.multi-line').append('<a class="btn btn-danger" href="#" ordersn=' + sn + ' sign = ' + sign + ' onclick="return executeFinish(this)">执行完成</a>');
        }
    });
})();