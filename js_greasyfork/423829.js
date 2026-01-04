// ==UserScript==
// @name         抖店 - 辅助插件
// @version      1.5
// @author       Siukei
// @description  抖店 - 抖音小店辅助插件
// @match        *://*.jinritemai.com/*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @icon         https://www.smzdm.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://fxg.jinritemai.com
// @downloadURL https://update.greasyfork.org/scripts/423829/%E6%8A%96%E5%BA%97%20-%20%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/423829/%E6%8A%96%E5%BA%97%20-%20%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    let liveList = '/dashboard/live/list'
    let liveControl = '/dashboard/live/control'
    let pathname = window.location.pathname
    let timer, interval;
    let autoClick = 0;
    if (pathname == liveList || pathname == liveControl) {
        setTimeout(function () {
            let top = $('#portal > section > header').height();
            console.log(top);
            let form = '<div style="position:fixed;right:30%;top:' + top + 'px;width:300px;height:30px;border:0px solid #c4dbfe" id="divFilter"><div><input type="text" id="sortNo" style="width:40px" /></div></div>';
            $('body').after(form);

            $('div.ant-table-body > table > tbody > tr > td:nth-child(3) > div > div:nth-child(2)').on('dblclick', function () {
                //div.ant-table-body > table > tbody > tr:nth-child(7) > td:nth-child(3) > div > div._3kp7XufZMUUoj0Hz4zSOrR
                let $tr = $(this).parents('tr')
                let index = $tr.attr('index')
                console.log(index+"------");
                if (index >= 0) { 
                    let first = $tr.find('td:last > div > a:first')
                    let text = first.text()
                    // console.log(text + dateNow());
                    let jj = first[0]
                    if (text == '讲解') {
                        clearTimer();
                        $('#sortNo').val(parseInt(index) + 1);
                        autoClick = 1;
                        jj.click();//讲解
                        interval = setInterval(() => {
                            // console.log(jj.text + '1111111');
                            console.log(jj);
                            autoClick = 1;
                            jj.click();//取消讲解
                            timer = setTimeout(() => {
                                // console.log(jj.text + '2222222');
                                if (jj.text == '讲解') {
                                    autoClick = 1;
                                    jj.click();//讲解
                                }
                            }, 1300);
                        }, 10000);
                    } else if (text == '取消讲解') {
                        clearTimer();
                        console.log(jj);
                        jj.click();//取消讲解 

                    } else {
                        console.log('未直播');
                    }
                }
            })
            //#app > div._13FTK5zgdqS8GdLgeOj_hl > div > div._2HvYLpg_v1a0zG5d1zhwKu > div > div > div > div > div > div.ant-table-body > table > tbody > tr:nth-child(2) > td.ant-table-cell.ant-table-cell-fix-right.ant-table-cell-fix-right-first > div > a:nth-child(2)
            $('div.ant-table-body > table > tbody > tr > td:last-child > div > a').on('click', function () {
                if (autoClick == 1) {
                    let text = $(this).text()
                    console.log(text + dateNow());
                } else {
                    clearTimer();
                    console.log('取消自动讲解');
                    
                }
                autoClick = 0;
            })

            //#app > div > div._2S3ob6moWGyo3LlOey1efs._3OPYG6hKVRqHi8htsNTL-w > div > div:nth-child(3) > div > div._2oDseDEUuhW--Y3VFpCtYI > div > div:nth-child(1) > div._1yKEpDP3I5xX8uYKaUmOjn > div._2gvPkQwjrJX3M7H6L4BUil > img
            //#app > div > div._2S3ob6moWGyo3LlOey1efs._3OPYG6hKVRqHi8htsNTL-w > div > div:nth-child(3) > div > div._2oDseDEUuhW--Y3VFpCtYI > div > div:nth-child(2) > div._1yKEpDP3I5xX8uYKaUmOjn > div._2gvPkQwjrJX3M7H6L4BUil > img
        }, 6000);

    }
    //回车键自动查询
    function keyPage() {
        $(document).on('keydown', function (e) {
            // console.log(e.key);
            //兼容搜索页、精选页方向键翻页，空格=32
            let keyCode = e.keyCode;
            if (keyCode == 13 || keyCode == 32) {
                autoQuery();
            }
        })
    }
    keyPage()

    setTimeout(function () {
        console.log($("form input").length);
        $("form input").on('paste', function (e) {
            setTimeout(function () {
                autoQuery();
            }, 300);
        });

        $("div.shop-goods-list-content-operations > button.ant-btn.primary-btn.ant-btn-primary").on("click", function (event) {
            console.log(event);

            // document.querySelector('body').addEventListener('DOMNodeInserted', function (e) {
            //     // console.log(e.target);                
            //     console.log(e.target.className); 
            // });
            //自动选中 不在橱窗显示
            setTimeout(function () {
                $("div.ant-drawer-body > div > div > div.add-shop-goods-drawer-footer.footer-space-between > label").click();
            }, 1300);
        })
    }, 4000);

    function autoQuery() {
        $("div > div > button.ant-btn.ant-btn-primary").each(function () {
            let btn = $(this);
            if (btn.text() == '查询') {
                btn.click();
                setTimeout(function () {
                    let seeAddress = $("div.mortise-rich-table > div > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div > div > a");
                    // console.log(seeAddress[0]); 
                    seeAddress[0] && seeAddress[0].click();

                }, 1000);
                return;
            }
        });
    }

    function clearTimer() {
        interval && clearInterval(interval);
        timer && clearTimeout(timer);
        $('#sortNo').val('');
    }

    function consoleLog(log) {
        console.log(log);
    }

    function dateNow() {
        return dateFormat("YYYY-mm-dd HH:MM:SS", new Date());
    }

    function dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }
})();