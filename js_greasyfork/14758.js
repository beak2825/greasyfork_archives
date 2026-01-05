// ==UserScript==
// @name        autoSign
// @author      setycyas
// @namespace   https://greasyfork.org/zh-CN/users/14059-setycyas
// @description 一些论坛的自动签到脚本,目前支持4个网站:sstm,2djgame,acfun,lightnovel
// @include     *
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/14758/autoSign.user.js
// @updateURL https://update.greasyfork.org/scripts/14758/autoSign.meta.js
// ==/UserScript==
//是否测试中,非测试时设定为0测试时设定为1.测试状态下会很多对话框监视状态
var isDebug = 0;
//上次签到日期
var lastSign = new Date();
var lastSignStr;
var vTemp = GM_getValue('lastSign');
if (vTemp) {
  var y = vTemp.match(/(\d+)y/) [1];
  var m = vTemp.match(/(\d+)m/) [1];
  var d = vTemp.match(/(\d+)d/) [1];
  lastSign.setFullYear(y, m, d);
} else {
  lastSign.setFullYear(1970, 0, 1);
}
lastSignStr = lastSign.getFullYear() + 'y' + lastSign.getMonth() + 'm' + lastSign.getDate() + 'd';
//油猴菜单
GM_registerMenuCommand('一键签到', SimpleSign);
/*所有需要签到的网站的资料
sType代表网站类型,目前只有simple和formhash两种.simple只要直接签到,formhash的比较复杂,要先访问主页获取formhash*/
var webSite = [
  {
    sType: 'formhash',
    data: 'qdxq=kx',
    signURL: 'https://sstmlt.net/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&sign_as=1&inajax=1',
    homeURL: 'https://sstmlt.net'
  },
  {
    sType: 'simple',
    data: '',
    signURL: 'http://www.lightnovel.cn/home.php?mod=task&do=apply&id=98'
  },
  {
    sType: 'simple',
    data: '',
    signURL: 'http://bbs4.2djgame.net/home/home.php?mod=task&do=apply&id=1'
  },
  {
    sType: 'simple',
    data: '',
    signURL: 'http://www.acfun.tv/member/checkin.aspx'
  }
];
//一键签到命令
function SimpleSign() {
  //今天的日期
  var today = new Date();
  var todayStr = today.getFullYear() + 'y' + today.getMonth() + 'm' + today.getDate() + 'd';
  //DebugAlert('日期差=' + (today - lastSign));
  if (lastSignStr == todayStr) {
    if (!confirm('今天已经运行过一键签到,一定要再运行吗？')) {
      DebugAlert('放弃再运行');
      return;
    } else {
      DebugAlert('执意再运行');
    }
  } else {
    DebugAlert('第一次执行当日一键签到');
  }
  //DebugAlert('lastSign='+lastSignStr);
  //DebugAlert('today='+todayStr);
  //DebugAlert('共有'+webSite.length+'个网站需要签到');

  for (var i = 0; i < webSite.length; i++) {
    if (webSite[i].sType == 'simple') {
      //DebugAlert('抓到一只simple的URL'+webSite[i].signURL);
      GM_xmlhttpRequest({
        method: 'GET',
        url: webSite[i].signURL,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/xml',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function (response) {
          // alert(response.responseText.match('本期您已申请过'));
          DebugAlert(response.responseText);
        }
      });
    }
    if (webSite[i].sType == 'formhash') {
      //DebugAlert('抓到一只formhash的URL'+webSite[i].signURL);
      var signURL=webSite[i].signURL;
      var data=webSite[i].data;//要把变量传到响应函数,需要在最接近的地方定义变量,否则全局变量无法传入响应函数
      GM_xmlhttpRequest({
        method: 'GET',
        url: webSite[i].homeURL,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/xml',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function (response) {
          var sp_html = '';
          if (response) {
            sp_html = response.responseText;
          }
          DebugAlert('此formhash主页响应了'+response.responseText.length+'字');
          var formhash = sp_html.match(/formhash=([^"]*)"/) [1];
          if (formhash.length > 0) {
            DebugAlert('formhash='+formhash);
            //签到请求
            GM_xmlhttpRequest({
              method: 'POST',
              url: signURL,
              data: 'formhash=' + formhash + '&'+data,
              headers: {
                'User-Agent': 'Mozilla/5.0', // If not specified, navigator.userAgent will be used.
                'Accept': 'text/xml', // If not specified, browser defaults will be used.
                "Content-Type": "application/x-www-form-urlencoded"
                
              },
              onload: function (response) {
                DebugAlert(response.responseText);
              }
            });
          }
        }
      });
    }
  }
  //一键签到完毕,记录最近签到日期

  GM_setValue('lastSign', todayStr);
  lastSign = new Date();
  lastSignStr = todayStr;
  alert('一键签到完成!');
}
//只有在debug时才显示的消息    

function DebugAlert(message) {
  if (isDebug > 0) {
    alert(message);
  }
}
