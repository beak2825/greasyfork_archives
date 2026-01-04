// ==UserScript==
// @name         Tcafe Block User
// @namespace    http://tampermonkey.net/
// @version      4.25
// @description  티카페 특정 유저 글과 코멘트 숨기기
// @author       DandyClubs
// @include      /tcafe2a.com/
// @exclude      *://tcafe2a.com/bbs/memo.php
// @exclude      https://tcafe2a.com/bbs/mypost.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant	     GM_addStyle
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/418556/Tcafe%20Block%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/418556/Tcafe%20Block%20User.meta.js
// ==/UserScript==
(function() { var css = document.createElement('link'); css.href = 'https://use.fontawesome.com/releases/v5.15.4/css/all.css'; css.rel = 'stylesheet'; css.type = 'text/css'; document.getElementsByTagName('head')[0].appendChild(css); })();


GM_addStyle (`
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300&family=Noto+Sans+KR:wght@300&family=Noto+Sans:wght@300&display=swap');

body {
    font-family: 'Nanum Gothic', 'M PLUS Rounded 1c', 'Noto Sans', sans-serif !important;
}

.BanList {
    position: fixed !important;
    left: auto;
    right: 10px;
    border: 2px solid Tomato !important;
    text-align: center;
    font-family: 'Nanum Gothic', 'M PLUS Rounded 1c', 'Noto Sans', sans-serif !important;
    background-color: white !important;
    padding: .25em .5em;
    margin: auto;
    font-size: 14px;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 999999999 !important;
    cursor: pointer;
    max-height: 50%;
    overflow-y: auto;
}

.BanButton {
    position: fixed !important;
    left: auto;
    right: 10px;
    font-family: 'Nanum Gothic', 'M PLUS Rounded 1c', 'Noto Sans', sans-serif !important;
    background-color: white !important;
    padding: .25em;
    margin: auto;
    font-size: 20px;
    border-radius: 2em;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 999999999  !important;
    cursor: pointer;
}
.BanList-wrapper {
    text-align: left !important;
    font-size: 12px !important;
    font-family: 'Nanum Gothic', "Malgun Gothic", dotum, sans-serif !important;
    z-index: 999999999  !important;
    height: auto;
    margin: auto;
}
.BanCheck {
    text-align: center !important;
    margin: auto;
}
.BanCounts.fa-layers-counter {
    background-color: #ff253a !important;
    border-radius: 1em;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #fff !important;
    height: 1.5em;
    line-height: 1;
    max-width: 5em;
    min-width: 1.5em;
    overflow: hidden;
    padding: .25em;
    right: 0;
    text-overflow: ellipsis;
    top: 0;
    font-size: 14px;
    -webkit-transform: scale(0.65);
    transform: scale(0.65);
    -webkit-transform-origin: top right;
    transform-origin: top right;
}
.BanCounts.fa-layers-counter, .fa-layers-text {
    display: inline-block;
    position: absolute;
    text-align: center;
}
.BanNotice {
    position: relative;
    text-align: center;
    border-radius: 4px;
    color: white !important;
    background:Tomato !important;
    padding: .25em 1em;
    font-size: 12px;
    font-family: 'Nanum Gothic', 'M PLUS Rounded 1c', 'Noto Sans', sans-serif !important;
    right: 30px;
    z-index: 999999999 !important;
}
.w-side .f-side-wrap {
    font-size: 13px !important;
}
.fas.fa-user-slash {
    display: inline-block;
    position: absolute;
    text-align: center;
    padding: .25em;
    cursor: pointer;
}
.btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {
    display: inline-block !important;
}
.AddBan {
    position: absolute;
    display: inline-block;
    cursor: pointer;
}

.side-event-img{
    display: inline-block !important;
 }
`);

