// ==UserScript==
// @name         New CZZ填写交易确认书
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       zhurujin
// @include      https://rpt.interotc.com.cn/ReportSys/otcderivatives/addRiskWarn?type=3*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379399/New%20CZZ%E5%A1%AB%E5%86%99%E4%BA%A4%E6%98%93%E7%A1%AE%E8%AE%A4%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/379399/New%20CZZ%E5%A1%AB%E5%86%99%E4%BA%A4%E6%98%93%E7%A1%AE%E8%AE%A4%E4%B9%A6.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Your code here...
  //获取交易确认书编号，如已存在，则不执行后续代码
  var contractNo =  $('#opNumberAppment').val();
  if(contractNo){//已经填写过了，页面不进行重新填写
      return ;
  }

  var mainUrl = 'https://10.2.86.31';
  var cName = GetQueryString('cName');
  var pName = GetQueryString('pName');
  var protocal = GetQueryString('protocals');
  var ID;
  $.ajax({
      url: mainUrl + '/api/option_parameter/option_parameter_query?protocal=' + protocal,
      type:'GET',
      dataType:'jsonp',
      success:function(data){
          handleData(data[0]);
          addUnderlying(data[0].UNDERLYING);
          ID = data[0].ID;
          console.log(ID);
          console.log(data);
      }
  });
  //进一步完善标的填写
  function addUnderlying(underlying){
    $('#form_tab1 > div > div.panel.datagrid.easyui-fluid > div > div.datagrid-toolbar > table > tbody > tr > td:nth-child(1) > a').click();
      $.ajax({
          url: mainUrl + '/api/wind/otc_underlying_type_query_new?underlying=' + underlying,
          type:'GET',
          dataType:'jsonp',
          success:function(data){
              if(data.length < 1){//没有数据返回
                  return;
              }
              let temp = data[0]
              console.log(data[0].SECU_NAME)
              $('#datagrid-row-r2-2-0 > td:nth-child(3) > div > table > tbody > tr > td > input').val(data[0].SECU_NAME);//标的名称
              $('#datagrid-row-r2-2-0 > td:nth-child(3) > div > table > tbody > tr > td > input').blur();
              $('#datagrid-row-r2-2-0 > td:nth-child(4) > div > table > tbody > tr > td > input').combobox('setValue',secu_exchange[data[0].SECU_EXCHANGE]);//标的场所
              $('#datagrid-row-r2-2-0 > td:nth-child(5) > div > table > tbody > tr > td > input').val(data[0].SECU_CODE);//标的代码
              $('#datagrid-row-r2-2-0 > td:nth-child(5) > div > table > tbody > tr > td > input').blur();
              $('#datagrid-row-r2-2-0 > td:nth-child(2) > div > table > tbody > tr > td > input').combobox('setValue',calcUnderlyingType(data[0].INTEROTC_UNDERLYING_CATEGORY));//标的小类
              $('#form_tab1 > table > tbody > tr:nth-child(1) > td:nth-child(2) > select').combobox('setValue',calcTargetType(data[0].INTEROTC_UNDERLYING_TYPE));//标的类型
          }
      });
  }
  //
  var secu_exchange = {
        '上海证券交易所':"01",
        '深圳证券交易所':"02",
        '新三板':"03",
        '上海期货交易所':"04",
        '大连商品交易所':"05",
        '郑州商品期货交易所':"06",
        '中国金融期货交易所':"07",
        '外汇交易中心':"08",
        '境外交易所':"11",
        '其他（注明具体场所）':"99",
    };
  //标的小类
  function calcUnderlyingType(type){
      var ret = '99'
      switch(type){
              case 'Stock': ret = '0';break;//股票
              case 'Stock Index': ret = '1';break;//股指
              case 'Neeq Stock List': ret = '2';break;//新三板挂牌股票
              case 'HK Stock': ret = '3';break;//香港股票
              case 'HK Stock Index': ret = '4';break;//香港股指
              case 'Special Fund': ret = '5';break;//基金及基金专户
              case 'Bonds': ret = '6';break;//债券
              case 'Gold Futures': ret = '7';break;//黄金期货
              case 'Treasury Futures': ret = '8';break;//国债期货
              case 'Share Price Index Futures': ret = '9';break;//股指期货
              case 'Other Futures': ret = '10';break;//其他期货
              case 'Gold Spot': ret = '11';break;//黄金现货
              case 'Other Overseas ': ret = '12';break;//其他现货
              case 'Overseas Futures': ret = '13';break;//境外期货
              case 'Overseas Overseas ': ret = '14';break;//境外现货
              case 'Overseas Stock': ret = '15';break;//境外股票
              case 'Overseas  Stock Index': ret = '16';break;//境外股指
              case 'Exchange Rate': ret = '17';break;//汇率
              case 'Shibor': ret = '18';break;//Shibor
              case 'Fixing Repo Rate': ret = '19';break;//银行间回购定盘（Fixing Repo Rate）
              case 'Other Interest Rate': ret = '20';break;//其他利率
              case 'Other Underlying': ret = '99';break;//其他标的
      }
      return ret;
  }
  //判断标的类型
  function calcTargetType(type){
      var ret = '99';
      switch(type){
              case 'Equity interest': ret = '0';break;//权益类
              case 'Bulk Commodity': ret = '1';break;//大宗商品
              case 'Interest Rate': ret = '2';break;//利率
              case 'Credit': ret = '3';break;//信用类
              case 'Exchange Rate': ret = '4';break;//汇率
              case 'Other Type': ret = '99';break;//其他
      }
      return ret;
  }
  //填写数据
  function handleData(data){
      var identityVal,role,sellRole, clearRole;
      if(data.COMPANY_IDENTITY){
          identityVal = data.COMPANY_IDENTITY.trim();
          role = identityVal==='Party A'? '0':'1';
      }
      if(data.SELLER){
          if(data.SELLER==='广发证券' || data.SELLER==='GFS'){
              clearRole = role;
          }else{
              clearRole = identityVal === 'Party A'? '1': '0';
          }
          sellRole = clearRole;
      }
      handleType(data.TYPE, data.REBATE);
      //交易确认书类型
      $('#opType').combobox('setValue', "0");
      //交易确认书编号（双方约定）
      $('#opNumberAppment').textbox('setValue', data.CONTRACT_NO);
      //填报方角色
      $('select[comboname="partRole"]').combobox('setValue',role);
      //期权卖方
      let opSeller = sellRole == '0'? '01': "02";
      $('select[comboname="optionSeller"]').combobox('setValue',opSeller);
      //行权方式
      $('select[comboname="rightWay"]').combobox('setValue','0');
      //起始日
      $('#opStartDay').datebox('setValue',data.SALE_DATE.replace(/\//g,'-'));
      //到期日
      $('#dueDate').datebox('setValue', data.INITIAL_OBSERVATION_DATE.replace(/\//g,'-'));
      //期权费
      let optionPriceRaio = (data.FILED_EARNING_PRICE/data.NAME_OF_PRINCIPAL * 100).toFixed(2);
      $('input[textboxname="opOptionFee"]').textbox('setValue', Math.abs(optionPriceRaio));
      //名义本金额（人民币）
      $('input[numberboxname="opNominalAmount"]').textbox('setValue',data.NAME_OF_PRINCIPAL.toFixed(2));
      //有效名义本金 （人民币）
      $('input[numberboxname="opNominalAmount1"]').textbox('setValue',data.ABSOLUTE_NOTIONAL_PRINCIPAL.toFixed(2));
      //结算货币
      $('select[comboname="settlementCurrency"]').combobox('setValue','0');
      //清算机构
      $('select[comboname="liquidationAgency"]').combobox('setValue',sellRole);
      //交易场所
      $('select[comboname="opTradingPlace"]').combobox('setValue','0');
      //业务模式类型
      $('select[comboname="businessPatternType"]').combobox('setValue','1');
      //标的个数
      $('select[comboname="numberOfScales"]').combobox('setValue','0');
      //履约保障类型
      $('#guaranteeType').combobox('setValue','0');
      //行权价格1 %
      $('input[numberboxname="xqjgOne"]').textbox('setValue',(data.EXACUTIVE_RATE * 100).toFixed(2));

      let flag = confirm("请进行认真核查数据正确性，同意？");
      if(! flag){
          document.write("Bye bye~~");
      }
  }
  //期权类型方向判断
  function handleType(type, rebate){
      var direction,struct,calcComment;
      //var defaultComment = 'Max[0,（期末价格-执行价格）/期初价格]';
      var defaultComment = "请参考交易确认书。";
      //二值看涨
      var comment1 = '若期末价格大于或等于执行价格，则获得期权收益1%；\n否则，获得期权收益0%';
      //二值看跌
      var comment2 = '若期末价格小于或等于执行价格，则获得期权收益1%；\n否则，获得期权收益0%';
      var qcbc = '0'
      if(rebate){
          qcbc = (rebate * 100).toFixed(2);
      }
       //单障碍看跌
      var comment3 = `一级收益率=${qcbc}%；\n二级收益率= MAX((执行价格-期末价格)÷期初价格,0)；若计算结果为负数，则二级收益率视为0%；\n如果标的收盘价在观察期内从未低于障碍价格，则期权收益率等于二级收益率；\n如果标的收盘价在观察期内曾经低于障碍价格，则期权收益率等于一级收益率；`;
       //单障碍看涨
      var comment4 = `一级收益率=${qcbc}%；\n二级收益率= MAX((期末价格-执行价格)÷期初价格,0)；若计算结果为负数，则二级收益率视为0%；\n如果标的收盘价在观察期内从未高于障碍价格，则期权收益率等于二级收益率；\n如果标的收盘价在观察期内曾经高于障碍价格，则期权收益率等于一级收益率；`;
      //双障碍敲出
      var comment5 = `一级收益率=${qcbc}%；\n二级收益率= MAX((期末价格-执行价格1)÷期初价格,0) + MAX((执行价格2-期末价格)÷期初价格,0)；\n如果标的收盘价在观察期内从未高于障碍价格1并且从未低于障碍价格2，则期权收益率等于二级收益率；\n如果标的收盘价在观察期内曾经高于障碍价格1或曾经低于障碍价格2，则期权收益率等于一级收益率；`;

      calcComment = defaultComment;
      switch(type){
          //1
          case 'BCALL':struct = '1';direction = '0';calcComment = defaultComment;break;  //二值看涨
          //2
          case 'BPUT':struct = '1';direction = '1';calcComment = defaultComment;break;  //二值看跌
          //3
          case 'VCALL':struct = '0';direction = '0';break;  //欧式看涨
          //4
          case 'VPUT':struct = '0';direction = '1';break;  //欧式看跌
          //5
          case 'CALL SPREAD':struct = '2';direction = '0';break;  //牛市价差
          //6
          case 'PUT SPREAD':struct = '2';direction = '1';break;  //熊市价差
          //7
          case 'UOC':struct = '5';direction = '0';calcComment = defaultComment;break;  //单障碍看涨
          //8
          case 'DOP':struct = '5';direction = '1';calcComment = defaultComment;break;  //单障碍看跌
          //9
          case 'DKO':struct = '5';direction = '2';calcComment = defaultComment;break;  //双鲨
         // case 'DKO':struct = 5;direction = 1;break;  //双鲨
          //10
          case 'BUTTERFLY':struct = '99';direction = '2';break;  //蝶式
          //11
          case 'STRADDLE':struct = '99';direction = '2';break;  //跨式
          //12
          case 'ACCRUAL':struct = '6';direction = '2';break;  //区间累计
          //13
          case 'MULTI LAYER DIGITAL':struct = '99';direction = '0';break;  //阶梯看涨
         // case 'DELTA ONE':struct = '1';direction = '0';break;  //线性
          //14
          case 'AUTOREDEMP':struct = '7';direction = '0';break;  //自动赎回
          //15
          case 'BCall_Daily':struct = '5';direction = '0';break;  //向上触碰（每日观察）
          //16
          case 'BPut_Daily':struct = '5';direction = '1';break;  //向下触碰（每日观察）
          //17
          case 'BCall_Continuous':struct = '5';direction = '0';break;  //向上触碰（连续观察）
          //18
          case 'BPut_Continuous':struct = '5';direction = '1';break;  //向下触碰（连续观察）
          //19
          case 'IN_RANGE':struct = '1';direction = '2';break;  //窄幅
          //20
          case 'OUT_OF_RANGE':struct = '1';direction = '2';break;  //宽幅
      }

      //期权方向
      $('select[comboname="opDirection"]').combobox('setValue',direction);
      //期权结构
      $('#ops1').combobox('setValue',struct);
      //期权收益计算说明
      $("input[textboxname='optionIncome']").textbox('setValue', calcComment);
  }
  function GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r !== null) return unescape(r[2]); return null;
  }
  //点击提交按钮
  $('a.easyui-linkbutton.bondBtn.l-btn.l-btn-small.l-btn-plain[onclick="submitForm();"]').on('click',function(event){
  //$("#saveButton").on('click',function(event){
      console.log("点击提交按钮");
      //补充协议编号
      var tbcxyh = $("#form_tab0 > table > tbody > tr:nth-child(13) > td:nth-child(4) > input").val();
      //OTC合同编号
      var tconNo = $("#opNumberAppment").val();
      var now = new Date();
      var tstamp = Number(now);
      var fileVal = "";
      var tmp = $('#transConfirmFile').val();
      if(tmp != ""){
          let strArr = tmp.split('|');
          if(strArr.length < 3){
              alert("上传的附件内容为空，清确认。");
              return;
          }
          fileVal =`${strArr[0]}|${strArr[2]}`
      }
      console.log(`文件参数为：${fileVal}`);
      //设置本地存储
      localStorage.setItem("tbcxyh", tbcxyh);
      localStorage.setItem("tconNo", tconNo);
      localStorage.setItem("tID", ID);
      localStorage.setItem("tstamp", tstamp);
      localStorage.setItem("fileVal", fileVal);
      $('#tabs').tabs('close', "新增交易确认书");
  });
})();