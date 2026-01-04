// ==UserScript==
// @name         城市美日常辅助工具（第3代）
// @namespace    辅助工具（第3代）
// @version      0.4.7
// @description  辅助工具（第3代）
// @author       城市美
// @match        *://www.baidu.com/*
// @match        *://*.gzwy.gov.cn/*
// @match        *://*.gzjxjy.gzsrs.cn/*
// @match        *://*.faxuanyun.com/*
// @match        *://101.43.116.57/T_Map/*
// @require      https://update.greasyfork.org/scripts/522211/1511565/jQueryv214.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @connect      cx.icodef.com
// @connect      q.icodef.com
// @connect      www.tikuhai.com
// @connect      tk.enncy.cn 

// @license      MIT 


// @downloadURL https://update.greasyfork.org/scripts/522840/%E5%9F%8E%E5%B8%82%E7%BE%8E%E6%97%A5%E5%B8%B8%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7%EF%BC%88%E7%AC%AC3%E4%BB%A3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522840/%E5%9F%8E%E5%B8%82%E7%BE%8E%E6%97%A5%E5%B8%B8%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7%EF%BC%88%E7%AC%AC3%E4%BB%A3%EF%BC%89.meta.js
// ==/UserScript==

// 1、配置 Web_Config，定义网站需要应用的插件。
// 2、配置 Plugin_Config，设置插件样式 及 插件功能。
// 3、配置 __Plugin_Event，上述Plugin_Config中的插件实现方法function全部汇总写到这里，方便清晰结构。
// 4、配置 Document_ClassList，配置插件需要引用的css，并以div标签包裹并已兄弟元素方式添加到<head>之后，<head>、<style>、<body>三并列结构，一般普通站点插件配置不需改动。<html> <head>...</head> <div><style>...</style></div> <body>...</body></html>，

var PageUrl = document.URL;
var Default_Css = { "font-size": "14px", "text-align": "center", "height": "auto" };
var Global_Parameters = { IntervalTime: 1000 };//全局参数 // 全局 定时器 间隔时间 一般不建议修改

// console.log(GM_info);

// 1、配置 Web_Config，定义网站需要应用的插件。
var Web_Config = [
    // 一网站一配置   根据网站设置需具体应用的插件
    { WebName: "站点VUE调试工具", Url: ["*"], Use_Plugin: ["VueDebug_Plugin"] },
    { WebName: "XHR_调试工具", Url: ["*"], Use_Plugin: ["XHR_Debug_Plugin"] },
    { WebName: "百度-一之题库请求测试", Url: ["*www.baidu.com*"], Use_Plugin: ["Baidutest_Plugin", "VideoAutoPlay_Plugin"] },
    { WebName: "贵州省党员干部网络学院", Url: ["*gzwy.gov.cn*"], Use_Plugin: ["Baidutest_Plugin", "VideoAutoPlay_Plugin", "OneKeyComplete_Plugin_For_gzwy_gov_cn"] },// 可配置 专属 一键完成 插件 OneKeyComplete_Plugin_For_gzwy_gov_cn
    { WebName: "法宣在线", Url: ["*faxuanyun.com*"], Use_Plugin: ["VideoAutoPlay_Plugin"] },
    { WebName: "贵州省专业技术人员继续教育", Url: ["*gzjxjy.gzsrs.cn*"], Use_Plugin: ["VideoAutoPlay_Plugin", "OneKeyComplete_Plugin_For_gzjxjy_gzsrs_cn"] },// 可配置 专属 一键完成 插件 OneKeyComplete_Plugin_For_gzjxjy_gzsrs_cn
    { WebName: "Home 键呼出", Url: ["*"], Use_Plugin: ["HotKey_Home_Plugin"] },
];

