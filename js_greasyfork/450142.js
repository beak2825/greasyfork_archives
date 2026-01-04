// ==UserScript==
// @name         import-api-template
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  迁移菜单
// @author       li
// @match      https://uac.vip.sankuai.com/*
// @match      https://uac.it.test.sankuai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450142/import-api-template.user.js
// @updateURL https://update.greasyfork.org/scripts/450142/import-api-template.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const page = {
    wrapper: null,
    inputs: null,
    curSysId: '',
    importing: false,
    SAVE_INTERFACE_API: '/api/v2/web/resource/api/save',
    RESOURCE_API: '/api/v2/web/resource/api/list',
    MENU_INFO_API: '/api/v2/web/tree/menuInfo',
    SAVE_MENU_API: '/api/v2/web/tree/menu/save',
    MENU_TREE_LIST: '/api/v2/web/tree/list',
    MENU_NODES_API: '/api/v2/web/tree/getChildrenNodes',
    GET_SERVICES_BY_ID: '/api/v2/web/services/getById',
    MENU_PAGE_REG: /\/app\/(\d+)\/permission-template/,

    request(uri, body, callback) {
      return fetch(uri, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
      })
        .then(res => res.json())
        .then(callback)
        .catch(err => console.error(err.toString()));
    },
    ready(selectors){
      if(!this.observer){
        // 监听document变化
        this.observer = new MutationObserver(this.check.bind(this, selectors, 'observer'));
        this.observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
      }
      // 检查该节点是否已经在DOM中
      this.check(selectors, 'init');
    },
    check(selectors, trigger){
      // 检查是否匹配已储存的节点
      for (let i = 0; i< selectors.length; i++) {
        const { selector, fn, appendChildClassName } = selectors[i];
        const elements = document.querySelectorAll(selector);
        for(let j = 0; j < elements.length; j++){
          let element = elements[j];
          // 确保回调函数只会对该元素调用一次
          // TODO 无法监听到属性变化
          if(!element.ready){
            console.log('check exec', element)
            element.ready = true;
            // 对该节点调用回调函数
            fn.call(element, element);
          }
        }
      }
    },
    initCurPage() {
      // 当进入到某个服务页面，sysId是可以直接获取的，menuId需要点击后才能获取，所以menuId在使用时再进行获取
      const matchInfo = location.pathname.match(this.MENU_PAGE_REG);
      if (matchInfo) {
        const [ _, curSysId ] = matchInfo;
        this.curSysId = curSysId;
        console.log('initCurPage', curSysId);
      }
    },
    appendElement(entry, className) {
      let wrapper = null;
      let baseInnerHtml = ''
      let importBtnCallback = () => {};
      switch (entry) {
        // 迁移菜单 - 应用场景：需要重新创建菜单的情况，创建菜单并迁移对应接口模板
        case 'menuEntry': {
          baseInnerHtml = `
         <div class="script_import_input_container mt-input-sm"><input placeholder="请输入sysCode" class="script_import_input"/></div>
         <div class="script_import_input_container mt-input-sm"><input placeholder="请输入menuCode" class="script_import_input" /></div>
         <button class="mt-btn mt-btn-ghost mt-btn-xs mt-btn-mix-icon mt-edit-table-head-button mt-console-button mt-console-button_add">迁移菜单</button>
      `;
          wrapper = document.querySelector('.framework_right-content .node-info');
          importBtnCallback = this.autoImportMenu.bind(this)
          break;
        }
        // 仅迁移接口模板 - 应用场景：菜单已存在
        case 'apiEntry': {
          baseInnerHtml = `
           <div class="script_import_input_container mt-input-sm"><input placeholder="请输入sysCode" class="script_import_input"/></div>
           <div class="script_import_input_container mt-input-sm"><input placeholder="请输入menuCode" class="script_import_input" /></div>
           <button class="mt-btn mt-btn-ghost mt-btn-xs mt-btn-mix-icon mt-edit-table-head-button mt-console-button mt-console-button_add">导入</button>
        `;
          wrapper = document.querySelector('.node-app-perTemplate-menu-resc-source-info li.key_1 .filter-list .mt-edit-table .mt-edit-table-head-button-group')
          importBtnCallback = this.autoImportApiForExitedMenu.bind(this);
          break;
        }
        default:
          break;
      }

      const div = document.createElement('div');
      div.className = className;
      div.innerHTML = baseInnerHtml;
      this.inputs = Array.from(div.querySelectorAll('input'));
      const btn = div.querySelector('button');
      btn.addEventListener('click', importBtnCallback)
      wrapper.appendChild(div);
    },
    async autoImportApi({ importedSysId, importedMenuId, curMenuId }) {
      const importedPageList = await this.request(
        this.RESOURCE_API,
        {page: { pageNo: 1, pageSize: 200 }, businessSys: {id: importedSysId}, menuId: importedMenuId },
        (res) => { return res.data.pageList; }
      )
      await Promise.all(
        importedPageList?.map(item => this.request(
          this.SAVE_INTERFACE_API,
          { apiDesc: item.apiDesc, apiMethod: item.apiMethod, url: item.url, businessSys: { id: this.curSysId }, menuId: curMenuId, _editMode: true}
        ))
      )
    },
    getNodeValue(selector) {
      const instanceKey = Object.keys(document.querySelector(selector))[0];
      return document.querySelector(selector)[instanceKey]._currentElement._owner._instance.state.value;
    },
    /**
     * 1、新建菜单
     * 2、如果菜单类型是node，则直接导出接口模板
     * 3、如果菜单类型是folder, 则需要递归创建菜单下的所有子菜单
     */
    async createNewMenu({ importedSysMenuList, updatedMenuInfoPart, newBusinessSysInfo, importedSysId, importedMenuId, importedBusiSysCode }) {
      const importedMenuInfo = await this.request(this.MENU_INFO_API,{ businessSys: { id: importedSysId, name: importedBusiSysCode }, menuId: importedMenuId },(res) => res.data);
      const newMenuInfo = { ...importedMenuInfo, ...updatedMenuInfoPart}
      const saveParams = {
        linkUrl: newMenuInfo.linkUrl,
        menuName: newMenuInfo.menuName,
        menuCode: newMenuInfo.menuCode,
        menuSource: newMenuInfo.menuSource,
        menuType: newMenuInfo.menuType,
        attributeList: newMenuInfo.attributeList,
        linkOpenNew: newMenuInfo.linkOpenNew,
        beforeMenuId: newMenuInfo.beforeMenuId,
        beforeMenuName: newMenuInfo.beforeMenuName,
        parentMenuId: newMenuInfo.parentMenuId,
        parentMenuName: newMenuInfo.parentMenuName,
        businessSys: newBusinessSysInfo,
        _isAdd: true
      };
      // 保存菜单
      const { id } = await this.request(this.SAVE_MENU_API, saveParams, (res) => res.data);
      // 判断菜单类型
      switch (importedMenuInfo.menuType) {
        case 'folder': {
          // 获取所有
          const childrenMenuList = importedSysMenuList.filter(item => `${item.parentMenuId}` === importedMenuId);
          for (let i = 0; i < childrenMenuList.length; i++) {
            await this.createNewMenu({
              importedSysMenuList,
              newBusinessSysInfo,
              importedSysId,
              importedBusiSysCode,
              importedMenuId: childrenMenuList[i].menuId,
              updatedMenuInfoPart: { parentMenuId: id, parentMenuName: '' }
            })
          }
          break;
        }
        case 'node': {
          await this.autoImportApi({ importedSysId, importedMenuId, curMenuId: id });
          break;
        }
        default:
          break;
      }
    },
    async autoImportMenu() {
      if (this.importing) return;
      this.importing = true;
      const [importedSysId, importedMenuId] = this.inputs.map(item => item.value);
      const parentNodeValue = this.getNodeValue('._parentMenuId_');
      const beforeMenuNodeValue = this.getNodeValue('._beforeMenuId_');
      // 获取服务对应code
      const [importedBusiSysCode, curBusiSysCode] = await Promise.all(
        [importedSysId, this.curSysId].map((id) => this.request(this.GET_SERVICES_BY_ID, { businessSys: { id } }, (res) => res.data.busiSysCode))
      );
      // 获取导入的菜单信息
      const importedBusinessSys = { id: importedSysId, name: importedBusiSysCode };
      const importedSysMenuList = await this.request(this.MENU_TREE_LIST, { businessSys: importedBusinessSys }, (res) => res.data.menuFolderList)
      await this.createNewMenu({
        importedSysMenuList,
        updatedMenuInfoPart: {
          beforeMenuId: beforeMenuNodeValue.value,
          beforeMenuName: beforeMenuNodeValue.menuName,
          parentMenuId: parentNodeValue.value,
          parentMenuName: parentNodeValue.nodeName
        },
        newBusinessSysInfo: { id: this.curSysId, name: curBusiSysCode},
        importedSysId,
        importedMenuId,
        importedBusiSysCode
      })

      this.importing = false;
      window.location.reload();
    },
    /**
     * 为已存在的菜单自动导入接口
     * @returns {Promise<void>}
     */
    async autoImportApiForExitedMenu() {
      if (this.importing) return;
      this.importing = true;
      const [importedSysId, importedMenuId] = this.inputs.map(item => item.value);
      if (!importedSysId.trim() || !importedMenuId.trim()) {
        this.importing = false;
        return;
      }
      const [_, _1, curMenuId] = location.pathname.match(/\/app\/(\d+)\/permission-template\/(\d+)$/);
      await this.autoImportApi({ importedSysId, importedMenuId, curMenuId });
      this.importing = false;
      window.location.reload();
    },
    initStyle() {
      const style = document.createElement('style')
      style.innerHTML = `.script_import_box_menu { 
        position: absolute;
        top: 0;
        right: 15px;
      }
      .script_import_box_api {
        display: inline-block;
        margin-left: 20px;
      }
      .script_import_input {
        border: 0px;
      }
      .script_import_input_container {
        display: inline-block;
        border: 1px solid;
      }
      .node-info {
        position: relative
      }
      `
      document.documentElement.appendChild(style);
    },
    initEvent() {
      const pushState = history.pushState;
      const replaceState = history.replaceState;

      history.pushState = function() {
        pushState.apply(history, arguments);
        window.dispatchEvent(new Event('locationchange'));
      };

      history.replaceState = function() {
        replaceState.apply(history, arguments);
        window.dispatchEvent(new Event('locationchange'));
      };
      window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
      })

      window.addEventListener('locationchange', this.initCurPage.bind(this));

    },
    render() {
      console.log('render');
      const selectors = [
        {
          selector: '.node-app-perTemplate-menu-resc-content .framework_right span[title="新增节点"]',
          fn: this.appendElement.bind(this, 'menuEntry', 'script_import_box_menu'),
          appendChildClassName: 'script_import_box_menu'
        },
        {
          selector: '.node-app-perTemplate-menu-resc-source-info li.key_1 .filter-list .mt-edit-table',
          fn: this.appendElement.bind(this, 'apiEntry', 'script_import_box_api'),
          appendChildClassName: 'script_import_box_api'
        },
      ]
      this.initEvent();
      this.initStyle();
      this.ready(selectors)
      this.initCurPage();
    }
  };
  page.render();
})();