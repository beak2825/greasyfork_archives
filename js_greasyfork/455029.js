// ==UserScript==
// @name        밴드 댓글 가져오기
// @namespace   Violentmonkey Scripts
// @match       https://band.us/*
// @grant       none
// @version     1.3
// @author      WisdomIT
// @description 2022. 11. 18. 오후 6:00:02
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455029/%EB%B0%B4%EB%93%9C%20%EB%8C%93%EA%B8%80%20%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455029/%EB%B0%B4%EB%93%9C%20%EB%8C%93%EA%B8%80%20%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0.meta.js
// ==/UserScript==


const getcommentboolean = false;

const getCommentBtn = document.createElement('a')

getCommentBtn.innerText = '댓글 파싱기능 활성화하기'
getCommentBtn.style.padding = '20px'
getCommentBtn.style.border = '1px solid #000'
getCommentBtn.style.borderRadius = '10px'
getCommentBtn.style.position = 'fixed'
getCommentBtn.style.zIndex = '50000'
getCommentBtn.style.backgroundColor = '#fff'
getCommentBtn.style.fontSize = '20px'
getCommentBtn.style.bottom = '100px'
getCommentBtn.style.right = '10px'
getCommentBtn.style.cursor = 'pointer'

getCommentBtn.addEventListener('click', event => {

  getCommentBtn.style.backgroundColor = 'dodgerblue'
  getCommentBtn.style.color = '#fff'

  const allComments = document.querySelectorAll('.dPostCommentMainView')
  console.log(allComments)

  allComments.forEach(e => {

    e.style.boxShadow = '0px 0px 0px 5px dodgerblue'
    e.style.borderRadius = '1px'
    e.style.backgroundColor = '#eee'
    e.style.position = 'relative'

    const tempBtn = document.createElement('div')

    tempBtn.style.position = 'absolute'
    tempBtn.style.top = '0px'
    tempBtn.style.bottom = '0px'
    tempBtn.style.left = '0px'
    tempBtn.style.right = '0px'
    tempBtn.style.cursor = 'pointer'
    tempBtn.style.zIndex = '50000'

    tempBtn.addEventListener('click', event => {
        console.log(e)
        if(confirm('해당 댓글을 인쇄하시겠습니까?')){
            setTimeout(() => { getAllComments(e) }, 500)
        }
    })

    tempBtn.addEventListener('mouseover', event => {
      tempBtn.style.backgroundColor = 'rgba(255,255,255,0.5)'
    })

    tempBtn.addEventListener('mouseout', event => {
      tempBtn.style.backgroundColor = null
    })

    e.appendChild(tempBtn)
  })

} )

document.body.appendChild(getCommentBtn)


const getAllComments = (thiselem) => {
    //console.log(thiselem)
    const allCommentDivs = thiselem.querySelectorAll('[data-viewname="DCommentView"]')

    let commentArray = []
    allCommentDivs.forEach(e => {
        const name = e.querySelector('strong.name')
        const comment = e.querySelector('p._commentContent')
        const time = e.querySelector('.time')
        if(name !== null && comment !== null && time !== null){
            const nametext = name.innerText
            const commenttext = comment.innerText
            commentArray.push({
                name: nametext,
                comment: commenttext,
                time: time.title
            })
        }
    })

    console.log(commentArray)

    let commentToHtml = ''

    commentArray.forEach(e => {
        if(e.name === '국셰프' || e.name === '반찬셰프') return false;
        commentToHtml = commentToHtml + `<div>
            <h3>${e.name}</h3>
            <p class="comment">${e.comment.replace(/\n/g, '<br>')}</p>
            <p class="time">${e.time}</p>
        </div>`
    })


    let mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write(`<html><head><style>
                              body{margin: 0px;}
                              div{display: inline-block; box-sizing: border-box; page-break-inside: avoid; page-break-after: auto; width: calc(50% - 10px); padding: 20px; margin: 5px; vertical-align: top; float: left; border: 2px solid #ddd}
                              h3{margin: 0px; margin-bottom: 5px; font-size: 35px;}
                              p{margin: 0px; word-break: keep-all;}
                              p.comment{font-size: 25px;}
                              p.time{font-size: 20px; color: #888; margin-top: 10px;}
                            </style></head><body>`);
    mywindow.document.write(commentToHtml);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
    
}