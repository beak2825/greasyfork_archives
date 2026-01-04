// ==UserScript==
// @name         bangumi 是否互为好友
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  在好友页（包括其他人的好友页）的头像旁显示是否互为好友
// @author       鈴宮華緋
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/user\/.*\/(rev_)?friends/
// @downloadURL https://update.greasyfork.org/scripts/369799/bangumi%20%E6%98%AF%E5%90%A6%E4%BA%92%E4%B8%BA%E5%A5%BD%E5%8F%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/369799/bangumi%20%E6%98%AF%E5%90%A6%E4%BA%92%E4%B8%BA%E5%A5%BD%E5%8F%8B.meta.js
// ==/UserScript==

(function() {
    function main() {
        function get_id_list(url) {
            let list = [];
            $.ajax({
                url : url,
                async : false,
                success: function(data) {
                    let match = data.match(/<li class="user[\s\S]*?<\/li>/g);
                    if(match.length > 0) {
                        for(let i = 0;i < match.length;i++) {
                            let id = match[i].match(/<a href="([\s\S]*?)" class="avatar/)[1];
                            id = id.trim();
                            list.push(id);
                        }
                    }
                }
            });
            return list;
        }
        let _user = $("div.headerNeueInner").find("a.avatar").attr("href").match(/user\/(.*)/)[1];
        let friends_id_list = [];
        let rev_friends_id_list = [];
        friends_id_list = get_id_list(location.origin + "/user/" + _user + "/friends");
        rev_friends_id_list = get_id_list(location.origin + "/user/" + _user + "/rev_friends");
        let users_a = $.merge($.merge($("#main").find("a.avatar"), $("div.mainWrapper").find("a.avatar")), $("#headerProfile").find("a.avatar"));
        // console.log(users_a);
        for(let i = users_a.length - 1; i >= 0 ; i--) {
            if (!users_a.eq(i).html().match(/pic\/user/)) {
                // users_a.splice(i, 1);
                continue;
            }
            let user_a = users_a.eq(i);
            let id = null;
            if (!(id = user_a.attr("href").match(/\/user\/.*/))) {
                continue;
            }
            id = id[0];
            let eachother = true;
            friends_id_list.indexOf(id) === -1 ?  eachother = false : 0;
            rev_friends_id_list.indexOf(id) === -1 ?  eachother = false : 0;
            let box = null;
            if (user_a.find("span.userImage").length > 0) {
                box = user_a.find("span.userImage");
            } else if (user_a.find("span.avatarNeue").length > 0){
                box = user_a.find("span.avatarNeue");
            }
            if (box) {
                let size = box.width() / 4;
                box.css("position", "relative");
                let span = $("<span></span>");
                span.css({
                    "position" : "absolute",
                    "bottom" : "-2px",
                    "right" : "-5px",
                    "font-size" : size + "px"
                });
                eachother ? span.text("😀") : span.text("");
                box.append(span);
            }
        }
    }
    window.setTimeout(function() {
        main();
    }, 0);
})();