// ==UserScript==
// @name         TGFC ban troll
// @namespace    http://club.tgfcer.com/20060602
// @version      0.92
// @license      MIT
// @description  让讨厌的苍蝇走开！屏蔽指定用户的主帖和回帖，感谢原作者 taxidriver、jun4rui、20060602
// @author       popyoung
// @supportURL	 popyoung@163.com
// @include      http://*.tgfcer.com/*
// @include      http://*.tgfcer.net/*
// @include      https://*.tgfcer.com/*
// @include      https://*.tgfcer.net/*
// @grant        GM.xmlHttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/525495/TGFC%20ban%20troll.user.js
// @updateURL https://update.greasyfork.org/scripts/525495/TGFC%20ban%20troll.meta.js
// ==/UserScript==

//  console.log('Hello Tgfcer from "tgfc-ban-troll.js".');
'use strict';
//	global datas for storage
var BanList, BanListArray, ShowBanTip, BanTip, BanNegJisao, JisaoMin, BanQuote;
var CookieName = "TgfcBanTrollData";
var MenuTitle = "让TGFCER更美好的设置，由 taxidriver、jun4rui 两位坛友原创，并由 20060602 改进 v" + version();
var MenuText = 'TGGM<span style="font-size:.75em">(v' + version() + ')</span>'
var UserName = null;
var DownloadSuccessMessage = `数据下载成功，请：\n\n  点击"TGGM"关闭面板，保存到本地；或者\n  (不点"TGGM")刷新页面，继续用本地数据。`;
var UpDownTitle = "相同用户名的数据，可跨设备、浏览器、域名同步，\n纯手动，每次同步都需要先上传、再下载。\n免费存储服务，服务器数据可能不定期清除。";
var MagicVersion = "0.92";

function getBanArrayReasonPart(text) {
  if (text.includes(':')) {
    return " 理由：" + text.split(':')[1];
  }
  return "";
}

// console.log('The Begin of logic.');
main();

function main() {
  Array.prototype.contains = contains;
  loadData();
  test();
  //console.log('Data loaded.');
  if (underWapUrls()) {
    processWap();
  } else if (underWebUrls()) {
    // console.log('gonna execute processWeb.');
    processWeb();
  }
}

function supportGMv4() {
  var nonSupportBrowsers = ["Via"];
  var handler = GM_info.scriptHandler;
  if (nonSupportBrowsers.includes(handler)) {
    return false;
  }
  return true;
}

function version() {
  if (supportGMv4()) {
    return GM_info.script.version;
  }
  return MagicVersion;
}

function getXHR() {
  if (supportGMv4()) {
    return GM.xmlHttpRequest;
  }
  return null;//GM_xmlhttpRequest;
}

// UserName related start
function getUserName() {
  return UserName;
}

function setUserName(userName) {
  UserName = userName;
}
// UserName related end

function underWapUrls() {
  // console.log('Using new underWapUrls().');
  var wapUrls = [
    'http://club.tgfcer.com/wap/',
    'http://wap.tgfcer.com/',
    'http://club.tgfcer.net/wap/',
    'http://wap.tgfcer.net/',
    'https://club.tgfcer.com/wap/',
    'https://wap.tgfcer.com/',
    'https://club.tgfcer.net/wap/',
    'https://wap.tgfcer.net/',
    'http://s.tgfcer.com/wap/',
    'https://s.tgfcer.com/wap/',
    'http://s.tgfcer.net/wap/',
    'https://s.tgfcer.net/wap/'
  ];
  return underURLs(wapUrls);
}

function underWebUrls() {
  // console.log('Using new underWebUrls().');
  var webUrls = [
    'http://club.tgfcer.com/',
    'http://club.tgfcer.net/',
    'https://club.tgfcer.com/',
    'https://club.tgfcer.net/',
    'http://bbs.tgfcer.com/',
    'http://bbs.tgfcer.net/',
    'https://bbs.tgfcer.com/',
    'https://bbs.tgfcer.net/',
    'http://s.tgfcer.com/',
    'http://s.tgfcer.net/',
    'https://s.tgfcer.com/',
    'https://s.tgfcer.net/'
  ];
  return underURLs(webUrls);
}

//console.log('The End of logic.');

function getLocalStorage(name, defaultValue) {
  if (typeof (localStorage[name]) === 'undefined') {
    localStorage[name] = defaultValue;
    // console.log(name + ' initialed with:' + defaultValue);
  }
  return localStorage[name];
}

function postLoad() {
  BanListArray = BanList.split(',');
  JisaoMin = parseInt(localStorage.JisaoMin);
  var idxEmpty = BanListArray.indexOf('');
  if (idxEmpty !== -1) {
    BanListArray.splice(idxEmpty, 1);
  }
}

function loadData() {
  //先判断有没有localStorage保存的设置数据，没有则新建
  BanList = getLocalStorage('BanList', '');
  ShowBanTip = getLocalStorage('ShowBanTip', true) === 'true';
  BanTip = getLocalStorage('BanTip', 'Blocked!!!!!');
  BanNegJisao = getLocalStorage('BanNegJisao', false) === 'true';
  JisaoMin = getLocalStorage('JisaoMin', 0);
  BanQuote = getLocalStorage('BanQuote', false) === 'true';

  postLoad();
  // console.log(localStorage);
}

function getJsonValue(key, defaultValue, jobj) {
  if (!jobj.hasOwnProperty(key)) {
    jobj[key] = defaultValue;
  }
  return jobj[key];
}

