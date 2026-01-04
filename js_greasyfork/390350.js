// ==UserScript==
// @name         jira任务板
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js
// @require      https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js
// @match        http://jira.dotfashion.cn/*
// @grant 	     GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390350/jira%E4%BB%BB%E5%8A%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/390350/jira%E4%BB%BB%E5%8A%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const pmNameKey = 'customfield_10300'
    const frontEndConfigOptions = [
        {
            title: '前端开始日期',
            key: 'customfield_11811',
        },
        {
            title: '前端结束日期',
            key: 'customfield_11788',
        },
    ]
    const issueConfigOptions = [
        {
            title: '联调日期',
            key: 'customfield_12557',
        },
        {
            title: '测试开始日期',
            key: 'customfield_11806',
        },
        {
            title: '测试结束日期',
            key: 'customfield_11792',
        },
        {
            title: '验收日期',
            key: 'customfield_11790',
        },
        {
            title: '计划上线日期',
            key: 'customfield_10203',
        },
        {
            title: '实际上线日期',
            key: 'customfield_10813',
        },
    ]
    const columns = [
        {
            title: '主需求号',
            key: 'linkKey',
            render: value => `<a href="http://jira.dotfashion.cn/browse/${value}" target="_blank">${value || ''}</a>`,
        },
        {
            title: '个人需求号',
            key: 'key',
            render: value => `<a href="http://jira.dotfashion.cn/browse/${value}" target="_blank">${value || ''}</a>`,
        },
        {
            title: '需求摘要',
            key: 'linkSummary',
            render: (value, item) => value || item.summary || '',
        },
        {
            title: '产品经理',
            key: 'pmName',
        },
    ].concat(frontEndConfigOptions.concat(issueConfigOptions).map(item => Object.assign({}, item, {
        class: value => {
            if (value) {
                const diff = moment(moment().format('YYYY-MM-DD')) - moment(value)
                const className = diff > 0 ? 'jira-m-done' : diff === 0 ? 'jira-m-active' : 'jira-m-wait'
                return className
            }
            return ''
        },
    })))
    const tableTitleTemp = $(`<tr class="table-title">` + columns.map(item => `<th class="table-item">${item.title}</th>`).join('') + `</tr>`)
    $(document).ready(function() {
        GM_addStyle(`
.jira-m-wait { background-color: #dfe1e5; color: #42526e; }
.jira-m-active { background: #0052cc; color: #fff; }
.jira-m-done { background-color: #e3fcef; color: #064; }
.jira-panel-icon { position: fixed; z-index: 101; left: 40px; bottom: 40px; width: 80px; height: 80px; border-radius: 50%; background: #0747a6; color: #fff; display: none; align-items: center; justify-content: center; cursor: pointer; }
.jira-panel-container { position: fixed; width: 100%; height: 100%; left: 0; top: 0; z-index: 100; display: none }
.jira-panel-mask { position: absolute; z-index: -1; width: 100%; height: 100%; left: 0; top: 0; background: rgba(0,0,0,.33); }
.jira-panel-modal-wrap { width: 100%; height: 100%; overflow: auto; }
.jira-panel-modal { width: 90%; margin: 50px auto; background: #fff; border: 1px solid #cecece; border-radius: 8px; }
.jira-panel-modal-title { text-indent: 1em; line-height: 2.8em; border-bottom: 1px solid #cecece; }
.jira-panel-modal-body { padding: 35px; }
.jira-panel-modal-body-content { overflow: auto; max-height: 400px; }
.jira-panel-modal-table .table-item { min-width: 60px; max-width: 250px; padding: 8px; line-height: 2em; text-align: center; }
.jira-panel-modal-table .table-title { font-weight: 600; background: rgba(0,0,0,.15); }
`)
        const panelIconTemp = $(`<div class="jira-panel-icon" id="panelIcon">JIRA面板</div>`)
        const panelContainerTemp = $(`
<div class="jira-panel-container">
    <div class="jira-panel-mask" />
    <div class="jira-panel-modal-wrap">
        <div class="jira-panel-modal">
            <div class="jira-panel-modal-title">JIRA任务-${moment().format('YYYY-MM-DD')}</div>
            <div class="jira-panel-modal-body">
                <div class="jira-panel-modal-body-content">
                    <table class="jira-panel-modal-table" id="panelTable" border="1" cellspacing="0" />
                </div>
            </div>
        </div>
    </div>
</div>
`)
        $('body').append(panelIconTemp)
        $('body').append(panelContainerTemp)
        panelIconTemp.click(() => panelContainerTemp.slideToggle())
        fetch('/rest/api/2/myself')
            .then(res => res.json())
            .then(res => {
            const jql = encodeURIComponent(`project = MLB AND assignee in (${res.name}) order by created DESC`)
            return fetch(`/rest/api/2/search?jql=${jql}`)
        })
            .then(res => res.json())
            .then(res => {
            const data = res.issues.map(item => {
                const { key, fields } = item
                const frontEndConfig = _.pick(fields, frontEndConfigOptions.map(item => item.key))
                const linkOptions = fields.issuelinks.length ? fields.issuelinks[0].outwardIssue : {}
                return Object.assign({}, {
                    key,
                    summary: fields.summary,
                    linkKey: linkOptions.key,
                    linkSummary: linkOptions.fields && linkOptions.fields.summary,
                    linkApi: linkOptions.self,
                }, frontEndConfig)
            })
            return Promise.all(data.map(item => {
                if (item.linkApi) {
                    return fetch(item.linkApi).then(res => res.json())
                }
                return Promise.resolve(null)
            })).then(res => data.map((item, index) => {
                const fields = res[index] ? res[index].fields : {}
                const pmName = fields[pmNameKey] && fields[pmNameKey].name
                return Object.assign({ pmName }, item, _.pick(fields, issueConfigOptions.map(child => child.key)))
            }))
        }).then(res => {
            const rowHtmlStr = res.map(item => {
                const childs = columns.map(sub => {
                    const keyValue = item[sub.key]
                    const value = typeof sub.render === 'function' ? sub.render(keyValue, item) : keyValue
                    const className = typeof sub.class === 'function' ? ` ${sub.class(keyValue, item)}` : ''
                    return `<td class="table-item${className}">${value || ''}</td>`
                })
                return `<tr class="table-row">${childs.join('')}</tr>`
            }).join('')
            $('#panelTable').append(tableTitleTemp)
            $('#panelTable').append($(rowHtmlStr))
            $('#panelIcon').css('display', 'flex').fadeIn()
        })
    });
})();
