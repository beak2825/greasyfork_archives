// ==UserScript==
// @name         网页数据统计
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  根据需要配置每个网页的数据，将网页数据解析为数组，做一些基础判断，执行一些js代码，如点击某个元素，然后做一个统计分析，并可以下载数据到表格。
// @author       kinrt
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/439062/%E7%BD%91%E9%A1%B5%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/439062/%E7%BD%91%E9%A1%B5%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

// 更新说明：
//  1.每一个列定义eval参数，可以直接一段代码。例如使用："eval" : "data.slice(5)" 截取获取值的一部分；"eval" : "data.split('销售转换率').pop()" 将获取值字符串拆分为数组，返回其中一个元素。
//  2.每一个行定义eval参数，可以直接一段代码。例如使用：判断推广的ROI小于3，自动选中推广的关键词，方便执行删除，降价等操作。
//  3.将数据存储到全局变量，多个网页的数据都能保存到一起，可以统一下载，关闭网页数据不删除，再次开启网页继续统计，关闭浏览器清除所有数据。
//  4.自定义document对象，方便操作iframe的元素，例如："document": "window.frames['iframe'].contentDocument"。
//  5.精简代码，方便修改阅读。



var setting = {};
setting["淘宝搜索"] = {
    "trigger":"newUrl",  // 统计触发方式
    "oldData":false,   // 是否有旧的数据，如滚动加载的信息流，网页包含已经统计的旧数据。
    "url" : "https://s.taobao.com/search",   // 统计数据的网页地址
    "itemCss" : "div.item.J_MouserOnverReq",   // 要统计数据的单项CSS选择器
    "itemNum" : 12,   // 要统计数据的最小数量   // 是否输出每一个列的日志
    "dataCol" : [
        {
            "name" : "搜索词" ,   // 列名称
            "cssSelector" : "#q",   // CSS选择器
            "getValue" : "value",   // 获取CSS选择器的什么值
        },
        {
            "name" : "搜索排序",
            "cssSelector" : "#mainsrp-sortbar li.sort > a.J_Ajax.link.active",
        },
        {
            "name" : "页码",
            "cssSelector" : "#mainsrp-pager li.item.active > span",
            "type" : "num",  // 值类型，num是数字会自动转化，默认是字符串
        },
        {
            "name" : "排名",
            "eval" : "index + 1",  // 自动计算值，index表示当前数据行索引，从0开始。
            "type" : "num",
            "item" : true,  // 表示是一个单项，需要现在进入到itemCss选择器对象后，再统计这一个项的值，如果淘宝搜索结果的每一个宝贝，而搜索词是不变的就不是单项。
        },
        {
            "name" : "宝贝ID",
            "cssSelector" : "a.J_ClickStat",
            "getValue" : "data-nid",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "标题",
            "cssSelector" : "img.J_ItemPic.img",
            "getValue" : "alt",
            "item" : true
        },
        {
            "name" : "店铺",
            "cssSelector" : "div.shop",
            "item" : true
        },
        {
            "name" : "店铺链接",
            "cssSelector" : "div.shop>a",
            "getValue" : "href",
            "item" : true
        },
        {
            "name" : "地区",
            "cssSelector" : "div.location",
            "item" : true
        },
        {
            "name" : "价格",
            "cssSelector" : "div.price.g_price.g_price-highlight > strong",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],  // 列数据日志输出统计值，参考代码中的 Analysis 类
            "item" : true
        },
        {
            "name" : "销量",
            "cssSelector" : "div.deal-cnt",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile","sum"],
            "item" : true
        },
        {
            "name" : "销售额",
            "eval" : "globalData['价格'][globalData['价格'].length-1] * globalData['销量'][globalData['销量'].length-1]",  // 列数据data = eval(此处配置的值);，可以和cssSelector一起使用。
            "type" : "num",
            "logPrint" : ["mean","stddev","sum"],
            "item" : true
        },
        {
            "name" : "标签",
            "cssSelectors" : "ul.icons > li span",  // 多个值CSS选择器 每项之间用"&&"链接 和 cssSelector不同
            "getValue" : "class",
            "item" : true
        },
    ]
};
setting["直通车-转化解读报告-潜力关键词"] = {
    "trigger":"newData",
    "oldData":false,
    "url" : "PromotionReport/batchtest-report/index",
    "itemCss" : "table[id^='brix_brick_']>tbody>tr",
    "itemNum" : 3,
    "dataCol" : [
        {
            "name" : "时间" ,
            "cssSelector" : "span[bx-tmpl='datepicker']",
        },
        {
            "name" : "计划" ,
            "cssSelector" : "span.dropdown-text",
        },
        {
            "name" : "排名" ,
            "cssSelector" : "div#J_magix_vf_main_adgroup_detail li.selected > p > span:nth-child(1)",
        },
        {
            "name" : "潜力指数",
            "cssSelector" : "div#J_magix_vf_main_adgroup_detail li.selected > p > span:nth-child(2)",
        },
        {
            "name" : "宝贝名称",
            "cssSelector" : "div#J_magix_vf_main_adgroup_detail li.selected div.item-info span",
        },
        {"name" : "选择框" ,
            "cssSelector" : "td:nth-child(1) input",
            "item" : true,
            "hide": true   // 辅助列，日志输出不显示，下载CSV数据无数据
        },
        {
            "name" : "类型" ,
            "cssSelector" : "td:nth-child(2) span",
            "item" : true
        },
        {"name" : "关键词" ,
            "cssSelector" : "td:nth-child(2) a",
            "item" : true
        },
        {
            "name" : "展现量",
            "cssSelector" : "td:nth-child(3)",
            "logPrint" : ["sum"],
            "type" : "num",
            "item" : true
        },
        {
            "name" : "点击量",
            "cssSelector" : "td:nth-child(4)",
            "logPrint" : ["sum"],
            "type" : "num",
            "item" : true
        },
        {
            "name" : "点击率",
            "cssSelector" : "td:nth-child(5)",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "平均点击花费",
            "cssSelector" : "td:nth-child(6)",
            "logPrint" : ["sum"],
            "type" : "num",
            "item" : true
        },
        {
            "name" : "总花费",
            "cssSelector" : "td:nth-child(7)",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "收藏宝贝数",
            "cssSelector" : "td:nth-child(8)",
            "logPrint" : ["sum"],
            "type" : "num",
            "item" : true
        },
        {
            "name" : "总购物车数",
            "cssSelector" : "td:nth-child(9)",
            "logPrint" : ["sum"],
            "type" : "num",
            "item" : true
        },
        {
            "name" : "点击转化率",
            "cssSelector" : "td:nth-child(10)",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "收藏加购率",
            "cssSelector" : "td:nth-child(11)",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "投入产出比",
            "cssSelector" : "td:nth-child(12)",
            "type" : "num",
            "item" : true
        },
    ],
    // 统计每行数据时使用eval函数运行一次此处配置的值
    "eval" : "if(' 金丝手串 麻梨疙瘩手串 盘手串 沉香木手串 手串男紫檀木沉香 桃木手串 麻梨手串 手串配珠 蜜蜡手串 沉香手串 大红酸枝手串 红豆杉手串 核桃手串 手串蜜蜡 鹿角手串 血龙木手串 黑花梨手串 枣木手串 '.indexOf(' ' + settingData.dataCol[7].data[settingData.dataCol[7].data.length-1] + ' ') != -1 ){parentElement.querySelector(settingData.dataCol[5].cssSelector).click();}"
};
setting["淘宝店铺搜索"] = {
    "trigger":"newData",
    "oldData":false,
    "url" : ".tmall.com/search.htm?",
    "itemCss" : "div.J_TItems dl.item",
    "itemNum" : 12,
    "dataCol" : [
        {
            "name" : "搜索词" ,
            "cssSelector" : "input.crumbSearch-input.J_TCrumbSearchInuput",
            "getValue" : "value",
        },
        {
            "name" : "搜索排序",
            "cssSelector" : "a.fSort.fSort-cur",
        },
        {
            "name" : "页码",
            "cssSelector" : "a.page-cur",
            "type" : "num",
        },
        {
            "name" : "排名",
            "eval" : "index + 1",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "标题",
            "cssSelector" : "a.item-name.J_TGoldData",
            "item" : true
        },
        {
            "name" : "主图",
            "cssSelector" : "dt.photo img",
            "getValue" : "src",
            "item" : true
        },
        {
            "name" : "价格",
            "cssSelector" : "span.c-price",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "总销量",
            "cssSelector" : "span.sale-num",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile","sum"],
            "item" : true
        },
        {
            "name" : "评价",
            "cssSelector" : "dd.rates span",
            "eval" : "data.slice(3)",
            "item" : true,            
        },
        {
            "name" : "宝贝ID",
            "cssSelector" : "a.item-name.J_TGoldData",
            "getValue" : "atpanel",
            "item" : true
        },
    ]
};
setting["聚划算搜索"] = {
    "trigger":"newData",
    "oldData":false,
    "url" : "https://ju.taobao.com/search.htm",
    "itemCss" : "#content li",
    "itemNum" : 20,
    "dataCol" : [
        {
            "name" : "搜索词" ,
            "cssSelector" : "input.J_inputseek",
            "getValue" : "value",
        },
        {
            "name" : "页码",
            "cssSelector" : "div.list-page.J_HomePager em",
            "type" : "num",
        },
        {
            "name" : "排名",
            "eval" : "index + 1",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "链接",
            "cssSelector" : "div.status-avil > a",
            "getValue" : "href",
            "item" : true
        },
        {
            "name" : "标题",
            "cssSelector" : "div.status-avil > a > h3",
            "getValue" : "title",
            "item" : true
        },
        {
            "name" : "卖点",
            "cssSelector" : "div.status-avil > a > h4 > span",
            "item" : true
        },
        {
            "name" : "促销卖点",
            "cssSelector" : "div.status-avil > a > h3 > span",
            "item" : true
        },
        {
            "name" : "价格",
            "cssSelector" : "div.item-info em.J_actPrice > span",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "原价",
            "cssSelector" : "div.item-info del.orig-price",
            "type" : "num",
            "logPrint" : [],
            "item" : true
        },
        {
            "name" : "销量",
            "cssSelector" : "div.item-info div.sold-num > em",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "销售额",
            "eval" : "globalData['价格'][globalData['价格'].length-1] * globalData['销量'][globalData['销量'].length-1]",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
    ]
};
setting["京东搜索"] = {
    "trigger":"itemNum",
    "oldData":false,
    "url" : "https://search.jd.com/Search",
    "itemCss" : "#J_goodsList li.gl-item",
    "itemNum" : 31,
    "dataCol" : [
        {
            "name" : "搜索词" ,
            "cssSelector" : "#key",
            "getValue" : "value",
        },
        {
            "name" : "搜索排序",
            "cssSelector" : "#J_filter div.f-sort > a.curr",
        },
        {
            "name" : "页码",
            "cssSelector" : "#J_bottomPage > span > a.curr",
            "type" : "num",
        },
        {
            "name" : "排名",
            "eval" : "index + 1",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "链接",
            "cssSelector" : "div.p-img > a",
            "getValue" : "href",
            "item" : true
        },
        {
            "name" : "标题",
            "cssSelector" : "div.p-name > a > em",
            "item" : true
        },
        {
            "name" : "促销标题",
            "cssSelector" : "div.p-img > a",
            "getValue" : "title",
            "item" : true
        },
        {
            "name" : "店铺",
            "cssSelector" : "div.p-shop > span > a",
            "item" : true
        },
        {
            "name" : "价格",
            "cssSelector" : "div.p-price > strong > i",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "评价",
            "cssSelector" : "div.p-commit > strong > a",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "标签",
            "cssSelector" : "div.p-icons > i",
            "type" : "text",
            "logPrint" : [],
            "item" : true
        },
    ]
};
setting["多多情报通-商品TOP榜"] = {
    "trigger":"newData",
    "oldData":false,
    "url" : "https://ddcm.mobduos.com/?menuId=18d8042386b79e2c279fd162df0205c8",
    "itemCss" : "#basic-justified-tab1 tbody tr[role=row]",
    "itemNum" : 80,
    "dataCol" : [
        {
            "name" : "当前路径" ,
            "cssSelectors" : "ul.breadcrumb.breadcrumb-caret a",
        },
        {
            "name" : "时间",
            "cssSelector" : "div.tabbable li.active > a",
        },
        {
            "name" : "排名",
            "cssSelector" : "td:nth-child(1)",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "商品ID",
            "cssSelector" : "td:nth-child(2)",
            "getValue" : "id",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "商品名称",
            "cssSelector" : "td:nth-child(2) a",
            "item" : true
        },
        {
            "name" : "近一天销量",
            "cssSelector" : "td:nth-child(4) span",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "近一周销量",
            "cssSelector" : "td:nth-child(5) span",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "近一月销量",
            "cssSelector" : "td:nth-child(6) span",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "团购价",
            "cssSelector" : "td:nth-child(7) span",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "上榜天数",
            "cssSelector" : "td:nth-child(8) span",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
    ]
};
setting["快手直播-主播作品"] = {
    "trigger":"itemNum",
    "oldData":true,
    "url" : "https://live.kuaishou.com/profile/",
    "itemCss" : "li.feed-list-item > div.work-card",
    "itemNum" : 3,
    "dataCol" : [
        {
            "name" : "用户名" ,
            "cssSelector" : "p.user-info-name",
        },
        {
            "name" : "用户信息",
            "cssSelector" : "p.user-info-other",
        },
        {
            "name" : "粉丝数",
            "cssSelector" : "div.user-data-item.fans",
            "type" : "num",
        },
        {
            "name" : "作品数",
            "cssSelector" : "div.user-data-item.work",
            "type" : "num",
        },
        {
            "name" : "作品介绍",
            "cssSelector" : "div.work-card-info > p.work-card-info-title",
            "item" : true
        },
        {
            "name" : "封面图片",
            "cssSelector" : "div.work-card-thumbnail.ready > img",
            "getValue" : "src",
            "item" : true
        },
        {
            "name" : "播放量",
            "cssSelector" : "div.work-card-info > p > span.work-card-info-data-play",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "点赞数",
            "cssSelector" : "div.work-card-info > p > span.work-card-info-data-like",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        },
        {
            "name" : "评论数",
            "cssSelector" : "div.work-card-info > p > span.work-card-info-data-comment",
            "type" : "num",
            "logPrint" : ["mean","stddev","quartile"],
            "item" : true
        }
    ]
};
setting["直通车-转化解读报告-潜力关键词"] = {
    "trigger":"newData",
    "oldData":false,
    "url" : "PromotionReport/batchtest-report/index",
    "itemCss" : "table[id^='brix_brick_']>tbody>tr",
    "itemNum" : 3,
    "dataCol" : [
        {
            "name" : "时间" ,
            "cssSelector" : "span[bx-tmpl='datepicker']",
        },
        {
            "name" : "计划" ,
            "cssSelector" : "span.dropdown-text",
        },
        {
            "name" : "排名" ,
            "cssSelector" : "div#J_magix_vf_main_adgroup_detail li.selected > p > span:nth-child(1)",
        },
        {
            "name" : "潜力指数",
            "cssSelector" : "div#J_magix_vf_main_adgroup_detail li.selected > p > span:nth-child(2)",
        },
        {
            "name" : "宝贝名称",
            "cssSelector" : "div#J_magix_vf_main_adgroup_detail li.selected div.item-info span",
        },
        {
            "name" : "类型" ,
            "cssSelector" : "td:nth-child(2) span",
            "item" : true
        },
        {"name" : "关键词" ,
            "cssSelector" : "td:nth-child(2) a",
            "item" : true
        },
        {
            "name" : "展现量",
            "cssSelector" : "td:nth-child(3)",
            "logPrint" : ["sum"],
            "type" : "num",
            "item" : true
        },
        {
            "name" : "点击量",
            "cssSelector" : "td:nth-child(4)",
            "logPrint" : ["sum"],
            "type" : "num",
            "item" : true
        },
        {
            "name" : "点击率",
            "cssSelector" : "td:nth-child(5)",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "平均点击花费",
            "cssSelector" : "td:nth-child(6)",
            "logPrint" : ["sum"],
            "type" : "num",
            "item" : true
        },
        {
            "name" : "总花费",
            "cssSelector" : "td:nth-child(7)",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "收藏宝贝数",
            "cssSelector" : "td:nth-child(8)",
            "logPrint" : ["sum"],
            "type" : "num",
            "item" : true
        },
        {
            "name" : "总购物车数",
            "cssSelector" : "td:nth-child(9)",
            "logPrint" : ["sum"],
            "type" : "num",
            "item" : true
        },
        {
            "name" : "点击转化率",
            "cssSelector" : "td:nth-child(10)",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "收藏加购率",
            "cssSelector" : "td:nth-child(11)",
            "type" : "num",
            "item" : true
        },
        {
            "name" : "投入产出比",
            "cssSelector" : "td:nth-child(12)",
            "type" : "num",
            "item" : true
        },

    ]
};
setting["淘宝问大家-邀请我的"] = {
    "trigger":"itemNum",
    "oldData":true,
    "url" : "wendajia/my.htm",
    "itemCss" : "div#cid > div.iv-box",
    "itemNum" : 3,
    "dataCol" : [
        {
            "name" : "提问者" ,
            "cssSelector" : "span.nick",
            "item" : true
        },
        {
            "name" : "产品图片",
            "cssSelector" : "div.bg-img",
            "getValue" : "style",
            "item" : true
        },
        {
            "name" : "问题",
            "cssSelector" : "div.iv-quest",
            "logPrint" : ["count"],
            "item" : true
        },
    ]
};
setting["抖音视频管理"] = {
    "trigger":"itemNum",
    "oldData":true,
    "url" : "https://creator.douyin.com/content/manage",
    "itemCss" : "div.video-card--1404D",
    "itemNum" : 2,
    "dataCol" : [
        {
            "name" : "UP主" ,
            "cssSelector" : "div.avatar-text--3In10",
        },
        {
            "name" : "获赞" ,
            "cssSelector" : "div.user-figure-item--3hGhF:nth-child(1) > div.figure--s8jnz",
            "type" : "num",
        },
        {
            "name" : "关注" ,
            "cssSelector" : "div.user-figure-item--3hGhF:nth-child(2) > div.figure--s8jnz",
            "type" : "num",
        },
        {
            "name" : "粉丝" ,
            "cssSelector" : "div.user-figure-item--3hGhF:nth-child(3) > div.figure--s8jnz",
            "type" : "num",
        },
        {
            "name" : "描述",
            "cssSelector" : "div.info-title-text.info-title-small-desc",
            "item" : true
        },
        {
            "name" : "播放",
            "cssSelector" : "div.info-figure--2LJ6W:nth-child(1) > span",
            "type" : "num",
            "logPrint" : ["mean","stddev","sum"],
            "item" : true
        },
        {
            "name" : "评论",
            "cssSelector" : "div.info-figure--2LJ6W:nth-child(2) > span",
            "type" : "num",
            "logPrint" : ["mean","stddev","sum"],
            "item" : true
        },
        {
            "name" : "点赞",
            "cssSelector" : "div.info-figure--2LJ6W:nth-child(3) > span",
            "type" : "num",
            "logPrint" : ["mean","stddev","sum"],
            "item" : true
        },
        {
            "name" : "发布时间",
            "cssSelector" : "div.info-time--1PtPa",
            "type" : "time",
            "item" : true
        },
        {
            "name" : "数据更新时间",
            "eval" : "new Date().Format('yyyy/MM/dd hh:mm:ss')",
            "item" : true
        }
    ]
};
setting["生意参谋-内容效果-单条分析"] = {
    "trigger":"newData",
    "oldData":false,
    "url" : "https://sycm.taobao.com/xsite/contentanalysis/content_effect?contentTypeId=1000",
    "itemCss" : "div.ant-table-body tr.ant-table-row",
    "itemNum" : 2,
    "dataCol" : [
        {
            "name" : "页码" ,
            "cssSelector" : "ul.ant-pagination.oui-pagination > li.ant-pagination-item-active",
        },
        {
            "name" : "排名" ,
            "cssSelector" : "td:nth-child(1)",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "内容标题" ,
            "cssSelector" : "td:nth-child(2)",
            "item" : true,
        },
        {
            "name" : "发布时间" ,
            "cssSelector" : "td:nth-child(3)",
            "item" : true,
            "type" : "time",
        },
        {
            "name" : "内容浏览次数" ,
            "cssSelector" : "td:nth-child(4)",
            "logPrint" : ["mean","stddev","sum"],
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "内容互动次数" ,
            "cssSelector" : "td:nth-child(5)",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "引导进店次数" ,
            "cssSelector" : "td:nth-child(6)",
            "logPrint" : ["mean","stddev","sum"],
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "引导支付金额" ,
            "cssSelector" : "td:nth-child(7)",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "新增粉丝数" ,
            "cssSelector" : "td:nth-child(8)",
            "item" : true,
            "type" : "num",
        },
    ]
};
setting["淘宝-素材中心-我的视频"] =  {
    "trigger":"newData",
    "oldData":false,
    "url" : "https://ugc.taobao.com/video/videoxman.htm",
    "itemCss" : "div.next-row.VideoListItem--itemRow--3laQ6rO",
    "itemNum" : 2,
    "dataCol" : [
        {
            "name" : "页码" ,
            "cssSelector" : "button.next-btn.next-medium.next-btn-normal.next-pagination-item.next-current > span",
        },
        {
            "name" : "视频ID" ,
            "cssSelector" : "div[class|=VideoListItem--videoNameId] > div:nth-child(2) > span",
            "item" : true,
            "eval" : "data.slice(3)",
        },
        {
            "name" : "视频名称" ,
            "cssSelector" : "div[class|=VideoListItem--title]",
            "item" : true,
        },
        {
            "name" : "视频时长" ,
            "cssSelector" : "div[class|=VideoListItem--duration]",
            "item" : true,
        },
        {
            "name" : "发布时间" ,
            "cssSelector" : "span[class|=VideoListItem--header]",
            "item" : true,
            "type" : "time",
        },
        {
            "name" : "发布结果" ,
            "cssSelector" : "span[class|=AuditState--text]",
            "item" : true,
        },
        {
            "name" : "流量奖励" ,
            "cssSelector" : "p[class|=AuditState--descLine] > span",
            "item" : true,
        }
    ]
};
setting["飞瓜数据-电商分析-商品搜索"] = {
    "trigger":"itemNum",
    "oldData":true,
    "url" : "https://dy.feigua.cn/Member#/Promotion/Search",
    "itemCss" : "#js-promotion-list tr",
    "itemNum" : 5,
    "dataCol" : [
        {
            "name" : "搜索词" ,
            "cssSelector" : "input#keyword",
            "getValue" : "value",
        },
        {
            "name" : "排序方式" ,
            "cssSelector" : "#btnSort > button.btn.btn-default.active",
        },
        {
            "name" : "商品名称" ,
            "cssSelector" : "td:nth-child(1) div.item-inner a",
            "item" : true,
        },
        {
            "name" : "商品链接" ,
            "cssSelector" : "td:nth-child(1) div.item-inner a",
            "item" : true,
            "getValue" : "href",
        },
        {
            "name" : "售价" ,
            "cssSelector" : "td:nth-child(1) div.item-inner span.price",
            "logPrint" : ["mean","stddev","quartile","sum"],
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "原价" ,
            "cssSelector" : "td:nth-child(1) div.item-inner span.original-price",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "昨日抖音浏览量" ,
            "cssSelector" : "td:nth-child(2)",
            "logPrint" : ["mean","stddev","quartile","sum"],
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "昨日抖音销量" ,
            "cssSelector" : "td:nth-child(3)",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "昨日转化率" ,
            "cssSelector" : "td:nth-child(4)",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "近30日抖音浏览量" ,
            "cssSelector" : "td:nth-child(5)",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "近30日销量" ,
            "cssSelector" : "td:nth-child(6)",
            "logPrint" : ["mean","stddev","quartile","sum"],
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "关联视频" ,
            "cssSelector" : "td:nth-child(7)",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "佣金比例" ,
            "cssSelector" : "td:nth-child(8)",
            "item" : true,
            "type" : "num",
        }
    ]
};
setting["逛逛光合-我的作品"] =  {
    "trigger":"newData",
    "oldData":false,
    "url" : "https://creator.guanghe.taobao.com/",
    "itemCss" : ".ant-table-tbody tr",
    "itemNum" : 2,
    "colLog" : false,
    "dataCol" : [
        {
            "name" : "页码",
            "cssSelector" : "ul.ant-pagination li.ant-pagination-item-active",
        },
        {
            "name" : "数据更新时间",
            "eval" : "new Date().Format('yyyy/MM/dd hh:mm:ss')",
            "item" : true
        },
        {
            "name" : "ID" ,
            "cssSelector" : "div.ant-row.tableComment > div:nth-child(2) > div:nth-child(2)",
            "eval" : "data.split(' | ')[0]",
            "item" : true
        },
        {
            "name" : "发布时间" ,
            "cssSelector" : "div.ant-row.tableComment > div:nth-child(2) > div:nth-child(2)",
            "eval" : "data.split(' | ')[1]",
            "item" : true
        },
        {
            "name" : "介绍" ,
            "cssSelector" : "div.ant-row.tableComment div:nth-child(2) a div",
            "item" : true
        },
        {
            "name" : "浏览" ,
            "cssSelector" : "div.ant-row.tableComment div:nth-child(2) div:nth-child(3)",
            "eval" : "data.split(' ')[1]",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "点赞" ,
            "cssSelector" : "div.ant-row.tableComment div:nth-child(2) div:nth-child(3)",
            "eval" : "data.split(' ')[3]",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "收藏" ,
            "cssSelector" : "div.ant-row.tableComment div:nth-child(2) div:nth-child(3)",
            "eval" : "data.split(' ')[5]",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "评论" ,
            "cssSelector" : "div.ant-row.tableComment div:nth-child(2) div:nth-child(3)",
            "eval" : "data.split(' ')[7]",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "视频时长或图片数量" ,
            "cssSelector" : "div.ant-row.tableComment div.ant-col > div",
            "item" : true,
        },
    ]
};
setting["抖店-评价管理"] = {
    "trigger":"newData",
    "oldData":false,
    "url" : "https://fxg.jinritemai.com/index.html#/ffa/g/comment",
    // "document": "window.frames['iframe'].contentDocument",  // 自定义document变量，适合iframe网页
    "itemCss" : "tbody.ant-table-tbody > tr",
    "itemNum" : 1,
    "colLog" : true,
    "dataCol" : [
        {
            "name" : "页码" ,
            "cssSelector" : "ul.ant-pagination > li.ant-pagination-item-active > a",
        },
        {
            "name" : "商品编号" ,
            "cssSelector" : "td:nth-child(2) div.style_productId__3sFks",
            "item" : true,
            "eval" : "data.slice(3)",
            "type" : "num",
        },
        {
            "name" : "商品名称" ,
            "cssSelector" : "td:nth-child(2) div.style_productName__bDrNQ.sp-tooltip",
            "item" : true,
        },
        {
            "name" : "评价等级" ,
            "cssSelector" : "td:nth-child(1) div.spiderman-tag_content",
            "item" : true,
        },
        {
            "name" : "用户名" ,
            "cssSelector" : "td:nth-child(1) div.style_userName__3GkQ_",
            "item" : true,
        },
        {
            "name" : "评价时间" ,
            "cssSelector" : "td:nth-child(1) div.style_userInfo__1RrFw > div:nth-child(3)",
            "item" : true,
            "type" : "time",
        },
        {
            "name" : "评论内容" ,
            "cssSelector" : "td:nth-child(1) div.style_commentContent__1fRrC.style_omitContent__Vk2yJ",
            "item" : true,
        }
    ]
};
setting["飞瓜数据-主播搜索-直播详情"] =  {
    "trigger":"newData",
    "oldData":false,
    "url" : "https://dy.feigua.cn/Member#/LiveDetail",
    "itemCss" : "div.module-details",
    "itemNum" : 0,
    "colLog" : true,
    "dataCol" : [
        {
            "name" : "直播间ID" ,
            "cssSelector" : "#roomId",
            "getValue" : "value",
            "type" : "num",
        },{
            "name" : "主播" ,
            "cssSelector" : "#nickname",
            "getValue" : "value",
        },
        {
            "name" : "抖音号" ,
            "cssSelector" : "div.item-ydh div.i-item-c > span",
            "eval" : "data.slice(4)",
        },
        {
            "name" : "直播标题" ,
            "cssSelector" : "#title",
            "getValue" : "value",
        },
        {
            "name" : "直播标签" ,
            "cssSelectors" : "div.item-tag.p16 > span",
        },
        {
            "name" : "开播时间" ,
            "cssSelector" : "div.item-times.p16 > span:nth-child(1)",
            "eval" : "data.slice(5)",
            "type" : "time",
        },
        {
            "name" : "下播时间" ,
            "cssSelector" : "div.item-times.p16 > span:nth-child(2)",
            "eval" : "data.slice(5)",
            "type" : "time",
        },
        {
            "name" : "平均观众停留时长" ,
            "cssSelector" : "#avgUserWatchTime",
        },
        {
            "name" : "超过的播主" ,
            "cssSelector" : "#avgUserWatchTimeDistribut",
            "type" : "num",
        },
        {
            "name" : "观看人次" ,
            "cssSelector" : "#tab1 div.module-col-1:nth-child(1) div.module-data-item:nth-child(1) span",
            "eval" : "data.split('/')[0]",
            "type" : "num",
        },
        {
            "name" : "观看人数" ,
            "cssSelector" : "#tab1 div.module-col-1:nth-child(1) div.module-data-item:nth-child(1) span",
            "eval" : "data.split('/')[1]",
            "type" : "num",
        },
        {
            "name" : "人数峰值" ,
            "cssSelector" : "#tab1 div.module-col-1:nth-child(1) div.module-data-item:nth-child(2) span",
            "type" : "num",
        },
        {
            "name" : "平均在线" ,
            "cssSelector" : "#tab1 div.module-col-1:nth-child(1) div.module-data-item:nth-child(3) span",
            "type" : "num",
        },
        {
            "name" : "本场音浪" ,
            "cssSelector" : "#tab1 div.module-col-1:nth-child(1) div.module-data-item:nth-child(4) span",
            "type" : "num",
        },
        {
            "name" : "新增粉丝" ,
            "cssSelector" : "#tab1 div.module-col-1:nth-child(1) div.module-data-item:nth-child(1)",
            "eval" : "data.split('新增粉丝').pop()",
            "type" : "num",
        },
        {
            "name" : "转粉率" ,
            "cssSelector" : "#tab1 div.module-col-1:nth-child(1) div.module-data-item:nth-child(2)",
            "eval" : "data.split('转粉率').pop()",
            "type" : "num",
        },
        {
            "name" : "本场点赞" ,
            "cssSelector" : "#tab1 div.module-col-1:nth-child(1) div.module-data-item:nth-child(3)",
            "eval" : "data.split('本场点赞').pop()",
            "type" : "num",
        },
        {
            "name" : "送礼人数" ,
            "cssSelector" : "#tab1 div.module-col-1:nth-child(1) div.module-data-item:nth-child(4)",
            "eval" : "data.split('送礼人数').pop()",
            "type" : "num",
        },
        {
            "name" : "本场销售额" ,
            "cssSelector" : "#tab1 div.module-col-2 div.module-data-item:nth-child(1) span",
            "type" : "num",
        },
        {
            "name" : "本场销量" ,
            "cssSelector" : "#tab1 div.module-col-2 div.module-data-item:nth-child(2) span",
            "type" : "num",
        },
        {
            "name" : "客单价" ,
            "cssSelector" : "#tab1 div.module-col-2 div.module-data-item:nth-child(3) span",
            "type" : "num",
        },
        {
            "name" : "上架商品" ,
            "cssSelector" : "#tab1 div.module-col-2 div.module-data-item:nth-child(1)",
            "eval" : "data.split('上架商品').pop()",
            "type" : "num",
        },
        {
            "name" : "用户人均价值" ,
            "cssSelector" : "#tab1 div.module-col-2 div.module-data-item:nth-child(2)",
            "eval" : "data.split('用户人均价值').pop()",
            "type" : "num",
        },
        {
            "name" : "销售转换率" ,
            "cssSelector" : "#tab1 div.module-col-2 div.module-data-item:nth-child(3)",
            "eval" : "data.split('销售转换率').pop()",
            "type" : "num",
        },
        {
            "name" : "新增粉丝团" ,
            "cssSelector" : "#tab3 div.module-col-1:nth-child(2) > div.module-chart-title > span",
            "type" : "num",
        },
        {
            "name" : "弹幕总数" ,
            "cssSelector" : "#totalDanmuCount",
            "type" : "num",
        },
        {
            "name" : "弹幕人数" ,
            "cssSelector" : "#totalDanmuUser",
            "type" : "num",
        },
        {
            "name" : "人均弹幕数" ,
            "cssSelector" : "#perUserDanmu",
            "type" : "num",
        }
    ]
};
setting["飞瓜数据-主播搜索-直播记录"] =  {
    "trigger":"itemNum",
    "oldData":true,
    "url" : "https://dy.feigua.cn/Member#/BloggerNew/Detail",
    "itemCss" : "tbody#blogger_live_item_list > tr",
    "itemNum" : 0,
    "dataCol" : [
        {
            "name" : "主播" ,
            "cssSelector" : "div.media-list.v3-owner-bozhu a.title",
        },{
            "name" : "抖音号" ,
            "cssSelector" : "div.media-list.v3-owner-bozhu div.item-common",
            "eval" : "data.slice(4)",
        },
        {
            "name" : "时段" ,
            "cssSelector" : "div#blogger_live_date_btns button.btn.btn-default.active",
        },
        {
            "name" : "直播标题" ,
            "cssSelector" : "td:nth-child(1)",
            "item" : true,
        },
        {
            "name" : "开播时间" ,
            "cssSelector" : "td:nth-child(2)",
            "item" : true,
        },
        {
            "name" : "观看人数" ,
            "cssSelector" : "td:nth-child(3)",
            "item" : true,
            "type" : "num",
        },
        {
            "name" : "人气峰值" ,
            "cssSelector" : "td:nth-child(4)",
            "item" : true,
            "logPrint" : ["mean","stddev","quartile","sum"],
            "type" : "num",
        },
        {
            "name" : "预估销量" ,
            "cssSelector" : "td:nth-child(5)",
            "item" : true,
            "logPrint" : ["mean","stddev","quartile","sum"],
            "type" : "num",
        },
        {
            "name" : "预估销售额" ,
            "cssSelector" : "td:nth-child(6)",
            "item" : true,
            "logPrint" : ["mean","stddev","quartile","sum"],
            "type" : "num",
        },

    ]
};



var settingData;  // 存储当前网页需要调用的设置全局变量
var globalData;   // 存储多个网页获取到的所有数据
var scriptName;
var myLog = false;

trigger(statistics);  // 网页数据发生变化触发数据统计
function trigger(func, oldData = "", interval = 500){
    //
    // 网页数据发生变化触发数据统计，提供了itemNum，newUrl，newData 3种触发方式。
    //
    setInterval(function() {
        for(var name in setting){
            if(window.location.href.indexOf(setting[name].url) != -1 ) { //判断是否取到
                settingData = setting[name];
                settingData["name"] = name;
                if(settingData.document){
                    var pageDocument = eval(settingData.document);
                }else{
                    var pageDocument = document;
                }
                var pageData = "";
                if(settingData["trigger"] == "itemNum"){
                    pageData = pageDocument.querySelectorAll(settingData["itemCss"]).length;
                }else if(settingData["trigger"] == "newData"){
                    for (var coli=0; coli<settingData.dataCol.length; coli++) {
                        if(!settingData.dataCol[coli].item){
                            pageData += getData(pageDocument,settingData,coli) + " && ";
                        }
                    }
                }else if(settingData["trigger"] == "newUrl"){
                    pageData = window.location.href;
                }else{
                    console.log(scriptName + " 不能识别的触发器类型：" + settingData["trigger"]);
                }
                if(oldData != pageData){
                    scriptName = name + " " + GM_info.script.name;
                    if(myLog == false) myLog = LogPanel(scriptName);
                    console.log(scriptName + " 发现新数据：" + pageData);
                    myLog.del(); // 清空原有日志数据
                    oldData = pageData;
                    globalData = GM_getValue(settingData.name) || {}; // 读取已存储数据
                    for (var coli=0; coli<settingData.dataCol.length; coli++) {
                        var colName = settingData.dataCol[coli].name;
                        if(globalData[colName] == undefined) globalData[colName] = []; // 没有数组，建立数组
                    }
                    // 延时执行，防止网页数据没有更新
                    setTimeout(function() {
                        func(pageDocument, settingData);
                        GM_setValue(settingData.name, globalData); // 存储获取到的新数据
                    },interval);
                    break;
                }
            }
        }
    }, interval);
}

function statistics(pageDocument, settingData){
    //
    // 统计数据
    //
    if(pageDocument.querySelectorAll(settingData.itemCss).length >= settingData.itemNum) { //判断是否全部加载
        var items = pageDocument.querySelectorAll(settingData.itemCss);
        myLog.print("发现【" + settingData["name"] + "】数据 数量：" + items.length);
        for(var index=0; index<items.length; index++){
            if(settingData.colLog){
                var logStr = "NO." + (index+1);
                myLog.print(logStr);
            }
            for (var coli=0; coli<settingData.dataCol.length; coli++) {
                try {
                    if(settingData.dataCol[coli].item){
                        var parentElement = items[index];
                    }else{
                        var parentElement = pageDocument;
                    }
                    var data = getData(parentElement, settingData, coli, index);
                } catch (error) {
                    data = "False";
                    console.log(scriptName + " 错误：" + error);
                }
                // 记录数据
                var colName = settingData.dataCol[coli].name;
                globalData[colName].push(data);
                if(settingData.colLog){
                    // 输出列日志，方便查看数据。
                    var logStr = "&emsp;" + colName + ":" + data  // &emsp; 是制表符
                    myLog.print(logStr);
                }
            }
            if(settingData.eval) { // 每行是否有需要执行的命令
                eval(settingData.eval); // 执行命令
            }
        }
        // 按照基础设置，输出分析日志
        logPrint(items.length);
    }
}

function getData(parentElement,settingData,coli,index){
    //
    // 根据配置的列数据cssSelectors，cssSelector，eval获取值
    // 根据配置的列数据type，格式化获取的值为数字，时间，文本等格式
    //
    index = index || 0 ;
    if(settingData.dataCol[coli].cssSelectors){
        var elements = parentElement.querySelectorAll(settingData.dataCol[coli].cssSelectors);
        var dataArr = [];
        var data;
        for(var ei=0;ei<elements.length;ei++){
            data = getValue(elements[ei],settingData.dataCol[coli].getValue);
            dataArr.push(data);
        }
        data = dataArr.join(" && ");
    }else if(settingData.dataCol[coli].cssSelector){
        var element = parentElement.querySelector(settingData.dataCol[coli].cssSelector);
        data = getValue(element,settingData.dataCol[coli].getValue);
    }
    if(settingData.dataCol[coli].eval) data = eval(settingData.dataCol[coli].eval);  // 运行代码计算数据
    if(settingData.dataCol[coli].type == "num"){
        if(data.length > 10){
            data = "\t" + data;
        }else{
            data = numFormat(data);
        }
    }
    else if(settingData.dataCol[coli].type == "time"){
        data = timeFormat(data);
    }
    else{
        if(typeof(data)=='string') data = data.trim();
    }
    return(data);
}

function getValue(element,getValueStr){
    //
    // 根据配置的列数据getValue值，获取对应的值，可以获取innerHTML，innerText，value，class，id，等属性值
    //
    var data = "false";
    if(element){
        if(getValueStr){
            if(getValueStr == "innerHTML"){
                data = element.innerHTML;
            }else if(getValueStr == "innerText"){
                data = element.innerText;
            }
            else if(getValueStr == "value"){
                data = element.value;
            }
            else{
                data = element.getAttribute(getValueStr);
            }
        }else{
            data = element.innerText;
        }
    }
    return(data);
}

function timeFormat(data){
    //
    // 日期时间格式化，根据需要调整。
    //
    var replaceData = {
        "年":"/",
        "月":"/",
        "日":"",
        "时":":",
        "分":":",
        "秒":":",
        "-":"/",
    }
    data = String(data)
    for(var key in replaceData){
        data = data.replace(new RegExp(key,'g'), replaceData[key]);
    }
    return(data);
}

function numFormat(data){
    //
    // 数字格式化，根据需要调整。
    //
    var replaceData = {
        "곚":0,
        "뷊":1,
        "첪":2,
        "곍":3,
        "ꯋ":4,
        "뷌":5,
        "꾻":6,
        "쾺":7,
        "껿":8,
        "뿯":9,
        "￥":"",
        "¥":"",
        "元":"",
        ",":"",
    }
    data = String(data)
    for(var key in replaceData){
        data = data.replace(new RegExp(key,'g'), replaceData[key]);
    }
    if(data.indexOf("万") != -1 || data.indexOf("W") != -1 || data.indexOf("w") != -1) data = parseFloat(data) * 10000;
    else if(data.indexOf("千") != -1 || data.indexOf("K") != -1 || data.indexOf("k") != -1)  data = parseFloat(data) * 1000;
    else if(data.indexOf("百分之") != -1 || data.indexOf("%") != -1)  data = parseFloat(data) / 100;
    else data = parseFloat(data);
    return(data);
}

function logPrint(num){
    //
    // 按照基础设置，输出分析日志
    //
    for (var coli=0; coli<settingData.dataCol.length; coli++) {
        if(settingData.dataCol[coli].logPrint){
            var dataArr = globalData[settingData.dataCol[coli].name].slice(-1 * num);
            debugger
            var dataAnalysis = Analysis(dataArr);
            for (var ai=0; ai<settingData.dataCol[coli].logPrint.length; ai++) {
                var func =  settingData.dataCol[coli].logPrint[ai];
                var logStr = settingData.dataCol[coli].name + " " + func;
                logStr += "：" + dataAnalysis[func]();
                myLog.print(logStr);
            }
        }
    }
    return(logStr);
}

Date.prototype.Format = function (fmt) { 
    // author: meizz
    // 日期格式化输出
    //
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//添加日志输出面板
function LogPanel(name){
    var userScriptLogPanel = new Object();
    userScriptLogPanel.name = name;
    userScriptLogPanel.iframe = document.createElement("iframe");
    userScriptLogPanel.logPanel = document.createElement("userScriptLogPanel");
    userScriptLogPanel.logDiv = document.createElement("div");
    userScriptLogPanel.logTable = document.createElement("table");
    userScriptLogPanel.copyText = document.createElement("textarea");
    userScriptLogPanel.copyLogBnt = document.createElement("userScriptCopyLogBnt");
    userScriptLogPanel.downDataBnt = document.createElement("userScriptDownDataBnt");
    userScriptLogPanel.viewDataBnt = document.createElement("userScriptViewDataBnt");
    userScriptLogPanel.style = document.createElement("style");
    userScriptLogPanel.init = function(){
        this.logPanel.innerHTML = "<span id='userScriptLogPanel-tag'>日志</span><div id='userScriptLogPanel-head'><h2>Kinrt User Script日志</h2><span>" + this.name + "</span></div>";
        this.logPanel.data = this.name;
        this.logPanel.id = "userScriptLogPanel";
        this.logPanel.className = "userScriptLogPanel-hide";
        this.logDiv.appendChild(this.logTable)
        this.logDiv.id = "userScriptLogPanel-list";
        this.copyText.id = "userScriptCopyText";
        this.logDiv.appendChild(this.copyText)
        this.copyLogBnt.innerHTML = "<a title='复制日志' class='iconfont'>&#xe614;</a>";
        this.downDataBnt.innerHTML = "<a title='下载数据' class='iconfont'>&#xe603;</a>";
        this.viewDataBnt.innerHTML = "<a title='显示数据' class='iconfont'>&#xe600;</a>";
        this.logDiv.appendChild(this.copyLogBnt)
        this.logDiv.appendChild(this.downDataBnt)
        this.logDiv.appendChild(this.viewDataBnt)
        this.logPanel.appendChild(this.logDiv)

        // this.iframe.name = "userScriptLogPanel";
        // this.iframe.body.innerHTML = this.logPanel;
        if (document.querySelector("body")){
            document.body.appendChild(this.logPanel);
        } else {
            document.documentElement.appendChild(this.logPanel);
        }
        this.style.type = "text/css";
        this.style.innerHTML =  `
            #userScriptLogPanel{ 
                position:fixed; 
                top:20%; 
                width:auto; 
                min-width:300px; 
                max-width:30%; 
                height:auto; 
                min-height:15%; 
                max-height:50%; 
                opacity:0.8; 
                font-size:12px !important; 
                font-weight: 500 !important; 
                font-family:tahoma,arial,'Hiragino Sans GB' !important; 
                color:#fff !important; 
                background:#333 !important; 
                z-index:2147483647 !important; 
                margin: 0; 
                transition:0.3s; 
                overflow:auto; 
                padding:5px 8px; 
                border-width:1px 1px 1px 0; 
                border-bottom-right-radius:5px; 
                border-top-right-radius:5px; 
                box-sizing: content-box; 
            }
            #userScriptLogPanel #userScriptCopyText{ 
                position: absolute; 
                left: -99999px; 
            }
            #userScriptLogPanel userScriptCopyLogBnt{ 
                position: absolute; 
                top: 15px; 
                right: 20px; 
                user-select: none;
            }
            #userScriptLogPanel userScriptDownDataBnt{ 
                position: absolute; 
                top: 15px; 
                right: 50px; 
                user-select: none;
            }
            #userScriptLogPanel userScriptViewDataBnt{ 
                position: absolute; 
                top: -150px; 
                right: 80px; 
                user-select: none;
            }
            #userScriptLogPanel a{ 
                color:#fff !important; 
                opacity:0.6 !important; 
            }
            #userScriptLogPanel a:hover{ 
                text-decoration:none; 
                opacity:1 !important; 
                cursor:pointer; 
            }
            #userScriptLogPanel-tag{ 
                display:none; 
            }
            #userScriptLogPanel-head{ 
                height:45px; 
                overflow:hidden; 
                margin:5px 0; 
            }
            #userScriptLogPanel-head h2{ 
                font-size: 1.4em; 
                font-weight: bold; 
                margin: 2px; 
            }
            #userScriptLogPanel-head span{ 
                color:#999; 
            }
            #userScriptLogPanel-list table{ 
                border-collapse:collapse; 
                border-spacing:0; 
            }
            #userScriptLogPanel-list table td{ 
                padding: 2px; 
            }
            #userScriptLogPanel-list table tr{ 
                padding-bottom: 3px; 
            }
            #userScriptLogPanel::-webkit-scrollbar{ /*滚动条整体样式*/  
                width: 5px; /*高宽分别对应横竖滚动条的尺寸*/ 
                height: 1px; 
            }
            #userScriptLogPanel::-webkit-scrollbar-thumb {/*滚动条里面小方块*/  
                border-radius: 5px;  
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2); 
                background: #666; 
            }
            #userScriptLogPanel::-webkit-scrollbar-track {/*滚动条里面轨道*/  
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);  
                border-radius: 5px; 
                background: #444; 
            }
            .userScriptLogPanel-hide{ 
                width:10px!important; 
                min-width:1px!important; 
                height:35px!important; 
                min-height:1px!important; 
                opacity:0.1!important; 
            }
            .userScriptLogPanel-hide #userScriptLogPanel-tag{ 
                display:block; 
            }
            .userScriptLogPanel-hide #userScriptLogPanel-head{ 
                display:none; 
            }
            .userScriptLogPanel-hide #userScriptLogPanel-list{ 
                display:none; 
            }
            @font-face {
                font-family: 'iconfont';  /* project id 845604 */
                src: url('//at.alicdn.com/t/font_845604_qy7x08uy9n.eot');
                src: url('//at.alicdn.com/t/font_845604_qy7x08uy9n.eot?#iefix') format('embedded-opentype'),
                url('//at.alicdn.com/t/font_845604_qy7x08uy9n.woff2') format('woff2'),
                url('//at.alicdn.com/t/font_845604_qy7x08uy9n.woff') format('woff'),
                url('//at.alicdn.com/t/font_845604_qy7x08uy9n.ttf') format('truetype'),
                url('//at.alicdn.com/t/font_845604_qy7x08uy9n.svg#iconfont') format('svg');
                }
            .iconfont {
                font-family:'iconfont' !important;
                font-size:16px;font-style:normal;
                -webkit-font-smoothing: antialiased;
                -webkit-text-stroke-width: 0.2px;
                -moz-osx-font-smoothing: grayscale;
            }`;
        this.logPanel.appendChild(this.style);
    }
    userScriptLogPanel.copyLog = function(){
        // 复制日志内容
        try{
            document.getElementById("userScriptCopyText").select();
            document.execCommand('copy');
            console.log("复制成功");
        }
        catch (err) {
            console.log('复制失败');
        }
    }
    userScriptLogPanel.downData = function() {
        // toCsv 下载数据为CSV文件
        var dataStr = "";
        for (var coli=0; coli < settingData.dataCol.length; coli++){
            var colName = settingData.dataCol[coli].name;
            dataStr += colName + ",";
        }
        dataStr += "\n";
        for (var rowi=0; rowi < globalData[settingData.dataCol[0].name].length; rowi++){
            for (var coli=0; coli < settingData.dataCol.length; coli++){
                var tmp = String(globalData[settingData.dataCol[coli].name][rowi]);
                tmp = tmp.replace('"','""');
                if(tmp.indexOf(",")>=0 || tmp.indexOf('"')>=0 || tmp.indexOf("\n")>=0 || tmp.indexOf("\t")>=0){
                    tmp = '"' + tmp + '"';
                }
                dataStr += tmp + ",";
            }
            dataStr += "\n";
        }
        console.log(dataStr);
        var csvData = new Blob(["\uFEFF" + dataStr], { type: 'text/csv' });
        var csvUrl = URL.createObjectURL(csvData);
        var a = document.createElement('a');
        a.download = scriptName + new Date().Format("yyyy-MM-dd hhmmss") + '.csv';
        a.href =  csvUrl;
        document.body.appendChild(a);
        a.click();
        GM_setValue(settingData.name, 0); // 每次下载后都清空存储的数据
    }
    userScriptLogPanel.viewData = function() {
        console.log(settingData.dataCol);
    }
    userScriptLogPanel.show = function(showTime=0){
        document.getElementById('userScriptLogPanel').classList.remove("userScriptLogPanel-hide");
        if(showTime > 0){
            setTimeout(function(){
                document.getElementById('userScriptLogPanel').classList.add("userScriptLogPanel-hide");
            },showTime * 1000)
        }
    }
    userScriptLogPanel.hide = function(showTime=0.1){
        setTimeout(function(){
            document.getElementById('userScriptLogPanel').classList.add("userScriptLogPanel-hide");
        },showTime * 1000)
    }
    userScriptLogPanel.print = function(logStr){
        var log = document.createElement("tr");
        log.innerHTML = "<td>" + new Date().Format("hh:mm:ss") + "</td><td>" + logStr + "</td>";
        this.logTable.appendChild(log);
        this.copyText.innerHTML += logStr + "\n";
    }
    userScriptLogPanel.del = function(num = "all"){
        if(num == "all") {
            this.logTable.innerHTML = "";
            this.copyText.innerHTML = "";
        }
        else alert("功能没有完成。");
    }
    userScriptLogPanel.copyLogBnt.addEventListener("click",userScriptLogPanel.copyLog);
    userScriptLogPanel.downDataBnt.addEventListener("click",userScriptLogPanel.downData);
    userScriptLogPanel.viewDataBnt.addEventListener("click",userScriptLogPanel.viewData);
    userScriptLogPanel.logPanel.addEventListener("mouseover",userScriptLogPanel.show);
    userScriptLogPanel.logPanel.addEventListener("mouseleave",userScriptLogPanel.hide);
    userScriptLogPanel.init();
    return userScriptLogPanel;
}

//数据分析类
function Analysis(data = [],float = 2){
    var compare = function (x, y) {//比较函数
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    };
    var sum = function(x,y){ return x+y;};　　//求和函数
    var square = function(x){ return x*x;};　　//数组中每个元素求它的平方

    var analysis = new Object();
    // 去掉所有非数值
    analysis.data = data.filter(v => typeof(v) == "number" && !isNaN(v));
    analysis.data.sort(compare); //数组排序

    analysis.sum = function(){
        var sumData = 0;
        for(var i=0;i<this.data.length;i++){
            sumData += this.data[i];
        }
        return sumData.toFixed(float);
    }
    analysis.max = function(){
        return this.data[this.data.length - 1];
    }
    analysis.min = function(){
        return this.data[0];
    }
    analysis.mid = function(){
        // 中位数
        if (this.data.length%2==0){
            return ((this.data[this.data.length/2]+this.data[this.data.length/2+1])/2).toFixed(float)
        }
        else{
            return (this.data[(this.data.length+1)/2]).toFixed(float)
        }
    }
    analysis.mean = function(){
        // 均值
        return (this.data.reduce(sum)/this.data.length).toFixed(float);
    }
    analysis.stddev = function(){
        // 标准偏差
        var mean = this.data.reduce(sum)/this.data.length;
        var deviations = this.data.map(function(x){return x-mean;});
        return (Math.sqrt(deviations.map(square).reduce(sum)/(this.data.length-1))).toFixed(float);
    }
    analysis.quartile = function(){
        // 四分位数
        var dataArr = [];
        dataArr.push(this.data[parseInt(this.data.length/4)]);
        dataArr.push(this.data[parseInt(this.data.length/2)]);
        dataArr.push(this.data[parseInt(this.data.length/4*3)]);
        return(dataArr.join(" "));
    }
    return analysis
}