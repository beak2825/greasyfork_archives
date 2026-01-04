// ==UserScript==
// @name         e-typing 長文拡張v1
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  拡張
// @author       norara
// @license MIT
// @match        https://www.e-typing.ne.jp/app/*chobun*
// @match        https://www.e-typing.ne.jp/app/*variety.long*
// @exclude      https://www.e-typing.ne.jp/app/ad*
// @icon         https://www.e-typing.ne.jp/images/roma/typing/variety/ico_keybo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488419/e-typing%20%E9%95%B7%E6%96%87%E6%8B%A1%E5%BC%B5v1.user.js
// @updateURL https://update.greasyfork.org/scripts/488419/e-typing%20%E9%95%B7%E6%96%87%E6%8B%A1%E5%BC%B5v1.meta.js
// ==/UserScript==
let chobun = false
let exampleList = [];

const iframe_observer = new MutationObserver(e=>{
    if(chobun || /(chobun|variety.long)/.test(location.href) || $(".title:eq(0)").text().includes("長文")){
        window.parent.document.getElementById("exampleList").style.display = "block";
        chobun = true
        let add = e[0].addedNodes[0];
        let remove = e[0].removedNodes[0];
        if(add && add.id == "example_container"){
            const example_observer = new MutationObserver(e=>{
                if(e[0].removedNodes[0] && e[0].removedNodes[0].id == "countdown"){
                    let exampleIndex = exampleList.findIndex(e=>{return e.example == $("#exampleText:eq(0)").text()})
                    exampleIndex != -1 ? exampleList[exampleIndex].count++ : exampleList.push({"example":$("#exampleText:eq(0)").text(),"count":1});
                    console.log(exampleList)
                    addExample(exampleList)
                }
            })
            example_observer.observe($("#example_container:eq(0)")[0],{childList:true})
        }
        if(remove && remove.id == "second_container"){
            const result_observer = new MutationObserver(e=>{
                $("#exampleList").css("width","371px"); //横方向のスクロールバーが消える幅に
                $(".data:gt(8)").text("-"); //前回の結果消去
                $(".sentence").eq(0).mouseover(e=>{
                    if($(e.target).is("[data-tooltip]")){
                        let strCount = $("[data-tooltip]").index(e.target) + 1;
                        let time = 0;
                        $("[data-tooltip]:lt("+strCount+")").each((i,e)=>{
                            time += parseFloat($(e).attr("data-tooltip"))
                        })
                        $(".data:eq(11)").text((time<60 ? "" : parseInt(time/60) + "分") + String((time%60).toFixed(2)).replace(".","秒"));
                        $(".data:eq(12)").text(strCount);
                        $(".data:eq(14)").text((strCount / time * 60).toFixed(2))
                    }
                });
            })
            result_observer.observe(document.getElementById("result"),{childList:true})
        }
    }else{
        iframe_observer.disconnect();
    }
})

iframe_observer.observe($("#app:eq(0)")[0],{childList:true})

function addExample(el){
    console.log("実行してるよ")
    el = el.sort((a,b)=>{return b.count - a.count}); //countの降順でソート
    let HTML = "";
    for(var i in el){
        HTML += `
            <li class="list">
                <div class="count">${el[i].count}</div>
                <div class="example" title="${el[i].example}">${el[i].example}</div>
            </li>`
    }
    window.parent.document.getElementById("exampleList").innerHTML = HTML;
}


window.parent.document.body.insertAdjacentHTML("afterbegin",`
    <div id="exampleList">
        <li class="list">
            <div class="count">-</div>
            <div class="example">---</div>
        </li>
    </div>`);
window.parent.document.body.insertAdjacentHTML("afterbegin",`
    <style>
        #exampleList{
            display: none;
            width: 300px;
            height: auto;
            background-color: rgba(5,127,255,.8);
            box-shadow: 0px 0px 10px rgba(0,0,0,.5);
            border: 2px solid #000;
            border-radius: 10px;
            padding: 5px;
            position: absolute;
            cursor: grab;
            z-index: 31415926;
        }

        #exampleList li{
            color: #fff;
            list-style-type: none;
            display: flex;
            border: 1px solid #d7d8da;
            border-radius: 3px;
            padding: 5px 7px;
            margin: 3px;
        }

        .count{
            width: auto;
            padding-right: 10px;
            float: left;
        }

        .example{
            width: auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            float: right;
        }
    </style>
    `)


var exampleListElement = window.parent.document.getElementById('exampleList');

// ドラッグが開始された時のマウスの座標を保持する変数
var offsetX, offsetY;

// ドラッグ中の要素を移動する関数
function dragElement(e) {
    exampleListElement.style.cursor = "grabbing";
    // ドラッグ中のマウスの座標を取得し、要素の新しい位置を計算します
    var x = e.clientX - offsetX;
    var y = e.clientY - offsetY;

    // 新しい位置を要素のスタイルに設定します
    exampleListElement.style.left = x + 'px';
    exampleListElement.style.top = y + 'px';
}

// マウスが要素上でクリックされた時の処理
exampleListElement.addEventListener('mousedown', function(e) {
    // ドラッグが開始された時のマウスの座標を取得します
    offsetX = e.clientX - exampleListElement.offsetLeft;
    offsetY = e.clientY - exampleListElement.offsetTop;

    // ドラッグ中のマウスの動きを監視します
    window.parent.document.addEventListener('mousemove', dragElement);

    // ドラッグ終了時の処理を設定します
    window.parent.document.addEventListener('mouseup', function() {
        exampleListElement.style.cursor = "grab";
        // ドラッグ中のマウスの動きを停止します
        window.parent.document.removeEventListener('mousemove', dragElement);
    });
});
