// ==UserScript==
// @name         获取魔蝎小说资源
// @namespace    http://tampermonkey.net/
// @version      2024-03-28
// @description  下载魔蝎小说资源
// @author       mw
// @match        http://www.moxiexs.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493320/%E8%8E%B7%E5%8F%96%E9%AD%94%E8%9D%8E%E5%B0%8F%E8%AF%B4%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/493320/%E8%8E%B7%E5%8F%96%E9%AD%94%E8%9D%8E%E5%B0%8F%E8%AF%B4%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function () {
    $(document).ready(function () {
        GM_addStyle(`
        ::selection {
  background: #ff9900; /* 选中背景色 */
  color: white; /* 选中文字颜色 */
  text-shadow: none; /* 移除默认的文本阴影 */
}
          .start-fetch {
          position: fixed;
    bottom: 28%;
    right: 0;
    padding: 10px 20px;
    background-color: #fff;
    color: #000;
    border-radius: 10px;
    cursor: pointer;
    z-index: 1000;
    font-size: 28px;
    }
   .hqxscontbox{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .7);
  z-index: 10000;
   pointer-events: all;
  display: none;
      -webkit-user-select: all;

}
    .hqxscont {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 75%;
      height: 80%;
      overflow: auto;
      transform: translate(-50%,-50%);
      background-color: #fff;
      color: #000;
      border-radius: 5px;
      padding: 10px;
      font-size: 12px;
    }
      .copyButton123{
          position: absolute;
   bottom: 8%;
    left: 50%;
      width: 75%;
      background-color: #000;
      color: #fff;
      transform: translate(-50%, 0);
      border-radius: 0;
      cursor: pointer;
      font-size: 28px;
      text-align: center;
      z-index: 10001;
        display: none;
    }
    `);
        init();
    });

    function init() {
        $('body').append('<div class="start-fetch">下载文本</div><div class="copyButton123">下载文本</div><div class="hqxscontbox"><div class="hqxscont"><div> </div>');
        console.log('初始化完成执行 init');

        $('.start-fetch').click(function () {
            $(this).hide()

            $('html,body').css({
                'overflow':'hidden;'
            })
            content()
        });
        function copyButton() {
            // 获取HTML内容的innerHTML
            var htmlString = $('.hqxscont').html();
            // 将HTML转换为纯文本
            var plainText = htmlToText(htmlString);
            var blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            let tit = extractTitle()
            a.download = tit + ".txt";
            a.click();
            window.URL.revokeObjectURL(url);
            $('.bottem2 a').eq(3)[0].click();
        }
        $('.copyButton123').click(function () {
            copyButton()
        });
        function extractTitle() {
            let tit = $('.bookname>h1').text()
            // 如果没有匹配，返回null
            return tit;
        }
        function htmlToText(html) {
            // 使用正则表达式替换 <br> 标签为换行符
            let text = html.replace(/<br\s*\/?>/gi, '\n');
            // 使用正则表达式替换 &nbsp; 实体为空格
            text = text.replace(/&nbsp;/gi, ' ');
            // 去除其他 HTML 标签（可选，如果需要）
            text = text.replace(/<[^>]*>/g, '');
            return text;
        }

        function content() {
            $('.hqxscontbox').show();
            let cont = '&nbsp;&nbsp;&nbsp;&nbsp;'+ extractTitle()+ '<br/><br/><br/>' + $('#content').html()
            $('.hqxscont').html(cont);
            $('.copyButton123').show()
            copyButton()
        }

    }
    // Your code here...
})();
