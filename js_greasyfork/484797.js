// ==UserScript==
// @name         广告系列
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  qq806350554
// @author       qq806350554
// @match        https://ads.google.com/aw/campaigns?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @require      https://cdn.bootcss.com/jquery/1.11.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/484797/%E5%B9%BF%E5%91%8A%E7%B3%BB%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/484797/%E5%B9%BF%E5%91%8A%E7%B3%BB%E5%88%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jq = document.createElement('script');
    jq.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js';
    document.getElementsByTagName('head')[0].appendChild(jq);
    // Your code here...
       var settime=setInterval(function(){
        if($(".data-numeric").length>40){
            clearInterval(settime)
            //显示修改的数
            GM_getValue("pppp")?1:GM_setValue("pppp",[]);
            console.log('--------', GM_getValue("pppp"))
            var xiugai=GM_getValue("pppp")
            if(xiugai.length>0){
                console.log(xiugai)
            for(var i=0;i<xiugai.length;i++){
                $(".particle-table-row").eq(xiugai[i][0]).find('.data-numeric').eq(xiugai[i][1]).text(xiugai[i][2])
                console.log(i)
            }
            }



            var shuzu=GM_getValue("pppp")
            $(".data-numeric").click(function(){console.log(`这是第`,$(this).index(),'列    ',$(this).parents('.particle-table-row').index(),'行    ')
                                                var p=prompt("请老板输入需要改成的内容")
                                                $(".particle-table-row").eq($(this).parents('.particle-table-row').index()-1).find('.data-numeric').eq($(this).index()-2).text(p)
                                                shuzu.push([$(this).parents('.particle-table-row').index()-1,$(this).index()-2,p])
                                                console.log(shuzu)
                                               })

            //保存方法
            $(".app-bar-left").click(function(){alert('保存成功')

                                                GM_setValue("pppp",shuzu);
                                                console.log(GM_getValue("pppp"));
                                               })

            //删除成功
            $(".account-ids").click(function(){alert('删除成功')

                                                GM_setValue("pppp",[]);
                                                console.log(GM_getValue("pppp"));
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
            var xiugai=GM_getValue("pppp")
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