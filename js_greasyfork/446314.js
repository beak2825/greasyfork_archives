// ==UserScript==
// @name         BiliBili Tags Blocker BiliBili标签屏蔽助手
// @namespace    https://greasyfork.org/zh-CN/users/924205-xiao-xi
// @version      0.11.2.2
// @description  眼不见为净,耳不听为清,心不想则静
// @author       xiaoxi
// @license      MIT
// @include      *://www.bilibili.com/*
// @include      *://t.bilibili.com/*
// @include      *://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @require      https://greasyfork.org/scripts/407543-block-obj/code/Block_Obj.js?version=963893
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_setClipboard
// @grant        GM.setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446314/BiliBili%20Tags%20Blocker%20BiliBili%E6%A0%87%E7%AD%BE%E5%B1%8F%E8%94%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446314/BiliBili%20Tags%20Blocker%20BiliBili%E6%A0%87%E7%AD%BE%E5%B1%8F%E8%94%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var tagsBlocker = {
    functionEnable: true,
    onlyChangeColorEnable: false,
    printLog: false,
    blurMode: false,
    hiddenMode: false,
    tagsArray: [],
    titlesArray: [],
    userNameArray: [],
};

var href = location.href;
var matchSearch = href.match(/search.bilibili/);
var matchPopular = href.match(/popular/);
var matchRank = href.match(/\/popular\/rank/);
var matchPost = href.match(/t.bilibili/);
var matchVideo = href.match(/\/video\/BV/);
var matchHome = href.match(/bilibili.com/);

var blockObj = new Block_Obj('Tags_Blocker');

const BASIC_STYLE = `
     .block_obj_checkbox_label {
         padding-left: 13px;
     }
  `;

const bvTagsApi = 'https://api.bilibili.com/x/web-interface/view/detail/tag?bvid=';
const searchAllApi = 'https://api.bilibili.com/x/web-interface/search/all/v2?';
const searchVideoApi = 'https://api.bilibili.com/x/web-interface/search/type?search_type=video&';
const videoInfoApi = 'https://api.bilibili.com/x/web-interface/view?bvid=';

//加载选项
document.arrive("body", { fireOnAttributesModification: true, onceOnly: true, existing: true }, function() {
    initSettingUI()
});

function initSettingUI(){
    blockObj.init({
        id: 'tagsBlocker',
        menu: '屏蔽设置',
        style: BASIC_STYLE,
        field: [
            {
                id: 'version',
                label: 'v0.11.2.2',
                type: 's',
            },
            {
                id: 'functionEnable',
                label: '启用屏蔽功能',
                title: '总开关',
                type: 'c',
                default: true,
            },
            {
                id: 'onlyChangeColorEnable',
                label: '看看屏蔽了什么',
                title: '更改屏蔽视频的背景色',
                type: 'c',
                default: false,
            },
            {
                id: 'printLog',
                label: '在控制台输出匹配的视频信息',
                title: '。。',
                type: 'c',
                default: false,
            },
            {
                label: '屏蔽模式',
                type: 's',
            },
            {
                id: 'blurMode',
                label: '模糊模式',
                type: 'c',
                default: false,
            },
            {
                id: 'hiddenMode',
                label: '隐藏模式',
                type: 'c',
                default: false,
            },
            {
                label: '标签关键字',
                type: 's',
            },
            {
                id: 'tagInput',
                label: '',
                placeholder: ' 同时输入多个时以英文逗号分隔 ',
                type: 'i',
                list_id: 'tagsArray',
            },
            {
                id: 'tagsArray',
                type: 'l',
                default: [],
            },
            {
                label: '标题关键字 (例如‘原 神’标题，请输入‘原神’)',
                type: 's',
            },
            {
                id: 'titleInput',
                label: '',
                placeholder: ' 同时输入多个时以英文逗号分隔 ',
                type: 'i',
                list_id: 'titlesArray',
            },
            {
                id: 'titlesArray',
                type: 'l',
                default: [],
            },
            {
                label: '用户名称 (动态页)',
                type: 's',
            },
            {
                id: 'nameInput',
                label: '',
                placeholder: ' 同时输入多个时以英文逗号分隔 ',
                type: 'i',
                list_id: 'userNameArray',
            },
            {
                id: 'userNameArray',
                type: 'l',
                default: [],
            },

        ],
        events: {
            save: config => {
                tagsBlocker = config;
            },
            change: config => {
                tagsBlocker = config;
            },
        },
    })
}

class VideoCard{
    constructor(card,title,bv) {
        this.card = card; //DOM元素
        this.title = replaceAllSymbol(title); //标题
        this.bv = bv; //bv号
        this.av = null; //av号
        this.tags = null; //标签
        this.arcurl = null; //av号链接
        this.pic = null; //封面
        this.duration = null; //时长
        this.description = null; //简介
        this.play = null; //播放数
        this.danmaku = null; //弹幕数
        this.pubdate = null; //上传时间 , 时间戳
        this.senddate = null; //更新时间 , 时间戳
        this.displaytime = null; //显示时间
        this.mid = null; //up主ID
        this.author = null; //up主
        this.typeName = null; //视频类型
        this.match = null; //匹配的标签
        this.where = null; //来源
    }
}

class Listener{
    constructor(targetNode, nth, parameter, options = {}) {
        this.targetNode = targetNode;
        this.nth = nth;
        this.options = options;
        this.parameter = parameter;
    }
    init(initMethod,callMethod){
        let targetNode = this.targetNode;
        let options = this.options;
        let parameter = this.parameter;
        let nth = this.nth;
        let node = null;

        function callback(mutationsList, observer) {
            if(mutationsList.length >= 1 && mutationsList[0].addedNodes.length != 0){
                callFunc(callMethod,mutationsList)
            }
            if(parameter == 'search')
            {
                callFunc(callMethod,mutationsList)
            }
        }
        let mutationObserver = new MutationObserver(callback);
        let checkTarget = setInterval(function () {
            if(node !=  undefined && node != null && node.length != 0){
                clearInterval(checkTarget);
                mutationObserver.observe(node, options);
                callFunc(initMethod,node)
            }
            else
            {
                node = $(targetNode)[nth];
            }

        }, 50);
    }
}

