// ==UserScript==
// @name         字数统计
// @namespace    http://tampermonkey.net/
// @version      0.2.4.4
// @description  12345
// @match        *://ml.corp.kuaishou.com/label-frontend/tagging?*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @require      https://lib.baomitu.com/vue/2.6.14/vue.js
// @author       Cyf
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452078/%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/452078/%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';
 
    // Your code here...
    $('html').append(`<div id="strcount"></div>`)
    const myvm = new Vue({
        el: '#strcount',
        template: `<div @mouseenter="onEnter" @mouseleave="onOut" :style="sty">
                    <div v-show="isShow">
                    <input ref="ipt" type="color" v-model:value="stringColor" :style="sty3"/>
                    <div :style="sty2" @click="change">{{msg}}</div>
                    </div>
                </div>`,
        data() {
            return {
                stringColor: '#f5222d',
                bgColor: '#1396db',
                sty: {
                    position: 'fixed',
                    top: '55px',
                    right: '0px',
                    minWidth: '20px',
                    minHeight: '50px',
                    border: '1px dotted #00000030',
                    padding: '0',
                    margin: '0',
                    textAlign: 'center',
                    borderRadius: '3px'
                },
                sty2: {
                    backgroundColor: '#1396db',
                    border: '1px soild #00000020',
                    borderRadius: '5px',
                    fontSize: '10px',
                    height: '20px',
                    lineHeight: '20px',
                    width: '100%',
                    position: 'absolute',
                    bottom: '0px',
                    cursor: 'pointer'
                },
                sty3: {
                    border: 'none'
                },
                isShow: false,
                strIsShow: 1,
            }
        },
        methods: {
            checkNumber(theObj) {
                var reg = /^[a-zA-Z0-9]+.?[a-zA-Z0-9]*$/;
                if (reg.test(theObj)) {
                    return true;
                }
                return false;
            },
            onEnter() {
                this.isShow = true
            },
            onOut() {
                this.isShow = false
            },
            change() {
                if (this.strIsShow == 1) {
                    this.strIsShow = 2
                    $('.stringcount').hide()
                } else {
                    this.strIsShow = 1
                    $('.stringcount').show()
                }
                window.localStorage.setItem('strIsShow', this.strIsShow)
            }
        },
        computed: {
            msg: function () {
                if (this.strIsShow == 1) {
                    return '关闭'
                } else if (this.strIsShow == 2) {
                    return '显示'
                }
            }
        },
        watch: {
            stringColor: function (val) {
                window.localStorage.setItem('stringColor', val)
            }
        },
        mounted() {
            let c = window.localStorage.getItem('stringColor')
            if (c != null) {
                this.stringColor = c
            }
            let sis = window.localStorage.getItem('strIsShow')
            if (sis != null) {
                this.strIsShow = Number(sis)
            }
            setInterval(()=>{
                let a = document.getElementsByTagName('h3')
                for (let i = 0; i < a.length; i++) {
                    if (a[i].childElementCount == 4) {
                        let b = document.createElement('div')
                        b.className = "stringcount"
                        b.style.position = 'absolute'
                        b.style.bottom = '0px'
                        a[i].appendChild(b)
                    }
                    let c = a[i].lastChild
                    let d = a[i].firstChild
                    d = d.textContent.split("")
                    let count = d.length
                    if (count > 20) {
                        c.style.color = this.stringColor
                        c.textContent = count
                        if (this.strIsShow == 2) {
                            $('.stringcount').hide()
                        }
                    }
                }
            }, 200)
 
        }
    })
})();