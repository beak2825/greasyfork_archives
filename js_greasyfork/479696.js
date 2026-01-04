// ==UserScript==
// @name         SuperStar小助手-支持作业、考试、视频、章节测验全自动处理
// @namespace    Trprr
// @version      2.5.7
// @author       Trprr
// @description  【🥇操作简单】SuperStar小助手，无需任何配置，安装即可使用。【🔊功能齐全】支持视频、音频倍速秒过；文档、图书自动完成；字体解密；章节测验、课后作业、考试自动答题、自动提交、自动收录答案；支持自动切换任务点、自动登录等。【📔丰富题库】免费题库、自建题库、第三方独家题库，每日更新，精准识别，答案全对。【✨功能扩展】开放自定义参数，功能控制更简单
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA5RJREFUWEftlluoVVUUhr/z4IHIwBfFykgTQkQyMMK0pJv4YIWXSsoHBSvNS0WKcUSwIEWwlEjBEEUU0bzkQ5EP3hMqK/GGZRJiN8METRRUFHR+Mlass85Ze6/ty0FwwOJc5hxz/PMfY/xjNtHB1tTB8bmlATQD9wB3A6eBE8DVRhltlAGDvQKMBB4vBLuS1n4Fvk+gPgN+yq13AgYDPeI7BfwBbG8EwPvA63HrfOyDwF3AAwVAnwO/AENSoCcAQRStpSqA9cBL4b0f+AbYm1jYFvS71AXoC4wD3ihJxRbgh2DhKaC5CoBrucNmp9t+DFyKNAwHBgLnAH//L/YOAN7LgX4XWJQ7ZwywDvitHgBv+Wg4ejsplYl3gEGFWz4C7Cv8L8+c+7+Lov0SEOSntQDMBWbFgeZxTwT3UO0YsDaqX1p/LqF9MzAC+Au4LxXjVuBZ4Kg/ywD0i2q+MzktT86vAW8Bn0SQacAy4HKFtnsYMPfdgQ25tIwCNpcBWADMCMqk7pkoOOM9D3xVIXB+iynL18DLAaZUCXcCTwKToqdtwTkpb+buhQaDS/caoFv4/R/cv8sYyCrfAvwxHAW0q8Hgps5U5W0CsCL7R3sAVKs/Q1bvSMUl4n8AWWnELGALWfvWfAOm1m9mLQCPhYNS6q0vAL8DPStGV2DUgGGx/81UgEujEwTxdWjGjeX2GLDPbTXp9rCxSdlOVmDAHBtY0dFkzHrxAprq6IzYBLxYxkAW3PXDwEMVb+2MsGseTCAuAh8mmZ1X8JWFicBiwDZuw0A+eLZuDztsyuzVNAum5FTRLjG4wlS03TGYDC6IVgD6RJ/fC6wO0RiaUvRB2mULFk1lmwy4R1OyFaxixef9/gW6Ar1CPVsB+CKGi3l7GpiqTif1OxNzXNnUWZb8LE7NQnXfqhosuVSqIxZh/1ShByJ3Uq7Gaz4Y1O4lIbmjgftjzfowx060eibYrIXbqKgApgMfAYeAt+NxoW6bDtUvb754TItDqKplouYcUFNamQCeC4mtdaDvPQOvrBo1sdaS64QjgAOujWU6YK8rm4qQY1MllBHnt4IyPjwVkfkxmsuw9AYW5mbG3/ECand/vQdJ5mS+vVFmTkNZOR4PUV/H1pI15Nc5Nqp8jt1SqwrAA3xYWiMWYz2zgAWt8tW0RgBkB5kmq9nq9pnu7c+HXJvrjUlwdiSwZ+sFd/1mAFQ5t/Ke2wA6nIHr54C0BK9FxloAAAAASUVORK5CYII=
// @match      	 *://*.edu.cn/*
// @match      	 *://*.org.cn/*
// @match      	 *://*.hnsyu.net/*
// @match      	 *://*.qutjxjy.cn/*
// @match      	 *://*.ynny.cn/*
// @match      	 *://*.hnvist.cn/*
// @match      	 *://*.fjlecb.cn/*
// @match      	 *://*.gdhkmooc.com/*
// @match      	 *://*.chaoxing.com/*
// @match      	 *://*.zjelib.cn/*
// @match      	 *://*.cqrspx.cn/*
// @match      	 *://*.webtrn.cn/*
// @connect      scriptcat.org
// @connect      lemtk.xyz
// @connect      ioscx.com
// @connect      icodef.com
// @connect      enncy.cn
// @connect    	 localhost
// @connect    	 127.0.0.1
// @connect    	 vanse.top
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @require      https://update.greasyfork.org/scripts/474385/1535220/GF_ElementGetter.js
// @require      https://update.greasyfork.org/scripts/445293/1052390/TyprMd5.js
// @require      https://s4.zstatic.net/ajax/libs/sweetalert2/11.22.3/sweetalert2.all.min.js
// @require      https://s4.zstatic.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @resource     Table  https://www.forestpolice.org/ttf/2.0/table.json
// @license      GPL-3.0-or-later
// @antifeature  payment
// @downloadURL https://update.greasyfork.org/scripts/454801/SuperStar%E5%B0%8F%E5%8A%A9%E6%89%8B-%E6%94%AF%E6%8C%81%E4%BD%9C%E4%B8%9A%E3%80%81%E8%80%83%E8%AF%95%E3%80%81%E8%A7%86%E9%A2%91%E3%80%81%E7%AB%A0%E8%8A%82%E6%B5%8B%E9%AA%8C%E5%85%A8%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/454801/SuperStar%E5%B0%8F%E5%8A%A9%E6%89%8B-%E6%94%AF%E6%8C%81%E4%BD%9C%E4%B8%9A%E3%80%81%E8%80%83%E8%AF%95%E3%80%81%E8%A7%86%E9%A2%91%E3%80%81%E7%AB%A0%E8%8A%82%E6%B5%8B%E9%AA%8C%E5%85%A8%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

