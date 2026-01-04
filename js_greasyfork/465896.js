// ==UserScript==
// @name         学习强国
// @namespace    http://www.mtnlmm.cn/
// @version      0.6.2
// @description  学习强国，自动答题，每题，每周，专题自动答题，本代码仅用于学习js所用，切勿用作违法用途，转载请注明出处。
// @author       馒头拿来摸摸
// @match        https://pc.xuexi.cn/points/exam-practice.html*
// @match        https://pc.xuexi.cn/points/exam-weekly-detail.html*
// @match        https://pc.xuexi.cn/points/exam-paper-detail.html*
// @match        https://pc.xuexi.cn/points/login.html*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/465896/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/465896/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function doit()
    {
        var nextAll=document.querySelectorAll(".ant-btn");

        var next=nextAll[0];

        if(nextAll.length==2)//俩按钮，说明有个按钮是交卷。
        {
            next=nextAll[1];
        }
        if(next.disabled)
        {


            document.querySelector(".tips").click();

            //所有提示
            var allTips=document.querySelectorAll("font[color=red]");


            //单选多选时候的按钮
            var buttons=document.querySelectorAll(".q-answer");

            //填空时候的那个textbox，这里假设只有一个填空
            var textboxs=document.querySelectorAll("input");
            //问题类型
            var qType= document.querySelector(".q-header").textContent;

            qType=qType.substr(0,3)

            switch(qType)
            {
                case"填空题":
                    //第几个填空
                    var mevent=new Event('input',{bubbles:true});
                    if( textboxs.length>1)//若不止是一个空
                    {
                        //填空数量和提示数量是否一致
                        if(allTips.length==textboxs.length)
                        {
                            for(let i=0;i< allTips.length;i++)//数量一致，则一一对应。
                            {
                                let tip=allTips[i];
                                let tipText=tip.textContent;
                                if(tipText.length>0)
                                {
                                    //通过设置属性,然后立即让他冒泡这个input事件.
                                    //否则1,setattr后,内容消失.
                                    //否则2,element.value=124后,属性值value不会改变,所以冒泡也不管用.
                                    textboxs[i].setAttribute("value",tipText);
                                    textboxs[i] .dispatchEvent(mevent);
                                  //  break;
                                }
                            }
                        }
                        else
                        {
                            //若填空数量和提示数量不一致，那么，应该都是提示数量多。

                            if(allTips.length>textboxs.length)
                            {
                                var lineFeed=document.querySelector('.line-feed').textContent;//这个是提示的所有内容，不仅包含红色答案部分。
                                let n=0;//计数，第几个tip。
                                for(let j=0;j<textboxs.length;j++)//多个填空
                                {

                                    let tipText=allTips[n].textContent;
                                    let nextTipText="";
                                    do{
                                     tipText+=nextTipText;
                                        if(n<textboxs.length-1)
                                        {
                                            n++;
                                            nextTipText=allTips[n].textContent;
                                        }
                                        else
                                        {
                                            nextTipText="结束了，没有了。";
                                        }
                                    }
                                    while(lineFeed.indexOf(tipText+nextTipText));

                                    textboxs[j].setAttribute("value",tipText);
                                    textboxs[j] .dispatchEvent(mevent);
                                }

                            }
                            else
                            {
                                //提示数量少于填空数量，不好拆分答案，想加自己加。
                            }

                        }
                    }
                    else if(textboxs.length==1)
                    {//只有一个空，直接把所有tips合并。
                        let tipText="";
                        for(let i=0;i< allTips.length;i++)
                        {
                            tipText += allTips[i].textContent;
                        }
                        textboxs[0].setAttribute("value",tipText);
                        textboxs[0] .dispatchEvent(mevent);
                        break;
                    }
                    else
                    {
                        //怕有没空白的情况。
                    }

                    break;
                case "多选题":
                    for(let js=0;js<buttons.length;js++)//循环选项列表。用来点击
                    {
                        let cButton=buttons[js];
                        for(let i=0;i< allTips.length;i++)//循环提示列表。
                        {
                            let tip=allTips[i];
                            let tipText=tip.textContent;
                            if(tipText.length>0)//提示内容长度大于0
                            {
                                let cButtonText=cButton.textContent;//选项按钮的内容
                                //循环对比点击
                                if(cButtonText.indexOf(tipText)>-1||tipText.indexOf(cButtonText)>-1)
                                {

                                    cButton.click();
                                    break;
                                }
                            }
                        }
                    }
                    break;

                case "单选题":                  
                    if(true)
                    {
                        //把红色提示组合为一条
                        let tipText="";
                        for(let i=0;i< allTips.length;i++)
                        {
                            tipText += allTips[i].textContent;
                        }

                        if(tipText.length>0)
                        {
                            //循环对比后点击
                            for(let js=0;js<buttons.length;js++)
                            {
                                let cButton=buttons[js];
                                let cButtonText=cButton.textContent;
                                //通过判断是否相互包含，来确认是不是此选项
                                if(cButtonText.indexOf(tipText)>-1||tipText.indexOf(cButtonText)>-1)
                                {
                                    cButton.click();
                                    break;
                                }
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            document.querySelector(".tips").click();
        }
        else
        {
            if(next.textContent!="再练一次"&&next.textContent!="再来一组"&&next.textContent!="查看解析"){
                next.click();
            }
        }

    };

    window.setInterval(doit, 3000);

})();