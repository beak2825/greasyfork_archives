// ==UserScript==
// @name         xieying3D-manager
// @namespace    http://tampermonkey.net/
// @version      2025.2.25.1
// @description  try it
// @author       You
// @match        https://data-encoder.ruqimobility.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ruqimobility.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/523031/xieying3D-manager.user.js
// @updateURL https://update.greasyfork.org/scripts/523031/xieying3D-manager.meta.js
// ==/UserScript==

(function() {
    if(location.hash !== '#/task-panel/task-panel-list') return

    window.$ = Document.prototype.$ = Element.prototype.$ = $;
    window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$;

    const _ds = window._ds = {
        data: null,
        projectIds: {}
    }

    const baseURL = 'https://data-encoder\\.ruqimobility\\.com'
    hijackXHR(function() {
        const xhr = this;
        // console.log(xhr.responseURL);
        const data = JSON.parse(xhr.responseText);

        [
            () => {
                if(findURL(xhr.responseURL, [`^${baseURL}/annotation/workflow/queryDatasetByGroup`])) {
                    // console.log(data.data)
                    _ds.data = data.data
                }
            },
            () => {
                if(findURL(xhr.responseURL, [`^${baseURL}/annotation/project/findByMember\\?status=PROGRESS`, `^${baseURL}/annotation/project/findByUserCustom\\?status=PROGRESS`])) {
                    console.log(data.data)
                    _ds.projectIds = {}
                    data.data.map(item => {
                        _ds.projectIds[item.name] = item.id
                    })
                }
            }
        ].forEach(item => item())

        function findURL(responseURL, URLs) {
            return URLs.some(url => new RegExp(url).test(responseURL))
        }
    })

    const appear = {}
    Obs(document, mrs => {
        console.log(mrs)
        mrs.forEach(mr => {
            [...mr.addedNodes].some(an => {
                // console.log(an)
                if(!appear.menu && $('ul.el-menu')) {
                    const menu = $('ul.el-menu')
                    const textarea_input = createEl('textarea', {
                        className: 'textarea_input',
                        style: {
                            width: '180px',
                            height: '150px',
                            margin: '100px 0 0 10px',
                            outline: 'none',
                            padding: '5px 10px',
                            fontSize: '14px',
                        },
                        oninput: function() {
                            _ds.allProjectData && verifyActivity(_ds.allProjectData)
                        }
                    })
                    const btnWrap = createEl('div', {
                        style: {
                            display: 'flex',
                            justifyContent: 'end',
                            marginRight: '10px',
                        }
                    })

                    const btn_style = {
                        width: '75px',
                        padding: '0 5px',
                        height: '25px',
                        background: '#ddd',
                        borderRadius: '5px',
                        textAlign: 'center',
                        lineHeight: '25px',
                        fontSize: '14px',
                        color: '#555',
                        cursor: 'pointer',
                    }
                    const btn_preview = createEl('div', {
                        style: {...btn_style,
                            marginRight: '5px'
                        },
                        innerText: '数据预览',
                        onclick: function() {
                            textarea_input.value = '数据查询中...'
                            const focusProjectId = /#(\d*)/.exec($('.list-content .list-content_item.is_active').textContent)[1]

                            fetch("https://data-encoder.ruqimobility.com/annotation/workflow/taskHallRunning", {
                                "headers": {
                                    "authorization": 'Bearer ' + JSON.parse(localStorage.getItem('usePermissionStore-prod')).token,
                                    "cache-control": "no-cache",
                                    "content-type": "application/json",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin"
                                },
                                "body": `{\"assignType\":\"ALL\",\"pageNo\":1,\"pageSize\":100000,\"activityId\":\"annotate\",\"projectId\":${focusProjectId}}`,
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            }).then(res => res.json()).then(res => {
                                console.log(res)
                                const list = res?.data?.list
                                if(list === null) {
                                    return (textarea_input.value = '总条数*0，暂无可预览')
                                } else if(list === void 0) {
                                    alert('数据获取失败，请重试')
                                }
                                const taskIds = res.data.list.filter(item => !item.assigneeId)
                                const taskIds_preview = res.data.list.filter(item => item.dataAnnotationRecordId).map(item => item.datasetId)

                                textarea_input.value = taskIds_preview.length ? taskIds_preview.reduce((counter, item) => counter+item+'\n', `总条数*${taskIds.length}\n`) : `总条数*${taskIds.length}，暂无可预览`
                                if(taskIds_preview.length) {
                                    $('.btn_check').click()
                                } else {
                                    $('.resultWrap').innerHTML = ''
                                }
                            })


                        }
                    })
                    const btn_check = createEl('div', {
                        className: 'btn_check',
                        style: btn_style,
                        innerText: '核对状态',
                        onclick: function() {

                            let resCount = 0
                            const resultWrap = $('.resultWrap')
                            resultWrap.innerHTML = '核对中 0%...'

                            const projectIds = Object.values(_ds.projectIds)
                            Promise.all(projectIds.map(id => {
                                return fetch("https://data-encoder.ruqimobility.com/annotation/workflow/queryDatasetByGroup", {
                                    "headers": {
                                        "authorization": 'Bearer ' + JSON.parse(localStorage.getItem('usePermissionStore-prod')).token,
                                        "content-type": "application/json",
                                        "sec-fetch-dest": "empty",
                                        "sec-fetch-mode": "cors",
                                        "sec-fetch-site": "same-origin"
                                    },
                                    "body": `{\"projectId\":${id},\"batchId\":null,\"assignType\":\"ALL\"}`,
                                    "method": "POST",
                                    "mode": "cors",
                                    "credentials": "include"
                                }).then(res => res.json()).then(res => {
                                    resultWrap.innerHTML = `核对中 ${parseInt((++resCount/projectIds.length)*100)}%...`
                                    return Promise.resolve(res)
                                })
                            })).then(res => {
                                _ds.allProjectData = res.map(item => item.data)
                                verifyActivity(_ds.allProjectData)
                            }, (err) => {
                                console.warn(err)
                                $('.resultWrap').innerHTML = '核对失败...'
                            })

                        }
                    })
                    const resultWrap = createEl('div', {
                        className: 'resultWrap',
                        style: {
                            marginTop: '20px',
                            padding: '5px 10px',
                            width: '180px',
                            height: '480px',
                            fontSize: '14px',
                            overflow: 'auto',
                            maxHeight: '1000px',
                        },
                    })
                    btnWrap.append(btn_preview, btn_check)
                    menu.append(textarea_input, btnWrap, resultWrap)

                    function verifyActivity(datas) {
                        const taskIds = textarea_input.value.split('\n')
                        resultWrap.innerHTML = ''

                        taskIds.forEach((taskId) => {

                            const dataItem = findDataItem(taskId, datas)
                            const activityMap = {
                                annotate: '标注 👈',
                                audit_1: '审核1 👈',
                                audit_2: '审核2 ⏳',
                                inspect_1: '质检1',
                                accept_1: '验收1',
                                accept_2: '验收2',
                                complete: '验收完成',
                            }
                            const activity = dataItem ? activityMap[dataItem.activityId] : ''

                            const resultItem = createEl('div', {
                                innerText: `${taskId}\t${activity}
                                ${dataItem ? `${dataItem.assigneeId ? `已领取\n${dataItem.assignee}` : '待领取'}
                                  ${dataItem.projectName}
                                ` : ''}\n\n`,
                                taskId: taskId,
                                onmousedown: function(e) {
                                    if(e.which !== 3) return

                                    if(!dataItem) return alert('任务ID无效')

                                    const {datasetId, dataAnnotationRecordId, processInstanceId, projectName } = dataItem
                                    const param = R2({
                                        "projectId": _ds.projectIds[projectName],
                                        "recordId": dataAnnotationRecordId,
                                        "status": "Annotate",
                                        "processInstanceId": processInstanceId,
                                        "taskDefinitionKey": "annotate",
                                        "datasetId": datasetId,
                                        "acceptDatasetEditUserIds": ""
                                    })

                                    if(confirm(`跳转进入该任务（${datasetId}）？`)) {
                                        const el = document.createElement('a')
                                        el.href = `https://data-encoder.ruqimobility.com/tool/pc?${param}`
                                        el.target= '_blank'
                                        el.click()
                                    }
                                }
                            })
                            resultWrap.append(resultItem)
                        })
                    }
                    function findDataItem(taskId, datas) {
                        let r = null
                        datas.some((data, idx) => {
                            return data.some(activityItem => {
                                const findRes = activityItem.list.find(item => item.datasetId == taskId)
                                if(!findRes) return
                                findRes.activityId = activityItem.activityId
                                findRes.projectName = Object.keys(_ds.projectIds)[idx]
                                r = findRes
                            })
                        })

                        return r
                    }

                    appear.menu = true
                }

                const annoWrap = $$('.h-full').find(item => item.textContent.startsWith('标注'))?.$('.lane-item-border.overflow-auto')
                if(!appear.annoList && annoWrap) {
                    [...annoWrap.children].filter(item => item.$('.item-status.wait')).forEach(item => {
                        const taskId = /ID: (\d*)/.exec(item.$('.el-badge.item .font-700').textContent)?.[1]
                        const dataList = _ds.data.find(item => item.activityId == "annotate").list
                        const findRes = dataList.find(item => item.datasetId == taskId)
                        item.style.boxShadow = findRes.dataAnnotationRecordId ? 'gray 0px 0px 6px .5px inset' : null

                    })
                    appear.annoList = true
                }

                if(an.matches?.('.flex.w-full.justify-center.items-start') && an.parentElement.matches?.('.el-main .content .h-full')) {
                    an.style.border = '2px solid #eee'
                }
            })
        })
    }, { childList: true, subtree: true})

    document.addEventListener('contextmenu',function(e){
        e.preventDefault();
    })

    document.onmousedown = function(e) {
        if(e.which !== 3) return
        const el = e.target
        let taskId

        if(el.matches?.('span.font-700') && (taskId = /ID: (\d*)/.exec(el.textContent)?.[1])) {
            _ds.data.some(item => {
                const data = item.list.find(item => {
                    if(item.datasetId === Number(taskId)) {
                        return true
                    }
                })

                if(data) {
                    console.log(data)
                    const {datasetId, dataAnnotationRecordId, processInstanceId, } = data
                    const projectName = [...document.querySelector('.el-radio-group').querySelectorAll('.el-radio')].find(item => item.matches('.is-checked'))

                    const param = R2({
                        "projectId": _ds.projectIds[projectName],
                        "recordId": dataAnnotationRecordId,
                        "status": "Annotate",
                        "processInstanceId": processInstanceId,
                        "taskDefinitionKey": "annotate",
                        "datasetId": datasetId,
                        "acceptDatasetEditUserIds": ""
                    })

                    if(confirm(`跳转进入该任务（${datasetId}）？`)) {
                        const el = document.createElement('a')
                        el.href = `https://data-encoder.ruqimobility.com/tool/pc?${param}`
                        el.target= '_blank'
                        el.click()
                    }

                    return true
                }

            })
        }
    }
})();

