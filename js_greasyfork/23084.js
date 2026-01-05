// ==UserScript==
// @name 			百度贴吧 视频楼层隐藏
// @namespace		https://greasyfork.org/users/3128
// @description     txdx
// @version			0.0.1
// @include			http://tieba.baidu.com/f?kw=%E6%96%97%E9%B1%BCtv*
// @icon			http://tieba.baidu.com/favicon.ico
// @grant			unsafeWindow
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/23084/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%20%E8%A7%86%E9%A2%91%E6%A5%BC%E5%B1%82%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/23084/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%20%E8%A7%86%E9%A2%91%E6%A5%BC%E5%B1%82%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

document.addEventListener('DOMSubtreeModified',function(){
  var threadList=document.querySelectorAll('.threadlist_video');
  //console.log(threadList);
  for(i=0;i<threadList.length;i++){
    var _target=threadList[i];
    //console.log(_target);
    var _parent=_target.parentNode;
    //console.log(_parent);
    var _className=_parent.className;
    //console.log(_className);
    while(!/j\_thread\_list/i.test(_className)){
      _parent=_parent.parentNode;
      _className=_parent.className;
    }
    _parent.parentNode.removeChild(_parent);
  }
},false)