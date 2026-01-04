// ==UserScript==
// @name         仅用于学习测试脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  该脚本为学习测试用，请勿用于违法犯罪以及非法用途
// @author       Ohlaixinyu
// @match       https://www.xuexi.cn/*
// @match       https://pc.xuexi.cn/*
// @grant        none
// @require    https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/434989/%E4%BB%85%E7%94%A8%E4%BA%8E%E5%AD%A6%E4%B9%A0%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434989/%E4%BB%85%E7%94%A8%E4%BA%8E%E5%AD%A6%E4%B9%A0%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
     function box(){
             //显示面板
      let e = window.location.href;
      var body = document.querySelector('.layout-header');
          var box = document.createElement('div');
          if(e.indexOf('https://pc.xuexi.cn/points/login.html')!=-1){
          box.innerHTML='<div style="z-index:99;position: fixed;top: 0px;left: 50%;transform:translateX(-50%);width: 560px;height: 180px;background-color:rgba(15,207,117,0.9);border-radius:0 0 10px 10px;text-align: center;"><div style="text-align: center;color:white;font-size:36px;font-weight:blod;font-family:华文行楷">答题助手</div><div style="text-align: center;color:white;font-size:28px;font-weight:blod;font-family:华文行楷;margin-top:40px">请先扫码登录！</div></div>'
        body.appendChild(box);
          }
         if(e=='https://pc.xuexi.cn/points/exam-practice.html'){
              box.innerHTML='<div style="z-index:99;position: fixed;top: 0px;left: 50%;transform:translateX(-50%);width: 560px;height: 180px;background-color:rgba(15,207,117,0.9);border-radius:0 0 10px 10px;text-align: center;"><div style="text-align: center;color:white;font-size:36px;font-weight:blod;font-family:华文行楷">答题助手</div><div style="text-align: center;color:white;font-size:28px;font-weight:blod;font-family:华文行楷;margin-top:40px">【每日答题】正在进行</div></div>'
         body.appendChild(box);
         }
         if(e.indexOf('https://pc.xuexi.cn/points/exam-paper-detail.html')!=-1){
          box.innerHTML='<div style="z-index:99;position: fixed;top: 0px;left: 50%;transform:translateX(-50%);width: 560px;height: 180px;background-color:rgba(15,207,117,0.9);border-radius:0 0 10px 10px;text-align: center;"><div style="text-align: center;color:white;font-size:36px;font-weight:blod;font-family:华文行楷">答题助手</div><div style="text-align: center;color:white;font-size:28px;font-weight:blod;font-family:华文行楷;margin-top:40px">【专项答题】正在进行</div></div>'
        body.appendChild(box);
         }
         if(e.indexOf('https://pc.xuexi.cn/points/exam-weekly-detail.html')!=-1){
          box.innerHTML='<div style="z-index:99;position: fixed;top: 0px;left: 50%;transform:translateX(-50%);width: 560px;height: 180px;background-color:rgba(15,207,117,0.9);border-radius:0 0 10px 10px;text-align: center;"><div style="text-align: center;color:white;font-size:36px;font-weight:blod;font-family:华文行楷">答题助手</div><div style="text-align: center;color:white;font-size:28px;font-weight:blod;font-family:华文行楷;margin-top:40px">【每周答题】正在进行</div></div>'
        body.appendChild(box);
         }
           
           

   
     }
   window.addEventListener('load',function(){

   setTimeout(box,500);
    })
    //自动阅读

    function autoReading(){
        var listIndex = localStorage.getItem('listIndex');
        console.log(listIndex);
        clearTimeout(red);
        let cur =window.location.pathname;
        cur= window.location.pathname;
               if(cur.indexOf('/lgpage/detail/index.html')==-1){
                       let list = document.querySelectorAll('.text');
               //从第下标为1的数据开始 总共需要阅读12条
                   if(listIndex<=13){
                    list[listIndex].click();
                   localStorage.setItem('listIndex',++listIndex);
                   window.close();
                   }else{
                    localStorage.setItem('listIndex',1);
                    var people = confirm('除了看视频都完成了，是否关闭当前页面？');
                       if(people){
                       window.close();
                       window.parent.close();
                       window.open("about:blank","_top").close();
                       }
                       else{
                       return false;
                       }
                       
                   }
                 
        }else{

                    }








    }

       function weekAnswer(type){
      //查看答案按钮
    var all = setTimeout(()=>{
    var tip = document.querySelector('.tips');
    tip.click();

setTimeout(()=>{

    //获取答案数组
   var current = document.querySelector('.big').innerHTML;
   var answer= document.querySelector('.line-feed').getElementsByTagName('font');
   var selectList = document.querySelectorAll('.choosable');
   var next = document.querySelector('.next-btn');
   if(selectList.length!=0){
   for(var i = 0;i<selectList.length;i++){
let x = i;
  for(var j=0;j<answer.length;j++){
  if(selectList[x].innerHTML.indexOf(answer[j].innerHTML,0)!=-1){
   selectList[x].click();
    break;
  }
  }
   }


   }else if(selectList.length==0&&answer.length!=0){
       var mevent=new Event('input',{bubbles:true});
    var write = document.querySelector('.blank');
       write.setAttribute('value',answer[0].innerHTML);
        write.dispatchEvent(mevent);
   }else if(selectList.length==0&&answer.length==0){

   }
  next.click();
  setTimeout(()=>{
      console.log(type);
    if(type=='zhuan'){
     if(current==10){
         var setPage = document.querySelector('.submit-btn');
       setPage.click();
     setTimeout(()=>{
     window.location.href='https://pc.xuexi.cn/points/exam-weekly-list.html';
     },1500)
    }else{

         clearTimeout(all);
     next.click();
   weekAnswer('zhuan');
    }
    }else if(type=='ri'){
     if(current==5){
         next.click();
     window.location.href='https://pc.xuexi.cn/points/exam-paper-list.html';
         weekAnswer('zhou');
    }else{
         clearTimeout(all);
     next.click();

   weekAnswer('ri');
    }
    }else if(type=='zhou'){
      if(current==5){
         next.click();
           let body = document.querySelector('.layout-header');
          let box = document.createElement('div');
        box.innerHTML='<div style="z-index:99;position: fixed;top: 0px;left: 50%;transform:translateX(-50%);width: 560px;height: 180px;background-color:rgba(15,207,117,0.9);border-radius:0 0 10px 10px;text-align: center;"><div style="text-align: center;color:white;font-size:36px;font-weight:blod;font-family:华文行楷">答题助手</div><div style="text-align: center;color:white;font-size:28px;font-weight:blod;font-family:华文行楷;margin-top:40px">【答题完成】即将开始【阅读任务】</div></div>'
         body.appendChild(box);
           clearTimeout(all);
          window.location.href='https://www.xuexi.cn/?abc=123456789';
    }else{
         clearTimeout(all);
     next.click();
         next.click();

   weekAnswer('zhou');
    }
    }
  },1000);
},1500);

},3500);

     }

    //检测当前位置
    function getLocation(){
   if(localStorage.getItem('listIndex')!=null||localStorage.getItem('listIndex')!=undefined){
  console.log(localStorage.getItem('listIndex'))
}else{
localStorage.setItem('listIndex',1)
}
    let location = window.location.href;

    //根据当前位置选择对应的功能

     //位置：首页
    if(location=='https://www.xuexi.cn'||location=='https://www.xuexi.cn/index.html'||location=='https://www.xuexi.cn/'){
     //跳转至登录页
     window.location.href='https://pc.xuexi.cn/points/login.html';
    }
   else if(location=='https://pc.xuexi.cn/points/login.html'){
       let head = document.querySelector('.redflagbox');
        let head2 = document.querySelector('.layout-header');
        head.style.display='none';
        head2.style.display='none';
       }
   else if(location=='https://pc.xuexi.cn/points/my-study.html'){
          window.location.href='https://pc.xuexi.cn/points/exam-practice.html';
     }
      else if(location=='https://pc.xuexi.cn/points/exam-practice.html'){

          weekAnswer('ri');

        }
       else if(location=='https://pc.xuexi.cn/points/exam-paper-list.html'){
        setTimeout(()=>{
         var zhuan = document.querySelectorAll('.ant-btn-primary');
           zhuan[0].click();
        },2500);
        }
        else if(location.indexOf('https://pc.xuexi.cn/points/exam-paper-detail.html')!=-1){
        weekAnswer('zhuan');

        }
        else if(location=='https://pc.xuexi.cn/points/exam-weekly-list.html'){
             setTimeout(()=>{
         var zhuan = document.querySelectorAll('.ant-btn-primary');
           zhuan[0].click();
        },2500);

        }
        else if(location.indexOf('https://pc.xuexi.cn/points/exam-weekly-detail.html?id')!=-1){
         weekAnswer('zhou');
        }
        else if(location=='https://www.xuexi.cn/?abc=123456789'){
         setTimeout(()=>{
         window.location.replace();
         },6000);
       var clickLisst= setTimeout(()=>{
        var more = document.querySelector('.more');
         more.click();
         window.parent.close();
           window.open("about:blank","_top").close();
          clearTimeout(clickLisst);
        },3000);


        }
       else if(location.indexOf('https://www.xuexi.cn/lgpage/detail/index.html?id=')!=-1){
           setTimeout(()=>{
             let body = document.querySelector('.logo-content');
          let box = document.createElement('div');
        box.innerHTML='<div style="z-index:99;position: fixed;top: 0px;left: 50%;transform:translateX(-50%);width: 560px;height: 180px;background-color:rgba(15,207,117,0.9);border-radius:0 0 10px 10px;text-align: center;"><div style="text-align: center;color:white;font-size:36px;font-weight:blod;font-family:华文行楷">答题助手</div><div style="text-align: center;color:white;font-size:28px;font-weight:blod;font-family:华文行楷;margin-top:40px">正在进行【阅读任务】42秒后下一个</div></div>'
         body.appendChild(box);
           },2000);
           setTimeout(()=>{
           window.location.href='https://www.xuexi.cn/?abc=123456789'
           },40000);
        }
        else if (window.location.pathname.indexOf('/lgpage/detail/index.html')==-1){
          setTimeout(autoReading,2500);

        }


}
var red = null;
//
//优先执行页面位置检测
var flag = false;
window.addEventListener('load',function(){
    flag=true;
              getLocation();
   })

if(!flag&&window.location.href=='https://www.xuexi.cn/?abc=123456789'||location=='https://www.xuexi.cn'||location=='https://www.xuexi.cn/index.html'||location=='https://www.xuexi.cn/'){
setTimeout(()=>{
window.location.reload();
},6000);
}






