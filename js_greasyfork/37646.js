// ==UserScript==
// @name            北家添加E绅士搜索
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @homepageURL     https://greasyfork.org/users/2805-myimagination
// @version			0.1.5
// @description     为北家帖子内页添加E绅士搜索
// @include         https://bbs.white-plus.net/read.php?tid*
// @include         https://bbs.imoutolove.me/read.php?tid*
// @include         https://bbs.level-plus.net/read.php?tid*
// @include         https://www.snow-plus.net/read.php?tid*
// @include         https://www.east-plus.net/read.php?tid*
// @require         http://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @run-at          document-end
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/37646/%E5%8C%97%E5%AE%B6%E6%B7%BB%E5%8A%A0E%E7%BB%85%E5%A3%AB%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/37646/%E5%8C%97%E5%AE%B6%E6%B7%BB%E5%8A%A0E%E7%BB%85%E5%A3%AB%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
  var t_s = $('#subject_tpc').text();
  t_s = t_s.replace(/\[[^\]]*\]/g, '').replace(/\([^\)]*\)/g, '').replace('-', '').trim();
  var t_ss = '<a href="https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&seltag=%22age+progression%22&f_search=' + t_s + '&f_apply=Apply+Filter" target="_blank" >' + $('#subject_tpc').text() + '</a>';
  $('#subject_tpc').html(t_ss);
  $('#read_tpc').append(t_ss);
}) ();