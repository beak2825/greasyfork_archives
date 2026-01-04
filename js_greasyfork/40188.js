// ==UserScript==
// @name     colorDate
// @namespace https://github.com/mika-cn/user-scripts
// @description "Set date color according to date 根据网页上日期的新旧程度， 给日期进行着色， 比如说已经是5年前的一个日期会成为红色， 以便提醒阅览者，注意信息可能过于陈旧。"
// @version  1.3.0
// @grant    none
// @include *
// @author   mika
// @downloadURL https://update.greasyfork.org/scripts/40188/colorDate.user.js
// @updateURL https://update.greasyfork.org/scripts/40188/colorDate.meta.js
// ==/UserScript==
/**
 *
 * # CHANGE LOG
 * 2018-06-18 [修复] 对于隐藏的文本，不再进行着色
 * 2018-04-17 支持<01.01> <2007.09> 格式
 *            修正标签正则
 * 2018-04-16 支持<01 Feb 2017> 格式
 *            添加 noscript 等特殊标签到黑名单
 *            兼容类似<textarea>$HTML</textarea>这种s13用法
 * 2018-04-14 支持<Feb 01 '17> 和 <2018年> 格式
 * 2018-04-13 修改替换方式，可应对多个正则存在包含关系的情况
 *
 */

(function(){
  'use strict';

  /*
   * 时长阀值与色值
   */
  var day  = 24 * 60 * 60 * 1000;
  var year = 365 * day;
  var colors = [
    {color: "#ff0000", threshold: 5 * year},
    {color: "#ff5f00", threshold: 3 * year},
    {color: "#d700ff", threshold: 1 * year},
    {color: "#8700ff", threshold: 183 * day},
    {color: "#00af00", threshold: 7 * day},
    {color: "#00d700", threshold: 1 * day},
  ];

  var monthPart = (`
    Jan|January|
    Feb|February|
    Mar|March|
    Apr|April|
    May|
    Jun|June|
    Jul|July|
    Aug|Augest|
    Sep|Sept|September|
    Oct|October|
    Nov|November|
    Dec|December
  `).replace(/\n\s*/gm, '');

  /*
   * 判断规则(信息越详细，放在前面)
   */
  var rules = [
    // yyyy-mm-dd
    {key: "01", regExp: /\d{4}-[01]?\d-[0-3]?\d/mg},
    // yyyy/mm/dd
    {key: "01", regExp: /\d{4}\/[01]?\d\/[0-3]?\d/mg},
    // yyyy.mm.dd
    {key: "01", regExp: /\d{4}\.[01]?\d\.[0-3]?\d/mg},
    // month dd, yyyy
    {key: "01", regExp: new RegExp("(?:"+ monthPart +") [0-3]?\\d[,\\s]{1}\\s?\\d{4}", 'igm')},
    // dd month yyyy
    {key: "01", regExp: new RegExp("[0-3]?\\d (?:"+ monthPart +")\\s?\\d{4}", 'igm')},
    // month dd 'yy
    {key: "09", regExp: new RegExp("(?:"+ monthPart +") [0-3]?\\d\\s'\\d{2}", 'igm')},
    // yyyy年mm月dd日
    {key: "01", regExp: /\d{4}\s?年\s?[01]?\d\s?月\s?[0-3]?\d\s?日/mg},
    // yyyy-mm | yyyy/mm | yyyy.mm
    {key: "02", regExp: /\d{4}[-\/\.]{1}[01]{1}\d/mg},
    // yyyy年mm月
    {key: "02", regExp: /\d{4}\s?年\s?[01]?\d\s?月/mg},
    // mm-dd | mm/dd | mm.dd
    {key: "03", regExp: /[01]{1}\d[-\/\.][0-3]{1}\d/mg},
    // mm月dd日
    {key: "03", regExp: /[01]?\d\s?月\s?[0-3]?\d\s?日/mg},
    // N 天前
    {key: "04", regExp: /\d+\s?天前/mg},
    // N days ago
    {key: "04", regExp: /\d+\s?days?\sago/mg},
    // N 月前
    {key: "05", regExp: /\d+\s?月前/mg},
    // N months ago
    {key: "05", regExp: /\d+\s?months?\sago/mg},
    // N 年前
    {key: "07", regExp: /\d+\s?年前/mg},
    // yyyy年
    {key: "10", regExp: /\d{4}\s?年/mg},
    // N years ago
    {key: "07", regExp: /\d+\s?years?\sago/mg},
    // month yyyy
    {key: "08", regExp: new RegExp("(?:"+ monthPart +")['\\s]{1}\\d{4}", 'igm')},
    // month dd
    {key: "06", regExp: new RegExp("(?:"+ monthPart +")['\\s]{1}[0-3]?\\d", 'igm')},
  ];



  // 主函数
  function colorDate(){
    var nodes = getMatchNode();
    nodes.forEach(function(node){
      var newNode = document.createElement("datetext");
      newNode.innerHTML = applyRules(node.nodeValue, rules)
      // replace child node
      node.parentNode.replaceChild(newNode, node);
    });
  }


  /*
   * 根据规则(判断是否是日期)，获取满足的节点
   */
  function getMatchNode(){
    var nodes = [];
    var currentNode;
    var nodeIterator = getTextNodeIterator();
    while (currentNode = nodeIterator.nextNode()) {
      var v = currentNode.nodeValue;
      var rule = rules.some(function(rule){
        return !!v.match(rule.regExp);
      });
      if(rule){
        nodes.push(currentNode);
      }
    }
    return nodes;
  }


  /*
   * 获取文本节点迭代器
   */
  function getTextNodeIterator(){
    return document.createNodeIterator(
      document.body,
      NodeFilter.SHOW_TEXT, function(node) {
        var blackList = ['style', 'script', 'noscript', 'noframes', 'canvas', 'template', 'datetext', 'datespan'];
        var parentNode = node.parentNode;
        if(blackList.indexOf(parentNode.nodeName.toLowerCase()) > -1){
          return NodeFilter.FILTER_REJECT;
        }

        /*
         * 隐藏了的文本，不处理
         * - 有的程序员会使用隐藏文本来存储数据（比如存储 html 或者 链接)
         */
        var style = window.getComputedStyle(parentNode);
        if(style.display === "none"){
          return NodeFilter.FILTER_REJECT;
        }
        if(style.visibility === "hidden"){
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
   );
  }




  /*
   * 根据不同的正则，返回处理函数
   */
  function getHandler(key){
    switch(key){
      case "01" : return handler_01();
      case "02" : return handler_02();
      case "03" : return handler_03();
      case "04" : return handler_04();
      case "05" : return handler_05();
      case "06" : return handler_06();
      case "07" : return handler_07();
      case "08" : return handler_08();
      case "09" : return handler_09();
      case "10" : return handler_10();
      default: return function(match){ return match;};
    }
  }

  function handler_01(){
    return function(match){
      var dateStr = match.replace(/年|月|\./g, '-').replace("日", '');
      return replace(match, dateStr);
    };
  }

  function handler_09(){
    return function(match){
      var parts = match.split("'");
      var year  = parts.pop();
      var curr = new Date().getFullYear();
      var yStr = '' + Math.floor(curr%100 > parseInt(year) ? curr/100 : curr/100 - 1).toString() + year;
      parts.push(yStr);
      return replace(match, parts.join(" "));
    }
  }

  function handler_02(){
    return function(match){
      var dateStr = match.replace(/年|\/|\./g, '-').replace("月", '') + "-01";
      return replace(match, dateStr);
    };
  }

  function handler_03(){
    return function(match){
      var dateStr = (new Date()).getFullYear().toString() + "-" + match.trim().replace(/月|\/|\./g, '-').replace("日", '');
      return replace(match, dateStr);
    };
  }

  function handler_04(){
    return function(match){
      var n = parseInt(match.match(/\d+/)[0]);
      return replace(match, (new Date() - n * day));
    };
  }

  function handler_05(){
    return function(match){
      var n = parseInt(match.match(/\d+/)[0]);
      return replace(match, (new Date() - n * 30 * day));
    };
  }

  function handler_06(){
    return function(match){
      return replace(match, match.replace(/'/, ' ') + " " + (new Date()).getFullYear().toString());
    };
  }


  function handler_07(){
    return function(match){
      var n = parseInt(match.match(/\d+/)[0]);
      return replace(match, (new Date() - n * 365 * day));
    };
  }

  function handler_08(){
    return function(match){
      var v = match.replace(/'/, ' ').split(' ').join(" 01 ");
      return replace(match, v);
    };
  }

  function handler_10(){
    return function(match){
      var year = parseInt(match.match(/\d+/)[0]).toString();
      return replace(match, year + "-01-01");
    }
  }

  /*
   * 处理函数, 根据时长阀值着色
   */
  function replace(match, dateStr){
    try{
      var result = match;
      var diff = Date.now() - new Date(dateStr);
      colors.some(function(item){
        if(diff >= item.threshold){
          result = "<datespan style='color:"+ item.color +";'>" + match +"</datespan>";
          return true;
        }
        return false;
      });
      return result;
    }catch(e){
      return match;
    }
  }

  function applyRules(text, rules){
    var r = matchRules(text, rules);
    return replaceMark(r.markedText, r.values);
  }

  /*
   * 根据rules，进行匹配，标记匹配, 并计算出替换值
   * 用来避免两个正则是包含关系的情况
   */
  function matchRules(text, rules){
    var idxUtil = makeIdxUtil(-1);
    var values = [];
    rules.forEach(function(rule){
      var handler = getHandler(rule.key);
      text = text.replace(rule.regExp, function(match){
        values.push(handler(match));
        var mark = "@[["+ idxUtil.next() +"]]";
        return mark
      });
    });
    return {
      markedText: text,
      values: values
    }
  }

  // 索引工具
  function makeIdxUtil(init){
    return {
      curr: init,
      next: function(){ this.curr++; return this.curr; },
    }
  }


  // 把标记替换为着色后的人日期
  function replaceMark(text, values){
    return text.replace(/@\[\[\d+\]\]/mg, function(mark){
      var idx = parseInt(mark.match(/\d+/)[0]);
      return values[idx]
    });
  }


  /*
   * 创建延迟调用对象
   * 用来防止短时间内被调用多次
   */
  var createDelayCall = function(fn, delay){
    var dc = {};
    dc.action = fn;
    dc.clearTimeout = function(){
      if(dc.timeoutId){
        clearTimeout(dc.timeoutId);
      }
    };
    dc.run = function(){
      dc.clearTimeout();
      dc.timeoutId = setTimeout(function(){
        dc.action();
        dc.clearTimeout();
      }, delay);
    };
    return dc;
  };

  /*
   * 判断变更是否来自脚本
   */
  function isColorDateMotation(mutationRecords){
    return mutationRecords.every(function(record){
      return record.type === "childList" && record.addedNodes.length > 0 && record.addedNodes[0].nodeName.toLowerCase() === "datetext";
    });
  }


  /*
   * 初始化 mutationObserver
   */
  function initMutationObserver(){
    var delayColorDate = createDelayCall(colorDate, 400);
    var observer = new MutationObserver(function(mutationRecords){
      if(isColorDateMotation(mutationRecords)){
        // 本脚本产生的变更，不触发
        // console.log("Ignore motation")
      }else{
        delayColorDate.run();
      }
    });
    observer.observe(document, {
      attributes: false,
      childList: true,
      subtree: true
    });
    //console.log("init mutationObserver");
  }

  // 监听变更，触发着色 (适用于动态网页，如: ajax加载内容后产生变更)
  if(MutationObserver){ initMutationObserver(); }
  // 静态网页加载过程中不会产生变更, 直接调用
  setTimeout(colorDate, 400);
  setTimeout(colorDate, 1000);
  setTimeout(colorDate, 4000);

})();
