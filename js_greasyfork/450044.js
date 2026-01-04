// ==UserScript==
// @name         大卡钉钉学习加速！填写答案！变全屏！速刷钉钉100，计时器掌控者替代，firefox和暴力猴偶尔不能用，推荐微软Edge或Chrome 360 QQ等！建议Tamper猴插件。
// @namespace    JuanJuanWang
// @version      0.69
// @description  大卡钉钉学习每年一次刷刷   70  10   10    10
// @author       JuanJuanWang

// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://greasyfork.org/scripts/449512-xtiper/code/Xtiper.js?version=1081249
// @require      https://greasyfork.org/scripts/451121-sbjcti/code/sbjcti.js?version=1095395
// @match        https://im.dingtalk.com/*
// @match        https://dinglearning.cn/*
// @icon         data:image/gif;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450044/%E5%A4%A7%E5%8D%A1%E9%92%89%E9%92%89%E5%AD%A6%E4%B9%A0%E5%8A%A0%E9%80%9F%EF%BC%81%E5%A1%AB%E5%86%99%E7%AD%94%E6%A1%88%EF%BC%81%E5%8F%98%E5%85%A8%E5%B1%8F%EF%BC%81%E9%80%9F%E5%88%B7%E9%92%89%E9%92%89100%EF%BC%8C%E8%AE%A1%E6%97%B6%E5%99%A8%E6%8E%8C%E6%8E%A7%E8%80%85%E6%9B%BF%E4%BB%A3%EF%BC%8Cfirefox%E5%92%8C%E6%9A%B4%E5%8A%9B%E7%8C%B4%E5%81%B6%E5%B0%94%E4%B8%8D%E8%83%BD%E7%94%A8%EF%BC%8C%E6%8E%A8%E8%8D%90%E5%BE%AE%E8%BD%AFEdge%E6%88%96Chrome%20360%20QQ%E7%AD%89%EF%BC%81%E5%BB%BA%E8%AE%AETamper%E7%8C%B4%E6%8F%92%E4%BB%B6%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/450044/%E5%A4%A7%E5%8D%A1%E9%92%89%E9%92%89%E5%AD%A6%E4%B9%A0%E5%8A%A0%E9%80%9F%EF%BC%81%E5%A1%AB%E5%86%99%E7%AD%94%E6%A1%88%EF%BC%81%E5%8F%98%E5%85%A8%E5%B1%8F%EF%BC%81%E9%80%9F%E5%88%B7%E9%92%89%E9%92%89100%EF%BC%8C%E8%AE%A1%E6%97%B6%E5%99%A8%E6%8E%8C%E6%8E%A7%E8%80%85%E6%9B%BF%E4%BB%A3%EF%BC%8Cfirefox%E5%92%8C%E6%9A%B4%E5%8A%9B%E7%8C%B4%E5%81%B6%E5%B0%94%E4%B8%8D%E8%83%BD%E7%94%A8%EF%BC%8C%E6%8E%A8%E8%8D%90%E5%BE%AE%E8%BD%AFEdge%E6%88%96Chrome%20360%20QQ%E7%AD%89%EF%BC%81%E5%BB%BA%E8%AE%AETamper%E7%8C%B4%E6%8F%92%E4%BB%B6%E3%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';


var newexam = () => {

    if ( window.location.href.includes("exam/start?examId")&&!window.location.href.includes("from=course") )
    {
        //console.log("new");
        let User={};
        User.Auth=sessionStorage['Authorization'] ;
        let cou=1;
        let thisurl=window.location.href;
        let examid=thisurl.substring( thisurl.indexOf("examId=")+7,thisurl.indexOf("examId=")+7+36);


        let examstarturl="https://dinglearning.cn/NewSoke/exam/home/v1/exam/start?examId="+examid+"&type=normal&start_time="+(new Date().getTime()/1000)+"&utcoffset=-28800&lang=zh";
        AjaxGet(examstarturl,User.Auth).then(
            function(data){
                let ques={};
                let answer=[];

                for(let  que in  data.data.items)
                {
                 ques=data.data.items[que];
                 if (sbjctiku[que]!=null)
                 {
                 answer=sbjctiku[que].answer;




                 
                 }
                 for(let b in  answer)
                 {

                  if ( ques.type!="determine")
                  {
                    // $(".question-"+ques.display).find(".cho")[answer[b]].click();
                  }
                  else
                  {
                     // $(".question-"+ques.display).find(".cho")[ Math.abs( answer[b]-1 )].click();
                  }
                 }
                 $('.question-'+ques.display).find('i').html(sbjctiku[que].show_answer);
                 $('.question-'+ques.display).find('i').css('color','red');

                 cou++;
                 }

                }

            );


    }//first ifend
}
setInterval(newexam, 10000);



