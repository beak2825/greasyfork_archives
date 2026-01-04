// ==UserScript==
// @name         洛谷通过题目比较器 for fe
// @version      0.2.5
// @description  适用于新版界面的洛谷通过题目比较器
// @author       叶ID (KMnO4y_Fish, yezhiyi9670)
// @match        *://www.luogu.com.cn/user/*
// @namespace    https://greasyfork.org/zh-CN/users/370663-yezhiyi9670
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/392308/%E6%B4%9B%E8%B0%B7%E9%80%9A%E8%BF%87%E9%A2%98%E7%9B%AE%E6%AF%94%E8%BE%83%E5%99%A8%20for%20fe.user.js
// @updateURL https://update.greasyfork.org/scripts/392308/%E6%B4%9B%E8%B0%B7%E9%80%9A%E8%BF%87%E9%A2%98%E7%9B%AE%E6%AF%94%E8%BE%83%E5%99%A8%20for%20fe.meta.js
// ==/UserScript==

/**
 * 比较器原作者是 Anguei.
 * 近日洛谷上线了基于 _feInjection 的个人空间，导致原来比较器脚本失效。
 * 而原作者较长时间没有更新自己的脚本。这份脚本是重写的，适用于新版界面的比较器。
 * 如果设计侵权将删除。
 * 
 * 目前暂不支持在评测记录页面进行比较，稍后将完成这个功能。
 */

