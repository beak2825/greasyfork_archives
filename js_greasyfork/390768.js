// ==UserScript==
// @name             逆熵anti
// @namespace        nsanti
// @version          0.0.2
// @description      自动完成视觉小说成就
// @author           null
// @match            *://event.bh3.com/*
// @charset          UTF-8
// @grant            none
// @require          https://cdn.bootcss.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/390768/%E9%80%86%E7%86%B5anti.user.js
// @updateURL https://update.greasyfork.org/scripts/390768/%E9%80%86%E7%86%B5anti.meta.js
// ==/UserScript==
// 


(function() {
    var si = 0
    
    $('body').append('<style>   .ns { background:#fff} .ns * {color:#000}               </style>')
    $('body').append('<div class="ns" style="position:fixed;top:10px;left:10px;z-index:9999999999999"><button>自动播放 off</button></div>')

    var fnn_t = 300
    var fnn = function () {
        var nextFn = function() {
            setTimeout(fnn, fnn_t)
        }
        if ($('.main .cg').css('display') == 'block') {
            setTimeout(function() {
                $('.main .cg').click()
                nextFn()
            }, 300)
        } else {
            if ($('.remark_btn').css('opacity') == '1') {
                $('.remark_btn').click()
                setTimeout(function() {
                    $('.home_btn.home_btn_remark').click()
                    setTimeout(function() {
                        $('#character-center').click()
                        nextFn()
                    }, 300)
                }, 300)

            } else {
                $('#character-center').click()
                nextFn()
            }
            
        }
    }



    $('.ns button').click(function() {
        if($(this).html() == '自动播放 off') {
            fnn_t = 300
            fnn()
            $(this).html('自动播放 on')
        } else {
            fnn_t = 99999999
            $(this).html('自动播放 off')
        }
    })
})()
