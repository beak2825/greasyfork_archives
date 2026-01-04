// ==UserScript==
// @name         QuickPatrol_v2
// @namespace    qp_tool_v2
// @version      2.40
// @description  MediaWiki巡查工具 | A patrol tool for MediaWiki
// @author       teaSummer
// @source       https://github.com/teaSummer/QuickPatrol_v2
// @match        *://*/wiki/*
// @match        *://*/w/*
// @match        *://*/index.php?*
// @match        *://*.wiki/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHBhdGggZD0iTTU2IDdjLTEuNDgyIDQuMTktMy41ODggNy41NjctNi4wNjMgMTEuMjVDNDEuNzEgMzAuNzk2IDM1LjIxOCA0My45NDYgMzAgNThjLTIuODIzLjIxLTUuMjI0LjM4NC04IDAtMi4wNjYtMS45MDYtMi4wNjYtMS45MDYtMy41NjMtNC41LTIuNzA3LTQuMzk4LTUuNi04LjA2OS05LjE1Mi0xMS44MDlDOCA0MCA4IDQwIDggMzdjMi45MDEtMS40NSA0Ljc4NS0xLjQwOCA4LTEgMi40ODQgMi4zNzEgMi40ODQgMi4zNzEgNC43NSA1LjQzOEMyMy4zODQgNDUuMjk0IDIzLjM4NCA0NS4yOTQgMjcgNDhsLjI4MS0xLjk3N2MuOTU3LTQuMDIyIDIuNTM3LTcuNjMgNC4yMTktMTEuMzk4bDEuMDYzLTIuMzgzYTE2NC41NjYgMTY0LjU2NiAwIDAgMSA4LjE4Ny0xNS42OGwxLjEwNC0xLjg3OEM0NS44MTkgOC4yMTUgNDguMzkyIDYuNTYxIDU2IDd6IiBmaWxsPSJncmVlbiIvPjxwYXRoIGQ9Ik01NSAxNmwzIDF2NGg0djJoLTRsLTEgNWgtMnYtNWgtNXYtMmg1di01eiIgZmlsbD0iI0YxRkYwRSIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/516498/QuickPatrol_v2.user.js
// @updateURL https://update.greasyfork.org/scripts/516498/QuickPatrol_v2.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 本地化 | Localization
    const w = {
        'en': {
            un: 'This edit has not yet been patrolled',
            ing: 'Quick patrolling...',
            done: 'Quick patrolled',
            t_un: 'Unpatrolled',
            g_un: 'Unpatrolled',
            hl: 'Highlighted: ',
            s: 'Additional summary',
            h_1: 'Apply',
            h_2: '[[Special:AbuseLog/$1|AbuseLog/$1]] by [[Special:Contribs/$2|$2]] ([[User talk:$2|talk]]), ',
            h_3: 'the original summary is "$1"',
            h_4: 'no original summary',
            g_cr_1: 'Sure to rollback this edit?',
            g_er_1: 'Revert edits by [[Special:Contribs/$1|$1]] ([[User talk:$1|talk]])',
            g_er_2: 'Edit rollback summary',
            c: ': ',
            n_1: 'Applied',
            n_2: 'Failed to apply',
            n_3: '⚙️ Settings',
            n_4: 'Patrol all logs (in emergency)',
            p_1: 'Failed to patrol',
            p_2: 'Arguments',
            p_3: 'Cancel',
            r_summary: 'Summary',
            r_confirm: 'Confirm',
            r_default: 'Default',
            qp_patrol: 'Quick Patrol',
            qp_rollback: 'Quick Rollback',
            qp_rollback_mode: 'Rollback Mode',
            qp_abuse_edit: 'Helper that Filtered Edits',
            qp_jump_blank: 'Links Open in New Tabs',
            qp_max_retries: 'Maximum Retries of Initialization',
            qp_local_summary: 'Localization Maps English Summary',
            map: ['unnecessary edit', 'unnecessary( information| content)?|#UN#|#U#',
                'false content', 'false( information)?|#F#',
                'outdated content', 'outdated?( information)?|#OUT#|#OD#|#O#',
                'redundant content', 'redundant( information)?|#RD#|#R#',
                'non-consensus', '#NC#|#N#',
                'machine translation', 'machine-trans|#MT#|#M#',
                'duplicated content', 'duplicated?( information)?|#DUP#|#DP#|#D#',
                'unsourced', '#CITE#|#US#',
                'unambiguous content', 'unambig(uous)?|#NAM#|#NA#',
                'ambiguous content', 'ambig(uous)?|#AM#|#A#',
                'WAI for content', '(sic|WAI)( content|-C)|#SIC#|#SC#|#S#',
                'Works As Intended', '#WAI#|WAI|#W#',
                'Cannot Reproduce', '#CR#|#C#',
                'N-ST', 'delete without reason']
        },
        'zh-hans': {
            un: '该编辑尚未巡查',
            ing: '快速巡查中…',
            done: '已快速巡查',
            t_un: '未巡查',
            g_un: '尚未巡查',
            hl: '已高亮：',
            s: '附加摘要',
            h_1: '应用',
            h_2: '[[Special:AbuseLog/$1|滥用日志/$1]] — [[Special:Contribs/$2|$2]]（[[User talk:$2|留言]]），',
            h_3: '原始摘要为“$1”',
            h_4: '没有原始摘要',
            g_cr_1: '确定要回退此编辑吗？',
            g_er_1: '回退[[Special:Contribs/$1|$1]]（[[User talk:$1|留言]]）所做的编辑',
            g_er_2: '编辑回退摘要',
            c: '：',
            n_1: '应用完成',
            n_2: '应用失败',
            n_3: '⚙️ 设置',
            n_4: '巡查所有日志（紧急时）',
            p_1: '巡查失败',
            p_2: '参数',
            p_3: '取消',
            r_summary: '摘要',
            r_confirm: '确定',
            r_default: '默认',
            qp_patrol: '快速巡查',
            qp_rollback: '快速回退',
            qp_rollback_mode: '回退模式',
            qp_abuse_edit: '过滤内容编辑助手',
            qp_jump_blank: '在新标签页打开链接',
            qp_max_retries: '初始化最大重试次数',
            qp_local_summary: '本地化映射英语摘要',
            map: ['不必要的编辑', '不必要的编辑', //
                '含不实内容', '含不实内容', //
                '含过时内容', '含过时内容', //
                '包含无用的冗余内容', '包含无用的冗余内容', //
                '不符合现有共识', '不符合现有共识', //
                '疑似使用机器翻译', '疑似使用机器翻译', //
                '重复内容', '重复内容', //
                '来源不明', '来源不明', //
                '内容无歧义', '内容无歧义', //
                '内容含有歧义', '内容含有歧义', //
                '原文无误', '原文无误', //
                '有意为之', '有意为之', //
                '无法复现', '无法复现', //
                '含非标准译名的编辑', '无故删除']
        },
        'zh-hant': {
            un: '該編輯尚未巡查',
            ing: '快速巡查中…',
            done: '已快速巡查',
            t_un: '未巡查',
            g_un: '尚未巡查',
            hl: '已明顯標示：',
            s: '附加摘要',
            h_1: '應用',
            h_2: '[[Special:AbuseLog/$1|濫用日誌/$1]] — [[Special:Contribs/$2|$2]]（[[User talk:$2|留言]]），',
            h_3: '原始摘要為「$1」',
            h_4: '沒有原始摘要',
            g_cr_1: '確定要回退此編輯嗎？',
            g_er_1: '回退[[Special:Contribs/$1|$1]]（[[User talk:$1|留言]]）所做的編輯',
            g_er_2: '編輯回退摘要',
            c: '：',
            n_1: '應用完成',
            n_2: '應用失敗',
            n_3: '⚙️ 設定',
            n_4: '巡查所有日誌（緊急時）',
            p_1: '巡查失敗',
            p_2: '引數',
            p_3: '取消',
            r_summary: '摘要',
            r_confirm: '確定',
            r_default: '預設',
            qp_patrol: '快速巡查',
            qp_rollback: '快速回退',
            qp_rollback_mode: '回退模式',
            qp_abuse_edit: '過濾內容編輯助手',
            qp_jump_blank: '在新標籤頁開啟連結',
            qp_max_retries: '初始化最大重試次數',
            qp_local_summary: '本地化對映英語摘要',
            map: ['不必要的編輯', '不必要的編輯', //
                '含不實內容', '含不實內容', //
                '含過時內容', '含過時內容', //
                '包含無用的冗餘內容', '包含無用的冗餘內容', //
                '不符合現有共識', '不符合現有共識', //
                '疑似使用機器翻譯', '疑似使用機器翻譯', //
                '重複內容', '重複內容', //
                '來源不明', '來源不明', //
                '內容無歧義', '內容無歧義', //
                '內容含有歧義', '內容含有歧義', //
                '原文無誤', '原文無誤', //
                '有意為之', '有意為之', //
                '無法復現', '無法復現', //
                '含非標準譯名的編輯', '無故刪除']
        }
    };

    // ES2017 -> ES2015
    function asyncGeneratorStep(ag_n, ag_t, ag_e, ag_r, ag_o, ag_a, ag_c) { let ag_i, ag_u; try { ag_i = ag_n[ag_a](ag_c); ag_u = ag_i.value; } catch (n) { return void ag_e(n); } return ag_i.done ? ag_t(ag_u) : Promise.resolve(ag_u).then(ag_r, ag_o); }
    function _asyncToGenerator(ag_n) { return function () { let ag_t = this, ag_e = arguments, ag_a; return new Promise(function (r, o) { ag_a = ag_n.apply(ag_t, ag_e); function _next(n) { asyncGeneratorStep(ag_a, r, o, _next, _throw, 'next', n); } function _throw(n) { asyncGeneratorStep(ag_a, r, o, _next, _throw, 'throw', n); } _next(void 0); }); }; }

    const $E = (e, f = void 0, r = void 0) => {
        if ($(e).length) return typeof f == 'function' ? f($(e)) : $(e);
        return typeof f == 'function' ? r : f;
    };
    const status = {};
    let mwApi, mwLang, rights, l, fail = 0, load = false;
    status.np = '.mw-changeslist-reviewstatus-unpatrolled:not(.mw-rcfilters-ui-highlights-enhanced-toplevel):not(.quickpatrol), .revisionpatrol-unpatrolled';
    status.load = _asyncToGenerator(function* (prefix, with_script) {
        for (let s of with_script ? ['.css', '.js'] : ['.css']) yield mw.loader.load(`https://fastly.jsdelivr.net/${prefix}${s}`, s == '.css' ? 'text/css' : void 0);
    });

    function helper() {
        if (!$E('.mw-abuselog-details')) return;
        const g = (e) => $E(`.mw-abuselog-details-${e} div.mw-abuselog-var-value`, (e) => e.text().replace(/^'|'$/g, ''));
        const v = {
            user_name: g('user_name'),
            action: g('action'),
            summary: g('summary'),
            new_wikitext: g('new_wikitext'),
            page_prefixedtitle: g('page_prefixedtitle'),
            logid: location.href.replace(/\/+$/, '').split('/').slice(-1)[0].replace(/[^0-9]/g, '')
        };

        if (v.action != 'edit') return;
        let o_summary = l.h_2.replace(/\$1/g, v.logid).replace(/\$2/g, v.user_name);
        $('#mw-content-text p').after(`<button class="quickpatrol-abuseedit cdx-button mw-ui-button">${l.h_1}</button>`);
        o_summary = o_summary + (v.summary ? l.h_3.replace('$1', v.summary) : l.h_4);
        if (v.summary.trim()) {
            $('.quickpatrol-abuseedit').after(`<div class="quickpatrol-abuseedit-summary"/>`);
            $('.quickpatrol-abuseedit-summary').text(v.summary);
        }
        $E('.diff-type-table', $('.quickpatrol-abuseedit-summary')).after('<textarea class="new_wikitext" cols="80" rows="25"/>');
        $('.new_wikitext').val(v.new_wikitext).before('<input class="page_prefixedtitle"/>');
        if (mw.addWikiEditor) mw.addWikiEditor($('.new_wikitext'));
        $('.page_prefixedtitle').val(v.page_prefixedtitle).attr('placeholder', v.page_prefixedtitle);
        $('.mw-abuselog-details').wrap(`<details/>`);
        $('.quickpatrol-abuseedit').click(function () {
            const me = $(this);
            const rb = (r) => {
                const title = $E('.page_prefixedtitle', (e) => e.val() ? e.val() : v.page_prefixedtitle, v.page_prefixedtitle);
                const summary = r ? o_summary + l.c + r : o_summary;
                const text = $E('.new_wikitext', (e) => e.val(), v.new_wikitext);
                const notice = summary.replace(/\[\[[^|[\]]*\|(.*?)]]/g, '$1');
                const popup = Swal.mixin({
                    showConfirmButton: false,
                    timerProgressBar: true
                });
                let action;
                me.attr('disabled', true);
                $(window).on('beforeunload', () => me.attr('disabled'));
                mwApi.post({
                    action: 'query',
                    prop: 'revisions|info',
                    titles: title
                }).done((data) => {
                    const p = data.query.pages;
                    const now = !p.length || p['-1'] ? new Date().toISOString() : null;
                    mwApi.postWithToken('csrf', {
                        action: 'edit',
                        starttimestamp: now || p[0].touched,
                        basetimestamp: now || Object.values(p[0].revisions)[0].timestamp,
                        text: text,
                        title: title,
                        summary: summary
                    }).done(() => {
                        me.removeAttr('disabled').remove();
                        popup.fire({
                            toast: true,
                            position: 'top-end',
                            title: l.n_1,
                            text: notice,
                            icon: 'success',
                            timer: 5000
                        });
                    }).fail((msg, log) => {
                        me.removeAttr('disabled');
                        mwApi.post({
                            action: 'parse',
                            page: `MediaWiki:${msg}`,
                            prop: 'text'
                        }).done((data) => popup.fire({
                            title: l.n_2,
                            html: data.parse.text['*'].replace(/\$1/g, log.error.abusefilter.description),
                            icon: 'error',
                            customClass: 'quickpatrol-output',
                            backdrop: '#0002',
                            showConfirmButton: true,
                            confirmButtonText: l.r_confirm
                        }));
                    });
                }).fail((err) => {
                    me.removeAttr('disabled');
                    popup.fire({
                        toast: true,
                        position: 'top-end',
                        title: l.n_2,
                        text: err.exception || notice,
                        icon: 'error',
                        timer: 5000
                    });
                });
            };
            dialog('prompt', l.s, rb);
        });
    }

    function g_cr() {
        for (let me of $('.mw-rollback-link a:not(.quickpatrol-rollback)')) {
            const href = $(me).attr('href');
            $(me).click((event) => {
                event.preventDefault();
                $(me).addClass('quickpatrol-click');
                dialog('confirm', l.g_cr_1, () => (location.href = href));
            });
            status.genRollback(me);
        }
    }

    function g_er(p) {
        let el = '.mw-rollback-link a';
        if (p) {
            if (p == 2) g_cr();
            for (let e of $(el)) {
                $(e).after(`<span class="edit-rollback" href="${$(e).attr('href')}" title="${l.g_er_2}"></span>`);
                status.genRollback(e);
            }
            el = '.edit-rollback';
        }
        el = `${el}:not(.quickpatrol-rollback)`;
        for (let me of $(el)) {
            const href = $(me).attr('href');
            $(me).click((event) => {
                event.preventDefault();
                $(me).addClass('quickpatrol-click');
                const rb = (r) => {
                    if (GM_getValue('qp_local_summary')) {
                        Object.entries(w).forEach(([k, v]) => {
                            for (let i = 0; i < v.map.length; i++) r = r.replace(new RegExp(v.map[i], 'gi'), l.map[i]);
                        });
                    }
                    location.href = href + '&summary=' + encodeURIComponent(r ? summary + l.c + r : summary);
                };
                const name = decodeURIComponent(href.match(/&from=(.+)&token/)[1].replace(/\+/g, ' '));
                const summary = mw.format(l.g_er_1, name);
                dialog('prompt', l.s, rb);
            });
            status.genRollback(me);
        }
    }

    function rollback_util() {
        if (GM_getValue('qp_rollback_mode') == 'd' || !load) return;
        load[0](load[1]);
    }

    function dialog(type, msg, f) {
        Swal.fire(Object.assign({
            width: '24em',
            text: msg,
            draggable: true,
            backdrop: '#0002',
            reverseButtons: true,
            showConfirmButton: true,
            confirmButtonText: l.r_confirm,
            showCancelButton: true,
            cancelButtonText: l.p_3,
        }, type == 'prompt' ? { input: 'text' } : {})).then((data) => {
            $('.quickpatrol-click').removeClass('quickpatrol-click');
            if (data.isConfirmed) f(data.value);
        });
    }

    function init() {
        const DEFAULTS = {
            qp_patrol: true,
            qp_rollback: true,
            qp_rollback_mode: 's',
            qp_abuse_edit: true,
            qp_jump_blank: false,
            qp_max_retries: 10,
            qp_local_summary: false
        };
        Object.entries(DEFAULTS).forEach(([k, v]) => {
            if (GM_getValue(k) === void 0) GM_setValue(k, v);
        });
        if (fail >= GM_getValue('qp_max_retries')) return;
        _asyncToGenerator(function* () {
            try {
                mwApi = yield new mw.Api();
                mwLang = Object.keys(yield mw.language.data)[0];
                if (['zh-cn', 'zh-hans', 'zh-hans-cn', 'zh'].includes(mwLang)) mwLang = 'zh-hans';
                else if (mwLang.startsWith('zh-')) mwLang = 'zh-hant';
                if (!Object.keys(w).includes(mwLang)) mwLang = 'en';
                l = w[mwLang];

                if (load) return;
                load = true;
                GM_registerMenuCommand(l.n_3, () => {
                    Swal.fire({
                        title: l.n_3,
                        html: `<div class="quickpatrol-setting">
                             <label>${l.qp_patrol}<input type="checkbox" id="quickpatrol-option-patrol" ${GM_getValue('qp_patrol') ? 'checked' : ''}></label>
                             <label>${l.qp_rollback}<input type="checkbox" id="quickpatrol-option-rollback" ${GM_getValue('qp_rollback') ? 'checked' : ''}></label>
                             <label>${l.qp_rollback_mode}<select id="quickpatrol-option-rollback-mode">
                             <option value="s" ${GM_getValue('qp_rollback_mode') == 's' ? 'selected' : ''}>${l.r_summary}</option>
                             <option value="c" ${GM_getValue('qp_rollback_mode') == 'c' ? 'selected' : ''}>${l.r_confirm}</option>
                             <option value="d" ${GM_getValue('qp_rollback_mode') == 'd' ? 'selected' : ''}>${l.r_default}</option>
                             <option value="c+s" ${GM_getValue('qp_rollback_mode') == 'c+s' ? 'selected' : ''}>${l.r_confirm}+${l.r_summary}</option>
                             <option value="d+s" ${GM_getValue('qp_rollback_mode') == 'd+s' ? 'selected' : ''}>${l.r_default}+${l.r_summary}</option>
                             </select></label>
                             <label>${l.qp_abuse_edit}<input type="checkbox" id="quickpatrol-option-abuse-edit" ${GM_getValue('qp_abuse_edit') ? 'checked' : ''}></label>
                             <label>${l.qp_jump_blank}<input type="checkbox" id="quickpatrol-option-jump-blank" ${GM_getValue('qp_jump_blank') ? 'checked' : ''}></label>
                             <label>${l.qp_max_retries}<input type="range" min="1" max="20" id="quickpatrol-option-max-retries" value="${GM_getValue('qp_max_retries')}"><span>${GM_getValue('qp_max_retries')}</span></label>
                             <label>${l.qp_local_summary}<input type="checkbox" id="quickpatrol-option-local-summary" ${GM_getValue('qp_local_summary') ? 'checked' : ''}></label>
                        </div>`,
                        backdrop: '#0002',
                        reverseButtons: true,
                        showConfirmButton: true,
                        confirmButtonText: l.r_confirm,
                        showCancelButton: true,
                        cancelButtonText: l.p_3,
                    }).then((res) => {
                        if (!res.isConfirmed) return;
                        Object.entries(DEFAULTS).forEach(([k, v]) => {
                            const e = $('#quickpatrol-option-' + k.slice(3).replace(/_/g, '-'));
                            GM_setValue(k, typeof v == 'boolean' ? e.is(':checked') : e.val());
                        });
                        location.reload();
                    });
                    $('#quickpatrol-option-max-retries').on('input', function () {
                        $(this).find('+span').text($(this).val());
                    });
                    $('#quickpatrol-option-rollback').change(function () {
                        $('#quickpatrol-option-rollback-mode').attr('disabled', !$(this).is(':checked'));
                    });
                });
                $E('.mw-changeslist', () => GM_registerMenuCommand(l.n_4, () => dialog('confirm', l.n_4, () => $('[data-mw-logid] .unpatrolled').trigger('click'))));
                const oe = ['.mw-changeslist', '#mw-diff-ntitle1 strong', '#mw-diff-otitle1 strong', '.mw-contributions-list li:nth-child(20)', '.mw-contributions-list li:last-child'];
                const ob_IPE = new MutationObserver(with_IPE);
                const ob = new MutationObserver((ml) => {
                    ml.forEach((m) => {
                        const t = $(m.target);
                        if (t.attr('class').includes('revisionpatrol-') || t.hasClass('mw-changeslist')) return main();
                        $E(m.addedNodes, (e) => {
                            if (e.hasClass('quick-diff')) {
                                ob_IPE.observe(e.find('.ipe-progress')[0], { attributes: true });
                            }
                            if (e.hasClass('ipe-modal-modal')) {
                                // InPageEdit NEXT
                                ob_IPE.observe(e.find('.ipe-modal-modal__title')[0], { childList: true });
                            }
                        });
                    });
                });
                ob.observe(document.body, { childList: true });
                for (let x of oe) $E(x, (e) => ob.observe(e[0], { childList: true, attributes: true }));
                status.load('gh/teaSummer/QuickPatrol_v2@main/styles');
                status.load('npm/sweetalert2/dist/sweetalert2.min', true);
                status.load(`gh/teaSummer/QuickPatrol_v2@minecraft-wiki/patrol/${mwLang}/Gadget-revisionPatrol`, true);
                load = ((m) => m == 's' ? [g_er] : m == 'c' ? [g_cr] : m == 'd+s' ? [g_er, 1] : m == 'c+s' ? [g_er, 2] : null)(GM_getValue('qp_rollback_mode'));
                if (load.length == 2) status.load(`gh/teaSummer/QuickPatrol_v2@minecraft-wiki/rollback/${mwLang}/Gadget-editableRollback`);
            } catch (e) {
                fail = fail + 1;
                if (fail < GM_getValue('qp_max_retries')) console.warn(`[QuickPatrol] Failed to call MediaWiki. Retrying... (${fail}/${GM_getValue('qp_max_retries')})`);
                else console.error(`[QuickPatrol] Failed to call MediaWiki. (${fail}/${GM_getValue('qp_max_retries')})`);
                return new Promise(() => setTimeout(init, 2000));
            }

            console.log('[QuickPatrol] Checking rights...');
            rights = (yield mwApi.post({
                action: 'query',
                meta: 'userinfo',
                uiprop: 'rights'
            })).query.userinfo.rights;
            Object.assign(status, {
                patrol: rights.includes('patrol') && GM_getValue('qp_patrol'),
                rollback: rights.includes('rollback') && GM_getValue('qp_rollback'),
                abuselog: rights.includes('abusefilter-log-detail') && GM_getValue('qp_abuse_edit'),
                genRollback: (e) => $(e).addClass(`quickpatrol-rollback ${mwLang.startsWith('zh-') ? 'consolas' : ''}`)
            });

            if (GM_getValue('qp_jump_blank')) $('.interlanguage-link-target, .vector-menu-content .selected a, #p-personal a, #mw-panel a:not([href^="#"]), a:not([href^="#"],[href$="/doc"],[href*="section="],:has(span))').attr('target', '_blank');
            main();
        })();
    }

    function with_IPE() {
        if (!status.patrol) return;
        for (let e of $('.mw-diff-title--title')) {
            // InPageEdit NEXT
            $(e).contents().wrap('<span/>');
            const [a, b] = $(e).find('span');
            $(a).text(`${$(a).text()} (`).contents().unwrap();
            $(b).text($(b).text().slice(2, -1)).after(')').addClass('diff-version');
        }
        $('.diff-version:not(.diff-hidden-history)').click(function () {
            const me = $(this);
            if (me.attr('title')) return;
            const revid = me.text().replace(/[^0-9]/g, '');
            me.addClass('patrolling').attr('title', l.ing);
            patrol(me, revid);
        });
    }

    function main() {
        if (!rights && (fail >= GM_getValue('qp_max_retries') || !fail)) return init();
        if (status.abuselog) helper();
        if (status.rollback) rollback_util();

        if (!status.patrol) return;
        for (let e of $(status.np)) {
            const that = $(e);
            that.find('.revisionpatrol-icon-unpatrolled').after(`<span class="unpatrolled quickpatrol-icon-unpatrolled" title="${l.g_un}">!</span>`);
            that.find('.revisionpatrol-icon-unpatrolled').remove();
            that.find('.unpatrolled').addClass('quickpatrol').click(_asyncToGenerator(function* () {
                const me = $(this);
                if (me.text() != '!') return;
                me.addClass('patrolling').removeClass('unpatrolled');
                $(this).text('#').attr('title', l.ing);
                let revid = that.data('mw-revid');
                if (that.data('mw-logid')) {
                    yield mwApi.post({
                        action: 'query',
                        list: 'logevents',
                        leprop: 'ids',
                        letitle: that.find('td.mw-enhanced-rc-nested').data('target-page'),
                        letype: that.data('mw-logaction').split('/')[0],
                        lelimit: 'max'
                    }).done((data) => {
                        const q = data.query.logevents.find((i) => i.logid == that.data('mw-logid'));
                        if (q) revid = q.revid;
                    });
                }
                if (!revid) return $(this).text('!').addClass('unpatrolled').removeClass('patrolling').attr('title', l.un);
                that.attr('data-mw-revid', revid);
                patrol(me, revid, void 0, that.data('mw-logid'));
            }));
        }
    }

    function patrol(me, revid, rcid, logid) {
        const args = {
            revid: Number(revid),
            rcid: rcid,
            logid: logid,
            ts: $(`[data-mw-revid=${revid}]`).data('mw-ts'),
            targetPage: $(`[data-mw-revid=${revid}] [data-target-page]`).data('target-page'),
            online: navigator.onLine,
            platform: navigator.platform
        };
        const success = () => {
            console.debug(`[QuickPatrol] SUCCEEDED - ${JSON.stringify(args)}`);
            me.text('✔').addClass('quickpatrol').removeClass('patrolling unpatrolled').attr('title', l.done).off('click');
            const that = $(`[data-mw-revid=${revid}]`);
            const removeFilter = (e) => {
                $E(`.mw-rcfilters-ui-filterTagItemWidget:contains(${l.t_un}) .mw-rcfilters-ui-tagItemWidget-highlight`, (c) => {
                    e.removeClass(`mw-rcfilters-highlight-color-${c.data('color')}`);
                });
                e.removeClass('mw-changeslist-reviewstatus-unpatrolled');
                if (e.attr('title')) e.attr('title', e.attr('title').replace(new RegExp(`${l.t_un}(, |、\u200B)|(, |、\u200B)?${l.t_un}`, 'g'), ''));
                if (e.attr('title') == l.hl) e.removeClass('mw-rcfilters-ui-changesListWrapperWidget-enhanced-grey').removeAttr('title');
                e.find('.unpatrolled').text('✔').addClass('quickpatrol').removeClass('unpatrolled').attr('title', l.done).off('click');
            };
            removeFilter(that);
            $E(that.parent().find('.mw-rcfilters-ui-highlights-enhanced-toplevel'), (e) => {
                if (!$E(e.siblings().find('.unpatrolled, .patrolling'))) removeFilter(e);
            });
        };
        const fail = () => {
            const f = () => {
                console.warn(`[QuickPatrol] FAILED - ${JSON.stringify(args)}`);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    title: l.p_1,
                    text: l.p_2 + l.c + JSON.stringify(args),
                    icon: 'error',
                    timer: 5000,
                    showConfirmButton: false,
                    timerProgressBar: true
                });
                me.text('!').addClass('unpatrolled').removeClass('patrolling').attr('title', l.un);
                if (me.hasClass('quickpatrol-icon-unpatrolled')) me.attr('title', l.g_un);
            };
            mwApi.post({
                action: 'query',
                list: 'recentchanges',
                rcprop: 'ids',
                rctitle: args.targetPage,
                rclimit: 'max'
            }).done((data) => {
                const q = data.query.recentchanges.find((i) => i.revid == revid);
                if (!q) return f();
                patrol(me, revid, Number(q.rcid));
            }).fail(f);
        };
        console.debug(`[QuickPatrol] TRYING - ${JSON.stringify(args)}`);
        mwApi.post({
            action: 'query',
            meta: 'tokens',
            type: 'patrol'
        }).done((data) => {
            mwApi.post({
                action: 'patrol',
                token: data.query.tokens.patroltoken,
                [rcid ? 'rcid' : 'revid']: rcid || revid
            }).done(success).fail(fail);
        }).fail(fail);
    }

    init();
})();