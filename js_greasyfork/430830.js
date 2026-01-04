// ==UserScript==
// @name         煎蛋查看吐槽
// @description 可以查看自己发送吐槽的xxoo数量和收到的回复数量
// @version      0.1
// @author       clxin
// @match        *://jandan.net/*
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @namespace https://greasyfork.org/users/188074
// @downloadURL https://update.greasyfork.org/scripts/430830/%E7%85%8E%E8%9B%8B%E6%9F%A5%E7%9C%8B%E5%90%90%E6%A7%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430830/%E7%85%8E%E8%9B%8B%E6%9F%A5%E7%9C%8B%E5%90%90%E6%A7%BD.meta.js
// ==/UserScript==

var constant = {
    url: "https://jandan.net/api/tucao/all/",//获取评论的url
    create: "/api/tucao/create",//发送吐槽的api
};

(function () {

    //添加ajax拦截器
    responseInterceptor()

    //在导航添加一个下拉菜单
    addElement()

    //给这个下拉菜单添加显示内容
    initContent()

    //给删除按钮添加功能
    removeBtn()

    //给刷新按钮添加功能
    refreshBtn()

    //设置所有的css样式
    setCss()
})();

//拦截发送吐槽的ajax响应
function responseInterceptor() {
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings.url.includes(constant.create)) {
            parseResponse(xhr.responseJSON.data)
        }
    });
}

function parseResponse(data) {
    //主题id，就是所回复的那个帖子的id
    const topicId = data.comment_post_ID
    //回复id，自己发送的那条信息的id
    const commentId = data.comment_ID
    //发送的内容
    const content = data.comment_content

    const info = {
        content: content,
        topicId: topicId,
        xx: 0,
        oo: 0,
        replyCount: 0
    }

    setData(commentId, info)

    //初始化一行信息，添加到下拉菜单
    const contentLine = createContentLine(commentId, info)
    $("#dropdown-content").append(contentLine)

    //新添加的dom没有样式，需要再设置一次
    setCss()
}


//在导航栏添加一个li
function addElement() {
    const li = "<li class='nav-item' id='dropdown' > \
                    <div class='nav-link nav-btn'>\
                        消息 \
                        <a id='clean'>清空</a>\
                        <a id='refreshAll'>全部刷新</a>\
                        <div id='dropdown-content' class='nav-link'> </div> \
                    </div>\
                </li>"

    $(".nav-items").append(li)
}


/*
给下拉菜单内填充数据
*/
function initContent() {

    const info = allComment()
    const contentDom = $("#dropdown-content")
    const keys = Object.keys(info)

    if (keys.length === 0) {
        contentDom.append('<div style="text-align:center">没有数据</div>')
        return
    }

    for (key of keys) {
        contentDom.append(createContentLine(key, info[key]))
    }


}

//构建一行显示信息
function createContentLine(commentId, data) {
    return "<div class='content_line jandan-vote' comment-id='" + commentId + "' topic-id='" + data.topicId + "'>\
                    <a class='comment' title=" + data.content + " target='_blank' href='/t/" + data.topicId + "'>" + data.content + "<a/> \
                    <a href='javascript:void(0)' style='color:#faa' class='like' >OO</a> [<span class='like_num'>" + data.oo + "</span>]\
                    <a href='javascript:void(0)' style='color:#aaf' class='unlike'>XX</a> [<span class='unlike_num'>" + data.xx + "</span>]\
                    <a href='javascript:void(0)' style='color:#c8c7cc'> 回复 [<span class='reply_count'>" + data.replyCount + "</span>] </a>\
                    <a href='javascript:void(0)' class='remove_btn btn' >删除</a> \
                    <a href='javascript:void(0)' class='refresh_btn btn' >刷新</a> \
                </div>"
}


