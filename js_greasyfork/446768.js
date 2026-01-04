// ==UserScript==
// @name            M2優化開單界面
// @version         0.1
// @description     優化界面
// @match           http://devbk243.mrliving.com.tw/admin_qybght/sales/order_create/*
// @run-at          document-end
// @namespace https://greasyfork.org/users/864503
// @downloadURL https://update.greasyfork.org/scripts/446768/M2%E5%84%AA%E5%8C%96%E9%96%8B%E5%96%AE%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/446768/M2%E5%84%AA%E5%8C%96%E9%96%8B%E5%96%AE%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==
window.addEventListener("load", function(){
  'use strict';

  //--- section 1
  // 偵測開單頁打開 for monkey
  // 因為從 create order 選客戶 => 開單介面是 CSS 變化，url 不變，不會重新 loading
  // 所以必須加上 style 偵測
  // 這段 GTM 會做，但 monkey 必須加上
  var observer4createOrder = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
       console.log(mutation);
      if(mutation.attributeName === 'style'){
        modifyLayout();
        //observer4createOrder.disconnect();
      }
    });
  });

  // Notify me of style changes
  var observerConfig2 = {
    attributes: true,
    attributeFilter: ["style"]  // Notify me of style changes
  };

  var targetNode = document.getElementById('order-data');
  observer4createOrder.observe(targetNode, observerConfig2);
  // --- end of section 1
});
function modifyLayout(){
  console.log('hello');
  var cssFix = document.createElement('style'); //新增一個元素<style>

  // ---section 2
  // 欄位位置移動

  // 移動 section
  document.querySelector('#order-form_account').after(document.querySelector('#order-addresses'));
  document.querySelector('#order-addresses').after(document.querySelector('.order-sidebar'));
  document.querySelector('#order-addresses').after(document.querySelector('#order-items'));
  document.querySelector('#order-addresses').after(document.querySelector('.order-search-items'));
  // 移動欄位
  document.querySelector('.field-deposit_date').before(document.querySelector('.field-so_deposit'));
  document.querySelector('.field-so_store').after( document.querySelector('.field-shipdate'));
  document.querySelector('.field-so_store').after( document.querySelector('.field-saman'));
  document.querySelector('.field-shipdate').after( document.querySelector('.field-ss_comments'));
  document.querySelector('.field-shipdate').after( document.querySelector('.field-inventory_in_msg'));
  document.querySelector('.field-gui_printmk').after( document.querySelector('.field-donate_code'));
  document.querySelector('.field-gui_printmk').after( document.querySelector('.field-gui_carrierid1'));
  document.querySelector('.field-comid_s').before(document.querySelector('.field-einvoice_item'));
  document.querySelector('.field-com_s').after(document.querySelector('.field-test333'));
  document.querySelector('.field-test333').after(document.querySelector('.field-contact_return'));
  document.querySelector('.field-use_homecard').after( document.querySelector('.field-remind_msg'));
  document.querySelector('.field-remind_msg').before(document.querySelector('.field-exp_visited'));
  document.querySelector('.field-remind_msg').before(document.querySelector('.field-order_labels'));
  document.querySelector('.field-remind_msg').before(document.querySelector('.field-employee_purchase'));
  document.querySelector('.field-remind_msg').after(document.querySelector('.field-remind'));;
  document.querySelector('#order-addresses .admin__page-section-content').after(document.querySelector('.field-has_elevator'));
  document.querySelector('#order-addresses .admin__page-section-content').after(document.querySelector('.field-dev_phone02'));
  document.querySelector('#order-billing_address .field-telephone').before(document.querySelector('#order-billing_address .field-street'));
  document.querySelector('#order-shipping_address .field-telephone').before(document.querySelector('#order-shipping_address .field-street'));
  document.querySelector('#order-billing_address .field-firstname').before(document.querySelector('#order-billing_address .field-lastname'));
  document.querySelector('#order-shipping_address .field-firstname').before(document.querySelector('#order-shipping_address .field-lastname'));

  // --- end of section 2

  // --- section 3
  // customer view 收合
  if(document.querySelector('.customer-activity-title')){
    document.querySelector('.customer-activity-title').innerHTML +='<div class="dropdown" style="margin-left:5%; display:inline-block; font-weight:bold; font-size:5px; color:red; background-color:	#D0D0D0;"">&nbsp; ▼ </div>';
    cssFix.innerHTML += '.customer-activity-title {background-color:#D0D0D0; width:15%; cursor:pointer;}'
    cssFix.innerHTML += '.create-order-sidebar-container {margin:0px;padding:5px;display:none;}'
    jQuery(".customer-activity-title").click(function(){
      jQuery(".create-order-sidebar-container").slideToggle("slow");
    });
    cssFix.innerHTML += '#sidebar_data_cart,#sidebar_data_wishlist,#order-sidebar_reorder {display:inline-block;width:33%;}'
  }

  // --- end of section 3


  // --- section 4
  // css

  cssFix.innerHTML += '.admin__field+.admin__field { margin-top: 0.5rem;}body { line-height: 1;}.data-grid td { padding: 0.8rem;}.admin__page-section-title {margin-bottom: 0.7rem;}.admin__page-section {margin-bottom: 1.3rem;}.order-sidebar{padding:5rem; width:100%; margin-bottom:2%; margin-top:2%;}.admin__data-grid-pager{white-space:nowrap;}';
  cssFix.innerHTML += '.admin__field.field.field-email.required._required {margin-top: 0rem;}'
  cssFix.innerHTML += '.admin__field.field.field-deposit_date{display: inline-block; width:15%; margin:0 4%;}'
  cssFix.innerHTML += '.field-einvoice_item,.field-saman,.field-so_deposit,.field-e_invoice,.field-pe_select,.field-gui_printmk,.field-donate_code,.field-gui_carrierid1,.field-so_store,.field-paid_store{display:inline-block;width:20%;margin-right:1% !important;}';
  cssFix.innerHTML += '.field-gui_carrierid1,.field-telephone{margin-right:6%; }'
  cssFix.innerHTML += '.field-comid_s{margin-right:3%; }'
  cssFix.innerHTML += '.field-com_s,.field-comid_s{display: inline-block; width:40%; }'

  cssFix.innerHTML += '.admin__field-option {display:inline-block; width:17%; }'

  cssFix.innerHTML += '.field-use_homecard {display:inline-block; width:60%; }'
  cssFix.innerHTML += '.field-order_labels,.field-line_member {display:inline-block; width:25%; }'
  cssFix.innerHTML += '.field-employee_purchase {display:inline-block; width:30%; }'

  cssFix.innerHTML += '.admin__field.field.field-firstname.required._required,.admin__field.field.field-lastname.required._required {display: inline-block; width:50%;}'
  cssFix.innerHTML += '.admin__field.field.field-company {display: none;}'
  cssFix.innerHTML += '.field-firstname {margin-right:6%; }'


  cssFix.innerHTML += '.field-country_id,.field-state{display: inline-block;width:33%;}'

  cssFix.innerHTML += '.field-telephone,.field-dev_phone02{display:inline-block; width:50%; }'
  cssFix.innerHTML += ' .admin__field-shipping-same-as-billing label,.order-save-in-address-book label{white-space:nowrap;}.customer-activity-title{white-space:nowrap;width:80%;}.field-deposit_date ._has-datepicker.admin__control-text{width: 120px;}.order-details{padding: 5rem;width: 100%;}';
  cssFix.innerHTML += '#order-shipping_address_fields>.field-telephone{width:100%;}';
  document.getElementsByTagName('head')[0].appendChild(cssFix);

}