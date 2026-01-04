// ==UserScript==
// @name         智联内部在线学习平台学习进度检查器
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  一键即可检查视频进度是否完成，3.7更新课程分类，修复bug等
// @author       RoRochen
// @match        https://xuexi.zhaopin.com/*
// @supportURL   641876223@qq.com
//@icon https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2349859212,1053714951&fm=26&gp=0.jpg
//@require    https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
//@require    https://cdn.bootcss.com/vue/2.6.10/vue.js
//@require    https://cdn.bootcss.com/element-ui/2.12.0/index.js
// @downloadURL https://update.greasyfork.org/scripts/396496/%E6%99%BA%E8%81%94%E5%86%85%E9%83%A8%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E6%A3%80%E6%9F%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/396496/%E6%99%BA%E8%81%94%E5%86%85%E9%83%A8%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E6%A3%80%E6%9F%A5%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css";
    document.body.appendChild(link);
    var style = document.createElement("style");
style.type = "text/css";
var text = document.createTextNode(
    ".stage{background: #fff;padding: 5px;    margin-top: 5px;border-radius: 10px;box-shadow: 0 1px 3px 1px rgba(60,64,67,0.15), 0 1px 2px 0 rgba(60,64,67,0.3)}.suojin{margin:10px}#app::-webkit-scrollbar {width: 4px;height: 4px;}#app::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);border-radius: 0;background: rgba(0,0,0,0.1);}#app::-webkit-scrollbar-thumb { border-radius: 5px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: rgba(0,0,0,0.2);}.mu-button{  margin: 8px;vertical-align: middle;user-select:none;outline: none;-webkit-appearance: none;background-color: #2196f3;color: #fff;border-radius: 50%;z-index: 1111;border:none;text-align: center;box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);}.mu-button:active{box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 12px 17px 2px rgba(0,0,0,.14), 0 5px 22px 4px rgba(0,0,0,.12);}.mu-button:hover{box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 12px 17px 2px rgba(0,0,0,.14), 0 5px 22px 4px rgba(0,0,0,.12);}");