class Match{
    init(url,parameter,process,callMethod){
        return new Promise(function(resolve) {
            $.ajax(url + parameter.bv, {
                method: 'GET',
                headers: {
                    "content-type": "application/json"
                },
                async: true,
                success: function (result) {
                    parameter.tags = result.data
                    resolve(callFunc(callMethod,parameter,process));
                },
                error: function (result) {
                    console.log(result)
                },
            });
        });
    }
    id(url,id,callMethod){
        return new Promise(function(resolve) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url + id,
                headers: {
                    "content-type": "application/json"
                },
                async: true,
                onload: function (result) {
                    console.log(result)

                    //result = JSON.parse(result.responseText).data.result;
                    resolve(callFunc(callMethod,result,id));
                },

            });
        });
    }
    searchInit(url,callMethod){
        return new Promise(function(resolve) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    "content-type": "application/json"
                },
                onload: function (result) {

                    result = JSON.parse(result.responseText).data.result;

                    if(result.length== 11){
                        result = result[result.length-1].data
                    }
                    resolve(callFunc(callMethod,result,url));
                },

            });
        });
    }
}
var match = new Match();
//==视频页==//
async function videoInit(card){
    let info = $(card).children(".card-box").children(".info").children("a")
    let href = $(info).attr("href");
    let title = $(info).children('span').attr("title");
    let videoCard = $(card);
    let bv = getBvcountber(href);
    let v1 = new VideoCard(videoCard,title,bv);
    //if(bv != null){
    // let result = await match.id(videoInfoApi,bv,getUserId);
    // v1.mid = result.data.owner.mid
    // }
    return Promise.resolve(v1)
}
function videoListenerInit(targetNode){
    $.each($(targetNode).children(".video-page-card"), function(i, card){
        let v1 = videoInit(card).then(v1 =>{
            match.init(bvTagsApi,v1,true,finalMatch);
        });
    });
}
function videoListenerCall(targetNode){
    $.each(targetNode, function(i, m){
        let v1 = videoInit(m.addedNodes[0]).then(v1 =>{
            match.init(bvTagsApi,v1,true,finalMatch);
        });
    });
}
function ad1(){
    //.video-page-special-card
    //#live_recommand_report
    //#activity_vote
    document.arrive(".video-page-special-card", { fireOnAttributesModification: true, onceOnly: true, existing: true }, function() {
        $(this).css({"display":"none"});
    });
    document.arrive("#live_recommand_report", { fireOnAttributesModification: true, onceOnly: true, existing: true }, function() {
        $(this).css({"display":"none"});
    });
    document.arrive("#activity_vote", { fireOnAttributesModification: true, onceOnly: true, existing: true }, function() {
        $(this).css({"display":"none"});
    });
    //结束视频
    $(document).arrive('.bpx-player-ending-related', {fireOnAttributesModification: true, onceOnly: true, existing: true},function(){
        $(this).remove();
        $('.bpx-player-ending-functions').animate({
            marginTop: 145, opacity: 'show'
        }, "slow");
    })
    $(document).arrive('.bpx-player-popup', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
        $(this).remove();
    })
    $(document).arrive('.bpx-player-follow', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
        $(this).remove();
    })
    //三连
    $(document).arrive('.bpx-player-popup-guide-all', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
        $(this).remove();
    })
    //投票
    $(document).arrive('.bpx-player-popup-vote', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
        $(this).remove();
    })
    //跳转其他视频
    $(document).arrive('.bpx-player-link', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
        $(this).remove();
    })
    //评分
    $(document).arrive('.bpx-player-score', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
        $(this).remove();
    })
    //推广视频
    $(document).arrive('.video-ad-creative-card', {fireOnAttributesModification: true, onceOnly: true, existing: true},function(){
        $(this).css({"display":"none"})
    })
    //右下角推广
    $(document).arrive('#right-bottom-banner', {fireOnAttributesModification: true, onceOnly: true, existing: true},function(){
        $(this).css({"display":"none"})
    })
}
$(document).arrive('.reply-notice', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
    $(this).css({"display":"none"})
})
$(document).arrive('.trending', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
    $(this).css({"display":"none"})
})
//==动态导航栏==//
function barListenerInit(targetNode){
    let navbarListener = new Listener('.video-list', 0 , 'null', {childList: true})
    navbarListener.init(navbarListenerInit,navbarListenerCall)
}
function barListenerCall(targetNode){
    targetNode.map(r => {
        if(r.addedNodes[0] != null){
            let tab = $(r.addedNodes[0])
            if(tab.hasClass('video-tab')){
                let navbarListener = new Listener('.video-list', 0, 'null', {childList: true})
                navbarListener.init(navbarListenerInit,navbarListenerCall)
            }
        }
    })
}
async function navbarInit(card){
    let href = $(card).children(".main-container").children("a").attr("href");
    let title = $(card).children(".main-container").children(".center-box").children("a").attr('title')
    let name = $(card).children(".main-container").children(".center-box").children(".name-line").children(".user-name").text()
    let videoCard = $(card);
    let bv = getBvcountber(href)
    let v1 = new VideoCard(videoCard,title,bv);
    v1.author = name;
    v1.where = 'navbar'
    // if(bv != null){
    //let result = await match.id(videoInfoApi,bv,getUserId);
    //   v1.mid = result.data.owner.mid
    // }
    return Promise.resolve(v1)
}
function navbarListenerInit(targetNode){
    let checkTarget = setInterval(function () {
        if($(targetNode).children(".list-item").length > 1){
            clearInterval(checkTarget);
            $.each($(targetNode).children(".list-item"), function(i, card){
                let v1 = navbarInit(card).then(v1 =>{
                    match.init(bvTagsApi,v1,true,finalMatch);
                });
            });
        }
    }, 50);

}
function navbarListenerCall(targetNode){
    $.each(targetNode, function(i, m){
        let v1 = navbarInit(m.addedNodes[0]).then(v1 =>{
            match.init(bvTagsApi,v1,true,finalMatch);
        });
    });
}

