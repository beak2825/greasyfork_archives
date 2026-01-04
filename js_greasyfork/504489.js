// ==UserScript==
// @name         编程猫优化
// @namespace    codemao_optimization
// @version      1.7
// @description  优化编程猫
// @author       银河本尊
// @run-at       document-start
// @match        https://*.codemao.cn/*
// @license      MIT
// @grant        none
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/504489/%E7%BC%96%E7%A8%8B%E7%8C%AB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/504489/%E7%BC%96%E7%A8%8B%E7%8C%AB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

var dialog_r = 0

var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

//console.log(unsafeWindow)

async function del_msg(type, offset, type_name) {
    let r=0
    $.ajax({
        method: "get",
        url: "https://api.codemao.cn/web/message-record?query_type=" + type + "&limit=200&offset=" + offset,
        data: document.cookie,
        async: true,
        xhrFields: {
            withCredentials: true,
        },
        success: async function(obj) {r=obj},
        error: async function(obj) {r=-1}
    });
    while(r==0){
        await sleep(100)
        //console.log(r)
    }
    console.log(r)
    if(r==-1){
        return del_msg(type, offset)
    };
    $("#notices").html('正在清理信息'+type_name+'，('+(offset+200)+'/'+r.total+')')
    $("#notices").addClass('c-popup--show')
    let r2=0
    $.ajax({
        method: "get",
        url: 'https://api.codemao.cn/web/message-record/count',
        data: document.cookie,
        async: true,
        xhrFields: {
            withCredentials: true,
        },
        success: async function(obj) {r2=obj},
        error: async function(obj) {r2=-1}
    });
    while(r2==0){
        await sleep(100)
        //console.log(r)
    }
    console.log(r2)
    if(r2==-1){
        return del_msg(type, offset)
    };
    console.log(r2[(query_type.indexOf(type))].count)
    if(r2[(query_type.indexOf(type))].count!=0){
        del_msg(type, offset+200)
    }else{
        $("#notices").removeClass('c-popup--show')
        bconf('提示', '清理信息完成', '关闭', '确定')
        return 1
    }
};

if(window.location.href.includes('message')){
    var query_type=[
        'COMMENT_REPLY',
        'LIKE_FORK',
        'SYSTEM'
    ];
    (async function(){
        //alert('')
        while($('.r-message--nav_cont').length==0){
            await sleep(100)
        }
        await sleep(500)
        $('.r-message--nav_cont').append(`<div id="clean_msg" class="r-message--nav_item"><img src="https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDc1ODczNTc3MTJfY2UwODcxNzk.png" style="height:24px;margin:23px 5px 23px 0px;display:inline_block;vertical-align:top">已读所有<span></span></div>`)
        $('#clean_msg').click(function(){
            if($('.r-message--cur_nav').text()=='评论与回复'){
                del_msg(query_type[0], 0, '评论与回复')
            }else if($('.r-message--cur_nav').text()=='赞与被购买'){
                del_msg(query_type[1], 0, '赞与被购买')
            }else if($('.r-message--cur_nav').text()=='系统消息'){
                del_msg(query_type[2], 0, '系统消息')
            }
        })
    })();
}

function fws_tree(fws_d){
    console.log(fws_d)
    let proc_data = ''
    proc_data += `<div class="fws_text${fws_d.is_published?' fws_publ':(fws_d.is_deleted?' fws_dele':'')}" onclick="${fws_d.is_published?('window.open(\''+fws_d.id+'\')'):('bconf(\'提示\', \'作品未发布\', \'关闭\', \'确定\')')}">${fws_d.name+'('+fws_d.author.nickname+')'}</div>`
    if(fws_d.children.length>0){
        proc_data += `<div class="fws_list">`
        for(let i=0; i<fws_d.children.length; i++){
            proc_data += fws_tree(fws_d.children[i])
        }

        proc_data += `</div>`
    }
    return proc_data
}

