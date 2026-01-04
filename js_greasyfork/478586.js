// ==UserScript==
// @name         🥇🥇💯联大学堂-批量刷课助手-💯🥇🥇
// @namespace    http://jxjypt.cn
// @version      1.0
// @description  🥇🥇💯批量刷课助手-联大学堂-💯🥇🥇
// @match        http://jxjypt.cn/*
// @grant        none
// @grant      				GM_info
// @grant      				GM_getTab
// @grant      				GM_saveTab
// @grant      				GM_setValue
// @grant      				GM_getValue
// @grant      				unsafeWindow
// @grant      				GM_listValues
// @grant      				GM_deleteValue
// @grant      				GM_notification
// @grant      				GM_xmlhttpRequest
// @grant      				GM_getResourceText
// @grant      				GM_addValueChangeListener
// @grant      				GM_removeValueChangeListener
// @run-at     				document-start
// @namespace  				https://enncy.cn
// @homepage   				https://docs.ocsjs.com
// @source     				https://github.com/ocsjs/ocsjs
// @icon       				https://cdn.ocsjs.com/logo.png
// @connect    				enncy.cn
// @connect    				icodef.com
// @connect    				ocsjs.com
// @connect    				localhost
// @antifeature				payment
// @downloadURL https://update.greasyfork.org/scripts/478586/%F0%9F%A5%87%F0%9F%A5%87%F0%9F%92%AF%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82-%E6%89%B9%E9%87%8F%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B-%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.user.js
// @updateURL https://update.greasyfork.org/scripts/478586/%F0%9F%A5%87%F0%9F%A5%87%F0%9F%92%AF%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82-%E6%89%B9%E9%87%8F%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B-%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.meta.js
// ==/UserScript==

(function() {
    // 加载Vue和Element UI库
    loadScript('https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js');
    loadScript('https://cdn.jsdelivr.net/npm/element-ui/lib/index.js');

    // 创建悬浮框Vue组件
    var floatBoxComponent = Vue.extend({
        template: `
            <div class="float-box" :style="{'background': 'linear-gradient(to bottom right, rgba(210, 180, 140, 0.8), rgba(255, 255, 224, 0.8))'}">
                <h2 style="font-weight: bold; font-size: 20px; margin-bottom: 10px">Float Box for 联大学堂</h2>
                <div v-for="item in main1f2mm" :key="item.id" style="margin-bottom: 10px">
                    <input type="radio" name="main1f2mm">{{ item.title }}
                </div>
                <div style="margin-bottom: 10px">
                    <el-switch v-model="showCourseware" active-text="课件" inactive-text="课件"></el-switch>
                    <el-switch v-model="showHomework" active-text="作业" inactive-text="作业"></el-switch>
                </div>
                <div style="text-align: center; margin-bottom: 10px">
                    <el-button type="primary" round @click="showPopup">启动</el-button>
                </div>
                <div style="margin-bottom: 10px">
                    当前题库共：888868道
                </div>
                <div style="margin-bottom: 10px">
                    <a href="https://flowus.cn/share/320cb53a-9376-4c35-987e-436e46f9b235" style="color: blue">查看批量教程</a>
                </div>
            </div>
        `,
        data() {
            return {
                main1f2mm: [],
                showCourseware: false,
                showHomework: false
            };
        },
        mounted() {
            // 获取网页源码内的main1f2mm的h3标题
            this.main1f2mm = Array.from(document.querySelectorAll('.main1f2mm h3')).map(item => {
                return {
                    id: item.getAttribute('id'),
                    title: item.textContent
                };
            });
        },
        methods: {
            showPopup() {
                alert('启动失败需要更新');
            }
        }
    });

    // 创建悬浮框实例
    var floatBox = new floatBoxComponent().$mount();

    // 添加悬浮框样式
    var floatBoxStyle = document.createElement('style');
    floatBoxStyle.innerHTML = `
        .float-box {
            position: fixed;
            top: 30px;
            right: 30px;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            z-index: 9999;
        }
    `;
    document.head.appendChild(floatBoxStyle);

    // 添加悬浮框到网页
    document.body.appendChild(floatBox.$el);

    // 加载外部脚本函数
    function loadScript(url) {
        var script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    }
})();