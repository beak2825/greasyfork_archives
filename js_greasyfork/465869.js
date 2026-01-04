// ==UserScript==
// @name         公共数据库-销量排行
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       glk
// @match        http://39.104.68.206:1688/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.core.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.9/dayjs.min.js
// @grant        none
// @description  查询指定周期的内商品销量排行
// @downloadURL https://update.greasyfork.org/scripts/465869/%E5%85%AC%E5%85%B1%E6%95%B0%E6%8D%AE%E5%BA%93-%E9%94%80%E9%87%8F%E6%8E%92%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/465869/%E5%85%AC%E5%85%B1%E6%95%B0%E6%8D%AE%E5%BA%93-%E9%94%80%E9%87%8F%E6%8E%92%E8%A1%8C.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const Host = "http://39.104.68.206:1688";
  const Base_Url = `${Host}/api`;
 
  const STYLE_SHEET = `
		#cycle_input {
      width: 50px;
		}

    #search_wrap.disabled {
      cursor: no-drop;
      color: #ccc;
    }
	`;

  // 默认查询周期
  const Default_Cycle_Num = 30;

  function addStyle(styStr = "") {
    let _style = document.createElement("style");
    _style.innerHTML = styStr;
    document.getElementsByTagName("head")[0].appendChild(_style);
  }

  // 判断日期是否在cycle周期内
  function isWithinCycle (target_date, cycle=30) {
    return dayjs().diff(dayjs(target_date), "day") <= cycle
  }

  // 休眠
  function sleep(duration = 3) {
    return new Promise(resolve => {
      setTimeout(resolve, duration * 1000)
    })
  }

  // 轮训根据录入时间查询数据，直到日期小于指定周期时停止；
  // 将获取到的数据按照七日销量进行排序
  function getData(cycle=30, page_size=20) {
    cycle = Number(cycle)
    if (cycle >= 10) {
      showTip(`周期有点长，需要妮的耐心等待~`, 2.5)
    } else {
      showTip(`请耐心等待~`, 2.5)
    }
    return new Promise((resolve) => {
      // 当前页
      let current = 1, data = []
      const token = window.parent.location.search.slice(3);
      const sidx = "CreateDate"; // 查询条件
      const sord = "desc"; // 排序方式

      const fn = () => {
        console.log(`查询第${current}页`);
        const Url = `${Base_Url}/cloudapi/getpagedata?Event=20165&JsonValue=%7B%22IsSale%22%3A%22%22%7D&Token=${token}&_search=false&nd=1683642109407&rows=${page_size}&page=${current}&sidx=${sidx}&sord=${sord}`;
        fetch(Url, {
          method: "GET",
        }) .then((res) => res.json())
        .then(async (res) => {
          if (res && res.rows && res.rows.length) {
            const rows = res.rows;
            const lastItemDate = rows[rows.length - 1].CreateDate
            console.log(`最后一个日期是`, lastItemDate);
            if (isWithinCycle(lastItemDate, cycle)) {
              current ++
              // await sleep(0.5)
              console.log(`继续查询`);
              fn()
            } else {
              console.log(`查询结束`, data, data.length, current);
              resolve(data)
            }
            data.push(...res.rows)
          }
        });
      }
      fn()
    });
  }

  // json转excel
  function jsonToExcel(json) {
    var filename = `${window.glk_cycle_num}天销排行-${Date.now()}.xls`;
    var ws_name = "销量排行ღ( ´･ᴗ･` )比心";
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(json);
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);
  }

   // 小提示
   const showTip = (message, duration = 0.8, pos) => {
    let show_tip = document.getElementById('show_tip')
    if (show_tip) {
      document.body.removeChild(show_tip)
    }
    let tipDom = document.createElement('div')
    tipDom.id = 'show_tip'
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
      fontSize: '0.75rem',
      animation: `tipanimation ${duration}s 1`
    })
    if (pos) {
      const { left, top, offsetX = 0, offsetY = 0 } = pos
      Object.assign(tipDom.style, {
        top: (top + offsetY) + 'px',
        left: (left + offsetX) + 'px',
        transform: 'none'
      })
    }
    tipDom.innerText = message
    document.body.appendChild(tipDom)

    setTimeout(() => {
      let show_tip = document.getElementById('show_tip')
      if (show_tip) {
        document.body.removeChild(show_tip)
      }
    }, duration * 1000 - 100)
  }

  window.onload = function () {
    let timer, fetching = false;
    const cycleInput = document.createElement("input");
    const searchBtn = document.createElement("button");
    searchBtn.id = "search_wrap";
    cycleInput.id = "cycle_input"
    searchBtn.className = "btn btn-default";
    cycleInput.className = "btn btn-default";
    searchBtn.innerText = "七日销量排行";

    const cur_cycle_Num = localStorage.getItem("cycle_num") || Default_Cycle_Num
    cycleInput.value = window.glk_cycle_num =cur_cycle_Num
    cycleInput.onchange = e => {
      console.log(`e`, e.target, e);
      const val = e.target.value;
      window.glk_cycle_num = val
      localStorage.setItem("cycle_num", val)
    }

    searchBtn.onclick = async () => {
      if (fetching) { return }
      search_wrap.classList.add("disabled")
      showTip("去做别的吧，宝~ （づ￣3￣）づ╭❤～好了我会喊你❥(^_-)", 3.5)
      fetching = true
      const res = await getData(window.glk_cycle_num);
      console.log("获取数据", res);
      if (res && res.length) {
        let arr = _.orderBy(res, ["SevendayCount"], ["desc"]); // 'asc'
        fetching = false
        search_wrap.classList.remove("disabled")
        let confirm = window.confirm("Lili, I'm ready to download it now, okay?")
        if (confirm) {
          const getIsSaleNameOptionName = (val) => {
            if (val === 1) {
              return "在售产品"
            } else if (val === 2) {
              return "清仓产品"
            } else if (val === 3) {
              return "停售产品"
            } else if (val === 3) {
              return "归档产品"
            } else { return val || "" }
          }
          jsonToExcel(arr.map(i => {
            return {
              " 产品编号": i.ProductCode,
              " 产品名称": i.ProductName,
              " 七日销量": i.SevendayCount,
              " 录入时间": i.CreateDate,
              "产品分类": i.CategoryName,
              "组合品": i.GroupFlag ? "是" : "否",
              "SKU数": i.SkuCount,
              "在线": i.OnLineCount,
              "15日销量": i.HalfMonthCount,
              "30日销量": i.MonthCount,
              "历史日销量": i.TotalCount,
              "总库存": i.TotalInventory,
              "售价($)": i.SalePrice,
              "开发方式": i.DevelopType === 1 ? "正向开发" : i.DevelopType === 2 ? "反向开发" : i.DevelopType,
              "产品状态": getIsSaleNameOptionName(i.IsSaleName),
              // "安全值": ,
              // "类型": ,
              "导ERP": i.IsImportErp ? "是" : "否",
              // "首选平台": i.Platform,
              "仓库": i.WareHouse,
              "供应商所在地": i.SupplierLocation,
              "开发员": i.CreateUserName,
              "美工": i.ArtistUserId,
              "文案": i.CreateUserName,
              "供应商链接": i.SupplierUrl,
              "开发目标源链接": i.AimUrl,
              "禁止刊登平台": i.PlatformIds,
              " 主图": i.DefaultPic,
            }
          }))
          await sleep(1)
          showTip("吃水不忘挖井人 o(︶︿︶)o 时刻想念glk", 3)
        }
      }
    };

    addStyle(STYLE_SHEET);

    timer = setInterval(() => {
      const toolBar = $(".toolbar")[0];
      if (toolBar) {
        toolBar.append(searchBtn);
        toolBar.append(cycleInput);
        clearInterval(timer);
      }
    }, 1000);
  };
})();
