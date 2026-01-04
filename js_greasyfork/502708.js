// ==UserScript==
// @name         数据填充脚本+2.0数据填充记忆版PLUS重新改写
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  数据填充+记忆
// @author       XP
// @match        http://117.68.0.190:9090/stj-web/index/inspect/report/toReportInput.do?param=d29y*
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/502708/%E6%95%B0%E6%8D%AE%E5%A1%AB%E5%85%85%E8%84%9A%E6%9C%AC%2B20%E6%95%B0%E6%8D%AE%E5%A1%AB%E5%85%85%E8%AE%B0%E5%BF%86%E7%89%88PLUS%E9%87%8D%E6%96%B0%E6%94%B9%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/502708/%E6%95%B0%E6%8D%AE%E5%A1%AB%E5%85%85%E8%84%9A%E6%9C%AC%2B20%E6%95%B0%E6%8D%AE%E5%A1%AB%E5%85%85%E8%AE%B0%E5%BF%86%E7%89%88PLUS%E9%87%8D%E6%96%B0%E6%94%B9%E5%86%99.meta.js
// ==/UserScript==

function loadScript(url, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  if (typeof callback !== 'undefined') {
    // 对于老式浏览器
    if (script.readyState) {  // IE
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {  // 其他浏览器
      script.onload = function () {
        callback();
      };
    }
  }
  script.src = url;
  document.head.appendChild(script);
}

/*
<div style="margin-bottom: 2px;">
      <label for="input14.1" style="display: inline-block; width: 90px;">15钢带：</label>
      <input type="text" id="input15.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input15.2" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

    */



// 使用上述函数加载jQuery
loadScript('https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js', function () {
  // jQuery已加载成功，现在可以在此处安全地使用$符号
  $(document).ready(function () {
  console.log('我的脚本加载了');
      // 创建一个容器用于放置单选框和按钮
    const container = document.createElement('div');
    container.id = 'radio-container';
    container.style.position = 'fixed';
    container.style.bottom = '30px';
    container.style.left = '10px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid black';
    container.style.padding = '10px';
//    container.style.flexDirection = 'column'; // 垂直方向排列；
    container.style.display = 'grid'; // 使用Flexbox布局
    container.style.zIndex = 10000; // 确保在最上层显示

    //布局插件按钮的
    const formBox4 = document.createElement('div');
    formBox4.style.backgroundColor = '#f9f9f9';
    formBox4.style.padding = '2px';
    formBox4.style.border = '1px solid #ccc';
//    formBox.style.display = 'flex'; // 使用Flexbox布局
    formBox4.style.display = 'grid'; // 使用网格布局
    formBox4.style.gridTemplateColumns = '100px 100px 100px 100px'; // 分成两列
    formBox4.style.gridGap = '0.10px'; // 设置网格间距
    formBox4.style.flexDirection = 'column'; // 垂直方向排列
    formBox4.style.alignItems = 'flex-start'; // 元素水平居左对齐

     function ZT() {
    
  // 布局垂直梯定期检验 创建一个包含多个小方框和保存按钮的方框
  const formBoxZD = document.createElement('div');
      formBoxZD.style.backgroundColor = '#f9f9f9';
      formBoxZD.style.padding = '2px';
      formBoxZD.style.border = '1px solid #ccc';
      formBoxZD.style.display = 'flex'; // 使用Flexbox布局
      formBoxZD.style.display = 'grid'; // 使用网格布局
      formBoxZD.style.gridTemplateColumns = '200px 200px'; // 分成两列
      formBoxZD.style.gridGap = '0.10px'; // 设置网格间距
      formBoxZD.style.flexDirection = 'column'; // 垂直方向排列
      formBoxZD.style.alignItems = 'flex-start'; // 元素水平居左对齐
      formBoxZD.innerHTML = `
    <div style="margin-bottom: 2px;">
      <label for="input0" style="display: inline-block; width: 90px;">检验日期：</label>
      <input type="text" id="input0" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="input0.2" style="display: inline-block; width: 200px;">下次检测日：</label>
      <select id="input40" style="width: 30%; margin-left: 0.1px;">
      <option value="option1">检验</option>
      <option value="option2">检测</option>
      </select>
      <input type="text" id="input0.2" placeholder="" style="width: 50%; margin-left: 1px;">

    </div>

    <div style="margin-bottom: 2px;">
      <label for="input1" style="display: inline-block; width: 90px;">安全管理员：</label>
      <input type="text" id="input1" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="input2" style="display: inline-block; width: 90px;">管理手机：</label>
      <input type="text" id="input2" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="inputWB" style="display: inline-block; width: 90px;">维保公司：</label>
      <input type="text" id="inputWB" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="input3" style="display: inline-block; width: 90px;">维保人员：</label>
      <input type="text" id="input3" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="input3.1" style="display: inline-block; width: 90px;">维保电话：</label>
      <input type="text" id="input3.1" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
     <div style="margin-bottom: 2px;">
      <label for="input3.2" style="display: inline-block; width: 90px;">制动试验：</label>
      <input type="text" id="input3.2" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    </div>
     <div style="margin-bottom: 2px;">
      <label for="input4" style="display: inline-block; width: 90px;">4缓冲器：</label>
      <input type="text" id="input4" placeholder="" style="width: 20%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="input5" style="display: inline-block; width: 90px;">5接地保护：</label>
      <input type="text" id="input5" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="input6" style="display: inline-block; width: 90px;">6旁路：</label>
      <input type="text" id="input6.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input6.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input6.3" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input6.4" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="input7" style="display: inline-block; width: 90px;">7制动监测：</label>
      <input type="text" id="input7" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="input8" style="display: inline-block; width: 90px;">8紧急电动：</label>
      <input type="text" id="input8.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input8.2" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="input9" style="display: inline-block; width: 90px;">9动态测试：</label>
      <input type="text" id="input9" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="input11" style="display: inline-block; width: 90px;">11主机停止：</label>
      <input type="text" id="input11" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="input12" style="display: inline-block; width: 90px;">12鼓式制动：</label>
      <input type="text" id="input12" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="input13" style="display: inline-block; width: 90px;">13盘车：</label>
      <input type="text" id="input13.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input13.2" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>


    <div style="margin-bottom: 2px;">
      <label for="input14" style="display: inline-block; width: 90px;">14钢丝绳：</label>
      <input type="text" id="input14.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input14.2" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

   <div style="margin-bottom: 2px;">
      <label for="input15" style="display: inline-block; width: 90px;">15钢带：</label>
      <input type="text" id="input15.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input15.2" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>


    <div style="margin-bottom: 2px;">
      <label for="input16" style="display: inline-block; width: 90px;">16端部固定：</label>
      <input type="text" id="input16" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="input17" style="display: inline-block; width: 90px;">17伸长保护：</label>
      <input type="text" id="input17" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="input18" style="display: inline-block; width: 90px;">18反绳轮：</label>
      <input type="text" id="input18.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input18.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input18.3" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input18.4" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>


    <div style="margin-bottom: 2px;">
      <label for="input19" style="display: inline-block; width: 90px;">19安全窗：</label>
      <input type="text" id="input19" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="input24.1" style="display: inline-block; width: 90px;">24门间隙：</label>
      <input type="text" id="input24.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input24.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input24.3" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input24.4" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="input27" style="display: inline-block; width: 90px;">27重块：</label>
      <input type="text" id="input27" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="input33" style="display: inline-block; width: 90px;">33限速器自：</label>
      <input type="text" id="input33" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="input37.1" style="display: inline-block; width: 90px;">37意外移：</label>
      <input type="text" id="input37.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input37.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input37.3" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="input37.4" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>


  `;

// 创建并插入保存按钮
        const saveButton = document.createElement('button');
        saveButton.id = "saveButton";
        saveButton.textContent = '保存数据';
        //toggleButton.style.display = 'inline-block';
        saveButton.style.width = "80px";
        saveButton.style.height = "20px";
        saveButton.style.align = "center";

// 创建并插入保存按钮
        const clearButton = document.createElement('button');
        clearButton.id = "clearButton";
        clearButton.textContent = '清理数据';
        //toggleButton.style.display = 'inline-block';
        clearButton.style.width = "80px";
        clearButton.style.height = "20px";
        clearButton.style.align = "center";

//布局不同电梯名称的
    const formBoxMc = document.createElement('div');
    formBoxMc.style.backgroundColor = '#f9f9f9';
    formBoxMc.style.padding = '2px';
    formBoxMc.style.border = '1px solid #ccc';
//   DTMCformBox.style.display = 'flex'; // 使用Flexbox布局
    formBoxMc.style.display = 'grid'; // 使用网格布局
//    MCformBox.style.gridTemplateColumns = '100px 100px 100px 100px'; // 分成两列
    formBoxMc.style.gridGap = '0.10px'; // 设置网格间距
    formBoxMc.style.flexDirection = 'column'; // 垂直方向排列
    formBoxMc.style.alignItems = 'flex-start'; // 元素水平居左对齐

//布局插件按钮的
    const formBox2 = document.createElement('div');
    formBox2.style.backgroundColor = '#f9f9f9';
    formBox2.style.padding = '2px';
    formBox2.style.border = '1px solid #ccc';
//    formBox.style.display = 'flex'; // 使用Flexbox布局
    formBox2.style.display = 'grid'; // 使用网格布局
    formBox2.style.gridTemplateColumns = '100px 100px 100px 100px'; // 分成两列
    formBox2.style.gridGap = '0.10px'; // 设置网格间距
    formBox2.style.flexDirection = 'column'; // 垂直方向排列
    formBox2.style.alignItems = 'flex-start'; // 元素水平居左对齐

//布局保存清除按钮的
    const formBox3 = document.createElement('div');
    formBox3.style.backgroundColor = '#f9f9f9';
    formBox3.style.padding = '2px';
    formBox3.style.border = '1px solid #ccc';
//    formBox.style.display = 'flex'; // 使用Flexbox布局
    formBox3.style.display = 'grid'; // 使用网格布局
    formBox3.style.gridTemplateColumns = '150px 150px 150px  '; // 分成两列
    formBox3.style.gridGap = '0.10px'; // 设置网格间距
    formBox3.style.flexDirection = 'column'; // 垂直方向排列
    formBox3.style.alignItems = 'flex-start'; // 元素水平居左对齐



//style="width: 80px; height: 20px;"
// 插入您提供的按钮代码
  const button1 = document.createElement("button");
    button1.id = "id001";
    button1.textContent = "直梯超15年 5接地保护 14钢丝绳X  16端部固定 24层门间隙";
    button1.style.width = "80px";
    button1.style.height = "80px";
    button1.style.align = "center";
    button1.onclick = function () {
      console.log('点击了按钮');
          button1.style.backgroundColor = 'red';
          button2.style.backgroundColor = '';
//          document.getElementById('17222411351547797').lastElementChild.innerHTML='/';//下次检测日期
          document.getElementById('1700887220897d0b').lastElementChild.innerHTML='√';//5接地保护
          document.getElementById('1702639220238f5df').lastElementChild.innerHTML='√';//14 钢丝绳1 span
          document.getElementById('1700709338998a55').lastElementChild.innerHTML='√';//14 钢丝绳2
          document.getElementById('1700887671315b62').lastElementChild.innerHTML='√';//16 端部固定
          document.getElementById('17015040141996243').lastElementChild.innerHTML='6';//24 门间隙1≤6
          document.getElementById('1702641013571d39a').lastElementChild.innerHTML='28';//24 门间隙2≤30
          document.getElementById('17007072568871c6').lastElementChild.innerHTML='√';//24 门间隙1
          document.getElementById('1702640903045fe9a').lastElementChild.innerHTML='√';//24 门间隙2

          document.getElementById('input0.2').value =document.getElementById('17222411351547797').lastElementChild.innerHTML;
          document.getElementById('input5').value ='√';
          document.getElementById('input14.1').value ='√';
          document.getElementById('input14.2').value ='√';
          document.getElementById('input16').value ='√';
          document.getElementById('input24.1').value ='6';
          document.getElementById('input24.2').value ='28';
          document.getElementById('input24.3').value ='√';
          document.getElementById('input24.4').value ='√';

         //通用扩展
       document.getElementById('17014878067399fe6').lastElementChild.innerHTML='/';//备注栏2 id
       document.getElementById('17041912859544faf').lastElementChild.innerHTML='/';//备注栏3 id
       document.getElementById('170264247697664b1').lastElementChild.lastElementChild.innerHTML='8';
       document.getElementById('1702642476978611b').lastElementChild.lastElementChild.innerHTML='/';//平衡系数31 17015040141996243
       document.getElementById('1701504018295d212').lastElementChild.innerHTML='/';//平衡系数31
       document.getElementById('17289958185640c6e').lastElementChild.innerHTML='/';//电压


          return;
        };

    const button2 = document.createElement("button"); //创建一个input对象（提示框按钮）
     button2.id = "id001";
     button2.textContent = "未超15年梯 5接地保护 14钢丝绳X  16端部固定 24层门间隙 ";
     button2.style.width = "80px";
     button2.style.height = "80px";
     button2.style.align = "center";

	//绑定按键点击功能
	button2.onclick = function (){

		console.log('点击了按键');
          button2.style.backgroundColor = 'red'; // 点击按钮后将按钮颜色改为红色
          button1.style.backgroundColor = '';
          document.getElementById('1700887220897d0b').lastElementChild.innerHTML='/';//5 接地保护
          document.getElementById('1702639220238f5df').lastElementChild.innerHTML='/';//14 钢丝绳1 span
          document.getElementById('1700709338998a55').lastElementChild.innerHTML='/';//14 钢丝绳2
          document.getElementById('1700887671315b62').lastElementChild.innerHTML='/';//16 端部固定
          document.getElementById('17015040141996243').lastElementChild.innerHTML='/';//24 门间隙1≤6
          document.getElementById('1702641013571d39a').lastElementChild.innerHTML='/';//24 门间隙2≤30
          document.getElementById('17007072568871c6').lastElementChild.innerHTML='/';//24 门间隙1
          document.getElementById('1702640903045fe9a').lastElementChild.innerHTML='/';//24 门间隙2

//          document.getElementById('input0.2').value =document.getElementById('17222411351547797').lastElementChild.innerHTML;//下次检测日期
          document.getElementById('input5').value ='/';
          document.getElementById('input14.1').value ='/';
          document.getElementById('input14.2').value ='/';
          document.getElementById('input16').value ='/';
          document.getElementById('input24.1').value ='/';
          document.getElementById('input24.2').value ='/';
          document.getElementById('input24.3').value ='/';
          document.getElementById('input24.4').value ='/';

         //通用扩展
       document.getElementById('17014878067399fe6').lastElementChild.innerHTML='/';//备注栏2 id
       document.getElementById('17041912859544faf').lastElementChild.innerHTML='/';//备注栏3 id
       document.getElementById('170264247697664b1').lastElementChild.lastElementChild.innerHTML='8';
       document.getElementById('1702642476978611b').lastElementChild.lastElementChild.innerHTML='/';//平衡系数31 17015040141996243
       document.getElementById('1701504018295d212').lastElementChild.innerHTML='/';//平衡系数31
       document.getElementById('17289958185640c6e').lastElementChild.innerHTML='/';//电压

		return;
	};

    let clickCount3 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button3 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button3.id = "id001";
	button3.textContent = "新标准直梯 6旁路装置 7制动检测 37意外移动 ";
	button3.style.width = "80px";
	button3.style.height = "80px";
	button3.style.align = "center";
	button3.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount3++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount3 % 2 === 1) {
          button3.style.backgroundColor = 'red';
          button3.textContent = "新标准直梯  6旁路装置 7制动检测 37意外移动 是";
          $('#17026367891076a46>#1700887220897d51>span.widget-content').text('√');//6 旁路
          $('#17026367891070e74>#17008872208971d0>span.widget-content').text('√');//6 旁路
          $('#1702636789107fe21>#1700887220897c04>span.widget-content').text('√');//6 旁路
          $('#17026367891075fa7>#170088722089843f>span.widget-content').text('√');//6 旁路
          $('#1702637271087a233>#17014953212526364>span.widget-content').text('√');//7 制动器监测
          $('#1713594974152179e>#1700887253052098>span.widget-content').text('√');// 37 意外移动1 1713594974152179e 170088725305269b
          $('#1713594974152ef0e>#1702644130868d3fc>span.widget-content').text('√');//37 意外移动2 1713594974152ef0e 1702644130868d3fc
          $('#1713594974152c607>#1702644130870e7e2>span.widget-content').text('√');//37 意外移动3
          $('#1713594974152540d>#170264413087205ba>span.widget-content').text('√');//37 意外移动4
          document.getElementById('input6.1').value ='√';
          document.getElementById('input6.2').value ='√';
          document.getElementById('input6.3').value ='√';
          document.getElementById('input6.4').value ='√';
          document.getElementById('input7').value ='√';
          document.getElementById('input37.1').value ='√';
          document.getElementById('input37.2').value ='√';
          document.getElementById('input37.3').value ='√';
          document.getElementById('input37.4').value ='√';
      } else {
          button3.style.backgroundColor = 'green';
          button3.textContent = "新标准直梯  6旁路装置 7制动检测 37意外移动 否";
          $('#17026367891076a46>#1700887220897d51>span.widget-content').text('/');//6 旁路
          $('#17026367891070e74>#17008872208971d0>span.widget-content').text('/');//6 旁路
          $('#1702636789107fe21>#1700887220897c04>span.widget-content').text('/');//6 旁路
          $('#17026367891075fa7>#170088722089843f>span.widget-content').text('/');//6 旁路
          $('#1702637271087a233>#17014953212526364>span.widget-content').text('/');//7 制动器监测
          $('#1713594974152179e>#1700887253052098>span.widget-content').text('/');// 37 意外移动1 1713594974152179e 170088725305269b
          $('#1713594974152ef0e>#1702644130868d3fc>span.widget-content').text('/');//37 意外移动2 1713594974152ef0e 1702644130868d3fc
          $('#1713594974152c607>#1702644130870e7e2>span.widget-content').text('/');//37 意外移动3
          $('#1713594974152540d>#170264413087205ba>span.widget-content').text('/');//37 意外移动4
          document.getElementById('input6.1').value ='/';
          document.getElementById('input6.2').value ='/';
          document.getElementById('input6.3').value ='/';
          document.getElementById('input6.4').value ='/';
          document.getElementById('input7').value ='/';
          document.getElementById('input37.1').value ='/';
          document.getElementById('input37.2').value ='/';
          document.getElementById('input37.3').value ='/';
          document.getElementById('input37.4').value ='/';
        }
		return;
	};

      let clickCount4 = 0;// 创建一个变量来跟踪按钮的点击次数
      const button4 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button4.id = "id001";
	button4.textContent = "无机房项目 8紧急电动 9动态测试 11主机停止 13无手盘车33限自复位 ";
	button4.style.width = "80px";
	button4.style.height = "100px";
	button4.style.align = "center";

	//绑定按键点击功能
	button4.onclick = function (){
		console.log('点击了按键');
      // 每次点击更新点击次数
      clickCount4++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount4 % 2 === 1) {
          button4.style.backgroundColor = 'red';
          button4.textContent = "无机房项目 8紧急电动 9动态测试 11主机停止 13无手盘车33限自复位 ";
          $('#1700887253052c45>span.widget-content').text('√');//8 紧急电动
          $('#1702637397596a1c8>span.widget-content').text('√');//8 紧急电动
          $('#1702637271088688c>#1700887253052388>span.widget-content').text('√');//9 紧急操作与动态测试
          $('#17026372710884f0d>#17008872530524c8>span.widget-content').text('√');//11 驱动主机停止装置
          document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='/'//13盘车（3）
          document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='/'//13盘车（4）
        $('#1713778561163c9fc>#170088725305269b>span.widget-content').text('/');//33 限速器自动复位170088725305269b
          document.getElementById('input8.1').value ='√';
          document.getElementById('input8.2').value ='√';
          document.getElementById('input9').value ='√';
          document.getElementById('input11').value ='√';
          document.getElementById('input13.1').value ='/';
          document.getElementById('input13.1').style.color = 'red';
          document.getElementById('input13.2').value ='/';
          document.getElementById('input33').value ='/';
      } else {
          button4.style.backgroundColor = 'green';
          button4.textContent = "有机房项目 8紧急电动 9动态测试 11主机停止 13无手盘车33限自复位 ";
          $('#1700887253052c45>span.widget-content').text('/');//8 紧急电动
          $('#1702637397596a1c8>span.widget-content').text('/');//8 紧急电动
          $('#1702637271088688c>#1700887253052388>span.widget-content').text('/');//9 紧急操作与动态测试
          $('#17026372710884f0d>#17008872530524c8>span.widget-content').text('/');//11 驱动主机停止装置
          document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='<span style="color: red;">√</span>';//13盘车（3）
          document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.style.color = 'red';
          document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='√';//13盘车（4）
        $('#1713778561163c9fc>#170088725305269b>span.widget-content').text('√');//33 限速器自动复位170088725305269b
          document.getElementById('input8.1').value ='/';
          document.getElementById('input8.2').value ='/';
          document.getElementById('input9').value ='/';
          document.getElementById('input11').value ='/';
          document.getElementById('input13.1').value ='√';
          document.getElementById('input13.1').style.color = '';
          document.getElementById('input13.2').value ='√';
          document.getElementById('input33').value ='√';
        }
		return;

	};


    let clickCount5 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button5 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button5.id = "id001";
	button5.textContent = "8紧急 ";
	button5.style.width = "80px";
	button5.style.height = "20px";
	button5.style.align = "center";
	//绑定按键点击功能
	button5.onclick = function (){
		console.log('点击了按键');
      // 每次点击更新点击次数
      clickCount5++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount5 % 2 === 1) {
          button5.style.backgroundColor = 'red';
          button5.textContent = "8有紧急";
          $('#1700887253052c45>span.widget-content').text('√');//8 紧急电动
          $('#1702637397596a1c8>span.widget-content').text('√');//8 紧急电动
          document.getElementById('input8.1').value ='√';
          document.getElementById('input8.2').value ='√';
      } else {
          button5.style.backgroundColor = 'green';
          button5.textContent = "8无紧急";
          $('#1700887253052c45>span.widget-content').text('/');//8 紧急电动
          $('#1702637397596a1c8>span.widget-content').text('/');//8 紧急电动
          document.getElementById('input8.1').value ='/';
          document.getElementById('input8.2').value ='/';
        }
		return;
	};
    let clickCount6 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button6 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button6.id = "id001";
	button6.textContent = "12非鼓式 ";
	button6.style.width = "80px";
	button6.style.height = "20px";
	button6.style.align = "center";

	//绑定按键点击功能
	button6.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount6++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount6 % 2 === 1) {
          button6.style.backgroundColor = 'red';
          button6.textContent = "12非鼓式";
          $('#17026372710898779>#170088725305217c>span.widget-content').text('/');//12鼓式制动器
          document.getElementById('input12').value ='/';
      } else {
          button6.style.backgroundColor = 'green';
          button6.textContent = "12鼓式";
          $('#17026372710898779>#170088725305217c>span.widget-content').text('√');//12鼓式制动器
          document.getElementById('input12').value ='√';
        }
		return;
	};
    let clickCount7 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button7 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button7.id = "id001";
	button7.textContent = "13盘车 ";
	button7.style.width = "80px";
	button7.style.height = "20px";
	button7.style.align = "center";

	//绑定按键点击功能
	button7.onclick = function (){

      console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount7++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount7 % 2 === 1) {
          button7.style.backgroundColor = 'red';
          button7.textContent = "13无盘车";
          document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='/'//13盘车（3）
          document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='/'//13盘车（4）
          document.getElementById('input13.1').value ='/';
          document.getElementById('input13.2').value ='/';
      } else {
          button7.style.backgroundColor = 'green';
          button7.textContent = "13有盘车";
          document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='√'//13盘车（3）
          document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='√'//13盘车（4）
          document.getElementById('input13.1').value ='√';
          document.getElementById('input13.2').value ='√';
        }
		return;
	};
    let clickCount8 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button8 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button8.id = "id001";
	button8.textContent = "19安全窗 ";
	button8.style.width = "80px";
	button8.style.height = "20px";
	button8.style.align = "center";
	button8.onclick = function (){
        console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount8++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount8 % 2 === 1) {
          button8.style.backgroundColor = 'red';
          button8.textContent = "19有窗";
          $('#17026400082690255>#170263999535843a9>span.widget-content').text('√');//19 安全窗 170088725305269b
          document.getElementById('input19').value ='√';
      } else {
          button8.style.backgroundColor = 'green';
          button8.textContent = "19无窗";
          $('#17026400082690255>#170263999535843a9>span.widget-content').text('/');//19 安全窗 170088725305269b
          document.getElementById('input19').value ='/';
        }
		return;
	};

    let clickCount9 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button9 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button9.id = "id001";
	button9.textContent = "27重锤 ";
	button9.style.width = "80px";
	button9.style.height = "20px";
	button9.style.align = "center";
	button9.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount9++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount9 % 2 === 1) {
          button9.style.backgroundColor = 'red';
          button9.textContent = "27有重锤";
          $('#1706319611211eddb>#170088725305269b>span.widget-content').text('√');//27 有重锤 170088725305269b
          document.getElementById('input27').value ='√';
      } else {
          button9.style.backgroundColor = 'green';
          button9.textContent = "27无重锤";
          $('#1706319611211eddb>#170088725305269b>span.widget-content').text('/');//27 无重锤 170088725305269b
          document.getElementById('input27').value ='/';
        }
		return;
	};

      let clickCount10 = 0;// 创建一个变量来跟踪按钮的点击次数
      const button10 = document.createElement("button"); //创建一个input对象（提示框按钮）
      button10.id = "id001";
      button10.textContent = "4缓冲器 ";
      button10.style.width = "80px";
      button10.style.height = "20px";
      button10.style.align = "center";
      button10.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount10++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount10 % 2 === 1) {
          button10.style.backgroundColor = 'red';
          button10.textContent = "4蓄能";
          $('#170263678910675f3>#1700887220897829>span.widget-content').text('/');//4 缓冲器
          document.getElementById('input4').value ='/';
      } else {
          button10.style.backgroundColor = 'green';
          button10.textContent = "4耗能";
           $('#170263678910675f3>#1700887220897829>span.widget-content').text('√');//4 缓冲器
          document.getElementById('input4').value ='√';
        }
		return;
	};


  // 插入您提供的按钮代码
  let clickCount11 = 0;// 创建一个变量来跟踪按钮的点击次数
  const button11 = document.createElement("button");
  button11.id = "id001";
  button11.textContent = "18反绳轮";
  button11.style.width = "80px";
  button11.style.height = "20px";
  button11.style.align = "center";
  button11.onclick = function () {
      // 每次点击更新点击次数
      clickCount11++;
      console.log('点击了按钮');

      // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount11 % 2 === 1) {
          button11.style.backgroundColor = 'red';
          button11.textContent = "18塑料轮";
          document.getElementById('17026400082688e0c').lastElementChild.lastElementChild.innerHTML='/';//18 塑料轮1
          document.getElementById('1702640008268b3d3').lastElementChild.lastElementChild.innerHTML='/';//18 塑料轮2(新老都没有)
          document.getElementById('1702640008268acd4').lastElementChild.lastElementChild.innerHTML='√';//18 塑料轮3
          document.getElementById('1702640008269889c').lastElementChild.lastElementChild.innerHTML='√';//18 塑料轮4
          document.getElementById('input18.1').value ='/';
          document.getElementById('input18.2').value ='/';
          document.getElementById('input18.3').value ='√';
          document.getElementById('input18.4').value ='√';
      } else {
          button11.style.backgroundColor = 'green';
          button11.textContent = "18金属轮";
          document.getElementById('17026400082688e0c').lastElementChild.lastElementChild.innerHTML='/';
          document.getElementById('1702640008268b3d3').lastElementChild.lastElementChild.innerHTML='/';
          document.getElementById('1702640008268acd4').lastElementChild.lastElementChild.innerHTML='/';
          document.getElementById('1702640008269889c').lastElementChild.lastElementChild.innerHTML='/';
          document.getElementById('input18.1').value ='/';
          document.getElementById('input18.2').value ='/';
          document.getElementById('input18.3').value ='/';
          document.getElementById('input18.4').value ='/';
          //document.getElementById('input1').value ='/';
      }

    return;
  };
      let clickCount12 = 0;// 创建一个变量来跟踪按钮的点击次数
      const button12 = document.createElement("button"); //创建一个input对象（提示框按钮）
      button12.id = "id001";
      button12.textContent = "17伸长保护 ";
      button12.style.width = "80px";
      button12.style.height = "20px";
      button12.style.align = "center";
      button12.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount12++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount12 % 2 === 1) {
          button12.style.backgroundColor = 'red';
          button12.textContent = "17伸长保无";
          $('#1700887671315781>span.widget-content').text('/');//17钢带
          document.getElementById('input17').value ='/';
      } else {
          button12.style.backgroundColor = 'green';
          button12.textContent = "17伸长保有";
           $('#1700887671315781>span.widget-content').text('√');//17钢带
          document.getElementById('input17').value ='√';
        }
		return;
	};

      // 创建直梯定检抬头
        const buttonZtdj = document.createElement('button');
        buttonZtdj.textContent = '直梯定检';
        //ZTDJ.style.display = 'inline-block';
        buttonZtdj.style.width = "80px";
        buttonZtdj.style.height = "20px";
        buttonZtdj.style.align = "center";      

            
                formBoxMc.appendChild(buttonZtdj);//电梯名称切换

                formBox2.appendChild(button1);
                formBox2.appendChild(button2);
                formBox2.appendChild(button3);
                formBox2.appendChild(button4);
                formBox2.appendChild(button10);
                formBox2.appendChild(button5);
                formBox2.appendChild(button6);
                formBox2.appendChild(button7);
                formBox2.appendChild(button12);//17
                formBox2.appendChild(button11);//18
                formBox2.appendChild(button8);//19
                formBox2.appendChild(button9);//27

                formBox3.appendChild(saveButton);//保存按钮
                formBox3.appendChild(clearButton);//清除按钮

                container.appendChild(formBoxMc);
                //container.appendChild(formBox3);
                container.appendChild(formBox2);//选项框
                container.appendChild(formBoxZD);//插入直梯定检
                container.appendChild(formBox3);//插入选项按钮 复检
                container.appendChild(formBox4);
           document.body.appendChild(container);



    //保存和回复数据准备工作
    const inputs = [
                    'input0',
                    'input0.2',
                    'input1',
                    'input2',
                    'inputWB',//维保单位
                    'input3',
                    'input3.1',
                    'input3.2',
                    'input4',
                    'input5',
                    'input6.1',
                    'input6.2',
                    'input6.3',
                    'input6.4',
                    'input7',
                    'input8.1',
                    'input8.2',
                    'input9',
                    'input11',
                    'input12',
                    'input13.1',
                    'input13.2',
                    'input14.1',
                    'input14.2',
                    'input15.1',
                    'input15.2',
                    'input16',
                    'input17',
                    'input18.1',
                    'input18.2',
                    'input18.3',
                    'input18.4',
                    'input19',
                    'input24.1',
                    'input24.2',
                    'input24.3',
                    'input24.4',
                    'input27',
                    'input33',
                    'input37.1',
                    'input37.2',
                    'input37.3',
                    'input37.4',

                   ];

         // 从 localStorage 恢复数据功能
