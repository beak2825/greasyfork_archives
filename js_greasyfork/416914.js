// ==UserScript==
// @name         微信读书PC自动滚动！沉浸式阅读！
// @version      0.3
// @require      http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @match        *://weread.qq.com/web/reader/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/appleTouchIcon/apple-touch-icon-152x152.png
// @description    微信读书PC自动滚动！沉浸式阅读
// @namespace https://greasyfork.org/users/518563
// @downloadURL https://update.greasyfork.org/scripts/416914/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6PC%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%EF%BC%81%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/416914/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6PC%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%EF%BC%81%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%EF%BC%81.meta.js
// ==/UserScript==

// Your code here...

$(window).on('load', function () {
    var butDiy = "<button title='自动滚动' class='readerControls_item autoScroll' style='color:#bdbdbd;cursor:pointer;'>滚动X1</button><button title='停止滚动' class='readerControls_item autoScrollOff' style='color:#bdbdbd;cursor:pointer;'>停止</button>"
    $('.readerControls').append(butDiy);
    var num = 1
    $('.autoScroll').click(function () {
        num++;
        autoScroll()
        $('.autoScroll').html('播放X' + num)
    })

  
    // 滑动屏幕，滚至页面底部
    function autoScroll() {
        var distance = 1;
        var timer = setInterval(() => {
            var totalHeight = document.documentElement.scrollTop;
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
                clearInterval(timer);
            }
            $('.autoScrollOff').click(function () {
                num = 0
                clearInterval(timer);
            })
        }, 20);
    }

    var windowTop = 0;
    $(window).scroll(function () {
        let scrollS = $(this).scrollTop();
        let selBtn = document.querySelector('.readerTopBar');
        let readerControl = document.querySelector(".readerControls");
        if (scrollS >= windowTop) {
            // 上划显示
            selBtn.style.opacity = 0;
            windowTop = scrollS;
            $('.readerControls').mouseenter ( function () {
                $('.readerControls').css('opacity','1')
            })
            $('.readerControls').mouseleave ( function () {
                $('.readerControls').css('opacity','0')
            })
        } else {
            // 下滑隐藏
            selBtn.style.opacity = 1;
            readerControl.style.opacity = 1;
            windowTop = scrollS;
        }
    });

})




