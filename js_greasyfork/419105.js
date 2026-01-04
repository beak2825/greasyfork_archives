// ==UserScript==
// @name Userstyles / Greasy Fork Enhancer Dark-Grey v.255
// @namespace https://greasyfork.org/en/users/8-decembre
// @version 1.255000.0
// @description Custom Widescreen CSS theme for  and
// @author decembre
// @license GPL version 3 or any later version;
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/419105/Userstyles%20%20Greasy%20Fork%20Enhancer%20Dark-Grey%20v255.user.js
// @updateURL https://update.greasyfork.org/scripts/419105/Userstyles%20%20Greasy%20Fork%20Enhancer%20Dark-Grey%20v255.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "userstyles.org" || location.hostname.endsWith(".userstyles.org")) || (location.hostname === "greasyfork.org" || location.hostname.endsWith(".greasyfork.org")) || (location.hostname === "sleazyfork.org" || location.hostname.endsWith(".sleazyfork.org")) || (location.hostname === "greasyfork-org.translate.goog" || location.hostname.endsWith(".greasyfork-org.translate.goog")) || location.href.startsWith("https://greasyfork.org/forum/") || location.href.startsWith("https://74.86.192.75/")) {
  css += `

  /* ==== Greasy Fork Enhancer Dark-Grey  v.255 (new255) - without Userstyles.org - prefers-color-scheme: dark - Dev in FIREFOX - without [datetime] ==== */

  /* [A VOIR]:
  #preview_image_div .recommendations.loaded
  (new226) [A VOIR]
  - URL-PRF fr: Forum disc Greas /USERstyle different
  ==== */

  /* (new248) SUPPORT PRINCPAL:
  ▶ CITRUS FIX by Konf(2020.12.09) :
  https://greasyfork.org/en/discussions/requests/69803-help-to-fix-ts-citrus-gfork#comment-173029
  ▶ [TS] Citrus GFork (Original):
  https://greasyfork.org/en/scripts/4336-ts-citrus-gfork
  =================== */

  /* (new248) SUPPORT OTHER GM: ========
  NEW:

  ▶ GM "Greasyfork – Auto-Translator"  by carrot4522 [2025]
  https://greasyfork.org/fr/scripts/555224-greasyfork-auto-translator-v16

  ▶ GM "Greasy Fork Amélioré" by OHAS [2025]
  https://greasyfork.org/fr/scripts/552737-better-greasy-fork

  ▶ GM "Greasyfork notifications dropdown" by hdyzen [2025]
  https://greasyfork.org/fr/scripts/550687-greasyfork-notifications-dropdown

  ▶ GM "Greasy Fork Bookmark (AFU IT)" by Afu it (2025): 
  https://greasyfork.org/fr/scripts/534995-greasy-fork-bookmark-afu-it
  ▶ GM "UTags - Add usertags to links" by Pipe Craft (2023):
  https://greasyfork.org/fr/scripts/460718-utags-add-usertags-to-links
  ▶ GM "Markdown toolbar for GreasyFork" by 人民的勤务员 / Serviteurs du peuple (2024):
  https://greasyfork.org/en/scripts/505164-markdown-toolbar-for-greasyfork
  ▶ GM "USO - add USOa button on userstyle page" by Achernar (2022):
  https://greasyfork.org/fr/scripts/443153-uso-add-usoa-button-on-userstyle-page
  AGAINST "PRO" USERSTYLES
  ▶ GM "Greasy Fork Display User Information" by NotYou (2022):
  https://greasyfork.org/fr/scripts/437643-greasy-fork-display-user-information
  ▶ GM "Greasyfork 快捷编辑收藏" - "Greasyfork script-set-edit button" - "Greasyfork Modification rapide des favoris" by PYUDNG - 2022 :
  https://greasyfork.org/fr/scripts/439699-greasyfork-%E5%BF%AB%E6%8D%B7%E7%BC%96%E8%BE%91%E6%94%B6%E8%97%8F
  ▶ GM "GreasyFork - add a 'send PM to user' button in Greasyfork profile pages"
  https://greasyfork.org/fr/scripts/23703-greasyfork-add-a-send-pm-to-user-button-in-greasyfork-profile-pages
  ▶ GM "Greasyfork - Add notes to the script"
  https://greasyfork.org/fr/scripts/404275-greasyfork-add-notes-to-the-script
  ▶ GM "Greasyfork Search with Sleazyfork Results include":
  https://greasyfork.org/fr/scripts/23840-greasyfork-search-with-sleazyfork-results-include

  IN TEST (but NOT in USE (solved by CSS on iframe):
  ▶ GM "USO - fix editor's page height" by Achernar:
  https://greasyfork.org/fr/scripts/431548-uso-fix-editor-s-page-height
  =================== */

  /* (new248) SUPP */
  #script-feedback-ad ,
  .ethical-ads-text ,
  .ethical-ads ,
  .ad.ad-ea ,
  #script-feedback-ad.ad.ad-ea .ethical-ads.ethical-ads-text ,


  [class^="header-buttons_extensionButtonWrapper__"],
  [class^="GoogleAd_galleryHeader__"],
  [class^="GoogleAd_galleryGridCube__"],
  [class*="GoogleAd_"],
  [class^="style_adWrapper__"],
  [class^="recommended-styles_recommendedStylesWrapper__"],
  [class^="style-image_gradient__"],
  [class^="header-buttons_goProButton__"],
  [class^="user-profile_shadow__"],
  [class^="rate-us_rateUsWrapper__"] {
      display: none !important;
  }



  /* GM UTags - PB CITATION FORUM == SUPP not work
  https://greasyfork.org/fr/scripts/459799-style-shadowdom/discussions/298726#comment-593927
  === */
  .comment .user-content p a + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) {
      display: none !important;
  }

  /* SUPP - SPAM COMMENT (need :has selector):
  FROM "userstyles.org Anti-Spam" by sapondanaisriwan
  https://userstyles.world/style/7286/userstyles-org-anti-spam
  ==== */

  /* (new238) SUPP - CHROME/FIREFOX - SUPP ADD and DIVERS - without adblock */
  #preview_image_div .recommendations.loaded,
  .bannerWrapper[href="/bounty-campaign?action=enroll"] > img,
  .form-controls > a[classname="bannerWrapper"],
  .PageContent > a[classname="bannerWrapper"],
  a[classname="bannerWrapper"],
  #bountyBadgeWrapper,
  .upgradeButton .buttonContainer,
  .upgradeButton .separator,
  /* .upgradeButton  , */
  /* .bountyCampaignLeaderboardContainer , */
  .right #subscription_link,
  #modelBackdrip.poptin-popup-background,
  .poptin-popup.new-popup,
  #easter-egg-wrapper,
  .easter-leaderboard-container,
  #onesignal-popover-container,
  #onesignal-slidedown-container,
  .overlay_background,
  #installBox,
  li.ad-entry,
  .ad-entry,
  #GM_UpdateWindow,
  #script-show-info-ad,
  .adsbygoogle,
  #share_div,
  .NotificationLine,
  .hamburger,
  .walking,
  .android_button_button,
  .overlay_background,
  .adContainer,
  #discussions-area #social.single-style,
  #social,
  .twitter-share-button,
  #twitter-widget-0,
  .fb-like {
      display: none !important;
  }

  .tf-v1-popover,
  style[data-styled="true"] + #root > div > div > div div,
  style[data-styled="true"] + #root > div > div > div,
  style[data-styled="true"] + #root > div > div,
  style[data-styled="true"] + #root > div,
  style[data-styled="true"] + #root {
      visibility: hidden !important;
      display: none !important;
  /*border: 1px solid violet !important;*/
  }

  /* (new247) - GREASY - 2FA */
  .text-content:has([action$="/users/confirm_2fa"]) {
      padding: 5px 10%  !important;
  }

  .text-content:has([action$="/users/confirm_2fa"]) img {
      min-width: 28% !important;
      max-width: 28% !important;
      max-height: 30vh !important;
      object-fit: contain !important;
      background-color: white  !important;
  /*border: 1px solid violet !important;*/
  }
  header#main-header + .width-constraint > section.text-content:not(.reportable):has([action$="/users/confirm_2fa"]) > p:not(:empty)  {
      font-size: 15px !important;
  }


  /* (new251) TEST - CODE - WORD BREAK 
  https://greasyfork.org/en/scripts/25068-downloadallcontent
  == */
  pre {
      word-break: break-all !important;
      white-space: pre-wrap !important;
  }


  /* (new248) TEST - GM "Greasy Fork Bookmark (AFU IT)" 
  https://greasyfork.org/fr/scripts/534995-greasy-fork-bookmark-afu-it
  === */

  /* TOP NAV */
  body[pagetype="ListingPage"] #site-nav > nav:has([href="https://greasyfork.org/bookmarks"]) {
    position: absolute;
    display: inline-block !important;
    height: 15px !important;
    line-height: 15px !important;
    width: 530px !important;
    top: -4px !important;
    left: 12% !important;
    text-align: left !important;
    z-index: 50000 !important;
  }
  body[pagetype="ListingPage"] #site-nav > nav:has([href="https://greasyfork.org/bookmarks"]) .sidebar-search {
      display: inline-block !important;
      width: 240px !important;
      left: 320px !important;
  }
  body[pagetype="ListingPage"] #site-nav > nav:has([href="https://greasyfork.org/bookmarks"]) .sidebar-search input[type="search"]{
      display: inline-block !important;
      width: 200px !important;
      left: 320px !important;
  }


  /* (new248) TEST - GM "Greasy Fork Bookmark (AFU IT)" - SCRIPT INFOS - WITH / WITHOUT CITRUS */
  .width-constraint #script-info > #script-links li a:not([href]) {
      display: inline-block !important;
      vertical-align: middle;
      height: 1.5vh  !important;
      line-height: 1.0vh !important;
      margin: 0px 0 0 0 !important;
      padding: 2px;
      font-size: 17px !important;
      cursor: pointer;
      align-items: center;
      border-radius: 100% !important;
  background: #111 !important;

  }
  .width-constraint #script-info > #script-links li a:not([href]):not([style*="color: #E09015;"]) {
      color: white !important;
  }

  /* (new248) TEST - GM "Greasy Fork Bookmark (AFU IT)" SCRIPT LIST - NO CITRUS */

  #browse-script-list > li h2:has(span:not(.note-obj-user-tag)[style="margin-left: 10px; cursor: pointer; display: inline-flex; align-items: center; vertical-align: middle; color: white;"]) a {
      display: inline-block !important;
      padding: 0vh 0 0 35px !important;
      margin: 0vh 0 0 -10px !important;
      font-size: 18px;
  /*border: 1px solid aqua  !important;*/
  }
  #browse-script-list > li h2 span:not(.note-obj-user-tag)[style="margin-left: 10px; cursor: pointer; display: inline-flex; align-items: center; vertical-align: middle; color: white;"] {
      display: block !important;
      float: left !important;
      width: 15px  !important;
      height: 1.5vh  !important;
      line-height: 1.0vh !important;
      margin: -2vh 0 0 2px !important;
      padding: 2px;
      font-size: 17px !important;
      cursor: pointer;
      align-items: center;
      border-radius: 100% !important;
  background: #111 !important;

  }




  /* MY SCRIPT LIST - CITRUS - NOT TAGGED */
  /* TAGGED - #script-table tbody td:nth-child(2) .thetitle > a > b */
  [pagetype="PersonalProfile"] .thetitle > a + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      width: 15px !important;
      height: 15px !important;
      line-height: 2.2vh !important;
      margin: 0vh 0 0px 0px !important;
      opacity: 1 !important;
      translate: none !important;
      transition: none  !important;
  /*border: 1px solid aqua  !important;*/
  }
  [pagetype="PersonalProfile"] .thetitle > a + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li  {
      width: 15px !important;
      height: 15px !important;
      margin: -0.4vh 0 0px 0px !important;
      opacity: 1 !important;
      translate: none !important;
      transition: none  !important;
  /*border: 1px solid aqua  !important;*/
  }
  /* HOVER */
  [pagetype="PersonalProfile"] .thetitle > a + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li  {
      width: 15px !important;
      height: 15px !important;
      margin: -0.4vh 0 0px 0px !important;
      opacity: 1 !important;
      translate: none !important;
      transition: none  !important;
  /*border: 1px solid aqua  !important;*/
  }


  [pagetype="PersonalProfile"] .thetitle > a + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li button {
      width: 15px !important;
      height: 15px !important;
      margin: 0vh 0 0px 0x !important;
      opacity: 1 !important;
      translate: none !important;
      transition: none  !important;
  /*border: 1px solid aqua  !important;*/
  }
  /* HOVER */
  [pagetype="PersonalProfile"] .thetitle > a + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li button ,
  [pagetype="PersonalProfile"] .thetitle > a + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li button svg {
      width: 15px !important;
      height: 15px !important;
      margin: -2vh 0px 0px 0x !important;
      left: 0px  !important;
      padding: 0 !important;
      font-size: 15px  !important;
      opacity: 1 !important;
      translate: 0px 0px !important;
      transition: none  !important;
  /*border: 1px solid aqua  !important;*/
  }
  /* (new246) TEST - GM "Greasy Fork ++ */
  iframe#greasyfork-plus {
      position: fixed;
      display: block;
      width: 35% !important;
      max-width: 35% !important;
      height: 75%;
      left: 35% !important;
      margin: 0px;
      max-height: 95%;
      padding: 5px !important;
      overflow: auto;
      opacity: 1;
      z-index: 500000 !important;
  inset: 117px auto auto 242px !important;
  background: brown !important;
  border: 1px solid rgb(0, 0, 0);
  }

  #greasyfork-plus {
      background: white !important;
  }
  body > #greasyfork-plus_wrapper:only-child {
      width: 97.5% !important;
      max-width: 97.5% !important;
      max-height: calc(100vh - 72px);
      padding: 0px 0px 0 0 !important;
      overflow: auto;
      scrollbar-gutter: both-edges;
  background: #222 !important;
  border: 1px solid rgba(127, 127, 127, 0.5);
  }
  #greasyfork-plus .field_label[class] b {
      color: gold !important;
  }
  /* (new223) TEST - GM GREASY - USER LSIT:
  https://greasyfork.org/en/users
  === */
  #browse-user-list {
      display: inline-block !important;
      width: 100% !important;
      left: 0px !important;
      padding: 5px !important;
      border-radius: 5px;
  background: #111 !important;
  }
  #user-list-option-groups.list-option-groups {
      width: 190px !important;
  }

  /* [A VOIR] (new219) TEST - GM "Greasy Fork User Statistics+" by NoyYou (2022)  */
  #user-statistics {
      position: fixed !important;
      width: 250px !important;
      left: 12px !important;
      padding: 5px !important;
      border-radius: 5px;
  background: #111 !important;
  }

  /* (new247) GRASYFORK - NOTIFICATIONS PAGES */
  .notification-list {
      box-shadow: 0 0 5px #ddd;
      background-color: #111 !important;
      border: 1px solid #BBBBBB;
  }
  .notification-list .notification-list-item {
    padding-top: 10px;
  border-top: 1px solid #CCC; 
  }

  /* NOTIFS - READ */
  .notification-list .notification-list-item.notification-read {
      margin: 0 0 0 0 !important;
      padding: 0 0 0 5px !important;
  background-color: #f5f5f5;
  }
  /* NOTIFS - NOT READ */
  .notification-list .notification-list-item.notification-not-read  {
      width: 100% !important;
      margin: 0 -3px 0 -5px !important;
      padding: 0 0 0 10px !important;
  border-left: 4px solid red !important;
  }

  /* ZEBRA */
  .notification-list .notification-list-item:nth-child(odd) {
      background: #111 !important;
  }
  .notification-list .notification-list-item:nth-child(even) {
      background: #222 !important;
  }

  /* (new219) USERSTYLES.ORG - TOP HEADER NEW */
  #header {
      position: fixed;
      align-items: center;
      display: flex;
      height: 48px;
      justify-content: space-between;
      top: 0;
      width: 100%;
      z-index: 50000000 !important;
  background-color: #323232;
  border-bottom: 1px solid red !important;
  }
  .us-header .right {
      position: absolute;
      display: inline-block;
      width: 33vw;
      right: 0;
      top: 0.5vh !important;
  }
  .us-header .right #create_new_style,
  .us-header .right > div {
      float: right !important;
      min-width: 25% !important;
      min-height: 20px !important;
      line-height: 20px !important;
      margin: 0 4px 0 0 !important;
      padding: 0 5px 0 25px !important;
      border-radius: 5px !important;
      text-align: center !important;
  }

  .header-search .type_search {
      display: flex;
      height: 21px !important;
      background: #222 !important;
  }
  .header-search .type_search .type_search_select .type_search_option,
  .header-search .type_search .type_search_text {
      height: 20px;
      line-height: 20px;
      padding: 0px 0px 0px !important;
  color: gold !important;
  }

  .header-search .type_search .type_search_select {
      position: absolute !important;
      display: inline-block;
      flex-direction: column;
      width: 155px;
      left: 0;
      top: 0;
      border-radius: 5px !important;
      z-index: 50000000 !important;

  }

  /* (new255) FORUM - ADD COM - TOOLBAR GM "Markdown toolbar for GreasyFork" */
  #post-reply form[enctype="multipart/form-data"] ,
  form#new-script-discussion {
      display: inline-block;
      width: 100% !important;
      min-width: 98% !important;
      max-width: 98% !important;
      padding: 4px 6px;
  background: #111 !important;    
  }
  span.label-note.markup-options a.Button{
    display: inline-block;
    cursor: pointer;
    margin: 0px;
    font-size: 12px;
    line-height: 1;
    font-weight: bold;
    padding: 4px 6px;
    background: -moz-linear-gradient(center bottom , #CCC 0%, #FAFAFA 100%) repeat scroll 0% 0% #F8F8F8;
    border: 1px solid #999;
    border-radius: 2px;
    white-space: nowrap;
    text-shadow: 0px 1px 0px #000;
    box-shadow: 0px 1px 0px #0d0d0d inset, 0px -1px 2px #e60f0f inset;
    color: #333;
  }

  /* (new246) SUPPORT GM "Markdown toolbar for GreasyFork" by 人民的勤务员  :not(:hover)*/
  a[target="markup_choice"][href="http://daringfireball.net/projects/markdown/basics"]:after {
      background: #111 !important;
      border: 1px solid gray;
      border-radius: 4px;
      color: white;
      content: "▶.";
      /*position: fixed !important;*/
      position: absolute !important;
      display: inline-block !important;
      width: 17px !important;
      height: 17px !important;
      margin: 0 0 0 20px !important;
      padding: 0 !important;
      opacity: 1 !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      transition: height 0.3s ease 0s;
      visibility: visible;
      white-space: pre-line;
      text-align: left;
      z-index: 5000000000 !important;
  }
  a[target="markup_choice"][href="http://daringfireball.net/projects/markdown/basics"]:hover:after {
      content: "▶ New line: \\a Majuscule + Entrer \\a\\a  ▶▶ Quick reference guide Markdown syntax. \\a \\a ▶ HEADERS with ( # ): \\a # Level one header # \\a ### Level three header ### \\a Headers continue as you’d imagine, with extra hashes. \\a \\a ▶ LINKS WITH TEXT ( [ ...] ): \\a [This is a link](http://www.darkcoding.net) \\a \\a ▶ BLOCKQUOTE with ( > ) AND SPACE \\a  Multi by adding other ( > ): \\a > This is quoted. \\a \\a ▶ CODE : \\a - Use 3 backticks (\`\`\`) \\a  - Put css to select language for syntax highlighting \\a - Need to Indent Code at least 4 spaces for all formatting in it to be ignored. \\a # This isn\\'t displayed as header, because it is indented 4 spaces \\a Or CODE INLINE: \\a Inline code is \`escaped\` with backticks (\`) \\a \\a ▶ LISTS \\a \\a ▶ UNORDERED LISTS : with *, + or - : \\a * This \\a * is \\a * a list \\a \\a ▶ ORDERED LISTS : with number followed by period (.) \\a 1. with \\a 1. numbers \\a \\a ▶ HORIZONTAL LINES with ( - ) : \\a Three or more dashes ( - ) ---- \\a \\a ▶ Emphasis \\a ITALIC with a single underscore ( _ )or ONE asterix ( * ) , BOLD with TWO ( * ) : \\a _italic_ or *italic* \\a __bold__ or **bold** \\a \\a ▶ ESCAPING : \\a If you don’t want some of these rules to apply, \\a they can be escaped \\a by preceding the special character with a backslash ( / ): \\a This is /*/*not/*/* in bold.";
      /*position: fixed !important;*/
      position: absolute !important;
      display: inline-block !important;
      width: 330px !important;
      height: 45vh !important;
      margin: 0 0 0 20px !important;
      padding: 16px 16px 32px 16px !important;
      border-radius: 4px;
      opacity: 1 !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      transition: height 0.7s ease 0s;
      visibility: visible;
      white-space: pre-line;
      text-align: left;
      z-index: 5000000000 !important;
  color: white;
  background: #111 !important;
  border: 4px solid gray;
  }

  /* HTML CHOICE */
  .mdButton {
      display: inline-block;
      cursor: pointer;
      margin: 0px;
      font-size: 12px;
      line-height: 1;
      font-weight: bold;
      padding: 4px 6px;
      background: -moz-linear-gradient(center bottom, #CCC 0%, #FAFAFA 100%) repeat scroll 0% 0% #F8F8F8;
      border: 1px solid #999;
      border-radius: 2px;
      white-space: nowrap;
  text-shadow: 0px 1px 0px #9b6868;
  box-shadow: 0px 1px 0px #111 inset, 0px -1px 2px #222 inset;
  color: #333;
  }


  /* (new214) TEST - GM "Greasy Fork Display User Information" */
  .width-constraint #about-user.text-content.reportable #user-information::before,
  .width-constraint #about-user.text-content.reportable #user-information::before,
  body[pagetype="UserProfile"] .width-constraint #about-user.text-content.reportable #user-information::before,
  body[pagetype="PersonalProfile"] .width-constraint #about-user.text-content.reportable #user-information::before {
      content: "ID ▼";
      position: absolute;
      height: 23px;
      width: 45px;
      top: 0px;
      left: 0;
      white-space: normal;
      font-size: 15px;
      text-align: center;
      z-index: 500;
  color: red;
  background: green;
  border: 1px solid red;
  }
  .width-constraint #about-user.text-content.reportable #user-information,
  .width-constraint #about-user.text-content.reportable #user-information,
  body[pagetype="UserProfile"] .width-constraint #about-user.text-content.reportable #user-information,
  body[pagetype="PersonalProfile"] .width-constraint #about-user.text-content.reportable #user-information {
      left: 55%;
      position: fixed;
      display: inline-block;
      font-size: 0;
      height: 25px;
      margin-top: 0;
      overflow: hidden;
      padding: 0;
      transition: height 0.7s ease 0s;
      width: 47px;
      top: 62px;
      z-index: 5000;
  }
  .width-constraint #about-user.text-content.reportable #user-information:hover,
  .width-constraint #about-user.text-content.reportable #user-information:hover,
  body[pagetype="UserProfile"] .width-constraint #about-user.text-content.reportable #user-information:hover,
  body[pagetype="PersonalProfile"] .width-constraint #about-user.text-content.reportable #user-information:hover {
      width: 300px;
      height: auto;
      margin-top: 0;
      font-size: 15px;
      overflow: hidden;
      transition: height 0.7s ease 0s;
  box-shadow: 7px 7px 3px 1px rgba(0, 0, 0, 0.9);
  background: black none repeat scroll 0 0;
  border: 1px solid red;
  }
  .width-constraint #about-user.text-content.reportable #user-information:hover #user-information-card,
  .width-constraint #about-user.text-content.reportable #user-information:hover #user-information-card,
  body[pagetype="UserProfile"] .width-constraint #about-user.text-content.reportable #user-information:hover #user-information-card,
  body[pagetype="PersonalProfile"] .width-constraint #about-user.text-content.reportable #user-information:hover #user-information-card {
      display: grid;
      grid-template-columns: auto auto auto;
      width: 300px !important;
      padding: 6px;
      text-align: center;
      border-radius: 4px;
  color: rgb(255, 255, 255);
  background: rgb(47, 47, 47) none repeat scroll 0 0;
  }
  /* (new255) TEST - GM "Greasyfork 快捷编辑收藏" - "Greasyfork Modification rapide des favoris" */
  #script-favorite {
      display: inline-block !important;
      margin: 0.2em 0 0.2em 0!important;
  }
  #script-favorite select#favorite-groups {
      display: inline-block !important;
      height: 22px !important;
      width: 100% !important;
      min-width: 18vw !important;
      max-width: 18vw !important;
      pointer-events: all !important;
      filter: grayscale(0) brightness(1) !important;
      opacity: 1 !important;
  }
  #script-favorite [style*="pointer-events: none;"],
  a[id="favorite-add"] {
      display: inline-block !important;
      margin: 0px 0.5em;
      filter: grayscale(0) brightness(1) !important;
      opacity: 1 !important;
      pointer-events: all !important;
  }

  /* (new232) TEST GM "INSTALL from USo (uso.kkx.one)" 
  GM "USO - add USOa button on userstyle page"
  == */
  /* NO PRO */
  #install_stylish_style_button + style + #USOa.customize_style_button.customize_style_button.NOuninstall_stylish_style_button {
      position: fixed !important;
      display: inline-block !important;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 21px !important;
      margin-left: 0vw !important;
      top: 65.3vh !important;
      left: 25% !important;
      font-size: 15px;
      font-weight: bold;
      color: white;
      cursor: pointer;
      border-radius: 5px !important;
  box-shadow: none !important;
  background-color: #3498db;
  border: 1px solid red !important;
  }
  #install_stylish_style_button + style + #USOa.customize_style_button.customize_style_button.NOuninstall_stylish_style_button a.oocustomize_button_text {
      display: inline-block !important;
      line-height: 23px !important;
      word-spacing: 1px !important;
      letter-spacing: 1px !important;
  }
  #install_stylish_style_button + style + #USOa.customize_style_button.customize_style_button.NOuninstall_stylish_style_button a.oocustomize_button_text span {
      display: inline-block !important;
      width: 180px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      font-size: 0 !important;
  }
  #install_stylish_style_button + style + #USOa.customize_style_button.customize_style_button.NOuninstall_stylish_style_button a.oocustomize_button_text span:before {
      content: "Install From Uso Archive" !important;
      display: inline-block !important;
      width: 180px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      font-size: 12px !important;
  }
  #install_stylish_style_button + style + #USOa.customize_style_button.customize_style_button.NOuninstall_stylish_style_button a.oocustomize_button_text br {
      display: none!important;
  }
  /* (new231) PRO - AGAINST "PRO" USERSTYLES */
  .upgradeButton {
      margin: 0 0 0 36px !important;
      pointer-events: none !important;
  }
  .upgradeButton + style + #USOa {
      position: absolute !important;
      top: 0.1vh !important;
      left: 54% !important;
      padding: 0 3px !important;
  background: #111 !important;
  }
  .upgradeButton + style + #USOa.customize_style_button.NOuninstall_stylish_style_button a.oocustomize_button_text {
      font-size: 10px !important;
      line-height: 10px !important;
  color: white !important;
  }
  .upgradeButton + style + #USOa.customize_style_button.NOuninstall_stylish_style_button:hover {
      font-size: 10px !important;
      line-height: 10px !important;
      padding: 5px !important;
      border-radius: 5px !important;
      transform: scale(1.5) !important;
      z-index: 500 !important;
  }
  .upgradeButton span.crown {
      position: relative !important;
      display: inline-block !important;
      flex-direction: unset !important;
      justify-content: unset !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      width: 100% !important;
      min-width: 20px !important;
      max-width: 20px !important;
      align-items: unset !important;
      /*     border: 2px solid #7e5dff; */
      border: none !important;
      border-radius: 0px;
      box-sizing: border-box;
      /*     filter: drop-shadow(0px 0 8px rgba(0, 0, 0, 0.08)) !important; */
      filter: none !important;
      transform: scale(0.6) !important;
      opacity: 0.6 !important;
  }
  .upgradeButton .crown:after {
      content: "Install it with \\A Gm 'INSTALL from USo'" !important;
      display: inline-block !important;
      position: absolute !important;
      width: 100px !important;
      margin: -4px 0 0 5px !important;
      font-size: 16px !important;
      white-space: pre !important;
  }
  .upgradeButton .crown:before {
      content: "PRO" !important;
      display: inline-block !important;
      position: absolute !important;
      width: 30px !important;
      margin: 0px 0 0 -50px !important;
      padding: 2px 5px !important;
      border-radius: 3px !important;
      font-size: 16px !important;
  color: white !important;
  background: red !important;
  }
  .upgradeButton .crown svg {
      fill: peru !important;
      stroke: red !important;
  }
  .premium-container {
      align-items: center;
      display: flex;
      height: 10px !important;
  }
  .premium-container .us-premium {
      display: flex;
      flex-direction: row;
      height: 10px !important;
      line-height: 10px !important;
      width: 55px !important;
      left: 55px;
      margin: 2px 0 0 -4px !important;
      padding: 2px 5px 2px 3px !important;
      font-size: 7px !important;
      z-index: 2;
      opacity: 0.6 !important;
  background-color: rgba(122, 89, 247, 0.37) !important;
  }
  #USOa > div {
      font-size: 13px !important;
  }

  /* ANNOUCEMENT */
  .announcement {
      position: fixed;
      width: 200px;
      bottom: 0;
      left: 11%;
      padding: 5px;
      border-radius: 3px;
      background: black;
  }

  #jslghtbx + iframe {
      display: none !important;
  }

  /* (new205) TEST - GREASYFOK - LIBRAY INSTAL LOADED CODE EMPTY 
  TEST LINK: https://greasyfork.org/fr/scripts/5679-wait-for-elements
  when test loading:
  https://greasyfork.org/scripts/5679-wait-for-elements/code/script.user.js#bypass=true
  ==== */
  body > pre:empty {
      max-width: 98% !important;
      margin-left: 0px;
      padding: 5px 10px;
      text-align: center !important;
  background-color: red !important;
  }
  body > pre:empty:after {
      content: "Error Loading" !important;
      width: auto !important;
      margin-left: 0px;
      padding: 5px 10px;
  background-color: blue !important;
  }

  /* (new202) USERTYLES NEW DESIGN 2021.12 */
  #style-top-upvotes-wrapper {
      color: peru !important;
  }
  /* (new216) INSTALL BUT */
  #top-buttons .left {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 20px;
      line-height: 15px !important;
      margin-right: 0px !important;
      font-size: 12px !important;
      border-radius: 24px 0 0 24px !important;
  border: 1px solid peru !important;
  }
  /* FOR ME and OTHERS */
  .install_style_button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100% !important;
      height: 20px;
      line-height: 15px !important;
      margin-right: 0px !important;
      font-size: 12px !important;
      border-radius: 24px 0 0 24px !important;
  border: 1px solid peru !important;
  }


  #install_stylish_style_button > div:last-of-type,
  #top-buttons .left,
  #install_style_button,
  .install_style_button {
      line-height: 15px !important;
      font-size: 12px !important;
  }

  /* #install_stylish_style_button>div:last-of-type */
  /* (new233) CUSTOMIZE BUTTON */
  .customize_style_button {
      display: inline-block !important;
      align-items: center;
      justify-content: center;
      height: 18px !important;
      line-height: 18px !important;
      margin-right: 0px !important;
      padding: 0 2px !important;
      font-size: 12px !important;
      border-radius: 0 0 0 0 !important;
  border: 1px solid peru !important;
  }
  #USOa.customize_style_button > a > span {
      display: inline-block !important;
  color: red !important;
  }
  #USOa.customize_style_button > a > span > br {
      display: none !important;
  }

  .customize_style_button .settingsIcon {
      width: 13px !important;
      margin-right: 4px !important;
      border-radius: 100%;
  background: #807979 !important;
  }
  .customize_style_button .customize_button_text.no-select {
      font-size: 13px !important;
      font-weight: normal;
      line-height: 19px;
  }
  /* THUMB UP - ALL */
  #style-top-upvotes-wrapper .like-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25px !important;
      height: 20px;
      margin-left: -3px !important;
      border-radius: 0 24px 24px 0 !important;
  border: 1px solid peru !important;
  }

  #style-top-upvotes-wrapper .like-button.regular-button {
      background: #111 !important;
      border: 1px solid peru !important;
  }
  #style-top-upvotes-wrapper .like-image {
      height: 15px !important;
      width: 15px !important;
  }

  .arrow-icon,
  .comment-content .top img.more-actions,
  #style-top-upvotes-wrapper img:not([src="/ui/images/icons/like-white.svg"]) {
      filter: invert(15%) sepia(100%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
  }
  #style-top-upvotes-wrapper.can-vote:hover .button-wrapper {
      display: inline-block !important;
  }
  #style-top-upvotes-wrapper:hover .like-hover {
      display: none !important;
  }
  #style-top-upvotes-wrapper .style-count {
      display: none !important;
  }

  .comment-content .more-actions-wrapper .more-actions-list {
      display: flex;
      flex-direction: column;
      position: absolute;
      right: 0;
      top: 15px;
      padding: 2px 5px !important;
      border-radius: 3px !important;
      z-index: 100 !important;
  background-color: #111 !important;
  }
  #top-buttons {
      position: absolute;
      align-items: unset;
      display: inline-block !important;
      justify-content: unset;
      width: 18vw !important;
      margin: 0;
      top: 4.8vh !important;
      left: 30.4% !important;
      margin-right: 0px !important;
      padding: 0 2px !important;
      z-index: 1 !important;
  }
  #top-buttons .left {
      align-items: center;
      display: flex;
      justify-content: flex-start;
  }
  #top-buttons .left #install_button {
      top: 1px !important;
  }
  #top-buttons .right {
      position: absolute;
      margin: 0;
      top: 0px !important;
      left: 100% !important;
      z-index: 1 !important;
  }

  /* (new219) USERTYLES - LISTE */
  .us-stylecard--short {
      display: inline-block;
      box-sizing: border-box;
      height: 294px;
      width: 280px;
      padding: 0px !important;
      overflow: hidden;
      transition: all 0.2s ease 0s;
      border-radius: 4px;
  box-shadow: none !important;
  background-color: transparent !important;
  border: 1px solid red !important;
  }
  .us-stylecard--short > a .us-stencil {
      min-width: 277px !important;
      max-width: 277px !important;
      padding: 0px !important;
  border: 1px solid red !important;
  }
  .us-stylecard--short .us-container {
      box-sizing: border-box;
      width: 100%;
      padding: 5px 0 0 5px;
      overflow: hidden;
      border-radius: 4px;
  background-color: #222 !important;
  }

  /* (new223) LIGHTBOX */
  .lum-lightbox {
      z-index: 5000000 !important;
  }

  /* DISC HEIGHT HOV - == */
  .discussion-list-container .discussion-list-item:not(.filtered) {
      height: auto !important;
      overflow-y: auto;
  }
  .discussion-list-container .discussion-list-item:not(.filtered) .rating-icon {
      float: left;
  }
  .discussion-list-container .discussion-list-item:not(.filtered) .discussion-snippet {
      display: inline-block !important;
      height: 100% !important;
      min-height: 35px !important;
      max-height: 35px !important;
      line-height: 18px !important;
      width: 100% !important;
      margin-top: -5px !important;
      overflow: hidden;
      mask-image: linear-gradient(to top, transparent 5%, black 70%);
  border-right: 1px solid yellow !important;
  }
  .discussion-list-container .discussion-list-item:not(.filtered) .rating-icon + .discussion-snippet {
      width: 98.2% !important;
  border-right: 1px solid aqua !important;
  }
  .discussion-list-container .discussion-list-item:not(.filtered) .discussion-snippet:last-of-type:hover {
      max-height: 100% !important;
      mask-image: linear-gradient(180deg, #000 100%, transparent);
  border-right: 1px solid red !important;
  }

  /* DISC READ */
  .discussion-list-container a.discussion-title {
      height: auto;
      padding: 5px;
  border: 1px solid #222;
  }
  .discussion-list-logged-in .discussion-list-container.discussion-read {
      background-color: #222;
  }
  .discussion-list-logged-in .discussion-read {
      background-color: #222;
  }
  .discussion-list-logged-in .discussion-read a.discussion-title {
      background-color: black;
      border: 1px solid #222;
  }
  .discussion-list-logged-in .discussion-not-read a.discussion-title {
      border: 1px solid #333;
  }

  /* GREASY RE EDIT COM PAGE */
  #vanilla_post_editcomment #Content {
      width: 99%;
      float: none;
      margin: -30px 0 0 -5px;
      padding: 5px;
      text-align: center !important;
  }
  #vanilla_post_editcomment #Content .FormWrapper > form {
      margin-left: 0px;
  }

  /* (new333 !important;) "SuperPreLoader Plus " -  "SupPreloader" */
  #sp-fw-container {
      text-align: left;
      z-index: 5000000 !important;
  }
  #sp-fw-container:not(:hover) {
      visibility: hidden;
  }
  #sp-fw-rect:not(:hover) {
      visibility: visible;
  }
  /* SUPER LOADER - ALL */
  .sp-separator {
      float: left !important;
      width: 39%;
      left: 33% !important;
      margin-bottom: 0px;
      margin-top: 0px;
      filter: invert(1);
      z-index: 10 !important;
  }
  /* SUPER LOADER - DISC */
  .sp-separator ~ .width-constraint .sidebarred .discussion-list {
      margin-top: 0px !important;
  }
  .discussion-list + .sp-separator {
      width: 59%;
      left: 23% !important;
      margin-bottom: -42px !important;
      margin-top: 5px;
  }

  /* WITHOUT CITRUS */
  .script-list .sp-separator {
      width: 49%;
      left: 25%;
      margin-bottom: 0px;
      margin-top: 0px;
  }
  .Vanilla.Discussions #sp-fw-container + .sp-separator span,
  .Vanilla.Discussions #sp-fw-container + .sp-separator a.sp-sp-nextlink > span,
  .Vanilla.Discussions #sp-fw-container + .sp-separator a.sp-sp-nextlink,

  #sp-fw-container + .sp-separator span,
  #sp-fw-container + .sp-separator a.sp-sp-nextlink > span,
  #sp-fw-container + .sp-separator a.sp-sp-nextlink {
      text-shadow: none !important;
      color: peru;
  }
  /* !important; */
  .Vanilla.Discussions .sp-separator {
      width: 38%;
      left: 36% !important;
  }

  /* "SUPP" - SRIPT PAG - COM */
  #sp-fw-container + .sp-separator ~ .width-constraint #script-info ul#script-links + header + #script-content > p:not(:empty):not(#no-discussions):not(#support-url):not(#contribution),
  #sp-fw-container + .sp-separator ~ .width-constraint #script-info > #script-content > p#support-url,
  #sp-fw-container + .sp-separator ~ .width-constraint #contribution,
  #sp-fw-container + .sp-separator ~ .width-constraint #discussions + .pagination + p,
  #sp-fw-container + .sp-separator ~ .width-constraint #feedback-favoriters + div + p + form,
  #sp-fw-container + .sp-separator ~ .width-constraint #feedback-favoriters + div + p,
  #sp-fw-container + .sp-separator ~ .width-constraint #feedback-favoriters + div,
  #sp-fw-container + .sp-separator ~ .width-constraint #feedback-favoriters {
      display: none;
      visibility: hidden;
  }
  #sp-fw-container + .sp-separator ~ .width-constraint #script-info > #script-content {
      margin-top: 35px;
  }

  /* GREAS - BAN BADGE */
  .badge-banned {
      float: left;
      margin-right: -16%;
      margin-left: 19%;
  }
  /* NEW FORUM DESIGN */
  .width-constraint #discussions li[class^="discussion-"] {
      margin-bottom: 5px;
      font-size: 15px;
  border: 1px solid red;
  }
  .width-constraint #discussions li[class^="discussion-"] > a[href*="/scripts/"]:first-of-type::before {
      content: "X";
      display: inline-block;
      position: relative;
      height: 18px;
      line-height: 18px;
      width: 18px;
      margin-left: -8px;
      top: 0px;
  color: transparent;
  background: transparent url("http://userscripts-mirror.org/images/script_icon.png") no-repeat scroll 1px 1px;
  }
  .width-constraint #discussions li[class^="discussion-"] > a:nth-child(2) {
      display: inline-block;
      position: relative;
      width: 98%;
      margin-left: 10px;
      top: -20px;
  }
  .width-constraint #discussions li[class^="discussion-"] > time:first-of-type,
  .width-constraint #discussions li[class^="discussion-"] > time:last-of-type {
      display: inline-block;
      text-align: center;
      white-space: nowrap;
      width: 125px;
      margin: 0px;
  }
  /* PREVIEW LINK */
  .DiscussionAboutShowDiscussion > a[href^="/discussions/preview-"] {
      position: absolute;
      max-width: 55px;
      min-width: 55px;
      line-height: 15px;
      min-height: 15px;
      max-height: 15px;
      top: 0;
      right: 5px;
      padding: 0px 5px;
      text-align: right;
      transition: all ease 0.7s;
  color: white;
  background: gold;
  }
  .DiscussionAboutShowDiscussion > a[href^="/discussions/preview-"]:hover {
      max-width: 195px;
      min-width: 195px;
      transition: all ease 0.7s;
  color: green;
  background: gold;
  }
  .DiscussionAboutShowDiscussion > a[href^="/discussions/preview-"]:hover:before {
      content: "New Forum: ";
  }
  /* (new254) IMAGES - VOIR TEXT OVERFLOW */
  #additional-info.user-content > p:not(:empty) {
      position: relative !important;
      display: inline-block !important;
      margin: auto !important;
      min-width: 920px;
      max-width: 920px;
      text-align: left !important;
  /*border: 1px solid aqua*/
  }
  #additional-info.user-content > p > img {
      margin-top: 20px !important;
      margin-bottom: 20px !important;
      max-width: 920px;
  border: 1px solid red;
  }

  /* (new254) TEXT OVERFLOW GRAS - COLOR GOLD */
  #additional-info.user-content > p > b {
      position: relative !important;
      margin: 0 !important;
      max-width: 920px;
      text-align: left !important;
      overflow: hidden!important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
  color: gray !important;
  }

  /* PERMLINK ? */
  #comment- .comment-meta-item a.self-link,
  #comment- .comment-meta-item a.self-link:visited {
      opacity: 0.5;
  color: gold;
  background: red;
  }

  /* PERMLINK - IN DISC */
  .comment {
      margin-bottom: 10px;
  }
  .comment-meta {
      background: #333;
  }
  .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item,
  #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item {
      display: inline-block;
      height: 15px;
      line-height: 15px;
      margin: 0px 0 0 20px !important;
      padding: 1px 2px;
      border-radius: 5px;
      border: 1px solid gray;
  }
  .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item a.self-link,
  #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item a.self-link {
      opacity: 1 !important;
  color: white !important;
  }


  .comment-meta-item.comment-meta-item-main + .comment-meta-item + .comment-meta-item,
  #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item + .comment-meta-item {
      position: relative;
      display: inline-block !important;
      font-size: 15px !important;
      visibility: visible !important;
      opacity: 1 !important;
  }


  /* PERMLINK - ARROW */
  .comment-meta-item.comment-meta-item-main + .comment-meta-item:before,
  #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      margin-top: -25px;
      margin-left: 0%;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease 0s;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #ffcb66;
  }
  .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover:before,
  #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover:before {
      margin-top: -10px !important;
      opacity: 1 !important;
      visibility: visible !important;
  }
  /* (new229) TXT PERMALINK */
  .comment-meta-item.comment-meta-item-main + .comment-meta-item + .comment-meta-item:after,
  #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item + .comment-meta-item:after {
      content: "Permalink";
      position: absolute;
      height: 10px;
      line-height: 8px;
      bottom: 152%;
      left: -27.5%;
      padding: 2px 5px;
      border-radius: 5px;
      white-space: nowrap;
      transition: all 0.4s ease 0s;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
  color: black;
  background: #ffcb66;
  }
  .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after,
  .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:before,
  #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after,
  #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:before {
      opacity: 1;
      visibility: visible;
  }
  .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after,
  #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after {
      bottom: 158%;
  }
  /* (new255) NEW FORUM - SCRIPT INFO */
  #script-info ul#script-links + header + #script-content .script-discussion-list {
      margin-top: 10px;
      padding: 0px 20px;
  }
  .width-constraint #script-info > ul#script-links + header + #script-content > div + h3:not([id="feedback-favoriters"]) + .script-discussion-list {
      margin: 60px 0 0px 0;
      padding: 0px 20px;
  }
  .width-constraint #script-info > ul#script-links + header + #script-content > div + h3:not([id="feedback-favoriters"]) + .script-discussion-list .discussion-list-item {
      padding-top: 10px;
  border-left: 3px solid peru;
  border-right: 3px solid peru;
  background: #333;
  }
  #script-info #discussions li[class^="discussion-"] > a[href*="/users/"]:nth-child(2) {
      position: relative;
      display: inline-block;
      width: auto;
      margin-left: 30px;
      top: 0px;
  }
  #script-info #discussions li[class^="discussion-"] > time:first-of-type,
  #script-info #discussions li[class^="discussion-"] > time:last-of-type {
      position: relative;
      display: inline-block;
      margin-top: -40px;
      text-align: center;
      white-space: nowrap;
      font-size: 12px;
  }
  .discussion-header {
      margin-bottom: 5px;
      margin-top: 5px;
  border-bottom: 1px solid red;
  }
  .comment,
  #script-info #script-content .comment {
      padding: 5px;
  border-left: 3px solid peru;
  border-right: 3px solid peru;
  }
  .comment .user-content,
  #script-info #script-content .comment .comment-meta + .user-content {
      padding: 5px;
  border: 1px solid #333;
  background: #222;
  }
  .comment .user-content pre,
  #script-info #script-content .comment .comment-meta + .user-content pre {
      padding: 5px;
  border: 1px solid #333;
  background: #333;
  }
  .comment-meta-item.comment-meta-item-main a {
      display: inline-block !important;
      text-align: left;
      white-space: nowrap !important;
  }




  /* (new255) FORUM - ADD COM */
  .width-constraint #script-info > #script-content > ul#discussions + h3:not([id="feedback-favoriters"]) {
      position: relative;
      display: inline-block;
      width: 100%;
      max-width: 99%;
      min-width: 99%;
      margin-top: 0px;
      margin-bottom: 0px;
  }
  .width-constraint #script-info > #script-content > ul#discussions + h3:not([id="feedback-favoriters"]) + p:not(:empty) {
      position: relative;
      display: inline-block;
      width: 99%;
      margin-top: -30px;
  border: 1px dotted yellow;
  }
  .width-constraint #script-info > #script-content > ul#discussions + h3:not([id="feedback-favoriters"]) + p + form:not([action*="/script_sets/add_to_set"]) {
      position: relative;
      display: inline-block;
      height: 100%;
      min-height: 400px;
      max-height: 100%;
      width: 98%;
      padding: 5px;
  border: 1px solid tomato;
  }

  /* NEW FORUM - ADD FAV */
  .width-constraint #script-info > #script-content > ul#discussions + h3:not([id="feedback-favoriters"]) + p + form + h3#feedback-favoriters {
      position: relative;
      display: inline-block;
      width: 98%;
      margin: 0px;
  border: 1px dotted aqua;
  }
  .width-constraint #script-info > #script-content > ul#discussions + h3:not([id="feedback-favoriters"]) + p + form + h3#feedback-favoriters + div {
      position: relative;
      display: inline-block;
      margin-top: -20px;
  border: 1px dotted aqua;
  }
  .width-constraint #script-info > #script-content > ul#discussions + h3:not([id="feedback-favoriters"]) + p + form + h3#feedback-favoriters + div + p:not(:empty) {
      margin: 0;
  }
  .width-constraint #script-info > #script-content > ul#discussions + h3:not([id="feedback-favoriters"]) + p + form + h3#feedback-favoriters + div + p:empty,
  .width-constraint #script-info > #script-content > ul#discussions + h3:not([id="feedback-favoriters"]) + p + form + h3#feedback-favoriters + div + p + form + p:empty {
      height: 0;
      margin: 0;
      border-radius: 4px;
      padding: 0px;
      text-align: center;
  background-color: red;
  }

  /* END - NEW FORUM  ===== */
  /* (new211) CREATE - ERROR PAGE */
  .PageContent > form[enctype="multipart/form-data"][action="/styles/create"] {
      width: 1333px !important;
      height: 90vh !important;
      margin-left: 356px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  .PageContent > form[enctype="multipart/form-data"][action="/styles/create"] .errorExplanation {
      position: fixed !important;
      width: 346px !important;
      top: 26% !important;
      left: 0 !important;
      padding: 5px !important;
      color: white !important;
      background-color: #f88;
  }
  /* USERST  EDIT CODE - ERROR MESS */
  .PageContent > form[action="/styles/update"] .errorExplanation {
      position: absolute;
      width: 16%;
      left: 14px;
  background-color: white;
  }
  .PageContent > form[action="/styles/update"] .errorExplanation ~ .form-controls textarea[id="css"] {
      max-width: 900px;
      min-width: 800px;
      min-height: 187px;
      margin: 0 0 0 2% !important;
  }
  /* LIGHTBOX */
  .jslghtbx.jslghtbx-nooverflow:not(.jslghtbx-active) {
      overflow: hidden;
      z-index: -10;
      visibility: hidden;
  }
  .jslghtbx.jslghtbx-active {
      z-index: 5000000;
  background-color: black;
  }
  /* ALERTE MES - BUGS - FORUM USERST */
  .DismissMessage {
      position: absolute;
      width: 18%;
      right: 5px;
  }
  .DismissMessage.AlertMessage {
      top: 40px;
      visibility: hidden;
      border: 1px solid #deddaf;
  }
  .AlertMessage:hover {
      visibility: visible;
      z-index: 5000;
  }
  .AlertMessage:not(:hover):before {
      content: "⚠️ Bugs report";
      position: fixed;
      right: 5px;
      visibility: visible;
  color: gold;
  background: red;
  }
  /* USERST - AVATAR MESS */
  .DismissMessage.InfoMessage {
      position: absolute;
      right: 5px;
      top: 70px;
      visibility: hidden;
  }
  .DismissMessage.InfoMessage:hover {
      visibility: visible;
      z-index: 5000;
  }
  .DismissMessage.InfoMessage:not(:hover):before {
      content: "⚠️ Avatar PB";
      position: fixed;
      right: 5px;
      visibility: visible;
  color: gold;
  background: red;
  }
  /* GREASY - FORUM - SELECT BOX */
  .selectBox-main {
      position: absolute;
      display: inline-block;
      justify-content: unset;
      margin-left: 31px;
      z-index: 500;
  }
  .ToggleFlyout.selectBox.selectBox-following > span.selectBox-label {
      cursor: pointer;
      margin-right: 5px;
      position: relative;
      font-size: 0;
  }
  .ToggleFlyout.selectBox > span.selectBox-label:before {
      content: " ";
      position: relative;
      display: inline-block;
      width: 20px;
      height: 15px;
      margin-right: 5px;
      margin-left: 5px;
      top: 3px;
      background-color: rgba(55, 173, 227, 0.4);
      background-image: url("https://addons.cdn.mozilla.net/static/img/zamboni/icons/collections.png?433f04b");
      background-position: 3px -650px;
      background-repeat: no-repeat;
  }
  .ToggleFlyout.selectBox.selectBox-following .selectBox-content {
      left: 100%;
      margin-left: -29px;
      margin-top: 10px;
  }

  /* PersProf/UserProf PAGES - OK CITRUS */
  body[pagetype="UserProfile"] .sidebarred .sidebarred-main-content:not(#user-library-list-section),
  body[pagetype="PersonalProfile"] .sidebarred .sidebarred-main-content:not(#user-library-list-section),
  body[pagetype="UserProfile"] #main-header + .width-constraint .sidebarred .sidebarred-main-content section:not(#user-library-list-section) {
      display: none;
  }
  /* (new214) LIBRARY IN PROFILE - NO CITRUS */
  .sidebarred .sidebarred-main-content section#user-library-list-section {
      position: fixed;
      display: inline-block !important;
      max-height: 24px !important;
      min-height: 24px !important;
      line-height: 24px !important;
      width: 100%;
      min-width: 23px !important;
      max-width: 23px !important;
      left: 39%;
      top: 6vh !important;
      padding: 0;
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      z-index: 500;
      transition: all 0.2s ease 0s;
  border: 1px solid red;
  }

  body[pagetype="UserProfile"] .sidebarred .sidebarred-main-content section#user-library-list-section,
  body[pagetype="PersonalProfile"] .sidebarred .sidebarred-main-content section#user-library-list-section,
  body[pagetype="UserProfile"] #main-header + .width-constraint .sidebarred .sidebarred-main-content section#user-library-list-section {
      position: fixed;
      display: inline-block !important;
      max-height: 20px !important;
      min-height: 20px !important;
      line-height: 24px !important;
      width: 100%;
      min-width: 23px !important;
      max-width: 23px !important;
      left: 39%;
      top: 3.6vh !important;
      padding: 0;
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      z-index: 500;
      transition: all 0.2s ease 0s;
  border: 1px solid red;
  }
  /* (new214) HOVER - Not GM */
  .sidebarred .sidebarred-main-content #user-library-list-section:hover {
      position: fixed !important;
      display: inline-block !important;
      max-height: 400px !important;
      min-width: 49.8% !important;
      max-width: 49.8% !important;
      left: 23.5%;
      top: 5.6vh !important;
      padding: 35px 0 0 30px !important;
      overflow-y: auto !important;
      z-index: 5000 !important;
      background: #111 !important;
  border: 1px solid red !important;
  }
  /* (new214) HOVER - GM */
  body[pagetype="UserProfile"] .sidebarred .sidebarred-main-content #user-library-list-section:hover,
  body[pagetype="PersonalProfile"] .sidebarred .sidebarred-main-content #user-library-list-section:hover,
  body[pagetype="UserProfile"] #main-header + .width-constraint .sidebarred .sidebarred-main-content section#user-library-list-section:hover {
      position: fixed !important;
      display: inline-block !important;
      max-height: 400px !important;
      min-width: 49.5% !important;
      max-width: 49.5% !important;
      left: 24%;
      padding: 0 0 0 30px !important;
      overflow-y: auto !important;
      z-index: 5000 !important;
  border: 1px solid red !important;
  }
  .width-constraint:first-of-type .sidebarred .sidebarred-main-content section#user-deleted-script-list-section:not(:hover) h3,
  .width-constraint:first-of-type .sidebarred .sidebarred-main-content section#user-library-list-sectionn:not(:hover) h3 {
      display: none !important;
  }
  .width-constraint:first-of-type .sidebarred .sidebarred-main-content section#user-library-list-section:hover h3 {
      position: fixed !important;
      display: inline-block !important;
      height: 25px;
      line-height: 25px;
      width: 100%;
      max-width: 49.6%;
      min-width: 49.6%;
      margin-left: 0% !important;
      left: 24.2% !important;
      top: 6.8vh !important;
      padding: 1px 1px 1px 20px;
      border-radius: 5px 5px 0 0;
      font-size: 15px !important;
      text-align: center;
      z-index: 50000000 !important;
      pointer-events: none;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0);
  }

  body[pagetype="PersonalProfile"] .sidebarred .sidebarred-main-content section#user-library-list-section:hover h3,
  body[pagetype="UserProfile"] #main-header + .width-constraint .sidebarred .sidebarred-main-content section#user-library-list-section:hover h3 {
      position: fixed !important;
      display: inline-block !important;
      height: 25px;
      line-height: 25px;
      width: 100%;
      max-width: 48.2%;
      min-width: 48.2%;
      margin-left: 0% !important;
      left: 25.7% !important;
      top: 7.5vh !important;
      padding: 1px 1px 1px 20px;
      border-radius: 5px 5px 0 0;
      font-size: 15px !important;
      text-align: center;
      z-index: 50000000 !important;
      pointer-events: none;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0);
  }

  /* (new214) LIBS - NOT HOVER */
  .width-constraint:first-of-type .sidebarred .sidebarred-main-content section#user-library-list-sectionn:not(:hover) h3::before,
  .width-constraint:first-of-type .sidebarred .sidebarred-main-content section#user-library-list-section:not(:hover) h3::before {
      content: "Lib" !important;
      position: absolute !important;
      display: inline-block !important;
      height: 24px;
      line-height: 28px;
      width: 23px;
      top: 3.2vh !important;
      left: 58.1% !important;
      font-size: 12px;
      text-align: right;
      background-image: url("http://userscripts-mirror.org/images/script_icon.png");
      background-position: -2px center;
      background-repeat: no-repeat;
      background-size: contain;
      z-index: 500000 !important;
  color: red;
  background-color: green !important;
  }

  /* (new214) LIBS - HOVER */
  body[pagetype="UserProfile"] .sidebarred .sidebarred-main-content #user-library-list-section:hover header,
  body[pagetype="PersonalProfile"] .sidebarred .sidebarred-main-content #user-library-list-section:hover header,
  body[pagetype="UserProfile"] #main-header + .width-constraint .sidebarred .sidebarred-main-content section#user-library-list-section:hover header {
      margin-top: 29px !important;
  }

  .sidebarred .sidebarred-main-content #user-library-list-section:hover h3::before,

  body[pagetype="UserProfile"] .sidebarred .sidebarred-main-content #user-library-list-section:hover h3::before,
  body[pagetype="PersonalProfile"] .sidebarred .sidebarred-main-content #user-library-list-section:hover h3::before,
  body[pagetype="UserProfile"] #main-header + .width-constraint .sidebarred .sidebarred-main-content section#user-library-list-section:hover h3::before {
      top: 6px !important;
      left: 2px !important;
  color: gold;
  background-color: red;
  }

  .sidebarred .sidebarred-main-content #user-library-list-section ol#user-library-script-list.script-list,

  body[pagetype="UserProfile"] .sidebarred .sidebarred-main-content #user-library-list-section ol#user-library-script-list.script-list,
  body[pagetype="PersonalProfile"] .sidebarred .sidebarred-main-content #user-library-list-section ol#user-library-script-list.script-list,
  body[pagetype="UserProfile"] #main-header + .width-constraint .sidebarred .sidebarred-main-content section#user-library-list-section ol#user-library-script-list.script-list {
      width: 100% !important;
  }

  /* USERCSS - ICONS - NO CITRUS - === *
  /* JS / CSS  - NO CITRUS */
  a[href*="help/installing-user-scripts"]::before,
  .install-link + a[href*="/help/installing-user-styles"]::before,
  #browse-script-list > li[data-script-language="js"]::before,
  li[data-script-language="js"]::before,
  #browse-script-list > li[data-script-language="css"]::before,
  li[data-script-language="css"]::before {
      content: "X";
      float: left;
      clear: none;
      width: 23px;
      height: 23px;
      line-height: 24px;
      margin-left: -31px;
      margin-top: 5px;
      margin-bottom: -20px;
      border-radius: 3px;
      color: transparent;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
  }
  /* SCRIPT - NO CITRUS */
  #browse-script-list > li[data-script-language="js"]::before,
  li[data-script-language="js"]::before {
      background-image: url("http://userscripts-mirror.org/images/script_icon.png");
      background-color: #222;
  }
  /* "?" HELP JS/CSS */
  a[href*="/help/installing-user-scripts"],
  .install-link + a[href*="/help/installing-user-styles"] {
      padding: 7px 5px 7px 18px;
  }
  a[href*="/help/installing-user-scripts"]::before,
  .install-link + a[href*="/help/installing-user-styles"]::before {
      width: 15px;
      height: 15px;
      line-height: 24px;
      margin-left: -17px;
      margin-right: -25px;
      margin-top: 3px;
  }
  .install-link + a[href*="/help/installing-user-styles"]::before {
      background-image: url("https://addons.cdn.mozilla.net/user-media/addon_icons/814/814814-64.png?modified=1542603952") !important;
      background-color: transparent
  }
  a[href*="/help/installing-user-scripts"]::before {
      background-image: url("http://userscripts-mirror.org/images/script_icon.png");
      background-color: transparent
  }

  /* ADD VERS (+ DEL SCRIPT) - NO CITRUS */
  ol#user-deleted-script-list {
      display: inline-block;
      width: 100%;
      max-width: 970px;
      min-height: 100%;
      margin-bottom: 0;
      padding: 0;
      text-align: left;
      box-shadow: none;
  background: rgba(235, 24, 24, 0.26);
  }
  #user-deleted-script-list li:not(.ad-entry) {
      padding: 0.5em;
  }
  #user-deleted-script-list li:not(.ad-entry) h2 {
      display: inline-block !important;
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      overflow: hidden;
      overflow-wrap: break-word;
  }
  /* (new255) VERSION */
  #user-deleted-script-list > li::after,
  #user-script-list > li::after {
      content: " version: "attr(data-script-version)"";
      display: inline-block;
      position: relative;
      width: 100px;
      bottom: 12.8vh;
      right: -87%;
      padding: 1px 4px;
      font-size: 12px;
      border-radius: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  background-color: #111;
  border: 1px solid #333;
  }

  /* ICON - CSS - NO CITRUS */
  #browse-script-list > li[data-script-language="css"]::before,
  li[data-script-language="css"]::before {
      background-image: url("https://addons.cdn.mozilla.net/user-media/addon_icons/814/814814-64.png?modified=1542603952");
      background-color: green;
  }
  /* ICON - CSS as JS - NO CITRUS */
  #browse-script-list > li[data-script-language="css"][data-css-available-as-js="true"]::before,
  li[data-script-language="css"][data-css-available-as-js="true"]::before {
      content: "X";
      float: left;
      clear: none;
      width: 23px;
      height: 23px;
      line-height: 23px;
      margin-left: -31px;
      margin-top: 5px;
      margin-bottom: -20px;
      color: transparent;
      background-image: url("https://addons.cdn.mozilla.net/user-media/addon_icons/814/814814-64.png?modified=1542603952"), url("http://userscripts-mirror.org/images/script_icon.png");
      background-size: 15px 15px;
      background-position: top left, bottom right;
      background-repeat: no-repeat;
      background-color: green;
  }
  /* USERCSS - ADD ICONS - CITRUS */
  .lang-js:not(.prettyprint),
  .lang-css:not(.prettyprint) {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin-top: 0;
      width: 15px;
      height: 15px;
      line-height: 15px;
      margin-left: 5px;
      margin-right: 5px;
      border-radius: 3px;
      background-size: 13px 13px;
      background-position: center center;
      background-repeat: no-repeat;
  }
  /* ICON - JS SCRIPT - CITRUS */
  .lang-js:not(.prettyprint) {
      background-image: url("http://userscripts-mirror.org/images/script_icon.png") !important;
      background-color: transparent;
  }
  /* ICON - CSS - CITRUS  */
  .lang-css:not(.prettyprint) {
      background-image: url("https://addons.cdn.mozilla.net/user-media/addon_icons/814/814814-64.png?modified=1542603952") !important;
      background-color: green !important;
  }
  /* ICON - JS / CSS - CITRUS */
  [pagetype="ListingPage"] .lang-js:not(.prettyprint),
  [pagetype="UserProfile"] .lang-js:not(.prettyprint),
  [pagetype="UserProfile"] .lang-js:not(.prettyprint) {
      background-image: url("http://userscripts-mirror.org/images/script_icon.png");
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      background-color: transparent;
  }
  [pagetype="ListingPage"] .lang-css,
  [pagetype="UserProfile"] .lang-css,
  [pagetype="UserProfile"] .lang-css {
      background-image: url("https://addons.cdn.mozilla.net/user-media/addon_icons/814/814814-64.png?modified=1542603952");
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      background-color: green;
  }
  /* CSS as JS - CITRUS */
  [pagetype="ListingPage"] .usercssjs-true,
  [pagetype="UserProfile"] .usercssjs-true,
  [pagetype="PersonalProfile"] .usercssjs-true {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin-top: 0;
      width: 23px;
      height: 15px;
      line-height: 15px;
      margin-left: 5px;
      margin-right: 5px;
      border-radius: 3px;
      background-image: url("https://addons.cdn.mozilla.net/user-media/addon_icons/814/814814-64.png?modified=1542603952"), url("http://userscripts-mirror.org/images/script_icon.png");
      background-size: 10px 10px, 13px 13px;
      background-position: center left, center right;
      background-repeat: no-repeat;
      background-color: green;
  }

  /* SET */
  html > body[pagetype="UserProfile"] #script-list-set,
  html > body[pagetype="UserProfile"] #script-list-filter,
  html > body[pagetype="UserProfile"] #script-list-sort,

  html > body[pagetype="PersonalProfile"] #script-list-set,
  html > body[pagetype="PersonalProfile"] #script-list-filter,
  html > body[pagetype="PersonalProfile"] #script-list-sort,

  html > body[pagetype="ListingPage"] #script-list-set,
  html > body[pagetype="ListingPage"] #script-list-filter,
  html > body[pagetype="ListingPage"] #script-list-sort {
      display: none;
  }


  /* (new248) 2FA - INDICATOR in PROFIL MENU */
  ul#user-control-panel li a[href*="/users/edit_sign_in"]:after {
      content: "[2FA]" !important;
      margin: 0 0 0 10px !important;
      padding: 1px 5px;
  color: white  !important;
  background: green !important;
  }

  /* (new248) 2FA PAGES */
  header#main-header + .width-constraint > section.text-content:not(.reportable):has([action*="/users/update_password"])  {
      display: inline-block;
      left: 0;
      width: 100% !important;
      min-height: 68vh !important;
      max-height: 18vh !important;
      line-height: 3vh !important;
      padding: 0 15px 0 15px !important;
  background: #111;
  border: 1px solid red !important;
  }
  header#main-header + .width-constraint > section.text-content:not(.reportable):has([action*="/users/update_password"]) form[action*="/users/update_password"]  {
      display: inline-block;
      left: 0;
      width: 98% !important;
      min-height: 18vh !important;
      max-height: 18vh !important;
      line-height: 3vh !important;
      padding: 0 0 0 15px !important;
  background: #111;
  border: 1px solid red !important;
  }



  /* (new247) SET - EDIT  - INFOS/ TIP =
  not 2FA :has([action$="/users/confirm_2fa"])
  :not(.reportable)
  === */
  header#main-header + .width-constraint > section.text-content:not(.reportable):not(:has([action$="/users/confirm_2fa"])):not(:has([action*="/users/update_password"])) > p:not(:empty),
  header#main-header + .width-constraint > section.text-content:not(.reportable):not(:has([action$="/users/confirm_2fa"])):not(:has([action*="/users/update_password"])) > p:not(:empty) {
      position: fixed;
      top: 4.5vh;
      left: -1% !important;
      width: 22.3% !important;
      height: 8.5vh;
      line-height: 15px !important;
      padding: 0 5px !important;
      font-size: 15px !important;
      overflow: hidden;
      overflow-y: auto !important;
      z-index: 5000000 !important;
  background: #111;
  border: 1px solid aqua !important;
  border-right: 4px solid red !important;
  }

  /* header#main-header + .width-constraint > section.text-content:not(.reportable:has([action*="/users/update_password"]) form */

  /* (new243) SET - EDIT  - FIRST FORM (NAME /DESC) */
  form.change-script-set > section:first-of-type {
      position: fixed;
      top: 15.5vh;
      left: 0;
      width: 23% !important;
      height: 41vh;
      overflow: hidden;
      overflow-y: hidden;
  background: #111;
  border: 1px solid red !important;
  }
  .change-script-set section {
      padding-bottom: 1em;
  border-bottom: 1px solid red !important;
  }
  /* H3 */
  form.change-script-set > section#script-set-scripts h3 {
      display: inline-block;
      left: 0;
      width: 17% !important;
      height: 3vh;
      line-height: 3vh !important;
      padding: 0 0 0 5px !important;
  background: #111;
  border: 1px solid red !important;
  }
  form.change-script-set > section#script-set-scripts h3 + p {
      display: inline-block;
      left: 0;
      width: 80% !important;
      height: 3vh;
      line-height: 3vh !important;
      padding: 0 0 0 5px !important;
  background: #111;
  border: 1px solid red !important;
  }

  /* (new254) SET - EDIT - DESCRIPTION */
  form.change-script-set > section:first-of-type .form-control +.form-control textarea#script_set_description {
      display: inline-block;
      left: 0;
      width: 100% !important;
      height: auto !important;
      min-height: 15vh !important;
      max-height: 15vh !important;
      line-height: 1.5vh !important;
      padding: 0 0 0 5px !important;
  background: #111;
  border: 1px solid lime !important;
  }


  /* (new244) SET - EDIT  - SAVE BUTTON =
  :not(#about-user) */
  form.change-script-set [name="save"] {
      position: fixed;
      top: 15.5vh;
      left: 5% !important;
      width: 5% !important;
      height: 2vh;
      overflow: hidden;
      overflow-y: hidden;
  background: green;
  border: 1px solid red !important;
  }
  /* HOVER */
  form.change-script-set [name="save"]:hover {
      cursor: pointer !important;
  background: gold;
  border: 1px solid red !important;
  }
  /* (new244) SET - EDIT - DELETE SET BUTTON */
  .change-script-set + form[data-confirm] {
      position: fixed;
      display: inline-block !important;
      top: 15.5vh;
      left: 13% !important;
      width: 190px !important;
      height: 2vh;
      overflow: hidden;
      overflow-y: hidden;
  }
  .change-script-set + form[data-confirm] > p {
      display: inline-block !important;
      width: 100% !important;
      height: 2vh !important;
      line-height: 2vh !important;
      margin: 0vh 0 0 0 !important;
  }

  .change-script-set + form[data-confirm] > p > input[type="submit"] {
      position: absolute;
      display: inline-block !important;
      width: 100% !important;
      height: 2vh !important;
      line-height: 1vh !important;
      top: 0 !important;
  background: red;
  border: 1px solid red !important;
  }
  /* HOVER */
  .change-script-set + form[data-confirm] > p > input[type="submit"]:hover {
      cursor: pointer !important;
      background: gold;
      border: 1px solid red !important;
  }

  /* (new245) SET - EDIT - LIST CACULATED SCRIPTS */
  section#script-set-auto-script-sets + section {
      position: fixed;
      top: 7vh;
      right: 0;
      width: 24% !important;
      height: 89vh;
      overflow: hidden;
      overflow-y: hidden;
  background: #111;
  border: 1px solid red !important;
  }
  section#script-set-auto-script-sets + section ul {
      height: 84vh;
      padding-bottom: 2vh !important;
      overflow: hidden;
      overflow-y: hidden;
      overflow-y: auto;
  background: #111;
  border: 1px solid red !important;
  }

  /* USERCSS - INSTALL BUTTON */
  #script-info #install-area .install-link + .install-help-link + .install-link + a,
  #script-info #install-area .install-link + .install-help-link + .install-link {
      float: right;
  }

  /* FOR SUPERLOADER */
  body[pagetype="ListingPage"] .sp-separator ~ .width-constraint .sidebarred .sidebarred-main-content .open-sidebar.sidebar-collapsed + h3,
  body[pagetype="ListingPage"] .sp-separator ~ .width-constraint .sidebarred .sidebarred-main-content .open-sidebar.sidebar-collapsed + h3 ~ p:last-of-type,
  body[pagetype="ListingPage"] .sp-separator ~ .width-constraint .sidebarred .sidebarred-main-content .open-sidebar.sidebar-collapsed + p + .pagination + p {
      display: none;
  }

  /* MESSAGE - ERROR NOT LOADING IMAGES */
  .notice {
      display: inline-block;
      position: absolute;
      width: 214px;
      left: -30%;
      top: 0px;
  }

  /* (new245) SETS - NEW SET PAGE - CIT */
  section.text-content > p:not(:empty) {
      margin: 20px 0 0 20px !important;
      font-size: 20px !important;
  color: gold !important;
  }
  [pagetype="UserProfile"] .width-constraint section.text-content > p:empty {
      display: none;
  }

  [pagetype="UserProfile"] .width-constraint section.text-content p + form {
      position: relative;
      min-height: 88vh;
      max-height: 700px;
      top: 20px;
      padding: 0px 66px;
      overflow: hidden;
      overflow-y: auto;
  background: #222;
  }

  #script-set-scripts .selection-box.form-control #remove-scripts-included {
      height: 53vh !important;
  }
  .change-script-set #script-set-scripts .form-control:not(.selection-box) {
      min-height: 12vh !important;
      max-height: 12vh !important;
  }
  .change-script-set #script-set-scripts .form-control textarea:not([rows])#add-script {
      min-height: 2vh !important;
      max-height: 10vh !important;
  }

  /* SET - FROM USER TITLE - CIT */
  .width-constraint:first-of-type .sidebarred .sidebarred-main-content h3 {
      position: fixed !important;
      display: inline-block !important;
      height: 17px;
      line-height: 15px;
      width: 570px;
      margin-left: 0% !important;
      left: 21% !important;
      top: 2.8vh;
      padding: 1px 1px 1px 20px;
      border-radius: 5px 5px 0 0;
      font-size: 13px !important;
      text-align: left;
      z-index: 50000000 !important;
      pointer-events: none;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0);
  border: 1px solid red;
  }
  body[pagetype="ListingPage"] .width-constraint:first-of-type .sidebarred .sidebarred-main-content .open-sidebar.sidebar-collapsed + h3 {
      position: fixed !important;
      display: inline-block !important;
      height: 17px;
      line-height: 15px;
      width: 555px;
      margin-left: 0% !important;
      left: 22.4% !important;
      top: 4.2vh;
      padding: 1px 1px 1px 20px;
      border-radius: 5px 5px 0 0;
      font-size: 13px !important;
      text-align: left;
      z-index: 50000000 !important;
      pointer-events: none;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0);
  border: 1px solid gray;
  }
  body[pagetype="ListingPage"] .width-constraint:first-of-type .sidebarred-main-content > h3 + p {
      display: inline-block !important;
      z-index: 50000000 !important;
  }

  body[pagetype="ListingPage"] #script-table + .width-constraint h3 > a {
      z-index: 100;
      pointer-events: auto;
  }

  /* PB - CREATE SET PAGE - SCROLL */
  html,
  body {
      min-height: 100% !important;
      text-align: left !important;
  }

  /* GREASY - ADMIN / DELETE SCRIPT PAGE */
  .multiform-page:first-of-type,
  #script-content > form[action$="/delete"] > p:first-of-type {
      margin-top: 48px !important;
  }

  /* GREASY FORUM - PROFILE COMM LIST */
  .Profile .DataListWrap ul.DataList.SearchResults .MItem:first-child {
      margin-left: 8px;
      margin-right: 8px;
      white-space: pre-line !important;
  }
  /* GREASY FORUM - COM RATING */
  .ExtraDiscussionData-Rating .RadioLabel {
      display: inline-block !important;
  }
  /* (new234) LOADER */
  .init_loader {
      display: none !important;
  }
  .init_loader > img {
      border-radius: 100% !important;
  background: #e6dbdb !important;
  border: 1px solid red !important;
  }

  /* USERSTY FORUM - IMGUR VIDEO */
  .imgur-gifv.VideoWrap > video {
      max-width: 624px;
  }

  /* (new219) CATEGORIES */
  .us-category--stylecard-long h1,
  .view_inner.StylesCategory > h1 {
      font-size: 30px;
      margin: 0px !important;
  color: #6687aa !important;
  }
  #categories {
      display: inline-block !important;
      width: 100% !important;
      margin-bottom: 50px;
  }
  .StyleCategory-Link {
      display: inline-block !important;
      width: 280px !important;
      margin: 2px -18px 22px 48px !important;
  }
  .us-category--narrow,
  .us-category--stylecard-short.us-category--narrow {
      width: 100% !important;
      margin-left: 0 !important;
  }

  .us-category--stylecard-long .us-stylecards__container--narrow,
  .us-category--stylecard-short .us-stylecards__container--narrow {
      width: 100% !important;
  }
  #title_div {
      width: 100% !important;
  }
  .us-category--stylecard-short h1 {
      margin: 0 !important;
  color: #6687aa !important;
  }
  .fallbackDiv {
      position: relative !important;
      display: inline-block !important;
      height: 156px;
      max-width: 100%;
      min-width: 100%;
      align-items: center;
  background-color: #222;
  }
  .fallbackDiv .fallbackImg {
      position: absolute;
      width: 50%;
      height: 100%;
      top: 0;
      left: 25% !important;
      object-fit: contain !important;
      object-position: 50% 50% !important;
      opacity: 0.5 !important;
  }

  /* USERSTY - MENU LEFT */
  .navigation {
      width: 38% !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      left: 0 !important;
      top: -22px !important;
      padding: 0 !important;
      overflow: hidden !important;
      z-index: 5000000 !important;
  box-shadow: none !important;
  background-color: #2e3e49 !important;
  }
  .navigation .links-box {
      position: fixed !important;
      width: 200px !important;
      top: 47px !important;
      left: 40px !important;
  background-color: #222 !important;
  }
  .links-box > a {
      display: inline-block !important;
      width: 200px !important;
  }
  .navigation .links-box .navigation-link {
      height: 16px !important;
      align-items: center;
      padding: 1px 0;
  }
  .navigation .links-box .navigation-link .navigation-title {
      color: #617488 !important;
  }
  .navigation .navigation-category {
      position: fixed;
      display: inline-block;
      width: 200px !important;
      top: 19px !important;
      margin: 30px 0 10px;
      font-size: 12px !important;
      text-align: center !important;
      z-index: 5000000;
  color: #95a5a6;
  }
  .links-box:first-of-type:before {
      content: "Menu  ∇ ";
      display: inline-block;
      width: 200px !important;
      text-align: center !important;
      visibility: visible !important;
  border-bottom: 4px solid gold !important;
  }
  .links-box:first-of-type {
      border-top: none !important;
      visibility: hidden !important;
  }
  .links-box:first-of-type:hover {
      border-top: none !important;
      visibility: visible !important;
  }
  .links-box:first-of-type + .navigation-category {
      left: 258px !important;
  border-bottom: 4px solid blue !important;
  }
  .links-box:first-of-type + .navigation-category + .links-box {
      position: fixed !important;
      display: inline-block !important;
      top: 67px !important;
      left: 258px !important;
      visibility: hidden !important;
  border-bottom: 4px solid blue !important;
  }
  .links-box:first-of-type + .navigation-category + .links-box:hover,
  .links-box:first-of-type + .navigation-category:hover + .links-box {
      visibility: visible !important;
  }
  .links-box:first-of-type + .navigation-category + .links-box + .navigation-category {
      left: 466px !important;
  border-bottom: 4px solid green !important;
  }
  .links-box:first-of-type + .navigation-category + .links-box + .navigation-category + .links-box {
      position: fixed !important;
      display: inline-block !important;
      top: 67px !important;
      left: 466px !important;
      visibility: hidden !important;
  border-bottom: 4px solid green !important;
  }
  .links-box:first-of-type + .navigation-category + .links-box + .navigation-category + .links-box:hover,
  .links-box:first-of-type + .navigation-category + .links-box + .navigation-category:hover + .links-box {
      visibility: visible !important;
  }
  .links-box:first-of-type + .navigation-category + .links-box + .navigation-category:after,
  .links-box:first-of-type + .navigation-category:after {
      content: " ∇ ";
      display: inline-block;
      width: 5px !important;
      margin-left: 10px !important;
      text-align: center !important;
      visibility: visible !important;
  color: gold;
  }

  /* USER PAGE(not ACCOUNT PAGE) */
  .personal-page-header {
      position: fixed;
      width: 100% !important;
      height: 32px !important;
      font-size: 20px !important;
      right: 0px;
      top: 48px !important;
      text-align: center !important;
      z-index: 50000;
  background: #111 !important;
  }
  .personal-page-header h1 {
      width: 100%;
      line-height: 20px !important;
      margin: 0 !important;
      font-size: 20px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: normal;
  color: #7691AD;
  border-bottom: 1px solid red !important;
  }
  .personal-page-header-right {
      height: 30px;
  }
  .personal-page .light-blue-button {
      padding: 1px 10px !important;
  }
  .personal-page-narrow {
      width: 100% !important;
  }
  .personal-page {
      box-sizing: border-box;
      margin: 5px 0 0 0 !important;
      padding: 0 20px;
      width: 100%;
  }
  /* .personal-page.personal-page-narrow */
  /* MOZAIC */
  .us-stylecard--long {
      display: inline-block !important;
      width: 32% !important;
      height: 172px;
      margin: 15px 20px -10px 0 !important;
      padding: 8px !important;
      border-radius: 5px;
      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.08);
  background-color: black !important;
  border: 1px solid red;
  }

  .us-stylecard--long {
      float: left !important;
      box-sizing: border-box;
      width: 32% !important;
      height: 172px;
      margin: 5px 5px 0px 5px !important;
      top: 0 !important;
      padding: 8px !important;
      border-radius: 5px;
      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.08);
  background-color: black !important;
  border: 1px solid red;
  }

  .us-stylecard--long:nth-child(1) {
      margin-top: 5px !important;
  }
  .us-stylecard--long > a {
      width: 40% !important;
      text-align: center;
  }
  /* (new18) */
  .us-stylecard--long .us-stencil {
      float: left !important;
      max-width: 50% !important;
      min-width: 50% !important;
      height: 156px;
  background-color: #222 !important;
  }
  /* (new219) */
  .us-stylecard--long .us-stencil__image {
      display: none !important;
  }
  .us-screenshot {
      width: 100% !important;
      min-height: 156px !important;
      max-height: 156px !important;
      transition: height 0.5s ease 0s;
  }
  .us-screenshot .background--website-style {
      object-fit: contain;
      object-position: center center;
      background-image: url(https://camo.githubusercontent.com/5b8e4cd1a5ce69b6affa17ebd8e4aee00c147618/68747470733a2f2f7374796c6973687468656d65732e6769746875622e696f2f4769744875622d4461726b2f696d616765732f6261636b67726f756e64732f62672d63726f737368617463682e706e67) !important;
  }
  .us-screenshot .background--website-style:not([src^="https://userstyles.org/"]) {
      display: inline-block !important;
      width: 99% !important;
      height: 99% !important;
      background-image: none !important;
  background-color: #111 !important;
  border: 1px solid red !important;
  }
  .us-category--stylecard-short {
      width: 99% !important;
  }
  .us-category--stylecard-long .us-stylecards__container {
      width: 99% !important;
  }
  .us-stylecard--long .us-container {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      clear: none !important;
      width: 50% !important;
      margin-top: 0px !important;
      padding: 3px 5px 0 5px !important;
      overflow: hidden;
  }
  .us-stylecard--long .us-title {
      width: 100% !important;
      height: auto !important;
      line-height: 22px !important;
      margin-top: 0px;
      font-size: 18px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre-line !important;
  }
  .us-stylecard--long .us-title a {
      display: inline-block !important;
      width: 100% !important;
  }
  /* (new219) */
  .us-stylecard__button-container {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      width: 100% !important;
      height: 100% !important;
      margin: 0px !important;
      bottom: 160px !important;
      padding: 0 !important;
      pointer-events: none !important;
      opacity: 0.3 !important;
      transition: opacity ease 0.7s !important;
  }
  us-stylecard__button-container:hover,
  .us-stylecard--long .us-container:hover + .us-stylecard__button-container {
      opacity: 1 !important;
      transition: opacity ease 0.7s !important;
  }
  .us-stylecard__button-container > a .us-button {
      pointer-events: auto !important;
  background: #222 !important;
  }


  /* FOR ANDROID */
  .us-category--stylecard-short.us-category .us-stylecards__container {
      width: 99% !important;
  }
  .us-category--stylecard-long.us-category .us-stylecards__container .us-stylecard--long .us-container {
      clear: none;
      display: inline-block !important;
      width: 50% !important;
  }
  .us-category--stylecard-long.us-category .us-stylecards__container .background--mobile-style + .body {
      position: absolute !important;
      width: 99% !important;
      height: 132px !important;
      left: 0;
      margin: 13px auto;
      right: 0;
      top: 0;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      background-size: contain !important;
  }
  .us-category--stylecard-short.us-category .us-stylecards__container.us-stylecards__container--stylecard-short .us-stylecard--short.us-stylecard--short-android {
      display: inline-block !important;
      max-height: 250px !important;
  }
  .us-category--stylecard-short.us-category .us-stylecards__container.us-stylecards__container--stylecard-short .us-stylecard--short.us-stylecard--short-android a .us-stencil,
  .us-category--stylecard-short.us-category .us-stylecards__container.us-stylecards__container--stylecard-short .us-stylecard--short.us-stylecard--short-android a {
      display: inline-block !important;
      max-height: 250px !important;
  }
  .us-category--stylecard-short.us-category .us-stylecards__container.us-stylecards__container--stylecard-short .us-stylecard--short.us-stylecard--short-android a .us-stencil .us-screenshot .container--stylecard.transparent-img-background-black img.background--mobile-style + .body {
      position: absolute !important;
      width: 98% !important;
      height: 132px !important;
      left: 0;
      margin: 13px auto;
      right: 0;
      top: 0;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      background-size: contain !important;
  }
  .us-category--stylecard-short.us-category .us-stylecards__container.us-stylecards__container--stylecard-short .us-stylecard--short.us-stylecard--short-android .us-container {
      position: relative !important;
      display: inline-block !important;
      margin-top: -115px !important;
      z-index: 500 !important;
  }
  .us-category--stylecard-long.us-category .us-stylecards__container .us-stylecard--long .us-stylecard__button-container {
      display: inline-block;
      margin-top: 0;
      padding: 0;
      position: absolute;
      right: 4% !important;
      width: 5% !important;
  }

  /* USERSTY - PAGINA */
  .us-stylecards__container + #pagination {
      position: fixed !important;
      width: 700px !important;
      right: -320px !important;
      top: 50% !important;
      padding: 5px !important;
      border-radius: 5px !important;
      transform: rotate(90deg);
  background: #222 !important;
  }
  .us-stylecards__container + #pagination > a:first-of-type,
  .us-stylecards__container + #pagination > a:last-of-type,
  .us-stylecards__container + #pagination > #pages > .pageNumber,
  .us-stylecards__container + #pagination > #pages > a {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px !important;
      width: 40px !important;
      font-size: 15px !important;
      margin: 0 4px;
      cursor: pointer;
      transform: rotate(-90deg);
  }
  .us-stylecards__container + #pagination .pageNumber.current {
      color: gold !important;
      background: #222 !important;
  }
  .us-stylecards__container + #pagination > a:first-of-type .div-arrow,
  .us-stylecards__container + #pagination > a:last-of-type .div-arrow {
      width: 30px !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      text-align: center !important;
  }
  .us-stylecards__container + #pagination > a:first-of-type .arrow-icon,
  .us-stylecards__container + #pagination > a:last-of-type .arrow-icon {
      width: 41px !important;
      height: 30px !important;
      text-align: center !important;
  }

  /* A VOIR - GREASY - FORUM - TOP HEADER - DISMIS - == */
  .Column.ContentColumn .MessageList.Discussion .OptionsMenu .Flyout.MenuItems.list-reset,
  .MessageList.Discussion .OptionsMenu .Flyout.MenuItems.list-reset {
      display: inline-block !important;
      height: 21px !important;
      margin-top: -51px !important;
      margin-left: 4px !important;
  }
  .MessageList.Discussion .Flyout.MenuItems.list-reset .no-icon a.dropdown-menu-link.DismissAnnouncement.Hijack.dropdown-menu-link-dismiss {
      height: 15px !important;
      width: 15px !important;
      margin-right: 0 !important;
      margin-top: 0 !important;
      padding: 0 !important;
      font-size: 0px !important;
  color: red !important;
  }
  .MessageList.Discussion .Flyout.MenuItems.list-reset .no-icon a.dropdown-menu-link.DismissAnnouncement.Hijack.dropdown-menu-link-dismiss:before {
      content: " \\274C";
      font-size: 10px !important;
  color: red !important;
  }
  .MessageList.Discussion .Flyout.MenuItems.list-reset .no-icon a.dropdown-menu-link.DismissAnnouncement.Hijack.dropdown-menu-link-dismiss:hover:after {
      content: "Dismiss";
      position: absolute;
      display: inline-block;
      margin-top: -20px !important;
      margin-left: -30px !important;
      font-size: 10px !important;
  color: tomato !important;
  }

  /* GM - Greasyfork Display Update Checks - (not working with CITRUS) */
  #browse-script-list > li > article > p > span[style*="border: 1px ridge #817F82;)"] > b {
      color: gold !important;
      /* OK - FINE TOP OF THE BACKGROUND - BLACK */
      text-shadow: 0px 1px 1px #000;
  }

  /* GREASY - Without SCRIPT */
  .width-constraint > p {
      display: inline-block;
  }
  #script-links .current > * {
      color: red !important;
  }

  /* CITRUS SETTINGS - POPUP */
  #CForkSettings {
      z-index: 5000 !important;
  }

  /* PB HOVER - NEW TOP HEADER NAV MENU - MORE */
  .with-submenu {
      position: relative !important;
      display: inline-block !important;
  }
  li.with-submenu:hover a + nav,
  /* li.with-submenu a + nav , */
  li.with-submenu a + nav:hover,
  li.with-submenu a:hover + nav {
      position: absolute !important;
      display: inline-block !important;
      min-width: 100%;
      margin-top: 0px !important;
      padding: 5px 0px 5px 0px !important;
      text-align: left !important;
      z-index: 50000000 !important;
      opacity: 1 !important;
      visibility: visible !important;
  box-shadow: -3px 3px 2px black !important;
  background: #333 !important;
  }

  li.with-submenu a + nav li {
      height: 20px !important;
      line-height: 20px !important;
  }
  li.with-submenu a + nav li a {
      padding: 2px 2px 2px 10px !important;
      text-align: left !important;
  }

  /* SOLVED on ListingPage - move left */
  body[pagetype="PersonalProfile"] .with-submenu,
  body[pagetype="UserProfile"] .with-submenu,
  body[pagetype="ListingPage"] .with-submenu {
      position: fixed !important;
      display: inline-block !important;
      width: 92px;
      height: 15px !important;
      line-height: 15px !important;
      left: 14.3% !important;
      top: 110px !important;
      z-index: 5000000 !important;
  background: green;
  }
  body[pagetype="PersonalProfile"] .with-submenu:hover,
  body[pagetype="UserProfile"] .with-submenu:hover,
  body[pagetype="ListingPage"] .with-submenu:hover {
      width: 272px !important;
      height: 130px !important;
      line-height: 15px !important;
      margin-left: -160px !important;
  background: blue;
  }

  body[pagetype="PersonalProfile"] .with-submenu:hover > a,
  body[pagetype="UserProfile"] .with-submenu:hover > a,
  body[pagetype="ListingPage"] .with-submenu:hover > a {
      width: 272px !important;
      margin-left: 0px !important;
  background: blue;
  }
  body[pagetype="PersonalProfile"] .with-submenu > a,
  body[pagetype="UserProfile"] nav li.with-submenu > a,
  body[pagetype="ListingPage"] nav li.with-submenu > a {
      display: inline-block !important;
      height: 15px !important;
      width: 100% !important;
      line-height: 15px !important;
      padding-left: 5px;
  }

  /* ADAPT for GM "Greasyfork install button on search" (NOT Working with CITRUS)
  AND GM "GreasyFork - filter libraries in profiles" === */
  .thetitle + div #install-area {
      position: relative !important;
      float: left !important;
      max-width: 450px !important;
      min-width: 450px !important;
      margin-left: -4px !important;
      top: 0 !important;
      padding: 1px 4px !important;
      z-index: 1 !important;
      overflow: hidden !important;
  background-color: #f9ecdb !important;
  border-bottom: 1px solid gray;
  }
  .thetitle + div #install-area:hover {
      position: relative !important;
      height: auto !important;
      max-width: 450px !important;
      min-width: 450px !important;
      top: 0 !important;
      padding: 1px 4px !important;
      z-index: 5000 !important;
      overflow: visible !important;
  }
  .thetitle + div #install-area > a:first-of-type {
      float: left !important;
      clear: both !important;
      max-width: 150px !important;
      min-width: 150px !important;
      line-height: 13px !important;
      font-size: 10px !important;
      margin-left: 0 !important;
      text-align: center !important;
  }
  .thetitle + div #install-area > a:last-of-type {
      max-width: 20px !important;
      min-width: 20px !important;
      line-height: 13px !important;
      font-size: 10px !important;
      margin-left: 0 !important;
      text-align: center !important;
  }
  .thetitle + div #install-area form.script-in-sets {
      position: absolute !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 50px !important;
      max-height: 50px !important;
      max-width: 374px !important;
      min-width: 374px !important;
      left: 75px !important;
      top: 2px !important;
      font-size: 0px !important;
      overflow-x: hidden;
      overflow-y: auto;
  }

  .thetitle + div #install-area form.script-in-sets:hover {
      min-height: 150px !important;
      max-height: 200px !important;
      z-index: 500000 !important;
  border: 1px solid violet !important;
  }
  .thetitle + div #install-area .script-in-sets select {
      display: inline-block;
      max-width: 287px !important;
      min-width: 287px !important;
      margin-left: 0px !important;
      margin-top: 7px !important;
  }
  .tk.sel {
      color: #25B300 !important;
  }
  .tk.pro {
      color: #2a7da3 !important;
  }
  .tk.pun {
      color: #0F40A7 !important;
  }
  .tk.com {
      color: #9F7E15 !important;
  }

  /* FILTER - ADAP GM ==  (not apply on :not(.Mine))
  GreasyFork Bullshit Filter 
  AND GreasyFork - filter discussions on scripts by review type and author
  === */
  /* FILTER MENU */
  .filter-status:not(:empty),
  #script-content .filter-status:not(:empty) {
      position: fixed !important;
      height: 15px;
      line-height: 13px;
      width: auto;
      max-width: 200px;
      left: calc(20.5%);
      top: 1px !important;
      padding: 0px 3px;
      border-radius: 3px;
      text-align: center;
      font-size: 0px;
      cursor: pointer !important;
      z-index: 500000;
      transition: width ease 0.7s;
  color: white;
  background: #B38C25;
  }

  .filter-status:not(:empty):hover,
  #script-content .filter-status:hover:not(:empty) {
      height: 30px !important;
      width: 192px !important;
      padding: 0px 0 0px 70px;
      font-size: 13px !important;
      cursor: pointer !important;
  background: black;
  }
  .filter-status:not(:empty):before {
      content: "Filter  ▼ ";
      font-size: 15px;
  color: gold;
  }
  .filter-status:hover:not(:empty):before {
      /* content: "Filter  ►" ; */
      content: "Filter : ";
      display: inline-block !important;
      width: 190px !important;
      z-index: 50000 !important;
  color: white;
  }
  .filter-status + .filter-switches {
      position: fixed !important;
      display: inline-block !important;
      width: 200px !important;
      left: 20.8% !important;
      top: 0px !important;
      padding: 40px 0 5px 70px;
      border-radius: 0 0 5px 5px !important;
      text-align: center;
      transition: all ease 0.7s;
      z-index: 50000 !important;
      opacity: 0;
      visibility: hidden;
  background: #B38C25 !important;
  }

  .filter-status + .filter-switches:hover,
  .filter-status:hover + .filter-switches {
      opacity: 1 !important;
      visibility: visible !important;
  }
  /* .filter-status:first-of-type + .filter-switches ~  .filter-switches ,
  .filter-status:first-of-type + .filter-switches ~ .filter-status {
      display: none !important;
  } */
  :hover > .filter-switches a,
  .filter-switches a,
  #main-header .width-constraint + .filter-status ~ .filter-switches a,
  #Frame #Head.Head .filter-switches a,
  #script-content .filter-switches a {
      display: inline-block !important;
      width: 160px !important;
      height: 15px !important;
      line-height: 15px !important;
      margin-top: -2px !important;
      margin-left: 0px !important;
      font-size: 14px !important;
      cursor: pointer !important;
  color: white !important;
  background: blue !important;
  }
  #Frame #Head.Head .filter-switches a {
      color: white !important;
  }
  .ui-widget {
      position: fixed !important;
      width: 190px !important;
      top: 175px !important;
      left: calc(84.5%) !important;
  }
  .ui-widget #myform {
      width: 185px !important;
  }
  .ui-widget #myform input#authors {
      width: 180px !important;
  }
  .dropdown {
      position: fixed !important;
      width: 185px !important;
      left: calc(84.5%) !important;
      top: 228px !important
  }
  .dropbtn {
      width: 185px !important;
      padding: 5px 0px 5px 20px !important;
  }
  .dropdown-content {
      width: 185px !important;
      height: 400px !important;
      padding: 16px 0px 5px 0px !important;
  background-color: #222 !important;
  }
  #myDropdown.dropdown-content a {
      padding: 1px 0px 2px 5px !important;
      font-size: 15px !important;
      text-align: left !important;
      cursor: default !important;
  color: gray !important;
  background-color: #333 !important;
  }
  #myDropdown.dropdown-content a:hover {
      font-size: 15px !important;
  color: gold !important;
  background-color: #222 !important;
  }

  /* CIT */
  [pagetype="UserProfile"] .filter-status:not(:empty),
  [pagetype="PersonalProfile"] .filter-status:not(:empty),
  [pagetype="PersonalProfile"] .filter-status:not(:empty),
  [pagetype="ListingPage"] .filter-status:not(:empty) {
      top: 110px !important;
  background: red;
  }
  [pagetype="UserProfile"] .filter-status:not(:empty),
  [pagetype="PersonalProfile"] .filter-status:not(:empty) {
      left: 20.1%;
  }

  /* (new187) CIT */
  [pagetype="UserProfile"] .filter-status:not(:empty) + .filter-switches,
  [pagetype="PersonalProfile"] .filter-status:not(:empty) + .filter-switches,
  [pagetype="PersonalProfile"] .filter-status:not(:empty) + .filter-switches,
  [pagetype="ListingPage"] .filter-status:not(:empty) + .filter-switches {
      top: 100px !important;
  background: green !important;
  }
  [pagetype="UserProfile"] .filter-status:not(:empty) + .filter-switches,
  [pagetype="PersonalProfile"] .filter-status:not(:empty) + .filter-switches {
      left: 20.4% !important;
  }

  /* FITER DISC */
  .discussion-list .discussion-list-item.filtered {
      display: inline-block !important;
      min-width: 100% !important;
      height: 100% !important;
      min-height: 25px !important;
      max-height: 25px !important;
      margin-top: 0px !important;
      margin-bottom: 0px !important;
      padding: 2px 0 !important;
      font-size: 3px !important;
      overflow: hidden !important;
      opacity: 0.4 !important;
  }
  .discussion-list .discussion-list-item.filtered:hover {
      opacity: 1 !important;
  }
  .discussion-list .discussion-list-item.filtered a.discussion-title {
      position: relative !important;
      display: inline-block !important;
      width: 96% !important;
      height: 25px !important;
      line-height: 10px !important;
      margin-top: 0px !important;
      top: 0px !important;
      padding: 0 !important;
      font-size: 9px !important;
  }

  /* FILTER SCRIPTS - ListingPage - DISPLAY MINIMUM - + CIT === */
  #script-table tr.filtered,
  body[pagetype="ListingPage"] #script-table tr.filtered {
      display: table-row !important;
      width: 100% !important;
      height: 10px!important;
  }
  .discussion-list-item.filtered {
      display: inline-block !important;
      width: 100% !important;
      height: 10px!important;
      font-size: 7px !important;
  }
  .discussion-list-container .discussion-list-item.filtered a.discussion-title {
      display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 10px!important;
      max-height: 10px!important;
      line-height: 10px!important;
      padding: 0 !important;
      font-size: 7px !important;
  }

  #script-table tr.filtered:hover td,
  body[pagetype="ListingPage"] #script-table tr.filtered:hover td {
      background: black !important;
  }
  #script-table tr.filtered > td,
  body[pagetype="ListingPage"] #script-table tr.filtered > td {
      display: table-cell !important;
      height: 100% !important;
      min-height: 10px!important;
      max-height: 10px!important;
      padding: 0 !important;
      font-size: 7px !important;
  background-color: #F7F6E9 !important;
  }
  #script-table tr.filtered > td:last-of-type,
  body[pagetype="ListingPage"] #script-table tr.filtered > td:last-of-type {
      font-size: 8px !important;
  }
  #script-table tr.filtered > td:nth-child(2) .thetitle,
  body[pagetype="ListingPage"] #script-table tr.filtered > td:nth-child(2) .thetitle {
      font-size: 8px !important;
  }
  #script-table tr.filtered:hover > td:nth-child(2) .thetitle,
  body[pagetype="ListingPage"] #script-table tr.filtered:hover > td:nth-child(2) .thetitle {
      border-left: 1px solid red !important;
  }

  /* FILTER - HIDDE SCRIPT DESCRIPTION FOR FILTERED */
  #script-table tr.filtered > td:nth-child(2) .thetitle + div,
  body[pagetype="ListingPage"] #script-table tr.filtered > td:nth-child(2) .thetitle + div {
      display: table-cell !important;
      height: 2px !important;
      font-size: 2px !important;
      visibility: hidden !important;
  }

  /* FILTER - SHOW SCRIPT DESCRIPTION FOR FILTERED on DHOVER */
  #script-table tr.filtered:hover > td:nth-child(2) .thetitle + div,
  body[pagetype="ListingPage"] #script-table tr.filtered:hover > td:nth-child(2) .thetitle + div {
      display: table-cell !important;
      height: auto !important;
      width: 914px !important;
      font-size: 12px !important;
      line-height: 12px !important;
      z-index: 50000 !important;
      visibility: visible !important;
      border: 1px solid peru !important;
  border-left: 3px solid red !important;
  border-right: 3px solid red !important;
  border-bottom: 4px solid red !important;
  background-color: #f7f6e9 !important;
  }
  #script-table tr.filtered > td span + span,
  #script-table tr.filtered > td > span span,
  body[pagetype="ListingPage"] #script-table tr.filtered > td span + span,
  body[pagetype="ListingPage"] #script-table tr.filtered > td > span span {
      display: inline-block !important;
      display: none !important;
      height: 100% !important;
      min-height: 15px!important;
      max-height: 15px!important;
      padding: 0 !important;
      font-size: 8px !important;
  }
  #script-table tr.filtered > td > span.total-rating-coun,
  body[pagetype="ListingPage"] #script-table tr.filtered > td > span.total-rating-count {
      display: inline-block !important;
      height: 100% !important;
      min-height: 10px!important;
      max-height: 10px!important;
      line-height: 8px!important;
      padding: 0 !important;
      font-size: 9px !important;
  }
  /* FILTER - SCRIPT FEEDBAK  */
  .discussion-list-container .discussion-list-item.filtered a.discussion-title .rating-icon:before {
      position: relative !important;
      display: inline-block !important;
      line-height: 0px!important;
      top: 0px !important;
      margin-left: 0;
      font-size: 7px !important;
  }
  .discussion-list-container .discussion-list-item.filtered a.discussion-title .discussion-snippet {
      position: relative !important;
      display: inline-block !important;
      line-height: 0px!important;
      font-size: 7px !important;
  }

  /* FILTER - ALL COMMENTS (on top)  */
  .dropdown:hover #myDropdown.dropdown-content > a[onclick="showOnly('All')"],
  .dropdown:not(:hover) #myDropdown.dropdown-content > a[onclick="showOnly('All')"] {
      position: fixed !important;
      display: inline-block !important;
      left: calc(85.56%) !important;
      top: 232px !important;
      padding: 3px !important;
      border-radius: 100% !important;
      text-align: center !important;
  }
  /* for FILTER SCRIPT */
  .width-constraint + .filter-status {
      position: fixed !important;
  }
  .width-constraint + .filter-status + .filter-switches a {
      margin-left: 10px !important;
  }

  /* GREASY FORUM - CLEAR CONVERSTAION BUTTON - Small TXT */
  .Button.Danger.BigButton.ClearConversation {
      display: block;
      font-size: 11px!important;
      font-weight: bold;
      margin: 0 0 10px;
      padding: 8px 10px;
      text-align: center;
  }
  /* TEST - NOT Work - PB Ublock Origin + easy list (about _Ad.png) :
  reported - https://forums.lanik.us/viewtopic.php?f=64&t=26338
  https://greasyfork.org/fr/scripts/13725-youtube-fairblock
  ==== */
  img[src="/system/screenshots/screenshots/000/002/455/thumb/Muted_Ad.png?1447018329"] {
      display: inline-block !important;
  }
  .width-constraint #script-info > #script-content #additional-info img[style="display: none ! important;"][src*="_Ad"] {
      position: relative !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 100px !important;
      max-height: 100px !important;
      max-width: 98% !important;
      margin: 0 auto !important;
      padding: 2px !important;
      border-radius: 3px;
  box-shadow: 5px 5px 2px #181818 !important;
  color: yellow !important;
  background-color: #2b2b2b !important;
  border: 1px solid orange !important;
  }

  /* GM - LANG FILTER */
  #greazy-forq-info {
      position: fixed;
      top: 2px;
      left: 2px;
      cursor: pointer;
      z-index: 5000!important;
  color: #670000;
  text-shadow: 2px 2px 4px #311, -2px -2px 4px #f73;
  background: rgba(255, 255, 255, 0.55);
  }
  li.greazy-forq-hiden,
  .greazy-forq-hiden {
      border-width: 1px 0 1px 9px !important;
  }

  /* SCRIPT TABLE - RATING NUMBER - TS CIT */
  .good-rating-count,
  .ok-rating-count,
  .bad-rating-count {
      border-radius: 2px!important;
      display: inline-block !important;
      min-width: 15px!important;
      height: 13px !important;
      line-height: 11px !important;
      padding: 0px 2px !important;
      margin-right: 2px!important;
      margin-left: -2px!important;
      text-align: center !important;
      text-indent: 0px !important;
  }
  .total-rating-count {
      display: table-cell !important;
      width: 100% !important;
      height: 13px !important;
      line-height: 13px !important;
      padding: 0px 2px !important;
      border-radius: 2px!important;
  }

  /* PROFILE - CONTROL PANEL - HEADER - with CITRUS */
  body[pagetype="UserProfile"] #main-header + .width-constraint .text-content #user-profile + section header {
      margin-bottom: 2px;
      margin-top: -9px;
  }
  .width-constraint #script-list-option-groups.list-option-groups + header {
      float: right;
      width: 778px;
      min-height: 25px;
      max-height: 25px;
      line-height: 0px;
      margin-right: -26px;
      margin-top: 0px;
  }
  .width-constraint #script-list-option-groups.list-option-groups + header h3 {
      display: inline-block;
      width: 779px;
      min-height: 25px;
      max-height: 25px;
      line-height: 20px;
      margin-top: -3px;
      text-align: center;
  background: #222;
  }
  .width-constraint #script-list-option-groups.list-option-groups + header + #user-script-list {
      float: right;
      width: 778px;
      min-height: 844px;
      margin-top: 25px;
      margin-right: -29px;
  }

  /* SCRIPT LIST - ALL */
  .script-list,
  .user-list,
  .text-content {
      display: inline-block;
      margin-top: 0px;
  box-shadow: 3px 3px 2px black;
  background-color: #222;
  }
  .text-content.reportable {
      margin: 0;
      padding-bottom: 0;
  }
  #user-profile > p {
      margin-top: 0;
  }
  .text-content {
      width: 100%;
  }
  .white-panel,
  #user-discussions-on-scripts-written,
  #control-panel,
  #user-profile {
      background-color: transparent;
  }
  /* (new248++) SET COUNTER - cf GM "Utags"*/
  #main-header + .width-constraint > section.text-content + section {
      content: counter(myIndex, decimal);
      counter-increment: myIndex 0;
  }
  ul#user-script-sets > li:after {
      counter-increment: myIndex;
      content: counter(myIndex, decimal)"\\A sets";
      position: fixed;
      display: inline-block;
      float: none;
      width: 100%;
      min-width: 25px;
      max-width: 25px;
      height: 25px;
      line-height: 10px;
      top: 55px;
      left: 22.5%;
      margin-left: -45px;
      padding: 2px;
      font-size: 10px;
      text-align: center;
      text-indent: 0;
      border-radius: 100%;
      opacity: 1;
      visibility: visible;
      z-index: 500;
      color: white;
  background: green !important;
  }
  /* CIT */
  body[pagetype="PersonalProfile"] #main-header + .width-constraint > section.text-content + section + section .white-panel ul > li:after {
      top: 56px;
  }
  /* "★" - SETS/FAV SCRIPTS - CITRUS - PERSO/USER PROF - #user-script-sets-section */
  /* FAV SCRIPTS - without CITRUS */
  #user-script-sets-section header {
      margin-top: -31px;
      margin-bottom: -10px;
  }
  #user-script-sets-section #user-script-sets {
      max-height: 500px;
      margin-top: 0px;
      padding-top: 10px;
      padding-left: 0px;
      overflow: hidden;
      overflow-y: auto;
  }
  #user-script-sets-section:before {
      content: "★";
      position: absolute;
      height: 23px;
      width: 24px;
      font-size: 15px;
      text-align: center;
  color: red;
  background: gold;
  border: 1px solid red;  
  }
  #user-script-sets-section:hover header {
      height: 27px;
      line-height: 0;
      margin-top: 26px;
      margin-bottom: 0px;
  color: red;
  background: gold;
  }
  #user-script-sets-section:hover:hover header h3 {
      width: 800px;
      height: 25px;
      line-height: 25px;
      text-align: center;
  }
  #user-script-sets-section:hover:hover section.text-content {
      border: none;
  }
  #user-script-sets-section {
      position: fixed;
      height: 100%;
      min-width: 24px;
      max-height: 25px;
      width: 20px;
      top: 32px;
      left: 21.6%;
      margin-top: 25px;
      margin-bottom: 10px;
      font-size: 0;
      overflow: hidden;
      transition: height ease 0.7s;
      z-index: 50 !important;
  background: black;
  }
  /* SET - CITRUS */
  body[pagetype="UserProfile"] #user-script-sets-section,
  body[pagetype="PersonalProfile"] #user-script-sets-section {
      top: 37px;
      left: 24.6%;
  }

  /* (new248++) SET COUNTER - CITR - cf Utags */
  body[pagetype="UserProfile"] #user-script-sets-section ul#user-script-sets > li::after,
  body[pagetype="PersonalProfile"] #user-script-sets-section ul#user-script-sets > li::after {
      content: counter(myIndex, decimal) "\\a sets";
      counter-increment: myIndex 1;
      position: fixed;
      display: inline-block;
      float: none;
      height: 25px;
      line-height: 10px;
      max-width: 25px;
      min-width: 25px;
      top: 60px;
      left: 25.3%;
      margin-left: -45px;
      padding: 2px;
      border-radius: 100%;
      text-align: center;
      text-indent: 0;
      font-size: 10px;
      opacity: 1;
  color: white;
  background: green !important;
  }
  body[pagetype="UserProfile"] #user-script-sets-section ul#user-script-sets li::after {
      top: 66px;
  }
  body[pagetype="UserProfile"] #user-script-sets-section:hover,
  body[pagetype="PersonalProfile"] #user-script-sets-section:hover,
  #user-script-sets-section:hover {
      height: auto;
      max-height: 90vh !important;
      width: 965px !important;
      left: 24.1% !important;
      font-size: 15px;
      overflow: hidden;
      transition: height ease 2s;
  box-shadow: 7px 7px 3px 1px rgba(0, 0, 0, 0.9);
  border: 1px solid red;
  }
  #user-script-sets-section:hover {
      margin-top: 23px !important;
      z-index: 50 !important;
  }
  /* (new254) SET CITRUS .white-panel*/
  #user-script-sets-section:hover .white-panel {
      position: relative !important;
      display: inline-block;
      height: auto;
      width: 953px;
      top: 10px;
      overflow: hidden;
  background-color: black;
  }
  #user-script-sets-section:hover .white-panel ul#user-script-sets {
      display: inline-block;
      height: 100%;
      min-height: 30px;
      max-height: 330px;
      width: 930px;
      margin-top: 0px;
      margin-left: 0px;
      margin-bottom: 0px;
      font-size: 15px;
      overflow: hidden auto;
      overscroll-behavior-y: contain !important;
  background-color: #222;
  }
  /* SET - CITRUS */
  #user-script-sets-section:hover .white-panel ul#user-script-sets {
      display: inline-block;
      height: 100%;
      min-height: 30px;
      max-height: 80vh !important;
      width: 945px;
      margin-top: 0px;
      margin-left: 5px;
      margin-bottom: 20px;
      font-size: 15px;
      overflow: hidden;
      overflow-y: auto;
  border-top: 1px dashed red;
  }
  section:hover ul#user-script-sets > li,
  #user-script-sets-section:hover .white-panel ul#user-script-sets > li {
      float: left;
      clear: both;
      width: 900px;
      line-height: 20px;
      margin-bottom: 2px;
      padding: 0 5px;
      text-indent: 18px;
  }
  /* "🛠 ▼ " - CONTROL PANEL - PROFILE - ALL */
  #control-panel {
      position: fixed !important;
      display: inline-block;
      height: 25px;
      width: 47px;
      top: 57px;
      left: 31.3%;
      margin-top: 0px;
      padding: 0;
      font-size: 0;
      overflow: hidden;
      transition: height ease 0.7s;
      z-index: 5000 !important;
  }
  /* CITRUS */
  body[pagetype="PersonalProfile"] #control-panel {
      position: fixed;
      top: 62px;
      left: 35%;
      z-index: 5000 !important;
  }
  #control-panel:hover {
      height: auto;
      width: 200px;
      margin-top: 0;
      font-size: 15px;
      overflow: hidden;
      z-index: 1600;
      transition: height ease 0.7s;
      box-shadow: 7px 7px 3px 1px rgba(0, 0, 0, 0.9);
  background: black !important;
  border: 1px solid red;
  }
  .width-constraint > .text-content #control-panel::before {
      content: "🛠 ▼";
      position: absolute;
      height: 23px;
      width: 45px;
      top: 0px;
      left: 0;
      white-space: normal;
      font-size: 15px;
      text-align: center;
      z-index: 500;
  color: red;
  background: green;
  border: 1px solid red;
  }
  #control-panel header {
      margin-bottom: 2px;
      margin-top: 3px;
      padding-left: 45px;
      text-align: center;
  }
  #control-panel:hover h3 {
      line-height: 13px;
      font-size: 13px;
      margin-bottom: 15px;
  }
  ul#user-control-panel {
      padding: 5px;
  }
  ul#user-control-panel > li {
      display: inline-block;
      width: 95%;
      line-height: 13px;
      margin: 2px;
      padding: 2px 1px;
      border-radius: 3px;
      text-align: left;
      font-size: 13px;
  box-shadow: 3px 3px 2px black;
  background-color: #333;
  border: 1px solid #404040;
  }


  /* (new255) RAPPORT */
  #about-user .report-link.report-link-abs,
  #about-user .report-link.report-link {
      position: fixed !important;
      display: inline-block;
      top: 6vh !important;
      margin: 0px 0px 0 0 !important;
      text-align: right;
      z-index: 5 !important;
  background: #222!important;
  }
  /* HOVER */
  #about-user .report-link.report-link-abs:hover,
  #about-user .report-link.report-link:hover {
      background: #8e1c1c !important;
  }

  /* (new219) SEND MES - ORIGINAL */
  .text-content.reportable > p:not(:empty) {
      position: fixed !important;
      float: none !important;
      width: 23px !important;
      height: 3vh !important;
      line-height: 3vh !important;
      margin: 0 0 0 0 !important;
      top: 5.6vh !important;
      left: 67vw !important;
      border-radius: 3px !important;
      text-align: center !important;
  background: blue !important;
  }

  .text-content.reportable > p:not(:empty) a {
      font-size: 0px !important;
  }
  .text-content.reportable > p:not(:empty) a:before {
      content: "✉️" !important;
      position: absolute !important;
      float: none !important;
      width: 22px !important;
      height: 3vh !important;
      line-height: 3vh !important;
      margin: 0 0 0 0 !important;
      top: 0 !important;
      left: 0!important;
      font-size: 15px !important;
      text-align: center !important;
  }

  /* "ℹ️" /"🔻" -  ABOUT - PROF - OTHERS - ADD "ℹ️" or 👁 - no CITRUS */
  #about-user.text-content.reportable #user-profile:not(:empty):not(:hover):after {
      content: "👁";
      position: absolute;
      display: inline-block;
      height: 23px;
      width: 24px;
      top: 0px;
      left: 0;
      font-size: 15px;
      text-align: center;
      z-index: 500;
      visibility: visible;
  color: tomato;
  background: gold;
  }
  #about-user.text-content.reportable #user-profile:not(:empty):hover:after {
      content: "🔻";
      position: fixed;
      display: inline-block;
      height: 26px;
      width: 715px;
      top: 57px;
      left: 23.1%;
      font-size: 15px;
      text-align: left;
      z-index: 0;
  background: black;
  border-bottom: 1px solid red;
  }
  /*  CITRUS */
  body[pagetype="PersonalProfile"] #about-user.text-content.reportable #user-profile:not(:empty):hover::after {
      top: 58px;
      left: 26.2%;
  }
  body[pagetype="UserProfile"] #about-user.text-content.reportable #user-profile:not(:empty):hover::after {
      top: 62px;
      left: 26.2%;
  }
  #user-profile:not(:empty) {
      position: fixed !important;
      display: inline-block !important;
      top: 57px;
      left: 23%;
      width: 100%;
      min-width: 24px;
      max-width: 24px;
      min-height: 23px;
      max-height: 23px;
      padding: 0px;
      font-size: 0;
      overflow: hidden;
      transition: all ease 0.2s;
      z-index: 5000000 !important;
  background: black !important;
  border: 1px solid red;
  }
  #user-profile:not(:empty):hover {
  position: fixed !important;
      display: inline-block;
      min-width: 660px;
      max-width: 660px;
      height: auto;
      min-height: 23px;
      max-height: 250px;
      padding: 30px 30px;
      font-size: 15px;
      overflow-y: auto;
      transition: all ease 0.2s;
      z-index: 0 !important;
  box-shadow: 7px 7px 3px 1px rgba(0, 0, 0, 0.9);
  background: black;
  }

  /*  ABOUT - USER PROFILE - PERSONAL PROFILE and USER PROFILE */
  /*  CIT */
  body[pagetype="PersonalProfile"] #user-profile:not(:empty) {
      top: 62px;
      left: 25.2%;
      overflow: hidden;
      transition: visibility ease 0.2s;
      visibility: hidden;
  }
  body[pagetype="PersonalProfile"] #user-profile:not(:empty):hover {
      min-width: 660px;
      max-width: 660px;
      height: auto;
      min-height: 23px;
      max-height: 250px;
      padding: 30px 30px;
      font-size: 15px;
      overflow-y: auto;
      z-index: 500;
      transition: visibility ease 0.2s;
      visibility: visible;
  background: black;
  }

  /* CONSERSATION - no CITS */
  section#user-conversations {
      position: fixed;
      height: 100%;
      max-height: 23px;
      min-width: 24px;
      width: 20px;
      top: 32px;
      left: 24.7%;
      margin-top: 25px;
      margin-bottom: 10px;
      font-size: 0;
      overflow: hidden;
      transition: height ease 0.7s;
      z-index: 50 !important;
  background: red !important;
  border: 1px solid red;
  }
  body[pagetype="UserProfile"] section#user-conversations,
  body[pagetype="PersonalProfile"] section#user-conversations {
      top: 37px;
      left: 32.7% !important;
  border: 1px solid red;
  }
  section#user-conversations:before {
      content: "📢";
      display: inline-block;
      height: 24px;
      width: 24px;
      font-size: 15px;
      text-align: center;
      z-index: 50;
  background: gold;
  }
  section#user-conversations:hover {
      position: fixed;
      height: auto;
      max-height: 200px;
      min-width: 24px;
      width: 400px;
      top: 32px;
      left: 24.7%;
      margin-top: 25px;
      margin-bottom: 10px;
      border-radius: 0 0 5px 5px;
      font-size: 0;
      overflow: hidden;
      transition: height ease 0.7s;
      z-index: 50 !important;
  border: 1px solid gray;
  background: black !important;
  }
  section#user-conversations:hover > header {
      display: inline-block;
      width: 100%;
      height: 100%;
      min-height: 25px;
      max-height: 25px;
      margin-top: 2px;
      margin-bottom: 1px;
      font-size: 15px;
      color: red !important;
  }
  section#user-conversations:hover > .text-content,
  section#user-conversations:hover > header > h3 {
      display: inline-block;
      width: 100%;
      padding: 0 5px;
      font-size: 15px !important;
  }
  section#user-conversations:hover > header > h3 {
      height: 100%;
      min-height: 25px;
      max-height: 25px;
      margin-top: 0px;
  background: gold !important;
  }
  section#user-conversations:hover > .text-content {
      border-radius: 0 0 5px 5px;
  }

  /* DISCS - no CITS */
  #user-discussions header {
      font-size: 15px;
  }
  #user-discussions:before {
      content: "💬  ";
      position: relative;
      display: inline-block;
      min-width: 25px;
      max-width: 25px;
      min-height: 23px;
      max-height: 23px;
      text-align: center;
  background: gold;
  }
  #user-discussions:hover:before {
      position: absolute;
      top: 0px !important;
  background: gold;
  }
  body[pagetype="UserProfile"] #user-discussions:hover:before {
      top: 0px !important;
  background: gold;
  }

  body[pagetype="PersonalProfile"] #user-discussions:hover:before {
      top: 0px !important;
  background: green;
  }
  #user-discussions {
      position: fixed;
      display: inline-block;
      top: 57px;
      left: 27.8%;
      width: 100%;
      min-width: 25px;
      max-width: 25px;
      min-height: 23px;
      max-height: 23px;
      padding: 0px;
      font-size: 15px;
      overflow: hidden;
      transition: all ease 0.2s;
      z-index: 500;
  border: 1px solid red;
  }
  #user-discussions:hover {
      width: 100%;
      min-width: 600px !important;
      max-width: 600px !important;
      min-height: 400px;
      height: auto;
      border-radius: 0 0 5px 5px;
      font-size: 15px;
      overflow: hidden;
      transition: all ease 0.2s;
      z-index: 500;
  background: black !important;
  border: 1px solid red;
  }
  #user-discussions:hover header {
      position: absolute;
      display: inline-block;
      width: 100%;
      height: 24px;
      line-height: 24px;
      top: 25px;
      left: 0px;
      overflow: hidden;
  background: gold;
  }
  #user-discussions:hover header h3 {
      margin-top: 0px;
      padding-left: 30px;
      font-size: 15px;
  color: red;
  }
  #user-discussions:hover .text-content {
      margin-top: 28px;
      border: none;
  }
  /* NEED COR MARGIN -  */
  #user-discussions:hover .discussion-list-item,
  body[pagetype="PersonalProfile"] #user-discussions:hover .discussion-list-item,
  #user-discussions:hover ul,
  body[pagetype="PersonalProfile"] #user-discussions:hover ul {
      display: inline-block;
      left: 0px;
      width: 100%;
      height: auto;
      line-height: 13px;
      margin-top: 0px !important;
      padding: 0;
      font-size: 13px;
      overflow: hidden;
      overflow-y: auto;
      transition: all ease 0.2s;
      z-index: 50;
  border: none !important;
  border-bottom: 1px solid red !important;
  }
  body[pagetype="UserProfile"] #user-discussions:hover ul a:first-of-type + a,
  #user-discussions:hover .discussion-list > li > a:first-of-type,
  #user-discussions:hover .discussion-list-item .discussion-title,
  #user-discussions:hover .discussion-list-item .discussion-meta {
      display: inline-block;
      width: 98% !important;
      padding: 1px 5px 1px 10px !important;
  }
  body[pagetype="UserProfile"] #user-discussions:hover ul a:first-of-type + a {
      position: relative;
      top: -15px !important;
      margin-bottom: -40px;
  }
  #user-discussions:hover .discussion-list > li > a:first-of-type:before,
  #user-discussions:hover .discussion-list-item .discussion-title:before,
  .discussion-meta-item.discussion-meta-item-script-name a[href*="/scripts/"]:before {
      content: " ";
      width: 15px;
      height: 15px;
      float: left;
      margin-left: -2px;
      margin-right: 5px;
  }

  .discussion-meta-item.discussion-meta-item-script-name a:before {
      content: "►";
      margin-left: 0px;
      margin-right: 10px;
      background-color: transparent;
  }
  #user-discussions .text-content ul li > a[href*="/scripts/"]:before,
  #user-discussions:hover .discussion-list > li > a:first-of-type:before,
  .discussion-meta-item.discussion-meta-item-script-name a[href*="/scripts/"]:before {
      content: " ";
      font-size: 12px;
      background-color: transparent;
      background-image: url("http://userscripts-mirror.org/images/script_icon.png");
  }

  body[pagetype="UserProfile"] #user-discussions:hover ul a:first-of-type + a:before,
  #user-discussions-on-scripts-written:hover .discussion-list-item .discussion-title:before {
      content: "💬  ";
      font-size: 12px;
  }
  #user-discussions .text-content > ul > li > a,
  #user-discussions .text-content > ul > li > a[href*="#comment-"] {
      font-size: 0 !important;
  }
  #user-discussions .text-content > ul > li > a i {
      font-size: 12px !important;
  color: peru !important;
  }
  #user-discussions .text-content > ul > li > a i:before {
      content: "💬 Disc :  ";
      font-size: 12px !important;
  color: green !important;
  }

  /* #user-discussions .text-content>ul>li>a[href*="#comment-"] i:before , */
  #user-discussions .text-content > ul > li > a[href*="#comment-"][href^="/scripts/"] i:before {
      content: "💬 Review :  ";
      font-size: 12px !important;
  color: gold !important;
  }
  #user-discussions .text-content > ul li a[href^="/discussions/development/"] i:before {
      content: "💬 Dev :  ";
      font-size: 12px !important;
  color: aqua !important;
  }

  /* A VOIR (no UL) */
  #user-discussions:hover ul li:not(.discussion-question),
  body[pagetype="PersonalProfile"] #user-discussions:hover ul li:not(.discussion-question) {
      display: block;
      width: 97%;
      height: auto;
      line-height: 17px;
      margin-bottom: 3px;
      padding: 1px 3px;
      white-space: pre-line;
      overflow: hidden;
  }
  /* COR display: inline; */
  body[pagetype="UserProfile"] #user-discussions:hover ul a:not(:first-of-type) {
      width: auto;
  }
  body[pagetype="UserProfile"] #user-discussions:hover ul a:first-of-type + a {
      display: inline-block;
      width: 97%;
  }
  /* COR FLOAT */
  #user-discussions:hover ul a:first-of-type,
  body[pagetype="PersonalProfile"] #user-discussions:hover ul a:first-of-type {
      display: block;
      float: left;
      width: 100%;
  }
  /* QUEST */
  body[pagetype="PersonalProfile"] #user-discussions:hover ul + .discussion-list-item {
      padding-top: 0px;
      border-top: 1px solid #ccc;
  }
  body[pagetype="PersonalProfile"] #user-discussions:hover ul + .discussion-list-item .discussion-meta {
      display: inline-block;
      width: 100%;
  }
  body[pagetype="PersonalProfile"] #user-discussions:hover ul + .discussion-list-item .discussion-meta .discussion-meta-item-script-name {
      display: inline-block;
      width: 99%;
      padding: 2px;
      overflow: hidden;
      text-align: center;
  border: 1px solid red;
  }
  body[pagetype="PersonalProfile"] #user-discussions:hover ul + .discussion-list-item a.discussion-title {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      padding: 4px 0 14px;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
  color: peru !important;
  }

  /* DISC - UserProfile - CIT */
  body[pagetype="UserProfile"] #user-discussions:not(:empty),
  body[pagetype="UserProfile"] #user-discussions:not(:empty) {
      position: fixed;
      min-width: 25px;
      max-width: 25px;
      height: 23px;
      line-height: 24px;
      top: 70px;
      left: 29%;
      white-space: nowrap;
      z-index: 500;
  border: 1px solid red;
  }
  body[pagetype="UserProfile"] #user-discussions:not(:empty):hover,
  body[pagetype="UserProfile"] #user-discussions:not(:empty):hover {
      min-height: 465px;
  background: blue;
  }
  /* DISC - NORMAL */
  #user-discussions li {
      line-height: 17px;
      margin-bottom: 3px;
      padding: 1px 3px;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  }
  #user-discussions ul.discussion-list > li:nth-child(even) {
      background: #222;
  }
  body[pagetype="UserProfile"] #user-discussions:not(:empty) > h3,
  body[pagetype="UserProfile"] #user-discussions:not(:empty) > h3 {
      min-width: 24px;
      max-width: 24px;
      margin: 0 0 0 0px;
      font-size: 0;
      white-space: nowrap;
      overflow: hidden;
  background: blue;
  }

  /* "🗨" - DISCUSS OLD/NEW about USER'S SCRIPT - PROFILE - USER / PERSONAL - ALL */
  #user-discussions-on-scripts-written {
      position: fixed;
      display: inline-block;
      height: 100%;
      max-height: 23px !important;
      width: 100% !important;
      min-width: 25px !important;
      max-width: 25px !important;
      top: 32px;
      left: 26.1%;
      margin-top: 25px;
      margin-bottom: 10px;
      font-size: 0;
      overflow: hidden !important;
      transition: height ease 0.7s;
      z-index: 500 !important;
  background: black;
  border: 1px solid red;
  }
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written {
      top: 37px;
      left: 27.5%;
  }
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written:after,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written:after,
  #user-discussions-on-scripts-written:after,

  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written:after,
  #user-discussions-on-scripts-written:after {
      content: "🗨";
      position: absolute;
      display: inline-block;
      height: 22px;
      width: 25px;
      top: 0px;
      left: 0;
      font-size: 15px;
      text-align: center;
      z-index: 500;
  color: tomato;
  border: 1px solid red;
  background: gold;
  }

  /* DISC - NORMAL */
  #user-discussions-on-scripts-written:not(:hover) .discussion-list {
      position: absolute;
      display: inline-block;
      height: 23px;
      min-width: 26px;
      max-width: 26px;
      margin: auto;
      top: 69px;
      left: 29%;
      padding: 0px;
      overflow: hidden;
  }
  /* DISC - PersProf/UserProf  - CIT */
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written ul.discussion-list,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written ul.discussion-list {
      top: 20px;
      left: 9.5%;
  border: 1px solid red;
  }
  /* DISC - NORMAL */
  #user-discussions-on-scripts-written:hover header + ul.discussion-list,
  #user-discussions-on-scripts-written header:hover + ul.discussion-list {
      position: absolute;
      display: inline-block;
      height: 100%;
      max-height: 300px;
      min-width: 450px;
      max-width: 450px;
      margin: auto;
      top: 69px;
      left: 29%;
      padding: 25px 5px 18px 5px;
      overflow-y: auto;
      z-index: 500;
  box-shadow: 7px 7px 3px 1px rgba(0, 0, 0, 0.9);
  background-color: black;
  border: 1px solid red;
  }
  /* DISCUS - FILTERED - NORMAL */
  #user-discussions-on-scripts-written:hover header + .discussion-list li#filtered:not(.Mine) {
      display: inline-block;
  }

  /* DISC - PersonalProfile - CIT */
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written:hover header + ul.discussion-list,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written header:hover + ul.discussion-list {
      position: absolute;
      display: inline-block;
      height: 100%;
      max-height: 300px;
      min-width: 450px;
      max-width: 450px;
      margin: auto;
      top: 22px;
      left: 29%;
      padding: 25px 5px 18px 5px;
      overflow-y: auto;
      z-index: 500;
  box-shadow: 7px 7px 3px 1px rgba(0, 0, 0, 0.9);
  border: 1px solid red;
  }
  /* DISC - HOVER - UserProf - CIT */
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written ul.discussion-list,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written ul.discussion-list {
      display: inline-block !important;
      width: 100%;
      height: 100%;
      min-height: 350px !important;
      max-height: 350px !important;
      margin-top: 0px;
      left: 5px;
      padding: 5px;
      white-space: normal !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  background: #333;
  }
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written:hover header + ul.discussion-list,
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written header:hover + ul.discussion-list {
      position: absolute;
      display: inline-block;
      height: 100%;
      max-height: 300px;
      min-width: 450px;
      max-width: 450px;
      margin: auto;
      top: 22px;
      left: 29%;
      padding: 25px 5px 18px 5px;
      overflow-y: auto;
      visibility: visible;
      z-index: 500;
  box-shadow: 7px 7px 3px 1px rgba(0, 0, 0, 0.9);
  background-color: red;
  border: 1px solid yellow;
  }
  /* DISC - UserProf - CIT */
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written:not(:hover) ul.discussion-list {
      top: 0px !important;
      left: -2px !important;
      right: 0;
      box-shadow: none;
  }
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written:not(:hover) ul.discussion-list:empty:before,
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written:hover ul.discussion-list:empty:before {
      content: "No Comments";
      display: inline-block;
      height: 30px;
      line-height: 30px;
      margin: 10px 0 -30px 0;
      padding: 0 130px;
  }
  body[pagetype="UserProfile"] #main-header + .width-constraint > section.text-content + section + .sidebarred + #user-discussions-on-scripts-written:not(:empty):hover ul.discussion-list {
      display: inline-block;
      width: 100%;
      height: 100%;
      max-height: 200px;
      margin: 0px;
      left: 0;
      top: 25px;
      border-radius: 0;
      overflow: hidden;
      overflow-y: auto;
      visibility: visible;
  background: #333;
  }
  /*  SCRIP LIST - NEW DISCS */
  body[pagetype="PersonalProfile"] #user-discussions {
      left: 30.7% !important;
      top: 62px !important;
  border: 1px solid red;
  }
  body[pagetype="UserProfile"] #user-discussions {
      left: 30.7% !important;
      top: 70px !important;
  border: 1px solid red;
  }
  #user-discussions-on-scripts-written:hover {
      display: inline-block;
      width: 100%;
      min-width: 900px !important;
      max-width: 900px !important;
      min-height: 240px !important;
      padding: 0;
      font-size: 15px;
      border-radius: 0 0 5px 5px;
      overflow: hidden;
      transition: all 0.2s ease 0s;
      z-index: 50 !important;
  background: black;
  border: 1px solid red;
  }
  #user-discussions-on-scripts-written:hover header {
      position: relative;
      display: inline-block;
      height: 25px;
      width: 100%;
  }
  #user-discussions-on-scripts-written:hover header h3 {
      position: relative;
      display: inline-block;
      width: 100%;
      margin-top: 25px;
      text-align: center;
  color: red;
  background: gold;
  }

  body[pagetype="UserProfile"] #user-discussions-on-scripts-written:hover,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written:hover {
      padding-bottom: 40px;
  }
  #user-discussions-on-scripts-written:hover .text-content {
      position: relative;
      display: inline-block;
      width: 100%;
      height: 100% !important;
      min-height: 185px !important;
      max-height: 185px !important;
      margin-top: 0px;
      border-radius: 0;
      overflow: hidden;
      overflow-y: auto;
      border: none;
      border-bottom: 1px solid red;
  }
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written .text-content > ul,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written .text-content > ul {
      height: 150px;
      margin-top: 0;
      margin-bottom: 8px;
      overflow-x: hidden;
      overflow-y: auto;
      border-bottom: 1px solid red;
  }
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written .text-content > ul > li,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written .text-content > ul > li {
      line-height: 15px;
  }
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written .text-content > ul > li > a,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written .text-content > ul > li > a {
      line-height: 15px;
      font-size: 0px;
  }
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written .text-content > ul > li > a i,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written .text-content > ul > li > a i {
      line-height: 15px;
      font-size: 15px;
  }
  body[pagetype="UserProfile"] #user-discussions-on-scripts-written .text-content > ul > li > a i:before,
  body[pagetype="PersonalProfile"] #user-discussions-on-scripts-written .text-content > ul > li > a i:before {
      content: "💬";
      margin-right: 5px;
  }

  /* RSS FEED FORUM AUTOR - NORMAl  */
  #user-discussions-on-scripts-written > h3 > a[href*="/forum/discussions/feed.rss?script_author="] {
      position: fixed;
      display: inline-block;
      margin-top: 0px;
      margin-left: 35%;
      font-size: 13px;
      z-index: 5000;
  }
  /* USER PROF -  SETS - for long SETS DESCR - with / without GM " CIT" */
  #main-header + .width-constraint .text-content #user-profile + section header + #user-script-sets {
      display: inline-block!important;
      margin-left: -13px !important;
      margin-bottom: 0 !important;
      margin-top: -14px !important;
      padding-left: 6px !important;
  }
  /* (new240) USER PROF -  SETS - CITRUS */
  body[pagetype="UserProfile"] #main-header + .width-constraint .text-content #user-profile + section header + #user-script-sets {
      display: inline-block!important;
      margin-left: -13px !important;
      margin-top: 4px !important;
      padding-left: 6px !important;
  }
  #user-script-sets > li {
      float: right;
      clear: both;
      width: 935px !important;
      line-height: 20px !important;
      margin-bottom: 2px !important;
      padding: 0 5px !important;
      text-indent: -18px !important;
  }
  #user-script-sets > li:nth-child(odd) {
      background: #333 !important;
  }
  #user-script-sets > li:nth-child(even) {
      background: black !important;
  }
  #user-script-sets > li:hover {
      color: tomato !important;
  }
  #user-script-sets > li:before {
      content: "👁️‍🗨️ ";
      margin-left: 15px;
      margin-right: 15px;
      width: 17px;
      color: red;
  }
  #user-script-sets > li a[href*="/scripts?set="] {
      display: inline-block;
      width: auto !important;
      line-height: 20px;
      margin-bottom: -3px;
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      color: transparent;
  }
  #user-script-sets > li a[href*="/scripts?set="]:before {
      content: " ";
      position: relative;
      float: left;
      height: 100%;
      max-height: 15px;
      min-height: 15px;
      width: 100%;
      min-width: 25px;
      max-width: 25px;
      margin-left: -2px;
      top: 4px;
      font-size: 20px !important;
  color: gold !important;
  }
  #user-script-sets > li:hover > a[href$="/edit"] {
      display: inline-block !important;
      height: 15px !important;
      line-height: 18px !important;
      margin-left: 15px !important;
      padding: 2px 4px !important;
  color: gold !important;
  }
  #user-script-sets > li:hover > a:not([href$="/edit"]) {
      display: inline-block !important;
  }

  /* USER PROF -  SETS - USER SETS (ON HOVER)  CIT - #script-table + */
  #main-header + #script-table + .pagination + #UserSets,
  #main-header + #script-table + #UserSets {
      position: fixed !important;
      left: 27.5% !important;
      top: 48px!important;
      padding: 2px 10px;
      border-radius: 5px;
      z-index: 200000 !important;
      opacity: 1 !important;
      background-color: yellow;
  }
  #main-header + #script-table + .pagination + #UserSets:before,
  #main-header + #script-table + #UserSets:before {
      content: "Your Sets ▼ " !important;
      position: fixed !important;
      display: inline-block !important;
      top: 48px !important;
      left: 27.5% !important;
      padding: 1px 5px !important;
      border-radius: 5px;
      font-size: 12px !important;
      visibility: visible !important;
      z-index: 200000 !important;
      opacity: 1 !important;
      background-color: yellow;
  }
  #main-header + #script-table + .pagination + #UserSets:hover,
  #main-header + #script-table + #UserSets:hover {
      opacity: 1 !important;
      visibility: visible !important;
  }

  /* ==== FAV /SETS PAGES - TXT  "POST A SCRIPT / LEARN TO SCRIPT" / NO SCRIPTS FOUND" */
  /* FAVORITS / SETS PAGES - TXT "FAVORIS BY...." */
  #UserSets + .width-constraint > h3 {
      position: fixed !important;
      display: inline-block !important;
      width: 300px !important;
      height: 20px !important;
      line-height: 17px !important;
      top: 60px !important;
      margin-left: 250px !important;
      padding: 0 2px !important;
      font-size: 12px !important;
      text-align: left !important;
      border-radius: 3px !important;
      background: #333 !important;
  }
  #UserSets + .width-constraint > h3 a {
      display: inline-block !important;
      max-width: 80px !important;
      height: 15px !important;
      line-height: 15px !important;
      margin-top: 0px !important;
      font-size: 13px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
  color: gold !important;
  }
  #UserSets + .width-constraint > h3 a:hover {
      color: tomato !important;
  }
  #UserSets + .width-constraint > h3 > a[href$="/edit"] {
      position: absolute !important;
      display: inline-block !important;
      height: 15px !important;
      line-height: 15px !important;
      width: 40px !important;
      top: 2px !important;
      margin-left: 25% !important;
      padding: 2px 2px 2px 15px !important;
      border-radius: 3px !important;
      font-size: 14px !important;
      opacity: 0 !important;
      z-index: 1500 !important;
  background: rgba(145, 124, 124, 0.42) url("https://greasyfork.org/fr/forum/applications/dashboard/design/images/profile-sprites.png") no-repeat scroll 2px -134px !important;
  }
  #UserSets + .width-constraint > h3:hover > a[href$="/edit"] {
      position: absolute !important;
      display: inline-block !important;
      height: 15px !important;
      line-height: 15px !important;
      width: 40px !important;
      top: 20px !important;
      margin-left: 27% !important;
      padding: 2px 2px 2px 15px !important;
      border-radius: 3px !important;
      font-size: 14px !important;
      opacity: 1 !important;
      z-index: 1500 !important;
  background: rgba(145, 124, 124, 0.42) url("https://greasyfork.org/fr/forum/applications/dashboard/design/images/profile-sprites.png") no-repeat scroll 2px -134px !important;
  }

  /* FAV / SETS PAGES - TXT "POST A SCRIPT - LEARN TO SCRIPT" */
  #UserSets + .width-constraint > p {
      padding: 2px 2px 2px 20px !important;
      z-index: 500 !important;
  background: rgba(145, 124, 124, 0.42) url("https://greasyfork.org/fr/forum/applications/dashboard/design/images/profile-sprites.png") no-repeat scroll 2px -134px !important;
  }
  #UserSets + .width-constraint > p {
      padding: 2px 2px 2px 20px !important;
      z-index: 500 !important;
  background: rgba(145, 124, 124, 0.42) url("https://greasyfork.org/fr/forum/applications/dashboard/design/images/profile-sprites.png") no-repeat scroll 2px -134px !important;
  }

  /* FAVORITS / SETS PAGES - TXT SET TITTLE or "NO SCRIPT FOUND" - WITH INDICATOR - VISIBLE ON HOVER - ===  */
  #UserSets + .width-constraint h3:not(:hover) ~ p:nth-last-of-type(n + 2):not(:hover):before,
  .width-constraint h3:not(:hover) + .script-author-description ~ p:nth-last-of-type(n + 2):not(:hover):before {
      content: "► Desc " !important;
      position: fixed !important;
      min-width: 60px !important;
      max-width: 60px !important;
      top: 71px !important;
      margin-left: -290px !important;
      padding: 2px 2px 2px 10px !important;
      border-radius: 3px !important;
      font-size: 13px !important;
      font-weight: bolder !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      z-index: 500 !important;
      pointer-events: none !important;
  color: gold !important;
  background: rgba(145, 124, 124, 0.42)!important;
  }
  #UserSets + .width-constraint h3 ~ p:nth-last-of-type(n + 2),
  .width-constraint h3 + .script-author-description ~ p:nth-last-of-type(n + 2) {
      position: fixed !important;
      min-width: 185px !important;
      max-width: 185px !important;
      top: 31px !important;
      margin-left: 760px !important;
      padding: 2px 2px 2px 10px !important;
      border-radius: 3px !important;
      font-size: 15px !important;
      font-weight: bolder !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap!important;
      z-index: 500 !important;
  color: peru !important;
  background: rgba(145, 124, 124, 0.42)!important;
  }
  #UserSets + .width-constraint h3:hover ~ p:nth-last-of-type(n + 2),
  .width-constraint h3:hover + .script-author-description ~ p:nth-last-of-type(n + 2),
  #UserSets + .width-constraint h3 ~ p:nth-last-of-type(n + 2):hover,
  .width-constraint h3 + .script-author-description ~ p:nth-last-of-type(n + 2):hover {
      position: fixed !important;
      height: auto !important;
      min-width: 385px !important;
      max-width: 385px !important;
      top: 31px !important;
      margin-left: 530px !important;
      padding: 2px 40px 20px 40px !important;
      border-radius: 5px !important;
      font-size: 15px !important;
      font-weight: bolder !important;
      overflow: hidden !important;
      white-space: normal !important;
      text-align: left !important;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
  color: white !important;
  box-shadow: 7px 7px 3px 1px rgba(0, 0, 0, 0.7) !important;
  background: black !important;
  border: 1px solid peru !important;
  }

  /* GREASY - FORUM - PROF PAGE */
  .PhotoWrap a.ChangePicture {
      display: block;
      top: 15px !important;
      z-index: 5000 !important;
      transition: all ease 0.2s !important;
  color: gold !important;
  }
  .PhotoWrap:hover a.ChangePicture {
      display: block;
      top: 70px !important;
      color: gold !important;
      transition: all ease 0.7s !important;
  }
  .PhotoWrap:hover a.ChangePicture span {
      color: gold !important;
  }
  #dashboard_profile_index #Content.Column.ContentColumn,
  #dashboard_profile_discussions #Content.Column.ContentColumn {
      margin-top: 70px!important;
  }
  .About dd {
      color: peru !important;
  }
  #dashboard_profile_notifications #Content.Column.ContentColumn .User,
  #dashboard_profile_comments #Content.Column.ContentColumn .User,
  #dashboard_profile_discussions #Content.Column.ContentColumn .User {
      position: fixed !important;
      display: inline-block !important;
      width: 742px !important;
      top: 54px !important;
      margin-left: -7px !important;
      padding: 5px !important;
      z-index: 200 !important;
      border-bottom: 1px solid peru !important;
      background: black !important;
  }
  #dashboard_profile_notifications #Content.Column.ContentColumn .ProfileOptions,
  #dashboard_profile_comments #Content.Column.ContentColumn .ProfileOptions,
  #dashboard_profile_discussions #Content.Column.ContentColumn .ProfileOptions {
      position: fixed !important;
      display: inline-block !important;
      top: 69px !important;
      margin-left: -158px !important;
      z-index: 5000 !important;
      background: transparent !important;
  }
  #dashboard_profile_notifications #Content.Column.ContentColumn .NavButton.ProfileButtons.Button-EditProfile,
  #dashboard_profile_comments #Content.Column.ContentColumn .NavButton.ProfileButtons.Button-EditProfile,
  #dashboard_profile_discussions #Content.Column.ContentColumn .NavButton.ProfileButtons.Button-EditProfile {
      position: fixed!important;
      display: inline-block !important;
      min-width: 20px !important;
      max-width: 20px !important;
      top: 99px !important;
      margin-left: -58px !important;
      padding: 3px 10px 3px 3px!important;
      box-shadow: none !important;
      text-shadow: none !important;
      z-index: 202 !important;
      background: red !important;
  }
  .ButtonGroup.Open .Dropdown.MenuItems {
      top: 35px !important;
      right: 23px !important;
  }
  #dashboard_profile_notifications #Content.Column.ContentColumn .BoxFilter + h2,
  #dashboard_profile_comments #Content.Column.ContentColumn .BoxFilter + h2,
  #dashboard_profile_discussions #Content.Column.ContentColumn .BoxFilter + h2 {
      top: 24px!important;
      position: fixed!important;
      display: inline-block;
      z-index: 250!important;
      color: peru!important;
      width: 678px!important;
      text-align: left;
      background: black;
      padding: 2px 5px!important;
      border: 1px solid peru!important;
  }
  #dashboard_profile_notifications #Content.Column.ContentColumn .ProfileOptions + .Profile,
  #dashboard_profile_comments #Content.Column.ContentColumn .ProfileOptions + .Profile,
  #dashboard_profile_discussions #Content.Column.ContentColumn .ProfileOptions + .Profile {
      margin-top: 70px !important;
  }
  #conversations_messages_all .Condensed.DataList.Conversations {
      margin-top: 42px !important;
  }
  .Dashboard.Profile.discussions.Profile.Section-Profile .ProfileOptions + .Profile .BoxFilter.BoxProfileFilter + .DataListWrap {
      margin-top: -70px !important;
  }
  /* GREASK FORUM - PROF BUT */
  #dashboard_profile_discussions .About > dt:last-of-type {
      position: absolute !important;
      display: inline-block !important;
      width: 23% !important;
      height: 18px !important;
      line-height: 18px !important;
      top: 5px !important;
      left: 74%!important;
      padding: 2px 2px 2px 15px !important;
      border-radius: 3px !important;
      font-size: 15px !important;
      background: rgba(145, 124, 124, 0.42) url("https://greasyfork.org/fr/forum/applications/dashboard/design/images/profile-sprites.png") no-repeat scroll 2px -134px !important;
  }
  /* GREASY - WITHOUT GM - SCRIPTS LIST(work with CIT enable) */
  #user-script-list > li > article,
  #browse-script-list > li > article {
      padding: 2px 5px !important;
  }
  /* GM "Greasy Fork tweaks" (add screenshots) -
  https://greasyfork.org/en/scripts/368183-greasy-fork-tweaks/feedback
  === */
  /* COR FLOAT */
  #browse-script-list > li > div:not(#codefund-1, .script-meta-block) {
      display: block;
      float: right;
      height: 117px !important;
      width: 20% !important;
      margin: 0;
      padding: 5px;
      overflow: hidden;
  /*outline: 1px solid violet !important;*/
  }
  /* CIRT */
  .script-list dt {
      width: 12em;
      clear: left;
      float: left;
      padding-left: 5px!important;
      padding-right: 1em;
      font-weight: bold;
      text-align: left !important;
      border-left: 1px solid peru !important;
  }





  /* NEED COR - CIT */
  body[pagetype="UserProfile"] #user-script-list > li > article .description,
  body[pagetype="UserProfile"] #browse-script-list > li > article .description {
      display: inline-block!important;
      width: 100% !important;
      min-width: 710px !important;
      max-width: 710px !important;
      padding-bottom: 4px !important;
      padding-left: 4px!important;
      font-size: 15px !important;
      line-height: 15px !important;
      word-wrap: break-word !important;
      overflow: hidden !important;
      border-bottom: 1px solid gray!important;
      border-left: 3px solid red !important;
  }
  /* mark */
  mark {
      padding: 0px 5px !important;
      border-radius: 3px!important;
      background: rgba(222, 210, 54, 0.31) !important;
  }

  /* ICON USER/SITE - BACKGROUND */
  #site-name img[src$="/MonkeyIcon"],
  #title-image,
  .ProfilePhoto.ProfilePhotoMedium,
  #script-info > header > h2 > div img {
      height: auto !important;
      max-height: 30px !important;
      max-width: 30px !important;
      width: auto !important;
      margin-top: -3px;
      padding: 2px !important;
      border-radius: 5px !important;
      box-shadow: 0 0 2px #cccccc inset !important;
      background-color: rgba(191, 191, 190, 0.33) !important;
  }
  .ProfilePhoto.ProfilePhotoMedium {
      display: inline-block !important;
      height: 30px !important;
      line-height: 8px !important;
      font-size: 7px !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      text-align: center;
      overflow: hidden !important;
  }
  /* ICON - SITE (CIT) */
  #Head.Head > .Row > #site-name > a[href="/"] > img#title-image[src$="/MonkeyIcon"] {
      position: absolute !important;
      top: -3px !important;
      left: -10px !important;
  }
  #vanilla_discussions_index #Head.Head > .Row > #site-name > a[href="/"] > img#title-image[src$="/MonkeyIcon"] {
      position: absolute !important;
      top: -18px !important;
      left: -10px !important;
      margin-top: 5px !important;
  }
  #site-name img,
  #title-image {
      max-height: 30px;
      max-width: 30px;
      padding: 2px;
      border-radius: 5px;
      box-shadow: 0 0 2px #cccccc inset;
      background-color: rgba(191, 191, 190, 0.33) !important;
      background-image: none !important;
  }
  .sp-separator + #main-header #site-name > a > img,
  #site-name img[src*="/forum/uploads/SCN2YQGWLIU4.jpg"],
  #site-name img[src="/assets/blacklogo96-e0c2c76180916332b7516ad47e1e206b42d131d36ff4afe98da3b1ba61fd5d6c.png"] {
      display: inline-block !important;
      position: relative !important;
      height: 100% !important;
      min-height: 30px !important;
      max-height: 30px !important;
      width: 100%!important;
      min-width: 30px !important;
      max-width: 30px !important;
      top: -4px !important;
      padding: 2px!important;
      border-radius: 3px !important;
  }
  #site-name img[src="greasemonkey-script:d22180f2-66b1-46a9-b73e-7ecbda9d6ff3/MonkeyIcon"] {
      position: relative !important;
      display: inline-block !important;
      top: -3px !important;
      border-radius: 5px !important;
  }
  /* FORUM COM - POST REPY - PREV+QUOTE with "ol" or not / With AUTHOR or no */
  .Preview {
      min-height: 100px;
      padding: 4px;
      color: #929292;
      background: #454545;
  }
  blockquote,
  blockquote.Quote,
  blockQuote.UserQuote {
      background: rgba(184, 181, 181, 0.05);
      border-left: 4px solid rgba(242, 193, 36, 0.37);
  }
  /* BLOCKQUOTES */
  blockquote {
      width: 711px;
      margin-left: -4px;
      padding: 1px 5px;
  }
  .Message > blockquote > div > pre {
      margin-left: 2px;
  }
  .Message > blockquote > pre {
      width: 97%;
  }
  .QuoteText > ol {
      display: inline-block;
      width: 95%;
      margin-bottom: -28px;
      margin-top: -15px;
  }
  .script-author-description > blockquote {
      margin-left: -4px;
      padding: 1px 5px;
      width: 99%;
  }
  /* FORUM COM - POST/EDIT NEW DISC + ACTI */
  #vanilla_post_editdiscussion #Body {
      width: 100%;
      margin-top: 5px;
      padding: 20px;
  }
  #vanilla_post_editdiscussion #Body .Row {
      display: inline-block;
      margin-top: 24px;
      width: 100%;
  }
  #vanilla_post_editdiscussion #Content.Column.ContentColumn,
  #vanilla_post_discussion #Content.Column.ContentColumn {
      width: 100%;
      margin: -20px 0px 0 0;
      padding: 30px 5px;
      border: none;
  }
  /* GREASY/USERS - FORUM DISC - CONT */
  #Content.Column.ContentColumn,
  #vanilla_discussion_index #Content.Column.ContentColumn {
      float: right;
      width: 760px;
      min-height: 770px;
      margin-top: 12px;
      margin-right: 14px;
      padding: 0;
      border-radius: 0 0 5px 5px;
      box-shadow: none;
      background: transparent;
  }
  /* === GREAS FORUM - LIST/COM - ====== */
  #vanilla_discussions_index.Vanilla.Discussions.index.Section-DiscussionList #Content.Column.ContentColumn {
      margin-top: 9px;
  }
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion.Section-Category-script-requests #Content.Column.ContentColumn,
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion.Section-Category-general #Content.Column.ContentColumn,
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion.Section-Category-script-discussions #Content.Column.ContentColumn,
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion.Section-Category-script-development #Content.Column.ContentColumn {
      margin-top: 0px;
  }
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion.Section-Category-script-development #Content.Column.ContentColumn .MessageList.Discussion {
      margin-top: 21px;
  }
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion.Section-Category-script-requests #Content.Column.ContentColumn .MessageList.Discussion .Item.ItemDiscussion,
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion.Section-Category-general #Content.Column.ContentColumn .MessageList.Discussion .Item.ItemDiscussion,
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion.Section-Category-script-discussions #Content.Column.ContentColumn .MessageList.Discussion .Item.ItemDiscussion {
      margin-top: -12px;
  }
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion.Section-Category-script-discussions #Content.Column.ContentColumn img.rating-image {
      position: fixed;
      display: inline-block;
      margin-left: 0;
      margin-top: -35px;
      z-index: 5000;
  }
  /* USERS FORUM - LIST */
  #vanilla_categories_index.Vanilla.Categories.index.Discussions.Category-style-reviews.Section-Category-style-reviews.Section-DiscussionList .BreadcrumbsWrapper + #Panel.Column.PanelColumn + #Content.Column.ContentColumn,
  #vanilla_discussions_bookmarked.Vanilla.Discussions.bookmarked.Section-DiscussionList #Content.Column.ContentColumn,
  #vanilla_discussions_mine.Vanilla.Discussions.mine.Section-DiscussionList #Content.Column.ContentColumn {
      margin-top: 8px
  }
  #vanilla_categories_index.Vanilla.Categories.index.Discussions.Category-userstyles\\.org.Section-Category-userstyles\\.org.Section-DiscussionList .BreadcrumbsWrapper + #Panel.Column.PanelColumn + #Content.Column.ContentColumn,
  #vanilla_categories_index.Vanilla.Categories.index.Discussions.Section-DiscussionList .BreadcrumbsWrapper + #Panel.Column.PanelColumn + #Content.Column.ContentColumn,
  #vanilla_categories_index.Vanilla.Categories.index.Discussions.Category-stylish.Section-Category-stylish.Section-DiscussionList .BreadcrumbsWrapper + #Panel.Column.PanelColumn + #Content.Column.ContentColumn,
  #vanilla_categories_index.Vanilla.Categories.index.Discussions.Category-style-requests.Section-Category-style-requests.Section-DiscussionList .BreadcrumbsWrapper + #Panel.Column.PanelColumn + #Content.Column.ContentColumn,
  #vanilla_categories_index.Vanilla.Categories.index.Discussions.Category-style-development.Section-Category-style-development.Section-DiscussionList .BreadcrumbsWrapper + #Panel.Column.PanelColumn + #Content.Column.ContentColumn {
      margin-top: 12px;
  }
  /* GREASY - FORUM - POST COM - FIRST POST */
  .ExtraDiscussionData-Rating .report {
      width: 584px;
      padding: 5px;
      border: 1px solid gray;
  }
  /* GREAS/USERST - CATEG DISC LIST */
  #vanilla_categories_index.Vanilla.Categories.Index.Discussions #Content.Column.ContentColumn {
      margin-top: -37px;
  }
  /*  USERST */
  #Content.Column.ContentColumn .MessageList.Discussion,
  #vanilla_discussion_index #Content.Column.ContentColumn .MessageList.Discussion {
      position: relative;
      top: -28px;
      margin-bottom: -18px;
      z-index: 10;
  }
  /* FORUM DISC - COM FORM -  CONT */
  .MessageForm.CommentForm.FormTitleWrapper {
      padding-left: 15px;
  }
  /* USERS/GREASY - FORUM - DISC LIST CONT */
  /* GREAS/USERST */
  .Column.ContentColumn .DataList.Discussions {
      position: relative;
      display: inline-block;
      width: 755px;
      margin-top: 5px;
  }
  /* PB DIFF - USERS/GREASY */
  /* GREAS */
  #vanilla_discussions_bookmarked.Section-DiscussionList .Column.ContentColumn .DataList.Discussions {
      margin-left: 0px;
  }

  /* ==== */
  .Profile .DataList.Discussions {
      position: relative;
      display: inline-block;
      width: 727px;
      margin-top: 107px;
  }
  #vanilla_categories_index .DataList.CategoryList {
      position: relative;
      display: inline-block;
      width: 727px;
      margin-top: 30px;
  }
  .DataList.Activities .Item {
      position: relative;
      display: inline-block;
      width: 709px;
  }
  /* FORUMS ALL - DISC LIST - HEADER - ===  */
  .HomepageTitle,
  .H.HomepageTitle {
      position: fixed !important;
      width: 743px;
      top: 80px !important;
      margin-left: -1px !important;
      padding: 1px 5px 1px 5px;
      z-index: 10;
      border-top: 1px solid peru;
      border-bottom: 1px solid peru;
      color: gold;
      background-color: #222 !important;
  }
  #vanilla_discussions_participated .HomepageTitle {
      width: 733px !important;
      top: 47px !important;
  }

  /* USERS FORUM - DISC LIST - HEAD */
  #Frame .Row .BreadcrumbsWrapper + #Panel + #Content.Column.ContentColumn .H.HomepageTitle {
      width: 747px;
      top: 47px !important;
  }
  /* (new173) USERST/GREASY */
  .P.PageDescription,
  #Frame .Row .BreadcrumbsWrapper + #Panel + #Content.Column.ContentColumn .H.HomepageTitle + .P.PageDescription {
      position: fixed;
      width: 757px;
      top: 95px;
      padding: 3px 0px 3px 5px;
      z-index: 10;
      color: gold;
      border-bottom: 1px solid red;
      background-color: #222;
  }
  #Frame .Row .BreadcrumbsWrapper + #Panel + #Content.Column.ContentColumn .H.HomepageTitle + .P.PageDescription {
      top: 73px;
  }
  #vanilla_categories_index .DataList.Discussions {
      margin-top: 24px;
      border-top: 1px solid peru;
  }
  #vanilla_discussions_bookmarked ul.DataList.Discussions {
      margin-top: 0px;
      border-top: 1px solid peru;
  }
  /* PROF - DICUS LIST -  === */
  .Profile .DataList.Discussions {
      margin-top: 0px;
  }

  /* ACTIVITY PAGE */
  .Excerpt > p > a > img {
      max-width: 671px!important;
  }
  #dashboard_profile_notifications .Item:nth-child(odd),
  .Profile .DataList.Discussions .Item:nth-child(odd),
  .DataList.SearchResults .Item:nth-child(odd) {
      background-color: #222 !important;
  }
  #dashboard_profile_notifications .Item:nth-child(even),
  .Profile .DataList.Discussions .Item:nth-child(even),
  .DataList.SearchResults .Item:nth-child(even) {
      background-color: #414141 !important;
  }
  #dashboard_profile_notifications .Item:hover,
  .Profile .DataList.Discussions .Item:hover,
  .DataList.SearchResults .Item:hover {
      background-color: rgba(7, 7, 7, 0.57) !important;
      box-shadow: 1px 1px 6px 4px rgba(0, 0, 0, 0.7) inset !important;
      transition: background 0.8s ease 0s !important;
  }
  #dashboard_profile_notifications .Item:hover,
  .Profile .DataList.Discussions .Item:hover,
  .DataList.SearchResults .Item:hover {
      background-color: black !important;
      z-index: 1 !important;
  }
  .DataList.SearchResults .Item .ItemContent .Meta a {
      font-size: 15px! important;
  }
  /* GREAS - with/without TS CITRUS - SEARCH FORM + BUTTONS - ===  */
  #site-nav nav form.sidebar-search {
      position: absolute;
      top: 2px;
      margin-left: 30px;
      border-radius: 3px;
      transition: width ease 0.7s;
      border: 1px solid red;
  }
  #site-nav nav form.sidebar-search:hover {
      width: auto !important;
      min-width: 395px !important;
      max-width: 395px !important;
      z-index: 50000 !important;
      transition: width ease 0.7s !important;
  }
  #site-nav nav form.sidebar-search > input[name="q"] {
      height: 18px;
      border-radius: 3px;
      transition: width ease 4s;
      border: 1px solid #333 !important;
      color: gold;
      background: #333 !important;
  }
  #site-nav nav form.sidebar-search > input[name="q"]::-moz-placeholder {
      font-size: 12px !important;
      color: white !important;
  }
  #site-nav nav form.sidebar-search > input[name="q"]::-webkit-input-placeholder {
      font-size: 12px !important;
      color: white !important;
  }
  #site-nav nav form.sidebar-search:hover > input[name="q"] {
      min-width: 355px !important;
      max-width: 355px !important;
      z-index: 500;
      transition: width ease 0.7s;
      border: 1px solid red;
      background: black;
  }
  #site-nav nav form.sidebar-search > input[value="✱"],
  #site-nav nav form.sidebar-search:hover > input.search-submit {
      height: 18px;
      left: 0;
      padding-right: 0;
      background: gray;
  }
  #site-nav nav form.sidebar-search:hover > input[value="✱"],
  #site-nav nav form.sidebar-search:hover > input.search-submit {
      opacity: 0.8;
  }
  #site-nav nav form.sidebar-search:hover > input[value="✱"]:hover,
  #site-nav nav form.sidebar-search:hover > input.search-submit:hover {
      opacity: 1 !important;
      background: red;
  }

  #site-nav nav form.sidebar-search > input[type="search"] {
      min-height: 18px;
      line-height: 18px;
      margin-top: -2px;
  }
  #site-nav nav form.sidebar-search > input[type="submit"] {
      position: relative;
      -moz-appearance: none;
      height: 18px;
      line-height: 18px;
      width: 20px;
      top: 1px;
      padding-right: 0;
      font-size: 12px;
      text-align: center;
  }
  #userProfile + ul #sidebar-search #search-submit {
      height: 18px;
  }
  #search-other-sites {
      width: 13px;
      height: 20px;
      line-height: 10px;
      padding: 0px;
  }

  /* GREAS - without CIT - FORUM HEAD */
  #Head.Head .Row,
  #Head .Row {
      position: relative;
      display: inline-block;
      max-height: 47px;
      min-height: 47px;
      left: 25%;
      padding: 0.25em 0;
  }
  #Head.Head .Row {
      max-height: 39px;
      min-height: 39px;
      top: -3px;
  }
  #Head .Row #site-name {
      height: 51px;
      line-height: 8px;
      margin-top: -8px;
  }
  #nav-user-info {
      position: absolute;
      display: inline-block;
      top: -8px;
  }
  .user-profile-link {
      position: relative;
      display: inline-block;
  }
  /* GREASY - USER NAME + LOGIN/LOGOUT + LANG - CONTAINER */
  #language-selector {
      position: absolute;
      display: inline-block;
      -moz-appearance: none;
      width: 18px;
      height: 15px;
      line-height: 13px;
      top: 2px;
      padding: 0 2px;
      border-radius: 3px;
      text-indent: -1px;
      overflow: hidden;
      z-index: 500000;
      box-shadow: 3px 3px 2px black;
      background: #222;
  }
  #language-selector-locale {
      position: relative;
      display: inline-block;
      -moz-appearance: none;
      -webkit-appearance: none;
      width: 19px;
      height: 20px;
      line-height: 8px !important;
      margin-right: 14px;
      letter-spacing: 1px;
      overflow: hidden;
      cursor: pointer;
  color: peru;
  border: 1px solid transparent;
  background: #222;
  }
  #language-selector-locale:hover {
      color: tomato;
  }
  #language-selector-locale > option {
      text-indent: 20px;
      margin-left: -20px;
  }
  #language-selector-locale > option:checked:before {
      content: attr(value);
      font-size: 20px;
  color: tan !important;
  background: black
  }
  #language-selector-locale > option:before {
      content: attr(value);
      display: inline-block;
      width: 100px;
      margin-right: 17px;
      margin-left: -20px;
  color: gold;
  }
  #language-selector-locale > option[selected=""]:before {
      content: attr(value);
  color: green;
  }
  .width-constraint #nav-user-info {
      position: absolute;
      display: inline-block;
      width: 500px;
      height: 2vh !important;
      line-height: 2vh !important;
      top: -2px;
      left: 50%;
      text-align: right;
  }

  /* GM "Greasyfork notifications dropdown" by hdyzen [2025]
  https://greasyfork.org/fr/scripts/550687-greasyfork-notifications-dropdown
  ==== */
  #notification-button svg {
      fill: white !important;
  }
  #notification-button.dropdown-visible svg {
      fill: green !important;
  }

  /* WITH MESSAG NOTIF PRESENT */
  #site-nav #nav-user-info:has(.notification-widget, #notification-button) a.notification-widget  ~ #notification-button svg {
      fill: gold !important;
  }
  #site-nav #nav-user-info:has(.notification-widget, #notification-button) a.notification-widget  ~ #notification-button svg {
      fill: gold !important;
  }
  #site-nav #nav-user-info:has(#notification-button.dropdown-visible)  #notification-button:before ,
  html.notifications-dropdown {
      content: "❌" !important;
      position: absolute !important;
      top: 6vh !important;
      margin:  0 0 0 17px !important;
      padding: 5px 3px 5px 3px !important;
      font-size: 20px !important;
      border-radius: 0 5px 5px 0 !important;
  color: red !important;
  background: #333 !important;
  border: 1px solid silver !important;
  }
  /* [ProfilePage] > .width-constraint */
  #notifications-dropdown {
      display: none;
      position: absolute !important;
      height: clamp(5rem, 35rem, 100vh);
      top: 6vh !important;
      right: 0% !important;
      padding: 10px !important;
      z-index: 50000000 !important;
      border-radius: 5px 0px 5px 5px !important;
  box-shadow: 0 0 5px var(--content-box-shadow-color);
  background: #333 !important;
  background: rgb(103, 0, 0) linear-gradient(rgb(0, 0, 0) 2%, rgb(17, 17, 17) 37%, rgb(51, 51, 51) 100%, rgb(19, 19, 19) 100%) !important;
  border: 1px solid red !important;
  }

  html.notifications-dropdown {
      position: absolute !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 98vh !important;
      max-height: 98vh !important;
      top: 0 !important;
      margin: 0 0 0 0 !important;
      min-width: 95% !important;
      max-width: 95% !important;

      overflow: hidden !important;
      background: rgb(103, 0, 0) linear-gradient(rgb(0, 0, 0) 2%, rgb(17, 17, 17) 37%, rgb(51, 51, 51) 100%, rgb(19, 19, 19) 100%) !important;
  border: 1px solid rgb(19, 19, 19) !important;
  }

  /*[stylus-iframe]:has(.notification-list) header#main-header ,*/
  html.notifications-dropdown body header#main-header {
      display: none !important;
  }

  /*[stylus-iframe]:has(.notification-list) header#main-header + .width-constraint ,*/
  html.notifications-dropdown body header#main-header + .width-constraint {
      display: inline-block !important;
      height: 100% !important;
      min-height: 97.5vh !important;
      max-height: 97.5vh !important;
      margin: 0 0 0 0 !important;
      min-width: 100% !important;
      max-width: 100% !important;

      overflow: hidden auto !important;
  /*border: 1px solid aqua !important;*/
  }

  /*[stylus-iframe]:has(.notification-list) header#main-header + .width-constraint .notification-list .notification-list-item a ,*/
  html.notifications-dropdown header#main-header + .width-constraint a {
    display: block;
    text-decoration: none;
    color: var(--overall-text-color);
    padding: 4px 0 14px;
    white-space: pre-wrap !important;
      word-break: normal !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* GREAS/USERST - SITE MENU - with SEARCH */
  .SiteMenu {
      position: absolute;
      display: inline-block;
      height: 22px;
      width: 320px;
      top: -18px;
      left: 16%;
  }
  #vanilla_categories_index .SiteMenu,
  #vanilla_drafts_index .SiteMenu,
  #vanilla_discussions_mine .SiteMenu,
  #vanilla_discussions_bookmarked .SiteMenu,
  #vanilla_discussion_comment .SiteMenu {
      top: -12px;
  }
  /* USERST */
  #Frame #Head.Head .Row .SiteTitle + .SiteSearch + .SiteMenu {
      top: 0px;
  }
  /* GREA : WITH/ Without CIT - SITE NAV - PB GM "Greasyfork - Add notes to the script" */
  #site-nav > nav {
      position: absolute;
      display: inline-block!important;
      height: 24px!important;
      line-height: 24px!important;
      width: auto !important;
      max-width: 550px !important;
      top: -9px!important;
      left: 16%!important;
      text-align: left !important;
  }
  /* (new217) GM "Greasyfork - Add notes to the script" ADD NOTES BUT */
  .note-obj-add-note-btn.note-obj-gf-note-btn.note-obj-gf-ts-note-btn ~ .note-obj-add-note-btn.note-obj-gf-note-btn.note-obj-gf-ts-note-btn,
  span.theversion + .note-obj-add-note-btn.note-obj-gf-note-btn.note-obj-gf-ts-note-btn ~ .note-obj-add-note-btn.note-obj-gf-note-btn.note-obj-gf-ts-note-btn {
      display: none !important;
  }
  .note-obj-add-note-btn.note-obj-gf-note-btn.note-obj-gf-library-note-btn,
  .note-obj-add-note-btn,
  .note-obj-gf-library-note-btn,
  #install-area > .note-obj-gf-info-note-btn {
      float: right !important;
      clear: none !important;
      width: 18px !important;
      height: 20px !important;
      top: 10px;
      left: -30px !important;
      align-items: center;
      border-radius: 3px;
      color: #fff;
      padding: 2px;
      white-space: nowrap;
      background-image: url("data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2IoMzgsIDM4LCAzOCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYigzOCwgMzgsIDM4KSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+")!important;
      background-position: center center!important;
      background-repeat: no-repeat!important;
      background-color: #3c81df;
      visibility: visible !important;
      opacity: 1 !important;
  }
  /* (new240) TAG - NEEDD COR overflow-wrap: - NOTES TXT in LIST / SCRIPT IFOS HEADER*/
  .note-obj-gf-note-tag,
  .note-obj-gf-ts-note-tag,
  body[pagetype="PersonalProfile"] .note-obj-gf-ts-note-tag,
  body[pagetype="UserProfile"] .note-obj-gf-ts-note-tag {
      display: inline-block !important;
      max-width: 200px !important;
      height: 100% !important;
      height: auto !important;
      max-height: 20px !important;
      line-height: 21px;
      margin-left: 5px;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 13px;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
  }
  .note-obj-gf-note-tag:hover,
  .note-obj-gf-ts-note-tag:hover {
      position: absolute !important;
      display: inline-block !important;
      max-width: 800px !important;
      height: 100% !important;
      height: auto !important;
      max-height: 100px !important;
      line-height: 14px !important;
      margin-left: 5px;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 14px !important;
      white-space: pre-wrap !important;
      word-wrap: normal !important;
      overflow: hidden !important;
      overflow-wrap: anywhere !important;
      z-index: 50000 !important;
  }
  /* NOTES in LIST */
  #script-table tr .note-obj-add-note-btn.note-obj-gf-note-btn.note-obj-gf-ts-note-btn {
      margin-top: -15px !important;
      transform: scale(0.7) !important;
      opacity: 0.1 !important;
  }

  /* CIT */
  body[pagetype="PersonalProfile"] #script-table tr .note-obj-add-note-btn.note-obj-gf-note-btn.note-obj-gf-ts-note-btn,
  body[pagetype="ListingPage"] #script-table tr .note-obj-add-note-btn.note-obj-gf-note-btn.note-obj-gf-ts-note-btn,
  body[pagetype="UserProfile"] #script-table tr .note-obj-add-note-btn.note-obj-gf-note-btn.note-obj-gf-ts-note-btn {
      background-color: orange;
  }

  #script-table tr:hover .note-obj-add-note-btn.note-obj-gf-note-btn.note-obj-gf-ts-note-btn {
      transform: scale(0.7) !important;
      opacity: 1 !important;
  }

  /* ADD NOTES POPUP*/
  .note-obj-popver-frame-dialog {
      min-height: 300px;
      min-width: 600px;
      background-color: #38526d;
      color: #fff;
  }
  .note-obj-popover-frame-item:hover,
  .note-obj-popover-frame-item-deepen:hover {
      background-color: rgba(0, 0, 0, 0.3);
      color: gold !important;
  }
  /* GREASY - SCRIPT LIST - CIT */
  body[pagetype="ListingPage"] #site-nav > nav {
      position: absolute;
      display: inline-block!important;
      height: 15px!important;
      line-height: 15px!important;
      width: 530px!important;
      top: -4px!important;
      left: 16%!important;
      text-align: left !important;
      z-index: 50000 !important;
  }
  #main-header .width-constraint {
      height: 42px !important;
      padding: 0 0 0.25em;
      overflow: visible !important;
      z-index: 50000 !important;
  }




  #main-header .width-constraint #site-name {
      position: relative;
      display: inline-block !important;
      height: 40px!important;
  }
  #title-subtext {
      position: absolute;
      top: 28px !important;
      left: 63px !important;
      font-size: 10px;
      font-weight: 400 !important;
      text-decoration: none;
  }
  #site-name > a[href="/"] {
      display: inline-block!important;
      color: gold !important;
  }
  #site-name > a[href="/"] span {
      position: relative!important;
      display: inline-block!important;
      height: 33px!important;
      line-height: 33px!important;
      top: -3px !important;
      margin-left: 3px!important;
      font-size: 27px!important;
      color: peru !important;
  }
  #site-name > a[href="/"] #title-subtext {
      position: absolute;
      top: 17px!important;
      left: 52px !important;
      font-size: 8px !important;
      text-decoration: none;
      color: peru !important;
  }
  /* (new214) CITRUS - DEV NAME - SUPP */
  .width-constraint #site-name > a[href="/"] a#title-subtext {
      display: none !important;
      min-width: 160px !important;
      left: 42px !important;
      top: 12px !important;
  }
  body[pagetype="ListingPage"] #site-name > a[href="/"] a#title-subtext {
      display: none !important;
      left: 55px !important;
      top: 15px !important;
  }


  /* (new214) */
  #main-header .width-constraint #site-name > a[href="/"] span#title-text,
  #Frame #Head.Head > .Row > #site-name > a[href="/"] span#title-text {
      height: 15px !important;
      line-height: 15px !important;
      top: -20px !important;
      left: 0px !important;
      border-radius: 0 0 5px 0 !important;
      font-size: 12px !important;
      border: 1px solid peru !important;
      border-left: none !important;
      border-top: none !important;
  }
  #Frame #Head.Head > .Row > #site-name > a[href="/"] span#title-text {
      top: -5px !important;
      left: 30px !important;
  }
  body[pagetype="ListingPage"] #site-name > a[href="/"] span#title-text {
      height: 13px !important;
      line-height: 13px !important;
      top: -19px !important;
      left: 0px !important;
      border-radius: 0 0 5px 0 !important;
      font-size: 12px !important;
  }
  /* GREAS - SITE TIT - WITHOUT CITRUS */
  #site-name h1 {
      width: 109px;
      height: 20px;
      line-height: 12px;
      top: -18px;
      border-radius: 0 0 10px 0;
      border: 1px solid peru;
      border-left: none;
      border-top: none;
  }
  #site-name h1 a {
      height: 18px !important;
      line-height: 15px !important;
      font-size: 18px !important;
      letter-spacing: 0.2px !important;
  }
  .subtitle,
  #main-header .subtitle {
      margin-top: -3px;
      margin-left: -1px;
      text-shadow: none;
  }
  #site-name-text {
      display: inline-block;
      vertical-align: top;
      height: 18px;
      line-height: 18px;
  }
  #site-name-text h1 {
      font-size: 13px !important;
      letter-spacing: -2px;
      margin-top: -4px;
  }
  #site-name-text h1 a {
      font-size: 13px !important;
      letter-spacing: 0.6px;
      margin: 0;
  }
  #site-nav > nav > li > a {
      margin-right: 2px;
  }

  /* GREAS - ADD ICON for LOGIN */
  #nav-user-info {
      color: transparent;
  }
  .sign-out-link {
      position: relative;
      display: inline-block;
      height: 15px;
      margin-right: 5px;
      font-size: 0;
      opacity: 0.4;
  }
  .sign-out-link:hover {
      opacity: 1;
  }
  .SignOut,
  .sign-out-link a {
      position: relative;
      display: inline-block;
      height: 15px;
      width: 15px;
      margin-right: 5px;
      top: -3px;
      border-radius: 3px;
      font-size: 0;
      cursor: pointer;
      background-image: url(https://image.flaticon.com/icons/png/128/17/17547.png?iact=rc&uact=3&page=0&start=0&ndsp=45&ved=0ahUKEwiAkb7D7PzRAhUKsxQKHVFlBfcQMwgfKAUwBQ&client=firefox-b&bih=919&biw=1920);
      background-position: center;
      background-size: cover;
      background-color: red;
      border: 1px solid gray;
  }

  /* GREAS - SEARCH */
  .nav-search {
      position: absolute !important;
      display: inline-block !important;
      width: 220px !important;
      height: 19px !important;
      line-height: 0px !important;
      left: 240px !important;
      top: 7px !important;
  }
  .nav-search:hover {
      width: 400px !important;
  }
  .nav-search #script-search {
      position: relative;
      display: inline-block !important;
      vertical-align: top !important;
      width: 200px !important;
      top: -7px !important;
  }
  body[pagetype="ListingPage"] .nav-search #script-search {
      top: -12px !important;
  }
  .nav-search:hover #script-search {
      width: 420px !important;
  }
  .nav-search #script-search input[name="q"] {
      display: inline-block !important;
      width: 150px !important;
      margin-top: 5px !important;
      opacity: 0.4 !important;
  }
  .nav-search:hover #script-search input[name="q"] {
      width: 350px !important;
      opacity: 1 !important;
  }

  /* CIT - SETTINGS - ADD ICON (keep!important;) */
  #site-name > a span#settings-subtext {
      position: absolute !important;
      display: inline-block;
      height: 16px !important;
      width: 16px !important;
      margin-left: -39px !important;
      margin-top: 15px !important;
      border-radius: 4px !important;
      font-size: 0px !important;
      transform: scale(0.7) !important;
      opacity: 0.4 !important;
      background: rgba(0, 0, 0, 0) url("https://greasyfork.org/tr/forum/applications/dashboard/design/images/ui_sprites.png") no-repeat scroll 0 -102.6px !important;
      background-color: #DCD9D9;
  }
  #site-name > a span#settings-subtext:hover {
      opacity: 1;
  }
  .width-constraint #site-name > a[href="/"] span#settings-subtext {
      margin-left: -30px !important;
      margin-top: 15px !important;
  }
  body[pagetype="ListingPage"] #site-name > a[href="/"] span#settings-subtext {
      margin-left: -31px !important;
      margin-top: 16px !important;
  }
  /* CIT - SCRIPT INFO */
  #script-info {
      display: inline-block;
      margin-top: -50px;
      padding: 0 5px 0 5px;
      border-radius: 0;
      text-align: left !important;
      box-shadow: none;
      border: 1px solid #bbb;
      background-color: #333;
  }
  #share {
      position: relative;
      display: inline-block;
      max-height: 20px;
      margin-bottom: 0;
      overflow: hidden;
      background: red;
      background-color: #670000;
      background-image: linear-gradient(#670000, #900);
  }
  #share:hover {
      height: 240px;
      max-height: 100%;
      overflow: visible;
      transition: height ease 4s;
  }
  #share > h3 {
      margin-top: -2px;
      width: 942px;
      padding: 0 5px;
  }
  #social-buttons {
      text-align: center;
  }
  .social_share_privacy_area.box li.settings_info {
      display: inline-block;
      left: 0;
  }
  #script-table {
      display: block;
      margin: 0 auto;
      max-width: 960px;
  }
  body[pagetype="ListingPage"] .sp-separator ~ #script-table,
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type ~ #script-table:not(:first-of-type) {
      position: relative !important;
      display: block !important;
      max-width: 960px;
      margin-top: 0px;
      margin-bottom: -70px !important;
      top: 0px !important;
  }
  body[pagetype="ListingPage"] #script-table thead {
      margin-top: -25px;
  }
  #script-table tbody td:nth-child(2) {
      max-width: 450px;
      min-width: 450px;
  }

  /* (new234) USER  PERS PROFI - CIT - TOP HEADER (mask Discuss) - CIT */
  /* !imp - PROF INFOS - WITH CITRUS  - PERS/USER PROF */
  body[pagetype="PersonalProfile"] #main-header + .width-constraint,
  #main-header + .width-constraint {
      display: inline-block !important;
      margin-top: 155px !important;
      max-width: 970px;
      margin-bottom: 0;
      padding: 0;
      text-align: left !important;
      box-shadow: none;
      z-index: 0 !important;
  }
  body[pagetype="PersonalProfile"] #main-header + .width-constraint:first-of-type {
      top: 10px !important;
  }
  body[pagetype="PersonalProfile"] #main-header + .width-constraint:hover,
  #main-header + .width-constraint:hover {
      z-index: 50 !important;
  }

  /* NO CITR */
  #about-user.text-content.reportable {
      position: fixed;
      height: 35px;
      margin-top: -7px !important;
      max-width: 1030px;
      margin-bottom: 0;
      margin-left: -2.5% !important;
      padding: 0;
      text-align: left !important;
      box-shadow: none;
      z-index: 50 !important;
  /*border: 1px solid aqua !important;*/
  }
  body[pagetype="UserProfile"] #main-header + .width-constraint > .text-content.reportable,
  body[pagetype="PersonalProfile"] #main-header + .width-constraint > .text-content.reportable {
      max-width: 969px;
      height: 25px !important;
      margin-left: 0.7% !important;
      top: 68px !important;
  }
  #main-header + .width-constraint .sidebarred-main-content > .open-sidebar.sidebar-collapsed + section {
      display: inline-block;
      height: auto !important;
      width: 100%;
      max-width: 100%;
      margin-bottom: 0;
      margin-top: 30px !important;
      padding: 0;
      text-align: left !important;
      box-shadow: none;
      background: #222;
  }
  #main-header + .width-constraint .sidebarred-main-content > .open-sidebar.sidebar-collapsed + section #user-script-list {
      display: inline-block;
      min-height: 100% !important;
      width: 100%;
      max-width: 970px;
      margin-bottom: 0;
      padding: 0;
      text-align: left !important;
      box-shadow: none;
      background: #222;
  }
  body[pagetype="PersonalProfile"] > .width-constraint,
  body[pagetype="UserProfile"] > .width-constraint {
      display: inline-block;
      width: 100%;
      right: 0;
      left: 0;
      top: 2px;
      z-index: 1;
  }
  body[pagetype="PersonalProfile"] > .width-constraint {
      position: fixed;
      max-height: 20px !important;
      top: -12px;
  }
  body[pagetype="PersonalProfile"] #user-discussions .text-content,
  body[pagetype="UserProfile"] #user-discussions .text-content {
      display: inline-block;
      height: 35px;
      line-height: 23px;
      max-width: 980px;
      margin-bottom: 0px;
      margin-left: 0px !important;
      padding: 0 5px;
      box-shadow: none;
      border-radius: 0 0 5px 5px;
      border: 1px solid red;
  }
  body[pagetype="PersonalProfile"] #user-discussions:hover .text-content {
      height: auto;
      margin-top: 50px;
  }
  body[pagetype="UserProfile"] #user-discussions:hover .text-content {
      height: auto;
      margin-top: 50px;
  }
  body .width-constraint > #about-user.text-content > h2 {
      height: 25px !important;
      line-height: 25px !important;
      margin-top: 0px;
      text-align: center;
  }
  body[pagetype="UserProfile"] #user-discussions .text-content .white-panel {
      padding: 0 0 0 10px;
  }
  body[pagetype="ListingPage"] #script-table,
  body[pagetype="PersonalProfile"] #script-table,
  body[pagetype="UserProfile"] #script-table {
      display: table;
      height: 100%;
      min-width: 970px !important;
      max-width: 970px !important;
      margin-left: 24%;
      z-index: 500 !important;
  }
  body[pagetype="ListingPage"] #script-table {
      margin-left: 26% !important;
  }
  /* CIT + GM "Superloader" */
  body[pagetype="ListingPage"] #script-table:first-of-type {
      margin-top: 87px !important;
      margin-bottom: 20px !important;
  }
  body[pagetype="UserProfile"] #script-table {
      margin-top: 38px !important;
  }
  body[pagetype="PersonalProfile"] #script-table {
      margin-top: 115px !important;
  }
  body[pagetype="ListingPage"] #script-table thead,
  body[pagetype="PersonalProfile"] #script-table thead,
  body[pagetype="UserProfile"] #script-table thead {
      position: fixed !important;
      min-width: 968px;
      max-width: 968px;
      top: 85px;
      background: black;
  }
  body[pagetype="ListingPage"] #script-table thead {
      z-index: 50000 !important;
      background: black;
  }
  body[pagetype="PersonalProfile"] #script-table thead > tbody,
  body[pagetype="UserProfile"] #script-table > tbody {
      z-index: 0;
  }
  body[pagetype="UserProfile"] #main-header + .width-constraint > section.text-content + section#user-discussions {
      position: fixed;
      min-width: 24px;
      top: 62px !important;
      left: 25%;
  }
  /* (new249) CIT FIX */
  body[pagetype="UserProfile"] #main-header + .width-constraint > section.text-content #user-profile:not(:empty) {
      left: 25.3%;
      top: 62px;
      z-index: 500;
  background: #333 !important;
  }
  body[pagetype="UserProfile"] #main-header + .width-constraint > section.text-content #user-profile:hover:not(:empty) p {
      display: inline-block !important;
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      min-height: 15px !important;
      line-height: 14px !important;
  /*background: red !important;*/
  }

  /* CIT */
  body[pagetype="ListingPage"] {
      float: left !important;
  }
  /* NOT CIT - ANTI STRANGE CARACTERS */
  #script-table tbody td:nth-child(2) .thetitle > a > b {
      display: inline-block;
      width: 100%;
      max-width: 450px;
      min-width: 450px;
      min-height: 15px !important;
      line-height: 14px !important;
      word-wrap: break-word;
      white-space: pre-wrap;
      overflow: hidden !important;
  }

  #script-table tbody td:nth-child(2) .thetitle > a > b iframe {
      display: none !important;
      border: 1px solid red !important;
  }
  /* FIX Konf CIT */
  body[pagetype="ListingPage"] #script-table thead tr {
      display: inline-table !important;
      width: 100%;
      min-width: 960px;
      max-width: 960px;
  }
  #script-table > thead > tr > td:first-of-type {
      width: 20px;
  }
  #script-table > thead > tr > td[tag="name"] {
      width: 48.2% !important;
      text-align: left;
      text-indent: 130px;
  }
  #script-table > thead > tr > td[tag="name"] span {
      position: relative;
      display: inline-block;
      width: 15px;
      margin-left: 0px;
      padding: 0px;
      text-align: center;
      text-indent: 0px;
  }
  #script-table > thead > tr > td[tag="name"] span.filterL:hover:before {
      content: "Library Filter" !important;
      position: absolute;
      display: inline-block;
      width: 80px;
      margin-left: -10px;
      margin-top: -17px;
      padding: 0px;
      border-radius: 5px;
      text-align: center;
      text-indent: 0px;
      color: black;
      background: #cefd8a;
  }
  #script-table > thead > tr > td[tag="name"] span.filterU:hover:before {
      content: "Unlisted Filter";
      position: absolute;
      display: inline-block;
      width: 80px;
      margin-left: -10px;
      margin-top: -17px;
      padding: 0px;
      border-radius: 5px;
      text-align: center;
      text-indent: 0px;
      color: black;
      background: #cee7f3;
  }
  #script-table > thead > tr > td[tag="name"] span.filterD:hover:before {
      content: "Deleted Filter";
      position: absolute;
      display: inline-block;
      width: 80px;
      margin-left: -10px;
      margin-top: -17px;
      padding: 0px;
      border-radius: 5px;
      text-align: center;
      text-indent: 0px;
      color: black;
      background: #f77a7a;
  }

  /* PB TO CHANGE HEADER  TD BACKGROUD SELEC */
  #script-table > thead > tr > td {
      box-shadow: 3px 3px 2px black;
  }
  #script-table > thead > tr > td[tag="ratings"] {
      width: 84px;
  }
  /* DAILY */
  #script-table > thead > tr > td[tag=""] {
      width: 70px;
  }
  #script-table > thead > tr > td[tag="total_installs"] {
      width: 57px;
  }
  #script-table > thead > tr > td[tag="created"] {
      width: 90px;
  }
  #script-table > thead > tr > td[tag="updated"] {
      width: 96px!important;
  }
  /* SCRIPT # */
  #script-table tbody td:nth-child(1) {
      /* width: 4% */
  }

  /* SCRIPT INFO */
  #script-table tbody td:nth-child(2) {
      width: 12%;
  }
  /* SCRIPT RATING */
  #script-table tbody td:nth-child(3) {
      width: 4%;
  }
  /* SCRIPT DAILY */
  #script-table tbody td:nth-child(4) {
      width: 12.7%;
  }
  /* SCRIPT TOTAL  */
  #script-table tbody td:nth-child(5) {
      width: 8.8%;
  }
  /* SCRIPT CREATED  */
  #script-table tbody td:nth-child(6) {
      width: 11.1%;
  }
  /* SCRIPT UPDATED  */
  #script-table tbody td:nth-child(7) {
      width: 12.4%;
  }
  #script-table td .thetitle + div {
      overflow: hidden;
      word-wrap: break-word;
  }
  .width-constraint #script-info > header {
      position: fixed;
      display: inline-block;
      min-width: 966px;
      max-width: 966px;
      height: 126px;
      line-height: 17px;
      margin-left: -4px;
      top: 48px;
      padding: 5px 5px 0px 5px;
      z-index: 5;
      background: black;
  }
  #script-description {
      display: inline-block;
      width: 100%;
      padding-bottom: 7px;
      border-bottom: 1px solid red;
  }
  #script-info header h2 {
      position: relative;
      display: inline-block;
      width: 100%;
      line-height: 17px;
      vertical-align: top;
      margin-top: 1px;
      padding-bottom: 5px;
      font-size: 17px;
      border-bottom: 1px solid red;
  }
  /* PB - FIX Konf CITUS -  SIZE + CHANGE HEADER  TD BACKGROUD ( FOR BACKGROND ACTIVE - Not !important;) */
  #script-table {
      border-radius: 0;
      box-shadow: 0 0 2px gray;
      display: block;
      margin: 5px auto;
      max-width: 960px !important;
      min-width: 960px !important;
  }

  #script-table thead td {
      background-color: orange;
      border-radius: 0 0 5px 5px;
  }
  /* PB - FIX Konf CITUS -  CHANGE ROW BACKGROUD */
  body[pagetype="ListingPage"] #script-table tbody td {
      background-color: #fffbdb;
  }
  body[pagetype="ListingPage"] #script-table tbody td:first-child {
      background-color: #f9d5a6;
  }
  body[pagetype="PersonalProfile"] #script-table tbody td:nth-child(2) .thetitle span.theversion:not(:empty),
  body[pagetype="PersonalProfile"] #script-table tbody td:nth-child(2) .thetitle span:not(:empty),
  body[pagetype="ListingPage"] #script-table tbody td:nth-child(2) .thetitle span:not(:empty) {
      float: left;
  }
  /* VERS EMPTY */
  body[pagetype="PersonalProfile"] #script-table tbody td:nth-child(2) .thetitle span.theversion:empty {
      display: none;
  }
  /* DESC*/
  body[pagetype="PersonalProfile"] .thetitle + div {
      float: left;
      line-height: 15px;
      width: 100% !important;
  }
  /* (new240) ADAPT for CIT + GM  NOTES GM https://greasyfork.org/fr/scripts/404632-twitter-direct
  IN FAVS/USER PROF and notes multilines, ex:
  https://greasyfork.org/fr/scripts?per_page=100&set=50&sort=updated
  USER PROF 
  https://greasyfork.org/fr/users/291050-ankvps
  === */
  body[pagetype="PersonalProfile"] #script-table tbody td:nth-child(2) .thetitle span.note-obj-user-tag,
  body[pagetype="UserProfile"] #script-table tbody td:nth-child(2) .thetitle span.note-obj-user-tag,
  body[pagetype="PersonalProfile"] #script-table tbody td:nth-child(2) .thetitle span.note-obj-user-tag,
  body[pagetype="ListingPage"] #script-table tbody td:nth-child(2) .thetitle span.note-obj-user-tag {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      line-height: 15px;
      min-width: 445px !important;
      max-width: 445px !important;
      margin-left: 0px !important;
      white-space: nowrap !important;
      z-index: 0 !important;
  }
  body[pagetype="PersonalProfile"] #script-table tbody td:nth-child(2) .thetitle span.note-obj-user-tag:hover,
  body[pagetype="UserProfile"] #script-table tbody td:nth-child(2) .thetitle span.note-obj-user-tag:hover,
  body[pagetype="PersonalProfile"] #script-table tbody td:nth-child(2) .thetitle span.note-obj-user-tag:hover,
  body[pagetype="ListingPage"] #script-table tbody td:nth-child(2) .thetitle span.note-obj-user-tag:hover {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      max-height: 50px !important;
      line-height: 13px;
      min-width: 450px !important;
      max-width: 450px !important;
      margin-left: 0 !important;
      font-size: 13px !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      overflow-y: auto !important;
  }
  body[pagetype="ListingPage"] #script-table td .thetitle + div {
      max-width: 450px;
      min-width: 450px;
      overflow: hidden;
      overflow-wrap: break-word;
      white-space: pre-wrap !important;
  }
  /* (new255) ADAPT GM - GreasyFork script icon */
  #script-info > header > h2 > div[style*="margin-left: calc(-80px - 1ex);"] ,
  #script-info > header > h2 > div:first-of-type  {
      position: absolute !important;
      display: inline-block;
      width: 34px !important;
      height: 34px !important;
      top: 3px;
      left: -45px !important;
      margin: 0 0 0 0 !important;
      text-align: right;
  /*border: 1px solid red !important;*/
  }
  /* === */
  .width-constraint #script-info > #script-links {
      position: fixed;
      display: inline-block;
      width: 100%;
      min-width: 960px;
      max-width: 960px;
      top: 179px;
      margin-left: 0;
      padding: 2px 5px;
      z-index: 50000;
      background: #222;
  }

  /* CITRUS - SCRIPT LIST TABLE - SEARCH - TXT " Relative Search" */
  html > body > div[style="text-align: right; padding: 1px 50px"] {
      position: fixed;
      width: 275px;
      top: 72px;
      padding: 0;
      text-align: right;
      left: 33%;
      z-index: 500;
  }
  #RelativeSearch {
      display: inline-block;
      width: 120px;
      padding: 1px 10px;
      text-align: center;
      border-radius: 3px;
      cursor: pointer;
      background-color: orange;
  }
  /* USER SET - HEADER - TXT "SETS" / HOVER */
  #UserSets::before {
      width: 53px;
      left: 5px;
      text-indent: 0px;
      z-index: 20000;
      color: gold;
      box-shadow: 0 0 4px #999999;
      background-color: #222;
  }
  #UserSets:hover::before {
      position: absolute;
      width: 53px;
      left: -5px;
      top: 0px;
      text-indent: 0px;
      z-index: 20000;
      background: green;
  }
  #UserSets {
      position: fixed;
      display: inline-block;
      float: none;
      left: 22%;
      padding: 6px 5px;
      top: 67px;
      border-radius: 5px;
      opacity: 1;
      visibility: hidden;
      z-index: 20000;
      cursor: pointer;
  }
  #UserSets:hover {
      width: 510px;
      height: 800px;
      top: 48px;
      left: 22.5%;
      padding: 25px 6px 5px 50px;
      overflow: hidden;
      overflow-y: auto;
      opacity: 1;
      visibility: visible;
      color: gold;
      box-shadow: 0 0 4px #999999;
      background-color: #222;
  }
  /* CIT */
  body[pagetype="ListingPage"] #UserSets {

      top: 67px;
      z-index: 5000000 !important;
  }
  body[pagetype="ListingPage"] #UserSets:hover {
      top: 48px !important;
      z-index: 50000 !important;
  }

  #UserSets li {
      width: 480px;
      text-indent: 0px;
      background-color: #333;
  }
  #UserSets li:hover {
      background-color: black;
  }
  #UserSets li a:visited {
      color: tomato;
  }
  /* SCRIPT INFOS - CODE ONE LINE */
  #script-feedback-suggestion + pre,
  #script-content > pre {
      margin-left: 0px;
      margin-top: 30px;
      padding: 5px 10px;
      white-space: pre-wrap;
      word-wrap: break-word;
      color: black;
      background-color: #ffff99;
  }
  /* SCRIPT INFOS - ADAP GM: Linkify Plus Plus */
  #script-info #script-description .linkifyplus > img {
      display: inline-block;
      max-width: 15%;
      margin-bottom: -27px;
  }
  /* SCRIPT INFOS - CODE SECTION - ADAP GM: Linkify Plus Plus */
  #code-container .linkifyplus > img {
      height: auto;
      max-height: 64px;
      max-width: 64px;
      width: auto;
      padding: 2px;
      border-radius: 5px;
      box-shadow: 0 0 2px #cccccc inset;
      background: rgba(191, 191, 190, 0.33);
  }
  /* SCRIPT INFOS - SMALL TAB LABELS - extras labels AUTHOR SCRIPTS (where We can EDIT IT) === */
  .width-constraint #script-info > #script-links li {
      display: inline-block;
      padding: 2px;
      font-size: 14px;
  }
  .width-constraint #script-info > #script-links li > * {
      display: inline-block;
      padding: 2px;
      font-size: 14px;
  }

  /* GREAS - CIT - SCRIPT PAGE - TXT "Show your app " +  SUGG  - SUPP */
  .post-install,
  .width-constraint #script-info > #script-content > div[style*="background-color: yellow;"],
  .width-constraint #script-info > #script-content > #install-area > div[style*="background-color: yellow;"] {
      display: none !important;
  }
  /* SCRIPT INFOS - FEED */
  #script-feedback-suggestion {
      margin-top: 47px;
      margin-bottom: 0px;
  }
  /* SCRIPT INFO - VERS/DIFF */
  .width-constraint #script-info ul#script-links + header + #script-content > p:not(:empty):not(#no-discussions):not(#support-url):not(#contribution) {
      margin-top: 0px;
      margin-bottom: 5px;
  }
  /* CONTRIB - https://greasyfork.org/fr/scripts/23332-betty/feedback */
  .width-constraint #script-info ul#script-links + header + #script-content > p#contribution {
      margin-top: 10px;
      margin-bottom: 0px;
  }
  .width-constraint #script-info > #script-content p + form[action$="/diff"] {
      margin-top: -21px !important;
  }
  .width-constraint #script-info ul#script-links + header + #script-content > p:not(:empty) + form:not([action*="/script_sets/add_to_set"]):not([method="post"]) {
      height: auto;
      margin-top: 20px !important;
      margin-bottom: -80px;
  }

  /* GREAS - SCRIPT INFOS - with/without CIT */
  .width-constraint #script-info > #script-content > p:not(:empty):not(#support-url) {
      margin-top: 30px;
      margin-bottom: -88px;
  }
  .width-constraint #script-info > #script-content > p#support-url {
      margin-top: 40px;
  }
  .width-constraint #script-info > #script-content {
      position: relative;
      display: inline-block;
      min-height: 682px !important;
      min-width: 959px;
      max-width: 959px;
      margin-top: 217px;
      margin-left: -1px;
      padding: 0 0 5px 9px;
      z-index: 0;
      text-align: left !important;
      border: 1px solid black;
      background-color: #2B2B2B;
  }
  .width-constraint #script-info #script-content p#support-url + h3,
  .width-constraint #script-info > ul#script-links + header + #script-content > div + h3:not([id="feedback-favoriters"]):first-of-type {
      position: fixed;
      display: inline-block;
      min-width: 970px;
      max-width: 970px;
      margin: 23px 0 auto -10px;
      text-align: left;
      z-index: 500;
      border-bottom: 1px solid red;
      background: gold;
  }
  .width-constraint #script-info #script-content p#support-url + h3 {
      top: 263px;
      margin: -46px 0 auto -10px;
  }
  .width-constraint #script-info #script-content p#support-url + h3 + p:not(:empty):not(#no-discussions) {
      margin-bottom: 5px;
      margin-top: 0px;
  }
  /* NO DISC */
  .width-constraint #script-info > ul#script-links + header + #script-content > div + h3:not([id="feedback-favoriters"]):first-of-type + p {
      margin-top: 60px;
      margin-bottom: 20px;
  }
  .width-constraint #script-info > ul#script-links + header + #script-content > div + h3:first-of-type:not([id="feedback-favoriters"]) + p + h3 {
      margin-top: 30px;
      margin-bottom: -20px;
  }
  .width-constraint #script-info > ul#script-links + header + #script-content > .script-discussion-list + h3 {
      margin-top: 10px;
      margin-bottom: 0px;
  }
  .width-constraint #script-info > ul#script-links + header + #script-content > div + h3:not([id="feedback-favoriters"]) + p:not(:empty):not(#no-discussions) {
      margin-bottom: 5px;
      margin-top: 58px;
  }

  /* CODE CONTAINER */
  .code-container {
      width: 100% !important;
      max-height: 67vh !important;
      border: 1px solid red !important;
  }
  .prettyprint {
      min-width: calc(100% - 27px) !important;
      max-width: calc(100% - 27px) !important;
      width: -moz-max-content;
  }
  /* CODE - OK - STRIPPED BACKGROUND - GRAY LIGHT / WHITE LINES */
  .code-container .uglyprint {
      min-width: calc(100% - 40px) !important;
      max-width: calc(100% - 40px) !important;
      width: -moz-max-content;
      padding-top: 0px !important;
      white-space: pre-line !important;
      overflow: hidden !important;
      background-color: white;
      background-image: linear-gradient(rgba(85, 85, 85, 0.05) 90%, transparent 50%, transparent);
      background-size: 30px 17px;
  }

  pre.linenums.prettyprinted li.L0,
  pre.linenums.prettyprinted li.L1,
  pre.linenums.prettyprinted li.L2,
  pre.linenums.prettyprinted li.L3,
  pre.linenums.prettyprinted li.L4,
  pre.linenums.prettyprinted li.L5,
  pre.linenums.prettyprinted li.L6,
  pre.linenums.prettyprinted li.L7,
  pre.linenums.prettyprinted li.L8,
  pre.linenums.prettyprinted li.L9 {
      background: transparent none repeat scroll 0 0;
      margin-left: -17px !important;
      max-width: calc(100% + 32px) !important;
      min-width: calc(100% + 32px) !important;
  }

  /* COUNTER ALL */
  html {
      content: counter(myIndex, decimal-leading-zero);
      counter-reset: myIndex 00;
  }
  #script-info ul#script-links + header + #script-content .script-discussion-list .discussion-list-item .discussion-meta::before,
  .width-constraint #discussions li::before {
      content: counter(myIndex, decimal-leading-zero) !important;
      counter-increment: myIndex 1 !important;
      position: absolute;
      width: auto;
      height: 15px;
      line-height: 13px;
      min-width: 17px;
      left: 20px;
      margin-top: 30px;
      padding: 1px 3px;
      text-align: center;
      border-radius: 10px;
      font-size: 13px;
      color: tomato;
      box-shadow: 0 0 2px rgba(162, 160, 160, 0.6) inset;
      background: rgba(62, 59, 59, 0.6) none repeat scroll 0 0;
      opacity: 0.5;
  }
  #script-info ul#script-links + header + #script-content .script-discussion-list .discussion-list-item .discussion-meta::before {
      content: counter(myIndex, decimal-leading-zero);
      counter-increment: myIndex 1;
      left: 2px;
      margin-top: 0px;
  }
  /* (new241) SUPER LOAD PLU -DISC + NEW FORUM - ===  */
  body header#main-header + .width-constraint:first-of-type {
      display: inline-block !important;
      height: auto !important;
      min-width: 984px;
      max-width: 984px;
      margin: 55px 0 10px 23.4% !important;
      padding: 0;
      background: #333 !important;
  }

  /* PB SEARCH NO RESULTS - CIT */
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type {
      display: inline-block !important;
      height: 18px !important;
      min-width: 960px;
      max-width: 960px;
      margin: 0px 0 0px 24.8% !important;
      top: 38px !important;
      padding: 2px 0;
      z-index: 50 !important;
  }
  body[pagetype="ListingPage"] #script-table + .width-constraint,
  body[pagetype="ListingPage"] .pagination + .width-constraint,
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type {
      display: inline-block;
      height: 0;
      line-height: 0;
      margin: 65px 0 20px 23.4% !important;
  }
  body[pagetype="ListingPage"] #script-table + .width-constraint .sidebarred,
  body[pagetype="ListingPage"] .pagination + .width-constraint .sidebarred,
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type .sidebarred {
      display: inline-block !important;
      height: 0px;
      line-height: 0px;
  }
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type .sidebarred-main-content > p {
      position: relative;
      display: inline-block !important;
      height: 17px;
      line-height: 15px;
      width: 500px;
      top: 27px;
      padding: 0 2px;
      font-size: 15px !important;
      z-index: 100 !important;
  }
  /* (new213) SEARCH - NO SCRIPT FOUND + SHOW ONLY IN LANGUAGE */
  body[pagetype="ListingPage"] .width-constraint:first-of-type .sidebarred-main-content > h3 + p + p,
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type .sidebarred-main-content > p:first-of-type + p {
      position: fixed !important;
      display: inline-block !important;
      width: 8vw !important;
      height: auto !important;
      line-height: 15px !important;
      left: 14% !important;
      top: 7vh!important;
      font-size: 10px !important;
      text-align: center !important;
      border-radius: 5px !important;
      z-index: 50000000 !important;
      color: gold !important;
      background: #111 !important;
  }
  body[pagetype="ListingPage"] .width-constraint:first-of-type .sidebarred-main-content > h3 + p + p a:not([href*="/new"]):not([href*="/help/writing-user-scripts"]) {
      top: 2.6vh !important;
      /*     display: none!important; */
      /*     font-size: 0 !important; */
  }
  body[pagetype="ListingPage"] .sp-separator ~ .width-constraint .sidebarred-main-content > h3 + p + p a,
  body[pagetype="ListingPage"] .sp-separator ~ .width-constraint .sidebarred-main-content > h3 + p + p + p a,
  body[pagetype="ListingPage"] .sp-separator ~ .width-constraint a[href*="/new"],
  body[pagetype="ListingPage"] .sp-separator ~ .width-constraint a[href*="/help/writing-user-scripts"],
  body[pagetype="ListingPage"] .width-constraint:first-of-type .sidebarred .sidebarred-main-content > h3 + p + p + p a[href*="/new"],
  body[pagetype="ListingPage"] .width-constraint:first-of-type .sidebarred .sidebarred-main-content > h3 + p + p + p a[href*="/help/writing-user-scripts"] {
      display: none!important;
      font-size: 0 !important;
  }
  /* SEARCH - NO SCRIPTS - ONLY LANG VIEW  - GM "Superloader" */
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type .sidebarred-main-content > p:first-of-type {
      position: absolute !important;
      display: inline-block !important;
      top: 5px !important;
      padding: 0px;
      font-size: 0px !important;
      text-align: left !important;
  }
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type .sidebarred-main-content > p:first-of-type a {
      background: blue !important;
  }
  body[pagetype="ListingPage"] .sp-separator ~ .width-constraint .sidebarred-main-content > p:first-of-type,
  body[pagetype="ListingPage"] .sp-separator ~ .width-constraint .sidebarred-main-content > p:last-of-type,
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type .sidebarred-main-content > p:last-of-type {
      display: none !important;
  }
  /* SEARCH - NO SCRIPTS - GM "Superloader" */
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type ~ #script-table thead {
      position: fixed;
      height: 28px !important;
      min-width: 960px;
      max-width: 960px;
      margin-top: -23px;
      overflow: hidden !important;
      z-index: 5000 !important;
      background-color: yellow !important;
  }
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type ~ #script-table thead > tr > td {
      z-index: 50000 !important;
  }
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type ~ #script-table thead > tr > td:hover {
      z-index: 50000 !important;
      background-color: green !important;
  }

  /* for GM Superloader - ALL A VOIR */
  body header#main-header + .width-constraint:first-of-type {
      display: inline-block !important;
      height: auto !important;
      min-width: 985px;
      max-width: 985px;
      margin: 55px 0 20px 23.4% !important;
      padding: 0;
  }
  /* for GM Superloader */
  #sp-fw-container + .sp-separator ~ .width-constraint {
      display: inline-block !important;
      height: auto !important;
      min-width: 985px;
      max-width: 985px;
      margin: 20px 0 20px 23.4% !important;
      padding: 0;
  }

  /* TEST FOR SUPER LOADER */
  #sp-fw-container + .sp-separator ~ .width-constraint #script-info > #script-content {
      content: counter(myIndex, decimal-leading-zero);
      counter-reset: myIndex 0;
      counter-increment: myIndex;
  }
  .width-constraint #script-info #script-content h3 + ul#discussions {
      margin-top: 65px !important;
      margin-left: -10px;
  }
  .width-constraint #discussions li {
      line-height: 11px !important;
      padding-bottom: 10px;
  }
  .width-constraint #discussions li:nth-child(odd) {
      border-bottom: 1px solid gray;
      background: #222;
  }
  .width-constraint #discussions li:nth-child(even) {
      border-bottom: 1px solid gray;
      background: #333;
  }
  .width-constraint #discussions li:hover {
      transition: background 0.8s ease 0s;
      box-shadow: 1px 1px 6px 4px rgba(0, 0, 0, 0.7) inset;
      background: rgba(0, 0, 0, 0.8);
  }
  /* (new248) POST NEW COMMENT */
  #script-info ul#script-links + header + #script-content .post-discussion > p:first-of-type {
      position: fixed !important;
      display: inline-block !important;
      width: 50% !important;
      height: 22px !important;
      top: 23.6vh !important;
      margin: 0 0 0 -9px !important;
      padding: 0 7px !important;
      z-index: 5000000 !important;
  background: #111!important;
  }

  /* (new248) PB RULES REPORT */
  #script-info ul#script-links + header + #script-content .post-discussion > p:has(a[href*="/reports/new?item_class=s"]) {
      position: fixed !important;
      display: inline-block !important;
      width: 10% !important;
      height: auto !important;
      top: 20.9vh !important;
      margin: 0 0 0 -229px !important;
      padding: 0 7px !important;
      color: silver !important;
      z-index: 5000000000 !important;
      visibility: hidden !important;
  background: brown !important;
  }
  #script-info ul#script-links + header + #script-content .post-discussion > p:has(a[href*="/reports/new?item_class=s"]):hover {
      visibility: visible !important;
  background: brown !important;
  }
  #script-info ul#script-links + header + #script-content .post-discussion > p:has(a[href*="/reports/new?item_class=s"]):before {
      content: "🏁" !important;
      position: absolute !important;
      display: inline-block !important;
      width: 20px !important;
      height: auto !important;
      top: 0vh !important;
      margin: 0 0 0 190px !important;
      padding: 0 0px !important;
      border-radius: 3px  !important;
      text-align: center !important;
      z-index: 5000000000 !important;
      visibility: visible !important;
  background: peru !important;
  }




  /* (new248) PAGI */
  #script-info ul#script-links + header + #script-content .script-discussion-list + .pagination {
      position: fixed !important;
      display: inline-block !important;
      top: 219px !important;
      left: 55% !important;
      z-index: 5000000000 !important;
  }
  /* GREAS - SCRIPT PAGE - INSTALL CONT + META + INFOS + SCREENSHOTS */
  #script-info #script-content #install-area {
      position: fixed;
      display: inline-block;
      min-width: 950px;
      max-width: 950px;
      height: 40px;
      top: 218px;
      margin-left: -8px;
      padding: 5px 9px;
      z-index: 1;
      border-bottom: 1px solid gray;
      background-color: #f9ecdb;
  }
  /* (new189) */
  .width-constraint #script-info > #script-content #script-meta {
      display: inline-block !important;
      width: 950px !important;
      min-width: 950px !important;
      max-width: 950px !important;
      margin-top: 25px;
      margin-left: -6px !important;
      padding: 5px;
      border-bottom: 1px dotted gray;
  }
  .script-in-sets {
      position: fixed;
      display: inline-block;
      min-width: 298px;
      max-width: 298px;
      min-height: 34px;
      max-height: 34px;
      top: 216px;
      left: 40%;
      margin-left: 0;
      padding-left: 20px;
      font-size: 0;
      overflow: hidden;
      overflow-y: auto;
      z-index: 5000;
      border: 1px solid #404040;
      background: #222;
  }
  .script-in-sets:hover {
      height: auto;
      max-height: 100%;
      padding: 0 0 50px 20px;
  }
  .script-in-sets > a {
      display: inline-block;
      width: 291px;
      margin-left: 0;
      font-size: 13px;
      text-indent: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  .script-in-sets > select {
      display: inline-block;
      width: 252px;
      margin-top: 2px;
  }

  /* ADAP for GM "Make Bookmarklets from Javascript URLs" -
  https://greasyfork.org/fr/scripts/7668-make-bookmarklets-from-javascript-urls
  === */
  #install-area > div + span + a:not(.install-help-link),
  #install-area > div + span,
  #install-area > div {
      position: absolute;
      display: inline-block;
      height: 20px;
      top: 43px;
      left: 0;
      padding: 0 5px;
      background: gold;
  }
  #install-area > div:first-of-type + div {
      top: 63px;
      background: green;
  }
  #install-area > div:first-of-type + div:before {
      content: "Bklet ▼";
      position: absolute;
      display: inline-block;
      width: 50px;
      margin-top: -55px;
      left: 245px;
      padding: 5px;
      border-radius: 3px;
      font-size: 12px;
      text-align: center;
      visibility: visible;
      background: blue;
  }
  #install-area > div:first-of-type + div + span {
      top: 83px;
      cursor: help;
      background: aqua;
  }
  #install-area > div:first-of-type {
      opacity: 0;
      visibility: hidden;
  }
  #install-area > div:first-of-type + div,
  #install-area > div:first-of-type + div + span {
      visibility: hidden !important;
  }
  #install-area:hover > div:first-of-type,
  #install-area:hover > div:first-of-type + div,
  #install-area:hover > div:first-of-type + div + span {
      opacity: 1;
      visibility: visible !important;
  }
  #install-area span[style="padding-left: 8px;"] + a.install-help-link + a.install-link + a,
  #install-area span[style="padding-left: 8px;"] + a.install-help-link + a.install-link {
      float: right;
  }
  /* USER CSS - INSTALL */
  #install-area > p {
      position: absolute;
      margin-top: 0;
      right: 0;
      width: 20%;
  }

  /* SET CHOICE - FIRT VALUE SELECTED */
  .script-in-sets > select[name="action-set"] {
      -moz-appearance: none;
      position: relative;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      top: -2px;
  border: none;
  }
  .script-in-sets > select option[value^="ri-"] {
      -moz-appearance: none;
      color: peru;
      background: black;
      outline: 1px solid peru;
  }
  /* SET NEW */
  .script-in-sets > select option[value="ai-new"] {
      -moz-appearance: none;
      color: gold;
      background: black;
  }
  /* SET SUBMIT ARROW */
  .script-in-sets > input[value="→"][type="submit"] {
      -moz-appearance: none;
      position: relative;
      display: inline-block;
      height: 15px;
      line-height: 15px;
      top: -2px !important;
      margin-left: 2px;
      border: none;
      cursor: pointer;
  }
  .script-in-sets:before {
      content: "🔻";
      float: left !important;
      clear: none !important;
      height: 10px;
      line-height: 15px;
      width: 15px;
      top: 0px;
      margin-left: -20px;
      font-size: 12px;
      text-align: center;
      z-index: 5000;
  color: red;
  }
  /* (new255) INFOS DETAILS CONTAINER */
  .script-meta-block {
      display: inline-block !important;
      column-count: unset !important;
      min-width: 99% !important;
      max-width: 99% !important;
      height: 100% !important;
      min-height: 20vh !important;
      padding: 3px !important;
  border: 1px solid gray !important;
  }
  /* (new255) TABLE */
  #script-stats {
      /*display: inline-table !important;*/
      display: block !important;
      float: left;
      clear: none;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
  }
  /* (new234) LEFT */
  #script-stats dt {
      float: left;
      clear: both !important;
      height: 18px;
      line-height: 18px;
      min-width: 24% !important;
      max-width: 24% !important;
      margin: 0 0 0 0px !important;
      text-indent: 10px;
  border-left: 3px solid olive !important;
  border-bottom: 1px solid gray !important;
  }
  /* (new234) RIGHT */
  #script-stats dd {
      float: left;
      clear: none !important;
      height: 18px;
      line-height: 18px;
      min-width: 40% !important;
      max-width: 40% !important;
      margin: 0 0 0px 5px !important;
      padding: 0 0 0 0px !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  border-left: 3px solid olive !important;
  border-bottom: 1px solid gray !important;
  }

  /* APPLIES TO */
  #script-stats dt.script-show-applies-to {
      position: absolute !important;
      float: right !important;
      clear: both !important;
      min-width: 35% !important;
      max-width: 35% !important;
      right: 0 !important;
      margin: 0 !important;
      text-align: left !important;
      overflow-wrap: unset !important;
  border-left: 3px solid red !important;
  }
  #script-stats dd.script-show-applies-to {
      position: absolute !important;
      float: right !important;
      clear: both !important;
      min-width: 35% !important;
      max-width: 35% !important;
      height: auto !important;
      right: 0 !important;
      margin: 2vh 0 0 0px !important;
      text-align: left !important;
      overflow-wrap: unset !important;
      overflow: hidden !important;
  border-left: 3px solid red !important;
  }
  #script-stats dd.script-show-applies-to ul.block-list {
      display: inline-block !important;
      height: 17vh !important;
      line-height: 15px;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 0 0 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      white-space: pre !important;
  }
  #script-stats dd.script-show-applies-to ul.block-list.expandable > li,
  #script-stats dd.script-show-applies-to ul.block-list.expandable.collapsed > li {
      position: relative !important;
      display: inline-block !important;
      height: auto !important;
      line-height: 15px;
      width: 100% !important;
      min-width: 95% !important;
      max-width: 95% !important;
      margin: 0 2px 0 0 !important;
      top: -15px !important;
      left: -45px !important;
      padding: 1px 0 1px 5px !important;
  border-bottom: 1px solid red !important;
  }
  #script-stats dd.script-show-applies-to ul.block-list.expandable > li:first-of-type,
  #script-stats dd.script-show-applies-to ul.block-list.expandable.collapsed > li:first-of-type {
      position: relative !important;
      display: inline-block !important;
      height: auto !important;
      line-height: 15px;
      width: 100% !important;
      min-width: 95% !important;
      max-width: 95% !important;
      margin: -15px 0px -15px 0 !important;
      padding: 1px 0 1px 5px !important;
  border-bottom: 1px solid green !important;
  }

  #script-stats dd.script-show-applies-to ul.block-list.expandable > li code,
  #script-stats dd.script-show-applies-to ul.block-list.expandable.collapsed > li code {
      position: relative;
      display: inline-block !important;
      height: auto !important;
      line-height: 15px;
      width: 100% !important;
      min-width: 98% !important;
      max-width: 98% !important;
      margin: 0 0 0 0 !important;
      top: 0;
      padding: 0 !important;
      white-space: pre-wrap !important;
      overflow-wrap: break-word;
      overflow: hidden !important;
  color: white;
  background-color: transparent !important;
  border: none !important;
  }
  /* COMPATIBILITY */
  /* (new225) GREASY - SCRIPT PAGE - INSTA CONT - "APPLIES" TO CONT */
  #script-meta > div {
      float: right;
      clear: none;
      width: 46%;
      height: 100%;
      min-height: 182px;
      max-height: 182px;
      margin: 0 0 0 0;
      top: 0px;
      padding: 0px;
  border: 1px solid gray;
  }
  #script-meta #script-applies-to {
      display: inline-block !important;
      width: 100%;
      height: 100%;
      min-height: 170px;
      max-height: 170px;
      padding: 5px;
      overflow: hidden;
  }
  #script-applies-to dt.script-show-applies-to {
      display: inline-block !important;
      width: 98% !important;
      margin-top: -3px;
      padding: 0;
      text-align: left;
  }
  #script-applies-to dd.script-show-applies-to {
      width: 98% !important;
  }
  #script-applies-to dd.script-show-applies-to ul.inline-list {
      display: inline-block;
      width: 98% !important;
      max-height: 180px;
      padding: 2px 2px 20px 2px;
      border-radius: 3px;
      overflow: hidden;
      overflow-y: auto;
  }
  #script-meta > div code {
      position: relative;
      display: inline-block;
      height: 15px;
      line-height: 15px;
      padding: 1px 4px;
      border-radius: 3px;
      border: none;
      font-size: 90%;
      white-space: nowrap;
  color: #aba2a4;
  background-color: #262626;
  }
  #script-meta > div .inline-list > li:nth-child(even) code {
      color: #BAA591;
      background-color: #1A1919
  }
  #script-meta > div .inline-list > li:nth-child(odd) code {
      color: #BAA591;
      background-color: #363535;
  }

  /* LINKYFY PLUS */
  .script-show-applies-to .inline-list li a,
  .script-show-applies-to .inline-list li a.linkifyplus {
      position: relative;
      display: inline-block;
      height: 15px;
      line-height: 15px;
      padding: 1px 4px;
      border-radius: 3px;
  color: #BAA591;
  background-color: #1A1919;
  }
  .script-show-applies-to .inline-list li:nth-child(even) a,
  .script-show-applies-to .inline-list li:nth-child(even) a.linkifyplus {
      color: #D0A070;
      background-color: #1A1919;
  }
  .script-show-applies-to .inline-list li:nth-child(odd) a,
  .script-show-applies-to .inline-list li:nth-child(odd) a.linkifyplus {
      color: #BAA591 !important;
      background-color: #1A1919;
  }
  .script-show-applies-to .inline-list li:hover a,
  .script-show-applies-to .inline-list li:hover a.linkifyplus {
      color: tomato;
      background-color: #1A1919;
  }
  .expander {
      display: none;
  }

  /* GREAS - SCRIPT PAGE - LIST "FAV BY" - ==== */
  #script-content > #feedback-favoriters + div {
      display: inline-block;
      width: 953px;
      margin-top: -10px;
      font-size: 0px;
  }
  #script-content ul.inline-list,
  #script-content > #feedback-favoriters + ul.inline-list {
      display: inline-block;
      height: 59px !important;
      padding-left: 0;
      overflow: hidden;
      overflow-y: auto;
  border: 1px solid gray;
  }
  #script-content > #feedback-favoriters + div + p {
      margin-bottom: 5px;
      margin-top: 5px !important;
  }
  .inline-list > li:nth-child(odd) > a,
  .inline-list > li:nth-child(even) > a {
      display: inline-block;
      padding: 1px 3px;
      border-radius: 3px;
      font-size: 14px !important;
  color: red !important;
  }
  .inline-list > li:nth-child(odd) > a {
      background: #222;
  }
  .inline-list > li:nth-child(even) > a {
      background: #333;
  }
  /* (new251) GREASY - SCRIPT PAGE - INFOS CONT */
  .width-constraint #script-info > #script-content #additional-info {
      position: relative;
      display: inline-block;
      float: none !important;
      min-width: 950px;
      max-width: 950px;
      top: 10px;
      margin: 0 0 -14px -5px;
      padding: 5px;
      border-radius: 5px;
      text-align: left !important;
      overflow: visible;
  background: #222;
  border: 1px solid red;
  }
  .width-constraint #script-info > #script-content h3,
  .width-constraint #script-info > #script-content #additional-info h5,
  .width-constraint #script-info > #script-content #additional-info h6 {
      margin-bottom: 5px;
      margin-top: 5px;
      font-size: 15px;
  }
  #additional-info > sub > sup,
  #additional-info > sub {
      font-size: 15px;
  }
  #additional-info > small {
      display: inline-block !important;
      font-size: 15px;
      line-height: 16px !important;
      padding-left: 5px !important;
      text-indent: 10px !important;
  }
  #additional-info > small li {
      display: block !important;
      font-size: 15px !important;
      line-height: 16px !important;
  }
  #additional-info > small li small,
  #additional-info > li {
      display: block !important;
      font-size: 17px !important;
      line-height: 17px !important;
  }
  #additional-info > li > pre {
      position: relative;
      display: inline-block;
      float: none;
      max-width: 930px;
      min-width: 930px;
      margin: 4px 0 4px 0px;
      padding: 0 5px;
      border-radius: 5px;
      text-align: left;
      overflow: hidden !important;
      white-space: pre-line !important;
  border: 1px solid red;
  }
  .script-author-description > table td blockquote,
  .script-author-description > table td {
      float: left;
      clear: left;
      vertical-align: top;
      min-width: 920px;
      max-width: 920px;
      padding: 5px;
      border-radius: 3px;
      word-wrap: break-word;
  border: 1px solid gray;
  }
  .script-author-description > table td blockquote {
      min-width: 900px;
      max-width: 900px;
  border: 1px solid yellow;
  }
  .script-author-description > p > code {
      display: inline-block;
      white-space: pre-line;
  }
  #additional-info > pre,
  #additional-info > .script-author-description > pre,
  .script-author-description > blockquote > pre {
      margin-left: 30px;
      padding: 5px 10px;
      border-radius: 2px;
      word-wrap: break-word;
      color: white;
      border: 1px solid gray;
      background-color: #5c5c5c;
  }
  .width-constraint #script-info > #script-content #additional-info > p:not(:empty) {
      display: inline-block !important;
      width: 99.9%;
      line-height: 17px;
      margin-bottom: 0;
      text-align: left !important;
  }
  .width-constraint #script-info > #script-content #additional-info > p > a {
      display: inline-block !important;
      float: none !important;
      width: auto !important;
      line-height: 17px;
      margin-bottom: 0;
      text-align: left !important;
  }
  #additional-info > h5,
  #additional-info > h4,
  #additional-info > h4[style="color: rgb(113, 150, 184);"],
  #additional-info > h4[style="color:#08355c"] {
      margin-bottom: 5px !important;
      margin-top: 5px !important;
      color: #7196B8 !important;
  }

  /* (new251) GREAS - IMG - SCRIPT INFO - IMAGES - MAX WIDTH  - WITH /Without GM TS CIT
  ADAP FOR SOME PARTICULAR IMAGES = */

  /* (new251) GREAS - IMG - IMAGES GENERIC */
  #additional-info .script-author-description > p img ~ br {
      display: none;
  }
  .width-constraint #script-info > #script-content #additional-info > p > a[href$=".gif"],
  .width-constraint #script-info > #script-content #additional-info > p > a[href$=".jpeg"],
  .width-constraint #script-info > #script-content #additional-info > p > a[href$=".png"] {
      display: inline-block !important;
      width: 100%;
      text-align: center;
  }

  #additional-info .fancybox img {
      box-shadow: none;
      color: yellow;
      max-height: 100px;
  border: 1px solid orange;
  }



  /* (new251) GREAY - IMG - FOR: ????
  https://greasyfork.org/fr/users/371179-%F0%9D%96%A2%F0%9D%96%B8-%F0%9D%96%A5%F0%9D%97%8E%F0%9D%97%87%F0%9D%97%80?sort=updated
  === */
  section#about-user #user-profile.user-content img {
      display: block !important;
      width: auto;
      min-width: 25%;
      max-width: 25%;
      max-height: 10vh !important;
      margin: 0 0 0 00 !important;
      padding: 2px;
      border-radius: 3px;
      object-fit: contain !important;
  box-shadow: 5px 5px 2px #181818;
  background-color: #2b2b2b;
  border: 1px solid orange !important;
  }

  /* (new251) GREAS - IMG - FOR: "https://api.dicebear.com
  https://greasyfork.org/fr/scripts/472616-replace-ugly-avatars
  === */
  #additional-info img[src^="https://api.dicebear.com"],
  #additional-info.user-content p > img[src^="https://api.dicebear.com/"] {
      display: block !important;
      float: left !important;
      min-width: 5% !important;
      max-width: 5% !important;
      max-height: 4vh !important;
      margin: 0 0 0 40px !important;
      border-radius: 3px;
  }


  /* (new251) GREASY - IMG - FOR NOT :camo.githubusercontent.com 
  https://greasyfork.org/en/scripts/510952-google-maps-reviews-scraper-exporter
  NOT WORK: transition: height ease 2s  !important;
  === */
  #additional-info.user-content p img:not([src^="https://camo.githubusercontent.com"], [src="https://i.imgur.com/hgjQd00.png"] , [src="https://i.imgur.com/VWMw0YC.png"] , [src="https://i.imgur.com/4aJukqO.png"] , [src="https://i.imgur.com/UTLrRZu.png"]),


  .lightbox .lb-image:not([src^="https://camo.githubusercontent.com"], [src="https://i.imgur.com/hgjQd00.png"] , [src="https://i.imgur.com/VWMw0YC.png"], [src="https://i.imgur.com/4aJukqO.png"] , [src="https://i.imgur.com/UTLrRZu.png"]) {
      height: auto;
      max-width: 80%;
      border-radius: 3px;
  }
  #additional-info.user-content p img:not([src^="https://camo.githubusercontent.com"], [src^="https://cdn.ko-fi.com/cdn/"], [src="https://i.imgur.com/hgjQd00.png"] , [src="https://i.imgur.com/VWMw0YC.png"], [src="https://i.imgur.com/4aJukqO.png"] , [src="https://i.imgur.com/UTLrRZu.png"]) {
      display: block !important;
      width: auto;
      min-width: 58% !important;
      max-width: 58% !important;
      max-height: 275px;
      margin: auto;
      padding: 2px;
      border-radius: 3px;
      object-fit: contain !important;
      transition: width ease 0.7s !important;
  box-shadow: 5px 5px 2px #181818;
  background-color: #2b2b2b;
  border: 1px solid orange !important;
  }
  /* HOVER */
  #additional-info.user-content p img:not([src^="https://camo.githubusercontent.com"], [src^="https://cdn.ko-fi.com/cdn/"], [src="https://i.imgur.com/hgjQd00.png"] , [src="https://i.imgur.com/VWMw0YC.png"], [src="https://i.imgur.com/4aJukqO.png"] , [src="https://i.imgur.com/UTLrRZu.png"]):hover {
      display: block !important;
      width: auto;
      min-width: 98% !important;
      max-width: 98% !important;
      max-height: 30vh !important;
      margin: auto;
      padding: 2px;
      border-radius: 3px;
      object-fit: contain !important;
      transition: width ease 2s !important;
  box-shadow: 5px 5px 2px #181818;
  background-color: #2b2b2b;
  border: 1px solid aqua !important;
  }

  /* (new251) GREASY - IMG - FOR: cdn.jsdelivr.net / img.shields.io == */
  #additional-info img[src^="https://cdn.jsdelivr.net"],
  #additional-info.user-content p > img[src^="https://img.shields.io/"] {
      display: block !important;
      float: left !important;
      min-width: 13% !important;
      max-width: 13% !important;
      max-height: 4vh !important;
      margin: 0 0 0 40px !important;
      border-radius: 3px;
  }

  /* (new251) GREASY - IMG - FOR: BY ME A COFEE - https://cdn.ko-fi.com/cdn/kofi3.png?v=2
  IN
  https://greasyfork.org/en/scripts/432409-youtube-square
  == */
  #additional-info.user-content p img[src^="https://cdn.ko-fi.com/cdn/"] {
      display: block !important;
      float: left !important;
      min-width: 27% !important;
      max-width: 27% !important;
      max-height: 15vh !important;
      margin: 0 0 0 40px !important;
      box-shadow: none ;
      border-radius: 3px;
  }
  /* (new251) GREASY - IMG - FOR LINE BLUE img:
  https://media.chatgptautorefresh.com/images/separators/gradient-aqua.png?latest
  IN
  https://greasyfork.org/fr/scripts/498904-script-finder */
  [src^="https://media.chatgptautorefresh.com/images/separators/"],
  #additional-info img[src^="https://media.chatgptautorefresh.com/images/separators/"],
  #additional-info.user-content p img[src^="https://media.chatgptautorefresh.com/images/separators/"] {
      display: inline-block !important;
      min-width: 98% !important;
      max-width: 98% !important;
      height: 9px;
      margin: auto;
      padding: 0px !important;
  box-shadow: unset !important;
  background-color: #2b2b2b;
  border: none !important;
  }


  /* (new251) GREASY - LIGHTBOX - POSI */
  /* SOURCE - SUPP "Source" - ==== */
  .width-constraint #script-info > #script-content #additional-info > div.script-screenshots:after,
  .width-constraint #script-info > #script-content #additional-info > div.user-screenshots:after {
      position: relative;
      float: right;
      clear: both;
      content: " 🔻 Preview 🔻 ";
      height: 15px;
      line-height: 12px;
      width: 140px;
      margin-top: 58px;
      margin-right: -83px;
      transform: rotate(90deg);
      text-align: center;
      letter-spacing: 1.7px;
      z-index: 500000 !important;
      border: 1px solid gold;
      background: black;
  }
  .width-constraint #script-info > #script-content #additional-info > div.script-screenshots,
  .width-constraint #script-info > #script-content #additional-info > div.user-screenshots {
      position: absolute !important;
      display: inline-block !important;
      height: 140px;
      line-height: 140px;
      width: 100%;
      top: -170px;
      right: -7px;
      text-align: right;
      clip: rect(0px, 990px, 145px, 970px);
      transition: all ease 1.5s;
      z-index: 5000000 !important;
      border: 1px solid peru;
      background: red;
  }
  .width-constraint #script-info > #script-content #additional-info > div.script-screenshots:hover,
  .width-constraint #script-info > #script-content #additional-info > div.user-screenshots:hover {
      clip: rect(0px, 1007px, 185px, 0px);
      z-index: 5000000 !important;
      background: black !important;
  }
  .width-constraint #script-info > #script-content #additional-info > div.script-screenshots img,
  .width-constraint #script-info > #script-content #additional-info > div.user-screenshots img {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      max-width: 100% !important;
      padding: 2px;
      color: yellow;
      box-shadow: -4px 5px 2px #222 !important;
  }
  .width-constraint #script-info > #script-content #additional-info > div.script-screenshots a,
  .width-constraint #script-info > #script-content #additional-info > div.user-screenshots a {
      display: inline-block !important;
      width: 152px;
      height: 140px;
      margin: -15px 17px 0px -7px;
  }

  /* (new251) OK GREASY - CODE - SCRIPT INFO */
  .script-author-description > p > code,
  #additional-info > .script-author-description > pre > code,
  #additional-info > .script-author-description > blockquote > pre > code {
      max-width: 99% !important;
  /*border: 1px solid aqua !important;*/
  }
  #additional-info ol pre {
      min-width: calc(100% - 8%)!important;
      max-width: calc(100% - 8%)!important;
  /*border: 1px solid aqua !important;*/
  }
  .width-constraint #script-info > #script-content #additional-info > div {
      padding: 5px;
      color: gray !important;
      background-color: #2B2B2B;
  }

  /* GREASY - CODE PAGE : adapt for GM (config in script page):
  https://greasyfork.org/fr/scripts/23840-greasyfork-search-with-sleazyfork-results-include
  === */
  pre.prettyprint.linenums {
      margin-left: 0px;
      padding: 5px 0px 5px 0px;
      left: 5px !important;
      white-space: pre-wrap;
      word-wrap: break-word;
      background-color: #222;
  }
  /* CODE - GM (config in script page) */
  #code-container {
      max-height: 620px;
      width: 100%;
      margin-left: -5px;
      margin-top: 8px;
      overflow-x: hidden;
      background-color: white;
  }

  /* CODE - GREAS - SCRIPT INFOS - CODE */
  #script-feedback-suggestion + #code-container {
      max-height: 615px;
      width: 100%;
      margin-left: -5px;
      margin-top: 22px;
      overflow-x: hidden;
      background-color: white;
  }

  /* GREASY - DISCUSS / HISTORIC etc */
  #script-content > p:not(:empty):not(:first-of-type):not(:empty) {
      margin-top: 10px;
      margin-bottom: 20px;
      padding: 5px;
      border-radius: 4px;
      text-align: center;
      background-color: #f9dacd;
  }

  /* GREAS - SCRIPT INFOS - FAV USERS */
  #feedback-favoriters {
      position: relative;
      display: inline-block;
      width: 99.5%;
      margin-top: 10px;
      margin-bottom: 20px;
      padding: 5px;
      border-radius: 4px;
      text-align: center;
      background-color: #333;
  }

  /* GREAS - SCRIPT INFO - HIST - WATCH DIFF (HOVER BUTTON) */
  .diff {
      margin-top: 80px;
  }
  .width-constraint #script-info > #script-content > form[action$="/diff"] {
      width: 934px;
      margin-top: 90px;
  }
  .width-constraint #script-info > #script-content > form > ul {
      width: 950px;
      height: 610px;
      margin-top: 0px;
      margin-bottom: 0;
      padding-left: 5px;
      overflow-x: hidden;
      overflow-y: auto;
      border-top: 1px dashed gray;
      border-bottom: 1px dashed gray;
  }
  .width-constraint #script-info > #script-content > form[action$="/diff"] > input:first-of-type {
      margin-bottom: 15px;
      cursor: pointer;
      visibility: hidden;
  }
  .width-constraint #script-info > #script-content > form[action$="/diff"] > input:last-of-type {
      -moz-appearance: none;
      position: fixed;
      width: 10px;
      height: 15px;
      top: 27.9%!important;
      margin-left: -40px;
      padding-right: 0px;
      cursor: pointer !important;
      transition: width ease 0s, margin ease 0.1s;
      color: transparent;
      border-left: 19px solid #AAA;
      border-bottom: 9px solid transparent;
      border-top: 9px solid transparent;
      border-right: none;
      background: green;
  }
  .width-constraint #script-info > #script-content > form[action$="/diff"] > input:last-of-type:hover {
      -moz-appearance: button;
      margin-left: -140px;
      width: 145px;
      height: auto;
      line-height: 12px;
      white-space: normal;
      border: none;
      cursor: pointer;
      transition: width ease 0s, margin ease 0.7s;
      color: black;
  }
  /* ( new252) DIFF CODE */
  .width-constraint #script-info > #script-content > form + p + .diff ul {
      display: table;
      max-width: 945px;
      min-width: 945px;
      font-size: 13px;
      margin: 0;
      overflow: auto;
      padding: 5px;
      background: #111 !important;
  }
  .width-constraint #script-info > #script-content > form + p + .diff ul li {
      display: inline-block;
      max-width: 945px;
      min-width: 945px;
      height: auto !important;
      margin: 0;
      padding: 0;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      text-align: left;
  }
  .width-constraint #script-info > #script-content > form + p + .diff ul li del,
  .width-constraint #script-info > #script-content > form + p + .diff ul li ins,
  .width-constraint #script-info > #script-content > form + p + .diff ul li span {
      display: inline-block;
      max-width: 945px;
      height: 1em;
      margin: 0;
      padding: 0;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      text-align: left;
  }
  .diff li.diff-block-info {
      display: table-row;
      height: 1.4em;
      padding: 0;
      background: rgba(128, 128, 128, 0.17);
  }

  /* (new224) USERSTYLE STATS */
  .PageContent #install-stats-chart-container {
      float: left;
      width: 46%;
      height: 100vh !important;
      min-height: 54vh !important;
      max-height: 54vh !important;
      background: #222 !important;
  }
  .PageContent > #install-stats-chart-container + table {
      display: inline-block !important;
      width: 100% !important;
      min-width: 50% !important;
      max-width: 50% !important;
      height: 100vh !important;
      min-height: 54vh !important;
      max-height: 54vh !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      background: #222 !important;
      border-bottom: 1px solid red !important;
  }
  .PageContent > #install-stats-chart-container + table > thead {
      position: sticky;
      top: 0vh;
      background: #111;
  }
  .PageContent > #install-stats-chart-container + table > tfoot {
      position: sticky;
      bottom: 0vh;
      background: #111;
  }

  /* GREASY - SCRIPT STATS */
  #script-content > script[src*="assets"] ~ h3 {
      margin-top: 25px;
      margin-bottom: 5px;
      padding: 5px;
      border-radius: 4px;
      text-align: center;
  }
  [id$="-chart-container"] {
      background: white;
  }
  td.numeric,
  th.numeric {
      text-align: left;
      text-align: center;
  }
  /* GREASY - SCRIPT - DISC TABLE - ITEMS */
  .width-constraint #discussions li > a:first-of-type {
      display: inline-block;
      width: 835px;
      height: 20px;
      line-height: 20px;
      margin-left: 0 !important;
      padding: 2px 5px;
      color: #B4A393;
      background: black;
  }
  .width-constraint #discussions li > a:first-of-type:hover {
      color: tomato;
  }
  .width-constraint #discussions li > time:first-of-type {
      display: inline-block;
      width: 95px;
      margin-right: 20px;
      text-align: center;
  }
  .width-constraint #discussions li > time:last-of-type {
      display: inline-block;
      width: 125px;
      margin-left: -30px;
      text-align: center;
      white-space: nowrap;
  }
  .width-constraint #discussions li > a:nth-child(2) {
      width: 180px;
      display: inline-block;
      margin-left: 5px;
  }
  .width-constraint #discussions li > a:nth-child(4) {
      width: auto;
      display: inline-block;
      margin-left: 5px;
  }

  /* GM VERS - CONT - MORE VERS */
  .width-constraint #script-info > #script-content > form > input:first-of-type + ul {
      margin-top: -5px;
  }
  /* VERS - CONT - ONE VERS - NOT DIFF VERS */
  .width-constraint #script-info > #script-content > form:not(.diff_options) > ul {
      display: inline-block !important;
      width: 100%;
      min-width: 934px;
      max-width: 934px;
      outline: 4px solid red;
  }
  /* GM VERS - ITEMS - ALL */
  .width-constraint #script-info > #script-content > form > input:first-of-type {
      margin-bottom: -3px;
      padding-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-top: 1px solid gray;
  }
  /* (new239) */
  .width-constraint #script-info > #script-content > form > ul li {
      display: inline-block !important;
      width: 100%;
      min-width: 934px;
      max-width: 934px;
      margin-bottom: -3px;
      padding-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      border-top: 1px solid gray;
  }
  .width-constraint #script-info > #script-content > form > ul li span.version-changelog > ul > li {
      display: inline-block !important;
      height: auto !important;
      width: 100%;
      min-width: 520px !important;
      max-width: 520px !important;
      margin: 0 0 -3px 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      text-overflow: ellipsis;
      word-wrap: break-word !important;
      white-space: pre-wrap !important;
      border-top: 1px solid gary;
  }
  /* COR FLOAT */
  .width-constraint #script-info > #script-content > form > ul li span.version-changelog > ol li {
      position: relative !important;
      display: block !important;
      float: left !important;
      clear: both !important;
      width: 100%;
      min-width: 504px !important;
      max-width: 504px !important;
      margin-bottom: 0px !important;
      padding: 0 !important;
      overflow: hidden!important;
      text-overflow: ellipsis;
      word-wrap: break-word !important;
      white-space: pre-wrap !important;
      border-top: 1px solid gray;
  }


  .width-constraint #script-info > #script-content > form > ul li:hover {
      transition: all ease 0.7s;
      background: #111;
  }

  .width-constraint #script-info > #script-content > form > ul li .version-changelog {
      float: right !important;
      clear: both !important;
      width: 100%;
      min-width: 520px !important;
      max-width: 520px !important;
      margin: -30px 19px 0 0 !important;
      padding-right: 0px !important;
      overflow: hidden !important;
      text-overflow: ellipsis;
      white-space: normal !important;
      color: tan !important;
  }
  /* (new218) */
  .history_versions .version-changelog > ul {
      padding: 0 !important;
      color: tan !important;
  }

  .history_versions .version-changelog > ul li {
      height: 20px !important;
      line-height: 25px !important;
      width: 100%;
      min-width: 680px !important;
      max-width: 680px !important;
      margin-top: 0px !important;
      margin-right: 19px !important;
      padding-right: 0px !important;
      overflow: hidden !important;
      text-overflow: ellipsis;
      white-space: normal !important;
  }
  .history_versions .version-changelog > ul li:nth-child(odd) {
      color: #CD9A58 !important;
      background: #333 !important;
  }
  .history_versions .version-changelog > ul li:nth-child(even) {
      color: tan !important;
      background: #222 !important;
  }
  /* (new239) */
  .width-constraint #script-info > #script-content > form > ul li span.version-changelog > p {
      width: 520px !important;
      margin: 0px !important;
      padding: 0 !important;
      background: #333 !important;
  }
  .width-constraint #script-info > #script-content > form > ul li span.version-changelog > ol {
      padding-left: 10px;
  }


  .history_versions .version-number {
      min-width: 149px !important;
      max-width: 149px !important;
      height: 20px !important;
      line-height: 25px !important;
      padding-left: 3px !important;
  }
  .history_versions .version-date {
      clear: none !important;
      height: 20px !important;
      line-height: 25px !important;
      padding-left: 3px !important;
  }

  #script-content > form > ul > li > input + a {
      display: inline-block;
      width: 15%;
      padding: 1px 5px;
      background: #222;
  }
  #script-content > form > ul > li:nth-child(odd) > input + a {
      background: #222;
  }
  #script-content > form > ul > li:nth-child(even) > input + a {
      background: #333;
  }
  .width-constraint #script-info > #script-content > form > ul li time {
      display: inline-block;
      min-width: 202px;
      max-width: 202px;
      padding: 1px 5px;
      letter-spacing: 1.4px;
      text-align: center;
  }
  .width-constraint #script-info > #script-content > form > ul li:nth-child(odd) time {
      background: #222;
  }
  .width-constraint #script-info > #script-content > form > ul li:nth-child(even) time {
      background: #333;
  }
  /* CHECKED */
  .width-constraint #script-info > #script-content > form > ul.history_versions > li input[name="v1"]:checked + input + a,
  .width-constraint #script-info > #script-content > form > ul.history_versions > li input[name="v1"]:checked + input + a + time {
      background: green;
      color: white;
  }
  .width-constraint #script-info > #script-content > form > ul.history_versions > li input[name="v2"]:checked + a,
  .width-constraint #script-info > #script-content > form > ul.history_versions > li input[name="v2"]:checked + a + time {
      background: tomato;
      color: white;
  }

  /* (new239) HISTORY - SHOW DIFF BUTTON */
  .history_versions + p {
      margin: 5px 0 0 0 !important;
  }



  /* GREASY - FORUM TABLE */
  .Message table {
      border-collapse: separate;
      border-spacing: 4px;
      margin: 1em -4px;
      width: 650px;
  }
  .Message table thead {
      width: 600px;
  }
  .Message th {
      padding-bottom: 0.5em;
      padding-top: 0.5em;
      font-size: 105%;
      background: linear-gradient(to bottom, rgba(19, 19, 19, 1) 0%, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 63%, rgba(0, 0, 0, 1) 98%) repeat scroll 0 0 rgba(0, 0, 0, 0);
  }
  .Message table tbody {
      width: 600px;
  }
  .Message table tbody tr td:first-of-type {
      width: 120px;
      vertical-align: middle;
      color: gold;
      border: 1px solid red;
  }
  .Message table tbody tr td:first-of-type + td {
      min-width: 75px;
      max-width: 75px;
      vertical-align: middle;
      color: gold;
      border: 1px solid green;
  }
  .Message table tbody tr td:last-of-type {
      min-width: 280px;
      max-width: 280px;
      border: 1px solid blue;
  }
  .Message table tbody tr td:last-of-type code {
      float: left!important;
      min-width: 290px;
      max-width: 290px;
      margin-left: -6px;
      padding: 1px 3px;
      border-radius: 3px;
      white-space: pre-line;
      color: #eb5100;
      background-color: #f9ebd2;
  }

  /* GREASY - BROWSE / USER SCRIPTS */
  #user-script-list > li,
  #browse-script-list > li {
      padding: 5px;
  }
  #user-script-list > li:nth-child(odd),
  #browse-script-list > li:nth-child(odd) {
      background-color: #222;
  }
  #user-script-list > li:nth-child(odd):hover,
  #browse-script-list > li:nth-child(odd):hover {
      transition: background 0.8s ease 0s;
      box-shadow: 1px 1px 6px 4px rgba(0, 0, 0, 0.7) inset;
      background-color: rgba(7, 7, 7, 0.67);
  }
  #user-script-list > li:nth-child(even),
  #browse-script-list > li:nth-child(even) {
      background-color: #414141;
  }
  #user-script-list > li:nth-child(even):hover,
  #browse-script-list > li:nth-child(even):hover {
      transition: background 0.8s ease 0s;
      box-shadow: 1px 1px 6px 4px rgba(0, 0, 0, 0.7) inset;
      background-color: rgba(7, 7, 7, 0.57);
  }
  #user-script-list > li:hover,
  #browse-script-list > li:hover {
      z-index: 1;
      background-color: black;
  }
  /* without script - NO CIT */
  #user-script-list > li h2,
  #browse-script-list > li h2 {
      display: inline-block;
      width: 100%;
      max-width: 100%;
      word-wrap: break-word;
      overflow: hidden;
  }
  #user-script-list > li h2 a,
  #browse-script-list > li h2 a {
      display: inline-block;
      width: 100%;
      line-height: 17px;
  }
  #browse-script-list > li h2 span:not(.note-obj-user-tag):not(.gf-translation-badge) {
      width: 100%;
      max-width: 720px;
      overflow: hidden;
  }
  #user-script-list > li h2 span.name-description-separator,
  #browse-script-list > li h2 span.name-description-separator {
      display: none;
  }

  /* (new248) GREASY - BROWSE SCRIPTS - LEFT SORT PANEL - WIth/Without CIT */
  /*  without CITRUS*/
  .width-constraint #script-list-option-groups.list-option-groups {
      width: 192px;
      float: left;
      margin: 7px 0 0 5px;
  }
  .width-constraint #script-list-option-groups.list-option-groups #script-list-sort > div {
      margin-top: 19px;
  }
  /* for GM "Superloder */
  #main-header:not(:first-of-type) + .width-constraint .sidebarred .list-option-groups {
      display: none !important;
  }
  .width-constraint #script-list-option-groups.list-option-groups .list-option-group {
      margin-bottom: 0.5em;
      padding: 0.5em;
      border-radius: 5px 0 0 5px;
      box-shadow: 3px 3px 2px black;
      border: 1px solid gray;
      background-color: #2d2d2d;
  }
  .list-option-button {
      padding: 2px 0;
      border: 1px solid gold !important;
      background-color: #111 !important;
  }
  .list-option-groups a.list-option-button:focus,
  .list-option-groups a.list-option-button:hover {
      padding: 2px 0;
      border: 1px solid gold !important;
      background: #333 !important;
  }
  .list-option-group ul {
      padding: 2px 0;
      box-shadow: 3px 3px 2px black;
      background-color: transparent;
  }
  .width-constraint #browse-script-list {
      float: left;
      width: 99%;
      margin-left: 10px;
  }
  .list-option-group .list-current {
      height: 19px;
      line-height: 15px;
      margin-bottom: 2px;
      padding: 2px 0 0 0;
  }
  .list-option-group .list-option {
      height: 19px;
      line-height: 9px;
      border: 1px solid #404040;
  }
  .list-option-group:last-of-type .list-option:last-of-type {
      height: 30px !important;
      line-height: 9px;
      border: 1px solid #404040;
  }
  .list-option-group .list-option.list-current {
      height: 19px;
      line-height: 19px;
      margin-left: 0;
      padding-left: 20px;
      border: 1px solid red;
      color: gold;
      background: #111;
  }
  .list-option-group .list-option a {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  .width-constraint #script-list-option-groups.list-option-groups + h3 + p,
  .width-constraint #script-list-option-groups.list-option-groups + h3,
  #browse-script-list + .pagination + p {
      float: left;
      width: 727px;
      margin-bottom: 8px;
      margin-left: 59px;
      margin-top: -15px;
      padding: 5px;
      background: #222;
  }
  .width-constraint #script-list-option-groups.list-option-groups + h3 {
      margin-top: 0px;
      margin-bottom: 18px;
      border-bottom: 1px solid gray;
  }

  /* (new214) SETS / SITES LISTS - PANEL LEFT - NO GM */
  .sidebar.collapsed #script-list-option-groups #script-list-filter.list-option-group > ul,
  .sidebar.collapsed .list-option-groups #script-list-set.list-option-group > ul {
      height: 17vh !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      background-color: transparent;
  }


  /* PANEL LANGUE CSS / JAV */
  .sidebar.collapsed {
      display: inline-block !important;
      padding: 0 !important;
      width: 0 !important;
      border: none !important;
  }
  .width-constraint #script-list-option-groups.list-option-groups {
      position: fixed;
      display: inline-block !important;
      left: 11.4%;
      top: 80px;
      visibility: visible;
      z-index: 0 !important;
  }
  /* CIT */
  [pagetype="UserProfile"] .width-constraint #script-list-option-groups.list-option-groups {
      left: 13.4% !important;
      top: 120px;
      z-index: 5 !important;
  }
  [pagetype="PersonalProfile"] .width-constraint #script-list-option-groups.list-option-groups {
      left: 13.4%;
      top: 120px;
      z-index: 5 !important;
  }
  body[pagetype="UserProfile"] .width-constraint #script-list-option-groups.list-option-groups {
      left: 12.4%;
      z-index: 0 !important;
  }
  body[pagetype="ListingPage"] .width-constraint #script-list-option-groups.list-option-groups {
      left: 14.3%;
      top: 120px;
  }

  /* SHOW ALL LANG */
  body[pagetype="ListingPage"] .sidebarred-main-content > p {
      position: fixed !important;
      display: inline-block !important;
      top: 27px;
      font-size: 0px !important;
      z-index: 5000000 !important;
  }

  /* ONLY ONE */
  body[pagetype="ListingPage"] header#main-header + .width-constraint:first-of-type .sidebarred-main-content > p:first-of-type a,
  body[pagetype="ListingPage"] .sidebarred-main-content > p > a[href*="/scripts"],
  body[pagetype="ListingPage"] .sidebarred-main-content > p > a[href*="/scripts?language=css"],
  body[pagetype="ListingPage"] .sidebarred-main-content > p > a[href*="scripts?filter_locale="],
  body[pagetype="ListingPage"] .sidebarred-main-content > p > a[href*="/scripts?page="],

  body[pagetype="ListingPage"] .width-constraint:first-of-type .sidebarred-main-content > p > a[href*="/scripts?per_page="],
  body[pagetype="ListingPage"] .width-constraint:first-of-type .sidebarred-main-content > p > a[href*="/scripts?filter_locale=0&page="],
  body[pagetype="ListingPage"] .width-constraint:first-of-type .sidebarred-main-content > p > a[href*="/scripts?filter_locale=0&per_page="],
  body[pagetype="ListingPage"] .width-constraint:first-of-type .sidebarred-main-content > p > a[href*="scripts?set=100"],
  body[pagetype="ListingPage"] .width-constraint:first-of-type sidebarred-main-content .open-sidebar.sidebar-collapsed + h3 + p:not(:only-of-type) + p a[href*="scripts?filter_locale="] {
      position: fixed !important;
      display: inline-block !important;
      width: 300px !important;
      height: 15px !important;
      top: 34px !important;
      left: 26% !important;
      font-size: 11px !important;
      opacity: 1 !important;
      z-index: 5000000 !important;
      color: gold !important;
  }

  /* PUB /Learn New script */
  body[pagetype="ListingPage"] .width-constraint ~ .width-constraint .sidebarred-main-content > p > a,
  .sidebarred-main-content .pagination + p {
      display: none;
  }

  /* NEW FORUM - DISC LIST */
  .width-constraint .sidebarred .sidebarred-main-content {
      display: inline-block !important;
      min-width: 100%;
  }
  .width-constraint .sidebarred .sidebarred-main-content > p {
      margin: 0;
  }
  .width-constraint .sidebarred .sidebarred-main-content h3 {
      margin: 0;
  }
  .sidebarred-main-content.discussion-list-main-content > h2 {
      position: fixed !important;
      width: 41.6%;
      margin-top: -7px !important;
      z-index: 5000 !important;
      color: gold !important;
      border-radius: 0px !important;
      border-top: 7px solid peru;
      border-bottom: 1px solid peru;
      background: black !important;
  }
  /* NO DISSC FOUND */
  .sidebarred-main-content.discussion-list-main-content > p {
      height: 350px;
      line-height: 350px;
      margin-top: 35px;
      text-align: center;
      background: black;
  }
  /* NEW FORUM - PANEL MENU - LEFT */
  .sidebarred .sidebarred-main-content.discussion-list-main-content + .sidebar.collapsed {
      position: fixed !important;
      display: inline-block !important;
      width: 220px !important;
      left: 10% !important;
      background: #222 !important;
      border: 1px solid red !important;
  }

  /* DISC - HEAD - With/Without CIT */
  .discussion-list-header {
      position: fixed;
      display: inline-block;
      width: 50.5%;
      margin-bottom: -4px;
      margin-top: -7px;
      padding-left: 20px;
      z-index: 50;
      border-bottom: 4px solid orange;
      border-top: 4px solid orange;
      background: black;
  }

  /* TEST FOR SuperLoader*/
  html .width-constraint:not(:first-of-type) .discussion-list-header {
      display: none !important;
  }

  /* DISC - LIST - Without CIT */
  .sidebarred-main-content.discussion-list-main-content > .discussion-list {
      margin-top: 62px !important;
      border-radius: 0px !important;
      box-shadow: none;
      background: #222 !important;
      border: none !important;
  }
  .sidebarred-main-content.discussion-list-main-content > .discussion-list .discussion-list-item {
      padding: 5px;
  }
  .sidebarred-main-content.discussion-list-main-content > .discussion-list .discussion-list-item:nth-child(even) {
      background: #333 !important;
  }
  /* new183) */
  a.discussion-title {
      line-height: 17px;
      white-space: normal;
  }
  .discussion-meta,
  .comment-meta {
      background: black !important;
  }
  a.discussion-title span {
      color: #CDCDCD !important;
  }
  a.discussion-title:visited span {
      color: tan !important;
  }

  #script-meta .inline-script-stats .script-show-author > span > a {
      color: peru !important;
  }
  #script-meta .inline-script-stats .script-show-author > span > a:visited {
      color: tomato !important;
  }
  /* RATING ICON - ALL */
  .rating-icon {
      display: inline-block;
      min-width: 14px;
      max-width: 14px;
      height: 14px;
      line-height: 14px;
      margin-left: -5px;
      margin-right: 0px;
      padding: 0;
      text-align: center;
      font-size: 0;
      border: none !important;
      background: transparent;
  }
  .rating-icon:before {
      /* content: "⚪⚫🔴🔵🟢" ; */
      display: inline-block;
      margin-left: -2px;
      font-size: 10px;
      text-align: center;
  }
  .rating-icon.rating-icon-bad:before {
      content: "🔴";
  }
  .rating-icon.rating-icon-good:before {
      content: "🟢";
  }
  .rating-icon.rating-icon-ok:before {
      content: "🔵";
  }

  /* STAT - ADD LABEL HOVER */
  #install-stats-chart-container + table > thead > tr > th > abbr:before {
      position: fixed;
      display: inline-block;
      width: 100px;
      transform: rotate(-90deg);
      content: attr(title);
      margin-top: 65px;
      margin-left: -83px;
      font-size: 13px;
      text-align: right;
      color: peru;
  }
  #install-stats-chart-container + table:hover > thead > tr > th > abbr:after {
      content: "."!important;
      position: fixed;
      display: inline-block;
      width: 20px;
      height: 17px;
      transform: rotate(-90deg) !important;
      margin-top: 22px;
      margin-left: -44px;
      border-radius: 5px;
      font-size: 13px;
      text-align: center;
      color: peru;
      background: rgba(255, 211, 0, 0.16);
  }
  #install-stats-chart-container + table > thead > tr > th:nth-of-type(7):before {
      content: "Opera JS";
      position: fixed;
      display: inline-block;
      width: 100px;
      transform: rotate(-90deg);
      margin-top: 80px;
      margin-left: -40px;
      font-size: 20px;
      text-align: right;
      color: peru !important;
  }
  #install-stats-chart-container + table > thead > tr > th:nth-of-type(8):before {
      content: "Opera JS";
      position: fixed;
      display: inline-block;
      width: 100px;
      transform: rotate(-90deg);
      margin-top: 80px;
      margin-left: -29px;
      font-size: 20px;
      text-align: right;
      color: peru;
  }

  #install-stats-chart-container + table > tbody > tr:nth-child(odd) {
      background: rgba(255, 0, 0, 0.23);
  }
  #install-stats-chart-container + table > tbody > tr:nth-child(even) {
      background: rgba(255, 254, 0, 0.23);
  }
  #install-stats-chart-container + table > tbody > tr:hover th {
      background: blue;
  }
  #install-stats-chart-container + table > tbody > tr:hover th {
      background: blue;
  }
  #install-stats-chart-container + table > tbody > tr:hover td {
      background: black;
  }
  #install-stats-chart-container + table > tbody > tr:hover td:last-of-type {
      background: red;
  }

  /* FORUM IMAGE - DISC */
  #vanilla_discussion_comment .Message > img {
      max-height: 200px;
      max-width: 50%;
      margin-bottom: 25px;
  }
  .Discussion.comment .Message > div {
      float: right;
      height: 150px;
      width: 719px;
      margin: auto auto 20px 50px;
      left: 150px;
      overflow: hidden;
  }
  .Discussion.comment .Message > div.imgur-gifv.VideoWrap {
      float: none;
      height: auto;
      width: 700px;
      margin: auto auto 20px 0px;
  }
  .Message > div > a > a > img {
      margin-left: 56px;
      text-align: center;
  }
  .Message .ImageResized {
      height: 20px;
      margin-bottom: 5px;
      max-width: 668px;
      font-size: 11px;
      cursor: pointer;
      color: peru;
  }
  .Message .ImageResized:hover {
      color: tomato;
  }

  /* CODE DISC */
  .Message ol li pre,
  .Message > ul > li > ul > li > pre,
  .Message > ul > li > pre,
  .Message > pre,
  .Message > table > tbody > tr > td > code {
      position: relative;
      display: inline-block;
      letter-spacing: initial;
      white-space: pre-line;
      word-wrap: break-word;
      color: white;
      background-color: #5c5c5c;
  }
  .Message > table > tbody > tr > td > code {
      display: inline-block;
      min-width: 688px;
      max-width: 688px;
  }
  .Message > pre {
      min-width: 650px;
      max-width: 650px;
      margin-left: 5px;
  }
  .Message > ul > li > pre {
      min-width: 580px;
      max-width: 580px;
      margin-left: 5px;
  }
  .Message > ul > li > ul > li > pre {
      min-width: 580px;
      max-width: 580px;
      margin-left: -35px;
  }
  .Message ol li pre {
      min-width: 650px;
      max-width: 650px;
      margin-left: -35px;
  }

  /* FORUM USERT/GREAS - CODE (BACK STRIP) */
  .Item-Header.CommentHeader + .Item-BodyWrap .Item-Body pre.linenums.prettyprinted,
  .Item-Header.DiscussionHeader + .Item-BodyWrap .Item-Body pre.linenums.prettyprinted {
      position: relative;
      display: inline-block;
      min-width: 100%;
      left: 0px;
      top: -10px;
      letter-spacing: initial;
      white-space: pre-line;
      word-wrap: break-word;
      color: red;
      background-color: white;
      background-image: linear-gradient(rgba(85, 85, 85, 0.05) 90%, transparent 50%, transparent);
      background-size: 30px 15px;
  }
  /* (new250) CODE - TEST STRIPEed BACKGROUND for:
  https://greasyfork.org/fr/scripts/418889-better-greasyfork-code-reader-js-beautifier/code
  === */
  /* COLOR - NO USERSCRIPT */
  .code-container pre {
    background-color: #fff !important;

  }
  /* (new251) OK ? - COLOR - USERSCRIPT = prefers-color-scheme: dark  - lang-js
  https://greasyfork.org/fr/scripts/419105-userstyles-greasy-fork-enhancer-dark-grey-v-250/code
  https://greasyfork.org/fr/scripts/505357-emp-replace-thumbnail-images-with-full-images/code
  === */
  .code-container pre ,
  .code-container ,
  pre ,
  .prettyprint.linenums.wrap.prettyprinted ,
  .prettyprint {
    min-width: calc(100%) !important;
  background-color: #131212 !important;
  background-image: linear-gradient(transparent 100%, rgba(128, 128, 128, 0.1) 20%) !important;
  }
  .code-container pre.linenums.prettyprinted .linenums {
      line-height: 15px !important;
      margin: 0 0 0 30px !important;
      padding: 0 0 0 30px !important;
  color: unset  !important;
  background-color: #131212;
  background-image: linear-gradient(transparent 100%, rgba(128, 128, 128, 0.1) 20%);
  }
  #script-info .code-container ,
  .prettyprint.linenums.wrap.lang-js ,
  .prettyprint.linenums.wrap.lang-css {
      background-color: #131212;
      background-image: linear-gradient(transparent 100%, rgba(128, 128, 128, 0.1) 20%);
      border: 1px solid #52585c;
  }
  @media (prefers-color-scheme: dark) {
    .code-container pre.prettyprint {
      background-color: #131212;
      background-image: linear-gradient(transparent 100%, rgba(128, 128, 128, 0.1) 20%);
      border: 1px solid #52585c;
    }
  }
  @media (prefers-color-scheme: dark) {
    .prettyprint .com {
      color: silver !important;
    }
  }
  @media (prefers-color-scheme: dark) {
    .prettyprint .pln {
      color: #e8e6e3;
    }
  }

  /* (new233) CODE ERROR */
  .field_with_errors textarea[id="script_version_code"][name="script_version[code]"] {
      line-height: 15px !important;
      margin: 0 0 0 30px !important;
      padding: 0 0 0 30px !important;
  color: unset  !important;
  background-color: #131212;
  background-image: linear-gradient(transparent 100%, rgba(128, 128, 128, 0.1) 20%) !important;
  }



  /* (new251) CODE IN SCRIPT INFO 
  https://greasyfork.org/en/scripts/25068-downloadallcontent
  == */
  #additional-info > pre {
      min-width: calc(100% - 8%) !important;
      max-width: calc(100% - 8%) !important;
  background-color: #131212 !important;
  background-image: linear-gradient(transparent 100%, rgba(128, 128, 128, 0.1) 20%) !important;
  }

  /* (new249) FOR GM BEAUTIDER (it add it)  - because i use the Background striped */
  pre.linenums.prettyprinted li {
      box-shadow: -1px 1px 2px rgba(255, 211, 0, 0.2) !important;
  }
  pre.linenums.prettyprinted li.L0,
  pre.linenums.prettyprinted li.L1,
  pre.linenums.prettyprinted li.L2,
  pre.linenums.prettyprinted li.L3,
  pre.linenums.prettyprinted li.L4,
  pre.linenums.prettyprinted li.L5,
  pre.linenums.prettyprinted li.L6,
  pre.linenums.prettyprinted li.L7,
  pre.linenums.prettyprinted li.L8,
  pre.linenums.prettyprinted li.L9 {
      min-width: 880px !important;
      max-width: 880px !important;
      margin-left: -10px !important;
      background: transparent;
  }
  pre.linenums.prettyprinted li.L0 code,
  pre.linenums.prettyprinted li.L1 code,
  pre.linenums.prettyprinted li.L2 code,
  pre.linenums.prettyprinted li.L3 code,
  pre.linenums.prettyprinted li.L4 code,
  pre.linenums.prettyprinted li.L5 code,
  pre.linenums.prettyprinted li.L6 code,
  pre.linenums.prettyprinted li.L7 code,
  pre.linenums.prettyprinted li.L8 code,
  pre.linenums.prettyprinted li.L9 code {
      min-width: 880px !important;
      max-width: 880px !important;
      color: white;
      background: transparent;
  }
  .linenums.prettyprinted code .pun {
      background: transparent !important;
  }
  #vanilla_discussion_comment.Vanilla.Discussion.comment.Section-Discussion.Section-Category-script-development div#Frame div#Body div.Row div#Content.Column.ContentColumn .MessageList.Discussion .Item.ItemDiscussion .Discussion .Item-BodyWrap .Item-Body .Message pre {
      display: inline-block !important;
      min-width: 630px;
      max-width: 630px;
      margin-left: -5px;
  }
  .Quote > p > code,
  .Message pre code,
  .Message > code {
      display: inline-block;
      max-width: 648px;
      vertical-align: middle;
      padding: 1px 2px 1px 4px;
      white-space: pre-line;
      word-wrap: break-word;
      color: white;
      background-color: #5c5c5c;
  }

  /* CODE - USERSTY / GREASY - FIRST TOP DISC */
  .Discussion .Item-BodyWrap .Item-Body .Message code,
  .MessageList.Discussion #Item_0 + .Item.ItemDiscussion .Discussion .Item-BodyWrap .Item-Body .Message code {
      display: inline-block;
      max-width: 600px;
      position: relative;
      letter-spacing: initial;
      line-height: 15px;
      min-height: 0px;
      min-width: 0px;
      top: 0;
      overflow-y: hidden;
      overflow-x: hidden;
  }
  /* (new243) */
  pre {
      background-color: #111 !important;
      margin-left: 30px;
      padding: 5px 10px;
  }

  code,
  .Message > p > code,
  .Message > ul > li > code {
      position: relative;
      display: inline-block;
      min-width: 10px;
      max-width: 100%;
      min-height: 15px;
      line-height: 15px;
      top: 0px;
      margin-top: 0px;
      margin-bottom: -2px;
      margin-left: 2px;
      padding: 0px 2px;
      letter-spacing: initial;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      overflow: hidden;
      color: white;
      background-color: #5c5c5c;
  }
  code a.linkifyplus {
      display: inline !important;
      white-space: pre-wrap;
      word-wrap: break-word;
  }

  /* CODE - IN COMMENT PREVIEW */
  .previewable .preview-results.user-content > pre {
      background: rgba(0, 0, 0, 0.5) !important;
      border: 0 none;
  }


  /*  CODE VESSION HISTORY - not DIFF */
  .version-changelog > pre {
      background-color: #222 !important;
  }

  /* CODE in SCRIPT INFO */
  #additional-info > p > code {
      position: relative;
      display: inline-block;
      min-width: 10px;
      max-width: 100%;
      min-height: 15px;
      line-height: 15px;
      top: 0px;
      margin: 0px 3px 0 3px !important;
      padding: 0px 2px;
      letter-spacing: initial;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: visible !important;
      color: white;
      background-color: #222 !important;
  }

  /* CODE IN h1 :
  https://greasyfork.org/fr/scripts/24150-highlight-every-code
  === */
  h1 code {
      height: 15px !important;
      line-height: 12px !important;
      padding: 1px 4px !important;
      font-size: 17px !important;
  }

  /* CODE DISC - TOP AUTHOR DISC */
  .Message > ul > li > code {
      height: 13px !important;
      line-height: 13px !important;
      padding: 1px 4px !important;
  }
  .QuoteText > pre {
      width: 660px;
      padding: 2px 2px 2px 4px;
      letter-spacing: initial;
      white-space: pre-line;
      word-wrap: break-word;
  }

  /* USERSTY PAGE INFO - CODE */
  #additional-info-text > pre,
  #additional-info-text > code pre code,
  #additional-info-text > code pre,
  #additional-info-text > code:not(:empty),
  #long-description > code:not(:empty) {
      display: inline-block;
      margin-left: 1px;
      padding: 5px 10px;
      border-radius: 2px;
      letter-spacing: initial;
      white-space: pre-line;
      word-wrap: break-word;
      color: white;
      background-color: #5c5c5c;
  }
  #additional-info-text > pre,
  #additional-info-text > code pre code,
  #additional-info-text > code pre {
      width: 850px;
  }

  /* CODE - STYLE INFO - LONG DESC */
  #long-description > code:not(:empty) {
      display: inline-block;
      width: auto;
      max-width: 540px;
  }
  /* CODE - STYLE INFO - ADIT DESC */
  #additional-info-text > code:not(:empty) {
      display: inline-block;
      width: auto;
      max-width: 820px;
  }

  /* GREASY - SCRIPT INFO - CODE */
  #additional-info > div > blockquote > pre > code,
  #additional-info > div > pre > code {
      display: inline-block;
      width: 99%;
      margin-left: -6px;
      padding: 5px 10px;
      border-radius: 2px;
      letter-spacing: initial;
      white-space: pre-line;
      word-wrap: break-word;
      color: white;
      background-color: #5c5c5c;
  }
  #additional-info > div > blockquote > pre > code {
      border: 1px solid gray;
  }

  /* WITH/WITHOUT GM - MY ACC/EDIT PAGE */
  #main-header + #content-wrapper > #main-article > ul {
      position: fixed;
      display: inline-block;
      width: 50px;
      height: 18px;
      margin-left: -100px;
      top: 18px;
      padding-left: 15px;
      border-radius: 3px 3px 0 0;
      text-align: left;
      overflow: hidden;
      z-index: 500;
      box-shadow: 0 0 4px #999;
      background: #222;
  }
  #help-style-settings-edit ~ pre,
  #main-header + #content-wrapper > #main-article > p ~ ul {
      position: relative;
      display: inline-block;
      width: 700px;
      height: auto;
      margin-left: 200px;
      margin-top: -5px;
      border-radius: 3px;
      overflow: visible;
      z-index: 10;
      border: 1px solid gray;
      background: #222;
  }
  #main-header + #content-wrapper > #main-article > table + p {
      position: fixed;
      display: inline-block;
      width: 600px;
      height: auto;
      top: 73px;
      left: 320px;
      opacity: 0;
  }
  #main-header + #content-wrapper > #main-article > table:hover + p {
      position: fixed;
      display: inline-block;
      width: 600px;
      height: auto;
      top: 73px;
      left: 320px;
      opacity: 1;
      transition: opacity ease 0.7s;
  }
  #main-header + #content-wrapper > #main-article > ul:hover {
      width: 200px;
      height: auto;
      box-shadow: 0 0 4px #999;
  }
  #main-header + #content-wrapper > #main-article > p ~ ul:hover {
      width: 700px;
      height: auto;
  }
  #main-header + #content-wrapper > #main-article > ul:before {
      content: "More..."!important;
      width: 200px;
      height: 10px;
      line-height: 10px;
  }
  #main-header + #content-wrapper > #main-article > p ~ ul:before {
      content: "";
  }
  /* HELP STYLES */
  #main-header + #content-wrapper > #main-article > p ~ ul ~ h3 {
      width: 700px;
      margin-left: 200px;
      text-align: center;
      color: peru;
      background: linear-gradient(to bottom, rgba(19, 19, 19, 1) 0%, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 63%, rgba(0, 0, 0, 1) 98%) repeat scroll 0 0 rgba(0, 0, 0, 0);
  }

  /* EDIT COM - HOVER + NOT HOV/OPEN + NOT OPEN */
  /* ALL - USERS/GREASY - EDIT COM - ICON GRAY - TOP TITLE DISCUS/COM */
  .ToggleFlyout.OptionsMenu .Flyout.MenuItems {
      display: inline-block !important;
      width: 15px;
      height: 15px;
      left: 2px;
      top: 3px;
      padding: 0;
      border: none;
      box-shadow: none;
      background-color: transparent;
  }
  #Item_0 .ToggleFlyout.OptionsMenu .Flyout.MenuItems {
      left: 0px !important;
      top: 50px !important;
  }
  .OptionsMenu .Flyout {
      right: 6px;
      top: -1px;
  }
  .ToggleFlyout:not(.Open) span.OptionsTitle + span + .Flyout.MenuItems:before,
  .ToggleFlyout:not(.Open) span.OptionsTitle + span + .Flyout.MenuItems:after {
      border: none !important;
  }
  .OptionsTitle,
  .Section-Discussion .Item.Mine.ItemComment .Flyout.MenuItems a.EditComment,
  .ToggleFlyout:not(.Open) .EditDiscussion {
      display: inline-block;
      width: 18px;
      font-size: 0px;
      visibility: hidden;
      background-color: transparent;
  }
  /* ALL */
  .ToggleFlyout:not(.Open) a.EditDiscussion:before {
      content: " ";
      position: relative;
      display: inline-block;
      width: 18px;
      height: 15px;
      font-size: 15px;
      visibility: visible;
      background: url("https://greasyfork.org/forum/applications/dashboard/design/images/sprites.png") no-repeat scroll -62px -324px rgba(0, 0, 0, 0) !important;
      background-color: black;
      outline: 1px solid gray;
  }
  /* GREAS */
  a.EditComment:before,
  .Section-Discussion .Item.Mine.ItemComment .Flyout.MenuItems a.EditComment:before {
      content: " ";
      position: relative;
      display: inline-block;
      width: 18px;
      height: 18px;
      left: 0px;
      top: -2px;
      font-size: 15px;
      visibility: visible;
      background: url("https://greasyfork.org/forum/applications/dashboard/design/images/sprites.png") no-repeat scroll -62px -324px rgba(0, 0, 0, 0);
      background-color: black;
      outline: 1px solid gray;
  }
  /* EDIT BUT */
  .Section-Discussion .Item.Mine.ItemComment .Flyout.MenuItems {
      display: inline-block;
      height: 15px;
      line-height: 15px;
      padding: 1px;
  }

  /* COM DISC - COM EDIT PAGE */
  #DiscussionForm.FormTitleWrapper.DiscussionForm {
      margin-top: -74px;
  }
  #DiscussionForm.FormTitleWrapper.DiscussionForm .FormWrapper {
      padding: 0px 20px;
  }
  .ToggleFlyout.OptionsMenu .OptionsTitle + .SpFlyoutHandle + .Flyout.MenuItems > li a {
      position: relative;
      float: left;
      width: 18px;
      line-height: 15px;
      padding: 0;
  }
  .ToggleFlyout.OptionsMenu .OptionsTitle + .SpFlyoutHandle + .Flyout.MenuItems > li a:hover {
      text-decoration: none;
      color: white;
      background-color: #ACB1B7;
  }

  /* EDIT COM */
  .ToggleFlyout.OptionsMenu .OptionsTitle + .SpFlyoutHandle + .Flyout.MenuItems > li a {
      font-size: 15px;
      visibility: hidden;
      outline: 1px solid gray;
  }

  /* COM DISC */
  .Section-DiscussionList .DataList.Discussions .ItemDiscussion span.Options span.ToggleFlyout.OptionsMenu span.OptionsTitle,
  .Section-Discussion .Item.Mine.ItemComment .OptionsTitle,
  .Section-Discussion .Item.Mine.ItemComment:hover .OptionsTitle,
  /* COM DISC ALT (BLACK) */
  .Section-Discussion .Item.Alt.Mine.ItemComment .OptionsTitle,
  .Section-Discussion .Item.Alt.Mine.ItemComment:hover .OptionsTitle,
  /* LIST BOOKMARKED */
  .Section-DiscussionList.Discussions.bookmarked .Item.Mine.Bookmarked .OptionsTitle,
  .Section-DiscussionList.Discussions.bookmarked .Item.Mine.Bookmarked:hover .OptionsTitle,
  /* LIST BOOKM ALT (BLACK) */
  .Section-DiscussionList.Discussions.bookmarked .Item.Alt.Mine.Bookmarked .OptionsTitle,
  .Section-DiscussionList.Discussions.bookmarked .Item.Alt.Mine.Bookmarked:hover .OptionsTitle {
      visibility: hidden;
  }

  /* DISM -  ALL */
  .DismissAnnouncement.Hijack {
      height: 18px;
      width: 18px;
      top: 0 !important;
      right: 0 !important;
      padding: 0 !important;
      font-size: 0;
      text-align: center;
      color: peru;
  }
  .DismissAnnouncement.Hijack:before {
      content: "X";
      height: 18px;
      width: 18px;
      top: 0 !important;
      right: 0 !important;
      padding: 0 !important;
      font-size: 15px;
      color: peru;
  }
  #vanilla_discussion_index .MessageList.Discussion .dropdown-menu-link.DismissAnnouncement.Hijack {
      margin-right: 19px;
      margin-top: 0px;
      color: peru;
  }

  /* USERST - EDIT COM */
  .ToggleFlyout.OptionsMenu .OptionsTitle + .SpFlyoutHandle + .Flyout.MenuItems > li a.EditDiscussion {
      font-size: 15px;
      visibility: hidden;
      z-index: 10000;
  }
  .Flyout.MenuItems li[role="presentation"] .dropdown-menu-link.dropdown-menu-link-edit {
      margin-left: 32px;
      padding: 0;
      font-size: 0px;
  }
  .Flyout.MenuItems li[role="presentation"] .dropdown-menu-link.dropdown-menu-link-edit:before,
  .ToggleFlyout.OptionsMenu .OptionsTitle + .SpFlyoutHandle + .Flyout.MenuItems > li a.EditDiscussion:before {
      content: " "!important;
      position: relative !important;
      float: left !important;
      width: 18px !important;
      height: 18px !important;
      top: -2px !important;
      font-size: 15px !important;
      visibility: visible !important;
      background: url("https://greasyfork.org/forum/applications/dashboard/design/images/sprites.png") no-repeat scroll -62px -324px rgba(0, 0, 0, 0) !important;
      background-color: black !important;
      outline: 1px solid gray !important;
  }

  /* USERSTY / GREASY - EDIT BUTTON - IN HEADER DISC GREASY FORK DISCUS */
  /* GREASY */
  .MessageList.Discussion #Item_0.PageTitle .OptionsTitle {
      visibility: hidden !important;
      outline: 1px solid peru !important;
  }

  /* FORUM - SMALL ICONS FILE ATTACHEMENTS - From OLD style */
  .Attachment .FilePreview .Thumb-Default img,
  .Attachment .FileHover .Thumb-Default img {
      display: inline-block !important;
      max-height: 25px !important;
      min-height: 25px !important;
      height: 100% !important;
      width: 20px !important;
  }

  /* START PAGE */
  #main-article > p {
      position: relative !important;
      display: inline-block !important;
      width: 870px! important;
      margin: 10px auto ! important;
      left: 70px ! important;
  }
  #front-page-best {
      display: inline-block ! important;
      margin-left: 200px ! important;
  }
  #front-page-newest {
      display: inline-block !important;
      margin-left: 200px !important;
  }
  #front-page-best h2,
  #front-page-newest h2 {
      display: inline-block ! important;
      width: 300px !important;
      margin-left: 15px !important;
      padding-left: 29px !important;
      border-radius: 5px !important;
      box-shadow: 0 0 4px #999999 !important;
      background-color: #222222 !important;
  }
  #front-page-best ul li,
  #front-page-newest ul li {
      width: 700px ! important;
      padding: 2px 5px ! important;
  }
  #front-page-best ul li:nth-child(even),
  #front-page-newest ul li:nth-child(even) {
      background: black! important;
  }
  #front-page-best ul li:nth-child(odd),
  #front-page-newest ul li:nth-child(odd) {
      background: #222222 ! important;
  }
  #front-page-newest ul li:not(.additional-link):after,
  #front-page-best ul li:not(.additional-link):after {
      content: "tot   :   " attr(total-install-count);
      float: left;
      width: 250px;
      margin-right: -100px;
      text-align: left;
      color: gold;
  }
  #front-page-best ul li:not(.additional-link):before {
      content: "week   :   " attr(weekly-install-count);
      float: right;
      width: 120px;
      margin-left: 10px;
      text-align: left;
      color: gold;
  }

  /* PAGINATION - HIGHLIGHT */
  .NumberedPager a.Highlight,
  #PagerBefore.Pager a.Highlight {
      background: yellow;
      color: red;
  }

  /* ALL - PAGINATOR CENTER -  HIGHTLIGHT / PREV / NEXT */
  .Pager a,
  .Pager span {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      min-width: 17px;
      height: 14px;
      line-height: 13px;
      margin: 0 3px;
      padding: 0;
      text-align: center;
      border-radius: 3px;
      box-shadow: 3px 3px 2px black;
      background: #222;
  }
  .NumberedPager a.Next,
  .NumberedPager span.Next,
  .NumberedPager a.Previous,
  .NumberedPager span.Previous {
      position: relative;
      display: inline-block;
      height: 14px;
      line-height: 11px;
      font-size: 23px;
      border-radius: 3px;
      vertical-align: middle;
      box-shadow: 3px 3px 2px black;
      background: #222;
  }
  .NumberedPager .Next:hover,
  .NumberedPager .Previous:hover {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      height: 14px;
      line-height: 11px;
      border-radius: 3px;
      top: 5px;
      left: 0px;
      margin-left: 3px;
      right: 0px;
      font-size: 26px;
  }
  #PagerAfter > a:hover,
  #PagerBefore > a:hover,
  body .Pager .Highlight:hover,
  .PageControls .Pager a:hover {
      display: inline-block;
      color: tomato;
  }
  #PagerBefore > .Next:hover,
  .NumberedPager a.Next:hover,
  .NumberedPager span.Next:hover {
      position: relative;
      display: inline-block;
      height: 20px;
      line-height: 17px;
      margin-top: -10px;
      font-size: 23px;
      vertical-align: middle;
      color: tomato;
  }
  #PagerAfter > .Previous:hover,
  #PagerBefore > .Previous:hover,
  .NumberedPager a.Previous:hover,
  .NumberedPager span.Previous:hover {
      position: relative;
      display: inline-block;
      height: 20px;
      line-height: 17px;
      margin-top: -10px;
      font-size: 23px;
      vertical-align: middle;
      color: tomato;
  }
  .p-100.LastPage:hover {
      position: relative;
      display: inline-block;
      height: 20px;
      line-height: 17px;
      font-size: 16px;
      vertical-align: middle;
      color: tomato;
  }
  /* USERSTYLES - PAGINATION - FORUM SEARCH PREV / NEXT (Without Page NUMBERS) */
  #dashboard_search_index .DataList.SearchResults + .PageControls.Bottom .Previous,
  #dashboard_search_index .DataList.SearchResults + .PageControls.Bottom .Next {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      line-height: 20px;
      height: 20px;
      padding: 2px;
      top: -10px;
      font-size: 15px;
      color: peru;
  }
  #dashboard_search_index .DataList.SearchResults + .PageControls.Bottom .Previous:hover {
      display: inline-block;
      left: -11px;
      font-size: 20px;
      transition: all ease 0.5s;
      color: tomato;
  }
  #dashboard_search_index .DataList.SearchResults + .PageControls.Bottom .Next:hover {
      display: inline-block;
      margin-right: -9px;
      margin-left: 2px;
      font-size: 20px;
      transition: all ease 0.5s;
      color: tomato;
  }

  /* USERSTY - MAIN ARTICLE (inside CONTENT-WRAPPER) */
  #main-article {
      margin-left: 215px !important;
  }

  /* USERSTY -ACCOUNT PAGE - USER NAME */
  .PageContent > dl > dt:not(:last-of-type) {
      position: absolute !important;
      display: inline-block !important;
      width: 23vw !important;
      height: 15px;
      line-height: 15px !important;
      top: 20vh !important;
      margin-left: 0%;
      margin-top: -10px !important;
      padding: 5px;
      overflow: hidden;
      text-align: left !important;
      z-index: 500 !important;
      border: 1px solid #404040;
      background: #222 !important;
  }
  /* TXT "HOMEPAGE" in STYLES PAGES */
  html > body > dl dt:not(:last-of-type) + #user-about + dt {
      display: none !important;
  }

  /* USERSTY -ACCOUNT PAGE - USER CONTACT */
  #user-about + dt {
      position: absolute !important;
      display: inline-block !important;
      width: 3%;
      min-height: 14px;
      max-height: 14px;
      line-height: 14px;
      top: 20vh !important;
      left: 20vw !important;
      margin-left: 0 !important;
      margin-top: -10px !important;
      padding: 5px;
      text-align: left;
      font-size: 0 !important;
      z-index: 700 !important;
      border: 1px solid #404040;
  }
  .PageContent > dl dd:last-of-type {
      position: fixed !important;
      display: inline-block !important;
      width: 1.5%;
      height: 100% !important;
      min-height: 24px !important;
      max-height: 24px !important;
      top: 20vh !important;
      left: 20vw !important;
      margin-left: 0 !important;
      margin-top: -10px !important;
      padding: 0 !important;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-align: left;
      font-size: 15px !important;
      z-index: 900 !important;
      color: transparent !important;
  }
  .PageContent > dl dd:last-of-type:before {
      content: "📧";
      position: fixed !important;
      display: inline-block !important;
      width: 42px;
      height: 100% !important;
      min-height: 24px !important;
      max-height: 24px !important;
      line-height: 23px;
      margin-left: -7px !important;
      left: 20vw !important;
      top: 19vh;
      padding: 0px;
      text-align: center;
      font-size: 27px;
      z-index: 0 !important;
      pointer-events: none !important;
      color: red !important;
      border: 1px solid #404040;
  }
  /* USERSTY - ACCOUNT PAGE - USER ABOUT /HOVER */
  #user-about {
      position: absolute !important;
      display: inline-block;
      min-width: 23vw !important;
      max-width: 23vw !important;
      min-height: 14px !important;
      max-height: 75vh !important;
      top: 24vh !important;
      margin-left: 0% !important;
      margin-top: -10px !important;
      padding: 5px;
      overflow: hidden;
      overflow-y: auto;
      border: 1px solid lime !important;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
      background: #222 !important;
  }
  #user-about:hover {
      position: absolute !important;
      display: inline-block;
      max-width: 23vw !important;
      min-height: 14px !important;
      max-height: 75vh !important;
      padding: 5px;
      overflow: hidden;
      overflow-y: auto;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
      background: #333 !important;
  }

  /*
  USERSTY - ACCOUNT PAGE - - INSTAL WEEK  */
  .numeric-value {
      color: gold !important;
  }
  .numeric-value + .numeric-value {
      color: tan !important;
  }

  /* USERSTY - (ALL) "Contact Admin" ETC */
  /* USERSTY - FOOT */
  footer {
      position: fixed !important;
      display: inline-block !important;
      width: auto !important;
      top: 00px !important;
      left: 10px ! important;
      padding: 0 5px 5px 20px !important;
      z-index: 5000 ! important;
      visibility: hidden !important;
      background: red !important;
  }
  footer:hover {
      position: fixed !important;
      display: inline-block !important;
      width: auto !important;
      top: 00px !important;
      left: 10px ! important;
      padding: 0 5px 5px 20px !important;
      z-index: 5000 ! important;
      visibility: visible !important;
      background: black !important;
  }
  footer:before {
      content: "🔻" !important;
      position: fixed !important;
      display: inline-block !important;
      width: auto !important;
      top: 10px !important;
      left: 5px ! important;
      padding: 0px !important;
      z-index: 5000 ! important;
      visibility: visible !important;
      background: gold !important;
  }
  /* ==== (ALL)  - USERSTY - MENUS POPUP ==== */
  /* USERSTY - STY INFOS - PANEL INFO - AUTH PANEL + INFOS INSTAL */
  #style-author-info {
      position: fixed !important;
      width: 205px ! important;
      height: 100% ! important;
      min-height: 292px ! important;
      max-height: 792px ! important;
      left: 5px !important;
      top: 80px !important;
      padding-left: 5px !important;
      padding-bottom: 3px !important;
      border-radius: 5px !important;
      box-shadow: 3px 3px 2px black !important;
      background: #222 !important;
  }
  #style-install-info {
      position: fixed !important;
      width: 195px ! important;
      left: 23px !important;
      top: 320px !important;
      padding-left: 5px !important;
      padding-bottom: 3px !important;
      border-radius: 5px !important;
      z-index: 700 !important;
      background: #222 !important;
  }

  /* USERSTY - STY INFOS - AUTH INFOS + INST INFOS - ZEBRA */
  #style-install-info > tbody > tr:nth-child(2n + 1),
  #style-author-info > tbody > tr:nth-child(2n + 1) {
      background: #262626 !important;
  }

  /* USERSTY - (ALL) STY INFOS - AUTH PANEL + INST INFOS - TYPE BLOCK/LINE - COL ITEM TYPE */
  #style-install-info > tbody > tr,
  #style-author-info > tbody > tr {
      color: gold !important;
  }
  /*  USERSTY - (ALL) STY INFOS - AUTH PANEL INFOS + INST INFOS - TYPE BLOCK/LINE - COL INFOS */
  #style-install-info > tbody > tr th + td,
  #style-author-info > tbody > tr th + td {
      position: relative ! important;
      display: inline-block ! important;
      width: 95% ! important;
      bottom: 3px ! important;
      left: 3px ! important;
      border-radius: 5px ! important;
      text-align: center ! important;
      color: #6999A6 !important;
      border: #434141 solid 1px !important;
      box-shadow: 3px 3px 2px black !important;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%);
  }

  /* USERSTY - (ALL) STY INFOS - AUTH PANEL INFOS + INST INFOS - ITEMS LINE */
  #style-install-info > tbody > tr,
  #style-author-info > tbody > tr {
      display: block !important;
      position: relative !important;
      width: 190px !important;
      font-size: 11px !important;
  }
  /* USERSTY - STY INFOS - AUTH PANEL INFOS - AUTH */
  #style-author-info > tbody > tr:first-child {
      position: relative !important;
      display: inline-block !important;
      margin-top: 5px ! important;
      margin-left: 0px ! important;
      width: 190px !important;
      height: 89px ! important;
      border-radius: 5px ! important;
      border: 1px gray solid ! important;
  }

  /* USERSTY - STY INFOS - AUTH PANEL INFOS - SUPP TXT "Auth" - ADD ICON */
  #style-author-info > tbody > tr:nth-child(1) > th {
      display: inline-block !important;
      position: relative !important;
      width: 184px !important;
      margin-top: 1px ! important;
      padding: 0 5px 2px 0 !important;
      border-radius: 5px 5px 0 0 ! important;
      font-size: 0px !important;
      text-align: center ! important;
      color: transparent !important;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%);
  }
  /* USERSTY - STY INFOS - AUTH PANEL INFOS - ADD ICON USER */
  #style-author-info > tbody > tr:nth-child(1) > th:before {
      position: relative;
      display: inline-block;
      content: url("http://tympanus.net/Development/MegaWebButtonsPack1//images/icons/user.png");
      transform: scale(0.9, 0.7);
  }

  /* USERSTY - STY INFOS - AUTH PANEL INFOS - USER NAME */
  #style-author-info > tbody > tr:nth-child(1) > td a {
      position: relative !important;
      display: block !important;
      max-width: 182px !important;
      height: 51px ! important;
      left: -2px ! important;
      padding: 0 2px !important;
      font-size: 19px !important;
      font-weight: bold ! important;
      text-align: center ! important;
      color: SlateGray !important;
      border-radius: 0 0 5px 5px ! important;
      background: linear-gradient(to bottom, rgba(19, 19, 19, 1) 0%, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 63%, rgba(0, 0, 0, 1) 98%);
      border: none !important;
      white-space: pre-wrap ! important;
      word-break: break-all ! important;
      -moz-hyphens: auto ! important;
  }

  /* USERSTY - STY INFOS - AUTH PANEL INFOS - USER NAME */
  #style-author-info > tbody > tr:first-of-type th + td {
      position: relative ! important;
      display: inline-block ! important;
      width: 100% ! important;
      bottom: -1px ! important;
      left: 3px ! important;
      text-align: center ! important;
      border: none !important;
      background: transparent ! important;
  }

  /* USERSTY - INFOS - SCREENSHOT + INFOS - (GM + NO GM) */
  #content-wrapper #main-article #left-info {
      position: absolute ! important;
      display: inline-block ! important;
      vertical-align: top ! important;
      top: 5px !important;
      margin-left: 2% !important;
  }

  /* USERSTY - STY INFOS - SCREENSHOT - (GM + NO GM) */
  #screenshots {
      position: absolute;
      display: inline-block;
      float: none;
      clear: both;
      height: 395px;
      width: 360px;
      top: 0px;
      border: 1px solid #434141 !important;
      box-shadow: 3px 3px 2px black;
      background-color: #222222;
      z-index: 10;
  }
  .screenshot-thumbnail {
      border: 1px solid #434141 !important;
      box-shadow: 3px 3px 2px black;
  }
  #more-screenshots {
      font-size: 0 !important;
  }
  #more-screenshots span {
      position: absolute !important;
      display: inline-block !important;
      padding: 2px 5px !important;
      border-radius: 5px !important;
      background: black !important;
      font-size: 15px !important;
  }
  #screenshots #more-screenshots a {
      position: relative !important;
      display: inline-block !important;
      width: 98% !important;
      bottom: -20px !important;
      font-size: small !important;
  }
  #screenshots #more-screenshots a:before {
      content: "\\25BA";
      color: gold;
  }
  /* USERSTY - STY INFOS - LONG DESC - (GM + NO GM) */
  #style-info {
      position: absolute ! important;
      width: 78.5% !important;
      margin-top: 1px !important;
      left: 249px !important;
      word-wrap: break-word ! important;
  }
  #main-style-info {
      width: 60% !important;
      margin-bottom: 1em;
      margin-left: 380px !important;
      padding-left: 1em;
  }

  /* USERSTY - STY INFOS - LG DESC - TXT */
  #long-description {
      position: relative !important;
      display: inline-block !important;
      width: 565px ! important;
      height: 395px !important;
      min-height: 100px ! important;
      top: 4px !important;
      margin-top: 0px !important;
      left: 10px ! important;
      padding: 5px 5px 2px 10px !important;
      border-radius: 5px !important;
      overflow: hidden ! important;
      overflow-y: auto ! important;
      box-shadow: 3px 3px 2px black !important;
      border: 1px solid red !important;
  }
  /* NEED CONVERT for Addstylish lib -  USERSTY - STY INFOS - STYLE OPTIONS */
  .advanced_button {
      position: absolute;
      height: 20px !important;
      margin-left: 251px !important;
      top: 68px !important;
  }
  /* (new220) */
  #style-settings {
      position: absolute !important;
      display: inline-block !important;
      width: 75px ! important;
      height: 16px !important;
      top: 4.7vh !important;
      left: 46.4vw ! important;
      margin: 0 !important;
      padding: 3px 5px;
      border-radius: 5px !important;
      overflow: hidden !important;
      overflow-y: hidden !important;
      z-index: 500 !important;
      border: 1px solid gray !important;
      background: #333 !important;
  }
  #style-settings:hover {
      position: absolute !important;
      display: inline-block !important;
      width: 555px ! important;
      min-height: 727px !important;
      border-radius: 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 500!important;
      transition: all ease 0.6s !important;
      border: 1px solid gray !important;
      background: black !important;
  }
  #style-settings li:first-of-type {
      margin-top: 35px !important;
  }
  #style-settings:before {
      content: "Options \\01F53B ";
      position: absolute;
      display: inline-block;
      height: 15px;
      width: 75px !important;
      line-height: 13px;
      top: 0px;
      left: -2px;
      padding: 5px;
      border-radius: 3px;
      border: 1px solid gray;
      color: gold;
      background: #222222;
      z-index: 500 !important;
  }
  #style-settings #advancedsettings_area.advancedsettings_shown,
  #style-settings #advancedsettings_area.advancedsettings_hidden {
      display: inline-block !important;
      min-width: 495px !important;
      max-width: 495px !important;
      margin-left: 14px;
      margin-top: 28px;
      padding: 15px !important;
      background-color: #ffffff;
  }

  /* USERSTY - STY INFOS - LG DESC - BUTT(Edit/Delete) - COMPATIBILITY GRESY FORK */
  #style-info #control-panel {
      position: fixed ! important;
      display: inline-block ! important;
      height: 17px !important;
      line-height: 17px !important;
      width: 566px;
      margin-bottom: 1em;
      left: 637px!important;
      top: 25px ! important;
      padding: 1px 6px !important;
      border: 1px solid gray !important;
      border-radius: 3px 3px 0 0 !important;
      background: #222 !important;
      z-index: 600 !important;
  }
  #style-install-info > tbody > tr:last-of-type,
  #style-info #control-panel > a:nth-child(1),
  #style-info #control-panel > a:nth-child(2),
  #style-info #control-panel > a:nth-child(3) {
      display: inline-block!important;
      height: 14px !important;
      line-height: 14px !important;
      margin-top: -4px ! important;
      top: 30px !important;
      background-color: #222222 !important;
      border-radius: 3px !important;
      box-shadow: 3px 3px 2px black !important;
      padding: 1px 5px !important;
  }

  /* USERSTY - STY INFOS - LG DESC - (Links Color) */
  #long-description > p > a {
      color: #E0B81F !important;
      margin-right: 5px !important;
  }
  /* USERSTY - STY INFOS - INST BUTT + Switch Browser */
  #stylish-installed-style-needs-update,
  #stylish-installed-style-not-installed {
      position: fixed !important;
      width: 190px !important;
      height: 16px !important;
      line-height: 13px !important;
      left: 1025px !important;
      margin-bottom: 1px;
      top: 16px !important;
      padding: 0 4px 2px !important;
      border-radius: 5px !important;
      font-size: larger;
      color: white;
      vertical-align: middle;
      z-index: 700!important;
  }

  /* INST BUT - COR to SEE WITH STYLISH addon diff ver */
  #stylish-installed-style-installed {
      position: fixed !important;
      width: 230px !important;
      height: 18px !important;
      line-height: 17px !important;
      top: 11px !important;
      left: 930px !important;
      margin-bottom: 1px;
      padding: 0 4px 2px !important;
      border-radius: 5px !important;
      font-size: larger;
      vertical-align: middle;
      z-index: 650 !important;
      color: white;
  }
  #switch-browser-note {
      position: absolute !important;
      display: inline-block;
      width: 180px !important;
      top: 32px !important;
      left: 575px !important;
      margin-bottom: 1px;
      margin-top: 13px !important;
      padding: 0 4px 2px !important;
      vertical-align: middle;
      border-radius: 5px !important;
      color: white;
  }

  /* Userstyles TableView+Enhancer - INSTALL Button correction for stylish 1.4.3 */
  #style-install-mozilla-no-stylish {
      display: none !important;
  }

  /* MESSAGE " STYLISH NOT INSTALLED" - For GOOGLE CHROME + Stylish 1.2.2 (???)  */
  .install-status:not(.install) {
      display: none;
  }

  /* USERSTYLES -  INSTALL NOT */
  .install-status:not(.install) {
      position: absolute !important;
      display: inline-block;
      max-width: 450px;
      margin-bottom: 1px;
      margin-top: 15px;
      right: 0 !important;
      top: 0!important;
      padding: 8px 16px 12px;
      border-radius: 5px;
      font-size: larger;
      color: white;
      vertical-align: middle;
  }

  /* ==== USERSTY - STY INFOS - SHOW CODE - ==== */
  /* USERSTY - STY INFOS - NEW - SHOW CSS CODE */
  #stylish-code.cssHidden[style*="display: none;"] {
      display: none !important;
  }
  #stylish-code.hiBeautted,
  #stylish-code.cssHidden[style*="display: block;"] {
      display: inline-block !important;
      width: 650px !important;
      min-height: 680px !important;
      padding: 5px 5px 5px 15px !important;
      border-top: 30px solid red !important;
      word-wrap: break-word !important;
      -moz-hyphens: auto !important;
      background: white !important;
      background-color: #2e3e49 !important;
  }
  /* SHOW CODE - IMAGE - FOR GM LinkyFyPlus*/
  #show-code #view-code #stylish-code a.linkifyplus {
      display: inline-block !important;
      height: 15px !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      font-size: 15px !important;
      color: blue !important;
      background: tan !important;
  }
  #show-code #view-code #stylish-code a.linkifyplus > img {
      position: absolute !important;
      display: inline-block !important;
      max-height: 100px !important;
      padding: 3px 20px !important;
      visibility: hidden !important;
      transform: scale(0.2) !important;
      transition: background ease 0.7s !important;
      background: #333 !important;
  }
  #show-code #view-code #stylish-code a.linkifyplus:hover > img {
      position: fixed !important;
      display: inline-block !important;
      max-height: 50% !important;
      max-width: 200px !important;
      top: 25% !important;
      margin: auto 0 !important;
      right: 40% ! important;
      padding: 3px 20px !important;
      visibility: visible !important;
      transform: scale(1.5) !important;
      transition: background ease 0.1s !important;
      z-index: 1000 !important;
      background: black !important;
  }
  #show-code #view-code #stylish-code a.linkifyplus[href*=".gif"]:before,
  #show-code #view-code #stylish-code a.linkifyplus[href*=".png"]:before,
  #show-code #view-code #stylish-code a.linkifyplus[href*=".jpg"]:before {
      content: " " !important;
      position: relative !important;
      display: inline-block !important;
      width: 10px !important;
      height: 18px !important;
      line-height: 18px !important;
      padding: 0 5px 0 10px !important;
      border-radius: 3px !important;
      font-size: 17px !important;
      visibility: visible !important;
      opacity: 1 !important;
      background-image: url(http://findicons.com/files/icons/2652/gentleface/48/expand_icon.png) !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      background-size: 70% 140% !important;
      transform: rotate(270deg) !important;
      background-color: white !important;
  }
  #show-code #view-code #stylish-code a.linkifyplus[href*=".gif"]:after,
  #show-code #view-code #stylish-code a.linkifyplus[href*=".png"]:after,
  #show-code #view-code #stylish-code a.linkifyplus[href*=".jpg"]:after {
      content: attr(href) !important;
      position: relative !important;
      display: inline-block !important;
      height: 18px !important;
      line-height: 18px !important;
      padding: 0 20px !important;
      font-size: 15px !important;
      visibility: visible !important;
      opacity: 1 !important;
  }

  /* USERSTY - STY INFOS - MORE - DESC - TITLE */
  #content-wrapper article#main-article #more-info h2,
  #content-wrapper article#main-article #additional-info h2,
  #content-wrapper article#main-article #discussions-area h2 {
      display: inline-block ! important;
      min-width: 965px !important;
      max-width: 965px !important;
      padding-left: 15px !important;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%);
      border-radius: 5px !important;
      box-shadow: 3px 3px 2px black !important;
      color: #A3A4A4 !important;
  }
  #content-wrapper article#main-article #discussions-area h2 {
      min-width: 965px !important;
      max-width: 965px !important;
  }
  section#discussions-area h2 {
      position: relative !important;
      display: inline-block !important;
      left: 50px !important;
      margin-bottom: -15px !important;
  }
  section#discussions-area h3 {
      display: none !important;
  }

  /* USERSTY -  STY INFOS - MORE INFOS - DESC */
  #style-info + #additional-info {
      position: relative ! important;
      display: inline-block !important;
      min-width: 90% !important;
      max-width: 90% !important;
      left: 2% !important;
      margin-top: 405px !important;
  }
  #additional-info-text {
      position: relative !important;
      display: inline-block !important;
      min-width: 965px !important;
      max-width: 965px !important;
      margin-top: -10px !important;
      overflow-y: auto;
      overflow-x: hidden!important;
      color: #ACAEB5 !important;
  }
  /* USERSTY - STY INFOS - MORE - DESC - Links Color */
  #additional-info #additional-info-text a {
      color: #E0B81F !important;
  }
  #additional-info #additional-info-text a:visited {
      color: #E7D590 !important;
  }

  /* USERSTY - STY INFOS - MORE - DESC - MARK LINKS / TEXT/ */
  #style-info + #additional-info #additional-info-text > mark > a {
      color: black !important;
  }
  #additional-info #additional-info-text > mark > a b {
      color: red!important;
  }

  /* === USERSTY - STY INFOS - FEED ==== */
  /* USERSTY - FIX NEW DESIGN - TOP HEARDER */
  .top_logo {
      margin-top: -5px !important;
  }
  .header-search {
      height: 25px !important;
  }
  .header-search .search_input {
      height: 25px !important;
      margin-top: 0px !important;
  }

  /* USERSTY - CREATE NEW STYLE */
  #create_new_style,
  .header_button {
      min-height: 20px !important;
      margin-top: -27px !important;
  }
  #create_new_style {
      min-height: 20px !important;
      margin-top: 0px !important;
      margin-left: 220px !important;
      margin-right: -192px !important;
  }
  #create_new_style a,
  .header_button a {
      font-weight: 600 !important;
      font-size: 14px !important;
  }

  /* USERSTY - STY INFOS - FEEDK LIST - "ASK New Q / FEED " */
  #discussions-area {
      position: absolute !important;
      display: inline-block ! important;
      float: none ! important;
      clear: both ! important;
      max-height: 100%!important;
      min-height: 30px !important;
      width: 330px !important;
      left: -31% !important;
      top: 46vh !important;
      padding: 1px !important;
      border: 1px solid red !important;
  }

  /* USERSTY - NEW DESIGN FIX -  STYLE INFO - FEED BACK CONTAINER */
  #as_userscript + #headline {
      position: absolute !important;
      display: inline-block ! important;
      float: none ! important;
      clear: both ! important;
      max-height: 100%!important;
      min-height: 30px !important;
      min-width: 20vw !important;
      max-width: 20vw !important;
      left: 0 !important;
      top: 23vh !important;
      border-radius: 3px 3px 0 0 !important;
      padding: 1px !important;
      box-shadow: 3px 3px 2px black !important;
      background: #222 !important;
  }
  #as_userscript + #headline:before {
      content: "▲▼" !important;
      color: gold !important;
      font-size: 18px;
      font-weight: bold;
      margin-right: 10px;
  }
  #as_userscript + #headline:after {
      content: "(\\"⟰ + Enter\\" for Line Break)" !important;
      color: tan !important;
      font-size: 13px;
      font-weight: bold;
      margin-left: 5px;
  }
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper {
      position: absolute !important;
      display: inline-block ! important;
      float: none ! important;
      clear: both ! important;
      height: 100%!important;
      min-height: 60.1vh !important;
      max-height: 60.1vh !important;
      min-width: 19.5vw !important;
      max-width: 19.5vw !important;
      left: 0 !important;
      top: 29.8vh !important;
      padding: 1px 4px 1px 8px !important;
      overflow: hidden;
      box-shadow: 3px 3px 2px black;
      background: #222 !important;
  }
  #as_userscript + #headline:hover + #comments-section-wrapper.comments-wrapper,
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper:hover {
      position: absolute !important;
      display: inline-block ! important;
      float: none ! important;
      clear: both ! important;
      min-height: 35vh !important;
      max-height: 60vh !important;
      padding: 1px 4px 1px 8px !important;
      overflow: hidden;
      overflow-y: auto !important;
  }
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper > div {
      display: inline-block ! important;
      width: 100% !important;
      min-width: calc(100% - 11px) !important;
      max-width: calc(100% - 11px) !important;
  }
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper:hover > div {
      display: inline-block ! important;
      width: 100% !important;
      min-width: calc(100% + 1px) !important;
  }
  #comments-section-wrapper div:nth-child(odd) .comment-wrapper .comment-content {
      background: #222 !important;
  }
  #comments-section-wrapper div:nth-child(odd) .comment-wrapper .comment-content .content-wrapper .content {
      color: gray !important;
  }
  #comments-section-wrapper div:nth-child(even) .comment-wrapper .comment-content {
      background: #111 !important;
  }
  #comments-section-wrapper div:nth-child(even) .comment-wrapper .comment-content .content-wrapper .content {
      color: gray !important;
  }
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper .main-input-wrapper {
      margin-bottom: 10px;
  }

  /* ZEBBRA */
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper .main-input-wrapper ~ div:nth-child(even) {
      background-color: #111 !important;
  }
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper .main-input-wrapper ~ div:nth-child(even) .comment-wrapper {
      background-color: #4A4A4A !important;
  }
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper .main-input-wrapper ~ div:nth-child(odd) {
      background-color: #111 !important;
  }
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper .main-input-wrapper ~ div:nth-child(odd) .comment-wrapper {
      background-color: #111 !important;
  }

  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper .main-input-wrapper ~ div .comment-content {
      max-width: calc(100% - 20px) !important;
      margin-left: 5px !important;
  }
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper .main-input-wrapper ~ div .comment-wrapper .comment-content {
      position: relative;
      top: 3px !important;
      padding: 5px !important;
      border-radius: 5px !important;
      background: #222 !important;
  }
  .comment-wrapper .replies-wrapper {
      padding-left: 10px;
  }
  .comment-wrapper .actions {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px !important;
      margin-top: 5px !important;
  }
  .comment-content .top .left-details .date {
      color: gold !important;
      font-size: 12px;
      line-height: 14px;
      opacity: 0.4;
  }
  #as_userscript + #headline + a[href^="https://forum.userstyles.org/post/discussion?"] #send_feedback_button {
      height: 18px !important;
      width: 30px !important;
      margin: 0px !important;
      box-shadow: none !important;
      color: transparent !important;
      border: none !important;
      white-space: nowrap;
      background-color: blue !important;
      transition: all ease 0.2s !important;
  }
  #as_userscript + #headline + a[href^="https://forum.userstyles.org/post/discussion?"] #send_feedback_button > div:last-of-type {
      visibility: hidden;
  }
  #as_userscript + #headline + a[href^="https://forum.userstyles.org/post/discussion?"]:not(:hover) #send_feedback_button > div:first-of-type {
      height: 20px;
      margin-right: -103px !important;
      margin-top: 0px;
  }
  #as_userscript + #headline + a[href^="https://forum.userstyles.org/post/discussion?"]:not(:hover) #send_feedback_button > div .feedback-icon {
      height: 15px;
      margin-top: 4px;
  }
  /* HOVER */
  #as_userscript + #headline + a[href^="https://forum.userstyles.org/post/discussion?"]:hover #send_feedback_button {
      width: 172px !important;
      height: 20px;
      margin-top: 0px !important;
      color: gold !important;
      transition: all ease 0.2s !important;
  }
  #as_userscript + #headline + a[href^="https://forum.userstyles.org/post/discussion?"]:hover #send_feedback_button > div:last-of-type {
      display: inline-block;
      visibility: visible;
  }
  #as_userscript + #headline + a[href^="https://forum.userstyles.org/post/discussion?"]:hover #send_feedback_button > div:first-of-type .feedback-icon {
      height: 15px;
      margin-right: 15px !important;
      margin-top: 5px !important;
  }
  .comment-content.edit {
      margin-top: 4px;
      padding: 5px !important;
      background: #222 !important;
  }
  .comment-content .top {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px !important;
  }
  .comment-content.edit .content-wrapper .content {
      width: 100% !important;
      line-height: 16px;
      font-size: 14px;
      color: gray !important;
  }
  .comment-content.edit .content-wrapper .content textarea {
      display: inline-block !important;
      width: 105% !important;
      height: auto !important;
      min-height: 20px !important;
      line-height: 15px !important;
      padding: 3px 4px !important;
      font-size: 15px !important;
      overflow-y: scroll !important;
      color: white !important;
  }
  #as_userscript + #headline + #comments-section-wrapper.comments-wrapper .main-input-wrapper ~ div .comment-wrapper .comment-content .content {
      display: inline-block !important;
      max-width: 95% !important;
      height: auto !important;
      max-height: 50px !important;
      min-height: 20px !important;
      padding: 3px 5px !important;
      white-space: pre-wrap !important;
      word-wrap: anywhere !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      color: white !important;
  }

  /* Without UBlock */
  #style_info .adContainer ~ #discussions-area {
      position: absolute !important;
      display: inline-block ! important;
      float: none ! important;
      clear: both ! important;
      max-height: 450px !important;
      min-height: 30px !important;
      min-width: 330px !important;
      max-width: 330px !important;
      width: 330px !important;
      left: 1% !important;
      top: 360px !important;
      padding: 1px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      background: #222;
      border: 1px solid red !important;
  }
  #single_discussion {
      height: 70px !important;
      padding: 5px !important;
  }
  #single_discussion:first-child {
      margin-top: -15px !important;
  }
  #single_discussion:not(:first-child) {
      margin-top: -10px !important;
  }
  #single_discussion_up {
      height: 17px !important;
      margin-bottom: 3px !important;
      margin-top: 9px !important;
  }
  #single_discussion .text_style_page {
      width: 296px !important;
      height: 41px !important;
      line-height: 15px !important;
      margin-top: 0px !important;
      font-size: 13px !important;
      color: gray !important;
      outline: 1px solid gray !important;
  }
  #rating_discussion[src="/ui/images/icons/rating_0.svg"] {
      height: 13px;
      width: 18px;
      opacity: 0.2;
  }
  #style_info .adContainer ~ #discussions-area .text_style_page {
      color: #b3b3b3;
  }
  .see_more {
      height: 21px !important;
  }
  .feedback-icon {
      height: 17.3px;
      margin-right: 6.8px !important;
      margin-top: 3px !important;
  }
  /* (new200) */
  #archive_style_button {
      position: absolute;
      display: inline-block;
      justify-content: center;
      height: 15px !important;
      line-height: 15px !important;
      width: 120px !important;
      right: 45%;
      top: 57.4vh !important;
      margin-top: 0px !important;
      padding: 2px 2px !important;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px !important;
      text-align: center;
      box-shadow: none !important;
  }
  #as_userscript {
      position: absolute !important;
      height: 18px !important;
      line-height: 15px !important;
      width: 120px !important;
      margin: 0 !important;
      right: 33% !important;
      top: 4.7vh !important;
      margin-top: 0px !important;
      padding: 2px 2px !important;
      border-radius: 4px;
      font-size: 5px;
      text-align: center;
      cursor: pointer;
      border: 1px solid #222 !important;
      box-shadow: none !important;
  }
  #as_userscript a:before {
      content: "Userscript";
      position: absolute !important;
      display: inline-block;
      height: 15px !important;
      line-height: 15px !important;
      width: 120px !important;
      margin-left: -34px;
      margin-top: -2px;
      border-radius: 4px;
      font-size: 14px !important;
      padding: 3px 2px !important;
      text-align: center;
      background-image: url("https://icons.duckduckgo.com/ip2/userscripts-mirror.org.ico");
      background-position: 5px center;
      background-repeat: no-repeat;
      background-size: 12%;
      background-color: #333;
      box-shadow: 3px 3px 2px black;
  }

  /* PB on click with the GM - TEST FIX NEW DESIGN - SHOW CSS  */
  .css_button {
      position: absolute;
      display: inline-block;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 22px !important;
      line-height: 23px !important;
      width: 136px !important;
      margin-top: 30px;
      right: 40.6% !important;
      top: 1.6vh !important;
      padding: 0 5px !important;
      border-radius: 4px;
      color: #3498db;
      font-size: 14px;
      font-weight: normal;
      background-color: #e2ebf8;
  }
  /* (new215) */
  .css_button .no-select {
      float: right !important;
      height: 25px !important;
      line-height: 25px !important;
      margin-bottom: 0px !important;
      font-size: 12px !important;
  }
  .css_open::after,
  .css_close::after {
      content: "🙈";
      float: left !important;
      height: 21px !important;
      width: 21px !important;
      margin-bottom: 8px !important;
      margin-right: 14px !important;
      text-align: center !important;
  }
  /* Without GM */
  #css_text_area_div textarea#stylish-code.cssVisible {
      display: inline-block;
      position: fixed;
      resize: vertical;
      overflow: auto;
      min-width: 674px;
      max-width: 674px !important;
      min-height: 70%;
      left: 1150px !important;
      top: 10.4vh !important;
      margin-bottom: 20px;
      padding: 5px 5px 5px 15px;
      border-radius: 4px;
      border-top-width: 4px !important;
      font-size: 13px;
      font-family: "Open Sans", sans-serif !important;
      z-index: 5000;
      color: #ffffff;
      background-color: #2e3e49 !important;
  }
  /* NEW DESIGN SHOW CSS - GM ADAPTATION for "userstyles.org css highlighter" (trespassersW / darkred) */
  #css_text_area_div {
      position: absolute !important;
      left: 870px !important;
      top: 85px !important;
      border-top: 2px solid red !important;
      z-index: 1 !important;
  }
  .hiBeautted {
      border-top: 20px solid transparent !important;
      background-color: #293134 !important;
      color: #e0e2e4 !important;
  }
  #stylish-code,
  code.hiBeautted#stylish-code[style*="display: block;"] {
      min-height: 600px !important;
      top: -23px !important;
      padding: 20px !important;
      border-top: 40px solid transparent !important;
      color: #B1B1B1 !important;
  }
  code#stylish-code.cssVisible[style*=" display: none;"],
  code.hiBeautted#stylish-code[style*="display: none;"] {
      display: none !important;
  }
  #hiBeauty .hiBeautted:before,
  #hiBeauty::before {
      position: absolute;
      display: inline-block !important;
      height: 20px !important;
      top: 5px !important;
      left: 10% !important;
      padding: 1px 3px 0 1px !important;
      border-radius: 0 !important;
      opacity: 1 !important;
      z-index: 5000 !important;
      background-color: rgba(255, 0, 0, 0.7) !important;
  }
  #hiBeauty:hover::before {
      padding: 4px !important;
      opacity: 1 !important;
      z-index: 1;
      transition: all ease 1s !important;
      border: 1px solid gray !important;
      background-color: rgba(0, 0, 0, 0.4) !important;
  }
  #hiBeauty::after {
      content: "Ctrl + Clik = COPY Css to ClipBoard" !important;
      position: absolute;
      display: block;
      left: 14% !important;
      top: 5px;
      padding: 0 5px !important;
      border-radius: 0 5px 5px 0 !important;
      font-size: 15px !important;
      opacity: 0.75;
      z-index: 1;
      transition: all ease 0.2s !important;
      color: gold !important;
      background: rgba(255, 0, 0, 1) !important;
  }
  #hiBeauty:hover::after {
      font-size: 15px !important;
      color: white !important;
      background: rgba(0, 0, 0, 0.61) !important;
      transition: all ease 0.4s !important;
  }

  /* END - NEW DESIGN SHOW CSS - GM ADAPTATION for "userstyles.org css highlighter (trespassersW / darkred) " - MEDIA QUERIE */
  /* USERTY - NEW DESIGN - ACT BUT */
  #actions_div {
      position: absolute;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 25px !important;
      width: 45.8vw !important;
      right: 32.5%;
      top: 57.1vh !important;
      margin: 0 !important;
      padding: 1px 3px;
      box-shadow: 3px 3px 2px black;
      background: #222 !important;
  }
  #actions_div #buttons {
      position: absolute;
      height: 20px;
      right: 0 !important;
      top: 3px !important;
  }
  #share_div {
      display: flex;
      flex-direction: column;
      padding: 0 2px !important;
      color: #2c3e50;
      font-size: 0 !important;
  }
  #social_networks {
      height: 17px !important;
      margin-top: 1px !important;
  }
  .white_button,
  #style_installed_button,
  #ownedButtons,
  #update_style_button,
  #style_installed_button {
      height: 20px !important;
  }
  .white_button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 19px;
      width: 87px;
      border-radius: 4px;
      font-size: 12px;
      color: #2c3e50;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
      background-color: #ffffff;
      border: 1px solid #cdcfd1;
  }

  #update_style_button,
  #install_style_button.no-select {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 21px !important;
      width: 173px;
      margin-left: 2px !important;
      font-size: 15px;
      font-weight: bold;
      color: white;
      cursor: pointer;
      border-radius: 5px !important;
      box-shadow: none !important;
      background-color: #3498db;
      border: 1px solid red !important;
  }
  #install_style_button div:first-of-type {
      height: 20px;
      margin-top: -6px !important;
  }
  #install_style_button > div + div {
      height: 20px !important;
      line-height: 20px !important;
      margin-top: 0px !important;
      padding-left: 0px !important;
  }
  #ownedButtons + #install_style_button div + div {
      height: 20px !important;
      line-height: 20px !important;
      margin-top: -17px !important;
      padding-left: 25px !important;
  }
  #update_style_button > div:first-of-type,
  #style_installed_button > div:first-of-type {
      float: left !important;
      height: 22px !important;
      width: 26px !important;
  }
  .update-icon,
  .installed-icon,
  #install_style_icon {
      height: 20px !important;
      line-height: 20px !important;
      margin-right: 10px;
      margin-top: 3px !important;
      width: 18px !important;
  }
  #style_info {
      display: flex;
      flex-direction: column;
      width: 100%;
  }
  .style_title {
      position: absolute !important;
      display: inline-block !important;
      width: 45.2vw !important;
      height: 32px !important;
      line-height: 28px !important;
      top: 0.2vh!important;
      left: 21.4% !important;
      margin: 0 0 0 0 !important;
      padding-left: 13px;
      border-radius: 3px !important;
      font-size: 28px !important;
      color: #ccc !important;
      box-shadow: 3px 3px 2px black;
      background: #222 !important;
      /* border: 1px solid red !important; */
  }
  #style_author.ellipsis {
      position: absolute !important;
      display: inline-block !important;
      width: 45.1vw !important;
      height: 28px;
      line-height: 28px !important;
      left: 21.4% !important;
      top: 4.5vh !important;
      padding-left: 1vw !important;
      border-radius: 3px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-shadow: 3px 3px 2px black;
      background: #222 !important;
  }
  /* (new233) */
  #style_info #style_author > .by-author {
      display: inline-block !important;
      width: 20px !important;
      height: 28px;
      line-height: 28px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px !important;
  }
  #style_info #style_author > .author-name {
      display: inline-block !important;
      width: 7vw !important;
      height: 28px;
      line-height: 28px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }


  #information_div,
  #actions_div + #headline,
  #actions_div + #headline + #information_div,
  .adContainer + #headline,
  .adContainer + #headline + #applies_link {
      position: absolute !important;
      display: inline-block !important;
      min-width: 19.7vw !important;
      max-width: 19.7vw !important;
      top: 0.3vh !important;
      left: 0 !important;
      padding: 5px;
      border: 1px solid #404040;
      color: #ccc !important;
      box-shadow: 3px 3px 2px black;
      background: #222 !important;
  }
  #left_information {
      display: flex;
      flex-direction: column;
      min-width: 100% !important;
      max-width: 100% !important;
  }
  /* 1* - "INFORMATION" */
  #style-settings + #headline,
  #actions_div + #headline {
      display: none !important;
  }
  #right_information,
  #center_information {
      width: 46.5%;
      float: left;
      margin-top: 15px;
      padding: 5px;
      border-radius: 5px !important;
      text-align: center;
      background-color: #d6deeb;
  }
  #center_information {
      border-radius: 5px 0 0 5px !important;
      margin-right: 2px;
      text-align: center;
      background-color: #d6deeb;
  }

  #information_div #style-upvote {
      width: 80% !important;
      float: left;
      margin-top: 15px;
      margin-right: 4px !important;
      padding: 5px;
      border-radius: 5px 0 0 5px !important;
      text-align: center;
      background-color: #d6deeb;
  }
  #style-upvotes-wrapper .style-upvotes-top {
      display: inline-block !important;
      justify-content: space-between;
      align-items: center;
      vertical-align: bottom !important;
      height: 25px !important;
      line-height: 25px !important;
      margin-top: 5px !important;
      padding: 5px !important;
      font-size: 14px;
      color: peru !important;
      background: black !important;
  }
  #style-upvotes-wrapper .style-upvotes-top .like-icon {
      width: 18px;
      margin-right: 8px;
      height: 25px !important;
  }
  .style-upvotes-top > span {
      position: relative !important;
      display: inline-block !important;
      min-height: 25px !important;
      max-height: 25px !important;
      line-height: 25px !important;
      top: -7px !important;
  }
  #style-upvotes-wrapper .style-upvotes-count-wrapper {
      position: relative !important;
      display: inline-block !important;
      align-items: center;
      justify-content: flex-start;
      min-width: 28px !important;
      height: 28px !important;
      line-height: 26px !important;
      margin: 0px 0 0 10px !important;
      top: 1px !important;
      padding: 5px !important;
      border-radius: 50% !important;
      font-size: 20px !important;
      font-weight: 300;
      text-align: center !important;
      color: gold !important;
      background: red !important;
  }
  #right_information {
      width: 76.5% !important;
      border-radius: 0 5px 5px 0 !important;
      text-align: center;
      background-color: #d6deeb;
  }
  #infomation_value_left,
  #information_key_left {
      float: left;
      line-height: 13px !important;
      margin-top: -5px;
      margin-bottom: -8px;
      padding: 2px 5px;
      border-radius: 3px !important;
      text-align: center;
      background-color: #d6deeb;
  }
  #information_key_left {
      min-width: 30.5% !important;
      max-width: 30.5% !important;
      border-radius: 3px 0 0 3px !important;
      margin-right: -37px;
      text-align: center;
      background-color: #d6deeb;
  }
  #infomation_value_left {
      min-width: 62.5% !important;
      max-width: 62.5% !important;
      border-radius: 0 3px 3px 0 !important;
      text-align: center;
      background-color: #d6deeb;
  }
  #information_value {
      color: #2c3e50;
      font-size: 21px !important;
  }
  #left_pair_information:nth-child(2) #information_key_left + #infomation_value_left {
      line-height: 9px !important;
      font-size: 11px !important;
  }

  /* "APPLIES TO" */
  .adContainer + #headline {
      height: 15px !important;
      line-height: 15px !important;
      top: 237px !important;
  }
  .adContainer + #headline + #applies_link {
      height: 15px !important;
      line-height: 15px !important;
      top: 287px;
  }

  /* FIX NEW DESIGN - STYLE INFO PAGE */
  .PageContent iframe[src="/d/users/personal"] {
      max-width: 99.5% !important;
      min-height: 90vh !important;
      max-height: 90vh !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      background: #111 !important;
  }

  /* USERTSTY INFOS */
  #container-responsive {
      display: table;
      margin: 0 auto;
      margin-left: 0 !important;
      margin-top: 0px!important;
      width: 100%;
  }
  #nav-view-responsive {
      flex-direction: unset !important;
      background-color: #333 !important;
  }
  #container-responsive #view-responsive:not(.us-center-items-horizontally) {
      display: flex;
      justify-content: center;
      margin-right: 42px;
      min-width: 100% !important;
  }
  /* PB - TOUCH STY INFO */
  #view-responsive.us-center-items-horizontally {
      position: absolute !important;
      display: inline-block !important;
      justify-content: unset !important;
      min-height: 92vh !important;
      max-height: 92vh !important;
      margin: 0 !important;
      top: 8vh !important;
      overflow: hidden !important;
  }
  #style_info {
      display: inline-block !important;
      flex-direction: unset !important;
      margin-left: 0 !important;
      width: 100% !important;
      min-height: 91vh !important;
      top: 0vh !important;
      padding-left: 0vw !important;
      border-top: 1px solid red !important;
  }
  /* (new215) */
  .action-button-wrapper {
      position: absolute;
      width: 25px !important;
      height: 25px !important;
      left: -1vw !important;
      top: -4.2vh !important;
      z-index: 100 !important;
  }
  /* REPORT  */
  .action-button-wrapper .ctl-button + button.ctl-button,
  .action-button-wrapper button.ctl-button {
      position: absolute !important;
      display: inline-block !important;
      flex-direction: unset !important;
      width: 100% !important;
      min-width: 25px !important;
      max-width: 25px !important;
      height: 100% !important;
      min-height: 25px !important;
      max-height: 25px !important;
      top: 0 !important;
      left: -5px !important;
      margin: 0 !important;
      padding: 0 !important;
      cursor: pointer;
      border-radius: 100% !important;
      opacity: 0.5 !important;
      z-index: 1000 !important;
      background-image: url(https://userstyles.org/ui/images/report-hover.svg) !important;
      background-position: center center !important;
      object-fit: contain !important;
      border: 1px solid gray !important;
      background-color: black !important;
  }
  .action-button-wrapper .ctl-button .donation-desktop .ctl-button-image-hover,
  .action-button-wrapper .ctl-button .donation-desktop .ctl-button-image,
  .action-button-wrapper .ctl-button:hover .ctl-button-image-hover,
  .action-button-wrapper button.ctl-button img.ctl-button-image[src="/ui/images/report.svg"],
  .action-button-wrapper:hover img.ctl-button-image[src="/ui/images/report-hover.svg"] {
      display: none !important;
  }
  .action-button-wrapper .ctl-button:hover .ctr-button-tooltip {
      display: none !important;
  }

  /* DONATE */
  .action-button-wrapper .ctl-button .donation-desktop {
      position: relative !important;
      display: inline-block !important;
      flex-direction: unset !important;
      width: 100% !important;
      min-width: 29px !important;
      max-width: 29px !important;
      height: 100% !important;
      min-height: 28px !important;
      max-height: 28px !important;
      top: -2px !important;
      left: -2px !important;
      cursor: pointer;
  }
  /* (new218) */
  #style_info .action-button-wrapper div.ctl-button {
      position: absolute !important;
      display: inline-block !important;
      flex-direction: unset !important;
      width: 100% !important;
      min-width: 25px !important;
      max-width: 25px !important;
      height: 100% !important;
      min-height: 25px !important;
      max-height: 25px !important;
      top: -38px !important;
      left: -4px !important;
      margin: 0 !important;
      padding: 0 !important;
      cursor: pointer;
      opacity: 0.5 !important;
      z-index: 1000 !important;
      border-radius: 100% !important;
      background-image: url(https://userstyles.org/ui/images/donate-hover.svg) !important;
      background-position: center center !important;
      object-fit: contain !important;
      border: 1px solid gray !important;
      background-color: black !important;
  }






  /*  USERSTY - HOME PAGE - WITH HORIZONTAL CARROUSEL/ ROWS */
  #container-responsive #view-responsive.us-center-items-horizontally .view_inner.HomePage {
      display: inline-block;
      width: 99%;
      margin-top: 10px;
  }
  #container-responsive #view-responsive.us-center-items-horizontally .view_inner.HomePage #wrapper-carousel {
      margin-left: 28%;
      margin-top: 10px;
  }
  #container-responsive #view-responsive.us-center-items-horizontally .view_inner.HomePage .category_head {
      display: inline-block;
      width: 100%;
      margin-bottom: -1px;
      border-radius: 5px 5px 0 0;
      background: #222;
      border: 1px solid gray;
  }
  #container-responsive #view-responsive.us-center-items-horizontally .view_inner.HomePage .category_head .category_title + a,
  #container-responsive #view-responsive.us-center-items-horizontally .view_inner.HomePage .category_head .category_title {
      display: inline-block !important;
      width: 100%;
      height: 20px;
      line-height: 20px;
      margin-top: 5px;
      margin-bottom: 5px;
      font-size: 17px;
      text-align: center;
  }
  #container-responsive #view-responsive.us-center-items-horizontally .view_inner.HomePage .category_head .see_more {
      display: inline-block !important;
      height: 20px;
      line-height: 20px;
      margin-top: 0;
  }
  #container-responsive #view-responsive.us-center-items-horizontally .view_inner.HomePage .us-stylecards__container.us-stylecards__container--narrow {
      display: inline-block;
      width: 100%;
      height: 314px;
      margin-bottom: 10px;
      border-radius: 0 0 5px 5px;
      text-align: center;
      border: 1px solid gray;
  }

  /* NOTES  (can add screenshots visible with Linkify plus) */
  #style_info #css_text_area_div + #headline {
      position: absolute !important;
      display: inline-block !important;
      width: 30.2vw !important;
      top: 0.3vh !important;
      right: 0.5% !important;
      margin: 0 !important;
      padding-left: 8px !important;
      z-index: 100 !important;
      box-shadow: 3px 3px 2px black;
      background: #111 !important;
  }

  #style_info #headline + #notes_textarea:not(:empty) {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      max-width: 30vw !important;
      min-height: 84.9vh !important;
      max-height: 84.9vh !important;
      margin-top: 0px !important;
      right: 0.5% !important;
      top: 0.2vh !important;
      padding: 40px 5px 5px 5px !important;
      font-size: 15px;
      overflow: hidden !important;
      overflow-y: auto !important;
      resize: none !important;
      color: gray !important;
      box-shadow: 3px 3px 2px black;
      background-color: #222 !important;
      border: 1px solid #404040;
  }
  #preview_image_div {
      position: absolute !important;
      display: inline-block !important;
      height: 47.3vh !important;
      max-width: 46vw !important;
      min-width: 46vw !important;
      margin-bottom: 0px !important;
      margin-top: 0px !important;
      right: 32.5% !important;
      top: 8.8vh !important;
      background-position: center center !important;
      background-repeat: no-repeat;
      background-size: 100% !important;
      background-size: contain !important;
      box-shadow: 3px 3px 2px black !important;
      background-color: #111 !important;
      border: 1px solid #222;
  }
  #applies_link + #headline + .text_style_page {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      max-width: 45.5vw !important;
      min-width: 45.5vw !important;
      min-height: 27vh !important;
      max-height: 27vh !important;
      margin-top: 0px !important;
      right: 32.5%;
      bottom: 2.2vh !important;
      padding: 5px !important;
      font-size: 15px;
      overflow: hidden !important;
      overflow-y: auto !important;
      resize: none !important;
      color: gray !important;
      border: 1px solid #404040;
      box-shadow: 3px 3px 2px black;
      background-color: #222 !important;
  }
  #headline {
      font-size: 18px;
      font-weight: bold;
      margin-top: 30px;
      color: #ccc !important;
  }
  #applies_link + #headline,
  .adContainer + #headline + #applies_link + #headline {
      display: none;
  }
  #notes_textarea {
      width: 99%;
  }

  /* APLLIE TO  */
  #information_div + #headline {
      position: absolute !important;
      display: inline-block ! important;
      float: none ! important;
      clear: both ! important;
      max-height: 100%!important;
      min-height: 30px !important;
      min-width: 20vw !important;
      max-width: 20vw !important;
      left: 0 !important;
      top: 15vh !important;
      padding-left: 5px !important;
      border-radius: 3px 3px 0 0 !important;
      box-shadow: 3px 3px 2px black;
      background: #222 !important;
      border-bottom: 1px solid gray !important;
  }
  #headline + #applies_link {
      position: absolute !important;
      display: inline-block ! important;
      float: none ! important;
      clear: both ! important;
      max-height: 100%!important;
      min-height: 30px !important;
      min-width: 20vw !important;
      max-width: 20vw !important;
      left: 0 !important;
      top: 20.7vh !important;
      padding: 1px 0 0 5px !important;
      border-radius: 0 0 3px 3px !important;
      color: peru !important;
      box-shadow: 3px 3px 2px black;
      background: #222 !important;
  }
  #applies_link:empty:before {
      content: "All" !important;
      margin-left: 5px !important;
      color: gold !important;
  }

  /* USERSTYLE INFO PAGE - ANDROID - MESSAGE + BUTTON */
  #top_android_button {
      display: inline-block !important;
      flex-direction: unset !important;
      justify-content: unset !important;
      height: 44px;
      width: 176px;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.43);
      background-color: #222 !important;
  }
  .android_button_banner {
      display: none !important;
  }

  /* STYLE INSTALL - BUTTON */
  .customize_button + div,
  #buttons > #ownedButtons + div {
      position: relative !important;
      display: inline-block !important;
      height: 22px !important;
      width: 160px !important;
      margin-bottom: 0px !important;
      margin-right: 0px !important;
      margin-left: 5px !important;
      border-radius: 3px !important;
      box-shadow: 3px 3px 2px black !important;
      border: 1px solid red !important;
  }
  .customize_button {
      position: relative !important;
      display: inline-block !important;
      display: none !important;
      height: 22px !important;
      width: 130px !important;
      margin-bottom: 0px !important;
      background: blue !important;
  }
  #install_button,
  #buttons > #ownedButtons + div #install_button {
      position: relative !important;
      display: inline-block !important;
      height: 19px !important;
      width: 19px !important;
      white-space: nowrap !important;
      overflow-wrap: unset !important;
      text-align: left !important;
  }
  #install_button > div:first-of-type,
  #buttons > #ownedButtons + div #install_button > div:first-of-type {
      position: relative !important;
      display: inline-block !important;
      height: 19px !important;
      width: 19px !important;
      white-space: nowrap !important;
      overflow-wrap: unset !important;
      text-align: left !important;
  }
  .customize_button .customize_button_text,
  #install_button > div:last-of-type,
  #buttons > #ownedButtons + div #install_button > div:last-of-type {
      position: relative !important;
      display: inline-block !important;
      height: 20px !important;
      line-height: 15px !important;
      width: 150px !important;
      left: -40px !important;
      margin-top: 0 !important;
      top: -4px !important;
      white-space: nowrap !important;
      overflow-wrap: unset !important;
      text-align: right !important;
      font-size: 12px !important;
      color: peru !important;
  }
  img.stylish-icon {
      height: 18px !important;
      width: 18px !important;
      margin-right: 10px;
  }
  .customize_button .customize_button_text {
      width: 100px !important;
      left: 20px !important;
      top: -21px !important;
  }

  /* USERSTY - ARCHIVED INFO */
  /* (new219) ARCHIVED - MESSAGE */
  #archived {
      position: fixed !important;
      display: inline-block !important;
      max-width: 505px !important;
      margin: 0px !important;
      top: 25vh !important;
      left: 32vw !important;
      padding: 10px !important;
      border-radius: 5px !important;
      z-index: 49998 !important;
      opacity: 0.5 !important;
      background: red !important;
      border: 3px dashed black !important;
  }
  #archived:hover {
      opacity: 1 !important;
      background: #111 !important;
      border: 3px dashed red !important;
  }
  #archived_title,
  .customize_button + #archived_title {
      display: inline-block;
      height: 20px !important;
      line-height: 20px !important;
      margin-top: 0 !important;
      font-size: 20px !important;
      text-align: center !important;
  }
  .archived_text {
      font-size: 15px;
      overflow-wrap: normal !important;
      white-space: pre-line;
  }
  .archived_text + .archived_text + .archived_text,
  .archived_text:first-of-type {
      color: gold !important;
  }
  .archived_text:first-of-type + .archived_texte {
      height: 210px !important;
      margin-bottom: 21px;
      padding: 5px 5px 0;
      overflow-x: hidden;
      overflow-y: auto;
      border-bottom: 1px solid tomato;
      border-top: 1px solid red;
  }
  .archived_text + .archived_text + .archived_text span a {
      clear: both;
      float: left;
      width: 100%;
  }
  .archived_text + .archived_text + .archived_text span a {
      float: right;
      width: 100%;
  }

  /* CREATE / EDIT USERSTY PAGE */
  #view_inner {
      display: inline-block;
      width: 68% !important;
      padding: 5px 200px !important;
  }
  html > body > ul + form[action="/styles/create"],
  html > body > ul + form[action="/styles/update"] {
      display: inline-block;
      width: 1067px !important;
      margin-left: 112px !important;
  }

  /* DELETE USERSTY PAGE */
  .PageContent > form[action="/styles/delete_save"] table.form-controls textarea#obsoletion-message {
      width: 99%;
      min-height: 330px;
      overflow-x: hidden;
      overflow-y: auto;
  }

  /* QUESTION ? - PB IMAGE BACKGROUD */
  #post-discussion + #login-form + #no-discussions {
      position: absolute;
      display: inline-block;
      width: 750px;
      height: 17px;
      line-height: 17px;
      padding: 1px 0px 1px 14px;
      top: -9px;
      margin-left: 160px;
      text-align: center;
      text-decoration: none;
      z-index: 500;
      background-image: url("https://userstyles.org/images/question.png");
      background-position: 0px 3px;
      background-repeat: no-repeat;
      background-color: transparent;
      color: gold;
  }
  #discussions {
      margin-left: 20px;
      margin-top: 5px;
  }

  /* USERSTY - STY INFOS - FEED LIST - (Title) */
  #discussions > li > a:nth-child(1) {
      margin-left: 8px !important;
      margin-right: 30px !important;
  }
  /* USERSTY - STY INFOS - FEED LIST - (Member NAME) */
  #discussions > li > a:nth-child(2) {
      margin-left: 4px !important;
      margin-right: 15px !important;
  }
  /* USERTYL - FOOTER */
  #footer {
      position: absolute !important;
      bottom: -6vh !important;
      height: auto !important;
      margin-top: 0px !important;
      padding: 0 0 0 0 !important;
  }
  #footer:hover {
      position: absolute !important;
      bottom: -1vh !important;
  }
  #footer-inside {
      display: inline-block !important;
      margin-left: 0px !important;
      margin-top: -69px !important;
      text-align: center !important;
      background-color: #111 !important;
      border-top: 1px solid red !important;
  }
  #leftFooter {
      float: left !important;
      width: 80% !important;
      margin-left: 0px;
  }
  #copyrights {
      text-align: left !important;
      color: gold !important;
  }
  #leftFooter .bottomLinks {
      width: 50% !important;
      color: #3498db;
      display: flex;
      flex-direction: row;
      margin-top: 5px;
  }
  #rightFooter {
      float: right !important;
      height: 55px !important;
      width: 19% !important;
      margin-right: 0px !important;
  }
  #rightFooter > div a {
      display: inline-block !important;
      height: 55px !important;
      line-height: 55px !important;
  }
  #rightFooter > div a .logo {
      background-size: contain;
      height: 35px !important;
      width: 111px;
      background-repeat: no-repeat !important;
      background-image: url("https://userstyles.org/ui/images/stylish-logo-2.svg");
  }

  /* USERSTY / GREASY - TOP HEADER - TITRE "User.org"/"User Name" - DARK BACKGROUD */
  #Frame {
      margin-top: -8px !important;
  }
  #vanilla_discussions_index #Head.Head,
  #main-header {
      position: fixed !important;
      display: inline-block ! important;
      float: none ! important;
      width: 99.9% !important;
      height: 41px !important;
      left: -0.2% !important;
      top: -1px !important;
      z-index: 5 !important;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%) !important;
      border-bottom: 1px solid gray !important;
  }
  body[pagetype="PersonalProfile"] #main-header,
  body:not(.Settings) #Head,
  body[pagetype="ListingPage"] #main-header,
  body[pagetype="UserProfile"] #main-header {
      position: fixed !important;
      display: inline-block ! important;
      float: none ! important;
      height: 55px !important;
      top: -1px !important;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%) !important;
      background-color: #670000 !important;
      border-bottom: 1px solid red !important;
  }

  /* MAIN HEARDER - Z-INDEX */
  #main-header {
      z-index: 500000 !important;
  }

  /* === USERSTY - STY TITLE/Name === */
  /* USERSTY - SITE TITLE "User.org" + "USER NAME" / NAME */
  #main-header > h1 {
      position: relative ! important;
      display: inline-block ! important;
      width: 47% !important;
      min-width: 895px !important;
      height: 30px !important;
      line-height: 28px !important;
      margin-top: -3px !important;
      border-radius: 5px ! important;
      font-size: 23px ! important;
      text-align: left !important;
      text-indent: -117px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%);
  }
  #main-header > h1::-moz-selection {
      background: #FFCC11 ! important;
      color: #ffffff ! important;
  }
  #main-header > h1:hover {
      color: gold ! important;
  }

  /* USERSTY - SITE TITLE - TXT "User.org" */
  #main-header > h1 > a {
      display: inline-block ! important;
      width: 161px !important;
      margin-right: -100px !important;
      margin-left: 28% !important;
      margin-bottom: 30px ! important;
  }
  /* USERSTY - MY ACCOUNT / USER PROF -  TXT " ABOUT ME" - TXT + Back transpt - CONTAINER FULL */
  #left-sidebar nav ul dl:not(:hover),
  #main-article > dl:not(:hover) {
      position: fixed ! important;
      display: inline-block ! important;
      float: none !important;
      width: 50px !important;
      max-height: 15px ! important;
      top: 23px ! important;
      margin-top: 5px ! important;
      left: 275px !important;
      font-size: 10px ! important;
      text-align: left !important;
      z-index: 900 ! important;
      overflow: hidden !important;
      visibility: visible !important;
      transition: all ease .4s !important;
  }
  #left-sidebar nav ul dl:hover,
  #main-article > dl:hover {
      position: fixed ! important;
      display: inline-block ! important;
      float: none !important;
      width: auto !important;
      height: auto ! important;
      top: 23px ! important;
      margin-top: 5px ! important;
      left: 210px !important;
      padding: 3px 50px 1px 70px!important;
      font-size: 10px ! important;
      text-align: left !important;
      overflow: visible !important;
      z-index: 50000 !important;
  }

  /* "About" / "Conact" - LABEL CONTAINER - NOT HOVER */
  #left-sidebar nav ul dl:not(:hover) > dt,
  #main-article > dl:not(:hover) > dt {
      position: relative ! important;
      display: block !important;
      float: none !important;
      width: 74px !important;
      height: 16px ! important;
      line-height: 15px ! important;
      top: 1px ! important;
      margin-bottom: -14px !important;
      left: 0px ! important;
      padding: 0px 6px 1px 0px !important;
      font-size: 10px ! important;
      text-align: left !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      z-index: 5000 !important;
      color: transparent ! important;
  }
  #left-sidebar nav ul dl:not(:hover) > dt:before,
  #main-article > dl:not(:hover) > dt:before {
      content: "About \\25B6  " !important;
      color: red !important;
  }

  /* "About" / "Conact" - LABEL CONTAINER - HOVER */
  #left-sidebar nav ul dl:hover > dt,
  #main-article > dl:hover > dt {
      position: relative ! important;
      display: block !important;
      float: none !important;
      width: 44px !important;
      height: 12px ! important;
      line-height: 12px ! important;
      margin-bottom: -14px !important;
      left: 0px ! important;
      padding: 0px 6px 1px 2px !important;
      border-radius: 5px 0 0 5px !important;
      font-size: 10px ! important;
      text-align: left !important;
      color: grey ! important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      z-index: 5000 !important;
      background: linear-gradient(to bottom, #000000 2%, #111111 37%, #333333 100%, #131313 100%) repeat scroll 0 0 transparent !important;
      border: 1px solid gray !important;
  }
  /* "About" / "Conact" - FULL CONTAINER - HOVER */
  #main-article > dl:hover > dd:first-of-type,
  #left-sidebar nav ul dl:hover > dd,
  #main-article > dl:hover > dd:first-of-type {
      position: relative ! important;
      width: 0px !important;
      height: 15px ! important;
      top: -6px ! important;
      margin-bottom: -3px !important;
      margin-left: 55px ! important;
      padding-left: 10px !important;
      padding-right: 8px !important;
      text-align: left !important;
      overflow: hidden !important;
      transition: all ease 0.4s !important;
      background: black !important;
      outline: 1px solid gray !important;
  }

  /* "About" - FULL CONTAINER - NOT HOVER */
  #left-sidebar nav ul dl:not(:hover),
  #main-article > dl:not(:hover) dd:first-of-type {
      margin-left: 100px !important;
  }
  #main-article > dl:not(:hover) > dd:first-of-type:not(:hover) {
      position: relative ! important;
      display: inline-block ! important;
      max-width: 0px !important;
      height: 20px ! important;
      top: -6px ! important;
      margin-bottom: -3px !important;
      margin-left: 47px ! important;
      padding-left: 0px !important;
      padding-right: 0px !important;
      text-align: left !important;
      background: black !important;
      overflow: hidden !important;
      visibility: hidden !important;
      border: none !important;
  }

  /* "About" - FULL CONTAINER - HOVER */
  #left-sidebar nav ul dl:hover > dd:first-of-type,
  #main-article > dl:hover > dd:first-of-type {
      display: inline-block ! important;
      width: 100% !important;
      min-width: 0px !important;
      max-width: 500px !important;
      height: 100% ! important;
      min-height: 0px ! important;
      max-height: 500px ! important;
      margin-left: 15px ! important;
      margin-top: 0px ! important;
      padding: 2px 0 100px 90px !important;
      text-align: left !important;
      font-size: 14px!important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 900 ! important;
      background: black !important;
  }

  /* SUB LABEL INFOS */
  #main-article > dl:hover > dt:first-of-type + dd + dt {
      position: absolute !important;
      display: inline-block ! important;
      top: 15px !important;
      margin-left: 90px !important;
  }
  #main-article > dl > dt:first-of-type + dd + dt + dd + dt {
      position: absolute !important;
      display: inline-block ! important;
      top: 30px !important;
      margin-left: 90px !important;
  }
  #main-article > dl > dt:first-of-type + dd + dt + dd + dt + dd + dt {
      position: absolute !important;
      display: inline-block ! important;
      top: 45px !important;
      margin-left: 90px !important;
  }

  /*  "About" - ARROW GRAY */
  #left-sidebar nav ul dl > dd a:not([href^="http://forum.userstyles.org/messages/"]):before,
  #main-article > dl > dd a:not([href^="http://forum.userstyles.org/messages/"]):before {
      position: relative;
      display: inline-block;
      content: "\\25B6 ";
      margin-left: 1px;
      color: red;
  }

  /* ABOUT - LINKS */
  #main-article > dl > dd > a {
      position: relative !important;
      display: inline-block !important;
      min-height: 15px !important;
      max-height: 15px !important;
      line-height: 14px !important;
      font-size: 13px !important;
  }
  /* SEND MESS */
  #main-article > dl:hover > dd > a[href^="http://forum.userstyles.org/messages/add/"] {
      position: fixed !important;
      display: inline-block !important;
      height: 20px !important;
      line-height: 10px !important;
      width: 170px !important;
      top: 28px !important;
      left: 360px !important;
      padding: 1px 10px !important;
      text-align: center !important;
      z-index: 80000 !important;
      visibility: visible !important;
      color: red !important;
      background: yellow !important;
  }
  #main-article > dl:hover > dd > a[href^="http://forum.userstyles.org/messages/add/"]:not(:hover) {
      visibility: hidden !important;
  }
  #main-article > dl:hover > dd > a[href^="http://forum.userstyles.org/messages/add/"]:not(:hover):before,
  #main-article > dl:hover > dd > a[href^="http://forum.userstyles.org/messages/add/"]:hover:before {
      position: absolute !important;
      display: inline-block;
      height: 15px !important;
      width: 22px !important;
      content: "✉";
      left: -25px!important;
      top: 0px !important;
      font-size: 21px !important;
      visibility: visible !important;
      color: peru !important;
  }
  /* USERST -  PROF LINK */
  body:not(#f) a#userProfile {
      position: absolute !important;
      visibility: visible !important;
      left: 256px !important;
      top: -64px !important;
      overflow: visible !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      font-size: 0 !important;
      z-index: 500 !important;
  }
  body:not(#f) a#userProfile:before {
      display: inline-block;
      position: fixed;
      content: url("http://tympanus.net/Development/MegaWebButtonsPack1/images/icons/useradd.png");
      -moz-transform: scale(0.6, 0.5);
      margin-left: -90px;
      top: 1px;
  }

  /* END ==  - USERSTYLES - MY ACCOUNT / USER PROF -  TXT " ABT ME" - TXT + Back transpt */
  /* USERSTYLES - "Following results" - "the results for all ..." */
  #page-description > a {
      border-radius: 5px !important;
      box-shadow: 0 0 4px #999999 !important;
      display: inline-block !important;
      left: 103px !important;
      padding: 5px !important;
      position: absolute !important;
      top: -21px !important;
      width: 994px !important;
  }

  /* ==== USERSTY - SEARCH BOX ==== */
  /* USERSTY - ADV SEARCH - PAGE RESUL */
  /* USERSTY - ADV SEARCH - TOGGLE - SHOW BUTTON / BACK BUTTONS - TABLE VIEW PLUS */
  #advanced-search-submit button {
      -moz-appearance: none ! important;
      position: fixed !important;
      display: inline-block !important;
      width: 62px !important;
      height: 20px !important;
      right: calc(100% - 1202px) ! important;
      top: 1px ! important;
      padding: 0 0 2px 0px ! important;
      border-radius: 4px ! important;
      border: 1px solid #777777 !important;
      font-size: 10px! important;
      text-align: center ! important;
      text-decoration: none ! important;
      cursor: pointer ! important;
      color: #D7D7D7 !important;
      box-shadow: 0 0 1px #777777 inset !important;
      background: linear-gradient(#565555, #000000) repeat scroll 0 0 transparent !important;
  }
  #advanced-search-submit button:hover {
      color: tomato !important;
  }
  /* USERSTYS - ADV SEARCH - SHOW BUTT (TXT "Adv sear)*/
  #left-sidebar nav ul li form #simple-search + #show-advanced-search {
      -moz-appearance: none ! important;
      position: absolute !important;
      display: inline-block !important;
      width: 60px !important;
      height: 18px !important;
      line-height: 15px ! important;
      top: -16px ! important;
      left: 85% ! important;
      font-size: 10px! important;
      border-radius: 4px !important;
      text-align: center ! important;
      text-decoration: none ! important;
      cursor: pointer ! important;
      z-index: 200 ! important;
      color: #D7D7D7 !important;
      box-shadow: 0 0 1px #777777 inset !important;
      background: linear-gradient(#565555, #000000) repeat scroll 0 0 transparent !important;
      border: 1px solid #777777 !important;
  }

  /* USERSTY - AVDV SEARCH - SUBMIT BUTT */
  #left-sidebar nav ul li form.advanced-search-active #advanced-search #advanced-search-submit input {
      -moz-appearance: none ! important;
      position: fixed !important;
      display: inline-block !important;
      width: 50px !important;
      height: 20px !important;
      right: calc(100% - 1138px) ! important;
      top: 1px ! important;
      border-radius: 5px ! important;
      font-size: 10px! important;
      text-align: center ! important;
      text-decoration: none ! important;
      z-index: 200! important;
      cursor: pointer ! important;
      color: gold !important;
      background: black ! important;
      border: 1px gray solid ! important;
  }
  #left-sidebar nav ul li form.advanced-search-active #advanced-search #advanced-search-submit input:hover {
      color: tomato !important;
  }

  /* USERSTY - ADV SEARCH - OPTIONS - BLOCK CONTAINER - PB when No GM "TABLE VIEW PLUS " */
  #advanced-search {
      position: relative ! important;
      position: fixed ! important;
      height: 15px ! important;
      width: 450px ! important;
      top: 48px ! important;
      left: 867px !important;
      padding: 1px 2px 3px 2px ! important;
      border: none ! important;
      border-radius: 0 0 3px 3px !important;
      z-index: 2000000 ! important;
      color: gold !important;
      background: #2C6C14 !important;
  }

  /* USERSTY - SEARCH - TOP Right (Background) */
  #search {
      background-color: transparent !important
  }

  /* USERSTY - SEARCH BOX */
  #search {
      position: fixed !important;
      width: 187px ! important;
      height: 85px ! important;
      top: 400px ! important;
  }

  /* USERSTY - SEARCH BOX INPUT */
  #left-sidebar > nav ul li form {
      position: fixed ! important;
      width: 200px !important;
      margin-top: -8px! important;
      left: 970px ! important;
      top: 25px ! important;
      visibility: visible ! important;
      z-index: 2000! important;
  }

  /* USERSTY - SIMPLE SEARCH - SEARCH INPUT */
  #search-terms {
      position: absolute ! important;
      display: inline-block !important;
      min-width: 204px !important;
      max-width: 204px !important;
      height: 19px ! important;
      margin-right: -50px ! important;
      left: -65px ! important;
      top: -16px ! important;
  }
  /* USERSTY /GREASY - SIMPLE SEARCH - SEARCH BUTT */
  #search-submit {
      position: relative ! important;
      left: -38px ! important;
      margin-top: -15px ! important;
      font-size: 11px !important;
  }
  #script-search > input[type="submit"],
  #search-submit {
      position: relative !important;
      display: inline-block !important;
      top: 0px !important;
      -moz-appearance: none !important;
      border-radius: 0 3px 3px 0 !important;
      cursor: pointer!important;
      background: peru !important;
      border: 1px solid gray !important;
  }
  #script-search > input[type="submit"]:hover,
  #search-submit:hover {
      background: tomato !important;
  }

  /* ====  - USERSTY - STY INFOS - RELATED ==== */
  /* USERSTY - STY INFOS - RELATED - "Relat" etc... - BLOCK */
  #related {
      position: fixed !important;
      width: 185px !important;
      left: 20px !important;
      top: 550px !important;
      background-color: #222222 !important;
      box-shadow: 0 0 4px #999999 !important;
  }
  /* USERSTY - STY INFOS - RELATED - "Relat" etc... - ITEMS */
  #left-sidebar footer#related ul li:not(.more) a:before {
      display: inline-block;
      content: "\\25B6";
      padding-right: 5px;
      font-size: 8px;
      color: red;
  }

  /* ==== USERSTY - STY INFOS ==== */
  /* USERSTY - STY INFOS - "Style" Bar - SUPP */
  #main-article > h2 {
      display: none ! important;
  }

  /* STY INFOS - DELETED STYLE - MESS */
  section#obsoletion-message {
      position: fixed !important;
      line-height: 15px !important;
      min-width: 400px !important;
      max-width: 400px !important;
      max-height: 425px !important;
      top: 35px !important;
      margin-left: -10px!important;
      padding: 10px ! important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 2000 !important;
      transition: all ease 0.7s !important;
      opacity: 1 !important;
      visibility: visible !important;
      background: linear-gradient(#B50000, #640000) repeat scroll 0 0 transparent !important;
  }
  #main-article section#obsoletion-message h2 + p + p,
  #main-article section#obsoletion-message h2 + p {
      display: inline-block !important;
      line-height: 15px !important;
      width: 390px !important;
      margin-left: -10px!important;
      padding: 10px ! important;
      font-size: 17px !important;
      text-align: center !important;
      color: white !important;
  }
  #main-article section#obsoletion-message h2 + p q {
      display: inline-block !important;
      width: 100% !important;
      line-height: 16px !important;
      margin-top: 10px !important;
      margin-bottom: 5px !important;
      padding: 5px !important;
      border-radius: 5px !important;
      text-align: left !important;
      font-size: 15px !important;
      color: gray !important;
      background: black !important;
  }
  #obsoletion-message > p + p > a:last-of-type,
  #main-article section#obsoletion-message h2 + p > a:first-of-type {
      position: relative!important;
      display: inline-block!important;
      width: 100%!important;
      min-width: 375px!important;
      margin-top: 10px !important;
      margin-bottom: 5px !important;
      text-align: center!important;
      font-size: 18px !important;
      color: gold !important;
  }
  #obsoletion-message > p + p > a:nth-last-of-type(n + 2) {
      position: relative!important;
      display: inline-block!important;
      width: 100%!important;
      min-width: 375px!important;
      margin-top: 10px !important;
      margin-bottom: 10px !important;
      text-align: center!important;
      font-size: 15px !important;
      color: gold !important;
  }
  /* USERSTYLES - STY INFOS - DEL STY - BUBBLE */
  #obsoletion-message:not(:hover) h2:not(:hover),
  #obsoletion-message h2 {
      position: fixed !important;
      display: inline-block !important;
      left: 132px !important;
      top: 58px !important;
      border-radius: 10px !important;
      padding: 7px 6px !important;
      cursor: pointer !important;
      visibility: visible !important;
      opacity: 1 !important;
      background: #B50000 !important;
  }
  /* STY INFOS - DEL STY - BUBBLE - ARROW */
  section#obsoletion-message:after {
      position: fixed !important;
      display: block;
      content: "";
      height: 0;
      width: 0;
      top: 82px !important;
      bottom: -15px;
      left: 200px;
      transform: rotate(22deg);
      visibility: visible !important;
      border-style: solid;
      border-width: 25px 5px 0px;
      border-color: #B50000 transparent transparent transparent;
  }
  section#obsoletion-message:before {
      position: fixed !important;
      display: inline-block !important;
      content: " Deleted ....WHY ??? : Hover me !";
      height: 15px !important;
      width: 400px !important;
      top: 62px !important;
      left: 250px;
      text-align: center !important;
      white-space: nowrap !important;
      cursor: pointer !important;
      visibility: visible !important;
      background: #B50000 !important;
  }
  section#obsoletion-message:hover:before {
      visibility: hidden !important;
  }
  #main-article section#obsoletion-message:not(:hover) {
      visibility: hidden !important;
      opacity: 1 !important;
  }
  #main-article section#obsoletion-message:hover {
      visibility: visible !important;
  }
  #main-article section#obsoletion-message > p > q:first-line {
      display: inline-block !important;
      font-size: 18px !important;
      color: #00627A !important;
  }

  /* ==== BROWSE STY - ZEBRA ==== */
  /* BROWSE STY - ZEBRA - FIRST */
  #style-table tr:nth-child(even) td {
      background-color: #262626 !important;
  }
  /* BROWSE STY - ZEBRA - SECOND - ==== */
  #style-table tr:nth-child(odd) td {
      background: #444444 !important;
  }
  #style-table > tr:hover:not(:first-child) {
      background-color: #444444;
      color: red ! important;
  }

  /* RATING always visible =  === */
  #style-table tr:not(:hover) .ratingfg,
  #style-table tr:hover .ratingfg {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAACk0lEQVR42sWWTU8TURSG32ln2qGUUiFt+QwaqUWJDQlhwcJo4g8wbDQad66MCzfGFf4Ad7hy419w4cbEaOLHyq+QSFCIgGAtjRFqKUPpdO7cezwVYtpYCGLSucnkTufO8855z9xzphr2GTR/8iokpbXh+ds4xGgGr+0noD6lHBbQfac/+w4TQDP4PQ2o2dSUZrTfBAGylH+pjy6d+6eHN4nf04CcSSpfeFAD6RA/Z0GubAuOZ7YOGkCz+IYG5IfkC5/ZcRaBXk6FAFkZOFY+Y57JDhzo4U3kNef1wAOjrSVNGiV4vyVIUZBhINgNiB+AXQT8fZBVkVKBM0ECSq0px12pCgTjkbn/5FeYTx6W1+jj0FuEYmMIRLjsW/gK14vLK04OKH9lEcE/WgG9f+dcbMO1y3ArPDvWavh4Iuclr+3uN8fXGjcQ4jdUWuSbCizi8CF2ZlE9WFXyzeYpzkQetpVXnI0T0YvWkpf8bwPu9GCYlCrobXEdZh+wNV0Dip25KhYagbO5DntznUjKdPRSadZr/k8Rcy0kiGg1EE/7IfKciWV2LHYFKnyus/sUit8XiBw5fuTy9pvaYvKKr+tC9qveZ4H22HnN7AGsd6xa497o432nw1rL5jqulHsbdQ8v+DoD5efdX8zO/mPQDKCS5SvcDcjPr/Qbi9hcW13YyCyVY9fcUKMAvODrDJSeJqxQVzIMH687/BW31qDcCowgdwipIO0K1hfmVNcN+BsF4AVfb+BJTIR6hnWRz8IuMCxpmVy3qGx3xGiJwAxHkZtbxNFbjT+AXvB1QluPO0m5CiTV+/aJ4ljt2uo9POSkTFRsaEN3GgfgBV8ntPkoej9yYeM69hkzk5jixjA5ehd//S/xgv8FVOBkHauti1YAAAAASUVORK5CYII=") no-repeat scroll 0 0 rgba(0, 0, 0, 0)!important;
  }

  /* META DISCUSSION - HOVER TOOLTIP */
  #style-table .metadiscussions:hover:before {
      position: relative !important;
      content: attr(title) !important;
      display: inline-block !important;
      height: 16px !important;
      line-height: 15px !important;
      top: -5px !important;
      margin-left: -240px !important;
      padding: 0 5px 0 5px !important;
      border-radius: 5px !important;
      color: gold !important;
      background: red !important;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)!important;
  }

  /* OBSOLETE DELETED STYLE */
  #table-container table#style-table tr.obsolete td:nth-child(7) {
      background-image: url("https://addons.cdn.mozilla.net/media/img/impala/warning-bg.png?b726031") !important;
      opacity: 0.4 !important;
  }
  #table-container table#style-table tr.obsolete td:nth-child(7):hover {
      opacity: 1!important;
  }

  /* BROWSE STY - Text INFO - "For tips on making....etc..."  */
  #main-article > p {
      margin-left: 95px !important;
  }

  /* ==== BROWSE SEARCH RESULTS ==== */
  /* TABLE CONTENT - CONTENT WRAPPER - Table Liste Styles - (CONTROLL THE WIDTH AND POSITION) - (option for : NOT LOGED / NO GM) */
  /*(NOT LOGED / with GM) */
  body > #main-header + #content-wrapper {
      position: absolute ! important;
      float: left !important;
      clear: both !important;
      height: 100% !important;
      min-height: 200px !important;
      width: 100% !important;
      max-width: 95% !important;
      top: 55px !important;
      left: 0px !important;
      margin-left: 20px ! important;
  }

  /* BROWSE SEARCH RESULTS -  USER ACCOUNT / STYLES SEARCH - SEARCH RESULTS */
  #content-wrapper article#main-article #social.listing + script + .ad + #table-container {
      position: absolute !important;
      display: inline-block ! important;
      width: 82%! important;
      left: -27% !important;
      top: -24px !important;
  }

  /* (NOT LOGED / with GM) */
  .author-styles > tbody > tr:nth-child(odd) {
      background: #222 ! important;
  }
  .author-styles > tbody > tr:hover {
      background: #292900 ! important;
  }
  /* USERSTYLES - PROFILE USER */
  #container-responsive .view_inner #iframe[src="/d/users/personal"] {
      display: inline-block !important;
      width: 100% !important;
      text-align: center !important;
  }
  .author-styles.tablesorter.tablesorter-default,
  table.author-styles {
      position: fixed !important;
      display: inline-block !important;
      border-collapse: collapse !important;
      min-width: 99.9% !important;
      max-width: 99.9% !important;
      height: 100% !important;
      min-height: 96vh !important;
      max-height: 96vh !important;
      top: 4vh !important;
      margin-left: -7px !important;
      padding-left: 25vw !important;
      padding-right: 25vw !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      background: #111 !important;
      border-top: 1px solid red !important;
  }
  .author-styles > thead tr,
  .author-styles.tablesorter > thead tr.tablesorter-headerRow {
      position: sticky !important;
      top: 0vh !important;
      text-align: left !important;
      border: 1px solid red !important;
      border-bottom: 4px solid red !important;
      background: black !important;
  }
  .author-styles > thead tr.tablesorter-headerRow th,
  .author-styles.tablesorter > thead tr.tablesorter-headerRow th {
      display: table-cell !important;
      text-align: left !important;
      border: 1px solid red !important;
  }

  /* USERST - USER PROF LIST / BROWSE SEARCH RESULTS - STYLE NAME + LABEL HEADER - INST(Weeks) /INST(Weeks) /Av rating /Most recent disc */
  .author-styles > tbody > tr > td[valign="top"] > a {
      color: #CF9C28 !important;
  }
  .author-styles > tbody > tr > td[valign="top"] > a:visited {
      color: #DDB46D !important;
  }
  .author-styles > tbody > tr > td[valign="top"] > a:hover {
      color: tan !important;
  }
  .author-styles > thead > tr > th:nth-child(3),
  .author-styles > thead > tr > th:nth-child(4),
  .author-styles > thead > tr > th:nth-child(5) {
      width: 43px !important;
  }
  .author-styles > thead > tr > th:nth-child(6) {
      width: 100px !important;
  }
  /* USERSTYLES - EDIT/Del/Stat ICONS */
  table.author-styles tbody tr td + td a:nth-child(1) {
      font-size: 0px ! important;
  }
  /*  NEDD CONVERT for Addstylish lib -  */
  table.author-styles tbody tr td + td a[href$="/edit"]:before {
      content: "\\270E " ! important;
      font-size: 18px ! important;
  }
  table.author-styles tbody tr td + td a:nth-child(2) {
      font-size: 0px ! important;
  }
  table.author-styles tbody tr td + td a[href^="/styles/delete"]:before {
      content: "✅";
      font-size: 18px;
      color: green;
  }
  .obsolete ~ td:last-of-type a[href^="/styles/delete/"]:before {
      content: "➖";
      font-size: 18px;
      color: red;
  }

  /* Text Shadow */
  #style-table tr td * {
      text-shadow: none !important;
  }

  /* BROWSE SEARCH RESULTS - Screenshot POPUP - CONT */
  #popup_container.popup_right,
  #popup_container.popup_left {
      position: fixed !important;
      float: right !important;
      top: 25% !important;
      right: 0% !important;
      padding: 0 !important;
      z-index: -5000 !important;
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
  }
  #popup_container img {
      position: absolute !important;
      float: none !important;
      float: right !important;
      min-width: 30% !important;
      max-width: 30% !important;
      right: 0% !important;
      z-index: 500000 !important;
      box-shadow: 4px 4px 8px #000000;
      border: 1px solid peru !important;
  }

  /* A VOIR - MEDIA QUERIES - BROWSE SEARCH RESULTS - Screenshot POPUP */
  /* BROWSE SEARCH RESULTS - Title === */
  .style-brief-text > header > a:link {
      color: #CCCDCD;
      text-decoration: none;
  }
  /* BROWSE SEARCH RESULTS - Desc */
  .style-brief-text > a:visited {
      color: #929292;
      text-decoration: none;
  }
  .style-brief-text > a:active {
      color: #929292;
      text-decoration: none;
  }

  /* ==== START == PAGI ==== */
  /* AGI - ALL - PB NOT LOGED */
  .pagination {
      position: fixed;
      display: inline-block;
      vertical-align: top;
      max-width: 352px;
      min-width: 352px;
      height: 17px;
      line-height: 10px;
      top: 29px;
      left: 550px;
      padding: 1px;
      border-radius: 3px 3px 0 0;
      text-align: center;
      z-index: 500000;
      border: 1px solid peru;
      background: linear-gradient(to bottom, rgba(19, 19, 19, 1) 0%, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 63%, rgba(0, 0, 0, 1) 98%) repeat scroll 0 0 rgba(0, 0, 0, 0);
  }

  /* PAGI - ALL -  Link */
  .pagination .current,
  .pagination .gap,
  .pagination a {
      display: inline-block;
      position: relative;
      height: 12px;
      line-height: 10px;
      margin-top: 0px;
      top: 0px;
      padding: 0 1px;
      border: none;
      border-radius: 3px;
      font-size: 10px;
      box-shadow: 3px 3px 2px black;
      background: #222 !important;
  }
  .pagination > a {
      margin-left: -1px;
      margin-right: -1px;
      padding: 0 3px !important;
      border: 1px solid #999;
  }
  .pagination > a:hover {
      border: 1px solid #A7A7A7;
      background-color: white !important;
  }
  .current {
      margin-left: 1px;
      margin-right: 1px;
      padding: 0 3px;
      border-radius: 3px;
      font-size: 14px !important;
      text-decoration: none;
      border: 1px solid #336699;
      background-color: #F5F7FA;
  }
  .pagination .gap {
      line-height: 15px !important;
      top: -3px;
      margin-right: -5px;
      margin-left: -5px;
      padding: 0;
      font-size: 10px;
      border-radius: 3px;
  }
  .pagination .current,
  .pagination .gap {
      color: white;
  }
  .next_page {
      display: inline-block;
      width: 80px;
  }
  .pagination > a.next_page,
  .pagination > a.next_page:hover,
  .pagination > a.previous_page,
  .pagination > a.previous_page:hover {
      width: 20px;
      font-size: 0px;
  }
  .previous_page:before {
      content: "<";
      font-size: 10px;
  }
  .next_page:before {
      content: ">";
      font-size: 10px;
  }
  .previous_page.disabled,
  .disabled.prev_page,
  .next_page.disabled {
      display: none;
  }
  span.Ellipsis {
      height: 14px;
      line-height: 7px;
      border-radius: 3px;
      box-shadow: 3px 3px 2px black;
      color: peru;
  }

  /* PAGI USERST - GM " TA VIEW P " */
  #table-container + .pagination {
      line-height: 13px;
      top: 32px;
      left: 450px;
      padding: 1px;
  }
  /* USERS */
  #content-wrapper #main-article .pagination > .current {
      margin-top: 0px;
      top: 0px;
      color: white;
  }

  /* PAGI - SEARCH/USERS - List USERST */
  .ad + .pagination {
      position: fixed;
      display: inline-block;
      height: 20px;
      width: 100%;
      width: auto;
      max-width: 600px;
      min-width: 600px;
      left: 270px;
      top: 35px;
      padding: 1px 5px;
      z-index: 500000;
  }
  /* PAGI - SCRIPT PAGE (with/without CITRUS) */
  #script-table + .pagination,
  .width-constraint .pagination {
      max-width: 352px !important;
      min-width: 352px !important;
      top: 39px;
      left: 56.4%;
      border: 1px solid peru;
  }
  /* PAGI - SCRIPT INFO - NEW DESIGN */
  .width-constraint #script-info ul#script-links + header + #script-content > p#contribution + h3 {
      position: fixed;
      display: inline-block;
      vertical-align: bottom;
      width: 51%;
      height: 17px;
      line-height: 17px;
      top: 187px;
      left: 24.6%;
      border-radius: 3px 3px 0 0;
      text-align: left;
      z-index: 500000;
      box-shadow: none;
      border: 1px solid peru;
      border-bottom-color: red;
      background: gold;
  }
  .width-constraint section#script-info ul#discussions + .pagination {
      top: 217px;
  }
  .width-constraint #script-info #script-content p#support-url + h3 + p + ul#discussions + .pagination {
      top: 217px;
      left: 51.2%;
      z-index: 500000;
  }

  /* PAGI SET - CITRUS ONLY OK */
  #UserSets + .width-constraint .pagination {
      position: fixed;
      display: inline-block;
      max-width: 550px;
      min-width: 550px;
      height: 15px;
      line-height: 15px;
      top: 49px;
      left: 34%;
      padding: 1px;
      border-radius: 5px;
      text-align: center;
      box-shadow: none;
      background: transparent;
  }
  /* PAGI - SCRIPT PAGE - CITRUS */
  #script-table + .pagination {
      position: fixed;
      display: inline-block;
      width: 100%;
      max-width: 459px;
      min-width: 459px;
      height: 15px;
      height: 17px;
      line-height: 10px;
      top: 39px !important;
      left: 56.4%;
      padding: 1px;
      border-radius: 3px 3px 0 0;
      text-align: center;
      z-index: 500000 !important;
      box-shadow: 0 0 4px #999;
      background: linear-gradient(to bottom, rgba(19, 19, 19, 1) 0%, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 63%, rgba(0, 0, 0, 1) 98%) repeat scroll 0 0 rgba(0, 0, 0, 0);
  }

  /* === END == PAGI === */
  /* ==== EDIT PAGE ==== */
  /* (new208) TEST  - IFRAME */
  .PageContent iframe[src$="/edit"],
  .PageContent iframe[src="/d/styles/new"] {
      width: 99% !important;
      min-height: 99vh !important;
      max-height: 99vh !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      background: #111 !important;
  }

  /* USERST - INFOS - Textarea Input === */
  .init_loader + .PageContent > ul {
      position: absolute;
      width: 16vw !important;
      padding: 5px 20px !important;
      background: #222 !important;
  }

  /* (new208) */
  .PageContent form[action="/styles/update"] {
      display: inline-block !important;
      min-width: 940px !important;
      max-width: 940px !important;
      margin-left: 0% !important;
      height: 100% !important;
      max-height: 90vh !important;
      min-height: 90vh !important;
      padding: 0 25vw !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      background: #111 !important;
  }
  .PageContent form[action="/styles/update"] .form-controls {
      min-width: 840px !important;
      max-width: 940px !important;
      margin-left: 0% !important;
      margin-bottom: 8px !important;
      padding-left: 5px !important;
  }
  .PageContent form[action="/styles/update"] .form-controls > div > a,
  .PageContent form[action="/styles/update"] .form-controls textarea#css,
  .PageContent form[action="/styles/update"] .form-controls .field_with_errors textarea#style_additional_info,
  .PageContent form[action="/styles/update"] .form-controls textarea#style_long_description {
      min-width: 800px !important;
      max-width: 900px !important;
      margin-left: 2% !important;
  }
  .PageContent .form-controls > table,
  .PageContent .form-controls > table tbody {
      display: inline-block !important;
      width: 100% !important;
      min-width: 920px !important;
      max-width: 920px !important;
      margin-left: 0% !important;
  }
  .PageContent .form-controls > table tbody tr td,
  .PageContent .form-controls > table tbody tr {
      display: inline-block !important;
      width: 100% !important;
      min-width: 840px !important;
      max-width: 840px !important;
      margin-left: 5% !important;
      padding: 5px !important;
  }
  .PageContent .form-controls > table tbody tr td {
      margin-left: 0% !important;
      padding: 0px !important;
  }
  .PageContent .form-controls > table tbody tr td img {
      display: inline-block !important;
      width: 100% !important;
      min-width: 420px !important;
      max-width: 420px !important;
      margin-left: 0% !important;
      padding: 0px !important;
  }

  /* USERST - INFOS - SHORT DESC */
  .form-controls > tbody > tr > td [id="style_short_description"] {
      min-width: 200px!important;
      resize: both !important;
      overflow: auto !important;
  }
  /* USERST - NFOS - ScShots (PreView) - Principal - BEFORE/AFTER */
  .form-controls > tbody > tr > td > dl > dd > img {
      box-shadow: 0 0 4px #999999 !important;
      height: auto;
      margin-left: 200px !important;
      max-width: 900px !important;
  }
  .form-controls > tbody > tr > td > dl > dd {
      margin-left: -169px !important;
  }
  /* USERST - INFOS - ScShots (PreView) - Additional */
  .form-controls > tbody > tr > td > table > tbody > tr > td > img {
      box-shadow: 0 0 4px #999999 !important;
      height: auto;
      max-width: 900px !important;
  }
  /* USERST - INFOS - ScShots - Additional (Table) */
  .form-controls > tbody > tr > td > table {
      margin-left: -149px !important;
  }
  /* USERST - EDIT - EDIT - MAIN CONT */
  #main-article > form[method="post"]:not([action="/help/widget"]):not([action="/styles/delete_save"]) {
      position: absolute !important;
      display: inline-block !important;
      max-width: 800px !important;
      margin-top: 35px ! important;
      margin-left: 5% ! important;
  }

  /* USERST - EDIT - EDIT - WIDGET */
  #main-article > form[action="/help/widget"] {
      position: relative !important;
      display: table !important;
      min-width: 910px !important;
      max-width: 910px !important;
      margin-top: 3px ! important;
      margin-left: -3px ! important;
      background: #222 !important;
  }
  #main-article > form[action="/help/widget"] .form-controls {
      min-width: 910px !important;
      max-width: 910px !important;
  }
  #main-article > form[action="/help/widget"] .form-controls tbody tr {
      display: inline-block !important;
      width: 100% !important;
      min-width: 910px !important;
      max-width: 910px !important;
      margin-bottom: 0px !important;
      text-align: center !important;
  }
  #main-article > form[action="/help/widget"] .form-controls tbody tr td,
  #main-article > form[action="/help/widget"] .form-controls tbody tr th {
      display: inline-block !important;
      min-width: 870px !important;
      max-width: 870px !important;
      padding: 0 !important;
      text-align: center !important;
  }

  /* USERST - EDIT - DEL STYLE */
  #main-article > form[action="/styles/delete_save"] {
      position: absolute !important;
      display: inline-block !important;
      max-width: 800px !important;
      min-height: 400px !important;
      margin-top: 100px !important;
      margin-left: -55% !important
  }
  #main-article > form[action="/styles/delete_save"] .form-controls > tbody > tr:first-of-type > td textarea {
      min-height: 400px !important;
  }

  /* USERST - EDIT - STY NAME INPUT */
  article#main-article form .form-controls input#style_short_description {
      width: 600px !important;
  }
  /* USERST - EDIT - SCSHOT NAME/UPL FOLDER/BUT INPUT */
  article#main-article form .form-controls table tbody tr td:not(:last-of-type) {
      display: block !important;
      position: relative !important;
      width: auto !important;
  }
  .form-controls > table > tbody > tr > td:first-of-type > input {
      width: 462px !important;
  }
  .form-controls > table > tbody > tr > td:nth-child(2) > input {
      width: 465px !important;
  }
  /* USERSTYLES - EDIT - CHECK BOX (REMOVE/CHANGE) */
  .form-controls > table > tbody > tr > td:nth-child(3) > input {
      position: absolute !important;
      top: -20px !important;
  }
  .form-controls > table > tbody > tr > td:nth-child(3):after {
      position: absolute;
      display: inline-block;
      content: "Remove / Change";
      width: 200px;
      height: 15px;
      margin-top: -32px;
      margin-left: 45px;
      font-size: 15px;
      color: red;
  }
  /* USERSTS - EDIT - LABELS */
  .form-controls > label {
      color: gold ! important;
  }
  /* USERST  - EDIT - SCSHOT - TITLES SECT */
  .form-controls > table > thead > tr {
      display: none ! important;
  }

  /* [[1]==== END ==== */
  /* ==== NOT LOGGED - 3 SMALLS BLOCKS  by Rows (BROWSE/SEARCH PAGEs) + 2 BIG and 3 SMALLS BLOCKS for ACCOUNT NOT LOGED and NO SCRIPT */
  .listing-left-info {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      min-height: 100px;
      width: 100% !important;
  }

  /* NOT LOGGED - ALL INFOS CONTAINER - BIG + ODD + EVEN */
  .style-brief:nth-child(odd) {
      background: #222222 !important;
  }

  /*  NOT LOGGED - INFOS CONTAINER - SMALL > BIG + ODD + EVEN */
  .style-brief {
      position: relative ! important;
      display: inline-block ! important;
      width: 32.72% !important;
      height: 163px ! important;
      right: 0% ! important;
      margin-top: 6px !important;
      margin-bottom: 0px !important;
      overflow: hidden ! important;
      border-radius: 5px !important;
      box-shadow: 6px 5px 6px black !important;
      border: 1px solid gray ! important;
  }
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(-n + 4),
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(n + 11) {
      position: relative ! important;
      float: left !important;
      width: 49.6% !important;
      height: 224px ! important;
      right: 7.7% ! important;
      margin-top: 6px !important;
      margin-bottom: 0px !important;
      border-radius: 5px !important;
      overflow: hidden ! important;
      box-shadow: 6px 5px 6px black !important;
      border: 1px solid gray ! important;
  }
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(-n + 4) .style-brief-text,
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(n + 11) .style-brief-text {
      left: 180px;
  }

  /* NOT LOGGED - STYLES INFOS */
  .style-brief-text {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      height: 150px ! important;
      width: 100% !important;
      max-width: 67% !important;
      margin-left: 10% !important;
      left: 119px;
      top: 2px !important;
  }

  /* NOT LOGGED - TEXT DESC - ALL + ODD/EVEN */
  .style-brief-control-links:before {
      content: "⏪ " !important;
      position: absolute !important;
      width: 20px !important;
      height: 17px !important;
      line-height: 17px !important;
      left: -10px;
      z-index: 500;
      color: gold !important;
      background: green !important;
  }
  .style-brief-control-links:hover:before {
      content: "⏩ " !important;
      position: absolute !important;
      width: 20px;
      left: -20px;
      text-align: center;
      z-index: 500;
      color: white !important;
  }
  .style-brief-control-links {
      position: absolute !important;
      padding-top: 0 !important;
      width: 10px !important;
      right: -12px;
      top: 22px;
      color: peru !important;
      white-space: nowrap !important;
      z-index: 500;
  }
  .style-brief-control-links:hover {
      width: auto !important;
      right: 0px;
      z-index: 500;
      color: peru !important;
      background: green !important;
  }
  .style-brief-control-links a:hover {
      color: tomato !important;
      background: black !important;
  }
  .style-brief-text > p::first-line {
      color: red !important;
  }
  .style-brief-text > p {
      position: absolute !important;
      display: inline-block !important;
      width: 81.5% !important;
      height: 115px !important;
      left: 87px;
      top: 25px !important;
      margin: 0 auto !important;
      padding: 0 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      white-space: pre-line !important;
  }

  /* NOT LOGGED - TEXT DESC - BIG */
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(-n + 4) .style-brief-text > p,
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(n + 11) .style-brief-text > p {
      width: 90.5% !important;
      height: 178px !important;
      left: 37px;
      top: 24px !important;
      padding: 0 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }

  /* NOT LOGGED - STYLES NAME - ALL - SMALL (RESIZE WITH THE SIZE OF THE SCREEN : UNITE TXT in 0.82vw) */
  .style-brief header {
      font-size: 0.89vw !important;
      position: absolute !important;
      display: inline-block ! important;
      width: 150% !important;
      height: 100% !important;
      min-height: 25px ! important;
      max-height: 25px ! important;
      line-height: 25px !important;
      top: -3px !important;
      left: -49.5% !important;
      padding-bottom: 0px ! important;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      text-align: center !important;
  }
  .style-brief-text > header > a:link {
      position: relative !important;
      display: inline-block ! important;
      width: 100% !important;
      left: 0px!important;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      background: black !important;
  }
  /* NOT LOGGED - STYLES NAME - BIG */
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(-n + 4) header,
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(n + 11) header {
      font-size: 1.1vw !important;
  }

  /* NOT LOGGED - STATS */
  .style-brief-stats {
      position: absolute !important;
      float: right!important;
      height: 16px !important;
      line-height: 16px !important;
      width: 100% !important;
      right: 0px !important;
      left: 0%! important;
      bottom: -12px !important;
      padding: 2px 0 2px 12px !important;
      text-align: left !important;
      background: black ! important;
  }
  .style-brief-stats span {
      display: inline !important;
      min-width: 16em;
      margin-right: 10px !important;
      margin-left: 10px !important;
      padding: 1px !important;
      color: tan !important;
      border: 1px solid gray;
  }

  /* NOT LOGGED - RAT - SMALL - ICON css OR SPRITE */
  .style-brief-text .style-brief-stats span:last-child {
      position: absolute !important;
      left: -5px !important;
      min-width: 10px !important;
      max-width: 10px !important;
      min-height: 16px !important;
      max-height: 16px !important;
      line-height: 16px !important;
      padding: 0 3px 0 15px !important;
      border: none !important;
      cursor: pointer !important;
      font-size: 0 !important;
  }
  .style-brief.no-rating .style-brief-text .style-brief-stats span:last-child:before {
      content: ". ";
      position: absolute;
      display: inline-block;
      left: 0;
      min-width: 19px;
      max-width: 19px;
      min-height: 14px;
      max-height: 15px;
      line-height: 15px;
      margin-top: -1px;
      font-size: 15px;
      color: transparent;
      background-image: url(http://s.ytimg.com/yts/imgbin/www-hitchhiker-vflKGt6Qu.png);
      background-position: -101px -457px;
  }
  .style-brief-text .style-brief-stats span:hover:last-child {
      position: absolute !important;
      min-width: 100% !important;
      height: 15px !important;
      line-height: 15px !important;
      font-size: 11px !important;
      color: gold !important;
      background: black !important;
  }
  /* ICON RAT - GOOD/BAD */
  .style-brief-stats .bad-average-rating {
      position: absolute !important;
      left: -2px !important;
      top: 2px !important;
  }
  .style-brief.good-rating .style-brief-stats img {
      position: absolute !important;
      left: -2px !important;
  }
  /* NOT LOGGED - RAT - BIG */
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(-n + 4) .style-brief-stats,
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(n + 11) .style-brief-stats {
      position: absolute !important;
      float: left !important;
      width: auto !important;
      left: 4px !important;
      bottom: -72px !important;
      right: 0 !important;
      padding: 2px 0 0 4% !important;
      font-size: smaller !important;
      text-align: left !important;
      background: black !important;
  }

  /* NOT LOGGED - STYLES SCSHOT - ALL */
  .style-brief .listing-left-info figure.screenshot-thumbnail {
      position: relative !important;
      display: inline-block ! important;
      vertical-align: top ! important;
      margin-top: 28px ! important;
      margin-bottom: 0 ! important;
      width: 42% !important;
      height: 265px;
      max-height: 130px !important;
      min-height: 130px !important;
      overflow-y: hidden ! important;
      text-align: center ! important;
  }
  /* for small screenshot */
  .style-brief .listing-left-info figure.screenshot-thumbnail img {
      position: relative !important;
      display: inline-block !important;
      max-width: 77% !important;
      max-height: 128px !important;
      border: 1px dotted gray !important;
  }
  /* NOT LOGGED - SCRSHOT - BIG */
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(-n + 4) .listing-left-info figure.screenshot-thumbnail,
  #content-wrapper article#main-article dl + h2 ~ article.style-brief:nth-child(n + 11) .listing-left-info figure.screenshot-thumbnail {
      position: relative !important;
      display: inline-block !important;
      vertical-align: middle !important;
      max-height: 195px !important;
      min-height: 195px !important;
      width: 36.5% !important;
      margin-top: 25px !important;
      margin-left: 0.3% !important;
      text-align: center !important;
      overflow-y: hidden !important;
  }
  /* NOT LOGGED - NO SCRSHOT */
  .style-brief .listing-no-screenshot {
      width: 30% !important;
      margin: 27px 0 0 3px !important;
  }
  .listing-no-screenshot {
      width: 70% !important;
      height: 110px !important;
      background-color: black !important;
  }
  /* GM "AUTOPAGERIZE" - ALL - OK */
  .autopagerize_page_info {
      text-align: center !important;
      font-size: 8px !important;
      color: white !important;
      background: #222 !important;
  }
  .autopagerize_page_info a {
      display: inline-block !important;
      min-width: 20px !important;
      height: 20px !important;
      line-height: 20px !important;
      margin-top: 3px !important;
      border-radius: 100% !important;
      text-align: center !important;
      font-size: 14px !important;
      color: white !important;
      background: red !important;
  }

  /* GM "AUTOPAGERIZE" - 2 FIRST USERST by PAGE - DISABLE */
  /* GM "AUTOPAGERIZE - DISABLE  */
  .autopagerize_page_info ~ article.style-brief {
      position: relative ! important;
      display: inline-block ! important;
      width: 32.72% !important;
      height: 163px ! important;
      right: 7.5% ! important;
      margin-top: 6px !important;
      margin-bottom: 0px !important;
      border-radius: 5px !important;
      overflow: hidden ! important;
      box-shadow: 6px 5px 6px black !important;
      border: 1px solid gray ! important;
  }

  /* GM "AUTOPAGERIZE" ADAPTATION */
  #content-wrapper article#main-article dl + h2 ~ .autopagerize_page_separator {
      display: inline-block !important;
      clear: both;
      width: 100% !important;
      top: 5px !important;
      margin-left: -75px !important;
      margin-bottom: -15px !important;
  }
  #content-wrapper article#main-article dl + h2 ~ .autopagerize_page_info {
      width: 100% !important;
      margin-left: -145px !important;
      top: 5px !important;
      font-size: 8px !important;
      text-align: center !important;
      color: white !important;
      background: #222 !important;
  }
  #content-wrapper article#main-article dl + h2 ~ .autopagerize_page_separator ~ .style-brief .listing-left-info figure.screenshot-thumbnail {
      display: inline-block !important;
      height: 265px;
      margin-bottom: 0 !important;
      margin-top: 28px !important;
      max-height: 160px !important;
      min-height: 160px !important;
      overflow-y: hidden !important;
      position: relative !important;
      text-align: left !important;
      vertical-align: top !important;
      width: 42% !important;
  }
  #content-wrapper article#main-article dl + h2 ~ .autopagerize_page_separator ~ .style-brief .style-brief-text {
      display: inline-block !important;
      height: 150px !important;
      margin-left: 10% !important;
      max-width: 67% !important;
      position: relative !important;
      top: 2px !important;
      width: 100% !important;
  }
  #content-wrapper article#main-article dl + h2 ~ .autopagerize_page_separator ~ .style-brief .style-brief-text > header > a:link {
      background: black none repeat scroll 0 0 !important;
      display: inline-block !important;
      left: 0 !important;
      overflow: hidden !important;
      position: relative !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      width: 100% !important;
  }
  #content-wrapper article#main-article dl + h2 ~ .autopagerize_page_separator ~ .style-brief .style-brief-stats {
      position: absolute !important;
      float: right !important;
      width: 100% !important;
      height: 16px !important;
      line-height: 16px !important;
      margin-bottom: 61px !important;
      bottom: -12px !important;
      right: 0 !important;
      left: 0 !important;
      padding: 2px 0 2px 12px !important;
      text-align: left !important;
      background: black !important;
  }
  /* GM "AUTOPAGERIZE - 2 USERTYLES BY ROW - ENABLE OK  */
  #content-wrapper article#main-article dl + h2 ~ article.style-brief ~ .autopagerize_page_separator ~ .style-brief .style-brief-text .style-brief-stats {
      position: absolute !important;
      float: left !important;
      width: auto !important;
      left: 0px !important;
      bottom: -132px !important;
      padding: 2px 0 0 4% !important;
      font-size: smaller !important;
      text-align: left !important;
      background: black !important;
  }
  #content-wrapper article#main-article dl + h2 ~ article.style-brief ~ .autopagerize_page_separator ~ .style-brief .style-brief-text > p {
      position: relative !important;
      display: inline-block !important;
      width: 97% !important;
      min-height: 185px !important;
      max-height: 185px !important;
      top: 12px !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      padding: 0 5px !important;
  }


  /* [[2]==== END ==== */
  /* [[1]] +[[2]==== END ==== */
  /* ======== NEW FORUM ==== */
  /* USER NAME - WITHOUT USER ICON - VOIR PB GREASY FORK: USER WITHOUT ICON */
  .UserBox .WhoIs,
  .MeBox .WhoIs {
      position: relative;
      display: inline-block;
      width: 200px;
      height: 100px;
      padding: 0 5px 2px 0;
      border-radius: 5px;
      text-align: center;
      border: 1px solid gray;
  }
  /* With USER ICON */
  .MeBox > .PhotoWrap[href*="/profile/"] + .WhoIs,
  .UserBox > .PhotoWrap[href*="/profile/"] + .WhoIs {
      position: relative;
      display: inline-block;
      width: 196px;
      height: 100px;
      left: 0px;
      margin-top: -55px;
      padding: 0 0px 2px 0;
      border-radius: 5px;
      text-align: center !important;
      box-shadow: 3px 3px 2px black;
      border: 1px solid gray;
  }
  .UserBox a.Username:before,
  .MeBox a.Username:before {
      content: url("http://tympanus.net/Development/MegaWebButtonsPack1//images/icons/user.png");
      position: relative;
      display: inline-block;
      width: 157px;
      margin-left: 0;
      padding: 0 2px 2px 2px;
      transform: scale(1.2, 1);
      border-radius: 5px 5px 0 0;
      text-align: center;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0);
  }
  .UserBox {
      margin-top: 28px !important;
  }
  .MeMenu {
      width: 195px !important;
      line-height: 24px;
      margin-top: 5px ! important;
      margin-bottom: -2px ! important;
      border-radius: 0 0 5px 5px !important;
      background: linear-gradient(to bottom, rgba(19, 19, 19, 1) 0%, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 63%, rgba(0, 0, 0, 1) 98%) repeat scroll 0 0 rgba(0, 0, 0, 0) !important;
  }
  .FlyoutMenu {
      width: 300px;
      border: 1px solid #999;
      color: gray !important;
      box-shadow: 3px 3px 2px black !important;
      background: #222 !important;
  }
  .PopList.Activities li.Item:nth-child(odd) {
      background: #333 !important;
  }
  .FlyoutMenu .ItemContent.Activity > a[href*="/forum/profile/"],
  .FlyoutMenu .ItemContent.Activity > a + a {
      display: inline-block;
      width: 100% !important;
      text-align: left !important;
  }
  .FlyoutMenu .ItemContent.Activity > a[href*="/forum/profile/"] {
      text-indent: 25px !important;
  }
  /* ALL HEADER - BACKG COLOR */
  #Head {
      background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2%, rgba(17, 17, 17, 1) 37%, rgba(51, 51, 51, 1) 100%, rgba(19, 19, 19, 1) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)!important;
  }
  /* CITRUS - FORUM HEADR + FORUM EDIT POST - ADPT for GM "GREASY FORK TABLE VIEW" */
  #Form_Body {
      display: inline-block ! important;
      height: 133px;
      max-width: 660px !important;
      min-width: 660px !important;
      overflow: hidden;
  }
  body > #Frame > .Head {
      position: fixed !important;
      width: 100% !important;
      max-height: 41px ! important;
      min-height: 41px !important;
      top: 0px !important;
      padding-top: 7px ! important;
      z-index: 50 !important;
      border-bottom: 1px solid #828182 !important;
      box-shadow: 0 0 9px 0 #000000 !important;
  }
  /* CI - SITE TIT " GREASY FOR" + ICON */
  .SiteTitle {
      position: relative!important;
      display: inline-block !important;
      top: -5px !important;
      font-size: 24px ! important;
  }
  /* FORUM USERST TITLE */
  #Head .SiteTitle a {
      position: relative !important;
      display: inline-block!important;
      min-width: 250px !important;
      max-width: 250px !important;
      margin-left: -105px ! important;
      text-align: right ! important;
      font-size: 19px !important;
  }
  .SiteTitle > a img {
      position: absolute ! important;
      max-height: 40px !important;
      width: 40px !important;
      margin-left: -60px ! important;
      margin-top: -5px !important;
  }
  /* SITE MENU - CITRUS */
  #Head a {
      font-weight: bold ! important;
  }
  .SiteMenu a {
      font-size: 14px ! important;
      padding: 6px;
  }
  /* SEARCH - FOR/WITHOUT CIT */
  #Head .SiteSearch {
      float: right !important;
      margin-top: -5px !important;
      margin-right: 6.5% !important;
  }
  .MeBox + .SiteSearch {
      margin-top: 25px !important;
  }
  .SiteSearch > form {
      height: 21px !important;
  }
  .SiteSearch > form div {
      height: 21px !important;
  }
  .SiteSearch > form div .InputBox {
      height: 21px !important;
      font-size: 11px;
      padding: 2px 25px 2px 5px!important;
  }
  .SiteSearch > form div input.Button {
      height: 15px !important;
  }
  /* GREAS/USERST - FORUM */
  #Body {
      max-width: 980px;
      padding: 14px 0 0 10px;
      margin: 14px auto auto;
      border-radius: 0;
      box-shadow: none;
      border: 1px solid #bbbbbb;
      background-color: transparent;
  }
  #Head + #Body {
      margin-top: 61px;
  }
  /* USERST */
  #Body .Row {
      display: inline-block;
      width: 980px;
      margin-top: 24px;
  }
  /* GREAS - VOIR FORUM USERST */
  .DiscussionAboutShowDiscussion {
      position: fixed;
      display: inline-block;
      height: 34px;
      line-height: 10px;
      max-width: 200px;
      min-width: 200px;
      top: 53px;
      padding: 2px 5px;
      border-radius: 0 0 0 5px;
      text-align: left;
      overflow: hidden;
      font-size: 9px;
      transform: translate(-210px, 0px);
      z-index: 500;
      color: gold;
      background-color: #222;
  }
  .DiscussionAboutShowDiscussion > a {
      display: inline-block;
      max-height: 25px;
      line-height: 15px;
      max-width: 195px;
      min-width: 195px;
      padding: 2px;
      border-radius: 3px;
      text-align: left;
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  .DiscussionAboutShowDiscussion + img {
      position: fixed;
      display: inline-block;
      margin-left: -25px;
      top: 56px;
      z-index: 500;
  }
  .DiscussionAboutShowDiscussion + img.rating-image {
      position: fixed;
      display: inline-block;
      margin-left: -45px;
      top: 75px;
      z-index: 500;
  }
  /* GREAS/USERT FORUM - PANEL LEFT - ALL */
  #Panel.Column.PanelColumn {
      position: fixed;
      display: inline-block;
      width: 200px;
      margin-top: 90px;
      top: 0px;
      z-index: 100;
      border-top: 1px solid red;
  }
  #Panel.Column.PanelColumn .MeBox {
      position: relative;
      display: inline-block;
      width: 198px;
      margin-top: -30px;
      bottom: -32px;
      padding: 0;
      box-shadow: none;
      background-color: #222;
  }
  .Profile .MeBox {
      display: none;
  }
  .Profile .Box.GuestBox {
      position: relative;
      top: -407px;
      padding: 0 3px;
      background: black;
  }
  .BoxFilter.BoxDiscussionFilter,
  .SiteSearch {
      box-shadow: 3px 3px 2px black;
  }
  #vanilla_post_discussion .SiteSearch,
  #vanilla_post_editdiscussion .SiteSearch {
      top: 27px;
  }
  .UserBox .Username,
  .MeBox .Username {
      font-size: 23px;
      vertical-align: top;
      color: peru;
  }
  .Button.BigButton.NewConversation.Primary {
      margin-top: 28px;
  }
  /* Forum Userst - LEFT PANEL - BOX FILTER */
  #Panel .FilterMenu,
  #Panel .PanelCategories {
      border-radius: 5px;
      box-shadow: 3px 3px 2px black;
      border: 1px solid #bbbbbb;
      background-color: #222;
  }
  .Box.BoxCategories,
  #Panel .BoxFilter {
      margin: 10px 0;
  }
  .Column.PanelColumn .MeBox + .BoxFilter.BoxProfileFilter {
      margin-top: 65px;
  }
  /* DISCU COMM */
  /* GREAS */
  #Item_0 {
      position: fixed;
      display: inline-block !important;
      width: 100%;
      min-width: 40px;
      max-width: 40px;
      height: 37px;
      vertical-align: top;
      top: 53px;
      text-align: center;
      z-index: 0;
      color: gold;
      background-color: black;
  }
  .ToggleFlyout.OptionsMenu {
      display: inline-block;
      height: 14px;
      width: 28px;
      left: -15px;
      margin-right: -23px;
      top: -9px;
  }
  /* EDIT */
  #Item_0 .ToggleFlyout.OptionsMenu {
      display: inline-block;
      height: 22px;
      line-height: 22px;
      width: 22px;
      left: 18px;
      margin-right: -23px;
      top: 0px;
      transform: scale(0.8);
      border: 1px solid red;
  }
  .Flyout::before,
  .Flyout::after {
      display: none;
  }

  /* USERTY/GREAS OK */
  .MessageList.Discussion {
      margin-top: 42px;
  }
  /* GREAS/USERST FORUM */
  #Item_0 > h1,
  .MessageList.Discussion h1,
  .Discussion .PageTitle h1,
  .MessageList.Discussion #Item_0.PageTitle h1,
  .Discussion.comment.Section-Discussion .Discussion h1,
  .Section-Discussion.Section-Category-script-requests .Discussion .PageTitle h1 {
      position: fixed;
      display: inline-block;
      height: 38px;
      line-height: 18px;
      width: 100%;
      min-width: 720px;
      max-width: 720px;
      top: 47px;
      padding-left: 20px;
      font-size: 15px;
      text-align: left;
      z-index: 0;
      background-color: black;
  }
  /* USERST FORUM - OK */
  #vanilla_discussion_index.Vanilla.Discussion.Section-Discussion.Section-Category-style-development .MessageList.Discussion #Item_0.PageTitle h1,
  #vanilla_discussion_index.Vanilla.Discussion.Section-Discussion .MessageList.Discussion #Item_0.PageTitle h1 {
      width: 100%;
      min-width: 719px;
      max-width: 719px;
      padding-left: 20px;
  }
  /* USERST - DISC LAST PAGE */
  .MessageList.Discussion .PageTitle .Options {
      display: inline-block;
      height: 37px;
      width: 40px;
      z-index: 5000;
  }
  .MessageList.Discussion .PageTitle .Options .Hijack.Bookmark {
      display: inline-block;
  }
  .MessageList.Discussion #Item_0.PageTitle + img.rating-image {
      position: fixed;
      display: inline-block;
      margin-top: -47px;
      margin-left: 0px;
      z-index: 5000;
  }

  /* ========== */
  a.Bookmark,
  a.Bookmarked,
  a.Bookmarking {
      margin-left: -5px;
      margin-right: 9px;
  }
  #Item_0.PageTitle .Options .Hijack.Bookmark {
      position: relative;
      display: inline-block;
      margin-left: -14px;
      margin-top: 1px;
      z-index: 5000;
  }
  /* GREASY SPRITE UI */
  .Hijack.Bookmark[title="Bookmark"] {
      background: url("https://greasyfork.org/forum/applications/dashboard/design/images/ui_sprites.png") no-repeat scroll 0 -63px rgba(0, 0, 0, 0);
  }
  .Hijack.Bookmark.Bookmarked {
      background: url("https://greasyfork.org/forum/applications/dashboard/design/images/ui_sprites.png") no-repeat scroll 0 -83px rgba(0, 0, 0, 0);
  }

  /*  BOOKM LIST */
  .ItemDiscussion span.Options .ToggleFlyout.OptionsMenu + a.Hijack.Bookmark,
  .ItemDiscussion span.Options a.Hijack.Bookmark {
      position: relative;
      display: inline-block;
      left: 10px;
      top: 2px;
  }
  .ItemDiscussion span.Options a.Hijack.Bookmark:not(.Bookmarked) {
      background: url("https://greasyfork.org/forum/applications/dashboard/design/images/ui_sprites.png") no-repeat scroll 0 -2px rgba(0, 0, 0, 0)
  }
  /* PROFILE - NOTIF */
  #dashboard_profile_discussions.Dashboard.Profile.discussions.Section-Profile.js-focus-visible.editor-active .Options .Bookmark {
      position: relative;
      display: inline-block;
      top: 6px;
      left: 10px;
  }
  /* GREAS/USERST - DISC */
  .MessageList.Discussion .Discussion {
      width: 96%;
      margin-top: 0px;
      padding: 10px 10px;
      border: 1px solid gray;
      border-top: 1px solid peru;
  }
  .MessageList.Discussion .Discussion .Item-BodyWrap,
  .MessageList.Discussion .Discussion .Item-Header {
      width: 100%;
  }
  /* USERST */
  #vanilla_discussion_index.Section-Discussion .BreadcrumbsWrapper + .Column.PanelColumn + #Content.Column.ContentColumn .MessageList.Discussion #Item_0.PageTitle + .Item.ItemDiscussion .Discussion {
      margin-top: 0px;
      padding: 10px 15px;
      border: 1px solid gray;
      border-top: 1px solid peru;
  }
  .MessageList.Discussion .Discussion .Item-Header.DiscussionHeader {
      margin-top: -4px;
  }
  .MessageList.DataList.Comments {
      position: relative;
      display: inline-block;
      width: 100%;
      margin-top: 0px;
      border-top: 1px solid gray;
  }
  .MessageList .Item:hover {
      background-color: black ! important;
  }
  .MessageList .Item.ItemDiscussion {
      position: relative;
      display: inline-block;
      width: 100%;
      min-width: 100%;
      margin-bottom: -17px;
      margin-top: 0px;
      top: 0px;
      padding-left: 5px;
      z-index: -1;
  }
  #vanilla_discussions_bookmarked .Item:nth-child(odd),
  #vanilla_discussions_mine .Item:nth-child(odd),
  #vanilla_discussions_participated .Item:nth-child(odd),
  .DataList.CategoryList .Item:nth-child(odd),
  .DataList .ItemDiscussion:nth-child(odd),
  .Item.ItemComment:nth-child(odd) {
      background-color: #222;
  }
  #vanilla_discussions_bookmarked .Item:nth-child(even),
  #vanilla_discussions_participated .Item:nth-child(even),
  .DataList.CategoryList .Item:nth-child(even),
  .DataList .ItemDiscussion:nth-child(even),
  .Item.ItemComment:nth-child(even) {
      background-color: #414141;
  }
  #vanilla_discussions_bookmarked .Item:hover,
  #vanilla_discussions_participated .Item:hover,
  #vanilla_discussions_participated .Item:hover,
  .DataList.CategoryList .Item:hover,
  .DataList .ItemDiscussion:hover,
  .Item.ItemComment:hover {
      transition: background ease 0.8s;
      box-shadow: 1px 1px 6px 4px rgba(0, 0, 0, 0.7) inset;
      background-color: rgba(7, 7, 7, 0.57);
  }
  #vanilla_discussions_bookmarked .Item:nth-child(odd):hover,
  #vanilla_discussions_participated .Item:nth-child(odd):hover,
  #vanilla_discussions_participated .Item:nth-child(odd):hover,
  .DataList.CategoryList .Item:nth-child(odd):hover,
  .DataList .ItemDiscussion:nth-child(odd):hover,
  .Item.ItemComment:nth-child(odd):hover {
      transition: background ease 0.8s;
      background-color: rgba(7, 7, 7, 0.67);
  }
  /* FORUM DISC - TITLE  (from Com Numbe) */
  .DataList:not(.Activities) .Item .ItemContent .Title {
      margin-top: 0px;
  }
  .DataList:not(.Activities) .Item .ItemContent .Title > a {
      position: relative;
      display: inline-block;
      width: 100%;
      margin-top: -35px;
      margin-bottom: -20px;
      vertical-align: middle;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
  }
  /* LAST USER COM */
  .MItem.LastCommentBy a {
      display: inline-block;
      vertical-align: top;
      width: 140px;
      height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  /* GREAS - DISC LAST PAGE */
  .CommentsWrap .BeforeCommentHeading + .DataBox.DataBox-Comments {
      position: relative;
      display: inline-block;
      min-width: 100%;
      margin-top: 0px;
      left: 0px;
      z-index: 1;
  }
  /* USERSTY */
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion.Section-Category-stylish .BreadcrumbsWrapper + #Panel.Column.PanelColumn + #Content.Column.ContentColumn .DismissMessage.AlertMessage + .MessageList.Discussion + .CommentsWrap .BeforeCommentHeading + .DataBox.DataBox-Comments {
      position: relative !important;
      display: inline-block;
      min-width: 100%;
      margin-top: -15px;
      left: 0px;
      z-index: 1;
  }
  /* DISC LIST - RAT ICON */
  .DataList .rating-image {
      height: 16px;
      line-height: 16px;
      margin-top: 3px;
  }
  /* DISCU LIST - READ  */
  .DataList .ItemDiscussion.Item.Read {
      background-color: rgba(47, 47, 47, 0.84);
  }
  .Item.Read .BlockTitle a:before,
  .Item.Read .Title a:before {
      content: ">>  ";
      color: gold;
  }
  /* ADD ICON "VIEW" from MOZILLA ADDONS PAGES */
  .Bookmarked .Title a::before,
  .Item.Read .Title a::before {
      background-image: url("https://addons.cdn.mozilla.net/static/img/zamboni/icons/collections.png?433f04b");
      background-position: 3px -650px;
      background-repeat: no-repeat;
      color: transparent;
      content: ">> ";
      display: inline-block;
      position: relative;
      height: 100%;
      max-height: 15px;
      min-height: 15px;
      top: 4px;
      margin-right: 3px;
      margin-left: -2px;
      background-color: rgba(55, 173, 227, 0.4);
  }
  .DataList .ItemDiscussion {
      position: relative;
      padding-left: 22px;
      border-bottom: 1px solid gray;
  }
  .MessageList.DataList.Comments .ItemComment,
  .ItemDiscussion {
      position: relative;
      display: inline-block;
      width: 94%;
      min-width: 728px;
      max-width: 728px;
      margin-top: 0px;
      padding-left: 5px;
      padding-right: 0px;
  }
  .MessageList.DataList.Comments .ItemComment {
      min-width: 754px;
      max-width: 754px;
  }
  #vanilla_discussions_index.index.Section-DiscussionList li.ItemDiscussion {
      position: relative;
      display: inline-block;
      height: 65px;
      left: 0px;
      margin-top: 0px;
      margin-bottom: 3px;
      padding-left: 3px;
      z-index: 0;
  }
  /* FIRST GREASY */
  #vanilla_discussions_index.index.Section-DiscussionList #Body .BreadcrumbsWrapper + #Panel + #Content.Column.ContentColumn ul.DataList.Discussions li.ItemDiscussion.filtered:first-of-type:not(.Mine):not(.Bookmarked),
  #vanilla_discussions_index.index.Section-DiscussionList li.ItemDiscussion.filtered:first-of-type:not(.Mine):not(.Bookmarked) {
      position: relative;
      display: inline-block;
      height: 35px;
      left: 0px;
      margin-top: 0px;
      top: 0px;
      z-index: 0;
  }
  /* GREASY/USERST Forum - COM */
  .CommentsWrap ul.DataList li.Item .Comment {
      padding: 0 30px 0 5px;
      border-right: 2px solid red;
  }
  /* GREAS - FORUM - ORIG POST */
  .isOriginalPoster {
      min-width: 744px;
      max-width: 744px;
      border-left: 4px solid red;
  }
  /* FORUM DISC - ITEMS - MINE */
  .ItemContent.Discussion {
      max-width: 95%;
  }
  .Item.ItemDiscussion,
  .Item.Bookmarked.Mine.ItemDiscussion {
      position: relative;
      padding-left: 22px;
  }
  /* OPTION CONT */
  .Options,
  .Item.Bookmarked.Mine.ItemDiscussion .Options {
      position: absolute;
      float: none;
      width: 28px;
      height: 48px;
      right: 1px;
      top: 1px;
  }
  .Options:hover,
  .Item.Bookmarked.Mine.ItemDiscussion .Options:hover {
      z-index: 500;
  }
  li.Item.ItemDiscussion.filtered:not(.Mine):not(.Bookmarked) .Options {
      max-height: 30px;
  }
  .Options .ToggleFlyout.OptionsMenu,
  .Item.Bookmarked.Mine.ItemDiscussion .Options .ToggleFlyout.OptionsMenu {
      position: absolute;
      display: inline-block;
      height: 20px;
      width: 20px;
      top: 35px;
      margin-right: 0px;
      left: 4px;
  }
  /* EDIT/DISM - ALL */
  .Options .ToggleFlyout.OptionsMenu span.Button-Options {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      font-size: 0;
      z-index: 5000;
  }
  /* GREASY */
  #vanilla_discussion_comment.Vanilla.Discussion.comment.Section-Discussion.Section-Category-script-discussions #Panel.Column.PanelColumn + #Content.Column.ContentColumn .MessageList.Discussion #Item_0.PageTitle .Options .ToggleFlyout.OptionsMenu .Button-Options + ul.Flyout.MenuItems.list-reset,
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion #Panel.Column.PanelColumn + #Content.Column.ContentColumn .MessageList.Discussion #Item_0.PageTitle .Options .ToggleFlyout.OptionsMenu .Button-Options + ul.Flyout.MenuItems.list-reset {
      height: 18px;
      width: 18px;
      display: inline-block;
      left: 0px;
      top: 53px;
  }
  #vanilla_discussion_index.Vanilla.Discussion.index.Section-Discussion #Panel.Column.PanelColumn + #Content.Column.ContentColumn .MessageList.Discussion #Item_0.PageTitle .Options .ToggleFlyout.OptionsMenu .Button-Options + ul.Flyout.MenuItems.list-reset .dropdown-menu-link.dropdown-menu-link-edit:before {
      content: " ";
      width: 16px;
      height: 16px;
      top: 34px !important;
      left: -15px;
      margin-left: 0;
      font-size: 15px;
      visibility: visible;
      background: black url("https://greasyfork.org/forum/applications/dashboard/design/images/sprites.png") no-repeat scroll -62px -324px;
      outline: 1px solid gray;
  }
  /* EDIT ICON - BOOK LIST */
  .Options .ToggleFlyout.OptionsMenu .Flyout.MenuItems.list-reset li[role="presentation"].no-icon:hover,
  .Options .ToggleFlyout.OptionsMenu .Flyout.MenuItems.list-reset li[role="presentation"].no-icon:not(:hover) {
      position: absolute;
      display: inline-block;
      height: 18px;
      width: 18px;
      top: 2px;
      left: 0px;
      visibility: visible;
      opacity: 1;
  }
  /* EDIT ICON - BOOK LIST - MINE */
  .Item.Bookmarked.Mine.ItemDiscussion .Options .ToggleFlyout.OptionsMenu .Flyout.MenuItems.list-reset li[role="presentation"].no-icon:hover,
  .Item.Bookmarked.Mine.ItemDiscussion .Options .ToggleFlyout.OptionsMenu .Flyout.MenuItems.list-reset li[role="presentation"].no-icon:not(:hover) {
      position: absolute;
      display: inline-block;
      height: 18px;
      width: 18px;
      top: 2px;
      left: 0px;
      visibility: visible;
      opacity: 1;
  }
  .Options .ToggleFlyout.OptionsMenu .Flyout.MenuItems.list-reset li[role="presentation"] .dropdown-menu-link.dropdown-menu-link-edit,
  .Item.Bookmarked.Mine.ItemDiscussion .Options .ToggleFlyout.OptionsMenu .Flyout.MenuItems.list-reset li[role="presentation"] .dropdown-menu-link.dropdown-menu-link-edit {
      position: absolute;
      display: inline-block;
      min-width: 18px;
      max-width: 18px;
      left: -1px;
      top: -2px;
      margin-left: 0;
      visibility: visible;
      opacity: 1;
  }
  #vanilla_discussion_index.Vanilla.Discussion #Content.Column.ContentColumn .dropdown-menu-link.dropdown-menu-link-edit {
      position: absolute;
      display: inline-block;
      min-width: 18px;
      max-width: 18px;
      left: 9px;
      top: -28px;
      margin-left: 0;
      visibility: visible;
      opacity: 1;
      transform: scale(0.8);
  }
  /* GREASY FORUM COM - OPTION - EDIT/FAVS */
  .Options .ToggleFlyout.OptionsMenu .Flyout.MenuItems.list-reset li[role="presentation"] .dropdown-menu-link.dropdown-menu-link-edit::before,
  .Item.Bookmarked.Mine.ItemDiscussion .Options .ToggleFlyout.OptionsMenu .Flyout.MenuItems.list-reset li[role="presentation"] .dropdown-menu-link.dropdown-menu-link-edit::before {
      content: " ";
      width: 16px;
      height: 16px;
      margin-left: 0px;
      left: 0px;
      top: 0px;
      font-size: 15px;
      visibility: visible;
      background: black url("https://greasyfork.org/forum/applications/dashboard/design/images/sprites.png") no-repeat scroll -62px -324px;
      outline: 1px solid gray;
      border: 1px solid gray;
  }
  .Options .ToggleFlyout.OptionsMenu + a.Hijack.Bookmark,
  .Item.Bookmarked.Mine.ItemDiscussion .Options .ToggleFlyout.OptionsMenu + a.Hijack.Bookmark {
      position: relative;
      top: 8px;
      left: 10px;
  }
  /* PROF */
  .ProfilePhotoLarge {
      margin-top: 55px;
      position: relative;
      width: 200px;
  }
  /* ICON PROF - PANEL LEFT - DISC LIST/COM - (not Notif or com) */
  .UserBox > .PhotoWrap[href*="/profile/"],
  #Panel.Column.PanelColumn > .MeBox > a.PhotoWrap[href*="/profile/"] {
      position: relative;
      display: inline-block;
      height: 55px;
      width: 198px;
      top: 0px;
      text-align: center;
      z-index: 500;
  }
  /* USER ICON - GREAS */
  #Panel.Column.PanelColumn .MeBox a.PhotoWrap img.ProfilePhoto.ProfilePhotoMedium {
      position: relative !important;
      display: inline-block !important;
      margin-top: 0px !important;
      top: 3px !important;
      outline: 1px solid violet !important;
  }
  /* USERSTY */
  .Row .BreadcrumbsWrapper + #Panel.Column.PanelColumn .MeBox .PhotoWrap .ProfilePhoto.ProfilePhotoMedium,
  /* GREAS */
  #vanilla_discussions_mine #Panel.Column.PanelColumn .MeBox a.PhotoWrap img.ProfilePhoto.ProfilePhotoMedium,
  #vanilla_categories_index #Panel.Column.PanelColumn .MeBox a.PhotoWrap img.ProfilePhoto.ProfilePhotoMedium,
  #vanilla_drafts_index #Panel.Column.PanelColumn .MeBox a.PhotoWrap img.ProfilePhoto.ProfilePhotoMedium,
  #vanilla_discussions_bookmarked #Panel.Column.PanelColumn .MeBox a.PhotoWrap img.ProfilePhoto.ProfilePhotoMedium,
  #vanilla_discussion_index #Panel.Column.PanelColumn .MeBox a.PhotoWrap img.ProfilePhoto.ProfilePhotoMedium {
      margin-top: 0px !important;
      top: 3px !important;
      outline: 1px solid yellow;
  }
  /* GREAS FORUM - DISC - TOP */
  #vanilla_discussion_comment .Column.ContentColumn {
      border-top: 1px solid peru;
  }
  .MeBox + .BoxButtons.BoxNewDiscussion {
      margin-top: 30px;
      box-shadow: 3px 3px 2px black;
  }
  /* START === UESRST FORUM REVIEW - Style Name in First */
  .Section-Category-style-reviews.Section-DiscussionList .DataList .Title {
      display: inline-block;
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      font-size: 14px;
  }
  .Section-Category-style-reviews.Section-DiscussionList .Item.ItemDiscussion .ItemContent.Discussion span.DiscussionAboutListDiscussion {
      position: relative;
      display: inline-block;
      width: 100%;
      min-width: 93%;
      max-width: 93%;
      height: 100%;
      min-height: 15px;
      max-height: 15px;
      line-height: 15px;
      top: 3px;
      margin-left: 20px;
  }
  .Section-Category-style-reviews.Section-DiscussionList .Bookmarked.Mine.Participated.Read .DiscussionAboutListDiscussion {
      margin-top: 21px;
      margin-left: 0px;
  }
  /* GOOD RAT - OK - THUMB UP */
  .Section-Category-style-reviews.Section-DiscussionList .ItemContent.Discussion .Title img.rating-image {
      display: inline-block;
      margin-left: 0px;
      margin-top: 25px;
  }
  /* BAD RAT - THUMB DOWN */
  .Section-Category-style-reviews.Section-DiscussionList .ItemContent.Discussion .Title img.rating-image[alt="Bad rating"] {
      display: inline-block;
      margin-left: 0px;
      margin-top: 25px;
  }
  /* USERST - REVIEW LIST */
  #vanilla_categories_index.Vanilla.Categories.index.Discussions.Category-style-reviews.Section-Category-style-reviews.Section-DiscussionList #Frame #Body .Row #Content.Column.ContentColumn .DataList.Discussions {
      position: relative;
      display: inline-block;
      width: 100%;
      margin-top: 22px;
  }
  #vanilla_categories_index.Vanilla.Categories.index.Discussions.Category-style-reviews.Section-Category-style-reviews.Section-DiscussionList #Frame #Body .Row #Content .DataList.Discussions > li {
      position: relative;
      min-height: 72px;
      margin: 0;
      padding-left: 22px;
  }
  .Section-Category-style-reviews.Section-DiscussionList .ItemContent.Discussion .Title > a {
      display: inline-block !important;
      width: 100% !important;
      margin-bottom: -9px!important;
      margin-top: -26px !important;
  }

  /* END === UESRST FORUM REVIEW ==== */
  /* FORUM NOTIFICATION - TXT */
  .Flyout .Author .PhotoWrap {
      height: 10px;
      width: 20px;
  }
  .PopList.Activities .PhotoWrap.PhotoWrapMedium {
      height: 20px;
      margin-bottom: -18px;
      background-color: black;
  }
  .Flyout .Author .ProfilePhoto {
      width: 20px;
      height: 20px;
      background-size: cover;
  }
  .PopList .ItemContent {
      line-height: 1.2;
      margin-left: -1px;
  }
  /* DRAFT */
  .DataList.Drafts {
      margin-top: 98px;
      border-top: 1px solid gray;
  }

  /* ATTACH */
  .Attachment img {
      max-width: 100%;
      height: auto;
      vertical-align: bottom;
  }
  .Attachment {
      max-width: 100px;
      min-width: 100px;
      padding: 3px 8px 8px 5px;
      border-radius: 5px;
      background-color: black;
  }

  /* ATTACH COUNTER */
  .Attachments {
      counter-reset: image;
      border-radius: 5px;
      background-color: #222;
  }
  .Attachment:before {
      content: counter(image, decimal);
      position: absolute;
      display: inline-block;
      height: 20px;
      top: 10px;
      padding: 0 3px;
      border-radius: 5px;
      counter-increment: image;
      background: none repeat scroll 0 0 rgba(135, 207, 235, 0.3);
  }

  /* FORUM PAGI - PAGE WRAP (bottom) */
  .PagerWrap {
      margin-top: 20px;
      overflow: visible;
  }
  /* FORUM PAGINATION - ALL */
  .PageControls {
      display: inline-block;
      width: 95%;
      height: 100%;
      min-height: 15px;
      max-height: 15px;
      line-height: 15px;
      text-align: right;
  }
  .PageControls.Top {
      position: fixed;
      display: inline-block;
      width: 560px;
      min-height: 22px;
      margin-left: 190px;
      top: 25px;
      opacity: 1;
      visibility: visible;
      z-index: 200;
  }
  /* PAGI TOP - USERST DISC LAST PAGE */
  #PagerBefore.Pager {
      position: fixed;
      display: inline-block;
      vertical-align: bottom;
      max-width: 560px;
      min-width: 560px;
      height: 17px;
      line-height: 12px;
      top: 30px;
      right: 24.2%;
      padding: 1px;
      border-radius: 3px 3px 0 0;
      text-align: center;
      z-index: 500;
      border: 1px solid peru;
      background-color: transparent;
  }

  /* ICONS */
  /* SPRITE GREAS */
  .SpNotifications,
  .SpGlobe {
      background-position: -32px -212px;
  }
  .SpInbox,
  .SpEnvelope {
      background-position: 0 -228px;
  }
  .SpBookmarks,
  .SpStar {
      background-position: -80px -245px;
  }
  .SpDashboard,
  .SpOptions,
  .SpCog {
      background-position: 0 -212px;
  }
  /* MY NAME */
  .QuoteAuthor > a[href*="/decembre"],
  .Item .Author a[href*="/decembre"] {
      font-size: 18px;
      color: peru;
  }


  /* ==== (ALL) STYLE ==== */
  /* (new218) (ALL) BackGround Color === */
  htlm,
  body {
      width: 100% !important;
      text-align: left !important;
      overflow: hidden !important;
      overflow-y: hidden !important;
      overflow-x: hidden !important;
      color: #929292;
      background: #333 !important;
  }

  /* (new211) A VOIR margin - After IFRAME */
  #container-responsive {
      display: inline-block !important;
      width: 100% !important;
      min-height: 99.7vh !important;
      max-height: 99.7vh !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  #nav-view-responsive {
      display: inline-block !important;
      flex-direction: unset;
      height: 100% !important;
      min-height: 100% !important;
      width: 100% !important;
  }
  #container-responsive .view_inner {
      display: inline-block !important;
      flex-direction: unset !important;
      justify-content: unset !important;
      margin-top: 10px;
      width: 100% !important;
      height: auto !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      text-align: center !important;
  }

  /* FOR LIGHTBOX */
  body[style="overflow: auto"],
  body[style="overflow: visible;"] {
      overflow: visible !important;
  }

  /* GREAS - CODE PAGE - STRIPP BACKG - 
  TEST CODERAY HUGE CODE: https://greasyfork.org/en/scripts/1896-nwpb/code
  === */
  #script-info .CodeRay {
      display: inline-block;
      max-width: 99.8%;
      background-image: linear-gradient(rgba(85, 85, 85, 0.05) 90%, transparent 50%, transparent);
      background-size: 30px 15px;
  }
  #script-info .CodeRay tbody {
      display: inline-block;
      width: 99.98%;
  }

  #script-info .CodeRay tbody .code {
      display: inline-block;
      min-width: 905px;
      max-width: 905px;
  }
  #script-info .CodeRay tbody .code pre {
      min-width: 900px;
      max-width: 900px;
      word-wrap: break-word;
      white-space: pre-line;
  }


  /* ===== (new189) COLOR - LINK ===== */
  /* ICON - FILTER to PERU */
  .replies-icon,
  .comment-wrapper .actions .right-actions .reply-wrapper .reply-to-icon,
  .enter-comment-wrapper .enter-comment-icon {
      filter: invert(15%) sepia(100%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
  }

  /* LINK - TEXT DECO NONE */
  a:link {
      text-decoration: none;
  }

  /* (new255) LINK / TXT  SPECIAL */
  b[style="color:#661111"]{
      color: #b39595 !important;
      text-decoration: none;
  }
  b[style="color:#661188"]{
      color: #c867ee !important;
      text-decoration: none;
  }
  b[style="color:#2244aa"]{
      color: #6188ff !important;
      text-decoration: none;
  }
  small[style="color:blue"]{
      color: #23A4A2 !important;
      text-decoration: none;
  }

  .MItem.MCount.CommentCount,
  .MItem.MCount.ViewCount {
      color: #b7b7b7;
  }
  table#style-table .meta span.date.date1 {
      color: #23A4A2;
      text-decoration: none;
  }
  table#style-table .meta span.date.date2 {
      color: #0DD6D3;
      text-decoration: none;
  }
  #main-article #style-table a[href^="/styles/"] {
      color: #DD9E0F;
      text-decoration: none;
  }
  #main-article #style-table a:visited[href^="/styles/"] {
      color: #EAC060 !important;
      text-decoration: none !important;
  }

  /* (ALL) LINKS - PERU / TOMATO (visited) */
  body:not(.Settings) a:not(.Button),
  #Head a,
  #site-nav a,
  #additional-info > a b,
  a {
      color: peru !important
  }
  a:visited {
      color: tomato !important
  }

  /* VISITED  ACTIVE- GOLD / GOLD */
  section#style-info div#main-style-info div#stylish-installed-style-installed.install-status.install-info a.install-note,
  #style-install-unknown > p > a,
  #style-install-unknown > p > a:visited,
  #style-install-unknown > p > a:active {
      color: GOLD !important;
  }


  /* VISITED - TAN */
  body:not(.Settings) a:not(.Button):visited,
  #additional-info > a:visited,
  #additional-info > a:visited b,
  .discussion-list > li > a:visited,
  .About > dt > a:visited,
  .Item-Body .Message > a:visited,
  .script-author-description > p > a:visited,
  .script-author-description > ul > li > ul > li > a:visited,
  .script-author-description > ul > li > a:visited,
  .DataList .Item .Title > a:visited,
  .inline-list > li > a:visited,
  .DataList .ItemDiscussion.Item.Read a:visited {
      color: TAN !important;
  }

  /* VISITED - GOLDENROD */
  .thetitle > a:visited > b {
      color: GOLDENROD !important;
  }

  /* (new229) VISITED - ROSYBROWN */
  .width-constraint #discussions li > a:first-of-type:visited {
      color: ROSYBROWN !important;
  }
  form .history_versions .version-changelog > p > a {
      color: peru !important;
      /* background: red !important; */
  }
  form .history_versions .version-changelog > p > a:visited {
      color: ROSYBROWN !important;
      /* background: red !important; */
  }
  /* VISITED / HOVER  - Color A VOIR */
  a:hover {
      color: #73B379 !important;
  }
  a:visited:hover {
      color: #B9D56E !important;
      text-decoration: none !important;
  }


  /* END ==== LINK - VISITED ==== */
  /* START ==== LINK - HOVER ===== */
  /* LINKS HOVER - TOMATO  */
  #show-code + #control-panel > a:hover,
  #main-header > h1 > a:hover,
  #style-author-info > tbody > tr > td > a:not(.license-image):hover,
  #long-description > a:hover,
  .MItem.LastCommentBy > a:hover,
  .About > dt:last-of-type a:hover,
  .script-author-description > ul > li > ul > li:hover a:hover,
  .About dt a:hover,
  #main-article #table-container #style-table tr td:nth-child(2) a[href^="/styles/"]:hover,
  #script-list-option-groups .list-option > a:hover,
  #user-script-list > li h2 a:hover,
  #browse-script-list > li h2 a:hover,
  .script-list-author > span > a:hover,

  .DataList.SearchResults .Item .ItemContent:hover .Meta a,
  #script-content > form > ul > li:hover,
  #contact a:hover,
  #related > ul > li > a:hover,
  #screenshots #more-screenshots a:hover,
  .Message > b > a:hover,
  .Buttons .Back > a:hover,
  .AttachFileWrapper .AttachFileLink > a:hover,
  .AuthorWrap .Author .PhotoWrap + .Username:hover,
  #Item_0 + .DiscussionAboutShowDiscussion > a:hover,
  .Item-Body .Message > a:hover,
  .MItem.Category > a:hover,
  .ReactButton.Quote.Visible:hover,
  .Box.BoxCategories a:hover,
  #Panel .FilterMenu a:hover,
  .SiteMenu > li > a:hover,
  .ItemContent.Discussion .Title > a:hover,
  #main-article > dl > dd > a:hover,
  #main-article > dl > dt:hover,
  #main-header + #content-wrapper > #main-article > ul:hover:before,
  #main-article > ul > li > a:hover,
  #sidebar-forum > a:hover,
  #sidebar-help > a:hover,
  #sidebar-browse > a:hover,
  #sidebar-my-account > a:hover,
  #show-button:hover,
  #control-panel > a:nth-child(1):hover,
  #control-panel > a:hover,

  #long-description > a > b:hover,

  #main-article #hidden-meta a:hover,
  #no-discussions > a:hover,
  #site-name > a[href="/"] span:hover,
  .thetitle > .theauthor > a:hover,
  .thetitle > a > b:hover,
  .width-constraint > h3 > a:hover,
  #script-content > form > ul > li > a:hover,
  #script-content > p > a:hover,
  #install-area .script-in-sets > a:hover,
  #additional-info-text > a > b:hover,
  #additional-info > div > ul > li > a:hover,
  #additional-info > div > p > a:hover,
  #additional-info > div > p > b > a:hover,
  .script-show-author > span > a:hover,

  #title-subtext:hover > b,
  #site-name > a span#settings-subtext:hover,
  #nav-user-info .user-profile-link > a:hover,
  #nav-user-info > li > a:hover,
  #nav-user-info + nav .help-link > a:hover,
  #nav-user-info + nav .forum-link > a:hover,
  #nav-user-info + nav .scripts-index-link > a:hover,
  #nav-user-info + nav a:hover,
  #nav-user-info .sign-out-link > a:hover,
  #start-discussion:hover,
  #start-discussion-top:hover,
  #start-discussion-bottom:hover,
  .inline-list > li > a:hover,
  #discussions-area #discussions li:hover a:not(:last-of-type),
  .CommentsWrap .Comment:hover a:not(.FlagContent):not([rel="nofollow"]),
  .CommentsWrap .Comment a.FlagContent:hover,
  .width-constraint #discussions li > a:nth-child(4):hover,
  .width-constraint #discussions li > a:nth-child(2):hover,
  .width-constraint #discussions li > a:first-of-type:hover,
  .width-constraint #discussions li:hover > a:nth-child(4),
  .width-constraint #discussions li:hover > time,
  .Message > ol > li > small > a:hover,
  .Message > dl > dd > a:hover,
  .UserQuote .QuoteAuthor a:hover {
      color: TOMATO !important;
  }


  /* LINK - HOVER + VISITED - TOMATO  */
  .inline-list > li > a:visited:hover,
  .DataList .ItemDiscussion.Item.Read a:visited:hover,
  .DataList .ItemDiscussion.Item.Read a:visited:hover {
      color: TOMATO !important;
  }

  /* (new248) COLOR - FOR SOME SPECIALE SCIPTS INFOS PRESENTATION:
  TEST LINK: 
  https://greasyfork.org/fr/scripts/431573-youtube-cpu-tamer-by-animationframe
  ==== */

  h5[style="color:#601d9f"] {
      color: fuchsia !important;
  } 

  h3[style="color:#1133ff"] ,
  h4[style="color:#08355c"] {
      color: #b4e22b !important;
  } 

  ol b[style="color:#5D2D73"] ,
  ol[style="color:#7006DF"] {
      color: TOMATO !important;
  }

  /* ============ END COLOR LINKS ====== */
  /* TEST - GM "DIEP.IO by Terjanq" - ONLY for THIS SCRIPT - FIGHT AGAINST a VERY STRANGE TYPO EFFECT - with / without GM "CITRUS" - 
  in SCRIPT NAME of:
  DIEP.IO by Terjanq

  IT'S USER (terjanq) LIST:
  https://greasyfork.org/fr/users/33759-terjanq

  SEARCH "DIEP.IO+":
  https://greasyfork.org/fr/scripts/search?q=DIEP.IO+

  MY DISSCUS about it :
  Removed : VERY strange TYPO EFFECT in your script name !
  Linked in :
  https://greasyfork.org/en/scripts/24423-greasyfork-theme/discussions/23845
  LAST TOPIC ABOUT ZAGLOT- 2021.03 :
  https://greasyfork.org/en/discussions/greasyfork/79255-ban-or-at-least-hide-these-zalgo-characters
  === */
  /* GM "DIEP.IO by Terjanq" - ONLY for THIS SCRIPT - GOOD : in FORUM - MY COMMENT ABOUT IT */
  .Title a[href*="https://greasyfork.org/fr/forum/discussion/9570/"] {
      overflow: hidden !important;
      background: rgba(255, 0, 0, 0.2) !important;
  }
  #Discussion_9570 .Discussion .Item-BodyWrap .Message {
      overflow: hidden !important;
      background: rgba(255, 0, 0, 0.2) !important;
  }


  /* GM "DIEP.IO by Terjanq" - ONLY for THIS SCRIPT - GOOD : in SCRIPT LIST - USER PROFILE / SEARCH   */
  #script-table #s19838 .thetitle + div,
  #user-script-list > li > article a[href$="/19838-diep-io-by-terjanq"] + span + .description,
  #user-script-list > li[data-script-name*="Diepiomods.com"] > article .description,
  #browse-script-list > li > article > h2 > a[href*="diep-io-by-terjanq"] ~ span.description {
      overflow: hidden !important;
      background: rgba(255, 0, 0, 0.2) !important;
  }

  .discussion-list > li > a[href="https://greasyfork.org/fr/scripts/19838"] + a {
      position: relative !important;
      display: inline-block !important;
      top: 4px !important;
      overflow: hidden !important;
      background: rgba(255, 0, 0, 0.2) !important;
  }


  /* ========== END GENERAL SITE ======================================= */
  `;
}
if ((location.hostname === "greasyfork.org" || location.hostname.endsWith(".greasyfork.org")) || (location.hostname === "sleazyfork.org" || location.hostname.endsWith(".sleazyfork.org")) || (location.hostname === "greasyfork-org.translate.goog" || location.hostname.endsWith(".greasyfork-org.translate.goog")) || location.href.startsWith("https://74.86.192.75/")) {
  css += `
  /* GREASYFORK - No GM "Citrus" (new248) */

  /* (new248) SCRIPT LIST - BROWSE COMPACT */

  /*.width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list.script-list li:not(.ad-entry) {
      height: auto !important;
      margin: 0 0 1vh 0 !important;
      padding: 0 1em;
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list.script-list li article .script-meta-block {
    max-width: 600px;
    column-count: 6 !important;
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list.script-list li article .script-meta-block > :last-child {
    margin-bottom: 0 !important;
  }*/
  /* ALL */
  /*.width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list.script-list li article .script-meta-block .inline-script-stats {
      display: grid;
      grid-template-columns: 100% auto;
      margin: 0 0px 0 0 !important;
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list.script-list li article .script-meta-block dl.inline-script-stats dt {
      position: relative !important;
      display: block !important;
      float: left!important;
      clear: both !important ;
      width: 100% !important ;
      min-width: 100% !important ;
      max-width: 100% !important ;
      margin: 0px 0px 0 0px !important;
      padding: 0px 5px !important;
      overflow-wrap: unset !important;
      white-space: nowrap !important;
      text-align: left !important;

  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list.script-list li article .script-meta-block dl.inline-script-stats dt span {
      position: relative !important;
      display: inline-block !important;
      float: none!important;
      width: 100% !important ;
      min-width: 100% !important ;
      max-width: 100% !important ;
      margin: 0px 0px 0 0px !important;
      padding: 0px 0px !important;
      overflow-wrap: unset !important;
      white-space: nowrap !important;
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list.script-list li article .script-meta-block dl.inline-script-stats dd {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      height: 2vh !important;
      width: 100% !important ;
      
      margin: 2.5vh 0 0 -120px !important;
      right: unset !important;
      left: 0% !important;
      overflow-wrap: unset !important;
      white-space: nowrap !important;
      text-align: center !important;
  }*/

  /* (new255) DESCRIPTION CONTAINER - without script */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#user-script-list > li > article > h2 ,

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > h2 ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > h2 {
      display: inline-block!important;
      width: 100% !important;
      min-width: 60% !important;
      max-width: 60% !important;
      min-height: 11vh !important;
      padding-bottom: 4px !important;
      padding-left: 4px!important;
      font-size: 15px !important;
      line-height: 15px !important;
      word-wrap: break-word !important;
      overflow: hidden !important;
      border-bottom: 1px solid gray!important;
      border-left: 3px solid red !important;
      border-right: 3px solid red !important;
  /*background: brown !important;*/
  }

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#user-script-list > li > article > h2 > a.script-link ,

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > h2 > a.script-link ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > h2 > a.script-link {
      display: inline-block!important;
      width: 100% !important;
       line-height: 15px !important;
      padding: 4px 4px 4px 10px!important;
      font-size: 15px !important;
      word-wrap: break-word !important;
      overflow: hidden !important;
  /*background: brown !important;*/
  /*border: 1px solid aqua !important;*/
  }

  /* GM "MY BOOKMARK" - ICON */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li h2 span:not(.note-obj-user-tag)[style="margin-left: 10px; cursor: pointer; display: inline-flex; align-items: center; vertical-align: middle; color: white;"] {
      position: absolute !important;
    display: block !important;
    float: left !important;
    width: 15px !important;
    height: 1.5vh !important;
    line-height: 1.2vh !important;
    margin: 1.4vh 0px 0px -43px !important;
    padding: 2px;
    font-size: 17px !important;
    cursor: pointer;
    align-items: center;
    border-radius: 100% !important;
  /*background: rgb(17, 17, 17) !important;*/
  /*border: 1px solid aqua !important;*/
  }


  /* (new255) DESCRIPTION - LEFT - without script */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#user-script-list > li > article .description,

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article .description ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article .description {
      width: 100% !important;
      line-height: 15px !important;
      padding: 0 !important;
      font-size: 15px !important;
      overflow: hidden !important;
  /*background: peru !important;*/
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#user-script-list > li > article h2 span.script-description.description,
  /* GM "Amelioration GREASYFORK " */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 span.script-description.description ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article h2 span.script-description.description {
      display: -webkit-box !important;
      -webkit-line-clamp: 4 !important;
      -webkit-box-orient: vertical;
      margin: 0;
      padding: 0 !important;
      overflow: hidden;
      text-overflow: ellipsis;
  /*background: lime !important;*/
  }


  /* (new255) METAS - RIGHT - without script */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#user-script-list > li > article > .script-meta-block,
  /* GM "Amelioration GREASYFORK " */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > .script-meta-block ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block {
      display: block!important;
      float: right !important;
      column-count: unset !important;
      width: 100% !important;
      min-width: 38% !important;
      max-width: 38% !important;
      min-height: 11.5vh !important;
      max-height: 11.5vh !important;
      padding: 0px !important;
      overflow: hidden !important;
  /*background: black !important;*/
  /*border-bottom: 1px solid gray !important;*/  
  /*border: 1px solid yellow !important;*/
  border: none !important;
  }

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > .script-meta-block dl.inline-script-stats ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats {
      display: inline-block !important;
      width: 100% !important;
      height: 9vh !important;
      padding: 0px!important;
  /*border: 1px solid yellow !important;*/
  }
  /* ALL */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > .script-meta-block dl dt ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl dt {
      display: block !important;
      float: left !important;
      width: 0% !important;
      height: 0vh !important;
      line-height: 0vh !important;
      padding: 0px!important;
      font-size: 0px !important;
      overflow: hidden !important;
  /*ckground: blue !important;*/
  /*border: 1px solid pink!important;*/
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > .script-meta-block dd ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dd {
      display: inline-block!important;
      width: auto !important;
      height: 6vh !important;
      line-height: 6vh !important;
      margin:  0 0 0 0 !important;
      padding: 0px 10px !important;
      font-size: 15px !important;
  /*ckground: red !important;*/
  }


  /* AUTHOR */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > .script-meta-block dl dt.script-list-author ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dt.script-list-author {
      display: inline-block!important;
      width: 100% !important;
      height: 0vh !important;
      line-height: 0vh !important;
      padding: 0px!important;
      font-size: 0px !important;
      overflow: hidden !important;
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-author ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-author {
      display: inline-block!important;
      width: 100% !important;
      height: 3vh !important;
      line-height: 2vh !important;
      margin:  0px 0 3px 0 !important;
      padding: 3px 5px!important;
      font-size: 15px !important;
  border-bottom: 1px solid silver !important;
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-author:before ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-author:before {
      content: "👤" !important;
      display: inline-block!important;
      width: 20px !important;
      height: 2vh !important;
      line-height: 2vh !important;
      margin:  0px 10px 0px 0 !important;
      padding: 0px 0px!important;
      font-size: 15px !important;
      text-align: center !important;
  /*border: 1px solid yellow !important;*/
  }

  /* 📈 DAILY INSTALL */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-daily-installs span:before ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-daily-installs span:before {
      content: "📈" !important;
      display: inline-block!important;
      width: 20px !important;
      height: 2vh !important;
      line-height: 2vh !important;
      margin:  0px 0px 0px 0 !important;
      padding: 0px 0px!important;
      font-size: 15px !important;
      text-align: center !important;
      opacity: 0.5 !important;
  /*border: 1px solid yellow !important;*/
  }

  /* 📊 TOTAL INSTALL */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-total-installs span:before ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-total-installs span:before {
      content: "📊" !important;
      display: inline-block!important;
      width: 20px !important;
      height: 2vh !important;
      line-height: 2vh !important;
      margin:  0px 0px 0px 0 !important;
      padding: 0px 0px!important;
      font-size: 15px !important;
      text-align: center !important;
      opacity: 0.5 !important;
  /*border: 1px solid yellow !important;*/
  }

  /* RATING  */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-ratings > span ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-ratings > span {
      display: inline-block!important;
      width: auto !important;
      height: 8vh !important;
      align-items: unset !important;
      white-space: pre-wrap !important;
  border: 1px solid yellow !important;
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-ratings > span ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-ratings > span {
      display: block!important;
      align-items: unset !important;
      float: left !important;
      width: 100% !important;
      height: 0vh !important;
      line-height: 0vh !important;
      padding: 0 !important;
      border-radius: 5px;
      font-size: 1em !important;
      font-weight: bold;
      transition: background-color 0.2s ease;
  border: none !important;
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-ratings > span > span ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-ratings > span > span {
      display: block!important;
      align-items: unset !important;
      float: left !important;
      width: 100% !important;
      height: 2vh !important;
      line-height: 2vh !important;
      margin: 0 0 3px 0 !important;
      padding: 2px 2px;
      border-radius: 5px;
      font-size: 0.8em !important;
      font-weight: bold;
      transition: background-color 0.2s ease;
  /*border: 1px solid silver !important;*/
  }


  /* DATE CREATED / UPDATED */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-updated-date ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-created-date ,

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-updated-date ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-created-date {
    display: inline-block !important;
    width: auto !important;
    height: 6vh !important;
    line-height: 6vh !important;
    margin: 0px !important;
    padding: 0px 3px !important;
    font-size: 0px !important;
  /*background: olive !important;*/
  }
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-updated-date span ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-created-date span ,

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-updated-date span ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-created-date span {
      font-size: 0px !important;
  }

  /* DATE CREATED */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-created-date span relative-time  ,

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-created-date span relative-time {
      position: absolute !important;
      display: inline-block !important;
      width: 7.2% !important;
      height: 1.5vh !important;
      line-height: 1.5vh !important;

      padding: 0px 3px !important;
      font-size: 14px !important;
      color: white !important;
  background: #80800063 !important;
  }
  /* RELATIVE CREATED */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-created-date span relative-time:before ,

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-created-date span relative-time:before {
  /*     content: attr(datetime) !important; */
      content: attr(title) !important;
   /*   clip-path: inset(0px 127px 0px 0px) !important;*/
      position: absolute !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 15px !important;
      max-height: 15px !important;
      line-height: 15px !important;
      min-width: 80% !important;
      max-width: 80% !important;
      margin: 0vh 0 0px -4px !important;
      top: 1.7vh !important;
      padding: 0 0px 0 3px !important;
      font-size: 12px !important;
      text-align: left !important;
      opacity: 0.7 !important;
      overflow: hidden !important;
      visibility: visible !important;
  color: white !important;
  /* color: gold !important; */
  /*background: #111 !important;*/
  /*background: green !important;*/
  /*background: olive !important;*/
  border-bottom: 1px solid yellow !important;
  }


  /* DATE UPDATED */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-updated-date span relative-time ,

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-updated-date span relative-time  {
      position: absolute !important;
      display: inline-block !important;
      width: 7.2% !important;
      height: 1.5vh !important;
      line-height: 1.3vh !important;
      margin: 3.8vh 0 0vh -10px !important;
      padding: 0px 3px !important;
      font-size: 13px !important;
      color: white !important;
  background: #ff00003b !important;
  }
  /* DATE RELATIVE UPDATED */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list  > li > article > .script-meta-block dl.inline-script-stats dd.script-list-updated-date span relative-time:before ,

  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed ~ ol#browse-script-list > li > article > .script-meta-block dl.inline-script-stats dd.script-list-updated-date span relative-time:before {
  /*     content: attr(datetime) !important; */
      content: attr(title) !important;
   /*   clip-path: inset(0px 127px 0px 0px) !important;*/
      position: absolute !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 15px !important;
      max-height: 15px !important;
      line-height: 15px !important;
      min-width: 94% !important;
      max-width: 94% !important;
      margin: 0vh 0 0px -4px !important;
      top: 1.7vh !important;
      padding: 0 2px 0 5px !important;
      font-size: 12px !important;
      text-align: left !important;
      opacity: 0.7 !important;
      overflow: hidden !important;
      visibility: visible !important;
  color: gray !important;
  color: gold !important;
  /*background: #111 !important;*/
  /*background: green !important;*/
  }
  `;
}
css += `
/* ==== GM - UTags- Greasy Fork==== */

/* (new248) SUPPORT  ========
▶ GM "UTags - Add usertags to links" by Pipe Craft (2023):
https://greasyfork.org/fr/scripts/460718-utags-add-usertags-to-links
=================== */

/* START === (new248) TEST - GM UTags "UTags - Add usertags to links" by Pipe Craft (2023)" */

/* === (new248) GM UTags - SUPP - === */

/* (new248) GM UTags - SUPP - For EDIT GM "SET EDIT+" - Edit button */
#user-script-sets a[href$="/edit"] + ul:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) ,
#favorite-edit + ul:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) ,

/* (new248) GM UTags - SUPP - COMMENTS Unsbcribe */
.discussion-subscribe + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) ,
.discussion-unsubscribe + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) ,

/* (new248) GM UTags - SUPP - COMMENTS NAV */
.comment-meta-item + .comment-meta-item a:not(.self-link) + ul:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) ,

/* (new248) GM UTags - SUPP - TOP NAV */
#site-nav a + ul:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity)  {
     display: none !important;
}


/* (new248) GM UTags - ALL SITES ? - TEST POSITION TAG ICON on LINK */
:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) .utags_ul.utags_ul_0 > li {
    position: relative !important;
    opacity: 0.2 !important;
    translate: 20px !important;
}
:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) .utags_ul.utags_ul_0 > li:hover {
    position: relative !important;
    opacity: 1 !important;
    translate: 20px !important;
}
.comment-meta-item + .comment-meta-item a.self-link + ul:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li {
     translate: -38px -0.5vh !important;
}
/* (new255) GM UTags - SCRIPT LIST USER - USER NAME NOT TAGGED */
.width-constraint #about-user h2[data-utags] + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity){
    position: fixed !important;
    height: var(--utags-captain-tag-size) !important;
    top: 5.8vh!important;
    left: 54%
}
/* (new255) GM UTags - SCRIPT LIST USER - USER NAME TAGGED */
.width-constraint #about-user h2[data-utags] + ul.utags_ul.utags_ul_1:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity){
    position: fixed !important;
    height: var(--utags-captain-tag-size) !important;
    top: 6vh!important;
    left: 54%
}
/* (new255) GM UTags + CITRUS - SCRIPT LIST USER - USER NAME TAGGED */
body[pagetype="UserProfile"] .width-constraint #about-user h2[data-utags] + ul.utags_ul.utags_ul_1:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity){
    position: fixed !important;
    height: var(--utags-captain-tag-size) !important;
    top: 7vh!important;
    left: 54%
}

/* (new248) GM UTags - SCRIPT LIST - NOT TAGGED */
body[pagetype="UserProfile"] #script-table .thetitle a + ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li:not(:hover) {
    display: inline-block !important;
    height: 20px  !important;
    width: 20px !important;
    opacity: 1 !important;
    translate: unset !important;
}
body[pagetype="UserProfile"] #script-table .thetitle a + ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li:hover {
    display: inline-block !important;
    height: 20px  !important;
    width: 20px !important;
    opacity: 1 !important;
    translate: unset !important;
}
/* (new248) GM UTags - HOVER LINK */
body[pagetype="UserProfile"] #script-table .thetitle a + ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li:not(:hover) button {
    min-height: 10px  !important;
    min-width: 10px !important;
    margin: 0 0 0 0 !important;
    opacity: 1 !important;
}
body[pagetype="UserProfile"] #script-table .thetitle a + ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li:hover button {
    min-height: 20px  !important;
    min-width: 20px !important;
    margin: -5px 0 0 0  !important;
    opacity: 1 !important;
}

/* (new248) GM UTags - TXT PERMALINK - TOOL TIPS */
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item + .comment-meta-item:after,
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item + .comment-meta-item:after {
    content: "Permalink 🏷️";
    position: absolute;
    height: 10px;
    line-height: 8px;
    bottom: 151%;
    left: -10.5%;
    padding: 2px 5px;
    border-radius: 5px;
    white-space: nowrap;
    transition: all 0.4s ease 0s;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
color: black;
background: #ffcb66;
}
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after,
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:before,
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after,
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:before {
    opacity: 1;
    visibility: visible;
}
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after,
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after {
    bottom: 158%;
}

.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item:has(.self-link) {
    position: relative  !important;
    display: inline-block !important;
    height: 2vh !important;
    line-height: 2vh !important;
    width: 20px !important;
    margin: 0px 0px 0 50px !important;
background: brown !important;
}
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item .self-link {
    position: relative  !important;
    display: inline-block !important;
    height: 2vh !important;
    line-height: 2vh !important;
    width: 20px !important;
    margin: 0px 0px 0 0px !important;
    top: -1px  !important;
    left: -1px !important;
    text-align: center !important;
    opacity: 1 !important;
color: #000;
background: brown !important;
border: none !important;
}
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item:has(.self-link) a.self-link + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) {
    position: absolute!important;
    display: inline-block !important;
    float: none !important;
    margin: 0vh 0 0px 0px !important;
    top: 0.4vh !important;
    left: 60px  !important;
/*border: 1px solid aqua  !important;*/
}
/* TAGGED - #script-table tbody td:nth-child(2) .thetitle > a > b */
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item:has(.self-link) a.self-link + ul.utags_ul.utags_ul_1:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) {
    position: relative !important;
    display: inline-block !important;
    float: none !important;
    width: unset !important;
    height: 2.2vh !important;
    line-height: 2.2vh !important;
    margin: 0vh 60px 0 23px !important;
    top: -2vh !important;
    white-space: nowrap !important;
    overflow: visible;
border: 1px solid aqua  !important;
}
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item:has(.self-link) a.self-link + ul.utags_ul.utags_ul_1:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) > li {
    position: relative !important;
    display: inline-block !important;
    float: none !important;
    width: auto !important;
    height: 2vh !important;
    line-height: 2vh !important;
    margin: 8px 0 0 0px !important;
    padding: 0 !important;
    overflow: visible;
    z-index: 50000 !important;
/*border: 1px solid aqua  !important;*/
}
/* TAGGED CAPITAIN TAG */
.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item:has(.self-link) a.self-link + ul.utags_ul.utags_ul_1:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) > li:has(.utags_captain_tag2) {
    margin: 7px 0 0 37px !important;
/*border: 1px solid aqua  !important;*/
}

.width-constraint #script-info > #script-content:has(.utags_ul.utags_ul_0):has(.discussion-header.discussion-header-script) .comment-meta-item.comment-meta-item-main + .comment-meta-item:has(.self-link) + .comment-meta-item:has(relative-time){
    text-align: left !important;
    padding: 0 0 0 200px !important;
/*border: 1px solid aqua  !important;*/
}
`;
if ((location.hostname === "greasyfork.org" || location.hostname.endsWith(".greasyfork.org")) || (location.hostname === "sleazyfork.org" || location.hostname.endsWith(".sleazyfork.org")) || (location.hostname === "greasyfork-org.translate.goog" || location.hostname.endsWith(".greasyfork-org.translate.goog"))) {
  css += `
  /* GM - Greasy Fork Amélioré TEST - (new255) ==
  GM - Greasy Fork Amélioré
  https://greasyfork.org/fr/scripts/552737-better-greasy-fork
  === */

  .bad-rating-count::before  ,
  .ok-rating-count::before ,
  .good-rating-count::before {
      position: relative !important;
      display: inline-block !important;
      height: 1vh !important;
      line-height: 1vh !important;
      top: -2px !important;
      margin: -8px 3px 0 0 !important;
      font-size: 8px !important;

  }
  /* SCRIPT INFOS PAGE */

  #script-info header h2 > img {
      position: absolute !important;
      display: inline-block;
      width: 34px !important;
      height: 34px !important;
      top: 3px;
      left: -45px !important;
      margin: 0 0 0 0 !important;
      text-align: right;
  /*border: 1px solid red !important;*/
  }

  #user-library-script-list:has(.script-description-blockquote)  .script-description-blockquote ,
  section#script-info header:has([style*="margin-left: calc(-80px - 1ex);"] img) h2 > img { 
      display: none !important;
  }

  .width-constraint:has(#additional-info):not(:has(#browse-script-list)) #script-info .script-description-blockquote {
      position: fixed  !important;
      width: 50% !important;
      height: auto !important;
      max-height: 9vh !important;
      top:  9.5vh !important;
      margin: 0 0 0 0% !important;
      padding: 4px 5px;
      border-radius: 0px;
      transition: background-color 0.2s, border-color 0.2s, color 0.2s;
      overflow: hidden auto !important;
      z-index: 500000000 !important;
  color: silver !important;
  /*background-color: rgb(249, 236, 219) !important;*/
  border-left: 4px solid #670000;
  /*border: 1px solid aqua  !important;*/
  }
  .width-constraint:has(#additional-info):not(:has(#browse-script-list)) #script-info .script-description-blockquote p#script-description.script-description {
      display: -webkit-box;
      -webkit-line-clamp: 4 !important;
      -webkit-box-orient: vertical;
      margin: 0;
      padding: 4px 5px !important;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  .width-constraint:has(#additional-info):not(:has(#browse-script-list)) .script-description-blockquote p#script-description.script-description:hover {
      display: -webkit-box;
      -webkit-line-clamp: 10 !important;
      -webkit-box-orient: vertical;
      margin: 0;
      padding: 4px 5px !important;
      overflow: hidden;
      text-overflow: ellipsis;
  }

  #script-info hr.bgs-info-separator{
      height: 3px;
      margin: 0.5em 0!important;
  background-color: #b1b8c0;
  border: none;
  }


  /* SCRIPT INFOS PAGE - WITH GM "UTAGS */

  .width-constraint:has(#additional-info, .utags_ul):not(:has(#browse-script-list)) #script-info .script-description-blockquote {
      position: fixed !important;
      width: 49.7% !important;
      height: auto !important;
      max-height: 5.4vh !important;
      top:11.5vh !important;
      margin: 0px 0px 0px 0% !important;
      padding: 4px 5px;
      border-radius: 0px;
      overflow: hidden !important;
      z-index: 500000000 !important;
      transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  color: silver !important;
  border-left: 4px solid aqua !important;
  }
  .width-constraint:has(#additional-info, .utags_ul):not(:has(#browse-script-list)) #script-info .script-description-blockquote p#script-description.script-description {
      display: -webkit-box;
      -webkit-line-clamp: 3 !important;
      -moz-box-orient: vertical;
      margin: 0px;
      padding: 4px 5px !important;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  /* HOVER */
  .width-constraint:has(#additional-info, .utags_ul):not(:has(#browse-script-list)) #script-info .script-description-blockquote:hover {
      transition: background-color 0.2s, border-color 0.2s, color 0.2s;
      overflow: hidden auto !important;
  color: silver !important;
  border-left: 4px solid green !important;
  }
  .width-constraint:has(#additional-info, .utags_ul):not(:has(#browse-script-list)) #script-info .script-description-blockquote:hover p#script-description.script-description {
    -webkit-line-clamp: 15 !important;
  }

  /* SCRIPT INFOS PAGE - WITH GM "UTAGS" + CITRUS */
  .width-constraint:has(#additional-info, .utags_ul) #script-info header p#script-description.script-description  {
      display: -webkit-box;
      -webkit-line-clamp: 4 !important;
      -moz-box-orient: vertical;
      width: 99% !important;
      height: auto !important;
      max-height: 7vh !important;
      margin: 0px;
      padding: 4px 5px !important;
      overflow: hidden !important;
      text-overflow: ellipsis;
  border-left: 4px solid aqua !important;
  }
  /* HOVER */
  .width-constraint:has(#additional-info, .utags_ul) #script-info header p#script-description.script-description:hover {
    -webkit-line-clamp: 15 !important;
      overflow: hidden auto !important;
  border-left: 4px solid green !important;
  }


  /* SCRIPT LIST */
  #browse-script-list.script-list li[data-script-id] .script-link img {
      width: 20px !important;
      height: 20px !important;
      margin-right: 8px;
      vertical-align: middle;
      border-radius: 3px;
      object-fit: contain;
      pointer-events: none;
  background-color: #0000 !important;
  /*border: 1px solid aqua  !important;*/
  }
  #browse-script-list li[data-script-id] .script-link img[src^="data:image/gif"]{
      width: 20px !important;
      height: 20px !important;
      margin-right: 8px;
      vertical-align: middle;
      border-radius: 3px;
      object-fit: contain;
      pointer-events: none;
  background-color: #0000 !important;
  /*border: 1px solid yellow  !important;*/
  }
  #browse-script-list .script-description-blockquote:hover ,
  #browse-script-list .script-description-blockquote {
      width: 100% !important;
      height: auto !important;
      max-height: 9vh !important;
      top:  8vh !important;
      margin: 0vh 0 0 0% !important;
      padding: 4px 5px !important;
      border-radius: 0px;
      transition: background-color 0.2s, border-color 0.2s, color 0.2s;
      overflow: hidden auto !important;
      z-index: 500000000 !important;
  color: silver !important;
  /*background-color: rgb(83, 76, 67) !important;*/
  border-left: 4px solid #0b0000;
  /*border: 1px solid aqua  !important;*/
  }
  #browse-script-list .script-description-blockquote .script-description.description:hover ,
  #browse-script-list .script-description-blockquote .script-description.description {
      display: -webkit-box;
      -webkit-line-clamp: 3 !important;
      -webkit-box-orient: vertical;
      width: 100% !important;
      min-width: 98% !important;
      max-width: 98% !important;
      margin: 0 !important;
      padding: 0 5px !important;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  /* WITH GM "ADD NOTES */
  #browse-script-list:has(.note-obj-add-note-btn) li:hover .note-obj-add-note-btn{
      margin: 0vh 0 -3vh 0 !important;
  }


  /* USER LIST - GM "GREASYFORK Amélioré " */
  .width-constraint:has(blockquote.script-description-blockquote) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li {
      width: 100% !important;
      min-height: 13.2vh !important;
      max-height: 13.2vh !important;
      margin: 0vh 0 5px 0 !important;
      padding: 0px 0 !important;
  /*background: peru !important;*/
  }
  .width-constraint:has(blockquote.script-description-blockquote) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 {
      width: 100% !important;
      min-height: 12.5vh !important;
      max-height: 12.5vh !important;
      margin: 0vh 0 0px 0 !important;
      padding: 0px 0 !important;
  /*background: peru !important;*/
  }

  .width-constraint:has(blockquote.script-description-blockquote) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 a.script-link img[src^="https://cdn-icons-png.flaticon.com/"] ,
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 a.script-link img {
      width: 20px !important;
      height: 20px !important;
      margin-right: 8px;
      vertical-align: middle;
      border-radius: 3px;
      object-fit: contain;
      pointer-events: none;
  }

  .width-constraint:has(blockquote.script-description-blockquote) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 blockquote.script-description-blockquote {
      width: 97% !important;
      margin: -2vh 0 0 0 !important;
      padding: 4px 5px !important;
      overflow: hidden;
      text-overflow: ellipsis;
  color: silver  !important;
  /*background: blue !important;*/
  }
  /* HOVER */
  /*.width-constraint:has(blockquote.script-description-blockquote) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article:hover h2:has(.note-obj-add-note-btn) blockquote.script-description-blockquote {
      position: relative !important;

      margin: 0vh 0 0 0 !important;
      padding: 4px 5px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      z-index: 0 !important;
  color: silver  !important;
  background: blue !important;
  }*/

  .width-constraint:has(blockquote.script-description-blockquote) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 span.script-description.description {
      display: -webkit-box !important;
      -webkit-line-clamp: 5 !important;
      -webkit-box-orient: vertical;
      width: 98% !important;
      margin: 0vh 0 0 0 !important;
      padding: 5px 5px !important;
      overflow: hidden;
      text-overflow: ellipsis;
  /*background: lime !important;*/
  }

  /* WITH GM "ADD NOTES */
  .width-constraint:has(blockquote.script-description-blockquote) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 .note-obj-add-note-btn {
      position: relative !important;
      margin:  0 0 0vh 0 !important;
      z-index: 500 !important;
  }
  .width-constraint:has(blockquote.script-description-blockquote) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article:hover h2 .note-obj-add-note-btn {
      position: relative !important;
      top: -1.5vh !important;
      margin:  0vh 0 0vh 0 !important;
  /*border: 1px solid aqua !important;*/
  }

  /* BADGE - NO SCRIPT */
  .width-constraint .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 span.badge {
      position: absolute !important;
      top: unset !important;
      margin: -4ex 0 0 -2ex !important;
      padding: 0 .5ex;
      border-radius: 10%/25%;
      font-size: 70%;
      text-transform: uppercase;
  }
  /* BADGE - WITH GM GresyFork Amélioré */
  .width-constraint:has(blockquote.script-description-blockquote, .utags_ul) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2:not(:has(ul.utags_ul)) a.script-link + .badge ,

  .width-constraint:has(blockquote.script-description-blockquote):not(:has(.utags_ul)) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 span.badge {
      position: absolute !important;
      display: inline-block !important;
      top: unset !important;
      margin: -4ex 0 0 -2ex !important;
      padding: 0 .5ex;
      border-radius: 10%/25%;
      font-size: 70%;
      text-transform: uppercase;
  }
  /* BADGE - WITH GM GresyFork Amélioré - NOT UTAGS on SCRIPT LINK */
  .width-constraint:has(blockquote.script-description-blockquote, .utags_ul) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2:not(:has(ul.utags_ul)) a.script-link + .badge ~ blockquote {
      margin: 0vh 0 0 0 !important;
  }
  .width-constraint:has(blockquote.script-description-blockquote, .utags_ul) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2:not(:has(ul.utags_ul)) a.script-link + .badge ~ blockquote span.script-description.description {
      display: -webkit-box;
      -webkit-line-clamp: 4 !important;
      -webkit-box-orient: vertical;
      margin: 0;
      padding: 0 !important;
      overflow: hidden;
      text-overflow: ellipsis;
  color: silver  !important;
  }

  /* BADGE - WITH GM GresyFork Amélioré" + GM "UTAGS"*/
  .width-constraint:has(blockquote.script-description-blockquote, .utags_ul) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 a.script-link + ul.utags_ul:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity)  ~ blockquote.script-description-blockquote {
      margin: 5px 0 0 0 !important;
  }

  .width-constraint:has(blockquote.script-description-blockquote, .utags_ul) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 span.badge {
      /*position: absolute !important;*/
      display: block !important;
      float: left !important;
      top: unset !important;
      margin: -9.5ex 0 0 -4ex !important;
      padding: 0 .5ex;
      border-radius: 10%/25%;
      font-size: 70%;
      text-transform: uppercase;
  }
  .width-constraint:has(blockquote.script-description-blockquote, .utags_ul) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list > li > article h2 blockquote.script-description-blockquote span.script-description.description {
      display: -webkit-box;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical;
      margin: 0;
      padding: 0 !important;
      overflow: hidden;
      text-overflow: ellipsis;
  }

  /* USER LIST - WITH GM "ADD NOTES */
  .width-constraint:has(blockquote.script-description-blockquote) .sidebarred .open-sidebar.sidebar-collapsed + section#user-script-list-section ol#user-script-list:has(.note-obj-add-note-btn) li:hover .note-obj-add-note-btn{
      margin: -1vh 0 0 0 !important;
  }


  /* COMMENT  PAGES */
  .width-constraint:has(#post-reply) #script-content .user-content pre{
      min-width: 98.5% !important;
      max-width: 98.5% !important;
      margin: 1rem 0;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
  /*background: blue !important;*/
  border: 1px solid var(--sh-punctuation);
  }

  section#script-info:has(.previewable) blockquote.script-description-blockquote {
      width: 97% !important;
      margin: 0.3vh 0 0 0 !important;
      padding: 4px 5px !important;
      overflow: hidden;
      text-overflow: ellipsis;
  color: silver  !important;
  /*background: blue !important;*/
  }
  section#script-info:has(.previewable) blockquote.script-description-blockquote p#script-description.script-description {
      display: -webkit-box !important;
      -webkit-line-clamp: 5 !important;
      -webkit-box-orient: vertical;
      width: 98% !important;
      margin: 0vh 0 0 0 !important;
      padding: 5px 5px !important;
      overflow: hidden;
      text-overflow: ellipsis;
  /*background: lime !important;*/
  }
  section#script-info:has(#post-reply .previewable) .comment {
      position: relative;
      margin-bottom: 1.5rem;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-left: 4px solid #670000;
  }
  /* COMMENT DEV / AUTEUR - BADGE */
  section#script-info:has(#post-reply .previewable) .comment:has(.badge.badge-author) {
      background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-left: 4px solid gold;
  }
  /* COMMENT META */
  section#script-info:has(#post-reply .previewable) .comment-meta {
      display: inline-block !important;
      flex-wrap: unset !important;
      align-items: unset !important;
      min-width: 100% !important;
      max-width: 100% !important;
      padding: 0.2rem 0.25rem;
      font-size: 0.875rem;
  color: var(--text-secondary);
  border-bottom: 1px solid red;
  }
  section#script-info:has(#post-reply .previewable) .comment-meta .comment-meta-item + .comment-meta-item ,
  section#script-info:has(#post-reply .previewable) .comment-meta.comment-meta-item{
      display: inline-block !important;
      flex-wrap: unset !important;
      align-items: unset !important;
  }
  section#script-info:has(#post-reply .previewable) .comment-meta .comment-meta-item-main {
      display: inline-block !important;
      min-width: 62% !important;
      max-width: 62%x !important;
      margin:  0 -30px 0 0 !important;
  /*border: 1px solid red;*/
  }
  section#script-info:has(#post-reply .previewable) #script-content .comment-meta .comment-meta-item + .comment-meta-item:has(relative-time[datetime]) {
      display: inline-block !important;
      min-width: 28% !important;
      max-width: 28% !important;
      padding:  0 0 0 10px !important;
      text-align: left !important;
      border-radius: 5px !important;
  border: 1px solid red;
  }
  section#script-info:has(#post-reply .previewable) #script-content .comment-meta  .comment-meta-item:has(.quote-comment){
      display: inline-block !important;
      min-width: 8% !important;
      max-width: 8% !important;
      padding:  0 10px !important;
      text-align: center !important;
      border-radius: 5px !important;
  border: 1px solid red;
  }
  section#script-info:has(#post-reply .previewable) #script-content .comment-meta  .comment-meta-item:has(.report-link){
      position: relative !important;
      display: inline-block !important;
      min-width: 27% !important;
      max-width: 27% !important;
      margin:  0 0 0 0% !important;
      left: 58.5% !important;
      padding:  0 10px !important;
      text-align: center !important;
      border-radius: 5px !important;
  /*border: 1px solid red;*/
  }

  section#script-info:has(#post-reply .previewable) .comment-meta .self-link {
    padding: 0rem 0rem;
    transition: all 0.2s ease;
  }

  section#script-info:has(#post-reply .previewable) .comment-meta-item.comment-meta-item-main + .comment-meta-item::before, 
  section#script-info:has(#post-reply .previewable) #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item::before {
      content: "";
      position: absolute;
      width: 0px;
      height: 0px;
      margin-top: -25px;
      margin-left: 0%;
      opacity: 0;
      visibility: hidden;
      transition: 0.4s;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid rgb(255, 203, 102);
  }
  section#script-info:has(#post-reply .previewable) .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover:before,
  section#script-info:has(#post-reply .previewable) #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover:before {
      margin-top: -10px !important;
      opacity: 1 !important;
      visibility: visible !important;
  }
  /* (new229) TXT PERMALINK */
  section#script-info:has(#post-reply .previewable) .comment-meta-item.comment-meta-item-main + .comment-meta-item + .comment-meta-item:after,
  section#script-info:has(#post-reply .previewable) #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item + .comment-meta-item:after {
      content: "Permalink";
      position: absolute;
      height: 10px;
      line-height: 8px;
      bottom: 0.3vh !important;
      left: -54.5% !important;
      padding: 2px 5px;
      border-radius: 5px;
      white-space: nowrap;
      transition: all 0.4s ease 0s;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
  color: black;
  background: red !important;
  }
  section#script-info:has(#post-reply .previewable) .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after,
  section#script-info:has(#post-reply .previewable) .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:before,
  section#script-info:has(#post-reply .previewable) #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after,
  section#script-info:has(#post-reply .previewable) #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:before {
      opacity: 1;
      visibility: visible;
  }
  section#script-info:has(#post-reply .previewable) .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after,
  section#script-info:has(#post-reply .previewable) #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item:hover + .comment-meta-item:after {
      bottom: 158%;
  }

  section#script-info:has(#post-reply .previewable) .comment-meta-item + .comment-meta-item {
      margin-left: 15px;
  }
  /* COMMENT CODE in TEXT */
  .user-content code {
      margin: 5px 0 -5px 0 !important;
    font-size: 0.9em;
  }
  `;
}
if ((location.hostname === "greasyfork.org" || location.hostname.endsWith(".greasyfork.org")) || (location.hostname === "sleazyfork.org" || location.hostname.endsWith(".sleazyfork.org")) || (location.hostname === "greasyfork-org.translate.goog" || location.hostname.endsWith(".greasyfork-org.translate.goog"))) {
  css += `
  /* === GM "Greasyfork – Auto-Translator"  === */

  #gf-translator-panel {
      position: fixed;
      min-width: 100px !important;
      max-width: 100px !important;
      padding: 10px;
      border-radius: 8px;
      cursor: move;
      user-select: none;
      font-family: Arial, sans-serif;
      transition: all 0.7s;
      opacity: 0.2 !important;
      z-index: 999999;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  background: #2222 !important;;
  border: 2px solid #4caf50;
  }
  #gf-translator-panel:hover {
      transition: all 0.7s;
      opacity: 1 !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  background: white;
  border: 2px solid #4caf50;
  }
  #gf-translator-panel .gf-panel-header + #gf-panel-content > button {
      width: 100%;
      min-width: 26% !important;
      max-width: 26% !important;
      margin: 0 5px 0 0px;
      padding: 0px 4px 0 0 !important;
      border-radius: 4px;
      font-weight: bold;
      font-size: 18px;
      white-space: nowrap !important;
      overflow: hidden !important;
      transition: all 0.2s;
      cursor: pointer;
  border: none;
  }
  #gf-translator-panel .gf-panel-header + #gf-panel-content > button#closeBtn {
      width: 100%;
      min-width: 24% !important;
      max-width: 24% !important;
      margin: 0 0px 0 5px !important;
      padding: 0px 0px  0px 4px  !important;
      border-radius: 4px;
      font-weight: bold;
      font-size: 18px;
      white-space: nowrap !important;
      overflow: hidden !important;
      transition: all 0.2s;
      cursor: pointer;
  border: none;
  }



  /* IN CODE */
  /*li .str.gf-translated-content {
      display: unset !important;
      line-height: 1 !important;
      text-align: unset !important;
      margin: unset !important;
      padding: unset !important;

  border: 1px solid aqua!important;  
  }
  li .str.gf-translated-content p {
      display: unset !important;
      line-height: 1 !important;
      text-align: unset !important;
      margin: unset !important;
      padding: unset !important;
  border: 1px solid aqua!important;  
  }


  .install-link.gf-translated-content {

  }
  .code-container .str.gf-translated-content {
      position: relative;  
      display: block !important;
      float: left !important;
      line-height: 1.7 !important;
  }
  .code-container .str.gf-translated-content .gf-translated-content {

  }

  .gf-translation-indicator {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 100%;
      min-width: 15px !important;
      max-width: 15px !important;
      margin: 0 0px 0 0px;
      padding: 0px 0px 0 0 !important;
      border-radius: 4px;
      font-weight: bold;
      font-size: 15px;
      white-space: nowrap !important;
      overflow: hidden !important;
      transition: all 0.2s;
      cursor: pointer;
  border: none;
  }*/

  `;
}
if ((location.hostname === "sleazyfork.org" || location.hostname.endsWith(".sleazyfork.org"))) {
  css += `
  /* SLEASYFORK (TEST) == */

  /* CHANGE ICON of SLEAZY FORK SITE TITLE ADD TXT "SLEAZY" where That's "GREASY" */
  /* SLEAZYFORK - SITE NAME + ICON */
  .width-constraint #site-name #site-name-text h1 {
      font-size: 20px!important;
      letter-spacing: 2px !important;
  }
  .width-constraint #site-name #site-name-text h1 {
      color: blue !important;
  }
  .width-constraint #site-name #site-name-text h1 a {
      display: none !important;
  }
  #site-name #site-name-text h1 + .subtitle {
      margin-left: 46px !important;
      margin-top: 16px !important;
      font-size: 10px!important;
      letter-spacing: 1px !important;
  }
  #site-nav > nav li a {
      font-size: 14px !important;
  }
  .width-constraint #site-name a img,
  .width-constraint #site-name a span,
  #site-name-text > h1 > a {
      display: none !important;
  }
  /* (new205) */
  .width-constraint #site-name > a:before,
  .width-constraint #site-name > h1:before {
      content: "SleasyFork" !important;
      display: inline-block !important;
      position: absolute !important;
      margin: -6px 0 0 38px !important;
      padding: 0 30px 0 5px !important;
      font-size: 15px !important;
      color: green !important;
      border-radius: 0 0 10px 0 !important;
      border: 1px solid peru !important;
      background: #111 !important;
  }
  #Head #site-name-text h1:before {
      content: "SleasyFork" !important;
      display: inline-block !important;
      position: absolute !important;
      top: -5px !important;
      margin-left: 0px !important;
      font-size: 22px !important;
      color: red !important;
  }
  .width-constraint #site-name > a:after {
      content: " " !important;
      display: inline-block !important;
      height: 30px !important;
      width: 30px !important;
      padding: 2px !important;
      border-radius: 5px !important;
      box-shadow: 0 0 2px #cccccc inset !important;
      background-color: rgba(191, 191, 190, 0.33) !important;
      background-image: url("https://sleazyfork.org/fr/forum/uploads/SCN2YQGWLIU4.jpg") !important;
      background-position: 50% 50% !important;
      background-size: contain !important;
  }

  /* === END - DOMAIN SLEASYFORK TEST === */
  `;
}
if (location.href.startsWith("https://greasyfork.org/fr/scripts/19838-diep-io-by-terjanq")) {
  css += `
  /* GM "DIEP.IO by Terjanq" - ONLY for THIS SCRIPT = START - URL-PREF -  ======= */
  /* URL PREF - GM "DIEP.IO by Terjanq" - GOOD : in SCRIPT INFO PAGE - DESCRIPTION */
  #script-info header p {
      overflow: hidden !important;
      background: rgba(255, 0, 0, 0.2) !important;
  }
  /* ========== END URLPREF - GM "DIEP.IO by Terjanq" - ONLY for THIS SCRIPT -  ======= */
  `;
}
if ((location.hostname === "greasyfork-org.translate.goog" || location.hostname.endsWith(".greasyfork-org.translate.goog")) || location.href.startsWith("https://translate.google.com/websitetranslationui?parent=https%3A%2F%2Fgreasyfork-org.translate.goog")) {
  css += `
  /* GOOGLE TRANSLATE = START - URL-PREF - */
  iframe#gt-nvframe {
      position: fixed;
      width: 100%;
      height: 36px !important;
      left: 0;
      right: auto;
      top: 0;
      border-radius: 0;
      transition: none 0s ease 0s;
      z-index: 2147483646;
      border: medium none;
      box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  }
  .b7B4sd {
      display: flex;
      height: 36px !important;
      padding-right: 4px;
      align-items: center;
      background: #111 !important;
      border-bottom: 1px solid red !important;
  }
  .IqBfM {
      bottom: auto;
      height: 36px !important;
      right: auto;
      width: auto;
  }
  iframe#gt-nvframe ~ #main-header {
      position: fixed;
      display: inline-block;
      float: none;
      width: 99.9%;
      height: 41px;
      left: -0.2%;
      top: 36px !important;
      background: rgba(0, 0, 0, 0) linear-gradient(to bottom, rgb(0, 0, 0) 2%, rgb(17, 17, 17) 37%, rgb(51, 51, 51) 100%, rgb(19, 19, 19) 100%) repeat scroll 0 0;
      border-bottom: 1px solid gray;
  }
  body header#main-header + .width-constraint:first-of-type {
      display: inline-block;
      height: auto;
      margin: 37px 0 20px 23.4% !important;
      max-width: 985px;
      min-width: 985px;
      padding: 0;
  }

  .discussion-list-container .discussion-meta a[href^="https://greasyfork-org.translate.goog/"] font {
      border: 1px solid green !important;
      color: gold !important;
  }
  .discussion-list-container a.discussion-title[href^="https://greasyfork-org.translate.goog/"] .discussion-snippet font font:before {
      content: " " !important;
      position: relative !important;
      display: inline-block !important;
      width: 10px !important;
      height: 10px !important;
      top: 0px !important;
      background-image: url(https://www.gstatic.com/images/branding/product/1x/translate_24dp.png) !important;
      background-repeat: no-repeat !important;
      background-size: contain !important;
      border: 1px solid red !important;
      color: gold !important;
  }
  #goog-gt-tt {
      position: absolute;
      width: 420px;
      font-family: arial;
      font-size: 10pt;
      z-index: 10000;
      background-color: #111 !important;
      border: 1px solid red !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      color: gold !important;
  }
  .goog-text-highlight {
      position: relative;
      box-sizing: border-box;
      background-color: black !important;
      box-shadow: 2px 2px 4px #9999aa;
  }
  /* END ==== URL-PREF - GOOGLE TRANSLATE */
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