function R2(e) {
    let t = "";
    const n = [];
    return (Object.keys(e).forEach((t => {
        const o = `${t}=${e[t]}`
          , r = encodeURIComponent(o);
        n.push(r)
    })),
    (t = n.join("&")),
    (t = window.btoa(t)),
    t)
}


function hijackXHR(change, send) {
    const realXMLHttpRequest = window.XMLHttpRequest;

    window.XMLHttpRequest = function() {
        const xhr = new realXMLHttpRequest();

        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState !== 4) return
            change.call(this)
        });

        send && (xhr.send = send.bind(xhr))
        return xhr;
    }
}

function Obs(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
    if(!target) return console.error('目标不存在')

    const ob = new MutationObserver(callBack);
    ob.observe(target, options);
    return ob
}

function createEl(elName, options) {
    const el = document.createElement(elName)
    for(let opt in options) {
        if(opt !== 'style') {
            el[opt] = options[opt]
        } else {
            let styles = options[opt]
            setStyle(el, styles)
        }
    }
    return el
}


function $(selector) {
    const _this = Element.prototype.isPrototypeOf(this) ? this : document
    const sel = String(selector).trim();

    const id = /^#([^ +>~\[:]*)$/.exec(sel)?.[1]
    return (id && _this === document) ? _this.getElementById(id) : _this.querySelector(sel)
}

