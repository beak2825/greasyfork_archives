// ==UserScript==
// @name         联合阅读辅助插件
// @namespace    http://xrzww.com/
// @version      1.3
// @license      Anti 996 License
// @description  优化联合阅读一些程序方面体验
// @author       qidian55
// @match        http*://*.xrzww.com/*
// @grant        GM_notification
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/403902/%E8%81%94%E5%90%88%E9%98%85%E8%AF%BB%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/403902/%E8%81%94%E5%90%88%E9%98%85%E8%AF%BB%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
    //添加签到功能
    var right = $('#app .nan_page .main .right')[0];
    if (right === undefined) return;
    var signin_button = $(`<uni-view style=" margin-left:25px;
 width:74px;
 height:30px;
 border-radius:18px" class="top_right">
    <uni-view style=" display:-webkit-box;
     display:-webkit-flex;
     display:flex;
     font-size:14px;
     height:25px;
     -webkit-box-pack:center;
     -webkit-justify-content:center;
     justify-content:center;
     -webkit-box-align:center;
     -webkit-align-items:center;
     align-items:center;
     border:1px solid #fff;
     background:-webkit-linear-gradient(179deg,#ffedd6,#ffdcb4);
     background:linear-gradient(271deg,#ffedd6,#ffdcb4);
     box-shadow:0 3px 6px #8d0006;
     color:#8d0006;
     border-radius:17px;
    box-sizing: border-box;" class="btn all">
        <uni-text><span>签到▶</span></uni-text>
    </uni-view>
</uni-view>`)[0];
    right.appendChild(signin_button);
    var signin = function() {
        $.ajax({
            url: "https://pre-api.xrzww.com/api/userSignIn",
            headers: {
                "Authorization": "Bearer " + localStorage['token']
            },
            success: function(result) {
                GM_notification('签到成功！\n+' + result.data.gold2 + '书币\n本周连续签到' + result.data.week_sign_count + '天\n累计连续签到' + result.data.sign_con + '天', '联合阅读辅助插件', 'https://oss.xrzww.com/mini/mine_qian.png');
                $(signin_button).find('uni-text').children('span').html('已签');
                $(signin_button).children('uni-view')[0].style.cursor = '';
                $(signin_button).find('.btn')[0].onclick = undefined;
            }
        });
    }
    $.ajax({
        url: "https://pre-api.xrzww.com/api/getUserInfo",
        headers: {
            "Authorization": "Bearer " + localStorage['token']
        },
        success: function(result) {
            if (result.data.signstatus) $(signin_button).find('uni-text').children('span').html('已签');
            else {
                $(signin_button).children('uni-view')[0].style.cursor = 'pointer';
                $(signin_button).find('.btn')[0].onclick = signin;
            }
        }
    });
})();
(function() {
    //添加朗读功能
    var novel_left = $('.novel_left')[0];
    if (novel_left === undefined) return;
    var speak_service = $(`<div data-v-803acc24="" style="background: rgb(102, 204, 255) none repeat scroll 0% 0%;" class="set_bar">
    <div data-v-803acc24="" class="widthcaozuo" style="background: rgb(102, 204, 255) none repeat scroll 0% 0%;visibility: hidden;">
        <div data-v-803acc24="" style="background: rgb(102, 204, 255) none repeat scroll 0% 0%;position: inherit;left: 81px;" class="set_bar">
            <div data-v-803acc24="" class="caozuo">
                <div data-v-803acc24="">
                    <i data-v-803acc24="" class="el-icon-video-pause"></i>
                </div>
                <span data-v-803acc24="">暂停</span>
            </div>
        </div>
        <div data-v-803acc24="" style="background: rgb(102, 204, 255) none repeat scroll 0% 0%;position: inherit;left: 152px;cursor: auto;padding: 0 0;" class="set_bar">
            <div data-v-803acc24="" class="caozuo">
                <div style="height: 24.25px;flex-direction: column;justify-content: center;display: flex;cursor: pointer;">
                    <i data-v-803acc24="" class="el-icon-caret-right"></i>
                </div>
                <span style="margin-top: 0px;">语速：1.0</span>
                <div style="height: 24.25px;flex-direction: column;justify-content: center;display: flex;cursor: pointer;">
                    <i data-v-803acc24="" class="el-icon-caret-left"></i>
                </div>
            </div>
        </div>
        <div data-v-803acc24="" style="background: rgb(102, 204, 255) none repeat scroll 0% 0%;position: inherit;left: 223px;cursor: auto;padding: 0 0;" class="set_bar">
            <div data-v-803acc24="" class="caozuo">
                <div style="height: 24.25px;flex-direction: column;justify-content: center;display: flex;cursor: pointer;">
                    <i data-v-803acc24="" class="el-icon-caret-top"></i>
                </div>
                <span style="margin-top: 0px;">音量：1.0</span>
                <div style="height: 24.25px;flex-direction: column;justify-content: center;display: flex;cursor: pointer;">
                    <i data-v-803acc24="" class="el-icon-caret-bottom"></i>
                </div>
            </div>
        </div>
    </div>
    <div data-v-803acc24="" class="caozuo">
        <div data-v-803acc24="">
            <i data-v-803acc24="" class="el-icon-service"></i>
        </div>
        <span data-v-803acc24="">朗读</span>
    </div>
</div>`)[0];
    novel_left.appendChild(speak_service);
    var utterThis = new SpeechSynthesisUtterance();
    speak_service.utterThis = utterThis;
    var read_next_paragraph = function(e) {
        speak_service.current_paragraph[0].style.background = '';
        speak_service.current_paragraph = speak_service.current_paragraph.next();
        if (speak_service.current_paragraph.attr('class') === 'others') return;
        speak_service.utterThis.text = speak_service.current_paragraph.text().trim();
        window.speechSynthesis.speak(speak_service.utterThis);
    }
    var start_speak_service = function() {
        if (!$('.novel_dl').length) return;
        speak_service.current_paragraph = $($('.novel_dl')[0]);
        speak_service.utterThis.text = speak_service.current_paragraph.text().trim()
        speak_service.utterThis.onstart = function(e) {
            speak_service.current_paragraph[0].style.background = 'rgba(102,204,255,0.3)';
            speak_service.current_paragraph[0].scrollIntoView({
                behavior: 'smooth'
            });
        };
        speak_service.utterThis.onend = read_next_paragraph;
        window.speechSynthesis.speak(utterThis);
        $(this).find('i').attr('class', 'el-icon-loading');
        $(this).find('span').text('朗读中');
        this.onclick = stop_speak_service;
        speak_service.onmouseenter = function() {
            speak_service.firstElementChild.style.visibility = '';
        }
        speak_service.firstElementChild.style.visibility = '';
    }
    var stop_speak_service = function() {
        speak_service.current_paragraph[0].style.background = '';
        speak_service.utterThis.onend = undefined;
        window.speechSynthesis.cancel();
        $(this).find('i').attr('class', 'el-icon-service');
        $(this).find('span').text('朗读');
        this.onclick = start_speak_service;
        speak_service.onmouseenter = undefined;
        speak_service.firstElementChild.style.visibility = 'hidden';
    }
    speak_service.lastElementChild.onclick = start_speak_service;
    speak_service.onmouseleave = function() {
        speak_service.firstElementChild.style.visibility = 'hidden';
    }
    var pause_speak_service = function() {
        window.speechSynthesis.pause();
        $(speak_service.lastElementChild).find('i')[0].style.animationPlayState = 'paused';
        $(speak_service.lastElementChild).find('i')[0].style.WebkitAnimationPlayState = 'paused';
        $(this).find('i').attr('class', 'el-icon-video-play');
        $(this).find('span').text('继续');
        this.onclick = resume_speak_service;
    }
    var resume_speak_service = function() {
        window.speechSynthesis.resume();
        $(speak_service.lastElementChild).find('i')[0].style.animationPlayState = 'running';
        $(speak_service.lastElementChild).find('i')[0].style.WebkitAnimationPlayState = 'running';
        $(this).find('i').attr('class', 'el-icon-video-pause');
        $(this).find('span').text('暂停');
        this.onclick = pause_speak_service;
    }
    speak_service.firstElementChild.children[0].onclick = pause_speak_service;
    $(speak_service).find('.el-icon-caret-left').parent()[0].onclick = function() {
        speak_service.utterThis.rate -= 0.3;
        $(speak_service).find('span')[1].textContent = '语速：' + speak_service.utterThis.rate.toFixed(1);
    };
    $(speak_service).find('.el-icon-caret-right').parent()[0].onclick = function() {
        speak_service.utterThis.rate += 0.3;
        $(speak_service).find('span')[1].textContent = '语速：' + speak_service.utterThis.rate.toFixed(1);
    };
    $(speak_service).find('.el-icon-caret-bottom').parent()[0].onclick = function() {
        speak_service.utterThis.volume -= 0.1;
        $(speak_service).find('span')[2].textContent = '音量：' + speak_service.utterThis.volume.toFixed(1);
    };
    $(speak_service).find('.el-icon-caret-top').parent()[0].onclick = function() {
        speak_service.utterThis.volume += 0.1;
        $(speak_service).find('span')[2].textContent = '音量：' + speak_service.utterThis.volume.toFixed(1);
    };
})();
(function() {
    //个人主页添加浏览记录
    if (!$('.left_view').length) return;
    var footpoint_svg = $(`<svg t="1610082003772" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="656" width="44" height="44">
    <path d="M919.092183 692.511213c-74.985832-67.678402-107.752096-20.321838-170.404018-104.681154-81.235163-109.545952 8.586562-190.889585-83.245959-289.840224 0 0-60.314691-60.668755-149.32084-60.668755-59.826574 0-132.586714 27.41335-208.659297 119.026884C189.059402 498.931357 243.614925 694.738951 407.445224 829.41628c110.360504 90.854241 229.741451 127.721917 328.474127 127.721917 84.060511 0 153.125493-26.759457 188.771341-69.687152C975.006657 826.835502 961.857173 731.11851 919.092183 692.511213zM881.871467 851.912643c-25.37697 30.591739-81.289398 49.582255-145.95314 49.582255-57.272401 0-171.546028-14.942317-293.154713-115.059526-82.594113-67.921949-134.486994-153.777339-142.256958-235.582483-5.597485-58.957787 11.138688-112.453165 49.773613-158.966525 54.501288-65.61337 110.306268-98.92301 165.841096-98.92301 62.760392 0 108.404965 42.900066 108.567671 42.900066 31.950689 34.477232 31.461549 61.4567 30.645974 106.149599-0.923022 49.256844-2.065032 110.578468 48.686862 178.99058 42.11212 56.728002 78.084403 70.230528 117.316939 80.962963 20.974707 5.732561 36.134988 9.863648 60.47842 31.842219C900.999107 751.142565 914.257062 812.924677 881.871467 851.912643z" p-id="657"></path>
    <path d="M122.49538 512.001023c-30.755468 0-55.642275 24.913413-55.642275 55.642275 0 30.726815 24.886807 55.640228 55.642275 55.640228s55.642275-24.913413 55.642275-55.640228C178.137655 536.914436 153.249825 512.001023 122.49538 512.001023z" p-id="658"></path>
    <path d="M122.49538 345.0742c-30.755468 0-55.642275 24.914436-55.642275 55.642275s24.886807 55.642275 55.642275 55.642275 55.642275-24.914436 55.642275-55.642275S153.249825 345.0742 122.49538 345.0742z" p-id="659"></path>
    <path d="M315.504232 246.830665c0-37.927821-30.701233-68.683289-68.683289-68.683289s-68.683289 30.755468-68.683289 68.683289c0 37.926798 30.701233 68.683289 68.683289 68.683289S315.504232 284.757462 315.504232 246.830665zM233.779929 246.830665c0-7.199982 5.868661-13.041014 13.041014-13.041014s13.041014 5.841032 13.041014 13.041014c0 7.198959-5.868661 13.041014-13.041014 13.041014S233.779929 254.029624 233.779929 246.830665z" p-id="660"></path>
    <path d="M428.527378 233.789651c46.078455 0 83.463923-37.357839 83.463923-83.463923 0-46.107107-37.385469-83.463923-83.463923-83.463923s-83.463923 37.356816-83.463923 83.463923C345.064478 196.431811 382.448924 233.789651 428.527378 233.789651zM428.527378 122.505102c15.32401 0 27.821649 12.471033 27.821649 27.821649s-12.497639 27.821649-27.821649 27.821649-27.821649-12.471033-27.821649-27.821649S413.203368 122.505102 428.527378 122.505102z" p-id="661"></path>
</svg>`);
    var record_button = $(`<div data-v-9f0a8dcc="" class="left_view">
    <img data-v-9f0a8dcc="" src="data:image/svg+xml;utf-8,${escape(footpoint_svg[0].outerHTML)}" alt="" class="smallicon">
    <div data-v-9f0a8dcc="" class="red_box">浏览记录</div>
</div>`);
    $($('.left_view')[0]).after(record_button);
    record_button[0].onclick = function() {
        location.href = 'https://h5.xrzww.com/#/pages/mine/record';
    }
})();