// ==UserScript==
// @name         igxe自动化开箱!
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  右上角会出现一个小框，直接填入开箱次数，点击开箱即可，无需点击快速模式（自动点击），如果没有运行成功请刷新页面！！！
// @author       Senjoke
// @match        https://www.igxe.cn/tools/case/detail-*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473243/igxe%E8%87%AA%E5%8A%A8%E5%8C%96%E5%BC%80%E7%AE%B1%21.user.js
// @updateURL https://update.greasyfork.org/scripts/473243/igxe%E8%87%AA%E5%8A%A8%E5%8C%96%E5%BC%80%E7%AE%B1%21.meta.js
// ==/UserScript==
/*
 * @Author: 白发咏人 2427233390@qq.com
 * @Date: 2023-08-17 11:40:19
 * @LastEditors: 白发咏人 2427233390@qq.com
 * @LastEditTime: 2023-08-17 14:33:38
 * @FilePath: \undefinedc:\Users\SenJoke\Desktop\opencase.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function executeCodeWithInterval(iterations) {
  async function executeIteration() {

    if (i-1 > iterations || fristTime == -1) {//循环条件
      if (i-1 != iterations) console.log("执行了"+(i-1)+"次，执行完毕！");
      i=1;
      fristTime=1;
      return;
    }
    console.log("正在执行第"+i+"次");

    if (fristTime==0){//快速模式开关
      // 获取要判断状态的标签元素
      label = document.querySelector('label[for="c1"]');

      // 检查是否存在 ::after 伪元素
      var hasAfterPseudoElement = window.getComputedStyle(label, '::after').content !== 'none';

      // 根据是否存在 ::after 伪元素判断状态
      if (hasAfterPseudoElement) {
        //console.log('标签处于快速模式');
        fristTime=1;
      } else {
        //console.log('标签不处于快速模式');
        fastbnt = document.getElementById('c1');
        fastbnt.click();
      }
    }

    if (i == 1){//第一次执行
      button = document.getElementsByClassName('btn btn-start')[0];//开箱按钮
      button.click();
      await sleep(500);

      var scrollerEndBottom = document.querySelector('.scoller-end-bottom');//关闭按钮
      var childDivs = scrollerEndBottom.querySelectorAll('div');
      var secondDiv = childDivs[1];
      var p = secondDiv.querySelector('p');
      var spans = p.querySelectorAll('span');
      thirdSpan = spans[2];

      thirdSpan.click();

      i++;
      await sleep(800);
    }else{
        button.click();
        await sleep(400);
        thirdSpan.click();
        i++;
        await sleep(900);
    }
    executeIteration();
  }

  await executeIteration();
}


//创建窗口
function genDiv(){
    // 创建跟随滚动条移动的DIV标签
    var floatingDiv = document.createElement('div');
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.top = '0';
    floatingDiv.style.right = '0';
    floatingDiv.style.zIndex = '9999';
    floatingDiv.style.backgroundColor = '#fff';
    floatingDiv.style.padding = '10px';
    floatingDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';

    // 创建表单元素
    var form = document.createElement('form');
    floatingDiv.appendChild(form);
    floatingDiv.id="opencaseForm";

    // 创建输入框
    var input = document.createElement('input');
    input.id="openTimes";
    input.type = 'text';
    input.placeholder = '输入开箱次数';
    input.style.color="#434343";
    form.appendChild(input);

    // 创建按钮
    var button = document.createElement('button');
    button.id="opencaseBnt";
    button.textContent = '开箱';
    button.style.color="#434343";
    button.style.border="1px solid #cccccc";
    button.style.padding="5px 10px";
    form.appendChild(button);

    //创建停止按钮
    var button2 = document.createElement('button');
    button2.id="stopBnt";
    button2.textContent = '停止';
    button2.style.color="#434343";
    button2.style.border="1px solid #cccccc";
    button2.style.padding="5px 10px";
    form.appendChild(button2);

    // 将DIV标签添加到文档中
    document.body.appendChild(floatingDiv);

    //获取表单元素
    var form_get = document.getElementById('opencaseForm');
    var input_get = form.querySelector('input');


    button2.addEventListener("click", function(event) {
      event.preventDefault();
      // 在这里编写按钮点击后要执行的代码
      fristTime = -1;
    });
    // 监听按钮的点击事件
    button.addEventListener('click', function(event) {
      event.preventDefault(); // 阻止表单的默认提交行为
      i=1;
      var inputValue = input_get.value; // 获取输入框的值
      // 在这里执行您想要的功能，可以使用 inputValue 值进行处理
      console.log("执行"+inputValue+"次");
      //console.log('输入框的值：', inputValue); // 示例：打印输入框的值到控制台
      executeCodeWithInterval(inputValue-1);//执行开箱。
    });
}
var button,thirdSpan,fastbnt,i=1,fristTime=0,label;//全局变量定义
genDiv();
// 调用方法并指定需要执行的次数
 // 示例：执行 5 次