style.appendChild(text);
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);



    var Page_Size=10;
    var ass_Panel_Status=false;
    var assPanel=$('<div id="app" style="position:fixed;right:0;bottom:0;width:600px; padding: 10px;display: none; max-height: 600px;overflow-y: scroll;background: #407ef4;box-shadow: 2px 0 5px 0 rgba(0,21,41,.35);"><div style="display: flex;justify-content: space-between;color:#fff"><div>第<el-input-number size="mini" v-model="page"></el-input-number>页</div><el-select v-model="gradeId" placeholder="请选择课程" size="small"><el-option v-for="item in gradeList" :key="item.gradeId" :label="item.name" :value="item.gradeId"> </el-option> </el-select><div >智联辅助V3</div></div>'
                   +'<div v-for=" stage in list" class="stage" >'
                   +'<div >'
                   +'<div style="display:flex;justify-content: space-between;" ><div>阶段:{{stage["stageName"]}}</div><el-progress  :percentage="stage.stageRate*100" style="width:150px;" :color="customColorMethod"></el-progress></div>'
                   +'<div v-for="chapter in stage.chapterList" class="suojin  el-card box-card is-always-shadow" style="padding:10px;">章节：'
                   +'<div>{{chapter["chapterName"]}}</div>'
                   +'<div class="suojin" v-for="video in chapter.videoList">'
                   +'<div style="display: flex;justify-content: space-between;"><div><i class="el-icon-video-camera-solid" style="font-size: 20px;"></i>{{video["title"]}}</div><el-button size="mini" round v-on:click="viewVideo(video.itemId,video.length,video.title)" type="primary">检查</el-button></div>'
                   +'</div>'
                   +'</div>'
                   +'</div>'
                   +'</div></div>');
    var assbtn=$('<button type="button" class="mu-button" style="position:fixed;right:0;bottom:0;width: 40px;height: 40px;">辅助</button>')
    $('body').append(assbtn)
    $('body').append(assPanel)
    var vueobj=new Vue({el:'#app',data(){
        return {page:1,gradeList:[],gradeId:-1,list:[{stageId:'',stageName:'',stageRate:'',chapterList:[{chapterId:'',chapterName:'',videoList:[{itemId:'',title:'',length:''}]}]}]}
                                        },
                        methods: {
                            viewVideo(itemId,length,title){
                                $.ajax({
                                    url:"https://rest-xuexi.zhaopin.com/video/record/watch/time?itemId="+itemId+"&time="+length+"&watchTime="+length,
                                    type:"POST",
                                    headers:{'Authorization':getCookie("oxtoken")},
                                    dataType:"json",
                                    async:false,
                                    contentType:"application/json",
                                    success:function(result){
                                       var temp=vueobj.page;
                                       vueobj.page=0;
                                       vueobj.page=temp;
                                         vueobj.$notify({
                                             title: '成功',
                                             message: title+"   执行检查操作，"+result.msg,
                                             type: 'success'
                                         });
                                    }

                                });
                            },
                              customColorMethod(percentage) {
                                  if (percentage < 30) {
                                      return '#909399';
                                  } else if (percentage < 70) {
                                      return '#e6a23c';
                                  } else {
                                      return '#67c23a';
                                  }
                              },
                        },
                        watch:{
                            page:function(){
                                getVideoList(vueobj.gradeId,vueobj.page,Page_Size)
                            },
                            gradeId:function () {
                                getVideoList(vueobj.gradeId,vueobj.page,Page_Size)
                            }
                        }
                       })
    assbtn.click(function(){
      if(ass_Panel_Status){
       $('#app').css('display','none')
      }else{
            $('#app').css('display','block')
      }
        ass_Panel_Status=!ass_Panel_Status;
    });

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    var waitLogin=setInterval(getGradeList,1000)
    function getGradeList(){
        $.ajax({
            url:"https://rest-xuexi.zhaopin.com/common/grade/box",
            type:"GET",
            headers:{'Authorization':getCookie("oxtoken")},
            dataType:"json",
            async:false,
            contentType:"application/json",
            success:function(result){
                console.log("智联脚本",result)
                var isLogin=false;
                try{
                    vueobj.gradeList=result.data;
                    vueobj.gradeId=result.data[0].gradeId;
                    isLogin=true;
                }catch (e) {
                    console.log("还未登录");
                }
                if(waitLogin){clearInterval(waitLogin);console.log("登录成功")}


            }
        });
    }


    function getVideoList(gradeId,page,size){
           var data={p:page,s:size,gradeId:gradeId,courseName:""}
           $.ajax({
            url:"https://rest-xuexi.zhaopin.com/study/rate/list",
            type:"POST",
            headers:{'Authorization':getCookie("oxtoken")},
            dataType:"json",
               async:false,
            data:JSON.stringify(data),
            contentType:"application/json",
            success:function(result){
                console.log("智联脚本",result)
                vueobj.list=dealStageList(result)
            }

     });
    }
    getVideoList(vueobj.gradeId,vueobj.page,Page_Size)
    function dealStageList(data){
       var result=[];
       data.data.stageRateDetailList.list.forEach(function(item){
           var i={stageId:item.stageId,stageName:item.stageName,stageRate:item.stageRate.toFixed(2),chapterList:[]};
           item.stageChapterDetailList.forEach(function(item2){
              var chapterItem={chapterId:item2.chapterId,chapterName:item2.chapterName,videoList:[]}
              var reqData={gradeId: vueobj.gradeId, stageId: item.stageId, chapterId: item2.chapterId}  ;
               $.ajax({
                   url:"https://rest-xuexi.zhaopin.com/video/list",
                   type:"POST",
                   headers:{'Authorization':getCookie("oxtoken")},
                   dataType:"json",
                   async:false,
                   data:JSON.stringify(reqData),
                   contentType:"application/json",
                   success:function(result){
                       result.data.videos[0].items.forEach(function(item3){
                           var videoItem={itemId:item3.itemId,title:item3.title,length:item3.length}
                           chapterItem.videoList.push(videoItem)
                       })
                   }

               });
              i.chapterList.push(chapterItem)
     });
           result.push(i)
       })
        return result;
    }



})();