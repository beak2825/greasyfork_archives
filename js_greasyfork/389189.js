// ==UserScript==
// @name         Steam添加FOD
// @namespace    sourcewater
// @version      0.39.17
// @description  更多请访问链接：https://keylol.com/t514316-1-1
// @author       sourcewater
// @match        https://store.steampowered.com/account/registerkey
// @grant        GM_xmlhttpRequest
// @connect      steamstore-a.akamaihd.net
// @downloadURL https://update.greasyfork.org/scripts/389189/Steam%E6%B7%BB%E5%8A%A0FOD.user.js
// @updateURL https://update.greasyfork.org/scripts/389189/Steam%E6%B7%BB%E5%8A%A0FOD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getText(f){
        return f.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '');
    }

    let maincontent=document.getElementById("main_content");
    let leftcontent=document.getElementsByClassName("leftcol")[0];
    let headelement=document.getElementsByTagName("head")[0];

    let dselectscriptnode=document.createElement("script");
    dselectscriptnode.type="text/javascript";
    GM_xmlhttpRequest({
        method: "get",
        url: "https://steamstore-a.akamaihd.net/public/shared/javascript/dselect.js?v=yT8Q5U2-O4wX&l=schinese",
        onload: function(res){
            if(res.status === 200){
                dselectscriptnode.innerHTML=res.responseText;
            }else{
                console.log("load dselect script failed!")
            }
        },onerror : function(err){
            console.log("server error!")
        }
    });

    let steamaccountcss=getText(function(){/*
        .steamaccount_currencyselect {
            text-align: right;
        }

        .steamaccount_currencyselect .dselect_container {
            display: inline-block;
            vertical-align: middle;
            text-align: left;
        }

        .currency_change_confirm_dialog {
            max-width: 670px;
        }

        .currency_change_confirm_dialog p {
            margin: 24px 0;
        }

        .currency_change_confirm_dialog b {
            color: #67c1f5;
            font-weight: normal;
        }

        .currency_change_option_ctn {
            vertical-align: top;
            margin: 0 6%;
        }
        .currency_change_option_ctn:first-child {
            margin-bottom: 12px;
        }

        .currency_change_option {
            font-family: "Motiva Sans", Sans-serif;
            font-weight: 300;

            display: block;
        }

        .currency_change_option > span {
            display: block;
            padding: 9px 19px;
        }

        .currency_change_option .country {
            font-size: 20px;
        }
        .currency_change_option .notes {
            font-size: 13px;
            line-height: 18px;
        }

        .currency_change_option_ctn > p {
            font-size: 12px;
            margin: 8px 8px 0 8px;
        }

        p.currency_change_confirm_dialog_footer {
            margin-top: 128px;
        }

        .youraccount_updating_shipping_button_row {
            padding-top: 10px;
        }
        #s_s_s_s_free_game_list span,
        #s_s_s_s_free_game_list_failed span,
        #s_s_s_s_free_game_list_owned span{
            font-weight: bold;
            display: inline-block;
            font-size: 13px;
            vertical-align: middle;
            line-height: 20px;
            height: 20px;
        }
        #s_s_s_s_free_game_list .s_s_s_s_free_game_list_row,
        #s_s_s_s_free_game_list_failed .s_s_s_s_free_game_list_row,
        #s_s_s_s_free_game_list_owned .s_s_s_s_free_game_list_row{
            margin-top: 7px;
            white-space: nowrap;
        }
        #s_s_s_s_free_game_list .s_s_s_s_free_game_list_index,
        #s_s_s_s_free_game_list_failed .s_s_s_s_free_game_list_index,
        #s_s_s_s_free_game_list_owned .s_s_s_s_free_game_list_index{
            width: 30px;
            text-align: right;
            padding: 0px 5px;
            border-radius:4px;
        }
        #s_s_s_s_free_game_list .s_s_s_s_free_game_list_subid,
        #s_s_s_s_free_game_list_failed .s_s_s_s_free_game_list_subid,
        #s_s_s_s_free_game_list_owned .s_s_s_s_free_game_list_subid{
            color: #ffffff;
            background-color: rgba(199,99,158,0.5);
            margin: 0px 3px;
            width: 70px;
            text-align: center;
            padding: 0px 5px;
            border-radius:4px;
        }

        #s_s_s_s_free_game_list .s_s_s_s_free_game_list_status,
        #s_s_s_s_free_game_list_owned .s_s_s_s_free_game_list_status{
            color: #d00;
            background-color: #aaa;
            margin: 0px 3px;
            text-align: center;
            padding: 0px 5px;
            border-radius:4px;
        }
        #s_s_s_s_free_game_list .s_s_s_s_free_game_list_status{
            width: 30px;
        }
        #s_s_s_s_free_game_list_owned .s_s_s_s_free_game_list_status{
            width: 45px;
        }
        #s_s_s_s_free_game_list .s_s_s_s_free_game_list_name,
        #s_s_s_s_free_game_list_failed .s_s_s_s_free_game_list_status{
            margin: 0px 3px;
            padding: 0px 5px;
            border-radius:4px;
            text-align: left;
        }
        #s_s_s_s_free_game_list_failed .s_s_s_s_free_game_list_status{
            color: #ff7b00;
            background-color: rgba(255,255,255,0.1);
        }
        #s_s_s_s_free_game_list .s_s_s_s_free_game_list_name{
            color: #236;
            background-color: #eeeeee;
        }
    */});

    let cleardiv=getText(function(){/*
        <div style="clear: both;"></div><br>
    */});

    let steamaccountcssnode=document.createElement("style");
    steamaccountcssnode.type="text/css";
    steamaccountcssnode.innerHTML=steamaccountcss;
    headelement.appendChild(steamaccountcssnode);
    let changecurrencycontainer=document.createElement("div");
    changecurrencycontainer.setAttribute("id","s_s_s_s_change_currency_container");

    jQuery.get("//store.steampowered.com/cart",function(result){
        let framenode=document.createElement("frame");
        framenode.innerHTML=result;
        let allscripts=framenode.getElementsByTagName("script");
        let changecurrencyscript;
        let ccnodes=framenode.getElementsByClassName("cart_currency_select");
        if(ccnodes.length>0){
            let changecurrency=ccnodes[0];
            changecurrency.style="position:relative;";
            changecurrency=changecurrency.parentNode;
            for(let i=0;i<allscripts.length;++i){
                let text=allscripts[i].innerHTML;
                if(text.match(/OnUserCountryCurrencyChange/)&&text.match(/PresentCountryCurrencyChangeDialog/)){
                    changecurrencyscript=text;
                    headelement.appendChild(dselectscriptnode);
                    console.log("账单地址与IP不同。");
                }
            }
            let changecurrencyscriptnode=document.createElement("script");
            changecurrencyscriptnode.type="text/javascript";
            if(changecurrency){
                changecurrencyscriptnode.innerHTML=changecurrencyscript.replace("https://store.steampowered.com/cart/","https://store.steampowered.com/account/registerkey");
                headelement.appendChild(changecurrencyscriptnode);
                document.getElementById("s_s_s_s_change_currency_container").innerHTML=changecurrency.outerHTML;
            }
        }else{
            console.log("账单地址与IP一致。");
        }
    });

    let batchredeemscript=getText(function(){/*

        var s_s_s_autoDivideNum = 9;
        var s_s_s_waitingSeconds = 20;
        var s_s_s_ajaxTimeout = 15;

        var s_s_s_keyCount = 0;
        var s_s_s_recvCount = 0;
        var s_s_s_timer;

        var s_s_s_allUnusedKeys = [];

        var s_s_s_failureDetail = {
            14: '无效激活码',
            15: '重复激活',
            53: '次数上限',
            13: '地区限制',
            9: '已拥有',
            24: '缺少主游戏',
            36: '需要PS3?',
            50: '这是充值码',
        };

        var s_s_s_myTexts = {
            fail: '失败',
            success: '成功',
            network: '网络错误或超时',
            line: '——',
            nothing: '',
            others: '其他错误',
            unknown: '未知错误',
            redeeming: '激活中',
            waiting: '等待中',
            showUnusedKey: '显示未使用的Key',
            hideUnusedKey: '隐藏未使用的Key',
        };

        var s_s_s_unusedKeyReasons = [
            '次数上限',
            '地区限制',
            '已拥有',
            '缺少主游戏',
            '其他错误',
            '未知错误',
            '网络错误或超时',
        ];

        function s_s_s_redeemKey(key) {
            jQuery.ajax({
                url: 'https://store.steampowered.com/account/ajaxregisterkey/',
                data: {
                    product_key: key,
                    sessionid: g_sessionID
                },
                type: 'post',
                dataType: 'json',
                timeout: 1000 * s_s_s_ajaxTimeout,
                beforeSend: function(){
                    if (jQuery('table').is(':hidden')) {
                        jQuery('table').fadeIn();
                    }
                },
                complete: function() {
                },
                error: function() {
                    s_s_s_tableUpdateKey(key, s_s_s_myTexts.fail, s_s_s_myTexts.network, 0, s_s_s_myTexts.nothing);
                    return;
                },
                success: function(data) {
                    //console.log(data);

                    if (data.success == 1) {
                        s_s_s_tableUpdateKey(key, s_s_s_myTexts.success, s_s_s_myTexts.line,
                                             data.purchase_receipt_info.line_items[0].packageid,
                                             data.purchase_receipt_info.line_items[0].line_item_description);
                        return;
                    } else if (data.purchase_result_details !== undefined && data.purchase_receipt_info) {
                        if (!data.purchase_receipt_info.line_items[0]) {
                            s_s_s_tableUpdateKey(key, s_s_s_myTexts.fail,
                                                 s_s_s_failureDetail[data.purchase_result_details] ? s_s_s_failureDetail[data.purchase_result_details] : s_s_s_myTexts.others,
                                                 0, s_s_s_myTexts.nothing);
                        } else {
                            s_s_s_tableUpdateKey(key, s_s_s_myTexts.fail,
                                                 s_s_s_failureDetail[data.purchase_result_details] ? s_s_s_failureDetail[data.purchase_result_details] : s_s_s_myTexts.others,
                                                 data.purchase_receipt_info.line_items[0].packageid,
                                                 data.purchase_receipt_info.line_items[0].line_item_description);
                        }
                        return;
                    }
                    tableUpdateKey(key, s_s_s_myTexts.fail, s_s_s_myTexts.nothing, 0, s_s_s_myTexts.nothing);
                }
            });
        }

        function s_s_s_setUnusedKeys(key, success, reason, subId, subName) {
            if (success && s_s_s_allUnusedKeys.includes(key)) {
                s_s_s_allUnusedKeys = s_s_s_allUnusedKeys.filter(function(keyItem){
                    return keyItem != key;
                });

                var listObjects = jQuery('li');
                for(var i = 0; i < listObjects.length; i++) {
                    var listElement = listObjects[i];
                    var listObject = jQuery(listElement);

                    if(listElement.innerHTML.includes(key)) {
                        listObject.remove();
                    }
                }
            } else if (!success && !s_s_s_allUnusedKeys.includes(key) &&
                       s_s_s_unusedKeyReasons.includes(reason)) {
                var listObject = jQuery('<li></li>');
                listObject.html(key + ' ( ' + reason +
                                (subId != 0 ? (': <code>' + subId + '</code> ' + subName) : '') +
                                ' )');
                jQuery('#unusedKeys').append(listObject);

                s_s_s_allUnusedKeys.push(key);
            }
        }

        function s_s_s_tableInsertKey(key) {
            s_s_s_keyCount++;
            var row = jQuery('<tr></tr>');
            // number
            row.append('<td class="nobr">' + s_s_s_keyCount + '</td>');
            //key
            row.append('<td class="nobr"><code>' + key + '</code></td>');
            //redeeming...
            row.append('<td colspan="3">' + s_s_s_myTexts.redeeming + '...</td>');

            jQuery('tbody').prepend(row);
        }

        function s_s_s_tableWaitKey(key) {
            s_s_s_keyCount++;
            var row = jQuery('<tr></tr>');
            // number
            row.append('<td class="nobr">' + s_s_s_keyCount + '</td>');
            //key
            row.append('<td class="nobr"><code>' + key + '</code></td>');
            //waiting...
            row.append('<td colspan="3">' + s_s_s_myTexts.waiting +
                       ' (' + s_s_s_waitingSeconds + '秒)...</td>');

            jQuery('tbody').prepend(row);
        }

        function s_s_s_tableUpdateKey(key, result, detail, subId, subName) {
            s_s_s_setUnusedKeys(key, result === s_s_s_myTexts.success, detail, subId, subName);

            s_s_s_recvCount++;
            if (s_s_s_recvCount == s_s_s_keyCount) {
                jQuery('#buttonRedeem').fadeIn();
                jQuery('#inputKey').removeAttr('disabled');
            }

            var rowObjects = jQuery('tr');
            for (var i = 1; i < rowObjects.length; i++) {
                var rowElement = rowObjects[i];
                var rowObject = jQuery(rowElement);

                if (rowObject.children()[1].innerHTML.includes(key)&&
                    rowObject.children()[2].innerHTML.includes(s_s_s_myTexts.redeeming)) {
                    rowObject.children()[2].remove();

                    // result
                    if (result == s_s_s_myTexts.fail) rowObject.append('<td class="nobr" style="color:red">' + result + '</td>');
                    else rowObject.append('<td class="nobr" style="color:green">' + result + '</td>');
                    // detail
                    rowObject.append('<td class="nobr">' + detail + '</td>');
                    // sub
                    if (subId === 0) {
                        rowObject.append('<td>——</td>');
                    } else {
                        rowObject.append('<td><code>' + subId + '</code> <a href="https://steamdb.info/sub/' +
                                         subId + '/" target="_blank">' + subName + '</a></td>');
                    }
                    break;
                }
            }
        }

        function s_s_s_getKeysByRE(text) {
            text = text.trim().toUpperCase();
            var reg = new RegExp('([0-9A-Z]{5}-?){2,4}[0-9A-Z]{5}', 'g');
            var keys = [];

            var result = void 0;
            while (result = reg.exec(text)) {
                keys.push(result[0]);
            }

            return keys;
        }

        function s_s_s_startTimer() {
            s_s_s_timer = setInterval(function() {
                var flag = false;
                var nowKey = 0;

                var rowObjects = jQuery('tr');
                for (var i = rowObjects.length - 1; i >= 1; i--) {
                    var rowElement = rowObjects[i];
                    var rowObject = jQuery(rowElement);
                    if (rowObject.children()[2].innerHTML.includes(s_s_s_myTexts.waiting)) {
                        nowKey++;
                        if (nowKey <= s_s_s_autoDivideNum) {
                            var key = rowObject.children()[1].innerHTML.substring(6);
                            key = key.substring(0, key.indexOf('</code>'));
                            rowObject.children()[2].innerHTML = '<td colspan="3">' + s_s_s_myTexts.redeeming + '...</td>';
                            s_s_s_redeemKey(key);
                        } else {
                            flag = true;
                            break;
                        }
                    }
                }
                if (!flag) {
                    clearInterval(s_s_s_timer);
                }
            }, 1000 * s_s_s_waitingSeconds);
        }

        function s_s_s_redeemKeys() {
            var keys = s_s_s_getKeysByRE(jQuery('#inputKey').val().trim());
            if (keys.length <= 0) {
                ShowAlertDialog("失败","没有找到符合格式的key！");
                return;
            }

            jQuery('#buttonRedeem').fadeOut();
            jQuery('#inputKey').attr('disabled', 'disabled');

            var nowKey = 0;
            keys.forEach(function (key) {
                nowKey++;
                if (nowKey <= s_s_s_autoDivideNum) {
                    s_s_s_tableInsertKey(key);
                    s_s_s_redeemKey(key);
                } else {
                    s_s_s_tableWaitKey(key);
                }
            });

            if (nowKey > s_s_s_autoDivideNum) {
                s_s_s_startTimer();
            }
        }

        function s_s_s_toggleUnusedKeyArea() {
            if (jQuery('#unusedKeyArea').is(':hidden')) {
                jQuery('#unusedKeyArea').fadeIn();
            } else {
                jQuery('#unusedKeyArea').fadeOut();
            }
        }

        function s_s_s_showUnusedKey() {
            s_s_s_toggleUnusedKeyArea();
            if (this.innerHTML.includes(s_s_s_myTexts.showUnusedKey)) {
                this.innerHTML = this.innerHTML.replace(s_s_s_myTexts.showUnusedKey, s_s_s_myTexts.hideUnusedKey);
            } else {
                this.innerHTML = this.innerHTML.replace(s_s_s_myTexts.hideUnusedKey, s_s_s_myTexts.showUnusedKey);
            }
        }

    */});

    let batchredeemscriptnode=document.createElement("script");
    batchredeemscriptnode.innerHTML=batchredeemscript;
    headelement.appendChild(batchredeemscriptnode);
    let batchredeemkey=getText(function(){/*

        <br>
            <div class="block_content checkout_content_box" style="height:230px;" class="registerkey_input_box_text">
                <div>产品代码</div>
        <div style="float: left;">
            <textarea class="form-control" cols="80" rows="10" name="inputKey" id="inputKey" class="registerkey_input_box_text" placeholder="支持批量激活，可以把整个网页文字复制过来&#10;若一次激活的Key的数量超过9个则会自动分批激活（等待20秒）"></textarea>
        </div>
        <div class="button_row">
            <a tabindex="300" id="buttonRedeem" class="btnv6_blue_hoverfade btn_medium" href="javascript:s_s_s_redeemKeys();" style="margin:10px 0px;">
                <span>激活！</span>
        </a>
        &nbsp;&nbsp;
        <a tabindex="300" id="buttonShowUnused" class="btnv6_blue_hoverfade btn_medium" href="javascript:s_s_s_showUnusedKey();" style="margin:10px 0px;">
            <span>显示未使用的Key</span>
        </a>
        </div>
        </div>
        <br>
            <br>
            <br>
            <br>
            <div class="notice_box_content" id="unusedKeyArea" style="display: none">
                <b>未使用的Key：</b><br>
        <div><ol id="unusedKeys">
            </ol></div>
                </div>

        <br>
                <div class="table-responsive table-condensed">
                    <table class="table table-hover" style="display: none">
                        <caption><h2>激活记录</h2></caption><thead><th>No.</th><th>Key</th>
                            <th>结果</th><th>详情</th><th>Sub</th></thead><tbody></tbody>
        </table></div><br><br><br>


    */});

    document.getElementById("registerkey_form").style.display="none";
    let keyexamplestext=document.getElementById("registerkey_examples_text");
    keyexamplestext.outerHTML=batchredeemkey+keyexamplestext.outerHTML;

    let outputtablecss = `
table a {
color: pink;
}
td {
white-space: nowrap;
overflow: hidden;
}
code {
padding:2px 4px;
font-size:90%;
color:#c7254e;
background-color:#f9f2f4;
border-radius:3px
}
.notice_box_content {
border: 1px solid #a25024;
border-radius: 3px;
width: 525px;
color: #acb2b8;
font-size: 14px;
font-family: "Motiva Sans", Sans-serif;
font-weight: normal;
padding: 15px 15px;
margin-bottom: 15px;
}
.notice_box_content b {
font-weight: normal;
color: #f47b20;
}
li {
white-space: nowrap;
overflow: hidden;
}
`;
    let outputtablenode=document.createElement("style");
    outputtablenode.type="text/css";
    outputtablenode.innerHTML=outputtablecss;
    headelement.appendChild(outputtablenode);

    let addtowishlistscript=getText(function(){/*

            function s_s_s_addtowishlistfunction(){
                let args=arguments[0].split(",");
                if(!args[0].trim().match(/^[\d]+$/)){
                    ShowAlertDialog("失败","请输入APP ID，多个APP ID用“,”隔开");
                    return;
                }
                let appidlist=new Array();
                for(let i=0;i<args.length;++i){
                    appidlist[i]=args[i].trim();
                }
                let bdialog;
                let i=0;
                function addwl(){
                    AddToWishlist(appidlist[i],'add_to_wishlist_area', 'add_to_wishlist_area_success', 'add_to_wishlist_area_fail','1_5_9__407');
                    if(document.getElementById("followgame_appid").checked){
                        jQuery.post( '//store.steampowered.com/explore/followgame/', {sessionid: g_sessionID,appid: appidlist[i]
                                                                                     }).done( function() {
                            console.log("followed");
                        }).fail( function() {
                            console.log("follow failed!");
                        });
                    }
                    if(i==(appidlist.length-1)){
                        if(i!=0) bdialog.Dismiss();
                        ShowAlertDialog("成功","已经全部添加至愿望单");
                        return;
                    }else{
                        if(bdialog) bdialog.Dismiss();
                        bdialog=ShowBlockingWaitDialog('正在添加...',(i+1)+'/'+appidlist.length);
                        ++i;
                        setTimeout(addwl,500);
                    }
                }
                addwl();
            }

        */});
    let addtowishlistscriptnode=document.createElement("script");
    addtowishlistscriptnode.innerHTML=addtowishlistscript;
    headelement.appendChild(addtowishlistscriptnode);
    let addtowishlist=getText(function(){/*

            <br>
                <br>
                <h2>输入APP ID添加锁偏好游戏至愿望单，输入SUB ID在Steam上添加免费产品。多个ID之间用“,”隔开。(<span style="color:#c6d4df;">锁国区的游戏需要切换账单。切换帐单会有点延迟，取决于网速，一开始点不动的话，等一会就能点了。</span>)</h2>
                <div>输入APP ID</div>
                <div style="float: left;" class="block_content checkout_content_box">
                <input style="width:450px;" name="wishlist_appid" id="wishlist_appid" type="text" class="registerkey_input_box_text" value="">
                </div>
                <div class="button_row">
                <a tabindex="300" href="javascript:s_s_s_addtowishlistfunction(document.getElementById('wishlist_appid').value);" class="btnv6_blue_hoverfade btn_medium">
                <span>添加至愿望单</span>
                </a>
                </div>

                <div style="clear: both;"></div>
                <div class="block_content checkout_content_box" style="margin-top:10px">
                <input type="checkbox" name="followgame_appid" value="1" id="followgame_appid">
                <label for="followgame_appid">
                <span>同时关注游戏</span>
                </label>
                </div>

                */});
    var addfreescript=getText(function(){/*

        function s_s_s_addfreefunction(){
            let args=arguments[0].split(",");
            if(!args[0].trim().match(/^[\d]+$/)){
                ShowAlertDialog("失败","请输入SUB ID，多个SUB ID用“,”隔开");
                return;
            }
            let subidlist=new Array();
            for(let i=0;i<args.length;++i){
                subidlist[i]=args[i].trim();
            }

            if (location.hostname !== 'store.steampowered.com') {
                alert('请在steam商店运行本代码！');
                return;
            } else if (typeof jQuery !== 'function') {
                ShowAlertDialog('失败', '脚本需要jQuery库！');
                return;
            } else if (document.getElementById('header_notification_area') === null) {
                ShowAlertDialog('失败', '你必须处于登录状态.');
                return;
            }

            let freePackages = subidlist;//change here[221306,221459]
            let freegamelistEle=document.getElementById("s_s_s_s_free_game_list");
            let addFreeFailedEle=document.getElementById("s_s_s_s_free_game_list_failed");
            let addFreeOwnedEle=document.getElementById("s_s_s_s_free_game_list_owned");
            let loaded = 0,
                total = freePackages.length,
                modal = ShowBlockingWaitDialog('正在添加...', '请等待所有请求结束。'),
                count=0,failCount=0,ownedCount=0,i=0;

            function addfreelicense(){
                if(GDynamicStore.s_rgOwnedPackages[freePackages[i]]){
                    ++loaded;
                    ++ownedCount;
                    if(addFreeOwnedEle.getElementsByClassName("s_s_s_s_free_game_list_row").length==0){
                        addFreeOwnedEle.innerHTML+=`<span class="s_s_s_s_free_game_list_index">索引</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_subid">SUB ID</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_status">状态</span><br>`;
                    }
                    let freegamelistownedItem=`<span class="s_s_s_s_free_game_list_row"><span class="s_s_s_s_free_game_list_index">${ownedCount}</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_subid"><a target="_blank" href="https://steamdb.info/sub/${freePackages[i]}">${freePackages[i]}</a></span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_status">已拥有</span></span><br>`;
                    addFreeOwnedEle.innerHTML+=freegamelistownedItem;
                    modal.Dismiss();

                    if (loaded === total) {
                        ShowAlertDialog('完成！', '已全部添加完毕。');
                    } else {
                        modal = ShowBlockingWaitDialog('正在添加...', '载入 ' + loaded + '/' + total);
                        ++i;
                        addfreelicense();
                    }
                }else{
                    jQuery.post(
                        '//store.steampowered.com/checkout/addfreelicense', {
                            action: 'add_to_cart',
                            sessionid: g_sessionID,
                            subid: freePackages[i]
                        },
                        function(data) {
                            ++loaded;
                            let resultFrame=document.createElement("frame");
                            resultFrame.innerHTML=data;
                            let afs=resultFrame.getElementsByClassName("add_free_content_success_area");
                            let errs=resultFrame.getElementsByClassName("error");
                            if(afs.length>0){
                                ++count;
                                if(freegamelistEle.getElementsByClassName("s_s_s_s_free_game_list_row").length==0){
                                    freegamelistEle.innerHTML+=`<span class="s_s_s_s_free_game_list_index">索引</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_subid">SUB ID</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_status">状态</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_name">游戏名称</span><br>`;
                                }
                                let addFreeSuccess=afs[0];
                                let gameName=/([^\n\r]*) 已被绑定至您的 Steam 帐户。/.exec(addFreeSuccess.firstElementChild.innerHTML)[1];
                                let freegamelistItem=`<span class="s_s_s_s_free_game_list_row"><span class="s_s_s_s_free_game_list_index">${count}</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_subid"><a target="_blank" href="https://steamdb.info/sub/${freePackages[i]}">${freePackages[i]}</a></span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_status">成功</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_name">${gameName}</span></span><br>`;
                                freegamelistEle.innerHTML+=freegamelistItem;
                            }
                            if(errs.length>0){
                                let errMessage=errs[0].innerHTML;
                                ++failCount;
                                if(addFreeFailedEle.getElementsByClassName("s_s_s_s_free_game_list_row").length==0){
                                    addFreeFailedEle.innerHTML+=`<span class="s_s_s_s_free_game_list_index">索引</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_subid">SUB ID</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_status">状态</span><br>`;
                                }
                                let freegamefailedlistItem=`<span class="s_s_s_s_free_game_list_row"><span class="s_s_s_s_free_game_list_index">${failCount}</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_subid"><a target="_blank" href="https://steamdb.info/sub/${freePackages[i]}">${freePackages[i]}</a></span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_status">${errMessage}</span></span><br>`;
                                addFreeFailedEle.innerHTML+=freegamefailedlistItem;
                            }
                            modal.Dismiss();

                            if (loaded === total) {
                                ShowAlertDialog('完成！', '已全部添加完毕。');
                            } else {
                                modal = ShowBlockingWaitDialog('正在添加...', '载入 ' + loaded + '/' + total);
                                ++i;
                                setTimeout(addfreelicense,200);
                            }
                        }
                    ).fail(function() {
                        ++loaded;

                        modal.Dismiss();

                        if (loaded === total) {
                            ShowAlertDialog('完成！', '已全部添加完毕。');
                        } else {
                            modal = ShowBlockingWaitDialog('正在添加...', '载入 ' + loaded + '/' + total);
                            ++i;
                            ++failCount;
                            if(addFreeFailedEle.getElementsByClassName("s_s_s_s_free_game_list_row").length==0){
                                addFreeFailedEle.innerHTML+=`<span class="s_s_s_s_free_game_list_index">索引</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_subid">SUB ID</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_status">状态</span><br>`;
                            }
                            let freegamefailedlistItem=`<span class="s_s_s_s_free_game_list_row"><span class="s_s_s_s_free_game_list_index">${failCount}</span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_subid"><a target="_blank" href="https://steamdb.info/sub/${freePackages[i]}">${freePackages[i]}</a></span>&nbsp;&nbsp;<span class="s_s_s_s_free_game_list_status">发送请求错误！</span></span><br>`;
                            addFreeFailedEle.innerHTML+=freegamefailedlistItem;
                            setTimeout(addfreelicense,200);
                        }
                    });
                }
            }
            addfreelicense();
        }

    */});
    let addfreescriptnode=document.createElement("script");
    addfreescriptnode.innerHTML=addfreescript;
    headelement.appendChild(addfreescriptnode);
    let addfree=getText(function(){/*

        <br>
                <br>
                <h2>输入SUB ID在Steam上添加免费产品。多个ID之间用“,”隔开。(<span style="color:#c6d4df;">锁国区的游戏需要切换账单。切换帐单会有点延迟，取决于网速，一开始点不动的话，等一会就能点了。<spans style="color:#d55;display:none;">注意：已经添加成功的SUB ID，如果在短时间内重复添加相同的SUB ID，因为网页缓存的关系请按下Ctrl+F5快捷键强制刷新，否则脚本无法判断该SUB ID是否已拥有！</span></span>)</h2>
            <div>输入SUB ID</div>
        <div style="float: left;" class="block_content checkout_content_box">
            <input style="width:450px;margin:10px 0px 0px 0px;" name="free_appid" id="free_appid" type="text" class="registerkey_input_box_text" value="">
                </div>
        <div class="button_row">
            <a tabindex="300" href="javascript:s_s_s_addfreefunction(document.getElementById('free_appid').value);" class="btnv6_blue_hoverfade btn_medium" style="margin:11px 0px 0px 0px;">
                <span>添加免费游戏</span>
        </a>
        </div>

    */});

    leftcontent.innerHTML=leftcontent.innerHTML+addfree;//+addtowishlist;
    leftcontent.appendChild(changecurrencycontainer);
    let cleardivnode=document.createElement("div");
    leftcontent.appendChild(cleardivnode);
    cleardivnode.outerHTML=cleardiv;
    let freegamelist=document.createElement("div");
    freegamelist.setAttribute("id","s_s_s_s_free_game_list");
    freegamelist.innerHTML="<br>";
    leftcontent.appendChild(freegamelist);
    let freegamelistFailed=document.createElement("div");
    freegamelistFailed.setAttribute("id","s_s_s_s_free_game_list_failed");
    freegamelistFailed.innerHTML="<br>";
    leftcontent.appendChild(freegamelistFailed);
    let freegamelistOwned=document.createElement("div");
    freegamelistOwned.setAttribute("id","s_s_s_s_free_game_list_owned");
    freegamelistOwned.innerHTML="<br>";
    leftcontent.appendChild(freegamelistOwned);
    leftcontent.innerHTML+="<br><br><br><br><br>";
})();