// ==UserScript==
// @name         HY temu批量属性
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-12-18 V1.2
// @description  调整顺序
// @author       lyw
// @match        https://seller.kuajingmaihuo.com/goods/product/list
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/520613/HY%20temu%E6%89%B9%E9%87%8F%E5%B1%9E%E6%80%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/520613/HY%20temu%E6%89%B9%E9%87%8F%E5%B1%9E%E6%80%A7.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Inject Element UI CSS
  GM_addStyle('@import url("https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css");');

  // Create a Vue instance for Element UI
  const app = document.createElement('div');
  document.body.appendChild(app);

  // Define Vue component with Element UI dialog
  new Vue({
    el: app,
    data: {
      spu1: null,
      previousSpu1Value: '',
      loadIntervalId: null,
      spuChangeIntervalId: null,
      escListenerAdded: false,
      inputValue: '', // 存储用户输入的值
      dialogVisible: false, // 控制弹出框显示
    },
    methods: {
      // meth 函数，用于执行特定的页面操作
      async meth() {
        const atr = document.querySelector('.show-property-edit-drawer_container__3hhJI form .product-property_propertyBlock__3hQXd .Form_itemContentCenter_5-113-0 .IPT_inputBlockCell_5-113-0.ST_inputBlockCell_5-113-0 input');
        if (atr) {
          atr.click();
          const atr1 = document.querySelector('.PT_portalMain_5-113-0.PP_dropdownMain_5-113-0.ST_dropdownMain_5-113-0 ul li .name-label_enName__3YVad');
          if (atr1 && atr1.innerHTML === 'Smooth fabric') {
            atr1.click();
          }
        }

        const element = document.querySelector('.product-property_propertyBlock__3hQXd [data-testid="beast-core-input-htmlInput"]');
        if (element) {
          element.focus();
          document.execCommand('selectAll', false, null);
          document.execCommand('insertText', false, this.inputValue); // 使用用户输入的值
          document.activeElement.blur();
        }

        let atr2 = document.querySelector('[id="productProperties[2103]"] input')
        if (atr2) {
          atr2.click()
          await new Promise(resolve => setTimeout(resolve, 500));
          const Stock = document.querySelectorAll('[data-testid="beast-core-portal-main"] ul li .name-label_enName__3YVad')[1]
          if (Stock && Stock.innerHTML === 'Stock') {
            Stock.click();
          }
        }

        //里料
        const HY_atr = document.querySelector('.product-property_propertyContainer__3q1oN [id="productProperties[6928]"] input');
        if (HY_atr) {
          HY_atr.click();
          await new Promise(resolve => setTimeout(resolve, 500)); // 等待 500 毫秒
          const HY_Select = document.querySelectorAll('.PT_portalMain_5-113-0.PP_dropdownMain_5-113-0.ST_dropdownMain_5-113-0 li .name-label_enName__3YVad')[2]
          if (HY_Select && HY_Select.innerHTML === 'No lining') {
            HY_Select.click();
          }
        }



        let submitButton = document.querySelector('[data-tracking-id="JUh96Eg0NggWr04P"]');
        if (submitButton) {
          submitButton.click();
        }


        this.spuChangeIntervalId = setInterval(() => {
          this.loop();
        }, 1000); // 每秒检查一次 spu1 的变化
      },

      // 循环函数，根据 Spu1 的变化来执行操作
      loop() {
        if (this.spu1 && this.spu1.innerHTML !== this.previousSpu1Value) {
          clearInterval(this.spuChangeIntervalId);
          console.log("Spu1 value has changed!");
          this.previousSpu1Value = this.spu1.innerHTML;
          this.monitorLoad();
        }
      },

      // 监控 load 元素的变化
      monitorLoad() {
        this.loadIntervalId = setInterval(() => {
          const load = document.querySelector('.index-module__drawer-body___Qj4d- .index-module__content___7Av7B .show-property-edit-drawer_container__3hhJI form .Spn_container_5-113-0.Spn_spinning_5-113-0');
          if (!load) {
            clearInterval(this.loadIntervalId);
            this.meth();
          }
        }, 1000); // 每秒检查一次
      },

      // 启动循环的逻辑
      startLoop() {
        // 监听 F3 键触发弹出框
        window.addEventListener('keydown', (event) => {
          if (event.key === 'F2') {
            this.spu1 = document.querySelector('.show-property-edit-drawer_container__3hhJI .copy-text_copy__3Cie7');
            if (this.spu1) {
              this.spu1 = this.spu1.previousElementSibling;
              this.previousSpu1Value = this.spu1 ? this.spu1.innerHTML : '';
              console.log("F2 pressed, starting loop");
            }
            this.dialogVisible = true; // 显示弹出框
          }

          // 监听 ESC 键退出脚本
          if (event.key === 'Escape') {
            this.stopScript();
          }
        });

        if (!this.escListenerAdded) {
          this.escListenerAdded = true;
          window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
              this.stopScript();
            }
          });
        }
      },

      // 确定按钮点击事件
      confirmInput() {
        console.log("User input:", this.inputValue); // 打印输入的值
        this.dialogVisible = false; // 关闭弹出框
        this.meth(); // 执行 meth 函数
      },

      // 取消按钮点击事件
      cancelInput() {
        this.dialogVisible = false; // 关闭弹出框
      },

      // 停止脚本的执行
      stopScript() {
        console.log("ESC按下,推出程序");
        clearInterval(this.spuChangeIntervalId);
        clearInterval(this.loadIntervalId);
        window.removeEventListener('keydown', this.stopScript);
        // 显示 Toast 提示
        this.$message({
          message: '修改克重程序已停止',
          type: 'success',
          duration: 5000 // 3秒后自动关闭
        });
        console.log("程序已停止");
      }
    },

    mounted() {
      console.log("脚本已加载");
      this.startLoop();
    },

    template: `
          <el-dialog
              :visible.sync="dialogVisible"
              @close="cancelInput">
              <h1>请筛选好类目 并 打开好修改页面 再执行程序(可能有bug,在电脑前盯着别走开)</h1>
              <p>注意:执行过程中发现错误，可按下<b>ESC中止程序</b>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;所有服饰面料默认 <b>光面</b> 里料默认 <b>无</b></p>
              <b>@所有人</b> 面料克重大家重新确认一下，不要填错
              <p>ADY000#<b>250克</b></p>
              <p>HY8002#<b>300克</b></p>
              <p>69000#<b>220克</b></p>
              <p>XS001#<b>220-230克</b></p>
              <p>XS002#<b>290-300克</b></p>
              <el-input v-model="inputValue" placeholder="请输入当前筛选类名服饰的克重值,需要具体确定的值,如220"></el-input>
              <span slot="footer" class="dialog-footer">
                  <el-button @click="cancelInput">取消</el-button>
                  <el-button type="primary" @click="confirmInput">确定</el-button>
              </span>
          </el-dialog>
      `
  });
})();
