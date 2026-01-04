// ==UserScript==
// @id             bimzcy@gmail.com
// @name           豆瓣电影PT资源搜索
// @description    在Exhen Chen版本基础上修改，增加更多pt站。
// @author         白鸽男孩
// @connect        *
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @require        http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require        https://greasyfork.org/scripts/368137-encodetogb2312/code/encodeToGb2312.js?version=598005
// @include        https://movie.douban.com/subject/*
// @version        2018051801
// @run-at         document-start
// @namespace      doveboy_js
// @downloadURL https://update.greasyfork.org/scripts/40933/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1PT%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/40933/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1PT%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

// add back in GM_addStyle for scripts in @grant none mode
if (typeof GM_addStyle === "undefined") {
    function GM_addStyle (cssStr) {
        let D               = document;
        let newNode         = D.createElement ('style');
        newNode.textContent = cssStr;

        let targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (newNode);
    }
}

let myScriptStyle = "@charset utf-8;#dale_movie_subject_top_right,#dale_movie_subject_top_right,#dale_movie_subject_top_midle,#dale_movie_subject_middle_right,#dale_movie_subject_bottom_super_banner,#footer,#dale_movie_subject_download_middle,#dale_movie_subject_inner_middle,#movie_home_left_bottom,#dale_movie_home_top_right,#dale_movie_home_side_top,#dale_movie_home_bottom_right,#dale_movie_home_inner_bottom,#dale_movie_home_download_bottom,#dale_movie_home_bottom_right_down,#dale_movie_towhome_explore_right,#dale_movie_chart_top_right,#dale_movie_tags_top_right,#dale_review_best_top_right,.mobile-app-entrance.block5.app-movie,.qrcode-app,.top-nav-doubanapp,.extra,div.gray_ad,p.pl,div.ticket{display:none}.c-aside{margin-bottom:30px}.c-aside-body{*letter-spacing:normal}.c-aside-body a{border-radius:6px;color:#37A;display:inline-block;letter-spacing:normal;margin:0 8px 8px 0;padding:0 8px;text-align:center;width:65px}.c-aside-body a:link,.c-aside-body a:visited{background-color:#f5f5f5;color:#37A}.c-aside-body a:hover,.c-aside-body a:active{background-color:#e8e8e8;color:#37A}.c-aside-body a.disabled{}.c-aside-body a.available{background-color:#5ccccc;color:#006363}.c-aside-body a.available:hover,.c-aside-body a.available:active{background-color:#3cc}.c-aside-body a.sites_r0{text-decoration:line-through}#c_dialog li{margin:10px}#c_dialog{text-align:center}#interest_sectl .rating_imdb{border-top:1px solid #eaeaea;border-bottom:1px solid #eaeaea;padding-bottom:0}#interest_sectl .rating_wrap{padding-top:15px}#interest_sectl .rating_more{border-bottom:1px solid #eaeaea;color:#9b9b9b;margin:0;padding:15px 0;position:relative}#interest_sectl .rating_more a{left:80px;position:absolute}#interest_sectl .rating_more .titleOverviewSprite{background:url(https://coding.net/u/Changhw/p/MyDoubanMovieHelper/git/raw/master/title_overview_sprite.png) no-repeat;display:inline-block;vertical-align:middle}#interest_sectl .rating_more .popularityImageUp{background-position:-14px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityImageDown{background-position:-34px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityUpOrFlat{color:#83C40B}#interest_sectl .rating_more .popularityDown{color:#930E02}/*!jQuery UI - v1.12.1 - 2016-09-14 * http://jqueryui.com * Includes:core.css,accordion.css,autocomplete.css,menu.css,button.css,controlgroup.css,checkboxradio.css,datepicker.css,dialog.css,draggable.css,resizable.css,progressbar.css,selectable.css,selectmenu.css,slider.css,sortable.css,spinner.css,tabs.css,tooltip.css,theme.css * To view and modify this theme,visit http://jqueryui.com/themeroller/?bgShadowXPos=&bgOverlayXPos=&bgErrorXPos=&bgHighlightXPos=&bgContentXPos=&bgHeaderXPos=&bgActiveXPos=&bgHoverXPos=&bgDefaultXPos=&bgShadowYPos=&bgOverlayYPos=&bgErrorYPos=&bgHighlightYPos=&bgContentYPos=&bgHeaderYPos=&bgActiveYPos=&bgHoverYPos=&bgDefaultYPos=&bgShadowRepeat=&bgOverlayRepeat=&bgErrorRepeat=&bgHighlightRepeat=&bgContentRepeat=&bgHeaderRepeat=&bgActiveRepeat=&bgHoverRepeat=&bgDefaultRepeat=&iconsHover=url(%22images%2Fui-icons_555555_256x240.png%22)&iconsHighlight=url(%22images%2Fui-icons_777620_256x240.png%22)&iconsHeader=url(%22images%2Fui-icons_444444_256x240.png%22)&iconsError=url(%22images%2Fui-icons_cc0000_256x240.png%22)&iconsDefault=url(%22images%2Fui-icons_777777_256x240.png%22)&iconsContent=url(%22images%2Fui-icons_444444_256x240.png%22)&iconsActive=url(%22images%2Fui-icons_ffffff_256x240.png%22)&bgImgUrlShadow=&bgImgUrlOverlay=&bgImgUrlHover=&bgImgUrlHighlight=&bgImgUrlHeader=&bgImgUrlError=&bgImgUrlDefault=&bgImgUrlContent=&bgImgUrlActive=&opacityFilterShadow=Alpha(Opacity%3D30)&opacityFilterOverlay=Alpha(Opacity%3D30)&opacityShadowPerc=30&opacityOverlayPerc=30&iconColorHover=%23555555&iconColorHighlight=%23777620&iconColorHeader=%23444444&iconColorError=%23cc0000&iconColorDefault=%23777777&iconColorContent=%23444444&iconColorActive=%23ffffff&bgImgOpacityShadow=0&bgImgOpacityOverlay=0&bgImgOpacityError=95&bgImgOpacityHighlight=55&bgImgOpacityContent=75&bgImgOpacityHeader=75&bgImgOpacityActive=65&bgImgOpacityHover=75&bgImgOpacityDefault=75&bgTextureShadow=flat&bgTextureOverlay=flat&bgTextureError=flat&bgTextureHighlight=flat&bgTextureContent=flat&bgTextureHeader=flat&bgTextureActive=flat&bgTextureHover=flat&bgTextureDefault=flat&cornerRadius=3px&fwDefault=normal&ffDefault=Arial%2CHelvetica%2Csans-serif&fsDefault=1em&cornerRadiusShadow=8px&thicknessShadow=5px&offsetLeftShadow=0px&offsetTopShadow=0px&opacityShadow=.3&bgColorShadow=%23666666&opacityOverlay=.3&bgColorOverlay=%23aaaaaa&fcError=%235f3f3f&borderColorError=%23f1a899&bgColorError=%23fddfdf&fcHighlight=%23777620&borderColorHighlight=%23dad55e&bgColorHighlight=%23fffa90&fcContent=%23333333&borderColorContent=%23dddddd&bgColorContent=%23ffffff&fcHeader=%23333333&borderColorHeader=%23dddddd&bgColorHeader=%23e9e9e9&fcActive=%23ffffff&borderColorActive=%23003eff&bgColorActive=%23007fff&fcHover=%232b2b2b&borderColorHover=%23cccccc&bgColorHover=%23ededed&fcDefault=%23454545&borderColorDefault=%23c5c5c5&bgColorDefault=%23f6f6f6 * Copyright jQuery Foundation and other contributors;Licensed MIT */ .ui-helper-hidden{display:none}.ui-helper-hidden-accessible{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.ui-helper-reset{border:0;font-size:100%;line-height:1.3;list-style:none;margin:0;outline:0;padding:0;text-decoration:none}.ui-helper-clearfix:before,.ui-helper-clearfix:after{border-collapse:collapse;content:'';display:table}.ui-helper-clearfix:after{clear:both}.ui-helper-zfix{height:100%;left:0;opacity:0;position:absolute;top:0;width:100%;filter:Alpha(Opacity=0)}.ui-front{z-index:100}.ui-state-disabled{cursor:default !important;pointer-events:none}.ui-icon{background-repeat:no-repeat;display:inline-block;margin-top:-.25em;overflow:hidden;position:relative;text-indent:-99999px;vertical-align:middle}.ui-widget-icon-block{display:block;left:50%;margin-left:-8px}.ui-widget-overlay{height:100%;left:0;position:fixed;top:0;width:100%}.ui-accordion .ui-accordion-header{cursor:pointer;display:block;font-size:100%;margin:2px 0 0 0;padding:.5em .5em .5em .7em;position:relative}.ui-accordion .ui-accordion-content{border-top:0;overflow:auto;padding:1em 2.2em}.ui-autocomplete{cursor:default;left:0;position:absolute;top:0}.ui-menu{display:block;list-style:none;margin:0;outline:0;padding:0}.ui-menu .ui-menu{position:absolute}.ui-menu .ui-menu-item{cursor:pointer;list-style-image:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7);margin:0}.ui-menu .ui-menu-item-wrapper{padding:3px 1em 3px .4em;position:relative}.ui-menu .ui-menu-divider{border-width:1px 0 0 0;font-size:0;height:0;line-height:0;margin:5px 0}.ui-menu .ui-state-focus,.ui-menu .ui-state-active{margin:-1px}.ui-menu-icons{position:relative}.ui-menu-icons .ui-menu-item-wrapper{padding-left:2em}.ui-menu .ui-icon{bottom:0;left:.2em;margin:auto 0;position:absolute;top:0}.ui-menu .ui-menu-icon{left:auto;right:0}.ui-button{cursor:pointer;display:inline-block;line-height:normal;margin-right:.1em;overflow:visible;padding:.4em 1em;position:relative;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ui-button,.ui-button:link,.ui-button:visited,.ui-button:hover,.ui-button:active{text-decoration:none}.ui-button-icon-only{box-sizing:border-box;text-indent:-9999px;white-space:nowrap;width:2em}input.ui-button.ui-button-icon-only{text-indent:0}.ui-button-icon-only .ui-icon{left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%}.ui-button.ui-icon-notext .ui-icon{height:2.1em;padding:0;text-indent:-9999px;white-space:nowrap;width:2.1em}input.ui-button.ui-icon-notext .ui-icon{height:auto;padding:.4em 1em;text-indent:0;white-space:normal;width:auto}input.ui-button::-moz-focus-inner,button.ui-button::-moz-focus-inner{border:0;padding:0}.ui-controlgroup{display:inline-block;vertical-align:middle}.ui-controlgroup>.ui-controlgroup-item{float:left;margin-left:0;margin-right:0}.ui-controlgroup>.ui-controlgroup-item:focus,.ui-controlgroup>.ui-controlgroup-item.ui-visual-focus{z-index:9999}.ui-controlgroup-vertical>.ui-controlgroup-item{display:block;float:none;margin-bottom:0;margin-top:0;text-align:left;width:100%}.ui-controlgroup-vertical .ui-controlgroup-item{box-sizing:border-box}.ui-controlgroup .ui-controlgroup-label{padding:.4em 1em}.ui-controlgroup .ui-controlgroup-label span{font-size:80%}.ui-controlgroup-horizontal .ui-controlgroup-label + .ui-controlgroup-item{border-left:none}.ui-controlgroup-vertical .ui-controlgroup-label + .ui-controlgroup-item{border-top:none}.ui-controlgroup-horizontal .ui-controlgroup-label.ui-widget-content{border-right:none}.ui-controlgroup-vertical .ui-controlgroup-label.ui-widget-content{border-bottom:none}.ui-controlgroup-vertical .ui-spinner-input{width:75%;width:calc(100% - 2.4em)}.ui-controlgroup-vertical .ui-spinner .ui-spinner-up{border-top-style:solid}.ui-checkboxradio-label .ui-icon-background{border:0;border-radius:.12em;box-shadow:inset 1px 1px 1px #ccc}.ui-checkboxradio-radio-label .ui-icon-background{border:0;border-radius:1em;height:16px;overflow:visible;width:16px}.ui-checkboxradio-radio-label.ui-checkboxradio-checked .ui-icon,.ui-checkboxradio-radio-label.ui-checkboxradio-checked:hover .ui-icon{background-image:none;border-style:solid;border-width:4px;height:8px;width:8px}.ui-checkboxradio-disabled{pointer-events:none}.ui-datepicker{display:none;padding:.2em .2em 0;width:17em}.ui-datepicker .ui-datepicker-header{padding:.2em 0;position:relative}.ui-datepicker .ui-datepicker-prev,.ui-datepicker .ui-datepicker-next{height:1.8em;position:absolute;top:2px;width:1.8em}.ui-datepicker .ui-datepicker-prev-hover,.ui-datepicker .ui-datepicker-next-hover{top:1px}.ui-datepicker .ui-datepicker-prev{left:2px}.ui-datepicker .ui-datepicker-next{right:2px}.ui-datepicker .ui-datepicker-prev-hover{left:1px}.ui-datepicker .ui-datepicker-next-hover{right:1px}.ui-datepicker .ui-datepicker-prev span,.ui-datepicker .ui-datepicker-next span{display:block;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%}.ui-datepicker .ui-datepicker-title{line-height:1.8em;margin:0 2.3em;text-align:center}.ui-datepicker .ui-datepicker-title select{font-size:1em;margin:1px 0}.ui-datepicker select.ui-datepicker-month,.ui-datepicker select.ui-datepicker-year{width:45%}.ui-datepicker table{border-collapse:collapse;font-size:.9em;margin:0 0 .4em;width:100%}.ui-datepicker th{border:0;font-weight:bold;padding:.7em .3em;text-align:center}.ui-datepicker td{border:0;padding:1px}.ui-datepicker td span,.ui-datepicker td a{display:block;padding:.2em;text-align:right;text-decoration:none}.ui-datepicker .ui-datepicker-buttonpane{background-image:none;border-bottom:0;border-left:0;border-right:0;margin:.7em 0 0 0;padding:0 .2em}.ui-datepicker .ui-datepicker-buttonpane button{cursor:pointer;float:right;margin:.5em .2em .4em;overflow:visible;padding:.2em .6em .3em .6em;width:auto}.ui-datepicker .ui-datepicker-buttonpane button.ui-datepicker-current{float:left}.ui-datepicker.ui-datepicker-multi{width:auto}.ui-datepicker-multi .ui-datepicker-group{float:left}.ui-datepicker-multi .ui-datepicker-group table{margin:0 auto .4em;width:95%}.ui-datepicker-multi-2 .ui-datepicker-group{width:50%}.ui-datepicker-multi-3 .ui-datepicker-group{width:33.3%}.ui-datepicker-multi-4 .ui-datepicker-group{width:25%}.ui-datepicker-multi .ui-datepicker-group-last .ui-datepicker-header,.ui-datepicker-multi .ui-datepicker-group-middle .ui-datepicker-header{border-left-width:0}.ui-datepicker-multi .ui-datepicker-buttonpane{clear:left}.ui-datepicker-row-break{clear:both;font-size:0;width:100%}.ui-datepicker-rtl{direction:rtl}.ui-datepicker-rtl .ui-datepicker-prev{left:auto;right:2px}.ui-datepicker-rtl .ui-datepicker-next{left:2px;right:auto}.ui-datepicker-rtl .ui-datepicker-prev:hover{left:auto;right:1px}.ui-datepicker-rtl .ui-datepicker-next:hover{left:1px;right:auto}.ui-datepicker-rtl .ui-datepicker-buttonpane{clear:right}.ui-datepicker-rtl .ui-datepicker-buttonpane button{float:left}.ui-datepicker-rtl .ui-datepicker-buttonpane button.ui-datepicker-current,.ui-datepicker-rtl .ui-datepicker-group{float:right}.ui-datepicker-rtl .ui-datepicker-group-last .ui-datepicker-header,.ui-datepicker-rtl .ui-datepicker-group-middle .ui-datepicker-header{border-left-width:1px;border-right-width:0}.ui-datepicker .ui-icon{background-repeat:no-repeat;display:block;left:.5em;overflow:hidden;text-indent:-99999px;top:.3em}.ui-dialog{left:0;outline:0;padding:.2em;position:absolute;top:0}.ui-dialog .ui-dialog-titlebar{padding:.4em 1em;position:relative}.ui-dialog .ui-dialog-title{float:left;margin:.1em 0;overflow:hidden;white-space:nowrap;width:90%;text-overflow:ellipsis}.ui-dialog .ui-dialog-titlebar-close{height:20px;margin:-10px 0 0 0;padding:1px;position:absolute;right:.3em;top:50%;width:20px}.ui-dialog .ui-dialog-content{background:none;border:0;overflow:auto;padding:.5em 1em;position:relative}.ui-dialog .ui-dialog-buttonpane{background-image:none;border-width:1px 0 0 0;margin-top:.5em;padding:.3em 1em .5em .4em;text-align:left}.ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset{float:right}.ui-dialog .ui-dialog-buttonpane button{cursor:pointer;margin:.5em .4em .5em 0}.ui-dialog .ui-resizable-n{height:2px;top:0}.ui-dialog .ui-resizable-e{right:0;width:2px}.ui-dialog .ui-resizable-s{bottom:0;height:2px}.ui-dialog .ui-resizable-w{left:0;width:2px}.ui-dialog .ui-resizable-se,.ui-dialog .ui-resizable-sw,.ui-dialog .ui-resizable-ne,.ui-dialog .ui-resizable-nw{height:7px;width:7px}.ui-dialog .ui-resizable-se{bottom:0;right:0}.ui-dialog .ui-resizable-sw{bottom:0;left:0}.ui-dialog .ui-resizable-ne{right:0;top:0}.ui-dialog .ui-resizable-nw{left:0;top:0}.ui-draggable .ui-dialog-titlebar{cursor:move}.ui-draggable-handle{-ms-touch-action:none;touch-action:none}.ui-resizable{position:relative}.ui-resizable-handle{display:block;font-size:.1px;position:absolute;-ms-touch-action:none;touch-action:none}.ui-resizable-disabled .ui-resizable-handle,.ui-resizable-autohide .ui-resizable-handle{display:none}.ui-resizable-n{cursor:n-resize;height:7px;left:0;top:-5px;width:100%}.ui-resizable-s{bottom:-5px;cursor:s-resize;height:7px;left:0;width:100%}.ui-resizable-e{cursor:e-resize;height:100%;right:-5px;top:0;width:7px}.ui-resizable-w{cursor:w-resize;height:100%;left:-5px;top:0;width:7px}.ui-resizable-se{bottom:1px;cursor:se-resize;height:12px;right:1px;width:12px}.ui-resizable-sw{bottom:-5px;cursor:sw-resize;height:9px;left:-5px;width:9px}.ui-resizable-nw{cursor:nw-resize;height:9px;left:-5px;top:-5px;width:9px}.ui-resizable-ne{cursor:ne-resize;height:9px;right:-5px;top:-5px;width:9px}.ui-progressbar{height:2em;overflow:hidden;text-align:left}.ui-progressbar .ui-progressbar-value{height:100%;margin:-1px}.ui-progressbar .ui-progressbar-overlay{background:url(data:image/gif;base64,R0lGODlhKAAoAIABAAAAAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJAQABACwAAAAAKAAoAAACkYwNqXrdC52DS06a7MFZI+4FHBCKoDeWKXqymPqGqxvJrXZbMx7Ttc+w9XgU2FB3lOyQRWET2IFGiU9m1frDVpxZZc6bfHwv4c1YXP6k1Vdy292Fb6UkuvFtXpvWSzA+HycXJHUXiGYIiMg2R6W459gnWGfHNdjIqDWVqemH2ekpObkpOlppWUqZiqr6edqqWQAAIfkECQEAAQAsAAAAACgAKAAAApSMgZnGfaqcg1E2uuzDmmHUBR8Qil95hiPKqWn3aqtLsS18y7G1SzNeowWBENtQd+T1JktP05nzPTdJZlR6vUxNWWjV+vUWhWNkWFwxl9VpZRedYcflIOLafaa28XdsH/ynlcc1uPVDZxQIR0K25+cICCmoqCe5mGhZOfeYSUh5yJcJyrkZWWpaR8doJ2o4NYq62lAAACH5BAkBAAEALAAAAAAoACgAAAKVDI4Yy22ZnINRNqosw0Bv7i1gyHUkFj7oSaWlu3ovC8GxNso5fluz3qLVhBVeT/Lz7ZTHyxL5dDalQWPVOsQWtRnuwXaFTj9jVVh8pma9JjZ4zYSj5ZOyma7uuolffh+IR5aW97cHuBUXKGKXlKjn+DiHWMcYJah4N0lYCMlJOXipGRr5qdgoSTrqWSq6WFl2ypoaUAAAIfkECQEAAQAsAAAAACgAKAAAApaEb6HLgd/iO7FNWtcFWe+ufODGjRfoiJ2akShbueb0wtI50zm02pbvwfWEMWBQ1zKGlLIhskiEPm9R6vRXxV4ZzWT2yHOGpWMyorblKlNp8HmHEb/lCXjcW7bmtXP8Xt229OVWR1fod2eWqNfHuMjXCPkIGNileOiImVmCOEmoSfn3yXlJWmoHGhqp6ilYuWYpmTqKUgAAIfkECQEAAQAsAAAAACgAKAAAApiEH6kb58biQ3FNWtMFWW3eNVcojuFGfqnZqSebuS06w5V80/X02pKe8zFwP6EFWOT1lDFk8rGERh1TTNOocQ61Hm4Xm2VexUHpzjymViHrFbiELsefVrn6XKfnt2Q9G/+Xdie499XHd2g4h7ioOGhXGJboGAnXSBnoBwKYyfioubZJ2Hn0RuRZaflZOil56Zp6iioKSXpUAAAh+QQJAQABACwAAAAAKAAoAAACkoQRqRvnxuI7kU1a1UU5bd5tnSeOZXhmn5lWK3qNTWvRdQxP8qvaC+/yaYQzXO7BMvaUEmJRd3TsiMAgswmNYrSgZdYrTX6tSHGZO73ezuAw2uxuQ+BbeZfMxsexY35+/Qe4J1inV0g4x3WHuMhIl2jXOKT2Q+VU5fgoSUI52VfZyfkJGkha6jmY+aaYdirq+lQAACH5BAkBAAEALAAAAAAoACgAAAKWBIKpYe0L3YNKToqswUlvznigd4wiR4KhZrKt9Upqip61i9E3vMvxRdHlbEFiEXfk9YARYxOZZD6VQ2pUunBmtRXo1Lf8hMVVcNl8JafV38aM2/Fu5V16Bn63r6xt97j09+MXSFi4BniGFae3hzbH9+hYBzkpuUh5aZmHuanZOZgIuvbGiNeomCnaxxap2upaCZsq+1kAACH5BAkBAAEALAAAAAAoACgAAAKXjI8By5zf4kOxTVrXNVlv1X0d8IGZGKLnNpYtm8Lr9cqVeuOSvfOW79D9aDHizNhDJidFZhNydEahOaDH6nomtJjp1tutKoNWkvA6JqfRVLHU/QUfau9l2x7G54d1fl995xcIGAdXqMfBNadoYrhH+Mg2KBlpVpbluCiXmMnZ2Sh4GBqJ+ckIOqqJ6LmKSllZmsoq6wpQAAAh+QQJAQABACwAAAAAKAAoAAAClYx/oLvoxuJDkU1a1YUZbJ59nSd2ZXhWqbRa2/gF8Gu2DY3iqs7yrq+xBYEkYvFSM8aSSObE+ZgRl1BHFZNr7pRCavZ5BW2142hY3AN/zWtsmf12p9XxxFl2lpLn1rseztfXZjdIWIf2s5dItwjYKBgo9yg5pHgzJXTEeGlZuenpyPmpGQoKOWkYmSpaSnqKileI2FAAACH5BAkBAAEALAAAAAAoACgAAAKVjB+gu+jG4kORTVrVhRlsnn2dJ3ZleFaptFrb+CXmO9OozeL5VfP99HvAWhpiUdcwkpBH3825AwYdU8xTqlLGhtCosArKMpvfa1mMRae9VvWZfeB2XfPkeLmm18lUcBj+p5dnN8jXZ3YIGEhYuOUn45aoCDkp16hl5IjYJvjWKcnoGQpqyPlpOhr3aElaqrq56Bq7VAAAOw==);height:100%;opacity:.25;filter:alpha(opacity=25)}.ui-progressbar-indeterminate .ui-progressbar-value{background-image:none}.ui-selectable{-ms-touch-action:none;touch-action:none}.ui-selectable-helper{border:1px dotted black;position:absolute;z-index:100}.ui-selectmenu-menu{display:none;left:0;margin:0;padding:0;position:absolute;top:0}.ui-selectmenu-menu .ui-menu{overflow:auto;overflow-x:hidden;padding-bottom:1px}.ui-selectmenu-menu .ui-menu .ui-selectmenu-optgroup{border:0;font-size:1em;font-weight:bold;height:auto;line-height:1.5;margin:.5em 0 0 0;padding:2px .4em}.ui-selectmenu-open{display:block}.ui-selectmenu-text{display:block;margin-right:20px;overflow:hidden;text-overflow:ellipsis}.ui-selectmenu-button.ui-button{text-align:left;white-space:nowrap;width:14em}.ui-selectmenu-icon.ui-icon{float:right;margin-top:0}.ui-slider{position:relative;text-align:left}.ui-slider .ui-slider-handle{cursor:default;height:1.2em;position:absolute;width:1.2em;z-index:2;-ms-touch-action:none;touch-action:none}.ui-slider .ui-slider-range{background-position:0 0;border:0;display:block;font-size:.7em;position:absolute;z-index:1}.ui-slider.ui-state-disabled .ui-slider-handle,.ui-slider.ui-state-disabled .ui-slider-range{filter:inherit}.ui-slider-horizontal{height:.8em}.ui-slider-horizontal .ui-slider-handle{margin-left:-.6em;top:-.3em}.ui-slider-horizontal .ui-slider-range{height:100%;top:0}.ui-slider-horizontal .ui-slider-range-min{left:0}.ui-slider-horizontal .ui-slider-range-max{right:0}.ui-slider-vertical{height:100px;width:.8em}.ui-slider-vertical .ui-slider-handle{left:-.3em;margin-bottom:-.6em;margin-left:0}.ui-slider-vertical .ui-slider-range{left:0;width:100%}.ui-slider-vertical .ui-slider-range-min{bottom:0}.ui-slider-vertical .ui-slider-range-max{top:0}.ui-sortable-handle{-ms-touch-action:none;touch-action:none}.ui-spinner{display:inline-block;overflow:hidden;padding:0;position:relative;vertical-align:middle}.ui-spinner-input{background:none;border:0;color:inherit;margin:.2em 0;margin-left:.4em;margin-right:2em;padding:.222em 0;vertical-align:middle}.ui-spinner-button{cursor:default;display:block;font-size:.5em;height:50%;margin:0;overflow:hidden;padding:0;position:absolute;right:0;text-align:center;width:1.6em}.ui-spinner a.ui-spinner-button{border-bottom-style:none;border-right-style:none;border-top-style:none}.ui-spinner-up{top:0}.ui-spinner-down{bottom:0}.ui-tabs{padding:.2em;position:relative}.ui-tabs .ui-tabs-nav{margin:0;padding:.2em .2em 0}.ui-tabs .ui-tabs-nav li{border-bottom-width:0;float:left;list-style:none;margin:1px .2em 0 0;padding:0;position:relative;top:0;white-space:nowrap}.ui-tabs .ui-tabs-nav .ui-tabs-anchor{float:left;padding:.5em 1em;text-decoration:none}.ui-tabs .ui-tabs-nav li.ui-tabs-active{margin-bottom:-1px;padding-bottom:1px}.ui-tabs .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor,.ui-tabs .ui-tabs-nav li.ui-state-disabled .ui-tabs-anchor,.ui-tabs .ui-tabs-nav li.ui-tabs-loading .ui-tabs-anchor{cursor:text}.ui-tabs-collapsible .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor{cursor:pointer}.ui-tabs .ui-tabs-panel{background:none;border-width:0;display:block;padding:1em 1.4em}.ui-tooltip{max-width:300px;padding:8px;position:absolute;z-index:9999}body .ui-tooltip{border-width:2px}.ui-widget{font-family:Arial,Helvetica,sans-serif;font-size:1em}.ui-widget .ui-widget{font-size:1em}.ui-widget input,.ui-widget select,.ui-widget textarea,.ui-widget button{font-family:Arial,Helvetica,sans-serif;font-size:1em}.ui-widget.ui-widget-content{border:1px solid #c5c5c5}.ui-widget-content{background:#fff;border:1px solid #ddd;color:#333}.ui-widget-content a{color:#333}.ui-widget-header{background:#e9e9e9;border:1px solid #ddd;color:#333;font-weight:bold}.ui-widget-header a{color:#333}.ui-state-default,.ui-widget-content .ui-state-default,.ui-widget-header .ui-state-default,.ui-button,html .ui-button.ui-state-disabled:hover,html .ui-button.ui-state-disabled:active{background:#f6f6f6;border:1px solid #c5c5c5;color:#454545;font-weight:normal}.ui-state-default a,.ui-state-default a:link,.ui-state-default a:visited,a.ui-button,a:link.ui-button,a:visited.ui-button,.ui-button{color:#454545;text-decoration:none}.ui-state-hover,.ui-widget-content .ui-state-hover,.ui-widget-header .ui-state-hover,.ui-state-focus,.ui-widget-content .ui-state-focus,.ui-widget-header .ui-state-focus,.ui-button:hover,.ui-button:focus{background:#ededed;border:1px solid #ccc;color:#2b2b2b;font-weight:normal}.ui-state-hover a,.ui-state-hover a:hover,.ui-state-hover a:link,.ui-state-hover a:visited,.ui-state-focus a,.ui-state-focus a:hover,.ui-state-focus a:link,.ui-state-focus a:visited,a.ui-button:hover,a.ui-button:focus{color:#2b2b2b;text-decoration:none}.ui-visual-focus{box-shadow:0 0 3px 1px #5e9ed6}.ui-state-active,.ui-widget-content .ui-state-active,.ui-widget-header .ui-state-active,a.ui-button:active,.ui-button:active,.ui-button.ui-state-active:hover{background:#007fff;border:1px solid #003eff;color:#fff;font-weight:normal}.ui-icon-background,.ui-state-active .ui-icon-background{background-color:#fff;border:#003eff}.ui-state-active a,.ui-state-active a:link,.ui-state-active a:visited{color:#fff;text-decoration:none}.ui-state-highlight,.ui-widget-content .ui-state-highlight,.ui-widget-header .ui-state-highlight{background:#fffa90;border:1px solid #dad55e;color:#777620}.ui-state-checked{background:#fffa90;border:1px solid #dad55e}.ui-state-highlight a,.ui-widget-content .ui-state-highlight a,.ui-widget-header .ui-state-highlight a{color:#777620}.ui-state-error,.ui-widget-content .ui-state-error,.ui-widget-header .ui-state-error{background:#fddfdf;border:1px solid #f1a899;color:#5f3f3f}.ui-state-error a,.ui-widget-content .ui-state-error a,.ui-widget-header .ui-state-error a{color:#5f3f3f}.ui-state-error-text,.ui-widget-content .ui-state-error-text,.ui-widget-header .ui-state-error-text{color:#5f3f3f}.ui-priority-primary,.ui-widget-content .ui-priority-primary,.ui-widget-header .ui-priority-primary{font-weight:bold}.ui-priority-secondary,.ui-widget-content .ui-priority-secondary,.ui-widget-header .ui-priority-secondary{font-weight:normal;opacity:.7;filter:Alpha(Opacity=70)}.ui-state-disabled,.ui-widget-content .ui-state-disabled,.ui-widget-header .ui-state-disabled{background-image:none;opacity:.35;filter:Alpha(Opacity=35)}.ui-state-disabled .ui-icon{filter:Alpha(Opacity=35)}.ui-icon{height:16px;width:16px}.ui-icon,.ui-widget-content .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_444444_256x240.png)}.ui-widget-header .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_444444_256x240.png)}.ui-state-hover .ui-icon,.ui-state-focus .ui-icon,.ui-button:hover .ui-icon,.ui-button:focus .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_555555_256x240.png)}.ui-state-active .ui-icon,.ui-button:active .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_ffffff_256x240.png)}.ui-state-highlight .ui-icon,.ui-button .ui-state-highlight.ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_777620_256x240.png)}.ui-state-error .ui-icon,.ui-state-error-text .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_cc0000_256x240.png)}.ui-button .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_777777_256x240.png)}.ui-icon-blank{background-position:16px 16px}.ui-icon-caret-1-n{background-position:0 0}.ui-icon-caret-1-ne{background-position:-16px 0}.ui-icon-caret-1-e{background-position:-32px 0}.ui-icon-caret-1-se{background-position:-48px 0}.ui-icon-caret-1-s{background-position:-65px 0}.ui-icon-caret-1-sw{background-position:-80px 0}.ui-icon-caret-1-w{background-position:-96px 0}.ui-icon-caret-1-nw{background-position:-112px 0}.ui-icon-caret-2-n-s{background-position:-128px 0}.ui-icon-caret-2-e-w{background-position:-144px 0}.ui-icon-triangle-1-n{background-position:0 -16px}.ui-icon-triangle-1-ne{background-position:-16px -16px}.ui-icon-triangle-1-e{background-position:-32px -16px}.ui-icon-triangle-1-se{background-position:-48px -16px}.ui-icon-triangle-1-s{background-position:-65px -16px}.ui-icon-triangle-1-sw{background-position:-80px -16px}.ui-icon-triangle-1-w{background-position:-96px -16px}.ui-icon-triangle-1-nw{background-position:-112px -16px}.ui-icon-triangle-2-n-s{background-position:-128px -16px}.ui-icon-triangle-2-e-w{background-position:-144px -16px}.ui-icon-arrow-1-n{background-position:0 -32px}.ui-icon-arrow-1-ne{background-position:-16px -32px}.ui-icon-arrow-1-e{background-position:-32px -32px}.ui-icon-arrow-1-se{background-position:-48px -32px}.ui-icon-arrow-1-s{background-position:-65px -32px}.ui-icon-arrow-1-sw{background-position:-80px -32px}.ui-icon-arrow-1-w{background-position:-96px -32px}.ui-icon-arrow-1-nw{background-position:-112px -32px}.ui-icon-arrow-2-n-s{background-position:-128px -32px}.ui-icon-arrow-2-ne-sw{background-position:-144px -32px}.ui-icon-arrow-2-e-w{background-position:-160px -32px}.ui-icon-arrow-2-se-nw{background-position:-176px -32px}.ui-icon-arrowstop-1-n{background-position:-192px -32px}.ui-icon-arrowstop-1-e{background-position:-208px -32px}.ui-icon-arrowstop-1-s{background-position:-224px -32px}.ui-icon-arrowstop-1-w{background-position:-240px -32px}.ui-icon-arrowthick-1-n{background-position:1px -48px}.ui-icon-arrowthick-1-ne{background-position:-16px -48px}.ui-icon-arrowthick-1-e{background-position:-32px -48px}.ui-icon-arrowthick-1-se{background-position:-48px -48px}.ui-icon-arrowthick-1-s{background-position:-64px -48px}.ui-icon-arrowthick-1-sw{background-position:-80px -48px}.ui-icon-arrowthick-1-w{background-position:-96px -48px}.ui-icon-arrowthick-1-nw{background-position:-112px -48px}.ui-icon-arrowthick-2-n-s{background-position:-128px -48px}.ui-icon-arrowthick-2-ne-sw{background-position:-144px -48px}.ui-icon-arrowthick-2-e-w{background-position:-160px -48px}.ui-icon-arrowthick-2-se-nw{background-position:-176px -48px}.ui-icon-arrowthickstop-1-n{background-position:-192px -48px}.ui-icon-arrowthickstop-1-e{background-position:-208px -48px}.ui-icon-arrowthickstop-1-s{background-position:-224px -48px}.ui-icon-arrowthickstop-1-w{background-position:-240px -48px}.ui-icon-arrowreturnthick-1-w{background-position:0 -64px}.ui-icon-arrowreturnthick-1-n{background-position:-16px -64px}.ui-icon-arrowreturnthick-1-e{background-position:-32px -64px}.ui-icon-arrowreturnthick-1-s{background-position:-48px -64px}.ui-icon-arrowreturn-1-w{background-position:-64px -64px}.ui-icon-arrowreturn-1-n{background-position:-80px -64px}.ui-icon-arrowreturn-1-e{background-position:-96px -64px}.ui-icon-arrowreturn-1-s{background-position:-112px -64px}.ui-icon-arrowrefresh-1-w{background-position:-128px -64px}.ui-icon-arrowrefresh-1-n{background-position:-144px -64px}.ui-icon-arrowrefresh-1-e{background-position:-160px -64px}.ui-icon-arrowrefresh-1-s{background-position:-176px -64px}.ui-icon-arrow-4{background-position:0 -80px}.ui-icon-arrow-4-diag{background-position:-16px -80px}.ui-icon-extlink{background-position:-32px -80px}.ui-icon-newwin{background-position:-48px -80px}.ui-icon-refresh{background-position:-64px -80px}.ui-icon-shuffle{background-position:-80px -80px}.ui-icon-transfer-e-w{background-position:-96px -80px}.ui-icon-transferthick-e-w{background-position:-112px -80px}.ui-icon-folder-collapsed{background-position:0 -96px}.ui-icon-folder-open{background-position:-16px -96px}.ui-icon-document{background-position:-32px -96px}.ui-icon-document-b{background-position:-48px -96px}.ui-icon-note{background-position:-64px -96px}.ui-icon-mail-closed{background-position:-80px -96px}.ui-icon-mail-open{background-position:-96px -96px}.ui-icon-suitcase{background-position:-112px -96px}.ui-icon-comment{background-position:-128px -96px}.ui-icon-person{background-position:-144px -96px}.ui-icon-print{background-position:-160px -96px}.ui-icon-trash{background-position:-176px -96px}.ui-icon-locked{background-position:-192px -96px}.ui-icon-unlocked{background-position:-208px -96px}.ui-icon-bookmark{background-position:-224px -96px}.ui-icon-tag{background-position:-240px -96px}.ui-icon-home{background-position:0 -112px}.ui-icon-flag{background-position:-16px -112px}.ui-icon-calendar{background-position:-32px -112px}.ui-icon-cart{background-position:-48px -112px}.ui-icon-pencil{background-position:-64px -112px}.ui-icon-clock{background-position:-80px -112px}.ui-icon-disk{background-position:-96px -112px}.ui-icon-calculator{background-position:-112px -112px}.ui-icon-zoomin{background-position:-128px -112px}.ui-icon-zoomout{background-position:-144px -112px}.ui-icon-search{background-position:-160px -112px}.ui-icon-wrench{background-position:-176px -112px}.ui-icon-gear{background-position:-192px -112px}.ui-icon-heart{background-position:-208px -112px}.ui-icon-star{background-position:-224px -112px}.ui-icon-link{background-position:-240px -112px}.ui-icon-cancel{background-position:0 -128px}.ui-icon-plus{background-position:-16px -128px}.ui-icon-plusthick{background-position:-32px -128px}.ui-icon-minus{background-position:-48px -128px}.ui-icon-minusthick{background-position:-64px -128px}.ui-icon-close{background-position:-80px -128px}.ui-icon-closethick{background-position:-96px -128px}.ui-icon-key{background-position:-112px -128px}.ui-icon-lightbulb{background-position:-128px -128px}.ui-icon-scissors{background-position:-144px -128px}.ui-icon-clipboard{background-position:-160px -128px}.ui-icon-copy{background-position:-176px -128px}.ui-icon-contact{background-position:-192px -128px}.ui-icon-image{background-position:-208px -128px}.ui-icon-video{background-position:-224px -128px}.ui-icon-script{background-position:-240px -128px}.ui-icon-alert{background-position:0 -144px}.ui-icon-info{background-position:-16px -144px}.ui-icon-notice{background-position:-32px -144px}.ui-icon-help{background-position:-48px -144px}.ui-icon-check{background-position:-64px -144px}.ui-icon-bullet{background-position:-80px -144px}.ui-icon-radio-on{background-position:-96px -144px}.ui-icon-radio-off{background-position:-112px -144px}.ui-icon-pin-w{background-position:-128px -144px}.ui-icon-pin-s{background-position:-144px -144px}.ui-icon-play{background-position:0 -160px}.ui-icon-pause{background-position:-16px -160px}.ui-icon-seek-next{background-position:-32px -160px}.ui-icon-seek-prev{background-position:-48px -160px}.ui-icon-seek-end{background-position:-64px -160px}.ui-icon-seek-start{background-position:-80px -160px}.ui-icon-seek-first{background-position:-80px -160px}.ui-icon-stop{background-position:-96px -160px}.ui-icon-eject{background-position:-112px -160px}.ui-icon-volume-off{background-position:-128px -160px}.ui-icon-volume-on{background-position:-144px -160px}.ui-icon-power{background-position:0 -176px}.ui-icon-signal-diag{background-position:-16px -176px}.ui-icon-signal{background-position:-32px -176px}.ui-icon-battery-0{background-position:-48px -176px}.ui-icon-battery-1{background-position:-64px -176px}.ui-icon-battery-2{background-position:-80px -176px}.ui-icon-battery-3{background-position:-96px -176px}.ui-icon-circle-plus{background-position:0 -192px}.ui-icon-circle-minus{background-position:-16px -192px}.ui-icon-circle-close{background-position:-32px -192px}.ui-icon-circle-triangle-e{background-position:-48px -192px}.ui-icon-circle-triangle-s{background-position:-64px -192px}.ui-icon-circle-triangle-w{background-position:-80px -192px}.ui-icon-circle-triangle-n{background-position:-96px -192px}.ui-icon-circle-arrow-e{background-position:-112px -192px}.ui-icon-circle-arrow-s{background-position:-128px -192px}.ui-icon-circle-arrow-w{background-position:-144px -192px}.ui-icon-circle-arrow-n{background-position:-160px -192px}.ui-icon-circle-zoomin{background-position:-176px -192px}.ui-icon-circle-zoomout{background-position:-192px -192px}.ui-icon-circle-check{background-position:-208px -192px}.ui-icon-circlesmall-plus{background-position:0 -208px}.ui-icon-circlesmall-minus{background-position:-16px -208px}.ui-icon-circlesmall-close{background-position:-32px -208px}.ui-icon-squaresmall-plus{background-position:-48px -208px}.ui-icon-squaresmall-minus{background-position:-64px -208px}.ui-icon-squaresmall-close{background-position:-80px -208px}.ui-icon-grip-dotted-vertical{background-position:0 -224px}.ui-icon-grip-dotted-horizontal{background-position:-16px -224px}.ui-icon-grip-solid-vertical{background-position:-32px -224px}.ui-icon-grip-solid-horizontal{background-position:-48px -224px}.ui-icon-gripsmall-diagonal-se{background-position:-64px -224px}.ui-icon-grip-diagonal-se{background-position:-80px -224px}.ui-corner-all,.ui-corner-top,.ui-corner-left,.ui-corner-tl{border-top-left-radius:3px}.ui-corner-all,.ui-corner-top,.ui-corner-right,.ui-corner-tr{border-top-right-radius:3px}.ui-corner-all,.ui-corner-bottom,.ui-corner-left,.ui-corner-bl{border-bottom-left-radius:3px}.ui-corner-all,.ui-corner-bottom,.ui-corner-right,.ui-corner-br{border-bottom-right-radius:3px}.ui-widget-overlay{background:#aaa;opacity:.003;filter:Alpha(Opacity=.3)}.ui-widget-shadow{-webkit-box-shadow:0 0 5px #666;box-shadow:0 0 5px #666}";
GM_addStyle(myScriptStyle);

