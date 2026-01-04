// ==UserScript==
// @name         Original Rate Check
// @namespace    https://zujuan.xkw.com/
// @version      1.0
// @description  检验组卷网试卷的原创度
// @author       5dbwat4
// @match        https://zujuan.xkw.com/*
// @connect      zjappserver.xkw.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xkw.com
// @grant        GM_xmlhttpRequest
// @license      gpl-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/486890/Original%20Rate%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/486890/Original%20Rate%20Check.meta.js
// ==/UserScript==
const CONFIG = {
  zujuanHeaders: {
    Accept: "application/json",
    "zjapp-check":
      "1693973166||android||zj.app||c1d9574d848d5127a1b1863d1c1afd67ef06a2717e9aa00caad4ef26b7082889",
    "zjapp-version": "1.8.1",
    "zjapp-device-brand": "HUAWEI",
    "zjapp-system-model": "BLA-AL00",
    "zjapp-system-version": 10,
    authToken: "",
    Host: "zjappserver.xkw.com",
    Connection: "Keep-Alive",
    "Accept-Encoding": "gzip",
    "User-Agent": "okhttp/4.9.3",
  },
};

let zujuancookie = {};
if(  localStorage.getItem("_5dbwat4_proj_zujuanCookie")){
  zujuancookie=JSON.parse(localStorage.getItem("_5dbwat4_proj_zujuanCookie"))
}

let needIRefreshTokenNowAsThereMayBeSomeoneDoingSo=false

async function Req0_get(url, headers) {
  console.log("@Req0_get",url);
  return new Promise((res,rej) => {
    // let Hd_new = headers;
    // Hd_new["Content-Type"];
    GM_xmlhttpRequest({
      url,
      method: "GET",
      headers,
      onload: function (xhr) {
        // console.log(xhr.responseText);
        res(JSON.parse(xhr.responseText));
      },
    });
  });
}
async function Req0_post_refreshtoken(RefreshToken) {

  return new Promise((res,rej) => {
    var formData = new FormData();
    formData.append("refreshToken", RefreshToken);
    GM_xmlhttpRequest({
      url: `https://zjappserver.xkw.com/app-server/gateway/v1/basic/refreshToken`,
      method: "POST",
      headers: {
        "Content-Type":"application/json"},
      data: JSON.stringify({
        refreshToken:RefreshToken
        }),
      onload: function (xhr) {
        console.log("@refreshToken",xhr.responseText);
        res(JSON.parse(xhr.responseText));
      },
    });
  });
}

function saveZujuanCookie() {
  localStorage.setItem(
    "_5dbwat4_proj_zujuanCookie",
    JSON.stringify(zujuancookie)
  );
}

async function handleGetPaperDetailRequest(arg1, arg2) {
  console.log("@handleGetPaperDetailRequest",arg1,arg2);
  let r = {};
  r = await Req0_get(
    `https://zjappserver.xkw.com/app-server/v1/paper/detail/` +
      arg1 +
      "/" +
      arg2,
    CONFIG.zujuanHeaders
  );
  console.log(r);
  if (r.data.auth == 0) {
    console.log("登陆状态失效，尝试refreshToken");
    const g = await Req0_post_refreshtoken(zujuancookie.refreshToken);
    console.log(g.data);
    zujuancookie.authToken = g.authToken;
    CONFIG.zujuanHeaders.authToken = zujuancookie.authToken;
    saveZujuanCookie();
    r = await Req0_get(
      `https://zjappserver.xkw.com/app-server/v1/paper/detail/` +
        arg1 +
        "/" +
        arg2,
      CONFIG.zujuanHeaders
    );
    if (r.data.auth == 0) {
      console.error("refreshToken失效");
      return false;
    } else {
      return r;
    }
  } else {
    return r;
  }
}
//
let ___once___ = false;