var func = () => {
  if((!window.location.href.includes("pcHome/dist/home/")&& document.getElementById("wdjfwdjf")!=null))
 {
  document.getElementById("wdjfwdjf").remove();

 }
  if ( window.location.href.includes("pcHome/dist/home/")&&document.getElementById("wdjfwdjf")==null)
  {
    $('.nav-wrap-main').append("<a  id='wdjfwdjf' href='/pcHome/dist/mine/personalCenter/myCertificate'>!!听说有人找不到 <我的证书>，《我的证书》我 的 证 书  o(╥﹏╥)o哎点这里吧!!</a>");
  }
 if((!window.location.href.includes("VideoPlay")&& document.getElementById("ifrm")!=null))
 {
  document.getElementById("ifrm").remove();

 }
 if ( window.location.href.includes("VideoPlay")&&document.getElementById("ifrm")==null)
{
 let ifrm = document.createElement("button");
ifrm.innerText="点这里！！！！！！！！！！！！！！前进四！！！！！！！！！！！！！！！加速！！！！！！！！！！！！！！";
ifrm.id="ifrm";
 ifrm.style.width = "340px";
 ifrm.style.height = "100px";
    ifrm.style.position="absolute";
    ifrm.style.zIndex=9999;
    ifrm.style.backgroundColor="pink";

   ifrm.onclick=function(){
    //code

      let pl=document.getElementById('my-player');
       pl.player.off("pause");
  pl.player.off("timeupdate")

  pl.player.on("pause", (function() {
                                                //console.log("videox");
                                               pl.player.currentTime(pl.player.duration()-5);
                                            }
                                            ))
pl.player.play();
pl.player.pause() ;
  pl.player.play();
}

document.body.append(ifrm);}}

setInterval(func, 1000);