// 定义基础方法
function getDoc(url, meta, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'User-agent': window.navigator.userAgent,
            'Content-type': null
        },
        onload: function (responseDetail) {
            if (responseDetail.status === 200) {
                let doc = (new DOMParser).parseFromString(responseDetail.responseText, 'text/html');
                callback(doc, responseDetail, meta);
            }
        }
    });
}
function getJSON(url, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        },
        onload: function (response) {
            if (response.status >= 200 && response.status < 400) {
                callback(JSON.parse(response.responseText), url);
            } else {
                callback(false, url);
            }
        }
    });
}

let cache_prefix = "cache_";

function GM_deletedCacheValue(name) {
    GM_deleteValue(name);
    GM_deleteValue(cache_prefix + name);
}

function GM_setCacheValue (name,value,expire,json_parser) {
    GM_setValue(name,json_parser ? JSON.stringify(value) : value);
    GM_setValue(cache_prefix + name,json_parser ? JSON.stringify(Date.now() + expire) : (Date.now() + expire));
}

function GM_getCacheValue (name,defaultValue,json_parser) {
    let expire_timestamp = parseInt(GM_getValue(cache_prefix + name));
    if (expire_timestamp < Date.now()) {
        GM_deletedCacheValue(name);
    }

    return json_parser ? JSON.parse(GM_getValue(name,defaultValue)): GM_getValue(name,defaultValue);
}

