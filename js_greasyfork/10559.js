/*
// ==UserScript==
// @name           Silent B
// @namespace      https://github.com/hentaiPanda
// @description    隐藏指定的超展开列表项目，等等
// @author         niR
// @version        4672.20 pre Bismark
// @license        MIT License
// @encoding       utf-8
// @require        http://code.jquery.com/jquery-2.1.1.js
// @grant          GM_getValue
// @grant          GM_setValue
// @include        http://bgm.tv/rakuen/topiclist
// @include        http://bangumi.tv/rakuen/topiclist
// @include        http://chii.in/rakuen/topiclist
// @include        http://bgm.tv/
// @include        http://bangumi.tv/
// @include        http://chii.in/
// @include        /^http://bgm\.tv/subject/[0-9]+/
// @include        /^http://bangumi\.tv/subject/[0-9]+/
// @include        /^http://chii\.in/subject/[0-9]+/
// @include        http://bgm.tv/subject_search/*
// @include        http://bangumi.tv/subject_search/*
// @include        http://chii.in/subject_search/*
// @include        /^http://bgm\.tv/(anime|book|music|real)/browser/
// @include        /^http://bangumi\.tv/(anime|book|music|real)/browser/
// @include        /^http://chii\.in/(anime|book|music|real)/browser/
// @include        /^http://bgm\.tv/group/(?!topic).+/
// @include        /^http://bangumi.tv/group/(?!topic).+/
// @include        /^http://chii.in/group/(?!topic).+/
// @include        http://bgm.tv/settings*
// @include        http://bangumi.tv/settings*
// @include        http://chii.in/settings*
// @downloadURL https://update.greasyfork.org/scripts/10559/Silent%20B.user.js
// @updateURL https://update.greasyfork.org/scripts/10559/Silent%20B.meta.js
// ==/UserScript==
 */
var addBtn, addBtnGroup, addBtnHome, addSettingBtn, checkTsuRtg, getParentNode, hideRank, hideRating, hideTsukkomi, initItemList, initItemListGroup, initItemListHome, main, refreshIndexList, refreshList, refreshTopicList, removeItem, removeItemGroup, removeItemHome, sbsetting, updateTsuRtg;

getParentNode = function(node, level) {
  var i, pn;
  i = level - 1;
  pn = node.parentNode;
  if (level === 0) {
    return node;
  }
  while (i > 0) {
    pn = pn.parentNode;
    i -= 1;
  }
  return pn;
};

addBtn = function() {
  $('li.item_list > div.inner > span.row').each(function() {
    var x_btn;
    x_btn = '<span class="xlihil"><a href="javascript:;">[X]</a></span>';
    return this.innerHTML = this.innerHTML + x_btn;
  });
  return $('body').on('click.removeli', '.xlihil', function(evt) {
    return removeItem(evt.target);
  });
};

removeItem = function(node) {
  var item, tpcid;
  item = getParentNode(node, 4);
  GM_setValue(item.id, true);
  tpcid = item.id.split("item_group_")[1];
  console.log(tpcid);
  GM_setValue("/group/topic/" + tpcid, true);
  return item.outerHTML = '';
};

initItemList = function() {
  var flag;
  flag = false;
  $('li.item_list').each(function() {
    if (GM_getValue(this.id, false)) {
      this.outerHTML = '';
      return flag = true;
    }
  });
  return flag;
};

addBtnHome = function() {
  $('div#home_subject_tpc a.l, div#home_grp_tpc a.l:not(.rr)').each(function() {
    var x_btn;
    if ($(this).attr("href").startsWith("/group/my")) {
      return;
    }
    x_btn = '<a class="xlihil" href="javascript:;">[X]</a>';
    return $(this).next().html(function(i, old) {
      return old + x_btn;
    });
  });
  return $('body').on('click.removeli', '.xlihil', function(evt) {
    return removeItemHome(evt.target);
  });
};

removeItemHome = function(node) {
  var itemhref, tpcid;
  itemhref = $(node).parents().eq(0).prev().attr("href");
  GM_setValue(itemhref, true);
  tpcid = itemhref.split("/group/topic/")[1];
  console.log(tpcid);
  GM_setValue("item_group_" + tpcid, true);
  return $(node).parents().eq(2).remove();
};

initItemListHome = function() {
  var flag;
  flag = false;
  $('div#home_subject_tpc a.l, div#home_grp_tpc a.l').each(function() {
    var href;
    href = $(this).attr("href");
    if (GM_getValue(href, false)) {
      $(this).parents().eq(1).remove();
      return flag = true;
    }
  });
  return flag;
};

addBtnGroup = function() {
  $('table.topic_list td.subject').each(function() {
    var x_btn;
    x_btn = '<small class="grey"><a class="xlihil" href="javascript:;">[X]  </a></small>';
    return $(this).html(function(i, old) {
      return x_btn + old;
    });
  });
  return $('body').on('click.removeli', '.xlihil', function(evt) {
    return removeItemGroup(evt.target);
  });
};

removeItemGroup = function(node) {
  var itemhref, tpcid;
  itemhref = $(node).parent().next().attr("href");
  console.log(itemhref);
  GM_setValue(itemhref, true);
  tpcid = itemhref.split("/group/topic/")[1];
  console.log(tpcid);
  GM_setValue("item_group_" + tpcid, true);
  return $(node).parents().eq(2).remove();
};

