// ==UserScript==
// @name         头条助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  查找出爆款视频
// @author       You
// @match        https://www.toutiao.com/c/user/token/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/422307/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422307/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 引入css
    $("head").append(
        `<link href='https://www.layuicdn.com/layui/css/layui.css' rel="stylesheet"></link>`
  );
    $("head").append(
        `<link href='https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css' rel="stylesheet"></link>`
  );

    $(function () {
        //创建筛选按钮
        function addSelectBtn() {
            //debugger;
            //   let element = $(
            //     `<button type="button" style="top:150px;position: fixed;" class="layui-btn layui-btn-normal" id="selectViewCounts">筛选</button>`
            //   );
            //   $("body").append(element);
            //   element = null; //及时解除不再使用的变量引用,即将其赋值为 null;

            $(window).scroll(function () {
                //为了保证兼容性，这里取两个值，哪个有值取哪一个 scrollTop就是触发滚轮事件时滚轮的高度
                var scrollTop =
                    document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollTop > 50) {
                    selectViewCounts();
                    delExistedBtn();
                    findVideoUrl();
                }
            });
        }

        addSelectBtn();

        //给十万及以上播放量的视频标黄
        function selectViewCounts() {
            // 播放量文字
            let $viewCounts = $(".profile-feed-card-tools-text");
            for (const item of $viewCounts) {
                if ($(item).text().indexOf("万") != -1) {
                    if (Number($(item).text().split("万")[0]) >= 10) {
                        $(item).css("background-color", "yellow");
                    }
                }
            }
        }

        //复制操作
        //创建复制链接按钮
        function addShowUrlBtn($footer, url) {
            let element = $(
                `<button style="margin-top: 10px;" class="layui-btn layui-btn-xs showItemsUrl" data-url='${url}'>复制链接</button>`
      );

            $footer.append(element);
            element = null; //及时解除不再使用的变量引用,即将其赋值为 null;
        }
        //创建复制标题按钮
        function addShowTitleBtn($footer, title) {
            let element = $(
                `<button style="margin-left:10px;margin-top: 10px;" class="layui-btn layui-btn-xs showItemsTitle" data-title='${title}'>复制标题</button>`
      );

          $footer.append(element);
          element = null; //及时解除不再使用的变量引用,即将其赋值为 null;
      }

        function findUrl(url) {
            console.log("copy=> " + url);
            let oInput = document.createElement("input");
            oInput.value = url;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = "oInput";
            oInput.style.display = "none";
            layer.msg("复制成功");
        }

        // 找出视频链接
        function findVideoUrl() {
            let $videos = $(".feed-card-video-multi-item");
            for (const item of $videos) {
                let href = $(item).children("a").attr("href");
                let title = $(item).children("a").children("h2").text();
                let $footer = $(item).children(".footer");

                // 添加复制按钮
                addShowUrlBtn($footer, href);
                addShowTitleBtn($footer, title);
            }

            //给复制链接按钮绑定事件
            $(".showItemsUrl").click(function () {
                // 获取该dom节点的自定义参数
                findUrl($(this).data("url"));
            });
            //给复制标题按钮绑定事件
            $(".showItemsTitle").click(function () {
                findUrl($(this).data("title"));
            });
        }

        // 删除已经添加的按钮
        function delExistedBtn() {
            let $objArr = $(".feed-card-video-multi-item > .footer");
            $.each($objArr, function (index, value) {
                $(this).find("button").remove();
            });
        }


        //给筛选按钮绑定事件
        // $("#selectViewCounts").click(function () {
        //   selectViewCounts();
        //   delExistedBtn();
        //   findVideoUrl();
        // });

    }); //$(function...
})();
