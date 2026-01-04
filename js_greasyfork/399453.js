// ==UserScript==
// @name         Fortuna Theme
// @name:fr      Thème Fortuna
// @name:it      Fortuna Theme
// @name:de      Fortuna-Thema
// @name:es      Tema Fortuna
// @name:pt      Tema fortuna
// @name:pt-BR   Tema fortuna
// @name:ru      Тема Фортуна
// @name:pl      Motyw Fortuna
// @name:uk      Тема Фортуна
// @name:tr      Fortuna Teması
// @name:ja      フォルトゥナのテーマ
// @name:zh-CH   福图纳主题
// @name:zh-TW   福圖納主題
// @name:ko      포르투나 테마
// @version      1.0.5
// @description        Theme Fortuna for warframe.market
// @description:fr     Thème Fortuna pour warframe.market
// @description:it     Tema Fortuna per warframe.market
// @description:de     Thema Fortuna für warframe.market
// @description:es     Tema Fortuna para warframe.market
// @description:pt     Tema Fortuna para warframe.market
// @description:pt-BR  Tema Fortuna para warframe.market
// @description:ru     Тема Фортуна для warframe.market
// @description:pl     Motyw Fortuna dla warframe.market
// @description:uk     Тема Фортуна для warframe.market
// @description:tr     Warframe.market için Tema Fortuna
// @description:ja     warframe.marketのテーマFortuna
// @description:zh-CH  warframe.market的主题Fortuna
// @description:zh-TW  warframe.market的主題Fortuna
// @description:ko     warframe.market를위한 테마 Fortuna
// @support     ( support me online in game on " /profile pierre314r ")
// @author       DEV314R
// @include        *warframe.market*
// @namespace https://greasyfork.org/users/467251
// @run-at       document-start
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/399453/Fortuna%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/399453/Fortuna%20Theme.meta.js
// ==/UserScript==
GM_addStyle('html::-webkit-scrollbar-thumb{background:#9370db;}'+
'[class*="theme"]{\
--color_rgb_text: 57, 105, 192;\
--color_dark_border:#8000ff;\
            --color_place_order:#3969c0;\
    --color_place_order--hover: #db10db;\
   --color_place_order--active: #ff73e6;\
	       --color_link--active:#ff73e6;\
	        --color_link--hover:#ff73e6;\
        --color_rgb_link--hover:255, 115, 230\
	 --color_link_dimmed--hover:#ff73e6;\
--color_rgb_link_dimmed--active:#ff73e6;\
	          --color_dark_text:#ff73e6;\
	            --color_dark_h1:#ff73e6;\
	         --color_input_text:#ff73e6;\
--color_input_text--highlight:#db10db;\
        --color_border: #3969c0;\
  --color_border--light:#3969c0;\
           --color_link:#3969c0;\
             --color_h1:#3969c0;\
	         --color_h2:#3969c0;\
	         --color_h3:#3969c0;\
             --color_h4:#ff73e6;\
           --color_text:#3969c0;\
--color_dark_disclaimer:#3969c0;\
    --color_link_dimmed:#3969c0;\
--color_rgb_link_dimmed:#3969c0;\
   --color_input_border:#3969c0;\
 --color_border--darker:#3969c0;\
         --color_background--light:#18032c;\
   --color_dark_background--darker:#18032c;\
	--color_input_group_background:#090322;\
--color_input_background--selected: #090322;\
                --color_background: #090322;\
         --color_background--darker:#090322;\
            --color_dark_background:#090322;\
          --color_place_order_text: #090322;\
      --color_rgb_background--light:#0000;\
                --color_button_text:#090322;\
	       --color_input_background:#090322;\
	 --color_dark_background--light:#090322;\
--color_price:#aaa9aa;\
--color_status-offline:#ce0000;\
	  --color_link_red:#ce0000;\
--color_status-online:#00bd00;\
--color_status-ingame:#ac84ff;\
--color_status-invis:#fff;\
	--color_placeholder:#f0f;\
	--color_buy:#00c67e;\
	--color_sell:#ff00a5;}'+
'.filter__unit input[type=number]{color:#ff73e6;}'+
'.group__core text {fill: #ac84ff;}'+
'.chart__volumes rect{fill: #8000ff;}'+
'.chart__donchian{fill: #009fca;}'+
'.pointer__line,.y-axis-volume line, .y-axis-volume path,.y-axis-price line,.y-axis-price path,.x-axis line,.x-axis path,.y-grid-price line,.y-grid-volume line,.y-grid-price path,.y-grid-volume path{stroke: #b000ff;}'+
'.group__legend>rect {fill: #18032c;stroke: #b000ff;}');