function saveData(banList, showTip, banTip, banNegJisao, jisaoMin, banQuote) {
  BanList = banList;
  ShowBanTip = showTip;
  BanListArray = BanList.split(',');
  localStorage.BanList = BanList;
  localStorage.ShowBanTip = ShowBanTip;
  localStorage.BanTip = banTip;

  if (banNegJisao !== undefined) {
    localStorage.BanNegJisao = banNegJisao;
  }

  if (jisaoMin !== undefined) {
    localStorage.JisaoMin = jisaoMin;
  }

  if (banQuote !== undefined) {
    localStorage.BanQuote = banQuote;
  }

  BanTip = localStorage.BanTip;
}

function getJson(banList, showBanTip, banTip, banNegJisao, jisaoMin, banQuote) {
  json = {
    BanList: banList,
    ShowBanTip: showBanTip,
    BanTip: banTip,
    BanNegJisao: banNegJisao,
    JisaoMin: jisaoMin,
    BanQuote: banQuote
    // ,un: getUserName()
  };
  var jstr = JSON.stringify(json);
  return jstr;
}

function loadJson(jstr) {
  var jdata;
  try {
    jdata = JSON.parse(jstr);
  } catch (err) {
    console.log(err);
    return false;
  }
  if (!jdata.hasOwnProperty('BanList')) {
    return false;
  }
  BanList = getJsonValue('BanList', '', jdata);
  ShowBanTip = getJsonValue('ShowBanTip', true, jdata);
  BanTip = getJsonValue('BanTip', 'Blocked!!!!!', jdata);
  BanNegJisao = getJsonValue('BanNegJisao', false, jdata);
  JisaoMin = getJsonValue('JisaoMin', 0, jdata);
  BanQuote = getJsonValue('BanQuote', false, jdata);
  // console.log(getJsonValue('ShowBanTip', true, jdata));
  postLoad();
  return true;
}

function getTopLevelDomain() {
  var parts = document.domain.split('.');
  var l = parts.length;
  if (l < 2) {
    return document.domain;
  }
  return '.' + parts[l - 2] + '.' + parts[l - 1];
}

function instanceEditBanList(funcEdit) {
  loadData();
  funcEdit();
  saveData(BanListArray.join(','), ShowBanTip, BanTip, BanNegJisao, JisaoMin.toString(), BanQuote);
}

function removeFromBanList(username) {
  instanceEditBanList(function () {
    BanListArray = BanListArray.filter((element) => {
      // 先确保元素是字符串
      if (typeof element === 'string') {
        const parts = element.split(':');
        // 若分割后的第一部分不等于指定的 username，则保留该元素
        let r = parts[0] !== username;
        return r;
      }
      return true;
    });
  });
  location.reload();
}

function addToBanList(nameAndReason) {
  // console.log("gonna remove username:" + username);
  // console.log(BanListArray);
  instanceEditBanList(function () {
    for (const element of BanListArray) {
      // 直接分割原有元素获取前半部分作为键
      if (element.split(':')[0] === nameAndReason.split(':')[0]) {
        return;
      }
    }
    BanListArray.push(nameAndReason);
  });
  location.reload();
}


