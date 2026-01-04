// ==UserScript==
// @name         学法 如法网 12348  湖南学法
// @namespace    需要定制脚本+v:zihuizixin
// @version      1.7
// @description  进入课程后自动执行|自动学习小节|需要定制脚本/其他+v:zihuizixin
// @author       MEN
// @match        http://hn.12348.gov.cn/fxmain/subpage/legalpublicity/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475594/%E5%AD%A6%E6%B3%95%20%E5%A6%82%E6%B3%95%E7%BD%91%2012348%20%20%E6%B9%96%E5%8D%97%E5%AD%A6%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/475594/%E5%AD%A6%E6%B3%95%20%E5%A6%82%E6%B3%95%E7%BD%91%2012348%20%20%E6%B9%96%E5%8D%97%E5%AD%A6%E6%B3%95.meta.js
// ==/UserScript==

(function() {
    const $X = {
    wait: async (milliseconds) => {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
   };

     const query = async () =>{//查询是否存在答题模块
        if (document.querySelector('form[class="questions"]')) {
            // 元素存在
            console.log('存在答题');
            for(var i=1;i<=12;i++){
                  answer(i).then((result) => {
                      if(result ==1){
                          console.log("答题函数出现未知异常，结束当前答题线程")
                          return
                      }
                  });
                 await $X.wait(35000);
            }
            await $X.wait(35000);
            clickNextPage();
        }else{
           console.log("找不到答题模块")
           await $X.wait(35000);
           clickNextPage();
        }
    }
    const clickNextPage = async () =>{//点击下一页
        var page = document.querySelector(".gz_sq_an");
        var nextPage = page.querySelector("a.next");
        if (nextPage) {
            // 如果找到了下一页按钮
            nextPage.click(); // 模拟点击下一页按钮
            console.log("进入下页，重新执行答题")
            await $X.wait(60000);
            query()
        } else {
            console.log("未找到下一页按钮");
            alert("没有找到下一页，可能答题结束!")
        }
    }
     const answer = async(count) =>{//答题模块
        console.log('第'+count+"次答题");
        var formElement = document.querySelector('form[class="questions"]');
        if (formElement) {
            var neiinput = formElement.querySelectorAll('div[class="neiinput"]');
           /** if(count==1){
                     console.log("强制设置初始化值")
                     const radioButtons = document.querySelectorAll('input[type="radio"]');
                     radioButtons.forEach(radioButton => {
                         radioButton.checked = false;
                     });
                     const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                     checkboxes.forEach(checkbox => {
                      checkbox.checked = false;
                     });

                    var key = document.querySelectorAll('[value="A"]')
                   if(key.length>0){
                       for (var j = 0; j < key.length; j++) {
                         key[j].click()
                       }
                     save();
                     await $X.wait(35000);
                 }} **/
             try{
            if (neiinput.length > 0) {
             for (var i = 0; i < neiinput.length; i++) {
                 var flage = neiinput[i].querySelector('input[class="empty an answerfalse"]') //该题为单选错误
                 var flage1 = neiinput[i].querySelector('input[class="test an answerfalse"]') //该题为多选错误
                 var flage2= neiinput[i].querySelector('input[class="test an answerfalse answerxz')


                   var tmp
                 if(flage){
                     console.log("开始选择单选答案")
                     switch (count) {
                         case 1:
                             tmp = 'input[type="radio"][value="A"]'
                             break;
                         case 2:
                             tmp = 'input[type="radio"][value="B"]'
                             break;
                         case 3:
                             tmp = 'input[type="radio"][value="C"]'
                             break;
                         case 4:
                             tmp = 'input[type="radio"][value="D"]'
                             break;
                         default:
                             console.log("无效的选择");
                             tmp =false
                             break;
                     }
                 }else{
                     if(count ==1){
                     tmp = 'input[type="radio"][value="A"]'}
                 }
                   if(tmp){
                         try{
                         neiinput[i].querySelector(tmp).click()}catch (error) {
                console.log("单选出现异常"+error)
          }
                     }

                 var tmp1
                 if(flage1 || flage2){
                     console.log("开始选择多选选答案")
                     const checkboxes = neiinput[i].querySelectorAll('input[type="checkbox"]');
                     checkboxes.forEach(checkbox => {
                      checkbox.checked = false;
                     });
                     switch (count) {
                         case 1:
                             tmp1 = 'input[type="checkbox"][value="A"]'
                             break;
                         case 2:
                             tmp1 = 'input[type="checkbox"][value="B"]'
                             break;
                         case 3:
                             tmp1 = 'input[type="checkbox"][value="C"]'
                             break;
                         case 4:
                             tmp1 = 'input[type="checkbox"][value="D"]'
                             break;
                         case 5:
                             var tmp51 = 'input[type="checkbox"][value="A"]'
                             var tmp52 = 'input[type="checkbox"][value="B"]'
                             neiinput[i].querySelector(tmp51).click()
                             neiinput[i].querySelector(tmp52).click()
                             break;
                         case 6:
                             var tmp61 = 'input[type="checkbox"][value="A"]'
                             var tmp62 = 'input[type="checkbox"][value="C"]'
                             neiinput[i].querySelector(tmp61).click()
                             neiinput[i].querySelector(tmp62).click()
                             break;
                         case 7:
                             var tmp71 = 'input[type="checkbox"][value="A"]'
                             var tmp72 = 'input[type="checkbox"][value="D"]'
                             neiinput[i].querySelector(tmp71).click()
                             neiinput[i].querySelector(tmp72).click()
                             break;
                         case 8:
                             var tmp81 = 'input[type="checkbox"][value="A"]'
                             var tmp82 = 'input[type="checkbox"][value="B"]'
                             var tmp83 = 'input[type="checkbox"][value="C"]'
                             neiinput[i].querySelector(tmp81).click()
                             neiinput[i].querySelector(tmp82).click()
                             neiinput[i].querySelector(tmp83).click()
                             break;
                         case 9:
                             var tmp91 = 'input[type="checkbox"][value="A"]'
                             var tmp92 = 'input[type="checkbox"][value="B"]'
                             var tmp93 = 'input[type="checkbox"][value="D"]'
                             neiinput[i].querySelector(tmp91).click()
                             neiinput[i].querySelector(tmp92).click()
                             neiinput[i].querySelector(tmp93).click()
                             break;
                         case 10:
                             var tmp101 = 'input[type="checkbox"][value="A"]'
                             var tmp102 = 'input[type="checkbox"][value="C"]'
                             var tmp103 = 'input[type="checkbox"][value="D"]'
                             neiinput[i].querySelector(tmp101).click()
                             neiinput[i].querySelector(tmp102).click()
                             neiinput[i].querySelector(tmp103).click()
                             break;
                         case 11:
                             var tmp111 = 'input[type="checkbox"][value="B"]'
                             var tmp112 = 'input[type="checkbox"][value="C"]'
                             var tmp113 = 'input[type="checkbox"][value="D"]'
                             neiinput[i].querySelector(tmp111).click()
                             neiinput[i].querySelector(tmp112).click()
                             neiinput[i].querySelector(tmp113).click()
                             break;
                         case 12:
                             var tmp121 = 'input[type="checkbox"][value="A"]'
                             var tmp122 = 'input[type="checkbox"][value="B"]'
                             var tmp123 = 'input[type="checkbox"][value="C"]'
                             var tmp124 = 'input[type="checkbox"][value="D"]'
                             neiinput[i].querySelector(tmp121).click()
                             neiinput[i].querySelector(tmp122).click()
                             neiinput[i].querySelector(tmp123).click()
                             neiinput[i].querySelector(tmp124).click()
                             break;
                         default:
                             console.log("无效的选择");
                             tmp1 =false
                             break;
                     }
                 }else{
                     if(count ==1){
                   tmp1 = 'input[type="checkbox"][value="A"]'}
                 }
                  if(tmp1){
                              try{
                         neiinput[i].querySelector(tmp1).click()}catch (error) {
                console.log("多选出现异常"+error)
          }
                     }
               }
            } else {
                console.log("找不到题目")
            }
         }catch (error) {
                console.log(error)
          }
         console.log('提交答案');
         save();
        } else {
            console.log('未找到 <form> 元素，等待50秒后切换下一张');
            await $X.wait(35000);
            clickNextPage();
            return 1;
        }
    }
     const save = async () =>{
       document.getElementById('btn_code').click()
    }
         setTimeout(query, 10000);
         
         function refreshPage() {
  location.reload(); // 刷新当前页面
}

// 每半个小时（1800000毫秒）执行一次刷新
setInterval(refreshPage, 3600000);
         

 })();