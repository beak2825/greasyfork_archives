// ==UserScript==
// @name         河南专技定时切换
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  河南专技课程自动切换
// @author       zzz
// @match        http://hnzj.user.ghlearning.com/learning/*
// @grant  GM_setValue
// @grant  GM_getValue
// @grant  GM_deleteValue
// @require http://code.jquery.com/jquery-1.8.2.js
// @downloadURL https://update.greasyfork.org/scripts/372347/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%AE%9A%E6%97%B6%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/372347/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%AE%9A%E6%97%B6%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //GM_deleteValue("hnzj");
    var array = [];
    var totalarray=[];
    var classid =getQueryString("myClassId");
    var mywactchlist = [];
   
     $("body").append('<div id="popDivStatus"style="z-index: 99;overflow:auto;display: block;position: absolute;margin-top: 1.3%;margin-left: 2%;width: 400px;height:30px;color:#fff;background-color:#544833;top: 20px;"></div>');
    $("body").append('<div id="popDiv"style="z-index: 99;overflow:auto;display: block;position: absolute;margin-top: 3%;margin-left: 2%;width: 400px;height:300px;color:#fff;background-color:rgba(220,38,38,0.2);top: 20px;"></div>');
    $(function(){


        var totalsize = $(".tab-content li").length;


     $("li[data-container='body']").each(function(index,element){
         $(this).find(".course-period").prepend('<input type="checkbox" name="zjcheckbox" class="zjcheckboxcls">');
     });
         initdata();


        if(typeof(totalsize)!="undefined"&&totalsize>0){
            flip();
        }
    


    $(document).on("click",".zjcheckboxcls",function(event){
      var check =   $(this).prop('checked');
         var id = $(this).parents("li").attr("data-original-title");
        if(check){
           if($.inArray(id,mywactchlist)==-1){
                mywactchlist.push(id);
           }
           
        }else{
            mywactchlist.splice($.inArray(id,mywactchlist),1);
        }
        syncdata()
    })

})

        function syncdata(){
       var data = GM_getValue("hnzj","{}");
        if(""!=data){
          data = JSON.parse(data)
        }else{
          data = {};
        }
        data[classid]=mywactchlist;
        GM_setValue("hnzj",JSON.stringify(data));
        getdata();
    }

        function initdata(){
       var data = GM_getValue("hnzj","{}");
        if(""!=data){
          data = JSON.parse(data)
        }else{
          data = {};
        }

          if(data.hasOwnProperty(classid)){
             mywactchlist = data[classid];
          }

          getdata();

    }

     function flip(){
        var timeout=10000;
        timelog("下次执行时间："+(timeout/1000)+"秒");
        setTimeout(function timeoutFun(){
            getdata();
            if(array.length<=0){
                return;
            }
            var len = ran(array.length);
            var id = array[len];
            var title = $("#"+id).attr("data-original-title");
            timeout=rannum();
            timelog("切换："+title);
            timelog("下次执行时间："+(timeout/1000/60)+"分钟后");
            timelog("剩余视频："+array.length+"个");
            $("#"+id).trigger("click");
            setTimeout(timeoutFun,timeout);
        },timeout);
    }

     function timelog(msg){

        var today=new Date()
        var h=today.getHours()
        var m=today.getMinutes()
        var s=today.getSeconds()
        var time = h+":"+m+":"+s;
        var div = document.getElementById('popDiv');
        $("#popDiv").append(time+"===="+msg+"<br>");
        var elem = $("#popDiv")[0];
        console.log(elem.scrollTop);
        console.log(elem.scrollHeight);
        $("#popDiv")[0].scrollTop = $("#popDiv")[0].scrollHeight;
        console.log(time+"===="+msg);

    }

     function getdata(){
          var  xueshi=0;
          array = [];
         for(var i in mywactchlist){
               var id = mywactchlist[i];
              var tid = $("li[data-original-title='"+id+"']").attr("id");
             var text =  $("#"+tid).find(".course-period").text();

              $("#"+tid).find(".course-period input").prop("checked",true);
             xueshi+=parseInt(text);
             $("#"+tid+"-videos").find("li").each(function(){
                var videoid =  $(this).attr("id");
                 var barge = parseInt($("#"+videoid+"-badge").text());
                 totalarray.push(videoid);
                 if(barge<100){
                     array.push(videoid);
                 }
             })
         }

        $("#popDivStatus").text("已选择"+mywactchlist.length+"章，共"+totalarray.length+"个视频,"+xueshi+"学时");
    }

      function rannum(){
        var x = 12;
        var y = 5;
        var rand = parseInt(Math.random() * (x - y + 1) + y);
        rand = rand*1000*60;
        return rand;
    }

    function ran(len){
        return parseInt(Math.random()*len+1);
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");

        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
     }
    // Your code here...

})();