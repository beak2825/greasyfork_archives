// ==UserScript==
// @name         评论魔术师
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  一键修改b站评论样式，从横向文字改为近似的竖向文字，仅是为了有趣。
// @author       thunder-sword
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463448/%E8%AF%84%E8%AE%BA%E9%AD%94%E6%9C%AF%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/463448/%E8%AF%84%E8%AE%BA%E9%AD%94%E6%9C%AF%E5%B8%88.meta.js
// ==/UserScript==
// 更新日志：
/*
v0.3：使点击回复时出现的评论框也加上魔术变化按钮，此版本会将页面中的所有评论框都加上按钮
v0.2：添加“还原”按钮，还原文本为修改前文本
*/

//默认设置
var settings={
    "padChar": "_", //填充字符串，半角和空白会用此字符填充
    "row": 6, //分组的行数，手机上不展开默认显示6行
    "col": 19, //手机上默认显示19列，但为了避免溢出实际显示效果会-1
};

//变量作用：用于输入文本
var event = document.createEvent('HTMLEvents');
event.initEvent("input", true, true);
event.eventType = 'message';

//变量作用：用于检验是否已经转换过
var lastNewStr='';
//变量作用：记录上次原文本，方便还原
var lastRawStr='';

//作用：获取文本实际宽度
function getByteLength(str) {
  let byteLength = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c > 255) {
      byteLength += 2;
    } else {
      byteLength += 1;
    }
  }
  return byteLength;
}

function verticalText(str, numRows, padChar='_') {
  // 将字符串转换成字符数组，每个元素为一个字符
  const chars = str.split('');
  const numCols = Math.ceil(chars.length / numRows); // 计算列数
  const result = []; // 存储竖直排版后的字符数组
  let i, j;
  for (i = 0; i < numRows; i++) {
    // 初始化每行的字符数组
    const row = [];
    for (j = 0; j < numCols; j++) {
      // 计算字符在原始字符串中的索引
      const index = j * numRows + i;
      // 将索引越界的字符用填充字符代替
      const char = chars[index] || padChar;
      // 如果是单字节字符，则在其后面填充一个字符
      if (char.charCodeAt(0) < 256) {
        row.push(char, padChar);
      } else {
        row.push(char);
      }
    }
    // 将当前行的字符数组添加到结果数组中
    result.push(row);
  }
  //console.log(result);
  // 将竖直排版后的字符数组转换成字符串
  return result.map(row => row.join('')).join('\n');
}

//作用：多行结果时将其分为多列来打印
function multColVerticalText(str, numRows, padChar='_') {
  const lines = str.split('\n');
  const rows = Array.from({length: numRows}, () => []);
  for (let i = 0; i < lines.length; i++) {
    const chars = lines[i].split('');
    const numCols = Math.ceil(chars.length / numRows); // 计算列数
    for (let j = 0; j < numRows; j++) {
      for (let k = 0; k < numCols; k++) {
        // 计算字符在原始字符串中的索引
        const index = k * numRows + j;
        // 将索引越界的字符用填充字符代替
        const char = chars[index] || padChar;
         // 如果是单字节字符，则在其后面填充一个字符
        if (char.charCodeAt(0) < 256) {
          rows[j].push(char, padChar);
        } else {
          rows[j].push(char);
        }
      }
    }
  }
  return rows.map(row => row.join('')).join('\n');
}

//作用：规范化，两种想法：
//1.将其6行6行的展示，每6行之间加一个换行，感觉挺规整的
//2.自动计算，将其以最多38B列（19个汉字）的策略自动计算行数，难以实现的同时也不太方便观看，就用第一种吧
//另测试发现当填充符为空格时较小，无法对整，故改为下划线，但其实下划线也无法准确对齐
function normalization(str, padChar='_', row=6, col=19){
    //threshold是分组阈值，即每组字符串数，我手机上不展开默认显示的最多字数是6行19列，故采用此方式
    //但是测试发现，如果出现半角字符，直接满列有可能超出，即两个半角字符宽度>一个全角字符，为了显示正常，干脆将列数-1，给它留些空余
    let threshold=row*(col-1);
    let groups=[];
    let count=0;
    let tmp='';
    for(let i = 0; i < str.length; i++){
        tmp+=str[i];
        if('\n'===str[i]){
            let t=count%row;
            if(0!==t){
                count+=row-t;
            }
        }else{
            count+=1;
        }
        if(threshold===count){
            //console.log(tmp);
            //console.log(count);
            groups.push(tmp);
            tmp='';
            count=0;
        }
    }
    if(''!==tmp){
        groups.push(tmp);
    }
    //console.log(groups);
    return groups.map(i => multColVerticalText(i, row, padChar)).join('\n\n');
}

