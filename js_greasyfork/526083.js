// ==UserScript==
// @name         删除b站已开奖官方转发抽奖动态
// @namespace    https://www.bilibili.com/
// @version      1.0
// @description  删除b站已出奖的官方抽奖动态&多余的重复官抽&保留所有非官抽和互动动态，适用新版界面
// @author       whale-shark888,loneyor
// @match        https://space.bilibili.com/*/dynamic
// @match        https://space.bilibili.com/*/dynamic?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @originalURL  https://greasyfork.org/zh-CN/scripts/460079-%E5%88%A0%E9%99%A4b%E7%AB%99%E5%B7%B2%E5%87%BA%E5%A5%96%E7%9A%84%E5%AE%98%E6%96%B9%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81-%E4%BF%9D%E7%95%99%E9%9D%9E%E5%AE%98%E6%8A%BD%E5%8A%A8%E6%80%81
// @downloadURL https://update.greasyfork.org/scripts/526083/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%B7%B2%E5%BC%80%E5%A5%96%E5%AE%98%E6%96%B9%E8%BD%AC%E5%8F%91%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/526083/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%B7%B2%E5%BC%80%E5%A5%96%E5%AE%98%E6%96%B9%E8%BD%AC%E5%8F%91%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // Your code here...
    var timeinterval = 1000;
    var dict = [];
    var hostup = {};
    var unfollow = [];
    var i = 0;
    const xhr = new XMLHttpRequest();
    console.log("start");

    function combin(v) {
        var exist = false;
        var i = v;
        if (
            document.getElementsByClassName("bili-dyn-list-no-more").length == 0
        ) {
            let refresh = setInterval(function () {
                // 刷新页面内容
                window.scrollTo(0, document.documentElement.scrollHeight);
                console.log("更新页面内容");
                combin(i);
                clearInterval(refresh);
            }, 0);
        } else {
            console.log("第", i, "个动态");
            // 每一次循环都更新动态数量
            var num = document
                .getElementsByClassName("bili-dyn-list__items")[0]
                .getElementsByClassName("bili-dyn-list__item").length;
            // 如果动态刷新没到底，下标动态数量不等于0就执行
            if (
                document.getElementsByClassName("bili-dyn-list-no-more")
                    .length == 0 ||
                num - i != 0
            ) {
                let element = document
                    .getElementsByClassName("bili-dyn-list__items")[0]
                    .getElementsByClassName("bili-dyn-list__item")[i];
                element.scrollIntoView();
                // 如果这条动态是官方抽奖
                try {
                    if (
                        dict.includes(
                            document
                                .getElementsByClassName(
                                    "bili-dyn-list__items"
                                )[0]
                                .getElementsByClassName("bili-dyn-list__item")
                                [i].getElementsByClassName(
                                    "bili-dyn-item__body"
                                )[0]
                                .getElementsByClassName("lottery")[0]
                                .getAttribute("data-oid")
                        )
                    ) {
                        exist = true;
                    }
                } catch (e) {
                    exist = false;
                }
                // 如果官方抽奖动态重复，删除多余的，只保留一个
                // setTimeout(function () {
                if (exist) {
                    console.log("点击删除重复");
                    setTimeout(() => {
                        document
                            .getElementsByClassName("bili-dyn-list__items")[0]
                            .getElementsByClassName("bili-dyn-list__item")
                            [i].getElementsByClassName(
                                "tp bili-dyn-more__btn"
                            )[0]
                            .dispatchEvent(new MouseEvent("mouseenter"));
                        //删除
                        setTimeout(() => {
                            document
                                .getElementsByClassName(
                                    "bili-dyn-list__items"
                                )[0]
                                .getElementsByClassName("bili-dyn-list__item")
                                [i].getElementsByClassName(
                                    "bili-cascader-options__item"
                                )[1]
                                .click();
                            //确认
                            setTimeout(() => {
                                document
                                    .getElementsByClassName(
                                        "bili-modal__button confirm red"
                                    )[0]
                                    .click();
                                console.log("官方抽奖", i, "删除完成");
                                setTimeout(() => {
                                    combin(i);
                                }, timeinterval);
                            }, timeinterval);
                        }, timeinterval);
                    }, timeinterval);
                }
                // 如果官方抽奖没有重复，则打开抽奖详情查看抽奖情况,删除已出奖的
                else if (
                    document
                        .getElementsByClassName("bili-dyn-list__items")[0]
                        .getElementsByClassName("bili-dyn-list__item")[i] !=
                        undefined &&
                    document
                        .getElementsByClassName("bili-dyn-list__items")[0]
                        .getElementsByClassName("bili-dyn-list__item")
                        [i].getElementsByClassName("lottery").length != 0
                ) {
                    //                         console.log("打开互动抽奖弹窗");
                    //                         // 点击打开官方互动抽奖弹窗
                    //                         document
                    //                             .getElementsByClassName("bili-dyn-list__items")[0]
                    //                             .getElementsByClassName("bili-dyn-list__item")
                    //                             [i].getElementsByClassName("lottery")[0]
                    //                             .click();

                    //                         console.log(
                    //                             "抽奖详情打开？:" +
                    //                                 (document.getElementsByClassName("bili-popup")
                    //                                     .length !=
                    //                                     0)
                    //                         );
                    // const myDate = new Date();
                    // const currentDate =
                    //     myDate.getMinutes() +
                    //     "分" +
                    //     myDate.getSeconds() +
                    //     "秒" +
                    //     myDate.getMilliseconds() +
                    //     "豪秒";
                    // // 每次循环打印当前时间
                    // console.log(currentDate);
                    // 查看抽奖状态

                    // try {
                    var judge = false;
                    // var count = false;

                    var bussinessId = document
                        .getElementsByClassName("bili-dyn-list__items")[0]
                        .getElementsByClassName("bili-dyn-list__item")
                        [i].getElementsByClassName(
                            "dyn-card-opus hide-border"
                        )[0]
                        .getAttribute("dyn-id");
                    console.log("bussinessId=" + bussinessId);
                    xhr.open(
                        "GET",
                        "https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_type=4&business_id=" +
                            bussinessId,
                        false
                    );
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                // 请求成功
                                var obj = JSON.parse(xhr.responseText);

                                //获取lottery_time属性的值，即抽奖时间的Unix时间戳
                                var lottery_time = obj.data.lottery_time;

                                //将Unix时间戳转换为Date对象
                                var lottery_date = new Date(
                                    lottery_time * 1000
                                );

                                //获取当前时间的Date对象
                                var current_date = new Date();

                                //比较两个Date对象，如果抽奖时间小于当前时间，返回true，否则返回false
                                judge = lottery_date <= current_date;

                                //打印结果
                                console.log("请求成功");
                            } else {
                                // 请求失败
                                console.log("请求失败");
                            }
                        }
                    };
                    xhr.send();
                    console.log("judge=", judge, ",i=", i);
                    // 关闭抽奖详情窗口
                    // document.getElementsByClassName('bili-popup__header__close')[0].click();
                    // document.getElementsByClassName(
                    //     "bili-popup"
                    // )[0].style.display = "none";
                    // document.body.removeChild(
                    //     document.getElementsByClassName("bili-popup")[0]
                    // );
                    // console.log("关闭抽奖详情窗口");

                    //记录用户名
                    let upname = document
                        .getElementsByClassName("bili-dyn-list__items")[0]
                        .getElementsByClassName("bili-dyn-list__item")
                        [i].getElementsByClassName(
                            "dyn-orig-author__name fs-medium"
                        )[0]
                        .textContent.trim();
                    if (!judge) {
                        hostup[upname] = false;
                    } else if (hostup[upname] != false) {
                        hostup[upname] = true;
                    }
                    console.log("用户名：", upname);

                    // 如果judge为true，代表抽奖结果已经公布，要删除
                    if (judge) {
                        // 执行删除 循环下一个
                        //触发鼠标悬停菜单
                        setTimeout(() => {
                            document
                                .getElementsByClassName(
                                    "bili-dyn-list__items"
                                )[0]
                                .getElementsByClassName("bili-dyn-list__item")
                                [i].getElementsByClassName(
                                    "tp bili-dyn-more__btn"
                                )[0]
                                .dispatchEvent(new MouseEvent("mouseenter"));
                            //删除
                            setTimeout(() => {
                                document
                                    .getElementsByClassName(
                                        "bili-dyn-list__items"
                                    )[0]
                                    .getElementsByClassName(
                                        "bili-dyn-list__item"
                                    )
                                    [i].getElementsByClassName(
                                        "bili-cascader-options__item"
                                    )[1]
                                    .click();
                                //确认
                                setTimeout(() => {
                                    document
                                        .getElementsByClassName(
                                            "bili-modal__button confirm red"
                                        )[0]
                                        .click();
                                    console.log("官方抽奖", i, "删除完成");
                                    setTimeout(() => {
                                        combin(i);
                                    }, timeinterval);
                                }, timeinterval);
                            }, timeinterval);
                        }, timeinterval);
                    } else {
                        // 不要删除 循环下一个
                        var oid = document
                            .getElementsByClassName("bili-dyn-list__items")[0]
                            .getElementsByClassName("bili-dyn-list__item")
                            [i].getElementsByClassName("bili-dyn-item__body")[0]
                            .getElementsByClassName("lottery")[0]
                            .getAttribute("data-oid");
                        dict.push(oid);
                        // console.log(dict);
                        combin(i + 1);
                    }
                } else {
                    // 直接跳过执行下一个
                    combin(i + 1);
                }
            } else {
                //遍历所有动态
                console.log("删除完成");
                for (let upname in hostup) {
                    if (hostup[upname] == true) {
                        unfollow.push(upname);
                    }
                }
                console.log("可取关用户");
                unfollow.forEach((upname) => {
                    console.log(upname);
                });
            }
        }
    }
    window.onload = function () {
        var btn = document.createElement("button");
        btn.innerHTML = "删除动态";
        btn.style.position = "absolute";
        btn.style.top = "180px";
        btn.style.right = "0";
        btn.style.background = "#00bfff";
        btn.style.color = "white";
        btn.style.border = "#00bfff";
        btn.style.width = "1%";
        btn.style.height = "100px";
        btn.style.borderRadius = "3px";
        btn.style.zIndex = "1003";
        btn.onmousemove = function () {
            console.log("show");
            btn.style.width = "7%";
            btn.style.height = "150px";
        };
        btn.onmouseout = function () {
            console.log("hide");
            btn.style.width = "1%";
            btn.style.height = "100px";
        };
        document.body.append(btn);
        btn.onclick = function () {
            combin(i);
        };
    };
})();
