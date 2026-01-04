// ==UserScript==
// @name         auto_feed_pterweb专用版
// @author       JDWLL123
// @thanks       基于tomorrow505大佬auto_feed修改，感谢橘子大佬帮助修改
// @contributor  daoshuailx/hollips/kmeng/wyyqyl/shmt86/sauterne
// @description  pterweb专用版差速器发种脚本
// @match        http*://pterclub.com/upload.php
// @require      https://code.jquery.com/jquery-1.12.4.js
// @resource     css http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css
// @icon         https://kp.m-team.cc//favicon.ico
// @run-at       document-end
// @version      2.1.0
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_getResourceText
// @license      GPL-3.0 License
// @grant        GM_addStyle
// @namespace pterweb
// @downloadURL https://update.greasyfork.org/scripts/461875/auto_feed_pterweb%E4%B8%93%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/461875/auto_feed_pterweb%E4%B8%93%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==

//获取网页地址，有很多种可能，首先是简单处理页面，及时返回，另外一种匹配上发布页面，一种匹配上源页面，分别处理两种逻辑
var site_url = decodeURIComponent(location.href);
var evt = document.createEvent("HTMLEvents");
evt.initEvent("change", false, true);

/*******************************************************************************************************************
 *                                          part 1 变量初始化层                                                       *
 ********************************************************************************************************************/

//是否匿名，默认开启匿名选项
var if_uplver =
  GM_getValue("if_uplver") === undefined ? 1 : GM_getValue("if_uplver");

//欧美国家列表，可以酌情添加
const us_ue = [
  "挪威|丹麦|瑞典|芬兰|英国|爱尔兰|荷兰|比利时|卢森堡|法国|西班牙|葡萄牙|德国|奥地利|瑞士|美国|加拿大|澳大利亚|意大利|波兰|新西兰",
];

/*******************************************************************************************************************
 *                                          part 2 常量、变量及函数定义封装层                                          *
 ********************************************************************************************************************/

//用来拼接发布站点的url和字符串,也可用于识别发布页和源页面
const seperator = "#seperator#";
//获取源站点简称
const origin_site = "PTer";

//字符串转换成字典回来填充发布页面
function stringToDict(my_string) {
  var link_str = "#linkstr#";
  var tmp_array = my_string.split(link_str);
  var tmp_dict = {};
  for (i = 0; i < tmp_array.length; i++) {
    if (i % 2 == 0) {
      tmp_dict[tmp_array[i]] = tmp_array[i + 1];
    }
  }
  return tmp_dict;
}

//下面两个函数用来为字符串赋予format方法：例如——'thank you {site}'.format({'site':'ttg'}) => 'thank you ttg'
String.prototype.replaceAll = function (exp, newStr) {
  return this.replace(new RegExp(exp, "gm"), newStr);
};

String.prototype.format = function (args) {
  var result = this;
  if (arguments.length < 1) {
    return result;
  }
  var data = arguments;
  if (arguments.length == 1 && typeof args == "object") {
    data = args;
  }
  for (var key in data) {
    var value = data[key];
    if (undefined != value) {
      result = result.replaceAll("\\{" + key + "\\}", value);
    }
  }
  return result;
};

//下面几个函数为字符串赋予获取各种编码信息的方法——适用于页面基本信息和字符串
String.prototype.medium_sel = function () {
  //媒介
  var result = this;
  if (result.match(/(Webdl|Web-dl|WEB)/i)) {
    result = "WEB-DL";
  } else if (result.match(/(UHDTV)/i)) {
    result = "UHDTV";
  } else if (result.match(/(HDTV)/i)) {
    result = "HDTV";
  } else if (result.match(/(Remux)/i) && !result.match(/Encode/)) {
    result = "Remux";
  } else if (
    result.match(/(Blu-ray|.MPLS|Bluray原盘)/i) &&
    !result.match(/Encode/i)
  ) {
    result = "Blu-ray";
  } else if (
    result.match(/(Encode|BDRIP|webrip|BluRay)/i) ||
    result.match(/(x|H).?(264|265)/i)
  ) {
    result = "Encode";
  } else if (result.match(/(UHD|UltraHD)/i) && !result.match(/Encode/i)) {
    result = "UHD";
  } else if (result.match(/(DVDRip|DVD)/i)) {
    result = "DVD";
  } else {
    result = "";
  }
  return result;
};

