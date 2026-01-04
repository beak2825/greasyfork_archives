// ==UserScript==
// @name              yumingarchiveget
// @author            songshu
// @description       根据360的结果，进行选择处理
// @version           2018.2.21.03
// @include           https://web.archive.org/web/1950* 
// @include           https://web.archive.org/web/*/http://*
// @run-at            document-end
// @namespace         https://greasyfork.org/zh-CN/users/songshu
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/38265/yumingarchiveget.user.js
// @updateURL https://update.greasyfork.org/scripts/38265/yumingarchiveget.meta.js
// ==/UserScript==
(function () {

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
  
  /**
* 通过JSON的方式请求
* @param {[type]} params [description]
* @return {[type]}  [description]
*/

        //XmlHttpRequest对象      
function createXmlHttpRequest(){      
    if(window.ActiveXObject){ //如果是IE浏览器      
        return new ActiveXObject("Microsoft.XMLHTTP");      
    }else if(window.XMLHttpRequest){ //非IE浏览器      
        return new XMLHttpRequest();      
    }      
}  
  
function getacrtxt(url,funname) {
     //1.创建XMLHttpRequest组建      
    xmlHttpRequest = createXmlHttpRequest();      
          
    //2.设置回调函数      
    xmlHttpRequest.onreadystatechange = funname;  //处理函数在这里命名    
          
    //3.初始化XMLHttpRequest组建      
    xmlHttpRequest.open("get",url,true);      
          
    //4.发送请求      
    xmlHttpRequest.send(null);    
  
} 
    
  
function  jstxtget(){//处理总年代对应的数据
  if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){      
        var picarr = xmlHttpRequest.responseText; 
        chuliyear(picarr) ;
        var url2="https://web.archive.org/__wb/calendarcaptures?url="+webname+"&selected_year=2017";//查看2017的数据。
        getacrtxt(url2,jstxtgetnew);
       
    
    }      
}
  
  function  jstxtgetnew(){//处理最新年代对应的数据
  if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){      
        var picarr = xmlHttpRequest.responseText; 
        chulilink(picarr) ;
    
    }      
}
  
  
  function stradda(str){//把年份前面加a，避免出现数字无法调用。
   while(str.indexOf("201")>-1){
         str = str.replace("201","a2a01");
         }
   
    return str;
}  
  
   function chulilink(str){ //处理字符串并获得相关200链接 st
   //str=stradda(str);
    var arr3 = JSON.parse(str);
     showYn="";
     
     for(i = 0; i < arr3.length; i++){
       for(j = 0; j < arr3[i].length; j++){
          for(k = 0; k < arr3[i][j].length; k++){
            if(arr3[i][j][k]){
              //alert(arr3[i][j][k].st);
              if(arr3[i][j][k].st){
                if(parseInt(arr3[i][j][k].st)==200){
                  showYn=arr3[i][j][k].ts;
                  //url=https://web.archive.org/web/20170924225351/10ej.com                
                }
              
              }
              
            }
          }
       }
     }
     if(showYn!=="")
       {
         url="https://web.archive.org/web/"+showYn+"/"+webname;
          window.open(url);  //如果不后台打开内容，请关闭此行以及下一行。可提高第一层打开速度。然后选择手动打开。
          CloseWebPage();
       }
     else CloseWebPage();//关闭当前窗口
     
   }
  
  function chuliyear(str){ //处理字符串并获得相关内容 
    //alert(str);
   str=stradda(str);
    var showYn=0;
    var obj = JSON.parse(str);
        if(obj.years){
          var jon=obj.years;
          if(jon.a2a017&&jon.a2a016&&jon.a2a015){
             showYn=jonsum(jon.a2a017)+jonsum(jon.a2a016)+jonsum(jon.a2a015);
            var dshow=document.getElementById('react-wayback-search').getElementsByClassName('search-toolbar')[0];
            dshow.innerHTML=dshow.innerHTML+'<span  style="font-size: 16px;margin:2px 1px;line-height:18px; background-color:#8bf8f8">15-17共有'+showYn+'个存档</span>';
          }
       else CloseWebPage();

        }
    else{
      alert("未获得数据，请检查域名是否正确，或联系作者");
      //关闭
    }
    
  }
  
  function jonsum(jon){//遍历求和
    var jsum=0;
    
    for (var i = 0; i < jon.length; i++){ 
      jsum += parseInt(jon[i]);
    } 
    return jsum;
  }
  
     function txtcheck(txt){ //过滤敏感词 sex gambling financial financing
       var keyarr=["domain","IIS","shoes","clothes","sex","gambling","gambling","credit card","financial","financing","游戏","破解","双色","时时彩","老虎","购物车","阿里云","域名","服务器","交易","av","AV","jj","JJ","偷拍","美女","少妇","黄网","绝色","天堂","妹","护士","教师","苍井空","小说","电影","高清","无码","十八","禁","彩票","足球","在线","一口价","百度","广大网友","尽力给","网友们","尽力帮","尽心竭力"];
       for(var i=0;i<keyarr.length;i++){  
         if(txt.indexOf(keyarr[i]) > -1){//存在敏感词
           i=keyarr.length;
             CloseWebPage();
         }
        }
     }

  
  //主程序
  //
  var Tchoose=document.title;//跟据title判断是否进行关键词过滤
  var urlweb=window.location.href;
  
  if(Tchoose=="Wayback Machine"&&urlweb.indexOf("1950*")>1){ //查看是否存档，如有打开最新的200存档，如果没有，则自动关闭。
      webname=urlweb.substr(urlweb.indexOf("*")+2); 
      //alert(webname);  //获得域名
      var url="https://web.archive.org/__wb/sparkline?url="+webname+"&collection=web&output=json";
      getacrtxt(url,jstxtget);
      jstxtget();//处理总数据里再处理数据2
  }
  else {
      urlweb=window.location.href;
      webname=urlweb.substr(urlweb.indexOf("http://")+7); 
      if(webname.indexOf("www")>-1){
         webname=webname.substr(webname.indexOf(".")+1);
         }
    Tch1=Tchoose+"/";
      if(!Tchoose||webname==Tch1){
        CloseWebPage();//关闭当前页面
      }
    else {
      //txtcheck(Tchoose);
      url="https://web.archive.org/web/*/"+webname+"";
      var dshow=document.getElementById('wm-ipp-inside').getElementsByClassName('s')[0];
      dshow.innerHTML=dshow.innerHTML+'<span  style="font-size: 16px;margin:2px 1px;line-height:18px; background-color:#8bf8f8"><a href="'+url+'">查看存档总览</span>';
    }
  }
  
}) ();