// ==UserScript==
// @name         cytube_user_check
// @namespace    https://cytube.mm428.net/
// @version      1.00
// @description  複数のアカウントを利用して動画登録しているユーザーを定期的に検知する
// @author       fetcH
// @grant        none
// @match        https://cytube.mm428.net/r/*
// @downloadURL https://update.greasyfork.org/scripts/499913/cytube_user_check.user.js
// @updateURL https://update.greasyfork.org/scripts/499913/cytube_user_check.meta.js
// ==/UserScript==


(function() {
    // チェック対象のユーザー権限
    /*----------------------
     * var Rank = {
     *     Guest: 0,
     *     Member: 1,
     *     Leader: 1.5,
     *     Moderator: 2,
     *     Admin: 3,
     *     Owner: 10,
     *     Siteadmin: 255
     * };
     */
    const TARGET_USER_RANK = Rank.Owner;

    // チェック間隔（秒）
    const CHECK_INTERVAL_SEC = 180;

    // 自動動画削除機能
    const AUTO_MOVIE_DELETE = true;

    // 表示場所作成
    const view_div = $('<div>').attr({
        id: 'vidchk',
        class: 'linewrap'
    });
    $('#chatwrap').append(view_div);

    //

    // リストを定期的にチェック
    setInterval(function(){

        // プレイリストの登録数上限を取得する
        // 無制限なら0
        // 日本語前提の処理
        const queue_limit = (() => {
            let limit = $("#plcount").text().split(':')[1];
            if (limit == '無し') {
                return 0;
            }
            limit = parseInt(limit.split('項目')[0], 10);
            return limit;
        })();
        //console.log(queue_limit);

        if (queue_limit == 0) {
            return;
        }

        // ユーザーの動画登録情報取得
        const user_list = {}; // ユーザー名別の情報
        const ip_list = {}; // ip別の情報
        // 参加ユーザー情報をまとめる
        Array.from(document.getElementById("userlist").children).forEach((child) => {
            const userlist_item = $(child);
            const name = userlist_item.children()[1].innerText;
            const data = userlist_item.data();
            const ip = data.meta.ip ?? name; // 権限が足りないとipが取得できないので名前をip代わりとする
            user_list[name] = {
                name: name,
                ip: ip,
                rank: data.rank,
                movies: []
            };
            if (!ip_list.hasOwnProperty(ip)) {
                ip_list[ip] = {
                    ip: ip,
                    aliases: []
                };
            }
            ip_list[ip].aliases.push(name);
        });
        //console.log(ip_list);

        // ユーザーの動画登録情報をまとめる
        Array.from(document.getElementById("queue").children).forEach((child) => {
            const playlist_item = $(child);
            const name = playlist_item.data().queueby;
            const title = playlist_item.data().media.title;
            const uid = playlist_item.data().uid;
            //console.log(playlist_item.data());
            if (user_list.hasOwnProperty(name)) {
                user_list[name].movies.push({queueby: name, title: title, uid: uid});
            }
        });
        //console.log(user_list);

        // 複数アカウントで登録しているIPに対する処理
        const limit_over_ip_list = [];
        for (const ip in ip_list) {
            // 複数アカウントで動画登録しているか判定する
            const ip_info = ip_list[ip];
            const aliases = [];
            let movies = [];
            for (const name of ip_info.aliases) {
                // 指定権限のユーザー以下を対象とする
                if (user_list[name].rank <= TARGET_USER_RANK) {
                    if (1 <= user_list[name].movies.length) {
                        aliases.push(name);
                        movies = movies.concat(user_list[name].movies);
                    }
                }
            }

            // 複数アカウントでの動画登録者を表示
            if (2 <= aliases.length) {
                if (queue_limit < movies.length) {
                    const movie_cnt = `動画登録数=${movies.length}`;
                    const ip = `IP=${ip_info.ip}`;
                    const user_names = `ユーザー名=${aliases.join(', ')}`;
                    const movie_names = movies.map((movie) => { return movie.title; }).join("\n");
                    limit_over_ip_list.push(`<div>${movie_cnt}：${ip}：${user_names}</div>`);
                    // 動画名はコンソールに表示
                    console.log(`${movie_cnt}\n${ip}\n${user_names}\n${movie_names}\n\n\n`);

                    // 動画自動削除
                    if (AUTO_MOVIE_DELETE) {
                        const keep_name = aliases[0];
                        const delete_movies = movies.filter((movie) => { return movie.queueby != keep_name; });
                        const delete_movie_names = delete_movies.map((movie) => { return `${movie.title}(${movie.queueby})`; }).join("\n");
                        socket.emit("chatMsg", {
                            msg: "【複垢動画登録検知】以下をプレイリストから削除しました",
                            meta: {}
                        });
                        for (const del of delete_movies) {
                            socket.emit("delete", del.uid);
                            socket.emit("chatMsg", {
                                msg: `【User：${del.queueby}】${del.title}`,
                                meta: {}
                            });
                        }
                        console.log(`DELETE MOVIES\n${ip}\n${user_names}\n${delete_movie_names}`);
                    }
                }
            }
        }

        // 垢BAN対象者を表示
        view_div.html(limit_over_ip_list.join(""));
    }, CHECK_INTERVAL_SEC * 1000);
})();
