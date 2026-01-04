// ==UserScript==
// @name         bangumi_index_name_search
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  bangumi 目录名称搜索匹配，在添加新关联时输入名称可返回相应搜索
// @author       xdy
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)/index/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/35847/bangumi_index_name_search.user.js
// @updateURL https://update.greasyfork.org/scripts/35847/bangumi_index_name_search.meta.js
// ==/UserScript==

function addCSS(cssText){

 var style = document.createElement('style'), //创建一个style元素
  head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
 style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用

 if(style.styleSheet){ //IE
  var func = function(){
   try{ //防止IE中stylesheet数量超过限制而发生错误

    style.styleSheet.cssText = cssText;

   }catch(e){

   }
  };
  //如果当前styleSheet还不能用，则放到异步中则行
  if(style.styleSheet.disabled){

   setTimeout(func,10);
  }else{
   func();
  }
 }else{ //w3c
  //w3c浏览器中只要创建文本节点插入到style元素中就行了
  var textNode = document.createTextNode(cssText);

  style.appendChild(textNode);

 }

 head.appendChild(style); //把创建的style元素插入到head中
}

//使用
css = '\
.search_suggest \
{\
 position:absolute;\
 z-index:999;\
 left:10px;\
 top:106px;\
 width:361px;\
 border:1px solid #ccc;\
 border-top:none;\
 display:none;\
 color:#004080;\
}\
.search_suggest li \
{ height:24px;\
 overflow:hidden;\
 padding-left:3px;\
 line-height:24px;\
 background:#fff;\
 cursor:default;\
}\n\
.search_suggest li.hover {background:#ddd;}';


addCSS(css);
var type_str = ['', '书籍','动画','音乐','游戏','书籍','三次元'];
$("a.add.thickbox").attr('href','#TB_inline?tb&height=80&width=360&inlineId=newIndexRelated');

var input =  $("input#title");
input.attr('autocomplete','off');
input.after("<div class='search_suggest' id='search_suggest'><ul></ul></div>");
before_str = "<option value='2'>动画</option><option value='1'>书籍</option><option value='4'>游戏</option><option value='3'>音乐</option><option value='6'>三次元</option>";
input.before("<div><span class='tip'>或填入条目名称获得候选ID选项，右侧选择分类：</span><select name='cat' id='indexSearchSelect'><option value='all'>全部</option>"+before_str+"</div>");

var indexSelect = $('select#indexSearchSelect');

function oSearchSuggest(searchFuc)
{
 //var input = $('#gover_search_key');
 var suggestWrap = $('#search_suggest');
 var key = "";
 var init = function(){
     input.bind('keyup',sendKeyWord);
     input.bind('blur',function(){setTimeout(hideSuggest,100);});
     };
 var hideSuggest = function(){
     suggestWrap.hide();
     };
 //发送请求，根据关键字到后台查询
 var sendKeyWord = function(event){
 //键盘选择下拉项
 if(suggestWrap.css('display')=='block'&&event.keyCode == 38||event.keyCode == 40)
 {
  var current = suggestWrap.find('li.hover');
  if(event.keyCode == 38)
  {
	  if(current.length>0)
	  {
	   var prevLi = current.removeClass('hover').prev();
	   if(prevLi.length>0)
	   {
	   prevLi.addClass('hover');
	   input.val(prevLi.attr('title'));
	   }
	  }
	  else
	  {
	   var last = suggestWrap.find('li:last');
	   last.addClass('hover');
	   input.val(last.attr('title'));
	  }
  }
  else if(event.keyCode == 40)
  {
	  if(current.length>0)
	  {
	   var nextLi = current.removeClass('hover').next();
	   if(nextLi.length>0)
	   {
	   nextLi.addClass('hover');
	   input.val(nextLi.attr('title'));
	   }
	  }
	  else
	  {
	   var first = suggestWrap.find('li:first');
	   first.addClass('hover');
	   input.val(first.attr('title'));
	  }
  }
  //输入字符
 }
 else
 {
  var valText = $.trim(input.val());
  if(valText ==''||valText==key)
  {
  return;
  }
  var search_type = indexSelect.val();
  searchFuc(valText, search_type);
  key = valText;
 }
 };
 //请求返回后，执行数据展示
 this.dataDisplay = function(data){
 if(data.length<=0)
 {
  suggestWrap.hide();
  return;
 }

 //往搜索框下拉建议显示栏中添加条目并显示
 var li;
 var tmpFrag = document.createDocumentFragment();
 suggestWrap.find('ul').html('');
 for(var i=0; i<data.length; i++)
 {
  li = document.createElement('LI');
  li.title = data[i].id;
  li.innerHTML = type_str[data[i].type] + ':' + data[i].name;
  tmpFrag.appendChild(li);
 }
 suggestWrap.find('ul').append(tmpFrag);
 suggestWrap.show();
 //为下拉选项绑定鼠标事件
 suggestWrap.find('li').hover(function(){
  suggestWrap.find('li').removeClass('hover');
  $(this).addClass('hover');
 },function(){
  $(this).removeClass('hover');
 }).bind('click',function(){
  $(this).find("span").remove();
  input.val(this.title);
  suggestWrap.hide();
 });
 };
 init();
}
//实例化输入提示的JS,参数为进行查询操作时要调用的函数名
var searchSuggest = new oSearchSuggest(sendKeyWordToBack);
//这是一个模似函数，实现向后台发送ajax查询请求，并返回一个查询结果数据，传递给前台的JS,再由前台JS来展示数据。本函数由程序员进行修改实现查询的请求
//参数为一个字符串，是搜索输入框中当前的内容

function sendKeyWordToBack(keyword, type='all'){
 var aData = [];
 $.get(`${location.origin}/subject_search/${keyword}?cat=${type}`, function (data) {
            let content = data.match(/<a href="\/subject\/.*?" class="l">.*?<\/a>/g);
            let type_content = data.match(/<span class="ico_subject_type subject_type_\d ll"><\/span>/g);
            if(content) {

                for(var i = 0;i<content.length;i++)
                {
                    let anime = {};
                    s = content[i].match(/>.*?</)[0];
                    anime['name'] = s.substring(1, s.length-1);
                    anime['id'] = content[i].match(/\d+/)[0];
                    anime['type'] = parseInt(type_content[i].match(/\d/)[0]);
                    aData.push(anime);
                }
                //content.forEach(function (item){
                //    s = item.match(/>.*?</)[0];
                //    item_name.push(s.substring(1, s.length-1));

                //    anime['id'] = item;
                //});
            }

     searchSuggest.dataDisplay(aData);


 });
 //将返回的数据传递给实现搜索输入框的输入提示js类

}