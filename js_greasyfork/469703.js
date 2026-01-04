function isMobile() {
let flag= false;
if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
 flag= true;
}
return flag
}

 function aerads() { 
$('a, i, span').each(function() {
  var text = $(this).text().trim();  
  if (text == '广告') {
var thisparent=$(this).parent();
thisparent.remove();

  }
}); 

}

     function Passiveads() { 
     if (GM_info.script.namespace!="Z3JlYXN5Zm9yaw=="){ 
return
}
     	  aerads()
     	 $("iframe[src*='//googleads']").remove();
$("div[data-type='GoogleRender']").remove();
$(".adsbygoogle").remove();
$("#bottomads").remove();
$("script[src*='adsbygoogle.js']").remove();
$("script[src*='g.doubleclick.net']").remove();
$("script[src*='pos.baidu.com']").remove();
$("iframe[src^='https://g.163.com']").remove();
$("div[id*='google_ads']").remove();
$("div[data-google-query-id]").remove();
$("iframe[src*='pos.baidu.com']").remove();
$("iframe[src*='show-3.mediav.com']").remove();
$("div[class*='wwads-cn wwads']").remove();

    	var kgpingbiswhitezt=true;
 var kgpingbiswhiteurl = [
"recaptcha.google",
"captcha.qq.com",
"alicdn.com",
"aliyun.com",
"quark.cn",
"taobao.com",
"mall.com",
"weibo.com",
".le.com",
"iqiyi.com",
"tudou.com",
"qq.com",
"douyin.com",
"javascript:",
"youku.com",
"sohu.com",
"pptv.com",
"twitter.com",
"facebook.com",
"instagram.com",
"tiktok.com",
"imdb.com",
"vk.com",
"mtv.com",
"56.com",
"ku6.com",
"cntv.cn",
"cctv.cn",
"mgtv.com",
"yinyuetai.com",
"wasu.cn",
"163.com",
"1905.com",
"xunlei.com",
"funshion.com",
"youhui",
"pornhub.com",
"youtube.com",
"bilibili.com",
"mama.com",
"zhihu.com",
"baidu.com"];


var whiteHosts = [
  'suning.com',
  'vip.com',
  'jd.com',
  'taobao.com',
  'mall.com'
];


if (whiteHosts.some(function (host) {
  return location.hostname.indexOf(host) > -1;
})) {
  kgpingbiswhitezt = false;
}
var inputList = $("input").filter(":visible");

inputList.each(function() {
  var $this = $(this);
  var placeholder = $this.attr('placeholder') || '';
  if ($this.attr('name') === 'username' ||
      $this.is('[type="password"]') ||
      $this.attr('name') === 'password' ||
      $this.attr('type') === 'email' ||
      $this.attr('name') === 'email' ||
       $this.attr('type') === 'phone' ||
      $this.attr('name') === 'code' ||
      $this.attr('name') === 'phone' ||
      placeholder.indexOf('手机') !== -1 ||
      placeholder.indexOf('邮箱') !== -1 ||
      placeholder.indexOf('账号') !== -1 ||
      placeholder.indexOf('密码') !== -1 ||
      placeholder.indexOf('注册') !== -1) {
    kgpingbiswhitezt = false;
    return false;
  }
});
 //说明：此处是为了匹配某些网站登陆时插件错误屏蔽登陆验证的页面需要，防止不能正常登陆。并无没有收集用户的任何信息
 var classNames = ['data-down-ui', 'data-down-ui1', 'data-down-ui2'];
for (var i = 0; i < classNames.length; i++) {
    var className = classNames[i];
    if (document.getElementsByClassName(className).length > 0) {
      kgpingbiswhitezt = false;
        return;
    }
}
 
 if ( kgpingbiswhitezt){
 	  let iframehost=window.location.host;


 $("iframe").each(function(index){

 	var iframeon=0;

 	  	 if ($(this).attr("src")){
 	  	 	 let iframesrc=$(this).attr("src");
 	   for(let i = 0; i < kgpingbiswhiteurl.length; i++) {
      	  	   if (iframesrc.indexOf(kgpingbiswhiteurl[i])>=0){
      	  	   	   kgpingbiswhitezt=false;
      	  	   	   }
      }

 	  	   if ($(this).attr("src").indexOf("http")==0 && window.location.href.indexOf("tool")<0 && window.location.href.indexOf("video")<0  && $(this).attr("src").indexOf("video")<0 &&  $(this).attr("src").indexOf("?url=")<0 && $(this).attr("src").indexOf(iframehost)<0 && kgpingbiswhitezt){
 	  	   	     $(this).remove();
 	  	   	      iframeon=1;
 	  	  }
 	  	 	 }
 if ( iframeon==0){
	       try {
    var inputElements = $(this).contents();
    try {
      var inputLength = inputElements.find('input').length;
       var textareaLength = inputElements.find('textarea').length;
       var imgLength = inputElements.find('img').length;
       var videoLength = inputElements.find('video').length;
      var bodyText = inputElements.find('body').first().text();
      var bodyTextLength =bodyText.length;
 if (inputLength > 0 || textareaLength > 0   || imgLength==0 || videoLength>0  || bodyTextLength > 200) {
        kgpingbiswhitezt = false;
      }
      if (kgpingbiswhitezt){
var imgElements = inputElements.find('img');
  var maxImgElement = null;
  var maxImgArea = 0;

  imgElements.each(function() {
    var imgWidth = $(this).width();
    var imgHeight = $(this).height();
    var imgArea = imgWidth * imgHeight;
    if (imgArea > maxImgArea) {
      maxImgArea = imgArea;
      maxImgElement = this;
    }
  });

  var iframeWidth = $(this).width();
  var iframeHeight = $(this).height();
  var iframeArea = iframeWidth * iframeHeight;
  var imgWidth = $(maxImgElement).width();
  var imgHeight = $(maxImgElement).height();
  var imgArea = imgWidth * imgHeight;

  if (imgArea / iframeArea > 0.5) {
    $(this).remove();
     kgpingbiswhitezt = false;
  }
}
         if (kgpingbiswhitezt){
$(this).remove();
}
    } catch (error) {
      console.log('读取 iframe 失败');
    }

} catch (error) {
  console.log('第', index + 1, '个非同源的 iframe');
}

 	}
 		 	  })


function getImageSize(element) {
	 if (element.attr('kxtool') ) {
  	    return false;
	}
  if (element.prop('tagName') === 'HTML' || element.prop('tagName') === 'HEADER'  || element.prop('tagName') === 'BODY' || element.prop('tagName') === 'MAIN') {
  	    return false;
	}
	  var childElements = element.find("*");
  for (var i = 0; i < childElements.length; i++) {
    var childTag = $(childElements[i]).prop('tagName');

    if (childTag === 'HTML' || childTag === 'HEADER' || childTag === 'BODY'  || childTag=== 'MAIN') {
      return false;
    }
  }
  var $elem = element;
  var targets = [];
  if ($elem.prop('tagName') === 'IMG') {
    targets.push($elem);
  }

    var $imgs = $elem.find('img');
    if ($imgs.length > 0) {
      var maxWidth = 0;
      $imgs.each(function() {
        var width = $(this).prop('naturalWidth') || $(this).width();
        if (width > maxWidth) {
          maxWidth = width;
          targets.push($(this));
        }
      });
    }

  var $bgImgs = $elem.find('*').filter(function() {
    var style = getComputedStyle(this);
    return (
      style['background-image'] !== 'none' && style['background-image'] !== ''
    ) || (
      style['background'] && style['background'].includes('url(')
    );
  });
  if ($bgImgs.length > 0) {
    $bgImgs.each(function() {
      targets.push($(this));
    });
  }


  if (targets.length > 0) {
    var maxTarget = targets.reduce(function(max, target) {
      var width = target.width();
      return width > max.width ? {target: target, width: width} : max;
    }, {target: null, width: 0});

if (maxTarget.target) {
  return {
    width: maxTarget.width,
    tag: maxTarget.target.prop('tagName'),
    url: maxTarget.target.attr('src'),
    rl: maxTarget.target.attr('style'),
    height: maxTarget.target.height()
  };
}
  }

  return false;
}

var windowHeight = $(window).height();
var windowwidth= $(window).width() *0.8;
var removeHeight=200;
if (isMobile()){
	 removeHeight=150;
}
var datag=true;
    if (window.location.href.indexOf('dadi') >0 || window.location.href.indexOf('teng') >0 ) {
    	datag=false;
    }
    if (datag){
    	   	$('img').filter(function() {
  var $this = $(this);
  var offsetTop = $this.offset().top;
  return offsetTop >= 50 &&  $this.parents('picture').length === 0 &&  $this.width() >= windowwidth && $this.height() >10 && $this.height() <= removeHeight && $this.is(':visible');
}).remove();

$('[style*="position: fixed"]').add('*')
  .filter(function() {
    return ($(this).css('position') === 'fixed');
  })
  .filter(function() {
    var classes = $(this).attr('class');
    return (!classes || !classes.match(/\b.*nav.*\b/));
  })
  .filter(':visible')
  .not('form, input')
  .each(function() {
    var $this = $(this);
    var hasFormOrInput = $this.find('form, input').length > 0;
    if (hasFormOrInput) {
      return;
    }
    var $imgs = $this.find('img');
    if ($imgs.length === 0) {
      return;
    }
    var $maxImg = $imgs.eq(0);
    var divarea = $this.width() * $this.height();

    let getSize = getImageSize($this);
    if (getSize) {
      var IMGarea = getSize.width * getSize.height;
      if (IMGarea >= divarea * 0.8) { 
        $this.remove();
      } else {
        let Divthistext = /^\s*$/.test($this.text());
        if (Divthistext) {
          $this.remove();
        }
      }
    }
  });

}
		}
		
  }
  
  
  
  
  
  //=============
  
  
    var debugMode = false; // 是否处于调试模式
    var currentElement = null; // 当前鼠标所在的元素

	function ProactivelyadsBtn() {
			if (GM_info.script.namespace!="Z3JlYXN5Zm9yaw=="){ 
return
}
var butjc = GM_getValue('Proactivelyads', '0');
 if (butjc=='0'){
$('<div  id="debugBtnBtn"  style="position: fixed; top: 50px; right: 0; z-index: 9999; padding: 6px 12px; background: rgba(255, 255, 255, .7); cursor: pointer;    background-color: #e1e1e1;   border-radius: 10px;"><button id="debugBtn" style=" margin-right: 10px; border: none; border-radius: 10px;   background-color: #6175bd;  color: white;padding: 8px 10px;  font-size: 15px;display: initial;">调试模式</button><button id="debugresetBtn" style=" margin-right: 10px; border: none; border-radius: 10px;   background-color: #6175bd;  color: white;padding: 8px 10px;  font-size: 15px;display: initial;" > 恢复默认</button><button id="debugExitBtn"  style=" margin-right: 10px; border: none; border-radius: 10px;   background-color: #6175bd;  color: white;padding: 8px 10px;  font-size: 15px;display: initial;">退出</button></div>').appendTo(document.body);
}
}
    // 定义变量

    // 创建样式
  GM_addStyle(`
        .debug-mask {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, .5);
            z-index: 9998;
            display: none;
        }
.debug-border { border: 2px solid red !important; box-shadow: 0 0 5px rgba(0, 0, 0, .3) !important; position: relative; }

        `);

    // 鼠标移过元素时触发的事件
    function mouseOverHandler(event) {
        if (debugMode) {
            var elem = event.target;
            let tagName=$(elem).prop('tagName');
            	if ( tagName.includes("BODY")||tagName.includes("HTML")||tagName.includes("HEADER") ||tagName.includes("MAIN")){
		return
	}

            	 let targetid = $(elem).attr("id");
	  let targetclass = $(elem).attr("class");
	  if ($(elem).attr("mytool")){
	  return;
}
	  if (targetid){
	if (targetid=="debugBtn" || targetid=="debugBtnBtn" || targetid=="debugresetBtn" || targetid=="debugExitBtn"  || targetid=="mytoolzxmenu" || targetid=="mytoolzxmenu" || targetid=="mytoolzxmenuPage" ){
		return
	}
	}
	if (targetclass){
		if ( targetclass.includes("subItem")||targetclass.includes("menuItem")){
		return
	}
}

            if (currentElement !== elem) {
                hideDeleteBtn(currentElement);
                currentElement = elem;
                showDeleteBtn(elem);
            }
            elem.classList.add('debug-border');
        }
    }

    // 显示元素的删除按钮
    function showDeleteBtn(elem) {


    }

