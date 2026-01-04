// ==UserScript==
// @name         竞品数据监控
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  竞品数据监控——问卷数和答卷数
// @author       问卷星WJX
// @match        https://www.wenjuan.com/
// @match        https://wj.qq.com/
// @icon         https://icons.duckduckgo.com/ip2/tampermonkey.net.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436388/%E7%AB%9E%E5%93%81%E6%95%B0%E6%8D%AE%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/436388/%E7%AB%9E%E5%93%81%E6%95%B0%E6%8D%AE%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    var zdyScript1 = document.createElement('script');
        zdyScript1.setAttribute('src', '//cdn.staticfile.org/jquery/1.10.2/jquery.min.js');
        document.body.appendChild(zdyScript1);
        zdyScript1.onload = function () {
            $(function () {
                var nowDate = new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " ");

                if (window.location.href.indexOf("wj.qq.com") > -1) {//腾讯问卷
                    var usercount = $(".fnt-tct").eq(1).html();
                    var quescount = $(".fnt-tct").eq(2).html();
                    $.get("https://wj.qq.com/api/user_count", function (res) {
                        var count = res.data.user_count;
                        var newhtml = $(".stat").html() + "<span style='color:red'>（答卷数：" + count + "）";
                        $(".stat").html(newhtml);
                        var content = "监控对象：腾讯问卷\n时间：" + nowDate + "\n显示用户数：" + usercount + "\n显示答卷数：" + quescount + "\n实际答卷数：" + count;
                        console.log(content);
                        var aurl = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7469dcd2-21b7-4ee8-a674-3b77a11579c7";
                        var adata = JSON.stringify({
                            "msgtype": "text",
                            "text": {
                                "content": content
                            }
                        });
                        $.post("https://wjxyl.natapp4.cc/afile/relaydata.ashx",
                            {
                                "url": aurl,
                                "data": adata
                            },
                            function (result) {

                            }
                        );
                    })
                }
                if (window.location.href.indexOf("wenjuan.com") > -1) {//问卷网
                    var nums = $(".new-statics .desktop-only .number");
                    var usercount = nums.eq(0).html() + nums.eq(1).html();
                    var quescount = nums.eq(2).html() + nums.eq(3).html();

                    $.get("https://www.wenjuan.com/", function (result) {
                        var truedata = result.split("问卷网已帮助<span class=\"number\">")[1].split("</span><span class=\"number\">亿</span>份数据")[0].split('</span><span\nclass="number">万</span>用户收集超过<span\nclass="number">');
                        var true_usercount = truedata[0];
                        var true_quescount = truedata[1];
                        var content = "监控对象：问卷网\n时间：" + nowDate + "\n显示用户数：" + usercount + "\n显示答卷数：" + quescount + "\n实际用户数：" + true_usercount + "\n实际答卷数：" + true_quescount;
                        var adata = JSON.stringify({
                            "msgtype": "text",
                            "text": {
                                "content": content
                            }
                        });
                        var aurl = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7469dcd2-21b7-4ee8-a674-3b77a11579c7";
                        $.post("https://wjxyl.natapp4.cc/afile/relaydata.ashx",
                            {
                                "url": aurl,
                                "data": adata
                            },
                            function (result) {

                            }
                        );
                    });

                }
            })
        }
})();