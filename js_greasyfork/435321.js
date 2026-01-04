// ==UserScript==
// @name         PTer Letter Helper
// @author       Mlxg, ccf2012
// @thanks       感谢 xasi 大佬整理！
// @version      2.3.16
// @description  如题.
// @match        https://*.pterclub.com/staffbox.php?action=answermessage&receiver=*&answeringto=*
// @match        https://*.pterclub.com/torrents.php*
// @match        https://*.pterclub.com/edit.php*
// @match        https://*.pterclub.com/editgame.php*
// @match        https://*.pterclub.com/music.php*
// @match        https://*.pterclub.com/officialgroup.php*
// @match        https://*.pterclub.com/reports.php*
// @match        https://*.pterclub.com/sendmessage.php?receiver=*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @namespace https://greasyfork.org/users/812132
// @downloadURL https://update.greasyfork.org/scripts/435321/PTer%20Letter%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/435321/PTer%20Letter%20Helper.meta.js
// ==/UserScript==
 
let url = document.location.href;
(function () {
  "use strict";
 
  if (url.match("staffbox.php")) {
    staffboxHelper();
  }
  if (url.match(/torrents\.php|music|official|edit\.php|editgame\.php/gi)) {
    delFormHelper();
  }
  if (url.match("reports.php")) {
    reportFormHelper();
  }
  if (url.match("sendmessage.php")) {
    sendmsgHelper();
  }
  globalCss();
})();
 
