// ==UserScript==
// @name tr-check
// @namespace http://tampermonkey.net/
// @version 0.3
// @description 该脚本会在tr的工具栏最后添加一个`勾选无效种子`的按钮，该按钮可以在tr中自动勾选tracker异常（tracker信息包含`exists`，`registered`的种子）的种子
// @author alkali
// @license MIT
// @match http://192.168.124.17:1452/transmission/web/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/483766/tr-check.user.js
// @updateURL https://update.greasyfork.org/scripts/483766/tr-check.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let keywords = ['exists', 'registered']

  const tr = {
    do() {
        let arr = $('.datagrid-view2 .datagrid-row').find('.iconlabel').filter((index, item) => {
            let msg = $(item).attr('title').split('信息:')[1]?.trim()
            console.log($(item).text(), '-', msg)
            return msg && keywords.some((item) => msg.includes(item))
        })
        if(arr.length === 0){
            $.messager.show({
	        title:'提示',
	        msg:'当前页没有异常种子',
	        timeout:5000,
	        showType:'slide'
        });
        }else{
            arr.parent().parent().parent().find('input[type="checkbox"]').click()
        }
    },

    init() {
        $('#m_toolbar').append(`<a id="action-btn" href="javascript:void(0);" class="easyui-linkbutton l-btn l-btn-small l-btn-plain" data-options="" group="" title="勾选无效种子，只会勾选tracker信息包含“exists”“registered”的种子其余需要靠自己筛选"><span class="l-btn-left l-btn-icon-left"><span class="">勾选无效种子</span></span></a>`)

        $('#action-btn').click(()=>{
            this.do()
        })
    }
  }

  tr.init()
})();
