// ==UserScript==
// @name         かんたんコメントプラス
// @namespace    http://tanbatu.github.io/
// @version      2.2
// @description  かんたんコメントをカスタム
// @author       You
// @match        *://www.nicovideo.jp/watch/*
// @match        *://www.nicovideo.jp/easycomment/setting
// @match        *://www.nicovideo.jp/my*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417044/%E3%81%8B%E3%82%93%E3%81%9F%E3%82%93%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%83%97%E3%83%A9%E3%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/417044/%E3%81%8B%E3%82%93%E3%81%9F%E3%82%93%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%83%97%E3%83%A9%E3%82%B9.meta.js
// ==/UserScript==
const url = location.href
if(url.match('.nicovideo.jp/watch/sm')){
    one()
}else if(url.match("jp/my")){
    document.getElementsByClassName('MainMenuContainer-right')[0].insertAdjacentHTML('beforebegin', '<a id="kankome" class="MainMenuItem" href="/my/mylist?EasyComment">かんコメ</a>')
}

function one() {
    document.getElementsByClassName('ControllerBoxCommentAreaContainer-commentPostAndLikeArea')[0].insertAdjacentHTML('afterend', `
    <div class="EasyCommentContainer-inner_Plus">
        <div class="PlusComment" style="transform: translateX(0px);text-align: center;padding-top: 5px;">
        </div>
    </div>
    <style>
    .Ecom{
        position: relative;
        min-width: 44px;
        height: 24px;
        margin-left:5px;
        padding: 0 6px;
        border: 2px solid #ddd;
        border-radius: 4px;
        background-color: #fff;
        color: #686868;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
    }
    .Ecom:hover{
        background-color:#cffcff;
    }
    </style>   `)

    //タグを取得
    let tag = []
    let find_tag

    let comment_Div = document.getElementsByClassName('PlusComment')[0]
    let TagElem = document.getElementsByClassName('Link TagItem-name')
    for (let i = 0; i < TagElem.length; i++) {
        tag.push(TagElem[i].textContent.toLowerCase())

    }
    tag.push('すべて')
    console.log(tag)

    let m= []
    let str = localStorage.getItem('EasyComment')
    let comment_List = JSON.parse(str.replace(/\\/g, ""))
    console.log(comment_List)

    for (let i = 0; i < comment_List.length; i++) {
        find_tag = tag.indexOf(comment_List[i].tag)
        console.log(tag)
        if (find_tag != -1) {
            console.log(i+'タグがあります' + tag[find_tag])
            console.log(Number(comment_List[i].comment.length))
            for(let d = 0;d<Number(comment_List[i].comment.length);d++){
                m.push(comment_List[i].comment[d])
            }

        } else {
            console.log('見つかりませんでした')
        }
    }
    addElement(m)


    function addElement(tagNum) {
        console.log(tagNum)
        for (i = 0; i < tagNum.length; i++) {
            comment_Div.insertAdjacentHTML('beforeend', '<button type="button" class="Ecom" id=' + i + '>' + tagNum[i] + '</button>')
        }
    }

    comment_Div.insertAdjacentHTML('beforeend','<a href="https://www.nicovideo.jp/my/mylist?EasyComment">設定</a>')
    let CommentInput = document.getElementsByClassName('CommentInput-textarea')[0]
    let PostButton = document.getElementsByClassName('ActionButton CommentPostButton')[0]


    function come(elements_text, text) {
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(elements_text, text), elements_text.dispatchEvent(new Event("input", {
            bubbles: !0
        }))
        PostButton.click()
    }
    let Comment_Buttons = document.querySelectorAll('.Ecom')
    for (i = 0; i < Comment_Buttons.length; i++) {
        Comment_Buttons[i].addEventListener("click", function () {
            console.log(this.id)
            come(CommentInput, m[this.id])
        })
    }

}

let List_Num = 1