var funcanswer = () => {

  if((!window.location.href.includes("exam/start")&& document.getElementById("ifrmexam")!=null)&&window.location.href.includes("from=course"))
 {
  document.getElementById("ifrmexam").remove();

 }

    if ( window.location.href.includes("exam/start")&&document.getElementById("ifrmexam")==null&&window.location.href.includes("from=course"))
{
 let ifrmexam = document.createElement("button");
ifrmexam.innerText="点这里获取答案,见证奇迹的时刻";
ifrmexam.id="ifrmexam";
 ifrmexam.style.width = "340px";
 ifrmexam.style.height = "100px";
    ifrmexam.style.top="300px";
    ifrmexam.style.position="absolute";
    ifrmexam.style.fontSize="larger"
    ifrmexam.style.zIndex=9999;
    ifrmexam.style.backgroundColor="green";
     ifrmexam.onclick=function(){
         ifrmexam.innerText="正在获取其他同学共享的答案，稍等。。。。。。，别重复点击！";
     let User={};
     let temp1={};
User.lessonlist=[];
User.Auth=sessionStorage['Authorization'] ;
let thisurl=window.location.href;
let examid=thisurl.substring( thisurl.indexOf("examId=")+7,thisurl.indexOf("examId=")+7+36)
let courseid=thisurl.substring( thisurl.indexOf("courseId=")+9,thisurl.indexOf("courseId=")+9+36)
let lessonid=thisurl.substring( thisurl.indexOf("lessonId=")+9,thisurl.indexOf("lessonId=")+9+36)

let answerstr="";
  var getExamDetailurl="https://dinglearning.cn/NewSoke/exam/home/v1/courseExam/detail?lang=en&utcoffset=-28800&examId="+examid+"&from=course";
  var getExamStarturl="https://dinglearning.cn/NewSoke/exam/home/v1/courseExam/start?lang=en&utcoffset=-28800&examId="+examid+"&course_id="+courseid+"&lesson_id="+lessonid;


AjaxGet(getExamDetailurl,User.Auth).then(
  function(data){return AjaxGet(getExamStarturl,User.Auth)  	 }) .then(
  function(data){
	 var resultId=data.data.resultId;
	 var getresultdetail="https://dinglearning.cn/NewSoke/exam/home/v1/courseExam/resultDetail?lang=en&utcoffset=-28800&resultId="+resultId+"&type=normal&lesson_id="+lessonid+"&course_id="+courseid;
      return AjaxGet(getresultdetail,User.Auth) ;
 }).then(
 function(data){
    temp1= data.data.items;
   let testitem= data.data.items;
	   let temptestitem=[];
     for ( let a in testitem)
	   {  temptestitem[testitem[a].display-1]=testitem[a];
        }
		//console.log(temptestitem);
		for(let a of temptestitem)
		{   let corr=[];
			  corr["A"]="√";
			  corr["B"]="×";
			if (a.type=="determine")
            {
			// console.log("   "+a.display+". "+corr[a.show_answer]);
                answerstr=answerstr+"  "+a.display+"."+corr[a.show_answer]+" ";
            }
			else
            {answerstr=answerstr+"  "+a.display+"."+a.show_answer+" ";
			// console.log("    "+a.display+". "+a.show_answer);
            }

		}
         setTimeout(()=>{
                         ifrmexam.innerText=answerstr;
                         //  $(".nav_all").text(answerstr);
                         // xtip.alert(answerstr, {icon: 'a', shade: false,title:'这功能有啥用？发给同事吗？',btn:'这功能多余啊'});
                         //console.log(temp1);
                          for ( let a in temp1 ){
                             // console.log(temp1[a].display)
                             //console.log(temp1[a].answer)
                               if ($(".question-"+temp1[a].display).find(".cho.active").length>0)
                                       {$(".question-"+temp1[a].display).find(".cho.active").click();
                                       }
                              for(let b in temp1[a].answer)
                                 {
                                  // console.log(temp1[a].answer[b]);
                                  // console.log(temp1[a].type);
                                  if ( temp1[a].type!="determine")
                                  {
                                     $(".question-"+temp1[a].display).find(".cho")[temp1[a].answer[b]].click();
                                  }
                                   else
                                     $(".question-"+temp1[a].display).find(".cho")[ Math.abs( temp1[a].answer[b]-1 )].click();
                    }

  }






                       } ,4000);

                       setTimeout(()=>{$(".submit_btn").click();
                        } ,5000);

        } )//promise结束

          xtip.msg('正在获取其他同学共享的答案，稍等。。。。。。，别重复点击！', {icon: 's',times: 4});




     }//按钮点击结束

    document.body.append(ifrmexam);

}

}
setInterval(funcanswer, 1000);



//console.log("天行健，君子以自强不息！！！")
function AjaxGet(url,auth)
{
let promise = new Promise(function(resolve, reject) {
    $.ajax({
				type: "GET",
                url: url,
				beforeSend: function(xhr) {
			       	xhr.setRequestHeader("Authorization", auth);
			   	},
				success: function(result){
					// console.log(result);
					 resolve(result);


		    	}
			});

});
return promise;
}



setTimeout(()=>ChkLogin(),3000);

function ChkLogin(){
   if (window.location.href.includes("im.dingtalk.com")&& document.getElementById("qrcode-login")==null)
    {    //console.log("login");
        setTimeout(()=>{

        $('#layout-main').css( "flex", "0 1 100%" );
        $('#layout-main').width('100%' ) ;
        $('#body').height ('100%' ) ;
       xtip.msg('欢迎使用大卡钉钉插件，希望能让大家刷的愉快一点，同时给绿色节能减排做出贡献 ', {icon: 's',times: 10});
        xtip.msg('新增加测试功能，慢慢安全刷模拟手工刷科自动换课！点培训页头像下面我的证书开启 ', {icon: 's',times: 20});
        xtip.alert('2022年9月5日：新增目标学分功能。2022年9月3日：由于谷歌和edge浏览器更新，导致视频无法播放（非插件原因），建议使用firefox浏览器。2022年9月2日新增加测试功能，慢慢安全刷模式，完全模拟手工刷课，自动换课答题！点海培训页右上角头像下菜单里选“我的证书”开启测试', {icon: 'h', times: 30, title: '好消息，更新了！', btn: '知道了', shade: false});
        xtip.alert('2022年10月2日，听到反馈，插件不能用了，系统专门升级屏蔽了！收到这个消息，我首先是感到难过，我的同行掌握代码，只要手头稍微善意抬高一厘米，大家都过得去就行了。可是。。。。，对不起，目前插件不能用了，能不能恢复很难说，只能试一试，在这短暂的时间里谢谢大家的使用，谢谢！祝大家一切顺利', {icon: 'h', times: 888, title: '这一天还是到来了。', btn: '知道了', shade: false});

       xtip.msg('阿里工程师老壳有包，钉钉网页版搞得只有屏幕四分之一，还是全屏好！', {icon: 'h', type: 'b',pos: 't',times: 30});
       xtip.msg('本插件免费，但有使用门槛，请帮助身边有需要同事，能力越大责任越大！谢谢！！', {icon: 's', type: 'b',pos: 'b',times: 10000});

        },2000);

         setTimeout(()=>{
        xtip.danmu('各位慢一点，太快了有风险，一天刷一点比较逼真！', {light: true, type: 'b', icon: 'w'});
        xtip.danmu('正在开发慢慢安全挂功能，不加速，自动一课一课慢慢学！', {icon: 'h'});
         xtip.danmu(' 七月半刚过就开始催完成全部学时学分，催催催，服了，怎么现在不发过12月的工资呢？？？', {icon: 'h'});
         xtip.danmu('大家冲啊！！！！！！！！', {light: true, type: 'b', icon: 'w'});},10000);


    }
   else
    {   //console.log("not login");
        setTimeout(()=>ChkLogin(),5000);
    }
}


