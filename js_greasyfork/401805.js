// ==UserScript==
// @name         keylol有卡/中文/包类游戏标记(带自定义面板)
// @namespace    http://tampermonkey.net/
// @icon      	 https://keylol.com/favicon.ico
// @version      0.22
// @description  keylol论坛标记有卡/中文游戏 自定义面板 嗨皮喜加一 包类标记 帖子游戏链接转化游戏名
// @author       wsz987
// @match        https://keylol.com/*
// @resource     card https://bartervg.com/browse/cards/json/
// @resource     chinese https://raw.githubusercontent.com/desc70865/Steam-Chinese-Mark/master/full.json
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @supportURL   https://keylol.com/t587145-1-1
// @downloadURL https://update.greasyfork.org/scripts/401805/keylol%E6%9C%89%E5%8D%A1%E4%B8%AD%E6%96%87%E5%8C%85%E7%B1%BB%E6%B8%B8%E6%88%8F%E6%A0%87%E8%AE%B0%28%E5%B8%A6%E8%87%AA%E5%AE%9A%E4%B9%89%E9%9D%A2%E6%9D%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401805/keylol%E6%9C%89%E5%8D%A1%E4%B8%AD%E6%96%87%E5%8C%85%E7%B1%BB%E6%B8%B8%E6%88%8F%E6%A0%87%E8%AE%B0%28%E5%B8%A6%E8%87%AA%E5%AE%9A%E4%B9%89%E9%9D%A2%E6%9D%BF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.split('/')[3]!=''&& document.querySelectorAll('.steam-info-link').length>0){
        if($('.steam-info-link')){
            var tool ="<div id='tool_contents' style='cursor:pointer;z-index:998;position:fixed;left:10px;top:400px;font-size:100%; ><form onsubmit='return false' id='tool_form'><div class='tool_input_div'><input class='tool_checkbox' type='checkbox'><label class='tool_input_btn' checked><b>中文标记</b></label></div><div class='tool_input_div'><input class='tool_checkbox' type='checkbox'><label class='tool_input_btn' checked><b>有卡标记</b></label></div><div class='tool_input_div'><span class='pagebtn' style='padding: 0 10px'>&lfloor;</span><input type='color' class='tool_checkbox_color'/></div> <div class='tool_input_div'><input class='tool_checkbox' type='checkbox' ><label class='tool_input_btn'><b>包类标记</b></label></div><div class='tool_input_div'><span class='pagebtn' style='padding: 0 10px' >&lfloor;</span><input type='color' class='tool_checkbox_color'/></div><div class='tool_input_div'><input class='tool_checkbox' type='checkbox'><label class='tool_input_btn'><b>链接→名</b></label></div></form></div>"
            $("body").append(tool);
            document.querySelector("#tool_contents").style.top=window.innerHeight-'134'+'px';
            var tool_saved = GM_getValue("tool_saved"),
                update=GM_getValue("tool_saved")
            if (tool_saved == null) {  //初始化自定义
                GM_setValue("tool_saved",[false,true,'#ff1493',true,'#ff8c00',true]);
                console.log('reset')
            }
            $('.tool_checkbox_color')[0].value=tool_saved[2]  //加载自定义有卡颜色
            $('.tool_checkbox_color')[1].value=tool_saved[4]  //加载自定义包类颜色
            console.log(GM_getValue('tool_saved'));//打印初始值

            if(GM_getValue('tool_saved')[5]){   //初始化链接→游戏名
                $('.tool_checkbox')[3].checked=true
                tran_name()
            }
            if(GM_getValue('tool_saved')[1]){  //初始化有卡标记
                $('.tool_checkbox')[1].checked=true
                search_card().then(add_Btn());
                jQuery('body').on("click", "#threadindex > div > ul > li",()=>{   //目录类帖子配对
                    $('.t_f').ready(()=>setTimeout(()=>{search_card().then(unauto(),add_Btn())},1000))
                });
            }
            if(GM_getValue('tool_saved')[0]){   //初始化中文标记
                $('.tool_checkbox')[0].checked=true
                tab_cn()
            }
            if(GM_getValue('tool_saved')[3]){   //初始化包类标记
                $('.tool_checkbox')[2].checked=true
                tab_package()
            }

            $('.tool_checkbox')[0].onchange= function(){
                update[0]=$(this).context.checked
                GM_setValue("tool_saved",update)
                if( GM_getValue("tool_saved")[0]){
                    tab_cn()
                }
                console.log( $(this).context.checked,'tab_cn',GM_getValue("tool_saved"))
            }
            $('.tool_checkbox')[1].onchange= function(){
                update[1]=$(this).context.checked
                GM_setValue("tool_saved",update)
                if( GM_getValue("tool_saved")[1]){
                    search_card()
                }
                console.log( $(this).context.checked,'tab_card',GM_getValue("tool_saved"))
            }
            $('.tool_checkbox_color')[0].onchange= function(){
                update[2]=$(this).context.value
                GM_setValue("tool_saved",update)
                if($('.own_trading_cards')&&GM_getValue("tool_saved")[1]){
                    window.location.reload()
                }
            }
            $('.tool_checkbox')[2].onchange= function(){
                update[3]=$(this).context.checked
                GM_setValue("tool_saved",update)
                if( GM_getValue("tool_saved")[3]){
                    tab_package()
                }
                console.log( $(this).context.checked,'tab_package',GM_getValue("tool_saved"))
            }
            $('.tool_checkbox_color')[1].onchange= function(){
                update[4]=$(this).context.value
                GM_setValue("tool_saved",update)
                if(GM_getValue("tool_saved")[3]){
                    window.location.reload()
                }
            }
            $('.tool_checkbox')[3].onchange= function(){
                update[5]=$(this).context.checked
                GM_setValue("tool_saved",update)
                if( GM_getValue("tool_saved")[5]){
                    tran_name()
                }
                console.log( $(this).context.checked,'tran_name',GM_getValue("tool_saved"))
            }
        }
    }
})();