function processWap() {
  //不让图片尺寸超过屏幕的最大宽度，有时候图片太大了看起来好累
  addGlobalStyle('div.message>img {max-width:100%;}');
  addGlobalStyle('#tgbs button {padding:2px .8em;margin-right:.5em;}');
  //让顶部导航栏浮动固定
  addGlobalStyle('#scroller>.navbar {position:fixed;height:28px;line-height:28px;width:100%;top:0;left:0;box-shadow: 5px 1px 5px #888888;} body {padding-top:36px;}');
  addGlobalStyle('#scroller>.navigation {position:fixed;height:28px;line-height:28px;width:100%;top:0;left:0;box-shadow: 5px 1px 5px #888888;} body {padding-top:36px;}');

  addWapLink();

  //在原生导航栏中加入设置模块
  //console.log($('a[href="#bottom"]').parent().parent());
  var hookPoint = $('div.navbar');
  if (hookPoint.length === 0) {
    hookPoint = $('a[href="#bottom"]').parent().parent();
    hookPoint.append('<li><a href="#" class="nav_link" id="tgbs-btn" title="' + MenuTitle + '">' + MenuText + '</a></li>');
  } else {
    hookPoint.append('&nbsp;|&nbsp;<a href="#" class="nav_link" id="tgbs-btn" title="' + MenuTitle + '">' + MenuText + '</a>');
    hookPoint.css('z-index', 2);
  }
  //点击模块的处理
  $('#scroller').delegate('#tgbs-btn', 'click', function (e) {
    e.preventDefault();
    if ($('#tgbs').css('display') == 'none') {
      loadData();
      wapLoadUserName();
      $('#tgbs').css({ 'display': '' });
      // $('#tgbs').css('top', $('#tgbs-btn').position().top + 20);
      $('#tgbs').css('top', '32px');
      $('#tgbs').css('left', 2);
      $('#tgbs textarea').focus();
    } else {
      //关闭设置菜单时，关闭设置面板
      saveAndClose();
    }
  });
  function saveAndClose() {
    $('#tgbs').css({ 'display': 'none' });
    // 保存数据到localStorage
    savePanelData();
  }
  // save panel data
  function savePanelData() {
    BanList = $('#banlist-textarea').val();
    BanListArray = BanList.split(',');
    ShowBanTip = $("#showBanTip").prop('checked');
    BanTip = $('#ban-tip').val();
    BanQuote = $("#banQuote").prop('checked');
    saveData(BanList, ShowBanTip, BanTip, undefined, undefined, BanQuote);
  }
  // pop panel data
  function popWapPanelData(banList, showBanTip, banTip, banQuote,) {
    $('#banlist-textarea').val(banList);
    $("#showBanTip").prop('checked', showBanTip);
    $('#ban-tip').val(banTip);
    $("#banQuote").prop('checked', banQuote);
  }
  //在原生导航栏下面加入设置表单
  //$('div.navbar')
  hookPoint.append('<div id="tgbs" class="list_item_top" style="z-index:999;color:#f0f0f0;border-radius:.25em;width:356px;padding:.25em;position:fixed; display:none; overflow:hidden;box-shadow: rgb(51, 51, 51) 1px 1px 19px;background-color: #436193;">' +
    '<div style="vertical-align:bottom;">' +
    '<p style="float:left;margin-top:6px;">屏蔽ID列表:</p>' +
    '<p style="float:right;padding-bottom:2px;"><button id="save-close" style="margin-right:0;">Save & Close</button></p>' +
    '</div>' + '<div style="clear: both;"></div>' +
    '<textarea id="banlist-textarea" style="width:350px;height:160px;resize:vertical;padding:2px;">' + BanList + '</textarea>' +
    '<form><input id="showBanTip" type="checkbox" name="showBanTip" ' + (ShowBanTip ? "checked" : "") + ' /> 显示屏蔽提示&nbsp;|&nbsp;' +
    '提示信息&nbsp;<input id="ban-tip" style="font-size:1em;padding:2px;padding-left:4px;margin:0px;margin-top:5px;width:196px;" value="' + BanTip + '"/>' +
    '<hr/> <input id="banQuote" type="checkbox" name="banQuote" ' + (BanQuote ? "checked" : "") + ' /> 如果该用户位于屏蔽列表，屏蔽其被引用的发言' +
    '</form>' +
    '<hr/> <button id="sort-list">排序屏蔽列表</button>' +
    '<button id="download" title="' + UpDownTitle + '">下载</button>' +
    '<button id="upload" title="' + UpDownTitle + '">上传</button>' +
    '<button id="erase" title="' + UpDownTitle + '">擦除</button>' +
    '<hr> <a href="https://s.tgfcer.com/wap/index.php?action=my" style="color:#f0f0f0;">水区我的</a>' +
    '</div>');

  //点击屏蔽区将展开屏蔽内容
  $('#scroller').delegate('.list-ban-section', 'click', function (e) {
    e.preventDefault();
    var targetNode = $(this).parent().parent();
    if (targetNode.css('height') == '21px') {
      targetNode.css({ 'height': 'auto' });
    } else {
      targetNode.css({ 'height': '21px' });
    }
  });

  var btnSaveAndClose = document.getElementById("save-close");
  btnSaveAndClose.onclick = function (e) {
    e.preventDefault();
    saveAndClose();
  }

  var btnSortList = document.getElementById("sort-list");
  btnSortList.onclick = function (e) {
    e.preventDefault();
    var textareaBanList = document.getElementById('banlist-textarea');
    sortBanList(textareaBanList);
  }

  var btnDownload = document.getElementById("download");
  btnDownload.onclick = function (e) {
    e.preventDefault();
    fetchFromCloud((json) => {
      // console.log(json);
      popWapPanelData(json.BanList, json.ShowBanTip, json.BanTip, json.BanQuote);
      notify(DownloadSuccessMessage)
    });
  }

  var btnUpload = document.getElementById("upload");
  btnUpload.onclick = function (e) {
    e.preventDefault();
    pushToCloud((json) => {
      // console.log(json);
    });
  }

  var btnRemove = document.getElementById("erase");
  btnRemove.onclick = function (e) {
    e.preventDefault();
    eraseFromCloud((json) => { });
  }

  //列表页面
  var ForumPagePart = 'index.php?action=forum';
  //帖子内文页面
  var ThreadPagePart = 'index.php?action=thread';

  //如果当前页面是列表页面的处理
  if (hasURLPart(ForumPagePart)) {
    //console.log('当前在列表页面');
    $('.dTitle').each(function () {
      var author = $(this).find('span.author').text();
      for (let ele of BanListArray) {
        //判断发帖人是否在屏蔽列表中
        if (author.indexOf(ele.split(':')[0]) == 1) {
          if (!ShowBanTip) {
            $(this).css({ display: 'none' });
            continue;
          }
          $(this).prepend('<div style="width:auto;text-align:center;border:1px dashed #AAAAAA;color:#AAAAAA; line-height:19px;"><a class="list-ban-section" href="#">查看标题</a> <strong><s> ' + ele.split(':')[0] + ' </s></strong>' + getBanArrayReasonPart(ele) + ' <a class="remove-ban" href="#" value="' + ele + '">不再屏蔽</a>' + '</div>');
          $(this).css({ 'height': '21px', 'overflow': 'hidden' });
        }
      }
    });
  }

  var setDisplay = function (startNode, val) {
    startNode.css({ 'display': val });
    startNode.next().css({ 'display': val });
    startNode.next().next().css({ 'display': val });
    //        startNode.next().next().next().css({ 'display': val });
    //        startNode.next().next().next().next().css({ 'display': val });
  }
  $('#scroller').delegate('.info-ban-section', 'click', function (e) {
    e.preventDefault();
    if ($(this).parent().next().css('display') == 'none') {
      setDisplay($(this).parent().next(), 'inherit');
    } else {
      setDisplay($(this).parent().next(), 'none');
    }
  });
  $('#scroller').delegate('.remove-ban', 'click', function (e) {
    e.preventDefault();
    removeFromBanList($(this).attr('value'));
  });

  //如果当前页面是内容页的处理
  if (hasURLPart(ThreadPagePart)) {
    markJiSao();
    if (BanQuote) {
      filterQuote(function () { return document.getElementsByClassName("quote"); },
        function (node) { return node.getElementsByClassName("quote-bd"); },
        function (author, reason) {
          return author +
            '</s> ' + BanTip +
            reason;
        });
    }
    $('.infobar').each(function () {
      var author = $(this).find('a').eq(1).text();
      for (let ele of BanListArray) {
        //判断发帖人是否在屏蔽列表中
        if (author == ele.split(':')[0]) {
          if (ShowBanTip) {
            $(this).before('<div style="width:auto;text-align:center;border:1px dashed #BCBCBC;color:#BCBCBC; line-height:19px;"><a class="info-ban-section" href="#">查看内容</a> <strong><s>' + author + '</s></strong>' + getBanArrayReasonPart(ele) + ' <a class="remove-ban" href="#" value="' + author + '">不再屏蔽</a>' + '</div>');
          }
          //依次连续隐藏5个（含自己）元素
          setDisplay($(this), 'none');
        }
      }
      var authorA = $(this).find('a').eq(1);
      authorA.after(' <a class="ban-author" href="#" value="' + author + '">屏蔽</a> ');
    });
    $('#scroller').delegate('.ban-author', 'click', function (e) {
      e.preventDefault();
      addToBanList($(this).attr('value'));
    });
  }
}

