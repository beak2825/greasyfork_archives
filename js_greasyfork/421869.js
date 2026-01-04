// ==UserScript==
// @name         Discuz自动回复
// @namespace    http://tampermonkey.net/
// @version      2.23
// @description  Discuz自动回复按钮，可自选回复语句。修改自https://greasyfork.org/scripts/4635
// @author       backrock12
// @license      GPL License
// @include      http://*forum.php?*
// @include      http://*thread*.html
// @include      https://*forum.php?*
// @include      https://*thread*.html
// @include      *thread*.html
// @include      *forum.php?*
// @require      https://greasyfork.org/scripts/421868-gbk-js/code/GBKjs.js?version=901431
// @downloadURL https://update.greasyfork.org/scripts/421869/Discuz%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/421869/Discuz%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /* 自定义参数 */
  const selectnum = 5; //下拉数量
  const istitle = false; //是否显示标题  true/false
  //回复语
  /* 例子
                   {
                    key: "www.baidu.com",   //匹配的网址，可以填写正则表达式
                    value: [
                      "baidu 1",  //对应回复语
                      "baidu 2",
                      "baidu 3",
                      "baidu 4",
                      "baidu 5",
                    ]
                  } */

  const messages = [
    {
      //默认回复，请勿去掉
      key: "default",
      value: [
        "十分感谢分享",
        "楼主是个好人",
        "楼主一生平安",
        "感谢楼主分享，顶贴支持",
        "好东西啊，谢谢楼主分享",
        "收藏了。谢谢楼主分享",
        "大佬辛苦了",
        "感谢楼主分享的内容！",
        "感谢分享！给你点赞！",
        "感谢分享！论坛因你更精彩！",
        "看看隐藏内容是什么！谢谢！",
        "先下载看看好不好用！",
        "楼主一生平安！好人一生平安！",
        "你说的观点我也很支持！",
        "楼主太棒了！我先下为敬！",
        "给楼主点赞，希望继续分享！",
        "感谢论坛，感谢LZ热心分享！",
        "感谢楼主分享优质内容，希望继续努力！",
        "下载试用一下，如果用着不错就给楼主顶贴！",
        "这么好的东西！感谢楼主分享！感谢论坛！",
        "希望楼主继续分享更多好用的东西！谢谢！",
        "看到楼主这么努力分享，我只能顶个贴感谢一下了！",
        "好东西，拿走了，临走顶个贴感谢一下楼主！",
        "这就非常给力了！感谢分享！",
        "厉害了！先收藏，再回复！谢谢！",
        "感谢大佬分享6！",
      ],
    },
    /*     {
                          key: "www.baidu.com",
                          value: [
                            "baidu 1",
                            "baidu 2",
                            "baidu 3",
                            "baidu 4",
                            "baidu 5",
                          ]
                        }, */
  ];

  /* 系統參數 */
  let isready = true;
  const keyword = "回复可见|隐藏";
  let GBK = null;
  let curmessage;
  var run_mk = true;
  var cssnum = 0;
  /* ---------- */

  initialize();

  /* ---------- */

  function autoReply(re_message, obj) {
    if (!isready) return;
    isready = false;
      console.log("autoReply");
    let default_message;

    let htitle = document.querySelector(".ts");
    if (htitle) {
      htitle = htitle.innerText;
    } else {
      htitle = document.querySelector(".thread_subject");
      if (htitle) htitle = htitle.innerText;
    }

    if (!htitle) htitle = document.title;

    default_message = re_message
      ? re_message
      : curmessage[Math.floor(Math.random() * curmessage.length)];

    let fastpost_textarea = document.querySelectorAll("#fastpostmessage");
    let fastpost_submit = document.querySelectorAll("#fastpostsubmit");
    let fastpost_verify = document.querySelectorAll(
      'input[name="seccodeverify"]'
    );

    let message = istitle ? default_message + "\r\n" + htitle : default_message;

    if (fastpost_textarea.length == 0 || fastpost_submit.length == 0) {
      //   alert("未找到快速回复表格！");
      console.log("未找到快速回复表格！");
      autoReplynoapi(message, obj);
      isready = true;
      return;
    }

    fastpost_textarea[0].innerHTML = message;

    // console.log(message);

    //xhr不需要，不过输入验证码的情况填上也是方便点的
    if (fastpost_verify.length > 0) {
      alert("需要输入验证码！");

      let h = document.body.scrollHeight;
      window.scroll(0, h);
      fastpost_verify[0].focus();
      isready = true;
      return;
    }

    //xhr发帖
    let form = document.querySelectorAll("#fastpostform")[0];
    let url = form.action;
    let hidden = form.querySelectorAll('input[type="hidden"]');
    let data = "";
    for (let i = 0; i < hidden.length; i++) {
      data += hidden[i].name + "=" + hidden[i].value + "&";
    }

    let charset =
      typeof wrappedJSObject == "object"
        ? wrappedJSObject.document.characterSet
        : document.characterSet;

    let mmessage;
    if (charset.toLowerCase() == "gbk") {
      if (!GBK) GBK = GBKfunction();
      mmessage = GBK.URI.encodeURI(message);
    } else {
      mmessage = encodeURIComponent(message);
    }

    let mdata = "message=" + mmessage + "&replysubmit=replysubmit&" + data;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function (oEvent) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          //console.log("OK", xhr);
          location.reload();
        } else {
          console.log("Error", xhr.statusText);
        }
      }
    };
    xhr.send(mdata);
    //xhr over
    isready = true;
  }

  function autoReplynoapi(re_message, obj) {
    // console.log(obj);
    if (!obj) return;
    if (obj.className != "locked") return;
    //const hf = $(obj).find("a:contains('回复')");
    //  const hf = obj.querySelector("a:contains('回复')");
    const hf = [...obj.querySelectorAll("div")].filter((div) =>
      div.innerHTML.includes("回复")
    );

    if (hf.length > 0) {
      hf[0].click();
      waitElement("#postmessage", 10, 150)
        .then(function () {
          // $("#postmessage").val(re_message);
          // $("#postsubmit").click();

          document.querySelector("#postmessage").value = re_message;
          document.querySelector("#postsubmit").click();
        })
        .catch(function () {
          console.log("waitElement error");
        });
    } else {
      // const fhf = $("#fastpostmessage");
      const fhf = document.querySelector("#fastpostmessage");

      if (fhf) {
        //fhf.val(re_message);
        fhf.value = re_message;

        // $("#fastpostsubmit").click();
        const c = document.querySelector("#fastpostsubmit");
        c.click();
      }
    }

    isready = true;
    return;
  }

  function initialize() {
    const list = document.querySelectorAll("div.locked");
    if (list.length > 0) {
      if (!addcss()) return;
      if (!run_mk) return;
      let ulstring = "";

      if (messages.length == 1) {
        curmessage = messages[0].value;
      } else {
        for (let m = 0; m < messages.length; m++) {
          const e = messages[m];
          if (e.key == "default") {
            curmessage = e.value;
          }
          let reg;
          if (Object.prototype.toString.call(e.key) == "[object RegExp]") {
            reg = e.key;
          } else {
            reg = new RegExp(e.key);
          }
          if (reg.test(location.href)) {
            curmessage = e.value;
            break;
          }
        }
      }

      const num = selectnum > curmessage.length ? curmessage.length : selectnum;
      for (let i = 0; i < num; i++) {
        ulstring += `<li><a href="javascript:;">${curmessage[i]}</a></li>`;
      }

      if (!run_mk) return;

      if (ulstring) {
        for (const n of list) {
          if (
            n.innerHTML.search(new RegExp(keyword)) != -1 &&
            n.innerHTML.search(new RegExp('title="内容购买"'))
          ) {
            let bt = document.createElement("div");
            bt.className = "DiscuzautoReplyele";
            bt.innerHTML = `
                      <div class="DiscuzautoReply">
                      <button class="DiscuzautoReplybutton" >自动回复</button>
                    <div class="DiscuzautoReplyDiv">
                    <button class="DiscuzautoReplyhead">»</button>
                    <div class="DiscuzautoReplyDownbtn">
                      <ul>
                        ${ulstring}
                      </ul>
                    </div>
                  </div>
                  </div>
                    `;
            run_mk = false;
            n.appendChild(bt);
          }
        }

        const allbutton = document.querySelectorAll(".DiscuzautoReplybutton");
        for (let b of allbutton) {
          b.onclick = function () {
            autoReply(null, this.parentElement.parentElement.parentElement);
          };
        }

        const alla = document.querySelectorAll(
          ".DiscuzautoReplyDownbtn ul li a"
        );
        for (let b of alla) {
          b.onclick = function () {
            autoReply(
              this.innerHTML,
              this.parentElement.parentElement.parentElement
            );
          };
        }
      }
    }
  }

  function addcss() {
    const cssText = [
      `
                      .DiscuzautoReplybutton {
                      color: rgb(102, 102, 102);
                      background-color: rgb(238, 238, 238);
                      border: medium none;
                      font-weight: 300;
                      font-size: 15px;
                      text-decoration: none;
                      text-align: center;
                      line-height: 20px;
                      height: 20px;
                      padding-left: 15px;
                      padding-right: 0px;
                      margin: 0px 0px 0px 5px;
                      display: inline-block;
                      -moz-appearance: none;
                      cursor: pointer;
                      box-sizing: border-box;
                      transition-property: all;
                      transition-duration: 0.3s;
                      border-radius: 4px;
                      }
                      `,
      `    .DiscuzautoReplyDiv{
                          display:inline-block;
                      }`,
      `    .DiscuzautoReplyDiv:hover .DiscuzautoReplyDownbtn{
                          display:block;
                           background-color: #f1f1f1;
                      }`,
      `    .DiscuzautoReplyDiv .DiscuzautoReplyDownbtn{
                          display:none;
                          background-color:#f9f9f9;
                          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                          min-width: 160px;
                          position:absolute;
                          z-index:9999;
                          margin: -2px 2px 2px -40px;
                          transition:all .5s .1s;
                          -moz-transition:all .5s .1s;
                          -ms-transition:all .5s .1s;
                          -o-transition:all .5s .1s;
                          -webkit-transition:all .5s .1s;
                      }`,
      `    .DiscuzautoReplyDiv .DiscuzautoReplyDownbtn li{
                          line-height:20px;
                          text-align:left;
                          padding-left:4px;
                          margin-left: 0px;
                          list-style: none;
                      }`,
      `
                      .DiscuzautoReplyDiv .DiscuzautoReplyDownbtn ul {
                      margin: 0px;
                      padding: 0px;
                      text-decoration: none;
                      list-style: none;
                      left:auto;
                      right:0;
                      }`,
      `    .DiscuzautoReplyDiv .DiscuzautoReplyDownbtn a:hover{
                          text-decoration:underline;
                          color:#f00;
                          transition:all .5s .1s;
                          -moz-transition:all .5s .1s;
                          -ms-transition:all .5s .1s;
                          -o-transition:all .5s .1s;
                          -webkit-transition:all .5s .1s;
                      }`,
      `    .DiscuzautoReplyDiv .DiscuzautoReplyDownbtn a{
                          display:block;
                          color:black;
                          width:100%;
                          font-size: 13px;
                      }`,
      `.DiscuzautoReplyhead {
                        color: rgb(102, 102, 102);
                        background-color: rgb(238, 238, 238);
                        border: medium none;
                        font-size: 15px;
                        text-decoration: none;
                        text-align: center;
                        line-height: 20px;
                        height: 20px;
                        margin-left: -5px;
                        padding-left: 20px;
                      }`,
    ];

    function createStyleSheet() {
      var head = document.head || document.getElementsByTagName("head")[0];
      var style = document.createElement("style");
      style.type = "text/css";
      head.appendChild(style);
      return style.sheet || style.styleSheet;
    }

    try {
      var sheet = createStyleSheet();

      for (const s of cssText) {
        // document.styleSheets[0].insertRule(s, 0);
        sheet.insertRule(s, 0);
      }
      return true;
    } catch (e) {
      console.log("addcss err");
      if (cssnum >= 5) {
        console.log("initialize初始化失敗");
        return false;
      }
      cssnum++;
      setTimeout(initialize, 1000);
      return false;
    }
  }

  function waitElement(selector, times, interval, flag = true) {
    var _times = times || -1, // 默认不限次数
      _interval = interval || 500, // 默认每次间隔500毫秒
      _selector = selector, //选择器
      _iIntervalID, //定时器id
      _flag = flag;
    return new Promise(function (resolve, reject) {
      _iIntervalID = setInterval(function () {
        if (!_times) {
          //是0就退出
          clearInterval(_iIntervalID);
          reject();
        }
        _times <= 0 || _times--; //如果是正数就 --
        //  var _self = $(_selector); //再次选择
        const _self = document.querySelectorAll(_selector);

        if ((_flag && _self.length) || (!_flag && !_self.length)) {
          //判断是否取到
          clearInterval(_iIntervalID);
          resolve(_self);
        }
      }, _interval);
    });
  }
})();
