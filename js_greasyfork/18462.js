// ==UserScript==
// @name         IndieGala_GetKey&Gift
// @namespace    http://tampermonkey.net/
// @version      1.08
// @description  shows how to use babel compiler
// @icon         https://www.indiegala.com/favicon.ico
// @author       lenceliu
// @match        https://www.indiegala.com/profile*
// @match        https://www.indiegala.com/gift*
// @match        https://www.indiegala.com/game?game_id=*
// @downloadURL https://update.greasyfork.org/scripts/18462/IndieGala_GetKeyGift.user.js
// @updateURL https://update.greasyfork.org/scripts/18462/IndieGala_GetKeyGift.meta.js
// ==/UserScript==
$ = unsafeWindow.jQuery;
var ShowGetSteamLink = true;
var reg_replace=/,\s*|\|\s*/g;
unsafeWindow.getbundle = function (section) {
    var result = '';
    var gametitle = '';
    var gamekey = '';
    var gamegiftlink = '';
    var giftboughtdate = '';
    var giftarray = [];
    var steamurl = '';
    var bundletitle = '';
    var bundleid = '';
    var count = 0;
    
    //clearbox();
    if (location.href.indexOf('profile') > - 1)
    {
        var bundleroot = document.getElementById('collapseBundles');
        if (bundleroot.getAttribute('aria-expanded') == 'true')
        {
            //获得Bundle所有分类
            bundleslist = document.getElementById('accordion2').children;
            for (var i = 0; i < bundleslist.length; i++)
            {
                //获得Bundle分类名称
                var collapse = bundleslist[i].children[0].getElementsByTagName('a') [0].hash.substring(1);
                //获得当前分类
                bundletype = document.getElementById(collapse);
                //判断当前分类是否展开
                if (bundletype.getAttribute('aria-expanded') == 'true')
                {
                    //获得当前分类下的所有bundle
                    bundles = bundletype.getElementsByClassName('panel-heading');
                    for (var j = 0; j < bundles.length; j++)
                    {
                        //判断当前bundle是否展开
                        if (bundles[j].getElementsByTagName('a') [0].getAttribute('aria-expanded') == 'true')
                        {
                            if (collapse == 'collapseGiveaway')
                            {
                                bundletitle = 'Giveaways';
                            } 
                            else
                            {
                                bundletitle = bundles[j].getElementsByTagName('a') [0].innerText;
                            }
                            bundleid = bundles[j].getElementsByTagName('a') [0].hash.substring(1);
                            bundle = document.getElementById(bundleid);
                            if (section == 'key')
                            {
                                var allkeys = bundle.getElementsByClassName('game-key-string');
                                for (var m = 0; m < allkeys.length; m++)
                                {
                                    gametitle = allkeys[m].getElementsByClassName('game-steam-url') [0].innerText.replace(reg_replace,'_');
                                    steamurl = allkeys[m].getElementsByClassName('game-steam-url') [0].href;
                                    /*散key有三种状态
                        1. 未获得key也未生成礼物     class="info_key_text"
                        2. 已获得key                 class="input-block-level margin text_align_center keys" .value
                        3. 已生成礼物但未被claim     class="keyfield give-gift-link" .getElementsByTagName('a').href
                        4. 礼物已被claim             class="span-key steam-btn" .innerText
                        */
                                    var class_giftlink = 'keyfield give-gift-link';
                                    var class_giftlink1 = 'keyfield .give-gift-link';
                                    var class_key = 'input-block-level margin text_align_center keys';
                                    var keysection = allkeys[m].getElementsByClassName('span-key steam-btn') [0];
                                    var key = allkeys[m].getElementsByClassName(class_key) [0];
                                    var gift = allkeys[m].getElementsByClassName(class_giftlink) [0];
                                    var gift1 = allkeys[m].getElementsByClassName(class_giftlink1) [0];
                                    if (keysection.children.length === 0)
                                    {
                                        gamekey = keysection.innerText;
                                    } 
                                    else if (key !== undefined && key.value !== '')
                                    {
                                        gamekey = key.value;
                                    } 
                                    else if (gift !== undefined)
                                    {
                                        gamekey = gift.children[0].href;
                                    } 
                                    else if (gift1 !== undefined)
                                    {
                                        gamekey = gift1.children[0].href;
                                    } 
                                    else
                                    {
                                        gamekey = '激活码或礼物链接尚未生成';
                                    }
                                    //判断是否要导出游戏名称

                                    if (name_switcher.checked)
                                    {
                                        result = result + gametitle + ', ' + gamekey + '\n';
                                    } 
                                    else
                                    {
                                        result = result + gamekey + '\n';
                                    }
                                    count++;
                                }
                            } 
                            else if (section == 'gift')
                            {
                                var allgifts = bundle.getElementsByClassName('gift-links-box');
                                for (var m = 0; m < allgifts.length; m++)
                                {
                                    gametitle = allgifts[m].getElementsByClassName('title_gift_in') [0].getElementsByTagName('a') [0].innerText.replace(reg_replace,'_');
                                    gamegiftlink = allgifts[m].getElementsByClassName('title_gift_in') [0].getElementsByTagName('a') [0].href;
                                    tmp = allgifts[m].getElementsByClassName('info-gift') [0].innerText.substring(10);
                                    giftboughtdate = tmp.substring(0, tmp.length - 5);
                                    giftarray[m] = {
                                        _bundletitle:bundletitle.trim(),
                                        _gametitle: gametitle,
                                        _gamegiftlink: gamegiftlink,
                                        _giftboughtdate: getDate(giftboughtdate)
                                    };
                                    count++;
                                }
                                if (date_switcher.checked)
                                {
                                    giftarray.sort(sortByField);
                                }
                                if (name_switcher.checked)
                                {
                                    for (var n = 0; n < giftarray.length; n++)
                                    {
                                        result = result + giftarray[n]._bundletitle + ', ' + giftarray[n]._gamegiftlink + '\n';
                                    }
                                } 
                                else
                                {
                                    for (var n = 0; n < giftarray.length; n++)
                                    {
                                        result = result + giftarray[n]._gamegiftlink + '\n';
                                    }
                                }
                            }
                            // break;

                        }
                        else
                        {
                        }
                    }
                } 
                else
                {
                }
            }
        }
    } 
    else if (location.href.indexOf('gift') > - 1)
    {
        bundletitle = document.getElementById('indie_gala_2').children[0].children[0].innerText.substring(2);
        bundle = document.getElementById('steam-key');
        var allkeys = bundle.getElementsByClassName('game-key-string');
        for (var m = 0; m < allkeys.length; m++)
        {
            gametitle = allkeys[m].getElementsByClassName('game-steam-url') [0].innerText.replace(reg_replace,'_');
            steamurl = allkeys[m].getElementsByClassName('game-steam-url') [0].href;
            /*散key有三种状态
                        1. 未获得key也未生成礼物     class="info_key_text"
                        2. 已获得key                 class="input-block-level margin text_align_center keys" .value
                        3. 已生成礼物但未被claim     class="keyfield give-gift-link" .getElementsByTagName('a').href
                        4. 礼物已被claim             class="span-key steam-btn" .innerText
                        */
            var class_giftlink = 'keyfield give-gift-link';
            var class_giftlink1 = 'keyfield .give-gift-link';
            var class_key = 'input-block-level margin text_align_center keys';
            var keysection = allkeys[m].getElementsByClassName('span-key steam-btn') [0];
            var key = allkeys[m].getElementsByClassName(class_key) [0];
            var gift = allkeys[m].getElementsByClassName(class_giftlink) [0];
            var gift1 = allkeys[m].getElementsByClassName(class_giftlink1) [0];
            if (keysection.children.length === 0)
            {
                gamekey = keysection.innerText;
            } 
            else if (key !== undefined && key.value !== '')
            {
                gamekey = key.value;
            } 
            else if (gift !== undefined)
            {
                gamekey = gift.children[0].href;
            } 
            else if (gift1 !== undefined)
            {
                gamekey = gift1.children[0].href;
            } 
            else
            {
                gamekey = '激活码或礼物链接尚未生成';
            }
            //判断是否要导出游戏名称

            if (name_switcher.checked)
            {
                result = result + gametitle + ', ' + gamekey + '\n';
                //  result = result + bundletitle + ', ' + gamekey + '\n';
            } 
            else
            {
                result = result + gamekey + '\n';
            }
            count++;
        }
    }
    if (bundletitle === '')
        shownote();
    giftmessage.value = result;
    bundletitlebox.innerHTML = '<P><Strong>' + 'Indiegala - ' + bundletitle + '</Strong> </P>';
    statusbox.innerHTML = '<P><Strong>' + '提取数量: ' + count + '</Strong> </P>';
};
unsafeWindow.getDate = function (strDate) {
    var st = strDate;
    var a = st.split(' ');
    var b = a[0].split('/');
    var c = a[1].split(':');
    var date = new Date(b[2], b[0], b[1], c[0], c[1], c[2]);
    return date;
};
unsafeWindow.sortByField = function (x, y) {
    return x._giftboughtdate - y._giftboughtdate;
};
unsafeWindow.clearbox = function clearbox()
{
    giftmessage.value = '';
    bundletitle = '';
    bundletitlebox.innerHTML = '<P><Strong>' + 'Indiegala - ' + bundletitle + '</Strong> </P>';
    statusbox.innerHTML = '<P><Strong>' + '提取数量: ' + '0' + '</Strong> </P>';
    $('#giftmessage').show();
};
unsafeWindow.getlink = function () {
    var result = '';
    // var allElements = [];
    var bundletitle = '';
    var bundleid = '';
    var gametitle = '';
    var gamelink = '';
    var count = 0;
    var bundleroot = document.getElementById('collapseBundles');

    if (location.href.indexOf('gift_id') > - 1)
    {
        bundletitle = document.getElementById('indie_gala_2').children[0].children[0].innerText.substring(2);
        bundle = document.getElementById('steam-key');
        var allkeys = bundle.getElementsByClassName('game-key-string');
        for (var n = 0; n < allkeys.length; n++)
        {
            gametitle = allkeys[n].getElementsByClassName('span-title') [0].getElementsByTagName('a') [0].innerText.replace(reg_replace,'_');
            gamelink = allkeys[n].getElementsByClassName('span-title') [0].getElementsByTagName('a') [0].href;
            result = result + '<P>' + (n + 1) + ', ' + '<a target="_blank" class="game-steam-url" href="' + gamelink + '">' + gametitle + '</a>' + ', ' + gamelink + '</P>';
            count++;
        }
    }

    else if (bundleroot.getAttribute('aria-expanded') == 'true')
    {
        bundleslist = document.getElementById('accordion2').children;
        for (var i = 0; i < bundleslist.length; i++)
        {
            //获得Bundle分类名称
            var collapse = bundleslist[i].children[0].getElementsByTagName('a') [0].hash.substring(1);
            //获得当前分类
            bundletype = document.getElementById(collapse);
            //判断当前分类是否展开
            if (bundletype.getAttribute('aria-expanded') == 'true')
            {
                //获得当前分类下的所有bundle
                bundles = bundletype.getElementsByClassName('panel-heading');
                for (var j = 0; j < bundles.length; j++)
                {
                    //判断当前bundle是否展开
                    if (bundles[j].getElementsByTagName('a') [0].getAttribute('aria-expanded') == 'true')
                    {
                        bundleid = bundles[j].getElementsByTagName('a') [0].hash.substring(1);
                        bundle = document.getElementById(bundleid);
                        var allkeys = bundle.getElementsByClassName('game-key-string');
                        for (var n = 0; n < allkeys.length; n++)
                        {
                            if (collapse == 'collapseGiveaway')
                            {
                                bundletitle = 'Giveaways';
                                index = j;
                            }
                            else
                            {
                                bundletitle = bundles[j].getElementsByTagName('a') [0].innerText;
                                index = n;
                            }
                            gametitle = allkeys[n].getElementsByClassName('span-title') [0].getElementsByTagName('a') [0].innerText.replace(reg_replace,'_');
                            gamelink = allkeys[n].getElementsByClassName('span-title') [0].getElementsByTagName('a') [0].href;
                            result = result + '<P>' + (index + 1) + ', ' + '<a target="_blank" class="game-steam-url" href="' + gamelink + '">' + gametitle + '</a>' + ', ' + gamelink + '</P>';
                            count++;
                        }
                    }
                }
            }
            else
            {
            }
        }
    }
    if (bundletitle === '')
        shownote();
    bundletitlebox.innerHTML = '<P><Strong>' + 'Indiegala - ' + bundletitle + '</Strong> </P>';
    statusbox.innerHTML = result;
    $('#statusbox').append('<P><Strong>' + '提取数量: ' + count + '</Strong> </P>');
};

