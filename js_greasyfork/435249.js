// ==UserScript==
// @name         网页TDKI等信息内容展示
// @namespace    https://github.com/techstay/myscripts
// @version      0.1
// @description  本脚本用于展示网页的 标题、链接、描述、关键字、图标、预览图等信息 并可支持双击选中复制  ，便于快捷使用网页信息，免于控制台 HTML结构内查找
// @author       xynagisa
// @match        **://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/435249/%E7%BD%91%E9%A1%B5TDKI%E7%AD%89%E4%BF%A1%E6%81%AF%E5%86%85%E5%AE%B9%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/435249/%E7%BD%91%E9%A1%B5TDKI%E7%AD%89%E4%BF%A1%E6%81%AF%E5%86%85%E5%AE%B9%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var showIconsList = [];
    var showImagesList = [];
    var httpRegex = new RegExp(/http/);

    window.onload = function () {
        var script = document.createElement("script");
        script.src = "https://cdn.bootcdn.net/ajax/libs/fetch/3.6.2/fetch.js";
        script.setAttribute("type", "text/javascript");
        console.log("pre F");
        script.onload = function () {
            console.log("加载完毕");
            loadInfo(true);
        };

        script.onerror = function (e) {
            console.log("err", e);
            loadInfo(false);
        };

        function loadInfo(hasLoadFetch) {
            // ~~ 获取网页的 Icon
            function getIcons() {
                // 方式一 直接获取link属性 截取url。 shortcut icon 是过时的写法
                var textArr = [
                    "shortcut icon",
                    "icon",
                    "alternate icon",
                    "mask-icon",
                    "apple-touch-icon",
                ];
                textArr.forEach(function (item) {
                    var checkQuery = document.querySelector(`link[rel="${item}"]`);
                    if (!checkQuery) {
                        return;
                    }
                    var checkHref = checkQuery.href;
                    if (checkHref) {
                        showIconsList.push(checkHref);
                    }
                });

                // 方式二 PWA 应用可以获取根域名的manifest  有链接的返回链接 没有的直接进行拼接
                // 只有 fetch 引入成功时才可以使用
                if (hasLoadFetch) {
                    var feil = document.querySelector('link[rel="manifest"]')?.href;
                    console.log("%c查找mainfest信息", "color:orange", feil);
                    if (feil) {
                        fetch(feil)
                            .then(function (res) {
                            return res.json();
                        })
                            .then((data) => {
                            if (!data.icons || !data.icons.length) return;

                            data.icons.forEach(function (iconItem, iconIndex) {
                                var url = httpRegex.test(iconItem.src)
                                ? iconItem.src
                                : document.location.origin + "/" + iconItem.src;
                                showIconsList.push(url);
                            });

                            console.log(
                                "%c预存-mainfest.json数据 ",
                                "color:blue",
                                data,
                                showIconsList
                            );

                            setTimeout(function () {
                                refreshIconImg();
                            }, 2000);
                        });
                    }
                }

                // 方式三 未设置 link rel=type,而是直接放到网站根目录下，浏览器会  直接获取 favicon.ico
                var img = new Image();
                img.src = document.location.origin + "/favicon.ico";
                img.onload = function () {
                    showIconsList.push(img.src);

                    console.log("获取到favcion", img.src, showIconsList);
                    setTimeout(function () {
                        refreshIconImg();
                    }, 2000);
                };
                img.onerror = function () {
                    console.log("该链接无效");
                };
            }

            // 获取网页描述
            function getDesc() {
                var textArrDes = ["description", "twitter:description"];
                var richArrs = ["og:description", "twitter:description"];
                var metas = document.getElementsByTagName("meta");

                var subMetas = [];
                for (var i = 0; i < metas.length; i++) {
                    if (textArrDes.includes(metas[i].getAttribute("name"))) {
                        subMetas.push(metas[i].getAttribute("content"));
                    }
                    if (richArrs.includes(metas[i].getAttribute("property"))) {
                        subMetas.push(metas[i].getAttribute("content"));
                    }
                }
                console.log("描述List", subMetas);
                return subMetas;
            }

            // ~~ 获取网页预览图
            function getImgs() {
                var textArrDes = ["image", "twitter:image", "twitter:image:src"];
                var richArrs = ["og:image"];
                var catchProperty = ["name", "property", "itemprop"];
                var metas = document.getElementsByTagName("meta");

                var subImgs = [];
                // 摆烂 - 没有的不会匹配到 - 就这样吧
                for (var i = 0; i < metas.length; i++) {
                    catchProperty.forEach(function (y) {
                        if (textArrDes.includes(metas[i].getAttribute(y))) {
                            subImgs.push(metas[i].getAttribute("content"));
                        }
                        if (richArrs.includes(metas[i].getAttribute(y))) {
                            subImgs.push(metas[i].getAttribute("content"));
                        }
                    });
                }
                console.log("预览图List", subImgs);
                showImagesList = subImgs;
            }

            // 获取网页title
            var titles = document.getElementsByTagName("title");
            var pageTitle = titles[0].innerText;

            // 获取网页链接
            var linkUrl = window.location.href;

            // descipiton
            var desc = getDesc()[0];

            // 获取网页关键词
            var hasKeys = document.querySelector('meta[name="keywords"]');
            var keywords = hasKeys ? hasKeys.content : "";

            // 获取网页icon
            getIcons();

            // 获取网页预览图
            getImgs();

            console.log("%c获取网页title", "color:skyblue", pageTitle);
            console.log("%c获取网页description", "color:skyblue", desc);
            console.log("%c获取网页关键词", "color:skyblue", keywords);
            console.log("%c获取网页图标", "color:green", showIconsList);
            console.log("%c获取网页预览图", "color:green", showImagesList);
            addContent();

            // 获取之后 添加 遮罩面板到项目内部
            function addContent() {
                var div = document.createElement("div");
                div.id = "xy-auto-webs-panel";
                div.className = "xy-auto-webs-panel xy-none";

                // 添加文字
                var topTags = [
                    { name: "标题", key: "title", content: pageTitle },
                    { name: "链接", key: "link", content: linkUrl },
                    { name: "描述", key: "description", content: desc },
                    { name: "关键词", key: "keywords", content: keywords },
                ];
                topTags.forEach(function (item) {
                    var itemDiv = document.createElement("div");
                    itemDiv.name = itemDiv.key;
                    itemDiv.className = "xy-auto-webs-panel-item";

                    var p = document.createElement("div");
                    p.innerText = item.name;
                    p.className = "xy-auto-webs-panel-item-title";

                    var content = document.createElement("div");
                    content.innerText = item.content || "";
                    content.className = "xy-auto-webs-panel-item-content xy-select-all";
                    content.onmousedown = () => {
                        navigator.clipboard.writeText(item.content);
                    };

                    itemDiv.appendChild(p);
                    itemDiv.appendChild(content);
                    div.appendChild(itemDiv);
                });

                // 添加 图标
                var imgTags = [
                    { name: "图标", key: "icon", content: showIconsList },
                    { name: "预览图", key: "image", content: showImagesList },
                ];

                imgTags.forEach(function (item, index) {
                    var itemDiv = document.createElement("div");
                    itemDiv.name = itemDiv.key;
                    itemDiv.className = "xy-auto-webs-panel-item";

                    var p = document.createElement("div");
                    p.innerText = item.name;
                    p.className = "xy-auto-webs-panel-item-title";

                    var content = document.createElement("div");
                    content.className = "xy-auto-webs-panel-item-content";
                    content.id = `xy-auto-webs-panel-item-content-${index + 1}`;

                    // content 下 添加自定义数量的节点
                    item.content = [...new Set(item.content)];
                    item.content.forEach(function (imgItem, imgIndex) {
                        var imgOuter = document.createElement("div");
                        imgOuter.className = "xy-auto-webs-panel-item-img-outer";

                        var imgTitle = document.createElement("div");
                        imgTitle.className = "xy-auto-webs-panel-item-img-url";
                        if (!httpRegex.test(imgItem)) {
                            imgTitle.className = "xy-auto-webs-panel-item-img-url xy-ells-2";
                        }
                        imgTitle.innerText = imgItem;
                        imgTitle.onmousedown = () => {
                            navigator.clipboard.writeText(imgItem);
                        };

                        var img = document.createElement("img");
                        img.className = "xy-auto-webs-panel-item-img";
                        img.alt = "（无图片）";
                        img.src = imgItem || "";

                        imgOuter.appendChild(imgTitle);
                        imgOuter.appendChild(img);

                        content.appendChild(imgOuter);
                    });

                    itemDiv.appendChild(p);
                    itemDiv.appendChild(content);
                    div.appendChild(itemDiv);
                });

                // 框外跟随滚动

                document.body.appendChild(div);
            }
        }

        document.body.appendChild(script);

        //  添加按钮 控制 框的展示 与 隐藏
        var canXyPanelShow = false;
        var button = document.createElement("div");
        button.className = "xy-auto-webs-panel-btn";
        button.innerText = "网页信息 开/关";
        button.onmousedown = function () {
            var webSiteInfoPanel = document.getElementById("xy-auto-webs-panel");
            if (!webSiteInfoPanel) return;

            if (canXyPanelShow) {
                canXyPanelShow = false;
                // 或者使用 webSiteInfoPanel.setAttribute("class", xxx)
                webSiteInfoPanel.className = "xy-auto-webs-panel xy-none";
            } else {
                canXyPanelShow = true;
                webSiteInfoPanel.className = "xy-auto-webs-panel xy-show";
            }
        };
        document.body.appendChild(button);
    };

    // 更新展示 Icon
    // 清空原有节点 - 重新
    // 或者 内部添加新增内容
    function refreshIconImg() {
        var iconContent = document.getElementById(
            "xy-auto-webs-panel-item-content-1"
        );
        if (!iconContent) {
            setTimeout(
                function () {
                    refreshIconImg();
                },

                300
            );
            return;
        }
        iconContent.innerHTML = "";
        showIconsList = [...new Set(showIconsList)];

        showIconsList.forEach(function (imgItem, imgIndex) {
            var imgOuter = document.createElement("div");
            imgOuter.className = "xy-auto-webs-panel-item-img-outer";

            var imgTitle = document.createElement("div");
            imgTitle.className = "xy-auto-webs-panel-item-img-url";
            if (!httpRegex.test(imgItem)) {
                imgTitle.className = "xy-auto-webs-panel-item-img-url xy-ells-2";
            }
            imgTitle.innerText = imgItem;
            imgTitle.onmousedown = () => {
                navigator.clipboard.writeText(imgItem);
            };

            var img = document.createElement("img");
            img.className = "xy-auto-webs-panel-item-img";
            img.alt = "（无图片）";
            img.src = imgItem || "";

            imgOuter.appendChild(imgTitle);
            imgOuter.appendChild(img);

            iconContent.appendChild(imgOuter);
        });
    }

    // 插入样式

    var injectStyle = `

  .xy-none {
      display: none;
    }
    .xy-show {
      display: block;
    }
    .xy-select-all{
      user-select: all;
      cursor: copy;
    }

    .xy-ells-2 {
      /* todo : 双行省略 */
      /* width: 160px; */
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .xy-auto-webs-panel-btn {
      height: 40px;
      width: 100px;
      border-radius: 12px;
      position: fixed;
      top: 60px;
      right: 20px;
      color: white;
      background: black;
      font-weight: border;
      z-index: 9999;
      display: grid;
      place-items: center;
      cursor: pointer;
      font-size: 12px;
      user-select: none;
    }

    .xy-auto-webs-panel-btn:active {
      box-shadow: inset 1px 1px 2px #babecc, inset -1px -2px 2px white;
    }
    /*.xy-auto-webs-panel-btn:hover {*/
    /*  box-shadow: 2px 2px 5px green,-2px -2px 5px green;*/
    /*}*/

    .xy-auto-webs-panel {
      height: 400px;
      width: 300px;
      background: black;
      overflow: scroll;
      right: 10px;
      top: 110px;
      position: fixed;
      /*color:yellow;*/
      z-index: 9999;
      padding: 10px;
      /*opacity: 0.7;*/
      font-size: 12px;
      border-radius: 8px;
    }
    .xy-auto-webs-panel::-webkit-scrollbar {
      width: 0 !important;
    }
    .xy-auto-webs-panel-item,
    .xy-auto-webs-panel-item-0,
    .xy-auto-webs-panel-item-1 {
      display: flex;
      margin: 5px 0;
    }
    .xy-auto-webs-panel-item-title {
      width: 80px;
      text-align: left;
      font-weight: bolder;
      font-size: 14px;
      color: white;
      user-select: none;
    }
    .xy-auto-webs-panel-item-content {
      flex: 1;
      word-spacing: 3px;
      text-align: left;
      flex-wrap: wrap;
      color: skyblue;
      /*word-break: break-all;*/
      word-break: break-word;
      line-height: 1.5;
    }
    .xy-auto-webs-panel-item-img-url {
      margin-bottom: 10px;
      user-select: all;
      cursor: copy;
    }

    .xy-auto-webs-panel-item-img {
      width: 80px;
      height: 80px;
      object-fit: contain;
      user-select: none;
      filter: none !important;
    }

  `;

GM_addStyle(injectStyle);
})();
