// ==UserScript==
// @name         Neopets shop price beta
// @namespace    http://tampermonkey.net/
// @version      0.05
// @description  display price info at neopets.com; PLZ NOTE THAT USING THIS USER SCRIPT IS ON YOUR OWN RISK
// @author       lichdkimba
// @match        http://www.neopets.com/objects.phtml?type=shop&obj_type=*
// @match        http://www.neopets.com/market.phtml*
// @match        http://www.neopets.com/market_your.phtml*
// @match        http://www.neopets.com/inventory.phtml*
// @match        http://www.neopets.com/safetydeposit.phtml*
// @match        http://www.neopets.com/winter/igloo2.phtml
// @match        http://www.neopets.com/objects.phtml?obj_type=*
// @match        http://www.neopets.com/closet.phtml*
// @match        http://www.neopets.com/auctions*
// @match        http://www.neopets.com/island/tradingpost*
// @match        http://www.neopets.com/useobject.phtml
// @match        http://www.neopets.com/genie.phtml*
// @match        http://www.neopets.com/winter/igloo2.phtml
// @match        http://www.neopets.com/faerieland/employ/employment.phtml?type=jobs*
// @match        http://www.neopets.com/games/kadoatery*
// @match        http://www.neopets.com/iteminfo.phtml?*
// @match        http://www.neopets.com/winter/snowfaerie.phtml*
// @match        http://www.neopets.com/halloween/esophagor.phtml*
// @match        http://www.neopets.com/halloween/witchtower.phtml*
// @match        http://www.neopets.com/island/kitchen.phtml*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/419378/Neopets%20shop%20price%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/419378/Neopets%20shop%20price%20beta.meta.js
// ==/UserScript==

let script_version = "0.05"
let c_url = window.location.href;
let items = []
let script_setting = {}
try {

    let my_data = GM_getValue("script_setting")
    if (typeof my_data != "undefined") {
        script_setting = JSON.parse(my_data)
        console.log(script_setting)
    }

} catch (e) {
    GM_setValue("script_setting", JSON.stringify({}))
}

function set_setting(key, value) {
    console.log("设置-",key,value)
    script_setting[key] = value
    GM_setValue("script_setting", JSON.stringify(script_setting))
}
function get_setting(key){
    if(script_setting.hasOwnProperty(key)){
        return script_setting[key]
    }else{
        return undefined
    }
}
//检测dom
function detect_dom(el, callback_function) {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector(el);

// Options for the observer (which mutations to observe)
    const config = {attributes: true, childList: true, subtree: true};

// Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length >= 1 && mutation.type === "childList") {
                observer.disconnect();
                console.log('A child node has been added or removed.');
                callback_function();
                observer.observe(targetNode, config);
            }
        }
    };

// Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
    observer.observe(targetNode, config);

// Later, you can stop observing
//     observer.disconnect();
}


var links = []
var differs = []

