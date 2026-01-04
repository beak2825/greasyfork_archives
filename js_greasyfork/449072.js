// ==UserScript==
// @name         MatchedVideosOfBili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  To find the matched videos posted by followings
// @author       Ouphi
// @match        https://search.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MPL
// @downloadURL https://update.greasyfork.org/scripts/449072/MatchedVideosOfBili.user.js
// @updateURL https://update.greasyfork.org/scripts/449072/MatchedVideosOfBili.meta.js
// ==/UserScript==

var cnt = 0

// 读取预处理好的关注列表文件（内容为uid）
var href = "https://space.bilibili.com/208259"
var iframe
var dm
var uids
var videos_target
var videos_src
var author_name_src
var n_pages_src
var btn_next_src
var btn_next_target

// 主页面翻页时的临时信息
var saved = 0
var saved_up_i
var saved_page_i
var saved_source_i
var saved_target_page
var saved_video_target_href

// 子页面翻页时的临时信息
var saved_video_src_href

init()


function init(){
    // 等待主页面加载完成
    if(checkElement(document, 'class', "vui_tabs--nav vui_tabs--nav-pl0") == null){
        setTimeout(function(){init()}, 100)
        return
    }
    console.log('1  ----    加载成功')

    // 添加子网页，读取关注列表
    run_init(0, 1, document, 'class', "header-entry-avatar")
}

// flag=0代表需要继续等待，其他数字代表继续，
function run_init(flag, next_flag, element = null, method = null, text = null) {
    // 限制访问次数，在连续搜索不到内容时，由于不同up的页面加载、run0的增加，会触发边界
    cnt++
    if(cnt >= 2000){ return }
    
    console.log('1  ----    flag, next_flag :   ' +  flag + "," + next_flag)
    
    // 每隔0.1s判断一次加载进度
    if(flag == 0){
        if(checkElement(element, method, text) == null){
            if(next_flag == 2 || next_flag == 6 || next_flag == 8){
            // 需要访问子页面的flag
                // 不能直接传之前的document，只能动态更新
                dm = document.getElementById('child-iframe').contentDocument
                setTimeout(function(){run_init(0, next_flag, dm, method, text)}, 100)
            }
            else
            // 需要访问主页面的flag
                setTimeout(function(){run_init(0, next_flag, element, method, text)}, 100)
        }
        else{
            run_init(next_flag, next_flag, element, method, text)     
        }
    }

    // 第一段，得到当前用户uid，创建follow page
    if(flag == 1){
        run1GetAndFixPage()
        if(saved == 0)
            run_init(0, 2, dm, 'id', "download-following-list-button")
        else
            run_init(0, 11, window.document, 'class', "vui_button--active-blue")
    }
    
    // 第二段，点击download按钮，等待follow page的信息
    if(flag == 2){
        run2ClickDownButton()
        run_init(0, 3, dm, 'id', "following-list-text")
    }

    // 第三段，得到following list信息
    if(flag == 3){
        run3GetFollowingUids()
        run_init(0, 4, window.document, 'class', "bili-video-card__wrap __scale-wrap")
        
    }

    // 第四段，得到主页面的视频列表
    if(flag == 4){
        run4GetTargetVideos()
        if(saved == 1) fixBannerTarget()
        if(saved == 1) run_continue()
    }

    // 第十一段，判断主页面加载完成
    if(flag == 11){
        if(run11CheckVideosTarget() == 1){
            setTimeout(function(){run_init(0, 11, window.document, 'class', "vui_button--active-blue")}, 100)
        }
        else{
            run_init(0, 4, window.document, 'class', "bili-video-card__wrap __scale-wrap")
        }

    }
}

function run_continue(){
    // init后主页面加载完成，save前子页面加载完成，所以可以直接用
    run_search(10, 10, document, '', '', 0, saved_up_i, saved_page_i, saved_source_i)
}


