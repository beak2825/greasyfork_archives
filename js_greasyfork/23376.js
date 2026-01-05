// ==UserScript==
// @version        2016.09.12
// @name        BBAAutoIndexing 1.2
// @namespace   BBAAutoIndexing
// @author	      fengguan.ld~gmail。com
// @include     *192.168.3.8/BBA*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @description BBAAutoIndexing

// @downloadURL https://update.greasyfork.org/scripts/23376/BBAAutoIndexing%2012.user.js
// @updateURL https://update.greasyfork.org/scripts/23376/BBAAutoIndexing%2012.meta.js
// ==/UserScript==
$(function () {
  var $btnAutoEnter = '<input type="button" value="Auto Enter" id="btnAutoEnter" class="button" style="margin-left:3px;width:120px;" >';
  $("[ID$=btnDel]").after($btnAutoEnter);
  $("#btnAutoEnter").click(function(){
    
    $("[ID$=CARRIER_NUMERIC]").val("1792");
  $("[ID$=SERVICE_LEVEL]").val("SE");
  $("[ID$=FOREIGN_CURRENCY]").val("EU");
  $("[ID$=WEIGHT_UNIT]").val("KG");
  $("[ID$=LOCATION_CODE_2]").val("WAS");
  $("[ID$=RECEIVE_DATE_txtDATE]").val("08/01/16");
  $("[ID$=PIECES]").val("1");
  $("[ID$=BILL_WEIGHT]").val("18");
  $("[ID$=CARRIER_ACCOUNT]").val("G0500001");
  $("[ID$=CUSTOMER_DEFINED_1]").val("FR91000000002");
  $("[ID$=BILL_OF_LADING]").val("BHS140000000003");
  $("[ID$=PROBILL").val("E1A1234567");
  
  $("[ID$=INVOICE_DATE_txtDATE]").val("05/01/16");
  $("[ID$=SHIP_DATE_txtDATE]").val("06/01/16");
  $("[ID$=RECEIVE_DATE_txtDATE]").val("07/01/16");
  $("[ID$=INCO_TERMS]").val("FCA");
  
  $("[ID$=ACCESSORIAL_CODE_1]").val("M2");
  $("[ID$=ACCESSORIAL_CODE_2]").val("FR");
  $("[ID$=ACCESSORIAL_CODE_3]").val("AZ");
  $("[ID$=ACCESSORIAL_CODE_4]").val("CW");
  $("[ID$=ACCESSORIAL_CODE_5]").val("AQ");
  $("[ID$=ACCESSORIAL_CODE_6]").val("CL");
  $("[ID$=ACCESSORIAL_CODE_7]").val("HZ");
  $("[ID$=ACCESSORIAL_CODE_8]").val("AD");
  $("[ID$=ACCESSORIAL_CODE_9]").val("AM");
  
  $("[ID$=ACCESSORIAL_CHARGED_1]").val("20.2");
  $("[ID$=ACCESSORIAL_CHARGED_2]").val("76.82");
  $("[ID$=ACCESSORIAL_CHARGED_3]").val("18.53");
  $("[ID$=ACCESSORIAL_CHARGED_4]").val("35");
  $("[ID$=ACCESSORIAL_CHARGED_5]").val("15");
  $("[ID$=ACCESSORIAL_CHARGED_6]").val("142.56");
  $("[ID$=ACCESSORIAL_CHARGED_7]").val("35.5");
  $("[ID$=ACCESSORIAL_CHARGED_8]").val("10.56");
  $("[ID$=ACCESSORIAL_CHARGED_9]").val("55.5");
  
  $("[ID$=ENTITY]").val("FRA");
  $("[ID$=BILL_TO_COMPANY]").val("MS AMAZON ORACLE LTD");
  $("[ID$=BILL_TO_ADDRESS_1]").val("200-300 DEMO ESTATE NARODA");
  $("[ID$=BILL_TO_ADDRESS_2]").val("2100-3100 TEST ESTATE NARODA");
  $("[ID$=DIVISION]").val("FRA");
  $("[ID$=SHIPPER_COMPANY]").val("MS AMAZON ORACLE LTD");
  $("[ID$=SHIPPER_CITY]").val("AHMEDABAD");
  $("[ID$=SHIPPER_ZIPCOD]").val("IND");
  $("[ID$=CONSIGNEE_COMPANY]").val("MS AMAZON ORACLE SOLUTIONS");
  $("[ID$=CONSIGNEE_ADDRESS_1]").val("2 ADDRESS DEMO SARTRE");
  
  $("[ID$=CONSIGNEE_CITY]").val("WASQUEHAL");
  $("[ID$=CONSIGNEE_ZIPCODE]").val("FRA");
  $("[ID$=INTL_DESTINATION_POSTAL_CODE]").val("59000"); 
  });

  
});
