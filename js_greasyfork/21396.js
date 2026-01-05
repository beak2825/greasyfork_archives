// ==UserScript==
// @name              vmallfortebu
// @author            songshu
// @description       花粉特种部队专用论坛插件,主要实现一键盖章，一键置顶，一键置顶并盖章功能
// @version           2019.9.19.03
// @include           https://club.huawei.com/*
// @include           http://club.huawei.com/*
// @include           *://hwid1.vmall.com/*
// @run-at            document-end
// @namespace         https://greasyfork.org/zh-CN/users/songshu
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/21396/vmallfortebu.user.js
// @updateURL https://update.greasyfork.org/scripts/21396/vmallfortebu.meta.js
// ==/UserScript==
(function () {
  'use strict';
  //alert("欢迎使用特部插件");
  //添加一键盖章已回复功能实现
  
  function yijianset(opid, optionID) {
    //alert(optionID);
    var all_options = document.getElementById(opid).options;
    var i;
    for (i = 0; i < all_options.length; i++) {
      if (all_options[i].value == optionID) // 根据option标签的ID来进行判断 测试的代码这里是两个等号
      {
        all_options[i].selected = true;
        //alert( document.getElementById(opid).selectedIndex);
      }
    }
  } //写入盖章理由

  function yijiliyou(getid, txt) {
    var liyou = document.getElementById(getid);
    liyou.value = txt;
  } //判断是否已弹出xxx窗口

  function getgaizhang(getid) {
    var getzhang = document.getElementById(getid);
    if (getzhang) {
      getzhang.name = 'songshu bojue';
      return getzhang.name;
    } 
    else return 0;
  } //topicadminform
  //设置通知用户

  function yijiantongzhi() {
    var tongzhi;
    tongzhi = document.getElementById('sendreasonpm');
    if (tongzhi) {
      tongzhi.checked = true;
    }
  }
  function yijianyihuifutime() {
    var zhangstatus = getgaizhang('topicadminform');
    if (zhangstatus == 0) {
      var tuzhanglink = document.getElementById('modmenu');
      tuzhanglink.getElementsByTagName('a') [1].click();
    } 
    else
    yijianyihuifu();
  }
  function yijianyifankuitime() {
    var zhangstatus = getgaizhang('topicadminform');
    if (zhangstatus == 0) {
      var tuzhanglink = document.getElementById('modmenu');
      tuzhanglink.getElementsByTagName('a') [1].click();
    } 
    else
    yijianyifankui();
  }
  function yijianyihuifu() {
    yijiliyou('reason', '特部热心为你解答！如有必要请回复<我的回复楼层>');
    yijiantongzhi();
    yijianset('stamp', '44');
  }
  function yijianyifankui() {
    yijiliyou('reason', '特部热心为你反馈，请尽快私信你的联系方式，如无权私信，请直接回复到帖子上，看到后会帮你编辑掉。');
    yijiantongzhi();
    yijianset('stamp', '42');
  }
  function yijianzhiding() {
    yijiliyou('reason', '请参考此回复');
    yijiantongzhi();
  } //点击1 自动点击2 

  function tanchutuzhang(clid1, clid2) {
    var btn = document.getElementById(clid1);
    var sub = document.getElementById(clid2);
    sub.click(modaction('stamp'));
  } //一键反馈贴直达

  function yijianfankuitie() {
    //获取当前页面的标题和链接。
    fktfuzhiall();
    //根据机型实现双机型链接    
    if (getJxFx(getpageJx(2)) > 0) {
      var jx1 = getJxstr(getpageJx(2), 1);
      var jx2 = getJxstr(getpageJx(2), 2);
      //alert(jx2);
      Fktshowtxt(jx1, jx2);
    } 
    else {
      var fankuilink = getjixingnamelink();
      newhrefwin(fankuilink, '');
    }
  } //反馈贴复制内容

  function fktfuzhiall() {
    //alert('ddddddd');
    //var fzstr = document.getElementById(thread_subject).getElementsByTagName('h1')[0].innerHTML;
    var fzstr = document.getElementById('thread_subject').innerHTML;
    fzstr = fzstr + '<br>系统版本：';
    var fneirong = document.getElementsByClassName('t_f') [0].innerHTML;
    fneirong = strGetBegin(fneirong, '<ignore_js_op>');
    fneirong = fneirong.replace(/<.*?>/gi, '');
    fzstr = fzstr + '<br><br>故障现象描述：  ' + fneirong;
    //alert(fneirong);
    fzstr = fzstr + '<br><br><br>必现还是偶现：必现    偶现';
    fzstr = fzstr + '<br>目前多少人出现此问题：多人 未知';
    var fklink = document.getElementById('pt').getElementsByTagName('a');
    //alert(fklink.length);
    var fklinkurl = document.getElementById('pt').getElementsByTagName('a') [fklink.length - 1].href;
    fzstr = fzstr + '<br>问题原始链接' + fklinkurl;
    fzstr = fzstr + '<br>联系方式：';
    fzstr = fzstr.replace(/(<br>)/g, '\r\n');
    Copy(fzstr);
    //alert(fzstr); //Copy("复制成功了！！！");
  } //复制函数

  function Copy(str) {
    var save = function (e) {
      e.clipboardData.setData('text/plain', str);
      e.preventDefault();
    }
    document.addEventListener('copy', save);
    document.execCommand('copy');
    document.removeEventListener('copy', save);
  } //新窗口打开

  function strGetEnd(str1, str2) { //前过滤 
    if (str1.indexOf(str2) != - 1)
    str1 = str1.substring(str1.indexOf(str2));
    return str1;
  }
  function strGetBegin(str1, str2) { //后过滤 
    if (str1.indexOf(str2) != - 1)
    str1 = str1.substring(0, str1.indexOf(str2));
    return str1;
  }
  function newhrefwin(href, newwin) {
    window.open(href, newwin);
  } //获取栏目名称
  //输出双机型点击按钮

  function Fktshowtxt(txt1, txt2) {
    var jxshowdiv = document.createElement('div');
    jxshowdiv.innerHTML = '<div  style="margin-top: 2px;left:70px;right:auto ; position: fixed;bottom: 50px;background:#28c0c6;border:1px #cdcdcd solid; "> <span style="font-size: 22px;margin:4px;border:1px solid #ccc;"><a target="_blank" href=' + getkeytolink(txt1) + '>' + txt1 + '</a></span><span style="font-size: 22px;margin:3px;border:1px solid #ccc"><a target="_blank" href=' + getkeytolink(txt2) + '>' + txt2 + '</a></span></div>';
    //alert(jxshowdiv.innerHTML);
    modmenut.insertBefore(jxshowdiv, modmenut.firstchild);
  } //多机型栏目输出反馈贴链接

  function getkeytolink(key) {
    var Fktlink = '';
    Fktlink = getLmtolinks(key);
    return Fktlink;
  } //单机型栏目输出反馈贴链接

  function getjixingnamelink() {
    var jixingband = document.getElementById('pt').innerHTML;
    var Fktlink = '';
    Fktlink = getLmtolink(jixingband);
    return Fktlink;
  }
  function getLmtolinks(jixingband) {
    var rjixinglink = '';
    if (jixingband.indexOf('P9 Plus') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-9359182-1-1-2123.html';
    } 
    else if (jixingband.indexOf('P9') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-8801882-1-1-2123.html';
    } 
    else if (jixingband.indexOf('Mate9 pro') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-11619470-1-1-2123.html';
    } 
    else if (jixingband.indexOf('Mate9') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-11234604-1-1-2123.html';
    } 
    else if (jixingband.indexOf('P10') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-12289703-1-1-2123.html';
    } 
    else rjixinglink = 'http://club.huawei.com/forum.php?mod=forumdisplay&action=list&fid=670&filter=typeid&typeid=2123';
    return rjixinglink;
  } //根据输入内容，返回反馈贴链接

  function getLmtolink(jixingband) {
    var rjixinglink = '';
    if (jixingband.indexOf('nova') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-11028558-1-1-2123.html';
    } 
    else if (jixingband.indexOf('V9') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-12236402-1-1-2123.html';
    } else if (jixingband.indexOf('平板M3') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-10952251-1-1-2123.html';
    } else if (jixingband.indexOf('荣耀8青春版') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-12225333-1-1-2123.html';
    } else if (jixingband.indexOf('WATCH 2') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-12406589-1-1-2123.html';
    } 
    else if (jixingband.indexOf('麦芒5') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-10213444-1-1-2123.html';
    } 
    else if (jixingband.indexOf('Mate8') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-6754081-1-1-2123.html';
    } 
    else if (jixingband.indexOf('Mate S') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-5548012-1-1-2123.html';
    } 
    else if (jixingband.indexOf('G9青春版') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-9300939-1-1-2123.html';
    } 
    else if (jixingband.indexOf('MateBook') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-9550123-1-1-2123.html';
    } 
    else if (jixingband.indexOf('荣耀Magic') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-11663791-1-1-2123.html';
    } 
    else if (jixingband.indexOf('荣耀8') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-10213412-1-1-2123.html';
    } 
    else if (jixingband.indexOf('荣耀7') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-4803129-1-1-2123.html';
    } 
    else if (jixingband.indexOf('荣耀V8') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-9304612-1-1-2123.html';
    } 
    else if (jixingband.indexOf('P8') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-10213412-1-1.html';
    } 
    else if (jixingband.indexOf('荣耀畅玩6X') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-11114854-1-1-2123.html';
    } 
    else if (jixingband.indexOf('荣耀畅玩5X') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-6270209-1-1-2123.html';
    } 
    else if (jixingband.indexOf('荣耀畅玩5C') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-9131699-1-1-2123.html';
    } 
    else if (jixingband.indexOf(' 荣耀畅玩5A') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-10061964-1-1-2123.html';
    } 
    else if (jixingband.indexOf('华为手环B3') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-9279167-1-1-2123.html';
    } 
    else if (jixingband.indexOf('荣耀手表 S1') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-11114864-1-1-2123.html';
    } 
    else if (jixingband.indexOf('华为手表') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-6754126-1-1-2123.html';
    } 
    else if (jixingband.indexOf('荣耀NOTE8') != - 1) {
      rjixinglink = 'http://club.huawei.com/thread-10474724-1-1.html';
    } 
    else {
      rjixinglink = 'http://club.huawei.com/forum.php?mod=forumdisplay&action=list&fid=670&filter=typeid&typeid=2123';
    }
    return rjixinglink;
  }
  function gaizhanshow(n) {
    var listidgai,
    listidtable,
    listleng,
    Thtml,
    tstut,
    km2;
    //alert("欢迎使用特部插件");
    listidgai = document.getElementById('threadlisttableid');
    listidtable = listidgai.childNodes;
    listleng = listidtable.length / 2 + 1;
    if (listidtable.length > 3) {
      for (var k = 1; k < listleng; k++) {
        km2 = 2 * k + 1;
        Thtml = listidtable[km2];
        tstut = showidtxt(Thtml.innerHTML);
        if (tstut > 0) {
          showidgz3(Thtml, n);
        }
      }
    }
  } // 判断是否含有已回复和已反馈

  function showidtxt(tabletxt) {
    var statustxt;
    if (tabletxt.indexOf('已答复') != - 1 || tabletxt.indexOf('已反馈') != - 1)
    statustxt = 1;
     else statustxt = 0;
    return statustxt;
  } //执行含有pro或者plus等,ppkey表示仅显示的内容

  function ppshowget(jxNo, XhNo) {
    //alert(jxNo+"机型，286 显示状态为  "+XhNo);
    var ppkey = 'pro';
    var ppkey1 = 'plus';
    var ppkey2 = '保时捷';
    var ppkey3 = 'm9p';
    var ppkey4 = 'p9p';
    var ppkey5 = '啤酒瓶';
    var ppkey6 = 'por';
    var listidgai,
    listidtable,
    listleng,
    Thtml,
    tstut,
    tstut2,
    km2,
    titlestr,
    jxget,
    showif;
    //alert("欢迎使用特部插件");
    listidgai = document.getElementById('threadlisttableid');
    listidtable = listidgai.childNodes;
    listleng = listidtable.length / 2 + 1;
    if (listidtable.length > 3) {
      for (var k = 1; k < listleng; k++) {
        km2 = 2 * k + 1;
        //alert(listidtable[km2]);
        Thtml = listidtable[km2];
        if (Thtml.getElementsByTagName('a') [3]) {
          titlestr = Thtml.getElementsByTagName('a') [3].innerHTML;
          //alert(titlestr);
          tstut = showidpro(titlestr, ppkey) + showidpro(titlestr, ppkey1) + showidpro(titlestr, ppkey2) + showidpro(titlestr, ppkey3) + showidpro(titlestr, ppkey4) + showidpro(titlestr, ppkey5) + showidpro(titlestr, ppkey6);
          tstut2 = showidtxt(Thtml.innerHTML);
          //alert(tstut); 
          //alert(tstut2);
          if (tstut > 0) jxget = 2;
           else jxget = 1;
          //alert(tstut2);
          showif = ppshowkaixuan(jxNo, XhNo, jxget, tstut2);
          showidgz3(Thtml, showif);
        }
      }
    }
  } //判断是否含有pro或者plus等,ppkey表示仅显示的内容
  //机型隐藏，反之显示

  function ppshowkaixuan(jx, display, jxget, huifuget) {
    var pdzhi = 1; //显示该条记录
    if (jx == jxget) {
      if (display == 1) {
        if (huifuget == 1) {
          pdzhi = 2; //不显示。  
          //alert(huifuget);
        } 
        else pdzhi = 1;
      } 
      else pdzhi = 1; //显示。
    } 
    else {
      pdzhi = 2
    }
    return pdzhi;
  }
  function ppshow() {
    //var xunhuanNo1 = 0;
    xunhuanNo = xunhuanNo % 4 + 1; //总循环次数，jx循环，显示循环。1 机型1 无回复 2机型2 无回复 3机型2有回复 4机型1有回复
    var jxNo,
    XhNo,
    gaizhanshowNo;
    jxNo = xunhuanNo % 3;
    if (jxNo != 1) jxNo = 2; //1为机型1，2为机型2
    if (xunhuanNo > 2) XhNo = 2;
     else XhNo = 1; //1为筛选，2为不筛选。
    gaizhanshowNo = xunhuanNo % 2;
    //alert(xunhuanNo);
    var jxget = getpageJx(1);
    var JXnamme;
    if (getJxFx(jxget) > 0) { //双机型栏目 
      JXnamme = getJxstr(jxget, jxNo); // 机型1
      if (XhNo == 1) JXnamme = JXnamme + '筛选';
       else JXnamme = JXnamme + '全显';
      ppshowtxt(JXnamme);
      ppshowget(jxNo, XhNo);
    } 
    else {
      //alert(gaizhanshowNo);
      if (gaizhanshowNo > 0)
      ppshowtxt('全显');
       else ppshowtxt('筛选');
      gaizhanshow(gaizhanshowNo);
    }
  } // ppshowtxt文字变化

  function ppshowtxt(txt) {
    //alert("aaaaaaa");
    var ppshowtxt = document.getElementById('scrolltop').getElementsByTagName('a') [0];
    ppshowtxt.style = 'background-image: none;height: 36px;  width: 44px; padding: 3px;';
    ppshowtxt.innerHTML = txt;
  }
  function showidpro(tabletxt, proplus) {
    var statustxt;
    if (tabletxt.toLowerCase().indexOf(proplus) != - 1)
    statustxt = 1;
     else statustxt = 0;
    return statustxt;
  } ///////////////////////////2016.12.17 增加合并机型分析//////////

  function getJxFx(str) { //判断是否是合并机型
    var JxFx;
    if (str.indexOf('/') != - 1 || str.indexOf('系列') != - 1)
    JxFx = 1;
     else JxFx = 0;
    //alert(JxFx);
    return JxFx;
  }
  function getJxstr(str, n) { //分别提取机型
    var JxFx;
    //alert(str);
    if (str.indexOf('/') != - 1) {
      if (n == 1)
      JxFx = str.substring(0, str.indexOf('/'));
       else JxFx = str.substring(str.indexOf('/') + 1);
    } //alert(JxFx);/分割情况
     else if (str.indexOf('系列') != - 1) {
      str = str.substring(str.indexOf('M'));
      if (n == 1)
      JxFx = str.substring(0, str.indexOf('系列'));
       else JxFx = str.substring(0, str.indexOf('系列')) + ' pro';
    } //alert(JxFx);/分割情况
     else JxFx = str;
    return JxFx;
  } //判断是否为机型合并页面

  function getpageJx(n) { //1为列表页判断，2为内容页判断
    var pagejx;
    if (n == 1) {
      pagejx = document.getElementsByTagName('h1') [0].innerHTML;
      //alert(pagejx); 
    } 
    else {
      pagejx = document.getElementById('pt').getElementsByTagName('a') [3].innerHTML;
      //alert(pagejx.length); 
    }
    return pagejx
  } // 显示与否切换

  function showidgz(nd) {
    if (nd.display == 'none')
    nd.style = 'display:';
     else nd.style = 'display:none';
  } // 显示与否3种模式

  function showidgz3(nd, n) {
    if (n == 1)
    nd.style = 'display:';
     else nd.style = 'display:none';
  } ////////////////////2016.8.9 列表页加入下一页悬浮功能和只显示未盖章功能/////////////////////////////

  function murlTopcurl(murl) {
    var pcurl;
    if (murl.indexOf('.html') > 1) {
      if (murl.indexOf('forum.html') > 1) pcurl = 'http://club.huawei.com/forum.php?mobile=no';
       else pcurl = murl;
    } 
    else if (murlTofenlei(murl).indexOf('rum') > 1) //列表
    //http://club.huawei.com/forumuniversal-fid-2567-filter-author-orderby-dateline-typeid-4197.html
    pcurl = 'http://club.huawei.com/forumuniversal-fid-' + murlToId(murl, '&fid=') + '-filter-author-orderby-dateline-typeid-4197.html';
     else //http://club.huawei.com/thread-11768591-1-1.html
    pcurl = 'http://club.huawei.com/thread-' + murlToId(murl, '&tid=') + '-1-1.html';
    //alert(pcurl);
    return pcurl;
  } ////////将移动版页面转化成pc端页面/////////////////////////////

  function murlTofenlei(murl) {
    var mfenlei;
    //alert(murl);
    if (murl.indexOf('viewthread') > 2) mfenlei = 'thread';
     else if (murl.indexOf('forumdisplay') > 2) mfenlei = 'forum';
    return mfenlei;
  } ////////将移动版页面转化成pc端页面 区分类型///////////

  function murlToId(murl, mbegin) {
    var mid;
    murl = murl.substring(murl.indexOf(mbegin) + 5);
    mid = murl.substring(0, murl.indexOf('&'));
    return mid;
  } ////////将移动版页面转化成pc端页面获得id///////////

  function Getpcstatus() {
    //判断是否是pc版本，如果不是，自动访问一次 http://club.huawei.com/forum.php?mobile=no，如果是，则继续。
    var urlget = window.location.href;
    //alert(urlget);
    /* if (urlget.indexOf('mobile=no') < 1 &&urlget.indexOf('mobile') > 1 && urlget.indexOf('huafans') < 1 && urlget.indexOf('uploadiframe') < 1 && urlget.indexOf('huawei') > 1) {

      //alert(urlget);
      mywin=window.open('http://club.huawei.com/forum.php?mobile=no');
      mywin.close();
      //alert('松树帮你切换回电脑版');
      //window.close();
    }*/
  
    var botpcban;
    botpcban = document.getElementsByClassName('ft');
    if (botpcban[0] && urlget.indexOf('vmall') < 1) {
      //alert('松树帮你切换回电脑版');
      window.location.href = murlTopcurl(urlget);
      mywin = window.open('http://club.huawei.com/forum.php?mobile=no');
      alert(window.location.href + '松树帮你切换回电脑版');
      mywin.close();
    } /////

  }
  var xunhuanNo = 0;
  var page_bottom_N;
  page_bottom_N = document.getElementsByClassName('nxt');
  if (page_bottom_N[1]) {
    page_bottom_N[1].style = 'font-size: 18px;padding:0px;width:56px;left: auto;right: 0; position: fixed;bottom:90px;background:#28c0c6;border:1px #cdcdcd solid;';
  } ////////////////////2016.8.5 增加列表页的自动刷新功能，增加刷新按钮、/////////////////////////

  function strtoshuzu(str, str2) {
    var strs;
    strs = str.split(str2);
    return strs;
  } //字符串转为数组
  //////////////获得id以及加密//////////////////////////////

  var timeTT;
  function IDcheakkey() {
    var mymenuget,
    quanxianget; //检查是否有抢购权限
    mymenuget = document.getElementById('mymenu');
    //alert(mymenuget.innerHTML);
    if (mymenuget) {
      var ssidkey = getCookie('IDkey');
      ///alert(ssidkey);
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
      //alert(c_start);
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
  function postcall(url, params, target) { //// js模拟表单 
    var tempform = document.createElement('form');
    tempform.action = url;
    tempform.method = 'post';
    tempform.style.display = 'none'
    if (target) {
      tempform.target = target;
    }
    for (var x in params) {
      var opt = document.createElement('input');
      opt.name = x;
      opt.value = params[x];
      tempform.appendChild(opt);
    }
    var opt = document.createElement('input');
    opt.type = 'submit';
    tempform.appendChild(opt);
    document.body.appendChild(tempform);
    tempform.submit();
    document.body.removeChild(tempform);
  } ////    postcall( 'newAnime', {page_num:1,page_size:10});   或 添加链接打开方式：    postcall( 'newAnime', {page_num:1,page_size:10}, '_blank');  

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
    var sdshow = document.getElementById('shangdianmass').getElementsByTagName('table');
    disnum = disnum % 2 + 1;
    if (disnum > 1)
    sdshow[0].style.display = 'none';
     else
    sdshow[0].style.display = '';
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
  }
  function sdtime() { // 计时器
    var listvaluestr = getCookie('sdlist');
    if (!listvaluestr) {
      //alert('707:' + listvaluestr);
      setsdlist();
    } 
    else {
      console.log(listvaluestr);
      //模拟数据从cookie拿到的数据 
      //alert('713:' + listvaluestr);
      var strvalue = JSON.parse(listvaluestr);
      var Mtime = new Date();
      var ftimestr,
      Mtimestr;
      Mtime = '160000';
      if (strvalue != null && strvalue != '') {
        Mtime = strvalue.listtime;
        Mtime = Mtime.substring(Mtime.indexOf('2017') + 11);
        var qgbody = '<link rel="stylesheet" type="text/css" href="source/plugin/auction/template/css/auction.css"> <form id="auctionform" action="plugin.php?id=auction:involve&amp;operation=join&amp;tid=<listid>" method="post" name="auctionform" onsubmit="return changeStatus();">     <input type="hidden" name="formhash" value="34913457dc9379b77e11">   <div id="main_message">         <h3 class="flb">出价信息确认</h3>                 <div class="auction-info">                     <div class="auction-price">您当前的花瓣余额为<font color="#28C0C6">9999999</font>，兑换后余额为<font color="#28C0C6">99999</font>。请准确填写您的真实信息，以便花部长尽快寄送给您！若奖品为虚拟礼品请在留言中提供礼品兑换所需相关信息。（如QQ号）</div>                     <div class="auction-pic">                 <div class="gl-item">                                     <a  href="/" title="<listname> ... ...">                         <div class="auction-img-container" style="background:url(http://s.huafans.cn/template/hw_fans/image/zh//css/img/huaweilogo.png) no-repeat center;background-size:contain;"><div class="img-mask"></div></div>                     </a>                     <div class="gli-cont">                         <a class="auc-name" href="thread-<listid>-1-1.html" title="<listname> ... ..."><listname> ... ...</a>                         <div class="glic-bar">                             <p >                                 <em id="timeleft" class="auc_title"></em>                             </p>                         </div>                         <p class="auc-price">                                                         <listpri><em class="auc-price-count">花瓣</em>                                                     </p>                     </div>                                 </div>             </div>         </div>     </div>     <div class="personal-info">         <h3 class="plb">填写收货信息</h3>        <table style="margin-left: 50px">            \t <tr>                 \t <th class="adt-th"><font color="f25650">*&nbsp;&nbsp;</font>收货人</th>                 <td><input type="text" class="adt-txt" id="realname" name="realname" maxlength="30"/><span id="mn_check"></span><div class="auc-hint"></div></td>             </tr>    \t \t<th class="adt-th"><font color="f25650">*&nbsp;&nbsp;</font>联系电话</th>                 <td><input name="mobile" id="mobile" class="adt-txt px" maxlength="11" type="text"><span id="mb_check"> <img src="source/plugin/auction/template/images/ok.png" class="vm" height="16" width="16"></span><div class="auc-hint" style="display: none;">请确认手机号码准确无误</div></td>       \t \t <tr>                 <th class="adt-th"><font color="f25650">*&nbsp;&nbsp;</font>收货地址</th> \t <td><input type="text" class="adt-txt adt-ta" id="address" name="address" maxlength="100" /><span id="ma_check"></span><div class="auc-hint"></div></td>             </tr>             <tr>                <th class="adt-last-th"><font color="f25650">&nbsp;&nbsp;&nbsp;&nbsp;</font>留言</th>                 <td><textarea name="auc_reply_message" id="message" class="adt-txt pt adt-last-txt" rows="3" maxlength="200"></textarea><span id="mm_check"></span><div class="auc-hint auc-hint-last">若奖品为虚拟礼品请提供所需信息<br>如：奖品为Q币时，请提供QQ号</div></td>             </tr>         </table>                 <input id="confirmsubmit" name="confirmsubmit" class="pn pnc confirmsubmit disable-submit" type="submit" value="确认兑换"/>     </div>     </form> </div>'
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
    } //alert(Mtime);

    return Mtime;
  }
  function showh6(htmstr) {
    var BTtime6 = document.getElementById('shangdianmass').getElementsByTagName('h6');
    BTtime6[0].innerHTML = htmstr;
  }
  function update(Ftime, Mtime) {
    //alert('ddddddd669   ' + Ftime);
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
    //alert(" 840   timetonum:    "+Dtime);
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
  function CHkpassloginWRT(strvalue) { //自动输入密码
    document.getElementById('login_password').value = strvalue;
    document.getElementById('randomCode').focus();
    //alert('ddddddd603');
  }
  function CHkpassloginRMB() { //自动记住密码
    var strvalue = document.getElementById('login_password').value;
    if (strvalue == null || strvalue == '') {
      alert('请先在密码处输入密码');
    } 
    else {
      setCookie('passlogin', strvalue, 365);
      document.getElementById('randomCode').focus();
    }
  } //记住密码

  function setsdlist() {
    //alert('1111 871');
    var listid = '请去选择即将抢购的产品';
    var listname = '请去选择即将抢购的产品';
    var listtime = '请去选择即将抢购的产品';
    var listtime2 = '请去选择即将抢购的产品';
    var listpri = '请去选择即将抢购的产品';
    var listjson = [
      {
        'listid': listid,
        'listname': listname,
        'listtime': listtime,
        'listtime2': listtime2,
        'listpri': listpri
      }
    ]
    var datajson = listjson[0];
    var jsonstr = JSON.stringify(datajson);
    setCookie('sdlist', jsonstr, 365);
    var htstr = getSdlistT();
    document.getElementById('sdshow').innerHTML = htstr;
    //alert(htstr + '887');
  }
  function jiarujishi() { //加入计时序列
    //alert( '895');
    var CJauc_involveA = CJauc_involve.getElementsByTagName('a') [0].getAttribute('href');
    var listid = getsdlistid(CJauc_involveA);
    var listname = getsdlistother(2);
    var listtime = getsdlistother(4);
    var listtime2 = getsdlistother(5);
    var listpri = getsdlistother(7);
    if (strvalue != null && strvalue != '')
    var listjson = [
      {
        'listid': listid,
        'listname': listname,
        'listtime': listtime,
        'listtime2': listtime2,
        'listpri': listpri
      }
    ]
    var datajson = listjson[0];
    var jsonstr = JSON.stringify(datajson);
    setCookie('sdlist', jsonstr, 365);
    var htstr = getSdlistT();
    document.getElementById('sdshow').innerHTML = htstr;
    //alert(htstr + '895');
  }
  function getsdlistid(str) { //获取sdlist的id
    str = str.substring(str.indexOf('tid=') + 4);
    return str;
  }
  function getsdlistother(n) { //获取sdlist的name time pri价格等
    var nn = parseInt(n);
    var listli = document.getElementsByClassName('aucdetail') [0].getElementsByTagName('li');
    var str = listli[nn].getElementsByTagName('em') [0].innerHTML;
    return str;
  }
  function getSdlistT() { //输出目前加入抢购的计时产品  或者竞拍
    var listvaluestr = getCookie('sdlist');
    console.log(listvaluestr);
    //模拟数据从cookie拿到的数据  
    var strvalue = JSON.parse(listvaluestr);
    var Mtime = new Date();
    var M2time = new Date();
    var htmstr = '';
    htmstr = strvalue.listname + '抢购时间：';
    Mtime = strvalue.listtime;
    M2time = strvalue.listtime2;
    //alert(Mtime+" "+M2time);
    Mtime = Mtime.substring(0+11);
    htmstr = htmstr + Mtime +'<br>结束时间：';
    htmstr = htmstr + M2time + '<br>  ' + strvalue.listpri + '花瓣   <a  target="_blank" href="http://club.huawei.com/plugin.php?id=auction:involve&operation=join&tid=' + strvalue.listid + '">>点此抢购</a>'
    return htmstr;
  }
  var login_passwordget,
  Wrtlogin_password; //一键输入密码 msg_password
  login_passwordget = document.getElementsByClassName('table-p') [0];
  if (!login_passwordget) {
    login_passwordget = document.getElementById('headContent');
    //alert(login_passwordget.innerHTML);
  }
  if (login_passwordget) {
    Wrtlogin_password = document.createElement('div');
    Wrtlogin_password.innerHTML = '<button   id="Squeren" style="left: auto;right: 0; position: fixed;bottom: 20px;background:#28c0c6;border:1px #cdcdcd solid;" name="Squeren" ><span style="font-size: 22px;">记录修改密码</span></button>';
    login_passwordget.insertBefore(Wrtlogin_password, login_passwordget.firstchild);
    document.getElementById('Squeren').addEventListener('click', CHkpassloginRMB, false); //确认登录信息
    var strvalue = getCookie('passlogin');
    if (strvalue != null && strvalue != '')
    {
      CHkpassloginWRT(strvalue);
    }
  }
  var wp_aucget,
  wp_aucwp,
  WrtMess; //花瓣商店
  wp_aucget = document.getElementById('auc_involve');
  if (!wp_aucget) {
    wp_aucget = document.getElementById('wp_auc');
  }
  //alert(wp_aucget);
  if (wp_aucget) {
    sdtime();
  }
  function showall(qgbody, mtime) { //显示抢购内容
    if (wp_aucget) {
      var chk = IDcheakkey();
      if (chk > 0) {
        WrtMess = document.createElement('div');
        WrtMess.className = 'wp';
        WrtMess.innerHTML = '<div id="shangdianmass" style="z-index:999;width: 302px;margin-top: 2px;left:70px;right:auto ; position: fixed;bottom: 10px;background:#eee;border:1px #cdcdcd solid;"><h3 class="plb">请提前填写收货信息</h3><h4 class="plb"></h4><h5 class="plb"></h5><h6 class="plb"></h6><h7 class="plb"></h7><table style="margin-left: 0px;display:none"><tr><th class="adt-th"><font color="f25650">*&nbsp;&nbsp;</font>收货人</th><td><input type="text" class="adt-txt" id="realname" name="realname" maxlength="30"/><span id="mn_check"></span><div class="auc-hint">姓名</div></td></tr><tr><th class="adt-th"><font color="f25650">*&nbsp;&nbsp;</font>联系电话</th><td><input type="text" name="mobile" id="mobile" class="adt-txt px" maxlength="11"/><span id="mb_check"></span><div class="auc-hint">请确认手机号码准确无误</div></td></tr><tr> <th class="adt-th"><font color="f25650">*&nbsp;&nbsp;</font>收货地址</th><td><input type="text" class="adt-txt adt-ta" id="address" name="address" maxlength="100" /><span id="ma_check"></span><div class="auc-hint">请填写详细地址</div></td></tr><tr> <th class="adt-last-th"><font color="f25650">&nbsp;&nbsp;&nbsp;&nbsp;</font>留言</th><td><textarea  style="height: 12px " name="auc_reply_message" id="message" class="adt-txt pt adt-last-txt" rows="1" maxlength="200"></textarea><span id="mm_check"></span><div class="auc-hint auc-hint-last">可请提供QQ号</div></td></tr></table> <button   id="Squeren" style="" name="Squeren" ><span style="font-size: 12px;">填写/修改</span></button><button   id="btmin" style="" name="btmin" ><span style="font-size: 12px;">合并/展开</span></button><button   id="bttime" style="" name="bttime" ><span style="font-size: 12px;">获取服务器时间</span></button>';
        wp_aucget.insertBefore(WrtMess, wp_aucget.firstchild);
        //alert("337");
        var strvalue = getCookie('realname');
        if (strvalue != null && strvalue != '')
        {
          var code = unescape('checkCookie%2528%2527realname%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527mobile%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527address%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527message%2527%2529%253B');
          code = unescape(code);
          eval(code);
        }
        document.getElementById('bttime').addEventListener('click', fuwqitime, false); //获取服务器时间
        document.getElementById('Squeren').addEventListener('click', shangdianset, false); //确认信息
        document.getElementById('btmin').addEventListener('click', shangdianbtmin, false); //缩小放大
        //输出信息填写框，提前填写
      } //main_message

    }
  }
  var main_messageget,
  WRTpersonal; //一键抽奖页面的填写内容
  main_messageget = document.getElementById('main_message');
  if (main_messageget) {
    var chk = IDcheakkey();
    if (chk > 0) {
      var code = unescape('checkCookie%2528%2527realname%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527mobile%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527address%2527%2529%253B%250A%2520%2520%2520%2520checkCookie%2528%2527message%2527%2529%253B');
      code = unescape(code);
      eval(code);
      //鼠标点击确认和点击提交。慎用。
      //.click()
      var getche_agree= document.getElementById('che_agree');
      var getconfirmsubmit= document.getElementById('confirmsubmit');//一键提交
      //alert(che_agree.checked);
      if(!che_agree.checked){
             getche_agree.click(); 
      }

      var getprice =document.getElementById('price');//如果竞拍，直接出价
      if (getprice){
          alert("竞拍直接出价，如果不想出价，请注释本行和下面一行。");
          //getconfirmsubmit.click();
          }
      else {
        
          //getconfirmsubmit.click();   //一键兑换，慎用。直接就兑换了，跳过确认过程。需要打开前面注释。
      }
      
      //自动填写内容
    }
  }
  var CJauc_involve,
  WRchujia; //花瓣商店物品 时间 价格 链接（写入缓存）
  CJauc_involve = document.getElementById('auc_involve');
  if (CJauc_involve) {
    //alert('854');
    var chk = IDcheakkey();
    if (chk > 0) {
      //checkCookie("sdlist");
      WRchujia = document.createElement('div');
      WRchujia.innerHTML = '<button id="jiaru" class="pn" name="jiaru" "><span style="width:80px;float:none;">计时</span></button><h3 id="sdshow" class="plb"></h3>';
      CJauc_involve.insertBefore(WRchujia, CJauc_involve.firstchild);
      var strvalue = getCookie('sdlist');
      if (strvalue != null && strvalue != '')
      {
        //alert('916');
        var htstr = getSdlistT();
        document.getElementById('sdshow').innerHTML = htstr;
      }
      document.getElementById('jiaru').addEventListener('click', jiarujishi, false); //加入计时。
      //输出信息填写框，提前填写
    } //main_message
    //自动填写内容

  }
  var SXorderby,
  SXorderbyfn;
  var xunhuanNo = 0;
  SXorderby = document.getElementById('threadlist');
  if (SXorderby) {
    SXorderbyfn = document.createElement('div');
    SXorderbyfn.innerHTML = '<button onclick="window.location.reload()" id="SXordb" style="font-size: 22px;left: auto;right: 0; position: fixed;bottom: 20px;background:#28c0c6;border:1px #cdcdcd solid;" name="SXordb" ><span style="font-size: 22px;">刷新</span></button> <button   id="ppshow" style="font-size: 22px;left: auto;right: 0; position: fixed;bottom: 55px;background:#28c0c6;border:1px #cdcdcd solid;" name="ppshow" ><span style="font-size: 22px;">切换</span></button>';
    SXorderby.insertBefore(SXorderbyfn, SXorderby.firstchild);
    document.getElementById('ppshow').addEventListener('click', ppshow, false); //筛选机型
    //document.getElementById("ppshow").addEventListener('click',gaizhanshow,false);//筛选机型
    ////////////////////2016.12.16 列表页加入mate9和mate9 pro筛选功能/////////////////////////////
    //alert(xunhuanNo);
    gaizhanshow(xunhuanNo);
  } //添加 添加一键改盖章已反馈按钮/一键反馈贴直达

  var modmenut,
  AnYihuifu;
  modmenut = document.getElementById('modmenu');
  if (modmenut) {

    AnYihuifu = document.createElement('div');
    AnYihuifu.innerHTML = '<div  style="margin-top: 2px;left:70px;right:auto ; position: fixed;bottom: 10px;background:#28c0c6;border:1px #cdcdcd solid; ">  <button id="gethuifu"  name="gethuifu" ><span style="font-size: 22px;margin:3px;">回复章</span></button><button id="getfankui"  name="getfankui" ><span style="font-size: 22px;margin:3px";>反馈章</span></button><button id="getfankuitie"  name="getfankuitie" ><span style="font-size: 22px;margin:3px;">反馈直达</span></button> </div>';
    modmenut.insertBefore(AnYihuifu, modmenut.firstchild);
    //响应一键盖章已回复按钮 添加一键盖章已反馈按钮
    modmenut.getElementsByTagName('a') [0].style = 'display:none;';
  } //添加 添加一键改盖章已反馈按钮
  //modaction('stamp'); //弹出盖章窗口；

  var hfkuanghi;
  hfkuanghi = document.getElementById('fastpostmessage'); //alert(hfkuanghi);
  if (hfkuanghi) {
    hfkuanghi.style = 'height: 96px;';
    hfkuanghi.parentNode.style = 'height: 96px;';
  }
  Getpcstatus();
  document.getElementById('gethuifu').addEventListener('click', yijianyihuifutime, false); //默认已回复;
  document.getElementById('getfankui').addEventListener('click', yijianyifankuitime, false); //改反馈
  document.getElementById('getfankuitie').addEventListener('click', yijianfankuitie, false); //反馈贴直达

}) ();