var funcman = () => {

 if((!window.location.href.includes("personalCenter/myCertificate")&& document.getElementById("ifrmman")!=null))
 {
  document.getElementById("ifrmman").remove();

 }
 if ( window.location.href.includes("personalCenter/myCertificate")&&document.getElementById("ifrmman")==null)
{
 let ifrm = document.createElement("button");
ifrm.innerText="安全挂机，一门一门慢慢自动打开，自动下一课，就是比较费电 ";
ifrm.id="ifrmman";
 ifrm.style.width = "340px";
 ifrm.style.height = "100px";
     ifrm.style.top="120px";
    ifrm.style.position="absolute";
    ifrm.style.zIndex=9999;
    ifrm.style.backgroundColor="yellow";

   ifrm.onclick=function(){
    //code.
       this.style.display = "none";
       xtip.msg('欢迎使用安全慢慢刷功能（测试版） ！，把时间和电浪费够。系统计算中，请保持在这个我的证书界面别走', {icon: 's',times: 25});
       let User={};
       User.Auth=sessionStorage['Authorization'] ;
       let allxfbz={ "xi":70,"zz":10,"fl":10,"yw":10};
       function getcatelessonlist(cateid ,cate,seletype)
       {   let thiscourselist=[];
           let allselurl="https://dinglearning.cn/NewSoke/haiguan/home/v1/course?page=1&limit=1336&keyword=&type="+seletype+"&time=&utcoffset=-28800&lang=zh&category_id="+cateid;

        AjaxGet(allselurl,User.Auth).then(function(data){
            User.CourseList=User.CourseList.concat(data.data.list);
            thiscourselist=data.data.list;

        }).then( ()=>
                {
            //清空

            for( let i of thiscourselist ){

                AjaxGet("https://dinglearning.cn//NewSoke/course/home/v1/courseLesson?lang=en&utcoffset=-28800&course_id="+i.uuid,User.Auth).then(function(data){



                    for(let j of data.data.list)
                    {   j.cinfo=data.data.courseInfo;
                        j.cate=cate;
                        j.seletype=seletype;
                        j.xf=data.data.courseInfo.credit/10;
                        j.xs=data.data.courseInfo.point;
                        j.total_length=data.data.courseInfo.total_length;
                    }
                    User.LessenList =User.LessenList.concat(data.data.list) ;
                    i.LessenList=data.data.list;
                });

            }

        })
       }
       function getallcatetypelessonlist()
       {
           User.CourseList=[];
           User.LessenList=[];
           getcatelessonlist("A97D28FE-30AB-4A3C-B7CB-46D6B46A27CD","fl","notOptional");
           getcatelessonlist("A97D28FE-30AB-4A3C-B7CB-46D6B46A27CD","fl","learning");
           getcatelessonlist("8BAB219F-3F08-455B-B145-B6C29654E1E8","yw","notOptional");
           getcatelessonlist("8BAB219F-3F08-455B-B145-B6C29654E1E8","yw","learning");
           getcatelessonlist("F14E9853-B91F-43B4-AC46-59DD983B4EEE","xi","notOptional");
           getcatelessonlist("F14E9853-B91F-43B4-AC46-59DD983B4EEE","xi","learning");
           getcatelessonlist("0BAF5B41-AA74-4E0C-998F-63D24ED139E8","zz","notOptional");
           getcatelessonlist("0BAF5B41-AA74-4E0C-998F-63D24ED139E8","zz","learning");


           $.ajax({
               type: "GET",
               url: "https://dinglearning.cn/NewSoke/haiguan/home/v1/CreditLogMeta?lang=en&utcoffset=-28800&page=1&limit=1&keyword=&start_time=&end_time=",
               beforeSend: function(xhr) {
                   xhr.setRequestHeader("Authorization", User.Auth);
               },
               success: function(result){

                   User.xi=result.data.credits1;
                   User.zz=result.data.credits2;
                   User.yw=result.data.credits3;
                   User.fl=result.data.credits4;
                   allxfbz.xi=Math.max(allxfbz.xi-User.xi,0);
                   allxfbz.zz=Math.max(allxfbz.zz-User.zz,0);
                   allxfbz.yw=Math.max(allxfbz.yw-User.yw,0);
                   allxfbz.fl=Math.max(allxfbz.fl-User.fl,0);

               }
           });

       }
       getallcatetypelessonlist();

       //setTimeout(()=>studyxflesson(),25000);
       setTimeout(()=>{document.querySelector(".search > input:nth-child(1)").value=JSON.stringify(allxfbz);
                       xtip.msg("习，政治，执法，业务未完成学分分别是："+allxfbz.xi+" ,"+allxfbz.zz+" ,"+allxfbz.fl+" ,"+allxfbz.yw+"  课会在下面↓↓，保持页面即可。", {icon: 's',times: 90000,pos: 't'});},25000);
      setTimeout(()=>{
                 xtip.win({
                     type: 'confirm',
                     btn: ['老实人老实刷','偷偷快一点没事吧','我要打八个！','马上通报一起来吧！'],
                     tip: "习，政治，执法，业务增加目标学分："+allxfbz.xi+" ,"+allxfbz.zz+" ,"+allxfbz.fl+" ,"+allxfbz.yw+'<br>！！！！如需要修改学分目标任务，请右上搜索框里改数字其他不要修改↗↗↗↗↗。<br>请选择慢慢刷速度：刷的速度依次提高，最后一个对电脑要求比较高慎用',
                     icon: 'a',
                     title: "请选择慢慢刷速度",
                     min: true,
                     width: '600px',
                     maxWidth: '100%',
                     shade: false,
                     shadeClose: false,
                     lock: false,
                     end:  function(){
                         startstudyxflesson(2);
                     },
                     btn1: function(){
                         startstudyxflesson(2);
                     },
                     btn2: function(){
                        startstudyxflesson(4);
                     },
                     btn3: function(){
                         startstudyxflesson(8);
                     },
                     btn4: function(){
                         startstudyxflesson(24);
                     },

                     zindex: 99999,
                 });

       },25000);
       function startstudyxflesson(studyspeed)
       {  let inputxfstr=JSON.stringify(document.querySelector(".search > input:nth-child(1)").value);
         let inputxf={};
        try{  inputxf=eval('(' +eval('(' + inputxfstr + ')') + ')') ;}
         catch(err) {  inputxf=null;xtip.msg('输入格式错误！！按默认值处理！！！', {times: 14,pos: 't'}) }
          if(inputxf!=null)
          {allxfbz=inputxf;
            xtip.msg("习，政治，执法，业务未完成学分分别是："+allxfbz.xi+" ,"+allxfbz.zz+" ,"+allxfbz.fl+" ,"+allxfbz.yw+"  课会在下面↓↓，保持页面即可。", {icon: 's',times: 90000,pos: 't'});

          }

           studyxflesson(studyspeed);
       }
       function studyxflesson(studyspeed)
        { let i=0;
          let starttime=0;
          //let studyspeed=2;
          let allxf={ "xi":0,"zz":0,"yw":0,"fl":0};
          let xxgh="";
         let djg=1;
           User.LessenList.sort((a, b) => {
            return a.id > b.id ? 1 : -1; })



          while (i<User.LessenList.length)
         {
            let Lesson=User.LessenList[i];

            if(allxf[Lesson.cate]>=allxfbz[Lesson.cate])
            {

            }

            else
            {
                if (  (Lesson.type=='video'||Lesson.type=='test') &&Lesson.learn_status=='learning'&&Lesson.locking==0&&Lesson.xf>0)
            {

               xxgh=xxgh+Lesson.title+" "+Lesson.xf+"学分 "+" "+~~(starttime/studyspeed)+" 秒后学习！"+"<br>";
                setTimeout( ()=>  {finishlesson(Lesson.course_id,Lesson.uuid,Lesson);},~~(starttime/studyspeed)*1000);
                starttime=starttime+Lesson.total_length;
                allxf[Lesson.cate]=allxf[Lesson.cate]+Lesson.xf;
                User.gjg=djg;Lesson.djg=djg++;Lesson.true_length=~~(Lesson.total_length/studyspeed);
            }



            }

            i++;

        }
         if(xxgh==""){ xxgh="提示，课程不足，无法学习，前几年刷的太卷了吧：）O(∩_∩)O哈哈~";}
          xtip.win({
            type: 'a',
            btn: ['课程会陆续底下出现,让它慢慢播别点加速'],
            tip: xxgh,
            icon: 'success',
            title: "慢慢刷学习课程规划如下：",
            min: true,
            width: '600px',
            maxWidth: '100%',
            shade: false,
            shadeClose: false,
            lock: false,
            zindex: 99999,
              times:60,
                 });
       }

       function finishlesson(courseId,lessonId,Lesson)
       {
           var ifrm = document.createElement("iframe");
           var id=courseId+lessonId;
           ifrm.id=id;
           ifrm.style.width = "500px";
           ifrm.style.height = "700px";
           let lefttime=Lesson.true_length;
           let dipjg=10;
           function disjd(){
               lefttime=lefttime-dipjg;
               if (lefttime>0)
               {setTimeout(()=>disjd(),dipjg*1000);
                xtip.msg('学习进度'+'('+Lesson.djg+'/'+User.gjg+')'+'：'+'('+lefttime+'/'+Lesson.true_length+')'+Lesson.cinfo.title, {icon: 's',times: dipjg});
               }
           }
           disjd();
           if(Lesson.seletype=="notOptional")
           {

               ifrm.setAttribute("src", "https://dinglearning.cn/pcHome/dist/CourseDetail?uuid="+courseId);




           }
           else
           {
               if (Lesson.type=='video')
               {
                   ifrm.setAttribute("src", "https://dinglearning.cn/pcHome/dist/CoursePlay/VideoPlay?courseId="+courseId+"&lessonId="+lessonId);

               }

               if (Lesson.type=='test')

               {

                   ifrm.setAttribute("src", "https://dinglearning.cn/pcHome/dist/exam/description?uuid="+Lesson.media_id+"&from=course&module=1&courseId="+courseId+"&lessonId="+lessonId);
               }
           }
           document.body.appendChild(ifrm);
           document.getElementById(id).contentWindow.location.reload(true);


           setInterval( ()=>
                       {
               if( document.getElementById(id).contentWindow.document.querySelector("#courseDetail > header > div.center > button")!=null) document.getElementById(id).contentWindow.document.querySelector("#courseDetail > header > div.center > button").click();

               if( document.getElementById(id).contentWindow.document.querySelector("#courseDetail > header > div.center > div:nth-child(6) > button")!=null) document.getElementById(id).contentWindow.document.querySelector("#courseDetail > header > div.center > div:nth-child(6) > button").click();


               if(document.getElementById(id).contentWindow.document.querySelector("#exam-description > div.wrap > div.el-row > div > div > div.btn-box > button.start_exam_btn")!=null) document.getElementById(id).contentWindow.document.querySelector("#exam-description > div.wrap > div.el-row > div > div > div.btn-box > button.start_exam_btn").click();

               if(document.getElementById(id).contentWindow.document.querySelector("#ifrmexam")!=null)   document.getElementById(id).contentWindow.document.querySelector("#ifrmexam").click();

               if(document.getElementById(id).contentWindow.document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary")!=null) document.getElementById(id).contentWindow.document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary").click();

               if(document.getElementById(id).contentWindow.document.getElementById('my-player')!=null)  document.getElementById(id).contentWindow.document.getElementById('my-player').player.play();

               if((lefttime<=0)&&(document.getElementById(id).contentWindow.document.getElementById('ifrm')!=null)) document.getElementById(id).contentWindow.document.getElementById('ifrm').click();
           },30000);

       }




   }

console.log("df");
document.body.append(ifrm);}}

setInterval(funcman, 2000);



    // Your code here...
})();