String.prototype.codec_sel = function () {
  //编码

  var result = this;

  if (result.match(/(H264|H\.264|AVC)/i)) {
    result = "H264";
  } else if (result.match(/(HEVC|H265|H\.265)/i)) {
    result = "H265";
  } else if (result.match(/(X265)/i)) {
    result = "X265";
  } else if (result.match(/(X264)/i)) {
    result = "X264";
  } else if (result.match(/(VC-1)/i)) {
    result = "VC-1";
  } else if (result.match(/(MPEG-2)/i)) {
    result = "MPEG-2";
  } else if (result.match(/(MPEG-4)/i)) {
    result = "MPEG-4";
  } else if (result.match(/(XVID)/i)) {
    result = "XVID";
  } else if (result.match(/(VP9)/i)) {
    result = "VP9";
  } else {
    result = "";
  }

  return result;
};

String.prototype.audiocodec_sel = function () {
  //音频编码
  var result = this.toString();
  if (result.match(/(DTS-HDMA:X 7\.1)/i)) {
    result = "DTS-HDMA:X 7.1";
  } else if (result.match(/(DTS-HD.?MA)/i)) {
    result = "DTS-HDMA";
  } else if (result.match(/(DTS-HD HR)/i)) {
    result = "DTS-HDHR";
  } else if (result.match(/(DTS-HD)/i)) {
    result = "DTS-HD";
  } else if (result.match(/(DTS-X)/i)) {
    result = "DTS-X";
  } else if (result.match(/(LPCM)/i)) {
    result = "LPCM";
  } else if (result.match(/(DD|AC3|AC-3|Dolby Digital)/i)) {
    result = "AC3";
  } else if (result.match(/(Atmos)/i)) {
    result = "Atmos";
  } else if (result.match(/(AAC)/i)) {
    result = "AAC";
  } else if (result.match(/(TrueHD)/i)) {
    result = "TrueHD";
  } else if (result.match(/(DTS)/i)) {
    result = "DTS";
  } else if (result.match(/(Flac)/i)) {
    result = "Flac";
  } else if (result.match(/(APE)/i)) {
    result = "APE";
  } else if (result.match(/(MP3)/i)) {
    result = "MP3";
  } else if (result.match(/(WAV)/i)) {
    result = "WAV";
  } else if (result.match(/(OPUS)/i)) {
    result = "OPUS";
  } else if (result.match(/(OGG)/i)) {
    result = "OGG";
  } else {
    result = "";
  }
  if (this.toString().match(/AUDiO CODEC/i) && this.toString().match(/-WiKi/)) {
    result = this.match(/AUDiO CODEC.*/)[0];
    result = result.audiocodec_sel();
  }
  return result;
};

String.prototype.standard_sel = function () {
  var result = this;
  if (result.match(/(4320p|8k)/i)) {
    result = "8K";
  } else if (result.match(/(1080p|2K)/i)) {
    result = "1080p";
  } else if (result.match(/(720p)/i)) {
    result = "720p";
  } else if (result.match(/(1080i)/i)) {
    result = "1080i";
  } else if (result.match(/(576p|480p)/i)) {
    result = "SD";
  } else if (result.match(/(1440p)/i)) {
    result = "144Op";
  } else if (result.match(/(2160p|4k)/i)) {
    result = "4K";
  } else {
    result = "";
  }
  return result;
};

//获取类型
String.prototype.get_type = function () {
  var result = this;
  if (result.match(/(Movie|电影|UHD原盘|films)/i)) {
    result = "电影";
  } else if (result.match(/(Animations|动漫|動畫|动画|Anime|Cartoons)/i)) {
    result = "动漫";
  } else if (result.match(/(TV.*Show|综艺)/i)) {
    result = "综艺";
  } else if (result.match(/(Docu|纪录|Documentary)/i)) {
    result = "纪录";
  } else if (result.match(/(TV.*Series|剧|TV-PACK|TV-Episode|TV)/i)) {
    result = "剧集";
  } else if (result.match(/(Music|音乐)/i)) {
    result = "音乐";
  } else if (result.match(/(Sport|体育)/i)) {
    result = "体育";
  } else if (result.match(/(学习|资料|Study)/i)) {
    result = "学习";
  } else if (result.match(/(Software|软件)/i)) {
    result = "软件";
  } else if (result.match(/(Game|游戏)/i)) {
    result = "游戏";
  } else if (result.match(/(eBook|電子書|电子书|有声书|书籍|book)/i)) {
    result = "书籍";
  } else {
    result = "";
  }

  return result;
};