let syutokunum=0
let befo
if (location.href == "https://www.nicovideo.jp/my/mylist?EasyComment") {
let Strage_List

let getitem;
    document.querySelector('.UserPage-main').insertAdjacentHTML('beforebegin', `<div id="back" style="
    position: absolute;
    z-index:1000;
    background-color: #fafafa;
    width: 100%;
    height: 100%;
    text-align:center;"><div class="lds-facebook"><div></div><div></div><div></div></div></div>
<style>
.lds-facebook {
  display: inline-block;

  position: relative;
  width: 80px;
  height: 80px;
}
.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: gray;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-facebook div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}
.lds-facebook div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.lds-facebook div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
    top: 8px;
    height: 64px;
  }
  50%, 100% {
    top: 24px;
    height: 32px;
  }
}
</style>`)

    document.getElementsByClassName('MainMenuItem MainMenuItem-active')[0].className = "MainMenuItem"
    window.onload = function () {
        let del_Button
        document.getElementById('kankome').className = "MainMenuItem MainMenuItem-active"
        let Active_Bar = document.getElementsByClassName('MainMenuItem MainMenuItem-active')[0].offsetLeft
        document.getElementsByClassName('MainMenuContainer-activeBorder')[0].style.transform = "translateX(" + Active_Bar + "px)"
        document.getElementsByClassName('SubMenuHeader MylistPageSubMenuHeader MylistPageSubMenu-header')[0].innerText = "かんたんコメント＋"
        document.getElementsByClassName('MylistPageSubMenu-action')[0].remove()
        document.getElementsByClassName('SubMenuLink')[0].remove()
        document.getElementById('back').remove()
        let mems = document.getElementsByClassName('SubMenuLink')
        mems[mems.length - 1].remove()
        getitem = localStorage.getItem('EasyComment')
        console.log(getitem)
        let jsonparse = [{comment: [], tag: "すべて"}]
        if(getitem==null || getitem=="[]"){
        localStorage.setItem('EasyComment',JSON.stringify(jsonparse))
        getitem = localStorage.getItem('EasyComment')}
        Strage_List = JSON.parse(getitem.replace(/\\/g, ""));

        document.getElementsByClassName('SubMenuLinkList MylistPageSubMenu-menu')[0].innerHTML = ""

        function addmenu() {
            document.getElementsByClassName('SubMenuLinkList MylistPageSubMenu-menu')[0].innerHTML = ""
            for (let i = 0; i < Strage_List.length; i++) {
                document.getElementsByClassName('SubMenuLinkList MylistPageSubMenu-menu')[0].insertAdjacentHTML('beforeend', `<li class="SubMenuLink MylistPageSubMenu-menuItem" title="` + Strage_List[i].tag + `"><a class="SubMenuLink-link SubMenuLink-link_internal " id="` + i + `"><span class="SubMenuLink-label">` + Strage_List[i].tag + ` </span></a></li>`)
            }
            document.getElementsByClassName('SubMenuLinkList MylistPageSubMenu-menu')[0].insertAdjacentHTML('beforeend', "<button class='ModalActionButton MylistsContainer-actionItem'>+新規作成</button>")
            document.getElementsByClassName('ModalActionButton MylistsContainer-actionItem')[0].addEventListener('click', function () {
            let new_ = window.prompt('適用するタグを入力してください。')
            Strage_List.push({ comment: [], tag: new_.toLowerCase() })
            localStorage.setItem('EasyComment', JSON.stringify(Strage_List))
            getitem = localStorage.getItem('EasyComment')
            Strage_List = JSON.parse(getitem.replace(/\\/g, ""));
            addmenu()
            loadcommentList(Strage_List.length - 1)
        })
            let list_Button = document.getElementsByClassName('SubMenuLink MylistPageSubMenu-menuItem')
            for (let i = 0; i < list_Button.length; i++) {
                list_Button[i].addEventListener('click', function () {
                    console.log(this.childNodes[0].id)
                    let id_ = this.childNodes[0].id
                    loadcommentList(id_)

                })
            }
        }
        addmenu()



        function loadcommentList(List_Num) {
            let d = document.getElementsByClassName('MylistPage-content')[0].innerHTML = ""
            document.getElementsByClassName('MylistPage-content')[0].insertAdjacentHTML('beforeend', `
<a id="deletekey" href="javascript:console.log('削除確認中...')">削除する</a>
<p><span style="font-size:30px;">`+ Strage_List[List_Num].tag + `
</span>タグに適用されるかんたんコメント</p>
<div id="input_block" style="
    display: flex;
"><input id="taginput" placeholder="ここにタグを入力"><button id="addbutton" class="ModalActionButton SubMenuButton MylistPageSubMenu-actionButton" style="
    border-radius: 0px;
    height: 99%;
    background-color: gray;
    color: white;
"><svg viewBox="0 0 10 10" class="AddIcon"><path d="M4.2 8.9V5.8h-3a.8.8 0 110-1.6h3v-3a.8.8 0 111.6 0v3h3a.8.8 0 110 1.6h-3v3a.8.8 0 11-1.6 0z" fill="#fff"></path></svg></button></div>
<style>
#input_block{
 border: 1px solid gray;
  border-radius:2px;
  width:70%;
  height:30px;
}
#taginput{
width:98%;
  height:94%;
  border-width:0px;
  border-radius:3px;

}
#taginput:focus {
  outline:none;
}
</style>
    `)
             function add(){

                        let value = document.getElementById('taginput').value
                         document.getElementById('taginput').value=""
                 if(value!=""){
                document.getElementsByClassName('MylistPage-content')[0].insertAdjacentHTML('beforeend', `
    <div style="display:flex;padding-top:5px"><div style="
    box-shadow: 0 0 4px 0 rgba(0,0,0,.2);
    border-radius: 2px;
    color: #252525;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0;
    cursor: pointer;
    width: 70%;
    margin-top: 5px;
    background-color: white;
    font-size: 150%;
"><p style="
margin:0px;
    padding: 5px;
    color: #3e3e3e;
">`+ value + `</p></div></div>`
                )
                Strage_List[List_Num].comment.push(value)
                localStorage.setItem('EasyComment', JSON.stringify(Strage_List))
                 }
    }

$("#taginput").keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        add()
    }

});



            document.getElementById('deletekey').addEventListener('click', function () {
                let del = window.confirm('本当に削除してよろしいですか？')
                if (del == true) {
                    Strage_List.splice(List_Num, 1);
                    localStorage.setItem('EasyComment', JSON.stringify(Strage_List))
                    loadcommentList(0)
                    addmenu()
                }
            })
            let add_Button = document.getElementById('addbutton')
            add_Button.addEventListener('click', function () {
                add()
            })
            for (let i = 0; i < Strage_List[List_Num].comment.length; i++) {
                document.getElementsByClassName('MylistPage-content')[0].insertAdjacentHTML('beforeend', `
    <div style="display:flex;padding-top:5px"><div style="
    box-shadow: 0 0 4px 0 rgba(0,0,0,.2);
    border-radius: 2px;
    color: #252525;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0;
    cursor: pointer;
    width: 70%;
    margin-top: 5px;
    background-color: white;
    font-size: 150%;
"><p style="
    margin:0px;
    padding: 5px;
    color: #3e3e3e;
">`+ Strage_List[List_Num].comment[i] + `</p></div><p  class="del_button">×</p></div>`)
            }
$('.del_button').on('click', function(){
  var index = $('.del_button').index(this);
  console.log(index + 'th item clicked!');
  this.parentNode.remove()
  Strage_List[List_Num].comment.splice(index,1)
    localStorage.setItem('EasyComment', JSON.stringify(Strage_List))
});
        }
        loadcommentList(0)


    }
}
