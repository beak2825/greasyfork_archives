// ==UserScript==
// @name        Xueqiu Follow Helper
// @namespace   https://github.com/henix/userjs/xueqiu_helper
// @description 在雪球组合上显示最近一个交易日调仓的成交价。允许为每个组合设置预算，并根据预算计算应买卖的股数。
// @author      henix
// @version     20200704.1
// @match       http://xueqiu.com/P/*
// @match       https://xueqiu.com/P/*
// @license     MIT License
// @require     https://cdn.jsdelivr.net/npm/domo@0.5.9/lib/domo.js
// @downloadURL https://update.greasyfork.org/scripts/12995/Xueqiu%20Follow%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/12995/Xueqiu%20Follow%20Helper.meta.js
// ==/UserScript==

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
 */
Math.sign = Math.sign || function(x) {
  return ((x > 0) - (x < 0)) || +x;
};

function insertSheet(ruleString, atstart) {
  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  var rules = document.createTextNode(ruleString);
  style.type = "text/css";
  if(style.styleSheet) {
    style.styleSheet.cssText = rules.nodeValue;
  } else {
    style.appendChild(rules);
  }
  if (atstart) {
    head.insertBefore(style, head.children[0]);
  } else {
    head.appendChild(style);
  }
}

function ajaxGetJson(url, onSuccess) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "json";
  xhr.onload = function() {
    if (this.status == 200) {
      onSuccess(this.response);
    }
  };
  xhr.send();
}

function myround(x) {
  return Math.sign(x) * Math.round(Math.abs(x));
}

function pad2(x) {
  return x >= 10 ? x : "0" + x;
}

var symbol = location.pathname.substring("/P/".length);

function FollowDetails(elem) {
  this.elem = elem;
  this.symbol = elem.getAttribute("symbol");
}

FollowDetails.prototype.repaint = function(data) {
  var $this = this;
  var rebalances = data.rebalances;
  var budget = data.budget;
  var buyfactor = data.buyfactor;
  var cur_prices = data.cur_prices;

  // 过滤掉系统分红
  rebalances.list = rebalances.list.filter(function(o) { return o.category == "user_rebalancing"; });

  var frag = document.createDocumentFragment();

  var now = new Date(rebalances.list[0].updated_at);
  var lastday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  var trs = [TR(TH("名称"), TH("百分比"), TH("参考成交价" + (buyfactor != 1 ? " / 挂买价" : "")), TH("买卖股数" + (buyfactor != 1 ? " / 挂买股数" : "")))];
  for (var a of rebalances.list.filter(function(o) { return o.updated_at > lastday && (o.status == "success" || o.status == "pending"); })) {
    var utime = new Date(a.updated_at);
    trs.push(TR(TD({ colspan: 4 }, utime.getFullYear() + "-" + (utime.getMonth()+1) + "-" + utime.getDate() + " " + utime.getHours() + ":" + pad2(utime.getMinutes()) + ":" + pad2(utime.getSeconds()) + (a.status == "pending" ? "（待成交）" : ""))));
    a.rebalancing_histories.forEach(function(r) {
      var prev_weight = r.prev_weight_adjusted || 0;
      var delta = r.target_weight - prev_weight;
      var price = r.price || cur_prices[r.stock_symbol];
      if (delta && !price) {
        // 开盘前无价格，使用当前价格
        ajaxGetJson("/stock/quotep.json?stockid=" + r.stock_id, function(info) {
          cur_prices[r.stock_symbol] = info[r.stock_id].current; // TODO: immutable map
          $this.repaint(data);
        });
      }
      var quantity = budget * delta / 100 / price;
      trs.push(TR(
        TD(A({ target: "_blank", href: "/S/" + r.stock_symbol }, r.stock_name), "(" + r.stock_symbol.replace(/^SH|^SZ/, "$&.") + ")"),
        TD(prev_weight + "% → " + r.target_weight + "%"),
        TD(delta ? (price ? (price + (r.price ? ((buyfactor != 1 && delta > 0) ? (" / " + Math.round(price * buyfactor * 1000) / 1000) : "") : "（当前价）")) : "正在获取") : "无"),
        TD(delta ? (price ? (myround(quantity) + ((buyfactor != 1 && delta > 0) ? (" / " + Math.round(quantity / buyfactor)) : "")) : "正在获取") : "无")
      ));
    });
  }
  frag.appendChild(TABLE.apply(null, trs));

  var budgetInput = INPUT({ value: budget, size: 10 });
  var budgetSave = INPUT({ type: "button", value: "保存" });
  budgetSave.addEventListener("click", function() {
    budget = parseInt(budgetInput.value, 10);
    localStorage.setItem("follow.budget." + $this.symbol, budget);
    data.budget = budget; // TODO: immutable map
    $this.repaint(data);
  });
  var buyfactorInput = INPUT({ value: buyfactor, size: 4 });
  var buyfactorSave = INPUT({ type: "button", value: "保存" });
  buyfactorSave.addEventListener("click", function() {
    localStorage.setItem("follow.buyfactor." + $this.symbol, buyfactorInput.value);
    data.buyfactor = parseFloat(buyfactorInput.value); // TODO: immutable map
    $this.repaint(data);
  });
  frag.appendChild(DIV({ "class": "budget-setting" }, "预算 ", budgetInput, " 元 ", budgetSave, " 挂买价 = 参考成交价 * ", buyfactorInput, " ", buyfactorSave));

  this.elem.innerHTML = "";
  this.elem.appendChild(frag);
};

ajaxGetJson("/cubes/rebalancing/history.json?cube_symbol=" + symbol + "&count=20&page=1", function(histories) {
  var cubeAction = document.getElementById("cube-action");
  var div = DIV({ "class": "-FollowDetails", "symbol": symbol });
  cubeAction.parentNode.insertBefore(div, cubeAction.nextSibling);

  var followDetails = new FollowDetails(div);
  followDetails.repaint({
    rebalances: histories,
    budget: parseInt(localStorage.getItem("follow.budget." + symbol) || 10000, 10),
    buyfactor: parseFloat(localStorage.getItem("follow.buyfactor." + symbol) || 1),
    cur_prices: {}
  });
});

insertSheet(
".-FollowDetails table { width: 100%; margin: 10px auto; }" +
".-FollowDetails th { font-weight: bold; }" +
".-FollowDetails th, .-FollowDetails td { border: 1px solid black; padding: 0.5em; }" +
".-FollowDetails .budget-setting { margin: 10px 0 20px 0; }"
);
