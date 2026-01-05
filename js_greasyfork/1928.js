/*
// ==UserScript==
// @name           BNM
// @description    Everyone knew, no one cared
// @author         ppcatalny
// @version        7.1 beta
// @license        MIT License
// @encoding       utf-8
// @require        http://code.jquery.com/jquery-2.1.1.js
// @require        https://greasyfork.org/scripts/4274-filesaver-js/code/FileSaverjs.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @include        http://bangumi.tv/*
// @include        http://bgm.tv/*
// @include        http://chii.in/*
// @include        https://bangumi.tv/*
// @include        https://bgm.tv/*
// @include        https://chii.in/*
// @namespace https://github.com/hentaiPanda
// @downloadURL https://update.greasyfork.org/scripts/1928/BNM.user.js
// @updateURL https://update.greasyfork.org/scripts/1928/BNM.meta.js
// ==/UserScript==
 */
var addSettingBtn, batchDelete, bkbackup, bksetting, block, checkAll, cleanUp, davtCheckList, davtGetLimit, davtSetLimit, delAvatar, delData, erasentf, exportData, exportFile, formatNum, getData, getTm, getUidFromAvat, hideOP, importData, importFace, importFile, importOldData, listItems, main, notify, pmAutoDel, pmcompose, refreshIndexList, refreshListItems, refreshTbodyList, refreshTopicList, refreshTsukkomi, removeDAvt, searchAvatar, searchData, setAvatar, setData, switchUserIntro, topic, unblock, uncheckAll, userpage;

getData = function(name) {
  var users;
  if (name == null) {
    name = "shikabane";
  }

  /*
  users = [ id1-id2-avts1-avts2, id1-id2-avts1-avts2]
  avatar = 00-24 or dft-dft
  name is "shikabane"
   */
  users = GM_getValue(name, []);
  return users;
};

setData = function(value) {
  var db;
  db = getData();
  db.push(value);
  return GM_setValue("shikabane", db);
};

delData = function(id) {
  var db, i, j, len, newdb;
  db = getData();
  newdb = [];
  for (j = 0, len = db.length; j < len; j++) {
    i = db[j];
    if (i[0] !== id && i[1] !== id) {
      newdb.push(i);
    }
  }
  return GM_setValue("shikabane", newdb);
};

searchData = function(id) {
  var db, i, j, len;
  db = getData();
  for (j = 0, len = db.length; j < len; j++) {
    i = db[j];
    if (i[0] === id || i[1] === id) {
      return true;
    }
  }
  return false;
};

setAvatar = function(id1) {};

searchAvatar = function(id1) {};

delAvatar = function(id1) {};

block = function(id1, id2, avts1, avts2) {
  console.log('屏蔽');
  setData([id1, id2, avts1, avts2]);
  if (searchData(id1)) {
    switchUserIntro("none");
    $("#bkmbtn > span").text("解除屏蔽");
    $('body').off('click.bkmbtn');
    return $('body').on('click.bkmbtn', '#bkmbtn', function() {
      return unblock(id1, id2, avts1, avts2);
    });
  }
};

unblock = function(id1, id2, avts1, avts2) {
  if (id2 == null) {
    id2 = id1;
  }
  console.log('解除屏蔽');
  delData(id1);
  if (!searchData(id1)) {
    switchUserIntro("block");
    $("#bkmbtn > span").text("屏蔽");
    $('body').off('click.bkmbtn');
    return $('body').on('click.bkmbtn', '#bkmbtn', function() {
      return block(id1, id2, avts1, avts2);
    });
  }
};

switchUserIntro = function(swch) {
  var areaid, areaklass, i, j, k, len, len1;
  areaklass = ["SidePanel", "menu_inner", "intro", "site", "userSynchronize", "network_service"];
  areaid = ["columnA", "columnB", "friend", "index", "mono", "game", "real", "anime", "music", "book", "group", "blog"];
  for (j = 0, len = areaklass.length; j < len; j++) {
    i = areaklass[j];
    $('.' + i).css("display", swch);
  }
  for (k = 0, len1 = areaid.length; k < len1; k++) {
    i = areaid[k];
    $('#' + i).css("display", swch);
  }
  return swch;
};

