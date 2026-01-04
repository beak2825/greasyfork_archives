// ==UserScript==
// @name         SimComps - tools
// @namespace    http://shenhaisu.cc/
// @version      1.22.3
// @description  给国人使用的SimComps脚本
// @author       ShenHaiSu
// @match        http://www.simcompanies.com/*
// @match        https://www.simcompanies.com/*
// @license      MIT
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/478499/SimComps%20-%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/478499/SimComps%20-%20tools.meta.js
// ==/UserScript==

(function () {
  const feature_config = {
    // 错误排查模式 会输出大量控制台信息。
    // 如果你不知道你在改什么，请不要改动这个参数。
    debug: false,
    // 网络请求最小间隔 单位ms 1000ms = 1s 默认：10s。
    // 间隔时间过低可能会被服务器暂时ban掉，加载不出任何东西。
    net_gap_ms: 10000,
    // 配置版本 不要修改 2023年10月16日
    version: 1,
    // 插件文字颜色 默认 #ffffff 也就是white
    font_color: "#ffffff",
    // 通知显示模式
    // 0 window.Notification
    // 1 页面内 [默认]
    notification_kind: 1,
    // 交易所、合同出售利润计算显示
    warehouse_profit_count: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "交易所、合同出售利润计算显示",
      describe: "通过仓库进行交易所上架或者合同交易给其他公司的时候可以显示利润",
      match: () => Boolean(location.href.match(/warehouse\/(.+)/) && document.querySelectorAll("form").length > 0),
      func: profit_display,
    },
    // 仓库单物总价
    warehouse_count: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "仓库单物总价",
      describe: "在仓库界面鼠标放在物品图标上可以看到成本*数量得到的物品总价值",
      match: () => Boolean(location.href.match(/warehouse\/$/)),
      func: warehouse_count,
    },
    // 自动关闭弹窗
    close_notification: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "自动关闭弹窗",
      describe: "直接关闭弹窗的父窗口，虽然可以弹，但是看不到了。",
      match: () => true,
      func: close_notification,
    },
    // 单大窗口聊天
    one_big_chat: {
      enable: false,
      type: "common", // 类型为 普通功能
      name: "单大窗口聊天",
      describe: "只打开一个大聊天窗口,其他位置的小窗口会自动隐藏。",
      match: () => Boolean(location.href.match(/messages\/(.+)/)),
      func: one_big_chat,
    },
    // 中英文冒号互换
    change_colon: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "中英文冒号互换",
      describe: "在聊天室的输入框中会自动将中文冒号切换为英文冒号\n目前功能有问题，不推荐使用",
      match: () => Boolean(location.href.match(/messages\/(.+)/) && document.activeElement.type == "textarea"),
      func: change_colon,
    },
    // 聊天室市场价格显示
    chatroom_mp_display: {
      enable: true,
      type: "common", // 类型为 普通功能
      display_ms: 0, // 固定显示时长 填0会启用下面的属性
      display_auto_ms: 2000, // 动态显示时长 实际显示时长 = 物品数量 * display_auto_ms
      focus_q: 0, // 关注的品质
      focus_offset: 0, // 价格偏移
      name: "聊天室市场价格显示",
      describe: "检测聊天记录中游戏官方支持的物资图标的信息\n点击文字处会自动尝试获取交易所中相关品质的最低价",
      match: (event) => Boolean(location.href.match(/messages\/(.+)/)) && event.target.parentElement.querySelectorAll("div").length == 0,
      func: chatroom_mp_display,
    },
    // 资料页头像点击放大
    profile_big_avatar: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "资料页头像点击放大",
      describe: "在资料页点击头像来放大",
      match: (event) =>
        Boolean(location.href.match(/company\/(0|1)\/.*\//)) && event.target.tagName == "IMG" && event.target.parentElement.tagName == "H1",
      func: profile_big_avatar,
    },
    // 零售商店时利润/总利润显示
    retail_display_profit: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "零售商店时利润/总利润显示",
      describe: "在零售建筑中尝试上架零售物品的时候，会实时计算零售利润和每小时利润",
      match: () =>
        Boolean(location.href.match(/\/b\/\d+\//)) && document.activeElement.name == "price" && document.activeElement.tagName == "INPUT",
      func: retail_display_profit,
    },
    // 检索界面仅显示在线用户
    search_display_online: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "检索界面仅显示在线用户",
      describe: "在标签搜索公司的界面上方增加一个按钮\n点击即可切换仅显示在线玩家",
      match: () => Boolean(location.href.match(/\/market\/tag-search\/.+\//)),
      func: search_display_online,
    },
    // 资料页当地时间12小时制转24小时制
    profile_local_time_convert: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "资料页当地时间12小时制转24小时制",
      describe: "公司资料页面中的 当地时间 自动从12小时制转换为24小时制",
      match: () => Boolean(location.href.match(/company\/(0|1)\/.*\//)),
      func: profile_local_time_convert,
    },
    // 一键收取所有建筑产出
    one_click_harvest: {
      enable: true,
      type: "common", // 类型为 普通功能
      position: 0, // 按钮所在位置
      text: "收取", // 按钮文本
      name: "一键收取所有建筑产出",
      describe: "在公司地图页面，右上角头像的右边有一个收取按钮，点击即可一键收取全部产出",
      match: () => Boolean(location.href.match(/landscape\/$/)),
      func: one_click_harvest,
    },
    // 总览与财务图表放大
    bigger_amcharts: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "总览与财报界面图表放大",
      describe: "在总览页面或者财报页面点一下空白处触发检测就会放大图表",
      match: () => Boolean(location.href.match(/headquarters\/(accounting\/|overview\/$)/)),
      func: bigger_amcharts,
    },
    // 使用金额限定从交易行购买
    purchase_by_money: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "预算采购",
      describe: "交易行多出一排信息，输入采购目标（最低品质要求，最高金额限制）\n点击按钮会提示计算结果，点击确定会尝试进行采购",
      match: () => Boolean(location.href.match(/market\/resource\/(\d+)\//)),
      func: purchase_by_money,
    },
    // 地图界面隐藏滚动条
    landscape_no_scroll: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "地图界面隐藏滚动条",
      describe: "这。不用解释了吧？",
      match: () => true,
      func: landscape_no_scroll,
    },
    // 交易行按钮旁高提醒
    high_reminder: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "交易行按钮旁高提醒",
      describe: "交易行旁按钮高提醒，提示当前是R1还是R2",
      match: () => Boolean(location.href.match(/market\/resource\/(\d+)\//)),
      func: high_reminder,
    },
    // 图形设置界面
    ui_setting: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "图形设置界面",
      describe: "图形化设置界面的功能，不建议关闭，因为得从代码和IndexedDB里打开",
      match: () => Boolean(location.href.match(/account-settings\/preferences\/$/)),
      func: ui_setting,
    },
    // 自定义背景图片
    custom_background_image: {
      enable: true,
      type: "common", // 类型为 普通功能
      name: "自定义背景图片",
      describe: "如名",
      cssText: "",
      match: () => true,
      func: custom_background_image,
    },
    // 自定义生产数量按钮
    custom_quantity_button: {
      enable: true,
      type: "common",
      name: "自定义生产数量按钮",
      describe: "在生产界面数量的输入框下添加一个自定义按键，用户可以自定义快捷输入内容",
      buttonText: "9am", // 按钮自定义内容
      match: () => Boolean(location.href.match(/\/b\/\d+\/$/)),
      func: custom_quantity_button,
    },
    // 接受合同界面自动询价
    automatic_inquiry_in_acc: {
      enable: true,
      type: "common",
      name: "接受合同界面自动询价",
      describe: "在接受合同界面自动询价并显示当前交易所价格",
      match: () => Boolean(location.href.match("headquarters/warehouse/incoming-contracts")),
      func: automatic_inquiry_in_acc,
    },
    // 合同出售界面显示mp偏移
    warehouse_profit_count_mpOffest: {
      enable: true,
      type: "common",
      mp_offest: 3, // mp-3 默认是3 就是 市场价-3%
      name: "合同出售界面显示mp偏移",
      describe: "在合同出售界面会自动添加一个mp-的信息，计算当前的mp-的实际价格",
      match: () => Boolean(location.href.match(/warehouse\/(.+)/) && document.querySelectorAll("form").length > 0),
      func: warehouse_profit_count_mpOffest
    },
    // startup - 随手笔记
    easy_text: {
      enable: true,
      type: "startup",
      name: "随手笔记",
      describe: "在屏幕左下角创建一个按钮点击打开一个笔记记录板",
      backGround: "rgb(0,0,0,0.8)", // 默认背景是黑色半透明
      func: easy_text,
    },
    // startup - 交易所价格追踪
    market_price_tracker: {
      enable: true,
      type: "startup", // 类型为 自启动
      max_net_time_gap: 120 * 1000, // 最大查询时间间隔
      min_net_time_gap: 60 * 1000, // 最小查询时间间隔
      name: "交易所价格追踪",
      describe: "用于定时查询指定服务器的交易所中的指定物品的价格，当达到价格最低价时，会通过浏览器的消息提示通道发送通知",
      func: market_price_tracker,
    },
    // startup - 建筑工作完成提醒
    building_work_end_notification: {
      enable: true,
      type: "startup", // 功能启动类型为 自启动
      time2gap: 5 * 60 * 1000, // 检查时间间隔，默认5分钟 单位ms
      msg_title: "建筑项目完工",
      msg_body: "您有一个新的建筑完工了，可以续派任务咯~",
      name: "建筑工作完成提醒",
      describe: "通过获取到的建筑信息，在建筑完成了工作的时候通过浏览器的提醒通道发出提醒。",
      func: building_work_end_notification,
    },
    // net - 语言数据包
    lang_zh_handler: {
      enable: true,
      type: "net", // 类型为 网络请求拦截
      name: "加载语言数据包",
      describe: "是其他功能的基础。",
      url_match: (url) => Boolean(url.match(/lang5\/zh.json$/)),
      func: lang_zh_handler,
    },
    // net - 资源信息存储
    resource_store: {
      enable: true,
      type: "net", // 类型为 网络请求拦截
      name: "资源信息存储",
      describe: "是其他功能的基础。",
      url_match: (url) => Boolean(url.match(/market\/(\d+)\/(\d+)\//)),
      func: resource_store,
    },
    // net - 玩家信息存储
    player_info_store: {
      enable: true,
      type: "net", // 网络请求拦截
      name: "玩家信息存储",
      describe: "是其他功能的基础",
      url_match: (url) => url == "https://www.simcompanies.com/api/v2/companies/me/",
      func: player_info_store,
    },
    // debounce = 更新维护IndexedDB数据库
    update_indexed_db: {
      enable: true,
      type: "common-debounce", // 类型为正常功能，但是要防抖动防止高频触发
      debounce: 20,
      name: "更新维护IndexedDB数据库",
      describe: "是其他功能的基础。可以给用户持久化数据的功能，提升使用体验。",
      match: () => true,
      func: update_indexed_db,
    },
  };
  const base_URL_list = {
    // GET - 获取仓库所有物品信息
    warehouse: "https://www.simcompanies.com/api/v2/resources/",
    // GET -
    market_price: "https://www.simcompanies.com/api/v3/market/all", // /realm/res_id
    // GET - 获取当前玩家信息
    user_info: "https://www.simcompanies.com/api/v2/companies/me/",
    // GET - 获取我的所有建筑信息
    buildings_info: "https://www.simcompanies.com/api/v2/companies/me/buildings/",
    // POST - 在交易所下单
    // body: {resource:资源id, quantity:数量, quality:质量, maxPrice:最高价}
    market_order: "https://www.simcompanies.com/api/v2/market-order/take/",
  };
  const runtime_data = {
    main_script_load_acc: true, // 标记插件内容加载完毕
    window_HorV: 0, // 0 横屏 1 竖屏
    tapCount: 0, // 触发计数
    DOMchangeCount: 0, // DOM树变动
    realmID: 0, // 服务器标记，默认0
    warehouse: {}, // {"name-quality":[price,count,total],"name2-quality":[price,count,total]}
    net_get_pool: [], // 网络请求间隔池 [{ url:"method+target",time:1234567 }],
    resource_pool: {}, // 交易行资源信息池 索引是re-后面的数字 内容是 {name:"资源名称",price: {0:q0价格,1:q1价格}}
    net_match_list: [], // 网络请求匹配池 [{match:func, func:func}]
    market_price_tracker_list: [], // 交易所价格追踪列表 [{id:123,quality:0,realm:0,target_price:0.159}]
    market_price_tracker_intervalList: [], // 交易所价格消息列表 [intervalFlag,intervalFlag]
    easy_text: "", // 用户自己新建的随手笔记
    buildings: [], // 玩家的建筑数据
    user_info: {}, // 用户数据存储对象
    one_click_harvest_node: null, // 一键收获按钮标签
    userUUID: null, // 脚本用户UUID
    lastURL: "", // 最近一次URL
    automatic_inquiry_in_acc_load: false, // 合同接受界面询价加载标记
    profit_display_mpOffest_load: false, // 合同出售界面mp偏移计算加载标记
    custom_quantity_button: {
      lastURL: "",
    },
    notification: {
      // 通知使用的对象
      permission: false, // 通知权限
      displayNode: undefined, // 网页内通知容器
      displayTargetNode: undefined, // 通知标签直属父元素
      displayButtonNode: undefined, // 网页内通知容器按钮
      displayFlag: false, // 网页内通知容器显示标记
    },
    chatroom_mp_node_flag: {
      // 聊天室市场价格显示 节点记录对象
      container_node: undefined, // 容器窗口标签
      table_node: undefined, // 信息表格标签
      fade_timer: undefined, // 窗口消失计时器
    },
    reatil_display: {
      // 零售信息显示 通用数据池
      container_node: undefined, // 容器标签
      fade_timer: undefined, // 消失计时器
    },
    search_display_online: {
      // 检索仅显示在线
      button_node: undefined, // 按钮标签
      flag: false, // 当前是否仅显示在线玩家
    },
    indexedDB: {
      // indexedDB对象
      open_falg: false, // 连接状态
      db_name: "SimCompsScriptDB1", // 数据库名
      db_version: 1, // 数据库版本
      store_name: "main", // Store名
      dbObj: undefined, // 数据库对象
      storeObj: undefined, // 表对象
    },
    purchase_by_money: {
      // 使用金额限定从交易行购买
      container_node: undefined, // 容器标签
    },
    building_work_end_notification: {
      // 建筑完工提醒
      intervalFlag: undefined, // 计时器标记
    },
    easyTextFunc: {
      // 随手记 脚本使用的对象
      buttonNode: undefined, // 按钮标签
      divNode: undefined, // 容器标签
      textareaNode: undefined, // 编辑器标签
      displayFlag: false, // 显示标记
    },
    ui_setting: {
      // 可视化设置界面
      lastURL: "", // 最近url
      mainSetNode: undefined, // 子功能总开关设置容器
      baseSetNode: undefined, // 插件基础设置容器
      chatroom_mp_display_SetNode: undefined, // 聊天室自动询价功能设置容器
      back_image_SetNode: undefined, // 背景图片设置容器
      clickHarvest: undefined, // 一键收取设置容器
      building_end: undefined, // 建筑项目完工设置容器
      marketLowPrice: undefined, // 交易所低价监控插件设置容器
      customQuantityButton: undefined, // 自定义生产数量按钮设置容器
      easyText: undefined, // 随手记设置容器
      mpOffest: undefined, // 合同出售mp偏移量显示设置容器
    },
  };
  const tools_func = {};
  tools_func.indexedDB = {};
  tools_func.notification = {};
  tools_func.log = function () {
    if (!feature_config.debug) return;
    console.log.apply(this, arguments);
  };
  tools_func.error = function () {
    if (!feature_config.debug) return;
    console.error.apply(this, arguments);
  };
  tools_func.get_parent_index = function (node, index) {
    // 需要几次parentElement就填几
    return index ? tools_func.get_parent_index(node.parentElement, --index) : node;
  };
  tools_func.get_cost_1 = function (node) {
    switch (node.querySelectorAll("span").length) {
      case 3:
        return parseFloat(node.querySelectorAll("span")[1].innerText.replace("$", ""));
      case 4:
      case 5:
        return parseFloat(node.querySelectorAll("span")[2].innerText.replaceAll(/(\$)|(,)/g, ""));
    }
  };
  tools_func.get_cost_2 = function (name = "") {
    if (name == "" || !runtime_data.warehouse[name]) return false;
    return runtime_data.warehouse[name][0] || false;
  };
  tools_func.get_quality = function (formNode) {
    let starsCount = formNode.previousElementSibling.querySelectorAll("span > svg").length;
    if (starsCount == 0) return 0;
    let qualityNumber = parseInt(formNode.previousElementSibling.querySelectorAll("span > svg")[0].parentElement.innerText);
    return isNaN(qualityNumber) ? starsCount : qualityNumber;
  };
  tools_func.get_net_data = async function (target, method = "GET") {
    let fetch_name = method + target;
    let time_stamp = new Date().getTime();
    let gap_index = runtime_data.net_get_pool.findIndex((item) => item.url == fetch_name);
    if (gap_index == -1) {
      runtime_data.net_get_pool.push({ url: fetch_name, time: time_stamp });
    } else if (time_stamp - runtime_data.net_get_pool[gap_index].time >= feature_config.net_gap_ms) {
      runtime_data.net_get_pool[gap_index].time = time_stamp;
    } else {
      return false;
    }
    return await fetch(target, { method }).then(async (res) => {
      return await res.json();
    });
  };
  tools_func.update_warehouse_data = async function () {
    // 发送请求获取仓库信息，并维护到运行时数据中
    let serverData = await tools_func.get_net_data(base_URL_list.warehouse);
    if (!serverData) return;
    runtime_data.warehouse = [];
    for (let i = 0; i < serverData.length; i++) {
      let item = serverData[i];
      let single_name = item.kind.name + "-" + item.quality;
      let totalPrice = 0;
      Object.values(item.cost).forEach((j) => (totalPrice += j));
      if (!runtime_data.warehouse[single_name]) runtime_data.warehouse[single_name] = [0, 0, 0];
      runtime_data.warehouse[single_name][0] = (totalPrice / item.amount).toFixed(3); // 单价
      runtime_data.warehouse[single_name][1] = item.amount; // 数量
      runtime_data.warehouse[single_name][2] = totalPrice.toFixed(3); // 总价
    }
    update_indexed_db();
  };
  tools_func.geiPlayerInfo = async function () {
    let netData = await tools_func.get_net_data("https://www.simcompanies.com/api/v2/companies/me/");
    runtime_data.realmID = netData.authCompany.realmId;
  }
  tools_func.get_marcket_price = async function (res_index, quality = 0, realm = 0) {
    if (typeof res_index === "undefined") return false;
    let target_url = `${base_URL_list.market_price}/${realm}/${res_index}`;
    let resp_data = await tools_func.get_net_data(target_url);
    tools_func.log("网络请求返回体：", resp_data);
    if (resp_data && realm == 0) {
      tools_func.update_marcket_price_allQ(res_index, resp_data);
      return tools_func.get_resource_price(res_index, quality);
    } else if (!resp_data && realm == 0) {
      return tools_func.get_resource_price(res_index, quality);
    } else if (resp_data) {
      for (let index = 0; index < resp_data.length; index++) {
        if (resp_data[index].quality < quality) continue;
        return resp_data[index].price;
      }
    } else {
      return false;
    }
  };
  tools_func.get_resource_price = function (res_index, quality) {
    // console.log(runtime_data.resource_pool[res_index].price[quality]);
    return runtime_data.resource_pool[res_index].price[quality] == Infinity ? 0 : runtime_data.resource_pool[res_index].price[quality];
  };
  tools_func.update_marcket_price = function (res_index, price, quality = 0) {
    if (!res_index || !price) return false;
    // 资源信息池 索引是re-后面的数字 内容是 {name:"资源名称",price: {0:q0价格,1:q1价格}}
    if (!runtime_data.resource_pool[res_index].price[quality]) runtime_data.resource_pool[res_index].price[quality] = 0;
    runtime_data.resource_pool[res_index].price[quality] = price;
    for (let i = 0; i < runtime_data.resource_pool[res_index].price.length; i++) {
      for (let j = i + 1; j < runtime_data.resource_pool[res_index].price.length; j++) {
        if (runtime_data.resource_pool[res_index].price[j] < runtime_data.resource_pool[res_index].price[i]) {
          runtime_data.resource_pool[res_index].price[i] = runtime_data.resource_pool[res_index].price[j];
        }
      }
    }
    tools_func.log(`ID：${res_index} name：${runtime_data.resource_pool[res_index].name} quality：${quality} price：${price}`);
  };
  tools_func.update_marcket_price_allQ = function (res_index, resp_data) {
    let priceList = new Array(13);
    for (let i = 0; i < resp_data.length; i++) {
      if (!priceList[resp_data[i].quality]) {
        priceList[resp_data[i].quality] = resp_data[i].price;
        continue;
      } else if (priceList[resp_data[i].quality] < resp_data[i].price) {
        continue;
      }
    }
    for (let i = 0; i < priceList.length; i++) {
      if (priceList[i] == undefined) priceList[i] = priceList[i + 1] ? priceList[i + 1] : Infinity;
    }
    for (let i = 0; i < priceList.length; i++) {
      priceList[i] = Math.min(priceList[i], ...priceList.slice(i + 1));
    }
    runtime_data.resource_pool[res_index].price = priceList;
    tools_func.log(runtime_data.resource_pool[res_index]);
  };
  tools_func.get_contract_price = async function (target, quality, offset) {
    let res_index = 0;
    if (typeof target == "number") {
      res_index = target;
    } else if (typeof target == "string") {
      res_index = tools_func.get_index_by_name(target);
    } else {
      tools_func.error("错误");
      return false;
    }
    tools_func.log(res_index);
    await tools_func.get_marcket_price(res_index, quality);
    let marcket_price = runtime_data.resource_pool[res_index].price[quality];
    if (!marcket_price) return false;
    return ((marcket_price * (100 - offset)) / 100).toFixed(4);
  };
  tools_func.get_index_by_name = function (name) {
    if (!name) return false;
    let key_list = Object.keys(runtime_data.resource_pool);
    for (let i = 0; i < key_list.length; i++) {
      let key = key_list[i];
      if (runtime_data.resource_pool[key].name == name) return key;
    }
  };
  tools_func.format_HTML_1 = function (node, itemList, qualityList) {
    let fragment = document.createDocumentFragment();
    let tableBody = document.createElement("tbody");
    tableBody.classList.add("script_tbody");
    let headerRow = document.createElement("tr");
    let headerCell = document.createElement("td");
    headerCell.classList.add("script_tbody_tr_1");
    headerCell.textContent = "品名";
    headerRow.appendChild(headerCell);
    for (let i = 0; i < qualityList.length; i++) {
      let quality = qualityList[i];
      let isFocusQ = quality === "sp";
      let qualityLabel = isFocusQ
        ? `q${feature_config.chatroom_mp_display.focus_q} -${feature_config.chatroom_mp_display.focus_offset}%`
        : `q${quality}`;
      let qualityCell = document.createElement("td");
      qualityCell.textContent = qualityLabel;
      headerRow.appendChild(qualityCell);
    }
    tableBody.appendChild(headerRow);
    for (let i = 0; i < itemList.length; i++) {
      let itemName = runtime_data.resource_pool[itemList[i]].name;
      let itemRow = document.createElement("tr");
      let itemNameCell = document.createElement("td");
      itemNameCell.classList.add("script_tbody_tr_1");
      itemNameCell.textContent = itemName;
      itemRow.appendChild(itemNameCell);
      for (let j = 0; j < qualityList.length; j++) {
        let placeholderCell = document.createElement("td");
        placeholderCell.textContent = "请求中...";
        itemRow.appendChild(placeholderCell);
      }
      tableBody.appendChild(itemRow);
    }
    fragment.appendChild(tableBody);
    node.innerHTML = "";
    node.appendChild(fragment);
  };
  tools_func.format_HTML_2 = function (t) {
    if (!Array.isArray(t) || 0 === t.length) return "";
    let e = "<tbody><tr style='height:40px;'><td>功能</td><td>开关</td></tr>";
    return (
      t.forEach((t) => {
        "object" == typeof t &&
          t.hasOwnProperty("name") &&
          t.hasOwnProperty("describe") &&
          t.hasOwnProperty("enable") &&
          (e += `<tr><td title="${t.describe}">${t.name}</td><td><input type="checkbox" ${t.enable ? "checked" : ""}></td></tr>`);
      }),
      (e += "</tbody>")
    );
  };
  tools_func.extract_quality_list = function (text) {
    const regex = /(?:q|Q)(\d+)/g;
    return Array.from(text.matchAll(regex), (item) => parseInt(item[1]))
      .filter((item, index, self) => item >= 0 && item <= 12 && self.indexOf(item) === index)
      .sort((item_a, item_b) => item_a - item_b);
  };
  tools_func.retail_display_get_info_1 = function (node) {
    let text = node.innerText;
    let textList = text.split("\n");
    let output = {};
    output.name = textList[0];
    output.profit = parseFloat(
      textList[3]
        .replaceAll(",", "")
        .match(/\$(-)?\d+\.\d+/)[0]
        .replace("$", "")
    );
    output.duration_hour = tools_func.retail_display_get_time_format(textList[4].match(/\(.+\)/)[0].replaceAll(/\(|\)/g, ""));
    return output;
  };
  tools_func.retail_display_get_time_format = function (timeString) {
    let timeRegex = /(\d+)\s*([a-z]+)/gi;
    let timeUnits = { y: 8760, mo: 720, w: 168, d: 24, h: 1, m: 1 / 60, s: 1 / 3600 };
    let totalHours = 0;
    let match;
    while ((match = timeRegex.exec(timeString)) !== null) {
      let unit = match[2].toLowerCase();
      if (timeUnits.hasOwnProperty(unit)) totalHours += parseFloat(match[1]) * timeUnits[unit];
    }
    return parseFloat(totalHours.toFixed(3));
  };
  tools_func.search_display_online_button_func = function () {
    let button_node = runtime_data.search_display_online.button_node;
    let flag;
    tools_func.log("当前搜索界面仅显示在线标记为：", runtime_data.search_display_online.flag);
    if (runtime_data.search_display_online.flag) {
      // 已开启仅显示在线 要切换到未开启
      Object.assign(button_node.style, { backgroundColor: "rgb(107,107,107)" });
      runtime_data.search_display_online.flag = false;
      flag = "";
    } else {
      // 未开启仅显示在线 要切换到已开启
      Object.assign(button_node.style, { backgroundColor: "green" });
      runtime_data.search_display_online.flag = true;
      flag = "none";
    }
    document.querySelectorAll("div > div.row > div.col-sm-6").forEach((item) => {
      let text = item.querySelector("div.pull-right").nextElementSibling.innerText;
      if (text !== "n/a" && text !== "offline") return;
      item.style.display = flag;
    });
  };
  tools_func.convert_12hr_to_24hr = function (timeString) {
    let [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":");
    hours = (parseInt(hours, 10) % 12) + (period.toLowerCase() === "pm" ? 12 : 0);
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };
  tools_func.one_click_harvest_handle = function () {
    if (!Boolean(location.href.match(/landscape\/$/))) return document.querySelector("#Script_oneClickHarvest_Btn").remove();

    document.querySelectorAll("div > div > div > a").forEach((item) => {
      if (!item.className.match("headquarter") && item.querySelectorAll("a > img").length == 3) item.click();
    });
  };
  tools_func.generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  tools_func.get_target_cookie = (name = "") => {
    if (name == "") return;
    let nowCookie = document.cookie.split(";");
    let output = "";
    for (let i = 0; i < nowCookie.length; i++) {
      let pair = nowCookie[i].trim().split("=");
      if (pair[0] === "csrftoken") {
        output = pair[1];
        break;
      }
    }
    return output;
  };
  tools_func.set_input_new_value = (inputNode, value) => {
    let lastValue = inputNode.value;
    inputNode.value = value;
    let event = new Event("input", { bubbles: true });
    event.simulated = true; // hack React15
    if (inputNode._valueTracker) inputNode._valueTracker.setValue(lastValue); // hack React16 内部定义了descriptor拦截value，此处重置状态
    inputNode.dispatchEvent(event);
  };
  tools_func.format_obj_L_feaConf = (obj = feature_config) => {
    const output = Object.entries(obj).reduce((acc, [key, value]) => {
      if (typeof value === "object") {
        const filteredValue = Object.fromEntries(
          Object.entries(value).filter(([key2, value2]) => typeof value2 !== "function" && key2 != "name" && key2 != "describe")
        );
        acc[key] = filteredValue;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
    tools_func.log(output);
    return output;
  };
  tools_func.ui_set_submit_1 = () => {
    let inputList = [];
    let copyCount = 0;
    document.querySelectorAll("#setting-container-1 table input").forEach((input) => {
      inputList.push(input.checked);
    });
    tools_func.log(inputList);
    for (let key in feature_config) {
      if (typeof feature_config[key] !== "object" || !feature_config[key].hasOwnProperty("enable")) continue;
      feature_config[key].enable = inputList[copyCount++];
    }
    tools_func.log(feature_config);
    tools_func.indexedDB.updateFeatureConf();
    window.alert("已提交保存。");
    location.reload();
  };
  tools_func.ui_set_submit_2 = async () => {
    let valueList = [];
    document.querySelectorAll("#setting-container-2 input ,#setting-container-2 select").forEach((item) => {
      if (item.type == "checkbox") return valueList.push(item.checked);
      valueList.push(item.value);
    });
    console.log(valueList);
    if (valueList[2] == "") valueList[2] = "#ffffff";
    if (!tools_func.color_reg(valueList[2])) return window.alert("文本颜色不合规，请使用hex颜色或者rgb颜色");
    feature_config.debug = valueList[0];
    feature_config.net_gap_ms = Math.floor(valueList[1]);
    feature_config.font_color = valueList[2];
    feature_config.notification_kind = Math.floor(valueList[3]);
    await tools_func.indexedDB.updateFeatureConf();
    window.alert("已提交保存。");
    location.reload();
  };
  tools_func.ui_set_submit_3 = async () => {
    let valueList = [];
    document.querySelectorAll("#setting-container-3 input").forEach((item) => valueList.push(item.value));
    if (!(valueList.length == 4 && valueList.every((num) => num >= 0) && valueList[2] <= 12 && valueList[3] <= 100)) {
      window.alert("数据内容不合规，请检查所有内容不应当小于0。品质在0-12中，折扣在0-100中。");
      return;
    }
    feature_config.chatroom_mp_display.display_ms = Math.floor(valueList[0]);
    feature_config.chatroom_mp_display.display_auto_ms = Math.floor(valueList[1]);
    feature_config.chatroom_mp_display.focus_q = Math.floor(valueList[2]);
    feature_config.chatroom_mp_display.focus_offset = Math.floor(valueList[3]);
    await tools_func.indexedDB.updateFeatureConf();
    window.alert("已提交保存。");
  };
  tools_func.ui_set_submit_5 = async (event) => {
    let valueList = [];
    document.querySelectorAll("#setting-container-5 input, #setting-container-5 select").forEach((item) => valueList.push(item.value));
    tools_func.log(valueList);
    if (valueList[0] == "" || valueList[1] < 0 || valueList[1] > 2) return window.alert("内容不正确，请检查内容。");
    feature_config.one_click_harvest.text = valueList[0];
    feature_config.one_click_harvest.position = Math.floor(valueList[1]);
    feature_config.one_click_harvest.func(undefined, true);
    tools_func.indexedDB.updateFeatureConf();
    window.alert("已提交更改");
  };
  tools_func.ui_set_submit_6 = async () => {
    let valueList = [];
    document.querySelectorAll("#setting-container-6 input").forEach((item) => valueList.push(item.value));
    if (valueList[0] < feature_config.net_gap_ms)
      return window.alert("功能是通过发送网络请求来检查建筑状态的\n请求间隔时间不要小于'通用网络请求最小间隔'。");
    if (valueList[1] == "" || valueList[2] == "")
      (valueList[1] = "建筑项目完工"), (valueList[2] = "您有一个新的建筑完工了，可以续派任务咯~");
    // 保存配置
    feature_config.building_work_end_notification.time2gap = Math.floor(valueList[0]);
    feature_config.building_work_end_notification.msg_title = valueList[1];
    feature_config.building_work_end_notification.msg_body = valueList[2];
    await tools_func.indexedDB.updateFeatureConf();
    // 重启功能
    building_work_end_notification("restart");
    // 交互提醒
    window.alert("已提交设置并保存。");
  };
  tools_func.ui_set_submit_7 = async () => {
    await tools_func.indexedDB.updateRuntimeData();
    market_price_tracker("restart");
    window.alert("以保存配置并发起功能重启。");
  };
  tools_func.ui_set_submit_7_sub1 = () => {
    // 罗列
    let runtimeData = runtime_data.market_price_tracker_list;
    if (runtimeData.length == 0) return window.alert("当前没有正在监控的任何物品。");
    let outputMsg = `当前已经监控了的资源有：`;
    runtimeData.forEach((item) => {
      // {id:123, quality:0 ,realm:0, target_price:0.159, now_price:123}
      outputMsg += `\n\tID:${item.id} 名称:${runtime_data.resource_pool[item.id].name || "内容有误请删除"}  `;
      outputMsg += `品质:${item.quality} 服务器:${item.realm} 目标价格:${item.target_price}`;
    });
    window.alert(outputMsg);
  };
  tools_func.ui_set_submit_7_sub2 = () => {
    // 添加
    // {id:123, quality:0 ,realm:0, target_price:0.159, now_price:123}
    let valueList = [];
    let exist = false;
    document.querySelectorAll("#setting-container-7 td > input").forEach((item) => valueList.push(item.value));
    valueList = valueList.map((value, index) => (index <= 2 ? Math.floor(value) : value));
    tools_func.log(valueList);
    if (valueList[0] <= 0) return window.alert("资源id不能小于1");
    if (valueList[1] < 0 || valueList[1] > 12) return window.alert("资源品质不合法，只允许0-12整数");
    if (valueList[2] < 0 || valueList[2] > 1) return window.alert("服务器标号不能是0或者1以外的内容");
    if (valueList[3] <= 0) return window.alert("关注一个不可能达到的价格是不可行的");
    // if (runtime_data.market_price_tracker_list.length >= 10) return window.alert("不允许监听十个以上的物品，防止海量的请求");
    runtime_data.market_price_tracker_list.forEach((item) => {
      if (item.id == valueList[0] && item.realm == valueList[2] && item.quality == valueList[1]) exist = true;
    });
    if (exist) return window.alert("该品质的物品在该服务器已经监控了，不要重复添加。");
    runtime_data.market_price_tracker_list.push({
      id: valueList[0],
      quality: valueList[1],
      realm: valueList[2],
      target_price: valueList[3],
    });
    window.alert(`已将数据提交。请点击保存并重启按钮应用设置。`);
  };
  tools_func.ui_set_submit_7_sub3 = () => {
    // 删除
    let valueList = [];
    document.querySelectorAll("#setting-container-7 td > input").forEach((item) => valueList.push(item.value));
    valueList = valueList.map((value, index) => (index <= 2 ? Math.floor(value) : value));
    tools_func.log(valueList);
    if (valueList[0] <= 0) return window.alert("资源id不能小于1");
    if (valueList[1] < 0 || valueList[1] > 12) return window.alert("资源品质不合法，只允许0-12整数");
    if (valueList[2] < 0 || valueList[2] > 1) return window.alert("服务器标号不能是0或者1以外的内容");
    let itemIndex = runtime_data.market_price_tracker_list.findIndex((item) => {
      return item.id == valueList[0] && item.quality == valueList[1] && item.realm == valueList[2];
    });
    if (itemIndex == -1) return window.alert("没有找到该监控对象");
    runtime_data.market_price_tracker_list.splice(itemIndex, 1);
    window.alert("已经删除对该目标的监控，请点击保存并重启按钮应用设置。");
  };
  tools_func.ui_set_submit_8 = () => {
    let valueList = [];
    document.querySelectorAll("#setting-container-8 input").forEach((item) => valueList.push(item.value));
    if (valueList[0] == "") valueList[0] = "9AM";
    feature_config.custom_quantity_button.buttonText = valueList[0];
    tools_func.indexedDB.updateRuntimeData();
    window.alert("已提交更改。");
  };
  tools_func.ui_set_submit_9 = () => {
    let value = document.querySelector("#setting-container-9 textarea").value;
    if (/^https:\/\/[\w.-]+\.[a-zA-Z]{2,}/.test(value)) {
      feature_config.easy_text.backGround = `url(${value})`;
    } else if (tools_func.color_reg(value)) {
      feature_config.easy_text.backGround = value;
    } else if (value == "") {
      feature_config.easy_text.backGround = "rgb(0,0,0,0.5)";
    }
    tools_func.indexedDB.updateFeatureConf();
    window.alert("已提交更改");
  };
  tools_func.ui_set_submit_10 = () => {
    let value = document.querySelector("#setting-container-10 input").value;
    if (value == "") value = 0;
    if (parseFloat(value) < 0 || parseFloat(value) >= 100) return window.alert("你这。。。。输入的值。。。认真的？");
    feature_config.warehouse_profit_count_mpOffest.mp_offest = parseFloat(value);
    tools_func.indexedDB.updateFeatureConf();
    window.alert("已提交更改");
  }
  tools_func.purchase_by_money_sub1 = async (event) => {
    let quality = parseInt(document.querySelector("#script_quality_Inp").value) || 0;
    let amount = document.querySelector("#script_amount_Inp").value;
    let res_id = parseInt(location.href.match(/\d+(?=\/$)/)?.[0]);
    let temp_cost = 0.0;
    let quantity = 0;
    let maxPrice = 0.0;
    if (quality == "") quality = 0;
    if (quality < 0 || quality > 12) return window.alert("品质输入有误");
    if (amount == "" || amount < 0) return window.alert("金额输入有误");
    let market_data = await tools_func.get_net_data(`${base_URL_list.market_price}/0/${res_id}/#${tools_func.generateUUID()}`);
    if (!market_data) return window.alert("交易行资源请求失败，请重试或检查网络连接。");
    for (let i = 0; i < market_data.length; i++) {
      let element = market_data[i];
      if (element.quality < quality) continue;
      if (amount > temp_cost + element.price * element.quantity) {
        temp_cost += element.price * element.quantity;
        quantity += element.quantity;
        continue;
      }
      quantity += (amount - temp_cost) / element.price;
      quantity = parseInt(quantity);
      maxPrice = element.price;
      break;
    }
    let userConfirm = window.confirm(
      `使用金额限定从交易行购买 - \n    最大价格:${maxPrice}, \n    最低质量:${quality}, \n    物品数量:${quantity - 1
      }, \n    物品ID:${res_id}\n是否确定？`
    );
    if (!userConfirm) return;
    try {
      document.querySelectorAll("form ul[role='menu'] li > a")[quality].click();
    } catch { }
    tools_func.set_input_new_value(document.querySelector("form input[name='quantity']"), quantity - 1);
    setTimeout(() => document.querySelector("form button[type=submit]").click(), 100);
  };
  tools_func.color_reg = (input) => {
    return /^#[0-9a-fA-F]{6}$/.test(input) || /^rgba?\((\s*\d+\s*,){2}\s*\d+(\.\d+)?(\s*,\s*\d+(\.\d+)?)?\s*\)$/.test(input);
  };
  tools_func.get_chat_item_list = function (node) {
    let outputList = [];
    node.querySelectorAll("span > span[attr-to]").forEach((item) => {
      try {
        let result = parseInt(
          item
            .getAttribute("attr-to")
            .match(/resource\/\d+/)[0]
            .replace("resource/", "")
        );
        if (outputList.includes(result)) return;
        outputList.push(result);
      } catch (error) {
        tools_func.error(error);
      }
    });
    return outputList;
  };
  tools_func.easy_text_btn = () => {
    let flag = runtime_data.easyTextFunc.displayFlag;
    if (flag) {
      runtime_data.easy_text = runtime_data.easyTextFunc.textareaNode.value;
      tools_func.indexedDB.updateRuntimeData();
    } else {
      runtime_data.easyTextFunc.textareaNode.value = runtime_data.easy_text;
    }
    Object.assign(runtime_data.easyTextFunc.divNode.style, {
      display: flag ? "none" : "block",
      background: feature_config.easy_text.backGround,
    });
    runtime_data.easyTextFunc.displayFlag = !flag;
  };
  tools_func.automatic_inquiry_sub1 = (input) => {
    // [resID, name, quantity, quality, unitPrice, totalPrice, from]
    let output = [];
    let matchOut = [];
    matchOut = input.match(/(\d+)\squality\s(\d+)\s(.+?)\s/);
    output.push(tools_func.get_index_by_name(matchOut[3]));
    output = output.concat([matchOut[3], matchOut[1], matchOut[2]]);
    matchOut = input.match(/\$(\d+.\d+)/g);
    output = output.concat([parseFloat(matchOut[0].replace("$", "")), parseFloat(matchOut[1].replace("$", ""))]);
    output.push(input.match(/from.+?(.+)/)[1]);
    return output;
  };
  tools_func.indexedDB.openDB = async () => {
    return new Promise((resolve, reject) => {
      let indexedDB = runtime_data.indexedDB;
      let request = window.indexedDB.open(indexedDB.db_name, indexedDB.db_version);
      request.onupgradeneeded = (event) => {
        // 数据库更新和数据库创建
        indexedDB.dbObj = event.target.result;
        if (!indexedDB.dbObj.objectStoreNames.contains(indexedDB.store_name)) {
          indexedDB.storeObj = indexedDB.dbObj.createObjectStore(indexedDB.store_name, { keyPath: "id" });
        }
      };
      request.onerror = function () {
        reject("打开数据库失败");
      };
      request.onsuccess = function (event) {
        indexedDB.dbObj = event.target.result;
        indexedDB.open_falg = true;
        resolve("数据库连接完毕");
      };
    });
  };
  tools_func.indexedDB.addData = async (data, id) => {
    return new Promise((resolve, reject) => {
      if (!runtime_data.indexedDB.open_falg) reject("数据库未打开");
      if (!data.id && !id) reject("数据缺少id主键");
      if (id) data = { id, ...data };
      let request = runtime_data.indexedDB.dbObj
        .transaction(runtime_data.indexedDB.store_name, "readwrite")
        .objectStore(runtime_data.indexedDB.store_name)
        .add(data);
      request.onsuccess = () => resolve("数据添加成功");
      request.onerror = () => reject("数据添加失败");
    });
  };
  tools_func.indexedDB.deleteData = async (id) => {
    return new Promise((resolve, reject) => {
      if (!runtime_data.indexedDB.open_falg) reject("数据库未打开");
      if (!id) reject("缺少id主键");
      let request = runtime_data.indexedDB.dbObj
        .transaction(runtime_data.indexedDB.store_name, "readwrite")
        .objectStore(runtime_data.indexedDB.store_name)
        .delete(id);
      request.onsuccess = () => resolve("数据删除成功");
      request.onerror = () => reject("数据删除失败");
    });
  };
  tools_func.indexedDB.updateData = async (data, id) => {
    return new Promise((resolve, reject) => {
      if (!runtime_data.indexedDB.open_falg) reject("数据库未打开");
      if (!data.id && !id) reject("缺少id主键");
      if (id) data = { id, ...data };
      let request = runtime_data.indexedDB.dbObj
        .transaction(runtime_data.indexedDB.store_name, "readwrite")
        .objectStore(runtime_data.indexedDB.store_name)
        .put(data);
      request.onsuccess = () => resolve("数据更新成功");
      request.onerror = () => reject("数据更新失败");
    });
  };
  tools_func.indexedDB.getData = async (id) => {
    return new Promise((resolve, reject) => {
      if (!runtime_data.indexedDB.open_falg) reject("数据库未打开");
      if (!id) reject("缺少id主键");
      let request = runtime_data.indexedDB.dbObj
        .transaction(runtime_data.indexedDB.store_name, "readonly")
        .objectStore(runtime_data.indexedDB.store_name)
        .get(id);
      request.onsuccess = () => resolve(Boolean(request.result) ? request.result : null);
      request.onerror = () => reject("数据查询失败");
    });
  };
  tools_func.indexedDB.loadRuntimeData = async () => {
    let dbData = await tools_func.indexedDB.getData("runtime_data");
    if (!dbData) {
      // 存入数据
      tools_func.indexedDB.updateRuntimeData();
    } else {
      // 读取数据
      delete dbData.id;
      runtime_data.warehouse = !!dbData.warehouse ? dbData.warehouse : {};
      runtime_data.resource_pool = !!dbData.resource_pool ? dbData.resource_pool : {};
      runtime_data.buildings = !!dbData.buildings ? dbData.buildings : [];
      runtime_data.market_price_tracker_list = !!dbData.market_price_tracker_list ? dbData.market_price_tracker_list : [];
      runtime_data.easy_text = !!dbData.easy_text ? dbData.easy_text : "";
    }
  };
  tools_func.indexedDB.loaduuid = async () => {
    let dbData = await tools_func.indexedDB.getData("uuid");
    if (dbData) return (runtime_data.userUUID = dbData.uuid);
    let newID = tools_func.generateUUID();
    tools_func.indexedDB.addData({ id: "uuid", uuid: newID });
  };
  tools_func.indexedDB.loadFeatureConf = async () => {
    let dbData = await tools_func.indexedDB.getData("feature_conf");
    let fVersion = feature_config.version;
    // 因为函数指向不能序列化，所以不存储函数指向
    if (!dbData) {
      // 数据不存在
      tools_func.indexedDB.addData(tools_func.format_obj_L_feaConf(), "feature_conf");
    } else {
      // 数据正常存在，合并现有数据
      delete dbData.id;
      for (let key in dbData) {
        feature_config[key] = typeof dbData[key] === "object" ? { ...feature_config[key], ...dbData[key] } : dbData[key];
      }
    }
    if (dbData && dbData.version < fVersion) {
      feature_config.version = fVersion;
      tools_func.indexedDB.updateFeatureConf();
    }
  };
  tools_func.indexedDB.updateFeatureConf = async () => {
    await tools_func.indexedDB.updateData(tools_func.format_obj_L_feaConf(), "feature_conf");
  };
  tools_func.indexedDB.updateRuntimeData = async () => {
    return await tools_func.indexedDB.updateData({
      id: "runtime_data",
      warehouse: runtime_data.warehouse,
      resource_pool: runtime_data.resource_pool,
      buildings: runtime_data.buildings,
      market_price_tracker_list: runtime_data.market_price_tracker_list,
      easy_text: runtime_data.easy_text,
    });
  };
  tools_func.indexedDB.resetConf = async () => {
    await tools_func.indexedDB.deleteData("feature_conf");
    await tools_func.indexedDB.deleteData("runtime_data");
    return true;
  };
  tools_func.notification.notification_check = async (payload, update = false) => {
    if (!window.Notification || Notification.permission == "denied" || (!!payload && payload === "denied")) {
      if (update) window.alert(`浏览器通知接口获取失败，可能是以下原因：\n  1.浏览器不支持\n  2.权限未同意`);
      return false;
    } else if (Notification.permission == "granted" || payload == "granted") {
      return true;
    } else if (Notification.permission == "default") {
      let newPermission = await Notification.requestPermission();
      return await tools_func.notification.notification_check(newPermission);
    }
  };
  tools_func.notification.send_msg = (title, body = "无内容") => {
    if (!runtime_data.notification.permission || !title) return;
    if (feature_config.notification_kind == 0) return new Notification(title, { body });
    if (feature_config.notification_kind == 1) {
      let time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
      let newTR = document.createElement("tr");
      newTR.innerHTML = `<td>${time}</td><td>${title}</td><td>${body}</td>`;
      runtime_data.notification.displayTargetNode.appendChild(newTR);
      Object.assign(runtime_data.notification.displayButtonNode.style, { backgroundColor: "red" });
      tools_func.log(`newMessgae ${time} ${title} ${body}`);
    }
  };
  tools_func.notification.build_msg_container = () => {
    if (feature_config.notification_kind != 1) return;
    let runtimeData = runtime_data.notification;
    // #script_msg_container displayNode
    // #script_msg_container_button  displayButtonNode
    if (!runtimeData.displayNode) {
      let newNode = document.createElement("div");
      newNode.id = "script_msg_container";
      newNode.innerHTML = `<div id=script_msg_container><table><tr><td>时间<td>标题<td>内容</table></div>`;
      runtimeData.displayNode = newNode.firstChild;
      runtimeData.displayTargetNode = newNode.querySelector("table > tbody");
    }

    if (!runtimeData.displayButtonNode) {
      let newNode = document.createElement("button");
      newNode.id = "script_msg_container_button";
      newNode.innerText = "MSG";
      runtimeData.displayButtonNode = newNode;

      newNode.addEventListener("click", (event) => {
        let target_node = document.querySelector("#script_msg_container");
        Object.assign(target_node.style, { display: runtimeData.displayFlag ? "none" : "block" });
        Object.assign(runtimeData.displayButtonNode.style, { backgroundColor: "rgb(107,107,107)" });
        runtimeData.displayFlag = !runtimeData.displayFlag;
      });
    }

    if (!document.querySelector("#script_msg_container")) document.body.appendChild(runtimeData.displayNode);
    if (!document.querySelector("#script_msg_container_button")) document.body.appendChild(runtimeData.displayButtonNode);
  };
  tools_func.intervalFunc = () => {
    if (location.href == runtime_data.lastURL) return;
    runtime_data.lastURL = location.href;
    tools_func.event_bus();
  };
  tools_func.cssLoad = () => {
    let styleElement = document.createElement("style");
    let pcCSS = `
    .script_tbody td {width: 50px !important;}
    .script_tbody .script_tbody_tr_1 {width: 90px !important;}
    .setting-container {background-color: rgb(34,34,34,.9);margin-bottom: 20px;height: 287px;overflow-y: auto;overflow-x: hidden;}
    .setting-container table > tbody > tr {height:25px;}
    .setting-container {color:${feature_config.font_color};}
    .setting-container input {background:rgb(34,34,34);color:${feature_config.font_color};}
    .setting-container button {background:rgb(34,34,34);color:${feature_config.font_color};border:solid 1px white;}
    .setting-container select {background:#222;color:${feature_config.font_color};border:solid 1px white;}
    .setting-container button:hover {color:${feature_config.font_color};font-weight:700;background:rgba(255,255,255,0.3);}
    .setting-container input.form-control , select.form-control {margin:auto;}
    #script_msg_container {color:${feature_config.font_color};display:none;position:fixed;bottom:0px;height:200px;width:100%;background-color:rgb(0,0,0,0.8);z-index:2000;overflow-x:hidden;overflow-y:auto;}
    #script_msg_container table{border-collapse:separate;border-spacing:10px;}
    #script_msg_container tbody>tr{margin-bottom:10px;text-align:left;vertical-align:top;}
    #script_msg_container tbody>tr>td:first-child{max-width:50px;}
    #script_msg_container tbody>tr>td:nth-child(2){max-width:100px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}
    button#script_msg_container_button{color:${feature_config.font_color};text-align:center;display:block;position:fixed;right:10px;bottom:10px;width:fit-content;height:fit-content;z-index:2001;border-radius:5px;border:1px solid white;background-color:rgb(107,107,107);}
    button.btn.script_custom_button {color:${feature_config.font_color};margin-right:2px}
    button.btn.script_custom_button:hover {background-color: rgb(184,184,184);color: black;}
    #retail_display_div {color:${feature_config.font_color};border-radius:5px;background-color:rgba(0, 0, 0, 0.5);position:fixed;top:50%;right:0;transform: translateY(-50%);width:150px;z-index:1032;justify-content:center;align-items:center;}
    button#script_easeyText_button{color:${feature_config.font_color};text-align:center;display:block;position:fixed;left:10px;bottom:10px;width:fit-content;height:fit-content;z-index:2001;border-radius:5px;border:1px solid white;}
    div#script_easeyText_div {background: ${feature_config.easy_text.backGround};background-repeat:no-repeat;background-position:center;background-size:cover; position: fixed;display: none;width: 100%;height: 100%;bottom: 0;left: 0;z-index: 1031;padding: 10px;}
    textarea#script_easyText_textArea {color:${feature_config.font_color};resize: none;height: 100%;width: 100%;background: rgba(0, 0, 0, 0);border-radius: 5px;box-shadow: 0 0 7px 1px rgb(255,255,255,0.8);}
    `;
    let androidCSS = `
    .script_tbody td {width: 50px !important;}
    .script_tbody .script_tbody_tr_1 {width: 90px !important;}
    .setting-container {background-color: rgb(34,34,34,.9);margin-bottom: 20px;height: 287px;overflow-y: auto;overflow-x: hidden;}
    .setting-container table > tbody > tr {height:25px;}
    .setting-container {color:${feature_config.font_color};}
    .setting-container input {background:rgb(34,34,34);color:${feature_config.font_color};}
    .setting-container button {background:rgb(34,34,34);color:${feature_config.font_color};border:solid 1px white;}
    .setting-container select {background:#222;color:${feature_config.font_color};border:solid 1px white;}
    .setting-container button:hover {color:${feature_config.font_color};font-weight:700;background:rgba(255,255,255,0.3);}
    .setting-container input.form-control , select.form-control {margin:auto;}
    #script_msg_container {color:${feature_config.font_color};display:none;position:fixed;bottom:0px;height:200px;width:100%;background-color:rgb(0,0,0,0.8);z-index:2000;overflow-x:hidden;overflow-y:auto;}
    #script_msg_container table{border-collapse:separate;border-spacing:10px;}
    #script_msg_container tbody>tr{margin-bottom:10px;text-align:left;vertical-align:top;}
    #script_msg_container tbody>tr>td:first-child{max-width:50px;}
    #script_msg_container tbody>tr>td:nth-child(2){max-width:100px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}
    button#script_msg_container_button{color:${feature_config.font_color};text-align:center;display:block;position:fixed;right:10px;bottom:10px;width:fit-content;height:fit-content;z-index:2001;border-radius:5px;border:1px solid white;background-color:rgb(107,107,107);}
    button.btn.script_custom_button {color:${feature_config.font_color};margin-right:2px}
    button.btn.script_custom_button:hover {background-color: rgb(184,184,184);color: black;}
    #retail_display_div {color:${feature_config.font_color};border-radius:5px;background-color:rgba(0, 0, 0, 0.5);position:fixed;top:50%;right:0;transform: translateY(-50%);width:150px;z-index:1032;justify-content:center;align-items:center;}
    button#script_easeyText_button{color:${feature_config.font_color};text-align:center;display:block;position:fixed;left:10px;bottom:10px;width:fit-content;height:fit-content;z-index:2001;border-radius:5px;border:1px solid white;}
    div#script_easeyText_div {background: ${feature_config.easy_text.backGround};position: fixed;display: none;width: 100%;height: 40%;bottom: 0;left: 0;z-index: 1031;padding: 10px;}
    textarea#script_easyText_textArea {color:${feature_config.font_color};resize: none;height: 100%;width: 100%;background: rgba(0, 0, 0, 0);border-radius: 5px;box-shadow: 0 0 7px 1px rgb(255,255,255,0.8);}
    `;
    styleElement.textContent = runtime_data.window_HorV == 0 ? pcCSS : androidCSS;
    document.head.appendChild(styleElement);
  };
  tools_func.init = async function () {
    // 获取屏幕横纵
    runtime_data.window_HorV = window.innerHeight > window.innerWidth ? 1 : 0;

    // IndexedDB数据库操作
    await tools_func.indexedDB.openDB();
    let loadCount = await tools_func.indexedDB.getData("loadCount");
    if (!loadCount) {
      loadCount = { id: "loadCount", count: 1 };
      tools_func.indexedDB.addData(loadCount);
    } else {
      loadCount.count++;
      tools_func.indexedDB.updateData(loadCount);
    }
    await tools_func.indexedDB.loadFeatureConf();
    await tools_func.indexedDB.loadRuntimeData();
    await tools_func.indexedDB.loaduuid();

    // 检测通知权限
    if (feature_config.notification_kind == 0) {
      runtime_data.notification.permission = await tools_func.notification.notification_check();
      tools_func.log(runtime_data.notification.permission);
    } else if (feature_config.notification_kind == 1) {
      tools_func.notification.build_msg_container();
      runtime_data.notification.permission = true;
    }

    // 将net功能到制定列表中 将startup功能直接启动
    for (const key in feature_config) {
      let item = feature_config[key];
      if (!(typeof item === "object" && item !== null)) {
        continue;
      } else if (item.type == "net") {
        if (!item.func) {
          delete feature_config[key];
          continue;
        }
        runtime_data.net_match_list.push({ match: item.url_match, func: item.func });
      } else if (item.type == "startup" && item.enable) {
        tools_func.log("启动一个自启动功能", item);
        item.func();
      }
    }
    tools_func.log("网络截取功能：", runtime_data.net_match_list);

    // 创建插件自己的css标签与内容
    tools_func.cssLoad();

    // 触发仓库资源请求
    tools_func.update_warehouse_data();

    // 获取当前账号信息
    tools_func.geiPlayerInfo();

    // 初始化记录
    console.log(`SimComps-Tools脚本已初始化完成，感谢您的使用，有错误或建议可以加入qq群： 926159075 `);

    // 更新标记
    runtime_data.main_script_load_acc = true;
  };
  tools_func.event_bus = function (event) {
    if (!runtime_data.main_script_load_acc) return;
    if (event) runtime_data.tapCount++;
    tools_func.log(event);
    for (const key in feature_config) {
      let item = feature_config[key];
      if (!(typeof item === "object" && item !== null)) continue;
      if (item.type != "common-debounce" && item.type != "common") continue;
      let info_match = false;
      try {
        info_match = item.match(event);
      } catch {
        info_match = false;
      }
      if (!item.debounce && info_match) {
        setTimeout(function () {
          try {
            item.func(event);
          } catch (error) {
            tools_func.error(error);
          }
        }, 1);
      } else if (item.debounce && runtime_data.tapCount % item.debounce == 0 && info_match) {
        setTimeout(function () {
          try {
            item.func(event);
          } catch (error) {
            tools_func.error(error);
          }
        }, 1);
      } else {
        tools_func.log("未触发任何事件");
      }
    }
  };
  // 设置面板挂载html对象
  const ui_setting_interface = {};
  // 功能开关面板
  ui_setting_interface.main = (judgmentMark, mainSetTargetNode) => {
    // 功能开关面板
    if (!judgmentMark.DATA_main_container && !judgmentMark.DOM_main_container) {
      // 创建标签并挂载
      let mainSetNode = document.createElement("div");
      let htmlText = `<div class="col-sm-6 setting-container" id=setting-container-1><div><div class='header' style=background-color:rgb(0,0,0,.1);text-align:center;font-size:15px;font-weight:700>插件功能开关界面</div><div class=container style=width:100%;display:block;margin-top:10px;margin-bottom:10px><div><div class=col-sm-6><span style="display:block;width:fit-content;height:fit-content;margin:10px auto">鼠标悬停在功能名称上可以查看描述</span></div><div class=col-sm-6><button class="script_opt_submit btn" style=margin:auto;display:block;font-size:20px>保存</button></div></div><table style="text-align: center;width: 100%;height: 100%;">`;
      htmlText += tools_func.format_HTML_2(Object.values(feature_config));
      htmlText += "</table></div></div></div>";
      mainSetNode.innerHTML = htmlText;
      mainSetTargetNode.appendChild(mainSetNode.firstChild);
      runtime_data.ui_setting.mainSetNode = mainSetNode.firstChild;
      // 绑定保存按钮功能
      document.querySelector("#setting-container-1 button").addEventListener("click", tools_func.ui_set_submit_1);
    } else if (judgmentMark.DATA_main_container && !judgmentMark.DOM_main_container) {
      // 重新挂载
      mainSetTargetNode.appendChild(runtime_data.ui_setting.mainSetNode);
    }
  };
  // 插件通用设置
  ui_setting_interface.base = (judgmentMark, mainSetTargetNode) => {
    // 插件基础设置
    if (!judgmentMark.DATA_base_container && !judgmentMark.DOM_base_container) {
      // 创建并挂载
      let mainSetNode = document.createElement("div");
      let htmlText = `<div class="col-sm-6 setting-container" id=setting-container-2><div><div class=header style=background-color:rgb(0,0,0,.1);text-align:center;font-size:15px;font-weight:700>插件基础功能设置</div><div class=container style=width:100%;display:block;margin-top:10px;margin-bottom:10px><div><div><button style=width:80%;height:49px;margin:auto;display:block;font-size:20px class="btn script_opt_submit">保存</button></div></div><table style=text-align:center;width:100%;height:100%><tr style=height:60px><td>功能<td>设置<tr><td title=打开debug模式会有非常多的控制台信息，严重影响性能，不知道是什么，请勿打开。>DEBUG模式<td><input type=checkbox #####><tr><td title=同一个地址，同一个请求方法的最小时间间隔，防止被服务器ban>通用网络请求最小间隔<td><input class=form-control style=text-align:center;width:100px value=##### type=number><tr><td title=只是拿来看的，不允许编辑>配置对象的版本信息<td><span>#####</span><tr><td title=插件文字文本颜色，默认是#ffffff，也就是不透明白色>插件文字文本颜色<td><input class=form-control style=text-align:center;width:100px value=#####><tr><td title="0. Notification原生对象 （除pc浏览器以外都不可用）\n1.[默认]网页内弹提示">插件通知模式<td><select style=text-align:center;width:100px><option value=0>Notification原生对象<option value=1>网页内弹提示</select><tr><td title=没有实际需要或者开发者引导，不要随意尝试。>重置插件配置数据<td><button style=text-align:center;width:100px>重置</button></table></div></div></div>`;
      htmlText = htmlText.replace("#####", feature_config.debug ? "checked" : "");
      htmlText = htmlText.replace("#####", feature_config.net_gap_ms.toString());
      htmlText = htmlText.replace("#####", feature_config.version.toString());
      htmlText = htmlText.replace("#####", feature_config.font_color.toString());
      mainSetNode.innerHTML = htmlText;
      mainSetTargetNode.appendChild(mainSetNode.firstChild);
      runtime_data.ui_setting.baseSetNode = mainSetNode.firstChild;
      let selectList = mainSetTargetNode.querySelectorAll("#setting-container-2 select");
      selectList[0].value = feature_config.notification_kind.toString();
      // 绑定按钮功能
      let buttonList = document.querySelectorAll("#setting-container-2 button");
      buttonList[0].addEventListener("click", tools_func.ui_set_submit_2);
      buttonList[1].addEventListener("click", () => {
        tools_func.indexedDB.resetConf();
        window.alert("已清除IndexedDB缓存，您的插件设置会被还原。");
        location.reload();
      });
    } else if (judgmentMark.DATA_base_container && !judgmentMark.DOM_base_container) {
      // 重新挂载
      mainSetTargetNode.appendChild(runtime_data.ui_setting.baseSetNode);
    }
  };
  // 聊天室自动询价功能设置
  ui_setting_interface.chat = (judgmentMark, mainSetTargetNode) => {
    // 聊天室自动询价设置
    if (!judgmentMark.DATA_mpdisplay_container && !judgmentMark.DOM_mpdisplay_container) {
      // 创建并挂载
      let mainSetNode = document.createElement("div");
      let htmlText = `<div class="col-sm-6 setting-container" id=setting-container-3><div><div class=header style=background-color:rgb(0,0,0,.1);text-align:center;font-size:15px;font-weight:700>聊天室自动询价设置</div><div class=container style=width:100%;display:block;margin-top:10px;margin-bottom:10px><div><div><button class="script_opt_submit btn" style=width:80%;height:49px;margin:auto;display:block;font-size:20px>保存</button></div></div><table style=text-align:center;width:100%;height:100%><tr style=height:60px><td>功能<td>设置<tr><td title=无论物品数量都只显示指定时长单位毫秒如果设定为0秒就会使用自适应显示时间>强制显示时间<td><input class='form-control' style=text-align:center;width:100px type=number value=display_ms><tr><td title="根据物品数量自动设置显示时间 单位毫秒 实际显示时间为：所有物品加载完毕后 数量*这个设置的时间">自适应显示时间<td><input class='form-control' style=text-align:center;width:100px type=number value=display_auto_ms><tr><td title=在自动询价时会强制显示这个品质的价格>关注的品质<td><input class='form-control' style=text-align:center;width:100px type=number value=focus_q><tr><td title="mp-目标折扣% 将此项目设定为0将不强制计算折扣">目标折扣<td><input class='form-control' style=text-align:center;width:100px type=number value=focus_offset></table></div></div></div>`;
      htmlText = htmlText.replace("display_ms", feature_config.chatroom_mp_display.display_ms.toString());
      htmlText = htmlText.replace("display_auto_ms", feature_config.chatroom_mp_display.display_auto_ms.toString());
      htmlText = htmlText.replace("focus_q", feature_config.chatroom_mp_display.focus_q.toString());
      htmlText = htmlText.replace("focus_offset", feature_config.chatroom_mp_display.focus_offset.toString());
      mainSetNode.innerHTML = htmlText;
      mainSetTargetNode.appendChild(mainSetNode.firstChild);
      runtime_data.ui_setting.chatroom_mp_display_SetNode = mainSetNode.firstChild;
      // 绑定按键
      document.querySelector("#setting-container-3 button").addEventListener("click", tools_func.ui_set_submit_3);
    } else if (judgmentMark.DATA_mpdisplay_container && !judgmentMark.DOM_mpdisplay_container) {
      // 重新挂载
      mainSetTargetNode.appendChild(runtime_data.ui_setting.chatroom_mp_display_SetNode);
    }
  };
  // 自定义背景功能设置
  ui_setting_interface.cust_back_img = (judgmentMark, mainSetTargetNode) => {
    // 自定义背景图片
    if (!judgmentMark.DATA_backImage_container && !judgmentMark.DOM_backImage_container) {
      // 创建并挂载
      let mainSetNode = document.createElement("div");
      let htmlText = `<div class="col-sm-6 setting-container"   id=setting-container-4><div><div class="fr-fix-6dbc5052 header"style=background-color:rgb(0,0,0,.1);text-align:center;font-size:15px;font-weight:700>自定义背景图片设置</div><div class=container style=width:100%;display:block;margin-top:10px;margin-bottom:10px><div><div><button class="btn script_opt_submit"style=width:80%;height:49px;margin:auto;display:block;font-size:20px>保存</button></div></div><table style=text-align:center;width:100%;height:100%><tr style=height:60px><td>功能<td>设置<tr style=height:120px><td title=请注意被访问地址的开放性>背景CSS内容<td><textarea style=background-color:rgb(34,34,34);min-width:60px;min-height:120px;max-height:125px;text-align:center;max-width:257px;height:154px;width:313px></textarea></table></div></div></div>`;
      mainSetNode.innerHTML = htmlText;
      mainSetNode.querySelector("textarea").value = feature_config.custom_background_image.cssText;
      mainSetTargetNode.appendChild(mainSetNode.firstChild);
      runtime_data.ui_setting.back_image_SetNode = mainSetNode.firstChild;
      // 绑定按钮事件
      document.querySelector("#setting-container-4 button").addEventListener("click", (event) => {
        let itemValue = document.querySelector("#setting-container-4 textarea").value;
        let url_reg = /^https:\/\/[\w.-]+\.[a-zA-Z]{2,}/;
        let color_reg = tools_func.color_reg(itemValue);

        if (itemValue == "" || color_reg) {
          feature_config.custom_background_image.cssText = itemValue;
        } else if (url_reg.test(itemValue)) {
          feature_config.custom_background_image.cssText = `url(${itemValue})`;
        } else {
          return window.alert("内容不正确，允许以下类型的内容：\n  #121212\n  rgb(1,1,35)\n  http://image.url");
        }
        tools_func.indexedDB.updateFeatureConf();
        custom_background_image();
        window.alert("更改已提交");
      });
    } else if (judgmentMark.DATA_backImage_container && !judgmentMark.DOM_backImage_container) {
      // 重新挂载
      mainSetTargetNode.appendChild(runtime_data.ui_setting.back_image_SetNode);
    }
  };
  // 一键收取功能设置
  ui_setting_interface.click_harvest = (judgmentMark, mainSetTargetNode) => {
    // 一键收取设置
    if (!judgmentMark.DATA_clickHarvest_container && !judgmentMark.DOM_clickHarvest_container) {
      // 创建并挂载
      let mainSetNode = document.createElement("div");
      let htmlText = `<div class="col-sm-6 setting-container"  id=setting-container-5><div><div class=header style=background-color:rgb(0,0,0,.1);text-align:center;font-size:15px;font-weight:700>一键收菜设置</div><div class=container style=width:100%;display:block;margin-top:10px;margin-bottom:10px><div><div><button class="btn script_opt_submit"style=width:80%;height:49px;margin:auto;display:block;font-size:20px>保存</button></div></div><table style=text-align:center;width:100%;height:100%><tr style=height:60px><td>功能<td>设置<tr><td title=在这里设置按钮的文本内容>按钮内容文本<td><input class='form-control' style=text-align:center;width:100px value=####><tr><td title="0.右上角 - 在头像右边  \n1.左上角 - 在领域服务器标左边  \n2.悬浮 - 在地图正下方，底栏上方">按钮位置<td><select value=####><option value=0>右上角<option value=1>左上角<option value=2>悬浮</select></table></div></div></div>`;
      htmlText = htmlText.replace("####", feature_config.one_click_harvest.text.toString());
      htmlText = htmlText.replace("####", feature_config.one_click_harvest.position);
      mainSetNode.innerHTML = htmlText;
      mainSetNode.querySelector("select").value = feature_config.one_click_harvest.position;
      runtime_data.ui_setting.clickHarvest = mainSetNode.firstChild;
      mainSetTargetNode.appendChild(runtime_data.ui_setting.clickHarvest);
      // 绑定事件
      document.querySelector("#setting-container-5 button").addEventListener("click", tools_func.ui_set_submit_5);
    } else if (judgmentMark.DATA_clickHarvest_container && !judgmentMark.DOM_clickHarvest_container) {
      // 重新挂载
      mainSetTargetNode.appendChild(runtime_data.ui_setting.clickHarvest);
    }
  };
  // 建筑项目完工提示设置
  ui_setting_interface.builds_end = (judgmentMark, mainSetTargetNode) => {
    if (!judgmentMark.DATA_building_end_container && !judgmentMark.DOM_building_end_container) {
      let newNode = document.createElement("div");
      let htmlText = `<div class="col-sm-6 setting-container"  id=setting-container-6><div><div class=header style=background-color:rgb(0,0,0,.1);text-align:center;font-size:15px;font-weight:700>建筑项目完工提醒设置</div><div class=container style=width:100%;display:block;margin-top:10px;margin-bottom:10px><div><div><button class="btn script_opt_submit"style=width:80%;height:49px;margin:auto;display:block;font-size:20px>保存</button></div></div><table style=text-align:center;width:100%;height:100%><tr style=height:60px><td>功能<td>设置<tr><td title=单个检查的周期，默认5分钟，单位毫秒>检查时间间隔<td><input class='form-control' style=text-align:center;width:100px value=##### type=number><tr><td title=发送信息的标题>信息标题<td><input class='form-control' style=text-align:center;width:100px value=#####><tr><td title=信息内容>信息内容<td><input class='form-control' style=text-align:center;width:100px value=#####></table></div></div></div>`;
      htmlText = htmlText.replace("#####", `"${feature_config.building_work_end_notification.time2gap.toString()}"`);
      htmlText = htmlText.replace("#####", `"${feature_config.building_work_end_notification.msg_title}"`);
      htmlText = htmlText.replace("#####", `"${feature_config.building_work_end_notification.msg_body}"`);
      newNode.innerHTML = htmlText;
      runtime_data.ui_setting.building_end = newNode.firstChild;
      mainSetTargetNode.appendChild(runtime_data.ui_setting.building_end);
      // 绑定事件
      document.querySelector("#setting-container-6 button").addEventListener("click", tools_func.ui_set_submit_6);
    } else if (judgmentMark.DATA_building_end_container && !judgmentMark.DOM_building_end_container) {
      mainSetTargetNode.appendChild(runtime_data.ui_setting.building_end);
    }
  };
  // 交易所低价提示设置
  ui_setting_interface.market_low_price = (judgmentMark, mainSetTargetNode) => {
    if (!judgmentMark.DATA_marketLowPrice_container && !judgmentMark.DOM_marketLowPrice_container) {
      let newNode = document.createElement("div");
      let htmlText = `<div   class="col-sm-6 setting-container"id=setting-container-7><div><div style=background-color:rgb(0,0,0,.1);text-align:center;font-size:15px;font-weight:700 class=header>交易所低价提示设置</div><div style=width:100%;display:block;margin-top:10px;margin-bottom:10px class=container><div><div><button class="btn script_opt_submit"style=width:80%;height:49px;margin:auto;display:block;font-size:20px>保存并重启监控</button></div></div><div style=text-align:center;width:100%;height:100%><div style=margin-top:10px class="buttonContainer row"><button class="btn col-sm-4 dbButton">罗列</button> <button class="btn col-sm-4 dbButton">增添</button> <button class="btn col-sm-4 dbButton">删除</button></div><table style=width:100%;margin-top:10px><tr><td>资源id<td><input class=form-control type=number><tr><td>资源品质<td><input class=form-control type=number><tr><td>服务器<td><input class=form-control type=number><tr><td>目标价格<td><input class=form-control type=number></table></div></div></div></div>`;
      newNode.innerHTML = htmlText;
      runtime_data.ui_setting.marketLowPrice = newNode.firstChild;
      mainSetTargetNode.appendChild(runtime_data.ui_setting.marketLowPrice);
      // 挂载按钮函数
      let dbButtonList = mainSetTargetNode.querySelectorAll("#setting-container-7 .dbButton.btn");
      mainSetTargetNode.querySelector("#setting-container-7 .script_opt_submit").addEventListener("click", tools_func.ui_set_submit_7);
      dbButtonList[0].addEventListener("click", tools_func.ui_set_submit_7_sub1);
      dbButtonList[1].addEventListener("click", tools_func.ui_set_submit_7_sub2);
      dbButtonList[2].addEventListener("click", tools_func.ui_set_submit_7_sub3);
    } else if (judgmentMark.DATA_marketLowPrice_container && !judgmentMark.DOM_marketLowPrice_container) {
      mainSetTargetNode.appendChild(runtime_data.ui_setting.marketLowPrice);
    }
  };
  // 自定义生产数量按钮
  ui_setting_interface.custom_quantity_button = (judgmentMark, mainSetTargetNode) => {
    if (!judgmentMark.DATA_marketLowPrice_container && !judgmentMark.DOM_marketLowPrice_container) {
      let newNode = document.createElement("div");
      let htmlText = `<div class="col-sm-6 setting-container"  id=setting-container-8><div><div class=header style=background-color:rgb(0,0,0,.1);text-align:center;font-size:15px;font-weight:700>自定义生产数量按钮</div><div class=container style=width:100%;display:block;margin-top:10px;margin-bottom:10px><div><div><button class="btn script_opt_submit"style=width:80%;height:49px;margin:auto;display:block;font-size:20px>保存</button></div></div><table style=text-align:center;width:100%;height:100%><tr style=height:60px><td>功能<td>设置<tr><td title=按钮的内容会直接填写在格子中>按钮文本<td><input class=form-control style=text-align:center;width:100px value=#####></table></div></div></div>`;
      htmlText = htmlText.replace("#####", feature_config.custom_quantity_button.buttonText);
      newNode.innerHTML = htmlText;
      runtime_data.ui_setting.customQuantityButton = newNode.firstChild;
      mainSetTargetNode.appendChild(runtime_data.ui_setting.customQuantityButton);
      // 按键函数挂载
      mainSetTargetNode.querySelector("#setting-container-8 button").addEventListener("click", tools_func.ui_set_submit_8);
    } else if (judgmentMark.DATA_marketLowPrice_container && !judgmentMark.DOM_marketLowPrice_container) {
      mainSetTargetNode.appendChild(runtime_data.ui_setting.customQuantityButton);
    }
  };
  // 随手记设置面板
  ui_setting_interface.easyText = (judgmentMark, mainSetTargetNode) => {
    if (!judgmentMark.DATA_easyText_container && !judgmentMark.DOM_easyText_container) {
      let newNode = document.createElement("div");
      let htmlText = `<div class="col-sm-6 setting-container" id=setting-container-9><div><div class="fr-fix-6dbc5052 fr-fix-bfa78f80 header"style=background-color:rgb(0,0,0,.1);text-align:center;font-size:15px;font-weight:700>随手记功能设置</div><div class=container style=width:100%;display:block;margin-top:10px;margin-bottom:10px><div><div><button class="btn script_opt_submit"style=width:80%;height:49px;margin:auto;display:block;font-size:20px>保存</button></div></div><table style=text-align:center;width:100%;height:100%><tr style=height:60px><td>功能<td>设置<tr style=height:120px><td title=请注意被访问地址的开放性>背景CSS内容<td><textarea style=background-color:#222;text-align:center;height:125px;width:257px;resize:none></textarea></table></div></div></div>`;
      newNode.innerHTML = htmlText;
      newNode.querySelector("textarea").value = feature_config.easy_text.backGround;
      runtime_data.ui_setting.easyText = newNode.firstChild;
      mainSetTargetNode.appendChild(runtime_data.ui_setting.easyText);
      // 挂载按钮
      mainSetTargetNode.querySelector("#setting-container-9 button").addEventListener("click", tools_func.ui_set_submit_9);
    } else if (judgmentMark.DATA_easyText_container && !judgmentMark.DOM_easyText_container) {
      mainSetTargetNode.appendChild(runtime_data.ui_setting.easyText);
    }
  };
  // 合同出售mp偏移设置面板
  ui_setting_interface.market_price_offset = (judgmentMark, mainSetTargetNode) => {
    if (!judgmentMark.DATA_mpOffest_container && !judgmentMark.DOM_mpOffest_container) {
      let newNode = document.createElement("div");
      let htmlText = `<div class="col-sm-6 setting-container"id=setting-container-10><div><div class=header style=background-color:rgb(0,0,0,.1);text-align:center;font-size:15px;font-weight:700>合同出售mp偏移值设置</div><div class=container style=width:100%;display:block;margin-top:10px;margin-bottom:10px><div><div><button class="btn script_opt_submit"style=width:80%;height:49px;margin:auto;display:block;font-size:20px>保存</button></div></div><table style=text-align:center;width:100%;height:100%><tr style=height:60px><td>功能<td>设置<tr><td title="直接填写整数，如果填写了小数会被舍弃小数部分。\n例如填写3 那就会计算mp-3">偏移百分比<td><input class=form-control style=text-align:center;width:100px type=number value=######></table></div></div></div>`;
      htmlText = htmlText.replace("######", feature_config.warehouse_profit_count_mpOffest.mp_offest.toString());
      newNode.innerHTML = htmlText;
      runtime_data.ui_setting.mpOffest = newNode.firstChild;
      mainSetTargetNode.appendChild(runtime_data.ui_setting.mpOffest);
      // 绑定按钮
      mainSetTargetNode.querySelector("div#setting-container-10 button.script_opt_submit").addEventListener("click", tools_func.ui_set_submit_10)
    } else if (judgmentMark.DATA_mpOffest_container && !judgmentMark.DOM_mpOffest_container) {
      mainSetTargetNode.appendChild(runtime_data.ui_setting.mpOffest);
    }
  }

  // 事件监控
  document.addEventListener("click", (event) => tools_func.event_bus(event));
  document.addEventListener("keydown", (event) => tools_func.event_bus(event));
  setInterval(tools_func.intervalFunc, 100);
  let rootObserveServer = new MutationObserver(() => tools_func.log("DOM变动"), tools_func.event_bus());
  rootObserveServer.observe(document.querySelector("div#root"), { childList: true, subtree: true });
  // xhr网络请求拦截处理
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    let xhr = new originalXHR();
    let originalOpen = xhr.open;
    xhr.open = function (method, url, async) {
      tools_func.log(`XHR request ${method} ${url}`);
      let originalOnLoad = xhr.onload;
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            let responseJson = JSON.parse(xhr.responseText);
            tools_func.log("XHR拦截器拦截到json响应体：", responseJson);
            runtime_data.net_match_list.forEach((item) => {
              if (!item.match || !item.func);
              if (item.match(url)) item.func(url, method, responseJson);
            });
          } catch (error) {
            tools_func.error(error);
          }
        }
        if (originalOnLoad) originalOnLoad.apply(this, arguments);
      };
      originalOpen.apply(this, arguments);
    };
    return xhr;
  };

  // 交易所、合同出售利润显示
  async function profit_display() {
    if (!feature_config.warehouse_profit_count.enable) return;
    // 利润 = 数量 * 单价 - (成本 * 单价 + 运输单位 * 运输单价 + 税费)
    let formNode = document.querySelector("form");
    tools_func.update_warehouse_data();
    try {
      // 检测并挂载显示标签
      let infoSpan;
      if (formNode.lastChild.querySelector("span")) {
        infoSpan = formNode.lastChild.querySelector("span");
      } else {
        infoSpan = document.createElement("span");
        infoSpan.innerText = "等待计算利润";
        formNode.lastChild.prepend(document.createElement("br"));
        formNode.lastChild.prepend(infoSpan);
      }

      // 计算利润结果
      let inputList = formNode.querySelectorAll("input");
      let spanList = formNode.querySelector("div.row").nextElementSibling.querySelectorAll("span");
      let count = parseInt(inputList[0].value);
      let quality = tools_func.get_quality(formNode);
      let name = formNode.previousElementSibling.querySelector("b").innerText;
      let cost = tools_func.get_cost_2(`${name}-${quality}`);
      let sellPrice = parseFloat(inputList[1].value);
      let taxFee = parseInt(spanList[1].innerText.split("\n")[0].replaceAll(/(\$)|(,)/g, "")) || 0;
      let TransUnitCount = parseInt(spanList[0].innerText.replaceAll(/(x)|(,)/g, ""));
      let TransUnitPrice = tools_func.get_cost_2("运输单位-0") || 0;
      if (sellPrice == 0) return;
      let income = isNaN(parseInt(count * sellPrice)) ? 0 : parseInt(count * sellPrice);
      let profit = isNaN(parseInt(income - (count * cost + TransUnitCount * TransUnitPrice + taxFee)))
        ? 0
        : parseInt(income - (count * cost + TransUnitCount * TransUnitPrice + taxFee));
      tools_func.log(`${count * sellPrice - (count * cost + TransUnitCount * TransUnitPrice + taxFee)} 税费：${taxFee}`);
      tools_func.log(`数量：${count}\n售价：${sellPrice}\n成本：${cost}\n运输数量：${TransUnitCount}\n运输单价：${TransUnitPrice}`);
      if (!cost) return (infoSpan.innerText = `物品成本获取失败，请联系开发者补修适配`);
      infoSpan.innerText = `收款：$${income - taxFee}，利润：$${profit}`;
    } catch (error) {
      tools_func.error(error);
    }
    // 输出控制台
    tools_func.log(runtime_data.warehouse);
  }

  // 仓库统计计算
  async function warehouse_count() {
    if (!feature_config.warehouse_count.enable) return;
    let itemNodeList = document.querySelectorAll(".col-lg-10.col-md-9 > div > div > div > div > div");
    tools_func.update_warehouse_data();
    try {
      itemNodeList.forEach(function (item) {
        let name = item.querySelector("b").innerText;
        let total = 0.0;
        Object.keys(runtime_data.warehouse).forEach((key) => {
          if (key.match(name + "-")) total += parseFloat(runtime_data.warehouse[key][2]);
        });
        item.setAttribute("title", `成本价值：$${total.toFixed(2)}`);
      });
    } catch (error) {
      tools_func.error(error);
    }
    tools_func.log(runtime_data.warehouse);
  }

  // 单大窗口聊天
  function one_big_chat() {
    // document.querySelectorAll(".well-header")
    // 拒绝匹配 "聊天室" "联络人" 两个标签
    if (!feature_config.one_big_chat.enable) return;
    let count = 0;
    document.querySelectorAll(".well-header").forEach((item) => {
      if (item.innerText.match(/(聊天室)|(联络人)/)) return;
      let targetNode = tools_func.get_parent_index(item, 3);
      targetNode.className = targetNode.className.replace("col-lg-6", "col-lg-12");
      if (count) targetNode.style.display = "none";
      count++;
    });
  }

  // 关闭所有消息弹窗
  function close_notification() {
    if (!feature_config.close_notification.enable) return;
    let targetNode = document.querySelector("div.container > div.chat-notifications");
    if (!targetNode) return;
    Object.assign(targetNode.style, { display: "none" });
  }

  // 输入框中文冒号换成英文冒号
  function change_colon() {
    if (!feature_config.change_colon.enable) return;
    let cursorPosition = document.activeElement.selectionStart;
    let changeAble = !!document.activeElement.value.match("：");
    if (!changeAble) return;
    tools_func.set_input_new_value(document.activeElement, document.activeElement.value.replace("：", ":"));
    document.activeElement.setSelectionRange(cursorPosition, cursorPosition);
  }

  // 资源价格存储与更新维护
  function resource_store(url, method, resp_data) {
    // runtime_data.resource_pool: {},
    // 资源信息池 索引是re-后面的数字 内容是 {name:"资源名称",price: {0:q0价格,1:q1价格}}
    if (!feature_config.resource_store.enable) return;
    tools_func.log("JSON处理函数 resource_store 已接手：", resp_data);
    let index = resp_data[0]["kind"];
    let price = resp_data[0]["price"];
    let quality = resp_data[0]["quality"];
    if (!runtime_data.resource_pool[index]) runtime_data.resource_pool[index] = { name: "", price: {} };
    tools_func.update_marcket_price(index, price, quality);
    tools_func.log("当前运行时资源价格数据：", runtime_data.resource_pool);
  }

  // 中文语言数据包拦截加载
  function lang_zh_handler(url, method, resp_data) {
    // {name:"资源名称",price: {0:q0价格,1:q1价格}}
    if (Boolean(runtime_data.resource_pool[1])) return;
    Object.keys(resp_data).forEach((key) => {
      if (key.match(/^be-re-(\d+)/)) {
        let name = resp_data[key];
        let index = key.match(/\d+/)[0];
        if (!runtime_data.resource_pool[index]) runtime_data.resource_pool[index] = { name, price: {} };
        runtime_data.resource_pool[index]["name"] = name;
      }
    });
  }

  // 聊天室市场价格显示
  async function chatroom_mp_display(event) {
    if (!feature_config.chatroom_mp_display.enable) return;
    // 检查信息标签显示是否已存在
    if (!runtime_data.chatroom_mp_node_flag.container_node) {
      // 不存在，当前是第一次加载
      runtime_data.chatroom_mp_node_flag.container_node = document.createElement("div");
      runtime_data.chatroom_mp_node_flag.table_node = document.createElement("table");
      Object.assign(runtime_data.chatroom_mp_node_flag.container_node.style, {
        position: "absolute",
        top: "20px",
        left: "400px",
        minWidth: "180px",
        minHeight: "80px",
        backgroundColor: "rgb(0,0,0,0.8)",
        borderRadius: "5px",
        zIndex: "1031",
        display: "none",
        color: feature_config.font_color,
      });
      Object.assign(runtime_data.chatroom_mp_node_flag.table_node.style, {
        width: "100%",
        height: "100%",
        textAlign: "center",
      });
      runtime_data.chatroom_mp_node_flag.table_node.innerHTML = `<tbody></tbody>`;
      runtime_data.chatroom_mp_node_flag.container_node.appendChild(runtime_data.chatroom_mp_node_flag.table_node);
      document.body.appendChild(runtime_data.chatroom_mp_node_flag.container_node);
      runtime_data.chatroom_mp_node_flag.container_node.addEventListener("click", () => {
        Object.assign(runtime_data.chatroom_mp_node_flag.container_node.style, { display: "none" });
      });
    }
    if (runtime_data.chatroom_mp_node_flag.fade_timer) clearTimeout(runtime_data.chatroom_mp_node_flag.fade_timer);
    // 格式化信息内容  [id1,id2,id3]
    // 排除 90 91 92 93 94 95 96 97 99
    let itemList = tools_func.get_chat_item_list(event.target.parentElement);
    itemList = itemList.filter((item) => item == 98 || item < 90 || item > 99);
    if (itemList.length == 0) return;
    // 格式化品质需求列表 默认需求q0 []
    let qualityList = tools_func.extract_quality_list(event.target.parentElement.innerText);
    if (!qualityList.includes(0)) qualityList.unshift(0);
    if (feature_config.chatroom_mp_display.focus_offset !== 0) qualityList.unshift("sp");
    // 将容器目标定在鼠标周边，并修改style
    Object.assign(runtime_data.chatroom_mp_node_flag.container_node.style, {
      display: "block",
      height: `${(itemList.length + 1) * 28}px`,
      width: `${(qualityList.length + 1) * 70}px`,
      top: `${event.clientY + 20}px`,
      left: `${event.clientX + 10 - (qualityList.length + 1) * 80 <= 0 ? 0 : event.clientX + 10 - (qualityList.length + 1) * 80}px`,
    });
    tools_func.format_HTML_1(runtime_data.chatroom_mp_node_flag.table_node, itemList, qualityList);
    // 触发价格更新后从数据库中提取
    for (let i = 0; i < itemList.length; i++) {
      await tools_func.get_marcket_price(itemList[i]);
      let node = runtime_data.chatroom_mp_node_flag.table_node;
      for (let j = 0; j < qualityList.length; j++) {
        let currentItem = runtime_data.resource_pool[itemList[i]];
        let quality = qualityList[j];
        let focusQuality = feature_config.chatroom_mp_display.focus_q;
        let focusOffset = feature_config.chatroom_mp_display.focus_offset;
        let price;
        if (quality === "sp") {
          // 如果 quality 是 "sp"
          // 如果 currentItem.price[focusQuality] 不是一个数字
          price = isNaN(currentItem.price[focusQuality])
            ? "无"
            : ((currentItem.price[focusQuality] * (100 - focusOffset)) / 100).toFixed(3);
        } else {
          // 如果 quality 不是 "sp"
          price = currentItem.price[quality] == Infinity ? "无" : currentItem.price[quality];
        }
        node.innerHTML = node.innerHTML.replace("请求中...", price == Infinity ? "无" : price);
      }
    }

    // 定时隐藏
    if (feature_config.chatroom_mp_display.display_auto_ms == 0 && feature_config.chatroom_mp_display.display_ms == 0) return;
    runtime_data.chatroom_mp_node_flag.fade_timer = setTimeout(() => {
      Object.assign(runtime_data.chatroom_mp_node_flag.container_node.style, { display: "none" });
    }, feature_config.chatroom_mp_display.display_ms || itemList.length * feature_config.chatroom_mp_display.display_auto_ms);
    tools_func.log(event.target, itemList);
  }

  // 资料页头像点击放大
  function profile_big_avatar(event) {
    if (!feature_config.profile_big_avatar.enable) return;
    tools_func.log(event.target.style.width);
    if (!event.target.style.width || event.target.style.width == "90px") {
      Object.assign(event.target.style, { width: "300px", height: "300px", zIndex: "1031" });
    } else {
      Object.assign(event.target.style, { width: "90px", height: "90px", zIndex: "1031" });
    }
  }

  // 零售商店时利润/总利润显示
  function retail_display_profit() {
    if (!feature_config.retail_display_profit.enable) return;
    let activeNode = document.activeElement;
    let activeNodeRect = activeNode.getBoundingClientRect();
    let targetNode = tools_func.get_parent_index(activeNode, 5).previousElementSibling.querySelector("div > div > h3").parentElement;
    let quantity = tools_func
      .get_parent_index(activeNode, 2)
      .previousElementSibling.querySelector("div > p > input[name='quantity']").value;
    let price = activeNode.value;
    let baseInfo;
    try {
      baseInfo = tools_func.retail_display_get_info_1(targetNode);
    } catch (error) {
      return;
    }
    if (baseInfo.profit <= 0) return; // 利润小于0 不处理
    if (quantity == "" || quantity <= 0) return; // 零售数量小于0 不处理
    if (price == "" || price <= 0) return; // 零售单价小于0 不处理
    if (runtime_data.reatil_display.fade_timer) clearTimeout(runtime_data.reatil_display.fade_timer);
    if (!runtime_data.reatil_display.container_node) {
      let newNode = document.createElement("div");
      newNode.id = "retail_display_div";
      Object.assign(newNode.style, { display: "none" });
      runtime_data.reatil_display.container_node = newNode;
      document.body.appendChild(newNode);
    }
    let totalProfit = (baseInfo.profit * quantity).toFixed(3);
    let hourProfit = (totalProfit / baseInfo.duration_hour).toFixed(3);
    runtime_data.reatil_display.container_node.innerText = `预估数据：\n总利润：${totalProfit}\n时利润：${hourProfit}`;
    Object.assign(runtime_data.reatil_display.container_node.style, {
      display: "flex",
      top: `${activeNodeRect.top + activeNodeRect.height + 64}px`,
      left: `${activeNodeRect.left}px`,
    });
    runtime_data.reatil_display.fade_timer = setTimeout(() => {
      Object.assign(runtime_data.reatil_display.container_node.style, { display: "none" });
    }, 3000);
  }

  // 检索界面仅显示在线用户
  function search_display_online() {
    if (!feature_config.search_display_online.enable) return;
    let targetNode = document.querySelector("div > h1 > svg").parentElement;
    if (!runtime_data.search_display_online.button_node && targetNode.querySelectorAll("button").length == 0) {
      // 运行时数据未挂载 并且界面无挂载标签
      let newNode = document.createElement("button");
      Object.assign(newNode.style, { fontSize: "17px", backgroundColor: "none", color: feature_config.font_color });
      newNode.className = "btn";
      newNode.innerText = "仅显示在线";
      runtime_data.search_display_online.button_node = newNode;
      targetNode.appendChild(runtime_data.search_display_online.button_node);
      newNode.addEventListener("click", tools_func.search_display_online_button_func);
    } else if (runtime_data.search_display_online.button_node && targetNode.querySelectorAll("button").length == 0) {
      // 运行时数据已挂载 但是界面无挂载标签
      targetNode.appendChild(runtime_data.search_display_online.button_node);
    } else {
      return;
    }
  }

  // 资料页当地时间12小时制转24小时制
  function profile_local_time_convert() {
    if (!feature_config.profile_local_time_convert.enable) return;
    let elements = document.querySelectorAll("div > table > tbody > tr > td");
    let element;
    if (elements.length == 0) return;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].innerText !== "当地时间") continue;
      element = elements[i + 1];
      break;
    }
    element.innerText = tools_func.convert_12hr_to_24hr(element.innerText);
  }

  // 一键收取所有建筑产出
  function one_click_harvest(event, clear = false) {
    if (!feature_config.one_click_harvest.enable) return;
    if (clear) {
      try {
        runtime_data.one_click_harvest_node = undefined;
        document.querySelector("#Script_oneClickHarvest_Btn").remove();
        return;
      } catch (err) {
        return tools_func.error(err);
      }
    }

    if (!runtime_data.one_click_harvest_node) {
      // 标签不存在，构建并存储
      let newNode = document.createElement("button");
      Object.assign(newNode.style, { margin: "0 5px", color: feature_config.font_color, backgroundColor: "rgb(51,51,51)", width: "auto" });
      newNode.innerText = feature_config.one_click_harvest.text;
      newNode.className = "btn";
      newNode.id = "Script_oneClickHarvest_Btn";
      runtime_data.one_click_harvest_node = newNode;
      runtime_data.one_click_harvest_node.addEventListener("click", tools_func.one_click_harvest_handle);
    }
    let existFlag = !!document.querySelector("#Script_oneClickHarvest_Btn");
    if (existFlag) return;
    tools_func.log(feature_config.one_click_harvest);
    if (feature_config.one_click_harvest.position == 0) {
      // 界面上不存在 挂载在头像右侧
      document.querySelector(".navbar-container").appendChild(runtime_data.one_click_harvest_node);
    } else if (feature_config.one_click_harvest.position == 1) {
      // 挂载在服务器标志左边
      let parentElement = document.querySelector(".navbar-container");
      parentElement.insertBefore(runtime_data.one_click_harvest_node, parentElement.children[1]);
    } else if (feature_config.one_click_harvest.position == 2) {
      // 悬浮挂载正中下方
      Object.assign(runtime_data.one_click_harvest_node.style, {
        position: "fixed",
        left: "50%",
        bottom: "80px",
        transform: "translateX(-50%)",
        minHeight: "45px",
        minWidth: "65px",
        boxShadow: "0 0 20px 1px white",
        zIndex: 1040,
        opacity: 0.4,
      });
      document.body.appendChild(runtime_data.one_click_harvest_node);
    }
  }

  // 更新维护IndexedDB数据库
  async function update_indexed_db() {
    await tools_func.indexedDB.updateRuntimeData();
    await tools_func.indexedDB.updateFeatureConf();
  }

  // 总览与财务图表放大
  function bigger_amcharts() {
    if (!feature_config.bigger_amcharts.enable) return;
    let url = location.href;
    if (url.endsWith("headquarters/overview/")) {
      // 总览界面
      let target_node = document.querySelector("div.row > div.col-sm-6 > div > div > div");
      target_node.style.height = "600px";
      let msg_node = target_node.parentElement.parentElement.parentElement.parentElement.lastChild;
      msg_node.className = "col-sm-6 text-center";
      if (msg_node.querySelectorAll("br").length > 1) return;
      msg_node.lastChild.prepend(document.createElement("br"));
      msg_node.lastChild.prepend(document.createElement("br"));
      msg_node.lastChild.prepend(document.createElement("br"));
    } else {
      // 财务界面
      let target_node = document.querySelector("div.col-md-9 > div > div > div > div > div.amcharts-main-div");
      target_node = target_node.parentElement;
      target_node.style.height = "600px";
    }
  }

  // 地图界面隐藏滚动条
  function landscape_no_scroll() {
    if (!feature_config.landscape_no_scroll.enable) return;
    let target = document.querySelector("div#root div#page");
    if (!target) return;
    if (Boolean(location.href.match(/landscape\/$/))) {
      target.style.overflow = "hidden";
    } else {
      target.style.overflow = "";
    }
  }

  // 使用金额限定从交易行购买
  function purchase_by_money() {
    if (!feature_config.purchase_by_money.enable) return;
    let targetNode = document.querySelector("form").parentElement;
    // 检查按钮是否已经挂载
    if (!runtime_data.purchase_by_money.container_node && targetNode.querySelectorAll("div#script_container").length == 0) {
      // 第一次加载
      let htmltext = `<div id="script_container" style="margin:10px;display: flex;justify-content: center;align-items: center;width: auto;height: 45px;">
      <input id="script_quality_Inp" placeholder="最低品质" type="number" style=";width: 80px;height: 34px;"/>
      <input id="script_amount_Inp" placeholder="全款金额" type="number" style="margin: 10px;width: 150px;height: 34px;" />
      <button class="btn" id="scriptBtn_1" style="background-color: green;color: ${feature_config.font_color};">使用金额限购</button>
    </div>`;
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmltext;
      targetNode.appendChild(tempDiv.firstChild);
      runtime_data.purchase_by_money.container_node = tempDiv.firstChild;
      document.querySelector("button#scriptBtn_1").addEventListener("click", tools_func.purchase_by_money_sub1);
    } else if (runtime_data.purchase_by_money.container_node && targetNode.querySelectorAll("div#script_container").length == 0) {
      // 创建过 没挂载
      targetNode.appendChild(runtime_data.purchase_by_money.container_node);
    }
  }

  // 交易行按钮旁高提醒
  function high_reminder() {
    if (!feature_config.high_reminder.enable) return;
    let srcString = document.querySelectorAll(".navbar-container img")[0].src;
    let target_node = document.querySelector("form input[name='quantity']");
    Object.assign(target_node.style, {
      background: `url('${srcString}')`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "right",
    });
  }

  // 自定义背景图片
  function custom_background_image() {
    if (!feature_config.custom_background_image.enable) return;
    let targetNode = document.querySelector("div#root div#page > div");
    if (!targetNode) return;
    Object.assign(targetNode.style, {
      background: feature_config.custom_background_image.cssText,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    });
  }

  // 交易所价格追踪 自启动功能
  function market_price_tracker(mode = "start") {
    // mode = start clear restart
    if (!feature_config.market_price_tracker.enable) return;
    if (mode == "clear") {
      return runtime_data.market_price_tracker_intervalList.map((item) => clearInterval(item));
    } else if (mode == "restart") {
      market_price_tracker("clear");
      return market_price_tracker("start");
    } else if (mode != "start") return;
    let featureConfig = feature_config.market_price_tracker;
    let runtimeListData = runtime_data.market_price_tracker_list;
    let runtimeInterListData = runtime_data.market_price_tracker_intervalList;

    let itemMap = []; // {id:1, realm:0, price:[0.1,231,12,12,121,21,12]};
    runtimeListData.forEach((element) => {
      // {id:123, quality:0 ,realm:0, target_price:0.159}
      let itemI = itemMap.findIndex((item) => item.id == element.id && item.realm == element.realm);
      if (itemI == -1) {
        let priceList = new Array(13);
        priceList[element.quality] = element.target_price;
        itemMap.push({ id: element.id, realm: element.realm, price: priceList });
        return;
      } else {
        itemMap[itemI].price[element.quality] = element.target_price;
      }
    });
    itemMap.forEach((item) => {
      let tampTimeGap = Math.random() * (featureConfig.max_net_time_gap - featureConfig.min_net_time_gap);
      tampTimeGap += featureConfig.min_net_time_gap;
      tampTimeGap = Math.floor(tampTimeGap);
      runtimeInterListData.push(setInterval(() => market_price_tracker_sub1(item), tampTimeGap));
      tools_func.log(tampTimeGap);
      if (feature_config.debug)
        tools_func.notification.send_msg("监控物价", `${runtime_data.resource_pool[item.id].name}`);
    });

    tools_func.log("价格追踪已开启");
    if (feature_config.debug)
      tools_func.notification.send_msg("交易所低价监控", "价格追踪已开启");
  }
  async function market_price_tracker_sub1(item) {
    // {id:1, realm:0, price:[0.1,231,12,12,121,21,12]};
    tools_func.log(`请求交易所价格`, item);
    let netData = await tools_func.get_net_data(`${base_URL_list.market_price}/${item.realm}/${item.id}`);
    let msgTitle = "交易所低价监控";
    if (item.realm == 0) {
      if (netData) tools_func.update_marcket_price_allQ(item.id, netData);
      item.price.forEach((price, index) => {
        if (!price) return;
        if (runtime_data.resource_pool[item.id].price[index] > price) return;
        let msgBody = `服务器${item.realm} ID:${item.id} 物品名:${runtime_data.resource_pool[item.id].name} `;
        msgBody += `q${index} 目标价格:${price} 当前价格:${runtime_data.resource_pool[item.id].price[index]}`;
        tools_func.notification.send_msg(msgTitle, msgBody);
      });
    } else {
      if (!netData) return;
      let netPriceMap = new Array(13);
      for (let i = 0; i < netData.length; i++) {
        let element = netData[i];
        if (netPriceMap[element.quality]) continue;
        netPriceMap[element.quality] = element.price;
      }
      console.log(netPriceMap);
      for (let i = 0; i < netPriceMap.length; i++) {
        netPriceMap[i] = netPriceMap[i] || netPriceMap[i + 1] || Infinity;
        netPriceMap[i] = Math.min(netPriceMap[i], ...netPriceMap.slice(i + 1).filter((n) => !!n));
      }
      for (let i = 0; i < item.price.length; i++) {
        if (!item.price[i]) continue;
        if (item.price[i] < netPriceMap[i]) continue;
        let msgBody = `服务器${item.realm} ID:${item.id} 物品名:${runtime_data.resource_pool[item.id].name} `;
        msgBody += `q${i} 目标价格:${item.price[i]} 当前价格:${netPriceMap[i]}`;
        tools_func.notification.send_msg(msgTitle, msgBody);
      }
    }
  }

  // 建筑工作完成提醒 自启动功能
  function building_work_end_notification(mode = "start") {
    // mode = start clear restart
    if (!feature_config.building_work_end_notification.enable) return;
    let runtimeData = runtime_data.building_work_end_notification;
    if (mode == "clear") {
      clearInterval(runtimeData.intervalFlag);
      return runtimeData.intervalFlag == undefined;
    } else if (mode == "restart") {
      clearInterval(runtimeData.intervalFlag);
      runtimeData.intervalFlag == undefined;
      return building_work_end_notification("start");
    }
    if (runtimeData.intervalFlag) return;
    runtimeData.intervalFlag = setInterval(building_work_end_notification_sub_1, feature_config.building_work_end_notification.time2gap);
  }
  async function building_work_end_notification_sub_1() {
    if (!feature_config.building_work_end_notification.enable) return;
    let newMsgFlag = false;
    let lastBuildings = runtime_data.buildings;
    let netData = await tools_func.get_net_data(base_URL_list.buildings_info);
    if (netData == false) return;
    // 对比新旧建筑信息列表
    let oldMap = {};
    for (let i = 0; i < lastBuildings.length; i++) {
      oldMap[lastBuildings[i].id] = lastBuildings[i];
    }
    for (let i = 0; i < netData.length; i++) {
      if (oldMap[netData[i].id] && oldMap[netData[i].id].busy && !netData[i].hasOwnProperty("busy")) {
        newMsgFlag = true;
        break;
      }
    }
    lastBuildings = netData;
    // 检查标记 发送信息
    if (!newMsgFlag) return;
    tools_func.notification.send_msg("建筑生产状态变动", "您的建筑中有一部分完成了生产！");
  }

  // 随手笔记
  function easy_text(mode = "start") {
    if (!feature_config.easy_text.enable) return;
    if (mode == "start") {
      // 检测当前按钮与显示板是否存在
      let buttonExist = document.querySelector("button#script_easeyText_button");
      let containerExist = document.querySelector("div#script_easeyText_div");
      if (buttonExist && containerExist) return;
      // 创建并挂载
      let newButton = document.createElement("button");
      let newContainer = document.createElement("div");
      let editerNode = document.createElement("textarea");
      Object.assign(newButton.style, { backgroundColor: "rgb(107,107,107)" });
      newButton.id = "script_easeyText_button";
      newContainer.id = "script_easeyText_div";
      editerNode.id = "script_easyText_textArea";
      newButton.innerText = "eTEXT";
      newContainer.appendChild(editerNode);
      document.body.appendChild(newButton);
      document.body.appendChild(newContainer);
      newButton.addEventListener("click", tools_func.easy_text_btn);
      runtime_data.easyTextFunc.buttonNode = newButton;
      runtime_data.easyTextFunc.divNode = newContainer;
      runtime_data.easyTextFunc.textareaNode = editerNode;
    } else if (mode == "clear") {
      runtime_data.easyTextFunc.buttonNode.remove();
      runtime_data.easyTextFunc.divNode.remove();
      runtime_data.easyTextFunc.textareaNode.remove();
      runtime_data.easyTextFunc.buttonNode = undefined;
      runtime_data.easyTextFunc.divNode = undefined;
      runtime_data.easyTextFunc.textareaNode = undefined;
      runtime_data.easyTextFunc.displayFlag = false;
    } else if (mode == "restart") {
      easy_text("clear");
      easy_text();
    }
  }

  // 自定义生产数量按钮
  function custom_quantity_button() {
    if (!feature_config.custom_quantity_button.enable) return;
    let urlMatch = runtime_data.custom_quantity_button.lastURL == location.href;
    let nodeMatch = document.querySelectorAll("button.btn.script_custom_button").length != 0;
    if (urlMatch && nodeMatch) return;
    document.querySelectorAll("h3 > svg").forEach((node) => {
      let targetNode = node.parentElement.parentElement.querySelector("div > button").parentElement;
      let newNode = document.createElement("button");
      newNode.className = `btn script_custom_button ${targetNode.querySelector("button").className}`;
      newNode.innerText = feature_config.custom_quantity_button.buttonText;
      Object.assign(newNode, { type: "button", role: "button" });
      targetNode.prepend(newNode);
      newNode.addEventListener("click", (event) => {
        let target_node = event.target.parentElement.parentElement.querySelector("input");
        let target_text = event.target.innerText;
        tools_func.set_input_new_value(target_node, target_text);
        event.preventDefault();
      });
    });
    runtime_data.custom_quantity_button.lastURL = location.href;
  }

  // 玩家信息存储
  function player_info_store(url, method, resp_data) {
    if (!feature_config.player_info_store.enable) return;
    runtime_data.realmID = resp_data.authCompany.realmId;
  }

  // 接受合同界面自动询价
  async function automatic_inquiry_in_acc() {
    if (!feature_config.automatic_inquiry_in_acc.enable) return;
    if (document.querySelectorAll("b.script_automatic_inquiry_b").length != 0) return;
    if (runtime_data.automatic_inquiry_in_acc_load) return;
    runtime_data.automatic_inquiry_in_acc_load = true;
    let nodeList = [];
    document.querySelectorAll("a[aria-label='Sign contract']").forEach((node) => nodeList.push(tools_func.get_parent_index(node, 3)));
    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];
      let nodeInfo = tools_func.automatic_inquiry_sub1(node.getAttribute("aria-label"));
      // [resID, name, quantity, quality, unitPrice, totalPrice, from]
      tools_func.log(nodeInfo);
      let market_price = await tools_func.get_marcket_price(nodeInfo[0], nodeInfo[3], runtime_data.realmID);
      let market_price_offset = 0;
      try {
        market_price_offset = ((nodeInfo[4] / market_price - 1) * 100).toFixed(0);
        market_price_offset = market_price_offset > 0 ? `+${market_price_offset}` : market_price_offset.toString();
      } catch {
        market_price_offset = "";
      }
      tools_func.log(market_price);
      if (!market_price) {
        market_price = "无";
        market_price_offset = 0;
      }
      let newNode = document.createElement("b");
      newNode.innerText = ` MP:$${market_price} MP${market_price_offset}`;
      newNode.className = "script_automatic_inquiry_b";
      node.children[2].appendChild(newNode);
    }
    runtime_data.automatic_inquiry_in_acc_load = false;
  }

  // 合同出售界面显示mp偏移
  async function warehouse_profit_count_mpOffest() {
    if (!feature_config.warehouse_profit_count_mpOffest.enable) return;
    // 检查配置
    if (feature_config.warehouse_profit_count_mpOffest.mp_offest == 0) return;
    // 检查网页标记是否已存在
    if (document.querySelector("span#script_mpoffest_span")) return;
    // 检测是否正在等待加载
    if (runtime_data.profit_display_mpOffest_load) return;
    runtime_data.profit_display_mpOffest_load = true;
    try {
      let newNode = document.createElement("span");
      newNode.id = "script_mpoffest_span";
      let res_name = document.querySelector("form").previousElementSibling.querySelector("b").innerText;
      let res_id = tools_func.get_index_by_name(res_name);
      let quality = tools_func.get_quality(document.querySelector("form"));
      let market_price = await tools_func.get_marcket_price(res_id, quality, runtime_data.realmID);
      if (market_price == false) market_price = 0;
      let displayText = `MP-${feature_config.warehouse_profit_count_mpOffest.mp_offest}：`;
      displayText += `${(market_price * (100 - feature_config.warehouse_profit_count_mpOffest.mp_offest) / 100).toFixed(3)}`;
      newNode.innerText = displayText;
      document.querySelector("input[name='price']").parentElement.appendChild(newNode);
    } catch (error) {
      tools_func.error(error);
    }
    runtime_data.profit_display_mpOffest_load = false;
  }

  // 图形设置界面
  function ui_setting() {
    if (!feature_config.ui_setting.enable) return;
    let mainSetTargetNode = document.querySelector("div.container > div.row > div.col-md-9 > div.row");
    // 数据收集统计
    let judgmentMark = {
      DOM_main_container: false,
      DOM_base_container: false,
      DOM_mpdisplay_container: false,
      DOM_backImage_container: false,
      DOM_clickHarvest_container: false,
      DOM_building_end_container: false,
      DOM_marketLowPrice_container: false,
      DOM_customQuantityButton_container: false,
      DOM_easyText_container: false,
      DOM_mpOffest_container: false,
      DATA_main_container: !!runtime_data.ui_setting.mainSetNode,
      DATA_base_container: !!runtime_data.ui_setting.baseSetNode,
      DATA_mpdisplay_container: !!runtime_data.ui_setting.chatroom_mp_display_SetNode,
      DATA_backImage_container: !!runtime_data.ui_setting.back_image_SetNode,
      DATA_clickHarvest_container: !!runtime_data.ui_setting.clickHarvest,
      DATA_building_end_container: !!runtime_data.ui_setting.building_end,
      DATA_marketLowPrice_container: !!runtime_data.ui_setting.marketLowPrice,
      DATA_customQuantityButton_container: !!runtime_data.ui_setting.customQuantityButton,
      DATA_easyText_container: !!runtime_data.ui_setting.easyText,
      DATA_mpOffest_container: !!runtime_data.ui_setting.mpOffest,
    };
    document.querySelectorAll(".setting-container").forEach((item) => {
      switch (item.id) {
        case "setting-container-1":
          judgmentMark.DOM_main_container = true;
          break;
        case "setting-container-2":
          judgmentMark.DOM_base_container = true;
          break;
        case "setting-container-3":
          judgmentMark.DOM_mpdisplay_container = true;
          break;
        case "setting-container-4":
          judgmentMark.DOM_backImage_container = true;
          break;
        case "setting-container-5":
          judgmentMark.DOM_clickHarvest_container = true;
          break;
        case "setting-container-6":
          judgmentMark.DOM_building_end_container = true;
          break;
        case "setting-container-7":
          judgmentMark.DOM_marketLowPrice_container = true;
          break;
        case "setting-container-8":
          judgmentMark.DOM_customQuantityButton_container = true;
          break;
        case "setting-container-9":
          judgmentMark.DOM_easyText_container = true;
          break;
        case "setting-container-10":
          judgmentMark.DOM_mpOffest_container = true;
          break;
        default:
          break;
      }
    });

    // html挂载函数循环
    for (const key in ui_setting_interface) {
      if (!Object.hasOwnProperty.call(ui_setting_interface, key)) continue;
      ui_setting_interface[key](judgmentMark, mainSetTargetNode);
    }
  }

  // 初始化
  tools_func.init();
})();