function staffboxHelper() {
  var quotemsg = document.getElementsByTagName("textarea")[0].value;
  function fill_in(str) {
    // 填入

    document.getElementsByTagName("textarea")[0].value = quotemsg + "\n\n ----------- 管理组回复 -----------\n " + str;
    // console.log('click');
  }
 
  // 按钮 div
  let fill_in_div = document.createElement("div");
  fill_in_div.id = "fill_in_div";
  document.getElementsByTagName("h2")[0].after(fill_in_div);
 
  // 申请
  let data1 = [
    {
      title: "申请压制组",
      textarea:
        "[size=4]感谢你的申请。\r\n申请压制组，请升级加菲猫/Power User后，参考[url=/forums.php?action=viewtopic&topicid=6672]压制交流区. Encoding-->PTer压制组招新帖[/url]\r\n期待你的早日加入！[/size]",
    },
    {
      title: "申请网络组",
      textarea: "欢迎对网络组感兴趣，请在telegram上联系@xasiqiu (https://t.me/xasiqiu)  详聊。",
    },
    // {
    //     title: '申请发布组（不满足发布数量）',
    //     textarea: '欢迎申请，但申请加入发布组要求进本站满3个月且在本站至少已经发布经过CHECK的种子40个，请发布够了后再行申请。'
    // },
    // {
    //     title: '申请发布组（已满足发布数量)',
    //     textarea: '欢迎对发布组感兴趣，请在telegram上联系xxxxxxxxxxxx。'
    // },
    {
      title: "申请发布组",
      textarea: "本站已暂停招募非游戏类的纯转载类型发布员。",
    },
    {
      title: "申请录制组",
      textarea: "欢迎对录制组感兴趣，请在telegram上联系@hsdzdh （https://t.me/hsdzdh）详聊。",
    },
    {
      title: "申请保种组-未达标",
      textarea:
        "您好，在申请加入保种组之前请确认：1. 您所保的官种（不包含MV）体积已经大于10T，2. 您的上传速率大于等于30Mbps。如果您多站兼职保种组，请确认您的上传速率大于等于100Mbps，或者您承诺您能够保证相当的保种上传速率。如果您确认自己满足上述条件，请再次私信管理组，组长会对您的申请进行评估并做出决定",
    },
	{
      title: "申请保种组-已达标",
      textarea:
        "您好，在申请加入保种组之前请确认：1. 您所保的官种（不包含MV）体积已经大于10T，2. 您的上传速率大于等于30Mbps。如果您多站兼职保种组，请确认您的上传速率大于等于100Mbps，或者您承诺您能够保证相当的保种上传速率。因为您已经达标，请加群 https://t.me/+aFQBBdHjzaVhY2Fh",
    },
	{
      title: "申请游戏组",
      textarea:
        "请先阅读[url=https://crocus-chess-60e.notion.site/49df6030bdd3495093e4885f23d7fd44]游戏组简章[/url]。\r\n 之后确定有意的话，请在telegram上联系 https://t.me/plancai 详聊。如尚未发布任何游戏种子，请先发布几个之后再次申请。"
    },
    {
      title: "申请徽章",
      textarea: "徽章已经挂上，恭喜恭喜。希望你在猫站玩的开心。",
    },
  ];
 
  let fill_in_div1 = document.createElement("div");
  fill_in_div1.id = "fill_in_div1";
  document.getElementById("fill_in_div").append(fill_in_div1);
 
  let div1_hr = document.createElement("hr");
  div1_hr.setAttribute("class", "fill_in_hr");
  document.getElementById("fill_in_div1").after(div1_hr);
 
  for (let i = 0; i < data1.length; i++) {
    let button = document.createElement("button");
    document.getElementById("fill_in_div1").append(button);
    button.setAttribute("class", "fill_in_button");
    button.setAttribute("type", "button");
    button.innerText = data1[i].title;
    button.addEventListener("click", function () {
      fill_in(data1[i].textarea);
    });
  }
 
  // 其他
  let fill_in_div2 = document.createElement("div");
  fill_in_div2.id = "fill_in_div2";
  document.getElementById("fill_in_div").append(fill_in_div2);
 
  let data2 = [
    {
      title: "种子审核",
      textarea:
        "[size=4]种子管理组每天有几百个种子需要处理，所以请耐心等待种子管理组的审核，勿催促。\r\n\r\n若候选或种子[b]完成修改[/b]，请使用对应页面内的的[b]举报及反馈系统[/b]，如下图所示：\r\n\r\n[url=https://s3.pterclub.com/image/vhacK2][img]https://img.pterclub.com/images/2022/04/20/image.png[/img][/url]\r\n\r\n[url=https://s3.pterclub.com/image/vhaN1D][img]https://img.pterclub.com/images/2022/04/20/image665281147510d405.png[/img][/url]\r\n\r\n感谢体谅，祝好！[/size]",
    },
    {
      title: "提建议",
      textarea:
        "[size=4]非常感谢您的建议！\r\n但为了让更多的人了解原委，也让站点更公开透明，避免重复提问及回答问题，\r\n请将此建议发布在[url=https://pterclub.com/forums.php?action=viewforum&forumid=4]建议区 . Suggestions[/url]，届时我们将会做出回应。\r\n猫站管理组[em28] \r\n[/size]",
    },
    {
      title: "连接性问题",
      textarea:
        "[size=4]本站使用了CloudFlare作为加速，出现这样的问题可能是你本地连接CloudFlare的能力较差。\r\n\n可以通过host、添加ipv6支持的方式改善，具体参考这篇文章：[url=https://wiki.pterclub.com/wiki/%E4%B8%BA%E4%BB%80%E4%B9%88%E6%9C%89%E6%97%B6%E5%80%99%E5%9C%A8%E5%9B%BD%E5%86%85%E6%97%A0%E6%B3%95%E6%89%93%E5%BC%80%E7%BD%91%E7%AB%99%EF%BC%9F]Wiki[/url]\r\n\n猫站管理组[/size]",
    },
    {
      title: "警告申诉",
      textarea:
        "您好，警告期满后，警告会自动消除。\r\n警告不是世界末日，不再犯同样错误即可。",
    },
    {
      title: "二步验证",
      textarea:
        "[size=4]在二次验证遗失的情况下，通过在登录界面点击通过邮箱重置密码，或点击[url=https://pterclub.com/recover.php]这里[/url]也可以自动删除2FA。无需管理组介入。\r\n \r\n 更多2FA细节可阅读https://wiki.pterclub.com/wiki/2FA \r\n[/size]",
    },
    {
      title: "修改邮箱和用户名",
      textarea: "目前不支持修改邮箱和用户名。",
    },
    {
      title: "后宫邮箱手误",
      textarea: "邀请人在邀请界面手动验证，然后让受邀人发送管理组信息。",
    },
    {
      title: "升级延迟",
      textarea: "系统更新需6~12小时不等，如等级未及时更新请稍候。",
    },
    {
      title: "询问捐赠",
      textarea:
        "感谢您的支持，目前猫站不支持捐赠。\r\n您的保种和活跃就是对猫站最大的支持[em28]",
    },
	{
      title: "猫粮变负数",
      textarea:
        "一般情况下，是用户误点了“帖子置顶1天 (将扣除 20,000 克猫粮)” 或者“帖子置顶和免费1天 (将扣除 25,000 克猫粮)”。或者使用了不合适的脚本或者脚本+浏览器组合。\r\n \r\n 请参阅 [url=https://wiki.pterclub.com/wiki/%E6%88%91%E7%9A%84%E7%8C%AB%E7%B2%AE%E4%B8%BA%E4%BB%80%E4%B9%88%E5%8F%98%E6%88%90%E8%B4%9F%E6%95%B0%E4%BA%86]Wiki[/url] 获取更多信息",
    },
	{
      title: "触发流控",
      textarea:
        "因限制短时间内海量从服务器下载种子而触发流控。\r\n \r\n 请参阅 [url=https://wiki.pterclub.com/wiki/Forbidden:_Your_download_permission_is_frozen]Wiki[/url] 获取更多信息",
    },
    {
      title: "被强制候选无法发布",
      textarea:
        "你可能因为发布不规范，暂时不能再直接发布。请首先完成所有helper提示的修改，之后通过候选区发布5个合格种子后即可恢复发种权限。\r\n \r\n对于候选，请到候选区提交你的发布请求。在累计通过5个候选后举报候选说明已达标，要求解除强制候选，即可解除发布封禁。之后才可以点击“允许”进行发布。\r\n \r\n 感谢理解与合作！",
    },
  ];
 
  for (let i = 0; i < data2.length; i++) {
    let button = document.createElement("button");
    document.getElementById("fill_in_div2").append(button);
    button.setAttribute("class", "fill_in_button");
    button.setAttribute("type", "button");
    button.innerText = data2[i].title;
    button.addEventListener("click", function () {
      fill_in(data2[i].textarea);
    });
  }
}
 