function processWeb() {
  // console.log('processWeb begin');
  //   调整 “最后发表” 列的宽度，避免部分较长的 ID 导致此栏换行
  addGlobalStyle('.threadlist td.lastpost {width:160px;}');

  closeLeftAdv();
  // console.log('processWeb end');

  //在原生导航栏中加入设置模块
  var newSpan = document.createElement('span');
  newSpan.innerHTML = '<a href="#" class="nav_link" id="tgbs-btn" title="' + MenuTitle + '">' + MenuText + '</a>&nbsp;|&nbsp;';
  //  console.log(newSpan);
  var myTag = document.getElementById('my');
  setUserName(myTag.textContent);
  var hookPoint = myTag.parentNode.parentNode;
  //  console.log(hookPoint);
  hookPoint.appendChild(newSpan);
  //  console.log(navP);
  var btn = document.getElementById('tgbs-btn');
  //  console.log(btn);


  var floatDiv = createFloatDiv();
  newSpan.appendChild(floatDiv);

  var banlistTextarea = document.getElementById('ban-list');
  var showCheckbox = document.getElementById('show-ban-info');
  var banTip = document.getElementById('ban-tip');

  var banNegJisaoCheckbox = document.getElementById('ban-neg-jisao');
  var jisaoMin = document.getElementById('jisao-min');
  var banQuote = document.getElementById('ban-quote');

  //console.log(floatDiv);

  // 显示、隐藏tggm面板
  btn.onclick = function (e) {
    e.preventDefault();
    //  console.log('showCheckbox.checked:' + showCheckbox.checked + '    ShowBanTip:' + ShowBanTip);
    if (floatDiv.style.display === 'none') {
      loadData();
      floatDiv.style.display = '';
      floatDiv.style.top = getElementTop(newSpan) + 20 + 'px';
      floatDiv.style.left = getElementLeft(newSpan) - 365 + 'px';
      showCheckbox.checked = ShowBanTip;
      banlistTextarea.value = BanList;
      banlistTextarea.focus();
    } else {
      saveAndClose();
    }
  };

  function saveAndClose() {
    floatDiv.style.display = 'none';
    saveData(banlistTextarea.value, showCheckbox.checked, banTip.value, banNegJisaoCheckbox.checked, jisaoMin.value, banQuote.checked);
  }

  var btnSaveAndClose = document.getElementById('save-close');
  btnSaveAndClose.onclick = function (e) {
    e.preventDefault();
    saveAndClose();
  }

  function addBanLink(cite, author) {
    cite.innerHTML += '<a class="ban-author" href="#" value="' + author + '">屏蔽</a>';
  }

  // 列表页面
  filterBlackList(
    function () { return document.getElementsByTagName('tbody'); },
    2,
    function (author, reason) {
      return '<tr><td style="background-color:#e5e5e5" class="folder"></td><td style="background-color:#e5e5e5" class="icon"></td><th class="" style="text-align:center;"><label></label><span>' +
        '<a class="show-thread-title" href="#">查看标题</a> ' +
        '<s>' + author + '</s> ' + BanTip + reason + ' <a class="remove-ban" href="#" value="' + author + '">不再屏蔽</a>' +
        '</span></th><td style="background-color:#e5e5e5;text-align:center" class="author"></td><td class="nums"></td><td style="background-color:#e5e5e5" class="lastpost"></td></tr>';
    }
  );

  // 内容页面
  filterBlackList(
    function () { return document.getElementsByClassName('viewthread'); },
    1,
    function (author, reason) {
      return '<table cellspacing="0" cellpadding="0"><tbody><tr><td class="postauthor"></td><td class="postcontent">' +
        '<a class="show-content" href="#">查看内容</a> <s>' +
        author +
        '</s> ' + BanTip +
        reason + ' <a class="remove-ban" href="#" value="' + author + '">不再屏蔽</a>' +
        '</td></tr></tbody></table></div>';
    },
    addBanLink
  );

  var contentA = document.getElementsByClassName("show-content");
  for (var i = 0; i < contentA.length; ++i) {
    var link = contentA[i];

    link.onclick = function (e) {
      e.preventDefault();
      var targetNode = this.parentElement.parentElement.parentElement.parentElement.parentElement.nextSibling;
      if (targetNode.style.display === 'none') {
        targetNode.style.display = 'block';
      } else {
        targetNode.style.display = 'none';
      }
    }
  }

  var titleA = document.getElementsByClassName("show-thread-title");
  for (i = 0; i < titleA.length; ++i) {
    link = titleA[i];
    link.onclick = function (e) {
      e.preventDefault();
      var targetNode = this.parentElement.parentElement.parentElement.parentElement.nextSibling;
      if (targetNode.style.display === 'none') {
        targetNode.style.display = 'table-row-group';
      } else {
        targetNode.style.display = 'none';
      }
    }
  }

  var removeBanA = document.getElementsByClassName("remove-ban");
  for (i = 0; i < removeBanA.length; ++i) {
    link = removeBanA[i];
    link.onclick = function (e) {
      e.preventDefault();
      console.log(this.getAttribute('value'));
      removeFromBanList(this.getAttribute('value'));
    }
  }

  var banA = document.getElementsByClassName("ban-author");
  for (i = 0; i < banA.length; ++i) {
    link = banA[i];
    link.onclick = function (e) {
      e.preventDefault();
      console.log(this.getAttribute('value'));
      addToBanList(this.getAttribute('value'));
    }
  }

  if (BanQuote) {
    filterQuote(function () { return document.getElementsByClassName('quote'); },
      function (node) { return node.getElementsByTagName('blockquote'); },
      function (author, reason) {
        return author +
          '</s> ' + BanTip +
          reason;
      });
  }

}