var flg0=1;
var interval=0;
var waiting;
unsafeWindow.autoConfirm = function () {
    btn=document.getElementById('autoConfirm');
    btn.innerText="CDKEY获取中...";
    waiting = setInterval(function () { gekey(); }, 100);
};

var num = 0;
unsafeWindow.gekey = function() {

    //  var result = '';
    //  var allElements = [];
    //  var bundletitle = '';
    //  var bundleid = '';
    //   var gametitle = '';
    //   var gamelink = '';
    //   var count = 0;
    var bundleroot = document.getElementById('collapseBundles');

    if (location.href.indexOf('gift_id') > - 1)
    {
        if(flg0)
        {
            flg0=0;
            items=document.getElementsByClassName('span-key steam-btn');
            item = items[num].children;
            try
            {
                button=item[5];
                button.click();
            }
            catch(e)
            {
                flg0=1;
                //alert(e);
            }
            num += 1;
            if (num >= items.length) {
                clearInterval(waiting) ;
                num=0;
                btn=document.getElementById('autoConfirm');
                btn.innerText="自动获取CDKEY";}
        }
    }
    else if (bundleroot.getAttribute('aria-expanded') == 'true')
    {
        var bundle_expanded=false;
        bundleslist = document.getElementById('accordion2').children;
        for (var i = 0; i < bundleslist.length; i++)
        {
            //获得Bundle分类名称
            var collapse = bundleslist[i].children[0].getElementsByTagName('a') [0].hash.substring(1);
            //获得当前分类
            bundletype = document.getElementById(collapse);
            //判断当前分类是否展开
            if (bundletype.getAttribute('aria-expanded') == 'true')
            {
                //获得当前分类下的所有bundle
                bundles = bundletype.getElementsByClassName('panel-heading');
                for (var j = 0; j < bundles.length; j++)
                {
                    //判断当前bundle是否展开
                    if (bundles[j].getElementsByTagName('a') [0].getAttribute('aria-expanded') == 'true')
                    {
                        bundle_expanded=true;
                        bundleid = bundles[j].getElementsByTagName('a') [0].hash.substring(1);
                        bundle = document.getElementById(bundleid);

                        if(flg0)
                        {
                            flg0=0;
                            items = bundle.getElementsByClassName('span-key steam-btn');
                            item = items[num].children;
                            try
                            {
                                button=item[5];
                                button.click();
                            }
                            catch(e)
                            {
                                flg0=1;
                                //alert(e);
                            }
                            num += 1;
                            if (num >= items.length)
                            {
                                clearInterval(waiting);
                                num=0;
                                btn=document.getElementById('autoConfirm');
                                btn.innerText="自动获取CDKEY";
                            }
                        }
                    }
                }
            }
            else
            {
            }
        }
        
        if (!bundle_expanded)
        {
            clearInterval(waiting) ;
            num=0;
            btn=document.getElementById('autoConfirm');
            btn.innerText="自动获取CDKEY";
            shownote();
        }
    }

};