//==热门页面==//
async function initPopularVideoInfo(url){
    let l1 = url.indexOf('pn=');
    let num = url.substring(l1+3,url.length)
    let videoCardList = $(".video-card__content");
    console.log(videoCardList)
    if(videoCardList != null && videoCardList != undefined && videoCardList.length != 0){
        if(num != 1){
            if(tagsBlocker.blurMode){
                videoCardList = videoCardList.slice((num-1)*20,videoCardList.length)
            }
        }

        for(var i = 0 ; i < videoCardList.length ; i++){
            let href = $(videoCardList[i]).children("a").attr("href");
            let videoCard = $(videoCardList[i]).parent(".video-card");
            let title = $($(videoCard).children(".video-card__info")).children("p").attr("title");
            let v1 = new VideoCard(videoCard,title,"BV"+getBvcountber(href));
            v1.where = 'popular'
            //  if(v1.bv != null){
            // let result = await match.id(videoInfoApi,v1.bv,getUserId).then(result => {
            //     v1.mid = result.data.owner.mid
            // });
            // }
            match.init(bvTagsApi,v1,true,finalMatch)

        }
    }
}

//==排行榜==//
async function initRankVideoInfo(){
    let videoCardList = $(".rank-item");
    if(!location.href.match(/\/rank\/bangumi/) || !location.href.match(/\/rank\/guochan/) || !location.href.match(/\/rank\/documentary/) || !location.href.match(/\/rank\/movie/) || !location.href.match(/\/rank\/tv/) || !location.href.match(/\/rank\/variety/)){
        if(videoCardList != null && videoCardList != undefined && videoCardList.length != 0){
            for(var i = 0 ; i < videoCardList.length ; i++){
                let info = $(videoCardList[i]).children(".content").children(".info").children("a");
                let href = $(info).attr("href");
                let title = $(info).text();
                let videoCard = $(videoCardList[i]);
                let v1 = new VideoCard(videoCard,title,"BV"+getBvcountber(href));
                //  if(v1.bv != null){
                //   let result = await match.id(videoInfoApi,v1.bv,getUserId).then(result => {
                //       v1.mid = result.data.owner.mid
                //   });
                // }
                match.init(bvTagsApi,v1,true,finalMatch)
            }
        }
    }
}

//==搜索页==//
function initSearchVideoInfo(responses){
    let checkTarget = setInterval(function () {
        if(responses.length >= 1){
            let r = []
            let checkTarget1 = setInterval(function () {
                if(r.length > 1 ){
                    setVideoInfo(r[0])
                    clearInterval(checkTarget1);
                }
                else
                {
                    $.each(responses,function(i,t){
                        if(t.result_type == 'video'){
                            r.push(t)
                        }
                    })
                }
            }, 50);
            clearInterval(checkTarget);
        }

    }, 50);
}
function setVideoInfo(tagList){
    let videoList = $('.video-list.clearfix').children('.video-item.matrix')
    videoList.each(function(i,v){
        let tags = tagList.data[i].tag.split(',');
        let typeName = tagList.data[i].typename;
        let title = $($($(v).children('.info')).children('.headline')).children('a').attr('title')
        let v1 = new VideoCard($(v),title,-1);
        let newTags = [];
        tags.map(function(item) {
            let t = {tag_name : item}
            newTags.push(t)
        });
        v1.tags = newTags;
        v1.typeName = typeName;

        finalMatch(v1,true)
    })

}

//总页数
var pageCount = 5;
//date 范围
//type api类型
//rank 第一行选项
//duration 第二行选项
//channel 频道
//channel2 子频道
//second 范围秒
//rangeDate 对比时间

var selectedDuration = {date:null,type:null,rank:null,duration:null,channel:null,channel2:null,second:null,rangeDate:null};

//监听URL前进后退变化
window.onpopstate = function() {
    reSetDuration()
};

function switcherListenerInit(result){
    let all = $(result);
    beforeReSetDuration(all)
}

function switcherListenerCall(result){
    let all = $(result[0].target);
    beforeReSetDuration(all)
}

function beforeReSetDuration(all){
    if(all.hasClass('is-active')){
        selectedDuration.type = searchAllApi
        reSetDuration()
    }
    let video = $($('.v-switcher-header-item')[1]);
    if(video.hasClass('is-active')){
        selectedDuration.type = searchVideoApi
        reSetDuration()
    }
}

function reSetDuration(){
    setTimeout(function(){
        if(selectedDuration.date!= null){
            $(selectedDuration.date).addClass('active')
            generateApi(selectedDuration,false)
        }
    },500);
}