userpage = function() {
  var avts, avts1, avts2, id1, id2;
  id1 = $(" .nameSingle > .rr > .chiiBtn")[1].getAttribute("href").split("/")[3].split(".")[0];
  id2 = $(".headerAvatar > .avatar").attr("href").split("/")[2];
  avts = $(".avatarNeue.avatarSize75").attr("style").split("/");
  if (avts[6] === "000") {
    avts1 = avts[7];
    avts2 = avts[8];
  } else {
    avts1 = avts2 = "dft";
  }
  console.log(id1, id2, avts1, avts2);
  console.log('searchData(id1)', searchData(id1));
  if (searchData(id1)) {
    switchUserIntro("none");
    $(" .nameSingle > .rr").html(function(i, old) {
      return old + '<a href="javascript:;" class="chiiBtn" id="bkmbtn"><span>解除屏蔽</span></a>';
    });
    return $('body').on('click.bkmbtn', '#bkmbtn', function() {
      return unblock(id1, id2, avts1, avts2);
    });
  } else {
    switchUserIntro("block");
    $(" .nameSingle > .rr").html(function(i, old) {
      return old + '<a href="javascript:;" class="chiiBtn" id="bkmbtn"><span>屏蔽</span></a>';
    });
    return $('body').on('click.bkmbtn', '#bkmbtn', function() {
      return block(id1, id2, avts1, avts2);
    });
  }
};

refreshListItems = function(old_klass, new_klass) {
  return $(old_klass).removeClass().addClass(new_klass);
};

refreshTopicList = function(klasslist, klass) {
  var swch;
  swch = true;
  $(klass).each(function() {
    if (this.style.display) {
      return;
    }
    if (swch) {
      this.className = klasslist[0];
    } else {
      this.className = klasslist[1];
    }
    swch = !swch;
    return 1;
  });
  return true;
};

refreshTbodyList = function(klasslist, klass, subklass) {
  var swch;
  swch = true;
  $(klass).each(function() {
    var sub_item;
    sub_item = $(this).find(subklass);
    if (!sub_item.length) {
      return;
    }
    sub_item.each(function() {
      if (swch) {
        this.className = klasslist[0];
      } else {
        this.className = klasslist[1];
      }
      return 1;
    });
    swch = !swch;
    return 1;
  });
  return true;
};

refreshIndexList = function(klasslist, klass, subklass) {
  $(klass).each(function() {
    var sub_item, swch;
    swch = true;
    sub_item = $(this).find(subklass);
    if (!sub_item.length) {
      return;
    }
    sub_item.each(function() {
      if (swch) {
        this.className = klasslist[0];
      } else {
        this.className = klasslist[1];
      }
      swch = !swch;
      return 1;
    });
    return 1;
  });
  return true;
};

refreshTsukkomi = function(klasslist, klass, subklass) {
  var swch;
  if (klasslist == null) {
    klasslist = [['ll', 'text_main_even'], ['rr', 'text_main_odd']];
  }
  if (klass == null) {
    klass = '#comment_box > div.item';
  }
  if (subklass == null) {
    subklass = ['a', 'div'];
  }
  swch = true;
  $(klass).each(function() {
    if (swch) {
      $(this).find(subklass[0])[0].className = klasslist[0][0];
      $(this).find(subklass[1])[0].className = klasslist[0][1];
    } else {
      $(this).find(subklass[0])[0].className = klasslist[1][0];
      $(this).find(subklass[1])[0].className = klasslist[1][1];
    }
    swch = !swch;
    return 1;
  });
  return true;
};

cleanUp = function() {
  return $('h4.Header').each(function() {
    var header, next_ul;
    header = $(this);
    next_ul = header.next('ul');
    if (next_ul.text().trim() === '') {
      next_ul.remove();
      return header.remove();
    }
  });
};

getUidFromAvat = function(node) {
  var bgurl;
  bgurl = node.getAttribute('src').split('/');
  if (bgurl[4] === 'user' && bgurl.length > 7) {
    return bgurl[9].split('.')[0];
  } else {
    return '-1';
  }
};

