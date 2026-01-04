// ==UserScript==
// @name         大麦抢票-确认
// @namespace    https://www.jwang0614.top/scripts
// @version      0.9.0
// @description  辅助购买大麦网演唱会门票
// @author       Olivia Wang
// @match        https://buy.damai.cn/orderConfirm*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/383155/%E5%A4%A7%E9%BA%A6%E6%8A%A2%E7%A5%A8-%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/383155/%E5%A4%A7%E9%BA%A6%E6%8A%A2%E7%A5%A8-%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==


var test_url = "https://buy.damai.cn/orderConfirm?exParams=%7B%22damai%22%3A%221%22%2C%22channel%22%3A%22damai_app%22%2C%22umpChannel%22%3A%2210002%22%2C%22atomSplit%22%3A%221%22%2C%22serviceVersion%22%3A%221.8.5%22%7D&buyParam=600583263497_1_4192587404863&buyNow=true&spm=a2oeg.project.projectinfo.dbuy"
var timer = null;
var current_url = null;


var max_time = 5000;
var current_time = 500;

$(document).ready(function(){
    window.current_url = window.location.href;
    if($(".error-msg").length > 0) {
        window.location.reload();
        // console.log("error");
    } else {
        setTimeout(fill_form, 300);

    }

});



function fill_form() {
    var input = document.querySelector(".delivery-email-form input");
    var email = "";

    if (input) {

        input.value=email;

    }

    var buyer_number = parseInt($(".ticket-buyer-title em").text());
    console.log(buyer_number);
    var buyer_list = $(".buyer-list-item input");
    for(var i=0; i < buyer_number; i++) {
        console.log(buyer_list[i]);
        buyer_list[i].click();
    }

    $(".submit-wrapper button").click();
    setTimeout(check_alert, 500);

}


function check_alert() {
    var alerts = $(".next-dialog-alert");
    if(alerts.length > 0 || window.current_time >= window.max_time) {
        window.location.reload();
    } else {
        window.current_time = window.current_time + 500;
        setTimeout(check_alert, 500);
    }
}