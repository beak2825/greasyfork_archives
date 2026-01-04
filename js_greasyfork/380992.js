// ==UserScript==
// @name         zhihu video link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在知乎视频右下角显示复制链接按钮，点击可获取到视频链接，方便用户分享视频。
// @author       Jun
// @match        https://www.zhihu.com/question/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/380992/zhihu%20video%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/380992/zhihu%20video%20link.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';


    // Your code here...


    function addCopyLink(){
        $('.VideoCard-layout[hasAdded!=1]').each(function(){
            let content=$(this).find('.VideoCard-content');
            console.log($(this),content)
            let width=content.length==0?'width:100%;':'';
            $(this).append('<div style="height:48px;line-height:48px;'+width+'"><button type="button" class="Button ShareMenu-button Button--plain Button_shareVideo" style="position:absolute;right:10px;">     <svg class="Zi Zi--InsertLink ShareMenu-Icon--normal" color="#9FADC7" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">      <path d="M6.77 17.23c-.905-.904-.94-2.333-.08-3.193l3.059-3.06-1.192-1.19-3.059 3.058c-1.489 1.489-1.427 3.954.138 5.519s4.03 1.627 5.519.138l3.059-3.059-1.192-1.192-3.059 3.06c-.86.86-2.289.824-3.193-.08zm3.016-8.673l1.192 1.192 3.059-3.06c.86-.86 2.289-.824 3.193.08.905.905.94 2.334.08 3.194l-3.059 3.06 1.192 1.19 3.059-3.058c1.489-1.489 1.427-3.954-.138-5.519s-4.03-1.627-5.519-.138L9.786 8.557zm-1.023 6.68c.33.33.863.343 1.177.029l5.34-5.34c.314-.314.3-.846-.03-1.176-.33-.33-.862-.344-1.176-.03l-5.34 5.34c-.314.314-.3.846.03 1.177z" fill-rule="evenodd"></path>     </svg>复制链接</button></div>')
            $(this).attr('hasAdded',1)
            let that=this
            $(this).on('click','.Button_shareVideo',function(){
                let url=$(that).parent().find('iframe').attr('src')
                var dummy = $('<input>').val(url).appendTo('body').select()
                document.execCommand('copy')
                $('body').append('<div id="popup_copy_success"><div><span><div class="AppHeader-notification Notification Notification-white"><div class="Notification-textSection Notification-textSection--withoutButton">链接复制成功！</div></div></span></div></div>')
                setTimeout(function(){
                    $('#popup_copy_success').remove()
                },2000)
            })
        });
        setTimeout(addCopyLink,1000)
    }
    addCopyLink();


    function createSharePopupHtml(offset){
        let btnLeft=offset.left;
        let btnTop=offset.top;
        let marginTop=btnTop-$(window).scrollTop()
        let arrow='top'
        if(marginTop<240){
            arrow='bottom'
        }
        let left=btnLeft-136/2;
        let top=arrow=='top'?btnTop-220:btnTop;
        let html='\
  <div class="Popover-content Popover-content--{arrow} Popover-content--arrowed" style="left: {left}; top: {top};">\
   <span class="Popover-arrow Popover-arrow--{arrow}" style="left: 68px; top: 240px;"></span>\
   <div class="Menu">\
    <button type="button" class="Button Menu-item ShareMenu-button Button--plain">\
     <svg class="Zi Zi--InsertLink ShareMenu-Icon--normal" color="#9FADC7" fill="currentColor" viewbox="0 0 24 24" width="20" height="20">\
      <path d="M6.77 17.23c-.905-.904-.94-2.333-.08-3.193l3.059-3.06-1.192-1.19-3.059 3.058c-1.489 1.489-1.427 3.954.138 5.519s4.03 1.627 5.519.138l3.059-3.059-1.192-1.192-3.059 3.06c-.86.86-2.289.824-3.193-.08zm3.016-8.673l1.192 1.192 3.059-3.06c.86-.86 2.289-.824 3.193.08.905.905.94 2.334.08 3.194l-3.059 3.06 1.192 1.19 3.059-3.058c1.489-1.489 1.427-3.954-.138-5.519s-4.03-1.627-5.519-.138L9.786 8.557zm-1.023 6.68c.33.33.863.343 1.177.029l5.34-5.34c.314-.314.3-.846-.03-1.176-.33-.33-.862-.344-1.176-.03l-5.34 5.34c-.314.314-.3.846.03 1.177z" fill-rule="evenodd"></path>\
     </svg>复制链接</button>\
    <div class="Menu-item Menu-item--noActive ShareMenu-wechat">\
     <button type="button" class="Button ShareMenu-button Button--plain">\
      <svg class="Zi Zi--WeChat ShareMenu-Icon--small" color="#60C84D" fill="currentColor" viewbox="0 0 24 24" width="17" height="17">\
       <path d="M2.224 21.667s4.24-1.825 4.788-2.056C15.029 23.141 22 17.714 22 11.898 22 6.984 17.523 3 12 3S2 6.984 2 11.898c0 1.86.64 3.585 1.737 5.013-.274.833-1.513 4.756-1.513 4.756zm5.943-9.707c.69 0 1.25-.569 1.25-1.271a1.26 1.26 0 0 0-1.25-1.271c-.69 0-1.25.569-1.25 1.27 0 .703.56 1.272 1.25 1.272zm7.583 0c.69 0 1.25-.569 1.25-1.271a1.26 1.26 0 0 0-1.25-1.271c-.69 0-1.25.569-1.25 1.27 0 .703.56 1.272 1.25 1.272z" fill-rule="evenodd"></path>\
      </svg>微信扫一扫</button>\
     <img class="ShareMenu-qrCode" src="https://www.zhihu.com/qrcode?url=https%3A%2F%2Fwww.zhihu.com%2Fanswer%2F619383031%23showWechatShareTip" alt="微信二维码" />\
    </div>\
   </div>\
  </div>\
        ';
        html.replace('{arrow}',arrow);
        html.replace('{left}',left);
        html.replace('{top}',top);
        return html;
    }

})();