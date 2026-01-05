// ==UserScript==
// @name         GetSteamGiftFromDropmail
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @icon         http://dropmail.me/favicon.ico
// @description  仅限奸商群成员使用
//               Chrome使用Tampermonkey插件添加脚本
//               Firefox使用GreaseMonkey插件添加脚本
// @author       lenceliu Liekong
// @match      http://dropmail.me/*
// @match      https://dropmail.me/*
// @downloadURL https://update.greasyfork.org/scripts/18643/GetSteamGiftFromDropmail.user.js
// @updateURL https://update.greasyfork.org/scripts/18643/GetSteamGiftFromDropmail.meta.js
// ==/UserScript==
/*-----------------生成邮箱地址------------------------*/
if (location.href.indexOf('dropmail.me') > - 1) {
  $ = unsafeWindow.jQuery;
  $((document.getElementsByClassName('well well-sm text-center')) [0].parentElement).before('<div id="mainbox" style="width:100%;min-height:430px;"></div>');
  $('#mainbox').append('<div id="mailbox" style="width:300px;height:410px;float:left; border:1px solid #aaa;border-radius:5px;margin-right:20px;"></div>');
  $('#mainbox').append('<div id="keybox" style="width:810px;min-height:410px;;float:left; border:1px solid #aaa;border-radius:5px;"></div>');
  $('#keybox').append('<div id="buttonbox" style="margin:10px;width:100%;"></div>');
  $('#buttonbox').append('<span class="btn btn-default btn-sm" id="btn_getgift" style="margin-right: 10px;" onclick="getGift()">提取礼物链接</span>');
  $('#buttonbox').append('<span class="btn btn-default btn-sm" style="margin-right: 10px;" onclick="clearbox()">清除礼物链接</span>');
  $('#buttonbox').append('<input id="name_switcher"  type="checkbox" name="checkbox" onclick="clearbox()">导出游戏名称</label>');
  $('#keybox').append('<textarea  name="message" rows="15" cols="80" id="giftmessage" style="margin-left: 10px;width:790px;height:320px;");></textarea>');
  $('#keybox').append('<div id="statusbox" style="margin-left:10px;color:#31708f;"></div>');
  var toolbarIsExpanded = true;
  var lastMailSum = 0;
  var addMailNum = 0;
  var internalStyleSheet = document.createElement('style');
  internalStyleSheet.setAttribute('type', 'text/css');
  internalStyleSheet.textContent = '\n' +
  '#toolbar {}' + '\n' +
  // ".toolbarCssExpand { height:400px;background:#fff; position:absolute; width:300px;opacity:0.9; }" + "\n" +
  // ".toolbarCssFold { height:30px;  background:#fff; position:absolute; width:30%; opacity:0.9; border:1px solid #aaa;border-radius:5px}" + "\n" +
  // ".toolbarSwitch {width:80px; height:30px; position:absolute; right:0; top:0;}" + "\n" +
  '#addMailNumSet {margin:10px;width:150px;}' + '\n' +
  '#getMailName {  margin-bottom:10px;margin-top:10px;}' + '\n' +
  '#emailList {margin-left:10px; width:280px; height:320px;}' + '\n' +
  '#toolStatusbar {margin-left: 10px; color:#31708f; font-style:bold;}' + '\n' +
  '\n';
  document.getElementsByTagName('head') [0].appendChild(internalStyleSheet);
  var toolbar = document.createElement('toolbar');
  toolbar.setAttribute('id', 'toolbar');
  toolbar.setAttribute('class', 'toolbarCssExpand');
  toolbar.innerHTML = //'<button data-toggle="cus-toggle" class="toolbarSwitch btn btn-default btn-sm" >▲折叠</button>' +
  $('#mailbox').append('<div><input type="text" id="addMailNumSet" placeholder="邮箱数量，回车确认" />' +
  '<button id="getMailName" class="btn btn-default btn-sm" data-refreshEmail>提取所有邮箱地址</button></div>' +
  '<textarea name="emailList" id="emailList" placeholder="邮箱列表"></textarea>' +
  '<div id="toolStatusbar"><b><span data-emaillistlen>工具加载成功！当前已生成邮箱共1个</span></b></div>');
  //   $('button[data-toggle="cus-toggle"]').on('click', function(){
  //        if(toolbarIsExpanded === true){
  //            $(this).text('▼展开');
  //            $(this).parent().attr("class", "toolbarCssFold");
  //            toolbarIsExpanded = false;
  //        }else if(toolbarIsExpanded === false){
  //            $(this).text('▲折叠');
  //            $(this).parent().attr("class", "toolbarCssExpand");
  //            toolbarIsExpanded = true;
  //        }
  //    });
  $('input[id="addMailNumSet"]').on('keydown', function (e)
  {
    if (13 == e.keyCode)
    {
      addMailNum = parseInt($(this).val().trim());
      if (isNaN(addMailNum)) {
        alert('请输入数字!');
        $(this).val('');
        return false;
      }
      lastMailSum = getEmailList().split('\n').length;
      addMailProgress();
      for (var i = 0; i < addMailNum; i++)
      {
        intervalAddEmail();
      }
      var refreshEmail = $('button[data-refreshEmail]');
      refreshEmail.on('click', function ()
      {
        $('textarea[name="emailList"]').val(getEmailList());
        $('span[data-emaillistlen]').text('提取邮箱地址成功！共' + getEmailList().split('\n').length + '个');
      })
    }
  });
}
//定时0.5s循环检测已添加邮箱数量