String.prototype.source_sel = function () {
  var info_text = this;
  //来源就在这里获取
  if (info_text.match(/(大陆|China|中国|CN|chinese)/i)) {
    source_sel = "大陆";
  } else if (info_text.match(/(HK&TW|港台|thai)/i)) {
    source_sel = "港台";
  } else if (info_text.match(/(EU&US|欧美|US\/EU|英美)/i)) {
    source_sel = "欧美";
  } else if (info_text.match(/(JP&KR|日韩|japanese|korean)/i)) {
    source_sel = "日韩";
  } else if (info_text.match(/(香港)/i)) {
    source_sel = "香港";
  } else if (info_text.match(/(台湾)/i)) {
    source_sel = "台湾";
  } else if (info_text.match(/(日本|JP)/i)) {
    source_sel = "日本";
  } else if (info_text.match(/(韩国|KR)/i)) {
    source_sel = "韩国";
  } else if (info_text.match(/(印度)/i)) {
    source_sel = "印度";
  } else {
    source_sel = "";
  }
  return source_sel;
};

//获取副标题或是否中字、国语、粤语以及DIY
String.prototype.get_label = function () {
  var my_string = this;
  var labels = {
    gy: false,
    yy: false,
    zz: false,
    diy: false,
    hdr10: false,
    db: false,
    guanfang: true,
    ensub: false,
  };
  if (
    my_string.match(
      /([英].{0,3}字幕|[英].{0,3}字)|(Text.*?#\d+[\s\S]*?English|SUBTiTLE[\s\S]{0,30}英語|SUBTiTLE[\s\S]{0,30}英语|SUBTiTLE[\s\S]{0,30}English)/i
    )
  ) {
    labels.ensub = true;
  }
  console.log(labels);
  if (
    my_string.match(
      /([简繁].{0,12}字幕|[简繁中].{0,3}字|DIY.{1,5}字|内封.{0,3}[繁中字])|(Text.*?#\d+[\s\S]*?Chinese|subtitles.*chs|subtitles.*mandarin|subtitle.*chinese)/i
    )
  ) {
    labels.zz = true;
  }
  if (
    my_string.match(
      /(国.{0,3}语|国.{0,3}配|台.{0,3}语|台.{0,3}配)|(Audio.*Chinese|Audio.*mandarin)/i
    )
  ) {
    labels.gy = true;
  }
  if (my_string.match(/(粤.{0,3}语|粤.{0,3}配|Audio.*cantonese)/i)) {
    labels.yy = true;
  }
  if (
    my_string.match(
      /DIY|-.*?@(MTeam|CHDBits|HDHome|OurBits|HDChina|Language|TTG|Pter|HDSky|Audies|CMCT|Dream|Audies)/i
    )
  ) {
    labels.diy = true;
  }
  if (my_string.match(/hdr10/i)) {
    labels.hdr10 = true;
  }
  if (my_string.match(/Dolby Vision/i)) {
    labels.db = true;
  }
  labels.guanfang = true;
  return labels;
};

//根据简介获取来源，也就是地区国家产地之类的——尤其分类是日韩或者港台的，有的站点需要明确一下
function get_source_sel_from_descr(descr) {
  var region = "";
  var reg_region = descr.match(
    /(地.{0,5}?区|国.{0,5}?家|产.{0,5}?地)([^\r\n]+)/
  );
  if (reg_region) {
    region = reg_region[2].trim(); //去除首尾空格
    reg_region = RegExp(us_ue, "i");
    if (region.match(/香港/)) {
      region = "香港";
    } else if (region.match(/台湾|臺灣/)) {
      region = "台湾";
    } else if (region.match(/日本/)) {
      region = "日本";
    } else if (region.match(/韩国/)) {
      region = "韩国";
    } else if (region.match(/印度/)) {
      region = "印度";
    } else if (region.match(/中国|大陆/)) {
      region = "大陆";
    } else if (region.match(reg_region)) {
      region = "欧美";
    }
  }
  return region;
}

function fill_raw_info(raw_info) {
  if (raw_info.type == "电影") {
    if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}纪录片/i)) {
      raw_info.type = "纪录";
    }
    if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}动画/i)) {
      raw_info.type = "动漫";
    }
  }

  //补充豆瓣和imdb链接
  if (raw_info.url == "") {
    var url = raw_info.descr.match(
      /http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i
    );
    if (url) {
      raw_info.url = url[0] + "/";
    }
  }
  if (raw_info.dburl == "") {
    var dburl = raw_info.descr.match(
      /http(s*):\/\/.*?douban.com\/subject\/(\d+)/i
    );
    if (dburl) {
      raw_info.dburl = dburl[0] + "/";
    }
  }

  raw_info.url = raw_info.url.split("?").pop();
  //没有来源或者指向不明
  if (raw_info.source_sel == "" || raw_info.source_sel.match(/(港台|日韩)/)) {
    var region = get_source_sel_from_descr(raw_info.descr);
    if (raw_info.source_sel.match(/(港台|日韩)/)) {
      if (raw_info.source_sel == "港台") {
        if (region == "台湾") {
          raw_info.source_sel = "台湾";
        } else {
          raw_info.source_sel = "香港";
        }
      } else if (raw_info.source_sel == "日韩") {
        if (region == "日本") {
          raw_info.source_sel = "日本";
        } else {
          raw_info.source_sel = "韩国";
        }
      }
    }
    if (region != "" && raw_info.source_sel == "") {
      raw_info.source_sel = region;
    }
  }

  //如果没有媒介, 从标题获取
  if (raw_info.medium_sel == "") {
    raw_info.medium_sel = raw_info.name.medium_sel();
  }
  if (raw_info.medium_sel == "Blu-ray" && raw_info.name.match(/UHD|2160P/i)) {
    raw_info.medium_sel = "UHD";
  }

  //如果没有编码信息
  if (raw_info.codec_sel == "") {
    raw_info.codec_sel = raw_info.name.codec_sel();
  }

  //没有音频编码, 从标题获取，最后从简介获取
  if (raw_info.audiocodec_sel == "") {
    raw_info.audiocodec_sel = raw_info.name.audiocodec_sel();
    if (raw_info.audiocodec_sel == "") {
      raw_info.audiocodec_sel = raw_info.descr.audiocodec_sel();
    }
  }

  //没有分辨率
  if (raw_info.standard_sel == "") {
    raw_info.standard_sel = raw_info.name.standard_sel();
  }

  if (raw_info.name.match(/Remux/i)) {
    raw_info.medium_sel = "Remux";
  }

  return raw_info;
}

