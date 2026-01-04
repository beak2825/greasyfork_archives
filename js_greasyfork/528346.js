// ==UserScript==
// @name         FF14-JP官网优化(自用版)
// @namespace    https://greasyfork.org/zh-CN/scripts/528346
// @version      2.0.12
// @description  修改官网
// @author       monat151
// @license      MIT
// @match        https://jp.finalfantasyxiv.com/lodestone/*
// @match        https://jp.finalfantasyxiv.com/blog/*
// @match        https://jp.finalfantasyxiv.com/jobguide/*
// @match        https://jp.finalfantasyxiv.com/crafting_gathering_guide/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=finalfantasyxiv.com
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/528346/FF14-JP%E5%AE%98%E7%BD%91%E4%BC%98%E5%8C%96%28%E8%87%AA%E7%94%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528346/FF14-JP%E5%AE%98%E7%BD%91%E4%BC%98%E5%8C%96%28%E8%87%AA%E7%94%A8%E7%89%88%29.meta.js
// ==/UserScript==

// 在这里查看介绍：https://docs.qq.com/doc/DUmtUYk5LcFZNZG9H

(function() {
    'use strict';
    let module

    // 动态引入jQuery
    module = '[FF14-JP.LoadJQuery]'
    const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
    const $ = page.$;
    modify()

    function modify() {
        const page_url = document.location.href

        // 修改字体
        module = '[FF14-JP.ChangePageFont]'
        const pageUiTargets = ['html.ja', 'body.ja', '.jp .blog', '.jobguide.jp', '.crafting_gathering_guide.jp']
        myForEach(pageUiTargets, target => {
            $(target).css('cssText', 'font-family: "Book Antiqua", "思源宋体 CN Light","Microsoft YaHei" !important;')
        })
        const pageTitleL3Targets = ['h3']
        myForEach(pageTitleL3Targets, target => {
            $(target).css('cssText', 'font-family: "Book Antiqua", "思源宋体 CN Regular" !important;')
        })
        const pageTitleL2Targets = ['h2', 'dl.minor_patch>dt>a']
        myForEach(pageTitleL2Targets, target => {
            $(target).css('cssText', 'font-family: "Book Antiqua", "思源宋体 CN SemiBold" !important;')
        })
        const pageTitleL1Targets = ['h1', '.major_patch__site']
        myForEach(pageTitleL1Targets, target => {
            $(target).css('cssText', 'font-family: "Book Antiqua", "思源宋体 CN Heavy" !important;')
        })

        // 增加编辑按钮
        module = '[FF14-JP.AppendEditBtn]'
        let editAppendTar = $('.brand__logo:first'), btnStyle = 'padding: 2px 0 0 5px;', color = '#bddbff'
        try {
            const btnClass = 'monat-edit-btn'
            editAppendTar.append(`<a class="${btnClass}" href="javascript:void(0)" style="${btnStyle}">[进入编辑模式]</a>`)
            $('.'+btnClass).click(function(e) {
                const btn = $('.'+btnClass)
                if (!window.monatEditBtnStatus) {
                    btn.text('[退出编辑模式]')
                    document.body.contentEditable = true
                    window.monatEditBtnStatus = 'editing'
                } else {
                    btn.text('[进入编辑模式]')
                    document.body.contentEditable = 'inherit'
                    window.monatEditBtnStatus = null
                }
            })
            $('.'+btnClass).css('color', color)
        } catch(e) {
            myConsoleError('Append failed due to\n', e)
        }

        // 增加复制按钮
        module = '[FF14-JP.AppendCopyBtn]'
        let copyAppendTar = $('.brand__logo:first')
        try {
            const btnClass = 'monat-copy-btn'
            editAppendTar.append(`<a class="${btnClass}" href="javascript:void(0)" style="${btnStyle}">[复制到NGA]</a>`)
            $('.'+btnClass).click(function(e) {
                const h1Selector = 'h3.mdl-title__ancher'
                const h2Selector = 'div.mdl-title__category'
                const h3Selector = 'h3.mdl-title__heading--lg'

                const titleImg = $('img.mdl-img__visual')?.[0]?.src ?? '未找到标题图'

                let bbscode = `[color=red][b][size=150%]以下内容仅适用于国际服，不一定适用于国服。
国服具体内容请以国服官方更新笔记为准。[/size][/b][/color]

本贴内容为个人翻译。
原文地址：[url=???]日文版[/url] | [url=???]英文版[/url]
[color=teal][b]本贴仍在施工中，可能出现各种问题。[/b][/color]

[img]${titleImg}[/img]

${$('p.mdl-text__sm-m16')[0]?.innerText ?? ''}

`

                // 在开始遍历之前先帮傻逼日本人把官网元素结构修正一下
                let fixedCount = 0
                $('div.mdl-table-m16').each(function() {
                    const $tableDiv = $(this)
                    const $children = $tableDiv.children()
                    if ($children.length > 1) {
                        const $firstChild = $children.first()
                        const $remainingChildren = $children.slice(1)
                        let $lastInserted = $tableDiv
                        $remainingChildren.each(function() {
                            $(this).insertAfter($lastInserted)
                            $lastInserted = $(this)
                        })
                        fixedCount++
                    }
                })
                myConsole('修正了' + fixedCount + '个元素结构。')

                $(h1Selector).each((h1Index, h1Title) => {
                    const h1 = $(h1Title)
                    const h1TitleText = h1.find('span.hide').text().trim() || '未知1级标题'

                    const ignoreTitles = ['问题修复','已知问题','追加物品','追加配方']
                    if (ignoreTitles.includes(h1TitleText)) {
                        return
                    }

                    bbscode += `[b][size=150%]${h1TitleText}[/size][/b][h][/h]`
                    bbscode += '\n[quote]'

                    const nextH1 = h1.nextAll(h1Selector).first()
                    const elements = nextH1.length ? h1.nextUntil(nextH1) : h1.nextAll()
                    elements.each((eleIndex, ele) => {
                        bbscode += convertElementToBBSCode(ele)
                    })

                    bbscode += '[/quote]\n\n'
                })

                bbscode = bbscode.replaceAll('「', '“').replaceAll('」', '”').replaceAll('『', '').replaceAll('』', '').replaceAll('・', '·').replaceAll('※', '* ')

                GM_setClipboard(bbscode)
                alert('复制成功')

                function convertElementToBBSCode(element, type = 'none') {
                    const $element = $(element)
                    if (element.className.includes('mdl-title__category')) {
                        // h2
                        const h2TitleText = $element.find('h2')[0]?.innerText ?? '未知2级标题'
                        return `\n[b][size=125%]${h2TitleText}[/size][/b]\n`
                    } else if (element.className.includes('mdl-title__heading--lg')) {
                        // h3
                        const h3TitleText = element.innerText
                        return `\n[color=green][size=110%]${h3TitleText}[/size][/color][h][/h]\n`
                    } else if (element.className.includes('mdl-title__heading--sm')) {
                        // h4
                        const h4TitleText = element.innerText.replace('≪', '《').replace('≫', '》')
                        if (element.className.includes('mdl-color__orange')) {
                            return `[b][color=orangered]${h4TitleText}[/color][/b]\n`
                        } else if (element.className.includes('mdl-color__green')) {
                            return `[b][color=seagreen]${h4TitleText}[/color][/b]\n`
                        } else {
                            return `[b]${h4TitleText}[/b]\n`
                        }
                    } else if (element.className.includes('mdl-conf__cap')) {
                        // h4 特殊版
                        const h4TitleText = element.innerText.replace('≪', '《').replace('≫', '》')
                        return `[b][color=orangered]${h4TitleText}[/color][/b]\n`
                    } else if (
                        element.className.includes('mdl-title__heading__gc--maelstrom')
                        || element.className.includes('mdl-title__heading__gc--twinadder')
                        || element.className.includes('mdl-title__heading__gc--immortal')
                    ) {
                        // h4 特殊版
                        const h4TitleText = element.innerText
                        const desc = $element.find('span').text()
                        return `[b]${h4TitleText}[/b] ${desc}\n`
                    } else if (element.className.includes('mdl-img__normal-m16')) {
                        // 普通图片
                        const imgSrc = $element.find('img')[0]?.src ?? ''
                        return `[img]${imgSrc}[/img]\n`
                    } else if (element.className.includes('twentytwenty-wrapper')) {
                        // 对比图片
                        const imgBeforeSrc = $element.find('img.twentytwenty-before')[0]?.src ?? ''
                        const imgAfterSrc = $element.find('img.twentytwenty-after')[0]?.src ?? ''
                        return `[img]${imgBeforeSrc}[/img]\n[img]${imgAfterSrc}[/img]\n`
                    } else if (
                        element.className.includes('mdl-quest-main')
                        || element.className.includes('mdl-quest')
                    ) {
                        // 任务卡
                        const questName = $element.find('h4')[0]?.innerText ?? '未知任务'
                        const questLevel = $element.find('dt.mdl-quest__level')[0]?.innerText ?? '未知等级'
                        const questPlace = $element.find('dt.mdl-quest__place')[0]?.innerText ?? '未知地点'
                        const questNpc = $element.find('dt.mdl-quest__npc')[0]?.innerText ?? '未知NPC'
                        const questTerms = $element.find('dt.mdl-quest__terms')[0]?.innerText ?? ''
                        return `[table][tr]
[td width=30 rowspan=4]${questName}[/td]
[td][align=left][img]./mon_202503/12/-omp5kQ2v-1k2oK0Sc-c.png[/img] ${questLevel}[/align][/td][/tr]
[tr]
[td][align=left][img]./mon_202503/12/-omp5kQ2v-j4s0K0Sc-c.png[/img] ${questPlace}[/align][/td][/tr]
[tr]
[td][align=left][img]./mon_202503/12/-omp5kQ2v-a280K0Sc-c.png[/img] ${questNpc}[/align][/td][/tr]
[tr]
[td][align=left][img]./mon_202503/12/-omp5kQ2v-ebrjK0Sc-c.png[/img] ${questTerms}[/align][/td][/tr][/table]\n`
                    } else if (element.className.includes('mdl-menu')) {
                        // 列表 dt/dd型
                        let bbscode = '[list]'
                        $element.children().each((eleIndex, ele) => {
                            const content = dealTextNode(ele)
                            if (ele.tagName.toLowerCase() === 'dt') {
                                bbscode += '[*][b]' + content.trimEnd('\n') + '[/b]\n'
                            }
                            else if (ele.tagName.toLowerCase() === 'dd') {
                                bbscode += content + '\n'
                            }
                        })
                        bbscode += '[/list]'
                        return bbscode + '\n'
                    } else if (
                        element.className.includes('mdl-list__cat-12')
                        || element.className.includes('mdl-list__basic')
                        || type === 'list'
                    ) {
                        // 列表 ul/li型
                        let _bbscode = '[list]'
                        $element.children().each((eleIndex, ele) => {
                            if (ele.tagName.toLowerCase() === 'ul') {
                                _bbscode += convertElementToBBSCode(ele, 'list')
                            } else if (ele.tagName.toLowerCase() === 'li') {
                                const content = ele.children[0]?.tagName?.toLowerCase() === 'li' ? convertElementToBBSCode(ele, 'list') : dealTextNode(ele)
                                _bbscode += '[*]' + content
                            } else {
                                _bbscode += dealTextNode(ele)
                            }
                        })
                        _bbscode += '[/list]'
                        return _bbscode + '\n'
                    } else if (element.className.includes('mdl-text__indent--28')) {
                        // 表格容器
                        let _bbscode = ''
                        $element.children().each((eleIndex, ele) => {
                            if (ele.className.includes('mdl-table-m16') || ele.tagName.toLowerCase() === 'table') {
                                _bbscode += convertElementToBBSCode(ele)
                            } else {
                                myConsoleWarn('未预料到的表格容器\n', ele)
                            }
                        })
                        return _bbscode + '\n'
                    } else if (
                        element.className.includes('mdl-table-m16')
                        || element.tagName.toLowerCase() === 'table'
                    ) {
                        // 表格
                        let $target = $element
                        if ($element.children().length > 1) {
                            // 有些更新笔记会把下半部分正文塞 div.mdl-table-m16 里面，妈的傻逼日本人
                            $target = $($element.children().first())
                        }
                        let _bbscode = '[table]'
                        $target.find('tr').each((trIndex, tr) => {
                            _bbscode += '[tr]\n'
                            const $tr = $(tr)
                            $tr.find('th').each((thIndex, th) => {
                                if (th.className.includes('mdl-table__layout--spacer')) {
                                    return // 跳过空白列
                                }
                                const thWidthMap = {
                                    '变更前': 50,
                                }
                                const content = dealTextNode(th).trimEnd('\n')
                                if (!content) return
                                if (thIndex === 0) {
                                    const width = thWidthMap[content] || 30
                                    _bbscode += `[td width=${width}]`
                                } else {
                                    _bbscode += '[td]'
                                }
                                _bbscode += '[align=center][b]' + dealTextNode(th) + '[/b][/align][/td]\n'
                            })
                            $tr.find('td').each((tdIndex, td) => {
                                if (td.className.includes('mdl-table__icon--arrow')) {
                                    return // 跳过箭头列
                                }
                                const content = dealTextNode(td).trimEnd('\n')
                                if (!content) return
                                _bbscode += '[td][align=center]' + dealTextNode(td) + '[/align][/td]\n'
                            })
                            _bbscode += '[/tr]\n'
                        })
                        return _bbscode + '[/table]\n'
                    } else if (element.className.includes('mdl-color__notes-m16')) {
                        // 深红文本元素
                        return `[color=darkred]${dealTextNode(element)}[/color]\n`
                    } else if (
                        element.className.includes('mdl-text__sm-m16')
                        || element.className.includes('mdl-conf__indent')
                    ) {
                        // 普通文本元素
                        return dealTextNode(element)
                    } else if (
                        element.className.includes('mdl-patch__heading') // 版本标识 (2.x, 7.x 等)
                    ) {
                        return '' // 忽略
                    } else {
                        if (element.innerText) {
                            myConsoleWarn('未处理的元素：\n', element)
                        }
                        return ''
                    }
                }
                function dealTextNode(node) {
                    const $node = $(node)
                    return $node.contents().map(function() {
                        if (this.nodeType === 1) {
                            const tag = this.tagName.toLowerCase()
                            if (tag === 'span' && this.className.includes('mdl-color__notes')) {
                                const text = dealTextNode(this).trim()
                                return `[color=darkred]${text}[/color]`
                            } else if (tag === 'br') {
                                return '\n'
                            } else if (tag === 'a') {
                                return `[url=${this.href}]${this.innerText}[/url]`
                            } else if (tag === 'b') {
                                return `[b]${this.innerText}[/b]`
                            } else if (tag === 'img') {
                                return `[img]${this.src}[/img]`
                            }
                        }
                        return this.nodeValue || ''
                    }).get().join('').trim() + '\n'
                }
            })
            $('.'+btnClass).css('color', color)
        } catch(e) {
            myConsoleError('Append failed due to\n', e)
        }
    }

    // 通用工具函数
    function cHref() { return ['%c ' + module,'color:blue;'] }
    function myConsole(...array) { console.log(...cHref(), ...array) }
    function myConsoleWarn(...array) { console.warn(...cHref(), ...array) }
    function myConsoleError(...array) { console.error(...cHref(), ...array) }
    function myForEach(array,cb){if(!array||!array.length||!cb){return}for(let i=0;i<array.length;i++){cb(array[i])}}
})();