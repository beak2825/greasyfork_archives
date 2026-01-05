// ==UserScript==
// @name         淘宝搜索页自动勾选排序筛选
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      1.2
// @description  自动按照你想要的设置排序，省去了点点点和刷新的烦人操作，支持自动勾选双十一与设置价格区间
// @author       BackRunner
// @include      *://s.taobao.com/search?*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/24565/%E6%B7%98%E5%AE%9D%E6%90%9C%E7%B4%A2%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E6%8E%92%E5%BA%8F%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/24565/%E6%B7%98%E5%AE%9D%E6%90%9C%E7%B4%A2%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E6%8E%92%E5%BA%8F%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

// ========================
//         更新日志
// ========================
// 2016.11.12 - 1.2
// 去除双十一相关代码
// 添加变量的储存检测（设置脚本的方式扔为手动修改代码）
// ========================
// 2016.11.5 - 1.1
// 更新一些新的可自动勾选的选项
// 更严格的判断条件
// 修改默认设置
// ========================
//          Tips
// ========================
// 请在详细阅读脚本描述和代码内的注释后使用本脚本
// 请根据脚本内的注释并根据您的自身需求进行相应的修改
// 请勿修改功能区和主执行区内的代码
// 请不要修改脚本加载位置，保持默认
// 本脚本仅在进入搜索页/手动刷新搜索页时执行，执行后页面搜索页会刷新一次
// ========================
(function() {
    //=======================
    //      变量定义区
    //=======================
    var baoyou = false;
    var sale = false;
    var renqi = false;
    var credit = false;
    var priceasc = false;
    var tmall = false;
    var reserveprice = false;
    var zhengpin = false;
    var huodaofukuan = false;
    var yunfeixian = false;

    //存储变量相关
    var s_value = "检测到变量更改：\n";
    var isValueChanged = false;
    //=======================
    //以下变量请您根据需要修改
    //排序功能只能开启一个
    //开启请将等号后面的值改为true，关闭请改为false
    //=======================
    //自动勾选包邮（默认开启）
    var addbaoyou = true;
    //自动勾选按销量排序（默认开启）
    var addsale = true;
    //自动勾选按人气排序（默认关闭）
    var addrenqi = false;
    //自动勾选按信用排序（默认关闭）
    var addcredit = false;
    //自动勾选按价格从低到高排序（默认关闭）
    var addpriceasc = false;
    //自动勾选天猫（默认关闭）
    var addtmall = false;
    //自动勾选正品保障（默认关闭）
    var addzhengpin = false;
    //自动勾选货到付款（默认关闭）
    var addhuodaofukuan = false;
    //自动勾选赠送运费险（默认关闭）
    var addyunfeixian = false;

    //自动设置价格区间（默认关闭），开启请照注释修改后面两个变量
    var addreserveprice = false;
    //请将等号后的数值修改为价格下限
    var lowestprice = 0;
    //请将等号后的数值修改为价格上限
    var highestprice = 0;
    //=======================
    //       主执行区
    //=======================
    //避免二次弹出对话框
    if (GM_getValue("lastLocaiton") !== window.location.href){
        console.warn('淘宝搜索页商品自动排序 by BackRunner : 正在检查用户设置');
        checkValue();  
    }
    console.warn('淘宝搜索页商品自动排序 by BackRunner : 正在执行');
    splitURL();
    modURL();
    //惰性
    console.warn('淘宝搜索页商品自动排序 by BackRunner : 正在执行惰性脚本');
    window.onload=function(){
        splitURL();
        modURL();          
    };
    //=======================

    //=======================
    //        功能区
    //======================= 
    function splitURL(){
        var url = location.search.toString();
        var part = url.split('&');
        for (var i=0;i<part.length;i++){
            judge(part[i]);
        }
    }
    function judge(string){
        if (string.indexOf('baoyou=1') != -1){
            baoyou = true;
        }
        if (string.indexOf('sale-desc') != -1){
            sale = true;
        }
        if (string.indexOf('renqi-desc') != -1){
            renqi = true;
        }
        if (string.indexOf('credit-desc') != -1){
            credit = true;
        }
        if (string.indexOf('price-asc') != -1){
            priceasc = true;
        }
        if (string.indexOf('filter_tianmao=tianmao') != -1){
            tmall = true;
        }
        if (string.indexOf('reserve_price') != -1){
            tmall = true;
        }
        if (string.indexOf('user_type=1') != -1){
            zhengpin = true;
        }
        if (string.indexOf('support_cod=1') != -1){
            huodaofukuan = true;
        }
        if (string.indexOf('auction_tag%5B%5D=385') != -1){
            yunfeixian = true;
        }
    }
    function modURL(){
        var search = location.search;
        //判断
        if (!baoyou){
            if (addbaoyou){
                search += '&baoyou=1';
            }
        }
        if (!sale){
            if (addsale){
                search += '&sort=sale-desc';
            }
        }
        if (!renqi){
            if (addrenqi){
                search += '&sort=renqi-desc';
            }
        }
        if (!credit){
            if (addcredit){
                search += '&sort=credit-desc';
            }
        }
        if (!priceasc){
            if (addpriceasc){
                search += '&sort=price-asc';
            }
        }
        if (!tmall){
            if (addtmall){
                search += '&filter_tianmao=tmall';
            }
        }
        if (!zhengpin){
            if (addzhengpin){
                search += '&user_type=1';
            }
        }
        if (!huodaofukuan){
            if (addhuodaofukuan){
                search += '&support_cod=1';
            }
        }
        if (!yunfeixian){
            if (addyunfeixian){
                search += '&auction_tag%5B%5D=385';
            }
        }
        if (!reserveprice){
            if (addreserveprice){
                if (highestprice >= lowestprice){
                    search += '&filter=reserve_price%5B'+ lowestprice + '%2C' + highestprice + '%5D';
                }
            }
        }

        //执行
        if (search !== location.search){
            location.search = search;
            GM_setValue ("lastLocation",window.location.href);
        }
    }
    //检查存储的变量
    function checkValue(){
        var version = GM_getValue("version");
        var isUpdated = false;
        if (version !== GM_info.script.version){
            if (version === undefined){
                version = "未知";
            }
            s_value = "脚本版本已经从 " + version + " 更改为 " + GM_info.script.version+"\n\n";
            isUpdated = true;
            GM_setValue("version",GM_info.script.version);            
        }
        valueProcess("addbaoyou",addbaoyou);
        valueProcess("addsale",addsale);
        valueProcess("addrenqi",addrenqi);
        valueProcess("addcredit",addcredit);
        valueProcess("addtmall",addtmall);
        valueProcess("addzhengpin",addzhengpin);
        valueProcess("addyunfeixian",addyunfeixian);
        if (isValueChanged){
            if (isUpdated){
                s_value += "\n点击确定则将使用默认设置\n点击取消后请您手动编辑脚本还原设置";
            } else {
                s_value += "\n点击确定使用当前设置覆盖储存的设置\n点击取消后请您手动编辑脚本还原设置";
            }
            if (window.confirm(s_value)){
                replaceStored();
            }
        } else {
            if (isUpdated){
                s_value += "\n您将继续使用默认设置\n";
                window.alert(s_value);
            }
        }
    }
    //储存变量处理
    function valueProcess(key,variable){
        var value = GM_getValue(key,variable);
        var isBool = false;
        var isNum = false;
        var type;
        var current;
        var stored;
        switch (key){
            case "addbaoyou":
                type = "自动勾选包邮";
                isBool = true;
                break;
            case "addsale":
                type = "自动勾选按销量排序";
                isBool = true;
                break;
            case "addrenqi":
                type = "自动勾选按人气排序";
                isBool = true;
                break;
            case "addcredit":
                type = "自动勾选按信用排序";
                isBool = true;
                break;
            case "addpriceasc":
                type = "自动勾选按价格从低到高排序";
                isBool = true;
                break;
            case "addtmall":
                type = "自动勾选天猫";
                isBool = true;
                break;
            case "addzhengpin":
                type = "自动勾选正品保障";
                isBool = true;
                break;
            case "addhuodaofukuan":
                type = "自动勾选货到付款";
                isBool = true;
                break;
            case "addyunfeixian":
                type = "自动勾选运费险";
                isBool = true;
                break;
            case "addreserveprice":
                type = "自动添加价格区间";
                isBool = true;
                break;
            case "lowestprice":
                type = "价格区间最低价";
                isNum = true;
                break;
            case "highestprice":
                type = "价格区间最高价";
                isNum = true;
                break;
        }
        if (isBool){
            if (variable){
                current = "开启";
            } else {
                current = "关闭";
            }
            if (value){
                stored = "开启";
            } else {
                stored = "关闭";
            }
            if (value === undefined){
                isValueChanged = true;
                s_value += type+" 未检测到，已自动储存设置为：" + current + "\n";
            } else {
                if (value !== variable){
                    isValueChanged = true;
                    s_value += type + " 设置改变，当前设置为："+current+"，原设置为："+stored+"\n";
                }
            }
        }
        if (isNum){
            if (value === undefined){
                isValueChanged = true;
                s_value += type+" 未检测到，已自动储存设置为：" + variable + "\n";
            } else {
                if (value !== variable){
                    isValueChanged = true;
                    s_value += type + " 设置改变，当前设置为："+variable+"，原设置为："+value+"\n";
                }
            }
        }
    }
    //覆盖储存
    function replaceStored(){
        GM_setValue("addbaoyou",addbaoyou);
        GM_setValue("addsale",addsale);
        GM_setValue("addrenqi",addrenqi);
        GM_setValue("addcredit",addcredit);
        GM_setValue("addtmall",addtmall);
        GM_setValue("addzhengpin",addzhengpin);
        GM_setValue("addyunfeixian",addyunfeixian);
        GM_setValue("addreserveprice",addreserveprice);
        GM_setValue("lowestprice",lowestprice);
        GM_setValue("highestprice",highestprice);
    }
    //=======================
})();