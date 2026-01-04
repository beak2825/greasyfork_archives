
// ==UserScript==
// @name         FollowingListOfBili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  To get the following list
// @author       Ouphi
// @match        https://space.bilibili.com/*/fans/follow*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MPL
// @downloadURL https://update.greasyfork.org/scripts/449066/FollowingListOfBili.user.js
// @updateURL https://update.greasyfork.org/scripts/449066/FollowingListOfBili.meta.js
// ==/UserScript==


/**
 * 全局or常用的变量名
 * 变量命名前缀：    n--num,    e--element, t--text
 *                  btn--button,    patt--pattern
 * 特殊变量：
 *          顾名思义：uid, fuids, fuid, href
 *          临时变量：i, j, k
 *          一些函数内变量，定义与使用相隔不远，可直观查看，不再赘述
 **/

var cnt = 0

// 页面固定信息
var href        =   "https://space.bilibili.com/208259/fans/follow" // 默认网址
var uid         =   "208259"            // 默认uid
var patt_uid    =   /.+\/([0-9]+)\/.*/  // 匹配uid的正则式

// 新增内容
var n_pages         =   -1          // 关注列表的页数
var fuids           =   new Array() // 关注人uid信息的列表
var btn_next        =   null        // “下一页”按钮元素
var btn_down        =   null        // 新增按钮，点击后可遍历内容
var e_father_down   =   null        // 新增按钮的父元素，用于确定位置

init()

// 设置初始页面，获取信息
function init(){
    console.log('2  ----    加载成功')

    // 获取页面信息
    href = window.location.href
    uid = regGroup(patt_uid, href)
    console.log('2  ----    当前用户：' + '\r' + uid)

    // 等待页面加载后，显示下载按钮
    btn_down = document.createElement('button')
    console.log(btn_down)
    waitingSetButton(btn_down)
}


function run(flag, next_flag, element, method, text, page) {

    console.log('2  ----    flag, next_flag :   ' +  flag + "," + next_flag)
    console.log('2  ----    page   :   ' + page)

    // 每隔0.1s判断一次加载进度
    if(flag == 0){
        var tmp = checkElement(document, method, text)
        if(tmp == null || (next_flag == 2 && checkUpdatingPage(page) == 0)){
            setTimeout(function(){run(0, next_flag, element, method, text, page)}, 100)
        }
        else
            run(next_flag, next_flag, element, method, text, page)
    }

    // 初始化，得到页数与next按钮
    if(flag == 1){
        if(run1GetAndResetPage() == 0) // 下一步
            run(0, 2, document, 'class', 'cover', 1)
        else    // 出现异常，等待加载
            setTimeout(function(){run(0, 1, document, 'class', 'be-pager-total', 1)}, 100)
    }

    // 遍历每一页，得到最终关注列表
    if(flag == 2){
        if(run2GetFollowingUids() != 0) return

        if(page == n_pages) // 最后一页
            run(4, 4, element, method, text, page)
        else // 继续加载下一页
            run(3, 3, element, method, text, page)
    }

    // 加载下一页
    if(flag == 3) {
        if(run3GoNextPage(page) != 0) return

        run(0, 2, document, 'class', 'cover', page + 1)
    }

    // 最后一页，保存数据
    if(flag == 4) {
        run4SaveDataAndReset()
    }
}

/***
 * 运行流程相关函数
 ***/

// TODO:验证关注列表为0的状况
// 1.得到页面信息，并返回到第一页
function run1GetAndResetPage(){
    var t_pages = document.getElementsByClassName("be-pager-total")[0].textContent
    n_pages = regGroup(/.+([0-9]+).+/, t_pages)
    console.log('2  ----    ' + '关注总页数:' + '   ' + n_pages)

    // 二次检测，因为出现了=0的状态
    if(n_pages == 0) return 1

    // 回到第一页，获取“下一页“按钮，以继续
    backFirstPage()
    btn_next = document.getElementsByClassName("be-pager-next")[0].children[0]
    return 0
}

// 2.得到当前页的uids
function run2GetFollowingUids(){
    var followings = document.getElementsByClassName("cover")
    for(var j = 0; j < followings.length; j++){
        var fuid = regGroup(patt_uid, followings[j].attributes['href'].nodeValue)
        fuids[fuids.length] = fuid
    }
    return 0
}

