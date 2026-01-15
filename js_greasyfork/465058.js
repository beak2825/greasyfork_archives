// ==UserScript==
// @name         🔥拓展增强🔥妖火网插件
// @namespace    https://yaohuo.me/
// @version      3.19.5
// @description  发帖ubb增强、回帖ubb增强、回帖表情增强、查看贴子显示用户等级增强、手动吃肉增强、自动加载更多帖子、自动加载更多回复、一键自动上传图床、支持个性化菜单配置
// @author       龙少c(id:20469)开发，参考其他大佬：外卖不用券(id:23825)、侯莫晨、Swilder-M
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464198/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%A6%96%E7%81%AB%E7%BD%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/464198/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%A6%96%E7%81%AB%E7%BD%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

/* 
 功能描述：
  1. 贴子列表、贴子页、回复页支持自动加载更多、最大加载数量内自动加载（默认 150 条可单独配置），达到最大加载数量则不会自动加载。
  2. 自己手动进入肉帖吃肉（默认关闭）
  3. 吃过的肉帖。自己手动提交会弹窗提示已吃过肉，是否确认提交
  4. 自动记忆所有吃过的肉帖，在配置天数内（默认一天可单独配置），吃过的肉帖不会重复吃肉。
  5. 贴子页显示楼主等级（默认打开）
  6. 增加可配置菜单，默认移动端开启，悬浮在右上角，PC 端不打开。所有功能都能单独开启和关闭，兼容其他插件，可以和其他插件一起使用，关闭本插件的相同功能即可。
  7. 回帖表情增强，可配置默认是否展开
  8. 回帖ubb增强，可配置默认是否展开
  9. 发帖ubb增强
  10. 发帖、回帖页面增加自动上传图床功能，支持手动选择图片上传、复制图片上传、截图上传、拖拽图片上传
 */

