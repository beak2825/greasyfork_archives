// ==UserScript==
// @name         avtb auto open
// @namespace    websiteEnhancement
// @author   jimmly
// @version      2024.1.25
// @description  增加页面顶部底部按钮和一键下种按钮
// @create         2023-9-21
// @include        *avtb*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @license MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/476026/avtb%20auto%20open.user.js
// @updateURL https://update.greasyfork.org/scripts/476026/avtb%20auto%20open.meta.js
// ==/UserScript==

/**
 * @typedef { import('jquery') } $
 * @typedef { import('jQuery') } jQuery
 */;
; (async function (loadJS) {
    loadJS("https://update.greasyfork.org/scripts/483173/GM_config_cnjames.js")
        .then(v => loadJS("https://update.sleazyfork.org/scripts/476583/common_libs_of_array.js"))
        .then(v => {
            withJQuery(function ($, win) {

                let w = 40, h = 40;
                addStyle(`
                        a:link{color:green;}
                        a:hover{color:red;}
                        a:active{color:yellow;}
                        a:visited{color:orange;}
                        .btn1   {
                            opacity:0.8;-moz-transition-duration:0.2s;-webkit-transition-duration:0.2s;
                            padding:1px; margin-top:1px;
                            font-size: 10; text-align: center; vertical-align: middle; line-height:${h}px;
                            border-radius:5px 5px 5px 5px;cursor:pointer; left:0px;z-index:9999;
                            background:white;
                            width:${w}px;height:${h}px;
                        }
                    `);
                let container = $(document.createElement('div')).css({
                    'cssText': `position:fixed;top:15%;width:${w}px;height:${h * 7}px;left:0px;z-index:9999`
                });

                if (win.location.href.indexOf('tags') == -1) {
                    //下载按钮
                    let downloadBtn = $(document.createElement('div')).text('下載').appendTo(container)
                        .click(function () {
                            let url = $(".t_attachlist > dt > a:eq(1)").prop('href');
                            let filename = $("div.mainbox.viewthread>h1").text().trim() + '.torrent';
                            console.log(filename)
                            $.ajax({
                                url,
                                success: function (result, status, xhr) {
                                    let alink = document.createElement('a');
                                    alink.download = filename;
                                    alink.href = $(result).find("#downloadBtn").prop('href');
                                    document.body.appendChild(alink);
                                    alink.click();
                                },
                                error: function (xhr, status, error) {
                                    console.log(status, error)
                                }
                            });
                        });

                    $(document).keydown(function (event) {
                        let e = event || win.event;
                        let k = e.keyCode || e.which;
                        if (k === 16) {
                            //  isCtrl = true;
                            startBtn.click()
                        } else if (k === 38) {  //up
                            event.stopPropagation()
                            slowBtn.click()

                        } else if (k === 40) {//down
                            event.stopPropagation()
                            //fastBtn.click()
                        }
                    })
                    // $(win).blur(function () {
                    //     clearTimeout(win.___t)
                    //     win.___t = 0
                    // }).focus(function () {
                    //     win.___func();
                    // })

                    win.__wait = 900
                    win.__step = 100;
                    win.___func = function () {
                        win.______h = $(document).scrollTop() + win.__step;
                        if (win.______h >= $(document).height() - $(win).height()) {
                            clearTimeout(win.___t)
                            // win.___t = setTimeout(win.___func, 30000)
                        } else {
                            $(document).scrollTop(win.______h);
                            win.___t = setTimeout(win.___func, win.__wait)
                        }
                    };
                }
                else {
                    $('tr').hover(
                        function () {
                            $(this).find('*').css("background-color", "#9AAAC7")
                        }, function () {
                            $(this).find('*').css("background-color", '');
                        });
                }

                //最顶按钮
                let
                    toTopBtn = $(document.createElement('div')).text('Top').appendTo(container)
                        .click(function () {
                            win.scrollTo(0, 0);
                        }),
                    //最低按钮
                    toBottomBtn = $(document.createElement('div')).text('Bottom').appendTo(container)
                        .click(function () {
                            win.scrollTo(0, document.body.scrollHeight);
                        }),
                    //加速
                    fastBtn = $(document.createElement('div')).text('加速').appendTo(container)
                        .click(function () {
                            if (win.__wait > 5) {
                                win.__wait = win.__wait / 1.5
                            } else {
                                win.__wait = 5
                            }
                        }),
                    startBtn = $(document.createElement('div')).text('啓停').appendTo(container)
                        .click(function () {
                            if (!!!win.___t) {
                                win.___func();
                            } else {
                                clearTimeout(win.___t)
                                win.___t = 0
                            }
                        }),
                    slowBtn = $(document.createElement('div')).text('減速').appendTo(container)
                        .click(function () {
                            win.__wait *= 1.5
                        }),
                    setBtn = $(document.createElement('div')).text('設置').appendTo(container)
                        .click(function () {

                        });
                container
                    .find('div')
                    .addClass('btn1')
                    .hover(function (e) {
                        let o = $(this)
                        o.data('old_opacity', o.css('opacity'))
                            .data('old_border', o.css('border'))
                        o.css('opacity', 1).css('border', '1px solid black')
                    }, function (e) {
                        let o = $(this)
                        o.css('opacity', o.data('old_opacity')).css('border', o.data('old_border'))
                    })
                container.appendTo('body');

                autoFind(gmc => !(/[www]+\.avtb\.info\/\d+\//g).test(win.location.href), 'avtb', '.video>a', el => el.attr('title'), $, setBtn);

            })
        })


})(function (FILE_URL, async = true) {
    return new Promise((resolve, reject) => {
        let scriptEle = document.createElement("script");
        scriptEle.setAttribute("src", FILE_URL);
        scriptEle.setAttribute("type", "text/javascript");
        scriptEle.setAttribute("async", async);
        // success event 
        scriptEle.addEventListener("load", () => {
            resolve(FILE_URL)
        });
        // error event
        scriptEle.addEventListener("error", (ev) => {
            reject(ev);
        });
        if (document.currentScript)
            document.currentScript.insertBefore(scriptEle)
        else
            (document.head || document.getElementsByTagName('head')[0]).appendChild(scriptEle);
    })
});