async function get_fws(id, dialog=0){
    let r=0
    $.ajax({
        type: "GET",
        url: `https://api.codemao.cn/tiger/work/tree/${id}`,
        async: true,
        //binary: true,
        xhrFields: {
            withCredentials: true,
        },
        success: function (obj) {
            r=obj
        },
        error: function (res){
            r=null

        },
    });
    while(r==0){
        await sleep(100)
    }
    if(!r){
        if(dialog){
            baler('错误', 'API接口回调数据异常', '确定')
        }
        return -1
    }
    fws=r
    console.log(fws)
    let r2=0
    $.ajax({
        type: "GET",
        url: `https://api.codemao.cn/creation-tools/v1/works/${r.id}`,
        async: true,
        binary: true,
        xhrFields: {
            withCredentials: true,
        },
        success: function (obj) {
            r2=obj
        },
        error: function (res){
            r2=-1
        },
    });
    while(r2==0){
        await sleep(100)
    }
    fw_info=r2
    console.log(fw_info)
    return r2
}

if(window.location.href.includes('work/')){
    var fw_info=0
    var fws=0;
    (async function(){
        let view_forks
        while($('.r-work-c-work_interaction--labels_container').length==0){
            await sleep(100)
        }
        await sleep(500)
        view_forks=document.querySelectorAll('.r-work-c-work_interaction--label')
        //console.log(view_forks)
        let view_fork
        for(let i=0; i<view_forks.length; i++){
            view_fork=view_forks[i];
            console.log('for '+i)
            console.log(view_fork)
            if(view_fork.innerHTML=='再创作'){
                //view_fork=view_forks[i];
                console.log('select')
                break
            }else{
                view_fork=0
            }
        }
        if(view_fork){
            view_fork.classList.add('view_fork')
            view_fork.innerHTML=`<img src='https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF81NTAzNzFfMTcwNzMzNjU0NTQxM19iZjA5MzZlMw.png' style='height: 28px; margin-top: -3px; margin-left: -4px;'>查看原作品`;
            await get_fws(window.location.href.split("/")[4])
            if(fw_info!=-1){
                view_fork.innerHTML=`<img src='https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF81NTAzNzFfMTcwNzMzNjU0NTQxM19iZjA5MzZlMw.png' style='height: 28px; margin-top: -3px; margin-left: -4px;'>${fw_info.user_info.nickname}`
            }
            console.log(view_fork)
            view_fork.onclick=async function(){
                if(fw_info!=-1){
                    if(await baler('原作品', `
<div class="event_target data_report" style="width: 450px !important"><div class="c-work_item--work_item" onclick="window.open('/work/${fw_info.id}')" style="width:450px;margin:0px"><div class="c-work_item--work_cover" style="background-image: url(${fw_info.preview});"></div><div class="c-work_item--work_detail"><p class="c-work_item--name">${fw_info.work_name}</p><p class="c-work_item--datas"><span class="c-work_item--data_span"><i class="c-work_item--icon_view"></i>${fw_info.view_times}</span><span class="c-work_item--data_span"><i class="c-work_item--icon_prise"></i>${fw_info.praise_times}</span></p><p class="c-work_item--author"><img src="${fw_info.user_info.avatar}" alt="" class="c-work_item--author_head"><span class="c-work_item--author_name" onclick="window.open('/user/${fw_info.user_info.id}')">${fw_info.user_info.nickname}</span></p></div></div></div>
                `, '再创作族谱')==2){
                        baler('再创作族谱', fws_tree(fws), '确定')
                    }
                }else{
                    await get_fws(window.location.href.split("/")[4], 1)
                }
            }
        }else{
            try{
            await get_fws(window.location.href.split("/")[4]);
            $('.r-work-c-work_interaction--labels_container').append(`<span class="r-work-c-work_interaction--label" id="view_fork"><img src='https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF81NTAzNzFfMTcwNzMzNjU0NTQxM19iZjA5MzZlMw.png' style='height: 28px; margin-top: -3px; margin-left: -4px;'>再创作族谱</span>`)
            $('#view_fork').click(async function(){

                if(fws){
                    baler('再创作族谱', fws_tree(fws), '确定')
                }else{
                    await get_fws(window.location.href.split("/")[4], 1)
                }
            })
            console.log('not_fork')}catch(e){console.error(e)}

        }
    })();
}

