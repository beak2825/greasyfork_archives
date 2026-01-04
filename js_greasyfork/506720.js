// ==UserScript==
// @name         select court
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  111
// @author       You
// @match        https://lhqkl.ydmap.cn/booking/schedule/103909?salesItemId=102914
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506720/select%20court.user.js
// @updateURL https://update.greasyfork.org/scripts/506720/select%20court.meta.js
// ==/UserScript==

"use strict";

var cur_func = null;

function selectCourt(_arg1, _arg2, _arg3) {
    selectCourt.start = performance.now();
    let court_num_start = 16;
    var skip_count = 0, court_required = 1;
    console.warn("select court..." + 'start court ' + court_num_start + ', skip ' + skip_count + ', count ' + court_required);
    selectCourt.hours = ['20:00-', '21:00-'];
    selectCourt.hour_rows = [];

    var table_body = document.getElementsByClassName('schedule-table__body')[0];
    // WY 优化
    //console.warn('table row count:' + table_body.rows.length);
    if (!table_body || table_body.rows.length == 0) {
        setTimeout(() => {
            selectCourt();
        }, 100);
        return;
    }

    // 按开始时间查找对应的row
    for (var i = 0; i < table_body.rows.length; i++)
    {
        var current_row = table_body.rows[i];
        var j = 1;
        for (var row_checked = false; j < 28 && !row_checked; j++)
        {
            let current_row_col = current_row.getElementsByClassName('schedule-table_column_' + j.toString())[0];
            if (current_row_col)
            {
                row_checked = true;
                var current_row_col_div = current_row_col.getElementsByTagName('div')[0];
                // console.warn('row '+i.toString() + ': ' + current_row_col1_div.innerText);
                for (var hours_start in selectCourt.hours)
                {
                    if (current_row_col_div.innerText.includes(selectCourt.hours[hours_start]))
                    {
                        console.warn('match ' + selectCourt.hours[hours_start] + ' at row ' + i.toString());
                        selectCourt.hour_rows.push(i);
                        break;
                    }
                }
            }
        }

        if (j >= 28)
        {
            console.warn('row ' + i.toString() + ' is empty');
        }
    }

    console.warn('rows to select: ' + selectCourt.hour_rows);

    var current_court = court_num_start;
    // 选择场地
    for (; current_court <= 27; current_court++) {
        console.warn('current court:' + current_court.toString());
        var cells_to_click = [];
        try {
            for (var row_idx in selectCourt.hour_rows)
            {
                current_row = table_body.rows[selectCourt.hour_rows[row_idx]];
                let current_cell = current_row.getElementsByClassName('schedule-table_column_' + current_court.toString())[0];
                if (!current_cell || current_cell.getAttribute('class').includes('col-'))
                {
                    cells_to_click.length = 0;
                    console.warn('row ' + selectCourt.hour_rows[row_idx] + ' is not valid');
                    break;
                }
                else
                {
                    cells_to_click.push(current_cell);
                }
            }

            if (cells_to_click.length == 0)
            {
                continue;
            }

            if (skip_count > 0)
            {
                console.warn('court ' + current_court.toString() + ' is skipped');
                skip_count--;
                continue;
            }

            console.warn('court ' + current_court.toString() + ' is selected');

            for (var idx in cells_to_click)
            {
                cells_to_click[idx].click();
            }

            court_required--;

            if (court_required <= 0) {
                break;
            }
        }
        catch (e) {
            console.warn(e);
            continue;
        }
    }

    setTimeout(() => {
        let b = document.getElementsByTagName('button')[0];
        if (b.disabled)
        {
            console.warn('button next is disabled');
            setTimeout(() => {
                selectCourt();
            }, 100);
            return ;
        }
        else
        {
            console.warn('button next is clicked');
            b.click();
        }

        setTimeout(() => {
            acceptAgreement();
        }, 100);

    }, 100);

}