function get_official_shop_price() {
    let tds = $(".shop-item")
    items = []

    let ItemDB_price;
    let iteminfo;
    if (tds.length > 0) {
        for (let i = 0; i < tds.length; i++) {
            try {
                items[i] = {
                    name: $(".item-name b").eq(i)[0].innerText,
                    cost: parseInt($(".shop-item p:nth-child(4)").eq(i)[0].innerText.replace("Cost: ", "").replace(" NP", "").replace(/\,/g, "")),
                }
                let item_elements = $(".shop-item")
                ItemDB_price = PriceOnItemDB(items[i].name, 2)
                if (typeof ItemDB_price == "undefined") {
                    item_elements.eq(i).append('<br><span style="color:red">ItemsDB: ' + 'No Data' + '</span>')
                    differs.push('-1000')
                    continue;
                }
                if (ItemDB_price.indexOf("Inflation") !== -1) {
                    item_elements.eq(i).append('<br>ItemsDB:Inflation Notice NP')
                    differs.push('300000')
                } else {
                    var pricedifference = ItemDB_price - items[i].cost
                    differs.push(pricedifference)
                    let tuba_mode = 1
                    ///赋予高亮颜色
                    if (pricedifference <= 100) {
                        if (tuba_mode !== 1) {
                            item_elements.eq(i).css('display', 'none')
                        }
                        item_elements.eq(i).css('background-color', 'black')
                        item_elements.eq(i).css('color', 'white')
                    }
                    if (pricedifference >= 100 && pricedifference < 1000) {
                        if (tuba_mode !== 1) {
                            item_elements.eq(i).css('display', 'none')
                        }
                        item_elements.eq(i).css('background-color', 'grey')
                    }
                    if (pricedifference >= 1000 && pricedifference < 3000) {
                        if (tuba_mode !== 1) {
                            item_elements.eq(i).css('display', 'none')
                        }
                        item_elements.eq(i).css('background-color', 'darkviolet')
                    }
                    if (pricedifference >= 3000 && pricedifference < 5000) {
                        if (tuba_mode !== 1) {
                            item_elements.eq(i).css('display', 'none')
                        }
                        item_elements.eq(i).css('background-color', 'indianred')
                    }
                    if (pricedifference >= 5000 && pricedifference < 10000) {
                        if (tuba_mode !== 1) {
                            item_elements.eq(i).css('display', 'none')
                        }
                        item_elements.eq(i).css('background-color', 'purple')
                    }
                    if (pricedifference >= 10000 && pricedifference < 20000) {
                        item_elements.eq(i).css('background-color', 'Crimson')
                    }
                    if (pricedifference >= 20000 && pricedifference < 50000) {
                        item_elements.eq(i).css('background-color', 'darkred')
                        //window.location.replace(links[i])
                    }
                    if (pricedifference >= 50000 && pricedifference < 1000000) {
                        item_elements.eq(i).css('background-color', 'goldenrod')
                        //window.location.replace(links[i])
                    }
                    if (pricedifference >= 1000000) {
                        item_elements.eq(i).css('background-color', 'gold')
                        //window.location.replace(links[i])
                    }
                    if (pricedifference < 1000 && pricedifference > 300) {
                        item_elements.eq(i).css('background-color', 'mediumpurple')
                    }
                    if (pricedifference < 0) {
                        item_elements.eq(i).css('background-color', 'black')
                        item_elements.eq(i).css('color', 'white')
                    }
                    item_elements.eq(i).append('<br>ItemsDB: ' + parse_NP_2_money(ItemDB_price, items[i].name) + ' NP')
                }
            } catch (e) {
                console.log(e)
            }

        }


        //自動跳轉
            if (get_setting("auto-jump")) {
                let min_diff = 50000
                if (script_setting.hasOwnProperty("auto-jump-value")) {
                    min_diff = script_setting["auto-jump-value"]
                }
                if (Math.max.apply(Math, differs) >= min_diff) {
                    console.log(links, differs)
                    setTimeout(function () {
                        let element = document.querySelectorAll(".shop-item .item-img")[differs.indexOf(Math.max.apply(Math, differs))]
                        let itemLink = element.dataset.link;
                        window.open(itemLink, '_self');
                    }, Math.random() * 3000 + 500)
                }
            }


        //禁用pop
        $(".shop-item .item-img").ready(function () {
            if (script_setting.hasOwnProperty("pop_up")) {
                if (script_setting["pop_up"]) {
                    confirmPurchase = function (element) {
                        var itemLink = element.dataset.link;
                        window.open(itemLink, '_self');
                    }

                    console.log(confirmPurchase)
                }
            }
        })
    }
}


//物品柜
function get_inventory_price() {
    if (c_url.indexOf("http://www.neopets.com/inventory.phtml") === -1) {
        return 0
    }
    detect_dom(".inv-items", function () {

        let tds = $('.inv-items .item-name')
        console.log(tds)
        let totalm = 0
        let itemsname;
        let ItemDB_price;
        let iteminfo;
        for (let i = 0; i < tds.length; i++) {
            try {
                iteminfo = tds[i].innerText
            } catch (e) {
                console.log(e)
            }

            itemsname = iteminfo
            ItemDB_price = PriceOnItemDB(itemsname)
            if (ItemDB_price < 100000) {
                totalm += ItemDB_price
            }
            tds.eq(i).append('<br>ItemsDB: ' + parse_NP_2_money(ItemDB_price, itemsname) + ' NP')
        }
    })
}