let dang_elem_count = 0
setInterval(function(){
    let dangers = $('iframe, embed')
    if(dangers){
        //console.log(dangers)
        for(let i=0; i<dangers.length; i++){
            let danger = dangers[i]
            //console.log(danger)
            if(danger.id!='react-tinymce-0_ifr'&&danger.id!='player_cover'){//不是评论区的富文本编辑器也不是作品播放器
                danger.before('[由实时防护拦截]');
                danger.remove();
                    console.log('removed');
                console.log(danger)
                dang_elem_count++
                console.log(dang_elem_count)
                $('#confirm').remove()
                bconf('实时防护', `拦截了${dang_elem_count}个元素`, '关闭', '确定')
            }
        }
    }
    //$('iframe').remove()
    //$('embed').remove()
},1)

if(window.location.href.includes('community')||window.location.href.includes('wiki/forum')){

window.o_open = window.open

window.open = async function(url){
    console.log('opening '+url)
    if ((url.includes("community") || url.includes("wiki/forum")) &&     (parseInt(url.split("/")[2]) || parseInt(url.split("/")[3]))) {
        let id = "";
        if (url.includes("community")) {
            id = url.split("/")[2];
        } else {
            id = url.split("/")[3];
        }
        // console.log(id);
        $.ajax({
            type: "GET",
            url: `https://api.codemao.cn/web/forums/posts/${id}/details`,
            contentType: "application/json;charset=UTF-8",
            async: true,
            xhrFields: {
                withCredentials: true,
            },
            success: async function (obj) {
                if((obj.content).includes('iframe')||(obj.content).includes('embed')){
                    if((await bconf('此帖子可能存在风险！', '可能包括但不限于盗号等', '继续(不推荐)', '关闭'))==1){window.o_open(url)}
                }else{
                    window.o_open(url)
                }
            },
            error: function (res){
                bconf('获取帖子信息失败', '请检查网络链接', '关闭', '确定')
                console.log(res)
            },
        });
    } else {
        // console.log("catched go");
        return window.o_open(url);
    }
    //alert(url)
    //bconf()
}
}

create_css()

$('.c-navigator--navigator').ready(function(){
    setInterval(function(){
        $('.c-navigator--navigator').attr('style', '');
        $('.c-navigator--navigator').attr('style', 'width: '+window.innerWidth+'px !important;');
        //console.log($('.c-navigator--navigator').width())
    }, 500)
})

window.bconf = async function(header='提示', content='content', cancel='取消', confirm='确认'){
    $('.c-dialog--dialog_wrap').after('<div class="c-dialog--dialog_wrap" id="confirm"><div class="c-dialog--dialog_cover"></div><div class="c-dialog--content_box"><div></div></div></div>')
    $('#confirm').html(`<div class="c-dialog--dialog_cover"></div><div class="c-dialog--content_box"><div class="c-dialog-c-confirm_box_center--dialog"><div class="c-dialog-c-confirm_box_center--title">${header}</div><div class="c-dialog-c-confirm_box_center--content">${content}</div><div class="c-dialog-c-confirm_box_center--btns"><a class="c-dialog-c-confirm_box_center--cancel">${cancel}</a><a class="c-dialog-c-confirm_box_center--confirm">${confirm}</a></div></div></div>`)
    document.querySelector('#confirm').offsetHeight
    $('#confirm').addClass('c-dialog--visiable').addClass('c-dialog--show')
    dialog_r = 0
    $('#confirm .c-dialog--content_box .c-dialog-c-confirm_box_center--btns .c-dialog-c-confirm_box_center--confirm').click(function(){dialog_r=2})
    $('#confirm .c-dialog--content_box .c-dialog-c-confirm_box_center--btns .c-dialog-c-confirm_box_center--cancel').click(function(){dialog_r=1})
    while(dialog_r==0){
        await sleep(100)
        //console.log(dialog_r)
    }
    $('#confirm').removeClass('c-dialog--visiable')
    await sleep(300)
    $('#confirm').remove()
    return dialog_r
}