function acceptAgreement() {
    cur_func = acceptAgreement;
    console.warn('check agreement dialog');
    var confirm_dialog = document.getElementsByClassName('desc-content')[0];
    console.log('confirm dialog: ' + confirm_dialog);

    try {
        if (confirm_dialog && confirm_dialog.scrollHeight > 500) {
            console.warn('scroll height :' + confirm_dialog.scrollHeight);
            console.warn('ready to scroll');
            confirm_dialog.scrollTo(0, confirm_dialog.scrollHeight);
        }
        else {
            console.warn('NOT ready to scroll');
            setTimeout(() => {
                checkUrl();
            }, 50);

            return;
        }

        setTimeout(() => {
            var buttons = document.getElementsByTagName('button');
            if (buttons && buttons[3]) {
                buttons[3].click();
            }
            setTimeout(() => {
                checkUrl();
            }, 50);
        }, 50);
    }
    catch (e) {
        console.warn(e);
        setTimeout(() => {
            acceptAgreement();
        }, 50);

        return;
    }
}

function confirmMember(_arg1, _arg2, _arg3)
{
    try{
        // document.getElementsByClassName('slider-item')[11].click();
        console.warn("confirm menber...")

        var is_ready = false;
        var el_ul = document.getElementsByClassName('compact-ul')[0];

        if (el_ul)
        {
            var cbox = document.getElementsByClassName('el-checkbox__original')[0];
            console.warn('first li :' + cbox);
            if (cbox)
            {
				setTimeout(() => {
					var cbox = document.getElementsByClassName('el-checkbox__original')[0];
                    // WY 优化
					//cbox.click();

					setTimeout(() => {
						var next_btn = document.getElementsByClassName('el-button')[2];
						next_btn.click();
                        const end = performance.now();
                        const elapsedTime = end - selectCourt.start;
                        console.log(`${elapsedTime}`);
					}, 100);

				}, 100);

                is_ready = true;
            }
            else
            {
                console.warn('member li not ready');
            }
        }
        else
        {
            console.warn('member ul not ready');
        }

        if (!is_ready)
        {
            setTimeout(() => {
                confirmMember();
            }, 50);
            return ;
        }

    }
    catch (e) {
        console.warn(e);
    }
}

function confirmCourt(_arg1, _arg2, _arg3)
{
    console.log('confirm court');
    try{
        console.warn("confirm court...")

        setTimeout(() => {
            var next_button = document.getElementsByTagName('button')[0];
            var attr = next_button.getAttribute('class');
            console.warn("button:"+ next_button + ', attr: ' + attr);
            if (attr.includes('is-disabled'))
            {
                console.warn('button not ready');
                setTimeout(() => {
                    confirmCourt();
                }, 50);
            }
            else
            {
                next_button.click();
                setTimeout(() => {
                    checkUrl();
                }, 50);
            }

        }, 100);
    }
    catch (e) {
        console.warn(e);
        setTimeout(() => {
            confirmCourt();
        }, 50);
    }
}

function checkUrl()
{
    console.log('checkUrl');
    if (checkUrl.currentUrl === window.location.href)
    {
        if (cur_func != null)
        {
            cur_func();
            return ;
        }
        setTimeout(() => {
            checkUrl();
        }, 50);
        return ;
    }

    cur_func = null;
    checkUrl.currentUrl = window.location.href;
    console.log('current url:' + checkUrl.currentUrl);

    if (checkUrl.currentUrl === 'https://lhqkl.ydmap.cn/booking/schedule/103909?salesItemId=102914')
    {
        selectCourt();
    }
    else if (checkUrl.currentUrl.includes('contact-collect'))
    {
        confirmMember();
    }
    else if (checkUrl.currentUrl.includes('dataKey='))
    {
        confirmCourt();
    }
}


(function() {
    'use strict';
    alert('监控程序已启动，关闭此弹窗后保持页面激活状态');

    window.onload = checkUrl;
//    if (('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || document.documentMode == 8)) {
//        window.onhashchange = checkUrl;
//    } else {
//        // 如浏览器不支持onhashchange事件，则用定时器检测的办法
//        setInterval(checkUrl, 100);
//    }
})();
