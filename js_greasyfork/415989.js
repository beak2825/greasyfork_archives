// ==UserScript==
// @name         bitoffer 自动提前平仓  期权盈利达到预期后自动平仓脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bitoffer.com/option/index
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415989/bitoffer%20%E8%87%AA%E5%8A%A8%E6%8F%90%E5%89%8D%E5%B9%B3%E4%BB%93%20%20%E6%9C%9F%E6%9D%83%E7%9B%88%E5%88%A9%E8%BE%BE%E5%88%B0%E9%A2%84%E6%9C%9F%E5%90%8E%E8%87%AA%E5%8A%A8%E5%B9%B3%E4%BB%93%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/415989/bitoffer%20%E8%87%AA%E5%8A%A8%E6%8F%90%E5%89%8D%E5%B9%B3%E4%BB%93%20%20%E6%9C%9F%E6%9D%83%E7%9B%88%E5%88%A9%E8%BE%BE%E5%88%B0%E9%A2%84%E6%9C%9F%E5%90%8E%E8%87%AA%E5%8A%A8%E5%B9%B3%E4%BB%93%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function downFixed (num, fix) {
  // num为原数字，fix是保留的小数位数
  let result = '0'
  if (Number(num) && fix > 0) { // 简单的做个判断
    fix = +fix || 2
    num = num + ''
    if (/e/.test(num)) { // 如果是包含e字符的数字直接返回
      result = num
    } else if (!/\./.test(num)) { // 如果没有小数点
      result = num + `.${Array(fix + 1).join('0')}`
    } else { // 如果有小数点
      num = num + `${Array(fix + 1).join('0')}`
      let reg = new RegExp(`-?\\d*.\\d{0,${fix}}`)
      result = reg.exec(num)[0]
    }
  }
  return result
}
    function upFixed (num, fix) {
  // num为原数字，fix是保留的小数位数
  let result = '0'
  if (Number(num) && fix > 0) { // 简单的做个判断
    fix = +fix || 2
    num = num + ''
    if (/e/.test(num)) { // 如果是包含e字符的数字直接返回
      result = num
    } else if (!/\./.test(num)) { // 如果没有小数点
      result = num + `.${Array(fix + 1).join('0')}`
    } else { // 如果有小数点
      num = num + `${Array(fix + 1).join('0')}`
      let reg = new RegExp(`-?\\d*\\.\\d{0,${fix}}`)
      let floorStr = reg.exec(num)[0]
      if (+floorStr >= +num) {
        result = floorStr
      } else {
        let floorNumber = +floorStr + +`0.${Array(fix).join('0')}1`
        let point = /\./.test(floorNumber + '') ? '' : '.'
        let floorStr2 = floorNumber + point + `${Array(fix + 1).join('0')}`
        result = reg.exec(floorStr2)[0]
      }
    }
  }
  return result
}

       setTimeout (function () {

                     $('table').eq(1).css('width', '');
                      $('table').eq(0).css('width', '');
                      $('table').eq(0).css('width', '');

   //  console.log($('div.mod-available').html());
    $('div.mod-available').append("<div data-v-168064cc=\"\" class=\"mod mod-form\"><div data-v-168064cc=\"\" class=\"mod-hd\"><h6 data-v-168064cc=\"\" class=\"tit\"><span data-v-168064cc=\"\">预估涨幅百分比，数字1代表百分之一</span>  </h6></div><div data-v-168064cc=\"\" class=\"form-inp\"><div data-v-168064cc=\"\" class=\"el-input el-input--small\"><!----><input type=\"text\" id=\"percent\" autocomplete=\"off\" class=\"el-input__inner\"><!----><!----><!----><!----></div></div></div> ");
var cangtable=$('table:first');
          // cangtable.find("col").width("auto");

        cangtable.find("colgroup").append("<col name=\"el-table_1_column_11\" width=\"100\"><col name=\"el-table_1_column_11\" width=\"100\">");

             cangtable.find("thead>tr").append("<th colspan=\"1\" rowspan=\"1\" class=\"el-table_1_column_12  is-right   is-leaf\"  width=\"100\"><div class=\"cell\">涨幅百分比</div></th>");
            cangtable.find("thead>tr").append("<th colspan=\"1\" rowspan=\"1\" class=\"el-table_1_column_12  is-right   is-leaf\"  width=\"100\" ><div class=\"cell\">止盈价</div></th>")

           //以后会删除
      //  cangtable.append("<tbody><tr class=\"el-table__row\"><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_1  \"><div class=\"cell el-tooltip\" style=\"width: 105px;\"><div data-v-57f9f696=\"\">BTC看涨期权2分钟</div></div></td><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_2  \"><div class=\"cell el-tooltip\" style=\"width: 100px;\"><span data-v-57f9f696=\"\">PRACTICE</span></div></td><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_3  \"><div class=\"cell el-tooltip\"> 2020-11-03 11:46:31 </div></td><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_4  \"><div class=\"cell el-tooltip\" style=\"width: 100px;\"><span data-v-57f9f696=\"\" class=\"color-green\">看跌</span></div></td><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_5  \"><div class=\"cell el-tooltip\" style=\"width: 100px;\">13396.167</div></td><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_6  \"><div class=\"cell el-tooltip\" style=\"width: 100px;\">19.0357</div></td><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_7  \"><div class=\"cell el-tooltip\" style=\"width: 100px;\">0.1</div></td><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_8  \"><div class=\"cell el-tooltip\" style=\"width: 100px;\">1.90357</div></td><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_9  \"><div class=\"cell el-tooltip\" style=\"width: 100px;\">0.0000</div></td><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_10  \"><div class=\"cell el-tooltip\" style=\"width: 100px;\">00:01:21</div></td><td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_11 is-right \"><div class=\"cell el-tooltip\"><div data-v-57f9f696=\"\" class=\"closePosition\">平仓</div></div></td></tr><!----></tbody>");
      ;

       },1000);
   function CalculateStopWinAndLose(){
   var percent= $('#percent').val().trim();
       if(percent==''){
         return ;
       }
       var expectedProfitDown=$('div.expectedProfitDown').find('p');
              var strexpectedProfitDown=expectedProfitDown.html().replace('交割时指数价预计为：',"").replace("以下可盈利","").trim();

    var down=$('div.form-btn-down').find('div.fd').html().replace(" USDT","").trim();
     var stopwin= (1+parseFloat(percent)/100)*(parseFloat(strexpectedProfitDown)+parseFloat(down));
    var  stoplose= (1-parseFloat(percent)/100)*(parseFloat(strexpectedProfitDown)+parseFloat(down))
    var stopwins=upFixed(stopwin,4);
       var stoploses=downFixed(stoplose,4);
        var num=parseFloat($('input[type="text"]').eq(1).val());
       var currencyprice=getCurrencyPrice();
       console.log("num--"+num);
       var winprofit=(stopwin-currencyprice)*num-parseFloat(down)*num;
       console.log("winprofit--"+winprofit);
       winprofit=downFixed(winprofit,4);

       var loseprofit=(currencyprice-stoploses)*num-parseFloat(down)*num;
       loseprofit=downFixed(loseprofit,4);

     if($('#stopwin').length==0){
                 $('div.mod-available').append("<div data-v-168064cc=\"\" class=\"mod mod-form\"><div data-v-168064cc=\"\" class=\"mod-hd\"><h6 data-v-168064cc=\"\" class=\"tit\"><span id='stopwin' data-v-168064cc=\"\">看涨止盈价格:"+stopwins+"盈利:"+winprofit+"</span>  </h6></div></div>  ");
                 $('div.mod-available').append("<div data-v-168064cc=\"\" class=\"mod mod-form\"><div data-v-168064cc=\"\" class=\"mod-hd\"><h6 data-v-168064cc=\"\" class=\"tit\"><span id='stoplose' data-v-168064cc=\"\">看跌止盈:"+stoploses+"盈利:"+loseprofit+"</span>  </h6></div></div>  ");
        }else{
      stoplose
          $('#stopwin').html("看涨止盈:"+stopwins+"盈利:"+winprofit);
         $('#stoplose').html("看跌止盈:"+stoploses+"盈利:"+loseprofit);
     }

   }
    function CalculateDownPercent(){
    var expectedProfitDown=$('div.expectedProfitDown').find('p');
        var down=$('div.form-btn-down').find('div.fd');
        var t=expectedProfitDown.html()
       var strexpectedProfitDown=expectedProfitDown.html().replace('交割时指数价预计为：',"").replace("以下可盈利","").trim();
        var strdown=down.html().replace(" USDT","").trim()
        var percent=100*parseFloat(strdown)/(parseFloat(strexpectedProfitDown)+parseFloat(strdown))
        var expectedProfitDownext=$('div.expectedProfitDownExt');
        if(expectedProfitDownext.length==0){
       expectedProfitDown.append("<div data-v-168064cc=\"\" class=\"mod-tip expectedProfit expectedProfitDownExt\"><p data-v-168064cc=\"\" class=\"inner_tip inner_tip__error\" > "+percent+" </p></div>");
        }else{
            expectedProfitDownext.find('p').html(percent)
        }
    }
    function getCurrencyPrice(){

      var expectedProfitDown=$('div.expectedProfitUp').find('p');
        var down=$('div.form-btn-up').find('div.fd');
        var t=expectedProfitDown.html()
       var strexpectedProfitDown=expectedProfitDown.html().replace(' 交割时指数价预计为：',"").replace("以上可盈利","").trim();
        var strdown=down.html().replace(" USDT","").trim()
        return parseFloat(strexpectedProfitDown)-parseFloat(strdown);
    }
    function CalculateUpPercent(){
    var expectedProfitDown=$('div.expectedProfitUp').find('p');
        var down=$('div.form-btn-up').find('div.fd');
        var t=expectedProfitDown.html()
       var strexpectedProfitDown=expectedProfitDown.html().replace(' 交割时指数价预计为：',"").replace("以上可盈利","").trim();
        var strdown=down.html().replace(" USDT","").trim()
        var percent=100*parseFloat(strdown)/(parseFloat(strexpectedProfitDown)-parseFloat(strdown))

        var expectedProfitDownext=$('div.expectedProfitUpExt');
        if(expectedProfitDownext.length==0){
       expectedProfitDown.append("<div data-v-168064cc=\"\" class=\"mod-tip expectedProfit expectedProfitUpExt\"><p data-v-168064cc=\"\" class=\"inner_tip inner_tip__error\" > "+percent+" </p></div>");
        }else{
            expectedProfitDownext.find('p').html(percent)
        }
    }
    function filltd(){
    var cangtable=$('table').eq(1);
        console.log("length---"+cangtable.find('tr>td').length);
        if(cangtable.find('tr>td').length<12){
         cangtable.find('tbody>tr').append("<td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_2  \"><div class=\"cell el-tooltip\" style=\"width: 100px;\"><span data-v-57f9f696=\"\"><input type='text' id='takeprofitpercent'  size='10' /></span></div></td>");
         cangtable.find('tbody>tr').append("<td rowspan=\"1\" colspan=\"1\" class=\"el-table_1_column_2  \"><div class=\"cell el-tooltip\" style=\"width: 100px;\"><span data-v-57f9f696=\"\"><input type='text' id='takeprofit'  size='10' /></span></div></td>");
        }
        if($("#takeprofitpercent").val()==''){
        return;
       }

        if($("#takeprofit").val()==''){
            var ttt
            if(cangtable.find('td').eq(3).text()=='看涨'){
               // ttt=$('#stopwin').text().replace('看涨止盈:',"").replace('看涨止盈价格:',"");
               // ttt=ttt.substring(0,ttt.indexOf('盈利')).trim()
               //  $("#takeprofit").val(ttt+"");
                var  tmp=(1+parseFloat($("#takeprofitpercent").val())*0.01)*parseFloat(cangtable.find('td').eq(4).text());
               tmp= upFixed(tmp,4)
                                 $("#takeprofit").val(tmp+"");

            }
            if(cangtable.find('td').eq(3).text()=='看跌'){


              //    ttt=$('#stoplose').text().replace('看跌止盈:',"").replace('看跌止盈价格:',"");
              //  ttt=ttt.substring(0,ttt.indexOf('盈利')).trim()
              //   $("#takeprofit").val(ttt+"");
                  var  tmp2=(1-parseFloat($("#takeprofitpercent").val())*0.01)*parseFloat(cangtable.find('td').eq(4).text());
               tmp2= downFixed(tmp2,4);

                 $("#takeprofit").val(tmp2+"");
            }
        }
    }
    function  willstopwin(){
     var  profit= parseFloat($("#takeprofit").val());
     var cangtable=$('table').eq(1);;

      //  cangtable.find('td').eq(3).text()
     //var now=
            var currency=getCurrencyPrice();

         if(cangtable.find('td').eq(3).text()=='看跌'){
          if(profit>currency){


         //
               cangtable.find('td').eq(10).find('div').click();
 $('div.el-dialog__footer').find('button').eq(1).click();

        }

         }
         if(cangtable.find('td').eq(3).text()=='看涨'){
            if(currency>profit){
               cangtable.find('td').eq(10).find('div').click();
 $('div.el-dialog__footer').find('button').eq(1).click();

        }

         }
//  cangtable.find('td').eq(10).find('div').click();
// $('div.el-dialog__footer').find('button').eq(1).click();

     //  $('.form-btn-up').click();
        console.log("差额--|"+(currency-profit));

    }
     //alert('hello world');
    setInterval(function(){
          $('table').eq(1).css('width', '');
          $('table').eq(0).css('width', '');


        //$('table').eq(0).find("col").width("auto");
         $('table').eq(1).find("div").width("auto");
         $('table').eq(1).find("td").width("auto");

   //     console.log(cangtable.find('td').eq(3).text());
   //     var cangtablefirst=$('table:first');
    //        cangtablefirst.find("col").width("auto");
//        $('table').eq(1).width("900px");
// $('table').eq(1).find("div").each(function(){
//    $(this).width("auto");

//  });
      //  $('table').eq(1).find("div").width("auto");
        // $('table').eq(1).find("td").width("auto");
      //   console.log($('table').eq(1).find("div").html());
       CalculateDownPercent();
        CalculateUpPercent();
        CalculateStopWinAndLose();
       filltd();
        willstopwin();
        //cangtable.find("tr").append("<th colspan=\"1\" rowspan=\"1\" class=\"el-table_1_column_12  is-right   is-leaf\"><div class=\"cell\">止盈价</div></th>")

    }, 1000);
    // Your code here...
})();