function delform_fill_in(textarea, type) {
  // 填入
  // input[8].value = str;
  var radioInput = document.getElementById(type); // $("#"+type)
  if (radioInput) {
    radioInput.checked = true;
  }
  var reasonInput = document.getElementsByName("reason_input")[0];
  if (reasonInput) {
    reasonInput.value = textarea;
  }
}
 
function delFormHelper() {
  var data;
  var delFormTable;
 
  if (url.match(/editgame\.php|torrents\.php.*cat=409.*/gi)) {
    data = [
      // 游戏类
      {
        title: "模拟器 + 游戏捆绑包",
        textarea:
          "规则 1.2.4：请不要上传模拟器 + 游戏捆绑包 [url=https://wiki.pterclub.com/wiki/游戏相关资源上传规则]游戏相关资源上传规则[/url]",
        type: "r-violated",
      },
      {
        title: "游戏命名规则",
        textarea:
          "[url=https://wiki.pterclub.com/wiki/游戏相关资源上传规则]游戏相关资源上传规则[/url]",
        type: "r-violated",
      },
      {
        title: "游戏合集资源",
        textarea:
          "规则 2.1.6：游戏合集资源需要到[url=https://pterclub.com/forums.php?action=viewforum&forumid=36]论坛申请发布[/url]",
        type: "r-violated",
      },
      {
        title: "禁止发布正版备份",
        textarea: "规则 1.2.1：禁止发布正版备份等受 DRM 保护的内容",
        type: "r-violated",
      },
      {
        title: "未更改的原始 scene 发布",
        textarea: "未更改的原始 scene 发布",
        type: "r-violated",
      },
      {
        title: "版本更新",
        textarea: "版本更新",
        type: "r-repack",
      },
      {
        title: "发布者请求删除",
        textarea: "发布者请求删除",
        type: "r-other",
      },
    ];
  } else {
    data = [
      // DUPE : 重复 | 禁转 : 其他 | 其他 : 违规
      {
        title: "断种",
        textarea: "断种",
        type: "r-dead",
      },
      {
        title: "禁止发布小组 FGT、RARBG、Mp4Ba",
        textarea:
          "禁止发布小组 FGT、RARBG、Mp4Ba等小组作品: [url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）]不允许的资源和文件[/url]",
        type: "r-nuked",
      },
      {
        title: "DUPE",
        textarea:
          "[url=https://wiki.pterclub.com/wiki/DUPE及死种重发]DUPE及死种重发[/url]",
        type: "r-dupe",
      },
      {
        title: "REPACK",
        textarea: "REPACK / FIX / 的有更好版本",
        type: "r-repack",
      },
      {
        title: "合集已出",
        textarea: "根据资源合集规则，予以删除，感谢您的贡献！",
        type: "r-package",
      },
      /*{
                    title: '种子传错已重发，发布者请求删除',
                    textarea: '种子传错已重发，发布者请求删除',
                    type: 'error'
                },*/
      {
        title: "命名错误",
        textarea:
          "[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）]文件名、文件夹采用0day命名法[/url]",
        type: "r-violated",
      },
      {
        title: "无视修改意见",
        textarea: "发种不规范，无视管理组修改意见",
        type: "r-violated",
      },
      {
        title: "占坑发布",
        textarea:
          "不允许发布其他站未出种资源，上传者必须实际拥有所上传的文件 [url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）]上传总则[/url]",
        type: "r-violated",
      },
      {
        title: "篡改文件",
        textarea: "转载自其他 PT 站的资源，请保持所有原始文件及文件名称不变",
        type: "r-violated",
      },
      {
        title: "包含无关文件",
        textarea:
          "请删除相关文件后仅保留 mkv / mp4 重新发布种子 [url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）]不允许的资源和文件[/url]",
        type: "r-violated",
      },
      {
        title: "版权保护",
        textarea:
          "[url=https://pterclub.com/forums.php?action=viewtopic&topicid=375&page=p2128]本站禁止上传国家版权局重点作品版权保护预警名单里的电影[/url]",
        type: "r-violated",
      },
      {
        title: "违规合集",
        textarea:
          "[url=https://wiki.pterclub.com/wiki/资源打包规则]资源打包规则[/url]",
        type: "r-other",
      },
      {
        title: "发布者请求删除",
        textarea: "发布者请求删除",
        type: "r-other",
      },
      {
        title: "禁转资源",
        textarea:
          "他站禁转资源: [url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）]不允许的资源和文件[/url]",
        type: "r-other",
      },
 
    ];
  }
 
  var pager2;
  if (url.match(/need_edit/gi)){
    delFormTable = document.querySelector("#delete-torrent-form > table:nth-child(4)");
    pager2 = document.querySelectorAll( "#outer > table.main > tbody > tr > td > p.np-pager" )[1];
  } else if (url.match(/\/edit.php/gi)) {
        delFormTable = document.querySelector("#delete-torrent-form > table");
  } else {
    delFormTable = document.querySelector("#delete-torrent-form > table:nth-child(4)");
    pager2 = document.querySelectorAll( "#outer > table.main > tbody > tr > td > p.np-pager" )[1];
  }
 
  if (!delFormTable) {
    console.log("#delete-torrent-form not found");
    return;
  }
  var parentForm = delFormTable.parentElement;
 
  if (pager2) {
    let pager_div = document.createElement("div");
    pager_div.id = "pager_div";
    pager_div.setAttribute("align", "center");
    pager_div.appendChild(pager2);
    parentForm.appendChild(pager_div);
  }
 
 
  delFormTable.setAttribute("align", "left");
  delFormTable.style.marginLeft = "180px";
  // 按钮 div
  let fill_in_div = document.createElement("div");
  fill_in_div.id = "fill_in_div";
  // delFormTable.after(fill_in_div);
  parentForm.appendChild(delFormTable);
  parentForm.appendChild(fill_in_div);
 
  for (let i = 0; i < data.length; i++) {
    let button = document.createElement("button");
    fill_in_div.append(button);
    button.setAttribute("class", "fill_in_button");
    button.setAttribute("type", "button");
    button.innerText = data[i].title;
    button.addEventListener("click", function () {
        delform_fill_in(data[i].textarea, data[i].type);
    });
    if (data[i].type === "r-violated") {
     button.style.backgroundColor = "rgba(255, 99, 132, 0.2)";
    } else if (data[i].type === "r-nuked") {
      button.style.backgroundColor = "rgba(255, 206, 86, 0.2)";
    } else if (data[i].type === "r-dupe") {
      button.style.backgroundColor = "rgba(75, 192, 192, 0.2)";
    } else if (data[i].type === "r-repack") {
      button.style.backgroundColor = "rgba(153, 102, 255, 0.2)";
    } else if (data[i].type === "r-package") {
      button.style.backgroundColor = "rgba(255, 159, 64, 0.2)";
    }
    else {
      button.style.backgroundColor = "rgba(54, 162, 235, 0.2)";
    }
  }
}
 
