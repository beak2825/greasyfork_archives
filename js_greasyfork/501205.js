// ==UserScript==
// @name         蜀道公路建设管理平台自动填写!
// @namespace    http://tampermonkey.net/
// @version      2024-09-02 22点52分
// @description  用于私人项目自动填写
// @author       tearslee@917797065@qq.com
// @match        *://sdjg.scgsdsj.com/*
// @match        *://sdjg.scgsdsj.com/jsgl/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.1/papaparse.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scgsdsj.com
// @license MIT
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501205/%E8%9C%80%E9%81%93%E5%85%AC%E8%B7%AF%E5%BB%BA%E8%AE%BE%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%21.user.js
// @updateURL https://update.greasyfork.org/scripts/501205/%E8%9C%80%E9%81%93%E5%85%AC%E8%B7%AF%E5%BB%BA%E8%AE%BE%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%21.meta.js
// ==/UserScript==
(function () {
  'use strict';
  console.info("自动填写脚本开始运行！");
  let excelData;
  var iframe = document.getElementById('iframe');
  let appInstance = null;
  let checkItemInstance = null;
  console.log("iframe", iframe);
  var htmlStr;
  var myBtn = document.querySelector("#fileTips");
  // var fileInput = document.querySelector("#myFileInput");
  let button_read ;
  let button_gen ;
  let returnBtn = document.querySelector("#back-home");
  var lastModifiedTime = 0;
  let spanCode;
  let strSpan;
  let view = document.querySelector("#tags-view-container div.el-scrollbar__view");
  let reader = new FileReader();//文件阅读
  //启动定时器循环查找页面元素
  let timerId = setInterval(() => {
    returnBtn = document.querySelector("#back-home");
    if (returnBtn) {
      clearInterval(timerId);
      onload();
    }
  }, 500);

  function onload() {
    let smbox = document.querySelector("div.assistant-box-smaller");
    if (smbox) {
      smbox.remove();
    }
    // 调用函数
    addStyles(document);
    button_gen = document.createElement('button');
    button_gen.textContent = '数据生成';
    button_gen.className = 'fixed-button el-button--success';
    button_read = document.createElement('button');
    button_read.textContent = '数据读取';
    button_read.className = 'fixed-button el-button--danger';
    button_read.style.top='92%';
    // 将按钮添加到页面上
    document.body.appendChild(button_gen);
    document.body.appendChild(button_read);
    // htmlStr = '<div style="float:right;"><input type="file" id="myFileInput" style="display: none;"/><button class="el-button el-button--success el-button--small" id="mubanBtn" >数据生成</button><span id="fileTips" style="color: red; margin-right: 5px;">数据读取</span>' +
    // '</div> ';
    // htmlStr = '<div style="float:right;"><button class="el-button el-button--success el-button--small" id="mubanBtn" >数据生成</button><button id="readDataBtn" class="el-button el-button--danger el-button--small">数据读取</button>' +
    // '</div> ';
    returnBtn = document.querySelector("#back-home");
    iframe = document.getElementById('iframe');
    view = document.querySelector("#tags-view-container div.el-scrollbar__view");
    strSpan = '<span id="spanCode" style="color: red;margin-right: 40%;margin-top: 10px;float: right;">当前模板Code:</span>';
    if (returnBtn) {
      // returnBtn.insertAdjacentHTML("beforeBegin", htmlStr);
      view.insertAdjacentHTML("beforeEnd", strSpan);
      spanCode = view.querySelector("#spanCode");
      // // fileInput = returnBtn.parentElement.querySelector("#myFileInput");
      // readDataBtn = returnBtn.parentElement.querySelector("#readDataBtn");
      // mubanBtn = returnBtn.parentElement.querySelector("#mubanBtn");
      // mubanBtn.addEventListener('click', excuteC);
      // readDataBtn.addEventListener('click', excuteF);
      button_gen.addEventListener('click', excuteC);
      button_read.addEventListener('click', excuteF);
      console.log("已成功注入脚本按钮");
    } else {
      return;
    }
    // console.log("fileInput", fileInput);
    // if (fileInput) {
    //   // 当用户选择了文件后，你可以在这里添加处理逻辑
    //   fileInput.addEventListener('change', async function (e) {
    //     var file = e.target.files[0];
    //     console.log('文件已选择:', file);
    //     if (!file) {
    //       return;
    //     }
    //     fileTips.file = file;
    //     lastModifiedTime = file.lastModified;
    //     if (fileTips) {
    //       fileTips.textContent = file.name;
    //     }
    //     // 读取文件内容
    //     reader.readAsText(file);
    //   });
    // }

  }

  reader.onload = function (e) {
    let text = e.target.result;
    console.log('e.target.result:', text);
    Papa.parse(text, {
      header: true, // 如果CSV有标题行，则设置为true
      skipEmptyLines: true, // 跳过空行
      complete: function (results) {
        excelData = results.data;
        window.excelData = excelData
        console.log("解析后的数据", results.data); // 这里是解析后的CSV数据
        // readFile(true);
        addFileInput();
      }
    });
  };

  function findCheckItem(component) {
    if (component.$options.name === 'CheckItem' && component.checkDialogVisible) {
      checkItemInstance = component;
      return ;
    }
    for (let i = 0; i < component.$children.length; i++) {
      findCheckItem(component.$children[i]);
    }
  }

  //深拷贝
  function deepClone(obj) {
    if (obj === null) return null;
    if (typeof obj !== 'object') return obj;
    let clone = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = deepClone(obj[key]);
      }
    }
    return clone;
  }

  function excuteF() {
    iframe = document.getElementById('iframe');
    view = document.querySelector("#tags-view-container div.el-scrollbar__view");
    spanCode = view.querySelector("#spanCode");
    if(!spanCode){
      view.insertAdjacentHTML("beforeEnd", strSpan);
    }
    appInstance = iframe.contentWindow.document.querySelector('#app').__vue__;
    window.appInstance = appInstance;
    findCheckItem(appInstance);
    console.log("checkItemInstance", checkItemInstance);
    window.checkItemInstance = checkItemInstance;

    let form_values = checkItemInstance.form.values;
    console.log("form_values", form_values);
    window.form_values = form_values;
    spanCode.innerHTML = '当前模板Code:' + checkItemInstance.checkItemCode;
    let key_cData=checkItemInstance.itemData.checkItem+checkItemInstance.checkItemInfo.wbsId;
    let checkItemInfo=checkItemInstance.checkItemInfo;
    let jlcj=checkItemInfo.type;
    switch (checkItemInstance.checkItemCode) {
      case 'ZLL002' :
      case 'YJ001':
        if(!window.yj){
          window.yj={};
        }
        spanCode.innerHTML = '当前模板Code:' + checkItemInstance.checkItemCode+"【wbsId:"+checkItemInfo.wbsId+"】";
        if(jlcj==='JLCJ'){
          if(!window.yj[key_cData]){
            appInstance.$modal.msgError("未预先提取数据，无法自动填入！请先去对应质检项目"+checkItemInfo.wbsId+"提取参数");
          }else{
            let tempInfos=window.yj[key_cData];
            console.log("已提取值：",tempInfos);
            for(let key in tempInfos){
              //&& form_values.hasOwnProperty(key) && typeof(form_values[key])!='object'
              if(tempInfos.hasOwnProperty(key) && tempInfos[key] ){
                form_values[key]=tempInfos[key];
              }
            }
            appInstance.$modal.msgSuccess("复制数据"+checkItemInfo.wbsId+"成功！");
          }
        }else{
          spanCode.innerHTML = '当前模板Code:' + checkItemInstance.checkItemCode+"【wbsId:"+checkItemInfo.wbsId+"已提取数据】";
          window.yj[key_cData]=deepClone(form_values);
          window.yj.title=window.yj.title?window.yj.title:{};
          window.yj.title[checkItemInstance.title+checkItemInstance.itemData.checkItem]='</br>';
          console.log("提取数据：",window.yj);
          appInstance.$modal.msgSuccess("提取数据【"+checkItemInstance.itemData.checkItem+"】成功！");
        }
        break;
      case 'ZLS001':
        if(!window.yj){
          window.yj={};
        }
        
        spanCode.innerHTML = '当前模板Code:' + checkItemInstance.checkItemCode+"【wbsId:"+checkItemInfo.wbsId+"】";
        if(jlcj==='JLCJ'){
          console.log("key:",key_cData);
          if(!window.yj[key_cData]){
            appInstance.$modal.msgError("未预先提取数据，无法自动填入！请先去对应质检项目"+checkItemInstance.itemData.checkItem+"提取参数");
          }else{
            let tempInfos=window.yj[key_cData];
            console.log("已提取值：",tempInfos);
            for(let key in tempInfos){
              if(tempInfos.hasOwnProperty(key) && tempInfos[key] ){
                form_values[key]=tempInfos[key];
              }
            }
            appInstance.$modal.msgSuccess("复制数据"+checkItemInfo.wbsId+"成功！");
          }
        }else{
          spanCode.innerHTML = '当前模板Code:' + checkItemInstance.checkItemCode+"【wbsId:"+checkItemInfo.wbsId+"已提取数据】";
          window.yj[key_cData]=deepClone(form_values);
          window.yj.title=window.yj.title?window.yj.title:{};
          window.yj.title[checkItemInstance.title+checkItemInstance.itemData.checkItem]='</br>';
          appInstance.$modal.msgSuccess("提取数据【"+checkItemInstance.itemData.checkItem+"】成功！");
        }
        break;
      default:
        appInstance.$modal.msgError("无法提取数据！请截图联系给开发者"); 
        break;
    }
    if(!hasEventListener(spanCode,'click')){
      spanCode.addEventListener("click",function(){
        let html_str='<div id="myModal" class="modal"><div class="modal-content">'+
        '<span class="close">&times;</span>'+
        '<div id="objectDisplay" class="object-display"></div></div></div>';
        document.body.insertAdjacentHTML('beforeEnd',html_str);
        let div_container=document.getElementById("objectDisplay");
        displayObject(window.yj.title,div_container);
      });
    }
    // if (!fileInput) {
    //   fileInput = document.querySelector("#myFileInput");
    // }
    // fileInput.click();
  }
  function excuteC() {
    iframe = document.getElementById('iframe');
    view = document.querySelector("#tags-view-container div.el-scrollbar__view");
    spanCode = view.querySelector("#spanCode");
    if(!spanCode){
      view.insertAdjacentHTML("beforeEnd", strSpan);
    }
    appInstance = iframe.contentWindow.document.querySelector('#app').__vue__;
    window.appInstance = appInstance;
    findCheckItem(appInstance);
    console.log("checkItemInstance", checkItemInstance);
    window.checkItemInstance = checkItemInstance;
    let pcgs = checkItemInstance.pcgs
    let gdzhyxpc = checkItemInstance.form.query("gdzhyxpc").get("value");
    console.log(pcgs);
    let symbols_before = checkItemInstance.form.query("symbols_before").get("value");
    let table = checkItemInstance.$el.querySelector("div.formily-element-array-table");
    let inputs;
    if(table){
      inputs = table.querySelectorAll("input");
    }
    let inputEvent = new CustomEvent('input', {
      bubbles: true,
      cancelable: true,
    });
    let form_values = checkItemInstance.form.values;
    console.log("form_values", form_values);
    window.form_values = form_values;
    let temp_yxpc_key;
    let warpListKeys;
    let temp_item_key;
    spanCode.innerHTML = '当前模板Code:' + checkItemInstance.checkItemCode;
    switch (checkItemInstance.checkItemCode) {
      case 'XZHNTMBJC001':
        //模板安装检查
        let isLiangBan=0;  //是否是梁板，单独判断 是否是台帽
        if(checkItemInstance.checkItemData.indexOf('梁、板')!=-1){
          isLiangBan=1;
        }
        if(checkItemInstance.checkItemData.indexOf('台帽')!=-1){
          isLiangBan=2;
        }
        let select_input=form_values.select;
        spanCode.innerHTML = '当前模板Code:' + checkItemInstance.checkItemCode;
        if (form_values.isMultiple == "单规定值") {
          // let formgrid=checkItemInstance.$el.querySelector("div.formily-element-form-grid").__vue__;
          //模板高程基础
          let mbgcjcmm = form_values.mbgcjcmm;
          if(mbgcjcmm.sjz){
            let mbgcjcmm_data = generateRandomData(mbgcjcmm.list1.length, mbgcjcmm.gdzhyxpc, mbgcjcmm.sjz, '±');
            console.log("mbgcjcmm_data", mbgcjcmm_data);
            mbgcjcmm.list1.forEach(function (item, index) {
              let input = findInputEl(item);
              if(input){
                input.value = mbgcjcmm_data[index];
                input.dispatchEvent(inputEvent);
              }
              // item.pcz = mbgcjcmm_data[index];
            });
          }
          //模板内部尺寸
          let mbnbccjcmm = form_values.mbnbccjcmm;
          let gdzhyxpc_c=mbnbccjcmm.gdzhyxpc_c;
          let gdzhyxpc_k=mbnbccjcmm.gdzhyxpc_k;
          let gdzhyxpc_w=mbnbccjcmm.gdzhyxpc_w;
          symbols_before='≤';
          if(isLiangBan==1 && select_input!='墩台'){
            if(gdzhyxpc_c){
              let temp_pcz_c=gdzhyxpc_c.split('、').map(Number);
              gdzhyxpc_c=temp_pcz_c;
            }
            if(gdzhyxpc_k){
              let temp_pcz_k=gdzhyxpc_k.split('、').map(Number);
              gdzhyxpc_k=temp_pcz_k;
            }
            if(gdzhyxpc_w){
              let temp_pcz_w=gdzhyxpc_w.split('、').map(Number);
              gdzhyxpc_w=temp_pcz_w;
            }
            symbols_before='range';
          }
          if(mbnbccjcmm.xx==1){ //是否选择长宽 1 还是直径 2
            let mbnbccjcmm_dataC = generateRandomData(mbnbccjcmm.list2.length, gdzhyxpc_c, mbnbccjcmm.sjz_c, symbols_before);
            let mbnbccjcmm_dataK = generateRandomData(mbnbccjcmm.list2.length, gdzhyxpc_k, mbnbccjcmm.sjz_k, symbols_before);
            mbnbccjcmm.list2.forEach(function (item, index) {
              let dep = item.__ob__.dep;
              let table_row = null;
              dep.subs.forEach(function (e) {
                if (e.vm && e.vm.row) {
                  table_row = e.vm;
                }
              });
              let temp_inputs;
              if(table_row){
                temp_inputs = table_row.$el.querySelectorAll("input");
              }
              temp_inputs[0].value = mbnbccjcmm_dataC[index];
              temp_inputs[0].dispatchEvent(inputEvent);
              temp_inputs[1].value = mbnbccjcmm_dataK[index];
              temp_inputs[1].dispatchEvent(inputEvent);

              // item.pcz_c = mbnbccjcmm_dataC[index];
              // item.pcz_k = mbnbccjcmm_dataK[index];
            });
          }else{
            let mbnbccjcmm_dataW = generateRandomData(mbnbccjcmm.list2.length, gdzhyxpc_w, mbnbccjcmm.sjz_w, symbols_before);
            mbnbccjcmm.list2.forEach(function (item, index) {
              let input = findInputEl(item);
              if(input){
                input.value = mbnbccjcmm_dataW[index];
                input.dispatchEvent(inputEvent);
              }
              // item.pcz_w = mbnbccjcmm_dataW[index];
            });
          }
          //轴线偏移基础
          let zxpwjcmm = form_values.zxpwjcmm;
          let zxpwjcmm_data = generateRandomData(zxpwjcmm.list3.length, zxpwjcmm.gdzhyxpc, zxpwjcmm.sjz, '≤');
          console.log("zxpwjcmm_data", zxpwjcmm_data);
          zxpwjcmm.list3.forEach(function (item, index) {
            let input = findInputEl(item);
            if(input){
              input.value = zxpwjcmm_data[index];
              input.dispatchEvent(inputEvent);
            }
            // item.pcz = zxpwjcmm_data[index];
          });
          //模板表面平整
          let mbbmpzmm = form_values.mbbmpzmm;
          let mbbmpzmm_a = generateRandomData(mbbmpzmm.list5.length ? mbbmpzmm.list5.length : 4, 2, 0, '≤');
          let mbbmpzmm_b = generateRandomData(mbbmpzmm.list6.length ? mbbmpzmm.list6.length : 4, 5, 0, '≤');
          if (!mbbmpzmm.list5.length) {
            mbbmpzmm.list5.push({ pcz: mbbmpzmm_a.toString() });
          } else {
            mbbmpzmm.list5.forEach(function (e, i) {
              let input = findInputEl(e);
              if(input){
                input.value = mbbmpzmm_a[i];
                input.dispatchEvent(inputEvent);
              }
              // e.pcz = mbbmpzmm_a[i];
            });
          }
          if (!mbbmpzmm.list6.length) {
            mbbmpzmm.list6.push({ pcz: mbbmpzmm_b.toString() });
          } else {
            mbbmpzmm.list6.forEach(function (e, i) {
              let input = findInputEl(e);
              if(input){
                input.value = mbbmpzmm_b[i];
                input.dispatchEvent(inputEvent);
              }
              // e.pcz = mbbmpzmm_b[i];
            });
          }
          if(isLiangBan==1){
            form_values.ymjwzsfzq = '是';
          }else if(isLiangBan==2){
            form_values.ymjwzsfzq = '埋件位置准确';
          }else{
            form_values.ymjwzsfzq = '无预埋件';
          }
          form_values.jfqk = '接缝严密';
          form_values.zcwdqk = '支撑牢固';
          appInstance.$modal.msgSuccess("智能填写成功");
        } else {
          appInstance.$modal.msgError("暂时无法生成数据，如若需要请反馈给开发者QQ917797065");
        }
        break;
      
      case 'ZLL002' :
      case 'YJ001':
        if(!window.yj){
          window.yj={};
        }
        var checkItemInfo=checkItemInstance.checkItemInfo;
        spanCode.innerHTML = '当前模板Code:' + checkItemInstance.checkItemCode+"【wbsId:"+checkItemInfo.wbsId+"】";
        var jlcj=checkItemInfo.type;
        if(jlcj==='JLCJ'){
          if(!window.yj[checkItemInfo.wbsId]){
            appInstance.$modal.msgError("未预先提取数据，无法自动填入！请先去对应质检项目"+checkItemInfo.wbsId+"提取参数");
          }else{
            let tempInfos=window.yj[checkItemInfo.wbsId];
            console.log("已提取值：",tempInfos);
            for(let key in tempInfos){
              //&& form_values.hasOwnProperty(key) && typeof(form_values[key])!='object'
              if(tempInfos.hasOwnProperty(key) && tempInfos[key] ){
                form_values[key]=tempInfos[key];
              }
            }
            appInstance.$modal.msgSuccess("提取数据"+checkItemInfo.wbsId+"成功！");
          }
        }else{
          spanCode.innerHTML = '当前模板Code:' + checkItemInstance.checkItemCode+"【wbsId:"+checkItemInfo.wbsId+"已提取数据】";
          window.yj[checkItemInfo.wbsId]=deepClone(form_values);
          // window.yj.title=window.yj.title?window.yj.title:[];
          // window.yj.title.push(checkItemInstance.title);
          // window.yj.title.push("/n");
          // console.log("提取数据：",window.yj);
          // if(!hasEventListener(spanCode,'click')){
          //   spanCode.addEventListener("click",function(){
          //     appInstance.$msgbox(window.yj.title.toString());
          //   });
          // }
        }
        break;
      case 'DMCCDDFLH002':
        symbols_before = 'range';
        let pcz = [form_values.gdzhyxpc_min, form_values.gdzhyxpc_max]
        let list = form_values.list;
        let tempDatad = generateRandomData(list.length, pcz, form_values.sjzd, symbols_before);
        let tempDatadi = generateRandomData(list.length, pcz, form_values.sjzdi, symbols_before);
        let tempDatadfbh = generateRandomData(list.length, pcz, form_values.sjzfbh, symbols_before);
        console.log('tempDatad', tempDatad);
        console.log('tempDatadi', tempDatadi);
        console.log('tempDatadfbh', tempDatadfbh);
        list.forEach(function (item, index) {
          let table_row = item.__ob__.dep.subs[5].vm;
          inputs = table_row.$el.querySelectorAll("input");
          inputs[0].value = tempDatad[index];
          inputs[1].value = tempDatadi[index];
          inputs[2].value = tempDatadfbh[index];
          inputs[0].dispatchEvent(inputEvent);
          inputs[1].dispatchEvent(inputEvent);
          inputs[2].dispatchEvent(inputEvent);
          // table_row.row.sczd=tempDatad[index];
          // table_row.row.sczdi=tempDatadi[index];
          // table_row.row.sczfbh=tempDatadfbh[index];
        });
        appInstance.$modal.msgSuccess("智能填写成功");
        break;
      case 'GJGJ002':
        gdzhyxpc = form_values.gdzhyxpc;
        symbols_before = '±';
        let sjz_d = form_values.sjz_d;
        let sjz_h = form_values.sjz_h;
        let sjz_w = form_values.sjz_w;
        let xx = form_values.xx;
        if(xx==1){
          let datad = generateRandomData(inputs.length, gdzhyxpc, sjz_d, symbols_before);
          let datah = generateRandomData(inputs.length, gdzhyxpc, sjz_h, symbols_before);
          inputs.forEach(function (input, index) {
            if (index % 2 === 0) {
              input.value = datad[index];
            } else {
              input.value = datah[index];
            }
            input.dispatchEvent(inputEvent);
          });
        }else{
          let dataw=generateRandomData(inputs.length, gdzhyxpc, sjz_w, symbols_before);
          let list=form_values.list1;
          list.forEach((item,index)=>{
            let dep = item.__ob__.dep;
            let table_row = null;
            dep.subs.forEach(function (e) {
              if (e.vm && e.vm.row) {
                table_row = e.vm;
              }
            });
            let input = table_row.$el.querySelector("input");
            input.value = dataw[index];
            input.dispatchEvent(inputEvent);
          });

        }
        appInstance.$modal.msgSuccess("智能填写成功");
        break;
      case 'ZLS001':
        if(!window.zls){
          window.zls={};
        }
        if (Number(form_values.sjz) != 0) {
          symbols_before = '≥';
        } else {
          symbols_before = '±';
        }
        let tempList = form_values.list;
        let tempData = generateRandomData(tempList.length, gdzhyxpc, form_values.sjz, symbols_before);
        inputs.forEach(function (input, index) {
          input.value = tempData[index];
          input.dispatchEvent(inputEvent);
          input.addEventListener('keydown', function (event) {
            if (event.keyCode === 32) {
              event.preventDefault();
              var nextInput = inputs[index + 1];
              if (nextInput) {
                nextInput.focus();
              }
            }
          });
        });
        appInstance.$modal.msgSuccess("智能填写成功");
        break;
      case 'SLGJ001':
      case 'SLGJ002':
        form_values.isMultiple = "多规定值";
        warpListKeys = ['listWarp'];
        temp_yxpc_key = 'gdzhyxpc';
      case 'SLGJ003':
        form_values.isMultiple = "多规定值";
        warpListKeys = ['listWarp'];
        temp_yxpc_key = 'gdzhyxpc';
      case 'GJJJ001':
        symbols_before = '±';
        let isMultiple = false;
        if (form_values.isMultiple == "多规定值") {
          isMultiple = true;
          if (!warpListKeys)
            warpListKeys = ['listWarp', 'listWarp1', 'listWarp2', 'listWarp3'];
          // warpListKeys = allKeys.filter(key => key.startsWith('listWarp'));
        } else {
          if (!warpListKeys)
            warpListKeys = ['list', 'list1', 'list2', 'list3'];
          // warpListKeys = allKeys.filter(key => key.startsWith('list'));
          // appInstance.$modal.msgError("正在制作生成方法，请等待更新！");
        }
        warpListKeys.forEach((key, key_index) => {
          if (Array.isArray(form_values[key])) {
            let list = form_values[key];
            let temp_sjz_key = key_index ? 'sjz' + key_index : 'sjz';
            if (!temp_yxpc_key) {
              temp_yxpc_key = key_index ? 'yxpc' + key_index : 'yxpc';
            }
            if (!temp_item_key) {
              temp_item_key = key_index ? 'list' + key_index : 'list';
            }
            let temp_yxpc_value = form_values[temp_yxpc_key];
            if (!isMultiple) {
              let tempSjz = form_values[temp_sjz_key] ? form_values[temp_sjz_key] : 0;
              if (!tempSjz) {
                // sjz为空代表不用填写
                return;
              };
              let tempData = generateRandomData(list.length, temp_yxpc_value, tempSjz, symbols_before);
              list.forEach(function (item,index2) {
                let input=findInputEl(item);
                input.value = tempData[index2];
                input.dispatchEvent(inputEvent);
              });
            } else {
              list.forEach(function (item) {
                let tempSjz = item[temp_sjz_key] ? item[temp_sjz_key] : 0;
                if (!tempSjz) {
                  // sjz为空代表不用填写
                  return;
                };
                let temp_list = item[temp_item_key];
                let tempData = generateRandomData(temp_list.length, temp_yxpc_value, tempSjz, symbols_before);
                temp_list.forEach(function (item2, index2) {
                  let input = findInputEl(item2);
                  input.value = tempData[index2];
                  input.dispatchEvent(inputEvent);
                });
              });
            }
          }
        });
        appInstance.$modal.msgSuccess("智能填写成功");
        break;
      default:
        if (symbols_before && symbols_before == '≤') {
          let tempData = generateRandomData(inputs.length, gdzhyxpc, 0, symbols_before);
          inputs.forEach(function (input, index) {
            input.value = tempData[index];
            input.dispatchEvent(inputEvent);
            input.addEventListener('keydown', function (event) {
              if (event.keyCode === 32) {
                // 阻止默认的空格行为（可选）  
                event.preventDefault();
                var nextInput = inputs[index + 1];
                if (nextInput) {
                  nextInput.focus();
                }
              }
            });
          });
          appInstance.$modal.msgSuccess("智能填写成功");
        } else if (pcgs && pcgs.indexOf(',') != -1) {
          let arr = pcgs.slice(1, -1) // 移除方括号
            .split(',')
            .map(Number);
          if (arr.length == 2) {
            if (Math.abs(arr[0]) == Math.abs(arr[1])) {
              symbols_before = '±';
            } else {
              symbols_before = 'range'
            }
          }
          let sjzc = form_values.sjzc;
          let sjzk = form_values.sjzk;
          let sjzw = form_values.sjzw;
          if (symbols_before == '±') {
            if (sjzw || form_values.sjz) {
              let tempData = generateRandomData(inputs.length, gdzhyxpc, form_values.sjz ? form_values.sjz : sjzw, symbols_before);
              inputs.forEach(function (input, index) {
                input.value = tempData[index];
                input.dispatchEvent(inputEvent);
              });
              appInstance.$modal.msgSuccess("智能填写成功");
            } else if (sjzc && sjzk) {
              let dataC = generateRandomData(inputs.length, gdzhyxpc, sjzc, symbols_before);
              let datak = generateRandomData(inputs.length, gdzhyxpc, sjzk, symbols_before);
              inputs.forEach(function (input, index) {
                if (index % 2 === 0) {
                  input.value = dataC[index];
                } else {
                  input.value = datak[index];
                }
                input.dispatchEvent(inputEvent);
              });
              appInstance.$modal.msgSuccess("智能填写成功");
            } else if (form_values.list && form_values.list.length) {
              let list1 = form_values.list;
              let tempData = generateRandomData(list1.length, gdzhyxpc, form_values.sjz, symbols_before);
              inputs.forEach(function (input, index) {
                input.value = tempData[index];
                input.dispatchEvent(inputEvent);
              });
              appInstance.$modal.msgSuccess("智能填写成功");
            } else {
              appInstance.$modal.msgError("无法生成数据！请截图联系开发者");
            }
          } else if (symbols_before == 'range' && form_values.sjz) {
            let tempData = generateRandomData(inputs.length, arr, form_values.sjz, symbols_before);
            inputs.forEach(function (input, index) {
              input.value = tempData[index];
              input.dispatchEvent(inputEvent);
              input.addEventListener('keydown', function (event) {
                if (event.keyCode === 32) {
                  event.preventDefault();
                  var nextInput = inputs[index + 1];
                  if (nextInput) {
                    nextInput.focus();
                  }
                }
              });
            });
            appInstance.$modal.msgSuccess("智能填写成功");
          } else {
            appInstance.$modal.msgError("无法生成数据！请截图联系给开发者");
          }
        } else {
          appInstance.$modal.msgError("无法生成数据！请截图联系给开发者");
        }
    }
  }

  //根据代理值查找代理输入框
  function findInputEl(item){
    let dep = item.__ob__.dep;
    let table_row = null;
    if(dep){
      dep.subs.forEach(function (e) {
        if (e.vm && e.vm.row) {
          table_row = e.vm;
        }
      });
    }else{
      appInstance.$modal.msgError("出现错误，无法找到代理dep值！");
      console.error("出现错误，无法找到代理dep！",item);
      return null;
    }
    if(table_row){
      let input = table_row.$el.querySelector("input");
      return input;
    }else{
      appInstance.$modal.msgError("出现错误，无法找到代理输入框！");
      console.error("出现错误，无法找到代理输入框！",item);
      return null;
    }
  }
  //文件选择输入框刷新
  function addFileInput() {
    fileInput.remove();
    let htmlStr = '<input type="file" id="myFileInput" style="display: none;">';
    myBtn.parentElement.insertAdjacentHTML("afterbegin", htmlStr);
    fileInput = myBtn.parentElement.querySelector("#myFileInput");
    if (fileInput) {
      // 当用户选择了文件后，你可以在这里添加处理逻辑
      fileInput.addEventListener('change', async function (e) {
        var file = e.target.files[0];
        console.log('文件已选择:', file);
        if (!file) {
          return;
        }
        myBtn.file = file;
        lastModifiedTime = file.lastModified;
        if (fileTips) {
          fileTips.innerHTML = file.name;
        }
        // 读取文件内容
        reader.readAsText(file);
      });
    }
  }


  function hasEventListener(element, eventName) {
    if (window.getEventListeners) {
      const listeners = window.getEventListeners(element);
      return Boolean(listeners && listeners[eventName] && listeners[eventName].length > 0);
    }else{
      console.error("不支持判断");
      return false;
    }
  }

  //num:随机数数量 pcz:偏差值范围，sjz：设计值 symbols_before:偏差值符号
  function generateRandomData(num, pcz, sjz = 0, symbols_before) {
    let data = [];
    // 获取输入框中的值
    let deviation = 0;
    let deviationR = 0;
    let minValue = 0;
    let maxValue = 0;
    let sjzd = parseInt(Number(sjz));
    // 确定随机数的范围  
    if (symbols_before == '≤') {
      deviation = parseInt(Number(pcz));
      minValue = sjzd;
      maxValue = sjzd + deviation;
    } else if (symbols_before == '≥') {
      deviation = parseInt(Number(pcz));
      minValue = sjzd;
      maxValue = sjzd + deviation;
    } else if (symbols_before == '±' && (sjzd || sjzd == 0)) {
      deviation = parseInt(Number(pcz));
      minValue = sjzd - deviation;
      maxValue = sjzd + deviation;
    } else if (symbols_before == 'range' && typeof (pcz) == 'object' && pcz.length == 2) {
      deviation = parseInt(Number(pcz[0]));
      deviationR = parseInt(Number(pcz[1]));
      // 如果最小偏差值大于最大偏差值，则交换它们  
      if (deviationR != 0 && deviation > deviationR) {
        [deviation, deviationR] = [deviationR, deviation];
      }
      minValue = sjzd + deviation;
      maxValue = sjzd + deviationR;
    }
    // 生成随机正整数的函数  
    function getRandomPositiveInteger() {
      // 生成一个范围内的随机整数  
      return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    }
    // 创建一个数组来保存数据  
    for (var i = 0; i < num; i++) {
      data.push(getRandomPositiveInteger());
    }
    console.log("生成随机数：", data);
    return data;
  }

  // 动态创建 CSS 样式
