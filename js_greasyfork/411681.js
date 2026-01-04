// ==UserScript==
// @name         FollowsList Script
// @namespace    http://tampermonkey.net/
// @version      0.2.1.1
// @description  special Follows!
// @author       行亦难
// @require      https://cdn.jsdelivr.net/npm/layui-layer@1.0.9/dist/layer.js

// @match        https://*.imoutolove.me/*

// @match        https://*.level-plus.net/*


// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/411681/FollowsList%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/411681/FollowsList%20Script.meta.js
// ==/UserScript==
//console.log('jishu');
(function() {
    'use strict';
    // Your code here...

    //layer.alert(isLogin());
    if(!isLogin()) return;
    //use tools
    if(window.location.pathname.includes('index.php') || window.location.pathname == '/'){
        console.log('首页')
        indexTool();
    }else if(window.location.pathname == '/u.php'){
        console.log('用户信息')
        userDetails();
    }else if(window.location.pathname == '/read.php'){
        console.log('帖子详情')
        nDetails();
    }else{
        console.log('其他页面')
    }
    //indexTool();


    //
    //检测jq是否已经引入
    console.log(jQuery('#header'))
})();

function isLogin(){
    // 检查是否已经登录
    if(document.getElementById('login_0') === null) {
        return true;
    }else{
        console.log('未登录')
        return false;
    }
}

function initCss(){
    // 初始化样式
    let textCss = `
      .layui-btn{
        color:#333;
        font-weight: 500;
        cursor: pointer;
      }
      .tabs{
        display: flex;
      }
      .tabs > div{
       flex:1;
     }
     .active{
      color:#000;
      font-weight: 700;
     }
.specialList {
flex:1;
padding: 0px;
}
.specialList>a{
display: block;
margin: 0 4px;
}
.specialBox{
display: none;
width: 400%;

}
.followTabs{
        height: 80px;
text-align: center;
    }
.follow{
        display:inline-block;
cursor: pointer;
}
.unfollow{
display: none;
}
    `;
    return textCss;
}
async function indexTool(){

    let $ = jQuery;
    //GM_setValue('arrFollows', {})
    let arrFollows = GM_getValue('arrFollows')?GM_getValue('arrFollows'):{};
    console.log('index.arr',arrFollows)

    let nTable = document.querySelector('#main .t table');
    let nTab = document.createElement('div');
    nTab.className = 'layui-btn active';
    nTab.innerHTML = '最新讨论';

    let nTab2 = document.createElement('div');
    nTab2.className = 'layui-btn';
    nTab2.innerHTML = '特别关注';

    let nTabs = document.createElement('div');
    nTabs.className = 'tabs';

    nTabs.appendChild(nTab);
    nTabs.appendChild(nTab2);

    //nTable.querySelector('.tr2 td').replaceChild(nTab, nTable.querySelector('.tr2 td .b'));
    //nTable.querySelector('.tr2 td').appendChild(nTabs);

    nTable.querySelector('.tr2 td').replaceChild(nTabs, nTable.querySelector('.tr2 td .b'));

    // 最新讨论-节点
    let newsDiv = $('#main .t table').find('.tr3').eq(0);

    let specialBox = document.createElement('div');
    specialBox.className = 'specialBox';

    for(let i = 0; i < 4; i++){
        let specialList = document.createElement('div');
        specialList.className = 'specialList specialList'+i+'';
        specialBox.appendChild(specialList);
    }
    newsDiv.get(0).appendChild(specialBox)

    //
    let cssDiv = document.createElement('style');
    cssDiv.innerHTML = initCss();

    nTable.appendChild(cssDiv);
    //
    //event
    //let $ = jQuery;
    nTab = $(nTab);
    nTab2 = $(nTab2);
    //

    nTab.click(function(){
        rtClass.apply(this, null);
        newsDiv.find('td').show();
        $('.specialBox').css('display','none');
    });
    nTab2.click(function(){
        rtClass.apply(this, null)
        newsDiv.find('td').hide();
        $('.specialBox').css('display','flex');
    });


    //设置视图
    for(let i = 0; i < Object.keys(arrFollows).length; i++){

        //await setList('526481', $('.specialList'));
        let uuid = Object.keys(arrFollows)[i];
        await setList(uuid, $('.specialList' + i));
        if(arrFollows[uuid]){
            $('.specialList' + i).find('.u-h1').text(arrFollows[uuid].replace(/昵称:/,''))
        }
        $('.specialList' + i).find('.u-h1').click(function(){
            //console.log(uuid)
            location.href = `u.php?action-show-uid-${uuid}.html`
        })
    }




    //console.log($(await initTempDiv()).find('#user-login'))
    //console.log(initTempDiv())
    function rtClass(){
        // 切换按钮组
        $(nTabs).find('div').removeClass('active');
        $(this).addClass('active');
    }

    async function initTempDiv(url){
        // 创建缓存节点，解析文本形式的html
        let p1 = await getUserData(url);
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = p1;

        let tic = $(tempDiv).find('#u-contentmain .u-table tbody tr').map(function(){
            return $(this).find('th')[0]
        }).map(function(){
            return $(this).find('a')
        });
        if(tic.length > 0){

            tic.map(function(){
                return jQuery(this).eq(0).prepend(jQuery(this).eq(1).append('] ').prepend(' ['))
            })
            return {list: tic, nickName: $(tempDiv).find('.u-h1')};
        }else{
            console.log('主题列表为0。');
            return {list: $('<a>暂无更多主题。</a>'), nickName: $(tempDiv).find('.u-h1')};
        }

    }
    async function setList(uid, thisBox){

        //let thisBox = $('.specialList0');
        if(thisBox.children().length){
            thisBox.children().remove()
        }

        //获取列表数据集合，obj + jq对象,并设置到视图
        let arrayDiv = await initTempDiv(`/u.php?action-topic-uid-${uid}.html`);

        if(!arrayDiv) {
            return;
        }

        let specialName1= document.createElement('h1');
        specialName1.className = 'u-h1';
        specialName1.style = 'margin: 8px;';
        specialName1.innerHTML = arrayDiv['nickName'].text();

        thisBox.append(specialName1)

        arrayDiv['list'].slice(0,6).map(function(){
            thisBox.append($(this).clone().get(0))
            return null
        })

        let btn = document.createElement('div');
        btn.innerHTML = '刷新'
        btn.style = 'display: inline-block;margin: 8px;cursor: pointer;';
        btn.className = 'btn refresh-btn';
        btn.dataset.uid = uid;

        $(btn).click(function(){
            let index = layer.load(2, {time: 10*1000});
            setList(uid, thisBox).then(()=>{
                layer.close(index);
            })
        })
        thisBox.append(btn);
    }
}