$(document).ready(function(){

    //목록 글쓰기 버튼 위치 변경
    var listwrite = document.querySelector('.print-hide.view-btn.text-right')
    if(listwrite){
        listwrite.remove()
        document.querySelector("div.view-wrap").insertAdjacentHTML('beforeend', listwrite.outerHTML)
    }

    // 차단유저 ID
    var IDs = JSON.parse(GM_getValue("IDs", "[]"))
    var IDsCounts = IDs.length
    var ShowHide = GM_getValue("ShowHide")

    document.querySelector("body.is-pc").insertAdjacentHTML('afterbegin', '<div class="BanButton"><i class="BanButtonIcon fas fa-user-shield" style="color:#FF2D00 !important;"></i><span class="BanCounts fa-layers-counter" style="background:Tomato;">' + IDsCounts + '</span></>')
    document.querySelector("body.is-pc").insertAdjacentHTML('afterbegin', '<div class="BanList"><i class="Banupdate far fa-save" style="color:#ff0000;"></i>&nbsp;&nbsp;BanList&nbsp;&nbsp;<i class="BanListClose fas fa-times" style="color:Tomato;"></i></>')

    if(ShowHide == 'Show'){
        $(".BanList").show()
        $(".BanButton").hide()
    }
    else{
        $(".BanButton").show()
        $(".BanList").hide()
    }


    let BanIDs = document.querySelectorAll('span.member')

    for (let i = 0; i < BanIDs.length; i++) {
        BanIDs[i].parentNode.insertAdjacentHTML('afterend', '&nbsp;<span class="AddBan"><i class="fas fa-user-slash" style="color:#FF2D00 !important;"></i></><div class="BanNotice" style="background:Tomato; display:none;"></div>')
    }

    let Addnab = document.querySelectorAll('.fa-user-slash')

    for (let i = 0; i < BanIDs.length; i++) {

        BanIDs[i].parentElement.closest('div').addEventListener("mouseover",togglebbtn,false);
        BanIDs[i].parentElement.closest('div').addEventListener("mouseout",togglebbtn,false);

        Addnab[i].style.visibility = "hidden";

    }


    //글쓰기 버튼 숨김
    if(/wr_id/.test(window.location.href)){
        $("h1 span").removeAttr("style")
        const form = document.getElementById('wr_content')
        const write = document.querySelector('.fa.fa-pencil').closest('a')
        form.addEventListener('focus', (event) => {
            write.style.visibility = "hidden"
        }, true);

        form.addEventListener('blur', (event) => {
            write.style.visibility = "visible"
        }, true);

    }

    IDs.forEach(function (item) {
        var idx = item.ID

        let IDNodeC = document.querySelectorAll('div.media-heading')
        let IDNodeW = document.querySelectorAll('td > div > a[onclick*="' + idx +'"]')

        //코멘트 제거
        if(IDNodeC && /wr_id/.test(window.location.href)){
            for(var i=0; i < IDNodeC.length; i++) {
                var matchIDc = IDNodeC[i].innerHTML.match(/showSideView\(this, (\'[\w]+\')/)
                if (IDNodeC[i].closest('div.media') && matchIDc[1] == idx) {
                    console.log('코멘트 번호 : ' + IDNodeC[i].closest('div.media').getAttribute('id') + ' -- 닉네임 : ' + item.NickName)
                    IDNodeC[i].closest('div.media').style.display = 'none';
                }
            }
        }
        //글목록에서 제거
        if(IDNodeW){
            for(var j=0; j < IDNodeW.length; j++) {
                var matchID = IDNodeW[j].outerHTML.match(/showSideView\(this, (\'[\w]+\')/)
                if (IDNodeW[j].closest('tr') && matchID[1] == idx) {
                    console.log('게시글 번호  : ' + IDNodeW[j].closest('tr').getAttribute('id') + ' -- 닉네임 : ' + item.NickName)
                    IDNodeW[j].closest('tr').style.display = 'none';
                }
            }
        }
    })

    function BanList(GetID, GetNickName, AddBanNoticei) {

        let searchID = IDs.find( ({ ID }) => ID === GetID )
        let searchNickName = IDs.find( ({ NickName }) => NickName === GetNickName )
        if(searchNickName){
            //alert("[ " + GetNickName + " ] 이미 차단 등록되었습니다!")
            AddBanNoticei.textContent = GetNickName + ' 이미 차단 등록되었습니다!'
            $(AddBanNoticei).slideDown('fast')
            setTimeout(function(){ $(AddBanNoticei).slideUp('slow') }, 2000);
        } else if(searchID){
            //alert("[ " + GetID + " ] 이미 차단 등록되었습니다!")
            AddBanNoticei.textContent = GetID + ' 이미 차단 등록되었습니다!'
            $(AddBanNoticei).slideDown('fast')
            setTimeout(function(){ $(AddBanNoticei).slideUp('slow') }, 2000);
        } else {
            IDs.push({ID : GetID, NickName : GetNickName});
            GM_setValue("IDs", JSON.stringify(IDs))
            document.querySelector('.BanCounts').textContent = IDs.length
            AddBanNoticei.textContent = GetNickName + ' 차단 등록되었습니다!'
            $(AddBanNoticei).slideDown('fast')
            setTimeout(function(){ $(AddBanNoticei).slideUp('slow') }, 1000);
            Reload()
        }
    }

    function update() {
        let BanCheck = document.querySelectorAll('.BanCheck')
        //console.log(BanCheck)
        for (let i = 0; i < BanCheck.length; i++) {
            if (BanCheck[i].checked == false){
                var RemoveNickName = BanCheck[i].getAttribute('NickName')
                //console.log(AddID)
                var removeIndex = IDs.map(function(item) { return item.NickName; }).indexOf(RemoveNickName);

                // remove object
                IDs.splice(removeIndex, 1);

            }
            if(i == BanCheck.length -1){
                GM_setValue("IDs", JSON.stringify(IDs))
                document.querySelector('.BanCounts').textContent = IDs.length
                Reload()
            }
        }
    }



    const Bancontainer = document.querySelector('.BanList')

    document.querySelector('.Banupdate').addEventListener("click", function(e){
        update()
    })

    function Reload() {
        var element = document.querySelectorAll('.BanList-wrapper')
        Array.prototype.forEach.call( element, function( node ) {
            node.parentNode.removeChild( node );
        });
        MakeList()
    }

    function MakeList() {
        for (let i = 0; i < IDs.length; i++) {
            let wrapper = document.createElement('div')
            wrapper.classList.add('BanList-wrapper')
            let checkbox = document.createElement('input')

            //label.textContent = ' ' + IDs[i].NickName + " [ " + document.querySelectorAll("td > a[onclick*=" + IDs[i].ID +"]").length + " | " + document.querySelectorAll("div.user > a[onclick*=" + IDs[i].ID +"]").length + " ]"
            checkbox.type = 'checkbox'
            checkbox.checked = true
            checkbox.setAttribute("class", 'BanCheck')
            checkbox.setAttribute("NickName", IDs[i].NickName)
            wrapper.appendChild(checkbox)
            Bancontainer.appendChild(wrapper)
            checkbox.insertAdjacentHTML('afterend', "&nbsp;&nbsp;" + IDs[i].NickName)
        }

    }

    $(".BanListClose").click(function(){
        $(".BanList").slideUp(function() {
            $(".BanButton").slideDown()
            ShowHide = 'Hide'
            GM_setValue("ShowHide", ShowHide)
        })
    })

    $(".BanButtonIcon").click(function(){
        $(".BanButton").slideUp(function() {
            $(".BanList").slideDown()
            ShowHide = 'Show'
            GM_setValue("ShowHide", ShowHide)
        })
    })


    let AddBanIcon = document.querySelectorAll('.AddBan')
    let AddBanNotice = document.querySelectorAll('.BanNotice')

    for (let i = 0; i < AddBanIcon.length; i++) {
        AddBanIcon[i].addEventListener("click", function(e){
            let getinfo = AddBanIcon[i].previousElementSibling.getAttribute('onclick')
            let GetNickName = AddBanIcon[i].previousElementSibling.textContent
            let GetID = getinfo.match(/showSideView\(this, (\'[\w]+\')/)[1]
            BanList(GetID, GetNickName, AddBanNotice[i])
            AddBanIcon[i].childNodes[0].style = "color: Indigo !important;"
        })
    }

    MakeList()

    function togglebbtn(e){
        var bbtn = e.currentTarget.querySelector('.fa-user-slash');
        if (bbtn){
            if (e.type == "mouseover") bbtn.style.visibility = "visible";
            else bbtn.style.visibility = "hidden";
        }
    }

})
