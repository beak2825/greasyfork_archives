// ==UserScript==
// @name         南信大图书馆入馆考试助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  进入南信大入馆考试页面，遇到不会的题按空格自动选择正确答案，如遇问题可加QQ 835573228
// @author       ZYY
// @include      http://learner.nuist.edu.cn/**
// @downloadURL https://update.greasyfork.org/scripts/433437/%E5%8D%97%E4%BF%A1%E5%A4%A7%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%85%A5%E9%A6%86%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433437/%E5%8D%97%E4%BF%A1%E5%A4%A7%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%85%A5%E9%A6%86%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //===========================开始==============================

    var ti_list = ['图书馆一共有多少间1224平方米的大型借阅室？', '因特殊情况需要个别注册“校园卡证籍”，应该到哪个部门办理手续？', '本科生一次可以借多少册外文图书？', '教职工、研究生借阅期限为？', '科技查新室是在图书馆的哪里？', '所有读者可借阅各种图书最多可以多少册？', '上午可以科技查新的时间是？', '为了提高图书的利用率，每人每次取书不得超过多少册', '本科生的借阅期限为？', '电子阅览室在哪一层？', '寒暑假期间到期的图书，借期可以延至开学日后的多少天？', '赔偿手续办好后，找到了需要赔偿的原有资料怎么办？', '馆藏查询地址是？', '江苏省高校通用借书证每年可办理的时间是？', '图书馆一共有多少间322平方 米的中型借阅室？', '丢失校园卡后，可以到哪个部门办理挂失手续？', '网上挂失校园卡的地址是？', '图书馆一共有多少册印刷型文献？', '哲学、社会学书刊在借阅期间发生损坏严重，影响内容完整者，按原价多少赔偿？', '补办校园卡新卡后，原有卡内余额会？', '书刊资料在借阅期间发生损坏、涂改现象程度较轻，不影响内容完整者，按原价多少赔偿？', '馆藏中文科技书、专业期刊和专业资料在借阅期间发生损坏严重，影响内容完整者，按原价多少赔偿？', '南京信息工程大学图书馆创建于哪一年？', '网上挂失校园卡的地址是？', '多卷集图书和有卷期的刊物遗失一本或数本应该如何赔偿？', '周一到周五图书馆开放的时间是？', '想要体验图书馆的VR虚拟现实，应该去一层的哪里？', '图书馆一共有多少册电子图书？', '中文图书逾期后收取多少占用费？', '江苏省高校通用借书证图书借阅期限为？', '关于图书馆放映厅的服务对象哪个是正确的', '信息共享空间在哪一层？', '中外文过刊，最大借期为多少天？', '偷窃书籍者，除追回原书刊资料外，还应按原价的多少倍进行赔偿？', '阅览室图书因复印等特殊需要临时借出，若当日未归还，逾期将收取每天每册逾期占用费多少元？', '图书馆一共有多少册电子图书？', '周六日图书馆的开放时间是？', '中外文现刊如需借出，下面哪个选项是正确的？','自己的校园卡可以给哪些人使用？','关于馆际互借，一下几个选项中哪个是错误的？','每天几点后可以在微信预约五楼的电子阅览室？','文献传递中产生的费用改如何收取？','按本馆《读者损坏遗失书刊资料赔偿办法》，损害图书最高多少倍赔偿？','读者赔偿款该怎么处理','想要借文科理科的书可以去几楼？']
    var answer_list = ['A', 'B', 'B', 'C', 'B', 'A', 'C', 'C', 'B', 'B', 'D', 'C', 'C', 'D', 'C', 'B', 'D', 'A', 'D', 'C', 'D', 'A', 'C', 'D', 'C', 'B', 'C', 'C', 'B', 'D', 'B', 'D', 'C', 'A', 'D', 'C', 'A', 'A','D','B','A','B','D','A','B']

    alert('遇到不会的题目按空格键自动选择答案！')
    document.onkeydown=function(e){  //对整个页面文档监听
        var keyNum=window.event ? e.keyCode :e.which;  //获取被按下的键值

        if(keyNum==32){
            var tiIndex_list=document.querySelectorAll('.examing_num.clearfix')[0].querySelectorAll('li')
            let ti = document.querySelector('.examing_right_ h4[data-v-1adbac28] span').innerText
            let max_similar = 0
            let max_similar_index = -1
            for(let j = 0;j<ti_list.length;j++){
                if(similar(ti,ti_list[j])>max_similar){
                    max_similar = similar(ti,ti_list[j])
                    max_similar_index = j
                }
            }
            console.log(ti,ti_list[max_similar_index])
            console.log(similar(ti,ti_list[max_similar_index]))
            console.log(max_similar_index)
            if(max_similar>0.5){
                if(answer_list[max_similar_index].indexOf('A')!=-1){
                    document.querySelectorAll('.examing_ans div')[0].click()
                }
                if(answer_list[max_similar_index].indexOf('B')!=-1){
                    document.querySelectorAll('.examing_ans div')[1].click()
                }
                if(answer_list[max_similar_index].indexOf('C')!=-1){
                    document.querySelectorAll('.examing_ans div')[2].click()
                }
                if(answer_list[max_similar_index].indexOf('D')!=-1){
                    document.querySelectorAll('.examing_ans div')[3].click()
                }
            }else{
                alert('本题没有找到答案！')
            }
        }
    }

    //===========================结束==============================
    //文本相似度判断
    function similar(s, t, f) {
        if (!s || !t) {
            return 0
        }
        var l = s.length > t.length ? s.length : t.length
        var n = s.length
        var m = t.length
        var d = []
        f = f || 3
        var min = function(a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c)
        }
        var i, j, si, tj, cost
        if (n === 0) return m
        if (m === 0) return n
        for (i = 0; i <= n; i++) {
            d[i] = []
            d[i][0] = i
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j
        }
        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1)
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1)
                if (si === tj) {
                    cost = 0
                } else {
                    cost = 1
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
            }
        }
        let res = (1 - d[n][m] / l)
        return res.toFixed(f)
    }
    //累加list前num数的和
    function leijia(list,num){
        var sum = 0
        for(var i=0;i<num;i++){
            sum+=list[i];
        }
        return sum;
    }

    //生成从minNum到maxNum的随机数
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }
    //判断num是否在指定区间内
    function isInRange(num,start,end){
        if(num>=start && num<=end){
            return true;
        }else{
            return false;
        }
    }
    //单选题执行函数
    function danxuan(bili){
        var pp = randomNum(1,100)
        for(var i=1;i<=bili.length;i++){
            var start = 0;
            if(i!=1){
                start = leijia(bili,i-1)
            }
            var end = leijia(bili,i);
            if(isInRange(pp,start,end)){
                return i-1;
                break;
            }
        }
    }
    //多选题执行函数
    function duoxuan(probability){
        var flag = false;
        var i = randomNum(1,100);
        if(isInRange(i,1,probability)){
            flag = true;
        }
        return flag;
    }

    //清楚cookie
    function clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
            }
        }
        alert('已清除');
    }
    //滑动验证函数
    function yanzhen(){
        var event = document.createEvent('MouseEvents');
        event.initEvent('mousedown', true, false);
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
        event = document.createEvent('MouseEvents');
        event.initEvent('mousemove', true, false);
        Object.defineProperty(event,'clientX',{get(){return 260;}})
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
    }

    //滚动到末尾函数
    function scrollToBottom(){
        (function () {
            var y = document.body.scrollTop;
            var step = 500;
            window.scroll(0, y);
            function f() {
                if (y < document.body.scrollHeight) {
                    y += step;
                    window.scroll(0, y);
                    setTimeout(f, 50);
                }
                else {
                    window.scroll(0, y);
                    document.title += "scroll-done";
                }
            }
            setTimeout(f, 1000);
        })();
    }
})();