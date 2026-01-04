// ==UserScript==
// @name         정화조
// @namespace    http://chimhaha.net/
// @version      0.21
// @description  마이페이지 > 내가 쓴 글/댓글에서 한번에 작성한 글/댓글을 삭제하게 도와줍니다.
// @author       익명의 침돌이
// @match        https://chimhaha.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chimhaha.net
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/478075/%EC%A0%95%ED%99%94%EC%A1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/478075/%EC%A0%95%ED%99%94%EC%A1%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const boardIdMap = new Map()

    async function getBoardIdFromBoardSlug({boardSlug, articleId}) {
        let boardId
        if(boardIdMap.has(boardSlug)) {
            boardId = boardIdMap.get(boardSlug)
        } else{
            try {
                const html = await fetch(`/${boardSlug}/${articleId}`).then(res => {
                    if(res.status !== 200) throw new Error("not 200")
                    return res.text()
                })
                boardId = /boardId\=\"(?<boardId>\d+)\"/.exec(html)?.groups?.boardId
            } catch(err){
                const lastArticleHtml = await fetch(`/${boardSlug}`).then(res => res.text());
                const lastArticlePathname = lastArticleHtml.split(`<a class="item" href="`).slice(-1)[0].split("\">")[0]
                const html = await fetch(lastArticlePathname).then(res => res.text());
                boardId = /boardId\=\"(?<boardId>\d+)\"/.exec(html)?.groups?.boardId
            }
        }
        if(!boardId) throw new Error("no boardId")
        return boardId
    }


    async function requestDislikeArticle(articleId){
        return fetch('/api/like', {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                articleId,
            })
        }).then(res=>res.json())
    }


    async function requestDislikeComment({articleId, boardSlug, commentId}){
        const boardId = getBoardIdFromBoardSlug({boardSlug,articleId})

        return fetch('/api/comment/like', {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                articleId,
                boardId,
                commentId
            })
        }).then(res=>res.json())
    }

    async function requestDeleteArticle(pathname) {
        return fetch(`${pathname}/edit`, { method: "POST", body: JSON.stringify({ submit: "delete" }) })
    }

    async function requestDeleteComment({ articleId, boardSlug, commentId }) {
        const boardId = getBoardIdFromBoardSlug({boardSlug,articleId})

        return fetch('/api/comment/delete', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                articleId,
                boardId,
                commentId
            })
        })
            .then(res => res.json())
    }

    async function initializeElements() { 

        const loadingImage = document.createElement("img")
        loadingImage.src = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOiBhdXRvOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOyIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiPg0KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjQiIHJ4PSIzIiByeT0iNiIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiNmZTcxOGQiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuOTE2NjY2NjY2NjY2NjY2NnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgzMCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjQiIHJ4PSIzIiByeT0iNiIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiNmZTcxOGQiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuODMzMzMzMzMzMzMzMzMzNHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSg2MCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjQiIHJ4PSIzIiByeT0iNiIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiNmZTcxOGQiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuNzVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPg0KICA8L3JlY3Q+DQo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNTAgNTApIj4NCiAgPHJlY3QgeD0iNDciIHk9IjI0IiByeD0iMyIgcnk9IjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjZmU3MThkIj4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjY2NjY2NjY2NjY2NjY2NjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPg0KICA8L3JlY3Q+DQo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNCIgcng9IjMiIHJ5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZlNzE4ZCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC41ODMzMzMzMzMzMzMzMzM0cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDE1MCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjQiIHJ4PSIzIiByeT0iNiIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiNmZTcxOGQiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuNXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgxODAgNTAgNTApIj4NCiAgPHJlY3QgeD0iNDciIHk9IjI0IiByeD0iMyIgcnk9IjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjZmU3MThkIj4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjQxNjY2NjY2NjY2NjY2NjdzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPg0KICA8L3JlY3Q+DQo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMjEwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNCIgcng9IjMiIHJ5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZlNzE4ZCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC4zMzMzMzMzMzMzMzMzMzMzcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDI0MCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjQiIHJ4PSIzIiByeT0iNiIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiNmZTcxOGQiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuMjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPg0KICA8L3JlY3Q+DQo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMjcwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNCIgcng9IjMiIHJ5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZlNzE4ZCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC4xNjY2NjY2NjY2NjY2NjY2NnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgzMDAgNTAgNTApIj4NCiAgPHJlY3QgeD0iNDciIHk9IjI0IiByeD0iMyIgcnk9IjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjZmU3MThkIj4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjA4MzMzMzMzMzMzMzMzMzMzcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDMzMCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjQiIHJ4PSIzIiByeT0iNiIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiNmZTcxOGQiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz4NCjwhLS0gW2xkaW9dIGdlbmVyYXRlZCBieSBodHRwczovL2xvYWRpbmcuaW8vIC0tPjwvc3ZnPg==`;

        const loadingContainer = document.createElement('div')
        loadingContainer.style.cssText = `
        position:fixed;
        z-index:99;
        width:100vw;
        height:100vh;
        top:0;
        left:0;
        display:none;
        align-items:center;
        justify-content:center;
        background-color:rgba(0,0,0,.5);
    `;
        loadingContainer.appendChild(loadingImage);
        document.body.appendChild(loadingContainer);

        const title = document.querySelector("#title")
        const allItems = document.querySelectorAll(".items .item")
        const allLinks = document.querySelectorAll(".items .item a")

        allItems.forEach((element, index) => {
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.name = "selection"
            checkbox.value = String(index);
            checkbox.style.marginLeft = "10px";
            checkbox.checked = true
            element.appendChild(checkbox)
        });

        const navbar = document.createElement("nav")
        navbar.style.cssText = `
        display: flex;
        align-self: flex-end;
    `;
        title.after(navbar);

        const btnDelete = document.createElement("button")
        if(location.pathname === "/mypage/article/like") {
            btnDelete.innerText = "선택한 글 좋아요 취소"
            btnDelete.addEventListener("click", async function () {
                const selectedCheckboxes = document.querySelectorAll(`[name="selection"]:checked`)
                const targetsForDelete = Array.from(selectedCheckboxes).map(element => allLinks[Number(element.value)].attributes.href.value).map(articlePathname => articlePathname.split("/").slice(-1)[0])

                if (confirm(`선택된 댓글 ${targetsForDelete.length}개를 모두 좋아요 취소하겠습니까?`)) {
                    loadingContainer.style.display = "flex";

                    const deleteWorks = targetsForDelete.map(requestDislikeArticle)
                    const result = await Promise.allSettled(deleteWorks)
                    console.log({result})
                    const success = result.filter(({ status, value }) => status === "fulfilled" && value.status === true)

                    alert(`${success.length}개 삭제 성공 / ${targetsForDelete.length - success.length}개 삭제 실패`)

                    location.reload()
                }
            })
        } else if(location.pathname === "/mypage/comment/like") {
            btnDelete.innerText = "선택한 댓글 좋아요 취소"
            btnDelete.addEventListener("click", async function () {
                const selectedCheckboxes = document.querySelectorAll(`[name="selection"]:checked`)
                const targetsForDelete = Array.from(selectedCheckboxes).map(element => ({ ...allItems[Number(element.value)].dataset }))

                //console.log(targetsForDelete)
                if (confirm(`선택된 댓글 ${targetsForDelete.length}개를 모두 좋아요 취소하겠습니까?`)) {
                    loadingContainer.style.display = "flex";

                    const deleteWorks = targetsForDelete.map(requestDislikeComment)
                    const result = await Promise.allSettled(deleteWorks)
                    console.log({result})
                    const success = result.filter(({ status, value }) => status === "fulfilled" && value.status === true)

                    alert(`${success.length}개 삭제 성공 / ${targetsForDelete.length - success.length}개 삭제 실패`)

                    location.reload()
                }
            })
        } else if (location.pathname === "/mypage/article") {
            btnDelete.innerText = "선택한 글 모두 삭제"
            btnDelete.addEventListener("click", async function () {
                const selectedCheckboxes = document.querySelectorAll(`[name="selection"]:checked`)
                const targetsForDelete = Array.from(selectedCheckboxes).map(element => allLinks[Number(element.value)].attributes.href.value)

                if (confirm(`선택된 글 ${targetsForDelete.length}개를 모두 삭제하겠습니까?`)) {
                    loadingContainer.style.display = "flex";

                    const deleteWorks = targetsForDelete.map(requestDeleteArticle)
                    const result = await Promise.allSettled(deleteWorks)
                    const success = result.filter(({ status }) => status === "fulfilled")

                    alert(`${success.length}개 삭제 성공 / ${targetsForDelete.length - success.length}개 삭제 실패`)

                    location.reload()
                }
            })
        } else {
            btnDelete.innerText = "선택한 댓글 모두 삭제"
            btnDelete.addEventListener("click", async function () {
                const selectedCheckboxes = document.querySelectorAll(`[name="selection"]:checked`)
                const targetsForDelete = Array.from(selectedCheckboxes).map(element => ({ ...allItems[Number(element.value)].dataset }))

                if (confirm(`선택된 댓글 ${targetsForDelete.length}개를 모두 삭제하겠습니까?`)) {
                    loadingContainer.style.display = "flex";

                    const deleteWorks = targetsForDelete.map(requestDeleteComment)
                    const result = await Promise.allSettled(deleteWorks)
                    const success = result.filter(({ status, value }) => status === "fulfilled" && value.status === true)

                    alert(`${success.length}개 삭제 성공 / ${targetsForDelete.length - success.length}개 삭제 실패`)

                    location.reload()
                }
            })
        }
        navbar.appendChild(btnDelete)

        const selectToggleBtn = document.createElement("input")
        selectToggleBtn.type = "checkbox"
        selectToggleBtn.style.marginLeft = "10px";
        selectToggleBtn.style.marginRight = "10px";
        selectToggleBtn.addEventListener("change", function() {
            const checkboxes = document.querySelectorAll(`[name="selection"]`);
            checkboxes.forEach(checkbox => (checkbox.checked = this.checked));
        });
        navbar.appendChild(selectToggleBtn);
    }

    const pathname = location.pathname
    switch(true){
        case pathname === "/mypage/article":
        case pathname === "/mypage/comment":
        case pathname === "/mypage/comment/like":
        case pathname === "/mypage/article/like":
        case /user\/(?<userId>.+)\/comments/.exec(pathname):
            initializeElements()
    }
})();