$("body").on('click', '#debugExitBtn', function(event) {
	     toastr.success('已退出！', '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
       
	debugMode = false;
	 hideDeleteBtn(currentElement);
        currentElement = null;
        document.body.removeEventListener('mouseover', mouseOverHandler, true);
            
 GM_setValue('Proactivelyads','1');
  $("#debugBtnBtn").remove();
    	});
    $("body").on('click', '#debugresetBtn', function(event) {
var domain = window.location.host;
var domainadValue = GM_getValue('domainad') || {};
delete domainadValue[domain];
GM_setValue('domainad', domainadValue);
    	 location.reload();
    	});
// 点击元素的删除按钮后的操作
$("body").on('click', '.debug-border', function(event) {
	toastr.success('已删除此元素！', '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
 
    event.stopPropagation(); // 阻止事件冒泡
    event.preventDefault(); // 阻止默认行为
    let targetid = $(this).attr("id");
    let targetclass = $(this).attr("class");
    if (targetid && (targetid == "debugBtn" || targetid == "debugresetBtn" || targetid == "mytoolzxmenu" || targetid == "mytoolzxmenuPage")) {
        return;
    }
    if (targetclass && (targetclass.includes("subItem") || targetclass.includes("menuItem"))) {
        return;
    }

   getAdFeatures(this);


  $(".debug-border").remove(); // 移除点击的元素
});

function updomainad(k) {
	    if (window.location.href.indexOf('dadi') >0 || window.location.href.indexOf('teng') >0 ) {
    return;
    }
	var domain = window.location.host;
var domainadValue = GM_getValue('domainad') || {};
  if (!domainadValue[domain]) {
    domainadValue[domain] = {};
  }
domainadValue[domain][k]  =true;
GM_setValue('domainad', domainadValue);

}
	// 获取元素标签名、id、class、style、src、href 的广告特征
function getAdFeatures(elem) {
  let features = '';
  let tagName = '';
  var domain = window.location.host;
  if (elem.tagName) {
  tagName= elem.tagName.toLowerCase();
    }



  if (elem.id) {
   features = tagName+'#' + elem.id;
updomainad(features);
    }
    if (elem.classList && elem.classList.length > 0) {
    	  let classtxt='[class="' + $(elem).attr('class').replace(/debug-border/g, '')+ '"]';
    	if (classtxt!='[class=""]'){
  var lastSpaceIndex = classtxt.lastIndexOf(" ");
  if (lastSpaceIndex !== -1) {
      classtxt = classtxt.substring(0, lastSpaceIndex) + "" + classtxt.substring(lastSpaceIndex + 1);
  }
  features=tagName+classtxt;
updomainad(features);
}
    }

  if (elem.style.cssText) {
  let styletxt='[style^="' + $(elem).attr('style')+ '"]';
    features=tagName+styletxt;
updomainad(features);
   }
  if (elem.src) {
 let elemurl=elem.src;
 let matchStr = elemurl.match(/\/\/[^/]*\/(.+?)([.?]|$)/);
elemurl = matchStr[1];

   features = tagName+'[src*="' + elemurl + '"]';
updomainad(features);
   }
  if (elem.href) {
 let elemurl=elem.href;
 let matchStr = elemurl.match(/\/\/[^/]*\/(.+?)([.?]|$)/);
elemurl = matchStr[1];
      features = tagName+'[href*="' + elemurl + '"]';

updomainad(features);

   }

  // return features;
}
    // 隐藏元素的删除按钮
    function hideDeleteBtn(elem) {
        if (elem) {
            elem.classList.remove('debug-border');
        }
    }

    // 遍历并隐藏元素的所有子节点
    function hideElementContent(elem) {
        $(elem).children().each(function() {
            hideElementContent(this);
            $(this).hide();
        });
    }

    // 点击调试按钮后的操作
$("body").on('click', '#debugBtn', function() {
        debugMode = !debugMode;
        if (debugMode) {
            document.body.addEventListener('mouseover', mouseOverHandler, true);
 
  
  toastr.success('已进入调试模式！移动鼠标，可以点击你需要删除的页面元素包括广告。误删可以使用恢复按钮即可让页面恢复正常。适合大部分网页。重新打开页面生效！', '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
  
        } else { 
  
    toastr.success('已关闭调试模式！', '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
    
            hideDeleteBtn(currentElement);
            currentElement = null;
            document.body.removeEventListener('mouseover', mouseOverHandler, true);
        }
    });
  // 自动隐藏符合广告特征的元素


function Proactivelyads() {
	if (GM_info.script.namespace!="Z3JlYXN5Zm9yaw=="){ 
return
}
	  var domain = window.location.host;
    var adFeaturesStr = GM_getValue(domain, '');
var domainadValue = GM_getValue('domainad');
var adFeaturesStr = domainadValue && domainadValue[domain] ? domainadValue[domain] : '';
if (adFeaturesStr==""){
	return
}
    for (var featureStr in adFeaturesStr) {
try {
 var selector = featureStr;

      if (selector.includes('[class="')) {
  var match = selector.match(/class\s*=\s*"([^"]+)"/);
  if (match && match[1]) {
  var classes = match[1].split(/\s+/);
  var tagName = selector.split('[')[0];
     selector = tagName + '.' + classes.join('.');
    $(selector).remove();
  }
}else{
	    $(selector).remove();
}
} catch (err) {
console.log('执行出错');
}


    }
  }