/*****************************************************************************************************************
 *                                       part 5 发布页数据逻辑处理                                                  *
 ******************************************************************************************************************/
var upload_site = site_url.split(seperator)[0]; //转发的站点
var forward_site = "PTer";
var transfer_mode = 0; // 0表示直接转，1表示候选
if (upload_site.match(/offers?.php/)) {
  transfer_mode = 1;
}

if ($("td:contains(你没有发布种子的权限)").length) {
  upload_site = upload_site.replace("upload.php", "offers.php?add_offer=1");
  location.href = encodeURI(
    upload_site + seperator + site_url.split(seperator)[1]
  );
  return;
}

raw_info = stringToDict(site_url.split(seperator)[1]); //将弄回来的字符串转成字典
raw_info.descr = raw_info.descr.replace(/ /g, " ");
raw_info.full_mediainfo = raw_info.full_mediainfo.replace(/ /g, " ");
if (raw_info.origin_site == "OurBits") {
  raw_info.descr = raw_info.descr.replace(/ /g, " ");
}
raw_info.descr = raw_info.descr.replace(/\[b\]\[\/b\]/g, "");

raw_info = fill_raw_info(raw_info);

if (raw_info.codec_sel == "H264" && raw_info.name.match(/x264/)) {
  raw_info.codec_sel = "X264";
}

//对类别做出简单修正
if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}纪录片/i)) {
  raw_info.type = "纪录";
} else if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}动画/i)) {
  if (forward_site == "PTer") {
    raw_info.type = "动漫";
  } else if (
    raw_info.type == "电影" &&
    [
      "HUDBT",
      "MTeam",
      "TLFbits",
      "HD4FANS",
      "PuTao",
      "TJUPT",
      "NanYang",
      "BYR",
      "TTG",
    ].indexOf(forward_site) < 0
  ) {
    raw_info.type = "动漫";
  }
}

raw_info.descr = raw_info.descr.replace(/\%2F/g, "/");
raw_info.descr = raw_info.descr.replace(/\%3A/g, ":");