function $$(selector) {
    const _this = Element.prototype.isPrototypeOf(this) ? this : document
    return Array.from(_this.querySelectorAll(selector))
}

function setStyle() {
    [[Map, ()=> {
        const styleMap = arguments[0]
        for (const [el, styleObj] of styleMap) {
            !Array.isArray(el) ? setStyleObj(el, styleObj) : el.forEach((el) => setStyleObj(el, styleObj))
        }
    }], [Element, () => {
        const [el, styleObj] = arguments
        setStyleObj(el, styleObj)
    }], [Array, () => {
        const [els, styleObj] = arguments
        els.forEach((el) => setStyleObj(el, styleObj))
    }]].some(([O, fn]) => O.prototype.isPrototypeOf(arguments[0]) ? (fn(), true) : false)

    function setStyleObj(el, styleObj) {
        for (const attr in styleObj) {
            if (el.style[attr] !== undefined) {
                el.style[attr] = styleObj[attr]
            } else {
                //将key转为标准css属性名
                const formatAttr = attr.replace(/[A-Z]/, match => `-${match.toLowerCase()}`)
                console.error(el, `的 ${formatAttr} CSS属性设置失败!`)
            }
        }
    }
}


/*
2025/2/23
- 适配：适配新界面

2025/2/24
- 新增：查询预览包（编写中）
*/