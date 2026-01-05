// ==UserScript==
// @name            Enhanced Steam Community
// @author          Deparsoul & onisuly
// @description     Add some extra functions to Steam Community
// @copyright       2015+,  Deparsoul & onisuly
// @version         2016.08.05
// @icon            http://store.steampowered.com/favicon.ico
// @license         GPL version 3 or any later version
// @include         http*://steamcommunity.com/*
// @include         http*://store.steampowered.com/*
// @run-at          document-end
// @grant           GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/726
// @downloadURL https://update.greasyfork.org/scripts/22010/Enhanced%20Steam%20Community.user.js
// @updateURL https://update.greasyfork.org/scripts/22010/Enhanced%20Steam%20Community.meta.js
// ==/UserScript==

/*
 *This program is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License, or
 *(at your option) any later version.
 *
 *This program is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

//下面用了一个将代码嵌入到网页中的技巧
function escMain(){

//Enhanced Steam Community 代码开始

//多语言支持
var escSteamLanguage = escGetCookie("Steam_Language");
if(!escSteamLanguage){
    // 尝试从网页中检测出语言
    var head = document.head.innerHTML;
    var match = head.match(/l=([a-z]+)/);
    if(match){
        escSteamLanguage = match[1];
    }
}

//默认语言字符串
var escT = {
    Market           : "View Cards in Market",
    MarketAll        : "All",
    MarketCard       : "Card",
    MarketBackground : "Background",
    MarketEmoticon   : "Emoticon",
    Inventory        : "View Cards in My Inventory",
    Showcase         : "Card Showcase",
    EditBKG          : "Edit Background",
    BKGTips          : "Please enter your background image link:\n(resolution:1920x1200)",
    SearchFriends    : "Search Friends",
    WebChat          : "Web Chat",
    OneClickBuying   : "1-Click buying",
    ViewMarket       : "View in Market",
    SellItem         : "Sell",
    BKGAlert         : "Please set a background in edit profile page first!",
    ViewBKG          : "View Background",
    ViewBKGSign      : "Profile Background",
	LibrarySearch 	 : "Advanced Search",
    BatchBuyCard     : "Batch Buy Cards (Beta, Use at Your Own Risk)",
    BatchBuyBtn      : "Buy with ",
    BatchBuyConfirm  : "Batch Buy Confirmation",
    BatchBuyMessage  : "Your current buy orders will be canceled. Please keep this window open while placing orders. And you need to pay at most ",
    BatchBuyCheck    : "Fail to fetch market info. You may need to open the market page of any card and try again",
    Confirm          : "Confirm",
    Cancel           : "Cancel",
    Name             : "Name",
    Demand           : "Demand",
    Supply           : "Supply",
    Order            : "Order",
    Owned            : "Owned",
    Loading          : "Loading...",
    TargetLevel      : "Target Level",
    CurrentLevel     : "Current Level",
    BoosterPack      : "Booster Pack",
    ThreeCardAvg     : "Three Cards",
    Fail             : "Fail",
    BatchBuyModes    : ["Lowest Sell", "Highest Buy", "Second Buy", "Lowest"]
}

//中文支持，可仿照此格式扩展其他语言
if( escSteamLanguage == "schinese" ) {
    escT.Market           = "在“市场”中查看卡牌";
    escT.MarketAll        = "全部";
    escT.MarketCard       = "卡牌";
    escT.MarketBackground = "背景";
    escT.MarketEmoticon   = "表情";
    escT.Inventory        = "在我的“库存”中查看卡牌";
    escT.Showcase         = "卡片展示橱窗";
    escT.EditBKG          = "编辑背景图";
    escT.BKGTips          = "请输入你的背景图链接:\n(分辨率:1920x1200)";
    escT.SearchFriends    = "搜索好友";
    escT.WebChat          = "网页聊天";
    escT.OneClickBuying   = "一键购买";
    escT.ViewMarket       = "在市场中查看";
    escT.SellItem         = "出售";
    escT.BKGAlert         = "请先在编辑个人资料页面设置一个背景！";
    escT.ViewBKG          = "查看背景图";
    escT.ViewBKGSign      = "个人资料背景";
    escT.LibrarySearch 	  = "高级搜索";
    escT.BatchBuyCard     = "批量购买卡牌（测试中，风险自负）";
    escT.BatchBuyBtn      = "批量下单";
    escT.BatchBuyConfirm  = "批量购买确认";
    escT.BatchBuyMessage  = "请注意，你目前已有的订购单会被取消。下单需要一段时间，请不要关闭窗口。本次批量下单的总金额为：";
    escT.BatchBuyCheck    = "无法获取市场信息，你可能需要先打开某张卡片的市场页面，再重新尝试本功能",
    escT.Confirm          = "确认";
    escT.Cancel           = "取消";
    escT.Name             = "名称";
    escT.Demand           = "需要";
    escT.Supply           = "供给";
    escT.Order            = "订单";
    escT.Owned            = "已有";
    escT.Loading          = "加载中...";
    escT.TargetLevel      = "目标等级";
    escT.CurrentLevel     = "当前等级";
    escT.BoosterPack      = "补充包";
    escT.ThreeCardAvg     = "三张卡";
    escT.Fail             = "出错";
    escT.BatchBuyModes    = ["最低卖价", "最高买价", "第二买价", "最低出价"];
}else if( escSteamLanguage == "tchinese" ) {
    escT.Market           = "在“市集”中查看卡片";
    escT.MarketAll        = "全部";
    escT.MarketCard       = "卡片";
    escT.MarketBackground = "背景";
    escT.MarketEmoticon   = "表情";
    escT.Inventory        = "在我的“物品庫”中查看卡片";
    escT.Showcase         = "卡片展示櫥窗";
    escT.EditBKG          = "編輯背景圖";
    escT.BKGTips          = "請輸入你的背景圖連結:\n(解析度:1920x1200)";
    escT.SearchFriends    = "搜索好友";
    escT.WebChat          = "網頁聊天";
    escT.OneClickBuying   = "一鍵購買";
    escT.ViewMarket       = "在市場中查看";
    escT.SellItem         = "販賣";
    escT.BKGAlert         = "請先在編輯個人檔案頁面設置一個背景！";
    escT.ViewBKG          = "查看背景圖";
    escT.ViewBKGSign      = "個人檔案背景";
    escT.LibrarySearch 	  = "高级搜索";
    escT.BatchBuyCard     = "批量購買卡牌（測試中，風險自負）";
    escT.BatchBuyBtn      = "批量下單";
    escT.BatchBuyConfirm  = "批量購買確認";
    escT.BatchBuyMessage  = "請注意，你目前已有的買單會被取消。下單需要一段時間，請不要關閉窗口。買單的總金額爲：";
    escT.BatchBuyCheck    = "無法獲取市場信息，你可能需要先打開某張卡片的市場頁面，再重新嘗試本功能",
    escT.Confirm          = "確認";
    escT.Cancel           = "取消";
    escT.Name             = "名稱";
    escT.Demand           = "需要";
    escT.Supply           = "供給";
    escT.Order            = "訂單";
    escT.Owned            = "已有";
    escT.Loading          = "加載中...";
    escT.TargetLevel      = "目標等級";
    escT.CurrentLevel     = "當前等級";
    escT.BoosterPack      = "補充包";
    escT.ThreeCardAvg     = "三張卡";
    escT.Fail             = "出錯";
    escT.BatchBuyModes    = ["最低賣價", "最高買價", "第二買價", "最低出價"];
}

if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/(id|profiles)\/.+\/gamecards\/[0-9]+/) ) {
    //某个游戏的徽章页面
    escEnhanceBadges();
}
else if ( location.href.match(/http[s]?:\/\/store\.steampowered\.com\/recommended\/friendactivity/) ) {
    //好友活动页面
    setTimeout('escFriendActivity()', 100);
}
else if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/(id|profiles)\/.+\/games/) ) {
    //好友活动统计
	escLibrarySearch();
}
else if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/market\/listings\/.+/) ) {
    //市场商品页面
    escOneClickBuying();
    escViewBackground();
}
else if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/market\/search\?.+/) ) {
    //市场搜索页面
    escEnhanceMarketSearch();
}
else if ( location.href.match(/http[s]?:\/\/store.steampowered.com\/agecheck\/app\/[0-9]+\//) ) {
    //年龄检查页面
    escSkipAgeCheck();
}
else if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/(id|profiles)\/.+\/friends/) ) {
    //好友页面
    escAddSearchFriends();
    escAddWebChat();
}
else if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/(id|profiles)\/.+\/inventory/) ) {
    //库存页面

    var match = location.href.match(/(#.*)\?filter=(.*)/);
    if (match) {
        location.hash = match[1];
        escApplyInventoryFilter(0, match[2]);
    }
    escEnhanceInventory();
}
else if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/tradeoffer\/.+/) ) {
    //离线交易页面
    setTimeout('escEnhanceTradeOffer()', 500);
}
else if ( location.href.match( /http[s]?:\/\/steamcommunity.com\/(id|profiles)\/.+/ ) ) {
    if( document.getElementsByClassName("btn_profile_action btn_medium") ) {
        escCustomBackground();
    }
}

function escFriendActivity(){
    for (var prefix in g_rgPagingControls) {
        var originalResponseHandler = g_rgPagingControls[prefix].m_fnResponseHandler;
        g_rgPagingControls[prefix].SetResponseHandler( function( response ) {
            originalResponseHandler(response);
            $J('img[src$="friendactivity_noimage.jpg"]').each(function(){
                var $img = $J(this);
                var $link = $J(this).parent();
                var appid = $link.data('ds-appid');
                if (appid) {
                    $link.attr('href', 'http://store.steampowered.com/app/'+appid+'/?cc=hk');
                    $img.attr('src', 'http://cdn.akamai.steamstatic.com/steam/apps/'+appid+'/capsule_sm_120.jpg');
                }
            });
        });
    }
}

function escLibrarySearch(){
    var match = location.href.match(/(id|profiles)\/(.+)\/games/);
    if (match) {
        var id = match[2];
        $J('.sectionTabs').append('<a class="sectionTab" target="_blank" href="http://steam.depar.me/LibrarySearch/#'+id+'"><span>'+escT.LibrarySearch+'</span></a>');
    }
}

function escEnhanceTradeOffer(){
    var match = location.href.match(/for_tradingcard=(\d+)_/);
    $J('#inventory_select_their_inventory').click();
    $J('#inventory_select_your_inventory').click();
    if (match) {
        var appid = match[1];
        setTimeout('TradePageSelectInventory(UserYou, 753, 0)', 5);
        setTimeout('escApplyInventoryFilter(0, "tag_filter_753_0_Game_app_'+appid+'")', 500);
        $J('#inventory_select_their_inventory, #inventory_select_your_inventory').click(function(){
            escApplyInventoryFilter(0, "tag_filter_753_0_Game_app_"+appid);
        });
    }
}

function escChangeMarketSearchPageSize() {
    if(!escGetLS('market_pagesize')){
        escSetLS('market_pagesize', 20);
    }

    var pagesize = escGetLS('market_pagesize');

    g_oSearchResults.SetPageChangedHandler(function(){
        escShowInventoryAmount();
    });

    if(pagesize &&  g_oSearchResults.m_cPageSize != pagesize && typeof g_oSearchResults !== undefined){
        g_oSearchResults.m_cPageSize = pagesize;
        g_oSearchResults.m_bLoading = false;
        HandleHashChange(0);
        g_oSearchResults.GoToPage(0, true);
        $J('#searchResultsRows').stop().fadeTo(0, 1.0);
    }
}

//为市场搜索添加类型选项
function escEnhanceMarketSearch() {
    var query = $J('#findItemsSearchBox').val();
    var match = query.match(/^(.*?)((Common|Rare|Uncommon) )?( ((Trading )?Card|(Profile )?Background|Emoticon))?$/i);
    if(match != null) {
        var name = match[1];
        name = name.trim();
        if(name){
            name = name.replace(/ /g,"+");
            var baseLink = "http://steamcommunity.com/market/search?q=" + name;
            $J('#market_search').after('<a href="'+baseLink+'">'+escT.MarketAll+'</a> | <a href="'+baseLink+'+Trading+Card'+'">'+escT.MarketCard+'</a> | <a href="'+baseLink+'+Profile+Background'+'">'+escT.MarketBackground+'</a> | <a href="'+baseLink+'+Emoticon'+'">'+escT.MarketEmoticon+'</a>');
        }
    }

    escShowInventoryAmount();
    setTimeout('escChangeMarketSearchPageSize()', 300);
}

//打开库存时自动激活指定过滤条件
function escApplyInventoryFilter(i, filter){
    if(filter){
        if($J('#'+filter).length)
            $J('#'+filter).click();
        else{
            ++i;
            if(i<20)
                setTimeout('escApplyInventoryFilter('+i+', "'+filter+'")', 500);
        }
    }
}

//接收SCE数据
function escProcBadges(data){
    jQuery('.gamecard_badge_progress').css('bottom', 'auto').css('top', 0);
    var sce = jQuery(data);
    if(window.location.href.indexOf('?border=1') != -1){
        //闪亮徽章
        var t = sce.find('h3:contains("FOIL BADGES")').closest('.content-box');
    }else{
        //普通徽章
        var t = sce.find('h3:contains("BADGES"):not(:contains("FOIL"))').closest('.content-box');
    }
    t.find('.showcase-element-container.badge>.showcase-element').each(function(){
        var b = jQuery(this);
        if(b.text()){
            //jQuery('.gamecard_badge_progress').remove();
            var img = b.find('.element-image').attr('src');
            var text = b.find('.element-text').text();
            var level = b.find('.element-experience').html();
            jQuery('.badge_content.gamecard_details').append('<div class="badge_info" style="float:left;width:80px;text-align:center;padding:5px;min-height:150px;"><div class="badge_info_image"><img src="'+img+'"></div><div class="badge_info_description"><div class="badge_info_title">'+text+'</div><div>'+level+'</div></div><div style="clear: left;"></div></div>')
        }
    });
    jQuery('.badge_content.gamecard_details').append('<div style="clear: both"></div>');
    sce.find('h3:contains("EMOTICONS")').closest('.content-box').find('.showcase-element-container.emoticon>.showcase-element').each(function(){
        var i = jQuery(this);
        if(i.text()){
            jQuery('.badge_content.gamecard_details').append('<div class="badge_info" style="float:left;width:80px;text-align:center;padding:5px;"><div><img src="'+i.find('.element-image.small').attr('src')+'"></div><div><img src="'+i.find('.element-image.big').attr('src')+'"></div><div><div class="badge_info_title">'+i.find('.element-text').text()+'</div><div>'+i.find('.element-experience').text()+'</div></div><div style="clear: left;"></div></div>')
        }
    });
    jQuery('.badge_content.gamecard_details').append('<div style="clear: both"></div>');
    sce.find('h3:contains("BACKGROUNDS")').closest('.content-box').find('.showcase-element-container.background>.showcase-element').each(function(){
        var i = jQuery(this);
        if(i.text()){
            jQuery('.badge_content.gamecard_details').append('<div class="badge_info" style="float:left;width:160px;text-align:center;padding:5px;"><div><a target="_blank" href="'+i.find('.element-image').attr('href')+'"><img src="'+i.find('.element-image img').attr('src').replace('112x70f', '160x100f')+'"></a></div><div><div class="badge_info_title">'+i.find('.element-text').text()+'</div><div>'+i.find('.element-experience').text()+'</div></div><div style="clear: left;"></div></div>')
        }
    });
}

//为徽章页面添加在库存、市场、SCE查看的选项（似乎会覆盖原有链接）
function escEnhanceBadges() {
    var cards = []; // 保存卡片信息
    var booster = null; // 补充包信息
    var appid = location.href.match(/gamecards\/(\d+)(?!\w)/)[1];

    var batch_state = 0; // 状态：0=为初始化，1=正在初始化，2=初始化完成，3=正在下单

    var target_level = 5;   // 目标等级
    var current_level = 0;  // 当前等级
    var cb = jQuery('.badge_current .badge_info_description>div:eq(1)');
    if(cb.length){
        current_level = parseInt(cb.text().match(/\d+/));
    }

    // foil = 1 为闪卡, 0 为普通卡
    var foil = window.location.href.indexOf('?border=1') != -1;
    if(foil){
        foil = 1;
        target_level = 1;
    }else{
        foil = 0;
    }
    var GameName = document.getElementsByClassName("profile_small_header_location")[1].textContent;
    var MarketLink = "http://steamcommunity.com/market/search?q=" + GameName.replace(/ /g,"+") + "+Trading+Card";
    var InventoryLink = document.getElementsByClassName("popup_menu_item header_notification_items")[0].href +"#753_6"+ "?filter=tag_filter_753_6_Game_app_"+appid;
    var ShowcaseLink = "http://www.steamcardexchange.net/index.php?gamepage-appid-"  +  appid;
    document.getElementsByClassName("gamecards_inventorylink")[0].innerHTML = "<a class='btn_grey_grey  btn_small_thin' target='_blank' id='batch_buy_card' href=" + MarketLink + "><span>" + escT.BatchBuyCard + "</span></a>&nbsp;<a class='btn_grey_grey  btn_small_thin' target='_blank' href=" + MarketLink + "><span>" + escT.Market + "</span></a>&nbsp;<a class='btn_grey_grey  btn_small_thin' target='_blank' href=" + InventoryLink + "><span>" + escT.Inventory + "</span></a>&nbsp;<a class='btn_grey_grey  btn_small_thin' target='_blank' href=" + ShowcaseLink + "><span>" + escT.Showcase + "</span></a>&nbsp;";

    // 将空值转换成问号
    function text_wrapper(value){
        if(value!==undefined)
            return value;
        else
            return '?';
    }

    // 刷新统计表格
    function refresh_market_table(){
        // 构造表头
        var content = '<table cellpadding=5 style="margin:auto;font-size:90%;">'
        content += '<tr><th>'+escT.MarketCard+'</th><th>'+escT.Name+'</th><th>'+escT.Owned+'</th><th>'+escT.Demand+'</th>';
        for(var j=0;j<escT.BatchBuyModes.length;++j){
            content += '<th>'+escT.BatchBuyModes[j]+'</th>';
        }
        content += '<th>'+escT.Supply+'</th><th>'+escT.Order+'</th></tr>';

        // 用于统计三张卡片均价
        var set_cost = 0;
        var set_count = 0;

        var total_cost = []; // 用于统计总费用
        var is_complete = true; // 用于判断数据是否已经加载完
        for(var i=0; i<cards.length; i++){
            var c = cards[i];
            var d = target_level-current_level-c.count;
            if(d<0) d = 0;
            if(is_complete && c.price!==undefined){
                set_cost += c.price[0]; // 使用最低卖价
                set_count++;
                for(var j=0;j<c.price.length;++j){
                    if(total_cost[j]===undefined)
                        total_cost[j]=0;
                    total_cost[j] += d*c.price[j];
                }
            }else{
                is_complete = false;
            }
            // 构造数据行
            content += '<tr><td><img src="'+c.img+'" style="height:32px;"></td><td><a target="_blank" href="http://steamcommunity.com/market/listings/753/'+encodeURIComponent(c.hash)+'">'+c.name+'</td><td>'+c.count+'</a></td><td>'+d+'</td>';
            for(var j=0;j<escT.BatchBuyModes.length;++j){
                if(c.price_text&&c.price_text[j]){
                    content += '<td>'+c.price_text[j]+'</td>';
                }else{
                    content += '<td>?</td>';
                }
            }
            content += '<td>'+text_wrapper(c.quantity)+'</td><td>'+text_wrapper(c.order)+'</td></tr>';
        }
        content += "</table>"
        if(booster){
            var b = '<a target="_blank" href="'+booster.link+'">'+escT.BoosterPack+'</a>: '+booster.price+'&nbsp;';
            if(is_complete){
                b += escT.ThreeCardAvg+': '+format_price(set_cost/set_count*3);
            }
            content = b+content;
        }
        // 如果加载完成，显示按钮并更新总费用
        if(is_complete){
            for(var j=0;j<total_cost.length;++j){
                jQuery('.btn_batch_buy:eq('+j+') span.total_cost').text(format_price(total_cost[j]));
            }
            if(batch_state == 1){
                jQuery('.btn_batch_buy').fadeIn();
                batch_state = 2;
            }
        }
        jQuery('#market_data').html(content);
    }

    // 调用 Steam 网页接口所需要的几个变量，会在分析市场页面的时候填写
    var g_sessionID = '';
    var g_walletCurrency = '';
    var g_strCountryCode = '';
    var g_strLanguage = '';

    // 改用官方函数格式化价格
    function format_price(price) {
        return v_currencyformat(price*100, GetCurrencyCode(g_walletCurrency), g_strCountryCode);
    }

    // 读取第 i 张卡的市场信息，延迟递归
    function load_card_listing(i){
        if(i >= cards.length)
            return;
        var c = cards[i];
        if(c.hash===undefined){
            load_card_listing(i+1);
            return;
        }
        jQuery.get('http://steamcommunity.com/market/listings/753/'+encodeURIComponent(c.hash), function(data){
            g_sessionID = data.match(/g_sessionID = "([^"]+)"/)[1];
            g_walletCurrency = parseInt(data.match(/"wallet_currency":(\d+)/)[1]);
            g_strLanguage = data.match(/g_strLanguage = "([^"]+)"/)[1];
            g_strCountryCode = data.match(/g_strCountryCode = "([^"]+)"/)[1];
            var nameid = data.match(/Market_LoadOrderSpread\( (\d+)/)[1];
            var order = data.match(/id="mybuyorder_(\d+)">[\s\S]*<span class="market_listing_price">\s*(.+?)\s*<\/span>[\s\S]*<span class="market_listing_price">\s*(\S*)/);
            cards[i]['nameid'] = nameid;

            // 是否有买单
            cards[i]['order'] = '0';
            if(order){
                cards[i]['order_id'] = order[1];
                cards[i]['order_price'] = order[2];
                cards[i]['order_amount'] = order[3];
                cards[i]['order'] = order[3]+' x '+order[2];
            }

            // 获取买卖信息
            jQuery.ajax({
                url: 'http://steamcommunity.com/market/itemordershistogram',
                type: 'GET',
                data: {
                    country: g_strCountryCode,
                    language: g_strLanguage,
                    currency: g_walletCurrency,
                    item_nameid: nameid
                }
            }).success(function(data){
                cards[i]['price'] = []; // 价格信息
                cards[i]['price_text'] = []; // 价格的文字说明

                // 最低卖单
                cards[i]['price'].push(data.sell_order_graph[0][0]);
                cards[i]['price_text'].push(format_price(data.sell_order_graph[0][0])+' x '+data.sell_order_graph[0][1]);

                var j = 0;
                // 最高买单
                cards[i]['price'].push(data.buy_order_graph[j][0]);
                cards[i]['price_text'].push(format_price(data.buy_order_graph[j][0])+' x '+data.buy_order_graph[j][1]);

                if(data.buy_order_graph[1]){
                    j = 1;
                }else{
                    j = 0;
                }
                // 次高买单
                cards[i]['price'].push(data.buy_order_graph[j][0]);
                cards[i]['price_text'].push(format_price(data.buy_order_graph[j][0])+' x '+data.buy_order_graph[j][1]);

                j = data.buy_order_graph.length-1;
                // 最低价格
                cards[i]['price'].push(data.buy_order_graph[j][0]);
                cards[i]['price_text'].push(format_price(data.buy_order_graph[j][0])+' x '+data.buy_order_graph[j][1]);

                refresh_market_table();
            });
            
            refresh_market_table();
            setTimeout(function(){load_card_listing(i+1)}, 500);
        }).fail(function(xhr, status, error) {
            alert(escT.BatchBuyCheck);
        });
    }

    // 开始批量下单，出价模式为mode
    function batch_buy(mode){
        // 取消第 i 张卡片的订单，延迟递归
        function cancel_buy(i) {
            // 全部取消后开始下单
            if(i==cards.length){
                place_buy(0);
                return;
            }
            if(cards[i].order_id!==undefined){
                jQuery.post('/market/cancelbuyorder/', {sessionid: g_sessionID, buy_orderid: cards[i].order_id}, function(data) {
                    if(data.success==1){
                        cards[i]['order'] = '0';
                    }else{
                        cards[i]['order'] = escT.Fail;
                    }
                    refresh_market_table();
                    setTimeout(function(){cancel_buy(i+1)}, 500)
                });
            }else{
                cancel_buy(i+1);
            }
        }

        // 为第 i 张卡片下单
        function place_buy(i) {
            if(i==cards.length){
                return;
            }
            var c = cards[i];
            var d = target_level-current_level-c.count;
            if(c.hash!==undefined && d>0){
                var p = c.price[mode];
                jQuery.ajax( {
                    url: 'https://steamcommunity.com/market/createbuyorder/',
                    type: 'POST',
                    data: {
                        sessionid: g_sessionID,
                        currency: g_walletCurrency,
                        appid: 753,
                        market_hash_name: c.hash,
                        price_total: Math.round(d*p*100),
                        quantity: d
                    },
                    crossDomain: true,
                    xhrFields: { withCredentials: true }
                }).done(function(data) {
                    if(data.success==1){
                        cards[i]['order'] = d+' x '+format_price(p);
                    }else{
                        cards[i]['order'] = escT.Fail;
                    }
                    refresh_market_table();
                    setTimeout(function(){place_buy(i+1)}, 500)
                });
            }else{
                place_buy(i+1);
            }
        }

        // 先取消已有订单
        cancel_buy(0);
    }

    // 在按钮上绑定批量买卡的初始化函数
    jQuery('#batch_buy_card').click(function(){
        if(batch_state==0){
            batch_state = 1;
            var t = jQuery(this).closest('.badge_detail_tasks');
            t.before('<div class="badge_detail_tasks"><div class="gamecards_inventorylink">'+escT.CurrentLevel+' : <span style="background-color: rgba(0, 0, 0, 0.2); border: 1px solid #000; border-radius: 3px; box-shadow: 1px 1px 0 0 rgba(91, 132, 181, 0.2); color: #909090; width: 30px; display: inline-block;">'+current_level+'</span>&nbsp;'+escT.TargetLevel+' : <input type="text" value="5" id="target_level" style="width:30px;"></div><div class="gamecards_inventorylink" id="market_data">'+escT.Loading+'</div></div><div style="clear: both"></div>');

            // 出价按钮
            var btn = '&nbsp;'+escT.BatchBuyBtn+':';
            for(var j=0;j<escT.BatchBuyModes.length;++j){
                btn += '&nbsp;<a class="btn_grey_grey btn_small_thin btn_batch_buy" style="display:none;" data-mode="'+j+'"><span>'+escT.BatchBuyModes[j]+' <span class="total_cost">?</span></span></a>';
            }
            jQuery('#target_level').after(btn);
            jQuery('.btn_batch_buy').click(function(){
                var b = jQuery(this);
                var tc = b.find('.total_cost').text();
                var m = b.data('mode');
                ShowConfirmDialog(
                    escT.BatchBuyConfirm,
                    escT.BatchBuyMessage+tc,
                    escT.Confirm + ' ('+tc+')',
                    escT.Cancel
                ).done(function(){
                    jQuery('.btn_batch_buy').fadeOut();
                    batch_buy(m);
                });
            });

            //输入等级
            jQuery('#target_level').keyup(function(){
                var t = jQuery(this).val();
                if(!isNaN(t)){
                    t = parseInt(t);
                    target_level = t;
                    refresh_market_table();
                }
            });

            //读取卡片基本信息
            jQuery('.badge_detail_tasks>.badge_card_set_card').each(function(){
                var c = jQuery(this);
                var name = c.find('.badge_card_set_text:eq(0)').text().replace(/^\s+\(\d+\)/, '').trim();
                var count = c.find('.badge_card_set_text_qty').text();
                if(count)
                    count = parseInt(count.replace(/[()]/g, ''));
                else
                    count = 0;
                var img = c.find('img.gamecard').attr('src');
                cards.push({
                    'name': name,
                    'img': img,
                    'count': count,
                });
            });

            Array.prototype.findindex = function(callback){
                for(var i=0; i<this.length; ++i){
                    if(callback(this[i])){
                        return i;
                    }
                }
                return -1;
            }

            // 检查补充包价格
            if(foil==0){
                jQuery.getJSON('http://steamcommunity.com/market/search/render/?category_753_item_class[]=tag_item_class_5&appid=753&category_753_Game[]=tag_app_'+appid, function(data){
                    var list = jQuery('<div>'+data.results_html+'</div>');
                    var l = list.find('.market_listing_row_link');
                    if(l.length==1){
                        var quantity = l.find('.market_listing_num_listings_qty').text();
                        quantity = parseInt(quantity.replace(/[^\d]/, ''));
                        var link = l.attr('href');
                        var price = l.find('.market_listing_their_price .market_table_value>span').text().trim();
                        booster = {
                            'link': link,
                            'quantity': quantity,
                            'price': price
                        };
                    }
                });
            }

            // 通过市场获取所有卡片列表
            jQuery.getJSON('http://steamcommunity.com/market/search/render/?start=0&count=20&category_753_cardborder[]=tag_cardborder_'+foil+'&appid=753&category_753_Game[]=tag_app_'+appid, function(data){
                var list = jQuery('<div>'+data.results_html+'</div>');
                list.find('.market_listing_row_link').each(function(){
                    var l = jQuery(this);
                    var name = l.find('.market_listing_item_name').text().trim();
                    var img = l.find('.market_listing_item_img').attr('src').replace('/62fx62f', '');
                    var quantity = l.find('.market_listing_num_listings_qty').text();
                    quantity = parseInt(quantity.replace(/[^\d]/, ''));
                    var link = l.attr('href');
                    var hash = link.match(/\/753\/([^?]+)/)[1];
                    hash = decodeURIComponent(hash);
                    var i = -1;
                    var match = null;
                    //i = cards.findindex(function(c){return c.img == img;});
                    if(i<0 && (match=hash.match(/\d+-(.*)/))){
                        var hashname = match[1].trim();
                        i = cards.findindex(function(c){return c.name == hashname;});
                    }
                    if(i<0 && (match=hash.match(/\d+-(.*)\((Foil|Foil Trading Card|Trading Card)\)/))){
                        hashname = match[1].trim();
                        i = cards.findindex(function(c){return c.name == hashname;});
                    }
                    if(i>-1){
                        cards[i]['quantity'] = quantity;
                        cards[i]['hash'] = hash;
                    }
                    refresh_market_table();
                });
                load_card_listing(0);
            });
        }
        return false;
    });

    //highlight quantity
    var length = document.getElementsByClassName("badge_card_set_text_qty").length;
    for(var i = 0; i < length; ++i) {
        document.getElementsByClassName("badge_card_set_text_qty")[i].style.color = "#F00";
    }
}

function escListingClickPurchase(){
    $('market_buynow_dialog_purchase').click();
    $('market_buynow_dialog_cancel').click();
}

function escOneClickBuying(){
    //添加一键购买选项
    var $cb = $J('<span class="market_listing_filter_searchhint" style="padding-left: 5px;"><label style="color:red;"><input id="escOneClickBuying" type="checkbox" />'+escT.OneClickBuying+'</label></span>');
    $cb.appendTo("#market_listing_filter_form");
    
    if(escGetLS("one_click_buying")){
        $J('#escOneClickBuying').prop('checked', true);
    }else{
        $J('#escOneClickBuying').prop('checked', false);
    }
    $J('#escOneClickBuying').change(function(){
        escSetLS("one_click_buying", $J(this).prop('checked'), 365);
    });

    $J("#searchResultsTable").on("click", ".market_listing_buy_button", function(){
        var $row = $J(this).closest('.market_listing_row');
        var price = $row.find(".market_listing_price_with_fee").text().match(/([\d.]+)/);
        price = parseFloat(price[1]);
        if(escGetLS("one_click_buying") && price<5){
            $J('#market_buynow_dialog').css({opacity: 0});
            setTimeout('escListingClickPurchase()', 100);
            $J(this).html('<img src="http://steamcommunity-a.akamaihd.net/public/images/login/throbber.gif">');
            $row.delay(20000).fadeTo('slow', 0);
        }else{
            $J('#market_buynow_dialog').css({opacity: 1});
        }
    });

    //自动勾选同意协议
    document.getElementById("market_buynow_dialog_accept_ssa").checked="checked";
}

function escCustomBackground() {
    if( location.href.indexOf(document.getElementsByClassName("popup_menu_item")[document.getElementsByClassName("popup_menu_item").length - 1].href) == -1 ) return;

    var e = document.createElement("a");
    e.className = "btn_profile_action btn_medium";
    e.onclick = function fun() {
        var BackgroundImg = prompt( escT.BKGTips,escGetCookie("BackgroundImg") );
        if( BackgroundImg != null ) {
            if( BackgroundImg != "" ) {
                if( !document.getElementsByClassName("profile_background_image_content")[0] ) {
                    alert( escT.BKGAlert );
                    return;
                }
            }
            escSetCookie("BackgroundImg",BackgroundImg,365);
            location.href = location.href;
        }
    };
    e.innerHTML = "<span>" + escT.EditBKG + "</span>";
    document.getElementsByClassName("profile_header_actions")[0].appendChild(e);

    var BackgroundImg = escGetCookie("BackgroundImg");

    if( BackgroundImg != null && BackgroundImg != "" ) {
        if( !document.getElementsByClassName("profile_background_image_content")[0] ) {
            return;
        }
        else {
            document.getElementsByClassName("profile_background_image_content")[0].setStyle({backgroundImage: "url( " + BackgroundImg + ")"});
            document.getElementsByClassName("no_header profile_page has_profile_background")[0].setStyle({backgroundImage: "url( " + BackgroundImg + ")"});
        }
    }
}

//Cookie操作函数
function escGetCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";",c_start);
            if(c_end == -1) c_end = document.cookie.length;
            return unescape( document.cookie.substring(c_start,c_end) );
        }
    }
    return ""
}

function escSetCookie(c_name,value,expiredays) {
    var exdate = new Date();
    exdate.setDate( exdate.getDate() + expiredays );
    document.cookie = c_name + "=" + escape(value) + ( (expiredays == null) ? "" : "; expires=" + exdate.toGMTString() ) + ";path=/";
}

function escGetLS(key){
    var val = null;
    if(typeof localStorage !== undefined && localStorage["esc_"+key] !== undefined){
        val = JSON.parse(localStorage["esc_"+key]);
    }
    return val;
}

function escSetLS(key, val){
    if(typeof localStorage !== undefined){
        localStorage["esc_"+key] = JSON.stringify(val);
    }
}

function escSkipAgeCheck() {
    escSetCookie("birthtime",-473356799,365);
    window.location = window.location;
}

function escAddSearchFriends() {
    var e = document.createElement("span");
    e.className = "btn_grey_black btn_details btn_small btn_manage_friends";
    e.innerHTML = "<span><a href='http://steamcommunity.com/actions/SearchFriends'>" + escT.SearchFriends + "</a></span>";

    document.getElementsByClassName("manage_friends_btn_ctn")[0].appendChild(e);
}

function escAddWebChat() {
    var eSpace = document.createTextNode(" ");
    document.getElementsByClassName("manage_friends_btn_ctn")[0].appendChild(eSpace);

    var e = document.createElement("span");
    e.className = "btn_grey_black btn_details btn_small btn_manage_friends";
    e.innerHTML = "<span><a href='http://steamcommunity.com/chat/'>" + escT.WebChat + "</a></span>";

    document.getElementsByClassName("manage_friends_btn_ctn")[0].appendChild(e);
}

function escShowInventoryAmount() {
    var inventory = escGetLS('inventory');
    $J('.market_listing_row_link').each(function(){
        var link = $J(this);
        link.find('.market_listing_item_esc_amount').remove();
        var href = link.attr('href');
        var match = href.match(/steamcommunity\.com\/market\/listings\/([^$?]*)/);
        if (match != null) {
            var identifier = decodeURIComponent(match[1]);
            if(inventory&&inventory.hasOwnProperty(identifier)){
                var amount = inventory[identifier];
                link.find('.market_listing_item_name').prepend('<span style="color:red;" class="market_listing_item_esc_amount">('+amount+') </span>');
            }
        }
    });
}

function escUpdateInventoryCache() {
    if(typeof g_steamID == 'undefined' || g_steamID == '')
        return;
    var steamID = g_steamID;
    if(typeof g_ActiveUser == 'undefined' || g_ActiveUser.strSteamId != g_steamID)
        return;
    var app = {};
    for (var appid in g_ActiveUser.rgAppInfo) {
        var a = g_ActiveUser.rgAppInfo[appid];
        var con = [];
        for (var id in a.rgContexts) {
            con.push(id);
        }
        app[appid] = con;
    }
    escSetLS('inventory_app', app);
    app = escGetLS('inventory_app');
    var inventory = {};
    for (var appid in app) {
        var a = app[appid];
        for(var i=0;i<a.length;++i){
            var id = a[i];
            $J.getJSON("http://steamcommunity.com/id/Deparsoul/inventory/json/"+appid+"/"+id+"/", function(data){
                if(data.success){
                    var inv = data.rgInventory;
                    var des = data.rgDescriptions;
                    for (var id in inv) {
                        var i = inv[id];
                        var d = des[i.classid+"_"+i.instanceid];
                        if(!d){
                            continue;
                        }
                        var name = d.name;
                        if(d.market_name)
                            name = d.market_name;
                        if(d.market_hash_name)
                            name = d.market_hash_name;
                        var identifier = d.appid+"/"+name;
                        var amount = parseInt(i.amount);
                        if(inventory.hasOwnProperty(identifier)){
                            inventory[identifier] += amount;
                        }else{
                            inventory[identifier] = amount;
                        }
                    }
                    escSetLS('inventory', inventory);
                }
            });
        }
    }
}

function escConfirmMarketSell(){
    if(SellItemDialog.m_bWaitingForUserToConfirm){
        $('market_sell_dialog_ok').click();
    }
}

function escEnhanceInventory() {
    window.escViewCurrentSelection = function(){
        var SelectedItem = window.g_ActiveInventory.selectedItem;
        var AppID = SelectedItem.appid;
        var MarketHashName = typeof SelectedItem.market_hash_name != 'undefined' ? SelectedItem.market_hash_name : SelectedItem.market_name;
        if( MarketHashName.match(/^(\d+-)?[A-Za-z0-9 \t\r\n\v\f\]\[!"#$%&'()*+,./\\:;<=>?@\^_`{|}~-]+$/) ) {
            window.open("http://steamcommunity.com/market/listings/" + AppID + "/" + encodeURIComponent(MarketHashName));
        }else{
            window.open("http://steamcommunity.com/market/search?q=" + encodeURIComponent(MarketHashName.match(/[^-\d]+/)));
        }
    }

    //覆盖物品信息显示函数
    var originalBuildHover = BuildHover;
    window.BuildHover = function(prefix, item, owner){
        originalBuildHover(prefix, item, owner);

        var $iteminfo = $J('.inventory_iteminfo:hidden');
        //如果可以出售
        if(item.marketable){
            var elViewButton = CreateMarketActionButton('green', 'javascript:escViewCurrentSelection()', escT.ViewMarket );
            $iteminfo.find('.item_market_actions').append( elViewButton ).show();
        }
        //查看背景大图
        if($iteminfo.text().indexOf(escT.ViewBKGSign) != -1){
            var imgUrl = $iteminfo.find('.item_desc_icon img').attr('src');
            imgUrl = imgUrl.substring( 0, imgUrl.lastIndexOf('/') );
            var imgName = $iteminfo.find('h1.hover_item_name').text();
            var newButton = $J('<div class="item_owner_actions"><a class="item_action">'+escT.ViewBKG+'</a></div>');
            newButton.click(function(){
                escGameCardArtDialog(imgName,imgUrl);
            });
            $iteminfo.find('.item_actions').append(newButton).show();
        }
    }

    //自动勾选同意协议
    document.getElementById("market_sell_dialog_accept_ssa").checked = "checked";

    var eDiv = $J('<div style="border-top: 1px solid rgb(93, 137, 44); padding-top: 10px; margin-top: 8px;"></div>');

    //引入显示价格列表所需要的样式表
    $J('head').append('<link type="text/css" rel="stylesheet" href="http://steamcommunity-a.akamaihd.net/public/css/skin_1/economy_market.css?v=1617814919">');

    $J(eDiv).append('<style>.market_listing_action_buttons{display:none;}</style><div class="market_content_block market_home_listing_table market_home_main_listing_table market_listing_table" id="searchResultsTable"><div id="searchResultsRows"></div></div>');
    $J('#market_sell_dialog .market_dialog_contents').append(eDiv);
    //document.getElementById("market_sell_dialog_input_area").appendChild(eDiv);

    $J('#market_sell_dialog_accept').click(function(){
        //记住上次的售价
        if($J('#market_sell_currency_input').val())
            escSetLS('last_sell_price', $J('#market_sell_currency_input').val());
    });

    $J('.market_dialog_input').keydown(function (e) {

        //记住上次的售价
        if($J('#market_sell_currency_input').val())
            escSetLS('last_sell_price', $J('#market_sell_currency_input').val());

        //Ctrl+Enter直接上架
        if (e.ctrlKey && e.keyCode == 13) {
            setTimeout('escConfirmMarketSell()', 100);
        }

    });

    //覆盖出售按钮函数
    var originalSell = window.SellCurrentSelection;
    window.SellCurrentSelection = function(){
        var result = $J("#searchResultsRows");
        result.hide();

        var SelectedItem = window.g_ActiveInventory.selectedItem;
        var AppID = SelectedItem.appid;
        var MarketHashName = typeof SelectedItem.market_hash_name != 'undefined' ? SelectedItem.market_hash_name : SelectedItem.market_name;
        if( MarketHashName.match(/^(\d+-)?[A-Za-z0-9 \t\r\n\v\f\]\[!"#$%&'()*+,./\\:;<=>?@\^_`{|}~-]+$/) ) {
            $J.getJSON("http://steamcommunity.com/market/listings/" + AppID + "/" + encodeURIComponent(MarketHashName) +"/render/",
            {
                query: "",
                start: 0,
                count: 20,
				country: g_strCountryCode,
				language: g_strLanguage,
				currency: typeof( g_rgWalletInfo ) != 'undefined' ? g_rgWalletInfo['wallet_currency'] : 1
            }
            , function(data){
                result.html(data.results_html).slideDown('slow');
                result.prepend("0 - 20 / "+data.total_count);
            });
        }
        originalSell();
        if(escGetLS('last_sell_price')){
            $J('#market_sell_currency_input').val(escGetLS('last_sell_price'));
            SellItemDialog.OnInputKeyUp();
        }
        $J('#market_sell_dialog').css('top', jQuery(window).scrollTop());//将出售框定位到顶部
    }

    setTimeout('escUpdateInventoryCache()', 1000);
}

//查看背景大图
function escViewBackground() {
    if( document.getElementsByClassName("market_listing_game_name")[0].textContent.indexOf(escT.ViewBKGSign) == -1 ) return;

    var eDiv = document.createElement("div");
    eDiv.className = "item_actions";

    var eA = document.createElement("a");
    eA.className = "item_action";
    eA.textContent = escT.ViewBKG;
    var ImgUrl = document.getElementsByClassName("market_listing_largeimage")[0].childNodes[1].src;
    ImgUrl = ImgUrl.substring( 0, ImgUrl.lastIndexOf('/') );
    var ImgName = document.getElementsByClassName("market_listing_nav")[0].childNodes[3].textContent;
    eA.onclick = function() {
        escGameCardArtDialog(ImgName,ImgUrl);
    };

    eDiv.appendChild(eA);
    document.getElementsByClassName("item_desc_description")[0].appendChild(eDiv);
}

function escGameCardArtDialog( strName, strImgURL ) {
    var $Img = $J('<img/>' );
    var $Link = $J('<a/>', {href: strImgURL, target: '_blank' } );
    var Modal = escShowDialog( strName, $Link.append( $Img ) );
    Modal.GetContent().hide();

    // set src after binding onload to be sure we catch it.
    $Img.load( function() { Modal.GetContent().show(); } );
    $Img.attr( 'src', strImgURL );

    Modal.OnResize( function( nMaxWidth, nMaxHeight ) {
        $Img.css( 'max-width', nMaxWidth );
        $Img.css( 'max-height', nMaxHeight );
    } );

    Modal.AdjustSizing();
}

function escShowDialog( strTitle, strDescription, rgModalParams ) {
    var deferred = new jQuery.Deferred();
    var fnOK = function() { deferred.resolve(); };

    var Modal = _BuildDialog( strTitle, strDescription, [], fnOK, rgModalParams );
    deferred.always( function() { Modal.Dismiss(); } );
    Modal.Show();

    // attach the deferred's events to the modal
    deferred.promise( Modal );

    return Modal;
}

//Enhanced Steam Community 代码结束

}

//将上面的代码插入到网页中
var script = escMain.toString();
script = script.slice(script.indexOf('{')+1, -1);
var newElem = document.createElement('script');
newElem.type = 'text/javascript';
newElem.innerHTML = script;
document.body.appendChild(newElem);

//Script Injection
function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = fn;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

//Load url and call proc function
function load(url, id){
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            exec('escProc'+id+'("'+addslashes(response.responseText)+'")');
        }
    });
}

//Add slashes to string
function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
}

if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/(id|profiles)\/.+\/gamecards\/[0-9]+/) ) {
    //某个游戏的徽章页面
    var appid = location.href.match(/\d+(?!\w)/);
    load('http://www.steamcardexchange.net/index.php?gamepage-appid-'+appid, 'Badges');
}