//添加全局CSS样式的方法
function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

function markJiSao() {
  //正激骚
  addGlobalStyle('a.positive-sao {color:#f00;}');
  //负激骚
  addGlobalStyle('a.negative-sao {color:#00bb00;}');

  var regex = /^骚\((-?\d+)\)$/g;
  $('a').each(function () {
    var atag = $(this);
    var match = regex.exec(atag.text());
    if (match && match[1] != '0') {
      //console.log(match[1]);
      if (match[1].indexOf('-') === 0) {
        atag.addClass("negative-sao");
      } else {
        atag.addClass("positive-sao");
      }
    }
  });
}


function addWapLink() {
  var webLink = /^http:\/\/club\.tgfcer\.com\/thread-([\d]+)-.+html/ig;
  var webLinkNet = /^http:\/\/club\.tgfcer\.net\/thread-([\d]+)-.+html/ig;
  var tidStr = 'http://wap.tgfcer.com/index.php?action=thread&tid=TidDummy&sid=&vt=1&tp=100&pp=100&sc=0&vf=0&sm=0&iam=&css=&verify=&fontsize=0';
  var tidStrNet = 'http://club.tgfcer.net/wap/index.php?action=thread&tid=TidDummy&sid=&vt=1&tp=100&pp=100&sc=0&vf=0&sm=0&iam=&css=&verify=&fontsize=0';

  var webLinkS = /^https:\/\/club\.tgfcer\.com\/thread-([\d]+)-.+html/ig;
  var webLinkNetS = /^https:\/\/club\.tgfcer\.net\/thread-([\d]+)-.+html/ig;
  var tidStrS = 'https://wap.tgfcer.com/index.php?action=thread&tid=TidDummy&sid=&vt=1&tp=100&pp=100&sc=0&vf=0&sm=0&iam=&css=&verify=&fontsize=0';
  var tidStrNetS = 'https://club.tgfcer.net/wap/index.php?action=thread&tid=TidDummy&sid=&vt=1&tp=100&pp=100&sc=0&vf=0&sm=0&iam=&css=&verify=&fontsize=0';

  var tags = document.getElementsByTagName('a');
  for (var i = 0; i < tags.length; ++i) {
    var tag = tags[i];
    tryConvert(tag, webLink, tidStr);
    tryConvert(tag, webLinkNet, tidStrNet);

    tryConvert(tag, webLinkS, tidStrS);
    tryConvert(tag, webLinkNetS, tidStrNetS);
    continue;
    var href = tag.href;
    var execResult = webLink.exec(href);
    if (execResult) {
      var threadId = execResult[1];
      var wapLink = tidStr.replace('TidDummy', threadId);
      //console.log(wapLink);
      var newSpan = document.createElement('span');
      newSpan.innerHTML = '&nbsp;&nbsp;<a href="' + wapLink + '" title="">(wap点我)</a>&nbsp;';
      tag.parentNode.insertBefore(newSpan, tag.nextSibling);
    }
  }
}

function tryConvert(aTag, regex, targetPattern) {
  var href = aTag.href;
  var execResult = regex.exec(href);
  if (execResult) {
    var threadId = execResult[1];
    var wapLink = targetPattern.replace('TidDummy', threadId);
    //console.log(wapLink);
    var newSpan = document.createElement('span');
    newSpan.innerHTML = '&nbsp;&nbsp;<a href="' + wapLink + '" title="">(wap点我)</a>&nbsp;';
    aTag.parentNode.insertBefore(newSpan, aTag.nextSibling);
  }
}

function getElementTop(element) {
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
}

function getElementLeft(element) {
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  return actualLeft;
}

function popPanel(banList, showBanTip, banTip, banNegJisao, jisaoMin, banQuote) {
  var banlistTextarea = document.getElementById('ban-list');
  var showCheckbox = document.getElementById('show-ban-info');
  var banTipText = document.getElementById('ban-tip');
  var banNegJisaoCheckbox = document.getElementById('ban-neg-jisao');
  var jisaoMinNumber = document.getElementById('jisao-min');
  var banQuoteCheckBox = document.getElementById('ban-quote');

  banlistTextarea.value = banList;
  showCheckbox.checked = showBanTip;
  banTipText.value = banTip;
  banNegJisaoCheckbox.checked = banNegJisao;
  jisaoMinNumber.value = jisaoMin;
  banQuoteCheckBox.checked = banQuote;
}

