// ==UserScript==
// @name         JRPredecision Label
// @namespace    http://baidu.com/
// @version      0.5.10
// @description  Decision label. Try to take over the world!
// @author       You
// @match        http://ov.baidu-int.com/*
// @match        http://yf.baidu-int.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu-int.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://update.greasyfork.org/scripts/491896/1355860/Copy%20Text%20and%20HTML%20to%20Clipboard.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486054/JRPredecision%20Label.user.js
// @updateURL https://update.greasyfork.org/scripts/486054/JRPredecision%20Label.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let label_list = [];
  let cur_label = {};
  let ads_id = -1;
  let start_pre_seq = -1;
  let end_pre_seq = -1;
  let cur_pre_seq = -1;
  let cur_obs_id = -1;
  let is_label_panel_show = false;
  let old_info;
  var initialMouseX, initialMouseY, initialElementX, initialElementY;

  function set_cur_info() {
    var _ads_id = parseInt(
      $("section").children("p").children("span")[1].textContent
    );
    var _cur_pre_seq = parseInt(
      $(".seq-wrap>div>p:nth-child(4)").text().replace("PreSeq:", "")
    );
    // var _cur_obs_id = parseInt($(".viz-detail-text")[9].textContent.replace("id: ", "").trim());
    var _cur_obs_id = null;
    $(".viz-detail-text").each(function () {
          var textContent = $(this).text();
          if (textContent.startsWith('id')) {
              _cur_obs_id = parseInt(textContent.replace("id: ", "").trim());
              console.log("抓取障碍物id", _cur_obs_id);
          }
    });

    if (window.location.host == "yf.baidu-int.com") {
      _ads_id = getUrlParam("ads_id");
      if (_ads_id != null) {
        _ads_id = parseInt(_ads_id);
      } else {
        _ads_id = -1;
      }
      $(".dashboard_value").each(function (index) {
        if (this.textContent.startsWith('PLA')) {
          _cur_pre_seq = parseInt(this.textContent.split("\n")[1].replace("PRE:", "").trim());
          console.log("当前预测帧", _cur_pre_seq);
        }
    });
    }
    if (_cur_pre_seq == null) {
      console.log("抓取帧号失败", _cur_obs_id);
      return;
    }
    if (_cur_obs_id == null) {
      console.log("抓取障碍物id失败", _cur_obs_id);
      return;
    }
    ads_id = isNaN(_ads_id) ? ads_id : _ads_id;
    cur_pre_seq = isNaN(_cur_pre_seq) ? cur_pre_seq : _cur_pre_seq;
    cur_obs_id = isNaN(_cur_obs_id) ? cur_obs_id : _cur_obs_id;
    $("#ads_id").text(ads_id);
    $("#seq_num").text(cur_pre_seq);
    $("#obs_id").text(cur_obs_id);
    cur_label.ads_id = ads_id;
    console.log(ads_id);
    console.log(cur_pre_seq);
    console.log(cur_obs_id);
  }

  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var value = window.location.search.substr(1).match(reg);
    if (value != null) return unescape(value[2]);
    return null;
  }

  function copy2clipboard(str) {
      var $temp = $("<textarea>");
      $("body").append($temp);
      $temp.val(str).select();
      document.execCommand('copy', false, null);
      $temp.remove();
      console.log(str);
      //alert("复制成功");
      showToast('复制成功', 'success');
  }

  function setStartSeq() {
    set_cur_info();
    cur_label.start_seq = cur_pre_seq;
    console.log("set start seq", cur_label.start_seq);
  }
  function setEndSeq() {
    set_cur_info();
    cur_label.end_seq = cur_pre_seq;
    console.log("set end seq", cur_label.end_seq);
  }
  //<textarea id="decision_label_show_list" placeholder="" rows="6" style="width:100%;background-color: #292f42;padding: 10px;max-width: 100%;max-height: 100%;line-height: 1.5;border-radius: 5px;border: 1px solid #ccc;"></textarea>
  function showLabelList() {
    $("#decision_label_show_list").empty();
    for (let i = 0; i < label_list.length; i++) {
      var label = label_list[i];
      var str =
        label.ads_id +
        "\t" +
        label.obs_id +
        "\t" +
        label.start_seq +
        "\t" +
        label.end_seq +
        "\t" +
        label.dec_label;
      var text_ele = $("<textarea>", {
        id: `label${i}`,
        text: str,
        placeholder: "",
        rows: "1",
        style:
          "width:80%;background-color: #008844;margin-left: 5px;margin-right:5px;margin-top: 5px;",
      });
      $(`label${i}`).on("input", function () {
        this.styel.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });
      var button_ele = $("<button>", {
        text: "删除",
        style:
          "background-color: #008844;margin-left: 10px;margin-right:5px;margin-top: 5px;",
      });
      button_ele.click(function () {
        if (i >= 0 && i < label_list.length) {
          label_list.splice(i, 1);
          console.log("删除" + toString(i));
          showLabelList();
        }
      });
      var div = $("<div>", {
        style: "display: flex;",
      });
      // div.append(text_ele);
      div.append(text_ele).append(button_ele);
      $("#decision_label_show_list").append(div);
      console.log("add show string", str);
    }
  }

  function copyLabels() {
    var res = '';
    for (let i = 0; i < label_list.length; i++) {
      var label = label_list[i];
      var str =
        label.ads_id +
        "\t" +
        label.obs_id +
        "\t" +
        label.start_seq +
        "\t" +
        label.end_seq +
        "\t" +
        label.dec_label;
        res = str + '\n' + res;
    }
    copy2clipboard(res);
  }

  function clearLabels() {
      $("#decision_label_show_list").empty();
      label_list = [];
  }

  function checkOverlaps(labels, cur_label) {
    for (let i = 0; i < labels.length; i++) {
      var label = labels[i];
      if (cur_label.obs_id != label.obs_id) {
        continue;
      }
      // 检查重叠：如果一个区间的开始在另一个区间的开始和结束之间，或者反之亦然
      if (
        (cur_label.start_seq < label.end_seq &&
          cur_label.end_seq > label.start_seq) ||
        (label.start_seq < cur_label.end_seq &&
          label.end_seq > cur_label.start_seq)
      ) {
        if (cur_label.label != label.dec_label) {
          console.log(`障碍物${cur_label.obs_id}与第${i}个标签冲突`);
          alert(`障碍物${cur_label.obs_id}与第${i}个标签冲突`);
          return true;
        } else {
          console.log(`障碍物${label.obs_id}区间重复标注`);
          console.warn();
          `障碍物${label.obs_id}区间重复标注`;
          return false;
        }
      }
    }
    return false; // 没有重叠
  }

  function onLabel(dec_label) {
    $("#label_btn_" + dec_label.toString()).click(function () {
      // 添加类以实现按钮变亮效果
      $("#label_btn_" + dec_label.toString()).addClass("clicked");

      // 在 300 毫秒后移除类以恢复按钮原始状态
      setTimeout(function () {
        $("#label_btn_" + dec_label.toString()).removeClass("clicked");
      }, 300);
    });
    if (
      isNaN(ads_id) ||
      isNaN(cur_obs_id) ||
      isNaN(cur_label.start_seq) ||
      isNaN(cur_label.end_seq) ||
      isNaN(dec_label)
    ) {
      return;
    }
    if (ads_id <= 0 && getUrlParam("ads_id") != null) {
      alert("ads id 不合法:" + ads_id.toString());
      return;
    }
    if (cur_obs_id <= 0) {
      alert("obs id 不合法:" + cur_obs_id.toString());
      return;
    }
    if (dec_label < 0) {
      alert("label 不合法" + dec_label.toString());
      return;
    }
    cur_label.ads_id = ads_id;
    cur_label.obs_id = cur_obs_id;
    cur_label.dec_label = dec_label;
    console.log("add decision label to list", cur_label);
    if (checkOverlaps(label_list, cur_label)) {
      return;
    }
    label_list.push(cur_label);
    showLabelList();
    cur_label = {};
  }

  function showDecisionLabelPanel() {
    $("#decision_label_panel").css(
      "z-index",
      -1 * $("#decision_label_panel").css("z-index")
    );
    console.log(
      "move decision label panel to z index ",
      $("#decision_label_panel").css("z-index")
    );
  }
  // Your code here...
  var label_tab = `
      <button type="button" onclick="showDecisionLabelPanel()" class="ant-btn ant-btn-default ant-btn-sm" style="margin-right: 10px;">
          <div class="ant-space ant-space-horizontal ant-space-align-center" style="gap: 8px;">
              <div class="ant-space-item">
                  决策标注
              </div>
          </div>
      </button>
      `;

  var label_panel_html = `
  <div class="container-fluid" id="decision_label_panel"
  style="position: absolute; top: 55%; right: 20px;width: 500px;height:30%;background-color: #292f42;z-index: -9999;">
  <div class="col-md-2 column" style="float: center;">
  </div>
  <div class="row clearfix">
      <div class="col-md-2 column" style="float: center;">
          <div class="row clearfix">
              <label>
                  ads_id:
              </label>
              <label id='ads_id'>
                  -1
              </label>
              <label>
                  obs_id:
              </label>
              <label id='obs_id'>
                  -1
              </label>
              <label>
                  seq_num:
              </label>
              <label id='seq_num'>
                  -1
              </label>
          </div>
      </div>
      <div class="col-md-2 column">
          <div class="row clearfix" style="float: center;">
              <button style="width:45%;margin-left: 3%;background-color: red;transition: background-color 0.3s ease;"
                  onclick="setStartSeq()">
                  seq_start
              </button>
              <button style="width:45%;margin-left: 2%;background-color: green;" onclick="setEndSeq()">
                  seq_end
              </button>
          </div>
          <br>
          <div class="btn-group" style="margin-left: 2%">
              <button style="background-color: #FFBBFF;margin-left: 5px;margin-top: 5px;" id="label_btn_0"
                  type="button" value="0" onclick="onLabel(0)">
                  Ignore(0)
              </button>
              <button style="background-color: #00DDDD;margin-left: 5px;margin-top: 5px;" id="label_btn_1"
                  type="button" value="1" onclick="onLabel(1)">
                  Follow(1)
              </button>
              <button style="background-color: #8C0044;margin-left: 5px;margin-top: 5px;" id="label_btn_2"
                  type="button" value="2" onclick="onLabel(2)">
                  Yield(2)
              </button>
              <button style="background-color: #886600;margin-left: 5px;margin-top: 5px;" id="label_btn_3"
                  type="button" value="3" onclick="onLabel(3)">
                  Overtake(3)
              </button>
              <button style="background-color: #008844;margin-left: 5px;margin-top: 5px;" id="label_btn_4"
                  type="button" value="4" onclick="onLabel(4)">
                  NudgeYield(4)
              </button>
              <button style="background-color: #008888;margin-left: 5px;margin-top: 5px;" id="label_btn_5"
                  type="button" value="5" onclick="onLabel(5)">
                  NudgeOvetake(5)
              </button>
              <button style="background-color: #0000CD;margin-left: 5px;margin-top: 5px;" id="label_btn_6"
                  type="button" value="6" onclick="onLabel(6)">
                  NudgeIgnore(6)
              </button>
              <button style="background-color: #BDB76B;margin-left: 5px;margin-top: 5px;" id="label_btn_7"
                  type="button" value="7" onclick="onLabel(7)">
                  Caution(7)
              </button>
          </div>
          <br>
          <div>
              <div id="decision_label_show_list" style="width:100%">
              </div>
          </div>
          <br>
          <div class="row clearfix" style="float: center;">
              <button id="copy_to_clipboard_btn" style="width:45%;margin-left: 3%;background-color: blue;transition: background-color 0.3s ease;"
                  onclick="copyLabels()">
                  复制
              </button>
              <button style="width:45%;margin-left: 2%;background-color: red;" onclick="clearLabels()">
                  清除
              </button>
          </div>
          <br>
      </div>
  </div>
</div>
</div>

`;

    // 插入 Toast 容器和样式
    function injectToast() {
        // 如果 Toast 容器已经存在，则不重复插入
        if (document.getElementById('toastContainer')) return;

        // 插入 Toast 容器
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        document.body.appendChild(toastContainer);

        // 插入 Toast 样式
        const style = document.createElement('style');
        style.textContent = `
            /* Toast container */
            #toastContainer {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
            }

            /* Individual toast style */
            .toast {
                display: flex;
                align-items: center;
                background-color: #333;
                color: #fff;
                padding: 10px 20px;
                margin-bottom: 10px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            /* Toast visible class */
            .toast.show {
                opacity: 1;
                transform: translateY(0);
            }

            /* Close button */
            .toast .close-btn {
                margin-left: auto;
                background: none;
                border: none;
                color: #fff;
                font-size: 16px;
                cursor: pointer;
            }

            .toast.success {
                background-color: #4caf50;
            }

            .toast.error {
                background-color: #f44336;
            }

            .toast.info {
                background-color: #2196f3;
            }

            .toast.warning {
                background-color: #ff9800;
            }
        `;
        document.head.appendChild(style);
    }

    // 显示 Toast 消息
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');

        // 创建 Toast 元素
        const toast = document.createElement('div');
        toast.className = `toast show ${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="close-btn">×</button>
        `;

        // 关闭按钮事件
        toast.querySelector('.close-btn').addEventListener('click', () => {
            closeToast(toast);
        });

        // 添加到容器中
        toastContainer.appendChild(toast);

        // 自动移除
        setTimeout(() => {
            closeToast(toast);
        }, 3000);
    }

    // 关闭 Toast
    function closeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300); // 等待动画完成后移除
    }


  function clearLabel() {
    return;
    $("#decision_label_show_list").val("");
    label_list = [];
  }

  function onMouseMove(event) {
    // 计算鼠标偏移量
    var offsetX = event.clientX - initialMouseX;
    var offsetY = event.clientY - initialMouseY;

    // 将偏移量应用于元素的位置
    $("#decision_label_panel").css({
      left: initialElementX + offsetX + "px",
      top: initialElementY + offsetY + "px",
    });
  }

  // 鼠标释放事件处理程序
  function onMouseUp() {
    // 移除事件监听器
    $(document).off("mousemove", onMouseMove);
    $(document).off("mouseup", onMouseUp);
  }

  window.onMouseMove = onMouseMove;
  window.onMouseUp = onMouseUp;
  window.set_cur_info = set_cur_info;
  window.showDecisionLabelPanel = showDecisionLabelPanel;
  window.setStartSeq = setStartSeq;
  window.setEndSeq = setEndSeq;
  window.onLabel = onLabel;
  window.clearLabel = clearLabel;
  window.showLabelList = showLabelList;
  window.copyLabels = copyLabels;
  window.clearLabels = clearLabels;

  setTimeout(function () {
    console.log("3s time out");
    // 初始化 Toast 容器
    injectToast();
    $(".if-header-operations").prepend(label_tab);
    $(".ov-header-operations").prepend(label_tab);
    $("body").append(label_panel_html);
    $("#decision_label_panel").mousedown(function (event) {
      var elementTop = $("#decision_label_panel").offset().top;
      var mouseY = event.clientY;
      console.log("elementTop", elementTop, "mouseY", mouseY);
      if (mouseY > elementTop + 10) {
        return; // 如果不在顶部，则忽略拖动
      }
      // 记录鼠标位置和元素初始位置
      initialMouseX = event.clientX;
      initialMouseY = event.clientY;
      initialElementX = $("#decision_label_panel").offset().left;
      initialElementY = $("#decision_label_panel").offset().top;
      console.log("initialMouseX", initialMouseX);

      // 添加事件监听器
      $(document).mousemove(onMouseMove);
      $(document).mouseup(onMouseUp);
    });

  }, 3000); // 等待3秒
})();