// flag=0代表需要继续等待，其他数字代表继续，
function run_search(flag, next_flag, element = null, method = null, text = null, target_i = 0, up_i = 0, page_i = 0, source_i = 0) {
    cnt++
    if(cnt >= 2000){ return }

    var result
    
    console.log('1  ----    flag, next_flag :   ' +  flag + "," + next_flag)
    console.log('1  ----    target_i, up_i, page_i, source_i   :   ' + target_i + "," + up_i + "," + page_i + "," + source_i)

        // 上条需要等待加载完成后再读取
    // window.onload只能识别header条，不识别内容加载程度
    // 每隔0.1s判断一次加载进度
    if(flag == 0){
        if(checkElement(element, method, text) == null){
            // 带参数的需要写在函数内，不然会出错
            if(next_flag == 2 || next_flag == 6 || next_flag == 8){
                // 不能直接访问document，只能通过传值
                dm = document.getElementById('child-iframe').contentDocument
                setTimeout(function(){run_search(0, next_flag, dm, method, text, target_i, up_i, page_i, source_i)}, 100)
            }
            else{
                setTimeout(function(){run_search(0, next_flag, element, method, text, target_i, up_i, page_i, source_i)}, 100)
            }
        }
        else{
            run_search(next_flag, next_flag, element, method, text, target_i, up_i, page_i, source_i)     
        }
    }

    // 第五段，判断并跳转到每个up主的视频页，等待读取
    if(flag == 5){
        if(run5ReloadChildPage(up_i) == 0)
            run_search(0, 6, dm, 'id', "submit-video-type-filter", target_i, up_i, 0, 0)
    }

    // 读取当前up主信息
    if(flag == 6){
        result = run6GetUpVideosInfo(up_i)
        if(result == 0) // 判断成功，继续运行
            run_search(8, 8, dm, 'class', "small-item fakeDanmu-item", target_i, up_i, 0, 0)
        else if(result == 1) // 等待当前页面加载
            setTimeout(function(){run_search(0, 6, dm, 'id', "submit-video-type-filter", target_i, up_i, 0, 0)}, 100)
        else if(result == 2) // 搜索内容为空，结束当前up主
            run_search(5, 5, element, method, text, target_i, up_i+1, 0, 0)
    }

    // 第七段，判断并跳转到当前up主的下一页，等待读取
    if(flag == 7){
        // TODO: 冗余判断
        if(run7ClickNextPage(page_i) == 1){ // 页数读取完成，结束当前up主
            run_search(5, 5, element, method, text, target_i, up_i + 1, 0, 0)
        }else{ // 读取下一页
            run_search(0, 8, dm, 'class', "small-item fakeDanmu-item", target_i, up_i, page_i, 0)
        }
    }


    // 考虑是空的情况啊啊啊
    // 第六段，读取当前页面的视频列表
    if(flag == 8){
        var result = run8GetSrcVideos(up_i)
        if(result == 1)
            setTimeout(function(){run_search(8, 8, dm, 'class', "small-item fakeDanmu-item", target_i, up_i, page_i, 0)}, 100)
        else
            run_search(9, 9, element, method, text, target_i, up_i, page_i, 0)
    }

    // 第七段，判断结束条件
    if(flag == 9){
        var result = run9checkBoundary(target_i, up_i, page_i, source_i)
        if(result == 0) // 判断成功，继续运行
            run_search(10, 10, element, method, text, target_i, up_i, page_i, source_i)
        else if(result == 2) // 结束当前up主
            run_search(5, 5, element, method, text, target_i, up_i+1, 0, 0)
        else if(result == 3) // 结束当前页面
            run_search(7, 7, element, method, text, target_i, up_i, page_i + 1, 0)
    }

    // 第八段，循环
    if(flag == 10){
        run10ReplaceSingleVideo(target_i, up_i, source_i)
        run_search(9, 9, element, method, text, target_i+1, up_i, page_i, source_i+1)
    }

}


/***
 * 运行流程相关函数
 ***/

// 1.得到页面信息，并添加子页面
function run1GetAndFixPage(){
    // 得到用户uid
    href = checkElement(document, 'class', "header-entry-avatar")[0].attributes['href'].nodeValue
    var patt = /.+\/([0-9]+).*/
    var uid = regGroup(patt, href)
    console.log('1  ----    flag1   ' + '当前用户：' + '\r' + uid)

    // 初次访问
    if(saved == 0){
        // 创建关注页面
        /********* 如果需要设置分组，请确保分组内有人，可以修改这里的后缀?tagid=xxx ************ */
        var src = "https://space.bilibili.com/"+ uid + "/fans/follow"
        addChildIframe(src)
    }
}