function loadData(inputIds, dataIndex) {
    inputIds.forEach((inputId, index) => {
        const savedData = GM_getValue(`savedData${dataIndex}-${index + 1}`, ''); // 使用模板字符串
        console.log(`加载 ${inputId}: ${savedData}`); // 输出调试信息
        const element = document.getElementById(inputId);
        if (element) {
            element.value = savedData; // 恢复到输入框
        } else {
            console.error(`元素 ${inputId} 不存在`);
        }
    });
}

// 调用 loadData
loadData(inputs, 1);

        

    var restoredValue = GM_getValue('selectedValue');
   // 获取下拉列表元素
      var selectElement = document.getElementById('input40');

      if (restoredValue === 'option2') {
          // 设置选中选项为检测
          selectElement.value = 'option2';
      } else if (restoredValue === 'option1') {
          // 设置选中选项为检验
          selectElement.value = 'option1';
      }


// 保存数据功能
function saveData(inputIds, elementIds, dataIndex) {
    inputIds.forEach((inputId, index) => {
        const inputData = document.getElementById(inputId).value;
        const elementId = elementIds[index];

        const ids = elementId.split(' '); // 分割父辈和子辈元素的ID

        if (ids.length > 1) {
            const parentElementId = ids[0];
            const childElementId = ids[1];
            document.getElementById(parentElementId).lastElementChild.lastElementChild.innerHTML = inputData; // 填入数据
        } else {
            document.getElementById(ids[0]).lastElementChild.innerHTML = inputData; // 填入数据
        }

        // 保存数据到本地
        GM_setValue(`savedData${dataIndex}-${index + 1}`, inputData);
    });
};

