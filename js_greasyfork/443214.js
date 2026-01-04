// ==UserScript==
// @name         wsmud_login1
// @namespace    com.wsmud
// @version      0.0.11
// @description  武神传说登录插件
// @author       sq
// @date         2020/08/26
// @modified     2020/11/07
// @license MIT
// @match        http://*.wsmud.com/*
// @match        http://*.wamud.com/*
// @match        http://mush.fun/*
// @require      https://cdn.staticfile.org/vue/2.6.11/vue.min.js
// @exclude      http://*.wsmud.com/news/*
// @exclude      http://*.wsmud.com/pay.html
// @homepage     https://greasyfork.org/zh-CN/scripts/443214
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/443214/wsmud_login1.user.js
// @updateURL https://update.greasyfork.org/scripts/443214/wsmud_login1.meta.js
// ==/UserScript==

(function () {
    'use strict'
    class Myapi {
        constructor() {
            this.roles = this.getValue('roles')

        }
        set roles(value) {
            if (value instanceof Array) {
                value.sort((a, b) => a.sort - b.sort)
                value.forEach((item, index) => {
                    if (item.server) item.sort = index + 1
                    else item.sort = 9999
                })
                this._roles = value
            } else {
                this._roles = []
            }
            this.setValue('roles', this._roles)
        }
        get roles() { return this._roles }


        addStyle(css) {
            GM_addStyle(css)
        }

        cookie() {
            const cookies = document.cookie.split(';').reduce((accumulator, currentValue) => {
                const i = currentValue.indexOf('=')
                const name = currentValue.substr(0, i).trim()
                const value = currentValue.substr(i + 1)
                accumulator[name] = value
                return accumulator
            }, {})
            const setCookie = (name, value) => document.cookie = name + '=' + value
            const deleteCookie = name => document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
            return new Proxy(cookies, {
                set: (target, name, value) => {
                    setCookie(name, value)
                    return Reflect.set(target, name, value)
                },
                deleteProperty: (target, name) => {
                    deleteCookie(name)
                    return Reflect.deleteProperty(target, name)
                },
            })
        }
        setValue(key, value) {
            localStorage.setItem(key, JSON.stringify(value))
        }
        getValue(key) {
            return JSON.parse(localStorage.getItem(key))
        }
        deleteValue(key) {
            localStorage.removeItem(key)
        }
    }
    $(document).ready(function () {

        var WG = unsafeWindow.WG;

        var myapi = Vue.observable(new Myapi())
        WG.add_hook('roles', function (data) {
            if (!(data.roles instanceof Array)) return
            data.roles.forEach(item => {
                const { id, name, title } = item
                const index = myapi.roles.findIndex(role => role.id === id)
                if (index === -1) {
                    myapi.roles.push({ id, name, title, sort: 9999 })
                } else {
                    myapi.roles[index].name = name
                    myapi.roles[index].title = title
                }
            })
            myapi.roles = myapi.roles.slice(0)
        })
        WG.add_hook('login', function (data) {
            const id = data.id
            if (myapi.id || !id) return
            myapi.id = id
            const index = myapi.roles.findIndex(role => role.id === id)
            myapi.name = myapi.roles[index].name
            const cookie = myapi.cookie()
            myapi.roles[index].u = cookie.u
            myapi.roles[index].p = cookie.p
            myapi.roles[index].s = cookie.s
            myapi.roles[index].server = ['一区', '二区', '三区', '四区', '测试'][cookie.s]
            myapi.roles = myapi.roles.slice(0)

        })

        const autoLoginId = myapi.getValue('auto-login-id')
        if (autoLoginId) {
            myapi.deleteValue('auto-login-id')
            WG.add_hook(['roles'], function () {
                setTimeout(() => $(`.role-item[roleid=${autoLoginId}]`).click(), 1000)
                setTimeout(() => $('.panel_item[command=SelectRole]').click(), 2000)
            })
            return
        }

        $('li.panel_item[command="SelectRole"]').after(`
<li class="panel_item" id="wsmud-login" style="color:orange;" @click.stop="show = true">
  <span class="glyphicon glyphicon-ok"></span> <span style="margin-left:0.5rem">[苏轻]一键登录</span>
  <div v-if="show" class="login-dialog-bg" @click.stop="show = false">
    <div class="login-dialog" @click.stop>
      <div class="login-dialog-title">[苏轻]一键登录</div>
      <transition-group class="login-dialog-rows" tag="div" name="login-animate-list">
        <div class="login-dialog-row" v-for="(role, index) in roles" :key="role.id" v-if="role.server">
          <span class="login-dialog-role" @click="login(role)">[{{ role.server }}] {{ role.name }}</span>
          <span class="glyphicon glyphicon-arrow-up login-dialog-up" @click="up(index)"></span>
          <span class="glyphicon glyphicon-arrow-down login-dialog-down" @click="down(index)"></span>
          <span class="glyphicon glyphicon-trash login-dialog-remove" @click="remove(index)"></span>
        </div>
      </transition-group>
    </div>
  </div>
</li>
`)

        new Vue({
            data: { show: false },
            computed: {
                roles() {
                    return myapi.roles
                },
            },
            mounted() {
                var urlParams = new URLSearchParams(window.location.search)

                var logintype = urlParams.get('type');
                if (logintype) {
                    var username = urlParams.get('username');
                    var password = urlParams.get('password');
                    var area = urlParams.get('area');
                    var name = urlParams.get('name');
                    if (username && password && area && name) {
                        var url = "/UserAPI/Login";
                        var data = "code=" + username + "&pwd=" + password;
                        $.ajax({
                            type: "POST",
                            url: url,
                            data: data,
                            success: function (data) {
                                console.log(data)
                                const cookie = myapi.cookie()
                                cookie.s = area

                                // 获取当前URL
                                var currentUrl = window.location.href;

                                // 去掉参数
                                var urlWithoutParams = currentUrl.split('?')[0];
                                window.location = urlWithoutParams + "?name=" + name;

                            },
                            error: function (data) {
                            }
                        });

                    }
                }



                var name = urlParams.get('name');
                if (name) {
                    for (let role of myapi.roles) {
                        if (role.name == name) {
                            this.login(role)
                        }
                    }
                }



            },
            methods: {
                login(role) {
                    const cookie = myapi.cookie()
                    cookie.u = role.u
                    cookie.p = role.p
                    cookie.s = role.s
                    myapi.setValue('auto-login-id', role.id)
                    if (window.android) {
                        android.reload()
                    } else {
                        window.location.reload()
                    }
                },
                up(index) {
                    myapi.roles[index].sort = index - 1;
                    myapi.roles = myapi.roles.slice(0);

                },
                down(index) {
                    myapi.roles[index].sort = index + 3;
                    myapi.roles = myapi.roles.slice(0);

                },
                remove(index) {
                    delete myapi.roles[index].server;
                    myapi.roles = myapi.roles.slice(0);
                    this.$forceUpdate();
                }
            },
            el: '#wsmud-login',
        })





        myapi.addStyle(`
.login-dialog-bg {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;
  background-color: #000000dd;
  cursor: default;
  user-select: none;
}
.login-dialog {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 101;
  min-width: 300px;
  padding: 10px;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  color: #999999;
  background-color: #080808;
  box-shadow: 0 0 5px #333333;
}
.login-dialog-title {
  color: #00f000;
  padding: 10px 0 10px 10px;
  text-shadow: 0 0 15px;
}
.login-dialog-rows {
  max-height: 230px;
  overflow: auto;
}
.login-dialog-row {
  cursor: pointer;
  padding: 10px;
  display: flex;
}
.login-dialog-role {
  flex: 1 0 auto;
}
.login-dialog-role:hover {
  color: #00ffff;
  text-shadow: 0 0 15px;
}
.login-dialog-up, .login-dialog-down, .login-dialog-remove {
  flex: 0 0 22px;
  margin-left: 5px;
}
.login-dialog-up:hover, .login-dialog-down:hover {
  color: #088000;
  text-shadow: 0 0 15px;
}
.login-dialog-remove:hover {
  color: #880000;
  text-shadow: 0 0 15px;
}
/* 图标 */
.glyphicon-arrow-up:before {
  content: "\\e093";
}
.glyphicon-arrow-down:before {
  content: "\\e094";
}
.glyphicon-trash:before {
  content: "\\e020";
}
/* 过渡动画效果 */
.login-animate-list-move {
  transition: transform 0.5s;
}
.login-animate-list-item {
  display: inline-block;
  margin-right: 10px;
}
.login-animate-list-enter-active, .login-animate-list-leave-active {
  transition: all 0.5s;
}
.login-animate-list-enter, .login-animate-list-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
`)
    });


})()