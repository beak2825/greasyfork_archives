// ==UserScript==
// @name           painet-script
// @namespace      my-userscript
// @version        1.0.6
// @author         glk
// @description    派享云数据采集
// @icon           https://lf1-fe.ecombdstatic.com/obj/eden-cn/upqphj/homepage/icon.svg
// @include        https://www.painet.work/device/list
// @match          https://www.painet.work/device/list
// @grant          none
// @license        MIT
// @require        https://code.jquery.com/jquery-3.6.0.min.js
// @require        https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require        https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js
// @downloadURL https://update.greasyfork.org/scripts/512859/painet-script.user.js
// @updateURL https://update.greasyfork.org/scripts/512859/painet-script.meta.js
// ==/UserScript==
(function () {
	'use strict';

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var main = {};

	/** 导出一次文件的总数据条目 */
	const Fetch_Total = 100;

	/** 订单列表每页请求数量 */
	const PageSize = 100;

	/** 是否是目标页面 */
	const IsTargetPage$1 = !!location.href.includes("/device/list");

	var config = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Fetch_Total: Fetch_Total,
		PageSize: PageSize,
		IsTargetPage: IsTargetPage$1
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(config);

	const jsonToExcel = (json, filename, sheetname) => {
	  var filename = `${filename}-${Date.now()}.xls`;
	  var wb = XLSX.utils.book_new();
	  var ws = XLSX.utils.json_to_sheet(json);
	  XLSX.utils.book_append_sheet(wb, ws, sheetname);
	  XLSX.writeFile(wb, filename);
	};

	const sleep$1 = s => new Promise(resolve => setTimeout(resolve, s * 1000));

	const showTip$1 = function (message) {
	  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.8;
	  let pos = arguments.length > 2 ? arguments[2] : undefined;
	  return new Promise(resolve => {
	    let show_tip = document.getElementById("show_tip");
	    if (show_tip) {
	      document.body.removeChild(show_tip);
	    }
	    if (window.show_tip_timer) {
	      clearTimeout(window.show_tip_timer);
	    }
	    let tipDom = document.createElement("div");
	    document.body.appendChild(tipDom);
	    tipDom.id = "show_tip";
	    Object.assign(tipDom.style, {
	      position: "fixed",
	      maxWidth: "80vw",
	      top: "50%",
	      left: "50%",
	      transform: "translate(-50%, -50%)",
	      lineHeight: "20px",
	      zIndex: 9999,
	      color: "#fff",
	      backgroundColor: "#303133",
	      borderRadius: " 4px",
	      padding: "10px",
	      textAlign: "center",
	      opacity: 0.9,
	      fontSize: "1em"
	    });
	    if (pos) {
	      const {
	        left,
	        top,
	        offsetX = 0,
	        offsetY = 0
	      } = pos;
	      Object.assign(tipDom.style, {
	        top: top + offsetY + "px",
	        left: left + offsetX + "px",
	        transform: "none"
	      });
	    }
	    tipDom.innerText = message;
	    window.show_tip_timer = setTimeout(() => {
	      let show_tip = document.getElementById("show_tip");
	      if (show_tip) {
	        document.body.removeChild(show_tip);
	        resolve();
	      }
	    }, duration * 1000 - 100);
	  });
	};

	const asyncGetDom = className => {
	  return new Promise((resolve, reject) => {
	    let dom = $(className);
	    if (formFooter) {
	      resolve(dom);
	    } else {
	      setTimeout(() => {
	        resolve(asyncGetDom(className));
	      }, 1000);
	    }
	  });
	};

	const addStyle = function () {
	  let urls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	  for (let i of urls) {
	    let linkDom = document.createElement("link");
	    linkDom.setAttribute("rel", "stylesheet");
	    linkDom.setAttribute("type", "text/css");
	    linkDom.href = i;
	    document.documentElement.appendChild(linkDom);
	  }
	};

	const addStyleStr$1 = function () {
	  let styStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	  let _style = document.createElement("style");
	  _style.innerHTML = styStr;
	  document.getElementsByTagName("head")[0].appendChild(_style);
	  return _style;
	};

	const createAsyncTask$1 = function () {
	  let checkFun = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : () => {};
	  let initFun = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => {};
	  let duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
	  return new Promise((resolve, reject) => {
	    const timer = setInterval(async () => {
	      const res = checkFun();
	      if (res) {
	        clearInterval(timer);
	        const res2 = await initFun(res);
	        resolve(res2);
	      }
	    }, duration * 1000);
	  });
	};
	const base64FillColor = (cvs, base64, color) => {
	  // let imageData = $("#canvas")[0].toDataURL("image/png");
	  const ctx = cvs.getContext("2d");
	  let newImage = new Image();
	  newImage.src = base64;
	  newImage.onload = function (e) {
	    ctx.fillStyle = color;
	    ctx.fill();
	    ctx.fillRect(0, 0, cvs.width, cvs.height);
	    ctx.drawImage(e.currentTarget, 0, 0, width.value, height.value);
	    $("#newCanvas")[0].toDataURL("image/png");
	  };
	};
	const globalLoading$1 = function () {
	  let msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "加载中...";
	  const ele = document.createElement("div");
	  ele.id = "glk-loading-container";
	  ele.innerHTML = `
    <div class="mask"></div>
    <div class="message">${msg}</div>
  `;
	  const styleEle = document.createElement("style");
	  styleEle.innerHTML = `
    #glk-loading-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      transition: opacity 0.3s;
    }
    #glk-loading-container .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
    }
    #glk-loading-container .message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
    }
  `;
	  document.head.appendChild(styleEle);
	  document.body.append(ele);
	  return {
	    close: () => {
	      document.body.removeChild(ele);
	    }
	  };
	};

	var utils = /*#__PURE__*/Object.freeze({
		__proto__: null,
		jsonToExcel: jsonToExcel,
		sleep: sleep$1,
		showTip: showTip$1,
		asyncGetDom: asyncGetDom,
		addStyle: addStyle,
		addStyleStr: addStyleStr$1,
		createAsyncTask: createAsyncTask$1,
		base64FillColor: base64FillColor,
		globalLoading: globalLoading$1
	});

	var require$$1 = /*@__PURE__*/getAugmentedNamespace(utils);

	function formatDate(format) {
	  const now = new Date();
	  const year = now.getFullYear();
	  const month = now.getMonth() + 1;
	  const day = now.getDate();
	  const hours = now.getHours();
	  const minutes = now.getMinutes();
	  const seconds = now.getSeconds();

	  // 格式化单个数字
	  const pad = num => num.toString().padStart(2, "0");

	  // 替换格式字符串中的年月日时分秒
	  return format.replace(/YYYY/g, year).replace(/MM/g, pad(month)).replace(/DD/g, pad(day)).replace(/HH/g, pad(hours)).replace(/mm/g, pad(minutes)).replace(/ss/g, pad(seconds));
	}

	function getTodayYesterdayTomorrow() {
	  const today = new Date();
	  const yesterday = new Date(today);
	  const tomorrow = new Date(today);
	  const prePreDay = new Date(today);
	  yesterday.setDate(today.getDate() - 1);
	  tomorrow.setDate(today.getDate() + 1);
	  prePreDay.setDate(today.getDate() - 2); // 设置前天的日期

	  const formatDate = date => {
	    const year = date.getFullYear();
	    const month = (date.getMonth() + 1).toString().padStart(2, '0');
	    const day = date.getDate().toString().padStart(2, '0');
	    return `${year}-${month}-${day}`;
	  };
	  return {
	    curDate: formatDate(today),
	    preDate: formatDate(yesterday),
	    nextDate: formatDate(tomorrow),
	    prePreDate: formatDate(prePreDay)
	  };
	}

	function createARow() {
	  let {
	    ws,
	    value,
	    rowIdx,
	    center,
	    height
	  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  const curRow = ws.insertRow(rowIdx, value);
	  curRow.height = height || 35;
	  curRow.font = {
	    name: "黑体",
	    bold: false,
	    size: 11,
	    color: {
	      argb: "000000"
	    }
	  };
	  curRow.alignment = {
	    vertical: "middle",
	    horizontal: center ? "center" : "left"
	  };
	}

	function createAImageRangeChar() {
	  let {
	    wb,
	    ws,
	    base64,
	    range
	  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  const imageId = wb.addImage({
	    base64: base64,
	    extension: 'png'
	  });
	  ws.addImage(imageId, range || "A0:A0");
	}

	function numberToCol(num) {
	  let str = '',
	    q,
	    r;
	  while (num > 0) {
	    q = (num - 1) / 26;
	    r = (num - 1) % 26;
	    num = Math.floor(q);
	    str = String.fromCharCode(65 + r) + str;
	  }
	  return str;
	}

	/**
	 * 错误提示
	 */
	const Error_Code = {
	  "3001": "token 获取失败"
	};

	/**
	 * 抛出一个错误
	 * @param {*} errCode 
	 */
	const alertError = errCode => {
	  alert(`操作异常，请联系管理员 ${errCode}`);
	  console.warn("error", Error_Code[errCode]);
	};

	const getToken = () => {
	  return localStorage.getItem("token") || "";
	};

	const URLS = {
	  /** 跟路径 */
	  base: "https://www.painet.work/api/",
	  /** 节点列表 */
	  devicelist: "v1/device/list",
	  /** 设备信息 */
	  deviceHistory: "billing/v1/income/device/history"
	};
	const requestGet = url => {
	  const token = getToken();
	  if (!token) {
	    alertError("3001");
	    return;
	  }
	  return new Promise((resolve, reject) => {
	    fetch(`${URLS["base"]}${url}`, {
	      headers: {
	        authorization: `Bearer ${token}`
	      }
	    }).then(res => res.json()).then(res => resolve(res)).catch(err => {
	      reject(err);
	      console.warn("glk-userscript requestGet error", err);
	    });
	  });
	};

	/**
	 * 获取计费带宽
	 * @param {*} param0 
	 */
	const getBandwidth = async _ref => {
	  let {
	    start,
	    end,
	    uuid
	  } = _ref;
	  return requestGet(`${URLS["deviceHistory"]}?start=${start}&end=${end}&uuid=${uuid}&getMiner=true&order=desc`);
	};

	const getBaseTargetBtn$1 = () => $('button:contains("批量部署"):last');

	const getAllPageBtn$1 = () => Array.from($(".ant-pagination li.ant-pagination-item"));

	const addScriptEle$1 = () => {
	  const baseTargetBtn = getBaseTargetBtn$1();
	  const cloneBtn = baseTargetBtn.clone();
	  cloneBtn.text("导出数据").css({
	    "margin-left": "20px"
	  });
	  baseTargetBtn.parent().append(cloneBtn);
	  return cloneBtn;
	};

	const fetchIsLoading$1 = () => !!$('.ant-btn.ant-btn-primary.ant-btn-loading:contains("查 询")').length;

	const runTask$1 = async pageIdx => {
	  const tableTrs = $("tbody tr[data-row-key]");
	  const columnNameIdx = Array.from($(".ant-table-header table thead th")).map((i, idx) => ({
	    name: i.textContent,
	    idx
	  })).reduce((acc, item) => {
	    if (item.name.trim()) {
	      acc[item.name.trim()] = item.idx;
	    }
	    return acc;
	  }, {});
	  if (tableTrs.length) {
	    const Default_Date = formatDate("YYYY/MM/DD HH:mm");
	    const {
	      curDate,
	      prePreDate,
	      preDate
	    } = getTodayYesterdayTomorrow();
	    let baseData = Array.from(tableTrs)
	    // .filter((j, jdx) => jdx <= 0)
	    .map(tr => {
	      return {
	        // 当天采集日期到小时
	        collectionTime: Default_Date,
	        // 节点ID
	        uuid: tr.getAttribute("data-row-key"),
	        // 备注
	        remark: tr.children[columnNameIdx["备注"]]?.textContent || "-",
	        // 跨网运营商
	        crossNetOperator: tr.children[columnNameIdx["跨网运营商"]]?.textContent || "-",
	        // 业务名
	        businessName: tr.children[columnNameIdx["业务名"]]?.textContent || "-",
	        // 调度类型
	        schedulingType: tr.children[columnNameIdx["调度类型"]]?.textContent || "-",
	        // 网络配置结果
	        netCfgRes: tr.children[columnNameIdx["网络配置结果"]]?.textContent || "-"
	      };
	    });
	    // .filter((j) => j.uuid.includes("aca18383ba700257efaeeab6980d414e"));

	    for (let i = 0; i < baseData.length; i++) {
	      const {
	        uuid
	      } = baseData[i];
	      const promiseArr = [getBandwidth({
	        start: prePreDate,
	        end: preDate,
	        uuid
	      }).then(res => {
	        if (res.code === 0) {
	          let {
	            income,
	            bandwidth
	          } = res.data;
	          income = [income?.[0] || 0, income?.[1] || 0];
	          bandwidth = [bandwidth?.[0] || 0, bandwidth?.[1] || 0];
	          Object.assign(baseData[i], {
	            // 昨日带宽
	            preDateBandwidth: bandwidth[0].toFixed(2),
	            // 前日带宽
	            prePreDateBandwidth: bandwidth[1].toFixed(2),
	            // 昨日收益
	            preDateIncome: (income[0] / 100).toFixed(2),
	            // 前日收益
	            prePreDateIncome: (income[1] / 100).toFixed(2),
	            // 收益差额
	            difference: ((income[0] - income[1]) / 100).toFixed(1)
	          });
	        }
	      }), new Promise(async (resolve, reject) => {
	        // 打开详情
	        const curDetailBtn = $(tableTrs[i]).find('button:contains("详情 >")');
	        curDetailBtn[0].click();
	        createAsyncTask$1(() => {
	          return $('.ant-tabs-nav-list div[data-node-key="bandwidth"]')[0];
	        }, async ele => {
	          // 点击带宽Tab
	          ele.click();
	          createAsyncTask$1(() => {
	            return !$(".ant-spin-container.ant-spin-blur").length;
	          }, async () => {
	            await sleep$1(0.1);
	            // 获取今日（默认）带宽图表数据
	            const base64 = $("canvas")[0].toDataURL("jpg");
	            Object.assign(baseData[i], {
	              curDateBandwidthChart: base64
	            });

	            // 点击昨日按钮
	            const preDateBtn = $('.ant-tabs-tabpane.ant-tabs-tabpane-active .ant-spin-container span:contains("昨日")')[0];
	            preDateBtn.click();
	            createAsyncTask$1(() => {
	              return !$(".ant-spin-container.ant-spin-blur").length;
	            }, async () => {
	              await sleep$1(0.1);
	              const base64 = $("canvas")[0].toDataURL("jpg");
	              Object.assign(baseData[i], {
	                preDateBandwidthChart: base64
	              });
	              const closeBtn = $(".ant-drawer-close")[0];
	              if (closeBtn) {
	                closeBtn.click();
	                console.log(`第${i + 1}条数据采集完成`, baseData);
	                resolve();
	              }
	            }, 0.1);
	          }, 0.1);
	        }, 0.1);
	      })];
	      await Promise.all(promiseArr);
	      await sleep$1(0.3);
	    }
	    // saveExcel(baseData);
	    console.log(`第${pageIdx + 1}页数据采集完成`, baseData);
	    return baseData;
	  }
	};
	const saveExcel$1 = function () {
	  let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	  const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	  // 创建工作簿
	  let workbook = new ExcelJS.Workbook();

	  // 设置工作簿的属性
	  workbook.creator = "glk";
	  workbook.lastModifiedBy = "glk";
	  workbook.created = new Date(1985, 8, 30);
	  workbook.modified = new Date();
	  workbook.lastPrinted = new Date();

	  // 工作簿视图，工作簿视图控制在查看工作簿时 Excel 将打开多少个单独的窗口
	  workbook.views = [{
	    x: 0,
	    y: 0,
	    width: 1000,
	    height: 2000,
	    firstSheet: 0,
	    activeTab: 1,
	    visibility: "visible"
	  }];
	  let worksheet = workbook.addWorksheet("sheet1");
	  worksheet.properties.defaultColWidth = 15;
	  let lastIdx = 0;
	  const {
	    curDate,
	    prePreDate,
	    preDate
	  } = getTodayYesterdayTomorrow();
	  const excelHeadValue = ["当天采集日期到小时", "节点ID", "备注", "跨网运营商", "业务名", "调度类型", `${preDate}计费带宽`, `${preDate}收益`, `${prePreDate}计费带宽`, `${prePreDate}收益`, "差额", "当前上下行带宽图", "昨日上下行带宽图", "网路配置结果"];
	  const curDateBandwidthChartColumnNum = excelHeadValue.indexOf("当前上下行带宽图") + 1;
	  const preDateBandwidthChartColumnNum = excelHeadValue.indexOf("昨日上下行带宽图") + 1;
	  const uuidColumnNum = excelHeadValue.indexOf("节点ID") + 1;
	  const netCfgResColumnNum = excelHeadValue.indexOf("网路配置结果") + 1;
	  createARow({
	    ws: worksheet,
	    value: excelHeadValue,
	    rowIdx: ++lastIdx,
	    center: true
	  });

	  // 设置列宽
	  for (let i = 0; i < excelHeadValue.length; i++) {
	    const curCol = worksheet.getColumn(i + 1);
	    curCol.width = 20;
	    if ([curDateBandwidthChartColumnNum, preDateBandwidthChartColumnNum].includes(i + 1)) {
	      curCol.width = 120;
	    }
	    if ([uuidColumnNum, netCfgResColumnNum].includes(i + 1)) {
	      curCol.width = 40;
	    }
	  }
	  data.forEach(_ref => {
	    let {
	      collectionTime,
	      uuid,
	      remark,
	      netCfgRes,
	      preDateBandwidth,
	      prePreDateBandwidth,
	      preDateIncome,
	      prePreDateIncome,
	      difference,
	      curDateBandwidthChart,
	      preDateBandwidthChart,
	      crossNetOperator,
	      businessName,
	      schedulingType
	    } = _ref;
	    lastIdx++;
	    createARow({
	      ws: worksheet,
	      value: [collectionTime, uuid, remark, crossNetOperator, businessName, schedulingType, preDateBandwidth, preDateIncome, prePreDateBandwidth, prePreDateIncome, difference, undefined, undefined,
	      // curDateBandwidthChart,
	      // preDateBandwidthChart,

	      netCfgRes],
	      rowIdx: lastIdx,
	      center: true,
	      height: 300
	    });
	    createAImageRangeChar({
	      wb: workbook,
	      ws: worksheet,
	      base64: curDateBandwidthChart,
	      range: `${numberToCol(curDateBandwidthChartColumnNum)}${lastIdx}:${numberToCol(curDateBandwidthChartColumnNum)}${lastIdx}`
	    });
	    createAImageRangeChar({
	      wb: workbook,
	      ws: worksheet,
	      base64: preDateBandwidthChart,
	      range: `${numberToCol(preDateBandwidthChartColumnNum)}${lastIdx}:${numberToCol(preDateBandwidthChartColumnNum)}${lastIdx}`
	    });
	  });

	  //导出表格数据
	  workbook.xlsx.writeBuffer().then(data => {
	    const blob = new Blob([data], {
	      type: EXCEL_TYPE
	    });
	    const link = document.createElement("a");
	    link.href = window.URL.createObjectURL(blob);
	    link.download = `边缘计算节点数据采集${curDate}.xlsx`;
	    link.click();
	  });
	};

	var script = /*#__PURE__*/Object.freeze({
		__proto__: null,
		getBaseTargetBtn: getBaseTargetBtn$1,
		getAllPageBtn: getAllPageBtn$1,
		addScriptEle: addScriptEle$1,
		fetchIsLoading: fetchIsLoading$1,
		runTask: runTask$1,
		saveExcel: saveExcel$1
	});

	var require$$2 = /*@__PURE__*/getAugmentedNamespace(script);

	const {
	  IsTargetPage
	} = require$$0;
	const {
	  createAsyncTask,
	  sleep,
	  globalLoading,
	  addStyleStr,
	  showTip
	} = require$$1;
	const {
	  getBaseTargetBtn,
	  addScriptEle,
	  fetchIsLoading,
	  getAllPageBtn,
	  runTask,
	  saveExcel
	} = require$$2;
	createAsyncTask(() => IsTargetPage && getBaseTargetBtn().length, () => {
	  const scriptEle = addScriptEle();
	  scriptEle.on("click", async () => {
	    createAsyncTask(() => !fetchIsLoading(), async () => {
	      console.time("总耗时");
	      const {
	        close: closeLoading
	      } = globalLoading(`<div style="text-align: center;"><p>正在采集数据，请稍等...</p><p style="color: red">注：被隐藏的列数据不会被导出。</p></div>`);
	      const styleEl = addStyleStr(`
            .ant-drawer {
              opacity: 0 !important;
            }  
          `);
	      let allData = [];
	      // 拿到所有 page
	      const totalPageEle = getAllPageBtn();
	      const totalPageLength = totalPageEle.length;
	      console.log(`共${totalPageLength}页`);
	      for (let i = 0; i < totalPageLength; i++) {
	        totalPageEle[i].click();
	        await sleep(0.5);
	        const res = await createAsyncTask(() => !fetchIsLoading(), async () => runTask(i), 0.1);
	        allData = allData.concat(res);
	      }
	      console.log(`%c 最终数据`, `color: hotpink; font-size: 20px; font-weight: bold;`, allData);
	      saveExcel(allData);
	      closeLoading();
	      showTip("采集完成~ 文件正在保存，请留意！", 2.5);
	      console.timeEnd("总耗时");
	      styleEl.parentNode.removeChild(styleEl);
	    }, 0.2);
	  });
	});

	return main;

})();
