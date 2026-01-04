// ==UserScript==
// @name         认定
// @namespace    http://tampermonkey.net/
// @version      2024-10-14
// @description  自己用
// @license MIT
// @author       dccc
// @match        https://dekt.chzu.edu.cn:11142/dekt/hdlc/hdsq/rd*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513525/%E8%AE%A4%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/513525/%E8%AE%A4%E5%AE%9A.meta.js
// ==/UserScript==


(function() {


const script = document.getElementById('jgpdActionArea')
// 设置 script 的内容
script.innerHTML = `<div class="layui-btn-container">
                                <button class="layui-btn layui-btn-sm" lay-event="add">
                                    <i class="fas fa-plus"></i> 单个添加
                                </button>
                                <button class="layui-btn layui-btn-sm" lay-event="batchAdd">
                                    <i class="fas fa-plus"></i> 批量添加
                                </button>
                                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="export">
                                    <i class="fas fa-file-export"></i> 导出
                                </button>
                                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="import">
                                    <i class="fas fa-file-import"></i> 导入
                                </button>
                                <button class="layui-btn layui-btn-sm layui-btn-danger" lay-event="batchDel">
                                    <i class="fas fa-minus-circle"></i> 删除
                                </button>
                                <button class="layui-btn layui-btn-sm layui-btn-danger" lay-event="clearImportData">
                                    <i class="fas fa-trash-alt"></i> 清空导入数据
                                </button>
                  </div>`
const my_input = document.createElement('input')
my_input.type = 'number'
document.body.appendChild(my_input)

const my_button = document.createElement('button');
my_button.textContent = '确定';
my_button.addEventListener('click', function () {
    const inputValue = parseInt(my_input.value);
    if (!isNaN(inputValue)) {
        window.hdid = inputValue;
    }
    else {
    }
})

document.body.appendChild(my_button);


// 创建一个新的 div 元素
const newDiv = document.createElement('div');
newDiv.innerHTML = `
    <div style="text-align: center;padding:10px 0;">
        <button style="width: 200px;" class="layui-btn layui-btn-normal" lay-submit="" lay-filter="mainSave">
            保存
        </button>
        <button style="width: 200px;" class="layui-btn" lay-submit="" lay-filter="mainSubmit">
            提交
        </button>
    </div>
`;

// 找到目标元素
const targetElement = document.querySelector('.layui-tab-brief[lay-filter="myTab"]');

// 在目标元素后面插入新创建的 div 元素
targetElement.parentNode.insertBefore(newDiv, targetElement.nextSibling);


})();