unsafeWindow.addMailProgress = function ()
{
  var t;
  if (document.querySelectorAll('h2 .email').length < lastMailSum + addMailNum)
  {
    $('span[data-emaillistlen]').text('本次任务需生成' + addMailNum.toString() + '个邮箱，已生成' + (document.querySelectorAll('h2 .email').length - lastMailSum + 1).toString() + '个...');
    t = setTimeout('addMailProgress()', 500);
  } 
  else
  {
    $('span[data-emaillistlen]').text('生成邮箱已完成，共' + document.querySelectorAll('h2 .email').length + '个');
    clearTimeout(t);
    return;
  }
}
//获取已生成邮件地址

unsafeWindow.getEmailList = function ()
{
  var emailList = document.querySelectorAll('h2 .email'),
  i = 0,
  len = emailList.length,
  ret = [
  ];
  for (; i < len; i++) {
    ret.push(emailList[i].innerHTML.trim());
  }
  return ret.join('\n');
}
//自动生成临时邮箱地址

unsafeWindow.intervalAddEmail = function ()
{
  var addEmailBtn = document.querySelector('.btn-group button'),
  addEmailStatus = addEmailBtn.getAttribute('disabled'),
  confirmBtn = document.querySelector('input[data-bind="click: regAddr.registerAddressForce"]');
  if (document.querySelector('.btn-group button[disabled]'))
  {
    if (document.querySelectorAll('.well  h2').length > 4)
    {
      addEmailBtn.click();
    } 
    else
    {
      addEmailBtn.click();
      addEmailBtn.click();
      addEmailBtn.click();
      addEmailBtn.click();
    }
  } 
  else
  {
    confirmBtn.click();
  }
}
/*-----------------提取礼物链接------------------------*/