function reSetOption(){
    $(document).arrive('.filter-type.clearfix.order', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
        let op1 = '<li id="filter-item-week" class="filter-item"><a>一周之内</a><li>'
        let op2 = '<li id="filter-item-month" class="filter-item"><a>一月之内</a><li>'
        let op3 = '<li id="filter-item-year" class="filter-item"><a>一年之内</a><li>'
        $(this).append(op1);
        $(this).append(op2);
        $(this).append(op3);
        let week = $('#filter-item-week');
        let month = $('#filter-item-month');
        let year = $('#filter-item-year');
        week.click(function(){
            week.addClass('active')
            month.removeClass('active')
            year.removeClass('active')
            selectedDuration.date = '#filter-item-week';
            selectedDuration.second = 604800;
            generateApi(selectedDuration,false)
        });
        month.click(function(){
            month.addClass('active')
            week.removeClass('active')
            year.removeClass('active')
            selectedDuration.date = '#filter-item-month';
            selectedDuration.second = 2678400;
            generateApi(selectedDuration,false)

        });
        year.click(function(){
            year.addClass('active')
            week.removeClass('active')
            month.removeClass('active')
            selectedDuration.date = '#filter-item-year';
            selectedDuration.second = 31536000;
            generateApi(selectedDuration,false)

        });

    })
    // $(document).arrive('.pages', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
    //   let next = '<li id="next_list" class="page-item"><button class="pagination-btn num-btn">下一批</button><li>';
    //  $(this).append(next);
    //  next = $('#next_list')
    // next.click(function(){
    //     let preview = '<li class="page-item prev"><button class="nav-btn iconfont icon-arrowdown2">上一页</button></li>';
    //     $('.pages').prepend(preview);
    //   generateApi(selectedDuration,true)


    // });
    // })
}

function generateApi(date,next){
    selectedDuration.rangeDate = (Math.round(new Date() / 1000)) - date.second;
    let most = $('.filter-item,.order').children().slice(0,5)
    most.each(function(i,v){
        if($(v).hasClass('active')){
            let option = $(v).children('a').text()
            if(option == '综合排序'){
                selectedDuration.rank = '&order=totalrank'
            }
            if(option == '最多点击'){
                selectedDuration.rank = '&order=click'
            }
            if(option == '最新发布'){
                selectedDuration.rank = '&order=pubdate'
            }
            if(option == '最多弹幕'){
                selectedDuration.rank = '&order=dm'
            }
            if(option == '最多收藏'){
                selectedDuration.rank = '&order=stow'
            }
        }
    });
    let duration = $('.filter-item,.duration').children()
    duration.each(function(i,v){
        if($(v).hasClass('active')){
            let option = $(v).children('a').text()
            if(option == '全部时长'){
                selectedDuration.duration = '&duration=0'
            }
            if(option == '10分钟以下'){
                selectedDuration.duration = '&duration=1'
            }
            if(option == '10-30分钟'){
                selectedDuration.duration = '&duration=2'
            }
            if(option == '30-60分钟'){
                selectedDuration.duration = '&duration=3'
            }
            if(option == '60分钟以上'){
                selectedDuration.duration = '&duration=4'
            }
        }
    });
    selectedDuration.channel = '&tids_1=0'
    let keyWord = 'keyword='+$('#search-keyword').val()
    let page = $('.page-item.active').children('button').text().trim();
    if(next){
        page = Number(page+5)
    }
    let currentPage = '&page='+page
    let url = selectedDuration.type+keyWord+currentPage+selectedDuration.rank+selectedDuration.duration+selectedDuration.channel
    getPageData(url)
}

async function getPageData(url){
    //请求并返回全部页面数据
    requsetOtherPage(url).then(list =>{
        //根据时间戳排序
        sortByDate(list).then(result =>{
            //匹配标签
            matchVideoCard(result).then(result =>{
                //陈列排序后的视频
                displayVideoCard(result)
            })
        })
    })
}

//请求并返回全部页面数据
async function requsetOtherPage(url){
    let currentPagePrefix = url.indexOf('&page=');
    let currentPageSuffix = url.indexOf('&order');
    let currentPage = Number(url.substring(currentPagePrefix+6,currentPageSuffix))
    let allVideoCards = []
    for(var i = currentPage ; i < currentPage + pageCount ; i++){
        await match.searchInit(url,initPageData).then(list =>{
            list.map(v => { allVideoCards.push(v) })
        })
        url = url.replace('&page='+ i,'&page='+ Number(i+1))
    }
    return Promise.resolve(allVideoCards)
}
function initPageData(result,url){
    return new Promise(function(resolve) {
        let list = [];
        result.map((v,i) => {
            if(v.pubdate > selectedDuration.rangeDate){
                let v1 = new VideoCard(null,v.title,v.bvid);
                v1.av = v.aid;
                v1.arcurl = v.arcurl;
                v1.pic = v.pic;
                v1.duration = v.duration;
                v1.typename = v.typename;
                v1.description = v.description;
                v1.play = v.play;
                v1.danmaku = v.danmaku;
                v1.pubdate = v.pubdate;
                v1.senddate = v.senddate;
                v1.displaytime = date('Y-m-d',v.pubdate);
                v1.mid = v.mid;
                v1.author = v.author;
                list.push(v1)

            }
            resolve(list)
        })
    });
}

