// ==UserScript==
// @name         会计助手
// @namespace    http://zhihaofans.com
// @version      0.1
// @description  try to fuck the exam!
// @author       zhihaofans
// @match        http://10.168.91.5/kjtest/student-index.html
// @grant        none
// @icon         http://igdufs.xyz/png/kj_helper.png
// @downloadURL https://update.greasyfork.org/scripts/20759/%E4%BC%9A%E8%AE%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/20759/%E4%BC%9A%E8%AE%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
$(document).ready(function () {
  started = 0;
  already = 0;
  kj_ready();
  $('button#kj_helper').click(function () {
    button_onclick();
  });
});
function button_onclick()
{
  if ($('#lefttime').length > 0)
  {
    alert('OK');
    kj_start();
  }
  else
  {
    alert('请进入考试界面');
  }
}
function kj_ready()
{
  if (already != 1)
  {
    alert('【会计助手】\n\n本脚本仅作研究使用，请于24小时内删除\n\n在考试页面点击右上角的"会计助手"即可激活\n现在只有将答案显示在题目旁边的功能，以后有可能会将答案显示在选项里。');
    //var li = '<li><a href="javascript:void(0)" id="kj_helper">会计助手</a></li>';
    var kj_helper = '<button id="kj_helper" class="btn btn-default" type="button">会计助手</button>';
    //$('ul.nav.nav-pills.nav-stacked').append(li);
    $('div.col-lg-3.col-lg-offset-8.loginfo').html($('div.col-lg-3.col-lg-offset-8.loginfo').html() + kj_helper);
    already = 1;
    $('[oncontextmenu]').attr('oncontextmenu', 'return true');
    $('[oncontextmenu]').attr('onselectstart', 'return true');
  }
}
function kj_start()
{
  if (started != 1)
  {
    started = 1;
    title_sc = $('div.singlechoice div.header').text();
    title_mc = $('div.multichoice div.header').text();
    title_tf = $('div.tfchoice div.header').text();
    console.log(title_sc);
    console.log(title_mc);
    console.log(title_tf);
    singlechoice();
    multichoice();
    tfchoice();
  }
}
function singlechoice()
{
  var sc = $('div.row.sc_item');
  var scs = sc.length;
  var scsa = scs - 1;
  console.log(scs);
  var answer_scs = '';
  var answer_sc = '';
  for (var i = 0; i < scsa; i++)
  {
    answer_sc = $('div.row.sc_item:eq(' + i + ') div.answer').attr('data-id');
    answer_scs = answer_scs + answer_sc;
  }
  console.log(answer_scs);
  $('div.singlechoice div.header').html(title_sc + '<font size="2" face="arial" color="red">(答案:' + answer_scs + ')</font>');
}
function multichoice()
{
  var mc = $('div.row.mc_item');
  var mcs = mc.length;
  var mcsa = mcs - 1;
  console.log(mcs);
  var answer_mcs = '';
  var answer_mc = '';
  for (var i = 0; i < mcsa; i++)
  {
    answer_mc = $('div.row.mc_item:eq(' + i + ') div.answer').attr('data-id');
    console.log(answer_mc);
    answer_mcs = answer_mcs + answer_mc + ' ';
  }
  console.log(answer_mcs);
  $('div.multichoice div.header').html(title_mc + '<font size="2" face="arial" color="red">(答案:' + answer_mcs + ')</font>');
}
function tfchoice()
{
  var tf = $('div.row.tf_item');
  var tfs = tf.length;
  var tfsa = tfs - 1;
  console.log(tfs);
  var answer_tfs = '';
  var answer_tf = '';
  for (var i = 0; i < tfsa; i++)
  {
    answer_tf = $('div.row.tf_item:eq(' + i + ') div.answer').attr('data-id');
    if (answer_tf == 'TRUE')
    {
      answer_tf = 'T';
    }
    if (answer_tf == 'FALSE')
    {
      answer_tf = 'F';
    }
    console.log(answer_tf);
    answer_tfs = answer_tfs + answer_tf + ' ';
  }
  console.log(answer_tfs);
  $('div.tfchoice div.header').html(title_tf + '<font size="2" face="arial" color="red">(答案:' + answer_tfs + ')</font>');
}
