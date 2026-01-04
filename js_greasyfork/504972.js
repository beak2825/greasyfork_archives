// ==UserScript==
// @name         新浪微博热搜榜-关键词屏蔽（增强版）
// @name:en      Sina Weibo Hot Search List - Keyword Blocking (Enhanced Version)
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  屏蔽微博热搜榜中标签为：剧集、综艺等明显买量条目、热搜广告、热搜关键词。可自定义标签及关键词，并支持json导入导出标签和关键词列表。
// @description:en  Block the following tags in Weibo's hot search list: dramas, variety shows and other obvious purchase items, hot search ads, hot search keywords. You can customize tags and keywords, and support json import and export of tag and keyword lists.
// @author       kawatabi
// @match        https://s.weibo.com/top/*
// @icon         https://www.sina.com.cn/favicon.ico
// @grant        none
// @license      GPL-3.0 License
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/504972/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C%E6%A6%9C-%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/504972/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C%E6%A6%9C-%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let xAdListEl // 设置页面
    let xAdCloseBtn  //设置页面关闭按钮
    let xAdTips //提示标签
    let keywordsListMap //热搜关键词
    let tagListMap //标签

    let adWrapper = $(".data ").find("tbody")
    let adTd01Arr = adWrapper.find(".td-01") // 全部的标签 用于检索标签中为 • 的广告
    let adTd02Tags = adWrapper.find(".td-02").find("span") // 关键词类型内数组
    let adTd02Keyword = adWrapper.find(".td-02").find("a") // 关键词类型内数组
    let adLens = adTd01Arr.length //热搜长度 如果大于50 则说明有上升的热搜

    /** ==================== storageUtils ====================*/

    /**
     *  保存内容到 localStorage 中
     * @param storageName 本地仓库名称
     * @param storageVal 需要存储的值
     * @returns {*} 成功返回存储名称 否则返回null
     */
    let saveStorage = function (storageName, storageVal) {
        if (storageName.trim() === "") {
            throw new Error("saveStorage error：storageName does not empty")
        }
        try {
            localStorage.setItem(storageName, JSON.stringify(storageVal))
            return storageName
        } catch (e) {
            throw new Error("saveStorage error: save fail" + e)
        }
    }

    /**
     *  根据传入的 storageName 获取 localStorage 中的值
     * @param storageName 名称
     * @returns {any} 经过转换 的值
     */
    let getStorage = function (storageName) {
        if (storageName.trim() === "") {
            throw new Error("getStorage error:storageName does not empty")
        }
        try {
            return JSON.parse(localStorage.getItem(storageName));
        } catch (e) {
            throw new Error("getStorage error:get fail" + e)
        }
    }

    //屏蔽的热搜列表
    let blockList = []

    init()

    function init() {
        addElementToBody()
        addHeadLink()
        initModalBox()
        handleMenuBtnClick()
        handleCloseBtnClick()
        initData()
        renderDelKeywordsList()
        renderDelTagList()
        disableAdItem()
        disableTags()
        disableKeyword()
        resetIndex()
        handleAddTagBtnClick()
        handleAddKeywordBtnClick()
        handleExportBtnClick()
        handleImportBtnClick()
        renderBlockListToBody()
    }

    /**
     * 渲染频闭列表到页面中
     */
    function renderBlockListToBody() {
        let blockListEl = $(".x-ad-block-list-wrap")
        blockListEl.siblings("span").text("屏蔽列表（只会显示本次被屏蔽的热搜）共 " + blockList.length + " 条")
        let str = ""
        $.each(blockList, function (i, item) {
            str += `<div class="u-item"><a href="${item.el.get(0)}" target="_blank" title="点击前往热搜：${item.el.text()}">${i + 1}，  屏蔽类型：${item.type}，屏蔽内容：${item.el.text()}  </a></div>`
        })
        blockListEl.html(str)
    }

    /**
     * 初始化时候读取本地过滤列表
     */
    function initData() {
        keywordsListMap = getStorage("keywordsListMap") || ["时代少年团", "肖战", "王一博"]
        tagListMap = getStorage("tagListMap") || ["剧集", "综艺", "电影", "盛典", "音乐", "演出"]
        saveStorage("keywordsListMap", keywordsListMap)
        saveStorage("tagListMap", tagListMap)
    }

    /**
     * 添加标签按钮被点击
     */
    function handleAddTagBtnClick() {
        $(".x-btn-add-tag").on("click", function () {
            let tag = $(this).siblings(".x-add-ipt-tag").val()
            if (tag.trim() != "") {
                tagListMap.push(tag)
                xAdTips.text("添加成功")
                saveStorage("tagListMap", tagListMap)
                setTimeout(function () {
                    xAdTips.text("")
                }, 3000)
            } else {
                xAdTips.text("输入标签名称后在添加")
            }
        })
    }

    /**
     * 添加关键词按钮被点击
     */
    function handleAddKeywordBtnClick() {
        $(".x-btn-add-keyword").on("click", function () {
            let keywords = $(this).siblings(".x-add-ipt-keyword").val()
            if (keywords.trim() != "") {
                keywordsListMap.push(keywords)
                saveStorage("keywordsListMap", keywordsListMap)
                xAdTips.text("添加成功")
                setTimeout(function () {
                    xAdTips.text("")
                }, 3000)
            } else {
                xAdTips.text("输入关键词后在添加")
            }
        })
    }

    /**
     * 处理导出按钮点击事件
     */
    function handleExportBtnClick() {
        $(".x-btn-export").on("click", function () {
            const data = {
                tagListMap: tagListMap,
                keywordsListMap: keywordsListMap
            };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "weibo_filter_data.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    }

    /**
     * 处理导入按钮点击事件
     */
    function handleImportBtnClick() {
        $(".x-btn-import").on("click", function () {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = function (event) {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = function (e) {
                    const result = JSON.parse(e.target.result);
                    if (result.tagListMap && result.keywordsListMap) {
                        tagListMap = result.tagListMap;
                        keywordsListMap = result.keywordsListMap;
                        saveStorage("tagListMap", tagListMap);
                        saveStorage("keywordsListMap", keywordsListMap);
                        renderDelTagList();
                        renderDelKeywordsList();
                        alert("导入成功");
                    } else {
                        alert("文件格式不正确");
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }

    /**
     * 重新为热搜编号
     */
    function resetIndex() {
        //如果总长度大于50 则说明有上升的热搜
        if (adLens > 50) {
            let resetEl = adWrapper.find(".td-01") //重新获取最新的子元素
            let continueFirstFlag = false
            if (resetEl.find(".icon-top").length > 0) {
                continueFirstFlag = true
            }
            for (let i = 0; i < resetEl.length; i++) {
                if (continueFirstFlag) {
                    continueFirstFlag = !continueFirstFlag
                    continue
                }
                $(resetEl[i]).text(i)
            }
        }
    }

    /**
     * 隐藏包含 disableStartName 集合中关键字的热搜
     */
    function disableKeyword() {
        $.each(keywordsListMap, function (nameIndex, keyword) {
            $.each(adTd02Keyword, function (i, adKeyword) {
                if ($(adKeyword).text().indexOf(keyword) !== -1) {
                    $(adKeyword).parents("tr").remove()
                    blockList.push({
                        el: $(adKeyword).parents("tr").children(".td-02").children("a"),
                        type: `关键词(${keyword})`
                    })
                }
            })
        })
    }

    /**
     * 隐藏tag为 tagListMap 定义的内容的热搜
     */
    function disableTags() {
        $.each(tagListMap, function (i, tagItem) {
            $.each(adTd02Tags, function (i, adTagItem) {
                if ($(adTagItem).text().indexOf(tagItem) !== -1) {
                    $(adTagItem).parents("tr").remove()
                    blockList.push({
                        el: $(adTagItem).parents("tr").children(".td-02").children("a"),
                        type: `标签（${tagItem}）`
                    })
                }
            })
        })
    }

    /**
     * 隐藏广告
     */
    function disableAdItem() {
        $.each(adTd01Arr, function (i, item) {
            if ($(item).text() === "•") {
                $(item).parents("tr").remove()
            }
        })
    }

    /**
     * 渲染删除关键词列表 并且将删除后的数组保存到本地
     */
    function renderDelKeywordsList() {
        let delKeywordsListEl = $(".del-keywords-list")
        let delKeywordsStr = ""
        $.each(keywordsListMap, function (i, item) {
            delKeywordsStr +=
                '<div class="u-item"><span class="x-ad-txt">' + item + '</span><span class="x-delete-btn"  title="删除关键词  ' + item + '">删除</span></div>'
        })
        delKeywordsListEl.html(delKeywordsStr)

        delKeywordsListEl.on("click", ".x-delete-btn", function () {
            let index = $(this).parents(".u-item").index()
            $(this).parents(".u-item").remove()
            keywordsListMap.splice(index, 1)
            saveStorage("keywordsListMap", keywordsListMap)
        })
    }

    /**
     * 渲染删除tag列表 并且将删除后的数组保存到本地
     */
    function renderDelTagList() {
        let delTagListEl = $(".del-tag-list")
        let delTagStr = ""
        $.each(tagListMap, function (i, item) {
            delTagStr +=
                '<div class="u-item"><span class="x-ad-txt">' + item + '</span><span class="x-delete-btn" title="删除标签 ' + item + '">删除</span></div>'
        })
        delTagListEl.html(delTagStr)
        delTagListEl.on("click", ".x-delete-btn", function () {
            let index = $(this).parents(".u-item").index()
            $(this).parents(".u-item").remove()
            tagListMap.splice(index, 1)
            saveStorage("tagListMap", tagListMap)
        })
    }

    /**
     * 拖动模态框
     */
    function initModalBox() {
        //拖动功能
        let modalBox = document.querySelector(".x-ad-btn-setting");
        modalBox.addEventListener("mousedown", function (e) {  //鼠标按下的时候，得到鼠标在盒子里面的坐标
            let x = e.pageX - modalBox.offsetLeft;
            let y = e.pageY - modalBox.offsetTop;
            document.addEventListener("mousemove", move);  //鼠标移动的时候，得到模态框的坐标
            function move(e) {
                modalBox.style.left = e.pageX - x + "px";
                modalBox.style.top = e.pageY - y + "px";
            }

            document.addEventListener("mouseup", function () {  //鼠标弹起的时候，解除鼠标移动事件
                document.removeEventListener("mousemove", move);
            })
        })
        $(modalBox).on("click", function () {
            xAdListEl.fadeToggle()
        })
    }

    /**
     * 添加自定义内容标签到页面中
     */
    function addElementToBody() {
        let settingsEl = '<div class="x-ad-btn-setting" title="热搜关键词设置，按住鼠标左键可拖动">热</div>'
        let xAdEl = `
                <div class="x-ad-list" style="display: none">
                    <div class="x-ad-header">
                        <div class="x-ad-title">热搜关键词设置(刷新页面生效)</div>
                        <div class="x-ad-tips"></div>
                        <div class="x-ad-close-btn" title="关闭设置界面">X</div>
                    </div>
                    <div class="x-ad-wrapper">
                        <div class="a-ad-menu-list">
                            <div class="a-ad-menu-list-item x-active-menu">添加过滤信息</div>
                            <div class="a-ad-menu-list-item">删除过滤信息</div>
                            <div class="a-ad-menu-list-item">导入/导出</div>
                            <div class="a-ad-menu-list-item">屏蔽列表</div>
                        </div>
                        <div class="x-ad-container">
                            <!--添加新过滤内容-->
                            <div class="x-ad-add-wrap">
                                <div class="x-add-tags">
                                    <span class="add-tips">添加新标签</span>
                                    <p class="x-add-item">
                                <input type="text" class="x-add-ipt x-add-ipt-tag" placeholder="请输入需要过滤的标签名称">
                                <button class="x-btn x-btn-add-tag">添加</button>
                                </p>
                                </div>
                                <div class="x-add-keywords">
                                    <span class="add-tips">添加新关键词</span>
                                    <p class="x-add-item">
                            <input type="text" class="x-add-ipt x-add-ipt-keyword" placeholder="请输入需要过滤的关键词">
                            <button class="x-btn x-btn-add-keyword">添加</button>
                            </p>
                                </div>
                            </div>
                            <!--删除已添加的项目-->
                            <div class="x-ad-del-wrap">
                                <div class="x-del-tags">
                                    <span>全部标签列表（新增加的要刷新后才显示）</span>
                                    <div class="u-list del-tag-list"></div>
                                </div>
                                <div class="x-del-keyword">
                                    <span>全部关键词列表（新增加的要刷新后才显示）</span>
                                    <div class="u-list del-keywords-list"></div>
                                </div>
                            </div>
                            <!-- 导入导出 -->
                            <div class="x-ad-import-export-wrap" style="display:none;">
                                <button class="x-btn x-btn-export">导出</button>
                                <button class="x-btn x-btn-import">导入</button>
                            </div>
                            <div class="x-ad-block-list">
                                <span>屏蔽列表（只会显示本次被屏蔽的热搜）</span>
                                <div class=" u-list x-ad-block-list-wrap">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
        $("body").append(settingsEl)
        $("body").append(xAdEl)
        xAdListEl = $(".x-ad-list")
        xAdCloseBtn = $(".x-ad-close-btn")
        xAdTips = $(".x-ad-tips")
    }

    /**
     * 关闭按钮被点击
     */
    function handleCloseBtnClick() {
        xAdCloseBtn.on("click", function () {
            xAdListEl.fadeToggle()
        })
    }

    /**
     * 添加菜单栏点击切换事件
     */
    function handleMenuBtnClick() {
        $(".a-ad-menu-list-item").on("click", function () {
            $(this).addClass("x-active-menu").siblings().removeClass("x-active-menu")
            let index = $(this).index()
            $(this).parents(".a-ad-menu-list").siblings(".x-ad-container").children().eq(index).show().siblings().hide()
        })
    }

    /**
     *添加head中的style标签
     */
    function addHeadLink() {
        let head = document.querySelector("head");
        let styleEl = addElStyle();
        head.appendChild(styleEl);
    }

    /**
     *
     * 添加css样式方法，脚本的所有css 都将在这里定义
     * @returns style 标签
     */
    function addElStyle() {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
        * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        }

        .x-ad-btn-setting {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 0;
        top: 50%;
        transform: translate(0%, -50%);
        border-radius: 5px;
        width: 40px;
        height: 40px;
        text-align: center;
        font-size: 16px;
        background-color: #4FC3F7;
        cursor: pointer;
        user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        color: #fff;
        }

        /*设置列表*/
        .x-ad-list {
        display: flex;
        flex-direction: column;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        height: 500px;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, .3);
        }

        /*标题*/
        .x-ad-header {
        position: relative;
        display: flex;
        padding: 5px 10px;
        font-size: 18px;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
        }

        /*标题文字*/
        .x-ad-title {
        font-size: 18px;
        }

        /*提示文字*/
        .x-ad-tips, .x-ad-close-btn {
        position: absolute;
        right: 40px;
        color: green;
        font-size: 16px;
        }

        .x-ad-close-btn {
        padding: 10px;
        top: -5px;
        right: 5px;
        color: #333;
        cursor: pointer;
        transition: all .3s ease;
        }

        .x-ad-close-btn:hover {
        transform: rotate(90deg);
        }

        /*主要设置部分*/
        .x-ad-wrapper {
        display: flex;
        flex: 1;
        background-color: #EEEEEE;

        }

        /*设置菜单 列表*/
        .a-ad-menu-list {
        display: flex;
        text-align: center;
        flex-direction: column;
        width: 100px;
        height: 100%;
        cursor: pointer;
        }

        /*每一个菜单项*/
        .a-ad-menu-list-item {
        padding: 5px;
        }

        /*鼠标经过菜单显示的颜色*/
        .a-ad-menu-list-item:hover {
        background-color: #FAFAFA;
        }

        /*主要内容部分*/
        .x-ad-container {
        flex: 1;
        background-color: #ffffff;
        }

        /*添加关键词*/
        .x-ad-add-wrap, .x-ad-del-wrap,.x-ad-block-list {
        padding: 10px;
        }
        .x-ad-del-wrap,.x-ad-block-list{
        display:none;
        }


        /*每一个添加的行*/
        .x-add-item {
        margin: 16px 0;
        display: flex;
        /*justify-content: center;*/
        align-items: center;
        }

        /*输入框*/
        .x-add-ipt {
        width: 250px;
        outline: none;
        height: 30px;
        border-radius: 2px;
        padding: 0 5px;
        color: #333;
        border: 1px solid #eee;
        }

        /*添加按钮*/
        .x-btn {
        width: 80px;
        height: 30px;
        border: none;
        cursor: pointer;

        }

        /*活跃的菜单*/
        .x-active-menu {
        background-color: #fff;
        }


        /*列表盒子*/
        .u-list {
        margin: 5px 10px;
        background-color: rgba(238, 238, 238, .4);
        min-height: 186px;
        max-height: 186px;
        overflow-y: auto;
        border-radius: 2px;
        }

        /*列表盒子中的每一个项*/
        .u-item {
        padding: 5px;
        display: flex;
        justify-content: space-between;
        }

        /*双数设置背景颜色*/
        .u-item:nth-child(even) {
        background-color: rgba(244, 255, 255, 0.5);
        }

        /*经过每一个项*/
        .u-item:hover {
        background-color: #FFB74D;
        }

        /*删除按钮*/
        .x-delete-btn {
        cursor: pointer;
        user-select: none;
        -ms-user-select: none;
        }

        /*鼠标经过删除按钮*/
        .x-delete-btn:hover {
        color: #ffffff;
        }

        /*删除关键词盒子*/
        .x-del-keyword {
        margin-top: 15px;
        }
    `;

        return style;
    }


})();
