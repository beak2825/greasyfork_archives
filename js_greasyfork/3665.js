// ==UserScript==
// @name        Enhanced sonkwo
// @namespace   https://greasyfork.org/users/726
// @description 为杉果网站增加若干实用功能，包括：在线提取序列号，显示杉果历史最低价，匹配Steam链接
// @author      Deparsoul
// @include     http://www.sonkwo.com/products/*
// @icon        http://www.sonkwo.com/favicon.ico
// @version     20161010
// @run-at      document-end
// @require     http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/3665/Enhanced%20sonkwo.user.js
// @updateURL https://update.greasyfork.org/scripts/3665/Enhanced%20sonkwo.meta.js
// ==/UserScript==


var regexp = /www\.sonkwo\.com\/products\/(\d*)/;
var match = regexp.exec(location.href);
if (match != null) {
    var id = match[1];

    if(jQuery('#status-tag:contains("已拥有")').length>0){
        jQuery('#status-tag').replaceWith('<a id="get_serial_number" class="sale-block" title="已拥有" style="width:120px;background-color:green;" target="_blank" href="http://www.sonkwo.com/api/game/get_serial_number.json?game_id='+id+'">点击提取序列号</a>');
        jQuery('#get_serial_number').click(function(){
            jQuery("#serial_number").slideUp("normal", function(){$(this).remove();});
            jQuery.getJSON(jQuery(this).attr('href'), function(data){
                if(data.status == 'success'){
                    data = data.data;
                    var div = jQuery('<div id="serial_number" style="display:none;margin-top:10px;margin-bottom:10px;"></div>');
                    for(var i=0; i<data.length; ++i){
                        var d = data[i];
                        div.append('<input type="text" style="width:210px;" onfocus="this.select();" value="'+d.serial_number+'" /> '+d.type_desc);
                    }
                    jQuery('.game-actions').after(div);
                    div.slideDown();
                }else{
                    if(data.message){
                        alert('提取失败：'+data.message);
                    }
                }
            });

            return false;
        });
    }
    
    if(jQuery('.game-content-container').text().search('【Steam】本游戏运行需通过')<=0){
        jQuery('.game-sale-card .game-info').append(' <span style="color:red;font-weight:bold;">注意：本游戏可能不提供Steam激活，购买前请确认</span>');
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: 'http://steamdb.sinaapp.com/sonkwo/'+id+'.dat',
        onload: function(response){
            var data = JSON.parse(response.responseText);
            if(data.id){
                if(data.steam){
                    jQuery('.game-header-left>p').wrapInner('<a style="display:inline;" href="'+data.steam+'"></a>');
                    jQuery('head').append('<script src="http://steamdb.sinaapp.com/steam_info.js"></script>');
                }
                var label = '';
                var price = '';
                if(data.price_lowest){
                    label += '杉果';
                    price += '￥'+data.price_lowest.toFixed(2);
                }
                if(data.steam_lowest){
                    if(label) label += ' / ';
                    if(price) price += ' / ';
                    label += '其他商店';
                    price += '$'+data.steam_lowest.toFixed(2);
                }
                if(label && price){
                    label += '历史最低价';
                    jQuery('.game-misc-info').append('<div class="info-item"><div class="item-label" style="width:160px;">'+label+'</div><div class="item-content" style="width:140px;font-weight:bold;color:#000;text-align:center;">'+price+'</div></div>');
                }
            }
        }
    });
}