// 保存第一组数据
document.getElementById('saveButton').addEventListener('click', function() {

    const elementIds = [
           '17228291480185dcd', //检验日期   TD 158125898109086f SPAN1581261440012c13e 17228291480185dcd
           '17222411351547797',//下次检验检测日期 17222411351547797 17222411351547797
           '1555396405619e7a5',//电梯管理员
           '1595319577630fe27',//电梯管理员手机SPAN1595319577630fe27
           '1555402974591228a',// 维保公司TD 17026454689622c84 SPN 1555402974591228a
           '170264546896268b8 1555402991327aca9',//维保员  TD 170264546896268b8 SPAN 1555402991327aca9
           '15554029989396383',//维保员手机
           '17014878048050a06',//制动试验日期
           '1700887220897829',//4缓冲器
           '1700887220897d0b',//5 接地保护
           '1700887220897d51',//6 旁路1
           '17008872208971d0',//6 旁路2
           '1700887220897c04',//6 旁路3
           '170088722089843f',//6 旁路4
           '1702637271087a233 17014953212526364',//7 制动器监测 TD 1702637271087a233 SPN 17014953212526364
           '1700887253052c45',//8 紧急电动1
           '1702637397596a1c8',//8 紧急电动2
           '1700887253052388',//9 紧急操作与动态测试
           '17008872530524c8',//11 驱动主机停止装置
           '170088725305217c',//12鼓式制动器
           '17026392202310dfa',//13盘车（3） 17026392202310dfa
           '1702639220233e667',//13盘车（4）1702639220233e667
           '1702639220238f5df',//14 钢丝绳1
           '1700709338998a55',//14 钢丝绳2
           '1702640008268ba47 17014953212526364',//15 钢带1 1702640008268ba47 17014953212526364
           '17026400082683fb0 1700887671314b16',//15 钢带2 17026400082683fb0 1700887671314b16
           '1700887671315b62',//16 端部固定
           '1700887671315781',//17 悬挂装置异常伸长
           '17008876713155fc',//18 塑料轮1 span17008876713155fc
           '1700887671315642',//1700887671315642
           '17008876713153f8',//1702640008268acd4,SPAN17008876713153f8
           '1700887671315573',//18 塑料轮4
           '170263999535843a9',////19 安全窗 170263999535843a9
           '17015040141996243',//24 门间隙1≤6
           '1702641013571d39a',//24 门间隙1≤30
           '17007072568871c6',//24 门间隙1
           '1702640903045fe9a',//24 门间隙2
           '1706319611211eddb 170088725305269b',//27 无重锤 170088725305269b 170088725305269b
           '1713778561163c9fc 170088725305269b',//33 限速器自动复位1713778561163c9fc 170088725305269b
           '1713594974152179e 1700887253052098',//37 意外移动1  TD 1713594974152179e 1713594974152179e SPAN 1700887253052098 1700887253052098
           '1713594974152ef0e 1702644130868d3fc',////37 意外移动2
           '1702644130870e7e2',////37 意外移动3
           '170264413087205ba',//37 意外移动4
          ];

    saveData(inputs, elementIds, 1);

    //通用扩展
       document.getElementById('17014878067399fe6').lastElementChild.innerHTML='/';//备注栏2 id
       document.getElementById('17041912859544faf').lastElementChild.innerHTML='/';//备注栏3 id
       document.getElementById('170264247697664b1').lastElementChild.lastElementChild.innerHTML='8';//门锁间隙
       document.getElementById('1702642476978611b').lastElementChild.lastElementChild.innerHTML='/';//平衡系数31 17015040141996243
       document.getElementById('1701504018295d212').lastElementChild.innerHTML='/';//平衡系数31
       document.getElementById('17289958185640c6e').lastElementChild.innerHTML='/';//电压
    /*//不合格扩展
       document.getElementById('1555403108834bb43').lastElementChild.innerHTML='DT-2024-1F044';//1555403108834bb43 整改单
       document.getElementById('1702476745708a287').lastElementChild.innerHTML='1';//1702476745708a287 关键项
       document.getElementById('17024767427623ef3').lastElementChild.innerHTML='10';//17024767427623ef3 关键项单号
       document.getElementById('1563606498846b3e9').lastElementChild.innerHTML='不合格';//1563606498846b3e9 整改单
       document.getElementById('17026372710884259').lastElementChild.lastElementChild.innerHTML='×';//17026372710884259 170088725305269b 不合格项*/


    //检验检测选择与记忆
       // 获取选项框元素
       const select = document.querySelector('#input40');
       // 获取select元素的值
       var selectedValue = select.value;
       // 判断选中的值是否为"检测"
       if (select.value === 'option2') {
       // 获取单选框元素
       const radio = document.querySelector('input[value="检测"]');
       // 设置选中属性
       radio.checked = true;
       }
       if (select.value === 'option1') {
       const radio1 = document.querySelector('input[value="检验"]');
       // 设置选中属性
        radio1.checked = true;
        }
       GM_setValue('selectedValue', selectedValue);

//使用登记证缺损填充
/*   var parentElement1 = document.getElementById('15554027824390740'); //15554027824390740 使用登记证
       var Str12 = parentElement1.querySelector('.widget-content').textContent.trim();
       var SYDJ =Str12+'8）';
       document.getElementById('15554027824390740').lastElementChild.innerHTML=SYDJ;//15554027824390740 使用登记证  */
// $('#1700887253052388>span.widget-content').text('/')
//  $('#170088725305269b>span.widget-content').text('/')
//   $('#170264408022600c2>span.widget-content').text('/')
//    document.getElementById('1713594974151fd69').lastElementChild.lastElementChild.innerHTML='/';//上超速 11700887253052388  1700887253052388
//    document.getElementById('1713594974151f4bb').lastElementChild.lastElementChild.innerHTML='/';//上超速2 1702644080222cb5b 170088725305269b
//    document.getElementById('1713594974152c1a0').lastElementChild.lastElementChild.innerHTML='/';//上超速4

    alert('第一组数据保存成功！');
});


   //清理数据，并恢复默认数据
      document.getElementById('clearButton').addEventListener('click', function() {
      inputs.forEach((inputId, index) => {
      let Data1;
      const elementId = [
           '17228291480185dcd', //检验日期   TD 158125898109086f SPAN1581261440012c13e
           '17222411351547797',//下次检测日期
           '1555396405619e7a5',//电梯管理员
           '1595319577630fe27',//电梯管理员手机SPAN1595319577630fe27
          '1555402974591228a',// 维保公司TD 17026454689622c84 SPN 1555402974591228a
           '170264546896268b8 1555402991327aca9',//维保员  TD 170264546896268b8 SPAN 1555402991327aca9
           '15554029989396383',//维保员手机
           '17014878048050a06',//制动试验日期
           '1700887220897829',//4缓冲器
           '1700887220897d0b',//5 接地保护
           '1700887220897d51',//6 旁路1
           '17008872208971d0',//6 旁路2
           '1700887220897c04',//6 旁路3
           '170088722089843f',//6 旁路4
           '1702637271087a233 17014953212526364',//7 制动器监测 TD 1702637271087a233 SPN 17014953212526364
           '1700887253052c45',//8 紧急电动1
           '1702637397596a1c8',//8 紧急电动2
           '1700887253052388',//9 紧急操作与动态测试
           '17008872530524c8',//11 驱动主机停止装置
           '170088725305217c',//12鼓式制动器
           '17026392202310dfa',//13盘车（3） 17026392202310dfa
           '1702639220233e667',//13盘车（4）1702639220233e667
           '1702639220238f5df',//14 钢丝绳1
           '1700709338998a55',//14 钢丝绳2
           '1702640008268ba47 17014953212526364',//15 钢带1 1702640008268ba47 17014953212526364
           '17026400082683fb0 1700887671314b16',//15 钢带2 17026400082683fb0 1700887671314b16
           '1700887671315b62',//16 端部固定
           '1700887671315781',//17 悬挂装置异常伸长
           '17008876713155fc',//18 塑料轮1 span17008876713155fc
           '1700887671315642',//1700887671315642
           '17008876713153f8',//1702640008268acd4,SPAN17008876713153f8
           '1700887671315573',//18 塑料轮4
           '170263999535843a9',////19 安全窗 170263999535843a9
           '17015040141996243',//24 门间隙1≤6
           '1702641013571d39a',//24 门间隙1≤30
           '17007072568871c6',//24 门间隙1
           '1702640903045fe9a',//24 门间隙2
           '1706319611211eddb 170088725305269b',//27 无重锤 170088725305269b 170088725305269b
           '1713778561163c9fc 170088725305269b',//33 限速器自动复位1713778561163c9fc 170088725305269b
           '1713594974152179e 1700887253052098',//37 意外移动1  TD 1713594974152179e 1713594974152179e SPAN 1700887253052098 1700887253052098
           '1713594974152ef0e 1702644130868d3fc',////37 意外移动2
           '1702644130870e7e2',////37 意外移动3
           '170264413087205ba',//37 意外移动4

                        ][index];

       const ids = elementId.split(' '); // 分割父辈和子辈元素的ID
       if (ids.length > 1) {
        const parentElementId = ids[0];// 父辈元素的ID
        const childElementId = ids[1];// 子辈元素的ID
           Data1 = document.getElementById(ids[0]).lastElementChild.lastElementChild.innerHTML; //先把空白格的数据填入对应元素框
       } else {
            Data1= document.getElementById(ids[0]).lastElementChild.innerHTML;
       }
      document.getElementById(inputId).value = Data1;
      //再把空白格的数据保存
    });

    alert('数据清理成功！');
  });//清理函数按钮的括弧
     };//垂直梯函数

     function FT() {

// 布局扶梯定期检验FDformBox 创建一个包含多个小方框和保存按钮的方框
  const formBoxFD = document.createElement('div');
      formBoxFD.style.backgroundColor = '#f9f9f9';
      formBoxFD.style.padding = '2px';
      formBoxFD.style.border = '1px solid #ccc';
      formBoxFD.style.display = 'flex'; // 使用Flexbox布局
      formBoxFD.style.display = 'grid'; // 使用网格布局
      formBoxFD.style.gridTemplateColumns = '220px 220px'; // 分成两列
      formBoxFD.style.gridGap = '0.10px'; // 设置网格间距
      formBoxFD.style.flexDirection = 'column'; // 垂直方向排列
      formBoxFD.style.alignItems = 'flex-start'; // 元素水平居左对齐
      formBoxFD.innerHTML = `
    <div style="margin-bottom: 2px;">
      <label for="FDinputJY" style="display: inline-block; width: 90px;">检验日期：</label>
      <input type="text" id="FDinputJY" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinputJC" style="display: inline-block; width: 200px;">下次检测日：</label>
      <select id="FDinput40" style="width: 30%; margin-left: 0.1px;">
      <option value="FDoption1">检验</option>
      <option value="FDoption2">检测</option>
      </select>
      <input type="text" id="FDinputJC" placeholder="" style="width: 50%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinputGL" style="display: inline-block; width: 90px;">安全管理员：</label>
      <input type="text" id="FDinputGL" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinputGLDH" style="display: inline-block; width: 90px;">管理手机：</label>
      <input type="text" id="FDinputGLDH" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinputWBGS" style="display: inline-block; width: 90px;">维保公司：</label>
      <input type="text" id="FDinputWBGS" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinputWBRY" style="display: inline-block; width: 90px;">维保人员：</label>
      <input type="text" id="FDinputWBRY" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinputWBDH" style="display: inline-block; width: 90px;">维保电话：</label>
      <input type="text" id="FDinputWBDH" placeholder="" style="width: 80%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinputZD" style="display: inline-block; width: 90px;">制动试验：</label>
      <input type="text" id="FDinputZD" placeholder="" value="/" style="width: 80%; margin-left: 1px;">
    </div>
     <div style="margin-bottom: 2px;">
      <label for="FDinput2" style="display: inline-block; width: 90px;">2接地：</label>
      <input type="text" id="FDinput2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text"  placeholder=""value="15" style="width: 7%; margin-left: 1px;">
    </div>
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinput4" style="display: inline-block; width: 90px;">4制动监测：</label>
      <input type="text" id="FDinput4" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text"  placeholder="" value="97" style="width: 8%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="FDinput5" style="display: inline-block; width: 90px;">5盘车：</label>
      <input type="text" id="FDinput5.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput5.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text"  placeholder="" value="97" style="width: 8%; margin-left: 1px;">
      <input type="text"  placeholder="" value="15" style="width: 8%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="FDinput7" style="display: inline-block; width: 90px;">7出入口防2：</label>
      <input type="text" id="FDinput7.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput7.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput7.3" placeholder="" value="23" style="width: 8%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="FDinput8" style="display: inline-block; width: 90px;">8防护挡板：</label>
      <input type="text" id="FDinput8.1" placeholder="≥25" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput8.2" placeholder="≥25" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput8.3" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="FDinput10" style="display: inline-block; width: 90px;">10盖板开关：</label>
      <input type="text" id="FDinput10" placeholder="" style="width: 7%; margin-left: 1px;">

      <input type="text"  placeholder="" value="97" style="width: 8%; margin-left: 1px;">
    </div>


    <div style="margin-bottom: 2px;">
      <label for="FDinput15" style="display: inline-block; width: 90px;">15带速监测：</label>
      <input type="text" id="FDinput15" placeholder="" style="width: 7%; margin-left: 1px;">

      <input type="text"  placeholder="" value="97" style="width: 8%; margin-left: 1px;">
    </div>

   <div style="margin-bottom: 2px;">
      <label for="FDinput16" style="display: inline-block; width: 90px;">16防爬：</label>
      <input type="text" id="FDinput16.1" placeholder="≥950且≤1050" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput16.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput16.3" placeholder="≥1000" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput16.4" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>


    <div style="margin-bottom: 2px;">
      <label for="FDinput17" style="display: inline-block; width: 90px;">17阻挡装置：</label>
      <input type="text" id="FDinput17.1" placeholder="＞125" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput17.2" placeholder="≥25且≤150" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput17.3" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="FDinput18" style="display: inline-block; width: 90px;">18防滑行：</label>
      <input type="text" id="FDinput18.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput18.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput18.3" placeholder="" style="width: 7%; margin-left: 1px;">

      <input type="text" id="FDinput18.4" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>

    <div style="margin-bottom: 2px;">
      <label for="FDinput19" style="display: inline-block; width: 90px;">19水平间隙：</label>
      <input type="text" id="FDinput19.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput19.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput19.3" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text"  placeholder="" value="15" style="width: 8%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinput19" style="display: inline-block; width: 90px;">19垂直间隙：</label>
      <input type="text" id="FDinput19.4" placeholder="3" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput19.5" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text"  placeholder="" value="15" style="width: 8%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinput21" style="display: inline-block; width: 90px;">21防夹开关：</label>
      <input type="text" id="FDinput21" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput21.1" placeholder="" value="23" style="width: 8%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinput22" style="display: inline-block; width: 90px;">22梯级啮合：</label>
      <input type="text" id="FDinput22.1" placeholder="/" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput22.2" placeholder="≤6" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput22.3" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text"  placeholder="" value="15" style="width: 8%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinput24" style="display: inline-block; width: 90px;">24梯级缺失：</label>
      <input type="text" id="FDinput24" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text"  placeholder="" value="97" style="width: 8%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinput28" style="display: inline-block; width: 90px;">28运行试验：</label>
      <input type="text" id="FDinput28.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput28.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput28.3" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput28.4" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text"  placeholder="" value="变频" style="width: 8%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinput30" style="display: inline-block; width: 90px;">30制停距离：</label>
      <input type="text" id="FDinput30.1" placeholder="上"  style="width: 20%; margin-left: 1px;">
      <input type="text" id="FDinput30.2" placeholder="下"  style="width: 20%; margin-left: 1px;">
    </div>
    <div style="margin-bottom: 2px;">
      <label for="FDinput31" style="display: inline-block; width: 90px;">31附加制动：</label>
      <input type="text" id="FDinput31.1" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput31.2" placeholder="" style="width: 7%; margin-left: 1px;">
      <input type="text" id="FDinput31.3" placeholder="" style="width: 7%; margin-left: 1px;">
    </div>
  `;


// 创建并插入保存按钮
        const FDsaveButton = document.createElement('button');
        FDsaveButton.id = "FDsaveButton";
        FDsaveButton.textContent = 'F保存数据';
        //toggleButton.style.display = 'inline-block';
        FDsaveButton.style.width = "80px";
        FDsaveButton.style.height = "20px";
        FDsaveButton.style.align = "center";

// 创建并插入保存按钮
        const FDclearButton = document.createElement('button');
        FDclearButton.id = "FDclearButton";
        FDclearButton.textContent = 'F清理数据';
        //toggleButton.style.display = 'inline-block';
        FDclearButton.style.width = "80px";
        FDclearButton.style.height = "20px";
        FDclearButton.style.align = "center";


//布局不同电梯名称的
    const formBoxMc = document.createElement('div');
    formBoxMc.style.backgroundColor = '#f9f9f9';
    formBoxMc.style.padding = '2px';
    formBoxMc.style.border = '1px solid #ccc';
//   DTMCformBox.style.display = 'flex'; // 使用Flexbox布局
    formBoxMc.style.display = 'grid'; // 使用网格布局
//    MCformBox.style.gridTemplateColumns = '100px 100px 100px 100px'; // 分成两列
    formBoxMc.style.gridGap = '0.10px'; // 设置网格间距
    formBoxMc.style.flexDirection = 'column'; // 垂直方向排列
    formBoxMc.style.alignItems = 'flex-start'; // 元素水平居左对齐

//布局插件按钮的
    const formBox2 = document.createElement('div');
    formBox2.style.backgroundColor = '#f9f9f9';
    formBox2.style.padding = '2px';
    formBox2.style.border = '1px solid #ccc';
//    formBox.style.display = 'flex'; // 使用Flexbox布局
    formBox2.style.display = 'grid'; // 使用网格布局
    formBox2.style.gridTemplateColumns = '100px 100px 100px 100px'; // 分成两列
    formBox2.style.gridGap = '0.10px'; // 设置网格间距
    formBox2.style.flexDirection = 'column'; // 垂直方向排列
    formBox2.style.alignItems = 'flex-start'; // 元素水平居左对齐


//布局保存清除按钮的
    const formBox3 = document.createElement('div');
    formBox3.style.backgroundColor = '#f9f9f9';
    formBox3.style.padding = '2px';
    formBox3.style.border = '1px solid #ccc';
//    formBox.style.display = 'flex'; // 使用Flexbox布局
    formBox3.style.display = 'grid'; // 使用网格布局
    formBox3.style.gridTemplateColumns = '150px 150px 150px  '; // 分成两列
    formBox3.style.gridGap = '0.10px'; // 设置网格间距
    formBox3.style.flexDirection = 'column'; // 垂直方向排列
    formBox3.style.alignItems = 'flex-start'; // 元素水平居左对齐

//style="width: 80px; height: 20px;"
// 插入您提供的按钮代码
  const button1 = document.createElement("button");
    button1.id = "id001";
    button1.textContent = "直梯超15年 5接地保护 14钢丝绳X  16端部固定 24层门间隙";
    button1.style.width = "80px";
    button1.style.height = "80px";
    button1.style.align = "center";
    button1.onclick = function () {
      console.log('点击了按钮');
          button1.style.backgroundColor = 'red';
          button2.style.backgroundColor = '';
//          document.getElementById('17222411351547797').lastElementChild.innerHTML='/';//下次检测日期
          document.getElementById('1700887220897d0b').lastElementChild.innerHTML='√';//5接地保护
          document.getElementById('1702639220238f5df').lastElementChild.innerHTML='√';//14 钢丝绳1 span
          document.getElementById('1700709338998a55').lastElementChild.innerHTML='√';//14 钢丝绳2
          document.getElementById('1700887671315b62').lastElementChild.innerHTML='√';//16 端部固定
          document.getElementById('17015040141996243').lastElementChild.innerHTML='6';//24 门间隙1≤6
          document.getElementById('1702641013571d39a').lastElementChild.innerHTML='28';//24 门间隙2≤30
          document.getElementById('17007072568871c6').lastElementChild.innerHTML='√';//24 门间隙1
          document.getElementById('1702640903045fe9a').lastElementChild.innerHTML='√';//24 门间隙2

          document.getElementById('input0.2').value ='/';
          document.getElementById('input5').value ='√';
          document.getElementById('input14.1').value ='√';
          document.getElementById('input14.2').value ='√';
          document.getElementById('input16').value ='√';
          document.getElementById('input24.1').value ='6';
          document.getElementById('input24.2').value ='28';
          document.getElementById('input24.3').value ='√';
          document.getElementById('input24.4').value ='√';

         //通用扩展
       document.getElementById('17014878067399fe6').lastElementChild.innerHTML='已按照安徽省市场监督管理局“皖市监办[2023]757号文”要求查验。';//备注栏2 id
       document.getElementById('17041912859544faf').lastElementChild.innerHTML='/';//备注栏3 id
       document.getElementById('170264247697664b1').lastElementChild.lastElementChild.innerHTML='8';
          return;
        };

    const button2 = document.createElement("button"); //创建一个input对象（提示框按钮）
     button2.id = "id001";
     button2.textContent = "未超15年梯 5接地保护 14钢丝绳X  16端部固定 24层门间隙 ";
     button2.style.width = "80px";
     button2.style.height = "80px";
     button2.style.align = "center";

	//绑定按键点击功能
	button2.onclick = function (){

		console.log('点击了按键');
          button2.style.backgroundColor = 'red'; // 点击按钮后将按钮颜色改为红色
          button1.style.backgroundColor = '';
          document.getElementById('1700887220897d0b').lastElementChild.innerHTML='/';//5 接地保护
          document.getElementById('1702639220238f5df').lastElementChild.innerHTML='/';//14 钢丝绳1 span
          document.getElementById('1700709338998a55').lastElementChild.innerHTML='/';//14 钢丝绳2
          document.getElementById('1700887671315b62').lastElementChild.innerHTML='/';//16 端部固定
          document.getElementById('17015040141996243').lastElementChild.innerHTML='/';//24 门间隙1≤6
          document.getElementById('1702641013571d39a').lastElementChild.innerHTML='/';//24 门间隙2≤30
          document.getElementById('17007072568871c6').lastElementChild.innerHTML='/';//24 门间隙1
          document.getElementById('1702640903045fe9a').lastElementChild.innerHTML='/';//24 门间隙2

          document.getElementById('input0.2').value =document.getElementById('17222411351547797').lastElementChild.innerHTML;//下次检测日期
          document.getElementById('input5').value ='/';
          document.getElementById('input14.1').value ='/';
          document.getElementById('input14.2').value ='/';
          document.getElementById('input16').value ='/';
          document.getElementById('input24.1').value ='/';
          document.getElementById('input24.2').value ='/';
          document.getElementById('input24.3').value ='/';
          document.getElementById('input24.4').value ='/';

         //通用扩展
       document.getElementById('17014878067399fe6').lastElementChild.innerHTML='已按照安徽省市场监督管理局“皖市监办[2023]757号文”要求查验。';//备注栏2 id
       document.getElementById('17041912859544faf').lastElementChild.innerHTML='/';//备注栏3 id
       document.getElementById('170264247697664b1').lastElementChild.lastElementChild.innerHTML='8';
		return;
	};

    let clickCount3 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button3 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button3.id = "id001";
	button3.textContent = "新标准直梯 6旁路装置 7制动检测 37意外移动 ";
	button3.style.width = "80px";
	button3.style.height = "80px";
	button3.style.align = "center";
	button3.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount3++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount3 % 2 === 1) {
          button3.style.backgroundColor = 'red';
          button3.textContent = "新标准直梯  6旁路装置 7制动检测 37意外移动 是";
          $('#17026367891076a46>#1700887220897d51>span.widget-content').text('√');//6 旁路
          $('#17026367891070e74>#17008872208971d0>span.widget-content').text('√');//6 旁路
          $('#1702636789107fe21>#1700887220897c04>span.widget-content').text('√');//6 旁路
          $('#17026367891075fa7>#170088722089843f>span.widget-content').text('√');//6 旁路
          $('#1702637271087a233>#17014953212526364>span.widget-content').text('√');//7 制动器监测
          $('#1713594974152179e>#1700887253052098>span.widget-content').text('√');// 37 意外移动1 1713594974152179e 170088725305269b
          $('#1713594974152ef0e>#1702644130868d3fc>span.widget-content').text('√');//37 意外移动2 1713594974152ef0e 1702644130868d3fc
          $('#1713594974152c607>#1702644130870e7e2>span.widget-content').text('√');//37 意外移动3
          $('#1713594974152540d>#170264413087205ba>span.widget-content').text('√');//37 意外移动4
          document.getElementById('input6.1').value ='√';
          document.getElementById('input6.2').value ='√';
          document.getElementById('input6.3').value ='√';
          document.getElementById('input6.4').value ='√';
          document.getElementById('input7').value ='√';
          document.getElementById('input37.1').value ='√';
          document.getElementById('input37.2').value ='√';
          document.getElementById('input37.3').value ='√';
          document.getElementById('input37.4').value ='√';
      } else {
          button3.style.backgroundColor = 'green';
          button3.textContent = "新标准直梯  6旁路装置 7制动检测 37意外移动 否";
          $('#17026367891076a46>#1700887220897d51>span.widget-content').text('/');//6 旁路
          $('#17026367891070e74>#17008872208971d0>span.widget-content').text('/');//6 旁路
          $('#1702636789107fe21>#1700887220897c04>span.widget-content').text('/');//6 旁路
          $('#17026367891075fa7>#170088722089843f>span.widget-content').text('/');//6 旁路
          $('#1702637271087a233>#17014953212526364>span.widget-content').text('/');//7 制动器监测
          $('#1713594974152179e>#1700887253052098>span.widget-content').text('/');// 37 意外移动1 1713594974152179e 170088725305269b
          $('#1713594974152ef0e>#1702644130868d3fc>span.widget-content').text('/');//37 意外移动2 1713594974152ef0e 1702644130868d3fc
          $('#1713594974152c607>#1702644130870e7e2>span.widget-content').text('/');//37 意外移动3
          $('#1713594974152540d>#170264413087205ba>span.widget-content').text('/');//37 意外移动4
          document.getElementById('input6.1').value ='/';
          document.getElementById('input6.2').value ='/';
          document.getElementById('input6.3').value ='/';
          document.getElementById('input6.4').value ='/';
          document.getElementById('input7').value ='/';
          document.getElementById('input37.1').value ='/';
          document.getElementById('input37.2').value ='/';
          document.getElementById('input37.3').value ='/';
          document.getElementById('input37.4').value ='/';
        }
		return;
	};

      let clickCount4 = 0;// 创建一个变量来跟踪按钮的点击次数
      const button4 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button4.id = "id001";
	button4.textContent = "无机房项目 8紧急电动 9动态测试 11主机停止 13无手盘车33限自复位 ";
	button4.style.width = "80px";
	button4.style.height = "100px";
	button4.style.align = "center";

	//绑定按键点击功能
	button4.onclick = function (){
		console.log('点击了按键');
      // 每次点击更新点击次数
      clickCount4++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount4 % 2 === 1) {
          button4.style.backgroundColor = 'red';
          button4.textContent = "无机房项目 8紧急电动 9动态测试 11主机停止 13无手盘车33限自复位 ";
          $('#1700887253052c45>span.widget-content').text('√');//8 紧急电动
          $('#1702637397596a1c8>span.widget-content').text('√');//8 紧急电动
          $('#1702637271088688c>#1700887253052388>span.widget-content').text('√');//9 紧急操作与动态测试
          $('#17026372710884f0d>#17008872530524c8>span.widget-content').text('√');//11 驱动主机停止装置
          document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='/'//13盘车（3）
          document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='/'//13盘车（4）
        $('#1713778561163c9fc>#170088725305269b>span.widget-content').text('/');//33 限速器自动复位170088725305269b
          document.getElementById('input8.1').value ='√';
          document.getElementById('input8.2').value ='√';
          document.getElementById('input9').value ='√';
          document.getElementById('input11').value ='√';
          document.getElementById('input13.1').value ='/';
          document.getElementById('input13.1').style.color = 'red';
          document.getElementById('input13.2').value ='/';
          document.getElementById('input33').value ='/';
      } else {
          button4.style.backgroundColor = 'green';
          button4.textContent = "有机房项目 8紧急电动 9动态测试 11主机停止 13无手盘车33限自复位 ";
          $('#1700887253052c45>span.widget-content').text('/');//8 紧急电动
          $('#1702637397596a1c8>span.widget-content').text('/');//8 紧急电动
          $('#1702637271088688c>#1700887253052388>span.widget-content').text('/');//9 紧急操作与动态测试
          $('#17026372710884f0d>#17008872530524c8>span.widget-content').text('/');//11 驱动主机停止装置
          document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='<span style="color: red;">√</span>';//13盘车（3）
          document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.style.color = 'red';
          document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='√';//13盘车（4）
        $('#1713778561163c9fc>#170088725305269b>span.widget-content').text('√');//33 限速器自动复位170088725305269b
          document.getElementById('input8.1').value ='/';
          document.getElementById('input8.2').value ='/';
          document.getElementById('input9').value ='/';
          document.getElementById('input11').value ='/';
          document.getElementById('input13.1').value ='√';
          document.getElementById('input13.1').style.color = '';
          document.getElementById('input13.2').value ='√';
          document.getElementById('input33').value ='√';
        }
		return;

	};


    let clickCount5 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button5 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button5.id = "id001";
	button5.textContent = "8紧急 ";
	button5.style.width = "80px";
	button5.style.height = "20px";
	button5.style.align = "center";
	//绑定按键点击功能
	button5.onclick = function (){
		console.log('点击了按键');
      // 每次点击更新点击次数
      clickCount5++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount5 % 2 === 1) {
          button5.style.backgroundColor = 'red';
          button5.textContent = "8有紧急";
          $('#1700887253052c45>span.widget-content').text('√');//8 紧急电动
          $('#1702637397596a1c8>span.widget-content').text('√');//8 紧急电动
          document.getElementById('input8.1').value ='√';
          document.getElementById('input8.2').value ='√';
      } else {
          button5.style.backgroundColor = 'green';
          button5.textContent = "8无紧急";
          $('#1700887253052c45>span.widget-content').text('/');//8 紧急电动
          $('#1702637397596a1c8>span.widget-content').text('/');//8 紧急电动
          document.getElementById('input8.1').value ='/';
          document.getElementById('input8.2').value ='/';
        }
		return;
	};
    let clickCount6 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button6 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button6.id = "id001";
	button6.textContent = "12非鼓式 ";
	button6.style.width = "80px";
	button6.style.height = "20px";
	button6.style.align = "center";

	//绑定按键点击功能
	button6.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount6++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount6 % 2 === 1) {
          button6.style.backgroundColor = 'red';
          button6.textContent = "12非鼓式";
          $('#17026372710898779>#170088725305217c>span.widget-content').text('/');//12鼓式制动器
          document.getElementById('input12').value ='/';
      } else {
          button6.style.backgroundColor = 'green';
          button6.textContent = "12鼓式";
          $('#17026372710898779>#170088725305217c>span.widget-content').text('√');//12鼓式制动器
          document.getElementById('input12').value ='√';
        }
		return;
	};
    let clickCount7 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button7 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button7.id = "id001";
	button7.textContent = "13盘车 ";
	button7.style.width = "80px";
	button7.style.height = "20px";
	button7.style.align = "center";

	//绑定按键点击功能
	button7.onclick = function (){

      console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount7++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount7 % 2 === 1) {
          button7.style.backgroundColor = 'red';
          button7.textContent = "13无盘车";
          document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='/'//13盘车（3）
          document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='/'//13盘车（4）
          document.getElementById('input13.1').value ='/';
          document.getElementById('input13.2').value ='/';
      } else {
          button7.style.backgroundColor = 'green';
          button7.textContent = "13有盘车";
          document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='√'//13盘车（3）
          document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='√'//13盘车（4）
          document.getElementById('input13.1').value ='√';
          document.getElementById('input13.2').value ='√';
        }
		return;
	};
    let clickCount8 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button8 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button8.id = "id001";
	button8.textContent = "19安全窗 ";
	button8.style.width = "80px";
	button8.style.height = "20px";
	button8.style.align = "center";
	button8.onclick = function (){
        console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount8++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount8 % 2 === 1) {
          button8.style.backgroundColor = 'red';
          button8.textContent = "19有窗";
          $('#17026400082690255>#170263999535843a9>span.widget-content').text('√');//19 安全窗 170088725305269b
          document.getElementById('input19').value ='√';
      } else {
          button8.style.backgroundColor = 'green';
          button8.textContent = "19无窗";
          $('#17026400082690255>#170263999535843a9>span.widget-content').text('/');//19 安全窗 170088725305269b
          document.getElementById('input19').value ='/';
        }
		return;
	};


    let clickCount9 = 0;// 创建一个变量来跟踪按钮的点击次数
    const button9 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button9.id = "id001";
	button9.textContent = "7出入口23 ";
	button9.style.width = "80px";
	button9.style.height = "20px";
	button9.style.align = "center";
	button9.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount9++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount9 % 2 === 1) {
          button9.style.backgroundColor = 'red';
          button9.textContent = "7出入口无";
          $('#1701410680665ebb>span.widget-content').text('/');//
          $('#17033293688994dd8>span.widget-content').text('/');//
          document.getElementById('FDinput7.1').value ='/';
          document.getElementById('FDinput7.2').value ='/';
      } else {
          button9.style.backgroundColor = 'green';
          button9.textContent = "7出入口有";
          $('#1701410680665ebb>span.widget-content').text('＞100');//
          $('#17033293688994dd8>span.widget-content').text('√');//
          document.getElementById('FDinput7.1').value ='＞100';
          document.getElementById('FDinput7.2').value ='√';
        }
		return;
	};

      let clickCount10 = 0;// 创建一个变量来跟踪按钮的点击次数
      const button10 = document.createElement("button"); //创建一个input对象（提示框按钮）
      button10.id = "id001";
      button10.textContent = "8防碰头 ";
      button10.style.width = "80px";
      button10.style.height = "20px";
      button10.style.align = "center";
      button10.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount10++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount10 % 2 === 1) {
          button10.style.backgroundColor = 'red';
          button10.textContent = "8防碰头有";
          $('#1701410680665136>span.widget-content').text('＞0.30');//8 防护挡板1
          $('#1701410680665ac9>span.widget-content').text('＞25');//8 防护挡板2
          $('#1703329368901529b>span.widget-content').text('√');//8 防护挡板3
          document.getElementById('FDinput8.1').value ='＞0.30';
          document.getElementById('FDinput8.2').value ='＞25';
          document.getElementById('FDinput8.3').value ='√';
      } else {
          button10.style.backgroundColor = 'green';
          button10.textContent = "8防碰头无";
          $('#1701410680665136>span.widget-content').text('/');//8 防护挡板1
          $('#1701410680665ac9>span.widget-content').text('/');//8 防护挡板2
          $('#1703329368901529b>span.widget-content').text('/');//8 防护挡板3
          document.getElementById('FDinput8.1').value ='/';
          document.getElementById('FDinput8.2').value ='/';
          document.getElementById('FDinput8.3').value ='/';
        }
		return;
	};


  // 插入您提供的按钮代码
  let clickCount11 = 0;// 创建一个变量来跟踪按钮的点击次数
  const button11 = document.createElement("button");
  button11.id = "id001";
  button11.textContent = "16防爬";
  button11.style.width = "80px";
  button11.style.height = "20px";
  button11.style.align = "center";
  button11.onclick = function () {
      // 每次点击更新点击次数
      clickCount11++;
      console.log('点击了按钮');

      // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount11 % 2 === 1) {
          button11.style.backgroundColor = 'red';
          button11.textContent = "16防爬有";
          document.getElementById('17014107329880c4').lastElementChild.innerHTML='＞950且＜1050';
          document.getElementById('1701410732988a26').lastElementChild.innerHTML='√';
          document.getElementById('17014107329889ce').lastElementChild.innerHTML='＞1000';
          document.getElementById('170141073298880a').lastElementChild.innerHTML='√';
          document.getElementById('FDinput16.1').value ='＞950且＜1050';
          document.getElementById('FDinput16.2').value ='√';
          document.getElementById('FDinput16.3').value ='＞1000';
          document.getElementById('FDinput16.4').value ='√';
      } else {
          button11.style.backgroundColor = 'green';
          button11.textContent = "16防爬无";
          document.getElementById('17014107329880c4').lastElementChild.innerHTML='/';
          document.getElementById('1701410732988a26').lastElementChild.innerHTML='/';
          document.getElementById('17014107329889ce').lastElementChild.innerHTML='/';
          document.getElementById('170141073298880a').lastElementChild.innerHTML='/';
          document.getElementById('FDinput16.1').value ='/';
          document.getElementById('FDinput16.2').value ='/';
          document.getElementById('FDinput16.3').value ='/';
          document.getElementById('FDinput16.4').value ='/';
          //document.getElementById('input1').value ='/';
      }

    return;
  };
      let clickCount12 = 0;// 创建一个变量来跟踪按钮的点击次数
      const button12 = document.createElement("button"); //创建一个input对象（提示框按钮）
      button12.id = "id001";
      button12.textContent = "17盖板阻挡 ";
      button12.style.width = "80px";
      button12.style.height = "20px";
      button12.style.align = "center";
      button12.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount12++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount12 % 2 === 1) {
          button12.style.backgroundColor = 'red';
          button12.textContent = "17盖板阻有";
          $('#17014107329887c9>span.widget-content').text('＞125');//17盖板阻挡
          $('#170141073298848e>span.widget-content').text('＞25且＜150');//17盖板阻挡
          $('#17014107329883fc>span.widget-content').text('√');//17盖板阻挡
          document.getElementById('FDinput17.1').value ='＞125';
          document.getElementById('FDinput17.2').value ='＞25且＜150';
          document.getElementById('FDinput17.3').value ='√';
      } else {
          button12.style.backgroundColor = 'green';
          button12.textContent = "17盖板阻无";
          $('#17014107329887c9>span.widget-content').text('/');//17盖板阻挡
          $('#170141073298848e>span.widget-content').text('/');//17盖板阻挡
          $('#17014107329883fc>span.widget-content').text('/');//17盖板阻挡
          document.getElementById('FDinput17.1').value ='/';
          document.getElementById('FDinput17.2').value ='/';
          document.getElementById('FDinput17.3').value ='/';
        }
		return;
	};

      let clickCount13 = 0;// 创建一个变量来跟踪按钮的点击次数
      const button13 = document.createElement("button"); //创建一个input对象（提示框按钮）
      button13.id = "id001";
      button13.textContent = "18防滑行 ";
      button13.style.width = "80px";
      button13.style.height = "20px";
      button13.style.align = "center";
      button13.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCount13++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCount13 % 2 === 1) {
          button13.style.backgroundColor = 'red';
          button13.textContent = "18防滑行有";
          $('#17014107329885bf>span.widget-content').text('＞100');//18防滑行2
          $('#17014107329883c8>span.widget-content').text('＜1800');//18防滑行2
          $('#1701410732988854>span.widget-content').text('＞20');//18防滑行2
          $('#17014107329889f3>span.widget-content').text('√');////18防滑行2
          document.getElementById('FDinput18.1').value ='＞100';
          document.getElementById('FDinput18.2').value ='＜1800';
          document.getElementById('FDinput18.3').value ='＞20';
          document.getElementById('FDinput18.4').value ='√';

      } else {
          button13.style.backgroundColor = 'green';
          button13.textContent = "18防滑行无";
          $('#17014107329885bf>span.widget-content').text('/');//18防滑行2
          $('#17014107329883c8>span.widget-content').text('/');//18防滑行2
          $('#1701410732988854>span.widget-content').text('/');//18防滑行2
          $('#17014107329889f3>span.widget-content').text('/');////18防滑行2
          document.getElementById('FDinput18.1').value ='/';
          document.getElementById('FDinput18.2').value ='/';
          document.getElementById('FDinput18.3').value ='/';
          document.getElementById('FDinput18.4').value ='/';
        }
		return;
	};


