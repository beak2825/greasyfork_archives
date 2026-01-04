// ==UserScript==
// @name            hentaicore添加外站跳转搜索
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @homepageURL     https://greasyfork.org/users/2805-myimagination
// @version			0.1.4
// @description     为hentaicore添加E绅士与某D站搜索
// @include         http://www.hentaicore.net/20*
// @require         http://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/37640/hentaicore%E6%B7%BB%E5%8A%A0%E5%A4%96%E7%AB%99%E8%B7%B3%E8%BD%AC%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/37640/hentaicore%E6%B7%BB%E5%8A%A0%E5%A4%96%E7%AB%99%E8%B7%B3%E8%BD%AC%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
(function () {
  //alert("GO");
  var ok_ss = '';
  var ok_sss = '';
  var o_s = 0;
  //var w_w = 0;
  $('.entry').find('p').each(function () {
    o_s++;
    //alert($(this).text().split('-').length);
    if (o_s == 4) {
      var s_s = $(this).html().split('<br>');
      for (var i in s_s) {         
          var n_ss;
          n_ss = s_s[i].replace(/\[[^\]]*\]/g, '');
          n_ss = n_ss.replace(/\([^\)]*\)/g, '');
          n_ss = n_ss.replace('-', '');
          n_ss = n_ss.trim();
          ok_ss = ok_ss + s_s[i] + ' | <a href="https://e-hentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&seltag=%22age+progression%22&f_search=' + n_ss + '&f_apply=Apply+Filter" target="_blank" > [E] </a>' + ' | <a href="http://doujinantena.com/list.php?category=search&id=' + n_ss + '" target="_blank" > [D] </a><br>';
          //w_w = w_w + 1;
          //alert(w_w);
      }
      $(this).html(ok_ss);
    } else if ($(this).text().indexOf(',') < 1 && $(this).text().indexOf('Title:') == 0) {
     // alert(w_w);
      var n_ss;
      var o_ss;
      o_ss = $(this).html().substring(6, $(this).html().indexOf('<br>'));
      n_ss = o_ss.replace(/\[[^\]]*\]/g, '');
      n_ss = n_ss.replace(/\([^\)]*\)/g, '');
      n_ss = n_ss.replace('-', '');
      n_ss = o_ss + '<a href="https://e-hentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&seltag=%22age+progression%22&f_search=' + n_ss + '&f_apply=Apply+Filter" target="_blank" > [E] </a>' + ' | <a href="http://doujinantena.com/list.php?category=search&id=' + n_ss + '" target="_blank" > [D] </a>';
      ok_sss = $(this).html().trim().replace(o_ss, n_ss);
      $(this).html(ok_sss);
    }
  })
}) ();