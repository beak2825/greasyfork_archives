// ==UserScript==
// @name         Kekeke Spammer
// @namespace    https://greasyfork.org
// @version      0.0.1
// @description  Kekeke專用的Spam Bot，指定對象發言時就發送對應的訊息給該對象
// @author       Pixmi
// @icon         http://www.google.com/s2/favicons?domain=https://kekeke.cc/
// @include      https://kekeke.cc/*
// @include      https://www.kekeke.cc/*
// @license      MIT
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/378588/Kekeke%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/378588/Kekeke%20Spammer.meta.js
// ==/UserScript==

'use strict';

$(window).on('load',function () {
if (localStorage.getItem('kekeke_spammer') === null) {
    var config = {
        Bot_Name: 'Spammer',
        Auto_Time: 5,
        Auto_Time_Check: true,
        Spam_Target: [''],
        Spam_Respond: [''],
    };
    localStorage.setItem('kekeke_spammer', JSON.stringify(config));
} else {
    var config = JSON.parse(localStorage.getItem('kekeke_spammer'));
}
setInterval(function(){
    var config = JSON.parse(localStorage.getItem('kekeke_spammer'));
    config.Auto_Time_Check = true;
    localStorage.setItem('kekeke_spammer', JSON.stringify(config));
},config.Auto_Time*1000);

setTimeout(function () {
    $('td.SquareCssResource-submitInputButton').find('button').attr('id','submit_btn');
    $('<td><div style="padding: 0 1px;"><img id="SpamConfig" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAUiSURBVHhe7VpbbxtFFM6PgP4uhPgNCMkxgvYBBAgCuLIhviS1m4hc7NRN7NSOqxbaVCClokAapELoWxqJmMZ5gAoeUJOCwm2Yb3bOZLI79k69Rl6jOdKnzJ7bnu/MZdfRjjlx4sSJEydOnDhx0l2mk4vPZhOV93OJ8jbHUW68wmIJ1MZrRK3ZFz96RpYfTSaTiy/w5IeBm8UfjyfHy89LGv0JyGfHy/8g4dXCHGvfKbKjB1PseK9gj/YFdnzQ4Ljq4WFZsxfZcad5YtPRueLF6rmA/Utmf46jdou1N5usNbUsmoDa+27C5EvVMzyJmPnN2mywEBsMmvzDqtnfgM1GTa2EvraD2PM8QSs/FyzEBgOfeXvyBG0lvCtp2QtvwH0EY9kHiglDDMgD2A6yAd9JWvaSS1QeI3j4e/6y2d8Ch3stbxtwLpKWvYhAjkBBvRAj8gTiIWnZy1M3YJDk23zVDYA8ELkBVltgoDMP8stm/z4QuQHtOyVfgT7EmDwQuQE9H4MDJ79i9o+AyA0ANuszvmI5RoA87hW5Afmk97eVnxfb4RBnwqDJd2pm/yjo8Pp4HZEbsLPRYKVzSyrRMNHMnzwZaunLAXstzV+Y0OROnfu0hB/ZJC17oUD8wPh1d419UauxaqrKimeH14xTDchUA/Z65vSjU70IcUha9kKBeJ3Uk44S6FU4UgPwg8KUfBTQKpxsE0nLXigQwE9L0w3ijK9W66p+QNKyFxWc9PY8VgKWFPaV6YZxAGrb+7LB1mjmZe2ApGUvFFjd2GeFcysq0agANaN2upa07IUC1w4Ya+z+zhZq26yY+pgVznr/ZIgjUBtqXKhvi5pRO9kkLXuhQCQZZbgGuAa4Bvw3DWju/83mq/fY9Osnv7gwnl/+RtjIr5S+qey9/NY6jF388JYAxkovMZP9VNj0GIxFDLfpvjronpKWvVCgKSmwwAmQjx+wkZ/JTtD9avd+UXqMSU8g26Vb3ysdxqTXfXWQXdKyl7DEU6+tCvvK14+UbmXrkdBhhklnymPyW7xyX/lirPsDZLvwdkvMPIAx6f3+BLJLWvZim9ivL2XWBei6m59fXzz/idJhrPsCZAMw8/rsA35/AtklLXsJS6xWwNZPRjuhWx5dv7rzhL+2Vlj+laoAxtCZ/AHMvD77gO6rg+ySlr2EJTadAabDjWx6LJpG/rheurErrmemNwQwhk6PoTw68aFuAZBEE0CCfAlPewjOaqSpGdBRDj2PvvSHegia0OsQ1AE7yIvD7Ie/WP5V/utNLnu1HbgONn8exOCxB2BMevLzg+ySlr2EJcbzvZS5GdD748LyVD8/UD5+wEZ+pNNje+kJZJe07CUssekQ9O9tICzP3OKW8vEDNvIjnR7bS08gu6RlL2GJTYcgwXQG6LE6pt5oCLv+8kMvRbCRrluebnoC2SUtewlLbDoE9b1Nfv73Aj+K6RtiO516/ZWvxUIvdd3yhOWn2iQte6FAU9JRgmvAIBtgOvnjruu/AfITmWb7z0Ay0w3iqGvs/eHp+vlEBh8WIXii8YC9eftnAboBXcddh9px3ddHUvSZXDq1rhJm3rnGPpi4rq7jrsuk5D9jEpUJScte8H3w5HjlNyRIzd49daNRQOriXW/2X1560vd3w/jMNIsOcmTOr4sl9dZnPxpvGAegtonVHTXzqJ3jOUmnP0ETcsml+H4h3gVZXnNk8iRYQrlE+T2e8Ft6OsQSvDavRl7roD6Xd+LEiRMn/1sZG/sXgdCc4/WLFH4AAAAASUVORK5CYII=" style="cursor: pointer;"></div></td>').insertBefore($('.SquareCssResource-submitInputButton'));
    Observer();
}, 1500);

var observeConfig = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
};

function Observer() {
    var rootObserver = new MutationObserver(function (mutations) {
        var chatElement = document.body.querySelector('table#ChatTable');
        if (chatElement) {
            rootObserver.disconnect();
            console.log('Kekeke Spammer 0.0.1 已在 ' + document.title + ' 啟動。');

            function BotNameCheck(name) {
                var config = JSON.parse(localStorage.getItem('kekeke_spammer'));
                if (config.Bot_Name == name) 
                    return true
                return false;
            }

            function rgb2hex(rgb) {
                if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
                rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
            }
            
            function BotRespond(target,content) {
                $('textarea.SquareCssResource-messageInputField').val(content);
                $(target).parent('.SquareCssResource-chatName').attr('id','Target_Name');
                document.getElementById("Target_Name").click();
                $(target).parent('.SquareCssResource-chatName').removeAttr('id');
                $('body').focus();
                document.getElementById("submit_btn").click();
                $('textarea.SquareCssResource-messageInputField').val('');
                config.Auto_Time_Check = false;
                localStorage.setItem('kekeke_spammer', JSON.stringify(config));
            }
            
            var chatObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type == 'childList' && mutation.addedNodes.length >= 1 && mutation.addedNodes[0].nodeName === 'DIV') {
                        var name = $('.gwt-TextBox.SquareCssResource-nicknameField').val();
                        if (mutation.addedNodes[0].classList.contains('SquareCssResource-chatContent') && BotNameCheck(name)) {
                            var config = JSON.parse(localStorage.getItem('kekeke_spammer')),
                                Post_Name = $(mutation.addedNodes[0]).find('.GlobalCssResource-colorNickname'),
                                Post_Content = $(mutation.addedNodes[0]).find('.SquareCssResource-message'),
                                Post_Color = rgb2hex(Post_Name.css('color'));
                            config.Spam_Target.forEach(function (item,index) {
                                if (Post_Color === item) {
                                    BotRespond(Post_Name,config.Spam_Respond[index]);
                                }
                            });
                        }
                    }
                });
            });
            chatObserver.observe(chatElement, observeConfig);

            // 進階設定
            $('#SpamConfig').click(function () {
                $(this).toggleClass('init');
                if ($(this).hasClass('init')) {
                    var config = JSON.parse(localStorage.getItem('kekeke_spammer'));
                    $(this).parent().css('position', 'relative');
                    $('<div id="SpamConfig_panel"></div>').css({'background-color':'#fff','border':'1px solid #bbb','color':'#000','width':'350px','padding':'5px','position':'absolute','top':'30px','z-index':'999'}).insertAfter('#SpamConfig');
                    $('<table></table>').css({'width':'100%'}).appendTo('#SpamConfig_panel');
                    $('<tr><td style="width:80px">Spam名稱</td><td colspan="2"><input type="text" id="cb_Bot_Name" style="width:100%"></td></tr>').appendTo('#SpamConfig_panel > table');
                    $('<tr><td></td><td>(Kekeke暱稱與此項相同才啟用Spammer)</td><td style="width:20px"></td></tr>').appendTo('#SpamConfig_panel > table');
                    $('<tr><td>間隔時間(秒)</td><td colspan="2"><input type="text" id="cb_Auto_Time" style="width:100%"></td></tr>').appendTo('#SpamConfig_panel > table');
                    $('<tr><td colspan="3"><br></td></tr>').appendTo('#SpamConfig_panel > table');
                    $('<tr><td>目標色碼</td><td>對應內容</td></tr>').appendTo('#SpamConfig_panel > table');
                    config.Spam_Target.forEach(function (item,index) {
                        var td_call = $('<td></td>').append($('<input>').attr({'type':'text'}).css('width','100%').addClass('td_call').val(config.Spam_Target[index])),
                            td_respond = $('<td></td>').append($('<input>').attr({'type':'text'}).css('width','100%').addClass('td_respond').val(config.Spam_Respond[index])),
                            tr_remove = $('<td></td>').append($('<img>').addClass('tr_remove').css({'cursor':'pointer','width':'16px','height':'16px'}).attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJOSURBVHhe7ZxRTsJAFEWrrgkWIGtwPS4BZAnqDuUfGejFhLbOtDNt32vPSe4HGsv0nPBDTCsAAAAAAAAAAAAAAIAczm9vL+eqeqpfuiOc/fxePdcvfRHkn16335cdPUYIZz7tNoef3eYz3Ev9Yx/c5e+25+ucRZD8+/l32y83ERryNScRWuRr9iN0yteMR/hHvmY3QlS+ZjRCgvzbLvdoLkKyfM1YhGT5mqUIveVrRiL0lq9ZinC5gX3rIWObOcJg+WGWPsX1jbiKsBj5wlOExckXHiIsVr6wHGHx8oXFCKuRLzIjfJS84dXJFxYirFa+mDPC6uWLOSIg/4EpIyC/gykiID/CmBGQn8gYEZDfk5IRkD+QTHHXCMjPJDcC8guQFWHIkN9ksgjI72b0CMiPM1oE5KdTPALy+1MsAvKHkx0B+Xnkfwo2BwIMJF++RoTelJOvESGZ8vI1IkQZT75GhE7Gl68RocF08jUi3MmSH76Ovn4l3fK76IiQLT/8/fUaROhPCfn1pW7XGh5hv7oIJeULIiQyhnxBhAhjyhdE6GAK+YIID0wpXxChZg75YvUR5pQvVhvBgnyxugiW5Is6wrH1PaNzFMGifLH4CJbli8VG8CBfLC6CJ/liMRE8yhe5EerLzEt4aFF4tGP7If/ZzPLF4AjWnprVK4IR+aJ3BEvyRXIEY/JFcgSL8kU0glH5IhrBsnzRGcG4fNEZwYN80YjgRL5oRPAkX/xF8PmfB/cIHuWL8Oh3j/JFOLtb+QAAAAAAAAAAAAAAYISq+gWNBEUVaILTDwAAAABJRU5ErkJggg==').click(function () {$(this).parent('td').parent('tr').remove();}));
                        $('<tr></tr>').append(td_call).append(td_respond).append(tr_remove).appendTo('#SpamConfig_panel > table');
                    });
                    $('<div></div>').css({'padding-top':'3px'}).appendTo('#SpamConfig_panel');
                    $('<button></button>').attr({'id':'save_bot_config','type':'button','title':'儲存後將自動重新整理'}).addClass('button_setting').text('儲存設定').appendTo('#SpamConfig_panel > div');
                    $('<button></button>').attr({'id':'add_spam_rows','type':'button'}).addClass('button_setting').text('新增目標').appendTo('#SpamConfig_panel > div');
                    $('.button_setting').css({'height':'20px','float':'right','margin':'0 2px','padding':'0','font-size':'10px','box-sizing':'border-box'});
                    // 開啟面板時設定狀態
                    $('#cb_Bot_Name').val(config.Bot_Name);
                    $('#cb_Auto_Time').val(config.Auto_Time);
                    $('#add_spam_rows').click(function () {
                        var new_call = $('<td></td>').append($('<input>').attr({'type':'text'}).css('width','100%').addClass('td_call')),
                            new_respond = $('<td></td>').append($('<input>').attr({'type':'text'}).css('width','100%').addClass('td_respond')),
                            tr_remove = $('<td></td>').append($('<img>').addClass('tr_remove').css({'cursor':'pointer','width':'16px','height':'16px'}).attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJOSURBVHhe7ZxRTsJAFEWrrgkWIGtwPS4BZAnqDuUfGejFhLbOtDNt32vPSe4HGsv0nPBDTCsAAAAAAAAAAAAAAIAczm9vL+eqeqpfuiOc/fxePdcvfRHkn16335cdPUYIZz7tNoef3eYz3Ev9Yx/c5e+25+ucRZD8+/l32y83ERryNScRWuRr9iN0yteMR/hHvmY3QlS+ZjRCgvzbLvdoLkKyfM1YhGT5mqUIveVrRiL0lq9ZinC5gX3rIWObOcJg+WGWPsX1jbiKsBj5wlOExckXHiIsVr6wHGHx8oXFCKuRLzIjfJS84dXJFxYirFa+mDPC6uWLOSIg/4EpIyC/gykiID/CmBGQn8gYEZDfk5IRkD+QTHHXCMjPJDcC8guQFWHIkN9ksgjI72b0CMiPM1oE5KdTPALy+1MsAvKHkx0B+Xnkfwo2BwIMJF++RoTelJOvESGZ8vI1IkQZT75GhE7Gl68RocF08jUi3MmSH76Ovn4l3fK76IiQLT/8/fUaROhPCfn1pW7XGh5hv7oIJeULIiQyhnxBhAhjyhdE6GAK+YIID0wpXxChZg75YvUR5pQvVhvBgnyxugiW5Is6wrH1PaNzFMGifLH4CJbli8VG8CBfLC6CJ/liMRE8yhe5EerLzEt4aFF4tGP7If/ZzPLF4AjWnprVK4IR+aJ3BEvyRXIEY/JFcgSL8kU0glH5IhrBsnzRGcG4fNEZwYN80YjgRL5oRPAkX/xF8PmfB/cIHuWL8Oh3j/JFOLtb+QAAAAAAAAAAAAAAYISq+gWNBEUVaILTDwAAAABJRU5ErkJggg==').click(function () {$(this).parent('td').parent('tr').remove();}));
                        $('<tr></tr>').append(new_call).append(new_respond).append(tr_remove).appendTo('#SpamConfig_panel > table');
                    });
                    $('#save_bot_config').click(function () {
                        config.Bot_Name = $('#cb_Bot_Name').val();
                        config.Auto_Time = $('#cb_Auto_Time').val();
                        var call_array = [];
                        $('.td_call').each(function () {
                            call_array.push($(this).val());
                        });
                        config.Spam_Target = call_array;
                        var respond_array = [];
                        $('.td_respond').each(function () {
                            respond_array.push($(this).val());
                        });
                        config.Spam_Respond = respond_array;
                        localStorage.setItem('kekeke_spammer', JSON.stringify(config));
                        $('#SpamConfig').removeClass('init');
                        $('#SpamConfig_panel').remove();
                        location.reload();
                    });
                } else {
                    $('#SpamConfig_panel').remove();
                }
            });
        }
    });
    rootObserver.observe(document, observeConfig);
}

});