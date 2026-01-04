
// ==UserScript==
// @name         电影网站过滤系统
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @version      0.1.3
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  在悠悠MP4电影网站的文字电影列表顶部添加几个可以筛选的关键字按钮，点击相应的按钮就会按照按钮的提示文字进行电影种类的筛选，并切换下面列表的显示。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      https://www.uump4.net/
// @include      https://www.uump4.net/index*
// @include      https://www.uump4.net/search*
// @include      https://www.yingyinwu.com/
// @include      https://www.yingyinwu.com/index*
// @include      https://www.yingyinwu.com/search*
// @grant        none
// @note         2020-02-04：1.更改筛选类型2.完善筛选关键词3.增加 删除当前显示项 可以一次性删除某一类型4.筛选函数参数化，现在支持悠悠MP4、影音屋两个网站。
// @note         2020-07-19：1.修改控制台错误和修改脚本适用页面的范围。
// @downloadURL https://update.greasyfork.org/scripts/391132/%E7%94%B5%E5%BD%B1%E7%BD%91%E7%AB%99%E8%BF%87%E6%BB%A4%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/391132/%E7%94%B5%E5%BD%B1%E7%BD%91%E7%AB%99%E8%BF%87%E6%BB%A4%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function setMovieList(param) {
        let items = document.querySelectorAll(param.listSelector);
        let len = items.length;
        for (let i = 0; i < len; i++) {
            let a = document.createElement("a");
            a.innerText = "【删除】";
            a.href = "javascript:void(0);";
            a.onclick = function () {
                this.parentNode.parentNode.remove();
            }
            items[i].querySelector(param.addRemoveBtnSelector).appendChild(a);
        }

        var container = document.querySelector(param.filterContainerSelector);
        var div = document.createElement("div");
        var tagArr = ["显示全部", "字幕组", "合集", "BD", "WEB-DL", "HD", "720P", "1080P", "HDTV", "多音轨", "中英双字", "中文字幕", "大区版", "4K", "原盘", "Remux", "3D", "枪版", "删除当前显示项"];
        for (let i = 0; i < tagArr.length; i++) {
            let a = document.createElement("a");
            a.innerText = tagArr[i];
            a.href = "javascript:void(0);";
            a.style.marginLeft = "25px";
            a.onclick = function () {
                let links = this.parentNode.querySelectorAll("a");
                for (let i = 0; i < links.length; i++) {
                    links[i].style.border = "none";
                }
                this.style.border = "1px solid red";

                let text2 = this.innerText;
                //首先判断点击的是不是 删除当前显示项
                if (text2 == "删除当前显示项") {
                    for (let i = 0; i < len; i++) {
                        let li = items[i];
                        if (li.style.display == "flex") {
                            li.remove();
                        }
                    }
                    return false;
                }
                for (let i = 0; i < len; i++) {
                    let li = items[i];
                    li.style.display = "flex";//先显示出全部列表
                    let text1 = li.querySelector(param.filterContentSelector).innerText.toLowerCase();
                    switch (text2) {
                        case "显示全部":
                            break;
                        case "字幕组":
                            if (!text1.includes("killman")
                                && !text1.includes("321n")
                                && !text1.includes("lwgod")
                                && !text1.includes("龙网")
                                && !text1.includes("cnxp")
                                && !text1.includes("480p+720p")
                                && !text1.includes("480p/720p")
                                && !text1.includes("480/720")
                                && !text1.includes("帝国")
                                && !text1.includes("cnscg")
                                && !text1.includes("圣城家园")
                                && !text1.includes("cmct")
                                && !text1.includes("wofei")
                                && !text1.includes("hdbird")
                                && !text1.includes("飞鸟娱乐")
                            ) {
                                li.style.display = "none";
                            }
                            break;
                        case "合集":
                            if (!text1.includes("合集")
                                && !text1.includes("部曲")
                                && !text1.includes("部全")
                                && !text1.includes("合辑")
                                && !text1.includes("系列")
                                && !text1.includes("全集")
                                && !text1.includes("打包")
                                && !/1-\d/.test(text1)
                                && !/I-/.test(text1)
                                && !/I\s+-/.test(text1)
                                && !/1~\d/.test(text1)
                                && !/\d\+\d/.test(text1)
                                && !/\d集全/.test(text1)
                                && !/全\d+集/.test(text1)) {
                                li.style.display = "none";
                            }
                            break;
                        case "BD":
                            if (!text1.includes("[bd")
                                && !text1.includes("bd.")
                                && !text1.includes("bd/")
                                && !text1.includes("bluray")
                                && !text1.includes("blu-ray")
                                && !text1.includes("bdrip")
                                && !text1.includes("brrip")
                                && !text1.includes("高码版")) {
                                li.style.display = "none";
                            }
                            break;
                        case "HD":
                            if (!text1.includes("[hd-")
                                && !text1.includes("hdrip")
                            ) {
                                li.style.display = "none";
                            }
                            break;
                        case "WEB-DL":
                            if (!text1.includes("[web")
                                && !text1.includes("[webrip")
                                && !text1.includes(".web-dl.")
                                && !text1.includes(".webrip.")) {
                                li.style.display = "none";
                            }
                            break;
                        case "大区版":
                            if (!text1.includes("韩版")
                                && !text1.includes(".r5.")
                                && !text1.includes(".kr.")
                                && !text1.includes(".cee.")
                                && !text1.includes("美版")
                                && !text1.includes("俄版")
                                && !text1.includes("港版")
                            ) {
                                li.style.display = "none";
                            }
                            break;
                        case "4K":
                            if (!text1.includes("4k") && !text1.includes(".2160p.")) {
                                li.style.display = "none";
                            }
                            break;
                        case "中文字幕":
                            if (!text1.includes("中文字幕") && !text1.includes("中字")) {
                                li.style.display = "none";
                            }
                            break;
                        case "中英双字"://中英字幕/中英文字幕/中英特效
                            if (!text1.includes("中英")
                                && !text1.includes("双字")
                                && !text1.includes("双语字幕")
                                && !text1.includes("简繁")
                                && !text1.includes("chs-eng")
                            ) {
                                li.style.display = "none";
                            }
                            break;
                        case "多音轨":
                            if (!text1.includes("音轨")
                                && !text1.includes("双语")
                                && !text1.includes("三语")
                                && !text1.includes("四语")
                                && !text1.includes("国英")
                                && !text1.includes("国/英")
                                && !text1.includes("国粤")
                                && !text1.includes("audio")
                            ) {
                                li.style.display = "none";
                            }
                            break;
                        case "枪版":
                            if (!text1.includes("枪版")
                                && !text1.includes("[tc")
                                && !text1.includes(".tc.")
                                && !text1.includes("[ts")
                                && !text1.includes(".ts.")
                                && !text1.includes("[dvd-")
                                && !text1.includes("[dvd.")
                                && !text1.includes("[dvdscr-")
                                && !text1.includes("[dvdscr.")
                                && !text1.includes("[cam")
                                && !text1.includes(".cam.")
                                && !text1.includes("tc中字")
                                && !text1.includes("ts中字")
                                && !text1.includes("抢先版")
                                && !text1.includes("仅供尝鲜")
                                && !/\d{3}m/.test(text1)
                            ) {
                                li.style.display = "none";
                            }
                            break;
                        case "<5GB":
                        case "<10GB":
                        case "<15GB":
                            let n1 = parseFloat(this.innerText.replace("<", "").replace("GB", ""), 10);
                            let movieNode = li.querySelector("div.subject.break-all > a:last-of-type");
                            let n2 = movieNode.innerText.match(/([0-9.]+)G/);
                            if (n2 != null) {//文件显示为GB
                                n2 = parseFloat(n2[1], 10);
                                if (n2 > n1) { li.style.display = "none"; }
                                else {
                                    //与下边界进行比较，过滤掉上一个分段的数据
                                    if (n2 < (n1 - 5)) { li.style.display = "none"; }
                                }
                            }
                            else {//文件显示为MB或者不显示大小
                                if (n1 != 5) {//大于5GB的情况，去掉所有的大小为1GB以下的文件，就是显示为MB的文件
                                    n2 = movieNode.innerText.match(/([0-9.]+)M/);
                                    if (n2 != null) {
                                        { li.style.display = "none"; }
                                    }
                                }
                            }
                            break;

                        default:
                            if (!text1.includes(this.innerText.toLowerCase())) {
                                li.style.display = "none";
                            }
                    }
                }
                return false;
            }
            div.appendChild(a);
        }
        container.appendChild(div);
    }


    if (location.href.includes("https://www.uump4.net/")) {
        let param = {};
        param.listSelector = "ul.list-unstyled.threadlist > li.media.forum-list";
        param.addRemoveBtnSelector = "div.subject.break-all";
        param.filterContainerSelector = "div.threadlist-box > div.item-head > div.left";
        param.filterContentSelector = "div.subject.break-all";
        setMovieList(param);
    }
    if (location.href.includes("https://www.yingyinwu.com/")) {
        let param = {};
        param.listSelector = "div.card > div.card-body > ul.list-unstyled.threadlist > li";
        param.addRemoveBtnSelector = "div.subject.break-all";
        param.filterContainerSelector = "div.card div.card-header ul li";
        param.filterContentSelector = "div.subject.break-all";
        setMovieList(param);
    }
    // Your code here...
})();
