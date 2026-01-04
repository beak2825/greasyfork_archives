// ==UserScript==
// @name         專用
// @namespace    
// @version      2.1
// @description  try to take over the world!
// @author       MARBO&jj
// @match        
// @grant        
// @downloadURL https://update.greasyfork.org/scripts/39101/%E5%B0%88%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/39101/%E5%B0%88%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
function liandrugFirstFunc(){
                    if(ssssButton.innerText == '小功能'){
                        // killrun();
                        MiaoJiangFunc();
                        // killrunInterval = setInterval(killrun,400);
                        // liandrugInterval = setInterval(liandrugSecondFunc,6000);
                        ssssButton.innerText = '停小功能';
                    }
                    else{
                        // clearInterval(liandrugInterval);
                        // clearInterval(killrunInterval);
                        clearTimeout(liandrugSecondFunc);
                        ssssButton.innerText = '小功能';
                    }
                }
				function MiaoJiangFunc(){
                    clickButton('home');
                    setTimeout(function(){clickButton('shop money_buy shop9_N_10')},200);
                    setTimeout(function(){clickButton('shop money_buy shop9')},400);
                    setTimeout(function(){clickButton('shop money_buy shop9')},600);
                    setTimeout(function(){clickButton('shop money_buy shop9')},800);
                    setTimeout(function(){clickButton('shop money_buy shop9')},1000);
                    setTimeout(function(){clickButton('shop money_buy shop9')},1200);
                    setTimeout(function(){clickButton('shop money_buy shop10_N_10')},1400);
                    setTimeout(function(){clickButton('shop money_buy shop10')},1600);
                    setTimeout(function(){clickButton('shop money_buy shop10')},1800);
                    setTimeout(function(){clickButton('shop money_buy shop10')},2000);
                    setTimeout(function(){clickButton('shop money_buy shop10')},2200);
                    setTimeout(function(){clickButton('shop money_buy shop10')},2400);
                   setTimeout(function(){clickButton('jh 40')},2600)
                   setTimeout(function(){clickButton('go south')},2800) //黄土大道
                   setTimeout(function(){clickButton('go south')},3000) //黄土大道
                   setTimeout(function(){clickButton('go south')},3200) //苗疆地界
                   setTimeout(function(){clickButton('go south')},3400) //苗疆地界
                   setTimeout(function(){clickButton('go east')},3600) //苗疆地界
                   setTimeout(function(){clickButton('go south')},3800) //黄土小路
                   setTimeout(function(){clickButton('go southeast')},4000) //黄土小路
                   setTimeout(function(){clickButton('go southwest')},4200) //黄土小路
                   setTimeout(function(){clickButton('go south')},4400) //密林
                   setTimeout(function(){clickButton('go southwest')},4600) //左下
                   setTimeout(function(){clickButton('go east')},4800) //右
                   setTimeout(function(){clickButton('go east')},5000) //右
                   setTimeout(function(){clickButton('go southwest')},5200) //左下
                   setTimeout(function(){clickButton('go southeast')},5400) //右下
                   setTimeout(function(){clickButton('go southwest')},5600) //江边小路
                   setTimeout(function(){clickButton('go southeast')},5800) //北岸
                   setTimeout(function(){clickButton('event_1_8004914')},6000) //到草地
                   setTimeout(CaoDiFunc,7500);
                    //alert($('.cmd_click_room')[0].innerText);*/
                  }
                   function MiaoJiang1Func(){
                    //clickButton('home');
                    setTimeout(function(){clickButton('jh 40')},200)
                   setTimeout(function(){clickButton('go south')},400) //黄土大道
                   setTimeout(function(){clickButton('go south')},600) //黄土大道
                   setTimeout(function(){clickButton('go south')},600) //苗疆地界
                   setTimeout(function(){clickButton('go south')},800) //苗疆地界
                   setTimeout(function(){clickButton('go east')},1000) //苗疆地界
                   setTimeout(function(){clickButton('go south')},1200) //黄土小路
                   setTimeout(function(){clickButton('go southeast')},1400) //黄土小路
                   setTimeout(function(){clickButton('go southwest')},1600) //黄土小路
                   setTimeout(function(){clickButton('go south')},1800) //密林
                   setTimeout(function(){clickButton('go southwest')},2000) //左下
                   setTimeout(function(){clickButton('go east')},2200) //右
                   setTimeout(function(){clickButton('go east')},2400) //右
                   setTimeout(function(){clickButton('go southwest')},2600) //左下
                   setTimeout(function(){clickButton('go southeast')},2800) //右下
                   setTimeout(function(){clickButton('go southwest')},3000) //江边小路
                   setTimeout(function(){clickButton('go southeast')},3200) //北岸
                   setTimeout(function(){clickButton('event_1_8004914')},3400) //到草地
                   setTimeout(CaoDiFunc,4900);
                    //alert($('.cmd_click_room')[0].innerText);
                  }

				  function CaoDiFunc(){
                   if ($('.cmd_click_room')[0].innerText == "瀾滄江南岸"){   // 找到草地
                       resYaoParas=0;
                        setTimeout(function(){clickButton('go southeast')},200) //草地
                        setTimeout(function(){clickButton('go south')},400) //下
                        setTimeout(function(){clickButton('go south')},600) //下
                        setTimeout(function(){clickButton('go east')},800) //右
                        setTimeout(function(){clickButton('go north')},1000) //上
                        setTimeout(function(){clickButton('go north')},1200) //上
                        setTimeout(function(){clickButton('go east')},1400) //沼泽
                        setTimeout(function(){clickButton('go south')},1600) //下
                        setTimeout(function(){clickButton('go east')},1800) //右
                        setTimeout(function(){clickButton('go northeast')},2000) //右上
                        setTimeout(function(){clickButton('go south')},2200) //下
                        setTimeout(function(){clickButton('go southwest')},2400) //左下
                        setTimeout(function(){clickButton('go east')},2600) //右
                        setTimeout(function(){clickButton('go east')},2800) //右
                        setTimeout(function(){clickButton('go northeast')},3000) //右上
                        setTimeout(function(){clickButton('go northeast')},3200) //上山小路
                        setTimeout(function(){clickButton('go northwest')},3400) //上山小路
                        setTimeout(function(){clickButton('go northeast')},3600) //上山小路
                        setTimeout(function(){clickButton('go northeast')},3800) //石峰
                        setTimeout(function(){clickButton('go north')},4000) //五毒山门
                        setTimeout(function(){clickButton('go north')},4200) //花园
                        setTimeout(function(){clickButton('go west')},4400) //练毒死
                        setTimeout(LianYaoIt,5900);
                    }
                    else{
                        setTimeout(MiaoJiang1Func,1000);   // 2秒后重新检查出路
                    }
                  }
                  function LianYaoIt(){
                    resYaoParas = resYaoParas+1;
                    if ( isContains($('span:contains(煉藥需要毒琥珀和毒藤膠，你還沒有)').text().slice(-17), '需要毒琥珀和毒藤膠，你還沒有藥材。'))
                    {alert('毒藤膠或毒藤膠不足，停止煉藥！');
                     console.log('沒有工具！煉藥次數：%d次。',resYaoParas);}
                    else if( isContains($('span:contains(煉藥的丹爐已經是滾得發燙)').text().slice(-6), '明天再來吧！')){
                        console.log('煉完了！煉藥次數：%d次。',resYaoParas);
                        clickButton('home');
                        bijingButton.innerText = '任意門'
                    }
                    else{
                        clickButton('lianyao');
                        setTimeout(LianYaoIt, 6000);
                        console.log($('span:contains(竟然)').text().slice(-9));}
                }
