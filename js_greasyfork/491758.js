// ==UserScript==
// @name         一键排版bug修复并优化
// @namespace    http://tampermonkey.net/
// @version      2024-03-27
// @description  兼容最新浏览器，修改代码可以正常使用;增加违禁词删除
// @author       张鸿运
// @license MIT
// @match        http://www.yan-wei.net/*
// @icon         https://zhanghongyun.cn/static/image/favicon.ico
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/figlet@1.7.0/build/figlet.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491758/%E4%B8%80%E9%94%AE%E6%8E%92%E7%89%88bug%E4%BF%AE%E5%A4%8D%E5%B9%B6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491758/%E4%B8%80%E9%94%AE%E6%8E%92%E7%89%88bug%E4%BF%AE%E5%A4%8D%E5%B9%B6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';
  /*
    添加 animate.css 动画
  */
  const linkEl = $('<link>').attr({
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.min.css'
  });
  $('head').append(linkEl);
  figlet.defaults({ fontPath: "https://cdn.jsdelivr.net/npm/figlet@1.7.0/fonts" });

  figlet.preloadFonts(["Doh"], ready);
  
  function ready() {
    console.log(figlet.textSync("v1.0.0", "Doh"));
  }
  /*
      message 元素
  */
  const successElStr = `<div id="message-success" class="el-message el-message--success is-plain" role="alert" style="width: 25%;top: 40px;display: flex;background: #fff;position: relative;margin: auto;z-index: 99999;box-shadow: 0 0 12px rgba(0,0,0,0.12);padding: 10px 20px;border-radius: 4px;color: #67C23A;font-size: 16px;font-weight: 600;align-items: center;"><i class="el-icon el-message__icon el-message-icon--success" style="
    width: 16px;
    height: 16px;
    margin-right: 5px;
"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"></path></svg></i><p class="el-message__content">Congrats, text copied successfully.</p></div>`

  const errorElStr = `<div id="message-success" class="el-message el-message--success is-plain" role="alert" style="width: 25%;top: 40px;display: flex;background: #fff;position: relative;margin: auto;z-index: 99999;box-shadow: 0 0 12px rgba(0,0,0,0.12);padding: 10px 20px;border-radius: 4px;color: #F56C6C;font-size: 16px;font-weight: 600;align-items: center;"><i class="el-icon el-message__icon el-message-icon--success" style="
    width: 16px;
    height: 16px;
    margin-right: 5px;
"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"></path></svg></i><p class="el-message__content">Oops, text copy failed.</p></div>`
  const content = $('#Content');
  const forbiddenWords = [
    "先进", "咨询", "保障", "保证",
    "国家级", "世界级", "最高级", "最佳", "最大", "唯一", "首个", "首选", "最好", "精确", "顶级", "最高", "最低", "最具",
    "最便宜", "最新", "最先进", "最新技术", "最先进科学", "国际级产品", "填补国内空白", "绝对", "独家", "首家", "第一品牌", "金牌", "名牌",
    "优秀", "最先", "全网销量第一", "全球首发", "全网首发", "世界领先", "顶级工艺", "最新科学", "最先进加工工艺", "最时尚", "极品", "顶尖",
    "终极", "最受欢迎", "王牌", "销量冠军", "第一", "No.1", "Top1", "极致", "永久", "掌门人", "领袖品牌", "独一无二", "绝无仅有", "前无古人",
    "史无前例", "万能", "最赚", "最优", "最优秀", "最好", "最大", "最大程度", "最高", "最高级", "最高档", "最奢侈", "最低", "最低级", "最低价",
    "最底", "最便宜", "时尚最低价", "最流行", "最受欢迎", "最时尚", "最聚拢", "最符合", "最舒适", "最先", "最先进", "最先进科学", "最先进加工工艺",
    "最先享受", "最后", "最后一波", "最新", "最新科技", "最新科学", "第一", "中国第一", "全网第一", "销量第一", "排名第一", "唯一", "第一品牌",
    "NO.1", "TOP.1", "独一无二", "全国第一", "一流", "一天", "仅此一次", "最后一波", "全国X大品牌之一", "国家级", "国家级产品", "全球级", "宇宙级",
    "世界级", "顶级", "顶尖", "尖端", "顶级工艺", "顶级享受", "高级", "极品", "极佳", "绝对", "绝佳", "终极", "极致", "首个", "首选", "独家",
    "独家配方", "首发", "全网首发", "全国首发", "XX网独家", "首次", "首款", "全国销量冠军", "国家级产品", "国家", "国家免检", "国家领导人", "填补国内空白",
    "中国驰名", "驰名商标", "国际品质", "大牌", "金牌", "名牌", "王牌", "领袖品牌", "世界领先", "遥遥领先", "领先", "领导者", "缔造者", "创领品牌", "领先上市",
    "巨星", "著名", "掌门人", "至尊", "巅峰", "奢侈", "优秀", "资深", "领袖", "之王", "王者", "冠军", "史无前例", "前无古人", "永久", "万能", "祖传", "特效",
    "无敌", "纯天然", "100%", "高档", "正品", "真皮", "超赚", "精准", "老字号", "中国驰名商标", "特供", "专供", "专家推荐", "质量免检", "无需国家质量检测",
    "免抽检", "国家XX领导人推荐", "国家XX机关推荐", "点击领奖", "恭喜获奖", "全民免单", "点击有惊喜", "点击获取", "点击转身", "点击试穿", "点击翻转", "领取奖品",
    "秒杀", "抢爆", "再不抢就没了", "不会更便宜了", "没有他就XX", "错过就没机会了", "万人疯抢", "全民疯抢", "抢购", "卖疯了", "抢疯了", "最"
  ];
  const hiddenElList = ['.top', '.banner', '.foot']
  const regexPattern = new RegExp(forbiddenWords.join('|'), 'gi');

  const consoleSuccessStyle = "background: green; color: white; padding: 5px 10px; border-radius: 5px; font-size: 16px;"
  console.log("%cscript start run", consoleSuccessStyle)

  function hiddenEl() {
    $('body').css('background', 'none')
    hiddenElList.forEach(str => $(str).css('display', 'none'))
  }
  hiddenEl();

  /*
    替换违禁词
  */
  function replaceForbiddenWords(str) {
    // 这里可以将违禁词替换为星号或者其他符号
    return str.replace(regexPattern, (matched) => new Array(matched.length + 1).join(''));
  }

  /*
      string 类型转为 dom 元素
  */
  function parseToDom(str) {
    /* const tpl = document.createElement('template');
        tpl.innerHTML = str;
        return tpl.content; */
    return $(str)
  }

  /*
      向 body 中添加 message 提示框
  */
  function bodyAddMessage(str, flag) {
    const el = parseToDom(str);
    $('body').append(el)
    el.addClass('animate__animated animate__bounceInDown')
    setTimeout(() => {
      el.removeClass('animate__bounceInDown')
      el.addClass(flag ? 'animate__fadeOutUp' : 'animate__hinge')
      setTimeout(() => {
        el.remove()
      }, 1000 * 1.2)
      // el.addClass('animate__hinge')
    }, 1000 * 3)
  }

  /*
      复制文字函数
  */
  function copy_clip() {
    content.select();
    const flag = document.execCommand('copy');
    if (flag) {
      console.log("success");
      bodyAddMessage(successElStr, flag)
    } else {
      console.error("copy error")
      bodyAddMessage(errorElStr, flag)
    }
  }

  /*
      粘贴文字函数
  */
  function paste() {
    // 将焦点设置到输入框
    content.focus();
    // 尝试执行粘贴命令
    navigator.clipboard.readText().then(res => {
      console.log('cccc', res);
      content.val(replaceForbiddenWords(res));
      // 一键排版按钮
      document.getElementById("Button1").click();
    })
  }
  window.copy_clip = copy_clip;
  window.paste = paste;
  if (content.val().length > 0) {
    setTimeout(() => {
      copy_clip();
      // document.getElementById("Button2").click();
    }, 1000)
  }
  // Your code here...
})();