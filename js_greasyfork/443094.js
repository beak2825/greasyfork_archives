// ==UserScript==
// @name         MCBBS水帖辅助工具
// @namespace    https://www.mcbbs.net/?3074655
// @version      0.18
// @description  帮助坛友高效水帖
// @author       开心的阿诺
// @match        https://www.mcbbs.net/*
// @icon         https://www.mcbbs.net/favicon.ico
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443094/MCBBS%E6%B0%B4%E5%B8%96%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/443094/MCBBS%E6%B0%B4%E5%B8%96%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (typeof jQuery == "undefined") return -1;
  let $ = unsafeWindow.jQuery;
  let url = window.location.href, searchParams = new URLSearchParams((new URL(url)).search);
  //获取tid
  let tid = "";
  if (url.indexOf("thread-") != -1){
    let start = url.indexOf("thread-") + 7;
    tid = url.substring(start, url.indexOf("-", start));
  }
  else if (searchParams.get("mod") == "viewthread" && searchParams.has("tid")){
    tid = searchParams.get("tid");
  }
  //修复备注历史遗留问题
  let string = localStorage.getItem("note");
  if (string != null){
    if (string[0] != "\`"){
      string = "\`" + string;
      localStorage.setItem("note", string);
    }
    let obj = {}, pos = 1;
    while(pos < string.length){
      let t = string.indexOf("\`\`", pos);
      let key = string.substring(pos, t);
      pos = t + 2;
      t = string.indexOf("\`", pos);
      let name = string.substring(pos, t);
      obj[key] = name;
      pos = t + 1;
    }
    localStorage.removeItem("note");
    localStorage.setItem("newNote", JSON.stringify(obj));
  }
  try{
    if (JSON.parse(localStorage.getItem("newNote")).constructor != Object) throw -1;
  }
  catch(err){
    localStorage.setItem("newNote", "{}");
  }
  //是否聚焦输入框
  function inputing(){
    return document.activeElement.type == "text" || document.activeElement.type == "textarea";
  }
  //备注图片
  const src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAADuSURBVDhPjZKxD8FAFMa/UsEijUSTkoiZxSBl7ND/uKMOHekkEmaTJrVgqdA43vWuuaL4lvfevffLd/dyGv6U67pMpPB9/z9OhUhUV0T+UVPDZDTkeR4cx9mLY65SkKBFrSEqIFltLRX+COaQ1RYnANUq/AbmkGlguT5hHsVoTKaiC+i6btFyCqAKhZszNDAeVaVpGlHM16pCUgTZoxYQHzG7XdAcD6MgCLrU444SCg/ZBaRLGUSqqk49JAh3V97omfVSiJRZiDdRtDv3r05SGfgcomEJ/4Jy0XVZp8+WGPBI9etPeVVhqyL97QTgAV0+hUuijeVaAAAAAElFTkSuQmCC`;
  //刷新script
  $(document).ready(function(){
    //设置界面弹出后刷新<script>（用innerHTML插入的<script>不会维护到DOM里面）
    if ($('#append_parent')[0]){
      //刷新script
      function refresh(script){
        let newScript = document.createElement("script");
        newScript.innerHTML = script.innerHTML;
        let src = script.getAttribute("src");
        if (src) newScript.setAttribute("src", src);
        newScript.setAttribute("initialized", "true");//打标记
        script.parentNode.replaceChild(newScript, script);
      }
      //监听#append_parent子节点的变化
      let appendObserver = new MutationObserver(() => {
        //console.log($("#append_parent")[0]);
        $('#append_parent #fwin_dialog #auxiliaryToolSetting script').each((i, v) => {
          if(v.initialized != "true") refresh(v);
        });
      });
      appendObserver.observe($('#append_parent')[0], { childList: true });
    }
  });
  //触发条件
  let conditions = {
    forum: url.indexOf("forum-") != -1 || (searchParams.get("mod") == "forumdisplay" && searchParams.has("fid")),//版块
    thread: tid != "",//帖子
    forum_chat: url.indexOf("forum-chat-") != -1 || (searchParams.get("mod") == "forumdisplay" && searchParams.get("fid") == 52),//矿工茶馆版块
    friend: url.indexOf("do=friend") != -1,//好友列表
    space: ((searchParams.has("uid") && searchParams.get("mod") == "space") || url.indexOf("/?") != -1) && searchParams.get("do") != "thread"//个人空间
  }
  //功能模块
  let modules = [
    {
      name: "菜单栏矿工茶馆按钮",
      run_at: "document-body",
      condition: true,
      code: () => {
        function teahouse(){
          $('.z.light')[0].innerHTML += `<a href="forum-chat-1.html" style="font-weight: bold;">矿工茶馆</a>`;
        }
        try { teahouse(); }
        catch(err) { $(document).ready(teahouse); }
      }
    },
    {
      name: "Q键回复",
      run_at: "document-body",
      condition: conditions.thread,
      code: () => {
        document.addEventListener("keydown", () => {
          if(window.event.keyCode == 81 && !event.ctrlKey && !event.shiftKey && !$('#fwin_reply #postsubmit')[0] && !inputing()){
            unsafeWindow.showWindow("reply", "forum.php?mod=post&action=reply&tid=" + tid);//弹出回复窗口
          }
        });
      }
    },
    {
      name: "外链直接跳转",
      run_at: "document-ready",
      condition: true,
      code: () => {
        $('a[href^="https://www.mcbbs.net/plugin.php?id=link_redirect"]').each((i, v) => {
          v.href = decodeURIComponent(v.href.substr(v.href.indexOf("&target=") + 8));//链接解码
        });
      }
    },
    {
      name: "自动确认发帖提示窗口",
      run_at: "document-ready",
      condition: true,
      code: () => {
        if ($("#append_parent")[0]){
          let appendObserver = new MutationObserver(() => {
            //console.log($("#append_parent"));
            try {
              let dom = $("#append_parent #fwin_dialog td.m_c");
              if (dom.find("div.c.altw > div.alert_right > p")[0].innerHTML.indexOf("[ 点击这里转入主题列表 ]") != -1) {
                dom.find("p.o.pns > button#fwin_dialog_submit")[0].click();
              }
            }
            catch(err) {}
          });
          appendObserver.observe($("#append_parent")[0], { childList: true });
        }
      }
    },
    {
      name: "坟贴标记",
      run_at: "document-ready",
      condition: conditions.forum_chat,
      code: () => {
        let now = new Date().getTime();
        $('#threadlist td.by>cite+em>a').each((i, v) => {
          //截取日期
          let str = v.children[0] ? v.children[0].title : v.innerHTML;
          //判断时间是否在10天内
          let t = v.parentNode.parentNode.parentNode.children[1].children[2].children[0];
          if (Date.parse(str) + 864000000 < now && t){
            t.style = "color:red;";
            t.title = "最后回复日期超过十天时，主题将被定义为坟帖，论坛禁止挖坟行为";
          }
        });
      }
    },
    {
      name: "滑动到帖子的位置（板块内）",
      run_at: "document-ready",
      condition: conditions.forum,
      code: () => {
        if (window.pageYOffset == 0) $('#thread_types')[0].scrollIntoView({behavior: "smooth"});
      }
    },
    {
      name: "预览Q键回复",
      run_at: "document-ready",
      condition: conditions.forum,
      code: () => {
        document.addEventListener("keydown", () => {
          if(window.event.keyCode == 81 && !event.ctrlKey && !inputing()){
            let screenHeight = document.documentElement.clientHeight / 2;//屏幕一半的位置
            $('.fastpreview').each((i, v) => {
              let info = v.getBoundingClientRect(), top = info.top, bottom = info.bottom;
              if (top <= screenHeight && screenHeight <= bottom){
                v.children[2].children[0].children[0].children[0].children[0].children[1].children[0].children[0].onclick()//显示回复窗口
                return false;
              }
            });
          }
        });
      }
    },
    {
      name: "更好的快速回复按钮",
      run_at: "document-ready",
      condition: conditions.thread,
      code: () => {
        function fastPost(){
          if ($('#vfastpostform')[0]){
            $('#vfastpostform')[0].innerHTML = `<a id="custom_post_reply" onclick="showWindow('reply', 'forum.php?mod=post&amp;action=reply&amp;tid=` + tid + `')" href="javascript:;" title="回复"><img src="template/mcbbs/image/pn_reply.png" align="right" alt="回复"></a>`;
          }
        }
        fastPost();
        let postObserver = new MutationObserver(() => {
          postObserver.disconnect();
          fastPost();
          postObserver.observe($('#postlist')[0], { childList: true, subtree: true });
        });
        postObserver.observe($('#postlist')[0], { childList: true, subtree: true });//监听#postlist里的变化，再次修改
      }
    },
    {
      name: "滑动到帖子的位置（帖子内）",
      run_at: "document-ready",
      condition: conditions.thread,
      code: () => {
        if (window.pageYOffset == 0) $('#pgt')[0].scrollIntoView({behavior: "smooth"});
      }
    },
    {
      name: "回复帖的快速回复",
      run_at: "document-ready",
      condition: conditions.thread,
      code: () => {
        document.addEventListener("keydown", () => {
          if(window.event.keyCode == 81 && (event.ctrlKey || event.shiftKey) && !inputing()){
            let reply = $('.fastre');//获取回复链接
            let screenHeight = document.documentElement.clientHeight / 2;//屏幕一半的位置
            $('table.plhin').each((i, v) => {
              let info = v.getBoundingClientRect(), top = info.top, bottom = info.bottom;
              if (top <= screenHeight && screenHeight <= bottom){
                window.scrollTo({ top: v.offsetTop - $('#toptb')[0].clientHeight, behavior: "smooth" });
                unsafeWindow.showWindow('reply', reply[i].href);//显示回复窗口
                return false;
              }
            });
          }
        });
      }
    },
    {
      name: "帖子内显示备注",
      run_at: "document-ready",
      condition: conditions.thread,
      code: () => {
        let obj = JSON.parse(localStorage.getItem("newNote"));
        $('.xw1[href^="home.php?mod=space&uid="]').each((i, v) => {
          let uid = v.href.substring(v.href.indexOf("&uid=") + 5);
          if (obj[uid]) v.innerHTML = obj[uid] + `<img src="` + src + `" class="vm" alt="备注" title="` + v.innerHTML + `">`;//替换用户名
        });
      }
    },
    {
      name: "快速打开/关闭隐藏内容",
      run_at: "document-ready",
      condition: conditions.thread,
      code: () => {
        document.addEventListener("keydown", () => {
          if(window.event.keyCode == 73 && !event.ctrlKey && !inputing()){
            $('.spoilerbody').each((i, v) => { v.style.display = "block"; });
          }
          else if(window.event.keyCode == 79 && !event.ctrlKey && !inputing()){
            $('.spoilerbody').each((i, v) => { v.style.display = "none"; });
          }
        });
      }
    },
    {
      name: "好友列表内显示备注",
      run_at: "document-ready",
      condition: conditions.friend,
      code: () => {
        let obj = JSON.parse(localStorage.getItem("newNote"));
        $('.xg1.xw0.y').each((i, v) => {
          let name = v.parentNode.children[1], uid = name.href.substring(name.href.indexOf("&uid=") + 5);
          if (obj[uid]) name.innerHTML = obj[uid] + `<img src="` + src + `" class="vm" alt="备注" title="` + name.innerHTML + `">`;//替换用户名
        });
      }
    },
    {
      name: "个人空间设置备注",
      run_at: "document-ready",
      condition: conditions.space,
      code: () => {
        //设置备注
        let uid = $('a.xg1[href^="http"]')[0].href;
        uid = uid.substring(uid.indexOf('?') + 1);
        $('.pbm.mbm.bbda.cl .mbn')[0].outerHTML += `<img src="` + src + `" title="备注"> <input id="noteInput" class="pt" title="输入备注" maxlength="15" style="width:25%"> <button id="noteButton" class="pn pnc vm"><strong>保存</strong></button>`;
        let obj = JSON.parse(localStorage.getItem("newNote"));
        if (obj[uid]) $('#noteInput.pt')[0].value = obj[uid];
        $('#noteButton.pn.pnc.vm')[0].addEventListener('click', () => {//点击保存按钮
          let pt = $('#noteInput.pt')[0].value;
          obj = JSON.parse(localStorage.getItem("newNote"));
          if (pt.replace(/[\u0391-\uFFE5]/g, "aa").length <= 15){//备注不得超过15个字符
            if (pt == "" && obj[uid] != null) delete obj[uid];//为空就删除备注
            else obj[uid] = pt;
            localStorage.setItem("newNote", JSON.stringify(obj));
            unsafeWindow.showDialog('备注设置成功~', '', '', () => {}, 0, () => {}, '', '', '', '1');
          }
          else{
            unsafeWindow.showDialog('备注名非法！', 'alert', '错误');
          }
        });
      }
    },
    {
      name: "晋级用户组显示",
      run_at: "document-ready",
      condition: conditions.space,
      code: () => {
        let userPoint = parseInt($("#psts")[0].children[1].children[1].childNodes[1].data);
        let point = [-999999999, 0, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
        let userGroup = ["Lv.? Herobrine", "Lv.0 流浪者", "Lv.1 伐木工", "Lv.2 采石匠", "Lv.3 挖沙工", "Lv.4 矿工", "Lv.5 农夫", "Lv.6 手艺人", "Lv.7 猎手", "Lv.8 考古家", "Lv.9 牧场主", "Lv.10 附魔师", "Lv.11 领主", "Lv.12 屠龙者"];
        let l = 0, r = point.length - 1;
        while (l < r){//我知道这里没什么必要，但还是想秀一波（被打
          let mid = (l + r + 1) >> 1;
          if (point[mid] <= userPoint) l = mid;
          else r = mid - 1;
        }
        $('#psts .pf_l')[0].innerHTML += `<li><em>晋级用户组</em>` + userGroup[l] + `</li>`;
      }
    }
  ];
  let success = true;
  modules.forEach((v) => {
    if (!v.condition) return;
    function execute(){
      try{
        v.code();
      }
      catch{
        success = false;
        console.log("MCBBS水帖辅助工具 - 模块“" + v.name + "”加载失败");
      }
    }
    switch(v.run_at){
      case "document-body":
        execute();
        break;
      case "document-ready":
        $(document).ready(execute);
        break;
    }
  });
  $(document).ready(function(){
    if (success) console.log('MCBBS水帖辅助工具 - 正常加载');
  });
})();