(function () {
  ("use strict");

  // 实现简易版替换用到的jquery，全部换成原生js太麻烦
  let $, jQuery;
  $ = jQuery = myJquery();

  let settingData = {
    // 是否显示站内图标
    isShowSettingIcon: true,
    // 是否关闭站内勋章
    isCloseMedal: false,
    // pc端帖子页面悬浮查看
    isShowPcFloatPage: false,
    // 站内密码
    websitePassword: "",
    // 是否开启自动吃肉，手动进去肉帖自动吃肉
    isAutoEat: false,
    // 帖子里是否显示用户等级
    isShowLevel: true,
    // 刷新时间间隔
    timeInterval: 60,
    // 设置肉帖过期时间，过期前不会再自动吃肉
    expiredDays: 1,
    // 是否自动加载下一页
    isLoadNextPage: false,
    // 加载按钮方式: more / nextPage
    loadNextPageType: isMobile() ? "more" : "nextPage",
    // 一页最大的加载数量，超过数量就不会自动加载
    maxLoadNum: 150,
    // 滑块range最小和最大值
    minNumRange: 50,
    maxNumRange: 500,
    numStep: 50,
    // 设置悬浮按钮位置
    settingBtnLeft: 0,
    settingBtnTop: 0,
    // 按钮的响应试大小，单位vw，默认18vw
    settingIconResponsiveSize: 18,
    // 按钮最大的大小，单位px，默认100px
    settingIconMaxSize: 100,

    // 自动加载页面时是否执行尾部
    isExecTrail: true,

    // 是否增加发帖ubb
    isAddNewPostUBB: true,
    // 是否增加回帖ubb
    isAddReplyUBB: true,
    // 是否增加回帖表情
    isAddReplyFace: true,
    // 是否默认展开表情
    isUnfoldFace: false,
    // 回帖表情包图床：妖友七牛云：url1、极速图床：url2、imgBB：url3
    replyFaceImageBed: "url1",
    // 是否默认展开表情
    isUnfoldUbb: false,
    // 是否自动上传到图床
    isUploadImage: false,
    // 上传图床token
    imageBedType: "极速图床",
    inkToken: "",
    meetToken: "",
    speedFreeToken: "",
  };
  let yaohuo_userData = null;
  // 数据初始化
  initSetting();

  let {
    isAutoEat,
    isShowLevel,
    timeInterval,
    expiredDays,
    isLoadNextPage,
    isExecTrail,

    maxLoadNum,
    minNumRange,
    maxNumRange,
    numStep,

    isShowSettingIcon,

    settingBtnLeft,
    settingBtnTop,

    settingIconMaxSize,
    settingIconResponsiveSize,

    isAddNewPostUBB,
    isAddReplyUBB,
    isAddReplyFace,
    isUnfoldFace,
    replyFaceImageBed,
    isUnfoldUbb,

    loadNextPageType,

    isUploadImage,
    imageBedType,
    inkToken,
    meetToken,
    speedFreeToken,

    websitePassword,
    isCloseMedal,
    isShowPcFloatPage,
  } = yaohuo_userData;

  // 存储吃过肉的id，如果吃过肉则不会重复吃肉
  let autoEatList = getItem("autoEatList");
  // 回复页
  const viewPage = ["/bbs/book_re.aspx", "/bbs/book_view.aspx"];
  // 帖子列表页面
  const bbsPage = ["/bbs/book_list.aspx", "/bbs/list.aspx"];
  // 帖子浏览页面
  const isBbsViewPage = [/^\/bbs-.*\.html$/, /\/bbs\/view.aspx/].some((item) =>
    item.test(window.location.pathname)
  );
  // 发帖
  const postPage = [
    "/bbs/book_view_add.aspx",
    "/bbs/book_view_sendmoney.aspx",
    "/bbs/book_view_addvote.aspx",
    "/bbs/book_view_addfile.aspx",
    "/bbs/book_view_mod.aspx",
    "/bbs/book_view_addURL.aspx",
  ];
  const loadNextPage = [
    /\/bbs\/book_re.aspx/,
    /\/bbs\/book_list.aspx/,
    /\/bbs\/list.aspx/,
    /\/bbs-.*\.html/,
    /\/bbs\/book_list_hot\.aspx/, //热门页面
    /\/bbs\/book_list_search\.aspx/, //查询用户界面
  ];
  // 404
  const notFoundPage = ["/404.htm"];
  const faceList = [
    "踩.gif",
    "狂踩.gif",
    "淡定.gif",
    "囧.gif",
    "不要.gif",
    "重拳出击.gif",
    "砳砳.gif",
    "滑稽砳砳.gif",
    "沙发.gif",
    "汗.gif",
    "亲亲.gif",
    "太开心.gif",
    "酷.gif",
    "思考.gif",
    "发呆.gif",
    "得瑟.gif",
    "哈哈.gif",
    "泪流满面.gif",
    "放电.gif",
    "困.gif",
    "超人.gif",
    "害羞.gif",
    "呃.gif",
    "哇哦.gif",
    "要死了.gif",
    "谢谢.gif",
    "抓狂.gif",
    "无奈.gif",
    "不好笑.gif",
    "呦呵.gif",
    "感动.gif",
    "喜欢.gif",
    "疑问.gif",
    "委屈.gif",
    "你不行.gif",
    "流口水.gif",
    "潜水.gif",
    "咒骂.gif",
    "耶耶.gif",
    "被揍.gif",
    "抱走.gif",
  ];
  /* 
  妖友七牛云：url1
  极速图床：url2
  imgBB：url3
  */
  const diyFaceList = [
    {
      url1: "http://static2.51gonggui.com/FhBfMfl4sGC3QJVTMaLqEKkE90Ia#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/43dd22ed354af.gif",
      url3: "https://i.ibb.co/hXBXGq8/jy.gif",

      name: "摸鱼",
    },
    {
      url1: "http://static2.51gonggui.com/FmNyrjU8Wq0m3PiwHQJwDhHdv-EJ#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/eef531d5b6d9a.gif",
      url3: "https://i.ibb.co/L0scf9m/jw.gif",

      name: "稽舞",
    },
    {
      url1: "http://static2.51gonggui.com/FoKvdu89eiq0q-24IfOM2mFB0vIq#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/1171162cca357.gif",
      url3: "https://i.ibb.co/rmQY19V/sj.gif",

      name: "色稽",
    },
    {
      url1: "http://static2.51gonggui.com/FrZ6GDJiOAz3pp4e5_8uSShSXXXk#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/57521f3d1f794.gif",
      url3: "https://i.ibb.co/h14QP4d/jj.gif",

      name: "撒娇",
    },
    {
      url1: "http://static2.51gonggui.com/FiZiSSyXSa8eCzwOXmIfOOpfA_7a#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/004aa1eb1823a.gif",
      url3: "https://i.ibb.co/9yD4mFW/jg.gif",

      name: "稽狗",
    },
    {
      url1: "http://static2.51gonggui.com/FqNDzswUNJ-AsSHXyxXB4Qm1X0y-#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/51300ab6aede6.gif",
      url3: "https://i.ibb.co/CnNY1SG/mq.gif",

      name: "没钱",
    },
    {
      url1: "http://static2.51gonggui.com/Fsq-HyBc5lP6vZY_qeWofOM9mRVH#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/f046ae22fbae2.gif",
      url3: "https://i.ibb.co/0qTfStm/sw.gif",

      name: "骚舞",
    },
    {
      url1: "http://static2.51gonggui.com/FhCk4emkrO9f8ICFxKlm8wBcTOgT#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/c09bfc7f5330f.gif",
      url3: "https://i.ibb.co/yh8bSx7/cs.gif",

      name: "吃屎",
    },
    {
      url1: "http://static2.51gonggui.com/FkEHwSlEfQ7bWya6-wg366Xy91qW#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/4b55370c90e67.gif",
      url3: "https://i.ibb.co/3BxqbXX/bs.gif",

      name: "鄙视",
    },
    {
      url1: "http://static2.51gonggui.com/Fi2hY7M9DPgD9s0aCWemwk2iYUDW#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/21ab651293d60.gif",
      url3: "https://i.ibb.co/3NrbQfQ/tg.gif",

      name: "听歌",
    },
    {
      url1: "http://static2.51gonggui.com/Fhry6EpdUBqFCt3OOyQTkLZMZGFR#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/2e503027f610f.gif",
      url3: "https://i.ibb.co/whDBFQd/st.gif",

      name: "伸头",
    },
    {
      url1: "http://static2.51gonggui.com/FhgYnWJ-apnyjSXOpInJhLbfUQFY#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/a082bfe5b0df3.gif",
      url3: "https://i.ibb.co/7KzRsmd/gz.gif",

      name: "鼓掌",
    },
    {
      url1: "http://static2.51gonggui.com/FvSxOEIhyA7ID1J8emIME7tBT7Io#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/93c17a9cd77e9.gif",
      url3: "https://i.ibb.co/KNGfHFw/tt.gif",

      name: "踢腿",
    },
    {
      url1: "http://static2.51gonggui.com/FunDHky9UKkB-4zj-bfSb82u81Xg#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/3592472aaa316.png",
      url3: "https://i.ibb.co/sKS4R3x/nt.png",

      name: "男同",
    },
    {
      url1: "http://static2.51gonggui.com/FgXUeACmKWWMDT9hrpVAnQp4dCqF#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/998ff0f986f04.gif",
      url3: "https://i.ibb.co/VCWLFgz/sq.gif",

      name: "手枪",
    },
    {
      url1: "http://static2.51gonggui.com/Fg_qtra3abNozPxaoEMVKO7VIsuX#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/c75d396a66b71.gif",
      url3: "https://i.ibb.co/pjw803c/pt.gif",

      name: "拍头",
    },
    {
      url1: "http://static2.51gonggui.com/FnNg1vOiuOlSe7WFWRyNZfO_4H3U#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/b630057c9a2b8.gif",
      url3: "https://i.ibb.co/fNcvwj0/tp.gif",

      name: "躺平",
    },
    {
      url1: "http://static2.51gonggui.com/Fj7WAkv87tpL1I26WQgSaXlsyYBL#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/78c30a6fe8c89.gif",
      url3: "https://i.ibb.co/5jJwwdQ/zj.gif",

      name: "追稽",
    },
    {
      url1: "http://static2.51gonggui.com/FgwFBazeUavJcw-SL7FS6wUkcUTk#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/ed1aa444817d3.gif",
      url3: "https://i.ibb.co/mRLMkyv/lsj.gif",

      name: "司稽",
    },
    {
      url1: "http://static2.51gonggui.com/FjXNVx-MUgAVq62aNqekSPOUjDAC#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/6c4e56b9f0c2c.gif",
      url3: "https://i.ibb.co/7KKybVg/qt.gif",

      name: "乞讨",
    },
    {
      url1: "http://static2.51gonggui.com/FjudMlJdd8dLXuGjyASN7JldAxqe#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/7f9769ba90ff0.gif",
      url3: "https://i.ibb.co/3r8mtKh/gj.gif",

      name: "跪稽",
    },
    {
      url1: "http://static2.51gonggui.com/Fm8DQQwyYthk8Q97ZLScgCDXsv4_#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/e1248fbb24b75.gif",
      url3: "https://i.ibb.co/PWMFdB8/dn.gif",

      name: "刀你",
    },
    {
      url1: "http://static2.51gonggui.com/FqTaBgs1l8bqeDYBxcWzxF4Wgt6_#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/d5eedd30ad4bd.gif",
      url3: "https://i.ibb.co/BcHh8kn/dp.gif",

      name: "冲刺",
    },
    {
      url1: "http://static2.51gonggui.com/Fmw152FIzN1gpFrbCKlp7cmqlCxc#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/9272af6cae5d3.gif",
      url3: "https://i.ibb.co/LDycW8K/zq.gif",

      name: "转圈",
    },
    {
      url1: "http://static2.51gonggui.com/Fmf5aWS5yqycKebxTno7un53h9HW#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/58e57366425c9.gif",
      url3: "https://i.ibb.co/7gNd669/cj.gif",

      name: "吃稽",
    },
    {
      url1: "http://static2.51gonggui.com/FhUkLD2khZ7hn1uzArWkT47Pd9jq#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/ef0f9e3f3e353.gif",
      url3: "https://i.ibb.co/7S2T2pF/fj.gif",

      name: "犯贱",
    },
    {
      url1: "http://static2.51gonggui.com/FihrjZwpB1jMdOF9QvtQG3J32z4q#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/524b369abefa3.gif",
      url3: "https://i.ibb.co/yFtQtLM/nb.gif",

      name: "牛掰",
    },
    {
      url1: "http://static2.51gonggui.com/FlX6e1Ip6Z8gvl7lkimmCifwBhFt#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/05/659798ffccac4.gif",
      url3: "https://i.ibb.co/FVnL0PB/yb.gif",

      name: "拥抱",
    },
    {
      url1: "http://static2.51gonggui.com/FoIs-hNK7fhW8jwxEgDLRxARFcve#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/dfe36d68642e8.gif",
      url3: "https://i.ibb.co/Nj0V2gM/722ee7ce0b4fdecd.gif",

      name: "拍头",
    },
    {
      url1: "http://static2.51gonggui.com/Fgx4XlxG9461Y_TJsg0hGxPTylYi#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/989aa4d6e0aeb.gif",
      url3: "https://i.ibb.co/64Gmn3C/25e66a6595b1dc82.gif",

      name: "摇头",
    },
    {
      url1: "http://static2.51gonggui.com/Fvrng91QU_PKY9Uwat77VTVouj5k#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/84a18f0849126.gif",
      url3: "https://i.ibb.co/2jWY20p/rt.gif",

      name: "挠头",
    },
    {
      url1: "http://static2.51gonggui.com/FkyiMRaJI1BfuA6T3w4Z9mJh1qbg#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/216607e845f48.gif",
      url3: "https://i.ibb.co/SdD7Vct/sx.gif",

      name: "上学",
    },
    {
      url1: "http://static2.51gonggui.com/FpZEifxiFGs1BWtHjFsk5tJJNKSE#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/4914eecbff777.gif",
      url3: "https://i.ibb.co/dmng48J/lh.gif",

      name: "流汗",
    },
    {
      url1: "http://static2.51gonggui.com/FiBZZ6mBTB5R5bu5lGkybboOwLwm#.gif",
      url2: "https://tucdn.wpon.cn/2023/08/07/4181f12786715.gif",
      url3: "https://i.ibb.co/GH0Q94V/5614974ef677a274.gif",

      name: "摩擦",
    },
    {
      url1: "http://static2.51gonggui.com/FmMtly844_wS6LfLLtLSwgzcXSqg#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/9a7bd5c247170.gif",
      url3: "https://i.ibb.co/zbPnx6p/hyl.gif",

      name: "喝饮料",
    },
    {
      url1: "http://static2.51gonggui.com/FqyckEvAxFVyD1SmA9m2jInv_Crb#.gif",
      url2: "https://tucdn.wpon.cn/2023/06/16/4416bfa6a8ba7.gif",
      url3: "https://i.ibb.co/Lhp7Hv5/mg.gif",

      name: "猛狗",
    },
    {
      url1: "http://static2.51gonggui.com/FmfsKjv4ymuWR80UGY-sea-I_Ey5#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/e0b400a7e3dc2.gif",
      url3: "https://i.ibb.co/pzh7P1x/hl.gif",

      name: "妲己",
    },
    {
      url1: "http://static2.51gonggui.com/FkEmzRCL3eJGlgkHHnHTy94sXwE1#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/06fe11a5e5fb1.gif",
      url3: "https://i.ibb.co/jbpQSMW/jw.gif",

      name: "街舞",
    },
    {
      url1: "http://static2.51gonggui.com/FgiAIOkFg8qG3UZKQx24ImVDrDRj#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/d7bda91d8179a.gif",
      url3: "https://i.ibb.co/WtR06gb/gd.gif",

      name: "功德",
    },
    {
      url1: "http://static2.51gonggui.com/Fl2Zonx2Y8z-xZrSQnGBWzsnRKC9#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/c2b8c1714199f.gif",
      url3: "https://i.ibb.co/HCp8nfK/hyl2.gif",

      name: "晃饮料",
    },
    {
      url1: "http://static2.51gonggui.com/FvMXbnIX8RavSBAhflxf1zomD1ov#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/ce54bf9b4abbe.gif",
      url3: "https://i.ibb.co/fnsVq6r/sz.gif",

      name: "扇子",
    },
    {
      url1: "http://static2.51gonggui.com/FmD3h-QCVdJ-ehjLh8_G-nQzynuv#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/1441dd979ce22.gif",
      url3: "https://i.ibb.co/64MJMCL/mb.gif",

      name: "膜拜",
    },
    {
      url1: "http://static2.51gonggui.com/FoGXe8yRSIomTZFM78TZVyP-kwlz#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/d33fcaada32c2.gif",
      url3: "https://i.ibb.co/yyyKLDr/xx.gif",

      name: "醒醒",
    },
    {
      url1: "http://static2.51gonggui.com/Fim_ZRiJugrWJkDtq4SlqbOziuZ3#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/12e032ec1f22f.gif",
      url3: "https://i.ibb.co/nL32s9K/bz.gif",

      name: "巴掌",
    },
    {
      url1: "http://static2.51gonggui.com/FpVLTimqXFvRJB9PxWDKMherZoRi#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/9ec67435a9478.gif",
      url3: "https://i.ibb.co/12bpF7R/gz.gif",

      name: "鼓掌",
    },
    {
      url1: "http://static2.51gonggui.com/Fit100hjJ-T5RwQxeNdoVWplvNvU#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/edf6a0ead646d.gif",
      url3: "https://i.ibb.co/C7wyK9x/qz.gif",

      name: "该死",
    },
    {
      url1: "http://static2.51gonggui.com/FkeVK5icB5-Pc7mbZitDTX1AqfNO#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/c0f568beacb26.gif",
      url3: "https://i.ibb.co/NKZGsFh/xz.gif",

      name: "红酒",
    },
    {
      url1: "http://static2.51gonggui.com/FnjJRSH3_CLjYyyQzVjD8mtY-PdB#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/d2175ea23bebb.gif",
      url3: "https://i.ibb.co/QQRBQTT/kx.gif",

      name: "开心",
    },
    {
      url1: "http://static2.51gonggui.com/Foqd_tGWrk-ARnNrt-XraMCDzhUS#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/3ae5c9f741f59.gif",
      url3: "https://i.ibb.co/Z6jmV32/jz.gif",

      name: "紧张",
    },
    {
      url1: "http://static2.51gonggui.com/FsCE3iHM0REN077WKr0bssyKiR7Z#.gif",
      url2: "https://tucdn.wpon.cn/2023/10/08/5bd9dd04fe8b6.gif",
      url3: "https://i.ibb.co/Bw8xYQP/kq2.gif",

      name: "伤心2",
    },
    {
      url1: "https://p6.itc.cn/q_70/images03/20210723/3b9017a6580644e4af8b43d73b92c0a9.gif",

      name: "看戏",
    },
    {
      url1: "https://p0.itc.cn/q_70/images03/20210723/4874b66b12f04be1aab989d289e8635a.gif",

      name: "顶你",
    },
    {
      url1: "https://pic2.ziyuan.wang/user/guest/2024/04/kwyjjlck_81f49e01db86c.gif",

      name: "哭死",
    },
    {
      url1: "https://p2.itc.cn/q_70/images03/20210723/f9c4a2e9879f438c9f151366442f311e.gif",

      name: "看不见",
    },
    {
      url1: "https://p8.itc.cn/q_70/images03/20210723/189ca0ed210142999a1661d2bd3cf852.gif",

      name: "蹲坑",
    },
    {
      url1: "https://pic2.zhimg.com/v2-568bb2311e00c3ecbc4dd49ab0709f09_b.gif",

      name: "磨刀",
    },
    {
      url1: "https://pic.ziyuan.wang/user/sub/2024/04/458ed8da862d4a71bc5ab4c2435711fd_088c2fc6f5680.png",

      name: "小丑",
    },
    {
      url1: "https://i.piantu.cn/2024/04/14/839386c85e1803d082b11cfe2fe5c33f.gif",

      name: "有鬼",
    },
  ];
  // 批量添加事件数组
  let addEventAry = [
    {
      id: "ubb_id",
      ubb: "[userid]",
      offset: 0,
    },
    {
      id: "ubb_ip",
      ubb: "[ip]",
      offset: 0,
    },
    {
      id: "ubb_url",
      ubb: "[url=网址]文字说明[/url]",
      offset: 6,
    },
    {
      id: "ubb_text",
      ubb: "[text]全角转半角：代码内容[/text]",
      offset: 0,
    },
    {
      id: "ubb_br",
      ubb: "///",
      offset: 0,
    },
    {
      id: "ubb_hr",
      ubb: "[hr]",
      offset: 0,
    },
    {
      id: "ubb_left",
      ubb: "[left]",
      offset: 0,
    },
    {
      id: "ubb_center",
      ubb: "[center]",
      offset: 0,
    },
    {
      id: "ubb_right",
      ubb: "[right]",
      offset: 0,
    },
    {
      id: "ubb_font",
      ubb: "[font=serif][/font]",
      offset: 7,
    },
    {
      id: "ubb_b",
      ubb: "[b]加粗文字[/b]",
      offset: 4,
    },
    {
      id: "ubb_i",
      ubb: "[i]斜体文字[/i]",
      offset: 4,
    },
    {
      id: "ubb_u",
      ubb: "[u]下划线文字[/u]",
      offset: 0,
    },
    {
      id: "ubb_color",
      ubb: "[forecolor=red]颜色文字，默认红[/forecolor]",
      offset: 12,
    },
    {
      id: "ubb_img",
      ubb: "[img]图片链接[/img]",
      offset: 6,
    },
    {
      id: "ubb_strike",
      ubb: "[strike]删除线文字[/strike]",
      offset: 9,
    },
    {
      id: "ubb_call",
      ubb: "[call]拨号手机号码[/call]",
      offset: 0,
    },
    {
      id: "ubb_sms",
      ubb: "[url=sms:手机号码?body=短信内容]点此发送[/url]",
      offset: 0,
    },
    {
      id: "ubb_now",
      ubb: "当前系统日期和时间：[now]",
      offset: 0,
    },
    {
      id: "ubb_codo",
      ubb: "倒计天：[codo]2030-01-01[/codo]",
      offset: 0,
    },
    {
      id: "ubb_audio",
      ubb: "[audio=X]音频直链地址[/audio]",
      offset: 8,
    },
    {
      id: "ubb_movie",
      ubb: "[movie=100%*100%]视频直链地址|封面图片地址[/movie]",
      offset: 8,
    },
    {
      id: "ubb_nzgsa",
      ubb: "[audio=X]https://file.uhsea.com/2304/3deb45e90564252bf281f47c7b47a153KJ.mp3[/audio]",
      offset: 0,
    },
  ];

  let timer = null;

  // 是否点击加载更多
  let isClickLoadMoreBtn = false;
  // 是否是新页面
  let isNewPage = false;

  const spanstyle =
    "color: #fff; padding: 2px 4px; font-size: 14px; background-color: #ccc;border-radius: 10%;";
  const a2style =
    "color: #fff; padding: 2px 4px; font-size: 14px; background-color: #d19275;border-radius: 10%;";
  const a3style =
    "color: #fff; padding: 2px 4px; font-size: 14px; background-color: #66ccff;border-radius: 10%;";
  // ==主代码执行==
  (function () {
    // 修复网站更新样式错乱问题
    handleStyle();
    // 处理浏览器滚动条事件
    handleWindowScroll();
    // 处理窗口改变事件
    handleWindowResize();
    // 添加站内设置按钮
    addSettingBtn();
    // 自动填充密码并确认
    handlePassword();
    // 关闭勋章显示
    handleCloseMedal();
    // 如果关闭了悬浮图标，在网站首页右上角添加插件设置入口
    handleAddSettingText();
    // 加载更多按钮点击事件监听
    handleAddLoadMoreBtnClick();
    // 手动吃肉：手动进入肉帖吃
    handleAutoEat();
    // 增加回帖ubb
    handleAddReplyUBB();
    // 增加回帖表情
    handleAddReplyFace();
    // 优化回帖
    handleReply();
    // pc端帖子页面悬浮查看
    handleBbsListFloatOpen();
    // 自动上传图床功能
    handleUploadImage();
    // 增加发帖ubb
    handleAddNewPostUBB();
    // 处理404页面跳回新帖页面
    handleNotFoundPage();
  })();

  // ==其他功能函数和方法==
  function handleStyle() {
    MY_addStyle(`
      .centered-container {
        display: block !important;
      }
    `);

    let flexDivs = document.querySelectorAll('div[style*="display: flex"]');

    // 遍历选中的元素并添加额外的样式
    for (let i = 0; i < flexDivs.length; i++) {
      flexDivs[i].style.flexWrap = "wrap";
    }
  }
  function handleCloseMedal() {
    if (
      /^\/bbs-\d+\.html|\/bbs\/book_view.aspx$/.test(
        window.location.pathname
      ) &&
      isCloseMedal
    ) {
      let medalImg = [...document.querySelectorAll(".xunzhangtupian > img")];
      medalImg.forEach((item, index) => {
        if (index === 0) {
          item.insertAdjacentHTML(
            "afterend",
            `<a href="javascript:;">已关闭勋章显示</a>`
          );
        }
        item.remove();
      });
    }
  }
  function handlePassword() {
    let password = document.querySelector("input[type=password]");
    let submit = document.querySelector("input[type=submit]");
    if (document.title === "请输入密码") {
      if (!password.value) {
        password.value = websitePassword;
      }
      if (password.value) {
        submit.click();
      }
    }
  }
  function handleAddSettingText() {
    // 修改pc端滚动条样式
    if (!isMobile()) {
      MY_addStyle(`
        /*滚动条整体样式*/
        /*高宽分别对应横竖滚动条的尺寸*/
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          background-color: #F5F5F5;
        }
        /*定义滚动条轨道 内阴影+圆角*/
        ::-webkit-scrollbar-track
        {
          box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
          border-radius: 3px;
          background-color: #F5F5F5;
        }
        /*滚动条里面小方块*/
        ::-webkit-scrollbar-thumb {
          /* height: 50px; */
          border-radius:3px;
          box-shadow: inset 0 0 6px rgba(0,0,0,.3);
          background-color: #b8b8b8;
        }
        ::-webkit-scrollbar-thumb:hover {
          /* height: 50px; */
          background-color: #878987;
          border-radius: 6px
        }
      `);
    }

    if (!isShowSettingIcon && $(".top2").length) {
      $(".top2").append(
        `<a class="yaohuo-setting-text" style="float:right;cursor: pointer;">插件设置</a>`
      );

      $(".yaohuo-setting-text").click(() => {
        setMenu();
      });
    }
  }
  function isMobile() {
    return /Mobile/i.test(navigator.userAgent);
  }
  function initSetting() {
    // 在移动设备上执行的代码
    if (isMobile()) {
      // 移动端默认显示站内设置图标
      settingData.isShowSettingIcon = true;
    } else {
      // 在桌面设备上执行的代码
    }

    // 获取用户历史数据
    yaohuo_userData = MY_getValue("yaohuo_userData");

    // 查看本地是否存在旧数据
    if (!yaohuo_userData) {
      yaohuo_userData = settingData;
      // MY_setValue("yaohuo_userData", yaohuo_userData);
    }

    // 自动更新数据
    for (let value in settingData) {
      if (!yaohuo_userData.hasOwnProperty(value)) {
        yaohuo_userData[value] = settingData[value];
        MY_setValue("yaohuo_userData", yaohuo_userData);
      }
    }

    initSettingBtnPosition("init");
  }
  // 更新按钮位置到最右边
  /**
   * 当按钮靠最右边时，设置按钮的left偏移
   * @param {'init' | 'update'} type type值为init / update
   */
  function initSettingBtnPosition(type = "update") {
    let { settingBtnTop, settingIconResponsiveSize, settingIconMaxSize } =
      yaohuo_userData;
    let newLeft;

    // btn最大100px，根据屏幕视口取18vw
    newLeft = Math.floor(
      window.innerWidth -
        Math.min(
          (window.innerWidth / 100) * settingIconResponsiveSize,
          settingIconMaxSize
        )
    );
    if (type === "update") {
      const floatingDiv = $("#floating-setting-btn")[0];
      floatingDiv.style.left = newLeft + "px";
    }
    saveSettingBtnPosition({ left: newLeft, top: settingBtnTop });
  }
  /**
   * 保存设置按钮的位置
   * @param {Object} pos - 按钮位置信息
   * @param {number} pos.left - 按钮左边距
   * @param {number} pos.top - 按钮上边距
   */
  function saveSettingBtnPosition({ left, top }) {
    yaohuo_userData.settingBtnLeft = left;
    yaohuo_userData.settingBtnTop = top;

    setItem("yaohuo_userData", yaohuo_userData);
  }

  function addSettingBtn() {
    if ($("#floating-setting-btn").length) {
      return;
    }

    MY_addStyle(`
      #floating-setting-btn {
        display: ${isShowSettingIcon ? "block" : "none"};
        max-width: ${settingIconMaxSize}px;
        max-height: ${settingIconMaxSize}px;
        width: ${settingIconResponsiveSize}vw;
        height: ${settingIconResponsiveSize}vw;
        user-select: none;
        box-sizing: border-box;
        position: fixed;
        z-index: 999;
        cursor: move;
        background-repeat: no-repeat;
        background-position: center;
      }
      #floating-setting-btn svg {
        width: 100%;
        height: 100%;
        opacity: 0.6;
        filter: drop-shadow(0px 0px 3px #666);
      }
      .overflow-hidden-scroll {
        overflow: hidden !important;
      }
      .touch-action-none {
        touch-action: none;
      }
      .add-position-static{
        position: static !important;
      }
    `);

    let innerH = `
      <div id="floating-setting-btn" style="top: ${settingBtnTop}px;
        left: ${settingBtnLeft}px;">
        </svg>
        <svg
          t="1681624380345"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="11281"
          width="80"
          height="80"
        >
          <path
            d="M761.472 978.944H253.696c-115.328 0-208.768-93.44-208.768-208.768V262.528C45.056 147.2 138.496 53.76 253.696 53.76h507.776C876.8 53.76 970.24 147.2 970.24 262.528v507.776c0 115.2-93.44 208.64-208.768 208.64z"
            fill="#89898F"
            p-id="11282"
          ></path>
          <path
            d="M602.368 513.408h-189.44C334.208 513.408 270.08 449.28 270.08 370.56S334.208 227.84 412.928 227.84h189.44c78.72 0 142.848 64.128 142.848 142.848s-64.128 142.72-142.848 142.72z m-189.44-262.272c-65.92 0-119.552 53.632-119.552 119.552s53.632 119.552 119.552 119.552h189.44c65.92 0 119.552-53.632 119.552-119.552s-53.632-119.552-119.552-119.552h-189.44zM611.072 804.864H404.224c-72.448 0-131.2-58.752-131.2-131.2s58.752-131.2 131.2-131.2h206.976c72.448 0 131.2 58.752 131.2 131.2-0.128 72.576-58.88 131.2-131.328 131.2z"
            fill="#FFFFFF"
            p-id="11283"
          ></path>
          <path
            d="M417.28 370.56m-80.128 0a80.128 80.128 0 1 0 160.256 0 80.128 80.128 0 1 0-160.256 0Z"
            fill="#FFFFFF"
            p-id="11284"
          ></path>
          <path
            d="M619.392 673.792m-80.128 0a80.128 80.128 0 1 0 160.256 0 80.128 80.128 0 1 0-160.256 0Z"
            fill="#89898F"
            p-id="11285"
          ></path>
        </svg>
      </div>
    `;
    $("body").append(innerH);

    const floatingDiv = $("#floating-setting-btn")[0];

    let mouseOffsetX = 0;
    let mouseOffsetY = 0;
    let isDragging = false;
    let dragThreshold = 5; // 拖动阈值，即鼠标移动的距离超过多少像素才开始拖动
    let clickThreshold = 500; // 点击阈值，即鼠标按下的时间不超过多少毫秒才算是点击

    let mouseDownTime; // 鼠标按下的时间
    let mouseDownX; // 鼠标按下的位置
    let mouseDownY;

    // 鼠标事件
    floatingDiv.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", throttle(onMouseMove, 15));
    document.addEventListener("mouseup", onMouseUp);

    // 触摸事件
    floatingDiv.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", throttle(onTouchMove, 5));
    document.addEventListener("touchend", onTouchEnd);

    // 鼠标事件监听器
    function onMouseDown(e) {
      floatingDiv.style.transition = "unset";

      // 记录鼠标按下的时间和位置
      mouseDownTime = new Date().getTime();
      mouseDownX = e.clientX;
      mouseDownY = e.clientY;

      // 鼠标相对于拖动图标的偏移x和y距离
      mouseOffsetX = e.clientX - floatingDiv.offsetLeft;
      mouseOffsetY = e.clientY - floatingDiv.offsetTop;
      isDragging = true;

      e.preventDefault();
      e.stopPropagation();
    }

    function onMouseMove(e) {
      if (!isDragging) {
        return;
      }

      const left = e.clientX - mouseOffsetX;
      const top = e.clientY - mouseOffsetY;

      const maxLeft = window.innerWidth - floatingDiv.offsetWidth;
      const maxTop = window.innerHeight - floatingDiv.offsetHeight;

      floatingDiv.style.left = Math.min(Math.max(0, left), maxLeft) + "px";
      floatingDiv.style.top = Math.min(Math.max(0, top), maxTop) + "px";
    }

    function onMouseUp(e) {
      if (!isDragging) {
        return;
      }

      // 拖动结束重置数据
      mouseOffsetX = 0;
      mouseOffsetY = 0;
      isDragging = false;

      // 如果按下的时间不够长，则认为是点击事件
      // 如果移动的距离

      let distanceX = Math.abs(e.clientX - mouseDownX);
      let distanceY = Math.abs(e.clientY - mouseDownY);
      // 计算鼠标点击的时间小于500ms，并且移动的距离少于5像素则认为时点击事件
      if (
        new Date().getTime() - mouseDownTime < clickThreshold &&
        distanceX < dragThreshold &&
        distanceY < dragThreshold
      ) {
        setMenu();
        return;
      }

      // 拖动按钮自动靠边处理
      let newLeft;
      let position = floatingDiv.getBoundingClientRect();
      // 如果左边比右边多就靠左，否则靠右
      if (window.innerWidth - position.right > position.left) {
        newLeft = 0;
      } else {
        newLeft = window.innerWidth - position.width;
      }

      floatingDiv.style.left = newLeft + "px";
      floatingDiv.style.transition = "all 0.2s ease-in-out";

      // 更新悬浮图标位置信息
      saveSettingBtnPosition({ top: position.top, left: newLeft });
    }

    // 触摸事件监听器
    function onTouchStart(e) {
      floatingDiv.style.transition = "unset";

      // 记录鼠标按下的时间和位置
      mouseDownTime = new Date().getTime();

      mouseDownX = e.touches[0].clientX;
      mouseDownY = e.touches[0].clientY;

      mouseOffsetX = e.touches[0].clientX - floatingDiv.offsetLeft;
      mouseOffsetY = e.touches[0].clientY - floatingDiv.offsetTop;
      isDragging = true;

      e.preventDefault();
      e.stopPropagation();

      $("body").addClass("touch-action-none");
      $("body").addClass("overflow-hidden-scroll");
    }

    function onTouchMove(e) {
      if (!isDragging) {
        return;
      }

      const left = e.touches[0].clientX - mouseOffsetX;
      const top = e.touches[0].clientY - mouseOffsetY;

      const maxLeft = window.innerWidth - floatingDiv.offsetWidth;
      const maxTop = window.innerHeight - floatingDiv.offsetHeight;

      floatingDiv.style.left = Math.min(Math.max(0, left), maxLeft) + "px";
      floatingDiv.style.top = Math.min(Math.max(0, top), maxTop) + "px";
    }

    function onTouchEnd(e) {
      if (!isDragging) {
        return;
      }
      $("body").removeClass("touch-action-none");
      $("body").removeClass("overflow-hidden-scroll");

      // 拖动结束重置数据
      mouseOffsetX = 0;
      mouseOffsetY = 0;
      isDragging = false;

      // 如果按下的时间不够长，则认为是点击事件
      // 如果移动的距离
      let touch = e.changedTouches[0];
      let clientX = touch.clientX;
      let clientY = touch.clientY;

      let distanceX = Math.abs(clientX - mouseDownX);
      let distanceY = Math.abs(clientY - mouseDownY);

      // 计算鼠标点击的时间小于500ms，并且移动的距离少于5像素则认为时点击事件
      if (
        new Date().getTime() - mouseDownTime < clickThreshold &&
        distanceX < dragThreshold &&
        distanceY < dragThreshold
      ) {
        setMenu();
        return;
      }

      // 拖动按钮自动靠边处理
      let newLeft;
      let position = floatingDiv.getBoundingClientRect();
      // 如果左边比右边多就靠左，否则靠右
      if (window.innerWidth - position.right > position.left) {
        newLeft = 0;
      } else {
        newLeft = window.innerWidth - position.width;
      }
      floatingDiv.style.left = newLeft + "px";
      floatingDiv.style.transition = "all 0.2s ease-in-out";

      // 更新悬浮图标位置信息
      saveSettingBtnPosition({ top: position.top, left: newLeft });
    }
  }
  // 处理窗口改变事件
  function handleWindowResize() {
    // 窗口改变重新计算悬浮按钮的位置
    window.addEventListener("resize", function (e) {
      let { settingBtnLeft } = yaohuo_userData;

      if (settingBtnLeft !== 0) {
        initSettingBtnPosition("update");
      }
    });
  }
  function getIcon(icon, tips) {
    let iconConfig = {
      tipIcon: `<svg t="1688708359358" onclick="alert('${tips}')" class="icon tip-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1472" width="16" height="16"><path d="M512 1024c-281.6 0-512-230.4-512-512s230.4-512 512-512 512 230.4 512 512S793.6 1024 512 1024zM512 64C262.4 64 64 262.4 64 512s198.4 448 448 448 448-198.4 448-448S761.6 64 512 64z" fill="#3D3D3D" p-id="1473"></path><path d="M614.4 313.6c25.6 25.6 38.4 51.2 38.4 89.6 0 32-6.4 57.6-25.6 76.8C627.2 492.8 608 505.6 576 531.2 563.2 544 556.8 556.8 550.4 563.2c0 6.4-6.4 12.8-6.4 25.6 0 19.2-19.2 32-32 32l0 0c-19.2 0-38.4-19.2-32-38.4 0-12.8 6.4-25.6 6.4-32 6.4-19.2 32-44.8 70.4-76.8l12.8-12.8c12.8-12.8 19.2-32 19.2-44.8 0-19.2-6.4-38.4-19.2-51.2C556.8 345.6 537.6 339.2 512 339.2c-32 0-51.2 6.4-64 25.6C441.6 371.2 435.2 384 435.2 403.2c0 19.2-19.2 32-32 32l0 0c-19.2 0-38.4-19.2-32-44.8C377.6 358.4 390.4 339.2 403.2 320c25.6-25.6 64-38.4 108.8-38.4C556.8 281.6 595.2 288 614.4 313.6zM537.6 665.6c6.4 6.4 12.8 19.2 12.8 32 0 12.8-6.4 25.6-12.8 32-12.8 6.4-19.2 12.8-32 12.8-12.8 0-25.6-6.4-32-12.8-6.4-6.4-12.8-19.2-12.8-32 0-12.8 6.4-25.6 12.8-32 6.4-6.4 19.2-12.8 32-12.8C518.4 652.8 531.2 659.2 537.6 665.6z" fill="#3D3D3D" p-id="1474"></path></svg>`,
      eyeIcon: `<svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="eye"
      width="20px"
      height="20px"
      fill="currentColor"
      aria-hidden="true"
      class="toggle-password"
    >
      <path
        d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"
      ></path>
    </svg>`,
    };
    return iconConfig[icon];
  }
  function setMenu() {
    // 避免重复添加
    if ($(".yaohuo-modal-mask").length) {
      return;
    }
    MY_addStyle(`
      .yaohuo-modal-mask {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 1000;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.45);
      }
      .yaohuo-wrap {
        padding: 20px 0;
        box-sizing: border-box;
        position: relative;
        margin: 0 auto;
        background: #fff;
        border-radius: 12px;
        top: 10%;
        width: 400px;
        max-width: 95vw;
        user-select: none;
      }
      .yaohuo-wrap header {
        padding: 0 20px;
        color: rgba(0, 0, 0, 0.88);
        font-weight: 600;
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 8px;
      }
      .yaohuo-wrap footer {
        font-size: 0px;
        text-align: right;
        margin-top: 10px;
        padding: 0 20px;
      }
      .yaohuo-wrap footer button {
        font-size: 14px;
        height: 32px;
        padding: 4px 15px;
        border-radius: 6px;
        border: 1px solid transparent;
        cursor: pointer;
      }
      .yaohuo-wrap footer .cancel-btn {
        background-color: #fff;
        border-color: #d9d9d9;
        margin-right: 8px;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
      }
      .yaohuo-wrap footer .ok-btn {
        color: #fff;
        background-color: #1677ff;
        box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
      }
      .yaohuo-wrap ul {
        margin: 0;
        padding: 0 10px 0 20px;
        margin-right: 7px;
        max-height: 65vh;
        overflow: auto;
      }
      /* 设置滚动条的宽度和高度 */
      .yaohuo-wrap ::-webkit-scrollbar {
        width: 3px;
      }

      /* 设置滚动条滑块的背景色 */
      .yaohuo-wrap ::-webkit-scrollbar-thumb {
        background-color: #999;
        border-radius:10px;
      }
      .yaohuo-wrap i {
        font-style: normal;
      }
      .yaohuo-wrap li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 44px;
      }
      .yaohuo-wrap li .tip-icon{
        vertical-align: text-top;
        margin-left: 5px;
        cursor: pointer;
      }
      .yaohuo-wrap li input[type="range"] {
        width: 130px;
        height: 1px;
        appearance: auto;
        border: none;
        padding: 0;
      }
      .yaohuo-wrap li select {
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        width: 130px;
        border: 1px solid #5c5c5c;
        border-radius: 5px;
        text-align: center;
        outline: 0;
        margin-right: 0;
      }

      .yaohuo-wrap .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 30px;
      }

      .yaohuo-wrap .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .yaohuo-wrap .password-container{
        width: 60%;
        position: relative;
      }

      .password-container .toggle-password {
        position: absolute;
        top: 52%;
        right: 6px;
        transform: translateY(-50%);
        cursor: pointer;
      }

      .yaohuo-wrap-title{
        height: 38px !important;
      }
      .yaohuo-wrap-title .title-line {
        margin: 0px;
        border: none;
        border-top: 1px dashed #dcdcdc;
        width: 30%; /* 可根据需要调整宽度 */
      }

      .yaohuo-wrap li .password-container input {
        width: 100%;
        box-sizing: border-box;
        height: 32px;
        padding-right: 28px;
      }
      .yaohuo-wrap li input[type="number"] {
        width: 130px;
        box-sizing: border-box;
        height: 30px;
      }

      .yaohuo-wrap .switch label {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        border-radius: 34px;
      }

      .yaohuo-wrap .switch label::before {
        position: absolute;
        content: "";
        height: 22px;
        width: 22px;
        left: 6px;
        bottom: 4px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }

      .yaohuo-wrap .switch input:checked + label {
        background-color: #2196f3;
      }

      .yaohuo-wrap .switch input:checked + label::before {
        transform: translateX(26px);
      }
      .yaohuo-wrap hr {
        margin:5px 0
      }
    `);
    let innerH = `
      <div class="yaohuo-modal-mask">
        <div class="yaohuo-wrap">
        <header>🔥拓展增强🔥插件设置<a href="https://update.greasyfork.org/scripts/464198/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%A6%96%E7%81%AB%E7%BD%91%E6%8F%92%E4%BB%B6.user.js" target="_blank">【检测更新】</a></header>
          <ul>
            <li class="yaohuo-wrap-title">
              <hr class="title-line title-line-left" />
              <b>站内设置</b>
              <hr class="title-line title-line-right" />
            </li>
            <li>
              <span style="color: #b80303;"><img src="/NetImages/jing.gif" alt="精" style="margin-bottom: -1px"><a href="https://172.lot-ml.com/ProductEn/Index/5d632759ef286928" target="_blank">大流量卡，返现几十不等</a></span>
              <div>
                <a href="https://yaohuo.me/bbs/userinfo.aspx?touserid=20469" target="_blank">返现联系</a>
              </div>
            </li>
            <li>
              <span>教程、交流群</span>
              
              <div>
                <a href="/bbs-1183941.html" target="_blank">原贴</a>
                / 
                <a href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=B8jHwcToRt8GnMoJa3jDk01xt6XFP2yi&authKey=WULG168m8oDAcLqoRa2moGO5%2FWXGFAYhMtO4RjhEVDHbzQoDmHBPqfGlv8ya50Ty&noverify=0&group_code=768664029" target="_blank">交流群</a>
                /
                <a onclick="alert('为爱发电难长久，感谢支持过的妖友，凡是办理过上方链接中任意流量卡的，可联系我进内测版（赞助版），适合喜欢尝鲜的妖友，功能更丰富体验更好，更新更频繁，支持需求个性化定制等')">内测版</a>
              </div>
            </li>
            <li>
              <span>显示站内设置图标</span>
              <div class="switch">
                <input type="checkbox" id="isShowSettingIcon" data-key="isShowSettingIcon" />
                <label for="isShowSettingIcon"></label>
              </div>
            </li>
            <li>
              <span>设置图标大小：<i class="range-num">${settingIconMaxSize}</i>px</span>
              <input
                type="range"
                id="settingIconMaxSize"
                data-key="settingIconMaxSize"
                min="${40}"
                value="${settingIconMaxSize}"
                max="${100}"
                step="${5}"
              />
            </li>
            <li>
              <span>站内密码设置</span>
              <div class="password-container">
                <input 
                  type="password" 
                  placeholder="自动填充密码并确认"
                  id="websitePassword" 
                  data-key="websitePassword"
                  value="${websitePassword}"
                />
                ${getIcon("eyeIcon")}
                
              </div>
            </li>
            <li>
              <span>关闭勋章显示</span>
              <div class="switch">
                <input type="checkbox" id="isCloseMedal" data-key="isCloseMedal" />
                <label for="isCloseMedal"></label>
              </div>
            </li>
            <li>
              <span>PC端帖子列表悬浮展示</span>
              <div class="switch">
                <input type="checkbox" id="isShowPcFloatPage" data-key="isShowPcFloatPage" />
                <label for="isShowPcFloatPage"></label>
              </div>
            </li>

            <li class="yaohuo-wrap-title">
              <hr class="title-line title-line-left" />
              <b>图床设置</b>
              <hr class="title-line title-line-right" />
            </li>

            <li>
              <span>自动上传图床</span>
              <div class="switch">
                <input type="checkbox" id="isUploadImage" data-key="isUploadImage" />
                <label for="isUploadImage"></label>
              </div>
            </li>
            <li>
              <span>图床设置</span>
              <select data-key="imageBedType" id="imageBedType">
                <option value="水墨图床">水墨图床</option>
                <option value="极速图床">极速图床</option>
                <option value="美团图床">美团图床</option>
              </select>
            </li>
            <li>
              <span><a href="https://img.ink" target="_blank">水墨图床token</a></span>
              <div class="password-container">
                <input 
                  type="password" 
                  placeholder="为空则为游客上传"
                  id="inkToken" 
                  data-key="inkToken"
                  value="${inkToken}"
                />
                ${getIcon("eyeIcon")}
              </div>
            </li>
            <li>
              <span><a href="https://tucdn.wpon.cn" target="_blank">极速图床token</a></span>
              <div class="password-container">
                <input 
                  type="password" 
                  placeholder="为空则为游客上传"
                  id="speedFreeToken" 
                  data-key="speedFreeToken"
                  value="${speedFreeToken}"
                />
                ${getIcon("eyeIcon")}
              </div>
            </li>
            <li class="yaohuo-wrap-title">
              <hr class="title-line title-line-left" />
              <b>吃肉设置</b>
              <hr class="title-line title-line-right" />
            </li>
            <li>
              <span>手动进贴吃肉</span>
              <div class="switch">
                <input type="checkbox" id="isAutoEat" data-key="isAutoEat" />
                <label for="isAutoEat"></label>
              </div>
            </li>
            <li>
              <span>肉帖过期时间：<i class="range-num">${expiredDays}</i>天</span>
              <input
                type="range"
                id="expiredDays"
                data-key="expiredDays"
                min="${1}"
                value="${expiredDays}"
                max="${7}"
                step="${1}"
              />
            </li>
            <li class="yaohuo-wrap-title">
              <hr class="title-line title-line-left" />
              <b>回帖设置</b>
              <hr class="title-line title-line-right" />
            </li>
            <li>
              <span>回帖表情增强</span>
              <div class="switch">
                <input type="checkbox" id="isAddReplyFace" data-key="isAddReplyFace" />
                <label for="isAddReplyFace"></label>
              </div>
            </li>
            <li>
              <span>回帖表情默认展开</span>
              <div class="switch">
                <input type="checkbox" id="isUnfoldFace" data-key="isUnfoldFace" />
                <label for="isUnfoldFace"></label>
              </div>
            </li>
            <li>
              <span>回帖表情包图床</span>
              <select data-key="replyFaceImageBed" id="replyFaceImageBed">
                <option value="url1">妖友七牛云</option>
                <option value="url2">极速图床</option>
                <option value="url3">imgBB</option>
              </select>
            </li>
            <hr>
            <li>
              <span>回帖UBB增强</span>
              <div class="switch">
                <input type="checkbox" id="isAddReplyUBB" data-key="isAddReplyUBB" />
                <label for="isAddReplyUBB"></label>
              </div>
            </li>
            <li>
              <span>回帖UBB默认展开</span>
              <div class="switch">
                <input type="checkbox" id="isUnfoldUbb" data-key="isUnfoldUbb" />
                <label for="isUnfoldUbb"></label>
              </div>
            </li>
            <li class="yaohuo-wrap-title">
              <hr class="title-line title-line-left" />
              <b>发帖设置</b>
              <hr class="title-line title-line-right" />
            </li>
            <li>
              <span>发帖UBB增强</span>
              <div class="switch">
                <input type="checkbox" id="isAddNewPostUBB" data-key="isAddNewPostUBB" />
                <label for="isAddNewPostUBB"></label>
              </div>
            </li>
            <li class="yaohuo-wrap-title">
              <hr class="title-line title-line-left" />
              <b>自动加载设置</b>
              <hr class="title-line title-line-right" />
            </li>
            <li>
              <span>自动加载下一页</span>
              <div class="switch">
                <input type="checkbox" id="isLoadNextPage" data-key="isLoadNextPage" />
                <label for="isLoadNextPage"></label>
              </div>
            </li>
            <li>
              <span>自动加载下一页方式</span>
              <select data-key="loadNextPageType" id="loadNextPageType">
                <option value="more">加载更多按钮</option>
                <option value="nextPage">下一页按钮</option>
              </select>
            </li>
            <li>
              <span>自动加载最大数：<i class="range-num">${maxLoadNum}</i>个</span>
              <input
                id="maxLoadNum"
                type="range"
                data-key="maxLoadNum"
                min="${minNumRange}"
                value="${maxLoadNum}"
                max="${maxNumRange}"
                step="${numStep}"
              />
            </li>
            <!--
              <li class="yaohuo-wrap-title">
                <hr class="title-line title-line-left" />
                <b>显示帖子等级</b>
                <hr class="title-line title-line-right" />
              </li>
              <li>
                <span>贴子显示等级</span>
                <div class="switch">
                  <input type="checkbox" id="isShowLevel" data-key="isShowLevel" />
                  <label for="isShowLevel"></label>
                </div>
              </li>
            -->
          </ul>
          <footer>
            <button class="cancel-btn">取消</button>
            <button class="ok-btn">确认</button>
          </footer>
        </div>
      </div>
    `;
    $("body").append(innerH).addClass("overflow-hidden-scroll");

    $(".yaohuo-modal-mask").show();

    setSettingInputEvent("edit");

    $(".cancel-btn").click(handleCancelBtn);
    $(".ok-btn").click(handleOkBtn);
  }
  /**
   * 设置设置菜单，点击设置打开菜单，并且回显数据，保存则保存数据
   * @param {"edit" | 'save'} status edit和save两种模式
   */
  function setSettingInputEvent(status = "edit") {
    $(".yaohuo-wrap input, .yaohuo-wrap select").each((index, item) => {
      let type = item.type;
      let dataKey = item.getAttribute("data-key");
      switch (type) {
        case "checkbox":
          if (status === "edit") {
            item.checked = getValue(dataKey) ? true : false;
            // 根据当前的按钮选中状态处理子项的联动显示或隐藏
            autoShowElement({
              fatherIdAry: ["isShowSettingIcon"],
              childIdAry: ["settingIconMaxSize"],
              dataKey,
            });
            autoShowElement({
              fatherIdAry: ["isLoadNextPage"],
              childIdAry: ["loadNextPageType", "maxLoadNum"],
              dataKey,
            });
            autoShowElement({
              fatherIdAry: ["isAutoEat"],
              childIdAry: ["expiredDays"],
              dataKey,
            });
            autoShowElement({
              fatherIdAry: ["isUploadImage"],
              childIdAry: [
                "imageBedType",
                "inkToken",
                "meetToken",
                "speedFreeToken",
              ],
              dataKey,
            });
            autoShowElement({
              fatherIdAry: ["isAddReplyUBB"],
              childIdAry: ["isUnfoldUbb"],
              dataKey,
            });
            autoShowElement({
              fatherIdAry: ["isAddReplyFace"],
              childIdAry: ["isUnfoldFace", "replyFaceImageBed"],
              dataKey,
            });
          } else {
            setValue(dataKey, item.checked);
          }
          break;

        case "range":
          if (status === "edit") {
            $(item).on("input propertychange", function (event) {
              $(item).prev().children(".range-num").text(item.value);
            });
          } else {
            setValue(dataKey, parseInt(item.value));
          }
          break;

        case "select-one":
          if (status === "edit") {
            item.value = getValue(dataKey);
            $(item).on("change", function (event) {
              autoShowImageToken(item, dataKey);
            });
            autoShowImageToken(item, dataKey);
          } else {
            setValue(dataKey, item.value);
          }
          break;

        case "number":
          if (status === "edit") {
            item.value = getValue(dataKey);
          } else {
            setValue(dataKey, item.value);
          }
          break;

        case "password":
          if (status === "edit") {
            item.value = getValue(dataKey, "");
            $(item)
              .next()
              .on("click", function (event) {
                item.type = item.type === "password" ? "text" : "password";
              });
          } else {
            setValue(dataKey, item.value);
          }
          break;

        default:
          if (status === "edit") {
            item.value = getValue(dataKey, "");
          } else {
            setValue(dataKey, item.value);
          }
          break;
      }
    });
    function autoShowImageToken(item, dataKey) {
      if (dataKey === "imageBedType") {
        let config = {
          水墨图床: "#inkToken",
          极速图床: "#speedFreeToken",
        };
        Object.keys(config).forEach((name) => {
          if (item.value === name) {
            $(config[name]).closest("li").show();
          } else {
            $(config[name]).closest("li").hide();
          }
        });
      }
    }
    /**
     * 根据当前的选中状态处理子项的显示或隐藏
     * @param {Object} options - 选项对象
     * @param {Array<string>} options.fatherIdAry - 包含父元素ID的字符串数组
     * @param {Array<string>} options.childId - 子元素的ID
     * @param {string} options.dataKey - 存储在父元素上的数据键名
     */
    function autoShowElement({ fatherIdAry, childIdAry, dataKey }) {
      execFn();
      fatherIdAry.forEach((item) => {
        $(`#${item}`).on("change", function (event) {
          execFn();
        });
      });
      function execFn() {
        if (fatherIdAry.includes(dataKey)) {
          childIdAry.forEach((childId) => {
            let parent = $(`#${childId}`).closest("li");

            let isShow = fatherIdAry.some((item) =>
              $(`#${item}`).prop("checked")
            );
            isShow ? parent.show() : parent.hide();
          });
        }
      }
    }
  }
  function checkSaveSetting() {
    let openUploadImageBed = $("#isUploadImage").prop("checked");
    let imageBedType = $("#imageBedType").prop("value");
    let meetToken = $("#meetToken").prop("value");

    // if (openUploadImageBed && imageBedType === "遇见图床" && !meetToken) {
    //   alert("遇见图床必须填写token");
    //   return false;
    // }
    return true;
  }
  function handleCancelBtn() {
    $("body").removeClass("overflow-hidden-scroll");
    $(".yaohuo-modal-mask").remove();
  }
  function handleOkBtn() {
    if (!checkSaveSetting()) {
      return;
    }
    setSettingInputEvent("save");
    $("body").removeClass("overflow-hidden-scroll");
    $(".yaohuo-modal-mask").hide();
    MY_setValue("yaohuo_userData", yaohuo_userData);
    if (!yaohuo_userData.isShowSettingIcon) {
      $("#floating-setting-btn").hide();
    } else {
      $("#floating-setting-btn").show();
    }
    // 刷新页面
    setTimeout(function () {
      window.location.reload();
    }, 300);
  }

  function handleBbsListFloatOpen() {
    if (
      bbsPage.includes(window.location.pathname) &&
      !isMobile() &&
      isShowPcFloatPage
    ) {
      MY_addStyle(`
         /* 背景遮罩 */
        .overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        /* iframe容器 */
        .iframe-container {
          position: relative;
          width: 80%;
          max-width: 750px;
          height: 98%;
          background-color: #e8e8e8;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
      `);

      document.addEventListener("click", (event) => {
        // 检查点击的元素是否具有 topic-link 类
        if (event.target.classList.contains("topic-link")) {
          event.preventDefault(); // 防止默认链接行为

          let url = event.target.getAttribute("href"); // 获取链接的 href 属性
          // iframe打开当前链接
          openLayer(url);
        }
      });

      function openLayer(url) {
        // 创建遮罩（overlay）
        const overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.style.display = "flex";

        // 创建iframe容器
        const iframeContainer = document.createElement("div");
        iframeContainer.className = "iframe-container";

        // 创建iframe
        const iframe = document.createElement("iframe");
        iframe.src = url; // 设置iframe的目标URL
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.borderRadius = "10px";

        // 将iframe添加到iframe容器中
        iframeContainer.appendChild(iframe);

        // 将iframe容器添加到遮罩中
        overlay.appendChild(iframeContainer);

        // 将遮罩添加到页面
        document.body.appendChild(overlay);

        // 点击遮罩关闭iframe和遮罩
        overlay.addEventListener("click", function (event) {
          if (event.target === overlay) {
            document.body.removeChild(overlay); // 移除遮罩
          }
        });
      }
    }
  }
  // 浏览器scroll事件
  function handleWindowScroll() {
    window.addEventListener(
      "scroll",
      throttle(() => {
        let isPage = loadNextPage.some((item) =>
          item.test(window.location.pathname)
        );

        // 处理点击加载更多后的全自动吃肉
        if (isPage) {
          let nextBtn = null;
          // 下一页按钮的父节点
          let nextPageWrap = document.querySelector(".bt2");

          if (loadNextPageType === "more" || !nextPageWrap) {
            // 加载更多加载下一页
            nextBtn = document.querySelector("span[id$=show_tip]");

            // 已经请求到数据
            if (nextBtn?.innerText.includes("加载更多")) {
              // 加载完成了

              isClickLoadMoreBtn = false;
              isNewPage = false;

              // 处理自动加载更多，需要放到最后
              handleLoadNextPage();
            }
          } else {
            // 下一页按钮加载下一页

            nextBtn = nextPageWrap.firstChild;

            handleLoadNextPage();
          }
        }
      }, 100)
    );
  }
  // 返回当前列表数据的长度
  function getListLength() {
    let length = 0;
    if ($(".listdata").length) {
      length = $(".listdata").length;
    } else {
      length = $(".reline").length + $(".list-reply").length;
    }
    return length;
  }
  // 自动吃肉：手动进入肉帖自动吃
  function handleAutoEat() {
    if (isBbsViewPage && isAutoEat) {
      const form = document.getElementsByName("f")[0];
      let isAutoEatBbs = window.location.search.includes("open=new");
      if (!form) {
        // 如果是自动吃肉的则直接返回，并记录不可吃肉
        if (isAutoEatBbs) {
          autoEatCallback();
        }
        return;
      }
      const face = form.getElementsByTagName("select")[0];
      const replyBtn = document.getElementsByName("g")[0];

      const textarea = document.querySelector(".retextarea");
      // 帖子标识id
      let id =
        window.location.pathname.match(/\d+/)?.[0] || getUrlParameters().id;

      // 吃肉 必须放在后面
      const fileTag = document.querySelector(
        "a[href^='/bbs/book_re_addfile.aspx']"
      );
      let eatMeat = document.createElement("input");
      eatMeat.style.float = "right";
      eatMeat.type = "submit";
      eatMeat.value = "一键吃肉";
      eatMeat.addEventListener("click", (e) => {
        e.preventDefault();
        let eatWordsArr = [
          "吃",
          "吃吃",
          "吃吃.",
          "吃吃。",
          "吃吃..",
          "吃吃。。",
          "吃了",
          "吃肉",
          "来吃肉",
          "吃.",
          "吃。",
          "吃了.",
          "吃了。",
          "吃肉.",
          "吃肉。",
          "来吃肉.",
          "来吃肉。",
          "吃..",
          "吃。。",
          "吃了..",
          "吃了。。",
          "吃肉..",
          "吃肉。。",
          "来吃肉..",
          "来吃肉。。",
          "口乞了",
          "口乞了.",
          "口乞了。",
          "口乞肉",
          "口乞肉.",
          "口乞肉。",
          "口乞..",
          "口乞。。",
          "chile..",
          "chile。。",
          "7肉..",
          "7肉。。",
          "7了..",
          "7了。。",
          "肉肉肉",
          "肉肉肉.",
          "肉肉肉。",
          "肉肉肉..",
          "肉肉肉。。",
          "先吃肉",
          "先吃肉.",
          "先吃肉。",
          "先吃肉..",
          "先吃肉。。",
        ];

        let index = Math.floor(Math.random() * eatWordsArr.length);
        console.log("吃肉回复：", eatWordsArr[index]);
        insertText(textarea, eatWordsArr[index], 0);
        replyBtn.click();
        autoEatCallback();
      });

      // 添加事件监听，如果吃过肉则会提示
      document.getElementsByName("g")[0].addEventListener(
        "click",
        (e) => {
          if (autoEatList[id] && !confirm("当前已经吃过肉，是否继续回复")) {
            // 取消提交
            // textarea.value = "";
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true
      );

      const meatTag = document.querySelector("span.yushuzi");

      if (!isAutoEat) {
        console.log("未开启自动吃肉，可在编辑脚本进行开启");
      } else {
        if (meatTag == undefined) {
          console.log("非肉勿7");
          // autoEatCallback();
        } else if (parseInt(meatTag.innerHTML) <= 0) {
          console.log("无肉怎7");
          // 把无肉帖添加进去
          autoEatCallback();
        } else {
          let autoEatList = getItem("autoEatList");

          if (!autoEatList[id]) {
            console.log("有肉快7");
            eatMeat.click();
          } else {
            console.log("已经吃过了");
            autoEatCallback();
          }
        }
      }
      // 将吃肉插入到文件回帖后面
      fileTag.after(eatMeat);
    }
  }
  function insertText(obj, str, offset) {
    if (document.selection) {
      let sel = document.selection.createRange();
      sel.text = str;
    } else if (
      typeof obj.selectionStart === "number" &&
      typeof obj.selectionEnd === "number"
    ) {
      let startPos = obj.selectionStart,
        endPos = obj.selectionEnd,
        cursorPos = startPos,
        tmpStr = obj.value;
      obj.value =
        tmpStr.substring(0, startPos) +
        str +
        tmpStr.substring(endPos, tmpStr.length);
      cursorPos += str.length;
      obj.selectionStart = obj.selectionEnd = cursorPos - offset;
    } else {
      obj.value += str;
    }
    obj.focus();
  }
  // 获取url参数
  function getUrlParameters(url) {
    // 如果未传递URL参数，则使用当前页面的URL
    if (!url) {
      url = window.location.href;
    }

    // 创建一个URL对象
    let urlObj = new URL(url);

    // 获取查询参数部分
    let queryParams = urlObj.searchParams;

    // 创建一个对象来存储参数
    let params = {};

    // 遍历参数并将它们存储在对象中
    queryParams.forEach(function (value, key) {
      params[key] = value;
    });

    return params;
  }
  // 吃完肉的回调
  function autoEatCallback() {
    let id =
      window.location.pathname.match(/\d+/)?.[0] || getUrlParameters().id;
    let isAutoEatBbs = window.location.search.includes("open=new");
    // let autoEatList = getItem("autoEatList");

    autoEatList[id] = new Date().getTime();

    setItem("autoEatList", autoEatList);
  }
  /**
   * 返回指定天数后的一天开始的时间，例如1天，则为明天00:00:00，2天则为后天00:00:00
   * 肉帖1天有效期则代表明天00:00:00过期，2天有效期则是后天00:00:00
   * @param {number} time 传入一个时间戳
   * @param {number} days 传入过期的天数
   * @returns {number} 返回到期时间的时间戳
   */

  function timeLeft(time, days = 1) {
    const target = new Date(time + (days - 1) * 24 * 60 * 60 * 1000);
    target.setHours(24, 0, 0, 0);
    return target.getTime();
  }
  // 获取值
  function getItem(key, defaultValue = {}) {
    if (key === "autoEatList") {
      let autoEatList = MY_getValue(key, {});
      // 删除过期的肉帖
      deleteExpiredID(autoEatList);
      // 更新肉帖数据
      setItem(key, autoEatList);
      return autoEatList;
    }
    return MY_getValue(key, {});
  }
  function MY_addStyle(innerHTML) {
    // 创建 style 元素
    let style = document.createElement("style");
    style.type = "text/css";

    // 设置样式内容
    let css = innerHTML;
    style.innerHTML = css;

    // 将 style 元素添加到 head 元素中
    document.head.appendChild(style);
  }
  function MY_setValue(key, value) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }
  function MY_getValue(key, defaultValue = {}) {
    const value = localStorage.getItem(key) || defaultValue;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  // 设置值
  function setItem(key, value) {
    // if (key === "autoEatList") {
    //   deleteExpiredID(value); //删除过期的肉帖
    // }
    MY_setValue(key, value);
  }
  /**
   * 返回yaohuo_userData里的数据
   * @param {string} key 要获取值的属性
   * @param {any} value 获取的值
   * @returns {any}
   */
  function getValue(key, value) {
    let setting = yaohuo_userData;
    return setting[key] || value;
  }
  /**
   * 更新yaohuo_userData里的数据
   * @param {string} key 要设置值的属性
   * @param {any} value 设置的值
   * @returns {any}
   */
  function setValue(key, value) {
    yaohuo_userData[key] = value;
    // setItem("yaohuo_userData", yaohuo_userData);
  }
  // 增加发帖ubb
  function handleAddNewPostUBB() {
    if (postPage.includes(window.location.pathname) && isAddNewPostUBB) {
      let bookContent = document.getElementsByName("book_content")[0];
      bookContent.insertAdjacentHTML(
        "beforebegin",
        `<div class='btBox'>
            <div class='bt2'>
                <a style='width:25%' id='ubb_url'>超链接</a>
                <a style='width:25%' id='ubb_img'>图片</a>
                <a style='width:25%' id='ubb_movie'>视频</a>
                <a style='width:25%' id='ubb_more'">更多...</a>
            </div>
        </div>
        <div class='more_ubb_tools' style='display: none'>
          <div class='btBox'>
            <div class='bt2'>
                <a style='width:25%' id='ubb_color'>颜色</a>
                <a style='width:25%' id='ubb_b'">加粗</a>
                <a style='width:25%' id='ubb_strike'>删除</a>
                <a style='width:25%' id='ubb_font'>字体</a>
            </div>
          </div>
          <div class='btBox'>
            <div class='bt2'>
              <a style='width:25%' id='ubb_u'>下划线</a>
              <a style='width:25%' id='ubb_i'>斜体</a>
              <a style='width:25%' id='ubb_hr'>分割线</a>
              <a style='width:25%' href='https://www.yaohuo.me/bbs/book_view_ubb.aspx?action=class&siteid=1000&classid=177&page=1&backurl=bbs%2fbook_view_add.aspx%3fsiteid%3d1000%26classid%3d177' target="_blank">UBB使用</a>
            </div>
          </div>
          <div class='btBox'>
            <div class='bt2'>
              <a style='width:25%' id='ubb_audio'>音频</a>
              <a style='width:25%' id='ubb_left'>居左</a>
              <a style='width:25%' id='ubb_center'>居中</a>
              <a style='width:25%' id='ubb_right'>居右</a>
            </div>
          </div>
          <div class='btBox'>
              <div class='bt2'>
                  <a style='width:25%' href='https://yaohuo.me/tuchuang/' target="_blank">妖火图床</a>
                  <a style='width:25%' href='https://img.ink/' target="_blank">水墨图床</a>
                  <a style='width:25%' href='https://aapi.eu.org/dy' target="_blank">抖音解析</a>
                  <a style='width:25%' href='https://aapi.eu.org/ks' target="_blank">快手解析</a>
              </div>
          </div>
          <div class='btBox'>
            <div class='bt2'>
              <a style='width:25%' href='https://aapi.eu.org/ppx' target="_blank">皮皮虾解析</a>
              <a style='width:25%' href='https://aapi.eu.org/bili' target="_blank">b站解析</a>
              <a style='width:25%' href='https://www.uhsea.com' target="_blank">屋舍文件</a>
              <a style='width:25%' href='https://urlify.cn/' target="_blank">短链生成</a>
            </div>
          </div>
        </div>`
      );

      addEventAry.forEach((item) => {
        handleEventListener(item.id, bookContent, item.ubb, item.offset);
      });
      document.getElementById("ubb_more").addEventListener("click", () => {
        let ubb_tool = document.getElementsByClassName("more_ubb_tools")[0];
        ubb_tool.style.display =
          ubb_tool.style.display === "none" ? "block" : "none";
      });
    }
  }
  // 增加回帖ubb
  function handleAddReplyUBB() {
    if (
      (isBbsViewPage || viewPage.includes(window.location.pathname)) &&
      isAddReplyUBB
    ) {
      const form = document.getElementsByName("f")[0];
      if (!form) {
        return;
      }
      const fileTag = document.querySelector(
        "a[href^='/bbs/book_re_addfile.aspx']"
      );

      // 添加ubb展开按钮
      fileTag.insertAdjacentHTML(
        "afterend",
        `<input id="ubb_unfold" type="submit" value="${
          isUnfoldUbb ? "折叠UBB" : "展开UBB"
        }" style="float:right"/>`
      );

      // 妖火图床、超链接、图片
      form.insertAdjacentHTML(
        "beforeend",
        `
        <hr>
        <div class="ubb_wrap" style="text-align: center;overflow: hidden;">
          <span id='ubb_url' style="${spanstyle}">链接</span>
          <span id='ubb_img' style="${spanstyle}">图片</span>
          <span id='ubb_audio' style="${spanstyle}">音频</span>
          <span id='ubb_movie' style="${spanstyle}">视频</span>
          <span id='ubb_nzgsa' style="${a2style}">你真该死啊</span>

          <br>
          <span id='ubb_text' style="${spanstyle}">半角</span>
          <span id='ubb_br' style="${spanstyle}">换行</span>
          <span id='ubb_b' style="${spanstyle}">加粗</span>
          <span id='ubb_i' style="${spanstyle}">斜体</span>

          <span id='ubb_color' style="${spanstyle}">颜色字</span>
          <span id='ubb_u' style="${spanstyle}">下划</span>
          <span id='ubb_strike' style="${spanstyle}">删除</span>
          <span id='ubb_hr' style="${spanstyle}">分割</span>
          <br>
          <span id='ubb_sms' style="${spanstyle}">短信</span>
          <span id='ubb_call' style="${spanstyle}">拨号</span>
          <span id='ubb_now' style="${spanstyle}">时间</span>
          <span id='ubb_codo' style="${spanstyle}">倒计天</span>
          <br>
          <a href='https://yaohuo.me/tuchuang/' target="_blank" style="${spanstyle}">妖火图床</a>
          <a href='https://aapi.eu.org/ppx' target="_blank" style="${spanstyle}">皮皮</a>
          <a href='https://aapi.eu.org/bili' target="_blank" style="${spanstyle}">b站</a>
          <a href='https://aapi.eu.org/dy' target="_blank" style="${spanstyle}">抖音</a>
          <a href='https://aapi.eu.org/ks' target="_blank" style="${spanstyle}">快手</a>
          <a href='https://www.uhsea.com' target="_blank" style="${spanstyle}">外链</a>
          <a href='https://urlify.cn/' target="_blank" style="${spanstyle}">短链接</a>
        </div>
        <hr>
        `
      );

      // 处理默认展开ubb
      if (isUnfoldUbb) {
        $(".ubb_wrap").height("auto");
      } else {
        $(".ubb_wrap").height(32);
      }

      // 处理折叠ubb
      $("#ubb_unfold").click(function (event) {
        if (this.value == "折叠UBB") {
          $(".ubb_wrap").height(32);
          this.value = "展开UBB";
        } else {
          $(".ubb_wrap").height("auto");
          this.value = "折叠UBB";
        }
        event.preventDefault();
      });

      // 超链接
      const textarea = document.querySelector("textarea");
      addEventAry.forEach((item) => {
        handleEventListener(item.id, textarea, item.ubb, item.offset);
      });
    }
  }
  // 增加回帖表情
  function handleAddReplyFace() {
    if (
      (isBbsViewPage || viewPage.includes(window.location.pathname)) &&
      isAddReplyFace
    ) {
      const form = document.getElementsByName("f")[0];
      if (!form) {
        return;
      }
      const face = form.getElementsByTagName("select")[0];
      const sendmsg =
        form.querySelector("#sendselect") ||
        form.getElementsByTagName("select")[1] ||
        form.querySelector(".tongzhi");
      const textarea = form.getElementsByTagName("textarea")[0];
      // 显示表情
      textarea.insertAdjacentHTML("beforebegin", '<div id="facearea"></div>');
      const facearea = document.getElementById("facearea");

      let allFaceHtml = "";
      faceList.forEach((faceStr, i) => {
        let name = faceStr.split(".")[0];
        allFaceHtml += `
        <img
          id="setFace${i}"
          style="width: 32px;height: 32px"
          data-src="face/${faceStr}"
          src="face/${faceStr}"
          value="${name}.gif"
        />`;
      });
      diyFaceList.forEach((item, i) => {
        allFaceHtml += `
        <img
          id="diyFace${i}"
          data-src="${item[replyFaceImageBed] || item.url1}"
          style="width: 32px;height: 32px"
          src="${item[replyFaceImageBed] || item.url1}"
          value="${item.name}.gif"
        />`;
      });
      facearea.innerHTML = allFaceHtml;

      // 添加表情展开按钮
      sendmsg.insertAdjacentHTML(
        "afterend",
        `<span 
          style="${spanstyle}margin-left: 2px; display:${
          isUnfoldFace ? "display: block" : "display: none"
        }" id="unfold"
          >表情${isUnfoldFace ? "折叠" : "展开"}</span>`
      );

      // 处理点击添加表情包
      facearea.onclick = function (event) {
        if (event.target.tagName.toLowerCase() === "img") {
          // 自定义图片
          let diySrc = event.target.dataset.src;

          // 处理完折叠表情
          $("#facearea").hide();
          $("#unfold").text("表情展开");

          if (diySrc) {
            //把光标移到文本框最前面
            textarea.focus();
            textarea.setSelectionRange(0, 0);
            insertText(textarea, `[img]${diySrc}[/img]`, 0);
          } else {
            // 处理图片的点击事件
            face.value = event.target.getAttribute("value");
          }
        }
      };
      // 处理默认展开表情
      if (isUnfoldFace) {
        $("#facearea").show();
      } else {
        $("#facearea").hide();
      }
      // 处理折叠表情
      $("#unfold").click(function (event) {
        if (this.innerText == "表情展开") {
          $("#facearea").show();
          this.innerText = "表情折叠";
        } else {
          $("#facearea").hide();
          this.innerText = "表情展开";
        }
      });
    }
  }
  function handleReply() {
    if (
      (isBbsViewPage || viewPage.includes(window.location.pathname)) &&
      (isAddReplyUBB || isAddReplyFace)
    ) {
      // 取消回复文本框粘性定位。
      $(".sticky").addClass("add-position-static");

      // 回复页不处理
      if (!window.location.pathname.includes("/bbs/book_re.aspx")) {
        let wrap =
          document.querySelector("forum-container") ||
          document.querySelector(".recontent");
        wrap.addEventListener("click", (event) => {
          if (
            event.target.innerText === "回" ||
            event.target.className === "replyicon" ||
            event.target.alt === "回复"
          ) {
            // 如果是回复指定楼层就定位到回复输入框
            if (
              /回复\d+楼/.test(document.querySelector(".sticky b")?.innerText)
            ) {
              window.scrollTo(0, document.querySelector(".sticky").offsetTop);
            }
          }
        });
      }
    }
  }
  function handleUploadImage() {
    if (isUploadImage) {
      let textArea = document.getElementsByTagName("textarea")[0];
      if (!textArea) return;
      // 排除游戏大厅页面
      if (/^\/games\/\w+\/index\.aspx$/.test(window.location.pathname)) return;

      let isReplyPage =
        isBbsViewPage || viewPage.includes(window.location.pathname);

      let insertDom = textArea;
      let isMessagePage = ["/bbs/messagelist_view.aspx"].includes(
        window.location.pathname
      );
      if (isMessagePage) {
        insertDom = textArea.parentNode;
      }

      MY_addStyle(`
        .upload-wrap {
          position: relative;
          display: inline-block;
          width: 100%;
          box-sizing: border-box;
          height: 50px;
          border: 2px dashed #ccc;
          border-radius: 5px;
          font-size: 16px;
          color: #555;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: ${isMessagePage ? "5px" : 0};
        }
        .upload-wrap-disabled{
          background: #ddd;
          cursor: not-allowed;
        }
        .upload-wrap:hover {
          border-color: #aaa;
        }
        .upload-wrap:focus {
          outline: none;
        }
        .upload-input-label {
          width: 100%;
          height: 100%;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .upload-loading {
          box-sizing: border-box;
          border: 6px solid #f3f3f3;
          border-top: 6px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 2s linear infinite;
          margin: auto;
          position: absolute;
          z-index: 10;
          left: 50%;
          top: 50%;
          margin-top: -20px;
          margin-left: -20px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `);
      insertDom.insertAdjacentHTML(
        isMessagePage ? "beforebegin" : "afterend",
        `<label for="upload-input" class="upload-wrap">
            <div class="upload-loading" style="display: none"></div>
            <span class="upload-input-label">
              <svg t="1683636826356" style="margin-right: 10px" class="icon" fill="#16baaa" viewBox="0 0 1264 1024" version="1.1" 
                xmlns="http://www.w3.org/2000/svg" p-id="9231" width="38" height="38">
                <path d="M992.171444 312.62966C975.189616 137.155482 827.415189 0 647.529412 0 469.849434 0 323.616239 133.860922 303.679205 306.210218 131.598564 333.839271 0 482.688318 0 662.588235c0 199.596576 161.815189 361.411765 361.411765 361.411765h184.014581V692.705882H294.530793l337.939795-361.411764 337.939796 361.411764H726.132229v331.294118H933.647059v-1.555371c185.470975-15.299199 331.294118-170.426291 331.294117-359.856394 0-168.969898-116.101408-310.367302-272.769732-349.958575z" p-id="9232"></path>
              </svg>
              选择或拖拽图片上传到图床
            </span>
            <input
              type="file"
              multiple
              id="upload-input"
              accept="image/*"
              style="display: none"
            />
        </label>`
      );

      // 获取上传图标的 input 元素
      const uploadInput = document.querySelector("#upload-input");
      const uploadWrap = document.querySelector(".upload-wrap");
      const uploadLoading = document.querySelector(".upload-loading");

      uploadInput.addEventListener("change", handleFileSelect);
      uploadWrap.addEventListener("dragover", handleDragOver);
      uploadWrap.addEventListener("drop", handleDrop);
      textArea.addEventListener("paste", handlePaste);

      // 剪贴板事件
      async function handlePaste(event) {
        const clipboardData =
          event.clipboardData || event.originalEvent.clipboardData;
        const items = clipboardData.items;

        handleUploadStatus("start");
        const files = [];

        for (const item of items) {
          if (item.type.indexOf("image") !== -1) {
            const blob = item.getAsFile();
            // paste 事件的处理程序是异步的，所以不能在这里直接上传，否则有多个只会读取第一个
            // await uploadFile(blob);
            files.push(blob);
          }
        }

        // 此处处理上传
        for (const item of files) {
          await uploadFile(item);
        }
        handleUploadStatus("end");
      }

      // 上传事件
      async function uploadFile(file) {
        let uploadConfig = {
          水墨图床: {
            url: "https://img.ink/api/upload",
            name: "image",
            token: inkToken || "",
          },
          极速图床: {
            url: "https://tucdn.wpon.cn/api/upload",
            name: "image",
            token: speedFreeToken || "",
          },
          美团图床: {
            url: "https://aapi.helioho.st/upload.php",
            name: "image",
          },
        };
        let {
          url: uploadUrl,
          name: uploadName,
          token: uploadToken,
        } = uploadConfig[imageBedType];

        let formData = new FormData();
        formData.append(uploadName, file);

        if (imageBedType === "美团图床") {
          formData.append("fileId", file.name);
        }

        try {
          let response;
          if (imageBedType === "美团图床") {
            response = await fetch(uploadUrl, {
              method: "POST",
              body: formData,
            });
          } else {
            response = await fetch(uploadUrl, {
              method: "POST",
              headers: {
                token: uploadToken || "",
              },
              body: formData,
            });
          }

          const res = await response.json();

          let { code, url, data, msg } = res;

          if (code === 200 || code === 0 || url) {
            // 处理葫芦侠图床直接取url，其他取data.url
            if (!url) {
              url = data.url;
            }
            if (url) {
              // 如果是回帖页面把光标移到文本框最前面
              if (isReplyPage) {
                textArea.focus();
                textArea.setSelectionRange(0, 0);
              }

              insertText(textArea, `[img]${url}[/img]`, 0);
            }
          } else {
            alert(msg);
          }
        } catch (error) {
          alert(error);
          console.error("上传失败:", error);
        }
      }

      // 选择文件change事件
      async function handleFileSelect(event) {
        const files = event.target.files;
        handleUploadStatus("start");
        for (const file of files) {
          await uploadFile(file);
        }
        handleUploadStatus("end");
      }
      // 拖拽事件
      function handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }

      async function handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        const files = event.dataTransfer.files;
        handleUploadStatus("start");
        for (const file of files) {
          if (file.type.indexOf("image") !== -1) {
            await uploadFile(file);
          }
        }
        handleUploadStatus("end");
      }
      /**
       * 处理上传状态
       * @param {'start' | 'end'} type 处理的状态
       */
      function handleUploadStatus(type) {
        if (type === "start") {
          uploadWrap.classList.toggle("upload-wrap-disabled");
          uploadInput.disabled = true;
          uploadLoading.style.display = "block";
        }
        if (type === "end") {
          uploadWrap.classList.toggle("upload-wrap-disabled");
          uploadInput.disabled = false;
          uploadLoading.style.display = "none";
          uploadInput.value = "";
        }
      }
    }
  }
  // 处理404页面跳回新帖页面
  function handleNotFoundPage() {
    if (notFoundPage.includes(window.location.pathname)) {
      history.go(-2);
      // let year = new Date().getFullYear();
      // location.href = `/bbs/book_list.aspx?gettotal=${year}&action=new`;
    }
  }
  /**
   * 删除过期的帖子
   * @param {number|string} value 存储肉帖的对象
   */
  function deleteExpiredID(value) {
    let nowTime = new Date().getTime();

    Object.keys(value).forEach((key) => {
      let lastTime = value[key];
      if (nowTime > timeLeft(lastTime, expiredDays)) {
        delete value[key];
      }
    });
  }
  function handleAddLoadMoreBtnClick() {
    // 如果打开了全自动吃肉和自动加载更多，并且在帖子列表页才添加事件
    let isPage = loadNextPage.some((item) =>
      item.test(window.location.pathname)
    );
    if (isPage) {
      let loadMoreBtn = null;
      let nextPageWrap = document.querySelector(".bt2");
      if (loadNextPageType === "nextPage" && nextPageWrap) {
        loadMoreBtn = nextPageWrap.firstChild;
      } else {
        loadMoreBtn = document.querySelector("#KL_loadmore");
      }
      loadMoreBtn?.addEventListener("click", (e) => {
        isClickLoadMoreBtn = true;
        isNewPage = false;
      });
    }
  }
  // 自动加载下一页
  function handleLoadNextPage() {
    // 处理自动加载更多
    let isPage = loadNextPage.some((item) =>
      item.test(window.location.pathname)
    );
    if (isPage && isLoadNextPage) {
      let nextBtn = null;
      let nextPageWrap = document.querySelector(".bt2");
      // 距离按钮最大多少就会触发
      let bottomMaxDistance = 250;
      if (loadNextPageType === "more" || !nextPageWrap) {
        nextBtn = document.querySelector("span[id$=show_tip]");
      } else {
        nextBtn = nextPageWrap.firstChild;
        bottomMaxDistance = 150;
      }
      let A = nextBtn.getBoundingClientRect().bottom;
      let B = document.documentElement.clientHeight;
      // 获取当前列表的长度
      let newLength = getListLength();

      // 加载更多按钮距离距底部小于300px才开始加载
      // 没有加载完成前不会再次加载
      // 小于页面最大加载数量才会加载
      if (
        A <= B + bottomMaxDistance &&
        !isClickLoadMoreBtn &&
        newLength < maxLoadNum
      ) {
        nextBtn.click();
        // 放到加载更多按钮里面监听，此处不处理
        // isClickLoadMoreBtn = true;
        // isNewPage = false;
      }
    }
  }
  /**
   * 节流函数
   * @param {function} fn - 要节流的函数
   * @param {number} interval - 节流时间间隔（毫秒）
   * @param {Object} options - 选项对象
   * @param {boolean} [options.leading=true] - 是否在开始时立即执行一次函数
   * @param {boolean} [options.trailing=isExecTrail] - 是否在结束时再执行一次函数
   * @returns {function} 节流后的函数
   */
  function throttle(
    fn,
    interval,
    { leading = true, trailing = isExecTrail } = {}
  ) {
    let startTime = 0;
    let timer = null;

    const _throttle = function (...args) {
      return new Promise((resolve, reject) => {
        try {
          // 1.获取当前时间
          const nowTime = new Date().getTime();

          // 对立即执行进行控制
          if (!leading && startTime === 0) {
            startTime = nowTime;
          }

          // 2.计算需要等待的时间执行函数
          const waitTime = interval - (nowTime - startTime);
          if (waitTime <= 0) {
            // console.log("执行操作fn")
            if (timer) clearTimeout(timer);
            const res = fn.apply(this, args);
            resolve(res);
            startTime = nowTime;
            timer = null;
            return;
          }

          // 3.判断是否需要执行尾部
          if (trailing && !timer) {
            timer = setTimeout(() => {
              // console.log("执行timer")
              const res = fn.apply(this, args);
              resolve(res);
              startTime = new Date().getTime();
              timer = null;
            }, waitTime);
          }
        } catch (error) {
          reject(error);
        }
      });
    };

    _throttle.cancel = function () {
      if (timer) clearTimeout(timer);
      startTime = 0;
      timer = null;
    };

    return _throttle;
  }
  /**
   * 添加事件监听
   * @param {string} id dom元素id
   * @param {HTMLElement} textarea 插入的文本框
   * @param {string} ubb 插入的内容
   * @param {number} offset 插入的位置
   */
  function handleEventListener(id, textarea, ubb, offset) {
    document.getElementById(id)?.addEventListener("click", (e) => {
      if (id === "ubb_nzgsa") {
        // if (textarea.value !== "") {
        insertText(
          textarea,
          "[audio=X]https://file.uhsea.com/2304/3deb45e90564252bf281f47c7b47a153KJ.mp3[/audio]",
          0
        );
        // } else {
        //   alert("不要无意义灌水啦！");
        // }
      } else {
        e.preventDefault();
        insertText(textarea, ubb, offset);
      }
    });
  }
  /**
   * 简易版jquery实现，用于替换之前写的部分语法，不引用cdn库
   * @returns
   */
  function myJquery() {
    let jQuery = function (selector) {
      return new jQuery.fn.init(selector);
    };

    jQuery.fn = jQuery.prototype = {
      constructor: jQuery,

      init: function (selector) {
        if (!selector) {
          return this;
        }

        if (typeof selector === "string") {
          let elements = document.querySelectorAll(selector);
          this.length = elements.length;
          for (let i = 0; i < elements.length; i++) {
            this[i] = elements[i];
          }
        } else if (selector.nodeType) {
          this[0] = selector;
          this.length = 1;
        } else if (selector instanceof jQuery) {
          return selector;
        } else if (Array.isArray(selector)) {
          for (let i = 0; i < selector.length; i++) {
            this[i] = selector[i];
          }
          this.length = selector.length;
          return this;
        }

        return this;
      },

      length: 0,

      each: function (callback) {
        for (let i = 0; i < this.length; i++) {
          callback.call(this[i], i, this[i]);
        }

        return this;
      },

      css: function (prop, value) {
        if (typeof prop === "string") {
          if (value !== undefined) {
            this.each(function () {
              this.style[prop] = value;
            });
            return this;
          } else {
            return this[0].style[prop];
          }
        } else {
          for (let key in prop) {
            this.each(function () {
              this.style[key] = prop[key];
            });
          }
          return this;
        }
      },

      text: function (text) {
        if (text !== undefined) {
          this.each(function () {
            this.textContent = text;
          });
          return this;
        } else {
          let result = "";
          this.each(function () {
            result += this.textContent;
          });
          return result;
        }
      },

      html: function (html) {
        if (html !== undefined) {
          this.each(function () {
            this.innerHTML = html;
          });
          return this;
        } else {
          return this[0].innerHTML;
        }
      },

      append: function (content) {
        if (typeof content === "string") {
          this.each(function () {
            this.insertAdjacentHTML("beforeend", content);
          });
        } else if (content.nodeType) {
          this.each(function () {
            this.appendChild(content);
          });
        } else if (content instanceof jQuery) {
          this.each(function () {
            let self = this;
            content.each(function () {
              self.appendChild(this);
            });
          });
        }

        return this;
      },

      addClass: function (className) {
        let classNames = className.split(" ");
        this.each(function () {
          for (let i = 0; i < classNames.length; i++) {
            if (this.classList) {
              this.classList.add(classNames[i]);
            } else {
              let currentClasses = this.className.split(" ");
              if (currentClasses.indexOf(classNames[i]) === -1) {
                this.className += " " + classNames[i];
              }
            }
          }
        });

        return this;
      },

      removeClass: function (className) {
        let classNames = className.split(" ");
        this.each(function () {
          for (let i = 0; i < classNames.length; i++) {
            if (this.classList) {
              this.classList.remove(classNames[i]);
            } else {
              let currentClasses = this.className.split(" ");
              let index = currentClasses.indexOf(classNames[i]);
              if (index !== -1) {
                currentClasses.splice(index, 1);
                this.className = currentClasses.join(" ");
              }
            }
          }
        });

        return this;
      },

      show: function () {
        this.each(function () {
          // 恢复元素之前的display属性
          let classDisplay = getComputedStyle(this).getPropertyValue("display");
          let display =
            this.getAttribute("data-display") ||
            (classDisplay === "none" ? "block" : classDisplay);
          this.style.display = display ? display : "";
        });

        return this;
      },

      hide: function () {
        this.each(function () {
          // 记住元素之前的display属性
          let display =
            this.style.display ||
            getComputedStyle(this).getPropertyValue("display");
          if (display !== "none") {
            this.setAttribute("data-display", display);
          }
          this.style.display = "none";
        });

        return this;
      },

      click: function (callback) {
        this.each(function () {
          this.addEventListener("click", callback);
        });

        return this;
      },

      on: function (event, childSelector, data, handler) {
        if (typeof childSelector === "function") {
          handler = childSelector;
          childSelector = null;
          data = null;
        } else if (typeof data === "function") {
          handler = data;
          data = null;
        }

        this.each(function () {
          let element = this;

          let listener = function (e) {
            let target = e.target;
            if (
              !childSelector ||
              element.querySelector(childSelector) === target
            ) {
              handler.call(target, e, data);
            }
          };

          event.split(" ").forEach(function (type) {
            element.addEventListener(type, listener);
          });
        });

        return this;
      },

      prev: function () {
        let prevElement = null;
        this.each(function () {
          prevElement = this.previousElementSibling;
        });

        return jQuery(prevElement);
      },

      next: function () {
        let nextElement = null;
        this.each(function () {
          nextElement = this.nextElementSibling;
        });

        return new jQuery(nextElement);
      },

      children: function (selector) {
        let childElements = [];
        this.each(function () {
          let children = this.children;
          for (let i = 0; i < children.length; i++) {
            if (!selector || children[i].matches(selector)) {
              childElements.push(children[i]);
            }
          }
        });

        return jQuery(childElements);
      },

      parent: function (selector) {
        let parentElements = [];
        this.each(function () {
          let parent = this.parentElement;
          if (!selector || parent.matches(selector)) {
            parentElements.push(parent);
          }
        });
        return jQuery(parentElements);
      },
      closest: function (selector) {
        var result = [];

        this.each(function () {
          var closestElement = this.closest(selector);

          if (closestElement) {
            result.push(closestElement);
          }
        });

        return new jQuery(result);
      },

      prop: function (name, value) {
        if (value === undefined) {
          let element = this[0] || {};
          return element[name];
        } else {
          this.each(function () {
            this[name] = value;
          });

          return this;
        }
      },

      remove: function () {
        this.each(function () {
          this.parentElement.removeChild(this);
        });

        return this;
      },

      height: function (value) {
        if (value === undefined) {
          if (this[0]) {
            return this[0].clientHeight;
          } else {
            return null;
          }
        } else {
          this.each(function () {
            this.style.height = isNaN(value) ? value : value + "px";
          });
          return this;
        }
      },
    };

    jQuery.fn.init.prototype = jQuery.fn;

    return jQuery;
  }
})();