function reportFormHelper() {
  let tbodyArr = document.getElementsByTagName("tbody");
  let tbody = tbodyArr[tbodyArr.length - 2];
  let trArr = tbody.getElementsByTagName("tr");
  let timeArr = [];
  let uidArr = [];
  let titleArr = [];
  let torrentIdArr = [];
  let typeArr = [];
  let reasonArr = [];
  for (let i = 2; i < trArr.length - 1; i++) {
    let tdArr = trArr[i].getElementsByTagName("td");
    if (!tdArr[0].getElementsByTagName("nobr")[0].innerHTML.match("span")) {
      timeArr.push(tdArr[0].getElementsByTagName("nobr")[0].innerText);
    } else {
      timeArr.push(tdArr[0].getElementsByTagName("span")[0].title);
    }
    uidArr.push(tdArr[1].getElementsByTagName("a")[0].href.match(/\d+/gi)[0]);
    titleArr.push(tdArr[2].innerText);
    if (tdArr[2].innerHTML.match(/\d+/gi)) {
      torrentIdArr.push(tdArr[2].innerHTML.match(/\d+/gi)[0]);
    } else {
      torrentIdArr.push("");
    }
    typeArr.push(tdArr[3].innerText);
    reasonArr.push(tdArr[4].innerText);
    if (tdArr[5].innerHTML.match("否")) {
      let button = document.createElement("button");
      button.innerText = "回复";
      button.setAttribute("class", "reportsBtn");
      button.addEventListener("click", reportsButton.bind(this, i - 2));
      button.setAttribute("type", "button");
      tdArr[5].append(button);
    } else {
      let button = document.createElement("button");
      button.innerText = "回复";
      button.setAttribute("class", "reportsBtn");
      button.addEventListener("click", reportsButton.bind(this, i - 2));
      button.setAttribute("type", "button");
      trArr[i].insertBefore(button, tdArr[6].nextSibling);
    }
  }
 
  function reportsButton(i) {
    // window.location.href="https://pterclub.com/sendmessage.php?receiver=" + uid[i];
    window.open("https://pterclub.com/sendmessage.php?receiver=" + uidArr[i]);
    GM_setValue("time", timeArr[i]);
    GM_setValue("uid", uidArr[i]);
    GM_setValue("title", titleArr[i]);
    GM_setValue("torrentIdArr", torrentIdArr[i]);
    GM_setValue("type", typeArr[i]);
    GM_setValue("reason", reasonArr[i]);
  }
}
 