//根据时间戳排序
function sortByDate(allVideoCards){
    return new Promise(function(resolve) {
        if(allVideoCards.length > 0){
            for (var i=0;i<allVideoCards.length;i++)
            {
                for (var j=i;j<allVideoCards.length;j++)
                {
                    if(allVideoCards[i].pubdate < allVideoCards[j].pubdate){
                        let n = allVideoCards[i]
                        allVideoCards[i] = allVideoCards[j]
                        allVideoCards[j] = n;
                    }
                }
            }
        }
        resolve(allVideoCards)
    });
}
//匹配标签
function matchVideoCard(allVideoCards){
    return new Promise(function(resolve) {
        let count = 0
        if(allVideoCards.length > 0){
            allVideoCards.map((result,i) =>{
                match.init(bvTagsApi,result,false,finalMatch).then(v =>{
                    if(v instanceof VideoCard){
                        result = v;
                        count += 1
                        if(allVideoCards.length == count){
                            resolve(allVideoCards)
                        }
                    }
                });
            })
        }
        else{
            resolve(allVideoCards)
        }
    });

}
//陈列排序后的视频
function displayVideoCard(allVideoCards){
    let cardList = $('.video-list.clearfix');
    cardList.empty();
    if(allVideoCards.length > 0){
        allVideoCards.map((v,i) =>{
            if(v.match == null){
                let template = "<li class='video-item matrix'><a href='"+v.arcurl+"' title='"+v.title+"' target='_blank' class='img-anchor'> <div class='img'><div class='lazy-img'>    <img alt='' src='"+v.pic+"' width='720' data-resolution-width='1620'></div><span class='so-imgTag_rb'>"+v.duration+"</span><div class='watch-later-trigger watch-later'></div><span class='mask-video'></span></div></a><div class='info'><div class='headline clearfix'><span class='type hide'>"+v.typename+"</span><a title='"+v.title+"' href='"+v.arcurl+"' target='_blank' class='title'>"+v.title+"</a></div><div class='des hide'>"+v.description+"</div><div class='tags'><span title='观看' class='so-icon watch-num'><i class='icon-playtime'></i>"+v.play+" </span><span title='弹幕' class='so-icon hide'><i class='icon-subtitle'></i>"+v.danmaku+" </span><span title='上传时间' class='so-icon time'><i class='icon-date'></i>"+v.displaytime+" </span><span title='up主' class='so-icon'><i class='icon-uper'></i><a href='https://space.bilibili.com/"+v.mid+"?from=search' target='_blank' class='up-name'>"+v.author+" </a></span></div></div></li>"
                cardList.append(template);
            }
        });
    }
}

//==动态==//
async function initPostVideoInfo(){
    let postCardList = $(".bili-dyn-list__items").children(".bili-dyn-list__item");


    for(var i = 0 ; i < postCardList.length ; i++){
        let name = $(postCardList[i]).children(".bili-dyn-item").children(".bili-dyn-item__main").children(".bili-dyn-item__header").children(".bili-dyn-title").children(".bili-dyn-title__text").text()
        let info = $(postCardList[i]).children(".bili-dyn-item").children(".bili-dyn-item__main").children(".bili-dyn-item__body").children(".bili-dyn-content").children(".bili-dyn-content__orig").children(".bili-dyn-content__orig__major").children("a");
        let bv = getBvcountber($(info).attr("href"));
        let title = $(info).children('.bili-dyn-card-video__body');
        if (title.length == 1){
            title = title.children('.bili-dyn-card-video__title').text();
        }
        else{
            title = '';
        }
        let videoCard = $(postCardList[i]).children(".bili-dyn-item").children(".bili-dyn-item__main");
        let v1 = new VideoCard($(postCardList[i]),title,bv);
        v1.author = name.trim()
        //if(bv != null){
        // let result = await match.id(videoInfoApi,bv,getUserId);
        // v1.mid = result.data.owner.mid
        // }
        v1.where = 'post'
        match.init(bvTagsApi,v1,true,finalMatch)

    }

}
function matchTopic(){
    $(document).arrive('.relevant-topic__title', {fireOnAttributesModification: true, onceOnly: false, existing: true},function(){
        let parent = $($(this).parents('.relevant-topic'));
        let title = $(this).text();
        let successed = false;
        $.each(tagsBlocker.tagsArray,function(i,tag){
            if(title.indexOf(tag) != -1 && !successed)
            {
                if(tagsBlocker.onlyChangeColorEnable){
                    parent.css({"background":"blue"})
                }else{
                    if(tagsBlocker.blurMode){
                        parent.css({"filter":"blur(1rem)"});
                    }
                    if(tagsBlocker.hiddenMode){
                        parent.css({"display":"none"});
                    }
                }
                successed = true;
            }
        })
        $.each(tagsBlocker.titlesArray,function(i,mtitle){
            if(title.indexOf(mtitle) != -1 && !successed)
            {
                if(tagsBlocker.onlyChangeColorEnable){
                    parent.css({"background":"blue"})
                }else{
                    if(tagsBlocker.blurMode){
                        parent.css({"filter":"blur(1rem)"});
                    }
                    if(tagsBlocker.hiddenMode){
                        parent.css({"display":"none"});
                    }
                }
                successed = true;
            }
        })
    })
}

//==首页==//
//推荐
async function homeInit(card){
    let href = $(card).children(".info-box").children("a").attr("href");
    let title =  $(card).children(".info-box").children("a").children(".info").children(".title").attr('title')
    let videoCard = $(card);
    let bv = getBvcountber(href)
    let v1 = new VideoCard(videoCard,title,bv);
    // if(v1.bv != null){
    //   let result = await match.id(videoInfoApi,v1.bv,getUserId).then(result => {
    //       v1.mid = result.data.owner.mid
    //  });
    // }
    return v1
}
function homeListenerInit(){
    $.each($('.video-card-reco'), function(i, card){
        let v1 = homeInit(card).then(v1 =>{
            match.init(bvTagsApi,v1,true,finalMatch).then(result =>{
                if(result instanceof VideoCard){
                    if(result.match != null){
                        $('.rcmd-box').append(result.card)
                    }
                }
            })
        });
    });
}

async function channelInit(card){

    let title = $($(card).children("a")[0]);
    let href = title.attr("href");
    let bv = getBvcountber(href)
    let videoCard = $(card);
    title = title.text().trim()
    let v1 = new VideoCard(videoCard,title,bv);
    // if(v1.bv != null){
    //   let result = await match.id(videoInfoApi,v1.bv,getUserId).then(result => {
    //       v1.mid = result.data.owner.mid
    //  });
    // }
    return v1
}

