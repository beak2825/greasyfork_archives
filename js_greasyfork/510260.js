// ==UserScript==
// @name         东南大学研究生人文素质讲座脚本
// @namespace    http://nic.seu.edu.cn/
// @version      1.1
// @description  东南大学研究生抢讲座
// @match        *://ehall.seu.edu.cn/gsapp/sys/jzxxtjapp/*
// @icon         http://pic.5tu.cn/uploads/allimg/1510/081431395820.jpg
// @match        http://ehall.seu.edu.cn/gsapp/sys/jzxxtjapp/*default/index.do?t_s=1712476611421&EMAP_LANG=zh&THEME=indigo&amp_sec_version_=1&gid_=MGRuVDdWWVRkaWkvSG5VcTBONHpjVjg2dU9BT0dNMEpQNGdiNUQ2dzQyUVJFTHFCK3V5M3BzTkdsRmdBckhxeW41Y0tGVEtiYkEyaWM1ZHBrWUY4OUE9PQ
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seu.edu.cn
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/510260/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E4%BA%BA%E6%96%87%E7%B4%A0%E8%B4%A8%E8%AE%B2%E5%BA%A7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/510260/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E4%BA%BA%E6%96%87%E7%B4%A0%E8%B4%A8%E8%AE%B2%E5%BA%A7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// author: ginga
console.log("SEU Lecture Book Script Loaded");
const min = 100;
const max = 300;
// 设置时间间隔，单位为毫秒
let postInterval = Math.floor(Math.random()*(max-min+1))+min;
console.log("interval: " + postInterval);

setTimeout(function () {
  document.querySelector("body > main > article > div").style.display = "none";
  let all_wid = $("[data-x-wid]")
    .map(function () {
      return $(this).attr("data-x-wid");
    })
    .get();

  //===============verify code===============
  let newVcode = document.createElement("img");
  newVcode.id = "tempImage";
  let verifyCode = document.createElement("input");
  verifyCode.id = "tempInput";
  verifyCode.style = "width:6em; height:1.2em; ";
  verifyCode.placeholder = "请输入验证码";
  let flashBtn = document.createElement("button");
  flashBtn.textContent = "获取验证码";
  flashBtn.style = "width:6em; font-size: 1.0em; margin-right:3em";
  flashBtn.addEventListener("click", function () {
    let temp_data = BH_UTILS.doSyncAjax(
      baseUrl + "/hdyy/vcode.do" + "?_=" + new Date().getTime(),
      {}
    );
    $("#tempImage").attr("src", temp_data.result);
  });

  $("h2").append(newVcode);
  $("h2").append(verifyCode);
  $("h2").append(flashBtn);

  newVcode.addEventListener("click", function () {
    let temp_data = BH_UTILS.doSyncAjax(
      baseUrl + "/hdyy/vcode.do" + "?_=" + new Date().getTime(),
      {}
    );
    $("#tempImage").attr("src", temp_data.result);
  });

  //===============time setting===============
  // Create a new time input
  let timeInput = document.createElement("input");
  timeInput.type = "time";
  timeInput.id = "myTime";
  $("h2").append(timeInput);

  //===============lecture setting===============
  let selectList = document.createElement("select");
  selectList.id = "mySelect";
  for (let i = 1; i <= all_wid.length; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.text = i.toString();
    selectList.appendChild(option);
  }
  $("h2").append(selectList);

  let submitBtn = document.createElement("button");
  submitBtn.textContent = "√";
  submitBtn.addEventListener("click", function () {
    let selectedTimeValue = document.getElementById("myTime").value;
    if (selectedTimeValue) {
      let [hours, minutes] = selectedTimeValue.split(":");
      let selectedTime = new Date();
      selectedTime.setHours(+hours);
      selectedTime.setMinutes(+minutes);
      selectedTime.setSeconds(0);
      selectedTime.setMilliseconds(0);

      let diff = selectedTime.getTime() - new Date().getTime();
      let verifyCode = $("#tempInput").val();
      diff += 100;

      let lectureId = selectList.value;

      if (diff < 0) {
        alert("The selected time is in the past. Please select a future time.");
      } else {
        alert(
          `将于${
            diff / 1000
          }s后抢第${lectureId}个课, 验证码为${verifyCode},点击ok后耐心等待`
        );
        let foo = { HD_WID: all_wid[lectureId - 1], vcode: verifyCode };
        console.log(foo);
        setTimeout(function () {
          BH_UTILS.doAjax(baseUrl + "/hdyy/yySave.do", {
            paramJson: JSON.stringify(foo),
          }).done(function (data) {
            console.log(data.msg);
          });

          setInterval(function () {
            BH_UTILS.doAjax(baseUrl + "/hdyy/yySave.do", {
              paramJson: JSON.stringify(foo),
            }).done(function (data) {
              console.log(data.msg);
            });
          }, postInterval);

          alert("抢讲座结束");
        }, diff);
      }
    } else {
      alert("Please select a time.");
    }
  });

  $("h2").append(submitBtn);
}, 1200);