// 2.点击下载按钮
function run2ClickDownButton(){
    // 不再重复下载
    var btn_down = checkElement(dm, 'id', "download-following-list-button")
    btn_down.click()
}

// 3.获取关注列表信息
function run3GetFollowingUids(){
    var t_uids = checkElement(dm, 'id', "following-list-text").textContent
    uids = t_uids.split('\n')
    // 校验内容是否读取正确
    if((uids.length - 1).toString() != uids[0]){
        console.log('1  ----    flag3   uid wrong\n')
    }
    else
        uids.shift()

    // 预处理结束，增加筛选关注up主视频的按钮
    addFollowLi()
}

// 4.获取目的视频列表（主页面）
function run4GetTargetVideos(){
    var main_target = checkElement(window.document, 'class', "video-list row")[0]
    videos_target = checkElement(main_target, 'class', "bili-video-card__wrap __scale-wrap")
    videos_target = selectNotHideElement(videos_target)
}

// 5.将子页面设为当前up主的搜索页面，重新加载
function run5ReloadChildPage(i){
    // 判断结束条件
    if(i >= uids.length){
        endButton(btn_next_target)
        console.log('1  ----    flag5   ' + "The End：全部up主的视频读取完毕")
        return 1
    }

    var patt = /.+keyword=([^&/]+).*/
    var word = regGroup(patt, window.location.href)
    console.log('1  ----    flag5   ' + '搜索词：' + '\r' + word)

    var src = 'https://space.bilibili.com/' + uids[i] + '/search/video?keyword=' + word
    iframe.remove()
    addChildIframe(src)
    return 0
}

// 6.当前up主的初始信息
function run6GetUpVideosInfo(up_i){
    // 双重检验，确保加载成功
    // TODO:由于remove重进了，可以不加这层判断
    var src_videos_text_2 = dm.getElementsByClassName('v-search-count')[0].textContent
    console.log('1  ----    flag6   ' + "当前up匹配的视频数2-", src_videos_text_2)

    var src_videos_text = dm.getElementById('submit-video-type-filter').children[0].children[0].textContent
    console.log('1  ----    flag6   ' + "当前up匹配的视频数--", src_videos_text)
    
    if(src_videos_text_2 != src_videos_text || isNaN(src_videos_text_2) ||isNaN(src_videos_text)){
        return 1
    }else if(src_videos_text == '0'){
        return 2
    }
    
    var t_pages = dm.getElementsByClassName("be-pager-total")[0].textContent
    n_pages_src = regGroup(/.+([0-9]+).+/, t_pages)
    console.log('2  ----    ' + '当前up总页数:' + '   ' + n_pages_src)

    if(n_pages_src == '0'){
        return 2
    }

    // 再检验，确保加载为新up
    dm = document.getElementById('child-iframe').contentDocument
    if(dm == null){return 1}

    href = dm.getElementsByClassName('text router-link-exact-active router-link-active')[0].attributes['href'].nodeValue
    btn_next_src = dm.getElementsByClassName('be-pager-next')[0]
    var patt = /.*\/([0-9]+)\/.*/
    var uid = regGroup(patt, href)
    if(uid != uids[up_i]){return 1}

    return 0
}

// 当前up主的下一页
function run7ClickNextPage(page_i){
    if(page_i >= n_pages_src) return 1
    
    btn_next_src.click()
    return 0
}

// 8.获取源视频列表（子页面）
function run8GetSrcVideos(i){
    // 获取源视频列表
    videos_src = checkElement(dm, 'class', "small-item fakeDanmu-item")

    var e_video_href = checkElement(videos_src[0], 'class', "title")
    if(e_video_href == null)
        return 1

    var video_src_href = e_video_href[0].attributes['href'].nodeValue
    if(saved_video_src_href == video_src_href)
        return 1

    author_name_src = dm.getElementById('h-name')   
    return 0 
}

