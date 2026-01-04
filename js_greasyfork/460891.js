// ==UserScript==
// @name         Pixiv_Following_List
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Pixivのフォローしてる人を取得します
// @author       edamame_sukai
// @match        *://www.pixiv.net/*
// @match        *://twitter.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/460891/Pixiv_Following_List.user.js
// @updateURL https://update.greasyfork.org/scripts/460891/Pixiv_Following_List.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // following_listオブジェクトがない場合に新規作成する
    let following_list = {
        pixiv_following: [],
        pixiv_is_moving: false,
        twitter_is_moving: false
    }
    if (!GM_getValue('pixiv_following_list')) {
        GM_setValue('pixiv_following_list', JSON.stringify(following_list));
        console.log(following_list);
    } else {
        following_list = JSON.parse(GM_getValue('pixiv_following_list')); // Storageからpixiv_following_listの値を取得
        // バージョンの違いでプロパティがなかったり名前が違うのを修正する
        if (following_list.hasOwnProperty("is_moving")) {
            if (following_list.is_moving === true) {
                following_list.pixiv_is_moving = "1";
            } else if (following_list.is_moving === false) {
                following_list.pixiv_is_moving = false;
            }
            delete following_list.is_moving;
        }
        if (!following_list.hasOwnProperty("twitter_is_moving")) {
            following_list.twitter_is_moving = false;
        }
    }
    console.log(following_list);



    if (location.href.match("www.pixiv.net")) { // Pixiv_Following_List
        console.log("pixiv following listが稼働中…");

        if (location.href.match("https://www.pixiv.net/users/[0123456789]+/following.*")) {
            Pixiv_Following_List()
        }

        let previousUrl = location.href;

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList' && document.body.contains(mutation.addedNodes[0])) {
                    let currentUrl = location.href;
                    if (currentUrl !== previousUrl) {
                        console.log('ページ遷移が発生しました。前のURL:', previousUrl, '現在のURL:', currentUrl);
                        // ページ遷移の処理を行う
                        previousUrl = currentUrl;
                        if (location.href.match("https://www.pixiv.net/users/[0123456789]+/following.*")) {
                            Pixiv_Following_List()
                        }
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        function Pixiv_Following_List() {
            const params = new URLSearchParams(window.location.search); // クエリパラメータを操作するためのオブジェクト
            const url = new URL(window.location.href); // 現在のURLからURLオブジェクトを生成
            let now_page = url.searchParams.get('p'); // pのパラメータから現在のページを取得

            // もしpのクエリがなかったら1にする
            if (now_page === null) {
                now_page = "1";
            }

            console.log("現在" + now_page + "ページ目です");

            // リンクinput要素作成
            const startbutton = document.createElement("input"); // スタートボタン
            startbutton.classList.add('startbutton');
            startbutton.type = 'button';
            startbutton.value = 'Pixivのフォロー一覧を取得します';

            const analysisbutton = document.createElement("input"); // TwitterのURL解析ボタン
            analysisbutton.classList.add('analysisbuttonbutton');
            analysisbutton.type = 'button';
            analysisbutton.value = '各フォローしてる人のTwitterのURLを解析します';

            const stopbutton = document.createElement("input"); // ストップボタン
            stopbutton.classList.add('stopbutton');
            stopbutton.type = 'button';
            stopbutton.value = '停止';

            // フォローしてる人を読み込む処理
            function load_following() {
                // 読み込もうとしてるページが現在表示してるページと一致しなかったら、読み込もうとしてるページに遷移
                if (!(following_list.pixiv_is_moving === now_page)) {
                    params.set('p', Number(following_list.pixiv_is_moving)); // クエリパラメータのpを次のページに変更
                    window.location.search = params.toString(); // クエリパラメータをURLに反映
                }

                // 要素が生成されてから一回だけ実行するためにsetInterval()を使用
                let getPixivFollowingList = setInterval(() => {
                    if (document.getElementsByClassName("sc-7zddlj-2 dVRwUc").length !== 0 && document.getElementsByClassName("sc-d98f2c-0 sc-19z9m4s-2 QHGGh").length !== 0) {
                        clearInterval(getPixivFollowingList); // 一回だけ実行するためにclearInterval()する
                        let following_person_counts = document.getElementsByClassName("sc-7zddlj-2 dVRwUc")[0].firstElementChild.firstElementChild.innerHTML; // フォローしてる人数を取得
                        let elements = document.getElementsByClassName("sc-d98f2c-0 sc-19z9m4s-2 QHGGh"); // 現在開いてるページのフォローしてる人のユーザーIDとユーザー名を取得する

                        console.log("現在" + following_person_counts + "人フォローしています");
                        console.log("現在開いてるページの人数：" + elements.length + "人");
                        var following_list_tmp = JSON.parse(GM_getValue('pixiv_following_list_tmp')); // Storageからpixiv_following_list_tmpの値を取得
                        Array.from(elements, function (e) {
                            if (!following_list.pixiv_following.find(element => element.user_id == e.getAttribute("data-gtm-value"))) {
                                if (following_list_tmp.pixiv_following.find(tmp => tmp.user_id == e.getAttribute("data-gtm-value") && (tmp.Twitter_id !== "" || tmp.Twitter_id === null))) {
                                    console.log("ユーザーID：" + e.getAttribute("data-gtm-value") + ", ユーザー名：" + e.innerHTML + ", Twitter ID: " + following_list_tmp.pixiv_following.find(tmp => tmp.user_id == e.getAttribute("data-gtm-value") && (tmp.Twitter_id !== "" || tmp.Twitter_id === null)).Twitter_id);
                                    following_list.pixiv_following.push({ user_id: e.getAttribute("data-gtm-value"), user_name: e.innerHTML, Twitter_id: following_list_tmp.pixiv_following.find(tmp => tmp.user_id == e.getAttribute("data-gtm-value") && (tmp.Twitter_id !== "" || tmp.Twitter_id === null)).Twitter_id });
                                } else {
                                    console.log("ユーザーID：" + e.getAttribute("data-gtm-value") + ", ユーザー名：" + e.innerHTML);
                                    following_list.pixiv_following.push({ user_id: e.getAttribute("data-gtm-value"), user_name: e.innerHTML, Twitter_id: "" });
                                }
                            }
                        });
                        console.log(following_list.pixiv_following);

                        // keyをpixiv_following_listでfollowing_listを保存
                        GM_setValue('pixiv_following_list', JSON.stringify(following_list));
                        console.log(GM_getValue('pixiv_following_list'));

                        // 今見てるページ数とフォローしてる人数を計算してページを遷移するか決める
                        console.log("現在読み込んだフォローしてる人の数：" + following_list.pixiv_following.length + "人");

                        if (now_page * 24 == following_person_counts || (((now_page - 1) * 24) + elements.length) == following_person_counts) {

                            params.set('p', 1); // クエリパラメータのpを次のページに変更
                            console.log("フォローしてる人の数が一致しました");
                            following_list.pixiv_is_moving = false;
                            GM_deleteValue('pixiv_following_list_tmp');
                            // keyをpixiv_following_listでfollowing_listを保存
                            GM_setValue('pixiv_following_list', JSON.stringify(following_list));
                            let timer = 5 // timerに設定した秒数後にページをリロードする
                            setInterval(function () {
                                // 1秒ごとに実行されるコード
                                if (timer === 0) {
                                    window.location.search = params.toString(); // クエリパラメータをURLに反映
                                }
                                document.getElementsByClassName("startbutton")[0].value = `終了しました。${timer}秒後、1ページ目に戻ります`;
                                timer--;
                            }, 1000);

                        } else {
                            following_list.pixiv_is_moving = String(Number(now_page) + 1) // 読み込もうとするページを次のページにずらす
                            // keyをpixiv_following_listでfollowing_listを保存
                            GM_setValue('pixiv_following_list', JSON.stringify(following_list));
                            params.set('p', Number(now_page) + 1); // クエリパラメータのpを次のページに変更
                            console.log("読み込み終わったので次のフォローしてる人一覧を読み込みます");
                            setTimeout(function () { // 3秒後に実行
                                window.location.search = params.toString(); // クエリパラメータをURLに反映
                            }, 3000);
                        }
                    }
                }, 1000);
            }

            let button_set = setInterval(() => {
                // フォロワーの欄が表示されるかで自分のフォローユーザーか判別する
                if (document.getElementsByClassName("sc-1j4m1zr-0 dsDfui").length !== 0 && document.querySelector(`a[href="/users/${location.pathname.split("/")[2]}/followers"]`) !== null) {

                    // フォローとマイピグとフォロワーの欄にそれぞれのボタンを追加
                    var follow_div = document.getElementsByClassName("sc-1j4m1zr-0 dsDfui");
                    if (document.getElementsByClassName("startbutton").length === 0) { // 二つ以上ボタンを作らないようにする
                        follow_div[0].appendChild(startbutton);
                        follow_div[0].appendChild(analysisbutton);
                        follow_div[0].appendChild(stopbutton);
                    }
                    if (Boolean(following_list.pixiv_is_moving) == true || following_list.twitter_is_moving == true) {
                        // startボタンを無効化
                        startbutton.disabled = true;

                        // analysisボタンを無効化
                        analysisbutton.disabled = true;
                    } else {
                        // stopボタンを無効化
                        stopbutton.disabled = true;
                    }
                    clearInterval(button_set);
                }
            }, 100);

            // Pixivのフォロー一覧を取得しているかどうか
            if (Boolean(following_list.pixiv_is_moving) == true) {
                startbutton.value = "実行しています 現在" + now_page + "ページ目です";
                load_following();
                /*setTimeout(function () {
                    location.reload();
                }, 20000);*/ // もし処理が途中で止まったとしても20秒後にリロードする
            } else {
                // startbuttonのイベントを登録
                startbutton.addEventListener('click', () => {
                    // startボタンを無効化
                    startbutton.disabled = true;

                    // stopボタンを有効化
                    stopbutton.disabled = false;

                    // analysisボタンを無効化
                    analysisbutton.disabled = true;

                    // tmpファイルがなかったらStorageに保管する
                    if (GM_getValue('pixiv_following_list_tmp') == undefined) {
                        GM_setValue('pixiv_following_list_tmp', JSON.stringify(following_list));
                    }

                    // following_listオブジェクトを新規作成する
                    following_list = {
                        pixiv_following: [],
                        pixiv_is_moving: "1",
                        twitter_is_moving: false
                    }

                    // 既にStorageにpixiv_following_listがあった場合削除する
                    if (GM_getValue('pixiv_following_list') !== null) {
                        localStorage.removeItem('pixiv_following_list');
                    }

                    // keyをpixiv_following_listでfollowing_listを保存
                    GM_setValue('pixiv_following_list', JSON.stringify(following_list));

                    // もし実行するときに今開いてるページが1ページ目以外だったら
                    if (now_page != 1) {
                        params.set('p', 1) // クエリパラメータのpを1に変更
                        window.location.search = params.toString(); // クエリパラメータをURLに反映
                    }

                    document.getElementsByClassName("startbutton")[0].value = "実行しています　現在" + now_page + "ページ目です";

                    load_following();
                });
            }

            // Pixivのフォローしてる人のTwitterのIDを取得しているかどうか
            if (following_list.twitter_is_moving == true) {
                (async () => {
                    // analysisボタンの値を書き換え
                    analysisbutton.value = '解析中…';
                    // startボタンを無効化
                    startbutton.disabled = true;
                    // stopボタンを有効化
                    stopbutton.disabled = false;
                    // analysisボタンを無効化
                    analysisbutton.disabled = true;
                    // fetchTwitterUrls()を実行
                    await fetchTwitterUrls();
                })();
            }

            // stopbuttonのイベントを設定
            stopbutton.addEventListener('click', () => {
                following_list = JSON.parse(GM_getValue('pixiv_following_list'));
                following_list.pixiv_is_moving = false;
                following_list.twitter_is_moving = false;
                // keyをpixiv_following_listでfollowing_listを保存
                GM_setValue('pixiv_following_list', JSON.stringify(following_list));
                location.reload()
            });

            // analysisbuttonのイベントを設定
            analysisbutton.addEventListener('click', async () => {
                // analysisボタンの値を書き換え
                analysisbutton.value = '解析中…';
                // startボタンを無効化
                startbutton.disabled = true;
                // stopボタンを有効化
                stopbutton.disabled = false;
                // analysisボタンを無効化
                analysisbutton.disabled = true;
                // fetchTwitterUrls()を実行
                await fetchTwitterUrls();
            });

            var html = null;
            function HttpRequest(URL) {
                return new Promise((resolve, reject) => {
                    try {
                        GM.xmlHttpRequest({
                            method: "GET",
                            url: URL,
                            onload: function (response) {
                                // 文字列をDOMに変換
                                var div = document.createElement('div');
                                div.innerHTML = response.response;
                                html = div;

                                resolve(html);
                            }
                        });
                    }
                    catch (err) {
                        console.log(err);
                        console.log("プログラムが停止しました");

                        reject(err);
                    }
                });
            }

            async function fetchTwitterUrls() {
                // twitter_is_movingをtrueにして保存する
                following_list.twitter_is_moving = true;
                GM_setValue('pixiv_following_list', JSON.stringify(following_list));

                for (let i in following_list.pixiv_following) {
                    try {
                        analysisbutton.value = "実行しています　現在" + (Number(i) + 1) + "人目です";
                        console.log(Number(i) + 1 + "人目の解析");
                        console.log(following_list.pixiv_following[i].user_name + "さん")
                        // まだTwitter_idが書き込まれてない存在する場合
                        if (following_list.pixiv_following[i].Twitter_id === "" && following_list.pixiv_following[i].Twitter_id !== null) {
                            // htmlにHttpRequestを送ってHTMLをゲットする
                            var html = await HttpRequest("https://www.pixiv.net/users/" + following_list.pixiv_following[i].user_id);
                            html = html.querySelector("#meta-preload-data");
                            console.log(html);

                            if (JSON.parse(html.content).user[following_list.pixiv_following[i].user_id].social.twitter != undefined) {
                                console.log("TwitterのURL：" + JSON.parse(html.content).user[following_list.pixiv_following[i].user_id].social.twitter.url);
                                console.log("TwitterのID：" + JSON.parse(html.content).user[following_list.pixiv_following[i].user_id].social.twitter.url.replace("https://twitter.com/", ""));

                                // 読み込んだTwitter_idを書き込む
                                following_list.pixiv_following[i].Twitter_id = JSON.parse(html.content).user[following_list.pixiv_following[i].user_id].social.twitter.url.replace("https://twitter.com/", "");

                                console.log("Twitter_idを保存しました");

                                // keyをpixiv_following_listでfollowing_listを保存
                                GM_setValue('pixiv_following_list', JSON.stringify(following_list));

                                // 5秒待つ
                                await new Promise(resolve => setTimeout(resolve, 5000));
                            } else { // Twitter_idがない場合nullで埋める
                                following_list.pixiv_following[i].Twitter_id = null;
                                console.log("Twitter_idがなかったのでnullで埋めます");

                                // keyをpixiv_following_listでfollowing_listを保存
                                GM_setValue('pixiv_following_list', JSON.stringify(following_list));

                                // 5秒待つ
                                await new Promise(resolve => setTimeout(resolve, 5000));
                            }
                        } else {
                            console.log("既にTwitter_idが存在するのでスキップします");
                            console.log(following_list.pixiv_following[i].Twitter_id);
                        }
                    } catch (err) {
                        console.log(err);
                        location.reload()
                    }
                }
                // 終了したら終了しましたと書き換える
                analysisbutton.value = "終了しました 解析した人の数：" + following_list.pixiv_following.length;

                // twitter_is_movingをfalseにして保存する
                following_list.twitter_is_moving = false;
                GM_setValue('pixiv_following_list', JSON.stringify(following_list));
                location.reload();
            }
        }
    }



    if (location.href.match("www.pixiv.net")) {

        let previousUrl = location.href;

        if (location.href.match("https://www.pixiv.net/users/[0123456789]+") && !location.href.match("https://www.pixiv.net/users/[0123456789]+/following.*")) {
            console.log("Pixiv_Twitter_id");
            initAndUpdateFollowingList();
        } else {
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList' && document.body.contains(mutation.addedNodes[0])) {
                        let currentUrl = location.href;
                        if (currentUrl !== previousUrl) {
                            console.log('ページ遷移が発生しました。前のURL:', previousUrl, '現在のURL:', currentUrl);
                            // ページ遷移の処理を行う
                            previousUrl = currentUrl;
                            if (location.href.match("https://www.pixiv.net/users/[0123456789]+") && !location.href.match("https://www.pixiv.net/users/[0123456789]+/following.*")) {
                                initAndUpdateFollowingList()
                            }
                        }
                    }
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        function initAndUpdateFollowingList() {
            window.addEventListener('load', () => {
                // ページ起動時に一回関数を起動する
                var isFollowed = document.getElementsByClassName("sc-1bcui9t-2 bjEbrm")[0].children[0];
                updateFollowingList(isFollowed);

                document.querySelectorAll('button[data-click-action="click"]').forEach(button => {
                    button.addEventListener('click', () => {
                        // クリックされたときに実行する処理
                        console.log("フォロー状態が変更されました");
                        if (document.getElementsByClassName("sc-1bcui9t-2 bjEbrm")[0].children[0].innerHTML === "フォロー中") {
                            isFollowed = document.getElementsByClassName("sc-1bcui9t-2 bjEbrm")[0].children[0].innerHTML = "フォローする";
                        } else {
                            isFollowed = document.getElementsByClassName("sc-1bcui9t-2 bjEbrm")[0].children[0].innerHTML = "フォロー中";
                        }
                        updateFollowingList(isFollowed);
                    });
                });
            });
        }

        function updateFollowingList(isFollowed) {
            // 何かしたいこと
            var isFollowed = document.getElementsByClassName("sc-1bcui9t-2 bjEbrm")[0].children[0]; // フォロー状態を取得
            var Userpage_Twitter_URL = document.getElementsByClassName("_2AOtfl9"); // TwitterのURLを取得
            var Userpage_user_name = document.getElementsByClassName("sc-1bcui9t-5 ibhMns"); // ユーザーネームを取得

            var following_list = JSON.parse(GM_getValue('pixiv_following_list')); // Storageからpixiv_following_listの値を取得

            if (isFollowed.innerHTML === "フォロー中") {
                console.log("フォローしてます");
                if (following_list.pixiv_following.find(element => element.user_id == location.href.replace("https://www.pixiv.net/users/", "")) === undefined) {
                    console.log("ストレージにはなかったので追加します")
                    following_list.pixiv_following.push({ user_id: location.href.replace("https://www.pixiv.net/users/", ""), user_name: Userpage_user_name[0].innerHTML, Twitter_id: null });
                    console.log(following_list.pixiv_following);
                }

                Userpage_Twitter_URL = Userpage_Twitter_URL[0].children; // TwitterのURLがあるところの要素を取得
                for (var i = 0; i < Userpage_Twitter_URL.length; i++) {
                    if (Userpage_Twitter_URL[i].children[0].href.match("twitter.com")) {
                        console.log("ツイッターのリンクが存在します")
                        var Twitter_id = decodeURIComponent(Userpage_Twitter_URL[i].children[0].href.replace("https://www.pixiv.net/jump.php?url=", "")).replace("https://twitter.com/", "");

                        console.log("Twitter_id：" + Twitter_id);
                        console.log("https://twitter.com/" + Twitter_id);

                        for (var x = 0; x < following_list.pixiv_following.length; x++) {
                            if (following_list.pixiv_following[x].user_id === location.href.replace("https://www.pixiv.net/users/", "")) {
                                following_list.pixiv_following[x].Twitter_id = Twitter_id;
                            }
                        }
                    }
                }

            } else { // フォローしてなかった場合はその要素を削除する
                console.log("フォローしていません");
                for (var x = 0; x < following_list.pixiv_following.length; x++) {
                    if (following_list.pixiv_following[x].user_id === location.href.replace("https://www.pixiv.net/users/", "")) {
                        following_list.pixiv_following.splice(x, 1);
                        console.log("フォローを解除したので、Pixivのフォローリストから現在開いているユーザーを削除しました")
                    }
                }
            }
            // keyをpixiv_following_listでfollowing_listを保存
            GM_setValue('pixiv_following_list', JSON.stringify(following_list));
        }
    }



    if (location.href.match("//twitter.com/")) { // auto_pixiv_link_open

        console.log("auto pixiv link openを起動します");

        if (!location.href.match("https://twitter.com/home.*")) {
            openPixivProfileOnTwitter();
        }

        // イベントリスナーを設定
        document.addEventListener('click', (event) => {
            // クリックされた要素が指定されたクラスを持つ場合にのみ、openPixivProfileOnTwitter()関数を実行する
            if (event.target.classList.contains('css-1dbjc4n') && event.target.classList.contains('r-172uzmj') && event.target.classList.contains('r-1pi2tsx') && event.target.classList.contains('r-1ny4l3l') && event.target.classList.contains('r-o7ynqc') && event.target.classList.contains('r-6416eg') && event.target.classList.contains('r-13qz1uu')) {
                openPixivProfileOnTwitter();
            }
        });

        // 自己紹介欄とURL要素が見つかるまで関数を実行しない
        function openPixivProfileOnTwitter() {
            let check_pixiv_URL = setInterval(() => {
                if (document.querySelector("[data-testid=UserDescription]") !== null && document.querySelector("[data-testid=UserProfileHeader_Items]") !== null && document.getElementsByClassName("css-1dbjc4n r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs")[0] !== undefined) {
                    clearInterval(check_pixiv_URL);
                    console.log("Twitterのユーザーの自己紹介欄とURLの要素が見つかりました");
                    auto_pixiv_link_open();
                }
            }, 100);
        }

        async function auto_pixiv_link_open() {
            var html = null;

            // ここでpixivのt.co形式の短縮リンクのURLを取得
            var following_list = JSON.parse(GM_getValue('pixiv_following_list')); // 現在のlocalStorageからpixiv_following_listの値を取得
            console.log(following_list);

            // URLからTwitterのidを取得
            var Twitter_id = location.href.replace("https://twitter.com/", "");

            // pixivのフォローリストからTwitterのidで一致するユーザーがいるか検索、しなかったらnullにする
            var pixivUserUrl = null;
            for (var x = 0; x < following_list.pixiv_following.length; x++) {
                if (following_list.pixiv_following[x].Twitter_id === Twitter_id) {
                    pixivUserUrl = ("https://www.pixiv.net/users/" + following_list.pixiv_following[x].user_id);
                }
            }

            // 子要素を配列に分解
            var arr = [...document.querySelector("[data-testid=UserDescription]").children, ...document.querySelector("[data-testid=UserProfileHeader_Items]").children];
            // 子要素からpixivのURLがあったら取得
            var pixivAnchor = arr.find(function (element) {
                return "href" in element && element.textContent.includes("pixiv");
            });

            if (pixivUserUrl !== null) { // ユーザーが見つかったら
                console.log("PixivのUserのリストにTwitterIDが見つかったので読み込みます");
                a_create_element(true, true, pixivUserUrl);
            } else if (pixivAnchor === undefined) { // Twitterのユーザーの自己紹介欄とURLにpixiv等のURLがなければ終了
                console.log("Pixivのリンクが自己紹介欄とウェブサイトにありませんでした\nこのプログラムを終了します");
            } else {
                pixivAnchor = pixivAnchor.href;
                console.log("Pixivのt.co形式のリンクを検出しました\n" + pixivAnchor);

                // t.co形式のリンクをドメインがpixiv.*のURLに変換
                console.log("t.co形式のリンクのDOMを取得します");
                console.log("今からURLを取得します");
                html = await HttpRequest(pixivAnchor);

                html = html.querySelector("title");
                pixivUserUrl = html.text;
                html = "";
                console.log("pixivのURLを取得できました：" + pixivUserUrl);
                // pixivのユーザーリンクからhtmlを取得
                html = await HttpRequest(pixivUserUrl);

                // ログイン状態の確認
                console.log("pixivのユーザーページのhtmlを取得しました");
                var target = html.querySelectorAll("script");
                for (let i in target) {
                    if (target.hasOwnProperty(i)) {
                        if (target[i].textContent.match("use strict")) {
                            var islogin = target[i].textContent.includes("login: 'yes'");
                        }
                    }
                }
                console.log("ログイン状態：" + islogin);

                // フォロー状態の確認
                var isFollowed = Object.values(JSON.parse(html.querySelector("#meta-preload-data").content).user)[0].isFollowed;
                console.log("フォロー状態：" + isFollowed);

                a_create_element(islogin, isFollowed, pixivUserUrl);
            }
        }

        async function HttpRequest(URL) {
            var div;
            var DOM;
            try {
                const response = await new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: "GET",
                        url: URL,
                        onload: resolve,
                        onerror: reject
                    });
                });

                // 文字列をDOMに変換
                div = document.createElement('div');
                div.innerHTML = response.response;
                DOM = div;

                console.log("読み込んだDOM：\n");
                console.log(DOM);

                return DOM;
            } catch (err) {
                console.log(err);
                console.log("プログラムが停止しました");
            }
        }

        function a_create_element(islogin, isFollowed, pixivUserUrl) {
            // リンクa要素作成
            const pixivLinkClick = document.createElement("a");

            // リンク先を指定
            pixivLinkClick.href = pixivUserUrl;

            pixivLinkClick.target = "_blank";

            pixivLinkClick.classList.add("pixiv_link");

            if (islogin === false) {
                console.log("ログインしていません");

                // innerText
                style.textContent = `
                        a.pixiv_link {
                        background-color: white;
                        }
                        `;
                pixivLinkClick.innerText = "飛ぶ(ログインしていません)";
                pixivLinkClick.classList.add("no-login");
            }
            else if (isFollowed === true) {
                console.log("フォローしています");

                // innerText
                style.textContent = `
                        a.pixiv_link {
                        display: inline-block;
                        height: 36px;
                        vertical-align: top;
                        background-color: rgba(29,161,242,1);
                        color: white;
                        border-radius: 36px;
                        padding: 0 1em;
                        margin: 0 0.5em 10px 0.5em;
                        line-height: 36px;
                        text-decoration: none;
                        font-family: "Segoe UI",Meiryo,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
                        border: 1px solid rgba(29,161,242,1);
                        transition: box-shadow 0.3s, background-color 0.3s;
                        }
                        a.pixiv_link:hover {
                        box-shadow: 0px 2px 8px 0px rgb(0,0,0, 0.05);
                        background-color: rgba(0,0,0,0.05);
                        }
                        `;
                pixivLinkClick.innerText = "飛ぶ(Pixivでフォロー中)";
                pixivLinkClick.classList.add("following");
            }
            else if (islogin && !isFollowed) {
                console.log("フォローしていません");

                // innerText
                style.textContent = `
                        a.pixiv_link {
                        display: inline-block;
                        height: 36px;
                        vertical-align: top;
                        background-color: white;
                        color: black;
                        border-radius: 36px;
                        padding: 0 1em;
                        margin: 0 0.5em 10px 0.5em;
                        line-height: 36px;
                        text-decoration: none;
                        font-family: "Segoe UI",Meiryo,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
                        border: 1px solid rgba(29,161,242,1);
                        transition: box-shadow 0.3s, background-color 0.3s;
                        }
                        a.pixiv_link:hover {
                        box-shadow: 0px 2px 8px 0px rgb(0,0,0, 0.05);
                        background-color: rgba(0,0,0,0.05);
                        }
                        `;

                pixivLinkClick.innerText = "飛ぶ(Pixivでフォローする)";
                pixivLinkClick.classList.add("no-following");
            }

            //a要素を追加
            if (document.getElementsByClassName("pixiv_link").length === 0) {
                console.log(document.getElementsByClassName("css-1dbjc4n r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs")[0].insertBefore(pixivLinkClick, document.getElementsByClassName("css-1dbjc4n r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs")[0].firstChild));
                console.log("Pixivへのリンクを設置しました");
            }

            pixivUserUrl = "";
        }

        const style = document.createElement("style");
        document.head.appendChild(style);
    };

})();