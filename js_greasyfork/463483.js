// ==UserScript==
// @name         研招网助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  现有功能：辅助查询计划余额信息 -  2023.04.07
// @author       D1n910 && ChatGPT
// @license       MIT
// @match        https://yz.chsi.com.cn/sytj/tj/qecx.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chsi.com.cn
// @grant        none
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463483/%E7%A0%94%E6%8B%9B%E7%BD%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/463483/%E7%A0%94%E6%8B%9B%E7%BD%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function showNotification(text) {
    const message = document.createElement('div');
    message.style.backgroundColor = 'rgba(31, 175, 233, 1)';
    message.style.color = '#fff';
    message.style.position = 'fixed';
    message.style.top = '-50px';
    message.style.left = '0';
    message.style.width = '100%';
    message.style.padding = '10px';
    message.style.textAlign = 'center';
    message.style.fontSize = '18px';
    message.style.fontWeight = 'bold';
    message.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    message.style.zIndex = 100000;
    message.innerText = text;

    document.body.appendChild(message);

    setTimeout(function () {
        message.style.transition = 'top 0.1s';
        message.style.top = '0';

        setTimeout(function () {
            message.style.transition = 'top 0.3s ease';
            message.style.top = '-50px';

            setTimeout(function () {
                message.remove();
            }, 200);
        }, 800);
    }, 10);
}

(function() {
    'use strict';
    var div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);
    var fixButton = document.createElement('div');
    setStyle(fixButton,{
        width: '1',
        height: '32px',
    });
    // 样式函数
    function setStyle(dom,options,fn){
        new Promise(function(resolve,reject){
            for (let key in options){
                dom.style[key] = options[key];
            }
            resolve();
        }).then(res => {
            if (fn) {
                fn()
            }
        }).catch(err => {
            console.log(err)
        })
    }

    // 引入Vue和axios
    if (typeof Vue === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.min.js';
        script.onload = function() {
            if (typeof axios === 'undefined') {
                var script2 = document.createElement('script');
                script2.src = 'https://cdn.bootcdn.net/ajax/libs/axios/0.21.4/axios.min.js';
                script2.onload = function() {
                    // Your function here...
                    window.Vue.component('school-list', {
                        data: function() {
                            return {
                                schools: [],
                                currentIndex: 0,
                                prevIndex: -1,
                                nextIndex: 1
                            };
                        },
                        created: function() {
                            var vm = this;
                            // 发送 AJAX 请求获取学校列表
                            window.axios
                                .get('http://127.0.0.1:3000/targetInstitution')
                                .then(function(response) {
                                vm.schools = response.data.schools;
                            })
                                .catch(function(error) {
                                console.log(error);
                            }).finally(() => {
                                var tjmain = document.querySelector("body > div.tj-main");
                                setStyle(tjmain,{
                                    paddingTop: '209px'
                                });
                                setTimeout(() => { this.search(); }, 10)
                            });
                        },
                        methods: {
                            copySchoolNameAndTime: function() {
                                var schoolName = this.schools[this.currentIndex];
                                var now = new Date();
                                /**
                                var timeString =
                                    now.getFullYear() +
                                    '/' +
                                    (now.getMonth() + 1) +
                                    '/' +
                                    now.getDate() +
                                    ' ' +
                                    now.getHours() +
                                    ':' +
                                    now.getMinutes() +
                                    ':' +
                                    now.getSeconds();
                                 **/
                                //                                var copyText = schoolName + ' ' + timeString;
                                var copyText = schoolName;
                                navigator.clipboard
                                    .writeText(copyText)
                                    .then(() => {
                                    showNotification('已复制到剪切板：' + copyText);
                                    //                                    alert('已复制到剪切板：' + copyText);
                                })
                                    .catch(function(error) {
                                    console.log(error);
                                });
                            },
                            prevSchool: function() {
                                if (this.prevIndex < 0) {
                                    this.$refs.prevSchoolText.innerText = '[最顶部]';
                                    this.$refs.prevSchoolButton.disabled = true;
                                } else {
                                    this.$refs.nextSchoolButton.disabled = false;
                                    this.$refs.prevSchoolText.innerText = this.schools[this.prevIndex];
                                    this.nextIndex = this.currentIndex;
                                    this.currentIndex = this.prevIndex;
                                    this.prevIndex--;
                                }
                                this.search();
                            },
                            nextSchool: function() {
                                if (this.nextIndex >= this.schools.length) {
                                    this.$refs.nextSchoolText.innerText = '[最底部]';
                                    this.$refs.nextSchoolButton.disabled = true;
                                } else {
                                    this.$refs.prevSchoolButton.disabled = false;
                                    this.$refs.nextSchoolText.innerText = this.schools[this.nextIndex];
                                    this.prevIndex = this.currentIndex;
                                    this.currentIndex = this.nextIndex;
                                    this.nextIndex++;
                                }
                                this.search();
                            },
                            search() {
                                document.querySelector("#dwxx").value = this.schools[this.currentIndex];
                                document.querySelector("#tj_seach_form > table > tbody > tr > td:nth-child(11) > a").click();
                            }
                        },
                        template: `
<div class="school-list-container" style="position: fixed; z-index: 999;
    top: 0;
    width: 100%;background-color: rgba(31, 175, 233, 0.8); padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Helvetica Neue', 'Lucida Grande', 'Arial', 'Verdana', 'sans-serif'; font-size: 16px; color: white;">
  <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
    <button ref="prevSchoolButton"  :disabled="currentIndex == 0" @click="prevSchool" style="background-color: white; border: none; border-radius: 5px; padding: 10px 15px; margin-right: 20px; font-size: 16px; font-weight: bold; cursor: pointer;">
    上一个学校</button>
    <input  :disabled="currentIndex == 0"  v-model="currentIndex == 0 ? '最顶部' : schools[currentIndex-1]" type="text" ref="prevSchoolText" style="background-color: white; border: none; border-radius: 5px; padding: 10px; width: 200px; font-size: 16px;" readonly>
  </div>
  <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
    <button @click="copySchoolNameAndTime" style="background-color: white; border: none; border-radius: 5px; padding: 10px 15px; margin-right: 20px; font-size: 16px; font-weight: bold; cursor: pointer;">复制当前校名</button>
    <input type="text" v-model="schools[currentIndex]" style="background-color: white; border: none; border-radius: 5px; padding: 10px; width: 200px; font-size: 16px;" readonly>
  </div>
  <div style="display: flex; justify-content: center; align-items: center;">
    <button ref="nextSchoolButton" :disabled="currentIndex == schools.length - 1" @click="nextSchool" style="background-color: white; border: none; border-radius: 5px; padding: 10px 15px; margin-right: 20px; font-size: 16px; font-weight: bold; cursor: pointer;">下一个学校</button>
    <input  :disabled="currentIndex == schools.length - 1"  v-model="currentIndex == schools.length - 1 ? '最底部' : schools[currentIndex+1]" type="text" ref="nextSchoolText" style="background-color: white; border: none; border-radius: 5px; padding: 10px; width: 200px; font-size: 16px;" readonly>
  </div>
</div>
  `
                });

                    // 创建 Vue 实例
                    new window.Vue({
                        el: '#app',
                        template: '<school-list></school-list>'
                    });
                };
                document.head.appendChild(script2);
            }
        }

        document.head.appendChild(script);
    }

})();