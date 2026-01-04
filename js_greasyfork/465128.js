// ==UserScript==
// @name         滑动器6
// @namespace    your-namespace
// @version      1.0
// @description  控制网页自动向上滑动的速度
// @author       Your Name
// @match        http://www.htmanga3.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465128/%E6%BB%91%E5%8A%A8%E5%99%A86.user.js
// @updateURL https://update.greasyfork.org/scripts/465128/%E6%BB%91%E5%8A%A8%E5%99%A86.meta.js
// ==/UserScript==

if (location.href.indexOf('https://www.baidu.com/s') == 0 || location.href.indexOf('http://www.baidu.com/s') == 0) {
    var jq = jQuery.noConflict();
    Compatible(jq);
    var chaoxing = false;
} else if (location.href.indexOf('chaoxing') != -1) {
    var jq = jQuery.noConflict();
    Compatible(jq);
    var chaoxing = true;
} else {
    Compatible(jQuery);
    var chaoxing = false;
}

function Compatible(jq) {
    var box = jq('<div class="move-box"><input type="number" class="move-val" value="1" title="速度"/><p class="start" title="开始/暂停">▶</p><p class="reverse" title="反方向">▼</p></div>');
    jq('body').append(box);

    (function () {
        jq('.move-box').css({
            'width': '40px',
            'height': '90px',
            'background': '#fff',
            'box-shadow': '0 0 4px 0 #ccc',
            'border-radius': '8px',
            'user-select': 'none',
            'overflow': 'hidden',
            'position': 'fixed',
            'top': '80px',
            'left': '4px',
            'z-index': 99999999
        });
        jq('.move-val').css({
            'width': '100%',
            'height': '30px',
            'padding': 0,
            'color': '#000',
            'border': 'none',
            'outline': 'none',
            'font-size': '18px',
            'text-align': 'center'
        })
        jq('.start').css({
            'margin': 0,
            'width': '100%',
            'height': '30px',
            'line-height': '30px',
            'text-align': 'center',
            'background': 'red',
            'color': '#fff',
            'font-size': '20px',
            'cursor': 'pointer'
        })
        jq('.reverse').css({
            'margin': 0,
            'width': '100%',
            'height': '30px',
            'line-height': '30px',
            'text-align': 'center',
            'color': '#ccc',
            'cursor': 'pointer'
        })
    }())

    var elinput = document.getElementsByClassName('move-val')[0],
        elstart = document.getElementsByClassName('start')[0],
        elreverse = document.getElementsByClassName('reverse')[0],
        speed = 1,
        isMove = false,
        isHide = true,
        flag = false,
        lookTop = 0,
        timers = null,
        scrollTimer = null; // 新增定时器

    // Listen for double tap events
    var clickCount = 0;
    var lastClickTime, timeoutId;
    function handleClick() {
        clickCount++;
        if (clickCount === 1) {
            lastClickTime = new Date().getTime();
            timeoutId = setTimeout(function () {
                clickCount = 0;
            }, 300);
        } else if (clickCount === 2) {
            clearTimeout(timeoutId);
            clickCount = 0;
            elstart.click(); // trigger scrolling function
        }
    }

    window.addEventListener('touchstart', handleClick);

    elinput.oninput = setIn;

    function setIn() {
        if (this.value > 10) {
            this.value = 10;
        }
        if (this.value < -10) {
            this.value = -10;
        }
        if (this.value == '') {
            this.value = 0;
        }
        speed = Number(this.value);
        speed < 0 ? elreverse.innerText = '▲' : elreverse.innerText = '▼';
    }

    elstart.onclick = function () {
        if (isMove) {
            this.innerText = '▶';
            flag = false;
            isMove = false;
            isHide = true;
            clearTimeout(scrollTimer); // 停止滚动定时器
        } else {
            this.innerText = '◉';
            flag = true;
 isMove = true;
        isHide = false;
        move(); // 开始滚动
    }
    hideShow();
}

elreverse.onclick = function () {
    speed = -speed;
    speed < 0 ? this.innerText = '▲' : this.innerText = '▼';
}

function move() {
    if (flag) {
        var imglook = jq('.imglook');
        if (imglook.length === 0) {
            window.scrollBy(0, speed);
            if (chaoxing && jq(window).height() + jq(window).scrollTop() >= jq(document).height() - 180) {
                if ($('#loadbutton').length == 1) {
                    clearTimeout(timers);
                    $('#loadbutton').click();
                    timers = setTimeout(() => {
                        isMove ? '' : elstart.click()
                    }, 200)
                }
            }
            if (jq(window).height() + jq(window).scrollTop() >= jq(document).height() - 2 || jq(window).scrollTop() == 0) {
                elstart.innerText = '▶';
                flag = false;
                isMove = false;
                isHide = true;
                hideShow();
                return; // 结束滚动
            }
        } else {
            // 超新课程资料文件预览
            var loopNum = 0
            lookTop = imglook[0].scrollTop
            imglook[0].scrollBy(0, speed)
            function loopTest() {
                loopNum++
                setTimeout(() => {
                    if (imglook[0].scrollTop === lookTop) {
                        loopTest()
                        if (loopNum > 6) {
                            elstart.innerText = '▶';
                            flag = false;
                            isMove = false;
                            isHide = true;
                            hideShow();
                            return; // 结束滚动
                        }
                    }
                }, 200)
            }
            if (imglook[0].scrollTop === lookTop) {
                loopTest()
            }
        }

        // 滚动结束后停止1秒，再次启动滚动
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
            move();
        }, 2000);
    }
}

jq(document).keydown((e) => {
    var event = e || window.event;
    if (event.keyCode == 32) {
        elstart.click();
        return false;
    }
    if (event.keyCode == 38) {
        elinput.value++;
    }
    if (event.keyCode == 40) {
        elinput.value--;
    }
    setIn.call(elinput);
})

// 隐藏
hideShow()

function hideShow() {
    //  if(!isHide) return;
    var timer2 = null;

    function hide() {
        jq('.move-box').stop().animate({
            'left': '-30px'
        }, 400)
    }

    timer2 = setTimeout(hide, 6000);

    jq('.move-box').hover(function () {
        //  if(!isHide) return;
        clearInterval(timer2);
        jq(this).stop().animate({
            'left': '4px'
        }, 600)
    }, function () {
        //  if(!isHide) return;
        timer2 = setTimeout(hide, 6000);
    })
}
}