// 9.判断越界情况
function run9checkBoundary(target_i, up_i, page_i, source_i){
    console.log('1  ----    flag9   ' + "target--" + videos_target.length + ":" + target_i + "              source" + up_i +"-" + page_i + "--" + videos_src.length + ":" + source_i)

    if(page_i >= n_pages_src){
        console.log('1  ----    flag9   ' + "Mid：当前up主的所有页面读取完毕")
        return 2
    }

    if(source_i >= videos_src.length){
        console.log('1  ----    flag9   ' + "Mid：当前up主的当前页面读取完毕")
        return 3
    }

    if(target_i >= videos_target.length){
        saveTargrtInfo(up_i, page_i, source_i)
        btn_next_target.style.display = 'block'
        console.log('1  ----    flag9   ' + "当前主页面加载完成")
        return 1
    }

    return 0

}

// 10.替换单个视频内容
function run10ReplaceSingleVideo(target_i , i, source_i){
    console.log('1  ----    flag10   ' + "target--" + videos_target.length + ":" + target_i + "              source" + i + "--" + videos_src.length + ":" + source_i)

    var video_src           =   videos_src[source_i]
    var img_src             =   video_src.children[0].getElementsByTagName('img')[0]
    var title_src           =   video_src.getElementsByClassName('title')[0]
    var banner_time_src     =   video_src.getElementsByClassName('time')[0]
    var banner_duration_src =   video_src.getElementsByClassName('length')[0]
    var banner_playback_src =   video_src.getElementsByClassName('play')[0]        
    
    var video_target            =   videos_target[target_i]
    var img_target              =   video_target.children[0].getElementsByTagName('img')[0]
    var img_source_target       =   video_target.children[0].getElementsByTagName('source')[0]
    var title_target            =   video_target.children[1].getElementsByTagName('a')[0]
    var author_link_target      =   video_target.getElementsByClassName('bili-video-card__info--owner')[0]
    var author_name_target      =   video_target.getElementsByClassName('bili-video-card__info--author')[0]
    var banner_time_target      =   video_target.getElementsByClassName('bili-video-card__info--date')[0]
    var banner_duration_target  =   video_target.getElementsByClassName('bili-video-card__stats__duration')[0]
    var banner_playback_target  =   video_target.getElementsByClassName('bili-video-card__stats--item')[0].getElementsByTagName('span')[0]
    var banner_barage_target    =   video_target.getElementsByClassName('bili-video-card__stats--item')[1]
    var player_target           =   video_target.getElementsByClassName('v-inline-player')[0]
    var later_target            =   video_target.getElementsByClassName('bili-watch-later')[0]

    img_target.parentElement.replaceChild(img_src, img_target)
    video_target.children[0].href = title_src.href
    author_link_target.href = iframe.src
    author_name_target.textContent = author_name_src.textContent
    img_source_target.srcset = img_src.src
    title_target.parentElement.replaceChild(title_src, title_target)
    banner_playback_target.textContent = banner_playback_src.textContent
    banner_duration_target.textContent = banner_duration_src.textContent
    banner_time_target.textContent = banner_time_src.textContent
    player_target.style.display = 'none'
    later_target.style.display = 'none'
    banner_barage_target.style.display = 'none'
}

// 11.当前页面的信息
function run11CheckVideosTarget(){
    // 双重检验，确保加载成功
    var target_page = window.document.getElementsByClassName('vui_button--active-blue')[0].textContent
    if(target_page == saved_target_page)
        return 1

    var main_target = checkElement(window.document, 'class', "video-list row")[0]
    var video_target = checkElement(main_target, 'class', "bili-video-card__wrap __scale-wrap")[0]
    var video_target_href = video_target.children[0].attributes['href'].nodeValue
    if(saved_video_target_href == video_target_href)
        return 1

    var video_later = checkElement(video_target, 'class', 'bili-watch-later')
    if(video_later == null)
        return 1

    return 0
}
/****
 * 关注按钮相关函数
 *****/

// 增加按钮到搜索栏末尾
 function addFollowLi(){
    var ul = document.getElementsByClassName("vui_tabs--nav vui_tabs--nav-pl0")[0]
    const li = ul.getElementsByClassName("vui_tabs--nav-item")[0]

    var follow_li= li.cloneNode(true)
    follow_li.getElementsByClassName("vui_tabs--nav-text")[0].innerText = "关注"
    follow_li.attributes['class'].nodeValue = "vui_tabs--nav-item"
    follow_li.id = 'follow_btn'
    follow_li.onclick = function(){clickFollowLi(follow_li)}
    ul.appendChild(follow_li)
}