function createFloatDiv() {
  var floatDiv = document.createElement('div');
  floatDiv.setAttribute('id', 'tgbs');
  floatDiv.setAttribute('style', 'color:#FFF;width:400px;border-radius:.25em;padding:.25em;position:fixed; display:none; overflow:hidden;box-shadow: rgb(51, 51, 51) 1px 1px 19px;background-color: #00b23d;text-align:left;');
  var titleText = document.createElement('div');
  titleText.innerHTML = '<p style="float:left;margin-top:8px;">屏蔽ID列表:<p><p style="float:right;margin-bottom:2px;"><button id="save-close">Save & Close</button><p>';
  floatDiv.appendChild(titleText);
  var banlistTextarea = document.createElement('textarea');
  banlistTextarea.setAttribute('id', 'ban-list');
  banlistTextarea.style.width = '98%';
  banlistTextarea.style.height = '160px';
  banlistTextarea.style.marginBottom = '4px';
  banlistTextarea.style.resize = 'vertical';
  banlistTextarea.value = BanList;
  floatDiv.appendChild(banlistTextarea);


  var form = document.createElement('form');
  floatDiv.appendChild(form);
  var showCheckbox = document.createElement('input');
  form.appendChild(showCheckbox);
  showCheckbox.setAttribute('type', 'checkbox');
  showCheckbox.setAttribute('id', 'show-ban-info');
  showCheckbox.checked = ShowBanTip;

  var checkText = document.createElement('span');
  checkText.innerHTML = '显示屏蔽提示&nbsp;&nbsp;|&nbsp;&nbsp;提示信息&nbsp;';
  form.appendChild(checkText);

  var banTip = document.createElement('input');
  form.appendChild(banTip);
  banTip.setAttribute('type', 'text');
  banTip.setAttribute('id', 'ban-tip');
  banTip.style.fontSize = '1em';
  banTip.style.padding = '0px 5px';
  banTip.style.margin = '0px';
  banTip.style.width = '200px';
  //  banTip.style.color = '#cc0000';
  banTip.value = BanTip;

  var lineBreak = document.createElement('hr');
  form.appendChild(lineBreak);

  var banNegJisaoCheckbox = document.createElement('input');
  form.appendChild(banNegJisaoCheckbox);
  banNegJisaoCheckbox.setAttribute('type', 'checkbox');
  banNegJisaoCheckbox.setAttribute('id', 'ban-neg-jisao');
  banNegJisaoCheckbox.checked = BanNegJisao;

  var checkTextBanNegJiSao = document.createElement('span');
  checkTextBanNegJiSao.innerHTML = '屏蔽，如果该用户激骚小于&nbsp;';
  form.appendChild(checkTextBanNegJiSao);

  var jisaoMin = document.createElement('input');
  form.appendChild(jisaoMin);
  jisaoMin.setAttribute('type', 'number');
  jisaoMin.setAttribute('id', 'jisao-min');
  jisaoMin.style.fontSize = '1em';
  jisaoMin.style.padding = '0px 5px';
  jisaoMin.style.margin = '0px';
  jisaoMin.style.width = '112px';
  //  jisaoMin.style.color = '#cc0000';
  jisaoMin.value = JisaoMin;

  lineBreak = document.createElement('hr');
  form.appendChild(lineBreak);

  var banQuoteCheckbox = document.createElement('input');
  form.appendChild(banQuoteCheckbox);
  banQuoteCheckbox.setAttribute('type', 'checkbox');
  banQuoteCheckbox.setAttribute('id', 'ban-quote');
  banQuoteCheckbox.checked = BanQuote;

  var checkTextBanQuote = document.createElement('span');
  checkTextBanQuote.innerHTML = '如果该用户位于屏蔽列表，屏蔽其被引用的发言';
  form.appendChild(checkTextBanQuote);

  lineBreak = document.createElement('hr');
  form.appendChild(lineBreak);

  function createButton(caption, onclick, id = null) {
    var btn = document.createElement('BUTTON');
    var text = document.createTextNode(caption); // Create a text node
    btn.appendChild(text); // Append the text to <button>
    btn.style.marginRight = '0.4em';
    if (id)
      btn.setAttribute('id', id);
    form.appendChild(btn);
    if (onclick)
      btn.onclick = onclick;
    return btn;
  }

  function jisaoEditable(e) {
    e?.preventDefault();
    var taReason = document.getElementsByName('reason');
    //console.log(taReason);
    if (taReason) {
      for (var i = 0, len = taReason.length; i < len; i++) {
        var ta = taReason[i];
        ta.removeAttribute('readonly');
      }
    }

    jisaoNoPM();
    return false;
  }
  var btnJisaoEdit = createButton('让“激骚理由”可编辑', jisaoEditable);

  function sortList(e) {
    e.preventDefault();
    sortBanList(banlistTextarea);
  }
  var btnSortBanList = createButton('排序屏蔽列表', sortList);

  function downloadData(e) {
    e.preventDefault();
    fetchFromCloud((json) => {
      console.log(json);
      popPanel(json.BanList, json.ShowBanTip, json.BanTip, json.BanNegJisao, json.JisaoMin, json.BanQuote);
      notify(DownloadSuccessMessage)
    });
  }
  var btnDownload = createButton('下载', downloadData, 'btn-download');
  btnDownload.setAttribute('title', UpDownTitle);

  function uploadData(e) {
    e.preventDefault();
    pushToCloud((json) => {
      // console.log(json);
    });
  }
  var btnUpload = createButton('上传', uploadData, 'btn-upload');
  btnUpload.setAttribute('title', UpDownTitle);

  function eraseData(e) {
    e.preventDefault();
    eraseFromCloud((json) => {
      // console.log(json);
    });
  }
  var btnErase = createButton('擦除', eraseData, 'btn-erase');
  btnErase.setAttribute('title', UpDownTitle);

  return floatDiv;
}

