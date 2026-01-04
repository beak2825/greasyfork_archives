// ==UserScript==
// @name              yuming360get
// @author            songshu
// @description       根据360的结果，进行选择处理
// @version           2018.2.21.01
// @include           https://www.so.com/s*
// @include           https://m.so.com/s*
// @run-at            document-end
// @namespace         https://greasyfork.org/zh-CN/users/songshu
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/38212/yuming360get.user.js
// @updateURL https://update.greasyfork.org/scripts/38212/yuming360get.meta.js
// ==/UserScript==
(function () {
   function txtcheck(title,txt){ //过滤敏感词
       if(CheckIsChinese(title)<1){ //不含有中文
             CloseWebPage();
       }
       else { 
         var keyarr=["游戏","破解","双色","时时彩","老虎","购物车","阿里云","域名","交易","av","AV","jj","JJ","偷拍","美女","少妇","黄网","绝色","天堂","妹","护士","教师","苍井空","小说","电影","高清","无码","十八","禁","彩票","足球","在线","一口价","百度","广大网友","尽力给","网友们","尽力帮","尽心竭力"];
       for(var i=0;i<keyarr.length;i++){  
         if(txt.indexOf(keyarr[i]) > -1){//存在敏感词
           i=keyarr.length;
           CloseWebPage();
         }
        }    
       }  
}

 function CheckIsChinese(val){  //判断是否还有中文
　　var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
　 　if(reg.test(val))
	{	 
     return 1;//含有中文
	 }   
    else 
	return 0;
  }
  
  
  function addtn(webname,listtrtd){ //增加快捷方式 //listtrtd=document.getElementById('g-hd-tabs');
       var souget = document.createElement('p');
       var stylenew="font-size: 26px;margin:0px 1px; background-color:#8bf8f8";
       souget.innerHTML = '<span  style="font-size: 26px;margin:0px 1px; background-color:#8bf8f8" > <button id="autoopen"  name="autoopen" ><span style="font-size: 22px;margin:3px;">一键校验</span></button> <a  onmouseover="this.parentNode.style=\''+stylenew+'\'" target="_blank"  style="margin:0px 3px;" href="https://web.archive.org/web/*/'+webname+'">archive</a><a  onmouseover="this.parentNode.style=\''+stylenew+'\'"  target="_blank"  style="margin:0px 3px;" href="https://www.google.com/search?q=site%3A'+webname+'">google</a><a  onmouseover="this.parentNode.style=\''+stylenew+'\'"  target="_blank"  style="margin:0px 3px;"  href="https://www.so.com/s?q='+webname+'">360</a><a   onmouseover="this.parentNode.style=\''+stylenew+'\'" target="_blank"   style="margin:0px 3px;"  href="https://www.baidu.com/s?wd=site%3A'+webname+'">baidu</a><a  onmouseover="this.parentNode.style=\''+stylenew+'\'"  target="_blank"   style="margin:0px 3px;"  href="http://whois.chinaz.com/'+webname+'">whois</a></span>';
     listtrs[0]="https://web.archive.org/web/1950*/"+webname;
     listtrs[1]="https://www.baidu.com/s?wd=site%3A"+webname;
     listtrs[2]="http://whois.chinaz.com/"+webname;
     //alert(listtrs[2]);
    if(kuaizhaolink()!=0){
       listtrs[3]=kuaizhaolink();
      //alert(listtrs[3]);
    }
    
      listtrtd.insertBefore(souget, listtrtd.firstchild);
  }
  
  function kuaizhaolink(){//获得当前页面的快照link
    //res-linkinfo
    linkkz= document.getElementById('main').getElementsByTagName('li')[0].getElementsByClassName('res-linkinfo')[0].getElementsByTagName('a')[0].href;
    if(linkkz){
          return linkkz;
    }
      else return 0;
  }
function CloseWebPage(){//关闭当前页面/
 if (navigator.userAgent.indexOf("MSIE") > 0) {
  if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
   window.opener = null;
   window.close();
  } else {
   window.open('', '_top');
   window.top.close();
  }
 }
 else if (navigator.userAgent.indexOf("Firefox") > 0) {
  //window.location.href = 'about:blank ';
  /*打开火狐浏览器，地址栏输入about:config，找到dom.allow_scripts_to_close_windows这项
  （支持Ctrl+F搜索），默认值为false，双击修改成true，就可以使用脚本关闭窗口了。
  */
   window.opener = null;
  window.open('', '_self', '');
  window.close();
 } else {
  window.opener = null;
  window.open('', '_self', '');
  window.close();
 }
}
  
  
//自动打开链接 autoopen
  function getautoopen(){//0.6秒打开链接
      if(listtrs.length>150){
      alert("请先筛选，或者减少每页数量，超过150将不自动执行。");
    }
    else { 
      linki=0;
      linkopen(listtrs,linki);
    }
  }
  
    //自动打开链接 autoopen
  function linkopen(listlink,linki){//0.6秒打开链接
     if(linki<listlink.length){ //全部打开后停止
       linkhref = listlink[linki]; //这里修改域名
       //alert(linkhref);
    window.open(linkhref);
    linkTT = window.setTimeout(function () {
       linkopen(listlink, linki)
      },600);//600为自动打开间隔
      linki=linki+1;
     }
    else
      stopCount();
  }
  
  function stopCount(){//停止
      clearTimeout(linkTT);
   }
  
  //主程序
 
    var  sorelt=document.getElementById('main'); 
    var  noresult=document.getElementById('no-result'); 
    var mnoresult=document.getElementById('no-result-tips');
    var urlweb=window.location.search;
    webname=urlweb.substr(urlweb.indexOf("=")+1); 
    var   listtrs = new Array();
    var   linki=0;

   if(noresult||mnoresult){
      CloseWebPage();//关闭无搜索结果界面
   } 
  
  if(sorelt){
    var toptip=sorelt.getElementsByClassName('so-toptip')[0]; 
    if(toptip){
      CloseWebPage();
    }
    else{
      var tit,str;
      var listtrtd;
      var solid=sorelt.getElementsByTagName('li')[0];//pc端
      if(solid){
        soli=solid.getElementsByClassName('res-desc')[0];
        var solih2=sorelt.getElementsByTagName('li')[0].getElementsByTagName('h3')[0];
        tit=solih2.innerText;
        str=solid.innerText+solih2.innerText;  
        listtrtd=document.getElementById('g-hd-tabs');
      }
      else 
      {//g-card
        solid=document.getElementsByClassName('res-list')[0].getElementsByTagName('p')[0];//移动端document.getElementById('main')
        solih2=document.getElementsByClassName('res-list')[0].getElementsByTagName('h3')[0];
        tit=solih2.innerText;
        str=solid.innerText+solih2.innerText; 
        listtrtd=document.getElementsByClassName('g-header-search-box')[0];
        //alert(listtrtd.innerText);
      }
        txtcheck(tit,str);
      if(listtrtd){
        addtn(webname,listtrtd);
        document.getElementById('autoopen').addEventListener('click',getautoopen, false); //一键校验;
        }
    }
  }
  else CloseWebPage();

}) ();