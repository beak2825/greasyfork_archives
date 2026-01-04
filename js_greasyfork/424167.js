// ==UserScript==
// @name         UJS教学评价自动完成
// @version      0.3
// @author       YuYuYu
// @description  自动完成教学评价
// @match        http://xuanke*.ujs.edu.cn/xs_main_zzjk*.aspx*
// @match        https://webvpn.ujs.edu.cn/*/xs_main_zzjk*.aspx*
// @match        http://xuanke*.ujs.edu.cn/xsjxpj2.aspx*
// @match        https://webvpn.ujs.edu.cn/*/xsjxpj2.aspx*
// @match        http://xuanke*.ujs.edu.cn/xsjxpj2_2.aspx*
// @match        https://webvpn.ujs.edu.cn/*/xsjxpj2_2.aspx*
// @grant    GM_registerMenuCommand
// @namespace https://greasyfork.org/users/702714
// @downloadURL https://update.greasyfork.org/scripts/424167/UJS%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/424167/UJS%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==

window.onload = function () {
    GM_registerMenuCommand('运行脚本',function(){
      var a=document.getElementsByTagName('a');
      var url='';
      for(var i=0;i<a.length;i++){
        if(a[i].innerHTML.endsWith('教学评价')){
          url=document.getElementsByTagName('a')[i].href.substring(document.getElementsByTagName('a')[i].href.lastIndexOf('/'),document.getElementsByTagName('a')[i].href.length);
        }
      }
      if(!url){
        alert('错误！没有找到教学评价标签！');
        return;
      }
      location.href=location.href.substring(0,location.href.lastIndexOf('/'))+url;
    });
    if(location.href.search('xsjxpj2_2.aspx')!=-1){
      var len = (document.getElementsByTagName('tbody')[1].getElementsByTagName('tr').length - 1) / 2;
      var str = document.getElementsByTagName('tbody')[1].getElementsByTagName('tr')[1].getElementsByTagName('span')[0].id;
      var startIdx = parseInt(str.substring(str.indexOf('__ctl') + 5, str.indexOf('_', str.indexOf('__ctl') + 5)));
      for (var i = startIdx; i < startIdx + len; i++) {
          document.getElementById(`Datagrid1__ctl${i}_rb_0`).checked = true;
      }
      document.getElementById("txt_pjxx").value = '老师备课充分，授课重点突出。';
      document.getElementById("Button1").click();
    }else if (location.href.search('xsjxpj2.aspx')!=-1) {
        var a = document.getElementsByTagName('tbody')[0].getElementsByTagName('a');
        for (var i = 0; i < a.length; i++) {
          if(a[i].childElementCount==0){
            var functionText = a[i].onclick.toString();
            var start = functionText.indexOf('window.open') + 13;
            var end = functionText.indexOf('\'', start);
            var url = functionText.substring(start, end);
            window.open(url);
          }
        }
    }
}
