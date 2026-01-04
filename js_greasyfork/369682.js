// ==UserScript==
// @name         [skypesky 出品] 影音下载助手,支持豆瓣,网易云等主流平台
// @namespace    http://www.skypesky.cn/userjs/search_subtitle_for_douban
// @version      19.02.18
// @description  目前只支持电影下载,音乐下载,后续会加入更多功能
// @author       skypesky
// @include      http*://movie.douban.com/subject/*
// @include      http*://music.163.com/*
// @include      http*://www.kugou.com/song/*
// @include      http*://y.qq.com/n/yqq/song/*
// @include      http*://www.kuwo.cn/yinyue/*
// @include      http*://www.ximalaya.com/ertong/*
// @grant        GM_xmlhttpRequest

// ==========================connect===========================
// @connect      *
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369682/%5Bskypesky%20%E5%87%BA%E5%93%81%5D%20%E5%BD%B1%E9%9F%B3%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%2C%E6%94%AF%E6%8C%81%E8%B1%86%E7%93%A3%2C%E7%BD%91%E6%98%93%E4%BA%91%E7%AD%89%E4%B8%BB%E6%B5%81%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/369682/%5Bskypesky%20%E5%87%BA%E5%93%81%5D%20%E5%BD%B1%E9%9F%B3%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%2C%E6%94%AF%E6%8C%81%E8%B1%86%E7%93%A3%2C%E7%BD%91%E6%98%93%E4%BA%91%E7%AD%89%E4%B8%BB%E6%B5%81%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

// 全局变量
const config = {
    keyword: `#keyword#`,
    showLength: 5
};

// 资源类型
const resource = {
    type: {
        MUSIC: "music",
        SUBTITLE: "subtitle",
        VIDEO: "video"
    }
};