listItems = function(klass, t, paklass, pat) {
  var flag, i, j, nv_pak, ref;
  flag = false;
  nv_pak = paklass;
  for (i = j = 0, ref = pat - 1; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    nv_pak += ' > *';
  }
  nv_pak += ' > ' + klass;
  $(nv_pak).each(function() {
    var uid;
    if (klass.indexOf('img') === 0) {
      uid = getUidFromAvat(this);
    } else {
      uid = this.href.split("/")[4];
    }
    if (searchData(uid)) {
      $(this).parents().eq(t - 1).remove();
      return flag = true;
    }
  });
  return flag;
};

topic = function() {
  var flag;
  flag = false;
  $('.avatarNeue').each(function() {
    var bgurl, uid;
    bgurl = this.style.backgroundImage.split('/');
    if (bgurl[4] === 'user' && bgurl.length > 7) {
      uid = bgurl[9].split('.')[0];
      if (searchData(uid)) {
        $(this).parents().eq(1).remove();
        return flag = true;
      }
    } else if (bgurl[4] === 'user') {
      uid = this.parentNode.href.split("/")[4];
      if (searchData(uid)) {
        $(this).parents().eq(1).remove();
        return flag = true;
      }
    }
  });
  return flag;
};

hideOP = function() {
  return $('a.avatar').each(function() {
    var reinfo, uid;
    uid = this.href.split("/")[4];
    if (searchData(uid)) {
      console.log("It's a blog");
      $(this.parentNode).remove();
      $('#viewEntry').remove();
      reinfo = $('.re_info')[0];
      return $(reinfo).remove();
    }
  });
};

pmcompose = function() {
  return $('#pm_sidebar > a.l').each(function() {
    var elem, uid;
    uid = this.getAttribute('onclick').split("'")[1];
    if (searchData(uid)) {
      elem = $(this);
      elem.next('br').remove();
      return elem.remove();
    }
  });
};

pmAutoDel = function(mbox) {
  var action, erase_pm, i, j, len, pmmain, pms;
  pmmain = $('#pm_main');
  pmmain.css('display', 'none');
  action = $('form#pmForm').attr('action');
  pms = {
    'folder': mbox,
    'submit': '删除',
    'erase_pm[]': []
  };
  erase_pm = [];
  $('img.avatar.ll').each(function() {
    var error, es, uid;
    try {
      uid = this.src.split("/")[9].split(".")[0];
    } catch (error1) {
      error = error1;
      console.log(error);
      return 2;
    }
    if (searchData(uid)) {
      es = this.parentNode.href.split("/")[5].split(".")[0];
      erase_pm.push(es);
    }
    return 1;
  });
  if (erase_pm.length !== 0) {
    for (j = 0, len = erase_pm.length; j < len; j++) {
      i = erase_pm[j];
      pms['erase_pm[]'].push(i);
    }
    return $.post(action, pms, function() {
      return location.href = location.href;
    });
  } else {
    return pmmain.removeAttr('style');
  }
};

erasentf = function(url, ghstr) {
  return $.get(url, {
    "gh": ghstr
  });
};

notify = function() {
  var ghstr;
  ghstr = $("#del_all").attr("href").split("gh=")[1];
  console.log(ghstr);
  return $(".inner.tip > strong > a.l").each(function() {
    var ntfid, uid, url;
    uid = $(this).attr("href").split("/")[4];
    console.log(uid);
    if (searchData(uid)) {
      ntfid = $(this).parents().eq(2).attr("id").split("_")[1];
      url = "/erase/notify/" + ntfid;
      console.log(ntfid, url);
      erasentf(url, ghstr);
      return $(this).parents().eq(2).remove();
    }
  });
};

checkAll = function() {
  var i, inputbox, j, len, results;
  console.log("chkall");
  inputbox = $(".selectable");
  results = [];
  for (j = 0, len = inputbox.length; j < len; j++) {
    i = inputbox[j];
    results.push(i.checked = true);
  }
  return results;
};

uncheckAll = function() {
  var i, inputbox, j, len, results;
  inputbox = $(".selectable");
  results = [];
  for (j = 0, len = inputbox.length; j < len; j++) {
    i = inputbox[j];
    results.push(i.checked = false);
  }
  return results;
};