(function () {
  // 数据接口
  var gs = function(name,def='') {
    if(localStorage['lg-ac-comparator-s-'+name]) return localStorage['lg-ac-comparator-s-'+name];
    return def;
  }
  var ss = function(name,val) {
    localStorage['lg-ac-comparator-s-'+name] = val;
  }
  var init_settings = function() {
    var lst = [
      ['self','-1'],
      ['Eaccurate','N'],
      ['Ecolorize','N'],
      ['Vcolorize_limit','1500'],
      ['Egrading','N'],
      ['Ecount','N'],
    ];
    for(var i = 0; i < lst.length; i++) {
      ss(lst[i][0],gs(lst[i][0],lst[i][1]));
    }
  }
  var ps = function(name,str) {
    var txt = prompt(str + "\n" + '当前设置：'+gs(name),gs(name));
    if(!txt) return;
    ss(name,txt);
  }
  init_settings();
  var prompt_settings = function() {
    ps('self','你的uid？[整数]');
    ps('Eaccurate','是否显示精确通过题数？[Y/N]');
    ps('Ecolorize','是否对通过题目列表启用样式？[Y/N]');
    ps('Vcolorize_limit','通过大于多少题，则不对通过题目列表染色？[正整数]');
    ps('Egrading','是否显示通过数的颜色？[Y/N]');
    ps('Ecount','是否显示对方通过而您未通过的数量？[Y/N]');
  }
  var isYes = function(name) {
    return gs(name) == 'Y' || gs(name) == 'y' || gs(name) == 'yes';
  }
  
  // 根据用户 AC 数量确定其颜色
  // * 这是 洛谷通过题目比较器 - yyfcpp 中一段代码的复印件。
  var getGradingColor = function(AcCnt) {
    if (AcCnt >= 1275) return "#FF0000";
    else if (AcCnt >= 867) return "rgb(255," + ((1275 - AcCnt) / 2) + ",0)";
    else if (AcCnt >= 765) return "rgb(" + ((AcCnt - 357) / 2) + "," + ((1275 - AcCnt) / 2) + ",0)";
    else if (AcCnt >= 459) return "rgb(" + ((AcCnt - 357) / 2) + ",255,0)";
    else if (AcCnt >= 357) return "rgb(51," + ((AcCnt + 51) / 2) + "," + (459 - AcCnt) + ")";
    else if (AcCnt >= 204) return "rgb(51," + (AcCnt - 153) + "," + (459 - AcCnt) + ")";
    else return "rgb(51,51," + (51 + AcCnt) + ")";
  }
  // 难度 - 颜色对应表
  var getDifficultyColor = function(difficulty) {
    if(difficulty == 0) return 'rgb(191, 191, 191)';
    if(difficulty == 1) return 'rgb(254, 76, 97)';
    if(difficulty == 2) return 'rgb(243, 156, 17)';
    if(difficulty == 3) return 'rgb(255, 193, 22)';
    if(difficulty == 4) return 'rgb(82, 196, 26)';
    if(difficulty == 5) return 'rgb(52, 152, 219)';
    if(difficulty == 6) return 'rgb(157, 61, 207)';
    if(difficulty == 7) return 'rgb(14, 29, 105)';
  }
  
  // 查找并标记 “已通过的题目” 框（暴力算法）
  // * 你谷 _feInjection 真毒瘤
  var markAcceptedForm = function() {
    var arr = $('.lfe-h3');
    for(var i=0;i<arr.length;i++) {
      if($(arr[i]).html() == '已通过的题目') {
        $(arr[i]).parent().addClass('accepted-problem-form');
      }
    }
  };
  
  
  // 获取数据
  var ffflag = false;
  var currData = null;
  var myData = null;
  var myAcMap = {};
  var myAttemptedMap = {};
  var currAcMap = {};
  var noAc=0;
  var noAttempt=0;
  $.get('?_contentOnly=1',function(e){
    currData = e;
    $.get('/user/'+gs('self')+'?_contentOnly=1',function(e) {
      myData = e;
      console.log('用户的数据',currData);
      console.log('你的数据',myData);
      // ffflag = true;
      if(myData['currentData']['passedProblems']) for(var i=0;i<myData['currentData']['passedProblems'].length;i++) {
        myAcMap[myData['currentData']['passedProblems'][i]['pid']] = myData['currentData']['passedProblems'][i];
      }
      if(currData['currentData']['passedProblems']) for(var i=0;i<currData['currentData']['passedProblems'].length;i++) {
        currAcMap[currData['currentData']['passedProblems'][i]['pid']] = currData['currentData']['passedProblems'][i];
      }
      if(myData['currentData']['submittedProblems']) for(var i=0;i<myData['currentData']['submittedProblems'].length;i++) {
        myAttemptedMap[myData['currentData']['submittedProblems'][i]['pid']] = myData['currentData']['submittedProblems'][i];
      }
      if(currData['currentData']['passedProblems']) for(var i=0;i<currData['currentData']['passedProblems'].length;i++) {
        var pid = currData['currentData']['passedProblems'][i]['pid'];
        if(myAcMap[pid]) {}
        else if(myAttemptedMap[pid]) {noAc++;}
        else {noAttempt++;noAc++;}
      }
      console.log('你的通过题目表',myAcMap);
      console.log('对方通过题目表',currAcMap);
      console.log('你的尝试题目表',myAttemptedMap);
      
      hookInitialized();
    })
  });
  
  
  // 顶栏上的精确数字显示
  var hook_globalmod = function(){setTimeout(function(){
    var $submitbox = $('.stats.normal :nth-child(3) :nth-child(2)');
    var $acbox =     $('.stats.normal :nth-child(4) :nth-child(2)');
    var $rankbox =   $('.stats.normal :nth-child(5) :nth-child(2)');
    
    $submitbox .html(currData['currentData']['user']['submittedProblemCount']);
    $acbox     .html(currData['currentData']['user']['passedProblemCount']);
    if(currData['currentData']['user']['ranking'])
      $rankbox .html(currData['currentData']['user']['ranking']);
    
    if(isYes('Egrading')) {
      $acbox.css('font-weight','400');
      $acbox.css('color',getGradingColor(currData['currentData']['user']['passedProblemCount']));
      $submitbox.css('font-weight','400');
      $submitbox.css('color',getGradingColor(currData['currentData']['user']['submittedProblemCount'] / 3));
      if($rankbox.html() != '-') {
        $rankbox.css('font-weight','400');
        $rankbox.css('color',getGradingColor(150000 / currData['currentData']['user']['ranking']));
      }
    }
  },801)};
  
  // 侧边组件
  $('document').ready(function(){setTimeout(function(){
    setInterval(function() {
      var $sidebar = $('section.side');
      var $firstele = $($sidebar.children()[0]);
      var $setting = $('.btn.btn-config.lfe-form-sz-middle');
      var isMyAccount = ($setting.length != 0);
      
      if($('.add-compare-viewbox').length && !(!ffflag && myData)) return;
      
      if(!ffflag && myData) {
        console.log('初始化完成。');
        $('.add-compare-viewbox').remove();
        ffflag = true;
      }
      
      $show_ele = $(`
        <div data-v-796309f8 class="card padding-default add-compare-viewbox">
          <h3 class="lfe-h3"><svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="dice-d6" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-dice-d6 fa-w-14" style="color: rgb(52, 152, 219);"><g data-v-d4260d54="" data-v-796309f8="" class="fa-group"><path data-v-d4260d54="" data-v-796309f8="" fill="currentColor" d="M25.87 124.42a8.54 8.54 0 0 1-.06-14.42l166-100.88a61.72 61.72 0 0 1 64.43 0L422.19 110a8.54 8.54 0 0 1-.05 14.47L224 242.55z" class="fa-secondary"></path><path data-v-d4260d54="" data-v-796309f8="" fill="currentColor" d="M0 161.83v197.7c0 23.77 12.11 45.74 31.79 57.7L184 509.71c10.67 6.48 24.05-1.54 24.05-14.44V271.46L12 154.58c-5.36-3.17-12 .85-12 7.25zm436-7.25L240 271.46v223.82c0 12.89 13.39 20.92 24.05 14.43l152.16-92.48c19.68-12 31.79-33.94 31.79-57.7v-197.7c0-6.41-6.64-10.42-12-7.25z" class="fa-primary"></path></g></svg>
            &nbsp;
            通过题目比较器
          </h3>
          <p style="margin-bottom:-6px;" class="add-compare-infolist">
            <span>该用户通过题目</span>
            <span data-v-19260819 class="info-content add-compare-uac">-</span>
          </p>
          <p style="margin-bottom:-6px;" class="add-compare-infolist">
            <span>您的通过题目</span>
            <span data-v-19260819 class="info-content add-compare-iac">-</span>
          </p>
          <p style="margin-bottom:-6px;" class="add-compare-infolist">
            <span>您尚未通过，对方通过</span>
            <span data-v-19260819 class="info-content add-compare-nometoo">-</span>
          </p>
          <p style="margin-bottom:-6px;" class="add-compare-infolist">
            <span>您尚未尝试，对方通过</span>
            <span data-v-19260819 class="info-content add-compare-noatt">-</span>
          </p>
          <button data-v-dc8d06e8="" data-v-4929b25c="" data-v-796309f8="" solid="" class="btn" id="add-compare-setting" style="border-color: rgb(255, 255, 255); color: rgb(255, 255, 255); background-color: rgb(52, 152, 219);margin-top:16px;padding:4px 10px;">修改设置</button>
        </div>
        <style>
          .info-content[data-v-19260819] {
            color: rgba(0, 0, 0, 0.45);
            float: right;
          }
        </style>
      `);
      $show_ele.insertAfter($firstele);
      
      $('#add-compare-setting').click(prompt_settings);
      
      $('.add-compare-infolist').css('display','none');
      if(!ffflag) return;
      
      if(isYes('Ecount')) {
        $('.add-compare-uac').html('' + currData['currentData']['user']['passedProblemCount']);
        $('.add-compare-iac').html('' + myData  ['currentData']['user']['passedProblemCount']);
        $('.add-compare-nometoo').html('' + noAc);
        $('.add-compare-noatt').html('' + noAttempt);
        $('.add-compare-infolist').css('display','block');
      }
      else {
        $('.add-compare-infolist').css('display','none');
      }
    },200);     
  },801)});
  
  // 列表与难度
  $('document').ready(function(){setTimeout(function(){
    setInterval(function() {
      if(!myData) return;
      
      var $acform = $('.accepted-problem-form');
      if(!$acform.length) markAcceptedForm();
      $acform = $('.accepted-problem-form');
      if(!$acform.length) return;
      
      if(!isYes('Ecolorize') || (gs('Vcolorize_limit') != 0 && gs('Vcolorize_limit') < currData['currentData']['passedProblems'].length)) return;
      var arr = $('.accepted-problem-form .problem-id');
      if(!arr.length) return;
      if($acform.hasClass('accepted-marked') && arr.length > 0 && !$($(arr[0]).children()[0]).hasClass('color-default')) return;
      
      $acform.addClass('accepted-marked');
      console.log('正在执行AC列表样式化',$acform);
      
      function markArray(arr) {
        for(var i=0;i<arr.length;i++) {
          var ele = $(arr[i]);
          var pid = ele.children()[0].innerHTML;
          var int = $(ele.children()[0]);
          int.removeClass('color-default');
          // int.css('font-weight','400');
          ele.css('font-weight','400');
          if(myAcMap[pid]) {
            ele.css('background-color','#88FF8833');
          }
          else if(myAttemptedMap[pid]) {
            ele.css('background-color','#FFFF3377');
          }
          else {
            ele.css('background-color','#FFBBBB77');
          }
          int.css('color',getDifficultyColor(currAcMap[pid]['difficulty']));
          int.attr('title',currAcMap[pid]['title']);
          if(int.html().length >= 3 && int.html().substr(0,3) == 'UVA') {
            int.html('UVa'+int.html().substr(3));
          }
        }
      }
      
      markArray(arr);
    },200);     
  },801)});
  
  // 起始函数
  function hookInitialized() {
    hook_globalmod();
  }
})();