function GM_clearExpiredCacheValue(force) {
    let cache_key = GM_listValues().filter(function (key) {
        return key.includes(cache_prefix)
    });
    for (let i=0;i< cache_key.length;i++) {
        let name = cache_key[i].slice(cache_prefix.length);
        let expired_timestamp = GM_getValue(cache_prefix + name);
        if(force || expired_timestamp < Date.now()) {
            GM_deletedCacheValue(name);
        }
    }
}

GM_clearExpiredCacheValue(false);

let _version = GM_getValue("version","完整版");

if (typeof GM_registerMenuCommand !== "undefined") {

    function changeVersionConfirm() {
        if (confirm(`你当前版本是 ${_version}，是否进行切换？`)) {
            GM_setValue("version",_version === "完整版" ? "轻量版" : "完整版");
        }
    }
    GM_registerMenuCommand("脚本功能切换",changeVersionConfirm);

    function deleteSitePrompt() {
        let delete_site_prefix = "delete_site_";
        let name=prompt("请输入你不想看到的站点名称,请注意，除非重装脚本，否则该操作不可撤销","");
        if (name!=null && name!=="") {
            if (GM_getValue(delete_site_prefix + name,false)) {
                GM_deleteValue(delete_site_prefix + name);
            } else {  // 二次输入恢复
                GM_setValue(delete_site_prefix + name,true);
            }
        }
    }
    GM_registerMenuCommand("删除不想显示的站",deleteSitePrompt);

    function changeTagBColor() {
        let now_bcolor_list = [GM_getValue("tag_bcolor_exist","#e3f1ed"),GM_getValue("tag_bcolor_not_exist","#f4eac2"),GM_getValue("tag_bcolor_need_login",""),GM_getValue("tag_bcolor_error","")];
        let name = prompt("请依次输入代表'资源存在','资源不存在','站点需要登陆','站点解析错误'颜色的Hex值，并用英文逗号分割。当前值为：" , `${now_bcolor_list.join(',')}`);
        if (name!=null && name!=="") {
            try {
                let bcolor_list = name.split(",");
                GM_setValue("tag_bcolor_exist",bcolor_list[0] || "#e3f1ed");
                GM_setValue("tag_bcolor_not_exist",bcolor_list[1] || "#f4eac2");
                GM_setValue("tag_bcolor_need_login",bcolor_list[2] || "");
                GM_setValue("tag_bcolor_error",bcolor_list[3] || "");
            } catch (e) {
                alert("解析输入出错");
            }
        }
    }
    GM_registerMenuCommand("更改标签背景色",changeTagBColor);

    function changeTagFColor() {
        let now_fcolor_list = [GM_getValue("tag_fcolor_exist","#3377aa"),GM_getValue("tag_fcolor_not_exist","#3377aa"),GM_getValue("tag_fcolor_need_login","#3377aa"),GM_getValue("tag_fcolor_error","#3377aa")];
        let name = prompt("请依次输入代表'资源存在','资源不存在','站点需要登陆','站点解析错误'颜色的Hex值，并用英文逗号分割。当前值为：" , `${now_fcolor_list.join(',')}`);
        if (name!=null && name!=="") {
            try {
                let fcolor_list = name.split(",");
                GM_setValue("tag_fcolor_exist",fcolor_list[0] || "#3377aa");
                GM_setValue("tag_fcolor_not_exist",fcolor_list[1] || "#3377aa");
                GM_setValue("tag_fcolor_need_login",fcolor_list[2] || "#3377aa");
                GM_setValue("tag_fcolor_error",fcolor_list[3] || "#3377aa");
            } catch (e) {
                alert("解析输入出错");
            }
        }
    }
    GM_registerMenuCommand("更改标签文字色",changeTagFColor);

    function forceCacheClear() {
        if (confirm("清空所有缓存信息（包括资源存在情况、登陆情况、imdb250等）")) {
            GM_clearExpiredCacheValue(true);
        }
    }
    GM_registerMenuCommand("清空脚本缓存",forceCacheClear);

}


