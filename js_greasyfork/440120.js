// ==UserScript==
// @name         给猪开发的脚本
// @namespace    null
// @version      0.7
// @description  boos快捷语
// @author       joonlim
// @match        https://www.zhipin.com/*
// @match        https://rd6.zhaopin.com/im/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440120/%E7%BB%99%E7%8C%AA%E5%BC%80%E5%8F%91%E7%9A%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/440120/%E7%BB%99%E7%8C%AA%E5%BC%80%E5%8F%91%E7%9A%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("开始运行脚本");
  let count = 0,
    timer = setInterval(() => {
      count++;
      if ($) {
        clearInterval(timer);
        $(function () {
          console.log("页面准备完成");
          // 获取到列表数据
          var masList = [
            {
              txt: `
你好，目前招饿了么在线打字客服，</br>
1、通过在线的形式处理用户咨询的APP无法下单、红包无法使用等疑问</br>
2、受理主要由骑手问题，订单时长等导致的优惠券索赔问题</br>
</br>
公司直招，无销售。`,
            },
            {
              txt: `
无责任底薪2800+绩效（1000-3500）＋补贴 。 多劳多得</br>

1、入职就购买五险一金。</br>

2、培训1周，朝九晚六的培训，补贴97/天。</br>

3、工龄工资：第四个月发600，第7个月开始每月发200</br>
`,
            },
            {
              txt: `工作时间：</br>
8-1点轮班制，8-17点。9-18点 、15-24点（补贴50）、16-1点（每次补贴50）</br>
无通宵班，提供临时住宿。

休息时间：上五休二轮休，月休7-9天，法定节假日有班的三倍薪资</br>
`,
            },
            {
              txt: "培训：培训一周，朝九晚六，补贴97/天。",
            },
            {
              txt: "平时不加班，但是大促期间（11、11  12、12）会加，每次不超过2小时，按照1.5倍薪资或者调休核算</br>",
            },
            {
              txt: ` 目前公司招滴滴二线语音客服，主要是处理客户提出的问题，包括司机态度恶劣，额外收费、对滴滴平台制度不认可等，</br>

无销售公司直招。
`,
            },
            {
              txt: `\n无责底薪（2900-3400）+绩效（1000-3000）+补贴</br>
根据绩效定底薪，绩效多劳多得，上不封顶。</br>

（1）入职五险一金

（2）带薪培训，培训1周，朝九晚六的培训，补贴97/天
`,
            },
            {
              txt: `工作时间：轮班制：两个班次：9-18点 ,12-21点，无通宵班！ 不加班，内部可协调换班。</br>

休息时间：上五休二轮休，月休8-9，天 遇节假日值班3倍薪资</br>`,
            },
            {
              txt: `生活服务住宿：</br>
        两室一厅3人住，三室一厅5人住，电梯公寓，家具热水器空调齐全
        有食堂（早中晚8-12元），可自行带饭，有微波炉，还有冰箱，也可自行点外卖。
        `,
            },
            {
              txt: "培训：生活服务培训4天，朝九晚六，补贴65/天。",
            },
            {
              txt: `
你好，目前公司招银行资料维护专员。公司直招。</br>
工作内容： 1.通过语音的方式对客户进行资料维护与确认，包括基本信息与消费习惯等；
 2.用运营知识，在服务过程中为客户提供答疑及客情维护。
 `,
            },
            {
              txt: `
无责底薪 2600+绩效（1500-3000）综合薪资4000-5500 </br>
新人期绩效保护

最低薪资4200、入职就买五险一金

 后期：根据能力评定薪酬等级，综合薪资6K-8K/月，高绩效员工平均薪资8K
 `,
            },

            {
              txt: "工作时间： 9:00-6:00，单双休 ",
            },
            {
              txt: "培训：培训5天，朝九晚六，补贴50/天。",
            },
            {
              txt: "绩效是看的核对的数量和质量，多劳多得，上不封顶",
            },

            {
              txt: "食宿自理哦，但是公司有微波炉，冰箱就餐区等，只有临时住宿，没有长期的呢",
            },

            {
              txt: "试用期是6个月，自动转正。入职就买社保公积金，试用期和转后的福利待遇一样，工资也不打折",
            },

            {
              txt: `薪资福利：</br>
无责底薪2800+绩效（1000-2500多劳多得）+补贴
福利：
1、五险一金
2、入职提供带薪培训
3、每月各种团建嗨到飞起
4、产假 孕假 哺乳假 调休假期 公司为每个伙伴提供完善的福利保障`,
            },
            {
              txt: "D座2楼：从地铁九兴大道f1口出来，往前走20米样子，是园区的保安亭，进保安亭右转上2楼就是金慧科技",
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
            $(".boss-chat-editor-input").css("white-space", "pre-wrap");
            $(".boss-chat-editor-input").html($(".boss-chat-editor-input").html() + msg);
            $(".boss-chat-editor-input").focus();
            console.log("插入成功");
          });

          // 插件拖动功能
          $("body").on("mousedown", "#selfBox-head", (e) => {
            if ($(e.target).attr("id") == "selfBox-close") {
              return;
            } else {
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
            let broInfo = getBrowserInfo();
            if (broInfo.browser == "chrome") {
              window.open(
                "https://greasyfork.org/zh-CN/scripts/440120/versions/new"
              );
            } else {
              window.open(
                "https://greasyfork.org/zh-CN/scripts/440120-%E7%BB%99%E7%8C%AA%E5%BC%80%E5%8F%91%E7%9A%84%E8%84%9A%E6%9C%AC"
              );
            }
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
            top: 300px;
            left: 120px;
            outline: 1px solid;
            width: 280px;
            height: 700px;
            background-color: white;
          }
          #selfBox-head {
            background-color: blue;
            color: white;
            height: 4%;
          }
          #selfBox-content {
            list-style: none;
            overflow-y: scroll;
            height: 95%;
            width: 100%;
            scrollbar-width: none;
          }
          #selfBox-content li{
            //margin-bottom: -10px;
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

          // 获取浏览器信息
          function getBrowserInfo() {
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
            var m = ua.match(re);
            try {
              Sys.browser = m[1].replace(/version/, "safari");
              Sys.ver = m[2];
            } catch (e) {
              console.log("getBrowserInfo fail");
            }
            return Sys;
          }
        });
      } else if (count > 1000) {
        clearInterval(timer);
        alert("插件运行失败，找猪帮忙");
      }
    }, 10);
})();