unsafeWindow.fn_fetchserial = function (code, steam_url, target) {


    //function fn_fetchserial(code, steam_url, target){

    if (globalAjaxSemaphore == true) { return; }
    //if (!confirm("Are you sure you want to discover the serial? You won't be able to create a permalink of it or trade it!")) { return; }

    var gameId = get_game_id_from_steam_url(steam_url);

    $.ajax({
        type: "GET",
        url: '/myserials/syncget',
        dataType: "json",
        data: {
            code: 			code,
            cache: 			false,
            productId: 		gameId,
        },
        beforeSend: function (jqXHR, settings){;
                                               $("#permbutton_"+code).hide();
                                               $("#fetchlink_"+code).hide();
                                               $("#info_key_"+code).hide();
                                               $("#fetching_"+code).fadeIn();
                                               start_steam_req(code);
                                              },
        success: function(data,textStatus){
            end_steam_req(code);
            // alert(data.serial_number);
            $(target).parent().prev().find('.btn-convert-to-trade').remove();
            $("#serial_n_"+code).val(data.serial_number);
            $("#fetching_"+code).hide();
            $("#info_key_"+code).hide();
            $("#serial_"+code).fadeIn();
            //alert('success');
            flg0=1;
        }, 
        error: function (xhr, ajaxOptions, thrownError){
            alert(data);
            end_steam_req(code);
            num -= 1;
            flg0=1;
        }, 
    });

    //}
};

