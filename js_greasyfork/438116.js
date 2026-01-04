// ==UserScript==
// @name         zcool
// @description  ZD-隐藏多余元素
// @namespace    https://www.zcool.com.cn/
// @version      0.1
// @author       You
// @match        https://www.zcool.com.cn/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/438116/zcool.user.js
// @updateURL https://update.greasyfork.org/scripts/438116/zcool.meta.js
// ==/UserScript==



(function() {
    //初始CSS
    (document.head || document.documentElement).insertAdjacentHTML('beforeend', '<style>.bigimg{width:90px; height:auto; cursor: move!important;} .downbutton{text-align:center;width:100px; height:auto;position:absolute;font-size:18px;padding:10px;background:rgba(0,0,0,.5);color:#ffffff;border-radius:8px;top:40px;right:20px;} .downbutton:hover{background:rgba(255,0,0,.5); color:#ffffff}</style> ');
    $(function() {



        var imgSum = $('.photo-information-content').length;
        for (var i = 0; i <= imgSum; i++) {
            var ssrc= ($('.photo-information-content').eq(i).children('img')[0].src).replace (/(.*)@.*/, '$1');
            $('.photo-information-content').eq(i).prepend('<div class="downbutton"><a href="' + ssrc + '">原图拖走</a><img class="bigimg"' + ' src="'+ ssrc +'">'+ '<p style="font-size:14px">' + (i+1) + '/' +(imgSum+1) +'</div>')
        }






        $(".photo-information-content img").click(function(){
            var imgsrc = this.src;
            alert(imgsrc)
        })

       $('.downbutton').click(function(){
            var src1 = $(this).parent().children('img')[0].src;
           console.log(src1.replace (/(.*)@.*/, '$1'))
        })

    });


})();