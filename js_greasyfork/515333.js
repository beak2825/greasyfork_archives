// ==UserScript==
// @name         立创商城领取优惠券
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  自动领取立创商城优惠券
// @author       ch3rry
// @match        https://www.szlcsc.com/huodong.html*
// @icon         data:image/png;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAD/dh0A/2AHAP9zGh//chl5/3EZyv9xGPP/cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGPP/cRnK/3IZef9zGh//YAcA/3YdAP9zGQD/cxkt/3IZtv9xGPn/cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj5/3IZtv9zGS3/cxkA/3MaIP9yGbb/cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3IZtv9zGiD/chl5/3EY+f9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj5/3IZef9xGcr/cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRnK/3EY8/9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGPP/cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3AX//9wF///cRj//3EY//9xGP//cRj//3EX//9wFv//cBb//3AW//9wFv//cBb//3AW//9wFv//cBb//3EY//9xGP//cRj//3AW//9vFf//cBb//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3AX//9zG///fi3//3kk//9wF///cRf//3EY//9xGP//diD//4Ax//+BMv//gTL//4Ey//+BMv//gTL//4Ey//+BMf//dR///3AX//9zG///gjT//4tC//+CM///chr//3AX//9xGP//cRj//3EY//9xGP//cRj//3EY//9yGf//j0n//8im///cxv//173//7B///96J///cBf//3AX//+TUP//2sL//+DL///fy///38v//9/L///fy///38v//8CY//95Jf//fzD//7qQ///hzv//6dv//+DN//+3i///gDD//3AX//9xGP//cRj//3EY//9xGP//cBb//5NQ///o2f//////////////////+/n//8Od//94I///cBb//55h///49P/////////////////////////////x6P//mVn//4Ax///Uuf///f3///////////////////37///St///fy7//3AX//9xGP//cRj//3EX//92IP//y6r////////8+v//8Of///j0////////9e///5hX//9uE///nWD///j0////////+fb///Ps///z7P//9e///8ys//96Jv//t4n///37////////9e7//+bW///17v////////37//+0hf//cRj//3EY//9xGP//cRf//3kl///Gov//3Mb//8Kb//+FOP//soP///37////////r33//28V//+dYP//+PT////////EoP//hjr//4Y6//+GOf//fSv//3so///j0f////////Dm//+gZP//eyf//59j///z6////////9vF//99LP//cBf//3EY//9xGP//chr//3on//98Kv//dyL//20S//+YV///9vH///////+4i///cRj//51g///49P////7//7mO//9vFf//cBf//3AX//9wFv//fi7///Dn////////1r3//3gj//9vFf//eCT//9S6///6+P//3sr//4U4//9wFv//cRj//3EY//9xGP//cBf//3AX//9xF///bhT//5hX///28P///////7iL//9xGP//nWD///j0/////v//uo7//3AW//9xGP//cRj//3AX//9/L///8ur////////Stv//dB3//3EX//9zG///jkj//5xf//+UUf//eCP//3EX//9xGP//cRj//3EY//9xGP//cRj//3EY//9uFP//mFf///bw////////uIv//3EY//+dYP//+PT////+//+6jv//cBb//3EY//9xGP//cBf//38w///y6v///////9K3//90Hv//cRf//3EY//9wF///cBb//3AX//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//24U//+YV///9vD///////+4i///cRj//51g///49P////7//7qO//9wFv//cRj//3EY//9wF///gDH///Lq////////0rf//3Qe//9xF///cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//bhT//5hX///28P///////7iL//9xGP//nWD///j0/////v//uo7//3AW//9xGP//cRj//3AX//+AMf//8ur////////St///dB7//3EY//9xGP//bxT//24T//9uFP//cRf//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9uFP//mFf///bw////////uIv//3EY//+dYP//+PT////+//+6jv//cBb//3EY//9xGP//cBf//4Ax///y6v///////9K2//90Hf//cRf//3Mc//+TT///o2n//5hY//94JP//cRf//3EY//9xGP//cRj//3EY//9xGP//cRj//24U//+YV///9vD///////+4i///cRj//51g///49P////7//7qO//9wFv//cRj//3EY//9wF///fy////Hp////////2sL//3on//9tEv//eif//93I////////4c7//4M1//9wFv//cRj//3EY//9xGP//cRj//3EY//9xGP//bhT//5hX///28P///////7iL//9xGP//nWD///j0/////v//uo7//3AW//9xGP//cRj//3AX//97KP//4c/////////28P//tYf//5BL//+0hv//+PT////////Stv//dyL//3EX//9xGP//cRj//3EY//9xGP//cRj//3EY//9uFP//mFf///bw////////uIv//3EY//+dYP//+PT////+//+6jv//cBb//3EY//9xGP//cRj//3Ia//+ygf//+/n////////7+P//8Of///v4////////9/L//6Jn//9wFv//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//24U//+YV///9vD///////+4jP//cRn//51g///49P////7//7qP//9wFv//cRj//3EY//9xGP//cBb//34t///HpP//+/j///////////////////Tu//+3i///diD//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//bxT//5RR///p3P//8+z//7GB//9xGP//mVn//+zg///x6f//s4P//3AW//9xGP//cRj//3EY//9xGP//cBf//3sp//+qdP//0rb//9zH///Lqv//nV///3Yh//9wF///cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//dR7//30s//9+Lv//eCP//3EY//91H///fi3//34u//94I///cRj//3EY//9xGP//cRj//3EY//9xGP//cBf//3EY//94I///eib//3Yg//9wFv//cRf//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cBf//3AX//9xF///cRj//3EY//9wF///cBf//3EX//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EX//9wF///cRf//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY8/9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGPP/cRnK/3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EZyv9yGXn/cRj5/3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGPn/chl5/3MaIP9yGbb/cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3IZtv9zGiD/cxkA/3MZLf9yGbb/cRj5/3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY+f9yGbb/cxkt/3MZAP92HQD/YAcA/3MaH/9yGXn/cRnK/3EY8/9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY//9xGP//cRj//3EY8/9xGcr/chl5/3MaH/9gBwD/dh0AwAAAA4AAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAcAAAAM=
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @resource   CSS https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/css/toastr.min.css
// @require https://greasyfork.org/scripts/444087-toastr/code/toastr.js?version=1044682
// @require https://update.greasyfork.org/scripts/449403/1080601/toastr_demo.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant       unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515333/%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8E%E9%A2%86%E5%8F%96%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/515333/%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8E%E9%A2%86%E5%8F%96%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleeptime = 3000; // 领取间隔，默认3000毫秒
    const get_newer = false; // 领取新人优惠券，默认否
    const get_plus = false; // 领取Plus优惠券，默认否
    const hide_lichuang_notice = true // 隐藏原优惠券领取成功提示框，默认是

    console.log("====================\n脚本：" + GM_info.script.name + " 开始执行\n作者：" + GM_info.script.author + " 版本：" + GM_info.script.version);

    // 创建脚本菜单
    GM_registerMenuCommand("🎟️ 领取优惠券", main);
    GM_registerMenuCommand("💻 立创商城优惠券辅助", openCouponHelper);
    GM_registerMenuCommand("💻 立创商城优惠券辅助(BootStrap风格)", openBootStrapCouponHelper);

    // 领取优惠券函数
    function get_coupon(btn){
        btn.click();
        let info = '新领取 ' + btn.parentNode.getAttribute('data-name');
        toastr.success(info)
        console.log(info);
    }

    // toastr.js参数
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "positionClass": "toast-top-right",
      "onclick": null,
      "showDuration": "100",
      "hideDuration": "3000",
      "timeOut": "3000",
      "extendedTimeOut": "3000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

    // 打开立创商城优惠券辅助
    function openCouponHelper() {window.open('https://szlcsc-help.xiaowine.cc/', '_blank');}
    function openBootStrapCouponHelper() {window.open('https://bonjourfeng.github.io/szlcsc-help/index_bootstrap.html', '_blank');}

    function main() {
        // 隐藏原立创提示框
        if(hide_lichuang_notice){GM_addStyle(".common-alert-success-tip-tmpl {display: none !important} .mask-alert {display: none !important}");}

        var num = 0; // 已领取过的数量，方便设定间隔
        let coupon_item = document.querySelectorAll('.coupon-item'); // 获取DOM
        for (let i=0;i<coupon_item.length;i++) {
            // 检查是否领取
            if (coupon_item[i].classList.value.includes('receive')) {
                let info = (i+1) + '跳过已领取的 ' + coupon_item[i].querySelector('.ellipsis').innerText;
                toastr.info(info);
                console.log(info);
            }
            // 领取未领取的
            else {
                // 新人专享
                if(coupon_item[i].innerText.includes('<新人专享>')) {
                    // 判断是否领取
                    if (get_newer) {
                        num += 1;
                        let sleep_time = 1000 * num;
                        setTimeout(() => {get_coupon(coupon_item[i].querySelector('.coupon-item-btn-text'))}, sleep_time);
                    }
                    else {
                        let info = (i+1) + '跳过 ' + coupon_item[i].querySelector('.ellipsis').innerText;
                        toastr.info(info);
                        console.log(info);
                    }
                    continue; // 跳出此次循环
                }

                // Plus专享
                if(coupon_item[i].classList.value.includes('coupon-item-plus')) {
                    // 判断是否领取
                    if (get_plus) {
                        num += 1;
                        let sleep_time = 1000 * num;
                        setTimeout(() => {get_coupon(coupon_item[i].querySelector('.coupon-item-btn-text'))}, sleep_time);
                    }
                    else {
                        let info = (i+1) + '跳过 ' + coupon_item[i].querySelector('.ellipsis').innerText;
                        toastr.info(info);
                        console.log(info);
                    }
                    continue; // 跳出此次循环
                }

                // 非新人专享或Plus专享，直接领取优惠券
                num += 1;
                let sleep_time = 1000 * num;
                setTimeout(() => {get_coupon(coupon_item[i].querySelector('.coupon-item-btn-text'))}, sleep_time);
            }
        }
    }


})();