// 3.点击下一页
function run3GoNextPage(page){
    btn_next.click()

    // 一个其实没必要的冗余判断
    if(page + 1 > n_pages) return 1

    return 0
}

// 4.保存数据并解锁下载按钮
function run4SaveDataAndReset(){
    // 结束，将得到的uids文件保存到本地
    console.log('2  ----\n')
    console.log('fuids  :   ' + fuids.length + '\n' + fuids)

    // 得到uid文本内容，并表示为二进制数据
    // 第一行是关注总数目
    var t_fuid = fuids.length + '\n' + fuids.join('\n')
    // 由于bili的限制，不能用blob（blob的url简单），暂用data代替（url中包括完整文件）
    downloadFile(t_fuid)

    // 解锁下载按钮，可以重新下载
    resetButton(btn_down)
    console.log('2  ----    ' + '结束下载')
    return 0
}


/****
 * 按钮相关函数
 ****/

 function waitingSetButton(btn){
    console.log(btn)

    var elements = document.getElementsByClassName("follow-main")
    if(elements == null || elements == undefined || elements.length == 0){
        setTimeout(function(){waitingSetButton(btn)}, 100)
    }
    else{
        setButton(btn)
    }
}

function setButton(btn){
    console.log(btn)
    // setTimeout不能嵌套
    e_father_down = document.getElementsByClassName("follow-main")[0]
    btn.innerHTML = '下载列表'
    btn.style.width = '100px'
    btn.style.height = '30px'
    btn.style.fontSize = '16px'
    btn.style.color = '#FFFFFF'
    btn.style.background = '#99CCFF'
    btn.style.borderRadius = '7px'
    btn.style.borderWidth = '0px'
    btn.id = 'download-following-list-button'
    btn.onclick = function(){clickButton(btn)}
    e_father_down.insertBefore(btn, e_father_down.childNodes[1])
}

function clickButton(btn){
    btn.disabled = true
    btn.style.background = '#999999'
    // 此处不传btn参数，默认为btn_down；如果需要复用，需要改写
    run(0, 1, document, 'class', 'be-pager-total', 1)
}

function resetButton(btn){
    fuids.length = 0
    btn.disabled = false
    btn.style.background = '#99CCFF'
}


/****
 * 元素处理函数
 *****/

// 保存信息
function downloadFile(text){
    // var fuid_href = 'data:text/txt;charset=utf-8,\ufeff' + encodeURIComponent(fuid_text)
    // 如果想下载为文件，可以使用上面的代码（bilibili不支持blob下载），并将元素p改为元素a，最后加个click就好了
    var p = checkElement(document, 'id', 'following-list-text')
    if(p != null) p.remove()

    // 利用a元素，为二进制数据设置临时url，实现下载
    var p_father = document.body
    p = document.createElement('p')
    p.id = 'following-list-text'
    p.textContent = text
    // 如果需要直观查看，可以将这行注释掉，或改为block
    p.style.display = 'none'
    p_father.appendChild(p, p_father)
}

// 返回第一页
function backFirstPage(){
    // 回车事件
    var event = new Event('keyup')
    event = Object.assign(event, {
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        which: 13,
        keyCode: 13,
        key: 'Enter',
        code: 'Enter'
    })

    // 重新跳转到起始页
    var e_banner = document.getElementsByClassName("be-pager-options-elevator")[0]
    var e_input = e_banner.getElementsByClassName("space_input")[0]
    e_input.value = '1'
    // e_input.focus()
    e_input.dispatchEvent(event)
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

    if(result != null && result != undefined && result.length != 0){
        return result
    }else{
        return null
    }
}

// 检查页面转换（解决有时会出现链接变了，元素能获取，但还未来得及更新的状况）
function checkUpdatingPage(page){

    var e_page_num = document.getElementsByClassName('be-pager-item be-pager-item-active')[0]

    var following = document.getElementsByClassName("cover")[0]
    var fuid = regGroup(patt_uid, following.attributes['href'].nodeValue)

    if(page.toString() == e_page_num.textContent && fuids.indexOf(fuid) == -1){
        return 1
    }
    return 0

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
