// ==UserScript==
// @name         [TypingTube] メニュー追加
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://typing-tube.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503173/%5BTypingTube%5D%20%E3%83%A1%E3%83%8B%E3%83%A5%E3%83%BC%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/503173/%5BTypingTube%5D%20%E3%83%A1%E3%83%8B%E3%83%A5%E3%83%BC%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

/*追加方法*/
/*

シンプルなリンク

{
        "name":"表示させる名前",
        "url":"URL",
        "type":"s"
}


押したら開くメニューの追加

{
        "name":"開く前に表示させる名前",
        "url":"ここのURLは未記入でOK",
        "type":"f",
        "contents":
        [{
            "name":"開いて出てきた要素①に表示させる名前",
            "url":"開いて出てきた要素①に設定するリンク",
        },{
            "name":"開いて出てきた要素②に表示させる名前",
            "url":"開いて出てきた要素②に設定するリンク",
        }]
}


*/
//////////////////////////////////////////////

(function() {
    let Element = '';
    const linkList = [{
        "name":"いいね済",
        "url":"https://typing-tube.net/my/movies/liked",
        "type":"s"
    },{
        "name":"後でプレイ",
        "url":"https://typing-tube.net/my/todo_list",
        "type":"s"
    },{
        "name":"English",
        "url":"https://typing-tube.net/my/movies?keyword=English",
        "type":"s"
    },{
        "name":"追加メニュー",
        "url":"",
        "type":"f",
        "contents":
        [{
            "name":"難関譜面集",
            "url":"https://docs.google.com/spreadsheets/d/1tx_7nqeW-yDeyL-hHt-NQ4PE9zxMQVcj0fhGjI9XjtI/edit#gid=1819483419",
        },{
            "name":"カスタムグーグル検索",
            "url":"https://cse.google.com/cse?cx=7a05cec5b0f94b1e9#gsc.tab=0",
        }]
    }
    ]

    function Fmenu(c,n){
        let element = '';
        c.forEach((x)=>{
            const HTML = `<li class="@@sidebaractive"><a href="${x["url"]}">${x["name"]}</a></li>`;
            element += HTML;
        })
        console.log(n)
        const newHTML = `<li class="navigation__sub @@variantsactive"><a href="" class="text-nowrap">📁&nbsp;${n}</a><ul style="display: none">${element}</ul></li>
        `;
        return newHTML;
    };

    linkList.forEach((l)=>{
        if(l.type === "s"){
            const HTML = `<li class="navigation"><a href="${l["url"]}">${l["name"]} </li>`
            Element += HTML
        }else{
            const HTML = Fmenu(l["contents"],l["name"]);
            Element += HTML;
        }

    })
    const user = document.getElementsByClassName('user')[0]
    user.parentElement.querySelector('ul').insertAdjacentHTML("afterbegin", Element);

})();