//给删除按钮绑定点击事件，并完成删除功能
function removeBtn() {
    //删除一行
    $(".remove_btn").on("click", function () {
        if (confirm("是否确认删除?")) {
            const line = $(this).parent()
            const commentId = line.attr("comment-id")
            localStorage.removeItem(commentId)
            line.remove()
        }

    })

    //清空数据
    $("#clean").click(function () {
        if (confirm("是否确认清空?")) {
            const dropdown = $("#dropdown-content")
            dropdown.children().remove()
            dropdown.append('<div style="text-align:center">没有数据</div>')
            localStorage.clear()
        }

    })
}

//给刷新按钮绑定点击事件，并完成刷新功能
function refreshBtn() {
    //刷新一行
    $(".refresh_btn").on("click", function () {
        refreshLine($(this).parent())
    })


    //刷新所有
    $("#refreshAll").click(async function () {
        let lines = []
        $(".refresh_btn").each(function () {
            lines.push($(this).parent())
        })
        for (let line of lines) {
            await refreshLine(line)
        }
    })


}

//刷新一行
function refreshLine(line) {
    const commentId = line.attr("comment-id")
    const topicId = line.attr("topic-id")
    $.get(constant.url + topicId, (json) => {
        let data = getData(commentId)
        let count = 0
        for (let comment of json.tucao) {
            const content = comment.comment_content
            if (content.includes("data-id=\"" + commentId + "\"")) {
                count++
            }
            if (comment.comment_ID + '' === commentId + '') {
                data.xx = comment.vote_negative
                data.oo = comment.vote_positive
            }
        }
        data.replyCount = count
        line.children(".like_num").text(data.oo)
        line.children(".unlike_num").text(data.xx)
        line.children(".reply_count").text(count)
        setData(commentId, data)
    })
}

//获取所有回复信息
function allComment() {
    const len = localStorage.length
    let info = {}
    let i = 0
    while (i < len) {
        const key = localStorage.key(i)
        const value = localStorage.getItem(key)
        info[key] = JSON.parse(value)
        i++
    }
    return info

}

function getData(commentId) {
    const data = localStorage.getItem(commentId)
    return JSON.parse(data)
}

function setData(commentId, data) {
    localStorage.setItem(commentId, JSON.stringify(data))
}


//设置css样式
function setCss() {

    //导航栏中的属性
    let dropdown = $("#dropdown")
    dropdown.css({"cursor": "pointer", "width": "290px", "z-index": 1})
    dropdown.hover(function () {
        content.css("display", "block");
    }, function () {
        content.css("display", "none");
    });

    //显示所有内容的区域
    let content = $("#dropdown-content")
    content.css({
        "display": "none",
        "position": "absolute",
        "width": "403px",
        "padding": "0px",
        "margin": "12px 0px 0px -12px",
        "background-color": "#262626"
    })

    //显示一行信息的区域
    $(".content_line").css({
        "padding": "5px 10px 5px 0px",
        "border-bottom": "1px solid #3B3B3B",
        "height": "25px",
        "line-height": "25px"
    })

    //显示回复内容的区域
    let comment = $(".comment")
    comment.css({
        "float": "left",
        "width": "150px",
        "text-align": "left",
        "color": "#999",
        "white-space": "nowrap",
        "text-overflow": "ellipsis",
        "overflow": "hidden",
        "margin-left": "10px"
    })

    //设置按钮的hover属性
    setHover(".comment", "white")
    setHover(".refresh_btn", "white")
    setHover(".remove_btn", "red")
    setHover("#clean", "red")
    setHover("#refreshAll", "white")


    $(".btn").css("padding-left", "10px")

    $(".nav-btn").children("a").css("margin-left", "10px")
}

//传入选择器，设置css的hover
function setHover(selector, color) {
    let dom = $(selector)

    dom.each((i, item) => {
        const d = $(item)
        d.css("color", "#999")
        d.hover(() => {
            d.css("color", color)
        }, () => {
            d.css("color", "#999")
        })
    })


}