// 2.0、配置 BaseUI_config ，设置基本界面样式 及 功能。 这是基本界面配置，一般不做修改。
var BaseUI_config = {
    Dom_Type: "div",
    Dom_LoadInfo: { Parent_Element: document.head, Add_Method: "after" },//append after
    Dom_Attribute: { "id": __Public_Fn("generateID")() },
    Dom_Style: {
        "width": "300px", "background": "aliceblue", "padding": "0px", // 内边距
        "borderRadius": "5px", "boxShadow": "0 0 10px rgba(0, 0, 0, 0.3)", // 圆角半径 // 阴影效果
        "zIndex": 99999991, "top": "70px", "left": "30px", "font-size": "14px", "position": "fixed",
        "-webkit-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none",/* Chrome, Safari, Opera */ /* Firefox */ /* Internet Explorer/Edge */
    }, Dom_ClassList: [], Dom_Event: {}, Dom_Other_Event: [],
    Children: [
        {
            Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: {},
            Dom_Style: { "width": "100%", "background-color": "skyblue", "borderRadius": "5px 5px 0px 0px", "display": "flex" },
            Dom_ClassList: ["__My_HeadBox"], Dom_Event: {}, Dom_Other_Event: [],
            Children: [
                {
                    Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: GM_info.script.name + "v" + GM_info.script.version },
                    Dom_Style: {
                        "margin": "0px",
                        "padding": "5px",
                        "width": "calc(100% - 40px)",
                        "borderRadius": "5px 0px 0px 0px",
                    },
                    Dom_ClassList: [], Dom_Event: {}, Dom_Other_Event: [((this_Dom) => {
                        var isDragging = false; // 是否在拖动中
                        var startOffset = { x: 0, y: 0 }; // 鼠标按下时的偏移量
                        // var box = this_Dom.parentElement;
                        var box = this_Dom.offsetParent;
                        // 鼠标按下事件
                        this_Dom.addEventListener('mousedown', function (e) {
                            isDragging = true;
                            startOffset.x = e.clientX - box.offsetLeft;
                            startOffset.y = e.clientY - box.offsetTop;
                            this_Dom.style.cursor = 'move';
                        });
                        // 鼠标移动事件
                        document.addEventListener('mousemove', function (e) {
                            if (isDragging) {
                                box.style.top = (e.clientY - startOffset.y) + 'px';
                                box.style.left = (e.clientX - startOffset.x) + 'px';
                            }
                        });
                        // 鼠标松开事件
                        document.addEventListener('mouseup', function () {
                            var boxWidth = box.clientWidth;
                            var boxHeight = box.clientHeight;
                            var boxTop = box.offsetTop;
                            var boxleft = box.offsetLeft;
                            var viewportWidth = document.documentElement.clientWidth; // 视口宽度（目视可见区域 不含滚动条）
                            var viewportHeight = document.documentElement.clientHeight; // 视口高度（目视可见区域 不含滚动条）
                            if (boxTop < 0) box.style.top = "0px"
                            if (boxleft < 0) box.style.left = "0px"
                            if (boxleft + boxWidth > viewportWidth) box.style.left = viewportWidth - boxWidth + "px";
                            if (boxTop + boxHeight > viewportHeight) box.style.top = viewportHeight - boxHeight + "px";
                            isDragging = false;
                            this_Dom.style.cursor = 'default';
                        });
                    }),], Children: [],
                },
                {
                    Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "━" },
                    Dom_Style: { "borderRadius": "0px 5px 0px 0px", "padding": "5px 0px 5px 5px" },
                    Dom_ClassList: ["__My_MinButton"],
                    Dom_Event: {
                        click: ((e) => {
                            var target_Dom__My_MainBox = e.target.offsetParent.querySelector("div.__My_MainBox");
                            var target_Dom__My_FootBox = e.target.offsetParent.querySelector("div.__My_FootBox");
                            // GM_setValue("value1", {a:1});
                            // console.log(GM_listValues());
                            // GM_deleteValue("value1")

                            if (e.target.innerHTML == "━") {
                                e.target.innerHTML = "□";
                                target_Dom__My_MainBox.style.display = "none";
                                target_Dom__My_FootBox.style.display = "none";
                            } else {
                                e.target.innerHTML = "━";
                                target_Dom__My_MainBox.style.removeProperty("display");
                                target_Dom__My_FootBox.style.removeProperty("display");
                            }
                        })
                    },
                    Dom_Other_Event: [], Children: [],
                },
                {
                    Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "✖" },
                    Dom_Style: { "borderRadius": "0px 5px 0px 0px", "padding": "5px 5px 5px 0px" },
                    Dom_ClassList: ["__My_MinButton"],
                    Dom_Event: {
                        click: (function () {
                            // if (confirm("确定关闭本插件？\r\n按 Home 重新加载 UI 界面。")) {
                            // console.dir(this)
                            // console.log(BaseUI_config)
                            this.$Dom_rootElement.remove();
                            // BaseUI_config.$Dom_element.remove();
                            // };
                        })
                    },
                    Dom_Other_Event: [], Children: [],
                },
            ],
        }, {
            Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: {}, Dom_Style: {},
            Dom_ClassList: ["__My_MainBox"], Dom_Event: {},
            Dom_Other_Event: [
                ((this_Dom) => {
                    // var target_Dom = this_Dom.parentElement;
                    // BaseUI_config.$Dom_element
                    // console.log(this_Dom.$Dom_rootElement)
                    this_Dom.$Dom_rootElement.add_Dom = function (Dom) {
                        var isDOM = Dom instanceof HTMLElement && Dom.nodeType === 1;
                        if (isDOM) {
                            this_Dom.append(Dom);
                        }
                    }
                })
            ], Children: [],
        },
        {
            Dom_Type: "div", Dom_LoadInfo: {},
            Dom_Attribute: {
                innerHTML: GM_info.scriptHandler + " - v " + GM_info.version
            },
            Dom_Style: {
                "background-color": " #444",
                "color": "white",
                "padding": "0px 0px 0px 5px",
                "borderRadius": "0px 0px 5px 5px",
            }, Dom_ClassList: ["__My_FootBox"], Dom_Event: {},
            Dom_Other_Event: [], Children: [],
        },
    ],
};