function addStyles(document) {
  const style = document.createElement('style');
  style.textContent = `
  .modal {
    display: none; /* 隐藏模态对话框 */
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4); /* 背景颜色 */
  }

  .modal-content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% 从顶部和居中 */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* 宽度 */
    max-height: 80%;
    overflow-y: auto;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
      .fixed-button {
          position: fixed;
          top: 88%;
          right: 0;
          transform: translateY(-50%);
          padding: 10px 20px;
          color: white;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
          z-index: 9999;
      }
    .fixed-button:hover { 
          background-color: #666;
      }
      .object-display {
        font-family: monospace;
        white-space: pre-wrap;
        padding: 10px;
        border: 1px solid #ccc;
        background-color: #f8f8f8;
      }
      .object-key {
        font-weight: bold;
      }
      .object-value {
        color: #007acc;
      }
      .object-array-index {
        color: #007acc;
      }
  `;
  document.head.appendChild(style);
}

function displayObject(obj, container) {
  // 递归函数来遍历对象
  function traverseObject(obj, prefix = '') {
    let html = '';
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        html += '<span class="object-array-index">[</span>';
        obj.forEach((item, index) => {
          html += `<span class="object-array-index">${index}: </span>${traverseObject(item, prefix)}${index !== obj.length - 1 ? ', ' : ''}`;
        });
        html += '<span class="object-array-index">]</span>';
      } else {
        html += '<span class="object-object">{</span>';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            html += `<span class="object-key">${prefix}${key}: </span>${traverseObject(obj[key], `${prefix}  `)}${Object.keys(obj).indexOf(key) !== Object.keys(obj).length - 1 ? ', ' : ''}`;
          }
        }
        html += '<span class="object-object">}</span>';
      }
    } else {
      html += `<span class="object-value">${obj}</span>`;
    }
    return html;
  }

  // 清空容器
  container.innerHTML = '';
  // 开始遍历
  container.innerHTML = traverseObject(obj);
  // 显示模态对话框
  const modal = document.getElementById("myModal");
  modal.style.display = "block";

  // 关闭按钮事件
  const closeBtn = document.getElementsByClassName("close")[0];
  closeBtn.onclick = function() {
    modal.style.display = "none";
  };

  // 点击模态对话框外部时关闭
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

})();