function initChannel(channel){
    let target = $(channel).children('.card-list').children('.zone-list-box')
    let checkTarget = setInterval(function () {
        let videoCardList = $(target).children('.video-card-common');
        if(videoCardList.length != 0){
            $.each(videoCardList, function(i, card){
                let v1 = channelInit(card).then(v1 =>{
                    match.init(bvTagsApi,v1,true,finalMatch).then(result =>{
                        if(result instanceof VideoCard){
                            if(result.match != null){
                                $(target).append(result.card)
                            }
                        }
                    })
                });
            });
            clearInterval(checkTarget);
        }
        else{
            videoCardList = $(target).children('.video-card-common');
        }
    }, 50);

}

async function channelRankInit(index,card){
    let v1 = null;
    if(index!=0){
        let href = $($(card).children("a")[0]);
        let title = href.children("p").attr("title");
        href = href.attr("href");
        let bv = getBvcountber(href)
        let videoCard = $(card);
        v1 = new VideoCard(videoCard,title,bv);
        // if(v1.bv != null){
        //   let result = await match.id(videoInfoApi,v1.bv,getUserId).then(result => {
        //       v1.mid = result.data.owner.mid
        //  });
        // }
    }
    else{
        let href = $(card).children(".preview").children(".pic").children("a").attr('href');
        let title = $(card).children(".preview").children(".txt").children("a").children("p").text().trim();
        let bv = getBvcountber(href)
        let videoCard = $(card);
        v1 = new VideoCard(videoCard,title,bv);
    }
    return v1
}

function initChannelRank(rank){
    let target = $(rank).children('.rank-list')
    let checkTarget = setInterval(function () {
        let videoCardList = $(target).children('.rank-wrap');
        if(videoCardList.length != 0){
            $.each(videoCardList, function(i, card){
                let v1 = channelRankInit(i,card).then(v1 =>{
                    match.init(bvTagsApi,v1,true,finalMatch).then(result =>{
                        if(result instanceof VideoCard){
                            if(result.match != null){
                                $(target).append(result.card)
                            }
                        }
                    })
                });
            });
            clearInterval(checkTarget);
        }
        else{
            videoCardList = $(target).children('.rank-wrap');
        }
    }, 50);
}

function finalMatch(parameter,process){
    let successed = false;
    $.each(parameter.tags,function(i,tag){
        $.each(tagsBlocker.tagsArray,function(i,mtag){
            //匹配到
            if((tag.tag_name.indexOf(mtag) != -1 || parameter.typeName.indexOf(mtag) != -1) && !successed)
            {
                if(tag.tag_name.indexOf(mtag) != -1){
                    parameter.match = mtag
                }
                if(tag.tag_name.indexOf(parameter.typeName) != -1){
                    parameter.match = parameter.typeName
                }
                if(process){
                    match1(parameter)
                }
                if(tagsBlocker.printLog){
                    console.log(parameter)
                }
                successed = true
            }
        })

    })
    if(!successed){
        //匹配到
        if(parameter.where == 'post' || parameter.where == 'navbar'){
            if(tagsBlocker.userNameArray.includes(parameter.author)  && !successed)
            {
                parameter.match = parameter.author
                if(process){
                    match1(parameter)
                }
                if(tagsBlocker.printLog){
                    console.log(parameter)
                }
                successed = true
            }
        }
        $.each(tagsBlocker.titlesArray,function(i,mtitle){
            //匹配到
            if(parameter.title.indexOf(mtitle) != -1 && !successed)
            {
                parameter.match = mtitle
                if(process){
                    match1(parameter)
                }
                if(tagsBlocker.printLog){
                    console.log(parameter)
                }
                successed = true
            }
        })
    }
    return parameter

}
function match1(parameter){
    if(tagsBlocker.onlyChangeColorEnable){
        if(parameter.where == 'post'){
            parameter.card.children(".bili-dyn-item").children(".bili-dyn-item__main").css({"background":"blue"});
        }else{
            parameter.card.css({"background":"blue"})
        }
    }else{
        if(tagsBlocker.blurMode){
            parameter.card.css({"filter":"blur(1rem)"});
        }
        if(tagsBlocker.hiddenMode){
            if(parameter.where == 'popular'){
                parameter.card.remove()
            }else{
                parameter.card.css({"display":"none"});
            }
        }
    }
}
function getUserId(result,id){
    return result
}

function reSetUI(){
    let count = 0;
    document.arrive(".block_obj_input_btn", { fireOnAttributesModification: true, onceOnly: false, existing: true }, function() {
        if($(this).attr('title') == '展开列表'){
            let index = count
            let targetNode = $($('.block_obj_list_textarea_div')[index]);
            $(this).click(function(){
                if(!targetNode.hasClass('expand')){
                    targetNode.animate({
                        maxHeight: 300, opacity: 'show'
                    }, "slow");
                    targetNode.addClass("expand");
                }
                else
                {
                    targetNode.animate({
                        maxHeight: 65, opacity: 'show'
                    }, "slow");
                    targetNode.removeClass("expand");
                }
            });
            count ++
        }
    });
    if (window.parent == window) {
        // 当前页面不在iframe中
    }
    else
    {
        $('#blockObj_tagsBlocker_expandSpan').animate({
            opacity: 'hide'
        }, 140);
    }
}

if (window.parent == window) {
    // 当前页面不在iframe中
    ajaxHook();
}
else
{
    // 当前页面在iframe或者frameset中
    //动态导航栏
    let barListener = new Listener('.container', 0, 'null', {childList: true})
    barListener.init(barListenerInit,barListenerCall)
}

