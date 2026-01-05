// ==UserScript==
// @name 			网盘自动填写密码【增强版】【已停止维护】
// @description		网盘自动填写提取密码【增强版】+网盘超链接与提取码融合。\n（该脚本已停止维护，推荐使用效果更好的【威力加强版】：https://greasyfork.org/zh-CN/scripts/29762 。\n本脚本会强制推送一次新版本，如果你选择了不再推送，只要不清除浏览器数据理论是不会再推送了）
// @author			极品小猫
// @namespace   	http://www.cnblogs.com/hkmhd/
// @homepage		https://greasyfork.org/scripts/13463
// @supportURL		https://greasyfork.org/scripts/13463/feedback
// @version			2.5.7
// @date			  2015.10.30
// @modified		2018.02.25
// 
// 支持的网盘
// @include     	http://*
// @include			https://*
// @include			http://pan.baidu.com/s/*
// @include			http://eyun.baidu.com/s/*
// 
// 白名单
// @exclude			http*://*.pcs.baidu.com/*
// @exclude			http*://*.baidupcs.com/*
// @exclude			http*://*:8666/file/*
// @exclude			http*://*.baidu.com/file/*
// @exclude			http*://index.baidu.com/*
// 
// @exclude			http*://*.gov/*
// @exclude			http*://*.gov.cn/*
// @exclude			http*://*.taobao.com/*
// @exclude			http*://*.tmall.com/*
// @exclude			http*://*.alimama.com/*
// @exclude			http*://*.jd.com/*
// @exclude			http://*.ctrip.com/*
// @exclude			https://*.evernote.com/*
// @exclude			https://*.yinxiang.com/*
// @exclude			/^https?://(localhost|10\.|192\.|127\.)/
// @exclude			/https?://www.baidu.com/(?:s|baidu)\?/
// @exclude			http*://www.zhihu.com/question/*/answers/created
//
// require			http://code.jquery.com/jquery-2.1.4.min.js
// @require			http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant			unsafeWindow
// @grant			  GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @encoding		utf-8
// @run-at			document-idle
// @downloadURL https://update.greasyfork.org/scripts/13463/%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81%E3%80%90%E5%A2%9E%E5%BC%BA%E7%89%88%E3%80%91%E3%80%90%E5%B7%B2%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/13463/%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81%E3%80%90%E5%A2%9E%E5%BC%BA%E7%89%88%E3%80%91%E3%80%90%E5%B7%B2%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4%E3%80%91.meta.js
// ==/UserScript==

var urls=location.href;
var hash=location.hash;
var host=location.hostname.replace(/^www\./i,'').toLowerCase();
var paths=location.pathname.toLowerCase();
unsafeWindow.eve = Event;

var CatPW_Manage_old;
if(GM_getValue('CatPW_Manage_old')=='undefined'||GM_getValue('CatPW_Manage_old')==undefined) {
  CatPW_Manage_old={'updataTips':false,'dontPush':false,'Date':Dates()};
  GM_setValue('CatPW_Manage_old', CatPW_Manage_old);
} else {
  CatPW_Manage_old=GM_getValue('CatPW_Manage_old');
}

if(!CatPW_Manage_old.updataTips) {
    var updata=confirm('感谢您对“网盘自动填写密码【增强版】”的支持\n由于该版本已经停止维护，建议你安装效果更好的“网盘自动填写密码【威力加强版】”，点击“确定”前往安装新版本。');
    CatPW_Manage_old.updataTips=true;

    if(updata) {
      CatPW_Manage_old.dontPush=true;
      GM_setValue('CatPW_Manage_old', CatPW_Manage_old);
      GM_openInTab('https://greasyfork.org/zh-CN/scripts/29762',{'active':true});
    } else {
      var DontPushTips=confirm('如果你不愿意进行更新，点击“确定”，“以后”将不再提示新版本推送。（除非清除浏览器数据）');
      if(DontPushTips) {
        CatPW_Manage_old.dontPush=true;
        GM_setValue('CatPW_Manage_old', CatPW_Manage_old);
      }
    }
}

