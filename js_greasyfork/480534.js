
// ==UserScript==
// @name           Doudian-script
// @namespace      my-userscript
// @version        1.0.5
// @author         glk
// @description    抖店订单相关功能脚本，支持批量、过滤导出订单隐私信息
// @icon           https://lf1-fe.ecombdstatic.com/obj/eden-cn/upqphj/homepage/icon.svg
// @include        https://*.jinritemai.com/*
// @match          https://*.jinritemai.com/*
// @run-at         document-end
// @grant          none
// @require        https://code.jquery.com/jquery-3.6.0.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.core.min.js
// @downloadURL https://update.greasyfork.org/scripts/480534/Doudian-script.user.js
// @updateURL https://update.greasyfork.org/scripts/480534/Doudian-script.meta.js
// ==/UserScript==
(function () {
  'use strict';

  /** 导出一次文件的总数据条目 */
  const Fetch_Total = 100;

  /** 订单列表每页请求数量 */
  const PageSize = 100;

  const STYLE = `
  .glk-userscript-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    user-select: none;
  }

  .glk-userscript-main input[name=export_total]{
    border: 1px solid #dcdee1;
    border-radius: 5px;
    padding: 3px;
    width: 80px;
  }
`;

  /**
   * json 转 excel 并下载
   * @param {object} json - json 数据
   * @param {string} filename - 文件名
   * @param {string} sheetname - 第一个excel表名
   */
  const jsonToExcel = (json, filename, sheetname) => {
    var filename = `${filename}-${Date.now()}.xls`;
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(json);
    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, filename);
  };

  /**
   * 休眠
   * @param {number} s - 休眠时间
   * @returns 
   */
  const sleep = s => new Promise(resolve => setTimeout(resolve, s * 1000));

  /**
   * 系统提示
   * @param {string} message - 提示信息
   * @param {number} duration - 显示时间
   * @param {object} pos - 提示位置
   */
  const showTip = function (message) {
    let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.8;
    let pos = arguments.length > 2 ? arguments[2] : undefined;
    return new Promise(resolve => {
      let show_tip = document.getElementById('show_tip');
      if (show_tip) {
        document.body.removeChild(show_tip);
      }
      if (window.show_tip_timer) {
        clearTimeout(window.show_tip_timer);
      }
      let tipDom = document.createElement('div');
      document.body.appendChild(tipDom);
      tipDom.id = 'show_tip';
      Object.assign(tipDom.style, {
        position: 'fixed',
        maxWidth: '80vw',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        lineHeight: '20px',
        zIndex: 9999,
        color: '#fff',
        backgroundColor: '#303133',
        borderRadius: ' 4px',
        padding: '10px',
        textAlign: 'center',
        opacity: 0.9,
        fontSize: '0.75rem'
      });
      if (pos) {
        const {
          left,
          top,
          offsetX = 0,
          offsetY = 0
        } = pos;
        Object.assign(tipDom.style, {
          top: top + offsetY + 'px',
          left: left + offsetX + 'px',
          transform: 'none'
        });
      }
      tipDom.innerText = message;
      window.show_tip_timer = setTimeout(() => {
        let show_tip = document.getElementById('show_tip');
        if (show_tip) {
          document.body.removeChild(show_tip);
          resolve();
        }
      }, duration * 1000 - 100);
    });
  };

  /**
   * 添加样式表
   * @param {*} urls - css 链接
   */
  const addStyle = function () {
    let urls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    for (let i of urls) {
      let linkDom = document.createElement('link');
      linkDom.setAttribute('rel', 'stylesheet');
      linkDom.setAttribute('type', 'text/css');
      linkDom.href = i;
      document.documentElement.appendChild(linkDom);
    }
  };

  /**
   * 添加样式表字符串
   * @param {string} styStr 
   */
  const addStyleStr = function () {
    let styStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    let _style = document.createElement("style");
    _style.innerHTML = styStr;
    document.getElementsByTagName("head")[0].appendChild(_style);
  };

  /**
   * 获取店铺信息
   * @returns 
   */
  const getShopInfo = () => {
    const shopinfo = {};
    try {
      const store = JSON.parse(window.$storeGetters);
      Object.assign(shopinfo, {
        shop_name: store.user.shop_name,
        token: store.user.token
      });
      return shopinfo;
    } catch (error) {
      console.warn("getShopInfo error", error);
      return shopinfo;
    }
  };

  const URLS = {
    /** 跟路径 */
    base: "https://fxg.jinritemai.com/api/",
    /** 订单列表 */
    orderlist: "order/searchlist/",
    /** 获取隐私 */
    receiveinfo: "order/receiveinfo/"
  };

  /**
   * 获取订单列表
   * @param {number} page - 页码
   * @param {number} pageSize - 每页条数
   * @returns 
   */
  const getOrderListData = function () {
    let {
      page = 0,
      pageSize = 10,
      querystr = "&tab=all"
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      token
    } = getShopInfo();
    if (!token) {
      return;
    }
    return new Promise((resolve, reject) => {
      fetch(`${URLS["base"]}${URLS["orderlist"]}?page=${page}&pageSize=${pageSize}&order_by=create_time&order=desc&__token=${token}${querystr}`).then(res => res.json()).then(res => resolve(res)).catch(err => {
        reject(err);
        console.warn("glk-userscript getOrderListData error", err);
      });
    });
  };

  /**
   * 获取某个订单的隐私信息
   * @param {string} order_id - 订单编号
   * @returns 
   */
  const getPrivacyinfo = order_id => {
    const {
      token
    } = getShopInfo();
    if (!token) {
      return;
    }
    return new Promise((resolve, reject) => {
      fetch(`${URLS["base"]}${URLS["receiveinfo"]}?come_from=pc&order_id=${order_id}&version=v2&appid=1&__token=${token}`).then(res => res.json()).then(res => resolve(res)).catch(err => {
        reject(err);
        console.warn("glk-userscript getPrivacyinfo error", err);
      });
    });
  };

  var formFooter, total, customDOM;
  const GExportTotalKey = "g_export_total";
  const GEnableFilterRepeatKey = "g_enable_filter_repeat";
  const GEnableFilterDoneKey = "g_enable_filter_done";
  const GOrderIdsKey = "g_order_ids";

  /**
   * 获取本地布尔状态值
   * @param {string} key - localkey
   * @param {boolean} defaultBool - 默认值
   * @returns `boolean`
   */
  const getLocalBoolState = function (key) {
    let defaultBool = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    const localres = localStorage.getItem(key);
    if (!localres) {
      localStorage.setItem(key, defaultBool);
      return defaultBool;
    } else {
      if (localres === "true") {
        return true;
      } else if (localres === "false") {
        return false;
      }
    }
  };

  /**
   * 此次导出数据总条数
   * @returns 
   */
  const getExportTotal = () => {
    const localres = localStorage.getItem(GExportTotalKey);
    if (!localres) {
      localStorage.setItem(GExportTotalKey, Fetch_Total);
      return Fetch_Total;
    } else {
      return Number(localres);
    }
  };
  const getLocalOrderIds = () => {
    const ids = localStorage.getItem(GOrderIdsKey);
    if (ids) {
      return ids.split(",");
    }
    {
      return [];
    }
  };
  const removeLocalStrg = () => {
    localStorage.removeItem(GOrderIdsKey);
    showTip("本地记录已清空", 1.5);
  };
  const createWrap = () => {
    customDOM = document.createElement("main");
    customDOM.classList.add("glk-userscript-main");
    customDOM.innerHTML = `
    <label>过滤重复项 <input type="checkbox" name="enable_filter_repeat" checked="true" /></label>
    <label>过滤已完成 <input type="checkbox" name="enable_filter_done" checked="true" /></label>
    <label>导出数据量 <input type="number" name="export_total" step="1" min="1" /></label>
    <button type="submit" class="auxo-btn auxo-btn-dashed auxo-btn-sm export">导出数据</button>
    <button type="submit" class="auxo-btn auxo-btn-sm dellocal">清空记录</button>
  `;
    formFooter.append(customDOM);
    const export_total_dom = $(".glk-userscript-main input[name='export_total']");
    const enable_filter_dom = $(".glk-userscript-main input[name='enable_filter_repeat']");
    const enable_filter_done_dom = $(".glk-userscript-main input[name='enable_filter_done']");
    const export_dom = $(".glk-userscript-main .export");
    const dellocal_dom = $(".glk-userscript-main .dellocal");
    enable_filter_done_dom.val();
    export_total_dom.val(getExportTotal());
    export_total_dom.on("input", e => {
      localStorage.setItem(GExportTotalKey, e.target.value);
    });

    // 是否过滤重复项
    enable_filter_dom.prop("checked", getLocalBoolState(GEnableFilterRepeatKey));
    enable_filter_dom.on("change", e => {
      localStorage.setItem(GEnableFilterRepeatKey, e.target.checked);
    });

    // 是否过滤已完成的状态
    enable_filter_done_dom.prop("checked", getLocalBoolState(GEnableFilterDoneKey));
    enable_filter_done_dom.on("change", e => {
      localStorage.setItem(GEnableFilterDoneKey, e.target.checked);
    });
    export_dom.on("click", e => {
      submit();
    });
    dellocal_dom.on("click", e => {
      removeLocalStrg();
    });
  };
  const submit = async () => {
    if (window.$storeGetters) {
      try {
        const shopinfo = getShopInfo();
        const res = await getOrderListData();
        showTip("开始获取订单信息，请等待...", 2.5);
        console.log(`第一次数据获取 res`, res);
        if (res) {
          // 此次导出数据总条数
          const localExportTotal = getExportTotal();
          if (localExportTotal >= res.total) {
            total = res.total;
          } else {
            total = localExportTotal;
          }
          console.log(`此次导出数据总条数`, total);

          // 此次导出需要请求接口的次数
          const fetchCount = Math.ceil(total / PageSize);
          console.log(`此次导出需要请求订单列表接口的次数`, fetchCount);

          // 获取所有订单信息
          let orderData = [];
          for (let i = 0; i < fetchCount; i++) {
            await sleep(0.5);
            const res = await getOrderListData({
              page: i,
              PageSize,
              querystr: getLocalBoolState(GEnableFilterDoneKey) ? "&order_status=received&tab=received" : undefined
            });
            if (res && res.data) {
              orderData.push(...res.data);
            }
            console.log(`获取第${i}页数据 res`, res);
          }
          console.log(`获取所有订单数据完成`, orderData);

          // 实际只需要保存的数量）
          orderData = orderData.slice(0, total);

          // 未过滤前的数量
          const canNotFilterLen = orderData.length;
          console.log(`未过滤前需要保存的数量`, canNotFilterLen);

          // 此次导出之后需要保存的所有订单id
          const saveIds = orderData.map(i => i.shop_order_id).join(",");
          console.log("此次保存的ids", saveIds);

          // 导出前本地记录的id
          const localSaveOrderIds = getLocalOrderIds();
          console.log(`导出前本地记录的id`, localSaveOrderIds);

          // 判断是否需要过滤
          const localEnableFilterRep = getLocalBoolState(GEnableFilterRepeatKey);
          console.log(`此次是否需要过滤`, localEnableFilterRep);
          if (localEnableFilterRep) {
            orderData = orderData.filter(i => !localSaveOrderIds.includes(i.shop_order_id));
          }

          // 重复订单数量
          const repeatLeng = canNotFilterLen - orderData.length;
          console.log(`最终需要保存的数量 ${orderData.length}，重复数量 ${repeatLeng}`);

          // 获取所有订单的隐私信息
          console.log(`%c 实际获取隐私信息`, `color: hotpink; font-size: 20px; font-weight: bold;`, orderData);
          let privacyData = [];
          if (orderData.length) {
            showTip("正在获取隐私信息，请等待...", 1000);
            for (let i of orderData) {
              const {
                shop_order_id,
                product_item,
                pay_amount,
                pay_type_desc,
                order_status_info
              } = i;
              const {
                order_status_text
              } = order_status_info;
              let baseInfo = {};
              if (product_item && product_item.length) {
                const {
                  product_name,
                  combo_amount,
                  combo_num
                } = product_item[0];
                baseInfo = {
                  商品: product_name,
                  应付: `￥${pay_amount / 100}`,
                  订单状态: order_status_text,
                  支付方式: pay_type_desc,
                  "单价/数量": `￥${combo_amount / 100} x${combo_num}`
                };
              }
              await sleep(0.1);
              const res = await getPrivacyinfo(shop_order_id);
              if (res && res.data) {
                const {
                  receive_info,
                  nick_name
                } = res.data; // 收件人信息
                let obj = {
                  订单编号: shop_order_id,
                  // 订单编号
                  收件人: "基于隐私保护禁止查看",
                  // 收件人
                  联系方式: "基于隐私保护禁止查看",
                  // 收件人联系方式
                  收货地址: "基于隐私保护禁止查看",
                  // 收货地址
                  ...baseInfo
                };
                if (receive_info) {
                  const {
                    post_tel,
                    post_addr: {
                      province,
                      city,
                      town,
                      street,
                      detail
                    },
                    post_receiver
                  } = receive_info;
                  const arrdress = `${province.name}${city.name}${town.name}${street.name} ${detail}`;
                  obj["收件人"] = post_receiver;
                  obj["联系方式"] = post_tel;
                  obj["收货地址"] = arrdress;
                }
                privacyData.push(obj);
              }
            }
          }

          // 保存此次导出的所有订单id
          localStorage.setItem(GOrderIdsKey, saveIds);
          console.log(`导出后需要记录的id`, saveIds);
          if (!privacyData.length) {
            showTip("此次没有需要导出的数据", 2);
            return;
          }
          await showTip(`预计导出记录 ${total} 条，实际导出 ${orderData.length} 条，重复 ${repeatLeng} 条`, 6);
          console.log(`%c 最终导出数据`, `color: hotpink; font-size: 20px; font-weight: bold;`, privacyData);

          // 导出 excel
          jsonToExcel(privacyData, `【${shopinfo.shop_name}】订单信息`);
          showTip("文件正在下载，注意查看~", 3);
        }
      } catch (error) {
        console.warn("glk-userscript error", error);
      }
    }
  };
  let timer = setInterval(async () => {
    formFooter = $(".auxo-form-horizontal.auxo-form-horizontal div[class*='footer']");
    if (formFooter) {
      addStyleStr(STYLE);
      clearInterval(timer);
      createWrap();
    }
  }, 1000);
  addStyle(["//cdn.staticfile.org/layui/2.8.18/css/layui.css"]);

})();