// 2.1、配置 Plugin_Config，设置插件样式 及 插件功能。
var Plugin_Config = {
    // 2.1.1、调试类-VUE调试插件（通用）
    HotKey_Home_Plugin: {
        Name: "HotKey_Home_Plugin",
        DomGroup: [
            {
                Dom_Type: "div", Dom_LoadInfo: {},
                Dom_Attribute: { innerHTML: "Home热键呼出功能已注册", name: "asdasd" },
                Dom_Style: { "height": "auto" }, Dom_ClassList: ["__My_Plugin"], Dom_Event: {},
                Dom_Other_Event: [
                    (() => {
                        var original_onkeydown = document.onkeydown;
                        HTMLElement.prototype.original_remove = HTMLElement.prototype.remove
                        HTMLElement.prototype.remove = function () {
                            // this.original_remove();
                            HTMLElement.prototype.original_remove.call(this);
                            if (this == BaseUI_config.$Dom_element) {
                                document.onkeydown = function (event) {
                                    if (event.key.toLowerCase() === "home") {
                                        event.preventDefault();// 阻止默认行为
                                        event.stopPropagation();// 停止事件冒泡
                                        if (document.getElementById(BaseUI_config.$Dom_element.id) == null) {
                                            load_BaseUI();
                                            document.onkeydown = original_onkeydown;
                                        };
                                    };
                                };
                            }
                        };
                    })
                ], Children: [],
            },
        ],
    },

    // 2.1.2、调试类-VUE调试插件（通用）
    VueDebug_Plugin: {
        Name: "VUE调试插件",
        DomGroup: [
            {
                Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: {}, Dom_Style: {}, Dom_ClassList: ["__My_Plugin"], Dom_Event: {},
                Children: [
                    {
                        Dom_Type: "span", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "站点VUE调试组件" }, Dom_Style: Default_Css, Dom_ClassList: ["__My_Plugin_Span_Style"], Dom_Event: {}, Children: [],
                    },
                    {
                        Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "调试" }, Dom_Style: Default_Css,
                        Dom_ClassList: ["__My_Element_Hover_Style", "__My_Plugin_Button_Style", "__My_Plugin_Box_borderRadius"],
                        Dom_Event: { click: __Plugin_Event("__VueDebug_Plugin_Click_Event") }, Children: [],
                    },
                ],
            },
        ],
    },

    // 2.1.3、调试类-XHR_调试工具（通用）
    XHR_Debug_Plugin: {
        Name: "XHR_调试工具",
        DomGroup: [
            {
                Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: {}, Dom_Style: {}, Dom_ClassList: ["__My_Plugin"], Dom_Event: {},
                Children: [
                    {
                        Dom_Type: "span", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "XHR_调试工具" }, Dom_Style: Default_Css,
                        Dom_ClassList: ["__My_Plugin_Span_Style"], Dom_Event: {}, Children: [],
                    },
                    {
                        Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "开启监听" }, Dom_Style: Default_Css,
                        Dom_ClassList: ["__My_Element_Hover_Style", "__My_Plugin_Button_Style", "__My_Plugin_Box_borderRadius"],
                        Dom_Event: { click: __Plugin_Event("__XHR_Debug_Plugin_Click_Event") }, Children: [],
                    },
                ],
            },
        ],
    },

    // 2.1.4、调试类-一之题库请求测试（通用）
    Baidutest_Plugin: {
        Name: "百度-一之题库请求测试",
        DomGroup: [
            {
                Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: {}, Dom_Style: {}, Dom_ClassList: ["__My_Plugin"], Dom_Event: {},
                Children: [
                    {
                        Dom_Type: "span", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "百度-一之题库请求测试" }, Dom_Style: Default_Css, Dom_ClassList: ["__My_Plugin_Span_Style"], Dom_Event: {}, Children: [],
                    },
                    {
                        Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "点这里" }, Dom_Style: Default_Css,
                        Dom_ClassList: ["__My_Element_Hover_Style", "__My_Plugin_Button_Style", "__My_Plugin_Box_borderRadius"],
                        Dom_Event: { click: __Plugin_Event("__Baidutest_Plugin_Click_Event") }, Children: [],
                    },
                ],
            },
        ],
    },

    // 2.2、Video自动播放插件（基本通用）
    VideoAutoPlay_Plugin: {
        Name: "Video自动播放",
        DomGroup: [
            {
                Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: {}, Dom_Style: {}, Dom_ClassList: ["__My_Plugin"], Dom_Event: {},
                Children: [
                    {
                        Dom_Type: "span", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "智能播放", }, Dom_Style: Default_Css, Dom_ClassList: ["__My_Plugin_Span_Style"], Dom_Event: {}, Children: [],
                    },
                    {
                        Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "已停用" }, Dom_Style: Default_Css,
                        Dom_ClassList: ["__My_Element_Hover_Style", "__My_Plugin_Button_Style", "__My_Plugin_Box_borderRadius"],
                        Dom_Event: { click: __Plugin_Event("__VideoAutoPlay_Plugin_Disable_Enable_Event") }, Children: [],
                    },
                ],
            },
            {
                Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: {}, Dom_Style: {}, Dom_ClassList: ["__My_Plugin"], Dom_Event: {},
                Children: [
                    {
                        Dom_Type: "span", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "播放倍数", }, Dom_Style: Default_Css, Dom_ClassList: ["__My_Plugin_Span_Style"], Dom_Event: {}, Children: [],
                    },
                    {
                        Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "1倍速" }, Dom_Style: Default_Css,
                        Dom_ClassList: ["__My_Element_Hover_Style", "__My_Plugin_Button_Style", "__My_Plugin_Box_borderRadius"],
                        Dom_Event: { click: __Plugin_Event("__VideoAutoPlay_Plugin_Play_Multiple_Event") }, Children: [],
                    },
                ],
            },
        ],
    },

    // 2.3、贵州省党员干部网络学院专属一键完成插件（非通用）OneKeyComplete_Plugin_For_gzwy_gov_cn
    OneKeyComplete_Plugin_For_gzwy_gov_cn: {
        Name: "贵州省党员干部网络学院专属一键完成插件",
        DomGroup: [
            {
                Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: {}, Dom_Style: {}, Dom_ClassList: ["__My_Plugin"], Dom_Event: {},
                Children: [
                    {
                        Dom_Type: "span", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "一键完成" }, Dom_Style: Default_Css, Dom_ClassList: ["__My_Plugin_Span_Style"], Dom_Event: {}, Children: [],
                    },
                    {
                        Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "点这里" }, Dom_Style: Default_Css,
                        Dom_ClassList: ["__My_Element_Hover_Style", "__My_Plugin_Button_Style", "__My_Plugin_Box_borderRadius"],
                        Dom_Event: { click: __Plugin_Event("OneKeyComplete_Plugin_For_gzwy_gov_cn_Click_Event") }, Children: [],
                    },
                ],
            },
        ],
    },

    // 2.4、贵州省专业技术人员继续教育专属一键完成插件（非通用）OneKeyComplete_Plugin_For_gzjxjy_gzsrs_cn
    OneKeyComplete_Plugin_For_gzjxjy_gzsrs_cn: {
        Name: "贵州省专业技术人员继续教育专属一键完成插件",
        DomGroup: [
            {
                Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: {}, Dom_Style: {}, Dom_ClassList: ["__My_Plugin"], Dom_Event: {},
                Children: [
                    {
                        Dom_Type: "span", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "一键完成" }, Dom_Style: Default_Css, Dom_ClassList: ["__My_Plugin_Span_Style"], Dom_Event: {}, Children: [],
                    },
                    {
                        Dom_Type: "div", Dom_LoadInfo: {}, Dom_Attribute: { innerHTML: "点这里" }, Dom_Style: Default_Css,
                        Dom_ClassList: ["__My_Element_Hover_Style", "__My_Plugin_Button_Style", "__My_Plugin_Box_borderRadius"],
                        Dom_Event: { click: __Plugin_Event("OneKeyComplete_Plugin_For_gzjxjy_gzsrs_cn_Click_Event") }, Children: [],
                    },
                ],
            },
        ],
    },
};

