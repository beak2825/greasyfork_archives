// ==UserScript==
// @name        TOKOPEDIA-PAYDEAL
// @namespace   TOKOPEDIAPAYDEAL
// @include     https://www.tokopedia.com/bcaklikpaydeal
// @version     1
// @grant       none
// @description xxxx.yeee
// @downloadURL https://update.greasyfork.org/scripts/10598/TOKOPEDIA-PAYDEAL.user.js
// @updateURL https://update.greasyfork.org/scripts/10598/TOKOPEDIA-PAYDEAL.meta.js
// ==/UserScript==



function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}



function main() {
  function doAjaxYYY(pro_id){
    var dt = {};
    dt.product_id=pro_id;
    jQ.ajax({
      url:document.location.origin+'/promo-voucher/ajax/promo-voucher.pl',
      global:false,
      type:'POST',data:dt,
      dataType:'json',
      timeout:5000,
      error    : function(){
        setTimeout(function(){
          doAjaxYYY(pro_id);
        },2250);  
        
        
      },
      success:function(result){
        //alert(result);
        if(result==""){
          setTimeout(function(){
            doAjaxYYY(pro_id);
          },2250);  
        }
        else if(result.must_login){window.location='/login.pl';return;}
        else if(result.message_error){
          setTimeout(function(){
            doAjaxYYY(pro_id);
          },2250);  
          /*
          jQ('#error-msg').text(result.message_error);
          jQ('.jqmOverlay').fadeIn().removeClass('hidden');
          jQ('.jqmWindow').fadeIn().removeClass('hidden');return;
          */
        }
        else{
          var bca=result.bca_param;
          var form=jQ(document.createElement('form'));
          jQ(form).attr('action',bca.bca_url).attr('method','POST');
          jQ('<input>').attr('type','hidden').attr('name','klikPayCode').val(bca.bca_code).appendTo(form);
          jQ('<input>').attr('type','hidden').attr('name','totalAmount').val(bca.bca_amt).appendTo(form);
          jQ('<input>').attr('type','hidden').attr('name','currency').val(bca.currency).appendTo(form);
          jQ('<input>').attr('type','hidden').attr('name','miscFee').val(bca.miscFee).appendTo(form);
          jQ('<input>').attr('type','hidden').attr('name','transactionDate').val(bca.bca_date).appendTo(form);
          jQ('<input>').attr('type','hidden').attr('name','signature').val(bca.signature).appendTo(form);
          jQ('<input>').attr('type','hidden').attr('name','callback').val(bca.callback).appendTo(form);
          jQ('<input>').attr('type','hidden').attr('name','transactionNo').val(bca.payment_id).appendTo(form);
          jQ('<input>').attr('type','hidden').attr('name','payType').val(bca.payType).appendTo(form);
          form.appendTo(document.body)
          jQ(form).submit();
        }
      }
    });
}
  doAjaxYYY('58');
  
  if (jQ("#promo-wrap58").hasClass("promo-disabled")== false){
  }else{
    if (jQ("#promo-wrap57").hasClass("promo-disabled")== false){
    }else{
    }
  }
  
}
addJQuery(main);



