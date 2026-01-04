// ==UserScript==
// @name         搜索引擎自动加载下一页
// @namespace    http://tampermonkey.net/
// @home-url     https://github.com/jueserencai/search-engines-next-page
// @description  搜索引擎自动加载下一页，包括baidu sogou bing 360so
// @version      0.0.2
// @author       绝色人才
// @include      https://www.sogou.com/web*
// @include      https://cn.bing.com/search*
// @include      https://www.baidu.com/s*
// @include      https://www.so.com/s*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @run-at       document-end
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/369545/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E4%B8%8B%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/369545/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E4%B8%8B%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==


(function () {
    'use strict';
    
    // console.log("ok1");
    /* 返回网址对应的搜索引擎类，包含ajax参数，更新下一页码、查询关键词等的方法 */
    function Config() {
        this.sogou = function () {
            // 类型1是搜索引擎
            this.type = 1;
            this.config = {
                url: "https://www.sogou.com/web",
                data: {
                    ie: "utf8",
                    query: "",
                    page: 1,
                },
                getOrPost: "GET",
                parentNodeName: "#main",
                contentNodeName: ".results",
                inputId: "#upquery",
            };
            let sogouObj = this;
            this.nextPage = function () {
                sogouObj.config.data.page += 1;
            };
            this.resetPage = function () {
                sogouObj.config.data.page = 1;
            };
            this.getQuery = function() {
                return sogouObj.config.data.query;
            };
            this.updateQuery = function(queryString) {
                sogouObj.config.data.query = queryString;
            };
        };

        this.bing = function() {
            // 类型1是搜索引擎
            this.type = 1;
            this.config = {
                url: "https://cn.bing.com/search",
                data: {
                    q: "",
                    first: 0,
                },
                getOrPost: "GET",
                parentNodeName: "#b_results",
                contentNodeName: ".b_algo",
                inputId: "#sb_form_q",
            };
            let bingObj = this;
            this.nextPage = function () {
                return bingObj.config.data.first += 10;
            };
            this.resetPage = function () {
                bingObj.config.data.first = 0;
            };
            this.getQuery = function() {
                return bingObj.config.data.q;
            };
            this.updateQuery = function(queryString) {
                bingObj.config.data.q = queryString;
            };

            (function() {
                // 隐藏第一页底部的页码
                $(bingObj.config.parentNodeName).children().slice(-3).hide();
            })();
        };

        this.baidu = function() {
            // 类型1是搜索引擎
            this.type = 1;
            this.config = {
                url: "https://www.baidu.com/s",
                data: {
                    ie: "utf-8",
                    wd: "",
                    pn: 0,
                },
                getOrPost: "GET",
                parentNodeName: "#content_left",
                contentNodeName: ".result",
                inputId: "#kw",
            };
            let baiduObj = this;
            this.nextPage = function () {
                baiduObj.config.data.pn += 10;
            };
            this.resetPage = function () {
                baiduObj.config.data.pn = 0;
            };
            this.getQuery = function() {
                return baiduObj.config.data.wd;
            };
            this.updateQuery = function(queryString) {
                baiduObj.config.data.wd = queryString;
            };

            (function() {
                // 页面中点击搜索按钮，重置页码
                $("#su").click(function() {
                    baiduObj.resetPage();
                });
            })();
        };

        this.so360 = function() {
            // 类型1是搜索引擎
            this.type = 1;
            this.config = {
                url: "https://www.so.com/s",
                data: {
                    q: "",
                    pn: 1,
                },
                getOrPost: "GET",
                parentNodeName: "#main > .result",
                contentNodeName: ".res-list",
                inputId: "#keyword",
            };
            let so360Obj = this;
            this.nextPage = function () {
                so360Obj.config.data.pn += 1;
            };
            this.resetPage = function () {
                so360Obj.config.data.pn = 1;
            };
            this.getQuery = function() {
                return so360Obj.config.data.q;
            };
            this.updateQuery = function(queryString) {
                so360Obj.config.data.q = queryString;
            };
        };

        // 根据网址返回对应的配置类
        // return new this.bing();
        let configObj = this;
        return (function() {
            let host = window.location.host;
            let reg = /\.[a-z|0-9]+\.com/;
            let res = reg.exec(host)[0];
            res = res.substring(1, res.length-4);
            if (res == "sogou") {
                return new configObj.sogou();
            } else if (res == "bing") {
                return new configObj.bing();
            } else if (res == "baidu") {
                return new configObj.baidu();
            } else if (res == "so") {
                return new configObj.so360();
            }
        })();
    };
    var searchEngine = new Config();
    // console.log("ok2");

    /* 加载下一页数据，插入当前页 */
    function PreLoader() {
        let preLoaderObj = this;
        // 预处理
        this.preprocessing = function(searchEngine) {
            // 更新查询字符串，页码
            let queryString = $(searchEngine.config.inputId).val();
            let oldQueryString = searchEngine.getQuery();
            searchEngine.updateQuery(queryString);
            if (oldQueryString == "") {
                searchEngine.nextPage();
            }else if (oldQueryString != queryString) {
                searchEngine.resetPage();
            }
        };
        this.loadNextPage = function(callback) {
            // 调用预处理
            preLoaderObj.preprocessing(searchEngine);

            // ajax请求下一页，并插进当前页中
            $.ajax({
                url: searchEngine.config.url,
                type: searchEngine.config.getOrPost,
                data: searchEngine.config.data,
                success: function(data, status) {
                    let contentNode = $(data).find(searchEngine.config.parentNodeName).find(searchEngine.config.contentNodeName);
                    let $div = $(searchEngine.config.parentNodeName);
                    // 下一页内容插入当前页末尾
                    $div.append(contentNode);
                    // 两页之间添加分割线
                    $div.append(`
                        <div style="height: 20px;"><HR style="FILTER: progid:DXImageTransform.Microsoft.Glow(color=#987cb9,strength=10)" width="100%" color=#987cb9 SIZE=1></div>
                    `);
                    searchEngine.nextPage();

                    // 调用滚动到底部检测
                    callback();
                },
                error: function(e) {
                    if (e.status == 404) {
                        $(searchEngine.config.parentNodeName).append(`<p style="text-align: center; font-size: 18px;">已完</p>`);
                    }
                },
            });
        };
    }
    var preLoader = new PreLoader();
    // console.log("ok3");

    /* 滚动到底部检测，判断是否要插入下一页 */
    (function scrollLoadPage() {
        $(window).unbind("scroll").scroll(function() {
            let scrollTop = $(this).scrollTop();     //获取滚动条到顶部的距离
            let windowHeight = window.screen.height * 1.5;        //获取窗口的高度
            let documentHeight = $(document).height();    //获取文档区域高度

            // console.log(scrollTop, windowHeight, documentHeight);
            if (scrollTop + windowHeight >= documentHeight) {
                $(this).unbind("scroll");
                preLoader.loadNextPage(scrollLoadPage);
            }
        });
    })();
})();