//扶梯按键插件
      let clickCountFD15 = 0;// 创建一个变量来跟踪按钮的点击次数
      const buttonFD15 = document.createElement("button"); //创建一个input对象（提示框按钮）
      buttonFD15.id = "id001";
      buttonFD15.textContent = "扶梯超15年 2接地保护 5手动盘车  22梯级啮合";
      buttonFD15.style.width = "80px";
      buttonFD15.style.height = "60px";
      buttonFD15.style.align = "center";
      buttonFD15.onclick = function (){
		console.log('点击了按键');
        // 每次点击更新点击次数
      clickCountFD15++;
        // 根据点击次数的奇偶性来改变按钮的背景颜色
      if (clickCountFD15 % 2 === 1) {
          buttonFD15.style.backgroundColor = 'red';
          buttonFD15.textContent = "17钢带有";
          $('#1700887671315781>span.widget-content').text('/');//17钢带
          document.getElementById('input17').value ='/';
      } else {
          buttonFD15.style.backgroundColor = 'green';
          buttonFD15.textContent = "17钢丝无";
           $('#1700887671315781>span.widget-content').text('√');//17钢带
          document.getElementById('input17').value ='√';
        }
		return;
	};

     // 创建扶梯定检抬头
        const buttonFtdj = document.createElement('button');
        buttonFtdj.textContent = '扶梯定检';
        //FTDJ.style.display = 'inline-block';
        buttonFtdj.style.width = "80px";
        buttonFtdj.style.height = "20px";
        buttonFtdj.style.align = "center";

              
                formBoxMc.appendChild(buttonFtdj);//插入扶梯名称

                formBox2.appendChild(button9);//插入出入口
                formBox2.appendChild(button10);//8防碰头
                formBox2.appendChild(button11);//16防爬
                formBox2.appendChild(button12);//17盖板阻挡
                formBox2.appendChild(button13);//18防滑行

                formBox3.appendChild(FDsaveButton);//保存按钮
                formBox3.appendChild(FDclearButton);//清除按钮

                container.appendChild(formBoxMc);//名称选项框
                container.appendChild(formBox2);//选项框
                container.appendChild(formBoxFD);//插入F梯定检
                container.appendChild(formBox3);//插入选项按钮 复检
                container.appendChild(formBox4);          
                document.body.appendChild(container);

