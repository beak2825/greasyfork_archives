// ==UserScript==
// @name         (開発中止)ニコニコ除ニコレポEx
// @namespace    https://greasyfork.org/users/175598
// @description  ニコレポをフィルタリングします
// @match        https://www.nicovideo.jp/my/top
// @match        https://www.nicovideo.jp/my/top/*
// @match        https://www.nicovideo.jp/user/*
// @match        http://www.nicovideo.jp/my/top
// @match        http://www.nicovideo.jp/my/top/*
// @match        http://www.nicovideo.jp/user/*
// @grant        none
// @author       Original by Fushihara,Modded by N.Y.Boyu
// @license      Creative Commons Zero 1.0 Universal
// @version      2019.05.14
// @downloadURL https://update.greasyfork.org/scripts/39778/%28%E9%96%8B%E7%99%BA%E4%B8%AD%E6%AD%A2%29%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%99%A4%E3%83%8B%E3%82%B3%E3%83%AC%E3%83%9DEx.user.js
// @updateURL https://update.greasyfork.org/scripts/39778/%28%E9%96%8B%E7%99%BA%E4%B8%AD%E6%AD%A2%29%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%99%A4%E3%83%8B%E3%82%B3%E3%83%AC%E3%83%9DEx.meta.js
// ==/UserScript==
// Original by Fushihara:https://github.com/fushihara/nico-repo

