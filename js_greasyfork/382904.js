// ==UserScript==
// @name        upload.cc简易控制脚本
// @namespace   https://greasyfork.org/users/14059
// @description upload.cc简易控制脚本,点击菜单弹出模拟框,输入输出保存的图片记录,自定义标签分类,备份等功能
// @include     https://upload.cc/*
// @author      setycyas
// @version     1.07
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/382904/uploadcc%E7%AE%80%E6%98%93%E6%8E%A7%E5%88%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/382904/uploadcc%E7%AE%80%E6%98%93%E6%8E%A7%E5%88%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function(){

  'use strict';
  console.log("upload.cc简易控制脚本运行开始");

  /****************************************
  ######## version 1.07 @2019-06-26 #######
  ######## 脚本正式开始 ###################
  ****************************************/
  
  /* Const & Global Vars */
  const GM_LAST_SET_LABEL = '_lastSetLabel' ; // 上次读取的标签名的GM记录名称
  var lastReadLabel_G = ''; // 最近读取的标签 
  
  /* ## Functions ## */
  
  /* json字符串变换,方便存放 */
  function _jsonReplace(srcString){
    let result = srcString.replace(/\n/g,''); // 消除换行
    result = result.replace(/\\n/g,''); // 消除换行符转义
    result = result.replace(/"\s*\[\s*\{/g,`[{`); // 把json可能的开头引号与空格去掉
    result = result.replace(/\}\s*\]\s*"/g,`}]`); // 把json可能的结尾引号与空格去掉
    result = result.replace(/\\"/g,`"`); // 消除引号转义
    return result;
  }
  
  /* 加入bootstrap组件 **/
  function addBootstrap(){
    let bootstrapLink = '<link href="https://lib.baomitu.com/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">';
    $(bootstrapLink).appendTo($('head'));
  }
  
  /* 加入模拟框相关html与命令 **/
  function addModal(){
    /* 加入模拟框html */
    let modalHtml = `
      <div id="modal" class = "modal fade hide"><div class="modal-content">
        <textarea id="modal-text" placeholder="这里读写记录(json格式)" style="width:1000px;height:120px;"></textarea><br>
        <label class="form-inline">
          <button id="getRecord" class="btn btn-sm btn-primary">获取当前记录</button>
          <button id="setRecord" class="btn btn-sm btn-danger">设定新记录</button>
          <button id="backup" class="btn btn-sm btn-warning">备份文本记录</button>
          <button id="backup_current" class="btn btn-sm btn-primary">快速备份当前</button>
          <button id="readBackup" class="btn btn-sm btn-info">读取备份标签</button>
          <button id="delBackup" class="btn btn-sm btn-danger">删除备份标签</button>
          <button id="listBackup" class="btn btn-sm btn-info">列出备份标签</button>
        </label>
        <label class="form-inline">
          <button id="readAllBackup" class="btn btn-sm btn-info">导出所有备份</button>
          <button id="closeModal" class="btn btn-sm btn-default">关闭模拟框</button>
        </label>
      </div></div>
    `;
    $(modalHtml).appendTo($('body'));
    /* 设定css */
    $('.modal-content').css({
      'margin':'80px',
      'padding-left':'100px',
      'padding-top':'30px',
      'text-align':'left',
      'background-color':'#e8e8e8'
    });
    $('#modal .btn').css({
      'width':'150px',
      'text-align':'center',
      'margin':'5px',
      'float':'right'
    });
    /* 设定按钮行为 */
    // 设定获取记录按钮的行为
    $('#getRecord').click(function(){
      $('#modal-text').val(window.localStorage['user_upload_history']);
      alert('获取当前记录成功!');
    });
    // 设定读取记录按钮的行为,读取后替换原来的记录,需要谨慎
    $('#setRecord').click(function(){
      let res = confirm("确定替换记录吗?这是个不可取消的操作,未保存原记录时请小心使用.");
      if(res == true){
        let text = $('#modal-text').val();
        try {
          text = _jsonReplace(text);
          let obj = JSON.parse(text);
          window.localStorage.setItem('user_upload_history',text);
          GM_setValue(GM_LAST_SET_LABEL, lastReadLabel_G);
          window.location.href = 'https://upload.cc/';
        } catch(e) {
          alert('输入有错误,不是json字符串');
        }   
      }
    });
    // 备份文本记录按钮
    $('#backup').click(function(){
      let backupLabel = prompt('备份当前文本框记录,请输入你设定的标签名.\n空标签则取消备份','');
      if(backupLabel) backupLabel = backupLabel.trim();
      if(backupLabel){
        let text = $('#modal-text').val();
        try {
          let obj = JSON.parse(text);
          text = _jsonReplace(text);
          GM_setValue(backupLabel, text);
          alert(`备份完成!标签为:${backupLabel}`);
        } catch(e) {
          alert('输入有错误,不是json字符串');
        }          
      }else{
        alert('没有进行备份');
      }
    });
    // 备份当前记录按钮todo
    $('#backup_current').click(function(){
      let lastLabel = GM_getValue(GM_LAST_SET_LABEL, 'None');
      if (lastLabel == 'None'){
        alert('没有最近读取标签,无法备份当前.请使用"获取当前记录"-"备份文本记录"进行备份');
      }
      let flag = confirm(`要把当前记录备份到标签 ${lastLabel} 吗?`);
      if (flag){
        GM_setValue(lastLabel, window.localStorage['user_upload_history']);
        alert(`成功备份到 ${lastLabel} !`);
      }
    });
    // 读取备份按钮
    $('#readBackup').click(function(){
      let backupLabel = prompt('请输入要读取的标签名.','');
      if(backupLabel) backupLabel = backupLabel.trim();
      let data = GM_getValue(backupLabel,'');
      if (backupLabel == GM_LAST_SET_LABEL)
        data = '';
      if(data){
        $('#modal-text').val(data.replace(/\n/g,'').replace(/\\n/g,''));
        lastReadLabel_G = backupLabel;
        alert('备份读取成功');
      }else{
        alert('读取备份失败,可能还没有该标签的备份资料.');
      }
    });
    // 删除备份按钮
    $('#delBackup').click(function(){
      let backupLabel = prompt('请输入要删除的备份标签名.','');
      if(backupLabel) backupLabel = backupLabel.trim();
      let backupList = GM_listValues();
      if($.inArray(backupLabel,backupList) > -1){
        GM_deleteValue(backupLabel);
        alert('删除备份标签: '+backupLabel);
      }else{
        alert('没有这个备份标签!');
      }
    });
    // 列出备份按钮
    $('#listBackup').click(function(){
      let backupList = GM_listValues().filter((val) => {return (val != GM_LAST_SET_LABEL)});
      let listLength = backupList.length;
      if(listLength > 0){
        let text = '### 最近设定的标签可能是: '+GM_getValue(GM_LAST_SET_LABEL, 'None')+' ###\n';
        text += backupList.join('\n');
        $('#modal-text').val(text);
        alert(`在模拟文本框中列出标签表,标签个数: ${listLength}`);
      }else{
        alert('目前没有备份标签');
      }
    });
    // 导出所有备份按钮
    $('#readAllBackup').click(function(){
      let backupList = GM_listValues().filter((val) => {return (val != GM_LAST_SET_LABEL)});
      let result = {};
      for(var i = 0;i < backupList.length;i++){
        let key = backupList[i];
        if (key == GM_LAST_SET_LABEL) 
          continue;
        let value = GM_getValue(key,'');
        result[key] = value;
      }
      let resultText = JSON.stringify(result);
      console.log(resultText);
      resultText = _jsonReplace(resultText);
      $('#modal-text').val(resultText);
    });
    // 关闭模拟框按钮
    $('#closeModal').click(function(){
      let modal = $('div#modal');
      // 由显示状态转变为隐藏状态
      modal.removeClass('show');
      modal.addClass('hide');
      modal.css({'display':'none'});
    });
  }
  
  /* 模拟框开关.由于中途加入的bootstrap有些问题,用官方的方法设定模拟框显隐有问题.只好用手动方法.
     关键是除了顶层的modal外,还有.modal-backdrop这个自动生成的div,要把两个层的'hide','show'class切换,还要手动切换display状态.
     但若完全不用官方脚本,则不需要考虑.modal-backdrop,因为不会生成这个层.不用官方的js还有个好处,就是不需要加载.
  **/
  function modalToggle(){
    let modal = $('div#modal');
    let modalClassList = modal[0].classList;
    // 看'hide'是否在class列表中,判断当前的显隐状态
    if($.inArray('hide',modalClassList) > -1) {
      // 由隐藏状态转变为显示状态
      modal.removeClass('hide');
      modal.addClass('show');
      modal.css({'display':'block'});
    }else{
      // 由显示状态转变为隐藏状态
      modal.removeClass('show');
      modal.addClass('hide');
      modal.css({'display':'none'});
    }
  }

  /* ## Main Script ## */
  GM_registerMenuCommand('模拟框开关',function(){
    // 若是首次开启,加载模拟框资源
    if($('div#modal').length == 0){
      addBootstrap();
      addModal();
    }
    // 切换模拟框显隐
    modalToggle();
  });

/****************************************
  ######## 脚本结束 ###################
  ****************************************/
})();