// 选择搜索关注内容，关注的元素内容修改
function clickFollowLi(follow_li){
    // 更改活跃显示
    var active_li = document.getElementsByClassName("vui_tabs--nav-item-active")[0]
    active_li.attributes['class'].nodeValue = "vui_tabs--nav-item"
    follow_li.attributes['class'].nodeValue = "vui_tabs--nav-item vui_tabs--nav-item-active"

    fixBannerTarget()

    // 开始搜索并取代原内容
    run_search(5, 5, document, '', '', 0, 0, 0, 0)
}

function endButton(btn){
    console.log(btn)
    btn.style.display = 'block'
    btn.textContent = "结束"
    btn.disabled = true
}

/****
 * 元素处理函数
 *****/

// 得到关注页面，以及各up主的搜索页面
 function addChildIframe(src){
    var e_parent_iframe = document.body
    iframe = document.createElement('iframe')
    iframe.src = src
    iframe.style.width = '500px'
    iframe.style.height = '500px'
    e_parent_iframe.appendChild(iframe, e_parent_iframe)
    iframe.id = 'child-iframe'
    dm = iframe.contentDocument
}

// 筛选未隐藏的视频
function selectNotHideElement(list){
    var result = new Array()
    for( var i = 0; i < list.length; ++i){
        // 这里使用函数，所以不需要nodeValue
        if(list[i].parentElement.parentElement.getAttribute('class').indexOf("to_hide_xs") == -1){
            result.push(list[i])
        }
    }
    return result
}

function clickNextButtonTarget(btn){
    btn.style.display = 'none'
    init()
}

function fixBannerTarget(){

    // 删去细化筛选栏，综合/视频/番剧/用户栏；会固定按照关注顺序依次显示
    if(checkElement(document, 'class', "search-header") != null){
        var strategy_banner = document.getElementsByClassName("search-header")[0].children[3]
        strategy_banner.style.display = "none"
    }

    // 删去选页栏，只留下一页；滚动显示，不保留全部内容
    // TODO:也可以预处理多花些事件，获取所有视频列表后，排序显示，可选页
    if(checkElement(document, 'class', "vui_pagenation--btns") != null){
        var page_btns = document.getElementsByClassName("vui_pagenation--btns")[0]
        for(var i = 0; i < page_btns.children.length - 1; ++i){
        strategy_banner.style.display = "none"
            page_btns.children[i].style.display = "none"
        }
        btn_next_target = page_btns.children[page_btns.children.length - 1]
        btn_next_target.style.display = 'none'
        btn_next_target.onclick = function(){clickNextButtonTarget(btn_next_target)}
    }
}

/****
 * 等待相关函数
 ****/

// 检查所需元素是否已加载成功
function checkElement(element, method, text){
    if(element == null) return null

    var result = null
    switch(method){
        case 'class':
            result = element.getElementsByClassName(text)
            break
        case 'tag':
            result = element.getElementsByTagName(text)
            break
        case 'id':
            result = element.getElementById(text)
            break
        default:
            result = element.getElementsByClassName(text)
            break
    }

    // console.log(result)
    if(result != null && result != undefined && result.length != 0){
        return result
    }else{
        return null
    }
}


/****
 * 一些小函数
 ****/


// 正则匹配
function regGroup(patt, text){
    var matched_str = text.match(patt)
    var result = RegExp.$1
    return result
}

// 保存过去信息：主页面翻页时
function saveTargrtInfo(up_i, page_i, source_i){
    saved = 1
    saved_up_i = up_i
    saved_page_i = page_i
    saved_source_i = source_i
    saved_target_page = window.document.getElementsByClassName('vui_button--active-blue')[0].textContent
    saved_video_target_href = videos_target[0].children[0].attributes['href'].nodeValue
}

// 保存过去信息：子页面翻页时
function saveSrcInfo(){
    saved_video_src_href = videos_src[0].getElementsByClassName('title')[0].attributes['href'].nodeValue
}