// 3、配置 __Plugin_Event，上述Plugin_Config中的插件实现方法function全部汇总写到这里，方便清晰结构。
function __Plugin_Event(Fn_Name = "") {
    switch (Fn_Name) {
        case "__VueDebug_Plugin_Click_Event":
            // 3.0、Vue调试插件 实现方法（通用） 页面 调试 代码 
            return function () {
                console.log("Vue调试插件，__VueDebug_Plugin_Click_Event");
                console.log("获取app.__vue__节点及以下所有Vue组件，GetAllVueComponent");
                var Filter_Fns = [
                    (item) => {
                        var returnA = false;
                        // var innerText = item.innerText;
                        // var regex;
                        // if (innerText !== "" && typeof innerText !== "undefined") {
                        //     regex = /[\r\n\s]+/gims;// 空格、换行符
                        //     console.log(regex)
                        //     innerText = innerText.replace(regex, "");// 替换 空格、换行符
                        //     console.log(innerText);
                        //     regex = /^联系方式$/gims;
                        //     returnA = regex.test(innerText);
                        // }                        
                        returnA = (
                            typeof item.__vue__ !== "undefined" ||
                            typeof item.__vue_app__ !== "undefined"
                        ) ? true : false;
                        return returnA
                    },
                ]
                var Target_vue = __Public_Fn("Get_VueComponent_In_DomDescendants")("document.body", Filter_Fns, []);
                // var aaa = Target_vue[0].DomNode.__vue_app__._context.optionsCache
                // console.log(Target_vue[0].DomNode.__vue_app__._context);
                // for (let [key, value] of aaa) {
                //     console.log(key);
                //     console.log(value);
                // }

                console.log(Target_vue);
            };

        case "__XHR_Debug_Plugin_Click_Event":
            return (() => {
                var originalOpen = XMLHttpRequest.prototype.open;
                var originalSend = XMLHttpRequest.prototype.send;
                return function () {
                    console.log("__XHR_Debug_Plugin_Click_Event");
                    if (this.innerHTML == "开启监听") {
                        this.innerHTML = "停止监听"
                        this.style.color = "#f00";
                        XMLHttpRequest.prototype.open = function (method, url, async) {
                            this._method = method;
                            this._url = url;
                            // XHR 请求
                            console.log('Request method:', this);
                            console.log('Request arguments:', arguments);
                            originalOpen.apply(this, arguments);
                        };
                        XMLHttpRequest.prototype.send = function (body) {
                            this._body = body;
                            this.addEventListener('load', function () {
                                // 这里可以访问 `this.response` 或者其他你需要的属性
                                // XHR 响应结果
                                console.log('Request URL:', this._url);
                                console.log('Response data:', this.response);
                            });
                            originalSend.apply(this, arguments);
                        };
                    } else {
                        this.innerHTML = "开启监听";
                        this.style.color = "#000";
                        XMLHttpRequest.prototype.open = originalOpen;
                        XMLHttpRequest.prototype.send = originalSend;
                    }
                };
            })();

        case "__Baidutest_Plugin_Click_Event":
            // 3.1、百度测试插件 实现方法（通用）
            return async function () {
                // console.log("这里是 测试插件集合 __Baidutest_Plugin_Click_Event 输出");
                console.log(__Public_Fn("generateID")());

                //以下调试 智能答题 题库请求相关


                // 题库海请求 测试未通过，待测试。api文档来源 https://www.tikuhai.com/fans/api
                // https://www.tikuhai.com/fans/
                // key	5b744a8d5c251ce6ba9bf1986944a7d0	是	string	秘钥
                // question	不是金黄色葡萄球菌引起的疾病是	是	string	题目
                // option	["食物中毒", "肉毒毒素中毒", "烫伤样皮肤综合征", "毒性休克综合征"]	是	string	选项数组字符串
                // questionData	<div><h1>不是金黄色葡萄球菌引起的疾病是</h1>...</div>	否	string	题目原格式html,可不传
                // var opt={
                //     method:'POST',
                //     url:"https://www.tikuhai.com/api/accurateSearch",
                //     headers:{"Content-Type": "application/x-www-form-urlencoded",}, // application/json 表示请求体是 JSON 格式的数据，application/x-www-form-urlencoded 表示请求体是表单数据。
                //     data:{
                //         key:"5b744a8d5c251ce6ba9bf1986944a7d0",
                //         question:"不是金黄色葡萄球菌引起的疾病是",
                //         option:["食物中毒", "肉毒毒素中毒", "烫伤样皮肤综合征", "毒性休克综合征"],
                //         questionData:"<div><h1>不是金黄色葡萄球菌引起的疾病是</h1></div>"
                //     },
                //     timeout:5000
                // }

                // 王一之题库2请求 测试未通过，待测试。api文档来源 https://tk.enncy.cn/user/dashboard
                // var question = "不是金黄色葡萄球菌引起的疾病是";
                // var token="wYfKwnj1QPNkK0Ql";
                // var simple="false";
                // var opt={
                //     method:"POST",
                //     url:"http://cx.icodef.com/wyn-nb?v=4",
                //     headers:{"Content-Type": "application/x-www-form-urlencoded; charset=utf-8","Authorization": token},
                //     data:{question: "不是金黄色葡萄球菌引起的疾病是",title: "不是金黄色葡萄球菌引起的疾病是"}
                // };


                // （免费）王一之题库1请求 测试通过。api文档来源 https://q.icodef.com/question/api#%E4%BD%BF%E7%94%A8-curl-%E5%AE%9E%E7%8E%B0%E7%A4%BA%E4%BE%8B
                var question = encodeURI("不是金黄色葡萄球菌引起的疾病是");
                var token = "wYfKwnj1QPNkK0Ql";
                var simple = "false";
                // eslint-disable-next-line
                var opt = {
                    method: "GET",
                    url: `https://q.icodef.com/api/v1/q/${question}?simple=${simple}`,
                    headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": token, },
                    data: ""
                };

                // （收费/新注册免100次）言溪题库请求 测试通过。 api文档来源 https://tk.enncy.cn/user/dashboard
                // var token = "1bfdc88c5e3842d2adb6d91afd357637";
                // var title = "不是金黄色葡萄球菌引起的疾病是";
                // var options =encodeURI(JSON.stringify(["食物中毒", "肉毒毒素中毒", "烫伤样皮肤综合征", "毒性休克综合征"]));
                // var type = 1;
                // var opt={
                // method:"GET",
                // url:`https://tk.enncy.cn/query?token=${token}&title=${title}&options=${options}&type=${type}`,
                // headers:{"Content-Type": "application/x-www-form-urlencoded"},
                // data:""
                // };


                // 请求部分
                // var res = await __Public_Fn("answerApi_Promise_GM_xmlhttpRequest")(opt).then( res => { return res;}).catch( error => { return error;});
                // console.log('最终输出:', __Public_Fn("JSONStrToJSONObject")(res.responseText));


                //以上调试 智能答题 题库请求相关
            };

        case "__VideoAutoPlay_Plugin_Disable_Enable_Event":
            // 3.2.1、智能播放插件 实现方法（可通用）
            var timerInterval_AutoPlay;
            return function () {
                if (this.innerHTML == "已停用") {
                    this.innerHTML = "已启用";
                    this.style.color = "#f00";
                    this.style["font-weight"] = 900;
                    timerInterval_AutoPlay = setInterval(() => {
                        $("video").trigger("play");//后台持续播放
                        // $("video").prop("muted", true);//静音
                    }, Global_Parameters.IntervalTime);
                } else {
                    this.innerHTML = "已停用";
                    this.style.color = "#000"
                    this.style["font-weight"] = "";
                    clearInterval(timerInterval_AutoPlay); // 清除定时器
                }
            };

        case "__VideoAutoPlay_Plugin_Play_Multiple_Event":
            // 3.2.2、播放倍数插件 实现方法（可通用）
            return function () {
                if (this.innerHTML == "1倍速") {
                    this.innerHTML = "10倍速";
                    this.style.color = "#f00";
                    this.style["font-weight"] = 900;
                    $("video").prop("playbackRate", "10");
                } else {
                    this.innerHTML = "1倍速";
                    this.style.color = "#000"
                    this.style["font-weight"] = "";
                    $("video").prop("playbackRate", "1");
                }
            };

        case "OneKeyComplete_Plugin_For_gzwy_gov_cn_Click_Event":
            // 3.3、贵州省党员干部网络学院专属一键完成插件 实现方法（专属）
            return function () {
                console.log("OneKeyComplete_Plugin_For_gzwy_gov_cn_Click_Event");
                //$("video")[0].pause();
                //__this.pause();
                var __this = $("#app")[0].__vue__.$children[0].$children[0].$children[0].$children[0].$children[0].$children[0];
                var t = {
                    courseId: __this.queryiId,
                    coursewareId: __this.curPlayItem && __this.curPlayItem.id,
                    watchPoint: __this.formatSeconds(__this.curVideoAllTime),
                    pulseRate: __this.playrate,
                    pulseTime: 10,
                };
                if (__this.isView == 1) {
                    t = Object.assign(t, { isView: 1 });
                }
                __this.realWatchTime2 = __this.curVideoAllTime;
                __this.updateProgress(t);
            };

        case "OneKeyComplete_Plugin_For_gzjxjy_gzsrs_cn_Click_Event":
            // 3.4、贵州省专业技术人员继续教育专属一键完成插件 实现方法（专属）
            return function () {
                console.log("OneKeyComplete_Plugin_For_gzjxjy_gzsrs_cn_Click_Event");
                $("#app")[0].__vue__.$children[0].player.tech_.setCurrentTime($("#app")[0].__vue__.$children[0].totalHour);
                $("#app")[0].__vue__.$children[0].onPlayerEnded();
            };

        case "Next_FnName1":
            return function () { console.log("Next_FnName1"); };

        case "Next_FnName2":
            return function () { console.log("Next_FnName2"); };

        default:
            return function () { console.log("null"); };
    }
}