//-------------------------------------数据填充到指定位置--------------------------------------
var allinput = document.getElementsByTagName("input");
for (i = 0; i < allinput.length; i++) {
  if (allinput[i].name == "name") {
    //填充标题
    allinput[i].value = raw_info.name;
  }

  if (allinput[i].name == "small_descr") {
    //填充副标题
    allinput[i].value = raw_info.small_descr;
  }

  if (allinput[i].name == "picture") {
    if (raw_info.descr.match(/\[img\](\S*?)\[\/img\]/i)) {
      allinput[i].value = raw_info.descr
        .match(/\[img\](\S*?)\[\/img\]/i)[1]
        .split("=")
        .pop();
    }
  }

  if (
    ["url", "pt_gen[imdb][link]"].indexOf(allinput[i].name) > -1 &&
    allinput[i].type == "text"
  ) {
    //填充imdb信息
    allinput[i].value = raw_info.url;
  }

  if (
    [
      "url_douban",
      "douban",
      "dburl",
      "douban_url",
      "douban_id",
      "durl",
      "pt_gen[douban][link]",
    ].indexOf(allinput[i].name) > -1
  ) {
    //豆瓣信息
    allinput[i].value = raw_info.dburl;
  }
}

//填写简介，一般都是textarea，特殊情况后续处理--CMCT改版兼容
var descr_box = document.getElementsByTagName("textarea");
descr_box[0].style.height = "800px";
try {
  raw_info.descr.match(/\[quote\][\s\S]*?\[\/quote\]/g).map((e) => {
    if (e.match(/General.{0,2}\nUnique/)) {
      var ee = e
        .replace("[quote]", "[hide=mediainfo]")
        .replace("[/quote]", "[/hide]");
      raw_info.descr = raw_info.descr.replace(e, ee);
    } else if (e.match(/Disc Title|Disc Info/)) {
      var ee = e
        .replace("[quote]", "[hide=bdinfo]")
        .replace("[/quote]", "[/hide]");
      raw_info.descr = raw_info.descr.replace(e, ee);
    }
  });
} catch (err) {}
descr_box[0].value = raw_info.descr;

//-------------------------------------------勾选国语粤语中字等标签--------------------------------------------------------
var label_str = raw_info.small_descr + raw_info.name + raw_info.descr;
var labels = label_str.get_label();
if (raw_info.labels % 2) {
  labels.gy = true;
}
if (9 < raw_info.labels && raw_info.labels < 100) {
  labels.yy = true;
}
if (raw_info.labels > 99) {
  labels.zz = true;
}
if (raw_info.descr.match(/国语.*?汉语普通话/)) {
  labels.gy = true;
}
if (raw_info.descr.match(/粤语/)) {
  labels.yy = true;
}
if (raw_info.name.match(/(x|H)(264|265)/i)) {
  labels.diy = false;
}
try {
  if (labels.ensub) {
    document.getElementById("ensub").checked = true;
  }
  if (labels.gy) {
    document.getElementById("guoyu").checked = true;
  }
  if (labels.yy) {
    document.getElementById("yueyu").checked = true;
  }
  if (labels.zz) {
    document.getElementById("zhongzi").checked = true;
  }
  if (labels.diy) {
    document.getElementById("diy").checked = true;
  }
  //os.system("yingzi")
  document.getElementById("guanfang").checked = true;
  //if（labels.guanfang）{ document.getElementById('guanfang').checked=true; }
} catch (err) {}

//匿名勾选
setTimeout(() => {
  try {
    document.getElementsByName("uplver")[0].checked = if_uplver;
  } catch (err) {}
}, 1000);

//-----------------------------------------------选择类填写------------------------------------------------
var type_dict = {
  电影: 401,
  剧集: 404,
  动漫: 403,
  综艺: 405,
  音乐: 406,
  纪录: 402,
  体育: 407,
  软件: 410,
  学习: 411,
  书籍: 408,
};
if (type_dict.hasOwnProperty(raw_info.type)) {
  var index = type_dict[raw_info.type];
  $('select[name="type"]').val(index);
}

var source_box = $("select[name=source_sel]");
switch (raw_info.audiocodec_sel) {
  case "Flac":
    source_box.val(8);
    break;
  case "WAV":
    source_box.val(9);
}
switch (raw_info.medium_sel) {
  case "UHD":
    source_box.val(1);
    break;
  case "Blu-ray":
    source_box.val(2);
    break;
  case "Remux":
    source_box.val(3);
    break;
  case "HDTV":
    source_box.val(4);
    break;
  case "WEB-DL":
    source_box.val(5);
    break;
  case "Encode":
    source_box.val(6);
    break;
  case "DVD":
    source_box.val(7);
}

var team_box = $("select[name=team_sel]");
var team_dict = {
  欧美: 4,
  大陆: 1,
  香港: 2,
  台湾: 3,
  日本: 6,
  韩国: 5,
  印度: 7,
};
if (team_dict.hasOwnProperty(raw_info.source_sel)) {
  var index = team_dict[raw_info.source_sel];
  team_box.val(index);
}