//保存和回复数据准备工作
         const inputsFD = [
                    'FDinputJY',//检验日期
                    'FDinputJC',//下次检测日
                    'FDinputGL', //安全管理员
                    'FDinputGLDH',//管理手机
                    'FDinputWBGS',//维保公司
                    'FDinputWBRY',//维保人员
                    'FDinputWBDH',//维保电话
                    'FDinputZD',//制动试验
                    'FDinput2',
                    'FDinput4',
                    'FDinput5.1',
                    'FDinput5.2',
                    'FDinput7.1',
                    'FDinput7.2',
                    'FDinput8.1',
                    'FDinput8.2',
                    'FDinput8.3',
                    'FDinput10',
                    'FDinput15',
                    'FDinput16.1',
                    'FDinput16.2',
                    'FDinput16.3',
                    'FDinput16.4',
                    'FDinput17.1',
                    'FDinput17.2',
                    'FDinput17.3',

                    'FDinput18.1',
                    'FDinput18.2',
                    'FDinput18.3',
                    'FDinput18.4',

                    'FDinput19.1',
                    'FDinput19.2',
                    'FDinput19.3',
                    'FDinput19.4',
                    'FDinput19.5',
                    'FDinput21',

                    'FDinput22.1',
                    'FDinput22.2',
                    'FDinput22.3',

                    'FDinput24',

                    'FDinput28.1',
                    'FDinput28.2',
                    'FDinput28.3',
                    'FDinput28.4',

                    'FDinput30.1',
                    'FDinput30.2',
                    'FDinput31.1',
                    'FDinput31.2',
                    'FDinput31.3',
                   ];


         // 从 localStorage 恢复数据功能