function jisaoNoPM(event) {
  var taReason = document.getElementsByName('sendreasonpm');
  //console.log(taReason);
  if (taReason) {
    for (var i = 0, len = taReason.length; i < len; i++) {
      var ta = taReason[i];
      ta.removeAttribute('disabled');
    }
  }

  //event.preventDefault();
  return false;
}

function sortBanList(textareaBanList) {
  function onlyUnique(value, index, self) {
    return value && self.indexOf(value) === index;
  }
  function startWithASCII(s) {
    if (s.length > 0) {
      var code = s.charCodeAt(0);
      return code < 256;
    }
    return false;
  }
  function pinyinCompare(a, b) {
    var aIsASCII = startWithASCII(a);
    var bIsASCII = startWithASCII(b);
    if (aIsASCII == bIsASCII) {
      return a.localeCompare(b, "zh");
    }
    if (aIsASCII) {
      return -1;
    }
    return 1;
  }

  BanListArray.sort(pinyinCompare);
  BanListArray = BanListArray.filter(onlyUnique);
  BanList = BanListArray.join(',');
  // console.log(BanList);
  textareaBanList.value = BanList;
}

function banReason(node, cite, author) {
  if (cite[0].getElementsByTagName('a')[0] == null) {
    return null;
  }

  author = cite[0].getElementsByTagName('a')[0].innerHTML;
  //遍历BanListArray，判断元素中前半部分是否包含该用户
  for (var ele of BanListArray) {
    //console.log(BanListArray[i]);
    if (ele.split(':')[0] == author) {
      return getBanArrayReasonPart(ele);
    }
  }

  if (BanNegJisao) {
    var dl = node.getElementsByTagName('dl');
    if (dl && dl.length > 0) {
      dl = dl[0];
      var dds = dl.getElementsByTagName('dd');
      var jisaoText = dds[3].innerText;
      var jisao = parseInt(jisaoText);
      //                     console.log(jisao);
      if (jisao < JisaoMin) {
        return ' 激骚值：' + jisao;
      }
    }
  }

  return null;
}

function filterBlackList(nodeFunc, citeCount, tipFunc, citeFunc = null) {
  var allTextareas, cite, author;
  allTextareas = nodeFunc();
  // console.log(allTextareas);
  if (!allTextareas.length) {
    return;
  }

  var nodesToProcess = [];
  for (var index = 0; index < allTextareas.length; index++) {
    var node = allTextareas[index];
    cite = node.getElementsByTagName('cite');
    if (cite.length < citeCount) {
      continue;
    }

    var mainCite = cite[0];
    author = mainCite.getElementsByTagName('a')[0].innerHTML;
    if (citeFunc) {
      citeFunc(mainCite, author);
    }

    //console.log(author);
    var reason = banReason(node, cite, author);
    if (reason !== null) {
      // can't insert node in for loop, process later
      nodesToProcess.push(node);
    }
  }

  nodesToProcess.forEach(function (node) {
    var cite = node.getElementsByTagName('cite');
    var author = cite[0].getElementsByTagName('a')[0].innerHTML;
    var reason = banReason(node, cite, author);
    if (ShowBanTip) {
      var tipNode = node.cloneNode(false);
      if (tipNode.id !== null) {
        console.log(tipNode.id)
        tipNode.id = tipNode.id + "-shadow";
      }
      tipNode.innerHTML = tipFunc(author, reason);
      node.parentNode.insertBefore(tipNode, node);
      node.style.display = 'none';
    } else {
      node.style.display = 'none';
    }
  });


}


//提取quoteText中的用户名，匹配黑名单中的用户和理由
function getUserAndReason(quoteText) {
  const regex = /^原帖由 @?(\S+?)\s{1,2}于 20(.|\n|\r)*$/;
  const user = quoteText.replace(regex, '$1');

  for (const element of BanListArray) {
    // 直接分割原有元素获取前半部分作为键
    if (element.split(':')[0] === user) {
      return [user, getBanArrayReasonPart(element)];
    }
  }
  return null;
}

function filterQuote(nodeFunc, bqFunc, tipFunc) {
  let allTextareas, blockquote;
  allTextareas = nodeFunc();
  // console.log(allTextareas.length);
  if (!allTextareas.length) {
    return;
  }

  for (var index = 0; index < allTextareas.length; index++) {
    var node = allTextareas[index];
    blockquote = bqFunc(node);
    if (blockquote.length <= 0) {
      continue;
    }

    // console.log(blockquote);
    let result = getUserAndReason(blockquote[0].innerText);
    if (result) {
      let [author, reason] = result;
      if (ShowBanTip) {
        var div = document.createElement("div");
        div.appendChild(createReadA());
        div.appendChild(createTip(author, reason));
        div.appendChild(createRemoveA(author));
        node.prepend(div);
        setDisplay(div.nextSibling, 'none');
      } else {
        var br = document.createElement("br");
        node.parentNode.insertBefore(br, node);
        node.style.display = 'none';
      }

      function setDisplay(targetNode, val) {
        targetNode.style.display = val;
        if (targetNode.nextSibling) {
          targetNode.nextSibling.style.display = val;
        }
      }
      function createReadA() {
        var readA = document.createElement("a");
        var text = document.createTextNode("查看内容");
        readA.appendChild(text);
        readA.href = "#"
        readA.onclick = function (e) {
          e.preventDefault();
          var targetNode = this.parentElement.nextSibling;
          if (targetNode.style.display == 'none') {
            setDisplay(targetNode, 'block');
          } else {
            setDisplay(targetNode, 'none');
          }
        };
        return readA;
      }

      function createTip(a, r) {
        var span = document.createElement('span');
        span.innerHTML = ' <s>' + tipFunc(a, r) + ' ';
        return span;
      }

      function createRemoveA(a) {
        var removeA = document.createElement("a");
        var text = document.createTextNode("不再屏蔽");
        removeA.appendChild(text);
        removeA.href = "#"
        removeA.onclick = function (e) {
          e.preventDefault();
          removeFromBanList(a);
        };
        return removeA;
      }
    }

  }
}

