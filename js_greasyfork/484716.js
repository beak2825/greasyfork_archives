// ==UserScript==
// @name         客户展示数据4.1
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  try to take over the world!
// @author       You
// @match        https://ads.google.com/aw/accounts?*
// @require      https://cdn.bootcss.com/jquery/1.11.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/484716/%E5%AE%A2%E6%88%B7%E5%B1%95%E7%A4%BA%E6%95%B0%E6%8D%AE41.user.js
// @updateURL https://update.greasyfork.org/scripts/484716/%E5%AE%A2%E6%88%B7%E5%B1%95%E7%A4%BA%E6%95%B0%E6%8D%AE41.meta.js
// ==/UserScript==

(function() {
    'use strict';
//     var jq = document.createElement('script');
//     jq.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js';
//     document.getElementsByTagName('head')[0].appendChild(jq);
    // Your code here...

    var settime=setInterval(function(){
        if($(".data-numeric").length>40){
            clearInterval(settime)
            //显示修改的数
            GM_getValue("qqqq")?1:GM_setValue("qqqq",[]);
            console.log('--------', GM_getValue("qqqq"))
            var xiugai=GM_getValue("qqqq")
            if(xiugai.length>0){
                console.log(xiugai)
            for(var i=0;i<xiugai.length;i++){
                $(".particle-table-row").eq(xiugai[i][0]).find('.data-numeric').eq(xiugai[i][1]).text(xiugai[i][2])
                console.log(i)
            }
            }



            var shuzu=GM_getValue("qqqq")
            $(".data-numeric").click(function(){console.log(`这是第`,$(this).index(),'列    ',$(this).parents('.particle-table-row').index(),'行    ')
                                                var p=prompt("请老板输入需要改成的内容")
                                                $(".particle-table-row").eq($(this).parents('.particle-table-row').index()-1).find('.data-numeric').eq($(this).index()-2).text(p)
                                                shuzu.push([$(this).parents('.particle-table-row').index()-1,$(this).index()-2,p])
                                                console.log(shuzu)
                                               })

            //保存方法
            $(".app-bar-left").click(function(){alert('保存成功')

                                                GM_setValue("qqqq",shuzu);
                                                console.log(GM_getValue("qqqq"));
                                               })

            //删除成功
            $(".account-ids").click(function(){alert('删除成功')

                                                GM_setValue("qqqq",[]);
                                                console.log(GM_getValue("qqqq"));
                                               })

        }
        console.log(88)



    $(".icon-refresh").click(function(){
//////////
        console.log('点击了刷新')
          var settime1=setInterval(function(){
        if($(".data-numeric").length>40){
            console.log('$(".data-numeric").length',$(".data-numeric").length)
            clearInterval(settime1)
            //显示修改的数
            var xiugai=GM_getValue("qqqq")
            if(xiugai.length>0){
                console.log(xiugai)
            for(var i=0;i<xiugai.length;i++){
                $(".particle-table-row").eq(xiugai[i][0]).find('.data-numeric').eq(xiugai[i][1]).text(xiugai[i][2])
                console.log(i)
            }
            }



            var shuzu=[]
            $(".data-numeric").click(function(){console.log(`这是第`,$(this).index(),'列    ',$(this).parents('.particle-table-row').index(),'行    ')
                                                var p=prompt("请老板输入需要改成的内容")
                                                $(".particle-table-row").eq($(this).parents('.particle-table-row').index()-1).find('.data-numeric').eq($(this).index()-2).text(p)
                                                shuzu.push([$(this).parents('.particle-table-row').index()-1,$(this).index()-2,p])
                                                console.log(shuzu)
                                               })


        }
        console.log(88)

    },100)
//////////
    })
    },100)

    })();