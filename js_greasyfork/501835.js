// ==UserScript==
// @name         【自用版】🔥拓展增强🔥妖火网插件R3Knos8Ccd
// @namespace    https://yaohuo.me/
// @version      5.9.1
// @description  发帖ubb增强、回帖ubb增强、查看贴子显示用户等级增强、半自动吃肉增强、全自动吃肉增强、自动加载更多帖子、自动加载更多回复、支持个性化菜单配置
// @author       龙少c(id:20469)开发，参考其他大佬：外卖不用券(id:23825)、侯莫晨、Swilder-M
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/ali-oss@6.20.0/dist/aliyun-oss-sdk.min.js
// @require      https://update.greasyfork.org/scripts/502042/1422217/YaoHuoUtils%E5%BA%93.js#sha256-4VreNnky4KGzSsofcezqJdUT64RPomB6YU+VoTELJVk=
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501835/%E3%80%90%E8%87%AA%E7%94%A8%E7%89%88%E3%80%91%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%A6%96%E7%81%AB%E7%BD%91%E6%8F%92%E4%BB%B6R3Knos8Ccd.user.js
// @updateURL https://update.greasyfork.org/scripts/501835/%E3%80%90%E8%87%AA%E7%94%A8%E7%89%88%E3%80%91%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%A6%96%E7%81%AB%E7%BD%91%E6%8F%92%E4%BB%B6R3Knos8Ccd.meta.js
// ==/UserScript==

