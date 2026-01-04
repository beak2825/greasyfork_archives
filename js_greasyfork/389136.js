// ==UserScript==
// @name         네이버 부동산(구)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://land.naver.com/article/divisionInfo.nhn*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/389136/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B6%80%EB%8F%99%EC%82%B0%28%EA%B5%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389136/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B6%80%EB%8F%99%EC%82%B0%28%EA%B5%AC%29.meta.js
// ==/UserScript==
var jq = jQuery.noConflict();
(function() {
//https://land.naver.com/article/divisionInfo.nhn?rletTypeCd=A01&tradeTypeCd=&hscpTypeCd=A01%3AA03%3AA04&cortarNo=4146100000&articleOrderCode=
var data = jsonPageData.defaultRltrMbrIds.split(';')
var i = 0;
var cortarno =  jq("#cortarNo").val();
var addr= ( jq("#loc_view2 > select > option:selected").text() );
return;
    data.forEach(function(element) {
        var ids = element.split(':')
        var id = ids[0]
        if ( i > 3000 ) return;
        else i++;

        jq.ajax({
          url: '/article/ajax/rltrMbrProfile.nhn',
          type: 'GET',
          data: {rltr_mbr_id:id, rletTypeCd:jq("#rletTypeCd").val(), cortarNo: jq("#cortarNo").val() },
          dataType: 'json',
          success: function (result) {
              if( typeof result.result !='undefined') {
                  result.result['cortarNo'] = cortarno
                  result.result['addr'] = addr
                  var qry = result.result;
                  jq.ajax({
                      url: 'https://test.dawin.xyz/nvrealtor/addrealtor',
                      type: 'GET',
                      data: qry,
                      dataType : "jsonp",
                      success: function (result) {
                          console.log ( qry )
                      },
                      error : function(request, status, error) {
                          console.log(error);
                      },
                  });
              }
          },
          error : function(request, status, error) {
                 console.log(error);
          },

       });
});
    // Your code here...
})();