// ==UserScript==
// @name        Scribd Text Always Selectable (to be used with Scribd unblur script(s))
// @namespace   Violentmonkey Scripts
// @match       *://*scribd.com/document*
// @grant       none
// @version     1.0
// @author      Private Kirby
// @license MIT
// @description 6/3/2024, 9:51:02 AM When used with another Scribd unblur script, this script should make the the text stay highlightable and allow copy and paste. Additional tweaks were made to also prevent the text from suddenly disappearing. Some text might turn black in the document or elsewhere on the site, even if the text wasn't originally black, so if it happens, please make an improved version of this for me. Only works on document pages.
// @downloadURL https://update.greasyfork.org/scripts/496974/Scribd%20Text%20Always%20Selectable%20%28to%20be%20used%20with%20Scribd%20unblur%20script%28s%29%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496974/Scribd%20Text%20Always%20Selectable%20%28to%20be%20used%20with%20Scribd%20unblur%20script%28s%29%29.meta.js
// ==/UserScript==

(function() {
  // Override the CSS to enable text selection and prevent text from turning white or becoming invisible/transparent
  const style = document.createElement('style');
  style.innerHTML = `
    *:not(.download_btn):not(.ReadFreeButton-module_wrapper__1-jez.download_free_button):not(.Tooltip-module_wrapper__XlenF):not(.search_results results_popup):not(.search_close_icon):not(.icon-ic_close):not(.TextButton-module_wrapper_ZwW-wM _2H0kI-):not(.auto__app_page_body_metadata_publisher):not(.auto__app_page_body_metadata_created_at):not(.see_more_btn):not(.SearchForm-module_searchInput__l73oF):not(.wrapper__mono_document_list_item):not(.LanguageDropdownMenu-module_wrapper__-esI3):not(.top_bar_container):not(.GridRow-module_wrapper__Uub42):not(.GridRow-module_extended__Bvagp):not(.auto__doc_page_shared_modals_modal_content):not(.modal_content_component):not(.auto__doc_page_modals_description):not(.Popover-module_popover_rvS3XG):not(.auto__doc_page_modals_print):not(.button_menu):not(.doc_actions):not(.auto__app_page_body_metadata_summary_wide):not(.TruncatedText-module_lineClamped_85ulHH):not(._1gJTQI):not(.auto__app_page_body_metadata_description):not(.auto__doc_page_body_toolbar):not(.input_wrapper):not(.page_of):not(.recommender_title):not(.content_carousel):not(.auto__doc_page_webpack_doc_page_body_static_promo_study):not(.after_doc_wrapper):not(.Footer-module_wrapper__7jj0T):not(.MenuItems-module_wrapper__y6cjo):not(.dismissible-ad-header-scribd_rightrail_adhesion):not(._3CRDVo):not(.wrapper__doc_page_shared_recommender_list):not(.dismissible-ad-header-scribd_DT_Leaderboard):not(.between_page_portal_root):not(.ButtonCore-module_content_8zyAJv):not(.CrrSAg):not(._1YspGx):not(._8rDKm2):not(.PrimaryButton-module_monotoneBlack_yfjqnu):not(._2TZ5Au):not(.promo_div):not(.Flash-ds2-module_flash__ks1Nu):not(.auto__doc_page_shared_components_popover) {
      user-select: text !important;
      color: inherit !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);

  // Override the JavaScript to enable copy/paste functionality
  const script = document.createElement('script');
  script.innerHTML = `
    document.addEventListener('copy', (event) => {
      event.stopPropagation();
    });

    document.addEventListener('cut', (event) => {
      event.stopPropagation();
    });

    document.addEventListener('paste', (event) => {
      event.stopPropagation();
    });
  `;
  document.head.appendChild(script);
})();