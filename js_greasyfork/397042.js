// ==UserScript==
// @name        Teacher_Guo超星文件便捷分享
// @namespace   Teacher_Guo
// @include     http://*.chaoxing.com/*
// @include     https://*.chaoxing.com/*
// @grant       none
// @version     2.0
// @author      Teacher_Guo
// @description 2020/2/28 下午2:53:15
// @downloadURL https://update.greasyfork.org/scripts/397042/Teacher_Guo%E8%B6%85%E6%98%9F%E6%96%87%E4%BB%B6%E4%BE%BF%E6%8D%B7%E5%88%86%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/397042/Teacher_Guo%E8%B6%85%E6%98%9F%E6%96%87%E4%BB%B6%E4%BE%BF%E6%8D%B7%E5%88%86%E4%BA%AB.meta.js
// ==/UserScript==
(function() {
  'use strict';
  
  // 复制文本内容到剪切板
  function copyText(obj) {
    if (!obj) {
      return false;
    }
    var text;
    if (typeof(obj) == 'object') {
      if (obj.nodeType) { // DOM node
        obj = $(obj); // to jQuery object
      }
      try {
        text = obj.text();
        if (!text) { // Maybe <textarea />
          text = obj.val();
        }
      } catch (err) { // as JSON
        text = JSON.stringify(obj);
      }
    } else {
      text = obj;
    }
    var $temp = $('<textarea>');
    $('body').append($temp);
    $temp.val(text).select();
    var res = document.execCommand('copy');
    $temp.remove();
    return res;
  }
  
  // 将自己的分享按钮添加到官方分享的后面
  var btn_share = document.getElementById('btn_share');
  if (btn_share) {
    $('#btn_share').after('<a href="javascript:void(0);" class="fl move" id="btn_myshare" >一键复制</a>');
  }
  
  $("#btn_myshare").click(function() {
    // 多条件过滤：.ypImg的下级img标签属性不是文件夹图标 且 它的父标签的前一个兄弟节点span标签的class属性是被勾选状态
	var checked_file_links = $('.ypImg img[src!="/views/images/folder.png"]').parent().prev('span[class="checkbox zCheck"]').next().next();
    if(checked_file_links.length){
		var nodeNames = '';
		checked_file_links.each(function(){
			// 截取文件标识码
			var fullNodeName = $(this).attr('class');
			var nodeName = fullNodeName.substr(fullNodeName.lastIndexOf("_") + 1);
			// 获取文件名
			var fileName = $(this).attr('title');
			// 将文件名与链接进行拼接
			nodeNames += '文件名：'+ fileName + '  链接：' +'https://pan-yz.chaoxing.com/external/m/file/' + nodeName + "\n";
		});
		// 将获取到的数据复制到剪贴板
		copyText(nodeNames);
		alert("恭喜您！文件分享链接已复制到剪贴板！请注意：勾选的文件夹是不会生成分享链接的，请您知晓！");
    } else {
      alert("请先勾选要分享的文件！特别注意：勾选文件夹是不会生成分享链接的！");
    }

  });
  
  
  
})();