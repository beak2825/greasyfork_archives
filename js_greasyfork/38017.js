// ==UserScript==
// @name         查看NASA高清图助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  nasa每次查看大图返回都要重新点击,很是不方便,而且查看的也不是高清图,研究了一番,你懂的!,注意仅针对Earth分类下的images栏目,每10秒更新检查一次URL,请稍等
// @author       benty
// @match        https://www.nasa.gov/topics/earth/images/index.html
// @require      https://cdn.bootcss.com/jquery/1.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38017/%E6%9F%A5%E7%9C%8BNASA%E9%AB%98%E6%B8%85%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/38017/%E6%9F%A5%E7%9C%8BNASA%E9%AB%98%E6%B8%85%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
    var $j = jQuery.noConflict();
        function imgupdate(){
            //alert(22);
            setTimeout(function(){
             if($j("div.ember-view.gallery-card a.benty").length!=$j("div.ember-view.gallery-card div.image img").length){

              for(var i=0;i<$j("div.ember-view.gallery-card div.image img").length;i++){
                if($j("div.ember-view.gallery-card a.benty").eq(i).length==0){
              var imgurl="https://www.nasa.gov/sites/default/files/thumbnails/image/";//获取高清大图目录
              var bigimgurl="https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/";//获取模糊大图快速打开
              var imgname=$j("div.ember-view.gallery-card div.image img").eq(i).attr("src");//获取缩略图名字
              //alert(imgname);return false;
              imgname=imgname.match(/\/image\/(.*)$/)[1];
              imgurl+=imgname;
              bigimgurl+=imgname;
              //alert(imgurl);//已经获得url了
              //开始处理插入超链接
              $j("div.ember-view.gallery-card div.img-wrapper").eq(i).append("<a class='benty' href='"+imgurl+"' target='_blank'>高清图(慢)</a>&nbsp;&nbsp;<a class='benty1' href='"+bigimgurl+"' target='_blank'>普通大图(快)</a>");
              $j("div.img-wrapper").eq(i).css("height","20vw");
        }//子句if判断是否存在benty,存在不操作
                  }

                                                                    }
                imgupdate();//在for循环之后
            },10000);//这里是settime括号

                         }
        /*
        //绑定更多图片进行刷新
        $j("#trending").on("click",function(){
             setTimeout(function(){
            //imgupdate();
             },2000);
        });*/
        imgupdate();
    // Your code here...
        },3000);
})();