function loadData(inputIds, dataIndex) {
    inputIds.forEach((inputId, index) => {
        const savedData = GM_getValue(`savedData${dataIndex}-${index + 1}`, ''); // 使用模板字符串
        console.log(`加载 ${inputId}: ${savedData}`); // 输出调试信息
        const element = document.getElementById(inputId);
        if (element) {
            element.value = savedData; // 恢复到输入框
        } else {
            console.error(`元素 ${inputId} 不存在`);
        }
    });
}

// 调用 loadData
loadData(inputsFD, 2);


   var restoredValue1 = GM_getValue('selectedValue1');// GM_setValue('selectedValue1', selectedValue1);
   // 获取下拉列表元素
      var selectElement1 = document.getElementById('FDinput40');

      if (restoredValue1 === 'FDoption2') {
          // 设置选中选项为检测
          selectElement1.value = 'FDoption2';
      } else if (restoredValue1 === 'FDoption1') {
          // 设置选中选项为检验
          selectElement1.value = 'FDoption1';
      }


// 保存数据功能
function saveData(inputIds, elementIds, dataIndex) {
    inputIds.forEach((inputId, index) => {
        const inputData = document.getElementById(inputId).value;
        const elementId = elementIds[index];

        const ids = elementId.split(' '); // 分割父辈和子辈元素的ID

        if (ids.length > 1) {
            const parentElementId = ids[0];
            const childElementId = ids[1];
            document.getElementById(parentElementId).lastElementChild.lastElementChild.innerHTML = inputData; // 填入数据
        } else {
            document.getElementById(ids[0]).lastElementChild.innerHTML = inputData; // 填入数据
        }


        // 保存数据到本地
        GM_setValue(`savedData${dataIndex}-${index + 1}`, inputData);// GM_setValue('selectedValue1', selectedValue1);
    });
};
//alert('第一组数据保存成功！');