addSettingBtn = function() {
  $(".secTab").html(function(i, old) {
    return '<li><a href="javascript:;" id="bkm_setting"><span>屏蔽列表</span></a></li><li><a href="javascript:;" id="bkm_backdata"><span>导入/导出</span></a></li>' + old;
  });
  $('body').on('click.bkm_setting', '#bkm_setting', function() {
    return bksetting();
  });
  return $('body').on('click.bkm_backdata', '#bkm_backdata', function() {
    return bkbackup();
  });
};

batchDelete = function() {
  var i, id1, ids, j, len;
  ids = $(".selectable");
  for (j = 0, len = ids.length; j < len; j++) {
    i = ids[j];
    if (i.checked) {
      id1 = i.value;
      delData(id1);
    }
  }
  return bksetting();
};

bksetting = function() {
  var avt, j, len, newcolumn, temp, u, users;
  $("#columnB").css("display", "none");
  $("#header > h1").html(function(i, old) {
    return "屏蔽设置";
  });
  $(".secTab > li > a").removeClass("selected");
  $("#bkm_setting").addClass("selected");
  temp = "";
  users = getData();
  for (j = 0, len = users.length; j < len; j++) {
    u = users[j];
    if (u[2] === "dft") {
      avt = "icon.jpg";
    } else {
      avt = "000/" + u[2] + "/" + u[3] + "/" + u[0] + ".jpg";
    }
    avt = "http://lain.bgm.tv/pic/user/m/" + avt;
    temp = temp + '<li class="user"><div class="userContainer pm_odd">' + '<strong><input class="selectable" value="' + u[0] + '" name="" type="checkbox"></input>' + '<a href="/user/' + u[1] + '" class="avatar">' + '<span class="userImage">' + '<img src="' + avt + '" ' + 'alt="" class="avatar">' + '</span></a><div class="avatar">id: ' + u[1] + '</div></strong>' + '</div></li>';
  }
  newcolumn = '<div><ul id="memberUserList" class="usersLarge">' + temp + '</ul></div><input class="inputBtn" id="bkm_chk" type="submit" ' + 'onclick="javascript:;"' + 'value="全选" name="select_all"></input>' + '<input class="inputBtn" id="bkm_unchk" type="submit" ' + 'onclick="javascript:;"' + 'value="取消" name="select_all"></input>' + '<input class="inputBtn" id="bkm_del" type="submit" ' + 'onclick="javascript:;"' + 'value="解除屏蔽" name="batch_delete"></input>';
  $("#columnA").html(newcolumn);
  $('body').off('click.bkm_chk');
  $('body').on('click.bkm_chk', '#bkm_chk', function() {
    return checkAll();
  });
  $('body').off('click.bkm_unchk');
  $('body').on('click.bkm_unchk', '#bkm_unchk', function() {
    return uncheckAll();
  });
  $('body').off('click.bkm_del');
  return $('body').on('click.bkm_del', '#bkm_del', function() {
    return batchDelete();
  });
};

bkbackup = function() {
  var newcolumn;
  $("#columnB").css("display", "none");
  $("#header > h1").html(function(i, old) {
    return "屏蔽列表导入/导出";
  });
  $(".secTab > li > a").removeClass("selected");
  $("#bkm_backdata").addClass("selected");
  newcolumn = '<input id ="bkm_export" type="button" onclick="javascript:;" value="　文本导出　" name="export_data" /> <input id ="bkm_import" type="button" onclick="javascript:;" value="　文本导入　" name="import_data" />  <input id ="bkm_export_file" type="button" onclick="javascript:;" value="　导出至文件　" name="export_file" /> <input id ="bkm_import_omote" type="button" onclick="javascript:;" value="　从文件导入　" name="import_omote" /><input id ="bkm_import_file" type="file" onclick="javascript:;" value="　从文件导入　" name="import_file" style="display:none"/>';
  $("#columnA").html(newcolumn);
  $('body').off('click.bkm_export');
  $('body').on('click.bkm_export', '#bkm_export', function() {
    return exportData();
  });
  $('body').off('click.bkm_import');
  $('body').on('click.bkm_import', '#bkm_import', function() {
    return importFace();
  });
  $('body').off('click.bkm_export_file');
  $('body').on('click.bkm_export_file', '#bkm_export_file', function() {
    return exportFile();
  });
  $('body').off('change.bkm_import_file');
  $('body').on('change.bkm_import_file', '#bkm_import_file', function(evt) {
    return importFile(evt);
  });
  $('body').off('click.bkm_import_omote');
  return $('body').on('click.bkm_import_omote', '#bkm_import_omote', function() {
    return $('#bkm_import_file').trigger('click');
  });
};