var setting = {
    tikuAdapter: {
      use: 0,
      url: "http://localhost:8060/adapter-service/search?use=local,icodef,buguake,wanneng,lemon&icodefToken=UafYcHViJMGzSVNh&wannengToken=E196FD8B49"
    },
    // tikuAdapter 配置详见 https://github.com/DokiDoki1103/tikuAdapter
    showBox: 1,
    // 显示脚本浮窗，0为关闭，1为开启，不建议关闭
    tiku: 1,
    // 柠檬题库服务器切换，0为主线路，1为备用线路
    task: 0,
    // 只处理任务点任务，0为关闭，1为开启
    video: 1,
    // 处理视频，0为关闭，1为开启
    audio: 1,
    // 处理音频，0为关闭，1为开启
    rate: 1,
    // 视频/音频倍速，0为秒过，1为正常速率，最高16倍
    review: 0,
    // 复习模式，0为关闭，1为开启可以补挂视频时长
    work: 1,
    // 测验自动处理，0为关闭，1为开启，开启将会处理测验，关闭会跳过测验
    time: 5e3,
    // 答题时间间隔，默认5s=5000
    sub: 1,
    // 测验自动提交，0为关闭,1为开启，当没答案时测验将不会提交，如需提交请设置force：1
    force: 0,
    // 测验强制提交，0为关闭，1为开启，开启此功能将会强制提交测验（无论作答与否）
    share: 1,
    // 自动收录答案，0为关闭，1为开启，推荐开启，会在相应页面自动收录答案
    decrypt: 1,
    // 字体解密，0为关闭，1为开启，推荐开启，方法来自wyn665817大佬
    examTurn: 1,
    // 考试自动跳转下一题，0为关闭，1为开启
    examTurnTime: 0,
    // 考试自动跳转下一题随机间隔时间(3-7s)之间，0为关闭，1为开启
    examAutoClick: 1,
    // 考试自动点击答案，0为关闭，1为开启
    autoLogin: 0,
    // 自动登录，0为关闭，1为开启，开启此功能请配置登陆配置项
    phone: "",
    // 登录配置项：登录手机号/SuperStar号
    password: ""
    // 登录配置项：登录密码
  };
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var _w = _unsafeWindow, _l = location, _d = _w.document, $ = _w.jQuery || top.jQuery, md5 = md5 || window.md5, UE = _w.UE, Swal = Swal || window.Swal, _host = ["aHR0cHM6Ly9hcGkubGVtdGsueHl6", "aHR0cHM6Ly9hcGkudmFuc2UudG9w", "aHR0cHM6Ly9hcGkuaW9zY3guY29t"][setting.tiku];
  var _mlist, _defaults, _domList, $subBtn, $saveBtn, $frame_c;
  var reportUrlChange = 0;
  var isUpdate = 0;
  const tikuAdapter = (_t, _q, _o) => {
    return new Promise(resolve => {
      _GM_xmlhttpRequest({
        method: "POST",
        url: setting.tikuAdapter.url,
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        data: JSON.stringify({
          question: _q,
          options: _o,
          type: _t
        }),
        onload: function (r) {
          try {
            const res = JSON.parse(r.responseText);
            resolve(res.answer.answerText);
          } catch (e) {
            resolve("");
          }
        },
        onerror: function (e) {
          console.log(e);
          resolve("");
        }
      });
    });
  };
  Object.defineProperty(setting, "token", {
    get() {
      return _GM_getValue("lemtk_token") ? _GM_getValue("lemtk_token").trim() : "";
    },
    set(val) {
      _GM_setValue("lemtk_token", val.trim())
    }
  });
  $(document).keydown(function (e) {
    if (e.keyCode == 75 && $("#ne-21notice")[0] != void 0) {
      let show = $("#ne-21box").css("display");
      $("#ne-21box").css("display", show == "block" ? "none" : "block");
    }
  });
  $(".navshow").find("a:contains(体验新版)")[0] ? $(".navshow").find("a:contains(体验新版)")[0].click() : "";
  setting.decrypt ? decryptFont() : "";
  if (btoa(_l.hostname) == "aS5tb29jLmNoYW94aW5nLmNvbQ==" || btoa(_l.hostname) == "aS5jaGFveGluZy5jb20=") {
    showTips();
  } else if (_l.pathname == "/login" && setting.autoLogin) {
    showBox();
    setTimeout(() => {
      autoLogin();
    }, 3e3);
  } else if (_l.pathname.includes("/mycourse/studentstudy")) {
    showBox();
    $("#ne-21log", window.parent.document).html("<hr />🎉🎉🎉脚本已加载，初始化完毕!🎉🎉🎉");
  } else if (_l.pathname.includes("/knowledge/cards")) {
    if (top.location.href != _GM_getValue("curUrl")) {
      _GM_setValue("curUrl", top.location.href);
      setTimeout(() => {
        top.location.replace(top.location.href);
      }, 1e3);
    } else {
      check_update().then(() => {
        console.log("update...")
      }).catch(() => {
        var params = getTaskParams();
        if (params == null || params == "$mArg" || $.parseJSON(params)["attachments"].length <= 0) {
          logger("无任务点可处理，即将跳转页面", "red");
          toNext();
        } else {
          setTimeout(() => {
            top.checkJob ? top.checkJob = () => false : true;
            _domList = [];
            _mlist = $.parseJSON(params)["attachments"];
            _defaults = $.parseJSON(params)["defaults"];
            $.each($(".wrap .ans-cc .ans-attach-ct"), (i, t) => {
              _domList.push($(t).find("iframe"));
            });
            logger("共计" + _mlist.length + "个任务,即将开始逐个处理~", "#ed4845");
            missonStart();
          }, 3e3);
        }
      })
    }
  } else if (_l.pathname.includes("/exam/test/reVersionTestStartNew")) {
    showBox();
    setTimeout(() => {
      missonExam();
    }, 3e3);
  } else if (_l.pathname.includes("/exam/test/reVersionPaperMarkContentNew")) {
    setting.share && (() => {
      showBox();
      setTimeout(() => {
        uploadExam();
      }, 3e3);
    })();
  } else if (_l.pathname.includes("/mooc2/work/dowork")) {
    showBox();
    setTimeout(() => {
      missonHomeWork();
    }, 3e3);
  } else if (_l.pathname.includes("/mooc2/work/view")) {
    setting.share && (() => {
      showBox();
      setTimeout(() => {
        uploadHomeWork();
      }, 3e3);
    })();
  } else if (_l.pathname.includes("/work/phone/doHomeWork")) {
    _oldal = _w.alert;
    _w.alert = function (msg) {
      if (msg == "保存成功") {
        return;
      }
      return _oldal(msg);
    };
    _w.workPop = function (content, okTent, okcallback, cancelCallback) {
      okcallback && okcallback();
    };
    _w.workPop2 = function (content, okTent, cancelTent, okcallback, cancelCallback) {
      okcallback && okcallback();
    };
    if (top.workPop2) {
      top.workPop2 = _w.workPop2;
    }
  } else if (_l.pathname.includes("/mooc2/exam/exam-list")) {
    Swal.fire("SuperStar学习小助手提示", "注意：专业课可能会存在答案不全或无答案，请谨慎使用脚本考试，一切后果由您自己承担。", "info");
  } else if (_l.pathname.includes("/mycourse/studentcourse")) {
    let texts = `<div style="font-size: x-small;">注意：请勿在非正常学习时间段(凌晨、通宵)运行脚本，以免造成学习进度被重置。<hr />此项目作为开源的用户脚本，遵循用户脚本的编写规范，并且使用纯粹的 javascript 执行代码，不对页面进行任何源码的修改，不附加任何等非法入侵计算机系统的功能，不对客户端计算机进行任何破坏越权控制等行为。</div>`;
    Swal.fire(texts);
  } else {
  
  };
  function http2https(url) {
    let _url = url.replace(/^http:/, "https:");
    return _url;
  }
  function parseUrlParams() {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    let _p = {};
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      _p[pair[0]] = pair[1];
    }
    return _p;
  }
  function showTips() {
    var _msg = `<div style="font-size: x-small;"><span style='color: red;'>题库为第三方题库，与本脚本无任何关系，有能力者可自行更换。</span> <br> 脚本失效问题请直接GreasyFork私信或油猴中文网私信。<br> 脚本基于Ne-21修改且供自己使用，感谢Ne-21大佬的源码！</div>`;
    Swal.fire(_msg);
  }
  function switchLemtkPro() {
    if (_GM_getValue("lemtkpro") == 1) {
      $("#lemtkpro").text("关闭题库高级搜索");
    } else if (_GM_getValue("lemtkpro") == 0) {
      $("#lemtkpro").text("开启题库高级搜索");
    } else {
      _GM_setValue("lemtkpro", 0);
      switchLemtkPro();
    }
  }
  function switchLemtkToken() {
    if (setting.token) {
      $("#lemtktoken").val(setting.token);
      $("#lemtkbtn").text("清空Token");
      $("#lemtksq").text("重置Token");
    } else {
      $("#lemtktoken").val("");
      $("#lemtkbtn").text("保存Token");
      $("#lemtksq").text("获取Token");
    }
  }
  function showBox() {
    if (setting.showBox && top.document.querySelector("#ne-21notice") == void 0) {
      var box_html = `<div style="font-family: fangsong;font-weight: bold;"><div id="ne-21box" style="border: 2px dashed rgb(0, 85, 68); width: 380px; position: fixed; top: 6%; right: 20%; z-index: 99999; background-color: rgba(184, 247, 255, 0.7); overflow-x: auto;">
          <div style="display: flex;justify-content: space-between;margin: 0 5%;" title="按k键即可恢复面板"><h3 style="text-align: center;">🌸SuperStar学习小助手v` + _GM_info["script"]["version"] + `</h3><h3 id="ne-21close" style="color: red;">[K键关闭面板]</h3></div>
          <div id="ne-21notice" style="border-top: 1px solid #000;border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div>
          <div style="padding-bottom: 5px;"><div style="display: flex;padding: 2px 5px; justify-content: space-around;"><div>柠檬题库Token：<input type="password" id="lemtktoken" placeholder="请输入Token" /></div><button style="width: 25%;" id="lemtkcopy">复制Token</button></div><div style="display: flex;justify-content: space-evenly;align-items: center;"><button id="lemtkpro">开启/关闭高级搜索</button> - <button id="lemtkbtn">保存Token</button> - <button id="lemtksq">获取/重置Token</button></div></div>
          <div id="ne-21log" style="max-height:200px;"></div>
      </div></div>`;
      $(box_html).appendTo("body");
      $("#ne-21close").click(function () {
        let show = $("#ne-21box").css("display");
        $("#ne-21box").css("display", show == "block" ? "none" : "block");
      });
      $(`<div id='tips21'>
              <p style="text-align: center;">
              🔈脚本所有的功能均没有向用户收取费用，题库配置如果不设置仍然可以使用脚本的其他功能。如果题库配置需要收费，那么最终解释权归题库配置的提供者所有。
              </p>
              <hr />
              <p style="text-align: center;">
              🎉脚本集成柠檬题库，可免费搜索，题库支持自主上传题目，推荐使用高级搜索，提高题库命中率~<br />👉<a href="https://www.lemtk.xyz/#/" target="_blank" style="color: #ee2746;text-decoration: underline;">点此前往柠檬题库</a>👈
              </p>
          </div>`).appendTo("#ne-21notice");
      $("#lemtkbtn").click(function () {
        if (setting.token) {
          setting.token = "";
          logger("Token清除成功！", "green");
        } else {
          if ($("#lemtktoken").val().length != 32) {
            logger("Token格式不正确！", "red");
            return;
          }
          setting.token = $("#lemtktoken").val();
          logger("Token保存成功！", "green");
        }
        switchLemtkToken();
      });
      $("#lemtksq").click(function () {
        window.open("https://www.lemtk.xyz/#/", "_blank");
      });
      $("#lemtkpro").click(function () {
        if (_GM_getValue("lemtkpro")) {
          _GM_setValue("lemtkpro", 0);
          logger("已关闭高级搜索功能！", "red");
        } else {
          _GM_setValue("lemtkpro", 1);
          logger("已开启高级搜索功能！搜题需配置柠檬题库TOKEN。", "red");
        }
        switchLemtkPro();
      });
      $("#lemtkcopy").click(function () {
        _GM_setClipboard($("#lemtktoken").val());
        logger("已复制Token到剪贴板！", "green");
      });
    } else {
      $("#ne-21log", window.parent.document).html("");
    }
  
    switchLemtkPro();
    switchLemtkToken();
  }
  function logger(str, color) {
    let logSelector = $("#ne-21log", window.parent.document);
    let _time = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    $('<hr /><p style="color: ' + color + ';">[' + _time + "]" + str + "</p>").prependTo(logSelector).on("click", function () {
      if ("题目".indexOf($(this).html()) != -1) {
        _GM_setClipboard(getStr($(this).html(), "题目:", "<br>----&gt;"));
        Swal.fire({
          text: "已复制",
          position: "top-end",
          width: 150,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
  function getStr(str, start, end) {
    let res = str.match(new RegExp(`${start}(.*?)${end}`));
    return res ? res[1] : null;
  }
  function getTaskParams() {
    try {
      var _iframeScripts = _d.scripts, _p = null;
      for (let i = 0; i < _iframeScripts.length; i++) {
        if (_iframeScripts[i].innerHTML.indexOf('mArg = "";') != -1 && _iframeScripts[i].innerHTML.indexOf("==UserScript==") == -1) {
          _p = getStr(_iframeScripts[i].innerHTML.replace(/\s/g, ""), "try{mArg=", ";}catch");
          return _p;
        }
      }
      return _p;
    } catch (e) {
      return null;
    }
  }
  function getCk(name) {
    let _a;
    return (_a = document.cookie.match(`[;s+]?${name}=([^;]*)`)) == null ? void 0 : _a.pop();
  }
  function check_update() {
    return new Promise((reslove, reject) => {
      try {
        _GM_xmlhttpRequest({
          url: "https://scriptcat.org/api/v2/scripts/942",
          method: "GET",
          timeout: 3e3,
          onload: function (xhr) {
            let { code, data, msg } = JSON.parse(xhr.response)
            version_old = _GM_info["script"]["version"]
            version_new = data.script.version
            if (version_old != version_new) {
              logger("⚠检测到SuperStar最新版本为v" + version_new + ",请进入以上托管地址安装更新。", "red")
              logger("⚠ScriptCat托管地址：https://scriptcat.org/zh-CN/script-show-page/942", "red")
              logger("⚠Greasyfork托管地址：https://greasyfork.org/scripts/454801", "red")
              reslove()
            } else {
              logger("脚本更新检测成功，当前为最新版本", "green")
              reject()
            }
          },
          ontimeout: () => {
            logger("脚本更新检测链接超时，请手动检查脚本是否为最新版本。", "red")
            logger("ScriptCat托管地址：https://scriptcat.org/zh-CN/script-show-page/942", "red")
            logger("Greasyfork托管地址：https://greasyfork.org/scripts/454801", "red")
            reject()
          },
          onerror: (e) => {
            console.log(e)
            logger("脚本更新检测失败，请手动检查脚本是否为最新版本。", "red")
            logger("ScriptCat托管地址：https://scriptcat.org/zh-CN/script-show-page/942", "red")
            logger("Greasyfork托管地址：https://greasyfork.org/scripts/454801", "red")
            reject()
          }
        });
      } catch (e) {
        console.log(e)
        logger("脚本更新检测失败，请手动检查脚本是否为最新版本。", "red")
        logger("ScriptCat托管地址：https://scriptcat.org/zh-CN/script-show-page/942", "red")
        logger("Greasyfork托管地址：https://greasyfork.org/scripts/454801", "red")
        reject()
      }
    })
  }
  function autoLogin() {
    logger("用户已设置自动登录", "green");
    if (setting.phone.length <= 0 || setting.password.length <= 0) {
      logger("用户未设置登录信息", "red");
      return;
    }
    setTimeout(() => {
      $("#phone").val(setting.phone);
      $("#pwd").val(setting.password);
      $("#loginBtn").click();
    }, 3e3);
  }
  function toNext() {
    refreshCourseList().then((res) => {
      if (setting.review || !setting.work) {
        setTimeout(() => {
          $("#ne-21log", window.parent.document).html("");
          if (top.document.querySelector("#mainid > .prev_next.next") == void 0) {
            top.document.querySelector("#prevNextFocusNext").click();
            return;
          }
          top.document.querySelector("#mainid > .prev_next.next").click();
        }, 5e3);
        return;
      }
      let _t = [];
      $.each($(res).find("li"), (_, t) => {
        let curid = $(t).find(".posCatalog_select").attr("id"), status = $(t).find(".prevHoverTips").text(), name = $(t).find(".posCatalog_name").attr("title");
        if (curid.indexOf("cur") != -1) {
          _t.push({ "curid": curid, "status": status, "name": name });
        }
      });
      let _curChaterId = $("#coursetree", window.parent.document).find(".posCatalog_active").attr("id");
      let _curIndex = _t.findIndex((item) => item["curid"] == _curChaterId);
      for (_curIndex; _curIndex < _t.length - 1; _curIndex++) {
        if (_t[_curIndex]["status"].indexOf("待完成") != -1) {
          let c_tabs = top.document.querySelectorAll("#prev_tab li");
          let c_active_tab = top.document.querySelector("#prev_tab li.active");
          if (c_tabs && c_active_tab) {
            let c_active_tab_id = c_active_tab.getAttribute("id").replace(/dct/, "");
            if (c_active_tab_id != c_tabs.length) {
              setTimeout(() => {
                $("#ne-21log", window.parent.document).html("");
                if (top.document.querySelector("#mainid > .prev_next.next") == void 0) {
                  top.document.querySelector("#prevNextFocusNext").click();
                  return;
                }
                top.document.querySelector("#mainid > .prev_next.next").click();
              }, 5e3);
              return;
            }
          }
        }
        let t = _t[_curIndex + 1];
        if (t["status"].indexOf("待完成") != -1) {
          setTimeout(() => {
            $("#ne-21log", window.parent.document).html("");
            if (top.document.querySelector("#mainid > .prev_next.next") == void 0) {
              top.document.querySelector("#prevNextFocusNext").click();
              return;
            }
            top.document.querySelector("#mainid > .prev_next.next").click();
            showBox();
          }, 5e3);
          return;
        } else if (t["status"].indexOf("闯关") != -1) {
          logger("当前为闯关模式，存在未完成任务点，脚本已暂停运行，请手动完成并点击下一章节", "red");
          return;
        } else if (t["status"].indexOf("开放") != -1) {
          logger("章节未开放", "red");
          return;
        } else {
          // console.log();
        };
      }
      logger("此课程处理完毕", "green");
      return;
    });
  }
  function missonStart() {
    if (_mlist.length <= 0) {
      logger("此页面任务处理完毕，准备跳转页面", "green");
      return toNext();
    }
    let _type = _mlist[0]["type"], _dom = _domList[0], _task = _mlist[0];
    if (_type == void 0) {
      _type = _mlist[0]["property"]["module"];
    }
    switch (_type) {
      case "video":
        if (_mlist[0]["property"]["module"] == "insertvideo") {
          logger("开始处理视频", "purple");
          missonVideo(_dom, _task);
          break;
        } else if (_mlist[0]["property"]["module"] == "insertaudio") {
          logger("开始处理音频", "purple");
          missonAudio(_dom, _task);
          break;
        } else {
          logger("未知类型任务，请联系作者，跳过", "red");
          switchMission();
          break;
        }
      case "workid":
        logger("开始处理测验", "purple");
        missonWork(_dom, _task);
        break;
      case "document":
        logger("开始处理文档", "purple");
        missonDoucument(_dom, _task);
        break;
      case "read":
        logger("开始处理阅读", "purple");
        missonRead(_dom, _task);
        break;
      case "insertbook":
        logger("开始处理读书", "purple");
        missonBook(_dom, _task);
        break;
      default:
        let GarbageTasks = ["insertimage"];
        if (GarbageTasks.indexOf(_type) != -1) {
          logger("发现无需处理任务，跳过。", "red");
          switchMission();
        } else {
          logger("暂不支持处理此类型:" + _type + "，跳过。", "red");
          switchMission();
        }
    }
  }
  function missonAudio(dom, obj) {
    if (!setting.audio) {
      logger("用户设置不处理音频任务，准备开始下一个任务。", "red");
      setTimeout(() => {
        switchMission();
      }, 3e3);
      return;
    }
    let isDo;
    if (setting.task) {
      logger("当前只处理任务点任务", "red");
      if (obj["jobid"] == void 0 ? false : true) {
        isDo = true;
      } else {
        isDo = false;
      }
    } else {
      logger("当前默认处理所有任务（包括非任务点任务）", "red");
      isDo = true;
    }
    if (isDo) {
      let classId = _defaults["clazzId"], userId = _defaults["userid"], fid = _defaults["fid"], reportUrl = _defaults["reportUrl"], isPassed = obj["isPassed"], otherInfo = obj["otherInfo"], jobId = obj["property"]["_jobid"], name = obj["property"]["name"], objectId = obj["property"]["objectid"];
      if (!setting.review && isPassed == true) {
        logger("音频：" + name + "检测已完成，准备处理下一个任务", "green");
        switchMission();
        return;
      } else if (setting.review) {
        logger("已开启复习模式，开始处理音频：" + name, "pink");
      }
      $.ajax({
        url: _l.protocol + "//" + _l.host + "/ananas/status/" + objectId + "?k=" + fid + "&flag=normal&_dc=" + String(Math.round(/* @__PURE__ */ new Date())),
        type: "GET",
        success: function (res) {
          try {
            let duration = res["duration"], dtoken = res["dtoken"], clipTime = "0_" + duration, playingTime = 0, isdrag = "3", _rt = "0.9";
            if (setting.rate == 0) {
              logger("已开启音频秒过，99.9%会导致进度重置、挂科等问题。", "red");
              logger("已开启音频秒过，请等待5秒！！！", "red");
            } else if (setting.rate > 1 && setting.rate <= 16) {
              logger("已开启音频倍速，当前倍速：" + setting.rate + ",99.9%会导致进度重置、挂科等问题。", "red");
              logger("已开启音频倍速，进度40秒更新一次，请等待！", "red");
            } else if (setting.rate > 16) {
              setting.rate = 1;
              logger("超过允许设置的最大倍数，已重置为1倍速。", "red");
            } else {
              logger("音频进度每隔40秒更新一次，请等待耐心等待...", "blue");
            }
            logger("音频：" + name + "开始播放");
            updateAudio(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt).then((status) => {
              switch (status) {
                case 1:
                  logger("音频：" + name + "已播放" + String(playingTime / duration * 100).slice(0, 4) + "%", "purple");
                  isdrag = "0";
                  break;
                case 3:
                  _rt = _rt === "1" ? "0.9" : "1";
                  break;
                default:
                  console.log(status);
              }
            });
            let _loop = setInterval(() => {
              playingTime += 40 * setting.rate;
              if (playingTime >= duration || setting.rate == 0) {
                clearInterval(_loop);
                playingTime = duration;
                isdrag = "4";
              } else if (_rt === "1" && playingTime == 40 * setting.rate) {
                isdrag = "3";
              } else {
                isdrag = "0";
              }
              updateAudio(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt).then((status) => {
                switch (status) {
                  case 0:
                    playingTime -= 40;
                    break;
                  case 1:
                    logger("音频：" + name + "已播放" + String(playingTime / duration * 100).slice(0, 4) + "%", "purple");
                    break;
                  case 2:
                    clearInterval(_loop);
                    logger("音频：" + name + "检测播放完毕，准备处理下一个任务。", "green");
                    switchMission();
                    break;
                  case 3:
                    playingTime -= 40;
                    _rt = _rt === "1" ? "0.9" : "1";
                    break;
                  default:
                    console.log(status);
                }
              });
            }, setting.rate == 0 ? 5e3 : 4e4);
          } catch (e) {
            logger("发生错误：" + e, "red");
          }
        }
      });
    } else {
      logger("用户设置只处理属于任务点的任务，准备处理下一个任务", "green");
      switchMission();
      return;
    }
  }
  function missonVideo(dom, obj) {
    if (!setting.video) {
      logger("用户设置不处理视频任务，准备开始下一个任务。", "red");
      setTimeout(() => {
        switchMission();
      }, 3e3);
      return;
    }
    let ifs = $(dom).attr("style");
    $(dom).contents().find("body").find(".main").attr("style", "visibility:hidden;");
    $(dom).contents().find("body").prepend(`
          <div id="ne21_mask" style="` + ifs + `display: flex;flex-wrap: wrap;justify-content: center;align-content: center;flex-direction: column;">
              <h1>🌸 SuperStar 提醒您：</h1>
              <br />
              <h3>视频正在后台播放，具体进度参看右侧浮窗。</h3>
              <br />
              <button id="ne21_button">显示原视频</button>
          </div>
      `);
    $(dom).contents().find("body").find("#ne21_button").click(() => {
      $(dom).contents().find("body").find("#ne21_mask").attr("style", "display:none;");
      $(dom).contents().find("body").find(".main").attr("style", "visibility:none;");
    });
    let isDo;
    if (setting.task) {
      logger("当前只处理任务点任务", "red");
      if (obj["jobid"] == void 0 ? false : true) {
        isDo = true;
      } else {
        isDo = false;
      }
    } else {
      logger("当前默认处理所有任务（包括非任务点任务）", "red");
      isDo = true;
    }
    if (isDo) {
      let classId = _defaults["clazzId"], userId = _defaults["userid"], fid = _defaults["fid"], reportUrl = _defaults["reportUrl"], isPassed = obj["isPassed"], otherInfo = obj["otherInfo"], jobId = obj["property"]["_jobid"], name = obj["property"]["name"], objectId = obj["property"]["objectid"];
      if (!setting.review && isPassed == true) {
        logger("视频：" + name + "检测已完成，准备处理下一个任务", "green");
        switchMission();
        return;
      } else if (setting.review) {
        logger("已开启复习模式，开始处理视频：" + name, "pink");
      }
      $.ajax({
        url: _l.protocol + "//" + _l.host + "/ananas/status/" + objectId + "?k=" + fid + "&flag=normal&_dc=" + String(Math.round(/* @__PURE__ */ new Date())),
        type: "GET",
        success: function (res) {
          try {
            let duration = res["duration"], dtoken = res["dtoken"], clipTime = "0_" + duration, playingTime = 0, isdrag = "3", _rt = "0.9";
            if (setting.rate == 0) {
              logger("已开启视频秒过，99.9%会导致进度重置、挂科等问题。", "red");
              logger("已开启视频秒过，请等待5秒！！！", "red");
            } else if (setting.rate > 1 && setting.rate <= 16) {
              logger("已开启视频倍速，当前倍速：" + setting.rate + ",99.9%会导致进度重置、挂科等问题。", "red");
              logger("已开启视频倍速，进度40秒更新一次，请等待！", "red");
            } else if (setting.rate > 16) {
              setting.rate = 1;
              logger("超过允许设置的最大倍数，已重置为1倍速。", "red");
            } else {
              logger("视频进度每隔40秒更新一次，请等待耐心等待...", "blue");
            }
            logger("视频：" + name + "开始播放");
            updateVideo(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt).then((status) => {
              switch (status) {
                case 1:
                  logger("视频：" + name + "已播放" + String(playingTime / duration * 100).slice(0, 4) + "%", "purple");
                  isdrag = "0";
                  break;
                case 3:
                  _rt = _rt === "1" ? "0.9" : "1";
                  break;
                default:
                  console.log(status);
              }
            });
            let _loop = setInterval(() => {
              playingTime += 40 * setting.rate;
              if (playingTime >= duration || setting.rate == 0) {
                clearInterval(_loop);
                playingTime = duration;
                isdrag = "4";
              } else if (_rt === "1" && playingTime == 40 * setting.rate) {
                isdrag = "3";
              } else {
                isdrag = "0";
              }
              updateVideo(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt).then((status) => {
                switch (status) {
                  case 0:
                    playingTime -= 40;
                    break;
                  case 1:
                    logger("视频：" + name + "已播放" + String(playingTime / duration * 100).slice(0, 4) + "%", "purple");
                    break;
                  case 2:
                    clearInterval(_loop);
                    logger("视频：" + name + "检测播放完毕，准备处理下一个任务。", "green");
                    switchMission();
                    break;
                  case 3:
                    playingTime -= 40;
                    _rt = _rt === "1" ? "0.9" : "1";
                    break;
                  default:
                    console.log(status);
                }
              });
            }, setting.rate == 0 ? 5e3 : 4e4);
          } catch (e) {
            logger("发生错误：" + e, "red");
          }
        }
      });
    } else {
      logger("用户设置只处理属于任务点的任务，准备处理下一个任务", "green");
      switchMission();
      return;
    }
  }
  function missonBook(dom, obj) {
    if (setting.task) {
      if (obj["jobid"] == void 0) {
        logger("当前只处理任务点任务,跳过", "red");
        switchMission();
        return;
      }
    }
    let jobId = obj["property"]["jobid"], name = obj["property"]["bookname"], jtoken = obj["jtoken"], knowledgeId = _defaults["knowledgeid"], courseId = _defaults["courseid"], clazzId = _defaults["clazzId"];
    if (obj["job"] == void 0) {
      logger("读书：" + name + "检测已完成，准备执行下一个任务。", "green");
      switchMission();
      return;
    }
    $.ajax({
      url: _l.protocol + "//" + _l.host + "/ananas/job?jobid=" + jobId + "&knowledgeid=" + knowledgeId + "&courseid=" + courseId + "&clazzid=" + clazzId + "&jtoken=" + jtoken + "&_dc=" + String(Math.round(/* @__PURE__ */ new Date())),
      method: "GET",
      success: function (res) {
        if (res.status) {
          logger("读书：" + name + res.msg + ",准备执行下一个任务。", "green");
        } else {
          logger("读书：" + name + "处理异常,跳过。", "red");
        }
        switchMission();
        return;
      }
    });
  }
  function missonDoucument(dom, obj) {
    if (setting.task) {
      if (obj["jobid"] == void 0) {
        logger("当前只处理任务点任务,跳过", "red");
        switchMission();
        return;
      }
    }
    let jobId = obj["property"]["jobid"], name = obj["property"]["name"], jtoken = obj["jtoken"], knowledgeId = _defaults["knowledgeid"], courseId = _defaults["courseid"], clazzId = _defaults["clazzId"];
    if (obj["job"] == void 0) {
      logger("文档：" + name + "检测已完成，准备执行下一个任务。", "green");
      switchMission();
      return;
    }
    $.ajax({
      url: _l.protocol + "//" + _l.host + "/ananas/job/document?jobid=" + jobId + "&knowledgeid=" + knowledgeId + "&courseid=" + courseId + "&clazzid=" + clazzId + "&jtoken=" + jtoken + "&_dc=" + String(Math.round(/* @__PURE__ */ new Date())),
      method: "GET",
      success: function (res) {
        if (res.status) {
          logger("文档：" + name + res.msg + ",准备执行下一个任务。", "green");
        } else {
          logger("文档：" + name + "处理异常,跳过。", "red");
        }
        switchMission();
        return;
      }
    });
  }
  function missonRead(dom, obj) {
    if (setting.task) {
      if (obj["jobid"] == void 0) {
        logger("当前只处理任务点任务,跳过", "red");
        switchMission();
        return;
      }
    }
    let jobId = obj["property"]["jobid"], name = obj["property"]["title"], jtoken = obj["jtoken"], knowledgeId = _defaults["knowledgeid"], courseId = _defaults["courseid"], clazzId = _defaults["clazzId"];
    if (obj["job"] == void 0) {
      logger("阅读：" + name + ",检测已完成，准备执行下一个任务。", "green");
      switchMission();
      return;
    }
    $.ajax({
      url: _l.protocol + "//" + _l.host + "/ananas/job/readv2?jobid=" + jobId + "&knowledgeid=" + knowledgeId + "&courseid=" + courseId + "&clazzid=" + clazzId + "&jtoken=" + jtoken + "&_dc=" + String(Math.round(/* @__PURE__ */ new Date())),
      method: "GET",
      success: function (res) {
        if (res.status) {
          logger("阅读：" + name + res.msg + ",准备执行下一个任务。", "green");
        } else {
          logger("阅读：" + name + "处理异常,跳过。", "red");
        }
        switchMission();
        return;
      }
    });
  }
  function missonWork(dom, obj) {
    if (!setting.work) {
      logger("用户设置不自动处理测验，准备处理下一个任务", "green");
      switchMission();
      return;
    }
    let isDo;
    if (setting.task) {
      logger("当前只处理任务点任务", "red");
      if (obj["jobid"] == void 0 ? false : true) {
        isDo = true;
      } else {
        isDo = false;
      }
    } else {
      logger("当前默认处理所有任务（包括非任务点任务）", "red");
      isDo = true;
    }
    if (isDo) {
      if (obj["jobid"] !== void 0) {
        let phoneWeb = _l.protocol + "//" + _l.host + "/work/phone/work?workId=" + obj["jobid"].replace("work-", "") + "&courseId=" + _defaults["courseid"] + "&clazzId=" + _defaults["clazzId"] + "&knowledgeId=" + _defaults["knowledgeid"] + "&jobId=" + obj["jobid"] + "&enc=" + obj["enc"];
        setTimeout(() => {
          startDoPhoneCyWork(0, dom, phoneWeb);
        }, 3e3);
      } else {
        setTimeout(() => {
          startDoCyWork(0, dom);
        }, 3e3);
      }
    } else {
      logger("用户设置只处理属于任务点的任务，准备处理下一个任务", "green");
      switchMission();
      return;
    }
  }
  function doPhoneWork($dom) {
    let $cy = $dom.find(".Wrappadding form");
    $subBtn = $cy.find(".zquestions .zsubmit .btn-ok-bottom");
    $saveBtn = $cy.find(".zquestions .zsubmit .btn-save");
    let TimuList = $cy.find(".zquestions .Py-mian1");
    startDoPhoneTimu(0, TimuList);
  }
  function startDoPhoneTimu(index, TimuList) {
    if (index == TimuList.length) {
      if (setting.sub) {
        logger("测验处理完成，准备自动提交。", "green");
        setTimeout(() => {
          $subBtn.click();
          setTimeout(() => {
            logger("提交成功，准备切换下一个任务。", "green");
            _mlist.splice(0, 1);
            _domList.splice(0, 1);
            setTimeout(() => {
              switchMission();
            }, 3e3);
          }, 3e3);
        }, 5e3);
      } else if (setting.force) {
        logger("测验处理完成，存在无答案题目,由于用户设置了强制提交，准备自动提交。", "red");
        setTimeout(() => {
          $subBtn.click();
          setTimeout(() => {
            logger("提交成功，准备切换下一个任务。", "green");
            _mlist.splice(0, 1);
            _domList.splice(0, 1);
            setTimeout(() => {
              switchMission();
            }, 3e3);
          }, 3e3);
        }, 5e3);
      } else {
        logger("测验处理完成，存在无答案题目或用户设置不自动提交，自动保存！", "green");
        setTimeout(() => {
          $saveBtn.click();
          setTimeout(() => {
            logger("保存成功，准备切换下一个任务。", "green");
            _mlist.splice(0, 1);
            _domList.splice(0, 1);
            setTimeout(() => {
              switchMission();
            }, 3e3);
          }, 3e3);
        }, 5e3);
      }
      return;
    }
    let questionFull = $(TimuList[index]).find(".Py-m1-title").html();
    let _question = tidyQuestion(questionFull).replace(/.*?\[.*?题\]\s*\n\s*/, "").trim();
    let _type = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4, 选择题: 5 }[questionFull.match(/.*?\[(.*?)]|$/)[1]];
    let _a = [];
    let _answerTmpArr, _options;
    switch (_type) {
      case 0:
        // singleChoice
        _answerTmpArr = $(TimuList[index]).find(".answerList.singleChoice li");
        $.each(_answerTmpArr, (i, t) => {
          _a.push(tidyStr($(t).html()).replace(/^[A-Z]\s*\n\s*/, "").trim());
        });
        _options = _a.join("|");
        getAnswer(_type, _question, _options).then((agrs) => {
          let _i = _a.findIndex((item) => item == agrs);
          if (_i == -1) {
            logger("未匹配到正确答案，跳过此题", "red");
            setting.sub = 0;
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
          } else {
            $(_answerTmpArr[_i]).click();
            logger("自动答题成功，准备切换下一题", "green");
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
          }
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
          }
        });
        break;
      case 1:
        // multiChoice
        _answerTmpArr = $(TimuList[index]).find('.answerList.multiChoice li')
        _answerTmpArr.each(function () {
          let answerText = tidyStr($(this).html()).replace(/^[A-Z]\s*\n\s*/, "").trim();
          _a.push(answerText);
        });
        _options = _a.join("|");
        getAnswer(_type, _question, _options).then((agrs) => {
          if (agrs == "暂无答案") {
            logger("未匹配到正确答案，跳过此题", "red");
            setting.sub = 0;
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
          } else {
            $.each(_answerTmpArr, (i, t) => {
              let _tt = tidyStr($(t).html()).replace(/^[A-Z]\s*\n\s*/, "").trim();
              if (agrs.indexOf(_tt) != -1) {
                setTimeout(() => {
                  $(_answerTmpArr[i]).click();
                }, 300);
              }
            });
            let check = 0;
            setTimeout(() => {
              $.each(_answerTmpArr, (i, t) => {
                if ($(t).attr("class").indexOf("cur") != -1) {
                  check = 1;
                }
              });
              if (check) {
                logger("自动答题成功，准备切换下一题", "green");
              } else {
                logger("未能正确选择答案，请手动选择，跳过此题", "red");
                setting.sub = 0;
              }
              setTimeout(() => {
                startDoPhoneTimu(index + 1, TimuList);
              }, setting.time);
            }, 1e3);
          }
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
          }
        });
        break;
      case 2:
        // fillBlank 
        _options = "";
        getAnswer(_type, _question, _options).then((agrs) => {
          if (agrs == "暂无答案") {
            logger("未匹配到正确答案，跳过此题", "red");
            setting.sub = 0;
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
            return;
          }
          let answers = agrs.split("#");
          let tkList = $(TimuList[index]).find(".blankList2 input");
          $.each(tkList, (i, t) => {
            setTimeout(() => {
              $(t).val(answers[i]);
            }, 200);
          });
          setTimeout(() => {
            startDoPhoneTimu(index + 1, TimuList);
          }, setting.time);
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
          }
        });
        break;
      case 3:
        // judge
        _options = "对|错";
        getAnswer(_type, _question, _options).then((agrs) => {
          if (agrs == "暂无答案") {
            logger("未匹配到正确答案，跳过此题", "red");
            setting.sub = 0;
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
          } else {
            let _true = "正确|是|对|√|T|ri";
            _answerTmpArr = $(TimuList[index]).find(".answerList.panduan li");
            if (_true.indexOf(agrs) != -1) {
              $.each(_answerTmpArr, (i, t) => {
                if ($(t).attr("val-param") == "true") {
                  $(t).click();
                }
              });
            } else {
              $.each(_answerTmpArr, (i, t) => {
                if ($(t).attr("val-param") == "false") {
                  $(t).click();
                }
              });
            }
            logger("自动答题成功，准备切换下一题", "green");
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
          }
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
          }
        });
        break;
      case 4:
        // shortAnswer
        _options = "";
        getAnswer(_type, _question, _options).then((agrs) => {
          if (agrs == '暂无答案') {
            logger("未匹配到正确答案，跳过此题", "red")
            setting.sub = 0
            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
            return
          }
          logger("简答题不支持自动填入，请参考修改答案，手动完成。", "purple");
          setting.sub = 0
          setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
        }).catch((agrs) => {
          if (agrs['c'] == 0) {
            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
          }
        })
        break
  
      case 5:
        // choice 
        _answerTmpArr = $(TimuList[index]).find(".answerList.singleChoice li");
        $.each(_answerTmpArr, (i, t) => {
          _a.push(tidyStr($(t).html()).replace(/^[A-Z]\s*\n\s*/, "").trim());
        });
        _options = _a.join("|");
        getAnswer(_type, _question, _options).then((agrs) => {
          setting.sub = 0;
          logger("此类型题目无法区分单/多选，请手动选择答案", "red");
          setTimeout(() => {
            startDoPhoneTimu(index + 1, TimuList);
          }, setting.time);
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            setTimeout(() => {
              startDoPhoneTimu(index + 1, TimuList);
            }, setting.time);
          }
        });
        break;
      default:
        logger("暂不支持处理此类型题目：" + questionFull.match(/.*?\[(.*?)]|$/)[1] + ",跳过！请手动作答。", "red");
        setting.sub = 0;
        setTimeout(() => {
          startDoPhoneTimu(index + 1, TimuList);
        }, setting.time);
        break;
    }
  }
  function startDoPhoneCyWork(index, doms, phoneWeb) {
    if (index == doms.length) {
      logger("此页面全部测验已处理完毕！准备进行下一项任务");
      setTimeout(missonStart, 5e3);
      return;
    }
    logger("等待测验框架加载...", "purple");
    elmGetter.get("iframe", $(doms[index]).contents()[0]).then((element) => {
      let workIframe = element;
      if (workIframe.length == 0) {
        setTimeout(() => {
          startDoPhoneCyWork(index, doms);
        }, 5e3);
      }
      let workStatus = $(workIframe).contents().find(".newTestCon .newTestTitle .testTit_status").text().trim();
      if (!workStatus) {
        logger("获取测验状态失败，请联系作者修复！", "red");
        _domList.splice(0, 1);
        setTimeout(missonStart, 2e3);
        return;
      }
      if (setting.share && workStatus.indexOf("已完成") != -1) {
        logger("测验：" + (index + 1) + ",检测到此测验已完成,准备收录答案。", "green");
        setTimeout(() => {
          upLoadWork(index, doms, workIframe);
        }, 2e3);
      } else if (workStatus.indexOf("待做") != -1 || workStatus.indexOf("待完成") != -1) {
        logger("测验：" + (index + 1) + ",准备处理此测验...", "purple");
        $(workIframe).attr("src", phoneWeb);
        elmGetter.get('iframe[src="' + phoneWeb + '"]', $(doms[index]).contents()[0]).then((element2) => {
          setTimeout(() => {
            doPhoneWork($(element2).contents());
          }, 3e3);
        });
      } else if (workStatus.indexOf("待批阅") != -1) {
        _mlist.splice(0, 1);
        _domList.splice(0, 1);
        logger("测验：" + (index + 1) + ",测验待批阅,跳过", "red");
        setTimeout(() => {
          startDoPhoneCyWork(index + 1, doms, phoneWeb);
        }, 5e3);
      } else {
        _mlist.splice(0, 1);
        _domList.splice(0, 1);
        logger("测验：" + (index + 1) + ",未知状态或用户选择不收录答案,跳过", "red");
        setTimeout(() => {
          startDoPhoneCyWork(index + 1, doms, phoneWeb);
        }, 5e3);
      }
    });
  }
  function startDoCyWork(index, doms) {
    if (index == doms.length) {
      logger("此页面全部测验已处理完毕！准备进行下一项任务");
      setTimeout(missonStart, 5e3);
      return;
    }
    logger("等待测验框架加载...", "purple");
    elmGetter.get("iframe", $(doms[index]).contents()[0]).then((element) => {
      let workIframe = element;
      if (workIframe.length == 0) {
        setTimeout(() => {
          startDoCyWork(index, doms);
        }, 5e3);
      }
      let workStatus = $(workIframe).contents().find(".newTestCon .newTestTitle .testTit_status").text().trim();
      if (!workStatus) {
        logger("获取测验状态失败，请联系作者修复！", "red");
        _domList.splice(0, 1);
        setTimeout(missonStart, 2e3);
        return;
      }
      if (setting.share && workStatus.indexOf("已完成") != -1) {
        logger("测验：" + (index + 1) + ",检测到此测验已完成,准备收录答案。", "green");
        setTimeout(() => {
          upLoadWork(index, doms, workIframe);
        }, 2e3);
      } else if (workStatus.indexOf("待做") != -1 || workStatus.indexOf("待完成") != -1) {
        logger("测验：" + (index + 1) + ",准备处理此测验...", "purple");
        setTimeout(() => {
          doWork(index, doms, workIframe);
        }, 5e3);
      } else if (workStatus.indexOf("待批阅") != -1) {
        _mlist.splice(0, 1);
        _domList.splice(0, 1);
        logger("测验：" + (index + 1) + ",测验待批阅,跳过", "red");
        setTimeout(() => {
          startDoCyWork(index + 1, doms);
        }, 5e3);
      } else {
        _mlist.splice(0, 1);
        _domList.splice(0, 1);
        logger("测验：" + (index + 1) + ",未知状态或用户选择不收录答案,跳过", "red");
        setTimeout(() => {
          startDoCyWork(index + 1, doms);
        }, 5e3);
      }
    });
  }
  function missonHomeWork() {
    logger("开始处理作业", "green");
    let $_homeworktable = $(".mark_table").find("form");
    let TimuList = $_homeworktable.find(".questionLi");
    doHomeWork(0, TimuList);
  }
  function doHomeWork(index, TiMuList) {
    if (index == TiMuList.length) {
      logger("作业题目已全部完成", "green");
      return;
    }
    let _type = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[$(TiMuList[index]).attr("typename")];
    let _questionFull = $(TiMuList[index]).find(".mark_name").html();
    let _question = tidyQuestion(_questionFull).replace(/^[(].*?[)]/, "").trim();
    let _a = [];
    let _answerTmpArr, _textareaList, _options;
    switch (_type) {
      case 0:
        // singleChoice
        _answerTmpArr = $(TiMuList[index]).find(".stem_answer").find(".answer_p");
        _answerTmpArr.each(function () {
          let answerText = tidyStr($(this).text()).replace(/[ABCD]/g, '').trim();
          _a.push(answerText);
        });
        _options = _a.join("|");
        getAnswer(_type, _question, _options).then((agrs) => {
          $.each(_answerTmpArr, (i, t) => {
            _a.push(tidyStr($(t).html()));
          });
          let _i2 = _a.findIndex((item) => item == agrs);
          if (_i2 == -1) {
            logger("未匹配到正确答案，跳过此题", "red");
            setTimeout(() => {
              doHomeWork(index + 1, TiMuList);
            }, setting.time);
          } else {
            setTimeout(() => {
              let check = $(_answerTmpArr[_i2]).parent().find("span").attr("class");
              if (check.indexOf("check_answer") == -1) {
                $(_answerTmpArr[_i2]).parent().click();
              }
              logger("自动答题成功，准备切换下一题", "green");
              setTimeout(() => {
                doHomeWork(index + 1, TiMuList);
              }, setting.time);
            }, 300);
          }
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            setTimeout(() => {
              doHomeWork(index + 1, TiMuList);
            }, setting.time);
          }
        });
        break;
      case 1:
        // multiChoice
        _answerTmpArr = $(TiMuList[index]).find(".stem_answer").find(".answer_p");
        _answerTmpArr.each(function () {
          let answerText = tidyStr($(this).text()).replace(/[ABCD]/g, '').trim();
          _a.push(answerText);
        });
        _options = _a.join("|");
        getAnswer(_type, _question, _options).then((agrs) => {
          $.each(_answerTmpArr, (i, t) => {
            if (agrs.indexOf(tidyStr($(t).html())) != -1) {
              setTimeout(() => {
                let check = $(_answerTmpArr[i]).parent().find("span").attr("class");
                if (check.indexOf("check_answer_dx") == -1) {
                  $(_answerTmpArr[i]).parent().click();
                }
              }, 300);
            }
          });
          logger("自动答题成功，准备切换下一题", "green");
          setTimeout(() => {
            doHomeWork(index + 1, TiMuList);
          }, setting.time);
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            setTimeout(() => {
              doHomeWork(index + 1, TiMuList);
            }, setting.time);
          }
        });
        break;
      case 2:
        // fillBlank
        _options = "";
        _textareaList = $(TiMuList[index]).find(".stem_answer").find(".Answer .divText .textDIV textarea");
        getAnswer(_type, _question, _options).then((agrs) => {
          let _answerTmpArr2 = agrs.split("#");
          $.each(_textareaList, (i, t) => {
            let _id = $(t).attr("id");
            setTimeout(() => {
              UE.getEditor(_id).setContent(_answerTmpArr2[i]);
            }, 300);
          });
          logger("自动答题成功，准备切换下一题", "green");
          setTimeout(() => {
            doHomeWork(index + 1, TiMuList);
          }, setting.time);
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            setTimeout(() => {
              doHomeWork(index + 1, TiMuList);
            }, setting.time);
          }
        });
        break;
      case 3:
        // judge
        _options = "对|错";
        let _true = "正确|是|对|√|T|ri";
        let _false = "错误|否|错|×|F|wr";
        let _i = 0;
        _answerTmpArr = $(TiMuList[index]).find(".stem_answer").find(".answer_p");
        $.each(_answerTmpArr, (i, t) => {
          _a.push($(t).text().trim());
        });
        getAnswer(_type, _question, _options).then((agrs) => {
          if (_true.indexOf(agrs) != -1) {
            _i = _a.findIndex((item) => _true.indexOf(item) != -1);
          } else if (_false.indexOf(agrs) != -1) {
            _i = _a.findIndex((item) => _false.indexOf(item) != -1);
          } else {
            logger("答案匹配出错，准备切换下一题", "green");
            setTimeout(() => {
              doHomeWork(index + 1, TiMuList);
            }, setting.time);
            return;
          }
          setTimeout(() => {
            let check = $(_answerTmpArr[_i]).parent().find("span").attr("class");
            if (check.indexOf("check_answer") == -1) {
              $(_answerTmpArr[_i]).parent().click();
            }
          }, 300);
          logger("自动答题成功，准备切换下一题", "green");
          setTimeout(() => {
            doHomeWork(index + 1, TiMuList);
          }, setting.time);
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            setTimeout(() => {
              doHomeWork(index + 1, TiMuList);
            }, setting.time);
          }
        });
        break;
      case 4:
        // shortAnswer
        _options = "";
        _textareaList = $(TiMuList[index]).find(".stem_answer").find(".eidtDiv textarea");
        getAnswer(_type, _question, _options).then((agrs) => {
          $.each(_textareaList, (i, t) => {
            let _id = $(t).attr("id");
            setTimeout(() => {
              UE.getEditor(_id).setContent(agrs);
            }, 300);
          });
          logger("自动答题成功，准备切换下一题", "green");
          setTimeout(() => {
            doHomeWork(index + 1, TiMuList);
          }, setting.time);
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            setTimeout(() => {
              doHomeWork(index + 1, TiMuList);
            }, setting.time);
          }
        });
        break;
      default:
        logger("暂不支持处理此题型：" + $(TiMuList[index]).attr("typename") + ",跳过。", "red");
        setTimeout(() => {
          doHomeWork(index + 1, TiMuList);
        }, setting.time);
    }
  }
  function missonExam() {
    let $_examtable = $(".mark_table").find(".whiteDiv");
    let _questionFull = tidyStr($_examtable.find("h3.mark_name").html().trim());
    let _qType = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4, 论述题: 4, 写作题: 5, 翻译题: 6 }[_questionFull.match(/[(](.*?),.*?分[)]|$/)[1]];
    let _question = tidyQuestion(_questionFull.replace(/[(].*?分[)]/, "").replace(/^\s*/, ""));
    let $_ansdom = $_examtable.find("#submitTest").find(".stem_answer");
    let _answerTmpArr, _options;
    let _a = [];
    switch (_qType) {
      case 0:
        _answerTmpArr = $_ansdom.find(".clearfix.answerBg .fl.answer_p");
        $.each(_answerTmpArr, (i, t) => {
          _a.push(tidyStr($(t).html()));
        });
        _options = _a.join("|");
        getAnswer(_qType, _question, _options).then((agrs) => {
  
          let _i2 = _a.findIndex((item) => item == agrs);
          if (_i2 == -1) {
            logger("未匹配到正确答案，跳过此题", "red");
            setTimeout(toNextExam, 5e3);
          } else {
            setTimeout(() => {
              if ($(_answerTmpArr[_i2]).parent().find("span").attr("class").indexOf("check_answer") == -1) {
                $(_answerTmpArr[_i2]).parent().click();
                logger("自动答题成功，准备切换下一题", "green");
                toNextExam();
              } else {
                logger("此题已作答，准备切换下一题", "green");
                toNextExam();
              }
            }, 300);
          }
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            toNextExam();
          }
        });
        break;
      case 1:
        // multiChoice
        _answerTmpArr = $_ansdom.find(".clearfix.answerBg .fl.answer_p");
        $.each(_answerTmpArr, (i, t) => {
          _a.push(tidyStr($(t).html()))
        });
        _options = _a.join("|");
        getAnswer(_qType, _question, _options).then((agrs) => {
          if ($_ansdom.find(".clearfix.answerBg span.check_answer_dx").length > 0) {
            logger("此题已作答，准备切换下一题", "green");
            toNextExam();
          } else {
            $.each(_answerTmpArr, (i, t) => {
              if (agrs.indexOf(tidyStr($(t).html())) != -1) {
                setTimeout(() => {
                  $(_answerTmpArr[i]).parent().click();
                }, 300);
              }
            });
            logger("自动答题成功，准备切换下一题", "green");
            toNextExam();
          }
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            toNextExam();
          }
        });
        break;
      case 2:
        // fillBlank
        _options = "";
        let _textareaList = $_ansdom.find(".Answer .divText .subEditor textarea");
        getAnswer(_qType, _question, _options).then((agrs) => {
          let _answerTmpArr2 = agrs.split("#");
          $.each(_textareaList, (i, t) => {
            let _id = $(t).attr("id");
            setTimeout(() => {
              UE.getEditor(_id).setContent(_answerTmpArr2[i]);
            }, 300);
          });
          logger("自动答题成功，准备切换下一题", "green");
          toNextExam();
        }).catch((agrs) => {
          if (agrs["c"] = 0) {
            toNextExam();
          }
        });
        break;
      case 3:
        _options = "对|错";
        let _true = "正确|是|对|√|T|ri";
        let _false = "错误|否|错|×|F|wr";
        let _i = 0;
        _answerTmpArr = $_ansdom.find(".clearfix.answerBg .fl.answer_p");
        $.each(_answerTmpArr, (i, t) => {
          _a.push($(t).text().trim());
        });
        getAnswer(_qType, _question, _options).then((agrs) => {
          if (_true.indexOf(agrs) != -1) {
            _i = _a.findIndex((item) => _true.indexOf(item) != -1);
          } else if (_false.indexOf(agrs) != -1) {
            _i = _a.findIndex((item) => _false.indexOf(item) != -1);
          } else {
            logger("答案匹配出错，准备切换下一题", "green");
            toNextExam();
            return;
          }
          if ($(_answerTmpArr[_i]).parent().find("span").attr("class").indexOf("check_answer") == -1) {
            setTimeout(() => {
              $(_answerTmpArr[_i]).parent().click();
            }, 300);
            logger("自动答题成功，准备切换下一题", "green");
            toNextExam();
          } else {
            logger("此题已作答，准备切换下一题", "green");
            toNextExam();
          }
        }).catch((agrs) => {
          if (agrs["c"] == 0) {
            toNextExam();
          }
        });
        break;
      case 4:
        // shortAnswer
        _options = "";
        _answerEle = $_ansdom.find('.subEditor textarea')
        $.each(_answerEle, (i, t) => {
          getAnswer(_qType, _question, _options).then((agrs) => {
            let _id = $(t).attr('name')
            setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
            toNextExam()
          });
        });
        break;
      case 5:
        // write
        _answerEle = $_ansdom.find('.subEditor textarea')
        _options = "";
        $.each(_answerEle, (i, t) => {
          getAnswer(_qType, _question, _options).then((agrs) => {
            let _id = $(t).attr('name')
            setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
            toNextExam()
          });
        });
        break;
      case 6:
        // translate
        _answerEle = $_ansdom.find('.subEditor textarea')
        _options
        $.each(_answerEle, (i, t) => {
          getAnswer(_qType, _question, _options).then((agrs) => {
            let _id = $(t).attr('name')
            setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
            toNextExam()
          });
        });
        break;
      default:
        logger('暂不支持处理此题型：' + $(TiMuList[index]).attr('typename') + ',跳过。', 'red')
        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
    }
  }
  function toNextExam() {
    if (setting.examTurn) {
      let $_examtable = $(".mark_table").find(".whiteDiv");
      let $nextbtn = $_examtable.find(".nextDiv a.jb_btn");
      setTimeout(() => {
        $nextbtn.click();
      }, setting.examTurnTime ? 2e3 + Math.floor(Math.random() * 5 + 1) * 1e3 : 2e3);
    } else {
      logger("用户设置不自动跳转下一题，请手动点击", "blue");
    }
  }
  function uploadExam() {
    logger("考试答案收录功能处于bate阶段，遇到bug请及时反馈!!", "red");
    logger("开始收录考试答案", "green");
    let TimuList = $(".mark_table .mark_item .questionLi");
    let data = [];
    $.each(TimuList, (i, t) => {
      let _a = {};
      let _answer;
      let _answerTmpArr, _answerList = [];
      let TiMuFull = tidyQuestion($(t).find("h3").html());
      let _type = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[TiMuFull.match(/[(](.*?)[)]|$/)[1].replace(/,.*?分/, "")];
      let _question = TiMuFull.replace(/^[(].*?[)]|$/, "").trim();
      let _rightAns = $(t).find(".mark_answer").find(".colorGreen").text().replace(/正确答案[:：]/, "").trim();
      switch (_type) {
        case 0:
          if (_rightAns.length <= 0) {
            let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
            let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
            if (_isTrue2 == "marking_dui" || _isZero != "0") {
              _rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim();
            } else {
              break;
            }
          }
          _answerTmpArr = $(t).find(".mark_letter li");
          $.each(_answerTmpArr, (a, b) => {
            _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ""));
          });
          let _i = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[_rightAns];
          _answer = _answerList[_i];
          _a["question"] = _question;
          _a["type"] = _type;
          _a["answer"] = _answer;
          data.push(_a);
          break;
        case 1:
          _answer = [];
          if (_rightAns.length <= 0) {
            let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
            let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
            if (_isTrue2 == "marking_dui" || _isTrue2 == "marking_bandui" || _isZero != "0") {
              _rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim();
            } else {
              break;
            }
          }
          _answerTmpArr = $(t).find(".mark_letter li");
          $.each(_answerTmpArr, (a, b) => {
            _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ""));
          });
          $.each(_rightAns.split(""), (c, d) => {
            let _i2 = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[d];
            _answer.push(_answerList[_i2]);
          });
          _a["question"] = _question;
          _a["type"] = _type;
          _a["answer"] = _answer.join("#");
          data.push(_a);
          break;
        case 2:
          _answerTmpArr = [];
          let answers = $(t).find(".mark_answer").find(".colorDeep").find("dd");
          if (_rightAns.length <= 0) {
            $.each(answers, (i2, t2) => {
              _isTrue = $(t2).find("span:eq(1)").attr("class");
              if (_isTrue == "marking_dui") {
                _rightAns = $(t2).find("span:eq(0)").html();
                _answerTmpArr.push(_rightAns.replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim());
              } else {
                return;
              }
            });
            _answer = _answerTmpArr.join("#");
          } else {
            _answer = _rightAns.replace(/\s/g, "").replace(/[(][0-9].*?[)]/g, "#").replace(/第.*?空:/g, "#").replace(/^#*/, "");
          }
          if (_answer.length != 0) {
            _a["question"] = _question;
            _a["type"] = _type;
            _a["answer"] = _answer;
            data.push(_a);
          }
          break;
        case 3:
          if (_rightAns.length <= 0) {
            let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
            let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
            if (_isTrue2 == "marking_dui" || _isZero != "0") {
              _rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim();
            } else {
              let _true = "正确|是|对|√|T|ri";
              _rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim();
              if (_true.indexOf(_rightAns) != -1) {
                _rightAns = "错";
              } else {
                _rightAns = "对";
              }
            }
          }
          _a["question"] = _question;
          _a["type"] = _type;
          _a["answer"] = _rightAns;
          data.push(_a);
          break;
        case 4:
          if (_rightAns.length <= 0) {
            break;
          }
          _a["question"] = _question;
          _a["type"] = _type;
          _a["answer"] = _rightAns;
          data.push(_a);
          break;
      }
    });
    setTimeout(() => {
      uploadAnswer(data, 0);
    }, 1500);
  }
  function refreshCourseList() {
    let _p = parseUrlParams();
    return new Promise((resolve, reject) => {
      $.ajax({
        url: _l.protocol + "//" + _l.host + "/mycourse/studentstudycourselist?courseId=" + _p["courseid"] + "&chapterId=" + _p["knowledgeid"] + "&clazzid=" + _p["clazzid"] + "&mooc2=1",
        type: "GET",
        dateType: "html",
        success: function (res) {
          resolve(res);
        }
      });
    });
  }
  function updateAudio(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt) {
    return new Promise((resolve, reject) => {
      getEnc(classId, userId, jobId, objectId, playingTime, duration, clipTime).then((enc) => {
        if (reportUrlChange) {
          reportUrl = http2https(reportUrl);
        }
        $.ajax({
          url: reportUrl + "/" + dtoken + "?clazzId=" + classId + "&playingTime=" + playingTime + "&duration=" + duration + "&clipTime=" + clipTime + "&objectId=" + objectId + "&otherInfo=" + otherInfo + "&jobid=" + jobId + "&userid=" + userId + "&isdrag=" + isdrag + "&view=pc&enc=" + enc + "&rt=" + Number(_rt) + "&dtype=Audio&_t=" + String(Math.round(/* @__PURE__ */ new Date())),
          type: "GET",
          success: function (res) {
            try {
              if (res["isPassed"]) {
                if (setting.review && playingTime != duration) {
                  resolve(1);
                } else {
                  resolve(2);
                }
              } else {
                if (setting.rate == 0 && playingTime == duration) {
                  resolve(2);
                } else {
                  resolve(1);
                }
              }
            } catch (e) {
              logger("发生错误：" + e, "red");
              resolve(0);
            }
          },
          error: function (xhr) {
            if (xhr.status == 403) {
              logger("SuperStar返回错误信息，尝试更换参数，40s后将重试，请等待...", "red");
              resolve(3);
            } else {
              reportUrlChange = 1;
              logger("SuperStar返回错误信息，如果持续出现，请联系作者", "red");
            }
          }
        });
      });
    });
  }
  function updateVideo(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt) {
    return new Promise((resolve, reject) => {
      getEnc(classId, userId, jobId, objectId, playingTime, duration, clipTime).then((enc) => {
        if (reportUrlChange) {
          reportUrl = http2https(reportUrl);
        }
        $.ajax({
          url: reportUrl + "/" + dtoken + "?clazzId=" + classId + "&playingTime=" + playingTime + "&duration=" + duration + "&clipTime=" + clipTime + "&objectId=" + objectId + "&otherInfo=" + otherInfo + "&jobid=" + jobId + "&userid=" + userId + "&isdrag=" + isdrag + "&view=pc&enc=" + enc + "&rt=" + _rt + "&dtype=Video&_t=" + String(Math.round(/* @__PURE__ */ new Date())),
          type: "GET",
          success: function (res) {
            try {
              if (res["isPassed"]) {
                if (setting.review && playingTime != duration) {
                  resolve(1);
                } else {
                  resolve(2);
                }
              } else {
                if (setting.rate == 0 && playingTime == duration) {
                  resolve(2);
                } else {
                  resolve(1);
                }
              }
            } catch (e) {
              logger("发生错误：" + e, "red");
              resolve(0);
            }
          },
          error: function (xhr) {
            if (xhr.status == 403) {
              logger("SuperStar返回错误信息，尝试更换参数，40s后将重试，请等待...", "red");
              resolve(3);
            } else {
              reportUrlChange = 1;
              logger("SuperStar返回错误信息，如果持续出现，请联系作者", "red");
            }
          }
        });
      });
    });
  }
  function upLoadWork(index, doms, dom) {
    let $CyHtml = $(dom).contents().find(".CeYan");
    let TiMuList = $CyHtml.find(".TiMu");
    let data = [];
    for (let i = 0; i < TiMuList.length; i++) {
      let _a = {};
      let questionFull = $(TiMuList[i]).find(".Zy_TItle.clearfix > div.clearfix").html().trim();
      let _question = tidyQuestion(questionFull);
      let _TimuType = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[questionFull.match(/^<span.*?newZy_TItle.*?【(.*?)】<\/span>|$/)[1]];
      _a["question"] = _question;
      _a["type"] = _TimuType;
      let _selfAnswerCheck = $(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .answerScore .CorrectOrNot span").attr("class");
      switch (_TimuType) {
        case 0:
          if (_selfAnswerCheck == "marking_dui") {
            let _selfAnswer = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[$(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer").text().trim().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim()];
            let _answerForm2 = $(TiMuList[i]).find(".Zy_ulTop li");
            let _answer2 = $(_answerForm2[_selfAnswer]).find("a.fl").html();
            _a["answer"] = tidyStr(_answer2);
          }
          break;
        case 1:
          let _answerArr = $(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer").text().trim().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim();
          let _answerForm = $(TiMuList[i]).find(".Zy_ulTop li");
          let _answer = [];
          if (_selfAnswerCheck == "marking_dui" || _selfAnswerCheck == "marking_bandui") {
            for (let i2 = 0; i2 < _answerArr.length; i2++) {
              let _answerIndex = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[_answerArr[i2]];
              _answer.push($(_answerForm[_answerIndex]).find("a.fl").html());
            }
          } else {
            break;
          }
          _a["answer"] = tidyStr(_answer.join("#"));
          break;
        case 2:
          let _TAnswerArr = $(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer");
          let _TAnswer = [];
          for (let i2 = 0; i2 < _TAnswerArr.length; i2++) {
            let item = _TAnswerArr[i2];
            if ($(item).find("i").attr("class") == "marking_dui") {
              _TAnswer.push($(item).find("p").html().replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim());
            }
          }
          if (_TAnswer.length <= 0) {
            break;
          }
          _a["answer"] = tidyStr(_TAnswer.join("#"));
          break;
        case 3:
          if (_selfAnswerCheck == "marking_dui") {
            let _answer2 = $(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer").html().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim();
            _a["answer"] = tidyStr(_answer2);
          } else {
            if ($(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer").html()) {
              let _answer2 = $(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer").html().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim();
              if ("对|√|正确".indexOf(tidyStr(_answer2)) != -1) {
                _a["answer"] = "错";
              } else {
                _a["answer"] = "对";
              }
            } else {
              break;
            }
          }
          break;
      }
      if (_a["answer"] != void 0) {
        data.push(_a);
      } else {
        continue;
      }
    }
    uploadAnswer(data, 0).then(() => {
      _mlist.splice(0, 1);
      _domList.splice(0, 1);
      setTimeout(() => {
        startDoCyWork(index + 1, doms);
      }, 3e3);
    });
  }
  function filterAnswerIndex(answertext) {
    let result = answertext.match(/[我的|正确]答案[:：]\s{1}([A-Z]+?):/);
    return result ? result[1] : null;
  }
  function uploadHomeWork() {
    logger("开始收录答案", "green");
    let $_homeworktable = $(".mark_table");
    let TiMuList = $_homeworktable.find(".mark_item").find(".questionLi");
    let data = [];
    $.each(TiMuList, (i, t) => {
      let _a = {};
      let _answer;
      let _answerTmpArr, _answerList = [];
      let TiMuFull = tidyQuestion($(t).find("h3.mark_name").html());
      let TiMuType = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[TiMuFull.match(/[(](.*?)[)]|$/)[1].replace(/, .*?分/, "")];
      let TiMu = TiMuFull.replace(/^[(].*?[)]|$/, "").trim();
      let rightAns_path = $(t).find(".mark_answer").find(".colorGreen")[0];
      switch (TiMuType) {
        case 0:
          let d_rightAns;
          if (rightAns_path) {
            d_rightAns = filterAnswerIndex($(t).find(".mark_answer").find(".colorGreen").text());
          } else {
            let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
            let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
            if (_isTrue2 == "marking_dui" || _isZero != "0") {
              d_rightAns = filterAnswerIndex($(t).find(".mark_answer").find(".colorDeep").text());
            } else {
              return;
            }
          }
          _answerTmpArr = $(t).find(".mark_letter li");
          $.each(_answerTmpArr, (a, b) => {
            _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ""));
          });
          let _i = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[d_rightAns];
          _answer = _answerList[_i];
          _a["question"] = TiMu;
          _a["type"] = TiMuType;
          _a["answer"] = _answer;
          data.push(_a);
          break;
        case 1:
          _answer = [];
          let m_rightAns;
          if (rightAns_path) {
            m_rightAns = filterAnswerIndex($(t).find(".mark_answer").find(".colorGreen").text());
          } else {
            let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
            let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
            if (_isTrue2 == "marking_dui" || _isTrue2 == "marking_bandui" || _isZero != "0") {
              m_rightAns = filterAnswerIndex($(t).find(".mark_answer").find(".colorDeep").text());
            } else {
              break;
            }
          }
          _answerTmpArr = $(t).find(".mark_letter li");
          $.each(_answerTmpArr, (a, b) => {
            _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ""));
          });
          $.each(m_rightAns.split(""), (c, d) => {
            let _i2 = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[d];
            _answer.push(_answerList[_i2]);
          });
          _a["question"] = TiMu;
          _a["type"] = TiMuType;
          _a["answer"] = _answer.join("#");
          data.push(_a);
          break;
        case 2:
          _answerTmpArr = [];
          let t_rightAns;
          let answers = $(t).find(".mark_answer").find(".colorDeep").find("dd");
          if (rightAns_path) {
            t_rightAns = $(rightAns_path).text().replace(/\s/g, "").replace(/[(][0-9].*?[)]/g, "#").replace(/第.*?空:/g, "#").replace(/^正确答案[:：]#*/, "");
            _answer = t_rightAns;
          } else {
            let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
            if (_isZero && _isZero != 0) {
              $.each(answers, (i2, t2) => {
                t_rightAns = $(t2).find("span:eq(0)").text();
                _answerTmpArr.push(t_rightAns.replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim());
              });
            } else {
              $.each(answers, (i2, t2) => {
                let _isTrue2 = $(t2).find("span:eq(1)").attr("class");
                if (_isTrue2 == "marking_dui") {
                  t_rightAns = $(t2).find("span:eq(0)").text();
                  _answerTmpArr.push(t_rightAns.replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim());
                } else {
                  return;
                }
              });
            }
            _answer = _answerTmpArr.join("#");
          }
          if (_answer.length != 0) {
            _a["question"] = TiMu;
            _a["type"] = TiMuType;
            _a["answer"] = _answer;
            data.push(_a);
          }
          break;
        case 3:
          let p_rightAns;
          if (rightAns_path) {
            p_rightAns = $(rightAns_path).text().replace(/\s/g, "").replace(/^正确答案[:：]/, "");
          } else {
            let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
            let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
            if (_isTrue2 == "marking_dui" || _isZero != "0") {
              p_rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/\s/g, "").replace(/^我的答案[:：]/, "");
            } else {
              let _true = "正确|是|对|√|T|ri";
              p_rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/\s/g, "").replace(/^我的答案[:：]/, "");
              if (_true.indexOf(p_rightAns) != -1) {
                p_rightAns = "错";
              } else {
                p_rightAns = "对";
              }
            }
          }
          _a["question"] = TiMu;
          _a["type"] = TiMuType;
          _a["answer"] = p_rightAns;
          data.push(_a);
          break;
        case 4:
          let j_rightAns;
          if (rightAns_path) {
            j_rightAns = $(rightAns_path).text().replace(/\s/g, "");
          } else {
            break;
          }
          _a["question"] = TiMu;
          _a["type"] = TiMuType;
          _a["answer"] = j_rightAns;
          data.push(_a);
          break;
      }
    });
    setTimeout(() => {
      uploadAnswer(data, 0);
    }, 1500);
  }
  function getEnc(a, b, c, d, e, f, g) {
    return new Promise((resolve, reject) => {
      let strEnc = `[${a}][${b}][${c}][${d}][${e * 1e3}][d_yHJ!$pdA~5][${f * 1e3}][${g}]`;
      resolve(md5(strEnc));
    });
  }
  function getAnswer(_t, _q, _o) {
    _t = _t+"";
    _q = _q+"";
    _o = _o+"";
    if (setting.tikuAdapter.use) {
      return new Promise((resolve, reject) => {
        tikuAdapter(_t, _q, _o).then((data) => {
          if (data.length == 0) {
            reject(data);
          } else {
            resolve(data);
          }
        });
      });
    } else if (_GM_getValue("lemtkpro")) {
      logger("🎈请注意：您正在使用高级搜索功能。", "#CC33FF");
      return new Promise((resolve, reject) => {
        advancedSearch(_t, _q, _o).then((data) => {
          data = data.replace("===", "#");
          resolve(data);
        }).catch((data) => {
          reject(data);
        });
      });
    } else {
      let tkurl = atob(_host) + "/api/v1/cx";
      return new Promise((resolve, reject) => {
        let _u = getCk("_uid") || getCk("UID");
        _GM_xmlhttpRequest({
          method: "POST",
          url: tkurl,
          headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + setting.token
          },
          data: JSON.stringify({
            "v": _GM_info["script"]["version"],
            "question": _q,
            "type": _t,
            "options": _o,
            "uid": _u,
          }),
          timeout: setting.time,
          onload: function (xhr) {
            if (xhr.status == 200) {
              let obj = JSON.parse(xhr.responseText) || {};
              if (obj.code == 1e3) {
                let _answer = /^http/.test(obj.data.answer) ? '<img src="' + obj.data.answer + '">' : obj.data.answer;
                logger("题目:" + _q + "<br />---->答案:" + _answer, "purple");
                _answer = _answer.replace("===", "#");
                resolve(_answer);
              } else if (obj.code == 1003) {
                normalSearch(_t, _q, _o).then((data) => {
                  resolve(data);
                }).catch((data) => {
                  reject(data);
                });
              } else {
                logger(obj.msg, "red");
                setting.sub = 0;
                reject({ "c": 0 });
              }
            } else {
              normalSearch(_t, _q, _o).then((data) => {
                resolve(data);
              }).catch((data) => {
                reject(data);
              });
            }
          },
          ontimeout: function () {
            normalSearch(_t, _q, _o).then((data) => {
              resolve(data);
            }).catch((data) => {
              reject(data);
            });
          }
        });
      });
    }
  }
  function advancedSearch(_t, _q, _o) {
    let tkurl = atob(_host) + "/api/v1/mcx";
    return new Promise((resolve, reject) => {
      let _u = getCk("_uid") || getCk("UID");
      _GM_xmlhttpRequest({
        method: "POST",
        url: tkurl,
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + setting.token
        },
        data: JSON.stringify({
          "v": _GM_info["script"]["version"],
          "question": _q,
          "type": _t,
          "options": _o,
          "uid": _u
        }),
        timeout: setting.time,
        onload: function (xhr) {
          if (xhr.status == 200) {
            let obj = JSON.parse(xhr.responseText) || {};
            if (obj.code == 1e3) {
              let _answer = /^http/.test(obj.data.answer) ? '<img src="' + obj.data.answer + '">' : obj.data.answer;
              logger("题目:" + _q + "<br />---->答案:" + _answer, "purple");
              resolve(_answer);
            } else if (obj.code == 5e3 || obj.code == 5001) {
              logger(obj.msg, "red");
              setting.sub = 0;
              reject({ "c": 0 });
            } else if (obj.code == 1003) {
              logger("题目:" + _q + "<br />---->暂无答案", "red");
              setting.sub = 0;
              reject({ "c": 0 });
            } else {
              logger(obj.msg, "red");
              setting.sub = 0;
              reject({ "c": 0 });
            }
          } else if (xhr.status == 403) {
            logger("请求过于频繁，请稍后再试", "red");
            reject({ "c": 403 });
          } else if (xhr.status == 500) {
            logger("题库程序异常,请过一会再试", "red");
            reject({ "c": 500 });
          } else if (xhr.status == 444) {
            logger("IP异常，已被拉入服务器黑名单，请过几个小时再试", "red");
            reject({ "c": 444 });
          } else if (xhr.status == 400) {
            let obj = JSON.parse(xhr.responseText) || {};
            logger(obj.msg, "red");
            reject({ "c": 400 });
          } else {
            logger("题库异常,可能被恶意攻击了...请等待恢复", "red");
            reject({ "c": 555 });
          }
        },
        ontimeout: function () {
          logger("题库异常,可能被恶意攻击了...请等待恢复", "red");
          reject({ "c": 666 });
        }
      });
    });
  }
  function normalSearch(_t, _q, _o) {
    let _fHost = "aHR0cHM6Ly9jeC5pY29kZWYuY29t";
    return new Promise((resolve, reject) => {
      getCk("_uid") || getCk("UID");
      _GM_xmlhttpRequest({
        method: "POST",
        url: atob(_fHost) + "/wyn-nb?v=4",
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        data: "question=" + encodeURIComponent(_q),
        timeout: setting.time,
        onload: function (xhr) {
          if (xhr.status == 200) {
            let obj2 = JSON.parse(xhr.responseText) || {};
            if (obj2.code == 1 && obj2.data) {
              let _answer = /^http/.test(obj2.data) ? '<img src="' + obj2.data + '">' : obj2.data;
              logger("题目:" + _q + "<br />---->答案:" + _answer, "purple");
              uploadAnswer([{ "question": _q, "type": _t, "answer": obj2.data }], 1);
              _answer = _answer.replace("===", "#");
              resolve(_answer);
            } else {
              logger("题目:" + _q + "<br />---->暂无答案,试试高级搜索吧", "red");
              setting.sub = 0;
              reject({ "c": 0 });
            }
          } else if (xhr.status == 403) {
            logger("请求过于频繁,请稍后再试,或者试试高级搜索吧", "red");
            reject({ "c": 403 });
          } else if (xhr.status == 500) {
            logger("题库程序异常,请过一会再试,或者试试高级搜索吧", "red");
            reject({ "c": 500 });
          } else if (xhr.status == 444) {
            logger("IP异常，已被拉入服务器黑名单，请过几个小时再试,或者试试高级搜索吧", "red");
            reject({ "c": 444 });
          } else if (xhr.status == 400) {
            var obj = $.parseJSON(xhr.responseText) || {};
            logger(obj.msg, "red");
            reject({ "c": 400 });
          } else {
            logger("题库异常,可能被恶意攻击了...请等待恢复,或者试试高级搜索吧", "red");
            reject({ "c": 555 });
          }
        },
        ontimeout: function () {
          logger("题库异常,可能被恶意攻击了...请等待恢复,或者试试高级搜索吧", "red");
          reject({ "c": 666 });
        }
      });
    });
  }
  function doWork(index, doms, dom) {
    $frame_c = $(dom).contents();
    let $CyHtml = $frame_c.find(".CeYan");
    let TiMuList = $CyHtml.find(".TiMu");
    $subBtn = $frame_c.find(".ZY_sub").find(".btnSubmit");
    $saveBtn = $frame_c.find(".ZY_sub").find(".btnSave");
    startDoWork(index, doms, 0, TiMuList);
  }
  function startDoWork(index, doms, c, TiMuList) {
    if (c == TiMuList.length) {
      if (setting.sub) {
        logger("测验处理完成，准备自动提交。", "green");
        setTimeout(() => {
          $subBtn.click();
          setTimeout(() => {
            let $recof = $frame_c.find(".maskDiv .popDiv .popBottom a#popok");
            $recof[0].click();
            logger("提交成功，准备切换下一个任务。", "green");
            _mlist.splice(0, 1);
            _domList.splice(0, 1);
            setTimeout(() => {
              startDoCyWork(index + 1, doms);
            }, 3e3);
          }, 5e3);
        }, 3e3);
      } else if (setting.force) {
        logger("测验处理完成，存在无答案题目,由于用户设置了强制提交，准备自动提交。", "red");
        setTimeout(() => {
          $subBtn.click();
          setTimeout(() => {
            let $recof = $frame_c.find(".maskDiv .popDiv .popBottom a#popok");
            $recof[0].click();
            logger("提交成功，准备切换下一个任务。", "green");
            _mlist.splice(0, 1);
            _domList.splice(0, 1);
            setTimeout(() => {
              startDoCyWork(index + 1, doms);
            }, 3e3);
          }, 3e3);
        }, 5e3);
      } else {
        logger("测验处理完成，存在无答案题目或者用户设置不提交。", "red");
      }
      return;
    }
    let questionFull = $(TiMuList[c]).find(".Zy_TItle.clearfix > div").html();
    questionFull = tidyQuestion(questionFull).replace("/<span.*?>.*?</span>/", "");
    let _question = tidyQuestion(questionFull);
    let _TimuType = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[questionFull.match(/^【(.*?)】|$/)[1]];
    let _a = [];
    let _answerTmpArr, _options;
    switch (_TimuType) {
      case 0:
        // single
        _answerTmpArr = $(TiMuList[c]).find(".Zy_ulTop li").find("a");
        $.each(_answerTmpArr, (i, t) => {
          _a.push(tidyStr($(t).html()));
        });
        _options = _a.join("#");
        getAnswer(_TimuType, _question, _options).then((agrs) => {
          let _i = _a.findIndex((item) => item == agrs);
          if (_i == -1) {
            logger("未匹配到正确答案，跳过", "red");
            setting.sub = 0;
          } else {
            $(_answerTmpArr[_i]).parent().click();
          }
          setTimeout(() => {
            startDoWork(index, doms, c + 1, TiMuList);
          }, setting.time);
        }).catch((agrs) => {
          setTimeout(() => {
            startDoWork(index, doms, c + 1, TiMuList);
          }, setting.time);
        });
        break;
      case 1:
        // multiple
        _answerTmpArr = $(TiMuList[c]).find(".Zy_ulTop li").find("a");
        _answerTmpArr.each(function () {
          let answerText = tidyStr($(this).text()).replace(/[ABCD]/g, '').trim();
          _a.push(answerText);
        });
        _options = _a.join("|");
        _a = [];
        getAnswer(_TimuType, _question, _options).then((agrs) => {
          $.each(_answerTmpArr, (i, t) => {
            if (agrs.indexOf(tidyStr($(t).html())) != -1) {
              $(_answerTmpArr[i]).parent().click();
              _a.push(["A", "B", "C", "D", "E", "F", "G"][i]);
            }
          });
          if (_a.length <= 0) {
            logger("未匹配到正确答案，跳过", "red");
            setting.sub = 0;
          }
          setTimeout(() => {
            startDoWork(index, doms, c + 1, TiMuList);
          }, setting.time);
        }).catch((agrs) => {
          setTimeout(() => {
            startDoWork(index, doms, c + 1, TiMuList);
          }, setting.time);
        });
        break;
      case 2:
        // fill
        _options = "";
        let _textareaList = $(TiMuList[c]).find(".Zy_ulTk .XztiHover1");
        getAnswer(_TimuType, _question, _options).then((agrs) => {
          let _answerList = agrs.split("#");
          $.each(_textareaList, (i, t) => {
            setTimeout(() => {
              $(t).find("#ueditor_" + i).contents().find(".view p").html(_answerList[i]);
              $(t).find("textarea").html("<p>" + _answerList[i] + "</p>");
            }, 300);
          });
          setTimeout(() => {
            startDoWork(index, doms, c + 1, TiMuList);
          }, setting.time);
        }).catch((agrs) => {
          setTimeout(() => {
            startDoWork(index, doms, c + 1, TiMuList);
          }, setting.time);
        });
        break;
      case 3:
        // judge
        _options = "对|错";
        _answerTmpArr = $(TiMuList[c]).find(".Zy_ulTop li").find("a");
        let _true = "正确|是|对|√|T|ri";
        $.each(_answerTmpArr, (i, t) => {
          _a.push(tidyStr($(t).html()));
        });
        getAnswer(_TimuType, _question, _options).then((agrs) => {
          agrs = _true.indexOf(agrs) != -1 ? "对" : "错";
          let _i = _a.findIndex((item) => item == agrs);
          if (_i == -1) {
            logger("未匹配到正确答案，跳过", "red");
            setting.sub = 0;
          } else {
            $(_answerTmpArr[_i]).parent().click();
          }
          setTimeout(() => {
            startDoWork(index, doms, c + 1, TiMuList);
          }, setting.time);
        }).catch((agrs) => {
          setTimeout(() => {
            startDoWork(index, doms, c + 1, TiMuList);
          }, setting.time);
        });
        break;
      case 4:
        // short
        _options = "";
        let _textareaLista = $(TiMuList[c]).find(".Zy_ulTk .XztiHover1");
        getAnswer(_TimuType, _question, _options).then((agrs) => {
          if (agrs == "暂无答案") {
            setting.sub = 0;
          }
          let _answerList = agrs.split("#");
          $.each(_textareaLista, (i, t) => {
            setTimeout(() => {
              $(t).find("#ueditor_" + i).contents().find(".view p").html(_answerList[i]);
              $(t).find("textarea").html("<p>" + _answerList[i] + "</p>");
            }, 300);
          });
          setTimeout(() => {
            startDoWork(index, doms, c + 1, TiMuList);
          }, setting.time);
        }).catch((agrs) => {
          setTimeout(() => {
            startDoWork(index, doms, c + 1, TiMuList);
          }, setting.time);
        });
        break;
      default:
        logger("未知题型，跳过", "red");
        setTimeout(() => {
          startDoWork(index, doms, c + 1, TiMuList);
        }, setting.time);
    }
  }
  function uploadAnswer(a, t) {
    a.forEach((item) => {
      item.type = item.type + "";
    });
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        url: atob(_host) + "/api/v1/upload",
        data: JSON.stringify({
          "v": _GM_info["script"]["version"],
          "data": a,
          "uid": "13f2f52f434d44d6e595088b8f5a4baf"
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        onload: function (xhr) {
          try {
            if (t == 1) {
              resolve();
            } else {
              let res = JSON.parse(xhr.responseText);
              if (res["code"] == 1e3) {
                logger("Upload Success.", "green");
              } else {
                logger("Upload Error. Next Part.", "red");
              }
              resolve();
            }
          } catch {
            let res = xhr.responseText;
            if (res.indexOf("防火墙") != -1) {
              logger("Upload Error. Please contact the author.", "red");
            } else {
              logger("Upload Unknow Error. Please contact the author.", "red");
            }
            resolve();
          }
        }
      });
    });
  }
  function switchMission() {
    _mlist.splice(0, 1);
    _domList.splice(0, 1);
    setTimeout(missonStart, 5e3);
  }
  function tidyStr(s) {
    if (s) {
      let str = s.replace(/<(?!img).*?>/g, "").replace(/^【.*?】\s*/, "").replace(/\s*（\d+\.\d+分）$/, "").trim().replace(/&nbsp;/g, "").replace("javascript:void(0);", "").replace(new RegExp("&nbsp;", "gm"), "").replace(/^\s+/, "").replace(/\s+$/, "");
      return str;
    } else {
      return null;
    }
  }
  function tidyQuestion(s) {
    if (s) {
      let str = s.replace(/<(?!img).*?>/g, "").replace(/^【.*?】\s*/, "").replace(/\s*（\d+\.\d+分）$/, "").replace(/^\d+[\.、]/, "").trim().replace(/&nbsp;/g, "").replace("javascript:void(0);", "").replace(new RegExp("&nbsp;", "gm"), "").replace(/^\s+/, "").replace(/\s+$/, "");
      return str;
    } else {
      return null;
    }
  }
  function decryptFont() {
    var $tip = $("style:contains(font-cxsecret)");
    if (!$tip.length)
      return;
    var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
    font = Typr.parse(base64ToUint8Array(font))[0];
    var table = JSON.parse(GM_getResourceText("Table"));
    var match = {};
    for (var i = 19968; i < 40870; i++) {
      $tip = Typr.U.codeToGlyph(font, i);
      if (!$tip)
        continue;
      $tip = Typr.U.glyphToPath(font, $tip);
      $tip = md5(JSON.stringify($tip)).slice(24);
      match[i] = table[$tip];
    }
    $(".font-cxsecret").html(function (index, html) {
      $.each(match, function (key, value) {
        key = String.fromCharCode(key);
        key = new RegExp(key, "g");
        value = String.fromCharCode(value);
        html = html.replace(key, value);
      });
      return html;
    }).removeClass("font-cxsecret");
  }
  function base64ToUint8Array(base64) {
    var data = window.atob(base64);
    var buffer = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
      buffer[i] = data.charCodeAt(i);
    }
    return buffer;
  }
  console.log("%c别假装努力，结局不会陪你演戏！", "color: #E4B8D5");
  