(function () {

    'use strict';

    // 影片资源
    const videoResourceList = [{
            name: `RS05`,
            description: `RS05`,
            url: `http://www.rs05.com/search.php?s=${config.keyword}`,
            successSelector: `#movielist .pure-g`
        },
        {
            name: `看天堂`,
            description: `看天堂`,
            url: `http://www.kantiantang.com/search?text=${config.keyword}`,
            successSelector: `.col-md-8 .page-header`
        },
        {
            name: `迅影网`,
            description: `迅影网`,
            url: `http://www.xunyingwang.com/search?q=${config.keyword}`,
            successSelector: `.img-thumbnail`
        },
        {
            name: `BD影视`,
            description: `BD影视`,
            url: `http://www.bd-film.co/search.jspx?q=${config.keyword}`,
            successSelector: `.list-item`
        }
    ];

    // 字幕资源
    const subtitleResourceList = [{
        name: `字幕库`,
        url: `https://www.zimuku.cn/search?q=${config.keyword}`,
        description: `字幕库`,
        successSelector: `.tborder2`,
    }];

    // 音乐资源
    const musicResourceList = [{
        name: `全网音乐通用下载工具(根据下载链接)`,
        url: `http://music.sonimei.cn/?url=${config.keyword}`,
        description: `全网音乐通用下载`,
        successSelector: `.am-margin-bottom-sm`
    }];

    // 喜马拉雅FM
    const ximalayaFMMusicResourceList = [{
        name: `喜马拉雅FM专用接口`,
        url: `http://music.sonimei.cn/?name=${config.keyword}&type=ximalaya`,
        description: `全网音乐免费下载(喜马拉雅FM专用接口)`,
        successSelector: `.am-margin-bottom-sm`
    }];


    // 运行在哪个网站?
    const websiteConfigList = [{
            name: `豆瓣电影频道网站`,
            description: `豆瓣网 | 查找电影,电视剧`,
            url: `http*://movie.douban.com/subject/*`,
            rule: /\/\/movie.douban.com\/subject\/*/,
            resourceList: [{
                    title: `视频下载`,
                    type: resource.type.VIDEO,
                    resource: videoResourceList,

                },
                {
                    title: `字幕`,
                    type: resource.type.SUBTITLE,
                    resource: subtitleResourceList
                }
            ],
            keyword: {
                selector: `#content > h1 > span:nth-child(1)`,
                encodeURIComponent: false,
            },
            showView: {
                selector: `.subjectwrap`
            }
        }, {
            name: `网易云音乐`,
            description: `网易云音乐`,
            url: `http*://music.163.com/#/song?id=*`,
            rule: /\/\/music.163.com\/(#\/)?song\?id=/,
            resourceList: [{
                title: `歌曲下载`,
                type: resource.type.MUSIC,
                resource: musicResourceList
            }],
            keyword: {
                selector: `{url}`,
                encodeURIComponent: true,
                replace: true,
                originStr: "m/song",
                nowStr: "m/#/song"
            },
            showView: {
                selector: `div.tit`
            }
        }, {
            name: `酷狗音乐`,
            description: `酷狗音乐`,
            url: `http*://www.kugou.com/song`,
            rule: /\/\/www.kugou.com\/song\//,
            resourceList: [{
                title: `歌曲下载`,
                type: resource.type.MUSIC,
                resource: musicResourceList
            }],
            keyword: {
                selector: `{url}`,
                encodeURIComponent: true,
            },
            showView: {
                selector: `div.songName > a`
            }
        }, {
            name: `qq音乐介绍页`,
            description: `qq音乐介绍页`,
            url: `https://y.qq.com/n/yqq/song/004GvGjF3fNU8S.html`,
            rule: /\/\/y.qq.com\/n\/yqq\/song\//,
            resourceList: [{
                title: `歌曲下载`,
                type: resource.type.MUSIC,
                resource: musicResourceList
            }],
            keyword: {
                selector: `{url}`,
                encodeURIComponent: true,
            },
            showView: {
                selector: `.data__name_txt`
            }
        }, {
            name: `酷我音乐播放页`,
            description: `酷我音乐播放页`,
            url: `http://www.kuwo.cn/yinyue/5253684/`,
            rule: /\/\/www.kuwo.cn\/yinyue\//,
            resourceList: [{
                title: `歌曲下载`,
                type: resource.type.MUSIC,
                resource: musicResourceList
            }],
            keyword: {
                selector: `{url}`,
                encodeURIComponent: true,
            },
            showView: {
                selector: `.goComment`
            }
        },
        //  {
        //     name: `喜马拉雅`,
        //     description: `喜马拉雅`,
        //     url: `https://www.ximalaya.com/ertong/12462850/`,
        //     rule: /\/\/www.ximalaya.com\/ertong\//,
        //     resourceList: [{
        //         title: `歌曲下载`,
        //         type: resource.type.MUSIC,
        //         resource: ximalayaFMMusicResourceList
        //     }],
        //     keyword: {
        //         selector: `.title._t4_`
        //     },
        //     showView: {
        //         selector: `.title._t4_`
        //     }
        // }
    ];


    // 对于resource来说,拿到应有的属性,就可以获得结果,通过回调函数或者返回结果进行下一步处理
    function Resource() {
        // 未替换的搜索链接
        this.originUrl = ``,
            // 搜索资源的关键字
            this.keyword = ``,
            // 资源检索成功的元素的选择器
            this.successSelector = ``,
            // 真实的地址
            this.realUrl = ``
    }

    /**
     ** @desc: 初始化参数
     ** @param: originUrl => 未替换的搜索链接
     **         keyword => 查询的关键字
     **         successSelector => 资源检索成功的元素的选择器
     **
     */
    Resource.prototype.init = function (originUrl, keyword, successSelector) {
        this.originUrl = originUrl;
        this.keyword = keyword;
        this.successSelector = successSelector;
        // 获取真实要访问的地址
        this.getRealUrl();
    };

    /**
     ** @desc: 检测资源是否存在,存在返回true,不存在返回false
     ** @param: selector => 选择器
     **         responseText => 响应的html文本信息
     ** @return: 资源存在返回true,否则否则返回false
     */
    Resource.prototype.exist = function (responseText) {
        return $(this.successSelector, responseText).length > 0;
    };

    /**
     ** @desc: 通过替换字符串,获取真实的查询网址
     ** @param:
     ** @return: 返回真实的查询网址
     */
    Resource.prototype.getRealUrl = function () {
        this.realUrl = this.originUrl.replace(config.keyword, this.keyword);
        return this.realUrl;
    }

    /**
     ** @desc: 检索资源,检索成功返回真实链接,检索失败返回null
     ** @param: callback => 回调函数的地址引用
     ** @return:
     */
    Resource.prototype.search = function (callback) {
        GM_xmlhttpRequest({
            method: `GET`,
            url: this.realUrl,
            data: {
                title: this.keyword
            },
            onload: (result) => {
                // 回调函数
                callback(result, this.exist(result.responseText));
            }
        });
    }


    const ServerController = {
        _websiteConfig: null,
        _keyword: ``,
        // 初始化配置
        init: function (websiteConfig) {
            this.websiteConfig = websiteConfig;
            // 要查询的关键字
            this.getKeyword();
        },
        // 运行
        run: function () {
            this.search();
        },
        // 获取查询结果
        search: function () {
            // 查询成功后的资源列表
            let successResourceList = [];
            // 已查询的数目
            let searchedNumber = 0;
            // 总共需要查询的数目
            let totalNeedSearchNumber = 0;
            //单个资源的查询结果
            let object = {
                type: ``,
                title: ``,
                resourceList: ``
            }

            // 查询
            for (let i = 0; i < this.websiteConfig.resourceList.length; ++i) {
                // 存放单个结果
                successResourceList[i] = {
                    title: this.websiteConfig.resourceList[i].title,
                    type: this.websiteConfig.resourceList[i].type,
                    resourceList: []
                }
                // 统计总共需要查询的数目
                totalNeedSearchNumber += this.websiteConfig.resourceList[i].resource.length;
                for (let j = 0; j < this.websiteConfig.resourceList[i].resource.length; ++j) {
                    let resource = new Resource();
                    // 初始化资源属性
                    resource.init(this.websiteConfig.resourceList[i].resource[j].url, this.keyword, this.websiteConfig.resourceList[i].resource[j].successSelector);
                    // 查询
                    resource.search((result, flag) => {
                        searchedNumber++;
                        if (flag) { //查询成功
                            console.log("search success!");
                            successResourceList[i].resourceList.push({
                                description: this.websiteConfig.resourceList[i].resource[j].description,
                                link: resource.getRealUrl()
                            });
                        }
                    });
                }

            }

            // 检测查询是否全部完成
            let task = setInterval(() => {
                if (searchedNumber == totalNeedSearchNumber && searchedNumber != 0) { // 已查询的条目等于总的总共需要查询的条目,说明查询任务结束了
                    // 全部查询完成,显示查询结果,关闭定时器
                    this.showView(successResourceList);
                    clearInterval(task);
                }
            }, 100);
        },
        // 获取要查询的关键字
        getKeyword: function () {
            if (this.websiteConfig.keyword.selector == `{url}`) {
                this.keyword = window.location.href;
            } else {
                this.keyword = $(this.websiteConfig.keyword.selector).text().split(` `)[0];
            }
            this.checkReplace();
            console.log("keyword: ", this.keyword, this.websiteConfig.keyword.replace);
            this.checkEncodeURIComponent();
            return this.keyword;
        },
        checkReplace: function () {
            if (this.websiteConfig.keyword.replace) {
                console.log("checkReplace()");
                this.keyword = this.keyword.replace(this.websiteConfig.keyword.originStr, this.websiteConfig.keyword.nowStr);
            }
        },
        checkEncodeURIComponent: function () {
            if (this.websiteConfig.keyword.encodeURIComponent) {
                this.keyword = encodeURIComponent(this.keyword);
            }
        },
        showView: function (successResourceList) {
            let view = null;
            for (let i = 0; i < successResourceList.length; ++i) {
                switch (successResourceList[i].type) {
                    case resource.type.VIDEO:
                        {
                            view = ViewTemplate.defaultVideoView(successResourceList[i].title, successResourceList[i].resourceList);
                        }
                        break;
                    case resource.type.SUBTITLE:
                        {
                            view = ViewTemplate.defaultVideoView(successResourceList[i].title, successResourceList[i].resourceList);
                        }
                        break;
                    case resource.type.MUSIC:
                        {
                            view = ViewTemplate.defaultDownloadView(successResourceList[i].title, successResourceList[i].resourceList);
                        }
                        break;
                    default:
                        break;
                }
                this.after(view);
            }
        },
        after: function (view) {
            $.runWhenLoad(this.websiteConfig.showView.selector, () => {
                $(this.websiteConfig.showView.selector).after(view);
            });
        }
    }

    const ViewTemplate = {
        defaultVideoView: function (title, data) {
            if (!data || data.length <= 0) {
                return this.videoEmptyView(title);
            }
            let table = ``;
            table += `<table style='text-align: center; padding: 14px; width: 100%;border: 2px solid #ddd; margin: 20px auto;'>`;
            table += `<caption style="text-align: center; padding-bottom: 4px;">${title}</caption>`
            for (let i = 0; i < data.length; i = i + config.showLength) {
                table += `<tr>`;
                for (let j = i; j < i + config.showLength && data[j]; ++j) {
                    table += `<td style="padding-top: 10px; padding-bottom: 10px;"><a href='${data[j].link}' target='_blank'>${data[j].description}</td>`;
                }
                table += `</tr>`;
            }
            table += `</table>`;
            return table;
        },
        videoEmptyView: function (title) {
            let table = ``;
            table += `<table style='text-align: center; padding: 14px; width: 100%;border: 2px solid #ddd; margin: 20px auto;'>`;
            table += `<caption style="text-align: center; padding-bottom: 4px;">${title}</caption>`
            table += `<tr>`;

            table += `<td style="padding-top: 10px; padding-bottom: 10px;"><a href='javascript: void(0)' target='_blank'>暂无相关资源</td>`;

            table += `</tr>`;
            table += `</table>`;
            return table;
        },
        defaultDownloadView: function (title, data) {
            let view = "";
            for (let i = 0; i < data.length; ++i) {
                view += `<button style="margin-left: 12px; padding: 6px 12px; background-color: #fff; border: 1px solid #ccc; background-color: rgb(74, 170, 74); color: #fff;" onclick="window.open('${data[i].link}')">${data[i].description}</button>`;
            }
            return view;
        }
    }

    // 选择执行的控制器
    const Controller = {
        // 匹配网站
        select: function (configList, keyword) {
            for (let i = 0; i < configList.length; ++i) {
                if (configList[i].rule.test(keyword)) {
                    return i;
                }
            }
            return -1;
        },
        // 匹配执行的控制器
        run: function (websiteConfigList) {
            let url = window.location.href;
            let index = this.select(websiteConfigList, url);
            if (index != -1) { //匹配成功
                console.log("匹配成功! " + websiteConfigList[index].description, url);
                ServerController.init(websiteConfigList[index]);
                ServerController.run();
                JqueryPlugin.loading();
            } else { //匹配失败
                console.log("匹配失败!", url);
            }
        }
    }

    // jquery拓展
    const JqueryPlugin = {
        loading: function () {
            this.runWhenLoad();
        },
        runWhenLoad: function () {
            $.extend({
                runWhenLoad: function (selector, callback) {
                    if ($(selector).length > 0) {
                        console.log("x1 success");
                        callback();
                        return;
                    }
                    let task = setInterval(() => {
                        console.log("x2 block");
                        if ($(selector).length > 0) {
                            console.log("x2 success");
                            clearInterval(task);
                            callback();
                            return;
                        }
                    }, 50);
                }
            });
        }
    }

    $(function () {
        console.log("loading...");
        Controller.run(websiteConfigList);
    });

})();