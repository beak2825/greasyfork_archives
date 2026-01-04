// ==UserScript==
// @name         宁波干部党员学习网
// @namespace    http://nb.nbstudy.gov.cn/vm/login.jsp
// @version      1.52
// @description  自动学习
// @author       dahuilang
// @match        http://nb.nbstudy.gov.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427489/%E5%AE%81%E6%B3%A2%E5%B9%B2%E9%83%A8%E5%85%9A%E5%91%98%E5%AD%A6%E4%B9%A0%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/427489/%E5%AE%81%E6%B3%A2%E5%B9%B2%E9%83%A8%E5%85%9A%E5%91%98%E5%AD%A6%E4%B9%A0%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var pageList=['/vm/course/','/vm/class/show.jsp'] //启用脚本的页面
    var isStart = false;
    var videoLenth = 3600*10;//最长10个小时
    for(var pIndex=0;pIndex<pageList.length;pIndex++){


        if(location.pathname == pageList[pIndex]){


            isStart = true;

            break;
        }
    }

    if(isStart){
        var idList=[];

        //获取当前页所有视频的ID
        var interval = setInterval(function(){

            if(idList.length==0){
                var divList = $(".box2.class_box");
                for(var i=0;i<divList.length;i++){
                    var c = divList[i];
                    var link = $(c).attr("onclick");
                    var gid= link.split(",")[0].split("(")[1].replace(/'/g,'');
                    idList.push(gid);
                }

            }else{
                clearInterval(interval);
                playCurrentPage();
            }


        },1000);
   }else if(location.pathname == "/vm/course/play.jsp"){ //播放页面

        var smInvterval =  setInterval(function(){

           if(typeof window.thePlayer != "undefined"){



                changeVideo("http://video.cnnb.com.cn")


               clearInterval(smInvterval)
           }

       },5000)
   }


   //end isStart


    function changeVideo(vod){

	var _pns = thePlayer.getPlaylist();
	var pls = new Array(_pns.length);
	for(var i=0;i<_pns.length;i++){
		var _tt = _pns[i]['file'];
		var _ts = new Object();
		_ts["file"] = vod+"/"+_tt.substring(_tt.indexOf("_sfp"));
		pls[i] = _ts;
	}

     console.log(pls)
	thePlayer.load(pls);
	thePlayer.play();

}

    //播放当前页面未完成的视频
    function playCurrentPage(){
         query(idList,function(notCompleteId){

                 if(notCompleteId){
                    play(notCompleteId)
                 }else{
                     var url = location.href;
                     var pageNoIndex = url.indexOf("pageNo=")
                     var pageNo = 1;
                     if(pageNoIndex>=0){
                         pageNo = url.substring(pageNoIndex+"pageNo=".length)
                     }

                   location.href="http://nb.nbstudy.gov.cn/vm/course/?sid=0&pageNo="+(new Number(pageNo)+1) //翻页到下一页

                 }
             })

    }


    //获取cardid
    function getCardId(){
         var html =  document.documentElement.innerHTML
             var cardidIndex = html.indexOf("cardid=");
             if(cardidIndex>=0){
                html = html.substring(cardidIndex+"cardid=".length)
             }
             var cardid = html.split("&")[0];
        return cardid

    }


    //获取到未播放完成的视频
    function query(list,callback){

       var cardid = getCardId();

        $.ajax({
				   type: "GET",
				    url: "/in/GET-STUDY-SUM.phtml?cardid="+cardid+"&oid="+Math.random(),
				    dataType: 'json',
				   success: function(data){


                       var notCompleteId = null;

                       for(var i=0;i<list.length;i++){
                           var id = list[i];

                           var isComplete = false;
                           for(var j=0;j<data.length;j++){
                              var c = data[j];
                              if(id == c.videoId && c.ccc=="100"){ //已经完成观看
                                 isComplete = true;
                                  break;
                              }
                           }//end for

                          if(!isComplete){
                              notCompleteId = id;
                              break;
                          }
                       }//end for

                        callback(notCompleteId)


				   }
				});

    }



    //模拟播放
    function play2(videoId){



        var cardid = getCardId();

        getVideoLength(videoId)



        var p2 = 0;

        var playInterval = setInterval(function(){

              var hour = new Date().getHours();//得到小时
               if(!(hour>=8 && hour<=22)){
                 console.log(new Date(),"非工作时间退出播放")
                 return
               }

               p2 = p2+60;
               console.log(new Date(),"play:"+videoId+",p2:"+p2)
          

            if(p2==60){
                 window.open("/vm/course/play.jsp?cid="+videoId+"&sid="+getParam("classid"),"_bkc","")

            }


             if(p2 > videoLenth + 100){ //花费的时间超过了视频的总时长，则播放当前页面除了本视频之外的下一个视频

                                    for(var i=0;i<idList.length;i++){
                                       var c = idList[i]
                                        if(c == videoId){
                                            idList.splice(i, 1);
                                            break;
                                        }

                                    }

                                    clearInterval(playInterval);

                                     playCurrentPage();
               }
         

        },60000);
    }//end play


    //模拟播放
    function play(videoId){



        if(location.pathname=="/vm/class/show.jsp"){

           play2(videoId)
            return
        }

        var cardid = getCardId();

        getVideoLength(videoId)

        var p2 = 0;

        var playInterval = setInterval(function(){

              var hour = new Date().getHours();//得到小时
               if(!(hour>=8 && hour<=22)){
                 console.log(new Date(),"非工作时间退出播放")
                 return
               }

               p2 = p2+60;
               console.log(new Date(),"play:"+videoId+",p2:"+p2)
            var  url = "/in/CAL.jsp?rid=0&cardid="+cardid+"&videoId="+videoId+"&p1=0&p2="+p2;

            if(location.href.indexOf("class/show")>=0){ //班级页面

               url ="/in/CAL.jsp?rid=0&cardid="+cardid+"&videoId="+videoId+"&classid=undefined&p1=0&p2="+p2+"&"+Math.round(Math.random()*999999999);
            }





             
             $.ajax({
				   type: "GET",
				    url: url,
				    dataType: 'json',
				     success: function(data){



                           if(p2 > videoLenth){ //花费的时间超过了视频的总时长，则播放当前页面除了本视频之外的下一个视频

                                    for(var i=0;i<idList.length;i++){
                                       var c = idList[i]
                                        if(c == videoId){
                                            idList.splice(i, 1);
                                            break;
                                        }

                                    }

                                    clearInterval(playInterval);

                                     playCurrentPage();
                                }



				   }
				});



        },60000);
    }//end play

        //获取视频时长
       function getVideoLength(cid){
           if(!cid){
              return
           }
           $.ajax({
				   type: "GET",
				    url: "/vm/course/play.jsp?cid="+cid,
				    dataType: 'html',
				     success: function(data){

                         var index = data.indexOf("file:")
                         data = data.substring(index+"file:".length)
                         var url = data.split("}")[0].replace(/"/g,"")

                         var video = document.createElement('video');
                         video.setAttribute("src",url);
                         video.onloadedmetadata = function() {

                             videoLenth = video.duration;
                             console.log(new Date(),url,"second:"+videoLenth)
                         };

				   }
				});

       }//end getVideoLength






 

 function getParam(variable){

        var query = window.location.search.substring(1);
	       var vars = query.split("&");
	       for (var i=0;i<vars.length;i++) {
	               var pair = vars[i].split("=");
	               if(pair[0] == variable){
	            	   return decodeURIComponent(pair[1]);
	               }
	       }
	       return "";
	}





    
})();