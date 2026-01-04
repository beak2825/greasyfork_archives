// ==UserScript==
// @require https://unpkg.com/element-ui/lib/theme-chalk/index.css
// @require https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js
// @require https://unpkg.com/element-ui/lib/index.js
// @namespace    http://bybutter.com/
// @name butter_test
// @description  往windows上注入某些变量以模拟app环境、解析自定义uri
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @run-at      document-start
// @version 0.0.1.20210108095539
// @downloadURL https://update.greasyfork.org/scripts/419869/butter_test.user.js
// @updateURL https://update.greasyfork.org/scripts/419869/butter_test.meta.js
// ==/UserScript==

!(function (){
            var app = document.createElement('div')
            document.body.appendChild(app)

            var vm = new Vue({
                template: `
                    <div class="butter" style="position:fixed;width: 300px;top:10px;right:10px">
                         <img @click="visible =!visible" style="margin-left: auto;display: block" class="logo" src="https://web.bybutter.com/twoster/static/favicon.png">
                          <transition name="el-fade-in-linear">
                            <el-form style="margin-top:20px" :model="form" label-width="120px" v-if="visible">
                              <el-form-item label="token">
                                <el-input v-model="form.token"></el-input>
                              </el-form-item>
                              <el-form-item label="system">
                                <el-checkbox-group v-model="form.system">
                                    <el-checkbox label="android">模拟android</el-checkbox>
                                    <el-checkbox label="ios">模拟ios</el-checkbox>
                                </el-checkbox-group>
                              </el-form-item>
                              <el-form-item label="拦截buttercam">
                                <el-checkbox v-model="form.buttercam"></el-checkbox>
                              </el-form-item>
                              <el-form-item>
                                <el-button size="small" type="danger">还原</el-button>
                              </el-form-item>
                            </el-form>
                          <transition>
                    </div>
                `,
                el: app,
                data:{
                    form:{
                        system:[
                            'android',
                            'ios'
                        ],
                        token:'eb099cec5c40c66c1dc79a90736fe1da',
                        buttercam: true
                    },
                    visible:false
                },
                watch:{
                    'form.system':{
                        handler: function (list){
                            if(list.indexOf('android') !==-1){
                                unsafeWindow.butterNativeClient = {
                                    getAccessToken:()=>{
                                        return this.form.token || 'eb099cec5c40c66c1dc79a90736fe1da'
                                    }
                                }
                            } else{
                                delete unsafeWindow.butterNativeClient
                            }
                            if(list.indexOf('ios') !== -1){
                                unsafeWindow.butterIOSClient = {
                                    getAccessToken: ()=>{
                                        return this.form.token || 'eb099cec5c40c66c1dc79a90736fe1da'
                                    }
                                }
                            } else {
                                delete unsafeWindow.butterIOSClient
                            }
                        },
                        immediate: true
                    },
                    'form.buttercam':{
                        handler: function (b){
                            if(b){
                                if(/^butter:\/\/camera\/web/.test(location.href)){
                                    unsafeWindow.open(new URL(location.href).searchParams.get('url'))
                                    return
                                }
                                this.$message({
                                    message:'这是一个uri-scheme'
                                })
                            }
                        },
                        immediate: true
                    }
                }
            })
        })()