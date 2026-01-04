// ==UserScript==
// @name        新版新浪博客发博文脚本
// @namespace   https://greasyfork.org/users/14059
// @description 新版新浪博客发博文脚本,复制文本到模拟框,再按制作博文按钮制作博文内容
// @include     http://control.blog.sina.com.cn/admin/article/article_add.php?is_new_editor=1
// @include     http://control.blog.sina.com.cn/admin/article/article_edit.php?blog_id=*
// @author      setycyas
// @version     1.00
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/385065/%E6%96%B0%E7%89%88%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E5%8F%91%E5%8D%9A%E6%96%87%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/385065/%E6%96%B0%E7%89%88%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E5%8F%91%E5%8D%9A%E6%96%87%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 自制模拟框类, 版本:2019-05-14 version = 1.00
class SetycyasModal {
  
  constructor(z) {
    //初始变量
    this._z = z;
    this._modalDiv = document.createElement('div');
    this._modalMaskDiv = document.createElement('div');
    this._modalContentDiv = document.createElement('div');
    this._modalText = document.createElement('textarea');
    this._cmdButton = document.createElement('button');
    this._closeButton = document.createElement('button');

    //加入组件
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(this._modalDiv);
    this._modalDiv.appendChild(this._modalMaskDiv);
    this._modalDiv.appendChild(this._modalContentDiv);
    this._modalContentDiv.appendChild(this._modalText);
    this._modalContentDiv.appendChild(document.createElement('br'));
    this._modalContentDiv.appendChild(this._cmdButton);
    this._modalContentDiv.appendChild(this._closeButton);
    
    // 设定各种css
    // _modalDiv
    this._modalDiv.id = 'modal';
    this._modalDiv.style['z-index'] = this._z+'';
    this._modalDiv.style.display = 'none';
    this._modalDiv.style.position = 'fixed';
    this._modalDiv.style.top = '0px';
    this._modalDiv.style.left = '0px';
    this._modalDiv.style.width = '100%';
    this._modalDiv.style.height = '100%';
    // _modalMaskDiv   
    this._modalMaskDiv.id = 'modal-mask';
    this._modalMaskDiv.style.top = '0px';
    this._modalMaskDiv.style.left = '0px';
    this._modalMaskDiv.style.width = '100%';
    this._modalMaskDiv.style.height = '100%';
    this._modalMaskDiv.style['background-color'] = '#e8e8e8';
    this._modalMaskDiv.style.opacity = '0.9';
    // _modalContentDiv
    this._modalContentDiv.id = 'modal-content';
    this._modalContentDiv.style.position = 'fixed';
    this._modalContentDiv.style.top = '50px';
    this._modalContentDiv.style.left = '50px';
    this._modalContentDiv.style.width = '80%';
    this._modalContentDiv.style.padding = '50px';
    this._modalContentDiv.style['background-color'] = '#cccccc';
    this._modalContentDiv.style['border-radius'] = '15px';
    // _consoleText
    this._modalText.id = 'modal-text';
    this._modalText.style.width = '80%';
    this._modalText.style['margin-bottom'] = '10px';
    this._modalText.style['border-radius'] = '5px';
    this._modalText.value = 'This is modal-text,use value or $.val() to get it.';
    // _cmdButton
    this._cmdButton.id = "cmd-btn";
    this._cmdButton.textContent = 'CMD';
    this._cmdButton.style.padding = '5px';
    // _closeButton
    this._closeButton.id = "close-button";
    this._closeButton.textContent = 'Close';
    this._closeButton.style.padding = '5px';
    //设定事件
    this._cmdButton.onclick = ()=>{
      console.log('Default _cmdButton onclick!Now message is:');
      console.log(this.readModal());
    };
    this._closeButton.onclick = ()=>{
      this._modalDiv.style.display = 'none';
    };
  }
  
  /* 设置命令 */
  setCmd(f){
    this._cmdButton.onclick = f;
  }
  
  /* 读取字符串 */
  readModal(){
    return this._modalText.value;
  }
  
  /* 显示文本msg */
 showMessage(msg){
   this._modalText.value = msg;
 }
 
 /* 显示 */
 showModal(){
   this._modalDiv.style.display = 'block';
 }

 /* 隐藏 */
 hideModal(){
   this._modalDiv.style.display = 'none';
 }
 
}

(function(){

  'use strict';
   console.log("A gm script-新版新浪博客发博文脚本 is running!By setycyas");
  
  /****************************************
  ######## version 2019-6-20 & ver 1.00 ###########
  ######## 脚本正式开始 ###################
  ****************************************/

  /* ## Global Variables and Consts,Global Variables ends with '_G' ## */
  const MODAL = new SetycyasModal(1000);
  
  /* ## Functions ## */
  /* 设定模拟框的cmd按钮 */
  function setCmdButton(){
    let cmdBtn = document.getElementById('cmd-btn');
    cmdBtn.innerHTML = '制作博文';
    MODAL.setCmd(() => {
      let divEditor = document.getElementById('editor');
      let htmlList = [];
      let modalText = MODAL.readModal();
      modalText = modalText.replace(/ /g, '&nbsp;').replace(/</g, '&amp;lt;').replace(/>/g, '&amp;gt;');
      let lines = modalText.split('\n');
      for(let i = 0;i < lines.length;i++){
        htmlList.push('<p>'+lines[i]+'</p>');
      }
      divEditor.innerHTML = htmlList.join('');
    });
  }

  /* ## Main Script ## */
  setCmdButton();
  GM_registerMenuCommand('打开模拟框',()=>{
    MODAL.showModal();
  });
  
})();
/* ## 脚本结束 ## */