// ==UserScript==
// @name         快手输入计划名3.45
// @namespace    http://tampermonkey.net/
// @version      3.45
// @description  使用方法询问作者
// @author       小刘
// @match        https://niu.e.kuaishou.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js
// @require https://greasyfork.org/scripts/438011-%E5%BA%93/code/%E5%BA%93.js?version=1006016
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_getTabs
// @grant        window.onurlchange
// @license      小刘
// @downloadURL https://update.greasyfork.org/scripts/448432/%E5%BF%AB%E6%89%8B%E8%BE%93%E5%85%A5%E8%AE%A1%E5%88%92%E5%90%8D345.user.js
// @updateURL https://update.greasyfork.org/scripts/448432/%E5%BF%AB%E6%89%8B%E8%BE%93%E5%85%A5%E8%AE%A1%E5%88%92%E5%90%8D345.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements ,Input,ysjt ,cookieStore */

GM_registerMenuCommand('屏蔽用户', ()=>{Shield_users()})
GM_registerMenuCommand('屏蔽关键字', ()=>{Shield_rule()})
GM_registerMenuCommand('复制id', ()=>{copy()})


window.onkeydown = function (KeyboardEvent) {
    switch (judge()) {//页面
        case 1: case1(KeyboardEvent); break;
        case 2: case2(KeyboardEvent); break;
        case 3: case3(KeyboardEvent); break;
        case 4: case4(KeyboardEvent); break;//评论内容
        case 5: case5(KeyboardEvent); break;//评论内容
    }
}

function case1(KeyboardEvent) {//主页面
    switch (KeyboardEvent.keyCode) {
        case 107: Modify_price(); break;//修改出价
        case 192:
            if(KeyboardEvent.ctrlKey){
                copycampaign()//按id复制计划
            }else if(KeyboardEvent.shiftKey){
                getID();
            }
            ; break;
        case 39:
            if (KeyboardEvent.ctrlKey) {
                Move_creativity(200)
            } else Move_creativity(700)
            ; break;
        case 37:
            if (KeyboardEvent.ctrlKey) {
                Move_creativity(-200)
            } else Move_creativity(-700)
            ; break;
    }
}
function case2(KeyboardEvent) {//编辑组页面
    switch (KeyboardEvent.keyCode) {
        case 107: Modify_name(); break;//修改计划名
        case 192:copyproject();break;
        case 13:
            //if (KeyboardEvent.ctrlKey) {
            clickbtn()
            //};break;//下一步
    }
}
function case3(KeyboardEvent) {//编辑创意页面
    switch (KeyboardEvent.keyCode) {
        case 106://发布  13
            //if (KeyboardEvent.ctrlKey) {
            if ($('.ant-btn-primary:contains(保存并关闭)')[0] || $(".ant-btn.ant-btn-primary:contains('保 存')")[0]) {
                release();
            }
            //}
            ; break;
        case 39: Move_creativity(1); break;//方向右
        case 37: Move_creativity(-1); break;//方向左
        case 46://delet键
            if (KeyboardEvent.ctrlKey) {
                del()//删除视频或创意
            } else if (KeyboardEvent.altKey) {
                Delete_cover()//删除封面
            }
            ; break;
        case 49://翻到第一个创意
            if (KeyboardEvent.shiftKey) {
                $('.customTabHeader')[0].click()
            }; break;
        case 107://加号
            if (KeyboardEvent.shiftKey) {
                Enter_value()//输入推荐语
            } else if(KeyboardEvent.altKey){
                Enter_slogan()
            }else Enter_title();//输入视频标题
            ; break;
        case 109: Modify_creativeName(); break;//修改创意名称
        case 192:
            if (KeyboardEvent.ctrlKey) {//复制创意
                fzcy();
            } else zd1()//自动点击创意封面
            ; break;
    }
}
function case4(KeyboardEvent){//计算评论id
    switch (KeyboardEvent.keyCode) {
        case 192:
            if(KeyboardEvent.ctrlKey){
                Shield_id()
            }else pd();
            break;
        case 27:$('.div-1')[0].remove();break;
    }
    //if(KeyboardEvent.keyCode==192){


    //qwe();


    /*     function qwe(){
        let id=[]
        for(let i=0;i<$('.index-module__userId___pUNdi').length;i++){
            id[i]=$('.index-module__userId___pUNdi').eq(i).text().slice(3)
        }
        function counterArray(arr){
            var obj = {}
            arr.forEach(function(v,k){
                if(obj[v]){
                    obj[v]++;
                }else{
                    obj[v] = 1;
                }
            })
            return obj;
        }
        console.log(counterArray(id));
    } */
    // }
}
function case5(KeyboardEvent){//计算评论id
    if(KeyboardEvent.keyCode==192){
        copy_data()
    }
}
function judge() {//判断页面属于哪个界面
    const url = window.location.search,
          url1 = window.location.pathname;
    if (url1 == '/manage') {
        return 1;//主页
    }else if (window.location.pathname.includes('/tools/comment')){
        return 4;//评论区
    } else if ((url.includes('copy') && !url.includes('originUnitId')) || (!url.includes('unitId') && url.includes('add'))) {
        return 2;//编辑组
    } else if(url.includes('copy')){
        return 3//创意
    } else if(url1=='/home'){
        return 5;//主页数据
    }
}
/* var state=true//滚动的状态
function move(long) {
    if(state){
        state=false
        console.log(222222222)
        $('.ant-table-content').animate(
            {scrollLeft: $('.ant-table-content').scrollLeft() + long},
            ()=>{
                state=true
                console.log(111111)
            }
        )
    }else setTimeout(()=>{move(long)},100)
    // $('.ant-table-content').scrollLeft($('.ant-table-content').scrollLeft() + long)
} */
function Modify_price() {//修改出价
    if ($('.ant-modal-content')[0] && $('.ant-modal-title:contains(批量修改成本上限)')[0]) {
        const add = parseFloat(prompt('要增加的数值', 0.2))
        if (add != 0) {
            carry(add)
        }
        function carry(add) {
            const inputele = $('.ant-modal-content tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected').find('input.ant-input'),
                  val = parseFloat($('.ant-modal-content tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected').find('td:eq(3)').eq(0).text())
            for (let i = 0; i < inputele.length; i++) {
                let value = (val + (i + 1) * add).toFixed(2)
                setTimeout(()=>Input(inputele[i], value),i*30);
            }
        }
    }
}

