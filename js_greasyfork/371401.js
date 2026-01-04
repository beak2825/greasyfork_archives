// ==UserScript==
// @name        Setycyas自定义表情包插件
// @namespace   https://greasyfork.org/users/14059
// @version     0.03
// @description 适应不同论坛的自定义表情包插件
// @require     http://cdn.staticfile.org/jquery/3.1.1/jquery.min.js
// @include     http*://*2dkf.com/*
// @include     http*://*9moe.com/*
// @include     http*://*kfgal.com/*
// @author      setycyas
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/371401/Setycyas%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E5%8C%85%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/371401/Setycyas%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E5%8C%85%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

"use strict";

/** 一个表情集合的类.初始化方式:
 *  name表示表情集合的名字,是一个字符串;
 *  srcList是图片链接列表;
 *  $Parent是一个$对象,表示该表情集应该显示在什么地方,一般是个div
 *  showDebug是一个布尔值,true的话显示大量debug信息.
 */
class FaceSet{
  
  /* 构造方法 */
  constructor(name,srcList,$Parent,showDebug){
    // 复制初始数据
    this._name = name;
    this._srcList = srcList.slice(0); // 复制
    this._$Parent = $Parent;
    this._showDebug = showDebug;
    
    // 生成_$Element对象需要的html字符串
    this._html = this._createHtml();
    // 生成的$对象,一个div,用于显示图片集合,初值为null,第一次调用时才生成
    this._$Element = null;
  }
  
  /* 显示debug用信息,参数可以多个,像console.log一样使用 */
  debugMsg(){
    if(this._showDebug) {       
      console.log(...arguments);
    }
  }
  
  /* 获取名字 */
  getName(){
    return this._name;
  }
  
  /* 生成html用 */
  _createHtml(){
    var html = "<div>";
    for(var i = 0;i < this._srcList.length;i++){
      var src = this._srcList[i];
      html += `<img src=${src} style=width:50px;height:50px></img>`;
    }
    html += "</div>";
    this.debugMsg(html);
    return html;
  }
  
  /* 在jaParent中显示图像. */
  show(){
    // 若尚未生成,先生成
    if(!this._$Element){
      this._$Element = $(this._html);
      this._$Parent.append(this._$Element);
    }
    // 显示
    this._$Element.css({'display':'block'});
  }
  
  /* 隐藏 */
  hide(){
     this._$Element.css({'display':'none'});
  }
  
}

/** setycyas自制的表情插件类.用于在任意textarea上方添加表情插件.初始化方法:
 * $textarea:需要使用插件的textarea,$对象;
 * faceTable:一个{},key为表情分类字符串,value是一个列表,列表内容为图片链接;
 * showDebug:布尔值,设定是否显示debug信息.
 * 构造方法不会加入表情包,必须执行main().
 */
class SetycyasFacePlugin {
  
  constructor($textarea,faceTable,showDebug) {
    //复制初始变量
    this._$textarea = $textarea;
    this._faceTable = faceTable;
    this._showDebug = showDebug;

    //设置菜单
    this._$menu = $("<div id=faceMenu></div>");
    this._$menu.css({
      "line-height":"30px",
    });
    this._$textarea.before(this._$menu);
    //设置显示图片用的div
    this._$faceDiv = $("</div><div id=faceContent style=clear:both></div>");
    this._$faceDiv.css({
      "border":"1px solid rgb(131,148,150)",
      "margin-top":"5px",
      "padding":"10px"
    });
    this._$menu.after(this._$faceDiv);
    //FaceSet对象的表,key是FaceSet的name,同时也是this._$menu显示的内容;
    //value则是对应的FaceSet对象
    this._faceSetTable = {};
    //当前显示的表情集合
    this._curFaceSet = null;
  }
  
   /* 显示debug用信息,参数可以多个,像console.log一样使用 */
  debugMsg(){
    if(this._showDebug) {       
      console.log(...arguments);
    }
  }
    
  //往textarea插入文本
  _insertText(textInsert){
    //用数组选择方法把$对象变成一般document对象,访问其光标选择位置
    var pos = this._$textarea[0].selectionEnd;
    // 原文本
    var oldText = this._$textarea.val();
    // 插入完成后的新文本
    var newText = oldText.substr(0,pos)+textInsert+oldText.substr(pos)
    // 插入
    this._$textarea.val(newText);
  }
    
