// ==UserScript==
// @name         B站|哔站|bilibili屏蔽不喜欢的up主v1.2
// @namespace    Lss
// @version      1.2
// @description  可以在首页左上角的“热门”下的‘综合热门’、‘每周必看’、‘入站必刷’、‘排行榜’和按照网页端观看人数排行的‘当前在线’这五个页面，屏蔽掉你不想看到的UP主。使用方法：竖线分割，如 陈睿|碧诗|坤坤| ，这样就屏蔽了这三位UP。
// @author       Lss
// @match        https://www.bilibili.com/video/online.html
// @match        https://www.bilibili.com/v/popular/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.js
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483426/B%E7%AB%99%7C%E5%93%94%E7%AB%99%7Cbilibili%E5%B1%8F%E8%94%BD%E4%B8%8D%E5%96%9C%E6%AC%A2%E7%9A%84up%E4%B8%BBv12.user.js
// @updateURL https://update.greasyfork.org/scripts/483426/B%E7%AB%99%7C%E5%93%94%E7%AB%99%7Cbilibili%E5%B1%8F%E8%94%BD%E4%B8%8D%E5%96%9C%E6%AC%A2%E7%9A%84up%E4%B8%BBv12.meta.js
// ==/UserScript==

(function () {

    // 检查localStorage中是否存在blockedKeywords
    let blockedKeywords = localStorage.getItem("blockedKeywords") || "";



    // 读取要屏蔽的关键词
    const blockedKeywordsArr = blockedKeywords.split("|");
    // 检测是不是热门
    // const is_popular = !!document.querySelector('.header-v3');
    const elements = document.querySelectorAll('.header-v4, .header-v3, .header-v2, .header-v1');
    const is_popular = elements.length > 0;

    if (is_popular) {

        if (typeof MutationObserver !== 'undefined') {
            // 当前浏览器支持MutationObserver接口
            console.log('当前浏览器支持MutationObserver接口');

            // 定义回调函数
            const observerCallback = function (mutationsList) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList' || mutation.type === 'subtree') {
                        //console.log('子节点被添加或删除')

                        // 动态加载时执行删除匹配元素的操作
                        deleteMatchElements()
                    }
                }
            }
            // 创建MutationObserver实例，并配置
            const observer = new MutationObserver(observerCallback);
            const observerConfig = { childList: true, subtree: true };

            // 页面加载完成后执行删除匹配元素的操作
            window.addEventListener('load', deleteMatchElements);

            // 监测变化
            observer.observe(document.body, observerConfig);

        } else {
            // 当前浏览器不支持MutationObserver接口
            console.log('本插件将只能在在线人数页面运行。请升级或更换浏览器，当前浏览器不支持MutationObserver接口。');
        }
    } else {
        // console.log('进入在线页面')
        blockedKeywordsArr.forEach(keyword => {
            $(`.ebox .author:contains("${keyword}")`).each(function () {
                var authorText = $(this).text(); // 获取.author元素的文本内容

                console.log(`${authorText}`);
                var closestEbox = $(this).closest('.ebox');

                // 隐藏.ebox元素
                closestEbox.hide();
            });
        });
    }

    try {
        // 名单管理
        GM_registerMenuCommand('名单管理', function () {

            // 创建窗口
            const windowDiv = $("<div id='blockedKeywordsDiv'></div>");

            const tips = $('<div id="loadingMask" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;"><div id="loadingMessage" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:white;">正在读取黑名单...</div></div>');

            const tips2 = $('<p id="tips2P" style="text-align: center;width: 500px;margin: 14px auto 0;font-size: 16px;">请注意在每个up名字后面都带上|，否则可能屏蔽失败</p>');
            // 创建编辑框
            const textarea = $("<textarea id='blockedKeywordsTextarea' placeholder='使用|分割，如 陈睿|碧诗|坤坤|'></textarea>").val(blockedKeywords)

            // 创建读取黑名单按钮
            const loadButton = $("<button id='loadKeywordsBtn'>读取黑名单</button>").click(function () {

                var currentPage = 1; // 初始页码
                var pageSize = 50; // 每页数量
                var blacklist = []; // 存储所有黑名单列表项

                function fetchPage() {
                    $.ajax({
                        url: 'https://api.bilibili.com/x/relation/blacks',
                        type: 'GET',
                        data: {
                            ps: pageSize,
                            pn: currentPage
                            // 可以在这里添加其他 GET 参数
                        },
                        xhrFields: {
                            withCredentials: true // 如果跨域且需要携带 cookie
                        },
                        success: function (res) {
                            if (res.code == -101) {
                                alert("请先登录");
                            } else if (res.code == 0) {
                                document.getElementById('loadingMask').style.display = 'block';
                                // 将当前页的数据添加到黑名单列表中
                                blacklist = blacklist.concat(res.data.list); // 假设 res.data.list 是数据数组

                                // 检查是否还有更多页面
                                if (blacklist.length < res.data.total) {
                                    // 递增页码并请求下一页
                                    currentPage++;
                                    fetchPage(); // 递归调用
                                } else {

                                    var usernames = []; // 用于存储所有 uname 的数组

                                    // 遍历黑名单列表中的每一项
                                    for (var i = 0; i < blacklist.length; i++) {
                                        if (blacklist[i].uname != '账号已注销') {
                                            var uname = blacklist[i].uname; // 提取 uname
                                            usernames.push(uname); // 将 uname 添加到 usernames 数组中
                                        }
                                    }

                                    // 在这里可以对 usernames 数组进行后续处理
                                    // console.log(usernames); // 打印所有 uname
                                    const combinedArray = usernames.concat(blockedKeywordsArr);
                                    // 正确的做法：从后往前遍历，保留最后出现的项
                                    const uniqueArrayFromEnd = [...combinedArray].reverse().filter((value, index, self) => {
                                        return self.indexOf(value) === index; // 这里index是从后往前数的，所以实际上是最后一个
                                    }).reverse(); // 再反转回来

                                    // 将处理后的数组转化为字符串并用|隔开
                                    const resultString = uniqueArrayFromEnd.join('|');
                                    $('#blockedKeywordsTextarea').val(resultString)
                                    document.getElementById('loadingMask').style.display = 'none';
                                }
                            } else {
                                // 处理其他错误情况
                                console.error('请求失败', res);
                            }
                        },
                        error: function (xhr, status, error) {
                            // 处理 AJAX 请求错误
                            console.error('AJAX 请求错误', status, error);
                        }
                    });
                }

                // 开始请求第一页
                fetchPage();

            });
            // 创建保存按钮
            const saveButton = $("<button id='blockedKeywordsBtn'>保存</button>").click(function () {
                // 将编辑框中的内容保存到浏览器缓存
                localStorage.setItem("blockedKeywords", textarea.val());
                $(this).parent('div').fadeOut(200)
                console.log("已保存");
                location.reload();
            });

            // 添加编辑框和保存按钮到窗口
            windowDiv.append(textarea).append("<br>").append(saveButton).append(loadButton).append(tips).append(tips2);

            const screenMask = $("<div id='blockedKeywordsMask'>").click(function () {
                // 单击遮罩层时，移除窗口和遮罩层，并取消保存
                windowDiv.fadeOut(200).remove();
                screenMask.fadeOut(200).remove();
            });

            // 将窗口和遮罩层添加到文档中
            $("body").append(windowDiv).append(screenMask);
            // 将窗口添加到文档中
        })
    } catch (e) {
        // 不支持此命令
        console.warn(`警告：此脚本管理器不支持菜单按钮，可能会导致新特性无法正常使用，建议更改脚本管理器为
        Tampermonkey[https://www.tampermonkey.net/] 或 Violentmonkey[https://violentmonkey.github.io/]`)
    }

    const styleElement = document.createElement("style");

    // 添加CSS代码
    styleElement.innerHTML = `
    #blockedKeywordsDiv {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 20px;
      border: 1px solid #ccc;
      z-index: 9999;
      border-radius: 8px;
      box-shadow: 1px 1px 11px #777
    }

    #loadKeywordsBtn {
      font-size: 14px;
      width: 100px;
      height: 36px;
      line-height: 28px;
      margin-top: 5px;
      text-align: center;
      float: left;
      background-color: #FF6EC0;
      color: #fff;
      border: none;
      cursor: pointer;
      outline: none;
      border-radius: 2px;
      transition: all 0.3s ease;
    }
    #blockedKeywordsTextarea {
      width: 800px;
      height: 400px;
      resize: none;
      border: 1px solid #c9ccd0;
      font-size: 24px;
      border-radius: 8px;
      padding-top: 10px
    }

    #blockedKeywordsBtn {
      font-size: 14px;
      width: 100px;
      height: 36px;
      line-height: 28px;
      margin-top: 5px;
      text-align: center;
      float: right;
      background-color: #7FD6F5;
      color: #fff;
      border: none;
      cursor: pointer;
      outline: none;
      border-radius: 2px;
      transition: all 0.3s ease;
    }
    #blockedKeywordsBtn:hover{
      background-color: #49A9E2;
      transition: all 0.3s ease;
    }

    /* 添加遮罩层的样式 */
    #blockedKeywordsMask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
    }
  `;

    // 将样式元素添加到文档头部
    document.head.appendChild(styleElement);

    // 删除匹配元素的函数
    function deleteMatchElements() {
        const is_rank = document.querySelector('.rank-container') // 检测是不是排行榜

        const listArr = new Set(blockedKeywordsArr);
        if (is_rank) {
            // console.log('进入排行榜页面')
            $('.up-name')
                .filter((_, el) => blockedKeywordsArr.includes($(el)[0].innerText))
                .closest('.rank-item')
                .each((_, el) => {
                    const matchedText = $(el).find('.up-name').text();
                    console.log(`已屏蔽的UP：${matchedText}`);
                    $(el).remove();
                });

        } else {
             // console.log('进入热门页面')
            $('.up-name__text')
                .filter((_, el) => blockedKeywordsArr.includes($(el).text()))
                .closest('.video-card')
                .each((_, el) => {
                    const matchedText = $(el).find('.up-name__text').text();
                    console.log(`已屏蔽的UP：${matchedText}`);
                    $(el).remove();
                });
        }
    }
})();