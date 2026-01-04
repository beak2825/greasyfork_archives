// ==UserScript==
// @icon         https://finder.susy.mdpi.com/dist/images/ico/apple-touch-icon-57-precomposed.png
// @name         Susy-Find
// @namespace    rachpt.cn
// @version      0.0.3
// @description  mdpi finder enhances tool
// @author       rachpt
// @license      MIT License
// @match        https://finder.susy.mdpi.com/reviewer/*
// @require      https://cdn.staticfile.org/jquery/1.9.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/436186/Susy-Find.user.js
// @updateURL https://update.greasyfork.org/scripts/436186/Susy-Find.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log('---start---');

    const style = document.createElement('style');

    // add CSS styles
    style.innerHTML = `
    .my-tooltip {
       display:none;
       background:transparent url(https://susy.mdpi.com/bundles/mdpisusy/img/design/susy-logo.png)
       font-size:12px;
       height:70px;
       width:160px;
       padding:25px;
       color:#fff;
     }
    `;

    // append the style to the DOM in <head> section
    document.head.appendChild(style);

    function getOnePersonInviteInfo(email, specialIssueId){
        const url = `https://susy.mdpi.com/user/guest_editor/check?email=${email}&specialIssueId=${specialIssueId}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: url,
                method: 'GET',
                onerror: error => {
                    reject({email: email, error: error});
                },
                onload: r => {
                    try {
                        let res = $(r.responseText).find('table.margin-top-1 tbody tr:nth-child(2) td:nth-child(4)');
                        let resCount = res.length;
                        let maxT = res.length ? res[0].textContent : null;
                        // console.log(resCount, maxT)
                        if (resCount > 1) {
                            for (let item in res) {
                                if (item.textContent > maxT) maxT = item.textContent;
                            }
                        }
                        resolve({email: email, maxT:maxT, ct: resCount, error: null});
                    } catch(err) {
                        console.log('遇到错误了: ', err);
                        resolve({email: email, maxT: null, error: err});
                    }
                }
            });
        });
    }

    let spIdPromise = new Promise((resolve, reject) => {
        const spIssueUrl = 'https://susy.mdpi.com/special_issue_pending/list';
        GM_xmlhttpRequest({
            method: 'GET',
            url: spIssueUrl,
            onerror: error => {
                console.log('have error:', error);
                reject(error);
            },
            onload: function(r) {
                //这里写处理函数
                console.log('in first request ---');
                if (r.status !== 200) {
                    const loginUrl = 'https://login.mdpi.com/login?_target_path=https://susy.mdpi.com/user/login?authAll=true';
                    window.open(loginUrl, '_blank').focus();
                }  // TODO: 判断cookie十分钟有效
                let parser = new DOMParser();
                let doc = parser.parseFromString(r.responseText, 'text/html');
                resolve(doc.getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0].attributes['data-id'].value);

            }
        });
    });

    spIdPromise.then(spId => {
        let allPromise = [];
        console.log(spId);

        $('div.item-info small.clipboard').each((i, el) => {
            let email = $(el).attr('data-clipboard-text');
            allPromise.push(getOnePersonInviteInfo(email, spId));
        });

        Promise.all(allPromise).then(res => {
            console.log('success', res);
            let fitCount = 0;
            const tmpDate = new Date();
            tmpDate.setDate(tmpDate.getDate() + 1); // 第二天
            const tomorrow = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate());
            const now = new Date();
            for (const item of res) {
                const selecter = `div.ad-info small[data-clipboard-text='${item.email}']`;
                if (item.maxT){
                    let nextT = new Date(item.maxT);
                    nextT.setDate(nextT.getDate() + 90); // 90天后
                    nextT.setHours(nextT.getHours() + 7); // 时间偏移
                    if (now >= nextT) {
                        let inHtml = `<samll>${item.maxT}</samll>`;
                        $(selecter).parent().css('backgroundColor', 'lightgreen').append(inHtml);
                        // $(selecter).parent().append(inHtml);
                        fitCount += 1;
                    } else if (tomorrow >= nextT) {
                        let inHtml = `<samll>${item.maxT}</samll>`;
                        $(selecter).parent().css('backgroundColor', 'pink').append(inHtml);
                        // $(selecter).parent().append(inHtml);
                        fitCount += 1;
                    } else {
                        $(selecter).parent().parent().parent().parent().remove();
                    }
                } else {
                    $(selecter).parent().parent().parent().parent().remove();
                };
            }
            $('div.featured-top > h4').append(`<span style='background-color: lightgreen'>共 ${fitCount} 条符合要求</span>`);
            console.log('---end---');
        }).catch(err => console.log('error', err));


    });

})();