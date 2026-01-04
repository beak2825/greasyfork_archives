// ==UserScript==
// @name        displayMillisecOnTwitter
// @namespace   https://twitter.com/kymn_
// @version     0.1.3
// @description Twitter上の日時表示の場所をSnowFrakeを元にミリ秒単位の表示に修正します
// @author      keymoon
// @license     MIT
// @supportURL  https://twitter.com/kymn_
// @match       https://twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/370098/displayMillisecOnTwitter.user.js
// @updateURL https://update.greasyfork.org/scripts/370098/displayMillisecOnTwitter.meta.js
// ==/UserScript==
(function(){
    //Body子要素更新の監視(急激なページレイアウトの変化、要するにユーザーページ等他ページとの遷移)
    (() => {
        const body = document.getElementsByTagName('body')[0];
        const bodyobserver = new MutationObserver(records => {resetObserver()});
        const bodyoptions = {childList:true,subtree:false}
        bodyobserver.observe(body,bodyoptions)

        var lastHref;
        var observers;
        //ページが更新されたらHrefが変わったか確認、変わってたらObserver張替え
        function resetObserver(){
            if(location.href === lastHref) return;
            lastHref = location.href;
            if(observers){
                console.dir(observers);
                observers.forEach(x => x.disconnect());
            }
            observers = [];
            console.dir("update");
            //タイムライン更新の監視
            observers.push((() => {
                //始めに一回オーバーライドしてあげる
                OverrideToolTip();
                const target = document.getElementById('stream-items-id');
                const observer = new MutationObserver(records => {OverrideToolTip()})
                const options = {childList: true};
                observer.observe(target, options);
                return observer;
                //各ツイートのツールチップの書き換え
                function OverrideToolTip(){
                    $('.tweet-timestamp').each(function(index, element){
                        var date = getDateFromSnowFrake(element.getAttribute('data-conversation-id'));
                        if(!date)return;
                        element.setAttribute('title',formatDate(date));
                    })
                }
            })());

            //画像ツイート更新の監視
            observers.push((() => {
                const target = document.getElementsByClassName('GalleryTweet')[0];
                const observer = new MutationObserver(records => {OverrideTimeStamp()})
                const options = {attributes: true};
                observer.observe(target, options);
                return observer;
                //ツイートのメタデータ部の書き換え
                function OverrideTimeStamp(){
                    var timeStamp = target.getElementsByClassName('tweet-timestamp')[0];
                    if(!timeStamp)return;
                    var date = getDateFromSnowFrake(timeStamp.getAttribute("data-conversation-id"));
                    if(!date)return;
                    timeStamp.setAttribute('title',formatDate(date));
                }
            })());


            //ツイート詳細ウィンドウの開閉の監視
            observers.push((() => {
                const target = document.getElementsByClassName('PermalinkOverlay-modal')[0];
                const observer = new MutationObserver(records => {OverrideMetaData()})
                const options = {attributes: true,subtree:true};
                observer.observe(target, options);
                return observer;
                //ツイートのメタデータ部の書き換え
                function OverrideMetaData(){
                    var tweetContainer = target.getElementsByClassName('permalink-tweet')[0];
                    if(!tweetContainer)return;
                    var date = getDateFromSnowFrake(tweetContainer.getAttribute("data-tweet-id"));
                    if(!date)return;
                    target.getElementsByClassName('metadata')[0].textContent = formatDate(date);
                }
            })());

            //アカウント画面のアカウント登録日時
            (() => {
                var joinDate = document.getElementsByClassName("ProfileHeaderCard-joinDateText")[0];
                if(!joinDate)return;
                var date = getDateFromSnowFrake(document.getElementsByClassName("ProfileNav")[0].getAttribute("data-user-id"));
                if(!date)return;
                joinDate.setAttribute("title",formatDate(date))
            })();
        }
    })();

    function getDateFromSnowFrake(ID){
        if(ID < 10000000000) return;
        var unixTime = Math.floor(parseInt(ID) / 4194304) + 1288834974657;
        return new Date(unixTime);
    }
    function formatDate(date){
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}:${date.getSeconds().toString().padStart(2,'0')}.${date.getMilliseconds().toString().padStart(3,'0')} - ${1900 + date.getYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
})();