function getUserData(url){
    return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                resolve(xhr.responseText)
            }
        }
        xhr.send();
    })
}

function nDetails() {
    //注入帖子详情页
    let $ = jQuery;

    let cssDiv = document.createElement('style');
    cssDiv.innerHTML = initCss();

    $('#main').append($(cssDiv));

    //init
    let userInfo  = $('.user-info').map(function(){
        return $(this).find('.f12').eq(0).text()
    })
    let userInfoTwo = getUserInfotwo();

    let arrFollows = GM_getValue('arrFollows')?GM_getValue('arrFollows'):{};
    //

    let nTabs = document.createElement('div');
    nTabs.className = 'followTabs';
    nTabs.innerHTML = `<div class="btn follow">特别关注</div><div class="abtn follow unfollow">取消关注</div>`

    $('.r_two').map(function(index){
        if(userInfo[index] == userInfoTwo){
            return $(this)
        }else{
            return $(this).append($(nTabs).clone().data('fid',index));
        }


    }).map(function(){
        let follow = $(this).find('.followTabs .follow').eq(0);
        let unfollow = $(this).find('.followTabs .follow').eq(1);

        //判断是否已关注
        let index = $(this).find('.followTabs').data('fid');
        if(Object.keys(arrFollows).includes(userInfo[index])){
            follow.hide();
            unfollow.css('display','inline-block');
        }

        follow.click(function(){
            if(document.readyState != 'complete'){
                layer.msg('还在加载');
                console.log(document.readyState)
                return;
            }else if(document.readyState == 'complete'){

                if( Object.keys(arrFollows).length > 3){
                    layer.msg('暂时只能关注四位');
                    return;
                }

                followUse.apply(this, null);
                //arrFollows.push(userInfo[index]);
                let nickName = $('.user-info').eq(index).text().match(/昵称: \S+/)
                arrFollows[userInfo[index]] = nickName?nickName[0]:''
                console.log(arrFollows)
                GM_setValue('arrFollows', arrFollows);
            }

        })
        unfollow.click(function(){
            if(document.readyState != 'complete'){
                //layer.msg('别点了，还在加载呢');
                console.log(document.readyState)
                return;
            }else if(document.readyState == 'complete'){
                unfollowUse.apply(this, null)
                if(Object.keys(GM_getValue('arrFollows')).includes(userInfo[index])){
                    delete arrFollows[userInfo[index]];
                    GM_setValue('arrFollows', arrFollows);
                }

            }

        })
    })

    //console.log(temp)

}


function userDetails() {

    let $ = jQuery;


    let cssDiv = document.createElement('style');
    cssDiv.innerHTML = initCss();

    $('#main').append($(cssDiv));

    let nTabs = document.createElement('div');
    nTabs.className = 'followTabs';
    nTabs.style = 'height: auto;margin-top: 1rem;'
    nTabs.innerHTML = `<div class="btn follow">特别关注</div><div class="abtn follow unfollow">取消关注</div>`
    let jTabs= $(nTabs)


    let uid = $('.u-table tr th').eq(0).text();
    let nickName = $('.u-table tr th').eq(3).text();

    //判断是否已关注
    let arrFollows = GM_getValue('arrFollows')?GM_getValue('arrFollows'):{};
    if(Object.keys(arrFollows).includes(uid)){
        jTabs.find('.follow').eq(0).hide();
        jTabs.find('.follow').eq(1).css('display','inline-block');
    }



    jTabs.find('.follow').eq(0).click(function(){

        //如果大于四个特别关注
        if(Object.keys(arrFollows).length > 3) {
            layer.msg('暂时只能关注四位');
        }else{
            arrFollows[uid] = nickName?nickName:''
            GM_setValue('arrFollows', arrFollows);
            followUse.apply(this, null);
        }

    })
    jTabs.find('.follow').eq(1).click(function(){

        if(Object.keys(GM_getValue('arrFollows')).includes(uid)){
            delete arrFollows[uid];
            GM_setValue('arrFollows', arrFollows);
        }
        console.log(arrFollows);
        unfollowUse.apply(this, null);
    })


    //如果是自己的主页。
    if(!location.search) return;


    $('#u-profile').prepend(jTabs)

}

function followUse(){
    jQuery(this).hide().next().css('display','inline-block');
    let index = jQuery(this).parent().data('fid');
    // console.log(userInfo[index])
}
function unfollowUse(){
    jQuery(this).hide().prev().css('display','inline-block');
}

function getUserInfotwo(){
    let userInfo = jQuery('.user-infotwo').text().match(/UID: \d+/)
    try{
        if(userInfo && userInfo.length){
            return userInfo[0].replace(/UID: /,'')
        }else{
            return ''
        }
    }catch(e){
        console.log(e)
        return '';
    }

}