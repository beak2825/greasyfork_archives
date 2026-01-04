// ==UserScript==
// @name         Zwift
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  create Zwift random data and send request
// @author       Xiaobao
// @match        https://www.zwift.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/Mock.js/1.0.0/mock-min.js
// @require      https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zwift.com
// @grant        GM_xmlhttpRequest
// @license      CC BY-NC 3.0 CN
// @downloadURL https://update.greasyfork.org/scripts/444121/Zwift.user.js
// @updateURL https://update.greasyfork.org/scripts/444121/Zwift.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let Random = Mock.Random;
  let guardian_email, child_login_email;
  let sex, city, firstName, data;
  let age = 6;
  let domain = "@simayg.com";

  let laigezhanghao = () => {
    // let req = setInterval(() => {
    // console.log("scanning....");
    let birth = new Date(new Date().getTime() - 31536000000 * age + Mock.mock({ "number|10-100": 50 }).number * 86400000);
    let child_birthday = dayjs(birth).format('MM/DD/YYYY');
    console.log(child_birthday);
    let e1 = Random.email();
    let e2 = Random.email();
    // guardian_email= document.getElementsByName("guardian_email")[0].value;
    // child_login_email= document.getElementsByName("child_login_email")[0].value;
    guardian_email = e1.substring(0, e1.indexOf("@")) + domain;
    child_login_email = e2.substring(0, e2.indexOf("@")) + domain;
    city = Random.city(true).split(" ");
    firstName = Random.cfirst();
    data = {
      "address_line_1": city[0] + city[1],
      "address_line_2": "",
      "age": age,
      "child_birthday": child_birthday,
      "child_first_name": firstName,
      "child_last_name": Random.clast(),
      "child_login_email": child_login_email,
      "city": city[0],
      "country": "China",
      "first_guardian_first_name": firstName,
      "first_guardian_last_name": Random.clast(),
      "gender": "male",
      "guardian_email": guardian_email,
      "phone": "13" + Random.string('number', 9),
      "second_guardian_first_name": Random.cfirst(),
      "second_guardian_last_name": Random.clast(),
      "state": city[1],
      "zip": Random.zip()
    };
    sex = Mock.mock({ "number|1-2": 2 });
    data.gender = sex.number == 1 ? "male" : "famale";
    if (!guardian_email || !child_login_email) return;
    console.log(data);
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://api.kustomerapp.com/v1/hooks/form/5b4cc65f0471d78304e1c9f3/17d87e7c4dcaa861aab1e16b0af6de94a0c239c1ef066e9199e2ce744c479953",
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://www.zwift.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      // "referrer": "https://www.zwift.com/",
      // "referrerPolicy": "strict-origin-when-cross-origin",
      // "mode": "cors",
      // "credentials": "omit",
      data: JSON.stringify(data),
      onload: function (response) {
        console.log("success🙂", response);
        // window.clearInterval(req);
      },
      onerror: function (response) {
        console.log("failed💀", response);
        // window.clearInterval(req);
      }
    });
    // }, 2000);
  }

  setTimeout(() => {
    let time1 = document.getElementsByName("guardian_email")[0].value;
    let time2 = document.getElementsByName("child_login_email")[0].value;
    let time = time1 || time2;
    console.log("次数：", time);

    for (let i = 0; i <= time; i++) {
      let wait = Mock.mock({ "number|3000-10000": 5000 }).number;
      setTimeout(function timer() {
        laigezhanghao();
      }, wait);
    }
  }, 15000);
})();