function exec01 () {
  function isOriginal() {
    if (
      window.location.pathname.includes("/shijuan/") ||
      window.location.pathname.includes("/papersearch")
    ) {
      console.log("beg");
      let oop = [];
      document.querySelectorAll(".item-td").forEach((o) => {
        o.querySelector(".exam-info").style.height = "fit-content";
        o.style.height = "fit-content";

        const ops = /(\d*)p(\d*)\.html/g.exec(
          o.querySelector(".exam-name").attributes.href.nodeValue
        );

        console.log(ops[1], ops[2]);
        handleGetPaperDetailRequest(ops[1], ops[2]).then((o2) => {
          const oopp = o2.data.quesList;
          let origCount = 0;
          for (let icon = 0; icon < oopp.length; icon++) {
            const element = oopp[icon];
            let swlList = [];
            element.paperSources.forEach((v) => {
              if (v.valid) {
                swlList.push(v.id);
              }
            });
            console.log(swlList, ops[2], Math.min(...swlList));
            if (Math.min(...swlList) == ops[2]) {
              origCount++;
            }
          }
          console.log(origCount, o, oopp.length);

          o.querySelector(".test-sum").insertAdjacentHTML(
            "beforeend",
            ` 原创数<em>${origCount}</em> (${Math.floor(
              (origCount * 100) / oopp.length
            )}%)`
          );
          if (origCount == oopp.length) {
            o.insertAdjacentHTML(
              "afterbegin",
              `
                 <div style="position: absolute;display: block;width: 20px;height: 100%;z-index: 10000000000;background-color: #ffd700b0;border-radius: 10px;box-shadow: gold 0 0 15px;left: -5px;"></div>`
            );
          } else if (origCount / oopp.length > 0.9) {
            o.insertAdjacentHTML(
              "afterbegin",
              `
                 <div style="position: absolute;display: block;width: 10px;height: 100%;z-index: 10000000000;background-color: #ffd700b0;border-radius: 5px;left: -5px;"></div>`
            );
          } else if (origCount / oopp.length > 0.5) {
            o.insertAdjacentHTML(
              "afterbegin",
              `
                 <div style="position: absolute;display: block;width: 10px;height: 100%;z-index: 10000000000;background-color: #9f9d033d;border-radius: 5px;left: -5px;"></div>`
            );
          }

          //--------------------------------

          const paperSubmitTime = o2.data.time;
          let now = new Date();
          let paperTime = new Date(paperSubmitTime);
          let diffTime = Math.abs(paperTime - now);
          let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          console.log(diffDays);
          o.querySelector(".view-sum").insertAdjacentHTML(
            "beforeend",
            ` 日均<em>${
              Math.floor(
                (diffDays == 0 ? o2.data.readSum : o2.data.readSum / diffDays) *
                  10
              ) / 10
            }</em>`
          );
          if (
            (diffDays == 0 ? o2.data.readSum : o2.data.readSum / diffDays) > 40
          ) {
            o.querySelector(".view-sum").style.fontWeight = 900;
          }
        });
      });
    }
  }

  (function () {
    //"use strict";
    console.log("@exec01 threat");
    console.log("Here we are " + location.pathname);

    isOriginal();
    if(location.pathname=="/@refreshToken-init"){
      document.body.innerHTML=`
      <input type="textarea" id="refreshToken" placeholder="RefreshToken"/><button id="submitRefreshToken">OK</button><p id="resultRT"></p>`
      document.getElementById("submitRefreshToken").addEventListener("click",()=>{
        localStorage.setItem("_5dbwat4_proj_zujuanCookie",JSON.stringify({
          refreshToken:document.getElementById("refreshToken").value

        }))
        document.getElementById("resultRT").innerHTML="Got it."
      })
    }
  })();
};

(function () {
  console.log("@main threat");
    exec01();
  ___once___ = true;


  const bindEventListener = function (type) {
    const historyEvent = history[type];
    return function () {
      const newEvent = historyEvent.apply(this, arguments);
      const e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return newEvent;
    };
  };
  history.pushState = bindEventListener("pushState");
  history.replaceState = bindEventListener("replaceState");
  window.addEventListener("replaceState", function (e) {
    console.log("THEY DID IT AGAIN! replaceState");
    setTimeout(() => {
      exec01();
    }, 100);
  });
  window.addEventListener("pushState", function (e) {
    console.log("THEY DID IT AGAIN! pushState");
    exec01();
  });
})();