function tran_name(){
    $('.steam-info-link').each(function(){
        var arr_href=$(this).context.pathname.split('/');
        if($(this).context.innerText.indexOf('https://store.steampowered.com/')>-1&&arr_href[3]!==''){  //对游戏链接配对游戏名
            $(this).context.innerText=arr_href[3].replace(/_/g, ' ');
        }
    })
}

function tab_package(){
    $('.steam-info-link').each(function(){
        var arr_href=$(this).context.pathname.split('/');
        if(arr_href[1]=='bundle'||arr_href[1]=='sub'){
            $(this).context.text="["+arr_href[1].charAt(0).toUpperCase() + arr_href[1].slice(1)+"]:  "+$(this).context.innerText;
            $(this).context.style.color=GM_getValue('tool_saved')[4]
            console.log($(this).text());
        }
    })
}

async function search_card(){
    var json = GM_getValue("saved_json"),
        font_Color_Card = GM_getValue('tool_saved')[2],  //有卡字体颜色 red
        font_Color_BS="darkorange", //包类型字体颜色
        font_Weight = "bolder";  //字体加粗
    //颜色自定义可以参考这位老哥  https://keylol.com/t587368-1-1
    if (json == null) {  //初始化json_card
        json=await json_card();
        GM_setValue("saved_json",json);
    }
    return new Promise(resolve => {
        $('.steam-info-link').each(function(){
            var arr_href=$(this).context.pathname.split('/');
            if(json.hasOwnProperty(arr_href[2])==true){
                $(this).context.className+=' own_trading_cards';
                $(this).context.text="🃏 "+$(this).context.innerText;
                //$(this).context.text="[Card]: "+$(this).context.innerText;
                $(this).context.style.color=font_Color_Card;
                $(this).context.style.fontWeight = font_Weight;
            }
        })
    });
}

async function tab_cn(){
    var json_cn=GM_getValue("saved_json_cn");
    if (json_cn == null) {  //初始化json_cn
        json_cn=await json_scn();
        GM_setValue("saved_json_cn",json_cn);
    }
    GM_setValue("saved_json_cn",json_cn)
    $('.steam-info-link').each(function(){
        var arr_href=$(this).context.pathname.split('/');
        console.log(arr_href[2],json_cn[arr_href[2]]);
        if(json_cn[arr_href[2]] != undefined){
            $(this).context.text = "🀄️ " + $(this).context.innerText;
            $(this).context.style.fontWeight = 'bolder';
        }
    })
}

function json_card(){
    return new Promise(resolve => {
        resolve(JSON.parse(GM_getResourceText('card')))
    });
};

function json_scn(){
    return new Promise(resolve => {
        resolve(JSON.parse(GM_getResourceText('chinese')))
    });
};

function unauto(){
    $('.plc div.authi>a[rel=nofollow]').eq(0).after(`<span class="pipe">|</span><a href="javascript:void(0);" id="unauto_tab">标记有卡</a>`);
    $('#unauto_tab').click(()=>search_card(json))
}

function add_Btn(){
    if($('.own_trading_cards').length>0){
        $('.plc div.authi>a[rel=nofollow]').eq(0).after(`<span class="pipe">|</span><a href="javascript:void(0);" id="tab_Btn_a">打包有卡</a>`);
        $('#tab_Btn_a').click(()=>{
            var arr=[],str = $('textarea').val();
            $('.own_trading_cards').each(function(){
                if($(this).context.parentNode.style.backgroundColor!=="black"){
                    if($(this).parents('div.showhide').length==0){
                        arr.push("[url="+$(this).context.href+"]"+$(this).text().slice(7)+"[/url]");
                        console.log($(this).text());
                    }
                }
            });
            $('textarea').val(str+arr.join('\n'));
        })
    }
}