// ==UserScript==
// @name          Night amoled theme for inoreader
// @description	  Night amoled theme for inoreader ,just tile when set to expanded view
// @author        Alessandro
// @include       http://inoreader.com/*
// @include       https://inoreader.com/*
// @include       http://*.inoreader.com/*
// @include       https://*.inoreader.com/*
// @run-at        document-start
// @version       1.0
// @namespace ale
// @downloadURL https://update.greasyfork.org/scripts/29278/Night%20amoled%20theme%20for%20inoreader.user.js
// @updateURL https://update.greasyfork.org/scripts/29278/Night%20amoled%20theme%20for%20inoreader.meta.js
// ==/UserScript==
(function() {var css = [
	".block_article_ad,",
    ".article_content,",
    ".translation-container,",
    ".articles_feed_group_footer .mark_section_read, .articles_feed_group_footer .mark_section_read_disabled,",
	"  .ad_title,",
	"  .avs_iframe,",
    " div.article_card.article_current,",
" ::-webkit-scrollbar-track-piece,",
   " .article_unreaded .article_stripe,",
     " .article_stripe,",
    " #subscriptions_buttons,",
	"  #sinner_container,",
    " .footer,",
	"  #all_gad_6125 {",
	"    display: none !important;",
	"  }",
	"  ",
	"  .reader_pane_sinner {",
	"    backgroun-color:black!important;",
	"  }",
    " .article_title {",
	" font-size: 13px !important;",


"  }",
        " .inno_toolbar_button {",
	" color: #1d1d1d !important;",

"  }",
      " ::-webkit-scrollbar {",

    " width:3px !important;",

"  }",


              " ::-webkit-scrollbar-thumb {",
	"background: #1d1d1d !important;",
    " width:3px !important;",
   

"  }",
                  "  .feed_favicon {",
	" width: 26px !important;",
    "height: 26px!important;",
    "top: -3px!important;",


   

"  }",

          ".article_title_link  {",
	" color: yellow !important;",
    "    text-decoration: none !important;",




"  }",
              "  html, body  {",
	" background-color: black !important;",
  


"  }",
              ".article_full_contents  {",
	" background-color: black !important;",


"  }",
                  "#subscriptions_buttons {",
	" background-color: black !important;",


"  }",
                      ".articles_feed_group_heading {",
	" margin: -30px 0px 40px 30px !important;",



"  }",

              ".article_card  {",
	" background-color: black !important;",
    " padding: 0px 5px 18px 15px !important;",
        "margin-top: -7px !important;",
        "margin-bottom: 7px !important;",


"  }",
               " .header_small_padding  {",
	" margin-bottom: -45px !important;",



"  }",
                   " body  {",
	" zoom: 115% !important;",



"  }",
                  "#reader_pane {",
	" background-color: black !important;",


"  }",
                      " .feed_favicon, .discovery_feed_favicon {",
	"  opacity: 1 !important;",
    " filter: alpha(opacity=100)!important;",



"  }",
                      ".articles_feed_group_heading_title {",
	" font-size: 17px !important;",
    " color: #e50202 !important;",
   

"  }",
                          ".article_card {",
    "     border: 0px !important;",
"  }",
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();