function copyproject(){//复制计划
    const len=prompt('要复制几个',3)
    if(len>0){
        const url=location.href;
        for(let i=0;i<len;i++){
            window.open(url)
        }
    }
}
function getID(){
    if($('tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected')){
        const len=$('tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected').length
        let value=''
        for(let i=0;i<len;i++){
            value+=$(`tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected:eq(${i}) td.ant-table-cell.ant-table-cell-fix-left.ant-table-cell-fix-left-last`).text()+'\n'
        }
        console.log(value)
        GM_setClipboard(value)
    }
}
function copycampaign(){//复制计划
    if($('tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected')[0]){
        const len=$('tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected').length
        if(len>1){//复制多个组
            let campaignId=prompt('计划ID')
            if(campaignId){
                if((campaignId=='1')||(campaignId=='0')){
                    campaignId=$(`tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected:eq(${0})`).attr('data-row-key').split('_')[0]
                }
                let unitId=[]
                for(let i=0;i<len;i++){
                    unitId[i]=$(`tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected:eq(${i})`).attr('data-row-key').split('_')[1]
                    const url='https://niu.e.kuaishou.com/create?mode=copy&promotionType=2&campaignId='+campaignId+'&unitId='+unitId[i]+'&'+window.location.search.slice(1)
                    window.open(url)
                }
            }
        }else {//复制一个组
            let campaignId=prompt('计划ID')
            if(campaignId){
                if((campaignId=='1')||(campaignId=='0')){
                    campaignId=$(`tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected:eq(${0})`).attr('data-row-key').split('_')[0]
                }
                const len=prompt('要复制几个',4)
                if(len>0){
                    const unitId=$(`tr.ant-table-row.ant-table-row-level-0.ant-table-row-selected:eq(${0})`).attr('data-row-key').split('_')[1]
                    for(let i=0;i<len;i++){
                        const url='https://niu.e.kuaishou.com/create?mode=copy&promotionType=2&campaignId='+campaignId+'&unitId='+unitId+'&'+window.location.search.slice(1)
                        window.open(url)
                    }
                }
            }
        }
    }
}
function Modify_name() {//修改计划名
    const name = '拷贝-',
          name2 = $('input.ant-input.create-iptW');
    if (name2[0] && name2.val().match(name)) {
        const d = new Date(),
              date = (d.getMonth() >= 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + (d.getDate() >= 10 ? d.getDate() : '0' + d.getDate()) + '-',
              ele = document.querySelector('input.ant-input.create-iptW'),
              val = date + name2.val().match(/视频(.+)-/g) //.*
        Input(ele, val);
    }
    $('#esp-create-content').scrollTop($('#esp-create-content').prop('scrollHeight'))
    setTimeout(()=>{
        $('#ad_from_unit_name input').focus()
    },1)
}
function clickbtn(){
    $('button.ant-btn.ant-btn-primary').click()
}
function Modify_creativeName(params) {//修改创意名称
    const url = window.location.search;
    if ((url.includes('unitId') && url.includes('add')) || (url.includes('copy') && url.includes('originUnitId'))) {
        for (let i = 0; i < $('input.ant-input').length / 2; i++) {
            const ele = $('input.ant-input')[1 + i * 2]
            setTimeout(()=>Input(ele, i + 1),i*30);
        }
    }
}

//$('.ad-form-row.ad-form-item.index-module__changeForm___1aUXE')
//$('span.ant-input-affix-wrapper input.ant-input')   商品推荐语
function Enter_value(){
    const value = prompt('推荐语');
    const screen = '\n';
    if ($('.ant-radio-group.ant-radio-group-outline:first label.ant-radio-button-wrapper.ant-radio-button-wrapper-checked').text() == '自定义创意') {
        const len=value.split(screen).length
        for (let i = 0; i < $('span.ant-input-affix-wrapper input.ant-input').length; i++) {
            const ele = $('span.ant-input-affix-wrapper input.ant-input')[i]
            const input=value.split(screen)[i%len]
            setTimeout(()=>Input(ele, input),i*30);
        }
    }
}
function Enter_title() {//输入视频标题文案
    const value = prompt('文案');
    if (value) {
        const screen = '\n';
        const data = value.split(screen)
        if ($('.ant-radio-group.ant-radio-group-outline:first label.ant-radio-button-wrapper.ant-radio-button-wrapper-checked').text() == '自定义创意') {
            const len=value.split(screen).length
            for (let i = 0; i < $('textarea').length; i++) {
                const ele = $('textarea')[i]
                const input=data[i%len]
                setTimeout(()=>Input(ele, input),i*30);
            }
        } else if ($('.ant-radio-group.ant-radio-group-outline:first label.ant-radio-button-wrapper.ant-radio-button-wrapper-checked').text() == '程序化创意') {
            if (value.split(screen).length > 1) {
                const a = $('#program-title textarea').length;
                const b = value.split(screen).length;
                for (let i = 0; i < Math.min(a, b); i++) {
                    const ele = $('#program-title textarea')[i]
                    const input = data[i];
                    setTimeout(()=>Input(ele, input),i*30);//输入视频标题
                }
            }
        }
    }
}
function Enter_slogan() {//输入封面标语
    const value = prompt('标语');
    if (value) {
        const screen = '\n';
        if ($('.ant-radio-group.ant-radio-group-outline:first label.ant-radio-button-wrapper.ant-radio-button-wrapper-checked').text() == '自定义创意') {
            const len=value.split(screen).length
            for (let i = 0; i < $('#program-title textarea').length; i++) {
                const ele = $('textarea')[i]
                const input=value.split(screen)[i%len]
                setTimeout(()=>Input(ele, input),i*30);
            }
        } else if ($('.ant-radio-group.ant-radio-group-outline:first label.ant-radio-button-wrapper.ant-radio-button-wrapper-checked').text() == '程序化创意') {
            if (value.split(screen).length > 1) {
                let a = $('#program-cover-slogan textarea').length;
                let b = value.split(screen).length;
                for (let i = 0; i < Math.min(a, b); i++) {
                    let ele = $('#program-cover-slogan textarea')[i]
                    let input = value.split(screen)[i];
                    setTimeout(()=>Input(ele, input),i*30);//输入视频标题
                }
            }
        }
    }
}
function Move_creativity(x) {//方向键移动
    for (let i = 0; i < $('.ant-tabs-tab').length; i++) {
        if (document.getElementsByClassName('ant-tabs-tab')[i].className == 'ant-tabs-tab ant-tabs-tab-active') {
            if (document.getElementsByClassName('ant-tabs-tab')[i + x]) {
                document.getElementsByClassName('ant-tabs-tab')[i + x].click();
            }
            break;
        }
    }
}
function zd1() {//上传封面完成自动点击确定
    function aaa(i, url) {
        const a1 = setInterval(() => {
            if ($('.index-module__picWrapper___3KlNQ.index-module__vertival___1iWMh img')[i].src != url[i]) {
                $('.ant-btn.ant-btn-primary:last').click()
                clearInterval(a1);
            }
        }, 100)
        }
    let o = 0
    let url = []
    for (let i = 0; i < $('.index-module__upload___1FIhR:contains(封面设置)').length; i++) {
        $('.index-module__upload___1FIhR:contains(封面设置)').eq(i).click(() => {
            let set1 = setInterval(() => {
                if ($('.ant-btn.ant-btn-sm.index-module__btn___1gGoV').eq(i)[0]) {
                    clearInterval(set1);
                    $('.ant-btn.ant-btn-sm.index-module__btn___1gGoV').eq(i).click();
                }
            }, 100)
            })
    }
    const br3 = setInterval(() => {
        $('.index-module__hoverBtns___32_6p').addClass("index-module__hovered___6CFwA")
        for (let i = o; i < $('.ant-btn.ant-btn-sm.index-module__btn___1gGoV').length; i++) {
            $('.ant-btn.ant-btn-sm.index-module__btn___1gGoV').eq(i).click(function () {
                url[i] = $('.index-module__picWrapper___3KlNQ.index-module__vertival___1iWMh img')[i].src
                aaa(i, url)
            })
            o++
        }
    }, 100)
    }
function del() {//删除创意
    if ($('.ant-radio-button-wrapper.ant-radio-button-wrapper-checked:eq(0)').text() == '自定义创意') {
        const br2 = setInterval(() => {
            if ($('.ant-tabs-tab').length != 1) {
                $('.ant-tabs-tab.ant-tabs-tab-active .anticon.anticon-SystemDeleteLine.customHeaderIcon.del').click()
                try {
                    $('.ant-btn.ant-btn-primary.ant-btn-sm').click()
                } catch (e) { }
            } else clearInterval(br2);
        }, 100)
        } else if ($('.ant-radio-button-wrapper.ant-radio-button-wrapper-checked:first').text() == '程序化创意') {
            if ($('.index-module__oneMore___2Bp9v:contains(删除视频)')[0]) {
                    $('.index-module__oneMore___2Bp9v:contains(删除视频)').click()
                    $('.index-module__chooseWrapper___1MZTv.index-module__active___sJytm').click()
                }
        }
}
function Delete_cover() {
    if ($('button:contains(删除封面)')[0]) {
        $('button:contains(删除封面)').click()
    }
}

function fzcy() {//复制创意
    const x = prompt('要复制几个', 1);
    if (x != null) {
        let i = 0
        $('.ant-tabs-tab.ant-tabs-tab-active span:eq(1)').click()
        const set1 = setInterval(() => {
            if (i < x - 1) {
                $('.ant-tabs-tab.ant-tabs-tab-active span:eq(1)').click()
                i++
            } else clearInterval(set1);
        }, 300)
        }
}
function release() {//发布计划
    /*     if($('.index-module__createPlacement___4It8O.index-module__active___11B-L.placement-union')[0]){
        $('.index-module__createPlacement___4It8O.index-module__active___11B-L.placement-union')[0].click()
    }   */
    const ele = $('.ant-btn-primary:contains(保存并关闭)')[0] || $(".ant-btn.ant-btn-primary:contains('保 存')")[0]
    if ($('.ant-radio-button-wrapper.ant-radio-button-wrapper-checked:eq(0)').text() == '自定义创意') {
        ele.click(a1());
    }else if ($('#ad_from_program_actionBar span').text() != '立即购买') {
        if ($(".ant-select-item.ant-select-item-option[title|='立即购买']")[0]) {
            $(".ant-select-item.ant-select-item-option[title|='立即购买']").click()
            setTimeout(() => { ele.click(a1()) }, 500)
        } else {
            $('#ad_from_program_actionBar .ant-select-selector').click()
            //setTimeout(() => { release() }, 50)
            //alert('点击行动按钮')
        }
    } else { ele.click(a1()); }
    function a1() {
        window.onurlchange=e=>{
            window.close()
        }
    }
}
function Check_video() {//勾选视频
    let p = prompt('勾选第几列，从下往上数'),
        len = $('.index-module__videoWarpper___HjFE-').length;
    $('.index-module__content___2uzIb').scrollTop($('.index-module__videoWarpper___HjFE-').eq(len - 1).offset().top);
    setTimeout(() => {
        program()
    }, 1200);
    function program() {
        len = $('.index-module__videoWarpper___HjFE-').length;
        let val = len - (p - 1) * 5 - 1;
        for (let i = val; i > val - 5; i--) {
            $('.index-module__videoWarpper___HjFE- label')[i].click()
        }
    }
}
function pd(){//创建盒子
    if($('.div-1')[0])
    {
        setTimeout(()=>{
            $('#textarea-1').focus()
        },1)
    }else {
        document.getElementsByTagName('style')[0].innerHTML+=
            '.div-1{'+
            'margin: 0px;'+
            'padding: 15px;'+
            'background-color:#198B99;'+
            'width:auto; '+
            'display:inline-block !important; '+
            'display:inline;'+
            'position: fixed;'+
            'top: 25%;'+
            '}'+
            '#textarea-1{'+
            'width: 194px;height:78px;'+
            'padding: 15px;'+
            '}'+
            '.button-1{'+
            'width:97px;'+
            'height: auto;'+
            'padding-top: 5px;'+
            'padding-bottom: 5px;'+
            '}"'
        let html1='<div class="div-1"><form ><label style="font-weight:bold; color:red;"></label><textarea id="textarea-1"></textarea></form><button class="button-1">屏蔽id</button><button class="button-1">屏蔽关键字</button></div>'
        $("body").append(html1)
        $('.button-1:contains(屏蔽id)').click(()=>{
            if($('#textarea-1').val()){
                Shield_users($('#textarea-1').val())
            }
        })
        $('.button-1:contains(屏蔽关键字)').click(()=>{
            if($('#textarea-1').val()){
                Shield_rule($('#textarea-1').val())
            }
        })
        $('#textarea-1').blur(()=>{
            if($('#textarea-1').val()&&$('#textarea-1').val().slice(-1)!=','){
                Shield_rule($('#textarea-1').val($('#textarea-1').val()+','))
            }
        })
        setTimeout(()=>{
            $('#textarea-1').focus()
        },1)

    }
}
function Shield_id(){//点击屏蔽id
    $('.index-module__userId___pUNdi').css("color","blue")
    $('.index-module__userId___pUNdi').click(function(){
        Shield_users($(this).text().split('：')[1])
    })
}
async function Shield_users(id){//屏蔽id

    id=id.replace(/[、，.。]/g, ',').split(',')
    id=id.filter(function (s) {//去空值
        return s && s.trim();
    });
    fetch(`https://niu.e.kuaishou.com/rest/esp/comment/shieldInfo/create?kuaishou.ad.esp_ph=${await get_ph()}`, {
        "headers": {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json;charset=UTF-8",
            "x-timestamp": new Date().getTime()
        },
        "body": `{\"shieldType\":6,\"shieldContentList\":[${id}]}`,
        "method": "POST"
    }).then(e=>{
        if(e.status==200){
            alert('成功')
        }else alert('失败')
    })
}
async function Shield_rule(val){//屏蔽关键词
    val=val.replace(/[、，.。]/g, ',').split(',')
    val=val.filter(function (s) {//去空值
        return s && s.trim();
    });
    val=val.map(
        v => '\\"'+ v + '\\"'
    )
    fetch(`https://niu.e.kuaishou.com/rest/esp/comment/shieldInfo/create?kuaishou.ad.esp_ph=${await get_ph()}`, {
        "headers": {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json;charset=UTF-8",
            "x-timestamp":  new Date().getTime()
        },
        "body": `{\"shieldType\":1,\"shieldContentList\":[${val}]}`,
        "method": "POST",
    }).then(e=>{
        if(e.status==200){
            alert('成功')
        }else alert('失败')
    })
}
async function get_ph(){//获取cookie
    const cookie=(await cookieStore.get('kuaishou.ad.esp_ph')).value
    return cookie
    /*     return new Promise((resolve, reject) => {
        if(cookie!=null){
            resolve(cookie);
        }
        // reject('失败的数据');
    }) */
}
function copy(){//复制已经屏蔽评论的用户id
    let id=$('div.g-card tbody.ant-table-tbody tr').find('td.ant-table-cell-ellipsis:eq(1)').text().match(/(?!（)\d+(?=）)/g)
    GM_setClipboard(id)
}
async function chaxun(){
    let q=(await(
        await fetch(`https://niu.e.kuaishou.com/rest/esp/control-panel/param/uniqueName?kuaishou.ad.esp_ph=${await get_ph()}`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json;charset=UTF-8",
                "x-timestamp": new Date().getTime()
            },
            "referrer": "https://niu.e.kuaishou.com/create?mode=modify&promotionType=2&campaignId=839341784&unitId=1539782316",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"name\":\"0526-视频26~30-8\",\"accountId\":2485682962,\"campaignId\":839341784,\"checkLevel\":2}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        })
    ).json()).isUniqueName
    if(q){
        alert('可用')
    }else alert('不可用')
}
function copy_data(){//复制当前余额
    let value='快手' + $('.index-module__userId___3RvDP').text().replace(':', '：') + '\n'
    value+='账户' + $('.index-module__account___23VGe:eq(1)').text() + '\n'
    value+='余额：' + $('.index-module__balance___1QGNS').text().replace(/[,充值]+/g, '') + '\n'
    GM_setClipboard(value)
}