// ==UserScript==
// @name         小熊助手
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  小伙伴的小助手!
// @author       You
// @match        http://www.faxuanyun.com/bps/frame/t/*
// @match        http://www.faxuanyun.com/sps/courseware/*
// @match        http://www.faxuanyun.com/sps/exercises/t/exercies_3_t.html?id=*
// @match        http://www.faxuanyun.com/sps/exercises/t/exercies_4_t.html?ids=*
// @icon         http://www.faxuanyun.com/baseui/images/logo.png?v=20201208
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/462322/%E5%B0%8F%E7%86%8A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/462322/%E5%B0%8F%E7%86%8A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //延时函数，只能用在异步函数中，await后
    function sleep(delay) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, delay);
        });
    }
    //开始主函数start，使用异步函数
    async function start(){
    //异步函数内容
    //先构造常用函数
        //单选题函数，函数放在主函数内就可以调用主函数内的answer变量，放在主函数外就要通过传递变量的方式，多选题和判断题函数就是通过传递变量的方式。
        function danxuan(i){
            let m = document.querySelectorAll('[name="allitem"]').length - 1;
            let xa = answer[i]['a'];
            for (let l = m; l >= 0; l--) {
                var xx = document.querySelectorAll('[name="allitem"]')[l];
                var xv = xx.value;
                if (xv == xa) {
                    xx.click();
                }
            }
        }
        //多选题函数
        function duoxuan(i){
            let m = document.querySelectorAll('[name="allitem"]').length - 1;
            let xa = answer[i]['a'];
            for (let l = m; l >= 0; l--) {
                let xx = document.querySelectorAll('[name="allitem"]')[l];
                let xv = xx.value;
                if (xa.indexOf(xv) != -1) {
                    xx.click();
                }
            }
        }
        //判断题函数
        function panduan(i){
            let m = document.querySelectorAll('[name="allitem"]').length - 1;
            //console.log("m:" + m);
            let xa = answer[i]['a'];
            //console.log("xa:" + xa);
            for (let l = m; l >= 0; l--) {
                let xx = document.querySelectorAll('[name="allitem"]')[l];
                let xv = xx.value;
                //console.log("xv:" + xv);
                if (xa == 'A' && xv == 'A') {
                    xx.click();
                }
                if (xa == 'B' && xv == 'B') {
                    xx.click();
                }
            }
        }
    //开始学习
        //判断是否首页面
        if (document.querySelector("#userHeadImg")) {
            console.log("判断页面为首页"+ Date());
            document.querySelector('#userNotices').innerHTML="<span style='color:red;line-height: 40px;font-size: 20px;font-weight: bold;margin-left: 100px;'>辅助正在运行！</span>";
            document.querySelector('div.learning').innerHTML="<span style='color:red;line-height: 40px;font-size: 20px;font-weight: bold;margin-left: 100px;'>辅助正在运行！</span>";
            let u = document.getElementById('todypoint');
            let jf = u.textContent;
            if (jf < 100){
                console.log(" 未满100分,3秒后继续学习");
                await sleep(3000);
                //进入第一个课程学习
                document.querySelectorAll("#page>a")[1].click();
                console.log("开始点击进入学习页面"+ Date());
                await sleep(3000);
                if (document.querySelector("a.layui-layer-btn1")) {
                document.querySelector("a.layui-layer-btn1").click();
                }
                console.log("点击学习新课程"+ Date());
                //点击积分规则，避免页面超时
                await sleep(115000);
                if (document.querySelector("a#ruleinfoA")) {
                document.querySelector("a#ruleinfoA").click();
                }
                await sleep(3000);
                //点击积分规则确定
                if (document.querySelector("a.pms-newspoint-btn")) {
                document.querySelector("a.pms-newspoint-btn").click();
                }
                console.log("点击积分规则完毕，118秒后刷新页面"+ Date());
                //刷新页面
                await sleep(188000);
                location.reload();
                //console.log("刷新页面"+ Date());
            // }else if (jf < 100){
            //     //学习50分满，开始练习
            //     document.querySelector('#userNotices').innerHTML="<span style='color:red;line-height: 40px;font-size: 20px;font-weight: bold;margin-left: 100px;'>学习积分50已完成，开始练习！</span>";
            //     document.querySelector('div.learning').innerHTML="<span style='color:red;line-height: 40px;font-size: 20px;font-weight: bold;margin-left: 100px;'>学习积分50已完成，开始练习！</span>";
            //     //开始练习
            //     await sleep(3000);
            //     document.querySelectorAll("#page>a")[4].click();
            //     await sleep(1000);
            //     if (document.querySelector("a.layui-layer-btn1")) {
            //     document.querySelector("a.layui-layer-btn1").click();
            //     }
            //     await sleep(50000);
            //     location.reload();
            //         //进入练习页面sps.detail('5020','依法治疆专题练习','1');
            }else{
                document.querySelector('#userNotices').innerHTML="<span style='color:red;line-height: 40px;font-size: 20px;font-weight: bold;margin-left: 100px;'>今日100分已完成！</span>";
                document.querySelector('div.learning').innerHTML="<span style='color:red;line-height: 40px;font-size: 20px;font-weight: bold;margin-left: 100px;'>今日100分已完成！</span>";
            }
        }
        //判断学习课程页面
        if (document.querySelector("#history_btn")) {
            console.log("当前为课程页面");
            await sleep(2000);
            sps.detail('5020','依法治疆专题练习','1');
            //设置学习时间5分钟
            sps.onlineTime = 301;
            console.log("时间设置完成，5秒后点击退出");
            await sleep(5000);
            document.querySelectorAll("div.timebtn>a")[0].click();
            console.log("点击退出，3秒后点确定");
            await sleep(3000);
            document.querySelector("a#popwinConfirm").click();
        }
        //判断练习页面开始
        if (document.querySelector("#practicetime")){
            console.log('已进入练习页面！');
            await sleep(1000);
            var arr_a = new Array();
arr_a[0] = [{"q":"625497","a":"A"},{"q":"625489","a":"B"},{"q":"625491","a":"C"},{"q":"625503","a":"D"},{"q":"625447","a":"ABCD"},{"q":"625445","a":"ABCD"},{"q":"625446","a":"ABCD"},{"q":"625448","a":"ABCD"},{"q":"657164","a":"B"},{"q":"657165","a":"A"}];
arr_a[1] = [{"q":"625474","a":"D"},{"q":"625473","a":"C"},{"q":"625475","a":"B"},{"q":"625481","a":"C"},{"q":"625445","a":"ABCD"},{"q":"625444","a":"ABC"},{"q":"625446","a":"ABCD"},{"q":"625447","a":"ABCD"},{"q":"625459","a":"B"},{"q":"625460","a":"B"}];
arr_a[2] = [{"q":"625543","a":"B"},{"q":"625538","a":"A"},{"q":"625541","a":"B"},{"q":"625544","a":"C"},{"q":"625483","a":"AD"},{"q":"625480","a":"ACD"},{"q":"625482","a":"ABD"},{"q":"625488","a":"BC"},{"q":"657112","a":"A"},{"q":"657116","a":"A"}];
arr_a[3] = [{"q":"657097","a":"A"},{"q":"625544","a":"C"},{"q":"625545","a":"D"},{"q":"657099","a":"C"},{"q":"657120","a":"ABCD"},{"q":"657113","a":"ABD"},{"q":"657119","a":"ABCD"},{"q":"657121","a":"ABCD"},{"q":"657166","a":"A"},{"q":"657167","a":"A"}];
arr_a[4] = [{"q":"625436","a":"B"},{"q":"625435","a":"A"},{"q":"625434","a":"D"},{"q":"625437","a":"D"},{"q":"625457","a":"BCD"},{"q":"625456","a":"ABC"},{"q":"625455","a":"ABCD"},{"q":"625476","a":"ABC"},{"q":"625472","a":"B"},{"q":"657094","a":"A"}];
arr_a[5] = [{"q":"657122","a":"A"},{"q":"657118","a":"B"},{"q":"657117","a":"D"},{"q":"657125","a":"D"},{"q":"625540","a":"ABCD"},{"q":"625539","a":"ACD"},{"q":"625535","a":"ABCD"},{"q":"625542","a":"CD"},{"q":"657102","a":"B"},{"q":"657112","a":"A"}];
arr_a[6] = [{"q":"625429","a":"B"},{"q":"625430","a":"C"},{"q":"625431","a":"B"},{"q":"625432","a":"D"},{"q":"657121","a":"ABCD"},{"q":"657124","a":"ACD"},{"q":"657127","a":"AB"},{"q":"657128","a":"ABC"},{"q":"625459","a":"B"},{"q":"625460","a":"B"}];
arr_a[7] = [{"q":"625544","a":"C"},{"q":"657097","a":"A"},{"q":"625545","a":"D"},{"q":"657099","a":"C"},{"q":"625521","a":"ACD"},{"q":"625523","a":"ABC"},{"q":"625522","a":"BCD"},{"q":"625524","a":"ABCD"},{"q":"657150","a":"A"},{"q":"657153","a":"B"}];
arr_a[8] = [{"q":"625379","a":"A"},{"q":"625381","a":"B"},{"q":"625380","a":"D"},{"q":"625382","a":"C"},{"q":"625478","a":"ABCD"},{"q":"625480","a":"ACD"},{"q":"625479","a":"ABCD"},{"q":"625482","a":"ABD"},{"q":"657154","a":"A"},{"q":"657160","a":"A"}];
arr_a[9] = [{"q":"625442","a":"C"},{"q":"625474","a":"D"},{"q":"625473","a":"C"},{"q":"625475","a":"B"},{"q":"625540","a":"ABCD"},{"q":"625546","a":"ABC"},{"q":"625542","a":"CD"},{"q":"657093","a":"ABCD"},{"q":"657116","a":"A"},{"q":"657123","a":"A"}];
arr_a[10] = [{"q":"625385","a":"D"},{"q":"625387","a":"B"},{"q":"625386","a":"D"},{"q":"625388","a":"A"},{"q":"625412","a":"ABCDE"},{"q":"625414","a":"ABCD"},{"q":"625413","a":"CD"},{"q":"625415","a":"AC"},{"q":"625424","a":"A"},{"q":"625425","a":"A"}];
arr_a[11] = [{"q":"625432","a":"D"},{"q":"625433","a":"B"},{"q":"625431","a":"B"},{"q":"625434","a":"D"},{"q":"625523","a":"ABC"},{"q":"625524","a":"ABCD"},{"q":"625522","a":"BCD"},{"q":"625525","a":"ABC"},{"q":"657116","a":"A"},{"q":"657123","a":"A"}];
arr_a[12] = [{"q":"625537","a":"C"},{"q":"625536","a":"B"},{"q":"625538","a":"A"},{"q":"625541","a":"B"},{"q":"657128","a":"ABC"},{"q":"657127","a":"AB"},{"q":"657131","a":"ABCD"},{"q":"657133","a":"ABCD"},{"q":"657132","a":"B"},{"q":"657134","a":"A"}];
arr_a[13] = [{"q":"625384","a":"D"},{"q":"625383","a":"B"},{"q":"625385","a":"D"},{"q":"625386","a":"D"},{"q":"625511","a":"AD"},{"q":"625510","a":"BD"},{"q":"625513","a":"ABC"},{"q":"625517","a":"ABCD"},{"q":"625421","a":"A"},{"q":"625422","a":"B"}];
arr_a[14] = [{"q":"625473","a":"C"},{"q":"625441","a":"B"},{"q":"625442","a":"C"},{"q":"625474","a":"D"},{"q":"625409","a":"ABD"},{"q":"625407","a":"ABD"},{"q":"625408","a":"AB"},{"q":"625410","a":"ABC"},{"q":"625466","a":"A"},{"q":"625467","a":"B"}];
arr_a[15] = [{"q":"625484","a":"A"},{"q":"625475","a":"B"},{"q":"625481","a":"C"},{"q":"625485","a":"C"},{"q":"625448","a":"ABCD"},{"q":"625446","a":"ABCD"},{"q":"625447","a":"ABCD"},{"q":"625449","a":"ABCDE"},{"q":"625472","a":"B"},{"q":"657094","a":"A"}];
arr_a[16] = [{"q":"625473","a":"C"},{"q":"625474","a":"D"},{"q":"625442","a":"C"},{"q":"625475","a":"B"},{"q":"625511","a":"AD"},{"q":"625513","a":"ABC"},{"q":"625510","a":"BD"},{"q":"625517","a":"ABCD"},{"q":"625461","a":"A"},{"q":"625462","a":"A"}];
arr_a[17] = [{"q":"625538","a":"A"},{"q":"625537","a":"C"},{"q":"625536","a":"B"},{"q":"625541","a":"B"},{"q":"625540","a":"ABCD"},{"q":"625539","a":"ACD"},{"q":"625535","a":"ABCD"},{"q":"625542","a":"CD"},{"q":"657164","a":"B"},{"q":"657165","a":"A"}];
arr_a[18] = [{"q":"625394","a":"B"},{"q":"625393","a":"A"},{"q":"625392","a":"C"},{"q":"625395","a":"C"},{"q":"657152","a":"ABD"},{"q":"657151","a":"ABCD"},{"q":"657148","a":"ABCD"},{"q":"657156","a":"ABCDE"},{"q":"625467","a":"B"},{"q":"625468","a":"A"}];
arr_a[19] = [{"q":"625388","a":"A"},{"q":"625387","a":"B"},{"q":"625389","a":"D"},{"q":"625390","a":"C"},{"q":"657141","a":"ABCD"},{"q":"657140","a":"ABCD"},{"q":"657143","a":"AB"},{"q":"657148","a":"ABCD"},{"q":"625426","a":"A"},{"q":"625427","a":"B"}];
arr_a[20] = [{"q":"625396","a":"D"},{"q":"625395","a":"C"},{"q":"625397","a":"A"},{"q":"625428","a":"A"},{"q":"625457","a":"BCD"},{"q":"625456","a":"ABC"},{"q":"625476","a":"ABC"},{"q":"625477","a":"ABCD"},{"q":"625465","a":"B"},{"q":"625466","a":"A"}];
arr_a[21] = [{"q":"625518","a":"A"},{"q":"625526","a":"A"},{"q":"625520","a":"B"},{"q":"625528","a":"B"},{"q":"625482","a":"ABD"},{"q":"625488","a":"BC"},{"q":"625483","a":"AD"},{"q":"625490","a":"BCD"},{"q":"625463","a":"A"},{"q":"625464","a":"A"}];
arr_a[22] = [{"q":"625387","a":"B"},{"q":"625385","a":"D"},{"q":"625386","a":"D"},{"q":"625388","a":"A"},{"q":"625511","a":"AD"},{"q":"625508","a":"ABC"},{"q":"625510","a":"BD"},{"q":"625513","a":"ABC"},{"q":"657130","a":"A"},{"q":"657132","a":"B"}];
arr_a[23] = [{"q":"657155","a":"D"},{"q":"657146","a":"D"},{"q":"657149","a":"A"},{"q":"657161","a":"A"},{"q":"625508","a":"ABC"},{"q":"625506","a":"ABCD"},{"q":"625507","a":"AC"},{"q":"625510","a":"BD"},{"q":"657136","a":"A"},{"q":"657139","a":"A"}];
arr_a[24] = [{"q":"625514","a":"A"},{"q":"625512","a":"B"},{"q":"625509","a":"D"},{"q":"625515","a":"C"},{"q":"657111","a":"ABCD"},{"q":"657109","a":"ABCD"},{"q":"657108","a":"ABCD"},{"q":"657113","a":"ABD"},{"q":"657134","a":"A"},{"q":"657136","a":"A"}];
arr_a[25] = [{"q":"625514","a":"A"},{"q":"625512","a":"B"},{"q":"625509","a":"D"},{"q":"625515","a":"C"},{"q":"625498","a":"BC"},{"q":"625496","a":"ABCD"},{"q":"625495","a":"BCD"},{"q":"625499","a":"ACD"},{"q":"625424","a":"A"},{"q":"625425","a":"A"}];
arr_a[26] = [{"q":"625512","a":"B"},{"q":"625514","a":"A"},{"q":"625515","a":"C"},{"q":"625516","a":"D"},{"q":"625404","a":"AC"},{"q":"625405","a":"ABCD"},{"q":"625406","a":"BCD"},{"q":"625407","a":"ABD"},{"q":"625471","a":"A"},{"q":"625472","a":"B"}];
arr_a[27] = [{"q":"657097","a":"A"},{"q":"657105","a":"A"},{"q":"657099","a":"C"},{"q":"657110","a":"C"},{"q":"657121","a":"ABCD"},{"q":"657127","a":"AB"},{"q":"657124","a":"ACD"},{"q":"657128","a":"ABC"},{"q":"625468","a":"A"},{"q":"625469","a":"A"}];
arr_a[28] = [{"q":"625437","a":"D"},{"q":"625439","a":"C"},{"q":"625438","a":"A"},{"q":"625440","a":"D"},{"q":"625415","a":"AC"},{"q":"625444","a":"ABC"},{"q":"625443","a":"BCD"},{"q":"625445","a":"ABCD"},{"q":"657102","a":"B"},{"q":"657112","a":"A"}];
arr_a[29] = [{"q":"625397","a":"A"},{"q":"625429","a":"B"},{"q":"625428","a":"A"},{"q":"625430","a":"C"},{"q":"625490","a":"BCD"},{"q":"625493","a":"AB"},{"q":"625492","a":"AB"},{"q":"625494","a":"ABC"},{"q":"625461","a":"A"},{"q":"625462","a":"A"}];
arr_a[30] = [{"q":"657125","a":"D"},{"q":"657126","a":"A"},{"q":"657122","a":"A"},{"q":"657138","a":"A"},{"q":"625492","a":"AB"},{"q":"625493","a":"AB"},{"q":"625490","a":"BCD"},{"q":"625494","a":"ABC"},{"q":"657145","a":"A"},{"q":"657147","a":"A"}];
arr_a[31] = [{"q":"625541","a":"B"},{"q":"625543","a":"B"},{"q":"625538","a":"A"},{"q":"625544","a":"C"},{"q":"625403","a":"AD"},{"q":"625404","a":"AC"},{"q":"625402","a":"ABCDE"},{"q":"625405","a":"ABCD"},{"q":"625426","a":"A"},{"q":"625427","a":"B"}];
arr_a[32] = [{"q":"625475","a":"B"},{"q":"625474","a":"D"},{"q":"625481","a":"C"},{"q":"625484","a":"A"},{"q":"625450","a":"ABD"},{"q":"625449","a":"ABCDE"},{"q":"625451","a":"ABCD"},{"q":"625452","a":"ABCD"},{"q":"625416","a":"A"},{"q":"625417","a":"A"}];
arr_a[33] = [{"q":"657099","a":"C"},{"q":"657097","a":"A"},{"q":"657105","a":"A"},{"q":"657110","a":"C"},{"q":"625452","a":"ABCD"},{"q":"625451","a":"ABCD"},{"q":"625453","a":"BCD"},{"q":"625454","a":"ABCD"},{"q":"657112","a":"A"},{"q":"657116","a":"A"}];
arr_a[34] = [{"q":"625442","a":"C"},{"q":"625440","a":"D"},{"q":"625441","a":"B"},{"q":"625473","a":"C"},{"q":"625546","a":"ABC"},{"q":"625540","a":"ABCD"},{"q":"625542","a":"CD"},{"q":"657093","a":"ABCD"},{"q":"657154","a":"A"},{"q":"657160","a":"A"}];
arr_a[35] = [{"q":"625503","a":"D"},{"q":"625512","a":"B"},{"q":"625509","a":"D"},{"q":"625514","a":"A"},{"q":"657106","a":"BCD"},{"q":"657108","a":"ABCD"},{"q":"657107","a":"BD"},{"q":"657109","a":"ABCD"},{"q":"657123","a":"A"},{"q":"657129","a":"A"}];
arr_a[36] = [{"q":"625433","a":"B"},{"q":"625435","a":"A"},{"q":"625434","a":"D"},{"q":"625436","a":"B"},{"q":"625410","a":"ABC"},{"q":"625412","a":"ABCDE"},{"q":"625411","a":"ABC"},{"q":"625413","a":"CD"},{"q":"657145","a":"A"},{"q":"657147","a":"A"}];
arr_a[37] = [{"q":"625380","a":"D"},{"q":"625381","a":"B"},{"q":"625379","a":"A"},{"q":"625382","a":"C"},{"q":"625493","a":"AB"},{"q":"625494","a":"ABC"},{"q":"625492","a":"AB"},{"q":"625495","a":"BCD"},{"q":"657165","a":"A"},{"q":"657166","a":"A"}];
arr_a[38] = [{"q":"625439","a":"C"},{"q":"625440","a":"D"},{"q":"625438","a":"A"},{"q":"625441","a":"B"},{"q":"657137","a":"ACD"},{"q":"657140","a":"ABCD"},{"q":"657135","a":"ABCD"},{"q":"657141","a":"ABCD"},{"q":"657160","a":"A"},{"q":"657163","a":"A"}];
arr_a[39] = [{"q":"625440","a":"D"},{"q":"625439","a":"C"},{"q":"625441","a":"B"},{"q":"625442","a":"C"},{"q":"657121","a":"ABCD"},{"q":"657120","a":"ABCD"},{"q":"657124","a":"ACD"},{"q":"657127","a":"AB"},{"q":"625418","a":"A"},{"q":"625419","a":"A"}];
arr_a[40] = [{"q":"625518","a":"A"},{"q":"625515","a":"C"},{"q":"625516","a":"D"},{"q":"625520","a":"B"},{"q":"657093","a":"ABCD"},{"q":"625542","a":"CD"},{"q":"625546","a":"ABC"},{"q":"657095","a":"ABD"},{"q":"657130","a":"A"},{"q":"657132","a":"B"}];
arr_a[41] = [{"q":"625428","a":"A"},{"q":"625396","a":"D"},{"q":"625397","a":"A"},{"q":"625429","a":"B"},{"q":"625448","a":"ABCD"},{"q":"625446","a":"ABCD"},{"q":"625447","a":"ABCD"},{"q":"625449","a":"ABCDE"},{"q":"625416","a":"A"},{"q":"625417","a":"A"}];
arr_a[42] = [{"q":"625390","a":"C"},{"q":"625388","a":"A"},{"q":"625389","a":"D"},{"q":"625391","a":"A"},{"q":"625403","a":"AD"},{"q":"625401","a":"ABCDE"},{"q":"625402","a":"ABCDE"},{"q":"625404","a":"AC"},{"q":"657123","a":"A"},{"q":"657129","a":"A"}];
arr_a[43] = [{"q":"657146","a":"D"},{"q":"657138","a":"A"},{"q":"657126","a":"A"},{"q":"657149","a":"A"},{"q":"625529","a":"CD"},{"q":"625527","a":"BCD"},{"q":"625525","a":"ABC"},{"q":"625530","a":"AC"},{"q":"657102","a":"B"},{"q":"657112","a":"A"}];
arr_a[44] = [{"q":"657114","a":"D"},{"q":"657110","a":"C"},{"q":"657105","a":"A"},{"q":"657115","a":"D"},{"q":"625445","a":"ABCD"},{"q":"625444","a":"ABC"},{"q":"625443","a":"BCD"},{"q":"625446","a":"ABCD"},{"q":"657154","a":"A"},{"q":"657160","a":"A"}];
arr_a[45] = [{"q":"625528","a":"B"},{"q":"625533","a":"D"},{"q":"625536","a":"B"},{"q":"625537","a":"C"},{"q":"625448","a":"ABCD"},{"q":"625449","a":"ABCDE"},{"q":"625450","a":"ABD"},{"q":"625451","a":"ABCD"},{"q":"657154","a":"A"},{"q":"657160","a":"A"}];
arr_a[46] = [{"q":"625394","a":"B"},{"q":"625395","a":"C"},{"q":"625396","a":"D"},{"q":"625397","a":"A"},{"q":"625452","a":"ABCD"},{"q":"625453","a":"BCD"},{"q":"625454","a":"ABCD"},{"q":"625455","a":"ABCD"},{"q":"625472","a":"B"},{"q":"657094","a":"A"}];
arr_a[47] = [{"q":"625439","a":"C"},{"q":"625437","a":"D"},{"q":"625438","a":"A"},{"q":"625440","a":"D"},{"q":"657124","a":"ACD"},{"q":"657120","a":"ABCD"},{"q":"657121","a":"ABCD"},{"q":"657127","a":"AB"},{"q":"657134","a":"A"},{"q":"657136","a":"A"}];
arr_a[48] = [{"q":"625432","a":"D"},{"q":"625433","a":"B"},{"q":"625431","a":"B"},{"q":"625434","a":"D"},{"q":"625523","a":"ABC"},{"q":"625524","a":"ABCD"},{"q":"625522","a":"BCD"},{"q":"625525","a":"ABC"},{"q":"657116","a":"A"},{"q":"657123","a":"A"}];
arr_a[49] = [{"q":"625512","a":"B"},{"q":"625514","a":"A"},{"q":"625509","a":"D"},{"q":"625515","a":"C"},{"q":"625501","a":"ABC"},{"q":"625502","a":"ACD"},{"q":"625500","a":"CD"},{"q":"625504","a":"ABC"},{"q":"625427","a":"B"},{"q":"625458","a":"A"}];
            await sleep(2000);
            console.log(arr_a);
            //获取练习ID
            //var url = window.location.href;
            //let p = url.split("?")[1];
            //let pa = new URLSearchParams(p);
            //let id = pa.get('id');
            //获取cookie
            const getCookie = (name) => document.cookie.match(`[;\s+]?${name}=([^;]*)`)?.pop();
            //var series = getCookie('ex_range_' + id);
            var series = getCookie('ex_range_5020');
            console.log('series：' + series);
            console.log(arr_a[series]);
            //答案页面url
            //var url_answer = "http://www.faxuanyun.com/ess/service/getpaper?paperId=5020&series=" + series + "_answer";
            //console.log('url_answer：' + url_answer);
            //通过Ajax获取答案
            //var msg = $.get(url_answer,function(res){var msg = res;});
            //await sleep(2000);
            //var msg_response = msg['responseText'].match(/(\[\S*\])/)[1];
            //console.log('msg_response：' + msg_response);
            var answer = arr_a[series];
            console.log(answer);
            await sleep(2000);
            //做第一题
            danxuan(0);
            await sleep(2000);
            //做第二题
            document.querySelector('#img_2').click();
            console.log('3秒后做第2题');
            await sleep(2000);
            danxuan(1);
            await sleep(2000);
            //做第三题
            document.querySelector('#img_3').click();
            console.log('3秒后做第3题');
            await sleep(2000);
            danxuan(2);
            await sleep(2000);
            //做第四题
            document.querySelector('#img_4').click();
            console.log('3秒后做第4题');
            await sleep(2000);
            danxuan(3);
            await sleep(2000);
            //做第五题
            document.querySelector('#img_5').click();
            console.log('3秒后做第5题');
            await sleep(2000);
            duoxuan(4);
            await sleep(2000);
            //做第六题
            document.querySelector('#img_6').click();
            console.log('3秒后做第6题');
            await sleep(2000);
            duoxuan(5);
            await sleep(2000);
            //做第七题
            document.querySelector('#img_7').click();
            console.log('3秒后做第7题');
            await sleep(2000);
            duoxuan(6);
            await sleep(2000);
            //做第八题
            document.querySelector('#img_8').click();
            console.log('3秒后做第8题');
            await sleep(2000);
            duoxuan(7);
            await sleep(2000);
            //做第九题
            document.querySelector('#img_9').click();
            console.log('3秒后做第9题');
            await sleep(2000);
            panduan(8);
            await sleep(2000);
            //做第十题
            document.querySelector('#img_10').click();
            console.log('3秒后做第10题');
            await sleep(2000);
            panduan(9);
            await sleep(2000);
            //提交
            document.querySelector('#practicetime>div>a').click();
            await sleep(2000);
            document.querySelector('#popwinConfirm').click();
            await sleep(3000);
        }
        //判断练习页面结束
        if (document.querySelector("#showPointTip")) {
            window.close();
        }
    }
    //开始执行主函数
    setTimeout(start, 3000);
})();