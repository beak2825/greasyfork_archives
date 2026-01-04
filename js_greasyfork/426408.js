// ==UserScript==
// @name         返回顶部小助手
// @name         HeiGoBackTop
// @icon         https://z3.ax1x.com/2021/05/13/gBJiXF.png
// @version      1.0.5.0
// @namespace    https://hei-jack.github.io/heigobacktop/
// @description  可能是最漂亮的返回顶部插件。可以用来返回页面顶部，或者跳转底部，也可以用来自动化滑动页面。更多用法等你探索。
// @author       hei-jack
// @match        *
// @include      *
// @require      https://update.greasyfork.org/scripts/426407/1549492/HeiGoBackTopjs.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/426408/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/426408/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  //开启严格模式
  "use strict";

  /**
* 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
**/
  function isNumber(val) {
    var regPos = /^[-0-9]+.?[0-9]*/; //判断是否是数字。
    if (regPos.test(val)) {
      return true;
    } else {
      return false;
    }
  }


  let settings = GM_registerMenuCommand(
    "设置",
    function () {
      //GM_unregisterMenuCommand(id); //删除菜单

      // 如果没有找到旧的
      if (!document.querySelector("#__heigobacktop_setting")) {
        // 创建一个设置界面
        var iframe = document.createElement('iframe');
        iframe.id = "__heigobacktop_setting";
        iframe.setAttribute("style", "position: fixed; top: 0; left: 0; width: 100%; height:100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;z-index: 2147483647;");
        document.body.appendChild(iframe);

        var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = `
  <style>.component_mask{position: fixed;z-index: 9998;width: 100%;height: 100%;top: 0;left: 0;background: rgba(0,0,0,.3);user-select: none;-webkit-user-select: none;}.component_dialog {position: fixed;z-index: 9999;min-width: 300px;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);background-color: #fafafc;text-align: center;border-radius: 3px;}.component_dialog_confirm .component_dialog .component_dialog_hd {padding: 1.2em 20px .5em}.component_dialog_confirm .component_dialog .component_dialog_bd {text-align: left}.component_dialog_hd {padding: 1.2em 20px .5em;}.component_dialog_title {font-weight: 400;font-size: 17px;}.component_dialog_bd {padding: 0 20px;font-size: 15px;color: #888;word-wrap: break-word;word-break: break-all;}.component_dialog_ft {position: relative;line-height: 42px;margin-top: 20px;font-size: 17px;display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;}.component_dialog_ft .component_btn {display: block;-webkit-box-flex: 1;-webkit-flex: 1;-ms-flex: 1;flex: 1;color: #999;text-decoration: none;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);border-left: 1px solid #d5d5d6;}.component_dialog_ft .component_btn:first-child{border: none;}.component_dialog_ft .component_btn:active {background-color: #eee;}.component_dialog_ft:after {content: " ";position: absolute;left: 0;top: 0;width: 100%;height: 1px;border-top: 1px solid #d5d5d6;color: #d5d5d6;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(.5);transform: scaleY(.5)}.component_dialog_ft .confirm{color: #3cc51f;}.component_dialog_ft .cancel{color: #E42626;}.component_btn_dialog.default {color: #353535}.component_btn_dialog.primary {color: #0bb20c}.btn_blue_run{width: 200px; height: 30px; color: white; background-color: cornflowerblue; border-radius: 3px; border-width: 0px; margin: 0px; outline: none; font-family: KaiTi; font-size: 17px; text-align: center; cursor: pointer;}.btn_blue_run:hover{background-color: #0000FF;}.btn_blue_stop{width: 200px; height: 30px; color: white; background-color: cornflowerblue; border-radius: 3px; border-width: 0px; margin: 0px; outline: none; font-family: KaiTi; font-size: 17px; text-align: center; cursor: pointer;background-color: red;}.text-left{text-align: left;}</style>
  <div class="component_mask" id="confirm-diy">
  <div class="component_dialog" id="ConfirmClass_ComfirmArea">
  <div class="component_dialog_hd"><strong class="component_dialog_title">返回顶部小助手 - 设置</strong></div>
  <div class="component_dialog_bd">
  <p class="text-left">
  <span>滑动模式：</span><select id="mode">
  <option value="0">返回顶部</option>
  <option value="1">返回底部</option>
  <option value="2">慢滑到顶部</option>
  <option value="3">慢滑到底部</option>
  </select>
  </p>
  <p class="text-left">
  <span>是否平滑：</span>
  <span class="radio-inline">
  <input type="radio"  name="isSmooth" id="isSmooth1" value="1" checked/>
  <label for="isSmooth1">是</label>
  </span>
  <span>
  <input type="radio"  name="isSmooth" id="isSmooth2" value="0" />
  <label for="isSmooth2">否</label>
  </span>
  </p class="text-left">
  <p class="text-left"><span>按钮主题：</span><input type="text" class="input" id="theme" placeholder="-1表示随机主题 数字0到11表示预设主题"></p>
  <p class="text-left"><span>按钮显示：</span><input type="text" class="input" id="show_height" placeholder="页面滚动多少距离出现按钮 数字"></p>
  <p class="text-left"><span>按钮宽度：</span><input type="text" class="input" id="width" placeholder="按钮宽度 输入数字"></p>
  <p class="text-left"><span>按钮高度：</span><input type="text" class="input" id="height" placeholder="按钮宽度 输入数字"></p>
  <p class="text-left"><span>按钮圆角：</span><input type="text" class="input" id="radius" placeholder="圆角大小 输入数字"></p>
  <p class="text-left"><span>按钮文本：</span><input type="text" class="input" id="btnText" placeholder="按钮要显示的文本"></p>
  <p class="text-left" style="color: red;"><span>温馨提示：</span>保存之后需要重新刷新当前页面才会生效。</p>
  </div>
  <div class="component_dialog_ft">
  <a class="component_btn confirm" style="cursor: pointer;" id="confirm">保存</a>
  <a class="component_btn cancel" style="cursor: pointer;" id="cancel">关闭</a>
  </div>
  </div>
  </div>
`;

        // 读取旧值 进行设置
        iframedoc.getElementById('mode').value = GM_getValue("mode", "0");
        if (GM_getValue("smooth", "true") === "true") {
          iframedoc.getElementById('isSmooth1').checked = true;
        } else {
          iframedoc.getElementById('isSmooth2').checked = true;
        }
        iframedoc.getElementById('theme').value = GM_getValue("theme", "-1");
        iframedoc.getElementById('show_height').value = GM_getValue("show_height", "400");
        iframedoc.getElementById('width').value = GM_getValue("width", "150");
        iframedoc.getElementById('height').value = GM_getValue("height", "40");
        iframedoc.getElementById('radius').value = GM_getValue("radius", "40");
        iframedoc.getElementById('btnText').value = GM_getValue("text", "返回顶部");
        // 处理保存和关闭按钮的点击事件
        iframedoc.getElementById('confirm').addEventListener('click', function () {
          // 获取mode
          let modeEle = iframedoc.getElementById('mode');
          var index = modeEle.selectedIndex;
          var mode = modeEle.options[index].value;
          // 获取是否平滑
          var smooth = iframedoc.getElementById('isSmooth1').checked;
          // 获取按钮主题
          var theme = iframedoc.getElementById('theme').value;
          if (!isNumber(theme) || parseInt(theme) < -1 || parseInt(theme) > 12) {
            alert("主题只能输入-1到11之间的整数");
            return;
          }
          var show_height = iframedoc.getElementById('show_height').value;
          if (!isNumber(show_height) || parseInt(show_height) < 0) {
            alert("按钮显示只能输入大于等于0的整数");
            return;
          }
          var width = iframedoc.getElementById('width').value;
          if (!isNumber(show_height) || parseInt(show_height) < 0) {
            alert("按钮宽度只能输入大于等于0的整数");
            return;
          }
          var height = iframedoc.getElementById('height').value;
          if (!isNumber(show_height) || parseInt(show_height) < 0) {
            alert("按钮高度只能输入大于等于0的整数");
            return;
          }
          var radius = iframedoc.getElementById('radius').value;
          if (!isNumber(show_height) || parseInt(show_height) < 0) {
            alert("按钮圆角只能输入大于等于0的整数");
            return;
          }
          var text = iframedoc.getElementById('btnText').value;

          // 使用gm保存
          GM_setValue("mode", mode);
          GM_setValue("smooth", smooth ? 'true' : 'false');
          GM_setValue("theme", theme);
          GM_setValue("show_height", show_height);
          GM_setValue("width", width);
          GM_setValue("height", height);
          GM_setValue("radius", radius);
          GM_setValue("text", text);
          // 退出
          document.body.removeChild(iframe);
        });

        iframedoc.getElementById('cancel').addEventListener('click', function () {
          // 直接关闭
          document.body.removeChild(iframe);
        });
      }
    },
    {
      autoClose: true
    }
  );

  //初始化 如果没有传入或更改参数 一般都是默认的主题和尺寸大小等
  var instance = new HeiGoBackTop();

  // 示例代码 详情请查看文档https://hei-jack.github.io/heigobacktop/

  //推荐使用下面这种方式切换主题和其他参数
  instance.onBeforeCreate(function () {

    // 模式
    this.mode = parseInt(GM_getValue("mode", "0"));

    // 主题
    if (GM_getValue("theme", "-1") === '-1') {
      // 随机
      this.themes = Math.round(Math.random() * 11);
    } else {
      this.themes = parseInt(GM_getValue("theme"));
    }

    // 是否平滑
    this.smooth = GM_getValue("smooth", "true") === "true";

    // 按钮显示距离
    this.show_height = parseInt(GM_getValue("show_height", "400"));

    // 按钮宽度
    this.width = GM_getValue("width", "150") + "px";

    // 按钮高度
    this.height = GM_getValue("height", "40") + "px";

    // 按钮圆角
    this.radius = GM_getValue("radius", "40") + "px";

    if(GM_getValue("text", "返回顶部") === "返回顶部"){
      switch (this.mode) {
        case 0:
          this.text = '返回顶部';
          break;
        case 1:
          this.text = '跳转页尾';
          break;
        case 2:
          this.text = '慢滑到顶部';
          break;
        case 3:
          this.text = '慢滑到页尾';
      }
    }else{
      // 按钮文本
      this.text = GM_getValue("text", "返回顶部");
    }



  // //切换为2号主题
  // this.themes = 2;

  // //修改按钮尺寸
  // this.width = '200px'; //修改按钮宽度为200px 默认宽度为150px

  // this.height = '50px'; //修改按钮高度为50px 默认高度是40px

  // //修改按钮文本和文本颜色
  // this.text = '你好';
  // this.text_color = '#000';

  // //修改按钮位置
  // this.bottom = '5%';
  // this.right = '10%';

  // //修改按钮颜色
  // this.color = '#000';
  // this.shadow = '0 4px 15px 0 rgba(462, 358, 123,0.75)'; //阴影

  // //更改模式为跳转底部
  // this.mode = 2;
 });

})();