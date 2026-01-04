// ==UserScript==
// @name         Shein店小秘
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2025-6-6
// @description  更新货号
// @author       lyw
// @match        https://www.dianxiaomi.com/sheinProduct/quoteEdit.htm?id=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/538233/Shein%E5%BA%97%E5%B0%8F%E7%A7%98.user.js
// @updateURL https://update.greasyfork.org/scripts/538233/Shein%E5%BA%97%E5%B0%8F%E7%A7%98.meta.js
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
            dialogVisible: false,
            inputValue: '',
            textarea2: '',
            shirt_sort: '',
            Colorobj: {},
            img_skc: [],
        },
        template: `
            <div style="position: absolute; bottom: 16px; right: 689px; z-index: 9999;">
                <el-dialog title="输入内容" :visible.sync="dialogVisible" @close="handleClose">
                    <el-input v-model="inputValue" placeholder="请输入图片编码" ref="inputField" style="margin-bottom: 17px"></el-input>
                    <el-input v-model="shirt_sort" placeholder="请输入款式" style="margin-bottom: 17px"></el-input>
                    <el-input v-model="textarea2" autosize type="textarea" placeholder="" />
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="confirm">确认</el-button>
                        <el-button @click="Setlocal">保存</el-button>
                    </span>
                </el-dialog>
            </div>
        `,
        methods: {
            handleClose() {
            },
            async confirm() {
                this.Colorobj = []
                this.img_skc = []
                const show_sku = document.querySelector('.show-sku')
                await show_sku.click()
                this.textarea2.split('\n').forEach(line => {
                    const [key, value] = line.split(':');
                    this.Colorobj[key] = value;
                });

                console.log(this.Colorobj);

                //输入图片编码
                const suffixIpt = document.querySelector('.suffixIpt.form-component.w120')
                suffixIpt.value = this.inputValue

                //输入衣服款式
                const PrdfixSkuIpt = document.querySelector('.PrdfixSkuIpt.form-component.w120')
                PrdfixSkuIpt.value = this.shirt_sort

                //修改货号
                document.querySelector('#productItemNumber').value = this.shirt_sort + '-' + this.inputValue

                // 匹配修改颜色
                const colorElements = document.querySelectorAll('.gainword[titlename="颜色"] .wordCend[data-placement="top"]');
                colorElements.forEach(element => {
                    const elementText = element.innerHTML.trim();
                    for (const key in this.Colorobj) {
                        if (key === elementText) {
                            console.log(`匹配成功：${key}`);
                            //修改颜色匹配
                            element.parentNode.nextElementSibling.value = this.Colorobj[key]
                            //获取空间图片编号
                            this.img_skc.push(this.inputValue + '-' + this.shirt_sort + '-' + this.Colorobj[key] + '.jpg');
                        }
                    }
                });

                this.dialogVisible = false; // 关闭对话框
                const Correct_Btn = document.querySelector('#skdropdown')
                Correct_Btn.click()
            },
            Setlocal() {
                localStorage.setItem("Color_textarea", this.textarea2);
                localStorage.setItem("shirt_sort", this.shirt_sort);
                this.$message({
                    message: '保存成功',
                    type: 'success',
                    duration: 2000
                });
            },
            async LoadImg() {
                const attrName = document.querySelectorAll('.top .attrName')
                await this.PrepareObj(attrName,document.querySelectorAll('.skuImgListTbody .menu.uploadImgOut'))

                await this.PrepareObj(attrName,document.querySelectorAll('.thumbnails-box.squareImgTd .dropdown-menu'))

                await this.PrepareObj(document.querySelectorAll('.min-w100.particularImgSkc'),document.querySelectorAll('.particularImgListTbody .menu.uploadImgOut'))
            },
            async LoadMeth(list, obj) {
                for (let i = 0; i < list.length; i++) {
                    const item = list[i];
                    await item.querySelectorAll('li')[1].children[0].click()
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // 获取iframe元素commProductMyFrame
                    let iframe = document.getElementById("commProductMyFrame");
                    let iframeDocument = iframe.contentWindow.document;
                    let inputElement = iframeDocument.getElementById("name");

                    inputElement.value = obj[i];

                    // await new Promise(resolve => setTimeout(resolve, 500));
                    //搜索按钮
                    await iframeDocument.querySelector('.button.btn-determine.btn-block').click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    //第一张图
                    await iframeDocument.querySelector('.picturesMaskCon.myj-hide').click();
                    //确认按钮
                    await document.querySelector('.modal-footer.col-xs-12 .button.btn-determine').click()
                }
            },
            async PrepareObj(attrName, list) {
                const Obj = []
                await attrName.forEach(item => {
                    Object.keys(this.Colorobj).forEach(key => {
                        if (item.innerHTML === key) {
                            Obj.push(this.inputValue + '-' + this.shirt_sort + '-' + this.Colorobj[key] + '.jpg');
                        }
                    });
                })

                await this.LoadMeth(list, Obj)
            }
        },
        mounted() {
            console.log('程序已启动')
            this.textarea2 = localStorage.getItem("Color_textarea");
            this.shirt_sort = localStorage.getItem("shirt_sort");
            // 监听 F2 键触发事件
            window.addEventListener('keydown', (event) => {
                if (event.key === 'F2') {
                    this.dialogVisible = true; // 按下 F2 键时显示对话框
                }

                // 监听 Del 键触发删除操作
                if (event.key === 'Delete') {
                    const inputElements = document.querySelectorAll('[uid="skuImgList"]');
                    const inputElements2 = document.querySelectorAll('[uid="particularImgList"]');
                    inputElements.forEach((item) => {
                        const test = item.querySelector('[onclick="SHEIN_PRODUCT_IMAGE_UP.imageFn.skuDetailImgDel(this);"]');
                        test.click()
                    })
                    inputElements2.forEach((item) => {
                        const test = item.querySelector('[onclick="SHEIN_PRODUCT_IMAGE_UP.particularImgFn.particularDetailImgDel(this);"]')
                        test.click()
                    })
                    //方形图
                    const square_del = document.querySelectorAll('.thumbnails-box.squareImgTd [data-original-title="删除"]')
                    square_del.forEach(item => {
                        item.click()
                    })
                }

                if (event.key === 'F4') { // 检测 'Insert' 键
                    this.LoadImg()
                }
            });

            // 聚焦输入框
            this.$watch('dialogVisible', (newVal) => {
                if (newVal) {
                    this.$nextTick(() => {
                        // 确保 Vue 更新 DOM 后，聚焦输入框
                        this.$refs.inputField.$el.querySelector('input').focus();
                    });
                }
            });
        }
    });
})();
