// ==UserScript==
// @name 微软翻译组件
// @description 微软翻译组件  右下角点击翻译
// @supportURL https://greasyfork.org/zh-CN/scripts/26027-%E5%BE%AE%E8%BD%AF%E7%BF%BB%E8%AF%91%E7%BB%84%E4%BB%B6/feedback
// @include     *
// @exclude     *.jpg
// @exclude     *.png
// @exclude     *.jpeg
// @exclude     *.gif
// @exclude     *.pdf
// @exclude     *115.com/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.min.js
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_getResourceText
// @grant       GM_getResourceUrl
// @grant       GM_xmlhttpRequest
// @resource httpJs http://www.microsofttranslator.com/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**&ctf=False&ui=false&settings=Manual&from=
// @resource httpsJs https://ssl.microsofttranslator.com/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**&ctf=False&ui=false&settings=Manual&from=
// @author      aogg
// @version 2.3.25
// @namespace https://greasyfork.org/users/25818
// @downloadURL https://update.greasyfork.org/scripts/26027/%E5%BE%AE%E8%BD%AF%E7%BF%BB%E8%AF%91%E7%BB%84%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/26027/%E5%BE%AE%E8%BD%AF%E7%BF%BB%E8%AF%91%E7%BB%84%E4%BB%B6.meta.js
// ==/UserScript==