// 4、配置 Document_ClassList，配置插件需要引用的css，并以<style>...</style>标签方式添加到页面头部<head>中，一般普通站点插件配置不需改动。
var Document_ClassList = [
    {
        Selector: ".__My_Element_Hover_Style:hover",
        Style: { "animation": "__MorphingAnimation 0.3s forwards" },
    },
    {
        Selector: "@keyframes __MorphingAnimation",
        Style: "{to{background-color: white;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.5);}}",
        // Style:"{to{background-color: powderblue;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.5);}}",
    },
    {
        Selector: ".__My_Plugin",
        Style: { "height": "40px", "display": "flex", "align-items": "center", "justify-content": "space-evenly", "-webkit-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none" },
    },
    {
        Selector: ".__My_Plugin_Span_Style",
        Style: { "min-height": "19px", "width": "50%", "text-align": "center" },
    },
    {
        Selector: ".__My_Plugin_Button_Style",
        Style: { "min-height": "19px", "width": "40%", "padding": "2px", "cursor": "pointer", "text-align": "center", "transition": "transform 0.1s" },
    },
    {
        Selector: ".__My_Plugin_Button_Style:active",
        Style: { "transform": "scale(0.9)" },
    },
    {
        Selector: ".__My_Plugin_Box_borderRadius",
        Style: { "border": "1px #000 solid", "border-Radius": "5px" },
    },
    {
        Selector: ".__My_MinButton:hover",
        Style: { "cursor": "pointer" },
    },
    {
        Selector: ".__My_MinButton",
        Style: { "text-align": "center", "margin": "0px", "padding": "5px", "width": "calc( 20px)", },
    },
];


