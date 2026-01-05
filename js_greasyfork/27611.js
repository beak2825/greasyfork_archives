// ==UserScript==
// @name              vmallsd
// @author            songshu
// @description       抢购插件
// @version           2017.3.30.10
// @include           http://club.huawei.com/plugin.php?id=auction:involve&operation=join&tid=*
// @run-at            document-end
// @namespace         https://greasyfork.org/zh-CN/users/songshu
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/27611/vmallsd.user.js
// @updateURL https://update.greasyfork.org/scripts/27611/vmallsd.meta.js
// ==/UserScript==
(function () {
  'use strict';
  //alert("欢迎使用特部插件");
  function changeStatus() {
    var realname = jQuery('#realname').attr('value');
    var address = jQuery('#address').attr('value');
    var message = jQuery('#message').attr('value');
    if (mobilecheck() && textcheck(realname, 30, 1) && textcheck(address, 100, 1) && textcheck(message, 200, 0)) {
      return true;
    } else {
      return false;
    }
  }  //校验手机号

  function mobilecheck() {
    var mobile = $('mobile').value;
    if (dontcheckmobile === true && mobile.length == 0) {
      return true;
    }
    var reg = /^(\+)?(86)?0?1\d{10}$/;
    if (mobile) {
      var checked = mobile.search(reg);
      if (checked >= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }  //校验姓名及理由输入长度&不能全是空格

  function textcheck(value, Len, flag) {
    var reg = /^\s+$/gi;
    if (value.length <= Len && ((flag == 1 && !reg.test(value) && value.length > 0) || flag == 0)) {
      return 1;
    }
    return 0;
  }  /*输入内容长度的限制*/
  (function (jq) {
    jq(document).ready(function () {
      var cansubmit = changeStatus();
      if (cansubmit) {
        jq('#confirmsubmit').removeClass('disable-submit');
      } else {
        jq('#confirmsubmit').addClass('disable-submit');
      }
    }).on('keyup', '#realname,#mobile,#address,#message', function () {
      //长度限制
      var mlength = jq(this).attr('maxlength') ? parseInt(jq(this).attr('maxlength'))  : false;
      if (mlength && this.value.length > mlength) {
        jq(this).val(this.value.substring(0, mlength));
      }      //是否允许提交

      var cansubmit = changeStatus();
      if (cansubmit) {
        jq('#confirmsubmit').removeClass('disable-submit');
      } else {
        jq('#confirmsubmit').addClass('disable-submit');
      }
    }).on('blur', '#mobile', function () {
      if (mobilecheck()) {
        $('mb_check').innerHTML = ' <img src="http://club.huawei.com/source/plugin/auction/template/images/ok.png" width="16" height="16" class="vm" />';
      } else {
        $('mb_check').innerHTML = ' <img src="http://club.huawei.com/source/plugin/auction/template/images/error.png" width="16" height="16" class="vm" />';
      }
    }).on('blur', '#realname', function () {
      var realname = jQuery('#realname').attr('value');
      if (textcheck(realname, 30, 1) == 1) {
        $('mn_check').innerHTML = ' <img src="http://club.huawei.com/source/plugin/auction/template/images/ok.png" width="16" height="16" class="vm" />';
      } else {
        $('mn_check').innerHTML = ' <img src="http://club.huawei.com/source/plugin/auction/template/images/error.png" width="16" height="16" class="vm" />';
      }
    }).on('blur', '#address', function () {
      var address = jQuery('#address').attr('value');
      if (textcheck(address, 100, 1) == 1) {
        $('ma_check').innerHTML = ' <img src="http://club.huawei.com/source/plugin/auction/template/images/ok.png" width="16" height="16" class="vm" />';
      } else {
        $('ma_check').innerHTML = ' <img src="http://club.huawei.com/source/plugin/auction/template/images/error.png" width="16" height="16" class="vm" />';
      }
    }).on('click', '.auc-hint', function () {
      jq(this).prev().prev().focus();
    }).on('focus', 'input[type=text],textarea', function () {
      jq(this).next().next().hide();
    }).on('blur', 'input[type=text],textarea', function () {
      if (jq(this).val() == '') {
        jq(this).next().next().show();
      }
    });
  }) (jQuery);
  //////////////获得id以及加密//////////////////////////////
  var timeTT;
  function IDcheakkey() {
    var mymenuget,
    quanxianget; //检查是否有抢购权限
    mymenuget = document.getElementById('mymenu');
    //alert(mymenuget.innerHTML);
    if (mymenuget) {
      var ssidkey = getCookie('IDkey');
      //alert(ssidkey);
      if (ssidkey != null && ssidkey != '') {
        if (shandiankey(mymenuget.innerHTML, ssidkey) == 1) {
          return 1;
        }
      } 
      else
      {
        var strvalue = prompt('请输入:' + 'IDkey', '')
        if (strvalue != null && strvalue != '')
        {
          setCookie('IDkey', strvalue, 365);
        }
        return 0;
      } //自动填写内容

    }
  }
  function shandiankey(str, IDkey) {
    str = escape(str);
    str = escape(str);
    str = str.replace(/%/g, '')
    if (IDkey.indexOf(str) != - 1 && str.indexOf(IDkey) != - 1) {
      return 1;
    } 
    else
    {
      //alert(str);
      //alert(IDkey.indexOf(str) );
      //alert(IDkey);
      var strvalue = prompt('请输入:' + 'IDkey', '')
      if (strvalue != null && strvalue != '')
      {
        setCookie('IDkey', strvalue, 365);
      }
      return 0;
    }
  } //检测商店key是否有效
  ///////////////////////////////cookie操作//////////////////////////

  function getCookie(c_name) {
    //alert(c_name);
    var docCKIE = unescape(document.cookie);
    //alert(docCKIE);
    if (docCKIE.length > 0) {
      //alert(docCKIE.length );
      var c_start = docCKIE.indexOf(c_name);
      // alert(c_start);
      if (c_start != - 1) {
        c_start = c_start + c_name.length + 1
        var c_end = docCKIE.indexOf(';', c_start)
        if (c_end == - 1) c_end = docCKIE.length;
        var ckievalue = unescape(docCKIE.substring(c_start, c_end));
        return ckievalue;
      }
    } 
    else return '';
  } //获得cookie的值

  function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + '=' + escape(value) + ((expiredays == null) ? '' : '; expires=' + exdate.toGMTString())
  } //设置cookie的值

  function checkCookie(str) { //提示输入
    var strvalue = getCookie(str);
    //alert('ddddddd4');
    if (strvalue != null && strvalue != '')
    {
      document.getElementById(str).value = strvalue;
      document.getElementById(str).focus();
    } 
    else
    {
      strvalue = prompt('请输入:' + str, '')
      if (strvalue != null && str != '')
      {
        setCookie(str, strvalue, 365);
        document.getElementById(str).value = strvalue;
        document.getElementById(str).focus();
      }
    }
  }
  function shangdianset() { //自动填写表格
    //alert('ddddddd');
    //var fzstr = document.getElementById(thread_subject).getElementsByTagName('h1')[0].innerHTML;
    var code = unescape('%2520%2520%2520%2520setCookie%2528%2527realname%2527%252C%2520document.getElementById%2528%2527realname%2527%2529.value%252C%2520365%2529%253B%250A%2520%2520%2520%2520setCookie%2528%2527mobile%2527%252C%2520document.getElementById%2528%2527mobile%2527%2529.value%252C%2520365%2529%253B%250A%2520%2520%2520%2520setCookie%2528%2527address%2527%252C%2520document.getElementById%2528%2527address%2527%2529.value%252C%2520365%2529%253B%250A%2520%2520%2520%2520setCookie%2528%2527message%2527%252C%2520document.getElementById%2528%2527message%2527%2529.value%252C%2520365%2529%253B');
    var code = unescape(code);
    eval(code);
    //alert('ddddddd');
  }
  var disnum = 1;
  function shangdianbtmin() { //按钮缩小放大
    var sdshow = document.getElementById('shangdianmass').getElementsByTagName('ul');
    disnum = disnum % 2 + 1;
    if (disnum > 1)
    sdshow.style.display = 'none';
     else
    sdshow.style.display = '';
  }
  var timestr = '000001';
  function fuwqitime() { //服务器时间 mtime  为目标时间 倒计时使用
    var xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new window.XMLHttpRequest();
    } else { // ie
      xhr = new ActiveObject('Microsoft')
    } // 通过get的方式请求当前文件

    xhr.open('get', '/');
    xhr.send(null);
    // 监听请求状态变化
    xhr.onreadystatechange = function () {
      var time = null,
      curDate = null;
      if (xhr.readyState === 2) {
        // 获取响应头里的时间戳
        time = xhr.getResponseHeader('Date');
        console.log(xhr.getAllResponseHeaders())
        curDate = new Date(time);
        //curDate.getFullYear()  curDate.getMonth() + 1) + '-' + curDate.getDate() + ' ' + curDate.getHours() + ':' + curDate.getMinutes() + ':' + curDate.getSeconds();
        //var BTtime4 = document.getElementById('shangdianmass').getElementsByTagName('h4');
        timestr = timetonum(curDate); //var ftimestr = '服务器时间为：' + timetostr(timestr);
        //alert(timestr);
        // BTtime4[0].innerHTML = ftimestr;
        //for (var i = 10; i > 0; i--) {
        //  timestr = timeadd(timestr);
        // }延迟10s
        var Mtime = getmutime();
        clearTimeout(timeTT);
        update(timestr, Mtime);
      }
    }
  }
  function startTime(showbank, str2) { //系统时间
    var today = new Date()
    var h = today.getHours()
    var m = today.getMinutes()
    var s = today.getSeconds() // add a zero in front of numbers<10
    m = checkTime(m)
    s = checkTime(s)
    showbank.innerHTML = '本地时间：' + h + ':' + m + ':' + s + str2;
    t = setTimeout('startTime()', 500)
  }
  function checkTime(i)
  {
    if (i < 10)
    {
      i = '0' + i
    }
    return i
  }  //scbar

  var formhashget = '';
  var formhashgetid = document.getElementById('scbar').getElementsByTagName('input');
  formhashget = formhashgetid[1].value;
  //alert(formhashget);
  var listvaluestr = getCookie('sdlist');
  function sdtime() { // 计时器
    var listvaluestr = getCookie('sdlist');
    console.log(listvaluestr);
    //模拟数据从cookie拿到的数据 
    //alert("182:"+listvaluestr);
    var strvalue = JSON.parse(listvaluestr);
    var Mtime = new Date();
    var ftimestr,
    Mtimestr;
    Mtime = '160000';
    if (strvalue != null && strvalue != '') {
      Mtime = strvalue.listtime;
      Mtime = Mtime.substring(Mtime.indexOf('2017') + 11);
      var qgbody = '<link rel="stylesheet" type="text/css" href="source/plugin/auction/template/css/auction.css"> <form id="auctionform" action="plugin.php?id=auction:involve&amp;operation=join&amp;tid=<listid>" method="post" name="auctionform" onsubmit="return changeStatus();">     <input type="hidden" name="formhash" value="' + formhashget;
      qgbody = qgbody + '">   <div id="main_message">         <h3 class="flb">出价信息确认</h3>                 <div class="auction-info">                     <div class="auction-price">您当前的花瓣余额为<font color="#28C0C6">9999999</font>，兑换后余额为<font color="#28C0C6">99999</font>。请准确填写您的真实信息，以便花部长尽快寄送给您！若奖品为虚拟礼品请在留言中提供礼品兑换所需相关信息。（如QQ号）</div>                     <div class="auction-pic">                 <div class="gl-item">                                     <a  href="/" title="<listname> ... ...">                         <div class="auction-img-container" style="background:url(http://s.huafans.cn/template/hw_fans/image/zh//css/img/huaweilogo.png) no-repeat center;background-size:contain;"><div class="img-mask"></div></div>                     </a>                     <div class="gli-cont">                         <a class="auc-name" href="thread-<listid>-1-1.html" title="<listname> ... ..."><listname> ... ...</a>                         <div class="glic-bar">                             <p >                                 <em id="timeleft" class="auc_title"></em>                             </p>                         </div>                         <p class="auc-price">                                                         <listpri><em class="auc-price-count">花瓣</em>                                                     </p>                     </div>                                 </div>             </div>         </div>     </div>     <div class="personal-info">         <h3 class="plb">填写收货信息</h3>        <table style="margin-left: 50px">            \t <tr>                 \t <th class="adt-th"><font color="f25650">*&nbsp;&nbsp;</font>收货人</th>                 <td><input type="text" class="adt-txt" id="realname" name="realname" maxlength="30"/><span id="mn_check"></span><div class="auc-hint"></div></td>             </tr>    \t \t<th class="adt-th"><font color="f25650">*&nbsp;&nbsp;</font>联系电话</th>                 <td><input name="mobile" id="mobile" class="adt-txt px" maxlength="11" type="text"><span id="mb_check"> <img src="source/plugin/auction/template/images/ok.png" class="vm" height="16" width="16"></span><div class="auc-hint" style="display: none;">请确认手机号码准确无误</div></td>       \t \t <tr>                 <th class="adt-th"><font color="f25650">*&nbsp;&nbsp;</font>收货地址</th> \t <td><input type="text" class="adt-txt adt-ta" id="address" name="address" maxlength="100" /><span id="ma_check"></span><div class="auc-hint"></div></td>             </tr>             <tr>                <th class="adt-last-th"><font color="f25650">&nbsp;&nbsp;&nbsp;&nbsp;</font>留言</th>                 <td><textarea name="auc_reply_message" id="message" class="adt-txt pt adt-last-txt" rows="3" maxlength="200"></textarea><span id="mm_check"></span><div class="auc-hint auc-hint-last">若奖品为虚拟礼品请提供所需信息<br>如：奖品为Q币时，请提供QQ号</div></td>             </tr>         </table>                 <input id="confirmsubmit" name="confirmsubmit" class="pn pnc confirmsubmit disable-submit" type="submit" value="确认兑换"/>     </div>     </form> </div>'
      while (qgbody.indexOf('<listname>') > - 1) {
        qgbody = qgbody.replace('<listname>', strvalue.listname);
      }
      while (qgbody.indexOf('<listid>') > - 1) {
        qgbody = qgbody.replace('<listid>', strvalue.listid);
      }
      while (qgbody.indexOf('<listpri>') > - 1) {
        qgbody = qgbody.replace('<listpri>', strvalue.listpri);
      }
      var htmstr = strvalue.listname + '<br>抢购时间：';
      htmstr = htmstr + Mtime + '<br>  ' + strvalue.listpri + '花瓣   <a   target="_blank"  href="http://club.huawei.com/plugin.php?id=auction:involve&operation=join&tid=' + strvalue.listid + '">>点此抢购</a>'
      while (Mtime.indexOf(':') > - 1) {
        Mtime = Mtime.replace(':', '');
      }
      showall(qgbody, Mtime);
      showh6(htmstr);
    }
  }
  function getmutime() { // 计时器
    var listvaluestr = getCookie('sdlist');
    console.log(listvaluestr);
    //模拟数据从cookie拿到的数据 
    var strvalue = JSON.parse(listvaluestr);
    var Mtime = new Date();
    var ftimestr,
    Mtimestr;
    Mtime = '160000';
    if (strvalue != null && strvalue != '') {
      Mtime = strvalue.listtime;
      Mtime = Mtime.substring(Mtime.indexOf('2017') + 11);
      while (Mtime.indexOf(':') > - 1) {
        Mtime = Mtime.replace(':', '');
      }
    }
    return Mtime;
  }
  function showh6(htmstr) {
    var BTtime6 = document.getElementById('shangdianmass').getElementsByTagName('h6');
    BTtime6[0].innerHTML = htmstr;
  }
  function update(Ftime, Mtime) {
    // alert('ddddddd669   '+Ftime);
    var BTtime4 = document.getElementById('shangdianmass').getElementsByTagName('h4');
    var ftimestr = '服务器时间为  ' + timetostr(Ftime);
    //alert(ftimestr);
    BTtime4[0].innerHTML = ftimestr;
    var BTtime5 = document.getElementById('shangdianmass').getElementsByTagName('h5');
    var ftimestr = ''
    if (Mtime - Ftime < 10) {
      ftimestr = ' 即将开始抢购，提前刷新点击 ';
    } //fuwqitime(BTtime5[0]);

    var daojishi = getwttime(Ftime, Mtime);
    ftimestr = ftimestr + '倒计时 ' + timetostr(daojishi);
    BTtime5[0].innerHTML = ftimestr;
    Ftime = timeadd(Ftime);
    timeTT = window.setTimeout(function () {
      update(Ftime, Mtime)
    }, 1000);
  }
  function getwttime(begintimestr, endtimestr) { //计算等待时间
    var begintime = parseInt(begintimestr);
    var endtime = parseInt(endtimestr);
    var h,
    m,
    s;
    if (endtime > begintime) {
      if (endtime % 100 < begintime % 100) {
        s = endtime % 100 + 60 - begintime % 100;
        endtime = endtime / 100;
        endtime = parseInt(endtime) - 1;
        if (endtime % 100 > 59) endtime = endtime - 40;
      } 
      else
      {
        s = endtime % 100 - begintime % 100;
        endtime = endtime / 100;
        endtime = parseInt(endtime);
      }
      begintime = begintime / 100;
      begintime = parseInt(begintime);
      if (endtime % 100 < begintime % 100) {
        m = endtime % 100 + 60 - begintime % 100;
        endtime = endtime / 100;
        endtime = parseInt(endtime) - 1;
        if (endtime % 100 > 59) endtime = endtime - 40;
      } 
      else
      {
        m = endtime % 100 - begintime % 100;
        endtime = endtime / 100;
        endtime = parseInt(endtime);
      }
      begintime = begintime / 100
      begintime = parseInt(begintime);
      h = endtime - begintime;
      h = h * 10000 + m * 100 + s;
    } 
    else {
      h = 0
    };
    return h;
  }
  function timeadd(timestr) { //时间递增每秒
    var time = parseInt(timestr);
    if (time % 10000 == 5959) {
      time = time + 4041;
    } 
    else if (time % 100 == 59) {
      time = time + 41;
    } 
    else time = time + 1;
    return time;
  }
  function timetonum(Dtime) { //输出时间字符串
    //alert(" 718   timetonum:    "+Dtime);
    var timestr = checkTime(Dtime.getHours()) * 10000 + checkTime(Dtime.getMinutes()) * 100 + checkTime(Dtime.getSeconds());
    return timestr;
  }
  function timetostr(num) { //输出时间字符串
    var h = parseInt(num / 10000);
    var m = parseInt(num % 10000 / 100);
    var s = num % 100;
    var timestr = checkTime(h) + ':' + checkTime(m) + ':' + checkTime(s);
    return timestr;
  }
  function getSdlistT() { //输出目前加入抢购的计时产品
    var listvaluestr = getCookie('sdlist');
    console.log(listvaluestr);
    //模拟数据从cookie拿到的数据  
    var strvalue = JSON.parse(listvaluestr);
    var Mtime = new Date();
    var htmstr = '';
    htmstr = strvalue.listname + '抢购时间：';
    Mtime = strvalue.listtime;
    Mtime = Mtime.substring(Mtime.indexOf('2017') + 11);
    htmstr = htmstr + Mtime + '<br>  ' + strvalue.listpri + '花瓣   <a  target="_blank" href="http://club.huawei.com/plugin.php?id=auction:involve&operation=join&tid=' + strvalue.listid + '">>点此抢购</a>'
    return htmstr;
  }
  function setSdlistBT() { //一键抽奖页面的填写内容函数
    var main_messageget,
    WRTpersonal; //一键抽奖页面的填写内容
    main_messageget = document.getElementById('main_message');
    if (main_messageget) {
      var chk = IDcheakkey();
      if (chk > 0) {
        var code = unescape('checkCookie%2528%2527realname%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527mobile%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527address%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527message%2527%2529%253B');
        code = unescape(code);
        eval(code);
        //自动填写内容
      }
    }
  }
  sdtime();
  function showall(qgbody, mtime) { //显示抢购内容
    var wp_aucget,
    WrtMess; //花瓣商店
    wp_aucget = document.getElementById('hd');
    //alert(wp_aucget);
    if (wp_aucget) {
      var chk = IDcheakkey();
      if (chk > 0) {
        WrtMess = document.createElement('div');
        WrtMess.className = 'wp';
        WrtMess.innerHTML = qgbody + '<div id="shangdianmass" style="width:200px;margin-top: 2px;left:70px;right:auto ; position: fixed;bottom: 10px;background:#eee;border:1px #cdcdcd solid;font-size: 14px;"><ul><h3 >请提前填写收货信息</h3><h4 </h4><h5 ></h5><h6 ></h6></ul><button   id="btmin" style="" name="btmin" ><span style="font-size: 22px;">合并/展开</span></button><button   id="bttime" style="" name="bttime" ><span style="font-size: 22px;">获取服务器时间</span></button>';
        wp_aucget.insertBefore(WrtMess, wp_aucget.firstchild);
        //alert("337");
        var strvalue = getCookie('realname');
        if (strvalue != null && strvalue != '')
        {
          var code = unescape('checkCookie%2528%2527realname%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527mobile%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527address%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527message%2527%2529%253B');
          code = unescape(code);
          eval(code);
        }
        document.getElementById('bttime').addEventListener('click', fuwqitime, false); //确认信息
        document.getElementById('btmin').addEventListener('click', shangdianbtmin, false); //缩小放大
        //输出信息填写框，提前填写
      } //main_message

    }
  }
}) ();