(function (){

  var width = '79',
      height = '23';
  var divId = 'MicrosoftTranslatorWidget',
      divMenu = null, // 菜单div
      divOne = null, // 一键翻译div
      selectNode = null, // 选择框
      divNode = null, // 主div
      translatorSwitch = function (){}, // 执行翻译函数
      localStorageLocalsKey = divId + 'localStorageLocals',
      localStorageAppCloseKey = divId + 'localStorageClose',
      localStorageAppOneKey = divId + 'localStorageOne',
      appOneFunc = { // 一键翻译处理函数
        get: function (){
          return GM_getValue(localStorageAppOneKey);
        },
        set: function (val){
          GM_setValue(localStorageAppOneKey, val);
          
          if (divOne){ // 修改文案
            divOne.innerText = divOne.oneTitleFunc();
          }
        }
      };
  
  
  GM_registerMenuCommand('切换微软一键翻译', function (){
    if (divOne){
      if (divNode){
          divNode.changeMenu('show'); // 显示菜单
        
          setTimeout(function (){
            divNode.changeMenu('hide');
          }, 500); // 关闭菜单
      }
      divOne.click();
    }
  });
  
  
  
  if (
    parent !== parent.parent || document.documentElement.clientWidth <= width * 2 || document.documentElement.clientHeight <= height * 2 || // iframe过多，或者屏幕过小
    checkOnlyItem() ||
    checkVideoFull() || // 检测视屏是否占满屏
    localStorage.getItem(localStorageAppCloseKey)
  ){ 
    // 控制层次，避免无限调用，如：http://www.w3school.com.cn/html/html_entities.asp
    // 控制宽高小的不显示
    return;
  }


  // 重置cookie
  try{
    Cookies.remove('mstto');
    console.log('remove cookie mstto');
  }catch(e){
    console.log(e);
  }

  var locals = ''; // zh-chs
  var source = null;
  var mainStatus = false; // 是否执行了main方法

  /**
  var noTranslator = ['wangpan'];
  if (self.frameElement && noTranslator.indexOf(self.frameElement.name) !== -1){
      return;
  }
  */

  
  if (navigator.userAgent.indexOf('Maxthon') > -1){ // 遨游浏览器
    var scriptNode = document.createElement('script');
    scriptNode.innerHTML = "setTimeout(function(){{var s=document.createElement('script');s.type='text/javascript';s.charset='UTF-8';s.src=((location && location.href && location.href.indexOf('https') == 0)?'https://ssl.microsofttranslator.com':'http://www.microsofttranslator.com')+'/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**&ctf=False&ui=false&settings=Manual&from=';var p=document.head[0]||document.documentElement;p.insertBefore(s,p.firstChild); }},0);";

    document.head.appendChild(scriptNode);
    setTimeout(start,0);
    console.log('目前遨游浏览器因GM_xmlhttpRequest对于CSP的网站无法正确处理错误');
  }else{
    (function (){
        var url =((location && location.href && location.href.indexOf('https') == 0)?'https://ssl.microsofttranslator.com':'http://www.microsofttranslator.com')+
              '/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**&ctf=False&ui=false&settings=Manual&from=';
        try{
          GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
              try{
                if (response.responseText.length < 1000){
                  console.error('获取微软js失败，请ctrl+F5访问：' + url);
                }
                unsafeWindow.eval(response.responseText);

                start();
              }catch(e){
                console.error('无法执行eval，如github的CSP策略，可改用chrome自带的google翻译');
              }
            }
          });
        }catch(e){
          console.error('无法执行eval，如github的CSP策略，可改用chrome自带的google翻译');
          return;
        }
    })()
  }

  
  /**
  // 有缓存
  var code = location && location.href && location.href.indexOf('https') == 0?GM_getResourceText('httpsJs'):GM_getResourceText('httpJs');
  try{
    unsafeWindow.eval(code);
    setTimeout(start,0);
  }catch(e){
    console.log('无法执行eval，如github的CSP策略，可改用chrome自带的google翻译');
    return;
  }
  */
  

  
  
  divNode = document.createElement('div');

  divNode.id = divId;
  divNode.style.color = 'white';
  divNode.style.backgroundColor = '#555555';
  divNode.style.position = 'fixed';
  divNode.style.right = '0';
  divNode.style.bottom = '1px';
  divNode.style.zIndex = '9999999';
  divNode.style.fontSize = '13px';
  divNode.title = '翻译为，或双击隐藏';
  divNode.style.width= width + 'px';
  divNode.ondblclick = function(){ // 双击隐藏
    translatorHide();
  };
  divNode.changeMenu = function (action){
    var showArr = {'none':'block', 'block':'none'};
    if (divMenu){
      if (action === 'show'){ // 显示
        divMenu.style.display = 'block';
      }else if (action === 'hide'){ // 隐藏
        divMenu.style.display = 'none';
      }else {
        divMenu.style.display = showArr[divMenu.style.display] ? showArr[divMenu.style.display] : 'none';
      }
    }
  };
  divNode.oncontextmenu = function (event){ // 设置菜单
    event.preventDefault();
    this.changeMenu();
  }

  divMenu = menu(divNode);
  
  
  function start(){
      mutationStart();
      document.body.appendChild(divNode);
      document.onreadystatechange = main;
      setTimeout(main, 500); // 最少500ms内显示
  }
  
  // 隐藏全部
  var translatorHide = (function(div){
    return function (){
      div.style.display = 'none';
    }
  })(divNode)



  function main(){
    if (mainStatus || (document.readyState !== 'complete' && document.readyState !== 'interactive')){
      return;
    }
    mainStatus = true;

    // 多语言翻译
    var selectHtml = document.createElement('select'),
        selected = appOneFunc.get() || '',
        status = false, // 翻译状态，false为未翻译
        translateFunc = function (locals, setNodeNot){
          // var option = selectHtml.selectedOptions;
          source = selectHtml.getAttribute('data-source') || null;
          setLocals(locals, setNodeNot);
          translateStart();
        };
    selectHtml.style.backgroundColor = 'rgb(178, 178, 178)';
    selectHtml.ondblclick = function(){ // 双击隐藏
      this.parentNode.style.display = 'none';
    };
    selectHtml.style.margin = 0;
    selectHtml.style.padding = 0;
    selectHtml.style.fontSize = '13.3px';
    selectHtml.style.width= width + 'px';
    selectHtml.style.height= height + 'px';
    selectHtml.onclick = (function (){
      return function (event){ // 一键翻译
        var selected = appOneFunc.get(); // 每次重新获取
        if (selected){ // 需要一键翻译
          if (!status){ // 翻译
            event.preventDefault();
            translateFunc(selected)
          }else{ // 关闭
            closeTranslator();
          }
          status = !status;
        }
      }
    })();
    // Microsoft.Translator.Widget.GetLanguagesForTranslateLocalized()获取所有支持的翻译选项
    selectHtml.innerHTML = "\
      <option id='MicrosoftTranslatorWidget-option-select' value=''>翻译为</option>\
      <option value='zh-chs'>简体中文</option>\
      <option value='zh-cht'>繁体中文</option>\
      <option value='yue'>粤语</option>\
      <option value='ja'>日文</option>\
      <option id='MicrosoftTranslatorWidget-option-en' value='en'>英文</option>\
  ";
    
    if (selected){ // 修改默认值
      for (var i in selectHtml.options){
        if (selectHtml.options[i] && selectHtml.options[i].value == selected){
          selectHtml.options[i].selected = true;
        }
      }
      // selectHtml.value = selected; 此方法无效
    }
    
    selectHtml.onchange = function (){
      if (!this.value){ // 选择翻译为时，关闭翻译
        closeTranslator();
      }
      
      status = !!this.value;
      translateFunc(this.value, true);
    };
    
    
    var parentDiv = document.body.children.namedItem(divId);
    // parentDiv.style.display = 'block';
    parentDiv.appendChild(selectHtml);
    selectNode = selectHtml; // 放置到外部变量

    translateStart();

  }


  function translateStart(){
    if (mainStatus && locals && unsafeWindow['Microsoft']){
      // null, 'es', onProgress, onError, onComplete, onRestoreOriginal, 2000
      Microsoft.Translator.Widget.Translate(source, locals, null, null, onComplete);
    }
  }

  function onComplete(){
    var option = selectNode.options;
    option.namedItem('MicrosoftTranslatorWidget-option-en').innerText = '英文';
    option.namedItem('MicrosoftTranslatorWidget-option-select').innerText = '翻译为';

  }


  function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) { return; }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
  }


  console.log('完成');
  
  // 右击层
  function menu(parentDiv){
    var div = document.createElement('div');
    div.id= divId + "-menu";
    div.style.display = 'none';
    div.oncontextmenu = function (event){
      event.preventDefault();
      this.style.display = 'none';
    }
    
    // 当前网站永久隐藏
    var divHide = document.createElement('div');
    divHide.innerText = '当前网站隐藏';
    divHide.height = '20px';
    divHide.onclick = function (){
      if(window.confirm('确定要当前网站隐藏？')){
        localStorage.setItem(localStorageAppCloseKey, 1);
        translatorHide();
      }
    }
    div.appendChild(divHide);
    // 切换为一键翻译样式
    divOne = document.createElement('div');
    divOne.oneTitleFunc = function (){
          return (appOneFunc.get()?'取消':'') + '一键翻译'
        };
    divOne.innerText = divOne.oneTitleFunc();
    divOne.height = '20px';
    divOne.onclick = function (){
      var localValue = appOneFunc.get(),
          val = localValue ? '' : (locals || 'zh-chs');
      appOneFunc.set(val);
    }
    div.appendChild(divOne);
    
    
    parentDiv.appendChild(div);
    
    return div;
  }
  
  
  function setLocals(value, nodeNot){
    locals = value;
    localStorage.setItem(localStorageLocalsKey, value);
    !nodeNot && (selectNode.value = value);
  }
  
  
  // 取消翻译
  function closeTranslator(){
    unsafeWindow['Microsoft'] && Microsoft.Translator && Microsoft.Translator.FloaterOnClose();
    
    if (divOne){ // 恢复文案
      divOne.innerText = divOne.oneTitleFunc();
    }
  }
  
  
  
  function findVideo(){
      var names = ['object', 'embed', 'video'];
      var ele = [];
      for (var i in names){
        ele = document.getElementsByTagName(names[i]);
        if (ele.length){
          return ele;
        }
      }
      
      return ele;
  }
  
  
  
  function checkVideoFull(){ // 检测视频是否占满屏
    var ele = findVideo();

    if (ele.length){
      for (var i = 0; i < ele.length; ++i){
        if (ele.item(i).clientHeight == document.documentElement.clientHeight && ele.item(i).clientWidth == document.documentElement.clientWidth) {
          return true
        }
      }
    }
    
    return false;
  }
  
  
  
  
  function checkOnlyItem(){
  	if (document.body.childElementCount === 1){
  		var firstNodeName = document.body.firstElementChild.nodeName,
  			checkFirstNodeNameArr = ['SCRIPT', 'IMG'];
  		for (var i in checkFirstNodeNameArr){
  			if(checkFirstNodeNameArr[i] === firstNodeName){
  				return true;
  			}
  		}
  	}else if (document.body.childElementCount === 2){ // 只有img和script
  		if (
  			(document.body.childNodes.item(0).nodeName === 'IMG' && document.body.childNodes.item(1).nodeName === 'SCRIPT') ||
  			(document.body.childNodes.item(0).nodeName === 'SCRIPT' && document.body.childNodes.item(1).nodeName === 'IMG')
  		){
  			return true;
  		}
  	}


      
    return false;
  }
  
  
  
