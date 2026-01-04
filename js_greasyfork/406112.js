// ==UserScript==
// @name         拒绝跟风，理性思考
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  点击 ooxx 前隐藏当前 post 的 ooxx，目前只支持主楼，不支持吐槽
// @author       native
// @match        http://jandan.net/*
// @match        https://jandan.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/406112/%E6%8B%92%E7%BB%9D%E8%B7%9F%E9%A3%8E%EF%BC%8C%E7%90%86%E6%80%A7%E6%80%9D%E8%80%83.user.js
// @updateURL https://update.greasyfork.org/scripts/406112/%E6%8B%92%E7%BB%9D%E8%B7%9F%E9%A3%8E%EF%BC%8C%E7%90%86%E6%80%A7%E6%80%9D%E8%80%83.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function(){
        if($(".commentlist").length == 0){
            return;
        }
        var allPost = $(".commentlist")[0];
        for(cur = allPost.firstElementChild; cur != null; cur = cur.nextElementSibling){
            if(cur.id.startsWith("comment-")){
                var likeSpan = cur.querySelector("div > div > div.jandan-vote > span.tucao-like-container > span");
                var unLikeSpan = cur.querySelector("div > div > div.jandan-vote > span.tucao-unlike-container > span");

                if(likeSpan == null){
                    likeSpan = cur.querySelector("div > div > div.jandan-vote > span:nth-child(2)");
                }
                if(unLikeSpan == null){
                    unLikeSpan = cur.querySelector("div > div > div.jandan-vote > span:nth-child(4)");
                }

                var commentOoxxEle = {
                    'id': cur.id, 'oo': parseInt(likeSpan.innerText), 'xx': parseInt(unLikeSpan.innerText)
                };
                GM_setValue(cur.id, commentOoxxEle);
                likeSpan.innerText = "...";
                unLikeSpan.innerText = "...";
            }
        }

        ooxx_action = function xxx(c, e){
            var d = c.data("id");
            var b = c.data("type");
            var a = c.data("is_loading");
            var isClickOo = c[0].className == "comment-like like";
            if (a === true) {
                jandan_show_msg("数据加载中...请不要重复操作");
                return
            }
            c.data("is_loading", true);
            $.ajax({
                headers: {
                    "Request-Uri": window.location.href
                },
                type: "POST",
                dataType: "json",
                url: "/api/comment/vote",
                data: {
                    comment_id: d,
                    like_type: b,
                    data_type: e
                },
                success: function(i) {
                    c.data("is_loading", false);
                    if (i.error != 0) {
                        jandan_show_msg(i.msg);

                        // add code to show current ooxx
                        showOoxx(c, isClickOo, false);
                        return
                    }
                    var f = {
                        obj: c,
                        str: "+ 1",
                        startSize: "12px",
                        endSize: "30px",
                        interval: 800,
                        color: "#cd4450",
                        weight: "bold"
                    };
                    f.color = "#00f";
                    if (b === "pos") {
                        f.color = "#f00"
                    }
                    $("body").append('<span class="plus-num" id="plus-' + d + '">' + f.str + "</span>");
                    var h = $("#plus-" + d);
                    var k = f.obj.offset().left;
                    var j = f.obj.offset().top - f.obj.height() + 5;
                    h.css({
                        position: "absolute",
                        left: k + "px",
                        top: j + "px",
                        "z-index": 9999,
                        "font-size": f.startSize,
                        "line-height": f.endSize,
                        color: f.color,
                        "font-weight": f.weight
                    });
                    var g = c.next("span");
                    // add code to show current ooxx
                    showOoxx(c, isClickOo, true);
                    h.velocity({
                        opacity: "0",
                        top: (j - 20) + "px"
                    }, f.interval, function() {
                        h.remove()
                    })
                },
                error: function() {
                    c.data("is_loading", false)

                    // add code to show current ooxx
                    showOoxx(c, isClickOo, false);
                }
            })
        };

        function getCommentIdFormC(c){
            var cur = c[0].parentElement;
            while(!cur.id.startsWith("comment-")){
                cur = cur.parentElement;
            }
            return cur.id;
        }

        function getJandanVoteEleFormC(c){
            var cur = c[0].parentElement;
            while(cur.className != "jandan-vote"){
                cur = cur.parentElement;
            }
            return cur;
        }

        function showOoxx(c, isClickOo, success){
            if(c[0].className.indexOf("tucao") >= 0){
                return;
            }

            var commentId = getCommentIdFormC(c);
            var ooxx = GM_getValue(commentId);
            var addend = success ? 1 : 0;

            isClickOo ? ooxx["oo"] += addend: ooxx["xx"] += addend;
            GM_setValue(commentId, ooxx);

            var jandanVoteEle = getJandanVoteEleFormC(c);
            var likeEle = jandanVoteEle.querySelector("span.tucao-like-container > span");
            var unLikeEle = jandanVoteEle.querySelector("span.tucao-unlike-container > span");
            if(likeEle == null){
                likeEle = jandanVoteEle.querySelector("span:nth-child(2)");
                unLikeEle = jandanVoteEle.querySelector("span:nth-child(4)");
            }

            likeEle.innerText = ooxx["oo"];
            unLikeEle.innerText = ooxx["xx"];
        }
    });
})();
