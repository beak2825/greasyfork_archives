// ==UserScript==
// @name        咕咕时代kf复数引用脚本
// @namespace   https://greasyfork.org/users/14059
// @description 在咕咕镇时代对kf的帖子进行复数引用
// @include     https://bbs.ikfol.com/read.php*
// @include     https://kf.miaola.info/read.php*
// @require     https://greasyfork.org/scripts/397230-kfreader-class/code/kfReaderclass.js?version=777262
// @author      setycyas
// @icon        https://gitee.com/miaolapd/KF_Online_Assistant/raw/master/icon.png
// @version     0.03
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/397195/%E5%92%95%E5%92%95%E6%97%B6%E4%BB%A3kf%E5%A4%8D%E6%95%B0%E5%BC%95%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/397195/%E5%92%95%E5%92%95%E6%97%B6%E4%BB%A3kf%E5%A4%8D%E6%95%B0%E5%BC%95%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function(){
'use strict';
console.log("咕咕时代kf复数引用脚本正在运行!");

/* 脚本开始 */

/* 使用了GM数据库记录,有3个量:
1.pid,记录上一次的帖子pid,若当前新开帖子pid一样,则使用上次的记录,否则清空记录
2.names,引用的姓名字符串,每个名字都以逗号结尾
3.text,所有的引用文本
*/

//在@require定义了kfReader类
var kf = new kfReader(window.location.href);
kf.show();
//通过对比帖子pid,决定是否刷新记录,打开新帖子后旧帖子的引用就无效了.
var oldPid = GM_getValue('pid', '');
if (kf.pid != oldPid){
  GM_setValue('pid', kf.pid);
  GM_setValue('text', '');
  GM_setValue('names', '');
}
var text = GM_getValue('text', ''); //引用文本
var names = GM_getValue('names', '');//引用的名字

// 改变引用帖子的a标签的行为
for(var i = 0;i < kf.floors.length;i++){
  var floor = kf.floors[i];
  var a = kf.floorContent[floor]['a'];
  a.href = 'javascript:';
  a['quoteFloor'] = floor; // 指定一个叫做quoteId的属性,方便引用
  jQuery(a).click(function(e){
    var quoteFloor = e.target['quoteFloor'];  // a标签指定的回复楼层
    // 作者处理
    var author = kf.floorContent[quoteFloor]['author'];
    // 当作者不在names中才添加作者名
    if (names.indexOf(author+',') < 0){
      names = names+author+',';
      GM_setValue('names', names);
    }
    // 文本处理
    var floorText = kf.floorContent[quoteFloor]['text'];
    var newText = '[quote]引用'+quoteFloor+'楼 '+author+'的帖子\n'+kf.floorContent[quoteFloor]['text']+'[/quote]';
    if (text.indexOf(newText) < 0){
      text = text+newText+'\n\n'; // 添加文本
      GM_setValue('text', text);
    }
    
    // 显示
    jQuery('input.input[name=diy_guanjianci]').val(names.replace(/,$/, ''));
    jQuery('textarea[name=atc_content]').val(text).focus();
  });
}

/* 脚本结束 */
})();
