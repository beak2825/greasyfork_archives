// ==UserScript==
// @name         妖火网吹牛插件
// @namespace    https://yaohuo.me/
// @version      0.3.6.2
// @description  吹牛插件
// @author       龙少c(id:20469)开发 🐻🐻修改
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469621/%E5%A6%96%E7%81%AB%E7%BD%91%E5%90%B9%E7%89%9B%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/469621/%E5%A6%96%E7%81%AB%E7%BD%91%E5%90%B9%E7%89%9B%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function () {
  "use strict";
  // 实现简易版替换用到的jquery，全部换成原生js太麻烦
  let $, jQuery;
  $ = jQuery = myJquery();

  // 设置密码，玩吹牛时隔段时间会要求输密码，填入可自动输入密码并确认
  let websitePassword = "";
  // 是否是自动吃牛
  let isAutoEatBoast = false;
  // 赌注妖精大于则不自动吃
  let eatBoastMaxNum = 500;
  // 自身妖精小于则不自动吃
  let eatBoastMaxMoney = 100000;
  // 批量发牛金额，
  let batchPublishBoastMoney = 500;
  // 发吹牛答案1的概率，如果设置0.6代表60%选1,40%选2
  let publishAnswer1Rate = 0.5;
  // 吃吹牛答案1的概率，如果设置0.6代表60%选1,40%选2
  let eatAnswer1Rate = 0.5;

  // ==主代码执行==
  (function () {
    // 自动填充密码并确认
    handlePassword();
    // 吹牛增强
    handleBoast();
  })();
  // ==其他功能函数和方法==
  // 填充密码
  function handlePassword() {
    let password = document.querySelector("input[type=password]");
    let submit = document.querySelector("input[type=submit]");
    if (document.title === "请输入密码") {
      if (!password.value) {
        password.value = websitePassword;
      }
      if (password.value) {
        submit.click();
      }
    }
  }
  // 处理吹牛
  async function handleBoast() {
    let boastPage = [
      "/games/chuiniu/index.aspx",
      "/games/chuiniu/doit.aspx",
      "/games/chuiniu/add.aspx",
      "/games/chuiniu/book_list.aspx",
      "/games/chuiniu/book_view.aspx",
    ];
    if (!boastPage.includes(location.pathname)) {
      return;
    }

    MY_addStyle(`
      .boast-btn-style{
        color: #fff; 
        font-size: 14px; 
        background-color: #888888;
        border-radius: 5px;
        margin-left: 6px;
        padding: 5px 8px;
        cursor: pointer;
      }
      .boast-card-style{
        padding:5px; 
        margin: 5px; 
        background: #e5f3ee; 
        border-radius: 6px;
      }
    `);
    // 吹牛主页
    if ("/games/chuiniu/index.aspx".includes(location.pathname)) {
      // 添加查询吹牛数据
      handleAddSearch();

      let list = document.querySelectorAll(
        "a[href^='/games/chuiniu/doit.aspx']"
      );
      let money = document.querySelector(
        ".subtitle a[href^='/bbs/banklist.aspx']"
      );
      let publishBoastBtn = document.querySelector(
        "a[href^='/games/chuiniu/add.aspx']"
      );

      for (const item of list) {
        let match = item.innerHTML.match(/\((\d+)妖晶\)$/);
        let number = parseInt(match[1]);
        let href = item.getAttribute("href");

        let newHref = href.includes("?")
          ? `${href}&open=new`
          : `${href}?open=new`;
        if (isAutoEatBoast && money.innerText - number >= eatBoastMaxMoney) {
          if (number <= eatBoastMaxNum) {
            // item.click();
            location.href = newHref;
          } else {
            console.log(
              `当前大于设置的赌注妖精：${eatBoastMaxNum}，则不自动吃`
            );
          }
        } else {
          console.log(
            `当前没有开启自动吃肉，或者减去当前金额${number}小于设置的自身妖精低于${eatBoastMaxMoney}则不自动吃`
          );
        }
      }

      if (publishBoastBtn.innerText === "我要公开挑战") {
        // 添加批量按钮
        publishBoastBtn.insertAdjacentHTML(
          "afterend",
          `<input type="button" class="batch-publish-btn boast-btn-style" value='批量公开挑战'>`
        );
        $(".batch-publish-btn").click(() => {
          let number = prompt("请输入批量公开挑战的数量：");
          if (number && /^\d+$/.test(number)) {
            number = parseFloat(number) > 10 ? 10 : number;
            setItem("publishNumber", number - 1);
            let href = publishBoastBtn.href;
            let newHref = href.includes("?")
              ? `${href}&open=new`
              : `${href}?open=new`;
            location.href = newHref;
          } else if (number) {
            alert("输入的格式不对，只能是大于0的数字");
          }
        });
      }
    }

    // 吃吹牛页面
    if ("/games/chuiniu/doit.aspx".includes(location.pathname)) {
      let password = document.querySelector("input[type=password]");
      let submit = document.querySelector("input[type=submit]");
      let select = document.querySelector("select");
      let subTitle = document.querySelector(".subtitle");
      // 吃多吃2少吃1
      let answer1Rate = eatAnswer1Rate;
      let randomNum = Math.random() < answer1Rate ? 1 : 2;
      let isAutoEat = window.location.search.includes("open=new");
      if (document.title === "应战") {
        // 应战结果就返回
        if (!select) {
          location.href = "/games/chuiniu/index.aspx";
          return;
        }
        select.value = randomNum;
        if (subTitle) {
          subTitle.insertAdjacentHTML(
            "beforeend",
            `<input type="button" class="search-history-data boast-btn-style" value='查询历史数据'>`
          );
          subTitle.insertAdjacentHTML(
            "afterend",
            `<div class="subTitleTips boast-card-style">
            <span style="color:red">正在分析发牛者历史数据请等待，数据生成后会根据概率重新生成答案</span>
            </div>`
          );
          let spaceUrl = document.querySelector(
            "a[href^='/bbs/userinfo.aspx']"
          ).href;
          let userId = await getUserId(spaceUrl);
          let url = `/games/chuiniu/book_list.aspx?type=0&touserid=${userId}&siteid=1000&classid=0`;
          let res = await fetchData(url);
          let match = /<body>([\s\S]*?)<\/body>/.exec(res);
          let bodyString = match?.[0];
          if (bodyString) {
            let tempDiv = document.createElement("div");
            tempDiv.innerHTML = bodyString;
            let res = await handleData(tempDiv, true);
            tempDiv = null;
            let {
              total,
              tzSelect1,
              tzSelect2,
              tzSelect1Win,
              tzSelect2Win,
              tzWin,
              tzWinRate,
              yzSelect1,
              yzSelect2,
              yzSelect1Win,
              yzSelect2Win,
              tzSelectString,
              yzSelectString,
              tzSelectDomString,
            } = res;
            
            var reverse=tzSelectDomString.split("</b>").reverse().join("");
            //console.log("🐻🐻");
            
            document.querySelector(".subTitleTips").innerHTML = `
              <p>发牛者过去${total}条中，选择了：${reverse} ，答案一：${tzSelect1}次，选择答案二：${tzSelect2}次</p>
              <p>选择1胜率：
              <b style="color:${tzSelect1 > tzSelect2 ? "red" : "unset"}">
              ${(tzSelect1 / total || 0).toFixed(2)}
              </b>
              ，选择2胜率：
              <b style="color:${tzSelect1 < tzSelect2 ? "red" : "unset"}">${(
              tzSelect2 / total || 0
            ).toFixed(2)}</b></p>
            `;

            answer1Rate = tzSelect1 / total;

            randomNum = Math.random() < answer1Rate ? 1 : 2;
            select.value = randomNum;
            console.log("生成答案1的概率：", answer1Rate);
          }
          $(".search-history-data").click(async () => {
            location.href = url;
          });
        }

        let payMoney = document
          .querySelector("form")
          ?.innerText.match(/赌注是 (\d+) 妖晶/)?.[1];
        if (isAutoEat && payMoney && payMoney <= eatBoastMaxNum) {
          submit.click();
        } else {
          console.log("非自动吃牛，不自动吃");
        }
        select.insertAdjacentHTML(
          "afterend",
          `<input type="button" class="random-number-btn boast-btn-style" value='随机生成答案'>`
        );
        $(".random-number-btn").click((e) => {
          randomNum = Math.random() < answer1Rate ? 1 : 2;
          select.value = randomNum;
        });
      } else if (document.title !== "请输入密码") {
        location.href = "/games/chuiniu/index.aspx";
      }
    }

    // 发布吹牛页面
    if ("/games/chuiniu/add.aspx".includes(location.pathname)) {
      let number = document.querySelector("input[type=number]");
      let submit = document.querySelector("input[type=submit]");
      let select = document.querySelector("select");
      let answer1Rate = publishAnswer1Rate;
      let randomNum = Math.random() < answer1Rate ? 2 : 1;
      let isAutoEat = window.location.search.includes("open=new");

      if (document.title === "公开挑战") {
        if (select) {
          if (!isAutoEat) {
            setItem("publishNumber", "0");
          }

          number.value = batchPublishBoastMoney || 500;
          select.value = randomNum;

          select.insertAdjacentHTML(
            "afterend",
            `<input type="button" class="random-number-btn boast-btn-style" value='随机生成答案'>`
          );

          $(".random-number-btn").click((e) => {
            // 发布多发2少发1
            let randomNum = Math.random() < answer1Rate ? 2 : 1;
            select.value = randomNum;
          });
          // iframe里或者自动发肉就提交
          if (window.self !== window.top || isAutoEat) {
            submit?.click();
          }
        } else {
          let tip = document.querySelector(".tip");
          if (tip) {
            let publishNumber = getItem("publishNumber", "0");

            setTimeout(() => {
              if (publishNumber <= 0) {
                setItem("publishNumber", "0");
                location.href = "/games/chuiniu/index.aspx";
              } else {
                setItem("publishNumber", publishNumber - 1);
                location.href = "/games/chuiniu/add.aspx?open=new";
              }
            }, 500);
          }
        }
      }
    }

    // 查看记录
    if ("/games/chuiniu/book_list.aspx".includes(location.pathname)) {
      set_color();
      handleAddSearch();
      handleStatistics();
      // 处理如果是进行中则直接跳转到对应吃牛页面
      let list = document.querySelectorAll(
        "a[href^='/games/chuiniu/book_view.aspx']"
      );
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        let id = item.innerText;
        if (item.parentElement.innerText.includes("进行中")) {
          item.href = `/games/chuiniu/doit.aspx?siteid=1000&classid=0&id=${id}`;
          console.log(`修改完成：${item.href}`);
        }
      }
    }
    // 查看状态
    if ("/games/chuiniu/book_view.aspx".includes(location.pathname)) {
      let content = document.querySelector(".content");
      let id = getUrlParameters().id;
      if (content.innerText.includes("状态:进行中")) {
        content.insertAdjacentHTML(
          "beforeend",
          `<a href="/games/chuiniu/doit.aspx?siteid=1000&classid=0&id=${id}">一键跳转</a>`
        );
      }
    }
    async function handleStatistics(isReturnResult = false) {
      let title = document.querySelector(".title");
      title.insertAdjacentHTML(
        "afterend",
        `
        <div class="line1">
        <a class="statistics-btn">统计当页数据，点击后请等待弹窗返回数据</a>
        </div>
        `
      );
      MY_addStyle(`
        .statistics-btn{
          background: #888888;
          border-radius: 5px;
          width: 100%;
          color: #fff;
          box-sizing: border-box;
          display: inline-block;
          text-align: center;
          cursor: pointer;
        }
        /* 已访问的链接状态 */
        a.statistics-btn:visited{
          color: #fff;
        }
        /* 正在点击链接时的状态 */
        a.statistics-btn:active{
          color: #fff;
        }
      `);
      let isClick = false;
      $(".statistics-btn").click(async () => {
        if (!isClick) {
          isClick = true;
          await handleData();
          isClick = false;
        }
      });
    }
    async function handleData(dom = document, isReturnResult = false) {
      let list = dom.querySelectorAll(
        "a[href^='/games/chuiniu/book_view.aspx']"
      );
      let total = 0;
      let tzSelect1 = 0;
      let tzSelect2 = 0;
      let tzSelect1Win = 0;
      let tzSelect2Win = 0;
      let yzSelect1 = 0;
      let yzSelect2 = 0;
      let yzSelect1Win = 0;
      let yzSelect2Win = 0;

      let tzWin = 0;
      let tzWinRate = 0;

      let tzSelectString = "";
      let yzSelectString = "";
      let tzSelectDomString = "";

      let boastData = getItem("boastData");
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        let id = item.innerText;
        
        if (item.parentElement.innerText.includes("进行中")) {
          continue;
        }
        if (isReturnResult && total >= 10) {
          break;
        }

        let curData;
        if (boastData[id]) {
          curData = boastData[id];
        } else {
          let url = item.href;
          let res = await fetchData(url);
          let regex = /<body>([\s\S]*?)<\/body>/;
          let match = regex.exec(res);
          let bodyString = match?.[0];
          if (bodyString.includes("不存在此挑战！")) {
            continue;
          }
          let money = bodyString.match(/赌注是:(\d+)妖晶/)[1];
          // 获取挑战方出的答案：发吹牛的人
          let challengerAnswer =
            bodyString.match(/挑战方出的是\[答案(\d)\]/)[1];

          // 获取应战方出的答案：接吹牛的人
          let opponentAnswer = bodyString.match(/应战方出的是\[答案(\d)\]/)[1];

          // 获取对应战方状态
          let battleStatus = bodyString.match(
            /对应战方状态:<b>(获胜|失败)!<\/b>/
          )[1];

          curData = {
            id,
            money,
            challengerAnswer,
            opponentAnswer,
            battleStatus,
            lastTime: new Date().getTime(),
          };
          boastData[id] = curData;
          setItem("boastData", boastData);
        }
        tzSelectString += curData.challengerAnswer;
        yzSelectString += curData.opponentAnswer;
        
        
        tzSelectDomString += `<b style="color:${
          curData.battleStatus === "失败" ? "red" : "green"
        }">${curData.challengerAnswer}</b>`;

        total++;

        if (curData.battleStatus === "获胜") {
          // 吃吹牛获胜、发吹牛失败
          if (curData.opponentAnswer == 1) {
            // 吃吹牛的人选1
            yzSelect1++;
            tzSelect1++;
            yzSelect1Win++;
          } else {
            // 吃吹牛的人选2
            yzSelect2++;
            tzSelect2++;
            yzSelect2Win++;
          }
        } else {
          // 吃吹牛失败、发吹牛获胜
          tzWin++;
          tzWinRate = (tzWin / total).toFixed(2);

          // 失败
          if (curData.opponentAnswer == 1) {
            // 吃吹牛的人选1
            yzSelect1++;
            tzSelect2++;
            tzSelect2Win++;
          } else {
            // 吃吹牛的人选2
            yzSelect2++;
            tzSelect1++;
            tzSelect1Win++;
          }
        }
      }
      if (isReturnResult) {
        return {
          total,
          tzSelect1,
          tzSelect2,
          tzSelect1Win,
          tzSelect2Win,
          tzWin,
          tzWinRate,
          yzSelect1,
          yzSelect2,
          yzSelect1Win,
          yzSelect2Win,
          tzSelectString,
          tzSelectDomString,
          yzSelectString,
        };
      } else {
        var reverse=tzSelectString.split("").reverse().join("");
        var reverse2=yzSelectString.split("").reverse().join("");
   
        alert(
          `
          =====当前页发吹牛总条数：${total}====
          发吹牛选择：${reverse}\n
          发吹牛选1的次数：${tzSelect1}，选2的次数：${tzSelect2}\n
          实际发吹牛选1赢的概率：${(tzSelect1Win / total).toFixed(
            2
          )}，选2赢的概率：${(tzSelect2Win / total).toFixed(2)}\n
          如果吃吹牛选1赢的概率：${(tzSelect1 / total).toFixed(
            2
          )}，选2赢的概率：${(tzSelect2 / total).toFixed(2)}\n
          发吹牛赢的次数：${tzWin}，胜率：${tzWinRate}\n
          =====当前页吃吹牛总条数：${total}=====
          吃吹牛选择：${reverse2}\n
          吃吹牛选1的次数：${yzSelect1}，选2的次数：${yzSelect2}\n
          实际吃吹牛实际选1赢的概率：${(yzSelect1Win / total).toFixed(
            2
          )}，选2赢的概率：${(yzSelect2Win / total).toFixed(2)}\n
          如果发吹牛选1赢的概率：${((total - yzSelect1) / total).toFixed(
            2
          )}，选2赢的概率：${((total - yzSelect2) / total).toFixed(2)}\n
          吃吹牛赢的次数：${total - tzWin}，吃吹牛的胜率：${(
            1 - tzWinRate
          ).toFixed(2)}\n
          `
        );
      }
    }
    
         //改变颜色查询页面
    function set_color() {
        var list = document.querySelectorAll('div');
        for(var i = 0; i < list.length; i++){ 
        var x=list[i].innerText;
        if (x.split(",")[2] ===undefined) continue;
        var color=(x.split(",")[2] === "获胜" || x.split(",")[1] === "获胜" )?"green":"red";
        var dav_list = list[i].innerHTML.split("</a>");
        list[i].innerHTML = dav_list[0] +dav_list[1] + `</a><p style="color:${ color };display:inline">`+ dav_list[2]+ '</p>'
        //list[i].style.color=color;
        };
    }
    
    
    function handleAddSearch() {
      let arr = ["/games/chuiniu/book_list.aspx", "/games/chuiniu/index.aspx"];
      if (!arr.includes(location.pathname)) {
        return;
      }
      
      let title = document.querySelector(".title");
      title.insertAdjacentHTML(
        "beforeend",
        `
        <span class="separate"> </span>
        <a class="search-dahua">查询大话</a>
        <span class="separate"> </span>
        <a class="search-qianghua">查询抢话</a>
        `
      );
      // 查询大话
      $(".search-dahua").click(() => {
        let defaultValue = isMobile() ? "0" : "";
        let res = prompt(
          "请输入要查询大话的用户id，输入0查询全部",
          defaultValue
        );
        if (res === null) return;
        if (!res || /^\d+$/.test(res)) {
          location.href = `/games/chuiniu/book_list.aspx?type=0&touserid=${
            res <= 0 ? "" : res
          }&siteid=1000&classid=0`;
        }
      });
      // 查询抢话
      $(".search-qianghua").click(() => {
        let defaultValue = isMobile() ? "0" : "";
        let res = prompt(
          "请输入要查询抢话的用户id，输入0查询全部",
          defaultValue
        );
        if (res === null) return;
        if (!res || /^\d+$/.test(res)) {
          location.href = `/games/chuiniu/book_list.aspx?type=1&touserid=${
            res <= 0 ? "" : res
          }&siteid=1000&classid=0`;
        }
      });
    }
    //  获取用户id
    async function getUserId(url) {
      let res = await fetchData(url);
      let id = res.match(/<b>ID号:<\/b>(\d+)/)?.[1];
      return id;
    }
  }
  // 封装请求
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.text();
      return data;
    } catch (error) {
      // 处理错误
      console.error("Error:", error);
      return error;
    }
  }
  function MY_addStyle(innerHTML) {
    // 创建 style 元素
    let style = document.createElement("style");
    style.type = "text/css";

    // 设置样式内容
    let css = innerHTML;
    style.innerHTML = css;

    // 将 style 元素添加到 head 元素中
    document.head.appendChild(style);
  }
  // 获取url参数
  function getUrlParameters() {
    var search = window.location.search.substring(1); // 去除 "?"
    var parameters = {};

    if (search) {
      var paramsArray = search.split("&");

      for (var i = 0; i < paramsArray.length; i++) {
        var param = paramsArray[i].split("=");
        var paramName = decodeURIComponent(param[0]);
        var paramValue = decodeURIComponent(param[1]);

        // 存储参数名和参数值到对象中
        parameters[paramName] = paramValue;
      }
    }

    return parameters;
  }
  function MY_setValue(key, value) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }
  function MY_getValue(key, defaultValue = {}) {
    const value = localStorage.getItem(key) || defaultValue;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  // 获取值
  function getItem(key, defaultValue = {}) {
    if (["boastData", "autoEatList"].includes(key)) {
      let list = MY_getValue(key, {});
      // 删除过期的肉帖
      deleteExpiredID(list, key);
      // 更新肉帖数据
      setItem(key, list);
      return list;
    }
    return MY_getValue(key, defaultValue);
  }
  // 设置值
  function setItem(key, value) {
    // if (key === "autoEatList") {
    //   deleteExpiredID(value); //删除过期的肉帖
    // }
    MY_setValue(key, value);
  }

  function isMobile() {
    return /Mobile/i.test(navigator.userAgent);
  }
  function timeLeft(time, days = 1) {
    const target = new Date(time + (days - 1) * 24 * 60 * 60 * 1000);
    target.setHours(24, 0, 0, 0);
    return target.getTime();
  }
  /**
   * 删除过期的帖子
   * @param {number|string} value 存储肉帖的对象
   */
  function deleteExpiredID(value, key) {
    let nowTime = new Date().getTime();
    // 吹牛数据默认存储7天
    let expire = key === "boastData" ? 5 : 1;
    let lastTime;
    Object.keys(value).forEach((key) => {
      if (key === "boastData") {
        lastTime = value[key]["lastTime"];
      } else {
        lastTime = value[key];
      }
      if (nowTime > timeLeft(lastTime, expire)) {
        delete value[key];
      }
    });
  }

  /**
   * 简易版jquery实现，用于替换之前写的部分语法，不引用cdn库
   * @returns
   */
  function myJquery() {
    let jQuery = function (selector) {
      return new jQuery.fn.init(selector);
    };

    jQuery.fn = jQuery.prototype = {
      constructor: jQuery,

      init: function (selector) {
        if (!selector) {
          return this;
        }

        if (typeof selector === "string") {
          let elements = document.querySelectorAll(selector);
          this.length = elements.length;
          for (let i = 0; i < elements.length; i++) {
            this[i] = elements[i];
          }
        } else if (selector.nodeType) {
          this[0] = selector;
          this.length = 1;
        } else if (selector instanceof jQuery) {
          return selector;
        } else if (Array.isArray(selector)) {
          for (let i = 0; i < selector.length; i++) {
            this[i] = selector[i];
          }
          this.length = selector.length;
          return this;
        }

        return this;
      },

      length: 0,

      each: function (callback) {
        for (let i = 0; i < this.length; i++) {
          callback.call(this[i], i, this[i]);
        }

        return this;
      },

      css: function (prop, value) {
        if (typeof prop === "string") {
          if (value !== undefined) {
            this.each(function () {
              this.style[prop] = value;
            });
            return this;
          } else {
            return this[0].style[prop];
          }
        } else {
          for (let key in prop) {
            this.each(function () {
              this.style[key] = prop[key];
            });
          }
          return this;
        }
      },

      text: function (text) {
        if (text !== undefined) {
          this.each(function () {
            this.textContent = text;
          });
          return this;
        } else {
          let result = "";
          this.each(function () {
            result += this.textContent;
          });
          return result;
        }
      },

      html: function (html) {
        if (html !== undefined) {
          this.each(function () {
            this.innerHTML = html;
          });
          return this;
        } else {
          return this[0].innerHTML;
        }
      },

      append: function (content) {
        if (typeof content === "string") {
          this.each(function () {
            this.insertAdjacentHTML("beforeend", content);
          });
        } else if (content.nodeType) {
          this.each(function () {
            this.appendChild(content);
          });
        } else if (content instanceof jQuery) {
          this.each(function () {
            let self = this;
            content.each(function () {
              self.appendChild(this);
            });
          });
        }

        return this;
      },

      addClass: function (className) {
        let classNames = className.split(" ");
        this.each(function () {
          for (let i = 0; i < classNames.length; i++) {
            if (this.classList) {
              this.classList.add(classNames[i]);
            } else {
              let currentClasses = this.className.split(" ");
              if (currentClasses.indexOf(classNames[i]) === -1) {
                this.className += " " + classNames[i];
              }
            }
          }
        });

        return this;
      },

      removeClass: function (className) {
        let classNames = className.split(" ");
        this.each(function () {
          for (let i = 0; i < classNames.length; i++) {
            if (this.classList) {
              this.classList.remove(classNames[i]);
            } else {
              let currentClasses = this.className.split(" ");
              let index = currentClasses.indexOf(classNames[i]);
              if (index !== -1) {
                currentClasses.splice(index, 1);
                this.className = currentClasses.join(" ");
              }
            }
          }
        });

        return this;
      },

      show: function () {
        this.each(function () {
          // 恢复元素之前的display属性
          let classDisplay = getComputedStyle(this).getPropertyValue("display");
          let display =
            this.getAttribute("data-display") ||
            (classDisplay === "none" ? "block" : classDisplay);
          this.style.display = display ? display : "";
        });

        return this;
      },

      hide: function () {
        this.each(function () {
          // 记住元素之前的display属性
          let display =
            this.style.display ||
            getComputedStyle(this).getPropertyValue("display");
          if (display !== "none") {
            this.setAttribute("data-display", display);
          }
          this.style.display = "none";
        });

        return this;
      },

      click: function (callback) {
        this.each(function () {
          this.addEventListener("click", callback);
        });

        return this;
      },

      on: function (event, childSelector, data, handler) {
        if (typeof childSelector === "function") {
          handler = childSelector;
          childSelector = null;
          data = null;
        } else if (typeof data === "function") {
          handler = data;
          data = null;
        }

        this.each(function () {
          let element = this;

          let listener = function (e) {
            let target = e.target;
            if (
              !childSelector ||
              element.querySelector(childSelector) === target
            ) {
              handler.call(target, e, data);
            }
          };

          event.split(" ").forEach(function (type) {
            element.addEventListener(type, listener);
          });
        });

        return this;
      },

      prev: function () {
        let prevElement = null;
        this.each(function () {
          prevElement = this.previousElementSibling;
        });

        return jQuery(prevElement);
      },

      next: function () {
        let nextElement = null;
        this.each(function () {
          nextElement = this.nextElementSibling;
        });

        return new jQuery(nextElement);
      },

      children: function (selector) {
        let childElements = [];
        this.each(function () {
          let children = this.children;
          for (let i = 0; i < children.length; i++) {
            if (!selector || children[i].matches(selector)) {
              childElements.push(children[i]);
            }
          }
        });

        return jQuery(childElements);
      },

      parent: function (selector) {
        let parentElements = [];
        this.each(function () {
          let parent = this.parentElement;
          if (!selector || parent.matches(selector)) {
            parentElements.push(parent);
          }
        });
        return jQuery(parentElements);
      },

      prop: function (name, value) {
        if (value === undefined) {
          let element = this[0] || {};
          return element[name];
        } else {
          this.each(function () {
            this[name] = value;
          });

          return this;
        }
      },

      remove: function () {
        this.each(function () {
          this.parentElement.removeChild(this);
        });

        return this;
      },

      height: function (value) {
        if (value === undefined) {
          if (this[0]) {
            return this[0].clientHeight;
          } else {
            return null;
          }
        } else {
          this.each(function () {
            this.style.height = isNaN(value) ? value : value + "px";
          });
          return this;
        }
      },
    };
   
    jQuery.fn.init.prototype = jQuery.fn;

    return jQuery;
  }
})();
