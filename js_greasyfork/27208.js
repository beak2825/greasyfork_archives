// ==UserScript==
// @name        HumbleBundleAVG
// @author      Splash
// @namespace   https://greasyfork.org/users/101223
// @description HumbleBundle AVG Check
// @include     https://www.humblebundle.com/*
// @match       https://www.humblebundle.com/*
// @supportURL  https://steamcn.com/t246845-1-1
// @version     1.2.3.20210809
// @grant       none
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/27208/HumbleBundleAVG.user.js
// @updateURL https://update.greasyfork.org/scripts/27208/HumbleBundleAVG.meta.js
// ==/UserScript==
(function () {
    if (window.gd_checking) {
        const CURRENCY_SYMBOLS = {
            TRY: "₺",
            USD: "$",
            AUD: "AU$",
            GBP: "£",
            NZD: "NZ$",
            RUB: "₽",
            CNY: "¥",
            EUR: "€",
            PHP: "₱",
            CAD: "CA$"
        };
        try {
            let avgData = JSON.parse(document.querySelector('script#webpack-bundle-data').innerText).bundleVars.order_form.product_json.order_form_vars['avg|money'];
            window.avgPrice = avgData.amount;
            window.avgSymbol = CURRENCY_SYMBOLS[avgData.currency];
        } catch (e) {
            console.error(e);
            let observer = new MutationObserver(function (mutations) {
                for (let i = 0; i < mutations.length; i++) {
                    for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                        if (mutations[i].addedNodes[j].nodeName == 'SCRIPT' && mutations[i].addedNodes[j].id == 'webpack-bundle-data') {
                            try {
                                let avgData = JSON.parse(mutations[i].addedNodes[j].innerText).bundleVars.order_form.product_json.order_form_vars['avg|money'];
                                window.avgPrice = avgData.amount;
                                window.avgSymbol = CURRENCY_SYMBOLS[avgData.currency];
                            } catch (e) {
                                console.error(e);
                            }
                            this.disconnect();
                            this.disconnected = true;
                            break;
                        }
                    }
                    if (this.disconnected)
                        break;
                }
            });
            observer.observe(document.body, {
                childList: true
            });
        }
        return;
    }
    window.addEventListener('load', function () {
        setTimeout(function () {
            let gdWindow,
            gd_avg,
            gd_symbol,
            gd_t,
            gd_t2,
            gd_interval_chklatest,
            gd_inprocess,
            gd_conttime,
            gd_chktime,
            gd_n,
            gd_btn_ckeck,
            gd_btn_settings,
            gd_page_conf,
            gd_bundle,
            gd_bundleurl,
            gd_bundleData,
            gd_confobj = gd_getValue('gd_confobj');
            /*
            =========================================================================
            注意：版本1.1.19后已支持配置界面，请在HB页面点击Check按钮旁边的齿轮图标进行配置，请勿在此处修改参数。
            =========================================================================
             */
            const default_conf = {
                gd_chknow: false, //是否立刻开始检测，如果为false，则会根据gd_chkd、gd_chkh、gd_chkm、gd_chks来设定开始时间，只要超过了设定的时间就会开始检测。默认设置是周3，03:00:04开始检测，则4个参数分别设置为3,3,0,4
                gd_chkd: 3, //仅当gd_chknow为false时有效，设定周几开始检测
                gd_chkh: 3, //仅当gd_chknow为false时有效，设定几点开始检测
                gd_chkm: 0, //仅当gd_chknow为false时有效，设定几分开始检测
                gd_chks: 4, //仅当gd_chknow为false时有效，设定几秒开始检测
                gd_chkinterval: 60000, //检测周期，以毫秒表示(1秒=1000毫秒)
                gd_chkmaxtime: 60, //当连续多少次价格都没下降时停止检测，如不需要，可设置为0
                gd_chkminprice: 2, //当价格等于或低于设定值时停止检测，如不需要，可设置为0
                gd_chkpricetime: 0, //当成功检测多少次后，无视所有条件，立即停止检测，如不需要，可设置为0
                gd_needtologin: true, //是否需要登录，如果希望不登陆锁价，需设置为false
                gd_chkurl: 'https://www.humblebundle.com/bundles', //自定义检测URL，默认是https://www.humblebundle.com/bundles，留空表示不修改
                gd_chklatestbundle: true, //总是检测最新的捆绑包，默认启用。启用时，定期通过自定义链接查询最新包的链接，并检测新包的均价；禁用时，将自定义链接作为一个捆绑包的链接处理。
                gd_type_games: true, //仅当gd_chklatestbundle为true时有效，检测最新包时将不排除Games类型
                gd_type_books: false, //仅当gd_chklatestbundle为true时有效，检测最新包时将不排除Books类型
                gd_type_software: false, //仅当gd_chklatestbundle为true时有效，检测最新包时将不排除Software类型
                gd_type_other: false, //仅当gd_chklatestbundle为true时有效，检测最新包时将不排除除Games、Books、Software以外的类型
                gd_ver: '1.2.2.20210522'
            };
            Object.freeze(default_conf);
            if (location.href.match(/^https:\/\/www\.humblebundle\.com\/(?:\?+.*)?$/) || $('.bundle-info-heading').length) {
                if (gd_confobj) {
                    gd_confobj = JSON.parse(gd_confobj);
                    gd_chkconf();
                    if (!gd_confobj.gd_ver || gd_confobj.gd_ver != default_conf.gd_ver) {
                        if (!gd_confobj.gd_ver && gd_confobj.gd_chkurl == 'https://www.humblebundle.com/')
                            gd_confobj.gd_chkurl = default_conf.gd_chkurl;
                        gd_confobj.gd_ver = default_conf.gd_ver;
                    }
                } else {
                    gd_confobj = JSON.parse(JSON.stringify(default_conf));
                }
                gd_setValue('gd_confobj', JSON.stringify(gd_confobj));
                gd_btn_ckeck = $('<li class="navbar-item navbar-item-dropdown user-navbar-item logged-in button-title gdbtn" running="0" title="Check"><span><i class="navbar-item-icon hb hb-library"></i><span>Check</span></span></li>');
                gd_btn_settings = $('<li class="navbar-item navbar-item-dropdown user-navbar-item logged-in button-title gdbtn" style="right: 0px;" title="Settings"><span><i class="navbar-item-icon hb hb-cog"></i></span></li>');
                gd_page_conf = $('<div id="gd_configuration" style="display:none"><section class="gd_confpage"><div class="gd_modalcontainer"><main class="gd_modal"><div><header class="gd_header gd_headertop"><div><span></span><span class="gd_headernavclose" title="Close"></span></div><h1 class="gd_headertitle">Configuration Page</h1><div class="gd_headerauthor"><div class="gd_headerhr"></div><span class="gd_author" title="@DevSplash">@DevSplash</span></div></header><div class="gd_topwrapper"><div class="gd_topedge"></div></div></div><div class="gd_sectionbody"><div class="gd_sectioncontent"><div class="gd_confinner"><div class="gd_confinnerobject"><fieldset id="gd_form" class="gd_fieldset"><div class="gd_formtop gd_formlist_border"><div><input id="gd_chknowbox" type="checkbox" class="gd_checkbox"><label for="gd_chknowbox" class="gd_checkmarkbox"><i class="gd_hbc gd_hbcheckmark"></i></label><label for="gd_chknowbox" class="gd_chkboxlabel">Check Now</label></div><div><input id="gd_needloginbox" type="checkbox" class="gd_checkbox"><label for="gd_needloginbox" class="gd_checkmarkbox"><i class="gd_hbc gd_hbcheckmark"></i></label><label for="gd_needloginbox" class="gd_chkboxlabel">Need to Login</label></div></div><div class="gd_bundleoption gd_formlist_border"><div><input id="gd_latestbundlebox" type="checkbox" class="gd_checkbox"><label for="gd_latestbundlebox" class="gd_checkmarkbox"><i class="gd_hbc gd_hbcheckmark"></i></label><label for="gd_latestbundlebox" class="gd_chkboxlabel">Latest bundle</label></div><div><input id="gd_gamestypebox" type="checkbox" class="gd_checkbox gd_bundletype"><label for="gd_gamestypebox" class="gd_checkmarkbox"><i class="gd_hbc gd_hbcheckmark"></i></label><label for="gd_gamestypebox" class="gd_chkboxlabel">Games</label></div><div><input id="gd_bookstypebox" type="checkbox" class="gd_checkbox gd_bundletype"><label for="gd_bookstypebox" class="gd_checkmarkbox"><i class="gd_hbc gd_hbcheckmark"></i></label><label for="gd_bookstypebox" class="gd_chkboxlabel">Books</label></div><div><input id="gd_softwaretypebox" type="checkbox" class="gd_checkbox gd_bundletype"><label for="gd_softwaretypebox" class="gd_checkmarkbox"><i class="gd_hbc gd_hbcheckmark"></i></label><label for="gd_softwaretypebox" class="gd_chkboxlabel">Software</label></div><div><input id="gd_othertypebox" type="checkbox" class="gd_checkbox gd_bundletype"><label for="gd_othertypebox" class="gd_checkmarkbox"><i class="gd_hbc gd_hbcheckmark"></i></label><label for="gd_othertypebox" class="gd_chkboxlabel">Other</label></div></div><div><div class="gd_formtext">Start Date</div><div class="gd_selectdiv"><select id="gd_select_d" class="gd_selectcontrol"><option value="7">Sun.</option><option value="1">Mon.</option><option value="2">Tue.</option><option value="3" selected="">Wed.</option><option value="4">Thu.</option><option value="5">Fri.</option><option value="6">Sat.</option></select><span class="gd_icon-wrapper"><svg role="img" class="gd_icon gd_iconarrows" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="208 120 9 13"><path fill-rule="evenodd" d="M212.5,120 L217,125 L208,125 L212.5,120 Z M212.5,133 L217,128 L208,128 L212.5,133 Z"></path></svg></span></div></div><div class="gd_formlist_border"><div class="gd_formtext"></div><div class="gd_fieldsetchildleft gdtextbox gd_inputsdiv"><div><input id="gd_input_h" type="text" class="gd_textboxcontrol gd_input_s" maxlength="2"></div></div><div class="gd_formtexts">:</div><div class="gd_fieldsetchildleft gdtextbox gd_inputsdiv"><div><input id="gd_input_m" type="text" class="gd_textboxcontrol gd_input_s" maxlength="2"></div></div><div class="gd_formtexts">:</div><div class="gd_fieldsetchildleft gdtextbox gd_inputsdiv"><div><input id="gd_input_s" type="text" class="gd_textboxcontrol gd_input_s" maxlength="2"></div></div></div><div class="gd_formlist_border"><div class="gd_formtext">Delay (ms)</div><div class="gd_fieldsetchildleft gdtextbox gd_inputdiv"><div><input id="gd_input_interval" type="text" class="gd_textboxcontrol gd_input"></div></div></div><div class="gd_formlist_border"><div class="gd_formtext">Min Price Times</div><div class="gd_fieldsetchildleft gdtextbox gd_inputdiv"><div><input id="gd_input_maxtime" type="text" class="gd_textboxcontrol gd_input"></div></div></div><div class="gd_formlist_border"><div class="gd_formtext">Min Price</div><div class="gd_fieldsetchildleft gdtextbox gd_inputdiv"><div><input id="gd_input_minprice" type="text" class="gd_textboxcontrol gd_input"></div></div></div><div class="gd_formlist_border"><div class="gd_formtext">Max Times</div><div class="gd_fieldsetchildleft gdtextbox gd_inputdiv"><div><input id="gd_input_pricetime" type="text" class="gd_textboxcontrol gd_input"></div></div></div><div class="gd_formbottom"><div class="gd_formtextl">Custom URL (optional)</div><div class="gd_fieldsetchildleft gdtextbox gd_inputldiv"><div><input id="gd_input_chkurl" type="text" class="gd_textboxcontrol gd_input"></div></div></div></fieldset></div></div></div></div><nav class="gd_sectioncontent"><div class="gd_sectionbuttonbox"><div class="gd_sectionbutton"><button class="gd_savebtn" title="Save"><span><div class="gd_buttoncontent"><span>Save</span><img class="gd_button-continueArrow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAAXNSR0IArs4c6QAAAjJJREFUOBGVVL+P0mAY/trjaoM0gJ4mao/FwUUGJgIrCTOJwdmJTSeCf4Cr/wAOhsGEwYW4kJC4GRgdcGWCI+YMiXDWFPCKz1No06+0xnuTp/T99Xzvj68oIloSMGeA28ApcAJcA1vAAn4CfwBJFEkTgvp9wABsYA0wyQFUgIfcAnTgCrgEdoArQTIGPgK80/cR8U+v6guEuFWyfApJTeA3wIr+R3goW78DrJjgVcbW2AoDbiqcKUdw6c2BLcYSWZb1JpvNxh3CPOYnVMMwuDVuKFaSyeTL+Xz+rlKpMClKLPKomUxGi/KGbbquP+/3+x9brRYHfyQuTyqVugdPOojVavV2t9utAcpm/7N/brfbr51O53Ewnu/k4QI4DA7fF8dxLhRFiayAQSD8rGnaMz9h/6KquVwuZBNiOp1+gHFzcEiLsW37W7PZfB1Ocnnq9fpRmwjknXviwWsT7X+pVqtPYWc30mjIo5bL5agN8VP5HoBYLBafCoXCi8FgMINdGgt0QR61WCyusQnv8tJ+JLPZ7L1pmq8mk8kPOP1v0QtkPnkEWjhtt9sP4JDKDunnIV2KZT55XHJcyLNGo3H2r4Q4H/OY7xLxAVYVrZg3JWQ885jvkx0IExjyebfbfYgZ8BOTWgnq9DOO8SDyFygN/nDC3eVyaQyHw02v17NHo9H1eDx28vm8WiqVTmq1mo7Nael0mhtf4HL7m5XIWCEFpBwm/21TAN+Df9u/oF+BRLrMsIm/0Xbd/CLTacgAAAAASUVORK5CYII="></div></span></button><button class="gd_restorebtn" title="Restore Default"><span><div class="gd_buttoncontent"><span></span><img class="gd_button-continueArrow" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgaWQ9Il80NzMiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgc3R5bGU9IndpZHRoOjIwcHg7aGVpZ2h0OjIwcHg7IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE3OTIgMTc5MiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTc5MiAxNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNjcyIDE0NTYgcTAgMTYuMzMgLTEwLjUgMjYuODMgcS0xMC41IDEwLjUgLTI2LjgzIDEwLjUgbC03NC42NyAwIHEtMTYuMzMgMCAtMjYuODMgLTEwLjUgcS0xMC41IC0xMC41IC0xMC41IC0yNi44MyBsMCAtODIxLjMzIHEwIC0xNi4zNCAxMC41IC0yNi44NCBxMTAuNSAtMTAuNSAyNi44MyAtMTAuNSBsNzQuNjcgMCBxMTYuMzMgMCAyNi44MyAxMC41IHExMC41IDEwLjUgMTAuNSAyNi44NCBsMCA4MjEuMzMgWk05NzAuNjcgMTQ1NiBxMCAxNi4zMyAtMTAuNSAyNi44MyBxLTEwLjUgMTAuNSAtMjYuODQgMTAuNSBsLTc0LjY2IDAgcS0xNi4zNCAwIC0yNi44NCAtMTAuNSBxLTEwLjUgLTEwLjUgLTEwLjUgLTI2LjgzIGwwIC04MjEuMzMgcTAgLTE2LjM0IDEwLjUgLTI2Ljg0IHExMC41IC0xMC41IDI2Ljg0IC0xMC41IGw3NC42NiAwIHExNi4zNCAwIDI2Ljg0IDEwLjUgcTEwLjUgMTAuNSAxMC41IDI2Ljg0IGwwIDgyMS4zMyBaTTEyNjkuMzMgMTQ1NiBxMCAxNi4zMyAtMTAuNSAyNi44MyBxLTEwLjUgMTAuNSAtMjYuODMgMTAuNSBsLTc0LjY3IDAgcS0xNi4zMyAwIC0yNi44MyAtMTAuNSBxLTEwLjUgLTEwLjUgLTEwLjUgLTI2LjgzIGwwIC04MjEuMzMgcTAgLTE2LjM0IDEwLjUgLTI2Ljg0IHExMC41IC0xMC41IDI2LjgzIC0xMC41IGw3NC42NyAwIHExNi4zMyAwIDI2LjgzIDEwLjUgcTEwLjUgMTAuNSAxMC41IDI2Ljg0IGwwIDgyMS4zMyBaTTYzNC42NyAyOTguNjcgbDU3LjE2IC0xMzYuNSBxMi4zNCAtMy41IDguMTcgLTguMTcgcTUuODMgLTMuNSAxMS42NyAtNC42NyBsMzY5LjgzIDAgcTQuNjcgMS4xNyAxMC41IDQuNjcgcTUuODMgNC42NyA5LjMzIDguMTcgbDU2IDEzNi41IGwtNTIyLjY2IDAgWk0xNzE3LjMzIDMzNiBxMCAtMTYuMzMgLTEwLjUgLTI2LjgzIHEtMTAuNSAtMTAuNSAtMjYuODMgLTEwLjUgbC0zNjAuNSAwIGwtODEuNjcgLTE5NC44NCBxLTE4LjY2IC00NC4zMyAtNjMgLTczLjUgcS00NC4zMyAtMjkuMTYgLTkyLjE2IC0zMC4zMyBsLTM3My4zNCAwIHEtNDcuODMgMS4xNyAtOTIuMTYgMzAuMzMgcS00NC4zNCAyOS4xNyAtNjMgNzMuNSBsLTgxLjY3IDE5NC44NCBsLTM2MC41IDAgcS0xNi4zMyAwIC0yNi44MyAxMC41IHEtMTAuNSAxMC41IC0xMC41IDI2LjgzIGwwIDc0LjY3IHEwIDE2LjMzIDEwLjUgMjYuODMgcTEwLjUgMTAuNSAyNi44MyAxMC41IGwxMTIgMCBsMCAxMTEwLjY3IHEyLjMzIDk5LjE2IDU0LjgzIDE2NC41IHE1Mi41IDY2LjUgMTMxLjg0IDY4LjgzIGw5NzAuNjYgMCBxNzkuMzQgLTIuMzMgMTMxLjg0IC03MS4xNyBxNTIuNSAtNjcuNjYgNTQuODMgLTE2Ni44MyBsMCAtMTEwNiBsMTEyIDAgcTE2LjMzIDAgMjYuODMgLTEwLjUgcTEwLjUgLTEwLjUgMTAuNSAtMjYuODMgbDAgLTc0LjY3IFoiLz48L3N2Zz4="></div></span></button></div></div></nav></main></div></section></div>');
                if (gd_confobj.gd_needtologin && !$('.logged-in').length)
                    gd_btn_ckeck.hide(); //不满足登录要求;
                gd_page_conf.find('#gd_input_h').prop('placeholder', gd_strformat(default_conf.gd_chkh, 2));
                gd_page_conf.find('#gd_input_m').prop('placeholder', gd_strformat(default_conf.gd_chkm, 2));
                gd_page_conf.find('#gd_input_s').prop('placeholder', gd_strformat(default_conf.gd_chks, 2));
                gd_page_conf.find('#gd_input_interval').prop('placeholder', default_conf.gd_chkinterval);
                gd_page_conf.find('#gd_input_maxtime').prop('placeholder', default_conf.gd_chkmaxtime);
                gd_page_conf.find('#gd_input_minprice').prop('placeholder', default_conf.gd_chkminprice);
                gd_page_conf.find('#gd_input_pricetime').prop('placeholder', default_conf.gd_chkpricetime);
                gd_page_conf.find('#gd_input_chkurl').prop('placeholder', default_conf.gd_chkurl);
                if ($('.logged-in').length) {
                    $('div.user-dropdown-container').eq(0).before(gd_btn_ckeck).before(gd_btn_settings);
                } else if ($('.navbar-item.user-navbar-item.logged-out').length) {
                    $('.navbar-item.user-navbar-item.logged-out').eq(0).before(gd_btn_ckeck).before(gd_btn_settings);
                } else {
                    console.log('状态错误');
                }
                $('body').append(gd_page_conf);
                gd_addStyle('.navigation-container-v2 .navbar-content .user-navbar-item.logged-in.gdbtn.warn{color:#f33}.navigation-container-v2 .navbar-content .user-navbar-item.logged-in.gdbtn:hover{color:gold}.navigation-container-v2 .navbar-content .user-navbar-item.logged-in.gdbtn{overflow:visible}.gd_checkbox{display:none}.gd_checkmarkbox{display:inline-block;width:14px;height:14px;line-height:14px;border-radius:3px;border:1px solid #ccc;background-color:#fff;cursor:pointer;color:#5b5b65}.gd_selectdiv{margin-top:5px;width:20%!important;border-radius:4px;position:relative;display:inline-block}.gd_selectcontrol,.gd_input_s,.gd_input{background-color:white!important;border-radius:4px!important}.gd_input_s:focus,.gd_input:focus{box-shadow:inset 0 0 6px #3099de}.gd_input_s{padding-right:22px!important;padding-left:22px!important;-webkit-transition:all .15s ease-in-out;-moz-transition:all .15s ease-in-out}.gd_input{padding-right:15px!important;padding-left:15px!important;-webkit-transition:all .15s ease-in-out;-moz-transition:all .15s ease-in-out}.gd_confpage .gd_restorebtn{position:relative;border-radius:4px;background-color:#e53e3e;background-image:-webkit-gradient(linear,left top,left bottom,from(#e84444),to(#de3030));background-image:-webkit-linear-gradient(top,#e84444,#de3030);background-image:linear-gradient(-180deg,#e84444,#de3030);box-shadow:0 1px 0 0 rgba(46,86,153,.15),inset 0 1px 0 0 rgba(46,86,153,.1),inset 0 -1px 0 0 rgba(46,86,153,.4);font-size:17px;line-height:21px;height:37px;font-weight:700;text-shadow:0 -1px 0 rgba(0,0,0,.12);color:#fff;cursor:pointer;-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.gd_confpage .gd_restorebtn:active:not(.Button--disableClick){background-image:-webkit-gradient(linear,left top,left bottom,from(#c33232),to(#be2727));background-image:-webkit-linear-gradient(top,#c33232,#be2727);background-image:linear-gradient(180deg,#c33232,#be2727)}.gd_savebtn{width:85%;padding:0;border:0}.gd_restorebtn{width:9%;padding:0;border:0;float:right}.gd_hbcheckmark:before{content:"\\f00d"}.gd_hbc{display:inline-block;font:normal normal normal 14px/1 "hb-icons";font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.gd_checkmarkbox .gd_hbcheckmark{opacity:0}.gd_checkbox[type=checkbox]:checked+.gd_checkmarkbox .gd_hbcheckmark{opacity:1}#gd_configuration *{box-sizing:border-box;-webkit-font-smoothing:antialiased}:focus{outline:0}#gd_configuration{background:rgba(0,0,0,0.3);z-index:99999999999;position:fixed;height:100%;width:100%;margin:auto;top:0;right:0;bottom:0;left:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;line-height:1.5}.gd_fieldset{margin:0}.gd_fieldset,.gd_fieldset input{padding:0;border:0}.gd_fieldset input{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}.gd_fieldset input,.gd_fieldset select{line-height:normal!important;background:0;width:100%}.gd_paddingtop{padding-top:18px}.gd_confpage .gd_confinner{position:relative;margin-top:-4px;margin-left:-36px;width:500px;height:475px}.gd_confpage .gd_confinnerobject{position:absolute;top:4px;left:0;padding-left:36px;padding-right:36px;width:500px;-webkit-transition:all .35s cubic-bezier(.52,0,.27,1.01);transition:all .35s cubic-bezier(.52,0,.27,1.01)}.gd_confpage .gd_savebtn{position:relative;border-radius:4px;background-color:#3ea8e5;background-image:-webkit-gradient(linear,left top,left bottom,from(#44b1e8),to(#3098de));background-image:-webkit-linear-gradient(top,#44b1e8,#3098de);background-image:linear-gradient(-180deg,#44b1e8,#3098de);box-shadow:0 1px 0 0 rgba(46,86,153,.15),inset 0 1px 0 0 rgba(46,86,153,.1),inset 0 -1px 0 0 rgba(46,86,153,.4);font-size:17px;line-height:21px;height:37px;font-weight:700;text-shadow:0 -1px 0 rgba(0,0,0,.12);color:#fff;cursor:pointer;-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.gd_confpage .gd_savebtn.disabled,.gd_confpage .gd_restorebtn.disabled{color:#aaa;background-color:#e5e5e5;background-image:-webkit-gradient(linear,left top,left bottom,from(#e8e8e8),to(#dedede));background-image:-webkit-linear-gradient(top,#e8e8e8,#dedede);background-image:linear-gradient(-180deg,#e8e8e8,#dedede);box-shadow:none;cursor:not-allowed}.gd_confpage .gd_buttoncontent{position:absolute;top:0;right:0;bottom:0;left:0;line-height:35px;overflow:hidden;padding:0}.gd_confpage .gd_savebtn:after{content:"";position:absolute;top:0;right:0;bottom:0;left:0;border:1px solid rgba(46,86,153,.1);border-radius:inherit}.gd_confpage .gd_savebtn:active:not(.Button--disableClick){background-image:-webkit-gradient(linear,left top,left bottom,from(#328ac3),to(#277bbe));background-image:-webkit-linear-gradient(top,#328ac3,#277bbe);background-image:linear-gradient(180deg,#328ac3,#277bbe)}.gd_confpage{font-size:13px;height:100%;width:500px;height:614px;left:50%;top:50%;margin:-307px 0 0 -250px}.gd_headerauthor{font-size:9px;line-height:1.1}.gd_confpage,.gd_headerauthor,.gd_sectionbody,.gd_sectionbuttonbox{position:relative}.gd_confpage .gd_fieldset{position:relative;border-radius:5px;background:#fff;box-shadow:inset 0 1px 1px 0 hsla(240,1%,49%,.3),0 1px 0 0 hsla(0,0%,100%,.7)}.gd_confpage .gd_fieldsetchildleft,.gd_confpage .gd_selectdiv{border:1px solid hsla(240,1%,49%,.25);border-left-color:hsla(240,1%,49%,.25);-webkit-transition-property:border-color,background-color,-webkit-box-shadow;transition-property:border-color,box-shadow,background-color;-webkit-transition-duration:.15s;transition-duration:.15s;-webkit-transition-timing-function:linear;transition-timing-function:linear}.gd_confpage .gd_header{position:relative;padding:12px 36px;text-align:center;background-color:#e8e9eb}.gd_confpage .gd_headertop{padding:8px 0}.gd_confpage .gd_headernavclose{background:no-repeat;cursor:pointer;position:absolute;-webkit-transition-duration:.25s;transition-duration:.25s;-webkit-transition-timing-function:ease;transition-timing-function:ease;-webkit-transition-property:opacity;transition-property:opacity;width:25px;height:25px;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE5UlEQVQ4EQHaBCX7AQAAAAAAAAAAAAAAAAAAAAAAAAACAAAADgAAABoAAAAPAAAABgAAAPoAAADxAAAA5gAAAPIAAAD+AAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAwAAAAtAAAAAAAAAPkAAAD8AAAAAAAAAAAAAAAEAAAABwAAAAAAAADTAAAA9AAAAAAAAAAAAwAAAAAAAAAAAAAAFAAAAC8AAAD4AAAA+AAAAPoAAAD7AAAA/AAAAP0AAAD+AAAA/QAAAAEAAAAfAAAA9QAAAPYAAAAAAwAAAAAAAAAMAAAALgAAAPYAAAAAAAAAAwAAAAEAAAD/AAAAAAAAAAMAAAAGAAAABQAAAAAAAAD7AAAAGgAAAO0AAAD6AgAAAAINDQ0wAAAA9gAAAADFxcUb9vb2QVFRUQ8AAAALAAAABwAAAAtRUVEP9vb2QcXFxRsAAAAAAAAA9g0NDTAAAAACADMzMxQAAAA5AAAALgAAADTu7u47////DPf392JGRkZFAAAAQUZGRkX39/di////DO7u7jsAAAA0AAAALgAAADkoKCgTAgYGBiIAAAD6AAAA/AAAAPwdHR3yAQEB9wgICKixsbEdcnJyFLGxsR0ICAioAQEB9x0dHfIAAAD8AAAA/AAAAPoREREjARsbG0Hl5eXuAAAA+AAAAAMAAAALCgoK//b29s////8HAAAASAAAALgBAQH5CgoKMfb29gEAAAD1AAAA/QAAAAgcHBwQAu3t7QAAAAD/AAAA/wAAAP4AAAD69vb2DRQUFC8BAQH2AQEBrgEBAfYUFBQv9vb2DQAAAPoAAAD+AAAA/wAAAP/s7OwBAhsbGwEAAAABAAAAAQAAAAIAAAAGRkZGBOHh4RwAAAAAAAAAAAAAAADh4eEcRkZGBAAAAAYAAAACAAAAAQAAAAEbGxsBAjw8PAEAAAAEAAAAAwAAAAZRUVEKsbGxHQoKCrwAAAADAAAALwAAAAMKCgq8sbGxHVFRUQoAAAAGAAAAAwAAAAQ8PDwCAMLCwkMAAAA5AAAALgAAADT09PRh////CgAAAAMKCgo0AAAAQQoKCjQAAAAD////CvT09GEAAAA0AAAALgAAADnCwsJDAjQ0NPMjIyMJAAAABgAAAABMTEy3AQEB+gsLCyr29vYBAAAA7vb29gELCwsqAQEB+kxMTLcAAAAAAAAABiMjIwkzMzPyAf///wbc3NxPJSUl6QAAAPYAAAAAAAAAAAAAAPwAAAD6AAAA/gAAAAIAAAAGAAAABAAAAAAAAAAAAAAACtvb2xYkJCSyAgEBAfokJCTWwsLCEgAAAAsAAAAAAAAA+gAAAPoAAAD9AAAA/gAAAP0AAAD6AAAA+gAAAAAAAAALwsLCEiQkJNcBAQH6AgAAAAABAQHVPT097t7e3h0jIyMOAAAACwAAAAkAAAAHAAAACAAAAAcAAAAJAAAACyMjIw7e3t4dPT097QEBAdUAAAAAAQAAAAAAAAAAAAAAAP///yv7+/tF1dXV5ZeXl/G9vb376enpABcXFwBDQ0MFaWlpDysrKxoFBQW8AQEB1QAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAD///8GAAAAMAAAACgAAAAVAAAACQAAAPcAAADrAAAA2AAAANABAQH6AAAAAAAAAAAAAAAAoUD9Jf4lb1IAAAAASUVORK5CYII=");background-size:17px;background-position:4px 4px;right:6px;top:6px}.gd_confpage .gd_headertitle{margin:0;text-align:center;font-size:17px;font-weight:700;color:#000;text-shadow:0 1px 0 #fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gd_confpage .gd_headerhr{height:1px;background-image:-webkit-radial-gradient(circle,hsla(0,0%,100%,.31),hsla(0,0%,100%,0));background-image:radial-gradient(circle,hsla(0,0%,100%,.31),hsla(0,0%,100%,0));margin-bottom:3px}.gd_confpage .gd_headerhr:before{content:"";display:block;position:relative;height:1px;top:-1px;background-image:-webkit-radial-gradient(circle,rgba(0,0,0,.07),transparent);background-image:radial-gradient(circle,rgba(0,0,0,.07),transparent)}.gd_confpage .gd_author{max-width:100%;overflow-x:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;color:#919199;text-shadow:0 1px 0 hsla(0,0%,100%,.4);vertical-align:top}.gd_confpage .gd_modal .gd_header{border-top-left-radius:6px;border-top-right-radius:6px;display:block;position:relative}.gd_confpage .gd_icon{width:30px;height:30px}.gd_confpage .gd_modal{display:inline-block;border-radius:6px;width:500px;position:relative;background-color:#f5f5f7;box-shadow:0 12px 30px 0 rgba(0,0,0,.5),inset 0 1px 0 0 hsla(0,0%,100%,.65);-webkit-backface-visibility:hidden;backface-visibility:hidden}.gd_confpage .gd_modal:before{content:"";position:absolute;top:-1px;right:-1px;bottom:-1px;left:-1px;border:1px solid rgba(0,0,0,.12);border-radius:inherit}.gd_confpage .gd_topwrapper{width:100%;position:relative;background-color:#e8e9eb}.gd_confpage .gd_topedge{border-top:1px solid #fff;box-shadow:0 -1px 0 0 #d2d2d3;border-top-left-radius:5px;border-top-right-radius:5px;width:100%;height:4px;background-color:#f5f5f7;margin-bottom:-3px}.gd_confpage .gd_sectioncontent{margin:10px 36px}.gd_confpage .gd_sectionbutton{padding-top:8px}.gd_confpage .gd_iconarrows{position:absolute;top:11px;right:11px;width:9px;height:13px;pointer-events:none;fill:#b5bfc5}.gd_confpage .gd_selectcontrol{border:0;padding:9px 30px 9px 15px;font-size:15px;color:#000;-webkit-appearance:none;-moz-appearance:none;appearance:none;box-sizing:border-box;margin:0}.gdtextbox{position:relative;z-index:0;display:inline-block;height:37px}.gd_confpage .gd_textboxcontrol{padding:9px;font-size:15px;color:#000}.gd_confpage .gd_textboxcontrol::-webkit-input-placeholder,.gd_confpage .gd_textboxcontrol::-moz-placeholder,.gd_confpage .gd_textboxcontrol:-ms-input-placeholder{font-weight:500;color:#a1a1a7}.gd_confpage .gd_modalcontainer{margin:0 auto;width:500px}.gd_inputsdiv{border-bottom-color:hsla(240,1%,49%,.25);margin-top:5px;width:15%!important;margin-bottom:5px;border-radius:4px}.gd_inputdiv{margin-top:5px;border-bottom-color:hsla(240,1%,49%,.25);margin-bottom:5px;border-radius:4px;width:30%!important}.gd_inputldiv{margin:10px;border-bottom-color:hsla(240,1%,49%,.25);border-radius:4px;width:95%!important}.gd_fieldset div{background-color:#e4e7ed}.gd_formtop{border-radius:5px 5px 0 0;display:flex}.gd_bundleoption{display:flex;flex-wrap:wrap}.gd_bundleoption div:first-child{width:100%}.gd_formtop div:first-child,.gd_bundleoption div{margin:5px 10px}.gd_formtop div{margin:5px 70px}.gd_formlist_border{border-bottom:2px solid #d3d7de}.gd_formbottom{border-radius:0 0 5px 5px}.gd_formtext{width:30%;display:inline-block;padding:5px 0 0 12px;font-size:15px;color:black}.gd_formtextl{width:100%;display:block;padding:10px 0 0 12px;font-size:15px;color:black}.gd_formtexts{width:4%;display:inline-block;padding:0 0 0 6px;font-weight:bold;font-size:15px;color:black}.gd_chkboxlabel{margin:5px 0 5px 5px;font-size:15px;font-family:sans-serif;color:black;cursor:pointer}.gd_button-continueArrow{position:absolute;width:19px;height:20px;pointer-events:none}.gd_savebtn .gd_button-continueArrow{right:13px;top:9px}.gd_restorebtn .gd_button-continueArrow{right:9px;top:8px}');
                gd_btn_ckeck.on("click", async function () {
                    if ($(this).attr('running') == 0) {
                        gdWindow = null;
                        gd_avg = -1;
                        gd_symbol = '';
                        gd_t = 0;
                        gd_t2 = 0;
                        gd_interval_chklatest = 0;
                        gd_inprocess = false;
                        gd_conttime = 0;
                        gd_chktime = 0;
                        gd_bundle = '';
                        gd_bundleurl = '';
                        gd_bundleData = null;
                        gd_page_conf.find('.gd_savebtn').addClass('disabled');
                        gd_page_conf.find('.gd_restorebtn').addClass('disabled');
                        gd_btn_ckeck.removeClass('warn');
                        $(this).attr('running', 1);
                        if (!gd_confobj.gd_chklatestbundle) {
                            gd_bundleurl = gd_confobj.gd_chkurl;
                        }
                        gd_t = setTimeout(gd_chkfnc, 50);
                    } else if ($(this).attr('running') == 1) {
                        $(this).attr('running', -1).find('span>span').text('Stopping');
                        clearTimeout(gd_t);
                        clearTimeout(gd_interval_chklatest);
                        if (!gd_inprocess) {
                            clearInterval(gd_t2);
                            gd_page_conf.find('.gd_savebtn').removeClass('disabled');
                            gd_page_conf.find('.gd_restorebtn').removeClass('disabled');
                            $(this).attr('running', 0).find('span>span').text('Check' + (gd_avg && gd_avg > 0 ? '(' + gd_symbol + gd_avg + ')' : ''));
                        }
                    }
                });
                gd_btn_settings.on('click', function () {
                    gd_chkconf();
                    gd_showconf(gd_confobj);
                    gd_page_conf.fadeIn(200);
                });
                gd_page_conf.on('click', '.gd_headernavclose', function () {
                    gd_page_conf.fadeOut(200);
                }).on({
                    click: function () {
                        if (gd_btn_ckeck.attr('running') != 0)
                            return;
                        gd_showconf(default_conf);
                    },
                    dblclick: function () {
                        if (gd_btn_ckeck.attr('running') != 0)
                            return;
                        gd_deleteValue('gd_confobj');
                    }
                }, '.gd_restorebtn').on('click', '.gd_savebtn', function () {
                    if (gd_btn_ckeck.attr('running') != 0)
                        return;
                    gd_confobj.gd_chknow = gd_page_conf.find('#gd_chknowbox').prop('checked') ? true : false;
                    gd_confobj.gd_needtologin = gd_page_conf.find('#gd_needloginbox').prop('checked') ? true : false;
                    gd_confobj.gd_chklatestbundle = gd_page_conf.find('#gd_latestbundlebox').prop('checked') ? true : false;
                    gd_confobj.gd_type_games = gd_page_conf.find('#gd_gamestypebox').prop('checked') ? true : false;
                    gd_confobj.gd_type_books = gd_page_conf.find('#gd_bookstypebox').prop('checked') ? true : false;
                    gd_confobj.gd_type_software = gd_page_conf.find('#gd_softwaretypebox').prop('checked') ? true : false;
                    gd_confobj.gd_type_other = gd_page_conf.find('#gd_othertypebox').prop('checked') ? true : false;
                    gd_confobj.gd_chkd = gd_page_conf.find('#gd_select_d').val();
                    gd_confobj.gd_chkh = gd_page_conf.find('#gd_input_h').val();
                    gd_confobj.gd_chkm = gd_page_conf.find('#gd_input_m').val();
                    gd_confobj.gd_chks = gd_page_conf.find('#gd_input_s').val();
                    gd_confobj.gd_chkinterval = gd_page_conf.find('#gd_input_interval').val();
                    gd_confobj.gd_chkmaxtime = gd_page_conf.find('#gd_input_maxtime').val();
                    gd_confobj.gd_chkminprice = gd_page_conf.find('#gd_input_minprice').val();
                    gd_confobj.gd_chkpricetime = gd_page_conf.find('#gd_input_pricetime').val();
                    gd_confobj.gd_chkurl = gd_page_conf.find('#gd_input_chkurl').val();
                    gd_confobj.gd_ver = default_conf.gd_ver;
                    gd_chkconf();
                    gd_setValue('gd_confobj', JSON.stringify(gd_confobj));
                    gd_page_conf.fadeOut(200);
                }).on({
                    keypress: function (event) {
                        let gd_tmpobj = $(this);
                        let gd_tmpval = gd_tmpobj.val();
                        if (gd_tmpval.length == 0 && event.which == 46) {
                            event.preventDefault();
                            return;
                        }
                        if (gd_tmpval.indexOf('.') != -1 && event.which == 46) {
                            event.preventDefault();
                            return;
                        }
                        if (event.which && (event.which < 48 || event.which > 57) && event.which != 8 && event.which != 46) {
                            event.preventDefault();
                            return;
                        }
                    },
                    blur: function () {
                        let gd_tmpobj = $(this);
                        let gd_tmpval = Math.abs(parseFloat(gd_tmpobj.val()));
                        gd_tmpval = isNaN(gd_tmpval) ? gd_tmpobj.prop('placeholder') : gd_tmpval;
                        gd_tmpobj.val(gd_tmpval);
                    }
                }, '#gd_input_minprice').on({
                    keypress: function (event) {
                        if (event.which && (event.which < 48 || event.which > 57) && event.which != 8) {
                            event.preventDefault();
                            return;
                        }
                    },
                    blur: function () {
                        let gd_tmpobj = $(this),
                        gd_tmpval;
                        if (gd_tmpobj.hasClass('gd_input_s')) {
                            gd_tmpval = Math.abs(parseInt(gd_tmpobj.val()));
                            gd_tmpval = isNaN(gd_tmpval) ? gd_tmpobj.prop('placeholder') : gd_tmpval;
                            if (gd_tmpobj.prop('id') == 'gd_input_h') {
                                gd_tmpval = (gd_tmpval < 0 || gd_tmpval > 23) ? gd_tmpobj.prop('placeholder') : gd_tmpval;
                            } else {
                                gd_tmpval = (gd_tmpval < 0 || gd_tmpval > 59) ? gd_tmpobj.prop('placeholder') : gd_tmpval;
                            }
                            gd_tmpobj.val(gd_strformat(gd_tmpval, 2));
                        } else {
                            gd_tmpval = Math.abs(parseInt(gd_tmpobj.val()));
                            gd_tmpval = isNaN(gd_tmpval) ? gd_tmpobj.prop('placeholder') : gd_tmpval;
                            gd_tmpobj.val(gd_tmpval);
                        }
                    }
                }, '.gd_input:not([id="gd_input_minprice"]):not([id="gd_input_chkurl"]),.gd_input_s');
            } else {
                //非包页面
            }
            function gd_chkconf() {
                gd_confobj.gd_chknow = gd_confobj.gd_chknow !== !default_conf.gd_chknow ? default_conf.gd_chknow : !default_conf.gd_chknow;
                gd_confobj.gd_needtologin = gd_confobj.gd_needtologin !== !default_conf.gd_needtologin ? default_conf.gd_needtologin : !default_conf.gd_needtologin;
                gd_confobj.gd_chklatestbundle = gd_confobj.gd_chklatestbundle !== !default_conf.gd_chklatestbundle ? default_conf.gd_chklatestbundle : !default_conf.gd_chklatestbundle;
                gd_confobj.gd_type_games = gd_confobj.gd_type_games !== !default_conf.gd_type_games ? default_conf.gd_type_games : !default_conf.gd_type_games;
                gd_confobj.gd_type_books = gd_confobj.gd_type_books !== !default_conf.gd_type_books ? default_conf.gd_type_books : !default_conf.gd_type_books;
                gd_confobj.gd_type_software = gd_confobj.gd_type_software !== !default_conf.gd_type_software ? default_conf.gd_type_software : !default_conf.gd_type_software;
                gd_confobj.gd_type_other = gd_confobj.gd_type_other !== !default_conf.gd_type_other ? default_conf.gd_type_other : !default_conf.gd_type_other;
                if (!(gd_confobj.gd_type_games || gd_confobj.gd_type_books || gd_confobj.gd_type_software || gd_confobj.gd_type_other))
                    gd_confobj.gd_type_games = default_conf.gd_type_games;
                gd_confobj.gd_chkd = parseInt(gd_confobj.gd_chkd);
                gd_confobj.gd_chkd = (gd_confobj.gd_chkd > 7 || gd_confobj.gd_chkd < 1) ? default_conf.gd_chkd : gd_confobj.gd_chkd;
                gd_confobj.gd_chkh = parseInt(gd_confobj.gd_chkh);
                gd_confobj.gd_chkh = (gd_confobj.gd_chkh > 23 || gd_confobj.gd_chkh < 0) ? default_conf.gd_chkh : gd_confobj.gd_chkh;
                gd_confobj.gd_chkm = parseInt(gd_confobj.gd_chkm);
                gd_confobj.gd_chkm = (gd_confobj.gd_chkm > 59 || gd_confobj.gd_chkm < 0) ? default_conf.gd_chkm : gd_confobj.gd_chkm;
                gd_confobj.gd_chks = parseInt(gd_confobj.gd_chks);
                gd_confobj.gd_chks = (gd_confobj.gd_chks > 59 || gd_confobj.gd_chks < 0) ? default_conf.gd_chks : gd_confobj.gd_chks;
                gd_confobj.gd_chkinterval = parseInt(gd_confobj.gd_chkinterval);
                gd_confobj.gd_chkinterval = gd_confobj.gd_chkinterval < 1 ? default_conf.gd_chkinterval : gd_confobj.gd_chkinterval;
                gd_confobj.gd_chkmaxtime = parseInt(gd_confobj.gd_chkmaxtime);
                gd_confobj.gd_chkmaxtime = gd_confobj.gd_chkmaxtime < 0 ? default_conf.gd_chkmaxtime : gd_confobj.gd_chkmaxtime;
                gd_confobj.gd_chkminprice = parseFloat(gd_confobj.gd_chkminprice);
                gd_confobj.gd_chkminprice = gd_confobj.gd_chkminprice < 0 ? default_conf.gd_chkminprice : gd_confobj.gd_chkminprice;
                gd_confobj.gd_chkpricetime = parseInt(gd_confobj.gd_chkpricetime);
                gd_confobj.gd_chkpricetime = gd_confobj.gd_chkpricetime < 0 ? default_conf.gd_chkpricetime : gd_confobj.gd_chkpricetime;
                gd_confobj.gd_chkurl = $.trim(gd_confobj.gd_chkurl);
                gd_confobj.gd_chkurl = gd_confobj.gd_chkurl ? gd_confobj.gd_chkurl : default_conf.gd_chkurl;
            }
            function gd_showconf(confobj) {
                gd_page_conf.find('#gd_chknowbox').prop('checked', !!confobj.gd_chknow);
                gd_page_conf.find('#gd_needloginbox').prop('checked', !!confobj.gd_needtologin);
                gd_page_conf.find('#gd_latestbundlebox').prop('checked', !!confobj.gd_chklatestbundle);
                gd_page_conf.find('#gd_gamestypebox').prop('checked', !!confobj.gd_type_games);
                gd_page_conf.find('#gd_bookstypebox').prop('checked', !!confobj.gd_type_books);
                gd_page_conf.find('#gd_softwaretypebox').prop('checked', !!confobj.gd_type_software);
                gd_page_conf.find('#gd_othertypebox').prop('checked', !!confobj.gd_type_other);
                gd_page_conf.find('#gd_select_d').val(confobj.gd_chkd);
                gd_page_conf.find('#gd_input_h').val(gd_strformat(confobj.gd_chkh, 2));
                gd_page_conf.find('#gd_input_m').val(gd_strformat(confobj.gd_chkm, 2));
                gd_page_conf.find('#gd_input_s').val(gd_strformat(confobj.gd_chks, 2));
                gd_page_conf.find('#gd_input_interval').val(confobj.gd_chkinterval);
                gd_page_conf.find('#gd_input_maxtime').val(confobj.gd_chkmaxtime);
                gd_page_conf.find('#gd_input_minprice').val(confobj.gd_chkminprice);
                gd_page_conf.find('#gd_input_pricetime').val(confobj.gd_chkpricetime);
                gd_page_conf.find('#gd_input_chkurl').val(confobj.gd_chkurl == default_conf.gd_chkurl ? '' : confobj.gd_chkurl);
            }
            function gd_strformat(gd_str, gd_strlength) {
                gd_str = gd_str.toString();
                while (gd_str.length < gd_strlength) {
                    gd_str = '0' + gd_str;
                }
                return gd_str;
            }
            function gd_addStyle(gd_style) {
                return $('<style type="text/css">' + gd_style + '</style>').appendTo($('head'));
            }
            function gd_getValue(gd_valuename) {
                return localStorage.getItem(gd_valuename);
            }
            function gd_setValue(gd_valuename, gd_value) {
                localStorage.setItem(gd_valuename, gd_value);
            }
            function gd_deleteValue(gd_valuename) {
                localStorage.removeItem(gd_valuename);
            }
            async function gd_chkfnc() {
                gd_inprocess = true;
                if (!gd_chkstart()) {
                    if (gd_interval_chklatest) {
                        clearTimeout(gd_interval_chklatest);
                        gd_interval_chklatest = 0;
                    }
                    return;
                }
                let gd_tmpwindow;
                if (gd_confobj.gd_chklatestbundle) {
                    checkExpire();
                    if (!gd_bundleurl) {
                        if (gd_interval_chklatest) {
                            clearTimeout(gd_interval_chklatest);
                            gd_interval_chklatest = 0;
                        }
                        gd_bundleurl = await getLatestBundleUrl(gd_confobj.gd_chkurl);
                        if (!gd_bundleurl) {
                            console.warn('[warn]gd_bundleurl is not exists.');
                            gd_btn_ckeck.addClass('warn');
                            gd_t = setTimeout(gd_chkfnc, gd_confobj.gd_chkinterval);
                            return;
                        }
                    }
                    gd_btn_ckeck.removeClass('warn');
                    if (!gd_interval_chklatest)
                        gd_interval_chklatest = setTimeout(getLatestBundleLoop, 3e4);
                }
                gd_tmpwindow = window.open(gd_bundleurl, '', '');
                gd_n = 0;
                gd_t2 = setInterval(function () {
                    gd_windowchk(gd_tmpwindow);
                }, 500);
                gd_tmpwindow.gd_checking = 1;
                $(gd_tmpwindow).on('load', function () {
                    clearInterval(gd_t2);
                    if (gd_confobj.gd_needtologin && !this.$('.logged-in').length) {
                        gd_page_conf.find('.gd_savebtn').removeClass('disabled');
                        gd_page_conf.find('.gd_restorebtn').removeClass('disabled');
                        gd_btn_ckeck.attr('running', 0).find('span>span').text('Check');
                        alert('Please login!');
                        gd_inprocess = false;
                        return;
                    }
                    let gd_tmpavg = 0,
                    gd_tmpbundle = '',
                    gd_tmpArr;
                    gd_tmpbundle = gd_getbundle(this);
                    if (gd_tmpbundle && gd_bundle != gd_tmpbundle) {
                        gd_avg = -1;
                        gd_symbol = '';
                        gd_bundle = gd_tmpbundle;
                        gdWindow = null;
                        gd_conttime = 0;
                    }
                    gd_tmpArr = gd_getavg(this);
                    gd_tmpavg = gd_tmpArr[0];
                    if (gd_tmpavg > 0) {
                        if (gd_tmpArr[1] && gd_tmpArr[1] != gd_symbol) {
                            gd_symbol = gd_tmpArr[1];
                            gd_avg = -1;
                        }
                        if (gd_avg <= 0 || (gd_avg > 0 && gd_tmpavg < gd_avg)) {
                            gd_avg = gd_tmpavg;
                            if (gdWindow)
                                gdWindow.close();
                            gdWindow = gd_tmpwindow;
                            gdWindow.document.title = gd_symbol + gd_avg;
                            gd_btn_ckeck.find('span>span').text('Checking(' + gd_symbol + gd_avg + ')');
                            gd_conttime = 0;
                        } else {
                            gd_tmpwindow.close();
                            gd_conttime++;
                        }
                    } else {
                        this.close();
                    }
                    gd_chktime++;
                    if ((gd_btn_ckeck.attr('running') == 1) && (gd_confobj.gd_chkpricetime <= 0 || gd_confobj.gd_chkpricetime > gd_chktime) && (gd_confobj.gd_chkmaxtime <= 0 || gd_confobj.gd_chkmaxtime > gd_conttime) && (gd_confobj.gd_chkminprice <= 0 || gd_avg == -1 || gd_avg > 0 && gd_confobj.gd_chkminprice < gd_avg)) {
                        gd_t = setTimeout(gd_chkfnc, gd_confobj.gd_chkinterval);
                    } else {
                        gd_page_conf.find('.gd_savebtn').removeClass('disabled');
                        gd_page_conf.find('.gd_restorebtn').removeClass('disabled');
                        gd_btn_ckeck.attr('running', 0).find('span>span').text('Check' + (gd_avg && gd_avg > 0 ? '(' + gd_symbol + gd_avg + ')' : ''));
                    }
                    gd_inprocess = false;
                });
            }
            function gdAjax(options, count = 0) {
                return new Promise((resolve, reject) => {
                    jQuery.ajax(options).done(resolve).fail((resp, status, error) => {
                        if (count++ >= 2) {
                            reject(resp, status, error);
                        } else {
                            return gdAjax(options, count).then(resolve, reject);
                        }
                    });
                });
            }
            function getLatestBundleData(url) {
                return gdAjax({
                    url: url,
                    type: 'get',
                    timeout: 3e4
                }).then((resp) => {
                    let jsonData = jQuery.trim(jQuery(resp).filter('#landingPage-json-data').text());
                    if (jsonData) {
                        try {
                            let bundleData = JSON.parse(jsonData),
                            date = new Date(),
                            latestBundleData = null;
                            for (let type in bundleData.data) {
                                switch (type) {
                                case 'popular':
                                    continue;
                                case 'games':
                                    if (!gd_confobj.gd_type_games)
                                        continue;
                                    break;
                                case 'books':
                                    if (!gd_confobj.gd_type_books)
                                        continue;
                                    break;
                                case 'software':
                                    if (!gd_confobj.gd_type_software)
                                        continue;
                                    break;
                                default:
                                    if (!gd_confobj.gd_type_other)
                                        continue;
                                }
                                let mosaic = bundleData.data[type].mosaic;
                                if (!(mosaic && mosaic.length))
                                    continue;
                                for (let i = 0; i < mosaic.length; i++) {
                                    let products = mosaic[i].products;
                                    if (!(products && products.length))
                                        continue;
                                    for (let j = 0; j < products.length; j++) {
                                        let startDate = new Date(products[j]['start_date|datetime'] + 'Z'),
                                        endDate = new Date(products[j]['end_date|datetime'] + 'Z');
                                        if (endDate < date || startDate - date > 3e5)
                                            continue;
                                        if (!latestBundleData || latestBundleData.startDate < startDate) {
                                            latestBundleData = {
                                                url: jQuery.trim(products[j].product_url),
                                                startDate: startDate,
                                                endDate: endDate
                                            }
                                        }
                                    }
                                }
                            }
                            if (latestBundleData)
                                return latestBundleData;
                            console.error('latestBundleData is null');
                        } catch (e) {
                            console.error(e);
                        }
                        return
                    } else {
                        console.warn(resp);
                    }
                }, (resp) => {
                    console.warn(resp);
                });
            }
            async function getLatestBundleUrl(url) {
                let data = await getLatestBundleData(url);
                if (data) {
                    if (gd_bundleData) {
                        if (gd_bundleData.startDate !== data.startDate || gd_bundleData.endDate !== data.endDate || gd_bundleData.url !== data.url)
                            gd_bundleData = data;
                    } else {
                        gd_bundleData = data;
                    }
                }
                return gd_bundleData ? gd_bundleData.url : '';
            }
            function checkExpire() {
                let date = new Date();
                if (gd_bundleData && (gd_bundleData.endDate < date || gd_bundleData.startDate - date > 3e5)) {
                    gd_bundleData = null;
                    gd_bundleurl = '';
                    console.log('Data has expired.');
                }
            }
            async function getLatestBundleLoop() {
                let url = await getLatestBundleUrl(gd_confobj.gd_chkurl);
                if (url)
                    gd_bundleurl = url;
                if (gd_btn_ckeck.attr('running') == 1) {
                    gd_interval_chklatest = setTimeout(getLatestBundleLoop, 3e4);
                } else {
                    gd_interval_chklatest = 0;
                }
            }
            function gd_getavg(gd_win) {
                if (!gd_win) {
                    console.warn('[warn]gd_getavg: gd_win is not defined');
                    return 0;
                }
                let gd_tmpavg = gd_win.avgPrice,
                gd_tmpsymbol = gd_win.avgSymbol;
                if (gd_tmpavg <= 0)
                    gd_tmpavg = -1;
                return [gd_tmpavg, gd_tmpsymbol];
            }
            function gd_getbundle(gd_win) {
                if (!gd_win) {
                    console.warn('[warn]gd_getbundle: gd_win is not defined');
                    return '';
                }
                let gd_tmpbundle = gd_win.$('meta[name=title]').prop('content');
                if (!gd_tmpbundle.replace(' ', ''))
                    gd_tmpbundle = $.trim(gd_win.$('div.dd-navbar-product-name').text());
                if (!gd_tmpbundle.replace(' ', '')) {
                    gd_tmpbundle = '';
                } else if (gd_tmpbundle.substr(0, 7) != 'Humble ') {
                    gd_tmpbundle = 'Humble ' + gd_tmpbundle;
                }
                return gd_tmpbundle;
            }
            function gd_chkstart() {
                if (!gd_confobj.gd_chknow) {
                    let gd_date = new Date();
                    let gd_stime = new Date(1000 * 60 * 60 * 24 * (gd_confobj.gd_chkd - gd_date.getDay()) + gd_date.getTime());
                    gd_stime.setHours(gd_confobj.gd_chkh);
                    gd_stime.setMinutes(gd_confobj.gd_chkm);
                    gd_stime.setSeconds(gd_confobj.gd_chks);
                    if (gd_stime > gd_date) {
                        if (gd_btn_ckeck.attr('running') == 1) {
                            gd_btn_ckeck.find('span>span').text('Waiting');
                            gd_t = setTimeout(gd_chkfnc, 500);
                        } else {
                            gd_page_conf.find('.gd_savebtn').removeClass('disabled');
                            gd_page_conf.find('.gd_restorebtn').removeClass('disabled');
                            gd_btn_ckeck.attr('running', 0).find('span>span').text('Check');
                            clearInterval(gd_t2);
                        }
                        gd_inprocess = false;
                        return false;
                    }
                }
                gd_btn_ckeck.find('span>span').text('Checking');
                return true;
            }
            function gd_windowchk(gd_win) {
                if (!gd_win)
                    console.warn('[warn]gd_windowchk: gd_win is not defined');
                gd_n++;
                if (gd_win.closed || gd_n > 120) {
                    gd_win.close();
                    clearTimeout(gd_t);
                    clearInterval(gd_t2);
                    gd_inprocess = false;
                    if (gd_btn_ckeck.attr('running') == 1) {
                        gd_t = setTimeout(gd_chkfnc, gd_confobj.gd_chkinterval);
                    } else {
                        gd_page_conf.find('.gd_savebtn').removeClass('disabled');
                        gd_page_conf.find('.gd_restorebtn').removeClass('disabled');
                        gd_btn_ckeck.attr('running', 0).find('span>span').text('Check' + (gd_avg && gd_avg > 0 ? '(' + gd_symbol + gd_avg + ')' : ''));
                    }
                }
            }
        }, 1);
    });
})();