// ==UserScript==
// @name         네이버 부동산(동)
// @namespace    http://tampermonkey.net/
// @version      0.60
// @description  try to take over the world!
// @author       You
// @match        https://land.naver.com/article/articleList.nhn*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/389137/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B6%80%EB%8F%99%EC%82%B0%28%EB%8F%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389137/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B6%80%EB%8F%99%EC%82%B0%28%EB%8F%99%29.meta.js
// ==/UserScript==
var jq = jQuery.noConflict();
(function() {
//https://land.naver.com/article/divisionInfo.nhn?rletTypeCd=A01&tradeTypeCd=&hscpTypeCd=A01%3AA03%3AA04&cortarNo=4146100000&articleOrderCode=

var data = jsonPageData.defaultRltrMbrIds.split(';')
jq("body").append('<div id="prcnumlog" style="position: absolute;z-index:1000;padding:10px 20px;top:50px;right:50px;background-color:black;color:white"></div>')
//jq("#prcnumlog").text("총 " + (data.length-1) );
var totalnum = data.length-1;

var i = 0;
var ids;
var cortarno =  jq("#cortarNo").val();
var addr= ( jq("#loc_view2 > select > option:selected").text() + ' ' +  jq("#loc_view3 > select > option:selected").text() );


var listarr;

function nextdong() {
    return;
    var nextdongno = jq("#loc_view3 > select > option:selected").next().val()
    if(typeof nextdongno != 'undefined' && nextdongno !='' && nextdongno !='undefined') {
        var url = "https://land.naver.com/article/articleList.nhn?rletTypeCd=A01&tradeTypeCd=&hscpTypeCd=A01%3AA03%3AA04&cortarNo=" + nextdongno;
        location.href=url
        console.log ( url )
    }
}
function list() {
    var url = "https://land.naver.com/article/map/realtorList.nhn";

    jq.ajax({
          url: url,
          type: 'GET',
          data: {cortarNo: cortarno, rletTypeCd: 'A01', tradTypeCd: '',  hscp_no: ''},
          dataType: 'json',
          success: function (result) {

              if ( typeof result.result !='undefined' && result.result.length > 0 ) {
                  listarr = result.result;
                  getinfo(0)
              }
              console.log (result);
          },
        error : function(request, status, error) {
            console.log("====error====");
            console.log ( "list error");
            console.log("====/error====");
        },
    });
}
function getinfo(idx) {
    if( typeof listarr[idx] == 'undefined' || idx >= listarr.length ) {
        jq("#prcnumlog").append("<div>완료</div>" );
        return;
    }
    var nextidx = idx+1;
    jq.ajax({
          url: '/article/ajax/rltrMbrProfile.nhn',
          type: 'GET',
          data: {rltr_mbr_id:listarr[idx].rltr_mbr_id, rletTypeCd:jq("#rletTypeCd").val(), cortarNo: cortarno },
          dataType: 'json',
          success: function (result) {
              if( typeof result.result !='undefined' && typeof  result.result['rltr_mbr_id'] !='undefined' ) {
                  result.result['dong_cortarNo'] = cortarno
                  result.result['addr'] = addr
                  var qry = result.result;
                  jq.ajax({
                      url: 'https://poohhunter.run.goorm.io/addrealtor/adddong',
                      type: 'GET',
                      data: qry,
                      dataType : "jsonp",
                      success: function (result) {
                          jq("#prcnumlog").append("<div>"+listarr.length + "중 " + (nextidx) +"번째 진행 : " + listarr[idx].rltr_mbr_id + " ** SUCCESS </div>" );
                          getinfo(nextidx)
                      },
                      error : function(request, status, error) {
                          jq("#prcnumlog").append("<div>"+listarr.length + "중 " + (nextidx) +"번째 진행 : " + listarr[idx].rltr_mbr_id + " ** ERROR(2) </div>" );
                          console.log("====error====");
                          console.log (nextidx, id)
                          console.log (qry)
                          console.log("====/error====");
                          //testadd(nextidx)
                      },
                  });
              }else {
                  jq("#prcnumlog").append("<div>"+listarr.length + "중 " + (nextidx) +"번째 진행 : " + listarr[idx].rltr_mbr_id + " ** FALSE </div>" );
                  getinfo(nextidx)
              }
          },
          error : function(request, status, error) {
              jq("#prcnumlog").append("<div>"+listarr.length + "중 " + (nextidx) +"번째 진행 : " + listarr[idx].rltr_mbr_id + " ** ERROR </div>" );
               console.log("====error====");
              console.log (nextidx, id)
              console.log(error);
              console.log("====/error====");
              //testadd(nextidx)
          },

       });
}
function testadd (idx) {
    if ( typeof data[idx] == 'undefined' || idx >= totalnum) {
        jq("#prcnumlog").text(totalnum + "완료 ");
        nextdong()
        return;
    }
    if( idx > 300 ){
        console.log ( "number error");
        return;
    }
    var ids = data[idx].split(':')
    var id = ids[0];
    var nextidx = idx+1;
    jq("#prcnumlog").text(totalnum + "중 " + (nextidx) +"번째 진행" );
    jq.ajax({
          url: '/article/ajax/rltrMbrProfile.nhn',
          type: 'GET',
          data: {rltr_mbr_id:id, rletTypeCd:jq("#rletTypeCd").val(), cortarNo: cortarno },
          dataType: 'json',
          success: function (result) {
              if( typeof result.result !='undefined') {
                  result.result['dong_cortarNo'] = cortarno
                  result.result['addr'] = addr
                  var qry = result.result;
                  jq.ajax({
                      url: 'https://poohhunter.run.goorm.io/addrealtor/adddong',
                      type: 'GET',
                      data: qry,
                      dataType : "jsonp",
                      success: function (result) {
                          console.log (nextidx, id)
                          console.log (result.result)
                          testadd(nextidx)
                      },
                      error : function(request, status, error) {
                          console.log("====error====");
                          console.log (nextidx, id)
                          console.log (qry)
                          console.log("====/error====");
                          //testadd(nextidx)
                      },
                  });
              }
          },
          error : function(request, status, error) {
               console.log("====error====");
              console.log (nextidx, id)
              console.log(error);
              console.log("====/error====");
              //testadd(nextidx)
          },

       });
}
    //testadd(0);
    list()
    // Your code here...
})();