$(document).ready(function () {
    // 脚本对页面进行预处理
    if($('#info span.pl:contains("又名")').length === 0){
        $('#info').append('<div style="display: none"><span class="pl">又名:</span>啥也没有<br></div>');
    }

    if($('div#info a[href^=\'http://www.imdb.com/title/tt\']').length === 0){
        $('#info').append('<div style="display: none"><span class="pl">IMDb链接:</span><a href="http://www.imdb.com/title/tt9999999" target="_blank" rel="nofollow">tt9999999</a><br></div>');
    }

    if ($('#mainpic p.gact').length === 0) {
        $("#mainpic").append("<p class=\"gact\"></p>")
    }

    let interest_sectl_selector = $('#interest_sectl');
    interest_sectl_selector.after($('div.grid-16-8 div.related-info'));
    interest_sectl_selector.attr('style', 'float:right');
    $('div.related-info').attr('style', 'width:480px;float:left');

    $("div#info").append("<span class=\"pl\">生成信息: </span><a id='movieinfogen' href='javascript:void(0);'>movieinfo</a>");
    let movieinfo_html = $("<div class='c-aside' style='float:left;margin-top:20px;width: 470px;display: none' id='movieinfo_div'><h2><i>电影简介</i>· · · · · · </h2><a href='javascript:void(0);' id='copy_movieinfo'>点击复制</a><div class=\"c-aside-body\" style=\"padding: 0 12px;\" id='movieinfo'></div></div>");
    if ($("#movieinfo").length === 0) {
        $("div.related-info").before(movieinfo_html);
        $("a#copy_movieinfo").click(function() {
            let movieinfo_html = $("#movieinfo").html();
            let movieclip = movieinfo_html.replace(/<br>/ig,"\n")
                .replace(/<a [^>]*>/g,"").replace(/<\/a>/g,"");
            GM_setClipboard(movieclip);
            $(this).text("复制成功");
        })
    }

    // 查看原图
    let posterAnchor = document.querySelector('#mainpic > a > img');
    if (posterAnchor) {
        let postersUrl = posterAnchor.getAttribute("src");
        let rawUrl = postersUrl.replace(/photo\/s_ratio_poster\/public\/(p\d+).+$/,"photo/raw/public/$1.jpg");
        $('#mainpic p.gact').after(`<a target="_blank" rel="nofollow" href="${rawUrl}">查看原图</a>`);
    }

    // Movieinfo信息生成相关
    let poster;
    let this_title, trans_title, aka;
    let year, region, genre,language,playdate;
    let imdb_link, imdb_id, imdb_average_rating, imdb_votes, imdb_rating;
    let douban_link, douban_id, douban_average_rating, douban_votes, douban_rating;
    let episodes, duration;
    let director, writer, cast;
    let tags,introduction,awards;

    function descriptionGenerator() {
        let descr = "";
        descr += poster ? `[img]${poster}[/img]\n\n` : "";
        descr += (trans_title && !trans_title.match(/啥也没有/)) ? `◎译　　名　${trans_title}\n` : "";
        descr += this_title ? `◎片　　名　${this_title}\n` : "";
        descr += year ? `◎年　　代　${year.trim()}\n` : "";
        descr += region ? `◎产　　地　${region}\n` : "";
        descr += genre ? `◎类　　别　${genre}\n` : "";
        descr += language ? `◎语　　言　${language}\n` : "";
        descr += playdate ? `◎上映日期　${playdate}\n` : "";
        descr += imdb_rating ? `◎IMDb评分  ${imdb_rating}\n` : "";  // 注意如果长时间没能请求完成imdb信息，则该条不显示
        descr += (imdb_link && !imdb_link.match(/9999999/)) ? `◎IMDb链接  ${imdb_link}\n` : "";
        descr += douban_rating ? `◎豆瓣评分　${douban_rating}\n` : "";
        descr += douban_link ? `◎豆瓣链接　${douban_link}\n` : "";
        descr += episodes ? `◎集　　数　${episodes}\n` : "";
        descr += duration ? `◎片　　长　${duration}\n` : "";
        descr += director ? `◎导　　演　${director}\n` : "";
        descr += writer ? `◎编　　剧　${writer}\n` : "";
        descr += cast ? `◎主　　演　${cast.replace(/\n/g, '\n' + '　'.repeat(4) + '  　').trim()}\n` : "";
        descr += tags ? `\n◎标　　签　${tags}\n` : "";
        descr += introduction ? `\n◎简　　介\n\n　　${introduction.replace(/\n/g, '\n' + '　'.repeat(2))}\n` : "";
        descr += awards ? `\n◎获奖情况\n\n　　${awards.replace(/\n/g, '\n' + '　'.repeat(2))}\n` : "";
        movieinfo_html.find("div#movieinfo").html(descr.replace(/\n/ig,"<br>"));
    }
    $("a#movieinfogen").click(function() {
        descriptionGenerator();
        $("#movieinfo_div").toggle();
    });

    let fetch = function (anchor) {
        return anchor[0].nextSibling.nodeValue.trim();
    };

    // 从页面中解析信息并请求imdb等第三方数据
    let chinese_title = document.title.replace('(豆瓣)','').trim();
    let foreign_title = $('#content h1>span[property="v:itemreviewed"]').text().replace(chinese_title, '').trim();
    let aka_anchor = $('#info span.pl:contains("又名")');
    if (aka_anchor[0]) {
        aka = fetch(aka_anchor).split(' / ').sort(function (a, b) {//首字(母)排序
            return a.localeCompare(b);
        }).join('/');
    }
    if (foreign_title) {
        trans_title = chinese_title + (aka ? ('/' + aka) : '');
        this_title = foreign_title;
    } else {
        trans_title = aka ? aka : '';
        this_title = chinese_title;
    }
    year = ' ' + $('#content > h1 > span.year').text().substr(1, 4);

    let regions_anchor = $('#info span.pl:contains("制片国家/地区")');  //产地
    if (regions_anchor[0]) {
        region = fetch(regions_anchor).split(' / ').join('/');
    }

    genre = $('#info span[property="v:genre"]').map(function () {  //类别
        return $(this).text().trim();
    }).toArray().join('/');

    let language_anchor = $('#info span.pl:contains("语言")');  //语言
    if (language_anchor[0]) {
        language = fetch(language_anchor).split(' / ').join('/');
    }

    playdate = $('#info span[property="v:initialReleaseDate"]').map(function () {   //上映日期
        return $(this).text().trim();
    }).toArray().sort(function (a, b) {//按上映日期升序排列
        return new Date(a) - new Date(b);
    }).join('/');
    //IMDb链接
    let imdb_link_anchor = $('#info span.pl:contains("IMDb链接")');
    if (imdb_link_anchor[0]) { // 请求IMDb信息（最慢，最先且单独请求）
        imdb_link = imdb_link_anchor.next().attr('href').replace(/(\/)?$/, '/').replace("http://","https://");
        imdb_id = imdb_link.match(/tt\d+/)[0];

        // add IMDB top 250 tag
        function addIMDBtop250(list) {
            let number = list.indexOf('data-tconst="' + imdb_id + '"') + 1;
            if (number < 1 || number > 250) return;
            // inject css if needed
            if (document.getElementsByClassName('top250').length === 0) {
                let style  = '.top250{background:url(https://s.doubanio.com/f/movie/f8a7b5e23d00edee6b42c6424989ce6683aa2fff/pics/movie/top250_bg.png) no-repeat;width:150px;font:12px Helvetica,Arial,sans-serif;margin:5px 0;color:#744900}.top250 span{display:inline-block;text-align:center;height:18px;line-height:18px}.top250 a,.top250 a:link,.top250 a:hover,.top250 a:active,.top250 a:visited{color:#744900;text-decoration:none;background:none}.top250-no{width:34%}.top250-link{width:66%}';
                GM_addStyle(style);
            }
            let after = document.getElementById('dale_movie_subject_top_icon');
            if (!after) after = document.querySelector('h1');
            after.insertAdjacentHTML('beforebegin', '<div class="top250"><span class="top250-no">No.' + number + '</span><span class="top250-link"><a href="http://www.imdb.com/chart/top">IMDb Top 250</a></span></div>');
            [].forEach.call(document.getElementsByClassName('top250'), function (e) {
                e.style.display = 'inline-block';
            });
        }

        let cache_imdb_250 = GM_getCacheValue("imdb_250",false);
        if (cache_imdb_250) {
            addIMDBtop250(cache_imdb_250);
        } else {
            getDoc('https://m.imdb.com/chart/top',null, function (doc,res) {
                let list = res.responseText.match(/data-tconst="(tt\d{7})"/g);
                GM_setCacheValue("imdb_250",list,86400 * 1e3);
                addIMDBtop250(list)
            });
        }

        $("div.rating_betterthan").after("<div class='rating_wrap clearbox' id='loading_more_rate'>加载第三方评价信息中.......</div>");
        getDoc(imdb_link,null,function (doc) {
            // 评分，Metascore，烂番茄
            imdb_average_rating  = $('span[itemprop=ratingValue]', doc).text();
            imdb_votes = $('span[itemprop=ratingCount]', doc).text();
            imdb_rating = imdb_votes ? imdb_average_rating + '/10 from ' + imdb_votes + ' users' : '';  // MovieinfoGen 相关

            let starValue = parseFloat(imdb_average_rating) / 2;
            starValue = starValue % 1 > 0.5 ? Math.floor(starValue) + 0.5 : Math.floor(starValue);
            starValue *= 10;

            $('#interest_sectl').append(`<div class="rating_wrap clearbox rating_imdb" rel="v:rating"> <div class=rating_logo >IMDB 评分</div> <div class="rating_self clearfix" typeof="v:Rating"> <strong class="ll rating_num" property="v:average">${imdb_average_rating}</strong><span property="v:best" content=10.0 ></span> <div class="rating_right "> <div class="ll bigstar ${'bigstar' + starValue}"></div> <div class="rating_sum"> <a href=${imdb_link + 'ratings?ref_=tt_ov_rt'}  class=rating_people ><span property="v:votes">${imdb_votes}</span>人评价</a> </div> </div> </div> </div>`);
            
            // put on more ratings
            $('#interest_sectl .rating_imdb').after('<div class="rating_more"></div>');
            let rating_more = $('#interest_sectl .rating_more');
            let titleReviewBarItem = $('.titleReviewBar div.titleReviewBarItem', doc);
            for (let i = 0; i < titleReviewBarItem.length; i++) {
                let item = titleReviewBarItem[i];
                let text = $(item).text();
                if (text.indexOf('Metascore') !== -1) {
                    let metascore = $(item).find('a[href^=criticreviews] span').text();
                    rating_more.append(`<div>Metascore<a href='${imdb_link + 'criticreviews?ref_=tt_ov_rt'}' target="_blank">${metascore}</a></div>`);
                } else if (text.indexOf('Popularity') !== -1) {
                    let popularity = $(item).find('span.subText').html();
                    popularity = `<div>流行度&nbsp;&nbsp;${popularity}<br><div>`;
                    rating_more.append(popularity);
                } else if (text.indexOf('Reviews') !== -1) {
                    // TODO let reviews;
                }
            }

            // add rottentomatoes block
            $('#titleYear', doc).remove();
            let movieTitle = $.trim($('h1[itemprop=name]', doc).text());
            let rottURL = 'https://www.rottentomatoes.com/m/' + movieTitle.replace(/\s+/g,"_").replace(/\W+/g,"").toLowerCase();
            getDoc(rottURL, null, function(rotdoc) {
                let rott_html = '<div class="rating_wrap clearbox rating_rott"><span class="rating_logo ll">烂番茄新鲜度</span><br><div id="rottValue" class="rating_self clearfix"></div></div>';
                $('#interest_sectl').append(rott_html);
                if(!rotdoc.title){
                    $('#interest_sectl div.rating_rott').append(`<br>搜索rotta: <a target='_blank' href='${'https://www.rottentomatoes.com/search/?search=' + encodeURI(movieTitle)}'>${movieTitle}</a>`);
                } else if($('#tomato_meter_link',rotdoc).length > 0) {
                    let rating_rott_value = $('#tomato_meter_link .meter-value.superPageFontColor', rotdoc).html();
                    $('#scoreStats .subtle.superPageFontColor', rotdoc).remove();
                    let  fresh_rott_value = $('#scoreStats .superPageFontColor:eq(2)', rotdoc).text();
                    let rotten_rott_value = $('#scoreStats .superPageFontColor:eq(3)', rotdoc).text();
                    $('#interest_sectl .rating_rott #rottValue').append(`<strong class="ll rating_num"><a target="_blank" href="${rottURL}">${rating_rott_value}</a></strong><div class="rating_right" style="line-height: 16px;"><span>鲜:&nbsp;&nbsp;${fresh_rott_value}</span><br><span>烂:&nbsp;&nbsp;${rotten_rott_value}</span></div>`);
                } else {
                    $('#interest_sectl div.rating_rott').hide();
                }
            });

            $("#loading_more_rate").hide();
        });
    }

    douban_link = 'https://' + location.href.match(/movie.douban.com\/subject\/\d+\//);  //豆瓣链接
    douban_id = location.href.match(/(\d{7,8})/g);
    //集数
    let episodes_anchor = $('#info span.pl:contains("集数")');
    if (episodes_anchor[0]) {
        episodes = fetch(episodes_anchor);
    }
    //片长
    let duration_anchor = $('#info span.pl:contains("单集片长")');
    if (duration_anchor[0]) {
        duration = fetch(duration_anchor);
    } else {
        duration = $('#info span[property="v:runtime"]').text().trim();
    }

    getDoc(douban_link + 'awards/',null,function (doc) {
        awards = $('#content>div>div.article',doc).html()
            .replace(/[ \n]/g, '')
            .replace(/<\/li><li>/g, '</li> <li>')
            .replace(/<\/a><span/g, '</a> <span')
            .replace(/<(div|ul)[^>]*>/g, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/ +\n/g, '\n')
            .trim();
    });    // 该影片的评奖信息
    getJSON('https://api.douban.com/v2/movie/' + douban_id,function (data1) {
        douban_average_rating = data1.rating.average || 0;
        douban_votes = data1.rating.numRaters.toLocaleString() || 0;
        douban_rating = douban_average_rating + '/10 from ' + douban_votes + ' users';
        introduction = data1.summary.replace(/^None$/g, '暂无相关剧情介绍');
        poster = data1.image.replace(/s(_ratio_poster|pic)/g, 'l');
        director = data1.attrs.director ? data1.attrs.director.join(' / ') : '';
        writer = data1.attrs.writer ? data1.attrs.writer.join(' / ') : '';
        cast = data1.attrs.cast ? data1.attrs.cast.join('\n') : '';
        tags = data1.tags.map(function (member) {
            return member.name;
        }).join(' | ');
    });  //豆瓣评分，简介，海报，导演，编剧，演员，标签

    // 获取电影英文名
    let eng_title = [this_title, trans_title].join("/").split("/").filter(function (arr) {
        return /([a-zA-Z]){2,}/.test(arr);
    })[0] || "";

    // 剧集修正季数名
    eng_title = eng_title.match(/Season\s\d\d/) ? eng_title.replace(/Season\s/, "S") : eng_title.replace(/Season\s/, "S0");
    eng_title = eng_title.replace(/[:,!\-]/g, "").replace(/ [^a-z0-9]+$/,"");
    let eng_title_clean = eng_title.replace(/ S\d\d*$/, "");

    // 电影+年份 (只有电影才搜索并赋值年份)
    let is_movie = $('a.bn-sharing').attr('data-type').match(/电影/);
    let encode_year = is_movie ? year.replace(/ /,"_") : "";
    let nian = is_movie ? year : "";
    let encode_eng_title = (eng_title || "").replace(/ /g,"_");
    let ptzimu = encode_eng_title + encode_year;
    chinese_title = chinese_title.replace(/[：，]/," ");
    let gtitle = encodeToGb2312(chinese_title,true);
    let ywm = eng_title + nian;
    let zwm = chinese_title + nian;

    // get Chinese title
    let title = encodeURI($('#content > h1 > span')[0].textContent.split(' ').shift().replace(/[：，]/," "));

    let site_map = [];

    /** label对象键值说明：
     * name:          String  站点名称，请注意该站点名称在不同的site_map中也应该唯一，以免脚本后续判断出错
     * method：       String  搜索请求方式，默认值为 "GET"
     * link：         String  构造好的请求页面链接，作为label的href属性填入，用户应该能直接点开这个页面。
     * ajax：         String  如果站点使用ajax的形式加载页面，则需要传入该值作为实际请求的链接，即优先级比link更高。
     * type：         String  返回结果类型，脚本默认按html页面解析；只有当传入值为"json"时，脚本按JSON格式解析
     * selector：     String  搜索成功判断结果，默认值为 "table.torrents:last > tbody > tr:gt(0)" (适用于国内多数NexusPHP构架的站点)
     *                        如果type为"page"（默认）时，为一个（jQuery）CSS选择器，
     *                        如果type为"json"时，为一个具体的判断式。
     * selector_need_login    搜索需要登录的选择器，仅在type为默认时有用，其余用法同Selector一致。
     * selector_not_exit      搜索资源不存在的选择器，仅在type为默认时有用，其余用法同Selector一致。
     * data：         String  作为请求的主体发送的内容，默认为空即可
     * headers：      Object  修改默认请求头，（防止某些站点有referrer等请求头检查
     * rewrite_href:  Boolean 如果站点最终搜索显示的页面与实际使用搜索页面（特别是使用post进行交互的站点）不一致，
     *                        设置为true能让脚本存储最终url，并改写label使用的href属性
     *
     * 注意： 1. 如果某键有默认值，则传入值均会覆盖默认值
     *        2. 关于请求方法请参考：https://github.com/scriptish/scriptish/wiki/GM_xmlhttpRequest
     * */

    if (_version === "完整版") {
        let neizhan = imdb_id.match(/9999999/) ? ('/subject/' + douban_id) : imdb_id;  // PT内站 智能判定是用IMDB ID还是豆瓣ID
        let npid = imdb_id.match(/9999999/) ? ('douban=' + douban_id) : ('imdb=' + imdb_id);  // NPUBITS 智能判定是用IMDB ID还是豆瓣ID
        let ttgid = imdb_id.match(/9999999/) ? (zwm) : ( 'IMDB' + imdb_id.slice(2)); // TTG 智能判定是用IMDB ID还是中文名
        let zxid = imdb_id.match(/9999999/) ? (zwm) : imdb_id;  // ZX 智能判定是用IMDB ID还是中文名

        site_map.push({
            name: "PT内站",
            label: [
                {name: "BTSchool", link: 'http://pt.btschool.net/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,/* selector: "table.torrents:last > tbody > tr:gt(0)"}, */},
                {name: "BYRBT", link: 'https://bt.byr.cn/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "CCFBits", link:  'http://www.ccfbits.org/browse.php?fullsearch=1&notnewword=1&search=' + neizhan, selector: "table.mainouter > tbody > tr:last > td > table:nth-child(10) > tbody > tr:gt(0)"},
                {name: "CHDBits", link:  'https://chdbits.co/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "CMCT", link: 'https://hdcmct.org/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "GZTown", link: 'https://pt.gztown.net/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "FRDS", link: 'http://pt.keepfrds.com/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "HDChina", link: 'https://hdchina.org/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan, selector: "table.torrent_list:last > tbody > tr:gt(0)"},
                {name: "HDCity", link: 'https://hdcity.city/pt?incldead=1&search_area=1&notnewword=1&iwannaseethis=' + neizhan, selector: "center > div > div > div.text"},
                {name: "HDHome", link:  'https://hdhome.org/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "HDSky", link:  'https://hdsky.me/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "HDStreet", link:   'https://hdstreet.club/torrents.php?incldead=1&search_area=4&notnewword=1&search=' + douban_id,},
                {name: "HDTime", link:  'https://hdtime.org/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "HDU", link:  'http://pt.upxin.net/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "Hyperay", link:  'https://hyperay.org/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan, selector: "table.torrents > tbody > tr.nonstick_outer_bg"},
                {name: "JoyHD", link:  'https://www.joyhd.net/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "MTeam", link:  'https://tp.m-team.cc/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "NPUBITS", link:  'https://npupt.com/torrents.php?incldead=1&search_area=1&notnewword=1&' + npid, selector: "#torrents_table > tbody > tr:gt(0)"},
                {name: "NWSUAF", link:  'https://pt.nwsuaf6.edu.cn/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "NYPT", link:  'https://nanyangpt.com/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan, selector: "table.torrents:last > tbody > tr"},
                {name: "OpenCD", link:  'https://open.cd/torrents.php?incldead=1&search_area=0&notnewword=1&search=' + chinese_title, selector: "table.torrents:last > tbody > tr:gt(0)"},
                {name: "OurBits", link:  'https://ourbits.club/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "OurDiSC", link:  'http://bt.ourdisc.net/browse.php?incldead=0&search=' + chinese_title, selector: "table[width='100%'][border='0'][cellspacing='0'][cellpadding='10'] i"},
                {name: "PlayPT", link:  'http://pt.playpt123.org/play.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "SJTU", link:  'https://pt.sjtu.edu.cn/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan, selector: "table.torrents:last > tbody > tr"},
                {name: "SS", link: 'https://skyeysnow.com/forum.php?mod=torrents&notnewword=1&search=' + chinese_title + year, selector: "table.torrents > tbody > tr:gt(0)"},
                {name: "TCCF", link: 'https://et8.org/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "TLFBits", link: 'http://pt.eastgame.org/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan,},
                {name: "TTG", link: 'https://totheglory.im/browse.php?c=M&notnewword=1&search_field=' + ttgid, selector: "table#torrent_table:last > tbody > tr:gt(0)"},
                {name: "U2", link: 'https://u2.dmhy.org/torrents.php?incldead=1&search_area=0&notnewword=1&search=' + chinese_title + year,},
                {name: "WHUPT", link: 'https://pt.whu.edu.cn/torrents.php?incldead=1&search_area=1&notnewword=1&search=' + neizhan, selector: "table.torrents:last > tbody > tr"},
                {name: "ZX", link: 'http://pt.zhixing.bjtu.edu.cn/search/x' + zxid + '-notnewword=1/', selector: "table.torrenttable > tbody > tr:gt(1)"},
            ]
        });
        if(!imdb_id.match(/9999999/)){
            site_map.push({
                name: "PT外站",
                label:[
                    {name: "AB", link:  'https://animebytes.tv/torrents.php?searchstr=' + ywm, selector: "div.thin > div.group_cont"},
                    {name: "ADC", link:  'http://asiandvdclub.org/browse.php?descr=1&btnSubmit=Search%21&search=' + imdb_id, selector: "table.torrenttable:last > tbody > tr"},
                    {name: "AOX", link:  'https://aox.to/index.php?page=torrents&options=4&search=' + imdb_id, selector:  "table.table.table-bordered:last > tbody > tr:gt(0)"},
                    {name: "Apollo", link:  'https://apollo.rip/torrents.php?searchstr=' + eng_title, selector:"#torrent_table:last > tbody > tr.group_torrent:gt(0)"},
                    {name: "AR", link:  'https://alpharatio.cc/torrents.php?searchstr=' + ywm, selector:"#torrent_table > tbody > tr:gt(0)"},
                    {name: "AT", link: 'https://animetorrents.me/torrents.php?search=' + eng_title, ajax: 'https://animetorrents.me/ajax/torrents_data.php?total=1&search=' + eng_title + '&SearchSubmit=&page=1' , headers:{"x-requested-with": "XMLHttpRequest"}, rewrite_href:false, selector:'table.dataTable > tbody > tr:nth-child(2)', selector_need_login:"h1.headline strong:contains('Access Denied!')"}, 
                    {name: "AVZ", link: 'https://avistaz.to/torrents?in=1&search=' + ywm, selector:"table.table-condensed.table-striped.table-bordered:last > tbody > tr:gt(0)"},
                    {name: "BakaBT", link: 'https://bakabt.me/browse.php?q=' + ywm, selector:"table.torrents > tbody > tr:gt(0)", selector_need_login:"#loginForm"},
                    {name: "BHD", link: 'https://beyond-hd.me/browse.php?incldead=0&search=' + imdb_id, selector:"table.tb_detail.grey.torrenttable:last > tbody > tr:gt(0)"},
                    {name:"Blutopia",type:"json",link:"https://blutopia.xyz/torrents?_token=5VVPtEs9eFgfa5k9XsWvppGQTCWVGpDRuF8FQcld&search=" + eng_title + year, ajax: "https://blutopia.xyz/filterTorrents?_token=5VVPtEs9eFgfa5k9XsWvppGQTCWVGpDRuF8FQcld&search=" + eng_title + year, selector:"count > 0"},
                    {name: "CC", link:  'http://www.cartoonchaos.org/index.php?page=torrents&options=0&active=1&search=' + ywm, selector:"table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:gt(0)"},
                    {name: "HDF", link:  'https://hdf.world/torrents.php?searchstr=' + ywm, selector:"#torrent_table > tbody > tr:gt(0)"},
                    {name: "HDME", link:  'http://hdme.eu/browse.php?incldead=1&blah=1&search=' + imdb_id, selector:"table:nth-child(13) > tbody > tr"},
                    {name: "HDMonkey", link: 'https://hdmonkey.org/torrents-search.php?incldead=0&search=' + ywm, selector: "table.ttable_headinner > tbody > tr:gt(0)"},
                    {name: "HDS", link: 'https://hd-space.org/index.php?page=torrents&active=1&options=2&search=' + imdb_id, selector: "table.lista:last > tbody > tr:gt(0)"},
                    {name: "HDT", link:  'https://hd-torrents.org/torrents.php?active=1&options=2&search=' + imdb_id, selector: "table.mainblockcontenttt b"},
                    //{name: "ILC", link:  'http://www.iloveclassics.com/browse.php?searchin=2&search=' + imdb_id, selector: "#hover-over > tbody > tr.table_col1:gt(0)"},
                    {name: "IPT", link: 'https://iptorrents.com/t?qf=all&q=' + imdb_id, selector: "#torrents td.ac"},
                    {name: "JPOP", link: 'https://jpopsuki.eu/torrents.php?searchstr=' + eng_title, selector: "#torrent_table > tbody > tr:gt(0)"},
                    {name: "NetHD", link: 'http://nethd.org/torrents.php?incldead=1&search_area=4&search=' + imdb_id, selector: "table.table.table-bordered.torrent > tbody > tr:gt(1)"},
                    {name: "PHD", link: 'https://privatehd.to/torrents?in=1&search=' + ywm, selector: "table.table-condensed.table-striped.table-bordered:first > tbody > tr:gt(0)"},
                    {name: "PTF", link: 'http://ptfiles.net/browse.php?incldead=0&title=0&search=' + ywm, selector:  "#tortable > tbody > tr.rowhead:gt(0)"},
                    {name: "Red", link: 'https://redacted.ch/torrents.php?searchstr=' + eng_title, selector: "#torrent_table > tbody > tr.group_torrent:gt(0)"},
                    {name: "SC", link:  'https://secret-cinema.pw/torrents.php?cataloguenumber=' + imdb_id, selector: "div.torrent_card"},
                    {name: "Speed", link: 'https://speed.cd/browse.php?d=on&search=' + imdb_id, selector: "div.boxContent > table:first >tbody > tr:gt(0)"},
                    {name: "TD", link: 'https://www.torrentday.com/t?q=' + imdb_id, selector: "#torrentTable td.torrentNameInfo"},
                    {name: "TS", link: 'https://www.torrentseeds.org/browse.php?searchin=title&incldead=0&search=%22' +eng_title +year + '%22', selector: "table.table.table-bordered > tbody > tr.browse_color:gt(0)"},
                    {name: "TT", link: 'https://revolutiontt.me/browse.php?search=' + imdb_id, selector: "table#torrents-table > tbody > tr:gt(0)"},
                    {name:"TL",type:"json",link:"https://www.torrentleech.org/torrents/browse/index/query/" + eng_title + year, ajax: "https://www.torrentleech.org/torrents/browse/list/query/" + eng_title + year, selector:"numFound > 0"},
                    {name: "UHD",link: 'https://uhdbits.org/torrents.php?searchstr=' + imdb_id, selector:  "table.torrent_table > tbody > tr.group"},
                    {name: "Waffles", link: 'https://waffles.ch/browse.php?q=' + eng_title, selector: "#browsetable:last > tbody > tr:gt(0)"},
                    {name: "WOP", link: 'http://worldofp2p.net/browse.php?incldead=0&searchin=descr&search=' + imdb_id, selector:  "table.yenitorrenttable:last > tbody > tr:gt(0)"},
                ]
            });
            site_map.push({
                name: "NZB资源",
                label:[
                    {name: "DOGnzb", link:  'https://dognzb.cr/search?q=' + ywm,selector: "#featurebox > table > tbody > tr > td > table > tbody > tr.odd:gt(0)"},
                    {name: "LuluNZB", link:  'https://lulunzb.com/search/' + ywm, selector: "#browsetable > tbody > tr:gt(0)", selector_need_login:"div.login-box"},
                    {name: "Miatrix",link:  'https://www.miatrix.com/search/' + ywm,selector: "#browsetable > tbody > tr:gt(0)"},
                    {name: "NewzTown",link:  'https://newztown.co.za/search/' + ywm,selector: "#browsetable > tbody > tr:gt(0)"},
                    {name: "NZBCat",link:  'https://nzb.cat/search/' + ywm,selector: "#browsetable > tbody > tr:gt(0)"},
                    {name: "NZBgeek",link:  'https://nzbgeek.info/geekseek.php?moviesgeekseek=1&browsecategory=&browseincludewords=' + ywm,selector: "table > tbody > tr.HighlightTVRow2:gt(0)", selector_need_login:"input[value='do_login']"},
                    {name: "NZBP", link: 'https://nzbplanet.net/search/' + ywm, selector:  "#browsetable > tbody > tr:gt(0)"},
                    {name: "Oznzb", link: 'https://www.oznzb.com/search/' + ywm, selector:  "#browsetable > tbody > tr.ratingReportContainer:gt(0)", selector_need_login:"#login"},
                    {name: "SNZB", link: 'https://simplynzbs.com/search/' + ywm, selector:  "#browsetable > tbody > tr:gt(0)"},
                ]
            });
        }
        if (ptzimu.trim().length > 0) {
            site_map.push({
                name: "PT字幕",
                label:[
                    {name:"BYRBT®", link:  "https://bt.byr.cn/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table:last > tbody > tr:gt(1)"},
                    {name:"CHDBits®", link:  "https://chdbits.co/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table:last > tbody > tr:gt(1)"},
                    {name:"CMCT®", link:  "https://hdcmct.org/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table:last > tbody > tr:gt(1)"},
                    {name:"FRDS®", link:  "http://pt.keepfrds.com/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='940'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr:nth-child(2)"},
                    {name:"HDChina®", link:  "https://hdchina.org/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table.uploaded_sub_list > tbody > tr:gt(1)"},
                    {name:"HDCity®", link:  "https://hdcity.city/subtitles?notnewword=1&search="  + ptzimu, selector: "center > div:nth-child(1) > table > tbody > tr:nth-child(2)"},
                    {name:"HDHome®", link:  "https://hdhome.org/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table:last > tbody > tr:gt(1)"},
                    {name:"HDSky®", link:  "https://hdsky.me/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table:last > tbody > tr:gt(1)"},
                    {name:"HDTime®", link:  "https://hdtime.org/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='100%'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr"},
                    {name:"HDU®", link:  "http://pt.upxin.net/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='940'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr:nth-child(2)"},
                    {name:"Hyperay®", link:  "https://hyperay.org/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='940'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr:nth-child(2)"},
                    {name:"JoyHD®", link:  "https://www.joyhd.net/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='940'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr:nth-child(2)"},
                    {name:"MTeam®", link:  "https://tp.m-team.cc/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table.table-subtitle-list:last > tbody > tr"},
                    {name:"NPUBITS®", link:  "https://npupt.com/subtitles.php?notnewword=1&search="  + ptzimu, selector: "#main > table > tbody > tr:nth-child(2)"},
                    {name:"NYPT®", link:  "https://nanyangpt.com/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='940'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr:nth-child(2)"},
                    {name:"OurBits®", link:  "https://ourbits.club/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='940'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr:nth-child(2)"},
                    {name:"SJTU®", link:  "https://pt.sjtu.edu.cn/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='940'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr:nth-child(2)"},
                    {name:"TCCF®", link:  "https://et8.org/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='940'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr:nth-child(2)"},
                    {name:"TLFBits®", link:  "http://pt.eastgame.org/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='940'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr:nth-child(2)"},
                    {name:"U2®", link:  "https://u2.dmhy.org/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table[width='940'][border='1'][cellspacing='0'][cellpadding='5'] > tbody > tr:nth-child(2)"},
                    {name:"WHUPT®", link:  "https://pt.whu.edu.cn/subtitles.php?notnewword=1&search="  + ptzimu, selector: "table.no-vertical-line:last > tbody > tr"},
                ]
            });
        }
    }

    site_map.push({
        name: "中文字幕",
        label:[
            {name:'字幕库', link:'http://www.zimuku.cn/search?q=' + title,selector:'div.box.clearfix div.item.prel.clearfix'},
            {name:'字幕天堂',method:"post", link:'http://www.zmtiantang.com/e/search/',data:`keyboard=${title}&show=title&classid=1,3&tempid=1`,headers:{"Content-Type": "application/x-www-form-urlencoded"},rewrite_href:true,selector:'table.data > tbody > tr:nth-child(2)'},
            {name:'字幕组', link:'http://www.zimuzu.tv/search/index?type=subtitle&keyword=' + title,selector:".search-result li"},
            {name:'sub HD', link:'http://subhd.com/search/' + title,selector:"div.col-md-9 div.box"},
            {name:'伪射手', link:'http://assrt.net/sub/?searchword=' + title,selector:"div.body div.subitem"},
            {name:'163字幕', link:'http://www.163sub.com/Search?id=' + title,selector:"#main_narrow_bd div.subs_list"},
            {name:'电波字幕', link:'http://dbfansub.com/?s=' + title,selector:"div.panel-body article.panel.panel-default.archive"},
            {name:'字幕社', link:'https://www.zimushe.com/search.php?keywords=' + title,selector:"div.wrap-l li"},
            {name:'中文字幕网', link:'http://www.zimuzimu.com/so_zimu.php?title=' + title,selector:"table.sublist a.othersub"},
            {name:'r3sub', link:'https://r3sub.com/search.php?s=' + title,selector:"div.col-sm-8.col-md-9.col-lg-8 div.movie.movie--preview.ddd"},
            {name:'HDZIMU', link:'http://www.hdzimu.com/?s=' + title,selector:'div.post-warp div.post-box'},
            {name:'M1080', link:'http://zimu.m1080.com/search.asp?a=&s=' + title,selector:"table td"},
            {name:'OpenSub', link:'https://www.opensubtitles.org/zh/search/sublanguageid-chi,zht,zhe,eng/imdbid-' + imdb_id,selector:"#search_results tr.change"},
        ]
    });

    if(!imdb_id.match(/9999999/)){
        site_map.push({
            name: "英文字幕",
            label:[
                {name:'Addic7ed', link:'http://www.addic7ed.com/search.php?search=' + eng_title_clean + year,selector:"table.tabel tr"},
                {name:'Podnapisi', link:'https://www.podnapisi.net/zh/subtitles/search/?language=zh&language=en&keywords=' + eng_title_clean + '&' + year + '-' + year,selector:"table tr.subtitle-entry"},
                {name:'Subscene', link:'https://subscene.com/subtitles/release?r=true&q=' + ywm,selector:"table td.a1"},
                {name:'TVsubs', link:'http://tvsubs.net/search.php?q=' + eng_title_clean,selector:"div.cont li"},
                {name:'TVsubtitles', link:'http://www.tvsubtitles.net/search.php?q=' + eng_title_clean,selector:"div.left_articles li"},
                {name:'YIFY', link:'http://www.yifysubtitles.com/search?q=' + eng_title_clean,selector:"div.col-sm-12 div.col-xs-12"},
            ]
        });
    }

    site_map.push({
        name: "在线视频",
        label:[
            {name:'Neets', link:'http://neets.cc/search?key=' + title,selector:'#search_li_box div.search_li.clearfix'},
            {name:'爱奇艺视频', link:'https://so.iqiyi.com/so/q_' + title,selector:"div.mod_result a.info_play_btn"},
            {name:'次元壁', link:'http://www.ciyuan.bi/Search?keyword=' + title,selector:'div.search_left_container div.search_list_box_right'},
            {name:'哈哩哈哩', link:'http://www.halihali.cc/search/?wd=' + title,selector:'#contents div.info'},
            {name:'搜狐视频', link:'https://so.tv.sohu.com/mts?wd=' + title,selector:'div.wrap.cfix div.cfix.resource'},
            {name:'腾讯视频', link:'https://v.qq.com/x/search/?q=' + title,selector:'div.wrapper_main div._infos'},
            {name:'优酷视频', link:'http://www.soku.com/search_video/q_' + title,selector:'div.DIR div.s_info'},
            {name:'AAQQS', link:'http://aaxxy.com/vod-search-pg-1-wd-' + title + '.html',selector:'#find-focus li'},
            {name:'Q2电影网', link:'http://www.q2002.com/search?wd=' + title,selector:'div.container div.movie-item'},
            {name:'魔力电影网', link:'http://www.magbt.net/search.php?searchword=' + title,selector:'#content li.listfl'},
            {name:'小朱视频', link:'http://noad.zhuchaoli.club/search/' + title + '.html',selector:'div.b-listtab-main li.item'},
            {name:'9ANIME', link:'https://www4.9anime.is/search?keyword=' + eng_title,selector:"div.film-list a.name"},
        ]
    });

    site_map.push({
        name: "电影资源",
        label:[
            {name:'52 Movie', link:'http://www.52movieba.com/search.htm?keyword=' + title,selector:'table.table.table-hover.threadlist tr.thread.tap'},
            {name:'97电影网', link:'http://www.id97.com/search?q=' + title,selector:'div.container div.col-xs-7'},
            {name:'VIPHD', link:'http://www.viphd.co/search-s-run?csrf_token=2087c14707cb8e6c&keyword=' + title,selector:'div.search_content dl'},
            {name:'爱下电影网', link:'http://www.aixia.cc/plus/search.php?searchtype=titlekeyword&q=' + title,selector:'div.con li'},
            {name:'比特大雄', link:'https://www.btdx8.com/?s=' + title,selector:'#content div.post.clearfix'},
            {name:'比特影视', link:'https://www.bteye.com/search/' + title,selector:'#main div.item'},
            {name:'电影巴士', link:'http://www.dy8c.com/?s=' + title,selector:'#content div.post-box'},
            {name:'电影首发站', link:'http://www.dysfz.cc/key/' + title + '/',selector:'.movie-list li'},
            {name:'电影天堂', method:"post", link:'https://www.dy2018.com/e/search/index.php',data:`show=title%2Csmalltext&tempid=1&keyboard=${gtitle}&Submit=%C1%A2%BC%B4%CB%D1%CB%F7`,headers:{"Content-Type": "application/x-www-form-urlencoded"},rewrite_href:true, selector:'div.co_content8 table'},
            {name:'嘎嘎影视', link:'http://www.gagays.xyz/movie/search?req%5Bkw%5D=' + title,selector:'#movie-sub-cont-db div.large-movie-detail'},
            {name:'高清MP4', link:'http://www.99tvs.com/?s=' + title,selector:'#post_container li'},
            {name:'高清电台', link:'https://gaoqing.fm/s.php?q=' + title,selector:'#result1 div.row'},
            {name:'高清控', link:'http://www.gaoqingkong.com/?s=' + title,selector:'#post_container div.post_hover'},
            {name:'户户盘', method:"post", link:'http://huhupan.com/e/search/index.php',data:`keyboard=${title}&show=title&tempid=1&tbname=news&mid=1&depost=search`,headers:{"Content-Type": "application/x-www-form-urlencoded"},rewrite_href:true, selector:'div.main h2'},
            {name:'蓝光网', link:'http://www.languang.co/?s=' + title,selector:'div.mi_cont li'},
            {name:'迷你MP4', link:'http://www.minimp4.com/search?q=' + title,selector:'div.container div.col-xs-7'},
            {name:'胖鸟电影', link:'http://www.pniao.com/Mov/so/' + title,selector:'div.mainContainer div.movieFlag.eachOne'},
            {name:'人生05', link:'http://www.rs05.com/search.php?s=' + title,selector:'#movielist li'},
            {name:'云播网', link:'http://www.yunbowang.cn/index.php?m=vod-search&wd=' + title,selector:'div.container div.col-xs-7'},
            {name:'中国高清网', link:'http://gaoqing.la/?s=' + title,selector:'div.mainleft div.post_hover'},
            {name:'最新影视站', link:'http://www.zxysz.com/?s=' + title,selector:'#content li.p-item'},
        ]
    });

    site_map.push({
        name: "动漫内站",
        label:[
            {name:'ACG.RIP', link:'https://acg.rip/?term=' + title,selector:'tbody tr'},
            {name:'ACG狗狗', link:'http://bt.acg.gg/search.php?keyword=' + title,selector:'tbody p.original.download'},
            {name:'ACG搜', link:'http://www.acgsou.com/search.php?keyword=' + title,selector:'tbody span.bts_1'},
            {name:'动漫花园', link:'https://share.dmhy.org/topics/list?keyword=' + title,selector:'tbody span.btl_1'},
            {name:'爱恋动漫', link:'http://www.kisssub.org/search.php?keyword=' + title,selector:'tbody span.bts_1'},
            {name:'喵搜', link:'https://nyaso.com/dong/' + title +'.html',selector:'tbody a.down'},
            {name:'旋风动漫', link:'http://share.xfsub.com:88/search.php?keyword=' + title,selector:'#listTable span.bts_1'},
            {name:'怡萱动漫', link:'http://www.yxdm.tv/search.html?title=' + title,selector:'div.main p.stars1'},
        ]
    });

    if(!imdb_id.match(/9999999/)){
        site_map.push({
            name: "动漫外站",
            label:[
                {name:'AniDex', link:'https://anidex.info/?q=' + eng_title,selector:'div.table-responsive tr'},
                {name:'AniRena', link:'https://www.anirena.com/?s=' + eng_title,selector:'#content table'},
                {name:'AniTosho', link:'https://animetosho.org/search?q=' + eng_title,selector:'#content div.home_list_entry'},
                {name:'Nyaa', link:'https://nyaa.si/?q=' + eng_title,selector:'div.table-responsive tr.default'},
                {name:'ニャパンツ', link:'https://nyaa.pantsu.cat/search?c=_&q=' + eng_title,selector:'#torrentListResults tr.torrent-info'},
                {name:'东京図书馆', link:'https://www.tokyotosho.info/search.php?terms=' + eng_title,selector:'table.listing td.desc-top'},
            ]
        });
    }

    site_map.push({
        name: "美剧资源",
        label:[
            {name:'人人影视', link:'http://www.zimuzu.tv/search?type=resource&keyword=' + title,selector:"div.search-result > ul > li"},
            {name:'人人美剧', link:'http://www.yyetss.com/Search/index/s_keys/' + title,selector:'div.row div.col-xs-3'},
            {name:'天天美剧', link:'http://www.ttmeiju.vip/index.php/search/index.html?keyword=' + title,selector:'table.latesttable tr.Scontent1'},
            {name:'爱美剧', link:'https://22v.net/search/' + title,selector:'div.movie span'},
            {name:'天天看美剧', link:'http://www.msj1.com/?s=' + title,selector:'div.cat_list div.art_show_top'},
            {name:'美剧粉', link:'http://www.itvfans.com/?s=' + title,selector:'#main-wrap-left div.home-blog-entry-text'},
        ]
    });

    site_map.push({
        name: "BT内站",
        label:[
            {name:'BT吧', link:'http://www.btba.com.cn/search?keyword=' + title,selector:'div.left li'},
            {name:'BT蚂蚁', link:'https://www.btmyi.com/search.html?kw=' + title,selector:"div.row h5.item-title"},
            {name:'BT天堂', link:'http://www.bttt.la/s.php?q=' + title,selector:'div.ml div.title'},
            {name:'BT之家', link:'http://www.btbtt.co/search-index-keyword-' + title + '.htm',selector:'#threadlist table'},
            {name:'RARBT', link:'http://www.rarbt.com/index.php/search/index.html?search=' + title,selector:'div.ml div.title'},
            {name:'查片源', link:'https://www.chapianyuan.com/?keyword=' + title,selector:'div.block li'},
            {name:'磁力猫', link:'http://www.cilimao.me/search?word=' + title,selector:'#Search__content_left___2MajJ div.MovieCard__content___3kv1W'},   // TODO check
            {name:'磁力站', link:'http://oabt004.com/index/index?c=&k=' + title,selector:'div.link-list-wrapper ul.link-list'},
            {name:'光影资源', link:'http://www.etdown.net/index.php?keyword=' + title,selector:'tbody.list_4 tr'},
            {name:'我爱P2P', link:'http://www.woaip2p.net/topic/list?categoryId=0&title=' + title,selector:'tbody td.word-break'},
            {name:'小浣熊下载', link:'https://www.xiaohx.org/search?key=' + title,selector:'div.search_right li'},
            {name:'一站搜', link:'http://v.yizhansou.com/search?kw=' + title,selector:'table td.st'},
        ]
    });

    if(!imdb_id.match(/9999999/)){
        site_map.push({
            name: "BT外站",
            label:[
                {name:'1337X', link:'https://1337x.to/search/' + ywm + '/1/',selector:'table.table-list.table.table-responsive.table-striped td.coll-1.name'},
                {name:'BT-Scene', link:'https://bt-scene.cc/results_.php?q=' + ywm,selector:'table.tor td.tname'},
                {name:'iDope', link:'https://idope.se/torrent-list/' + ywm,selector:'#div2child div.resultdiv'},
                {name:'ISOHunt', link:'https://isohunt2.net/torrent/?ihq=' + ywm,selector:'#serps td.title-row'},
                {name:'KickAss', link:'https://katcr.co/katsearch/page/1/' + ywm,selector:'div.table--responsive_vertical div.torrents_table__torrent_name'},
                {name:'Lime', link:'https://www.limetorrents.cc/search/all/' + ywm,selector:'table.table2 div.tt-name'},
                {name:'RARBG', link:'http://rarbg.is/torrents.php?search=' + imdb_id,selector:'table.lista2t tr.lista2'},
                {name:'TorLock', link:'https://www.torlock2.com/all/torrents/' + ywm.replace(/ /g,"-") +'.html',selector:'table.table.table-striped.table-bordered.table-hover.table-condensed td.td'},
                {name:'WorldWide', link:'https://worldwidetorrents.me/torrents-search.php?search=' + ywm,selector:'div.w3-responsive td.w3-jose'},
                {name:'Zooqle', link:'https://zooqle.com/search?q=' + ywm,selector:'div.panel-body a.small'},
                {name:'海盗湾', link:'https://thepiratebay.org/search/' + ywm,selector:'#searchResult div.detName'},
            ]
        });
    }

    function Exist_check(label) {
        let site = label.name;
        let psite = $(`a[data-name="${site}"]`);

        function TagExist(link){
            $(psite).css("background-color", GM_getValue("tag_bcolor_exist","#e3f1ed"));
            $(psite).css("color", GM_getValue("tag_fcolor_exist","#3377aa"));
            $(psite).attr("title","资源存在");
            let storage_data = true;
            if (label.rewrite_href && label.rewrite_href === true) {   // 重写链接
                storage_data = GM_getCacheValue(`${douban_id}_${site}`, link || $(psite).attr("href"),false);
                $(psite).attr("href",storage_data);
            }
            GM_setCacheValue(`${douban_id}_${site}`,storage_data,86400 * 7 * 1e3,false);
        }

        function TagNotExist() {
            $(psite).css("background-color", GM_getValue("tag_bcolor_not_exist","#f4eac2"));
            $(psite).css("color", GM_getValue("tag_fcolor_not_exist","#3377aa"));
            $(psite).attr("title","资源不存在");
        }

        function TagNeedLogin() {
            $(psite).css("background-color", GM_getValue("tag_bcolor_need_login",""));
            $(psite).css("color", GM_getValue("tag_fcolor_need_login","#3377aa"));
            GM_setCacheValue(`need_login_${site}`,true, 86400 * 1e3);
            $(psite).click(function () {
                GM_deletedCacheValue(`need_login_${site}`);
            });
            $(psite).attr("title","站点需要登陆");
        }

        function TagError() {
            $(psite).css("background-color", GM_getValue("tag_bcolor_error",""));
            $(psite).css("color", GM_getValue("tag_fcolor_error","#3377aa"));
            $(psite).attr("title", "遇到问题");
        }


        // 这里假定有这个资源的就一直都有，直接使用第一次请求成功的时候缓存信息
        if (GM_getCacheValue(`${douban_id}_${site}`, false)) {
            TagExist();
            return;
        }

        // 如果前次检查到这个站点需要登陆
        if (GM_getCacheValue(`need_login_${site}`, false)) {
            TagNeedLogin();
            return;
        }

        // 不然，则请求相关信息
        $(psite).attr("title", "正在请求信息中");
        GM_xmlhttpRequest({
            method: label.method || "GET",
            url: label.ajax || label.link,
            data: label.data,
            headers: label.headers,
            onload: function (res) {
                if (/login|verify|checkpoint|returnto/ig.test(res.finalUrl)) {
                    TagNeedLogin(); // 检查最终的URL看是不是需要登陆
                } else if (/refresh: \d+; url=.+login.+/ig.test(res.responseHeaders)){
                    TagNeedLogin(); // 检查responseHeader有没有重定向
                } else {
                    let responseText = res.responseText;
                 // if (label.name==="AT") {console.log(label.name);console.log(res.finalUrl);console.log(res.responseHeaders);console.log(res.responseText);}
                    if (typeof responseText === "undefined") {
                        TagNeedLogin(); // 检查最终的Text，如果什么都没有也可能说明需要登陆
                    } else if (responseText.length <800 && /login/.test(responseText)) {
                        TagNeedLogin(); // 对Text进行检查，断言“过短，且中间出现login字段”即说明可能需要登陆
                    } else {  // 开始解析返回信息
                        try {
                            TagNotExist();  // 先断言不存在
                            if (label.type && label.type === "json") {  // 如果前面定义了返回类型是 "json"
                                let par = JSON.parse(responseText);
                                if (eval("par." + label.selector)) {
                                    TagExist();
                                }
                            } else {  // 否则默认label.type的默认值为 html
                                let doc = (new DOMParser()).parseFromString(res.responseText, 'text/html');
                                let body = doc.querySelector("body");
                                // 因为jQuery的选择器丰富，故这里不用 dom.querySelector() 而用 jQuery.find()
                                if (label.selector_need_login && $(body).find(label.selector_need_login).length){
                                    TagNeedLogin(); // 如果存在selector_need_login选择器，则先判断是否存在以确定是否需要登录
                                } else if ($(body).find(label.selector || "table.torrents:last > tbody > tr:gt(0)").length) {
                                    TagExist(res.finalUrl);  // 最后使用selector选择器判断资源是否存在
                                }
                            }
                        } catch (e) {
                            TagError();
                        }
                    }
                }
            },
            onerror: function () {
                TagError();
            }
        });
    }

    function site_exist_status() {
        for (let i = 0; i < site_map.length; i++) {
            let map_dic = site_map[i];
            if (GM_getCacheValue("delete_site_" + map_dic.name,false)) {
                continue;
            }
            $('#content div.tags').before(`<div class="c-aside name-offline" data-id="${i}"><h2><i>${map_dic.name}</i>· · · · · ·</h2><div class=c-aside-body style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>`);

            let in_site_html = $(`div[data-id='${i}'] ul.bs`);
            for (let j = 0; j < map_dic.label.length; j++) {
                let label = map_dic.label[j];
                if (GM_getCacheValue("delete_site_" + label.name,false)) {
                    continue;
                }
                in_site_html.append(`<a href="${label.link}" data-name="${label.name}" target="_blank" rel="nofollow" class="name-offline">${label.name}</a>`);
                Exist_check(label)
            }
        }
    }
    site_exist_status();
});