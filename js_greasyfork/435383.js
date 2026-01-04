
// ==UserScript==
// @name           西南网教(辅助答题)
// @namespace      https://github.com/zaxtseng/Southwest-Assistant
// @version        0.0.3
// @description    西南网教答题助手
// @include        *://zuoye.eduwest.com/*
// @run-at         document-end
// @require        https://code.jquery.com/jquery-3.6.0.min.js
// @author         zax
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/435383/%E8%A5%BF%E5%8D%97%E7%BD%91%E6%95%99%28%E8%BE%85%E5%8A%A9%E7%AD%94%E9%A2%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435383/%E8%A5%BF%E5%8D%97%E7%BD%91%E6%95%99%28%E8%BE%85%E5%8A%A9%E7%AD%94%E9%A2%98%29.meta.js
// ==/UserScript==
(function () {
  'use strict';

  let currentUrl = window.location.href;
  const reHomework = /homeworkquestions/i;
  const reSeeHomework = /seeHomework.do/i;

  if (reHomework.test(currentUrl)) {
    //单选题元素(input name="danxuanti")
    const checkElements = $("[name=danxuanti]");
    const radioElements = $("[name=panduanti]"); //本题参考答案

    let innerTextNow = $('#button')[0].children[1].innerText;
    let nextBtn = $('#next')[0]; //下一页

    let submitBtn = $('#preservation1')[0]; //提交
    //多选题元素

    const checkboxElements = $('#duoxuantiyz .duxt input');
    const mapping = {
      'A': 0,
      'B': 1,
      'C': 2,
      'D': 3,
      'E': 4,
      'F': 5
    }; //单选题
    //点击第一个

    if (checkElements.length) {
      console.log("单选"); //是单选题(第一次标记)

      let flag = Array.prototype.every.call(checkElements, item => !item.checked);

      if (flag) {
        //未点击过
        checkElements[0].click(); //点第一个
        //点击提交

        submitBtn.click();
      } else {
        //先判断是否做完,出现参考答案,已提交的肯定做完的,
        let currentIndex = Array.prototype.findIndex.call(checkElements, item => item.checked);

        if (innerTextNow.indexOf('本题参考答案') > -1) {
          //判断答案是否正确,正确在点击下一页,否则,点击正确答案
          function submit(idx) {
            checkElements[idx].click();
            submitBtn.click();
          }

          switch (innerTextNow.slice(-1)) {
            case 'A':
              currentIndex == 0 ? nextBtn.click() : submit(0);
              break;

            case 'B':
              currentIndex == 1 ? nextBtn.click() : submit(1);
              break;

            case 'C':
              currentIndex == 2 ? nextBtn.click() : submit(2);
              break;

            case 'D':
              currentIndex == 3 ? nextBtn.click() : submit(3);
              break;
          }
        } else {
          //点击过,但是没有点击对,点击当前项目的下一个
          checkElements[currentIndex + 1].click(); //点击提交

          console.log('按顺序点击');
          submitBtn.click();
        }
      }
    } else if (checkboxElements.length) {
      //多选
      console.log("多选"); //是否出现正确
      // let innerTextPan = $('#duoxuantiyz span')[1].innerText

      let innerTextPan = $('#duoxuantiyz span'); //>2才有提示

      if (innerTextPan.length > 1 && innerTextPan[1].innerText.indexOf('正确') > -1) {
        //点击下一页
        console.log('下一页');
        nextBtn.click();
      } else {
        if (innerTextNow.indexOf('本题参考答案') > -1) {
          //将答案取出来,遍历点击后,提交,出现正确,下一页
          let arr = innerTextNow.slice(8).split(' ');
          arr.map(item => {
            if (!checkboxElements[mapping[item]].checked) {
              checkboxElements[mapping[item]].click();
            }
          }); //判断第一个是否需要点击

          let flag1 = arr.some(item => item == 'A');

          if (flag1) {
            checkboxElements[0].checked ? '' : checkboxElements[0].click();
          } else {
            checkboxElements[0].click();
          } //提交


          submitBtn.click(); // nextBtn.click()
        } else {
          //按照数组遍历点击
          //点击第一个
          let flag = Array.prototype.every.call(checkboxElements, item => !item.checked);

          if (flag) {
            checkboxElements[0].click();
          } //提交


          submitBtn.click();
        }
      }
    } else if (radioElements.length) {
      //判断题
      console.log("判断"); //是单选题(第一次标记)

      let flag = Array.prototype.every.call(radioElements, item => !item.checked);

      if (flag) {
        //未点击过
        console.log('点第一个');
        radioElements[0].click(); //点第一个
        //点击提交

        submitBtn.click();
      } else {
        //先判断是否做完,出现参考答案,已提交的肯定做完的,
        let innerTextPan = $('#shiti_1 span');

        if (innerTextPan.length > 1 && innerTextPan[1].innerText.indexOf('正确') > -1) {
          //点击下一页
          console.log('下一页');
          nextBtn.click();
        } else {
          //点击过,但是没有点击对,点击当前项目的下一个
          let currentIndex = Array.prototype.findIndex.call(radioElements, item => item.checked);

          if (currentIndex == 0) {
            console.log('切换第二个');
            radioElements[1].click();
          } else {
            console.log('切换第一个');
            radioElements[0].click();
          } //点击提交


          console.log('按顺序点击');
          submitBtn.click();
        }
      }
    } else {
      //问答题
      //stop
      console.log('自己写');
    }
  } else if (reSeeHomework.test(currentUrl)) {
    //查看
    //按钮,点击生成
    let titleTxt = $('body')[0].children[0].innerText.replace(/\s*/g,"")
    let shiti = $('#Container .shitiTable');
    let finStr = ''; //input的父元素的innerText

    Array.prototype.map.call(shiti, item => {
      //单选,多选,判断题
      let liElements = $(item).find('li label');
      let ansList = Array.prototype.filter.call(liElements, (i, idx) => $(i).find("input")[0].nextElementSibling);
        let newList = Array.prototype.map.call(ansList,item =>item.innerText.replace(/\s*/g,""))

      let jiandaList = Array.prototype.filter.call(liElements, (i, idx) => $(i).length == 0); //参考答案

      let answer = '\r\n参考答案:' + newList.join(',') + '\r\n\r\n'
        if($(item).find('li label').length){
      finStr = finStr + item.innerText.replace(/\s*/g,"") + answer
    }else{
      finStr = finStr + item.innerText.replace(/\s*/g,"")+ '\r\n\r\n'
    }
      return finStr;
    }); //导出finStr,生成按钮

    let btnDownload = {
      id: 'btnEasyHelper',
      text: '下载',
      title: '下载',
      html: function () {
        return `
              <span class="text" style="width: 60px;
              margin: 5px 0px;
              border: 1px solid;
              border-radius: 5px;
              padding: 5px 10px;
              color: #fff;
              background-color: #5F9AED;
              };">${this.text}</span>
      `;
      }
    };
    let btn = document.createElement('div');
    btn.id = btnDownload.id;
    btn.title = btnDownload.title;
    btn.innerHTML = btnDownload.html();
    btn.style.cssText = 'margin: 0px;width: 80px;float: right;';
    btn.addEventListener('click', function (e) {
      initButtonEvent()
      e.preventDefault();
    });
    $('#duanluo1')[0].appendChild(btn);
    function initButtonEvent(){
      console.log('文件下载');
      //文件生成
      const blob_url = URL.createObjectURL(new Blob([finStr], { type:'text/plain;charset=utf-8;'}))
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blob_url;
      a.download = titleTxt;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blob_url);
    }
  } //文件类型
  //txt文件
  //{type:'text/plain'};utf-8
  //doc文件
  //{type:'application/msword'};utf-8

})();
