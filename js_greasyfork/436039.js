// ==UserScript==
// @name         U2娘+
// @version      2.1
// @description none
// @author       mwhds97
// @include      /^https?:\/\/.*u2.*dmhy.*$/
// @grant        none
// @noframes
// @namespace https://greasyfork.org/users/775990
// @downloadURL https://update.greasyfork.org/scripts/436039/U2%E5%A8%98%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/436039/U2%E5%A8%98%2B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function CreateButton(form, index, name, value, word) {
    var btn_new = document.createElement("input");
    form.insertBefore(btn_new, form.childNodes[index]);
    btn_new.outerHTML = '<input type="button" id="btn_' + name + '" class="btn" name="btn_' + name + '" value="' + value + '">';
    document.getElementById("btn_" + name).addEventListener("click", function() {
      document.getElementsByName("shbox_text")[0].value = "U2娘 " + word;
      document.getElementById("hbsubmit").click();
    }, false);
  }

  var buttons = [{"name": "income", "value": "赚分速度", "word": "我的赚分速度"},
  {"name": "myuc", "value": "我的UC", "word": "我的UCoin"},
  {"name": "alluc", "value": "全站UC", "word": "全站UC存量"},
  {"name": "rich", "value": "比我壕", "word": "U2有多少人比我壕"},
  {"name": "afford", "value": "买得起药", "word": "多少人买得起邀请"},
  {"name": "ratio", "value": "分享率", "word": "我的分享率"},
  {"name": "real", "value": "实际分享率", "word": "我的实际分享率"},
  {"name": "sign", "value": "签名条", "word": "签名条"},
  {"name": "skill", "value": "技能", "word": "我的技能"},
  {"name": "photo", "value": "头像", "word": "看看我的头像"},
  {"name": "so", "value": "取向", "word": "我的取向"},
  {"name": "harem", "value": "后宫", "word": "我的后宫"},
  {"name": "power", "value": "战斗力", "word": "我的战斗力"},
  {"name": "uid", "value": "用户ID", "word": "我的UID"},
  {"name": "degree", "value": "Love度", "word": "我和你的love度"},
  {"name": "u2nyan", "value": "U2娘", "word": ""},
  {"name": "ohayo", "value": "早安", "word": "早安"},
  {"name": "oyasumi", "value": "晚安", "word": "晚安"},
  {"name": "boynum", "value": "男生数", "word": "U2有多少男生"},
  {"name": "girlnum", "value": "女生数", "word": "U2有多少女生"},
  {"name": "nhnum", "value": "伪娘数", "word": "U2有多少伪娘"},
  {"name": "comfort", "value": "求安慰", "word": "求安慰"},
  {"name": "daddy", "value": "求包养", "word": "求包养"},
  {"name": "merge", "value": "求合体", "word": "求合体"},
  {"name": "date", "value": "求交往", "word": "求交往"},
  {"name": "sex", "value": "求交尾", "word": "求交尾"},
  {"name": "sm", "value": "求虐", "word": "求虐"},
  {"name": "train", "value": "求调教", "word": "求调教"},
  {"name": "invite", "value": "求邀请", "word": "求邀请"},
  {"name": "creampie", "value": "求中出", "word": "求中出"},
  {"name": "ll", "value": "LoveLive！", "word": "lovelive"},
  {"name": "les", "value": "百合", "word": "百合"},
  {"name": "makeinu", "value": "败犬", "word": "败犬"},
  {"name": "lollipop", "value": "棒棒糖", "word": "棒棒糖"},
  {"name": "excuse", "value": "抱妹借口", "word": "抱妹最佳借口"},
  {"name": "transform", "value": "变身", "word": "变身"},
  {"name": "bkb", "value": "兵库北", "word": "兵库北"},
  {"name": "title", "value": "长标题", "word": "长标题"},
  {"name": "roll", "value": "抽种子", "word": "手气不错"},
  {"name": "comeout", "value": "出柜", "word": "出柜"},
  {"name": "attack", "value": "出击", "word": "出击"},
  {"name": "answer", "value": "答案", "word": "the answer to life, the universe, and everything"},
  {"name": "gohome", "value": "带回家", "word": "跟我回家去"},
  {"name": "pour", "value": "倒茶", "word": "倒茶"},
  {"name": "recurse", "value": "递归", "word": "递归"},
  {"name": "railgun", "value": "电磁炮", "word": "电磁炮S全剧终"},
  {"name": "wind", "value": "风儿", "word": "今天的风儿好喧嚣啊"},
  {"name": "creed", "value": "教义", "word": "教义"},
  {"name": "dignity", "value": "节操", "word": "掉节操"},
  {"name": "donate", "value": "捐赠", "word": "捐赠"},
  {"name": "wine", "value": "口嚼酒", "word": "我要口嚼酒"},
  {"name": "grandpa", "value": "姥爷", "word": "姥爷"},
  {"name": "loli", "value": "萝莉", "word": "萝莉"},
  {"name": "mahjong", "value": "麻将", "word": "麻将"},
  {"name": "bro", "value": "买基", "word": "买基"},
  {"name": "moe", "value": "卖萌", "word": "卖个萌"},
  {"name": "alone", "value": "没朋友", "word": "我赌这货没有朋友"},
  {"name": "nyanpasu", "value": "喵帕斯", "word": "喵帕斯"},
  {"name": "defy", "value": "藐视", "word": "藐视"},
  {"name": "head", "value": "摸摸头", "word": "摸摸头"},
  {"name": "mhsj", "value": "魔法少女", "word": "魔法少女"},
  {"name": "nico", "value": "妮可", "word": "niconiconi"},
  {"name": "makeinus", "value": "你坛败犬", "word": "你坛败犬"},
  {"name": "ntr", "value": "牛头人", "word": "NTR"},
  {"name": "warm", "value": "暖被窝", "word": "暖被窝"},
  {"name": "ims", "value": "偶像大师", "word": "projectim@s"},
  {"name": "pants", "value": "胖次", "word": "胖次"},
  {"name": "fall", "value": "平地摔", "word": "平地摔"},
  {"name": "choc", "value": "巧克力", "word": "巧克力"},
  {"name": "valentine", "value": "情人节", "word": "情人节快乐"},
  {"name": "tea", "value": "请用茶", "word": "请用茶"},
  {"name": "body", "value": "身体检查", "word": "身体检查"},
  {"name": "beast", "value": "神兽", "word": "四神兽"},
  {"name": "bithday", "value": "生日", "word": "生日"},
  {"name": "misaki", "value": "食蜂操祈", "word": "食蜂操祈"},
  {"name": "world", "value": "世界线", "word": "世界线"},
  {"name": "model", "value": "手办", "word": "你的手办多少钱"},
  {"name": "lady", "value": "淑女", "word": "何为淑女"},
  {"name": "rabbit", "value": "兔纸", "word": "兔纸"},
  {"name": "push", "value": "推倒", "word": "推倒"},
  {"name": "omni", "value": "万能", "word": "万能的U2群聊区啊"},
  {"name": "newhalf", "value": "伪娘", "word": "伪娘"},
  {"name": "love", "value": "我爱你", "word": "我爱你"},
  {"name": "myhead", "value": "我的头", "word": "我的头"},
  {"name": "imoe", "value": "我好萌", "word": "我好萌"},
  {"name": "back", "value": "我回来了", "word": "我回来了"},
  {"name": "thirsty", "value": "我渴了", "word": "我渴了"},
  {"name": "milk", "value": "武藏野牛奶", "word": "武藏野牛奶"},
  {"name": "bath", "value": "洗澡", "word": "洗澡"},
  {"name": "play", "value": "羞耻play", "word": "羞耻play"},
  {"name": "dog", "value": "眼镜狗", "word": "每只狗都应该有个男孩"},
  {"name": "nyx", "value": "夜神", "word": "夜神"},
  {"name": "r21", "value": "雨妹", "word": "雨妹"},
  {"name": "uspt", "value": "专利局", "word": "USPT"},
  {"name": "eternal", "value": "+1秒", "word": "+1s"}];

  var shbox = document.getElementsByName("shbox")[0];
  for(var i in shbox.childNodes) {
    if(shbox.childNodes[i].type === "reset") {
      i = parseInt(i);
      break;
    }
  }
  shbox.childNodes[i + 1].outerHTML = '<a href="javascript:void(0)" id="expand">U2娘的小秘密</a>';
  document.getElementById("expand").addEventListener("mouseover", function() {
    for(var j = 0; j < buttons.length; j++) {
      CreateButton(shbox, i + j + 1, buttons[j].name, buttons[j].value, buttons[j].word);
    }
    shbox.removeChild(document.getElementById("expand"));
  }, false);
})();