function mutationStart(){
  
  function mutationFunc(mutations){
        if (checkVideoFull() || checkOnlyItem()){
          observer.disconnect();
          translatorHide();
        }
  }
  
  
    // Firefox和Chrome早期版本中带有前缀
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

    // 选择目标节点
    var target = document.body;
     
    // 创建观察者对象
    var observer = new MutationObserver(debounce(mutationFunc, 50));
     
    // 配置观察选项:
    var config = { childList: true, subtree: true }
     
    // 传入目标节点和观察选项
    observer.observe(target, config);
    
    // 先执行一次
    mutationFunc();
}
  
 
  
    
})()





 // 函数去抖
function debounce(func, wait, immediate) {
    var _ = {};
    _.now = Date.now || function() {
        return new Date().getTime();
    };
    var timeout, args, context, timestamp, result;

    var later = function() {
        // 定时器设置的回调 later 方法的触发时间，和连续事件触发的最后一次时间戳的间隔
        // 如果间隔为 wait（或者刚好大于 wait），则触发事件
        var last = _.now() - timestamp;

        // 时间间隔 last 在 [0, wait) 中
        // 还没到触发的点，则继续设置定时器
        // last 值应该不会小于 0 吧？
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            // 到了可以触发的时间点
            timeout = null;
            // 可以触发了
            // 并且不是设置为立即触发的
            // 因为如果是立即触发（callNow），也会进入这个回调中
            // 主要是为了将 timeout 值置为空，使之不影响下次连续事件的触发
            // 如果不是立即执行，随即执行 func 方法
            if (!immediate) {
                // 执行 func 函数
                result = func.apply(context, args);
                // 这里的 timeout 一定是 null 了吧
                // 感觉这个判断多余了
                if (!timeout)
                    context = args = null;
            }
        }
    };

    // 嗯，闭包返回的函数，是可以传入参数的
    return function() {
        // 可以指定 this 指向
        context = this;
        args = arguments;

        // 每次触发函数，更新时间戳
        // later 方法中取 last 值时用到该变量
        // 判断距离上次触发事件是否已经过了 wait seconds 了
        // 即我们需要距离最后一次触发事件 wait seconds 后触发这个回调方法
        timestamp = _.now();

        // 立即触发需要满足两个条件
        // immediate 参数为 true，并且 timeout 还没设置
        // immediate 参数为 true 是显而易见的
        // 如果去掉 !timeout 的条件，就会一直触发，而不是触发一次
        // 因为第一次触发后已经设置了 timeout，所以根据 timeout 是否为空可以判断是否是首次触发
        var callNow = immediate && !timeout;

        // 设置 wait seconds 后触发 later 方法
        // 无论是否 callNow（如果是 callNow，也进入 later 方法，去 later 方法中判断是否执行相应回调函数）
        // 在某一段的连续触发中，只会在第一次触发时进入这个 if 分支中
        if (!timeout)
        // 设置了 timeout，所以以后不会进入这个 if 分支了
            timeout = setTimeout(later, wait);

        // 如果是立即触发
        if (callNow) {
            // func 可能是有返回值的
            result = func.apply(context, args);
            // 解除引用
            context = args = null;
        }

        return result;
    };
};
  