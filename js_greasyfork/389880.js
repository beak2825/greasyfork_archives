// ==UserScript==
// @name         linux.vbird.org 鸟哥的 Linux 私房菜 美化 自动转换简体中文
// @namespace    https://greasyfork.org/zh-CN/scripts/389880-linux-vbird-org
// @version      0.4.0
// @description  linux.vbird.org 鸟哥的 Linux 私房菜网站 美化：修改字体，增大页面宽度，修改颜色；调用 OpenCC 自动转换成简体中文。转换需要几秒钟，页面可能会没有响应。
// @author       Phuker
// @match        *://linux.vbird.org/*
// @connect      opencc.byvoid.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/389880/linuxvbirdorg%20%E9%B8%9F%E5%93%A5%E7%9A%84%20Linux%20%E7%A7%81%E6%88%BF%E8%8F%9C%20%E7%BE%8E%E5%8C%96%20%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/389880/linuxvbirdorg%20%E9%B8%9F%E5%93%A5%E7%9A%84%20Linux%20%E7%A7%81%E6%88%BF%E8%8F%9C%20%E7%BE%8E%E5%8C%96%20%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // - - - - - - - - - - Start User Config - - - - - - - - - -
    var option_apply_css = true;  // 自动美化外观样式
    var option_auto_convert_chinese = true;  // 自动把繁体中文转换为简体中文
    var option_convert_chinese_on_dbclick = true;  // 双击网页时把繁体中文转换为简体中文

    // Advanced
    var opencc_program = 'wasm'; // Valid: 'wasm' 'api'
    var opencc_wasm_base_url = 'https://oyyd.github.io/wasm-opencc/';
    var opencc_api_url = 'https://opencc.byvoid.com/convert';
    // - - - - - - - - - - End User config - - - - - - - - - -

    function remove_original_css_2013(){
        var count = 0;
        var links = document.getElementsByTagName('link');
        for(var i = 0; i < links.length; i++){
            var link = links[i];
            if(link.getAttribute('href') == "/include/style_2013.css"){
                link.remove();
                count++;
            }
        }
        return count;
    }

    function remove_iframes(){
        var iframes = document.getElementsByTagName('iframe');
        for(var i = 0; i < iframes.length; i++){
            var iframe = iframes[i];
            if(iframe.getAttribute('src') == "/online/index_2013.php"){
                iframe.remove();
            }
        }
    }

    function add_opencc_base_tag(url){
        var base = document.createElement('base');
        base.href = url;
        document.body.appendChild(base);
    }

    function remove_base_tags(){
        var tags = document.getElementsByTagName('base');
        for(var i = 0; i < tags.length; i++){
            tags[i].remove();
        }
    }

    function freeze_page(){
        document.body.style['pointerEvents'] = 'none';
    }

    function de_freeze_page(){
        document.body.style['pointerEvents'] = '';
    }

    function get_title_logger(title){
        return (function (txt){
            if(txt){
                console.log('Set title: ' + txt);
                document.title = txt + ' - ' + title;
            } else {
                console.log('Reset title');
                document.title = title;
            }
        })
    }
    
    if(document.location.href.startsWith('http://')){  // Old version website
        console.log('Old version website detected');
        document.phuker_old_version_website = true;
    } else {
        console.log('New version website detected');
        document.phuker_old_version_website = false;
    }

    if(document.phuker_old_version_website){
        remove_iframes();  // iframe make bugs when convert Chinese
    }

    if(option_apply_css){
        if(document.phuker_old_version_website){
            if(remove_original_css_2013()){
                GM_addStyle(`
/* 全部的風格一致設定值 ################################################################## */
body {
	font-family: 'Consolas', 'Monaco', 'Microsoft Yahei','PingFang SC', Monospace !important;
	font-size: 12pt;
	/*padding: 32px 0 27px 0 ;*/
	margin: 0;
	background-color: #eeeeee;
	color: #000000;
	background-attachment:fixed ;
	line-height: 1.6;
}

#book1, #book2, #book3, #book4, #book5 {
	display: none;

}
/* top iframe*/
iframe{
	display: none;
}

pre, legend, blockquote, span {
	font-family: 'Consolas', 'Monaco', 'Microsoft Yahei','PingFang SC', Monospace !important;
}

a:link		{text-decoration: none; color: blue}
a:visited	{text-decoration: none; color: blue}
a:active	{text-decoration: none; color: blue}
a:hover		{text-decoration: underline; color: #ff0000}


/* 最上面那個不會動的方塊設定值 ############################################################ */
.toparea {
	width: 100%;
	overflow: auto;
/*	min-width: 1000px;*/
	min-height: 36px;
	box-shadow: 2px 2px 2px 2px gray;
	/*position: absolute;*/
	top: 0;
	left: 0;
	/* background-color: #1E90FF;*/
	/*background-color: rgb(85,123,205);*/
	/*background-color: rgba(85,123,205,0.5);*/
	background-color: #003366;
	color: white;

	font-size: 16pt;
	font-weight: bold;
	text-align: center;
	line-height: 1.4;
	z-index: 10;
}
.toparea span{
	/*text-shadow: 1px 1px 1px black !important;*/
	font-weight: 100;
}
.toparea ul {
	position: relative;
	padding: 0;
	margin:  5px 0 0 10px;
	display: inline-block;
}
.toparea li {
	display: inline-block;
	font-size: 9pt;
	font-weight: normal;

	border-top: 1px solid #191970;
	border-left: 1px solid #191970;
	border-right: 1px solid #191970;
	border-radius: 6px 6px 0 0;
	box-shadow: 2px 2px 2px 1px gray;
	padding: 5px 5px 0 5px;
	margin: -2px;
	background-color: #99ccff;
}
.toparea a {
	color: #000000;
}
.toparea li:hover {
	transition: background-color 1s;
	border-top: 1px solid black;
	border-left: 1px solid black;
	border-right: 1px solid black;
	box-shadow: 2px 2px 2px 1px #191970;
	background-color: white;
	color: black;
	padding-top: 10px;
}
.toparea a:hover {
	color: darkblue;
}
li.topareali {
	border-top: 1px solid black;
	border-left: 1px solid black;
	border-right: 1px solid black;
	box-shadow: none;
	background-color: white;
	padding-top: 10px;
	padding-bottom: 4px;
	color: black;
}
.topareali a {
	color: darkblue;
	font-weight: bold;
}

/* 左邊的往前一頁功能 ############################################################ */
.leftarea {
	width: 40px;
	height: 30px;
	position: fixed;
	top: 50%;
	left: 0;
	bottom: 50%;
	background-color: rgba(85,123,205,0.2);
	color: white;

	font-size: 16pt;
	/*text-shadow: 1px 2px 1px gray;*/
	font-weight: bold;
	text-align: center;
	border-radius: 0 10px  0 0 ;
	z-index: 10;
}

.leftarea a {
	color: white;
	text-decoration: none;
	display: block;
}

.leftarea a:hover {
	color: blue;
	text-shadow: 2px 2px 2px black;
	background-color: #eeeeee ;
}

/* 右邊的往後一頁功能 ############################################################ */
.rightarea {
	width: 40px;
	height: 30px;
	position: fixed;
	top: 50%;
	right: 0;
	bottom: 50%;
	background-color: rgba(85,123,205,0.2);
	color: white;

	font-size: 16pt;
	text-shadow: 2px 2px 2px gray;
	font-weight: bold;
	text-align: center;
	z-index: 10;
	border-radius: 10px 0 0 0 ;
}

.rightarea a {
	color: white;
	text-decoration: none;
	display: block;
}

.rightarea a:hover {
	color: blue;
	text-shadow: 2px 2px 2px black;
	background-color: #eeeeee ;
}


/* 最底下那個不會動的版權宣告頁面 ######################################################################## */
.bottomarea {
	width: 100%;
/*	min-width: 1000px;*/
	min-height: 30px;
	box-shadow: 0px 0px 2px 2px gray;
	/*position: fixed;*/
	overflow: auto;
	bottom: 0;
	left: 0;
	/* background-color: #1E90FF; */
	background-color: rgb(85,123,205);
	color: #AFEEEE;
	font-size: 10pt;
	font-weight: normal;
	text-align: center;
	z-index: 10;
}
.bottomarea ul {
	position: relative;
	padding: 0;
	margin:  0;
	display: inline-block;
}
.bottomarea li {
	display: inline-block;
	font-size: 9pt;
	font-weight: normal;

	border-left: 1px solid #191970;
	border-right: 1px solid #191970;
	border-bottom: 1px solid #191970;
	border-radius: 0 0 6px 6px;
	box-shadow: 0px 0px 2px 2px gray;
	padding: 0px 5px 0px 5px;
	margin: -2px;
	background-color: #87CECB;
}
.bottomarea a {
	color: #AFEEEE ;
}
.bottomarea li a {
	color: #696969;
}
.bottomarea li:hover {
	transition: background-color 1s;
	border-left: 1px solid black;
	border-right: 1px solid black;
	border-bottom: 1px solid black;
	box-shadow: 0px 0px 2px 1px #191970;
	background-color: white;
	color: black;
	padding-bottom: 5px;
}
.bottomarea a:hover {
	color: darkblue;
}


/* 作為兩個板塊置中排版 的必要資料而以～ ######################################################## */
.tablearea {
	width: 95%;
	min-height: 650px;
	padding: 0;
	margin: 0 auto 0 6px;
}


/* 左側的那個超連結部分的資料！先針對主選單來設計 ############################################### */
.nav {
	width: 142px;
	/*height: 540px;*/
	float: left; 
	border: 1px solid gray;
	position: absolute;
	margin: 10px 0px 10px 0px; 
	background-color: #ffffff;
	box-shadow:  0px 0px 1px 1px gray;
	border-radius: 5px ;
	z-index:1; 
}
/*人数统计*/
.nav p {
	display: none;
}
.nav div{
	display: none;
}
.nav ul {
	position: relative;
	padding: 0;
	margin-left:  5px;
	display: block;
}
.nav li {
	display: block;
	font-size: 10pt;
	font-weight: lighter;
	
	width: 115px;
	border-left: 10px solid #ccc; 
	border-right: 1px solid #fff;
	border-bottom: 1px solid #fff;
	border-top: 1px solid #fff;
	border-radius: 0 5px 0 0;
	padding: 3px 0px 0px 5px;
	margin: 0px;
	background-color: #336699;
}
.nav li a {
	color: white;
	display: block;
}
.nav li:hover {
	transition: background-color 1s;
	border-left: 10px solid #ccc; 
	border-right: 1px solid #fff;
	border-bottom: 1px solid #fff;
	border-top: 1px solid #fff;
	background-color: #003366;
}
.nav li a:hover {
	color: white;
	text-shadow: 1px 1px 0px black;
}

/* 開始設計子選單囉！ */
.nav ul li ul {
	visibility: hidden;
	min-width: 250px;
	width: auto;
	height: auto;
	position: absolute;
	float: left; 
	border: 1px solid gray;
	margin: -20px 0px 0px 100px; 
	background-color: #f3f3f3;
	box-shadow:  5px 5px 3px 3px gray;
	padding: 10px 0 10px 10px;
	border-radius: 7px ;
	z-index:1; 
	overflow: auto;
	opacity: 0.95;
}
.nav ul li ul li {
	overflow: hidden;
	width: 220px;
	height: 0;
	transition: height 0.2s ease-in, visibility 0.2s;
}
.nav ul li:hover ul li {
	height: 20px;
}
.nav ul li:hover ul {
	visibility: visible;
}
.nav ul ul li:hover {
	display: block;
	border-left: 10px solid #4b0082; 
	background-color: gray;
}
li.nav_more {
	background-color: #003366;
	border-color: #fff;
	border-left-color: #ccc;
}


/* 開始設計主要的教學頁面部分。這就是主要出現的咚咚！ ####################################3  */
.mainarea {
	width: 75%;
	margin: 0 auto;
    padding: 0 0 0 160px;
	text-align: left;
	line-height: 1.6; 
	position: relative;
/*	float: right;*/
	color: #252525;
}

.block1	{
	padding: 0 20px 10px 40px; 
	/* text-align: justify; */
	text-align: left; 
	background-color: white;
	border: 1px solid gray;
	border-radius: 5px;
	box-shadow: 1px 1px 1px gray;
	margin-top: 10px;
	position: relative;
}

.block1 h1 {
	font-size:18pt;
	font-weight: lighter;
	text-align: center;
	color: white;
	background-color: #003366;
	margin: 5px -10px 2px -35px;
	padding: 5px;
	border: 1px solid gray;
	box-shadow:  1px 1px 1px 0px gray;

	border-radius: 8px 8px 0 0 ;
}
.block1 h2 {
	font-size:16pt;

	text-align: left;
	color: #333333 ;
	background-color: #99CCFF;
	margin: 5px 0px 15px -30px;
	padding: 5px 5px 0px 10px;
	border: 1px solid gray;
	box-shadow:  2px 2px 2px 0px gray;

	border-radius: 0px 10px 0 0 ;
}
.abstract {
	background-color: #ffffcc; 
	border: 1px solid #ffffcc;
	padding: 10px 10px 0 10px;
	font-size: 10pt;
	color: #000099; 
	text-align: justify;
	border-radius: 5px;
	box-shadow:  0 0 1px 1px gray;
	margin-left: -20px;
}
.abstract p {
	margin-top: 0px;
}

.links {
	color: #0000BB;
	margin-left: -50px;
}
.links ul {
	list-style-type: none;
	font-size: 15pt; 
	color: #0000BB; 
	font-weight: normal;
}
.links ul ul {
	font-size: 13pt; 
	display: block;
}
.links a:visited {
	color: #666666;
}
.block2	{
	padding: 0px 5px 5px 20px; 
	/* text-align: justify; */
	text-align: left; 

	border-right: 1px solid gray;
	border-bottom: 1px solid gray;
	position: relative;
}
.block2 h2 {
	font-size:14pt;

	text-align: left;
	color: #333333 ;
	background-color: #99CCFF;
	margin: -1px 0px 10px -21px;
	padding: 5px 5px 0px 10px;
	border: 1px solid gray;
	box-shadow:  0px 1px 1px 0px gray;

	border-radius: 0px 0px 0 0 ;
}
.gototop {
	display: block;
	width: 30px;
	background-color: #E6E6FA;
	font-weight: bold;
	position: absolute;
	left: 0px;
	bottom: 0px;
	padding: 2px;
	border: 1px solid gray;
	margin: 2px;
	z-index: 0;
}
.gototop a {
	display: block;
}

ul.toplist {
	margin-left:0; 
	padding-left:0; 
	color:#000088; 
	font-weight: bold; 
	list-style-type: square; 
	border-top: 1px solid gray; 
	margin-top: 30px;
}

table.exam {
	width: 95%; 
	border: 1px solid black; 
	border-collapse: collapse; 
	padding: 5px;
}
table.exam td {
	padding: 5px;
}

table.exam td div {
	margin: 10px 0 10px 25px; 
	width: 95%;
}

table.news {
	width: 97%;
	border: 1px solid gray;
	background-color: #FFFFCC;
	box-shadow: 2px 2px 2px 2px gray;
	padding: 0px;
	margin: 0;
	border-collapse:collapse;
	font-family: 'Consolas', 'Monaco', 'Microsoft Yahei','PingFang SC', Monospace !important;
}
table.news tr {
	margin: 0;
	padding: 0;
	border-width: 0;
}
table.news tr.title1 {
	background-color: lightblue;
	text-align:center;
	border-width: 0;
}
table.news td {
	margin: 5px;
	padding: 5px;
	border: 1px solid gray;
}
table.news tr:hover {
	/* text-shadow: 1px 1px 1px black;*/
	background-color: lightblue;
	color: black;
}

table.news .theader {
	background-color: lightblue;
	text-align: center;
}

table.news .tcenter {
	text-align: center;
}

.text_import1	{
	color: #000088; 
	font-weight: bold;
	font-family: 'Consolas', 'Monaco', 'Microsoft Yahei','PingFang SC', Monospace !important;
}
.text_import2	{
	color: #000088; 
	font-weight: normal;
	font-family: 'Consolas', 'Monaco', 'Microsoft Yahei','PingFang SC', Monospace !important;
}
.text_vbird	{
	color: #000088; 
	font-weight: normal;
	font-style: italic;
}
.text_history	{
	font-size:  10pt; 
	color: #000066; 
}
.text_date	{
	font-size:  10pt; 
	color: #3333FF; 
}
table.term	{
	width: 650px; 
	background-color: #000000;
	border-style: ridge;
	border-width:3px;
	border-color: #FFCCCC; 
	margin:10px 0px;
}
table.term td	{
	font-size: 10pt; 
	color: #FFFFFF; 
}
table.term td pre	{
	font-size: 10pt; 
	color: #FFFFFF; 
	margin-top: 2px; margin-bottom: 2px;
}
.term_hd	{
	font-size: 10pt; 
	color: #BBBBBB; 
}
.term_note	{
	font-size:  10pt; 
	color: #777777; 
	font-weight: normal;
}
.term_note_b	{
	font-size:  10pt; 
	color: #FF77FF; 
	font-weight: bolder;
}
.term_command	{
	font-size: 10pt; 
	color: yellow ; 
	font-weight: bolder;
}
.term_write	{
	font-size:  10pt; 
	color: yellow ; 
	font-weight: normal;
 }
.term_say	{
	font-size: 10pt; 
	color: #FF6666; 
	font-weight: normal;
}
.term_white	{
	font-size: 10pt; 
	color: #000000; 
	background-color: #FFFFFF;
}

.vbirdface {
	text-align: left;
	position: relative;
	width: 80%;
	margin-left: 12%;
	font-size: 10pt;
	color: #009000;
	border-right: none;
	border-bottom: none;
}

.illus {
	padding-left: 25px;
}
.illus > ul {
	list-style-type: circle;
	margin-left: 9px;
	margin-bottom: 0px;
	padding: 0;
}
.illus > ul > li {
	color: #000088; 
	font-weight: normal;
}
.illus ol {
	margin-left: 9px;
	margin-bottom: 0px;
	padding: 0;
}
.illus p {
	margin: 10px;
}

ul.mylist li, ol.mylist li {
	margin-top: 10px; 
}
/*
		3. CSS 語法的 Style 風格：
			text_import1	內文部分的特重要文字！
			text_import2	內文部分的普通重要文字！
			text_vbird	鳥哥的額外說明部分文字
			text_history	網頁中，變動的歷史紀錄的日期文字
			text_date	
			block1		大標題下的文字敘述之縮排
			block2		小標題下的文字敘述之縮排
			vbirdface1	鳥哥的說明最上方的一些標示
			vbirdface2	說明的下方標籤在 vbirdface1, 2 之間，插入我所想要講的話！
*/
table.term2		{width: 350px; background-color: #000000;
			 border-style:groove;border-width:3px;border-color: #FFCCCC; margin:10px 0px;}
*.list1		{list-style-type: square ; padding-left:0; margin-bottom:0 }
*.listol	{                          padding-left:0; margin-bottom:0 }
*.blockex	{
	padding: 10px 0px  10px 25px ; 
	font-size: 9pt; 
	color: #FFFFFF ; 
	text-align: left ;
	font-family: 'Consolas', 'Monaco', 'Microsoft Yahei','PingFang SC', Monospace !important;
}
.blockex span {
	font-family: 'Consolas', 'Monaco', 'Microsoft Yahei','PingFang SC', Monospace !important;
}
*.fontwidth	{ }
*.fontwidth td 	{ text-align: justify; }

.ex {
	width: 95%;
	border: 1px solid black;
	box-shadow: 0 0 2px 2px silver;
	padding: 10px; 
	font-family: 'Consolas', 'Monaco', 'Microsoft Yahei','PingFang SC', Monospace !important;
	line-height: 120%;
	background-color: rgba(200,200,200,0.7);
}

.ex .list li {
	margin-top: 10px;
}

@media (max-width: 850px){
	.toparea span{
		display: none !important;
	}
	.nav {
		display: none !important;
	}
	.mainarea{
		width: 100% !important;
		margin: 0 !important;
		padding: 0 !important;
	}
}

                `);
            }
        } else {
            GM_addStyle(`
* {
    font-family: 'Consolas', 'Monaco', 'Microsoft Yahei','PingFang SC', Monospace !important;
}

            `);
        }
    }
    
    // 使用 wasm-opencc 在浏览器中转换，地域用词可能不太准确
    // https://github.com/oyyd/wasm-opencc
    // https://oyyd.github.io/wasm-opencc/
    function convert_chinese_wasm (){
        var original_title = document.title;
        var title_log = get_title_logger(original_title);

        if(document.phuker_convert_chinese_started){
            console.log('Convert already started');
            return;
        } else {
            console.log('Start convert');
            document.phuker_convert_chinese_started = true;
        }
        
        freeze_page();  // Limit <base> tag
        add_opencc_base_tag(opencc_wasm_base_url);

        title_log('正在加载 OpenCC');
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = './opencc-asm.js';
        script.onload = function(){
            try{
                const { DictSource, Converter } = OpenCCWasm_
                OpenCCWasm_.ready().then(() => {
                    const dictSource = new DictSource('tw2sp.json');
                    return dictSource.get();
                }).then((args) => {
                    title_log('已加载 OpenCC');
                    const converter = new Converter(...args);
                    var body_html = document.body.innerHTML;
    
                    title_log('正在转换为简体中文');
                    body_html = converter.convert(body_html);
                    title_log('转换完毕');
                    
                    document.body.innerHTML = body_html;
                    remove_base_tags();
                    de_freeze_page();

                    title_log = get_title_logger(converter.convert(original_title));
                    title_log('');
                    converter.delete();
                })
            } catch (e) {
                title_log('OpenCC 错误');
                remove_base_tags();
                de_freeze_page();
            }
        }
        script.onerror = function(){
            title_log('加载 OpenCC 失败');
            remove_base_tags();
            de_freeze_page();
        }
        window.addEventListener('error', function(e){
            title_log('脚本错误');
            console.log(e);
            remove_base_tags();
            de_freeze_page();
        })
        document.body.appendChild(script);
    }

    // 通过 BYVoid 大神的在线工具转换，地域用词更准确
    // https://opencc.byvoid.com/
    function convert_chinese_api(){
        var original_title = document.title;
        var title_log = get_title_logger(original_title);

        if(document.phuker_convert_chinese_started){
            console.log('Convert already started');
            return;
        } else {
            console.log('Start convert');
            document.phuker_convert_chinese_started = true;
        }

        function call_api(text, onload, onerror){
            GM_xmlhttpRequest({
                method: 'POST',
                url: opencc_api_url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'text=' + encodeURIComponent(text) + '&config=tw2sp.json&precise=0',
                onload: onload,
                onerror: onerror,
                ontimeout: onerror
            });
        }

        title_log('正在转换为简体中文');
        call_api(document.body.innerHTML, function(resp){
            var result = resp.responseText;
            title_log('转换完毕');
            document.body.innerHTML = result;
            title_log('');
        }, function(){
            title_log('转换失败')
        });
    }

    var convert_chinese = convert_chinese_wasm;  // default
    if(opencc_program == 'api'){
        convert_chinese = convert_chinese_api;
    }

    if(option_auto_convert_chinese){
        window.addEventListener('load', convert_chinese);
    }
    if(option_convert_chinese_on_dbclick){
        window.addEventListener('load', function(){
            document.addEventListener('dblclick', convert_chinese);
        })
    }
})();