(function(){
    //dataset(data-属性)を代入する
    var setDataset=function(Elem,Data){
        for(let key in Data)Elem.dataset[key]=Data[key];
    };
    //要素を作成してプロパティを代入する
    var makeElem=function(Type,Props){
        var Elem=document.createElement(Type);
        for(let key in Props){
            if(key==="dataset")setDataset(Elem,Props[key]);
            else Elem[key]=Props[key];
        }
        return Elem;
    };
    /*
    var setProps=function(Target,Props,Safety){
        if(typeof Safety==="undefined")Safety=setProps;
        for(let key in Props){
            if(typeof Props[key]==="object"&&Props[key]!==null){
                switch(Object.prototype.toString.call(Props[key])){
                    case "[object Array]":
                        if(Props[key].length===2&&Props[key][0]===Safety){
                            Target[key]=Props[key][1];
                            continue;
                        }
                    break;
                    case "[object Object]":
                        setProps(Target[key],Props[key]);
                    continue;
                }
            }
            Target[key]=Props[key];
        }
    };
    */

    const localStorageKey="niconicoRemoveNicorepoEx_modBoyu";
    //class名につける接頭語
    const classPrefix="removenicorepoex";
    //更新をお知らせするためのバージョン数
    const UIversion=190514;
    //挿入するstyleタグの中身(css)
    const myStyle=`\
a.${classPrefix}-toggle-button[data-opened="no"] + .${classPrefix}-toggle-area {
    display:none;
}
a.${classPrefix}-toggle-button > span.${classPrefix}-updated-notice {
    display:inline;
    background:rgba(0,0,0,0);
    width:auto;
    font-size:11px;
    color:red;
    background-color:white;
    border-radius:6px;
    padding:0px 3px;
    font-weight:bold;
}
div.${classPrefix}-toggle-area {
    overflow:hidden;
    font-weight:normal;
    display:block;
}
button.${classPrefix}-type-button,
button.${classPrefix}-save-button {
    font-size:smaller;
    float:right;
}
div.${classPrefix}-type-area {
    overflow:hidden;
    clear:right;
}
label.${classPrefix}-check-label {
    line-height:2.0em;
    color:black;
    padding:1px 8px 1px 5px;
    border-radius:10px;
    display:block;
    float:left;
    margin:5px 3px;
    background:#C7C7C7;
    background:linear-gradient(white,#8F8F8F);
}
label.${classPrefix}-check-label[data-checked="yes"] {
    background:#8EFFFF;
    background:linear-gradient(white 25%,#1DFFFF);
}`;
    var nicorepoElement;
    var init=function(){
        if(nicorepoElement=document.getElementById("nicorepo")){
            loadTopicChecks();
            initObserve(document.querySelector(`#nicorepo > [id$="PageNicorepoApp"]`));
            initInterface(document.querySelector(`#nicorepo > h3`));
        }
    };

    //ローカルストレージ
    var TopicChecks={};
    var saveTopicChecks=function(){
        localStorage.setItem(localStorageKey,JSON.stringify(TopicChecks));
    };
    var loadTopicChecks=function(){
        TopicChecks=JSON.parse(localStorage.getItem(localStorageKey))||{};
    };

    //各ニコレポにdata-topicを追加
    var initObserve=function(observeTarget){
        //ノードが追加された時にイベントを仕込む
        (new MutationObserver(mutationRecords => {
            for(let {target:t} of mutationRecords)if(t.className==="log-body")initializeOneLog(t);
        })).observe(observeTarget,{childList:true,subtree:true});
        //起動遅延時の保険用
        for(let t of observeTarget.querySelectorAll(`.log-body`))initializeOneLog(t);
    };
    var initializeOneLog=function(bodyElement){
        const baseElement=bodyElement.offsetParent;
        if(!baseElement)return;
        //bodyからリンクを抽出して解析する
        for(let {href} of bodyElement.getElementsByTagName("a")){
            const searchResult=/[?&]_topic=([a-z_]+)/.exec(href);
            if(searchResult!==null && TopicChecks.hasOwnProperty(searchResult[1])){
                baseElement.dataset.topic=searchResult[1];
                return;
            }
        }
        //登録済みのtopic名に一致しなかった
        baseElement.dataset.topic="filter_unknown_pattern";
        console.log("ニコニコ除ニコレポEx:新パターン:"+bodyElement.innerHTML);
    };

    var initInterface=function(addTarget){
        //styleタグを作成。後にtopicStyleを差し込む
        var thisStyle=makeElem("style",{innerHTML:myStyle});
        //topicごとに表示・非表示を切り替えるルールを追加する
        var topicStyle="";
        //#nicorepoの data-topic_( topic名 ) によって表示・非表示を切り替える
        var updateStyle=function(topic,checked){
            nicorepoElement.dataset[`topic_${topic}`]=checked?"show":"hide";
        };

        //最後にクリックしたバージョンが、今のバージョンより前だったら"更新"ラベルを表示する
        var UIupdated=(localStorage.getItem(`${localStorageKey}-last-click-version`) || 1) < UIversion;

        //トグルボタンそのものを作る
        addTarget.appendChild(makeElem("a",{
            className:`${classPrefix}-toggle-button`,
            innerHTML:`<span></span>表示フィルタリング切り替え`+
                (UIupdated?`<span class="${classPrefix}-updated-notice">更新</span>`:""),
            href:"//",
            dataset:{opened:"no"},
            onclick:({target:This}) => {
                //spanタグがtargetになった時、親のaタグに差し替える
                if(This.className!==`${classPrefix}-toggle-button`)This=This.parentNode;
                if(UIupdated){
                    UIupdated=false;
                    //"更新"ラベルを外す
                    This.removeChild(This.lastChild);
                    //最後にクリックしたバージョンを更新する
                    localStorage.setItem(`${localStorageKey}-last-click-version`,UIversion);
                }
                This.dataset.opened=(This.dataset.opened==="no")?"yes":"no";
                return false;
            }
        }));

        //トグルボタンで表示されるフィルタリング対象切り替えエリアを作る
        const toggleArea=makeElem("div",{className:`${classPrefix}-toggle-area`});

        //typeごとのフィルタリングを切り替えるボタンを作る
        const toggleTypeButton=makeElem("button",{className:`${classPrefix}-type-button`,innerHTML:"全て表示/非表示"});
        var toggleTypeEvent=({target:{nextSibling:{childNodes:checkBoxes}}}) => {
            //無いとは思うけど、要素が無い時はそのまま返す
            if(checkBoxes.length===0)return;
            const firstChecked=checkBoxes[0].firstChild.checked;
            for(let {firstChild:control} of checkBoxes){
                //一番目のボタンの状態と同じ=>クリックする
                if(control.checked===firstChecked){
                    control.checked=!firstChecked;
                    toggleArea.onchange({target:control});
                }
            }
        };

        //typeごとのエリアを作る
        var toggleTypeArea=makeElem("div",{className:`${classPrefix}-type-area`});
        var addType=function(Label,hasButton){
            toggleArea.insertAdjacentHTML("beforeend",Label);
            //cloneNodeはノード(outerHTML)のみ複製するので、js上で登録したイベントは引き継がない
            if(hasButton)toggleArea.appendChild(toggleTypeButton.cloneNode(true)).onclick=toggleTypeEvent;
            //cloneNode(true)にすると子要素も複製してしまうので(false)を指定する
            toggleTypeArea=toggleArea.appendChild(toggleTypeArea.cloneNode(false));
        };

        //～が…のチェックボックスを作る
        const checkBoxTemplate=makeElem("label",{
            className:`${classPrefix}-check-label`,
            innerHTML:`<input type="checkbox">`,
            dataset:{checked:"no"}
        });
        var addTopics=function(Topics,Label){
            //checkBoxを複製する
            var checkBox=checkBoxTemplate.cloneNode(true);
            //いずれかのTopicChecksがtrueか存在しない(初期状態)場合、チェックを付ける
            var Checked=false;
            for(let Topic of Topics){
                if(!TopicChecks.hasOwnProperty(Topic)||TopicChecks[Topic]){
                    Checked=true;
                    checkBox.dataset.checked="yes";
                    checkBox.firstChild.checked=true;
                    break;
                }
            }
            for(let Topic of Topics){
                //TopicChecksをCheckedに合わせる
                TopicChecks[Topic]=Checked;
                //topicStyleに表示・非表示を切り替えるルールを追加する
                topicStyle+=`#nicorepo[data-topic_${Topic}="hide"] div[data-topic="${Topic}"] { display:none; }\n`;
                updateStyle(Topic,Checked);
            }
            checkBox.topics=Topics;
            checkBox.insertAdjacentHTML("beforeend",Label);
            toggleTypeArea.appendChild(checkBox);
        };

        //type,topicの追加
        //参考:https://nicovideo.cdn.nimg.jp/uni/scripts/pages/my/nicorepo/message/ja-jp.js
        addType("ユーザーが… or ユーザーが投稿した動画が…",true);
        addTopics(["nicovideo_user_video_upload"],"動画を投稿");
        addTopics(["nicovideo_user_video_kiriban_play"],"再生数達成");
        addTopics(["nicovideo_user_video_update_highest_rankings"],"ランキング達成");
        addTopics(["nicovideo_user_video_live_introduce"],"生放送で紹介");
        addTopics(["nicovideo_user_video_advertised_announce",
                   "nicoad_user_advertised_video_announce"],"広告された");
        addTopics(["nicovideo_user_video_advertise",
                   "nicoad_user_advertise_video"],"広告した");
        addTopics(["nicovideo_user_community_member_only_video_upload"],"コミュニティ専用動画を投稿");
        addTopics(["nicoseiga_user_illust_upload"],"イラストを投稿");
        addTopics(["nicoseiga_user_illust_clip"],"イラストをクリップ");
        addTopics(["nicoseiga_user_manga_episode_upload"],"マンガを投稿");
        addTopics(["nicoseiga_user_manga_content_favorite"],"マンガをお気に入り登録");
        addTopics(["nicovideo_user_nicogame_upload",
                   "nicogame_user_game_upload"],"ゲームを投稿");
        addTopics(["nicovideo_user_nicogame_update",
                   "nicogame_user_game_update"],"ゲームを更新");
        addTopics(["nicovideo_user_blomaga_upload"],"記事を投稿");
        addTopics(["nicovideo_user_solid_upload"],"立体を投稿");
        addTopics(["nicovideo_user_solid_distribute"],"立体の配布データを公開");
        addTopics(["nicovideo_user_solid_update"],"立体の配布データを更新");
        addTopics(["nicovideo_user_solid_favorite"],"立体をお気に入り登録");
        addTopics(["nicovideo_user_knowledge_upload"],"ナレッジを投稿");
        addTopics(["nicovideo_user_app_install"],"アプリを開始");
        addTopics(["nicovideo_user_stamp_obtain"],"スタンプを取得");
        addTopics(["nicovideo_user_followed_announce"],"あなたをフォロー");
        addTopics(["nicovideo_user_mylist_followed_announce"],"あなたのマイリストをフォロー");
        addTopics(["nicovideo_user_mylist_add_video"],"動画をマイリスト登録");
        addTopics(["nicovideo_user_mylist_add_manga_episode"],"マンガをマイリスト登録");
        addTopics(["nicovideo_user_mylist_add_book"],"書籍をマイリスト登録");
        addTopics(["nicovideo_user_mylist_add_blomaga_article"],"ブロマガをマイリスト登録");
        addTopics(["nicovideo_user_temporary_mylist_add_video"],"動画をとりあえずマイリスト登録");
        addTopics(["nicovideo_user_temporary_mylist_add_manga_episode"],"マンガをとりあえずマイリスト登録");
        addTopics(["nicovideo_user_temporary_mylist_add_book"],"書籍をとりあえずマイリスト登録");
        addTopics(["nicovideo_user_temporary_mylist_add_blomaga_article"],"ブロマガをとりあえずマイリスト登録");
        addTopics(["nicoad_user_advertised_program_announce"],"生放送が広告された");
        addTopics(["nicoad_user_advertise_program"],"生放送を広告した");
        addTopics(["live_user_program_cas_onairs"],"実験放送を開始");
        addTopics(["nicoad_user_advertised_program_cas_announce"],"実験放送が広告された");
        addTopics(["nicoad_user_advertise_program_cas"],"実験放送を広告した");
        addType("コミュニティが…",true);
        addTopics(["live_user_program_onairs"],"生放送を開始");
        addTopics(["live_user_program_reserve"],"生放送を予約");
        addTopics(["nicovideo_community_level_raise",
                   "nicommunity_community_no_privileged_levelup",
                   "nicommunity_community_privileged_levelup"],"レベル上昇");
        addTopics(["nicovideo_user_community_info_add",
                   "nicommunity_user_community_news_created"],"お知らせを追加");
        addTopics(["nicovideo_user_community_video_add",
                   "nicommunity_user_video_registered"],"動画を追加");
        addType("チャンネルが…",true);
        addTopics(["live_channel_program_onairs"],"生放送を開始");
        addTopics(["live_channel_program_reserve"],"生放送を予約");
        addTopics(["nicovideo_channel_blomaga_upload"],"記事を追加");
        addTopics(["nicovideo_channel_info_add"],"お知らせを追加");
        addTopics(["nicovideo_channel_video_upload"],"動画を追加");
        addType("それ以外の…",false);
        addTopics(["filter_unknown_pattern"],"新パターン");

        //設定保存ボタンを作る
        const toggleSaveButton=makeElem("button",{
            className:`${classPrefix}-save-button`,
            innerHTML:"設定保存",
            disabled:true,
            onclick:({target:This}) => {
                saveTopicChecks();
                This.disabled=true;
            }
        });
        toggleArea.appendChild(toggleSaveButton);

        //チェックボックスのイベントを登録する
        toggleArea.onchange=({target:{checked,parentNode:{dataset,topics}}}) => {
            //ラベルの外見を変える
            dataset.checked=checked?"yes":"no";
            for(let topic of topics){
                //セーブ時の為の変数を更新する
                TopicChecks[topic]=checked;
                updateStyle(topic,checked);
            }
            if(toggleSaveButton.disabled)toggleSaveButton.disabled=false;
        };
        addTarget.appendChild(toggleArea);

        //styleタグを追加する
        thisStyle.insertAdjacentHTML("afterbegin",topicStyle);
        document.body.appendChild(thisStyle);
    };

    init();
})();