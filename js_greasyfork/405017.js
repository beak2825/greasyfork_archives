// ==UserScript==
// @name         自填
// @namespace    https://www.bee.moe
// @version      1.0
// @description  auto fill ticket
// @author       Bee
// @match        https://www.railway.gov.tw/tra-tip-web/tip/tip001/tip122/tripTwo/byTrainNo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405017/%E8%87%AA%E5%A1%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/405017/%E8%87%AA%E5%A1%AB.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';
    //data＝＝＝＝＝＝＝身分證＝＝＝起點＝終點＝＝＝出發日＝＝車次＝＝回程日＝＝＝車次＝幾張(去,回)＝不換坐＝＝＝＝＝＝＝＝＝＝＝＝
    const bee_data = ["F00000000","1000","7000","2020/06/26","228","2020/06/28","691","2","4","false"];
    const bee_data2 = ["F000000000","1000","7000","2020/06/26","228","2020/06/28","691","2","4","false"];
    //const bee_data = ["F000000000","7360-瑞芳","7000-花蓮","2020/06/26","228","2020/06/28","不知道"];
    //element
    //const bee_element = ["pid","startStation","endStation","rideDate1","trainNoList1","rideDate2","trainNoList4"];input-example-1
    const bee_element = ["pid","ticketOrderParamList[0].startStation","ticketOrderParamList[0].endStation",
                         "ticketOrderParamList[0].rideDate","ticketOrderParamList[0].trainNoList[0]","ticketOrderParamList[1].rideDate","ticketOrderParamList[1].trainNoList[0]","ticketOrderParamList[0].normalQty","ticketOrderParamList[1].normalQty","ticketOrderParamList[1].chgSeat"];
    const bee_element2 = ["pid","ticketOrderParamList[1].endStation","ticketOrderParamList[1].startStation",
                         "ticketOrderParamList[0].rideDate","ticketOrderParamList[0].trainNoList[0]","ticketOrderParamList[1].rideDate","ticketOrderParamList[1].trainNoList[0]","ticketOrderParamList[0].normalQty","ticketOrderParamList[1].normalQty","ticketOrderParamList[1].chgSeat"];
    //click id
    //const bee_click_element = ["tripType1","chgSeat1","chgSeat2"];

    /*bee_click_element.forEach((input_text,elid)=>{
        //document.getElementById(input_text).click();
        document.getElementsByName(input_text).click();

    });*/

    bee_element.forEach((input_text,elid)=>{
        //document.getElementById(input_text).value=bee_data[elid];
        document.getElementsByName(input_text)[0].value=bee_data[elid];
    });

    bee_element2.forEach((input_text,elid)=>{
        //document.getElementById(input_text).value=bee_data[elid];
        document.getElementsByName(input_text)[0].value=bee_data2[elid];
    });
    document.getElementsByName("ticketOrderParamList[1].chgSeat")[1].value="false";


})();