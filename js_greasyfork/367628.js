// ==UserScript==
// @name         CRS Sales Demo
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  デモ！！！！
// @match        https://cr.demotrek.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/367628/CRS%20Sales%20Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/367628/CRS%20Sales%20Demo.meta.js
// ==/UserScript==

const overlay = document.createElement('div');
overlay.id = 'temperMonkeyOverlay';
overlay.setAttribute('style', 'position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; background-color: #fff; z-index: 9999999;');
try {
  document.body.appendChild(overlay);
  setTimeout(() => document.getElementById('temperMonkeyOverlay').remove(), 500);
} catch(e) {}

// NOTE: jQuery はページがロードしているものを参照している
window.onload = function () {
    'use strict';

    var replaceText = '****';

    function mask(elem, str = replaceText) {
        if(elem) {
            elem.innerText = str;
        }
    }

    function maskElements(elems) {
        if(elems) {
            for(let elem of elems) {
                mask(elem);
            }
        }
    }

    function replaceAgeStr(str) {
        var repleceIndex = str.indexOf('/');
        return replaceText + str.slice(repleceIndex);
    }

    /**********************
        ダッシュボード
    **********************/
    // 求職者ID
    $('.pg-top-user-id').text(replaceText);

    // 年齢
    $('.pg-top-user-age').each((index, row) => {
        mask(row);
    });

    // リクルータ名
    setTimeout(() =>　$('.pg-table-user-name').text(replaceText), 300);

    // 会社名。1個目は学校名なのでスキップ
    $('.pg-top-user-info').children().each((index, row) => {
        if (index % 3 === 1) {
            mask(row);
        }
    });

    /**********************
        求人原稿
    **********************/
    if (location.href.indexOf('job/search') > -1) {
        $('#jsi_tbody tr').each((index, row) => {
            mask(row.childNodes[5]); // 担当者名
            mask(row.childNodes[13]); // 応募数
        });
        $('.pg-job-table__comment').text(replaceText); // コメント
    }

    /**********************
        求職者: 興味がある
    **********************/
    if (location.href.indexOf('pool') > -1) {
        $('#jsi_tbody tr').each((index, row) => {
            const candidateDetails = row.childNodes[5].querySelectorAll('.bs-general-cf .bs-general-te');
            // 求職者の個人情報隠す
            mask(candidateDetails[1]); //社名
            mask(candidateDetails[2]); //部署名
            mask(candidateDetails[3], replaceAgeStr(candidateDetails[3].innerText)); // 学校名
            mask(row.childNodes[13]); // 求人担当者名
        });

        $('.pg-pool-list-table-id').text(replaceText); // 求職者ID
    }

    // 求職者詳細 とりあえず全部マスク
    $('.jsc-candidatedetail-info .pg-resume-block td').text(replaceText);

    /**********************
        求職者: レコメンド
    **********************/
    if (location.href.indexOf('recommend') > -1) {
        $('.pg-progress-list-man-icon, .pg-progress-list-woman-icon').each((index, row) => {
            mask(row.childNodes[1]); //求職者ID
            const i = row.childNodes.length === 5 ? 3 : 5; // Fireによって長さが変わるので
            mask(row.childNodes[i]); // 住所
        });
        $('#jsi_tbody tr').each((index, row) => {
            const candidateDetails = row.childNodes[5].querySelectorAll('.bs-general-cf .bs-general-te');
            mask(candidateDetails[2]); // 社名

            const similarCandidateDetails = row.childNodes[7].querySelectorAll('.bs-general-cf .bs-general-te');
            mask(row.childNodes[7].querySelector('.sg-table-cell-candidate').childNodes[1]); // ID
            mask(row.childNodes[7].querySelector('.sg-table-cell-candidate').childNodes[3]); // 年齢と住所
            // 求職者の個人情報隠す
            mask(similarCandidateDetails[1]); // 社名

            mask(row.childNodes[11]); // 求人担当者名
        });
    }

    /**********************
        求職者: 足跡
    **********************/
    if (location.href.indexOf('footprint') > -1) {
        $('.sg-table-cell-candidate .pg-progress-footprint-list').each((index, row) => {
            mask(row.childNodes[3]); // 求職者ID
        });
    }

    /**********************
        応募・進捗
    **********************/
    $('.sg-comment-pool').text(replaceText); // コメント

    if (location.href.indexOf('progress') > -1) {
        $('#jsi_tbody tr').each((index, row) => {
            $('.pg-progress-list-man-icon, .pg-progress-list-woman-icon').each((index, row) => {
                mask(row.childNodes[1]); //求職者ID
                    const i = row.childNodes.length === 5 ? 3 : 5; // Fireによって長さが変わるので
                mask(row.childNodes[i]); // 住所
            });

            const candidateDetails = row.childNodes[7].querySelectorAll('.bs-general-cf .bs-general-te');
            // 求職者の個人情報隠す
            mask(candidateDetails[1]); //社名
            if(candidateDetails.length > 2) {
                mask(candidateDetails[2]); //部署名
                mask(candidateDetails[3], replaceAgeStr(candidateDetails[3].innerText)); // 学校名
            }

            // 求人担当者名
            mask(row.childNodes[11]);
        });
    }

     /**********************
        候補者検索
    **********************/
    if (location.href.indexOf('scout') > -1) {
        $('#jsi-tbody .pg-scout-result-indivisualleft').each((index, row) => {
            const candidateDetails = row.childNodes[1].childNodes;
            mask(candidateDetails[5]); // 住所
            mask(candidateDetails[7]); // 求職者ID
            mask(row.childNodes[3]); //社名
            if(row.childNodes[5]){
              mask(row.childNodes[5]); // 役職名
            }
        });
    }

    /**********************
        特集
    **********************/
    if (location.href.indexOf('feature') > -1) {
        // うんkのような対策だが、feature は非同期で取って来られるので、2秒ぐらいたったらさすがに取ってきてるだろうという目論見でsetTimeout
        // 本来的にはちゃんとhookしてやるべきだがその方法見つけるのがめんどくさかった。
        setTimeout(() =>
            $('.m-featureList__takeApp').each((index, item) => disableTransition(item)), 2000);
    }

    /**********************
        振り返りレポート
    **********************/
    if (location.href.indexOf('report') > -1) {
        $(document).ajaxComplete((e) => {
            $('#jsi-report-company-monthly-grid .jqgrow, #gview_jsi-report-company-monthly-grid .ui-jqgrid-ftable .footrow').each(function (index, row) {
                const cells = row.childNodes;
                for (let i = 1; i < cells.length; i++) {
                    mask(cells[i]);
                }
            });

            $('#jsi-report-grid .jqgrow, #jsi-job-report-div .ui-jqgrid-ftable .footrow').each(function (index, row) {
                const cells = row.childNodes;
                for (let i = 4; i < cells.length; i++) {
                    mask(cells[i]);
                }
            });
        });
    }
};