// ==UserScript==
// @name         某办公系统区域调价
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  针对某办公系统区域调价交互进行优化。
// @author       glk
// @include      http://39.104.68.206:1688/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461309/%E6%9F%90%E5%8A%9E%E5%85%AC%E7%B3%BB%E7%BB%9F%E5%8C%BA%E5%9F%9F%E8%B0%83%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/461309/%E6%9F%90%E5%8A%9E%E5%85%AC%E7%B3%BB%E7%BB%9F%E5%8C%BA%E5%9F%9F%E8%B0%83%E4%BB%B7.meta.js
// ==/UserScript==

const STYLE = `
  #hll_glk {
    display: flex;
    padding: 15px 0 15px 0;
    align-items: center;
  }

  #hll_glk .area > textarea {
    max-height: 40px;
    height: 30px;
    margin: 0px;
    width: 300px;
    height: 40px;
    padding-left: 5px;
    padding-top: 5px;
    font-size: 12px;
  }

  #hll_glk > textarea::-webkit-input-placeholder {
    color: hotpink;
  }

  #hll_glk > label, 
  #hll_glk > textarea {
    margin-right: 10px;
  }

  #hll_glk label > input {
    width: auto;
    padding: 5px 0 5px 5px;
    border: 1px solid #95B8E7;
    border-radius: 4px;
    width: 90px;
  }

  #hll_glk label > input[type="checkbox"] {
    width: auto;
  }
  
  #hll_glk .primary {
    color: #fff;
    background: #1890ff;
    border-color: #1890ff;
    text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
    box-shadow: 0 2px #0000000b;
    cursor: pointer;
    padding: 4px 15px;
    font-size: 13px;
    border-radius: 3px;
    height: 32px;
    line-height: 1.5715;
    position: relative;
    font-weight: 400;
    user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    text-align: center;
    outline: none;
  }

  #hll_glk .danger {
    padding: 5px 10px;
    color: #ff4d4f;
    background: #fff;
    border: 1px solid #ff4d4f;
    border-radius: 3px;
  }

  #hll_glk > label > select {
    padding: 5px 0 5px 5px;
  }

  #hll_glk > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* 数字类型文本框去除上下快捷按钮 */
  #hll_glk input[type=number] {  
    -moz-appearance:textfield;  
  } 
  #hll_glk input[type=number]::-webkit-inner-spin-button,  
  #hll_glk input[type=number]::-webkit-outer-spin-button {  
    -webkit-appearance: none;  
    margin: 0;  
  }

  /* 锚点列表 */
  #anchors_warp {
    position: fixed;
    right: 20px;
    top: 50%;
    height: 70px;
    overflow: hidden;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 27px;
    text-align: center;
    text-decoration: underline;
    width: 20px;
    transform: translateY(-50%);
  }

  #anchors_warp:hover {
    width: auto;
    height: auto;
  }

  #anchors_warp a {
    font-size: 20px;
  }

`;

/**
 * 添加自定义CSS
 * @param {String} styStr 
 */
function addStyle(styStr = "") {
  let _style = document.createElement("style");
  _style.innerHTML = styStr;
  document.getElementsByTagName("head")[0].appendChild(_style);
}

/**
 * @function - 根据百分比返回小数
 * @param {String | Number} num - 百分数或小数
 * @returns 一个小数
 */
function getDecimal(num) {
  let numStr = num.toString();
  if (numStr.includes("%")) {
    return Number(num.replace("%", "")) / 100;
  } else {
    return Number(numStr);
  }
}

// toFixed兼容方法
Number.prototype.toFixed = function (n) {
  if (n > 20 || n < 0) {
    throw new RangeError(
      "toFixed() digits argument must be between 0 and 20"
    );
  }
  const number = this;
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  if (typeof n == "undefined" || n == 0) {
    return Math.round(number).toString();
  }
  let result = number.toString();
  const arr = result.split(".");

  // 整数的情况
  if (arr.length < 2) {
    result += ".";
    for (let i = 0; i < n; i += 1) {
      result += "0";
    }
    return result;
  }
  const integer = arr[0];
  const decimal = arr[1];
  if (decimal.length == n) {
    return result;
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += "0";
    }
    return result;
  }
  result = integer + "." + decimal.substr(0, n);
  const last = decimal.substr(n, 1);

  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, n);
    result = (Math.round(parseFloat(result) * x) + 1) / x;
    result = result.toFixed(n);
  }
  return result;
};