//拍卖
function get_auction_price() {
    if (c_url.indexOf("http://www.neopets.com/auctions.phtml") == -1) {
        return 0
    }
    tds = $('#content > table > tbody > tr > td.content > center > table > tbody > tr > td:nth-child(3) > a')
    for (var i = 0; i < tds.length; i++) {
        var item_name = tds[i].innerText
        var current_price = $('#content > table > tbody > tr > td.content > center > table > tbody > tr > td:nth-child(7) > b')[i + 1].innerText
        var ItemDB_price = PriceOnItemDB(item_name)
        $('#content > table > tbody > tr > td.content > center > table > tbody > tr > td:nth-child(5)' + ':eq(' + (i + 1) + ')').append('\n' + parse_NP_2_money(ItemDB_price, item_name) + ' NP')
        var price_dif = parseInt(current_price) / ItemDB_price
        if (price_dif >= 1.01) {
            $('#content > table > tbody > tr > td.content > center > table > tbody > tr:eq(' + (i + 1) + ')').css('background-color', 'dimgray')
            //$('#content > table > tbody > tr > td.content > center > table > tbody > tr:eq(' + (i + 1) + ')').css('color', 'white')
        }
        if (price_dif >= 0.8 && price_dif < 1.01) {
            $('#content > table > tbody > tr > td.content > center > table > tbody > tr:eq(' + (i + 1) + ')').css('background-color', 'darkgray')
        }
        if (price_dif >= 0.1 && price_dif < 0.3 && ItemDB_price >= 5000) {
            $('#content > table > tbody > tr > td.content > center > table > tbody > tr:eq(' + (i + 1) + ')').css('background-color', 'goldenrod')
        }

        if (ItemDB_price >= 100000) {
            var tp_url = "http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&sort_by=newest&search_string="
            var jn_url = "https://items.jellyneo.net/search/?name="
            var ac_url = "http://www.neopets.com/genie.phtml?type=process_genie&criteria=exact&auctiongenie="
            var sw_url = "http://www.neopets.com/market.phtml?type=wizard&string="
            var url_name = item_name.replace(/\ /g, '+')

            var html = '<br><a href="' + tp_url + url_name + '">TP</a>' + "·" + '<a href="' + jn_url + url_name + '">JN</a>' + "·" + '<a href="' + ac_url + url_name + '">AC</a>' + "·" + '<a href="' + sw_url + url_name + '">SW</a>'

            $('#content > table > tbody > tr > td.content > center > table > tbody > tr > td:nth-child(3)' + ':eq(' + (i + 1) + ')').append(html)
        }
    }
}


//返回字符串,给金钱加逗号分隔
function parse_NP_2_money(money, name) {
    let error_item = ["Piece of a treasure map", "Secret Laboratory Map", "Spooky Treasure Map"]
    if ($.inArray(name, error_item) !== -1) {
        return "Map Item"
    }
    if (money === "Inflation Notice") {
        return money
    }

    function money_2_money(money) {

        if (money) {
            money = String(money)
            money = money.match(/\d+/)[0]
            if (money === undefined) {
                return "0"
            }
            let left = money.split('.')[0],
                right = money.split('.')[1];
            right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '';
            let temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
            return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
        } else if (money === 0) { //注意===在這裡的使用，如果傳入的money為0,if中會將其判定為boolean類型，故而要另外做===判斷
            return '0';
        } else {
            return "";
        }
    };
    return money_2_money(money)

}

function PriceOnItemDB(itemname, mode) {
    if (typeof item_neo[itemname] != "undefined") {
        if (mode === 2) {
            return item_neo[itemname].price.replace(/\,/g, '')
        }
        if (mode === 1) {
            return item_neo[itemname].price
        } else {
            return parseInt(item_neo[itemname].price.replace(/\,/g, ''))
        }

    } else {
        return undefined
    }
}

