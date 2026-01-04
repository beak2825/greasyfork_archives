// ==UserScript==
// @name            干掉买动漫的代购
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			0.5.1
// @description     买动漫遍地都是代购也不做分类真是太烦了
// @include         https://www.myacg.com.tw/goods_list.php*
// @run-at          document-end
// @license         WTFPL
// @grant           none
// @require         https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/391876/%E5%B9%B2%E6%8E%89%E4%B9%B0%E5%8A%A8%E6%BC%AB%E7%9A%84%E4%BB%A3%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/391876/%E5%B9%B2%E6%8E%89%E4%B9%B0%E5%8A%A8%E6%BC%AB%E7%9A%84%E4%BB%A3%E8%B4%AD.meta.js
// ==/UserScript==
(function () {
  timer = setTimeout(onSubxxx, 1000);
}) ();
function onSubxxx() {
  var kmyacg = 'div.name a';
  $('div.box ul.clearfix').append('<li><a class="kill666" href="#">刪除代購</a></li>');
  $('div#wing').prepend('<label for="textfield">额外屏蔽:</label><br /><input name="xxoo" id="xxoo" size="6" type="text">');
  $('.wing_block_top').addClass('kill666'); //加一些元素啥的
  $('#xxoo').attr('value', $.cookie('nckill')); //读取饼干给输入框 如果有的话
  $('.kill666').click(function () { //点击咯
    var mkills = '代購,同人誌預購,melonbooks'; //固定关键词
    var vkills = $('#xxoo').val(); //读取输入框
    if (vkills != null && vkills != '') { //检查是不是空的
      if (vkills.indexOf(' ') >= 0 || vkills.indexOf(',') === 0) { //别瞎搞
        alert('不能包含空格或格式错误');
        return;
      } else { //有内容就加结尾
        mkills = mkills + ',' + vkills; //加个逗号
        $.cookie('nckill', vkills, { //写进饼干保存下次还能用
          domain: 'myacg.com.tw'
        });
      }
    } else { //如果输入框没内容点了搜索就情况饼干 
      $.removeCookie('nckill', {
        domain: 'myacg.com.tw'
      });
    }    //console.log(mkills);

    var nkills = mkills.split(','); //逗号分成数组
    $(kmyacg).each(function () { //遍历咯
      for (var i = nkills.length - 1; i >= 0; i--) {
        //console.log(nkills[i]);
        if ($(this).text().indexOf(nkills[i]) >= 0) { //开始隐藏咯
          $(this).closest('li').hide();
        }
      }
    });
  });
}
