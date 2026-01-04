// ==UserScript==
// @name        add Code
// @namespace   Violentmonkey Scripts
// @match       https://mp.weixin.qq.com/cgi-bin/appmsg
// @grant       none
// @version     1.0
// @author      jun95585 
// @description 微信公众号编辑图文消息在文章末尾增加代码段
// @downloadURL https://update.greasyfork.org/scripts/411077/add%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/411077/add%20Code.meta.js
// ==/UserScript==

window.onload = function(){ 
  var addCodeBtnHtml = '<div style="position: fixed; z-index: 999; bottom: 150px;left: 0;padding: 10px; background: #fff; box-shadow: 0 1px 4px 0 rgba(0,0,0,0.2); border-radius: 0 4px 4px 0;"><span id="addCode" class="btn btn_input btn_default r no_extra"><button type="button" onclick="showCodeDialog()">添加代码</button></span></div>'
  var addCodeDialogHtml = `
  <div
      id="codeDialog"
      style="
      display: none;
      position:fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0,0,0,0.5);
      z-index: 999;
  ">
      <div
          style="
              display: flex;
              flex-direction: column;
              margin: auto;
              width: 80%;
              height: 200px;
              font-size: 14px;
              padding: 8px 0;
              background: #fff;
              box-shadow: 0 1px 4px 0 rgba(0,0,0,0.1);
              border-radius: 4px;
          "
      >
          <textarea
              id="codeText"
              rows=6
              placeholder="请输入代码段"
              style="
                  margin: auto;
                  width: 80%;
                  font-size: 14px;
                  padding: 8px;
                  background: #fff;
                  border: 1px solid rgba(208, 208, 208, 0.9);
                  border-radius: 0 4px 4px  0;
              "
          ></textarea>
          <div style="display:flex; margin: auto;">
              <div style="margin-right: 20px;" class="btn btn_input btn_default r no_extra"><button id="addCodeDialogSubmit" type="button">添加至末尾</button></div>
              <div class="btn btn_input btn_default r no_extra"><button id="addCodeDialogClose" type="button">取消</button></div>
          </div>
      </div>
  </div>`

  // 图文编辑页面
  if (window.location.search.substring(1).includes(action=edit)) {
    document.body.innerHTML = document.body.innerHTML + (addCodeBtnHtml + addCodeDialogHtml)
  }
  
  var showCodeDialog = function showCodeDialog () {
    document.getElementById('codeDialog').style.display = 'flex';
  }

  var closeCodeDialog = function closeCodeDialog () {
    document.getElementById('codeText').innerHTML = '';
    
    document.getElementById('codeDialog').style.display = 'none';
  }
  
  document.getElementById('addCode').onclick = function(e){
    showCodeDialog();
    e.stopPropagation()
  };
  
  document.getElementById('addCodeDialogSubmit').onclick = function(e){
    var codeText = document.getElementById('codeText').value
    var editorDom = document.getElementById('ueditor_0')
    
    editorDom.contentWindow.document.getElementsByClassName('view')[0].innerHTML = 
      editorDom.contentWindow.document.getElementsByClassName('view')[0].innerHTML + 
      `<section>${codeText}</section>`
    
    closeCodeDialog();
    e.stoppropagation()
  };
  
  document.getElementById('addCodeDialogClose').onclick = function(e){
    closeCodeDialog();
    e.stoppropagation()
  };
}