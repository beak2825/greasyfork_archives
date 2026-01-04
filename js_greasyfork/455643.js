// ==UserScript==
// @name         getBaiduCssLib
// @namespace    http://tampermonkey.net/
// @version      2022121206
// @description  pc端百度双列显示Css
// @author       tutu辣么可爱(greasyfork)/IcedWatermelonJuice(github)
// @grant        GM_info
// @license      MIT
// ==/UserScript==
function getBaiduCssLib(k){
	var version="2022121206";
	var common=`
		/**Store BaiduCommonStyle**/
		iframe:not([src*='chrome']),
		.res_top_banner #foot,
		#page .fk,
		#head .headBlock,
		#rs_top_new,
		#wrapper #content_left > table,
		#wrapper #content_left .c-recommend,
		#wrapper #content_left .leftBlock,
		#wrapper #content_left .rrecom-btn-parent,
		#demo,
		#wrapper #gotoPage,
		body > div.result-op,
		.rrecom-container,
		.chunwan-wrapper {
		  display: none !important;
		}
		body {
		  background-color: #f5f5f5;
		  /*transition: all ease-out 0.8s;*/
		}
		#ala_img_results {
		  overflow: hidden;
		}
		body a,
		body a em,
		#u a,
		#wrapper #content_left .result h3 a em {
		  text-decoration: none;
		}
		body a:hover,
		body a:hover em {
		  text-decoration: none;
		}
		#wrapper #s_tab {
		  border-bottom: #e0e0e0 1px solid;
		  background-color: #f8f8f8;
		}
		body #head {
		  top: 0;
		  background-color: rgba(248, 248, 248, 0.4);
		  border-bottom: none;
		  backdrop-filter: blur(10px);
		}
		form.fm {
		  background-color: unset;
		}
		form.fm .s_btn {
		  background: #3476d2;
		  border-bottom: 1px solid #3476d2;
		}
		form.fm .s_btn:hover {
		  background: #4F7FbF;
		  border-bottom: 1px solid #3476d2;
		}
		form.fm .bdsug li {
		  width: auto;
		  color: #000;
		  font: 15px arial;
		  line-height: 26px;
		}
		form.fm .s_ipt_wr.bg {
		  background: #fff;
		  width: 66%;
		  min-width: 570px;
		}
		#content_left .new-pmd .c-span9,
		#content_left .new-pmd .c-span10 {
		  width: unset;
		  float: unset;
		}
		/***fix 2k+ problem***/
		#head .head_wrapper {
		  width: unset;
		  /*edit: fix baidu banner position*/
		}
		#wrapper #s_tab b {
		  color: #3476d2;
		  border-bottom: 3px #3476d2 solid;
		}
		#wrapper .head_nums_cont_outer .search_tool_conter,
		#wrapper .head_nums_cont_outer .nums {
		  width: 630px;
		}
		#wrapper #content_left {
		  animation-name: ani_topTobuttom;
		  animation-duration: 0.1s;
		  animation-timing-function: ease;
		}
		#head .head_wrapper {
		  animation-name: ani_leftToright;
		  animation-duration: 0.2s;
		  animation-timing-function: ease-in;
		}
		#wrapper #rs,
		#wrapper #content_left .result,
		#wrapper #content_left .result-op,
		#wrapper #content_left > .c-container {
		  width: 670px;
		  padding: 0 8px 15px 20px;
		  margin-top: 0;
		  margin-left: 0;
		  margin-bottom: 30px;
		  border-radius: 15px;/* 圆角 */
		  background-color: #fff;
		  box-sizing: border-box;
		  border: 1px solid rgba(0, 0, 0, 0.1);
		}
		#wrapper #rs div[class*='single-card-wrapper'],
		#wrapper #content_left .result div[class*='single-card-wrapper'],
		#wrapper #content_left .result-op div[class*='single-card-wrapper'],
		#wrapper #content_left > .c-container div[class*='single-card-wrapper'] {
		  width: 98%;
		}
		#wrapper #content_left > .c-container:hover,
		#wrapper #content_left > .result:hover,
		#wrapper #content_left > .result-op:hover,
		#wrapper #content_left > .c-container:hover article {
		  border: 1px solid rgba(0, 0, 0, 0.3);
		  box-shadow: 0 0 1px grey;
		}
		#wrapper #rs[ac-needhide],
		#wrapper #content_left > .result[ac-needhide],
		#wrapper #content_left > .result-op[ac-needhide],
		#wrapper #content_left > .c-container[ac-needhide] {
		  padding: 5px;
		  padding-left: 15px;
		}
		#wrapper #content_left > .result[tpl='soft'] .op-soft-title,
		#wrapper #content_left > .result h3[class~='t'],
		#wrapper #content_left > .c-container h3[class~='t'] {
		  background-color: #f8f8f8;
		  margin: 0px -8px 10px -20px;
		  padding: 8px 20px 5px;
		  border-radius: 15px 15px 0 0;/* 圆角 */
		}
		#wrapper #content_left .f13 a,
		#wrapper #content_left .f13 em,
		#wrapper #content_left .c-span18 a,
		#wrapper #content_left .subLink_factory a,
		#wrapper #content_left .subLink_answer a,
		#wrapper #content_left .c-tabs-content a,
		#wrapper #content_left .op_offical_weibo_content a,
		#wrapper #content_left .op_offical_weibo_pz a,
		#wrapper #content_left .op_tieba2_tablinks_container a,
		#wrapper #content_left .op-tieba-general-right,
		#wrapper #content_left .op_dq01_title,
		#wrapper #content_left .op_dq01_table a,
		#wrapper #content_left .op_dq01_morelink a,
		#wrapper #content_left .op-tieba-general-mainpl a,
		#wrapper #content_left .op-se-listen-recommend,
		#wrapper #content_left .c-offset > div a {
		  text-decoration: none;
		  color: #3476d2;
		}
		#wrapper #content_left .f13 a:hover,
		#wrapper #content_left .f13 em:hover,
		#wrapper #content_left .c-span18 a:hover,
		#wrapper #content_left .subLink_factory a:hover,
		#wrapper #content_left .subLink_answer a:hover,
		#wrapper #content_left .c-tabs-content a:hover,
		#wrapper #content_left .op_offical_weibo_content a:hover,
		#wrapper #content_left .op_offical_weibo_pz a:hover,
		#wrapper #content_left .op_tieba2_tablinks_container a:hover,
		#wrapper #content_left .op-tieba-general-right:hover,
		#wrapper #content_left .op_dq01_title:hover,
		#wrapper #content_left .op_dq01_table a:hover,
		#wrapper #content_left .op_dq01_morelink a:hover,
		#wrapper #content_left .op-tieba-general-mainpl a:hover,
		#wrapper #content_left .op-se-listen-recommend:hover,
		#wrapper #content_left .c-offset > div a:hover {
		  text-decoration: underline !important;
		}
		#wrapper #content_left .f13 a {
		  color: #008000;
		}
		#wrapper #content_left .c-span18,
		#wrapper #content_left .c-span24 {
		  width: 100%;
		  min-width: unset;
		}
		#wrapper #content_left #wrapper #content_left .op_jingyan_list,
		#wrapper #content_left #wrapper #content_left .se_com_irregular_gallery ul li,
		#wrapper #content_left #wrapper #content_left .result .op-img-address-link-type {
		  display: inline-block;
		  margin-left: 10px;
		}
		#wrapper #content_left #wrapper #content_left .c-border {
		  width: auto;
		  border: none;
		  border-bottom-color: transparent;
		  border-right-color: transparent;
		  box-shadow: 0 0 0 transparent;
		}
		#wrapper #content_left .op-soft-title h3[class~='t'],
		#wrapper #content_left .result h3[class~='t'],
		#wrapper #content_left .result-op h3[class~='t'],
		#wrapper #content_left > .c-container h3[class~='t'] {
		  font-weight: bold;
		  font-size: medium;
		}
		#wrapper #content_left .op-soft-title a,
		#wrapper #content_left .result a,
		#wrapper #content_left .result-op a,
		#wrapper #content_left > .c-container a {
		  color: #3476d2;
		  position: relative;
		}
		#wrapper #content_left .op-soft-title a em,
		#wrapper #content_left .result a em,
		#wrapper #content_left .result-op a em,
		#wrapper #content_left > .c-container a em {
		  color: #f73131;
		  font-weight: bold;
		}
		#wrapper #content_left .op-soft-title a:visited,
		#wrapper #content_left .result a:visited,
		#wrapper #content_left .result-op a:visited,
		#wrapper #content_left > .c-container a:visited {
		  color: #660099;
		}
		#wrapper #content_left .op-soft-title a:after,
		#wrapper #content_left .result a:after,
		#wrapper #content_left .result-op a:after,
		#wrapper #content_left > .c-container a:after,
		#wrapper #content_left .op-soft-title a:visited:after,
		#wrapper #content_left .result a:visited:after,
		#wrapper #content_left .result-op a:visited:after,
		#wrapper #content_left > .c-container a:visited:after {
		  content: "";
		  position: absolute;
		  border-bottom: 2px solid #3476d2;
		  bottom: -2px;
		  left: 100%;
		  width: 0;
		  transition: width 350ms, left 350ms;
		}
		#wrapper #content_left .op-soft-title a:hover:after,
		#wrapper #content_left .result a:hover:after,
		#wrapper #content_left .result-op a:hover:after,
		#wrapper #content_left > .c-container a:hover:after,
		#wrapper #content_left .op-soft-title a:visited:hover:after,
		#wrapper #content_left .result a:visited:hover:after,
		#wrapper #content_left .result-op a:visited:hover:after,
		#wrapper #content_left > .c-container a:visited:hover:after {
		  left: 0;
		  width: 100%;
		  transition: width 350ms;
		}
		#wrapper #content_left .c-group-wrapper {
		  padding: 30px;
		  margin: 0 0 20px 0;
		  min-width: 610px;
		}
		#wrapper #content_left .c-group-wrapper > .c-container {
		  min-width: unset;
		}
		#wrapper #content_left .c-group-wrapper .c-group {
		  margin: 0;
		  padding-top: 10px;
		}
		#wrapper #rs {
		  padding: unset;
		  margin: 20px;
		  border-radius: 5px;
		  z-index: 1;
		}
		#wrapper #rs .new-pmd {
		  padding: 20px;
		}
		#wrapper #rs .tt {
		  margin: -20px -20px 5px -20px;
		  padding: 15px 20px;
		  background-color: #f8f8f8;
		  border-radius: 5px 5px 0px 0px;
		}
		#wrapper #rs table {
		  width: 630px;
		  padding: 5px 15px;
		}
		#wrapper #rs table tr a {
		  margin-top: 5px;
		  margin-bottom: 5px;
		  color: #3476d2;
		}
		#wrapper #rs table tr a:hover {
		  text-decoration: underline;
		}
		.wrapper_new #form .bdsug-new {
		  padding-right: 11px;
		}
		#wrapper #page {
		  min-width: 710px;
		  height: 40px;
		  line-height: 40px;
		  padding-top: 5px;
		  margin-bottom: 50px;
		  margin-left: 0;
		}
		#wrapper #page a,
		#wrapper #page strong {
		  color: #3476d2;
		  height: auto;
		}
		#wrapper #page .n {
		  height: 34px;
		}
		#wrapper #page .n:hover,
		#wrapper #page a:hover .pc {
		  background: #d8d8d8;
		  color: #0057da;
		  filter: brightness(1.1);
		}
		#wrapper #page strong .pc {
		  background: #3476d2;
		  color: white;
		}
		.op-img-address-desktop-cont {
		  overflow: hidden;
		}
		.op-img-address-divide-high {
		  overflow: hidden;
		}
		#wrapper #kw {
		  width: 94%;
		}
		#container.sam_newgrid .c-container .t .AC-faviconT ~ a,
		#container.sam_newgrid .c-container .t .c-icon ~ a {
		  display: inline;
		}
		body #wrapper #content_left a[href*='official'] {
		  color: white;
		}
		#content_left .c-group-middle,
		#content_left .c-group-top {
		  margin-bottom: 30px !important;
		}
		#container.sam_newgrid #content_left .c-container .c-container {
		  width: auto;
		  min-width: unset;
		}
		#container.sam_newgrid #content_right .right-ceiling {
		  position: unset;
		}
		.c-container .c-result-content {
		  padding-top: 20px;
		}
		#wrapper #content_left > .c-container article {
		  padding-top: 15px;
		  border: unset !important;
		  box-shadow: unset !important;
		}
		body .wrapper_new #head.fix-head .s_form {
		  height: 70px;
		}
		.AC.sp-separator {
		  margin-top: -10px;
		  width: 650px;
		}
		#wrapper #content_right {
		  width: 0;
		  height: 0;
		  overflow: hidden;
		  opacity: 0;
		}
		body.showRight #wrapper #content_right {
		  width: 400px;
		  height: unset;
		  overflow: unset;
		  opacity: 1;
		}
		.result-molecule #page > div {
		  width: unset;
		}
		#wrapper #content_left > .c-container[tpl='recommend_list'] {
		  padding-top: 10px;
		  display: flex;
		  align-items: center;
		}
		#content_left .hit-toptip {
		  grid-column-start: 1;
		  grid-column-end: xmain-end;
		}
		@media screen and (max-width: 1280px) {
		  #u .toindex,
		  #u #imsg {
		    display: none;
		  }
		}
		.wrapper_new #s_tab.s_tab .s_tab_inner {
		  align-items: center;
		}
		.wrapper_new #s_tab.s_tab .s_tab_inner > *:after {
		  display: none;
		}
		@media screen and (min-width: 1921px) {
		  /*Baidu in 2K screen default in : center*/
		  #head .head_wrapper {
		    transform: translateX(-100px);
		    justify-content: center;
		    display: flex;
		  }
		  body .wrapper_new #s_tab.s_tab .s_tab_inner {
		    padding-left: 180px;
		    align-items: center;
		  }
		  body .wrapper_new #s_tab.s_tab .s_tab_inner > *:after {
		    display: none;
		  }
		  body #container.sam_newgrid {
		    padding-left: 316px;
		  }
		  form.fm .s_ipt_wr.bg {
		    min-width: 480px;
		  }
		  body.showRight #head .head_wrapper {
		    transform: translateX(120px);
		  }
		}
		
	`
	var dbpage=`
		/**Store BaiduTowPageStyle**/
		#wrapper_wrapper #container {
		  width: auto;
		  margin-left: unset;
		}
		form.fm {
		  position: relative;
		  background-color: unset;
		}
		#s_tab b,
		#s_tab a {
		  position: relative;
		}
		#wrapper #s_tab {
		  padding-left: 0;
		  margin-left: 0;
		  display: flex;
		  justify-content: center;
		}
		#wrapper .head_nums_cont_outer .search_tool_conter,
		#wrapper .head_nums_cont_outer .nums {
		  width: 80%;
		  margin-left: 10%;
		}
		#wrapper .head_nums_cont_outer,
		.hint_common_restop,
		#header_top_bar {
		  position: relative;
		  left: 10%;
		  width: 80%;
		}
		#wrapper #content_left,
		#container .result-molecule {
		  margin: 0 auto !important;
		  padding-left: unset !important;
		}
		#wrapper #header_top_bar {
		  margin-bottom: 0px;
		}
		body #container.sam_newgrid #content_left {
		  width: 80%;
		}
		#wrapper #content_left {
		  display: grid;
		  grid-template-columns: 50% 50%;
		  grid-template-areas: "xmain xmain";
		  margin: 0 auto;
		  position: relative;
		  padding-left: 5%;
		  float: unset;
		  width: 80%;
		  margin-left: 7%;
		  margin-bottom: 30px;
		}
		body[news] #wrapper #content_left > div:not([class]):not([id]) {
		  display: grid;
		  grid-template-columns: 50% 50%;
		  grid-template-areas: "xmain xmain";
		}
		#wrapper #content_right {
		  width: 0 !important;
		  height: 0 !important;
		  overflow: hidden !important;
		  opacity: 0;
		}
		#wrapper_wrapper #container #rs {
		  position: relative;
		  margin: 0 auto;
		}
		#wrapper #page {
		  min-width: 710px;
		  height: 40px;
		  line-height: 40px;
		  padding: 5px 10px;
		  margin: 0 auto;
		  text-align: center;
		  position: relative;
		}
		#wrapper #page .page-inner {
		  padding-left: 0;
		}
		#wrapper #content_left .result,
		#wrapper #content_left .result-op,
		#wrapper #content_left div[class*='vmp-project'],
		#wrapper #content_left > .c-container {
		  width: unset !important;
		  max-width: 100%;
		  margin-left: 0;
		  margin-right: 15px;
		}
		#wrapper #content_left > *:not([class*='result']):not([class*='c-group-wrapper']) {
		  grid-column-start: 1;
		  grid-column-end: xmain-end;
		}
		.c-container h3 a {
		  z-index: 1;
		}
		.AC.sp-separator {
		  width: auto;
		}
		/*search engine jump*/
		#sej-container {
		  padding-left: 0;
		  margin-left: 0;
		  text-align: center;
		}
		.s_form_wrapper {
		  justify-content: center;
		  display: flex;
		}
		.result-molecule.new-pmd {
		  margin: 0 auto;
		  min-width: 800px;
		  width: 40% !important;
		  padding-left: 20px;
		}
		.result-molecule.new-pmd #page > div {
		  width: unset;
		  padding-left: unset;
		}
		.result-molecule.new-pmd #rs_new {
		  background-color: white;
		  width: calc(100% - 20px);
		  padding: 10px 0 10px 20px;
		}
		.result-molecule.new-pmd #rs_new table {
		  width: 100%;
		  margin-top: 12px;
		}
		#wrapper .head_nums_cont_outer .search_tool_conter,
		#wrapper .head_nums_cont_outer .nums {
		  width: 80%;
		}
		@media screen and (max-width: 1500px) {
		  form.fm .s_ipt_wr.bg {
		    min-width: 450px;
		  }
		  .wrapper_new .head_wrapper #result_logo {
		    margin-left: -170px;
		  }
		}
		@media screen and (min-width: 1921px) {
		  #head .head_wrapper {
		    transform: unset;
		  }
		  #head .head_wrapper #u {
		    right: 30px;
		  }
		  #s_tab.s_tab .s_tab_inner {
		    width: 900px;
		  }
		  form.fm .s_ipt_wr.bg {
		    min-width: 900px;
		  }
		}
		
	`
	var fit=`
		/*****Baidu-AutoFit*****/
		body #wrapper .result-molecule.new-pmd[tpl="app/head-tab"] {
		  width: 100% !important;
		}
		body #wrapper .result-molecule.new-pmd[tpl="app/head-tab"] #s_tab {
		  background-color: transparent;
		  padding-top: 66px;
		}
		body #wrapper .result-molecule.new-pmd[tpl="app/head-tab"] #s_tab a:before {
		  color: inherit;
		}
		body #wrapper #content_left .result,
		body #wrapper #content_left .result-op {
		  background-color: rgba(255, 255, 255, 0.7);
		}
		body #wrapper #content_left .result h3,
		body #wrapper #content_left .result-op h3 {
		  background-color: rgba(248, 248, 248, 0.4);
		}
		body #wrapper #content_right {
		  padding: 20px 15px 15px !important;
		  border-radius: 5px;
		  background-color: #FFFFFF66;
		  box-sizing: border-box;
		  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
		  -webkit-box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
		  -moz-box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
		}
		body #wrapper .new-pmd #rs_new {
		  background-color: rgba(255, 255, 255, 0.7);
		}
		body #wrapper .result-molecule.new-pmd[tpl="app/page"] #page {
		  background-color: transparent;
		}
		body #wrapper .result-molecule.new-pmd[tpl="app/page"] #page a {
		  background-color: rgba(255, 255, 255, 0.7);
		}
		body #wrapper .result-molecule.new-pmd #foot {
		  background-color: rgba(255, 255, 255, 0.7);
		}
		/*****COMMON*****/
		.sp-separator.AC {
		  background-color: rgba(255, 255, 255, 0.9) !important;
		}
		.button.ghhider {
		  background-color: rgba(255, 255, 255, 0.7);
		}
		
	`
	var other=`
		#content_left>div:not([class]) {
			display: none;
		}
		
		#content_left>[tpl=translation] .op_translation_canvas textarea {
			width: calc(100% - 18px) !important;
			background-position-x: 400px;
		}
		
		#content_left>div[tpl*=bjh] {
			display: none;
		}
		
		#content_left [class^=single-card],
		#content_left [class^=re-box] {
			box-shadow: none;
		}
		
		#content_left [class^=image-normal-card] {
			overflow: hidden;
		}
		
		#content_left .new-pmd .c-span12 {
			width: 100%;
		}
		
		#content_left [class^=gameinfo] [class^=listcontent],
		#content_left [class^=table-container] {
			width: 100%;
			overflow: auto;
		}
		
		#content_left [class^=gameinfo] [class^=listcontent]::-webkit-scrollbar,
		#content_left [class^=table-container]::-webkit-scrollbar {
			display: none;
		}
		
		#foot {
			visibility: hidden;
		}
		
		#container>.result-molecule[tpl="app/rs"] {
			display: none;
		}
		
		#container>.result-molecule[tpl="app/rs"]>#rs_new {
			margin: 0;
			background: transparent;
		}
		
		#container>.result-molecule[tpl="app/rs"]>#rs_new>div {
			margin: 0;
		}
		
		#container>.result-molecule[tpl="app/rs"]>#rs_new>table {
			display: none;
		}
		
		#container>.result-molecule[tpl="app/rs"]>#rs_new>table a {
			text-align: center;
		}
		
		#container .current-page-notice {
			text-align: center;
			width: calc(100% - 17px) !important;
			height: 30px;
			line-height: 30px;
			margin: 15px 15px 15px 0;
			padding: 8px 0;
			background-color: rgba(255, 255, 255, 0.7);
			border: 1px solid rgba(0, 0, 0, 0.1);
			border-radius: 24px;
		}
		
		#container .current-page-notice span {
			font-weight: bold;
		}
		
		.auto-loading-notice[data-pos] span {
			background-image: -webkit-linear-gradient(right, #0000007f, #0000005f 25%, #0000007f 50%, #0000005f 75%, #0000007f 100%);
			-webkit-text-fill-color: transparent;
			-webkit-background-clip: text;
			-webkit-background-size: 200% 100%;
			-webkit-animation: streamer-text-animation 1s linear infinite;
			text-align: center;
		}
		
		.auto-loading-notice[data-pos=bottom] {
			text-align: center;
			margin: 0 155px 30px 140px;
		}
		
		@keyframes streamer-text-animation {
			0% {
				background-position: 0 0;
			}
		
			100% {
				background-position: -100% 0;
			}
		}
		
		.auto-loading-notice[data-pos=center] {
			width: 200px;
			height: 50px;
			position: fixed;
			left: 50%;
			top: 40%;
			transform: translateX(-50%);
			color: white;
			line-height: 50px;
			backdrop-filter: blur(10px);
			background-color: rgba(34, 34, 34, .3);
			border-radius: 15px;
			text-align: center;
		}
		
		.current-page-notice:hover {
			border: 1px solid rgba(0, 0, 0, 0.3);
			box-shadow: 0 0 1px grey;
		}
		
		.current-page-notice span[data-name] {
			cursor: pointer;
		}
		
		.current-page-notice a[data-name] {
			color: #9195a3;
		}
		
		.current-page-notice a[data-name]:hover {
			color: #315efb;
		}
		#searchTag {
			display: none;
		}
	`
	var map={
		"version":version,
		"common":common,
		"dbpage":dbpage,
		"fit":fit,
		"other":other,
		toCssString(){
			var css=""
			for(let i in this){
				if(typeof this[i]==="string"){
					css+=this[i];
				}
			}
			return css
		}
	}
	return k?map[k]:map
}