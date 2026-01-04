// ==UserScript==
// @name         Expedition Game System
// @version      1.0.0-r17_26
// @author       Anonymous In Venice
// @description  Sistema seleziona flotta e coordinate
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js
// @match        https://*.ogame.gameforge.com/
// @grant        yes
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.open
// @grant        window.blur
// @grant        window.onfocus
// @grant        parent.focus
// @grant        focus
// @grant        client.focus
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @include      *.ogame.gameforge.com*
// @namespace https://greasyfork.org/users/941016
// @downloadURL https://update.greasyfork.org/scripts/448812/Expedition%20Game%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/448812/Expedition%20Game%20System.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const versionNumber = GM_info.script.version;
    const __DQS = function(selector){
        return document.querySelector(selector);
    };

    // STYLE CSS //////////////////////////////////////////////////////////////////////
    var styleEGS = `#systpopupW2{width:655px;position:relative;background:#03090fc9;height:auto;left:0;right:0;margin:auto;overflow:hidden}#section_input>div{float:left;width:50%}#section_input>div>input{padding:0;line-height:0;width:95px;height:15px;letter-spacing:.3px}#spedSystem{height:auto;display:flow-root;background:linear-gradient(0deg,#000,#0c141f);border:1px solid #141e26;border-radius:7px;overflow:hidden;width:auto;font-family:inherit!important;color:#767f88;font-weight:400;letter-spacing:.5px;font-size:12px;text-align:left!important;margin:5px 0 0}.egs_colmod_sx{-webkit-box-flex:0;-ms-flex:unset!important;flex:unset!important;width:52%!important;border-right:1px solid #10181f;padding-right:0px!important;padding-left:12px!important;float:left;line-height:16px}.egs_colmod_dx{-webkit-box-flex:0;-ms-flex:unset!important;flex:unset!important;padding-right:0px!important;padding-left:4px!important;float:left;line-height:16px}.egs_col-sm-5{-webkit-box-flex:0;-ms-flex:0 0 20%;flex:0 0 20%;max-width:calc(20% - 2.5px);position:relative;width:100%;min-height:1px;float:left}input{cursor:pointer}.EGS_css{float:left;top:110px;left:0;text-align:center;line-height:25px;width:136px;background:url(https://gf1.geo.gfsrv.net/cdn96/18e4684df27114667e11541e5b2ef8.png) -374px -258px no-repeat;border-radius:5px;font-weight:700;color:#767f88}.EGS_css:hover{color:#fff!important;background:url(https://gf1.geo.gfsrv.net/cdn96/18e4684df27114667e11541e5b2ef8.png) -374px -287px no-repeat}#egs_fleet_ship{background:transparent url(https://gf3.geo.gfsrv.net/cdneb/f5f81e8302aaad56c958c033677fb8.png);background-size:400px 310px}#egs_fleet_ship{margin:0;padding:0;height:40px;width:104px;float:right;position:static;display:inline;border-radius:5px}.egs_on{cursor:pointer}.egs_on:hover{background-position:0 -40px!important}#egs_fleet_ship span{display:block;color:#fff;text-align:center;height:38px;line-height:38px;overflow:hidden;font-weight:700;text-transform:uppercase;font-size:12px}.egs_off{background-size:552px 424px!important;background-position:-206px 186px!important}.rip_on{background-position:1734px -3px;height:60px!important}.showShip{height:60px!important;opacity:1!important;-moz-transition:all .5s ease;-webkit-transition:all .5s ease;-o-transition:all .5s ease;transition:all .5s ease}.hideShip{height:0;opacity:0;-moz-transition:all .5s ease;-webkit-transition:all .5s ease;-o-transition:all .5s ease;transition:all .5s ease}.civil_img{background-size:895px 63px!important}.options_select{float:left;width:75%}.options_select label{text-align:left;width:70%;font-size:10px;padding-left:2px;letter-spacing:-1px;}.cacciaL_on{background-position:1676px -3px;height:60px!important}.cargL_on{background-position:1786px -3px;height:60px!important}.cargP_on{background-position:1734px -3px;height:60px!important}.ship_battleShip{background-position:1524px -3px;height:60px!important}.ship_battleCruise{background-position:1104px -3px;height:60px!important}.ship_destroyer{background-position:1204px -3px;height:60px!important}.ship_reaper{background-position:1050px -3px;height:60px!important;.ship_rip{background-position:255px -3px;height:60px!important}.ship_combatoff{background-position:1734px -3px;height:60px!important}.requestClass{box-shadow:0 0 5px 2px #c00}label{display:inline-block;margin-bottom:0!important;cursor:pointer}.descrizione{font-size:15px;padding:10px 0 5px!important}.background_black{background:linear-gradient(5deg,#000,#303b46);border-top:1px solid #2d3842}#select_item,#select_sped_item,#select_sped_target,#select_target{-moz-appearance:none!important}`;
    var styleSheetEgs = document.createElement("style");
    styleSheetEgs.type = "text/css";
    styleSheetEgs.innerText = styleEGS;
    document.head.appendChild(styleSheetEgs);

    var css_c = `.EGS_icon_flotta{float:left;margin-right:5px;margin-top:3px;opacity:.7;width:16px;height:16px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbmlDQ1BpY2MAACiRdZG9S0JRGMZ/apGU5lBDRIODRYOCFERj2eAiIWaQ1aLXr0Dtcq8S0hq0NAgNUUtfQ/9BrUFrQRAUQURL/0BfS8jtPSoYYedy7vvjOed5Oec5YI8UtKLZFYRiqWzEwiHvUmLZ2/OKk37cDOBOaqY+G41G+Hd83WNT9S6gev2/r+PoS2dMDWxO4SlNN8rCM8KRjbKueEd4UMsn08JHwn5DDih8rfRUk18U55r8odiIx+bArnp6c7849Yu1vFEUHhf2FQsVrXUedRNXprS4IHVY5ggmMcKE8JKiwhoFygSkliSzzr5gwzfPung0+etUMcSRIy9ev6gV6ZqRmhU9I1+Bqsr9b55mdnKi2d0Vgu5ny3ofhZ5dqNcs6/vYsuon4HiCy1Lbvy45TX+KXmtrvkPwbMH5VVtL7cHFNgw96kkj2ZAcMu3ZLLydgTsBA7fQu9LMqrXO6QPEN+WJbmD/AMZkv2f1B5xFZ9wmsV+gAAAACXBIWXMAAAsSAAALEgHS3X78AAAA3ElEQVQ4EWNYuX7bf++gyP8MZALGlRu2/WcAav/0/g3Dhi3bGbauW85IilkQA6A6fv74xfDz2yeSDGKcPG3WfzEpGRRLP717w/Djxw+GHbv3MWxdvwKvi1hQNJPhFRaw1VCN+w4cYli+aA6GjaBADvDxZEhNisOQYwTFwurVqxnWLJuPIQnTyCcowsAAlAV5DT2gMTSBXATS6OHiyMDBwcHAJwTUjATQwwfsgkWLF2ONvsi4lP9ODnYMeF1ATDqAeWXD5m0YsTJS0gFSJGAyQekgJCqR7NyIaSKJIgDsb66XyCDJHwAAAABJRU5ErkJggg==)}.EGS_cursorPointer{cursor:pointer}.EGS_col-sm-35{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:calc(50% - 4px);position:relative;width:100%;min-height:1px}.EGS_set_notturno_fine{float:right}@media screen and (min-width:1400px){#EGS_coreSystemJs{background:linear-gradient(180deg,black 80%,#ffffff00);padding-bottom:50px;width:250px;height:auto;position:absolute;top:'+topPx+';overflow:hidden;float:right;right:-280px;z-index:3000}}#EGS_coresystemJs-iframe,#EGS_coresystemJs-iframe>iframe{width:250px;height:auto;overflow:hidden}#EGS_coresystemJs-iframe>iframe{height:600px}@media screen and (max-width:1399px){#EGS_coreSystemJs{width:300px;height:auto;position:fixed;margin-top:190px;top:0;overflow:hidden;float:right;right:-260px;z-index:300000000000000000;transition-delay:1.5s;transition:all .3s ease-in-out}#EGS_coresystemJs-iframe>iframe{height:600px;margin-left:42px;margin-top:-40px;display:-webkit-box}#EGS_coresystemJs-iframe,#EGS_coresystemJs-iframe>iframe{width:100%;display:-webkit-box}}.EGS_dsp_col-sm-6{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%;position:relative;width:100%;min-height:1px}.EGS_toggle.btn{min-width:107px!important;min-height:22px!important;height:24px!important;border-radius:0!important;float:right}.egs_btn-primary:not(:disabled):not(.disabled).active,.egs_btn-primary:not(:disabled):not(.disabled):active,.show>.egs_btn-primary.dropdown-toggle{color:#fff;background-color:#32495a!important;border-color:#3e5c73!important;border-radius:0!important}.egs_btn-primary{color:#fff;background-color:#32495a!important;border-color:#3e5c73!important;border-radius:0!important}.egs_btn-primary:hover{color:#fff;background-color:#32495a!important;border-color:#3e5c73!important;border-radius:0!important}.toggle-handle{position:relative!important;margin:0 auto!important;height:100%!important;width:24px!important;background:#7e9baf!important}.egs_btn-primary:hover .toggle-handle{position:relative!important;margin:0 auto!important;height:100%!important;width:24px!important;background:#fff!important}#current{float:none!important;margin:0!important;width:100%!important}.backgroundstyle_left{background:linear-gradient(180deg,red,#0076ff);padding-left:1px!important}.egs_border_bottom-css{border-bottom:1px solid #13283d}.btnAction{cursor:pointer}.fontalign{text-align:center!important}.font12{font-size:12px!important;line-height:24px}.font14{font-size:12px;line-height:22px}.font16{font-size:16px;line-height:26px}EGS_containerglobal>select{-moz-appearance:none!important;height:19px;font-size:12px;line-height:15px}.EGS_css{float:left;top:110px;left:0;text-align:center;line-height:25px;width:136px;background:url(https://gf1.geo.gfsrv.net/cdn96/18e4684df27114667e11541e5b2ef8.png) -374px -258px no-repeat;border-radius:5px;font-weight:700;color:#767f88}.EGS_css:hover{color:#fff!important;background:url(https://gf1.geo.gfsrv.net/cdn96/18e4684df27114667e11541e5b2ef8.png) -374px -287px no-repeat}.EGS_cssActive{color:#fff!important;background:url(https://gf1.geo.gfsrv.net/cdn96/18e4684df27114667e11541e5b2ef8.png) -374px -287px no-repeat!important}.EGS_css{text-decoration:none}#egsPopupWindow{width:660px;margin-left:10px;float:left;height:500px!important}#systemActW1{width:666px;position:relative;height:100%;left:0;right:0;margin:auto}#systemActW2{width:655px;position:relative;background:#03090fc9;height:100%;left:0;right:0;margin:auto;overflow:hidden;overflow-y:visible}.egsPopupWindow .c-left{float:left;margin-top:-36px;position:unset!important}.egsPopupWindow .c-right{float:right;margin-top:-36px;position:unset!important}#egsPopupWindow{text-align:center}#egsPopupWindow .titlepage{text-align:center;font-family:Orbitron,sans-serif;font-size:24px;text-transform:uppercase;text-shadow:1px 3px 4px #000;font-style:italic;color:red;width:393px;line-height:45px;left:0;right:0;margin:auto}#egsPopupWindow .titlepage strong{text-align:center;font-family:Orbitron,sans-serif;font-size:22px;text-transform:uppercase;text-shadow:1px 3px 4px #000;color:#fff;font-weight:700;font-style:normal}#egsPopupWindow .ghost-title{font-family:Orbitron,sans-serif;font-size:45px;text-shadow:0 2px 4px #fff;color:#060e14;font-style:normal;float:left}.row-left{width:46%;float:left;padding:10px;overflow:hidden;text-align:left}.row-left span{font-weight:700;line-height:32px}.row-right{width:47%;float:right;padding:10px;overflow:hidden}.row-center{width:30%;float:left;padding:10px;overflow:hidden}.row30{width:30%!important}.sidebar::-webkit-scrollbar{width:10px}.sidebar::-webkit-scrollbar-track{background:0 0}.sidebar::-webkit-scrollbar-thumb{background:#26333e}.sidebar::-webkit-scrollbar-thumb:hover{background:#3d4952}@media screen and (min-width:1400px){#coreSystem{width:250px;height:100vw;position:absolute;top:-32px;overflow:hidden;float:right;right:-280px;z-index:3000}#egs_boxACS{display:none}}#egs_coresystem-iframe,#egs_coresystem-iframe>iframe{width:256px;height:100vw;overflow:hidden}#egs_coresystem-iframe>iframe{height:100vw}@media screen and (max-width:1399px){#coreSystem{width:300px;height:100vw;position:fixed;margin-top:190px;top:0;overflow:hidden;float:right;right:-260px;z-index:300000000000000000;transition-delay:1.5s;transition:all 0.3s ease-in-out}#egs_coresystem-iframe>iframe{height:100vw;margin-left:42px;margin-top:-40px}#egs_coresystem-iframe,#egs_coresystem-iframe>iframe{width:100%}#egs_boxACS{box-shadow:unset!important;color:unset!important;right:0;position:inherit;cursor:pointer;z-index:9000;border-radius:5px;overflow:hidden;width:40px;height:40px;background:linear-gradient(to bottom,#38505f 0,#1c2830 100%)}#egs_boxACS:hover{width:40px;height:40px;background:linear-gradient(to top,#38505f 0,#1c2830 100%)}}.systpopup-show{display:block!important}.systpopup-hide{display:none!important}#egsPopUpWindow{height:auto}#sysSpedpopupW1{width:666px;position:relative;height:100%;left:0;right:0;margin:auto}#sysSpedpopupW2{width:655px;position:relative;background:#03090fc9;height:auto;left:0;right:0;margin:auto;overflow:hidden}#sysSpedpopupW2 iframe{width:100%;height:auto}.egsPopUpWindow .c-left{float:left;margin-top:-36px;position:unset!important}.egsPopUpWindow .c-right{float:right;margin-top:-36px;position:unset!important}#egsPopUpWindow{text-align:center}#egsPopUpWindow .titlepage{text-align:center;font-family:Orbitron,sans-serif;font-size:24px;text-transform:uppercase;text-shadow:1px 3px 4px #000;font-style:italic;color:red;width:393px;line-height:45px;left:0;right:0;margin:auto}#egsPopUpWindow .titlepage strong{text-align:center;font-family:Orbitron,sans-serif;font-size:22px;text-transform:uppercase;text-shadow:1px 3px 4px #000;color:#fff;font-weight:700;font-style:normal}#egsPopUpWindow .ghost-title{font-family:Orbitron,sans-serif;font-size:45px;text-shadow:0 2px 4px #fff;color:#060e14;font-style:normal;float:left}.bdysidebar::-webkit-scrollbar{width:10px}.bdysidebar::-webkit-scrollbar-track{background:0 0}.bdysidebar::-webkit-scrollbar-thumb{background:#26333e}.bdysidebar::-webkit-scrollbar-thumb:hover{background:#3d4952}.fontFamily_mod{font-size:13px;line-height:16px;height:66px;padding:7px 0!important;float:left}.fontFamily_mod ul{padding-inline-start:20px!important;list-style-type:decimal;margin-top:0;margin-bottom:0;border:none;color:#bfbfbf}#EGS_containerglobal{color:#9a9a9a;width:660px}#EGS_containerglobal select{visibility:visible!important;appearance:none;-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;border:1px solid #000;width:115px;background-image:url(https://gf3.geo.gfsrv.net/cdne1/d03835718066a5a592a6426736e019.png);background-position:100% -463px;background-repeat:no-repeat;background-size:23px 866px;padding:0 5px}`;
    var cssc = document.createElement("style");
    cssc.type = "text/css";
    cssc.innerText = css_c;
    document.head.appendChild(cssc);

    var globcss = '';
    globcss += `.egs_modpadding{padding:0!important}.egs_modpadding2{padding:2px 0 0 0!important}#descrizione{border-bottom:1px solid #13283d;font-family:sans-serif}#descrizione .row{margin-right:0;margin-left:0}.egs_border_right{border-right:1px solid #13283d}#descrizione span{font-size:12px}.descrizione{font-size:15px;padding:10px 0 5px!important;font-family:sans-serif}.egs_divfloat{float:left}.fontalign{text-align:center!important}.font12{font-size:12px!important;line-height:24px}.font14{font-size:12px;line-height:22px}.font16{font-size:16px;line-height:26px}.egs_col-sm-12{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%;position:relative;width:100%;min-height:1px}.col-sm-3{-webkit-box-flex:0;-ms-flex:0 0 33.3%;flex:0 0 33.3%;max-width:calc(33.3% - 3px);position:relative;width:100%;min-height:1px}.egs_col-sm-3m{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:calc(25% - 3px);position:relative;width:100%;min-height:1px;float:left}.egs_col-sm-3m span{padding:3px 15px}.egs_col-sm-4{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:calc(25% - 3px);position:relative;width:100%;min-height:1px;float:left}.egs_col-sm-4_sh{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:calc(25% - 3px);position:relative;width:100%;min-height:1px;float:left}.egs_col-sm-4c{width:37.05%}.col-sm-3-mod{-webkit-box-flex:0!important;-ms-flex:0 0 20%!important;flex:0 0 20%!important;max-width:calc(20% - 3px)!important;width:100%}.egs_col-sm-6{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:calc(50% - 3px);position:relative;width:100%;min-height:1px}.col-sm-8{width:75%;float:left}#sys_title,#sys_title_container{height:33px}.backgroundstyle_left{background:linear-gradient(180deg,red,#0076ff);padding-left:1px!important}.background_black{background:linear-gradient(5deg,#000,#303b46);border-top:2px solid #2d3842}select{-moz-appearance:none!important;height:19px;font-size:12px;line-height:15px}input[type="checkbox"],input[type="radio"]{box-sizing:border-box;padding:0;-moz-transform:scale(.5);vertical-align:middle!important;width:12px;height:12px;}#sys_container{width:100%!important;max-width:100%!important;padding-right:0!important;padding-left:0!important;margin-right:0!important;margin-left:0!important;overflow:hidden;font-weight:400!important}#sys_title_container{background:linear-gradient(45deg,#000,#303b46);box-shadow:0 0 5px #000}#sys_title h3{font-family:Orbitron,sans-serif;text-align:center;font-size:16px;line-height:16px;padding:5px 0 0 0}.egs_lineargradient1{background:linear-gradient(0deg,#000,#181e25)}#selectfunction>div>div>.egs_function_div{height:70px;text-align:center}.egs_function_div .btn,.egs_function_div span{font-family:Orbitron,sans-serif;text-align:center;font-size:14px;line-height:14px;padding:5px 0 0 0}#egs_sys_moon>div input,#egs_sys_planet>div input,#egs_sys_planetmoon>div input{width:60px;height:18px;line-height:18px;float:right;font-size:12px;text-align:center;margin:2px;-moz-margin:2px;-webkit-margin:2px}#fletdef,#sped_fletdef,#sped_ship_active,#spedizioni_active{width:60px;height:14px!important;line-height:18px!important;float:right;font-size:12px;text-align:center}#egs_sys_current>div input,#egs_sys_moon>div input,#egs_sys_planet>div input,#egs_sys_planetmoon>div input{width:60px;height:14px;line-height:18px;float:right;font-size:12px;text-align:center;margin:2px;-moz-margin:2px;-webkit-margin:2px}#current,#itemnumber{float:none!important;margin:0!important;width:100%!important}#item_number>div>div>input{width:60px!important;height:11px;line-height:18px;font-size:12px;text-align:center;margin:0 30px 3px!important;-webkit-appearance:none!important}.btnAction{cursor:pointer;z-index:10}.spedizionitarget{position:relative;opacity:0;visibility:hidden;-webkit-transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out;-moz-transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out;transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out;font-family:sans-serif;text-align:left;padding:10px 13px;background-color:#18222b;width:530px;height:auto;left:30px;z-index:100;box-shadow:0 0 40px #000;border-radius:10px;border:3px solid #000}.popupshow{position:relative;opacity:1;visibility:visible!important;-webkit-transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out;-moz-transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out;transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out;width:530px;height:auto;left:30px}#spedizionitarget_btn{display:block;position:absolute;top:9px;left:10px;background:transparent url(https://gf3.geo.gfsrv.net/cdneb/f5f81e8302aaad56c958c033677fb8.png) -90px -78px no-repeat;width:18px;height:18px;float:right;background-size:350px;cursor:pointer}.startdissolvenza{position:absolute;width:100%;height:100%;background:#000000b5;z-index:1;-webkit-transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out;-moz-transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out;transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out}.overcolor{opacity:1!important;visibility:visible!important;-webkit-transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out;-moz-transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out;transition:opacity 0.2s ease-in-out,visibility 0.2s ease-in-out}hr{border-top:1px solid rgba(111,111,111,.16)}.zindex{z-index:99}#select_item,#select_sped_item,#select_sped_target,#select_target,#sped_select_sped_item,#sped_select_sped_item_ship,#sped_select_target{-moz-appearance:none!important;height:19px;font-size:12px;line-height:15px}.sprite_img:hover{box-shadow:inset 0 0 10px #00ffdc}.bsship{background-position:-398px -20px}.bcship{background-position:322px -20px}.dsship{background-position:480px -20px}.rpship{background-position:240px -20px}.ripship{background-position:256px -3px}#seleziona_flottaguerra{height: 40px;padding: 6px 0 0 0;}#seleziona_flottaguerra p{font-size:12px}.select_ship{box-shadow:inset 0 0 10px #00ffdc;transform:scale(.95)}#seleziona_naviguerra label{padding-left:0!important;display:block}.shipDisable{opacity:.2;cursor:default;box-shadow:unset!important;transform:scale(1)!important}#set_def_target,#set_target_def{width:40px;float:right;margin-right:1px}.fontFamily_mod_md{font-size:13px;line-height:16px;height:56px;padding:4px 0!important;float:left}.fontFamily_mod_md ul{padding-inline-start:20px!important;list-style-type:decimal;margin-top:0;margin-bottom:0;border:none;color:#bfbfbf}`;
    globcss += '.civil_img{cursor:default !important;}.sprite_img {background-image:url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBARXhpZgAASUkqAAgAAAABAGmHBAABAAAAGgAAAAAAAAACAAKgCQABAAAAUAUAAAOgCQABAAAAUAAAAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABQBVADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+ff8A4Ksftr/Ab9oz49eN/CP7LH7KH7HHwe/Zr8EeLtQb4V3XwF/Zj+DXw88V+L9A8O3nxJ8MeG/iB43+Jun+DvCvjjVtd8Z6Tqi6vefCJ77/AIQMzW3gnwxPoz/Gfw5ZeLl/Gq08Xu3/ADJ3w4ft+80KyHP4xv8AX+Ves+OdPl1vxdqi3VldXep3draWdhc3KtcWNrZ6fplpothaW4l3Rw21lo1hYaTaW8W2K20yztLCFUtLaGJMDTvAerz/APHzAbfjqi7P5AfQ+tfSrJ5LV8tlb8OX9Evx7M8rnemr+cpdltZ91f7jkrXXGvARD4U+HCjuBpdsufqFt8dh/L2rSXWxPn7T4L8J2+4jcV0DSl3HPU4tRkdua9h0X4V/aTiC3u4/+ue5Pw+XH1/DrXaWvwc1Ka72y6dDKmfuy20bjP0ZCP0rg5I7NJdH7q02Xbyv/SBSk2tXuvtS7ru32PnlLq0l/wBfoXhO17fJ4W0qP/0GzXt7emB6oj3UfMfg3wrGfVND0xf/AEG1Ffenhj9l+71yGxig0fU77UdU5hgmjebbj+6JA2PXI/8ArV9GaR+wfqnh+znfx9ouleHbnUNO+z28/iTUrxLvRPE//QSv9C07eY/Dn/TNoRbZ/hr5zMuI8iypLJZ1U67lH35O87tq15O73euv+R9MsqqWTu9k/wD0n/gf1t+Sqyauv3fDWgr/ALul2Y/lBWwsd+sP2ddD0Vbf/ngum2Yh/wC/Qh2f+O190eJ/hZ4I0EXv9gyXPij+y9e/4RaYvpq2u7xXx/xMHJjG7w0ef3Jzbf7NeaD4VudX1q4jfWrPwS3/ACBPEuj6HYeJbu56fc0nWI5GPccJ196+ijGLSfKtk9l2Xl5L7jg5pfzS+9/10X3Hz7o+t+Ora90w6RdTaYNFj8rRv7OuJrL+yYv+eemG2kj+wR/7Fr5K9cDI5/V//glp+2N8IP2XPjB4K8I/tO/s1/st/HL9lLxX45MPxxt/jh+zh8MPFmqfDC38fa58OPDs3xL0r4lXvgrW/G154w8DeHPDPiTUbL4TfaNQ8Gadf6lr/gxbRPjVrF54kHMfC/8AZCufGvw+8KeMYbfTtTu9U0TztUutKtbvSdPvJcf6zSxBFEgfp88WG75zXP8Axk/Zv8VeAPD2sa++mX0Nn4U/4RL7Tfxq8czef4gfwlPvnXDnzvCsj+GZst+88Pu+ivnTWNsfLWrS7tEkf/BWb9uP4J/tD/HDxloX7Lv7Mf7I3wf/AGb/AAd8SZovhHefAr9nP4UeA/FWveHbW5+KGieE/Gniz4meH/A+ifEq51X4zeE9RXxVa/CXU3TwN4Hm07wHqYtW1vQ3vIPyo8P+Nb3Wr2xtdP8ADHh2GO7uo57WK60rT3ihurQlYLi3VrfZHNBg+RNGFeL+B1zXP/FuSaHx5qEU8ssiovh8KkkjOqpLpVrYzooYkBZtPsrWxlAGJLS1gtnDQwxovsfwj0LS9Y8P+LfE1hpOm3uoeG/Dfhd7Hz2um0+28TXLES2MMO14baW5VQbiOHG9twfcOa9NQjZXjF3XWKfbr+d9WVzze8pf+BP/AD8l9x7Z8Kv23/22fhB4fvvBf7PH7Snxw+H+g+H/APkKaD8LPjH8Vfhno0vX/kEaX4S8Q6PZQ/8AbCBO/NcV8W/jp+0v8ftStdZ+O/xS8ZfGvWLGPybLVvi38R/G/wAR9Ss4f+eVrfeMdU1m6t4/+mcUqL7V+kP7KvwDbx74UfxDrX9nWuoanN/a1slxbwaW+p2R4EGjkpGwg7+XCfL9q9Z8Y/sWXGi619jtNGs5LH+xfN88WN2P3v8Az13CEfvP9vO7/a9fHjSpQ+GnTj/hhGP5Jdl9xpLEYifxV60r2XvVZv0WsttT8R38G65a3enLceBtAgWQfOuoWtjIr9fvrLCwYdPvZx+dX28I2Nzaai2i2PgZmj5Rr3SEkKdPumS1JX/gJ/rX7jWf7FWt6sNG0HVdF0vU5p9a8rS9U1Dw5ZXt5BF08rVrq4tZZpI/9iZyvsa9Nk/4J8XugeDotG8UeHdD0rxHZ+H/AOzbyQXtxFd67qR/5e7OZVWaW6P/AD8B2m/2vXh/tOjezhDdfZX93yff8fuxeArb+0qd/il/c8/T+lr/ADg32h32L3Uv+EB0D+ydL4ntf7B077c3H8Z+y72+hz/KvOZde1TTn8w+E/h9FIP+WiaVbh/++xEhA+pr+g7SP2KNesrDxLdeJtO1GOzsdF827S40svqlxL/z0mlkiaaST/bdmb/ar4q/aQ/Yy8S/BrxbfaHc2MuqWmq2ZuPD2qwaSr2E/h7p/bMRERjEwz/x8Jh+cbxXop6J7aXBLZeiuflu3jG7fy9/hPwU3lf6rdpyN5f/AFzyh2f8BxX7Tf8ABKb9r34Gfsx/HfwJ4T/as/ZQ/ZI+M37MHxC8ZabpXxOvvjv+zL8M/iN4o8EadrmofC7wh4q8e+HviRefA7xL47tfEng7TtIutX0/4SW+pweAmlm8ceF20yw+OPii+8XzfDmk/BO7vumlzn/tlnPv90/579K6ZvgHrnhDSdT8TyWuoab9jju4r2a1MltJcQ6hpl5ot9HcSQ7GljvtG1DUNJu0kLLcaZfXlhMHtLmaJ+FZtG6V+qW7/u+fn8r/AHei8qqW3a011enw+q7d+nbT6m/4Kv8A7aXwO/aJ/aF8X+Cf2Uf2Sf2O/hR+zj4U8XnS/g1a/AP9m/4LfDPxX8VdL8PyeO7PRviN438WaX8OPCvx4tvEfiseIdE0/UPhJ/b1l4Gkl0fTvDF5oA+LuhDxLX5C+H/FH9s3A0648M+CwfWWwSM4zzx5cnT/AHh6Uz4vx3Fv448UQTSSOgTwWJFeRmWTyvA0Xkb1Y4YwJ8sW4fuhwmBXY/DXVrbxLr2l6brek2lwlnk3V/4etrfRLu4UngXNzZRW0k57FnOD2A6V9LF3XXTT8F89d/n6HzU0kl1b63beyv8AdqvxVtUcJN41u9Klv/K8K+D5Cs4mWU6EjtHPnH2hC8C7Zh1Mu5Hx/Eaz28fRPKZn8J+CnmL+aZW02NpTJkHzDIYyxfIB353ZAOeK+l7n4gat4T1DX/Aen+EPDGu+JZNbEOlalrtrp+qRWcGRlNTa9STemORHM4Qn0wSPXvj/APsC/EL9nvwN4L+LniDS4vEngL4laQdb0668P6b4o8N6n4PhJzjXdD8Y32qyW8fbZcrIfRwuFE5Veb1d9X8S5use4KbS1vdbe9LXbdXfa/bS3Q+FbPxmskm+08KeB7eQfxR2CQyDvwY4A35nrXselfHn4sI6S6brmsWMsdpZ6ektnq+oWskdhp8H2WwsUeG5RltLG2/0eztlIhtoP3UCJGdtcdp/g1EsfssdzIl1z++R2WXP++p3e33v0rovBPhq+luPsD2aPJ/eeFWb/voqT1/X1rRatLuKWY0GrSp05WVvejFv7Pk1+H/A6GP4y/FLXodLt77xNrn2fRNO/sjRoJNb1NodI0j+3P8AhJv7L0yJropYad/wkf8AxUH2G0WK2/tv/ibeV9uH2ivQ/D/jn4zLdT3vhzxf4ltL3TZvP068sPEOr2t1YTmyudN8+yuLe8jmtZv7OvrzT/NgdH+xXdza7vIuJUbNj+Hj2R03zNKch878wL8/X7+U+bp/Fn9a+gvhl4Git9XtIrq3ubaPV/uRpuRD7bBtU5+n5V6Cyuq7PmfR/E/7vn/V32Z5bzDD3v7Olv8AyR/u/wB3y/rS/gh+KPx/8OxwWo8Z+LrbQLaa9uLaHR/E2uWlpbz6l9j/ALRnggtr6OGKa/8A7O0/7bLGivd/YbTz2k+ywbP1t/4JWf8ABTW+/ZW+NnhGw/aa8HfCL4xfss+J/iFD4V+PGo/HH4VeGviB4h+G8/iG++FPhzxL4/8ADPxW1bQ/EPj3ULjR/C9gfFL/AAcsbmXwHb3V58Q9VttPjvtRv7qfNb9jgeJ9CsYvDFnp+tR6p/qY4JodOjX/AHUjCAZ+nWvKfi9+zjq/wt+FOpa5e+EdU8L2Wi2vh+y0W90W4kEmnWes+Kr7QdXtL+W0KOtrquhapqWi6lAzCK+0nUL/AE66SWzu7iGQWVVXZc71svilf7Pnv/m+zJ+v4Zf8uaW3/PuC/l8vL+uvv/8AwVX/AOCpvi79p744/EWx/Za8K/D/AOD/AOzP4U8baTonwfvPgv4J0P4beL/GkPwsk+JNjoHxN8ZfE/TbHw9458R3PjCbVrayn+DM8l38OryNPAPgj+yZPjLpFn4zh/I2T9tf9sDwssSaR8d/jNpCQXX22FdM+KnjuwWG8H/L3GLXXoglzj/l4QCXp89fX/ww/Zuk+L3w5vNXhs7jU9Y0mM3Mj28ZluDozWtjYnTjLtMn9nNZaXptmbPd9n+y6fZW/l+TaW6R+JePP2br/TdP1K41GGSGyTGyM6WBqaY/uy+X5y/g3rz0r2I4HEQXu1q0VZaRqVFraOuklq9Lnlzx2GqtKeHoT1s+enTle7jZax6J+W70VtfMrL/gpT+3HpqNHp37Uvx4sI3Xa8dl8fvi9ao6/wB1lg8Uxqy+xBHtVaT/AIKMftvSszS/tLftAyM/32k+NXxIdn/3i3iUlvxJrw7VvA17Yap/Zxs7wP8A8D/l17f1rnP7CP8Adl/8Fw/+JrwFi8XFtLFYhd+WvVX5SR7lHAYGik6OCwlG6V/ZYajTvp/dgvP72e26l/wUJ/bFuP8Aj5+P3xdl7fP8YPiXN/6M8TDjv+vXmsGX9uv9rCY7pfjb8TJW/vS/Ebxe5/NtbY1x3hbwlZz39rc+MZb7VfDsPOsDR3k0y/tOe7RFHA7EdCOCD0q8vwUhuPA3iLx1pN3ZPJ4C1iytfiH4XvI7OTWPCkGtpMngvXrS1ltZn8ReH9M3r/wnToklqXCvfRSN5ckUSxOJl8WIry1u+arN9tdW9dPL8rbwwuDi1bC4eLvvGhDa63tb9ehoSftrftFytul+KvjmRv70nxF8cO35trZP61nH9r79ok9fiV8QD9fG/iU/z1OvFP7Fn/vP/wB9P/8AE1Je6VdL91rJe3yxxrz+AGf5Z71Kq1utWo/+35f5/M9aNChFLlo0o6LanBem0eh7t/w1t8aZ2RoPiP4kRo/uNqHjzxhIU/3DNqJK/wDAcV+uf/BJf/gq3bfAP47eBvBP7VHw6+DPx0/Zo8b+PtK0n4o6j8evhJ4K8c+KPA2jeILjQvD/AIi8eeHPiVrukeIvHGna/wCGvDuhWniO2+Fdjqtv4FiuJvGerWVnpOraxd3Dfgi+iTSWP2qQtJef8+rksv8A3yxI/SvUPhrpWuQ+IrPU4jPELtbyO6aOSRDcpqFnf6dfpcMpBmS+0/VNTsLxZC4ubPUb+1mEkF3cRyZtyaacnr6/5+tu2nbW/Zw/kh/4Cv8ALyX3H7P/APBWX/gpxon7Rvx48f8Aw+/ZW+EvwR+D37MXhHUrnTvhVJ8C/hT4K+GXiTxxoOiP4yh0L4iePvijYaBoHjfxL4k8UlLCyu/g5eXU/gF4beHwZPpTfF7Tm8X1+Nw/ac+I6+QV1dgbVdltjXtcH2df7sBFx+5X2j2j2rJ+Jvh7U9Q8a6yTFqMv9oLbJbeY8sgRLS3NpaRoGYgR21qWtbeMDbDbEwRhYmKHAt/A99Pn7HZ3tx14be30657/AJ/pQuZWSk9P81+l7+bv5HmJQuvcW69emt7Wet7dux0X/DSPxKE32ga3P5//AD3/ALe13zv+/v23f/49Uo/aY+KAeOQeIbwSQrsikHiLxBviT+7G/wBu3Iv+ypA9q2PCn7Pmv+ILsJdy3OjoP4S734/FTvz+P+NYOveAtI0K6Wwsde0jxc7asugNJoGuWcDDxaSQ/hwf2tpsBbRVwSvikEW7kEG5UDBLy/mf9W/yf3+R6ijGytFbLovL/JfcNX9o74jrNHcLrEq3ELb4Z11zXBNE/wDejlF5vRv9pWB96pN8fPGryec1zbNN532jzW1LVTJ5/wDz33m5Led/00zv/wBqiX4OeMpbGC8s9B8WTWV0SdKuRYwA3pJz8zqQZAM4ALHHTHFcRe+FdcsbiCxlsb+0miA/tZrzfm0OVzkucxjbnpzux2zS17/h6f8AB9L+Rbbl8TcvV3/M7yP9oLx3F/qr6OP/AK56rq6f+g3Qq7/w0p8TArqNdudsn31/t/Xtr/74+24b8Qa8+/4ROb11D/v5J/8AF0iaHc2mfOs7x/8Af3t+W7PoT7emKFzfzdv/AG3/ACf4dkTZdl939dl9x26/tC+PojiXUhcf9dNW1mX+dy/4+tfsL/wSj/4KM+AP2ffjj4K8K/tV/AH9mv4zfs5eL/iBa6f8Yrz48/Aj4d/EXxh4Z0G6m8P6J4u+IHhH4oeJvB3iLx7puqfCDwnpFh4hm+FGmSHwd44urnxvqptLXxDrMGoXX4S6jYalFeFYYmuV/uuPNX6bWyOK7P4TJraeMtNijmvbGJ23OsE0tsjkWl5YBmSJ0DMLDUtRs8sM/ZL+8tx+4up0kTV9G9H5drdej3affXoLkh/JH/wFf5eS+4/oR/4Kuf8ABZzx9+0h8d/G3gD9liw8H/B79mXwB4s1Cz+Dt58A/Csfw88U+LrDRtT+J3hDw38QPG3xEtPht4c+IV9r3i3SvEfhfW9S+D95qVz4DtP7J0zw22lXfxo0K28ZD8a4v+Cg/wC1xBDJbwfH74swwTR+VLDF8YviXHDLF/zzkjTxGEeP/YZSvtXz58VZ5p/HWtNNNLMwsvA9uGlkeRhb2/gGytIIAXJIhhtY0toYs7I7dEhRVjUKPN/Ol/56yf8Afbf415kZzuvfluvtPuvMOSH8sf8AwFf5H2Xa/wDBQT9rayklmsvj58WbSWf/AF8tr8X/AIlQSTf9dXi8SI0n/Aya4TW/2sfjR4m1fUvEHiTxtr3iDXtZttMstX1vW/GHirVdX1Wz0X7X/Y9pqWpX+p3F7fW2k/b77+zILqaWKw+23f2VIvtM2/5v86X/AJ6yf99t/jV+1t7i9u9qSyBP7okYKfwBA/P2+tetGpVSXLVmtFtJrt2fk/v8hOnTl8VOEumsIvTtqj2R/wBon4hSP5j6oXkM/wBpMj6zrTP9p/5+Nxuy3n/9Nc+Z/tVpX/7Ufxa1WyudN1PxVqmo6de2/wBlvLC/8UeJLyyu7X7b/aX2a5tbjUJIJ7f+0f8AT/JljeP7b/pW3z/3leU2WjTv99mbv8xLZ/Mnj+nevRvDvwwvLqxv7ue8tpbPTWJmuX2uT3wWbccdcDPH4VXtq+n76r/4HLpy+fWz9PkjyeSj/wA+ofcv8jvtL/bU/aQ0PTLTRdE+KHjXR9G0+y/s2w0nS/iD400/TLLTv+fC0sLTWobW2sv+nWGJIP8ApnSr+2/+06l1d3q/Gn4kLe6hqX9s392vxR+IIur3WP8AoK3dwNfEtzqX/T9M73X/AE1rkv8AhAdS/wCJj++n/d/6v95J8nX7vPy4/wBnB46cVxl1oT2Vx9gkXMv94gFuPQkZ9zn3zRKpVn8dWpP/ABScuq7vy+9+SFyUutKn/wCApf5nfSftafGqW6kvpfHHiCW+mh+zzXknjHxW91Lb/wDPCS4bVDNJD/0yZyn+zX7lf8Eev+C3/wARP2S/j38JfCPx9/4Rrx3+zBN8Q9L0zxzqHxY8J6f4s1/4TXXiC68P+HfEPxJ+FnxJv7LWvHHgl/DXh/RrXxFB8IvD2oaf8Po55fGus6fYaZqWqXN5N/PFfeGbqe7K27NEuPuxkovfqFwAf6fhXVfDjQPEOi+M/Dq3D3dkk9tfWMyRTSxCSx1Ky1DTtRspQjKHtb/TtV1OwvrdgYbqz1G/tbhJILy4jkKlWtVio1atSrFW92pOUoq1lopN2e7VtvuGqWHjeUaVOE7WuoRv6Xts7JP7j9yf+Co3/BVu9+Nf7Qnxc0b9iz4cfBX4Gfs92nj+6g8Hap+zh8NfCnw/8dfEqwtrv4m+GdC+JvxM+Lnh3QfDHxN8Z+Kvjd4c1OHXL74Y6zPL4T+H01t4J8Of2Snxx8NyeNbD8crn9rf9oXXb6bUtb8ceM9b1G4877RqGq+KvEGoX1x9p/wCPjzrq91CaeTz+DN5jt5vWQtXI/E0ap/wsbWkvVm1OCK++zxwLPqctp5cngOwsXt4dcfJ8ptOtLW1eCOU5tLKGNh9lt0SPqdZ+Cuqv8JdO+LfhrxT4F1OK9vG07U/A3g3WtY17xV4d0pWz/bOq2188k1vKWGxpCVZVO0MAMUo1KkZ88alSM1pzqUlJ6LVyXvX+epKw2Fja2Gw6bs7qlBW81a3m9tNNty1p/wC0L8ZIba807w/rOvQ2Oo3tpqeoWRbx21pfajp//Hhf3kEOvvb3N7ZD/j0up0ee2z+5dK5df2jPifbQrbTao8lutwbxYJNa1poluxn/AEsRNesi3P8A03CiX/brxzVLHU9G1NdO1OE6NJYALcfYQZi+SDuk8ph5h4x85bqc9TXcW4kvlstB0y0uptd1TWhDDe6iXntVh/55I028BO+wfKeeOtXHE4hR5VXrxj/Kqk1F7X92+nb+kP6vQU4y9jRcm9/ZwclqtHNJXvpdX00R32hftcfHvwvdjxB4Z8f+KfDuoD90L/QvGPizSL8Ln7gudP1m3nA9vN98YrU1j9tT9pXxfpx0XxD8VPHvijSev9keIfiB431vT/b/AEDU9fmtuOefK/TisHUPDGpeH4PDWl+L9JurHS9csPEh0prXSYrfUYPEV74oPgfW9L1eYor3A8JajG82nWs4YafOFFoqyyhaq2Hhbw9aNpWmtBriapesfDWoXOnatNDZ2Xi0scaopgeNP7BG4ZCosQxkAKvEe0q/8/Z7fzPfvv17Hqxo0YpONKnG6T0hFfilqXdE/ab+L3hm4h8ReHPEF94fvreC9tYL/RPEXiDSr6C31LjUbaG5sNQt544b/pewpKsd0eJ1kNeteJ/+Clf7bXja61C98ZftO/Hbxbe6sLUard+J/jr8WdeutTFjZnTrIahcar4ru5b0Wmns1jai5eT7PZsbWLZASleYat8Ptd0zRNQ1JrXU9b2aMJF+xafY6dosUhODMLeFRAHHJLJGZOMD355vhL4j0/VY9N1vQNW0JtYP/EhsNfSWPUbn/d/svc5H0/AVnypbJL/t1eXZLs/v8kdEKlSn/DqTh/glKP8A6S0V9Z/aF8f+I5zc+IdRXXrktC5uNZ1fWNUnL232P7OxlvrueQtB/Z9h5LFsxfYbPYV+zQ7P2c/4JLf8FS/DP7P/AO0H8MvCf7XPwb+Afxl/Zs8S/E7Sbb4g6r8fPgj4C+I/i/4Zapqr6ZDq3xc8HfFTxN4f17x9oV94cj8Oal/ZXwn0y9svAViNWvptPtbS4ke5H476h8Hb2G+uLa51TTnvbYk6rJYfbo9NsMjHyJEqxxgccAAZycAk1zHw/wBOv9O+JWm2IuZ45X1K706R0lkV5NPv4p4L6ykZWBe0vYLm5hu7diYbmK4mjmR1lkDJQjHZRS62Sj27JPu07qztuJuU/ibld/abevzP3t/4K8/8FePE/wC1v8avGvgv9mrw78MPA37KvgD4gxH4P2fwf8EaBoeua9Bot58TfDnhL4qeJfiNa6Pofj7VPGHxh8OajHrg+G8qQeFfhtJbeB/DMWmw/HDw7J40sfyAsf8AgoN+1rpdrJZaZ8fvizp1lLN9oltLH4wfEq0tZLj/AJ7yW9v4kjieb/pqyF/9qvH/AIl6Dq194y1IDXLtxGrRxgpcYjifT7bSZI0CuAiSaXZWemMq4D6faW1mQbaCKJeeTwfcTf2d9o1E23mff2WXl7+3zbQN345xXE86qKHJ7eqoL7HtJtaKK1V7Nvv5u/W/OsmpOXM6FPm095wjzatdUr9V12bPpPSf+CgP7aNxdxppX7QfxjTUoZDLDdxfGT4nx2kMv/PWONfEyxxycffWRW96p+Hf23P2rfCN5rdtoHxh+ImnXfia8stQ8SzeHPil4/0ubxDf6bzp99rcuna3C+rXlgf+PO51AzzWvSB0rnk0zUbi2sPD9no1p4S0nSGZls9Osof7f1gk5JvPE9rGl1dZJ6S3LgdBgdI4PAlxawadc2ralbXEn+suIJpoZ36/fljZXbv95ifY15k89nOPs5Vakqd/4cqk5Q+z9lycevbr93oQ4foQS5cNQjt8NGmt7dl59/1t6v8A8Nwfty2Fz9r1H9pH43T3Zk803Vp8YfiELky/89TMviLzd/8At7y3X5q+fLYx3t5tTwb4A2nsNNh2k59Psv0r6P8ACHwMvtT+/H5n/XRQ+P8AvoH/ADx9ewi+Duow3Pnw74rDr5MWY9R6Z++pEv61j/a0Ha9nt/7b/wAD/gfZ0pZKqOtKnGktG/ZwjC/w/wAqXRvp1+75js/DIflvCXhZu3zaHph56d7X1/z2rrLX4byXv+r0TwuPXHhbTB19xZ8e2Pw9a+1fAXwPuNUu9r6O8q/3ZLdXB6joyEfgfTPFfcfw5/Y013xPL5Ftpl0t+Jv7X+zJEQPsf/PvsC48jv5eNh/u0nmtO20du3+H/gdP+B0ckbW5V80vLy8kfi3Z/DCV/veE/C7d+dC0s+/8Vqfy/A1+nX/BM39oT4G/sj/GjwPpf7VX7Kn7Hvx+/ZQ8S/EG18M/GLUfj3+yt8H/ABv4g+Ekus6rpHhHX/iRovxU17wL4g8dX174X0Tw/Z6vB8IILub4eWupjx14Gj0tPjrf6n4zuvukf8E75NOh8q/tb2bUf7b8nyLPStuYv+eeEiH7vts+76ivkz9s/wCCnhv4BeFm8J+Itas9B8d+JtB8P3/hfw9p5jm1XTNL1nxBq/hLWLK7EP7+Oy1Xwr4h1/wzqVsdsF94f1zV9Fukl03U7y2mMtzSE7qSUlZ7pN29X6/8E8hRi3ay1fZeh4J/wVj/AGy/2fv2i/2gfHvg39lP9kL9jz4M/sw/D3xfqWkfDK4+AP7MPwY+HvirxtP4e1P4neGvDvxO8VfE/QPAvh/x7rU3i/QNf8OavefBu6uF+Hb3Ol6N4bn0k/GDRbTxgPyR0XxT4faHTom8G6W+ouSHhOkWZEgz1ZTb/OD1+YZ9scV9O6z8I7jXdDvvidcyWurnTLOz0+a3VdQnjew03SotC0+xdWVw1nY6HbwaNZ2xBhtdKhi0+FI7SNYB5xpHwW8X6n4y03+wJbpDHn+3NQudCdrDwNk/8tg8Zi8S4GVB2y8DJyear+1Kd7JK62vu37tlfq3p+mtkvSWV1Ek25JJJvW38t/Tf8fuh0PS7HV476GbwhoMkWmHM0VjounpGxzyXSO2Ck9fvKePrXPaxDqOklDB4X064MVt9jjLabasY7T/n1QmIlbbn/UriLqdvNfbvwu+GGl3mp6VoPw/8e+FNX1vX7n7FP4bgsri5msvEXa+1rW9aj8ybwv2+z3ErWn+x1r6H+Lf7JF14VbUhqBOnaknhH/hIY9HskF5Yoh/iTWIwUXHqrg9s12KpmjtbC00nb/l3HRPl/u+f9X97znh8nV71tdW1frpf+ut/P3vxkuviDrdqX8/w74Tffy+6F33/AO9uj+b/AIFmq4+IPiNemlaePpbxD+S19ff8M2+JfE+p2Wn2piV9U/1N+g1Iaev+5gCMenA7nHSum+NX7C/j/wCEdrpPiLWtOl0vRNc0r+29EkvYikd7b5+7hwFkTr8pyDxxXqLKZKzatazdkv7r8+/9dPL/ALRoLTkp9F8EdPh8vPz/AMvgk/EfUtPuPtMekeG47s/8vEEUvn9f+eylZO/PzHipn+KuoyvHJJo/huSSGTzYZHjmd4pf+ekbMSySf7akN712vjDwBb6RY6bdXGqq95JovmvbPZBleX/no6FSGk6/OQW46g9fL9X8NalCxuorWaO3P8C3pCjjjAzxn2P61p7KC2hC2n2I+V9bdk+nUUXB8t49d03qna2jZsRfFK+gRkg0TwxCjfeSKGSNG/3lTaD+INfsn/wSj/by+C/7Nfx58AeGP2vP2V/2Svi9+z54z8XSWnxdn/aD/Z1+Gfjfxh4Y8MagdHt/EnxN8C/FLxV4H1vx5pPiT4QL4f1GzsfhBps1z4S+IkV9qnhCPR5PjBfReN7n8Lsaj/zxP613vwnmuofH3hsQx30Yd0LpHJMm9ltri0RyFK7ttpc3NoCeRb3M8GBHK6seyg9OSDvZfBFPotLLR7tPo+yR6ajGyfLFaJ7LTbr8l9x+1P8AwVM/bi+C/wC0p+0B8Q/BP7K/7L/7KXwj/Z08FeNLv/hXOqfs6/s3/Cn4ceL/AB9oOjan8SvDPhnx741+LWh+C/DfjzxHr/jLQvEfhzUrj4O3+pJ4Cl1LTND8JNpknxs0bT/FDfkpqGq6pDd7LfSPDFwp/hbTLB1z34MJGcY7DFenQeCten+K2nTWizXFhf29naWlyS7mG10/Sl0GwtYWJJjtrHQ0XRrSFCIrbSlXT4VSzUQ173H+ydq3i+O/1vTtLudB07Qf+PW31qH+w7LxR0H+h65oqxrcfhK3Sp/supo25WVna+y9126/1+HnPMqO3JHtsv7vrrrq79fu+TfDGjeMPFj/AGeLwN4ca173R0PTzIPfzPsxbp6kH+VdNH4LeG9+zQ+GNJius/6+PSrNJ/r5iwCTr75zxX09Emkfs+eM/C3gLx/J4ok8XahdxWNz4W0TTJr3W/7Emk8uK1ewQHw1J4pZ8J9qCvdqSNzrkZ/Sf4U/sdWfxnXTvEXhCSHVNI1HSjrnhXWdNh0j7brkH92XSIhvukB/hdHHt2rTlgukdOrS0sl+ljzFe60spW2uk1fp5XX3ryPx2074Sy6sxMui6NOWkMrGXw3ZSkyf89CWtmJk4zvOW96tXnwmj0tdsXh7S7leu2TTLNxjtw0DDr7fzr+i3VP2I7vwNotjb3GnTC71TRfNhuDABOkv/PVZdnmLJ1JcMD7+nyL8SP2bdU0i7j1CH+wINH07H2m0hnu4r2X/AK6hFVn9MMT618NmfFNHKHacY32XMk9bxXX9fxPtsr4Wr5vyuEpJe61ZtLaN1v1X3Jeh+KF34Vh0m68qDQ9Nnj/55tp9q6ev3WhK/pyfxrGTw3NH/q9J8Np/ueGdNX/0G1FfphqvwBtIW3Xkd1bt/eUFG/MYP6/rxXlGs/DMxXm2O6uo0/ux2bIvH+yq49frXzH+t99pz12vKS35d9dN/wCr6/b/AOp0Ureyp7LeEeijvp/WnfX4Qu4LuzbdLoOgs3Zm0yyJ/BjCT+vc1+s3/BLX9sz4Rfsv/HTwV4U/as/Ze/Y++Mn7NHjP4g6cvxOvPj5+zP8ACL4h+KPg9oOrahpuieIfFuh/FbW/B3ib4g33iHw/4b8H614kg+D9jeDwRbyajqepWdhbX11Oy/KsvwT1iZNSuJrFJbqO3/tRLSSFZETWev8AYiRspC2+P+XUARY/g7VymofC3UNHso9bgL208MF3aw3EJMM8Vrf2d3p1/bxTR7XSC+06+vrC7iVljubK8urWZXguJUf0spzlzablJvS15OVtu7d072d1890/NzXg/kydVIwjGSafMopSurPdJvS2zdvzPrL/AIKyfti/Af8AaK+PPjfwf+yn+yJ+yN8H/wBmTwb4pubX4MXP7Pf7Mnww+GHiX4saRpeoeONP8NfEDxZ8T7P4D+GPiAPEvii6XT9Pv/g9LqR8Gi1tR4MuNMm+LWh3HjNPyM8P+JPDniS+GiQeG/AGi3LZ26nqtlCLM7Tg/NJbY/P146V7lJ8IPG3xS8ZReCPBuk2/iDxR45e2fSLG2n0q3RHs7OawtH1jXtaZHna1sbi4srdp5maG0nmt4isMrxnzfXPB3hy/urLRfDmi6iLeOx2atda3ePPJc+Jv+gXpb3DOVH/TKIhfbvX261SfdI+KSsku2n3HPxR3N9IYvC3h34XeKmX7y6db20EqnqMx65Hb9vVh9DmuSm8TajDNdWd38PPCFvJYEiQjwRqKSEg4JmH2wPGPRpQqkYIJHNM8daPp1hqF1oum2KXt5bcapqb3QltbIkjiNyWSH1JBX2B7cXM73Ms09w7Tz3BzcTTMZZZzxzNI5Z5TwOXLdBTBatLudJ/wnVt/0KHgf/wVxf8Axqj/AITq2/6FDwP/AOCuL/41WHa6TdXv+rllGOuHf+h/wz9em3B4V1ib/jzief8A3tz/AF65pvMoK+kdP7sf7v8Amvx76+isqqaavp3/ALvn5/l2YN48gZBG3hHwMyDkI2mxlARnkKYcDGD29ad/wmkv/QA8Af8Agth/+Jr0TQfhrcHT/tOpIBZH/l7kUFx6fvGBb9c1vQfCq6uf7O+0eHbl/MwX+w3JTf8A75jI3e+f8a87+1aV1olqun+H+uvTto1lVTu+m1/7vn5r8Pl4z/wm9yVnU+F/CBW5AFyv9mRlbgCYXAE434lAuAJx5gb98BL9/wCav2f/AOCUH7cvwR/Zo+Nnw+8F/ta/sq/sjfF/9mDxx448v4l2X7RH7Nnwr8a+IfB2kXmpeH9A8UfFTwl8SfFPgPxB4y0rxR8HfDPh3UdWs/hjos934b+JMl7rHho6aPjXqp8Zz/mDdeAPEVlc+a6WpuP+fJo0MX/fojZ35wv64rsfC3gSS2u313R72fT7bSVSPX9Nkmkjvb5I9Ou9HSPTwrK+xNJv7/S1VOBp17d2QAtbmaJ/RWY05WTjHWy2j15fJd+vrvq08qqd397/ALv/AAOnba2n6O/8FZ/2yvgj+0P8cfHvgf8AZU/ZR/ZK+FP7LXgLxvcD4Oyfs9fsz/C74Z+IfGkehXvxF0bw38SfH/xF0n4F+GPG2pjxVeeI/DNpqfwPvL67+HjQaNpvhC50af4uaSvjyH8UJvGMVmFjPhbwUQr+YippsbhZBxvVfLGH6fMOcAc8ce7+NPh/4qu9Yl1630W7vLfUrG20yBJI2lSPTrG0isLKwRXDKtlaWMMFla2qgQW9pDFbRRrBGiLxg8B3Tf8AITsLrp1lVn/9CyOPT+tLMcxo5Ry89ODvbRwi97a6xvd3ep59rtLbVL8Tlv8AhZmqeY0v/CM+A/Ne4lu3k/sDxL5j3U/+vuWf7dua4m/5azEmST+Nmql/wsO62un9geBNkmRIn9nxbXB+8HXZhs4OdwOcc1sXnwov0b7Wlhcrbk5KKhCZ7cAYA9hWNc+DorPPmXNyfc2ZPr6rn/P0z5/9q0XbZ3tdNW3cbq+t7K336PTT0P7Kq217L8o9rW6d9beZbT4t6rEsax6X4cjWL/VKnnosf/XMKQE/4DipZfjFrk9othPY6DNYrN9oWzlkupLRbj/nutu7GETf9NQgf/arrvCPwfh8fXGhWvhj4k/DmHxBrFuNQj8Ja3qWpac39qA4bRTqMyfMhGCIBchFOQQ2Qap/Ev8AZ/8Ai18J4vD58b+EbzS/+Es0FPFWg3g1exv7SHw3tl/0XUX0cyRLroIRZVlk88ko0cbgu0XclHR8sej2T7ffsvuPN5I7cse1rL+ui+4w4fjT4htoxDbwaPBEsP2dYoZ7yKNbf/ngESVVEP8A0yA2f7NQp8YdajZ2jsdBRpG3yMjXKtI/95yHBdv9psn3rh7TQNQkOXnnbp1kkPp7/wCfXHNdpZ+FJm+8C/8AvDPt3BwfxzntVfX6KduSHT7MP7n930/ref7LvryLp3/udn6fiaQ+MficGMiw0MGL/VENcAx/9cyJPk/4Div2f/4JR/8ABRrwB+zp8evAfw//AGp/gV+zf8c/2bPiB4l0zR/ihdfHz4F/Dnxd4v8AA2ieIL/RvD+u/EDwj8UNb8M634503W/DGieG9U1PS/g/pmp3Hw/uriTV/DUelxfF/VrjxbX59fDD9mKx+JOi+KLy6+Lfw+8DX2maUNc0qDVNZ1q7+1W/93bKzbo/9nle1eceHPhtqnh3xlY3aaoJbO5hu7e5vNOmaKS4t9Q0+60m/gnlhZXlgvtKv73TLuKQslzp97d2c6vbXE0Tv+0qb3S1t0jfXl7Jd/6erl5RGS96nF3tq43e0V1v3v8AefsR/wAFQP2ufB37Y/xv+IOg/su/s6fsyfCT9mHwp8QoNJ+BLfBP4C/DT4e698Zr34fz/EGK1+Kmu/FDTPBmg+PUn8eyeJfDemX3wguruHwDrM1joPw9ltZPjHpVl4kX8tNPt/Eemm1c3EmnNfQ/Z71rWya2a8t/+eF0YQhuIemY5S6f7Pp+q37LH7Jmo/FT4b+GfF0lnEJX08+G31hreNrZ91qti0bTFDlDZRx2ZQttNqi2+PKVUH1LN/wTm1/xal/a6QlrL4gt/wDUBYL/APs6H08qIR+VH/wEL1r4XNc4cc5UIzlGKT0Uml0WystUuq9HayPu8q4JyieTe0nUTnZNN2bulHr6676312Z+BaaBHq1ybCW30+eTy/J3S6LbSMYv+eeXgJ8vJ+5nb7da4+/sNa0q+1q+luPDeg29zD9nuf7YtrS21i4t/wDnhNPo6faJYen7uR2T/Zr9O7X9mjxp8Wvij4j+Hvhnw34k+Gfhf4W6v4s0bxX4pVbWPxj4+8XW/wBj8j4Z+DtSt2j0WSW3/wCEQ1ryPFdtdFo/t1/tnX7TP5nVXX7FkPhyTXp9E+EjWunaZc/2ZJrWo2Frq11rGjd9b027mgkmNwf+fqOTzM4+eqXFdPK0lUam5L4ZWm1eytrdJ6K2t7W7np5Zwf8A2s/3cIKKS2jHVJJu35fnsj8qrfWrEQW6X/irQJ9KtYfs9rp9rZ68LG2g5/cQWixfZ4Ysf8s441T/AGcZr62v/wBub9r+6Sxs3/bR/ac1afVIf7Jhkt/jj8VbuRb3/nuja74qLLPj/loD5nB+bNey2tx8KE0iK8Pjfwncw6zrXlaDHoen6xpUdzF/zyVNSggDJ/sAbOenNeNeOdK+G+t2NxFrPhHU/iTFEp06PxD4Zs1ttV8E6kb3/hNDdjTYY/P8R3R0ICwNxiWb7Di13/Z/krry7N8dX0q4OjVpu7tUo06iSduko2vbd2/RHHmOR5XhW5UMROhUV1zUZulK6t9qm4v8e/mUbn9o79reS3s7PU/2jPj9eWmqyebFbQfGH4iNbiXp5gh/4SIxB/Rghb3rl7j9pb9q6w1Ke4P7Q3x5FxdW32K5nHxd+IIluLLvaTyf8JBvltv+mDlov9npnxvVbTxn4Gi0zW/DOr+IPEtnf358G6npfiI3ou9M1X/n48NpeOzadc56z2Iil9Wr6B8GRfD3xJrXiXwl4gi8QadPp3he/PhDxf40tJfDel/EbxVpQY+OrCKbTgn/AAjp1bH/ABb0IY/sOQNP8ksAc5YLByu5YTDSW7vQpO3XZxb06eSv0OTKMXitf9qxDSWl69R+mvNueR3n7Uf7V1tLHDP8dvjhLbw3X22G9k+K3j15Yr3/AJ+45W17el1/08Kyy/7fWv1G/wCCVn/BXfxz+zj8aPCngr9qLS/h78a/2UPiB8TJdT+LN98evAukeONT8JW3i2f4aeHPF/xI8I/EbW7LWvGlh4y0fw1oHiXxdP8ACPT7628GLdaxrOpx20V/qE90PgHRfh/4f8WSXGp6dLda5ptv/wAhXRdzWc1icZGyDKiL6Ki0eJvgtdeGdEXxFDCtrDHDeW8fkRrCEt9QsW0u/gTy1TZDe6Y8mn3kYwlzYu9pOHt3MZjK5ZW9Hl+Bd21rhKDetl1hvp3+Wx6ma4fMFlDzpY3Fqm1ytLE1ratLZTtv+PR2P0K/4K7/APBWnxp+0Z+0H4+0j9mTwx8Nvgt+z18N/FreF/hTr/wd8D+FfA3xB8aaf4JvfHcKfEXxJ8YrPS9G+ImswfEMrZadrPwQl1CT4Z6lDBY+Cr3TLv4t6Uni2vxQP7Wv7QsFpH9n+J/i6YRTfaI2PxD8ayGKftPGDqq7ZuRmVWV/RjXYeKfh7Ffro+r3B8Q2b3tr9h1Ga4tbTVJLCxNtcWZso5JPMaK1+yXd1am3UrCbe5uIdnlTSK3MXvw4l03R7xtLura9Nx/x+MVR20zGcC3JybfPrGU/LONMxq5blLgp4LB+9JfFhqFldws3+70Sa10VtrPr8xlazV+9/aOP62X1uvq9Lf8ALxL9Fr0uZDftb/tIXUB1GH4l+Mo0/wBjxj4hXn2xqQz6fpVN/wBrP44K0T33jXxbdtB/qWuvE+uXDQZ/55NLfMY/+Abcfz4PTvClnqmpm2tnXT7UnP2e4ASAk4J/cnEZz3+XP61zPifQW0u5+wxKLiX+9IoduoJ+Yjdn8RXqRr5dLltgsJrb/mHorfl68ll0/rZuObK//CjmGn/UZiP7v/Tx+X9belt+1j8ZmSONvGuttHD/AKqNvGPikpF/1zU6kVT/AICBUg/a1+NQadh4414Nc/8AHyw8Z+Kg1x/13I1PMv8A203V8/Jb3E15tuJZLZf7qOyL74ClR+n65pv9m332TzPtE+/Oc+bJnpn+9nGeP0616CwWCaT+p4XVX/3el/8AIHnf2pmf/Qxx/wD4V4j/AOWeS+495l/an+Ls6ss3i3VJlf76y+K/Esiv/vB9QIb8c1Ul/aZ+J87SPN4guZmm/wBa0viPX5Gl/wCuhe9Jf/gRNeHQWmrT3e2zWW4U9FLF1x1+6Sf89a+5vh3+zBodppPgrX/jJrWsaefiXqT+DPAnhrwbeaFrevtqbcL4o1O3isrlZNBTG5biSF5MkiS5kAAFrB4RtL6rhtdP4FLy/u+S+4z+v47/AKDcX/4U1v8A5M8Nb9pv4pv97xHeN/veJfELfzvT6j86/Zb/AIJRf8FLtB/Z2/aB8A+Dv2svgx8BfjP+y9418X6ZpXxVuvj98FfCnxG8VeB59e1j4YeEPE/xM8B/EnVfg54h+IGkT+EdO8PeKtc0z4Kaff2fgGaDV9R8Ox6PafF7WrnxrL4d4q/4JvWWlfDPW/Hvg/xJ/wAJRd+AdVGh/EzwfqljHa/Ej4K3CncH8ZeH9KjbRfEbk9TeCUsPlYsvFfntpfge68H/ABL02MtqUKNa3ti4jlljzY6jpsujajZMUZS1nf6PPNpV5bEmC602aWynR7aRoz6S4dw7aTwuH96yf7mmtHy32i+6/D5eZLiLEWd8XiW0r2deo7tctvtd7O+vTqj+lf8Aay+JHiX/AIKSfH74g6d+yf8ACj9nz9mP9iv4dfEC28P/AAv8cfBr4H+A/AXiz4m3Hw6m+IlrH8TfFeqaP4Q8P/HzxDP48m8Q+GNI1D4N3mtD4Z6tc6Zo3w9n0aT412kHiheu8Hf8Ecm8SaRZS6t+0Z8UbWTVM+TIdEtg6f7reZuGPY/XFfSP7Jnwyl0L4LfDLRLGCOaB/APhVHttRjSaB0urVLG6RoZVeNlubJEs51ZSJrRFgk3QhUH6ZeHraCzjgit7JNcjttbEVtGdf1SyS3ix/q4F8xVhj/2ECr7V+65P4ecN5ZksalehhakmotyqUKMpXfK7e9Fu1+233n4Vm/iPxNHOXSp4nGQprmUYLFVop6qydpryd2lfVJatH5SaJ/wQx03xlq//AAjdh+0x8UVf/n8vtHtpNN6c5SWYxfpj613PhP8A4N8vCOovbPqn7Vvx9snjz/bLjwppyPaf8CEuUz9R/Ov6HP2aPg14z8ceM/Enh7UtIOg+HFtH026uILTTdSj0u7RSxlsddRXeG6OMK1vKsrHABFfRs3wZPhLXfE+n+M/FOlx+aqtoMccuoI3iHcB8t8mcXrL0YTGXBGMkcj5nNco4TjOVONDBKcY87isNRTUW1GL+BdU0tb/f73NlPEPiFJ80pYyUOZr3q9ZrSzau59E0+2u/V/y+eN/+DePwJ4Nt7e+j/a3+Lk0VzF9nvVbw/Ay6ZB/zwtwZCLeHr+6jCJ/s16j4C/4Nw/DHj/WNN8Iat+2b+0BBZ3xa41awfQLH7JaSAZMi2z3S26SYGPMKqc9WAzX7geOE8ReIvF2veFNTtX2W3/Hrb2QZIU9P7bijwk+fS5V/pX0X8AZWvvGkN2dJ0sT6pq0iC6GqXr3AhVSSiuxZ2QYJEZJQnjB5rzpZPwysmco4fCe0s7P6vRevTVxV1fvJJ7X6L2f9cuK3nPs3i8bZpLk+tYiz0S0SqNL1Sb38z+Hz42/8EgNM+D/iqSLQ/wBpH4m+Ib7w/wCJPtEV2miWlhc29x/z3hnWVJYZuP8AWRusnvXzvY/8E8bO68Qw3V38afiFDdapN9o1O4Ecqz6jP08++m88SXc3/TS4aR+fvcV/Sl+114d02Xxb4q1GURSI+veLN3mIjB/s3/Hvu3Kdxg/5ZZ/1X/LPaK+DNO0m9jv1e5tU1Jo/9W0MaylOvKNtYr7Yx/OvUjkvCr5f9mwetv8AmGo9eX+4u/8AV/e9LLM84qlk7m8VjZTvJ80sTX5t7vV1Lr+t9z829e/4JTa54g0K4u/B37RPjOC80QYE3ifT3udNj/3EvJXiTgfwgd64/wDYi/agg/4J3/tdeGvgf+3P+z3+zZ8dP2evGnjLTdY8eeJ/jJ8C/hv8ULuz0bVNZ+HXhjVvjj4M+Lvibwl4l8dabr3gvRvDniG7tP2frCdvBVlqmra14Lh0C0+OOsT+IB/TB4R+El18Q9Ev4NNtrlkNkLjXdHhsLqayh8Pf9BiSz1vWRbmbGf8ASWi3jrv5r8k/+Cwn7DviDwP+zZ4X+N2o2F1DdeEPirpVxofiTRotNvP7f0T4k6Ymiw6Zc30GZbvTpdHjTSXspJXt30yNbBozaqIh6XFXCPDNPJVOlh8HTnZPmhh6MZbR+1GCfXq/nqerwrxXxHWfLWq4mpFu1p16srXstOabtvq7PS9r2Pzo/wCCiX7cWj/tffHXxn8Pf2RfhH+zp+z3+yn8NPHui2nwmuPgd8DvAPgbxP4ms/Bs3xF03wz8Qda8R+G/B3hX48al4r+O82ueG9DtvhGmuaZ4L8D6hpmieBL2xX452SeKj8DjT/igv3fiz4sX6a/rY/le1798IfANraeBvCEmoWUviKddK1LXNb0Oxj8+6t4NZtEsNYVogGOzVrFEs9SDDF9aRrb3QlhUIPXU+HPgzV7TPh7WryFu9lr+imw1L/vqaJJP8fwr8eeAwTVpYPCy2XvYei9tt4H6hFZorNY/GwvZ+7icRHfk7VF/V/n8gW3h34gXv+r+JfiAfTU9UGeM9Bcj8q7XSfhN8UbWWxmtvi34+t5rri5mgvrqKW475nkju1eX0/eFq9di+H2oaTd7beSaZemwu7L3/h3Y/QV7l4W8A6tDaI91a+e0f3GmQSlOn3GkDFfw9R9Kn+zcu/6AMF/4S0P/AJX5L7j0lRzPT/bsb0/5ia393/p56dfn2+Ote+Hfxb0m/k8OXHxs8c3+nTf61rbxP4heOX/rqgv9r++4HNV4fhz8ULa1jlt/jr4xgkhh+zwyQ6prkUkVvjPkRul4rJDj/lkpCZ/h719/+J/hNrZ0C21/w/bGK+iH/E4iuE+a0yPcZT6jHXH0xNA8P6bb2st74rl1NYLPWvKsI7a0kWPUIuvlyqq7Zo/9hwy+g60v7Lyz/oXYH/wkw/8A8r8l9xSp5pp/woY7p/zFV/7v9/z/AB6dPmS2+AvxJi8L+H/EUH7RfjuaK658VHT9d8QxjRh/seTfr5P/AAHb+HFGq/Cr40W1tJ4fl/aP+LF9dTf61bbWNYbSJf8ArpbjUfs78d2Q9PevtPVNO1HQPC9/omlQ/wBjaB4gm/teZIB9qv7myH/LCdo/nmh5H7qQsnXirPhHwtDpltJBfQ3Vxbaj/wAet3cFpZIuf+WUkm5k57IwH8qFleWdMuwH/hJh/L/p35L7g5M0Wv8AaGO7/wC91/7v9/z/AB+7877u/wD2qbHSmbQv2n/i1pcrR+U2n/8ACxvG1vbmL/nmYItbRDH32bNnsK+tv+Cbf/BVb4jfscftJeEvh1+2hoPw/wDjR+zd4w8aWEfxJ1f4++CNB+Iuo+HND1u8+Gmh+I/jL4L+J3iCz8W/EOw1nw74X8OeI/E0H7Pml3dr4HsJtb13UrTSLbVdSluji6/4ajlvf3lvDJ/vwxv2/wBpT14/pXyZ8evCFh9g8JX9h5dnfad4+u2ub21RLe7lbULM6dftJcwhZnN7p5Njdl3JubPNrNvg+Solw9heVylhMM0ld3oUnolFtO8Hdd9/8vMWOx3PzfXcWp3tz/WK3N9/Pf8AE/pGvPgt+1f/AMFz/jJ8TfEf7JsfwR/Yq/4Jq/Czx/a+FfhX8aPhl8ItI8O+O/jJf/DbUfHWl2XxMjbR/DXhv4+61N4pvTZaXqXwiuPENl8MpYrCDwRqFlF8XtHm8ZW333B/wbDR6bpSaNd/8FMf2uPtwTahsmvY9MWM8hVig1g24U8/KBjPBGa/dr9gf4b+Fvgn+xj+yt8LPCSs2h+FvgP8J7LTbiZFVLrVb/wFJJf3xUKEa9vpJ55Ly6wZ7lppHmd2kYt9V/aYQnliOMR/3PLj2f8AfOdv6V+Q5xxDwZG8Vgcu5o8yVsHhviTSv/CWraet3qldnq0pZxTd4ZpmNO1m+TGYmD+zvaoraP8AHtZn8vy/8G0MaTCdP+Ck37YCzib7QJ1fUVlE/wDpv78SDVw4m/4mGofvM7/9OvOf9Jn35x/4NqrcszH/AIKTftfFmk81mJ1Es0v/AD0YnVcmT/bPze9f1B3eobfusyf7p288ehz+GMfyrJvb6NPuAL/u8fyxX5Q+ItXbKMA10/2LD6rS3/Lvzf3eZ7Ec2zbRf2pmPRf77ifJf8/fI/mKg/4NuZbWCO2tv+Cmv7Y9vbRf6q3gutXigj/3IU1pY0/4CorGv/8Ag3g10pcxt/wU5/bSMd7N9ovI21DXSl3P2nuVOtlZ5v8AppKHk7bq/ph1TUoNNi8+71KWxse9zqk+n6YfT78jxnr6GvK7X4wfDnUNFvfFFl8QfB2s+F9MA87XDq1nZaByOjzCU+ImI6H5WHuRXkf281r/AGPl11/1BYZPp/06/rTuevKtnVS3Pm2aT0XxY7Fy/kuveq2Tu9nbd9mfgBa/8EDviJZWMmmWf/BVv9uC002WH7PLp9t4h8SwWMlv/wA8JLSPxAtu8P8A0zaMp/s1xOs/8EDPG99A1te/8FP/ANs28tm+9b3Wo65cQN/vRTa46H6FSO3Sv6CPAvxi+FvxUivYfhp4x0fxHqGlzf2tNpOlTQ3OotZcfuGGrnzGg/6ZsPL9s810l/Klna3uoTOttFpf+uvb8aW2mtj+8spMR6jqD+XTzP8AWOtGXtI5RgFNaqSwWHUr6fa9m2uvV/5d/s80lbmzDHPbfFV3vy33qPe/nv8Ad/Nr4r/4IhftC+FfBeqW3w4/4K9/tZeB7yHTP7fXUfGnjTxp4e8NaNF/1EYdI8SQ2qL/AL6j+VfkD+xz/wAFQv2nv+CeH7ZGl/AD9tvx94Q/ah/Zh8ReLbOy8QeO/ipp3iT4oXB0bWr/AOG+ha78b/hD8TfF3w28SfErWtV8OeFvD/iDxQvwE1O7sPA9lfa/rU1pZ2uqXxvJP6Mf2+P2v/DN34S8cfBTwLfb/DX2b7D8UvEdlOYrjVbPp9k0G7gZZPsvP+oifyufud6/j5/bs0yw8S22ieKbO0mjOl+Prtppok2SM2oWZ06/ZpFActfaeTYXZJ/0mzJtZt8B2V+z+FePxHEd/wC2cqwVPaz+qUE9LdXTvrZPXy0PlOJ8ZjMoSUsZiv8Awoq63sn9pd2r720Pj/SPhvN4nmhg0fR5tVv9W58P6RpkWp6tqFx/1zVEkk6dNo4/I17/AOHf2WfEh1T+ztd0W4D/ANteV/psH9nnyv8Anl86r8g/uY298V+0v/BKv4bjRf8Ahl34x3CfZgfEB1LxB4pv9J0h9G0PTf8AhOPsn2TWJpEMf2X7L/oxgnYw+R+52eXla8y8Hz3PxH+KX7QGm6ld6z46Phv4seLLzwze6Jd3XifTYtJtv+Pawsl16W4jt7G34MFpAEt4v+WcY7fvk/EHD5rD+xqcYRrL7cVGM+n2klLp376s+ZjwpVyj+K5Str77clpZv4r92k1r56s+W/CP7Kljqk+m2NqNJ06aQ5k1GaztUsX/AN4+UEbPuSPyxX0L4K/Yj+GwhvtR8QeM7WVdL/1wt5kw3X73OG985z7dK9Vvvhv4i0exSxgiginSEaQmn33iBmgS96+etu83lrP/ANNFTzOvzdK6Lw98LvH1p4M8VfFO+8IWuk/B7wwnleKfGuv6jpKeEVb/AKGa58a6W7eFn8O9syeHTbjkH0rjnl1bNdKVWpHu4TnG+3VNaf5vU3yrH4d2UqNKTXenGWitbRx/D8D7r/Zs8M/8E+vhVd6M/iiKPxdrEOi+bFe6hYy6paRS/wDPSM3lvOscn+2pDe+M1zXx/wDgn4K+MP7Tmj/Gf4B+Mg/grWfCY0GPSfD/AIVigPhrx59i/wCEL/s34j299bwx/EHwZ/bv+n/2Xraahpv9of6X5H2j95XL/BzRbHx3aLaaHeeDpruOPyUs9G8T6D5ccX/PNItVnRFj/wBgAL7dq+rpfhJ41XT0ns/G/jOKSO91S3jsNBDXNnH4i0C9/tLxvpCa3azbUi0DUf8AiYJbrJstr3/SlVZ/3lfnn/EOsFl3ECzzE4qtWppp8tarKrHdNaVHJbr+rWPbfE2HtZU6b0tpGP8AdWmi8/6ev4wfEL/gnN4u0LUPG8UFxYW2utNZ6toejeINeB1fx3Za3/yMcEfhvTJX+GfhmDwz/wAucafGuCOw/wCWAirl/hh/wSO/aE+Jl+r+MPif8KtIa4/5BreHNR1eway6f8ejWflG25/547P0r9ofCXweXwn4hmvL1z/wkWuQ3lvrr34GtWCQah/x/wAE63HnI8N9/wAvkbgpc4/fK/f6H0H7B4XutJs9HudRgnX7r2dxPbyL/utCysPwPX6V+jZpmsIRUYJR923u2XSNtrdNP61+Rerb7tnoNj+xT4Y8PeEtK8M+DPBOnWfhnwv4b/siysNLtbKy02wvCOZ7OytIIrW1m6fvYIo5PRq/Mj/gqL+zx4W8EfsffGXW4XtLTXzrfwihNnbwQQMYrj48fDy0uIysSKTHPaX15bTIcrLBd3ULgxXEqv8Avv4b+L8ukfD+T7dpdhpekTNvmnu7iNNXlf8AvSXDYuHbjqzlvcda/Ar/AIK1fEqz1f8AZf8AjjpesX9q3inVZPg3L4eltGVbSeX/AIWT8M7vzYgvyiT7X/pO9fmNxmfJk+evluFalSpnbjOpOcXd8s5SlHeHSTa6vp1Z6eaxjHJ1KMVGV4+9FJS1Ub6rXU/h41T4P3HxA+MF3ayz266EieD11MqVW/nLeCI7t20xgDJ88okkZY2UGaTzzukUV+r3gr4MeBfAXw0T4PeBbHTIfHOt+PdO8VeNvEutaldarplx4U8DnOq6bp7yh408RTkkTtFiZl+VvlAA/ODwl4k02x/aS0+LUNYGi+HbXTfCGs6hfNaC+GnQR/D6NmSJiG+zqBIpwmxeenXH374u/bB+D82lfCC2/ZV8AeMb74l+B/Hl74o1WP40ad4Y0r4ZfFXwrqat9vsZPAifE2X4t/FDxJesAb6T4darot3eL8srPkuv3+nXbqfMZVKckuZuTUdE9ekWt93tq/mftXqnhX9h/wCCX7N/7OGt/tXftE+Bf2WvEtj8P7zxD4R8Et4bT4xfEf4keFfGRxoeqL8N/A9tpvxY8OfYMj7DN/bkQtP+WDRGvmn4h/8ABa3wV4Isb3wz4E/Zr1TXfh94jv7KP4W/tHftRar468J+MPG/g/wcqnXNT0v4c+GPhq/gaV75ty36Q/F2SO6UK1xO5YqvxfqP7KP7Qf7aetW/7Tf7YMusxWeu/wBn+FfCfizxxHe+ELmxGj+cNJ+Bnwa8GeHXP2rQ9LSeWPTtR1C2ttOso3cW0cbSSF/qb9n39m7V/wBr3wzq3iz4AaN4u0T4Jfs5Xtx4T8aftPeP/DXh/wCJfxxm1rUR4B/tT4R/sSfs7av9v8C/DGK7N7cC517RdN0WG9TUL9ri4VpJFufmM0x2Tp2jWtboptK+i3TTer26va9j6f2maaXw1Nbf8u4/3b9O39d+9+Jf/BWb4n2OqaHotj+zP8If2e7i38f6xqHjLXbI6f8AGvTtd+GOrj/igfDa+E9ag1D4i+FfiPqxyI7oeIYNSlHORkqN3xv+19+0V8Zv+EMsfiDP8CNDm0LX/A3j7R/iR8Itb8BaP4ouU8LfDq88L+JPCl/4U8e+O9W0Dx1pGr+J/GGiazqul/DRfD1nf6xY2Oo3cEt5awTJ+a//AAUDuvgV8PfiD/ww18PtQ8f/ALJ3wY+FMFp4z+Nuq+N/Dtr4k+IvxH/aH1DT59a8GN8Q/F+iWsmseMtO8LeCnGneFZNf1G9j8N+O1nu9Mjg1GVZ4fcP2Cv21/Fz/AA4ufBXgjwz4W8Z6v4du/G/jDxJ4G8R6NdeFNG+Jfw/l8M6TYfF3XNS8Z6X8JovE2v6lY6OPAvj34Y+Dr+W6Oh61oPiXXdGtYL8TTnk5IWTUU135V+f9dOui0Tdtf62/r5H2lr//AAU1+O1rBf33j34H/sPeIdDk8Lf2lcfFHWfG+tfDjQPEFh9iPgz/AITSTS9I+JdtB8QLT+3f9PPgv4aJoEJv/wDSvs32j568I+NvxN/aL/aT/Z10D4beGdD/AGXdG+M+jeKv7P8AAvxF8JfFrw9aeHfDvw9/6Ixrl98S/iDrY8Y6l/1MdzJc5Ix5gPTyz9r34ifF/wDaa+EXjHQtR+G/hT4ZeFvBvxb1nxT8dPA3gL4g+NdY+IvhrWPBnwksPEWufD/TfCs06+HfGPwK8faFceHf2lfA3j+WG415tctvGfh6zkXUjdLP6D+yD4g/aV/Zah8Z/sd2b/A3x5F8Tfhl4p8Y/s6/Fn4hWXxGtPAHhnQI7DUbu0h+HHiuC/Pib4U+K7a38VaN48Gp+Kv7UubbwXZabmWG1SyWuRyqJP35N2vy3k++62ask/NNWv0UYx5l7q3Wtl3X9fL0PGpNT+HvgT4oWnhvxroPwqg0vWf+EU8zRvhN8Y7TxfdzfafA/wBrufO+JfiTT2+Hfg7z7rN1Ps0W1Etx++k3SfNX078cn/Z3+LP7K/xt1/4RfCjxJ4Ov/hfpXwn1zVde8SfF/wAM351231H44fDzSdRS00ea2bzUv9Kvb3TLwBCtzp93dWU++2nljf5P139i79oD40/Ea6+P+hw63dePfj6nxH+JCeBtJ8C+JJfDmtftBfDq3tLT4xfsh/F/RdV1KLT/AAF4f0W18NfFK3+FY0eOHTtCg8N/Ee20WC2t/A/gpI2fGDx38JrH4N/CjSvhlovinT9Q+Ovwi+HnxP8AFdvrD3HkX3h7UfF2k2+t+DLHxA+DLqfhL4peA77StMtjMx024d/syQys+fk5ZbXWdcItVajpzlarFzajNtXXPBStJO275tmfUwzOk8l4tbhDnppezlypygvdvySteOrV+Vxdtrn8/vx5AHxL8RqAAraV4PdlAwpf/hALY7yBwWySdx5yTzzWf8NNdn07WzjSQNwy225KZ9m5G768/hjm/wDG/wCb4lawW+YtofhAsW5LH/hAbfk5zk+5rzDSLe4fVRa2091ps7Zw8tsUmH+8QBIue2cexPSv2hK1/J+WvurfQ/PVFNL3U3ZW0W/3dz9RvFHwN8Ea/wDD7V/iD8O9U8O+MfGUfiQ6t40dbea3tXsiSTBp7eUAsBJyYkOwnnbmvEP+Fi/GvR5dPS0+IvijV9J1S2+xQadresazf2Elnz/omv2l3dy293an/n3vI5Iv9nivoz9kD4hwaTPB4S1zVN+ia7b/ANjNBc2pltJrvn97JbyK0MkuOjshb3617h8Rv2dL3S7rXo9H0mW7jlm/tfR4xAGS8suf3GzZteD/AKZ8p0yKMzzSnRyZShCMJ7uUEoSdkm7yir3evXe/z8jKsDnVTO3TdG8W0uVxUo2uujur2022W+5+eRsZbi4+029hbxXX/PSKCOPTPr5SoIj+X4A16h4T0WFbj+01iulHHzKWDfmMHgfy6V9LeGPgDrmt6XqF3baJNc6FpWlf25OLC322+l2+MbdXjiQRlO22ZcfnXX+G/g1rd1caVpmh28+sazrmqf2Honhqy00tdXlwDnd9nSMl3xjkqT05NfO5Tx7hpOKlTpy1S96EZa3S3aeva23zPo828P8AEJOSc46N6Nx7NLT1/L5eRTWn9nazYazealf6l4eg0XzdU06GCWWe4l/566TGdwik6/PCobtnufrDwv8ADHx/qXgDwh8U1+HFjoHg/wAQ6+PC2n/bfi14R1D4z6D4p/6CF58AZLZ/GUHhv/p3/tVbbknHAB3tQ/Z1+MPhabToNT8B+NvDmoaXF5WlaT4s0vRU1C0i/wCeeprp26Qxnskg247enZ6V4W8X6TFp0994dvtMsJbf+05bm80gq0ms/wDQEd3iy9vx/wAezZi4+4OlfruVpZwk4JK6TVktdI726Pyta/U/Is0bya6qa9PebfSK6t/hfp00PQ/gz8T9E+GV/pel+N9KviLr/jxu75Wm0y1/69knDwwd/wDVBffvXp/7UvxS8O+I/wBnz4teCLJoYTF/whv2a8hCRzar/wAXA+Hn/HzKgD3I/wBNvf8AWtIP9Luv+fiUN5/qM2k6ppej+GfiJpuk6GIT+5vb+S31SeI/9MprgSvH9FYZ9fXxz4z+HbO0+CviTVG8QabeHT9a8GxXNnaSJ/acsf8AwsC1/dSup86RP9CsvkYlf9EthjEEWz0/7Jkum36cvmuz+9/PzcqzaMmub3k3bXW17bXv69/I+1f+CeGi+F/Bfgn4J+J7yyV9M+IUXiy3vbaSCNrbU7e28cfZLeC/hZTFeRW9r/o0MdwsiQ2/7iNVi+SvZv2uv2bvD3hn4k6p4agsLOXSb6w/4TPwl4gOsX5stZ0r/n2eTJSe14/1LFoh/drwD9lJx4x/Zv8A2cvB9l4j0DTPGmhaL8QvGngTV7HVL+10eC+0nVvidpPjv4d+LDA8cdzq+r+H/C/hDxx8O7O73tZatrbavpiR3kxnP7Y/tD+EE+I/7Jfw0+Ldp4Za81T4cSX3hDxFY2Mq/wCiWXjAqNFsCqfcstPLL9htQBDaFh5CR5r6nheFKUX7WFOV0o3qRjJXdlFXknq5NJLrJpLVnwHFVetTztKnVqwimnywnOMdI3fuxaVurP5Dfit8Pvh5YWmpT2Vjplvrifca61a7+0Jj+5Kx81ex+VhxXwikWlyXm2zlvY04wt7LI6/lISPr/PNfqX+034GvLePVNVttOgnP/PRrdGfj1coWH51+WN69rbXsnnx3cv8AaH/Hr5jO/lf9ctxOzp/Djr6V5WcYXDR5uXD0I+8/hpU11XaJ+h8LZ1LOMmUoznKaa95yk5dL63u/v666ENnpUbzXOsNDE2n3n/H5bNGhgu/+vmEqY7g4yP3qvzX0rH8Sf2cT8FdX8C6X8CoNB/aGl0S+ubj9ovWPHmtaiLqPVHmt9T8PXXwdlL+F7r9nnUPhBPLq97e3FpLrV18R2GrT28mpIky+L6JoepPD9nee3a3/AOeDYMPP/TIjy+/92voGX9n7/hNdL8QeNvhJ4r0bxafCOiWXi5fDXid4fC3xJ8WeGda1A6Z4js4NBuBHot34m8M+NidVtZ/mu7LwEVtYnTT1EVfAyynfRfdf+Tb+ur+f3UJNcr5mtF1fbbfqfnv/AMI7Y+XPL9jl+wahD/ZFvD5f/Ey0S97T37/6yOY/89WIfturiJfBkS3/ANlvp2ms/wDn5tGIOeP40OePrxX1/wD8K9OlHxffa/8A8JJaX8N8ljqsLQXSm31e5/tjfb+IQebjTfGw1TwF/wAK+8dXe8x/2wv9nXa+aM7lv+zl8SfFH7OHjf8Aaq0fQdHHws+G3xg8Bfs5+Oo9F+z202keKvEvw9Hinwl4wc24i8rSfEnjMp4durxAyXsUkdlO0isVXy3lU1re2q6v+71+X4vzPWWaU2krLZXutvh73v0/pafI8vgm7k0rz7EvNPn/AFuSZf8Av4Dv79zjoK6n4QQ3dr4x0zTtWnnvNNGteTvgkkdDF/zzwWK+X6Jjb7VJLqWp6WmrRJ5sUV7/AMeUUbvGlv7QIhCw894wuOnXpq+Ap5Lfxj4ZitzYwRySec8cMcUaPL/z1dECqzn++VLe/auAx5pP7Unfzf8AXRH1unwj0TxNodh4knmu4dS1LRPNgAdhJHKP+Wkb53rJjHzqQ3vW8vwLSF/tmkbEg/5526LHH7/LGqr09vf1r9Iv2dP2Z9b+L/7PXw38U+HG0HQL9I/FcOsXXi3Rdb1TwDdxW3jj7Jbx6Z4/sLafxEsdvaf6LCkc4SK3/cxhY/kP1hpH7A2qX2n40yWG6X/n98JL4k1DTT6/LqCeV3Hau/lj2X3I8/ml3f3s/ELT/Dd9oLb9Bs0t25+aWJVPJHO7A9fbvXuWn+Irb4gW2k6l428M6R4j8V+EvCf/AAr7RLd9Ls4tN8S+Hv8An+8WwTQGLWB76itwB79/0y8S/sN67ZWe59L07dn7xs9e3Zz6mDPT3/8ArfKPxf8Ahf4C/Z9i0K5+K3iybwFZeJr6z8N+EdZ1LSNTubHXP7c58RxSPJGUuU8M/wDLmjl1sT/qBF1rgPRUpXXvPddX3X+S+4/NbX/Cur/8JBZ2WgTahpdpp+t+VYWH/CWa9B4csYuf3VppyXKWFrH/ALEMMa+xHTzTxd8LfEchuYdc0bV7a9vB/pl14pWymubsf9PM1gZZZvT96z9+9fqJN8LPCusyaG2i/Enwhr+l65regR3Emr+NfDuiJct46/5Bfia487TkHg/w7b/8u5H2W3i48rbWdpnwUj8RaPq3iPwJos/xAj0Pxv8A8IRrVl8LrjTNU1Gy1Pr/AGduuGMsejdceNM7f+njkmg9VbL0R+T0PwqvYRmJSP8Ap/1Aebp//kUGOu/0j9m3xR4xlvrfwrpV5rNxo+l6/rmtWOmxtcWugW/gT/kKL4m1zWQBMtx/y8jwvLKJesgbNf0YTf8ABEv9sC98L/Gaw8K/Dbwd4s1r4beD/CWjR+B/F/jZtBnfxzc/DyP43z678L764+GI8JfEnRZ9DlT4b3EniWWeN/EolSUkwTFPxp+Iut/tGWN3J4Z1tk8B6X+z7pWp+BR4J8MavZ3lh8H73Wv+Qy2i3ljOLf4gyat/zE2txcG//wCXszdvJUpXXvPddX3X+S+4Z+f8/wAFb69fVNO0rTbhtYj0r+3EjjjKyaPb8/JqJUBlTp8r4HsK0PBfwnudN8WaXf6hGIYuOCgCflgDv2Ar9udO+CfjPSf2a/hLL4U0H4Ead+0B8Qda8X/E/wCIj+J/ir4YsvEnjb9mHx18N28MfD3wnqeoeLbHXdS0TxbH4rC6t8Hhc3P2jxTqhOqeNYnvlBf40+KHhfSNAvPEK+H1uIdGtNa8q1m1ktLqttF/wnH2Ty7eefdPCgtf9F8uN1X7P+52+V8teqtl6I8lSlde8911fl5+n3eR+OHx1ghg+JXiGOCGOFBpXg9wkKLGgf8A4QG2O4KgVQ2edwGc85yBXi9faMXwd8T/AB3/AGlbD4UeFbzwdpvirxbD4PhtLrx3438KfDjwrprDwHbMYtW17x2s8aIsStnzJpwN6q0BLRTW/ReJPhD+zT8Mr5IPE3i7xt8Xp7SSX7TqXw80i18BfDvVoWlLwp4D8Q+KYL3VPEssSYjM2tWdmJhkvEN21Vyx/lX3LTZfpdenQ9VbL0R8GV3mnz20bbo4Ykb+8kaKfzUA+nHT9BX3V8PfAn7N9/4M+JOs6b4RGp66fD/ivT9IsPHmvXniMafqVuA1teWUfw8/soW1xAADDPCEkjBwjAGuh+Af7Mvwi8VfG/4Q2XxWvZ9B+DPjjxp9j8SeJfC3xA8KXEOk2nP+jCXUrFUjgJP+qBCAYG3AFUeZKbezkrfLt59Lfgvl8Z6RfeHltN18ks7f3rTKt/30oBxjtn9K77Qb5F0qe0TC2tz/AMfNsvFvcf8AXeEfupf+2it+VW774C+L7XxJc+HfAWm6t471GLUhZ33h/wAL+Ftdiun+ILSlv+Ffaf4Tubyz+Iv9gxoEjPia2vkspQXcRxuqI3UfED4FfGn4A61puh/Gb4U/ET4P33iAj+ztI+Ivhq48N3mqjr/pEes6rrcvhPHvHbH8MV5HNL+aX3vpb/gfd5EW7NPa23W3S/n+Gtj0fwhp9lqmkahLJbXEsmnf8fMkqmR5ev8ArXcMz/8AAiev5+dat8O4rjXN1rL9pYDqx3n35OT1568+or2P4X6lqsVrPbQael1e3WftNpJEsiXHr58bBlm9zIGHtX0F4F+GmjNqX2/WbaTVIv7tlGumpjp0jCDP4Z49q855vFX1283/AHfXv+P3Cyuba96WtvtPry+b/q/nb4y0r4OX5stNvZFa2vtc8Rf2No0F+N32XQs/8hbVBIDvl/6bS5b/AGiK9Vs/Als8mna7a6Ve67ZWGtGLTb1odNspL2I/8smlO15Ix/cZivPTmv1tHwp8Ca9Hpi6XB4auNTOgYaLUtN064cg9j58D59ufqa+evit8BfCXwx+EN1cs1nNd2OveE/sVq8EDJafafHH2O4FqhTbbme1/0abylXzbf9xJuj+WnlWbKclGT5ldW5nftbV9P6uLNMsqRXuyktL6Sa6R7enfq/l+Zfjz49+JPBemeIfhFo/h7wPq+j+bLry63q9l/aFzEnxL8AeA1aBLm5R5BH4ONzcjRWDr/Yv2+8+wxw+ZL53zxpPjXxXB4h8T+JtN1OPwdrPiW2NpdaZ4OtT4e0O8tGOTa3VjpAtLS4tyTuMEsbxbuSpya9K8f6Uuo+MdWiC3zRPD4St3jMkpRoJ/h/amaFlJKmKb7DZGWMjZJ9ktg6nyItnSeE/g/r+qWuqX1il3cRXWiedYqdPZktZef3lspQrBJx9+II2erc1+kxyl+62r3s9tr8r/ACaR89/a8MqSU9bJJ8zcua3Itbt2u/etZJN2u0lb59tLTUJZpLmXSGluJsebcSXm+aX/AK6SsTI/P95j69K9K8KWdrbtA9xDdSvbSebbNIWcwS/89YWfJik/24yrc4z3r0L/AIVvqNhL5D6G9pf8/wCjXtsCP++JEI/Dtn2ruNE8A6s3W1z9UB6/56/SvVWTOy91dOi/u/59+v3eZ/rVTb0tr+vL6d32/HXBufiTrd+keka3FJ4ms4r3UtTiXXHfV/E8epaxqv8Abur6hH4uvzcagl9qut/8TnUrtbtZ77VT/aN1JLefvq4fTba0jDrF4X2K8flOEkRA8X/PNgoAaPjOw5Xtiva7X4Va0sFxbebBZ21n/wAeU92F/siL/sMwsPs8vT/lurVd0nwiNakubbQY2v7W31T+w9Vj0vTFfU7G4/vJJq8azRSe6kHij+xn/Kun2V/d8vP8enQWeT0fPPo9JS/u7av+r+dnad4L1WXTH8O3yz21k8flPY3enaZq9o8XTy2tZllhaPP8BQrjt3r6r+GHwyfXNK0/R7P4qaV4O+LGkW3iy+0v4meMdPXxXdad4ctj/o9hYW1+LjxdZeJ4B/qZ7b4KQ3cXPlup5ryPSfB66fc/aZrqTUrP/n702RtKfH/XSAxN+oz29a7u08UQ+GdQ1K7g060lt47qe9jj+zRGNL25P+kXaps2rcz5/f3CgSygfO7Unkzt8K27L+75ef4/dS4sjdK73S3f9z+vu769j+1J+zj8Z/2XNekWDxF8HP2o7XxyQPE+k/DPwV4i8E+BNGH+mAmLxdp+oafrSHPi/RML9oi/48bHLA2sBT85vCXh/wAA3HjjRr/RNXuNc1LT5BLdabquhLoepyy/89JWlhjmeT/bclvU1+iFx8etF17TtXsfEMGjJNJxI9xbWsjP/wAef3zJGxb/AJB1hgtn/jys+c20Gz578Ya74C8S+KZ/EQ0HT9O8RW3Fldv4lvtSv9T/AOu120j3Fx/20kYdvavMeUvXReltPsf8D+t/pVm6aVpNNpdf8P8Al+flfynX/Dumyak87iF5n0XwnM8zxxtI8tz/AMfMrSMpZpJ/+W7El5f4y1VYPBOl6hs+W5bZ9wkltnQfJn7v4Y/PipNcd/7aKb22/wBg+Dfl3Hb/AMiQbvpnH/H3/pXT/j4/ff6z5q9G0ey1TU/+PKN7f/rhmL3/AOWe3P096/Gs3vHOnCLair+6tI7pbKy/A+8yhueTc8m3Jy+Ju8rXWnM9dCz4d8DWvkJbWDi3tov9Xb3QHkRn/YiYeWn1VR07V6Xo3wxEw0tZX0+RcfdkhhdfrtZSP616T4L8E2N/pHn6iniP+3ewk0OyfTfwiZDF168Y9Pf6C8J/CPTLfThqMZttf1ax50vS5L7UbSLxH3/4lsLEJJ7+WpB+vNeVd939/wDXZfcXzz/ml/4E/wDMwvhZ8P8AQdQv/sun2jQWfe5vIkLf99uuefr6/SvS/DvwEi8Rap/aT6dJbDyjpGUgVD9t/wCe+VUfv+/nA78fxen3B8FvgBqnjnUdR1O7+GWi/CfRtKsvtNxp/hjWvHPjvS9L8Pf9BnVtX8Xay8JmH/PxM5c/3s819QxaR8C4vgJ4e+JPhXxNf3Nn8ZPAuhfET4a2/hzS0uPitdeFPHBK6b4x8PeEPFKjRLfxFAR/onhzxIIpkGGgQKQTwc07XvKysr3dk+i/DT08j0E3dK73Wl+lzwX9nv8AZM8N6UE1X4o+I/B3g7wmX8wa34l1ufSZNWX/AKFnS7i5ZG/4SP2jb7R+dfpZ8MtQ+E2geEdZ+Inw58PaT8U7HSofsv8AaHhfS5NL8N+K/EP/AEJ/hfxL4ttrfxMfDPH/ACM1rJ9lwf8AWenlf7RHiL4SeJtO+FnhnwH4M8OfHuTwvoV7BeeA/jN4M8A654Z8IfG/xl/yA/jbPJ4psr+w8U+O7D/lw+HUkc/hW1z/AKOIxXzFp8H7Yf7UHxR0b4GeL/iToPhzxjfeDrCz+H3g3xhLJ4XuIvCXiTwkvjzxP4c+DVjpssa3ugX2kolv8MtH1KODTtNtkWHSLeGJQoXNL+aX3vy8/L8EekoQsnyQ2Tfurt6eS/pHa/Hj/gqP8KPgJ438R+A/FHgiPTvENt4a8Jz6kLFr3xC3hPxfcfDn/hLLiz0rxIElm8QzT+Nf+KamMU8jyw5tH3J8lfg7+014y8S/HQp8WvEXgDwp4jnjbwz4gj+LMtk2ieIE8M6JcfbPDujpNJAmpJpHia6/0q804Ti0vrj99NDLJ81frr/wSb0m8/bx+NvxLuPib+yNp1j4M+BPw/t/E3h/xT478O+KovAPg/4sfCnx38NWsdB1e1+Jl2dM8VXviyDxF40fV4LiOa51CHQC14ssdvlfWP8Agt/+0p+wh4T+HP8AwoT4F6F8L9Y+LfiXwd8ONI8Xt8IvAvhD/hW/wi8PfDjxxZ/EW7tbTxvaabFrOo+JLlvBmtfD8NbTLd/8IvqV54fmSGyu7zTh6GU5bVi7ynO6s2nKV7XTtq36OyPMzXMMP/Y65KVJTfu80YRi1dJLVK6burX7Xumj+fjw3ZeK9X+HngPwv4Q03UbqFdE87xppGjtLDLdS/wDPXU9ctij3kg7vdSyt05r37Wfhf8RNO8Bavp/g5dJ0/WI9N+w7dQu40l0HS/8AoP6exYPYXncXtsYpv+mh4x+hf7EPhP4Y6h/wTuun8Ca94Ml+Nt1dbfiJY6/Z6bZ6r4C8Kf8ACc/ZP7Q024miW719fsn+i7o5JB9n/c8R/LX54623xBvviHqmkXEc1nott4Z+x6fqE9i+qt4stOM22qSSLJ/alvxjybszR+q9cfM+1qZnnnFkaVSpCNFwcIwnJRp2a+CN0oPo+VK1vM+6/shZXkXCVSolKdaN5uSvKaeqU203Pz5r69jz74XeC/B+s+J4tW8XDw/Z6Za2Hizw54ruLKW4i3G2P+jxXjIi+ekH/LFJt4i/gC192fEPT/gZF8IPAmk3Xi3x18Sxpnh28uvEGvaFreqeDY9W0bxl/wAgPTdU0S2ubZL7TrD/AJcLO6iltrX/AJd407+cfB39mL4o/ELUfEdjo2gXcdnr8008tpY6TqmoWtxcXP8Ax8TzW6QvFNNccmaR0Z5efMY1+uvwe/4IZ/tGfExYvGHxYez8G6TfWtnaX83jzX30yTT7HTONPtU8P2cxWC0sCMWUIhWG2PECoa/a+EeKaWWqKxEY19Ir96lV1sk9J83S/wB+2tz8D4v4Xr5jJ/V6lSjee1Kbp6trbka+V9/Lr+H2s/Fu0mu4IPBHhWe68GW2t+TbvpVquh3tvFx+6he0SBoo/wDYjKqOuKi/aV8afFb9qzwh4Y8FQ+CPFza94Z1P/hA7O2awvJNJsdB/6CVpaurW9s3/AE0hjjPvX9inwm/4Ikfsd+AMXHjjxT4v+KN55nmmy0uGy0fRPN5xILIKtoZP9oxhvc196eDvgd+zH8OoWtfCXwK+H0EzNubV/GUlh4gvmYfxNeaja3M5Y+vmZHrmvXzXj3Cx+GnSjfa1OEeqtsvJ7tfdqssp4Dxb5b1K0tFducn/AC7tyv6pX8z/ADdo/wDglv8AtQ/GzxVpf/CN/CXxNqGlCPyi/hqy1vx3H5X/ADzx4Xi0dfL/ANj7o9K+r/Bv/Bs9+3L49uvsb/C/UdE03p5/iK+8O6UvcDm4ljXv39a/0Gdd+MOiaJYqLXWVsdnCDQrX7AFHTCCyEQA+mP5ivmH4n/G8PF9gMY1GX+9ck3LfnLvIP/1ulfA5pxbBNcvu36LT+XfTz7ei1V/v8s4SqNO+rStrrpZdNO1918tD+Rrwz/wa7a/qV68fjv4yfBfwGvhX+zv+Eo061+Ieiare6L/bfgn7R4K/tzGmM5/4SC8/0rNwcXs2bpfNIMlcJ+1X/wAEPvgj+xv+zb4t+OOjfHjwv8R/HfgH/hE/sXg3wj4N8Z3VxefafHHw9s7gNrWpX3nP59peXlrNmTEtveXMDl47iZG+uv2jP2wv2+bP/gpD4c+Gfwl+GHjP4KeHPjjqfhL4eSy/EnwfoOrfs4fHnwv8KvCXjjxb4o+NOs/GjToJPF3i/Ufhd4e1PU00/SfAs+hH4MaV4J0mx+Ld14mbR47CLj/+CjPxX1XU/wBl/wCKPhjUp4rwtrXg2IxQuXQxf8LA+Gf7ooWKmP8A2MbfUdqnKs4k85jGU3KEoqag580Um1a8W2k2tbWTtZmksoayWUre9FtKWil7tk1zav1tZatX7/zx/Crw34e8Q/EDwzoOoeJ28IXt/rfhOKz8RXMBu9Jgiuf+PiODQDmCJJ/+W6pCFl/jDcmv0N/ZM+Anxj+I+pfFPx74D8b67onwk/Z98VXNtrf7Kdpc6p+0N4+8E+MtH8ApqsXjPSf2YdZ+GljqWv8AwK+JN3cGX4AaMksmg+Nb6Lb44heWJlT4N/ZB+Anib9rH9qDxB4C0/wAaax8MtQ0nwtaw+AvGvh+ytPE8N18Yo/h4fE3we+FUWm6iWZb/AMfeN7c+G5fFa/v76DdA0rxzsJPrP9sbwj8TPDngFNX/AGlPiNb/AAk/a58I/DLSfCEHib4efFTwx8Sv+F1/BO4tRYX3wB8e6n8M4dPu4/F/gyzSG207XNYurltNtYYrS0mgjihaP9L5m1dN7aatHwmWU4+9zQjK0W/eUW2mota6+X6pPQ0f2qfjX+zJ8FbbRvC/j+yi+I37WNnJe32q/DX4K+M/CXin9n79ni6sIpZdSm1P4sjSbnU/iP8AEiNoGi+JGtTz3WqeBJMHwFfW0SvKnwr8Ev2i/jho3iDT/FXwD0LwP8G769ibSvAE3hFvjZ4r1zwl4dYMT4e8C+BPEesnwxeXhk27vGGt2MbMpZv7SDcN6N+xN8Wv2cfCPw2vvgx+0D+zd4M+OfwU8YeJ7TU/EPiHwbY2Phj9q74R+I7FStl8T/hF41gsYr3xf4Xs1Zha+DNX1UWluGIhtkyc/wBB/wCzi/w2+DXi1Pix4c074Y/8FMP2Svjtpfh/4Qx22ifDXwFrv7WXhjwFB5x8SfDzWv2Z7LTNO1Pxl43sSLdfij4q+Hl/o/jHwcTK3gf4DoqiGTz/AF2+7T1/Xoepl0IZrdU4R93RWildrZ2S8td/PRH5x/Bn9pL/AIKG2vgbX/Gfiv8AaJ/ZV8T/AAg+HM66R4h0T492Ms/xg065Ibd4H8N6Nfpc/GTxHOPkA8X2/iW4kOWP2tcAHV+EP7bXwz+O/iPxR4d8Z6PoPwu1mCPxB4q8N61458ZWF5qHxEvdTJGt+HPBug2mlSeFfsPhMLu02x8TBbbTAQLaOAhlX+gPxV/wSl/4J6/t3eDD8VP2NPiFpfw3i1PXf+ET034L/EnRtQ+IXhjwt4rygGl6r4Q1W6n+MHwYfmXPgTwNrGi/D0bYz/Z371jFzPwd/Yi+EP7LngZ/gh+2v8L9G+H/AIz8datfz6Z8ex8P9E8Xf8E+vHr63OIda8GX3xQ+DenaH8SPDBv18ybVfGX7WH/Csp9ThjZvOvHMUcvxud8P5NnCfLU1tfR6q/Ltvu/lbbue3kmf5vk0rSpLR6Oy+y1pazejetrbX2Px08R/DK5vpY4YLP8Ati/05/7SupoPDesS6bLaf9B+VP7TaJ/C3X92wa0P93NeQP4B0fUDcvb262zS6L5uj6jLejVLG7l4/eZcyI8mD9/lj619x/8ABQH9lX4z/D39rLWNIvPDP7OPwf8A2ctZ8EeFdD1Lw78NYfHPgB9b+DT+HtFs77QvAHjPwBPY+TeP4/8AE+qatdabpd1aA+EtI+FaT7rLxB44tZPjD4AW3w91bWNe8O+C9VvtK+AnhfXbrRb+x+KmunwJ8evgbLpI8zw3o3xDsPiTcazp3xa0HxKGxfeKPga+iR3DZjuZCVKD88nwBXo3/sidTEavSTc9NLq8pSs12ta3VXP1fJ+P8LiLf2xSpUdFa0IRu7R6KKv0e7fk7nnt54GtVi1RVdVj+0fbP7RUAXH2vH/H19oA837RjpNu8zp81eGfEHwv4W0/wJqUWnNNJqKa14TiSC//AHxSK4/4+I1WbcVjn6zIAFl/5aButfTHiDUdb0iG8TXfDFz4PS4vt+leDPENxp15f3/hof8AMUbV9LeSSRsf8ti5PuO/y18SdUsJPB2qahLcl9S8zwbL5bvufzf+E4+yeaSxLeZ9k/0Xf942/wC4z5Xy1x5LllbKc8Uas5zV7OMpScU9NLO66Lp5HfnWaUs1ySXsYxirNrkio9FbZa7f57WPz/8AiV8dvCfgPw5YeBLD4CfCPXfHdhOureLviLrsvxB1Pxtq1m3guS6MM3hW91STRvhXbif4jz3ZTwU2mRC98GaOWVJNH0+aPzdvjT4KPw2ZfD/wQ0y78c6ToH2C8+JMnj/XvF2j6RqTMqnxvbeCfEb3cNj4nxjGurbLqKHcRdEsQ/hnxvvcfEXVEViIF0Hwp+6BIi/e+AYDN8gO396zq0vH7wqC2SK4bSNdTTb+W7VvLt9Ttms4o0cLFLaOVDWuvopC3ts+1A0F2Jo2CKxUqBt/asx0typ3ttHS9rO2nbdemzPwF7v1ZrSaDdXdtdmCzmTWLNv+Kn00Xzqmr4YspghR9srBjuzh8MSQSeTHB4bhQ2X2idtP/tP/AFHmH+0dvXG3duwfXHOfWsizu7qC51C9trmee8i/1V200j3MfvHPuMqfVXH6Gvpf4Ty6B4e0W6t9e0qx1K88cA/8IjcajoNreT6IDk/8SaW5t5JNNPbNk0IwK8lyla3NLRKyu9dtN+nTTX7j08pjGT96Klq/iSfbucFofgzWtX+xDw34e1O//tQ/ufNjk0/b/uYCY/Dv6gV9UaL4Ek0S6ufDl/4P1bR9Ut/+Qrb69bNHHY8c7df0pGeL/gMw/Guv0251BPI+z+OrDT/sutGK2/sTSl8SfZ4h0jg/tZJPKj/2I9qnPSvs3wjfXGkQ6ZfaLqwvNLXjxpf6lcNceF7o/wDUT8KTM+nXn1urST9K8xttOzeqfX+uy+4+qyqzV5apPW+uib736I5L4S/APTPF3haKwl0Gz1LT7z/j/m1E29sNP558rzlxD/wDaOTXaXX7LuseBE8PXseg6ze/Dbx3e+Ibf4afEu80p7B5vEHg0/8AF0dG8PWTRK3ieLwF/wAyZb+Kw6fEfrbJdYFfpV+yR8KPAnxp1fT5Ljw/OfDWgyXmt+L/AIc2EqpqmtXGif8AIuePItSQBrjwN4m/5fPh+5fS77pNZOa/fHxJ+z7Y/tEeAvE37OfgfwjL46+IF+3hHXZtU1pR4X8F/s5eNNCwnw98SfELWdFEdro1zoDyxSfBf4N+GGHxb1uAPJ438R2se6aL8v8A7fzd5z/Yfsvfvva8rNq2yv8ADvprsz9SeCyFcHf283DSyvyw0vZat+bSS3vsndJ/xW+MfglZyzatcz+HvD66/YHGmnwlfXF7p979U1BRG/T+IEdK8b1X4b6Tp6DVzFMrjGJguHX6PgMMH39/p/aL8Yv+CBvxJ0XwHqesJ8WfBPjTxvYol5pWn6b4H8WW2k+M/G0n3bbxFBbai9v8NvBh76f4QS209QV3QgOu7+dT9qv9kbxz+zx8NJE8fW/iSLxw+teE4vEkUGiXKeFdBiufHH2S4jg1dY1trSOe0/0WZInRZbf9y4aP5a+9yrNv+FdZJNJ1Uk7ys3b3Xo29ut116an5/m3ss2yPnw8YweqcqcVTlpa6vG0r2/pn3X+wN8EPhP8AFD9mb4TH4hfs4eE/idDdzeLNWvPE+sW+p6d4ss7K28cfY7aDXdb+GV/oOpzQwWv+jQx3Ny0cVviGNVj+U/Ves/8ABE/9jD4qXDWmkQ/GP9n3xXquqSRaF4Wsk0f9pPwBbeF1AKfEe9GiyWHxeMcmGA8J3HimKFW27oQjM6fn/wDsceLPgkP2ZPhz4Y8VaRDb6lJF4yt9c1f7Hdarb6tB/wALA/1GpyvDJ9vh5/1d00qZ/hr7E+P/APwUe+Ev7Bnwj8O3ng3WdY+Mfx7+JcaX3wb/AGeNW8R6jei60+6jLad8Z/iHbSTXY0j4UeJZTFa6Yt9BH4l+JUkyz/BxvAmnQ3d7bfdzx9GrpVp06lus4QnZLlu1zJ7LXyu/n8J/YmWf2K5fWanNolL2kua+l7O977t69Hc8Q+Jn/Bvj+0HZ2epXfwyvPA3xr0CMZVfhXqFlpXi9AO6/DTx6bTxIvvjXxx+dflL49/Yc8WfAvx3ZWPjHQfC2ptbweLNWs9F8VXHgy+0HU9Ptv+Pe+n0GzNx4+n1eHgw+CpPEDtFx5dsvf5W/bF/4KJf8FYv2lbvxFB8ffjr8ddK+H1vpT6qPhZouuH4WfDPSrZPCRvLcjwN4CutG0DXYFcC6/wBMsNQdrp3uHFsZZoU8F+BVp8Rvib8P7/QvEHiDQNR+Fevazcy6fBqerajfv4a+JF4hS78caP4XupJbfTPGF3GxW48TWVtDrVwhIkvnViCPCZNmn8OpGDul7lrXuuq0von/AHfuPl44PFZU/wB5iMRPT7dWpLTT+abutetlvrqz0HxZ+zJNNe3V3oOl2Ou2thcfarFfA/ihdS1Wyu8g/abSa+m863nyFPnRMkmR97jNeQWXwx1O3s7fTrTWfEM2n2f/AB62P9pXxs7b/r3tRN5MPYHy0U/Qdf29/Zl/YE+FPjbRtIuvif8AHnxD8KLy/wBVGh2Gn/Db4V2Hi34rapccfPPpdxZtpdy/+1I7tnua+4f2jf8Agif4v1/w98LvDf7HnxCurL4y634U8WR6F4C+OXw7XwVp3xQ0/wCFItP7PHhXxl4csoxceMfFp1vxEdVv/FlwuoaoPDNoLueU2UJi8jNOG8VFWjXrxi+1Sorr3bac3m/wt5+rleZ05fHGMraLmSeqt3T189PkfzB2Pwm0v/oDx/8AgJFyP+/fTH4/jxXUWPwgtfs/2/8As1vK67fIXaO/I2Y6+3vX7R65/wAEQP8AgrVoX2zR/DPwAs9V8I614hGo+DPHY+N37Ndz8Q9J048i08S+Gdd8b/2JLa+sE+6IHqoPA8F/aH/Z++FX7NfiCw8A/Hz42fF/4e/FObTND0rxj4C174fa1o1/8EdP8beNZYdP+IctjpkPwT8JfFDSrSwt7+KG8f7d5FpD8QI0kWHwf4CUZ5XwviJL3qlSV0t5yemndvz+fyPPzPN+Wa5W0rpaNrS8UtFfR3VunY/PGLQLKD/UWksP+i/Yv3SGP/Qv+fT5FH+i/wDTv/qv9irdt8Pv7LtUvUt4YoI9a8JxRokKIiRXP/HxEiKoVY7j/lsigLL/AMtFYV+pfgv4bfA/4zeOvA3hXwJb/FH4jeBvF3jj4laPqXxL+Fn7NnxR0L4fabpN5ZnX9S8VeDfFWt+B7XxDq/we8FeK1PhHSPEviuRPF2i6eRY2i21q6Rti3Tfsw/Fz9k748fEn4ZaNq3ws8d/CO7+ENjdeB/Gd3qevy6lpdx8ZPh58NbjX9K1e7EzreXFxe3qT3sMnnyi7ukeRhPKH9XK+Fqzd5SlKzT96TaVrd/RefzPRzPNoxUUvdbS+Gyb+G21r9V9/z/b7/gkv4M+Gfiv9jT4I+GdT0W2utWvpvFlxezq1vp2n3lxb+OPiHaW810oVI7iWC1sbK2hllDPFb2lrCjCKCJU/Tj9qrw4P2Yf2Sv2gP2gvDK3GsR/DL4f6JrWgXNvqUuieG38SaCQNB1TWPEnhySLxNP4ctyf+LpJPI1trAydZFwAcfzp/se/FrVPBf7HnwVtPC7a1c3Wn/wDCZf8ACUW0Nvarq0H/ABcC5yNGlRhPbf8AH7ef8e7J/wAfd1/z3l3/AKX/AAI/aD8T/E3wt4w+EGsQ3Pijw58SNJ174ZfE3S7uabU9Kk8JfHUMviyS2066eaze00xWZHhMDQhWZWTBNfz3mXFVLKuOeLaVblnCnJRgpWlGnfljaEZJqCvbWNur1R/TWXcJVM14G4SqUFGE6kU6kkmnUWjanKNnJ8vw897Xvsd5/wAEtfhD+wp+27+wz8Jvh/4NutDvPif4e+BfhDwV8ffhgPHmsXfjrwh448H+Hb3QX8XSeEftnh/RvBOufETRdTufGXiP4tfB23h1nxRrOryanf61qWpXd1NXwdb+Dvib8VblP2cP2Y/EEfgr4T/CH4i/Ev8AZ41/9qL9pD4lfDNPFHxFk+Hg+IX226+DmmzQy+MvFFh/oVmH8e698E5GzZ23+mYt4tvqPxx8d/Dr4X/8EvfAll8ZvCXw58TftN/8E9tB+Kf7HXi79onw5qEPwo+O3gTWPgK9lZfsyfC/wN418MRWHj+58D/tEfBy98LyeJL7SdZj0Xxfotj4vg1RNQt7zUIq/kptn+PfxqttVn0WfxI3h7RrnWdCOmeFtT1Oym8FaH4j+0nxDoxisbiNfEuk699tvf7Z04iaz1P7XdfbYZ/tEu/9by3IsnzpxqKom3y1F1SbUZWs72Td1a2lrM/EsdxDnPCDnCpGcYOU6bbbTcVLkbTstNHZ7Naq6aZ9Y+I/2f8A47/GP4h/tFeDtI1b/hYb/siXuoah4l0LUJ7jW9G0fwF4c8babb6HN4U0C9e4+L/iHxj4gsvDGpwaje2Xwxk1G6tNVuI7mR4b5xL9b/D5PhJ8MbvwppGh+FD4j8QfD/xAfjPf62NNt7Hxe3hH/hVt54F/4QWTWBCuqNff2t4v0S6+wtclBdWNjMIvNtYGj+yv2OfDnwY/Zl/YxvNV+BPxcj+PPiD9p298EeG9Qg+J3hLTvEWlfCKS0k1W48anxj8BdETT/HtofgJejx3qEiXGopF8QLzxF4dmijkH2VU+KfjR8TPCXgL46eIvi34Y8La3Ytr+szeKfgh4E8cQWEsGsaL4f1Gz0v8AZ/8AF3xQ0uzWSDXdP8arp+n/ALTHxc8D6zBdWvinwLY2nw6161v9Ptre1T1cqy/OM0fFsaNBRhR5VT5Y25EuVXp2S5b2bSVrprfrNXMcmyiPCdTL67xsqylKsq0nW53JOTU1Ny57ba3V10ukfLXxy8Jv4g+LmkeFdNsZZtS+GejWer65qQi0w+HLzx9rlj/aniNryI/6NPqXhnwUP7Ks7qZXubHx9/pcMkeo/vKs+HdG0/V7rXfAGp6v4b8QaJ4j8H6e2n3Orx3Oppb+JNJ/5BWuW32xJ1i1jTP+XDUo9t9ZD/j2mi77vhv4OeK9S8JarpemaA/jDV/F3xY8VR6t4yt7n/hM/HPizxP4Vs7N/EfhQ+E/Ax0nRPDPh7Vvi1rfiOy1TxViGC/1DwzaS3c0txYwtH6Bdav8Dvgf4Z8Paf4on1OP46RWd5cfaNd1fWGXUX8Zf8gPwL4Y+BOmSSaxazWH/Lj4x8UarA9rx5FwleZmmWVoJe/NNLWzktUk+62b/M9PhTMKNSs84lTpuk5NckoRdNNtLSNrd9LW/T5q1Dw5B8FvEes2fi+TT9U0+20L+z7LWdEii0e61jxx/wBE68U3VsIpdUvf+px1B55+32n0+gvjX4c05fgzcvbLZ2by+IvCejaOz3iak93oNz/x8atljIXkuCP305JeT+NmrgH0LUPi3eeL7Hx14UtdS07U5/7KhmtDDOE0b/oNJuVgs57XS/vPR89PJ7O41XR/h146+GXiy+QeKfhx4k8GW2lG7lMt3J4P/wCE4+yfaopZS0qw/ZP9GwrKn2f9zjyvlrzcnSulazfl5P8AG/5H0+ZtZZkHF0aqUqcUpUoTs40+azXJGScYatL3UlqfHfiPV7S18aN4Za8k8OaW+i+E5ZBBK9xC8tz4H+13MjRxsI2knu/9KndgWluP38haX5zqaN4U0XWortLrxXN4X0nWuviO3SSaGT136JGQj/8AAojx35r5/wDivqB0v4i6jeRM0MKaD4N2RxExxof+Ff8AARFKqvsAAOcg1r+Dfifd2lwlvDd6fcQ6o/hdDu0+KTVNGaU4uhp9x5ZltPOP+vNs6CXIL54J9HN8qnKzm+dx195c1vha0k35dLHwWTSTyVSb96SVnf3reUt9F2PXrj4c+FYdaGqQ3cSuOfsN+Ekg4z/yxlDRj1+7jnH15vV/g/5OoajLcSnUZE0Xzkkg+d0lwT5ivyVk5PzjDdeeapS6tZ/2lqV/qF295HH/AKsXcrXCp1+6JmcKcjnHqa+7P2OP2dvjb+2jq/xSsfgppWgag/w4+FHjT4oeJH1vxdoHwukudH8PWq674Ui0weOtO1Ei117xW3/CJTIjpbz6fusp3FkrKPmo184ukqOisruKSW3W9lou+uvbT1vY5Ry3+sSvZP4nvaPn/Xnf3vhr4UfssfFb9ozxvF4U+E3hix8VahdxeI/FF9akeFfCttY6H4JUJqvixNZ1traODTpRueXwXEVid2BktmIjaP6k+Cn7Ef7OHj2T4mXvxK/bp/Z0+DuleCI44/BieI9b8KePPHfxYkhm3yy+BfAfw68d2WheDWkRjE6fGf8AtNEPluUO1lf9CtV/YC+Dnwv+AXiH4s+NdL8bftMaP4m8R6JqnwG0j4XtceCPAesaj8bCtv4n+G/xv+OM8dloHin4gaVcL5Sj4N/FLQ/ByX52S3DeKi3wKPlnjz4IfDL4ffFL4pa/+0D+zD8ePhdrPjC+8D+I/AqeCPEWqeH9B+F3gHxPp9v4R8A/ESLTZfhnZt+0BpcWt3Ud9H4V+HEGj2PxN1JbiX43x/Ba8s7ryfrssq1JxlzVJTt7qeuytZtNt3to31sk5T3PlHCCbslve9lrrff5Gfr/AMJ/hh/wTo+N3w28XeHPgAPjZ+z58ZPghe/Fbwzqn7XPwO+HPjLxNpfhDSfiJP4U1P4j+KPh3o3jDxBc+F5fht4S8nXbjwy9paw/E65eOW/hvVljng/TvX/HXw28JCP48/sUeBNA+OXg65u9A0g/F3T/AAd4Z0j4ffDrVNL+FjWOi6F8G9LhtE1v4HeEPFmpEfGXUvhP8Vre5+JWpSoPAF3r80xaBv2J8H6T8Dv2ef2e/jn8dx8YvF/7Tt78Sfgk118ev2m9Vj+EdnYaP4e1nwFqb+B/gb8PtL0uzuDrHxd8PHU/BD+H/hl8IF8L+EdMOt20lja6dIWhk/m//wCCXHw78I6Z8b9V+A/w1X4t+Jb/AOJfwm+Imtav4S8P61eabafGDSPCWpWWueGv2VdK0TVL2PwVqmueH9dv/C+u6J8UfG0b/wBi6xYeMtQ0u4s57i6Y+b7ab09pVU1K11OTUo3v391xstbt2bVklY7lCGvuQtr9lK23f/JbX839sx/FLRPDPwe+MS/D3Tf2bvgh4p/ap8T+EdC+M/xE+I9jdaT4S13xt4A+Hd54X8Ta1p2iaZYxWvhXRP2qPFGi+Hda8FlIoI/h7rHie81C0NreX080n8/fxg/Zr+Nfw58eaX4x8eJ8NF0D+1P7DLeG/GEniCAXGOX2wzSpvPdiN3vX6k/8FcP2ovhl8APA/wAWP2ZPCGp6H8a/ih8SbvxJ4A1Xxpo/w3vfD3wz/ZS+GsF3bSQfA6wh8a3mvWP7R37TfjZPDPhTUPGX7SXjO31jxt+zfPfmD4Ua7pt1dAr+VWjeAfA3hn4W6F4v074n/FW7j1HQPg/4wt5PGfiv4R3fw6kl8VuR4y0uCxj+JJ11PFOljwP8dnWeSwi1OJfh74bEgibxbEkv3mT1ardNyqTd3D4pyfbV3fp/Vj5XN6dNRny04J8stoRXTTZf1stj+yL4A+BNB1H4J+AJ30fVLTX4/BPg3Vk8YRX0kXh1LL/hB/tfkJoKOtssH2v/AEryhDs+0fvseZ8x+rF0qa1uNNsZvD8DyyJ/Zzs8sbM+pf8AP45bJa79bg5l6fP1r5/+CfhPx7N8Lvhj4b0rU/tLv8I/hEj3k1s+m6a6XPw//wBIR0/dwss/PnAgiX/lpur3Lwfpeq+JNWhuvEfxW8A+HbPTLj/hHZtZaDWb6yaP/oaGkaNkOq+mpk/avWev6P8A7Wp+yUZJOCgvdaurJR+zquu1uv3fy9PLJzrOTlJyc9JNtyV5R6t36/i/n+oPgbw3ovwe/Z4ufDNzq1haX9rqH/FUaN8NdSGpXWseJzg/2bb63O6zTEkDMTyEgjBXivL/ABT8XfHvxYuV1W7NnZt4b5tZtNcwzXZ6k6JNGwliY9Wa3cMxyWJPNcj4nh+Fnw6+Eb+E/B/jTVvHfiXVdR/tgZ8O6fqFhq+sf9BTTYpI5Y/Bmo/9P1qLS6/6a9DXRfCLwxdeNrb/AIo7TvCVh4T8PaB4U022u9W1HWtL1O71G5ybi70O4ZY5Ybqf/ltcW7JLKfvu2K/O5U4Oc87nGMqd2nGUIqDb5U7Ra2aSSbu+VRTbtdff06k1COSxlKNW0feU5KfR2ck0+r001V7anbadoWtarba54uk0++bWv+Yzqun+ZHFqfX/kIzxENe5/6eXk9hX0d8HNJ0DRtQ1qa60u8tNdW4bWmWOPytN0O1YbWjsIlAisYmXIKW6xqQSCMZr2b4ZeF7DSPCUXhqaRNUEs/wDaeuz7BY6atq4GLaSIBYniIU5hKmMgEkBVJHwX+2j/AMFM/wBjX9hjwlqll8QPiJo2v+PPElqYdJ8DeDbyPX/EWpQtjEE+qwCW6kh2Zys9wWU7ozAoJJ/OM14qor3YxjGF/hikk02tHFJLfolo9ep+j5VwkrqUoqU7JtuN5JaauTTa0u229X3sj8pv2nNDshd6vqmputlpMkk0rzagAyvLc/8AHxI3mghpJ/8Alu5G6XHzlua/NLVL28h8L+Idfv8A4n/C/wCEHw40JP7K1TVrLVNX174ka740/wCibeFbeEtqkVzz/wAjfaMsvOPtHWvBf2k/2/Pin+0Umq+KdX8N6l4F+GH2/wD4Q37H4eNoyHVP+EH+1/aDBqDxxC6+1/6V52zzftH74v5vzD85Pg5+238N/iJ4i0nwrd6pqnhr4l30ufh7441TSNPj0ex0/p/wgM97IuYvGvX/AIr5ZV1L/p9713OrPNUnSnOOid4Scf5H9lpf11ubqnCK9nGEFG9uVRSj22sl0Ps5/wBnD9oLxD8OtX+NPinW7Dwj8N73Tv7H0u18ZfF+80i98daP/wBArwRcadqq+LvGem9vsPixZ7bH/LLmvlT9of46/HPxf8OIvAOteKPi+vwd0nx14BSa08b/ABF8XeKfBkSabxpy+HfAWr6teaHZLYf8uQs9PjFr/wAsPL5rufEXxZ/Zp+Dmq3ev/F/WF+JHjpE/4SrRNXOnw+L7jSrz/oXdM0m+jvZbGw6/6BarFB/0yNfJvxt+KPxn+K1t4c8Sw/Dw/C/4I2fjeHSbC41dvN1rUL22/wCPeeWdsSzTwdIZXZnjz+7Za9WdatUhyVK1WcbW5Z1Jyjtb4ZSaHTydU2nTioap+4lH+X+X+t/O37p/AD9l34S/Eb4aeG/HPgCyufBHijWPhz4T1HWr7T7lUhi1a5/4+NCkltPLY2twf9dZuxil/jjavYfHH7M+nzaJPcyeHdA8b65qHh86db6trsFhpWp6JqX/AD9399psRukuuSPPaUTf7fov7COny+BvA/gpZ7O6uvCt14L8G3l1Z2e5dNubv/n6ns0xazXHT9/JG0vU7zmv0UvvDXws0m4j8Q+GYdWstIRt/jHQyXhk15uzJbpsS7b/AGpUkPFfjWaYitlGd8s61Vw1ai6knHo/hvZ66Wtbr2P3zKcPRlkkHKlSlNpLmdODl0XxNXPwI8EfAfSSviK18by3mmXMGteVDNIzrLFFnHlxOxDxx/7CELgdK+yfB/wBsfEuk+LP7AufBl5qa/8AIA8M7pHlm/65a1s3L3+5IOK/VDXv2OfBPxK07VvE3gLUvAHinSvED+bc6XqmoDR/EOmS/wDPW3klVLmCT/bjZWPrX5x/tI+MNS/YD1X4BXWt6Fokfgbxn8R/FfhDxEkkmvWulPpVt4H+12/hy81nQoxD4Qu4LvN1D438y3miuP30d0svzV6uWZu84soSkktG1JptaJ637fj0PNzRRyeLcoRel0nFO9lFrdW9bbafLktH+Fl6P7b8O3+n/a5rDw//AGd4m+1aPHOdU1Lvd2nmwv5l1/08fNN/t8DHz/4w/Z/8V2uoS2dtZeIovDi3X9uaDdXs94yS2/TbEXcqFH91cDk8dM/aPjP/AIKUfsgeI9DTU9Q+GfxF+GAsW3XfjfwH8Uf7bu53/vzWNxqKTSN23SbjyT9fPvgV/wAFGvgD8U7e3+H3xe8W2Vlr2i3/APwjnwo1vx9bxeCPCXxKP/CD/axFqnxM8Lqnwu0NPtebnZJoqL9o/f48z5h9JLLq9GzympUxO0nzzlP+W+7e39W6/E5ZxTRzzm/tSMcLbmS5Eqe1kn7qV7p6/rsviay8D6naadpK6xa3Fjqia7/wjyxDUJInXw1/0EFxIGA/2gcfhXR+IPAWqaH4PS/knufJ8O635Vmplk26hF/zymG7E0eM/I+5eelN06TUvF/7TXh3wV45sLPwz4s1SLWIIfg5afEzR/iLcpDq2f8AhX8S+I/AlnpXhMRax/AgnCydgc1+6GufsFeM9c+G+hJq/hiHTPE+rP4gmT4b3R0e+8c6XJqeDrUupWujCXw/v8JDB0ySQ7tM/wCXUw19NGKtFNK9krWW+l/xPl5Z005WnKye/NK3S3Xrf8fu/mE1LS7691PUpEtVGnJ9ycRqAmOflYDC9+nt9a+Yv2hdA07TvB3huXMayTePPCfnSBVDy/af+PjzGwGfz+s4YnzcfvN1f1Ea1/wSe8WeH9IfV/ih8TPhh8HvD0gy9/4jvcSv/vaFpfyN/wACiP6g1+SX/BST4Tfss/Cn4H6T4d+FOs+OfiL8Rf8Aha/g2LX/AIh+N9MtvDfheziz/qtB0ewAt7OPP8FrHGo9K+mq5XJ5BVmm3NU5e912d1zW3undKTcbq6V0fCQ4rjLPYUuZqEpRjy3aj7zinpe3V69fM/tW+Bvx+8A+HP2evglFq+sy2kdn8J/A72kcFu1+lq1v4ABt2tlUOIDDtHleUF8vAC4FQeKP24Ph1oed2meLrr/ry0W0HXgf6tOncf5x/PF+z9+1beavpXw++C/h/wAf2MPiKD4b+Db6HVvEGnaZY6FDqn/Cv/8AkARJPtgjsx/z5ooh/wCmYJr6S8Qx/Hg2FtrN5c6HPp1xovm6V4ZQJoup30v/AD0bXtB2TSPn+Npi3TB6V/mhnl/a1Vd/HNaN9/zP7Pyjw5y6pCEp4ibvGMmnOTWqT7vXe1z9Xdf/AG5fBJ8Df8JhoVmdetsf8gJP7TsfEH5qqXH4Z4HvX5h+PP2vv2gdb8S+K9Z0/wAVeNPDdprP/IG0eJ57Kw0/v/oNlDcR29qfeCOM5+leaC7+NOqXmk3l54xv9HtdMxvvfDXgXxHcyaV/2E5dR1NH8ae32prvp26VxMmkeOfEMviSLVLi+ggP/Ik3uqan4Ellh4zi+mn0xn78bm/CvKyirUy1/v6lSotP4k5S0dv529r6/O1z2HwPkyX8RaLf0t39P6sjE+I/x5+OHxM0uW28Zav418Q29nCdJsIGieCHUL3/AJ7yxSzFJp+MmRwz8Dmsv4e/s7ftBfE7Qrn4vWWj+B/g58LtZt10sfFz406hL4S0fV7pywS5062t/J8UmVijhZljLMUYB/lOPsDwz8d/2Mvg34V0+98ZeA7/AOO/jqXUsXY8QfEXR7DSm8U/9A7w94btYWsLId/Lt9NbkdOePkj4+/GL9q/xzb2vxo8dR60fgifiRqDeD/hx8Qrj4ceKPEHg3wz4p8biy8P6n4p0/wDs6/8A+EH/AOFd2gW08YyeDYrcwWwEFywiG2v2HKqNGWSe1dKlObcnzOnGUls0uaUbu/k2j80zdyoVOTKITqRUlHnk4SjJN2fIlOc9LK/PGO6tuz2qy8H6B8INK8QHwRF498U6vrT/ANleIP2pfA19pep2egSf9AK38EXtxvtX/wCqcxxJ8XOP+RmxXm/xN+PPxDvfBOsfDqx8aaz4/sG8R/2boWp6hDF4Rmvte/5+fEE2jSRPe+FOf+PW7aWyx/yz5r5E8SftIeDdL0rU9PuF0H4WN8VB/YGmSaX4G1+51vxd4b/6CNtdWl4t14W6ffjkgHvXoXhrwh8Hvhz4N1X4h+Nv2qv2dvG6NoGzXrH4Z+LfGGrJ4VX+78PPC965h+Iy9seJbecD0rysrePzaa5cFRUVJc37mnZRi43Xw6uytYvM45dlMfexVVzcVa9WXxNR03019La+RwHxO/Zo/aC8AeFrL4i/FbTtXf4b61/wimzx1Y+IPht/wrbWPtH/AB8f2YRYf2w3n/8ALfy4iJeA+6vz4/ar+H6R/s9TeKxpthZadqfxX8JwwXd1Peh0iuf+PmJJGGVjuP8AluisFl/5aButfo18Rv2mPFX7UPibwL8NNC0S71T4QfABJfFWgCBbDT5NZvPDY/4pTw74k8LqyQahYa/kebYXttLb3P8AHE9Uv+CivgHxV4b/AOCYPhrVPGcOh6H4u1z46fCGK40pLm8tj4ViuP8Aj4iu41C/Zo7j/lsgCLKeZA2a/Rso4nw+J4xjkHD9Ok5JJTVOEY6pK/wpa6PSz11e5yT4CxWN4OfEGe1KlOKd4uUpPS6cWm297v0Z0v8AwT6l+J3jT/gmB8JPBHwT+FnwZ0CY3HxVsvGXxN+LUel+OtW+KGv6X8QfiMbDR4vhhrdne+G9GitBaWItbWeHyLVdPsvssULQAnzvxv8A8Eg/+Cldjeat47+A/wAX/BGu2Gt+VYa34Z+C+vfD7wj/AGjqniQf8VXe2NnZ2GnRveaB/wAsblYzNbcbHWvye/Z1/wCCp/jr9jn9nj4UfD34NweEvE+o6z4s8cap8VPBnxR8Bad4v8JpqVz8TviZ4fuL/wAK3q2V/rtpfT+Ff+KunurSNJ5b7OoSSG4zLX7tfBz/AIK8/tT3vhu+8beLf2c/2YNCg+E0tteeKNF8NT+NNIm8EReLogV8DeOdYsdQKT/tGfFyUulp4f8AD0k+hfDpESVo7BnaFffjw1nuQ5//AG5lVFYilouWcVOPRfA7pfdq/Vng1M3WcZGsoi28Qnf2t26r1Ts5v39d7N91olr+WXxb/Yf/AOCl/wADNPXxV8f7Txt4Q+HPgTTDf3nxg+IGv6GbWa7axHiNbnxJb6B8IrqTUJ18UkeEEuNSkuZzp4GnmZoD5Z+ab39o39qvwF4j8VaUnhv4YaBPr+if8Izro+J/w48d+AdZ1rw3/wBC/q3w58KzQeE9S0T/AKhV5aTWH/Tv6/sH+1J/wXp+E/xm+Gsn7N2tfsn/ABa8MaF4s+JfgfxH4s8P/Cz4naL8S9V+Kfhjwp4qPjTxL8KooLqzuG0XTNY8Vj+1tV1xwLTUPAAFncebp58o/lt8eP2rPgBrup2twvxU/ahsvGGv6UfEWoeHPF3w/wBO+LF74b14FVPwsvNe8MtYTq2WGPEomMhXLB9qsR+k5NnmaVtM3w8MNdJXpwVO+yWyjb19DxfZwhFpRjGy6RSd7W18/wAT5O8NfED4KfDvw5q2na98B5/GPiPw7AdQ0f4++IPj18Qfg5qHxDs5JCI/F3i74N+KtU1nw94BswGVE8GeHLZAThTA7Dc32X4b/a6+MujaFo+ifAb9tbxx4H8UapqGu6vq/wCz18TfiDq3hrU5NW8U7j4m1P4b2/xK+FmteD9e1HxESx1298RKLnVyzf2hLcAmvl/4YaM37WPi7UPhR8CtD8PfGr4kad4c8X/FjSPAF/8ACux8L+LfENhZbDDq2lWmvXMXh19btvMQ2/hGIl0yfKhyDjyXUv2WP2svFXgHSPihafs4/FnWfhh8QviD/wAK3+HWsW/h7T5vCfjn4ojX7TQf+ES0DMJ12SP/AITzwfrfhkWPimPy/s99e2PlhLm4hb7jLaVKrG1SnTqJvRVIRmnrJ7NPofDf2pDK21WSk29ee2l+VK3MvPdOyTbStc/cf9lr/gsQb3xff/C79snSfD/h9L2E6TY/Hvwfodn4T1X4eXnTz/jN8OfCsNt4Zv5/+mmkQ3L9Pmr95vsmm+Gxo+oy6jaX+o6zZ/adB1mYpqugXPh7/oMqNIE8DTetwAXH98V/DlafsYfte6J4K/aB8Tah8BPiVoPhv9jy58Kaz8crLxLDc+FvE/wgW5W1e48SaloU2uQTeJPDtwng3XXm/wCEQiuIJUvNQeQEXE+/+zv/AIIbfCT4m/D79h6Hx/4m8dfDX9oHRfH9zb3P7PFr8N7+fxg3gSx1cuniXwDr/wASfGIuPh5ZaB4XlGy18OnRINN04q/lWsTqqH8w4+SyfJpSSjzN6SSad3ZpJrXVP53WmqPpOGJLN7t7XXn1io3302u9kld6cx9CeMvB3xK1fwbqFtrnhpdMtPGGi+bol1qFqpfw3L2kleVCbV/9tDG2M81+H3/BVbSvA2lfsjX0z62Lj4jJrXgaGG2u/C3ivT7TU4rb4gWv2eLSI31FAkdv9hsvIWEBYvsltsC+RFs/o3/as8Z+KvG/wqsPA1v8VPCfhvxTovhkap8UNU8ILfeO/FOoax20Xw/pHhM6LoKwZyTbRERAYHl5BLfyK/8ABQH9jLxT4u/ZZ/aJ/aO8W/tFeKvG+i/s4ap8KdL8I+DNf8Waz4/8R31/8U/2gPhr4WvJ/FnhPwzeWXhPw5P4S8G+J/FviTSv+ETt0ls59FWSxktZkSePy+D7V8mVXNv9nqu3LOHuTbaVlzr3vK+p6ubbcn2U37r+HRw1tt3ey32Tuj8Dfg38MbbXPib8TfHuv6r/AGF4M8DaPHYWsg05fEMHiXW7fwDi28P6h4cIuINUtYlVTHaXVq8MPCpHxkfqf8Df+CWPxV+OfgbXP2w/EXxn1D4d2fhvwZdfGSz8CeDvD0XiPVdA8G6H4Ju73w74w8e/Ea7YfDnwz4k8UXeieH7i+8M+HtCae+m8TXU0kTTXk0kv5d/sv/tn6r+y/wDEX4uNpXw4+CfxM0jxxc+EINStPjr4c8W674f8Na74XgEGvat4T8X/AA1vtN8T+HNW1OFpbLVdX0mazudTsHjguvOEOLj9SNQ/4KC/HaH4beO/ilc+OfDvwzj0TQbPTrbwl+z7pWk6d8DdW1Wxgs7PTry4ttLNlNc3tla6fYWtnPJaPPbQWVnBBIsVtCifWZlKSyZOEnzNxXMm+ZqUYLfd39W7676nkZXGKzflsuTlvy6JfCunyte1tLHxz8U/+Crf7WPxm8MXmq6L8YPAf7PXhnRNcXUtB8J/CSzuvEHxSigYkPaQ+LtVlfWzYRggog1CzjY/NJCiKVf7U/4JK/tffEX9if8AZn/bD1/wR8I/ij8UfA+l3vwa+I2p/EDSPEkOk/DD4d6Nolo2u+KPFHxm8OQ3p1jVrHXvFWtfAvwbq/gbTba9h1ewj8SaZfW91HPPDL/MXr1j4i0KayubyWFJ75ALWa31EahOiZUbUmEkrxrlhgIcHp16/UvwM8Y6fo/gD41WfiDxR8Q7a91Dwv4q1TTtL8Lajq8/gvXPEFrqXw41G0vfiXpFpcDT/EPheHUUTUY7fWre7so71Le82C5jhkXw8yyiLUU4Rs2pW5UrvTdpXuul+ZK8tNbHTl1Sq271ZyV9LzlLb1k/zW3Tp9d/AD9o3RPiF8fdW1P9ofQ5/jnb/tNWdtpnxV1XWLoS3vh3x7481A6pZ+JNIuNUku5LDTPh5qBGpeGpbaZV8O6gTdaTLbT/AL0xfsx674O/Zn/4KTeHtFe28cW/w88CftAeGPBGpJrWjaHrPxG8MXF9pF98M7vVbnRLjdoPif4jTzajqcU3h+RLzwtNJe6hFM7w3ciJ+cfwl8c23hf4geBvEWoaJP4l0zTtZ8690SG8a2lutGjdVGkzRK2yXTVGWFpKGtMKQseWAP0T4P8AFE7/ALbnw+8ZeKfDmpHw/wCMPjj4I8Sap4Z1jw5pt3LY/DvWPiLbXniPw7pWm31tNFZ3GgiSRNNt9PSFbK6tzIscJiYzes4pQaUUnyuySW9rL/IzUpOSvJ7rqz/QX+JvwR/Z68IfH3wT4E+IvjTwF8P4/i5+zFpN5qFt8LdJi8XT6j+0J+x34yPgLxR4F03wZLaP8SX02X4e/GrTL678UjXwz2vgjxJJJdGGGZT8A694F0Hw98Nv+Cb3xe8Dahe+ONQ/Yx/b7i/Yc8b+Drnwprej+E7jQfEXxD+Jf7K/inS7Dxk+qReIU+MGgfCPT/g/Zw+FYpV8KWfh6HQ9MiQabp1hbRfjn8ff+CknxG8QfGXwr4ni8V6b8Kpfhen7SGl6LY6PfyXOhaB8Pf2qviB/whWqeFdHsrOZLTSr7QPAOgeKdetrOxit0tzrWszxxp/aF6ZviW5/a0+Jnj/T9I0fSdU+Lfie7vv2ldS/ai8f+F/CmhW2r+GrXx54+1vx78QrXW9I8PeGtM0Px3Br8sVz4LlfVY/EKzpJ4Z0EQPCugaOlh8HluDzuWsoOTcmmpJtWbldL5KK0t8XS116qvZei/Jf119eh/WH8Zvil8Cvhp8UfjTqSeFLmz034F/tx/sq+MvEei698XNZSWbwJ+1H4T+Hvj+58R6Pb6XqDjxf4D0nTfHPj+H4r+Ndt1411iCzuo9dmuUeUN/N9+0VceLde8IXXhP4YeEfEnxO/Zx/Zw+Nnx9t9N+OPw30DxNefC74a+GPiB+0hf638HtGhvfEmoJqOh6Cmt3t9qukaT8Tm8RWtpqmqXF/p9sbm4vLmvnrxb4h/aI8TXd7NaaBovwN0m28U23jy31/xx4q1L4h+PLfXLHSToVhpsGvajcXmsRLZ6I8mjW0SXKi20knTogtq7QjlfFmqeMvDXwC0n4TL8R9Z1vwV4U8ReAJZLD+0NSsdH1l9M+Irz6a17pzXIsrs6bM7y2BuIpGtJGZ4GjZmJ9aOWTU6U5SlzU5RcH7zlT2u4O6cGuZu0Wk77WVm7vlnC75an8SN3y1P8a2l/wBvJn5z/Ga7F14+8Sypx+58HxxEcFIl8CRq0akcrHnHyj5cAZHSvdfghqXwq8YRJ4S+Maavpa6zI8fhP4o6RKYtV0qSN2Rl8TG3c3FyoK8PPK6N1UsuGPzZ8R3dvG3ifczNjWo4RuYnENvb/ZoIhk8Rw2wFvFGPljgAiQLH8tN8JHUJdZS2sr2/muNU1IaTatHFKzanM7kL9oKlmmfDKQspd1DDgdvp81lOFOXJKSlyS1Tau0tNE/8Ag6XIyeMJ1IRkk05pe8k7axV9emrt6pabH78fDP8A4J9fGfwrpuj+No9N0H4heEb27/t7wt4t+HuqQa3F4yhHX7Do9+zp4UH/AFwjt/pnNf0Kfszfsv6Xr/hDwZ43+NHh868bPw/ZpZ+F9IkSx1yNdbP/ABUa60igSzr4Z/5cxcBhYdYfLr5L/wCCXmj/ABb8C/so614o+MPwo1s6doetC58PaZ4pHh7w8uq6Nx/xLfCP2Bh4q8T2B5JsvFCSWgOQIyME/wBHXwF/4QXW/D91HL8OrTS30zQrv/hI/G95q+h6eYhqGBqAn8ba60N2/wBvOTeGS9P2nP74OBX8W8Y+IXGtOdTh+EZOUakoKpSlLla5rKUJRa912Vl925/V9DgfJcoyaHEE+VpxjLWMLq8YvVteiaX/AAT4s8Of8E2/Afh74R/Grwx8ONXE4+Imr+ba+LpNNh806Dx/xKBpaxBzpfb7BtNp38qqH7Dv/BOEaN+1D4O8afGHwtrXhqFfBfirxL4OFjcWVj/aHi+3KmLX18gBvBukW0ZLWzW62iK21EeMMHXC+Of/AAVP8bxt4m8D/wDBPX4R+Dvjjq2m2fh7wfqP7SWuS+KNC/Z+0Hx946P/ABK/D/wysGgj8cfHfS7Zsi38X+EbfRUjABjuSp5/B79qL9pz/gr78K/HOo+Efjd8fvEfw9+Jfxz+HOuaDrFpF4ftPBtv8M/gXaJIPHl+i+HTCuk61rcpjfwPJAkFwqLJHp1xbNIskfs+HOQ8S5fnkc4xVWrUoSaTw9epVqU/edN83JJThyuM3K7SvZ2bfLf4ri3MaWaZLz0KVKk7XVSnBQm7KzulGDVn15m3f4Unc/R79qLQ/wBp39m/4v6V8Ufh78CPgb+1j8M/ilP4z1fwRqHjv4oy+EPFXxKsPDsmPDUPg2x8CahHdxxa3Gd5h8SxNHfv8kpjX56+7f2MILX9pjwj49+AX7Yn7Gnxy+D37TGj+IvDmo3Vx4o+FuheFfAF5pfj1NWOna38OtV8LXFta6VothJ4VuYVGtm28aRSeMvDv2XzI5rWR/5g/wBhP4xNoMPhDx58NJPjT4a8Z+E/2oP2ZdMbUYPG2qeNdK8X/BHxd/qvh/D4e1nUpoLzxh8ZP+Wdq0Mknw342paV+9Guaf4X+H3gXX/HHjv49eNpPEHjHx78e/29v2nvhB8E9V8W6j4Mvfiz8SPiv4S8Gfsu2/jD40fak8R654e+D3inwB4U+DLQ6ze3cPhv4waF4qu9PFl8PTc3Nf2Dhs5qcJyjnFWrNUmo+5zy5NeV25JPl1vZ6LR7rc/nvFZLT4ug8np0qSra++qcFNaRfxJczba6y1k7b6HxX/wU1+Avwa/Z5+A8Hi3wrfeDdQ8dXH7Q3iz4d3ml3/iSSX4m6Z4bts/Z7y38DOzaLbx2/HkeXCqxZAj2mv55tf8AHHiCS5vdOk1q3k0zXZIZXd7lnjmlt7j7XbyyKzFZJILsfaYXYM0Vx++UrL81fod/wVp+HPg3xD8B/wBk79sX4IfFv45fGDwb+0GnxWHxF1Dxn4KuNRT4a/HPwX4sjt/jXc+I/Edu08tp4hikuRp/gDwfdTL4V0qwtZW0MW1sylv579K8RajdeIdJtrrUL64tl1ryVt57u4lgWLI/dLFJI0YjwPuBQvtX6DlXF0aiu/e5kpLmaeskmlbTRXXprfufAR4PeUOUZxjZNxd49FZbtWtppb5bs/uh/wCCeX7J+lXX/BMP4S/tW+H/AA6viefUvjLpWqfE7wdq7xW3hfQdK+H3jnxn8PtR+MWhajpat4gsrtvhw3gXVJ9BtRFP9n0PxGHQxNNX9D+k/s8aOvgr46/Bfwte2l/4a1rwSq2F3bpAyRfETw3cv4p8HugGEW+1TRZYYpLpP9KeytY4g7RxRxj+Wf8A4JwfHL4ieFP2Rv2KfBvw61fxf4Tm8YftT/HL4D/E99G1jVdI8PWnhv476HrmjfDHxJ4y8E6ffWnjy9+Ptl4+W18PfBO01LWrnRPFI8ca5Z+NJ0j1/UPN/X3xz/wUT8MeA7rwh8OfCz694O8XX9r8OvFeneJLGK11PTdZm1KzGnfD+68Uz27kapcaHpwWx+IE+oNPLdWarbag8kCiMe5llbOqicI0+X3qc4WUfdcKkKlKbXLLSM6alF2aet1dH5HxXQyjKZc1WrKU5KacpS5pe8nBq7ba0fK09UmnZpq/8+v7TPhe50//AISGycvZ3Ol/66wvC3kt/vQP+7PHqtfiH4p8Pyf2xEujRwXCw615UK6veizEUQ/5ZRiV1CJ/sLhfbpX9Cn/BWWCT4c+NfH3xJks54vAur+F7r4u2tocwlF8a2Y1/QfDIXhE0mw8Vn/hEbHTwBaWlhnT4Io7fMVfmBF/wT38TeLLXS/il8Yf2o/2I/hHoHjbQDrGmaD8VPjtY3mqaDo3H7m7+FXh+1uPiND4vGCRejV1v+TmUjGPa4qbjKPL7srQdk7atd1bdp69ReHS/sqH7xv2UnJLmu4ya5W1Z3Wkaie3Vb6J+EeHtD+Dem2XnfEX43eE9HlJ/5FP4b6bceKtW5/6jt3E8/Oc/601/Q1+x1/wTr/4Ji/E/wpoXxD/ak+MHxP8AitpmqHUo/Cms/C74r6dF8DEhvLD+yL7w/dax8MrXQ/Hniz4y3tgDpepeGvhhaeH/AA09gpspoJ4cxD8LPBHwm+DHw3/aV+G/wx0j4r/s5/tTfDbXbTXbzx/e+AvD3j3wR4c8OyeB1Laj4KT4heL7r4FeJrea5XDT+NFuEkmVgXuWBzX0d8aP+CkP7N/gb4o+HvFf7JHwrXwz4C13wDFoPjf4VaLrN9qFh4S+Lfw21L/hGYL74dfFO8WLxF8RPD/jLw0YfFOvfab746RavqM8Wo3i3U7NMnkxSrqKza+FWjUqTjTasoNdt13Ti1dS0aT/AEKUqtK/9jueJvfmU5OaXdPmvqrOyune9lc/YL9p7/gmb8F/iDb6DY/AD9pfxT4I8feHfAfg74S6L4X/AGov2cvH3hST4z/Db4ejSV8B/Db436v4U1SDxP8AEPXPBA0Dw/8A8Il4v8X/AAU1abw//YWjHSZbI6RpzW/J/FX9j7U/2c/+CQX7dfgTV/ht8P8Aw/8AFb9oj9oT4X+M9Q8HfBO61/x/8H/Dq+FfiXD4w8M+OPCSraSXmleBdB8PxJp+jeArC2i0zS7GNbezsY4SVr4rs/8Agtd+0Anhu10Xwr+xr+wpb3Ol/C5/HtprnjGfV/G9ncaFGzRy+J5/GHjD4s3Pw6+wRurK3gKXQfIRwVNmpGB4nB/wc6/8FMNAgt9W8Iz/ALOuk+GNZ12JfJt/gP4Js7mQwR+RAXW20qEO1vAPJgkKs8MQ8uIqhxWWZ4jKIRUYyjN3s5ValOnP3ZJJpYfDzjaSSak1GfdRkm0lgMS9XVqxtZtKc3FOydnzT6a2TbW9l2+Dof2NNc+IXgD4i+L/AIa67d+I/EPwR8OWfxR+I3ge6tpNJsB8OtZUjxFrvg/VddMHibxPqXhptotvB1uJ2sPvQWyHKt8TaJpo0nxX4Xv71Ftov7b8oKqhF8rp5W0ADy/9jG3rxzX9Cnjr/gqf4r1nwD8Jf2rf2m/2O/2EviZ4w8E/tPfED4e6tpPw/wDA3xB/Zp+LHw68daFbeANV0e+fx34f+K998Nfj58KvFUGjeKIdf0fx3pGuaJez3epjVC1hcXpX+f8A+Ies/DrxH421XxD4KvPEnhbwdD4ks9W8O+BvHd7dLrL2Wt8eI4LfWNPkeRIPDP8Ay6RxyBLHrCIzyfmsww+TtfH7OTdmlJNWvG0otJNqz0UlFp3TSveXr5c6q+Obm1zauTd5RTbTu907Wb3TTUnHlP8ARR/4Ic/tIeEvB/8AwTD/AGf/AAlFoOlan4h8P6x8XbfU1msraWe5htfiF8QntkuGMZeVYDY2QiEhYRraWyqAsMap+xvw5+Ongybw9Npep+D/AAkI9IH/ABPpdK8Bf8Ix4KtOvP8AaGrzwacp+o5AHQ9f4Yv2PP2v/BP7If8AwTr0z4keKNS8YW2uP8RPGmkaBN4Vng1m0m0O88f/ABKFzYroWqzi2i8RzuSZrpo0nZMPPJgM1fjb+2V/wVf/AGqP21prrwl4j8Val8Lf2eNDcx6b8KvCd9qlp4Gl8woIY/inqmmywar8UZS4YbvEias770VI1IZm9LM8FkWVZNCcp81V8tpXbne2l5XutW1vv3sfL5ZiM9zbOpKEWqNOTUrP3H70YtRi7KTat00VpNpWv/cJ+3L/AMHI37D3wPutV+HX7Pfgfwl+038VYkk0oapDpdvpXwT0S8dISs8HjN7Rb74sPHJ542/DcWcroUYXSMCo/iw/bF/bh/aL/bS8bWHjX4yeLY/Euh6NNc3Xg/4ReAbW38L/AAw+Fd3eqFvry28GWcsPh74X3t9gfbrz4i6frd1etue6llZmY/mdJ4g168tdTsUnjWxWb7QtoHItVuP+e4twfJE3P+sCB/8Aa4qhDHq2sQalHpGmzaLqKnK3C3722nj6LG6Rj8B/hXw8Ult1169fXbp+up+vqKSV4q6Svot1b/L8D6a1Xx1471nS9f0qXxZ4x1f/AIWm+meGvEOnXyG91Cfw3on/ACBvD96LiaSS50TSf+YZpU5ksLD/AJdbeI19gfsneJfib+x/4s8f3Hw91nS7LxI1gfBkd54z8P6N4w8E6X4HJzt8Y+D7+O60vx9p4PS01SzvrUY4iAxX5c6T421vRr6PU59XibUopDNHqD22b6OXP+sS6I89JOh3rIG9TXrtj8SJptT0rVNFv7oaqtv9jAu7mVpRaf8APsHdy4t/WEER9fkplH1b+0B+1R+1lc3f/Covj98Y/iHrlnptnBY2Xwr0H4k6T4U+Cmr6dBdLPbWnw70Pwz5XhTxDZQ3rrNBb+I7Awx3TLJHGJiDXmnw88O+M/ihNp0c2t2PhTSdI1EeJtJ8RpZrZQaW3/PbTtEjWNLKXv5trFE4z97isW2+LfhK9sNN+HmsfDGy8fav4u1SKbTpoHvf+Eq1XwvK+xNP8AaMtvNoOl+ImIba+upb3j7GEYdhtP0/4U8A+IdD0nRfiVFdaF4g1zVPFXiDxB4k+Gsfiu1udR+Hfw08C2/gHwhqg8S2EmmSC302bXdSvLu4tpYo7SW7nluJYmuJZpZJ5Y/yx+5abf8D8AP3M/Yq/4J/fEjwP8EofjT4ItL7UdR+KWiQaPpHxO+Hng21g1X4geH/DExn8R6toN34i1S38BeFG1ecNLqk9t4egbUJQZLtpnBavzn/bN+EXiDwH4H8deIvEllqcFvHr3hPZqXiDTrDTLhPtPxA/0kpc6WolX7R/y2w480n95u4r5h+Edl+0T8WP2wvhf8K/jf4p/af0vxL4g+Imh/DnwlpejeIPFHh7xPoGoa941ax1qHQvDHh3Uo/DOleCdWs2NvqGm6fHb6ddxbVmhcKmP7Ov+DiP9i79nr4d/wDBMz43fGPwX4VHhHxd4L139n4QWlnrF7HpN8mpfHn4eadfx3NqkjRXE19Z6hqFtdTlB9piuLkMqiZgw5WaT3d7fJpa7vdpXs13sTyx/lj9y/rovuP84OabRtU+Kd/pOr3Fxd+Eb4eDTqE3h7w9pWrX1kv/AAgG3MMmrQmSLBDAlWAJBHBGKxz40+HWk+Knk+FFt8U/AfgS1m8qxa48WeG4vEerTEb/ACfE3i21srXwRfbRjal14edVACKAvy15N8Qbu6i+IHijyrm4izrMcJ8uaRMxW8P2W3iO1hmOC2Jt4U+7FATEgWM7a7C38M2eoac0mo6haJqzsWk1CyCJfSMepkukAnkJGM73IYDBGMAeXzSTT5np0u/K3Xy/qx5vM19qWvLbV6WUb6bPR2V+2p7VpHiHwVrGjavb20umaneSNNJJPYa9f+FriRrn/j4eSW3e2dzcf8tmZiZf+WhYGuI1XxUdXvtH8EWN14g1jw3C32OLT7rxBfXemRavg41COxmuZLSO+/6e0iE//TTpXCD4Ua3rV6RYapbXCsfnXXLRrANjoWGnmXccdOnTjnGJvG/wn+LPwfj8J3vjDwjrfhJfFUmva14a1HbbsmuR2kkcJm0OXSWnu4ngRg8KauIhGSZYokRJVr1FmsNPcj0v7q/u3/q/8xPKns/Rf8Fpdu3Y+qJfGenXl5FYeELt7nVoLj/hE4Nd1GQ2CQ2//PpDcuyvHbA9LdHWLP8AAea6rx3+1X431TQG+E/jH4WfBHULfTvEx1jxF+0LZfCO/Pxw13xCEz/Zfjb4sm4/4TvX/BnmHb/wj2rajd6Ts/eKuQY1/Oy88Z+I9Qj/ALM1vZdBbsXgs2sP7KujfYyLv/iUwwSfaiBzM6+aecsRTb3xLqCjUU03xHrEkesJ5esJfapeyLqsf/PPUllnZb5M/wAFyJV7470lmVF2Xs4dP+Xcf7uj08tbf52fK00mt3bytdK97rZ6aqx+rfwnk8EWWiaxr8PxO8AS+ItJ1rwbbp8MtS1DW9L+Jur+C/EK58V/Ej4f/EqWKL4R674I8NmK4byvFOnN41tlGEtIDDI0n3d8Hte8G+LvEx03U/Dum6sNH1X+w9d8N2fiOHTvttx/e07V0kTD8/fjk3ccGv5ztF0Hxdd+Fta8a23h+81jw1ba6thqOvpcCW50zWJZ4PFb6lBaNIz2moHRPCurwSXqrCzWd1dxy3BQbH9Z+BPxsl8B+LPCeoeK/D8fizwNofiJbzV9LtLu80bUtRkYE/aLue3mU3VwBglp1d+oLgjnw82yj+1LewSpvf8Adx5E3dW+FK/r2XY9mjmUctSdSMZrS/Pyu2z5fe6v7K6u/Lc/rW/4ZmtfDWmXfiGwn8q21Jv7R8NahKF1Wd9NOP8ARILhhJItpxj7OjiIcfJxmviD9rTQtW0H4beK4dUjcW9pr3g0ahe6vmeWX/i4H/MGlud7w8j/AJYFTX58fDP/AIKx/tH+A/h54e+Ecd5p3je38KfHfwP8XtP8U+IEe41GX4feFomXxD8An1W/e6u0+CusSI82teJ3lj1u/VCLmIxuBF9T/tD/AB48G/tP/s/+Lvi/4V8caxp2tabq3gzxH4m+APiGaG5ufAuh6v46kXxLNo5nvIo9d+HXhKcxs3iyAy+LtLwH8RxfA5FNvN8PQwGdZRnlNTgpU3UUGtWkvcfM00k009LX1i7paX9GtRynNYSca0otQcrKTVmknbRrTS3bTfXSl+xj+xpqH7TfinTr+9vtIstC1KzvrnV/EOow28tj4f8AD/he3+yeL9Y1SWdXVZfDNqfs1rcSHfY2+IYWjiO2vtf9oH9pn/gm38IfCR8BfsqJB8ddb0OX/hDptN8DaL490Txz4v1xcBtbh8T/ABK+EWs6N4e+EwLAL4ktr9PF8hBKblVmXnP+Cc3ja4h/Zk+LHwt8IfZ7L4xeMfB3xw8O+B73XdM0Z/DL+Mda8apa6zo/i+O5ie1vfBerWP8Aouo6RqKTaVexfuLq2mhHl1+Y9t+0x+0D+y9p/wAS/h7pttrnwb+I0PjhdL8V/CvRvh58IdB+DeiSwhYE0/4i+AviD4Z1bwvfeICiDyfiHpWly30UKLG2qAbN39R5q/q+RwqZMvazdOLc2lJptRu+Zpu61tsrX91/Z/lHhell3EHG3GNLOcdWjTw9dU6WHeIqRUEm1zRp86VOMnyxfIvidnKLcef6W+H3gv4n/tIeIfEKeI9Y+B3wQ0P4e/Do+K7HVn8EeJ/FGu+I+croEN9rmkSXfxt8UbflZ/hvPp10WywYDC19cX/7EHjfQPhz4I8byfD3xxe6n4x03TvEHiBbX4c+IvAul+DbbVr7/hHfA3hi9i8bXmqw2uv6T4Wz4v8AiHGVWe8vT/aGp+bcDzz4L8E/+DhX9rrwb4y0m6+Pvwr+EX7TGgQw2ni3WdB174aaX8DvEnhuyjuE0K58X+Em+HWkWPhzQtbm8MiPxaL3T4ofhhHPdPfy+GRqNuLub91fFn/BZ39iz49fCdtB/Zw+I9j8HtO8TaxP4x8YfCD4y/Crx6ZbfVvF2lXGo+LviavxM+Hup6X4sl0LR9TmHw81Dwx4ZuvjdbXmjIujyWEGkpb6bb/ELiDOEv4d2rXVnv7r+WvTpa2237XLgThXMnHkxc4cvJfknyaRjHrFpu6W+rlrJtt3Pww+MX7MHirQPhZ4e1nxbqdloVv4t0/7H8TPhj4U8PXvir4weDdT/wCE4+yf8IfbeG7a3m0fxPffZf8ARv8AhN2Se5+z/uPtRj+Wv1hX4SfsteGdC/4RW3/Y0/aE+JviqHwpZ6Fea38RNBk8It4x+K+t+KF1XxH8VP2hP2grfUl8EfCTxP4Y8Qg+CrP4W+AbU+ELHS3fR4Y47AJap+RX7UP/AAUklt/GOqSfAD47p4Qh8N6Tp/hfwvqnwj8U/GJtf8YWvhGYX2sW7eMtW+G1nqXwotdSuCLy8h8B3llFeTFbmZZGw9fnH8YP+Chnx0+L/hjSvh5fePdd03wZ4fa9v7aPS774raHPqWm6hqw17ULOdbTxHEs9nfa6f7auoHDQXWrA6lKsl5+/HzGb5jn+aNKjKrTV1rTnKLt7uq5ZRvb17nrzy7IsPHlyjlxGiT54RlomlvJPqn879VZf1Z+A9Z/Ys+IGueIPgJpP/BEz4g6lrcF74r8E2/jOy+Pvjt9P1HV7ZStv4u0e8XXy0eiwcNDcW0qrEygRuqllb4j/AGrv+CciaHffES7+GXw+/aD+Fmm+BfEUXgjxb4X+Jy2fjnwlp3jp7lfGreG/hb8evAPw20/Q/H2inQybE+JvFOmXLw2GbCS4MSMlfzN+C/2nvjb4D1Gz1rwD8efiv4SudOs59P0+18MeOfF+pJY6fc/8fFjZpe6ui21nP/y3toQkMv8Ay0Rqu+LP2ivjd4xvJ31/9p/47699ptfsFz/bXiX4zam09l9i/s37FOt94wnaa0/s7/QBbuDD9iza7fIJjq6WJxeWOKq4jETfu3/e1Jbcq6tt3vv9+2vi/wBh05f8uodNfZx0+F9IrXXfTbyPp74m/Bjxb4Zmu4tS0e5tNQi/5DEGqQ6ahtP+A6RuC8cDAA/CvnXQPD2oeHvEmkXOpXFxBZR615KXfmurxxf88lk3blTH8AIX1FeEWHxn+Imganc61D8T/FOq3uoE/b4ry91e4F9k8fbftN063H/bYsD15zXq/g3xlp3jjT9Wm8SeJNVg1nSfEPhTVtF8NmynfTPGtrc+M47e9tY9RJMfhaN7SZbWZIzBBNEDATIiOi/cPNo8urs3Hur7Rff579X8+KnlFTK2vaSlUjeCcnzSUedxX2rNtbaL0vc+mfDfw617xpqUV/pqS6rHeRwxX62hd10+K2tzaW8UQUkQxwWv+jQooRY7fEMYWP5K/Sn4X/s1aronwy8d/FDxVoOs6B4c+FHw81/x74s1X+y38RXN/a+BT/xNPsWjPHNlbj/l52x4l5Mm7Net/wDBJX9jHxX+0JdeC7rw7rmiaToXjf4ieLE8e6/q+ow6Xb+BPB9r43FnBoumaHI8MOv67Dbf6NAqRPJDbnyE2xcV8D/tqf8ABSH4z3Pi/wCNvgv9mz4reNvhT+zvJeeNPh3F4PludA8PfFm70DX9J0zwxdax4i8W6Zp2n+IL7RfirqnhbV9Wufh7LfzWXwxuNUu75NPsZrx7m4/nOeZvOeMquT0t6Uk5yTaau7K7XvLmasm0lze78TSl+y0UsqySKlFNy5bXj3S2/O2609T7c+EX7Rf7GF9ol3rGr674qa80N/Bdn4O+DKaPZeOPib8VvDHiBmj8YeIruy8Ex6T4D0Lwd4ddXRfGs3xvj8dWjKVWRCOMw/HnS/ip438F/Czwz8ZfgN+x14H0TTfDOtaz+0l+1v8AEbwT4m+Jmr2XxRWB76T4b/DL4M+ENL0H4eab4W8/GkL4f+xeGNKMbtF8fbRHgab+drwl41sfCOm6n4h03SLOLxx/bHhl/D3jPRrGO80vwNHd6pJ4p1JL7R9RtpIvETXukRXGm3a3EcscljHLYzySxKI5Ppn4keOPFut+NL3SdaTxT4h+J2i3sFx4x1G4vkv/ABfdXtoSLfw34j0y5nl0Pw9p1qciHT/Cri2hIxHEuDX2X9j2eqva3y1j23dl9/4eetUn3R/YLD+zj+xnrfwK1jU/gX42+Nn7UPj/AFy6svBmsfCn49/tUfHL4Ofs1fF7wnqTk6NOmpfBLw78ZfCWl6XqKbY/hhYy/FxI/HLbpviDLOCIR9G+EvBPgz4/fBv496b+3f8ACvSv2RvHWjeDtO8fw/tIyfGCP4haJrkGipaNoesX/wCyX8XPi74y1J9c0j/hD9b/ALO8Kzm5msTf3q2VtE13MJf4gf2d/Gv7Ufh/xbBp37KHia+t/G5W7t1+DOgaxqdlqOowamw/tJNL8OTXEPhIw3v3r6K3t2+1gHzUk4z993H7cvxa+L3hqP4W2GozeCkvrFYvjJ4T8XanruleJLDx98MxefZ/F1laXEyeGIvFXjUajf8A9t68CNX1Y316t/dTtcz759jSsv3dN9L8sb9NHp5XWmvd2svLU53Xvy3X2n3Xmftz8Tv2IPhf+0f+wxqMvwZ/aq0L9pP9pb9jqy17WPh/42/ZZs9N8C+Gv2gfAPiyRT8DrD4zeBblrG30H4s+BlBPiDw1YxP4b01UVJDIZ3aGD/gm78dIPi/8dfCvxW/ag8A6fYftsfBT4L+HfDXwj8eXcfjbwv8A8Jt8MPB2lapoXhO2/aB+GOl38Xh7xr8c/DmjeN9J0zQviz8JINE8TaZp9lp1pa6lDFYWccH4A+G/jB8Cvg3c2t18Jvi98Y9O+MuhTT6r4Si/Z40+Lxna+N/DF9JG958Ovij4U8Uyf8In4n8HXRUG88M61b3+k3Me+OSwlR2R/wBLP2bvix8Dviz8EfE/7W3hLSvF3gP4m/DqJPgR8dPCiaT411nxd4g0KTxpY/E1fEng+5i1ZtQX4lk2GnfDlvD0Eg8KL4bsbTw423TrSKyi+dcJcrny2Tdm1HlUVJyaSSsuSWrVla6aW2v0ik2leUnp3b6RvruunXt5W/UT/gsB8VPir8Zfgt4Z8EeDfEfirw/dabrFp4/8a/BbSbrTfDFn8Q/CWu3DXniX4qeMksLm0s/FA8NXbtc2nhfWob77FcM08UMcjFj/ACS+LvFaXej/ANptotxf2s3iCez8efEDxFpKxeHNI1e5+J1541uNQ8BeNLuI+LNdvp9E1HULGe6sLl7iWxvry2eRoLqaN/Rvjx+3tf8Ajz4iePNc1CPwx8atBNoLTwZ400TUfiF4c/sSy8Roz+FbTxHp2tiDMFuFI+JltMpTW3ITVUunIU/BvxA/aD8efGDxh8OWv49Z8PeCfCjrZ+FvCuh67f8AiHw14c1fYsf9o6BomrXD6Xo1+I0SP7Vp9rbT7FVBJtUCvVyiMrtO8bytZuzS06XTWjVlpfoebmtleKtypt8unLo4dNt7/O/U/oD/AGCv2Qvjj+0x4K+E+o/CTStf8QQXV4dHvNf0+W7022s9I/4WB/yC9cngaPztN/6cblntuOYhX7H/ALVWufsJf8Eur3wVeftj6X8XfH/xQ1fwg2ueCvhD8DPBS33gSC0+0+LYobq7+PHiK2svhdeavIngjVWl8Fi3iurbBk/sye3a6lt/0A/4N2tX0jQf+CUnwrvrKwsbHxBq3jn9oSPVNbtLWC21fU49G+O3xEstHjv9ShjS8vE0qztLSz01LiaQWFrbQQWoiigiRdj/AIK4fALwh/wUN/ZR8bfs2+INcS08V2WvxeL/AIRatdXCNovhr4yxLr0Xwj1y/SS2uI4bTUvGFw37PnxNumkibVv+Fx/FDxxqZf8A4Vh4Tv4PJzDDZJk2dyvW5XVt7Sz5eduzXtLX57PVp30ul0PXljs+zfJaSipqFLl5LOV6a91fu1e0VZ392zfV7n6keD734UfCDwvpGn/DjwL4e+Gd7e6bomq6dBafYta1HUbbxn4PluNNil8SwI15PHBeAyrvunhllTz40CviuL8SfGQXUrz3Nza3E0gCyTTlZpZFUYVXkkLOwUAABiQAMCv51v8AgkZ+2p4u+P8A+w74B8P+LJdTl+N37L+sxfsy/GHSNUhtrTxPLeeCtKa4+H/izWJ7pv7RuNZ1L4ez+MtBh1G+d79PG/weZ1lW/wDFZM30/r3xtntYbyHWdRjstQuNF8280lZ2j1HTJf8AnpbgMJbeT/bj2tz1HNfN5xmrozlBPkcG1aOi05bNNct00lytJJxd1o0z6HKMn9oouaUm1FNyV3d2b+K7vdt6t2bfy/Sef4leOLjSvMhg0yw07/ntcxRKCPckAf5xzXnv/Cfzta/bNU1x/s4P+rmvJXj/AO+HkZf09PWvzJ8b/tUeM9fSO20S4up9B07/AI+Y5IJtMtZf+usIMcMg7/Mre3evG9e/aK1+a3i0FdUin8Z3mteVf6Hd2zaf4f0+PkeVFqTbbeGP/YRlUenFfBy4wjJ2k5S6e9Jv+Xu/8v8AP6qPClZWtdbbafydrd3/AE3f9l9c+I9g0uk6tPeWek6fZf8AH5bXGyO2uP8ArvCdscvf/WKw9a8K8ceOvDum/wCm3OrHT74Z/cTTabqfHTo7v+o61+OvxL/aG1kaT4q/4Sf4paA2laf/AMgy0sfGWjape3n+8PsMjP8AQgg+1eCa7r3jO/fV5dKtbjUJbTWvK1DVJGklspYsnEeisxZIE/2ICq+1Q84cneU5PVbyb/ktu/P8X8/VjwrUjazktr6tX+HfVd3+Hz+8Pj98T/AiaYurJPr8M/g7xVoPiXQdW0jXbu1h13xtrmlaroWtWNxoVvOiXXg7WNE13XNG1XTZIn0/UNK1nVdOu4prPUbyGb8T/wBsX4sal4q+Gfja1TRm0ezu9e8Gf2dcy3hhbUf+LgWv+ucMpm/48rP7xb/j0tf+feELs/FLxt8SxZLaadYWF7c+H2h1LV/HOj6f8QNXvtP062/497RLPV9VeeG1t+kMClYouqIK/OH4+S+Or7whrdz4m8U3mq2+ha74NC6PdNdWthD/AMXAH+rspX+zx/8AAI1x6dz9TwlnHNni5m5W5d3fbl73XS36Hl8V5N7PI2oRULq14rl6JX939bM+e/hn+018Tv2YvjZ4p8YfDfUdGsNeew8MSabq7WMd4nhXxN4Iljn8Fa7oVwil9H1rwhPEk3hjVbB7e/0CVI5NKntGVWFvxB8Z7Txb4u8beONe1/WPiDpfjHwf431HWtI8QadZ3k6ajOf399LHqPnh7yY4Mt1IDPJ1aRq83+Evwn1T4jfFjWdK0yW7tNOn1k6RPYmxfU7Oe6wP3k1syyQSuMZDPGzAk4PPP9HH7Rf/AARF+H9h/wAE5/jh+0P8MvCOoT/tHfD7w4firB4j07xHdWfgjxr8HPDVxP4c+OHhTRfAv2e4sB4o/sN4fGfhiO209btRHLdWElvdmG6j/qFf8idZ3a9PTR25bXWuumm7uu+25/J0aknnSyNVJxqO1nFyUubSyeqe1k2r9XZ9P52vg540n0DQvE3h/UxqMVnHajxymiNNMJksf+eaW5basXT5QgXJyc19M+J/iD42i+F1po3gzxD4r8MQeKbbWbPxNdeHPF2r6LJ4itPDn/IvWmvSaZfWzavb6D/zBoNQNxFpf/LisFfsH+0R+xF+yHqH7Ing79oP4U+E2+FXxp+InwJ+GX7Q+ia94h8WeINX8EeONN1L4LWeq/HH4broFwW8ReFfg6mrar4gv/AVzHb2/iDTdS8MW9xp1vFLZROn4AfEj416N4xsfhf8NfCfhnR/DPh34a/Du003W/EnhzSZtP8AE2seN/E6wt4wPjCK6ht7nVrzw42sa4tvJqf2qZF0C0eGVF02Lb8bgeIsm4pco0asqUqc+WSg3DlnF2cZKPK07pqzS2fmfq2L4dzrhGEJTopKcYy1jrZqLTd9dE03Zvf7/wBIvgT+0L+z18GvEGja78OfFHxc/ZCuviRd+FNG1bxzpnjnxB4+tPhzaXNn/wAIZct480q81Ar40+Atxrx+3zavqaXeuy33+ktC0/z1/RB8Kv8Agpx8cfAl38Lvhl+05H4C1HV9F8JDS4PD/hHxXefEL9mH44+Cftv/AAjx+IHgvUNcuL2O/sB4Vz4uHgzxbbm3+2gaiLUXB82v4RvHUniOx8PaXqGpTLcJfvG9kLZzhXiu2v4n1wKf9JeO+ZryNrneyXTG5U+cd5+k/A/xu8XyfCjSfC2q+K4/Ksp/7KvLqYSPJcaJ9h/ssa1PI7FpZxpv/Eu+0yFpPsOLTf8AZ/kr3o0qaso04LppGK7W6L+kfHOrUlvUm3fZyk9+2r/q3mfv/wDtT/8ABQOL4ip/wgmg3Piqb4VeG7+LWfhT4Gv2jnv/AIQRfETSNX8Pjwf8P9RllYeMNE8B6Dr+vaJ4e0fWytjoWka3q2m6db2tnqV5DP8AiD47+NesxanfH4lxWmvPLb2fgvSvGWlqs2n23g7T/wDkH+E9W0b5438NWOf9E0KaM6Xa5/cWida+e73x/qur61LoE/iSKSefxAHn1CxvJFsZnXo8pjkCSMOcM5YjnBFfQh/Zy+GaaDceJdX/AGz/AIQ6a934m/su60OePVNUu7nRu+t3EUiyGa4A/wCXqQPJ/t4qYZXVhbkcoXtdRfL/AC6O2+/nv92kM2WWtRrWqNtJe0XPq+X+Zt7u69dNzgLP49XWjeNfBd/puteIl8JeHdSs18X22satqOt3CeHNb48R6HpK3NxMYdH8MdLPTIQtlY5/cwx9/o/4k61aXWkXtvDc2UdrYa14NiuLtBGr63F9o+1+XYSKA0kf2v8A0oorEfaD52PM+avG4fDf7FvweXVbzxB8T/Gvxk8SFbxDZeG9Jt9I0jZqAH9oIbaLZb7b3j7WpTFz1nD5rwW48QyeIdE0fWbG61ZPD02vQf2Xp15eXEk9iLfxv9ltvsUbyMLb7PZn7LD5Ij8mDMC7EBSvks1yi2dxaS0sm0lpqmr9b72v0/H6zKc6nmuQcW5PCUoVYWlSqJyjKC91v2ck7xV2otQa6L1+bvjEwu/H3iN0A+VPDNuh4ysf2CK0WJD1EYg2wKo+UQqIgAgCjhLHRZ7gOLpmgEpUygEqJCCSDJgjfzyC2cHnrXoHjjS9W17x940/svTZJRpk6arOq3jMPsVuE8iI/NjyY+BDH0iCDYFBFe6fs1/BFvizr+peI/GEOuw/Bb4ea54Hf4kzeH/sx8b65a+JUWLTfCfgptSmi02LxL8Sp45VsUe5l/4QVyk7xRW6yLfe1Zysm+bZa67bb3PCSskuyS77Hg50vUfCw8P6jr3g7XNM03xgja3oepappR03TfEXhQFlOo6UWjWGdAUP7+DzI/u/ONy19qWGk6dc+FvBPjS6ttVg0O4077P4Ttg8q3uieKP+glMQQ9v4b7CJNtt2K8V6J+0P+0dqfx7161t/H3hzwh4f+G/gbR5PDXgz4U+EdH0vQ7f4MeGfhrbXNt4c8PfCcfEq01iLxJp/g2Kbd8ZYbmSxHxnmQXeuf2pfR213aXfB3hPwb4x8AeIorr9pnTm8Q6X4B8FReB4IvA3ivS/hb8QL/wATDPib4IRakl9Dqfhz4xeH8qyeVb23hSNQTHJDuBXyc1y2orWlKPV2k/J30v00tt99l7GU5nT0XLG71ukrvbyX6/5OOt/Y7rTb/TvAvhbXNHfSftb2kEsk1491/wA/Djy2Zp/+mxBk/wBqvqfwL4X8P+PIUsvBNteaD40gm8Waz4p+FOr6i73SeCrYf6P4j0W98QOv2XWoP+WPhD9oI+KJIv8AlnbrXyp+zD4P+Nnxytri5+D2kadHJ4Q8W/CfQp/EVzd6gmieEb/Ub/8AsvUdV8RSbWh8YaXf+NP+Jpd+AL9byzuPAf8Aok9hJpwEVeg/Hj4nP41/aV8U6v4B/tDx3L4N8beHbnVPHF14OVtd8Xar4HuGgvPjr8T/AAXcWsnhm00z4ieJmPijxFoOjRTNrmm7fhTqPn2yJYr5r91O7+Fe95WSu3fbs77NH1MNHHlVrtWtpu9tP69T9wf+CaFo3ir9pb4NeB/B2ua/4b0j4n654x+HPifWvCQ0mbW7jwjq/gU3vgvxjYaH4h/4p7wVf+HbsfafD+pWUEN5o9wRNpXlTYDf3ZfCDwl8Pfg74Mj8D/D3TNP8M6NaR3N1NH5kWqXN29+A1/4w8QeIMyT+O9a1BgrX+sahcX2oXbAfa7mXkn+J/wD4J/fsl+AfAekeLfiP+154c03xt4p+L2neIPDvgj9maPWZ0g+HHhHTvFiaVa+MvFOpzy3NpbfF/TbDzNJ074Yy+X4Yh0pVt4rS1if7NF+0Hwj+Pfh/4QeDdF0f4feNvjV8P/CwnA8F+F/jlqUnx01G8m2BW8JeH/CPie+1vxP4D0cKFVNK039ojT7NFUAW44K/ms+M+G4ValTnp+3jzL2qUHNtcqt7TSVr3d+a3VXur/oVTgfiHOKNOhSo1Pqvuv2CvGjFWu6ipxjKPNrZR9nzNysnyuoj99fEfjvRbSyF5Nrem+SAV8uSS9K4HGQoyg4xngdAMEc1/PT/AMF0fjF4A8Rf8E0P2kNL8N3Hhu91O/134QC0u9LtCbuDz/jx8PLS4MM+owRyRm4tb68tpyjjzre7uYXLRTzI25N+274wvNXu9a+I+m61JozjGkah8FfFt9rXhe3PIJ1fwnr12mmyNzyZbQ5/KvyH/wCC0P7R3g/xv+xP8R/DHh638QeKbLWNY+EUo8ceLPGPgzT7w+R8ePhvOwPgzTrJpGTEZ3ytbBIk3SyYSNjXjZdnUc24g4TqUZOMqkpKcoNxlUSas5yveSt/M3ppqycf4eYjJuH+KpVnUU6FJuKU5NU21G9pRUI3Wy5YpttuK3PzX/ZZ8F/GP4p/Av8AZz0z4L/Ew/CnUbXxV4yfxTp/xFhuJvhl8SvCf/CwP+QTa+MdPL6zoHiDGf44rjp83avyg+NHj+01j4kfF6O5+F3geT4x6h4v+NWh+L/jH4h+Mnj7VfE+nzaJ4wNl4ylfS/Et2+opNqVniz+H7vILmwjkljsAG89K+uv2PP2y/Ff7PXw0e4a3v5/Bvg7xj4y8U6JqMdtNqmkXMouPtf2rXfC58yzup/tf+k+ddWzyfaP327zPmH4j+LPiJ8QfjL8Qdc+JnxG+IviHxn8TPGOoHVNa8WeL9W1XxFrOtakJhP8Ab9W13Wbm+1G/vvPVZhd3lxNOJgJd/mANX7NCpmks1qqdOEIQUVCPJdTlNaR5VG1rJycm0k0lafPdflEslyyOS8ItYio5VHJ1Uqj/AHlnf3veSlrprda66b+gfFibT/h9deG9I8KeJfiYNQh8PpBFceKde8KXFto1u0BtPsekvpdvO9hbra/6MYoLi3Y2x8lC6fLX19/wTi8EzfETxJJc65E2n+HdE1I+Jde8X3niJ/C9vauDgzm8We32y9MTCQMT0YiviT4jzaZ4dk03w1DBpeuJa+FPDAv9X06C60+3uPEMqeZd6ZdyQxRCdJEyZ0myJdjMynadv1r8Djr3hjwcmjeMfCXgHU/Cfi258J+JrbQ/GvjefRYrnQJmBm0/xBY28ix3umTkBpLK/t2gk482HdkD0sqSWvLFS95txUUm9HdJJW6aPXS71bSzzeEXdOMWuW1mrtWSXW/bfq+uh/Zn+yx4x/Zt+GGreCRe+PtY1PxYLbxYHtPD/gPxh8UtM0SC38Dfa7fxXY2/h2/0uGy1W3u/9Kh1W3WO8iuP30c4k+avs3xv/wAFH2T4geHj8Lfjha+J7H4l/AvxLNomhan4pvvBum+Hvir4bluIfEnjSeyF/bW9vb/Ej4R3d1rfhG/EaSXPxKubjWYJH1WaSdv46tE/aH+I+u65dReGfEOiePr/AEzRpYJdY+HGtapPBrHg261QeGJ7vTZvE8sbNb3PjEjwdL5bGObTz/Zjh7Y+VX5wfGD9pLxZ4j8S391qGtaZ4o0fSPCPhzwbomoap4WutFudOs7JEkj8F3/iDSoFu11H4dl8eFomm2eHGV10hLR02t7Es05mue8mtPe97+TTW9lpf7+2vkZXlCs5cqW/T0d9lr5n9T3xF/4L3XviPxX45+EXxWuPFnwe1bT7rxxoniOw+IXj34g+IbrQNH0TwNe3fi3VLW1tr+68J+KbnU7rQfD918MZiZ5bC48R3s2jmKS8nZ+F/Z//AOCjHgD9o3xX8P8ATPiH4wvrfXv2UbLwrrt38QdFi8MfEbx743/Yd8R+FLDV/F/wG8c+HfHmj3Wi/Fm/+EeuW+ian4W+Kuvtq/j3wxq0fw2vtJns73xT45mH8svgz9oLxnr5j8NajY6v480TT7W3tpdH165n8c6TpNjYQWllZQ2t94wlv4bG1tbXTrC2s4ovLght7C1ht8RWsKx/ZHwj/aL+OWs/ESbRPDPhLwvqvjH4V3dz8R7Lw7D4P+Dmnat4gm0+DV7Px3oGpaxb+GhoF/p3ii08f2lv4nsJZriLXbZFg1KC8QBCLNORpK8XZaLTT3e3T/Nv182WUqT96Kl6rm/l7p7X9dXY/ZfwjbfBbxJpHxU8UeOPG/jn4X6H4r8R6d4y0fwl/wAKu8ZftBR+K9d+O3hmbWvFvhz4e6f+znqHhX4CfD/wFY69pPhzXG8P/tG+EPhXo66l4h1HVJ7Zbq7mnl/P/wCLvxYXw34U/ak+Eng/TPFei6DonxJ8D/DrWbvxLoehfCn4ixeGbf4j/D7x7b3njXwP4gXUtB8OxQfEbRPDmlQDwzEEin8S3ewLJfTeZ9X/AA3+BX/BUu6+A1h+2l4f03xLpHwg8NeJ4rnwh4k+FGli4+C9v4QsoNHs7XxL4b8DpKsvxT+H1taXupW0Xi7xbYX/AMCbaDwdo9vH4UMekWXk/kv+0LqfgvwzLbWnhHwt4lj8X/8ACSeEdY8a/FLxJ8Q/GeveNvHttJ4503xax1Hw5eXc2jaIw8c6JouhrJcsrrLo2knPm6dZmJ/2vKOinKPTSTX8i6Nf1f5jyrmtze8lZO/vbcnftfbpd/P61/Z2+JGvaFonw5sPDGuLBP4d1qaLUdPWB9QguIrn4gk3EVzApeOVJ+k6Soyy/wDLQNX71/BC9TwN8LPFXxtS31jwroNzqQ0Dwjd6M9npGZV6DVJbF4DKVA4EpbHQe382n7C/jPwZ4T8a6prnjnVRZaBovib+zNbsLSQQ3F1o32n7X/bemRoRtuPteLn7VEBJ9p/f7/M+av0C+Kv7Wnwik+GGj/ALwJfeIdZ+Gvgfxf8A8JrqVzNf3Vjc+I9NH/LDVyJV/tKD/pneCdP9nrX8v8ZZT/avG9WVOEYucXKfKkvaNcr99pR5/WV9j+yfDjMMoyvgeCr4ic+Syp+0nKfs72uoKTah2923zHftteANY/aV0LXvGvwgutV8b+KtY8Mufil4Y0DW7q8tTD8P9Eu/DXgLxZbWWq3BibVvBHhzUL/w/wCEdVMZvPDeiXt5pWjT2VjczW7/AAp+xN+0hpvwg0zXtC1zRtDtvB/hjS73UvE/ifxHaa34XsvDGu6F4qGr+HPE3hP4p6RDF401u28T+ID/AMIPd+CbS+aHUNJB0eW1mswYB9bN8ePBnhf4PeK/EfhuWz8LeJU0fX08aahJqGo2Pj55Nf8A+RH8I6fp8Ri0ZdI18f6zSEk+w3P8Vu9fm3r+vfF34l6F8OrXw9461zwxpHgXUbaeCK4vRa6FD8VLHVDrllBrPhBLlLCVbPWi2r2vxCns2ubfVC2oRXyXZ86v1nwUrZxU541KEaluaK54qe2n2k7fLy+f4b435LlOacs6WInBJqT5JyjtyvVRavpe/q2tz9HfjH4gj/ab/aPh+Gdh8QvhZ8Jvgj4kl8YR/FvxB4P0fR5/EuofEXwhY2niHxJpXiHULiGK61X4jN4qsLDwj8KfCWpS3HhDRLGxs9O0NbW3toIk+GJ/Gb+FPjfrF/4m1LVPiH4q0K+t/EcWkLpFl/wlV+LWz/s62k0bw7KH8ORtbad/oEDQIGhs/wDRY9sBKHw7wj4B+Jvw18Q/Ei4+J/hXRdX0/X9EtbTxFeeOFt9Q1uLWLLWl+ItpqWj3vh9by7t9QtrRQ1veW8qTwDHkuihQPnXxP4o8QaTr9/qmjat4ovE0nw1/Ys2qam6XF1Hdf89fD91PK81nL/t2bxt15ziv1ejiM5yaU/3Kgq0rVbJL2ibV+ayXNvpzXdvXT8WlQynMoQ9jXknQi1SUJ8vI0l8PK0ot2u+W3q+n9H3w2+PvwD17wZdQeGvE+oeF/HelfDPRfhTq+mXmkaZoGl/EP4b+FNCvPGOteKru1jWCHWvHfxS8Xahf+KfGmuXiXGqeLPEd9d63rlzf6nczXUn5ZfGP9pnwrrWi/ELTfhH451Xxpo/xO02w0b4n6h4i+Fvhn4d+FvEej6WQ+maXdeIdGtLbxHqem6cwBsbG7ae2tCAbeKLAr6k/aAt/2PfEv7MGjap4R+JXwF1vWG8KfDWy8Kaj4G8IeOD8f/C+l6JAbLQ4viVdXE4g8N+K4bUfZ/ifqPhW9F3rNvtXVp7mLZX4l+H9J1bxr4+g0TSrtb6yuD/plvdSfYrnTB1Ih8QtiaDPXMdymBwVOQRnxRkeWZW1nU8RL2Uo35Od8l5JO6jzcu9rWXkdfCvF+Y5jkv8AYVPDQhVhU5XJU4wn7skrOSXMnbddO/U/dL4U6ZDbaVBe3fiXXNHisdH8J6Pc6da6fa2l9rlxc+FPh74/ufAtiIijyTT6ZfXkM3jFcvLBd3UclwyXEwfxX47+K/DE3i3x7rln4Isbi51T4QfCHStX8dNFata21/c/Hj4eWlxcHTDGQLi4tL68tpptoklt7u6hkYxzyq3yx4s+Nek23jWTXvC3jDx9a6C/hiDwN4PsdVMhutA0W30m10G31VkkmP2SS30Sys9GhmiEbxaVaW2nIVs7eKJPN/E3iHVdT8NXXipdW8Q3GgXkfgi20zU7rVL6wuPFsNrqNtqsEGqaI1wo1WG31Wxs9Thjuo5449Qs7W9jAuLeKVPy7hXLKss6k+aUqe/K23Cz1Ss7pPTT0elrs/dOLszp5rw9/Y0IU41pwi6slFKdSyXxySbn3u7rW29k/m/4qWk2reM/Ey2UklyI44Io1ZmcJFbW/wBkto0BJCx29qPs0CL8kVviGMLGdo9G+DPw/wDAvifUbeXxt8VdA+DtvYaR4mkl8V6rpN3qUstxZFRp7nSdGikeSW1O37IxUvAwXyCpC1yVl4L13x/8Qfirp+najLpsfhfw14j8dXV1ZzyWuNOsz4NVYC8DKRBGuogwx58tDcXbIF86Ut9PeFfhXqv7POmXvim7eKPxfqWgzjw1pHiLTVuNGsfDF0c3HxO8W2d6ktvcxzZxL4Vvo5BKP9ZExIr63NdLq7Wtrd17l9Vfvts7v5/leU80YunduCTSjd8qsla0dtm+n5n2l+zV+xV+xd+0ro8eg6T+15/whfieztfB/jTxV8W/jvJ4U+CXww8MeG79Gf8A4Vv8M/gxrOk6p8XP2qvj7eBSIPCfhnUtL8M3DlU8NL8dpHVW/pW/YB/ZHf4V+HPF0X7EWi/FjT/h18VtIi8CfEH9uL9uG9sm1jX/AARb339qwaP8A/gm0954c+GHwmh1POoQ6v8AF+11fxJHen7SkIuAJK/Hf9jT/gnwP2uv2Vbvxp8EL0al8c/D+s+DLz4lftda+ZPhN8AP2Rfh3oFxe+O9Y8GfDP4oWktrb/HL9oH4k/EEpo3xX/aE1rTdb8EfA74VgeEfAunaZ4X08W19/SP+zp8DLf4BfBLw9pPxL+P/AMV/jVfanL4g1Lwp4K13RdE8LJqWtaneHxlrfjP4efB6+nXwJpeo+EdC/wBB074q/HHTPEXwu0ywAtbXw9Bbnyz8rmknGyjJxTteKeqso7tJJ38t2rtLRnpZYlLn5oqTSdrpPXfq+m9rrRejfH6P8L/AWvePzq/wvvdY/aL+M+jafpy+J/2z/wBoOb+ytPXwJqoNpe+Gv2Yvhh4pmvPCvi9vDVupbw3pvjyKL9lrT4Xhj8J+B/jPsmtj+aX/AAUr+L/7FH7Slj4O+HXxq8feKP2jNR8XL+1p4++Fvxh8D6/4a0b4VfszaN+z94Bbxvd+AfDni1NMOufF74F+PfiCG0nXPiR4mlm8R6zcQrJdyz3MUbDyf/gqL/wVF+HN/H8Xf2YbXxq/gDUNX8bfGX9nvxtbeGTd+ONNtfgtN+z7pCzfGH4keDNQS58c6P4/PxY8TeITPouleII74y+E47p3a7sLRW+XdD/ZR+EviD/glf8AHH9rPVP2o7gTfs2/Bf4n/sv/AAi+G3wmm1Pw9aad450rxT4B8QfH3QPjDp3xTlv7fXm+KHib4k6JNptl4dS7l1T4deOdN02eOTTPA9jDbepk8JKKlJNczTV09Y2Wqb0a1732fVHBKycvJv8ADy06a2Vj8dvFP7c/xg8FfCf4vfs+fCfxBF4J+DnxY8U/Dvx58QfD3g3Ubq505vEHgay0+11GwsdKmdNMEUsXibRbO9jMC+db/DTwbBIfJ8K6Q2m+S6L+1j8btChvpvAnxP8AiB4C1vW/BnjX4c+OV0jVNQtdMvPCl2t0909qlhe26NDN/aOoR3UYXy3e9vc71uJWk+TvCR8L6h4j00+O7nVLbwYl6tz4slsof7Q1tppixupbKZ0ebz7l1gMk3mr5iofNLDBr7A+Nvg7wN4a/aS8UWEngPxJ8GfhOniMaufh2dC1LSfE/w3+E2tPHL4P8J6nc+Mb7VdQ1fxjp9rc2kPxEN8bubWrqG+ku7q5KXVrZ+lKlS5UuSPNq23CL/l0d7q6STtqtYq7ueUqk7r35b3+KXf8A4B8/obC1tj4f1K51DSrmyvbrUr5dWnl1bSZNRvvsn27UNHtrhpLeG/vBYWH2u8gRbi5FlZ+bI4tYdn0xofhzR/Dg0TUtLudNTULW+8J6nbX9vFDDewalcf6/UYLqJVnivps/vbtHWeT+OQ9a8r+P8vgHxL8UvEGvfCd7iw+Gl/qmpeIfDPh6/wBPEN58OdOsEhuLz4SX0UqJD4g134ZWk6R3finY7fExIlvJ7i8lnaQ5+j6br2rWNh4oge6j0vRtY8IQ69bRzSrbWqHxq1ksbQKwjWMW+2327dotx5OBH8taZXgKzqKbqVG3Zu85t300d3fo+9tr6WJzbMaTiockFdON+WNteXW9lprr/V/9Ur4f+DfB3jP4F/CHwPPqjeGNR8VfAT4N6d4c8TazLqXh9rLUv+Ffk/ar+90YwSC7Pad5RJ0/eAV7NH8DtE0r4VeEPD+rj+xtLXWPs/jXQrG/+06X43t8n/R9P8eRt/wlXhiD/plHcwJzjb3r179mnS9PuP2dvgOmtWcs2pD4T+BnFxdJ51gGtvh+fs7hZQ0YaDH7lusX8BBNemaz4D0FViu9EkgtbW3k829vQkeoy+Jpf+eusS7XbVJOOXvTO3vX6qs1+FOckko3Semiiv1T8t1Z6v8AFJZW+Zu32m+t94/l+r36/L/w/wDBPhjw5f8Ai+7tvA/hme+8UW322wstMbTTomr+HOCLG5s9WjS1uvFHX9/LHJdnu4rjfEH7e/7Jngrxs3gHXPjLG3izwhoENj4h8E+HtJ/4WFqFlqtuP9GvNDsPh5Fp/hawvIB/qbuziWeL/lmVr5M/4LMeF/iZ8NP2IYvGvga78WjxPpfx4+FGjeKvEeh+I5PD3iWy0DVNSOkXuq+AYrC8tbzSGvvG9h8ONUv30owyXXgLVfHVpOx03VtUju/5jIvHmn2vhG017UNdfwnZtqf2vWr7UYGt5dU8Ncf8S/Upjte98Tf9Nrppbr/aryc3qTzSPJRnOnBWThTnKML+6n7sbR3un8z6nKacPaRqSpwlUSXvygufZv4mubXffqftt/wUK/4LbeLPGOkzfAf9gzxHZeCNPmPivwl8Wfif8XNPk0P4oajq9vFPBH4P+FWiactvYw3wjuHEXjGykC2uyB7R4biN7ib+aGbRPC3hLVrr4ieOvESftC+M/B/hz+2PEWhafbLqMPw914f8wnQtbuBcHWI/+mFpKV6/L6ec+KfjZ8OfDyR+MPFfjO21F9Pjmt/CTeJPFHhO/u/D8VyM3EHh7w/Y6dcNpUVwP9dFpsFusvO9W4ryuH9oPw7p/wAMPEetfDHQde8G6bLfWUGl+JJNEXRtCufFOuqD4j1Pw74BvUh02Dw54Yz/AKJHY2i2+nsCsQiYED595LF/HCEtr80Itv4e6f4/8N9lHN+Re7KUVpFtOSV/d0un2tprpbpt8v8A7R/7UmufFXSpvCcOrxaLapfm8h8GaNB9u8G+EfDRt/sg17xB4p1QjX/GPj42hFsfEF79p1X7OPs4uyoEZ+W/CHgTx943v/D+k+CfCHinxWt9r48N+F7rQdB8SXWlnxOwz/Y9smqaqYIk7tbxhADnKZyKr/EW/wBH8ceJzf6PZXiQaPoC6drt/r2oPczXuoqci60+a6eR/tWfmEyt5h6lsYrp/g/8Xrz4Ya34DttX0mw8c+HPBnjhPGg8MNrepeD72HUkVEGpJrmizQSw3yxrhb1JWuVCpGHCkFeqC9npD3P8Pu7W3tb8vO6MLq3W71181v59169dT7//AGafH3w8+DnxW8R/Cn9rP4TXWnfEPQfHZ8I6p8XvG3hrVb74gfDPUld4z4O+I+iLey2X2pnjYp4y0NmuwgBe4/ib7v8A21ptGf4P2Vh4c1i6ufC9n8UPCd3YaJq9tp2mw3Wg3P8Ax8a3oOr6PhYLif8A5bXVq6SS9JHavx1m+Mul+K/j38QfGvhz9m34Z+NZPih4h/tDwt8Gfida/En4xX/hK33GZLLwe3hDUrf4j3cSxl2SHW/EcSERr+4YlpR6b4p0L44+EfhTp2nePLKHwh4Ebxr4Ol8G/Dm88RTeIr7QNBJBOkm/nuJxZ6Wev2CLy7XP/LHvTcnaXvNWT1u9NL9f8/mWpTUovmlq1pd26dE/0Xz3P7Zf2YfB1x4c+G/w+s7HUPPtLzwH4N+36PDZf2pcaf8A8UN9rHlQ7ZPJzd4uvkVcXH7/AP1nzV+mfws8FeEvidINC0WDwVP4ut1LJ4b1O+1aPxvEqgkmNfEEY0ReMkhJM9euK/nw+I3xH/bP/Yv8deH/AIl+FPAHxksf2f8A4tfAn9mmz+H/AMXPhf4NtvjH8P11fw98P/8AirdQ1DSLtL3WPBt9r3/Mbu0t7W41PgX8lxji38Rf+Cq/jhPCHht9b8ZeNvim/j+H+ydR0VvBtzqPiTw3e8/v7B/hb4f0a5sJuf8AWwNE/HWvkMRkWVZ1lEqvt5Tqp/G5tz05dOfWW/S/yslf62lxnmuUZsqUqMHTaSUZRTpp6JPk0Ts7dm+63P6e/D/7M9j9quTBoNnahP8AkManL9n1O6vM/wDQMuXSSVfTETiu/wD+GbI/E9pqvgjxr4W8LfEH4ba5aTafrfhL4iaDpXi7wrrNjc2/2S4stU8PeILXUdI1G0ntP9Gmtruzmhlt/wBzIjRfLX5NfsR/8Fjfhhe/BXw3a614W8beKPEvhSDVtKaLQ59R1P4kNe6D43Nl420LxHpXjKeLTb3xRoFsRbK11cG9gtl8iOWBDx6F8Q/+Cz3iPxn4gtfCvwc8O+Bfhxourlfs+v8AjS8TXfHNuRkEQ+DpIP7Fw2cnzjMeBtK/Nn5HJ+Hc9pt8tOUUndKC5bq6tqtL6dVbrqfS1+KoVtJ0qVRSXxVYqSjdR+y036a63s7Xu/SPif8A8Ehf+CRukaV4k8efEb9iv4B+FvDWgop1Kae1+MPgaOyXbgPF4c8N6tZ23i/zCd/yW0y55QBcqP5n/iz+zl+zN+0B8VfE/jL4HfBLwL+zZ+yz8J7SXRvFHj+yvPiJbfCfVvBPw3iNtb+OvFPhV7uwu9D+I/i+yCWGqeKPDWnt4g1e0Xy9Q1C7aSZ5fcf2p/2zPFXxims9R8W+Jfi78StVg50GHUr3xJ8KNJ0c9M6Tb+Crq1g0/PQ/ZEhNfG/xN/aW0ZPh7Ff/ABZt9cl8U6Vrt54f0XwBp1tPq2hXvhvRf+Re1DxBcES2l7/wlH/L692sn2//AJbmSv0TKcRnMNqNrJXsrdr7Jbq39PX4LM8TkUPhnCMnq+RJJvT8G+92r7mr8e/jTp3w28BeF/BXg7U/DfiT4UXUWj+KLGx8X+LPDvg/x9a6J4e48P8Ai628X6XpkWpwadoX/MH8DRXa22mf8uVpDnNfoh/wTd/4KieK/Dslt8Ite0zXl8MfGDXvE0o8S/EaO9i1PwZ41heKX4meCfhn8UoWkvfiFZWEsEUtxYeINRkRWQhlCyzCT+eT4VfCXxr+3l8RfEnhC48b/HNtTi8c2UXgSLV1/wCEc+HPhuPWmDeI01nSNJul0m2XwywxaYt4/sa5SLYrFT/Ud8Qf2IfCF9+z18HP2Z/gL44l+Aek/s2+Mdf8c+BdU8Tw/wDCaN4t8d+KznxQ/wAd2cSiPUPEf/MduNOFxcav0v5LjHHs5XmkJNKajJqSeqUtmrWutVfSz6PY5s4yhZlknPQSpvl0nTShNrTW8Unte97vrufbfxt+Dfxt+Imky+JdC1LwV41EH/IUtbrx7o41Of8A7BEk160sf/bFlP8AOv5d/wDgppa6tpnw3tNOvbS8ja2+IHg2XVBrn2DTPsEv/PVBpJHlSf7Yw3vX6S/Er9hv9vjQ/DevXXg7wj8DvEtrY6J5tj4u8A/F3QtEezl/562mmT2Ns1u/o8Ko3v3H5Aftr/Br4ifCj9i241b4y6vZ698UfFPx28G3mpWeheKdY8aXNrpP/PgPE+v3F1dLYD/n1Fz5HYR19Rm2eZsqTpqhGMHFrljFKNml2Vuu6S32ufCcJ8P5PKopzqc84yT5pvnd04W1fva26t9b31P6o/hT/wAExv2PdZ+Cvw28fa98LE1Txfqnwx+EWoRHxF8Qtd0G0XULn4fjz75TpkqgXk//AC3uRieX+OQ18xftZeI/ij8FNQ8N3nwl+Jnwh8IaRo+q+LNO1/wb4y1LVPD1tP8ADu2/495fBel6P5NrZeKYM/ubzT4YruL+B1r96f2evC9trX7LvwIhvJNl+3wk+Dm6BsYP/Fvxj5DnOcn1xjnrXz3+0R+yH8Gfir9iuPE3wntvGXjLSbOa30vX5LHxBqGseGLO55uPEkmkeCdR0Pw5ZalcY/fahH5d1L/HK1fydnORUXOUpUKWspN/uoX1ab6LW7/qx/WOT55OMIpVaiUYpazlbRRW12rPS6289z8z/wBmfxN8Of2qfGWm+E/BXxT8BeINA8C+EdB8T6/4j8XStJ4d8Ax+Of7IOl+GWXUy1npniWH+yvHotSnkTxf2QwRkERI+KPGX7cHjb40ftLJ+y5+xz4J+C/i/w34gvfFnh/Tfi58cPH/iPQU0yxtjdCD9o/x/a6Azt4b/AGebcWHipoB4c8rX4xfeERHGr21go9a/aO/ZF+JPwv8AhL4o8AfsP/s767qN5+0J4a1jxHr+pfB7QtaisvHvxX8O+B9XuvDt3enUtSs00XRNCu/EOvXOjC4Ij0y51zV5rHyJNSvWm90/YC/4Jm/s/wD/AASB+G9n+1L+2j8RvBXi/wDaM1vwX4d0Lwn4LtdZe5+F/wAMG1EWn2/wJ4Pmlln1XxzLfvYacL3xh4limF1/Z1sss0y29tKnn5Vl3D7TnUjQmoq1pwi3drVpf3Xrr7t9HfaXkZzxHnWZy9nRUqakuW1NuDs7JyfLbpo9dNe5634I/Yn/AOGWLd/jN498aeFf2jPGerPd3Pg+91bwLrXh3wz4T8H+H/h+PEPj7xv4R8OnUn07VPifqFvCdS8EeJNc/wCJvD8Mo5vHlpqD/EKSUyfnJ+0H+1Hb+KPEGqeBvgOPC/gLwd4d8LeLZtX+IWk61d3g0jwnqdx9sufAvhnUbF1k0ux+J13/AKV4u+M9hLB8QvFNx+/1m+vpPmrC/bo/bN+Pf7YXgT4jfFP4U/C/4q+LPgR4c0/XH8Tap8PIpofC3iu90O4+0aH4Zs/El1JDr/xx0vRbkm40vT/hw+k2emTEz2sUD5evwx8J/GLQPAvgrRfAHgS6vrFNU1/wQ2pWl5cSxW+oNb/6g31uHEV20Of3RnSQxfwFa8/OZ5rn9ocN4dKkpqLjShGEUotc91BRS5VbRrW+rTVjLJ8oy7K4OVfFVJz5ea0qs5JSsn9pvS6tv+J5b8TfE/xG+Et/pFh8ffhx488G+NfFGnHVvC/izxpqEnhJvHngcSMon+Fvgmya3jtLd8K6rq0KQBZFDbZNyLu/Af45+HdQ8UeIrbXfGnhqxe08D2Uthqk+p6fpOs2cvg4H+3JbOcaPH4d8WSX+D9vbzrhrrB+0F8V8pftDfHX4p/t7ftReL/if8Vdb1TxL4s+KfiaDwP4WbW9Tv9bsvBvgSO6bw6tt4bXVprpdE0u38Kzz+KVtNMFtZfbXl1GOPzZGlb+lLwP8S/2c/i58L7D9lX46fsx+G9F+FY+FCH4Zap8NdBtNG8SfBjwV4ov/APhH/Cup2F3pOn29xe+NIPCv/FX/ABR1WxdNR1e+xqOtT3Fx+9P6dj+H8ooZJCUavsJqMVOVGXI78sVPWDV9eZuztfayseVgM3zCs5Kpg6NZXbXtaMJ+j96L1tbX73sfHf7FvxSl1Pxlr3jnQ/CHh/Wbf4tXFprVrb+Kby40LxPrVtp/2v7BHp3i7TFXUfBqWP8AYnhz7Gtvd2y248S3YhCfbZg/6Hf8FHv2ooPjh/wTJ8e2nivTToPxH+GH7V/wm8FeMIvEd+ft+t6Romf+Eb1jWptOd7jUp/E2P9LuL5ppL7/ls8lafwe/4JQfEv4VfBP+0tI16UeAp4PJ0rx/ous2Vm3xAt/9EHlf2baTxt4dgJ06xAQrEmbG0GM20Oz4e/4KBeENC+Dv7F/xlh8H+NvAevWfiH46/A/WvH2p6BfSeLfHGoa/p/8Ax4aVBrGsGbVZksf+XSF7lltj/qVTivmcmwmSYPiCNbI6inWaV6sbe02gmvaL3rJXS16JaJ6+vOjxFUyJ5pOVSeDTa+ryqTlQje10qTbpq1v5dNW10PzT+A3wWtLrSf2dj8DPGlh4S/aW/aN1D9oIeOviR4kKW1p+zt4O+EvijVdM0Lw94C1a8aTUV8Z+K9Pi1iDVviNoE0F5e2UOoadJqMFr4P8AizF4p+n/ANqX4U/En4deJNG/YA/Z08KeLNW1r4F3+t6r8XPF2tpc3Utl8R9chvn+Nvxm+MF3pUySaTpN1Npd2ngXQ9HnmfTIvA1/PplvI3jeWG/8E/Z18Anx78Kf2Z9V0jVPDt7rnwf0T9qGHX/Cdz4w8RfDbxDrNt408Z2vg7QdB8J+JvHk2qfBODxbZa3Z2eoWPgez0JfAsF7bwXUMSzoj1+r/AMG/2sp9W+O/7bPxg8HeONK+DHxI+KVh458E+LvhZ420jUtQ+JuifEPwxo8PjHxf4etPEOmxNpSfFu517R7fWvhlrUV5/wAI1pOkaTB8G9HvrezsE0qL9XVWr7sVUqWvqueSW/ZPa1vn97/PcoVm2kk/e12fTr5K+n5HnP8AwS6/ZXuvHXxD+MXw7/Z++Itz4i+Pvwr+Emj6j4s+M+nS2114m8R+IPiFrg8GWPhzQdF1qZtM8IfD9PBoXwmNGhnh02Xw4Do80Mli0kDfP/8AwVatdU+FHw9+E/hm68KeE/BPxU/aJ8Z/Eu8vPGOneEtKSXR/gj8PLKz8GXekavYWtkk73/8Abut+I9QeCcEfbvDNpdbRcWUMkXw5+w1+114w8B/F342eEpbKXQPD37Tfws0/4D+JG+GWr3Hwx8Q2l38HNU0zx34f8Uy+KfDkuk3g1nX9O8G6zBc6u90b29g1C7hmneOZ1f6q/wCCjn7R3i340XvwD+MPxG02G/f4e6p8Rfht8QNc/spdNXXLfWtau/iNrPiDw/o2ix4+36tZ6hfjU76GP7RfrfXn2qSb7TNvzcpPOoxlKTha/K23G1l0emjv03ubP/kT82jldpy3lut5bvf+rn5IfDT4aarf6/Z3Gl6z4hTxZpOszS6Z4i0bUr2013wslxIslx4ufVbSaO+sdYmkRHl1aKeK9do1LTkqCP0As/2j/wBuj4LtpHhsftHfH28ik8Vj47+J/Bln4+8Xv4x1DXZ/EmqeNF+K+gxrrv8AYHxi0dvFN3f+J4/2j/hlJpmnzeI7jU/EP9l/2lPPOfkrTPG3h/wPdXNz4Y1bWrXxDr6/az4y8Jpcz+HvEWkf9A/U9DvTHbalYd/sl3FPb/8ATMV6Ha/FjUvisJ/CI03TfP8AC1n/AGzafY4bvSI9J1z5v+K++H/iKFIn/Z7+IQKnPws8Xz3/AINGR+5yw3fXLN1FWWiVrpXS05ei6aef+Xz8snVRWnCErq3vRUrN8r0urrVt6W1bfr2PiPxn8WPjP4gPi34heOfiB8Q3OmQ+FdVvviT498R+MvEXi34X232z7Ppuvah4k1PUr7WvD9v/AGjf+TpWoTXOnxfbrwx24+0z7/6dv+DcD9oHU9O8RftI/sQazHo1x8J/DPhlPjt8JdGTRY5ZvAWvabqS+Ff2gfASapHEY9c03UdBltfFngrTB5lhbXRl1C1ginY3K/zI6fa+Jr97fTrPwhod6dKsRpkupW97baXdHTT/AMw9rmLypTY/9Om/yOn7vFf01/8ABLGXTv2O/h58RPjH4/8ACXh/wP4o+IHh3w1F8KZLjSdb8NXuieEtS09tL1H4keCLrxFf67dalbX1gUtLzwnrUtv9rtoo7W4jktN8EnkYnMaOfR5alOnVhb4ZwjNdNoyTV+m27ZeSZZVya/vSSeqs2raprZ6q9rrttY/eT9ofwN4T16Gyi8Tf2Jd6JBIZrT4ceIPFV94e8JanN/z1uPFGlzJrtxL/ANNJC788Hjn+cv8A4LYzPdfsA/ES40Gw0fUPB2h+IPBc+rx+C9Os/hx8MfDl1bfG3wDpVnNqGkaVHpl/4vmg0/UL7Tbe5ntLqazsb+8ityIpZIpPrL41/tX6rql0niCK98P2XiSb/kGeKvGSW81nZev2PR7ISra/9sUj9MV+Cv8AwUd+OniHWv2bfiRpOvt8XfiRq/i7XPCDN8XPiSkGk+HfBuz4jfDS92aJ4MSaW30dnvAJ1+w21sPtRWYkSZceRHKpLlV3yKSfLd8uji9k7Lbp56729uWaU53Uoxlpa8op/wAvdP8AVb+dv5qPEkA1L4iatmwnfSn8QTSM7IWRnuCDcOysCpa4OPOY5MhGZCelfRfhz4Vn4sL4Y8PeHb/WfC9nceI08MfEDTLW3tNO8NeHbOIkrr8Wn2jW9p4pvDuO698uW4Y7T5oZUZeC0eSx1a+1TTLicwIX837erFZ/N/56ecD5nmc/f3bvevUvBmo/8ImNP0mR2uYtJYvpV5ZMVm0xznL6fLGQ9mxJyWtmjOep9fq+VOCi4pqy91pNX9HpueTHSSa0ba1Wj+9WZ+hmof8ABLz9nLxF+z94S1X4T/GSTRv2lNd8ReLPEU2mfHfxL4M8IfCabwnpisI/hvouoaJB/a8PiiydxLdeKoEW3SVVPiuL4GqCrfNvxU/4J8ftf/syfDTw/d2N/wCFvFx+NereMPAGveA/gB4o8R/Er4m22jRi3kupfE/hzwCNN0e78G3i2FmIbO7EmlC5tbUSWkoWJrfufD3jz4c6v4h8B+K9XvdVlk8Kai2m+Ebm5uZ55otOf79hqE0rs/2Jh961dvIYdUNfrD8Hv21oLG90geIvEVn4Q8TX17Po2o6xpF2cWOkXI/0jSkubZ1eLTZ/+W1iri2l/jibmvlc1xOcR976vGSS0TWjS5bLt1utHZ9Hql6kIQSVko3Su4qztpfb0Pzo8Nf8ABvh/wUVubWPxhbeC/gZZRQHwwTZ+Jv2gPhnpl7pBukCv9uXSviMs8IkAIuvNmlFwrYxHli36mH/gkL8YvH3hv4Pw/tD+PP2dvh/4q+Bl3PqPibXv2NfB3jX4s/tUaxqVzK11LqPxI+IXjS+h+D2l3xvWGoG60G3aWW8RJZ2l+cN09p/wUO074UR3XgKNJ/iT8QNSuYLL4leL9Y0DS/C2ofEPxHbf8e994a8DaVGnhfwt4Yt+fJgt4YLSL+BFrz+1/wCCk+k+D7rTpfHXxD8M3UGuax5Fx8N4dQ8RazP4V8Kf9FLutJkaaK2h/wCpSECIf+eGDXyazHjLRfU1bb4Ftt2fT187npfVslSv7bW383ptqu/l/n95/s7f8Ev/APgk58CfgGPiDr/wM8TftSfGibxB/b9rrvx0+KOp+IbDWPEWy7iTSta8E+AbqD4D+HVjhvr2GNPjB4T8WP5V3cozsLibzMT/AIKW/tAeHvE8vw2+Dfw/+yaN4U0nwP4j8R+MrLwJ4a0bwd4S8Q+J9JSLXviLp+uaRo0Njpep/wDCM+EIItB+D0V5bTL4W0ZTp3h1bG0Zoj8MfBv9rPSviX4k0nS/h1ZePrj4oahf+LNG/Zy8N3Xws1O0itXtv+PfxfPrWuX0beLNbt+sOr/CqXwzfxfwXCjNeV/GP9l39pLXtWbTvEeifEfT9VedtXfRzY+IUsns3sv7NaF9Y/tzY0L6d/oDRlyjWX+ilTB+7r6DJsyyrBSbz3FVKM73s6ko3bs7WTXXRLorLTY8mrgc6x2uR0vbRT3spNJNL8Evv8z4a8Va9bvLqk8t5a3U/wDwkPmed4YKanL5g/j83VMvvGfvbs+/WvjX4n+JpdV8JanatcTy26674O228k0jwLjx+SdsLsyDjJ+70A74r678d/By98MwapFqdzYnUfM87yBfLq2Zf+eoDPL+8yfvj5s96+GfjLZPpWnvHFmGOTXvB3mRxHy43Bn+1neqYVv9JzcncD/pH7/7/wA1fR/2jRe0Y8rtZpR2fJazt2t/W7/syvFXc53irv3nuuW/V9X+P3fdf7LHh7/gn5rng/Udb+Of7P3jH41fGHQ/Ea6pq99q3x00j4SfCW8sviQR/wAKphuvA3g+2g+Lc8Phkr/xWqtrLK4JF1lWOfkf41/F2/8AH3xc01NP+A/wj/Z7tvhBqnijw7B4N/Z+8B6toWjaFr1rI8cepeLfFnju61bxH4z1e3lR/IvdXurq8S3RZYmjE8YPkHw/+Ir+BNa137Jd3A+2aw9vd+XPKn2m3l/1sFzsYedDJxvik3I3O5TivO9T+IzeJPjTrfj+zuU0uTVPFs/iOO7srIWtwDdSPJcSLNAiSrJO7s07Bw0zM7OWZmy80oZY8llKnWnKq4yu03KSTgrvTXS7d7aPXTZeflGc5l/bag8PBQUoq3LHlb5orZLV6eV+urP6wv8AglP4e8R6nN4s/aB+P/xD8XatoWoeHr3StRtfinofi3xH498d3/jH/kB3Oj6nca3qGqeF57D/AJcJoJ4Jbb/l3ZMmv3i+EvwE+FPx58a+Fbj4x6z42+KXwZEYtfh5+yz4nKaL8F9X8L/LjxX8RPAVvJJ8Qf2gYwwUr8R/ire638JOT/xTRDCv5Qv2NPioLnwD4p0HwDpd/wCF9P01rJ/EGva7qU2ofE/xM2m4/s5vDttLI2ls1hn/AEMwyk2p/wBRsPNfrj8CP255dG0qC/8ABXiyy1fxHPD/AGTd6HpKGS00u+H/AC8W+s6qVW2n/wCmsciSejV/C/FuHzynxDKrTpyTU7qVkpxSlFxtJptO0d42bV1ezaf9y5dRyrO+AlkqxEpVrJ3cpSd+VaJuV7c3e9+yumf2L+HfhB8KPhnq3jf4w/C74W+Cp/iH4v0rTr3xRewi3XXfFljoluRo3gzwtqU0c1x4Y0HSWy2k6JaLb6VYu6CHTwVaSv8AP4/4KjfHrUf20fir8b/if8Lte8F6R4t8SW2h+FdP+G+sa9bH4qweCvhwSbjw7B5sp0qLV4ySRBHKCpydo5r+lKb/AIKZ6v4Z8P6Jr+j6/pVxe67q/wDYz+DVus+P5rvj97Iiv/YckvrI0hf0brX8pv7av/BP34FXmsftSfFr9n3FvD4o+I2lah+zt8NvD/iw6h4U+Euha7FCfjZ8T/iH8RtUvE1rxAXmtyPAOhTyS3Nit1M9rFOsMEC/sHBnHuFxMVTzp08JbkjCPIoQlJuMN4pRja/M3L3eVSlfm5Yz/B834H4hoxlGnCq42kkuaWkIpWVteZtL3Wlq+VaRirfTP/BKj/gk78a7rR/B3xU+N3xB0P4O+H7/AMI6z8avCss1zB4k8V/DXwnqyNFrn7Ymp6Ms03hvwL8UW8K25+EPwo8O/FCDVPE+jfE0zfFbRI7XVbYaxL9e/wDBSn9qL4caL8LfHX7HH7M/jTx/8LfhLrfgG5074g/tHR6r4c+HcH7QninU/C14k3w98KeJfFmk3Pin4ifDG/8Ahtr3iPwZZ+Dzffs86DL4k1TWf+EctfjjJruoW83y/wDse/8ABRrUv2dP2dNO8F/ELxd4B8UaT8AvhrfeCfgx8EpLW41KP9qf48ayZT4V+Jvxh165SW11j4c/CFZWTwP4K8TJeWHhNViTQ7WwSGFY/nj9oD9ufRf2i7Oz0W88FfDT4deIbXW5fFPj/UdK8H+JIoPjJdzX39qTeHfHklrcx/8ACHWEup/8TGWx0Jvs8l+PtbxG5/eV+tV8Rm2axUMnoRxlK8fdnH2keW8dYqUZJabNx0fRs/PMkpZXw1UnUz+vKhUblqnytt6WbVnpfZNK9r3PKP2HP+Cgn7TH7IHwM1/4f+PfCeo/tHf8EpPEHxa1D4WftFfBvXBot3Lo03xB8Ji98c6H8Ldb1HUINa0rxTpfw6C+L7rwPpU2n+CY/ir53iES2mtTS6iPir/gob+x78J/2bfiL8Pvif8AsseLNU+L37GXx/tNJ8VfszfGa6EhutS/snanxC+Gfj/zoopdH+Img3Lss0N/bWeppEit5UQ8wW/TweGfCfg34kfDzx5a/DLTfFvgrQPFd34h8X/BR/HF7ffCD4mR6hb/AGW/NveSzST6B9ttf9HvCbaM3UH7qbfH8lcJe/tC+OvC37Lnx1/ZM8eeBNK8RfCP4l/EHw/8d/hDo8+qajHrH7O/xEsviCNW8a+PvhDq0lu7atoPin4aaT4r+Ani7wrqt5bWWv8Aie88H/EG9t5dSsNPmuPusowGcLlvQtor+4tLWu1pp3Vretz4fNsxympN2xLleTaTqNp3ate7s99b6PWx+1P7IHxf8O2//BI7UtL8JeMY9I8Y/D39s74Y+EPiD4YuEbUNQn1b4ifHpfEtla2cfLDSG8L+HhFD41Ax/wALH+G39qLdNq3jE3E/d+BtT0bWfiZoXiS903Sdb0zSPid428HvYaBJbaT4ZHgyXxxeWkrHTrYRWH2OS18X6LbSQeR5D29hYwMpjtYFT8m/2Pbzwv4J+A/jvXrTxBr2keJ/FN3qJ8W6JY6VYeItEm8I/Af4paf8cfCGj2NlrCPbtruo+KtK03w7APLaVY7K2hiA8pQP0F+Cml/DDRfhdcDUvFLaN4+8PfGnxjpWo+HHu2v/AA9r9j9os7saxaagWe3m8I/a9O0+6+z5aw+0WNnN5fmW0Dx/ruS5tHKY/vmp6LSV3ZJR/mvd/wDDLZ3/AB3jLJI5zL3IRa6Plina61tbT1e9tke4f8F7vid4c0b9lP8AZ7+GqSXGv/Ff4my6/wCF9a8XSu9q5+FnwZ8b2nifQNcn01v3skOveMtc8R+Gpnl3JPB4YtLRyyWMEafyVQXNxp+MzzDE32gYlcYn7z8NxN6SD5/9r1+wv2yf2o/Hf7YvxH8RfFbxRr2oa3peh6ZdfDX4MeHf7Qu7V9J+EHgHVrnXH1G3ga4b7L4i8c6xd3eua/eW8UF3rOualquo3xu7u8nuZ/jq9ubWe723VrrcC+i2Niq/goAHH0GOnpXwec5zLOM6cYTqRi27JSaTTfZNKyu2na+q1Z99wlkVPKslXtqdKrJKOtSnGTTkocyTkpap2i7fy6d39K/AL4f3fiLRPjR8Sp/DfinV/COjaHp/w714eHha6Pe2r/FBbZPIaW1MUixXi+E9eW4iz5dwuoagsqOLq4D9b4L/AGG/jL8bYfE2t/swQ/8AC4fD/hvxPq2leKfCt7qNhoPxL8H6Dq/iF/hj4G1j4jxzSx6N4fn1ssLWOfQLpDJb+ZbsZVkHlweHfjBoPwg/Zc1zwR4attcb4tfHq/8AEfiHxtDFPbRaDoXgbwE+qJ8O9UW1hYwx+NZ9/jp7PVQg1OFNc8Om3nUiBW6X9kj4t+Ifhr4K+JfgzS75/COgfEPUNJsNbi0y4kW9kt/D/heeLw/Fc/ZJEeaHQviBKni3R45i66Z4qiXX7IQ6qq3Q9HLak60Vk1WU6lW6lzVJOc18LXvSu/Ld6OzVm0b5io0U3SjCnZNJRgopqTSaVkrPXmVrNNKSakkz5Rn03XrD/hI9H8ZeFvFmn2XhayXTdQ0fUPD+sTa34RsF1saCLG58Q+ILcXNlaHx3t8LtbiaOFo99mUK7o68WbUS/h6DTndna2k822DMzC3l/56QEk+VJ/tx7X7Zr9ev2/wD9rrxV8fp/Gvw21vwh4ss/i/4g+JV54p+J/wAR9E+PfxF8U6B4w+HHi6xh8daJ4O8b/CHV9XufAtjqOmeMXXx1ZQaRY+XZ+J0fXLdE1mSO6m/Ie00GK1uNSsLjX9Cgkj+4dRa9kaP1KGVTt+oIPv6+Pmitm6hokuVOK+FP3E0lt3V7K/ZLQ9TK4RkrzipXV/eUZPVLV6bvfWz6+b9Q8Z/ETUtM0H/hXtnN4W0Tw/8A8J94u+IZm+HU019D5uvxBfDHhwxlYoTpmiuZTo1iyNDY75JYEjmkldtDXtGh8L6XBqFtFdvHbax4et7YAvi3g1kf8TeCHB/dQ6oP+QlHHhL7/l5WWvKvFa2Nsuyz1TTGXzIpdul6bDAvm24xBLiCNB5kA4hfG6LJ8sivoTxFq9/rnwYi1CHQtZvLKDUPByazrljpso03w/4l/wCgXqfiVEzGuP8AljLcAD+7StFuPMk0mt0nZJra6flZeXkZSjG0nGMVJqV7Rirt3fa7u273ufsF4R8Ffs7fF/8AYc/Z88A/tB/GbR/2cbG2+Nvxg8Y6T8WPCPwO+I3xLjHj/wAc3Nxd+Ah+1drNqZrj4TeF7ea8vrn4O2nwhl+N9n4re8vLnxxDHJLK9eX61/wRE/aZ8U6VaeLv2W/EfwT/AG3PhxqTZj1z9kr4o6d8Q30j/Y1P4d3l9ofxvUZzjzNVzlsEkfKPu3/gm38SPBPhD9jXSNH1b4ja/e22vePvGWm618KPDt7farb6/rdx4y8f2kl343+Gmqzt4B1/wpdWNlYQT22sadd2k8FrbRSxtHBGqdr4z+E//BO/xpq3iLxT8PPDHxM/Y0+Oy+IDqWrS/s/fEfxJodx8VNOzzZ+Ffh2Lz47+E/DFp3+z2ttBD1wma9HOuFsRmXJm+TTliMNyxTpSk5003a9ot8jS1s+X8z47JuKqGWznlGcQjQxCnOUayhClUfvaPRKcW7K655druyPwV/aM/Yb+MH7HutaB4R+P9l4J8I/EjxB4Vi8UT/BKy8cR+I/jP4I8HoxaTxN41s/DV0/gvwTr04CqfDPxTv8AWrxE37EEjJInyJd6fcXbOlvqj3Bf7+mafalLV/8AftYlELe2UPH0r+mLwd/wSs+BHxavbi48dfGL9rv4X+BfEt5mx+IPjP4efC3xL4VbxD31fXb2/mm8R3WqnvqVxuvueLgda8cuf+CPP7Rngfw/4QsfgdqfwL+MHxP8ReGfGniT4xfFqw1fwdq3wT+B9v4dDt4V8PeF/F+rfFOXSfHfiDXBEiXa2v7O8l7cNOhj89RM8ZHKZZUv30ed2XxLmV7R1s72WvXbtufUS4oo5p/CUIr+7ZPRR3SS7X0vrZO7krfhZqngi20fw5qWs+L/ABGkV1GALa38NaL9vGdykHxgmpIB4ebAK48MDAViQobDD7i/Y/8A2b/gX498BeOfiN8TPjN8MPBFl4B8Xx2nieGfWrrxT+0b4wtZx9o/4Rb9nr4LA3PgfWMNIwPxq1uD/hVlooW1m8PKYdteM6j+zF+0Z8T/ABvr/gG4uIvGWpfDzxYfBPirxvrXipvDfws+DWoKyLI3iTxddXI+AmjSlcmKTwn8R2ywJUN85r62/YT/AOCc3xW+NHjvxZqFrd+Evhj4d8J+KPG3gq9/aMsdQn8Z/CezvvD0ar411TwRZ+F7jTNc+LXxKuwAvwz0f4Uf2D4ctyvn2Rhmd681JN2suy09PK2/6+Y3mqUfj1tF7q+qVmk9bO103ZpatK8ebnPgF8A/i18Uvir4b+CHwE+HcHxX+J/xB8QXvivU9Psool0fwn4d09ydZ1v4l+O0Q/bJ7Esz/FC71e7lk8Blifh66Fhn+7f/AIJ1fsdfBD4bXHju4sfh9/wufxH4qvtH8H/tLftAfF+W28UeP/iU3iK+tdT8Q6dP8LPFEeo6P8OPh9ruo2dnf6xoXhKGHSNUvLO3vL21uJrWOSP5w/Y80P8AZ0/Zs+G+meE/2FvB/wAMPCF3c2Fl4A+Kl78e/C2u6f46+Ns+m5GnaHqmrw3I1a28Y2AyLPwNqFxJ4FtMn7PDHzX2T8OP2hPhfouvaP471Twdr3ws8V6PZzaB468G6p4tudXkml8U/wDIt/YtXe5dt2lddLKuPsA4tPJ619N/Y7/sVz5Y8ztado81tHJt3T1vZWvbduztH4L+3Kn9tqPtqnIrJx9pLlbTT+G7XrZd/V/e0v7HH7NPwPvtU+NHwc/Zb8NeNPiz4Tj/ALZ8JNFq63l5Y+IIpWnttO0S/wBdnll0z7PdsLyJLVAEnPmxrFMd4/Fv/gvt+0dp/i//AIJaftt/DHVfEF2Pih4F1H9iLU/HHw3tdGZ4fhFrvxC/aG8G+M7DQtX8UxxpHrkE2jeGvG+mrC0rQQ2Xhfw5GkIg8XwR3H6TXP7Unhnx54b1RvC/xY17Sm0DSxfazZ6l4et/GGpWN8owLxW8SC4liuwAAtwCJgNuHGAK/nm/4LQftB3Fv+wp+2t8KWtPh94svfix4n+BL/EL4t+BNU1ZPF194q8G/Gf4R2fhrUPiT4dvEGi6fomiaV4a0PRvDMOi+Zb6dBpOiabp/wBltrGzWD4V5ZWTu5S0396y+zfvp8v+B93HN4y5Um9eVLu7uNrbPp3+eiP4GfH9vLP438T3tozTxLrzYyWYEnnnPGAeOeg9B1j8Potpd7ZDflf7pklCZ+m7Gfwx/Ote851rV8879e+fPO//AHv7345qZL9bNt0vzOeNzct6dTk9uOv+NqEUrcqfqk+3+SO3mcku1l91la/3H0F8NPE+q+F7XzYDbWsn9+3VYH/76i2Nx9e+cVc8ReJ/EmrQaxoTeINc8P3niG0m0HxCI9Wv7rSddluDm5/tiBbgwambj/lv9tWcyf8ALTdXl8esW9kuyRIyp4Csq7R/wHGPp/P16zTNQiIwDLdgy/aMWWn8faP+e2EQDzh/z1xvxj5uufJsu39f0l9x5/NJdX97Ok+E/wALIdNv11a+8XaZ4e8VxFj4bu9AtIdct5i5Bb+2m1NCJwxAJE5YcAdhj03wT+x98JfiLr2pWdnr/jnSZLkg2Ph/QtP0jxA0IByFTWNSfhSeu2Tcy8FioAHlNrPbzAiZb2Uekkkkg7dmYjp7fj3r2r4fNpcUN5JpQ13T59J/1ljYWllaQ9hgxW/lp9fl7V81mlarSvKlOUZeT00aa0emj27dLH02VRjJx54qSvG91d29Xc9x0L/gmv8AtceAvtel/CDxL8OfiEvi6T7JrGk6prlvZWsGrG1vrA6gbO+uvJbUP7P1PUbD7a+bgWWoXtsZGhup45PjL43+DPiZpfjv4g+DfHfwN8b+B/jR4M8R694l+JejeHjrOq6Bo+lX114ym1vVdL8G7JLvSvCvhhW8IxaY0euSaTpUOj68NkCPdJZ/o14c+LHiA6tpWq2GmQRmzm+0X0mv3n2l7mcf8t7h7pnM03fzZNz9Bur9cPgr/wAFBbbwp4Ruvh58UNN+Ht58IvHnh3UfCPjz4Yt4W0bXNZ1nwpq51U6t4Y169ns5/wC1fD2qf27rZ1HRdQ+0abenWdVNzaynULvzfOyriPOsub+sUufma1aS0bjZ2Vo7XSso3311v9Rm+DyTMknSnFNQs1HZt2uvm391nZH8W6xX+oXSRTNOywMt0LGOwkFwLDV0H9urEmmxeYlnpTh8W22OK3jMrRwQl5IT9cWXwn+GmofBMfE4fHnQoPix4J1ky+KfgFrehr4e1HSJR8Sl8PpJZ+KNPMa+JmHhyKPxRcS25a5iuhPOzNcCUSfqJ+zR+x94D+A/7S1/8e9d134MeO/gr4XvrvWbXwX4L+J/xI8HXmgpdlUm8JeINN+JHwp1EeMNFuYFSG90fUf7Ss7oIDJH5beSvn/7VHwX/YU8PfBzxd8QPgb8Ndb8O/Ea61XwpotvoTeP9Q8Y/DbQJ5vG3w9tLl9M0LXZp/i/YXM9hd3dg8lvriTS2lxJZfPBJ5LfTe2dScJSbnJ8jUnq2246O7b11u078za+Gx8tyqmnyJRsnblVvyXX8T7j/wCCY/8AwTl/a1/aH+Hy/FrwHp2i6H8JPF2teKoofGfjXWV0zwM0XhX4gbfEcZfTZRrhj1YDGqIY9t/jF2JgK/on1P8A4IzfBn4p+FLGH9qDxDpvxN1rw54W+wWnjzwj4d8aaN498K2QBC2XhPxTFenXPiTZgEjyPFN3dxKTlYyTXln/AAQk8XeHNG/4J2fBj7VeW9pqtjrvxp+2JHqXlSTm4+O/xBtLkzlJFaT7RbWVnazmQnzre0tYpN0cEKp+t3iD4++CvBenvc3lxZX11LH5MlpbX6FZIuf3ciByrR/7DKVPXHp/RWUY+lKhGkowUZQSsqdNrVJfDJTi3523+zZ2P5D4p4YxOYcSVM+xVWpl8XNuf1Sc8N7VxbfvujKHPdq2re73P5vv2xv+CGvjz4T/AA2L/wDBOfXPFnxT8B2dx/wtT4ifsnfFTxb4Q134hav4wFidMT41/A74g/Duz0m81fxINOP9nCy1W6j1VbNntg5tysA/kp+L7eNbH4h+JtE+Kfg/4rWWv6t4gvv7XuPHf/CUx/E/UbnUr46lqEd/Y6uzaXd+Dr7U/wDiYXWlzSSWNzff6a0MlwfNr/Sik/bRN1EdW0Y+F/COntP9qbXdR1q3u9RNz/z8HSnkMpn4/wBaU8w/3uleI/Hf9oP9krxzFNYfGn4QaH+1B471Oz/s+GbUvhZ8OtTvVsP+fFPFesaTeXi2Y/59RdeR/wBM/TH/AFRqt6Jcrs9lfVxfTp72jvpbrdn0eTeJWZZV7tbDxrP4VKSTk17qV20+b1a5nd+9tb/O01fUZHtm8Nalr13r+l6PPez6RoFzPpSDSrjUSDqM2nWnxE0fxHFYy3x/4/ZLWOJ7k8zGQ8V9VeB/2LP2vfjP8OdT+K3hT4AtrHwm+Hfhdri48ea58KPBenhPDaHBsIofEOmjxT438SHnbcsLycgZEhUgn+rnw9+01+yH8K9WuNR+FX7EH7M9p4kj/wCQvd6Xpvh+9v7r0/su71PSFuV/7ZSAj8qxviv/AMFKdP8AGdtpdvrH7P8A8JLDXb5/M+H/AIk8SfFDxncNptzx/wAVbol9eO8unaHz/rbGWGL/AGu9T/xD6ury2Vru2mlo7u93127dD1F4kZjFfu8LCDdrtKKTb5bu0YRtuura13vp/HvZ/BDW/Ffhe18VaP4e0q/tNT8QDwzFZaf4cm/4SrSPieRuHw/1LR47b7Uvh0gj/io5YxADwZA3y15y/wAK4b/U9Xn0uSS9tfDL/wDCOXet6fp4EGteL84/tSx0GJBG3h7jBjEXkY52kV+/9t+1+PhdcfEvx78P7n4VeA/EvjnXvt114i8PfDXw/wDFax0vS/8Anx8MeNPGOm3PjLTbLpm1sLmGH/Yr81dW8f8Ak6zqes+HdB0Dwrrl4nlaj/wj+mWWjafpcXB8rwzHp0NtHpkfHKWAhUddvr89Lh7KZP36vPKLXxWlqnHa97a3t6Pc9PK+N82qN3pSd37vM+ayurXbV27PXZ3S22PnLw9+ztqVncx614m0o2Nlp/8Ax9aXrt0NJu5f+uqaUVMnvuB7jtil+J9lZ6N4cvbHR7S20qz1LWPB8Go2mmwRWNrf24nW88i9t7VIorqH7Vm58udJE+0fvseZ81dP4n+JOspNLcR3d9HcTf62dLq4WWX/AK6SiQO/0Zj7V5D498RNPov7+eSY+ZDL++kaT97b8W8h3k/PAP8AUv8AeiH3CKWaUqUEuWnTSS0tCKWip22X6dT0MrxueVZxdWEqkeeLfO3LTmT05m1t/wAMtn/WN/wQv+D2g+OvhTH49m1PW/EvxD8G3vxn8XfCzwKmu3eg6bqPjTw14y+IOv8AhQWd+J4oo73X/FVlZeEp54Cs9zY2ltp7u9vBFEn8jfxs0n41eN/H/wATfih8S/BPim91/V/ir448SfE/Ubnwh4g0pdO+J+u+OtQn8QaTeaWb2GNLq/u7+4nu4ZovtUk2pXRuWmuhPM/6R/8ABL79uL9oX4H/ABS0fwJ/a9lL8AfDHiZp9U0PVNJ0qfxJoxbVbnX/ADPCuuzRm80m4OvXl9rTTafdQFtUvLnUcC9nmnf0/wD4Kx/CjwX8W/jL4s/aQ/Z48R6v4m+FX7Q/ifTPiR4n+HPh/wAY3cl94d+LCXAu/iXqWraZqV2sY0zxLd7rnwRcTRZWZi9owYtu/jnIrcI+KnGv1ucaq449nVy6U+arLCcsnF08PzprDyanKTVNwXKmk23Y/p+UFm+QxcYpNRUbJJWaUXa7vu0k156bu/4OaRo89zbjTLljcGPQ4fGHh1ZlWYTalbQRWltousb9wnggtIktYrWbKR2qi3QCElK9U8T+GYvC914X1bQvE3izU2u7z+0LCR7SKV7XUOP9OtnZi0F5/wBPMRSbP/LTpjsPGPwrvPDXhrV/Fum6bd+Frix+XTtJv/EEviG+vV5JDiSaZ5B/stkD0Aq3qHgG9v8Awx4ftvD/AIq1JLliPOkudOtPN0gA9LWTIktAcYPkNG2CSCDX7Ks1grK66K7vf7Or37+fX5fLrLKy3nPS19X5ev8AT+7n9K8T+O9CvJdd0PxfqGja94ZmOreF59Kmu9OvIbP/AJ4WFxZyQzWsH/TK3eNOfumvW/Hv7SHiDxP8PfCmj+Kn0/xr4k1vUPFzeNPDviRL+xsdTurYg2vj/WdUs3CXywEZj8L3j3BgwDFbE4B8t0nRNfvfEOj6JpVhdS69p0P2a50zUNRlmt5bfr5EuuTSNvhz/wAsnkKe1em6d8PtetbPxY/jTxDo3hzw1rni2bVdJ0jQNW1F2sdVnGJ9Ssba2dEtb+YACa8gVLiUD5pSMAYJrfdW89f636F8sey0t0XS3l5I+UpdE1h4zceMNci8KaKzZbw9b2v9mI/HU6f4fSOEkepiJ6HjANfpV/wT+1z4/wDgf4neJL/4eRWHhH4e+MfCTeGdb8Z/Fz4f+K7D4a2kYuFvhFoYtrw6lbRPesbpY7NBi6Rp3jWTY7cf4Q8J/D7wFp82txrpltZQc6p4u8VWlrr73H/YJ0zUI7ho+f8Anggxj6V9PfCz4kS/FKxh1TR7fxAdK8Nav/Y1jM9ra6Wt9df89ZCpjEsv+2xLc/e7VwSakrSjHskklFapt2S1k7JOTbb6tuzLTa2k/vf+enovlY9Z/bA8XeHbbwd8R7Hx7+0HpeufEf4i+BdQs4dFtvBGkeFpNN1bVjnVb/VYvD8MTNfan/zELuYGe8z/AKTJKK/G3xB+z98SvCvhmXxZ4l0rStP8MaLrHhbSVv4NXjvhqOo3XjZrKa60h/Mfbcy2xFvNNCRLLbjyXYx/LXoPx3tJdR+Kfj6+1N3TxC+sm3fV7BmiRoP+eDTxkOYu3llyntXJa78QLy9+Edh8LfEF9Hbw+HfE8eueGpLCQwhreGY3ES6uI2UTLFcM1xEJtwSZjKmJDur0MqyuaV7u26330euqfS+t/Jq7FJc+kveb097X8Xc/tx/4JEftBX/w+/4JgfBvTtOnhhY+PPjVxbOYOLn4/wDxM+0cQlP+Pjjzv+ev/LTdXrPjz9qTwxbaVrsvjjXb7RNOvNJl1q81WZJdF026tZltEmjufmiiuI5UsLFZVl3q62dorAi3hCfkX/wS3+NGieBP2T/gm/irwwPGnh7w/wCIvjJNqfhi1mSCG6kPxI+Jl2JbrTz/AKPNJ9qP2rfLCzfaMTZ8z56b+1b8QfEX7YHjDSPgIbPTtJ1T9om717wR4Q0pLvT9B8M/BH4O+CN8nxJ+OXjuysp7O20qX4KJBN9t0Bvslx8TI4pWJumjLr+XZ1ldXOOIFGMppRlrdu6UWubr0Sd90rH3WTtZVkbc/eutL6raOmum7Xrfsfmn8ef24fh98HvjP+1x4q/Zc8Sat4nn/bL8J2fhfxX4X8BXWt+BtN8B/F21v/AHiWy/aE8GfEzw7qOna3pPxB0747+CL+6svBenJaaLb+CviF4k0yPUk07xFcWdz5R+zV/wVG+MHgrxhaQ/tO63dfEbwhq2jRpqPj3x0usj4keHImEnmPoF79puNb+JjqRCEi8XNqKSB5meaLykWf1z9pf4J/CjTvijqfwS/Y2+GTfEfRtG0U6W3i/RPAV94x8ceMdcN9pnh4zpq3ha60XSPDHhI+FPAuoeL/sa3cNib6WbUfL+0O8p/LPXvHU3h/V/Emvaj4mvNX17xV4e/seDT7TTrPxl4m8P3jYH2iw8Xa/9r1HT5I8FvNs7iOY5YAuQgH6a8joThGNTD0Z2iouUoRcrJRirOzSskraWtGzTS0+KjnlSM3KFWpG8lK0ZSWt1e9nrf8Oltbf0f/BT9tyP9pzWtVvIfEWvXkFxoi3Vn8GfBljFDLYXDWA8HR+Mfip4m1EwHWPGkmtMupp8Ifgm3hvwS14y3n2MXB319J+Fvj34b8OeDNf8J/ELwb4a13xL4k14/wBn+IvjBrNl4T8OQf8AXDxf8QD4g+GEX1TQF/x/Cj/gnR8Or/4j6j4mMPhy6svgy+mabc+NrvwPq3j+z8RfFTxtqV3Le+CPBCeLJNXiutMsNI1EQ33jqxTUY7CeeI3F9a3UkkU0H6z/ABG8KfCDUvCWn+FtN+BXgqyvb+/8J2mra7c69B4w8V+GNTuf+Pnwdp+r+I47jUtOv5+fO8b29xFcS/x3TV+CcVZBk2T504+0STu1BJKMdU0uzbb1v0trfb944Vz3Nc4yVSVGLlFL3+VcztZN3avr0V+unc7f9n3w/wCEPiXa+H/iUt7qkvgLxhrTWU15ZWcjeERsJVte0TXNaVfENp4bRgVeO38u3BBBUHIrqfFvizSvDcizax8Y/DXw98HQeLv+EYtz4L8GWniGDwz4N/6Hbwp4XvLb7P8AE3UO39p+LLa5ucDievn/AF/44amNN8K6b4chsbiz8PeDv7E8CeDfhz4M8TzaBpGjfb/+Ee/snwhok9/Hp2s6YfCv/FX/ANn+I7VbX7dnUfK+0Zmr57vfGutrBeeK/HVqmpPLoh0TxJcePtQOiTeBfDP/AECdHl8Muz674i44aBpLjrg8V8q8Bm/O3Ch7nN7l1Fy5Lx5b2Vr2etla/lY+qWapJJpXSSdlbVKN7Wv1v36+dvQvih8R/h/p3jDxuPCA8cfEjxjr6f8ACGy6x4y0uHw6bjTOv9tTfDuxA8Hy3PT/AEl7VpR/f61+Yv7S/jTX/EXhHW4dT0uZre51zwf9pvp7+SWW4/4r44E0ruXkycDMjNjOccGvafHHjbTY9V8SXmleLdVGh2qFPC9hDq15Hcun9zV0Sceen+zOGH5Yr4d+MniSCLwFPoUHiGe9utU16LyZNYjlu5F+z3H2uAK1yZHHkXWbmIAjyrg+cm2T56/QODsqms+puS2lBtP1jfz/ABXofJ8Y5pD+wKlkleEldJae6knfpu+/z2f7W/8ABF34DRfFPxZeao1hKuqXPj3xU+lXxhDWl/JbKPIZmKkStAc+QzFvK48sjrX9h3xn1/Q/hx4U0H4f6PqNu+iaMtwhuotPjRES7sf7Lu0AjRVC3Om/8S64UfLNY/6JLvt/3dfg9/wQcuPCng/9kvRfiXqjWsGpW2ueMdOtpTFEtxb6j/wnHxCtPtcM2BJDd/ZLKythcRss32e0tYdwjghVfqP9p39pa/1Lwt8QLnw34iewvEi/sjw/bWGlad4nWW9z/r4k1oShZ+v7xAH/ANrqD+t+M+dzwvDkMiw1SeHk1HShOVK+kdH7Nx3XV77bH89+DHCMsVxLLPsVFYiHO3++iqiXvLS0+a3l2V/U/O79rrxt4r1Lwp4i8d/C3Ufhz4J8ZXPi3TrXwvqV/YiXV/Dnwf0fT7vSNI0/wH4BWD/hF/D2raVpeoX2macmi29mbLT728srYRW1zNG/4FftdeB/GGt6T4S+Kkr/AA78Qa1omo3kfxi17wFovxAi1jVotQe6N/4r+Lmp3t2t7Dqd8moakl5qOlzy3lydQummuW8+ZZf1U/ak+JNlBeeE/hbo99aCHwvbf8ItYS3jK32XXjY/8JD/AGjqpckPqA8V/wDFJfa5c3P2HGnCT7P+6r4E8VeO9H8ZaLdaFqM63+g6z4d8kQRt5tm0P/PI253QGPH8BTZ7en4pwTnWZ5PKEZYeCi3FNqEb2bgm07btapN77WW/9K8aZJlmcRk1iJu0dvaSaTilove+70WiPzL1O1nntH0eaSSaOT/WQyszxuf9uNyUf8c/TivKoPFN3pEGn2tzGZLaa3+xy28mWgltP+fWSJso9v28l1MfcITXsHiu2u/DOvR6LdQX73mn3B0u51SR5GtZdG/6DcrsSHuO32py0vPD5rgtI0ax1HxS6a/os+paPaTDVtQstMuy13LZf88NGVGzDBj/AJZQbU68Gv6mg+aMZd4p/ern8tyhFSkuVaSa2XR/8BfcefQAWoxbAWw3iTEA8keYBgPiPb84HAb7wHANTtcXDSea08zS+X5PmNK5k8r/AJ5byxby/wDYzt9qdLDeadcCx1K2WOTzv7X3FAH+xf8APDJGfI/6Zfc9hU1miPffa2VWtv8AnkyqYf8Av2QUGf8Ad/GvM9rU/wCfk/8AwOX+ZEqdOfx04S/xRjL80+y+4pWojvTYFBIGmz57LpwBmz1MrBP3meDl9wz+dfTsWnR2fwU8K+IHvJzfrrp2x+a+5cePu2TkZIycY989a8isdTae5WwtpJIZY/uNC5jZOn3ChBXH+yRX0D8QXs7D4a23hbT7a3MejodOe7jhjSUakPH5/wBL8xVDC69ZwfNIJ+bFfM5nUqe1hLnm5OpDXmfM/firXvfrbc+qyinThkdapCEI1JwanOMVGc0r255JJyt0u3bofOknh3xF4p+KPirTPB01/p1rLey32t6xFPPbWOkeDh5O+41uSFlj+xRRSRu0dwfLciNAu0syfRPgL4xax4W+EmofD++0Vfiz8A/EE/iqTW/hd4kU6doXhnxQukpqdr46GsW0NxrPhDxdNYW9v48bxD4JhTU7nTsfC6a6n07zLAWvA3w6v/8AhSnxo8X6n45vvBuufEjTrTSPANlaWVmG+Jek+DyF17S9YNs6tpGn6iI4mv7O5xa3boouoZlRc/GEU3ijQxpYnjuLUaaGvtJW+eQi50t746m1kA5IaybUWa/e22+Q16zXXlmcmU/bRiuVe6neK3S3aS6rpa+r3/D5nLvfeqUtlZ2e/V3un9/SzR9JfFL4froXhHRPiT4T+Ivhvxv4Y8VWsZ8TW+nWWpJ8Q/h94tmTVJ38GfGfwzJPLp3hrxFGNI8TT2B02K+8Eavp17of2bVIrzTtUsfhVyS+CNZ0TwLpHjnWYLCyk+IYm8OeHNKSGFLu18NzEifUb9Qiu0cwP7xpB+9HzP8AewKHwa1rx1ptx4v8SaZ4pi8J+HLzwY/gXx/e6lELrTfFfw+ZtJLeDbzw8Ve31t/+JDo7xaVeRT20cmmafIkCvZQmvX/Fcl18XfG2j+EPC97d6fP4o8S/8Ib4D0rW7TTdO07w7owIC+Fxqk4ENtKGKlvGERRnXIa4KbseZJuXxNy0tq7+m/4ao9LKYQTdox3aWkd3a2tvu29F0/R3/gnt8X/2hP2ZtN+BnxJ8FeCrjxZ4U+J/7XGkeD/AHwm1m1h1H4SeNPiR4K0/wNpfxb8Q+KdB8Y6da+H9c+MS+A/H/h34Q/Ci0v7TUfDemeLrL4x/FDRrix1rwb4ZvW7qCwuPE2o/EH4k2Xj3XdEl+G3jzxrrvj34CeEoYvBj+H/hh4e8Zj4j3XjT4eJ4OltLXVtD0D4hj/hPfiH4D0uH7F8O/GjHxR8ObSHWwt6PAv29PjF4f8LeIfhZ+yX8KJbRfgf+w94d1Dw94E1rQr2O4074ifFPVBpI+NX7T2oR2ki2+p6iP7B0SP4exTpLqmmRaRpiaZcRpY28cXxd4S+K/iLwVf2XiDwX4ivdA8Q6asCaddeH9Su9Iv7Bbb/j2WyutOmt7i1W3x+4EEkYi58vb28ieVOd90mrWTdkvdWl2+i6flt7eUZpHK5fvl7Rvbn97r/eTW7dr7N30e/9Jvgj9tvRfEVjr+t61beKj4jv5dTuPiFK0UGsW/ijQ7a4+1+Ivizo/h2RpY7iW3u/9J+K3htYXfwRcfv/AABGsnz1e1n9tPwR4Rg1PXE1HTtCspL3+0CImiutV1jUP+f7TZkzO14e9zG/ndw9fza2vxx8aeDUtbzw7r1rp3jPwo1lJpniPTIDZXFy+m/8g5v7QtTFcl7D/lyYTbrT/lgU61geNvivpviPxTp3iZNPvPD01zmTU/D8F88/hfwl463swsvB2kwv/Z+heEcuR/Z+mQ29iF2xiPYiAfEvgHIbt8tFvfWENXpv7vXX7/I/SMn8T83yle8pNWau23ZOyvq+ie2/W5+8viL9tfxF4y8LWHibw9FrkHhTWtV8WaHrkfjWG2sruOe2z9meZrBizPB/yxZ8tF/yzKivgn9rj4v6/wCJvhlrV3qyW7a9qWu+Cfs+sWmF1SMQfEa2uoBHqCkXaiG5srS4iCzDZPa20qbZIImTwr4EeKNR8YeHPid4GsdPm1x9I8B6Z8dNG0vTdQfTb2e++Emt2epfEHSEWGSNvI8SfDfW/EWv+JIVXZrA8M2c2prc/YYTH5J8SPGF7rXgZbC2vIryVde8G7TNIZmX/SPtfylyxB+1f6SMY/0jE3+sG4+zlGQUKUoTp4ejGVHWnKNKEZwtb4JJJx83Fp36HzOecbVs6yWoo4islXbVRe2qfvL2/ie97yV38V1bpqev+DfGmp+Fv2dPjtqMLz21vdeH/HmmWN/BLJDNb3/jHxx9k0O4t5o2V4rixtB9lsZY3WS2t/3EDRxfLXxt4Q+GQ1y6+GHh2z1HT31nxaGEUM2oJpx0ot42NkzamrOnzm1JgDSYZYv3aEIFA+ofhd4Wm+Knwd1z4fQeLRpdrea/FqV29xHIqXNhD49KW0Fwu5Vnhtc7reKXfFC4BRRjFY3wk+CHiXSNc1zVPEng2a/1qPTPFGhReIfH2n6W2n+BxZyNPa+KU0cJcnxFqdvcO9zFfjzbiK5JnjlWQK4bzaKdTnqtTjNx0T55v4U7uzUU2+a7TSaSjJvTKWTtw4OXKnBwvyu3L846q+t7q93pq1c6jxMngPW/2dPBfgrRPB/iXXPjj8UP2jtRluPFN1q817ptr8Lb+3Hg34dW+g6PNJKlr4g1HW5JNQt54YxO90gdD5hQj3zw9+xz4V1j4q+PvAuj6v8ADaxb4Z6TA3iC/wDiBfR+OobLQ7bH2fxT/wAJjrC33w2TS4MDyfAn9gC1jIBW0GK8e8L2H/CqP2tfgroXi0Jq8vwq0nwJ8Rrrwz4EWa9I8U+DfCh8ReC/AKazdNHCLy91lI9RXxbK7ynUL7+0YZReqt1H6lDofiH9nnxX8Rdc+KPiKC0+Lnx4fTPFur6dLo6+JvFGjeHPEOoN458G20F7pUVxqMHijxJpUktvLcJKt5c2kj27ySwsQ3vZVL3XLpyylb7vN9Era7W33Pnc3jeUord3j21slbZdW+m9/Q+/o/AP/BPb4J+EZvFXj/4s+MPjb4st7QiHw94c8MWnhjQfB3hs+JP+ExGheM9ZVE8IeD9FXxcf+EoGm+Ff2bI7T/hIgNcMTaoftR+RfB+t6f8ADz4ReIZfC2mal4i+BHxf+LHhqX4fT/HTSPAHiTXB8VdX8BJJ41k8YeBbPRtXl0C++Pckcc3w71XUoX8JfDS4U3tvqUF7JLcyfY/hv9hLxJ4k1PwZ4++IVp4GtPhhcWP9teNvhj8V/EGrfC349eIvhJ9kHgz/AITa2aIftDWPwi1g63P40vh4S+Jk+syDUfg+L0wmfxUTc/t7+zd+yb+zl8KNE8LXPwp8V/EX4leM9M8LeNvhha/FX/hAfCmo6r4n/Z78TWkVj4Y+B/xvm8ER6L8GPjNHpFnDFa6TqvjHQtcsdPt40t7JIIUSMfPvjvBq6UKTadrezV73S1vG3m9XvpdqXJ3ZVwNjH73ta1n71+edtbNJWfXXp01t7p/Or8Yv+CMf7Z2s3EXgH4deEPhn4M8GaZoyyp4p07xC3gL4W/EiUMpM8ur+LZL7VNcnAHyteG4Jz99Thh+gP7CH/BC/9p5W+Engv9oHV/A3wo+CPiWx1zx18QPAd5rF1458Qa1r1veaP4c+I/w68Y6z8NZ9Mm+HGj+JvCVxqPizwVpWg3UcEupeC9J1fMt/pcF5F+wmp/HTwF4Wjg0C/u7nQr7wzH5XhrTfEHhCP4U6B4eiH/LLQ9P8Q22pWekx/wCxYRW6+3am2v7V0ul+JdNlvvFN1aeGrHVLBLtNK1S6tb2DW9KsbvS9L8K/FBredH0XVdN02/vrCw8eaDuu7OyvLu0tryO3uJo37sszSGcaQikrrZJdl00dvT5d9JZTJXXVaPy+G7Xn17PbTc/RTxp+3b+zb/wTg8JfCT9mXx/8JPi1q1lrHgbU/C/wC+E/wK+Hw/aA0z40fDv4Txtc/Ejxd4QXRbyw1ufxB8NLPVL27+N/hfxasF1rouRN4Ostat7+4A/En/guJ+xv+y3rv/BNzxn+3z+w/rnw/wBC+Fmual8L/iP48t/BVtFceFPiHpPjv47/AA78L6TPZ65JBDruh+GbbxHqF1qsXw4iMejxazd3t7FpkV7LO1fLWpfCH9qv4yftXeKPij8Rvif8K7b4laZ4hh+Lf7NH7SnxTlm8beIkt/BfjgePvAum+GNc+FX2HXPhp8NdS+EajwnD4j0S+0zxb/wlIEca+cAtfSf/AAWS8J6b8DP+CVvxW8DfA7WdIm+BvxE1T4KXCHwl5GlaLL4r039on4bana2Uvg7S/s+m+DpLK7D31oqWdq8F2WuINs7bj9vldKnO6cIPde9FPTRdeqWzd7Hw2aZfXpyUlUnFKXM0pSS0cd9Vfrvp+v8AGb4b1Iadp2rwbdOTxBf6qbS01NYoVhhtP+faGVVzHb/9MUYRD+6Sa0pvFsOn+IZbdtSufF9vPb/ZJ7eO5mt4JrXtayxF/Lkt/wDpg6mP/Z9PDhq6rGsK6eRCmvZWIXxEan0VA20fQAGr3hW/toZdW1m60qKewvf+POOa6WXU7fjrbyuTLGe/7tl7k81+fvJYyz5ycY817czjG9pW62vs11+S6/oVPOHSyBRhOUUlH3Iu0W1y391NK+lnp5ev6y/AnQvEP7R2iaf+zVYaAPEPiz4mX/h60Oj6xODaaDpyK0c/iL4iateb08N3ngCNnj8P3vh1lm0KJ3j0+S1VmU/oX8Jf2F/BnhHxN8D/AAj45+F/hj4zzfFey1k/GPxHqd1qPwm0f4OfspazeXOieAbPxD4u8Tw6v4t8S+O9ZtNC8N/tJLcXs097L4A8RXXw0GdLvZbOT5v/AOCPd1o0X7R1hqXxDttL1k2/wv8AiJonw+0/XNavtCt7jxj4550qxs4NMYRxSW3S2WFUaL/lkF61/XF+yTc6J8H/AAZ4++LvxOj0eLxP4qs7LWItW1u2tde1zRPAngH4d2cPw80GwsL2O4vLLWLqHT7CKzit/KaOKxtI4VVLaFY/2fg3gvLclf8AbMa8lT3VJVHCk5SUVflSaTva75b2S3PwjxE8S8zzSKyanSUaqtF1YxtUtG32k4ye+mvV3W5/K5+3z8FIfg9+2N8VvhJ+zd/Zfwa+LmoeMPDvxE8AeHdCt9E0HwRr3hfx38Ofs/ww8B+EPDuipZfD+0vPjjEVisdO8SW8Efw3hBhgjskzX4efHrwEsOqarHFp/wAO9C1Lw9Z2elar4X+Gur6l4ksrTxjrDH/hIbM6brrtFaz+HFJ8hIGD2DY+zyqUSQf2JftU/s5fs43/AOy14+/aA+MunafD4++OH7RC/EL4g+DLHTLEWp8L6/b/AGPwjpNnY/ZzEdK0C1AttCsdhtdLg/c2EVvHwf49v2hNcvtR8TeJNc2NPrureNLzxZqk2rE3V3qdxqH/AB/3moT3PmTXtzfZ/wBMuLh5JrnOJncV7fFEY5XkqnVjFzbtzSjd3uk2nJN2vZxe0r3V1vycJy/tVJU/d5eqsntFatWupW2ktO7vI8P8P2epajoUT6p45itbCHxFqc0Oi6kHknim1mNYtYligmZhHLqscaR6lIqq18iKl0ZVUKO6S9tfBsUuh6HLoD2s/wDr7jWLa01szf8AXVrlJ/M5PG8nntXylq82sSaj52pma7lEnm+bBI7yeb/z035LiT0fdu6c819n/s9fsifGD9oka1afC7RNA1u/8L+Cm8XXekt4k0jRfHOs+GgcfY9M0TXLiPRJvE2M7bkMbwghjKxya/G84nOtS5as5TglpCcnOCuoW92Ta012Te9kfp+S0qVGTlTpQhK7vKEIwk9Ve7ik29/VvzPHLjWoZtTk1DxMqXccsP2eXaBKJLcZ/cSbw2+EH/lm2U9skV0Xizxo/iTT/BFo1zNPP4f1qGKKSWaSSS2it/8Aj3igd3LQx2/HkpGyrFx5YWvIPG+ieJ/Dqmw1m3m0qUau8S2WoDytQ2bTtjb+y8uYuTlOADgopIFZumXeJrSO4ubc6hba4DaQXDahp51BSy/NOCqebl9q/vMn5thOGIM5PFQtONlK0rSirNW5dpaP7vI6XnF22277Xu7/AGdL62+99fO30L8LtK8S638Svi8ugaxHp2h33g/VvCniDXPI8nT0svG32RNLtroR7Ue1SWztltIZj5cR06AQxgQRFf10/bk/aQ+BH7WHwn0rVvh78NL34W/FvxFr9lqHxcsJ7yNfD0umeDfA5u9csvDVpF5dtDZ392ftV9bW6LDdXGJrhJJTur4H+Dsul2/w38TeGbiO8I8beNLLxFr17p+nabHOZdOJOn+F7maJQ82l2B5stMlZrS1yfIhTNbeo/BPxV8T/AI3/AA+8D6I+reEdB8QWtr4gtm0/wP4kuPDvww+HHjONLHwz8S/iLqd/dG1X4d+KrB2/tRtXmg8S39jC9rd+fLNZ20+cm6mcqEvejb4Xqm7R1aas3d7va+548Zyi7qUlrd2bX5WP3v8A+CK/xJ+KPij4FfFD4k+O9f0jxL4c8EftGW0drf8Ai/WdTuJvEnivRfhon/CRLpuh6ncXAuPjT4g06WEav4nEK6NqcEnk3t/PGoJX/gqt/wAFR/g8PFXw8vPDl1/wn3jv4AeIfiT4l+FWgxsF0W88c/EL4diCz8beLtNJ+zX3hBIB5UfgG7jex8nMItAhKn8Mtf8A21/iJ+zH8P8Axl8CNFsbTwt8WvD3xB8eeEvFEnhTU/tfgrw54cl0jT/Ad54d8L6lp0yWuuaBPqPhbV5ptLtmbTJ57/UHMLyTXRP5VaxrfiHxBqk/iTxdq/iXVtQ1i8hv9c1OZzeX5vbZPs9vey3dzLLM11BBiKCeVlmihHlq4A2FvKFOd5JNX2eunuq33LXbS9rdPVjmqjFKK5dFr8LvaLvtuv189Pd/hx428AWHxIv/AB9+0N4S1X43E6jqXjCXQtV8V6loHh74h+PL7WZJZ9U+K/iHRrhPE3if4f3Vzdaxdanr3w11XRvFt9Pcz3DXsUl+HnPiN+0n8TvHHw/l+DuoappHhb4Z2vxM8YfFG4+GXhCyg8O6FdfFT4g6LB4ek1W8stKWHTbmz8H+HdN0/wAN+H3mDJoOg2kehWA+wtbxW3y/9qudoX7RPtFz9sC+dJtF3/z9AbsC5/6bgeb/ALVeseHdB0XUHuItf1lNEhjMqatp1haPc+Nr1JWDTR6XoUYGhpHL8vmLGVZxgvlunqxhGNrRirdktPwPK5pO/vPXfVnKeC/F+q+CPE1hr+hDS21PS2DLpXibSrbxBoOrEZBF9pl9FcWV6pznZcQsCVXawAbPrHi74keLPib44fxpr2n6Pf8AiaLSdIk1WXSNHt/CkWp6p4b02z8Hap441WXwzBZJqXir4h65brqPi/xDOn9q+JdYlnvNavLy4kDrW8J/CPxbf6vGv2CK0SGX+1Y7y8uh/ZsdlknyEVyIhDyfkxt7YwBWvb+Hdc8Ha7Z6J4L1HULPxDY+Hki8S3i3lxD4e1SGO9XUY4bWOORIJootRVb6OMhkS9UXSATjzKfLF/ZT6bLr0Jeib7DdFsdVup4dThjdFtpdPntim5fs82kDGlSwYP7mXS8n+z3jKvZci2MXSve/C+iX+jfAb4reIbzTdX1Vdb1zwe2keILFrjS9D0Hb4++HrAeKfD0RS1kLfbLxVF1bnLXlwMj7RKWd8LvAOqXvh83OsxavoMHk/wBk/wButZzX8Ivc/wCu/sNlZDP/ANNfK8z/AGhXvHxk0vVPCPwp8YeCtf1nW/D8q2vgjWrLV9M8YaJJ4d+Puu6145+Fh8Sab4lSztI4FTwl/bXiOazh1Tz4bA+FrMiMRWKJH6eU5XPR80vvfl0f/BPmZ5nTneLUW3dK6TSb5V1Xl+flf/Ta/Z18W694i+B3wXsjd37Weq/AX4Q6d4ftdOu7iO20/Urn4fk3N3f28UgiF1Pn99OyebIPvsccfmL/AMFbf+CvPhv/AIJa/CfTfh38PZp/F/7QnxR0K8T4MWWo29zcaJ8NdA0aGTwl4w+O/ju3eaW38WaDq+tB73wH4ZvVnt2vUa5sYItvlr7B8SP2mb79i/8A4JnH9pPw14P8P+K7/wCEP7NHwX8Zjwv4n8f3/wAPvDHjrVG8BKCPD3jTR7iDxNdayBkf8INBI8rZCpbBiuP8/T9pz9pfxb+3/wDGu0+NX7QPx81TXfFsNnpvh7Rll8DweEPBfh34Y6PdNqGleC/gt4S0pEsJLjTtQZtQs9N1G2tobe+xexwrcqsg+pzSEIrljCMUlG9lGPVaWWulne9lZq17u3yXC+W1alSec1JznRcmvZznzR3/AJZPl632V7PVNI+lNQ/4KVftcfH28vf+Fw/tFeLPj1a6lrtvriSeJNOu/BC6D4gs7VrC00vTfhla3K+CLBbWxkeytorWyiENqzW8QWFih8X/AGiPHvxB8dfDnQrzxf4wTSfCetfEL7QJtN1O4tY3nz/r28NxTpC03HEhty/q3WvN7Ow0/wCHdt/ausPG3h7SZP8AhJE+H3ijbrmu+LvFP/PlDaWn2k3cmeu9JGGeeK9G8I/sv/FD4wTXus+IPBviPU7HzxdaPb30NroUGmXXH+k6dFIY47Of/ptbLHJ0+fivMWm2npp+R9UoxV3GKjd9Elf7kj5v+HMXhrSvFGm+Kz4E8MeLm8GeJP7N1jRfEeraws3iLXyP+PqDXrBZZLjwpgnFq8z2Wf8Alnivrf4leI5vj7pWp/HP4z+Mrbxt4m1BPG+oeHtHvF1U+FtC8RT/AOu0DwP8J9P87SdC+H8//LXQtH0u10eT+O1bv9NeFP2WNQ8IWi+G9E8S2vwn06ONoUOhzDxrGkTElo0XUWkVY2YkmMAKzHJBNen+Bfh/8L/2fodH1DwVNe3niJIJrZ/ihrjG58Q6ja3P/Hzb+C3n36l8PoJ/+W0OkzWEcv8AGp5rh55/zS/8Cf8Amegoxuvdjuui7+h8Xfs1/wDBNvwl4rjuPHn7TE1zpGnXNy2r2H7P/h+/ltPEWmWgYgDx94nAt7vwxbuuCsXh5ozgjfGjEovs/wAVf2Vv2W76/wBUWw+GGjeE/l2nS/CWpfETQ7Nl/uG00rVLaArz90xlevFesX/j29aSCZjKZrWH7PbSlnMtvB/zwgk3FoYen7pCqdsV8+a/4puZZnuZIt9y/wDrLhxvmfsd0rZkbHuxzXkKUrr3pbrq+6/yX3HrqMbL3VsnsvI4vRdP8JfC7w3faB4K8KaF4L0+5jEPiK4s7ydNY1qFc7YtYurRI7jUohniO8edQeijv8//ALSWuR3/AIJ05BgpLrng1JE5KyJ/dcfdde+1gRntzz7NrOvrPJLLcO1vLN/rZUYxyS/9dHUhpP8AgRPA/Cvlf453qXfgBGi+Vo9e8G7GXAZPXYwwV654x616kdl10Xn+A+WP8q+5f10X3H+lZ+wl4a+JWk/CzwDBeeLtXtYdY+FPgyXV4V8V6lHFqko+H/EupRreBb6QZwHullYZ6+k3/BSH9o/xn+yN+yP8Qvjt4G/syb4p+GNK0TRPC+pXHhq3gn0fx54ywNI+Inii+0GAXT+BPAgP/FcS3ErWgAIvW6Z+Tv2avjj4S0D4O/C/UdW8X/YE/wCFS+Dc/b7+Qj/kn+P+WsnPv07eleleLfip8Fvjz8O9f+GnxB8caqfC/ivwvrnw58UeDtL1a58GTeJfD/ibjxJ4e1/UvDU9sNY0PxCMjXNJ1E3Fhquf9Pt7jNZReZQXJDB0YQ092NKCj9noopa+n56uSU5Kc1zSX2pWlJLraTu/xPxC+C/iXwx4u+GyeD/2mrHW2+Hc95r/AMSvEXjHXvh9aeBPGsniPxVcfbPFHiXxX8QfCGoRaxqOveJLv/Sdf1jUdRm1DWLj99qNxcS/NX57+AJNX1Dxl8Yvjr4Ts/EcX7Knwd0f4XfEDTL/AOKHizUNR8Ua94I+IfxVtPh/8OtIu72O6ubjwpr/AMejrfiPx1ARJBN8OvA/hm0EZtLKxhEf7K/8Osf+CdPgGWTRrfWvif4v8BaHb+Orfxd8HNS+KGqeFNA8T+K/E/xFPiX4d6P8UbHR9Tt9Ks/B37P3hJ5NG8bWOj29xp/xEsfJju7a+hgSCub+G3w9/Zk/Zc+FPj/4I+Gfh7p178Mfixrel3fxWg+Jep2PxC1f4yaPoel3eh6Jp3xD/t1dRfwlp+j6JqF/o+l2ejh7fT9KvbzT7SOG0uZoX1jXzhWUaEY3snaKWnu9v69b6qWT5dmn8LFVYWV/cqSjqrdpbefmfof8Nvi7+yD448D6Tpeifs666NRXRfNGs6N44+HdtCJf+ei3FrpqFX5++Du9Dg18YfDjwX+yr45/a5sPgboHgfTNX8OfFj4afGy11Dwz4zsNNjg+Fen2Hgf7XF4jtNNs7eS21m/+Gt2ftPhW/hha48M3H77SJbOT56+pvgb/AME+/wBnG98PWmp/B7xz8afhXp/iaPytQ0Lw58RtB+J2l6ZFn/VeGtP8WwzWunR842WUMK9OBXq/7OP7EH7KH7IvxivvjF4Q1H4o/F/45z6Br/w08NfE34m/EDwr4puPA/gnxVBFa+JpfC3w18B2ul+GdA8T+ILaL7PrdzplraXerQ/JevIjSJI+Jczp5Lk3N8M2velFNSTaS0fS/TVXdul7eLwzwpVznOnG8qkYu3LJ3j7rVrrVetl/4E7o8T+Hv7J/wf8A2VbTUtA+EXwy0r4beGNaa8s9Y124v5Na17VtX1A/6fqGpaj8V08Q3d9f33P2u6uppZ7n/lvI9e2+DLGXTdY0LULHxDBq4nvDqF1pyWw0+20vUBx9utrdQkVteA/8vMSJPx9/ueu+J1jqGhaV4j8UeH9c1OTw1Bd/29B4eg1C5TVoYvWKOOYPGP8AcVf618bXnxh0GTTG13QvFM6Xj/fguVkIfPZwzfN75H1NeNwp/wAK+sdHo9NHf3Wm7dW/T8WfquaU45PSlTlCPLyOKjypJaJbWt3eq79T9LfHuom907V7G6dtWmk0H52jYzu/+8zFy3qMk989K/l0/wCCxUEVr+xx4lt54YrSGH4r/CNYoI0WKKJLjxsbS5WKNAqIJrP/AEaUKAJbceTJui+Wv2b8M/GzUvFU+q3/AIa8W6DYanocflRaTqlzqHkarF2jureQ+Xcx9tsquv8As8CvxQ/4LS+IJtb/AGO9cs9a0ibwprMfxZ8DjV9Lii8+1uxB4/IgGla0gAUQg7YhFJ+7Bwm0HFfVZxOaTtKTtF6Xevurz6nwnCVGjlmUOVWlSlKUn704RlJKTT+Jxbt032+Z/Xb4X+OekfB/9i34Z+MF02LUfEC/BH4N6LoFvcXazSy+M/8AhX/FlF5jM4m9kIevyG8W/tWeOf22f2lPFnwW1Y6bpvwE/Z21DTfh948+GXhDxPrHhzwr8df2ndItDrGu6b8YtWsLmD4yeHf2dP2e/BgOkfFPwfYeI5fCXxV8dBZ9W0/ULwgj9BvFvw11jxJ+xJ+zdr3gzwKdc1Hwro3wR8YeI/DbCK4uL/Qtb8AD/hI/EFjAyuTeeGsn7HeqpmscfuZI6/KD4Y/CPV/2Z/gr4oXxx8J/iLB4j+KHjn4lePfHPiPxD4X8TaRpGqeM/iJ8T08cW/gWOTSdSWO5+HE2kIsM3huUyaLcRbhNaSF2J/lzOMVnEc6q5vKnJ0VpCjZqjZNuU3B+62lFJQ5NeZzbTilL9DjSyp8vJiZpu21SS1ahZKzS6730073f2X8bPjpovwPFrp+ofEWz8X+JPGOhTaSyT6pq/h2fwna3Nv8AZLj4r3Pwz0OZPBtp4QuLX/RZvBQs0sJbf9w9q0Xy1+Wf7W3jbVP2kvCumeM/jJ49vH+Kn7QnxE134Ofsk/sZ/Bfwf4btvif8QbXwOd3xE8WfG341fFqPWtd+C3ws8JfvT8QdP8O6haaH8NhDK/w8jtERnryf456/8RJPhr8cPFmoCPSNa1jUP7LE0mqSahdx6Z/wm/2Q6d4duDK81nYfZP8ARfslm8Vv5H7ny/L+Wvzg+G/iLxd4u/ac+L+vafqEdxd/D/SfDf7Kvw2uTaF9O0WLx3qD+LfiBrMakGOxurPRY5dPvbmARSS2JNpOzW+Ur4jJsxhOeIzuWuHpU5zlTi0ouTlCjTXK/dt7WtTdRJKTpqfK+azPov7NmoRyeMpRrOzU0/f2UpLmvzapNb3Taeh+1Xh7Tf8AgoF+x58EvCN/8MNY+Bf7RPwqS4mu/Efw30LQ/Hltp1ld3P8Ax83PhJ9Yv1sfEVxP/wAtpvhBF4Vklz87N3/Krwt+yRpP7bOov8T/AAD4J8O/DL4o3viqG21T4deEdW1m08N+FvENtxb6Pp3w/mW20zTYrfgw21rp0KRH/Votfq94d+KHxWk+GuieGvjX4e8UW/wx8QzDV5dY8FWkHjf4c39lx+48U2mrG41TU4OP9XqFtOmf4a6P9h2fxfe/tD67+0h4O1n4a6l4Q8I/Ga10L4m+LPHuq6j/AGp478U+EbA+Ctb0HwnpsaXX2rXr3XSNRvPiB5U95d6gBdXV3NNlj9DkdWdKTlSnOkm237OUoaXT15XG/oXlkFK6nCNRxi0lNJ3aT0vJO12lq/U/ML4Sf8EF/wBon4Z+O/BHi7xt4Q8a3Hgey1oQ6jPpmlwLfaZCbH+y/KhljQSW8X9m/wDEv2IUX7F/omDAPLr9SPHHwR+JnwxufDWuWGp+APBPhzw5a6hY2/xEjs2N1aWOrWH9l6raW1pDCktva6lpn/Eu1G3i2RXtifslyktviOv6PPit+0Frfw/+CmveNrixW31OTwcb670ybUX1KHTrs5/0iOFpHSOUE7vMVQ5ZVLMSox+Knib9q34a/tNfDXT7Xwvpc8HiTVbz7P8AD7w/No+kG3+IviEdNH1e0MYi0SL/AKd5kVP9n19upxTRlDkdppppqaTV21fRu3dvbW/d3+hyjhOtm02owjTSnHl9nK/NH3XzNKMFFq7TjdppXbWiXHeFdF8T6P8AsFvawXHxAivPEPgj4y+NLq0vZnaPT9W8QY/4RPRoYnmKw2+g5/4klsgWPS/+XFIOa/jV+Onx88Waz8EJfh3rZtoJU+JngfVtW1STw5o58SahqkH/AB76lfai0P267v4BkQXlxNJcRc7JFr/Rm+Dc3w2+MnwYGi3WheFNM0S08NnR/FdxcSKsmj3YTBl/sV4QsEucuHKI2eMnHH8W/wDwWW/4J7eAP2ffh5q/xT8BeKPB+t2bfFXw5E1ppVzJH48aDxipOixnRbdV0IxWCgixQnbbDPkBAa8PgD/kfXurNt6XSW2mqW23VaaN2PrePXClw7PIadNUJ0vdaioQvZJxlek2rSVpWk1NJqU4Qckn5P8AsZaJYX37MHgnxAmqT/8ACTeDvBnxf8KaNo3nybJILf4m/wBpW9pFCG2rbwaj/p8MCKIor3/S41E/7yuD+BHifxJ8M/Fv7TVrd3XjLSbbx7qdoLi38MuLiA+HLLXv+Eqs9F+KkWoSxx6VpFp4n/4qS207RFezt9e/4m8UKaj/AKRXrHxY+E/jf/gmP8a/ip+yH8cIvEOhat8M9X1vUPh74/1jwhLpdl8d/g/4kuPFsHhX4l+F5tKlu/Cnh/R/F2ueBb631G60u9XxZqGtT3vw5tEPxoj/AOEsi+Y9R+Iei+Kb6S98V+KfCj281v8A2NKYvtLatLdf89JZypnklyfvs5btur+kFGN17sd10Xdf5L7j+S1KUfhk16Nr8j84bHRPGesalqOieENC13WbyPxKdYjm09rkzR2ZtbqxMSSRHekX2K9vLPy1YIba7urfaYriVG968bah+1D4H1S2s/G914y0uZdCm1zRfDsVxJf6RpWlXFl/ZtwNN1E3DwWXjOfTv9Amv7YxajLZf6K8zQfu6+h/AniTwv8AC6zGlaf4v0O08SXS7LvxPoM17p83jZefl0K/svKuPCS+i20tuvtTPE37QWki0vtP1qbwx4vsLWX7Rb2V9osuqWlvcc/voLa7t5oYZv8AprGiuf71eqqdO8Z8kOey97ljzf8AgVr/AIj5pcvLzS5d+W75b97XsfIkd58afiRFfN4Z8DaV4z0zw1GttZ3OkaVBoiS2xIBj0H+0oImtoF+8YrJVU4O1CeK5fRfE3xe08zeH7vWfirpvh+4TyrjR7Gxu7t54+yTWySlJE/2HQr7GvrPxL8Tz400fRhP4g0zTDB/qNMt/EmhwW0P/AFyt49MWKMn/AGEH9awLX4z3OgDZYXqi9/6Dkc+qpqQOO+oIRdY/7a9arkh/JH/wFf5Bzz/ml/4E/wDM+pvgd4E8GeFPAfhbX/inHq83xv03VP8AhYzR6hqdx4g0aw8LBgR4G8ZfCy/afwR4/vztBFlq2n3vBKtEAWFetWHxjl8G2d1faZqEvgKfWRCB4a8Ja1PY+GXW2/49wfAmlT2+lMID/qQbAiLP7vaDX5wJ8Uta8S6fdxQa9faHHoF19u8PROtxbx/be13bIjqsN13+0RBZv9uuFuvFMuk6tHr9vpWoT67D/qtabUZm1aL08rUTIbxPfbMPSlGlSh8FOnD/AAwjH8kjyXVqy3qTfrOT/Ns/SvU/2vNM0S3j13XNYsLiGHPlalc2cfhS9hzgDytG0FYmT/gMYr56/aP+Psf7Q3wL+Iuvz+Mkg1GHxN4N0y28NDw1pf2rVdG+0W13/bVzAY83Nwbqysrk3UivL9otLabf5kETJ8HatqMniO91XUpLa8ttRvfEH9o2WoI0iXtvpvX7Jb3QIniteP8Aj3jkWL/YNfYH7CP7BfxT/bp/ae+En7Pnwl0vXblvG9xpMnj/AMYaRol5qFj4D+DWhzeD9I8bfFPWmvRD4cg8PeFrnxzaWUEN1fQeLLXW4LL4e3FtJ8WCNZufQcYJNuMbWd3ZIlOW6k9Nev39dj8v449Ti8WvbxTa1HDJrPkvFHBAiPFuzseNXELJjjyyhTb23c16NeeJfEPhq88T+FrefTNQ1Gy1ryrzVrNY/s7Rf88tEkQD7PH22WxRfbvX1h/wUP8A2AfjF+wH+1p8X/gP8RvBXiG3s/BmoX+o+A/HWrW8miWfxA+FOpXfirRvh98XdEu7NLnQbnRvEc3g68s/LivpfE8uuyXngYI3xNtbjULb887CLxAhBTSdRUh/NBTTZFIlx/rOIx+8/wBv72O/SuFP+vu+X3fncpuVk+Z7LZ27Pu2+nbZPax614d+IeqxxCFrX+1YQ/m+Uf9AjEnH7zy/lUSf7YXf/ALVeq6f8TEso2nW1h0i4eTzns1jS9jeX/no8QBVpOvzld2e9fNNtda9NxNpOozd/3mmvJ/6Eh4P8qij03xlpEnm21prksneT7LdFx6YfBbH445+lN+98Xveuv5i9pU/5+T/8Cl/nY+7dB+KiXU08eu6wlvFdW32K6v5LhvOubP8A59J52cvNbc/6iRmi/wBgVTvvix/YfjvxLq3h7SRqtv8AELTBfeL/AB3qt59s8baXekHN5oXia4aTWrK69J7W8SXBPzjofi2TTNSmTyptP8Qyx/8APOSyuZE/74bK/pVO8h8XpZKEtNcRVj8kBbW5ULFz+6AA4jz/AAAbc9s0rLsv6/4ZfcJSldXk91u35efkvuP0Nu/2prc6tpWqWngXxZooKzR+IPGvivxnqPjC6tUuc/aF0Kx1C6u5bNJ+k623liXPzhua3/i5/wAFE/jt8S9T1Zb3xc1hJeQ/Z7LSNJuLy18N29v/AM8INMt5o7CGE/8APJIVT/Z6V+dEdtrEUiTRWurRyx/6uWOylSRP9x1UMv8AwEipVsteQKE0KdAv3QsbKF/3QAMfhivAqZJSqu9SjSqW19+nGf8AK/tJ9/Ld/P3aWdVKKtRq1KN1/wAupunvy/yOPe3o3fz+k3+NviuSbVLmS5aS46+e9xK03Tp5rOXJ45+b1ry3xd431XxNF9gme3uZfMhl3T4mbzbb/j3lBk3ESQZ/cvndFzsK4rgrO31Zt+/7Y3mff3WTtvH+3kHd/wACyPwr7p/4J7fsE/Gf9vn9qL4YfAf4X+Ddakj8a6zpz+NvGOkaVc6zY/Dr4d6ZLLo/j34va5c6pDFoFr4E8O3/AIn03Tp7SWfT/ES61Y6b4BispPij5GuT7RhBcq5I2Vl8K2XyM/a1Xr7So766zlr+Pofnlq14un6tq9m20Tw66Tqbgr5k+GYY0tgd0RyucRFSQQehGc/w7BLd30FsmoxWVpcrsvbm6fDaan92CRjm3HshUdq/Qv8A4KI/sFfGD9gz9q/4ufAP4qeDvEMcfgvUNUvvh14z1XQW0fTvHPwjudY8UeE/hz8VNM1TTrPVNB1LTfFmkeFbDU2dbtPFCeKoPEvgyYn4pQ3uswfm8fD2tneDoerkSEGTKynzCDkF8j5yDyC2cHnrXq+ypTpqDp03Fx0i4RcdVvZqxMW4TU4vlmnfmWkvvWvTufY4/a58VaB4Usvh78NLODQ/DmlybvCd4iJa6xFvbMj3txCYpHdss255cMx5OCWr0bwj+1H4i0z4c63od7BbXF7qniYazDZTjzY1tf8AnksUhZRD/sBdv+z2r89W8PeJ3fzX0LWGlPWRo7kuT/vkFvXv/PjpPK8ZfZxONG1TzlXYs39nSeYqf3BJsDhR6AgY7d6+NrcH0KzUnhqUpq7dSpTU5yba0cp30t2S9670Ukj6GnxxntBKNKU4Rdk1SqOCsrbqElv38rd2fpm37VXjyL4L3ljdeK99x/wkn2jR7CxaeOHTbjH+v0+CORY7KbP/AC1tlifp83evJrL4s/Ff4w6r4T+FHh/VZLa78Sa1pWmXEE97cf2NqOr3uRqnjPxXaGU2mqaV4O5/sq61KOddIUMbJ4cYr4/sLzxmul3+nLpOrBotdHlbdPmXyfaPKDYRj/lmMEHGew7iKw8aeBvCej/EHQvE17Fr/ia2vPDFppei6fPZ6tovhO7ST7ZcX0lmI544b0M6TIxEc7Sss24M1ePT4JoU58zweGfK7pOhTWq5WnpFK17cyejS2PZlxxiZxtLF4mTas74ipJ7R7zd9br8euv09+038cvB9n4t074T/AAtSyX4XfCPTdW+F51vSo7az1H4l+P7BgnxA+Jnia6tPLm8TSa827/hAdY1U3d5aqN+nXKqSV+ZB8TIlvIVWdlW3m+024EjAQXH/AD3hAb91NjnzU2v/ALWa8F+y+Kdwb7Bq+4C0UN9im3BbBVSxUHbkCzVEW0HS3VVWHYFAES6LrNrejzrHVG/37CVs8d9yn6cfjX29BLD8qo/ubWX7r935P4OU+Frv6zf6x+/vf+M/a7/479z6V0n4jeI7OS5ltNQe1lvE2XcltcywvdJjlbh4nVp1/wBmUsD+ta/jH4xeI/Gnhuz0DVJb2a5vHme7a5uJ53unuIbO3uHuWlkdpmnt9PsIJjKWaWGxs4n3JbQKnzts1m3OLbRNWmHPLCdvT0ycnI7V+i/7A/7Dfx0/b/8A2nvhT8APh74N8RWUvivX7e38X+KtB0KDWU8B/D3wvrngzwX8SvivqkmuTDQoPCHwfsPG8WqavbXN1Za/8QfEP9keAGk1L4s6hp3iNPrlnCiklpor2b7R1f3/AIvyPDeTRbu4xbVmm4p2tZrXpa3y1+WV4E8bXHhz4baSbuFdS0u/vJtR1O1uwLm9stQuPiYPGdxqC+dvaO+udDAsrm6GJ57LNvLI8J2V6j4N+NqaP4G13w9cRK/hvT45vDdhPIN0Nl4Xuf8Aj4vbNSClvHPj98YQiy/8tN1af7cf7Gfxj/YG/aD+Ln7O3xb8P+KrB/Cmqaje/DvxZrGmXel2vxl+Dupal4v8B+BPiRph0+S58LaTpXiDQPA9/q0v2S5/4TQ6vcXHgK2gh+MEB8WQfHmny6hPZf2amlNqenX1v9ksrBL06fZLa/8APrrdoGSC4t89IbhHj/2az55yt78pJ7e83f736HE6cE05Ri9bu8V0t3Wvk/L7svxV8L/iD4DsvBkmqaBYL4g1M+K44vDGi6p/wkXxK0aOE4ibU9ChafSUW3+UxKYmKLu2KrAK3hHiey8WeHtbuNJ8V6Xq2i6pbn/iaQa75MRsfQotiimPPbaoOe3p9So9ho/iWTXhq/i228b3SSaRcaV8LvEPhfwFbm7uA32mafWfGOnanJLLdZ/0iUrNPIdu5sbgep1rwR4F1i/1TUNZ/wCEZfxEkJ0m20e11bWjqGk3zbc3Pi7xGB9p8e3B2qGm1O4vZSAAXxwc1lEubnT5ZO3vr4teXXmWvrZ/he/rLM6SiopQUduVKyTtHeO3Xz6720+JbUSS2btJaXcjSarHZuZN7l7OAWqw2j7slraIWFiIoDmJBZ2oRB9ni2fUfwbutB0rX9auviFc+INJsbbSPtVl4Z8PwWlhqmpXQl8/7TPrtoYpp7jz8TGZ5Wk83592/wCauV1rRNHsYvsFhclpBJ5m5X1QMZeP3mVGfMx0fO7/AGuK5TUNEiugiwyyRrHGYkVH1VFSLGPLVRgLH/sKNvt3ranJ5VPnm5Oo7Jzbbnryr4nr6a36GDUZ6ySl2ur/AJ38jsPiBqGueKbrVfEUOqPYX/gHTPA2oailtcy27i/tYVtra90JonU2t5b26pBBc2pSaGFVijdUAUeTeJJNRjktJ9buodQm1fS/7cSZG86Qwdl8xizFPRckY6Yrob621bGvZ+1/8Ti2h0Nf9Cf5ri3wLdvu4Lwf8sW6xdIytclqGg603k7tPvW+z232K3B8w+RZjOLWEE/urUZOIE2xAEnbzWbfPLnl70n9p6y183qaZRt8n+hO3gjx/fXkh0jwrrUkU2lK+mXQ0ey0uzuhlS06gQxWskhUsFYuZNw+bCkGvtXxj4/1v4X/AAg+Kv7Nvh3Wprr4cfFW6+Cni260+K9mXQrTxj4V58RxLpayDT1utV/5ikog82+I/wBLeWvG7j4h6/qWjWOjNqOsyRaFH5SQOLp4oYu8cUbMUjjPPyKAvtX1D+wx+xj8af8AgoT+0z8KP2cvh14d1+/l8WalYaj4/wDFek+HrjXtO+DPww0u70PTPHXxg8QC9hsvDeo6d4en8V32nj+1tQ1Lxy2tN4S+H10W+Kk1hqlsXUdXstWTa6aVlp0vfZL/AIO61dl0RjfCz9oC0+Hnweh8DXWgy+ZrKzIfFd1r2r6PpemJcfEC6NwuraFocqQOs4vbzzxNEVlF1c+YGE8u70bRvjT8TLeey8deF/EfivwVpfhif+z73xb4a8K6PqRl8QY/4+5dKvVXzPCvf7O6Gz5+5xXXftU/st/E7/gnj8bPj1+y18TPBl1/wkul6vqeoeBPiH4n8P2/gG18dfDLUbrxevgX9oa0vPEY8TeFLn4aa7q/gi7sv+EMivLjW5tZmuvh1Y2f/C6V/wCEsi/P+e/8YGS4s9R1XWLm8vLX7Fd6dbajenQLqz/59LiwWb7HPbDr9nkhaL/Yr6/Js4UKfs4Pkha/JF2jst4ppPTuuvfb5KrkkatT2lWnCrNu6nUgpT+zrzSTlbR/c/K/2XrP7RUGreF760h1DWPEXje6j/tW88WTX93baBpuh/8APCHQnlFvB4u/6fEhW+/6aVmWn7TPxOtL/wAArL8WPiL4GPw91SHxV4Yj8EPe2Gi+H5oP9Rcva6RdW9rZXEP/ACymijikj/hYY5+VbVdKezuItTm1Sz8S3V19tuX1q1l0myubzP8Ax9zrpAVJrn/pvIGl/wBqtTwZ8QdK8Lajd2Or6N9o8NeK4vs+qRW8Oo/bLe36eSSE3CHp+6Pyf7NOWawm/fjGWv2oqX8ve/8AV9d7EcolBWhHk0+yuX+Xtbs/vfz+4/FH7TGmfFXxfZ+I/iB4Q0Kc+HovsthpnhHSLDQfDvjHUv8AofPGunWNvBZeIPE3/UwatDd6p1/0vFenw/tRarqOq6vDN411vU9KFta2ei+G/Dd5f6Lo3w5s7H/jytbDSbOeGy1m2s/+XWC3gaKDOYUXv8X6Bofw4lt9SM/xFsrZ9Wh+zaDpqa1okdvY2/P7jUbddLEXk+sTps6jbwAcOy1bw1o+laZqUGt6Jb6rbQ/2RGINS8RQzeHr3/nvpbxlX06fr+9tTE5/vVn/AGhQt/Bpbf8APuP93+7/AFr52895ZWvb2lTV2+J/3fN+Xf8Ay/VvSPjV8V9YvdF1C51HS4vEvixSPDXjr+1mVfGNvj/kVPjJYGbzPA+vf9M9HCzD06V8sftK/tqfHH406t4X8G+E/HPiz4Vaf4Bu9d0PxHbaL4817xb4g8X+NdF8cNaaTrPiTxP8N9Q0O/1zRdKtSltpUmpXlxFp1uGt7VUjYBPkzxN461/StA1E7tH1jU/EOvbvCeoeGr2/0e+0f4pZz/wms9zZtBNFEByNREqT9jcdx4p4+8Ny+BdZ0CeTxLo3xD8OtBP4j1kaHJe2t/qU1xci9ufDOoSRL5l1p092BczafOXtpZyZXiLkk/OZrnUox5FOcY62jGUox3jstFppofRZRkkMtlzV6dOpKX2qkIzlfT7UrvXzf3I/pg+D37ePi3QPh/8ADqP4leJ08Q+Om0Hwn/ws/wAa+HvF3hnxkfEAuf8Aj4/4SbTtcsrqTWvP/wCW/wDahuvMP39w6+C/8FBf2lvEfxC/ZA+IPhG+WeWDUtV8DWVvaahJY6Zbx2Vv8SLW7t7SODR5BEttBdWVldQW6oIori0tZkRZLeJl/M6z+MsGo6VBqUUXhnT0neHUZZfC81x4Y1rwxp1tj7PaeKbrTVtLrxta2/8Ayxt9QkvIov4FWvcf2cP2Yvit/wAFBfjp8K/2RfgtpUeqp8QvEmkXfxO8W+EfDGo28XwX8BeDr7UIviB8VLyTV4rbwdrfgH4Oav4nurWSS8vI/EvxQ1S5+Hvw6YXfxwsdF8Wxd/8AzJVN6y1bl9rp136vr1OFZXU/tu12oXXu3ly9G7L4ejut9dEz8NvE880XiPVVimliXzvN2xyOg83/AJ6YUgeZ/t/e96W01e2uzi9SNOnVVPP4jqf0r77/AOCjX7A3xj/YM/aa+L/wG+JXhXxAF8G+IdbuPBHjrVtAlsIfH3whbUvF/h3wJ8RLK60q2uvD9zpeu+H/AApaa/cB2Hiv+1rDxVdXNutzb388X54f8I9rR66Hqh/7Zy//ABFfLX2t1/4Ha66/h21Pq+VWSv0iuitZJfacb7p9LdbHT6TqP2j/AI+Hafof3zGX/wBGFq7qz8a+I9PtN1hetYt/es55LZvzhkQ//X49q8dtNH8UwnNrpmrP7LYzsB+anp344q+dM8ZbSo0fVNvZf7Mk29PTZj2qbRejgv8AwFeXVf1p5AqcU1ZwauuqT37P+uvc9lsfEup/9BBe3/LZuvA/v9c/r3716ZonivV/D1pPDpv9jG9uf+Pi6voLd7i45486eRTLN158xmr5gVtcT7vhjVl/3dJkH8ohU2oL41dtz6Pqzt/efT5mP5lc+3X6CvFllXO7ySlqnrFvrHuv+Dr9/qR91K2mi20/I+wNS+MyyxNNLpAkuG+9ZyXm+JvdomYofxBz36mrNt8e5LK5fVNBh1KLR3+/cT2VgNXk/wB66P8ApDY937Yr4lvl8R+Z5n9l6p5mM+YdOk3/APfWzd+XOKrCz8X2y7JdN1by/wDnm/h63dD+DwOP054pf2Qna8U9t43/AJPL+r+l3teztdWutPyP0U0/9oJL6z1C3+121jeRTfaIriBxDcRXP/PeOVCrpN1/eowfP8QrxXxn8SNV1rQrnQIJYBaXlxHd3lmrYtbq6hmt7iG5uLcHyp7iO4s7WeOaSN5EmtbeVGDwRsvzGsGqreNt0DU13/fCpIN/H8WBhufUn16c1+j/AOwR+w38YP8AgoH+018Kv2evhn4S1uOfxzqtrY+KPGGgeG9G1SH4d+CfC+r+DPDvxP8Ait4kTU/HkGhL4M+EOh+OdNv74FoPEPxK1823gWJrj4tX9n4ntvbUKcbNwhpa75Yq1rd7HzP9nV223Wq7rTnm73tdfErJffs7WVz9Jv2Hf2m7/wCEf7Mng/wldatqul22la743WWe1W1tCVm+I1zczAtDJHxLcXl3cSgn557u5lbdJPIz63jT9vfxpqTf2bp2oXUo/wCgiL+6Nyf+3gTeZz/vduMV8Q/tkfsefGv9hP4+fE39ln4oad4j3/DjxP4mu/h74r13TJvDeg/Ev4S6nq/jPRPCXxFNhpLL4RvNF1rRfAuoeMp7m4VvG9z4gW/v1D6hbXTQ/It5rfiuzuytiInQHO0E479hx/n0r66nmsIqLg0laNnFpfya6W8vvfz8HOMl9ouWUVLV6SXMr6K9mvK++9z9XvAnxd8ReJoNf1pvELaRcaYP+Kl8VeJkl1ua19f7E0y9M72o97ZYwa7LUPiX4r0Czi/4R+88feOdPi4h1XwVoely2UWP+efh2/KwJ16LAPbsa/LrTfiprkUlzrV9Jb21xef8flrpeq6rbJdZ6/aUt3QT/wDbQPXoem/tPalpM32i7t7Rrj/nvYDUY5v+/sQV8fRvQdea9pZ9Vsv3tXZfbn/d7N9vP87fHPg7macqcGrp3lCL09zy8+nb1v8ATXif4yX9/daRc6vqF62uR+IP7Rj0HxT4U03w7dx6b/z6Jr+mwJMtp/07iYQ99h7ZfxX+POt+LHaw0zUL3x74asNE/wCEa8MQza/deJrzQPDn/Qv6J/whVxpDaVoh/wCgTYeRY/8ATvzXz5fftL+DNWsUGoeFdTmCLsjFvow8YhE/uoPEEVztTr8oGPbnFYtr8Tvg14nfUJL/AE7RVeH/AFL+JfDreG2iP/TJtLtEKf8AASOO3epfEueP/n5Z/wB6e3uefZP7j2VwVlKs/aa6b99P1f5d9Oe8Q/EW71BIb7UbG8+2wLst7yUyNdQp/chuHJljX2VwB6Yry+PxbfXlyujXYee2T7t1aO4dQf7rody/8BIr1XWte+Hs83maNqUd5N3sLZ9S1yDpyfJ10SR9v7vT8q87t7Dw1qt7/wASbXdJ0LocIb209e0Sp7e2MV5H9qRurpXutrb3ht9/4v50sl5PhjGNrbRituXsvP8AH7sHxRI9on2id3e6/wCfR2Lx/Xy2JXH4dOa8P1bVZNSQxtNI8X/PNpHaP8UJK9+49fWvVLnRtVu9V1Ge61DTLmwTWfKS5uPiBospSPP+rSSSzdhHt/hG1ewU5NfS37D37CPxT/bs/ap+G37NPwe8J+ILz/hMdX07/hPPHmkeHJta0bwD8N9O1bw14S8f/Fq/vdQSw8N6V4L8L6X4p1PV41kli8UTa/c+DvAU0Uvxa+xeJbrHN5tRTu0tb62ttfd/0vI93JormV2tOVpaO+ja8rLr52Vrn58+HfGmreHvEOqQ2E9zZwySmV4J7iVIzIP+WjR71Qyns5XOBnd6eq6j8btZvmuWvr3a17BpVteM87lru30HA0O3uiz/AL+HRuP7Jil3x6dgfY1hr6F/4KF/sFfGT9gT9qP4w/A74n+CfEV7/wAIXrU48NeJvEGipbJ8RPAPim78ZaN8N/jB4ZfR7iTQbvwL8Wb3wjf2ulWFjevrPw81WDUfh0fI+Kuj3eqy/m5JoOuy/wCt0XWJPeRZX9/4ga/OKuRUs4rRrKjS9vT0hW9nF1Yq8ZJRm488Y8yTsnZtX3tb9Vhm/s4KEbwjZWjG8VtHpFWTt5N6vvc9rv8A4vWB1tYLV77W7OM4jujcS2Ui4z9xvMVwOmSMA9OvS54e+Jun3eqHRUN5Z2shO+4upn3vt67yzbj14D4yORkA14E/hfxI/wB/QNVf/fgnb+amrzaNrzwec+ka883/AD2ayuWk6/8APQoX9utaf2Qv5FdWv7u793XVemnb5N+c81l1nu7aTVteX+9pt18/K/0l4d+JGp2KNFa6J/bUT/ej+1mxjb6qSqnPup/WvedI8YaZffZtUS5b+yp5PNurbeRf6XL2ktmz5ltIO7xbGPrzz+fn2Tx5/wBA3Wf/AABn/wAK3NKufH+nmRv7P11TP/ryLW5Uzf8AXTAHmY/28j9aayqWny7/ANz/AIH49tceaT+1J383/XRH3be2fhzWZ9Eu9b1iSTQtK8P/ANnS6dbXDfaW1Hj/AEtkDc3f/Tcgy8ff9av/AAueLwppwstG1ey0nw+Ln7aNK+xJbSi8/wCfsQRqi/auT+/CiX0cV87+Htbvo3L32n6jFIzb2c2Egdn/AL7Nt3M3J5J3e/WvPvHC65rGqDULW1ubqP8AsYS4bTjIN/eQBo2Hmc5En3uOpFCyp6XXbpd/Y/4H9b+VGpUuv3k919qX+Z1XiX4532q6hrDy6MZnnl82eSW9aRpZf+esrMzNJJ/tks/oemfOrzWW1zWNOSXULHVF1ZdurpYabHpawrkDaRFHGAoBJIIx2xyK446DqjEk6dqJJOSTpshJJ5JJKZJJ55r9H/8Agnj+wD8Xv28f2pfhf8A/hP4M18jxrc2M/jvxnpHh+XxDo/gD4Q63qnhfwt4v+KuuXus28PhrStG8GaR4m1DVbeZr658UL4ln8OeCrCSD4oz6ZrEftJKCVklZXbS7W8v027W19WM5WT5nsur8vPyR90fskfFHXvCn7Pfhi00jw2NcuDr3jgebHc/YJSLj4gXP2gGRSjkTi9vPO+bEv2u537vtEu/5F+NGp/E3wh8f5ta1Vfh94l+IfxcsL3WPFvibSNT1jT/DlrDqgxqfg+4mg8uNtE1DgXujS7rC8z+/t5MV9lftF/Bj4h/8Ez/it8Z/2WvjTpniFJvhl4k8R3/w78Xa74XksE+OHwk1a68az+EPiJ4YXSo5PC3hfR9av/Ad/LPdWU0Xja5v/tgVpLiG4WL8tvHfxa+NHxxvCujaJJ4X0izYyWSzX9xaRXjDGGlUtFHPIeTvAkAGMsSSo+PWUOOfPOVpRejglaHTdLTzs1Zu2mhs84nKPs3Uk4rTlc3yr4VpFu3Xour+d745fH66u9S1Hwr4d17xT4T8LXfhMeHPEukeDLrUfD3hDXWFjeaaE1nRdHmtNL1RRp2oahp4W+tZ1Wyvru04gupo5PiO3t9T8Qaza6Xp8Ru9Su9RTTNPtwN5vbhnMYeYHPmzHK/OwZvnAycCv0uvNW8A694WsfDWtaNo+gx3Og+E7G507T/DdhceIZ9UuB/pF9P4nitRey3k+P31zJctNL/G7V8nf8IhD4SvtD8T+HbCXS9W0fXf+EqUyX+o3UsPhkEMlirBJCviJCAcxmK5BCFZVKCvabbT1eq7/wBdl9xhGza0Tu109P8AJH6xeAfFR+H/AMMNN+FHh+zeOfR9XvLfxh4W0i+N9H43+I9/GkF94outS1NxHqmnXkMccNzc3XnedDHHDI7Roqru6h4/uvE1/wCINR1e78WTw6/q0D+I9RuvLnuIvD9scW+j6NcTSPJb6Xb9YdPgZbSI/chXFfnheeNbvULSBr+6vb57WPyrZ7y61m5a3i6eXAZncwx552RlV7Yqrf8Aj/xbbaasNrdaxPCi7ViMd00aJnO1Yy2xVB7KNvXj1/Oa3CP1io6lZe2k5c3NV/eS1cHfmmm77/0z9Go51PDwUKNSdGKS92lN046KH2YOK/Dq/n99aH8UPEGkTxXOnaF4f1yxu4/K8R33hDVLtdd1yL7B/ZflazfX5ju9Sj/sz/iXbL6WdfsP+iY+z/u68Vk1rxjo9s9zo/i7VYNQmv8A+1dP0G10G0g8NeF9U/6CWi6VEqWGk3//AE+WMFvccf6zFfLn/C2vGNxeMLfUNTAfll1DS7iXd3+bzVbPTv8AyFdnpnxb15LN2vtO8oy/60leZMf3zzv992fb3P8AVKaW70S69uT/AC/Luinxe3pzPtu/7vn6/f5noGjeBpb6Ca4v764W4n/187zyGaf182VmLy/8DZunrXEfFbwjBH4R1O5vLRrm40vX/wDiTz3F7501wf8AZlkZnP4N/LFU9P8AjTbz6f8AY7mPU7efj94tnKsn/fQAbHpz+JAr6W/Y9/ZX+L3/AAUN/aC+FH7MHwy8P+IZ7H4g+L9LudY8d2mkDUY/h78KtD1bUfCHxE8ea3c68YvDUWkfCPQvENxr1073Mfjn4n65e/DieUXepR6M49fJ8n9m1KCUZRd+aKSkrW1urP73fy3PHqZ26sXCpKU4u/uyk5rVL7Mm117dWux95fsJfHrV/Av7G3hXwbot6Le5svEnjK4vfPndGuJ/+FgXI8+fDAyzf6be/vZN0g+13Pzf6RLu4nxp+0Pqev8AiHw1bX94n2eXxN/bMkEk7PBLa/8APJ4nYo8f+wVKcfdryz9pH4CfFv8A4J3/ABl+L37JvxYg1/RrjwZ4m8TXvw68eeIvDn9laf8AHL4S6rq/jTRvCfxB8Nx6IZPCfhfR9V0bwJqHi64uraSLxvda/Hfagrz6jb3U0fxN4j8aRTap5dpqZnh03Q92k3zWm+a7bpu84gyM3PXdn39KzzKXnko8/wC8asrzXM7e7a/NfvptvZX6rIs3WRr3G4KWqUG4LW3SNle/fr1vv3Pj34na34i8RXer+I7pLzWNQ8V/8JDfssrS3F8v246nuu5XZpLk/wBpf8TAtMzk3x+183B8yvNbLxdFDFHBp40+eGGPyoYbOKLR4ooj/wAs444EhVIz/cVQue3evKddvtUt5vtNrY3s9yF2eeTI8wX+55pJk2+oLY9jiuEk1C8l/wBat7J/108P7/8A0KE1zrhCcVpBKyT0SW3JbZdL6f8AD39l8Ycz1k2nbRtvT3PP1+/z1+hdR8Q6fr/N9b219rFpb/ZL+G8ijutJurT/AJ9bm3mWSCe36fuZUeM/3a8z8VaH4H8MX+h/Ej4a6ze6MdL1A2XiX4datfXI1zw2yyTynUfAepySSz/EP4LuTDbxeINeZNeWKFPMgZ5ZbhuZiudSsRIGgcCb/WgnVcS/9dBj5/bdu4/Ose/gvNVlM2qaXfalMZPNMt/pbXkplPWQyXEcjmQ/387vevospnUyy6rznU0sueTk7+7b4m9V106Ox4GbY+hmbTo0aVKz1dOnCF9v5Uu9/wAdSj8TNOsLO8hu9Jmv47W8iFvfXmrTS63Lp8H/ADwhluWmeGE9PKRlT0XnFefW8t9qbfZNI0ufU7TobiFDpzdOfnjCEZ9znvXozyTSQy20kWqyW8/+ugexleGb/rrEylJP+Bqamh/tS2j8q3069gi/55w+ZFH/AN8IVX9Kj6zm2v8As923o9Eknbpypt6q3vJd076+c8Pk6X8d6LVX1bXL5pa+nXz1t+AorPRWvb7VdEt7zUJ/+PuO8miuG0z/AK4ecJDAT6xlewHAq9qmsT6hoci/aZ2WbxBvlVppCsr/AGj7WWlBYh2+1H7SGcE/aP32fMO6udvYblb+dxbOGu/+PphpgDXB9Zz5WZuR/wAtN39K+6/2Dv2Hvi9/wUB/aJ+Gn7PHwn0HVWtvHms2F14v8Y+H/DUV3D4G+FfhnVfBngr4lfFKca68Xh220j4R6P45tdY1KR7y18V/EbxRPpngO4M/xjuNO15k8qnJqU227p+827fD3bfTu/zs45rCOSqMUopvlulba3Zddm72113PhWHxRPEW8M3t1cQaW/20MPPkWFv7S41HMe/y2+38/bcr/pQ/1+81k+Np9L1+10ZxJqk7wQG2hM+rTXHk25/5YRCeWQRxccIgVBnp1r7b/wCChv7Bfxa/YL/ah+KX7P3xY8LeIUh8H3+p3Pw+8YavoNxo+n+PPg/dat4p8IfD74oWV9p9pqWg6npPinRvCthq37u6i8Vf8JRF4p8DyBPitFe6/H+cLeG/E13dLHDo12kcf3ERHVIz/souEXpngDFfXR+FbWsvuseMtFdaX7ab+h1WpeJI1RtO0vUVtNM0e2/tqOWazWPVtX1pj/yFrucKstxqeT/x/Su1yBx5oAr7N0r4u+EvF3x6+FvjTw18LPhTL4D8AeFPg58CLr4bfErw1pZ8MXmk+H/h9D4V8VeO/Fscdi+mXer614jFzrms65eW9xqOra28d9fzTXLG5X4pi0LV7yQS3Vhqd1KI/KEtxp8k0gh6iMPKjsI8fwA7efunpXqS6lq/hT4UeItK0SaWTUfHevnRL22i0No/s3h1JDc/2gvlRKYmknAfzlwRKwlB3jdXkbjUpR+GTXo2vyPJL3Ub20v9Xt5bqAXdo8cl++nOIdMkeE5hfR4oSkMDw5HlPbohTnZjBAj07Woo381AI5OnmIArn/gYw2fx69utc4ND1sKqDRNdCJyiixnCofVVCYX8AKzl0XXk+7pWvL/u6fdD+UYpPLqj15p626yf8n/A/rcbbd27+uv5npNvqsl+BYiaVrAcCbzHIX6Enjp+dZNjPY6dMbPxBcM8g+UaDox+zylc8B9YgbGD12mVlGCMkdciPw/4ihTyoYNbij/55x2lwif98KAv6Vl3Wja1HGYY7PVUgOcxJYzJEWPcxqu0knvjn1FQsraV7dntrpyd/l5+ffR5rze65Ptq3baK/wAuj/I9b8DfGTxH4A8W+HvHGgGLT9S0G71m01FtNb7DN4l8J+I9Eu/DXiLw5rMlqYpNV0DXvDmoX/h/WdHvmn0/VNEvrvSr23nsLmeB9zxnHD4d8R614X0u8ku9HbUobjQ9QMrs1x4etv8Aj31lZN2TNBx5NwDvi6Iy14QPDutAgjQtXBVdqkLKCq/3QccL7Dj2r9Q/2Ef2Ifi//wAFA/2i/gD+zt8MPCetS3/iB08KeNPG+keHbvxHo/gH4A6pe6BqniP4y+J7++aHwxa6V4SsfFmuaVZtqGor4kgvJ/BPw1t7JPiUNI1lNIRUbKPu7LRW++1jJPljaOkd+VaLv8O34HK/CXxE9t4Z1DTLe0jgXTl2XOowRrFcSp9o+17ZbhFWR1+1/wCk7XYj7Rmb/W/NX1P4I1WyvLi0u767eO7sIZrayuS7faLK3uP+PiC1mJ8y3guP+W0ULJHL/GrVw37Z/wCxv8Yv+Ce37Sfxh/Z1+KWi+LdNtvC+qaleeCvFt/ZX+m6d8Rvg5qOqeMfBXgP4n2K6ZLL4WvtD8R6J4Fu9beVbi58YS+IZr/wLYx2/xoT/AISmz8a8J+NIbb/X6n5ntJab+mf7wP8APse9fH5pk/8AwsRUYpQlaVkkou/K72SS1utXvpt0+zyviuDyeKk+adL3acpXk6aSVuST1h8rPd6JHu0/w88ZeOvib8R/EWsanpHgvRvEGlfDvQPCd3diG71kfC7wHbx2Go2tjeHNzDrUlhBb2khikWZoUMDEwhEX7R8EP4R8B6xqnivQHm1Lx3Yy6DNe+M9UzdeLGm8LWP8AZnhiXRPEU+/WLeXw5poXT9Ce3vEbSLEC0sDbwDyx+acvjW7tdShvpPEF3qUTtOdIW7Wa6TTmuSftBsFlZxaG4/5b/Z/LMo/1m6vUvB/xhkmvEW98S+H7/Ro+I5fsV5p+qoP9ify1mUDp8rCtM24bxWYpewrVqSSV1RqTppqPLp7so30Vvnpc78p4kwmX6YijRrXd71acKjvJpt3nF9X+P3/rhdftDeLtQ0uCHxB431W4v9L0v7dPbQ28DBr37aNS+1shkbddf2gBf/aCPNN6BdbvOHmV6hoH7Qln4n0+w8N3mtav4fbR7CHSvBV3YeJL2x0220u2z9m029SC6jhFhb9YLMgW8R+5GtfhHd/GbTIpZZ9J1qzM00flTTX1pqEkssXH7uSSSMu8f+wzFfbOadp/xo0+2hit59btJLe8/wCP+CS11F4dP/65RMhSEf7oX+h+O/snLr2fDeYN3Scrz1fua6v0f3ntf62QSfK3HTSz5baRtta34dO+v9Beq/tKXGtl7fWfH/iHU7x/v3I8WeELidz6PM9qzt36se5r531H4h6h4r8N61IPsui+MdDtPsHh3xVYqtn4e12x/wCfKfQYBHbXNp6W7wvD/sV+eHhv4xeDreX+zrvxf4Yt9S/6BS2Fwl53/wCZhEXnf+R+nrxWhH8ZfCz3cEdl440iKO1/49UvbzUWS26cwK7ERf8AbML71+h5Nk/JZwiqaataKS7aO3L89D8/lncm378tW/tS68vm+39a2+7vA/x08Y6ZpmqaxoF/N4cutHu7O/1zQrm7ntbO7vtPuvttheabZrJHCLuyvP8ATLO4jjE1tdf6RDIkvz14J+2f+1pqnib9kL4vfDG4kuov+Fj3nw5bxhai5m8m78SeBPiRbXeqa3Zwb/LfWbi7srK6udS2G9luLS2mkmaS3iZPmHxb8btBvrZpdM8a2d9Lov8Aq30bWvCWrvq3X/j7fWNMZrv/ALbGT8uvSfs9fs7fF7/gpN8ffhh+yf8ACvRLjU9R+I3iJNS8e/EDw7oGo39h8MvhLoN74Yj+KXxLWTV/s/hLTNJ+D+teLdasNSvRcweM/irrN/4D+G+q/wBo/HCHT/Fx+xjaC09227Wnz06niynOfxTlK/8ANJv82fg/4kmmg1bUo4JpYY4381I4pHjRJc/6xEQhVk/2wA3vW1p+twhRaAL9oT7so4lX/dfG8Y9sf0r70/4KG/sF/F79hn9qv4v/AAG+JvgrW4ovB1zqF14M8Y69oceh6b8Q/hHpGq+L/CnhH4p6BPpSL4cvdC8XaP4JudWuJ/tzeKZvEMs3g28e6+KdtqOtD84V0DXUfzF0TWFk/wCeiiYP/wB9DDfrRGMOaM+WN7p83Kr29bX/ABFKc+Rx5pctn7vM+X7r2/A/Zf8AYm+IT+BPip4evdI8UjWYPDV5BqPhnxhHG+nTQ39t/wAe99ZaahSS2vLfrDdQKk8X8Div6SNc/arsH00SaprSHVtSktJtU1GW6d9QtJdPtvsmnyC8ZzcJJZWn+jWb+YGtrceTCY4vlr+R/wDZGZrDxno+reJnaxaDPkTaqWZ4f+uTz5ePp/AVzX0B8ev2nJ9VtNX03wjqNqA+A+oWVpqUNy/fDzwIkrDr1Y+nOK+sjmsYwUNoJJuKso/Yu+XRX+V9X8/zypRpzqSlKnTlUu488oxlLe3xNN2+dj7h/be/bu1Dx5PeaL4c8USeINGtFsktdJUzWemWyab/AMg9LawDrawrYf8ALkscSi1/5YbDxX4L/Ef4hf23qTzXNzNdzSLseW5mknldOm1pJWdmU/3WYg9cUureJ/FWuO8t7ba4sj/fke2uS7jP8Ttlm/En29K8k1PS9Uvr/wAldD1n7NnH2n+zZvN5A+bzPLzgdPvZz+NeVnebf21BQ1lBaKLbcfsr4XdbPt56nq5Hlcsmd9k3zaadU+6v89fLvTNxcXF7p3kTyx+Z9/y5JI9/U/NsZdx/3t2MHivSLfxpa6dIkuotf28sUflRSaZNLbyRxd443gZWSP8A2FIUf3a830/R9atZNNkkstUJYkgtYzMVBPADFc8AjH5nnFWb7S/EuoZ36PeWn/XJHi/9BC549R+Br4+WWSnbm961kr3el4vr6/c/LX7BZpGPw2WyvGy/l10t/Tfz9l+JviP4ew+KLHX/AIRat8W9Hi/sQ61LN8RzZXOryeI1ZgdOF9Y3Ess0Z28fvWRgQy5BzXS/F346+LPj3H4KHiTwV8HfDd94I0lrG18a/DjwfpHgmLVb3duS/wDFVtoGn2A1TVPlVWur61eQMN6sQdlfLun+E9cWRZl068WWNg0ciB0kRwcq6MuCrK3IZSGHUHNfr3+xn+wv8Rf22v2lfhn+yb8IdJ1nUtb8casLv4jfErwZoGma5pnhD4SRXPhPSvHvxU1m51f4jyeHY9D+B8/inV9MvvN1AeMviFrmo+Ffh5bQj4wRaRrOniy2UFeK5bLdXTWqfRq++t7rvpvnpv3/AK/yPzE8N+IdS8L+PTbDxxqvg7wzD4iM91qNxoya3p32pGDG7uPCwVrG7ndA2JJLeZlX5mYEYr3/AOMP7WfiLx34S1n4TeBI9U8IfDXX7zQG+I1zrlx9v8f/ABy8XeFv7Qt/Dnjz4weMpZbjVbK80IfZZPDfwt0/Uv8AhX/hyWKcaRpyssNwfWP+CiP7AXxb/YP/AGqfjF8C/ib4F8Rs3hXULm++H3jbUtNm8O6d49+Eek3HibSPC/xf0zVNLhl0DUNI8XXHhzTbG5dNQ/4Sq68Q2nifwLfpdfE9NT1Q/nR/YniDBX+x9b2mAWpXM+DbA7hbkdDAGAIiP7sHnbmnGEVOMuVc2i5rLmtfva4yjLq+qiCxtE1TULy002UzadbTXlzPb6fMbi4vDNZQPK0drI13d3V0Xt1jY3FzcTZ8yd2brI9OsLzw14n1y61XTtL1Gy1iOKx8OJYW8E1+G+bY8EcKBol3AFHVgrKWPJIHJpoPiRPuaRqaH/Y0+Rf5JWzLoniqa5a9m07V5bxpBK13LYSyXLSggiRp2QymQEAhy5YEDmvXSVlotlul5a7X/r5gaBsNIlsbGLRr+31y61LWfLj8NDTFtdXSPJKJ/bvl/aPKc4QRrMI+h2/eJ9103V9L1PwNiLwP4W8LjQB4Z0y18SeGrbx9qOq399dO73FxJpt5qgaSe5GWmZVHmEhAXG0nwi3/AOEv0++t9VGh3Mc1tJ5tvaDw0BBbyf8APSGEWwSF8/xoobOOTwa6uyvPGEV0L27ttduL0TQ3Au5re6luhcW3/HvOLh90vnQf8sZd++Ljy2WvJW69Vv6/jf8AI8uU5fzNq+6k99PRaWWtvm9LezeH/EV5baPrUeszay2jtF9n0Oxnt7SS6ubfj9wqSMxMP/TIDZxjHSvavBMGhPex2QudN16wi8NjSIp9Rjgv/Lvf+e6G5WXZOf8AnquJO27mvinXrbWbuzhhjtNVW88N8WVytlMLi9B7vKF8yQjHGS3HQHpXSeH7rWNHXTl0mW/09HbfIklrLErvnO5wAoZs/wARyfc16yjGy91bLovL/JfcRzSt8T7bvy/4FvTyP0B0j4j3ulzePY013xPDBq1x/wAI7od9HLHHNpsQ/wCZo02ZZg9nquP+YnbPHdjp53WqnxC+KHiS8/Z71bwJqnigfETRb7/hGdetNRPhnTdM1qDxHqHxAb+0NOgvJIhdR/btz/bI45B9p3t5wfca+CdQ1XxLboI7Zb64jCbBG1nK6BP7m0qV2Z/hA2npjAzX3/8AsM/sh/H7/gob8f8A4X/sw/DXw74neDx94jsLnxb41s9DvNah8B+BvBl34a034j/GW7m11ovDeleCvg3q3i7UY7tJtTg8SfE3xBqPgz4ftZ3Xxcm0fxBaekpcmqbiktXF2sl6dlt00PK/sltN3evR3d72eys7a62tuvU/ur+L/wCwt+zd/wAFHv2U/wBmb4J/Fz4jfGTw5a+EvBPgfxloeifCDxvoHhQ2viz4i+AYmbxR8SfBvjqHUfCXj/xL4IWPytE8Q6lFc61osElxBp1/ax3M6yfKvg3/AINY/wBij4V21r4t+P37U37R/i7SbHxK2v3g0ub4Z/DPTNcY4xLfa5oemp4nvZpACxuprtZoTkQoFJNey/Az9uLWf2ArG/8A+CfPxx8BWPw/+M37NelN4W8J/FP4oWM2kaN+0Z8CPCdx418LeGP2j/CVxYCXwvoOk6r4Q8B32tX3hm3v28aXN3FdO0M0ounap8Yf2t7LxIn/AAkXiLx9BrWo3a7LFJfElnePap/ctmmu5WhTBxtjKj2r6fLsly/OZKUcQ1BLmd5ylKTWtuW/Kk3d3bk1Zpxu+aP5pmPEOc5FTeRxpWqK/LaMoq2jjZ6S/Jcvlo/mrxz+yl/wTk/ZY1xrj9nD9mLTF16zvV8Q+Hvib8XNW8efG34i6GAMGTRfD/j/AFPWdM0snGd1lLExPJYkkn84vjZ8VtD1Oy1Ca0tbTSbyHWvKh0Kxhhs7KKI/8s47KBI4Ej/2EiC+1dV+0H8dbHxJGIbDxNp9zCsP2dYWn0p4lg/54LGZCoh7+WAEHp0r8vfiD8QbvW52uYZHFxJJ5z3Cvp3nPKP+WjyhhI0nT5yxb34AFZpjMPSgqcKVNKMXC/JHmaioxTbSbb0u3o27v07+EqHEGLqrOs7VSlRcvh5pKGrvdQvy9t136b+2v8RrqG2jv4EjuYtO/wCPpX1EusvvKrSEOeerg1z3jTxVb6pDe68+oXEt7rnJhkuZJPM/3w7nzP8AgW6vmGwurURSwA3Yhm/10IbTxFL/ANdI87H/AOBA/TtWw+sWUixq73brD/qld9NZYv8ArmC5Cf8AAcV+YOcm2+aW/d/5+S+4/ZlGNl7q2XReXl5L7jrrvxH4gtX069muVeB+HR5GaN+3zqzFW6nqDx611l2La+tN+paRFYN/eS4SJu/8S7Sfz968K1PWlvkWJBB5cY/dxi/GxB/srv2rz6dqtaj4ne9iFhfpepLnq72BYfizE/r2pR3XqvzKK3iG60e+1T+zlMO/J/hTsPpz7elfLnxtuok0DyURI4f7eg/coiLFi2z9n/dgBP3H/LH5cxfwAcV6He/adOm1K5ju5bu4jxsnlk0+WZP9yVnLr24DDp9ceo/sl/sj/Fb/AIKMftK/DT9mv4RaRf38HxG8S20uu+MtI8P3uqp4A8CeFNV8LeEfiR8VNWk8QLa+EbPwH8HtG8Xanqd1Lc39v4p+KGuah4H8Bah/aPxvFh4vi9aLUVGT2STfyE1dNd1Y/STQPif4T8R/D/4e2em/EPxXpGg6f4Z8G2vijXPEHiPVdYsoLX7P9k+zaN4fu7uaC2g+yf6L5NvAkf2f9xt8v5R1nh74x6r4HJ0DwT4rl8W3HnfaDqGg+dPY+f8A89/+JqwTzuf9Z98/3q+Av2t/2d/i5+wJ8cfiT+yv8aLHxNoF38OdT+1/D74h+IfDc2jv8evgv4d1bxN4P8K/EPw5faSk/hbRvDviHw/4T0fVbhtOv4vGNzr1r4z8EIZPjfcX3jCfxbQfibruoDUZrW48ValZR42W17qK2luv+5DJcCNf+Arn6cg/VLiehZL2VLZK/JDf3F29fv8AM+ZeArp3darvd+/N9Y+a7r8O2v6YX3xguoLyBbnxNrMy2ogW1WXV76RbZbWLyLVYA9wwhFtB+5gWMKIoT5cYVPlqG18fp4o1XStTuppLEaeuy7N9IxO3+7oRkYm2Xj7ttsHt0r8w/CWq/ELxDe/8TGXUW75murWQ/wDj8zf59cV9MtpPiO6tkvIdXQwaT/yBk1HWLCZJ/wDcSadl7Y+UV5n9rwvdxjum9v7v+a/pI+lyqPu2W9krrR6o/rO/Z8+PkVl8OPD2oP4304roeStgb7/iYQ8/8sz5nmR8/wB3b7CqMf7QsWu+MjcJrGnS2bXv9pNPqsiXOjtqP/P+0Nwz27Xucn7UVM/fzO9fy3/Dv4vfEhrttHs/Fmn6VA33ruSLTYpGz/ekDKx59W6/UV7Z8Tvin438K674G8My3V/NqsPOp+EfD91oVto19/1+XtrMltc4/wCmwk/OvDz2Ec6hycqcdLxcU43aXTVLR66Hs8Hzlk1SVSUnzXb5m/e1a67/AH3P6UR8Xdc17VjZLHatp1rD9n1DWCqm5u4P+eN1c4Mk8P8A0ymdo+fu+vxH+01oV38PdEi8T6Dojvpl3L/a9/o/h+3W5n0+y6+RFFapiGD1iRVT/Z9PPfhl+0b4Es9L8N2l14o1nWte1nRfN1vwbJ/YVmIpeP3kmqNKN0n+27FumDX2V4Ys9L1bSZb6PWPE+qRTw/Z5kWybT1lg/wCeEoGuqskXH+qcMnqvavmMjy2tkru6lSOq0jOS/l00evW3R7dz7yvmVHOk1yU5NJ2vGL2S11T0XT08z8bdL/bHvdH18WWqJPaO/XVJZ9Y0i81j/sGXQMcx9MRyY6818zf8FHv2pLz4ufsq+JfhbLePcRaR8QPBsujS3tq1l58v2j7X5iCTA8z7V/pIdcP9o/fZ8z5q+nf2vNe0bxBc301pomlah4Z8I6l9u0zUIdC1DTdY0vVP+gBp13HqSXFjZ/8ATlayRQZ6x+v5/wDwo+C3xc/4Kf8A7Snw5/ZD+F2gaxrx8QeK7C8+IXj/AMPeFU1Sw+EngvwXrXhbwT8QfijqdxrUln4O1zwR8F9L8W6tfSPfahF4u+J2van4C8B3n2v45Jp3jSvuqjcqcm/ebg7X11tpvfrsflytF8trQ5tYrSNr66aLY/0P/wBjr9oT4ceIP2ZPgH4jW+0cx6d8EvB3he5by7ctLE3gNZXtZm2/PbSSIryQOTE7KGZS3Nfk7/wVH+OEttpum/Cz4Sabq/ibwBptxYS3nxNsPHl9YeGdK8U6j42bTNX+Gtt4Ct7yLTrWbwppYWy07xXFZI+lWZNnbXMUC7T+XFj8avix+wFrnjn/AIJ7fHa7t9A+K3we1W4PgDx14o0jUPDHhf4n/su+F003TfDXxA+GfhLRUF34x1PV4vDVlZXmpax4qvfH80SeP7VriT+0NZik+JvjJ8U/HN5qviSz1qV76a9W7j0/UtJh8Qix1NNQuPtd+k5i1sJcJe3X+lXgk3i5uP30weTDV/OGccQcUZbGeSVMvoznO9pujCUnFuykpOLbupJ73u+p/RfCPh74d5/KGdZxmlbD0YxTdONWUIX913cU17ytvotXe+jPR/Fnw58XXXimx8MeHfi7qvxN8Katdf25rZur3wXp9nZwC4+17dAhm07ybNPtX+k4tFjX7R+/x5nz19dfAT/gln8fvCXiD43fGXT7O31X4XeK/ij4c+Ito9peaa2iyW174BZNTuliEp8Qk3aXS299KkAFzG6pcF9xLflL8M/2zoPC1n4hPjmK71PSNCiNvoE80lhc6s1v/wA8YLmZ5J44u3lRuqZxla/d79kf/gsf+zroPhSxsvE/w3vrrWrW1g0O/wDGdl4vXTdQhntrb7Hbt8T7NJ47jRZYbb/Rom0f7R5VuBBEqRfLX55SwGb5RCdOeHpqnUT54OmuRrmhON4qElZSjF25V8PqfqefcL8IVsnp1OCMTLH1eeKlVUo1KqjtO1SdWDi+W8bub5ZWlyySZ4t8Tdd8R/AfRNTXxp8TB4Ak0SH7PrVy1tLq/wATrqDj9xpfg3c+jJCOnlxIE68V8o/sc/taeBvhnqOt6bdeI73w9pXhvxBeyeGvCGniXTr6N9SvRqWoPZaxbNC9u9/qP+n3rwSIbq9/0ucvP+8rwr/gor+114f+J3xH0/xf4GCXtpN/rdPh8SOb2X/f2XHmP/wIn0r8wT49vNXbT20e0u7NtKk83xAZv7PRtQl6+bYNuBMnT50+bPU4r1cswWdZpk0pUqPLK2soR5ZdHvFX77P8j5ihgsi8Os6jHDyhjozSU44lRrRjzWUmlVUkrX0f52P9AO8/aN+FHiX4B3+ofEXTI9Dhn8O+V4gSO00a/wD7SiA5jswVcSxEj7gG0dq/mrsdE0rSJdT8UfCDXPFnhY3Opf2xp8xeKR7XVxkHVbWSGQPBqXOPt0TJc8/63FcX8HfjvFbeAf8AhFvFN7Z6jHYRiK9k8TnStU+Hhiz/AKrQ9W1Fp9at0/2LZUX2rmL3VY/hx4/bwZp+oafaeG7rH/CI6odR0nUNHbJ/5ikZle3m9/NVjmoyvhrPJO86KklveKe1k3qn0er33Pocx404c4f1yd06rm7vSMuVytzJfypN90l0skkv0fuf2kPi94b8F69a+G/FWj6f428S6f8AY/EvjLTIvsPinWtN/wChhg8IWhi8P3N8P+f91ef/AKaen40f8FBLrxpffsharPqfxSbxJby+OfAOmeI/DF7eXMRttR08bbC60SznmaO1urFSRaTW0cctsCRA6DivrDxN8YfDWkWGm2Fvo0M+nabpv/CMXkp0nVmTSVGf3FrnVSLWLp+6h2Jj+HtXyhbfBbWv+Co/7U3wr/Yv/ZwtPE+vWviTxR/wkfxK+JmieGdO1nTfhN8K4LrwlpvjD4n6zc6r8UF8H+I9P+AN74v13Rk1C+ux47+INzeeC/hk0tx8cbXT/Fy/oPCOTKGdaQjGyV2opWenWy10aXktLn5d4h8T5NPJfaLEP20tVJyfM21HRO97d1frp2P/2Q==);background-size:1360px;height:46px;float:left;cursor:pointer;transition:box-shadow .3s ease-in-out}.removeFletDisplay, .removeFletArriveDisplay{float: right;width: 7px;color: #ccc;bottom: 1px;right: -5px;cursor: pointer;padding: 0 5px 1px;border-radius: 5px;line-height: 13px;font-size: 13px;box-shadow: #ccc 0 0 1px 0 inset;position: relative;margin-bottom: -16px;}.removeFletDisplay:hover, .removeFletArriveDisplay:hover{color: red;}';
    globcss += '.civil_img{background-image:url(data:image/jpeg;base64,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);background-size:1360px 80px;height:46px;float:left;cursor:pointer;transition:box-shadow .3s ease-in-out}';
    globcss += '.sprite_img{flex: 0 0 25%;max-width: 25%;}';
    globcss += ".ship_combatoff{background-image: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4iOISUNDX1BST0ZJTEUAAQEAACN4bGNtcwIQAABtbnRyUkdCIFhZWiAH3wALAAoADAASADhhY3NwKm5peAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAALBjcHJ0AAABuAAAARJ3dHB0AAACzAAAABRjaGFkAAAC4AAAACxyWFlaAAADDAAAABRiWFlaAAADIAAAABRnWFlaAAADNAAAABRyVFJDAAADSAAAIAxnVFJDAAADSAAAIAxiVFJDAAADSAAAIAxjaHJtAAAjVAAAACRkZXNjAAAAAAAAABxzUkdCLWVsbGUtVjItc3JnYnRyYy5pY2MAAAAAAAAAAAAAAB0AcwBSAEcAQgAtAGUAbABsAGUALQBWADIALQBzAHIAZwBiAHQAcgBjAC4AaQBjAGMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHRleHQAAAAAQ29weXJpZ2h0IDIwMTUsIEVsbGUgU3RvbmUgKHdlYnNpdGU6IGh0dHA6Ly9uaW5lZGVncmVlc2JlbG93LmNvbS87IGVtYWlsOiBlbGxlc3RvbmVAbmluZWRlZ3JlZXNiZWxvdy5jb20pLiBUaGlzIElDQyBwcm9maWxlIGlzIGxpY2Vuc2VkIHVuZGVyIGEgQ3JlYXRpdmUgQ29tbW9ucyBBdHRyaWJ1dGlvbi1TaGFyZUFsaWtlIDMuMCBVbnBvcnRlZCBMaWNlbnNlIChodHRwczovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMy4wL2xlZ2FsY29kZSkuAAAAAFhZWiAAAAAAAAD21gABAAAAANMtc2YzMgAAAAAAAQxCAAAF3v//8yUAAAeTAAD9kP//+6H///2iAAAD3AAAwG5YWVogAAAAAAAAb6AAADj1AAADkFhZWiAAAAAAAAAknwAAD4QAALbEWFlaIAAAAAAAAGKXAAC3hwAAGNljdXJ2AAAAAAAAEAAAAAABAAIABAAFAAYABwAJAAoACwAMAA4ADwAQABEAEwAUABUAFgAYABkAGgAbABwAHgAfACAAIQAjACQAJQAmACgAKQAqACsALQAuAC8AMAAyADMANAA1ADcAOAA5ADoAOwA9AD4APwBAAEIAQwBEAEUARwBIAEkASgBMAE0ATgBPAFEAUgBTAFQAVQBXAFgAWQBaAFwAXQBeAF8AYQBiAGMAZABmAGcAaABpAGsAbABtAG4AbwBxAHIAcwB0AHYAdwB4AHkAewB8AH0AfgCAAIEAggCDAIUAhgCHAIgAiQCLAIwAjQCOAJAAkQCSAJMAlQCWAJcAmACaAJsAnACdAJ8AoAChAKIApAClAKYApwCoAKoAqwCsAK0ArwCwALEAsgC0ALUAtgC3ALkAugC7ALwAvgC/AMAAwQDCAMQAxQDGAMcAyQDKAMsAzADOAM8A0ADRANMA1ADVANcA2ADZANoA3ADdAN4A4ADhAOIA5ADlAOYA6ADpAOoA7ADtAO8A8ADxAPMA9AD2APcA+AD6APsA/QD+AP8BAQECAQQBBQEHAQgBCgELAQ0BDgEPAREBEgEUARUBFwEYARoBGwEdAR8BIAEiASMBJQEmASgBKQErAS0BLgEwATEBMwE0ATYBOAE5ATsBPAE+AUABQQFDAUUBRgFIAUoBSwFNAU8BUAFSAVQBVQFXAVkBWgFcAV4BYAFhAWMBZQFnAWgBagFsAW4BbwFxAXMBdQF2AXgBegF8AX4BfwGBAYMBhQGHAYkBigGMAY4BkAGSAZQBlgGXAZkBmwGdAZ8BoQGjAaUBpwGpAasBrAGuAbABsgG0AbYBuAG6AbwBvgHAAcIBxAHGAcgBygHMAc4B0AHSAdQB1gHYAdoB3AHeAeEB4wHlAecB6QHrAe0B7wHxAfMB9QH4AfoB/AH+AgACAgIEAgcCCQILAg0CDwISAhQCFgIYAhoCHQIfAiECIwIlAigCKgIsAi4CMQIzAjUCOAI6AjwCPgJBAkMCRQJIAkoCTAJPAlECUwJWAlgCWgJdAl8CYQJkAmYCaQJrAm0CcAJyAnUCdwJ5AnwCfgKBAoMChgKIAosCjQKQApIClQKXApoCnAKfAqECpAKmAqkCqwKuArACswK1ArgCuwK9AsACwgLFAsgCygLNAs8C0gLVAtcC2gLdAt8C4gLkAucC6gLsAu8C8gL1AvcC+gL9Av8DAgMFAwgDCgMNAxADEwMVAxgDGwMeAyADIwMmAykDLAMuAzEDNAM3AzoDPQM/A0IDRQNIA0sDTgNRA1QDVgNZA1wDXwNiA2UDaANrA24DcQN0A3cDegN9A4ADggOFA4gDiwOOA5EDlAOYA5sDngOhA6QDpwOqA60DsAOzA7YDuQO8A78DwgPFA8kDzAPPA9ID1QPYA9sD3wPiA+UD6APrA+4D8gP1A/gD+wP+BAIEBQQIBAsEDwQSBBUEGAQcBB8EIgQlBCkELAQvBDMENgQ5BD0EQARDBEcESgRNBFEEVARXBFsEXgRiBGUEaARsBG8EcwR2BHkEfQSABIQEhwSLBI4EkgSVBJkEnASgBKMEpwSqBK4EsQS1BLgEvAS/BMMExgTKBM4E0QTVBNgE3ATgBOME5wTqBO4E8gT1BPkE/QUABQQFCAULBQ8FEwUWBRoFHgUiBSUFKQUtBTEFNAU4BTwFQAVDBUcFSwVPBVIFVgVaBV4FYgVmBWkFbQVxBXUFeQV9BYEFhAWIBYwFkAWUBZgFnAWgBaQFqAWsBa8FswW3BbsFvwXDBccFywXPBdMF1wXbBd8F4wXnBesF7wX0BfgF/AYABgQGCAYMBhAGFAYYBhwGIQYlBikGLQYxBjUGOQY+BkIGRgZKBk4GUwZXBlsGXwZjBmgGbAZwBnQGeQZ9BoEGhQaKBo4GkgaXBpsGnwakBqgGrAaxBrUGuQa+BsIGxgbLBs8G1AbYBtwG4QblBuoG7gbyBvcG+wcABwQHCQcNBxIHFgcbBx8HJAcoBy0HMQc2BzoHPwdDB0gHTQdRB1YHWgdfB2MHaAdtB3EHdgd7B38HhAeJB40HkgeXB5sHoAelB6kHrgezB7cHvAfBB8YHygfPB9QH2QfdB+IH5wfsB/EH9Qf6B/8IBAgJCA0IEggXCBwIIQgmCCsILwg0CDkIPghDCEgITQhSCFcIXAhhCGYIawhwCHUIegh/CIQIiQiOCJMImAidCKIIpwisCLEItgi7CMAIxQjKCM8I1AjZCN8I5AjpCO4I8wj4CP0JAwkICQ0JEgkXCR0JIgknCSwJMQk3CTwJQQlGCUwJUQlWCVsJYQlmCWsJcQl2CXsJgQmGCYsJkQmWCZsJoQmmCasJsQm2CbwJwQnGCcwJ0QnXCdwJ4gnnCe0J8gn4Cf0KAgoICg0KEwoZCh4KJAopCi8KNAo6Cj8KRQpKClAKVgpbCmEKZgpsCnIKdwp9CoMKiAqOCpQKmQqfCqUKqgqwCrYKvArBCscKzQrTCtgK3grkCuoK7wr1CvsLAQsHCwwLEgsYCx4LJAsqCy8LNQs7C0ELRwtNC1MLWQtfC2QLagtwC3YLfAuCC4gLjguUC5oLoAumC6wLsgu4C74LxAvKC9AL1gvcC+IL6QvvC/UL+wwBDAcMDQwTDBkMIAwmDCwMMgw4DD4MRQxLDFEMVwxdDGQMagxwDHYMfQyDDIkMjwyWDJwMogyoDK8MtQy7DMIMyAzODNUM2wzhDOgM7gz1DPsNAQ0IDQ4NFQ0bDSENKA0uDTUNOw1CDUgNTw1VDVwNYg1pDW8Ndg18DYMNiQ2QDZYNnQ2kDaoNsQ23Db4NxQ3LDdIN2Q3fDeYN7A3zDfoOAQ4HDg4OFQ4bDiIOKQ4vDjYOPQ5EDkoOUQ5YDl8OZg5sDnMOeg6BDogOjg6VDpwOow6qDrEOuA6+DsUOzA7TDtoO4Q7oDu8O9g79DwQPCw8SDxkPIA8nDy4PNQ88D0MPSg9RD1gPXw9mD20PdA97D4IPiQ+QD5gPnw+mD60PtA+7D8IPyg/RD9gP3w/mD+0P9Q/8EAMQChASEBkQIBAnEC8QNhA9EEQQTBBTEFoQYhBpEHAQeBB/EIYQjhCVEJ0QpBCrELMQuhDCEMkQ0BDYEN8Q5xDuEPYQ/REFEQwRFBEbESMRKhEyETkRQRFIEVARVxFfEWcRbhF2EX0RhRGNEZQRnBGkEasRsxG7EcIRyhHSEdkR4RHpEfAR+BIAEggSDxIXEh8SJxIuEjYSPhJGEk4SVRJdEmUSbRJ1En0ShBKMEpQSnBKkEqwStBK8EsQSzBLUEtsS4xLrEvMS+xMDEwsTExMbEyMTKxMzEzsTRBNME1QTXBNkE2wTdBN8E4QTjBOUE50TpROtE7UTvRPFE80T1hPeE+YT7hP2E/8UBxQPFBcUIBQoFDAUOBRBFEkUURRaFGIUahRzFHsUgxSMFJQUnBSlFK0UthS+FMYUzxTXFOAU6BTxFPkVARUKFRIVGxUjFSwVNBU9FUUVThVXFV8VaBVwFXkVgRWKFZMVmxWkFawVtRW+FcYVzxXYFeAV6RXyFfoWAxYMFhQWHRYmFi8WNxZAFkkWUhZaFmMWbBZ1Fn4WhhaPFpgWoRaqFrMWuxbEFs0W1hbfFugW8Rb6FwMXDBcUFx0XJhcvFzgXQRdKF1MXXBdlF24XdxeAF4kXkhecF6UXrhe3F8AXyRfSF9sX5BftF/cYABgJGBIYGxgkGC4YNxhAGEkYUhhcGGUYbhh3GIEYihiTGJwYphivGLgYwhjLGNQY3hjnGPAY+hkDGQwZFhkfGSkZMhk7GUUZThlYGWEZaxl0GX4ZhxmRGZoZpBmtGbcZwBnKGdMZ3RnmGfAZ+hoDGg0aFhogGioaMxo9GkYaUBpaGmMabRp3GoEaihqUGp4apxqxGrsaxRrOGtga4hrsGvUa/xsJGxMbHRsnGzAbOhtEG04bWBtiG2wbdRt/G4kbkxudG6cbsRu7G8UbzxvZG+Mb7Rv3HAEcCxwVHB8cKRwzHD0cRxxRHFscZRxwHHochByOHJgcohysHLYcwRzLHNUc3xzpHPQc/h0IHRIdHB0nHTEdOx1FHVAdWh1kHW8deR2DHY4dmB2iHa0dtx3BHcwd1h3hHesd9R4AHgoeFR4fHioeNB4+HkkeUx5eHmgecx59Hogekx6dHqgesh69Hsce0h7cHuce8h78HwcfEh8cHycfMh88H0cfUh9cH2cfch98H4cfkh+dH6cfsh+9H8gf0h/dH+gf8x/+IAggEyAeICkgNCA/IEogVCBfIGogdSCAIIsgliChIKwgtyDCIM0g2CDjIO4g+SEEIQ8hGiElITAhOyFGIVEhXCFnIXIhfiGJIZQhnyGqIbUhwCHMIdch4iHtIfgiBCIPIhoiJSIwIjwiRyJSIl4iaSJ0In8iiyKWIqEirSK4IsMizyLaIuYi8SL8IwgjEyMfIyojNSNBI0wjWCNjI28jeiOGI5EjnSOoI7QjvyPLI9Yj4iPuI/kkBSQQJBwkKCQzJD8kSyRWJGIkbiR5JIUkkSScJKgktCS/JMsk1yTjJO4k+iUGJRIlHiUpJTUlQSVNJVklZSVwJXwliCWUJaAlrCW4JcQl0CXcJecl8yX/JgsmFyYjJi8mOyZHJlMmXyZrJncmhCaQJpwmqCa0JsAmzCbYJuQm8Cb9JwknFSchJy0nOSdGJ1InXidqJ3YngyePJ5snpye0J8AnzCfZJ+Un8Sf9KAooFigjKC8oOyhIKFQoYChtKHkohiiSKJ4oqyi3KMQo0CjdKOko9ikCKQ8pGykoKTQpQSlNKVopZylzKYApjCmZKaYpsim/Kcwp2CnlKfEp/ioLKhgqJCoxKj4qSipXKmQqcSp9KooqlyqkKrEqvSrKKtcq5CrxKv4rCisXKyQrMSs+K0srWCtlK3IrfyuMK5krpSuyK78rzCvZK+Yr8ywBLA4sGywoLDUsQixPLFwsaSx2LIMskCyeLKssuCzFLNIs3yztLPotBy0ULSEtLy08LUktVi1kLXEtfi2LLZktpi2zLcEtzi3bLekt9i4ELhEuHi4sLjkuRy5ULmEuby58Loouly6lLrIuwC7NLtsu6C72LwMvES8eLywvOi9HL1UvYi9wL34viy+ZL6cvtC/CL9Av3S/rL/kwBjAUMCIwLzA9MEswWTBnMHQwgjCQMJ4wrDC5MMcw1TDjMPEw/zENMRoxKDE2MUQxUjFgMW4xfDGKMZgxpjG0McIx0DHeMewx+jIIMhYyJDIyMkAyTjJcMmoyeTKHMpUyozKxMr8yzTLcMuoy+DMGMxQzIzMxMz8zTTNcM2ozeDOGM5UzozOxM8AzzjPcM+sz+TQHNBY0JDQzNEE0TzReNGw0ezSJNJg0pjS1NMM00jTgNO80/TUMNRo1KTU3NUY1VDVjNXI1gDWPNZ01rDW7Nck12DXnNfU2BDYTNiE2MDY/Nk42XDZrNno2iTaXNqY2tTbENtM24TbwNv83DjcdNyw3OzdJN1g3Zzd2N4U3lDejN7I3wTfQN9837jf9OAw4GzgqODk4SDhXOGY4dTiEOJM4ojixOME40DjfOO44/TkMORs5Kzk6OUk5WDlnOXc5hjmVOaQ5tDnDOdI54TnxOgA6DzofOi46PTpNOlw6azp7Ooo6mjqpOrg6yDrXOuc69jsGOxU7JTs0O0Q7UztjO3I7gjuRO6E7sDvAO9A73zvvO/48DjwePC08PTxNPFw8bDx8PIs8mzyrPLo8yjzaPOo8+T0JPRk9KT05PUg9WD1oPXg9iD2YPac9tz3HPdc95z33Pgc+Fz4nPjc+Rz5XPmc+dz6HPpc+pz63Psc+1z7nPvc/Bz8XPyc/Nz9HP1c/Zz94P4g/mD+oP7g/yD/ZP+k/+UAJQBlAKkA6QEpAWkBrQHtAi0CcQKxAvEDNQN1A7UD+QQ5BHkEvQT9BT0FgQXBBgUGRQaJBskHDQdNB5EH0QgVCFUImQjZCR0JXQmhCeEKJQppCqkK7QstC3ELtQv1DDkMfQy9DQENRQ2FDckODQ5RDpEO1Q8ZD10PnQ/hECUQaRCtEO0RMRF1EbkR/RJBEoUSyRMJE00TkRPVFBkUXRShFOUVKRVtFbEV9RY5Fn0WwRcFF0kXjRfRGBUYXRihGOUZKRltGbEZ9Ro9GoEaxRsJG00bkRvZHB0cYRylHO0dMR11HbkeAR5FHoke0R8VH1kfoR/lICkgcSC1IP0hQSGFIc0iESJZIp0i5SMpI3EjtSP9JEEkiSTNJRUlWSWhJekmLSZ1JrknASdJJ40n1SgZKGEoqSjtKTUpfSnFKgkqUSqZKt0rJSttK7Ur/SxBLIks0S0ZLWEtpS3tLjUufS7FLw0vVS+dL+UwKTBxMLkxATFJMZEx2TIhMmkysTL5M0EziTPRNBk0ZTStNPU1PTWFNc02FTZdNqU28Tc5N4E3yTgROF04pTjtOTU5fTnJOhE6WTqlOu07NTt9O8k8ETxZPKU87T05PYE9yT4VPl0+qT7xPzk/hT/NQBlAYUCtQPVBQUGJQdVCHUJpQrVC/UNJQ5FD3UQlRHFEvUUFRVFFnUXlRjFGfUbFRxFHXUelR/FIPUiJSNFJHUlpSbVKAUpJSpVK4UstS3lLxUwRTFlMpUzxTT1NiU3VTiFObU65TwVPUU+dT+lQNVCBUM1RGVFlUbFR/VJJUpVS4VMtU3lTyVQVVGFUrVT5VUVVlVXhVi1WeVbFVxVXYVetV/lYSViVWOFZLVl9WclaFVplWrFa/VtNW5lb6Vw1XIFc0V0dXW1duV4JXlVepV7xX0FfjV/dYClgeWDFYRVhYWGxYgFiTWKdYuljOWOJY9VkJWR1ZMFlEWVhZa1l/WZNZp1m6Wc5Z4ln2WglaHVoxWkVaWVpsWoBalFqoWrxa0FrkWvhbC1sfWzNbR1tbW29bg1uXW6tbv1vTW+db+1wPXCNcN1xLXGBcdFyIXJxcsFzEXNhc7F0BXRVdKV09XVFdZV16XY5dol22Xctd313zXgheHF4wXkReWV5tXoJell6qXr9e017nXvxfEF8lXzlfTl9iX3dfi1+gX7RfyV/dX/JgBmAbYC9gRGBYYG1ggmCWYKtgv2DUYOlg/WESYSdhO2FQYWVhemGOYaNhuGHNYeFh9mILYiBiNWJJYl5ic2KIYp1ismLHYtti8GMFYxpjL2NEY1ljbmODY5hjrWPCY9dj7GQBZBZkK2RAZFVkamR/ZJVkqmS/ZNRk6WT+ZRNlKWU+ZVNlaGV9ZZNlqGW9ZdJl6GX9ZhJmJ2Y9ZlJmZ2Z9ZpJmp2a9ZtJm6Gb9ZxJnKGc9Z1NnaGd+Z5NnqWe+Z9Rn6Wf/aBRoKmg/aFVoamiAaJZoq2jBaNZo7GkCaRdpLWlDaVhpbmmEaZlpr2nFadtp8GoGahxqMmpIal1qc2qJap9qtWrKauBq9msMayJrOGtOa2RremuQa6ZrvGvSa+hr/mwUbCpsQGxWbGxsgmyYbK5sxGzabPBtBm0cbTNtSW1fbXVti22hbbhtzm3kbfpuEW4nbj1uU25qboBulm6tbsNu2W7wbwZvHG8zb0lvYG92b4xvo2+5b9Bv5m/9cBNwKnBAcFdwbXCEcJpwsXDHcN5w9HELcSJxOHFPcWZxfHGTcapxwHHXce5yBHIbcjJySHJfcnZyjXKkcrpy0XLocv9zFnMsc0NzWnNxc4hzn3O2c81z5HP6dBF0KHQ/dFZ0bXSEdJt0snTJdOB093UOdSZ1PXVUdWt1gnWZdbB1x3XedfZ2DXYkdjt2UnZqdoF2mHavdsd23nb1dwx3JHc7d1J3aneBd5h3sHfHd9539ngNeCV4PHhUeGt4gniaeLF4yXjgePh5D3kneT55VnlueYV5nXm0ecx543n7ehN6KnpCelp6cXqJeqF6uHrQeuh7AHsXey97R3tfe3Z7jnume7571nvufAV8HXw1fE18ZXx9fJV8rXzFfNx89H0MfSR9PH1UfWx9hH2cfbR9zX3lff1+FX4tfkV+XX51fo1+pX6+ftZ+7n8Gfx5/N39Pf2d/f3+Xf7B/yH/gf/mAEYApgEGAWoBygIqAo4C7gNSA7IEEgR2BNYFOgWaBf4GXgbCByIHhgfmCEoIqgkOCW4J0goyCpYK+gtaC74MHgyCDOYNRg2qDg4Obg7SDzYPlg/6EF4QwhEiEYYR6hJOErITEhN2E9oUPhSiFQYVahXKFi4Wkhb2F1oXvhgiGIYY6hlOGbIaFhp6Gt4bQhumHAocbhzSHTYdnh4CHmYeyh8uH5If9iBeIMIhJiGKIe4iViK6Ix4jgiPqJE4ksiUaJX4l4iZGJq4nEid6J94oQiiqKQ4pdinaKj4qpisKK3Ir1iw+LKItCi1uLdYuOi6iLwovbi/WMDowojEKMW4x1jI+MqIzCjNyM9Y0PjSmNQo1cjXaNkI2pjcON3Y33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');background-size: 62px 62px !important;background-position: -79px;}";
    globcss += `
    #rangeSped {
        background-color: #B3C3CB;
        border: 1px solid #668599;
        border-bottom-color: #D3D9DE;
        border-radius: 3px;
        box-shadow: inset 0 1px 3px 0 #454f54;
        color: #000;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        padding: 2px 0px 2px 11px;
        -webkit-appearance: textfield;
        -webkit-box-sizing: content-box;
        width: 50px;
    }
    .lineHeight {
        height: 20px;
        line-height: 26px;
    }
    label {
        display: inline-block;
        margin-bottom: 0!important;
        cursor: pointer;
    }
    .opacity_02{
        opacity: 0.2;
    }
    select#option_language option, #option_language {
        font-size: 12px;
        text-transform: uppercase;
    }
    .fleetStatus, #fleet1 #statusBarFleet {
        display: block !important;
    }
    select#option_language {
        width: 128px !important;
    }
    .redBoxSH {
        box-shadow: 0px 0px 12px 4px red !important;
    }
    .hideRules{
        height:0px;
        opacity:0;
        -moz-transition: all .5s ease;
        -webkit-transition: all .5s ease;
        -o-transition: all .5s ease;
        transition: all .5s ease;
    }
    .showRules{
        height:66px !important;
        opacity:1 !important;
        -moz-transition: all .5s ease;
        -webkit-transition: all .5s ease;
        -o-transition: all .5s ease;
        transition: all .5s ease;
    }
    #spedizioni_target, #target_sped_select, #item_select{
        height: 60px;
    }
    `;
    var gloabl_css = document.createElement("style");
    gloabl_css.type = "text/css";
    gloabl_css.innerText = globcss;
    document.head.appendChild(gloabl_css);
    // check agr extension
    var topPx = '-32px';
    if($('meta[name="AntiGameReborn"]').length > 0){
        topPx = '-32px';
    } else {
        topPx = '0px';
    }

    $('head').append('<link href="https://fonts.googleapis.com/css?family=Audiowide&display=swap" rel="stylesheet">');
    $('head').append('<link href="https://fonts.googleapis.com/css?family=Orbitron&display=swap" rel="stylesheet">');

    // START SYSTEM GLOBAL
    $(document).ready(function(){
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // VARIABILI GLOBALI
        //
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const url = location.href;
        if($('#officers a.commander').hasClass('on')){
            $('head').append('<style>#EGS_coreSystemJs{top:0px !important}</style>');
        }
        var ogameVersion = $('meta[name="ogame-version"]').attr("content");
        var term = "8.1.0";

        const server_ogame = $('meta[name="ogame-universe"]').attr("content");
        const unigame = $('meta[name="ogame-universe"]').attr("content");
        var universe_name = $('meta[name="ogame-universe-name"]').attr("content");
        const speed_universe = $('meta[name="ogame-universe-speed"]').attr("content");
        const ID_player = $('meta[name="ogame-player-id"]').attr("content");
        const name_player = $('meta[name="ogame-player-name"]').attr("content");
        const player = $('meta[name="ogame-player-name"]').attr("content");
        const planetName = $('meta[name="ogame-planet-name"]').attr("content");
        const currentTarget = $('meta[name="ogame-planet-id"]').attr("content");
        var urlCompPart = new window.URLSearchParams(window.location.search);
        const partcomponent = urlCompPart.get('component');
        const pagecomponent = urlCompPart.get('page');
        const ogameLanguage = $('html').attr('lang');
        var selectShip, spedStart;
        var deuOnPlanet = '';
        var baseMaterie;
        (function(window){
            deuOnPlanet = window.deuteriumOnPlanet;
        })(window.unsafeWindow);


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // FUNZIONI GLOBALI
        //
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // CALCOLO MATERE BASE
        if(GM_getValue(universe_name+'_topScore') === undefined){
            GM_setValue(universe_name+'_topScore','');
        }
        if(GM_getValue(universe_name+'_topScore') < 100000000){
            var UniOGame = server_ogame.split('.')[0];
            $.ajax({
                type: 'GET',
                url: 'https://'+UniOGame+'.ogame.gameforge.com/api/highscore.xml?category=1&type=1',
                dataType: 'xml',
                success: function(xml) {
                    $(xml).find('player').each(function(){
                        if($(this).attr('position') == "1"){
                            var topScoreUNI = $(this).attr('score');
                            GM_setValue(universe_name+'_topScore',topScoreUNI);
                            var baseMaterie_cal;
                            if(topScoreUNI < 10000){baseMaterie_cal = 60000;}
                            if(topScoreUNI > 10000 && topScoreUNI < 100000){baseMaterie_cal = 750000;}
                            if(topScoreUNI > 100000 && topScoreUNI < 1000000){baseMaterie_cal = 1800000;}
                            if(topScoreUNI > 1000000 && topScoreUNI < 5000000){baseMaterie_cal = 2700000;}
                            if(topScoreUNI > 5000000 && topScoreUNI < 25000000){baseMaterie_cal = 3600000;}
                            if(topScoreUNI > 25000000 && topScoreUNI < 50000000){baseMaterie_cal = 4500000;}
                            if(topScoreUNI > 50000000 && topScoreUNI < 75000000){baseMaterie_cal = 5400000;}
                            if(topScoreUNI > 75000000 && topScoreUNI < 100000000){baseMaterie_cal = 6300000;}
                            if(topScoreUNI > 100000000){baseMaterie_cal = 7500000;}
                            GM_setValue(universe_name+'_baseMaterie',baseMaterie_cal);
                            baseMaterie = baseMaterie_cal;
                            console.log(baseMaterie)
                        }
                    })
                }
            });
        }
        if(GM_getValue(universe_name+'_baseMaterie') !== undefined){
            baseMaterie = GM_getValue(universe_name+'_baseMaterie');
        }
        // CALCOLO MATERE BASE


        function updateNewArray(arrayCheck, varupdate, valupdate){
            if($('#popup_configurations').length > 0){
                // nulll
            } else {
                $('body').append('<div id="popup_configurations" style="z-index: 3000000000000000000;width: 300px;height: auto;background: #050a10;position: absolute;margin: auto;top: 50%;left: calc(50% - 150px);border-radius: 10px;border: 1px solid #364351;box-shadow: 0px 15px 100px 30px #000;text-align: center;padding: 10px 0;color: #8aa8c8;"></div>');
            }
            var newarrayCheck = arrayCheck;
            
            var i = 0;
            for(i = 0; i < varupdate.length; i++){
                if(newarrayCheck[varupdate[i]] === undefined){
                    newarrayCheck[varupdate[i]] = valupdate[i];
                    $('#popup_configurations').append('::: '+varupdate[i]+' -> '+valupdate[i]+' :::<br>');
                }
            }
            
            
            GMA.Save('systemSpedition_options', [newarrayCheck]);
            setTimeout(function(){
                $('#popup_configurations').remove();
            },3000);
        }

        function systemStatusRepair(optArray,newVal){
            optArray.system_status = newVal;
            return optArray;
        }

        function GMArray(){
            var $ = this;
            $.Save = function(nameVar,valVar){
               GM_setValue(universe_name+'_'+nameVar, valVar);
            }
            $.Load = function(getVar){
                return GM_getValue(universe_name+'_'+getVar);
            }
            $.Options = function(){
                var optA = ($.Load('systemSpedition_options') !== undefined)? $.Load('systemSpedition_options')[0]:undefined; 
                return optA;
            }
            $.Data = function(){
                return $.Load('systemSpedition_data');
            }
            $.FleetPlanets = function(){
                return $.Load('systemSpedition_FleetPlanets');
            }
            $.FleetMoons = function(){
                return $.Load('systemSpedition_FleetMoons');
            }
        }
        var GMA = new GMArray();

        function GMArrayUpdate(){
            var $ = this;
            $.updateArray = function(arrayCheck, varUpdate, valUpdate){
                arrayCheck.forEach(obj => {
                    Object.entries(obj).forEach(([key, val]) => {
                        if (key === varUpdate) {
                            obj[key] = valUpdate;
                        }
                    });
                });
                return arrayCheck;
            }
            $.getOptions = function(){
                return GM_getValue(universe_name+'_systemSpedition_options');
            }
            $.opts = function(varOpt, valueOpt){
                var oArray = $.getOptions();
                GMA.Save('systemSpedition_options', $.updateArray(oArray, varOpt, valueOpt));
            }
        }
        var GMUP = new GMArrayUpdate();



        // parametri da url
        function urlParam(url,param){
          return new URLSearchParams(url).get(param);
        }

        function GlobalTimeClass(){
            var c = this;
            c.CTS = function(){
                return new Date().getTime();
            }
            c.notturnoStartEnd = function(orari_notturni){
                var dateDmY = new Date().getTime();
                dateDmY = new Date(dateDmY);
                var currYaer = dateDmY.getFullYear();
                var currMonth = (dateDmY.getMonth() + 1).toString().padStart(2, "0");
                var currDay = dateDmY.getDate().toString().padStart(2, "0");
                var dateStartEnd = new Date(currMonth+'-'+currDay+'-'+currYaer+' '+orari_notturni.toString());
                var notturnoTS =  dateStartEnd.getTime();
                return notturnoTS;
            }            
        }
        var GTM = new GlobalTimeClass();

        if(window.location.href.indexOf('?page=ingame&component=fleetdispatch') > 0){
            (function(window){
                var expeditionCount = window.fleetDispatcher.expeditionCount;       // spedizioni attive
                var explorationCount = window.fleetDispatcher.explorationCount;     // numero totale spedizioni
                var fleetCount = window.fleetDispatcher.fleetCount;                 // numero flotte attuali
                var maxExpeditionCount = window.fleetDispatcher.maxExpeditionCount; // numero massimo di spedizioni
                var maxFleetCount = window.fleetDispatcher.maxFleetCount;           // numero massimo di flotte

                GMA.Save('slotFlottaUsed', fleetCount);
                GMA.Save('slotFlottaAll', maxFleetCount);
            })(window.unsafeWindow);
        }

        function addReplaceJSonArr(arrayCheck, newFlet){
            var idFlet;
            var newIdFlet;
            var arrCheckN;
            var newArrayCheck;
            if(arrayCheck == '' || arrayCheck == undefined){
                
                var newArrayCheck = newFlet;
            }
            if(arrayCheck !== '' && arrayCheck !== undefined && arrayCheck !== null){
                
                arrCheckN = arrayCheck.length;
                $(newFlet).each(function (index, item){
                    newIdFlet = item.id_flet; 
                });
                $(arrayCheck).each(function (index, item) {
                    idFlet = item.id_flet;
                    if(idFlet !== newIdFlet){
                        var column = 'id_flet';
                        let result = arrayCheck.filter(m => m[column] !== newIdFlet);
                        newArrayCheck = result.concat(newFlet);
                    } else if(idFlet === newIdFlet && arrCheckN > 1){
                        var column = 'id_flet';
                        let result = arrayCheck.filter(m => m[column] !== newIdFlet);
                        newArrayCheck = result.concat(newFlet);
                    } else if(arrCheckN === 1){
                        newArrayCheck = newFlet;
                    }
                });
            }
            return newArrayCheck;
        }


        function constructOptions(target_select, ID_player, itemSelect,selectData,iTemSelect,offSelect,selectOffTaregt){
            var systemGlobalArray = GMA.Data();
            switch(target_select){
                case 'planet':
                    var array_item_idname = systemGlobalArray['global_planet_array'];
                    break;
                case 'moon':
                    var array_item_idname = systemGlobalArray['global_moon_array'];
                    break;
                case 'destination':
                    var array_item_idname = systemGlobalArray['global_planet_array'].concat(systemGlobalArray['global_moon_array']);
                    break;
                case 'off':
                    var array_item_idname = systemGlobalArray['global_planet_array'];
                    break;
                case '':
                    var array_item_idname = systemGlobalArray['global_planet_array'];
                    break;
            }
            if(target_select !== 'attuale'){
                $("#"+selectData).empty();
                var x = 0;
                var nCountArr = array_item_idname.length;
                $('#'+selectData).append('<option id="'+offSelect+'">'+selectOffTaregt+'</option>');
                $.each(array_item_idname, function(index, item){
                    $('#'+selectData).append('<option id="'+iTemSelect+'-'+item.split(':')[0]+'" value="' + item + '">'+ item.split(':')[1] + '</option>');
                    if(itemSelect != ''){
                        $("#"+iTemSelect+"-"+itemSelect).attr('selected', true);
                    }
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // FUNZIONI RANGE SPEDIZIONI
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function rangeSpedArray(){
            var range = parseInt(GMA.Options().range_sped);
            var minSS = 1;
            var maxSS = 499
            var targetSSarray = GMA.Options().sped_target;
            var targetSS = parseInt(targetSSarray.split(':')[2].replace('[','').replace(']','').split('|')[1]);
            var diffSS = targetSS-(parseInt(range/2));
            if(diffSS <= minSS && diffSS < maxSS){
                diffSS = targetSS-targetSS;
                diffSS = (diffSS === 0)?1:diffSS;
            } else if(parseInt(diffSS+range) >= maxSS){
                diffSS = (maxSS+1)-range;
            } else {
                diffSS = diffSS;
            }
            var rangeSped = [];
            for (var i = 0; i < (range); i++) {
                rangeSped.push(diffSS+i);
            }
            GMUP.opts('range_array', rangeSped);
        }
        function customSpedArray(){
            var a = GMA.Options().customChoords;
            var b = a.split(',');
            var c = [];
            for(i = 0; i < b.length; i++){
                c.push(parseInt(b[i]));
            }
            GMUP.opts('range_array', c);
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // FUNZIONI RANGE SPEDIZIONI
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //   SSSSSS   EEEEEEE  DDDDDD    III  ZZZZZZZZ  III   OOOOOOO   NN     NN  III
        //  SS    SS  EE       DD   DDD  III        ZZ  III  OO     OO  NNN    NN  III
        //  SS        EE       DD    DD  III       ZZ   III  OO     OO  NNNN   NN  III
        //   SSS      EE       DD    DD  III      ZZ    III  OO     OO  NN NN  NN  III
        //     SS     EEEE     DD    DD  III     ZZ     III  OO     OO  NN  NN NN  III
        //      SS    EE       DD    DD  III    ZZ      III  OO     OO  NN   NNNN  III
        //        SS  EE       DD    DD  III   ZZ       III  OO     OO  NN    NNN  III
        //  SS    SS  EE       DD   DDD  III  ZZ        III  OO     OO  NN     NN  III
        //   SSSSSS   EEEEEEE  DDDDDD    III  ZZZZZZZZ  III   OOOOOOO   NN     NN  III
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function SystemGlobalExpedition(){
            var s = this;
            s.percentualeFlotta = function(numSip){
                var numeroFlotta;
                if(GMA.Options().active_notturno === 'on'){
                    if(GTM.CTS() < GTM.notturnoStartEnd(GMA.Options().orario_notturno) && GTM.CTS() > GTM.notturnoStartEnd(GMA.Options().orario_fine_notturno)){
                        numeroFlotta = numSip;
                    } else {
                        numeroFlotta = parseInt(numSip / 100 * GMA.Options().percentualeflotta);
                    }
                } else {
                    numeroFlotta = numSip;
                }
                return numeroFlotta;
            }
            s.dividerShip = function(ship){
                var nTsped = GMA.Load('TOTSpedizioni');
                var nSped = GMA.Load('slotSpedizioni');
                var slotLiberi = nTsped - nSped;
                var rndONOff = GMA.Load('spedRnd');
                if(rndONOff == 'on'){
                    var defShip = parseInt(ship / nSped);
                } else {
                    var defShip = parseInt(ship / slotLiberi);
                }
                
                return defShip;
            }
            s.nCargoSelect = function(typeShip,tPerc){
                var typeCargo;
                (function(window){
                    typeCargo = window.fleetDispatcher.shipsOnPlanet;
                })(window.unsafeWindow);
                var defCargo = typeCargo.map(function(item, i){
                    if(item.id == typeShip) return i;
                }).filter(function(item){ return item!=undefined; });

                var cargoStiva = typeCargo[defCargo]['baseCargoCapacity'];
                var maxMaterie = baseMaterie*speed_universe*2;
                var NCargoNumb = (maxMaterie/cargoStiva+1);
                var NCargo = (tPerc !== 0) ? NCargoNumb + (NCargoNumb/100*tPerc) : NCargoNumb;
                return parseInt(NCargo)
            }
            s.flottaSpedizione = function(){
                var shipDbSel = GMA.Options().select_ship;
                var sendAllShip = (GMA.Options().select_allship) ? GMA.Options().select_allship : 'off';

                var shipsSelect;
                //var fletDB = GMA.Options();
                var activeShip = GMA.Options().active_ship;
                // caccia leggerto impostazioni
                var cacciaLeggeroDB = GMA.Options().caccia_leggero;
                var cacciaLeggeroDB_numslot = GMA.Options().caccia_leggero_numslot;
                var cacciaLeggeroDB_num = parseInt(GMA.Options().caccia_leggero_num);
                // cargo leggerto impostazioni
                var cargoLeggeroDB = GMA.Options().cargo_leggero;
                var cargoLeggeroDB_numslot = GMA.Options().cargo_leggero_numslot;
                var cargoLeggeroDB_num = parseInt(GMA.Options().cargo_leggero_num);
                // cargo pesante impostazioni
                var cargoPesanteDB = GMA.Options().cargo_pesante;
                var cargoPesanteDB_numslot = GMA.Options().cargo_pesante_numslot;
                var cargoPesanteDB_num = parseInt(GMA.Options().cargo_pesante_num);
                // RIP impostazioni
                var ripDB = GMA.Options().rip;
                var ripDB_numslot = GMA.Options().rip_numslot;
                var ripDB_num = parseInt(GMA.Options().rip_num);
                // nave da battaglia
                var combatShipDB = GMA.Options().combatShip;
                var combatShipDB_numslot = GMA.Options().combatShip_numslot;
                var combatShipDB_num = parseInt(GMA.Options().combatShip_num);
                var splitShipDef = GMA.Options().select_allship;;
                var rulesOgame = GMA.Options().ogame_rules;
                if(GMA.Options().sped_ship_status !== 'off'){
                    // navi guerra
                    // fleet creator compreso flotta trovata, nave da guerra/caccini/carghini/cargoni/sonda spia
                    var cacciaLeggero = $('.fighterLight > span.amount').attr('data-value');
                    if(cacciaLeggero >= fleetCount && cacciaLeggeroDB === 'on'){
                        if(activeShip === 'on' && cacciaLeggeroDB === 'on' && cacciaLeggeroDB_numslot === 'on'){
                            //var cacciaLeggeroDb = cacciaLeggero < cacciaLeggeroDB_num ? cacciaLeggero : cacciaLeggeroDB_num;
                            var cacciaLeggeroDb = cacciaLeggeroDB_num;
                            var cclDef = s.percentualeFlotta(cacciaLeggeroDb);
                            if(cacciaLeggero === 0){
                                shipsSelect = '';
                            }
                            if(cacciaLeggero < cclDef){
                                shipsSelect = '{"id":'+204+',"number":'+cacciaLeggero+'}';
                            } else if(cacciaLeggero >= cclDef){
                                shipsSelect = '{"id":'+204+',"number":'+cclDef+'}';
                            } else {
                                shipsSelect = '';
                            }
                        } else if(cacciaLeggero === 0){
                            shipsSelect = '';
                        }
                    } else {
                        shipsSelect = '';
                    }
                    // flotta trovata
                    if(sendAllShip === 'on'){
                        var cacciaPesante = $('.fighterHeavy > span.amount').attr('data-value');
                        cacciaPesante = (splitShipDef === 'on') ? s.dividerShip(cacciaPesante) : cacciaPesante;
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && cacciaPesante > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                        shipsSelect = (cacciaPesante > 0) ? shipsSelect+'{"id":'+205+',"number":'+cacciaPesante+'}' : shipsSelect;

                        var incrociatore = $('.cruiser > span.amount').attr('data-value');
                        incrociatore = (splitShipDef === 'on') ? s.dividerShip(incrociatore) : incrociatore;
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && incrociatore > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                        shipsSelect = (incrociatore > 0) ? shipsSelect+'{"id":'+206+',"number":'+incrociatore+'}' : shipsSelect;

                        var bomber = $('.bomber > span.amount').attr('data-value');
                        bomber = (splitShipDef === 'on') ? s.dividerShip(bomber) : bomber;
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && bomber > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                        shipsSelect = (bomber > 0) ? shipsSelect+'{"id":'+211+',"number":'+bomber+'}' : shipsSelect;

                        switch(shipDbSel){
                            case 'bs-on':
                            var int = $('.interceptor > span.amount').attr('data-value');
                            int = (splitShipDef === 'on') ? s.dividerShip(int) : int;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && int > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (int > 0) ? shipsSelect+'{"id":'+215+',"number":'+int+'}' : shipsSelect;

                            var dest = $('.destroyer > span.amount').attr('data-value');
                            dest = (splitShipDef === 'on') ? s.dividerShip(dest) : dest;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && dest > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (dest > 0) ? shipsSelect+'{"id":'+213+',"number":'+dest+'}' : shipsSelect;

                            var reap = $('.reaper > span.amount').attr('data-value');
                            reap = (splitShipDef === 'on') ? s.dividerShip(reap) : reap;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && reap > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (reap > 0) ? shipsSelect+'{"id":'+218+',"number":'+reap+'}' : shipsSelect;
                            break;
                            case 'bc-on':
                            var bts = $('.battleship > span.amount').attr('data-value');
                            bts = (splitShipDef === 'on') ? s.dividerShip(bts) : bts;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && bts > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (bts > 0) ? shipsSelect+'{"id":'+207+',"number":'+bts+'}' : shipsSelect;

                            dest = $('.destroyer > span.amount').attr('data-value');
                            dest = (splitShipDef === 'on') ? s.dividerShip(dest) : dest;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && dest > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (dest > 0) ? shipsSelect+'{"id":'+213+',"number":'+dest+'}' : shipsSelect;

                            reap = $('.reaper > span.amount').attr('data-value');
                            reap = (splitShipDef === 'on') ? s.dividerShip(reap) : reap;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && reap > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (reap > 0) ? shipsSelect+'{"id":'+218+',"number":'+reap+'}' : shipsSelect;
                            break;
                            case 'ds-on':
                            bts = $('.battleship > span.amount').attr('data-value');
                            bts = (splitShipDef === 'on') ? s.dividerShip(bts) : bts;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && bts > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (bts > 0) ? shipsSelect+'{"id":'+207+',"number":'+bts+'}' : shipsSelect;

                            int = $('.interceptor > span.amount').attr('data-value');
                            int = (splitShipDef === 'on') ? s.dividerShip(int) : int;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && int > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (int > 0) ? shipsSelect+'{"id":'+215+',"number":'+int+'}' : shipsSelect;

                            reap = $('.reaper > span.amount').attr('data-value');
                            reap = (splitShipDef === 'on') ? s.dividerShip(reap) : reap;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && reap > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (reap > 0) ? shipsSelect+'{"id":'+218+',"number":'+reap+'}' : shipsSelect;
                            break;
                            case 'rp-on':
                            bts = $('.battleship > span.amount').attr('data-value');
                            bts = (splitShipDef === 'on') ? s.dividerShip(bts) : bts;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && bts > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (bts > 0) ? shipsSelect+'{"id":'+207+',"number":'+bts+'}' : shipsSelect;

                            int = $('.interceptor > span.amount').attr('data-value');
                            int = (splitShipDef === 'on') ? s.dividerShip(int) : int;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && int > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (int > 0) ? shipsSelect+'{"id":'+215+',"number":'+int+'}' : shipsSelect;

                            dest = $('.destroyer > span.amount').attr('data-value');
                            dest = (splitShipDef === 'on') ? s.dividerShip(dest) : dest;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && dest > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (dest > 0) ? shipsSelect+'{"id":'+213+',"number":'+dest+'}' : shipsSelect;
                            break;
                        }
                    }
                    switch(shipDbSel){
                        case 'bs-on':
                        var warShip = $('.battleship > span.amount').attr('data-value');
                        if(activeShip === 'on' && combatShipDB === 'on' && combatShipDB_numslot === 'on' && warShip > 0){
                            var warShipDB = (warShip < combatShipDB_num)? warShip : combatShipDB_num;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && warShip > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (warShip > 0) ? shipsSelect+'{"id":'+207+',"number":'+warShipDB+'}' : shipsSelect;
                        }
                        if(activeShip === 'on' && combatShipDB === 'on' && combatShipDB_numslot !== 'on' && warShip > 0){
                            warShip = (splitShipDef === 'on') ? s.dividerShip(warShip) : warShip;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && warShip > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (warShip > 0) ? shipsSelect+'{"id":'+207+',"number":'+warShip+'}' : shipsSelect;
                        }
                        if(warShip === 0){
                            shipsSelect = shipsSelect;
                        }
                        break;
                        case 'bc-on':
                        warShip = $('.interceptor > span.amount').attr('data-value');
                        if(activeShip === 'on' && combatShipDB === 'on' && combatShipDB_numslot === 'on' && warShip > 0){
                            var warShipDB = (warShip < combatShipDB_num)? warShip : combatShipDB_num;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && warShip > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (warShip > 0) ? shipsSelect+'{"id":'+215+',"number":'+warShipDB+'}' : shipsSelect;
                        }
                        if(activeShip === 'on' && combatShipDB === 'on' && combatShipDB_numslot !== 'on' && warShip > 0){
                            warShip = (splitShipDef === 'on') ? s.dividerShip(warShip) : warShip;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && warShip > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (warShip > 0) ? shipsSelect+'{"id":'+215+',"number":'+warShip+'}' : shipsSelect;
                        }
                        if(warShip === 0){
                            shipsSelect = shipsSelect;
                        }
                        break;
                        case 'ds-on':
                        warShip = $('.destroyer > span.amount').attr('data-value');
                        if(activeShip === 'on' && combatShipDB === 'on' && combatShipDB_numslot === 'on' && warShip > 0){
                            var warShipDB = (warShip < combatShipDB_num)? warShip : combatShipDB_num;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && warShip > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (warShip > 0) ? shipsSelect+'{"id":'+213+',"number":'+warShipDB+'}' : shipsSelect;
                        }
                        if(activeShip === 'on' && combatShipDB === 'on' && combatShipDB_numslot !== 'on' && warShip > 0){
                            warShip = (splitShipDef === 'on') ? s.dividerShip(warShip) : warShip;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && warShip > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (warShip > 0) ? shipsSelect+'{"id":'+213+',"number":'+warShip+'}' : shipsSelect;
                        }
                        if(warShip === 0){
                            shipsSelect = shipsSelect;
                        }
                        break;
                        case 'rp-on':
                        warShip = $('.reaper > span.amount').attr('data-value');
                        if(activeShip === 'on' && combatShipDB === 'on' && combatShipDB_numslot === 'on' && warShip > 0){
                            var warShipDB = (warShip < combatShipDB_num)? warShip : combatShipDB_num;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && warShip > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (warShip > 0) ? shipsSelect+'{"id":'+218+',"number":'+warShipDB+'}' : shipsSelect;
                        }
                        if(activeShip === 'on' && combatShipDB === 'on' && combatShipDB_numslot !== 'on'){
                            warShip = (splitShipDef === 'on') ? s.dividerShip(warShip) : warShip;
                            // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                            if(shipsSelect !== '' && warShip > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                            shipsSelect = (warShip > 0) ? shipsSelect+'{"id":'+218+',"number":'+warShip+'}' : shipsSelect;
                        }
                        if(warShip === 0){
                            shipsSelect = shipsSelect;
                        }
                        break;
                    }

                    // navi civili
                    var cargoLeggeri = $('.transporterSmall > span.amount').attr('data-value');
                    if(activeShip === 'on' && cargoLeggeroDB === 'on' && cargoLeggeroDB_numslot === 'on' && rulesOgame === 'off'){
                        //var cargoLeggeriDB = (cargoLeggeri < cargoLeggeroDB_num)? cargoLeggeri : cargoLeggeroDB_num;
                        var cargoLeggeriDB = cargoLeggeroDB_num;
                        var carLDef = s.percentualeFlotta(cargoLeggeriDB)
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && cargoLeggeri > 0){
                            shipsSelect = shipsSelect+',';
                        } else {
                            shipsSelect = shipsSelect;
                        }
                        if(cargoLeggeri < carLDef){
                            shipsSelect = shipsSelect+'{"id":'+202+',"number":'+cargoLeggeri+'}';
                        } else if (cargoLeggeri >= carLDef){
                            shipsSelect = shipsSelect+'{"id":'+202+',"number":'+carLDef+'}';
                        } else {
                            shipsSelect = shipsSelect;
                        }
                    } else if(sendAllShip === 'on' && splitShip === 'on' && rulesOgame === 'off'){
                        cargoLeggeri = (splitShipDef === 'on') ? s.dividerShip(cargoLeggeri) : cargoLeggeri;
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && cargoLeggeri > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                        shipsSelect = (cargoLeggeri > 0) ? shipsSelect+'{"id":'+202+',"number":'+cargoLeggeri+'}' : shipsSelect;
                    }

                    if(activeShip === 'on' && cargoLeggeroDB === 'on' && rulesOgame === 'on'){
                        var cargoLeggeriPerc = (cargoLeggeroDB_numslot === 'on') ? cargoLeggeroDB_num : 0;
                        var carLDef = s.percentualeFlotta(s.nCargoSelect(202,cargoLeggeriPerc))
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && cargoLeggeri > 0){
                            shipsSelect = shipsSelect+',';
                        } else {
                            shipsSelect = shipsSelect;
                        }
                        if(cargoLeggeri < carLDef){
                            shipsSelect = shipsSelect+'{"id":'+202+',"number":'+cargoLeggeri+'}';
                        } else if (cargoLeggeri >= carLDef){
                            shipsSelect = shipsSelect+'{"id":'+202+',"number":'+carLDef+'}';
                        } else {
                            shipsSelect = shipsSelect;
                        }
                    } else if(sendAllShip === 'on' && splitShip === 'on' && rulesOgame === 'on'){
                        cargoLeggeri = (splitShipDef === 'on') ? s.dividerShip(cargoLeggeri) : cargoLeggeri;
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && cargoLeggeri > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                        shipsSelect = (cargoLeggeri > 0) ? shipsSelect+'{"id":'+202+',"number":'+cargoLeggeri+'}' : shipsSelect;
                    }
                    var cargoPesanti = $('.transporterLarge > span.amount').attr('data-value');
                    if(activeShip === 'on' && cargoPesanteDB === 'on' && cargoPesanteDB_numslot === 'on' && rulesOgame === 'off'){
                        //var cargoPesantiDB = (cargoPesanti < cargoPesanteDB_num)? cargoPesanti : cargoPesanteDB_num;
                        var cargoPesantiDB = cargoPesanteDB_num;
                        var carPDef = s.percentualeFlotta(cargoPesantiDB)
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && cargoPesanti > 0){
                            shipsSelect = shipsSelect+',';
                        } else {
                            shipsSelect = shipsSelect;
                        }
                        if(cargoPesanti < carPDef){
                            shipsSelect = shipsSelect+'{"id":'+203+',"number":'+cargoPesanti+'}';
                        } else if (cargoPesanti >= carPDef){
                            shipsSelect = shipsSelect+'{"id":'+203+',"number":'+carPDef+'}';
                        } else {
                            shipsSelect = shipsSelect;
                        }
                    } else if(sendAllShip === 'on' && splitShip === 'on' && rulesOgame === 'off'){
                        cargoPesanti = (splitShipDef === 'on') ? s.dividerShip(cargoPesanti) : cargoPesanti;
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && cargoPesanti > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                        shipsSelect = (cargoPesanti > 0) ? shipsSelect+'{"id":'+203+',"number":'+cargoPesanti+'}' : shipsSelect;
                    }
                    if(activeShip === 'on' && cargoPesanteDB === 'on' && rulesOgame === 'on'){
                        var cargoPesantiPerc = (cargoPesanteDB_numslot === 'on') ? cargoPesanteDB_num : 0;
                        var carPDef = s.percentualeFlotta(s.nCargoSelect(203,cargoPesantiPerc));
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && cargoPesanti > 0){
                            shipsSelect = shipsSelect+',';
                        } else {
                            shipsSelect = shipsSelect;
                        }
                        if(cargoPesanti < carPDef){
                            shipsSelect = shipsSelect+'{"id":'+203+',"number":'+cargoPesanti+'}';
                        } else if (cargoPesanti >= carPDef){
                            shipsSelect = shipsSelect+'{"id":'+203+',"number":'+carPDef+'}';
                        } else {
                            shipsSelect = shipsSelect;
                        }
                    } else if(sendAllShip === 'on' && splitShip === 'on' && rulesOgame === 'on'){
                        cargoPesanti = (splitShipDef === 'on') ? s.dividerShip(cargoPesanti) : cargoPesanti;
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && cargoPesanti > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                        shipsSelect = (cargoPesanti > 0) ? shipsSelect+'{"id":'+203+',"number":'+cargoPesanti+'}' : shipsSelect;
                    }

                    var ripGame = $('.deathstar > span.amount').attr('data-value');
                    if(activeShip === 'on' && ripDB === 'on' && ripDB_numslot === 'on'){
                        var ripDB = (ripGame < ripDB_num) ? ripGame : ripDB_num;
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && ripGame > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                        shipsSelect = (ripGame > 0) ? shipsSelect+'{"id":'+214+',"number":'+s.percentualeFlotta(ripDB)+'}' : shipsSelect;
                    } else if(activeShip === 'on' && ripDB === 'on' && ripDB_numslot !== 'on'){
                        ripGame = (splitShipDef === 'on') ? s.dividerShip(ripGame) : ripGame;
                        // controllo se ci sono navi per questa selezione e inserisco ',' per array json, nel caso passa alla successiva
                        if(shipsSelect !== '' && ripGame > 0){shipsSelect = shipsSelect+',';} else {shipsSelect = shipsSelect;}
                        shipsSelect = (ripGame > 0) ? shipsSelect+'{"id":'+214+',"number":'+ripGame+'}' : shipsSelect;
                    }
                    var pathON = GMA.Options().active_pathfinder;
                    var pathNum = GMA.Options().path_number;
                    var pathFinder = $('.explorer > span.amount').attr('data-value');
                    if(pathON === 'on' && pathFinder > 0){
                        var pathFinderNum = pathNum;
                    } else {
                        var pathFinderNum = 1;
                    }
                    pathFinder = (splitShipDef === 'on') ? s.dividerShip(pathFinder) : pathFinder;
                    if(shipsSelect !== '' && pathFinder > 0){
                        shipsSelect = shipsSelect+',';
                    } else {
                        shipsSelect = shipsSelect;
                    }
                    shipsSelect = (pathFinder > 0) ? shipsSelect+'{"id":'+219+',"number":'+pathFinderNum+'}' : shipsSelect;

                    var sondeON = GMA.Options().active_sonde;
                    var sondeNum = GMA.Options().sonde_number;
                    var sondeSpia = $('.espionageProbe > span.amount').attr('data-value');
                    if(sondeON === 'on' && sondeSpia > 0){
                        var sondeSpiaNum = sondeNum;
                    } else {
                        var sondeSpiaNum = 1;
                    }
                    if(shipsSelect !== '' && sondeSpia > 0){
                        shipsSelect = shipsSelect+',';
                    } else {
                        shipsSelect = shipsSelect;
                    }
                    shipsSelect = (sondeSpia > 0) ? shipsSelect+'{"id":'+210+',"number":'+sondeSpiaNum+'}' : shipsSelect;
                } else {
                    shipsSelect = '{"id" : '+204+',"number" : '+1+'},{"id" : '+210+',"number" : '+1+'}';
                }
                GMA.Save('FleetDispatcher', $.parseJSON("["+shipsSelect+"]"));
                return $.parseJSON("["+shipsSelect+"]");
            }
            s.systemExpedition = function(){
                GMA.Save('shipOnPlanet', SGE.flottaSpedizione());

                var slotSped = GMA.Load('slotSpedizioni');
                var totSped = GMA.Load('TOTSpedizioni');
                // RICHIAMO FUNZIONE
                (function(window){
                    var gal = window.currentPlanet.galaxy;
                    var sys = window.currentPlanet.system;
                    var spMin = 100;
                    var spMax = 200;

                    // range choords  on off
                    if(GMA.Options().range_coords === 'range' || GMA.Options().range_coords === 'custom'){
                        sys = GMA.Options().range_array[0];
                    }
                    if(GMA.Options().range_coords === 'choords'){
                        sys = GMA.Options().rangeChoords;
                    }
                    ///////////////
                    var shipDef = GMA.Load('FleetDispatcher');

                    window.fleetDispatcher.shipsToSend = GMA.Load('FleetDispatcher');
                    console.log(GMA.Load('FleetDispatcher'))
                    window.fleetDispatcher.mission = 15;
                    window.fleetDispatcher.targetPlanet = {"galaxy":gal,"system":sys,"position":16,"type":1,"name":"spazio profondo"};

                    window.fleetDispatcher.refreshFleet1();
                    setTimeout(function(){
                        __DQS('#continueToFleet2').click();
                        var sendFleet1 = setInterval(function(){
                            if($('#fleet2').css('display') == 'block'){
                                clearInterval(sendFleet1);
                                var loadFLeet1 = setInterval(function(){
                                    if($('#fleetboxmission > div.content > div.ajax_loading').css('display') == 'none'){
                                        clearInterval(loadFLeet1);
                                        window.fleetDispatcher.refreshFleet2();
                                        __DQS('#missionButton15').click();
                                        // sistema range /////////////////
                                        if(GMA.Options().range_coords === 'range' || GMA.Options().range_coords === 'custom'){
                                            var checkSendBtn = setInterval(function(){
                                                if($('#fadeBoxStyle').hasClass('success')){
                                                    clearInterval(checkSendBtn);
                                                    var oldArray = GMA.Options().range_array;
                                                    var newRange = $.grep(oldArray, function(value) {
                                                        return value != oldArray[0];
                                                    });
                                                    if(newRange.length >= 1){
                                                        newRange = newRange;
                                                        var rangeArray = GMA.Options().range_array;
                                                        GMUP.opts('range_array', newRange);
                                                    } else {
                                                        if(GMA.Options().range_coords === 'range'){
                                                            newRange = rangeSpedArray();
                                                        }
                                                        if(GMA.Options().range_coords === 'custom'){
                                                            newRange = customSpedArray();
                                                        }
                                                    }
                                                };
                                            },100);
                                        }
                                    }
                                },100)
                            };
                        },100);
                    },0);
                })(window.unsafeWindow);
            };
            s.globalSpedizioni = function(){
                // core function spedizioni
                if(window.location.href.indexOf('?page=ingame&component=fleetdispatch') > 0){
                    // slot spedizioni da fleetDispatcher
                    (function(window){
                        var maxExpeditionCount = window.fleetDispatcher.maxExpeditionCount;
                        var expeditionCount = window.fleetDispatcher.expeditionCount;

                        const fleetCount = window.fleetDispatcher.fleetCount;
                        const maxFleetCount = window.fleetDispatcher.maxFleetCount;

                        const slotSpedizioni = expeditionCount;
                        const spedizioniTot = maxExpeditionCount;
                        $('#slot_used').html(slotSpedizioni);
                        $('#slot_totali').html(spedizioniTot);
                        GMA.Save('TOTSpedizioni', spedizioniTot);
                        GMA.Save('slotSpedizioni', slotSpedizioni);
                    })(window.unsafeWindow);
                    var minDeu = GMA.Options().deu_sped;
                    if(GMA.Options().sped_target.split(':')[0] === $('meta[name="ogame-planet-id"]').attr("content")){
                        if(deuOnPlanet < minDeu && GMA.Options().active_deu === 'on'){
                            $('#start_sped').append(`
                                <div style="background: #000000;text-align: center;font-weight: 900;box-shadow: 0px 0px 5px #ff0000;">
                                    DEUTERIO INSUFFICIENTE: minimo impostato `+minDeu+`
                                </div>
                            `);
                        }
                    }
                    if(fleetCount === maxFleetCount){
                        $('#start_sped').append('<span style="color:#f00; font-weight:900;">NON CI SONO SLOT FLOTTA LIBERI</span>');
                    }
                    var systemSpedGlobal = GMA.Data();
                    // slot disponibili + totali
                    var slotFlottaArray = $("#planet > a.tooltip").text().replace('Flotte: ','').replace('Sped.','').replace(' ','').split(':');
                    var slot_totali = slotFlottaArray[0].split('/')[1];
                    var slot_usati = slotFlottaArray[0].split('/')[0];

                    var spedizioniTot = GMA.Load('TOTSpedizioni');
                    var slotSpedizioni = GMA.Load('slotSpedizioni');
                    //var TOTSpedizioni = GMA.Load('TOTSpedizioni');

                    if(slotSpedizioni < spedizioniTot && fleetCount < maxFleetCount){
                        if(GMA.Options().range_array.length === 0){
                            if(GMA.Options().range_coords === 'range'){
                                rangeSpedArray();
                            }
                            if(GMA.Options().range_coords === 'custom'){
                                customSpedArray();
                            }
                        }
                        // variabili da systemSpedition_data //////////////////////////////////////////////
                        var planetArray = systemSpedGlobal.planet_array;
                        var moonArray = (systemSpedGlobal.moon_array !== '') ? systemSpedGlobal.moon_array : '';
                        var planetChordsArray = systemSpedGlobal.global_planet_array;
                        var moonChordsArray = systemSpedGlobal.global_moon_array;
                        // variabili da _systemSpedition_options //////////////////////////////////////////
                        var system_status = GMA.Options().system_status;
                        var spedStatus = GMA.Options().sped_status;
                        var spedMode = GMA.Options().sped_mode;
                        var spedTarget = GMA.Options().sped_target;
                        var serverGame = GMA.Options().server_ogame;
                        var spedSystem = GMA.Options().sped_system;
                        var pmChordsArray = GMA.Options().sped_target;

                        // ID pianeta/luna attuale
                        var currentPlanet = $('meta[name="ogame-planet-id"]').attr("content");
                        var currentCoords = $('meta[name="ogame-planet-coordinates"]').attr("content");
                        var currentName = $('meta[name="ogame-planet-name"]').attr("content");

                        var targetPM,targetId,singleTargetId,targetNamePM,targetGalaxy,targetSystem,spedTargetArray,targetChordsPM;


                        if(spedSystem !== 'off'){
                            if(spedMode == 'planet' || spedMode == 'moon'){
                                GMA.Save('sped_mode', spedMode);
                                spedTarget = spedTarget;
                                targetPM = pmChordsArray.split(':');
                                targetId = targetPM[0];
                                singleTargetId = targetPM[0];
                                targetNamePM = targetPM[1];
                                targetChordsPM = targetPM[2].replace('[','').replace(']','').split('|');
                                targetGalaxy = targetChordsPM[0];
                                targetSystem = targetChordsPM[1];
                                spedTargetArray = targetId+':'+targetGalaxy+':'+targetSystem+':'+targetNamePM;
                            } else if(spedMode == 'attuale'){
                                GMA.Save('sped_mode', spedMode);
                                targetPM = pmChordsArray.split(':');
                                targetId = currentPlanet;
                                singleTargetId = currentPlanet;
                                targetNamePM = currentName;
                                targetChordsPM = currentCoords.split('|');
                                targetGalaxy = targetChordsPM[0];
                                targetSystem = targetChordsPM[1];
                                spedTargetArray = targetId+':'+targetGalaxy+':'+targetSystem+':'+targetNamePM;
                            }
                            GMA.Save('targetSpedizioni', spedTargetArray); 
                            
                            var sped_fletsystem = GMA.Options().sped_ship_status+';'+GMA.Options().sped_mode_ship+';'+GMA.Options().sped_target+';'+GMA.Options().select_ship+';'+GMA.Options().select_allship+';'+GMA.Options().split_ship;

                            var spedFletSystem = sped_fletsystem.split(';');
                            var spedFletStat = GMA.Options().sped_ship_status;
                            var shipDb = GMA.Options().select_ship;
                            var sendAllShip = (GMA.Options().select_allship) ? GMA.Options().select_allship : 'off';
                            var splitShip = (GMA.Options().split_ship) ? GMA.Options().split_ship : 'off';
                            switch(shipDb){
                                case 'bs-on':
                                var nShip = $('.battleship > span.amount').attr('data-value');
                                GMA.Save('navi_da_guerra', 'bs-on');
                                break;
                                case 'bc-on':
                                nShip = $('.interceptor > span.amount').attr('data-value');
                                GMA.Save('navi_da_guerra', 'bc-on');
                                break;
                                case 'ds-on':
                                nShip = $('.destroyer > span.amount').attr('data-value');
                                GMA.Save('navi_da_guerra', 'ds-on');
                                break;
                                case 'rp-on':
                                nShip = $('.reaper > span.amount').attr('data-value');
                                GMA.Save('navi_da_guerra', 'rp-on');
                                break;
                                case 'off':
                                nShip = 'off';
                                GMA.Save('navi_da_guerra', nShip);
                                break;
                                case '':
                                nShip = 'off';
                                GMA.Save('navi_da_guerra', nShip);
                                break;
                            }
                            //*******************************************************************************

                            if(planetArray.length > 1){
                                var currentPlanet = $('meta[name="ogame-planet-id"]').attr("content");
                                var spedFletType = spedFletSystem[1];
                                var spedFletItem = spedFletSystem[2];
                                var DBspedFletItemID = spedFletItem.split(':')[0];
                                var DBspedFletName = spedFletItem.split(':')[1];
                                var spedChoords = spedFletItem.split(':')[2].replace('[', '').replace(']', '').split('|');
                                var spedGalassia = spedChoords[0];
                                var spedSistema = spedChoords[1];
                                var nextItem = GMA.Load('targetSpedizioni').split(':');
                                var nextID = nextItem[0];
                                var nextName = nextItem[3];
                            } else {
                                spedFletItem = spedTargetArray;
                                DBspedFletItemID = spedFletItem.split(':')[0];
                                DBspedFletName = spedFletItem.split(':')[3];
                                spedGalassia = spedFletItem.split(':')[1];
                                spedSistema = spedFletItem.split(':')[2];
                                nextItem = GMA.Load('targetSpedizioni').split(':');
                                nextID = nextItem[0];
                                nextName = nextItem[3];
                            }
                            if(GMA.Options().sped_system === 'on'){
                                $('#egs_fleet_ship').click(function(){
                                    SGE.systemExpedition();
                                });
                            }
                        }
                    }
                };
            };
        }
        var SGE = new SystemGlobalExpedition();
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // FINE SPEDIZIONI
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //   SSSSSS   EEEEEEE  DDDDDD    III  ZZZZZZZZ  III   OOOOOOO   NN     NN  III
        //  SS    SS  EE       DD   DDD  III        ZZ  III  OO     OO  NNN    NN  III
        //  SS        EE       DD    DD  III       ZZ   III  OO     OO  NNNN   NN  III
        //   SSS      EE       DD    DD  III      ZZ    III  OO     OO  NN NN  NN  III
        //     SS     EEEE     DD    DD  III     ZZ     III  OO     OO  NN  NN NN  III
        //      SS    EE       DD    DD  III    ZZ      III  OO     OO  NN   NNNN  III
        //        SS  EE       DD    DD  III   ZZ       III  OO     OO  NN    NNN  III
        //  SS    SS  EE       DD   DDD  III  ZZ        III  OO     OO  NN     NN  III
        //   SSSSSS   EEEEEEE  DDDDDD    III  ZZZZZZZZ  III   OOOOOOO   NN     NN  III
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////                                         /////////////////////////////////////////////////////
        //////////////////////////////////////////////                                         /////////////////////////////////////////////////////
        //
        //
        //
        //
        //                              SSS      AAA    RRRRR   TTTTTTTT       SSS    YY   YY    SSS
        //                            SS   SS  AA   AA  RR   RR    TT        SS   SS  YY   YY  SS   SS
        //                             SS      AA   AA  RR   RR    TT         SS       YY YY    SS
        //                              SSS    AA   AA  RRRRR      TT          SSS      YYY      SSS
        //                                SS   AAAAAAA  RR RR      TT            SS     YY         SS
        //                            SS   SS  AA   AA  RR  RR     TT        SS   SS    YY     SS   SS
        //                              SSS    AA   AA  RR   RR    TT          SSS      YY       SSS
        //
        //
        //
        //
        //////////////////////////////////////////////                                         /////////////////////////////////////////////////////
        //////////////////////////////////////////////                                         /////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(window.location.href.indexOf('?page') > 0){
            if(GMA.Load('ID_player') === undefined){
                GMA.Save('ID_player', ID_player);
            }
            if(GMA.Load('configurazione') !== 'off' && GMA.Load('systemSpedition_options') === undefined){
                $('body').append('<div id="popup_configurations" style="z-index: 3000000000000000000;width: 300px;height: auto;background: #050a10;position: absolute;margin: auto;top: 50%;left: calc(50% - 150px);border-radius: 10px;border: 1px solid #364351;box-shadow: 0px 15px 100px 30px #000;text-align: center;padding: 10px 0;color: #8aa8c8;"></div>');
            }
            if(GMA.Load('configurazione') !== 'off'){
                GMA.Save('configurazione', 'off');
                GMA.Save('targetSped', 'https://'+server_ogame+'/game/index.php?page=ingame&component=fleetdispatch');
                GMA.Save('TOTSpedizioni', '');
                GMA.Save('slotSpedizioni', '');
                GMA.Save('slotFlottaUsed', '');
                GMA.Save('slotFlottaAll', '');
                GMA.Save('targetSpedizioni', '');
                GMA.Save('sped_mode', 'planet');
                
                $('#popup_configurations').append('::: Configurazioni Variabili: OK :::<br>');
                //GMA.Save('MigrationVar', 'complete');
            } else {
                
            }
            if(GMA.Options() === undefined){
                var addEmptyarray = `{
                    "flet_system":"off",
                    "select_allship":"",
                    "select_ship":"",
                    "sped_mode":"off",
                    "sped_mode_ship":"",
                    "sped_def_mode":"",
                    "sped_def_status":"",
                    "sped_def_target":"",
                    "sped_ship_status":"",
                    "sped_active":"off",
                    "sped_status":"",
                    "sped_system":"off",
                    "sped_target":"",
                    "split_ship":"",
                    "target_item":"",
                    "target_name":"",
                    "type_select":"",
                    "version":"",
                    "system_status":"off",
                    "pathfinder_perc":"",
                    "select_partenza":"",
                    "select_destinazione":"",
                    "select_missione":"",
                    "select_cargo_l":"",
                    "select_cargo_p":"",
                    "active_ship":"off",
                    "caccia_leggero":"off",
                    "caccia_leggero_numslot":"off",
                    "caccia_leggero_num":"",
                    "cargo_leggero":"off",
                    "cargo_leggero_numslot":"off",
                    "cargo_leggero_num":"",
                    "cargo_pesante":"off",
                    "cargo_pesante_numslot":"off",
                    "cargo_pesante_num":"",
                    "rip": "off",
                    "rip_numslot": "off",
                    "rip_num": "",
                    "combatShip":"off",
                    "combatShip_numslot":"off",
                    "combatShip_num":"",
                    "range_coords": "off",
                    "rangeChoords": "",
                    "customChoords": "",
                    "range_sped":"",
                    "range_array":"",
                    "active_deu":"off",
                    "deu_sped":"50000",
                    "active_pathfinder":"",
                    "path_number":"",
                    "active_sonde":"",
                    "sonde_number":"",
                    "active_notturno":"",
                    "orario_notturno":"",
                    "orario_fine_notturno":"",
                    "percentualeflotta":"",
                    "notturno_opt_onoff":"",
                    "notturno_opt_destinazione":"off",
                    "language_select":"",
                    "ogame_rules":"off"
                }`;
                GMA.Save('systemSpedition_options', $.parseJSON("["+addEmptyarray+"]"));
                
                $('#popup_configurations').append('::: Configurazioni Array Options: OK :::<br>');
            }
            if(GMA.FleetPlanets() === undefined){
                var fleetPlanets = '{}';
                GMA.Save('systemSpedition_FleetPlanets', $.parseJSON("["+fleetPlanets+"]"));
            }
            if(GMA.FleetMoons() === undefined){
                var fleetMoons = '{}';
                GMA.Save('systemSpedition_FleetMoons', $.parseJSON("["+fleetMoons+"]"));
            }
            if(GMA.Load('configurazione') === 'off' && GMA.Load('systemSpedition_options') !== undefined && GMA.Load('returnFleet') !== undefined && $('#popup_configurations').length > 0){
                setTimeout(function(){
                    $('#popup_configurations').remove();
                },3000);
            }
            if(GMA.Load('upDateSystem') === undefined){
                GMA.Save('upDateSystem', '');
            }
            var compareArray = `{
                "flet_system":"off",
                "select_allship":"",
                "select_ship":"",
                "sped_mode":"off",
                "sped_mode_ship":"",
                "sped_def_mode":"",
                "sped_def_status":"",
                "sped_def_target":"",
                "sped_ship_status":"",
                "sped_active":"off",
                "sped_status":"",
                "sped_system":"off",
                "sped_target":"",
                "split_ship":"",
                "target_item":"",
                "target_name":"",
                "type_select":"",
                "version":"",
                "system_status":"off",
                "pathfinder_perc":"",
                "select_partenza":"",
                "select_destinazione":"",
                "select_missione":"",
                "select_cargo_l":"",
                "select_cargo_p":"",
                "active_ship":"off",
                "caccia_leggero":"off",
                "caccia_leggero_numslot":"off",
                "caccia_leggero_num":"",
                "cargo_leggero":"off",
                "cargo_leggero_numslot":"off",
                "cargo_leggero_num":"",
                "cargo_pesante":"off",
                "cargo_pesante_numslot":"off",
                "cargo_pesante_num":"",
                "rip": "off",
                "rip_numslot": "off",
                "rip_num": "",
                "combatShip":"off",
                "combatShip_numslot":"off",
                "combatShip_num":"",
                "range_onoff": "off",
                "range_coords": "off",
                "rangeChoords": "",
                "customChoords": "",
                "range_sped":"",
                "range_array":"",
                "active_deu":"off",
                "deu_sped":"50000",
                "active_pathfinder":"",
                "path_number":"",
                "active_sonde":"",
                "sonde_number":"",
                "active_notturno":"",
                "orario_notturno":"",
                "orario_fine_notturno":"",
                "percentualeflotta":"",
                "notturno_opt_onoff":"",
                "notturno_opt_destinazione":"off",
                "language_select":"",
                "ogame_rules":"off"
            }`;

            function updateOptionsArray(array_old,array_new){
                var newKeys = [];
                var newValues = [];
                var noUpdate;
                $(array_old).each(function(index, itemO){
                    $(array_new).each(function(index, itemN){
                        for(var i = 0; i < Object.keys(itemN).length; i++) {
                            if($.inArray(Object.keys(itemN)[i], Object.keys(itemO)) !== -1){
                                //
                                // array ok
                            } else {
                                newKeys.push(Object.keys(itemN)[i]);
                                newValues.push(Object.values(itemN)[i]);
                                noUpdate = 'on';
                            }
                        }
                    });
                });
                if(noUpdate === 'on'){
                    updateNewArray(array_old, newKeys, newValues);
                }
            }
            setTimeout(function(){
                updateOptionsArray(GMA.Options(),$.parseJSON(compareArray));
                GMA.Save('VersionNumber', versionNumber);
            },500);


            var identityPlayer = ID_player;


            if(GM_getValue(universe_name) == undefined){
                GM_setValue(universe_name, 'off');
            };



            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // MULTILANGUAGE
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // language strings //////////////////////////////////////////////////////////////////////
            var __e = new Object();
            var lang = (GMA.Options().language_select !== '') ? GMA.Options().language_select : $('html').attr('lang');
            var array_lang = ['cz','dk','es','fr','it','en','us'];

            /////////////////////////////ITALIAN////////////////////////////////////////////////////
            if(lang=='it'){
                __e["Planets"] = "Pianeti";
                __e["Moons"] = "Lune";
                __e["Expeditions System"] = "Sistema Spedizioni";
                __e["Expeditions On/Off"] = "Spedizioni On/Off";
                __e["Planet"] = "Pianeta";
                __e["Moon"] = "Luna";
                __e["Current"] = "Attuale";
                __e["Select"] = "Seleziona";
                __e["Fleet settings.."] = "Impostazioni flotta..";
                __e["Set cargo ship by rules"] = "Imp.cargo secondo le regole";
                __e["Small ship"] = "Caccia leg.";
                __e["Small cargo"] = "Cargo leg.";
                __e["Large cargo"] = "Cargo pes.";
                __e["Rip"] = "Rip";
                __e["Type Item"] = "Tipo di target";
                __e["Select Item"] = "Seleziona target";
                __e["Add %"] = "Aggiungi %";
                __e["Set Number"] = "Imposta n.";
                __e["Set number of Pathfinder"] = "Imposta n. di Pathfinder";
                __e["Set number of espionage probe"] = "Imposta n. di Sonde Spia";
                __e["standard settings"] = "Impostazioni base";
                __e["Custom"] = "Sistemi manuali";
                __e["Night Start / End"] = "Notturno Inizio / Fine";
                __e["% ship"] = "% flotta";
                __e["Set dueterio"] = "Imposta deuterio";
                __e["block shipments if less than"] = "blocca spedizioni se meno di";
                __e["Battle Ship"] = "Nave bat.";
                __e["Battle Cruise"] = "Incro bat.";
                __e["Destroyer"] = "Corazzate";
                __e["Select Warships"] = "Seleziona Navi da Guerra";
                __e["Divide ship %/slots"] = "Dividi flotta %/slot";
                __e["Send found ships"] = "Invia navi trovate";
                __e["Expeditions"] = "Spedizioni";
                __e["Slots used/total"] = "Slots usati/totali";
                __e["Next destination"] = "Prossima dest.";
                __e["Type of expedition"] = "Tipo di spedizione";
                __e["Custom Coords"] = "Sistemi manuali";
                __e["System"] = "Sistema";
                __e["Range of"] = "Range di";
                __e["Current Coords"] = "Sistema attuale";
                __e["systems"] = "sistemi";
                __e["Send Fleet"] = "Invia";
                __e["Starting from"] = "Partenza da";
                __e["Send & Divide found ships %/slots"] = "Invia e Dividi flotta trovata in %/slots";
                __e["Attention"] = "Atenzione";
                __e["in this universe, according to the rules of ogame, you can find a maximum of"] = "in questo universo, secondo le regole di ogame, si possono trovare un massimo di";
                __e["of materials"] = "di materie";
                __e["a number of cargoes needed with maximum hold for that quantity of materials will be sent."] = "verranno inviati un numero di cargo necessari con stiva massima per quel quantitativo di materie.";
                __e['If you do not have the availability of the cargo number,<br>disable the "Set cargo according to regulation", and set the n. manually.'] = 'Se non hai la disponibilità del numero di cargo, disabilita<br>"Imp.cargo secondo le regole", e imposta il n. manualmente.';

            }
            /////////////////////////////ENGLISH/ NO SELECT/////////////////////////////////////////
            if(lang=='en' || lang=='us' || lang=='us'){
                __e["Planets"] = "Planets";
                __e["Moons"] = "Moons";
                __e["Expeditions System"] = "Expeditions System";
                __e["Expeditions On/Off"] = "Expeditions On/Off";
                __e["Planet"] = "Planet";
                __e["Moon"] = "Moon";
                __e["Current"] = "Current";
                __e["Select"] = "Select";
                __e["Fleet settings.."] = "Fleet settings..";
                __e["Set cargo ship by rules"] = "Set cargo ship by rules";
                __e["Small ship"] = "Small ship";
                __e["Small cargo"] = "Small cargo";
                __e["Large cargo"] = "Large cargo";
                __e["Rip"] = "Rip";
                __e["Type Item"] = "Type Item";
                __e["Select Item"] = "Select Item";
                __e["Add %"] = "Add %";
                __e["Set Number"] = "Set Number";
                __e["Set number of Pathfinder"] = "Set number of Pathfinder";
                __e["Set number of espionage probe"] = "Set number of espionage probe";
                __e["standard settings"] = "standard settings";
                __e["Custom"] = "Custom";
                __e["Night Start / End"] = "Night Start / End";
                __e["% ship"] = "% ship";
                __e["Set dueterio"] = "Set dueterio";
                __e["block shipments if less than"] = "block shipments if less than";
                __e["Battle Ship"] = "Battle Ship";
                __e["Battle Cruise"] = "Battle Cruise";
                __e["Destroyer"] = "Destroyer";
                __e["Select Warships"] = "Select Warships";
                __e["Divide ship %/slots"] = "Divide ship %/slots";
                __e["Send found ships"] = "Send found ships";
                __e["Expeditions"] = "Expeditions";
                __e["Slots used/total"] = "Slots used/total";
                __e["Next destination"] = "Next destination";
                __e["Type of expedition"] = "Type of expedition";
                __e["Custom Coords"] = "Custom Coords";
                __e["System"] = "System";
                __e["Range of"] = "Range of";
                __e["Current Coords"] = "Current Coords";
                __e["systems"] = "systems";
                __e["Send Fleet"] = "Send";
                __e["Starting from"] = "Starting from";
                __e["Send & Divide found ships %/slots"] = "Send & Divide found ships %/slots";
                __e["Attention"] = "Attention";
                __e["in this universe, according to the rules of ogame, you can find a maximum of"] = "in this universe, according to the rules of ogame, you can find a maximum of";
                __e["of materials"] = "of materials";
                __e["a number of cargoes needed with maximum hold for that quantity of materials will be sent."] = "a number of cargoes needed with maximum hold for that quantity of materials will be sent.";
                __e['If you do not have the availability of the cargo number,<br>disable the "Set cargo according to regulation", and set the n. manually.'] = 'If you do not have the availability of the cargo number,<br>disable the "Set cargo ship by rules", and set the n. manually.';

            }
            /////////////////////////////DANSK//////////////////////////////////////////////////////
            if(lang=='dk'){
                __e["Planets"] = "Planeter";
                __e["Moons"] = "Måner";
                __e["Expeditions System"] = "Forsendelsessystem";
                __e["Expeditions On/Off"] = "Til/fra forsendelse";
                __e["Planet"] = "Planet";
                __e["Moon"] = "Måne";
                __e["Current"] = "Nuværende";
                __e["Select"] = "Vælg";
                __e["Fleet settings.."] = "Flådeindstillinger..";
                __e["Set cargo ship by rules"] = "Type, ships,% ships x slot";
                __e["Small ship"] = "Jagtben.";
                __e["Small cargo"] = "Lastben.";
                __e["Large cargo"] = "Cargo pes.";
                __e["Rip"] = "Hvil i fred";
                __e["Type Item"] = "Type af mål";
                __e["Select Item"] = "Vælg mål";
                __e["Add %"] = "Tilføj %";
                __e["Set Number"] = "Indstil num.";
                __e["Set number of Pathfinder"] = "Indstil Pathfinder No.";
                __e["Set number of espionage probe"] = "Fastsæt antal spionageundersøgelser";
                __e["standard settings"] = "Grundlæggende indstillinger";
                __e["Custom"] = "Manuelt valg";
                __e["Night Start / End"] = "Nat start / slut";
                __e["% ship"] = "% flåde";
                __e["Set dueterio"] = "Sæt deuterium";
                __e["block shipments if less than"] = "blokere forsendelser, hvis mindre end";
                __e["Battle Ship"] = "Flagermusskib.";
                __e["Battle Cruise"] = "Incro bat.";
                __e["Destroyer"] = "Slagskibe";
                __e["Select Warships"] = "Vælg krigsskibe";
                __e["Divide ship %/slots"] = "Dividere skib %/plads";
                __e["Send found ships"] = "Send fundne skibe";
                __e["Expeditions"] = "Forsendelse";
                __e["Slots used/total"] = "Brugte / Total Slots";
                __e["Next destination"] = "Næste dest.";
                __e["Type of expedition"] = "Forsendelsestype";
                __e["Custom Coords"] = "Manuelt valg";
                __e["System"] = "System";
                __e["Range of"] = "Rækkevidde af";
                __e["Current Coords"] = "Nuværende system";
                __e["systems"] = "systemer";
                __e["Send Fleet"] = "Sende";
                __e["Starting from"] = "Fra og med";
                __e["Send & Divide found ships %/slots"] = "Send og opdel fundne skibe %/pladser";
                __e["Attention"] = "Attention";
                __e["in this universe, according to the rules of ogame, you can find a maximum of"] = "in this universe, according to the rules of ogame, you can find a maximum of";
                __e["of materials"] = "of materials";
                __e["a number of cargoes needed with maximum hold for that quantity of materials will be sent."] = "a number of cargoes needed with maximum hold for that quantity of materials will be sent.";
                __e['If you do not have the availability of the cargo number,<br>disable the "Set cargo according to regulation", and set the n. manually.'] = 'If you do not have the availability of the cargo number,<br>disable the "Set cargo ship by rules", and set the n. manually.';

            }
            /////////////////////////////SPANISH////////////////////////////////////////////////////
            if(lang=='es'){
                __e["Planets"] = "Planetas";
                __e["Moons"] = "Lunas";
                __e["Expeditions System"] = "Sistema de Expediciones";
                __e["Expeditions On/Off"] = "Expediciones on/off";
                __e["Planet"] = "Planeta";
                __e["Moon"] = "Luna";
                __e["Current"] = "Actual";
                __e["Select"] = "Seleccione";
                __e["Fleet settings.."] = "Configuración de flota ..";
                __e["Set cargo ship by rules"] = "Tipo, naves,% naves x ranura";
                __e["Small ship"] = "Barco pequeño";
                __e["Small cargo"] = "Carga pequeña";
                __e["Large cargo"] = "Carga grande";
                __e["Rip"] = "Rotura";
                __e["Type Item"] = "Tipo de elemento";
                __e["Select Item"] = "Seleccione un planeta";
                __e["Add %"] = "Agregar %";
                __e["Set Number"] = "Establecer núm.";
                __e["Set number of Pathfinder"] = "Establecer número de Pathfinder";
                __e["Set number of espionage probe"] = "Número fijo de sonda de espionaje";
                __e["standard settings"] = "configuraciones estándar";
                __e["Custom"] = "Disfraz";
                __e["Night Start / End"] = "Inicio / Fin de la noche";
                __e["% ship"] = "% Embarcacion";
                __e["Set dueterio"] = "Ajuste dueterio";
                __e["block shipments if less than"] = "bloquear envíos si es menor que";
                __e["Battle Ship"] = "Barco de batalla";
                __e["Battle Cruise"] = "Crucero de batalla";
                __e["Destroyer"] = "Destructor";
                __e["Select Warships"] = "Seleccionar buques de guerra";
                __e["Divide ship %/slots"] = "Dividir barco %/ranura";
                __e["Send found ships"] = "Enviar barcos encontrados";
                __e["Expeditions"] = "Expediciones";
                __e["Slots used/total"] = "Slots utilizados / total";
                __e["Next destination"] = "Próximo destino";
                __e["Type of expedition"] = "Tipo de expedición";
                __e["Custom Coords"] = "Coords personalizados";
                __e["System"] = "Sistema";
                __e["Range of"] = "Gama de";
                __e["Current Coords"] = "Coords actuales";
                __e["systems"] = "sistemas";
                __e["Send Fleet"] = "Enviar Flota";
                __e["Starting from"] = "Empezando desde";
                __e["Send & Divide found ships %/slots"] = "Enviar y dividir los barcos %/ranuras";
                __e["Attention"] = "Attention";
                __e["in this universe, according to the rules of ogame, you can find a maximum of"] = "in this universe, according to the rules of ogame, you can find a maximum of";
                __e["of materials"] = "of materials";
                __e["a number of cargoes needed with maximum hold for that quantity of materials will be sent."] = "a number of cargoes needed with maximum hold for that quantity of materials will be sent.";
                __e['If you do not have the availability of the cargo number,<br>disable the "Set cargo according to regulation", and set the n. manually.'] = 'If you do not have the availability of the cargo number,<br>disable the "Set cargo ship by rules", and set the n. manually.';

            }
            /////////////////////////////FRENCH/////////////////////////////////////////////////////
            if(lang=='fr'){
                __e["Planets"] = "Planètes";
                __e["Moons"] = "Lunes";
                __e["Expeditions System"] = "Système d'expédition";
                __e["Expeditions On/Off"] = "Envois On/Off";
                __e["Planet"] = "Planète";
                __e["Moon"] = "Lune";
                __e["Current"] = "Réel";
                __e["Select"] = "Sélectionner";
                __e["Fleet settings.."] = "Paramètres de la flotte";
                __e["Set cargo ship by rules"] = "Type, navires, % navires x emplacement";
                __e["Small ship"] = "Jambe de combat";
                __e["Small cargo"] = "La jambe de cargaison";
                __e["Large cargo"] = "Cargo pes.";
                __e["Rip"] = "Rip";
                __e["Type Item"] = "Type de cible";
                __e["Select Item"] = "Sélectionner la cible";
                __e["Add %"] = "Ajouter %";
                __e["Set Number"] = "Définir num.";
                __e["Set number of Pathfinder"] = "Définir le numéro de l'éclaireur";
                __e["Set number of espionage probe"] = "Fixer le nombre de sonde d'espionnage";
                __e["standard settings"] = "Paramètres de base";
                __e["Custom"] = "Systèmes manuels";
                __e["Night Start / End"] = "Début/Fin de la nuit";
                __e["% ship"] = "% Fleet";
                __e["Set dueterio"] = "Définir le deutérium";
                __e["block shipments if less than"] = "bloquer les expéditions si elles sont inférieures à";
                __e["Battle Ship"] = "Batteur de bateau";
                __e["Battle Cruise"] = "Incro bat.";
                __e["Destroyer"] = "Battleships";
                __e["Select Warships"] = "Sélectionnez les navires de guerre";
                __e["Divide ship %/slots"] = "Diviser flotte en tranches de %";
                __e["Send found ships"] = "Envoyer les navires trouvés";
                __e["Expeditions"] = "Envois";
                __e["Slots used/total"] = "Créneaux utilisés/total";
                __e["Next destination"] = "Next Dest.";
                __e["Type of expedition"] = "Type d'expédition";
                __e["Custom Coords"] = "Systèmes manuels";
                __e["System"] = "Système";
                __e["Range of"] = "Fourchette de";
                __e["Current Coords"] = "Système actuel";
                __e["systems"] = "systèmes";
                __e["Send Fleet"] = "Envoyer";
                __e["Starting from"] = "Démarrer à partir de";
                __e["Send & Divide found ships %/slots"] = "Envoyer et diviser les navires trouvés %/slots";
                __e["Attention"] = "Attention";
                __e["in this universe, according to the rules of ogame, you can find a maximum of"] = "in this universe, according to the rules of ogame, you can find a maximum of";
                __e["of materials"] = "of materials";
                __e["a number of cargoes needed with maximum hold for that quantity of materials will be sent."] = "a number of cargoes needed with maximum hold for that quantity of materials will be sent.";
                __e['If you do not have the availability of the cargo number,<br>disable the "Set cargo according to regulation", and set the n. manually.'] = 'If you do not have the availability of the cargo number,<br>disable the "Set cargo ship by rules", and set the n. manually.';

            }
            /////////////////////////////CZECH//////////////////////////////////////////////////////
            if(lang=='cz'){
                __e["Planets"] = "Planety";
                __e["Moons"] = "Měsíce";
                __e["Expeditions System"] = "Expediční systém";
                __e["Expeditions On/Off"] = "Expedice zapnuto/vypnuto";
                __e["Planet"] = "Planet";
                __e["Moon"] = "Měsíc";
                __e["Current"] = "Current";
                __e["Select"] = "Select";
                __e["Fleet settings.."] = "Fleet settings..";
                __e["Set cargo ship by rules"] = "Typ, lodě, % lodí x slot";
                __e["Small ship"] = "Malá loď";
                __e["Small cargo"] = "Malý náklad";
                __e["Large cargo"] = "Velký náklad";
                __e["Rip"] = "Rip";
                __e["Type Item"] = "Typ položky";
                __e["Select Item"] = "Vybrat položku";
                __e["Add %"] = "Přidejte %";
                __e["Set Number"] = "Nastavit číslo";
                __e["Set number of Pathfinder"] = "Nastavit počet pátračů";
                __e["Set number of espionage probe"] = "Nastavení čísla špionážní sondy";
                __e["standard settings"] = "standardní nastavení";
                __e["Custom"] = "Vlastní";
                __e["Night Start / End"] = "Začátek/konec noci";
                __e["% ship"] = "% lodi";
                __e["Set dueterio"] = "Nastavit dueterio";
                __e["block shipments if less than"] = "blokovat zásilky, pokud jsou menší než";
                __e["Battle Ship"] = "Battle Ship";
                __e["Battle Cruise"] = "Battle Cruise";
                __e["Destroyer"] = "Destroyer";
                __e["Select Warships"] = "Vybrat válečné lodě";
                __e["Divide ship %/slots"] = "Rozdělit loď %/sloty";
                __e["Send found ships"] = "Odeslat nalezené lodě";
                __e["Expeditions"] = "Expedice";
                __e["Slots used/total"] = "Využité sloty/celkem";
                __e["Next destination"] = "Další cíl";
                __e["Type of expedition"] = "Typ expedice";
                __e["Custom Coords"] = "Custom Coords";
                __e["System"] = "System";
                __e["Range of"] = "Rozsah";
                __e["Current Coords"] = "Current Coords";
                __e["systems"] = "systems";
                __e["Send Fleet"] = "Odeslat";
                __e["Starting from"] = "Od";
                __e["Send & Divide found ships %/slots"] = "Odeslat & Rozdělit nalezené lodě %/sloty";
                __e["Attention"] = "Attention";
                __e["in this universe, according to the rules of ogame, you can find a maximum of"] = "in this universe, according to the rules of ogame, you can find a maximum of";
                __e["of materials"] = "of materials";
                __e["a number of cargoes needed with maximum hold for that quantity of materials will be sent."] = "a number of cargoes needed with maximum hold for that quantity of materials will be sent.";
                __e['If you do not have the availability of the cargo number,<br>disable the "Set cargo according to regulation", and set the n. manually.'] = 'If you do not have the availability of the cargo number,<br>disable the "Set cargo ship by rules", and set the n. manually.';

            }
            /////////////////////////////NO LANGUAGE////////////////////////////////////////////////
            if($.inArray(lang, array_lang) === -1){
               __e["Planets"]="Planets";
               __e["Moons"]="Moons";
               __e["Expeditions System"]="Expeditions System";
               __e["Expeditions On/Off"]="Expeditions On/Off";
               __e["Planet"]="Planet";
               __e["Moon"]="Moon";
               __e["Current"]="Current";
               __e["Select"]="Select";
               __e["Fleet settings.."]="Fleet settings..";
               __e["Set cargo ship by rules"]="Set cargo ship by rules";
               __e["Small ship"]="Small ship";
               __e["Small cargo"]="Small cargo";
               __e["Large cargo"]="Large cargo";
               __e["Rip"]="Rip";
               __e["Type Item"]="Type Item";
               __e["Select Item"]="Select Item";
               __e["Add %"]="Add %";
               __e["Set Number"] = "Set Number";
               __e["Set number of Pathfinder"]="Set number of Pathfinder";
               __e["Set number of espionage probe"] = "Set number of espionage probe";
               __e["standard settings"]="standard settings";
               __e["Custom"]="Custom";
               __e["Night Start / End"]="Night Start / End";
               __e["% ship"]="% ship";
               __e["Set dueterio"]="Set dueterio";
               __e["block shipments if less than"]="block shipments if less than";
               __e["Battle Ship"]="Battle Ship";
               __e["Battle Cruise"]="Battle Cruise";
               __e["Destroyer"]="Destroyer";
               __e["Select Warships"]="Select Warships";
               __e["Divide ship %/slots"]="Divide ship %/slots";
               __e["Send found ships"]="Send found ships";
               __e["Expeditions"]="Expeditions";
               __e["Slots used/total"]="Slots used/total";
               __e["Next destination"]="Next destination";
               __e["Type of expedition"]="Type of expedition";
               __e["Custom Coords"]="Custom Coords";
               __e["System"]="System";
               __e["Range of"]="Range of";
               __e["Current Coords"]="Current Coords";
               __e["systems"]="systems";
               __e["Send Fleet"]="Send";
               __e["Send & Divide found ships %/slots"] = "Send & Divide found ships %/slots";
               __e["Starting from"]="Starting from";
                __e["Attention"] = "Attention";
                __e["in this universe, according to the rules of ogame, you can find a maximum of"] = "in this universe, according to the rules of ogame, you can find a maximum of";
                __e["of materials"] = "of materials";
                __e["a number of cargoes needed with maximum hold for that quantity of materials will be sent."] = "a number of cargoes needed with maximum hold for that quantity of materials will be sent.";
                __e['If you do not have the availability of the cargo number,<br>disable the "Set cargo according to regulation", and set the n. manually.'] = 'If you do not have the availability of the cargo number,<br>disable the "Set cargo ship by rules", and set the n. manually.';

            }


            function LanguageSvitcher(){
                var L = this;
                L.optionsLang = function(){
                    var langSel;
                    if(GMA.Options().language_select === 'off' || GMA.Options().language_select === ''){
                            langSel = 'selected';
                        } else {
                            langSel = '';
                        }
                    var languageArrayID = '<option id="ogame_language" '+langSel+' value="off">Ogame Lang '+ogameLanguage+' </option>';
                    $.each(array_lang,function(i){
                        if(ogameLanguage === array_lang[i]){

                        } else {
                            if(GMA.Options().language_select === array_lang[i]){
                                langSel = 'selected';
                            } else {
                                langSel = '';
                            }
                            languageArrayID += '<option id="'+array_lang[i]+'" '+langSel+' value="'+array_lang[i]+'">'+array_lang[i]+'</option>';
                        }
                    });
                    return languageArrayID;
                }
            }
            var LANG = new LanguageSvitcher();
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // MULTILANGUAGE
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




            // SISTEMA INVIO DATI AL DATABASE coreDatabaseSend FUNCTION
            //if(GMA.Load('sStatus') !== 'off'){
            // SISTEMA INVIO DATI ARRAY GM coreDatabaseSend FUNCTION
            function systemSpeditionDbSend(){
                // INIZIO GESTIONE SCRIPT
                // array planet
                var planet_array = $('#planetList .smallplanet').map(function() {
                    return this.id, this.id.replace('planet-','');
                }).get();
                //
                var name_planet_array = $('#planetList .smallplanet a .planet-name ').map(function() {
                    return $(this).text();
                }).get();
                //
                var planet_koords_array = $('#planetList .smallplanet a .planet-koords ').map(function() {
                    return $(this).text().replace(/\:/g, '|');
                }).get();
                //

                // global_planet_array su db convertito per array gm
                var global_planet_array = [];
                global_planet_array = $('#planetList .smallplanet').map(function() {
                    return this.id, this.id.replace('planet-','')+':'+$(this).find('a .planet-name').text()+':'+$(this).find('a .planet-koords').text().replace(/\:/g, '|')+':1';
                }).get();
                
                
                // global_planet_array su db convertito per array gm


                // arrayMoon
                var countMoon = $('#planetList > div .moonlink').length;
                var global_moon_array = [];
                if(countMoon >0){
                    // array moon
                    var moon_array = $('#planetList > div .moonlink').map(function() {
                        return this.href.match(/cp=([^&]+)/)[1];
                    }).get();
                    //
                    var name_moon_array = $('#planetList .smallplanet .moonlink img').map(function() {
                        return $(this).attr('alt');
                    }).get();
                    //
                    var moon_koords_array = $('#planetList .smallplanet .moonlink').map(function() {
                        return $(this).parent().find('a .planet-koords').html().replace(/\:/g, '|');
                    }).get();
                    //

                    global_moon_array = $('#planetList > div .moonlink').map(function() {
                        return this.href.match(/cp=([^&]+)/)[1]+':'+$(this).find('img').attr('alt')+':'+$(this).parent().find('a .planet-koords').html().replace(/\:/g, '|')+':3';
                    }).get();
                }
                
                
                // global_moon_array su db convertito per array gm

                var systemactivityGM = {'ID_player': ID_player,'unigame': server_ogame,'player': name_player,'server_ogame': server_ogame,'planet_array': planet_array,'moon_array': moon_array,'name_planet_array': name_planet_array,'name_moon_array': name_moon_array,'planet_koords_array': planet_koords_array,'moon_koords_array': moon_koords_array,'global_planet_array': global_planet_array,'global_moon_array': global_moon_array};
                GMA.Save('systemSpedition_data', systemactivityGM);
                const systemGlobal = GMA.Data();
                
                
                //
                // modo per ricavare i dati da array GM es: systemGlobal.planet_array;
                // modulo destro controllo globale e modulo configurazione
                //
                
                
            };

            setTimeout(function(){
                var pageArray = ['overview','supplies','facilities'];
                var urlRedirect = $.grep(pageArray, function(str) { return location.href.indexOf(str) > -1; });
                if (window.location.href.indexOf('?page=ingame&component='+urlRedirect) > 0) {
                    $(document).ready(function() {
                        systemSpeditionDbSend();
                    });
                }
            },500);
            // INIZIO FUNZIONE POPUP SETTAGGI
            function popUp(iFrameHeight){
                var systemActPopUp = document.createElement("div");
                systemActPopUp.setAttribute('id', 'egsPopUpWindow');
                systemActPopUp.classList.add('egsPopUpWindow');
                systemActPopUp.classList.add('systpopup-hide');
                systemActPopUp.innerHTML = `
                    <div id="systpopupW1">
                        <div id="systpopupW2" class="sidebar">
                            <div id="controlpanel" style="width: 655px;overflow: hidden;">
                                <div id="EGS_containerglobal">
                                    <div id="sys_container" class="container"></div><!-- fine sys_container -->
                                </div><!-- fine EGS_containerglobal -->
                            </div>
                        </div>
                        <div class="c-left"></div>
                        <div class="c-right"></div>
                    </div>`;
                if($('#middle').length > 0){
                    document.getElementById('middle').appendChild(systemActPopUp)
                } else {
                    document.getElementById('contentWrapper').appendChild(systemActPopUp);
                };
                $('#egsPopUpWindow').css('display', 'none');
                $('#egsPopUpWindow').insertBefore('#eventlistcomponent');



                var systemGlobal = GMA.Data();
                var systemSpedition_options = GMA.Options();
                var nPlanet = systemGlobal.planet_array.length;
                var nMoon = (systemGlobal.moon_array !== undefined) ? systemGlobal.moon_array.length : '';
                


                // SPEDIZIONI ////////////////////////////////////////////////////////////////////////////////////
                // sistema navi da guerra e flotta trovata ///////////////////////////////////////////////////////
                var sped_system = GMA.Options().sped_system;
                var sped_mode = GMA.Options().sped_mode;
                var sped_target = GMA.Options().sped_target;
                var itemSped = sped_target.split(':')[0];
                switch(sped_system){
                    case 'on':
                        var spedizioniToTarget = 'checked';
                        var spedizioniToTargetOff = '';
                        break;
                    case 'off':
                        spedizioniToTarget = '';
                        spedizioniToTargetOff = 'checked';
                        break;
                }
                switch(sped_mode){
                    case 'planet':
                        var planetSped = 'selected';
                        break;
                    case 'moon':
                        var moonSped = 'selected';
                        break;
                    case 'planetRnd':
                        var planetRndSped = 'selected';
                        break;
                    case 'moonRnd':
                        var moonRndSped = 'selected';
                        break;
                    case 'attuale':
                        var attualeSped = 'selected';
                        break;
                }

                var sped_def_status = GMA.Options().sped_def_status;
                var sped_def_mode = GMA.Options().sped_def_mode;
                var sped_def_target = GMA.Options().sped_def_target.split(':')[0];
                switch(sped_def_status){
                    case 'on':
                        var sped_returnToTarget = 'checked';
                        var sped_returnToTargetOff = '';
                        break;
                    case 'off':
                        sped_returnToTarget = '';
                        sped_returnToTargetOff = 'checked';
                        break;
                }
                switch(sped_def_mode){
                    case 'planet':
                        var sped_planetSelected = 'selected';
                        break;
                    case 'moon':
                        var sped_moonSelected = 'selected';
                        break;
                }

                var sped_ship_status = GMA.Options().sped_ship_status;
                var sped_mode_ship = GMA.Options().sped_mode_ship;
                switch(sped_ship_status){
                    case 'on':
                        var sped_ship = 'checked';
                        var sped_shipOff = '';
                        break;
                    case 'off':
                        sped_ship = '';
                        sped_shipOff = 'checked';
                        break;
                }
                switch(sped_mode_ship){
                    case 'planet':
                        var planetSped_ship = 'selected';
                        break;
                    case 'moon':
                        var moonSped_ship = 'selected';
                        break;
                    case 'planetRnd':
                        var planetSpedRnd_ship = 'selected';
                        break;
                    case 'moonRnd':
                        var moonSpedRnd_ship = 'selected';
                        break;
                    case 'attuale':
                        var attualeSpedShip = 'selected';
                        break;
                }

                var selectAllShip = (GMA.Options().select_allship === 'on') ? 'checked': '';
                var splitShip = (GMA.Options().split_ship === 'on') ? 'checked': '';
                var select_ship = GMA.Options().select_ship;
                switch(select_ship){
                    case 'bs-on':
                        var bsShipOn = 'checked';
                        var bcShipOn = '';
                        var dsShipOn = '';
                        var rpShipOn = '';
                        var fletShipOff = '';
                        var shipStat = 'on';
                        var combatShip = 'battleShip';
                        var combatShip_name = __e['Battle Ship'];
                        var combatShip_num = 'battle_ship';
                        break;
                    case 'bc-on':
                        bsShipOn = '';
                        bcShipOn = 'checked';
                        dsShipOn = '';
                        rpShipOn = '';
                        fletShipOff = '';
                        shipStat = 'on';
                        combatShip = 'battleCruise';
                        combatShip_name = __e['Battle Cruise'];
                        combatShip_num = 'battle_cruise';

                        break;
                    case 'ds-on':
                        bsShipOn = '';
                        bcShipOn = '';
                        dsShipOn = 'checked';
                        rpShipOn = '';
                        fletShipOff = '';
                        shipStat = 'on';
                        combatShip = 'destroyer';
                        combatShip_name = __e['Destroyer'];
                        combatShip_num = 'destroyer';

                        break;
                    case 'rp-on':
                        bsShipOn = '';
                        bcShipOn = '';
                        dsShipOn = '';
                        rpShipOn = 'checked';
                        fletShipOff = '';
                        shipStat = 'on';
                        combatShip = 'reaper';
                        combatShip_name = 'Reaper';
                        combatShip_num = 'reaper';
                        break;
                    case 'off':
                        bsShipOn = '';
                        bcShipOn = '';
                        dsShipOn = '';
                        rpShipOn = '';
                        fletShipOff = 'checked';
                        shipStat = 'off';
                        combatShip = 'combatoff';
                        combatShip_name = 'combatoff';
                        combatShip_num = 'combatoff';
                        break;
                }
                // ogame rules
                var ogameRules =  (GMA.Options().ogame_rules === 'on') ? 'checked': '';
                // sistema seleziona flotta
                var active_ship_check =  (GMA.Options().active_ship === 'on') ? 'checked': '';
                // caccia leggero
                var active_cl =  (GMA.Options().caccia_leggero === 'on') ? 'checked': '';
                var active_cl_ns =  (GMA.Options().caccia_leggero_numslot === 'on') ? 'checked': '';
                // cargo leggero
                var active_crl =  (GMA.Options().cargo_leggero === 'on') ? 'checked': '';
                var active_crl_ns =  (GMA.Options().cargo_leggero_numslot === 'on') ? 'checked': '';
                // cargo pesante
                var active_cp =  (GMA.Options().cargo_pesante === 'on') ? 'checked': '';
                var active_cp_ns =  (GMA.Options().cargo_pesante_numslot === 'on') ? 'checked': '';
                // rip
                var active_rip =  (GMA.Options().rip === 'on') ? 'checked': '';
                var active_rip_ns =  (GMA.Options().rip_numslot === 'on') ? 'checked': '';
                // nave da guerra
                var active_nb =  (GMA.Options().combatShip === 'on') ? 'checked': '';
                var active_nb_ns =  (GMA.Options().combatShip_numslot === 'on') ? 'checked': '';
                // inizio variabili
                var active_cl_num =  (GMA.Options().caccia_leggero_num !== '') ? GMA.Options().caccia_leggero_num : '';
                var active_crl_num =  (GMA.Options().cargo_leggero_num !== '') ? GMA.Options().cargo_leggero_num : '';
                var active_cp_num =  (GMA.Options().cargo_pesante_num !== '') ? GMA.Options().cargo_pesante_num : '';
                var active_rip_num =  (GMA.Options().rip_num !== '') ? GMA.Options().rip_num : '';
                var active_nb_num =  (GMA.Options().combatShip_num !== '') ? GMA.Options().combatShip_num : '';
                // range sped
                var range_onoff =  (GMA.Options().range_onoff === 'on') ? 'checked': '';
                var range_sped = GMA.Options().range_sped;
                ////////////////////////////////////////////////////////////
                var active_deu_check =  (GMA.Options().active_deu === 'on') ? 'checked': '';
                var active_deuNum_check = (GMA.Options().active_deu !== 'on') ? 'disabled="disabled"' : '';
                var deu_min =  (GMA.Options().deu_sped !== '') ? GMA.Options().deu_sped : 'Not selected';
                ////////////////////////////////////////////////////////////
                var active_pathfinder_check =  (GMA.Options().active_pathfinder === 'on') ? 'checked' : '';
                var active_pathNum_check = (GMA.Options().active_pathfinder === 'on') ? 'unset': 'disabled="disabled"';
                var path_number =  (GMA.Options().path_number !== '') ? GMA.Options().path_number : 'Not selected';
                var active_sonde_check =  (GMA.Options().active_sonde === 'on') ? 'checked' : '';
                var active_sondeNum_check = (GMA.Options().active_sonde === 'on') ? 'unset' : 'disabled="disabled"';
                var sonde_number =  (GMA.Options().sonde_number !== '') ? GMA.Options().sonde_number : 'Not selected';
                ////////////////////////////////////////////////////////////
                var active_notturno_check =  (GMA.Options().active_notturno === 'on') ? 'checked' : '';
                var active_orarioNotturno_check = (GMA.Options().active_notturno !== 'on') ? 'disabled="disabled"' : '';
                var orario_notturno =  (GMA.Options().orario_notturno !== '') ? GMA.Options().orario_notturno : '';
                var orario_fine_notturno =  (GMA.Options().orario_fine_notturno !== '') ? GMA.Options().orario_fine_notturno : '';
                if(GMA.Options().active_notturno === 'on'){
                    var percentuale_flotta_check = '';
                } else {
                    var percentuale_flotta_check = 'disabled="disabled"';
                }
                var percentuale_flotta = (GMA.Options().percentualeflotta !== '') ? GMA.Options().percentualeflotta : '';
                

                var system_status = GMA.Options().system_status;
                switch(system_status){
                    case 'on':
                        var systemStatus = 'checked';
                        break;
                    case 'off':
                        var systemStatus = '';
                        break;
                    case '':
                        var systemStatus = '';
                        break;
                }



                var moonTarget = (GMA.Data().global_moon_array !== undefined) ? '<option id="optSpedmoon" '+moonSped+' value="moon">'+__e["Moon"]+'</option>':'';
                var moonSpeedSelect = (GMA.Data().global_moon_array !== undefined) ? '<option id="optmoon" '+sped_moonSelected+' value="moon">'+__e["Moon"]+'</option>':'';
                var moonSpedShip = (GMA.Data().global_moon_array !== undefined) ? '<option id="optSpedmoon_ship" '+moonSped_ship+' value="moon">'+__e["Moon"]+'</option>':'';
                var rcSelect = (GMA.Options().range_coords !=='') ? GMA.Options().range_coords : 'off';

                var rangeSped = (GMA.Options().range_sped !=='') ? GMA.Options().range_sped : '';
                var rangeChoords = (GMA.Options().rangeChoords !=='') ? GMA.Options().rangeChoords : '';
                var customChoords = (GMA.Options().customChoords !=='') ? GMA.Options().customChoords : '';


                switch(rcSelect){
                    case 'range':
                        var rangeSelected = 'selected';
                        var choordsCustom = '';
                        var rcOff = '';
                        $('#rangeSped').show();
                        $('#customChoords').hide();
                        $('.rc_text').hide();
                        break;
                    case 'custom':
                        var rangeSelected = '';
                        var choordsCustom = 'selected';
                        var rcOff = '';
                        $('#rangeSped').hide();
                        $('#customChoords').show();
                        $('.rc_text').hide();
                        break;
                    case 'off':
                        var rangeSelected = '';
                        var choordsCustom = '';
                        var rcOff = 'selected';
                        $('#rangeSped').hide();
                        $('#customChoords').hide();
                        $('.rc_text').show();
                        break;
                }

                $('#sys_container').append(`
                    <div id="sys_title_container">
                        <div class="row">
                            <div class="egs_col-sm-12">
                                <div id="sys_title">
                                    <h3 style="line-height: 20px !important;">Expedition Game System</h3>
                                </div>
                                <div style="position: absolute;float: right;top: 9px;right: 10px;">
                                    <select id="option_language" name="language_select">
                                        `+LANG.optionsLang()+`
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="containerRow" class="container egs_modpadding">
                    </div><!-- fine containerRow -->`);
                $('#option_language').on('change', function(){
                    var setLanguage;
                    if($('#option_language').val() === 'off'){
                        setLanguage = ogameLanguage;
                    } else {
                        setLanguage = $('#option_language').val();
                    }
                    GMUP.opts('language_select', setLanguage);
                    //location.reload();
                })
                $('#containerRow').append(`
                    <div id="descrizione" style="height:13px;">
                        <div class="row">
                            <div class="egs_col-sm-12 egs_modpadding">
                                <div id="sys_id_player" class="egs_col-sm-3m egs_divfloat egs_border_right egs_lineargradient1">
                                    <span>ID Player: `+ID_player+`</span>
                                </div>
                                <div id="sys_name_player" class="egs_col-sm-3m egs_divfloat egs_border_right egs_lineargradient1">
                                    <span>Player: `+name_player+`</span>
                                </div>
                                <div id="egs_sys_planet" class="egs_col-sm-3m egs_divfloat egs_border_right egs_lineargradient1">
                                    <span>`+__e["Planets"]+`: `+nPlanet+`</span>
                                </div>
                                <div id="egs_sys_moon" class="egs_col-sm-3m egs_divfloat egs_lineargradient1">
                                    <span>`+__e["Moons"]+`: `+nMoon+`</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="selectfunction">
                        <div class="row">
                            <form id="optionsForm" action="settingsrnd.php" method="post" style="width: 100%"></form>
                        </div>
                    </div><!-- fine selectfunctiona -->`);
                
                $('#optionsForm').append(`
                    <div style="clear: both;"></div>
                    <div id="section_spedizioni" class="egs_col-sm-12 egs_modpadding">
                        <div class="egs_col-sm-12 egs_modpadding fontFamily fontalign background_black descrizione">
                            Expeditions System<br />
                        </div>
                        <div id="spedizioni_target" class="col-sm-3 lineHeight egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                            <div class="egs_col-sm-12 egs_modpadding egs_border_bottom-css fontalign"><span>`+__e["Expeditions On/Off"]+`</span></div>
                            <div class="egs_col-sm-12 egs_modpadding" style="text-align: center; margin: 4px;">
                                <div
                                    class="egs_col-sm-12 egs_divfloat egs_modpadding fontFamily font14 fontalign"
                                    style="display: inline-flex; line-height: 15px !important; text-align: center !important; width: 82px; left: 0; right: 0; margin: auto; float: none !important;">
                                    <label for="spedizioni_active">On/Off</label>
                                    <input id="spedizioni_active" type="checkbox" class="no_option_sped" name="sped_system" value="on" `+spedizioniToTarget+` data-toggle="toggle" style="margin: 0px 0px 4px 14px !important; height: 20px; width: 12px;" />
                                </div>
                            </div>
                        </div>
                        <input id="spedizioni_activeOff" type="radio" name="sped_system" class="no_option_sped" `+spedizioniToTargetOff+` value="off" style="display: none;" /> <input type="hidden" name="sped_status" value="on" />
                        <div id="target_sped_select" class="col-sm-3 lineHeight egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                            <div class="egs_col-sm-12 egs_modpadding egs_border_bottom-css fontalign"><span>`+__e["Type Item"]+`</span></div>
                            <div class="egs_col-sm-12 egs_modpadding">
                                <div class="egs_col-sm-12 egs_divfloat egs_modpadding fontFamily font14 fontalign">
                                    <select id="select_sped_target" name="sped_mode" style="margin: 4px 0;" disabled="disabled">
                                        <option value="off">`+__e["Select"]+`</option>
                                        <option id="optSpedplanet" `+planetSped+` value="planet">`+__e["Planet"]+`</option>
                                        ` + moonTarget + `
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div id="item_select" class="col-sm-3 lineHeight egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                            <div class="egs_col-sm-12 egs_modpadding egs_border_bottom-css fontalign"><span>`+__e["Select Item"]+`</span></div>
                            <div class="egs_col-sm-12 egs_modpadding">
                                <div class="egs_col-sm-12 egs_divfloat egs_modpadding fontFamily font14 fontalign">
                                    <select id="select_sped_item" name="sped_target" style="margin: 4px 0; width: 150px;" disabled="disabled"></select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="clear: both;"></div>`
                );
                



                $('#optionsForm').append(`
                        <div class="egs_col-sm-12 egs_modpadding">
                            <div style="clear:both;"></div>
                            <div id="seleziona_flottaguerra" class="egs_col-sm-6 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_border_bottom-css fontalign">
                                <div class="fontFamily"><span>`+__e["Select Warships"]+`</span></div>
                                <!--<div class="fontFamily font14" style="width:50%;float:left;">
                                    <label for="splitship">`+__e["Divide ship %/slots"]+`</label>
                                    <input id="splitship" name="split_ship" type="checkbox" value="on" `+splitShip+` />
                                </div>
                                <div class="fontFamily font14" style="width:50%;float:left;">
                                    <label for="selectallship">`+__e["Send found ships"]+`</label>
                                    <input id="selectallship" name="select_allship" type="checkbox" value="on" `+selectAllShip+` disabled="disabled"/>
                                </div>-->
                                <div class="fontFamily font14" style="width:100%;float:left;">
                                    <label for="selectallship">`+__e["Send & Divide found ships %/slots"]+`</label>
                                    <input id="selectallship" name="select_allship" type="checkbox" value="on" `+selectAllShip+` disabled="disabled"/>
                                </div>
                            </div>
                            <div id="seleziona_naviguerra" class="egs_col-sm-6 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                                <input id="bs_select" class="shipFlet" type="radio" data-toggle="toggle" value="bs-on" `+bsShipOn+` name="select_ship" style="opacity:0; position:absolute;" disabled="disabled"/>
                                <label for="bs_select">
                                    <div class="sprite_img bs-on bsship egs_col-sm-4_sh"></div>
                                </label> <input id="bc_select" class="shipFlet" type="radio" data-toggle="toggle" value="bc-on" `+bcShipOn+` name="select_ship" style="opacity:0; position:absolute;" disabled="disabled"/>
                                <label for="bc_select">
                                    <div class="sprite_img bc-on bcship egs_col-sm-4_sh"></div>
                                </label>
                                <input id="ds_select" class="shipFlet" type="radio" data-toggle="toggle" value="ds-on" `+dsShipOn+` name="select_ship" style="opacity:0; position:absolute;" disabled="disabled"/>
                                <label for="ds_select">
                                    <div class="sprite_img ds-on dsship egs_col-sm-4_sh"></div>
                                </label>
                                <input id="rp_select" class="shipFlet" type="radio" data-toggle="toggle" value="rp-on" `+rpShipOn+` name="select_ship" style="opacity:0; position:absolute;" disabled="disabled"/>
                                <label for="rp_select">
                                    <div class="sprite_img rp-on rpship egs_col-sm-4_sh"></div>
                                </label>
                                <input id="ship_selectOff" class="shipFlet" type="radio" value="off" `+fletShipOff+` name="select_ship" style="opacity:0; position:absolute;"/>
                            </div>
                        </div>
                    </div>
                    <div style="clear:both;"></div>`);

                
                var ogRulesTXT,show_rules,show_ship;
                switch(GMA.Options().ogame_rules){
                    case 'on':
                        ogRulesTXT = 'Aggiungi %';
                        show_rules = 'showRules';
                        break;
                    case 'off':
                        ogRulesTXT = 'N. cargo';
                        show_rules = '';
                        break;
                }
                switch(GMA.Options().active_ship){
                    case 'on':
                        show_ship = 'showShip';
                        break;
                    case 'off':
                        show_ship = '';
                        break;
                }
                var baseMaterieInfo = baseMaterie*speed_universe*2/1000000;
                var cargo_necessari, tipo_cargo;
                $('#optionsForm').append(`
                    <div class="egs_col-sm-12 egs_modpadding">
                        <div id="impostazioni_flotta" class="egs_col-sm-12 egs_modpadding egs_border_bottom-css">
                            <div id="select_custom_number_ship_type" class="col-sm-3 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                                <div class="egs_col-sm-12 egs_modpadding fontalign">
                                    <label for="active_numbership">`+__e["Fleet settings.."]+`</label>
                                    <input id="active_numbership" type="checkbox" class="active_ship_onoff" name="active_ship" value="on" `+active_ship_check+` data-toggle="toggle" style="margin: 0px 0px 0px 14px !important;height: 24px;width: 12px;">
                                </div>
                            </div>
                            <div id="custom_number_description" class="col-sm-3 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                                    <div class="egs_col-sm-12 egs_modpadding fontalign">
                                        <label for="ogame_rules">`+__e["Set cargo ship by rules"]+`</label>
                                        <input id="ogame_rules" class="active_ship_onoff" type="checkbox" value="on" `+ogameRules+` name="ogame_rules" style="margin: 0 !important;height: 24px;width: 12px;">
                                    </div>
                                </div>
                            <div id="select_range_onoffe" class="col-sm-3 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select" style="height: 20px;padding: 2px 0 !important;display: inline-block;">
                                <div class="egs_col-sm-12 egs_modpadding fontalign">
                                    <div class="egs_col-sm-6 egs_modpadding fontalign" style="float:left;">
                                        <select id="rangechoords" name="range_coords">
                                            <option id="rc_off" `+rcOff+` value="off">`+__e["Current"]+`</option>
                                            <option id="range" `+rangeSelected+` value="range">Range</option>
                                            <option id="custom" `+choordsCustom+` value="custom">`+__e["Custom"]+`</option>
                                        </select>
                                    </div>
                                    <div class="egs_col-sm-6 egs_modpadding fontalign" style="float:right;">
                                        <div class="rc_text" style="text-align: right;">Range/Coord.</div>
                                        <input id="rangeSped" style="height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="range_sped" type="number" min="1" max="499" value="`+rangeSped+`" name="range_sped">
                                        <input id="customChoords" placeholder="es:110,111,112" style="height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important; width: 50px;" class="range_sped" type="text" value="`+customChoords+`" name="customChoords">
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div class="egs_col-sm-12 modpadding">
                        <div id="info_rules" class="hideRules `+show_rules+` egs_col-sm-12 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div select">
                            <div  style="padding: 4px 2px 8px;">
                                <strong style="font-weight:900;">`+__e["Attention"]+`</strong>: `+__e["in this universe, according to the rules of ogame, you can find a maximum of"]+` <strong style="font-weight:900;">`+baseMaterieInfo+`kk</strong> `+__e["of materials"]+`,<br>
                                `+__e["a number of cargoes needed with maximum hold for that quantity of materials will be sent."]+`<br>
                                `+__e['If you do not have the availability of the cargo number,<br>disable the "Set cargo according to regulation", and set the n. manually.']+`
                            </div>
                        </div>
                    </div>
                    <div style="clear:both;"></div>
                    <div class="egs_col-sm-12 egs_modpadding">
                        <div id="seleziona_navicivili" class="hideShip `+show_ship+` egs_col-sm-12 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                            <div class="egs_col-sm-5 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                                <div class="civil_img cacciaL_on cacciaLship egs_col-sm-4_sh"></div>
                                <div class="options_select">
                                    <label for="cacciaL_select">`+__e["Small ship"]+`</label>
                                    <input id="cacciaL_select" class="civilFlet" type="checkbox" value="on" `+active_cl+` name="caccia_leggero">
                                    <label for="cacciaL_numslot">`+__e["Set Number"]+`</label>
                                    <input id="cacciaL_numslot" class="civilFlet" type="checkbox" value="on" `+active_cl_ns+` name="caccia_leggero_numslot">
                                    <input id="cacciaL_number" style="width: 75px;float: left;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" type="number" min="1" value="`+active_cl_num+`" name="caccia_leggero_num">
                                </div>
                            </div>
                            <div class="egs_col-sm-5 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                                <div class="civil_img cargL_on cargLship egs_col-sm-4_sh"></div>
                                <div class="options_select">
                                    <label for="cargL_select">`+__e["Small cargo"]+`</label>
                                    <input id="cargL_select" class="civilFlet" type="checkbox" value="on" `+active_crl+` name="cargo_leggero">
                                    <label for="cargL_numslot">`+__e["Add %"]+`</label>
                                    <input id="cargL_numslot" class="civilFlet" type="checkbox" value="on" `+active_crl_ns+` name="cargo_leggero_numslot">
                                    <input id="cargL_number" style="width: 75px;float: left;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" type="number" min="1" value="`+active_crl_num+`" name="cargo_leggero_num">
                                </div>
                            </div>
                            <div class="egs_col-sm-5 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                                <div class="civil_img cargP_on cargPship egs_col-sm-4_sh"></div>
                                <div class="options_select">
                                    <label for="cargP_select">`+__e["Large cargo"]+`</label>
                                    <input id="cargP_select" class="civilFlet" type="checkbox" value="on" `+active_cp+` name="cargo_pesante">
                                    <label for="cargP_numslot">`+__e["Add %"]+`</label>
                                    <input id="cargP_numslot" class="civilFlet" type="checkbox" value="on" `+active_cp_ns+` name="cargo_pesante_numslot">
                                    <input id="cargP_number" style="width: 75px;float: left;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" type="number" min="1" value="`+active_cp_num+`" name="cargo_pesante_num">
                                </div>
                            </div>
                            <div class="egs_col-sm-5 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                                <div class="civil_img rip_on ripship egs_col-sm-4_sh"></div>
                                <div class="options_select">
                                    <label for="rip_select">Rip</label>
                                    <input id="rip_select" class="civilFlet" type="checkbox" value="on" `+active_rip+` name="rip">
                                    <label for="rip_numslot">`+__e["Set Number"]+`</label>
                                    <input id="rip_numslot" class="civilFlet" type="checkbox" value="on" `+active_rip_ns+` name="rip_numslot">
                                    <input id="rip_number" style="width: 75px;float: left;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" type="number" min="1" value="`+active_rip_num+`" name="rip_num">
                                </div>
                            </div>
                            <div class="egs_col-sm-5 egs_divfloat egs_border_right egs_lineargradient1 egs_function_div egs_modpadding select">
                                <div id="combat_Ship" class="civil_img ship_`+combatShip+` egs_col-sm-4_sh"></div>
                                <div class="options_select">
                                    <label for="combatShip_select">`+combatShip_name+`</label>
                                    <input id="combatShip_select" class="civilFlet" type="checkbox" value="on" `+active_nb+` name="combatShip">
                                    <label for="combatShip_numslot">`+__e["Set Number"]+`</label>
                                    <input id="combatShip_numslot" class="civilFlet" type="checkbox" value="on" `+active_nb_ns+` name="combatShip_numslot">
                                    <input id="combatShip_number" style="width: 75px;float: left;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" type="number" min="1" value="`+active_nb_num+`" name="combatShip_num">
                                </div>
                            </div>
                        </div>
                    </div>`
                );
                
                // sezione deuterio 
                $('#optionsForm').append(`
                    <div style="clear:both;"></div>
                    <div class="egs_col-sm-12 egs_modpadding">
                        <div id="impostazioni_deuterio" class="egs_col-sm-12 egs_modpadding egs_border_bottom-css egs_lineargradient1">
                            <label for="active_deu">:: `+__e["Set dueterio"]+` :: `+__e["block shipments if less than"]+`:</label>
                            <input id="active_deu" type="checkbox" class="active_deu_onoff" name="active_deu" value="on" `+active_deu_check+` data-toggle="toggle" style="margin: 0px 0px 0px 14px !important;height: 24px;width: 12px;">
                            <input id="deu_number" style="width: 94px;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" `+active_deuNum_check+` type="number" min="1" value="`+deu_min+`" name="deu_sped">
                        </div>
                    </div>`);
                $('input[name="range_sped"]').bind("change paste keyup", function() {
                    setTimeout(function(){
                        rangeSpedArray();
                    },1000)
                });
                $('input[name="customChoords"]').bind("change paste keyup", function() {
                    $('#customChoords').removeClass('redBoxSH');
                    setTimeout(function(){
                        customSpedArray();
                    },1000)
                });
                if($('#characterclass > a > div').hasClass('warrior')){
                    var divCol = 5;
                    var divPix = 166;
                    var pathView = 'block';
                    var borderRight = 'egs_border_right';
                } else {
                    divCol = 4;
                    divPix = 196;
                    pathView = 'none';
                    borderRight = '';
                }
                var pathFinderPerc = (GMA.Options().pathfinder_perc)?GMA.Options().pathfinder_perc:'';

                // sezione pathfinder e notturno
                $('#optionsForm').append(`
                    <div style="clear:both;"></div>
                    <div class="egs_col-sm-12 egs_modpadding">
                        <div id="impostazioni_path" class="egs_col-sm-12 egs_modpadding egs_border_bottom-css egs_lineargradient1">
                            <label for="active_pathfinder">`+__e["Set number of Pathfinder"]+`:</label>
                            <input id="active_pathfinder" type="checkbox" class="active_pathfinder_onoff" name="active_pathfinder" value="on" `+active_pathfinder_check+` data-toggle="toggle" style="margin: 0px 0px 0px 14px !important;height: 24px;width: 12px;">
                            <input id="path_number" style="width: 94px;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" `+active_pathNum_check+` type="number" min="1" value="`+path_number+`" name="path_number">
                            (`+__e["standard settings"]+` = 1)
                        </div>
                    </div>`);
                $('#optionsForm').append(`
                    <div style="clear:both;"></div>
                    <div class="egs_col-sm-12 egs_modpadding">
                        <div id="impostazioni_sonde" class="egs_col-sm-12 egs_modpadding egs_border_bottom-css egs_lineargradient1">
                            <label for="active_sonde">`+__e["Set number of espionage probe"]+`:</label>
                            <input id="active_sonde" type="checkbox" class="active_sonde_onoff" name="active_sonde" value="on" `+active_sonde_check+` data-toggle="toggle" style="margin: 0px 0px 0px 14px !important;height: 24px;width: 12px;">
                            <input id="sonde_number" style="width: 94px;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" `+active_sondeNum_check+` type="number" min="1" value="`+sonde_number+`" name="sonde_number">
                            (`+__e["standard settings"]+` = 1)
                        </div>
                    </div>`);


                $('#optionsForm').append(`
                    <div style="clear:both;"></div>
                    <div class="egs_col-sm-12 egs_modpadding">
                        <div id="impostazioni_notturno" class="egs_col-sm-6 egs_modpadding egs_divfloat egs_border_right egs_border_bottom-css egs_lineargradient1" style="min-height: 20px;">
                            <label for="active_notturno">`+__e["Night Start / End"]+`:</label>
                            <input id="active_notturno" type="checkbox" class="active_notturno_onoff" name="active_notturno" value="on" `+active_notturno_check+` data-toggle="toggle" style="margin: 0px 0px 0px 14px !important;height: 24px;width: 12px;">
                            <input id="oraioNotturno" style="width: 80px;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" `+active_orarioNotturno_check+` type="text" value="`+orario_notturno+`" name="orario_notturno">
                        </div>
                        <div id="impostazioni_notturno_fine" style="padding: 2px 0 !important;min-height: 20px;" class="egs_col-sm-4 egs_modpadding egs_divfloat egs_border_right egs_border_bottom-css egs_lineargradient1" style="min-height: 20px;">
                            <input id="orarioFineNotturno" style="width: 80px;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" `+active_orarioNotturno_check+` type="text" value="`+orario_fine_notturno+`" name="orario_fine_notturno">
                        </div>
                        <div id="impostazioni_percentualeflotta" style="padding: 2px 0 !important;min-height: 20px;" class="egs_col-sm-4 egs_modpadding egs_divfloat egs_border_bottom-css egs_lineargradient1">
                            <label for="percentualeFlotta">`+__e["% ship"]+`:</label>
                            <input id="percentualeFlotta" style="width: 50px;margin-left: 8px;height: 11px;line-height: 18px;font-size: 12px;text-align: center;-webkit-appearance: none!important;" class="civilFlet" `+percentuale_flotta_check+` type="text" value="`+percentuale_flotta+`" name="percentualeflotta">
                        </div>
                    </div>`);
                                
                $('#optionsForm :input').on('change', function(){
                    var optArray = GMA.Options();
                    if($(this).attr('type') === 'radio' || $(this).attr('type') === 'checkbox' ){
                        if($(this).prop('checked')){
                            var valUpdate = $(this).val();
                            var varUpdate = $(this).attr('name');
                            GMUP.opts(varUpdate, valUpdate);
                        } else {
                            valUpdate = 'off';
                            varUpdate = $(this).attr('name');
                            GMUP.opts(varUpdate, valUpdate);
                        }
                    } else {
                        valUpdate = $(this).val();
                        varUpdate = $(this).attr('name');
                        GMUP.opts(varUpdate, valUpdate);
                    };
                });

                var selectData = 'select_item';
                var iTemSelect = 'item';
                var offSelect = 'item-select';



                switch(rcSelect){
                    case 'range':
                        var rangeSelected = 'selected';
                        var choordsSelected = '';
                        var customChoords = '';
                        var rcOff = '';
                        $('#rangeSped').show();
                        $('#customChoords').hide();
                        $('.rc_text').hide();
                        break;
                    case 'custom':
                        var rangeSelected = '';
                        var choordsSelected = '';
                        var customChoords = 'selected';
                        var rcOff = '';
                        $('#rangeSped').hide();
                        $('#customChoords').show();
                        $('.rc_text').hide();
                        break;
                    case 'off':
                        var rangeSelected = '';
                        var choordsSelected = '';
                        var customChoords = '';
                        var rcOff = 'selected';
                        $('#rangeSped').hide();
                        $('#customChoords').hide();
                        $('.rc_text').show();
                        break;
                }
                //
                //
                //
                // SISTEMA SPEDIZIONI ////////////////////////////////////////////////////////////////////////////////////////////
                // sistema on off e target
                // variabili funzione select
                if($('#spedizioni_active').is(":checked")){
                    setTimeout(function(){
                        if(GMA.Options().sped_mode !== 'off'){
                            $('#select_sped_item').removeAttr('disabled');
                        }
                        $('#select_sped_target').removeAttr('disabled');
                        $('#sped_fletdef').removeAttr('disabled');
                        $('#sped_fletdefOff').removeAttr('disabled');
                        $('#defTarget,  #set_target_def, #set_def_target').removeAttr('disabled');
                        // sezione spedizione flotta

                        $(' #bs_select, #bc_select, #ds_select, #rp_select, #rip_select, #rip_select, #rip_select, #rip_select, #rip_select, #selectallship, #splitship').removeAttr('disabled');
                        $('.sprite_img').removeClass('shipDisable');
                        if(GMA.Options().sped_mode_ship !== 'off'){
                            $('#sped_select_sped_item_ship').removeAttr('disabled');
                        }
                        $('#active_deu, #active_pathfinder, #active_sonde, #active_notturno').removeAttr('disabled');
                        if(GMA.Options().active_ship === 'on'){
                            $('#seleziona_navicivili').addClass('showShip');
                            $('#active_numbership').removeAttr('disabled');
                        }
                        //$('#range_onoff').removeAttr('disabled');

                        if(GMA.Options().range_onoff == 'on'){
                            $('#range_sped').removeAttr('disabled');
                        }
                        if(GMA.Options().active_deu == 'on'){
                            $('#deu_number').removeAttr('disabled');
                        }
                        if(GMA.Options().active_pathfinder == 'on'){
                            $('#path_number').removeAttr('disabled');
                        }
                        if(GMA.Options().active_sonde == 'on'){
                            $('#sonde_number').removeAttr('disabled');
                        }
                        if(GMA.Options().active_notturno === 'on'){
                            $('#oraioNotturno,#orarioFineNotturno,#percentualeFlotta,#active_opzioni').removeAttr('disabled');
                            if(GMA.Options().notturno_opt_onoff === 'on'){
                                $('#opzioniSelectNotturno').removeAttr('disabled');
                            }
                        }


                        $('#rangechoords').removeAttr('disabled');
                        switch($('#rangechoords').val()){
                            case 'range':
                                $('#rangeSped').removeAttr('disabled').show();
                                $('#customChoords').removeAttr('disabled').hide();
                                $('.rc_text').hide();
                                break;
                            case 'custom':
                                $('#customChoords').removeAttr('disabled').show();
                                $('#rangeSped').removeAttr('disabled').hide();
                                $('.rc_text').hide();
                                break;
                            case 'off':
                                $('#rangeSped').removeAttr('disabled').hide();
                                $('#customChoords').removeAttr('disabled').hide();
                                $('.rc_text').show();
                                break;
                        }


                        if($('#sped_fletdef').is(":checked")){
                            $('#sped_select_target').removeAttr('disabled');
                            $('#sped_select_sped_item').removeAttr('disabled');
                        }
                        $('#defTarget,  #set_target_def, #set_def_target').removeAttr('disabled');
                        var selectData = 'select_sped_item';
                        var iTemSelect = 'itemSped';
                        var offSelect = 'item-sped-select';
                        var target_sped_selectDB = GMA.Options().sped_mode;
                        var ID_playerDB = ID_player;
                        var itemSelectSped = itemSped;
                        var selectOffTaregt = __e["Select Item"];
                        if(GMA.Options().sped_mode === 'planet' ||  GMA.Options().sped_mode === 'moon'){
                            constructOptions(target_sped_selectDB, ID_playerDB, itemSelectSped, selectData, iTemSelect, offSelect, selectOffTaregt);
                        }
                    },200)
                } else {
                    $('#select_sped_target').attr('disabled', 'disabled');
                    $('#select_sped_item').attr('disabled', 'disabled');
                    $('#sped_fletdef').attr('disabled', 'disabled');
                    $('#sped_fletdefOff').attr('disabled', 'disabled');
                    $('#sped_select_target').attr('disabled', 'disabled');
                    $('#sped_select_sped_item').attr('disabled', 'disabled');
                    // sezione spedizione flotta
                    $(' #bs_select, #bc_select, #ds_select, #rp_select, #rip_select, #rip_select, #rip_select, #rip_select, #rip_select, #selectallship, #splitship').attr('disabled', 'disabled');
                    $('.sprite_img').addClass('shipDisable');
                    $('#sped_select_sped_item_ship').attr('disabled', 'disabled');
                    $('#defTarget,  #set_target_def, #set_def_target, #active_numbership, #active_notturno, #oraioNotturno, #orarioFineNotturno, #percentualeFlotta, #active_opzioni').attr('disabled', 'disabled');
                    $('#seleziona_navicivili').removeClass('showShip');
                    $('#rangechoords').attr('disabled', 'disabled');
                    $('#range_sped').attr('disabled', 'disabled');
                    $('#rangeSped').attr('disabled', 'disabled');
                    $('#customChoords').attr('disabled', 'disabled');
                    $('#active_deu, #active_pathfinder, #active_sonde').attr('disabled', 'disabled');
                    $('#deu_number, #path_number, #sonde_number').attr('disabled', 'disabled');
                };
                $('#spedizioni_active').change(function(){
                    if($(this).is(":checked")){
                        $('#sped_fletdef').removeAttr('disabled');
                        $('#sped_fletdefOff').removeAttr('disabled');
                        $('#defTarget,  #set_target_def, #set_def_target').removeAttr('disabled');
                        // sezione spedizione flotta
                        if(GMA.Options().active_deu === 'on'){
                            $('#deu_number').removeAttr('disabled');
                        } else {
                            $('#deu_number').attr('disabled', 'disabled');
                        }
                        if(GMA.Options().active_pathfinder === 'on'){
                            $('#path_number').removeAttr('disabled');
                        } else {
                            $('#path_number').attr('disabled', 'disabled');
                        }
                        if(GMA.Options().active_sonde === 'on'){
                            $('#sonde_number').removeAttr('disabled');
                        } else {
                            $('#sonde_number').attr('disabled', 'disabled');
                        }
                        if(GMA.Options().active_notturno === 'on'){
                            $('#oraioNotturno, #orarioFineNotturno, #percentualeFlotta, #active_opzioni').removeAttr('disabled');
                            if(GMA.Options().notturno_opt_onoff === 'on'){
                                $('#opzioniSelectNotturno').removeAttr('disabled');
                            }
                        } else {
                            $('#oraioNotturno, #orarioFineNotturno, #percentualeFlotta, #active_opzioni').attr('disabled');
                            $('#opzioniSelectNotturno').attr('disabled', 'disabled');
                        }
                        if(GMA.Options().active_notturno === 'on'){
                            $('#percentualeFlotta').removeAttr('disabled');
                        } else {
                            $('#percentualeFlotta').attr('disabled', 'disabled');
                        }
                        $(' #bs_select, #bc_select, #ds_select, #rp_select, #rip_select, #rip_select, #rip_select, #rip_select, #selectallship, #splitship, #active_numbership, #active_de').removeAttr('disabled');
                        $('.sprite_img').removeClass('shipDisable');
                        if(GMA.Options().sped_mode_ship !== ''){
                            $('#sped_select_sped_item_ship').removeAttr('disabled');
                        }
                        $('#active_deu, #active_pathfinder, #active_sonde').removeAttr('disabled');
                        $('#active_notturno').removeAttr('disabled');
                        $('#rangechoords').removeAttr('disabled');
                        switch($('#rangechoords').val()){
                            case 'range':
                                $('#rangeSped').removeAttr('disabled').show();
                                $('#customChoords').removeAttr('disabled').hide();
                                $('.rc_text').hide();
                                break;
                            case 'custom':
                                $('#customChoords').removeAttr('disabled').show();
                                $('#rangeSped').removeAttr('disabled').hide();
                                $('.rc_text').hide();
                                break;
                            case 'off':
                                $('#rangeSped').removeAttr('disabled').hide();
                                $('#customChoords').removeAttr('disabled').hide();
                                $('.rc_text').show();
                                break;
                        }
                        if($('#sped_fletdef').is(":checked")){
                            $('#sped_select_target').removeAttr('disabled');
                            $('#sped_select_sped_item').removeAttr('disabled');
                        }
                        if(GMA.Options().range_onoff === 'on'){
                            $('#range_sped').removeAttr('disabled');
                        }
                        if(GMA.Options().active_ship === 'on'){
                            $('#seleziona_navicivili').addClass('showShip');
                        }
                        $('#select_sped_target').removeAttr('disabled');
                        if(GMA.Options().sped_mode !== 'off'){
                            $('#select_sped_item').removeAttr('disabled');
                        }
                        $('#select_sped_target').val(GMA.Options().sped_mode);
                        if($('#select_sped_target').val() === 'planetRnd' || $('#select_sped_target').val() === 'moonRnd'){
                            $('#select_sped_item').attr('disabled', 'disabled');
                        } else if($('#select_sped_target').val() !== 'planetRnd' || $('#select_sped_target').val() !== 'moonRnd'){
                            if(GMA.Options().sped_mode !== 'off'){
                                $('#select_sped_item').removeAttr('disabled');
                            }
                            var selectDataSpedItem = 'select_sped_item';
                            var spediTemSelect = 'itemSped';
                            var offSelectSpedItem = 'item-sped-select';
                            var targetSped_selectDB = GMA.Options().sped_mode;
                            var ID_playerDB = ID_player;
                            var itemSelectSpedItem = itemSped;
                            var selectOffTaregt = __e["Select Item"];
                            
                            constructOptions(targetSped_selectDB, ID_playerDB, itemSelectSpedItem, selectDataSpedItem, spediTemSelect, offSelectSpedItem, selectOffTaregt);
                        }
                    } else {
                        $('#select_sped_target').attr('disabled', 'disabled');
                        $('#select_sped_item').attr('disabled', 'disabled');
                        $('#sped_fletdef').attr('disabled', 'disabled');
                        $('#sped_fletdefOff').attr('disabled', 'disabled');
                        $('#sped_select_target').attr('disabled', 'disabled');
                        $('#sped_select_sped_item').attr('disabled', 'disabled');
                        // sezione spedizione flotta
                        $(' #bs_select, #bc_select, #ds_select, #rp_select, #rip_select, #rip_select, #rip_select, #selectallship, #splitship').attr('disabled', 'disabled');
                        $('.sprite_img').addClass('shipDisable');
                        $('#sped_select_sped_item_ship').attr('disabled', 'disabled');
                        $('#defTarget,  #set_target_def, #set_def_target, #active_numbership, #active_notturno, #oraioNotturno, #orarioFineNotturno, #percentualeFlotta, #active_opzioni').attr('disabled', 'disabled');
                        $('#opzioniSelectNotturno').attr('disabled', 'disabled');
                        $('#seleziona_navicivili').removeClass('showShip');
                        $('#rangechoords').attr('disabled', 'disabled');
                        $('#range_sped').attr('disabled', 'disabled');
                        $('#rangeSped').attr('disabled', 'disabled');
                        $('#rangeChoords').attr('disabled', 'disabled');
                        $('#customChoords').attr('disabled', 'disabled');
                        $('#active_deu, #active_pathfinder, #active_sonde').attr('disabled', 'disabled');
                        $('#deu_number, #path_number, #sonde_number').attr('disabled', 'disabled');
                    }
                });
                $('#select_sped_target').change(function(){
                    if($(this).val() == 'planetRnd' || $(this).val() == 'moonRnd'){
                        $('#select_sped_item').attr('disabled', 'disabled');
                    } else if($(this).val() !== 'planetRnd' || $(this).val() !== 'moonRnd'){
                        $('#select_sped_item').removeAttr('disabled');
                        var selectData = 'select_sped_item';
                        var iTemSelect = 'itemSped';
                        var offSelect = 'item-sped-select';
                        var target_sped_selectDB = $('#select_sped_target').val();
                        var ID_playerDB = ID_player;
                        var itemSelectSped = itemSped;
                        var selectOffTaregt = __e["Select Item"];
                        
                        constructOptions(target_sped_selectDB, ID_playerDB, itemSelectSped, selectData, iTemSelect, offSelect, selectOffTaregt);
                    }
                    if($(this).val() === 'off'){
                        $('#select_sped_item').attr('disabled', 'disabled');
                    }
                });
                if(GMA.Options().sped_mode === 'planet' ||  GMA.Options().sped_mode === 'moon'){
                    var selectData = 'select_sped_item';
                    var iTemSelect = 'itemSped';
                    var offSelect = 'item-sped-select';
                    var target_sped_selectDB = GMA.Options().sped_mode;
                    var ID_playerDB = ID_player;
                    var itemSelectSped = itemSped;
                    var selectOffTaregt = __e["Select Item"];
                    
                    constructOptions(target_sped_selectDB, ID_playerDB, itemSelectSped, selectData, iTemSelect, offSelect, selectOffTaregt);
                }
                var selectDataSpedItem = 'select_sped_item';
                var spediTemSelect = 'itemSped';
                var offSelectSpedItem = 'item-sped-select';
                var targetSped_selectDB = GMA.Options().sped_mode;
                var ID_playerDB = ID_player;
                var itemSelectSpedItem = itemSped;
                var selectOffTaregt = __e["Select Item"];
                
                constructOptions(targetSped_selectDB, ID_playerDB, itemSelectSpedItem, selectDataSpedItem, spediTemSelect, offSelectSpedItem, selectOffTaregt);
                if(GMA.Options().sped_mode === ''){
                    $('#select_sped_item').attr('disabled', 'disabled');
                }
                $('#select_sped_item').change(function(){
                    if(GMA.Options().range_coords === 'choords' || GMA.Options().range_coords === 'custom'){
                        $('#customChoords').addClass('redBoxSH');
                    } else {
                        $('#customChoords, #rangeChoords').removeClass('redBoxSH');
                    }
                    setTimeout(function(){
                        SPD.rangeSpedArray();
                    },1000);
                });
                // variabili funzione select return to rarget
                $('#sped_fletdef').click(function(){
                    if($(this).is(":checked")){
                        $('#sped_select_target').removeAttr('disabled');
                        if(GMA.Options().sped_def_mode !== ''){
                            $('#sped_select_sped_item').removeAttr('disabled');
                        }
                    } else {
                        $('#sped_select_target').attr('disabled', 'disabled');
                        $('#sped_select_sped_item').attr('disabled', 'disabled');
                    }
                });
                if($('#sped_fletdefOff').is(":checked")){
                    $('#sped_select_target').attr('disabled', 'disabled');
                    $('#sped_select_sped_item').attr('disabled', 'disabled');
                };
                $('#sped_select_target').change(function(){
                    
                    
                    if($(this).val() !== ''){
                    $('#sped_select_sped_item').removeAttr('disabled');
                        var selectDataReturn = 'sped_select_sped_item';
                        var iTemSelectReturn = 'sped_item';
                        var offSelectReturn = 'sped_item-select';
                        var target_sped_selectDBRet = $(this).val();
                        var ID_playerDBRet = ID_player;
                        var itemSelectSpedRet = sped_def_target;
                        var selectOffTaregtRet = __e["Select Item"];
                        constructOptions(target_sped_selectDBRet, ID_playerDBRet, itemSelectSpedRet, selectDataReturn, iTemSelectReturn, offSelectReturn, selectOffTaregtRet);
                    } else {
                        $('#sped_select_sped_item').attr('disabled', 'disabled');
                    }
                });
                var selectDataReturn = 'sped_select_sped_item';
                var iTemSelectReturn = 'sped_item';
                var offSelectReturn = 'sped_item-select';
                var target_sped_selectDBRet = sped_def_mode;
                var ID_playerDBRet = ID_player;
                var itemSelectSpedRet = sped_def_target;
                var selectOffTaregtRet = __e["Select Item"];
                constructOptions(target_sped_selectDBRet, ID_playerDBRet, itemSelectSpedRet, selectDataReturn, iTemSelectReturn, offSelectReturn, selectOffTaregtRet);
                if(GMA.Options().sped_def_mode === ''){
                    $('#sped_select_sped_item').attr('disabled', 'disabled');
                }


                // variabili funzione select flotta da guerra ////////////////////////////////////////////////////////////////////////////
                // funzione spedizione flotta on off
                $(".shipFlet").on("click", function(){
                    var optArray = GMA.Options();
                    if($(this).val() == shipStat){
                        $('input[name=select_ship][value=off]').prop("checked",true);
                        shipStat = "off";
                        $("label[for='combatShip_select']").text('Off');
                        $('#combat_Ship').addClass('ship_combatoff');
                        combatShip = 'combatoff';
                        combatShip_name = 'combatoff';
                        combatShip_num = 'combatoff';
                        var valUpdate = shipStat;
                        var varUpdate = $(this).attr('name');
                        GMUP.opts(varUpdate, valUpdate);
                        $(".sprite_img").removeClass('select_ship');
                    } else {
                        shipStat = $(this).val();
                    }
                });
                if($("#bs_select").is(":checked")){
                    $('.bsship').addClass('select_ship');
                }
                if($("#bc_select").is(":checked")){
                    $('.bcship').addClass('select_ship');
                }
                if($("#ds_select").is(":checked")){
                    $('.dsship').addClass('select_ship');
                }
                if($("#rp_select").is(":checked")){
                    $('.rpship').addClass('select_ship');
                }

                // check numero caccini / attivazione disattivazione
                if(GMA.Options().caccia_leggero !== 'on'){
                    $('#cacciaL_numslot').attr('disabled', 'disabled');
                    $('#cacciaL_number').attr('disabled', 'disabled');
                } else if(GMA.Options().caccia_leggero === 'on'){
                    $('#cacciaL_numslot').removeAttr('disabled');
                    if(GMA.Options().caccia_leggero_numslot === 'on'){
                        $('#cacciaL_number').removeAttr('disabled');
                    } else {
                        $('#cacciaL_number').attr('disabled', 'disabled');
                    }
                }
                $('#cacciaL_select').change(function(){
                    if($(this).is(":checked")){
                        $('#cacciaL_numslot').removeAttr('disabled');
                        if(GMA.Options().caccia_leggero_numslot === 'on'){
                            $('#cacciaL_number').removeAttr('disabled');
                        } else {
                            $('#cacciaL_number').attr('disabled', 'disabled');
                        }
                    } else {
                        $('#cacciaL_numslot').attr('disabled', 'disabled');
                        $('#cacciaL_number').attr('disabled', 'disabled');
                    }
                })
                $('#cacciaL_numslot').change(function(){
                    if($(this).is(":checked")){
                        $('#cacciaL_number').removeAttr('disabled');
                    } else {
                        $('#cacciaL_number').attr('disabled', 'disabled');
                    }
                })
                // check numero carghini / attivazione disattivazione
                if(GMA.Options().cargo_leggero !== 'on'){
                    $('#cargL_numslot').attr('disabled', 'disabled');
                    $('#cargL_number').attr('disabled', 'disabled');
                } else if(GMA.Options().cargo_leggero === 'on'){
                    $('#cargL_numslot').removeAttr('disabled');
                    if(GMA.Options().cargo_leggero_numslot === 'on'){
                        $('#cargL_number').removeAttr('disabled');
                    } else {
                        $('#cargL_number').attr('disabled', 'disabled');
                    }
                }
                $('#cargL_select').change(function(){
                    if($(this).is(":checked")){
                        $('#cargL_numslot').removeAttr('disabled');
                        if(GMA.Options().cargo_leggero_numslot === 'on'){
                            $('#cargL_number').removeAttr('disabled');
                        } else {
                            $('#cargL_number').attr('disabled', 'disabled');
                        }
                    } else {
                        $('#cargL_numslot').attr('disabled', 'disabled');
                        $('#cargL_number').attr('disabled', 'disabled');
                    }
                })
                $('#cargL_numslot').change(function(){
                    if($(this).is(":checked")){
                        $('#cargL_number').removeAttr('disabled');
                    } else {
                        $('#cargL_number').attr('disabled', 'disabled');
                    }
                })
                // check numero cargoni / attivazione disattivazione
                if(GMA.Options().cargo_pesante !== 'on'){
                    $('#cargP_numslot').attr('disabled', 'disabled');
                    $('#cargP_number').attr('disabled', 'disabled');
                } else if(GMA.Options().cargo_pesante === 'on'){
                    $('#cargP_numslot').removeAttr('disabled');
                    if(GMA.Options().cargo_pesante_numslot === 'on'){
                        $('#cargP_number').removeAttr('disabled');
                    } else {
                        $('#cargP_number').attr('disabled', 'disabled');
                    }
                }
                $('#cargP_select').change(function(){
                    if($(this).is(":checked")){
                        $('#cargP_numslot').removeAttr('disabled');
                        if(GMA.Options().cargo_pesante_numslot === 'on'){
                            $('#cargP_number').removeAttr('disabled');
                        } else {
                            $('#cargP_number').attr('disabled', 'disabled');
                        }
                    } else {
                        $('#cargP_numslot').attr('disabled', 'disabled');
                        $('#cargP_number').attr('disabled', 'disabled');
                    }
                })
                $('#cargP_numslot').change(function(){
                    if($(this).is(":checked")){
                        $('#cargP_number').removeAttr('disabled');
                    } else {
                        $('#cargP_number').attr('disabled', 'disabled');
                    }
                })
                // check numero RIP / attivazione disattivazione
                if(GMA.Options().rip !== 'on'){
                    $('#rip_numslot').attr('disabled', 'disabled');
                    $('#rip_number').attr('disabled', 'disabled');
                } else if(GMA.Options().rip === 'on'){
                    $('#rip_numslot').removeAttr('disabled');
                    if(GMA.Options().rip_numslot === 'on'){
                        $('#rip_number').removeAttr('disabled');
                    } else {
                        $('#rip_number').attr('disabled', 'disabled');
                    }
                }
                $('#rip_select').change(function(){
                    if($(this).is(":checked")){
                        $('#rip_numslot').removeAttr('disabled');
                        if(GMA.Options().rip_numslot === 'on'){
                            $('#rip_number').removeAttr('disabled');
                        } else {
                            $('#rip_number').attr('disabled', 'disabled');
                        }
                    } else {
                        $('#rip_numslot').attr('disabled', 'disabled');
                        $('#rip_number').attr('disabled', 'disabled');
                    }
                })
                $('#rip_numslot').change(function(){
                    if($(this).is(":checked")){
                        $('#rip_number').removeAttr('disabled');
                    } else {
                        $('#rip_number').attr('disabled', 'disabled');
                    }
                })
                // check numero navi da guerra / attivazione disattivazione
                if(GMA.Options().combatShip !== 'on'){
                    $('#combatShip_numslot').attr('disabled', 'disabled');
                    $('#combatShip_number').attr('disabled', 'disabled');
                } else if(GMA.Options().combatShip === 'on'){
                    $('#combatShip_numslot').removeAttr('disabled');
                    if(GMA.Options().combatShip_numslot === 'on'){
                        $('#combatShip_number').removeAttr('disabled');
                    } else {
                        $('#combatShip_number').attr('disabled', 'disabled');
                    }
                }
                $('#combatShip_select').change(function(){
                    if($(this).is(":checked")){
                        $('#combatShip_numslot').removeAttr('disabled');
                        if(GMA.Options().combatShip_numslot === 'on'){
                            $('#combatShip_number').removeAttr('disabled');
                        } else {
                            $('#combatShip_number').attr('disabled', 'disabled');
                        }
                    } else {
                        $('#combatShip_numslot').attr('disabled', 'disabled');
                        $('#combatShip_number').attr('disabled', 'disabled');
                    }
                })
                $('#combatShip_numslot').change(function(){
                    if($(this).is(":checked")){
                        $('#combatShip_number').removeAttr('disabled');
                    } else {
                        $('#combatShip_number').attr('disabled', 'disabled');
                    }
                })

                
                $('#active_numbership').on('change', function(){
                    if($(this).is(":checked")){
                        $('#seleziona_navicivili').addClass('showShip');
                    } else {
                        $('#seleziona_navicivili').removeClass('showShip');
                    }
                })
                $(".shipFlet").change(function(){
                    $(".sprite_img").removeClass('select_ship');
                    var selFlet = $(this).val();
                    //
                    $('.'+selFlet).addClass('select_ship');
                    $('.civil_img').removeClass (function (index, className) {
                        return (className.match (/(^|\s)ship\S+/g) || []).join(' ');
                    });
                    switch(selFlet){
                        case 'bs-on':
                            combatShip = 'battleShip';
                            combatShip_name = 'Nave bat.';
                            combatShip_num = 'battle_ship';
                            $("label[for='combatShip_select']").text('Nave bat.');
                            $('#combat_Ship').addClass('ship_battleShip');
                            break;
                        case 'bc-on':
                            combatShip = 'battleCruise';
                            combatShip_name = 'Incro bat.';
                            combatShip_num = 'battle_cruise';
                            $("label[for='combatShip_select']").text('Incro bat.');
                            $('#combat_Ship').addClass('ship_battleCruise');
                            break;
                        case 'ds-on':
                            combatShip = 'destroyer';
                            combatShip_name = 'Corazzate';
                            combatShip_num = 'destroyer';
                            $("label[for='combatShip_select']").text('Corazzate');
                            $('#combat_Ship').addClass('ship_destroyer');
                            break;
                        case 'rp-on':;
                            combatShip = 'reaper';
                            combatShip_name = 'Reaper';
                            combatShip_num = 'reaper';
                            $("label[for='combatShip_select']").text('Reaper');
                            $('#combat_Ship').addClass('ship_reaper');
                            break;
                        case 'rip-on':;
                            combatShip = 'rip';
                            combatShip_name = 'Rip';
                            combatShip_num = 'rip';
                            $("label[for='combatShip_select']").text('Rip');
                            $('#combat_Ship').addClass('ship_rip');
                            break;
                        case 'off':
                            combatShip = 'combatoff';
                            combatShip_name = 'combatoff';
                            combatShip_num = 'combatoff';
                            $("label[for='combatShip_select']").text('Off');
                            $('#combat_Ship').addClass('ship_combatoff');
                            break;
                    }
                })


                // sezione range on off / numero range
                if(GMA.Options().range_onoff !== 'on'){;
                    $('#range_sped').attr('disabled', 'disabled');
                }

                if(GMA.Options().active_deu === 'on' && GMA.Options().sped_ship_status === 'on' && GMA.Options().sped_system === 'on'){
                    $('#deu_number').removeAttr('disabled');
                } else {
                    $('#deu_number').attr('disabled', 'disabled');
                }
                $('#active_deu').on('change', function(){
                    if($(this).is(":checked")){
                        $('#deu_number').removeAttr('disabled');
                    } else {
                        $('#deu_number').attr('disabled', 'disabled');
                    }
                });
                if(GMA.Options().active_pathfinder === 'on' && GMA.Options().sped_ship_status === 'on' && GMA.Options().sped_system === 'on'){
                    $('#path_number').removeAttr('disabled');
                } else {
                    $('#path_number').attr('disabled', 'disabled');
                }
                $('#active_pathfinder').on('change', function(){
                    if($(this).is(":checked")){
                        $('#path_number').removeAttr('disabled');
                    } else {
                        $('#path_number').attr('disabled', 'disabled');
                    }
                });
                if(GMA.Options().active_sonde === 'on' && GMA.Options().sped_ship_status === 'on' && GMA.Options().sped_system === 'on'){
                    $('#sonde_number').removeAttr('disabled');
                } else {
                    $('#sonde_number').attr('disabled', 'disabled');
                }
                $('#active_sonde').on('change', function(){
                    if($(this).is(":checked")){
                        $('#sonde_number').removeAttr('disabled');
                    } else {
                        $('#sonde_number').attr('disabled', 'disabled');
                    }
                });

                // sezione range on off / numero range / choords
                if(GMA.Options().range_coords === 'off'){
                    $('#rangeSped').attr('disabled', 'disabled').hide();
                    $('#customChoords').attr('disabled', 'disabled').hide();
                }
                $('#rangechoords').on('change', function(){
                    if($(this).val() === 'range'){
                        $('#rangeSped').removeAttr('disabled').show();
                        $('#customChoords').attr('disabled', 'disabled').hide();
                        $('.rc_text').hide();
                        if($('#rangeSped').val() !== ''){
                            rangeSpedArray();
                        }
                    }
                    if($(this).val() === 'custom'){
                        $('#rangeChoords').attr('disabled', 'disabled').hide();
                        $('#rangeSped').attr('disabled', 'disabled').hide();
                        $('#customChoords').removeAttr('disabled').show();
                        $('.rc_text').hide();
                        if($('#rangeSped').val() !== ''){
                            customSpedArray();
                        }
                    }
                    if($(this).val() === 'off'){
                        $('#rangeSped').attr('disabled', 'disabled').hide();
                        $('#customChoords').attr('disabled', 'disabled').hide();
                        $('.rc_text').show();
                    }
                });
                $('#active_notturno').on('change', function(){
                    if($(this).is(":checked")){
                        $('#oraioNotturno, #orarioFineNotturno, #percentualeFlotta, #active_opzioni').removeAttr('disabled');
                        $('#opzioniSelectNotturno').removeAttr('disabled');
                    } else {
                        $('#oraioNotturno, #orarioFineNotturno, #percentualeFlotta, #active_opzioni').attr('disabled', 'disabled');
                        $('#opzioniSelectNotturno').attr('disabled', 'disabled');
                    }
                });
                $('#ogame_rules').change(function(){
                    if($(this).prop('checked')){
                        $("label[for = cargL_numslot], label[for = cargP_numslot]").text("Aggiungi %");
                        $('#info_rules').addClass('showRules');
                    } else {
                        $("label[for = cargL_numslot], label[for = cargP_numslot]").text("N. cargo");
                        $('#info_rules').removeClass('showRules');
                    }
                })
            };

            // pulsante nel menu ogame
            var muenuOgameSys = document.getElementById('menuTable');
            var SystemPosition = muenuOgameSys.getElementsByTagName("li")[20];
            var btnSystemEGS = 'Expedition SYS';
            var spedSystem = document.createElement("li");
            spedSystem.innerHTML = `
                <span class="menu_icon">
                    <div id="sysActOpt" class="menuImage galaxy"></div>
                </span>
                <div class="btnalliance_css" id="spedSystem" style="margin: 0 !important;padding: 0 !important;border: 0 !important;outline: 0 !important;">
                    <a class="EGS_css menubutton" href="javascript:void(0);" accesskey="" target="_self">`+btnSystemEGS+`</a>
                </div>`;
            muenuOgameSys.insertBefore(spedSystem, SystemPosition);
            $('#spedSystem').click(function(){
                if($('#egsPopUpWindow').length > 0){
                    //$('#egsPopUpWindow').remove();
                    location.reload();
                } else {
                    // resize iframe
                    var iFrameHeight = '770';
                    popUp(iFrameHeight);
                }
                $('#egsPopUpWindow').toggleClass('systpopup-show');
                $('#egsPopUpWindow').toggleClass('systpopup-hide');
                $('#suppliescomponent').toggle();
                $('#overviewcomponent').toggle();
                $('#facilitiescomponent').toggle();
                $('#marketplacecomponent').toggle();
                $('#inhalt').toggle();
                $('#researchcomponent').toggle();
                $('#shipyardcomponent').toggle();
                $('#defensescomponent').toggle();
                $('#fleetdispatchcomponent').toggle();
                $('#content').toggle();
                $('.content-box-s').toggle();
                $('#chatList').toggle();
                $('#sideBar').toggle();
                $('#chatContent').toggle();
                $('#spedSystem a').toggleClass('systemacts_cssActive');
            });
        
            if(window.location.href.indexOf('?page=ingame&component=fleetdispatch') > 0 && GMA.Options().sped_system === 'on'){
                if(window.location.href.indexOf('?page=ingame&component=fleetdispatch') > 0){
                    $('#statusBarFleet > ul > li:nth-child(3)').append('<span class="targetPlayerStatus" style="width: 8px;height: 8px;background: #ff0000;display: inline-block;border-radius: 50px;margin-left: 5px;"></span>');
                }
                var targetPlayerStatus = setInterval(function(){
                    if($('#statusBarFleet > ul > li:nth-child(3) > span.targetPlayerName').html() === name_player){
                        clearInterval(targetPlayerStatus);
                        $('.targetPlayerStatus').css('background', '#00ff08');
                    }
                },100);
                var currentGal,currentSys,fleetCount,maxFleetCount,slotSpedizioni,spedizioniTot,btnOnOff,spedTot,slotSped,nextGal,opacityClass;
                setTimeout(function(){
                    (function(window){
                        currentGal = window.currentPlanet.galaxy;
                        currentSys = window.currentPlanet.system;
                        fleetCount = window.fleetDispatcher.fleetCount;
                        maxFleetCount = window.fleetDispatcher.maxFleetCount;

                        slotSpedizioni = window.fleetDispatcher.expeditionCount;
                        spedizioniTot = window.fleetDispatcher.maxExpeditionCount;
                        GM_setValue(universe_name+'_TOTSpedizioni', spedizioniTot);
                        GM_setValue(universe_name+'_slotSpedizioni', slotSpedizioni);

                        nextGal = window.currentPlanet.galaxy;
                    })(window.unsafeWindow);
                    
                    spedTot = GM_getValue(universe_name+'_TOTSpedizioni');
                    slotSped = GM_getValue(universe_name+'_slotSpedizioni');
                    var sped_targetDB = GMA.Options().sped_target;
                    sped_targetDB = sped_targetDB.split(':')[0];
                    console.log(sped_targetDB)
                    if(slotSped < spedTot && sped_targetDB === currentTarget){
                        btnOnOff = 'egs_on';
                    } else {
                        btnOnOff = 'egs_off';
                    }
                    if(sped_targetDB === currentTarget){
                        $('#allornone').append(`
                            <div id="egs_fleet_display" style="display:flex; margin-top: 5px; font-size: 12px; width: 637px;background: linear-gradient(to bottom, #192026 0, #0d1014 13%, #0d1014 100%);border: 1px solid #050505;border-radius: 5px;">
                                <div id="egs_display_left" style="width:50%; padding: 5px 0px;">
                                    <div id="header_egs" style="padding: 4px 10px;color: #ffc400c9;font-size: 12px;">
                                        <span style="font-weight:900">`+__e["Expeditions"]+`</span><span style="color:#a1a1a1">:: `+__e["Slots used/total"]+`: <span id="egs_slot_used"></span>/<span id="egs_slot_totali"></span>
                                        </span>
                                    </div>
                                    <div id="egs_display_sped" style="padding: 2px 10px;">
                                        <span id="egs_start_sped" style="float: left;"><span style="font-weight:900">`+__e["Type of expedition"]+`:</span> <span id="expedition_type" style="color:#ffc400;"></span></span>
                                    </div>
                                </div>
                                <div id="egs_display_center" style="width:18%;background: linear-gradient(0deg, transparent,#000000, transparent);border-right: 1px solid #0d1014;padding: 5px 0px;">
                                    <div id="egs_partenza_title" style="padding: 4px;font-weight:900;">`+__e["Starting from"]+`:</div>
                                    <div id="egs_partenza_display" style="padding: 3px  4px 0; color:#fff;"></div>
                                </div>
                                <div id="egs_display_right" style="width:22%;background: linear-gradient(0deg, transparent,#000000, transparent);padding: 5px 0px;">
                                    <div id="egs_range_title" style="padding: 4px;font-weight:900;">`+__e["Next destination"]+`:</div>
                                    <div id="egs_range_display" style="padding: 3px  4px 0; color:#fff;"></div>
                                </div>
                                <div id="egs_btn" style="width: 15%;float: right;padding-top: 2px;padding-right: 6px;background: linear-gradient(0deg, transparent,#000000, transparent);padding: 5px 0px;">
                                    <div id="egs_fleet_ship" class="continue `+btnOnOff+`" >
                                        <span style="line-height: 18px;display: block;color: #fff;text-align: center;height: 38px;line-height: 38px;overflow: hidden;font-weight: bold;text-transform: uppercase;font-size: 12px;">
                                            `+__e['Send Fleet']+`
                                        </span>
                                    </div>
                                </div>
                            </div>
                        `);
                    }
                    $('#egs_slot_used').html(slotSped);
                    if(slotSped === spedTot){
                        $('#egs_slot_used').css('color','red');
                    }
                    if(slotSped === (spedTot-1)){
                        $('#egs_slot_used').css('color','#ffc400');
                    }
                    $('#egs_slot_totali').html(spedTot);
                    var expGal = GMA.Options().sped_target;
                    $('#egs_partenza_display').append(expGal.split(':')[1]);
                    switch(GMA.Options().range_coords){
                        case 'off':
                            $('#expedition_type').append(__e['Current Coords']);
                            break;
                        case 'range':
                            $('#expedition_type').append(__e['Range of']+' '+GMA.Options().range_sped+' '+__e['systems']);
                            break;
                        case 'custom':
                            $('#expedition_type').append(__e['Custom Coords']);
                            break;
                    }
                    if(GMA.Options().range_coords === 'off'){
                        $('#egs_range_display').append('['+currentGal+':'+currentSys+':16]');
                    }
                    if(GMA.Options().range_coords === 'range' || GMA.Options().range_coords === 'custom'){
                        var ra = GMA.Options().range_array;
                        var optGal = expGal.split(':')[2].replace('[','').replace(']','').split('|')[0];
                        $('#egs_range_display').append('['+optGal+':'+ra.toString().split(',')[0]+':16]');
                    }


                    SGE.globalSpedizioni();
                },100);
            }
        };
        // end core system
    });
})();