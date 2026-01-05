// ==UserScript==
// @name        oneKeySign
// @namespace   https://greasyfork.org/users/14059
// @icon        http://pic.ffsky.net/images/2015/12/11/884d0d09a577cb062eb51a0c67e5a4ca.jpg
// @author      setycyas
// @homepage    http://blog.sina.com.cn/u/1365265583
// @description 一些论坛的自动签到脚本,目前支持网站:sstm,2djgame,acfun,lightnovel,gn00,xiami(虾米音乐),tsdm(天使动漫)
// @include     https://sstmlt.net/*
// @include     http://www.gn00.com/*
// @include     http://www.acfun.tv/*
// @include     http://www.tsdm.net/*
// @include     http://www.lightnovel.cn/*
// @include     https://bbs4.2djgame.net/*
// @include     http://www.xiami.com/*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/14938/oneKeySign.user.js
// @updateURL https://update.greasyfork.org/scripts/14938/oneKeySign.meta.js
// ==/UserScript==

//设置每个请求的最大等待时间(毫秒)
var waitTime=60000;
//是否处于自动签到中,若进行自动签到时,所有签到网站并非都已经响应或超时,则running=1
var running=0;
/*所有需要签到的网站的资料
sType代表网站类型,目前只有simple和formhash两种.simple只要直接签到,formhash的比较复杂,要先访问主页获取formhash
webName是网站简称,必须是签到链接signURL中的字符,否则无法知道签到响应是哪个网站的
successText是网站成功签到后返回消息中包含的关键字,如果响应中有对应的字符则认为签到成功
另外留意,formhash类的网站模版中,提示签到结果等消息的div标签是<div class="c">XXX签到成功XXX</div>的形式,
非formhash类的论坛则是<div class="alert_info"><p>恭喜XXX</p></div>*/
var webSite = [
  {
    sType: 'formhash',
    webName:'sstmlt',
    data: 'qdxq=kx',
    signURL: 'https://sstmlt.net/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&sign_as=1&inajax=1',
    homeURL: 'https://sstmlt.net',
    successText:'签到成功'
  },
  {
    sType: 'formhash',
    webName:'gn00',
    data: 'qdxq=kx&qdmode=3&todaysay=&fastreply=0',
    signURL: 'http://www.gn00.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&sign_as=1&inajax=1',
    homeURL: 'http://www.gn00.com',
    successText:'签到成功'
  },
  {
    sType: 'formhash',
    webName:'tsdm',
    data: 'qdxq=kx&qdmode=1&todaysay=天气真好呀开心开心&fastreply=1',
    signURL: 'http://www.tsdm.net/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1',
    homeURL: 'http://www.tsdm.net/plugin.php?id=dsu_paulsign:sign',
    successText:'签到成功'
  },
  {
    sType: 'simple',
    webName:'lightnovel',
    signURL: 'http://www.lightnovel.cn/home.php?mod=task&do=apply&id=98',
    successText:'恭喜'
  },
  {
    sType: 'simple',
    webName:'xiami',
    signURL: 'http://www.xiami.com/task/signin',
    successText:''
  },
  {
    sType: 'simple',
    webName:'2djgame',
    signURL: 'http://bbs4.2djgame.net/home/home.php?mod=task&do=apply&id=1',
    successText:'恭喜'
  },
  {
    sType: 'simple',
    webName:'acfun',
    signURL: 'http://www.acfun.tv/member/checkin.aspx',
    successText:'true'
  }
];
//响应标志.0表示未响应,签到后只有全部标志为1才会显示签到结果列表以及允许再次签到
var resFlag=new Array();
//签到成功标志.0表示不成功
var successFlag=new Array();

//注册油猴菜单
GM_registerMenuCommand('一键签到', SimpleSign);