unsafeWindow.getGift = function ()
{
  var steamsign_eng_1 = 'You\'ve received a gift copy of the game ';
  var steamsign_eng_2 = ' on Steam';
  var steamsign_chs_1 = '您在 Steam 上收到了游戏 ';
  var steamsign_chs_2 = ' 的礼物副本';
  var gifthrefsign = 'account';
  var result = '';
  var status = '';
  var err_infor = '';
  var no_err = 0;
  var no_succ = 0;
  var gametitle = '';
  var gifthref = '';
  var allmails = (document.getElementsByClassName('list-unstyled messages-list')) [0].children; //获取所有邮件
  var no_of_allmails = (document.getElementsByClassName('list-unstyled messages-list')) [0].children.length; //获取所有邮件数量
  var no_of_hiddenmails = (document.getElementsByClassName('mail-hidden')).length; //获取没有展开的邮件数量
  var unhiddenmails = document.getElementsByClassName('dl-horizontal'); //获取所有展开的邮件
  var no_of_unhiddenmails = unhiddenmails.length; //获取可领取的邮件数量
  clearbox();
  //判断邮件是否已有编号
  var mialno = document.getElementsByClassName('mialno');
  while (mialno.length !== 0)
  {
    mialno[0].remove();
  }
  //给邮件编号

  var mailnopos = document.getElementsByClassName('toggle-hidden');
  for (var n = 0; n < mailnopos.length; n++)
  {
    $(mailnopos[n]).before('<div class="mialno"><b style="font-size: 20px;">No.' + (n + 1) + '</b></div>');
  }
  for (var i = 0; i < unhiddenmails.length; i++)
  {
    //获取游戏名称
    var mailtitle = (unhiddenmails[i].getElementsByClassName('mail-subject')) [0].textContent;
    if (mailtitle.includes(steamsign_eng_1) && mailtitle.includes(steamsign_eng_2))
    {
      gametitle = (mailtitle.split(steamsign_eng_1) [1]).split(steamsign_eng_2) [0];
    } 
    else if (mailtitle.includes(steamsign_chs_1) && mailtitle.includes(steamsign_chs_2))
    {
      gametitle = (mailtitle.split(steamsign_chs_1) [1]).split(steamsign_chs_2) [0];
    } 
    else
    {
      no_err++;
      err_infor = err_infor + '<p><b style="color: red">获取第' + (i + 1) + '封邮件的礼物链接失败，请确认是否为Steam礼物邮件</b></p>';
      continue;
    }
    //获取邮件内容

    var mailroot = unhiddenmails[i].parentElement;
    var mailcontent = mailroot.getElementsByTagName('pre') [0];
    //获取邮件中的所有链接
    var allhref = mailcontent.getElementsByTagName('a');
    for (var j = 0; j < allhref.length; j++)
    {
      if (allhref[j].href.includes(gifthrefsign))
      {
        gifthref = allhref[j];
        no_succ++;
        break;
      }
    }
    if (name_switcher.checked)
    {
      result = result + gametitle + ', ' + gifthref + '\n';
    } 
    else
    {
      result = result + gifthref + '\n';
    }
  }
  status = status + '<p><b style="font-style:bold;color:#31708f;">邮件总数：' + no_of_allmails + '；</b>';
  var no_of_hiddenmails_color = '#31708f';
  if (no_of_hiddenmails !== 0)
  {
    no_of_hiddenmails_color = 'red';
  }
  status = status + '<b style=" font-style:bold;color:' + no_of_hiddenmails_color + ';">未展开邮件：' + no_of_hiddenmails + '；</b>';
  var no_succ_color = '#31708f';
  if (no_succ === 0)
  {
    no_succ_color = 'red';
  }
  status = status + '<b style="color:' + no_succ_color + ';">成功获取：' + no_succ + '；</b>';
  var no_err_color = '#31708f';
  if (no_err !== 0)
  {
    no_err_color = 'red';
  }
  status = status + '<b  style="color:' + no_err_color + ';">获取失败：' + no_err + ' </b></p>';
  document.getElementById('giftmessage').value = result;
  statusbox.innerHTML = status + err_infor;
};
unsafeWindow.clearbox = function ()
{
  document.getElementById('giftmessage').value = '';
  statusbox.innerHTML = '<b>邮件收取完毕后，请点击上方“提取礼物链接”按钮</b>';
};
if (location.href.indexOf('dropmail.me') > - 1) {
  clearbox();
}