importFace = function() {
  var newcolumn;
  bkbackup();
  newcolumn = '<br /><br /><textarea id="ryououki" class="quick" style="width: 504px; height: 225px;" rows="5" cols="45" name="newbio"></textarea><p class="tip"></p><input class="inputBtn" id ="bkm_submit" type="submit"onclick="javascript:;" value="提交" name="select_all" />';
  $("#columnA").html(function(i, old) {
    return old + newcolumn;
  });
  $('body').off('click.bkm_submit');
  return $('body').on('click.bkm_submit', '#bkm_submit', function() {
    return importData();
  });
};

importOldData = function(text) {
  var ava, avatars, conj_mid, conj_outer, data, id1nid2, idx, j, k, len, len1, n, newavatars, user, user_next;
  conj_outer = '-|-I HOPE YOU LIVE A LIFE YOU ARE PROUD OF. IF YOU FIND THAT YOU ARE NOT, I HOPE YOU HAVE THE STRENGTH TO START ALL OVER AGAIN-|-';
  conj_mid = "-|-gochuumon wa usagi desu ka-|-";
  data = text.split('嘟嘟噜')[1];
  id1nid2 = data.split(conj_outer)[1].split(conj_mid);
  avatars = data.split(conj_outer)[2].split(conj_mid);
  newavatars = [];
  for (j = 0, len = avatars.length; j < len; j++) {
    ava = avatars[j];
    if (ava.endsWith("default")) {
      newavatars.push([ava.split("/")[0], "dft", "dft"]);
    } else {
      newavatars.push(ava.split("/"));
    }
  }
  n = id1nid2.length;
  idx = 0;
  while (idx <= n) {
    user = id1nid2[idx];
    if (1 * id1nid2[idx + 1] > 0 || !id1nid2[idx + 1]) {
      user_next = user;
      idx += 1;
    } else {
      user_next = id1nid2[idx + 1];
      idx += 2;
    }
    for (k = 0, len1 = newavatars.length; k < len1; k++) {
      ava = newavatars[k];
      if (ava[0] === user) {
        setData([user, user_next, ava[1], ava[2]]);
      }
    }
  }
  return alert('导入完成');
};

importData = function() {
  var data, error, i, j, len, text;
  text = $("#ryououki")[0].value.trim();
  if (text === "") {
    return false;
  }
  if (text.startsWith("嘟嘟噜")) {
    importOldData(text);
    return false;
  }
  try {
    data = JSON.parse(text);
  } catch (error1) {
    error = error1;
    console.log(error);
    alert('错误：输入的内容有错误');
    return false;
  }
  for (j = 0, len = data.length; j < len; j++) {
    i = data[j];
    setData(i);
  }
  return alert('导入完成');
};

exportData = function() {
  var data, newcolumn;
  bkbackup();
  data = JSON.stringify(getData());
  newcolumn = '<br /><br /><div class="light_even row_reply clearit">' + data + '</div>';
  return $("#columnA").html(function(i, old) {
    return old + newcolumn;
  });
};

formatNum = function(n) {
  if (n < 10) {
    return "0" + n;
  }
  return "" + n;
};

getTm = function() {
  var d, day, m, y;
  day = new Date();
  y = day.getFullYear();
  m = formatNum(day.getMonth() + 1);
  d = formatNum(day.getDate());
  return "" + y + m + d;
};

exportFile = function() {
  var blob, data, day;
  data = JSON.stringify(getData());
  blob = new Blob([data], {
    type: "text/plain;charset=utf-8"
  });
  day = getTm();
  return saveAs(blob, "Blackumi_" + day + ".bkm");
};

