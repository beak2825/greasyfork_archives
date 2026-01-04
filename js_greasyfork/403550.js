// ==UserScript==
// @name         其乐楼层统计
// @namespace    https://greasyfork.org/users/101223
// @version      0.2
// @description  其乐社区楼层统计
// @author       Splash
// @match        https://keylol.com/forum.php?mod=viewthread&tid=*
// @match        https://keylol.com/t*
// @downloadURL https://update.greasyfork.org/scripts/403550/%E5%85%B6%E4%B9%90%E6%A5%BC%E5%B1%82%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/403550/%E5%85%B6%E4%B9%90%E6%A5%BC%E5%B1%82%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const rsBtn = jQuery('<a href="javascript:;"></a>'),
    rsBtnText = '统计帖子',
    concurrentMax = 5,
    lastPage = getLastPage(),
    rsWindow = jQuery(`
<div id="result_window" class="fwinmask" style="display: none;">
    <table cellpadding="0" cellspacing="0" class="fwin">
        <tbody>
            <tr>
                <td class="t_l"></td>
                <td class="t_c" style="cursor:move" onmousedown="dragMenu($('result_window'), event, 1)" ondblclick="hideMenu('result_window','win')"></td>
                <td class="t_r"></td>
            </tr>
            <tr>
                <td class="m_l" style="cursor:move" onmousedown="dragMenu($('result_window'), event, 1)" ondblclick="hideMenu('result_window','win')">&nbsp;&nbsp;</td>
                <td class="m_c">
                    <h3 class="flb">
                        <em>统计结果</em>
                        <span>
                            <a href="javascript:;" class="flbc" onclick="hideMenu('result_window','win')" title="关闭">关闭</a>
                        </span>
                    </h3>
                    <div class="gd-wa">
                        <label for="radio_result"><input type="radio" id="radio_result" name="radio_result" class="pc" checked/>结果</label>
                        <label for="radio_duplicate"><input type="radio" id="radio_duplicate" name="radio_result" class="pc"/>重复UID</label>
                        <label for="checkbox_uid"><input type="checkbox" id="checkbox_uid" class="pc"/>仅显示UID</label>
                        <a href="javascript:;">保存csv</a>
                        <div><textarea></textarea></div>
                    </div>
                </td>
                <td class="m_r" style="cursor:move" onmousedown="dragMenu($('result_window'), event, 1)" ondblclick="hideMenu('result_window','win')"></td>
            </tr>
            <tr>
                <td class="b_l"></td>
                <td class="b_c" style="cursor:move" onmousedown="dragMenu($('result_window'), event, 1)" ondblclick="hideMenu('result_window','win')"></td>
                <td class="b_r"></td>
            </tr>
        </tbody>
    </table>
</div>
`);
    gd_addStyle(`
#result_window {
    width: fit-content;
}
#result_window .gd-wa {
    margin: 10px;
}
#result_window .gd-wa label {
    margin-right:15px;
    float: left;
}
#result_window .gd-wa a {
    color: #57bae8;
    margin-right:5px;
    float: right;
}
#result_window .gd-wa textarea {
    margin: 10px 0 0 0;
    width: 800px;
    height: 400px;
    border-color: #57bae8;
    white-space: nowrap;
    overflow: scroll;
}
`);
    let btnDisabled,
    concurrentNum,
    result = {},
    resultDuplicate = {},
    incompletePages = Array(lastPage).fill().map((e, i) => i + 1),
    errorPages = [],
    completeCount;
    rsBtn.on('click', () => {
        btnDisabled || run();
    });
    rsWindow.find('input').on('change', () => {
        updateResult();
    });
    rsWindow.find('.gd-wa a').on('click', () => {
        gdDownload(getResultText(true), 'result.csv');
    });
    jQuery('#modmenu .pipe').css('visibility', '');
    rsBtn.text(rsBtnText);
    jQuery('#modmenu').append(rsBtn, '<span class="pipe" style="visibility: hidden;">|</span>');
    jQuery('body').append(rsWindow);
    function run() {
        btnDisabled = true;
        if (incompletePages.length) {
            concurrentNum = 0;
            completeCount = lastPage - incompletePages.length;
            rsBtn.text(`${rsBtnText}(${completeCount}/${lastPage})`);
            runLoop();
        } else {
            showResult();
            btnDisabled = false;
        }
    }
    function runLoop() {
        if (completeCount >= lastPage) {
            incompletePages = errorPages;
	    errorPages = [];
            if (incompletePages.length) {
                rsBtn.css('color', 'red');
            } else {
                rsBtn.text(rsBtnText);
                rsBtn.css('color', '');
            }
            showResult();
            btnDisabled = false;
            return;
        }
        rsBtn.text(`${rsBtnText}(${completeCount}/${lastPage})`);
        while (concurrentNum < concurrentMax && incompletePages.length > 0) {
            concurrentNum++;
            fetchPage(incompletePages.shift());
        }
    }
    function fetchPage(page, count) {
        if (!page)
            return;
        count = count || 1;
        jQuery.ajax({
            url: `/t${tid}-${page}-1`,
            type: 'GET',
            timeout: 3e4
        }).done((data) => {
            try {
                let tmpList = jQuery(data).find('#postlist table[id^=pid]'),
                tmpResult = {},
                tmpResultDuplicate = {};
                for (let i = 0; i < tmpList.length; i++) {
                    let tmpObj = tmpList.eq(i);
                    tmpObj.find('td[id^=postmessage_]').find('img,script,ignore_js_op,i.pstatus,div.quote').remove();
                    let pn = tmpObj.find('.plc .pi a>em').text(); //楼层
                    if (pn == '1')
                        continue;
                    let uid = tmpObj.find('.pls .authi a').prop('href').match(/(?<=suid\-)\d+/)[0]; //uid
                    let duplicate = false;
                    for (let j in tmpResult) {
                        if (tmpResult[j].uid == uid) {
                            duplicate = true;
                            break;
                        }
                    }
                    if (!duplicate) {
                        for (let j in result) {
                            if (result[j].uid == uid) {
                                duplicate = true;
                                break;
                            }
                        }
                    }
                    let link = tmpObj.find('.plc .pi a').prop('href'), //链接
                    name = tmpObj.find('.pls .authi a').text(), //uname
                    sp = tmpObj.find('.pls td:contains("蒸汽")').find('.xi2').text(), //蒸汽
                    content = jQuery.trim(tmpObj.find('td[id^=postmessage_]').text()), //内容
                    guessQQ = content.match(/\d{5,11}/);
                    if (guessQQ && guessQQ.length > 0) {
                        guessQQ = guessQQ[0];
                    } else {
                        guessQQ = '';
                    }
                    if (duplicate) {
                        tmpResultDuplicate[pn] = {
                            pn: pn,
                            link: link,
                            uid: uid,
                            name: name
                        };
                    } else {
                        tmpResult[pn] = {
                            pn: pn,
                            link: link,
                            uid: uid,
                            name: name,
                            guessQQ: guessQQ,
                            sp: sp,
                            content: content
                        };
                    }
                }
                Object.assign(result, tmpResult);
                Object.assign(resultDuplicate, tmpResultDuplicate);
                completeCount++;
                concurrentNum--;
                runLoop();
            } catch (e) {
                if (count > 5) {
                    console.error(`Error 0: page:${page} ${i} ${e}`);
                    errorPages[errorPages.length] = page;
                    completeCount++;
                    concurrentNum--;
                    runLoop();
                } else {
                    fetchPage(page, count + 1);
                }
            }
        }).fail(() => {
            if (count > 5) {
                console.error(`Error 1: page:${page} ${e}`);
                errorPages[errorPages.length] = page;
                completeCount++;
                concurrentNum--;
                runLoop();
            } else {
                fetchPage(page, count + 1);
            }
        });
    }
    function showResult() {
        updateResult();
        showMenu({
            mtype: 'win',
            menuid: 'result_window',
            duration: 3,
            pos: '00',
            zindex: JSMENU['zIndex']['win'],
            drag: 1,
            cache: 1
        });
    }
    function updateResult() {
        rsWindow.find('.gd-wa textarea').val(getResultText());
    }
    function getResultText(isDownload) {
        if (Object.entries(result).length == 0)
            return null;
        let resultText = '\uFEFF',
        separator = isDownload ? ',' : '\t',
        isResult = rsWindow.find('#radio_result').prop('checked'),
        tmpResult = isResult ? result : resultDuplicate;
        if (rsWindow.find('#checkbox_uid').prop('checked')) {
            for (let i in tmpResult) {
                resultText += tmpResult[i].uid + '\n';
            }
        } else {
            if (isResult) {
                resultText += ['楼层', '链接', 'UID', '用户名', '猜QQ', '蒸汽'].join(separator);
                if (isDownload)
                    resultText += `${separator}内容`;
                resultText += '\n';
            } else {
                resultText += ['楼层', '链接', 'UID', '用户名'].join(separator) + '\n';
            }
            for (let i in tmpResult) {
                if (isResult) {
                    if (isDownload) {
                        resultText += `${tmpResult[i].pn}${separator}${tmpResult[i].link}${separator}${tmpResult[i].uid}${separator}${escapeContent(tmpResult[i].name)}${separator}${tmpResult[i].guessQQ}${separator}${tmpResult[i].sp}${separator}${escapeContent(tmpResult[i].content)}\n`;
                    } else {
                        resultText += `${tmpResult[i].pn}${separator}${tmpResult[i].link}${separator}${tmpResult[i].uid}${separator}${tmpResult[i].name}${separator}${tmpResult[i].guessQQ}${separator}${tmpResult[i].sp}\n`
                    }
                } else {
                    if (isDownload) {
                        resultText += `${tmpResult[i].pn}${separator}${tmpResult[i].link}${separator}${tmpResult[i].uid}${separator}${escapeContent(tmpResult[i].name)}\n`;
                    } else {
                        resultText += `${tmpResult[i].pn}${separator}${tmpResult[i].link}${separator}${tmpResult[i].uid}${separator}${tmpResult[i].name}\n`
                    }
                }
            }
        }
        return resultText;
    }
    function escapeContent(content) {
        let contentText = content;
        if (/\"|\,|\n|\r/.test(contentText)) {
            contentText = `"${contentText.replace(/\"/g,'""')}"`;
        }
        return contentText;
    }
    function getLastPage() {
        let pageTitle = jQuery('.pg label>span').prop('title');
        return pageTitle ? pageTitle.match(/\d+/)[0] * 1 : 1;
    }
    function gdDownload(content, fileName) {
        if (!content)
            return;
        let tmpObj = jQuery(`<a download="${fileName}"></a>`),
        blob = new Blob([content], {
            type: 'text/csv;charset=utf-8'
        });
        tmpObj.prop('href', window.URL.createObjectURL(blob));
        tmpObj[0].click();
        window.URL.revokeObjectURL(tmpObj.prop('href'));
        tmpObj.remove();
    };
    function gd_addStyle(gdStyle) {
        return jQuery(`<style type="text/css">${gdStyle}</style>`).appendTo(jQuery('head'));
    }
})();