// ==UserScript==
// @name Nintendo Life Theme
// @namespace Greasyfork
// @version 1.0.4
// @description `A simple custom theme for Nintendo Life`
// @author Miu
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/421698/Nintendo%20Life%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/421698/Nintendo%20Life%20Theme.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `@-moz-document domain("nintendolife.com") {



body::-webkit-scrollbar 
{
  width: 8px;               /* width of the entire scrollbar */
}

body::-webkit-scrollbar-track 
{
  background: rgb(29, 1, 56);        /* color of the tracking area */
}

body::-webkit-scrollbar-thumb 
{
  background-color: rgba(17, 0, 32, .5);    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
  border: 2px solid #d000ff;  /* creates padding around scroll thumb */
}


::-moz-selection 
  {background: #7d3d82; color: #FFF;}
  
  ::selection 
  {background: #7d3d82 !important; color: #FFF;}

.twitter-tweet-rendered
{
    background: rgba(17, 0, 32, .3);
}

body,#header .menubar
  {background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
  url(https://i.ibb.co/Vv1s0p4/0oQkS7c.jpg) !important;
  background-attachment: fixed!important;
  background-size: cover!important;}

.hero .hero-title .user-rating,.hero .hero-title .user-actions a
{
    background: rgba(17, 0, 32, .3);
}

.ui-button:hover ul a.whatsapp:hover,.ui-button:hover ul a.twitter:hover,.ui-button:hover ul a.facebook:hover,.ui-button:hover ul a.reddit:hover,
.ui-button:hover ul a.messenger:hover,.ui-button:hover ul a.skype:hover
{
    background: rgba(255,255,255,.05) !important;
}

.ui-button:hover ul
{
    background: rgba(255,255,255,.05);
    backdrop-filter: blur(5px);
}

.hero .hero-title .user-rating .rate-game .options
{
    backdrop-filter: blur(5px);
}

.paginate .active,.forum-post .message .userquote,#game-overview,.article-products .item ul li:not(.vendor) a:hover,
.article-products .item ul li:not(.vendor) a,#ui-join-newsletter .textbox,#ui-join-newsletter .button:hover,#ui-join-newsletter .button,
.ccmsForm .textbox,.ccmsForm textarea, .ccmsForm .textbox, .ccmsForm select,.gsc-input-box,.gsc-search-button-v2, .gsc-search-button-v2:hover, 
.gsc-search-button-v2:focus,.gsc-selected-option-container,.ui-listing-filter .ui-filter-search,
.container .ui-listing-toggles select,.ccmsForm .fm-tabbed .fm-tabs .current a,.ccmsForm .preview,div.Tokenize ul.TokensContainer li.Token,
.hero .hero-title .user-rating .rate-game .options,.flash p.info, .site-nintendolife .button,.site-nintendolife .button:hover, .ccmsForm .button:hover,
div.Tokenize ul.TokensContainer,.ccmsForm .fm-property-tag-related .related:hover,.ccmsForm .fm-property-tag-related .related,
.article-text table,.flash p.error,.body-text blockquote:not(.tiktok-embed),.disclaimer
{
    background: rgba(17, 0, 32, .3);
    /* backdrop-filter: blur(5px); */
    border-radius: 5px;
}

.user-actions
{
    background: rgba(17, 0, 32, .3) !important;
    backdrop-filter: blur(5px);
    border-radius: 5px;
}

.ui-overlay.fixed,#submenus .submenu .submenu-list,.menu-content-item,.gsc-completion-container,div.Tokenize ul.Dropdown,
.container .status-options, .container .score-options,.gsc-control-cse .gsc-option-menu
{
    background: rgba(17, 0, 32, .5);
    backdrop-filter: blur(8px);
    border-radius: 5px;
}

.site-nintendolife #template,#body,.content,.container .item-group:hover,#submenus .submenu,.ui-overlay .buffer,
.site-nintendolife .menubar, .site-nintendolife .ui-overlays,.block.posts .item:nth-child(2n),.insert-sticky,
.site-nintendolife .accent-wrap, .site-nintendolife .block.section .widget-header, .site-nintendolife .ui-topics-list li, 
.site-nintendolife .search-item-hubs .item-heading,.block.number-list .item:nth-child(2n),.block.number-list .item:hover,
.container .style-simple .item-content,.block footer .more a:hover,.block footer .more,#submenus .submenu .submenu-list a:hover,
.body-text .gallery, .body-text .picture,.body-text .gallery .generator, .body-text .picture .generator,.youtube,
#game-overview .buttons a,.positive-negative,.comments div.comments .comment:hover,#gutter,#footer .trending-articles .item,
#footer .trending-articles .more a:hover,.block .widget-header .actions a:hover,.forum-post:hover,.breadcrumbs,
.site-nintendolife .accent-wrap, .site-nintendolife .block .widget-header, .site-nintendolife .ui-topics-list li, 
.site-nintendolife .search-item-hubs .item-heading,.forums-list-topics .item:hover,.forums-list-topics .item, .forum-post .message blockquote,
.body-text .picture img[data-original], .body-text .gallery img[data-original],.block footer,
.site-nintendolife .block header,#game-overview .body,.block,.body-text .pictures .swiper-slide,
#quick-search-results,#quick-search-results .actions,#quick-search,#quick-search .controls,.article-products .item ul,#ad_tech_partners,
.ccmsForm .fm-fieldset-contents,.body-text hr,.gsc-completion-selected,.ui-listing-filters .ui-listing-filters-body,
.ui-listing-filter h3.heading:hover,.container .style-cover .item,.forums .category-forum,.forums .category-forum:hover,
.hero .hero-title .user-rating .rate-game .options li a.current,.content-listing th,.forum-post .message span.spoiler:hover,
.hero .hero-title .user-rating .rate-game .options li a:hover,.forum-post .message span.spoiler,article.article .table-of-contents,
.forum-post .message hr,.comments .comment.highlight,.article-products .item ul li:last-child,
.cpanel .notifications .item:hover, .cpanel .codes .item:hover,.article-text table th,.ccmsForm .box
{
    background: transparent;
}

#game-overview .buttons a:hover,.gsc-input
{
    background: transparent !important;
}

.ccmsForm .fm-fieldset legend, .accent-bg-hover:hover,
.accent-bg, .ccmsForm .fm-fieldset legend, .accent-bg-hover:hover,
.container .item .image,.gsc-control-cse,.gsc-webResult.gsc-result:hover,.gsc-webResult.gsc-result, .gsc-results .gsc-imageResult,
.gsc-option-menu-item-highlighted,.gsc-results .gsc-cursor-box .gsc-cursor-page,div.Tokenize ul.TokensContainer li.TokenSearch input
{
    background-color: transparent;
}

.block .widget-header,.ui-change-topic
{
    background-color: transparent !important;
}

.site-nintendolife #footer
{
    background-image: none;
}

.comments .comment .ui-comment-tools .has-liked,.comments .comment .ui-comment-tools .has-liked .icon,.has-liked
{
    color: #ff1a1a !important;
}

.accent span.icon
{
    color: white;
}

.block.number-list .item .prefix,.container .item-group,.container .style-list .item-medium .text,.container .item .list,
.block.posts .item .info strong,.block.posts .item .info .description,body,article.article section.title .description,
article.article section.title .version,article.article section.byline .article-author,.related-articles .item .description,
.body-text .gallery .generator, .body-text .picture .generator,.author .text,.content .empty,#footer .trending-articles .item,
.paginate,.forum-post .message .signature,.forum-post .message .last-edited,.forum-history .empty,.forums-list-topics .item,
.forums-list-topics .item dl dd,.menu-content-item .subtitle,article.article div.body-text .source,#quick-search .textbox,
.register .fm-field-name, .login .fm-field-name, .auth .fm-field-name,#quick-search-results,#quick-search-results .actions,
.article .related-products .disclaimer,.article-page .updated,#ui-join-newsletter .textbox,.gsc-result-info,.gsc-orderby-label,
.gs-webResult:not(.gs-no-results-result):not(.gs-error-result) .gs-snippet, .gs-fileFormatType,.gs-webResult div.gs-visibleUrl,
.gsc-input,.gsc-selected-option-container,.share-this,.ui-listing-filter .ui-filter-search,.container .ui-listing-toggles select,
#comments .comments:empty::before,.hero,.ccmsForm .fm-fieldset p.description,.ccmsForm .preview,p.last-updated, .author_info,
.comments .comment .info,.forums .category-forum,.forum-history .item,#controlbar .ui-userinfo p.subtitle,.forum-post .message span.spoiler:hover,
div.TokenizeMeasure, div.Tokenize ul li span, div.Tokenize ul.TokensContainer li.TokenSearch input,form#comment .rules,
.body-text .gallery .caption, .body-text .picture .caption,#userbar .ui-user-notifications-list li a span,
.forums p.topic-locked, .forums p.empty
{
    color: lavender;
}

.block.number-list .item .title,.container .item .title,.block.posts .item .title,#submenus .submenu .submenu-list a,
.text a, .forums .text a, .accent, .forums .unread a, .forums .unread .item-title .icon, .forums .unread .forum-title .icon,
.container .item .title,.block footer .more a,article.article section.byline .article-author a,#game-overview .buttons a,.author ul a,
.comments .comment .ui-comment-tools a,.comments .comment:hover .ui-comment-tools,.comments p.empty a,.cpanel .delete-account a,
.container .item .title:visited span,.container .item .list a,.container .style-list .item-medium .list a,.forum-post .message .signature a,
.container .item .title:visited span.title,.paginate a,.forums a,.forums a.accent,.breadcrumbs,.forum-history a,.body-text .disclaimer a,
.comments .comment:hover .ui-comment-tools a,.comments .comment:hover .ui-comment-tools a:hover,.site-nintendolife a,.ccmsForm .button,
.article .related-products .disclaimer a,.article-products .item ul li a,#ui-join-newsletter .button,.ccmsForm textarea, 
.ccmsForm .textbox, .ccmsForm select,.container .style-features .item-content .text,.gs-webResult.gs-result a.gs-title:link, 
.gs-webResult.gs-result a.gs-title:link b, .gs-imageResult a.gs-title:link, .gs-imageResult a.gs-title:link b,.gsc-option-menu-item,
.gsc-results .gsc-cursor-box .gsc-cursor-page,.gcsc-find-more-on-google,.ui-listing-filter h3.heading,.container .item .description a,
.ui-listing-filters .fm-checkbox,fieldset#control-panel a,.ccmsForm .fm-tabbed .fm-tabs a,.ui-listing-filters ul.tools a,.focus-icon,
article.article .scoring .policy a,.icon.icon-star.accent,.article-products .item ul del,.ccmsForm .fm-property-tag-related .related,
.content-listing td a,.related-games .item .heading a
{
    color: thistle;
}

.block footer .more a:hover,#submenus .submenu .submenu-list a.ui-change-topic:hover,#game-overview .buttons a:hover,.paginate a:hover,
.author ul a:hover,.comments .comment:hover .ui-comment-tools a:hover,#footer .trending-articles .more a:hover,.container .item .list a:hover,
.paginate .active,.site-nintendolife .button:hover,.register, .login, .auth,fieldset#control-panel a:hover,
.article-products .item ul li:not(.vendor) a:hover,#ui-join-newsletter .button:hover,.gs-webResult.gs-result a.gs-title:hover, 
.gs-webResult.gs-result a.gs-title:hover b, .gs-imageResult a.gs-title:hover, .gs-imageResult a.gs-title:hover b,.gsc-option-menu-item-highlighted,
.gsc-completion-selected,.ui-listing-filters .fm-checkbox-selected,.ui-listing-filters .fm-checkbox label:hover,.flash p,.content-listing td a:hover,
.ccmsForm .fm-tabbed .fm-tabs .current a,.ui-listing-filters ul.tools a:hover,.accent-hover:hover,.ccmsForm .fm-property-tag-related .related:hover,
.body-text blockquote:not(.tiktok-embed),.body-text .disclaimer
{
    color: violet;
}

.container .item .title:hover,.block.posts .item .title:hover,#quick-search-results .search-item-games:hover a,.forums p.buttons a:hover
{
    color: violet !important;
}

.container .item .description,article.article section.title .title .sub,.positive-negative .positives::before,.positive-negative .negatives::before,
.block .widget-header h2, .block .widget-header p,.related-articles h2.heading,.block .widget-header .actions a,.block .widget-header .actions a:hover,
.ccmsForm p.message, .ccmsForm p.fm-field-description,.gs-webResult.gs-result a.gs-title:visited, 
.gs-webResult.gs-result a.gs-title:visited b, .gs-imageResult a.gs-title:visited, .gs-imageResult a.gs-title:visited b,
.ui-listing-filters h2.heading,.container nav.ui-views .panels li a:hover,.container nav.ui-views .panels li .selected,
.container .style-tile .item .release-dates .region, .container .style-cover .item .release-dates .region, .related-games .item .heading .subtitle,
.container .style-reviews .item .release-dates .region,.container .style-tile .item .subtitle, .container .style-cover .item .subtitle, 
.container .style-reviews .item .subtitle,.content-listing th,.content-listing th a,div.Tokenize ul.TokensContainer li.Token
{
    color:  	orchid;
}

.related-articles .item a:visited,#footer .trending-articles .item a:visited,.container .item .title:visited,.menu-content-item a:visited
{
    color:  	orchid !important;
}

.container .style-tile .item .user-rating, .container .style-cover .item .user-rating, .container .style-reviews .item .user-rating
{
    color: #6adc98;
}

.positive-negative .positives li::before
{
        color: #00e300;
}

.forums p.buttons,section.text > p:nth-child(5)
{
    color: transparent;
}

.hero .hero-title .user-rating .rating .icon,.icon-star
{
    color: transparent;
    -webkit-text-stroke: 0.7px #fff;

}

.forum-post .message span.spoiler
{
      color: transparent; text-shadow: 1px 0 7px lavender,-1px 0 7px lavender;
}

.gcsc-find-more-on-google-magnifier
{
    fill: thistle;
}

.positive-negative ul li::before
{
    font-size: 25px;
}

.ccmsForm .textbox:hover,.ccmsForm .textbox,#ui-join-newsletter .textbox,#ui-join-newsletter .button,.ccmsForm textarea, .ccmsForm .textbox, 
.ccmsForm select,.gsc-input-box,.ui-listing-filter .ui-filter-search,.container .ui-listing-toggles select,.ccmsForm .preview,
div.Tokenize ul.TokensContainer, div.Tokenize ul.Dropdown,div.Tokenize ul.TokensContainer li.Token,.article-text table,.article-text table td
{
    border: 1px solid #3f2b68 !important;
}

.hero .linkbar a.current, .hero .linkbar a:hover
{
    border-bottom: 2px solid thistle;
}

.container .item,.accent-border,.gsc-control-cse,.gsc-webResult.gsc-result:hover,.gsc-webResult.gsc-result, .gsc-results .gsc-imageResult,
input.gsc-input, .gsc-input-box, .gsc-input-box-hover, .gsc-input-box-focus,.gsc-search-button-v2, .gsc-search-button-v2:hover, 
.gsc-search-button-v2:focus,.gsc-option-menu-item-highlighted,.gsc-results .gsc-cursor-box .gsc-cursor-page
{
    border-color: transparent !important;
}

.forum-post .message .userquote, .forum-post .message blockquote,.gsc-webResult.gsc-result,.gsc-completion-container,
.gs-result .gs-image, .gs-result .gs-promotion-image,fieldset#control-panel > fieldset,.ccmsForm .box
{
    border: 1px solid transparent;
}

.block .widget-header .actions a
{
    border: 3px solid transparent;
}

.container .style-list .item-medium,.container .style-list .item-insert,#game-overview .item,.author ul,
.related-articles .item,#footer .social,.forum-post,.forum-post .message .signature,.forums-list-topics .item,
article.article aside.see-also,.block footer,.body-text .disclaimer,.article-page .updated,.ccmsForm .fm-fieldset-contents,
.hero .hero-title .user-rating .rate-game .options li a,#sidebar .body > ul, #userbar .body > ul,.forums .category-forum,
.review .related-products,.cpanel .notifications .item, .cpanel .codes .item,.article-products-grid .item
{
    border-top: 1px solid transparent;
}

.block.posts .item,article.article section.title,.body-text h2,article.article div.body-text,.comments .comment,
#footer .social,.forums h1.title,.forum-post:last-child,.body-text .disclaimer,.body-text h3,.container nav.ui-views .panels li a,
.article-products-list .item, .article-products-grid .item,.gsc-above-wrapper-area,.ui-listing-filter h3.heading,.ui-listing-filters h2.heading,
.container nav.ui-views,.forum-post .subject,.forum-history .item,.ui-topics-list .title,.content-listing th,
.content-listing td,.container .status-options a, .container .score-options a
{
    border-bottom: 1px solid transparent;
}

.container .style-list .item-high.item-1 .item-wrap,.container .item .category,.block.number-list .item .category,
.positive-negative .positives,article.article .article-stats li,.hero .hero-title dl dd,#menu .main-menu-item
{
    border-right: 1px solid transparent;
}

.container .item .list li,.container .item-group .date,.comments .comment .ui-comment-tools li:not(:first-child),
.author ul li,#footer ul.list li a,.container .style-tile .item .subtitle, .container .style-cover .item .subtitle, 
.container .style-reviews .item .subtitle,.forum-post .tools li,.related-games .item .heading .subtitle
{
    border-left: 1px solid transparent;
}


.body-text .gallery .caption, .body-text .picture .caption
{
    border-left: 3px solid transparent;
}

.body-text blockquote:not(.tiktok-embed)
{
    border-left: 10px solid transparent;
}

#header .menubar,#submenus .submenu,#sidebar.fixed
{
    -webkit-box-shadow: none;
}

#submenus .submenu .submenu-list a:hover,#game-overview .buttons a:hover,.block .widget-header .actions a,.paginate .active,
.forum-post .message .userquote,.site-nintendolife .button:hover,.article-products .item ul li:not(.vendor) a:hover,
.ui-overlay.fixed,#submenus .submenu .submenu-list,.menu-content-item,#game-overview,#ui-join-newsletter .button:hover,
#ui-join-newsletter .button, .site-nintendolife .button,.gsc-search-button-v2, .gsc-search-button-v2:hover, .gsc-search-button-v2:focus,
.gsc-selected-option-container,.gsc-control-cse .gsc-option-menu,.gsc-completion-container,.flash p.info,.ccmsForm .fm-tabbed .fm-tabs .current a,
.ccmsForm .fm-property-tag-related .related:hover,div.Tokenize ul.TokensContainer li.Token,.flash p.error,
.body-text blockquote:not(.tiktok-embed),.disclaimer
{
    box-shadow: 0 2px 8px 1px #4d1970 !important;
}

.container .item .heading a:hover .title,.block.posts .item .title:hover,*
{
    text-decoration: none !important;
}

.block .widget-header h2, .block .widget-header p,.forum-post .message span.spoiler:hover
{
    text-shadow: none;
}

.container .item-insert div
{
    display: none;
}

.comments .comment .ui-comment-tools li:not(:first-child)
{
    opacity: 1;
}

.body-text blockquote:not(.tiktok-embed) p
{
    padding: 5px 2px;
}
}

@-moz-document domain("platform.twitter.com") {
body
  {background-color: transparent !important;}
  
  .r-14lw9ot,.r-1u4rsef
  {background-color: transparent !important;}

/* rgba(34, 1, 57, .7) */

.r-9x6qib
{border-radius: 0px !important;}
  
  .css-16my406
  {color: lavender;}
  
  .r-9x6qib
  {border-color: rgba(191, 130, 238, .4);}
  
  .r-glunga
  {border-color: transparent;}
  
  *
  {text-decoration: none !important;}
}`;
if ((location.hostname === "nintendolife.com" || location.hostname.endsWith(".nintendolife.com"))) {
  css += `



  body::-webkit-scrollbar 
  {
    width: 8px;               /* width of the entire scrollbar */
  }

  body::-webkit-scrollbar-track 
  {
    background: rgb(29, 1, 56);        /* color of the tracking area */
  }

  body::-webkit-scrollbar-thumb 
  {
    background-color: rgba(17, 0, 32, .5);    /* color of the scroll thumb */
    border-radius: 20px;       /* roundness of the scroll thumb */
    border: 2px solid #d000ff;  /* creates padding around scroll thumb */
  }


  ::-moz-selection 
    {background: #7d3d82; color: #FFF;}
    
    ::selection 
    {background: #7d3d82 !important; color: #FFF;}

  .twitter-tweet-rendered
  {
      background: rgba(17, 0, 32, .3);
  }

  body,#header .menubar
    {background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url(https://i.ibb.co/Vv1s0p4/0oQkS7c.jpg) !important;
    background-attachment: fixed!important;
    background-size: cover!important;}

  .hero .hero-title .user-rating,.hero .hero-title .user-actions a
  {
      background: rgba(17, 0, 32, .3);
  }

  .ui-button:hover ul a.whatsapp:hover,.ui-button:hover ul a.twitter:hover,.ui-button:hover ul a.facebook:hover,.ui-button:hover ul a.reddit:hover,
  .ui-button:hover ul a.messenger:hover,.ui-button:hover ul a.skype:hover
  {
      background: rgba(255,255,255,.05) !important;
  }

  .ui-button:hover ul
  {
      background: rgba(255,255,255,.05);
      backdrop-filter: blur(5px);
  }

  .hero .hero-title .user-rating .rate-game .options
  {
      backdrop-filter: blur(5px);
  }

  .paginate .active,.forum-post .message .userquote,#game-overview,.article-products .item ul li:not(.vendor) a:hover,
  .article-products .item ul li:not(.vendor) a,#ui-join-newsletter .textbox,#ui-join-newsletter .button:hover,#ui-join-newsletter .button,
  .ccmsForm .textbox,.ccmsForm textarea, .ccmsForm .textbox, .ccmsForm select,.gsc-input-box,.gsc-search-button-v2, .gsc-search-button-v2:hover, 
  .gsc-search-button-v2:focus,.gsc-selected-option-container,.ui-listing-filter .ui-filter-search,
  .container .ui-listing-toggles select,.ccmsForm .fm-tabbed .fm-tabs .current a,.ccmsForm .preview,div.Tokenize ul.TokensContainer li.Token,
  .hero .hero-title .user-rating .rate-game .options,.flash p.info, .site-nintendolife .button,.site-nintendolife .button:hover, .ccmsForm .button:hover,
  div.Tokenize ul.TokensContainer,.ccmsForm .fm-property-tag-related .related:hover,.ccmsForm .fm-property-tag-related .related,
  .article-text table,.flash p.error,.body-text blockquote:not(.tiktok-embed),.disclaimer
  {
      background: rgba(17, 0, 32, .3);
      /* backdrop-filter: blur(5px); */
      border-radius: 5px;
  }

  .user-actions
  {
      background: rgba(17, 0, 32, .3) !important;
      backdrop-filter: blur(5px);
      border-radius: 5px;
  }

  .ui-overlay.fixed,#submenus .submenu .submenu-list,.menu-content-item,.gsc-completion-container,div.Tokenize ul.Dropdown,
  .container .status-options, .container .score-options,.gsc-control-cse .gsc-option-menu
  {
      background: rgba(17, 0, 32, .5);
      backdrop-filter: blur(8px);
      border-radius: 5px;
  }

  .site-nintendolife #template,#body,.content,.container .item-group:hover,#submenus .submenu,.ui-overlay .buffer,
  .site-nintendolife .menubar, .site-nintendolife .ui-overlays,.block.posts .item:nth-child(2n),.insert-sticky,
  .site-nintendolife .accent-wrap, .site-nintendolife .block.section .widget-header, .site-nintendolife .ui-topics-list li, 
  .site-nintendolife .search-item-hubs .item-heading,.block.number-list .item:nth-child(2n),.block.number-list .item:hover,
  .container .style-simple .item-content,.block footer .more a:hover,.block footer .more,#submenus .submenu .submenu-list a:hover,
  .body-text .gallery, .body-text .picture,.body-text .gallery .generator, .body-text .picture .generator,.youtube,
  #game-overview .buttons a,.positive-negative,.comments div.comments .comment:hover,#gutter,#footer .trending-articles .item,
  #footer .trending-articles .more a:hover,.block .widget-header .actions a:hover,.forum-post:hover,.breadcrumbs,
  .site-nintendolife .accent-wrap, .site-nintendolife .block .widget-header, .site-nintendolife .ui-topics-list li, 
  .site-nintendolife .search-item-hubs .item-heading,.forums-list-topics .item:hover,.forums-list-topics .item, .forum-post .message blockquote,
  .body-text .picture img[data-original], .body-text .gallery img[data-original],.block footer,
  .site-nintendolife .block header,#game-overview .body,.block,.body-text .pictures .swiper-slide,
  #quick-search-results,#quick-search-results .actions,#quick-search,#quick-search .controls,.article-products .item ul,#ad_tech_partners,
  .ccmsForm .fm-fieldset-contents,.body-text hr,.gsc-completion-selected,.ui-listing-filters .ui-listing-filters-body,
  .ui-listing-filter h3.heading:hover,.container .style-cover .item,.forums .category-forum,.forums .category-forum:hover,
  .hero .hero-title .user-rating .rate-game .options li a.current,.content-listing th,.forum-post .message span.spoiler:hover,
  .hero .hero-title .user-rating .rate-game .options li a:hover,.forum-post .message span.spoiler,article.article .table-of-contents,
  .forum-post .message hr,.comments .comment.highlight,.article-products .item ul li:last-child,
  .cpanel .notifications .item:hover, .cpanel .codes .item:hover,.article-text table th,.ccmsForm .box
  {
      background: transparent;
  }

  #game-overview .buttons a:hover,.gsc-input
  {
      background: transparent !important;
  }

  .ccmsForm .fm-fieldset legend, .accent-bg-hover:hover,
  .accent-bg, .ccmsForm .fm-fieldset legend, .accent-bg-hover:hover,
  .container .item .image,.gsc-control-cse,.gsc-webResult.gsc-result:hover,.gsc-webResult.gsc-result, .gsc-results .gsc-imageResult,
  .gsc-option-menu-item-highlighted,.gsc-results .gsc-cursor-box .gsc-cursor-page,div.Tokenize ul.TokensContainer li.TokenSearch input
  {
      background-color: transparent;
  }

  .block .widget-header,.ui-change-topic
  {
      background-color: transparent !important;
  }

  .site-nintendolife #footer
  {
      background-image: none;
  }

  .comments .comment .ui-comment-tools .has-liked,.comments .comment .ui-comment-tools .has-liked .icon,.has-liked
  {
      color: #ff1a1a !important;
  }

  .accent span.icon
  {
      color: white;
  }

  .block.number-list .item .prefix,.container .item-group,.container .style-list .item-medium .text,.container .item .list,
  .block.posts .item .info strong,.block.posts .item .info .description,body,article.article section.title .description,
  article.article section.title .version,article.article section.byline .article-author,.related-articles .item .description,
  .body-text .gallery .generator, .body-text .picture .generator,.author .text,.content .empty,#footer .trending-articles .item,
  .paginate,.forum-post .message .signature,.forum-post .message .last-edited,.forum-history .empty,.forums-list-topics .item,
  .forums-list-topics .item dl dd,.menu-content-item .subtitle,article.article div.body-text .source,#quick-search .textbox,
  .register .fm-field-name, .login .fm-field-name, .auth .fm-field-name,#quick-search-results,#quick-search-results .actions,
  .article .related-products .disclaimer,.article-page .updated,#ui-join-newsletter .textbox,.gsc-result-info,.gsc-orderby-label,
  .gs-webResult:not(.gs-no-results-result):not(.gs-error-result) .gs-snippet, .gs-fileFormatType,.gs-webResult div.gs-visibleUrl,
  .gsc-input,.gsc-selected-option-container,.share-this,.ui-listing-filter .ui-filter-search,.container .ui-listing-toggles select,
  #comments .comments:empty::before,.hero,.ccmsForm .fm-fieldset p.description,.ccmsForm .preview,p.last-updated, .author_info,
  .comments .comment .info,.forums .category-forum,.forum-history .item,#controlbar .ui-userinfo p.subtitle,.forum-post .message span.spoiler:hover,
  div.TokenizeMeasure, div.Tokenize ul li span, div.Tokenize ul.TokensContainer li.TokenSearch input,form#comment .rules,
  .body-text .gallery .caption, .body-text .picture .caption,#userbar .ui-user-notifications-list li a span,
  .forums p.topic-locked, .forums p.empty
  {
      color: lavender;
  }

  .block.number-list .item .title,.container .item .title,.block.posts .item .title,#submenus .submenu .submenu-list a,
  .text a, .forums .text a, .accent, .forums .unread a, .forums .unread .item-title .icon, .forums .unread .forum-title .icon,
  .container .item .title,.block footer .more a,article.article section.byline .article-author a,#game-overview .buttons a,.author ul a,
  .comments .comment .ui-comment-tools a,.comments .comment:hover .ui-comment-tools,.comments p.empty a,.cpanel .delete-account a,
  .container .item .title:visited span,.container .item .list a,.container .style-list .item-medium .list a,.forum-post .message .signature a,
  .container .item .title:visited span.title,.paginate a,.forums a,.forums a.accent,.breadcrumbs,.forum-history a,.body-text .disclaimer a,
  .comments .comment:hover .ui-comment-tools a,.comments .comment:hover .ui-comment-tools a:hover,.site-nintendolife a,.ccmsForm .button,
  .article .related-products .disclaimer a,.article-products .item ul li a,#ui-join-newsletter .button,.ccmsForm textarea, 
  .ccmsForm .textbox, .ccmsForm select,.container .style-features .item-content .text,.gs-webResult.gs-result a.gs-title:link, 
  .gs-webResult.gs-result a.gs-title:link b, .gs-imageResult a.gs-title:link, .gs-imageResult a.gs-title:link b,.gsc-option-menu-item,
  .gsc-results .gsc-cursor-box .gsc-cursor-page,.gcsc-find-more-on-google,.ui-listing-filter h3.heading,.container .item .description a,
  .ui-listing-filters .fm-checkbox,fieldset#control-panel a,.ccmsForm .fm-tabbed .fm-tabs a,.ui-listing-filters ul.tools a,.focus-icon,
  article.article .scoring .policy a,.icon.icon-star.accent,.article-products .item ul del,.ccmsForm .fm-property-tag-related .related,
  .content-listing td a,.related-games .item .heading a
  {
      color: thistle;
  }

  .block footer .more a:hover,#submenus .submenu .submenu-list a.ui-change-topic:hover,#game-overview .buttons a:hover,.paginate a:hover,
  .author ul a:hover,.comments .comment:hover .ui-comment-tools a:hover,#footer .trending-articles .more a:hover,.container .item .list a:hover,
  .paginate .active,.site-nintendolife .button:hover,.register, .login, .auth,fieldset#control-panel a:hover,
  .article-products .item ul li:not(.vendor) a:hover,#ui-join-newsletter .button:hover,.gs-webResult.gs-result a.gs-title:hover, 
  .gs-webResult.gs-result a.gs-title:hover b, .gs-imageResult a.gs-title:hover, .gs-imageResult a.gs-title:hover b,.gsc-option-menu-item-highlighted,
  .gsc-completion-selected,.ui-listing-filters .fm-checkbox-selected,.ui-listing-filters .fm-checkbox label:hover,.flash p,.content-listing td a:hover,
  .ccmsForm .fm-tabbed .fm-tabs .current a,.ui-listing-filters ul.tools a:hover,.accent-hover:hover,.ccmsForm .fm-property-tag-related .related:hover,
  .body-text blockquote:not(.tiktok-embed),.body-text .disclaimer
  {
      color: violet;
  }

  .container .item .title:hover,.block.posts .item .title:hover,#quick-search-results .search-item-games:hover a,.forums p.buttons a:hover
  {
      color: violet !important;
  }

  .container .item .description,article.article section.title .title .sub,.positive-negative .positives::before,.positive-negative .negatives::before,
  .block .widget-header h2, .block .widget-header p,.related-articles h2.heading,.block .widget-header .actions a,.block .widget-header .actions a:hover,
  .ccmsForm p.message, .ccmsForm p.fm-field-description,.gs-webResult.gs-result a.gs-title:visited, 
  .gs-webResult.gs-result a.gs-title:visited b, .gs-imageResult a.gs-title:visited, .gs-imageResult a.gs-title:visited b,
  .ui-listing-filters h2.heading,.container nav.ui-views .panels li a:hover,.container nav.ui-views .panels li .selected,
  .container .style-tile .item .release-dates .region, .container .style-cover .item .release-dates .region, .related-games .item .heading .subtitle,
  .container .style-reviews .item .release-dates .region,.container .style-tile .item .subtitle, .container .style-cover .item .subtitle, 
  .container .style-reviews .item .subtitle,.content-listing th,.content-listing th a,div.Tokenize ul.TokensContainer li.Token
  {
      color:  	orchid;
  }

  .related-articles .item a:visited,#footer .trending-articles .item a:visited,.container .item .title:visited,.menu-content-item a:visited
  {
      color:  	orchid !important;
  }

  .container .style-tile .item .user-rating, .container .style-cover .item .user-rating, .container .style-reviews .item .user-rating
  {
      color: #6adc98;
  }

  .positive-negative .positives li::before
  {
          color: #00e300;
  }

  .forums p.buttons,section.text > p:nth-child(5)
  {
      color: transparent;
  }

  .hero .hero-title .user-rating .rating .icon,.icon-star
  {
      color: transparent;
      -webkit-text-stroke: 0.7px #fff;

  }

  .forum-post .message span.spoiler
  {
        color: transparent; text-shadow: 1px 0 7px lavender,-1px 0 7px lavender;
  }

  .gcsc-find-more-on-google-magnifier
  {
      fill: thistle;
  }

  .positive-negative ul li::before
  {
      font-size: 25px;
  }

  .ccmsForm .textbox:hover,.ccmsForm .textbox,#ui-join-newsletter .textbox,#ui-join-newsletter .button,.ccmsForm textarea, .ccmsForm .textbox, 
  .ccmsForm select,.gsc-input-box,.ui-listing-filter .ui-filter-search,.container .ui-listing-toggles select,.ccmsForm .preview,
  div.Tokenize ul.TokensContainer, div.Tokenize ul.Dropdown,div.Tokenize ul.TokensContainer li.Token,.article-text table,.article-text table td
  {
      border: 1px solid #3f2b68 !important;
  }

  .hero .linkbar a.current, .hero .linkbar a:hover
  {
      border-bottom: 2px solid thistle;
  }

  .container .item,.accent-border,.gsc-control-cse,.gsc-webResult.gsc-result:hover,.gsc-webResult.gsc-result, .gsc-results .gsc-imageResult,
  input.gsc-input, .gsc-input-box, .gsc-input-box-hover, .gsc-input-box-focus,.gsc-search-button-v2, .gsc-search-button-v2:hover, 
  .gsc-search-button-v2:focus,.gsc-option-menu-item-highlighted,.gsc-results .gsc-cursor-box .gsc-cursor-page
  {
      border-color: transparent !important;
  }

  .forum-post .message .userquote, .forum-post .message blockquote,.gsc-webResult.gsc-result,.gsc-completion-container,
  .gs-result .gs-image, .gs-result .gs-promotion-image,fieldset#control-panel > fieldset,.ccmsForm .box
  {
      border: 1px solid transparent;
  }

  .block .widget-header .actions a
  {
      border: 3px solid transparent;
  }

  .container .style-list .item-medium,.container .style-list .item-insert,#game-overview .item,.author ul,
  .related-articles .item,#footer .social,.forum-post,.forum-post .message .signature,.forums-list-topics .item,
  article.article aside.see-also,.block footer,.body-text .disclaimer,.article-page .updated,.ccmsForm .fm-fieldset-contents,
  .hero .hero-title .user-rating .rate-game .options li a,#sidebar .body > ul, #userbar .body > ul,.forums .category-forum,
  .review .related-products,.cpanel .notifications .item, .cpanel .codes .item,.article-products-grid .item
  {
      border-top: 1px solid transparent;
  }

  .block.posts .item,article.article section.title,.body-text h2,article.article div.body-text,.comments .comment,
  #footer .social,.forums h1.title,.forum-post:last-child,.body-text .disclaimer,.body-text h3,.container nav.ui-views .panels li a,
  .article-products-list .item, .article-products-grid .item,.gsc-above-wrapper-area,.ui-listing-filter h3.heading,.ui-listing-filters h2.heading,
  .container nav.ui-views,.forum-post .subject,.forum-history .item,.ui-topics-list .title,.content-listing th,
  .content-listing td,.container .status-options a, .container .score-options a
  {
      border-bottom: 1px solid transparent;
  }

  .container .style-list .item-high.item-1 .item-wrap,.container .item .category,.block.number-list .item .category,
  .positive-negative .positives,article.article .article-stats li,.hero .hero-title dl dd,#menu .main-menu-item
  {
      border-right: 1px solid transparent;
  }

  .container .item .list li,.container .item-group .date,.comments .comment .ui-comment-tools li:not(:first-child),
  .author ul li,#footer ul.list li a,.container .style-tile .item .subtitle, .container .style-cover .item .subtitle, 
  .container .style-reviews .item .subtitle,.forum-post .tools li,.related-games .item .heading .subtitle
  {
      border-left: 1px solid transparent;
  }


  .body-text .gallery .caption, .body-text .picture .caption
  {
      border-left: 3px solid transparent;
  }

  .body-text blockquote:not(.tiktok-embed)
  {
      border-left: 10px solid transparent;
  }

  #header .menubar,#submenus .submenu,#sidebar.fixed
  {
      -webkit-box-shadow: none;
  }

  #submenus .submenu .submenu-list a:hover,#game-overview .buttons a:hover,.block .widget-header .actions a,.paginate .active,
  .forum-post .message .userquote,.site-nintendolife .button:hover,.article-products .item ul li:not(.vendor) a:hover,
  .ui-overlay.fixed,#submenus .submenu .submenu-list,.menu-content-item,#game-overview,#ui-join-newsletter .button:hover,
  #ui-join-newsletter .button, .site-nintendolife .button,.gsc-search-button-v2, .gsc-search-button-v2:hover, .gsc-search-button-v2:focus,
  .gsc-selected-option-container,.gsc-control-cse .gsc-option-menu,.gsc-completion-container,.flash p.info,.ccmsForm .fm-tabbed .fm-tabs .current a,
  .ccmsForm .fm-property-tag-related .related:hover,div.Tokenize ul.TokensContainer li.Token,.flash p.error,
  .body-text blockquote:not(.tiktok-embed),.disclaimer
  {
      box-shadow: 0 2px 8px 1px #4d1970 !important;
  }

  .container .item .heading a:hover .title,.block.posts .item .title:hover,*
  {
      text-decoration: none !important;
  }

  .block .widget-header h2, .block .widget-header p,.forum-post .message span.spoiler:hover
  {
      text-shadow: none;
  }

  .container .item-insert div
  {
      display: none;
  }

  .comments .comment .ui-comment-tools li:not(:first-child)
  {
      opacity: 1;
  }

  .body-text blockquote:not(.tiktok-embed) p
  {
      padding: 5px 2px;
  }
  `;
}
if ((location.hostname === "platform.twitter.com" || location.hostname.endsWith(".platform.twitter.com"))) {
  css += `
  body
    {background-color: transparent !important;}
    
    .r-14lw9ot,.r-1u4rsef
    {background-color: transparent !important;}

  /* rgba(34, 1, 57, .7) */

  .r-9x6qib
  {border-radius: 0px !important;}
    
    .css-16my406
    {color: lavender;}
    
    .r-9x6qib
    {border-color: rgba(191, 130, 238, .4);}
    
    .r-glunga
    {border-color: transparent;}
    
    *
    {text-decoration: none !important;}
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