//一键签到命令
function SimpleSign() {
  //若上次签到没有全部响应,不作新的签到
  if(running>0){
    alert('上次签到还未全部响应,请耐心等待');
    return;
  }
  //读取上次签到日期
  var lastSign = new Date();
  var lastSignStr;
  var vTemp = GM_getValue('lastSign');
  if (vTemp) {
    lastSign.setFullYear(vTemp.match(/(\d+)y/) [1],vTemp.match(/(\d+)m/) [1], vTemp.match(/(\d+)d/) [1]);
  } else {
    lastSign.setFullYear(1970, 0, 1);
  }
  lastSignStr = lastSign.getFullYear() + 'y' + lastSign.getMonth() + 'm' + lastSign.getDate() + 'd';
  //今天的日期
  var today = new Date();
  var todayStr = today.getFullYear() + 'y' + today.getMonth() + 'm' + today.getDate() + 'd';
  if (lastSignStr == todayStr) {
    if (!confirm('今天已经运行过一键签到,一定要再运行吗？')) {
      return;
    }
  }
  //清空响应标志与成功标志
  for(var i=0;i<webSite.length;i++){
   resFlag[i]=0;
   successFlag[i]=0;
  }
  //开始运行
  running=1;
  for (var i = 0; i < webSite.length; i++) {
    if (webSite[i].sType == 'simple') {
      console.log('已发送simple类签到: '+ webSite[i].webName);
      GM_xmlhttpRequest({
        method: 'GET',
        url: webSite[i].signURL,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/xml',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout:waitTime,
        ontimeout: function(response){
          console.log('接到超时信息: '+response.finalUrl);
          HandleTimeOut(response.finalUrl);
        },
        onload: function (response) {
          console.log('simple类签到接收响应: '+response.finalUrl);
          HandleRes(response.finalUrl,response.responseText);
        }
      });
       //针对没有响应的网站,无法接收响应后再处理,直接当作有响应算了,发送消息后马上处理
      if(webSite[i].successText.length<1){
        resFlag[i]=1;
        successFlag[i]=1;
      }
    }
    if (webSite[i].sType == 'formhash') {
      console.log('已发送获取formhash消息: '+ webSite[i].webName);
      GM_xmlhttpRequest({
        method: 'GET',
        url: webSite[i].homeURL,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/xml',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout:waitTime,
        ontimeout: function(response){
          console.log('获取formhash消息超时: '+ response.finalUrl);
          HandleTimeOut(response.finalUrl);
        },
        onload: function (response) {
          var w_index=getWebIndexFromURL(response.finalUrl);
          var sp_html = '';
          if (response) {
            sp_html = response.responseText;
          }
          var formhash = sp_html.match(/formhash=([^"]*)"/) [1];
          console.log('获取formhash得到响应: '+ response.finalUrl + '  formhash='+formhash);
          if(formhash.length<1){
            console.log('获取formhash得到失败:' + response.finalUrl);
            resFlag[w_index]=1;
            successFlag[w_index]=0;
            return;
          }
          GM_xmlhttpRequest({
            method: 'POST',
            url: webSite[w_index].signURL,
            data: 'formhash=' + formhash + '&'+webSite[w_index].data,
            headers: {
              'User-Agent': 'Mozilla/5.0',
              'Accept': 'text/xml',           
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout:waitTime,
            ontimeout: function(response){
              console.log('接到超时信息: '+response.finalUrl);
              HandleTimeOut(response.finalUrl);
            },
            onload: function (response) {
              console.log('formhash类签到接收响应: '+response.finalUrl);
              HandleRes(response.finalUrl,response.responseText);
            }
          });          
        }
      });
    }
  }
  alert("已发送签到信息,请耐心等待响应.响应前不要关闭网页");
}

//超时处理
function HandleTimeOut(rURL){
  var w_index=getWebIndexFromURL(rURL);
  if(w_index<0){
    console.log(rURL+'没有对应资料');
    return;
  }
  //找到超时的网站编号,记录响应状态与签到是否成功.没有成功消息的前面已经假定了成功,不修改successFlag
  resFlag[w_index]=1;
  if(webSite[w_index].successText.length>0){
    successFlag[w_index]=-1;
  }
  //看看是否全部网站都响应完毕
  CheckAndHandle();
}

//响应处理
function HandleRes(rURL,rText){
  var w_index=getWebIndexFromURL(rURL);
  if(w_index<0){
    console.log(rURL+'没有对应资料');
    return;
  }
  //找到响应的网站编号,记录响应状态与签到是否成功
  resFlag[w_index]=1;
  if(rText.indexOf(webSite[w_index].successText)>-1){
    successFlag[w_index]=1;
  }
  //看看是否全部网站都响应完毕
  CheckAndHandle();
}

//查看是否响应完毕,完毕则进行余下处理
function CheckAndHandle(){
  //非运行状态,跳过
  if(running<1){
    return;
  }
  for(var i=0;i<webSite.length;i++){
    if(resFlag[i]<1){
      console.log('查看是否全部响应完毕,发现至少'+webSite[i].webName+'尚未响应');
      return;
    }
  }
  //都响应完毕,显示结果, 取消running状态,记录签到日期
  console.log('全部签到响应完毕');
  var lastSign = new Date();
  var lastSignStr = lastSign.getFullYear() + 'y' + lastSign.getMonth() + 'm' + lastSign.getDate() + 'd';
  var showTxt='['+lastSign.getFullYear() + '年' + (lastSign.getMonth() + 1)+'月' + lastSign.getDate() + '日'+'签到结果]\n';
  for(var i=0;i<webSite.length;i++){
    var temp=(successFlag[i]>0)?'签到成功':'签到失败';
    if(successFlag[i]<0){
      temp='超时';
    }
    showTxt+=webSite[i].webName+': '+temp+'\n';
  }
  running=0;
  GM_setValue('lastSign', lastSignStr);
  alert(showTxt);
}

//从网站URL检测签到网站数组中的编号,-1表示检测失败
function getWebIndexFromURL(srcURL){
  var w_index=-1;
  for(var i=0;i<webSite.length;i++){
    if(srcURL.indexOf(webSite[i].webName)>-1){
      w_index=i;
      break;
    }
  }
  return w_index;
}