function underURLs(urls) {
  //console.log('underURLs begin')
  var PageCurrent = window.location.href;

  var result = false;
  for (var i = 0; i < urls.length; i++) {
    var prefix = urls[i];
    if (PageCurrent.indexOf(prefix) === 0) {
      result = true;
      break;
    }
  }

  //console.log('underURL returned with: ' + result);
  return result;
}

function hasURLPart(part) {
  var PageCurrent = window.location.href;
  return PageCurrent.indexOf(part) >= 0;
}

function contains(obj) {
  var index = this.length;
  while (index--) {
    if (this[index] === obj) {
      return true;
    }
  }
  return false;
}

function closeLeftAdv() {
  if (true) {
    return;
  }
  console.log('closeLeftAdv begin');
  writeCookie('leftadv1', '1', 700);
  document.getElementById('leftadv').style.display = 'none';
  document.getElementById('content_main').style.margin = '0 0 0 0';
  console.log('closeLeftAdv end');
}

function wapLoadUserName(callback = null) {
  if (getUserName() !== null) {
    // already fetched
    if (callback != null) {
      callback(getUserName());
    }
    return;
  }
  var aTag = Array.from(document.querySelectorAll("#footer a")).find(a => a.textContent == "我的")
  // console.log(aTag);
  if (!aTag) return;
  var url = aTag.href;
  var xhr = getXHR();
  if (xhr === null) {
    return;
  }
  xhr({
    method: "GET",
    url: url,
    onload: function (response) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(response.responseText, "text/html");
      var a = Array.from(doc.querySelectorAll('#scroller a')).find(a => a.textContent === '>>web')
      var un = a.parentElement.getElementsByTagName('b')[0].textContent;

      setUserName(un);
      if (callback != null) {
        callback(getUserName());
      }
      // console.log(`UserName is: ${getUserName()}`)
    }
  });
}

//
//  test function to test newly developing feature
//
async function test() {
}

function notify(message) {
  alert(message);
}

// cloud storage related start
var SALT = "fd6ca0ea-5bad-438e-8be5-be26e7d9ead0";
async function genKey(userStr) {
  // console.log(`gonna genKey for userStr: ${userStr}`);
  var key = await sha256(userStr + SALT);
  return key;
}

function UrlBase() {
  // return "http://localhost:5000/kv";
  // return "http://localhost:3000/kv";
  // return "https://housekeeper1997.pythonanywhere.com/kv";
  return "https://kvlite.vercel.app/kv";
}
async function fetchFromCloud(callback) {
  var userKey = await genKey(getUserName());
  // console.log(`gonna fetch for userKey: ${userKey}`);
  var xhr = getXHR();
  if (xhr === null) {
    alert("Browser not support:\n  GM.xmlHttpRequest!");
    return;
  }
  xhr({
    method: "GET",
    url: UrlBase() + "/" + userKey,
    onload: function (response) {
      // console.log(response.responseText);
      var data = JSON.parse(response.responseText)
      if (!data.hasOwnProperty('value')) {
        notify(`下载操作结果：${data.result}(${data.desc})`);
        return;
      }
      var time = new Date(parseFloat(data.time) * 1000)
      // console.log(`last upload time: ${time}`);
      var jobj = JSON.parse(data.value);
      callback(jobj);
    },
    onerror: function (response) {
      notify(`下载操作结果：失败（数据未传输）`);
    }
  });
}

async function pushDataToCloud(callback, data, opName) {
  var userKey = await genKey(getUserName());
  var banData = data;
  // console.log(banData);
  var data = { key: userKey, value: banData };
  // console.log(data);

  var xhr = getXHR();
  if (xhr === null) {
    alert("Browser not support:\n  GM.xmlHttpRequest!");
    return;
  }
  xhr({
    method: "POST",
    url: UrlBase(),
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function (response) {
      // console.log(response.responseText);
      try {
        var json = JSON.parse(response.responseText);
        notify(`${opName}操作结果：${json.result}(${json.desc})`);
        // console.log(json);
        callback(json);
      } catch (SyntaxError) {
        notify(`${opName}操作结果：失败（服务器内部错误）`);
      }
    },
    onerror: function (response) {
      notify(`${opName}操作结果：失败（数据未传输）`);
    }
  });
}

async function pushToCloud(callback) {
  var banData = getJson(BanList, ShowBanTip, BanTip, BanNegJisao, JisaoMin, BanQuote);
  await pushDataToCloud(callback, banData, "上传");
}

async function eraseFromCloud(callback) {
  await pushDataToCloud(callback, "{}", "擦除");
}


// cloud storage related end

// digest functions
async function sha1(d) { return await digest(d, "SHA-1"); }
async function sha256(d) { return await digest(d, 'SHA-256'); }
async function digest(data, algorithm) {
  // console.log(`gonna digest for data: ${data} with algorithm: ${algorithm}`);
  // encode as UTF-8
  const msgBuffer = new TextEncoder('utf-8').encode(data);

  // hash the message
  const hashBuffer = await window.crypto.subtle.digest(algorithm, msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  // console.log(hashHex);
  return hashHex;
}
