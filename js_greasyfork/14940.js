// ==UserScript==
// @name        tsdm_dagong
// @namespace   https://greasyfork.org/users/14059
// @author      setycyas
// @homepage    http://blog.sina.com.cn/u/1365265583
// @description tsdm的自动打工脚本
// @include     http://www.tsdm.net/plugin.php?id=np_cliworkdz:work
// @version     1.2
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @run-at      document-end
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/14940/tsdm_dagong.user.js
// @updateURL https://update.greasyfork.org/scripts/14940/tsdm_dagong.meta.js
// ==/UserScript==

//页面广告个数,全局变量
var adnum=0;
//自动执行
console.log('tsdm打工开始运行');
tsdm_dagong();

//打工开始,寻找所有广告并模拟点击
function tsdm_dagong(){
  adnum=$('.npadv').length;
  if(adnum<1){
    console.log('没有发现广告');
    return;
  }else{
    console.log('有'+adnum+'个广告.'+'无论点击广告是否有响应,35秒后都先领奖再说,看不到响应也不要刷新');
  }
  for(var i=1;i<adnum+1;i++)
  $.post("plugin.php?id=np_cliworkdz:work",
    {
      act:"clickad"
    },
    function(data){
      console.log('post响应,data= '+data);
      var clicknum=parseInt(data);
      if(clicknum==adnum){
        console.log('模拟点击全部响应完毕,可以领奖了');
        tsdm_lingjiang();
      }
    }
  );
  setTimeout(tsdm_lingjiang,35000); //35秒后,无论如何领奖再说
  setTimeout('window.location.href="http://www.tsdm.net/plugin.php?id=np_cliworkdz:work";',45000); //有广告时指定45秒刷新一次
  console.log('发现广告,已模拟打工,1分钟后刷新');
}

//领奖
function tsdm_lingjiang(){
  console.log('现在尝试领奖!')
  $.post("plugin.php?id=np_cliworkdz:work",
    {
      act:'getcre'
    },
    function(data){
      console.log('领奖响应:'+data);
      //alert(get_info(data));
    }
  );
}

//获取提示信息,data可以是页面html或返回的文档
function get_info(data){
  var info=data.match(/class="alert_info">[\s]{0,4}<p>([^<]*)</)[1];
  return info;
}