var site = {
  'baidu.com':{
    chk:	/^[a-z0-9]{4}$/,
    code:	'.pickpw input, #accessCode',
    btn:	'.g-button, #submitBtn, #getfileBtn',
    PreProcess: function() {	//已处理
      if(host=='eyun.baidu.com'){	//如果为百度企业云盘，则按照企业云盘的方式处理
        conf=site['baidu.com']=site['eyun.baidu.com'];
        site['baidu.com'].PreProcess();
      }
    }
  },
  'eyun.baidu.com': {
    chk:	/^[a-z0-9]{4}$/,
    code:	'.share-access-code',
    btn:	'.g-button-right',
    PreProcess: function() {
      if((hash&&!/sharelink|path/i.test(hash))&&!/enterprise/.test(paths)) {
        console.log('test');
        location.href=location.href.replace(location.hash,'');
      }
    }
  },
  'weiyun.com': {
    chk: /^[a-z0-9]{4}$/i,
    code: '#outlink_pwd',
    btn:  '#outlink_pwd_ok'
  },
  'pwdRule' : /(?:提取|访问)[码碼]?\s*[:： ]?\s*([a-z\d]{4})/,			//常规密码
  'codeRule' : /(?:(?:提取|访问|密[码碼]|艾|Extracted-code)[码碼]?)\s*[:： ]?\s*([a-z\d]{4})/i,	//其它类型的密码
  //跳转链预处理
  'JumpUrl' : {
    'sijihuisuo.club': {
      href: $('.down-tip A[href^="https://www.sijihuisuo.club/go/?url="]'),
      url: 'https://www.sijihuisuo.club/go/?url='
    }
  },
  //密码融合需要特殊支持的网站
  'Support' : {
    'madsck.com':{
      path: /\/resource\/\d+/,
      callback:function(){
        var ID=$('.btn-download').data('id');
          $.ajax({
            "url":"http://www.madsck.com/ajax/login/download-link?id="+ID,
            method: "GET",
            dataType: "json",
            success:function(e){
              var res=e.resource;
              $('.btn-download').css('display','none');
              $('<a>').attr({'href':res.resource_link+'#'+res.fetch_code,'target':'blank','class':'btn-download'}).css({'line-height':'60px','text-align':'center','font-size':'24px'}).text('下载').insertBefore('.btn-download');
              console.log(e);
            }
          })
      }
    },
    'idanmu.co': {
      path : /storage\-download/i,
      callback : function(){
        $('.input-group').each(function(){
          $(this).text($(this).text()+$(this).find('input').val());
        });
      }
    },
    'shaoit.com': {
      path : /.*/i,
      callback : function(){
        var LinkParent=$('A[href*="pan.baidu.com"],A[href*="eyun.baidu.com"]').parent();
        var ParentHTML=LinkParent.html();
        site['codeRule']=/\s*(shaoit|[a-z\d]{4})((?:\s*|<br>)$)/i;
          var HtmlArr=ParentHTML.match(/.*(?: \/|\s*$|<br>)/ig);
          for(i=0;i<HtmlArr.length;i++){
            if(/<\/a>\s*([a-z\d]{4}|shaoit) \//i.test(HtmlArr[i])){
              HtmlArr[i]=HtmlArr[i].replace(/(href="[^"]+)("[^>]*?>(?!<\/a>).+?<\/a>\s*(shaoit|[a-z\d]{4}))/ig,'$1#$3$2');
            } else if(site['codeRule'].test(HtmlArr[i])){
              var PWcode=HtmlArr[i].match(site['codeRule'])[1];
              HtmlArr[i]=HtmlArr[i].replace(/(href="[^"]+?)"/ig,'$1#'+PWcode+'"');
            }
          }
          LinkParent.html(HtmlArr.join(''));
        
      }
    },
    'xunyingwang.com':{
      path:/movie/i,
      callback:function(){
        $(window).load(function(){
          $('A[href*="pan.baidu.com"],A[href*="eyun.baidu.com"]').each(function(){
            $(this).attr('href',$(this).attr('href')+'#'+$(this).next("strong").text())
          })
        })
      }
    },
    'huhupan.com':{
      path:/e\/extend\/down/i,
      callback:function(){
        var _Linktmp=$('A[href*="pan.baidu.com"],A[href*="eyun.baidu.com"]');
        var _PWtmp=$('input[id^="bdypas"]');
        for(i=0;i<_Linktmp.length;i++){
          _Linktmp[i].href+="#"+_PWtmp[i].value;
        }
      }
    },
    'reimu.net': {
      path: /archives/i,
      callback: function(){
        site['codeRule']=/(?:(?:提取|访问|密[码碼])[码碼]?)\s*[:： ]?\s*([a-z\d]{4}|8酱)/i
      }
    }
  }
};

var hostName = location.host.match(/\w+\.\w+$/)[0].toLowerCase();	//提取当前网站主域名（网盘填充密码用）
var conf = site[hostName];											//设置主域名

var HostArr = [];									//生成域名数组
for(var i in site) HostArr.push(i);					//插入域名对象数组
var HostExp = new RegExp(HostArr.join("|"),'i');	//生成校验超链接的正则

//console.log(site.JumpUrl[host]);

/* -----===== 检查是否需要处理跳转链 Start =====----- */

if(site['JumpUrl'][host]){
  console.log(site['JumpUrl'][host]['href'])
  site['JumpUrl'][host]['href'].each(function(){
    console.log(site['JumpUrl'][host]['rep'])
    $(this).attr({'href':decodeURIComponent($(this).attr('href').replace(site['JumpUrl'][host]['url'],'')),'target':'blank'});
  });
}
/* -----===== 检查是否需要处理跳转链 End =====----- */


if(conf&&!/zhidao.baidu.com/i.test(host)){	//网盘页面填密码登录
  // 抓取提取码
  if(conf.PreProcess) conf.PreProcess();		//内容预处理（处理百度企业云）
  var sCode = hash.slice(1).trim();

  // 调试用，检查是否为合法格式
  if (!conf.chk.test(sCode)) {
    console.log('没有 Key 或格式不对');
  } else {
    console.log ('抓取到的提取码: %s', sCode);
  }

  // 加个小延时
  setTimeout (function () {
    // 键入提取码并单击「提交」按钮，报错不用理。
    var codeBox = $(conf.code),
        btnOk = $(conf.btn);
    if(codeBox.length>0) {		//存在密码框时才进行密码提交操作
      codeBox.val(sCode);		//填写验证码
      if (conf.preSubmit)
        if (conf.preSubmit (codeBox, btnOk))
          return ;
      btnOk.click();
    }
  }, 10);
} else {
  //密码融合 特别支持的网站
  if(site['Support'][hostName]&&site['Support'][hostName]['path'].test(paths)) {
    site['Support'][hostName].callback();
  }
  //监听 A 标签点击事件
  $('body').on('click', 'a', function () {
    var target=this;
    //如果超链接已有 hash 则跳过
    if(this.hash) return;
    //如果目标对象为百度企业盘，提升密码匹配范围，以兼容百度企业云
    if(/eyun.baidu.com/i.test(this.href)) {
  		site['pwdRule']=/(?:提取|访问)[码碼]?\s*[:： ]?\s*([a-z\d]{4,14})/;
  		site['codeRule']=/(?:(?:提取|访问|密[码碼]|Extracted-code)[码碼]?)\s*[:： ]?\s*([a-z\d]{4,14})/i;
    }
    //var target=event.target.tagName==='A'?event.target:event.target.parentNode;
   	
    //正则校验超链接匹配的网盘
    if(HostExp.test(this.href)&&!/(?:tieba)\.baidu\.com/i.test(this.href)){
      
      
      if(site['codeRule'].test(target.textContent)){
        console.log('在当前超链接的对象中查找密码');
        target.href+='#'+extCode(target);
      } else if(target.nextSibling&&site['codeRule'].test(target.nextSibling.textContent)){
        console.log('密码在超链接后面的兄弟元素中',target.nextSibling.textContent);
        if(!/#/i.test(target.href)) target.href+='#'+extCode(target.nextSibling);
      } else if(site['pwdRule'].test(target.parentNode.textContent)){
        console.log('从父对象中查找密码');
        if(!/#/i.test(target.href)) target.href+='#'+extCode(target.parentNode);
      } else {
        var i = 0,
            maxParent = 5,	//向上遍历的层级
            parent = target;
        while(i<maxParent) {
          i++;									//遍历计数
          parent = parent.parentNode;			//取得父对象
          console.log('遍历上级目录查找密码：'+ i,parent);
          if(parent.tagName=="TR") {				//如果父对象是表格，则从表格中提取密码
            if(site['codeRule'].test(parent.nextElementSibling.textContent)) {
              parent=parent.nextElementSibling;
              //console.log('表格中查找密码成功！',parent);
              target.href+='#'+extCode(parent);
              break;
            }
          } else if(site['codeRule'].test(pw=parent.nextSibling.textContent)){
            console.log('向上遍历查找，在超链接后面的兄弟元素中，',parent.nextSibling);
            target.href+='#'+extCode(parent.nextSibling);
            break;
          } else if(site['codeRule'].test(parent.textContent)) {		//否则按照常规方式提取密码
            console.log('向上遍历查找密码成功！');
            target.href+='#'+extCode(parent);
            break;
          }
          if(parent==document.body) break;								//如果已经遍历到最顶部
        }
      }
      //console.log(site['codeRule']);
            //旧的从父对象中遍历方式
            //console.log('从 document.body 中查找密码');
            //if(!/#/i.test(target.href)) target.href+='#'+extCode(document.body);
    }
  });
}

function extCode(obj){
  text=obj.textContent.trim();
  return site['pwdRule'].test(text)?text.match(site['pwdRule'])[1]:text.match(site['codeRule'])[1];	//首先尝试使用 提取码|访问码 作为密码匹配的关键字，无效时则使用更完整的匹配规则
}

function Dates(){
  var sDate=new Date();         ///获得系统日期
  var sYear=sDate.getFullYear();	//获得年份
  var sMonth=sDate.getMonth()+1;  //获得月份
  var sDay=sDate.getDate();     //获得日期
  return sYear+'/'+sMonth+'/'+sDay;
}