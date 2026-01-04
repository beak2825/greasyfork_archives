// ==UserScript==
// @name         bitcash coin
// @namespace    https://space.bilibili.com/17846288
// @version      0.1
// @description  此脚本可自动填写bitcash的问卷，也可自动领取消息中的硬币（=自动赚钱白嫖dlsite）
// @author       inoki
// @license      MIT
// @include      https://bitcash.jp/*act=enquete/list*
// @include      https://rsch.jp*
// @include      https://bitcash.jp/*act=messagebox*
// @include      https://bitcash.jp/*act=messageDetail*
// @include      https://bitcash.jp/*act=giftDetail*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/439157/bitcash%20coin.user.js
// @updateURL https://update.greasyfork.org/scripts/439157/bitcash%20coin.meta.js
// ==/UserScript==

/*jshint esversion: 9*/

(()=>{
    'use strict';
    const $=window.$;

    const h=document.location.href;
    if(h.indexOf('act=enquete/list')>=0){//问卷列表
        $('div.enquete_head').after('<div id=autoFill></div>');
        $('div#autoFill').append('<button type=button id=startFill>一键填写</button>').css({'display':'block'});
        $('button#startFill').on('click',()=>{
            fillAll();
        });
    }
    if(h.indexOf('rsch.jp')>=0){//问卷页面
        autoFill(0);
    }
    if(h.indexOf('act=messagebox')>=0){//消息列表
        $('h1.page_title').after('<div id=autoCoin></div>');
        $('div#autoCoin').append('<button type=button id=startCoin>自动领币</button>').css({'display':'block'});
        const scBtn= $('button#startCoin');
        scBtn.on('click',function(){
            if(GM_getValue('autoCoin',0)){
                if($('table#messageList').find('a').length){
                    const msg=$('table#messageList').find('a').eq(0).attr('href');
                    window.location.replace(msg);
                }else{
                    GM_setValue('autoCoin',0);
                }
            }else{
                GM_setValue('autoCoin',1);
                this.click();
            }
        });
        if(GM_getValue('autoCoin',0)) scBtn.click();
    }
    if(h.indexOf('act=messageDetail')>=0){//消息内容
        setTimeout(()=>{
            $('input.button_gift').click();
        },1000);//防止操作过快点不到（太快也可能会有被暂时ban ip风险）
    }
    if(h.indexOf('act=giftDetail')>=0){//礼物内容
        if($('i.ri-mail-line').next().is('span#side_message_badge')) $('span#side_message_badge').click();
    }

    function fillAll(){
        $('ul#enqueteList').find('a#enqueteCmLink').each(function(){
            window.open(this.href,'_blank',);
        });
    }

    function autoFill(loop){
        var fill=setInterval(()=>{
            if($('input.sbmitbtn').length||loop>5){
                $('input.sbmitbtn').click();
                clearInterval(fill);
                closeWindow();
                return;
            }

            if($('div#imgDsp').length){//如有图片载入则等待1s后再看
                setTimeout(()=>{
                    autoFill(loop);
                },1000);
                clearInterval(fill);
                return;
            }
            $('a').each(function(){
                if(this.onclick&&this.onclick.toString().indexOf('=true')>0){
                    this.click();
                }
            });
            if($('div.answer,div.question').length){//一般题
                $('div.answer,div.question').each(function(){
                    if($(this).parent().find('a[onclick$=true]').length){//如有需要点击查看东西才能继续的题
                        $(this).parent().find('a[onclick$=true]').click();
                    }
                    const cho=$(this).find('input:radio,input:checkbox');
                    $(cho).eq(rand(cho.length-1)).prop('checked',true);//不选最后一项防冲突
                    const sel=$(this).find('select').children();
                    $(sel).eq(rand(sel.length-1)+1).attr('selected',true);//下拉选择题不选第一项
                    const tex=$(this).find('input:text');
                    $(tex).each(function(){
                        $(this).parent().text().indexOf('歳')>=0? $(this).val(rand(30)+20) : $(this).val(rand(5));
                    });
                    const com=$(this).find('textarea');
                    $(com).each(function(){
                        $(this).val('特にない');
                    });
                });
            }
            if($('div.qgroup').length){//表格题
                $('div.qgroup').each(function(){
                    const cho=$(this).find('input:radio,input:checkbox,select');
                    const name=[];
                    for(let i of cho){
                        if(i.name){
                            name.push($(i).attr('name').split('[')[0]);
                        }
                    }
                    const r=rand($(this).find(':checkbox[name^='+name[0]+'],:radio[name='+name[0]+'],select[name='+name[0]+']>option').length-1);//固定每题随机选的位置防止逻辑冲突
                    const nSet=new Set(name);
                    for(let n of nSet){
                        $(this).find(':checkbox[name^='+n+'],:radio[name='+n+']').eq(r).prop('checked',true);
                        $(this).find('select[name='+n+']>option').eq(r).prop('selected',true);
                    }
                    console.log(nSet,r);
                });
            }
            $('input:checkbox').each(function(){//不选需要写评论的
                if($(this).parent().nextAll().find('input:text').length) $(this).prop('checked',false);
            });
            if($('div.cusboxArea').length){//如有选商品题则选都没有
                $('div.cusboxArea').each(function(){
                    $(this).find('input#cusbox').prop('checked',true);
                });
            }
            if($('div.alerttitle').length){//如问卷警告显示超过5次则暂停
                let a=GM_getValue('alert',0);
                a++;
                if(a>5){
                    clearInterval(fill);
                    $('body').append('<button type=button id=retry style=position:fixed;left:0;top:0>重试</button>');
                    $('button#retry').on('click',()=>{
                        GM_setValue('alert',0);
                        autoFill(0);
                    });
                    return;
                }
                GM_setValue('alert',a);
            }
            $('input[name=next]').click();
            loop++;
        },1000);
    }

    function closeWindow(){
        //window.opener = null;
        window.close();
    }

    function rand(n){
        return parseInt(n*Math.random());
    }


})();