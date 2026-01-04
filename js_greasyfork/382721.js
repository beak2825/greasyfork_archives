// ==UserScript==
// @name         Kekeke Bot
// @namespace    Kekeke Bot
// @version      1.0.6
// @description  在kekeke建立bot
// @author       Pixmi
// @icon         http://www.google.com/s2/favicons?domain=https://kekeke.cc/
// @include      https://kekeke.cc/*
// @include      https://www.kekeke.cc/*
// @license      MIT
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382721/Kekeke%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/382721/Kekeke%20Bot.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

$(window).on('load',function () {
    'use strict';
    var config,
        order,
        local = [];

    const keyword = /(人形|裝備|妖精)[ ]?(([0-9])?[0-9][:|：][0-5][0-9])?/i;
    const add = /input\((.+)\,(.+)\)/i;
    const del = /delete\((.+)\)/i;
    const js = /json\((.+)\)/i;
            
    // 檢查Local Storage的kekeke_bot_config是否存在
    if (localStorage.getItem('kekeke_bot_config') === null) {
        // 對config做初次設定
        config = {
            Bot_Content: '',
            Respond_Mode: false,
            Target_Color: '',
            Auto_Time: 5,
            Auto_Time_Check: true,
            Power_User: []
        };
        localStorage.setItem('kekeke_bot_config', JSON.stringify(config));
    } else {
        config = JSON.parse(localStorage.getItem('kekeke_bot_config'));
    }

    var Time_List;    
    // 導入建造時間的JSON
    $.ajax({
        url: 'https://raw.githubusercontent.com/Pixmi/kekeke_bot_json/master/Kekeke_Bot_Build_List',
        type: 'get',
        error: function (xhr) { console.error(xhr); },
        success: function (response) {
            Time_List = JSON.parse(response);
            if (Time_List) {
                console.log(`外部JSON https://raw.githubusercontent.com/Pixmi/kekeke_bot_json/master/Kekeke_Bot_Build_List 讀取成功`);
            }
        }
    });
    // 檢查是否為作者
    function checkAuthor(name) {
        if (/^[\u5e7c][\u5973][\u524d][\u7dda]$/.test(name.text()) && name.css('color') === 'rgb(156, 48, 13)') 
            return true;
        return false;
    }
    
    // 檢查是否為指定的User Color
    function checkPowerUser(color) {
        config = JSON.parse(localStorage.getItem('kekeke_bot_config'));
        let user = config.Power_User.split(','),
            i = 0;
        user.forEach(function (item,index) {
            if (color == user[index]) {
                i = i + 1;
            }
        });
        if ( i !== 0) 
            return true;
        return false;
    }
    
    // 檢查目標色碼是否符合要求
    function TargetCheck(color) {
        config = JSON.parse(localStorage.getItem('kekeke_bot_config'));
        if (config.Target_Color == color) 
            return true;
        return false;
    }

    // 色碼轉換的function
    function rgb2hex(rgb) {
        if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        /* RGB轉換的參考資料
        * https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
        * */
    }
        
    // 回應function
    function BotRespond(target,content,tag) {
        config = JSON.parse(localStorage.getItem('kekeke_bot_config'));
        // 輸入框放入BOT內容
        $('textarea.SquareCssResource-messageInputField').val(content);
        // 自動@指定對象
        if (tag) {
            $(target).parent('.SquareCssResource-chatName').attr('id','Target_Name');
            document.getElementById("Target_Name").click();
            $(target).parent('.SquareCssResource-chatName').removeAttr('id');
        }
        // @完畢後focus狀態改成在body上
        $('body').focus();
        // 點擊發送按鈕送出訊息
        document.getElementById("submit_btn").click();
        // 清空輸入框
        $('textarea.SquareCssResource-messageInputField').val('');
        // 發文時間檢查設為false
        config.Auto_Time_Check = false;
        // 儲存config
        localStorage.setItem('kekeke_bot_config', JSON.stringify(config));
    }

    // 發言時間限制
    setInterval(function(){
        config = JSON.parse(localStorage.getItem('kekeke_bot_config'));
        config.Auto_Time_Check = true;
        localStorage.setItem('kekeke_bot_config', JSON.stringify(config));
    },config.Auto_Time*1000+1);

    setTimeout(function () {
        // 給部分物件加上ID
        $('td.SquareCssResource-submitInputButton').find('button').attr('id','submit_btn');
        // 增加bot設定的按鈕
        $('<td><div style="padding: 0 1px;"><img id="BotConfig" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAZwSURBVHhe7VrdTxxVFCcx8dk/QN+MPvsH+PVH+KaJxifZRWhNag1QWJCP7c6WCPhQgR0+lqQslUKBPqlJLbXVvtTWgJrYYhAUsTTWYlr8uN5z95zlMpy7c+cDbHV+yS/Ze+acM+d39s6dO7tTkyBBggQJEuw/nLqRZ5xUYSGfKtzPp13BsnzsAvhi2H8DPfXuY07K/XmPYAPBF2Iw/GDhvFF4wkkXTudT7h2g/DzlpEaewsOh4KTdV0FY8dCwuNU2Lu6084Rj49IHG/E6hodCKB0qKOXeom9ih4XN7roPHke3wJDx/ZDn4tFRVrjOi++MqXPKOt7H8MAIrUN1TDqW3hoRP7aOK07Izyo45U6iW2DIvJ9BjqXmMVa0zqXmojqfXC8uYXhghNYhp+pv4LSWKVYKWmutFPQrugVC6aXSI3Jxuws5Ntp28pq4kRnHQgt3IRbTBEJoHXE2oKWl9KiMOS5j1yE+JNdlI7ogF6a1QoQGFKbACaYLBAAnDpenDkwrdLMCFA5xsVDmwrRWCK2jp37waVgodp1cUdpqB55ENyvITq9B7PJCr7j/XU8oLl/ooxpWMa0VIumAFVQ6lyhILSgBxQOoATc/Dd8AiMU6AjUAEFkHBeJQv6ZX6dgDyFXvmkHHcGgPb2Cs1/R+U1szyIZDe3gDaUqPX14Xp1eELzuu3IuVjZ9s+LJ18ltqQuWS8eqwhjeQxpxYjpyIKOQEczTVjUN7mBJxYjlyIqKQE8vRVDcO7WFKxInlyImIQk4sR1PdOLSHKREnliMnIgo5sRxNdePQHqZEnFiOnIgo5MRyNNWNQ3uYEnFigZPf/yXc6UXR1zErThySj7QNYyKXOSuyo9dEx+e/s6KqUsZAbK71rMrl1I+K7LFp0T5wRTR+vM6KB5rqxqE9KDCXcl+QW8heGnPiJxa3RF/bTOXkXuZk4R3nb/NCGXZKX6d5ms0FzDZ9KJrOrVRtgKq5bvhFGqMsO5RF75xQp1f85PKfojdTLvZk/bD4snFM/bIDvNZYFIMN5V94VBNsZsLlLZFrPuObD5rAzQQ4xjFXO/wcyquOfGroNT3w+NFJ8W7fQmXsbQBMe7BDsdzzPjzfn3wTix6TlwMnWiNMe9t87YNfGBsANUPtNJbPAn/n00Mvo0wz5DZyCQI63jsvjk3f3JPY24D+zjllh28KCtwanRfbPywpwmewXW0q/8wFawInWqcjfWzzwZqgi9frpDFoAC3KnnKvo0wzpNMfKoFnelFibwPUgiftm/htba98LbZv3yhTfgYbTF8V31BkReuEBc82nyN99Rr1OnVb00frZf+0u40yzeASAMn+MDZAt6NMM/wSeBtAlwAsUFCcmrJQtCRNWZjO4GNzCYCPbT6bS8BrR5lm+CXwNqCAi+AgLFpygYICdYJtQB4Dn2zxOitaZzcugjb52gflnsBQp8mOMs3wS+BtANwGaQ8AK/dVvG39kimqb4qKzbXMWN8GaQ9QLV+2aarqbdBkR5lm+CXwNgB4amlL9LZX2QiB+AAbIfCFfQOXCwji/TZCJjvKNMMvAdcAoNoKz8itcNec6DlcVAue2grDtA+7FZb7BrUmyFyw4HXLpqhpb7EVNtlRphlBb4MmsqIiUK+lGqlO3RboNih3TIvgbLsRMpETEYW6oGqkOmmsb4Sktq9QphmwXSxvG8uJ/LbCJnaduSGcI6cqcWEJObq0L8KPFMdthXO17isoszpOpAvPykthSAZuUAIiJ5Zj/sjErrgodN6eYMVyZOJBw0C+buh5lGcP9cemeqSs/jjMkfzFvc1IpDycWI7kDzXDU23YP1j3gBJzYjmSPycqCCkPJ5Yj+WPZ8YESc2I5kj8nKggpDyeWI/lj2fGBEnNiOZI/JyoIKQ8nliP5Y9nxgRJzYjn+24sglh0fKDEnliPcuqBwigtLyBHmNohlxwdKzInlyG1mopATyzFpQNKAA25Af9e86O+e32PLtc3uEpDLzEaydbfs/vUHfg3y2oAH3gDOTjZdRBw2Tqhu0+1YdnygxLpQXSxn40REsXFCdZtux7LjAyXWhQJh+vd3n9tjy7XP7RIB0zqKLds6s0soTH+vDXjgDTBRFxAHvUJN3LcGVN4RuvQTK9hLTkQUcmK9bCl9Qw0I/FqdLx6ut8TcDiw7Pqj3BNNupzzBA/2eINQY9N3iBAkSJEiQ4H+Jmpp/AM85Bo7GnSbbAAAAAElFTkSuQmCC" style="cursor: pointer;" title="開啟Kekeke Bot設定選項"></div></td>').insertBefore($('.SquareCssResource-submitInputButton'));
        Observer();
    }, 1500);

    const observeConfig = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    };

    function Observer() {
        // 建立rootObserver監控
        let rootObserver = new MutationObserver(function (mutations) {
            // 設定要監控的元素
            let chatElement = document.body.querySelector('table#ChatTable');
            // 確認chatElement已經生成
            if (chatElement) {
                // 結束rootObserver監控
                rootObserver.disconnect();
                // const title = document.title.split(' | ')[0];
                const title = $('.gwt-HTML.SquareCssResource-squareHeaderAddress').text().replace("kekeke.cc/","");
                console.log(`Kekeke Bot 1.0.6 已在 ${title} 啟動。`);

                // 檢查Local Storage的order是否存在，在此處才開始檢查是因為需要連版面標題也帶入
                if (localStorage.getItem(`order_${title}`) === null) {
                    // 對order做初次設定
                    order = {
                        Call: [],
                        Respond: [],
                        JSON_local: []
                    };
                    localStorage.setItem(`order_${title}`, JSON.stringify(order));
                } else {
                    order = JSON.parse(localStorage.getItem(`order_${title}`));
                    let updata;
                    // 舊版本升級新版本時，預防Local Storage出錯的檢查與設定
                    if (order.JSON_local === undefined) {
                        order.JSON_local = [];
                        updata = true;
                    }
                    if (updata) {                        
                        localStorage.setItem(`order_${title}`, JSON.stringify(order));
                        console.log(`更新Local Storage: order_${title}`);
                    }
                }

                // 讀取來自greasyfork.org的函示庫檔案
                // 需要先透過json(url)加入讀取位址
                // 假設url為'https://greasyfork.org/scripts/383623-kekeke-bot-gf/code/Kekeke_Bot_GF.js?version=704933'
                // 則輸入json(383623-kekeke-bot-gf/code/Kekeke_Bot_GF.js)即可，後續版本更新不用再修改路徑
                order.JSON_local.forEach(function (item,index) {
                    $.ajax({
                        url: `https://raw.githubusercontent.com/Pixmi/kekeke_bot_json/master/${order.JSON_local[index]}`,
                        type: 'get',
                        error: function (xhr) { console.error(xhr); },
                        success: function (response) {
                            local[index] = JSON.parse(response);
                            if (local[index]) {
                                console.log(`外部JSON https://raw.githubusercontent.com/Pixmi/kekeke_bot_json/master/${order.JSON_local[index]} 讀取成功`);
                            }
                        }
                    });
                });
                
                // 建立chatObserver監控聊天頻道
                let chatObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        // 有新的發言近來
                        if (mutation.type == 'childList' && mutation.addedNodes.length >= 1 && mutation.addedNodes[0].nodeName === 'DIV') {
                            let name = $('.gwt-TextBox.SquareCssResource-nicknameField').val();
                            if (mutation.addedNodes[0].classList.contains('SquareCssResource-chatContent')) {
                                let config = JSON.parse(localStorage.getItem('kekeke_bot_config')),
                                    Post_Name = $(mutation.addedNodes[0]).find('.GlobalCssResource-colorNickname'),
                                    Post_Content = $(mutation.addedNodes[0]).find('.SquareCssResource-message'),
                                    Post_Color = rgb2hex(Post_Name.css('color')),
                                    _content = Post_Content.text().split(' @ ');
                                if (config.Respond_Mode && config.Auto_Time_Check && TargetCheck(Post_Color)) {
                                    BotRespond(Post_Name,config.Bot_Content,true);
                                }
                                if (config.Respond_Mode && config.Auto_Time_Check && _content[0].indexOf('#') === 0 && Post_Name.text().indexOf('隨便') < 0) {
                                    let content;
                                    switch (_content[0].split('#')[1]) {
                                        case 'reload':
                                            // 確認是否來自作者
                                            if (checkAuthor(Post_Name)) {
                                                location.reload();
                                            } else {
                                                content = '權限不足'
                                                BotRespond(Post_Name,content,true);
                                            }
                                            break;
                                            
                                        case 'help':
                                            content = 'http://i.imgur.com/D6zQAiE.jpg';
                                            BotRespond(Post_Name,content,true);
                                            break;
                                            
                                        default:
                                            // 人形、裝備、妖精的查詢
                                            if (keyword.test(_content[0])) {
                                                if (_content[0].indexOf('：') >= 0) {
                                                    _content[0] = _content[0].replace('：',':');
                                                }
                                                let match = keyword.exec(_content[0]),
                                                    type = match[1],
                                                    time = typeof match[3] === 'undefined' ? '0' + match[2] : match[2];
                                                if (typeof match[2] !== 'undefined') {
                                                    Time_List[type].forEach(function (item,index) {
                                                        if (time == item.time) {
                                                            content = `建造時間${item.time}的${type}為 ${item.build}`;
                                                        }                                            
                                                    });
                                                    if (!content) {
                                                        content = `找不到建造時間符合${time}的${type}`;
                                                    }
                                                } else {
                                                    content = `${type}建造可參考${Time_List['table'][type]}`;
                                                }
                                                BotRespond(Post_Name,content,true);
                                            } else {
                                                // 所有外部JSON對照一遍
                                                local.forEach(function (item,index) {
                                                    let call = Object.keys(local[index]),
                                                        i,e;
                                                    // 檢查關鍵字
                                                    call.forEach(function (item,index) {
                                                        // 關鍵字符合的話，寫入i
                                                        if (_content[0].indexOf(item) >= 1) {
                                                            i = item;
                                                        }
                                                    });
                                                    // 如果i有被寫入
                                                    if (i) {
                                                        e = Math.floor(Math.random()*local[index][i].length);
                                                        // console.log(local[index][i][e]);
                                                        content = local[index][i][e];
                                                    }
                                                });
                                                // 指令
                                                order.Call.forEach(function (item,index) {
                                                    // console.log('指令:' + config.Cmd_Call[index] + ' 回應:' + config.Cmd_Respond[index]);
                                                    if (_content[0].indexOf(order.Call[index]) >= 1) {
                                                        content = order.Respond[index];
                                                    }
                                                });
                                                if (content) {
                                                    BotRespond(Post_Name,content,false);
                                                }
                                            }
                                            break;
                                    }
                                }
                                // 判斷是否為作者本人
                                if (checkAuthor(Post_Name) || checkPowerUser(Post_Color)) {
                                    order = JSON.parse(localStorage.getItem(`order_${title}`));
                                    // 判斷是否為新增指令
                                    if (add.test(_content[0])) {
                                        // 拆解輸入的指令
                                        let match = add.exec(_content[0]);
                                        console.log('Add new call:' + match[1] + ', Respond:' + match[2]);
                                        // 檢查舊的指令有沒有重複項目，符合的話移除舊的
                                        for (let key in order.Call) {
                                            if (order.Call[key] == match[1]) {
                                                order.Call.splice(key, 1);
                                                order.Respond.splice(key, 1);
                                            }
                                        }
                                        // 將新增的指令儲存回localStorage
                                        order.Call.push(match[1]);
                                        order.Respond.push(match[2]);
                                        localStorage.setItem(`order_${title}`, JSON.stringify(order));
                                    }
                                    // 判斷是否為刪除指令
                                    if (del.test(_content[0])) {
                                        // 拆解輸入的指令
                                        let match = del.exec(_content[0]);
                                        console.log('Delete call:' + match[1]);
                                        // 遍歷一次指令，符合的話移除
                                        for (let key in order.Call) {
                                            if (order.Call[key] == match[1]) {
                                                order.Call.splice(key, 1);
                                                order.Respond.splice(key, 1);
                                            }
                                        }
                                        localStorage.setItem(`order_${title}`, JSON.stringify(order));
                                    }
                                    // 判斷是否為json指令，且是作者本人
                                    if (js.test(_content[0]) && checkAuthor(Post_Name)) {
                                        let match = js.exec(_content[0]);
                                        console.log(`Add JSON: https://greasyfork.org/scripts/${match[1]}`);
                                        // 將新增的指令儲存回localStorage
                                        order.JSON_local.push(match[1]);
                                        localStorage.setItem(`order_${title}`, JSON.stringify(order));
                                        location.reload();
                                    }
                                }
                            }
                        }
                    });
                });
                chatObserver.observe(chatElement, observeConfig);

                // 進階設定
                $('#BotConfig').click(function () {
                    $(this).toggleClass('init');
                    if ($(this).hasClass('init')) {
                        var config = JSON.parse(localStorage.getItem('kekeke_bot_config'));
                        $(this).parent().css('position', 'relative');
                        $('<div id="BotConfig_panel"></div>').css({'background-color':'#fff','border':'1px solid #bbb','color':'#000','width':'350px','padding':'5px','position':'absolute','top':'30px','z-index':'999'}).insertAfter('#BotConfig');
                        $('<table></table>').css({'width':'100%'}).appendTo('#BotConfig_panel');
                        $('<tr><td style="width:80px">Bot名稱</td><td colspan="2"><input type="text" id="cb_Bot_Name" style="width:100%"></td></tr>').appendTo('#BotConfig_panel > table');
                        $('<tr><td></td><td>(Kekeke暱稱與此項相同才啟用Bot)</td><td style="width:20px"></td></tr>').appendTo('#BotConfig_panel > table');
                        $('<tr><td>Bot對話內容</td><td colspan="2"><textarea id="cb_Bot_Content" rows="2" style="width:100%"></td></tr>').appendTo('#BotConfig_panel > table');
                        $('<tr><td>回應模式</td><td colspan="2"><input type="checkbox" id="cb_Respond_Mode" checked="checked"></td></tr>').appendTo('#BotConfig_panel > table');
                        $('<tr><td>回應目標色碼</td><td colspan="2"><input type="text" id="cb_Target_Color" style="width:100%"></td></tr>').appendTo('#BotConfig_panel > table');
                        $('<tr><td>間隔時間(秒)</td><td colspan="2"><input type="text" id="cb_Auto_Time" style="width:100%"></td></tr>').appendTo('#BotConfig_panel > table');
                        $('<tr><td colspan="3"><br></td></tr>').appendTo('#BotConfig_panel > table');
                        $('<tr><td>管理者色碼</td><td colspan="2"><textarea id="cb_Power_User"></td></tr>').appendTo('#BotConfig_panel > table');
                        $('#cb_Power_User').attr({'rows':'2','title':'使用,做分隔'}).css({'width':'100%','resize':'vertical','font-size':'14px'}).val(config.Power_User);
                        $('<tr><td colspan="3"><br></td></tr>').appendTo('#BotConfig_panel > table');
                        $('<tr><td colspan="2">外部JSON位置</td></tr>').appendTo('#BotConfig_panel > table');
                        order.JSON_local.forEach(function (item,index) {
                            let JSON_local = $('<td colspan="2"></td>').append($('<input>').attr({'type':'text'}).css('width','100%').addClass('JSON_local').val(order.JSON_local[index])),
                                JSON_remove = $('<td></td>').append($('<img>').addClass('tr_remove').css({'cursor':'pointer','width':'16px','height':'16px'}).attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJOSURBVHhe7ZxRTsJAFEWrrgkWIGtwPS4BZAnqDuUfGejFhLbOtDNt32vPSe4HGsv0nPBDTCsAAAAAAAAAAAAAAIAczm9vL+eqeqpfuiOc/fxePdcvfRHkn16335cdPUYIZz7tNoef3eYz3Ev9Yx/c5e+25+ucRZD8+/l32y83ERryNScRWuRr9iN0yteMR/hHvmY3QlS+ZjRCgvzbLvdoLkKyfM1YhGT5mqUIveVrRiL0lq9ZinC5gX3rIWObOcJg+WGWPsX1jbiKsBj5wlOExckXHiIsVr6wHGHx8oXFCKuRLzIjfJS84dXJFxYirFa+mDPC6uWLOSIg/4EpIyC/gykiID/CmBGQn8gYEZDfk5IRkD+QTHHXCMjPJDcC8guQFWHIkN9ksgjI72b0CMiPM1oE5KdTPALy+1MsAvKHkx0B+Xnkfwo2BwIMJF++RoTelJOvESGZ8vI1IkQZT75GhE7Gl68RocF08jUi3MmSH76Ovn4l3fK76IiQLT/8/fUaROhPCfn1pW7XGh5hv7oIJeULIiQyhnxBhAhjyhdE6GAK+YIID0wpXxChZg75YvUR5pQvVhvBgnyxugiW5Is6wrH1PaNzFMGifLH4CJbli8VG8CBfLC6CJ/liMRE8yhe5EerLzEt4aFF4tGP7If/ZzPLF4AjWnprVK4IR+aJ3BEvyRXIEY/JFcgSL8kU0glH5IhrBsnzRGcG4fNEZwYN80YjgRL5oRPAkX/xF8PmfB/cIHuWL8Oh3j/JFOLtb+QAAAAAAAAAAAAAAYISq+gWNBEUVaILTDwAAAABJRU5ErkJggg==').click(function () {$(this).parent('td').parent('tr').remove();}));
                            $('<tr></tr>').append(JSON_local).append(JSON_remove).appendTo('#BotConfig_panel > table');
                        });
                        $('<tr><td colspan="3"><br></td></tr>').appendTo('#BotConfig_panel > table');
                        $('<tr><td>回應指令</td><td>回應內容</td></tr>').appendTo('#BotConfig_panel > table');
                        order.Call.forEach(function (item,index) {
                            let td_call = $('<td></td>').append($('<input>').attr({'type':'text'}).css('width','100%').addClass('td_call').val(order.Call[index])),
                                td_respond = $('<td></td>').append($('<input>').attr({'type':'text'}).css('width','100%').addClass('td_respond').val(order.Respond[index])),
                                tr_remove = $('<td></td>').append($('<img>').addClass('tr_remove').css({'cursor':'pointer','width':'16px','height':'16px'}).attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJOSURBVHhe7ZxRTsJAFEWrrgkWIGtwPS4BZAnqDuUfGejFhLbOtDNt32vPSe4HGsv0nPBDTCsAAAAAAAAAAAAAAIAczm9vL+eqeqpfuiOc/fxePdcvfRHkn16335cdPUYIZz7tNoef3eYz3Ev9Yx/c5e+25+ucRZD8+/l32y83ERryNScRWuRr9iN0yteMR/hHvmY3QlS+ZjRCgvzbLvdoLkKyfM1YhGT5mqUIveVrRiL0lq9ZinC5gX3rIWObOcJg+WGWPsX1jbiKsBj5wlOExckXHiIsVr6wHGHx8oXFCKuRLzIjfJS84dXJFxYirFa+mDPC6uWLOSIg/4EpIyC/gykiID/CmBGQn8gYEZDfk5IRkD+QTHHXCMjPJDcC8guQFWHIkN9ksgjI72b0CMiPM1oE5KdTPALy+1MsAvKHkx0B+Xnkfwo2BwIMJF++RoTelJOvESGZ8vI1IkQZT75GhE7Gl68RocF08jUi3MmSH76Ovn4l3fK76IiQLT/8/fUaROhPCfn1pW7XGh5hv7oIJeULIiQyhnxBhAhjyhdE6GAK+YIID0wpXxChZg75YvUR5pQvVhvBgnyxugiW5Is6wrH1PaNzFMGifLH4CJbli8VG8CBfLC6CJ/liMRE8yhe5EerLzEt4aFF4tGP7If/ZzPLF4AjWnprVK4IR+aJ3BEvyRXIEY/JFcgSL8kU0glH5IhrBsnzRGcG4fNEZwYN80YjgRL5oRPAkX/xF8PmfB/cIHuWL8Oh3j/JFOLtb+QAAAAAAAAAAAAAAYISq+gWNBEUVaILTDwAAAABJRU5ErkJggg==').click(function () {$(this).parent('td').parent('tr').remove();}));
                            $('<tr></tr>').append(td_call).append(td_respond).append(tr_remove).appendTo('#BotConfig_panel > table');
                        });
                        $('<div></div>').css({'padding-top':'3px'}).appendTo('#BotConfig_panel');
                        $('<button></button>').attr({'id':'save_bot_config','type':'button','title':'儲存後將自動重新整理'}).addClass('button_setting').text('儲存設定').appendTo('#BotConfig_panel > div');
                        $('<button></button>').attr({'id':'add_cmd_rows','type':'button'}).addClass('button_setting').text('新增回應項目').appendTo('#BotConfig_panel > div');
                        $('.button_setting').css({'height':'20px','float':'right','margin':'0 2px','padding':'0','font-size':'10px','box-sizing':'border-box'});
                        // 開啟面板時設定狀態
                        $('#cb_Bot_Name').val(order.BOT_name);
                        $('#cb_Bot_Content').val(config.Bot_Content);
                        $('#cb_Target_Color').val(config.Target_Color);
                        $('#cb_Auto_Time').val(config.Auto_Time);
                        if (!config.Respond_Mode) $('#cb_Respond_Mode').attr('checked', false);
                        $('#cb_Respond_Mode').on('change', function () {
                            if (this.checked) { config.Respond_Mode = true; } else { config.Respond_Mode = false; }
                        });
                        $('#add_cmd_rows').click(function () {
                            let new_call = $('<td></td>').append($('<input>').attr({'type':'text'}).css('width','100%').addClass('td_call')),
                                new_respond = $('<td></td>').append($('<input>').attr({'type':'text'}).css('width','100%').addClass('td_respond')),
                                tr_remove = $('<td></td>').append($('<img>').addClass('tr_remove').css({'cursor':'pointer','width':'16px','height':'16px'}).attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJOSURBVHhe7ZxRTsJAFEWrrgkWIGtwPS4BZAnqDuUfGejFhLbOtDNt32vPSe4HGsv0nPBDTCsAAAAAAAAAAAAAAIAczm9vL+eqeqpfuiOc/fxePdcvfRHkn16335cdPUYIZz7tNoef3eYz3Ev9Yx/c5e+25+ucRZD8+/l32y83ERryNScRWuRr9iN0yteMR/hHvmY3QlS+ZjRCgvzbLvdoLkKyfM1YhGT5mqUIveVrRiL0lq9ZinC5gX3rIWObOcJg+WGWPsX1jbiKsBj5wlOExckXHiIsVr6wHGHx8oXFCKuRLzIjfJS84dXJFxYirFa+mDPC6uWLOSIg/4EpIyC/gykiID/CmBGQn8gYEZDfk5IRkD+QTHHXCMjPJDcC8guQFWHIkN9ksgjI72b0CMiPM1oE5KdTPALy+1MsAvKHkx0B+Xnkfwo2BwIMJF++RoTelJOvESGZ8vI1IkQZT75GhE7Gl68RocF08jUi3MmSH76Ovn4l3fK76IiQLT/8/fUaROhPCfn1pW7XGh5hv7oIJeULIiQyhnxBhAhjyhdE6GAK+YIID0wpXxChZg75YvUR5pQvVhvBgnyxugiW5Is6wrH1PaNzFMGifLH4CJbli8VG8CBfLC6CJ/liMRE8yhe5EerLzEt4aFF4tGP7If/ZzPLF4AjWnprVK4IR+aJ3BEvyRXIEY/JFcgSL8kU0glH5IhrBsnzRGcG4fNEZwYN80YjgRL5oRPAkX/xF8PmfB/cIHuWL8Oh3j/JFOLtb+QAAAAAAAAAAAAAAYISq+gWNBEUVaILTDwAAAABJRU5ErkJggg==').click(function () {$(this).parent('td').parent('tr').remove();}));
                            $('<tr></tr>').append(new_call).append(new_respond).append(tr_remove).appendTo('#BotConfig_panel > table');
                        });
                        $('#save_bot_config').click(function () {
                            order.BOT_name = $('#cb_Bot_Name').val();
                            config.Bot_Content = $('#cb_Bot_Content').val();
                            config.Target_Color = $('#cb_Target_Color').val();
                            config.Auto_Time = $('#cb_Auto_Time').val();
                            config.Power_User = $('#cb_Power_User').val();
                            let local_array = [];
                            $('.JSON_local').each(function () {
                                local_array.push($(this).val());
                            });
                            order.JSON_local = local_array;
                            let call_array = [];
                            $('.td_call').each(function () {
                                call_array.push($(this).val());
                            });
                            order.Call = call_array;
                            let respond_array = [];
                            $('.td_respond').each(function () {
                                respond_array.push($(this).val());
                            });
                            order.Respond = respond_array;
                            localStorage.setItem('kekeke_bot_config', JSON.stringify(config));
                            localStorage.setItem(`order_${title}`, JSON.stringify(order));
                            $('#BotConfig').removeClass('init');
                            $('#BotConfig_panel').remove();
                            location.reload();
                        });
                    } else {
                        $('#BotConfig_panel').remove();
                    }
                });
            }
        });
        rootObserver.observe(document, observeConfig);
    }

});