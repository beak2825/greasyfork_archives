// ==UserScript==
// @name            CM获取列表
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			0.1
// @description     CM获取列表CM获取列表
// @include         https://webcatalog-free.circle.ms/Circle?*
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/375929/CM%E8%8E%B7%E5%8F%96%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/375929/CM%E8%8E%B7%E5%8F%96%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
  timer = setTimeout(onSub, 3000);
}) ();
function onSub() {
  var xc = '';
  $('#cutslist').click(function () {
    $('.circle-cut').each(function () {
      xc = xc + 'https://webcatalog-free.circle.ms' + $(this).attr("href") + '\n';
    });
    alert(xc);
  });
};
