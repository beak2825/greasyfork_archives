// ==UserScript==
// @name         uac-userscript
// @namespace    http://tampermonkey.net/
// @version      0.3.10
// @description  just an useful tool for uac
// @author       linye
// @match        http*://uac.vip.sankuai.com/*
// @match        http*://uac.it.test.sankuai.com/*
// @match        http*://uac.it.beta.sankuai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/410947/uac-userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/410947/uac-userscript.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const styleText = `
  .search-permission-role iframe {
    margin: 20px;
    border: 1px solid #f1f1f1;
    width: calc(100% - 42px);
    height: 400px;
  }
  `;
  const URI_SYS_LIST = '/api/dataset/forBusiSys/busiSysList';
  const URI_PERM_NAME_TO_ID = '/api/v2/web/permission/list/operation';
  const URI_ROLE_NAME_TO_ID = '/api/v2/web/role/list';
  const URI_PERM_TO_ROLE_LIST = '/api/relation/permissionToRoleList';
  const URI_ROLE_TO_USER = '/api/v2/web/role/users';
  const PATH_REG_PERM = /\/app\/(\d+)\/permission$/;
  const PATH_REG_ROLE = /\/app\/(\d+)\/role(-manage)?(\/)?$/;

  const download = (content, filename) => {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  };
  const page = {
    busiSysId: null,
    reqPayload: null,
    buttonPerm: null,
    buttonRole: null,
    check(duration = 200) {
      const matchPerm = location.pathname.match(PATH_REG_PERM);
      const matchRole = location.pathname.match(PATH_REG_ROLE);
      if (matchPerm) {
        if (this.buttonPerm) return;
        console.log('匹配到权限管理页, busiSysId:', matchPerm[1]);
        this.busiSysId = matchPerm[1];
        this.updateReqPayload();
        setTimeout(this.appendButtonPerm.bind(this), duration);
      } else {
        if (this.buttonPerm) {
          this.buttonPerm.removeEventListener('click', this.downloadUsersPerm);
          this.buttonPerm.remove();
          this.buttonPerm = null;
        }
      }
      if (matchRole) {
        if (this.buttonRole) return;
        console.log('匹配到角色管理页, busiSysId:', matchRole[1]);
        this.busiSysId = matchRole[1];
        this.updateReqPayload();
        setTimeout(this.appendButtonRole.bind(this), duration);
      } else {
        if (this.buttonRole) {
          this.buttonRole.removeEventListener('click', this.downloadUsersRole);
          this.buttonRole.remove();
          this.buttonRole = null;
        }
      }
    },
    request(uri, body, callback, noExtend) {
      const extendObj = noExtend ? {} : this.reqPayload;
      return fetch(uri, {
        method: 'POST',
        body: JSON.stringify({ ...body, ...extendObj }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(callback)
        .catch(err => console.error(err.toString()));
    },
    updateReqPayload() {
      if (this.reqPayload && this.reqPayload.busiSysId === this.busiSysId) return;
      this.request(URI_SYS_LIST, {}, res => {
        const list = res.data.pageList;
        const sys = list.find(item => item.busiSysId === this.busiSysId);
        this.reqPayload = {
          busiSysId: this.busiSysId,
          businessSys: {
            id: this.busiSysId,
            name: sys.busiSysCode
          }
        };
      }, true);
    },
    appendButtonPerm() {
      if (this.buttonPerm) return;
      const wrapper = document.querySelector('.app-name-wrapper');
      const buttonPerm = this.buttonPerm = document.createElement('button');
      buttonPerm.type = 'button';
      buttonPerm.className = 'mt-btn mt-btn-xs mt-btn-mix-icon menu-change';
      buttonPerm.innerHTML = '<i class="block-icon block-icon-down"></i><span>下载权限关联用户</span>';
      buttonPerm.addEventListener('click', this.downloadUsersPerm);
      wrapper.appendChild(buttonPerm);
    },
    appendButtonRole() {
      if (this.buttonRole) return;
      const wrapper = document.querySelector('.app-name-wrapper');
      const buttonRole = this.buttonRole = document.createElement('button');
      buttonRole.type = 'button';
      buttonRole.className = 'mt-btn mt-btn-xs mt-btn-mix-icon menu-change';
      buttonRole.innerHTML = '<i class="block-icon block-icon-down"></i><span>下载角色关联用户</span>';
      buttonRole.addEventListener('click', this.downloadUsersRole);
      wrapper.appendChild(buttonRole);
    },
    async downloadUsersPerm() {
      // 获取权限名称
      const permissionName = document.querySelector('.permission-list-content .selected .permission-name').innerText;
      // 根据权限名称获取权限 id
      const permissionId = await this.request(URI_PERM_NAME_TO_ID, {
        page: { pageNo: 1, pageSize: 10 },
        filter: permissionName
      }, res => {
        const list = res.data.pageList;
        const perm = list.find(item => item.permissionName === permissionName);
        return perm.permissionId;
      });
      // 获取权限关联的所有角色
      const permRoleList = await this.request(URI_PERM_TO_ROLE_LIST, {
        page: { pageNo: 1, pageSize: 1000 },
        permissionId
      }, res => res.data.pageList);
      // 获取每个角色关联的所有用户
      const roleUserList = await Promise.all(
        permRoleList.map(role => this.getRoleUsers(role.roleId))
      );
      const userList = new Set([]);
      roleUserList.forEach(list => {
        list.forEach(user => {
          userList.add(user);
        });
      });
      download(Array.from(userList).join('\n'), permissionName + '.txt');
    },
    async downloadUsersRole() {
      const roleList = document.querySelector('.role-list');
      if (!roleList.querySelector('li.active')) return alert('请先选择角色');
      // 获取角色名称
      const roleName = document.querySelector('.role-list .active').innerText;
      const roleId = await this.request(URI_ROLE_NAME_TO_ID, {
        roleName
      }, res => {
        const list = res.data.pageList;
        const role = list.find(item => item.roleName === roleName);
        return role.roleId;
      });
      const result = await this.getRoleUsers(roleId);
      download(result.join('\n'), roleName + '.txt');
    },
    async getRoleUsers(roleId) {
      let result = [];
      // UAC 限制最多获取 200 个，需要遍历
      const inner = async lastMaxUid => {
        await this.request(URI_ROLE_TO_USER, {
          limit: 200,
          roleId,
          lastMaxUid,
        }, res => {
          const list = res.data.pageList;
          result = result.concat(list.map(user => user.userAccount + ' ' + user.userDesc));
          if (list.length === 200) {
            const lastId = list[199].uid;
            return inner(lastId);
          }
        });
      };
      await inner();
      return result;
    },
    initStyle() {
      const style = document.createElement('style');
      style.innerText = styleText;
      document.querySelector('head').appendChild(style);
    },
    initHistoryEvent() {
      const rawPushState = history.pushState;
      const self = this;
      history.pushState = function() {
        rawPushState.apply(history, arguments);
        self.check();
      };
      window.addEventListener('popstate', this.check.bind(this));
    },
    bootstrap() {
      this.downloadUsersPerm = this.downloadUsersPerm.bind(this);
      this.downloadUsersRole = this.downloadUsersRole.bind(this);
      this.initStyle();
      this.initHistoryEvent();
      this.check(2000);
    }
  };
  page.bootstrap();
})();