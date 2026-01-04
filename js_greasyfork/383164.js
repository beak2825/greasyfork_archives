// ==UserScript==
// @name         长佩专用| 只显示匿名
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  自动加载下一页 ,只显示匿名
// @author       You
// @match        *://allcp.net/forum.php?mod=viewthread&tid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383164/%E9%95%BF%E4%BD%A9%E4%B8%93%E7%94%A8%7C%20%E5%8F%AA%E6%98%BE%E7%A4%BA%E5%8C%BF%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/383164/%E9%95%BF%E4%BD%A9%E4%B8%93%E7%94%A8%7C%20%E5%8F%AA%E6%98%BE%E7%A4%BA%E5%8C%BF%E5%90%8D.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let onlyAnous = false;
    let onoff = true;

    let nextIndex, maxIndex
    getPageInfo(document.querySelector("div#pgt .pgt"));

    let tid = document.URL.match(/&tid=\d{1,7}/)
    let url = `https://allcp.net/forum.php?mod=viewthread${tid}&extra=&page=${nextIndex}`

    let btnHide = document.createElement('span')
    btnHide.innerHTML = `<a style="background:none;line-height:2em">全部</a>`
    document.querySelector("#scrolltop").appendChild(btnHide);


    document.onscroll = function (eve) {
        if (nextIndex <= maxIndex) {
            if (document.body.clientHeight < window.pageYOffset + 2500) {
                setTimeout(newPage(nextIndex), 2000)
            }
        } else {
            if (onoff) {
                let btnNotice = `<a href="javascript:;" hidefocus="true"> 🐟🐟🐟 鱼塘底部 没有新内容啦 🐟🐟🐟</a>`
                document.querySelector('#ct .pgbtn').innerHTML = btnNotice
                onoff = false;
            } else {
                return;
            }
        }
    }

    function newPage(nextIndex) {
        url = url.replace(/\d{1,2}$/, nextIndex)

        let ajax = new XMLHttpRequest();
        ajax.open("get", url, false);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                ajaxFn(ajax.responseText)
            }
        }
        ajax.send("");
    }

    function ajaxFn(res) {

        let floorBar = `<div class="pgbtn">
                <a href="${url}" hidefocus="true"> 🐟 鱼塘${nextIndex}层  </a>
				</div>`
        nextIndex++;

        let pageContent = document.createElement("div");
        pageContent.innerHTML = res;
        let newComments = pageContent.querySelectorAll("table.plhin")
        let postList = document.querySelector('#postlist')

        postList.innerHTML += floorBar;
        if (onlyAnous) { hideNamed(newComments) }
        for (var i = 0; i < newComments.length; i++) {
            postList.appendChild(newComments[i]);
        }




    }

    btnHide.onclick = function () {
        let commentList = document.querySelectorAll("table.plhin");
        if (onlyAnous) {
            console.log('1 显示全部');
            showAll(commentList)
            btnHide.innerHTML = `<a style="background: none; line - height: 2em">全部</a>`;
            onlyAnous = false;

        } else {
            console.log('2 只显示匿名');
            hideNamed(commentList);
            btnHide.innerHTML = `<a style="background: none; line - height: 2em">匿名</a>`;
            onlyAnous = true;
        }
    }

    function hideNamed(comments) {
        comments.forEach(comment => {
            let isAnonMember = comment.querySelector("div.authi").innerHTML.match(/匿名青花鱼<em/)


            if (!isAnonMember) {
                comment.style.display = "none"
            }
        })
    }

    function showAll(comments) {
        for (var i = 0; i < comments.length; i++) {
            comments[i].style.display = "block";
        }
    }

    function getPageInfo(pagination) {
        if (pagination.innerText) {
            if (document.URL.indexOf("page=") == -1) {
                nextIndex = 2;
            } else {
                nextIndex = parseInt(document.URL.match(/\d{1,2}$/)) + 1
            }
            maxIndex = parseInt(pagination.querySelector('label span').innerText.split(" ")[2])

        } else {
            maxIndex = 1
        }
    }
})();