initItemListGroup = function() {
  var flag;
  flag = false;
  $('table.topic_list td.subject a.l').each(function() {
    var href;
    href = $(this).attr("href");
    if (GM_getValue(href, false)) {
      $(this).parents().eq(1).remove();
      return flag = true;
    }
  });
  return flag;
};

refreshList = function() {
  var i;
  i = true;
  return $('li.item_list').each(function() {
    if (this.style.display) {
      return;
    }
    if (i) {
      this.className = 'line_odd item_list';
    } else {
      this.className = 'line_even item_list';
    }
    i = !i;
    return console.log(this.id);
  });
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

hideTsukkomi = function(swch) {
  if (!swch) {
    return;
  }
  return $("#comment_box").remove();
};

hideRating = function(swch) {
  if (!swch) {
    return;
  }
  return $("#ChartWarpper, #columnSubjectInHomeB .global_rating").remove();
};

hideRank = function(swch) {
  if (!swch) {
    return;
  }
  return $("#browserItemList span.rank, #browserItemList p.rateInfo").remove();
};

addSettingBtn = function() {
  $(".secTab").html(function(i, old) {
    return '<li><a href="javascript:;" id="sb_setting"><span>STB设置</span></a></li>' + old;
  });
  $('body').off('click.sb_setting');
  return $('body').on('click.sb_setting', '#sb_setting', function() {
    return sbsetting();
  });
};

updateTsuRtg = function(node) {
  switch (node.id) {
    case "rtg_yes":
      return GM_setValue("hiderating", true);
    case "rtg_no":
      return GM_setValue("hiderating", false);
    case "tsu_yes":
      return GM_setValue("hidetsukkomi", true);
    case "tsu_no":
      return GM_setValue("hidetsukkomi", false);
    default:
      return false;
  }
};

checkTsuRtg = function() {
  var defaultval, flagrtg, flagtsu;
  defaultval = true;
  flagtsu = GM_getValue("hidetsukkomi", defaultval);
  flagrtg = GM_getValue("hiderating", defaultval);
  if (flagrtg) {
    $("#rtg_yes")[0].checked = true;
  } else {
    $("#rtg_no")[0].checked = true;
  }
  if (flagtsu) {
    return $("#tsu_yes")[0].checked = true;
  } else {
    return $("#tsu_no")[0].checked = true;
  }
};

sbsetting = function() {
  var newcolumn;
  $("#columnB").css("display", "none");
  $("#header > h1").html(function(i, old) {
    return "STB设置";
  });
  $(".secTab > li > a").removeClass("selected");
  $("#sb_setting").addClass("selected");
  newcolumn = '<span class="text"><table class="settings" cellpadding="5" cellspacing="0" align="center" width="98%"><tbody><tr><td valign="top" width="12%"><h2 class="subtitle">隐藏评分信息</h2></td><td valign="top"></td></tr><tr><td valign="top" width="20%">是</td><td valign="top"><input name="rtg_radio" class="stb" id="rtg_yes" type="radio"></td></tr><tr><td valign="top" width="20%">否</td><td valign="top"><input name="rtg_radio"  class="stb" id="rtg_no" type="radio"></td></tr><tr><td valign="top" width="12%"><h2 class="subtitle">隐藏概览页吐槽箱</h2></td><td valign="top"></td></tr><tr><td valign="top" width="20%">是</td><td valign="top"><input name="tsu_radio"  class="stb" id="tsu_yes" type="radio"></td></tr><tr><td valign="top" width="20%">否</td><td valign="top"><input name="tsu_radio"  class="stb" id="tsu_no" type="radio"></td></tr></tbody></span>';
  $("#columnA").html(newcolumn);
  checkTsuRtg();
  $('body').off('click.sb_input');
  return $('body').on('click.sb_input', 'input.stb', function(evt) {
    return updateTsuRtg(evt.target);
  });
};

main = function() {
  var defaultval, i, j, len, path, ref, regPatt, results;
  defaultval = true;
  path = location.pathname;
  regPatt = {
    "/$": function() {
      var flag;
      console.log("http://bangumi.tv");
      flag = initItemListHome();
      addBtnHome();
      if (flag) {
        return refreshIndexList(['line_odd clearit', 'line_even clearit'], '.sideTpcList', 'li');
      }
    },
    "/rakuen/topiclist": function() {
      var flag;
      console.log("/rakuen");
      flag = initItemList();
      if (flag) {
        refreshList();
      }
      return addBtn();
    },
    "/subject/[0-9]+$": function() {
      var flagrtg, flagtsu;
      flagtsu = GM_getValue("hidetsukkomi", defaultval);
      flagrtg = GM_getValue("hiderating", defaultval);
      hideTsukkomi(flagtsu);
      return hideRating(flagrtg);
    },
    "/subject_search/.*": function() {
      var flagrtg;
      flagrtg = GM_getValue("hiderating", defaultval);
      return hideRank(flagrtg);
    },
    "/(anime|book|music|real)/browser": function() {
      var flagrtg;
      flagrtg = GM_getValue("hiderating", defaultval);
      return hideRank(flagrtg);
    },
    "/group/(?!topic).+": function() {
      var flag;
      flag = initItemListGroup();
      addBtnGroup();
      if (flag) {
        return refreshTopicList(['topic odd', 'topic even'], '.topic');
      }
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