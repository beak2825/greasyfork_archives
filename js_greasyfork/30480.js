// ==UserScript==
// @name            Enhanced Steam Community Mod
// @author          Byzod & Deparsoul & onisuly
// @namespace       https://greasyfork.org/users/75960
// @description     Add some extra functions to Steam Community
// @copyright       2015+,  Byzod & Deparsoul & onisuly
// @version         2017-6-14
// @icon            http://store.steampowered.com/favicon.ico
// @license         GPL version 3 or any later version
// @include         http*://steamcommunity.com/*
// @include         http*://store.steampowered.com/*
// @run-at          document-end
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/30480/Enhanced%20Steam%20Community%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/30480/Enhanced%20Steam%20Community%20Mod.meta.js
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
 
/*
 * 原始脚本见 https://greasyfork.org/scripts/954
 */

// 下面用了一个将代码嵌入到网页中的技巧
function escMain() {

// Enhanced Steam Community 代码开始

$J = $J || jQuery;

// 多语言支持
var escSteamLanguage = escGetCookie("Steam_Language");
var escMatch;
if (!escSteamLanguage) {
    // 尝试从网页中检测出语言
    escMatch = document.head.innerHTML.match(/l=([a-z]+)/);
    if (escMatch) {
        escSteamLanguage = escMatch[1];
    }
}
// 默认语言字符串
var escT = {};
{
    escT.Market           = "View in Market";
    escT.MarketAll        = "All";
    escT.MarketCard       = "Card";
    escT.MarketBackground = "Background";
    escT.MarketEmoticon   = "Emoticon";
    escT.Inventory        = "View in My Inventory";
    escT.Showcase         = "Card Showcase";
    escT.EditBKG          = "Edit Background";
    escT.BKGTips          = "Please enter your background image link:\n(resolution:1920x1200)";
    escT.SearchFriends    = "Search Friends";
    escT.WebChat          = "Web Chat";
    escT.OneClickBuying   = "1-Click buying";
    escT.ViewMarket       = "View in Market";
    escT.SellItem         = "Sell";
    escT.BKGAlert         = "Please set a background in edit profile page first!";
    escT.ViewBKG          = "View Background";
    escT.ViewBKGSign      = "Profile Background";
    escT.LibrarySearch 	  = "Advanced Search";
    escT.BatchBuyCard     = "Batch Buy Cards (Beta, Use at Your Own Risk)";
    escT.BatchBuyBtn      = "Batch Buy";
    escT.BatchBuyConfirm  = "Batch Buy Confirmation";
    escT.BatchBuyMessage  = "Your current buy orders will be canceled. Please keep this window open while placing orders. And you need to pay at most ";
    escT.BatchBuyCheck    = "Fail to fetch market info. You may need to open the market page of any card and try again";
    escT.Confirm          = "Confirm";
    escT.Cancel           = "Cancel";
    escT.Name             = "Name";
    escT.Demand           = "Demand";
    escT.Supply           = "Supply";
    escT.Order            = "Order";
    escT.Owned            = "Owned";
    escT.Loading          = "Loading...";
    escT.TargetLevel      = "Target Level";
    escT.CurrentLevel     = "Current Level";
    escT.BoosterPack      = "Booster Pack";
    escT.ThreeCardAvg     = "Three Cards";
    escT.Fail             = "Fail";
    escT.BatchBuyModes    = ["Buy Them Now", "Lowest Sell", "Highest Buy", "Second Buy", "Lowest"];
	// Byzod Mod 2017-6-10
	escT.BatchBuyPriceTweak = "Batch Buy Price Tweak (Positive or Negative)";
	// Byzod Mod End 2017-6-10
}
// 中文支持，可仿照此格式扩展其他语言
if (escSteamLanguage == "schinese") {
    escT.Market           = "在“市场”中查看";
    escT.MarketAll        = "全部";
    escT.MarketCard       = "卡牌";
    escT.MarketBackground = "背景";
    escT.MarketEmoticon   = "表情";
    escT.Inventory        = "在我的“库存”中查看";
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
    escT.BatchBuyCheck    = "无法获取市场信息，你可能需要先打开某张卡片的市场页面，再重新尝试本功能";
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
    escT.BatchBuyModes    = ["尽快买齐", "最低卖价", "最高买价", "第二买价", "最低出价"];
	// Byzod Mod 2017-6-10
	escT.BatchBuyPriceTweak = "批量下单买价补正（可为负数）";
	// Byzod Mod End 2017-6-10
	
}else if (escSteamLanguage == "tchinese") {
    escT.Market           = "在“市集”中查看";
    escT.MarketAll        = "全部";
    escT.MarketCard       = "卡片";
    escT.MarketBackground = "背景";
    escT.MarketEmoticon   = "表情";
    escT.Inventory        = "在我的“物品庫”中查看";
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
    escT.BatchBuyCheck    = "無法獲取市場信息，你可能需要先打開某張卡片的市場頁面，再重新嘗試本功能";
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
    escT.BatchBuyModes    = ["儘快買齊", "最低賣價", "最高買價", "第二買價", "最低出價"];
	// Byzod Mod 2017-6-10
	escT.BatchBuyPriceTweak = "批量下單買價補正（可為負數）";
	// Byzod Mod End 2017-6-10
}

var escUrlBase = $J('#global_actions .user_avatar').attr('href');
var escUrlInventory = escUrlBase + 'inventory/';

if (location.href.match(/^https?:\/\/steamcommunity\.com\/(id|profiles)\/.+\/gamecards\/[0-9]+/)) {
    // 某个游戏的徽章页面
    escEnhanceBadges();
} else if (location.href.match(/^https?:\/\/store\.steampowered\.com\/recommended\/friendactivity/)) {
    // 好友活动页面
    setTimeout(escFriendActivity, 100);
} else if (location.href.match(/^https?:\/\/steamcommunity\.com\/market\/listings\/.+/)) {
    // 市场商品页面
    escOneClickBuying();
} else if (location.href.match(/^https?:\/\/steamcommunity\.com\/market\/search\?.+/)) {
    // 市场搜索页面
    escEnhanceMarketSearch();
} else if (location.href.match(/^https?:\/\/store\.steampowered\.com\/agecheck\/app\/[0-9]+\//)) {
    // 年龄检查页面
    escSkipAgeCheck();
} else if (location.href.match(/^https?:\/\/steamcommunity\.com\/(id|profiles)\/.+\/friends/)) {
    // 好友页面
    escEnhanceFriends();
} else if (location.href.match(/^https?:\/\/steamcommunity\.com\/(id|profiles)\/.+\/inventory/)) {
    // 库存页面
    escMatch = location.href.match(/(#.*)\?filter=(.*)/);
    if (escMatch) {
        location.hash = escMatch[1];
        escApplyInventoryFilter(0, escMatch[2]);
    }
    escEnhanceInventory();
} else if (location.href.match(/^https?:\/\/steamcommunity\.com\/tradeoffer\/.+/)) {
    // 离线交易页面
    setTimeout(escEnhanceTradeOffer, 500);
}

function escFriendActivity() {
    for (var prefix in g_rgPagingControls) {
        var originalResponseHandler = g_rgPagingControls[prefix].m_fnResponseHandler;
        g_rgPagingControls[prefix].SetResponseHandler(function (response) {
            originalResponseHandler(response);
            $J('img[src$="friendactivity_noimage.jpg"]').each(function () {
                var $img = $J(this);
                var $link = $J(this).parent();
                var appid = $link.data('ds-appid');
                if (appid) {
                    $link.attr('href', '//store.steampowered.com/app/' + appid + '/?cc=hk');
                    $img.attr('src', '//cdn.akamai.steamstatic.com/steam/apps/' + appid + '/capsule_sm_120.jpg');
                }
            });
        });
    }
}

function escEnhanceTradeOffer() {
    // 防止库存页卡住的迷之代码
    $J('#inventory_select_their_inventory').click();
    $J('#inventory_select_your_inventory').click();

    // 过滤对应的 appid
    var match = location.href.match(/for_tradingcard=(\d+)_/);
    if (match) {
        var appid = match[1];
        setTimeout('TradePageSelectInventory(UserYou, 753, 0)', 5);
        var filter = 'tag_filter_753_0_Game_app_' + appid;
        function apply_filter() {
            escApplyInventoryFilter(0, filter);
        }
        setTimeout(apply_filter, 500);
        $J('#inventory_select_their_inventory, #inventory_select_your_inventory').click(apply_filter);
    }
}

function escChangeMarketSearchPageSize() {
    if (!escGetLS('market_pagesize')) {
        escSetLS('market_pagesize', 20);
    }

    var pagesize = escGetLS('market_pagesize');

    g_oSearchResults.SetPageChangedHandler(function () {
        escShowInventoryAmount();
    });

    if (pagesize && g_oSearchResults.m_cPageSize != pagesize && typeof g_oSearchResults !== undefined) {
        g_oSearchResults.m_cPageSize = pagesize;
        g_oSearchResults.m_bLoading = false;
        HandleHashChange(0);
        g_oSearchResults.GoToPage(0, true);
        $J('#searchResultsRows').stop().fadeTo(0, 1.0);
    }
}

function escEnhanceMarketSearch() {
    escShowInventoryAmount();
    setTimeout(escChangeMarketSearchPageSize, 300);
}

// 打开库存时自动激活指定过滤条件
function escApplyInventoryFilter(i, filter) {
    // 尝试展开过滤器列表
    if (g_ActiveInventory && g_ActiveInventory.ShowTags)
        g_ActiveInventory.ShowTags();

    if (filter) {
        if ($J('#' + filter).length) {
            $J('#' + filter).click();
        } else {
            ++i;
            if (i < 20) // 限制重试次数
                setTimeout('escApplyInventoryFilter(' + i + ', "' + filter + '")', 500);
        }
    }
}

// 接收 SCE 数据
function escProcBadges(data) {
    // 将 SCE 页面中的链接替换成支持 https 的域名
    data = data.replace(/https?:\/\/(community\.edgecast\.steamstatic\.com|steamcommunity-a\.akamaihd\.net|cdn\.steamcommunity\.com)\//g, "//steamcommunity-a.akamaihd.net/");
    data = data.replace(/https?:\/\/(cdn\.edgecast\.steamstatic\.com|steamcdn-a\.akamaihd\.net|cdn\.akamai\.steamstatic\.com)\//g, "//steamcdn-a.akamaihd.net/");
	
	// Byzod Add 2017-6-14
	// 先去除又臭又长的下拉菜单选项……
	data = data.replace(/<select[^]+<\/select>/,"");
	// Byzod Add End 2017-6-14
	
    $J('.gamecard_badge_progress').css('bottom', 'auto').css('top', 0);
    var sce = $J(data);
    // 普通徽章
    var badges = sce.find('h3:contains("BADGES"):not(:contains("FOIL"))').closest('.content-box');
    if (window.location.href.indexOf('?border=1') != -1) {
        // 闪亮徽章
        badges = sce.find('h3:contains("FOIL BADGES")').closest('.content-box');
    }
    badges.find('.showcase-element-container.badge>.showcase-element').each(function () {
        var badge = $J(this);
        if (badge.text()) {
            //$J('.gamecard_badge_progress').remove();
            var img = badge.find('.element-image').attr('src');
            var text = badge.find('.element-text').text();
            var level = badge.find('.element-experience').html();
            $J('.badge_content.gamecard_details').append('<div class="badge_info" style="float:left;width:80px;text-align:center;padding:5px;min-height:150px;"><div class="badge_info_image"><img src="' + img + '"></div><div class="badge_info_description"><div class="badge_info_title">' + text + '</div><div>' + level + '</div></div><div style="clear: left;"></div></div>')
        }
    });
    $J('.badge_content.gamecard_details').append('<div style="clear: both"></div>');
    sce.find('h3:contains("EMOTICONS")').closest('.content-box').find('.showcase-element-container.emoticon>.showcase-element').each(function () {
        var item = $J(this);
        if (item.text()) {
            $J('.badge_content.gamecard_details').append('<div class="badge_info" style="float:left;width:80px;text-align:center;padding:5px;"><div><img src="' + item.find('.element-image.small').attr('src') + '"></div><div><img src="' + item.find('.element-image.big').attr('src') + '"></div><div><div class="badge_info_title">' + item.find('.element-text').text() + '</div><div>' + item.find('.element-experience').text() + '</div></div><div style="clear: left;"></div></div>')
        }
    });
    $J('.badge_content.gamecard_details').append('<div style="clear: both"></div>');
    sce.find('h3:contains("BACKGROUNDS")').closest('.content-box').find('.showcase-element-container.background>.showcase-element').each(function () {
        var item = $J(this);
        if (item.text()) {
            $J('.badge_content.gamecard_details').append('<div class="badge_info" style="float:left;width:160px;text-align:center;padding:5px;"><div><a target="_blank" href="' + item.find('.element-image').attr('href') + '"><img src="' + item.find('.element-image img').attr('src').replace('112x70f', '160x100f') + '"></a></div><div><div class="badge_info_title">' + item.find('.element-text').text() + '</div><div>' + item.find('.element-experience').text() + '</div></div><div style="clear: left;"></div></div>')
        }
    });
}

// 为徽章页面添加在库存、市场、SCE 查看的选项（似乎会覆盖原有链接）
function escEnhanceBadges() {
    var cards = []; // 保存卡片信息
    var booster = null; // 补充包信息
    var appid = location.href.match(/gamecards\/(\d+)(?!\w)/)[1];

    var batch_state = 0; // 状态：0=为初始化，1=正在初始化，2=初始化完成，3=正在下单

    var target_level = 5;   // 目标等级
    var current_level = 0;  // 当前等级
    var current_badge = $J('.badge_current .badge_info_description>div:eq(1)');
    if (current_badge.length) {
        current_level = parseInt(current_badge.text().match(/\d+/));
    }

	// Byzod Mod 2017-6-10
	var priceTweak = 0;  // 下单价格补正
	// Byzod Mod End 2017-6-10

    // foil = 1 为闪卡, 0 为普通卡
    var foil = window.location.href.indexOf('?border=1') != -1;
    if (foil) {
        foil = 1;
        target_level = 1;
    } else {
        foil = 0;
    }
    var link_market = '//steamcommunity.com/market/search?q=&category_753_Game[]=tag_app_' + appid + '&category_753_item_class[]=tag_item_class_2&appid=753';
    var link_inventory = escUrlInventory + "#753_6" + "?filter=tag_filter_753_6_Game_app_" + appid;
    var link_showcase = 'http://www.steamcardexchange.net/index.php?gamepage-appid-' + appid;
    $J('.gamecards_inventorylink').html('<a class="btn_grey_grey btn_small_thin" target="_blank" id="batch_buy_card" href=' + link_market + '><span>' + escT.BatchBuyCard + '</span></a>&nbsp;<a class="btn_grey_grey btn_small_thin" target="_blank" href=' + link_market + '><span>' + escT.Market + '</span></a>&nbsp;<a class="btn_grey_grey btn_small_thin" target="_blank" href=' + link_inventory + '><span>' + escT.Inventory + '</span></a>&nbsp;<a class="btn_grey_grey btn_small_thin" target="_blank" href=' + link_showcase + '><span>' + escT.Showcase + '</span></a>&nbsp;');

    // 将空值转换成问号
    function text_wrapper(value) {
        if (value !== undefined)
            return value;
        else
            return '?';
    }

    // 刷新统计表格
    function refresh_market_table() {
        var i, j;
        // 构造表头
        var content = '<table cellpadding=5 style="margin:auto;font-size:90%;">';
        content += '<tr><th>' + escT.MarketCard + '</th><th>' + escT.Name + '</th><th>' + escT.Owned + '</th><th>' + escT.Demand + '</th>';
        for (j = 0; j < escT.BatchBuyModes.length; ++j) {
            content += '<th>' + escT.BatchBuyModes[j] + '</th>';
        }
        content += '<th>'+escT.Supply+'</th><th>'+escT.Order+'</th></tr>';

        // 用于统计三张卡片均价
        var set_cost = 0;
        var set_count = 0;

        var total_cost = []; // 用于统计总费用
        var total_estimate = [];
        var is_complete = true; // 用于判断数据是否已经加载完
        for (i = 0; i < cards.length; i++) {
            var card = cards[i];
            var demand = target_level - current_level - card.count;
            if (demand < 0) demand = 0;
            if (card.price !== undefined) {
                set_cost += card.price[0]; // 使用最低卖价
                set_count++;
                var buy_now_remain = demand;
                var buy_now_amount, buy_now_price = 0, buy_now_total = 0, buy_now_limit = 0;
                for (j = 0; j < card.graph_sell.length; ++j) {
                    if (buy_now_limit && card.graph_sell[j][0] > buy_now_limit)
                        break;
                    buy_now_price = card.graph_sell[j][0];
                    if (!buy_now_limit)
                        buy_now_limit = buy_now_price * 2;
                    buy_now_amount = card.graph_sell[j][1];
                    if (j > 0)
                        buy_now_amount -= card.graph_sell[j - 1][1];
                    buy_now_amount = Math.min(buy_now_amount, buy_now_remain);
                    buy_now_total += buy_now_price * buy_now_amount;
                    buy_now_remain -= buy_now_amount;
                    if (buy_now_remain <= 0)
                        break;
                }
                //buy_now_price = Math.ceil(buy_now_price * 10) / 100; // dummy price for debug
                card.price[0] = buy_now_price;
                buy_now_amount = demand - buy_now_remain;
                var buy_now_text = format_price(buy_now_price) + ' x ' + buy_now_amount + ' ≈ ' + format_price(buy_now_total);
                if (buy_now_amount < demand)
                    buy_now_text = '<span style="color:red">' + buy_now_text + '</span>';
                card.price_text[0] = buy_now_text;
                total_estimate[0] = (total_estimate[0] || 0) + buy_now_total;
                for (j = 0; j < card.price.length; ++j) {
                    if (total_cost[j] === undefined)
                        total_cost[j] = 0;
					// Byzod Mod 2017-6-10
                    total_cost[j] += demand * (card.price[j] + priceTweak);
					// Byzod Mod End 2017-6-10
                }
            } else {
                is_complete = false;
            }
            // 构造数据行
            content += '<tr><td><img src="' + card.img + '" style="height:32px;"></td><td><a target="_blank" href="//steamcommunity.com/market/listings/753/' + encodeURIComponent(card.hash) + '">' + card.name + '</td><td>' + card.count + '</a></td><td>' + demand + '</td>';
            for (j = 0; j < escT.BatchBuyModes.length; ++j) {
                if (card.price_text && card.price_text[j]) {
                    content += '<td>' + card.price_text[j] + '</td>';
                } else {
                    content += '<td>?</td>';
                }
            }
            content += '<td>' + text_wrapper(card.quantity) + '</td><td>' + text_wrapper(card.order) + '</td></tr>';
        }
        content += "</table>";
        if (booster) {
            var b = '<a target="_blank" href="' + booster.link + '">' + escT.BoosterPack + '</a>: ' + booster.price + '&nbsp;';
            if (is_complete) {
                b += escT.ThreeCardAvg + ': ' + format_price(set_cost / set_count * 3);
            }
            content = b + content;
        }
        // 如果加载完成，显示按钮并更新总费用
        if (is_complete) {
            for (j = 0; j < total_cost.length; ++j) {
                $J('.btn_batch_buy:eq(' + j + ') span.total_cost').text(format_price(total_cost[j]) + (total_estimate[j] ? ' ≈ ' + format_price(total_estimate[j]) : ''));
            }
            if (batch_state == 1) {
                $J('.btn_batch_buy').fadeIn();
				// Byzod Mod 2017-6-10
				$J('.price_tweak_container').fadeIn();
				// Byzod Mod End 2017-6-10
                batch_state = 2;
            }
        }
        $J('#market_data').html(content);
    }

    // 调用 Steam 网页接口所需要的几个变量，会在分析市场页面的时候填写
    var g_sessionID = '';
    var g_walletCurrency = '';
    var g_strCountryCode = '';
    var g_strLanguage = '';

    // 改用官方函数格式化价格
    function format_price(price) {
        return v_currencyformat(price * 100, GetCurrencyCode(g_walletCurrency), g_strCountryCode);
    }

    // 读取第 i 张卡的市场信息，延迟递归
    function load_card_listing(i) {
        if (i >= cards.length)
            return;
        var card = cards[i];
        if (card.hash === undefined) {
            load_card_listing(i + 1);
            return;
        }
        $J.get('//steamcommunity.com/market/listings/753/' + encodeURIComponent(card.hash), function (data) {
            g_sessionID = data.match(/g_sessionID = "([^"]+)"/)[1];
            g_walletCurrency = parseInt(data.match(/"wallet_currency":(\d+)/)[1]);
            g_strLanguage = data.match(/g_strLanguage = "([^"]+)"/)[1];
            g_strCountryCode = data.match(/g_strCountryCode = "([^"]+)"/)[1];
            var nameid = data.match(/Market_LoadOrderSpread\( (\d+)/)[1];
            var order = data.match(/id="mybuyorder_(\d+)">[\s\S]*<span class="market_listing_price">\s*<span class="market_listing_inline_buyorder_qty">(.+?) @<\/span>\s*(.*?)\s*<\/span>/);
            card.nameid = nameid;

            // 是否有买单
            card.order = '0';
            if(order){
                card.order_id = order[1];
                card.order_price = order[2];
                card.order_amount = order[3];
                card.order = order[3]+' x '+order[2];
            }

            // 获取买卖信息
            $J.ajax({
                url: '//steamcommunity.com/market/itemordershistogram',
                type: 'GET',
                data: {
                    country: g_strCountryCode,
                    language: g_strLanguage,
                    currency: g_walletCurrency,
                    item_nameid: nameid
                }
            }).success(function(data){
                var graph_sell = data.sell_order_graph; // 卖单
                var graph_buy = data.buy_order_graph;   // 买单
                card.graph_sell = graph_sell;
                // 如果没有卖单则不进行处理
                if (!graph_sell.length)
                    return;
                // 如果没有买单则将最低价卖单作为买单
                if (!graph_buy.length)
                    graph_buy = [graph_sell[0]];

                card.price = []; // 价格信息
                card.price_text = []; // 价格的文字说明

                // 尽快买齐（先占位，之后根据购买数量动态计算）
                card.price.push(null);
                card.price_text.push(null);

                // 最低卖单
                card.price.push(graph_sell[0][0]);
                card.price_text.push(format_price(graph_sell[0][0]) + ' x ' + graph_sell[0][1]);

                var j = 0;
                // 最高买单
                card.price.push(graph_buy[j][0]);
                card.price_text.push(format_price(graph_buy[j][0]) + ' x ' + graph_buy[j][1]);

                if (graph_buy[1]) {
                    j = 1;
                }
                // 次高买单
                card.price.push(graph_buy[j][0]);
                card.price_text.push(format_price(graph_buy[j][0]) + ' x ' + graph_buy[j][1]);

                j = graph_buy.length - 1;
                // 最低价格
                card.price.push(graph_buy[j][0]);
                card.price_text.push(format_price(graph_buy[j][0]) + ' x ' + graph_buy[j][1]);

                refresh_market_table();
            });

            refresh_market_table();
            setTimeout(function () { load_card_listing(i + 1); }, 500);
        }).fail(function () {
            // TODO: 这里可能需要一个更好的解决方法
            alert(escT.BatchBuyCheck);
        });
    }

    // 开始批量下单，mode 为出价模式为
    function batch_buy(mode) {
        // 取消第 i 张卡片的订单，延迟递归
        function cancel_buy(i) {
            // 全部取消后开始下单
            if (i == cards.length) {
                place_buy(0);
                return;
            }
            var card = cards[i];
            if (card.order_id !== undefined) {
                $J.post('/market/cancelbuyorder/', { sessionid: g_sessionID, buy_orderid: card.order_id }, function (data) {
                    if (data.success == 1) {
                        card.order = '0';
                    } else {
                        card.order = escT.Fail;
                    }
                    refresh_market_table();
                    setTimeout(function () { cancel_buy(i + 1); }, 500);
                });
            } else {
                cancel_buy(i + 1);
            }
        }

        // 为第 i 张卡片下单
        function place_buy(i) {
            if (i == cards.length) {
                return;
            }
            var card = cards[i];
            var demand = target_level - current_level - card.count;
            if (card.hash !== undefined && demand > 0) {
				// Byzod Mod 2017-6-10
				var price = card.price[mode] + priceTweak;
				// Byzod Mod End 2017-6-10
                $J.ajax({
                    url: 'https://steamcommunity.com/market/createbuyorder/',
                    type: 'POST',
                    data: {
                        sessionid: g_sessionID,
                        currency: g_walletCurrency,
                        appid: 753,
                        market_hash_name: card.hash,
                        price_total: Math.round(demand * price * 100),
                        quantity: demand
                    },
                    crossDomain: true,
                    xhrFields: { withCredentials: true }
                }).done(function (data) {
                    if (data.success == 1) {
                        card.order = format_price(price) + ' x ' + demand;
                    } else {
                        card.order = escT.Fail;
                    }
                    refresh_market_table();
                    setTimeout(function () { place_buy(i + 1); }, 500);
                });
            } else {
                place_buy(i + 1);
            }
        }

        // 先取消已有订单
        cancel_buy(0);
    }

    // 在按钮上绑定批量买卡的初始化函数
    $J('#batch_buy_card').click(function () {
        if (batch_state == 0) {
            batch_state = 1;
            var t = $J(this).closest('.badge_detail_tasks');
            t.before('<div class="badge_detail_tasks"><div class="gamecards_inventorylink">'+escT.CurrentLevel+' : <span style="background-color: rgba(0, 0, 0, 0.2); border: 1px solid #000; border-radius: 3px; box-shadow: 1px 1px 0 0 rgba(91, 132, 181, 0.2); color: #909090; width: 30px; display: inline-block;">'+current_level+'</span>&nbsp;'+escT.TargetLevel+' : <input type="text" value="5" id="target_level" style="width:30px;"></div><div class="gamecards_inventorylink" id="market_data">'+escT.Loading+'</div></div><div style="clear: both"></div>');

            // 出价按钮
            var btn = '&nbsp;' + escT.BatchBuyBtn + ':';
            for (var j = 0; j < escT.BatchBuyModes.length; ++j) {
                btn += '&nbsp;<a class="btn_grey_grey btn_small_thin btn_batch_buy" style="display:none;" data-mode="' + j + '"><span>' + escT.BatchBuyModes[j] + ' <span class="total_cost">?</span></span></a>';
            }
            $J('#target_level').after(btn);
            $J('.btn_batch_buy').click(function(){
                var btn = $J(this);
                var total_cost = btn.find('.total_cost').text();
                var mode = btn.data('mode');
                ShowConfirmDialog(
                    escT.BatchBuyConfirm,
                    escT.BatchBuyMessage + total_cost,
                    escT.Confirm + ' (' + total_cost + ')',
                    escT.Cancel
                ).done(function () {
                    $J('.btn_batch_buy').fadeOut();
					// Byzod Mod 2017-6-10
					$J('.price_tweak_container').fadeOut();
					// Byzod Mod End 2017-6-10
                    batch_buy(mode);
                });
            });

            // 输入等级
            $J('#target_level').keyup(function () {
                var t = $J(this).val();
                if (!isNaN(t)) {
                    t = parseInt(t);
                    target_level = t;
                    refresh_market_table();
                }
            });
			
			// Byzod Mod 2017-6-10
			// 价格补正框
			var priceTweakInput = '<div class="price_tweak_container" style="display:none;">' + escT.BatchBuyPriceTweak + ' : <input type="number" value="0" step=0.01 id="price_tweak" style="width:60px;color:#909090;background-color:rgba(0,0,0,0.2);border:1px solid #000;border-radius:3px;"></div>';
			$J(".gamecards_inventorylink").first().append('<br />' + priceTweakInput);
			$J("#price_tweak").get(0).oninput = function(e){
				// 获取买价补正
				priceTweak = isNaN(e.target.value) ? 0 : parseFloat(e.target.value);
				refresh_market_table();
				console.log("price tweak: " + priceTweak);//DEBUG
			};
			// Byzod Mod End 2017-6-10

            // 读取卡片基本信息
            $J('.badge_detail_tasks>.badge_card_set_card').each(function () {
                var card = $J(this);
                var name = card.find('.badge_card_set_text:eq(0)').text().replace(/^\s+\(\d+\)/, '').trim();
                var count = card.find('.badge_card_set_text_qty').text();
                if(count)
                    count = parseInt(count.replace(/[()]/g, ''));
                else
                    count = 0;
                var img = card.find('img.gamecard').attr('src');
                cards.push({
                    'name': name,
                    'img': img,
                    'count': count
                });
            });

            Array.prototype.findIndexCallback = function (callback) {
                for (var i = 0; i < this.length; ++i) {
                    if (callback(this[i])) {
                        return i;
                    }
                }
                return -1;
            };

            // 检查补充包价格
            if (foil == 0) {
                $J.getJSON('//steamcommunity.com/market/search/render/?category_753_item_class[]=tag_item_class_5&appid=753&category_753_Game[]=tag_app_' + appid, function (data) {
                    var list = $J('<div>' + data.results_html + '</div>');
                    var l = list.find('.market_listing_row_link');
                    if (l.length == 1) {
                        var quantity = l.find('.market_listing_num_listings_qty').text();
                        quantity = parseInt(quantity.replace(/[^\d]/, ''));
                        var link = l.attr('href');
                        var price = l.find('.market_listing_their_price .market_table_value>span.normal_price').text().trim();
                        booster = {
                            'link': link,
                            'quantity': quantity,
                            'price': price
                        };
                    }
                });
            }

            // 通过市场获取所有卡片列表
            $J.getJSON('//steamcommunity.com/market/search/render/?start=0&count=20&category_753_cardborder[]=tag_cardborder_'+foil+'&appid=753&category_753_Game[]=tag_app_'+appid, function(data){
                var list = $J('<div>'+data.results_html+'</div>');
                list.find('.market_listing_row_link').each(function(){
                    var l = $J(this);
                    //var name = l.find('.market_listing_item_name').text().trim();
                    //var img = l.find('.market_listing_item_img').attr('src').replace('/62fx62f', '');
                    var quantity = l.find('.market_listing_num_listings_qty').text();
                    quantity = parseInt(quantity.replace(/[^\d]/, ''));
                    var link = l.attr('href');
                    var hash = link.match(/\/753\/([^?]+)/)[1];
                    hash = decodeURIComponent(hash);
                    var i = -1;
                    var match, hash_name;
                    //i = cards.findIndexCallback(function (c) { return c.img == img; });
                    if (i < 0 && (match = hash.match(/\d+-(.*)/))) {
                        hash_name = match[1].trim();
                        i = cards.findIndexCallback(function (c) { return c.name == hash_name; });
                    }
                    if (i < 0 && (match = hash.match(/\d+-(.*)\((Foil|Foil Trading Card|Trading Card)\)/))) {
                        hash_name = match[1].trim();
                        i = cards.findIndexCallback(function (c) { return c.name == hash_name; });
                    }
                    if (i > -1) {
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

    // 高亮数量
    $J('.badge_card_set_text_qty').css('color', 'red');
}

function escListingClickPurchase(){
    $('market_buynow_dialog_purchase').click();
    $('market_buynow_dialog_cancel').click();
}

function escOneClickBuying(){
    // 添加一键购买选项
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
            $J(this).html('<img src="//steamcommunity-a.akamaihd.net/public/images/login/throbber.gif">');
            $row.delay(20000).fadeTo('slow', 0);
        }else{
            $J('#market_buynow_dialog').css({opacity: 1});
        }
    });

    // 自动勾选同意协议
    $J('#market_buynow_dialog_accept_ssa, #market_buyorder_dialog_accept_ssa').prop('checked', true);
}

// cookie 操作函数
function escGetCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + '=');
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(';', c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return '';
}

function escSetCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + '=' + escape(value) + ( (expiredays == null) ? '' : '; expires=' + exdate.toGMTString() ) + ';path=/';
}

function escGetLS(key) {
    var val = null;
    if (typeof localStorage !== undefined && localStorage['esc_' + key] !== undefined) {
        val = JSON.parse(localStorage['esc_' + key]);
    }
    return val;
}

function escSetLS(key, val) {
    if (typeof localStorage !== undefined) {
        localStorage['esc_' + key] = JSON.stringify(val);
    }
}

function escSkipAgeCheck() {
    escSetCookie('birthtime', -473356799, 365);
    window.location = window.location;
}

function escEnhanceFriends() {
    $J('.manage_friends_btn_ctn').prepend('<span class="btn_grey_black btn_details btn_small btn_manage_friends"><span><a target="_blank" href="//steamcommunity.com/chat/">' + escT.WebChat + '</a></span></span>');
}

function escShowInventoryAmount() {
    var inventory = escGetLS('inventory');
    $J('.market_listing_row_link').each(function () {
        var link = $J(this);
        link.find('.market_listing_item_esc_amount').remove();
        var href = link.attr('href');
        var match = href.match(/steamcommunity\.com\/market\/listings\/([^$?]*)/);
        if (match != null) {
            var identifier = decodeURIComponent(match[1]);
            if (inventory && inventory.hasOwnProperty(identifier)) {
                var amount = inventory[identifier];
                link.find('.market_listing_item_name').prepend('<span style="color:red;" class="market_listing_item_esc_amount">(' + amount + ') </span>');
            }
        }
    });
}

function escUpdateInventoryCache() {
    if (!g_steamID)
        return;
    if (!g_ActiveUser || g_ActiveUser.strSteamId != g_steamID)
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
        for (var i = 0; i < a.length; ++i) {
            var id = a[i];
            $J.getJSON(escUrlInventory + 'json/' + appid + '/' + id + '/', function (data) {
                if (data.success) {
                    var inv = data.rgInventory;
                    var des = data.rgDescriptions;
                    for (var id in inv) {
                        var i = inv[id];
                        var d = des[i.classid + '_' + i.instanceid];
                        if (!d) {
                            continue;
                        }
                        var name = d.name;
                        if (d.market_name)
                            name = d.market_name;
                        if (d.market_hash_name)
                            name = d.market_hash_name;
                        var identifier = d.appid + '/' + name;
                        var amount = parseInt(i.amount);
                        if (inventory.hasOwnProperty(identifier)) {
                            inventory[identifier] += amount;
                        } else {
                            inventory[identifier] = amount;
                        }
                    }
                    escSetLS('inventory', inventory);
                }
            });
        }
    }
}

function escEnhanceInventory() {
    // 自动勾选同意协议
    $J('#market_sell_dialog_accept_ssa').prop('checked', true);

    // 引入显示价格列表所需要的样式表
    $J('head').append('<link type="text/css" rel="stylesheet" href="//steamcommunity-a.akamaihd.net/public/css/skin_1/economy_market.css?v=1617814919">');

    var div = $J('<div style="border-top: 1px solid rgb(93, 137, 44); padding-top: 10px; margin-top: 8px;"></div>');
    div.append('<style>.market_listing_action_buttons{display:none;}</style><div class="market_content_block market_home_listing_table market_home_main_listing_table market_listing_table" id="searchResultsTable"><div id="searchResultsRows"></div></div>');
    $J('#market_sell_dialog .newmodal_content').append(div);

    $J('#market_sell_dialog_accept').click(function () {
        // 记住上次的售价
        if ($J('#market_sell_currency_input').val())
            escSetLS('last_sell_price', $J('#market_sell_currency_input').val());
    });

    $J('.market_dialog_input').keydown(function (e) {
        // 记住上次的售价
        if ($J('#market_sell_currency_input').val())
            escSetLS('last_sell_price', $J('#market_sell_currency_input').val());
        // Ctrl + Enter 直接上架
        if (e.ctrlKey && e.keyCode == 13) {
            setTimeout(function () {
                if (SellItemDialog.m_bWaitingForUserToConfirm) {
                    $('market_sell_dialog_ok').click();
                }
            }, 100);
        }
    });

    // 覆盖出售按钮函数
    var originalSell = window.SellCurrentSelection;
    window.SellCurrentSelection = function(){
        var result = $J("#searchResultsRows");
        result.hide();
        var selected_item = window.g_ActiveInventory.selectedItem;
        selected_item = selected_item.description || selected_item;
        var appid = selected_item.appid;
        var market_hash_name = selected_item.market_hash_name || selected_item.market_name;
        if (market_hash_name) {
            $J.getJSON("//steamcommunity.com/market/listings/" + appid + "/" + encodeURIComponent(market_hash_name) + "/render/", {
                query: "",
                start: 0,
                count: 20,
                country: g_strCountryCode,
                language: g_strLanguage,
                currency: typeof g_rgWalletInfo != 'undefined' ? g_rgWalletInfo['wallet_currency'] : 1
            }, function (data) {
                result.html(data.results_html).slideDown('slow');
                //result.prepend("0 - 20 / "+data.total_count);
            });
        }
        originalSell();
        if (escGetLS('last_sell_price')) {
            $J('#market_sell_currency_input').val(escGetLS('last_sell_price'));
            SellItemDialog.OnInputKeyUp();
        }
        // 将出售框定位到顶部
        $J('#market_sell_dialog').css('top', $J(window).scrollTop());
    };
    setTimeout(escUpdateInventoryCache, 1000);
}

// Enhanced Steam Community 代码结束

}

// 将上面的代码插入到网页中
var script = escMain.toString();
script = script.slice(script.indexOf('{') + 1, -1);
exec(script);

var match = location.href.match(/^https?:\/\/steamcommunity.com\/(id|profiles)\/.+\/gamecards\/([0-9]+)/);
if (match) {
    // 某个游戏的徽章页面
    var appid = match[2];
    load('http://www.steamcardexchange.net/index.php?gamepage-appid-' + appid, 'Badges');
}

// Script Injection
function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = fn;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

// Load url and call proc function
function load(url, id) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            exec('escProc' + id + '("' + addslashes(response.responseText) + '")');
        }
    });
}

// Add slashes to string
function addslashes(string) {
    return string
        .replace(/\\/g, '\\\\')
        .replace(/\u0008/g, '\\b')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\f/g, '\\f')
        .replace(/\r/g, '\\r')
        .replace(/'/g, '\\\'')
        .replace(/"/g, '\\"');
}
