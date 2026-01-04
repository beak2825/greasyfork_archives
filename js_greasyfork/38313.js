// ==UserScript==
// @name             yumingzxgetsong
// @author            songshu
// @description       黎明重工查找域名小插件，内部使用
// @version           2018.2.10.10
// @include           http://www.xz.com/auction/bidlist*
// @run-at            document-end
// @namespace         https://greasyfork.org/zh-CN/users/songshu
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/38313/yumingzxgetsong.user.js
// @updateURL https://update.greasyfork.org/scripts/38313/yumingzxgetsong.meta.js
// ==/UserScript==
(function () {

   function getzhucefun(){//显示注册按钮
     loadlist();
        var i=1;
        while(i<listtrs.length){
          listtr =  listtrs[i];
          //alert(listtr.innerText);
          var yuming = listtr.getElementsByClassName('auclist-domain')[0];
          //alert(yuming.innerText);
          /*var  yumingS= listtr.getElementsByClassName('field_whois')[0];
         if (yumingS){
            if(yumingS.innerText=="registered"){
             listline.removeChild(listtr);
          }
          else i++;
         }*/
         
           i++;
          //增加3个搜索连接  https://web.archive.org/web/*/cnzby.cn  https://www.so.com/s?q=cnzby.cn https://www.baidu.com/s?wd=cnzby.cn http://whois.chinaz.com/cnzby.cn
         var  listtrtd=listtr.getElementsByTagName('td')[0];
                        //alert(listtrtd.innerText);
          var souget = document.createElement('p');
          var stylenew="font-size: 16px;margin:2px 1px;line-height:18px;background-color:#869090;";  
          souget.innerHTML = '<span  style="font-size: 16px;margin:2px 1px;line-height:18px; background-color:#8bf8f8" ><a  onmouseover="this.parentNode.style=\''+stylenew+'\'" target="_blank"  style="margin:0px 3px;" href="https://web.archive.org/web/*/'+yuming.innerText+'">archive</a><a  onmouseover="this.parentNode.style=\''+stylenew+'\'"  target="_blank"  style="margin:0px 3px;" href="https://www.google.com/search?q=site%3A'+yuming.innerText+'">google</a><a  onmouseover="this.parentNode.style=\''+stylenew+'\'"  target="_blank"  style="margin:0px 3px;"  href="https://www.so.com/s?q='+yuming.innerText+'">360</a><a   onmouseover="this.parentNode.style=\''+stylenew+'\'" target="_blank"   style="margin:0px 3px;"  href="https://www.baidu.com/s?wd=site%3A'+yuming.innerText+'">baidu</a><a  onmouseover="this.parentNode.style=\''+stylenew+'\'"  target="_blank"   style="margin:0px 3px;"  href="http://whois.chinaz.com/'+yuming.innerText+'">whois</a></span>';
         listtrtd.insertBefore(souget, listtrtd.firstchild);
        }
     funNushow(listtrs.length-1);
   }
    
  //自动打开链接 autoopen
  function getautoopen(){//0.6秒打开链接
    loadlist();
      if(listtrs.length>150){
      alert("请先筛选，或者减少每页数量，超过150将不自动执行。");
    }
    else { 
      linki=1;
      linkopen(listtrs,linki);
    }
  }
  
  
  //自动打开链接 autoopen
  function linkopen(listlink,linki){//0.6秒打开链接auclist-domain
     if(linki<listlink.length){ //全部打开后停止
       yuming =  listtrs[linki].getElementsByClassName('auclist-domain')[0].getElementsByTagName('a')[0].innerText;
    linkhref='https://www.so.com/s?q='+yuming;//这里修改域名
    window.open(linkhref);
    txt=linki;
     txt=" "+txt+":"+yuming;
    funlinkshow(txt);
    linkTT = window.setTimeout(function () {
       linkopen(listlink, linki)
      },800);//600为自动打开间隔
      linki=linki+1;
     }
    else
      stopCount();
  }
 //field_creationdate field_abirth

  
  function funNushow(no){
   var Nushow = document.getElementById('del_soucha').getElementsByTagName('span')[0];
   var Nushowspan=Nushow.getElementsByTagName('p')[0];
    if(Nushowspan){
      Nushowspan.innerHTML='<p style="font-size: 22px;margin:3px;">共有'+no+'条信息</p>';
    }
    else Nushow.innerHTML=Nushow.innerHTML+'<p style="font-size: 22px;margin:3px;">共有'+no+'条信息</p>';
  } 
  
   function funlinkshow(no){
      var Nushowspan=document.getElementById('del_soucha').getElementsByTagName('span')[0].getElementsByTagName('p')[0];
      var Nushowspan2=document.getElementById('del_soucha').getElementsByTagName('span')[0].getElementsByTagName('p')[1];
     if(Nushowspan2){
       Nushowspan2.innerHTML=Nushowspan2.innerHTML+'<p style="font-size: 22px;margin:3px;"> '+no+'已后台打开</p>';
     }
      else Nushowspan.innerHTML=Nushowspan.innerHTML+'<p style="font-size: 22px;margin:3px;"> '+no+'已后台打开</p>';
     
   }
  
  function loadlist(){//重载列表
      var listyum=document.getElementsByClassName('table-striped') [0]; //列表数组
      listline= listyum.getElementsByTagName('tbody')[0]; 
      listtrs=  listline.getElementsByTagName('tr');
      listno=  listtrs.length;
      listno=listno-1;
      funNushow(listno);
  }
    
  //main 主程序
 //begin
 
  var modmenut,listline,listtrs,listno;
  modmenut = document.getElementsByClassName('domain-res-search') [0];
    if (modmenut) {
      loadlist();
    kongzhi = document.createElement('div');
    kongzhi.innerHTML = '';
    kongzhi.innerHTML = kongzhi.innerHTML + '<button id="getzhuce"  name="getzhuce" ><span style="font-size: 22px;margin:3px;">处理信息</span></button> ';
    kongzhi.innerHTML = kongzhi.innerHTML + '<button id="autoopen"  name="autoopen" ><span style="font-size: 22px;margin:3px;">全部自动打开查验(中文)</span></button> </div>';
   modmenut.insertBefore(kongzhi, modmenut.firstchild);
    //添加按钮
    modmenut.getElementsByTagName('a') [0].style = 'display:none;';
  }  
  //执行相关点击函数
    document.getElementById('getzhuce').addEventListener('click', getzhucefun, false); //隐藏已注册项目;
    document.getElementById('autoopen').addEventListener('click',getautoopen, false); //中文自动打开;


}) ();