// ==UserScript==
// @name         朱雀PT批量抽奖
// @namespace    http://tampermonkey.net/
// @version      24.3.2
// @description  t朱雀PT批量抽奖+统计功能，关闭页面不缓存抽奖数据
// @author       大耳朵的图图
// @match        https://zhuque.in/gaming/prizeWheel
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhuque.in
// @grant        none
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/vue@2.7.14/dist/vue.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @require      https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489563/%E6%9C%B1%E9%9B%80PT%E6%89%B9%E9%87%8F%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/489563/%E6%9C%B1%E9%9B%80PT%E6%89%B9%E9%87%8F%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var header_link = '<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">';
    var header_link_tag = $("head");
    if (header_link_tag) {
        header_link_tag.append(header_link);
    }
    function initScript(){
      var divApp = $(`
        <div id="vueApp">
            <el-dialog
                title="朱雀自动抽奖统计" id="menuDialog" top="6vh"
                :visible.sync="dialogVisible" @close="cancel"
                width="30%" destroy-on-close :close-on-click-modal=false>
                <div>每抽灵石：
                <el-input-number v-model="onceBonus" :min="1" :controls="false" :precision="0" placeholder="请输入每抽需要的灵石" :disabled="!isStop"></el-input-number>
                抽奖次数：
                <el-input-number v-model="realCount" :min="1" :max="maxCount" :controls="false" :precision="0" placeholder="请输入抽奖次数" :disabled="!isStop"/></el-input-number>
                </div>
                <div>抽奖间隔(ms)：
                <el-input-number v-model="interval" :min="1000"  :controls="false" :precision="0" placeholder="1秒=1000毫秒"/></el-input-number>
                </div>
                <div>当前灵石：{{bonus}}，最多可抽{{maxCount}}次</div>
                <div>抽奖进度：{{execCount}}/{{realCount}}</div>
                <el-descriptions class="margin-top":column="1" border>
                  <el-descriptions-item v-for="item in  Object.keys(nameMap)">
                    <template slot="label">
                      {{nameMap[item]}}
                    </template>
                    {{result[item]}}
                </el-descriptions-item>
               </el-descriptions>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isStop=!isStop">{{isStop?'开始':'停止'}}</el-button>
                </span>
                </el-dialog>
        </div>
        `);

        var ul_tag = $("body");
        if (ul_tag && document.querySelectorAll("#vueApp").length == 0) {
            ul_tag.append(divApp);
        };

        Vue.prototype.$ELEMENT = {
            size: 'small'
        }

        var app = new Vue({
            el: '#vueApp',
            data() {
                return {
                    dialogVisible: true,
                    result:{
                        1:0,
                        2:0,
                        3:0,
                        4:0,
                        5:0,
                        6:0,
                        7:0,
                    },
                    nameMap:{
                        1: "改名卡 1 张",
                        2: "神佑(VIP) 7 天卡 1 张",
                        3: "邀请卡 1 张",
                        4: "自动释放技能道具卡 7 天卡 1 张",
                        5: "上传 20 GiB",
                        6: "上传 10 GiB",
                        7: "谢谢惠顾"
                    },
                    isStop:true,
                    bonus:0,
                    realCount:0,
                    execCount:0,
                    onceBonus:2000,
                    interval:2000
                };
            },
            mounted() {
                this.getUserInfo()
            },
            watch:{
                isStop(val){
                    if(!val)
                        this.spinThePrizeWheel()
                },
                onceBonus(val){
                    this.realCount = parseInt(this.bonus/val)
                }
            },
            computed:{
              maxCount:function(){
                  return parseInt(this.bonus/this.onceBonus)
              }
            },
            methods: {
                async wait(time) {
                    await new Promise(resolve => setTimeout(resolve, time));
                },
                async getUserInfo(){
                    axios({
                            url: '/api/user/getInfo?id=',
                            method: 'get',
                            headers: {
                                "x-csrf-token": window.csrfToken
                            }
                    }).then(res=>{
                        this.bonus=res.data.data.bonus
                        this.realCount = this.maxCount
                    })
                },
                cancel() {
                    this.dialogVisible = false
                    this.$destroy();
                },
                async spinThePrizeWheel(){
                    await this.getUserInfo()
                    if(this.realCount*this.onceBonus > this.bonus){
                        this.$confirm("设置抽奖次数大于实际灵石数量，已为你设置为灵石最大抽奖次数","提示",{
                            iconClass: "el-icon-question",//自定义图标样式
                            confirmButtonText: "确认",//确认按钮文字更换
                            cancelButtonText: "取消",//取消按钮文字更换
                            showClose: true,//是否显示右上角关闭按钮
                            type: "warning",//提示类型  success/info/warning/error
                        }).then(()=>{
                            this.realCount = this.maxCount
                        }).catch(() => {
                            return
                        });
                    }
                    for(let i=0;i<this.realCount;i++){
                       await axios({
                            url: '/api/gaming/spinThePrizeWheel',
                            method: 'post',
                            headers: {
                                "x-csrf-token": window.csrfToken
                            }
                        }).then(res=>{
                            this.result[res.data.data.prize]=this.result[res.data.data.prize]+1
                           this.execCount++
                        }).finally(async ()=>{
                            await this.wait(this.interval)
                        })
                        if(this.isStop)
                            break;
                    }
                  
                }

            },
            destroyed() {
                $('#vueApp').remove()
            }
        })
    }
    window.initScript=initScript
    $($(".ant-btn")[0].parentElement).append("<button class='ant-btn' type='button' onClick='initScript()' style='height: 32px; width: 114px; border-radius: 16px;'><span>批量开转</span></button>")
})();