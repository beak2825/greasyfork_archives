// ==UserScript==
// @name         douQAQ
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  终极批量提交的工具
// @author       kinjaz
// @match        https://netstation2.aplus.co.jp/netstation/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/449873/douQAQ.user.js
// @updateURL https://update.greasyfork.org/scripts/449873/douQAQ.meta.js
// ==/UserScript==

(function() {
    // 起始值 (0000 - 9999 之间,想要从头开始循环的话，起始值不能一样，比如0000再次从0000开始 可以先改0001保存然后再改 0000 保存 不然代码无法识别起始值是否改变)
    var index = '0000'
    // 信息
    var acces
    // 暗文
    var ciphertext
    // debugger

    // 当起始值有值说明设定了起始值
    if(index){
        // 判断是否缓存了起始值index
       if(GM_getValue('index')&&(index!= GM_getValue('index'))){
          // 若缓存了index 则 根据缓存得起始值对比 相同说明没有调整循环得值 继续按照循环逻辑走
              // 如果和缓存的值不一样，则覆盖
              GM_setValue('zw_test', index);
              GM_setValue('index', index);
       }else if (!GM_getValue('index')){
           GM_setValue('zw_test', index);
           GM_setValue('index', index);
       }

    }
    // 判断浏览器是否有暗文
    if(GM_getValue('zw_test')){
        // 有值直接覆盖
        ciphertext = GM_getValue('zw_test')
        if(ciphertext ==='0000'||ciphertext ==='-1'){
            ciphertext = "-1"
            ciphertext = setInterval(ciphertext)
        }
    }else{
        // 无值则赋一个起步值 （默认是从0000开始，可以更改.-1 就等于 0000 因为是自增）
        ciphertext = index
        GM_setValue('zw_test', ciphertext);
        console.log(GM_getValue('zw_test'));
    }
    //判断成功或者错误
    if(document.getElementsByClassName("title-lv1")){
         acces = document.getElementsByClassName("title-lv1")[0].innerText
    }
    // 有值说明报错，+1 继续尝试
    if(acces.indexOf('5039')!=-1){
        // acces 有值说明报错了 ，直接赋值+1继续试试
        ciphertext = setInterval(ciphertext)
        // 存入浏览器缓存
        GM_setValue('zw_test', ciphertext);
        //看是否有返回按钮，有直接返回继续执行
        if(document.getElementsByClassName('btn btn-base btn-m btn-second mb-none')){
            document.getElementsByClassName('btn btn-base btn-m btn-second mb-none')[0].click()
        }
        //txText()
    }else {
        // acces 有值说明报错了 ，直接赋值+1继续试试
        // ciphertext = setInterval(ciphertext)
        // 存入浏览器缓存
        // GM_setValue('zw_test', ciphertext);

        txText()
    }
    // 填写基本信息方法
    function txText(){
      // 基础数据
        document.getElementById('card01').value = '4538'
        document.getElementById('card02').value = '9878'
        document.getElementById('card03').value = '8403'
        document.getElementById('card04').value = '3276'
        // 日期
        document.getElementById('valid_month').value = '2'
        document.getElementById('valid_year').value = '27'
        // 姓名
        document.getElementById('usr_kname01').value = 'ヤマガミ'
        document.getElementById('usr_kname02').value = 'カヨ'
        // 出生年月
        document.getElementById('usr_byear').value = '1980'
        document.getElementById('usr_bmonth').value = '3'
        document.getElementById('usr_bday').value = '1'

        //邮箱 xfgnf2014@gmail.com
        document.getElementById('pc_mail01').value = 'xfgnf2014@gmail.com'
        document.getElementById('pc_mail02').value = 'xfgnf2014@gmail.com'

        // 账号密码
        document.getElementById('pc_password01').value = '65750204Asd'
        document.getElementById('pc_password02').value = '65750204Asd'

        // 暗文
        document.getElementById('codeNumber').value = ciphertext
        console.log('暗文'+ciphertext)
        // 设置延迟
        setTimeout(function () {
            // 填写完直接提交 frm-btn-area
            if(document.getElementsByClassName('btn btn-primary btn-m btn-proceed mb-none')){
               document.getElementsByClassName('btn btn-primary btn-m btn-proceed mb-none')[0].click()
            }
        }, 500);
    }
    // 自增 传入0000 会自动+1
    function setInterval (num) {
      var len = 4 //显示的长度，如果以0001则长度为4
      num = parseInt(num, 10) + 1//转数据类型，以十进制自增
      num = num.toString()//转为字符串
      while (num.length < len) {//当字符串长度小于设定长度时，在前面加0
        num = "0" + num
      }
      //如果字符串长度超过设定长度只做自增处理。
      return num
    }
})();
