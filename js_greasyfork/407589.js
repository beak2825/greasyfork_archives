// ==UserScript==
// @name         WELearn一键完成课程
// @namespace    WELearnToSleep
// @version      0.2
// @description  WELearn一键完成课程，支持指定分数（正确率）。WELearnToSleep的js版。
// @author       Avenshy
// @homepageURL  https://github.com/Avenshy/WELearnToSleep-JavaScript
// @supportURL   https://github.com/Avenshy/WELearnToSleep-JavaScript/issues
// @match        *://*.sflep.com/*
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407589/WELearn%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/407589/WELearn%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (typeof API_1484_11 == "undefined") {
        return null;
    }
    let removeClass;
    function runRefresh() {
        if (window.confirm('本章已完成，是否重置成未完成？')) {
            let finishResult = Array(3);
            finishResult[0] = API_1484_11.SetValue('cmi.progress_measure', 0);
            finishResult[1] = API_1484_11.SetValue('cmi.score.scaled', '');
            finishResult[2] = API_1484_11.SetValue('cmi.completion_status', 'not_attempted');
            EndSCO(true);
            $('#liSCO_' + scoid).removeClass("course_disable"); 
            SelectSCO(scoid);
            alert('progress: ' + (finishResult[0] ? '成功' : '失败') + '\nscore: ' + (finishResult[1] ? '成功' : '失败') + '\nstatus: ' + (finishResult[2] ? '成功' : '失败'));
        }
    }
    function changeRefresh(reliveClass) {
        let refreshClass = document.querySelector('.refreshClass');
        // if (API_1484_11.GetValue('cmi.completion_status') == 'not_attempted' && parseInt(API_1484_11.GetValue('cmi.progress_measure')) == 0) {
        // 不稳定的判断，不如照抄官方
        if (!$("#liSCO_" + scoid).hasClass("course_disable")) {
            if (refreshClass != null) {
                return (refreshClass.parentNode.removeChild(refreshClass));
            }
        } else {
            if (reliveClass == undefined) {
                if (refreshClass == null) {
                    let sidebar2 = document.createElement('span');
                    sidebar2.setAttribute('class', 'refreshClass');
                    let href2 = document.createElement('a');
                    href2.setAttribute('href', 'javascript:void(0);');
                    href2.textContent = '重置';
                    href2.addEventListener('click', runRefresh, false);
                    sidebar2.appendChild(href2);
                    document.querySelector('.c_s_2').querySelector('li').appendChild(sidebar2);
                }
            } else {
                if (refreshClass == null) {
                    document.querySelector('.c_s_2').querySelector('li').appendChild(reliveClass);
                }
            }
        }
        return null;


    }
    function runFinish() {
        // showLoading();
        let finishResult = Array(3);
        let inputcrate, mycrate;
        inputcrate = window.prompt('请输入分数（正确率）：', '100');
        if (inputcrate == null) {
            return null;
        } else {
            mycrate = parseInt(inputcrate);
            if (mycrate == undefined) {
                alert('输入错误！');
                return null;
            }
            // 不判断分数大小是否合法，因为官方也没判断，要多少分有多少分
        }
        finishResult[0] = API_1484_11.SetValue('cmi.progress_measure', 1);
        finishResult[1] = API_1484_11.SetValue('cmi.score.scaled', mycrate);
        finishResult[2] = API_1484_11.SetValue('cmi.completion_status', 'completed');
        EndSCO(true);
        SelectSCO(scoid)
        alert('progress: ' + (finishResult[0] ? '成功' : '失败') + '\nscore: ' + (finishResult[1] ? '成功' : '失败') + '\nstatus: ' + (finishResult[2] ? '成功' : '失败'));
        // hideLoading();
    };
    // 简单hook官方SelectSCO()函数
    let _SelectSCO = SelectSCO;
    window.SelectSCO = function (s) {
        console.log('[WELearnToSleep] HOOK SelectSCO()');
        _SelectSCO(s);
        let result = changeRefresh(removeClass);
        if (result != null) {
            removeClass = result; // 储存元素避免内存浪费
        }

    };
    clearInterval(actTimerID); // 清除30分钟挂机检测
    window.CheckActive = undefined; // 以防万一还是把函数hook掉
    // 简单hook官方KeepLearnTimeAndCheckToken()函数
    window.KeepLearnTimeAndCheckToken = function () {
        console.log('[WELearnToSleep] HOOK KeepLearnTimeAndCheckToken()');
        if (scoid == '')
            return;
        //sco学习时间
        var total_time = API_1484_11.GetValue('cmi.total_time');
        $.ajax({
            url: ajaxUrl,
            data: "action=keepsco_with_getticket_with_updatecmitime&uid=" + userid + "&cid=" + courseid + "&scoid=" + scoid + "&session_time=" + curSessionTime + "&total_time=" + total_time + "&&nocache=" + Math.random(),
            type: "POST",
            success: function (reData) {
                if (reData.ret == 0 || reData.ret == 1) {
                    //保持计时 keep alive
                    if (reData.ret == 0) {
                        isTimeout = false;
                        //更新客户端sco学习时间
                        UpdateTotalTime_Client(parseInt(reData.seconds));
                    }
                    //重新开始计时
                    else if (reData.ret == 1) {
                        isTimeout = false;
                    }
                }
            },
            error: function (request, status, err) {
                if (status == "timeout") {
                    isTimeout = true;
                }
            }
        });
    }
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = `
        .c_s_2 .finishClass a{
	        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA3LTIyVDE0OjAzOjMyKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0yMlQxNDoxNTo0MCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0yMlQxNDoxNTo0MCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1MjRhYWJiMS1lMTQ2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) no-repeat;
            background-size: 25px 25px;
            background-position: 45% 25%;
        }
        .c_s_2 .finishClass a:hover{
	        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGymlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA3LTIyVDE0OjAzOjMyKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0yMlQxNDoxNzoyOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0yMlQxNDoxNzoyOSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NGZlMThkZi1mZGE5LWE5NGQtODg1NS01NTUwNzcxNTcwYjMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0NDAwNTVlNS01ZWZhLTVhNDctYmZmMC0zYWFjMTEwNDA4ZWIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MjRhYWJiMS1lMTQ2LWYwNGMtYjRmNi02MjRhNGM1NmVmMGYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUyNGFhYmIxLWUxNDYtZjA0Yy1iNGY2LTYyNGE0YzU2ZWYwZiIgc3RFdnQ6d2hlbj0iMjAyMC0wNy0yMlQxNDowMzozMiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiYWY4ODQxOC04OGU0LWJmNDAtYjkxMy05M2ZkNzAwMzQ0YTgiIHN0RXZ0OndoZW49IjIwMjAtMDctMjJUMTQ6MTc6MjkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODRmZTE4ZGYtZmRhOS1hOTRkLTg4NTUtNTU1MDc3MTU3MGIzIiBzdEV2dDp3aGVuPSIyMDIwLTA3LTIyVDE0OjE3OjI5KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+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) no-repeat;
            background-size: 25px 25px;
            background-position: 45% 25%;
            color: #ccc;
        }
        .c_s_2 .refreshClass a{
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA3LTI0VDAyOjEwOjEzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0yNFQwMjoxMToyMiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0yNFQwMjoxMToyMiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4YjQwYjUzZi03MjI1LWM4NGItYWNhNS00YWIxZTMwNGYwZjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OGI0MGI1M2YtNzIyNS1jODRiLWFjYTUtNGFiMWUzMDRmMGY1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OGI0MGI1M2YtNzIyNS1jODRiLWFjYTUtNGFiMWUzMDRmMGY1Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4YjQwYjUzZi03MjI1LWM4NGItYWNhNS00YWIxZTMwNGYwZjUiIHN0RXZ0OndoZW49IjIwMjAtMDctMjRUMDI6MTA6MTMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4HkQI6AAADZUlEQVR42u2aTWgTQRTHN2kLWkXRlKqIX0VPCoofINaqoHjxIKL43UaQKoqoqFA/ECnqxeJB8SaIHjz4hd4E9SBIDwoqgkcVoaDV1JKStpTGJv4feaFh2Qmb3Znd2n1/+F02ZGbnv29mZ/a9WD6ft6KsuBVxiQFigBggBogBUVZ1QP1MB41gLVgG6kGCoXvIgF7wFXwG78FL8Mf0jcUMboQmgT2gFayivir8fw68A/fAfTZJv8gAzdSBG6Avr08Z0AESZfq1y9X96hx4FTgKevPmlAanQFyXAbqmwDzwGKxU/D4CPoBO8AZ84/ndw6E+ldeFxWA52MxrhUrUzgHwpTSY7dM7qCmwHvxWPLEucAnM9tDufHAFpBRtU6RtDHsKJMGwIlSPg2oNBteC86DfoZ8saAnLgK3gr0PHD8EMA4vrHPDKoT+6h91BG9AEBm0djoA2EDMw+NKFth3kHCIhMANmOszLYY4IKyAOseHlZMyAZ7aO6GnsD3DwRVrDMKDZoaOzIQy+SIdfAyrZB0zg9/cs2/t4Hb/LTcnrRsXVPqCS0+BB2+AHeDOSs/5juTWgBpyxXbtu24mNawNqwVM+spL6wc3x8D2g0rMArQM7wRRwK4oGyCcxMUAMEAPEADFADBADxAAxQAwQA8QAMWBs6Rho4SO7keOw0W9zPlUHvluFlDx9tKGUejvoi0oEnOTBk6gYYxsYjMoUWABO2K5dA9koTAF6gK9BU8m1n6ABDAUVARd5kCpM6pxt8KTTbgdfeKzuszAqUWpsbwhZoaRDkvRJpe3oMKCYnW0OcPDbHTLCVKRRH6QBWYf0+AVF/Y4uYlwsYc8MD4A1Xtr0Y8AuRYHEc48lMW7S8o8c+qPU/Bav7foxgK7tU5TIZLhYYqKGgddwZZhT2d0QV4dYYRlAbAA9irUhxYVODR5ubi64DH4o2u4GjX4N9rMPiNk2I3etQqpcpU/gBfhoFcphUyDNr+IEb2cXWaMltUtBlaItqiDdAbp8v0g1RECROFeGmSyUpEg7rHOh1RUBpZoG2sARq5BE1SGKlDvgqjWaodYik8nRyVahWDoJVpcJZ5Wo8OItuA0euD3cjCUDSkUntE1gBVgCFnKkUIRQGW2xbPYXrxGdTNr0jUl6XD6JiQFigBggBogB0dU/zn+G9BWG/eIAAAAASUVORK5CYII=) no-repeat;
            background-size: 25px 25px;
            background-position: 45% 25%;
        }
        .c_s_2 .refreshClass a:hover{
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGymlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA3LTI0VDAyOjEwOjEzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0yNFQwMjoxNTowNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0yNFQwMjoxNTowNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MGI0MDQwNi1iNWM4LWIyNGUtYjY5OC1lMzUxNDA1ODg4YTUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2NzQ1OWE0ZC0xYjU3LTkzNDItODE3YS00NmYzMzg3OGVhZDIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4YjQwYjUzZi03MjI1LWM4NGItYWNhNS00YWIxZTMwNGYwZjUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjhiNDBiNTNmLTcyMjUtYzg0Yi1hY2E1LTRhYjFlMzA0ZjBmNSIgc3RFdnQ6d2hlbj0iMjAyMC0wNy0yNFQwMjoxMDoxMyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowYmMyM2RiNS03Zjg3LWRkNDItYmI5ZS1mZGY3ZTY2ZDkyNDAiIHN0RXZ0OndoZW49IjIwMjAtMDctMjRUMDI6MTU6MDUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NzBiNDA0MDYtYjVjOC1iMjRlLWI2OTgtZTM1MTQwNTg4OGE1IiBzdEV2dDp3aGVuPSIyMDIwLTA3LTI0VDAyOjE1OjA1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+73ZwAAA6pJREFUeNrt2lloXHUUx/FPUgNVS0ubKA3EpaK+KCguILiCy6tIVdwj1ipu4IMgtsRqrSj6IlqsWnFfqlXRB8EFoVAiWFBxeZIqBVtKbFNTjVpJzPXhnsHJdDKaZubOxPn/4EJy7x0u/+//nPM///85HVmWaWd1JAAJQAKQACQACUACUPulndtn+p1FOBNn4WQcju64DsKv2IPv8S0+x8cYnslHs96+pgI4FFdiOU5HxzR/P4EteBGvBqRZAaAHA7ge8+tkqaN4Cg/XsIpsv7EVDGAObsYaLGyQy+7FajwWFtIyAI7CWzhtiud/4QsMYjN+iJncHQNZEHHhBJyCiyJWTKXBsLCtrQDgXGzEYVWebcezce2Y5mwfjRvDqnqqPP8Zl+GTZgLox3p0VTHVe/Ekxmdo9ofgTqyIwFqucSzDS80AcDHeDt8v10bcgaE6+/8ReB7nV3Gva/B6kQDOxoc4uGLZWoFHqsxGvTQnLGugYlkdj3yiEACL8U2FX46FP75XUAJ3E9ahs+bYGgTg3TD/8uh7HV4pOItdjmeKBnBtBJxy3RMJSjP0KO4qCsDcWL97K9bjc6okJfXUgcaTugO4DWvLbv8WycrWBs9ySwDowneRnJS0GqsKMPOWALAgBtsfW9vRgDHcLgBKf87F5bHLW9vqhx3NPg9IABKABCABSAASgAQgAUgAEoAEIAFIABKAxut2/II3sa8RAA74YKKAwfdgm7xytEdeUr8/6+3b2y4A1mBl2f/bcHzW2zfWDgCW4GvMK7t3K9a1gwt0YpO8VFfSThyDfUUBGAgTbIZWVvn2VaJQWhSATF6dfa3gwffLq8XlFvYOljZqGaz14jhuwMsFDX4pNphcEd6FE/FTUQAqS9IT8tL1QxpXKuuQ1yIfMLky/DsuxKeNTIQqX7xC3r5W2SDxgby1ZUedB78YT+DSivtjuATvNzoTzKrMxtXhh5UtMqMRnB7HHzMceJe842SV/dvu/pQ3S20oIhXOpljezpN3iHVX+eluPI3n5JXl6ehIeQ/AMpMr0iUNRSwYLGovkNVY35fgBXmpfCp9hY/wpbwddhdGwpe7I509zj8ttSdVca+StoQr/FjkZij7lwSnMzYk92lco+RwrP3r/0ugLRpASQtxN25Rv1bZkXCjB2OzMyu2w/PkzdL9OKOGOU+lCXwWs/1GLHWz9jxgES7AqZGsHBuWMl/e51dqmx2KGDEY10hLHIj8n5UAJAAJQAKQACQAbay/AQq3Cp8qfYSyAAAAAElFTkSuQmCC) no-repeat;
            background-size: 25px 25px;
            background-position: 45% 25%;
            color: #ccc;
        }`;
    document.body.appendChild(style);
    let sidebar = document.createElement('span');
    sidebar.setAttribute('class', 'finishClass');
    let href = document.createElement('a');
    href.setAttribute('href', 'javascript:void(0);');
    href.textContent = '起飞';
    href.addEventListener('click', runFinish, false);
    sidebar.appendChild(href);
    document.querySelector('.c_s_2').querySelector('li').appendChild(sidebar);
    window.onload = function () {
        changeRefresh();
    };
})();