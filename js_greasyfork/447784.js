// ==UserScript==
// @name         妖火自动捡肉吃
// @namespace    https://blog.zgcwkj.cn/archives/81.html
// @version      1.9.0.6.13.15.01
// @description  zh-cn
// @author       zgcwkj
// @license MIT
// @match        *://yaohuo.me/bbs*
// @match        *://yaohw.com/bbs*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447784/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E6%8D%A1%E8%82%89%E5%90%83.user.js
// @updateURL https://update.greasyfork.org/scripts/447784/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E6%8D%A1%E8%82%89%E5%90%83.meta.js
// ==/UserScript==

(function () {
    var title = document.title;
    // console.log(title);
    var trge = /_.+?_妖火网/;
    var html = document.body.innerHTML;
    html = html.replace("  ", "").replace("\r", "").replace("\n", "");
    // console.log(html);
    if (title.indexOf("密码") == -1) {
        if (title.indexOf("查看回复") != -1) {//查看回复
            console.log("吃完了关闭");
            window.close();
        } else if (title.indexOf("查看") != -1) {//查看
            console.log("查看啥");
        } else if (trge.test(title)) {//回复帖子
            if (html.match(/(?<=.+\()余0(?=\).+)/) == null) {//还有剩的
                var toHtml_textarea = document.getElementsByTagName("textarea");
                // console.log(toHtml_textarea);
                if (toHtml_textarea.length == 0) {//已经结束的帖子
                    console.log("已经结束了");
                    window.close();
                } else {
                    if (html.indexOf("礼金") != -1) {
                        var content = "吃一口";
                        var indexType = true;
                        if (!indexType) {
                            //==>寻找妖友的回复进行伪造
                            var regC = /(?<=回<\/a>]<a href=".+?<\/a>：).+?(?=\()/g;
                            var toRegC = html.match(regC);
                            // console.log(toReg);
                            content = toRegC[Math.ceil(Math.random() * (toRegC.length - 1))]
                            //==>寻找妖友的回复进行伪造
                        } else {
                            var strs = [
                                "就想吃个肉，不能水回复啊！感谢楼主的肉！！！",
                                "Thanks for the meat of the landlord!!!",
                                "肉肉肉",
                                "这肉真给力",
                                "就想吃个肉！",
                                "肉啊，我来了",
                                "肉的滋味真好",
                                "爱老C，更爱肉",
                                "不水，吃肉吃肉",
                                "我爱楼主，更爱肉",
                                "安静，我吃个肉先",
                                "哈哈，香香的肉儿",
                                "吃肉，离不开楼主了",
                                "吃肉，小心被老C发现",
                                "我不是萝莉控，是肉控啊！",
                                "逛妖火不可能不吃肉的啦！",
                                "吃肉，也得小心被老C吊打",
                                "想吃肉，突然想起了能开花吗",
                                "楼主，我能表白吗？向你的肉！",
                            ]
                            content = strs[Math.ceil(Math.random() * (strs.length - 1))];
                        }
                        //console.log(content);
                        toHtml_textarea[0].value = content;
                        var toHtml_input = document.getElementsByTagName("input");
                        // console.log(toHtml_input);
                        for (var iii = toHtml_input.length - 1; iii > 0; iii--) {
                            if (toHtml_input[iii].value == "快速回复") {
                                toHtml_input[iii].click();
                            }
                        }
                    } else {
                        console.log("普通的贴子");
                    }
                }
            } else {//已经吃完了就关闭
                console.log("吃完了");
                window.close();
            }
        } else {
            var reg = /<img src="\/NetImages\/li.gif" alt="礼".+?<\/a>/g;
            var toReg = html.match(reg);
            // console.log(toReg);
            if (toReg != null) {
                for (var i = 0; i < toReg.length; i++) {
                    var url = toReg[i].match(/(?<=<a href=").+?(?=">.+?<\/a>)/);
                    // console.log(url);
                    window.open(url);
                }
            }
            setTimeout(function () {//降低频率
                nextPage();
            }, '1000');
            function nextPage() {//单击下一页按钮
                var toHtml_a = document.getElementsByTagName("a");
                for (var ii = 0; ii < toHtml_a.length; ii++) {
                    if (toHtml_a[ii].innerText == "下一页") {
                        toHtml_a[ii].click();
                    }
                }
            }
        }
    } else {
        console.log("输入密码");
    }
})();