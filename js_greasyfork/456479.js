// ==UserScript==
// @name         福建华博继续教育自动填验证--Microsoft Edge版本 108.0.1462.46 (正式版本) (64 位)有效，360浏览器10内核63.0.3292.129无效
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  福建继续教育--自动过计算题验证
// @author       SuperW
// @match        *://*.59iedu.com/*
// @match        https://fjysxhpx.59iedu.com/play/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456479/%E7%A6%8F%E5%BB%BA%E5%8D%8E%E5%8D%9A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%A1%AB%E9%AA%8C%E8%AF%81--Microsoft%20Edge%E7%89%88%E6%9C%AC%201080146246%20%28%E6%AD%A3%E5%BC%8F%E7%89%88%E6%9C%AC%29%20%2864%20%E4%BD%8D%29%E6%9C%89%E6%95%88%EF%BC%8C360%E6%B5%8F%E8%A7%88%E5%99%A810%E5%86%85%E6%A0%B86303292129%E6%97%A0%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/456479/%E7%A6%8F%E5%BB%BA%E5%8D%8E%E5%8D%9A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%A1%AB%E9%AA%8C%E8%AF%81--Microsoft%20Edge%E7%89%88%E6%9C%AC%201080146246%20%28%E6%AD%A3%E5%BC%8F%E7%89%88%E6%9C%AC%29%20%2864%20%E4%BD%8D%29%E6%9C%89%E6%95%88%EF%BC%8C360%E6%B5%8F%E8%A7%88%E5%99%A810%E5%86%85%E6%A0%B86303292129%E6%97%A0%E6%95%88.meta.js
// ==/UserScript==

(function () {

    console.log("****脚本运行了*****");
    //保存原函数的引用
    let clr = window.clearInterval;
    window.clearInterval = (id) => {
        if (id != myID) {
            //调用原函数
            clr(id);
            //这里不能用clearInterval,会爆堆栈
        }
    }
    let myID =setInterval(function(){
        console.log("脚本运行中……")
        function jisuan(x,y,z)
        {
            var s;
            x=Number(x);
            z=Number(z);
            if (y=="+"){s=x+z;}
            else if (y=="-")
            {s=x-z;}
            else if (y=="x")
            {s=x*z;}
            else if (y=="÷")
            {s=s/z;};
            return s;
        };
        //判断验证码页面是否出现
        var zt=document.querySelector('.vjs-play-control > span:nth-child(2)')?.textContent;
        var question = document.querySelector(".d-qus-body");
        if(zt=="播放"&&question==null){
            document.querySelector('.vjs-play-control').click()}
        if(question!=null){
            console.log("验证页面出现了");
            // 提取题目输出：例"2 x 5 = ?"
            let qu=document.querySelector(".d-qus-body").innerText;
            //提取题目并进行计算
            //let qu = "2 x 5 = ?"
            console.log('获取题目：',qu);
            console.log(qu[0],qu[2],qu[4]);
            let a=jisuan(qu[0],qu[2],qu[4]);
            console.log("计算结果：",a);
            // 提取A选项答案
            let ansA=document.querySelector('div.d-slt:nth-child(1) > label:nth-child(1) > span:nth-child(4)')?.innerText;
            // A选项是否被选中
            let chA=document.querySelector('div.d-slt:nth-child(1) > label:nth-child(1) > input:nth-child(1)');
            //  提取B选项答案
            let ansB=document.querySelector('div.d-slt:nth-child(2) > label:nth-child(1) > span:nth-child(4)')?.innerText;
            // B选项是否被选中
            let chB=document.querySelector('div.d-slt:nth-child(2) > label:nth-child(1) > input:nth-child(1)');
            //  提取C选项答案
            let ansC=document.querySelector('div.d-slt:nth-child(3) > label:nth-child(1) > span:nth-child(4)')?.innerText;
            // C选项是否被选中
            let chC=document.querySelector('div.d-slt:nth-child(3) > label:nth-child(1) > input:nth-child(1)');
            //  提取D选项答案
            let ansD=document.querySelector('div.d-slt:nth-child(4) > label:nth-child(1) > span:nth-child(4)')?.innerText;
            // D选项是否被选中
            let chD=document.querySelector('div.d-slt:nth-child(4) > label:nth-child(1) > input:nth-child(1)');
            console.log(ansA,ansB,ansC,ansD);
            console.log(chA.checked,chB.checked,chC.checked,chD.checked);
            //查找答案的位置并选中正确选项
            if (a==ansA){
                chA.checked=true;
                chA.click();
                console.log("点击了正确答案A");
            }
            else if (a==ansB){
                chB.checked=true;
                chB.click();
                console.log("点击了正确答案B");
            }
            else if (a==ansC){
                chC.checked=true;
                chC.click();
                console.log("点击了正确答案C");
            }
            else if (a==ansD){
                chD.checked=true;
                chD.click();
                console.log("点击了正确答案D");
            };
            //点击提交答案按钮			//延时0.5秒
            setTimeout(document.querySelector('.blue').click(),500);
            //点击关闭窗口按钮			//延时0.5秒
            setTimeout(document.querySelector('.blue').click(),500);
        };
    }, 3000);

})();