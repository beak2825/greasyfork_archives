// ==UserScript==
// @name        浙江省高校平台刷课new
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动播放，自定义倍速播放（需脚本内设置，有说明），使用时需要刷新一次页面
// @author       时光9870
// @author       时光9870
// @include        https://www.zjooc.cn/ucenter/student/course/study/*/plan/detail/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414208/%E6%B5%99%E6%B1%9F%E7%9C%81%E9%AB%98%E6%A0%A1%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BEnew.user.js
// @updateURL https://update.greasyfork.org/scripts/414208/%E6%B5%99%E6%B1%9F%E7%9C%81%E9%AB%98%E6%A0%A1%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BEnew.meta.js
// ==/UserScript==
$(function()
{
       var vediospeed=1;//自定义播放速度（0.5-16倍速）
       var menuindex=0;
      var  labelindex=0;
    setTimeout(() => {
                               function alertdiv(){
                                                   var textNode =$("<span>提示：开始刷课了，请稍等一会儿。。</span>");
                                                   var alertdiv=$('<div id="in" style="width: 250px;height: 50px;display:flex;background:green;z-index:2000; position: absolute; top:0px;margin:0 auto; border-radius:30px;"></div>');
                                                   var top=($(window).height()-alertdiv.height())/2;

                                         var left=($(window).width()-alertdiv.width())/2;
                                        alertdiv.css('left',left);
                                         textNode.css('margin',"auto");
                                         window.onresize=function(){
                                                                  var left=($(window).width()-alertdiv.width())/2;
                                                                     alertdiv.css('left',left);
                                                                    };

                                                    $('body').append(alertdiv);
                                                    alertdiv.append(textNode);
                                                    alertdiv.hide();
                                                    alertdiv.fadeIn(3000);
                                                    alertdiv.fadeOut(5000);
                                                    }

                                alertdiv();
                             var menu=$("span","ul[role='menu']");
                             var label=$("span","span.label");
                              var lisel=document.querySelector('#app > div > section > section > header > ul > li:nth-child(2)');
                                   console.log(lisel.innerHTML)
                              var   menusize=menu.toArray().length;
                               var   labelsize=label.toArray().length;
                                 //alert("menusize:"+menusize+ "labelsize:"+labelsize)
                         var divselect=$('div[aria-selected="true"]:has(span)');
                          var spansel=$('span:not([class="label"])',divselect);
                             for(var i=0;i<labelsize;i++)
                             {
                             if(label[i].innerHTML==spansel[0].innerHTML)
                             {
                                 labelindex=i;
                              console.log(labelindex);
                             }
                             }
             for(var j=0;j<menusize;j++){
                             if(menu[j].innerHTML==lisel.innerHTML)
                             {
                                 menuindex=j;
                                 console.log(menuindex)
                              }
                             }
                       var elevideo =$('video')[0];
                       if($('video')[0])
                                                                                {
                                                                             setTimeout(function(){
                                                                                                $('video')[0].play();
                                                                                               }, 5000);
                                                                                  }
        setInterval(
         function()
                                                                        {
                                                                      var labelnow=$("span","span.label");
                                                                               if(labelsize !==labelnow.toArray().length){
                                                                                   label=labelnow;
                                                                                   labelsize=labelnow.toArray().length;
                                                                               }
                                                                        }
                   ,500);
setInterval(
    function()
    {
        if($('video')[0])
        {

                                                                             setTimeout(function(){
                                                                                                $('video')[0].play();
                                                                                               }, 1000);
         $('video').attr({controls:""});//显示控件
                       $('video')[0].onended=function(){
                                                           // alert("播放结束");
                                                         if(labelindex<labelsize-1)
                                                                          {
                                                                              labelindex++;
                                                                           label[labelindex].click();
                                                                          }

                                                                            else
                                                                           {
                                                                               menuindex++;
                                                                           menu[menuindex].click();
                                                                               labelindex=0;
                                                                           }
                                                               };












                       setInterval(function(){
                                                                            if(document.querySelector("video"))
                                                                            {                   if( document.querySelector("video").playbackRate!==vediospeed)
                                                                                                   {
                                                                                                                      document.querySelector("video").playbackRate=vediospeed;
                                                                                                    }
                                                                            }
                                             },1000)
           }
         else
         {
         var btn=$("button","div.contain-bottom").filter(function(){return this.innerHTML.match(/完成学习/)});
            // alert(btn[0].innerHTML)
             if(btn[0])
             {
                if( elevideo)
                {
                   elevideo.pause();
                    elevideo=null;
                }
                    btn.click();
                 setTimeout(function () {}, 1000);
           if(labelindex<labelsize-1)
                                                                          {
                                                                              labelindex++;
                                                                              console.log("btn labelindex++")
                                                                              console.log(menuindex+":"+labelindex)
                                                                           label[labelindex].click();

                                                                          }

                                                                            else
                                                                           {
                                                                               menuindex++;
                                                                                labelindex=0;
                                                                               console.log(menuindex+":"+labelindex)
                                                                               console.log("btn menuindex++")
                                                                           menu[menuindex].click();
                                                                           }
             }
        }

    },5000)








                           }, 5000);

}
 )