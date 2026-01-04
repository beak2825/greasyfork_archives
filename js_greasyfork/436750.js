// ==UserScript==
// @name         【2021】杭电新教务系统自动学评教
// @namespace    https://github.com/Xav1erSue/Newjw_HDU_AutoChoose
// @version      3.3.0
// @description  杭电新教务系统自动学评教
// @author       @Xav1erSue
// @match        http*://newjw.hdu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html*
// @icon         https://www.google.com/s2/favicons?domain=hdu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436750/%E3%80%902021%E3%80%91%E6%9D%AD%E7%94%B5%E6%96%B0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%AD%A6%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/436750/%E3%80%902021%E3%80%91%E6%9D%AD%E7%94%B5%E6%96%B0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%AD%A6%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  const config = {
    /**
     * 是否开启直接提交
     * 默认为 false
     * 开启后点击开始按钮会直接打分并提交
     */
    startAndSubmit: false,
    /**
     * 选项比例，自动学评教时 A、B、C、D 的分别占比
     * 默认值为 { A: 0.6, B: 0.4, C: 0, D: 0 } ,即 A: 60%, B: 40%, C: 0%, D: 0%
     */
    ratio: {
      A: 0.6,
      B: 0.4,
      C: 0,
      D: 0,
    },
    /**
     * @todo 待定
     * 白名单，单独设置老师的学评教参数
     * （似乎没有什么意义？如果有人希望有这个功能的话我再做吧）
     */
    whiteList: [
      {
        name: "张三",
        radio: {
          A: 0.5,
          B: 0.3,
          C: 0.1,
          D: 0.1,
        },
      },
    ],
    /**
     * 监听时间间隔，用于监听 DOM 节点是否已经挂载
     * 如网络不好可以尝试调大该值
     * 默认值为 200 ms
     *  */
    interval: 200,
  };
  // 跳过直接进入主页
  $("#btn_yd")
    .prop("disabled", false)
    .addClass("btn-primary")
    .unbind()
    .click(function () {
      $(document).data("offDetails", "1");
      onClickMenu.call(
        this,
        "/xspjgl/xspj_cxXspjIndex.html?doType=details",
        "N401605",
        { offDetails: "1" }
      );
    });
  document.querySelector("#btn_yd").click();

  const timer = setInterval(() => {
    if (document.querySelector(".ui-pg-selbox")) {
      const container = document.querySelector("#kc-head");

      const notice =
        createElement(`<div class="panel panel-info" style="margin-top:10px; margin-bottom:10px">
      <div class="panel-heading">
        <h3 class="panel-title">使用须知</h3>
      </div>
      <div class="panel-body">
        <p>默认选项比例为：
          <span class="label label-success">A: 60%</span>
          <span class="label label-primary">B: 40%</span>
          <span class="label label-warning">C: 0%</span>
          <span class="label label-danger">D: 0%</span>
        <p>默认的评价方式不会自动提交，需要您检查后自行点击提交</p>
        <p>如果您希望评价完直接自动提交，可以在下方设置中将 <code>startAndSubmit</code> 选项设置为 <code>true</code></p>
        <p>选项比例同样可以在下方的设置中进行修改</p>
        <div><button id="startBtn" class="btn btn-success" style="margin:5px auto; display: block;">开始自动学评教</button></div>
      </div>
    </div>`);
      container.appendChild(notice);
      document
        .querySelector("#startBtn")
        .addEventListener("click", startAutoChoose);

      const configBar =
        createElement(`<div class="panel panel-warning" style="margin-top:10px; margin-bottom:10px">
      <div class="panel-heading">
        <h3 class="panel-title">相关配置</h3>
      </div>
      <div class="panel-body">
        <form class="form-horizontal">
          <div class="form-group">
            <p class="text-center" style="margin:10px"><strong>选项比例</strong></p>

            <div class="form-group">
            <label class="col-sm-2 control-label"><span class="label label-success">A</span></label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="ratio_A" placeholder="0.6" value="${config.ratio["A"]}">
              </div>
            </div>

            <div class="form-group">
            <label class="col-sm-2 control-label"><span class="label label-primary">B</span></label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="ratio_B" placeholder="0.4" value="${config.ratio["B"]}">
              </div>
            </div>

            <div class="form-group">
            <label class="col-sm-2 control-label"><span class="label label-warning">C</span></label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="ratio_C" placeholder="0.0" value="${config.ratio["C"]}">
              </div>
            </div>

            <div class="form-group">
            <label class="col-sm-2 control-label"><span class="label label-danger">D</span></label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="ratio_D" placeholder="0.0" value="${config.ratio["D"]}">
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <div class="checkbox">
                <label>
                  <input type="checkbox" id="startAndSubmit"> 开始并自动提交
                </label>
              </div>
            </div>
          </div>
      </form>
      <div style="display: flex; justify-content:center;">
        <button id="confirmSettings" class="btn btn-success" style="display: inline-block; margin:3px">设置</button>
        <button id="resetSettings" class="btn btn-warning" style="display: inline-block; margin:3px">重置</button>
      </div>
      </div>
    </div>`);
      container.appendChild(configBar);
      document
        .querySelector("#confirmSettings")
        .addEventListener("click", () => {
          const sum =
            parseFloat(document.querySelector("#ratio_A").value) +
            parseFloat(document.querySelector("#ratio_B").value) +
            parseFloat(document.querySelector("#ratio_C").value) +
            parseFloat(document.querySelector("#ratio_D").value);
          if (Math.abs(1 - sum) < Number.EPSILON) {
            config.ratio["A"] = parseFloat(
              document.querySelector("#ratio_A").value
            );
            config.ratio["B"] = parseFloat(
              document.querySelector("#ratio_B").value
            );
            config.ratio["C"] = parseFloat(
              document.querySelector("#ratio_C").value
            );
            config.ratio["D"] = parseFloat(
              document.querySelector("#ratio_D").value
            );
            $.alert(`设置成功！<br/>
            比例为：
              <span class="label label-success">A：${config.ratio["A"]}</span>
              <span class="label label-primary">B：${config.ratio["B"]}</span>
              <span class="label label-warning">C：${config.ratio["C"]}</span>
              <span class="label label-danger">D：${config.ratio["D"]}</span> <br/>
            开始并自动提交： <code>${config.startAndSubmit}</code> `);
          } else $.alert("请输入合法的比例！<br/>（相加应为 <code>1</code>）");
        });

      document.querySelector("#resetSettings").addEventListener("click", () => {
        config.startAndSubmit = false;
        config.ratio["A"] = 0.6;
        config.ratio["B"] = 0.4;
        config.ratio["C"] = 0;
        config.ratio["D"] = 0;
        document.querySelector("#ratio_A").value = config.ratio["A"];
        document.querySelector("#ratio_B").value = config.ratio["B"];
        document.querySelector("#ratio_C").value = config.ratio["C"];
        document.querySelector("#ratio_D").value = config.ratio["D"];
        document.querySelector("#startAndSubmit").checked =
          config.startAndSubmit;
        $.alert("重置成功！");
      });

      // 将显示课程数自动调大
      $(".ui-pg-selbox").val(100).trigger("change");

      clearInterval(timer);
    }
  }, config.interval);

  function toggleAll(id, limit) {
    document.getElementById(id++).click();
    const timer = setInterval(() => {
      const radios = document.querySelectorAll(".radio-pjf");
      if (radios) {
        for (let i = 0; i < 10; i++) {
          const rand = Math.random();
          if (rand <= config.ratio["A"]) radios[i * 4].checked = true;
          else if (rand <= config.ratio["A"] + config.ratio["B"])
            radios[i * 4 + 1].checked = true;
          else if (
            rand <=
            config.ratio["A"] + config.ratio["B"] + config.ratio["C"]
          )
            radios[i * 4 + 2].checked = true;
          else radios[i * 4 + 3].checked = true;
        }
        clearInterval(timer);
        // 给 button 添加 enter 属性从而绕过脚本限制
        if (config.startAndSubmit)
          $("#btn_xspj_tj").data("enter", "true").click();
        else $("#btn_xspj_bc").data("enter", "true").click();

        const timer2 = setInterval(() => {
          if (document.querySelector("#btn_ok")) {
            clearInterval(timer2);
            document.querySelector("#btn_ok").click();
            if (id <= limit) toggleAll(id, limit);
          }
        }, config.interval);
      }
    }, config.interval);
  }

  function startAutoChoose() {
    const confirmed = confirm("确认开始？");
    if (confirmed) {
      const saved = parseInt(document.querySelector("#bc > span").innerText);
      const notRated = parseInt(document.querySelector("#wp > span").innerText);
      const total = saved + notRated;
      toggleAll(1, total);
    }
  }

  function createElement(str) {
    const el = document.createElement("div");
    el.innerHTML = str;
    return el.childNodes[0];
  }
})();
