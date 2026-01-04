// ==UserScript==
// @name         wsmud_login
// @namespace    com.wsmud
// @version      0.0.9
// @description  武神传说登录插件
// @author       sq
// @date         2020/08/26
// @modified     2020/11/07
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news/*
// @exclude      http://*.wsmud.com/pay.html
// @homepage     https://greasyfork.org/zh-CN/scripts/409974
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409974/wsmud_login.user.js
// @updateURL https://update.greasyfork.org/scripts/409974/wsmud_login.meta.js
// ==/UserScript==

(function() {
'use strict'

if (!api) return

const autoLoginId = api.getValue('auto-login-id')
if (autoLoginId) {
  api.deleteValue('auto-login-id')
  api.addMonitor('roles', 'AutoLogin', function() {
    setTimeout(() => $(`.role-item[roleid=${autoLoginId}]`).click(), 1000)
    setTimeout(() => $('.panel_item[command=SelectRole]').click(), 2000)
  })
  return
}

$('li.panel_item[command="SelectRole"]').after(`
<li class="panel_item" id="wsmud-login" style="color:orange;" @click.stop="show = true">
  <span class="glyphicon glyphicon-ok"></span> <span style="margin-left:0.5rem">一键登录</span>
  <div v-if="show" class="login-dialog-bg" @click.stop="show = false">
    <div class="login-dialog" @click.stop>
      <div class="login-dialog-title">一键登录</div>
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
      return api.roles
    },
  },
  methods: {
    login(role) {
      const cookie = api.cookie()
      cookie.u = role.u
      cookie.p = role.p
      cookie.s = role.s
      api.setValue('auto-login-id', role.id)
      location.reload()
    },
    up(index) {
      api.roles[index].sort = index - 1
      api.roles = api.roles.slice(0)
    },
    down(index) {
      api.roles[index].sort = index + 3
      api.roles = api.roles.slice(0)
    },
    remove(index) {
      delete api.roles[index].server
      api.roles = api.roles.slice(0)
    },
  },
  el: '#wsmud-login',
})

api.addStyle(`
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

})()// ==UserScript==
// @name         wsmud_login
// @namespace    com.wsmud
// @version      0.0.9
// @description  武神传说登录插件
// @author       sq
// @date         2020/08/26
// @modified     2020/11/07
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news/*
// @exclude      http://*.wsmud.com/pay.html
// @homepage     https://greasyfork.org/zh-CN/scripts/409974
// @grant        none
// ==/UserScript==

(function() {
'use strict'

if (!api) return

const autoLoginId = api.getValue('auto-login-id')
if (autoLoginId) {
  api.deleteValue('auto-login-id')
  api.addMonitor('roles', 'AutoLogin', function() {
    setTimeout(() => $(`.role-item[roleid=${autoLoginId}]`).click(), 1000)
    setTimeout(() => $('.panel_item[command=SelectRole]').click(), 2000)
  })
  return
}

$('li.panel_item[command="SelectRole"]').after(`
<li class="panel_item" id="wsmud-login" style="color:orange;" @click.stop="show = true">
  <span class="glyphicon glyphicon-ok"></span> <span style="margin-left:0.5rem">一键登录</span>
  <div v-if="show" class="login-dialog-bg" @click.stop="show = false">
    <div class="login-dialog" @click.stop>
      <div class="login-dialog-title">一键登录</div>
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
      return api.roles
    },
  },
  methods: {
    login(role) {
      const cookie = api.cookie()
      cookie.u = role.u
      cookie.p = role.p
      cookie.s = role.s
      api.setValue('auto-login-id', role.id)
      location.reload()
    },
    up(index) {
      api.roles[index].sort = index - 1
      api.roles = api.roles.slice(0)
    },
    down(index) {
      api.roles[index].sort = index + 3
      api.roles = api.roles.slice(0)
    },
    remove(index) {
      delete api.roles[index].server
      api.roles = api.roles.slice(0)
    },
  },
  el: '#wsmud-login',
})

api.addStyle(`
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

})()