importFile = function(evt) {
  var file, reader;
  if (!(window.File && window.FileReader && window.FileList)) {
    alert('错误：正在使用的浏览器不支持此脚本读取本地文件\n请直接使用"导入"功能');
    return false;
  }
  console.log("importing file");
  file = evt.target.files[0];
  reader = new FileReader();
  reader.onload = function(e) {
    var data, error, i, j, len, text;
    console.log(typeof e.target.result);
    console.log("reader.onload");
    text = e.target.result.trim();
    if (text.startsWith("嘟嘟噜")) {
      importOldData(text);
      return false;
    }
    try {
      data = JSON.parse(text);
    } catch (error1) {
      error = error1;
      console.log(error);
      alert('错误：文件错误或已经损坏');
      return false;
    }
    for (j = 0, len = data.length; j < len; j++) {
      i = data[j];
      setData(i);
    }
    alert('文件导入完成');
    return console.log("imported");
  };
  return reader.readAsText(file);
};

davtGetLimit = function() {
  var limit;
  limit = GM_getValue("321davt");
  if (limit) {
    return 1 * limit;
  } else {
    return 12;
  }
};

davtSetLimit = function() {
  var limit, old_limit, tip;
  old_limit = davtGetLimit();
  tip = "当前限制数为 " + old_limit + "\n\n完全不限制默认头像用户数量请输入 0\n\n" + "请输入新限制数：\n\n";
  limit = prompt(tip, "");
  if (limit === null) {
    return null;
  } else if (1 * limit >= 0) {
    GM_setValue("321davt", Math.floor(1 * limit));
    return alert("设置成功，页面刷新后生效");
  } else {
    alert("错误，请确保输入阿拉伯数字(非负整数)：");
    return davtSetLimit();
  }
};

davtCheckList = function(n) {
  var davt, i, j, len;
  davt = [];
  if (n === 0) {
    return false;
  }
  $(".avatarNeue").each(function() {
    var avt;
    avt = this.style.backgroundImage.split("/");
    if (avt.length === 7 && avt[4] === "user") {
      return davt.push(this);
    }
  });
  if (davt.length < n) {
    return false;
  }
  console.log("共有" + davt.length + "个默认头像用户被屏蔽");
  for (j = 0, len = davt.length; j < len; j++) {
    i = davt[j];
    $(i).parents().eq(1).remove();
  }
  return true;
};

removeDAvt = function() {
  GM_registerMenuCommand("默认头像限制数", davtSetLimit);
  return davtCheckList(davtGetLimit());
};

