// ==UserScript==
// @name         _XdemoFDL
// @namespace    https://ysslang.com/
// @version      1.1.0
// @description  brute force FDL demo!
// @author       ysslang
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @match        https://demo.finedatalink.com/decision*
// @match        http://demo.finedatalink.com:80*/*
// @match        http://localhost:80*/webroot/decision*
// @match        https://fdl.ysslang.com:60443/webroot/decision*
// @match        https://fdl-it.fineres.com/webroot/decision*
// @supportURL   https://greasyfork.org/en/scripts/472625
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.41
// @require      https://greasyfork.org/scripts/454354/code/yssWaitForNode.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472625/_XdemoFDL.user.js
// @updateURL https://update.greasyfork.org/scripts/472625/_XdemoFDL.meta.js
// ==/UserScript==

/* Done:
- 适配4.1.2
*/


(function() {
  'use strict';

  var WFN = new WaitForNode();
  var BI = window.BI || {};
  var Dec = window.Dec || {};
  // WFN.batchAdd('', '', [['', (el) => el.click()]]);

  class NodeTree {
    #toExpand = [];
    #expanding;

    isNode(el){ return el.querySelector(':is([*|href="#icon-etl-file"], [*|href="#icon-api-file"], [*|href="#prep-pipeline-task-icon"])') ? true : false; }
    isFolderNode(el){ return el.querySelector(':is([*|href^="#icon-folder-"], [*|href^="#prep-pipeline-tree-folder-"])') ? true : false; }
    getNodeChecked(el){
      const checkbox = el.querySelector('input.yssBtn.bi-checkbox');
      return checkbox.checked;
    }
    checkNode(el, checked){
      const checkbox = el.querySelector('input.yssBtn.bi-checkbox');
      if(checkbox.checked == checked) return;
      checkbox.checked = checked;
      this.dispatchEvent(el)
    }
    initCheckboxStatus(el){
      const parent = this.#getParent(el);
      if(!parent ||!this.getNodeChecked(parent)) return;
      this.checkNode(el, true);
      if(this.isFolderNode(el)) window.nt.addExpand(el);
    }
    dispatchEvent(el){
      const isChecked = this.getNodeChecked(el);
      const isFolderNode = this.isFolderNode(el);
      if(isChecked) {
        if(isFolderNode){
          window.nt.addExpand(el);
        }
      }
    }
    addExpand(node){
      if(!node.querySelector('.ant-tree-switcher_close')) return ;
      this.#toExpand.push(node.querySelector('.ant-tree-switcher_close'));
      if(this.#expanding) return;
      this.#expanding = true;
      setTimeout(function(){window.nt.executeExpand();}, 100);
    }
    executeExpand(){
      const el = this.#toExpand.shift();
      if(el.classList.contains('ant-tree-switcher_close')) el.click();
      if(!this.#toExpand.length) this.#expanding = false;
      else setTimeout(function(){window.nt.executeExpand();}, 200);
    }

    #getIndent(el){
      return el.querySelectorAll('span.ant-tree-indent > span.ant-tree-indent-unit').length;
    }
    #getParent(el){
      const currentIndent = this.#getIndent(el);
      if(currentIndent === 0) return ;
      let iterate = el.previousElementSibling;
      while(iterate && this.#getIndent(iterate) >= 0) {
        if(this.#getIndent(iterate) === currentIndent - 1) break;
        iterate = iterate.previousElementSibling;
      }
      return iterate;
    }
    #getChildren(el){
      const currentIndent = this.#getIndent(el);
      let result = [];
      let iterate = el.nextElementSibling;
      while(iterate && this.#getIndent(iterate) > currentIndent) {
        result.push(iterate);
        iterate = iterate.nextElementSibling;
      }
      return result;
    }
    #getSiblings(el, includeSelf){
      const currentIndent = this.#getIndent(el);
      let result = [];
      let iterate = el.previousElementSibling;
      while(iterate && this.#getIndent(iterate) >= 0) {
        if(this.#getIndent(iterate) == 0 || this.#getIndent(iterate) < currentIndent) break;
        if(this.#getIndent(iterate) == currentIndent){
          result.push(iterate);
        }
        iterate = iterate.previousElementSibling;
      }
      if(includeSelf) result.push(el);
      iterate = el.nextElementSibling;
      while(iterate && this.#getIndent(iterate) >= 0) {
        if(this.#getIndent(iterate) == 0 || this.#getIndent(iterate) < currentIndent) break;
        if(this.#getIndent(iterate) == currentIndent){
          result.push(iterate);
        }
        iterate = iterate.nextElementSibling;
      }
      return result;
    }
    flushDown(el, checked){
      const children = this.#getChildren(el);
      if(!children) return ;
      children.forEach(c => {
        this.checkNode(c, checked);
        this.flushDown(c);
      });
    }
    flushUp(el, checked){
      const parent = this.#getParent(el);
      if(!parent) return ;
      if(checked){
        const siblings = this.#getSiblings(el, true);
        if(siblings.some(s => this.getNodeChecked(s) == false)) return ;
      }
      this.checkNode(parent, checked);
      return this.flushUp(parent, checked);
    }

    findReact(el) {
      if(!el) return null;
      const key = Object.keys(el).find(key => key.startsWith("__reactFiber$"));
      const component = el[key];
      if (component == null) return null;
      return component.return;
    }
    getReactData(e){
      let element = e;
      if(typeof(e)==='string') element = document.querySelector(e);
      if(!element || !element instanceof HTMLElement) return {};
      const component = this.findReact(element);
      if(component && component.memoizedProps && component.memoizedProps.data) return component.memoizedProps.data;
      return {};
    }

    getVisibleTabContainer(){
      return document.querySelector(`.dec-common-tabs > .bi-abs:not([style*="display: none"])`);
    }
    getUrlBase(subUrl){
      const vTab = window.nt.getVisibleTabContainer();
      let baseUrl = '';
      if(vTab.querySelector('.fdl-etl-file-tree')) baseUrl = '/fdl/dev';
      if(vTab.querySelector('.prep-pipeline-file-tree')) baseUrl = '/fdl/pipeline';
      if(vTab.querySelector('.fdl-api-file-tree')) baseUrl = '/fdl/service';
      return subUrl ? `${baseUrl}${subUrl}` : baseUrl;
    }
    deleteAll(){
      const vTab = window.nt.getVisibleTabContainer();
      const baseUrl = window.nt.getUrlBase();
      const rnodes = vTab.querySelectorAll('div.ant-tree-treenode:has(input.yssBtn.bi-checkbox:checked');
      const nodes = [...rnodes].reverse();
      const leafNodes = nodes.filter(window.nt.isNode);
      setTimeout(function(){ window.nt.batchDeleteNodes(window.nt.getUrlBase(`/catalog/entity/delete`), leafNodes)}, 100);
      const folderNodes = nodes.filter(window.nt.isFolderNode);
      setTimeout(function(){ window.nt.batchDeleteNodes(window.nt.getUrlBase(`/catalog/package/delete`), folderNodes)}, 500);
      BI.Msg.toast(`已开始删除, 请于删除完成后刷新页面. 如有文件夹删除失败请尝试再次删除. 如出现错误请联系LeoYuan`);
    }
    batchDeleteNodes(url, nodes){
      nodes.forEach(node => {
        const data = window.nt.getReactData(node);
        const dData = {id: data.key, parentId: data.parentId, parentPath: data.parentPath};
        Dec.reqPost(url, dData, e => {
          if(e.data == "success") {
            BI.Msg.toast(`成功删除 ${data.name} `);
            node.remove();
          } else {
            BI.Msg.toast(` ${data.name} 删除失败`, {level: 'error'});
          }
        });
      })

    }

    addCheckbox(el){
      function checkboxEvent(e){
        const node = e.target.closest('.ant-tree-treenode');
        const checked = window.nt.getNodeChecked(node);
        window.nt.dispatchEvent(node);
        window.nt.flushUp(el, checked);
        window.nt.flushDown(el, checked);
      }

      const titleEl = el.querySelector('.ant-tree-node-content-wrapper');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', checkboxEvent);
      checkbox.classList.add('yssBtn', 'cursor-pointer', 'bi-checkbox');
      titleEl.insertAdjacentElement('beforebegin', checkbox);
      window.nt.initCheckboxStatus(el);
    }
    addBatchDeleteButton(el){
      window.nt = new NodeTree();
      function batchDeleteButtonEvent(e){
        const container = e.target.closest('div:is(.fdl-components-file-tree, .prep-components-file-tree, .prep-pipeline-file-tree, .prep-components-custom-tree, .prep-pipeline-custom-tree)').querySelector('.ant-tree-list-holder');
        if(!container.classList.contains('enable-batch-delete')){
          container.classList.add('enable-batch-delete');
        } else if(container.querySelector('input.yssBtn.bi-checkbox:checked')){
          container.classList.add('batch-deleting');
          BI.Msg.confirm('确认删除', `确定要删除页面上勾选的项嘛?`, (choice) => {
            if(choice) window.nt.deleteAll();
            else container.classList.remove('batch-deleting');
          });
        } else {
          container.classList.remove('enable-batch-delete');
        }
      }

      const button = document.createElement('button');
      button.innerHTML = `<span role="img" class="anticon prep-add-circle-font"><i class="x-icon b-font horizon-center display-block" style="width: 16px; height: 16px; font-size: 16px;"></i></span> <span>批量删除</span>`;
      button.addEventListener('click', batchDeleteButtonEvent);
      button.classList.add('yssBtn', 'batch-delete-button', 'ant-btn', 'css-2qywul', 'css-10guqe', 'ant-btn-primary');
      el.insertAdjacentElement('beforeend', button);

      WFN.addCss('', '.*', `
button.yssBtn.batch-delete-button{ padding: 0 4px; margin: 0 4px; }
.dec-common-tabs > .bi-abs:not([style*="display: none"]):has(.enable-batch-delete):has(input.yssBtn.bi-checkbox:checked) button.yssBtn.batch-delete-button{ background-color: red; }
.dec-common-tabs > .bi-abs:not([style*="display: none"]):has(.enable-batch-delete):has(input.yssBtn.bi-checkbox:checked) button.yssBtn.batch-delete-button:hover{ background-color: dark-red; }
.dec-common-tabs > .bi-abs:not([style*="display: none"]):has(.batch-deleting) .ant-tree-treenode:has(input.yssBtn.bi-checkbox:checked){ display: none; }
.yssBtn.bi-checkbox { margin: auto 0; display: none; }
.enable-batch-delete .yssBtn.bi-checkbox { display: unset; }
`);
    }
  }

  window.nt = new NodeTree();

  WFN.add('数据开发页面 添加批量删除按钮', '.*', '.fdl-etl-file-tree > div > .header', window.nt.addBatchDeleteButton);
  WFN.add('数据开发任务 添加复选框      ', '.*', '.fdl-etl-file-tree .ant-tree-list-holder-inner > .ant-tree-treenode', window.nt.addCheckbox);

  WFN.add('数据管道页面 添加批量删除按钮', '.*', '.prep-pipeline-file-tree > .fdl-h-full > div > div.ant-row', window.nt.addBatchDeleteButton);
  WFN.add('数据管道页面 添加批量删除按钮', '.*', '.prep-pipeline-file-tree > div > .header', window.nt.addBatchDeleteButton);
  WFN.add('数据管道任务 添加复选框      ', '.*', '.prep-pipeline-file-tree .ant-tree-list-holder-inner > .ant-tree-treenode', window.nt.addCheckbox);

  WFN.add('数据服务页面 添加批量删除按钮', '.*', '.fdl-api-file-tree > div > .header', window.nt.addBatchDeleteButton);
  WFN.add('数据服务任务 添加复选框      ', '.*', '.fdl-api-file-tree .ant-tree-list-holder-inner > .ant-tree-treenode', window.nt.addCheckbox);


  console.log('======== XdemoFDL successfully injected ========\n', WFN);

})();