unsafeWindow.shownote = function () {
    if (!$('#note').is(':visible')) {
        $('#note').css({
            display: 'block',
            top: '-100px'
        }).animate({
            top: '+200'
        }, 500, function () {
            setTimeout(out, 3000);
        });
    }
};

unsafeWindow.out = function () {
    $('#note').animate({
        top: '0'
    }, 500, function () {
        $(this).css({
            display: 'none',
            top: '-100px'
        });
    });
};
$('#header-title').after('<div id="mainbox" class="account-settings" style="margin-top: 10px; mini-height:220px;margin-bottom: 0px;text-align:left;"></div>');
$('#mainbox').append('<div id="buttonbox" style="margin-top: 10px; margin-bottom: 10px;align:left;"></div>');
$('#mainbox').append('<div id="bundletitlebox" style="margin-top: 10px; margin-bottom: 0px;"></div>');
$('#mainbox').append('<div id="keybox" style="margin-top: 10px; margin-bottom: 0px;"></div>');
$('#mainbox').append('<div id="statusbox" style="margin-top: 10px; margin-bottom: 0px;"></div>');
$('#buttonbox').append('<button onclick="getbundle(\'key\')" class="order-button-profile">复制CDKEY</button> ');
if (location.href.indexOf('profile') > - 1)
{
    $('#buttonbox').append('<button onclick="getbundle(\'gift\')" class="order-button-profile">复制礼物链接</button>');
}
if (ShowGetSteamLink)
{
    $('#buttonbox').append('<button onclick="getlink()" class="order-button-profile">复制Steam链接</button>');
}
$('#buttonbox').append('<button id="autoConfirm" onclick="autoConfirm()" class="order-button-profile">自动提取CDKEY</button>');
$('#buttonbox').append('<button onclick="clearbox()" class="order-button-profile">重置</button>');
$('#buttonbox').append('</br><label style="margin-top: 10px;margin-right: 10px;"><input id="name_switcher" type="checkbox" name="checkbox" checked>包含游戏名称</label>');
if (location.href.indexOf('profile') > - 1)
{
    $('#buttonbox').append('<label style="margin-top: 10px;margin-right: 10px;"><input id="date_switcher" style="" type="checkbox" name="checkbox" unchecked>礼物链接按购买时间排序</label>');
}
$('#keybox').append('<textarea rows="15" cols="80" name="message" id="giftmessage" style="height:200px;width:100%;");></textarea>');
var internalStyleSheet = document.createElement('style');
internalStyleSheet.setAttribute('type', 'text/css');
internalStyleSheet.textContent = '\n' +
    '#note{position:absolute;width:200px;padding:20px;background:#2E2E2E;border:1px solid #ccc;left:45%;z-index:9999;display:none;} ' + '\n' +
    '\n';
document.getElementsByTagName('head') [0].appendChild(internalStyleSheet);
var note = document.createElement('div');
note.setAttribute('id', 'note');
note.setAttribute('style', 'color:#999999');
note.innerHTML = '请展开要提取的慈善包';
document.getElementsByTagName('body') [0].appendChild(note);
clearbox();
