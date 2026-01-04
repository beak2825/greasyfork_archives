// ==UserScript==
// @name         打tag
// @namespace    自用于打tag工具
// @version      0.3
// @description  用来快捷打tag号使用
// @author       zhangyu
// @match        https://gitlab.int.zhumanggroup.com/soudian/frontend/*tags/new
// @icon         <$ICON$>
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454769/%E6%89%93tag.user.js
// @updateURL https://update.greasyfork.org/scripts/454769/%E6%89%93tag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoWrite(value) {
     const { version, type } = value;

       // 目前项目格式：
       // v5.5.4.7
       let resultVersion = '';
        let arr = version.split('.');
        // $("#date").datepicker();
        // 小版本，仅改变最后一位
        if(type === 'smallPatch') {
            arr[3] = Number(arr[3]) + 1;
            resultVersion = arr.join('.');
        } else if(type === 'newDatePatch') {
            // 新日期版本
            switch (arr.length) {
                case 4:
                    arr[2] = Number(arr[2]) + 1;
                    arr[3] = 0;
                    resultVersion = arr.join('.');
                    break;
                default:
                    resultVersion = version;
            }
        }
        $('#tag_name').val(`${resultVersion}`).trigger('change');
   }

    // Your code here...
     fetch(`https://gitlab.int.zhumanggroup.com/soudian/frontend/scp/-/tags`
  )
    .then((response) => response.text())
    .then((text) => {
        // console.log('text1===',text)
      // step1：提取第一个版本号的text
      const html = text.match(
          /<a class="item-title ref-name".*<\/a>/
      )[0];
       //  console.log('html1===',html)

      // step2：去掉样式代码，获取标签内容
      const content = html.replace(/<[^>]+>/g, '');

      // step3：根据不同项目初始化版本号
      const i = content.indexOf('-v');
      const version = content.substring(i+2);

      // 展示当前版本号
      const currentVersionDom = `<div class="form-group row"><label class="col-form-label col-sm-2" for="tag_name">上次Tag：</label><div class="col-sm-10"><div>${content}</div></div></div>`
      $('#new-tag-form').prepend(currentVersionDom);
      var myDate = new Date;
      var year = myDate.getFullYear(); //获取当前年
      var mon = myDate.getMonth() + 1; //获取当前月
      var date = myDate.getDate(); //获取当前日
      // step4：在页面中生成按钮并绑定事件
      const buttonGroup = `
      <span class="btn btn-success new-tag-btn" id="patch">仅填充小版本</span>
      <input type="date" id="dateInput"  name="bday"
       min=${year + '-' + mon + '-' + date}>`;
      const temporary = document.createElement('div');
      temporary.innerHTML = buttonGroup;

      $('.page-title').after(temporary);
      $("#dateInput").change(function(e){
         const value = e.target.value.replace(/-/g, '');
         const contentArr = content.split('-');
         const resultVersion = contentArr[0] + '-' + value + '-' + contentArr[2];
         autoWrite({version: resultVersion, type: 'newDatePatch'});
      });
      $('#patch').on('click', function() {
         autoWrite({ type: 'smallPatch', version: content })
      });
    });

    fetch(`https://gitlab.int.zhumanggroup.com/soudian/frontend/scp/-/branches`)
   .then((response) => response.text())
   .then((text) => {
        const regexp = /<a class="item-title str-truncated-100 ref-name gl-ml-3 qa-branch-name[^<]*>[^>]*<\/a>/g;
        const htmlArr = [...text.matchAll(regexp)];
        const html = htmlArr.find(e => {
          const content = e[0].replace(/<[^>]+>/g, '');
          return content.indexOf('release') !== -1;
        })
        if(!html) {
           alert('请检查Create from是否打正确哦');
        }
        // step2：去掉样式代码，获取标签内容
        const content = html[0].replace(/<[^>]+>/g, '');
        const btnClassDOM = document.querySelector('.dropdown-menu-toggle.wide.js-branch-select.monospace');
        btnClassDOM.style.width = '220px';

        const inputDOM = document.getElementsByName('ref')[0];
        const btnDom = document.getElementsByClassName('dropdown-toggle-text')[0];
        inputDOM.value = content;
        btnDom.innerHTML = content;
    });
})();