main = function() {
  var i, j, len, path, ref, regPatt, results;
  path = location.pathname;
  regPatt = {
    "/user/([0-9]+|[A-Za-z][A-Za-z_0-9]*)$": function() {
      console.log("/user/fubugongtengai");
      userpage();
      return listItems('.avatar', 2, '.side_port', 2);
    },
    "/user/([0-9]+|[A-Za-z][A-Za-z_0-9]*)/friends$": function() {
      var flag;
      console.log("/user/fubugongtengai/friends");
      flag = listItems('.avatar', 3, '.userContainer', 2);
      if (flag) {
        return refreshListItems('.user', 'user');
      }
    },
    "/user/([0-9]+|[A-Za-z][A-Za-z_0-9]*)/timeline$": function() {
      console.log("/user/fubugongtengai/timeline");
      return setInterval(function() {
        var flag1, flag2;
        flag1 = listItems('.l', 2, '.clearit.tml_item', 2);
        flag2 = listItems('.l', 3, '.clearit.tml_item', 3);
        if (flag1 === true || flag2 === true) {
          return cleanUp();
        }
      }, 500);
    },
    "/rakuen": function() {
      var flag, flag2;
      console.log("/rakuen");
      flag = topic();
      flag2 = removeDAvt();
      flag = flag || flag2;
      if (flag) {
        console.log('refreshTopicList');
        refreshTopicList(['line_odd item_list', 'line_even item_list'], '.item_list');
        return refreshTopicList(['light_odd row_reply clearit', 'light_even row_reply clearit'], '.row_reply');
      }
    },
    "/group/topic/[0-9]+$": function() {
      var flag;
      console.log("/group/topic/33349");
      flag = topic();
      if (flag) {
        return refreshTopicList(['light_even row_reply clearit', 'light_odd row_reply clearit'], '.row_reply');
      }
    },
    "/(blog|ep)/[0-9]+$": function() {
      var flag;
      console.log("/blog/51604");
      flag = topic();
      if (flag) {
        refreshTopicList(['light_odd row_reply clearit', 'light_even row_reply clearit'], '.row_reply');
      }
      return hideOP();
    },
    "/group$": function() {
      console.log("/group");
      return listItems('a', 3, 'tr', 3);
    },
    "/group/discover$": function() {
      var flag;
      console.log("/group/discover");
      flag = listItems('a', 2, 'td', 1);
      if (flag) {
        return refreshTbodyList(['odd', 'even'], 'tr', 'td');
      }
    },
    "/group/my_reply$": function() {
      var flag;
      console.log("/group/my_reply");
      flag = listItems('a.tip_j', 3, 'td.subject', 2);
      if (flag) {
        return refreshTopicList(['topic odd', 'topic even'], '.topic');
      }
    },
    "/group/[A-Za-z][A-Za-z_0-9]*/members$": function() {
      var flag;
      console.log("http://bangumi.tv/group/xiami/members");
      flag = listItems('a', 3, 'li', 3);
      if (flag) {
        return refreshListItems('.user', 'user');
      }
    },
    "/group/[A-Za-z][A-Za-z_0-9]*$": function() {
      var flag;
      console.log("http://bangumi.tv/group/boring");
      flag = listItems('.l', 2, '.author', 1);
      if (flag) {
        refreshTopicList(['topic odd', 'topic even'], '.topic');
      }
      return listItems('.l', 2, '.side_port', 2);
    },
    "/subject/[0-9]+$": function() {
      var flagsub, flagtsu;
      console.log("http://bangumi.tv/subject/100449");
      listItems('.avatar', 1, '.groupsLine', 2);
      flagtsu = listItems('.avatar', 1, '.item.clearit', 1);
      listItems('.l', 4, '.item.clearit', 4);
      flagsub = listItems('a', 2, 'td', 1);
      if (flagtsu) {
        refreshTsukkomi();
      }
      if (flagsub) {
        return refreshTbodyList(['odd', 'even'], 'tr', 'td');
      }
    },
    "/subject/topic/[0-9]+$": function() {
      var flag;
      console.log("/subject/topic/33349");
      flag = topic();
      if (flag) {
        return refreshTopicList(['light_even row_reply clearit', 'light_odd row_reply clearit'], '.row_reply');
      }
    },
    "/subject/[0-9]+/index": function() {
      console.log("http://bangumi.tv/subject/40339/index");
      return listItems('.avatar', 2, '.clearit.tml_item', 2);
    },
    "/subject/[0-9]+/reviews": function() {
      console.log("http://bangumi.tv/subject/18462/reviews");
      return listItems('.l', 4, '.item.clearit', 4);
    },
    "/subject/[0-9]+/comments": function() {
      var flag;
      console.log("http://bangumi.tv/subject/18462/comments");
      flag = listItems('.avatar', 1, '.item.clearit', 1);
      if (flag) {
        return refreshTsukkomi();
      }
    },
    "/subject/[0-9]+/board": function() {
      var flag;
      console.log("http://bangumi.tv/subject/18462/board");
      flag = listItems('a', 2, 'td', 1);
      if (flag) {
        return refreshTbodyList(['odd', 'even'], 'tr', 'td');
      }
    },
    "/subject/[0-9]+/edit": function() {
      var flag;
      console.log("http://bangumi.tv/subject/18462/edit");
      flag = listItems('.l', 1, '.columns.clearit', 4);
      if (flag) {
        return refreshTopicList(['line_even', 'line_odd'], 'ul#pagehistory > li');
      }
    },
    "/subject/[0-9]+/[A-Za-z]+": function() {
      var flag;
      console.log("http://bangumi.tv/subject/102695/collections");
      flag = listItems('.avatar', 3, '.userContainer', 2);
      if (flag) {
        return refreshListItems('.user', 'user');
      }
    },
    "/(person|character)/[0-9]+$": function() {
      var flag;
      console.log("http://bangumi.tv/person/12568");
      listItems('.avatar', 1, '.groupsLine', 2);
      flag = topic();
      if (flag) {
        return refreshTopicList(['light_odd row_reply clearit', 'light_even row_reply clearit'], '.row_reply');
      }
    },
    "/(person|character)/[0-9]+/collections": function() {
      var flag;
      console.log("http://bangumi.tv/person/12568/collections");
      flag = listItems('.port', 3, '.userContainer', 2);
      if (flag) {
        return refreshListItems('.user', 'user');
      }
    },
    "(/index|/index/browser)$": function() {
      console.log("http://bangumi.tv/index");
      console.log("http://bangumi.tv/index/browser");
      return listItems('.avatar', 2, '.clearit.tml_item', 2);
    },
    "/index/[0-9]+$": function() {
      console.log("http://bangumi.tv/index/18");
      return listItems('.avatar', 2, '.timeline_img.clearit', 3);
    },
    "/index/[0-9]+/comments": function() {
      var flag;
      console.log("http://bangumi.tv/index/18/comments");
      hideOP();
      flag = topic();
      if (flag) {
        return refreshTopicList(['light_odd row_reply clearit', 'light_even row_reply clearit'], '.row_reply');
      }
    },
    "(/pm|/pm/inbox.chii)$": function() {
      console.log("/pm/inbox.chii");
      return pmAutoDel('inbox');
    },
    "/pm/outbox.chii$": function() {
      console.log("/pm/outbox.chii");
      return pmAutoDel('outbox');
    },
    "/pm/compose.chii$": function() {
      console.log("/pm/compose.chii");
      return pmcompose();
    },
    "(/blog$|/anime$|/anime/blog|/book$|/book/blog|/music$|/music/blog|/game$|/game/blog)": function() {
      var flag;
      console.log("/blog or /anime or /anime/blog, etc.");
      flag = listItems('.blue', 4, '.entry', 3);
      if (flag) {
        refreshTopicList(['item odd', 'item clearit'], '.item');
      }
      flag = listItems('a', 2, 'td', 1);
      if (flag) {
        refreshTbodyList(['odd', 'even'], 'tr', 'td');
      }
      return listItems('.l', 2, '.coversSmall', 3);
    },
    "/$": function() {
      var flag;
      console.log("http://bangumi.tv");
      listItems('.l', 2, '.clearit.tml_item', 2);
      listItems('.l', 3, '.clearit.tml_item', 3);
      flag = listItems('img.avatar_mn.ll', 2, 'a.avatar', 1);
      if (flag) {
        return refreshIndexList(['line_odd clearit', 'line_even clearit'], '.sideTpcList', 'li');
      }
    },
    "/timeline$": function() {
      console.log("http://bangumi.tv/timeline");
      return setInterval(function() {
        listItems('.l', 2, '.clearit.tml_item', 2);
        return listItems('.l', 3, '.clearit.tml_item', 3);
      }, 500);
    },
    "/user/([0-9]+|[A-Za-z][A-Za-z_0-9]*)/timeline/status/[0-9]+": function() {
      var flag;
      console.log("/user/1231231/timeline/status/123123");
      listItems('.avatar', 2, '.columnsApp.statusSingle.clearit', 2);
      listItems('.l', 1, '.statusContent', 2);
      flag = listItems('.l', 1, '.statusContent', 3);
      if (flag) {
        return refreshTopicList(['even reply_item', 'odd reply_item'], '.reply_item');
      }
    },
    "/m": function() {
      var flag, flag2;
      console.log("/m");
      flag = topic();
      return flag2 = removeDAvt();
    },
    "/dollars": function() {
      console.log("/dollars");
      return setInterval(function() {
        return listItems('img', 2, 'div.icon', 1);
      }, 30);
    },
    "/wiki": function() {
      console.log("/wiki");
      listItems('.avatar', 2, '.groupsLine', 3);
      return listItems('a', 2, 'small', 1);
    },
    "/magi": function() {
      console.log("/magi");
      listItems('.avatar', 2, '.quizInfo.clearit', 2);
      return listItems('.avatar', 1, '.magiRank', 2);
    },
    "/notify": function() {
      console.log("/notify");
      return notify();
    },
    "/settings": function() {
      console.log("/settings");
      return addSettingBtn();
    }
  };
  ref = Object.keys(regPatt);
  results = [];
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    if (RegExp(i).test(path)) {
      results.push(regPatt[i]());
    } else {
      results.push(void 0);
    }
  }
  return results;
};

main();