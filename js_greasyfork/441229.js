// ==UserScript==
// @name         LYS-南京市专业技术人员继续教育平台
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  南京市专业技术人员继续教育平台课时(https://m.mynj.cn:11097/commlogin/)
// @author       LYS
// @match        https://m.mynj.cn:11188/zxpx/*
// @require      https://cdn.staticfile.org/sweetalert/2.1.2/sweetalert.min.js
// @icon         none
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441229/LYS-%E5%8D%97%E4%BA%AC%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441229/LYS-%E5%8D%97%E4%BA%AC%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==
(function () {
  "use strict";
  var css1 = `<style>
    .lys {
        /* padding: 1px 1px; */
        border: unset;
        border-radius: 15px;
        color: #212121;
        z-index: 1;
        background: #e8e8e8;

        font-weight: 1000;
        font-size: 15px;
        -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
        box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
        transition: all 250ms;
        overflow: hidden;
        height: 30px;
        width: 247px;
        text-align: center;
    }
    .lys::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0;
        border-radius: 15px;
        background-color: #212121;
        z-index: -1;
        -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
        box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
        transition: all 250ms
       }
       .lys:hover {
        color: #e8e8e8;
       }
       .lys:hover::before {
        width: 100%;
       }
       </style>`;

  var txt1 =
    "<button class='lys' onclick='selectallcourse()'>选取本页所有课程！</button>";
  var txt2 =
    "<button class='lys' onclick='savecourseID()'>获取并储存本页课程ID！</button>";
  var txt3 =
    "<button class='lys' onclick='clearlocalStorage()'>清除已记录课程ID！</button>";
  var ocids = "";
  var ocid = "";
  var Savedocids = "";
  var url = window.location.href;
  var pd = true;

  switch (pd) {
    case (pd = url.includes("/hyper/search/courselist")):
      if ($("#selection-type")) {
        $("head").append(css1);
        $("#selection-type").after(txt1, txt2, txt3);
      }

      window.selectallcourse = function () {
        $('a:contains("进入选课")').each(function () {
          ocids = $(this).attr("href").split("ocid=");
          ocid = ocids[1].split("&rt=");
          selectcourse(ocid[0]);
          console.log("课程号为" + ocid[0] + "的课程已选择");
        });
        swal(
          "提醒",
          "本页面所有课程均已选择，请刷新查看@CodeBy LiYunShi",
          "success",
          {
            button: "Nice！",
          }
        );
      };

      window.savecourseID = function () {
        $('a:contains("已选课")').each(function () {
          ocid = $(this).attr("href");
          ocid = "https://m.mynj.cn:11188" + ocid;
          if (Savedocids == "") {
            Savedocids = ocid;
          } else {
            Savedocids = Savedocids + "," + ocid;
          }
          console.log("课链接为" + ocid + "的课程已提取整理");
        });
        var ids = localStorage.getItem("LYS");
        if (ids != null) {
          if (ids.includes(Savedocids)) {
            swal(
              "提醒",
              "您已经获取过ID，请勿重复获取@CodeBy LiYunShi",
              "success",
              {
                button: "OK！",
              }
            );
          } else {
            ids = ids + "," + Savedocids;
            localStorage.setItem("LYS", ids);
            swal(ids);
          }
        } else {
          localStorage.setItem("LYS", Savedocids);
          swal(Savedocids);
        }
        ocid = "";
        Savedocids = "";
        ids = "";
      };

      window.clearlocalStorage = function () {
        localStorage.clear();
        alert("清除成功！");
      };

      function selectcourse(ocid) {
        com.insigma.ajax({
          url: "/zxpx/auc/shopcart/good",
          dataType: "json",
          data: {
            ocid: ocid,
          },
          type: "post",
          success: function (data) {
            if (data.resData.HasMajor) {
              $.messager.confirm("提示", data.resMsg, function (r) {
                if (r) {
                  window.location.href = data.resData.Majorurl;
                }
              });
            }
          },
        });
      }
      break;

    case (pd = url.includes("/zxpx/hyper/courseDetail")):
      console.log("课程详情页");
      setTimeout(function () {
        console.log(
          $(".course-intro-status").text().trim().replace(/\s+/g, "")
        );
        if ($(".append-plugin-tip:contains('点击学习')").text() != "") {
          console.log("xx");
          $(".append-plugin-tip:contains('点击学习'):first").click();
        } else {
          //待跳转
          console.log("wncheng");
          var newid = localStorage.getItem("LYS").split(",");
          var xinID = "";
          for (var i = 0; i < newid.length; i++) {
            if (newid[i].includes(window.location.href)) {
            } else {
              if (xinID == "") {
                xinID = newid[i];
                var nextID = xinID;
              } else {
                xinID = xinID + "," + newid[i];
              }
            }
          }
          if (xinID != null) {
            localStorage.setItem("LYS", xinID);
            window.location.href = nextID;
          } else {
            swal("提醒", "所有课程已经学习完@CodeBy LiYunShi", "success", {
              button: "OK！",
            });
          }
        }
      }, 1000);
      break;

    case (pd = url.includes("/zxpx/tec/play/player")):
      $("#realPlayVideoTime").on("DOMSubtreeModified", function () {
        $("body").stopTime("interval");
        setTimeout(function () {
          if (
            $(".learnpercent")
              .text()
              .replace(/\n+\t+/g, "") == "学习进度：已完成"
          ) {
            if ($('.append-plugin-tip:contains("点击学习")').text() != "") {
              $('.append-plugin-tip:contains("点击学习"):first').click();
            } else {
              //待跳转
              var newid = localStorage.getItem("LYS").split(",");
              window.location.href = newid[0];
            }
          } else {
            var pro = $("#realPlayVideoTime").text();
            console.log(pro);
            p.currentTime(10);
            p.muted(true);
          }
        }, 1000);
      });
      setTimeout(function () {
        if (
          $(".learnpercent")
            .text()
            .replace(/\n+\t+/g, "") == "学习进度：已完成"
        ) {
          if ($('span:contains("未")').text() != "") {
            $('span:contains("未"):first').click();
          } else {
            //待跳转
            var newid = localStorage.getItem("LYS").split(",");
            window.location.href = newid[0];
          }
        } else {
          $("button.vjs-big-play-button").click();
        }
      }, 1000);
      break;
  }
})();
