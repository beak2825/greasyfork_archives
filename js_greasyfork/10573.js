// ==UserScript==
// @name        BBM-MONEY
// @namespace   sfdsfsfs
// @include     https://hargahot.com/new/product/*
// @version     1.2.2
// @grant       none
// @description TEST DOANG
// @downloadURL https://update.greasyfork.org/scripts/10573/BBM-MONEY.user.js
// @updateURL https://update.greasyfork.org/scripts/10573/BBM-MONEY.meta.js
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
  var id   = '';
  var klik = false;
  
  jQ('.box').click(function(){
    idx = jQ('.detail-product',this).prop('href').trim().replace('https://hargahot.com/new/product/promotion_detail/bbm-money/','');
    idx = idx.substring(0,idx.indexOf("-"));    
    
    //idx = jQ('.detail-product',this).prop('href').trim().substring(62, 66);    
    if(idx!=id){
      alert("ganti produk ke " + idx);
    }    
    id=idx;
    
    if(klik==false){      
      tambahYOOW(id,127);
      klik = true;
    }else{
    }
    
    
    
    
        
  });
  
  function tambahYOOW(product_id, promotion_code_id) {
    if(product_id!=id){
      alert("ganti produk ke " + product_id);
    }
  //id = product_id ;
  
    jQ.ajax({
    type: "POST",
    url: "https://hargahot.com/new/bungkus/promo",
    data: "product_id=" + id + "&promotion_code_id="+promotion_code_id,
    success: function(data) {
        jQ('#bungkus-popup').html(data);
      //var parnt = jQ('.option_list:eq(1)');
      //var parnt = jQ('#bungkus-popup');
      
      //alert(jQ("input[type=hidden]",parnt).length);
      
       // if(jQ("input[type=hidden]",parnt).length > 0){
      
     if(jQ("#product_option_value_id\\[\\]").length > 0){

      
          jQ("#btn_add_to_cart").click();     
     //     alert('ada');
          addCRT();
        }
        else{
      //   alert('tidak');
          
        setTimeout(function(){
          tambahYOOW(id, promotion_code_id);
        },2250);  
        
        }
      
      // jQ('#mymodalCartPromo').modal('show');
    },
            error    : function(){
        setTimeout(function(){
          tambahYOOW(id, promotion_code_id);
        },2250);  
        
        
      }
      
      
      
      
      
      
      
      
      
      
    });
    //return false;
}


  function addCRT(qid){
    if(qid){
      if( jQ('#'+qid).val() < 1 ){
        jQ('#'+qid).val(1);
      }
    }

    jQ.ajax({
        type: 'POST',
        url: 'https://hargahot.com/new/cart/PromoToCart',
        data: $('#options-form').serialize(),
        dataType: 'json',
      
      
                  error    : function(){
        setTimeout(function(){
          tambahYOOW(id, promotion_code_id);
        },2250);  
        
        
      },
      
      
        success: function(data) {
          if (data.error == '1') {
//tambahYOOW(id);
            
                    setTimeout(function(){
          tambahYOOW(id, 127);
        },2250);  
        
            
            
          } else {

           //window.location("data.checkout_url");

            //alert(data.checkout_url);
            window.location.href = data.checkout_url;
            //$('#checkoout_url').attr('href', data.checkout_url);
          }
        }
      });

}
  
  
}

//bungkus_product_promo(814,127);





addJQuery(main);



