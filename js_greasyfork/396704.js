// ==UserScript==
// @name         电影列表排序助手
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @version      0.1.2
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  给包含很长电影列表的单个页面添加几个筛选排序功能，比如按照年份、评分等对电影列表重新进行排序。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      https://leisidianying.com/*
// @grant        GM_openInTab
// @note         2020-02-22：1.增加使用说明和显示更多电影按钮
// @note         2020-02-22：2.增加电影详情页的相似度查询
// @downloadURL https://update.greasyfork.org/scripts/396704/%E7%94%B5%E5%BD%B1%E5%88%97%E8%A1%A8%E6%8E%92%E5%BA%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/396704/%E7%94%B5%E5%BD%B1%E5%88%97%E8%A1%A8%E6%8E%92%E5%BA%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function removeADS(arr) {
        arr.forEach(function (v) {
            let elem = document.querySelector(v);
            if (elem) { elem.remove(); }
        });
    }

    //标签列表页
    function setButton() {
        let div = document.createElement("div");
        div.id = "sortHelper";
        let h4 = document.createElement("h4");
        let h5 = document.createElement("h5");
        h4.innerHTML = '<a href="https://greasyfork.org/zh-CN/users/289205-%E6%B5%B4%E7%81%AB%E5%87%A4%E5%87%B0" target="_blank">★★★电影列表排序助手，作者：浴火凤凰(QQ:307053741)★★★</a>';
        let totalMovie = document.querySelector(".block-main.block-main-first div.item-name div.rat span[title=rating]").innerText;
        let loaded = document.querySelectorAll("#tag-movie-list > div.item").length;
        let title = document.querySelector("#block-tag-movie-list > div.heading-c > h2");
        title.innerHTML = title.innerText + '<font color="red">（30/100）</font>'.replace("30", loaded).replace("100", totalMovie);
        let info = '<div style="color:red;">1.本标签系列共有电影' + totalMovie + '部，首次打开页面只显示了' + loaded + '部，想要显示更多电影请点击【显示更多电影】按钮。</div>';
        info += '<div style="color:red;">2.点击【显示更多电影】按钮之后，需要再次点击筛选按钮，才会对新加载的电影进行排序。</div>';
        h5.innerHTML = info;
        let input0 = document.createElement("input");
        let input1 = document.createElement("input");
        let input2 = document.createElement("input");
        input0.type = "button";
        input0.value = "显示更多电影";
        input1.type = "button";
        input1.value = "年份从远到近";
        input1.style.marginLeft = "15px";
        input2.type = "button";
        input2.value = "年份从近到远";
        input2.style.marginLeft = "15px";
        input0.onclick = function () {
            var iRelListNextPage = iTagMovieListCurrentPage + 1;
            $('#buttonMoreTagMovieListContainer button').attr('disabled', 'disabled');
            document.querySelector("#sortHelper input:first-of-type").value = "正在加载...";
            document.querySelector("#sortHelper input:first-of-type").disabled = true;
            $.ajax({
                url: sTagMovieListMoreUrl + '&order=' + iTagMovieListOrder + '&page=' + iRelListNextPage,
                success: function (data) {
                    $('#tag-movie-list').append(data);
                    iTagMovieListCurrentPage++;
                    let loaded = document.querySelectorAll("#tag-movie-list > div.item").length;
                    let title = document.querySelector("#block-tag-movie-list > div.heading-c > h2 > font");
                    title.innerText = '（' + loaded + '/' + totalMovie + '）';
                    if (iTagMovieListCurrentPage == iTagMovieListLastPage) {
                        $('#buttonMoreTagMovieListContainer').remove();
                        document.querySelector("#sortHelper input:first-of-type").value = "全部加载完毕";
                        document.querySelector("#sortHelper input:first-of-type").disabled = true;
                    } else {
                        $('#buttonMoreTagMovieListContainer button').removeAttr('disabled');
                        document.querySelector("#sortHelper input:first-of-type").value = "显示更多电影";
                        document.querySelector("#sortHelper input:first-of-type").disabled = false;
                    }
                }
            })
        }
        input1.onclick = input2.onclick = function () {
            let items = document.querySelectorAll("#tag-movie-list > div.item");
            let len = items.length;
            let arr = [];
            for (let i = 0; i < len; i++) {
                arr.push(items[i]);
            }
            let _this = this;
            arr.sort(function (a, b) {
                let name1 = a.querySelector("div.item-name div.name-c a.name");
                let year1 = name1.innerText.match(/\((\d+)\)/);
                if (year1) { year1 = +year1[1] }
                else { year1 = 0; }
                let name2 = b.querySelector("div.item-name div.name-c a.name");
                let year2 = name2.innerText.match(/\((\d+)\)/);
                if (year2) { year2 = +year2[1] }
                else { year2 = 0; }
                if (_this.value == "年份从近到远") { return year2 - year1; }
                else { return year1 - year2; }

            });
            let div = document.createElement("div");
            for (let i = 0; i < len; i++) {
                div.appendChild(arr[i]);
            }
            document.querySelector("#tag-movie-list").innerHTML = div.innerHTML;
        }
        let input3 = document.createElement("input");
        let input4 = document.createElement("input");
        input3.type = "button";
        input3.value = "评分从高到低";
        input3.style.marginLeft = "15px";
        input4.type = "button";
        input4.value = "评分从低到高";
        input4.style.marginLeft = "15px";
        input3.onclick = input4.onclick = function () {
            let items = document.querySelectorAll("#tag-movie-list > div.item");
            let len = items.length;
            let arr = [];
            for (let i = 0; i < len; i++) {
                arr.push(items[i]);
            }
            let _this = this;
            arr.sort(function (a, b) {
                let name1 = a.querySelector("div.item-name div.rat span[title=rating]");
                let rating1 = name1.innerText;
                if (rating1) { rating1 = +rating1 }
                else { rating1 = 0; }
                let name2 = b.querySelector("div.item-name div.rat span[title=rating]");
                let rating2 = name2.innerText;
                if (rating2) { rating2 = +rating2 }
                else { rating2 = 0; }
                if (_this.value == "评分从高到低") { return rating2 - rating1; }
                else { return rating1 - rating2; }

            });
            let div = document.createElement("div");
            for (let i = 0; i < len; i++) {
                div.appendChild(arr[i]);
            }
            document.querySelector("#tag-movie-list").innerHTML = div.innerHTML;
        }

        div.appendChild(h4);
        div.appendChild(h5);
        div.appendChild(input0);
        div.appendChild(input1);
        div.appendChild(input2);
        div.appendChild(input3);
        div.appendChild(input4);
        document.querySelector("#tag-movie-list").parentNode.insertBefore(div, document.querySelector("#tag-movie-list"));

    }

    //电影详情页
    function setButton2() {
        let div = document.createElement("div");
        div.id = "sortHelper";
        let h4 = document.createElement("h4");
        let h5 = document.createElement("h5");
        h4.innerHTML = '<a href="https://greasyfork.org/zh-CN/users/289205-%E6%B5%B4%E7%81%AB%E5%87%A4%E5%87%B0" target="_blank">★★★电影列表排序助手，作者：浴火凤凰(QQ:307053741)★★★</a>';
        // let totalMovie = document.querySelector(".block-main.block-main-first div.item-name div.rat span[title=rating]").innerText;
        let loaded = document.querySelectorAll("#movie-rel-list > div.item").length;
        let title = document.querySelector("#block-movie-rel-list > div.heading-c > h2");
        title.innerHTML = title.innerText + '<font color="red">（30）</font>'.replace("30", loaded);
        let info = '<div style="color:red;">1.想要显示更多电影请点击【显示更多电影】按钮。</div>';
        info += '<div style="color:red;">2.点击【显示更多电影】按钮之后，需要再次点击筛选按钮，才会对新加载的电影进行排序。</div>';
        h5.innerHTML = info;
        let input0 = document.createElement("input");
        let input1 = document.createElement("input");
        let input2 = document.createElement("input");
        input0.type = "button";
        input0.value = "显示更多电影";
        input1.type = "button";
        input1.value = "年份从远到近";
        input1.style.marginLeft = "15px";
        input2.type = "button";
        input2.value = "年份从近到远";
        input2.style.marginLeft = "15px";
        input0.onclick = function () {
            if (moreMovieRelListInProcess)
                return false;
            moreMovieRelListInProcess = true;
            var iRelListNextPage = iMovieRelListCurrentPage + 1;
            if (iRelListNextPage > iMovieRelListLastPage)
                return false;
            $('#buttonMoreMovieRelListContainer button').attr('disabled', 'disabled');
            document.querySelector("#sortHelper input:first-of-type").value = "正在加载...";
            document.querySelector("#sortHelper input:first-of-type").disabled = true;
            $.ajax({
                url: sMovieRelListMoreUrl + '&order=' + iMovieRelListOrder + '&page=' + iRelListNextPage,
                success: function (data) {
                    $('#movie-rel-list').append(data);
                    iMovieRelListCurrentPage++;
                    let loaded = document.querySelectorAll("#movie-rel-list > div.item").length;
                    let title = document.querySelector("#block-movie-rel-list > div.heading-c > h2 > font");
                    title.innerText = '（' + loaded + '）';
                    if (iMovieRelListCurrentPage == iMovieRelListLastPage) {
                        $('#buttonMoreMovieRelListContainer').remove();
                        document.querySelector("#sortHelper input:first-of-type").value = "全部加载完毕";
                        document.querySelector("#sortHelper input:first-of-type").disabled = true;
                    } else {
                        $('#buttonMoreMovieRelListContainer button').removeAttr('disabled');
                        document.querySelector("#sortHelper input:first-of-type").value = "显示更多电影";
                        document.querySelector("#sortHelper input:first-of-type").disabled = false;
                    }
                    setTimeout(function () {
                        moreMovieRelListInProcess = false;
                    }, 1e3)
                }
            });
        }
        input1.onclick = input2.onclick = function () {
            let items = document.querySelectorAll("#movie-rel-list > div.item");
            let len = items.length;
            let arr = [];
            for (let i = 0; i < len; i++) {
                arr.push(items[i]);
            }
            let _this = this;
            arr.sort(function (a, b) {
                let name1 = a.querySelector("div.item-name div.name-c a.name");
                let year1 = name1.innerText.match(/\((\d+)\)/);
                if (year1) { year1 = +year1[1] }
                else { year1 = 0; }
                let name2 = b.querySelector("div.item-name div.name-c a.name");
                let year2 = name2.innerText.match(/\((\d+)\)/);
                if (year2) { year2 = +year2[1] }
                else { year2 = 0; }
                if (_this.value == "年份从近到远") { return year2 - year1; }
                else { return year1 - year2; }

            });
            let div = document.createElement("div");
            for (let i = 0; i < len; i++) {
                div.appendChild(arr[i]);
            }
            document.querySelector("#movie-rel-list").innerHTML = div.innerHTML;
        }
        let input3 = document.createElement("input");
        let input4 = document.createElement("input");
        input3.type = "button";
        input3.value = "评分从高到低";
        input3.style.marginLeft = "15px";
        input4.type = "button";
        input4.value = "评分从低到高";
        input4.style.marginLeft = "15px";
        input3.onclick = input4.onclick = function () {
            let items = document.querySelectorAll("#movie-rel-list > div.item");
            let len = items.length;
            let arr = [];
            for (let i = 0; i < len; i++) {
                arr.push(items[i]);
            }
            let _this = this;
            arr.sort(function (a, b) {
                let name1 = a.querySelector("div.item-name div.rat span[title=rating]");
                let rating1 = name1.innerText;
                if (rating1) { rating1 = +rating1 }
                else { rating1 = 0; }
                let name2 = b.querySelector("div.item-name div.rat span[title=rating]");
                let rating2 = name2.innerText;
                if (rating2) { rating2 = +rating2 }
                else { rating2 = 0; }
                if (_this.value == "评分从高到低") { return rating2 - rating1; }
                else { return rating1 - rating2; }

            });
            let div = document.createElement("div");
            for (let i = 0; i < len; i++) {
                div.appendChild(arr[i]);
            }
            document.querySelector("#movie-rel-list").innerHTML = div.innerHTML;
        }
        let input5 = document.createElement("input");
        input5.type = "button";
        input5.value = "相似度";
        input5.style.marginLeft = "15px";
        input5.onclick = function () {
            let items = document.querySelectorAll("#movie-rel-list > div.item");
            let len = items.length;
            let arr = [];
            for (let i = 0; i < len; i++) {
                arr.push(items[i]);
            }
            let _this = this;
            arr.sort(function (a, b) {
                let name1 = a.querySelector("div.is-row.clearfix div.row div.smt span[title=rating]");
                let rating1 = name1.innerText.replace("%", "");
                if (rating1) { rating1 = +rating1 }
                else { rating1 = 0; }
                let name2 = b.querySelector("div.is-row.clearfix div.row div.smt span[title=rating]");
                let rating2 = name2.innerText.replace("%", "");
                if (rating2) { rating2 = +rating2 }
                else { rating2 = 0; }
                if (_this.value == "相似度") { return rating2 - rating1; }
                else { return rating1 - rating2; }

            });
            let div = document.createElement("div");
            for (let i = 0; i < len; i++) {
                div.appendChild(arr[i]);
            }
            document.querySelector("#movie-rel-list").innerHTML = div.innerHTML;
        }

        div.appendChild(h4);
        div.appendChild(h5);
        div.appendChild(input0);
        div.appendChild(input1);
        div.appendChild(input2);
        div.appendChild(input3);
        div.appendChild(input4);
        div.appendChild(input5);
        document.querySelector("#movie-rel-list").parentNode.insertBefore(div, document.querySelector("#movie-rel-list"));

    }




    if (location.hostname.includes("leisidianying.com")) {//整个网站
        if (location.href.includes("/tag/")) {//单个页面
            setTimeout(function () { setButton(); }, 2000);
        }
        if (location.href.includes("/movie/")) {//单个页面
            setTimeout(function () { setButton2(); }, 2000);
        }
    }
    // Your code here...
})();