void (async function () {
  // 实现简易版替换用到的jquery，全部换成原生js太麻烦
  let $, jQuery;
  $ = jQuery = myJquery();

  // =====手动配置区域开始=====

  // =====手动配置区域结束=====

  let settingData = {
    // 是否显示站内图标
    isShowSettingIcon: true,
    // 是否关闭站内勋章
    isCloseMedal: false,
    // pc端帖子页面悬浮查看
    isShowPcFloatPage: false,
    // 是否开启自动吃肉，手动进去肉帖自动吃肉
    isAutoEat: false,
    // 是否开启全自动吃肉，会自动进入肉帖自动吃肉
    isFullAutoEat: false,
    // 全自动吃肉是否无跳转通过iframe吃肉，否则直接当前页面跳转打开肉帖吃肉。
    isNewOpenIframe: false,
    // 是否立即吃肉：否则会有指定回复后才会吃
    isImmediatelyEat: false,
    // 小于7点关闭吃肉
    lessThan7PointsCloseEat: true,
    // 小于200关闭吃肉
    lessThan200CloseEat: true,
    // 大于20点关闭吃肉
    greaterThan20PointsCloseEat: true,
    // 周末关闭吃肉
    weekendCloseEat: true,
    // 帖子里是否显示用户等级
    isShowLevel: true,
    // 是否自动增加时长
    isAddOnlineDuration: false,
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
    // 滑块range间隔
    timeStep: 5,
    minTimeRange: 30,
    maxTimeRange: 120,
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
    // 是否增加回帖随机颜色
    isAddReplyRandomColor: true,
    // 每个字随机颜色概率
    colorByCharacterRate: 0.01,
    // 整句随机颜色概率
    colorByAllRate: 0.1,

    // 是否自动上传到图床
    isUploadImage: false,
    // 上传图床token
    imageBedType: "极速图床",
    inkToken: "",
    meetToken: "",
    speedFreeToken: "",

    // 站内密码
    websitePassword: "",
    // 吹牛设置
    // 吹牛总开关
    isOpenBoast: false,
    // 发吹牛答案1的概率
    publishAnswer1Rate: 0.5,
    // 吃吹牛答案1的概率
    eatAnswer1Rate: 0.5,
    // 批量发牛金额
    batchPublishBoastMoney: 500,
    // 过滤牛牛金额
    filterBoastMoney: 10000000,
    // 是否自动吃吹牛
    isAutoEatBoast: false,
    // 赌注妖精大于则不自动吃
    eatBoastMaxNum: 500,
    // 自身妖精小于则不自动吃
    eatBoastMaxMoney: 100000,
    isReplaceHistoryHref: true,
    // 自动吃牛最小概率
    autoEatBoastRate: 0,

    // 发牛随机颜色
    publishBoastRandomColor: false,
    // 发牛指定颜色
    publishBoastColor: "#3d68a8",
    // 是否自动发吹牛：true为是：false为否
    isAutoPublishBoast: false,
    // 自动发牛的时间间隔
    autoPublishBoastInterval: 30,
    // 自动发布吹牛策略：1、2
    // 1为加法策略，下一次金额为最近两次之和，例如：500, 1000, 1500, 2500, 4000, 6500, 10500
    // 2为乘积策略，下一次金额为上一次的两倍，例如：500, 1000, 1500, 3000, 6000, 12000, 24000
    // 3为累加并赚去收益策略
    autoPublishBoastStrategy: 3,
    // 自动发牛初始值，默认500
    autoPublishBoastInitialValue: 500,
    // 查询指定页数或者id方式：1简略，2详细
    searchBoastLogType: 1,
    // 发牛最小连续次数
    publishBoastMinConsecutive: 3,
    // 发牛最大连续次数：如1111则为连续4次，设置4则第5次必为2，不建议设置过小，也不建议设置过大
    publishBoastMaxConsecutive: 6,
    // 策略1设置几把回本
    strategy1RecoveryCount: 3,
    // 发牛手续费次数
    addCommissionCount: 0,
    // 上一把赢了就结束
    lastWinIsEnd: false,
    // 赢多少把结束
    winEndNumber: 10,
    // 赢多少妖精结束
    winEndMoney: 20000,
    // 剩多少妖精结束
    maxEndMoney: 500,
    // 策略2后续默认倍数: 2
    strategy2DefaultRate: 2,
    // 手续费方式：1为只计算最后一次，2为累加全部的手续费
    commissionType: 2,
    // 动态胜率：true开启，false关闭；会根据最近15条地方答案动态调整策略
    isPublishBoastDynamicWinRate: false,
    // 发牛动态胜率来源：1我的大话，2全部大话
    publishBoastDynamicRateSource: "1",
    // 吃吹牛动态概率：true开启，false关闭；会根据最近15条地方答案动态调整策略
    isEatBoastDynamicWinRate: true,
    // 10次后才开启动态胜率
    dynamicWinRateAfter10times: false,
    // 动态概率统计几局
    dynamicWinRateCount: 10,
    // 历史统计次数
    getHistoryCount: 8,
    // 统计记录间隔
    getHistoryInterval: 0.5,
    // 是否半夜停止发牛，0-7不自动发牛
    isMidnightStopPublishBoast: true,
    // 策略2倍数
    multiplyRateString: "3,2,2,2",
    multiplyRate: [3, 2, 2, 2],
    // 策略3为前3项自定义初始值，后续按2倍计算，需要回本则单独开启手续费累加
    //  [500, 1111, 1790]; [500,1111, 2400]; [555, 1278, 2700]; [500, 1000, 1800]
    defaultValueByCommissionString: "500,1000,1800",
    defaultValueByCommission: [500, 1000, 1800],
    // 策略4默认值
    defaultValueByStrategy4String: "500,500,500,500",
    defaultValueByStrategy4: [500, 500, 500, 500],
    // 下一把金额异常处理方式：1停止，2从第局开始发，3忽略
    nextMoneyAbnormalProcessingMethod: 1,
    // 超时从第一局发牛
    overtimeFromFirstRoundPublish: false,
    // 超时的时间
    autoPublishBoastTimeout: 24,
    // 手动发吹牛自动叠加金额
    isAutoAddMoney: false,
    // 回帖图片插入位置
    imageInsertPosition: "插入到开头",
    // 是否增加快捷回复
    isAddQuickReply: false,
    // 是否增加快捷回复+1
    isAddReplyAdd1: true,
    // 关闭吹牛
    isCloseBoast: false,
    // 快捷回复默认
    quickReplyStr: [
      "感谢分享",
      "帮顶",
      "你小子又水贴",
      "你号没了",
      "很刑",
      "恭喜",
      "v50看看实力",
      "50包邮解君愁",
      "多发点审核员爱看",
      "黑丝小姐姐照片呢",
      "很好用已分手",
      "裤子脱了你就给我看这个",
      "厉害了我的哥",
      "你女朋友真棒",
      "你小子搞什么飞机",
      "牛批",
      "社会上的事少打听",
      "喜当爹",
      "有内鬼终止交易",
      "这么爽吗",
    ].join("\n"),
    selectedAutoSubmit: false,

    // 是否开启云同步
    isOpenCloudSync: false,
  };
  let yaohuo_userData = null;

  // 数据初始化
  await initSetting();

  let {
    isAutoEat,
    isFullAutoEat,
    isNewOpenIframe,
    isImmediatelyEat,
    isShowLevel,
    isAddOnlineDuration,
    timeInterval,
    expiredDays,
    isLoadNextPage,
    isExecTrail,

    timeStep,
    minTimeRange,
    maxTimeRange,

    maxLoadNum,
    minNumRange,
    maxNumRange,
    numStep,

    isShowSettingIcon,

    isOpenCloudSync,

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

    isAddReplyRandomColor,
    colorByCharacterRate,
    colorByAllRate,

    loadNextPageType,

    isUploadImage,
    imageBedType,
    inkToken,
    meetToken,
    speedFreeToken,

    websitePassword,
    isOpenBoast,
    publishAnswer1Rate,
    eatAnswer1Rate,

    batchPublishBoastMoney,
    filterBoastMoney,
    isAutoEatBoast,
    autoEatBoastRate,
    eatBoastMaxNum,
    eatBoastMaxMoney,
    isReplaceHistoryHref,

    publishBoastColor,
    publishBoastRandomColor,
    isAutoPublishBoast,
    autoPublishBoastStrategy,
    autoPublishBoastInitialValue,
    searchBoastLogType,
    publishBoastMinConsecutive,
    publishBoastMaxConsecutive,
    autoPublishBoastInterval,
    strategy1RecoveryCount,
    addCommissionCount,

    lastWinIsEnd,
    winEndNumber,
    winEndMoney,
    maxEndMoney,
    strategy2DefaultRate,
    commissionType,
    isPublishBoastDynamicWinRate,
    publishBoastDynamicRateSource,
    isEatBoastDynamicWinRate,
    dynamicWinRateAfter10times,
    dynamicWinRateCount,
    getHistoryCount,
    getHistoryInterval,
    isMidnightStopPublishBoast,
    multiplyRate,
    multiplyRateString,
    defaultValueByCommission,
    defaultValueByCommissionString,

    defaultValueByStrategy4,
    defaultValueByStrategy4String,

    nextMoneyAbnormalProcessingMethod,

    isCloseMedal,
    isShowPcFloatPage,

    overtimeFromFirstRoundPublish,
    autoPublishBoastTimeout,

    imageInsertPosition,

    isAutoAddMoney,

    isAddQuickReply,
    isAddReplyAdd1,

    isCloseBoast,
    lessThan200CloseEat,
    lessThan7PointsCloseEat,
    greaterThan20PointsCloseEat,
    weekendCloseEat,

    quickReplyStr,
    selectedAutoSubmit,
  } = yaohuo_userData;

  // 存储吃过肉的id，如果吃过肉则不会重复吃肉
  let autoEatList = getItem("autoEatList");
  // 回复页
  const viewPage = ["/bbs/book_re.aspx", "/bbs/book_view.aspx"];
  // 帖子列表页面
  const bbsPage = ["/bbs/book_list.aspx", "/bbs/list.aspx"];
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
    /\/bbs\/book_re\.aspx/,
    /\/bbs\/book_list\.aspx/,
    /\/bbs\/list\.aspx/,
    /\/bbs-.*\.html/,
    /\/bbs\/book_re_my\.aspx/, //我的回复页面
    // /\/bbs\/book_list_log\.aspx/,  //动态页面
  ];
  // 404页面
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
  const quickReplyList = [
    "感谢分享",
    "哎哟不错哦",
    "这么爽吗",
    "下次一定",
    "已阅",
    "帮顶",
    "厉害了我的哥",
    "你女朋友真棒",
    "不明觉厉",
    "你小子又水贴",
    "你号没了",
    "很刑",
    "恭喜",
    "v50看看实力",
    "50包邮解君愁",
    "多发点审核员爱看",
    "黑丝小姐姐照片呢",
    "很好用已分手",
    "裤子脱了你就给我看这个",
    "你小子搞什么飞机",
    "牛批",
    "社会上的事少打听",
    "喜当爹",
    "有内鬼终止交易",
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
      offset: 7,
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
      ubb: "[font=serif]输入文字[/font]",
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
      offset: 4,
    },
    {
      id: "ubb_color",
      ubb: "[forecolor=red]颜色文字，默认红[/forecolor]",
      offset: 12,
    },
    {
      id: "ubb_random_color",
      ubb: "[forecolor=red]颜色文字，随机颜色[/forecolor]",
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
      offset: 7,
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
      offset: 7,
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
    "color: #fff; padding: 2px 4px; font-size: 14px; background-color: #ccc;border-radius: 10%; cursor: pointer;";
  const a2style =
    "color: #fff; padding: 2px 4px; font-size: 14px; background-color: #d19275;border-radius: 10%; cursor: pointer;";
  const a3style =
    "color: #fff; padding: 2px 4px; font-size: 14px; background-color: #66ccff;border-radius: 10%; cursor: pointer;";
  // ==主代码执行==
  (async function () {
    // 处理新帖也帖子列表页面下一步加载时，页面会到下一页
    // handleMoreLoadNextPage();

    // 修复网站更新样式错乱问题
    handleStyle();
    // 处理浏览器滚动条事件
    handleWindowScroll();
    // 处理窗口改变事件
    handleWindowResize();
    // 自动填充密码并确认
    handlePassword();
    // 添加站内设置按钮
    addSettingBtn();
    // 关闭勋章显示
    handleCloseMedal();
    // 如果关闭了悬浮图标，在网站首页右上角添加插件设置入口
    handleAddSettingText();
    // 注册油猴脚本设置
    handleRegisterMenu();
    // 加载更多按钮点击事件监听
    handleAddLoadMoreBtnClick();
    // 增加在线时长
    handleAutoAddOnlineDuration();
    // 手动吃肉：手动进入肉帖吃
    handleAutoEat();
    // 全自动吃肉：自动进入肉帖自动吃
    handleFullAutoEat();
    // pc端帖子页面悬浮查看
    handleBbsListFloatOpen();
    // 自动上传图床功能
    handleUploadImage();
    // 增加回帖ubb
    handleAddReplyUBB();
    // 增加回帖表情
    handleAddReplyFace();
    // 优化回帖
    // handleReply();
    // 回帖增加随机颜色
    handleAddReplyRandomColor();
    // 回帖快捷回复
    handleAddQuickReply();

    // 增加发帖ubb
    handleAddNewPostUBB();
    // 显示用户等级
    // handleShowUserLevel();
    // 处理404页面跳回新帖页面
    handleNotFoundPage();
    // 吹牛增强
    handleBoast();
    // 打赏增强
    handleReward();
    // handleStatisticalData();
  })();

  // ==其他功能函数和方法==
  function handleReward() {
    if (/^\/bbs-.*\.html$/.test(window.location.pathname)) {
      let wrap = document.querySelector(".aui-grids");
      let item = document.querySelectorAll(".aui-grids-item");
      let typeAmount = document.getElementById("type-amount");
      let sendmoney = document.querySelector("input[name=sendmoney]");
      item.forEach((element) => {
        element.setAttribute("contenteditable", "true");

        // 监听输入事件
        element.addEventListener("blur", function (event) {
          let newValue = event.target.textContent;
          let originalContent = element.textContent;

          const newContent = event.target.textContent;
          if (isNaN(newContent) || !newContent) {
            // 如果内容不是数字，恢复到原始内容
            event.target.textContent = originalContent;
          } else {
            // 更新原始内容为新内容
            originalContent = newContent;
            this.value = newContent;
            sendmoney.value = newContent;
            typeAmount.innerHTML =
              '打赏<span id="bounty" class="space">' +
              this.getAttribute("value") +
              '</span><span class="space"></span>妖晶';
          }
          // 在这里执行更新页面的逻辑，例如保存内容到服务器等
        });
      });

      // wrap.insertAdjacentHTML("beforeend", `
      //   <button type="button" class="aui-grids-item" value="88888" contenteditable="true"><span>88888</span></button>
      // `);
    }
  }

  function getSelectedDataFromLocalStorage(selectedProperties) {
    // 创建一个空对象，用于存储所选属性的值
    var selectedData = {};

    // 遍历 localStorage 中的每一项
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i); // 获取当前键名

      // 检查当前键名是否在所选属性数组中
      if (!selectedProperties || selectedProperties.includes(key)) {
        var value = localStorage.getItem(key); // 获取对应键名的值
        if (key === "yaohuo_userData") {
          let obj = JSON.parse(value);
          let result = delete obj.websitePassword;
          value = JSON.stringify(obj);
        }
        selectedData[key] = value; // 将键值对添加到新对象中
      }
    }

    // 返回包含所选属性的对象
    return selectedData;
  }

  // 备份 localStorage 数据到剪贴板
  function backupLocalStorage() {
    // 获取 指定localStorage 中的数据

    // autoEatList
    var selectedProperties = ["yaohuo_userData"];
    var selectedData = getSelectedDataFromLocalStorage(selectedProperties);

    // 创建一个临时文本区域用于复制到剪贴板
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = JSON.stringify(selectedData);
    document.body.appendChild(tempTextArea);
    tempTextArea.select();

    try {
      // 复制文本到剪贴板
      document.execCommand("copy");
      alert("数据备份成功，已复制到剪贴板");
    } catch (err) {
      console.error("备份数据失败", err);
    } finally {
      // 移除临时文本区域
      document.body.removeChild(tempTextArea);
    }
  }
  function restoreData(userInput) {
    if (userInput !== null && userInput.trim() !== "") {
      try {
        // 解析 JSON 字符串并将数据写入 localStorage
        var parsedData = JSON.parse(userInput);
        if (typeof parsedData === "object" && parsedData !== null) {
          let newData = getItem("yaohuo_userData");
          // localStorage.clear();
          for (var key in parsedData) {
            if (parsedData.hasOwnProperty(key)) {
              if (key === "yaohuo_userData") {
                let oldData = JSON.parse(parsedData[key]);
                for (const oldKey in oldData) {
                  if (oldData.hasOwnProperty(oldKey)) {
                    newData[oldKey] = oldData[oldKey];
                  }
                }
                yaohuo_userData = newData;
                setItem("yaohuo_userData", yaohuo_userData);
              } else {
                setItem(key, parsedData[key]);
              }
            }
          }

          setItem("lastRemoteRestoreTime", new Date().getTime());

          // alert("数据已还原");
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } else {
          alert("无效的数据格式。请确保粘贴有效的数据格式。");
        }
      } catch (err) {
        alert("还原数据时出错。请确保粘贴有效的数据格式。");
        console.error("Error restoring localStorage data", err);
      }
    } else {
      alert("没有粘贴任何数据。请确保粘贴有效的数据格式。");
    }
  }
  // 从剪贴板恢复 localStorage 数据
  function restoreLocalStorage() {
    // 显示一个提示，要求用户手动粘贴数据
    var userInput = prompt("请将要恢复的数据粘贴到此处：");
    restoreData(userInput);
  }

  function backupLocalStorageByRemote(forceRevert) {
    let isOpenCloudSync = yaohuo_userData?.isOpenCloudSync;
    if (!isOpenCloudSync) {
      forceRevert && showTooltip("请先开启多端云同步功能", 0);
      return;
    }
    YaoHuoUtils.setData()
      .then((res) => {
        forceRevert && showTooltip(res, 1);
      })
      .catch((err) => {
        forceRevert && showTooltip(err, 0);
      });
  }
  function restoreLocalStorageByRemote(forceRevert) {
    /* let isOpenCloudSync = yaohuo_userData?.isOpenCloudSync;
    if (!isOpenCloudSync) {
      forceRevert && showTooltip("请先开启多端云同步功能", 0);
      return;
    } */
    YaoHuoUtils.getData(forceRevert)
      .then((res) => {
        forceRevert && showTooltip(res, 1);
      })
      .catch((err) => {
        forceRevert && showTooltip(err, 0);
      });
  }
  // 获取用户id
  async function getUserId(url = "/myfile.aspx", force = false) {
    if (getItem("yaohuoUserID", "") && !force) {
      return;
    }
    let res = await fetchData(url, 0);
    let id = res.match(/我的ID(<.*?>)?:?\s*(\d+)/)?.[2];
    if (force) {
      id && setItem("yaohuoUserID", id);
      return id;
    }
    id && setItem("yaohuoUserID", id);
  }
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
  async function handleStatisticalData() {
    // /games/chuiniu/book_list.aspx
    // /games/chuiniu/book_view.aspx?siteid=1000&classid=0&type=0&touserid=&id=877578
    if (["/games/chuiniu/book_view.aspx"].includes(location.pathname)) {
      let page = 1;
      let initId = Number(getUrlParameters().id || 0);
      let minId = initId - 500;
      let obj = getItem("boastData");
      let url;
      let id;
      for (id = initId; id > minId; id--) {
        if ((initId - id) % 100 === 0) {
          console.log(`第${initId - id + 100}次循环。`);
        }
        if (id < 885384 - 3000) {
          break;
        }

        if (obj[id]) {
          continue;
        }
        url = `https://yaohuo.me/games/chuiniu/book_view.aspx?siteid=1000&classid=0&type=0&touserid=&id=${id}`;
        let res = await fetchData(url);

        let regex = /<body>([\s\S]*?)<\/body>/;
        let match = regex.exec(res);
        let bodyString = match?.[0];
        if (bodyString.includes("不存在此挑战！")) {
          continue;
        }
        let money = bodyString.match(/赌注是:(\d+)妖晶/)[1];
        // 获取挑战方出的答案：发吹牛的人
        let challengerAnswer = bodyString.match(/挑战方出的是\[答案(\d)\]/)[1];

        // 获取应战方出的答案：接吹牛的人
        let opponentAnswer = bodyString.match(/应战方出的是\[答案(\d)\]/)[1];

        // 获取对应战方状态
        let battleStatus = bodyString.match(
          /对应战方状态:<b>(获胜|失败)!<\/b>/
        )[1];
        obj[id] = {
          id,
          money,
          challengerAnswer,
          opponentAnswer,
          battleStatus,
          lastTime: new Date().getTime(),
        };
        setItem("boastData", obj);
      }
      console.log("当前已结束，等待下次");
      setTimeout(() => {
        let newHref = `https://yaohuo.me/games/chuiniu/book_view.aspx?siteid=1000&classid=0&type=0&touserid=&id=${id}`;
        window.location.href = newHref;
      }, 120000);
    }
  }
  async function fetchData(url, timeout = getHistoryInterval * 1000) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.text();
        // 处理响应数据
        setTimeout(() => {
          resolve(data);
        }, timeout);
      } catch (error) {
        // 处理错误
        console.error("Error:", error);
        setTimeout(() => {
          reject(error);
        }, timeout);
      }
    });
  }
  // async function fetchData(url) {
  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const data = await response.text();
  //     return data;
  //   } catch (error) {
  //     // 处理错误
  //     console.error("Error:", error);
  //     return error;
  //   }
  // }
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
  function handleRegisterMenu() {
    try {
      if (!!GM_registerMenuCommand) {
        GM_registerMenuCommand("打开设置界面", setMenu);
      }
    } catch (error) {}
  }
  function isMobile() {
    return /Mobile/i.test(navigator.userAgent);
  }
  async function initSetting() {
    window.setItem = setItem;
    window.getItem = getItem;
    // 获取用户id
    await getUserId();
    await getInfo();
    // 在移动设备上执行的代码
    if (isMobile()) {
      // 移动端默认显示站内设置图标
      settingData.isShowSettingIcon = true;
    } else {
      // 在桌面设备上执行的代码
    }

    // 获取用户历史数据
    yaohuo_userData = getItem("yaohuo_userData");

    // 查看本地是否存在旧数据
    if (!yaohuo_userData) {
      yaohuo_userData = settingData;
      // setItem("yaohuo_userData", yaohuo_userData);
    }

    let flag = false;

    // 自动更新数据
    for (let value in settingData) {
      if (!yaohuo_userData.hasOwnProperty(value)) {
        flag = true;
        yaohuo_userData[value] = settingData[value];
      }
    }
    let lastRemoteRestoreTime = getItem("lastRemoteRestoreTime", 0);
    let lastRemoteBackupTime = getItem("lastRemoteBackupTime", 0);
    console.info(
      "lastRemoteRestoreTime",
      new Date(lastRemoteRestoreTime).toLocaleString()
    );
    if (
      !lastRemoteRestoreTime ||
      ((new Date().getTime() - lastRemoteRestoreTime) / 1000 > 30 &&
        (new Date().getTime() - lastRemoteBackupTime) / 1000 > 5)
    ) {
      if (yaohuo_userData.isOpenCloudSync) {
        restoreLocalStorageByRemote();
      }
    }

    if (flag) {
      setItem("yaohuo_userData", yaohuo_userData);
    }

    initSettingBtnPosition("init");
  }

  async function getInfo() {
    if (getLoginStatus()) {
      return;
    }

    let id = await getUserId(undefined, true);

    try {
      let result = ytoz(yaohuoStrText);
      result = result.includes("[") ? JSON.parse(result) : result;

      let flag =
        typeof result === "string"
          ? result.includes(id)
          : result.find((item) => item.key == id);

      let data = {
        token: flag ? ztoy(id) : null,
        timestamp: new Date().getTime(),
      };

      setItem("yaohuoLoginInfo", data, true);
      setItem("notAutoEatBoastList", []);
    } catch (err) {
      console.info(err);
      throw new Error("加载失败");
    }

    // async function getUserId(url = "/myfile.aspx") {
    //   let res = await fetchData(url, 0);
    //   let id = res.match(/我的ID(<.*?>)?:?\s*(\d+)/)?.[2];
    //   return id;
    // }
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
    if (!getLoginStatus()) return;
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

      .global-tooltip {
        visibility: hidden;
        min-width: 200px;
        background-color: #fff;
        color: #000;
        text-align: center;
        border-radius: 5px;
        padding: 2px;
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.5s, visibility 0.5s;
        box-shadow: 0px 0px 4px 0px #aaa;
      }

      .global-tooltip.show {
        visibility: visible;
        opacity: 1;
      }

      .global-tooltip.success {
        border-left: 5px solid #4caf50; /* Green */
      }

      .global-tooltip.error {
        border-left: 5px solid #f44336; /* Red */
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

    let globalTipH = `
      <div id="globalTooltip" class="global-tooltip"></div>
    `;
    $("body").append(innerH);
    $("body").append(globalTipH);

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

  /**
   * 1成功提示，0失败提示
   */
  function showTooltip(message, type = "1", timeout = 3000) {
    type = type == "1" ? "success" : "error";
    var tooltip = document.getElementById("globalTooltip");
    // 移除所有类型类
    tooltip.classList.remove("success", "error");

    tooltip.innerHTML = message;
    tooltip.classList.add("show", type);

    setTimeout(function () {
      tooltip.classList.remove("show");

      // 延迟移除类型类，确保过渡效果结束
      setTimeout(function () {
        tooltip.classList.remove(type);
      }, 500); // 等待过渡效果结束
    }, timeout); // 3秒后消失
  }
  // 处理窗口改变事件
  function handleWindowResize() {
    if (!getItem("yaohuoLoginInfo", {}).timestamp) {
      throw new Error(`异常`);
    }
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
        min-height: 44px;
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
      .yaohuo-wrap li textarea{
        width: 100%;
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
          <header>🔥拓展增强🔥插件设置<a href="https://update.greasyfork.org/scripts/496915/%E3%80%90%E8%B5%9E%E5%8A%A9%E7%89%88%E3%80%91%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%A6%96%E7%81%AB%E7%BD%91%E6%8F%92%E4%BB%B6.user.js" target="_blank">【检测更新】</a></header>
          <ul>
            <li class="yaohuo-wrap-title">
              <hr class="title-line title-line-left" />
              <b>站内设置</b>
              <hr class="title-line title-line-right" />
            </li>
            <li>
              <span>教程、交流群</span>
              
              <div>
                <a href="/bbs-1183941.html" target="_blank">原贴直达</a>
                / 
                <a href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=B8jHwcToRt8GnMoJa3jDk01xt6XFP2yi&authKey=WULG168m8oDAcLqoRa2moGO5%2FWXGFAYhMtO4RjhEVDHbzQoDmHBPqfGlv8ya50Ty&noverify=0&group_code=768664029" target="_blank">插件交流群</a>
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
              <span>开启多端云同步${getIcon(
                "tipIcon",
                "提示：多设备自动备份、恢复插件数据到云端，如有需要可联系作者"
              )}</span>
              <div class="switch">
                <input type="checkbox" id="isOpenCloudSync" data-key="isOpenCloudSync" />
                <label for="isOpenCloudSync"></label>
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
              <span>
              自动增加时长${getIcon(
                "tipIcon",
                "提示：开启自动增加时长会定时刷新当前页面，定时的时间和吃肉时间间隔用相同，不要同时打开多个网页，否则每个页面都会刷新"
              )}
              </span>
              <div class="switch">
                <input type="checkbox" id="isAddOnlineDuration" data-key="isAddOnlineDuration" />
                <label for="isAddOnlineDuration"></label>
              </div>
            </li>
            <li>
              <span id="restoreLocal2" onclick="localStorage.clear();location.reload()"><a href="javascript:;">清除缓存</a></span>
              <span id="backupLocal"><a href="javascript:;">备份数据</a></span>
              <span id="restoreLocal"><a href="javascript:;">恢复数据</a></span>
            </li>
            <li>
              <span id="backupLocalByRemote"><a href="javascript:;">备份数据到远端</a></span>
              <span id="restoreLocalByRemote"><a href="javascript:;">从远端恢复数据</a></span>
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
              <span>回帖图床插入位置</span>
              <select data-key="imageInsertPosition" id="imageInsertPosition">
                <option value="插入到开头">插入到开头</option>
                <option value="插入到末尾">插入到末尾</option>
                <option value="插入到光标位置">插入到光标位置</option>
              </select>
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
              <b>吹牛设置</b>
              <hr class="title-line title-line-right" />
            </li>
            <li>
              <span>关闭吹牛入口（戒赌）</span>
              <div class="switch">
                <input type="checkbox" id="isCloseBoast" data-key="isCloseBoast" />
                <label for="isCloseBoast"></label>
              </div>
            </li>
            <li>
              <span>吹牛总开关</span>
              <div class="switch">
                <input type="checkbox" id="isOpenBoast" data-key="isOpenBoast" />
                <label for="isOpenBoast"></label>
              </div>
            </li>
            <li>
              <span>发牛随机颜色</span>
              <div class="switch">
                <input type="checkbox" id="publishBoastRandomColor" data-key="publishBoastRandomColor" />
                <label for="publishBoastRandomColor"></label>
              </div>
            </li>
            <li>
              <span>发牛默认颜色：<a class="clear-color-btn">清除</a></span>
              <input 
                id="publishBoastColor" 
                data-key="publishBoastColor"
                type="color" 
                value="${publishBoastColor}"
              >
            </li>
            <li>
              <span>发牛答案一概率：<i class="range-num">${publishAnswer1Rate}</i></span>
              <input
                type="range"
                id="publishAnswer1Rate"
                data-key="publishAnswer1Rate"
                min="${0.35}"
                value="${publishAnswer1Rate}"
                max="${0.65}"
                step="${0.01}"
              />
            </li>
            <li>
              <span>吃牛答案一概率：<i class="range-num">${eatAnswer1Rate}</i></span>
              <input
                type="range"
                id="eatAnswer1Rate"
                data-key="eatAnswer1Rate"
                min="${0.35}"
                value="${eatAnswer1Rate}"
                max="${0.65}"
                step="${0.01}"
              />
            </li>
            <li>
              <span>吃牛答案动态概率</span>
              <div class="switch">
                <input type="checkbox" id="isEatBoastDynamicWinRate" data-key="isEatBoastDynamicWinRate" />
                <label for="isEatBoastDynamicWinRate"></label>
              </div>
            </li>
            <li>
              <span>发牛答案动态概率</span>
              <div class="switch">
                <input type="checkbox" id="isPublishBoastDynamicWinRate" data-key="isPublishBoastDynamicWinRate" />
                <label for="isPublishBoastDynamicWinRate"></label>
              </div>
            </li>
            <li>
              <span>发牛动态概率取自</span>
              <select data-key="publishBoastDynamicRateSource" id="publishBoastDynamicRateSource">
                <option value="1">我的大话</option>
                <option value="2">全部大话</option>
              </select>
            </li>
            <li>
              <span>动态概率10局后开启</span>
              <div class="switch">
                <input type="checkbox" id="dynamicWinRateAfter10times" data-key="dynamicWinRateAfter10times" />
                <label for="dynamicWinRateAfter10times"></label>
              </div>
            </li>
            <li>
              <span>每次统计间隔：<i class="range-num">${getHistoryInterval}</i>秒</span>
              <input
                type="range"
                id="getHistoryInterval"
                data-key="getHistoryInterval"
                min="${0.1}"
                value="${getHistoryInterval}"
                max="${3}"
                step="${0.1}"
              />
            </li>
            <li>
              <span>统计历史记录：<i class="range-num">${getHistoryCount}</i>次</span>
              <input
                type="range"
                id="getHistoryCount"
                data-key="getHistoryCount"
                min="${0}"
                value="${getHistoryCount}"
                max="${15}"
                step="${1}"
              />
            </li>
            <li>
              <span>动态概率计算几局：<i class="range-num">${dynamicWinRateCount}</i></span>
              <input
                type="range"
                id="dynamicWinRateCount"
                data-key="dynamicWinRateCount"
                min="${0}"
                value="${dynamicWinRateCount}"
                max="${15}"
                step="${1}"
              />
            </li>
            <li>
              <span>替换吹牛链接</span>
              <div class="switch">
                <input type="checkbox" id="isReplaceHistoryHref" data-key="isReplaceHistoryHref" />
                <label for="isReplaceHistoryHref"></label>
              </div>
            </li>
            <li>
              <span>查询吹牛日志方式</span>
              <select data-key="searchBoastLogType" id="searchBoastLogType">
                <option value="1">简略</option>
                <option value="2">详细</option>
              </select>
            </li>
            <li>
              <span>下把赌注异常处理方式</span>
              <select data-key="nextMoneyAbnormalProcessingMethod" id="nextMoneyAbnormalProcessingMethod">
                <option value="1">停止自动发牛</option>
                <option value="2">自动发牛从第一把开始</option>
                <option value="3">忽略不做任何处理</option>
              </select>
            </li>
            <li>
              <span>过滤牛牛最大金额</span>
              <input 
                type="number" 
                id="filterBoastMoney"
                data-key="filterBoastMoney"
                min="${500}"
                step="${100}"
                value="${filterBoastMoney}"
              >
            </li>
            <li>
              <span>批量发牛金额</span>
              <input 
                type="number" 
                id="batchPublishBoastMoney"
                data-key="batchPublishBoastMoney"
                min="${500}"
                step="${100}"
                value="${batchPublishBoastMoney}"
              >
            </li>
            <li>
              <span>手动发吹牛自动叠加金额</span>
              <div class="switch">
                <input type="checkbox" id="isAutoAddMoney" data-key="isAutoAddMoney" />
                <label for="isAutoAddMoney"></label>
              </div>
            </li>
            <li>
              <span>发牛最小连续次数：<i class="range-num">${publishBoastMinConsecutive}</i>次</span>
              <input
                type="range"
                id="publishBoastMinConsecutive"
                data-key="publishBoastMinConsecutive"
                min="${1}"
                value="${publishBoastMinConsecutive}"
                max="${10}"
                step="${1}"
              />
            </li>
            <li>
              <span>发牛最大连续次数：<i class="range-num">${publishBoastMaxConsecutive}</i>次</span>
              <input
                type="range"
                id="publishBoastMaxConsecutive"
                data-key="publishBoastMaxConsecutive"
                min="${3}"
                value="${publishBoastMaxConsecutive}"
                max="${10}"
                step="${1}"
              />
            </li>
            <li>
              <span>自动吃吹牛</span>
              <div class="switch">
                <input type="checkbox" id="isAutoEatBoast" data-key="isAutoEatBoast" />
                <label for="isAutoEatBoast"></label>
              </div>
            </li>
            <li>
              <span>自动吃牛最大赌注妖精</span>
              <input 
                type="number" 
                id="eatBoastMaxNum"
                data-key="eatBoastMaxNum"
                min="${0}"
                step="${100}"
                value="${eatBoastMaxNum}"
              >
            </li>
            <li>
              <span>自身妖精低于则不自动吃</span>
              <input 
                type="number" 
                id="eatBoastMaxMoney"
                data-key="eatBoastMaxMoney"
                min="${0}"
                step="${100}"
                value="${eatBoastMaxMoney}"
              >
            </li>
            <li>
              <span>自动吃牛最小胜率：<i class="range-num">${autoEatBoastRate}</i></span></span>
              <input
                type="range"
                id="autoEatBoastRate"
                data-key="autoEatBoastRate"
                min="${0}"
                value="${autoEatBoastRate}"
                max="${1}"
                step="${0.01}"
              />
            </li>
            <li>
              <span>自动发吹牛</span>
              <div class="switch">
                <input type="checkbox" id="isAutoPublishBoast" data-key="isAutoPublishBoast" />
                <label for="isAutoPublishBoast"></label>
              </div>
            </li>
            <li>
              <span>0-9点停止发牛</span>
              <div class="switch">
                <input type="checkbox" id="isMidnightStopPublishBoast" data-key="isMidnightStopPublishBoast" />
                <label for="isMidnightStopPublishBoast"></label>
              </div>
            </li>
            <li>
              <span>当前赢了就停止发牛</span>
              <div class="switch">
                <input type="checkbox" id="lastWinIsEnd" data-key="lastWinIsEnd" />
                <label for="lastWinIsEnd"></label>
              </div>
            </li>
            <li>
              <span>赢几局停发牛：<a class="clear-win-data-btn">清除</a></span>
              <input 
                style="width:100px"
                type="number" 
                id="winEndNumber"
                data-key="winEndNumber"
                min="${1}"
                step="${5}"
                value="${winEndNumber}"
              >
            </li>
            <li>
              <span>赢多少停发牛：<a class="clear-win-data-btn">清除</a></span>
              <input 
                style="width:100px"
                type="number" 
                id="winEndMoney"
                data-key="winEndMoney"
                min="${500}"
                step="${100}"
                value="${winEndMoney}"
              >
            </li>
            <li>
              <span>剩多少停发牛：</span>
              <input 
                style="width:100px"
                type="number" 
                id="maxEndMoney"
                data-key="maxEndMoney"
                min="${500}"
                max="${10000000}"
                step="${100}"
                value="${maxEndMoney}"
              >
            </li>
            <li>
              <span>超时从第一局发牛</span>
              <div class="switch">
                <input type="checkbox" id="overtimeFromFirstRoundPublish" data-key="overtimeFromFirstRoundPublish" />
                <label for="overtimeFromFirstRoundPublish"></label>
              </div>
            </li>
            <li>
              <span>超时时间：<i class="range-num">${autoPublishBoastTimeout}</i>小时</span>
              <input
                type="range"
                id="autoPublishBoastTimeout"
                data-key="autoPublishBoastTimeout"
                min="${1}"
                value="${autoPublishBoastTimeout}"
                max="${24}"
                step="${1}"
              />
            </li>
            <li>
              <span class="preview-strategy-btn"><a>自动发牛策略</a></span>
              <select data-key="autoPublishBoastStrategy" id="autoPublishBoastStrategy">
                <option value="1">策略1最近两次之和</option>
                <option value="2">策略2最近一次两倍</option>
                <option value="3">策略3累加赚收益策略</option>
                <option value="4">策略4自定义每把数值</option>
              </select>
            </li>
            <li>
              <span>自动发牛初始值：<i class="range-num">${autoPublishBoastInitialValue}</i></span>
              <input
                type="range"
                id="autoPublishBoastInitialValue"
                data-key="autoPublishBoastInitialValue"
                min="${500}"
                value="${autoPublishBoastInitialValue}"
                max="${3000}"
                step="${100}"
              />
            </li>
            <li>
              <span>策略1回本次数：<i class="range-num">${strategy1RecoveryCount}</i></span>
              <input
                type="range"
                id="strategy1RecoveryCount"
                data-key="strategy1RecoveryCount"
                min="${3}"
                value="${strategy1RecoveryCount}"
                max="${15}"
                step="${1}"
              />
            </li>
            <li>
              <span>策略2默认倍数：<i class="range-num">${strategy2DefaultRate}</i></span>
              <input
                type="range"
                id="strategy2DefaultRate"
                data-key="strategy2DefaultRate"
                min="${2}"
                value="${strategy2DefaultRate}"
                max="${2.5}"
                step="${0.1}"
              />
            </li>
            <li>
              <span>策略2指定倍数</span>
              <input
                id="multiplyRateString"
                data-key="multiplyRateString"
                value="${multiplyRateString}"
              />
            </li>
            <li>
              <span>策略3指定前3项</span>
              <input
                id="defaultValueByCommissionString"
                data-key="defaultValueByCommissionString"
                value="${defaultValueByCommissionString}"
              />
            </li>
            <li>
              <span>策略4指定每一项</span>
              <input
                id="defaultValueByStrategy4String"
                data-key="defaultValueByStrategy4String"
                value="${defaultValueByStrategy4String}"
              />
            </li>
            <li>
              <span>发牛增加手续费：<i class="range-num">${addCommissionCount}</i>局</span>
              <input
                type="range"
                id="addCommissionCount"
                data-key="addCommissionCount"
                min="${0}"
                value="${addCommissionCount}"
                max="${20}"
                step="${1}"
              />
            </li>
            <li>
              <span>手续费方式</span>
              <select data-key="commissionType" id="commissionType">
                <option value="1">只计算最后一次</option>
                <option value="2">累加全部的手续费</option>
              </select>
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
              <span>自动进贴全自动吃肉</span>
              <div class="switch">
                <input type="checkbox" id="isFullAutoEat" data-key="isFullAutoEat" />
                <label for="isFullAutoEat"></label>
              </div>
            </li>
            <li>
              <span>全自动吃肉是否无跳转</span>
              <div class="switch">
                <input type="checkbox" id="isNewOpenIframe" data-key="isNewOpenIframe" />
                <label for="isNewOpenIframe"></label>
              </div>
            </li>
            <li>
              <span>立刻吃肉</span>
              <div class="switch">
                <input type="checkbox" id="isImmediatelyEat" data-key="isImmediatelyEat" />
                <label for="isImmediatelyEat"></label>
              </div>
            </li>
            <li>
              <span>小于200关闭自动吃肉</span>
              <div class="switch">
                <input type="checkbox" id="lessThan200CloseEat" data-key="lessThan200CloseEat" />
                <label for="lessThan200CloseEat"></label>
              </div>
            </li>
            <li>
              <span>小于7点关闭自动吃肉</span>
              <div class="switch">
                <input type="checkbox" id="lessThan7PointsCloseEat" data-key="lessThan7PointsCloseEat" />
                <label for="lessThan7PointsCloseEat"></label>
              </div>
            </li>
            <li>
              <span>大于20点关闭自动吃肉</span>
              <div class="switch">
                <input type="checkbox" id="greaterThan20PointsCloseEat" data-key="greaterThan20PointsCloseEat" />
                <label for="greaterThan20PointsCloseEat"></label>
              </div>
            </li>
            <li>
              <span>周末关闭自动吃肉</span>
              <div class="switch">
                <input type="checkbox" id="weekendCloseEat" data-key="weekendCloseEat" />
                <label for="weekendCloseEat"></label>
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
            <li>
              <span>自动吃肉时间间隔：<i class="range-num">${timeInterval}</i>秒</span>
              <input
                type="range"
                id="timeInterval"
                data-key="timeInterval"
                min="${minTimeRange}"
                value="${timeInterval}"
                max="${maxTimeRange}"
                step="${timeStep}"
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
            <hr>
            <li>
              <span>回帖随机颜色</span>
              <div class="switch">
                <input type="checkbox" id="isAddReplyRandomColor" data-key="isAddReplyRandomColor" />
                <label for="isAddReplyRandomColor"></label>
              </div>
            </li>
            <li>
              <span>整句彩色字概率：<i class="range-num">${colorByCharacterRate}</i></span>
              <input
                type="range"
                id="colorByCharacterRate"
                data-key="colorByCharacterRate"
                min="${0}"
                value="${colorByCharacterRate}"
                max="${0.1}"
                step="${0.01}"
              />
            </li>
            <li>
              <span>整句随机颜色概率：<i class="range-num">${colorByAllRate}</i></span>
              <input
                type="range"
                id="colorByAllRate"
                data-key="colorByAllRate"
                min="${0}"
                value="${colorByAllRate}"
                max="${0.1}"
                step="${0.01}"
              />
            </li>
            <hr>
            <li>
              <span>增加回复+1</span>
              <div class="switch">
                <input type="checkbox" id="isAddReplyAdd1" data-key="isAddReplyAdd1" />
                <label for="isAddReplyAdd1"></label>
              </div>
            </li>
            <li>
              <span>增加快捷回复</span>
              <div class="switch">
                <input type="checkbox" id="isAddQuickReply" data-key="isAddQuickReply" />
                <label for="isAddQuickReply"></label>
              </div>
            </li>
            <li>
              <span>选择后是否直接提交</span>
              <div class="switch">
                <input type="checkbox" id="selectedAutoSubmit" data-key="selectedAutoSubmit" />
                <label for="selectedAutoSubmit"></label>
              </div>
            </li>
            <li>
              <textarea id="replyTextarea" rows="10">${quickReplyStr}</textarea>
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
              <span>加载最大数：<i class="range-num">${maxLoadNum}</i>个</span>
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
    $("#backupLocal").click(backupLocalStorage);
    $("#restoreLocal").click(restoreLocalStorage);
    $("#backupLocalByRemote").click(() => {
      let lastRemoteBackupTime = getItem("lastRemoteBackupTime", 0);
      if ((new Date().getTime() - lastRemoteBackupTime) / 1000 > 10) {
        if (confirm("确认备份数据到远端吗？")) {
          backupLocalStorageByRemote(true);
        }
      } else {
        showTooltip("请勿频繁操作");
      }
    });
    $("#restoreLocalByRemote").click(() => {
      let lastRemoteRestoreTime = getItem("lastRemoteRestoreTime", 0);
      if ((new Date().getTime() - lastRemoteRestoreTime) / 1000 > 10) {
        if (confirm("确认从远端恢复数据吗")) {
          restoreLocalStorageByRemote(true);
        }
      } else {
        showTooltip("请勿频繁操作");
      }
    });
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
              fatherIdAry: ["isFullAutoEat"],
              childIdAry: [
                "timeInterval",
                "isNewOpenIframe",
                "isImmediatelyEat",
                "lessThan7PointsCloseEat",
                "greaterThan20PointsCloseEat",
                "weekendCloseEat",
                "lessThan200CloseEat",
              ],
              dataKey,
            });
            autoShowElement({
              fatherIdAry: ["isAutoEat", "isFullAutoEat"],
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
            autoShowElement({
              fatherIdAry: ["isAddReplyRandomColor"],
              childIdAry: ["colorByAllRate", "colorByCharacterRate"],
              dataKey,
            });
            autoShowElement({
              fatherIdAry: ["isOpenBoast"],
              childIdAry: [
                "publishAnswer1Rate",
                "eatAnswer1Rate",
                "batchPublishBoastMoney",
                "filterBoastMoney",
                "isAutoEatBoast",
                "autoEatBoastRate",
                "eatBoastMaxNum",
                "eatBoastMaxMoney",
                "publishBoastColor",
                "publishBoastRandomColor",
                "isAutoPublishBoast",
                "autoPublishBoastStrategy",
                "autoPublishBoastInitialValue",
                "isReplaceHistoryHref",
                "searchBoastLogType",
                "publishBoastMinConsecutive",
                "publishBoastMaxConsecutive",
                "strategy1RecoveryCount",
                "addCommissionCount",
                "lastWinIsEnd",
                "strategy2DefaultRate",
                "winEndNumber",
                "winEndMoney",
                "maxEndMoney",
                "commissionType",
                "isPublishBoastDynamicWinRate",
                "publishBoastDynamicRateSource",
                "isEatBoastDynamicWinRate",
                "dynamicWinRateAfter10times",
                "isMidnightStopPublishBoast",
                "multiplyRateString",
                "defaultValueByCommissionString",
                "defaultValueByStrategy4String",
                "nextMoneyAbnormalProcessingMethod",
                "overtimeFromFirstRoundPublish",
                "autoPublishBoastTimeout",
                "getHistoryInterval",
                "getHistoryCount",
                "dynamicWinRateCount",
                "isAutoAddMoney",
              ],
              dataKey,
            });
            autoShowElement({
              fatherIdAry: ["isAutoEatBoast"],
              childIdAry: [
                "eatBoastMaxNum",
                "eatBoastMaxMoney",
                "autoEatBoastRate",
              ],
              dataKey,
            });
            autoShowElement({
              fatherIdAry: ["isAutoPublishBoast"],
              childIdAry: [
                // "autoPublishBoastStrategy",
                // "autoPublishBoastInitialValue",
                // "strategy1RecoveryCount",
                "isMidnightStopPublishBoast",
                "addCommissionCount",
                "lastWinIsEnd",
                "winEndNumber",
                "winEndMoney",
                "maxEndMoney",
                "strategy2DefaultRate",
              ],
              dataKey,
            });
            autoShowElement({
              fatherIdAry: ["isAddQuickReply"],
              childIdAry: ["replyTextarea", "selectedAutoSubmit"],
              dataKey,
            });
          } else {
            if (getValue("isCloseBoast") && dataKey === "isOpenBoast") {
              setValue(dataKey, false);
            } else {
              setValue(dataKey, item.checked);
            }
          }
          break;

        case "range":
          if (status === "edit") {
            $(item).on("input propertychange", function (event) {
              $(item).prev().children(".range-num").text(item.value);
            });
          } else {
            setValue(dataKey, parseFloat(item.value));
          }
          break;

        case "select-one":
          if (status === "edit") {
            item.value = getValue(dataKey);
            $(item).on("change", function (event) {
              autoShowImageToken(item, dataKey);
            });
            previewStrategy(dataKey);
            autoShowImageToken(item, dataKey);
          } else {
            setValue(dataKey, item.value);
          }
          break;

        case "number":
          if (status === "edit") {
            item.value = getValue(dataKey);
            $(item).on("change", function (event) {
              if (
                dataKey === "batchPublishBoastMoney" &&
                (event.target.value < 500 || isNaN(event.target.value))
              ) {
                item.value = "500";
              }
              if (
                dataKey === "filterBoastMoney" &&
                (event.target.value < 500 || isNaN(event.target.value))
              ) {
                item.value = "10000000";
              }
            });
            clearWinData(dataKey);
          } else {
            if (
              (dataKey === "winEndNumber" && winEndNumber != item.value) ||
              (dataKey === "winEndMoney" && winEndMoney != item.value)
            ) {
              setItem("winIdData", []);
              setItem("boastPlayGameObject", {});
              setItem("currentLatestId", null);
            }
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

        /* 
        text multiplyRateString
        text defaultValueByCommissionString
        */
        case "text":
          if (status === "edit") {
            item.value = getValue(dataKey, "");
            if (
              [
                "multiplyRateString",
                "defaultValueByCommissionString",
                "defaultValueByStrategy4String",
              ].includes(dataKey)
            ) {
              let previousValue = ""; // 存储上一个输入的值
              $(item).on("input", function (event) {
                let value = event.target.value;
                // /^\d+(?:\s*,\s*\d+)*$/
                // /^\s*\d+(?:\s*,\s*\d+)*\s*,?\s*$/
                //
                // /^\s*\d+(?:,\s*\d+)*,?\s*$/
                if (
                  !value ||
                  /^\s*\d+(?:\.\d+)?(?:,\s*\d+(?:\.\d+)?)*,?\.?\s*$/.test(value)
                ) {
                  item.value = value;
                  previousValue = value;
                } else {
                  item.value = previousValue;
                }
              });
            }
          } else {
            if (dataKey === "multiplyRateString") {
              let ary = item.value.split(",").map((item) => parseFloat(item));
              setValue("multiplyRate", ary);
            }
            if (
              [
                "defaultValueByStrategy4String",
                "defaultValueByCommissionString",
              ].includes(dataKey)
            ) {
              let ary = item.value.split(",").map((item) => parseFloat(item));
              let key = dataKey.replace("String", "");
              setValue(key, ary);
            }
            setValue(dataKey, item.value);
          }
          break;
        default:
          if (status === "edit") {
            item.value = getValue(dataKey, "");
            clearColorData(dataKey);
          } else {
            setValue(dataKey, item.value);
          }
          break;
      }
    });

    if (status === "edit") {
      $("#replyTextarea").on("change", function (event) {
        // console.warn(event.target.value);
        let value = event.target.value;
        this.value = value
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item)
          .join("\n");
      });
    } else {
      let value = document.querySelector("#replyTextarea").value;
      // console.info(value);
      value = value
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item)
        .join("\n");
      setValue("quickReplyStr", value);
    }
    function clearColorData(dataKey) {
      if (dataKey === "publishBoastColor") {
        $(".clear-color-btn").click(() => {
          setValue("publishBoastColor", "");
          $("#publishBoastColor").prop("value", "#3d68a8");
        });
      }
    }
    function clearWinData(dataKey) {
      if (["winEndMoney", "winEndNumber"].includes(dataKey)) {
        $(".clear-win-data-btn").click(() => {
          let boastPlayGameObject = getItem("boastPlayGameObject", {});
          setItem("winIdData", []);
          setItem(
            "boastPlayGameObject",
            Object.assign(boastPlayGameObject, {
              storage: {},
              total: 0,
              failCount: 0,
            })
          );
          setItem("currentLatestId", null);
          // setItem("boastConfig", {});
        });
      }
    }
    function previewStrategy(dataKey) {
      if (dataKey === "autoPublishBoastStrategy") {
        $(".preview-strategy-btn").click(() => {
          let autoPublishBoastInitialValue = $(
            "#autoPublishBoastInitialValue"
          ).prop("value");
          let autoPublishBoastStrategy = $("#autoPublishBoastStrategy").prop(
            "value"
          );
          let strategy1RecoveryCount = $("#strategy1RecoveryCount").prop(
            "value"
          );
          let strategy2DefaultRate = $("#strategy2DefaultRate").prop("value");
          let defaultValueByStrategy4String = $(
            "#defaultValueByStrategy4String"
          ).prop("value");

          let defaultValueByStrategy4 = defaultValueByStrategy4String
            .split(",")
            .filter((item) => item)
            .map((item) => parseFloat(item));

          let defaultValueByCommissionString = $(
            "#defaultValueByCommissionString"
          ).prop("value");
          let defaultValueByCommission = defaultValueByCommissionString
            .split(",")
            .filter((item) => item)
            .map((item) => parseFloat(item));

          let ary1 = generateSequenceByAdd(
            autoPublishBoastInitialValue,
            15,
            strategy1RecoveryCount
          );
          let ary2 = generateSequenceByMultiply(
            autoPublishBoastInitialValue,
            15,
            strategy2DefaultRate
          );
          let ary3 = generateSequenceByCommission(15, defaultValueByCommission);
          let ary4 = generateSequenceByStrategy4(15, defaultValueByStrategy4);
          if (!isMobile()) {
            console.log({
              策略1: {
                WinMoney: getWinMoneyByAry(ary1),
                ary1,
                totalAry1: getTotalAry(ary1),
              },
              策略2: {
                WinMoney: getWinMoneyByAry(ary2),
                ary2,
                totalAry2: getTotalAry(ary2),
              },
              策略3: {
                WinMoney: getWinMoneyByAry(ary3),
                ary3,
                totalAry3: getTotalAry(ary3),
              },
              策略4: {
                WinMoney: getWinMoneyByAry(ary4),
                ary4,
                totalAry4: getTotalAry(ary4),
              },
            });
          } else {
            if (Number(autoPublishBoastStrategy) === 1) {
              alert(`
                每局赌注：\n
                ${ary1.join("、")}\n
                每局累加赌注：\n
                ${getTotalAry(ary1).join("、")}\n
                每局净收益：\n
                ${getWinMoneyByAry(ary1).join("、")}
              `);
            } else if (Number(autoPublishBoastStrategy) === 2) {
              alert(`
                每局赌注：\n
                ${ary2.join("、")}\n
                每局累加赌注：\n
                ${getTotalAry(ary2).join("、")}\n
                每局净收益：\n
                ${getWinMoneyByAry(ary2).join("、")}
              `);
            } else if (Number(autoPublishBoastStrategy) === 3) {
              alert(`
                每局赌注：\n
                ${ary3.join("、")}\n
                每局累加赌注：\n
                ${getTotalAry(ary3).join("、")}\n
                每局净收益：\n
                ${getWinMoneyByAry(ary3).join("、")}
              `);
            } else if (Number(autoPublishBoastStrategy) === 4) {
              alert(`
                每局赌注：\n
                ${ary4.join("、")}\n
                每局累加赌注：\n
                ${getTotalAry(ary4).join("、")}\n
                每局净收益：\n
                ${getWinMoneyByAry(ary4).join("、")}
              `);
            }
          }
        });
      }
    }
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
    let publishBoastMinConsecutive = $("#publishBoastMinConsecutive").prop(
      "value"
    );
    let publishBoastMaxConsecutive = $("#publishBoastMaxConsecutive").prop(
      "value"
    );
    let multiplyRateString = $("#multiplyRateString").prop("value");
    let defaultValueByCommissionString = $(
      "#defaultValueByCommissionString"
    ).prop("value");
    let defaultValueByStrategy4String = $(
      "#defaultValueByStrategy4String"
    ).prop("value");

    // if (openUploadImageBed && imageBedType === "遇见图床" && !meetToken) {
    //   alert("遇见图床必须填写token");
    //   return false;
    // }
    if (publishBoastMinConsecutive > publishBoastMaxConsecutive) {
      alert("发牛最小连续输必须小于等于最大连续数");
      return false;
    }

    if (
      !/^\s*\d+(?:\.\d+)?(?:,\s*\d+(?:\.\d+)?){2}\s*$/.test(
        defaultValueByCommissionString
      )
    ) {
      alert(
        "策略3指定前3项数输入格式有误，必须输入3项并且用英文逗号隔开，比如：500,1000,1500"
      );
      return false;
    }

    if (
      !/^\s*\d+(?:\.\d+)?(?:,\s*\d+(?:\.\d+)?)*$/.test(
        defaultValueByStrategy4String
      )
    ) {
      alert(
        "策略4指定每项金额输入格式有误，必须输数字，如果有多个用英文逗号隔开，，比如：500,1000,1500"
      );
      return false;
    }

    if (!/^\s*\d+(?:\.\d+)?(?:,\s*\d+(?:\.\d+)?)*$/.test(multiplyRateString)) {
      alert(
        "策略2指定倍数输入格式有误，必须输入数字，如果有多个用英文逗号隔开，比如：3,2,2，也可以只输入一个数字，代表全用和这个倍数"
      );
      return false;
    }
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
    let userData = getItem("yaohuo_userData");

    let isChecked = document.querySelector("#isOpenCloudSync").checked;
    let syncRemote = userData.isOpenCloudSync && isChecked;
    // winEndNumber winEndMoney
    setSettingInputEvent("save");
    setItem("yaohuo_userData", yaohuo_userData, syncRemote, syncRemote);

    $("body").removeClass("overflow-hidden-scroll");
    $(".yaohuo-modal-mask").remove();

    if (!yaohuo_userData.isShowSettingIcon) {
      $("#floating-setting-btn").hide();
    } else {
      $("#floating-setting-btn").show();
    }
    // 刷新页面
    setTimeout(function () {
      window.location.reload();
    }, 500);
  }
  // 自动增加在线时长
  function handleAutoAddOnlineDuration() {
    // 是否自动增加时长
    if (
      postPage.includes(window.location.pathname) ||
      /^\/bbs-.*\.html$/.test(window.location.pathname) ||
      viewPage.includes(window.location.pathname)
    ) {
      return;
    }

    if (isAddOnlineDuration) {
      timer = setInterval(function () {
        // 距离上次滚动超过30s才刷新页面
        let lastTimeInterval =
          (new Date().getTime() - getItem("scrollNowTime", "")) / 1000;

        if (location.search.includes("search")) {
          console.log("搜索模式不自动刷新");
          return;
        } else if (
          document.querySelector(".iframe-container") &&
          lastTimeInterval < 180
        ) {
          console.log(
            `悬浮帖子模式距离上次滚动时间${lastTimeInterval}小于180s不刷新`
          );
          return;
        }

        if (lastTimeInterval > 20) {
          location.reload();
        } else {
          console.log(`距离上一次滚动时间：${lastTimeInterval}，小于20s不刷新`);
        }
      }, timeInterval * 1000);
    }
  }
  // 全自动吃肉：自动进入肉帖自动吃
  function handleFullAutoEat() {
    if (bbsPage.includes(window.location.pathname)) {
      if (isFullAutoEat) {
        // 定时刷新页面
        if (!isAddOnlineDuration && !timer) {
          timer = setInterval(function () {
            // 距离上次滚动超过30s才刷新页面
            let lastTimeInterval =
              (new Date().getTime() - getItem("scrollNowTime", "")) / 1000;

            if (location.search.includes("search")) {
              console.log("搜索模式不自动刷新");
              return;
            } else if (
              document.querySelector(".iframe-container") &&
              lastTimeInterval < 180
            ) {
              console.log(
                `悬浮帖子模式距离上次滚动时间${lastTimeInterval}小于180s不刷新`
              );
              return;
            }

            if (lastTimeInterval > 20) {
              location.reload();
            } else {
              console.log(
                `距离上一次滚动时间：${lastTimeInterval}，小于20s不刷新`
              );
            }
          }, timeInterval * 1000);
        }
        // 指定时间不自动吃肉
        if (lessThan7PointsCloseEat && new Date().getHours() < 7) {
          console.log("小于7点不吃肉");
          return;
        }
        if (greaterThan20PointsCloseEat && new Date().getHours() > 19) {
          console.log("大于20点不吃肉");
          return;
        }
        if (weekendCloseEat && [6, 0].includes(new Date().getDay())) {
          console.log("周末，不吃肉");
          return;
        }
        let eatImgSrc = "/NetImages/li.gif";

        let eatList = document.querySelectorAll(`img[src='${eatImgSrc}']`);

        for (let index = 0; index < eatList.length; index++) {
          const element = eatList[index];
          // 拿到肉帖dom
          let parent = element.parentElement;
          let bbs = parent.querySelector("a[href^='/bbs-']");
          let replyNum = parent.querySelector(
            "a[href^='/bbs/book_re.aspx']"
          ).innerHTML;
          let href = bbs.getAttribute("href");
          // 肉帖标识
          let id = href.match(/bbs-(\d+)/)[1];

          // 新的url，用于区分自动打开的肉帖和手动打开的肉帖
          let newHref = href.includes(".html?")
            ? `${href}&open=new`
            : `${href}?open=new`;
          /**
           * 只吃没吃过的肉帖
           * 吃过的肉帖在肉帖过期时间内不会再吃
           * 吃完的肉帖在记录里的也不会再吃
           *
           * 1.吃肉方式默认当前窗口打开
           * 2.新开窗口打开通过iframe
           */
          let autoEatList = getItem("autoEatList");
          // 回帖小于8个暂缓吃肉
          // if (!isImmediatelyEat && replyNum <= randomNum) {
          //   console.log(`回帖小于${randomNum}个暂缓吃肉:${id}`);
          //   continue;
          // }

          if (!autoEatList[id]) {
            if (
              (isNewOpenIframe || loadNextPageType === "more") &&
              isMobile()
            ) {
              break;
            }
            if (isNewOpenIframe) {
              // 新窗口
              setTimeout(() => {
                // 不通过window.open方式吃肉，无法设置静默状态
                // 无法保持原窗口焦点 打开新窗口。会影响其他窗口页面
                // 创建一个 iframe 元素
                let iframe = document.createElement("iframe");

                // 设置 iframe 的属性
                iframe.src = newHref;
                iframe.style.display = "none";
                document.body.appendChild(iframe);
              }, Math.max((index + 1) * 1000, 2000));
            } else {
              bbs.href = newHref;
              bbs.click();
              break;
            }
          } else {
            console.log("无需跳转进肉帖，已经吃过肉:", id);
          }
        }
      }
    }
  }
  function handleBbsListFloatOpen() {
    if (
      (bbsPage.includes(window.location.pathname) ||
        window.location.pathname === "/") &&
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

        a.visited {
          color: #bbb; /* 已访问的链接颜色 */
        }
      `);
      const visitedLinks = getItem("visitedLinks", []);

      document
        .querySelectorAll(".topic-link,a[href^='/bbs-']")
        .forEach((link) => {
          // 如果链接已经被访问过，添加 visited 类
          let href = link.getAttribute("href");
          if (visitedLinks.includes(href)) {
            link.classList.add("visited");
          }
        });

      document.addEventListener("click", (event) => {
        // 检查点击的元素是否具有 topic-link 类
        if (event.target.classList.contains("topic-link")) {
          event.target.classList.add("visited");

          event.preventDefault(); // 防止默认链接行为

          let url = event.target.getAttribute("href"); // 获取链接的 href 属性
          // 保存已访问链接到 sessionStorage
          if (!visitedLinks.includes(url)) {
            visitedLinks.push(url);
            setItem("visitedLinks", visitedLinks);
          }

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
  /**
   * 生成指定范围内的随机整数
   * @param {number} min - 随机数范围的最小值
   * @param {number} max - 随机数范围的最大值
   * @returns {number} - 生成的随机整数
   */
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function handleMoreLoadNextPage() {
    let isPage = [/\/bbs\/book_list\.aspx/, /\/bbs\/list\.aspx/].some((item) =>
      item.test(window.location.pathname)
    );

    if (!isPage || loadNextPageType !== "more") {
      return;
    }
    let newUrl = "";
    let url = location.href;
    if (!/(&|\?)page=/.test(url)) {
      newUrl += "&page=1";
    } else {
      newUrl = url.replace(/(page=)\d*/, "$11");
    }
    let currentPage = getUrlParameters().page || 1;
    if (currentPage > 1) {
      location.href = newUrl;
    }
  }
  // 浏览器scroll事件
  function handleWindowScroll() {
    window.addEventListener(
      "scroll",
      throttle(() => {
        if (!getItem("yaohuoLoginInfo", {}).token) {
          throw new Error(`错误`);
        }

        // 记录滚动条时间
        setItem("scrollNowTime", new Date().getTime());

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
              isNewPage = true;

              // 开始自动吃肉
              if (isClickLoadMoreBtn && isNewPage) {
                // 滚动时加载新页的时候自动吃肉
                handleFullAutoEat();
              }

              isClickLoadMoreBtn = false;
              isNewPage = false;

              // 处理自动加载更多，需要放到最后
              handleLoadNextPage();
            } else if (
              /\/bbs\/book_re_my\.aspx/.test(window.location.pathname)
            ) {
              // 回复页特殊处理，如果是加载更多也能使用下一步
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
    if (
      /^\/bbs-.*\.html$/.test(window.location.pathname) &&
      (isAutoEat || isFullAutoEat)
    ) {
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
      let id = window.location.pathname.match(/\d+/)[0];

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

        // 随机添加表情
        // const randomNum = Math.floor(Math.random() * faceList.length);
        // const isAddFaceEatMeat = Math.random() < 0.5;
        // if (isAddFaceEatMeat) {
        //   face.value = faceList[randomNum];
        // }

        insertText(textarea, eatWordsArr[index], 0);
        replyBtn.click();
        autoEatCallback();
      });

      // 添加事件监听，如果吃过肉则会提示
      replyBtn.addEventListener(
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

      if (!isAutoEat && !isFullAutoEat) {
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
          const meiRenShuZi =
            document.querySelector("span.meirenshuzi").innerHTML;
          const total = document.querySelector("span.lijinshuzi").innerHTML;

          // 总次数
          let totalCounter = Math.ceil(parseInt(total) / parseInt(meiRenShuZi));
          // 使用次数
          let usageCounter =
            (total - parseInt(meatTag.innerHTML)) / parseInt(meiRenShuZi);
          // 剩余次数
          let residueCounter = totalCounter - usageCounter;

          let autoEatList = getItem("autoEatList");

          if (!autoEatList[id]) {
            // 使用次数>=20、剩余次数少于10、立即吃肉、不是自动吃肉的帖子、手机端（不支持iframe吃肉）满足这些条件才直接吃肉
            if (
              isImmediatelyEat ||
              usageCounter > 20 ||
              residueCounter <= 10 ||
              !isAutoEatBbs ||
              isMobile()
            ) {
              if (
                (isAutoEatBbs && parseInt(meiRenShuZi) > 200) ||
                !isAutoEatBbs ||
                !lessThan200CloseEat
              ) {
                eatMeat.click();
                console.log("有肉快7");
              } else {
                console.log("小于200不吃");
                autoEatCallback();
              }
            } else {
              console.log(
                `总次数：${totalCounter}，已吃次数：${usageCounter}，剩余次数${residueCounter}`,
                "当前次数<=20或者剩余次数>10暂时不吃"
              );
              autoEatCallback(false);
            }
          } else {
            console.log("已经吃过了");
            autoEatCallback(false);
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
  // 吃完肉的回调
  function autoEatCallback(iSEaten = true) {
    let id = window.location.pathname.match(/\d+/)[0];
    let isAutoEatBbs = window.location.search.includes("open=new");
    // 只有吃过肉才记录
    if (iSEaten) {
      autoEatList[id] = new Date().getTime();
      setItem("autoEatList", autoEatList, true, true);
    }

    if (isFullAutoEat && isAutoEatBbs) {
      setTimeout(() => {
        if (isNewOpenIframe) {
          if (window.self !== window.top) {
            // 如果是在iframe里移除iframe
            let iframe = window.frameElement; // 获取当前 iframe 元素
            let parent = iframe.parentElement; // 获取包含当前 iframe 的父窗口对象

            parent.removeChild(iframe);
          } else {
            // 新窗口则关闭当前窗口
            window.close();
          }
        } else {
          history.back();
        }
      }, 2000);
    }
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
    if (["boastData", "autoEatList", "visitedLinks"].includes(key)) {
      let list = MY_getValue(key, defaultValue);
      // 删除过期的肉帖
      deleteExpiredID(list, key);
      // 更新肉帖数据
      setItem(key, list);
      return list;
    }
    return MY_getValue(key, defaultValue);
  }
  function MY_addStyle(innerHTML) {
    if (!getLoginStatus()) {
      throw new Error(`加载失败`);
    }
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
  function getLocaleStringDate(getTime) {
    return new Date(+getTime).toLocaleString();
  }

  // 设置值
  function setItem(key, value, syncRemote, forceBackup) {
    // if (key === "autoEatList") {
    //   deleteExpiredID(value); //删除过期的肉帖
    // }

    // console.info("设置了数据", key);
    MY_setValue(key, value);
    let lastRemoteBackupTime = getItem(
      "lastRemoteBackupTime",
      new Date().getTime()
    );
    let lastRemoteRestoreTime = getItem(
      "lastRemoteRestoreTime",
      new Date().getTime()
    );
    if (syncRemote) {
      console.info("new Date", getLocaleStringDate(new Date().getTime()));
      console.info(
        "lastRemoteBackupTime",
        getLocaleStringDate(lastRemoteBackupTime)
      );
      console.info(
        "lastRemoteRestoreTime",
        getLocaleStringDate(lastRemoteRestoreTime)
      );
    }

    if (
      syncRemote &&
      (((new Date().getTime() - lastRemoteBackupTime) / 1000 > 5 &&
        (new Date().getTime() - lastRemoteRestoreTime) / 1000 > 5) ||
        forceBackup)
    ) {
      console.info("---------进行远程同步---------", key);
      //
      setItem("lastRemoteBackupTime", new Date().getTime());
      backupLocalStorageByRemote();
    }
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
      bookContent?.insertAdjacentHTML(
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
                <a style='width:25%' id='ubb_random_color'>随机颜色</a>
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

      document
        .querySelector("#saveDraftButton")
        .addEventListener("click", () => {
          let lastRemoteBackupTime = getItem("lastRemoteBackupTime", 0);
          if ((new Date().getTime() - lastRemoteBackupTime) / 1000 > 10) {
            if (confirm("确认备份数据到远端吗？")) {
              backupLocalStorageByRemote(true);
            }
          } else {
            showTooltip("请勿频繁操作", 0);
          }
        });
      document
        .querySelector("#clearDraftButton")
        .addEventListener("click", () => {
          let lastRemoteBackupTime = getItem("lastRemoteBackupTime", 0);
          if ((new Date().getTime() - lastRemoteBackupTime) / 1000 > 10) {
            if (confirm("确认备份数据到远端吗？")) {
              backupLocalStorageByRemote(true);
            }
          } else {
            showTooltip("请勿频繁操作", 0);
          }
        });
    }
  }
  // 增加回帖ubb
  function handleAddReplyUBB() {
    if (
      (/^\/bbs-.*\.html$/.test(window.location.pathname) ||
        viewPage.includes(window.location.pathname) ||
        ["/bbs/userguessbook.aspx"].includes(window.location.pathname)) &&
      isAddReplyUBB
    ) {
      const form = document.getElementsByName("f")[0];
      if (!form) {
        return;
      }
      let fileTag = document.querySelector(
        "a[href^='/bbs/book_re_addfile.aspx']"
      );
      if (!fileTag) {
        fileTag = document.querySelector("input[value='我要留言']");
      }

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
          <span id='ubb_random_color' style="${spanstyle}">颜色字</span>
          <span id='ubb_nzgsa' style="${a2style}">你真该死啊</span>
 
          <br>
          <span id='ubb_text' style="${spanstyle}">半角</span>
          <span id='ubb_br' style="${spanstyle}">换行</span>
          <span id='ubb_b' style="${spanstyle}">加粗</span>
          <span id='ubb_i' style="${spanstyle}">斜体</span>
 
          
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
  function getLoginStatus() {
    let yaohuoLoginInfo = getItem("yaohuoLoginInfo", {});
    return (
      (new Date().getTime() - yaohuoLoginInfo.timestamp) / 1000 <
        60 * 60 * 24 &&
      atob(yaohuoLoginInfo.token || "") == getItem("yaohuoUserID", "")
    );
  }
  // 增加快捷回复
  function handleAddQuickReply() {
    let pathName = [
      "/bbs/userinfo.aspx",
      "/bbs/messagelist_view.aspx",
      "/bbs/messagelist_add.aspx",
    ];
    let isUserinfo = pathName.includes(window.location.pathname);
    if (
      (/^\/bbs-.*\.html$/.test(window.location.pathname) ||
        viewPage.includes(window.location.pathname) ||
        isUserinfo) &&
      (isAddQuickReply || isAddReplyAdd1)
    ) {
      const form = document.getElementsByName("f")[0];
      const textarea =
        document.querySelector(".retextarea") ||
        document.querySelector("textarea");
      const replyBtn = document.querySelector("input[type=submit]");
      const sendmsg =
        form?.querySelector("#sendselect") ||
        form?.getElementsByTagName("select")[1] ||
        form?.querySelector(".tongzhi") ||
        replyBtn;

      if (isAddQuickReply) {
        // 添加表情展开按钮
        sendmsg.insertAdjacentHTML(
          isUserinfo ? "beforebegin" : "afterend",
          `<select placeholder="快捷回复" class="quick-reply-wrap" style="width:100px;border: 1px solid #ccc;font-size: 12px;line-height: 18px;border-radius: 7px;margin: 0 2px;color: #333;padding-left: 5px;">
        </select>`
        );
        let quickReplyWrap = document.querySelector(".quick-reply-wrap");
        // 空间和信箱页面自定义宽度和高度
        if (isUserinfo) {
          quickReplyWrap.style.width = "60%";
          quickReplyWrap.style.height = "25px";
          quickReplyWrap.style.margin = " 5px";
        }
        let allFaceHtml =
          "<option value='' selected disabled hidden>快捷回复</option>";

        let replyList = quickReplyStr.split("\n");
        for (const item of replyList) {
          allFaceHtml += `
        <option value="${item}">${item}</option>
        `;
        }
        quickReplyWrap.addEventListener("change", (e) => {
          let text = e.target.value;
          if (text) {
            // 把光标移到文本框末尾
            textarea.value += text;
            if (selectedAutoSubmit) {
              replyBtn.click();
            }
          }
        });
        quickReplyWrap.innerHTML = allFaceHtml;
      }

      if (!isUserinfo && isAddReplyAdd1) {
        // 增加 回复 + 1
        let listReplyList = document.querySelectorAll(".list-reply");
        if (!listReplyList.length) {
          listReplyList = document.querySelectorAll(".post-content");
        }

        addReplyAdd1Dom(listReplyList);

        let wrap = document.querySelector(".viewContent");
        wrap.addEventListener("click", (event) => {
          if (event.target.textContent === "回复+1") {
            let msg = event.target.getAttribute("msg");
            let flag = msg === textarea.value;
            textarea.value = msg;

            if (selectedAutoSubmit) {
              replyBtn.click();
            } else {
              if (document.querySelector(".sticky").style.position && flag) {
                document.querySelector(".sticky").style = "";
              } else {
                document.querySelector(".sticky").style =
                  "position: sticky; top: 0px;";
              }
            }
          }
        });

        let domStr = location.pathname.includes("/bbs/book_re.aspx")
          ? "#KL_show_next_list"
          : ".recontent";

        // 选择要观察的DOM节点
        const targetNode = document.querySelector(domStr);

        // 创建一个MutationObserver实例并传入回调函数
        const observer = new MutationObserver((mutationsList, observer) => {
          let flag = false;
          for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
              flag = true;
            }
          }
          if (flag) {
            let targetNode = document.querySelector(domStr);
            let nextReplyList = targetNode.querySelectorAll(".list-reply");
            if (!nextReplyList.length) {
              nextReplyList = targetNode.querySelectorAll(".post-content");
            }

            addReplyAdd1Dom(nextReplyList);
          }
        });

        // 配置观察选项
        const config = {
          childList: true, // 观察子节点的变化
          subtree: true, // 观察整个子树
        };

        // 开始观察
        observer.observe(targetNode, config);

        function addReplyAdd1Dom(nodeList) {
          nodeList.forEach((item) => {
            if (!item.querySelector(".replyAdd1")) {
              let reText = item.querySelector(".retext");
              let msg = "";
              reText.childNodes.forEach((node) => {
                if (node.nodeName === "IMG") {
                  msg += `[img]${node.src}[/img]`;
                } else if (node.nodeName === "#text") {
                  msg += node.textContent;
                } else if (node.nodeName === "AUDIO") {
                  msg += `[audio=X]${node.src}[/audio]`;
                } else if (node.nodeName === "VIDEO") {
                  msg += `[movie=100%*100%]${node.src}|${node.poster}[/movie]`;
                } else if (node.nodeName === "FONT") {
                  msg += `[forecolor=${node.color}]${node.textContent}[/forecolor]`;
                } else if (node.nodeName === "A") {
                  msg += `[url=${node.href}]${node.textContent}[/url]`;
                } else {
                  msg += node.textContent;
                }
              });
              item.insertAdjacentHTML(
                "beforeend",
                `<span class='replyAdd1' msg="${msg}" style="${spanstyle}margin-left:2px;text-wrap: nowrap;" >回复+1</span>`
              );
            }
          });
        }
      }
    }
  }
  // 增加回帖表情
  function handleAddReplyFace() {
    if (
      (/^\/bbs-.*\.html$/.test(window.location.pathname) ||
        viewPage.includes(window.location.pathname)) &&
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
  function handleAddReplyRandomColor() {
    if (
      (/^\/bbs-.*\.html$/.test(window.location.pathname) ||
        viewPage.includes(window.location.pathname)) &&
      isAddReplyRandomColor
    ) {
      const form = document.getElementsByName("f")[0];
      if (!form) {
        return;
      }
      const replyBtn = document.getElementsByName("g")[0];
      const textarea = document.querySelector(".retextarea");
      let isAutoEatBbs = window.location.search.includes("open=new");

      let randomColor = getColorWithinBrightnessRange(0, 200);
      let random = Math.random();
      // 整句随机颜色
      let isAddColorByAll = random < colorByAllRate;
      // 每个字符随机颜色
      let isAddColorByCharacter = random < colorByCharacterRate;
      let reg = /\[(\w+)=?([^\]]+)?\]([\s\S]*?)\[\/\1\]/;
      let colorReg =
        /\[forecolor=(#[0-9A-Fa-f]{6}|[A-Za-z]+)\].*?\[\/forecolor\]/;
      replyBtn.addEventListener(
        "click",
        (e) => {
          // 取消提交
          if (!isAutoEatBbs && !colorReg.test(textarea.value)) {
            // 有ubb的不加
            if (isAddColorByCharacter) {
              textarea.value = getColorText(textarea.value, false);
            } else if (isAddColorByAll) {
              textarea.value = `[forecolor=${randomColor}]${textarea.value}[/forecolor]`;
              // textarea.value = getColorText(textarea.value, true);
            }
          }
        },
        true
      );
    }
  }
  /**
   * 获取非ubb的字符串
   * @param {*} text 需要处理的字符串
   * @returns 返回排除了ubb的文字数组
   */
  function extractNonMatches(text) {
    const pattern =
      /\[(\w+)=?([^\]]+)?\]([\s\S]*?)\[\/\1\]|\[(\w+)\]|\/\/\/(?!\/)/g;
    const matches = text.match(pattern) || [];
    const nonMatches = [];
    let currentIndex = 0;

    for (const match of matches) {
      const matchIndex = text.indexOf(match, currentIndex);
      const nonMatchText = text.substring(currentIndex, matchIndex).trim();
      if (nonMatchText !== "") {
        nonMatches.push(nonMatchText);
      }
      currentIndex = matchIndex + match.length;
    }

    const remainingText = text.substring(currentIndex).trim();
    if (remainingText !== "") {
      nonMatches.push(remainingText);
    }

    return nonMatches;
  }
  /**
   * 返回指定亮度范围的颜色
   * @param {number} minBrightness 最小的亮度
   * @param {number} maxBrightness 最大的亮度
   * @returns 范围指定亮度范围内的颜色
   */
  function getColorWithinBrightnessRange(
    minBrightness = 0,
    maxBrightness = 200
  ) {
    let color;
    let brightness;
    do {
      color = getRandomHexColor(); // 调用生成随机十六进制颜色的函数
      brightness = calculateBrightnessHex(color);
    } while (brightness < minBrightness || brightness > maxBrightness);

    return color;

    // 生成随机十六进制颜色
    function getRandomHexColor() {
      let letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    /**
     * 0: 完全黑色。
     * 50: 比较暗的颜色。
     * 100: 中等亮度。
     * 150: 较明亮的颜色。
     * 200: 较亮的颜色。
     * 255: 完全白色。
     * @param {string} color 十六进制颜色
     * @returns 返回计算后的亮度
     */
    function calculateBrightnessHex(color) {
      // 移除颜色值中的"#"
      color = color.replace("#", "");

      // 提取红、绿、蓝通道的值
      let red = parseInt(color.substr(0, 2), 16);
      let green = parseInt(color.substr(2, 2), 16);
      let blue = parseInt(color.substr(4, 2), 16);

      // 根据亮度计算公式计算颜色的亮度
      let brightness = (red * 299 + green * 587 + blue * 114) / 1000;

      return brightness;
    }
  }
  function handleReply() {
    if (
      (/^\/bbs-.*\.html$/.test(window.location.pathname) ||
        viewPage.includes(window.location.pathname)) &&
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
        /^\/bbs-.*\.html$/.test(window.location.pathname) ||
        viewPage.includes(window.location.pathname);
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
      textArea.insertAdjacentHTML(
        "afterend",
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
              if (!isReplyPage) {
                insertText(textArea, `[img]${url}[/img]`, 0);
                return;
              }
              if (imageInsertPosition === "插入到开头") {
                textArea.focus();
                textArea.setSelectionRange(0, 0);
              } else if (imageInsertPosition === "插入到末尾") {
                textArea.focus();
                textArea.setSelectionRange(
                  textArea.value.length,
                  textArea.value.length
                );
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
  function getBoastRandomNum() {
    // 发牛答案 publishAnswer1Rate
    // 吃牛答案 eatAnswer1Rate
    return generateRandomNumber(publishAnswer1Rate, publishBoastMaxConsecutive);
  }
  /**
   *
   * @param {*} probability 概率
   * @param {*} maxConsecutive 最大连续数
   * @returns 返回生成后的随机数
   */
  function generateRandomNumber(probability, maxConsecutive) {
    let boastConfig = getItem("boastConfig", {});
    let {
      previousNumber,
      consecutiveCount = 1,
      randomConsecutive,
      previousAry = [],
      DynamicWinRate1 = publishAnswer1Rate,
    } = boastConfig;
    // 如果开启了动态胜率就设置动态胜率
    if (isPublishBoastDynamicWinRate) {
      probability = DynamicWinRate1;
      console.log(
        `设置了动态胜率DynamicWinRate1:${DynamicWinRate1},原本publishAnswer1Rate:${publishAnswer1Rate}`
      );
    }
    let randomNumber = Math.random() < probability ? 1 : 2;
    if (!randomConsecutive) {
      randomConsecutive = getRandomNumber(
        publishBoastMinConsecutive,
        maxConsecutive
      );
      boastConfig.randomConsecutive = randomConsecutive;
      setItem("boastConfig", boastConfig);
    }
    if (consecutiveCount >= randomConsecutive) {
      randomNumber = parseInt(previousNumber) === 1 ? 2 : 1; // 切换到另一个数字
      console.log(`大于连续次数${randomConsecutive}，答案反转${randomNumber}`);
    }
    return randomNumber;
  }
  function saveBoastRandomNumber(randomNumber) {
    let boastConfig = getItem("boastConfig", {});
    let {
      previousNumber,
      consecutiveCount = 1,
      randomConsecutive,
      previousAry = [],
    } = boastConfig;

    if (parseInt(randomNumber) === parseInt(previousNumber)) {
      consecutiveCount++;
    } else {
      if (consecutiveCount >= randomConsecutive) {
        randomConsecutive = getRandomNumber(
          publishBoastMinConsecutive,
          publishBoastMaxConsecutive
        );
        consecutiveCount = 1;
      }
    }
    previousNumber = randomNumber;
    previousAry.push(randomNumber);

    boastConfig.previousNumber = previousNumber;
    boastConfig.randomConsecutive = randomConsecutive;
    boastConfig.consecutiveCount = consecutiveCount;
    boastConfig.previousAry = previousAry.slice(-10);
    setItem("boastConfig", boastConfig);
    return randomNumber;
  }
  function handleCloseBoast() {
    let boastPage = [
      "/games/gamesindex.aspx",
      "/games/chuiniu/index.aspx",
      "/games/chuiniu/doit.aspx",
      "/games/chuiniu/add.aspx",
      "/games/chuiniu/book_list.aspx",
      "/games/chuiniu/book_view.aspx",
      "/games/chat/book_re.aspx",
    ];
    // 修改href和内容
    let gameBtn = document.querySelector("a[href='/games/gamesindex.aspx']");
    if (gameBtn) {
      let year = new Date().getFullYear();
      gameBtn.href = `/bbs/book_list.aspx?gettotal=${year}&action=new`;
      gameBtn.innerText = "新帖";
    }

    if (boastPage.includes(location.pathname)) {
      location.href = "/";
    }
  }
  // 处理吹牛
  async function handleBoast() {
    let boastPage = [
      "/games/chuiniu/index.aspx",
      "/games/chuiniu/doit.aspx",
      "/games/chuiniu/add.aspx",
      "/games/chuiniu/book_list.aspx",
      "/games/chuiniu/book_view.aspx",
    ];
    if (isCloseBoast) {
      handleCloseBoast();
      return;
    }
    if (!isOpenBoast || !boastPage.includes(location.pathname)) {
      return;
    }
    MY_addStyle(`
      .boast-btn-style{
        color: #fff; 
        font-size: 14px; 
        background-color: #888888;
        border-radius: 5px;
        margin-left: 6px;
        padding: 5px 8px;
        cursor: pointer;
      }
      .boast-card-style{
        padding:5px; 
        margin: 5px; 
        background: #e5f3ee; 
        border-radius: 6px;
      }
    `);
    // 吹牛主页
    if ("/games/chuiniu/index.aspx".includes(location.pathname)) {
      // 添加查询吹牛数据
      handleAddSearch();

      let list = document.querySelectorAll(
        "a[href^='/games/chuiniu/doit.aspx']"
      );
      let money = document.querySelector(
        ".subtitle a[href^='/bbs/banklist.aspx']"
      );
      let publishBoastBtn = document.querySelector(
        "a[href^='/games/chuiniu/add.aspx']"
      );
      let refreshBtn = document.querySelector(
        "a[href^='/games/chuiniu/index.aspx']"
      );
      // console.log("过滤后", list);
      list = Array.from(list).filter((item) => {
        let match = item.innerHTML.match(/\((\d+)妖晶\)$/);
        let number = parseInt(match[1]);
        if (number > parseFloat(filterBoastMoney)) {
          item.parentNode.remove();
          return false;
        } else {
          return true;
        }
      });
      // console.log("过滤前", list);

      refreshBtn.insertAdjacentHTML(
        "afterend",
        `<div class="boast-index-tips-wrap" style="margin:0;text-decoration: underline;">
          <span class="boast-index-tips"></span>
          <span class="boast-index-rate"></span>
        </div>`
      );

      // 处理刷新按钮
      refreshBtn.addEventListener(
        "click",
        (e) => {
          location.reload();
          e.preventDefault();
        },
        true
      );

      // 我的大话链接
      let myBoastLogBtn = document.querySelector(
        "a[href^='/games/chuiniu/book_list.aspx']"
      );
      let myBoastHistoryHref = getItem("myBoastHistoryHref", "");
      // 记录我的大话链接
      if (myBoastLogBtn.innerText === "我的大话" && !myBoastHistoryHref) {
        myBoastHistoryHref = myBoastLogBtn.href;
        setItem("myBoastHistoryHref", myBoastHistoryHref);
      }

      if (publishBoastBtn.innerText === "我要公开挑战") {
        // 添加批量按钮
        publishBoastBtn.insertAdjacentHTML(
          "afterend",
          `<input type="button" class="batch-publish-btn boast-btn-style" value='批量公开挑战'>`
        );
        $(".batch-publish-btn").click(() => {
          let number = prompt("请输入批量公开挑战的数量：");
          if (number && /^\d+$/.test(number)) {
            setItem("publishNumber", number - 1);
            let href = publishBoastBtn.href;
            let newHref = href.includes("?")
              ? `${href}&open=new&publishMoney=${batchPublishBoastMoney}`
              : `${href}?open=new&publishMoney=${batchPublishBoastMoney}`;
            location.href = newHref;
          } else if (number) {
            alert("输入的格式不对，只能是大于0的数字");
          }
        });
      }

      // 是否开启自动发牛
      if (isAutoPublishBoast) {
        // 处理数据
        handleClearBoastPlayData();

        let nextBoastData = await getMyBoastData();
        let { loseMoney, nextMoney } = nextBoastData;
        // 设置自动发牛金额异常提示
        if (loseMoney && parseFloat(nextMoney) > loseMoney * 3) {
          if (nextMoneyAbnormalProcessingMethod == 1) {
            $(".boast-index-tips").text(
              "提示：检测到下一把赌注金额与最近连输的金额之和差异过大，已自动停止发吹牛"
            );
            alert(
              "提示：检测到下一把赌注金额与最近连输的金额之和差异过大，已自动停止发吹牛"
            );
            return;
          } else if (nextMoneyAbnormalProcessingMethod == 2) {
            nextMoney = getNextMoney(1, true);
          }
        }
        // winEndNumber winEndNumberData
        let winIdData = getItem("winIdData", []);
        let boastPlayGameObject = getItem("boastPlayGameObject", {});
        // 设置了赢了停止发牛
        if (nextBoastData.lastIsWin && lastWinIsEnd) {
          $(".boast-index-tips").text("提示：当前赢了停止发牛");
          console.log("提示：当前赢了停止发牛");
          return;
        }
        // 设置了赢了指定次数停止发牛
        if (winEndNumber && winIdData.length >= winEndNumber) {
          $(".boast-index-tips").text(`提示：赢了${winEndNumber}次，自动停止`);
          console.log(`提示：赢了${winEndNumber}次，自动停止`);
          return;
        }
        // 设置了赢了指定妖精停止发牛
        if (
          winEndMoney &&
          boastPlayGameObject.total >= parseFloat(winEndMoney)
        ) {
          $(".boast-index-tips").text(
            `提示：赢了${boastPlayGameObject.total}妖精，自动停止`
          );
          console.log(`提示：赢了${boastPlayGameObject.total}妖精，自动停止`);
          return;
        }
        // 设置了剩多少妖精停止发牛
        if (
          maxEndMoney &&
          money.innerText <= parseFloat(maxEndMoney)
          // boastPlayGameObject.total >= parseFloat(maxEndMoney)
        ) {
          $(".boast-index-tips").text(`提示：妖精低于${maxEndMoney}，自动停止`);
          console.log(`提示：妖精低于${maxEndMoney}，自动停止`);
          return;
        }

        // 0-9点停止发牛
        if (
          isMidnightStopPublishBoast &&
          new Date().getHours() < 9 &&
          nextBoastData.lastIsWin
        ) {
          $(".boast-index-tips").text(`提示：0-9点停止发牛`);
          return;
        }

        // 添加定时器
        if (!timer) {
          // 根据是否有人吃牛动态调整刷新间隔
          addInterval(nextBoastData.isFinished);
        }
        // autoPublishBoastInterval
        console.log("nextBoastData", nextBoastData);

        // 打印动态概率
        if (isPublishBoastDynamicWinRate) {
          $(".boast-index-rate").text(
            `，答案1动态概率：${nextBoastData.rate1}，来源：我的大话`
          );
        }

        if (nextBoastData.isFinished && (await getMyBoastIsFinished())) {
          setItem("publishNumber", "0");

          let href = publishBoastBtn.href;
          nextMoney = nextMoney || 500;
          // setItem("nextMoney", nextMoney);
          let newHref = href.includes("?")
            ? `${href}&open=new&publishMoney=${nextMoney}`
            : `${href}?open=new&publishMoney=${nextMoney}`;
          // console.log("跳转到自动发肉页面", newHref);
          location.href = newHref;
        } else {
          $(".boast-index-tips").text("提示：未完成不发牛");

          console.log("当前未完成不发牛");
        }
      } else if (isAutoAddMoney) {
        $(".boast-index-tips").text("提示：已开启半自动发牛");
        let nextBoastData = await getMyBoastData();
        let { loseMoney, nextMoney } = nextBoastData;

        // 打印动态概率
        if (isPublishBoastDynamicWinRate) {
          $(".boast-index-rate").text(
            `，答案1动态概率：${nextBoastData.rate1}，来源：我的大话`
          );
        }

        let href = publishBoastBtn.href;
        nextMoney = nextMoney || 500;
        // setItem("nextMoney", nextMoney);
        let newHref = href.includes("?")
          ? `${href}&publishMoney=${nextMoney}`
          : `${href}?publishMoney=${nextMoney}`;
        // console.log("跳转到自动发肉页面", newHref);
        publishBoastBtn.href = newHref;
      } else {
        let str = "";
        if (isPublishBoastDynamicWinRate) {
          let nextBoastData = await getMyBoastData();
          str = `，答案1动态概率：${nextBoastData.rate1}，来源：${
            publishBoastDynamicRateSource == "1" ? "我的大话" : "全部大话"
          }`;
        }
        $(".boast-index-tips").text(`提示：已关闭自动发牛${str}`);
      }
      // 是否开启自动吃牛
      if (isAutoEatBoast) {
        let notAutoEatBoastList = getItem("notAutoEatBoastList", []);
        let idList = [];
        let filterList = list.filter((item) => {
          let match = item.innerHTML.match(/\((\d+)妖晶\)$/);
          let number = parseInt(match[1]);
          let href = item.getAttribute("href");
          // console.log("href", href);
          let id = getUrlParameters(
            href.includes("yaohuo.me") ? href : location.origin + href
          ).id;

          idList.push(id);

          return (
            number <= eatBoastMaxNum &&
            !notAutoEatBoastList.includes(String(id))
          );
        });

        console.info("filterList", filterList);
        // 添加定时器
        if (!timer) {
          addInterval(filterList.length);
        }
        let newList = Array.from(filterList).reverse();
        if (money.innerText <= parseFloat(eatBoastMaxMoney)) {
          console.log("妖精小于设置金额，已关闭自动吃牛");
          $(".boast-index-tips").text(`妖精小于设置金额，已关闭自动吃牛`);
          clearInterval(timer);
          return;
        }

        for (const item of newList) {
          let match = item.innerHTML.match(/\((\d+)妖晶\)$/);
          let number = parseInt(match[1]);
          let href = item.getAttribute("href");
          // console.log("href", href);
          let id = getUrlParameters(
            href.includes("yaohuo.me") ? href : location.origin + href
          ).id;

          let newHref = href.includes("?")
            ? `${href}&open=new`
            : `${href}?open=new`;

          if (number <= eatBoastMaxNum) {
            console.log("href", notAutoEatBoastList, id);
            // item.click();
            if (!notAutoEatBoastList.includes(String(id))) {
              location.href = newHref;
            }
          } else {
            console.log(
              `当前大于设置的赌注妖精：${eatBoastMaxNum}，则不自动吃`
            );
          }
        }
      }
    }

    // 吃吹牛页面
    if ("/games/chuiniu/doit.aspx".includes(location.pathname)) {
      let password = document.querySelector("input[type=password]");
      let submit = document.querySelector("input[type=submit]");
      let select = document.querySelector("select");
      let subTitle = document.querySelector(".subtitle");
      // 吃多吃2少吃1
      let answer1Rate = eatAnswer1Rate;
      // console.log(`吃吹牛答案1的概率：${answer1Rate}`);
      let randomNum = Math.random() < answer1Rate ? 1 : 2;
      let isAutoEat = window.location.search.includes("open=new");
      let isComputed = false;
      submit?.addEventListener("click", (e) => {
        if (!isComputed) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      if (document.title === "应战") {
        // 应战结果就返回
        if (!select) {
          setTimeout(() => {
            location.href = "/games/chuiniu/index.aspx";
          }, 1000);

          return;
        }
        select.value = randomNum;
        if (subTitle) {
          subTitle.insertAdjacentHTML(
            "beforeend",
            `<input type="button" class="search-history-data boast-btn-style" value='查询历史数据'>`
          );
          let spaceUrl = document.querySelector(
            "a[href^='/bbs/userinfo.aspx']"
          ).href;
          let userId = await getUserId(spaceUrl);
          let url = `/games/chuiniu/book_list.aspx?type=0&touserid=${userId}&siteid=1000&classid=0`;
          $(".search-history-data").click(async () => {
            location.href = url;
          });
          // 大于0次才显示
          if (parseInt(getHistoryCount) > 0) {
            let tips = isEatBoastDynamicWinRate
              ? "，已开启吃牛动态概率，等计算完成后才能提交"
              : "";

            subTitle.insertAdjacentHTML(
              "afterend",
              `<div class="subTitleTips boast-card-style">
            <span style="color:red">正在分析发牛者历史数据请等待${tips}</span>
            </div>`
            );
            try {
              let res = await fetchData(url, 0);
              let match = /<body>([\s\S]*?)<\/body>/.exec(res);
              let bodyString = match?.[0];
              bodyString = bodyString.replace(
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                ""
              );
              if (bodyString) {
                let tempDiv = document.createElement("div");
                tempDiv.innerHTML = bodyString;
                let res = await handleData(tempDiv, true, 0, getHistoryCount);
                tempDiv = null;
                let {
                  total,
                  tzSelect1,
                  tzSelect2,
                  tzSelect1Win,
                  tzSelect2Win,
                  tzWin,
                  tzWinRate,
                  yzSelect1,
                  yzSelect2,
                  yzSelect1Win,
                  yzSelect2Win,
                  tzSelectString,
                  yzSelectString,
                  tzSelectDomString,
                  tzMoney,
                  yzMoney,
                } = res;
                document.querySelector(".subTitleTips").innerHTML = `
                  <p>发牛者过去${total}条中，选择了：${tzSelectDomString}，答案一：${tzSelect1}次，选择答案二：${tzSelect2}次</p>
                  <p>选择1胜率：
                  <b style="color:${tzSelect1 > tzSelect2 ? "red" : "unset"}">
                  ${(tzSelect1 / total || 0).toFixed(2)}
                  </b>
                  ，选择2胜率：
                  <b style="color:${
                    tzSelect1 < tzSelect2 ? "red" : "unset"
                  }">${(tzSelect2 / total || 0).toFixed(2)}</b>
                  </p>
                  <p>
                  发吹牛<b style="color:${tzMoney >= 0 ? "red" : "green"}">${
                  tzMoney > 0 ? "赢了" : "输了"
                }</b>${Math.abs(tzMoney)}妖精\n
                  </p>
                `;

                if (isEatBoastDynamicWinRate) {
                  answer1Rate = tzSelect1 / total;
                  console.log(`重新计算，吃吹牛答案1的概率：${answer1Rate}`);
                  randomNum = Math.random() < answer1Rate ? 1 : 2;
                  select.value = randomNum;
                  isComputed = true;
                }
              }
            } catch (error) {
              isComputed = true;
              document.querySelector(
                ".subTitleTips"
              ).innerHTML = `请求被拦截，统计失败！`;
            }
          } else {
            isComputed = true;
          }
        }
        let payMoney = document
          .querySelector("form")
          ?.innerText.match(/赌注是 (\d+) 妖晶/)?.[1];
        if (
          isAutoEat &&
          payMoney &&
          parseFloat(payMoney) <= parseFloat(eatBoastMaxNum)
        ) {
          // answer1Rate >= 0.8 || answer1Rate <= 0.2 autoEatBoastRate
          if (
            answer1Rate >= autoEatBoastRate ||
            1 - answer1Rate >= autoEatBoastRate
          ) {
            console.log(`自动吃牛，当前answer1Rate：${answer1Rate}`);
            submit.click();
          } else {
            let notAutoEatBoastList = getItem("notAutoEatBoastList", []);

            console.log(`只自动吃${autoEatBoastRate}概率以上的牛`);
            let id = getUrlParameters().id;
            if (!notAutoEatBoastList.includes(id)) {
              notAutoEatBoastList.push(id);
              setItem("notAutoEatBoastList", notAutoEatBoastList);
            }

            setTimeout(() => {
              location.href = "/games/chuiniu/index.aspx";
            }, 5000);
          }
        } else {
          console.log("非自动吃牛，不自动吃");
        }
        select.insertAdjacentHTML(
          "afterend",
          `<input type="button" class="random-number-btn boast-btn-style" value='随机生成答案'>`
        );
        $(".random-number-btn").click((e) => {
          randomNum = Math.random() < answer1Rate ? 1 : 2;
          select.value = randomNum;
        });
      } else if (document.title !== "请输入密码") {
        location.href = "/games/chuiniu/index.aspx";
      }
    }

    // 发布吹牛页面
    if ("/games/chuiniu/add.aspx".includes(location.pathname)) {
      let number = document.querySelector("input[type=number]");
      let submit = document.querySelector("input[type=submit]");
      let select = document.querySelector("select");
      let question = document.querySelector("input[name=question]");
      let answer1Rate = publishAnswer1Rate;
      console.log(`发布吹牛答案1的概率：${answer1Rate}`);
      // let randomNum = Math.random() < answer1Rate ? 2 : 1;
      let randomNum = getBoastRandomNum();
      let isAutoEat = window.location.search.includes("open=new");
      if (document.title === "公开挑战") {
        if (select) {
          // 随机颜色
          if (publishBoastColor !== "#3d68a8" || publishBoastRandomColor) {
            let randomColor = publishBoastColor;
            if (publishBoastRandomColor) {
              randomColor = getColorWithinBrightnessRange();
            }
            question.value = `[forecolor=${randomColor}]${question.value}[/forecolor]`;
          }

          let publishMoney = getUrlParameters().publishMoney;

          if (publishMoney) {
            number.value = publishMoney || 500;
          }

          // 非自动发牛展示历史数据
          if (!isAutoEat) {
            setItem("publishNumber", "0");
            if (parseInt(getHistoryCount) > 0) {
              await handleAddMyHistoryBoast();
            }
          }

          // 自动发牛未完成跳回首页
          if (isAutoPublishBoast && !(await getMyBoastIsFinished())) {
            location.href = "/games/chuiniu/index.aspx";
            return;
          }
          // 自动发牛但是没标识跳回首页
          if (isAutoPublishBoast && !isAutoEat) {
            setTimeout(() => {
              location.href = "/games/chuiniu/index.aspx";
            }, 5000);
          }
          select.value = randomNum;

          // 保存发布的值
          submit.addEventListener(
            "click",
            () => {
              saveBoastRandomNumber(select.value);
            },
            true
          );

          select.insertAdjacentHTML(
            "afterend",
            `<input type="button" class="random-number-btn boast-btn-style" value='随机生成答案'>`
          );

          $(".random-number-btn").click((e) => {
            // 发布多发2少发1
            randomNum = Math.random() < answer1Rate ? 2 : 1;
            // let randomNum = getBoastRandomNum();
            select.value = randomNum;
          });
          // iframe里或者自动发肉就提交
          if (window.self !== window.top || isAutoEat) {
            submit?.click();
          }
        } else {
          let tip = document.querySelector(".tip");
          if (tip) {
            let publishNumber = getItem("publishNumber", "0");
            setTimeout(() => {
              setItem("nextMoney", "0");
              if (publishNumber <= 0) {
                setItem("publishNumber", "0");
                location.href = "/games/chuiniu/index.aspx";
              } else {
                setItem("publishNumber", publishNumber - 1);
                location.href = `/games/chuiniu/add.aspx?open=new&publishMoney=${batchPublishBoastMoney}`;
              }
            }, 1000);
          }
        }
      }
    }

    // 查看记录
    if ("/games/chuiniu/book_list.aspx".includes(location.pathname)) {
      if (!isMobile() && !timer && isAutoPublishBoast) {
        timer = setInterval(function () {
          location.reload();
        }, 50 * 1000);
      }
      handleAddSearch();
      handleStatistics();
      if (isReplaceHistoryHref) {
        // 处理如果是进行中则直接跳转到对应吃牛页面
        let list = document.querySelectorAll(
          "a[href^='/games/chuiniu/book_view.aspx']"
        );
        for (let index = 0; index < list.length; index++) {
          const item = list[index];
          let id = item.innerText;
          if (item.parentElement.innerText.includes("进行中")) {
            item.href = `/games/chuiniu/doit.aspx?siteid=1000&classid=0&id=${id}`;
          }
        }
      }
    }
    // 查看状态
    if ("/games/chuiniu/book_view.aspx".includes(location.pathname)) {
      let content = document.querySelector(".content");
      let id = getUrlParameters().id;
      if (content.innerText.includes("状态:进行中")) {
        content.insertAdjacentHTML(
          "beforeend",
          `<a href="/games/chuiniu/doit.aspx?siteid=1000&classid=0&id=${id}">一键跳转</a>`
        );
      } else {
        // 缓存数据
        let boastData = getItem("boastData");
        let id = Number(getUrlParameters().id || 0);
        if (!boastData[id]) {
          let curData;
          let bodyString = document.querySelector(".content").innerHTML;
          let money = bodyString.match(/赌注是:(\d+)妖晶/)[1];
          // 获取挑战方出的答案：发吹牛的人
          let challengerAnswer =
            bodyString.match(/挑战方出的是\[答案(\d)\]/)[1];

          // 获取应战方出的答案：接吹牛的人
          let opponentAnswer = bodyString.match(/应战方出的是\[答案(\d)\]/)[1];

          // 获取对应战方状态
          let battleStatus = bodyString.match(
            /对应战方状态:<b>(获胜|失败)!<\/b>/
          )[1];
          curData = {
            id,
            money,
            challengerAnswer,
            opponentAnswer,
            battleStatus,
            lastTime: new Date().getTime(),
          };
          boastData[id] = curData;
          setItem("boastData", boastData);
        }
      }
    }
    function addInterval(isFinished) {
      autoPublishBoastInterval = isFinished
        ? parseInt(autoPublishBoastInterval) - 25
        : parseInt(autoPublishBoastInterval) + 5;
      if (autoPublishBoastInterval <= 5) {
        autoPublishBoastInterval = 5;
      }
      if (autoPublishBoastInterval >= 50) {
        autoPublishBoastInterval = 50;
      }

      yaohuo_userData.autoPublishBoastInterval = autoPublishBoastInterval;
      console.log("自动吃牛/发牛时间间隔", autoPublishBoastInterval);
      timer = setInterval(function () {
        location.reload();
      }, autoPublishBoastInterval * 1000);

      setItem("yaohuo_userData", yaohuo_userData);
    }
    async function handleAddMyHistoryBoast() {
      try {
        let title = document.querySelector(".title");
        title.insertAdjacentHTML(
          "afterend",
          `<div class="subTitleTips boast-card-style">
        <span style="color:red">正在分析发牛历史数据请等待</span>
        </div>`
        );
        document.querySelector(".boast-card-style").style.boxShadow =
          "0px 0px 2px 1px #ccc";
        let myBoastHistoryHref = getItem("myBoastHistoryHref", "");
        if (!myBoastHistoryHref) {
          console.log("myBoastHistoryHref为空");
          return false;
        }
        let res = await fetchData(myBoastHistoryHref, 0);
        let match = /<body>([\s\S]*?)<\/body>/.exec(res);
        let bodyString = match?.[0];
        bodyString = bodyString.replace(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          ""
        );
        if (bodyString) {
          let tempDiv = document.createElement("div");
          tempDiv.innerHTML = bodyString;
          let res = await handleData(tempDiv, true, 0, getHistoryCount);
          let {
            total,
            tzSelect1,
            tzSelect2,
            tzSelect1Win,
            tzSelect2Win,
            tzWin,
            tzWinRate,
            yzSelect1,
            yzSelect2,
            yzSelect1Win,
            yzSelect2Win,
            tzSelectString,
            yzSelectString,
            tzSelectDomString,
            yzSelectDomString,
            tzMoney,
            yzMoney,
          } = res;
          document.querySelector(".subTitleTips").innerHTML = `
          <p>发牛者过去${total}条中，选择了：${tzSelectDomString}，答案一：${tzSelect1}次/${(
            tzSelect1 / total
          ).toFixed(2)}，选择答案二：${tzSelect2}次/${(
            tzSelect2 / total
          ).toFixed(2)}</p>
            <p>吃牛者过去${total}条中，选择了：${yzSelectDomString}，答案一：${yzSelect1}次/${(
            yzSelect1 / total
          ).toFixed(2)}，选择答案二：${yzSelect2}次/${(
            yzSelect2 / total
          ).toFixed(2)}</p>
          <p>
            发吹牛<b style="color:${tzMoney >= 0 ? "red" : "green"}">${
            tzMoney > 0 ? "赢了" : "输了"
          }</b>${Math.abs(tzMoney)}妖精
            </p>
        `;
        }
      } catch (error) {
        document.querySelector(
          ".subTitleTips"
        ).innerHTML = `请求被拦截，统计失败！`;
      }
    }
    function isTimeOut() {
      let boastPlayGameObject = getItem("boastPlayGameObject", {});
      let { lastUpdateTime } = boastPlayGameObject;
      let timeout = autoPublishBoastTimeout || 24;
      let maxTime = 60 * 60 * timeout * 1000;
      return (
        overtimeFromFirstRoundPublish &&
        lastUpdateTime &&
        new Date().getTime() - lastUpdateTime > maxTime
      );
    }
    // 每次发牛前处理数据
    function handleClearBoastPlayData() {
      if (isTimeOut()) {
        setItem("winIdData", []);
        setItem("boastPlayGameObject", {});
        setItem("currentLatestId", null);
        // setItem("boastConfig", {});
      }
    }
    // 获取是否完成
    async function getMyBoastIsFinished() {
      let myBoastHistoryHref = getItem("myBoastHistoryHref", "");
      if (!myBoastHistoryHref) {
        console.log("myBoastHistoryHref为空");
        return false;
      }
      let res = await fetchData(myBoastHistoryHref, 0);
      let match = /<body>([\s\S]*?)<\/body>/.exec(res);
      let bodyString = match?.[0];
      bodyString = bodyString.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );

      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = bodyString;
      let nextBoastData = await getMyBoastData(tempDiv);
      console.log(nextBoastData);

      return nextBoastData.isFinished;
    }
    async function handleStatistics(isReturnResult = false) {
      let title = document.querySelector(".title");
      title.insertAdjacentHTML(
        "afterend",
        `
        <div class="line1 statistics-btn-wrap">
        <a class="statistics-btn-left">统计当页数据</a>
 
        <a class="statistics-btn-right">统计指定页数据</a>
        </div>
        `
      );
      MY_addStyle(`
        .statistics-btn-wrap {
          display: flex;
          justify-content: space-around;
        }
        .statistics-btn-wrap a{
          background: #888888;
          border-radius: 5px;
          width: 48%;
          color: #fff;
          box-sizing: border-box;
          display: inline-block;
          text-align: center;
          cursor: pointer;
        }
        /* 已访问的链接状态 */
        .statistics-btn-wrap a:visited{
          color: #fff;
        }
        /* 正在点击链接时的状态 */
        .statistics-btn-wrap a:active{
          color: #fff;
        }
      `);
      let isClick = false;
      $(".statistics-btn-left").click(async () => {
        if (!isClick) {
          isClick = true;
          await handleData();
          isClick = false;
        }
      });
      $(".statistics-btn-right").click(async () => {
        if (!isClick) {
          isClick = true;
          let todayFirstIdAry = getItem("todayFirstId", []);
          if (typeof todayFirstIdAry !== "object") {
            todayFirstIdAry = [todayFirstIdAry];
          }
          let todayFirstId = todayFirstIdAry[todayFirstIdAry.length - 1];

          let number = prompt(
            "请输入要查询页数或者截止的id：",
            parseInt(todayFirstId) || 5
          );

          if (!/^\d+$/.test(number)) {
            isClick = false;
            return;
          }

          let isId = number?.length >= 3;
          if (number.length >= 3) {
            todayFirstIdAry.push(number);
            todayFirstIdAry = todayFirstIdAry.slice(-10);

            setItem("todayFirstId", todayFirstIdAry);
          }

          number = parseInt(number);
          if (number <= 0) {
            isClick = false;
            return;
          }
          if (number > 50 && number < 1000) {
            alert("输入的页数或者id不对，页数需小于50页，id需大于1000");
            isClick = false;
            return;
          }
          // if (number > 10) {
          //   number = 10;
          // }
          let url = location.href;
          let initPage = getUrlParameters().page || 1;

          if (!/(&|\?)page=/.test(url)) {
            url += "&page=1";
          }
          let innerHTML = "";
          for (let index = 0; index < number; index++) {
            let newUrl = url.replace(
              /([?|&]page=)(\d*)/,
              function (match, prefix, pageNumber) {
                let newPageNumber = parseInt(pageNumber || 1) + index;
                return prefix + newPageNumber;
              }
            );
            console.log(newUrl);
            let res = await fetchData(newUrl);
            let match = /<body>([\s\S]*?)<\/body>/.exec(res);
            let bodyString = match?.[0];
            bodyString = bodyString.replace(
              /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
              ""
            );
            innerHTML += bodyString;

            if (isId && handleCurrentPageIsContainsId(bodyString, number)) {
              break;
            }
            // 大于50页说明传的数据有问题,直接退出
            if (index > 50 * 15) {
              break;
            }
          }
          let tempDiv = document.createElement("div");
          tempDiv.innerHTML = innerHTML;
          console.log(tempDiv);

          if (Number(searchBoastLogType) === 1) {
            // 简略模式
            let res = await getMyBoastData(tempDiv, isId ? number : 0);
            let { total, isFinished, lastIsWin, moneyChange, win, winRate } =
              res;
            alert(
              `
              ====${
                isId ? "今日" : `最近${number}页`
              }发吹牛总条数：${total}===\n
              发吹牛赢的次数：${win}，胜率：${winRate}\n
              ${moneyChange > 0 ? "赢了" : "输了"}${Math.abs(moneyChange)}妖精\n
              `
            );
          } else {
            // 详细模式
            let res = await handleData(tempDiv, true, isId ? number : 0);

            let {
              total,
              tzSelect1,
              tzSelect2,
              tzSelect1Win,
              tzSelect2Win,
              tzWin,
              tzWinRate,
              yzSelect1,
              yzSelect2,
              yzSelect1Win,
              yzSelect2Win,
              tzSelectString,
              tzSelectDomString,
              yzSelectString,
              tzMoney,
              yzMoney,
            } = res;
            alert(
              `
            ====${isId ? "今日" : `最近${number}页`}发吹牛总条数：${total}===\n
            发吹牛选择：${tzSelectString.substring(0, 30)}\n
            发吹牛选1的次数：${tzSelect1}次 / ${(tzSelect1 / total).toFixed(
                2
              )}，选2的次数：${tzSelect2}次 / ${(tzSelect2 / total).toFixed(
                2
              )}\n
            实际发吹牛选1赢的概率：${(tzSelect1Win / total).toFixed(
              2
            )}，选2赢的概率：${(tzSelect2Win / total).toFixed(2)}\n
            如果吃吹牛选1赢的概率：${(tzSelect1 / total).toFixed(
              2
            )}，选2赢的概率：${(tzSelect2 / total).toFixed(2)}\n
            发吹牛赢的次数：${tzWin}，胜率：${tzWinRate}，${
                tzMoney > 0 ? "赢了" : "输了"
              }${Math.abs(tzMoney)}妖精\n
            ====${isId ? "今日" : `最近${number}页`}吹牛总条数：${total}====\n
            吃吹牛选择：${yzSelectString.substring(0, 30)}\n
            吃吹牛选1的次数：${yzSelect1}次 / ${(yzSelect1 / total).toFixed(
                2
              )}，选2的次数：${yzSelect2}次 / ${(yzSelect2 / total).toFixed(
                2
              )}\n
            实际吃吹牛实际选1赢的概率：${(yzSelect1Win / total).toFixed(
              2
            )}，选2赢的概率：${(yzSelect2Win / total).toFixed(2)}\n
            如果发吹牛选1赢的概率：${((total - yzSelect1) / total).toFixed(
              2
            )}，选2赢的概率：${((total - yzSelect2) / total).toFixed(2)}\n
            吃吹牛赢的次数：${total - tzWin}，吃吹牛的胜率：${(
                1 - tzWinRate
              ).toFixed(2)}，${yzMoney > 0 ? "赢了" : "输了"}${Math.abs(
                yzMoney
              )}妖精
            `
            );
          }

          isClick = false;
        }
      });
    }

    function handleCurrentPageIsContainsId(htmlString, id) {
      const regex = /&amp;id=(\d+)/g;

      let match;
      const ids = [];

      while ((match = regex.exec(htmlString)) !== null) {
        ids.push(match[1]);
      }
      return ids.some((item) => item <= id);
    }

    async function handleData(
      dom = document,
      isReturnResult = false,
      endId = 0,
      endCount
    ) {
      let list = dom.querySelectorAll(
        "a[href^='/games/chuiniu/book_view.aspx']"
      );
      let total = 0;
      let tzSelect1 = 0;
      let tzSelect2 = 0;
      let tzSelect1Win = 0;
      let tzSelect2Win = 0;
      let yzSelect1 = 0;
      let yzSelect2 = 0;
      let yzSelect1Win = 0;
      let yzSelect2Win = 0;

      let tzWin = 0;
      let tzWinRate = 0;

      let tzSelectString = "";
      let yzSelectString = "";
      let tzSelectDomString = "";
      let yzSelectDomString = "";
      let tzMoney = 0;
      let yzMoney = 0;

      let boastData = getItem("boastData");

      let isModify = false;

      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        let id = item.innerText;
        if (item.parentElement.innerText.includes("进行中")) {
          continue;
        }
        if (endId && parseInt(endId) > parseInt(id)) {
          break;
        }
        if (endCount && total >= endCount) {
          break;
        }
        // if (isReturnResult && total >= 10) {
        //   break;
        // }

        let curData;
        if (boastData[id]) {
          curData = boastData[id];
        } else {
          let url = item.href;
          let res = await fetchData(url);
          let regex = /<body>([\s\S]*?)<\/body>/;
          let match = regex.exec(res);
          let bodyString = match?.[0];
          if (bodyString.includes("不存在此挑战！")) {
            continue;
          }
          let money = bodyString.match(/赌注是:(\d+)妖晶/)[1];
          // 获取挑战方出的答案：发吹牛的人
          let challengerAnswer =
            bodyString.match(/挑战方出的是\[答案(\d)\]/)[1];

          // 获取应战方出的答案：接吹牛的人
          let opponentAnswer = bodyString.match(/应战方出的是\[答案(\d)\]/)[1];

          // 获取对应战方状态
          let battleStatus = bodyString.match(
            /对应战方状态:<b>(获胜|失败)!<\/b>/
          )[1];

          curData = {
            id,
            money,
            challengerAnswer,
            opponentAnswer,
            battleStatus,
            lastTime: new Date().getTime(),
          };
          boastData[id] = curData;
          isModify = true;
        }
        tzSelectString += curData.challengerAnswer;
        yzSelectString += curData.opponentAnswer;
        tzSelectDomString += `<b style="color:${
          curData.battleStatus === "失败" ? "red" : "green"
        }">${curData.challengerAnswer}</b>`;

        yzSelectDomString += `<b style="color:${
          curData.battleStatus === "获胜" ? "red" : "green"
        }">${curData.opponentAnswer}</b>`;

        total++;

        if (curData.battleStatus === "获胜") {
          // 吃吹牛获胜、发吹牛失败
          if (curData.opponentAnswer == 1) {
            // 吃吹牛的人选1
            yzSelect1++;
            tzSelect1++;
            yzSelect1Win++;
          } else {
            // 吃吹牛的人选2
            yzSelect2++;
            tzSelect2++;
            yzSelect2Win++;
          }
          tzMoney += -curData.money;
          yzMoney += curData.money * 0.9;
        } else {
          // 吃吹牛失败、发吹牛获胜
          tzWin++;
          tzWinRate = (tzWin / total).toFixed(2);

          // 失败
          if (curData.opponentAnswer == 1) {
            // 吃吹牛的人选1
            yzSelect1++;
            tzSelect2++;
            tzSelect2Win++;
          } else {
            // 吃吹牛的人选2
            yzSelect2++;
            tzSelect1++;
            tzSelect1Win++;
          }
          tzMoney += curData.money * 0.9;
          yzMoney += -curData.money;
        }
      }

      if (isModify) {
        setItem("boastData", boastData, true);
      }

      tzMoney = tzMoney.toFixed(2);
      yzMoney = yzMoney.toFixed(2);
      // console.log(
      //   `
      //   发牛者：${tzMoney}
      //   吃牛者：${yzMoney}
      //   `
      // );
      if (isReturnResult) {
        return {
          total,
          tzSelect1,
          tzSelect2,
          tzSelect1Win,
          tzSelect2Win,
          tzWin,
          tzWinRate,
          yzSelect1,
          yzSelect2,
          yzSelect1Win,
          yzSelect2Win,
          tzSelectString,
          tzSelectDomString,
          yzSelectDomString,
          yzSelectString,
          tzMoney,
          yzMoney,
        };
      } else {
        alert(
          `
          ====当前页发吹牛总条数：${total}===\n
          发吹牛选择：${tzSelectString}\n
          发吹牛选1的次数：${tzSelect1} / ${(tzSelect1 / total).toFixed(
            2
          )}，选2的次数：${tzSelect2} / ${(tzSelect2 / total).toFixed(2)}\n
          实际发吹牛选1赢的概率：${(tzSelect1Win / total).toFixed(
            2
          )}，选2赢的概率：${(tzSelect2Win / total).toFixed(2)}\n
          如果吃吹牛选1赢的概率：${(tzSelect1 / total).toFixed(
            2
          )}，选2赢的概率：${(tzSelect2 / total).toFixed(2)}\n
          发吹牛赢的次数：${tzWin}，胜率：${tzWinRate}，${
            tzMoney > 0 ? "赢了" : "输了"
          }${Math.abs(tzMoney)}妖精\n
          ====当前页吃吹牛总条数：${total}====\n
          吃吹牛选择：${yzSelectString}\n
          吃吹牛选1的次数：${yzSelect1} / ${(yzSelect1 / total).toFixed(
            2
          )}，选2的次数：${yzSelect2} / ${(yzSelect2 / total).toFixed(2)}\n
          实际吃吹牛实际选1赢的概率：${(yzSelect1Win / total).toFixed(
            2
          )}，选2赢的概率：${(yzSelect2Win / total).toFixed(2)}\n
          如果发吹牛选1赢的概率：${((total - yzSelect1) / total).toFixed(
            2
          )}，选2赢的概率：${((total - yzSelect2) / total).toFixed(2)}\n
          吃吹牛赢的次数：${total - tzWin}，吃吹牛的胜率：${(
            1 - tzWinRate
          ).toFixed(2)}，${yzMoney > 0 ? "赢了" : "输了"}${Math.abs(
            yzMoney
          )}妖精
          `
        );
      }
    }
    async function getMyBoastData(tempDiv, endId = 0) {
      let isSearchByBeforePublishBoast = !tempDiv;
      if (!tempDiv) {
        tempDiv = tempDiv || document;
        let btn = tempDiv.querySelector(
          "a[href^='/games/chuiniu/book_list.aspx']"
        );
        if (btn.innerText !== "我的大话") {
          return {
            isFinished: false,
            moneyChange: 0,
          };
        }
        let url = btn.href;
        // 来源为全部大话
        if (
          publishBoastDynamicRateSource == "2" &&
          !isAutoPublishBoast &&
          !isAutoAddMoney
        ) {
          url = "/games/chuiniu/book_list.aspx?type=0&siteid=1000&classid=0";
        }

        let res = await fetchData(url, 0);
        let match = /<body>([\s\S]*?)<\/body>/.exec(res);
        let bodyString = match?.[0];
        tempDiv = document.createElement("div");
        tempDiv.innerHTML = bodyString;
      }

      let list = tempDiv.querySelectorAll(
        "a[href^='/games/chuiniu/book_view.aspx'], a[href^='/games/chuiniu/doit.aspx']"
      );
      let rate1 = 0.5;

      // let boastData = getItem("boastData");
      // let statusAry = [];
      // let moneyAry = [];
      let count = 1;
      let total = 0;
      let lastIsWin = false;
      let isFirstWin = false;
      let isFinished = true;
      let moneyChange = 0;
      let win = 0;
      let loseMoney = 0;
      // 存储当前自动发牛存储的id
      let currentLatestId = getItem("currentLatestId", null);
      // 上一次到这一次的连续失败次数
      let failCount = 0;
      // 上一次到这一次的总次数
      let currentCount = 0;

      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        let id = item.innerText;
        let innerText = item.parentElement.innerText;
        if (endId && parseInt(endId) > parseInt(id)) {
          break;
        }

        total++;
        // 记录上一次的id

        if (index === 0) {
          if (!currentLatestId) {
            setItem("currentLatestId", id);
          }
        }
        currentLatestId = getItem("currentLatestId", null);
        if (innerText.includes("进行中")) {
          isFinished = false;
          // return {
          //   isFinished: false,
          //   lastIsWin,
          // };
        } else {
          let matchResult = innerText.match(/(赚了|输了)(\d+)妖晶/);
          let status = matchResult[1];
          let money = matchResult[2];
          if (status === "输了") {
            if (!isFirstWin) {
              count++;
              loseMoney += Number(money);
            }
            moneyChange -= Number(money);
          } else {
            if (count === 1) {
              lastIsWin = true;
            }
            isFirstWin = true;
            win++;
            moneyChange += Number(money * 0.9);

            if (currentLatestId && currentLatestId < id) {
              let winIdData = getItem("winIdData", []);

              if (!winIdData.includes(id)) {
                winIdData.push(id);
                setItem("winIdData", winIdData);
              }
            }
          }
          // console.log(
          //   `这把${status}:${money}妖精，实际${
          //     status === "输了" ? -money : money * 0.9
          //   }，结余${moneyChange}`
          // );
          if (
            currentLatestId &&
            currentLatestId < id &&
            isSearchByBeforePublishBoast
          ) {
            currentCount++;
            // 统计本次失败的次数
            if (status === "输了" && !isFirstWin) {
              failCount++;
            }
            let boastPlayGameObject = getItem("boastPlayGameObject", {});
            let { storage = {}, total } = boastPlayGameObject || {};
            let updateTime = new Date().getTime();
            if (!storage[id]) {
              storage[id] = status === "输了" ? -money : +money;
              total = Object.values(storage).reduce((prev, cur) => {
                let money = cur > 0 ? cur * 0.9 : cur;
                return Math.ceil(prev + money);
              }, 0);
              total = Math.ceil(total);
              boastPlayGameObject = {
                storage,
                total,
              };
            }
            boastPlayGameObject.failCount = failCount;
            boastPlayGameObject.lastUpdateTime = updateTime;
            setItem("boastPlayGameObject", boastPlayGameObject);
          }
        }
      }
      if (isPublishBoastDynamicWinRate && isSearchByBeforePublishBoast) {
        let { yzSelect2, total } = await handleData(
          tempDiv,
          true,
          0,
          dynamicWinRateCount
        );
        rate1 = (yzSelect2 / total).toFixed(2);
        if (dynamicWinRateAfter10times && currentCount < 10) {
          rate1 = publishAnswer1Rate;
          console.log(`当前小于10次用默认概率:${publishAnswer1Rate}`);
        }
        // if (dynamicWinRateCount !== 15) {
        //   let { yzSelect2: Select2ByAll, total: totalByAll } = await handleData(
        //     tempDiv,
        //     true
        //   );
        //   let rateAll = (Select2ByAll / totalByAll).toFixed(2);

        //   console.log(`计算局数:${totalByAll},概率为${rateAll}`);
        // }

        console.log(`计算局数:${total},动态概率初始值:${rate1}`);
        // 动态策略最小0.35，最大0.65
        rate1 = rate1 > 0.5 ? Math.min(rate1, 0.7) : Math.max(rate1, 0.3);

        let boastConfig = getItem("boastConfig", {});
        boastConfig.DynamicWinRate1 = rate1;
        setItem("boastConfig", boastConfig);

        // if ($(".boast-index-rate").length) {
        //   $(".boast-index-rate").text(`，答案1动态概率：${rate1}`);
        // }
        console.log(`调整后新的动态概率:${rate1}，计算局数:${total}`);
      }
      moneyChange = moneyChange.toFixed(2);
      let winRate = (win / total).toFixed(2);
      // 超时就从第一回合开始
      count = isTimeOut() ? 1 : count;
      return {
        total,
        win,
        winRate,
        rate1,
        isFinished,
        lastIsWin,
        moneyChange,
        nextMoney: getNextMoney(count, !lastIsWin),
        loseMoney,
      };
    }

    function handleAddSearch(dom = document) {
      let arr = ["/games/chuiniu/book_list.aspx", "/games/chuiniu/index.aspx"];
      if (!arr.includes(location.pathname)) {
        return;
      }
      let title = document.querySelector(".title");
      title.insertAdjacentHTML(
        "beforeend",
        `
        <span class="separate"> </span>
        <a class="search-dahua">查询大话</a>
        <span class="separate"> </span>
        <a class="search-qianghua">查询抢话</a>
        `
      );
      // 查询大话
      $(".search-dahua").click(() => {
        let defaultValue = isMobile() ? "0" : "";
        let res = prompt(
          "请输入要查询大话的用户id，输入0查询全部",
          defaultValue
        );
        if (res === null) return;
        if (!res || /^\d+$/.test(res)) {
          location.href = `/games/chuiniu/book_list.aspx?type=0&touserid=${
            res <= 0 ? "" : res
          }&siteid=1000&classid=0`;
        }
      });
      // 查询抢话
      $(".search-qianghua").click(() => {
        let defaultValue = isMobile() ? "0" : "";
        let res = prompt(
          "请输入要查询抢话的用户id，输入0查询全部",
          defaultValue
        );
        if (res === null) return;
        if (!res || /^\d+$/.test(res)) {
          location.href = `/games/chuiniu/book_list.aspx?type=1&touserid=${
            res <= 0 ? "" : res
          }&siteid=1000&classid=0`;
        }
      });
    }
    //  获取用户id
    async function getUserId(url) {
      return getUrlParameters(url).touserid;
      // let res = await fetchData(url);
      // let id = res.match(/<b>ID号:<\/b>(\d+)/)?.[1];
      // return id;
    }
  }
  function getNextMoney(n, isAddCommission = false) {
    let ary = [];
    let number;
    if (Number(autoPublishBoastStrategy) === 1) {
      ary = generateSequenceByAdd(autoPublishBoastInitialValue, n);
    } else if (Number(autoPublishBoastStrategy) === 2) {
      ary = generateSequenceByMultiply(autoPublishBoastInitialValue, n);
    } else if (Number(autoPublishBoastStrategy) === 3) {
      ary = generateSequenceByCommission(n);
    } else if (Number(autoPublishBoastStrategy) === 4) {
      ary = generateSequenceByStrategy4(n);
    }
    number = ary[n - 1];

    // 指定前几把增加手续费
    return isAddCommission && n <= addCommissionCount && commissionType == 1
      ? Math.floor(number / 0.9)
      : number;
  }
  function generateSequenceByCommission(
    n,
    defaultValue = defaultValueByCommission
  ) {
    let result = [500, 1111, 2000];
    if (commissionType == 2) {
      if (defaultValue && defaultValue.length) {
        result = [...defaultValue];
      } else {
        result.push(1111, 1790);
      }
    } else {
      result = [500, 1111, 2000];
    }
    for (let i = 3; i < n; i++) {
      const previousValue = result[i - 1];
      let nextValue = previousValue * 2;
      if (commissionType == 2) {
        nextValue = Math.floor(nextValue / 0.9);
      }
      result.push(nextValue);
    }

    result = result.slice(0, n);

    return result;
  }
  function generateSequenceByStrategy4(
    n,
    defaultStrategy4 = defaultValueByStrategy4
  ) {
    let arr = [...defaultStrategy4];
    function repeatArray(arr, length) {
      const repeatedArr = [...arr];
      while (repeatedArr.length < length) {
        // repeatedArr.push(...arr);
        repeatedArr.push(arr[arr.length - 1]);
      }
      return repeatedArr.slice(0, length);
    }
    return repeatArray(arr, n);
  }
  function getTotalAry(ary) {
    let newAry = ary.map((item, index, arr) => getSum(arr.slice(0, index + 1)));
    return newAry;
    function getSum(arr) {
      return arr.reduce((prev, cur) => {
        return Math.ceil(prev + cur);
      }, 0);
    }
  }
  function getWinMoneyByAry(arr) {
    let WinMoney = [];
    for (let i = 0; i < arr.length; i++) {
      WinMoney.push(getWinMoney(arr.slice(0, i + 1)));
    }
    return WinMoney;
    function getWinMoney(arr) {
      let money = arr[arr.length - 1] * 0.9;
      for (let i = arr.length - 2; i >= 0; i--) {
        money -= arr[i];
      }
      return Math.ceil(money);
    }
  }
  // 获取策略赢的
  function getWinMoneyByFn(n = 10, defalutValue = [500, 1111, 1790]) {
    let arr = generateSequenceByCommission(n, 2);
    let WinMoney = [];
    for (let i = 0; i < arr.length; i++) {
      WinMoney.push(getWinMoney(arr.slice(0, i + 1)));
    }
    return {
      arr,
      WinMoney,
    };
    function generateSequenceByCommission(n = 10, commissionType = 2) {
      let result = [500];
      if (commissionType == 2) {
        result = [...defalutValue];
      } else {
        result.push(1111, 2000);
      }
      for (let i = 3; i < n; i++) {
        const previousValue = result[i - 1];
        nextValue = previousValue * 2;
        if (commissionType == 2) {
          nextValue = Math.floor(nextValue / 0.9);
        }
        result.push(nextValue);
      }
      result = result.slice(0, n);
      return result;
    }
    function getWinMoney(arr) {
      let money = arr[arr.length - 1] * 0.9;
      for (let i = arr.length - 2; i >= 0; i--) {
        money -= arr[i];
      }
      return Math.ceil(money);
    }
  }
  /**
   * 策略1：下一次金额为最近两次之和
   * @param {number} n 第几回合
   * @returns 返回第几回合的金额
   */
  /* function generateSequenceByAdd(
    initialValue = 500,
    n = 10,
    strategy1Count = strategy1RecoveryCount
  ) {
    let result = [parseFloat(initialValue)];
 
    if (n === 1) {
      return result;
    }
 
    result.push(initialValue <= 1000 ? initialValue * 3 : initialValue * 2.5);
 
    for (let i = 2; i < n; i++) {
      let nextValue = parseFloat(result[i - 1]) + parseFloat(result[i - 2]);
      if (i < strategy1Count && i > 2) {
        const previousValue = result[i - 1];
        nextValue = previousValue * 2;
      }
      result.push(nextValue);
    }
 
    return result;
  } */
  function generateSequenceByAdd(
    initialValue = 500,
    n = 10,
    strategy1Count = strategy1RecoveryCount
  ) {
    if (initialValue >= 1000 && strategy1Count > 3) {
      strategy1Count = 3;
    }
    let result = [parseFloat(initialValue)];
    let rate = [3, 2.5, 2.1, 2];
    if (n === 1) {
      return result;
    }
    result.push(initialValue * rate[0]);
    for (let i = 2; i < n; i++) {
      let nextValue = parseFloat(result[i - 1]) + parseFloat(result[i - 2]);
      const previousValue = result[i - 1];
      if (rate[i - 1] && strategy1Count > i) {
        nextValue = previousValue * rate[i - 1];
      }
      result.push(nextValue);
    }

    return result;
  }
  /**
   * 策略2：下一次金额为最近一次的两倍
   * @param {number} n 第几回合
   * @returns 返回第几回合的金额
   */
  function generateSequenceByMultiply(
    initialValue = 500,
    n = 10,
    defaultRate = strategy2DefaultRate
  ) {
    let result = [parseFloat(initialValue)];
    multiplyRate = multiplyRate || [2];

    for (let i = 1; i < n; i++) {
      const previousValue = result[i - 1];
      let nextValue = previousValue * (multiplyRate[i - 1] || defaultRate || 2);
      if (commissionType == 2) {
        nextValue = Math.floor(nextValue / 0.9);
      }
      result.push(nextValue);
    }

    return result;
  }
  /**
   * 删除过期的帖子
   * @param {number|string} value 存储肉帖的对象
   */
  function deleteExpiredID(obj, key) {
    let nowTime = new Date().getTime();
    // 吹牛数据默认存储7天
    let expire = key === "autoEatList" ? expiredDays : 1;
    let lastTime;
    Object.keys(obj).forEach((item) => {
      if (key === "boastData") {
        lastTime = obj[item]["lastTime"];
      } else {
        lastTime = obj[item];
      }
      if (nowTime > timeLeft(lastTime, expire)) {
        delete obj[item];
      }
    });
  }
  // 获取用户等级
  function handleShowUserLevel() {
    if (!/^\/bbs-.*\.html$/.test(window.location.pathname) || !isShowLevel) {
      return;
    }

    let user_id =
      document.querySelector(".louzhunicheng").firstElementChild.href;

    function success(rp) {
      let lv_zz = /<\/b>(\S*)级/;
      let lv_text = rp.match(lv_zz)?.[1] || "0";
      addLvTip(lv_text);
    }

    function fail(code) {
      console.log("error");
    }

    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          return success(request.responseText);
        } else {
          return fail(request.status);
        }
      } else {
      }
    };
    request.open("GET", user_id);
    //request.responseType = 'document';
    request.send();

    function addLvTip(lv) {
      let info_d = document.getElementsByClassName("subtitle")[0];
      let user_name_d = info_d.children[1];
      console.log(user_name_d);

      let lv_d = document.createElement("div");
      lv_d.innerText = "Lv " + lv;
      lv_d.style =
        "display:inline;margin-left:10px; text-align:center; margin-right:10px;color:#ff4234;font-size:17px;border-radius: 30px;";
      info_d.insertBefore(lv_d, user_name_d);
    }
  }
  function handleAddLoadMoreBtnClick() {
    // 如果打开了全自动吃肉和自动加载更多，并且在帖子列表页才添加事件
    let isPage = loadNextPage.some((item) =>
      item.test(window.location.pathname)
    );
    if (
      isPage ||
      (isFullAutoEat && bbsPage.includes(window.location.pathname))
    ) {
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
      // let nextPageWrap = document.querySelectorAll(".bt2");
      let nextPageWrap = [...document.querySelectorAll(".bt2")].findLast(
        (item) => item.innerText === "下一页\n上一页"
      );

      // 距离按钮最大多少就会触发
      let bottomMaxDistance = 250;
      if (loadNextPageType === "more" || !nextPageWrap) {
        nextBtn = document.querySelector("span[id$=show_tip]");
      } else {
        nextBtn = nextPageWrap.firstChild;
        bottomMaxDistance = 0;
      }
      // 回复页特殊处理，如果是加载更多也能使用下一步
      if (
        /\/bbs\/book_re_my\.aspx/.test(window.location.pathname) &&
        loadNextPageType === "more"
      ) {
        nextBtn = nextPageWrap.firstChild;
        bottomMaxDistance = 0;
      }
      let A = nextBtn.getBoundingClientRect().bottom;
      let B = document.documentElement.clientHeight;
      // 获取当前列表的长度
      let newLength = getListLength();
      // 加载更多按钮距离距底部小于300px才开始加载
      // 没有加载完成前不会再次加载
      // 小于页面最大加载数量才会加载
      // console.log(A - B);
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
      // 需要替换文字的ubb
      let ary = [
        "ubb_url",
        "ubb_text",
        "ubb_font",
        "ubb_b",
        "ubb_i",
        "ubb_u",
        "ubb_color",
        "ubb_random_color",
        "ubb_img",
        "ubb_strike",
        "ubb_call",
        "ubb_codo",
        "ubb_audio",
        "ubb_movie",
      ];
      let reg = /\[(\w+)=?([^\]]+)?\]([\s\S]*?)\[\/\1\]/g;
      // 处理你真的该死语音
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
      } else if (id === "ubb_random_color") {
        // 处理随机颜色

        // 如果有选择文本，则每一个文本都替换
        let selectText = getSelectText(textarea);
        console.log(selectText);
        let randomColor = getColorWithinBrightnessRange();
        let ubb2 = `[forecolor=${randomColor}]${
          selectText || "颜色文字，随机颜色"
        }[/forecolor]`;

        if (
          selectText &&
          confirm(
            "检测到当前选择了很多文字，是否给每个字符加随机颜色，否则只为整句话加颜色"
          )
        ) {
          ubb2 = getColorText(selectText, false);
        }
        e.preventDefault();
        insertText(textarea, ubb2, 12);
      } else if (ary.includes(id)) {
        let ubb2 = ubb;
        let match = reg.exec(ubb);
        let selectText = getSelectText(textarea);
        console.log({ match, ubb, selectText });
        let urlAry = ["img", "url", "audio", "movie"];
        let urlRegex = /^(https?|ftp):\/\/[^\s\/\$\.\?#].[^\s]*$/i;

        if (id === "ubb_url") {
          if (urlRegex.test(selectText)) {
            ubb2 = ubb.replace(match[2], selectText || match[2]);
          }
        } else if (match[3]) {
          if (urlAry.includes(match[1])) {
            if (urlRegex.test(selectText)) {
              ubb2 = ubb.replace(match[3], selectText || match[3]);
            }
          } else {
            ubb2 = ubb.replace(match[3], selectText || match[3]);
          }
        }

        e.preventDefault();
        insertText(textarea, ubb2, offset);
      } else {
        e.preventDefault();
        insertText(textarea, ubb, offset);
      }
    });
  }
  /**
   *
   * @param {*} text 增加颜色的文字
   * @param {*} addByAll true为整句增加，false为每次字符增加
   * @returns
   */
  function getColorText(text = "", addByAll = true) {
    let newStr = text;
    // 获取ubb之外的文字
    let matchAry = extractNonMatches(text);
    let randomColor = getColorWithinBrightnessRange();
    for (const txt of matchAry) {
      let colorTxt = addColor(txt);
      newStr = newStr.replace(txt, colorTxt);
    }
    return newStr;
    function addColor(txt) {
      let str = "";
      if (addByAll) {
        return `[forecolor=${randomColor}]${txt}[/forecolor]`;
      }
      let result = getGradientColor(txt);
      for (let i = 0; i < txt.length; i++) {
        let char = txt[i];
        // let randomColor = getColorWithinBrightnessRange();
        let randomColor = result[i];
        // 不匹配空白字符
        if (!/\s/.test(char)) {
          str += `[forecolor=${randomColor}]${char}[/forecolor]`;
        } else {
          str += char;
        }
      }
      return str;
    }
  }
  // 获取渐变色
  function getGradientColor(text = "") {
    const colorConfig = [
      ["#ff3cab", "#3574e8", "#2bf4e7"], // 符合++
      ["#6e35ff", "#ee64c2", "#ff9b5f"], // 符合+
      ["#FF0000", "#0000FF"], // 符合
      ["#12c2e9", "#c471ed", "#f64f59"], // 符合+
      ["#00c4ff", "#ff0056"], //符合+
      ["#40E0D0", "#FF8C00", "#FF0080"], //符合+
      ["#fc00ff", "#00dbde"], // 符合++
      ["#f902ff", "#FF7F00", "#40E0D0"], // 符合
      ["#833ab4", "#fd1d1d", "#fcb045"],
      ["#ff4b1f", "#1fddff", "#f902ff"], // 符合+
    ];

    let randomNumber = getRandomNumber(0, colorConfig.length - 1);
    // console.info("用的颜色", randomNumber + 1);
    let colors = colorConfig[randomNumber];
    let result = applyGradientToText(colors, text);
    return result;

    function applyGradientToText(colors, text) {
      if (!text || !text.length) {
        return [];
      }
      let number = Math.min(6, 1 + Math.ceil(text.length / 5));
      if (text.length > 20) {
        number = Math.min(6, 3 + Math.ceil(text.length / 10));
      }

      let maxSteps = colors.length * number; // 最大步数限制，根据实际需要调整
      // 特殊处理七彩
      if (colors.length === 7) {
        maxSteps = 35;
      }

      let steps = Math.min(text.length, maxSteps); // 根据文字长度动态计算步数

      // console.warn("steps", steps, colors.length, text.length);

      let gradientColors = generateGradientSteps(colors, steps);
      // console.info(gradientColors, gradientColors.length, text.length);

      let result = [];
      for (let index = 0; index < text.length; index++) {
        // 计算当前字符所属的循环次数
        let cycleIndex = Math.floor(index / gradientColors.length);

        // 判断当前循环是正序还是倒序
        let colorIndex =
          cycleIndex % 2 === 0
            ? index % gradientColors.length // 正序
            : gradientColors.length - 1 - (index % gradientColors.length); // 倒序

        // colorIndex = index % gradientColors.length
        result.push(gradientColors[colorIndex]);
      }

      // 预览文字渐变效果
      /* let spanElements = text.split("").map((char, index) => {
        let span = document.createElement("span");
        span.textContent = char;
        span.style.fontSize = "18px";
        span.style.lineHeight = "20px";

        // 设置颜色
        span.style.color = result[index];
        return span;
      });
      let p = document.createElement("p");
      spanElements.forEach((span) => p.appendChild(span));
      document.body.prepend(p);
      console.info("result", result); */
      return result;
    }
    function hexToRgb(hex) {
      let bigint = parseInt(hex.slice(1), 16);
      let r = (bigint >> 16) & 255;
      let g = (bigint >> 8) & 255;
      let b = bigint & 255;
      return [r, g, b];
    }

    function rgbToHex(r, g, b) {
      return `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
    }

    function interpolateColor(color1, color2, factor) {
      if (arguments.length < 3) {
        factor = 0.5;
      }
      let result = color1.slice();
      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
      }
      return result;
    }

    // 修改的函数，支持多颜色渐变
    function generateGradientSteps(colors, steps) {
      let gradientColors = [];
      let colorCount = colors.length - 1; // 颜色段数
      let segmentSteps = Math.ceil(steps / colorCount); // 每段颜色的步数

      for (let i = 0; i < colorCount; i++) {
        let start = hexToRgb(colors[i]);
        let end = hexToRgb(colors[i + 1]);
        let stepFactor = 1 / segmentSteps;

        for (let j = 0; j < segmentSteps; j++) {
          let interpolatedColor = interpolateColor(start, end, stepFactor * j);
          gradientColors.push(
            rgbToHex(
              interpolatedColor[0],
              interpolatedColor[1],
              interpolatedColor[2]
            )
          );
        }
      }

      // 如果总步数没有整除颜色段数，补充最后一个颜色
      if (gradientColors.length < steps) {
        gradientColors.push(colors[colors.length - 1]);
      }

      return gradientColors;
    }
  }
  function getSelectText(textarea) {
    let startPos = textarea.selectionStart;
    let endPos = textarea.selectionEnd;
    let selectedText = textarea.value.substring(startPos, endPos);
    return selectedText;
  }
  /**
   * 简易版jquery实现，用于替换之前写的部分语法，不引用cdn库
   * @returns
   */
  function myJquery() {
    window.yaohuoStrText =
      "W3sia2V5IjoiMjA0NjkiLCJ2YWx1ZSI6NDA3MDg4MDAwMDAwMH0seyJrZXkiOiIyNjY4In0seyJrZXkiOiI0NzkyMSJ9LHsia2V5IjoiMTkzMyJ9LHsia2V5IjoiNDI3MzgifSx7ImtleSI6IjQzMjkxIn0seyJrZXkiOiIxMjg2NiJ9LHsia2V5IjoiMjYwMzIifSx7ImtleSI6IjUyMDAifSx7ImtleSI6IjQ0NDgifSx7ImtleSI6IjIzMzkwIn0seyJrZXkiOiIzMDAwNyJ9LHsia2V5IjoiOTg3OSJ9LHsia2V5IjoiNDU0NjUifSx7ImtleSI6IjQ5OTkifSx7ImtleSI6IjIwNjU2In0seyJrZXkiOiIyNDM0NCJ9LHsia2V5IjoiMzY0MDkifSx7ImtleSI6IjQ0MjM4In0seyJrZXkiOiIxNjE2MyJ9LHsia2V5IjoiMTExMTEifSx7ImtleSI6IjE5MTQ0In0seyJrZXkiOiIzMjI3MyJ9LHsia2V5IjoiMjgwOTAifSx7ImtleSI6IjExMDkifSx7ImtleSI6IjIyMDY4In0seyJrZXkiOiI0MjU5MiJ9LHsia2V5IjoiMTcxMzIiLCJ2YWx1ZSI6MTczNzgyMDgwMDAwMH1d";
    window.ytoz = function (str) {
      return atob(str);
    };
    window.ztoy = function (str) {
      return btoa(str);
    };
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
