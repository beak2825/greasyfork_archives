// ==UserScript==
// @name        Acfun楼层一键折叠
// @version     1.0
// @description 文章区评论楼层一件折叠
// @match       http*://www.acfun.cn/a/ac*

// @author      冲锋
// @require        http://code.jquery.com/jquery-1.6.1.min.js
// @namespace https://greasyfork.org/users/63731
// @downloadURL https://update.greasyfork.org/scripts/372371/Acfun%E6%A5%BC%E5%B1%82%E4%B8%80%E9%94%AE%E6%8A%98%E5%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/372371/Acfun%E6%A5%BC%E5%B1%82%E4%B8%80%E9%94%AE%E6%8A%98%E5%8F%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';


         //判断楼层加载成功
    var flag=setInterval(function(){
                    if($(".item-comment-quote").length!=0){

                        clearInterval(flag)


                        $(".item-comment-quote").each(function(index,e){
                            //第一层添加按钮
                           if( $(e).attr("data-qid")==0){

                               var flodButton=$("<a>点击折叠</a>")
                                flodButton.css({
                                    float:"right",

                                    color:"#f01414",
                                    marginRight:"0px"

                                });
                               var openBar=$("<span class='item-quote-hidden open-bar'>此楼已手动折叠[点击展开]</span>")

                               if($(e).parents(".item-comment:last").length!=0)
                                   $(e).find(".top").append(flodButton)
                               $(e).parents(".item-comment:last").before(openBar)
                               openBar.hide()


                               //展开折叠按钮动作
                               flodButton.click(function(){
                                    openBar.show()

                                   $(e).parents(".item-comment:last").hide()
                               })

                               openBar.click(function(){
                                   openBar.hide()

                                    $(e).parents(".item-comment:last").show()
                               })
                           }

                        })


                    }

    },
             500 )








})();