// ==UserScript==
// @name         XJTU_Ehall_Fuck_VIP
// @namespace    http://tampermonkey.net/
// @version      2.1.4
// @description  Fuck xjtu_jwc
// @author       xjtu_jwc_fucker
// @match        http://ehall.xjtu.edu.cn/new/thirdAppIndexShell.html
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460271/XJTU_Ehall_Fuck_VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/460271/XJTU_Ehall_Fuck_VIP.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function myMain() {
    let vec = [];
    let XH = null;
    let XQ = null;

    let t1 = document.createElement("input");
    t1.setAttribute("id", "queryKCH");
    t1.placeholder = "输入课程号";
    let t2 = document.createElement("input");
    t2.setAttribute("id", "queryMODE");
    t2.setAttribute("style", "min-width:18em;");
    t2.placeholder = "输入1或2,1是班级分布,2是课程分布";
    let t3 = document.createElement("p");
    t3.setAttribute("id", "fenbu");
    t3.innerHTML = "人数:最高分:平均分:最低分:优秀:良好:中等:及格:不及格:";

    let b = document.createElement("button");
    b.innerHTML = "查询分布";
    b.addEventListener("click", queryDetails);

    document.body.appendChild(t1);
    document.body.appendChild(t2);
    document.body.appendChild(b);
    document.body.appendChild(t3);

    let n = document.createElement("div");
    n.style = "background-color: pink;";
    document.body.appendChild(n);
    n = document.body.lastChild;
    n.innerHTML +=
      '<h2>欢迎关注<a href="https://space.bilibili.com/488836173">鹿鸣</a>&nbsp&nbsp;<a href="https://space.bilibili.com/672353429">贝拉kira</a></h2></br>';

    XQ = prompt("请输入学期,否则默认为2022-2023-1") || "2022-2023-1";

    function queryDetails() {
      let KCH = document.querySelector("#queryKCH").value,
        JXBID = "fuck",
        TJLX,
        XNXQDM,
        Other_XQ = 0,
        BJH = "01";

      vec.forEach((e) => {
        if (e.KCH === KCH) {
          JXBID = e.JXBID;
          XNXQDM = e.XNXQDM;
        }
      });

      let queryMODE = document.querySelector("#queryMODE").value;
      if (queryMODE === "1") {
        TJLX = "01";
        if (JXBID === "fuck") {
          BJH = prompt("查询其他学期课程分布; 请输入班级号,否则默认为01") || "01";
          XNXQDM = prompt("查询其他学期课程分布; 请输入学期,否则默认为2022-2023-1") || "2022-2023-1";
          JXBID = XNXQDM.replace(/-/g, "") + KCH + BJH;
          Other_XQ = 1;
        }
      } else if (queryMODE === "2") {
        if (JXBID === "fuck") {
          XNXQDM = prompt("查询其他学期课程分布; 请输入学期,否则默认为2022-2023-1") || "2022-2023-1";
          Other_XQ = 1;
        }
        TJLX = "02";
        JXBID = "*";
      } else {
        alert("mode输入不规范");
        return;
      }

      let tmp = document.getElementById("fenbu");
      tmp.innerHTML = "";
      let tmp_body = "JXBID=" + JXBID + "&KCH=" + KCH + "&TJLX=" + TJLX + "&XNXQDM=" + XNXQDM + "&*order=+DJDM";
      fetch("http://ehall.xjtu.edu.cn/jwapp/sys/cjcx/modules/cjcx/jxbcjfbcx.do", {
        headers: {
          "User-Agent": navigator.userAgent,
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: tmp_body,
        method: "POST",
        mode: "cors",
      })
        .then((r) =>
          r.json()
        )
        .then((s) => {
          console.log(s);
          s = s.datas.jxbcjfbcx.rows;
          s.sort((a, b) => (a.DJDM < b.DJDM ? -1 : 1));
          s.forEach((fbk) => {
            tmp.innerHTML += fbk.DJDM_DISPLAY + ":" + (fbk.DJSL || "null") + ";";
          });
          tmp.innerHTML += "</br>";
          console.log(s);

          return fetch("http://ehall.xjtu.edu.cn/jwapp/sys/cjcx/modules/cjcx/jxbcjtjcx.do", {
            headers: {
              "User-Agent": navigator.userAgent,
              Accept: "application/json, text/javascript, */*; q=0.01",
              "Accept-Language": "en-US,en;q=0.5",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: tmp_body,
            method: "POST",
            mode: "cors",
          })
        })
        .then((rr) => rr.json())
        .then((ss) => {
          console.log(ss);
          ss = ss.datas.jxbcjtjcx.rows;
          ss = ss[0];
          console.log(ss);
          tmp.innerHTML +=
            "最高分:" +
            (ss.ZGF || "null") +
            ";平均分:" +
            (ss.PJF || "null") +
            ";最低分:" +
            (ss.ZDF || "null") +
            ";</br>";

          if (Other_XQ != 0) {
            return;
          }

          return fetch("http://ehall.xjtu.edu.cn/jwapp/sys/cjcx/modules/cjcx/jxbxspmcx.do", {
            credentials: "include",
            headers: {
              "User-Agent": navigator.userAgent,
              Accept: "application/json, text/javascript, */*; q=0.01",
              "Accept-Language": "en-US,en;q=0.5",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: tmp_body,
            method: "POST",
            mode: "cors",
          })
        })
        .then((r3) => r3.json())
        .then((s3) => {
          console.log(s3);
          s3 = s3.datas.jxbxspmcx.rows;
          s3 = s3[0];
          tmp.innerHTML += "总人数:" + (s3.ZRS || "null") + ";排名:" + (s3.PM || "null") + ";";
        });
    }

    function getCJ_List() {
      fetch("http://ehall.xjtu.edu.cn/jwapp/sys/cjcx/modules/cjcx/jddzpjcxcj.do", {
        credentials: "include",
        headers: {
          "User-Agent": navigator.userAgent,
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
        body:
          "querySetting=%5B%7B%22name%22%3A%22XNXQDM%22%2C%22value%22%3A%22" +
          XQ +
          "%22%2C%22linkOpt%22%3A%22and%22%2C%22builder%22%3A%22m_value_equal%22%7D%2C%7B%22name%22%3A%22XH%22%2C%22value%22%3A%22" +
          XH +
          "%22%2C%22linkOpt%22%3A%22and%22%2C%22builder%22%3A%22m_value_equal%22%7D%2C%7B%22name%22%3A%22SFYX%22%2C%22caption%22%3A%22%E6%98%AF%E5%90%A6%E6%9C%89%E6%95%88%22%2C%22linkOpt%22%3A%22AND%22%2C%22builderList%22%3A%22cbl_m_List%22%2C%22builder%22%3A%22m_value_equal%22%2C%22value%22%3A%221%22%2C%22value_display%22%3A%22%E6%98%AF%22%7D%5D&*order=KCH%2CKXH&pageSize=100&pageNumber=1",
        method: "POST",
        mode: "cors",
      }).then((r) => r.json())
        .then((r) => {
          console.log(r);
          let d = r.datas.jddzpjcxcj.rows;
          d.forEach((e) => {
            n.innerHTML +=
              "<p>" +
              "课程:" +
              e.KCM +
              ";&nbsp;&nbsp;&nbsp;课程号:" +
              e.KCH +
              ";&nbsp;&nbsp;&nbsp;加权成绩:" +
              (e.ZCJ || "null") +
              ";&nbsp;&nbsp;&nbsp;绩点:" +
              e.XFJD +
              ";&nbsp;&nbsp;&nbsp;期中成绩:" +
              (e.QZCJ || "null") +
              ";&nbsp;&nbsp;&nbsp;期末成绩:" +
              (e.QMCJ || "null") +
              ";&nbsp;&nbsp;&nbsp;平时成绩:" +
              (e.PSCJ || "null") +
              ";&nbsp;&nbsp;&nbsp;实验成绩:" +
              (e.SYCJ || "null") +
              ";&nbsp;&nbsp;&nbsp;过程考核1:" +
              (e.QTCJ1 || "null") +
              ";&nbsp;&nbsp;&nbsp;过程考核2:" +
              (e.QTCJ2 || "null") +
              ";&nbsp;&nbsp;&nbsp;过程考核3:" +
              (e.QTCJ3 || "null") +
              ";&nbsp;&nbsp;&nbsp;过程考核4:" +
              (e.QTCJ4 || "null") +
              ";&nbsp;&nbsp;&nbsp;过程考核5:" +
              (e.QTCJ5 || "null") +
              ";&nbsp;&nbsp;&nbsp;过程考核6:" +
              (e.QTCJ6 || "null") +
              ";&nbsp;&nbsp;&nbsp;过程考核7:" +
              (e.QTCJ7 || "null") +
              ";&nbsp;&nbsp;&nbsp;过程考核8:" +
              (e.QTCJ8 || "null") +
              ";&nbsp;&nbsp;&nbsp;过程考核9:" +
              (e.QTCJ9 || "null") +
              ";&nbsp;&nbsp;&nbsp;过程考核10:" +
              (e.QTCJ10 || "null") +
              "</p>" +
              "<br/>";
            vec.push({
              KCH: e.KCH,
              XNXQDM: e.XNXQDM,
              JXBID: e.JXBID,
            });
          });
        })
    }

    let waitTime = 0;
    let waitID = setInterval(() => {
      if (localStorage.ampUserId && localStorage.ampUserId.length === 10) {
        XH = localStorage.ampUserId;
      } else if (waitTime > 2200) {
        XH = prompt("请输入学号:");
      }
      if (XH) {
        getCJ_List();
        clearInterval(waitID);
      }
      waitTime += 200;
    }, 200);

  }

  setTimeout(() => {
    myMain()
  }, 6000);
})();