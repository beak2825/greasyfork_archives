// ==UserScript==
// @name         Anjinhos
// @namespace    Anjinhos
// @license      MIT
// @version      1.4
// @description  Anjinhos Desc
// @author       JF
// @match        *://*.anjinhosdenatal.pt/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/513397/Anjinhos.user.js
// @updateURL https://update.greasyfork.org/scripts/513397/Anjinhos.meta.js
// ==/UserScript==

(function(){
	const userStyle = '.home #masthead,#site-header-cart,.site-search,.woocommerce-products-header,.price,.wcfmmp-store-page .quick_buy_container,.wcfmmp-store-page .custom-attributes br,.woocommerce-ordering,.woocommerce-result-count,.wcfmmp-store-page .custom-attributes .idade .attribute-label,.wcfmmp-store-page .custom-attributes .brinquedo,.wcfmmp-store-page .custom-attributes .peca-de-roupa,.wcfmmp-store-page .custom-attributes .tamanho,.wcfm_dashboard_stats_block:first-child,.wcfm_dashboard_stats_block:nth-child(2),.wcfm-dashboard-page .select2 select2-containe.select2-container--defaul,#wcfmmp_profile_complete_progressbar,#wcfm_settings_dashboard_head,.wcfmmp_profile_complete_help.description,#wcfm_settings_form_shipstation_head,#wcfm_settings_form_analytics_region_head,.add_to_cart_button,.woocommerce-breadcrumb,.single_add_to_cart_button,.cart-subtotal,.order-total,.product-total,.woocommerce-checkout-review-order-table thead,.product-name .product-quantity,.product_meta .posted_in,.wcfmmp-store-page .outofstock .woocommerce-loop-product__title,.wcfmmp-store-page .outofstock .custom-attributes .idade,.related.products,.stock.in-stock,.single-product div.product form.cart,.woocommerce-tabs,.idade .attribute-label,.genero .attribute-label,.custom-attributes > br:first-of-type,.tax-total,#billing_country_field,#billing_address_1_field,#billing_city_field,#billing_postcode_field,.woocommerce-notices-wrapper,.woocommerce-order-overview__total,.woocommerce-order-details thead,.woocommerce-order-details tfoot,.storefront-handheld-footer-bar,.woocommerce-thankyou-order-details,.site-footer a,.site-footer br,.woocommerce-customer-details,.wcfm_banner_area,.storefront-breadcrumb,#wcfm_store_header .header_right,#tab_links_area,#wcfmmp-store .address,.wcfmmp_sold_by_container_advanced .wcfmmp_sold_by_label,#wcfm-vendor-manager-wrapper br,#wcfm_vendor_manage_form_message_head,#wcfm_vendor_manage_form_badges_head,#wcfm_vendor_manage_form_store_policy_support_settings_head,#wcfm_vendor_manage_form_store_seo_social_settings_head,#wcfm_vendor_manage_form_store_hours_settings_head,#wcfm_vendor_manage_form_store_commission_settings_head,#wcfm_settings_form_delivery_time_head,#wcfm_vendor_manage_form_store_shipping_settings_head,#wcfm_vendor_manage_profile_form h2,#wcfm_vendor_manage_profile_form .store_address,#wcfm_vendor_manage_store_setting_form .banner_type,#wcfm_vendor_manage_store_setting_form #banner_type,#wcfm_vendor_manage_store_setting_form .banner_type_field,#wcfm_vendor_manage_store_setting_form .mobile_banner,#wcfm_vendor_manage_store_setting_form .wcfm-banner-uploads,#wcfm_vendor_manage_store_setting_form .list_banner_type_single_img,#wcfm_vendor_manage_store_setting_form #list_banner_type,#wp-shop_description-wrap,.store_location_wrap,.woocommerce-MyAccount-navigation-link--followings,.woocommerce-MyAccount-navigation-link--support-tickets,.woocommerce-MyAccount-navigation-link--edit-address,.woocommerce-MyAccount-navigation-link--downloads,.woocommerce-MyAccount-navigation-link--dashboard,.woocommerce-orders-table__header-order-number,.woocommerce-orders-table__header-order-total,.woocommerce-orders-table__cell-order-number,.woocommerce-orders-table__cell-order-total,.wcfm-support-action,.store_visibility_wrap,.list_banner_type.wcfm_title,.shop_description.wcfm_title,#wcfm_vendor_manage_store_setting_form h2,.woocommerce-button.button.wcfm-refund-action,.wcfm-store-page .wcfm_buttons,.wcfm-dashboard-page .wcfm_vendor_settings_heading,#wcfm_store_setting_save_button,.wooccm-field-country,.wooccm-field-address_1,.wooccm-field-city,.wooccm-field-postcode {display: initial !important;}';

	var style = document.createElement('style');
	style.innerText = userStyle;
	document.head.appendChild(style);


jQuery(function(){jQuery('.brinquedo.boneca-barbie').css("background-color", "yellow");jQuery('.tamanho.12-anos').css("background-color", "yellow"); })

})();