(function () {
  "use strict";

  // 所有计算规则
  const RULES = {
    // 常规
    "general": [
      {
        name: "其他国家",
        key: "all",
        less_than_2: {
          start_price: 3.5, // 起步价
          value_per_gram: 0.048, // 每克运费
        },
      },
      {
        name: "俄罗斯",
        key: "Russian Federation",
        // 订单金额小于 2$
        less_than_2: {
          start_price: 1.54, // 起步价
          value_per_gram: 0.16429, // 每克运费
        },
        // 订单金额大于 2$
        greater_than_2: {
          start_price: 5.32, // 起步价
          value_per_gram: 0.15267, // 每克运费
        },
      },
      {
        name: "美国",
        key: "United States",
        less_than_2: {
        },
      },
      {
        name: "加拿大",
        key: "Canada",
        less_than_2: {
        },
      },
      {
        name: "西班牙",
        key: "Spain",
        less_than_2: {
          start_price: 4.03, // 起步价
          value_per_gram: 0.10196, // 每克运费
        },
        // 订单金额大于 2$
        greater_than_2: {
        },
      },
      {
        name: "法国",
        key: "France",
        less_than_2: {
        },
      },
      {
        name: "英国",
        key: "United Kingdom",
        less_than_2: {
          start_price: 9.23, // 起步价
          value_per_gram: 0.08707, // 每克运费
        },
      },
      {
        name: "荷兰",
        key: "Netherlands",
        less_than_2: {
        },
      },
      {
        name: "以色列",
        key: "Israel",
        less_than_2: {
          start_price: 7.27, // 起步价
          value_per_gram: 0.07463, // 每克运费
        },
      },
      {
        name: "巴西",
        key: "Brazil",
        less_than_2: {
        },
      },
      {
        name: "智利",
        key: "Chile",
        less_than_2: {
        },
      },
      {
        name: "澳大利亚",
        key: "Australia",
        less_than_2: {
          start_price: 6.6, // 起步价
          value_per_gram: 0.0944, // 每克运费
        },
      },
      {
        name: "乌克兰",
        key: "Ukraine",
        less_than_2: {
          start_price: 1.05, // 起步价
          value_per_gram: 0.16436, // 每克运费
        },
        // 订单金额大于 2$
        greater_than_2: {
          start_price: 4.9, // 起步价
          value_per_gram: 0.1134, // 每克运费
        },
      },
      {
        name: "白俄罗斯",
        key: "Belarus",
        less_than_2: {
          start_price: 1.05, // 起步价
          value_per_gram: 0.133, // 每克运费
        },
        // 订单金额大于 2$
        greater_than_2: {
          start_price: 4.485, // 起步价
          value_per_gram: 0.15939, // 每克运费
        },
      },
      {
        name: "日本",
        key: "Japan",
        less_than_2: {
          start_price: 7.26, // 起步价
          value_per_gram: 0.0466, // 每克运费
        },
      },
      {
        name: "韩国",
        key: "South Korea",
        less_than_2: {
          start_price: 6.31, // 起步价
          value_per_gram: 0.049, // 每克运费
        },
      },
      {
        name: "意大利",
        key: "Italy",
        less_than_2: {
        },
      },
      {
        name: "德国",
        key: "Germany",
        less_than_2: {
          start_price: 8.06, // 起步价
          value_per_gram: 0.08103, // 每克运费
        },
      },
      {
        name: "波兰",
        key: "Poland",
        less_than_2: {
        },
      },
      {
        name: "墨西哥",
        key: "Mexico",
        less_than_2: {
        },
      }
    ],
    // POP
    "pop": [
      {
        name: "其他国家",
        key: "all",
        less_than_2: {
          start_price: 3.5, // 起步价
          value_per_gram: 0.048, // 每克运费
        },
      },
      {
        name: "俄罗斯",
        key: "Russian Federation",
        // 订单金额小于 2$
        less_than_2: {
          start_price: 1.562, // 起步价
          value_per_gram: 0.166637, // 每克运费
        },
        // 订单金额大于 2$
        greater_than_2: {
          start_price: 5.396, // 起步价
          value_per_gram: 0.154851, // 每克运费
        },
      },
      {
        name: "美国",
        key: "United States",
        less_than_2: {
        },
      },
      {
        name: "加拿大",
        key: "Canada",
        less_than_2: {
        },
      },
      {
        name: "西班牙",
        key: "Spain",
        less_than_2: {
        },
      },
      {
        name: "法国",
        key: "France",
        less_than_2: {
        },
      },
      {
        name: "英国",
        key: "United Kingdom",
        less_than_2: {
          start_price: 15.5, // 起步价
          value_per_gram: 0.0545, // 每克运费
        },
      },
      {
        name: "荷兰",
        key: "Netherlands",
        less_than_2: {
        },
      },
      {
        name: "以色列",
        key: "Israel",
        less_than_2: {
          start_price: 7.27, // 起步价
          value_per_gram: 0.07463, // 每克运费
        },
      },
      {
        name: "巴西",
        key: "Brazil",
        less_than_2: {
        },
      },
      {
        name: "智利",
        key: "Chile",
        less_than_2: {
        },
      },
      {
        name: "澳大利亚",
        key: "Australia",
        less_than_2: {
          start_price: 2.5, // 起步价
          value_per_gram: 0.22, // 每克运费
        },
      },
      {
        name: "乌克兰",
        key: "Ukraine",
        less_than_2: {
          start_price: 1.065, // 起步价
          value_per_gram: 0.166, // 每克运费
        },
        // 订单金额大于 2$
        greater_than_2: {
          start_price: 4.97, // 起步价
          value_per_gram: 0.115, // 每克运费
        },
      },
      {
        name: "白俄罗斯",
        key: "Belarus",
        less_than_2: {
          start_price: 1.065, // 起步价
          value_per_gram: 0.134, // 每克运费
        },
        // 订单金额大于 2$
        greater_than_2: {
          start_price: 4.615, // 起步价
          value_per_gram: 0.164, // 每克运费
        },
      },
      {
        name: "日本",
        key: "Japan",
        less_than_2: {
          start_price: 7.26, // 起步价
          value_per_gram: 0.0466, // 每克运费
        },
      },
      {
        name: "韩国",
        key: "South Korea",
        less_than_2: {
          start_price: 6.31, // 起步价
          value_per_gram: 0.04947, // 每克运费
        },
      },
      {
        name: "意大利",
        key: "Italy",
        less_than_2: {
          start_price: 23, // 起步价
          value_per_gram: 0.0515, // 每克运费
        },
      },
      {
        name: "德国",
        key: "Germany",
        less_than_2: {
          start_price: 18, // 起步价
          value_per_gram: 0.058, // 每克运费
        },
      },
      {
        name: "波兰",
        key: "Poland",
        less_than_2: {
        },
      },
      {
        name: "墨西哥",
        key: "Mexico",
        less_than_2: {
        },
      }
    ],
    // 荷澳意德(简易)
    "haydjy": [
      {
        name: "其他国家",
        key: "all",
        less_than_2: {
          start_price: 3.5, // 起步价
          value_per_gram: 0.048, // 每克运费
        },
      },
      {
        name: "俄罗斯",
        key: "Russian Federation",
        // 订单金额小于 2$
        less_than_2: {
          start_price: 1.562, // 起步价
          value_per_gram: 0.166637, // 每克运费
        },
        // 订单金额大于 2$
        greater_than_2: {
          start_price: 5.396, // 起步价
          value_per_gram: 0.154851, // 每克运费
        },
      },
      {
        name: "美国",
        key: "United States",
        less_than_2: {
        },
      },
      {
        name: "加拿大",
        key: "Canada",
        less_than_2: {
        },
      },
      {
        name: "西班牙",
        key: "Spain",
        less_than_2: {
        },
      },
      {
        name: "法国",
        key: "France",
        less_than_2: {
        },
      },
      {
        name: "英国",
        key: "United Kingdom",
        less_than_2: {
          start_price: 15.5, // 起步价
          value_per_gram: 0.0545, // 每克运费
        },
      },
      {
        name: "荷兰",
        key: "Netherlands",
        less_than_2: {
        },
      },
      {
        name: "以色列",
        key: "Israel",
        less_than_2: {
          start_price: 7.27, // 起步价
          value_per_gram: 0.07463, // 每克运费
        },
      },
      {
        name: "巴西",
        key: "Brazil",
        less_than_2: {
        },
      },
      {
        name: "智利",
        key: "Chile",
        less_than_2: {
        },
      },
      {
        name: "澳大利亚",
        key: "Australia",
        less_than_2: {
          start_price: 2.5, // 起步价
          value_per_gram: 0.22, // 每克运费
        },
      },
      {
        name: "乌克兰",
        key: "Ukraine",
        less_than_2: {
          start_price: 1.065, // 起步价
          value_per_gram: 0.166, // 每克运费
        },
        // 订单金额大于 2$
        greater_than_2: {
          start_price: 4.97, // 起步价
          value_per_gram: 0.115, // 每克运费
        },
      },
      {
        name: "白俄罗斯",
        key: "Belarus",
        less_than_2: {
          start_price: 1.065, // 起步价
          value_per_gram: 0.134, // 每克运费
        },
        // 订单金额大于 2$
        greater_than_2: {
          start_price: 4.615, // 起步价
          value_per_gram: 0.164, // 每克运费
        },
      },
      {
        name: "日本",
        key: "Japan",
        less_than_2: {
          start_price: 7.26, // 起步价
          value_per_gram: 0.0466, // 每克运费
        },
      },
      {
        name: "韩国",
        key: "South Korea",
        less_than_2: {
          start_price: 6.31, // 起步价
          value_per_gram: 0.04947, // 每克运费
        },
      },
      {
        name: "意大利",
        key: "Italy",
        less_than_2: {
          start_price: 23, // 起步价
          value_per_gram: 0.0515, // 每克运费
        },
      },
      {
        name: "德国",
        key: "Germany",
        less_than_2: {
          start_price: 18, // 起步价
          value_per_gram: 0.058, // 每克运费
        },
      },
      {
        name: "波兰",
        key: "Poland",
        less_than_2: {
        },
      },
      {
        name: "墨西哥",
        key: "Mexico",
        less_than_2: {
        },
      }
    ],
  }

  /**
   * 速卖通区域定价
   */
  class SuMaiTong {
    constructor() {
      // 汇率
      this.EXCHANGE_RATE = 6.7;

      // 联盟成交费
      this.TRANSACTION_FEE = 0.08

      // 是否记住并沿用第一次提交情况
      this.rememberFirstXyjy = false

      // 是否提交了第一次
      this.firstSubmitEd = false

      // 保存第一次提交时各个国家是否使用方案2的情况
      this.firstSubmitData = []

      // 提交第一次中是否有一个国家使用了方案2
      this.hasGreaterThan2 = false

      // 当前计价规则
      this.curRule = "haydjy";

      // 当前计价规则国家配置
      this.curCountryData = RULES[this.curRule];

      // 初始化
      this.init();

    }

    /**
     * 根据表格实时行数添加序号到选择框
     */
    addOptionsToSelect () {
      this.select_order.empty();
      let order_number_options_dom = `<option value="all">所有行</option>`;
      this.priceTableTrLength = this.priceTable.find("tbody tr").length;
      this.select_nums = [];
      for (let i = 0; i < this.priceTableTrLength; i++) {
        order_number_options_dom += `<option value="${i + 1}" >序号${
          i + 1
        }</option>`;
        this.select_nums.push({
          num: i + 1,
          isSeted: false,
        });
      }
      this.select_order.prepend(order_number_options_dom);
    };

    onPaste (event) {
      // 隐藏基准select
      $(".datum_label").css("display", "none");
      // 隐藏计价规则select
      $(".price_rule_label").css("display", "none");

      const html = event.clipboardData.getData("text/html");
      const $doc = new DOMParser().parseFromString(html, "text/html");
      if (!html.includes("其他国家")) {
        alert("粘贴数据有误，请清空后重新粘贴！", $doc);
        $(".area textarea").val("");
        return;
      }

      let data = [];
      Array.from($doc.querySelectorAll("table tr")).map((i, idx) => {
        if (idx > 0) {
          data.push({
            name: i.children[1].textContent, // 国家
            estimated_profit_ratio: i.children[4].textContent, // 预计盈利比
            logistics: i.children[0].textContent, // 物流方式
            xslr: Number(i.children[9].textContent.trim()), // 销售利润
          });
        }
      });

      console.log(`解析的 data`, data);

      // 填充粘贴的数据
      this.curCountryData.forEach((i) => {
        let result = data.filter((j) => j.name === i.name);
        if (result.length) {
          if (i.name === "其他国家") {
            Object.assign(i.less_than_2, {
              estimated_profit_ratio: result[0].estimated_profit_ratio,
              xslr: result[0].xslr
            })
          } else {
            let less_than_2_data = result.find((k) =>
              !k.logistics.includes("无忧简易" )
            );
            let greater_than_2_data = result.find((k) =>
              k.logistics.includes("无忧简易")
            );
            Object.assign(i.less_than_2, {
              estimated_profit_ratio: less_than_2_data["estimated_profit_ratio"],
              xslr: less_than_2_data["xslr"],
            })
            if (greater_than_2_data) {
              Object.assign(i.greater_than_2, {
                estimated_profit_ratio: greater_than_2_data["estimated_profit_ratio"],
                xslr: greater_than_2_data["xslr"],
              })
            }
          }
        }
      });

      // 显示保存按钮
      $(".area button.primary").css("display", "flex");
      
      console.log(
        `%c 格式化后的 this.curCountryData`,
        `color: hotpink; font-size: 15px; font-weight: bold;`,
        this.curCountryData
      );

      // 所有国家Key
      const All_Key = this.curCountryData.map(i => i.key)

      // 重新获取 this.priceTableHeader 的值
      this.priceTableHeader = this.priceTable
        .find('thead th')
        .filter((idx, item) => {
          return All_Key.includes($(item).contents().eq(1).text())
        })
        .map((idx, item) => {
          const eq1 = $(item).contents().eq(1)
          const key = eq1.text()
          return {
              key, // 国家对应的key
              parentThIndex: eq1.parents("th").index(), // 当前国家对应的列索引
            }
        })
        .toArray();

      // 设置所有国家input框的位置
      let allCountrayInputIdx = null;
      this.priceTable.find("thead tr th").each((idx, i) => {
        if ($(i).prop("textContent").includes("售价")) {
          allCountrayInputIdx = $(i).index();
        }
      });
      // 添加【所有国家】项
      this.priceTableHeader.push({
        key: "all",
        parentThIndex: allCountrayInputIdx,
      });
    }

    // 一些自动处理
    autoHandle () {
      // 自动点击 编辑所有区域调价 按钮
      $("a.pdtb5")[0].click()
    }

    // 添加导航锚点
    addAnchors() {
      // 添加子节点 a
      const appendA = (node, name) => {
        const a = document.createElement("a")
        a.setAttribute("name", name)
        Object.assign(a.style, { diplay: "none" })
        node.insertAdjacentElement('afterbegin', a)
        // node.appendChild(a)
      }

      // 锚点列表
      const anchors_warp_el = document.createElement("div")
      anchors_warp_el.id = "anchors_warp"
      anchors_warp_el.innerHTML = `
        <a href="#jbxx">标题</a>
        <a href="#qytj">国家</a>

        <!-- 
          <a href="#lm">类目</a>
          <a href="#wpsx">物品属性</a>
          <a href="#dsx">多属性</a>
          <a href="#color">颜色</a> 
        -->

        <a href="#qytj_table">价格</a>

        <!-- 
          <a href="#tp">图片</a>
          <a href="#yxt">营销图</a>
          <a href="#zdms">终端描述</a>
        -->
      `
      document.body.append(anchors_warp_el)

      // 标题
      const jbxx_el = $("strong:contains('基本信息')")[0]
      appendA(jbxx_el.parentNode, "jbxx")

      // 国家
      const qytj_el = $("span.checkbox-name:contains('区域调价')")[0]
      appendA(qytj_el.parentNode, "qytj")
      
      // 类目
      const lm_el = $("strong:contains('类目')")[0]
      appendA(lm_el.parentNode, "lm")
      
      // 物品属性
      const wpsx_el = $("strong:contains('物品属性')")[0]
      appendA(wpsx_el.parentNode, "wpsx")
      
      // 多属性
      const dsx_el = $("strong:contains('多属性')")[0]
      appendA(dsx_el.parentNode, "dsx")
      
      // 颜色
      const color_el = $("span:contains('颜色(Color)')")[0]
      appendA(color_el.parentNode, "color")
      
      // 价格!!!
      const qytj_table_el = $("#hll_glk")[0]
      appendA(qytj_table_el.parentNode, "qytj_table")

      // 图片
      const tp_el = $("strong:contains('图片')")[0]
      appendA(tp_el.parentNode, "tp")

      // 营销图
      const yxt_el = $("strong:contains('营销图')")[0]
      appendA(yxt_el.parentNode, "yxt")

      // 终端描述
      const zdms_el = $("input[name='descType']")[0]
      appendA(zdms_el.parentNode, "zdms")

    }

    addDomToTable() {
      if (this.priceTable) {
        this.priceTable.parent().prepend(`
          <div id="hll_glk">
            <div class="area">
              <textarea placeholder="在这里粘贴各国数据..."></textarea>
              <label class="datum_label">基准：<select name="datum">
                <option value="xslr">销售利润</option>
                <option value="ylb">预计盈利</option>
              </select></label>
              <label class="price_rule_label">计价规则：<select name="price_rule">
                <option value="haydjy">荷澳意德(简易)</option>
                <option value="pop">POP</option>
                <option value="general">常规</option>
              </select></label>
              <button class="danger">清空</button>
              <button class="primary">保存</button>
            </div>
            <div class="form">
              <label>重量: <input type="number" name="weight" /></label>
              <label>进货价格: <input type="number" name="purchase_price" /></label>
              <label>店铺折扣: <input type="string" name="store_discount" value="70%" /></label>
              <label>汇率: <input type="number" name="exchange_rate" /></label>
              <label>沿用首次提交情况: <input type="checkbox" name="remember_first_xyjy" checked="true" /></label>
              <label>提交到：<select name="order_number"></select></label>
              <button class="primary submit">提交</button>
              <button class="primary goback">返回</button>
            </div>
          </div>
        `);

        // 基准相关
        this.select_datum = $('#hll_glk select[name="datum"]').eq(0);
        this.select_datum.on("change", e => {
          const val = e.target.value
          this.curDatum = val
          localStorage.setItem("curDatum", val) 
        })
        const curDatum = localStorage.getItem("curDatum") 
        if (curDatum) {
          if (!["xslr", "ylb"].includes(curDatum)) {
            alert("不要乱动数据哦！")
          } else {
            this.curDatum = curDatum
            this.select_datum.val(curDatum)
          }
        } else {
          this.curDatum = this.select_datum.val()
          localStorage.setItem("curDatum", this.curDatum)
        }
        
        // 计价规则
        this.select_rule = $('#hll_glk select[name="price_rule"]').eq(0);
        this.select_rule.on("change", e => {
          const val = e.target.value
          this.curRule = val
          this.curCountryData = RULES[val]
          localStorage.setItem("curRule", val) 
        })
        const curRule = localStorage.getItem("curRule") 
        if (curRule) {
          if (!["general", "pop", "haydjy"].includes(curRule)) {
            alert("不要乱动数据哦！")
          } else {
            this.curRule = curRule
            this.select_rule.val(curRule)
          }
        } else {
          this.curRule = this.select_rule.val()
          localStorage.setItem("curRule", this.curRule)
        }
        console.log(`%c 此次数据计算规则是：${this.curRule}`, `color: hotpink; font-size: 20px; font-weight: bold;`);

        // 记录沿用首次无忧简易
        this.remember_first_xyjy_el = $("#hll_glk input[name='remember_first_xyjy']")
        this.rememberFirstXyjy = this.remember_first_xyjy_el.prop("checked")
        this.remember_first_xyjy_el.on("change", e => {
          const _v = e.target.checked
          this.rememberFirstXyjy = _v
        })

        // 动态汇率
        this.exchange_rate_el = $("#hll_glk input[name='exchange_rate']")
        const exchangeRate = localStorage.getItem("exchangeRate") 
        if (exchangeRate) {
          const num = Number(exchangeRate)
          if (isNaN(num)) {
            this.exchange_rate_el.val(this.EXCHANGE_RATE)
          } else {
            this.exchange_rate_el.val(num)
            this.EXCHANGE_RATE = Number(this.exchange_rate_el.val())
          }
        } else {
          this.exchange_rate_el.val(this.EXCHANGE_RATE)
          localStorage.setItem("exchangeRate", this.EXCHANGE_RATE)
          console.log("this.EXCHANGE_RATE", this.EXCHANGE_RATE)
        }
        this.exchange_rate_el.on("change", e => {
          this.EXCHANGE_RATE = Number(e.target.value)
          localStorage.setItem("exchangeRate", this.EXCHANGE_RATE)
        })

        // 自动处理
        this.autoHandle()

        // 文本域的粘贴事件
        $(".area textarea")[0].addEventListener("paste", this.onPaste.bind(this));

        // 隐藏其他表单项和保存按钮
        $("#hll_glk").children(':not(".area")').css("display", "none");
        $(".area button.primary").css("display", "none");

        // 清空 textarea
        $(".area button.danger").on("click", () => {
          $(".area textarea").val("");
          $(".area button.primary").css("display", "none");
        });

        // 保存各国盈利比数据
        $(".area button.primary").on("click", () => {
          console.log(`%c 此次数据计算是以${this.curDatum}为基准`, `color: hotpink; font-size: 15px; font-weight: bold;`, );
          $(".area").css("display", "none")
          $("#hll_glk").children(':not(".area")').css("display", "flex");
        });

        // 序号 select
        this.select_order = $('#hll_glk select[name="order_number"]').eq(0);

        // 添加序号列表dom
        this.addOptionsToSelect();

        // 聚焦从新获取数据
        this.select_order.on("focus", this.addOptionsToSelect.bind(this));

        // 提交数据
        $("#hll_glk button.submit")
          .eq(0)
          .on("click", () => {
            let weight = $("#hll_glk input[name='weight']").val();
            let purchase_price = $("#hll_glk input[name='purchase_price']").val();
            let store_discount = $("#hll_glk input[name='store_discount']").val();

            if (!weight || !purchase_price || !store_discount) { 
              alert("填写数据不完整！");
              return;
            }

            // 计算商品所有国家的最终售价
            this.getCountryExpressFee({ weight, purchase_price, store_discount });

            // 格式化最终数据
            this.formatExpressFee()

            if(!this.firstSubmitEd) {
              this.firstSubmitEd = true
            }

            // 填写最终价格到【对应行】的【对应国家】的文本框上
            if (this.select_order.val() === "all") { // 应用到所有
              for(let i = 0; i < this.select_order.children().length - 1; i++) {
                this.CurData.forEach((j, idx) => {
                  let item = this.priceTableHeader.find((k) => k.key === j.key);
                  if (item) {
                    this.setTdByLineAndColumn(
                      i,
                      item.parentThIndex,
                      j.final_price
                    );
                  }
                });
              }
            } else { // 应用到某行
              this.CurData.forEach((i, idx) => {
                let item = this.priceTableHeader.find((j) => j.key === i.key);
                if (item) {
                  this.setTdByLineAndColumn(
                    Number(
                      $(
                        "#hll_glk select[name='order_number'] option:selected"
                      ).val()
                    ) - 1,
                    item.parentThIndex,
                    i.final_price
                  );
                }
              });
            }
          });
        
        $("#hll_glk button.goback")
          .eq(0)
          .on("click", () => {
            $("#hll_glk").children(':not(".area")').css("display", "none");
            $(".datum_label").css("display", "revert");
            $(".price_rule_label").css("display", "revert");
            $(".area").css("display", "flex")
            $("#hll_glk textarea").eq(0).val("")
          })
      }
    }

    // 获取价格表格
    getPriceTable() {
      return new Promise((resolve) => {
        let timer = null;
        let tableMAP = $("tb-list, .goodsTable");
        if (tableMAP.length) {
          this.priceTable = tableMAP;
          this.priceTableTrLength = this.priceTable.find("tbody tr").length;
          this.priceTableHeader = this.priceTable
            .find('thead th:has("input")')
            .map((idx, item) => {
              return {
                key: $(item).contents().eq(1).text(), // 国家对应的key
                parentThIndex: $(item).contents().eq(1).parents("th").index(), // 当前国家对应的列索引
              };
            })
            .toArray();

          // 添加【所有国家】项
          this.priceTableHeader.push({
            key: "all",
            parentThIndex: 5,
          });
          resolve();
        } else {
          timer = setTimeout(async () => {
            await this.getPriceTable();
            resolve();
          }, 5000);
        }
      });
    }

    // 设置第几行第几列单元格的内容
    setTdByLineAndColumn(line, column, value) {
      this.priceTable
        .find("tbody")
        .find("tr")
        .eq(line)
        .find("td")
        .eq(column)
        .find("input")
        .val(value) // 设置到页面上，此时真实提交数据还为 "0.00"
        [0].__v_model.set(value) // 提交到平台代码中！！！
    }

    async init() {
      await this.getPriceTable();
      addStyle(STYLE);
      this.addDomToTable();
      this.addAnchors()
    }

    /**
     * @function - 计算商品快递费
     * @param {String} key - 国家Key，极特殊的只能根据变动写规则
     * @param {Number} weight - 重量
     * @param {Number} value_per_gram - 每克运费
     * @param {Number} start_price - 起步价
     * @returns {Number} 快递费（四舍五入保留两位有效数字）
     */
    getExpressFee({ key, weight, value_per_gram, start_price }) {
      let result;
      if (!value_per_gram && !start_price) {
        // 是否是POP计价规则
        if (this.curRule === "pop") {
          switch(key) {
            case "United States": // 美国 =IF(AND(0<D3,D3<=175),D3*0.083+41,IF(AND(175<D3,D3<=450),D3*0.083+41,IF(AND(450<D3,D3<=2000),D3*0.083+52)))
              if (weight <= 175) { result = weight * 0.083 + 41 }
              else if (weight > 175 && weight <= 450) { result = weight * 0.083 + 41 }
              else if (weight > 450 && weight <= 2000) { result = weight * 0.083 + 52 }
              break;
            case "Canada": // 加拿大 =IF(AND(0<D3,D3<=30),D3*0.11541+6.41,IF(AND(31<D3,D3<=100),D3*0.0945+7.5,IF(AND(101<D3,D3<=2000),D3*0.09+7.1)))
              if (weight <= 30) { result = weight * 0.11541 + 6.41 }
              else if (weight > 30 && weight <= 100) { result = weight * 0.0945 + 7.5 }
              else if (weight > 100 && weight <= 2000) { result = weight * 0.09 + 7.1 }
              break;
            case "Spain": // 西班牙 =IF(AND(0<D3,D3<=250),D3*0.050268+12.709,IF(AND(250<D3,D3<=500),D3*0.050268+13.703,IF(AND(500<D3,D3<=1000),D3*0.050268+16.401,IF(AND(1000<D3,D3<=2000),D3*0.050268+22.152))))
              if (weight <= 250) { result = weight * 0.050268 + 12.709 }
              else if (weight > 250 && weight <= 500) { result = weight * 0.050268 + 13.703 }
              else if (weight > 500 && weight <= 1000) { result = weight * 0.050268 + 16.401 }
              else if (weight > 1000 && weight <= 2000) { result = weight * 0.050268 + 22.152 }
              break;
            case "France": // 法国 =IF(D3<=300,D3*0.076+16,D3*0.058+21)
              if (weight <= 300) { result = weight * 0.076 + 16 }
              else { result = weight * 0.058 + 21 }
              break;
            case "Netherlands": // 荷兰 =IF(AND(0<D3,D3<=100),D3*0.064468+16.827,IF(AND(100<D3,D3<=200),D3*0.064468+21.371,IF(AND(200<D3,D3<=300),D3*0.064468+23.288,IF(AND(300<D3,D3<=2000),D3*0.064468+21.3))))
              if (weight <= 100) { result = weight * 0.064468 + 16.827 }
              else if (weight > 100 && weight <= 200) { result = weight * 0.064468 + 21.371 }
              else if (weight > 200 && weight <= 300) { result = weight * 0.064468 + 23.288 }
              else if (weight > 300 && weight <= 2000) { result = weight * 0.064468 + 21.3 }
              break;
            case "Brazil": // 巴西 =IF(AND(0<D3,D3<=200),D3*0.055+22,IF(AND(200<D3,D3<=300),D3*0.066+25,IF(AND(300<D3,D3<=500),D3*0.066+27,IF(AND(500<D3,D3<=2000),D3*0.072+28))))
              if (weight <= 200) { result = weight * 0.055 + 22 }
              else if (weight > 200 && weight <= 300) { result = weight * 0.066 + 25 }
              else if (weight > 300 && weight <= 500) { result = weight * 0.066 + 27 }
              else if (weight > 500 && weight <= 2000) { result = weight * 0.072 + 28 }
              break;
            case "Chile": // 智利 =(D3/1000)*113+6.78
              result = (weight / 1000) * 113 + 6.78
              break;
            case "Italy": // 意大利 =IF(AND(0<D3,D3<=100),D3*0.193545+6.9,IF(AND(100<D3,D3<=2000),D3*0.193545+2.898))
              if (weight <= 100) { result = weight * 0.193545 + 6.9 }
              else if (weight > 100 && weight <= 2000) { result = weight * 0.193545 + 2.898 }
              break;
            case "Germany": // 德国 =IF(AND(0<D3,D3<=100),D3*0.067482+13.662,IF(AND(100<D3,D3<=200),D3*0.067482+15.663,IF(AND(200<D3,D3<=300),D3*0.067482+14.49,IF(AND(300<D3,D3<=2000),D3*0.067482+13.662))))
              if (weight <= 100) { result = weight * 0.067482 + 13.662 }
              else if (weight > 100 && weight <= 200) { result = weight * 0.067482 + 15.663 }
              else if (weight > 200 && weight <= 300) { result = weight * 0.067482 + 14.49 }
              else if (weight > 300 && weight <= 2000) { result = weight * 0.067482 + 13.662 }
              break;
            case "Poland": // 波兰 =IF(AND(0<D3,D3<=40),D3*0.05491+4.65,IF(AND(40<D3,D3<=100),D3*0.05792+6.12,IF(AND(100<D3,D3<=2000),D3*0.04763+10.52)))
              if (weight <= 40) { result = weight * 0.05491 + 4.65 }
              else if (weight > 40 && weight <= 100) { result = weight * 0.05792 + 6.12 }
              else if (weight > 100 && weight <= 2000) { result = weight * 0.04763 + 10.52 }
              break;
            case "Mexico": // 墨西哥 =IF(AND(0<D3,D3<=100),D3*0.040683+12.993,IF(AND(100<D3,D3<=200),D3*0.040683+16.61,IF(AND(200<D3,D3<=300),D3*0.040683+18.18,D3*0.040683+23.36)))
              if (weight <= 100) { result = weight * 0.040683 + 12.993 }
              else if (weight > 100 && weight <= 200) { result = weight * 0.040683 + 16.61 }
              else if (weight > 200 && weight <= 300) { result = weight * 0.040683 + 18.18 }
              else if (weight > 300 && weight <= 2000) { result = weight * 0.040683 + 23.36 }
              break;
          }
        } else if (this.curRule === "general") {
          switch(key) {
            case "United States": // 美国 =IF(D3<=100,D3*0.09104+11.2,D3*0.11837+13.93)
              if (weight <= 100) { result = weight * 0.09104 + 11.2 }
              else { result = weight * 0.11837 + 13.93 }
              break;
            case "Canada": // 加拿大 =IF(D3<=30,D3*0.11541+6.41,D3*0.09+7.1)
              if (weight <= 30) { result = weight * 0.11541 + 6.41 }
              else { result = weight * 0.09 + 7.1 }
              break;
            case "Spain": // 西班牙 =IF(AND(0<D3,D3<=250),D3*0.04956+12.53,IF(AND(250<D3,D3<=500),D3*0.04956+13.51,IF(AND(500<D3,D3<=1000),D3*0.04956+16.17)))
              if(weight > 0 && weight <= 250) { result = weight * 0.04956+12.53 }
              else if(weight > 250 && weight <= 500) { result = weight * 0.04956+13.51 }
              else if(weight > 500 && weight <= 1000) { result = weight * 0.04956+16.17 }
              break;
            case "France": // 法国 =IF(D3<100,D3*0.0693+6.67,D3*0.04066+9.65)
              if (weight < 100) { result = weight * 0.0693 + 6.67 }
              else { result = weight * 0.04066 + 9.65 }
              break;
            case "Netherlands": // 荷兰 =IF(D3<=100,D3*0.0729+6.72,D3*0.05394+7.29)
              if (weight <= 100) { result = weight * 0.0729 + 6.72 }
              else { result = weight * 0.05394 + 7.29 }
              break;
            case "Brazil": // 巴西 
              // 7.11 =IF(AND(0<D3,D3<=200),D3*0.055+22,IF(AND(200<D3,D3<=300),D3*0.066+25,IF(AND(300<D3,D3<=500),D3*0.066+27,IF(AND(500<D3,D3<=2000),D3*0.072+28))))
              if(weight > 0 && weight <= 200) { result = weight * 0.055 + 22 }
              else if (weight > 200 && weight <= 300) { result = weight * 0.066 + 25 }
              else if (weight > 300 && weight <= 500) { result = weight * 0.066 + 27 }
              else if (weight > 500 && weight <= 2000) { result = weight * 0.072 + 28 }
              break;
            case "Chile": // 智利 =(D3/1000)*113+6.78
              result = (weight / 1000) * 113 + 6.78
              break;
            case "Italy": // 意大利 =IF(D3<=100,D3*0.0715+6.62,D3*0.05132+7.2)
              if (weight <= 100) { result = weight * 0.0715+ 6.62 }
              else { result = weight * 0.05132+ 7.2 }
              break;
            case "Poland": // 波兰 =IF(AND(0<D3,D3<=40),D3*0.05491+4.65,IF(AND(40<D3,D3<=100),D3*0.05792+6.12,IF(AND(100<D3,D3<=2000),D3*0.04763+10.52)))
              if(weight > 0 && weight <= 40) { result = weight * 0.05491 + 4.65 }
              else if (weight > 40 && weight <= 100) { result = weight * 0.05792 + 6.12 }
              else if (weight > 100 && weight <= 2000) { result = weight * 0.04763 + 10.52 }
              break;
            case "Mexico": // 墨西哥 =IF(D3<=30,D3*0.1999+1.32,D3*0.07744+5)
              if (weight <= 30) { result = weight * 0.1999+1.32 }
              else { result = weight * 0.07744 + 5 }
              break;
          }
        } else if (this.curRule === "haydjy") {
          switch(key) {
            case "United States": // 美国 =IF(AND(0<D3,D3<=175),D3*0.083+41,IF(AND(175<D3,D3<=450),D3*0.083+41,IF(AND(450<D3,D3<=2000),D3*0.083+52)))
              if (weight <= 175) { result = weight * 0.083 + 41 }
              else if (weight > 175 && weight <= 450) { result = weight * 0.083 + 41 }
              else if (weight > 450 && weight <= 2000) { result = weight * 0.083 + 52 }
              break;
            case "Canada": // 加拿大 =IF(AND(0<D3,D3<=30),D3*0.11541+6.41,IF(AND(31<D3,D3<=100),D3*0.0945+7.5,IF(AND(101<D3,D3<=2000),D3*0.09+7.1)))
              if (weight <= 30) { result = weight * 0.11541 + 6.41 }
              else if (weight > 30 && weight <= 100) { result = weight * 0.0945 + 7.5 }
              else if (weight > 100 && weight <= 2000) { result = weight * 0.09 + 7.1 }
              break;
            case "Spain": // 西班牙 =IF(AND(0<D3,D3<=250),D3*0.050268+12.709,IF(AND(250<D3,D3<=500),D3*0.050268+13.703,IF(AND(500<D3,D3<=1000),D3*0.050268+16.401,IF(AND(1000<D3,D3<=2000),D3*0.050268+22.152))))
              if (weight <= 250) { result = weight * 0.050268 + 12.709 }
              else if (weight > 250 && weight <= 500) { result = weight * 0.050268 + 13.703 }
              else if (weight > 500 && weight <= 1000) { result = weight * 0.050268 + 16.401 }
              else if (weight > 1000 && weight <= 2000) { result = weight * 0.050268 + 22.152 }
              break;
            case "France": // 法国 =IF(D3<=300,D3*0.076+16,D3*0.058+21)
              if (weight <= 300) { result = weight * 0.076 + 16 }
              else { result = weight * 0.058 + 21 }
              break;
            case "Netherlands": // 荷兰 =IF(AND(0<D3,D3<=100),D3*0.064468+16.827,IF(AND(100<D3,D3<=200),D3*0.064468+21.371,IF(AND(200<D3,D3<=300),D3*0.064468+23.288,IF(AND(300<D3,D3<=2000),D3*0.064468+21.3))))
              if (weight <= 100) { result = weight * 0.064468 + 16.827 }
              else if (weight > 100 && weight <= 200) { result = weight * 0.064468 + 21.371 }
              else if (weight > 200 && weight <= 300) { result = weight * 0.064468 + 23.288 }
              else if (weight > 300 && weight <= 2000) { result = weight * 0.064468 + 21.3 }
              break;
            case "Brazil": // 巴西 =IF(AND(0<D3,D3<=200),D3*0.055+22,IF(AND(200<D3,D3<=300),D3*0.066+25,IF(AND(300<D3,D3<=500),D3*0.066+27,IF(AND(500<D3,D3<=2000),D3*0.072+28))))
              if (weight <= 200) { result = weight * 0.055 + 22 }
              else if (weight > 200 && weight <= 300) { result = weight * 0.066 + 25 }
              else if (weight > 300 && weight <= 500) { result = weight * 0.066 + 27 }
              else if (weight > 500 && weight <= 2000) { result = weight * 0.072 + 28 }
              break;
            case "Chile": // 智利 =(D3/1000)*113+6.78
              result = (weight / 1000) * 113 + 6.78
              break;
            case "Italy": // 意大利 =IF(AND(0<D3,D3<=100),D3*0.193545+6.9,IF(AND(100<D3,D3<=2000),D3*0.193545+2.898))
              if (weight <= 100) { result = weight * 0.193545 + 6.9 }
              else if (weight > 100 && weight <= 2000) { result = weight * 0.193545 + 2.898 }
              break;
            case "Germany": // 德国 =IF(AND(0<D3,D3<=100),D3*0.067482+13.662,IF(AND(100<D3,D3<=200),D3*0.067482+15.663,IF(AND(200<D3,D3<=300),D3*0.067482+14.49,IF(AND(300<D3,D3<=2000),D3*0.067482+13.662))))
              if (weight <= 100) { result = weight * 0.067482 + 13.662 }
              else if (weight > 100 && weight <= 200) { result = weight * 0.067482 + 15.663 }
              else if (weight > 200 && weight <= 300) { result = weight * 0.067482 + 14.49 }
              else if (weight > 300 && weight <= 2000) { result = weight * 0.067482 + 13.662 }
              break;
            case "Poland": // 波兰 =IF(AND(0<D3,D3<=40),D3*0.05491+4.65,IF(AND(40<D3,D3<=100),D3*0.05792+6.12,IF(AND(100<D3,D3<=2000),D3*0.04763+10.52)))
              if (weight <= 40) { result = weight * 0.05491 + 4.65 }
              else if (weight > 40 && weight <= 100) { result = weight * 0.05792 + 6.12 }
              else if (weight > 100 && weight <= 2000) { result = weight * 0.04763 + 10.52 }
              break;
            case "Mexico": // 墨西哥 =IF(AND(0<D3,D3<=100),D3*0.040683+12.993,IF(AND(100<D3,D3<=200),D3*0.040683+16.61,IF(AND(200<D3,D3<=300),D3*0.040683+18.18,D3*0.040683+23.36)))
              if (weight <= 100) { result = weight * 0.040683 + 12.993 }
              else if (weight > 100 && weight <= 200) { result = weight * 0.040683 + 16.61 }
              else if (weight > 200 && weight <= 300) { result = weight * 0.040683 + 18.18 }
              else if (weight > 300 && weight <= 2000) { result = weight * 0.040683 + 23.36 }
              break;
          }
        }
      } else {
        result = weight * value_per_gram + start_price
      }
      return Number(result.toFixed(2))
    }

    /**
     * @function 计算销售价格（$）和通途最终价（$）
     * @param {Number} express_fee - 快递费
     * @param {Number} purchase_price - 进货价格(￥)
     * @param {Number|String} estimated_profit_ratio - 预计盈利比（%|小数）
     * @param {Number} exchange_rate - // 汇率
     * @param {Number|String} store_discount - 店铺折扣(%|小数)
     * @returns { price, final_price } - 销售价格 折后最终价
     */
    getPriceAndFinalPrice(opt = {}) {
      const {
        express_fee,
        purchase_price,
        estimated_profit_ratio,
        exchange_rate,
        store_discount,
      } = opt;
      let price =
        (express_fee + getDecimal(purchase_price)) /
        (1 -
          getDecimal(estimated_profit_ratio) -
          this.TRANSACTION_FEE) /
        exchange_rate;
      return {
        price: Number(price.toFixed(2)),
        final_price: Number(
          (price / getDecimal(store_discount)).toFixed(2)
        ),
      };
    }

    /**
     * @function 根据商品重量、进货价格、店铺折扣得到基础快递费、销售价格、最终价和其他国家对应的快递费、销售价格、最终价
     * @param {Number} weight - 商品重量(每克)
     * @param {Number} purchase_price - 进货价格(￥)
     * @param {Number|String} store_discount - 店铺折扣(%|小数)
     */
    getCountryExpressFee({
      weight,
      purchase_price,
      store_discount,
    }) {
      console.log(
        `%c 
          重量【${weight}g】
          进货价格【${purchase_price}】
          店铺折扣【${store_discount}】
          当前计价规则【${this.curRule}】
          基准【${this.curDatum}】  
        时`,
        `color: #000; font-size: 18px; font-weight: bold;`,
        this.curCountryData
      );
      this.CurData = JSON.parse(JSON.stringify(this.curCountryData)).map((i, idx) => {
        console.log("\n\n")
        let _price = 0,
          _final_price = 0,
          result,
          result2;
        const {
          name,
          key,
          less_than_2: {
            start_price: start_price_1,
            value_per_gram: value_per_gram_1,
            xslr: xslr_1
          },
        } = i;
        let express_fee1 = this.getExpressFee({
          key,
          weight,
          value_per_gram: value_per_gram_1,
          start_price: start_price_1,
        })
        if (this.curDatum === "xslr") {
          console.log(`${name} 原利润比`, i, i.less_than_2.estimated_profit_ratio);
          i.less_than_2.estimated_profit_ratio = this.getYlbByXslr({ xslr: xslr_1, purchase_price, express_fee: express_fee1, exchange_rate: this.EXCHANGE_RATE })
          console.log(`${name} 计算后利润比`, i.less_than_2.estimated_profit_ratio);
        }
        result = this.getPriceAndFinalPrice({
          express_fee: express_fee1,
          purchase_price,
          estimated_profit_ratio: i.less_than_2.estimated_profit_ratio,
          exchange_rate: this.EXCHANGE_RATE,
          store_discount,
        });

        if (i.greater_than_2) {
          const {
            start_price: start_price_2,
            value_per_gram: value_per_gram_2,
            xslr: xslr_2
          } = i.greater_than_2;
          let express_fee2 = this.getExpressFee({
            key,
            weight,
            value_per_gram: value_per_gram_2,
            start_price: start_price_2,
          })
          if (this.curDatum === "xslr") {
            console.log(`${name} 方案2原利润比`, i, i.greater_than_2.estimated_profit_ratio);
            i.greater_than_2.estimated_profit_ratio = this.getYlbByXslr({ xslr: xslr_2, purchase_price, express_fee: express_fee2, exchange_rate: this.EXCHANGE_RATE })
            console.log(`${name} 方案2计算后利润比`, i.greater_than_2.estimated_profit_ratio);
          }
          result2 = this.getPriceAndFinalPrice({
            express_fee: express_fee2,
            purchase_price,
            estimated_profit_ratio: i.greater_than_2.estimated_profit_ratio,
            exchange_rate: this.EXCHANGE_RATE,
            store_discount,
          });
        }

        // 记住首次情况
        if(this.rememberFirstXyjy) {
          if (this.firstSubmitEd) { // 不是第一次提交
            if (this.firstSubmitData.length) { // 第一次是记住了首次情况
              const curKeyWay = this.firstSubmitData.find(i => i.key === key) // 找到当前国家第一次的情况
              if(curKeyWay) {
                if (curKeyWay.use_price_plan === 1) {
                  _price = result["price"];
                  _final_price = result["final_price"];
                } else if (curKeyWay.use_price_plan === 2) {
                  _price = result2["price"];
                  _final_price = result2["final_price"];
                }
              }
            } else { // 第一次没有记住
              if (result2 && result["price"] > 2) {
                _price = result2["price"];
                _final_price = result2["final_price"];
              } else {
                _price = result["price"];
                _final_price = result["final_price"];
              }
            }
          } else {
            if (result2 && result["price"] > 2) {
              _price = result2["price"];
              _final_price = result2["final_price"];
              this.hasGreaterThan2 = true
            } else {
              _price = result["price"];
              _final_price = result["final_price"];
            }
          }
        } else {
          if (result2 && result["price"] > 2) {
            _price = result2["price"];
            _final_price = result2["final_price"];
          } else {
            _price = result["price"];
            _final_price = result["final_price"];
          }
        }

        console.log(`最终【${name}】的销售价格和最终价是：`, _price, _final_price);
        return {
          name,
          key,
          result,
          result2,
          price: _price,
          final_price: _final_price,
        };
      });

      // 第一次提交时，判断是否有国家使用方案2，若有则修改其他所有有方案2的国家使用方案2
      if (this.rememberFirstXyjy && !this.firstSubmitEd) {
        this.CurData.forEach(i => {
          if (this.hasGreaterThan2) {
            if (i.result2) {
              const { final_price, price } = i.result2
              i.price = price
              i.final_price = final_price
              this.firstSubmitData.push({
                key: i.key,
                use_price_plan: 2
              })
            } else {
              this.firstSubmitData.push({
                key: i.key,
                use_price_plan: 1
              })
            }
          } else {
            this.firstSubmitData.push({
              key: i.key,
              use_price_plan: 1
            })
          }
        })
      }
      console.log("\n\n")
      console.log("%c ==================", "color: red;");
      console.log(`本次提交的最终信息`, this.CurData);
      console.log(`第一次提交时各个国家是否使用方案2的情况`, this.firstSubmitData);
      console.log("%c ==================", "color: red;");
    }

    /**
     * 格式化最终数据
     * @returns 
     */
    formatExpressFee() {
      if (!this.CurData) {
        console.log("还没有数据呢~")
        return
      }

      // 其他国家最终价格若低于所有国家最终价格的 50%，则最终价格设置为 50% 的值
      const allFinalPrice = this.CurData.find(i => i.key === "all").final_price;
      const targetPrice = (allFinalPrice / 2).toFixed(2);
      console.log("\n\n")
      console.log("==========================")
      console.log("%c 普通国家最终价的 50%值是：", "color: black;", targetPrice);
      this.CurData.forEach((i, idx) => {
        if (i.key !== "all") {
          if (i.final_price < targetPrice) {
            console.log(`%c 【${i.name}】 最终价格【${i.final_price}】 低于普通国家的 50%，将被替换`, "color: #5b6bd8;")
            this.CurData[idx].final_price = targetPrice;
          }
        }
      })
      console.log("==========================")
    }

    /**
     * 通过销售利润（￥）得到预计盈利比
     * @param {*} item 
     * @returns 
     */
    getYlbByXslr({ xslr, purchase_price, express_fee, exchange_rate }) {
      // 先得到销售价格
      const xsj = (xslr + getDecimal(purchase_price) + express_fee) / (1 - this.TRANSACTION_FEE) / exchange_rate
      console.log(`通过设置销售利润为 ${xslr}￥ 得到的销售价格${xsj}`);
      // 通过销售价格得到盈利比
      const ylb = 1 - ((express_fee + getDecimal(purchase_price)) / (xsj * exchange_rate) + this.TRANSACTION_FEE)
      console.log(`通过设置销售利润为 ${xslr}￥ 得到的预计盈利比${ylb} ${(ylb*100).toFixed(2)}%`);
      return ylb
      return Number(ylb.toFixed(4)) // 实际保留4位有效数字也是可以的(也就是盈利比 **.**% )，为了更准确就不做更改!
    }

    dispose() {}
  }
  window.App = new SuMaiTong();
})();
