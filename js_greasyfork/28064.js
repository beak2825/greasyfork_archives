// ==UserScript==
// @name         起点自动领经验
// @namespace    https://greasyfork.org/zh-CN/scripts/28064-%E8%B5%B7%E7%82%B9%E8%87%AA%E5%8A%A8%E9%A2%86%E7%BB%8F%E9%AA%8C
// @version      3.3
// @description  自动领取起点经验，过0点自动刷新。
// @author       菠菜
// @match        *://my.qidian.com/level*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.js
// @downloadURL https://update.greasyfork.org/scripts/28064/%E8%B5%B7%E7%82%B9%E8%87%AA%E5%8A%A8%E9%A2%86%E7%BB%8F%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/28064/%E8%B5%B7%E7%82%B9%E8%87%AA%E5%8A%A8%E9%A2%86%E7%BB%8F%E9%AA%8C.meta.js
// ==/UserScript==


(function() {
    'use strict';
    jQuery(function($) {
        var jishu=0;
        var jiancha=1;
        $(document).ready(
            function checktime(){
                var jinxing=$(".ui-button-small").text();
                //console.log("jiancha="+jiancha);
                //console.log("jinxing="+jinxing);

                if ($('.elGetExp')&&$('.elGetExp').length)
                {
                    //console.log("chlick");
                    $(".elGetExp").each(function(){
                        this.click(); 
                    });
                }
                else
                {

                    ( function (){
                        var newtime=new Date();
                        newtime.setFullYear(2020,1,1);
                        var settime = new Date(2020,1,1,0,0,5);
                        if (newtime<settime)
                        {
                            setTimeout(function(){
                                location.reload(true);
                            },6000);
                        }
                        else
                        {

                        }
                    }
                    )();

                    if($('.ui-button-small')&&$('.ui-button-small').length)
                    {
                        if (jishu==10)
                        {
                            if(jiancha==jinxing)
                            {
                                location.reload(true);
                            }
                            else
                            {
                                jishu=0;
                                jiancha=jinxing;
                            }
                        }
                        else
                        {
                            jishu+=1;
                            //console.log("jishu="+jishu);  //计数提示
                        }

                    }

                }
                setTimeout(checktime,1000);
            }
        );
    })();
})();