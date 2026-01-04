// ==UserScript==
// @name         show content tree
// @namespace    com.blowham.show_content_tree
// @version      0.1.1
// @description  にこにこ動画でコンテンツツリーボタンを追加
// @author       hukihamu
// @match        https://www.nicovideo.jp/watch/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411179/show%20content%20tree.user.js
// @updateURL https://update.greasyfork.org/scripts/411179/show%20content%20tree.meta.js
// ==/UserScript==

(function() {
    function setIcon(){
        let findCount = 0
        const findInterval = setInterval(function(){
            if(180 < findCount){
                clearInterval(findInterval)
                findCount = 10000
            }
            findCount++
            const menu = document.getElementsByClassName("VideoMenuContainer-areaLeft")[0]
            if ( menu !== undefined ){
                const treeDiv = document.createElement("div")
                treeDiv.className = "ClickInterceptor is-inline LoginRequirer"
                const dStyle = treeDiv.style
                dStyle.width = "28px"
                dStyle.height = "28px"
                dStyle.margin = "0px"

                const treeButton = document.createElement("button")
                treeButton.className = "ActionButton VideoMenuContainer-button"
                treeButton.onclick = onClickTree
                $(treeButton).attr("data-title","コンテンツツリー")
                const bStyle = treeButton.style
                bStyle.backgroundImage = "url(http://commons.nicovideo.jp/cpp/img/common/sprite/sprite_gmenu.png)"
                bStyle.backgroundColor = "transparent"
                bStyle.backgroundRepeat = "no-repeat"
                bStyle.border = "none"
                bStyle.padding = "2px"
                bStyle.backgroundPosition = "2px -104px"
                bStyle.transitionDuration = "0ms"
                bStyle.width = "24px"
                bStyle.height = "24px"
                $(treeButton).hover(function(){
                    $(this).css("background-position", "2px -140px");
                },function(){
                    $(this).css("background-position", "2px -104px");
                })

                treeDiv.appendChild(treeButton)
                menu.insertBefore(treeDiv,menu.childNodes[2])


                clearInterval(findInterval)
                findCount = 10000

            }
        }, 1000)
    }
    function onClickTree(){
        window.open("http://commons.nicovideo.jp/tree/" + location.href.substring(location.href.lastIndexOf('/') + 1))

    }
    window.onLoad = setIcon()
})();