function sendmsgHelper() {
  if (document.referrer.match("reports.php")) {
    console.log("time: ", GM_getValue("time", ""));
    console.log("reason: ", GM_getValue("reason", ""));
    let titleTag = document.getElementsByTagName("input")[2];
    let textareaTag = document.getElementsByTagName("textarea")[0];
    if (GM_getValue("torrentIdArr")) {
      titleTag.value =
        "关于" + GM_getValue("title", "") + GM_getValue("type", "") + "的举报";
      textareaTag.value =
        "[size=4]您举报了 [b]" +
        GM_getValue("type", "") +
        "[/b] [url=https://pterclub.com/details.php?id=" +
        GM_getValue("torrentIdArr", "") +
        "]" +
        GM_getValue("title", "") +
        "[/url]\r\n\n时间：" +
        GM_getValue("time", "") +
        "\r\n\n举报理由：" +
        GM_getValue("reason", "") +
        "\r\n\n处理意见：\r\n\n[/size]";
    } else {
      titleTag.value = "关于" + GM_getValue("title", "") + "的举报";
      textareaTag.value =
        "[size=4]您举报了 [b]" +
        GM_getValue("type", "") +
        "[/b] " +
        GM_getValue("title", "") +
        "\r\n\n时间：" +
        GM_getValue("time", "") +
        "\r\n\n举报理由：" +
        GM_getValue("reason", "") +
        "\r\n\n处理意见：\r\n\n[/size]";
    }
  }
}
 
function globalCss() {
  GM_addStyle(`
    #fill_in_div {
        display: flex; flex-direction: column;
        margin-top: 40px;
        margin-left:80px;
        text-align: left;
    }
 
    #pager_div {
        margin-top: 10px;
        margin-margin: 15px;
 
    }
    .fill_in_button {
        border: none;
        background-color: white;
        text-align: left;
        cursor: pointer;
        // margin: auto;
        margin-top: 2px;
        margin-left: 50px;
        margin-right: 50px;
    }
 
    .fill_in_hr {
        border: 1px solid #ff9718;
        width: 80%;
    }
 
    .reportsBtn {
        border: none;
        background-color: white;
        text-align: center;
        cursor: pointer;
        margin: 5px 5px;
        color: blue;
    }
    `);
}