window.baler = async function(header='提示', content='content', confirm='确认'){
    $('.r-work--comment_container .c-model_box--dialog_cover').after(`<div class="c-model_box--content_wrap" id="balert"><div class="c-model_box--content_box"><div class="c-model_box--title"><span>${header}</span></div><a class="c-model_box--close c-model_box--bind_phone_close"><i></i></a><div class="r-work-c-comment_area-c-report_comment--container"><div class="r-work-c-comment_area-c-report_comment--label_group">${content}</div></div><div class="r-work-c-comment_area-c-report_comment--bottom_options"><a class="r-work-c-comment_area-c-report_comment--option">${confirm}</a></div></div></div>`)
    document.querySelector('#balert').offsetHeight
    $('.r-work-c-comment_area--comment_container .c-model_box--dialog_wrap').addClass('c-model_box--show').addClass('c-model_box--visiable')
    dialog_r = 0
    $('#balert .c-model_box--content_box .c-model_box--close').click(function(){dialog_r=1})
    $('#balert .c-model_box--content_box .r-work-c-comment_area-c-report_comment--bottom_options .r-work-c-comment_area-c-report_comment--option').click(function(){dialog_r=2})
    while(dialog_r==0){
        await sleep(100)
        //console.log(dialog_r)
    }
    $('.r-work-c-comment_area--comment_container .c-model_box--dialog_wrap').removeClass('c-model_box--visiable').removeClass('c-model_box--show')
    await sleep(300)
    $('#balert').remove()
    return dialog_r
}

