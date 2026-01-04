// ==UserScript==
// @name         点赞工具
// @namespace    https://taki.best/
// @version      1.3
// @description  点赞工具!
// @author       miaoyu
// @require      https://cdn.jsdelivr.net/npm/babel-standalone@6.18.2/babel.js
// @require      https://cdn.jsdelivr.net/npm/babel-polyfill@6.16.0/dist/polyfill.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @match        *://m.dapengjiaoyu.com/user/task/task-detail?taskId=*
// @downloadURL https://update.greasyfork.org/scripts/406693/%E7%82%B9%E8%B5%9E%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/406693/%E7%82%B9%E8%B5%9E%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/* jshint ignore:start */
var MultiString = function(f){
    return f.toString().split('\n').slice(1, -1).join('\n');
}
/* jshint ignore:end */

var inline_src = MultiString(function(){
    initSidebar();

    function initSidebar(){
        $("body").append(`<div class="praise_tool">
							<div class="praise_tool_buttons">
                               <span class="praise_tool_button" id="praise_tool_praise">全点赞</span>
							   <span class="praise_tool_button" id="praise_tool_scroll">开始滚</span>
                               <span class="praise_tool_button" id="praise_tool_add_comment">加评论</span>
                               <input type="checkbox" class="praise_tool_checkbox" />评论管理
							</div>
                            <div class="praise_tool_comments"></div>
                          </div>
                          <style>
							.praise_tool {
								width: 300px;
								position: fixed;
								right: 0;
								top: 10%;
								border: 1px solid black;
								z-index: 9999;
                                background: #fff;
								font-size: 0.25rem;
							}

							.praise_tool_buttons {
								padding: 5px;
							}

							.praise_tool_button {
								border: 1px solid black;
								cursor: pointer;
								padding: 0 5px;
							}

							.praise_tool_button:hover {
								background:silver;
							}

                            .praise_tool_checkbox{
                                -webkit-appearance: checkbox;
                            }

                            .praise_tool_comments:not(:empty){
                                border-top: 1px solid black;
                            }

							.praise_tool_comment {
								border: 1px solid black;
								padding: 5px;
								margin: 5px;
							}

                            .praise_tool_comment_content{
								cursor: pointer;
                            }

                            .praise_tool_comment_content:hover{
                                background:silver;
                            }

                            .praise_tool_comment_buttons{
                                display: none;
								border-top: 1px solid black;
                                margin-top: 5px;
                                padding-top: 2px;
                                text-align: right;
                                color: blue;
                            }

                            .praise_tool_manage .praise_tool_comment_buttons{
                                display: block;
                            }

                            .praise_tool_comment_button{
								cursor: pointer;
                            }
                         </style>`);
        getComments();
        bindEvent();
    }

    function getComments(){
        $.ajax({
            url: `https://api.taki.life/comments`,
            async: false,
            success: function (data) {
                data.forEach(comment => {
                    addCommentDom(comment);
                });
            }
        });
    }

    function saveComment(comment){
        var url = "https://api.taki.life/comments";
        comment.id && (url += `/${comment.id}`);
        $.ajax({
            type: comment.id ? "PUT" : "POST",
            url: url,
            data: comment,
            async: false,
            success: function (data) {
                if(comment.id){
                    $(`[data-praise-comment-id=${comment.id}] .praise_tool_comment_content`).text(comment.name);
                } else {
                    comment.id = data.id;
                    addCommentDom(comment);
                }
            }
        });
    }

    function delComment(id){
        $.ajax({
            type: "delete",
            url: `https://api.taki.life/comments/${id}`,
            async: false,
            success: function (data) {
                $(`[data-praise-comment-id=${id}]`).remove();
            }
        });
    }

    function addCommentDom(comment){
	    $(".praise_tool_comments").append(`<div class="praise_tool_comment" data-praise-comment-id="${comment.id}">
										     <div class="praise_tool_comment_content">${comment.name}</div>
										     <div class="praise_tool_comment_buttons">
											    <span class="praise_tool_comment_button">修改</span>
											    <span class="praise_tool_comment_button">删除</span>
										     </div>
									       </div>`);
    }

    var timer;
    function scrollToEnd() {
        if (!$(".van-list__finished-text").text().length) {
            $(document).scrollTop($(document).height());
            timer = setTimeout(scrollToEnd, 1000);
        } else {
            clearTimeout(timer);
            $("#praise_tool_scroll").text("滚完啦");
        }
    }

    var taskId = getUrlParam("taskId");
    function getTaskInfo() {
        $.ajax({
            url: `//m.dapengjiaoyu.com/user/job/get-task-info?taskId=${taskId}`,
            success: async function(data) {
                var total = data.data.submitCount;
                for (var page = 1; page <= Math.ceil(total/5); page++) {
                    await getJobs(page, total);
                }
            }
        });
    }

    function getJobs(page, total) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: `//m.dapengjiaoyu.com/user/job/get-jobs-by-task-id?page=${page}&taskId=${taskId}`,
                success: function (data) {
                    data.data.list.forEach(async function(item, index){
                        await praise(page, total, item, index);
                    });
                    resolve();
                }
            });
        });
    }

    function praise(page, total, item, index) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "post",
                url: "//m.dapengjiaoyu.com/user/praise/add",
                data: {
                    id: item.id,
                    type: item.type,
                    createUserId: item.userId
                },
                success: function () {
                    $("#praise_tool_praise").text(`${(page-1)*5+index+1}/${total}`);
                    resolve();
                }
            });
        });
    }

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }

    function bindEvent(){
        $("#praise_tool_praise").click(function(){
            $(this).text() == "全点赞" && getTaskInfo();
        });

        $("#praise_tool_scroll").click(function () {
            if($(this).text() == "开始滚"){
                scrollToEnd();
                $("#praise_tool_scroll").text("别滚啦");
            } else if($(this).text() == "别滚啦"){
                clearTimeout(timer);
                $("#praise_tool_scroll").text("开始滚");
            }
        });

        $("#praise_tool_add_comment").click(function(){
            var content = prompt("输入评论内容");
            content && content.length && saveComment({ name: content });
        });

        $(".praise_tool_checkbox").click(function(){
            if($(this).is(":checked")){
               $(".praise_tool").addClass("praise_tool_manage");
            } else {
               $(".praise_tool").removeClass("praise_tool_manage");
            }
        });

        $(document).on("click", ".praise_tool_comment_content", function(){
            $("textarea").val($(this).text());
        });

        $(document).on("click", ".praise_tool_comment_button", function(){
            var id = $(this).parents(".praise_tool_comment").data("praise-comment-id");
            if($(this).text() == "修改"){
                var content = prompt("输入评论内容", $(this).parent().prev().text());
                content && content.length && saveComment({ id: id, name: content });
            } else {
                delComment(id);
            }
        });
    }
});
/* jshint ignore:start */
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */