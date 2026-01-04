// ==UserScript==
// @name             yuminggetsong
// @author            songshu
// @description       黎明重工查找域名小插件，内部使用
// @version           2018.11.20.01
// @include           https://member.expireddomains.net/*
// @run-at            document-end
// @namespace         https://greasyfork.org/zh-CN/users/songshu
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/38035/yuminggetsong.user.js
// @updateURL https://update.greasyfork.org/scripts/38035/yuminggetsong.meta.js
// ==/UserScript==
(function () {

   function getzhucefun(){//显示注册按钮
        var i=0;
        while(i<listtrs.length){
          listtr =  listtrs[i];
          var yuming = listtr.getElementsByClassName('field_domain')[0];
          //alert(yuming.innerText);
          var  yumingS= listtr.getElementsByClassName('field_whois')[0];
         if (yumingS){

            if(yumingS.innerText=="registered"){
                listline.removeChild(listtr);
                //alert(i);
              i--;
              }

             }
         
          i++;
          //增加3个搜索连接  https://web.archive.org/web/*/cnzby.cn  https://www.so.com/s?q=cnzby.cn https://www.baidu.com/s?wd=cnzby.cn http://whois.chinaz.com/cnzby.cn
         var  listtrtd=listtr.getElementsByTagName('td')[0];
                        //alert(listtrtd.innerText);
          var souget = document.createElement('p');
          var stylenew="font-size: 16px;margin:2px 1px;line-height:18px;background-color:#869090;";  
          souget.innerHTML = '<span  style="font-size: 16px;margin:2px 1px;line-height:18px; background-color:#8bf8f8" ><a  onmouseover="this.parentNode.style=\''+stylenew+'\'" target="_blank"  style="margin:0px 3px;" href="https://web.archive.org/web/*/'+yuming.innerText+'">archive</a><a  onmouseover="this.parentNode.style=\''+stylenew+'\'"  target="_blank"  style="margin:0px 3px;" href="https://www.google.com/search?q=site%3A'+yuming.innerText+'">google</a><a  onmouseover="this.parentNode.style=\''+stylenew+'\'"  target="_blank"  style="margin:0px 3px;"  href="https://www.so.com/s?q=www.'+yuming.innerText+'">360</a><a   onmouseover="this.parentNode.style=\''+stylenew+'\'" target="_blank"   style="margin:0px 3px;"  href="https://www.baidu.com/s?wd=site%3A'+yuming.innerText+'">baidu</a><a  onmouseover="this.parentNode.style=\''+stylenew+'\'"  target="_blank"   style="margin:0px 3px;"  href="http://whois.chinaz.com/'+yuming.innerText+'">whois</a></span>';
         listtrtd.insertBefore(souget, listtrtd.firstchild);
        }
     funNushow(listtrs.length);
   }
    
  //自动打开链接 autoopen
  function getautoopen(){//0.6秒打开链接
      if(listtrs.length>200){
      alert("请先筛选，或者减少每页数量，超过150将不自动执行。");
    }
    else { 
      linki=0;
      linkopen(listtrs,linki);
    }
  }
  
  
  function getautoopen2(){//0.6秒打开链接
      if(listtrs.length>200){
      alert("请先筛选，或者减少每页数量，超过150将不自动执行。");
    }
    else { 
      linki=0;
      linkopen2(listtrs,linki);
    }
  }
  
  //自动打开链接 autoopen
  function linkopen(listlink,linki){//0.6秒打开链接
     if(linki<listlink.length){ //全部打开后停止
       yuming =  listtrs[linki].getElementsByClassName('field_domain')[0].getElementsByTagName('a')[0].innerText;
    linkhref='https://www.so.com/s?q=www.'+yuming;//这里修改域名
    window.open(linkhref);
    txt=linki+1;
     txt=" "+txt+":"+yuming;
    funlinkshow(txt);
    linkTT = window.setTimeout(function () {
       linkopen(listlink, linki)
      },300);//600为自动打开间隔
      linki=linki+1;
     }
    else
      stopCount();
  }
  
 
 //针对archive域名
    function linkopen2(listlink,linki){//0.6秒打开链接
     if(linki<listlink.length){ //全部打开后停止
       yuming =  listtrs[linki].getElementsByClassName('field_domain')[0].getElementsByTagName('a')[0].innerText;
    linkhref="https://web.archive.org/web/1950*/"+yuming;//这里修改域名
    window.open(linkhref);
    txt=linki+1;
     txt=" "+txt+":"+yuming;
    funlinkshow(txt);
    linkTT = window.setTimeout(function () {
       linkopen2(listlink, linki)
      },1000);//国外域名过滤，如果采用双重判断，请设置为1000毫秒以上，初步判断之后尽量控制在25个以内。
      linki=linki+1;
     }
    else
      stopCount();
  }
  
    function stopCount(){//停止
      clearTimeout(linkTT);
    }
  

  
 //field_creationdate field_abirth
    function getwbfun(){ //WB<AB

        var i=0;
        while(i<listtrs.length){
          listtr =  listtrs[i];
          //alert(listtr.innerText);
          var yuming = listtr.getElementsByClassName('field_domain')[0];
          //alert(yuming.innerText);
          var  yumingwb= listtr.getElementsByClassName('field_creationdate')[0].innerText;
          var yumingab= listtr.getElementsByClassName('field_abirth')[0].innerText;
          if(yumingwb.lengt<2){
            yumingwb="1";
          }
         
          if(yumingab.lengt<2){
            yumingab  ="2015";
          }
         if(Number(yumingwb) > Number(yumingab)){
             listline.removeChild(listtr);
          }
          else i++;
        }
      funNushow(listtrs.length);
      getautoopen();//想自动执行的请打开此行
    }
  
      function getabfun(){ //AB<2017
        var i=0;
        while(i<listtrs.length){
          listtr =  listtrs[i];
          //alert(listtr.innerText);
          var yuming = listtr.getElementsByClassName('field_domain')[0];
          //alert(yuming.innerText);
          var yumingab= listtr.getElementsByClassName('field_abirth')[0].innerText;

          
         if(yumingab.lengt<2){
            yumingab  = "2015";
          }
          if(Number(yumingab)>2016){
             listline.removeChild(listtr);
          }
          else i++;
        }  
        funNushow(listtrs.length);
    }
  
  function funNushow(no){
   var Nushow = document.getElementById('content').getElementsByClassName('infos')[0];
   var Nushowspan=Nushow.getElementsByTagName('span')[0];
    //alert(no);
    if(Nushowspan){
      Nushowspan.innerHTML='<span style="font-size: 22px;margin:3px;">共有'+no+'条信息</span>';
    }
    else Nushow.innerHTML=Nushow.innerHTML+'<span style="font-size: 22px;margin:3px;">共有'+no+'条信息</span>';
  } 
  
   function funlinkshow(no){
      var Nushowspan=document.getElementById('content').getElementsByClassName('infos')[0].getElementsByTagName('span')[0];
      var Nushowspan2=document.getElementById('content').getElementsByClassName('infos')[0].getElementsByTagName('span')[1];
     if(Nushowspan2){
       Nushowspan2.innerHTML=Nushowspan2.innerHTML+'<span style="font-size: 22px;margin:3px;"> '+no+'已后台打开</span>';
     }
      else Nushowspan.innerHTML=Nushowspan.innerHTML+'<span style="font-size: 22px;margin:3px;"> '+no+'已后台打开</span>';
     
   }
  
  
    
  //main 主程序
 //begin
 
  var modmenut;
  modmenut = document.getElementById('navlist');
    if (modmenut) {
      var listyum=document.getElementsByClassName('base1') [0]; //列表数组
      listline= listyum.getElementsByTagName('tbody')[0];
      listtrs=  listline.getElementsByTagName('tr');
      var listno=  listtrs.length;
      funNushow(listno);
      
    kongzhi = document.createElement('div');
    kongzhi.innerHTML = '';
    kongzhi.innerHTML = kongzhi.innerHTML + '<button id="getwb"  name="getwb" ><span style="font-size: 22px;margin:3px;">WB小于AB</span></button>' ;
kongzhi.innerHTML = kongzhi.innerHTML + '<button id="getab"  name="getab" ><span style="font-size: 22px;margin:3px";>AB小于2017</span></button>';

    kongzhi.innerHTML = kongzhi.innerHTML + '<button id="getzhuce"  name="getzhuce" ><span style="font-size: 22px;margin:3px;">处理信息</span></button> ';
    kongzhi.innerHTML = kongzhi.innerHTML + '<button id="autoopen"  name="autoopen" ><span style="font-size: 22px;margin:3px;">全部自动打开查验(中文)</span></button> ';
    kongzhi.innerHTML = kongzhi.innerHTML + '<button id="autoopen2"  name="autoopenen2" ><span style="font-size: 22px;margin:3px;">全部自动打开查验(外文)</span></button></div>';
    modmenut.insertBefore(kongzhi, modmenut.firstchild);
    //添加按钮
    modmenut.getElementsByTagName('a') [0].style = 'display:none;';
  }  
  //执行相关点击函数
    document.getElementById('getzhuce').addEventListener('click', getzhucefun, false); //隐藏已注册项目;
    document.getElementById('getwb').addEventListener('click', getwbfun, false); //WB<AB;
    document.getElementById('getab').addEventListener('click', getabfun, false); //AB<2017;
    document.getElementById('autoopen').addEventListener('click',getautoopen, false); //中文自动打开;
    document.getElementById('autoopen2').addEventListener('click',getautoopen2, false); //外文自动打开;

}) ();