//作用：根据settings向评论页面插入选项和按钮
function insertButton(box){
    //如果已经有了则不需要再添加
    if(box.querySelector('div#ths_magic_convert')){
        return;
    }
    var div=document.createElement('div');
    div.id="ths_magic_convert";
    div.setAttribute('style',"display: flex; align-items: center; margin-left: 80px; margin-top: 5px;");
    //为按钮绑定事件
    var button=document.createElement('button');
    button.innerText="魔术变化";
    button.style.marginRight = "3px";
    button.addEventListener('click', function() {
        convert_comment(this);
    });
    div.appendChild(button);
    button=document.createElement('button');
    button.innerText="还原";
    button.style.marginRight = "3px";
    button.addEventListener('click', function() {
        revert_comment(this);
    });
    div.appendChild(button);
    var label=document.createElement('label');
    label.innerText="填充字符：";
    div.appendChild(label);
    var input=document.createElement('input');
    input.id="padChar";
    input.value=settings["padChar"];
    div.appendChild(input);
    label=document.createElement('label');
    label.innerText="行数：";
    div.appendChild(label);
    input=document.createElement('input');
    input.id="row";
    input.value=settings["row"];
    div.appendChild(input);
    label=document.createElement('label');
    label.innerText="列数：";
    div.appendChild(label);
    input=document.createElement('input');
    input.id="col";
    input.value=settings["col"];
    div.appendChild(input);

    //添加对象到页面中
    box.appendChild(div);
}

//作用：点击按钮时处理评论区内文本
//autoCheck：自动检验是否已修改过，修改过则不再更改
function convert_comment(e, autoCheck=true){
    //console.log(e);
    //console.log('ok');

    // 每次点击按钮都更新settings
    // 获取按钮的父元素
	var div = e.parentNode;
    if(!div){
        alert("未找到div，执行失败");
        throw Error("未找到div，执行失败");
    }
    var in1=div.querySelector('input#padChar');
    //然后获取参数值并修改参数值
    if(!in1){
        alert("未找到in1！将忽略更改padChar");
    }else{
        settings["padChar"]=in1.value;
    }
    var in2=div.querySelector('input#row');
    if(!in1){
        alert("未找到in2！将忽略更改row");
    }else{
        settings["row"]=parseInt(in2.value);
    }
    var in3=div.querySelector('input#col');
    if(!in3){
        alert("未找到in3！将忽略更改col");
    }else{
        settings["col"]=parseInt(in3.value);
    }
    //获取text中文本
    //先获取父结点
    var box = div.parentNode;
    if(!box){
        alert("未找到box，执行失败");
        throw Error("未找到box，执行失败");
    }
    var text=box.querySelector("div.box-normal textarea");
    if(!text){
        alert("未找到text，执行失败");
        throw Error("未找到text，执行失败");
    }
    //执行格式化函数，获取格式化后文本
    var rawStr=text.value;
    if(autoCheck && rawStr===lastNewStr){
        //说明修改过了，不再修改
        return;
    }
    //记录原文本，方便还原
    lastRawStr=rawStr;
    var newStr=normalization(rawStr, settings["padChar"], settings["row"], settings["col"]);
    lastNewStr=newStr;
    //修改评论区内字符串
    text.value=newStr;
    text.dispatchEvent(event);
}

//作用：点击按钮时还原评论区内文本
function revert_comment(e){
    //console.log(e);
    //console.log('ok');

    // 每次点击按钮都更新settings
    // 获取按钮的父元素
	var div = e.parentNode;
    if(!div){
        alert("未找到div，执行失败");
        throw Error("未找到div，执行失败");
    }
    //获取text中文本
    //先获取父结点
    var box = div.parentNode;
    if(!box){
        alert("未找到box，执行失败");
        throw Error("未找到box，执行失败");
    }
    var text=box.querySelector("div.box-normal textarea");
    if(!text){
        alert("未找到text，执行失败");
        throw Error("未找到text，执行失败");
    }
    //如果上一次的原文本存在，则赋值
    if(lastRawStr){
        text.value=lastRawStr;
        text.dispatchEvent(event);
    }
}

//作用：为每个评论框添加按钮
function insertAll(){
    //如果存在浮动评论窗
    // var box=document.querySelector('div.fixed-reply-box');
    // if(box){
    //     insertButton(box);
    // }
    //浮动评论窗也包含其中了，所以不需要额外的判断
    document.querySelectorAll('div.reply-box').forEach( (box) => { insertButton(box); });
}

(function() {
    'use strict';
    setInterval(insertAll, 500);
})();


