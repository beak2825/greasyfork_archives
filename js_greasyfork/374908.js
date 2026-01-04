// ==UserScript==
// @name         花瓣画板归档
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  按首字母归档；按下字母跳到对应位置；献给张小鸡同学！
// @author       javanli
// @match        http://huaban.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/374908/%E8%8A%B1%E7%93%A3%E7%94%BB%E6%9D%BF%E5%BD%92%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/374908/%E8%8A%B1%E7%93%A3%E7%94%BB%E6%9D%BF%E5%BD%92%E6%A1%A3.meta.js
// ==/UserScript==

// get request
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("X-Request", 'JSON');
    xmlHttp.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
    xmlHttp.setRequestHeader("Accept", 'application/json');
    xmlHttp.send(null);
}
function strcomp(strA, strB) {
    return strA.toLowerCase().localeCompare(strB.toLowerCase());
}
function boardComp(boardA,boardB){
    let strA = boardA.title;
    let strB = boardB.title;
    return strcomp(strA,strB)
}
function getBoardHtml(board){
    let pins = board.pins;
    let imgsrc = '';
    if(pins.length > 0){
        imgsrc = 'http://img.hb.aicdn.com/'+ pins[0].file.key +'_/both/50x50'
    }
    let url = '/boards/'+ board.board_id +'/'
    return `<a class="archived-board" href="${url}">
        <div class="ab-pin-placeholder">
            <img id="${board.board_id}-img" src="${imgsrc}"></img>
        </div>
        <div class="ab-pin-title">${board.title}</div>
        <div class="ab-pin-count">${board.pin_count}</div>
    </a>`
}
function getBoardsHTML(boards){
    let html = ''
    for(let board of boards){
        html += getBoardHtml(board)
    }
    return html
}
function genHTML(keyList,map){
    // let html = '<div onclick="app.requireLogin(function() {app.showDialogBox(\'create_board\');});" class="wfc add-board"><div class="inner"><i></i><span>创建画板</span></div></div>'
    let html = ''
    for(let key of keyList){
        html += '</br><h1 class="key-'+key+'">'+key+'</h1></br>'
        let boards = map[key]
        html += getBoardsHTML(boards)
    }
    html = '<div id="archived-boards">' + html + '</div>'
    return html
}
(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', function(){
        if(window.Cookie.read('uid') != window.app.page.user.user_id){
            return
        }
        if(app.page.$url.split('/').length != 3){
            return
        }
        document.addEventListener('keydown', function(event) {
            if(event.ctrlKey || event.shiftKey || event.altKey){
                return
            }
            let dom = document.querySelector('.key-'+event.key);
            if(dom){
                let top = dom.getBoundingClientRect().top+(window.pageYOffset||document.documentElement.scrollTop)-(document.documentElement.clientTop||0);
                console.log(event.key,dom,top)
                window.scrollTo(0,top - window.innerHeight/3)
                dom.classList.remove("keybounce");
                setTimeout(function(){
                    dom.classList.add("keybounce");
                },0)
                event.preventDefault()
                return false
            }
    
        });
        let board_cnt = app.page.user.board_count + 1
        let url = window.app.page.$url + '?' + String.uniqueID() + '&limit='+ board_cnt +'&wfl=1'
        httpGetAsync(url, (data) => {
            // handle boards data
            window.app.hotkey.keyboard.$events = {}
            window.app.hotkey.keyboard.options.events = {}
            let parsed = JSON.parse(data)
            window.app.user = parsed.user;
            let boards = parsed.user.boards;
            let map = {}
            let keyList = []
            let pinyin = new window.Pinyin()
            for(let board of boards){
                let title = board.title;
                board.sortFlag = '_'
                if(title.length > 0){
                    let parsed = pinyin.getChars(title[0])
                    if(parsed.length > 0){
                        board.sortFlag = parsed[0].toLowerCase()
                    }
                    else{
                        board.sortFlag = title[0].toLowerCase()
                    }
                }
                let key = board.sortFlag
                if(map[key]){
                    map[key].push(board)
                }
                else{
                    map[key] = [board]
                    keyList.push(key)
                }
            }
            keyList.sort(strcomp)
            for(let key of keyList){
                let boards = map[key]
                boards.sort(boardComp)
            }
            document.querySelector('#user_page .wrapper').innerHTML += genHTML(keyList,map)
        })
        let css = document.createElement("style");
            css.type = "text/css";
            css.innerHTML = `
#user_page #waterfall {
display:none;
}
#user_page .loading {
    visibility: hidden;
    height: 0;
    width: 0;
padding: 0;
    border: 0;
    margin: 0;
}
#archived-boards {
position: relative;
min-height: 500px;
margin: 16px auto 100px;
}
.archived-board {
width: 200px;
height: 50px;
display: inline-block;
background-color: white;
border-radius: 8px;
vertical-align:top;
    line-height: 50px;
    margin: 10px 35px;
}
.ab-pin-placeholder {
    width: 50px;
    height: 50px;
display: inline-block;
vertical-align:top;
}
.ab-pin-title {
    font-size: 16px;
    font-weight:bold;
    display: inline-block;
vertical-align:top;
text-overflow:ellipsis;
white-space: nowrap;
width:100px;
overflow: hidden;
}
.ab-pin-count {
    font-size: 16px;
    display: inline-block;
vertical-align:top;
width:40px;
}
.keybounce {
    animation:key-bounce 1s 3;
}
@keyframes key-bounce
{
0%,100% {transform:scale(1));transform-origin: 0% 0%;}
50% {transform:scale(2) translateY(-20px);transform-origin: 0% 0%;}
}

`
            document.body.appendChild(css);
    },false);
})();