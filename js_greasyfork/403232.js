// ==UserScript==
// @name         SIS SEX TXT
// @name:zh-CN   SIS SEX spring4u文本保存
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  下载SIS SEX spring4u小说内容
// @author       少阳
// @match        http*://*.sis001.com/*/thread-*
// @match        http*://*.sis001.com/*/viewthread*
// @match        http*://*.sexinsex.net/*/thread-*
// @match        http*://*.sexinsex.net/*/viewthread*
// @match        http*://*.spring4u.info/viewthread*

// @grant        GM_addStyle

// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.8/FileSaver.min.js
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.1.min.js

// @license      MIT License  //共享规则
// @compatible        chrome
// @compatible        firefox

// @contributionURL https://www.paypal.com/  //捐赠链接
// @contributionAmount 1
// @downloadURL https://update.greasyfork.org/scripts/403232/SIS%20SEX%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/403232/SIS%20SEX%20TXT.meta.js
// ==/UserScript==

// 代码开始
var $ = $ || window.$;
'use strict';


GM_addStyle(`

  .button{
    position: fixed;
    bottom: 200px;
    right: 50px;
  }

  .button2 {
    text-align : center;
      border-style : none;
    cursor : hand;
      font-weight : bold;
    width : 50px;
    height : 50px;
      border-radius:15px;

  }

  `);

(function () {

  console.log('脚本启动');

  /*按钮*/
  var downloadButton = document.createElement("div");
  downloadButton.className = "button"; //class名称，必须有，包含层级设置
  downloadButton.innerHTML = "<button  class='button2'>下载TXT</button>"; //添加的网页样式
  document.getElementsByTagName("body")[0].appendChild(downloadButton);
  //点击事件
  downloadButton.addEventListener("click", function () {
    get(); //点击后运行get函数
  })
  /*按钮*/

})();

function get() {

  var test = "0"; //调试开关,1为打开调试
  console.log('获取模块');

  var title_val = $('title').text(); //获取标题，判定依据

  if (title_val.indexOf("四合院") >= 0) { //根据标题选择匹配规则
    var name = $("[valign='top']:eq(3) span:first").text(); //名称
    var str = $("[style='font-size: 15px']:first"); //内容
  } else {
    var name = $(".postmessage.defaultpost h2").text();
    var str = $(".t_msgfont:first .t_msgfont");
  }

  var a = str.clone(); //复制元素
  var del = ["tbody", "strong", "p"]
  $.each(del, function (i) { //依次获取匹配的子元素
    a.find(del[i])
      .remove()
      .end();
  });

  var b = a.text().replace(/[\r\n](?!([\r\n]))/g, ""); //自动换行
  var c = b.replace(/[\r\n]/g, "\r\n"); //替换LF换行为\r\n
  //var d = b.replace(/(作者.+?)(\d{4}[年|\/]\d*[月|\/]\d*[日|\/].*?)?(是否.*?)?(首发网站.*?)?(字数.*?)([\r\n])/g,"$1\r\n$2\r\n$3\r\n$4\r\n$5$6");
  var d = c.replace(/(作者.+?(?=\d{4}[年|\/]))(.*?)(字数.*)([\r\n])/g, "$1\r\n$2\r\n$3$4"); //把作者相关资料换行。(暂时还没想到更好的办法)

  if (test != 1) {
    //调用下载
    saveShareContent(name + ".txt", d);
  } else {
    //文本内容测试
    console.log(name);
    console.log(d);
  }

}

function saveShareContent(Name, data) {
  console.log('下载模块');
  let downLink = document.createElement('a')
  downLink.download = Name
  //字符内容转换为blod地址
  let blob = new Blob([data])
  downLink.href = URL.createObjectURL(blob)
  // 链接插入到页面
  document.body.appendChild(downLink)
  downLink.click()
  // 移除下载链接
  document.body.removeChild(downLink)
}