  //初始化菜单与表情table
  _initMenuAndFaces(){
    //再写入菜单需要的html,记录表情集合对象
    var menuHtml = "";
    for(var menuKey in this._faceTable){
      var srcList = this._faceTable[menuKey];
      var objFs = new FaceSet(menuKey,srcList,this._$faceDiv,this._showDebug);
      menuHtml += `<div class=faceSetDiv><a class=faceSet>${menuKey}</a></div>`;
      this._faceSetTable[menuKey] = objFs;
    }
    this._$menu.html(menuHtml);
    $('.faceSet').css({
       "font-size":"12px","margin":"20px","color":"#f2f2f2","cursor":"pointer"
    });
    $('.faceSetDiv').hover(
      function(event){
        if(event.target.className != 'faceSetDiv') return;
        $(event.target).css({"background-color":"rgb(255,107,121)"});
      },
      function(event){
        if(event.target.className != 'faceSetDiv') return;
        $(event.target).css({"background-color":"rgb(255,67,81)"});
      }
    );
    $('.faceSetDiv').css({
      "min-width":"40px","float":"left","background-color":"rgb(255,67,81)"
    });
  }
    
  /* 绑定所有事件,需要冒泡执行 */
  _addEvents(){
    //添加事件时,需要传入自己,所以要记住自己
    var obj = this;
    //点击菜单,只有点击了'faceSet'class才生效
    var menu = this._$menu[0];
    menu.addEventListener('click',function(e){
      var target = e.target;
      if(target.className != 'faceSet'){
        return;
      }
      //点击的文字
      var faceTag = target.textContent;
      //如果当前没有已显示图像集,显示;
      if(!obj._curFaceSet){
        obj._curFaceSet = obj._faceSetTable[faceTag];
        obj._curFaceSet.show();
      }else{
      //若点击的文字不是当前显示的表情集合,把原来的表情集隐藏,显示点击的;
      //否则隐藏当前表情集合.
        if(obj._curFaceSet.getName() == faceTag){
          obj._curFaceSet.hide();
          obj._curFaceSet = null;
        }else{
          obj._curFaceSet.hide();
          obj._curFaceSet = obj._faceSetTable[faceTag];
          obj._curFaceSet.show();
        }
      }
    });
    //点击图片
    var faceDiv = this._$faceDiv[0];
    faceDiv.addEventListener('click',function(e){
      var target = e.target;
      // 点击的不是'img',忽略
      if(target.tagName.toLowerCase() != 'img'){
        return;
      }
      var src = target.src;
      var textInsert = `[img]${src}[/img]`;
      obj._insertText(textInsert);
    });
  }
  
  main(){
    //生成menu与表情集合的具体内容
    this._initMenuAndFaces();
    //绑定事件
    this._addEvents();
  }
}

/** 执行代码,如无必要,不要修改FaceSet与SetycyasPlugin两个类.
 * 在这里修改执行代码,应该足够对应不同论坛的设定以及自定义表情.
 */

(function(){
  //这一句指定文本框,应对不同论坛请修改这里
  var $textarea = $("form[name=FORM] textarea[name=atc_content]");
  
  //这一句自定义表情包,注意有些图片可能省略了域名
  var faceTable = {
    "BILIBILI":[
      'http://o6smnd6uw.bkt.clouddn.com/xds/2233%20(11).gif',
      'http://o6smnd6uw.bkt.clouddn.com/xds/2233%20(13).gif',
      'http://o6smnd6uw.bkt.clouddn.com/xds/2233%20(4).gif'
    ],
    "ACFUN":[
      'http://o6smnd6uw.bkt.clouddn.com/xds6/1.png',
      'http://o6smnd6uw.bkt.clouddn.com/xds6/2.png',
      'http://o6smnd6uw.bkt.clouddn.com/xds6/5.png',
      'http://o6smnd6uw.bkt.clouddn.com/xds6/24.png',
      'http://o6smnd6uw.bkt.clouddn.com/xds5/23.gif',
      'http://o6smnd6uw.bkt.clouddn.com/xds6/21.png'
    ],
    "AKARI":[
      'http://o6smnd6uw.bkt.clouddn.com/xds2/akari2.gif',
      'http://o6smnd6uw.bkt.clouddn.com/xds2/akari6.gif',
      'http://o6smnd6uw.bkt.clouddn.com/xds2/akari9.gif',
      'http://o6smnd6uw.bkt.clouddn.com/xds2/akari10.gif',
      'http://o6smnd6uw.bkt.clouddn.com/xds2/akari11.gif',
      'http://o6smnd6uw.bkt.clouddn.com/xds2/akari12.gif',
      'http://o6smnd6uw.bkt.clouddn.com/xds2/akari14.gif'
    ],
    "其他":[
      'http://o6smnd6uw.bkt.clouddn.com/xds4/0xx4.png',
      'http://o6smnd6uw.bkt.clouddn.com/xds4/0xx10.png',
      'http://o6smnd6uw.bkt.clouddn.com/xds4/0xx8.png',
      'http://o6smnd6uw.bkt.clouddn.com/xds4/0xx18.png'
    ]
  };
  
  // 新建表情包插件,运行main()方法
  var showDebug = false;
  var plugin = new SetycyasFacePlugin($textarea,faceTable,showDebug);
  plugin.main();
  
})();
