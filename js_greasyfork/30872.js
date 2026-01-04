// ==UserScript==
// @name         MLBPark Redesign
// @version      0.2
// @description  New design for MLBPark
// @author       Sungmin KIM
// @match        https://mlbpark.donga.com/mp/b.php*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    https://greasyfork.org/users/135360
// @downloadURL https://update.greasyfork.org/scripts/30872/MLBPark%20Redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/30872/MLBPark%20Redesign.meta.js
// ==/UserScript==

GM_addStyle(`
/* 광고 제거 */
.top_ad,
#left_ad,
#center_ad02,
#right_cont,
#center_ad01,
.right_menu,
.picture {
    display: none;
}

/* 배경색 설정 */
.index {
    background: white;
    min-width: 0;
    text-align: center;
}

#container {
    text-align: start;
}

/* 상단 로그인 창 색 조정 */
.index #PCHeader .bg {
    background: #5578b8;
}

/* 상단 로그인 창 없애기 */
.gnb {
    background: #5578b8;
    hei: 10px;
    color: black!important;
    display: none;
}

/* TODAY BEST BULLPEN 없애기 */
.tit_today {
    display: none;
}

/* 헤더와 글 목록 사이 간격 조정 */
#PCHeader {
    margin:0px 0px 10px 0px!important;
}

/* 빅툰 가리기 */
.icon_bigtoon {
    display: none!important;
}

/* 상단 검색 아이콘 가리기 */
.btn_search01 {
    display: none;
}

/* 글 부분의 전체 크기 설정 */
.index #container .contents .left_cont {
    width: 1030px;
    margin: 0px 0px 10px 0px;
}
.index #container .text {
    width: 98%
}

/* 댓글창 스타일 */
.reply_list,
#cmtFormTable td {
    background: #9bbad8 !important;
}
.reply_list .other_reply .txt span,
.tbl_type01 thead tr td {
    color: #000;
}
.reply_list,
#cmtFormTable td {
    background: #f7f7f7 !important;
}
#cmtFormTable {
    margin: 0px 0px 10px 0px;
}
.reply_list .other_reply .txt,
.reply_list .other_con .txt .icon_arr,
.reply_list .my_reply .txt {
    background: #f7f7f7;
}
.reply_list .other_con .photo img,
.reply_list .my_con .photo img {
    border-radius: 20%;
}
.reply_list .other_con,
.reply_list .my_con {
    border-bottom: 1px solid #ccc;
}
.reply_list .other_reply .txt_box .name,
.reply_list .my_reply .txt_box .name {
    font-weight: bold;
}
.reply_list .my_reply .txt_box .name {
    color: #0284c3;
}
.reply_list .other_con .photo,
.reply_list .my_con .photo {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 40px;
    height: 40px;
    border-radius: 20%;
    border: 1px solid #bfbfbf;
}
.reply_list .my_reply .txt {
    background: #E0F0FF !important;
    float: left;
}
.reply_list .other_con,
.reply_list .my_con {
    overflow: hidden;
    position: relative;
    margin: 0;
    padding: 10px 0 0 55px;
}
.reply_list .my_con {
    background: #E0F0FF !important;
}
.reply_list .ip {
    display: inline;
}
.reply_list .ip:before {
    content: '('
}
.reply_list .ip:after {
    content: ')'
}


/* 댓글창에서 댓글끼리의 간격 */
.txt {
    margin-top: -15px;
    margin-bottom: -8px;
}

/* 댓글 쓰는 창 크기 조정 */
.left_cont table {
    width: 1030px !important;
}
#contentTable {
    width: 95%;
    margin: 0 0 0 30px;
}

/* 공지 (위에서 글 3개) 가리기 */
.tbl_type01 tbody tr:nth-child(1),
.tbl_type01 tbody tr:nth-child(2),
.tbl_type01 tbody tr:nth-child(3) {
display:none;
}

/* 조회수 굵게 */
.tbl_type01 .viewV {
    padding-right: 5px;
    font-weight: bold;
}

/* 글 목록에서 한 줄씩 색깔 구분 */
.tbl_type01 tr:nth-child(odd) {
    background-color: white;
}
.tbl_type01 tr:nth-child(even) {
    background-color: #F9F9F9;
}
.tbl_type01 tr:hover {
    background-color: #E0F0FF;
}

/* 읽은 글 색깔 입히기 */
.tbl_type01 .t_left A:visited {
    color: gray;
}

/* 본문에 첨부되는 사진 크기 조정 */
#contentDetail img,
video {
    width: auto !important;
    max-width: 987px !important;
    text-align: center !important;
}

/* 댓글에 첨부되는 사진의 크기 조정 */
.reply_list .txt_box img,
video {
    width: auto !important;
    max-width: 987px !important;
    text-align: center !important;
}

/* 하단 이전 게시판 없애기 */
.prev_list {
    display: none;
}

/* 하단 글쓰기 버튼 없애기 */
.btn_write {
    display: none;
}

/* 하단 검색 버튼 없애기 */
.btn_search {
    display: none;
}

/* 당신이 좋아할만한 컨텐츠 창 없애기 */
.left_cont div[style^='width:670px;'] {
    display: none;
}

/* 댓글 개수 스타일 */
.tbl_type01 .replycnt {
    color: #345391;
    font-weight: bold;
}

/* 글번호 색 수정 */
.tbl_type01 tbody tr td:first-child {
    font-size: 11px;
    color: #999;
}

/* 글 목록에서 각 글 사이의 간격 조정 */
.tbl_type01 tbody tr td {
    height: 38px;
    padding: 0 2px 0 0;
}

.tbl_type01 tbody tr td a {
    font-size: 14px;
}

/* 글 제목이 최대한 한 줄로 출력되도록 너비 조정 */
.tbl_type01 tbody tr td a {
    width:auto!important;
}

/* 말머리 앞 뒤로 꺽쇠괄호 넣기 */
.tbl_type01 tbody tr td .word:before {
    content: '['
}
.tbl_type01 tbody tr td .word:after {
    content: ']'
}

/* 말머리 스타일 */
.tbl_type01 tbody tr td .word {
    font-weight:lighter;
    color: green;
    display: inline-block!important;
    text-align: center;
    width: 60px!important;
}

/* 페이지 목록 크기 조정 */
.page {
    height: 38px;
    padding: 5px 0px 0px 0px;
    margin: 0px 0px 10px 0px;
}

/* 검색창 오른쪽 정렬 */
.list_search {
    float: right;
}

/* 담장 제목 (최다추천 최고조회 최다리플) 스타일 */
.main_contents .nav .bestTitle {
    color: steelblue;
    text-align: center;
    font-size: 105%;
    font-family: 돋움;
}

/* 하단 푸터 없애기 */
.footer > .copy,
.link {
    display: none;
}

/* 푸터 간격 조정 */
.footer {
    background: #5578b8;
    margin:20px 0px 0px 0px;
    padding:15px 0px 0px 0px;
}
`);