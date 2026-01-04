// ==UserScript==
// @name         NGA ui-崩铁罗盘求解器
// @namespace    https://greasyfork.org/users/994825
// @version      1.0
// @description  一个基于nga-ui的罗盘求解器
// @author       InfSeinP
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @match        *://bbs.nga.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465669/NGA%20ui-%E5%B4%A9%E9%93%81%E7%BD%97%E7%9B%98%E6%B1%82%E8%A7%A3%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/465669/NGA%20ui-%E5%B4%A9%E9%93%81%E7%BD%97%E7%9B%98%E6%B1%82%E8%A7%A3%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Init common
    const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
    const $ = page.$;
    const _$ = page._$;
    const commonui = page.commonui;
    if (!commonui) { return; }

    // Core functions
    const _getN = (moon) => {
        return moon===4 ? 3 : 6/moon;
    }
    const _getM = (startRotate, moon, isAdd) => {
        for (let i = 0; i < 15; i++) {
            const curr = startRotate + (isAdd ? 1 : -1) * moon * 60 * i;
            if (curr % 360 === 0) { return i; }
        }
        return -1;
    }
    const _solve = (N1,N2,N3,M1,M2,M3) => {
        let x = 0;
        let y = 0;
        let z = 0;
        while (x <= 10 && y <= 10 && z <= 10) {
            if ((x + y) % N1 == M1) {
                if ((x + z) % N2 == M2) {
                    if ((y + z) % N3 == M3) {
                        return [x,y,z];
                    }
                }
            }
            z++;
            if (z > 10) {
                z = 0;
                y++;
            }
            if (y > 10) {
                y = 0;
                x++;
            }
        }
        return [];
    }

    // Add ui-entry
    commonui.mainMenu && commonui.mainMenu.addItemOnTheFly('罗盘求解器', null, () => {
        const w = commonui.createadminwindow();
        var csz, ft, bt, bs, bt1, bt2, bs1, bs2, blk;
        var xStart, xMoon, xNotAdd, yStart, yMoon, yNotAdd, zStart, zMoon, zNotAdd;
        w._.addContent(null);
        w._.addContent(
            '请观察游戏中的罗盘，填入相应的参数', _$('/br'),
            _$('/span','class','silver','innerHTML','注意: 只支持三个转动组都是2个圈一起转的罗盘!'), _$('/br'),
            _$('/table')._.add(_$('/tbody')._.add(_$('/tr')._.add(
                _$('/td','innerHTML','<strong>圈位 |</strong>','style','padding:3px;text-align:center;'),
                _$('/td','innerHTML','<strong>初始角度</strong>','style','padding:3px;text-align:center;'),
                _$('/td','innerHTML','<strong>| 亮起的月亮数</strong>','style','padding:3px;text-align:center;'),
                _$('/td','innerHTML','<strong>| 逆时针旋转</strong>','style','padding:3px;text-align:center;'),
            ))._.add(_$('/tr')._.add(
                _$('/td','innerHTML','<strong>内圈 |</strong>','style','padding:1px;text-align:center;'),
                _$('/td', xStart = _$('/input','id','csz','maxlength','3','style','width:45px;','placeholder','整数') ,'style','padding:1px;text-align:center;'),
                _$('/td', xMoon = _$('/input','id','csz','maxlength','1','style','width:50px;','placeholder','整数') ,'style','padding:1px;text-align:center;'),
                _$('/td', xNotAdd = _$('/input','type','checkbox') ,'style','padding:1px;text-align:center;'),
            ))._.add(_$('/tr')._.add(
                _$('/td','innerHTML','<strong>中圈 |</strong>','style','padding:1px;text-align:center;'),
                _$('/td', yStart = _$('/input','id','csz','maxlength','3','style','width:45px;','placeholder','整数') ,'style','padding:1px;text-align:center;'),
                _$('/td', yMoon = _$('/input','id','csz','maxlength','1','style','width:50px;','placeholder','整数') ,'style','padding:1px;text-align:center;'),
                _$('/td', yNotAdd = _$('/input','type','checkbox') ,'style','padding:1px;text-align:center;'),
            ))._.add(_$('/tr')._.add(
                _$('/td','innerHTML','<strong>外圈 |</strong>','style','padding:1px;text-align:center;'),
                _$('/td', zStart = _$('/input','id','csz','maxlength','3','style','width:45px;','placeholder','整数') ,'style','padding:1px;text-align:center;'),
                _$('/td', zMoon = _$('/input','id','csz','maxlength','1','style','width:50px;','placeholder','整数') ,'style','padding:1px;text-align:center;'),
                _$('/td', zNotAdd = _$('/input','type','checkbox') ,'style','padding:1px;text-align:center;'),
            ))),
            _$('/button','type','button','class','larger','innerHTML','确认','onclick',async () => {
                /** 获取输入数据 */
                const xS = parseInt(xStart.value); const xM = parseInt(xMoon.value); const xN = xNotAdd.checked;
                const yS = parseInt(yStart.value); const yM = parseInt(yMoon.value); const yN = yNotAdd.checked;
                const zS = parseInt(zStart.value); const zM = parseInt(zMoon.value); const zN = zNotAdd.checked;
                /** 检查输入数据的合法性 */
                let invalid = false; const errmsgs = [];
                if (xS % 60 !== 0 || yS % 60 !== 0 || zS % 60 !== 0) {
                    invalid = true; errmsgs.push('起始角度不正确:应当是60度的整数倍')
                }
                if (xM<1||xM>4 || yM<1||yM>4 || zM<1||zM>4) {
                    invalid = true; errmsgs.push('月亮数不正确:应当是1~4的整数')
                }
                if (invalid) {
                    alert('输入的数据有错误,请检查:\n' + errmsgs.join('\n'))
                    return
                }
                /** 组装公式数据 */
                const n1 = _getN(xM); const n2 = _getN(yM); const n3 = _getN(zM);
                const m1 = _getM(xS, xM, !xN); const m2 = _getM(yS, yM, !yN); const m3 = _getM(zS, zM, !zN);
                /** 对公式求解 */
                const result = _solve(n1,n2,n3,m1,m2,m3)
                if (!result || result.length < 3) {
                    alert('求解失败。')
                } else {
                    let msg = '求解成功! 请尝试这样操作:';
                    if (result[0]) { msg += `\n\t[内圈]和[中圈]一起转动${result[0]}次`}
                    if (result[1]) { msg += `\n\t[内圈]和[外圈]一起转动${result[1]}次`}
                    if (result[2]) { msg += `\n\t[中圈]和[外圈]一起转动${result[2]}次`}
                    alert(msg)
                }
            })
        );
        w._.addTitle('崩铁罗盘求解器');
        w._.show();
    });
})();