// 保存第二组数据(扶梯定期检验)
document.getElementById('FDsaveButton').addEventListener('click', function() {
    const elementIds = [
           '1581261440012c13e', //检验日期   TD 158125898109086f SPAN1581261440012c13e
           '17222411351547797',//下次检测日期   17222411351547797
           '1555396405619e7a5',//电梯管理员1703334804827e6ab 1555396405619e7a5
           '1595319577630fe27',//电梯管理员手机17033348048279b28 SPAN1595319577630fe27  1595319577630fe27
           '1555402974591228a',// 维保公司TD 1703334804828437e SPN 1555402974591228a 1555402974591228a
           '17033348048281ba7 1555402991327aca9',//维保员  TD 17033348048281ba7 SPAN 1555402991327aca9 1555402991327aca9
           '15554029989396383',//维保员手机 1703334804828ad1a 15554029989396383
           '17014878048050a06',//制动试验日期 17014878048050a06
           '17014105829900bf',//2接地 17014105829900bf
           '1701410582990e44',//4 制动器监测  ID17033288823455ada SPAN1701410582990e44
           '17014105829909e7',//5 盘车1 17033288823459883 17014105829909e7
           '1701410582990f69',//5 盘车2 17033288823457c55 1701410582990f69
           '1701410680665ebb',//7 7出入口防2.1  1722076941856711c 1701410680665ebb
           '17033293688994dd8',//7 7出入口防2.2 1722076941856eaa0  17033293688994dd8

           '1701410680665136',//8 防护挡板1 1722076941856465e 1701410680665136
           '1701410680665ac9',//8 防护挡板2 1722076941856564a  1701410680665ac9
           '1703329368901529b',//8 防护挡板3 172207694185604fa 1703329368901529b
           '170530261146217a7',//10 检修盖板电气开关2 1722076941856e470 170530261146217a7

           '1722077179574f854 17014953212526364',//15 扶手带速度监测 1722077179574f854 17014953212526364

           '17014107329880c4',//16防爬1 17014107329880c4
           '1701410732988a26',//16防爬2 1701410732988a26
           '17014107329889ce',//16防爬3 17014107329889ce
           '170141073298880a',//16防爬4 170141073298880a

           '17014107329887c9',//17阻挡1 17014107329887c9
           '170141073298848e',//17阻挡2 170141073298848e
           '17014107329883fc',//17阻挡3 17014107329883fc

           '17014107329885bf',//18防滑行1 17014107329885bf
           '17014107329883c8',//18防滑行2 17014107329883c8
           '1701410732988854',//18防滑行3 1701410732988854
           '17014107329889f3',//18防滑行4 17014107329889f3

           '1703331967678b536 1701495373950ed13',//19水平间隙1 填写范围值 1703331967678b536 1701495373950ed13 1701495373950ed13
           '170141242886324d',//19水平间隙2  170141242886324d
           '17033319676780fef 17014953212526364',//19水平间隙3  17033319676780fef 17014953212526364
           '17014124288680bb',//19垂直间隙1  填写最大值 17014124288680bb
           '1703331888936ba10',//19垂直间隙2  1703331888936ba10

           '1701412428868bfe',//21防夹开关  1701412428868bfe

           '17033319676806e28 1701412428868fc4',//22梯级啮合尺寸1 17033319676806e28 1701412428868fc4
           '1703331967680b369 170141242886828c',//22梯级啮合尺寸2 1703331967680b369 170141242886828c
           '1703331967680bf30 1701412428868575',//22梯级啮合尺寸3 1703331967680bf30 1701412428868575

           '17014124505292cc',//24梯级缺失 17014124505292cc

           '17033327310664ac0',//28运行试验1 17033327310664ac0
           '1701412486248f6f',//28运行试验2 1701412486248f6f
           '172207731746495ed',//28运行试验3 172207731746495ed
           '1701412486248dc6',//28运行试验4 1701412486248dc6

           '17014124862492d2',//30制停距离1 17014124862492d2
           '1722077389982ecb7',//30制停距离2 1722077389982ecb7

           '1700709371213d74',//31附加制动1 1700709371213d74
           '1700709371213bcd',//31附加制动2 1700709371213bcd
           '170070937121335b',//31附加制动3 170070937121335b
    ];
    saveData(inputsFD, elementIds, 2);
    //通用扩展

      //通用扩展
       document.getElementById('17033278614220f49').lastElementChild.innerHTML='/';// 使用区域 长度 17033278614220f49
       document.getElementById('17014878067399fe6').lastElementChild.innerHTML='/';//备注栏2 17014878067399fe6
       document.getElementById('17041912859544faf').lastElementChild.innerHTML='/';//备注栏3 id
    document.getElementById('17014106806654b6').lastElementChild.innerHTML='＞100';//7 出入口防护设置 1722076941855263c  17014106806654b6 填写实测范围值。

    $('#1701410680665ebb>span.widget-content').text('/');//7 出入口防护设置3 老标准无此项
    $('#17033293688994dd8>span.widget-content').text('/');//7 出入口防护设置3

    document.getElementById('1701410705775fec').lastElementChild.innerHTML='＞4';//11 梳齿余踏板1 1722077052105057d  1701410705775fec
    document.getElementById('1701410705775bad').lastElementChild.innerHTML='＜4';//11 梳齿余踏板2 172207705210517c5 1701410705775bad
    document.getElementById('17014107057752e3').lastElementChild.innerHTML='＜30';//12 急停开关距离 17220770521055d2c 17014107057752e3
    document.getElementById('1701410705775d29').lastElementChild.innerHTML='＞80';//12 急停开关标记尺寸 1722077052105af56 1701410705775d29
    document.getElementById('17014124288688a9').lastElementChild.innerHTML='50≥且≤150';//20 围裙板防夹 1703331967679d004 17014124288688a9 必须范围
    $('#170141248624994a>span.widget-content').text('+1');//170141248624994a 29项


 /*
      var parentElement1 = document.getElementById('15554027824390740'); //15554027824390740 使用登记证
       var Str12 = parentElement1.querySelector('.widget-content').textContent.trim();
       var SYDJ =Str12+'8）';
       document.getElementById('15554027824390740').lastElementChild.innerHTML=SYDJ;//15554027824390740 使用登记证*/

        //检验检测选择与记忆
       // 获取选项框元素
       const select = document.querySelector('#FDinput40');
       // 获取select元素的值
       var selectedValue1 = select.value;
       // 判断选中的值是否为"检测"
       if (select.value === 'FDoption2') {
       // 获取单选框元素
       const radio = document.querySelector('input[value="检测"]');
       // 设置选中属性
       radio.checked = true;
       }
       if (select.value === 'FDoption1') {
       const radio1 = document.querySelector('input[value="检验"]');
       // 设置选中属性
        radio1.checked = true;
        }
       GM_setValue('selectedValue1', selectedValue1);

    alert('第二组数据保存成功！');
});

         //清理数据，并恢复默认数据F梯
      document.getElementById('FDclearButton').addEventListener('click', function() {
//           alert('扶梯数据清理成功！');
      inputsFD.forEach((inputId, index) => {
      let Data1;
      const elementId = [
           '1581261440012c13e', //检验日期   TD 158125898109086f SPAN1581261440012c13e
           '17222411351547797',//下次检测日期   17222411351547797
           '1555396405619e7a5',//电梯管理员1703334804827e6ab 1555396405619e7a5
           '1595319577630fe27',//电梯管理员手机17033348048279b28 SPAN1595319577630fe27  1595319577630fe27
           '1555402974591228a',// 维保公司TD 1703334804828437e SPN 1555402974591228a 1555402974591228a
           '17033348048281ba7 1555402991327aca9',//维保员  TD 17033348048281ba7 SPAN 1555402991327aca9 1555402991327aca9
           '15554029989396383',//维保员手机 1703334804828ad1a 15554029989396383
           '17014878048050a06',//制动试验日期 17014878048050a06
           '17014105829900bf',//2接地 17014105829900bf
           '1701410582990e44',//4 制动器监测  ID17033288823455ada SPAN1701410582990e44
           '17014105829909e7',//5 盘车1 17033288823459883 17014105829909e7
           '1701410582990f69',//5 盘车2 17033288823457c55 1701410582990f69
           '1701410680665ebb',//7 7出入口防2.1  1722076941856711c 1701410680665ebb
           '17033293688994dd8',//7 7出入口防2.2 1722076941856eaa0  17033293688994dd8

           '1701410680665136',//8 防护挡板1 1722076941856465e 1701410680665136
           '1701410680665ac9',//8 防护挡板2 1722076941856564a  1701410680665ac9
           '1703329368901529b',//8 防护挡板3 172207694185604fa 1703329368901529b
           '170530261146217a7',//10 检修盖板电气开关2 1722076941856e470 170530261146217a7

           '1722077179574f854 17014953212526364',//15 扶手带速度监测 1722077179574f854 17014953212526364

           '17014107329880c4',//16防爬1 17014107329880c4
           '1701410732988a26',//16防爬2 1701410732988a26
           '17014107329889ce',//16防爬3 17014107329889ce
           '170141073298880a',//16防爬4 170141073298880a

           '17014107329887c9',//17阻挡1 17014107329887c9
           '170141073298848e',//17阻挡2 170141073298848e
           '17014107329883fc',//17阻挡3 17014107329883fc

           '17014107329885bf',//18防滑行1 17014107329885bf
           '17014107329883c8',//18防滑行2 17014107329883c8
           '1701410732988854',//18防滑行3 1701410732988854
           '17014107329889f3',//18防滑行4 17014107329889f3

           '1703331967678b536 1701495373950ed13',//19水平间隙1 填写范围值 1703331967678b536 1701495373950ed13 1701495373950ed13
           '170141242886324d',//19水平间隙2  170141242886324d
           '17033319676780fef 17014953212526364',//19水平间隙3  17033319676780fef 17014953212526364
           '17014124288680bb',//19垂直间隙1  填写最大值 17014124288680bb
           '1703331888936ba10',//19垂直间隙2  1703331888936ba10

           '1701412428868bfe',//21防夹开关  1701412428868bfe

           '17033319676806e28 1701412428868fc4',//22梯级啮合尺寸1 17033319676806e28 1701412428868fc4
           '1703331967680b369 170141242886828c',//22梯级啮合尺寸2 1703331967680b369 170141242886828c
           '1703331967680bf30 1701412428868575',//22梯级啮合尺寸3 1703331967680bf30 1701412428868575

           '17014124505292cc',//24梯级缺失 17014124505292cc

           '17033327310664ac0',//28运行试验1 17033327310664ac0
           '1701412486248f6f',//28运行试验2 1701412486248f6f
           '172207731746495ed',//28运行试验3 172207731746495ed
           '1701412486248dc6',//28运行试验4 1701412486248dc6

           '17014124862492d2',//30制停距离1 17014124862492d2
           '1722077389982ecb7',//30制停距离2 1722077389982ecb7

           '1700709371213d74',//31附加制动1 1700709371213d74
           '1700709371213bcd',//31附加制动2 1700709371213bcd
            '170070937121335b',//31附加制动3 170070937121335b

                        ][index];

       const ids = elementId.split(' '); // 分割父辈和子辈元素的ID
       if (ids.length > 1) {
        const parentElementId = ids[0];// 父辈元素的ID
        const childElementId = ids[1];// 子辈元素的ID
           Data1 = document.getElementById(ids[0]).lastElementChild.lastElementChild.innerHTML; //先把空白格的数据填入对应元素框
       } else {
            Data1= document.getElementById(ids[0]).lastElementChild.innerHTML;
       }
      document.getElementById(inputId).value = Data1;
      //再把空白格的数据保存
    });

    alert('扶梯数据清理成功！');
  });//清理函数按钮的括弧

     };//扶梯函数


      // 创建并插入垂直梯出具复检
        const examinationButton = document.createElement('button');
        examinationButton.textContent = '垂梯复检';
        //examinationButton.display = 'inline-block';
        examinationButton.style.width = "80px";
        examinationButton.style.height = "20px";
        examinationButton.style.align = "center";
        examinationButton.onclick = function ()
        {
		  console.log('点击了按键');
            var parentElement = document.getElementById('17228291480185dcd');//检验日期
            var dateElement = parentElement.querySelector('.widget-content[default-date="0"]');
            var dateStr = dateElement.innerText.trim();
            var dateParts = dateStr.match(/(\d{4})年(\d{2})月(\d{2})日/);
            var year0 = parseInt(dateParts[1]) ;
            var year1 = parseInt(dateParts[1]) + 1;
            var year2 = parseInt(dateParts[1]) + 2;
            var month = dateParts[2];
            var day1 = dateParts[3];
            var newDateStr0 = year0 + "年" + month + "月"+day1 + '日';
            var newDateStr1 = year1 + "年" + month + "月";
            var newDateStr2 = year2 + "年" + month + "月";
            var DATE1 = newDateStr1;
            var DATE2 = newDateStr2;

//            document.getElementById('17048660889290048').lastElementChild.innerHTML=DATE2;//;//下次检验日期
//            document.getElementById('170486608684702b3').lastElementChild.innerHTML=DATE1; //;//下次检测日期

          document.getElementById('17222411351547797').lastElementChild.innerHTML='2025年09月';//DATE2;//下次检验日期

//            document.getElementById('170486608684702b3').lastElementChild.innerHTML='/'; //DATE1;//下次检测日期
//            document.getElementById('17026454689622c84').lastElementChild.lastElementChild.innerHTML='安徽讯煌电梯工程有限公司';
//            document.getElementById('170264546896268b8').lastElementChild.lastElementChild.innerHTML='李杨';
//            document.getElementById('15554029989396383').lastElementChild.innerHTML='17333212083';
            var currentDate = new Date();
            var year = currentDate.getFullYear();
            var Fmonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
            var day = ('0' + currentDate.getDate()).slice(-2);
            var formattedDate = year + '年' + Fmonth + '月' + day + '日';
            document.getElementById('17228291480185dcd').lastElementChild.innerHTML=formattedDate;//检验日期
            var Str1 = newDateStr0;
            var Str2element = document.getElementById('15812611120658274'); //15812611120658274
            var Str2 = Str2element.querySelector('.widget-content').textContent.trim();
            // 去掉末尾的 "F1"
            if (Str2.endsWith('F1')) {
                Str2 = Str2.slice(0, -2); // 去掉末尾的两个字符
                                      }

            var Str3element = document.getElementById('17024767427623ef3');
            var Str3 = Str3element.querySelector('.widget-content').textContent.trim();
            var Str4element = document.getElementById('17024767480702d68');
            var Str4 = Str4element.querySelector('.widget-content').textContent.trim();

            // 提取数字并合并成数组
            let combinedArray = Str3.match(/\d+/g); // 使用正则表达式匹配所有数字
            if (Str4 && /\d/.test(Str4)) {
                let combinedArray2 = Str4.match(/\d+/g); // 如果 Str4 存在，则也匹配其中的数字
                combinedArray = combinedArray.concat(combinedArray2); // 合并两个数组
            }


            // 将字符串按逗号分割成数组，并合并成一个新数组
            /* var combinedArray = Str3.split("、").concat(Str4.split("、"));
            //var combinedArray = +Str3+Str4+;
            // 将数组中的每个元素从字符串转换为数字*/
            var numberArray = combinedArray.map(function(item) {
                return parseInt(item, 10); // 使用基数10来确保正确的转换
            });

            // 将字符串按逗号分割成数组，并合并成一个新数组
           /* var str = Str3 + Str4;
            var numbersArray = str.match(/\d+/g).map(Number);*/

            numberArray.sort(function(a, b) {
                               return a - b;
                                              });

            var sortedString = numberArray.join('、');
            console.log(sortedString); // 输出按数字大小排列的字符串

            //console.log('本检验机构于'+Str1+'出具了编号为'+Str2+'的《电梯定期检验报告》。按照TSG T7001—2023的规定，本检验机构对该报告所对应的电梯中序号为'+sortedString+'的项目进行了复检，出具本检验记录');
            var StrBeizhu = '本检验机构于'+Str1+'出具了编号为'+Str2+'的《电梯定期检验报告》，按照TSG T7001—2023的规定，本检验机构对该报告所对应的电梯中序号为'+sortedString+'的项目进行了复检，出具本检验记录、报告。'
            document.getElementById('17041912859544faf').lastElementChild.innerHTML=StrBeizhu
            document.getElementById('1702476745708a287').lastElementChild.innerHTML='0';
            document.getElementById('17024767427623ef3').lastElementChild.innerHTML='/';
            document.getElementById('1702476752677dcfe').lastElementChild.innerHTML='0';
            document.getElementById('17024767480702d68').lastElementChild.innerHTML='/';
            document.getElementById('1563606498846b3e9').lastElementChild.innerHTML='合格';
            document.getElementById('1555403108834bb43').lastElementChild.innerHTML='/';//整改单/
            //默认填充修改
            document.getElementById('170264247697664b1').lastElementChild.lastElementChild.innerHTML='/';//门啮合尺寸
            document.getElementById('17015040141996243').lastElementChild.innerHTML='/';//24 门间隙1≤6
            document.getElementById('1702641013571d39a').lastElementChild.innerHTML='/';//24 门间隙2≤30


            function replaceXWithCheck() {
        // 选择可能包含这些值的所有元素
           const elements = document.querySelectorAll('input, span, div, td'); // 如果需要，可以添加更多选择器

            elements.forEach((element) => {
            if (element.value === '≤6'|| element.value === '≥7'|| element.value === '≤30')
            {
                element.value = '/';
            }
            else if (element.textContent === '≥7'||element.textContent === '≤6'||element.textContent === '≤30')
            {
                element.textContent = '/';
            }

        });
                                       };
             function replaceXWithCheck1() {
        // 选择可能包含这些值的所有元素
           const updatedElements = document.querySelectorAll('input, span, div, td'); // 如果需要，可以添加更多选择器

            updatedElements.forEach((element) => {
            if (element.value === '×')
            {
                element.value = '√';
            }
            else if (element.textContent === '×')
            {
                element.textContent = '√';
            }

        });
                                       };
            replaceXWithCheck();
            replaceXWithCheck1();
		  alert('垂直梯复检处理成功！');//测试程序请打开
	   };



      // 创建并插入防爆梯出具复检
        const FBexaminationButton = document.createElement('button');
        FBexaminationButton.textContent = '防爆复检';
        //FBexaminationButton.display = 'inline-block';
        FBexaminationButton.style.width = "80px";
        FBexaminationButton.style.height = "20px";
        FBexaminationButton.style.align = "center";
        FBexaminationButton.onclick = function ()
        {
		  //console.log('点击了按键');
            var parentElement = document.getElementById('1581261440012c13e'); //检验日期 1581261440012c13e
//            var dateElement = parentElement.querySelector('.widget-content[lay-key="1"]');
            var dateElement = parentElement.querySelector('.widget-content');
            var dateStr = dateElement.innerText.trim();

            var dateParts = dateStr.match(/(\d{4})年(\d{2})月(\d{2})日/);
            var year0 = parseInt(dateParts[1]) ;
            var year1 = parseInt(dateParts[1]) + 1;
            var year2 = parseInt(dateParts[1]) + 2;
            var month = dateParts[2];
            var day1 = dateParts[3];
            var newDateStr0 = year0 + "年" + month + "月"+day1 + '日';
            var newDateStr1 = year1 + "年" + month + "月";
            var newDateStr2 = year2 + "年" + month + "月";
            var DATE1 = newDateStr1;
            var DATE2 = newDateStr2;
//            document.getElementById('1704865737363a6a6').lastElementChild.innerHTML=DATE2;//;//防爆下次检验日期 span 1704865737363a6a6
//            document.getElementById('1704865734309f666').lastElementChild.innerHTML=DATE1; //;//防爆下次检测日期 span 1704865734309f666
//            document.getElementById('1704865737363a6a6').lastElementChild.innerHTML='2026年06月';//DATE2;//下次检验日期
//            document.getElementById('1704865734309f666').lastElementChild.innerHTML='2025年06月'; //DATE1;//下次检测日期
//            document.getElementById('17026454689622c84').lastElementChild.lastElementChild.innerHTML='安徽讯煌电梯工程有限公司';
//            document.getElementById('170264546896268b8').lastElementChild.lastElementChild.innerHTML='李杨';
//            document.getElementById('15554029989396383').lastElementChild.innerHTML='17333212083';
            var currentDate = new Date();
            var year = currentDate.getFullYear();
            var Fmonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
            var day = ('0' + currentDate.getDate()).slice(-2);
            var formattedDate = year + '年' + Fmonth + '月' + day + '日';

            document.getElementById('1581261440012c13e').lastElementChild.innerHTML=formattedDate;//检验日期

            var Str1 = newDateStr0;
            var Str2element = document.getElementById('15812611120658274'); // 报告书编号15812611120658274  15812611120658274
            var Str2 = Str2element.querySelector('.widget-content').textContent.trim();
            // 去掉末尾的 "F1"
            if (Str2.endsWith('F1')) {
                Str2 = Str2.slice(0, -2); // 去掉末尾的两个字符
                                      }

            var Str3element = document.getElementById('17024767427623ef3'); //重要般项
            var Str3 = Str3element.querySelector('.widget-content').textContent.trim();
            var Str4element = document.getElementById('17024767480702d68');//一般项
            var Str4 = Str4element.querySelector('.widget-content').textContent.trim();

            // 提取数字并合并成数组
            let combinedArray = Str3.match(/\d+/g); // 使用正则表达式匹配所有数字
            if (Str4 && /\d/.test(Str4)) {
                let combinedArray2 = Str4.match(/\d+/g); // 如果 Str4 存在，则也匹配其中的数字
                combinedArray = combinedArray.concat(combinedArray2); // 合并两个数组
            }


            // 将字符串按逗号分割成数组，并合并成一个新数组
            /* var combinedArray = Str3.split("、").concat(Str4.split("、"));
            //var combinedArray = +Str3+Str4+;
            // 将数组中的每个元素从字符串转换为数字*/
            var numberArray = combinedArray.map(function(item) {
                return parseInt(item, 10); // 使用基数10来确保正确的转换
            });

            // 将字符串按逗号分割成数组，并合并成一个新数组
           /* var str = Str3 + Str4;
            var numbersArray = str.match(/\d+/g).map(Number);*/

            numberArray.sort(function(a, b) {
                               return a - b;
                                              });

            var sortedString = numberArray.join('、');
            console.log(sortedString); // 输出按数字大小排列的字符串

            //console.log('本检验机构于'+Str1+'出具了编号为'+Str2+'的《电梯定期检验报告》。按照TSG T7001—2023的规定，本检验机构对该报告所对应的电梯中序号为'+sortedString+'的项目进行了复检，出具本检验记录');
            var StrBeizhu = '本检验机构于'+Str1+'出具了编号为'+Str2+'的《电梯定期检验报告》，按照TSG T7001—2023的规定，本检验机构对该报告所对应的电梯中序号为'+sortedString+'的项目进行了复检，出具本检验记录、报告。'
            document.getElementById('17041912859544faf').lastElementChild.innerHTML=StrBeizhu
            document.getElementById('1702476745708a287').lastElementChild.innerHTML='0';
            document.getElementById('17024767427623ef3').lastElementChild.innerHTML='/';
            document.getElementById('1702476752677dcfe').lastElementChild.innerHTML='0';
            document.getElementById('17024767480702d68').lastElementChild.innerHTML='/';
            document.getElementById('1563606498846b3e9').lastElementChild.innerHTML='合格';
            document.getElementById('1555403108834bb43').lastElementChild.innerHTML='/'; //整改单/

            function replaceXWithCheck() {
        // 选择可能包含这些值的所有元素
           const elements = document.querySelectorAll('input, span, div, td'); // 如果需要，可以添加更多选择器

            elements.forEach((element) => {
             if (element.value === '√'|| element.value === '≥7')
            {
                element.value = '/';
            }
            else if (element.textContent === '√'||element.textContent === '≥7'||element.textContent === '≤6'||element.textContent === '≤30')
            {
                element.textContent = '/';
            }

        });
                                       };
             function replaceXWithCheck1() {
        // 选择可能包含这些值的所有元素
           const updatedElements = document.querySelectorAll('input, span, div, td'); // 如果需要，可以添加更多选择器

            updatedElements.forEach((element) => {
            if (element.value === '×')
            {
                element.value = '√';
            }
            else if (element.textContent === '×')
            {
                element.textContent = '√';
            }

        });
                                       };
            replaceXWithCheck();
            replaceXWithCheck1();
//            const observer = new MutationObserver(replaceXWithCheck);
//            observer.observe(document.body, { childList: true, subtree: true });

		  alert('防爆电梯复检处理成功！');//测试程序请打开
	   };


      // 创建并插入检测出具复检
        const JCexaminationButton = document.createElement('button');
        JCexaminationButton.textContent = 'ZT检测复检';
        //FBexaminationButton.display = 'inline-block';
        JCexaminationButton.style.width = "80px";
        JCexaminationButton.style.height = "20px";
        JCexaminationButton.style.align = "center";
        JCexaminationButton.onclick = function ()
        {
		    //加测日期
            var currentDate = new Date();
            var year = currentDate.getFullYear();
            var Fmonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
            var day = ('0' + currentDate.getDate()).slice(-2);
            var formattedDate = year + '年' + Fmonth + '月' + day + '日';
            document.getElementById('1706875327836e3a3').lastElementChild.innerHTML=formattedDate;//检测日期

            document.getElementById('17068754548530754').lastElementChild.innerHTML='所检测项目均符合《电梯自行检测规则》（TSG T7008-2023）的相应要求'; //span17068754548530754
            document.getElementById('1704866144747a500').lastElementChild.innerHTML='2025年09月'; //下次检测日期span1704866144747a500
            document.getElementById('1704866147766da74').lastElementChild.innerHTML='2026年09月';//下次检验日期span1704866147766da74
//            var Str2 = document.getElementById('1555403108834bb43'); // 报告书编号1555403108834bb43
            var StrBeizhu = '本检测单位于'+formattedDate+'对不符合项目（详见编号为DTJC-2024-1F022的《电梯自行检测备忘录》）的整改情况进行了确认。'
            document.getElementById('17014878067399fe6').lastElementChild.innerHTML=StrBeizhu;//备注栏


/*            // 定义一个函数来替换文本
            function replaceText() {
             // 获取网页中的所有文本节点
             var bodyText = document.body.innerHTML;

             // 使用replace方法替换文本
              var updatedText = bodyText.replace(/不符合/g, '符合');

             // 将更新后的文本设置回网页
                document.body.innerHTML = updatedText;
             }

            // 调用函数执行替换
             replaceText();
            alert('检测电梯复检处理成功！');//测试程序请打开*/
            function replaceXWithCheck() {
        // 选择可能包含这些值的所有元素
           const elements = document.querySelectorAll('input, span, div, td'); // 如果需要，可以添加更多选择器

            elements.forEach((element) => {
             if (element.value === '不符合')
            {
                element.value = '符合';
            }
            else if (element.textContent === '不符合')
            {
                element.textContent = '符合';
            }

        });
        };
                replaceXWithCheck();
		  alert('检测电梯复检处理成功！');//测试程序请打开

            };








        // 创建并插入切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '切换选项';
        //toggleButton.style.display = 'inline-block';
        toggleButton.style.width = "80px";
        toggleButton.style.height = "20px";
        toggleButton.style.align = "center";       
        let clicktoggleButton = 0;
       // 新按钮点击事件
        toggleButton.addEventListener('click', () => {
            console.log('点击了按键');
        // 每次点击更新点击次数
            clicktoggleButton++;
            if (clicktoggleButton % 2 === 1) {
//                alert('第一组数据保存成功！');
               container.innerHTML = ''; // 清空容器内容
               formBox4.appendChild(toggleButton);//切换选项
               formBox4.appendChild(examinationButton);//出具复检
               formBox4.appendChild(FBexaminationButton);//防爆复检

               FT();//F梯定检
          }
            else {
//                alert('第ER组数据保存成功！');
               container.innerHTML = ''; // 清空容器内容
               formBox4.appendChild(toggleButton);//切换选项
               formBox4.appendChild(examinationButton);//出具复检
               formBox4.appendChild(FBexaminationButton);//防爆复检
               formBox4.appendChild(JCexaminationButton);//检测复检
               ZT();//垂直梯定检
              }
		  return;
        });
                ZT();//垂直梯定检
                formBox4.appendChild(toggleButton);//切换选项
                formBox4.appendChild(examinationButton);//出具复检
                formBox4.appendChild(FBexaminationButton);//防爆复检
                formBox4.appendChild(JCexaminationButton);//检测复检



                //document.body.appendChild(container);



  });//次函数结束框
});//总函数结束框
