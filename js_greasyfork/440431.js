// ==UserScript==
// @name         快捷语脚本
// @namespace    null
// @version      0.1
// @description  boos上实现一键打招呼，设置快捷语等，功能还在完善中。
// @author       joonlim
// @match        https://www.zhipin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440431/%E5%BF%AB%E6%8D%B7%E8%AF%AD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/440431/%E5%BF%AB%E6%8D%B7%E8%AF%AD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("开始运行脚本");
  $(function () {
    console.log("页面准备完成");
    // 获取到列表数据
    var masList = [
      {
        txt: "如果觉得合适的话，亲在明天10：00—11：30之间方便到公司参加面试吗？面试大约要40分钟左右。",
      },
      {
        txt: "你什么时候方便呢？",
      },
      {
        txt: "每周上五天，早九晚六，轮班休息。",
      },
      {
        txt: "看看工作地点能接受吗？",
      },
      {
        txt: "还有什么其它问题吗？都可以为你解答。",
      },
      {
        txt: "这个岗位硬性要求大专及以上哦，不过公司有大抵相同的职位接受高中学历，看你考虑吗？",
      },
      {
        txt: "抱歉，后面有机会再合作。",
      },
      {
        txt: "抱歉，岗位有35岁以下年龄要求，感谢关注。",
      },
      {
        txt: "直接到前台填一份简历。",
      },
      {
        txt: "方便发一份简历吗？",
      },
      {
        txt: "公司有临时住宿，一般一周1-2天。",
      },
      {
        txt: "14：00—16：30",
      },
      {
        txt: "9：00—18：00",
      },
      {
        txt: "9：30—18：30",
      },
    ];
    var isMouseDown = false;
    // DOM
    //var insertInput = $("#kw"); // 插入的输入框
    //var insertInput = $(".chat-message"); // 插入的输入框

    // 初始化
    init();

    // 插入操作
    $("body").on("click", "#content-oper", (e) => {
      var msg = $(e.target).prev().html();
      // console.log(msg);
      //insertInput.val(insertInput.val() + msg);
      $(".chat-message").html($(".chat-message").html() + msg);
      $(".chat-message").focus();
      console.log("插入成功");
    });

    // 插件拖动功能
    $("body").on("mousedown", "#selfBox-head", (e) => {
      if($(e.target).attr("id") == "selfBox-close"){
        return;
      }else{
        isMouseDown = true;
      }
    });

    $("body").on("mousemove", "#selfBox-head", () => {
      if (isMouseDown) {
        pos($("#selfBox")[0], -150, -15);
      }
    });

    $("body").on("mouseup", "#selfBox-head", () => {
      isMouseDown = false;
    });

    // 跳转源码
    $("body").on("click", "#selfBox-edit", () => {
      window.open("https://greasyfork.org/zh-CN/scripts/440120/versions/new");
    });

    // 关闭组件
    $("body").on("click", "#selfBox-close", () => {
      $("#selfBox").css("display", "none");
    });

    function init() {
      // 初始化dom
      var domStr = `
        <style>
          #selfBox {
            position: fixed;
            z-index: 99999;
            top: 450px;
            left: 50px;
            outline: 1px solid;
            width: 300px;
            height: 500px;
            background-color: white;
          }
          #selfBox-head {
            background-color: blue;
            color: white;
            height: 24px;
          }
          #selfBox-content {
            list-style: none;
            overflow-y: scroll;
            height: 476px;
            width: 100%;
          }
          #selfBox-content::-webkit-scrollbar {
            width: 0px;
            height: 0px;
          }
          #content-every {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 90%;
            display: inline-block;
            margin-bottom: 5px;
          }
          #content-oper {
            cursor: pointer;
            text-decoration: underline;
            float: right;
          }
          #selfBox-close{
            float: right;
            cursor: pointer;
            margin-right: 5px;
          }
          #selfBox-edit{
            float: right;
            margin-right: 15px;
            cursor: pointer;
          }
        </style>`;
      domStr += `<div id="selfBox">
                  <div id="selfBox-head">
                    <span>快捷语</span>
                    <span id="selfBox-close">X</span>
                    <span id="selfBox-edit">编辑</span>
                  </div>
                <div id="selfBox-content">`;
      // 生成dom字符串
      masList.forEach((element) => {
        domStr += `
        <li>
          <div id="content-every">${element.txt}</div>
          <span id="content-oper">插入</span>
        </li>`;
      });
      domStr += "</div></div>";
      // 添加dom
      $("body").append(domStr);
    }

    /**
     * 鼠标拖到函数
     * @param {*} o dom节点
     * @param {*} x 偏移量x
     * @param {*} y 偏移量y
     * @param {*} event 传入的事件
     */
    function pos(o, x, y, event) {
      //鼠标定位赋值函数
      var posX = 0,
        posY = 0; //临时变量值
      var e = event || window.event; //标准化事件对象
      if (e.pageX || e.pageY) {
        //获取鼠标指针的当前坐标值
        posX = e.pageX;
        posY = e.pageY;
      } else if (e.clientX || e.clientY) {
        posX =
          event.clientX +
          document.documentElement.scrollLeft +
          document.body.scrollLeft;
        posY =
          event.clientY +
          document.documentElement.scrollTop +
          document.body.scrollTop;
      }
      o.style.position = "absolute"; //定义当前对象为绝对定位
      o.style.top = posY + y + "px"; //用鼠标指针的y轴坐标和传入偏移值设置对象y轴坐标
      o.style.left = posX + x + "px"; //用鼠标指针的x轴坐标和传入偏移值设置对象x轴坐标
    }
  });
})();