// 脚本入口
(function () {
    'use strict';
    /* globals  $,   */
    console.log("辅助启动");
    load_BaseUI();

})();

// 这是一个 节点 监视器 （目前监视 页面头部 变化）（未启用）
// function add_BaseStyleToHtmlHead() {
//     // 选择需要观察变动的节点
//     const targetNode = document.querySelector('head');
//     // 创建一个观察器实例并传入回调函数
//     const observer = new MutationObserver(mutationsList => {
//         mutationsList.forEach(mutation => {
//             if (mutation.type === "childList" && mutation.removedNodes.length > 0 && mutation.removedNodes[0].nodeName == "STYLE") {
//                 console.log("<head> 发生了变动：", mutation);
//                 console.log("<head> 发生了变动：", mutation.removedNodes[0].innerHTML);
//             }
//         });
//     });
//     // 观察目标节点的子节点的变化，这里我们关注子节点的增加和删除
//     const config = { attributes: false, childList: true, subtree: false };
//     // 开始观察已配置观察的目标节点
//     observer.observe(targetNode, config);
// }

function load_BaseUI() {
    if (BaseUI_config.$Dom_element == void 0) {
        // 创建基本界面DOM
        __Public_Fn("Create_Dom")(BaseUI_config);

        // 加载业务模块到 基本界面DOM
        add_Ribbon(BaseUI_config.$Dom_element);

        // 加载插件到页面
        // document.head.after(BaseUI);

    } else {
        BaseUI_config.Dom_LoadInfo.Parent_Element[BaseUI_config.Dom_LoadInfo.Add_Method](BaseUI_config.$Dom_element);
    };
}



//业务模块主控
function add_Ribbon(BaseUI) {
    var style = document.createElement('style');
    style.type = "text/css";
    Document_ClassList.map(Class => {
        if (__Public_Fn("HasClassInCSS")(Class.Selector)) return;
        var css = Class.Selector + "{}";
        if (typeof Class.Style === "object") {
            css = Class.Selector + "{" + Object.entries(Class.Style).map(([k, v]) => `${k}:${v}`).join(";") + "}";
        } else if (typeof Class.Style === "string") {
            css = Class.Selector + Class.Style
        } else {
            return
        }
        var Dom_css = document.createRange().createContextualFragment(css);// WebKit, Blink, Edge 等浏览器使用 createDocumentFragment
        style.appendChild(Dom_css);
    })
    BaseUI.prepend(style)

    // append(),在父级最后追加一个子元素
    // appendTo(),将子元素追加到父级的最后
    // prepend(),在父级最前面追加一个子元素
    // prependTo(),将子元素追加到父级的最前面
    // after(),在当前元素之后追加（是同级关系）
    // before(),在当前元素之前追加（是同级关系）
    // insertAfter(),将元素追加到指定对象的后面（是同级关系）
    // insertBefore(),将元素追加到指定对象的前面（是同级关系）
    // appendChild(),在节点的最后追加子元素
    // document.head.after(Style_box); // after 之后


    // console.log("添加 插件")
    Web_Config.map(Site => {
        if (__Public_Fn("IsTargetWeb")(Site.Url)) {
            // IsTargetWeb() 函数 判断当前页面 PageUrl 是否 为 Web_Config .Url 配置中设置的网站，
            // 若比较成功，则按 Web_Config .Use_Plugin 配置加载指定 插件
            var test_Dom = document.createElement("div")
            if (Site.Use_Plugin.length > 0) {
                Site.Use_Plugin.map(Plugin => {
                    if (typeof Plugin_Config[Plugin] === "undefined") {
                        test_Dom.innerHTML = "Error：\"" + Plugin + "\"未找到";
                        BaseUI.add_Dom(test_Dom);
                        return;
                    }
                    Plugin_Config[Plugin].DomGroup.map(Plugin_Dom_node => {
                        // Plugin_Dom_info 存在子元素创建，按递归方法完成
                        var Plugin_Dom = __Public_Fn("Create_Dom")(Plugin_Dom_node);
                        BaseUI.add_Dom(Plugin_Dom);
                    })
                });
            } else {
                test_Dom.innerHTML = "未配置插件";
                BaseUI.add_Dom(test_Dom);
            }
        }
    })
}