function ajaxHook() {
    ah.proxy(
        {
            onResponse: (response, handler) => {
                //搜索页 例/all?keyword=原神
                if (!response.config.url.includes('/web-interface/search/default') && !response.config.url.includes('/web-interface/search/square') && response.config.url.includes('/web-interface/search')){
                    let responses = [];
                    let data = JSON.parse(response.response).data
                    if(data.result.length == 11){
                        responses.push(data.result[data.result.length-1])
                    }
                    if(data.result.length == 20){
                        let data1 = {
                            data: data.result,
                            result_type: 'video'
                        }
                        responses.push(data1)
                    }
                    if(selectedDuration.date != null){
                        setTimeout(function(){
                            generateApi(selectedDuration,false)
                        },51);
                    }
                    else{
                        initSearchVideoInfo(responses)
                    }
                }
                //热门页面
                if (response.config.url.includes('/web-interface/popular')){
                    setTimeout(function(){
                        initPopularVideoInfo(response.config.url)
                    },51);
                }
                //排行榜
                if (response.config.url.includes('rank')){
                    setTimeout(function(){
                        initRankVideoInfo()
                    },50);
                }
                //首页
                if (response.config.url.includes('web-interface/index/top/rcmd')){
                    setTimeout(function(){
                        homeListenerInit()
                    },50);
                }
                //首页分区
                if (response.config.url.includes('web-interface/dynamic/region')){
                    //游戏区
                    if (response.config.url.includes('rid=4')){
                        setTimeout(function(){
                            initChannel('#bili_report_game')
                            initChannelRank('#bili_report_game')
                        },50);
                    }
                    //汽车区
                    if (response.config.url.includes('rid=223')){
                        setTimeout(function(){
                            initChannel('#bili_report_car')
                            initChannelRank('#bili_report_car')
                        },50);
                    }
                    //科技区
                    if (response.config.url.includes('rid=188')){
                        setTimeout(function(){
                            initChannel('#bili_report_tech')
                            initChannelRank('#bili_report_tech')
                        },50);
                    }
                    //知识区
                    if (response.config.url.includes('rid=36')){
                        setTimeout(function(){
                            initChannel('#bili_report_knowledge')
                            initChannelRank('#bili_report_knowledge')
                        },50);
                    }
                    //电影区
                    if (response.config.url.includes('rid=23')){
                        setTimeout(function(){
                            initChannel('#bili_report_movie')
                            //initChannelRank('#bili_report_movie')
                        },50);
                    }

                }
                //动态
                if (response.config.url.includes('web-dynamic/v1/feed/all')){
                    setTimeout(function(){
                        initPostVideoInfo()
                    },50);

                }
                handler.next(response);
            },
        },
        unsafeWindow
    );

}

//移除所有符号
var symbols = [' ','♂','【','】']

function replaceAllSymbol(title) {
    $.each(symbols,function(i,k){
        if(title.indexOf(k) != -1){
            title = title.replaceAll(k,'')
        }
    })
    return title;
}

//通过url获得BV号
function getBvcountber(video_link) {
    let bvcount = '';
    try {
        bvcount = /\/video\/(?:av|bv)(\w+)/i.exec(video_link)[1];
    } catch (e) {
        bvcount = null;
    }
    return bvcount;
}

//通过名称调用方法
function callFunc(functionName){
    //根据函数名得到函数类型
    var  func=eval(functionName);
    //创建函数对象，并调用
    return new func(arguments[1],arguments[2],arguments[3]);
}

/**
 * 和PHP一样的时间戳格式化函数
 * @param {string} format 格式
 * @param {int} timestamp 要格式化的时间 默认为当前时间
 * @return {string}   格式化的时间字符串
 */
function date(format, timestamp){
    var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
    var pad = function(n, c){
        if((n = n + "").length < c){
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var f = {
        // Day
        d: function(){return pad(f.j(), 2)},
        D: function(){return f.l().substr(0,3)},
        j: function(){return jsdate.getDate()},
        l: function(){return txt_weekdays[f.w()]},
        N: function(){return f.w() + 1},
        S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'},
        w: function(){return jsdate.getDay()},
        z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0},

        // Week
        W: function(){
            var a = f.z(), b = 364 + f.L() - a;
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
                return 1;
            } else{
                if(a <= 2 && nd >= 4 && a >= (6 - nd)){
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime()/1000));
                } else{
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },

        // Month
        F: function(){return txt_months[f.n()]},
        m: function(){return pad(f.n(), 2)},
        M: function(){return f.F().substr(0,3)},
        n: function(){return jsdate.getMonth() + 1},
        t: function(){
            var n;
            if( (n = jsdate.getMonth() + 1) == 2 ){
                return 28 + f.L();
            } else{
                if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
                    return 31;
                } else{
                    return 30;
                }
            }
        },

        // Year
        L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0},
        //o not supported yet
        Y: function(){return jsdate.getFullYear()},
        y: function(){return (jsdate.getFullYear() + "").slice(2)},

        // Time
        a: function(){return jsdate.getHours() > 11 ? "pm" : "am"},
        A: function(){return f.a().toUpperCase()},
        B: function(){
            // peter paul koch:
            var off = (jsdate.getTimezoneOffset() + 60)*60;
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
            var beat = Math.floor(theSeconds/86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length == 1) beat = "00"+beat;
            if ((String(beat)).length == 2) beat = "0"+beat;
            return beat;
        },
        g: function(){return jsdate.getHours() % 12 || 12},
        G: function(){return jsdate.getHours()},
        h: function(){return pad(f.g(), 2)},
        H: function(){return pad(jsdate.getHours(), 2)},
        i: function(){return pad(jsdate.getMinutes(), 2)},
        s: function(){return pad(jsdate.getSeconds(), 2)},
        //u not supported yet

        // Timezone
        //e not supported yet
        //I not supported yet
        O: function(){
            var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
            return t;
        },
        P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))},
        //T not supported yet
        //Z not supported yet

        // Full Date/Time
        c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()},
        //r not supported yet
        U: function(){return Math.round(jsdate.getTime()/1000)}
    };

    var exp = /[\\]?([a-zA-Z])/g;
    return format.replace(exp, function(t, s){
        let ret = null;
        if( t!=s ){
            // escaped
            ret = s;
        } else if( f[s] ){
            // a date function exists
            ret = f[s]();
        } else{
            // nothing special
            ret = s;
        }
        return ret;
    });
}

