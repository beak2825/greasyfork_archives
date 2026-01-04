// ==UserScript==
// @name         SOOP(숲) - 게시글/다시보기 댓글 엑셀파일로 추출
// @namespace    https://greasyfork.org/ko/scripts/520675
// @version      20250305
// @description  SOOP 채널의 게시글이나 다시보기에서 댓글, 답글을 추출하여 엑셀파일로 저장합니다.
// @author       0hawawa
// @match        https://vod.sooplive.co.kr/player/*
// @include      https://ch.sooplive.co.kr/*/post/*
// @icon         https://res.sooplive.co.kr/afreeca.ico
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.2.1/exceljs.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520675/SOOP%28%EC%88%B2%29%20-%20%EA%B2%8C%EC%8B%9C%EA%B8%80%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%20%EB%8C%93%EA%B8%80%20%EC%97%91%EC%85%80%ED%8C%8C%EC%9D%BC%EB%A1%9C%20%EC%B6%94%EC%B6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/520675/SOOP%28%EC%88%B2%29%20-%20%EA%B2%8C%EC%8B%9C%EA%B8%80%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%20%EB%8C%93%EA%B8%80%20%EC%97%91%EC%85%80%ED%8C%8C%EC%9D%BC%EB%A1%9C%20%EC%B6%94%EC%B6%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CHAPI = String(atob("aHR0cHM6Ly9jaGFwaS5zb29wbGl2ZS5jby5rci9hcGk="));
    // 모든 댓글 저장하는 리스트
    let commentData = [];
    let isVOD = false;
    let index = 1;

    // 게시글 정보
    async function getTitleName(streamerId, title_no){
        try {
            const r = await fetch( `${CHAPI}/${streamerId}/title/${title_no}` );
            const d = await r.json();
            return d.title_name;
        } catch(e){
            console.log(e);
            alert(e);
        }
    }

    // 댓글 수, 마지막 페이지 수
    async function getCommentInfo(streamerId, title_no){
        try {
            const r = await fetch( `${CHAPI}/${streamerId}/title/${title_no}/comment` );
            const d = await r.json();
            return d.meta.last_page
        } catch (e){
            console.log(e);
            alert(e);
        }
    }

    // 댓글 처리
    async function processComment(c, id, isReply = false){
        commentData.push({
            순번: index++,
            번호: isReply === false ? c.p_comment_no : c.c_comment_no,
            종류: isReply === false ? "💬" : "⤷",
            유형: c.is_pin === true ? '📌(고정)' : c.is_best_top === true ? '💎(인기)' : '',
            "스트리머👍": isReply === true ? "" : c.bjlike === null ? "" : "👍",
            닉네임: c.user_nick,
            아이디: c.user_id,
            댓글내용: c.comment,
            좋아요: c.like_cnt,
            등록시간: c.reg_date,
            매니저: c.badge?.is_manager === 1 ? '✔️' : '',
            열혈팬: c.badge?.is_top_fan === 1 ? '✔️' : '',
            팬클럽: c.badge?.is_fan === 1 ? '✔️' : '',
            정기구독: c.badge?.is_subscribe === 1 ? '✔️' : '',
            서포터: c.badge?.is_support === 1 ? '✔️' : '',
            "🔗링크": isVOD === false ? `https://ch.sooplive.co.kr/${id}/post/${title_no}#comment_noti${isReply === false ? c.p_comment_no : c.c_comment_no}` : `https://vod.sooplive.co.kr/player/${title_no}?referer=noti&comment_no=${isReply === false ? c.p_comment_no : c.c_comment_no}&noti_type=parent`
        });
    }
    // 답글처리
    async function handleReplies(id, title_no, pCommentNo){
        try{
            await fetch( `${CHAPI}/${id}/title/${title_no}/comment/${pCommentNo}/reply` )
            .then(r => r.json())
            .then(d => d.data.forEach( reply => processComment(reply, id, true) ))
        } catch(e){
            console.log(e);
            alert(e);
        }
    }

    // 댓글정리
    async function handleComments(d, id, title_no){
        for (let comment of d.data){
            await processComment(comment, id);
            if (comment.c_comment_cnt > 0){
                await handleReplies(id, title_no, comment.p_comment_no);
            }
        }
    }
    async function sheetStyle(ws) {
        ws.getColumn(2).hidden = true;
        ws.columns.forEach((col, colNum) => {
            if( colNum === 15 ) return; // 16번째 (0~15)
            let maxLen = 0;
            col.eachCell({ includeEmpty: true }, (cell) => {
                const cellValue = cell.value ? cell.value.toString() : '';
                maxLen = Math.max(maxLen, cellValue.length);
            });
            col.width = maxLen + 5;
        });

        ws.eachRow((row /* 처리할 객체 */, rowNum /* 해당 행 번호*/) => {
            if ( rowNum === 1 ) {
                row.eachCell(cell => {
                    cell.font = { bold: true };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                });
            }

            if ( rowNum > 1 ) {
                const hyperlinkCell = row.getCell(16);
                if ( hyperlinkCell.value ) {
                    hyperlinkCell.value = {
                        text: "🚀댓글보기",
                        hyperlink: hyperlinkCell.value
                    };
                    
                    hyperlinkCell.style = { font: { color: { argb: 'FF0000FF' }, underline: true } };
                }
            }

            row.eachCell((cell, colNum) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                }
                if ( colNum !== 8 && colNum !== 10 ){
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                }
            });

        });
        
        const lastColNum = ws.columns.length;
        const lastRowNum = ws.lastRow.number;

        for (let col = 1; col <= lastColNum; col++){
            const fRow = ws.getCell(1, col);
            const lRow = ws.getCell(lastRowNum, col);
            fRow.border = { ...fRow.border, top: { style: 'medium' } };
            lRow.border = { ...lRow.border, bottom: { style: 'medium' }};
        }
        for (let row = 1; row <= lastRowNum; row++){
            const fCol = ws.getCell(row, 1);
            const lCol = ws.getCell(row, lastColNum);
            fCol.border = { ...fCol.border, left: { style: 'medium' }};
            lCol.border = { ...lCol.border, right: { style: 'medium' }};
        }

        ws.getRow(1).eachCell(cell =>{
            cell.border = {
                ...cell.border, bottom: { style: 'medium' }
            }
        });

        ws.autoFilter = 'A1:P1';
        ws.mergeCells('Q1:R1');
        ws.getCell('Q1').value = '< 제한된 보기 해제';
        ws.getColumn(10).width = 18; // 등록시간
        ws.getColumn(8).width = 40; // 댓글내용
    }

    async function dataToExcel(id, title_no){
        let progress = 0;
        const titleName = await getTitleName(id, title_no);
        const lastPage = await getCommentInfo(id, title_no);
        try{
            for (let page = 1; page <= lastPage; page++) {
                try{
                    const r = await fetch(`${CHAPI}/${id}/title/${title_no}/comment?page=${page}`)
                    const d = await r.json();
                    await handleComments(d,id, title_no)

                    progress = ((page / lastPage) * 100).toFixed(2);
                    console.log(`진행률: ${progress}%`);
                    document.title = `진행률: ${progress}% - 댓글 추출 중`;
                } catch(e) {
                    console.log(e);
                    alert(e);
                }
            }
        } catch (e) { console.log(e) };

        const invalidChars = /[\\\/:*?"<>|]/g;
        let replacedName = titleName.replace(invalidChars, '');
        if (replacedName > 150) {
            replacedName = replacedName.substring(0, 150)
        }

        try {
            const wb = new ExcelJS.Workbook();
            const ws = wb.addWorksheet(`${id}_${title_no}`,{
                views:[
                    {
                        state: 'frozen',
                        ySplit: 1
                    }
                ]
            });

            const headers = Object.keys(commentData[0]);
            ws.columns = headers.map(header => ({
                header: header,
                key: header,
                width: 15
            }));

            // 데이터 추가
            commentData.forEach(data => {
                ws.addRow(data);
            });

            await sheetStyle(ws);

            wb.xlsx.writeBuffer().then(buffer => {
                const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const url = URL.createObjectURL(blob);
              
                const a = document.createElement("a");
                a.href = url;
                a.download = `${id}_${title_no}_${replacedName}_댓글}`; // 파일 이름 설정
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }).catch(err => {
                console.error("엑셀 파일 생성 실패", err);
            });

            if(parseFloat(progress) === 100.00){
                document.title = "댓글 다운로드 완료!";
                alert("댓글 다운로드 완료!");
            }

        } catch (e){
            console.error("파일 저장에 실패했습니다.", e);
            document.title = "파일 저장 실패";
        }
    }

    function find_streamer_ID() {
        const element = document.querySelector('#player_area > div.wrapping.player_bottom > div > div:nth-child(1) > div.thumbnail_box > a');
        const href = element.getAttribute('href');
        streamerId = href.split('/')[3];
        console.log('[스트리머 ID찾는 중 ...]');
        if (streamerId === null || streamerId === 'N/A'){}
        else{
            observer.disconnect();
            console.log(`[DOM감지 종료!!] 스트리머 ID: ${streamerId}`);
            isVOD = true;
            return streamerId;
        }
    }

    const currentUrl = new URL(window.location.href);
    const pathname = currentUrl.pathname;
    let streamerId = null;
    let title_no = null;

    const observer = new MutationObserver(find_streamer_ID);
    if(pathname.startsWith('/player/')){
        title_no = pathname.split('/')[2];
        observer.observe(document.body, { childList: true, subtree: true });
    } else if (pathname.includes('/post/')){
        streamerId = pathname.split('/')[1];
        title_no = pathname.split('/')[3];
    }

    async function main(){
        if(streamerId === null){
            streamerId = find_streamer_ID();
        }
        console.log(`[스트리머 ID: ${streamerId}]\n[타이틀 번호: ${title_no}]`);
        // 함수 실행 시 다시 초기화
        commentData = [];
        index = 1;
        await dataToExcel(streamerId, title_no);
    }

    GM_registerMenuCommand('Excel로 댓글 추출하기', function() {
        main();
    });
})();