//公共函数部分
function __Public_Fn(Fn_Name = "") {
    switch (Fn_Name) {
        case "matchStr":
            // 1、通用 通配符字符串比较
            // 用法：
            // My_matchStr(原始字符串,带通配符字符串)
            // 返回true/false
            // 仅支持*，不支持?
            return function (str1, str2) {
                if (typeof str1 == "undefined" || typeof str2 == "undefined") return false;
                return matchRuleShort(str1, str2);
                function matchRuleShort(str, rule) {
                    // eslint-disable-next-line 
                    var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
                }
            }
        case "answerApi_Promise_GM_xmlhttpRequest":
            // 2、通用 GM_xmlhttpRequest + Promise请求 可解决跨域问题
            // question	不是金黄色葡萄球菌引起的疾病是	是	string	题目
            // option	["食物中毒", "肉毒毒素中毒", "烫伤样皮肤综合征", "毒性休克综合征"]	是	string	选项数组字符串
            return async function (opt = {
                // method:"POST",
                // url:"",
                // headers:{"Content-Type": "application/json;charset=utf-8","Authorization": "TOKEN",},
                // data:JSON.stringify({"question": "不是金黄色葡萄球菌引起的疾病是","options": ["食物中毒", "肉毒毒素中毒", "烫伤样皮肤综合征", "毒性休克综合征"],"type": 1})
            }) {
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: opt.method,
                        url: opt.url,
                        headers: opt.headers,
                        data: opt.data,
                        onload: function (res) {
                            try {
                                resolve(res);
                            } catch (e) {
                                resolve([]);
                            }
                        },
                        onerror: function (e) {
                            console.log(e);
                            resolve([]);
                        }
                    });
                });
            }

        case "JSONStrToJSONObject":
            // 3、通用 JSON字符串转JSONObject
            return function (str) {
                if (typeof str == 'string') {
                    try {
                        var obj = JSON.parse(str);
                        if (typeof obj == 'object' && obj) {
                            return obj;
                        } else {
                            return str;
                        }
                    } catch (e) {
                        return str;
                    }
                } else {
                    return str;
                }
            }

        case "IsTargetWeb":
            return function (Urls) {
                var r = false;
                if (!Array.isArray(Urls)) return r
                Urls.map((e) => {
                    if (__Public_Fn("matchStr")(PageUrl, e)) {
                        r = true
                    }
                })
                return r
            }

        case "Create_Dom":
            return function (
                Opt_config = {
                    Dom_Type: "div",
                    Dom_LoadInfo: {},
                    Dom_Attribute: {}, Dom_Style: {}, Dom_ClassList: [], Dom_Event: {}, Dom_Other_Event: [(() => { })], Children: []
                }
            ) {
                // 创建Doms
                // var Parent_Element;
                var Default_Dom_config = {
                    Dom_Type: "div",
                    Dom_LoadInfo: {},
                    Dom_Attribute: {},
                    Dom_Style: {},
                    Dom_ClassList: [],
                    Dom_Event: {},
                    Dom_Other_Event: [(() => { })],
                    Children: [],
                };
                var Dom_config = Object.assign({}, Default_Dom_config, Opt_config);
                var test_Dom = document.createElement(Dom_config.Dom_Type);
                // typeof Parent_Element !== "undefined" ? Parent_Element[Add_Method](test_Dom) : void 0;
                typeof Dom_config.Dom_LoadInfo.Parent_Element !== "undefined" ? Dom_config.Dom_LoadInfo.Parent_Element[Dom_config.Dom_LoadInfo.Add_Method](test_Dom) : void 0;


                Opt_config.$Dom_element = test_Dom;
                Opt_config.$Dom_parentElement = test_Dom.parentElement;
                Opt_config.Dom_LoadInfo.Dom_rootElement = typeof Opt_config.Dom_LoadInfo.Dom_rootElement == "undefined" ? test_Dom : Opt_config.Dom_LoadInfo.Dom_rootElement;
                Opt_config.$Dom_rootElement = typeof Opt_config.Dom_LoadInfo.Dom_rootElement == "undefined" ? test_Dom : Opt_config.Dom_LoadInfo.Dom_rootElement;
                Opt_config.$Dom_config = Opt_config;
                test_Dom.$Dom_element = test_Dom;
                test_Dom.$Dom_parentElement = test_Dom.parentElement;
                test_Dom.$Dom_rootElement = typeof Opt_config.Dom_LoadInfo.Dom_rootElement == "undefined" ? test_Dom : Opt_config.Dom_LoadInfo.Dom_rootElement;
                test_Dom.$Dom_config = Opt_config;



                for (let key in Dom_config.Dom_Attribute) { test_Dom[key] = Dom_config.Dom_Attribute[key]; }
                for (let key in Dom_config.Dom_Style) { test_Dom.style[key] = typeof Dom_config.Dom_Style[key] == "function" ? Dom_config.Dom_Style[key](test_Dom) : Dom_config.Dom_Style[key]; }
                for (let key in Dom_config.Dom_ClassList) { test_Dom.classList.add(Dom_config.Dom_ClassList[key]); }
                for (let key in Dom_config.Dom_Event) { test_Dom.addEventListener(key, Dom_config.Dom_Event[key]); }
                for (let key in Dom_config.Dom_Other_Event) { Dom_config.Dom_Other_Event[key](test_Dom); }
                Dom_config.Children.map(Children_Dom => {
                    Children_Dom.Dom_LoadInfo = { Dom_rootElement: test_Dom.$Dom_rootElement, Parent_Element: test_Dom, Add_Method: "append" };
                    __Public_Fn("Create_Dom")(Children_Dom);
                });
                return test_Dom
            }

        case "HasClassInCSS":
            return function (className) {
                // console.log("HasClassInCSS");
                var styleSheets = document.styleSheets;
                for (var i = 0; i < styleSheets.length; i++) {
                    try {
                        var rules = styleSheets[i].cssRules;
                        for (var j = 0; j < rules.length; j++) {
                            if (rules[j].selectorText && rules[j].selectorText.split(',').indexOf(className) !== -1) {
                                return true;
                            }
                        }
                    } catch (e) {
                        // console.warn('Cannot access rules of cross-origin stylesheet: ', e, styleSheets[i].href);
                    }
                }
                return false;
            }

        case "generateID":
            // 随机ID生成
            return function (id_model = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx", radix = 36) {
                var model = id_model.toLowerCase().replace(/^./, "y"), radix1, radix2;
                radix1 = (radix >= 1 && radix <= 36) ? radix : (radix < 1 ? 1 : 36);
                radix2 = (radix >= 1 && radix <= 26) ? radix : (radix < 1 ? 1 : 26);
                // if ( radix >= 1 && radix <= 36 ) { radix1 = radix } else if ( radix < 1 ) { radix1 = 1 } else { radix1 = 36 };
                // if ( radix >= 1 && radix <= 26 ) { radix2 = radix } else if ( radix < 1 ) { radix2 = 1 } else { radix2 = 26 };
                var A = [..."abcdefghijklmnopqrstuvwxyz0123456789"];
                var test = model.replace(/[xy]/g, function (c) {
                    var v;
                    if (c === "x") {
                        v = A[Math.random() * radix1 | 0]
                    }
                    if (c === "y") {
                        v = A[Math.random() * radix2 | 0]
                    }
                    return v;
                });
                return test
            }


        case "getScrollbarWidth":
            // 获取页面body滚动条宽度 （目前无引用）
            return function () {
                const scrollDiv = document.createElement('div');
                scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
                document.body.appendChild(scrollDiv);
                const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                document.body.removeChild(scrollDiv);
                return scrollbarWidth;
            }


        case "GetAllVueComponent":
            // 获取 RootNode 节点及以下所有 Vue 组件
            return function (RootNode, Query_Fn = item => typeof item.$data.inputValue !== "undefined" ? true : true, VueComponents = [], route = "root") {
                // console.log("GetAllVueComponent");
                if (typeof RootNode.$el === "object") {
                    if (Query_Fn(RootNode)) {
                        VueComponents.push({ Node: RootNode, Element: RootNode.$el, route: route, data: RootNode.$data });
                    }

                    if (typeof RootNode.$children === "object" && Array.isArray(RootNode.$children)) {
                        RootNode.$children.map((child, index) => {
                            route = route + ".$children[" + index + "]"
                            VueComponents = __Public_Fn("GetAllVueComponent")(child, Query_Fn, VueComponents, route);
                        })
                    }
                }
                return VueComponents;
            }


        case "Get_VueComponent_In_DomDescendants":
            // 纯 Dom 方式获取 Dom及其后代 元素 中的 Vue 组件
            return function (DomRouteStr = "document.body", Filter_Fns = [item => item ? true : true, item => item ? true : true], VueComponents = []) {
                var DomRouteNode = eval(DomRouteStr);
                var FilteraResultArr = Filter_Fns.map(Filter_item => Filter_item(DomRouteNode));
                // console.log(FilteraResultArr.every(Boolean) ? "全为true" : "非全true");

                if (FilteraResultArr.every(Boolean)) {
                    VueComponents.push({ "DomNode": DomRouteNode, "DomRoute": DomRouteStr });
                }

                var NewDomRouteStr;
                for (let index = 0; index < DomRouteNode.children.length; index++) {
                    NewDomRouteStr = DomRouteStr + ".children[" + index + "]";
                    VueComponents = __Public_Fn("Get_VueComponent_In_DomDescendants")(NewDomRouteStr, Filter_Fns, VueComponents);
                }
                // if (DomRouteNode.children.length > 0) {
                //     DomRouteNode.children.forEach((item, index) => {
                //         NewDomRouteStr = DomRouteStr + ".children[" + index + "]";
                //         VueComponents = __Public_Fn("Get_VueComponent_In_DomDescendants")(NewDomRouteStr, Filter_Fns, VueComponents);
                //     })
                // }
                return VueComponents;
            };


        case "Next_FnName1":
            return function () {
                console.log("Next_FnName1");
            }


        case "Next_FnName2":
            return function () {
                console.log("Next_FnName2");
            }

        default:
            return function () {
                console.log("null")
            }
    }
}