//检查jQuery
var checkJQuery = function () {
    let jqueryCdns = [
        'http://code.jquery.com/jquery-2.1.4.min.js',
        'https://ajax.aspnetcdn.com/ajax/jquery/jquery-2.1.4.min.js',
        'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js',
        'https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js',
        'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js',
    ];
    function isJQueryValid() {
        try {
            let wd = unsafeWindow;
            if (wd.jQuery && !wd.$) {
                wd.$ = wd.jQuery;
            }
            $();
            return true;
        } catch (exception) {
            return false;
        }
    }
    function insertJQuery(url) {
        setTimeout(function(){
            let checkJQuery = setInterval(function () {
                if(document == undefined && document != null && document.createElement('script') == undefined && document.createElement('script') != null){
                    let script = document.createElement('script');
                    script.src = url;
                    document.head.appendChild(script);
                    return script;
                    clearInterval(checkJQuery);
                }
            }, 100);
        },500);
    }
    function converProtocolIfNeeded(url) {
        let isHttps = location.href.indexOf('https://') != -1;
        let urlIsHttps = url.indexOf('https://') != -1;
        return script;

        if (isHttps && !urlIsHttps) {
            return url.replace('http://', 'https://');
        } else if (!isHttps && urlIsHttps) {
            return url.replace('https://', 'http://');
        }
        return url;
    }
    function waitAndCheckJQuery(cdnIndex, resolve) {
        if (cdnIndex >= jqueryCdns.length) {
            iLog.e('无法加载 JQuery，正在退出。');
            resolve(false);
            return;
        }
        let url = converProtocolIfNeeded(jqueryCdns[cdnIndex]);
        iLog.i('尝试第 ' + (cdnIndex + 1) + ' 个 JQuery CDN：' + url + '。');
        let script = insertJQuery(url);
        setTimeout(function () {
            if (isJQueryValid()) {
                iLog.i('已加载 JQuery。');
                resolve(true);
            } else {
                iLog.w('无法访问。');
                script.remove();
                waitAndCheckJQuery(cdnIndex + 1, resolve);
            }
        }, 100);
    }
    return new Promise(function (resolve) {
        if (isJQueryValid()) {
            iLog.i('已加载 jQuery。');
            resolve(true);
        } else {
            iLog.i('未发现 JQuery，尝试加载。');
            waitAndCheckJQuery(0, resolve);
        }
    });
}

//检查脚本参数
var checkScriptVariate = setInterval(function () {
    tagsBlocker = blockObj.getConfig();
    if(tagsBlocker.tagsArray != null){
        clearInterval(checkScriptVariate);
    }
}, 500);

function ILog() {
    this.prefix = '';

    this.v = function (value) {
        if (level <= this.LogLevel.Verbose) {
            console.log(this.prefix + value);
        }
    }

    this.i = function (info) {
        if (level <= this.LogLevel.Info) {
            console.info(this.prefix + info);
        }
    }

    this.w = function (warning) {
        if (level <= this.LogLevel.Warning) {
            console.warn(this.prefix + warning);
        }
    }

    this.e = function (error) {
        if (level <= this.LogLevel.Error) {
            console.error(this.prefix + error);
        }
    }

    this.d = function (element) {
        if (level <= this.LogLevel.Verbose) {
            console.log(element);
        }
    }

    this.setLogLevel = function (logLevel) {
        level = logLevel;
    }

    this.LogLevel = {
        Verbose: 0,
        Info: 1,
        Warning: 2,
        Error: 3,
    };

    let level = this.LogLevel.Verbose;
}
var inChecking = false;
var matchSuccess = false;
var jqItv = setInterval(function () {
    if (inChecking) {
        return;
    }
    inChecking = true;
    checkJQuery().then(function (isLoad) {
        if (isLoad)
        {

            //视频页
            if (matchVideo && tagsBlocker.functionEnable && !matchSuccess) {
                matchSuccess = true;
                let videoListener = new Listener('.rec-list', 0, 'null', {childList: true})
                videoListener.init(videoListenerInit,videoListenerCall)
                ad1()
            }
            //搜索页
            if (matchSearch && tagsBlocker.functionEnable && !matchSuccess) {
                matchSuccess = true;
                $('div.search-button').click()
                let name = '.v-switcher-header-item';
                let switcher = new Listener(name, 0, 'search', { childList: true , attributes :true })
                switcher.init(switcherListenerInit,switcherListenerCall)
                reSetOption();
            }
            //动态
            if (matchPost && tagsBlocker.functionEnable && !matchSuccess) {
                matchSuccess = true;
                matchTopic()
            }
            //排行榜
            if (matchRank && tagsBlocker.functionEnable && !matchSuccess) {
                matchSuccess = true;
                setTimeout(function(){
                    initRankVideoInfo()
                },50);
            }
            //首页
            if (matchHome && tagsBlocker.functionEnable && !matchSuccess) {
                matchSuccess = true;
                homeListenerInit()

            }
            reSetUI()
            clearInterval(jqItv);
        }
        inChecking = false;
    });
}, 500);
var iLog = new ILog();