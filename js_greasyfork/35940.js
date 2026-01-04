// ==UserScript==
// @version        0.0.4
// @modifvm        2018.01.05
// @name           My jQuery Plugin
// @homepage       https://greasyfork.org/zh-CN/scripts/35940
// ==/UserScript==

(function ($) {
  $.getUrlParam = function(name, url, option) {//筛选参数，url 参数为数字时
    url = url ? url.replace(/^.+\?/,'') : location.search;
    //网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
    var reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
    var str = url.replace(/^\?/,'').match(reg);

    if (str !== null) {
      switch(option) {
        case 'param':
        case 0:
          return unescape(str[0]);		//所筛选的完整参数串
        case 'name':
        case 1:
          return unescape(str[1]);		//所筛选的参数名
        case 'value':
        case 2:
          return unescape(str[2]);		//所筛选的参数值
        default:
          return unescape(str[2]);        //默认返回参数值
      } 
    } else {
      return null;
    }
  }
  //设置新的参数
  $.setUrlParam = function(name, url, newVal){
    var checkParam=$.getUrlParam(name, url, 0);
    if(checkParam){
      return url.replace(checkParam, $.getUrlParam(name, url, 1)+"="+newVal);
    }
  }
})(jQuery);