function create_css() {
$("head").append(`
<style>
/*主题色*/
.c-navigator--navigator,
.c-navigator--header-content,
.r-community--send_btn,
.r-community-r-detail--send_btn,
.r-community-r-detail-c-comment_reply--reply_send a,
.r-community-r-detail--add_reply,
.c-pagination--btn.c-pagination--page-container .c-pagination--activePage,
.r-community--forum_filter .r-community--filter_tab.r-community--active span,
.line,
.r-discover-c-tagList--select,
.r-message--nav_item.r-message--cur_nav:after,
.r-work-c-comment_area--comment_btn,
.r-work-c-comment_area-c-comment_reply--reply_send a,
.c-dialog-c-confirm_box_center--confirm,
.view_fork,
.r-work-c-comment_area-c-report_comment--item_point i,
.r-work-c-comment_area-c-report_comment--option,
.r-community-r-detail-c-report_comment--item_point i,
.r-community-r-detail-c-report_comment--option{
    background-color: rgb(41, 126, 255) !important;
}
/*主题色边框*/
.c-pagination--btn.c-pagination--page-container .c-pagination--activePage,
.r-community-r-detail-c-comment_reply--reply_editor:focus,
.r-community-r-detail-c-comment_reply--reply_btn:hover,
.r-community--filter_tab,
.r-community--forum_filter .r-community--filter_tab.r-community--active span,
.r-discover-c-tagList--select,
.r-discover-c-tagList--sort_item:hover,
.r-work-c-comment_area-c-comment_editor--editor:focus,
.r-work-c-comment_area-c-comment_reply--reply_editor:focus,
.r-work-c-comment_area-c-comment_reply--reply_send a,
.c-dialog-c-confirm_box_center--confirm,
.c-dialog-c-confirm_box_center--cancel:hover,
.r-work-c-comment_area-c-report_comment--label_item:hover .r-work-c-comment_area-c-report_comment--item_point,
.r-work-c-comment_area-c-report_comment--select,
.r-community-r-detail-c-report_comment--label_item:hover .r-community-r-detail-c-report_comment--item_point,
.r-community-r-detail-c-report_comment--select,
#view_fork:hover{
    border-color: rgb(41, 126, 255) !important;
}
/*主题色文本*/
.r-community--active,
.r-community--forum_filter,
.r-community--filter_tab:hover,
.r-community-r-detail-c-comment_reply--reply_btn:hover,
.loading_container,
.c-post_list--has_reply,
.r-discover--active,
.r-discover--switch-box li:hover,
.r-discover-c-tagList--sort_item:not(.r-discover-c-tagList--select):hover,
.r-discover-c-banner--item p:hover,
.r-message--cur_nav,
.r-message--nav_item:hover,
.r-message-c-comments--work_name,
.r-message-c-buy--work_name,
.r-message-c-system_message--work_name,
.r-work-c-comment_area-c-comment_item--active,
.r-work-c-comment_area-c-comment_item--active i,
.r-work-c-comment_area-c-comment_item--active span,
.r-work-c-comment_area-c-comment_reply--active,
.r-work-c-comment_area-c-comment_reply--active i,
.r-work-c-comment_area-c-comment_reply--active span,
.r-community-r-detail-c-comment_item--active,
.r-community-r-detail-c-comment_item--active i,
.r-community-r-detail-c-comment_item--active span,
.r-community-r-detail-c-comment_reply--active,
.r-community-r-detail-c-comment_reply--active i,
.r-community-r-detail-c-comment_reply--active span,
.c-post_list--post_title h3:hover,
.c-post_list--post_header span:hover,
.r-community-r-detail--author_link,
.r-community-r-detail-c-comment_item--author_link,
.r-community-r-detail-c-comment_reply--author_link,
.c-dialog-c-confirm_box_center--cancel:hover,
#view_fork:hover{
    color: rgb(41, 126, 255) !important;
}
/*高亮色*/
.c-navigator--selected,
.c-navigator--header-content .c-navigator--nav_wrap .c-navigator--item:hover,
.c-navigator--message_wrap:hover,
.c-navigator--avatar_wrap:hover,
.r-community--send_btn:hover,
.view_fork:hover{
    background-color: #1b70f2 !important;
}
/*高亮色2*/
.c-post_list--has_reply{
    background-color: rgb(219, 234, 255) !important;
}
/*白色*/
.view_fork{
    color: white !important;
}
/*黑色*/
.c-model_box--close i{
    color: black !important;
}
/*创作标签*/
.c-navigator--ide_link{
    background-color: rgb(66, 214, 101) !important;
}
/*再创作标签*/
/*.view_fork{
    background-color: #FFBB10 !important
}*/
/*fork_work_card*/

.fws_list {
    font-size: 20px;
    min-height: 20px;
    margin: 0px 0px 0px 20px;
    border-left: #aaaaaa 2px solid
}

.fws_text {
    font-size: 15px;
    height: 15px;
    line-height: 15px;
    margin: 2.5px 0px 2.5px 20px;
    overflow: hidden;
}

.fws_text:hover{
    color: rgb(41, 126, 255);
}

.fws_publ{
    border-left:rgb(66, 214, 101) 20px solid;
    padding-left: 2px;
    margin: 2.5px 0px 2.5px -2px;
}
.fws_dele{
    border-left:#aaaaaa 20px solid;
    padding-left: 2px;
    margin: 2.5px 0px 2.5px -2px;
}
/*kn公测*/
.c-navigator--kn_wrap{
    background-color: rgb(41, 169, 255) !important;
}
/*kn:hover*/
.c-navigator--kn_wrap:hover{
    background-color: rgb(27, 156, 242) !important;
}
/*弹窗*/
.c-popup--msg_cont{
    background-color: rgba(255, 255, 255, 0.6) !important;
    color: black !important;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 10px !important;
}
/*弹窗2背景*/
.c-dialog--show,
.c-model_box--show .c-model_box--content_wrap{
    background-color: rgba(0, 0, 0, 0.1) !important;
    color: black !important;
    backdrop-filter: blur(10px);
    border-radius: 10px !important;
    width: 100% !important;
}
/*圆角+阴影*/
.r-community--bulletin_container,
.r-community--notic_container,
.r-community--content_container,
.r-community--search_container,
.r-community-r-detail-c-comment_reply--reply_container,
.r-work--work_detail_container,
.r-work-c-author_info--author_info_card,
.r-work-c-work_info--container,
.r-work-c-work_container--work_list,
.r-work-c-comment_area-c-comment_reply--reply_container,
.r-user-c-slide-panel--top,
.r-user-c-slide-panel--middle,
.r-user-c-button-panel--bottom,
.r-user-c-body--body,
.c-dialog--content_box,
.r-discover--work-item,
.c-model_box--content_box{
    border-radius: 10px !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3) !important;
    overflow: hidden;
    transition: 0.3s all !important;
}
/*仅圆角*/
.c-navigator--header-content .c-navigator--nav_wrap .c-navigator--item:not(.c-navigator--selected):hover,
.c-navigator--message_wrap:hover,
.c-navigator--avatar_wrap:hover,
.c-navigator--ide_link:hover{
    border-radius: 10px !important;
}
/*上方圆角*/
.r-work-c-author_info--author_info_card{
    border-radius: 10px 10px 0 0 !important;
}
/*下方圆角*/
.c-navigator--navigator,
.r-work-c-work_info--container,
.c-navigator--dropdown,
.c-navigator--dropdown-wrap,
.c-navigator--drop_down .c-navigator--cont{
    border-radius: 0 0 10px 10px !important;
}
/*仅阴影*/
.c-navigator--dropdown,
.c-navigator--dropdown-wrap,
.c-navigator--drop_down .c-navigator--cont{
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3) !important;
}
/*标题修复*/
.c-model_box--content_wrap,
.r-community--container{
    /*overflow: hidden; */
}
.r-community--middle_content_container{
    /*padding-left: 20px !important;
    padding-right: 20px !important; */
}
.r-community--search_container{
    /*margin-right: 20px !important;*/
}
.c-navigator--navigator{
    /*position:  !important;*/
    /*left: auto !important;
    right: auto !important; */
    /*width: 100vw !important;*/
}
body{
    /*width: 1500px;*/
}
/*外边框*/
.r-community-r-detail-c-comment_item--comment_item{
}
/*动画时间*/
.c-post_list--post_body:hover,
.c-navigator--message_wrap,
.c-navigator--avatar_wrap,
.c-navigator--ide_link,
.c-dialog--dialog_wrap,
.c-model_box--dialog_wrap,
.c-model_box--dialog_wrap .c-model_box--dialog_cover,
.c-model_box--dialog_wrap .c-model_box--content_wrap,
.view_fork,
#view_fork{
    transition: 0.3s !important;
}
/*下拉菜单*/
.c-navigator--second_nav .c-navigator--dropdown{
    width: 120px !important;
}
/*防沉迷背景*/
.c-virtual_player--toast_container{
    backdrop-filter: blur(0px) !important;
}
/*kn样式*/
.ant-layout-header,
.Sidebar_wrapper__kaX81,
.ScreenBar_active__ebRM1{
    background-color: rgb(41, 126, 255) !important;
    background-image: none !important;
}
.ant-input,
.FileManagement_fileManagerWrapper__g14oG:hover,
.Setting_settingWrapper__LHc0B:hover,
.FileManagement_active__fs9l6,
.Setting_active__O61te{
    background-color: #1b70f2 !important;
}
.ant-btn/* .IconFont_wrapper__FPeRA svg use*/{
    /*display: none;*/
    width: 16.75px !important;
    padding: 0px !important;
    border: none !important;
}
.ant-btn .IconFont_wrapper__FPeRA svg use{
    display: none;
    width: 0px;
}
.FileManagement_fileManagerWrapper__g14oG i svg,
.Setting_settingWrapper__LHc0B i svg{
    color: white !important;
}
/*.pc_imageContainerWrapper__2A3rK,
.pc_imageWrapper__YT3Sz,
.SpriteList_item__dq-hN,
.SpriteList_wrapper__Yvi-q{
    background-color: #8db8f9 !important;
}*/
</style>
`)
}
