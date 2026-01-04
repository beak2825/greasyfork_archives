// ==UserScript==
// @name         青书学堂答案一键填充
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  青书学堂答案一键填充助手
// @author       wulai
// @match        https://*.qingshuxuetang.com/**/ViewQuiz*
// @match        https://*.qingshuxuetang.com/**/ExercisePaper*
// @match        https://*.qingshuxuetang.com/**/ExamPaper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qingshuxuetang.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @resource     https://unpkg.com/browse/bootstrap@5.1.3/dist/css/bootstrap.min.css
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js
// @require      https://unpkg.com/bootstrap@5.1.3/dist/js/bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/445499/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E7%AD%94%E6%A1%88%E4%B8%80%E9%94%AE%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/445499/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E7%AD%94%E6%A1%88%E4%B8%80%E9%94%AE%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==
(function () {
  "use strict";
  /*
   *  浏览器打开设置，找到 隐私设置和安全性 >> 网站设置 >> Cookie和网站数据将
   *  “允许网站保存和读取 Cookie 数据（推荐）”选项开启、
   *  将“阻止第三方 Cookie”选项关闭就可以了。（针对Chrome浏览器，其他浏览器Cookie设置的位置可能有所不同）
   */

  $(function () {
    // 地址路由的最后一个路径(例：https://*.qingshuxuetang.com/*/ViewQuiz)：
    // ViewQuiz 查看答案
    // ExercisePaper 作业答题
    // ExamPaper 考试
    const WORK_OPTION = {
      vea: "ViewQuiz",
      ep: "ExercisePaper",
      ep_test: "ExamPaper",
    };

    // 初始化
    createBtn();

    // 存储
    $(".save2strage").on("click", function () {
      saveAllAnswer();
    });

    // 一键设置答案
    $(".get2strage").on("click", function () {
      setAnswer();
    });

    // 随机答案
    $(".setRandomAnswer-btn").on("click", function () {
      setRandomAnswer();
    });

    // 查看答案
    $(".checkAnswer").on("click", function () {
      createSeeDialog();
    });

    // 清除缓存
    $(".clearAnswer").on("click", function () {
      clearStorage();
    });

    // 作业： 点击交卷时，清空已存储的答案
    $('.submit_btn').click(function(){
      clearStorage();
    });

    function saveAllAnswer(callback) {
      let arr = [];
      $.each($(".question-detail-container"), function (index) {

        // 题号
        let num = index+1;
        let title = $(this).find(".detail-description-content").text();
        //答案
        let val = $(this)
          .find('.question-detail-answer.question-detail-choice-solution')
          .text();
        arr.push({
          num: num,
          title: title,
          value: val
        });

        
      });

      let key = location.href.match(/quizId=[0-9]+/);
      if (!key) return alert("ops, 出错了!");

      //清除以前的，设置新的
      GM_deleteValue(key[0]);
      GM_setValue(key[0], JSON.stringify(arr));
      createSeeDialog()
    }

    // 设置正确答案
    function setAnswer() {
      let key = location.href.match(/quizId=[0-9]+/);
      let storagekeys = GM_listValues();
      if (!key || storagekeys.indexOf(key[0]) < 0) {
        return alert("未获得答案，请重新保存再试！");
      }

      let ansArr = JSON.parse(GM_getValue(key[0]));
      let len = $(".question-detail-container").length;
      for(let i=0;i<len;i++) {
        setTimeout(function() {
          // 题目
          let inputs = $(".question-detail-container").eq(i).find('.question-detail-options input');

          //答案A|B|C|D
          let ans = ansArr[i].value.split('');
          ans.forEach(answer => {
            // 获取下标
            let randomInput = ['A','B','C','D'].indexOf(answer);
            if(randomInput>-1) {
              inputs[randomInput].click();
            }
          });

        },i+3)
      }

    }

    // 设置随机答案
    function setRandomAnswer() {
      let len = $(".question-detail-container").length;
      for(let i=0;i<len;i++) {
        setTimeout(function() {
          // 题目
          let inputs = $(".question-detail-container").eq(i).find('.question-detail-options input');
          let randomInput = Math.floor(Math.random()*4);
          // 设置答案
          inputs[randomInput].click();
        },i+3)
      }
    }

    function createBtn() {
      let str = "";
      // 保持唯一
      $(".save2strage").remove();
      $(".get2strage").remove();
      $(".checkAnswer").remove();

      let status = getWrok();
      switch (status) {
        case WORK_OPTION.vea:
          str = $('<div class="text-center"><button class="btn btn-primary save2strage">保存答案</button></div>');
          break;
        case WORK_OPTION.ep:
        case WORK_OPTION.ep_test:
          str =
            $(`<div class="text-center">
            <button class="btn btn-default setRandomAnswer-btn">随机设置答案</button>
            <button class="btn btn-primary get2strage">设置正确答案</button>
            <button class="btn btn-default checkAnswer">查看保存答案</button>
            <button class="btn btn-default clearAnswer">清空已存储的答案</button>
            </div>`);

          break;
      }

      $(".quiz-title").append(str);
    }

    function createSeeDialog() {
      let key = location.href.match(/quizId=[0-9]+/);
      if (!GM_getValue(key[0])) {
        return alert("未找到保存的答案，确定保存了？");
      }
      let ansArr = JSON.parse(GM_getValue(key[0]));

      $(".seeAnswer").remove();
      let str = $(`
                <div class="seeAnswer" style="font-size: initial;position:fixed;top:10px;left:0px;width:400px;height:80%;z-index:10;background:#fff;">
                    <div style="max-height:80%;height:auto;overflow-y:auto;">
                    <table class="table table-bordered table-striped bs-events-table">
                        <thead>
                            <tr>
                                <th width="50" align="center">序号</th>
                                <th align="center">题目</th>
                                <th width="80" align="center">答案</th>
                            </tr>
                        </thead>
                        <tbody class="tbody">
                        </tbody>
                    </table>
                    </div>
                    <div class="text-center" style="background:#eee;padding: 6px 0">
                        <button class="btn closeAnswer" style="width: 100%;">关闭</button>
                    </div>
                </div>
            `);

      let loopStr = "";
      $.each(ansArr, function (k, item) {
        loopStr += `<tr>
                <td align="center">${item.num}</td>
                <td class="text-center text-overflow" align="center">${item.title}</td>
                <td align="center">${item.value}</td>
            </tr>`;
      });
      str.find(".tbody").append($(loopStr));
      $("body").append(str);
      $(".closeAnswer").click(function () {
        $(".seeAnswer").remove();
      });
    }

    function clearStorage() {
      let stg = GM_listValues();
      if (Object.prototype.toString.call(stg).indexOf("Array") > -1) {
        $.each(stg, function (k, item) {
          GM_deleteValue(item);
        });
      }
    }

    function getWrok() {
      let status = location.pathname.split("/");
      return status[status.length - 1];
    }

  });
})();
