// ==UserScript==
// @name                                斗鱼直播间播放器置顶
// @license                             GPL-3.0 License
// @namespace                           https://greasyfork.org/zh-CN/scripts/399600-%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E6%92%AD%E6%94%BE%E5%99%A8%E7%BD%AE%E9%A1%B6
// @version                             0.63
// @description                         需与 sylus【[夜间斗鱼](https://userstyles.world/style/240/nightmode-for-douyu-com) NightMode For Douyu.com】 配合使用，可屏蔽除播放器外所有元素。
// @author                              QIUZAIYOU
// @match	                            *://*.douyu.com/0*
// @match	                            *://*.douyu.com/1*
// @match	                            *://*.douyu.com/2*
// @match	                            *://*.douyu.com/3*
// @match	                            *://*.douyu.com/4*
// @match	                            *://*.douyu.com/5*
// @match	                            *://*.douyu.com/6*
// @match	                            *://*.douyu.com/7*
// @match	                            *://*.douyu.com/8*
// @match	                            *://*.douyu.com/9*
// @match	                            *://*.douyu.com/topic/*
// @match	                            *://*.douyu.com/directory/myFollow
// @match	                            *://*.douyu.com/search/*
// @require                             https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require                             https://cdn.jsdelivr.net/npm/sweetalert2@11.3.6/dist/sweetalert2.all.min.js
// @resource                            swalStyle https://cdn.jsdelivr.net/npm/sweetalert2@11.3.6/dist/sweetalert2.min.css
// @grant                               GM_setValue
// @grant                               GM_getValue
// @grant                               GM_registerMenuCommand
// @grant                               GM_getResourceText
// @grant                               GM.info
// @supportURL                          https://github.com/QIUZAIYOU/Douyu-Player-StickyTop
// @homepageURL                         https://github.com/QIUZAIYOU/Douyu-Player-StickyTop
// @downloadURL https://update.greasyfork.org/scripts/399600/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E6%92%AD%E6%94%BE%E5%99%A8%E7%BD%AE%E9%A1%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/399600/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E6%92%AD%E6%94%BE%E5%99%A8%E7%BD%AE%E9%A1%B6.meta.js
// ==/UserScript==
//【NightMode For Douyu.com 夜间斗鱼：https://userstyles.org/styles/158117
$(function () {
    const util = {
        getValue (name) {
            return GM_getValue(name)
        },
        setValue (name, value) {
            GM_setValue(name, value)
        },
        exist (selecter) {
            return Boolean($(selecter).length >= 1)
        },
        sleep (time) {
            return new Promise(resolve => setTimeout(resolve, time))
        },
        addStyle (id, tag, css) {
            tag = tag || 'style'
            const doc = document,
                styleDom = doc.getElementById(id)
            if (styleDom) return
            const style = doc.createElement(tag)
            style.rel = 'stylesheet'
            style.id = id
            tag === 'style' ? style.innerHTML = css : style.href = css
            document.head.appendChild(style)
        }
    }
    const main = {
        initValue () {
            const value = [{
                name: 'current_screen_mod',
                value: 'normal'
            }, {
                name: 'selected_screen_mod',
                value: 'webfullscreen'
            }, {
                name: 'auto_web_full_screen',
                value: true
            }, {
                name: 'auto_select_video_highest_quality',
                value: true
            }, {
                name: 'auto_select_danmu_options',
                value: true
            }, {
                name: 'auto_block_gift_effect',
                value: true
            }]
            value.forEach(v => {
                if (util.getValue(v.name) === undefined) {
                    util.setValue(v.name, v.value)
                }
            })
        },
        playerStickyTop () {
            $('body').prepend($('header'))
            $('.layout-Player').attr('id', 'layout-Player').css({
                'width': '1400px',
                'margin': '0 auto',
                'margin-top': '80px'
            })
            $('header').after($('#layout-Player'))
        },
        fixedAside () {
            const url = $(location).attr('href')
            const room = /https:\/\/www.douyu.com\/\d+/i
            if (room.test(url)) {
                $('header').after($('#js-aside'))
                $('header').after($('#js-aside-state'))
            } else {
                return false
            }
        },
        getCurrentScreenMod () {
            const mutationObserver = new MutationObserver(() => {
                const bodyClass = $('body').attr('class') || 'normal'
                if (bodyClass.includes('is-fullScreenPage')) {
                    util.setValue('current_screen_mod', 'webfullscreen')
                } else {
                    util.setValue('current_screen_mod', 'normal')
                }
            })
            mutationObserver.observe($('body')[0], {
                attributes: true
            })
        },
        autoSelectScreenMod () {
            const selected_screen_mod = util.getValue('selected_screen_mod')
            if (selected_screen_mod) {
                const current_screen_mod = util.getValue('current_screen_mod')
                const selected_screen_mod = util.getValue('selected_screen_mod')
                const openWebFullScreenButton = $('[title=\'网页全屏\'][class*=\'wfs\']')
                if (selected_screen_mod === 'webfullscreen' && current_screen_mod !== 'webfullscreen') {
                    openWebFullScreenButton.click()
                    // console.log("screen done")
                }
            }
        },
        autoSelectVideoHightestQuality () {
            const auto_select_video_highest_quality = util.getValue('auto_select_video_highest_quality')
            const hightestQualityButton = $('[title="清晰度"] > [class*="tip"] > [class*="tipItem"] > ul > li').eq(0)
            const hightestQualityButtonClass = hightestQualityButton.attr('class') || 'normal'
            if (auto_select_video_highest_quality && !hightestQualityButtonClass.includes('selected')) {
                hightestQualityButton.click()
                // console.log("quality done")
            }
        },
        autoBlockGiftEffect () {
            const auto_block_gift_effect = util.getValue('auto_block_gift_effect')
            if (auto_block_gift_effect) {
                $('.ShieldTool-content .ShieldTool-enter .ShieldTool-list > div.ShieldTool-listItem').each(function () {
                    const checkState = $(this).attr('class')
                    if (checkState.includes('is-noChecked')) {
                        $(this).click()
                    }
                })
            }
        },
        autoSelectDanmuOptions () {
            const auto_select_danmu_options = util.getValue('auto_select_danmu_options')
            if (auto_select_danmu_options) {
                $('.noMcsettingPanel-697312 .iconBtn-70d178').each(function () {
                    const styleCont = $(this).attr('style')
                    const labelColor = $(this).children('label').attr('style')
                    const imgList = ['quarterscreen_84589b', 'bigforbid_5d2d1c', 'topforbid_f08785', 'bottomforbid_9b3f00', 'roleforbid_08998e']
                    for (let i = 0; i < imgList.length; i++) {
                        if (styleCont.includes(imgList[i]) & labelColor.includes('204')) {
                            $(this).children('label').click()
                        }
                    }
                    $('.simpleDanmu-a83422 span.icon-d798db + label.simpleLabel-c5c1e1').click()
                })
                // console.log("danmu done")
            }
            main.autoBlockGiftEffect()
        },
        registerMenuCommand () {
            GM_registerMenuCommand('设置', () => {
                const html =
          `<div style="font-size: 1em;">
            <label class="player-modify-setting-label">默认网页全屏<input type="checkbox" id="Auto-Screen-Mod" ${util.getValue('auto_web_full_screen') ? 'checked' : ''}></label>
            <label class="player-modify-setting-label">自动选择最高画质<input type="checkbox" id="Auto-Quality" ${util.getValue('auto_select_video_highest_quality') ? 'checked' : ''} class="player-modify-setting-checkbox" style="width:auto!important;"></label>
            <label class="player-modify-setting-label">自动选择弹幕配置<input type="checkbox" id="Auto-Select-Danmu-Options" ${util.getValue('auto_select_danmu_options') ? 'checked' : ''} class="player-modify-setting-checkbox" style="width:auto!important;"></label>
            <span class="player-modify-setting-tips"><span>默认为：1/4屏、弹幕屏蔽全开、开启精简弹幕。</span></span>
            <label class="player-modify-setting-label">自动屏蔽全部特效<input type="checkbox" id="Auto-Block-Gift-Effect" ${util.getValue('auto_block_gift_effect') ? 'checked' : ''} class="player-modify-setting-checkbox" style="width:auto!important;"></label>
            <span class="player-modify-setting-tips"><span>以上选择为本人习惯配置，若需更改请取消选择此项，并按自己习惯调整，斗鱼会记住。</span></span>
          </div>`
                Swal.fire({
                    title: '斗鱼直播间播放器置顶',
                    html,
                    icon: 'info',
                    showCloseButton: true,
                    confirmButtonText: '保存',
                    footer: '<div style="text-align: center;font-size: 1.25em;">此脚本需与<a href="//userstyles.world/style/240/nightmode-for-douyu-com" target="_blank"> 夜间斗鱼 </a>配合使用 - <a href="//greasyfork.org/zh-CN/scripts/399600-%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E6%92%AD%E6%94%BE%E5%99%A8%E7%BD%AE%E9%A1%B6" target="_blank">检查更新</a></div>'
                }).then(res => {
                    res.isConfirmed && location.reload(true)
                })
                $('#Auto-Select-Danmu-Options').change(e => {
                    util.setValue('auto_select_danmu_options', e.target.checked)
                    // console.log(util.getValue('auto_select_danmu_options'))
                })
                $('#Auto-Screen-Mod').change(e => {
                    util.setValue('auto_web_full_screen', e.target.checked)
                })
                $('#Auto-Quality').change(e => {
                    util.setValue('auto_select_video_highest_quality', e.target.checked)
                })
                $('#Auto-Block-Gift-Effect').change(e => {
                    util.setValue('auto_block_gift_effect', e.target.checked)
                })
            })
        },
        addPluginStyle () {
            const style = `
            .swal2-popup{width: 34em;}
            .swal2-html-container{margin: 0;padding: 10px;width: 100%;box-sizing: border-box;}
            .swal2-close{top: 5px;right: 3px;}
            .swal2-actions{margin: 7px auto 0;}
            .swal2-icon.swal2-info.swal2-icon-show{display: none !important;}
            .player-modify-container,.swal2-container { z-index: 999999999!important }
            .player-modify-popup { font-size: 14px !important }
            .player-modify-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 20px; }
            .player-modify-setting-checkbox { width: 16px;height: 16px; }
            .player-modify-setting-tips{width: 100%;display: flex;align-items: center;padding: 5px;margin-top: 5px;background: #f5f5f5;box-sizing: border-box;color: #666;border-radius: 2px;text-align: left;}
            .player-modify-setting-tips svg{margin-right: 5px}
            `
            if (document.head) {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'))
                util.addStyle('player-modify-style', 'style', style)
            }
            const headObserver = new MutationObserver(() => {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'))
                util.addStyle('player-modify-style', 'style', style)
            })
            headObserver.observe(document.head, { childList: true, subtree: true })
        },
        applySetting () {
            console.log(
                ' ' + GM.info.script.name,
                '\n',
                '脚本作者：' + GM.info.script.author,
                '\n',
                '-----------------',
                '\n',
                'current_screen_mod: ' + util.getValue('current_screen_mod'),
                '\n',
                'selected_screen_mod: ' + util.getValue('selected_screen_mod'),
                '\n',
                'auto_web_full_screen: ' + util.getValue('auto_web_full_screen'),
                '\n',
                'auto_select_video_highest_quality: ' +
        util.getValue('auto_select_video_highest_quality'),
                '\n',
                'auto_select_danmu_options: ' + util.getValue('auto_select_danmu_options'),
                '\n',
                'auto_block_gift_effect: ' + util.getValue('auto_block_gift_effect')
            )
            const applyChange = setInterval(() => {
                const auto_web_full_screen = util.getValue('auto_web_full_screen')
                const bodyClass = $('body').attr('class') || 'normal'
                const hightestQualityButtonClass = $('[class*="rate"] > [class*="tip"] > ul > li').eq(0).attr('class') || 'normal'
                if (util.exist('[title=\'网页全屏\']')) {
                    if (auto_web_full_screen) {
                        main.autoSelectDanmuOptions()
                        main.autoSelectVideoHightestQuality()
                        main.autoSelectScreenMod()
                        if (bodyClass.includes('is-fullScreenPage')) {
                            clearInterval(applyChange)
                        }
                    } else {
                        main.autoSelectDanmuOptions()
                        main.autoSelectVideoHightestQuality()
                        if (hightestQualityButtonClass.includes('selected'))
                        {clearInterval(applyChange)}
                    }
                }
            }, 500)
        },
        removeMyFollowPageFirstLiAdv (){
            const findFirstLiAdv = setInterval(() => {
                if (util.exist('.layout-Cover-list')){
                    $('.layout-Cover-item').has('.AthenaBoothPanel-wrapper').remove()
                    clearInterval(findFirstLiAdv)
                }
            }, 500)
        },
        removeSearchPageUserAdv (){
            const UserAdv = setInterval(() => {
                if (util.exist('.layout-Cover-item')){
                    $('.layout-Cover-item').has('.Search-create').remove()
                    clearInterval(UserAdv)
                }
            }, 500)
        },
        isTopWindow () {
            return window.self === window.top
        },
        init () {
            const url = $(location).attr('href')
            if (url.includes('myFollow')){
                this.removeMyFollowPageFirstLiAdv()
            } else if (url.includes('search/?kw=')){
                this.removeSearchPageUserAdv()
            } else {
                this.initValue()
                this.addPluginStyle()
                this.playerStickyTop()
                this.fixedAside()
                this.getCurrentScreenMod()
                this.applySetting()
                this.registerMenuCommand()
            }
        }
    }
    main.init()
})