let item_neo = {}

function ParseItemDB() {

    items = get_string_DB.split("|||")
    let item_obj;
    for (let i = 0; i < items.length; i++) {
        let item_arr = items[i].split(":::")
        if (typeof item_arr[0] != "undefined" && typeof item_arr[1] != "undefined") {
            item_obj = {
                'name': item_arr[0],
                'price': item_arr[1].replace(' NP', ''),
            }
            item_neo[item_arr[0]] = item_obj
        }
    }
}

let get_string_DB = GM_getValue("stringDB")
let get_time = GM_getValue("stringDBTime")
let get_json = GM_getValue("DB_json")


if (get_string_DB === undefined) {
    get_string_DB = ''
}

function get_DBstring_from_server() {
    $.ajax({
        type: 'GET',
        url: "http://lichdkimba.com/storage.txt",
        cache: false,
        success: function (data) {
            get_string_DB = data
            GM_setValue("stringDB", get_string_DB)
            GM_setValue("stringDBTime", new Date())
            ParseItemDB()
            GM_setValue("DB_json", JSON.stringify(item_neo))
        },
    });
}

let time_difference = Date.parse(new Date()) - Date.parse(get_time)

if (time_difference > 86400000 || isNaN(time_difference) || time_difference == undefined) {
    get_DBstring_from_server()
}

if (get_json === undefined || get_json.length <= 200) {
    console.log("没有有效的JSON")
    ParseItemDB()
    GM_setValue("DB_json", JSON.stringify(item_neo))

} else {
    item_neo = JSON.parse(get_json)

}
get_official_shop_price()
get_inventory_price()
//插件设置功能
c_url = window.location.href
if (c_url === "http://www.neopets.com/inventory.phtml" || c_url === "https://www.neopets.com/inventory.phtml") {
    $('.navsub-left__2020').append('<a href="javascript:0" class="pochan-setting">Setting(破)</a>&nbsp;<a href="http://www.neopets.com/quickstock.phtml">Quick Stock</a>')
    $('.pochan-setting').click(function () {
        $('#container__2020').html(`<br><br><br><br>
<a href="http://www.neopets.com/inventory.phtml">返回物品栏</a><br>
<input class="popup-close" type="checkbox">关闭官方商店购买时的Popup<br>
<input class="auto-jump" type="checkbox">自动跳转，当物品与JN价格差距达到<select class="auto-jump-select"></select><br>
<span>当前版本-${script_version}</span><br><button id="po_force_refresh">强制刷新数据</button>`);
        //加入option
        let auto_jump_options = [500, 1000, 2000, 3000, 5000, 7500, 10000, 20000, 30000, 50000, 100000]
        let temp_html = ""
        for (let i = 0; i < auto_jump_options.length; i++) {
            temp_html += `<option value="${auto_jump_options[i]}">${auto_jump_options[i]}</option>`
        }
        $(".auto-jump-select").append(temp_html)
        if (get_setting("pop_up")) {
            $(".popup-close").prop('checked', true);
        } else {
            $(".popup-close").prop('checked', false);
        }
        if (get_setting("auto-jump")) {
            $(".auto-jump").prop('checked', true);
        } else {
            $(".auto-jump").prop('checked', false);
        }
        if (get_setting("auto-jump-value")) {
            console.log(get_setting("auto-jump-value"))
            $(".auto-jump-select").val(parseInt(get_setting("auto-jump-value")))
        }
        $('.popup-close').change(function () {
            set_setting("pop_up", this.checked)
        })
        $('.auto-jump-select').change(function () {
            set_setting("auto-jump-value", $(this).val())
        })
        $('.auto-jump').change(function () {
            set_setting("auto-jump", this.checked)
            set_setting("auto-jump-value", $(".auto-jump-select").val())
        })
        $("#po_force_refresh").click(function () {
            get_DBstring_from_server()
        })
    })
}
