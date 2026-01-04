// ==UserScript==
// @name         feedback_order
// @namespace    https://uu.163.com/
// @version      1.0.3
// @description  反馈后台修改跟进QA!
// @author       ming
// @match        https://feedback.uu.x.netease.com/transfer/list*
// @match        https://feedback.uu.netease.com/transfer/list*
// @icon         https://uu-test-cdn.s3.netease.com/images_bed/order.png
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      Apache License 2.0
// @connect      qa.devouter.uu.163.com
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/464360/feedback_order.user.js
// @updateURL https://update.greasyfork.org/scripts/464360/feedback_order.meta.js
// ==/UserScript==
(function () {
    function feedback_order() {
        // 找到一个a标签，name是 change_qa，然后在这个标签后面添加一个button
        console.log("feedback_order")
        $("div.panel.panel-default").each(function () {
            var $this = $(this);
            var $a = $(this).find("a[name='change_qa']").after("<button name='order' type='button' class='btn btn-xs btn-primary'>转单远程QA</button>");
        });

        let orderButtons = document.getElementsByName('order');
        for (let i = 0; i < orderButtons.length; i++) {
            orderButtons[i].onclick = function () {
                var node = $(this).parent().children('a');
                var logUrl = "";
                for (var j in node) {
                    if (node[j].innerText === "[log]") {
                        logUrl = node[j].href;
                    }
                }
                let feedback_id = ''
                if (logUrl !== "") {
                    feedback_id = logUrl.split("feedback_id=")[1].split("&")[0];
                }
                if (feedback_id !== '') {
                    GM_xmlhttpRequest({
                        url: "https://qa.devouter.uu.163.com/apis/feedback_order",
                        method: "POST",
                        data: JSON.stringify({
                            "feedback_id": feedback_id
                        }),
                        responseType: "json",
                        dataType: "jsonp",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        onload: function (res) {
                            // 获取返回数据的code
                            console.log('success')
                            let responseText = res.responseText;
                            let parse = JSON.parse(responseText);
                            // console.log(parse.code);
                            if (parse.code === 200) {
                                let user_name = parse.user_name;
                                alert("转单成功，反馈单已分配给" + user_name);
                            }else{
                                alert("转单失败");
                            }
                        },
                        onerror: function (err) {
                            alert("转单失败");
                        }
                    });

                } else {
                    alert("无法获取feedback_id，尝试指定QA手动转单");
                }
            }
        }
    }
    setTimeout(feedback_order, 1000);
})();