// ==UserScript==
// @name        Aragorn - Haterovo Retro
// @namespace   net.amunak.aragorn
// @match       https://www.aragorn.cz/*
// @exclude     https://www.aragorn.cz/rs/*
// @supportURL  https://www.aragorn.cz/diskuze/amunak-s-discuss-nest/
// @run-at      document-end
// @grant       none
// @version     1.1
// @author      Amunak
// @description Forces Aragorn to use the "Haterovo Retro" stylesheet
// @downloadURL https://update.greasyfork.org/scripts/401748/Aragorn%20-%20Haterovo%20Retro.user.js
// @updateURL https://update.greasyfork.org/scripts/401748/Aragorn%20-%20Haterovo%20Retro.meta.js
// ==/UserScript==

const stylesheet = `
.retro .menu a:hover{color:#000000;background-color:#ff8c00;}
.retro p{text-align:justify;}
.retro .uvodnik p:first-letter{font-size:120%;font-weight:bold;}
body.retro,.retro .profile-span,.retro #dhtmltooltip{background-color:#000000;color:#f4a460;}
.retro #chrome ul,.retro label,.retro .dropmenudiv,.retro .menu li{background-color:#000000;}
.retro .unr,.retro #unp{color:#ffd700;}
.retro .f input:focus,.retro .f textarea:focus,.retro .f label:focus,.retro .f option:focus,.retro .f select:focus{background-color:#060606;color:#f4a460;}
.retro a{color:#ff8c00;text-decoration:none;padding:2px;}
.retro a:hover,.retro .h2-head a:hover{color:#000000;background-color:#ff8c00;}
.retro h1 a{display:block;position:absolute;top:1em;width:99%;height:3em;}
.retro .dropmenudiv{border:1px solid;}
.retro .info,.retro fieldset,.retro #dhtmltooltip{border:1px dashed;}
.retro .cl,.retro table.commtb,.retro .highlight-mid,.retro .galerie-vypis div,.retro .text{background-color:#060606;}
.retro .c-u,.retro .c-ub{color:#ffd700;}
.retro input,.retro textarea,.retro select{background-color:#000000;color:#f4a460;border:1px solid;}
.retro #button,.retro .button,.retro #profile-button{color:#ff8c00;border:1px solid #f4a460;}
.retro #button:hover,.retro .button:hover,.retro #profile-button:hover{color:#000000;background-color:#ff8c00;}
.retro #profile-button,.retro #button,.retro .button{cursor:pointer;}
.retro h2{padding:10px;padding-right:50px;text-align:center;}
.retro .h2-head a{background-color:#000000;padding:10px;border:1px solid;}
.retro h3 a{display:none;}
body.retro *{margin:0;padding:0;line-height:1.3;}
.retro acronym{cursor:help;font-variant:normal;text-transform:none;}
.retro .helper{cursor:help}
.retro .holder,body.retro{min-width:50em;}
.retro .top{height:10em;}
.retro h1 span{visibility:hidden;}
.retro .menu{position:fixed; left:0; min-width:7em;width:18%; height:100%;}
.retro .menu ul{width:100%;margin-top:10px;padding:0;padding-top:30px;list-style-type:none}
.retro .menu li{padding:0px 5px 0px 5px;list-style-type:none;text-align:left;width:100%;}
.retro .menu li a{padding:2px;height:1.5em;display:block;font-size:80%;font-weight:bold;background-position:98% 50%;background-repeat:no-repeat;}
.retro #marked{text-decoration:underline;}
.retro .content{margin-left:20%;margin-right:2%;}
.retro .topframe{height:0px;display:block;}
.retro .bottomframe{display:none;}
.retro h2{font-size:110%;letter-spacing:2px;padding-left:8px;}
.retro h3{font-size:100%;letter-spacing:2px;padding-left:8px;text-align:center;position:relative;bottom:12px}
.retro .h3-middle{margin-top:20px;}
.retro h4{margin:5px;font-size:90%;}
.retro .text{padding:5px;margin:0;overflow:hidden;line-height:160%;font-size:90%;}
.retro .art{margin:10px auto;}
.retro .art p{padding:5px;margin:10px;overflow:hidden;line-height:160%;font-size:90%;}
.retro .art-bord{margin:10px;padding:10px;}
.retro .warning{font-weight:normal;}
.retro .permalink{font-weight:bold;}
.retro .permalinkb{padding-right:15px;margin-right:15px;}
.retro .permalink2{background-color:#000000;}
.retro .permalinkb2{padding-right:15px;}
.retro .submenu{margin:0;padding:10px 0 10px 0;font-size:90%;}
.retro .submenu a{margin-left:15px;}
.retro .seznam{font-size:80%;}
.retro .seznam li{margin-left:30px}
.retro .info{width:50%;height:5em;margin:10px;padding:7px;font-size:80%;line-height:160%;}
.retro .info span{width:50px;height:50px;display:block;padding:0 10px 0 2px;background-repeat:no-repeat;float:left}
.retro .strankovani{font-size:70%;position:relative;padding:5px;}
.retro .strankovani a{padding:2px;font-weight:bold;}
.retro .strankovani a:hover{}
.retro .strankovaniMarked{text-decoration:underline;}
.retro .tb{width:100%;margin:5px 5px 5px 5px;}
.retro .tb td{width:33%;height:100px;font-size:80%;text-align:center;vertical-align:middle}
.retro .tb td img{border-width:0}
.retro .tb td a{font-weight:bold;;}
.retro .tb td a:hover{}
.retro .online{width:54px;height:33px;display:block;margin-left:30px;}
.retro .offline{width:59px;height:28px;display:block;margin-left:30px;}
.retro .commtb{width:100%;margin-bottom:20px;font-size:80%;border-width:0}
.retro .c1{height:31px;padding-left:15px;vertical-align:middle;position:relative;}
.retro .c1 span{font-weight:bold}
.retro .c1 input{position:absolute;right:5px}
.retro .c1 .ar{position:absolute;right:30px;background:url('/system/ruzne/arrow.gif') center center no-repeat;width:13px;height:13px;}
.retro .c1 img{margin-left:7px;border-width:0}
.retro .c2{width:60px;vertical-align:top;padding:2px 0 0 15px;}
.retro .c2 img{border-width:0}
.retro .c2 span{position:relative;top:6px;font-size:80%;}
.retro .c3{padding:5px;vertical-align:top}
.retro .signature{font-size:11px;position:relative;top:10px;text-indent:45px;display:block;overflow:hidden;right:0;}
.retro .c4{padding:5px 5px 15px 5px;margin:0;overflow:hidden;line-height:160%;font-size:110%;}
.retro .c4 a{}
.retro .c-u,.retro #unp,.retro #rp{font-weight:bold;}
.retro .galerie-vypis div{width:200px;height:300px;float:left;overflow:hidden}
.retro .galerie-vypis p{margin-bottom:5px;padding:0;}
.retro .galerie-vypis img{border-width:0;padding-bottom:5px}
.retro .galerie-vypis a{font-size:100%;line-height:180%;}
.retro .galerie-img img{border-width:0;padding-top:10px;padding-bottom:5px}
.retro .galerie-img ul{list-style-type:none;}
.retro .galerie-img li{font-weight:bold;font-size:80%;line-height:180%}
.retro .ge,.retro #ge{display:block;font-size:90%}
.retro .ge2,.retro #ge2{font-size:110%}
.retro .highlight-bot,.retro .highlight-mid,.retro .highlight-top{margin-left:0px;padding:5px;}
.retro .highlight-top{display:block;height:8px;font-size:1px;display:block;}
.retro .highlight-mid{display:block;padding:5px;}
.retro .highlight-bot{height:24px;font-size:1px;margin-bottom:10px;display:none;}
.retro .clanky td{padding:2px}
.retro .c-nazev{font-size:110%;}
.retro .c-sub{padding-right:10px;font-size:90%;}
.retro .c-sub a{}
.retro .cl{margin:10px;padding:5px;font-size:90%;line-height:200%;;}
.retro .ci{margin:15px;padding:5px;font-size:90%;line-height:180%;;}
.retro .f{font-size:70%;}
.retro .f img{margin:0 5px 0 5px;}
.retro .f label{margin:5px 5px 10px 5px;font-weight:bold;display:block;}
.retro .f input,.retro .f textarea,.retro .f select{margin-bottom:5px;}
.retro .f input,.retro f.select{width:50%;}
.retro .f option{text-indent:5px;}
.retro .f textarea{margin:0;width:80%;}
.retro .f fieldset input,.retro .f fieldset select{margin:0;}
.retro .f fieldset select{}
.retro .f>fieldset>select{}
.retro .f label span{display:block;padding-top:5px;padding-bottom:5px;}
.retro .f fieldset{position:relative;padding:10px 10px 10px 20px;}
.retro .f-top,.retro .f-middle,.retro .f-bottom{margin-left:0px;}
.retro .f-top{height:8px;font-size:1px;display:block;}
.retro .f-bottom{font-size:1px;display:block;margin-bottom:5px;}
.retro .f legend{padding-bottom:5px;font-size:120%;font-weight:bold;}
.retro .f #button,.retro .f .button{margin-left:6px}
.retro #km{}
.retro .footer{padding:15px;clear:both;display:block}
.retro .footer2{text-align:center;font-size:70%;font-weight:bold;}
.retro #chromeout{position:absolute;display:block;top:0px;z-index:150;font-weight:bold;font-size:11px;font-family:Verdana,sans-serif;margin:0}
.retro #chrome{display:block;margin:0 auto;}
.retro #chrome:after{display:block; height:0; clear:both; visibility:hidden;margin:0;}
.retro #chrome ul{width:auto;padding:0;float:left;font:bold 11px Verdana;}
.retro #chrome ul li{display:inline;margin-left:auto;padding:0;width:auto;list-style-type:none;}
.retro #chrome ul li a{float:left;padding:2px 2px 3px 4px;;overflow:hidden;}
.retro #unp,.retro #rp{font-weight:bold;}
.retro .dropmenudiv{position:absolute;font:normal 10px Verdana;line-height:14px;z-index:200;width:100px;visibility:hidden}
.retro .dropmenudiv a ,.retro .dropmenu a:visited ,.retro .dropmenu a:active{display:block;width:100%;text-indent:3px;padding:2px 0;;font-weight:bold;}
.retro .dropmenudiv a:hover{}
.retro .hide{display:none;visibility:hidden;}
.retro .profile{padding:0;margin:0;position:relative;right:5px;width:50%;font-weight:bold;text-align:right;float:right}
.retro .profile img{position:relative;top:1px;border-width:0}
.retro .profile-form{position:relative;padding:0 10px 2px 10px;font-weight:bold;overflow:hidden;float:right;white-space:nowrap;}
.retro .profile-span{display:block;text-align:center;padding:1px 10px 3px 10px;}
.retro .star{padding-right:12px}
.retro .profile-form input.textfield{margin-right:1px;width:6em;}
.retro #profile-button{height:19px;margin-left:5px}
.retro .diskuze-vypis{width:100%;padding:5px;font-size:90%;}
.retro .diskute-vypis td{overflow:hidden;}
.retro .fleft{float:left;width:48%;margin:5px 0 5px 0;}
.retro .fright{float:right;width:48%;margin:5px 0 5px 0;}
.retro .fleft fieldset,.retro .fright fieldset{margin:0}
.retro .clearer{clear:both;}
.retro .diskuze-one tr td{padding:5px;vertical-align:text-top;font-size:80%;}
.retro .diskuze-one tr td p{overflow:hidden;width:100%;}
.retro .diskuze-one{margin:0;width:98%;border-collapse:collapse;}
.retro .diskuze-one td h4{font-size:100%;}
.retro .diskuze-nastenka{padding:5px;overflow:hidden;}
.retro .diskuze-one-prvni{width:4em;}
.retro .diskuze-okruh div{}
.retro .diskuze-okruh{font-size:110%;margin-top:0px;}
.retro .oblast-popis{padding:10px;font-size:90%;}
.retro .diskuze-toggle{font-size:80%}
.retro .infow{width:95%;}
.retro .f .checkbox{display:inline;border:none;width:1em;}
.retro .f ul{list-style:none;}
.retro .users{font-weight:bold;padding:5px;margin-bottom:15px;font-size:80%;}
.retro .users td{padding:4px}
.retro .chat-nazev{font-size:90%;font-weight:bold;text-align:center}
.retro .chat-popis{font-size:90%;font-style:italic}
.retro .chat-users{font-size:90%;text-align:center}
.retro .chat-locked{font-size:80%;}
.retro .uvodnik{margin-top:3px;font-size:80%;line-height:140%;}
.retro .uvodnik-img{position:relative;top:5px;display:block;float:right;}
.retro .uvodnik p{padding:5px}
.retro .herna-vypis{margin-left:2px;}
.retro .cspt{padding-left:40px;text-indent:-25px;vertical-align:top;}
.retro .hspk{letter-spacing:-2px;}
.retro .hdrd,.retro .horp{width:100%;font-size:80%;line-height:1.1;;padding:0;margin:10px 0;overflow:hidden;border-collapse:collapse;}
.retro .habout p{padding:5px;}
.retro .edttbl{width:95%;color:#300;text-align:left;}
.retro .edttbl td{padding:4px;font-size:80%;vertical-align:top;text-align:left;}
.retro .edttbl h4{text-align:left;font-weight:bold;font-size:100%;margin:0 10px 0 0;padding:0;}
.retro .edttbl p{font-size:100%;margin:0 5px 10px 0;padding:5px;}
.retro .edttbl textarea{display:block;width:100%;}
.retro .edttbl input,.retro .edttbl textarea,.retro .edttbl select{padding:2px;}
.retro .edttbl .sinp{width:40px;}
.retro .inventar{font-size:70%;margin:10px auto;padding:0px;width:95%;}
.retro .inventar td{padding:2px;vertical-align:middle;}
.retro .inventar a{font-weight:bold;padding:2px;text-align:center;}
.retro .i-wp span,.retro .i-ar span,.retro .i-st span,.retro .i-it span{cursor:help;margin-bottom:2px;}
.retro .hinfo{padding:5px;}
.retro .hdnes,.retro .hvcera{font-weight:bold;}
.retro .hvyber div{font-size:100%;margin:0;padding:0;}
.retro .hvyber label{font-size:0.9em;line-height:1;}
.retro .hvyber h4{font-size:90%;}
.retro .hvyber p{font-size:90%;line-height:1.2;text-align:justify;padding:0.5em;}
.retro .hvyber ul li{list-style-type:disc;list-style-position:outside;margin-left:25px;font-size:90%;}
.retro .hpopis{}
.retro .hvps h4{font-size:110%;;margin:2px 0 2px 5px;}
.retro .hvps{width:80%;}
.retro .hcas{cursor:help;margin-right:5px;font-size:80%;font-weight:bold;}
.retro .hico{text-align:right;margin:5px 0 0 0;display:block;}
.retro .her{text-align:right;margin:0;vertical-align:bottom;width:80px;overflow:hidden;padding-bottom:5px;}
.retro .hfst{margin:0 5px 15px 0;font-size:22px;font-weight:bold;text-transform:capitalize;line-height:40px;}
.retro .hdrd .hfst span{font-size:60px;}
.retro .horp .hfst span{font-size:60px;}
.retro .hkostka{text-align:center;line-height:1.8;margin:10px 0;}
.retro .hkostka a{padding:1px 2px 2px 2px;}
.retro .komuseptat{text-indent:-13.4ex;padding-left:13.4ex;line-height:1.5;}
.retro .komuseptat label{display:inline;width:auto;padding:0;margin:0;}
.retro .ml20{margin-left:20px;}
.retro .t-a-c{text-align:center;}
.retro .m5{margin:5px;}
.retro #dhtmltooltip{margin:0;position:absolute;padding:5px;font-size:70%;visibility:hidden;z-index:100;width:20em;}
.retro .dis-name{width:85%;}
.retro .obchod{font-size:70%;text-align:right;width:100%;}
.retro .obchod td{vertical-align:middle;}
.retro .obchod a{font-size:90%;}
.retro .obchod-ctgr{text-align:left;font-weight:bold;padding:2px 5px 2px 5px;}
.retro .shp-w,.retro .shp-z,.retro .shp-i,.retro .shp-s{text-align:left;padding-left:3px;font-size:125%;}
.retro .obchod-ctrl{text-align:center;padding:0;}
.retro .anketa{padding:0px;margin:-5px auto 0 auto;width:80%;border:none;font-size:120%;}
.retro .anketa a{display:block;padding:0;margin:0;font-size:100%;;}
.retro .anketa tbody tr td{padding:1px 0 1px 5px;margin:0;border:none;}
.retro .anketa .otazka{margin:0;padding:1px 0 2px 5px;font-size:110%;}
.retro .anketa .odpoved{line-height:1.0;width:70%;}
.retro .hlight1{color:red;}
.retro .hlight2{color:green;}
.retro .hlight3{color:#00bfff;}
.retro .diskuze-vypis .c-u{font-weight:bold}
.retro .ok{background-image:url('/assets/images/retro/ok.gif')}
.retro .war{background-image:url('/assets/images/retro/warning.gif')}
.retro .inf{background-image:url('/assets/images/retro/inf.gif')}
.retro .online{width:72px;height:18px;display:block;margin-left:30px;background:url('/assets/images/retro/online.gif') center center no-repeat;}
.retro .offline{width:73px;height:18px;display:block;margin-left:30px;background:url('/assets/images/retro/offline.gif') center center no-repeat;}
.retro #men0 a{background-image:url('/assets/images/retro/klic.gif');}
.retro #men1 a{background-image:url('/assets/images/retro/nastaveni.gif');}
.retro #men2 a{background-image:url('/assets/images/retro/kostky.gif');}
.retro #men3 a{background-image:url('/assets/images/retro/diskuze.gif');}
.retro #men4 a{background-image:url('/assets/images/retro/acko.gif');}
.retro #men5 a{background-image:url('/assets/images/retro/slunko.gif');}
.retro #men6 a{background-image:url('/assets/images/retro/otaznik.gif');}
.retro .uvodnik-img{background:#000000 url('/assets/images/retro/st.gif') center center no-repeat;padding:10px 10px 0px 10px;width:199px;height:130px;}
.retro .top{background:#000000 url('/assets/images/retro/castle2.gif') center center no-repeat;}
.retro .admin1,.retro .admin2{background:url('/assets/images/retro/admin.gif') right no-repeat;}
.retro .bonus1,.retro .bonus2{background:url('/assets/images/retro/bonus.gif') right no-repeat;}
.retro .rating{display:block;height:17px;width:85px;background:url('/assets/images/retro/rating-bg.gif') 0 0 repeat-x;overflow:hidden;}
.retro .rating span{display:block;height:17px;background:url('/assets/images/retro/rating.gif') 0 0 repeat-x;overflow:hidden;}
.retro .menu ul{background:url('/assets/images/retro/menu.gif') top center no-repeat;}
.retro h1 a:hover{background:transparent url('/assets/images/retro/aragorn2.gif') center center no-repeat;}
.retro .adminBlog{text-align:center}
.retro .adminTable{margin:10px;padding:5px;background-color:#30302f;border:1px solid #4b4b4b}
.retro .adminTable td{padding-right:5px;color:#eee}
.retro .adminHeadline{font-weight:bold}
.retro .adminInfo{font-size:80%;}
.retro .adminSpot{padding:5px;}
.retro h4 a{color:#eee;text-decoration:none}
.retro .uvodnik-news td{font-size:90%;padding:3px;}
.retro .uvodnik-news p{padding:3px 5px;}
.retro .uvodnik-news table{width:75%;background-color:#5B2A00;border:1px solid #292006;padding:5px;}
.retro .uvodnik-news a,.retro .uvodnik-news a:visited{color:#B22B1B;text-decoration:underline;}
.retro .uvodnik-news .thn{background-color:#3E1B00;font-weight:bold;text-align:center;}
.retro .uvodnik-news .randimg{width:160px;height:160px;background-color:#110c00;vertical-align:middle;text-align:center;}
.retro .uvodnik-news img{border:1px solid #332000;}
.retro #friends-list{font-size:70%;}
.retro #friends-list a{}
.retro .jsStats th,.retro .jsStats td{text-align:center; color:#ffd700; font-size:0.9em; border:1px solid #ffd700 }
.retro .jsStats th,.retro .jsStatsK{font-weight:600; }
.retro .edttbl{color:#f4a460;}
.retro a.permalink2,.retro h4 a{color:#ff8c00;text-decoration:none;}
.retro a.permalink2:hover,.retro h4 a:hover{color:#000000;}
.retro h2 a{display:none;}
.retro h3 a{display:block;}
.retro .uvodnik-img{display:none;}
.retro .uvodnik-news td{font-size:100%;}
.retro .uvodnik-news table{width:100%;background-color:#060606;border:1px dashed;}
.retro .uvodnik-news a,.retro .uvodnik-news a:visited{color:#ff8c00;text-decoration:none;}
.retro .uvodnik-news a:hover{color:#000000;}
.retro .uvodnik-news .thn{background-color:#000000;}
.retro h4.adminBlog{padding-top:1.5em;}
.retro .adminTable{background-color:#060606;border:1px dashed;width:98%;}
.retro .adminTable td{padding-right:5px;color:#f4a460;}
.retro .pr-0{background-color:red;border-color:red;}
.retro .pr-1{background-color:green;border-color:green;}
.retro .pr-2,.retro .pr-3{background-color:#00bfff;border-color:#00bfff;}
.retro
.retro #nastenka_edit{height:35em;}
.retro .content ul,.retro .content ol{margin:0.3em 0.75em;padding:0.1em 0.75em;}
.retro .content ul li,.retro .content ol li{margin:1px 1px 1px 0.5em;padding:0 0 0 1px;font-size:95%;  list-style-position:outside;  text-indent:0;}
.retro .uvodnik li{list-style-position:inside !important;  text-indent:0;}
.retro .uvodnik li:first-letter{font-weight:bold;}
.retro blockquote{margin:10px;padding:5px;font-size:90%;border:1px dashed #FFA500;background-color:#422300;color:orange;}
.retro blockquote p{line-height:120%;  margin:4px;}
.retro #k0{display:none;}
.retro div.diskuze-vypis tr:hover td {/*pridani podtrzeni ve vypisu diskuzi*/ border-bottom: 1px solid #f4a460;}
`;

// Create a style element and populate it
const styleElement = document.createElement('style');
styleElement.media="screen, presentation";
styleElement.type="text/css";
styleElement.appendChild(document.createTextNode(stylesheet));

// Insert the style to the page
document.head.appendChild(styleElement);

// Unset all styles
document.body.classList.remove(...unsafeWindow.aragorn.styles);

// Activate the new style
document.body.classList.add('retro');
