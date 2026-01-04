// ==UserScript==
// @name         StateTransition
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  StateTransition!
// @author       JeJeBryant
// @match        https://gdmg.etczs.net/afterSale/cancelService/cancelServiceLis*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540950/StateTransition.user.js
// @updateURL https://update.greasyfork.org/scripts/540950/StateTransition.meta.js
// ==/UserScript==


var script = document.createElement("script");
script.type = "text/javascript";
script.appendChild(document.createTextNode("function executeStateTransition(obj) {var status =  prompt(\"status\");if(status !== null && confirm(\"确定要执行吗？\") == true) {var sn = $(obj).attr('ordersn'); var sign = $(obj).attr('sign');  $.ajax({type:\"post\",url: \"https://api-pre.etczs.net/no-login/state-transition\",dataType: \"json\",async: false,data: {\"sign\":sign,\"order_sn\":sn,\"status\":status},complete: function () {},success: function (response) {if (response.code != 0) { alert(response.msg)} else {console.log(response)}},error: function (XMLHttpRequest, textStatus, errorThrown) {alert(errorThrown);}});}}"));
script.appendChild(document.createTextNode("const target = document.querySelector('body');const config = { childList: true, subtree: true };const callback = function(mutationsList, observer) {clearInterval(timer); var timer = setTimeout(function() {var button = $(\".ant-legacy-form-item-children\");$.each($(button), function(i, n){if (i == 9) {$(n).on(\"click\", function() {var tbody = $('.ant-table-tbody');console.dir(tbody);var tr = $(tbody).find('tr');console.dir(tr);$.each(tr, function(index, td){$(td).find('.ant-table-cell-fix-right').find('.execute').remove();var sn = $(td.children[4]).text();if (sn != '' && sn != undefined && sn.indexOf('ZX') != -1) {console.log(\"sn\" + sn);var sign = '123321';$(td).find('.ant-table-cell-fix-right').append('<a class=\"execute ant-btn ant-btn-default\" style=\"margin-bottom: 5px;\" href=\"#\" ordersn=' + sn + ' sign = ' + sign + ' onclick=\"return executeStateTransition(this)\">'+sn+'</a>');}});});}});}, 1000)};const observer = new MutationObserver(callback);observer.observe(target, config);"));

document.body.appendChild(script);

