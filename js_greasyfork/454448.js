// ==UserScript==
// @name         不要到处coco
// @namespace    https://wydevops.coding.net/
// @version      1.8.4
// @description  coding增强
// @author       cuiqimeng
// @match        https://wydevops.coding.net/*
// @match        http://devops.ack.sunacwy.com.cn/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      http://code.jquery.com/ui/1.11.0/jquery-ui.min.js
// @resource      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.css
// @icon         https://wydevops.coding.net/static/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454448/%E4%B8%8D%E8%A6%81%E5%88%B0%E5%A4%84coco.user.js
// @updateURL https://update.greasyfork.org/scripts/454448/%E4%B8%8D%E8%A6%81%E5%88%B0%E5%A4%84coco.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('注入成功', window.fetch);

    // 工具方法
    const Utils = {
        // arr数组使用prop属性求和
        reduceByProp(arr, prop) {
            return arr.reduce((total, curr) => {
                return total += (curr[prop] || 0)
            }, 0)
        },
        formatRate(number) {
            let ico;
            if (number >= 1)
                ico = '🌕'
            else if (number >= 0.75)
                ico = '🌔'
            else if (number >= 0.5)
                ico = '🌓'
            else if (number > 0)
                ico = '🌒'
            else ico = '🌑'
            return ico + (Number(number) * 100).toFixed(2) + '%'
        },
        debounce(fn, time = 500) {
            let t = null
            return function () {
                if (t) {
                    clearTimeout(t)
                }
                t = setTimeout(() => {
                    fn.apply(this, arguments);
                }, time)
            }
        },
        isCurrentWeek(past) {
            const pastTime = new Date(past).getTime()
            const today = new Date(new Date().toLocaleDateString())
            let day = today.getDay()
            day = day == 0 ? 7 : day
            const oneDayTime = 60 * 60 * 24 * 1000
            const monday = new Date(today.getTime() - (oneDayTime * (day - 1)))
            const nextMonday = new Date(today.getTime() + (oneDayTime * (8 - day)))
            if (monday.getTime() <= pastTime && nextMonday.getTime() > pastTime) {
                return true
            } else {
                return false
            }
        },
        formatStatus(str) {
            switch (str) {
                case '已完成':
                    return '✅'
                case '未开始':
                    return ''
                case '处理中':
                    return '♿️'
                default:
                    return ''
            }
        },
        formatPriority(priority) {
            switch (priority) {
                case 3:
                    return `🆘`
                case 2:
                    return `🚩`
                default:
                    return ''
            }
        }
    }

    let showParentIssues = true;
    const _fetch = window.fetch;
    window.fetch = function () {
        const url = arguments[0];
        if (url.includes('platform/user/current')) {
            console.log(arguments, document.cookie)
        }
        if (showParentIssues && url.includes('subtask-tree')) {
            //console.log('我是拦截器(o^^o)', arguments);
            const modifiedUrl = replaceQueryParam(url, 'showParentIssues', 'true');
            console.log(modifiedUrl);
            arguments[0] = modifiedUrl;
        }

        return _fetch.apply(this, arguments)
    }

    function replaceQueryParam(url, paramName, paramValue) {
        const regex = new RegExp(`(${encodeURIComponent(paramName)}=)[^&]+`);
        return url.replace(regex, `$1${encodeURIComponent(paramValue)}`);
    }


    let script = document.createElement('link');
    script.setAttribute('rel', 'stylesheet');
    script.setAttribute('type', 'text/css');
    script.href = "https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.css";
    document.documentElement.appendChild(script);

    const style = document.createElement('style');
    style.innerHTML = `
  .coco-info-icon {
    width: 13px;
    height: 13px;
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDFhMyAzIDAgMDEzIDN2OGEzIDMgMCAwMS0zIDNINGEzIDMgMCAwMS0zLTNWNGEzIDMgMCAwMTMtM2g4ek05IDdIN3Y1aDJWN3pNOCA0Yy0uNiAwLTEgLjQtMSAxcy40IDEgMSAxIDEtLjQgMS0xLS40LTEtMS0xeiIgZmlsbD0iIzIwMkQ0MCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+) 50% no-repeat;
    background-size: cover;
    opacity: 1;
    margin-left: 4px;
    cursor: pointer;
    filter: brightness(10);
  }
  .coco-additions-wrapper {
    background: #b222221a;
    padding: 8px;
    border-radius: 4px;
    border-top-left-radius: 0;
  }
  .coco-additions-wrapper > p:last-child {
    margin-bottom: 0;
  }
  header.coco-additions-tag {
    display: inline-flex !important;
    font-size: 12px;
    background: firebrick;
    color: white;
    font-weight: bold;
    padding: 3px 5px 2px 4px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    margin-top: 4px;
  }
  .coco-tooltip {
    position:absolute;
    border:1px solid #333;
    background:#f7f5d1;
    padding:1px;
    color:#333;
    display:none;
  }
  .coco-addition-hours {
    font-weight: bold;
    color: firebrick
  }
  .ui-tabs-active.ui-state-active .coco-addition-hours {
    color: #fff;
  }
  .sp_sub_tag {
  background: #e3f4fc;
  color: #045fe6;
  min-width: 24px !important;
  position: absolute !important;
  left: 15px;
  text-align: center;
  }
  .ui-tabs div.ui-tabs-panel {
    padding: 4px 6px;
    font-size: 13px;
  }

  .ui-tabs .ui-tabs-nav a.ui-tabs-anchor {
    padding: 2px 6px;
    font-size: 13px;
  }
  .ui-tabs ul.ui-tabs-nav {
    padding: 0em 0.2em 0.1em 0;
    background: #FFF5E6;
  }

  .ui-tabs .ui-tabs-nav li.ui-state-default.ui-corner-top {
    background: #fff;
    border: 1px solid #ffebc9;
    padding: 1px 2px;
    transition: 0.2s;
    box-shadow: 1px 1px 4px 1px #e0e0e0;
    border-radius: 4px;
    margin: 1px 2px;
  }
  .ui-tabs .ui-tabs-nav li.ui-state-default.ui-corner-top:hover {
    transform: scale(1.08);
    box-shadow: 1px 1px 8px 1px #e0e0e0;
  }


  li.ui-state-default.ui-corner-top.ui-tabs-active.ui-state-active {
    background: #FF9F08;
    border: 1px solid #FFB239;
  }
  div.ui-widget.ui-widget-content {
    border: none;
    padding-bottom: 16px;
    background: #FFF5E6;
  }
  @keyframes liuquan {
  0% {
    background: red;
  }
  50% {
    background: #a72929;
  }
  100% {
    background: red;
  }
}
  `
    document.head.appendChild(style)

    const store = {
        projectList: [],
        project: {}, iterationId: '', iteration: {}, personHoursMap: {}, story: [], fileds: []
    }
    const render = Utils.debounce(_render)
    const ID_VALUE = 'coco-tabs';
    const main = Utils.debounce(async () => {
        if (!/^\/p(.+)\//.test(location.pathname)) return;

        const projectName = /^\/p\/(.+?)\//.exec(location.pathname)[1];
        if (store.project.name !== projectName) {
            await getProjectId(projectName);
            await getMyProjectList();
            for (const datum of store.projectList) {
                await getIterationsList(datum)
            }
            console.log('projectList:', store.projectList);
            大爷让我加的需求()
        }
        const iterationId = new RegExp(`^\/p\/${projectName}\/iterations\/(.+?)\/`).exec(location.pathname)[1];
        if (store.iterationId !== iterationId) {
            $(`#${ID_VALUE}`).remove()
            store.iterationId = iterationId;
            await getIteration();
            await getSubTree();
            await getFieldsList();

            render()
        } else {
            if ($(`#${ID_VALUE}`) && $(`#${ID_VALUE}`).length) {
                /// console.log(666)
                $('table').scroll(() => {
                    incept()
                })
                $('table').click(() => {
                    incept()
                })
                incept()
            } else {
                render();
            }

        }
    }, 800)

    const rerender = Utils.debounce(_rerender, 1000)

    async function _rerender() {
        console.log('RERENDER:!!!!!!!!!!!')
        $(`#${ID_VALUE}`).remove()
        //store.iterationId = iterationId;
        await getIteration();
        await getSubTree();

        render();
    }

    setInterval(() => {
        main();
        hackLiYang();
    }, 1200)

    window.addEventListener('locationchange', main)

    window.onload = main


    const getProjectId = async function (projectName) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://wydevops.coding.net/api/platform/project/${projectName}`,
                data: {},
                type: "get",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                success: function ({data}) {
                    console.log(data)
                    store.project = data;
                    resolve()
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(arguments)
                    reject(errorThrown)
                }
            });
        })

    }

    const getSubTree = async function () {
        const projectId = store.project.id;
        const iterationId = store.iterationId;
        const currDataList = await getSubTreeSingle(projectId, iterationId);
        store.personHoursMap = _subTreeToMap(currDataList);
        Object.entries(store.personHoursMap).forEach(([name, item]) => {
            item.addition = [];
        })
        store.story = currDataList;
        console.log(store.iteration);
        const checker = function (iteration) {
            return Math.abs((iteration.startAt - store.iteration.startAt) / (24 * 60 * 60 * 1000)) < 6
        }
        for (const project of store.projectList) {
            if (project.id === store.project.id) continue;
            const iteration = project.$iterations.find(item => checker(item));
            if (iteration) {
                const list = await getSubTreeSingle(project.id, iteration.code);
                const _map = _subTreeToMap(list);
                // console.log(_map);
                Object.entries(store.personHoursMap).forEach(([name, item]) => {
                    const item0 = _map[name];
                    if (!item0) return;
                    item0.iteration = iteration;
                    if (item.addition.find(addItem => addItem.iteration.id === iteration.id)) {
                        return;
                    }
                    item.addition.push(item0);
                })
            }
        }
        console.log(store.personHoursMap);
    }

    const getSubTreeSingle = async function (projectId, iterationId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://wydevops.coding.net/api/project/${projectId}/iterations/${iterationId}/issues/tree`,
                data: JSON.stringify({
                    "content": {
                        "sort": {
                            "key": "PRIORITY",
                            "value": "DESC"
                        },
                        "conditions": [
                            {
                                "value": [
                                    "TODO",
                                    "PROCESSING",
                                    "COMPLETED"
                                ],
                                "key": "STATUS_TYPE",
                                "fixed": true,
                                "constValue": [],
                                "validInfo": [],
                                "userMap": {
                                    "COMPLETED": {
                                        "value": "COMPLETED"
                                    }
                                },
                                "selectedItems": {
                                    "COMPLETED": {
                                        "value": "COMPLETED"
                                    }
                                }
                            },
                            {
                                "value": [],
                                "valueChanged": null,
                                "validInfo": null,
                                "userMap": {},
                                "status": null,
                                "key": "ASSIGNEE",
                                "fixed": true,
                                "constValue": []
                            },
                            {
                                "value": "",
                                "key": "BASE_ISSUE_TYPE",
                                "fixed": true,
                                "constValue": []
                            },
                            {
                                "key": "ITERATION",
                                "value": [
                                    iterationId
                                ]
                            }
                        ],
                        "showSubIssues": true,
                        "showParentIssues": false
                    },
                    "page": 1,
                    "pageSize": 500
                }),
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                headers: {
                    'x-xsrf-token': $.cookie('XSRF-TOKEN')
                },
                dataType: "json",
                success: function ({data, iteration_not_exist}) {
                    if (iteration_not_exist) {
                        console.error(iteration_not_exist);
                        return resolve([])
                    }
                    resolve(data ? (data.list || []) : [])
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(arguments)
                    reject(errorThrown)
                    //layer.alert('课程进度更新错误：' + errorThrown, { icon: 0 });
                }
            });
        })
    }

    function _subTreeToMap(list) {
        const personHoursMap = {};
        list.forEach(item => {
            if (item.subTasks.length === 0) {
                item.subTasks = item.subIssues.filter(it => it.type === "SUB_TASK")
            }
            item.$hours = item.subTasks.reduce((prev, curr, r) => prev + (curr.workingHours || 0), 0);
            item.subTasks.forEach(task => {
                const personName = task.assignee?.name ?? '未指定';
                const person = personHoursMap[personName] = personHoursMap[personName] || {
                    tasks: [], workingHours: 0, person: task.assignee
                };
                person.tasks.push(task);
                person.workingHours += task.workingHours;
            })
        });
        return personHoursMap;
    }

    async function getIteration() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://wydevops.coding.net/api/project/${store.project.id}/iterations/${store.iterationId}`,
                data: {},
                type: "get",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                success: function ({data}) {
                    console.log(data)
                    store.iteration = data;
                    resolve()
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(arguments)
                    reject(errorThrown)
                }
            });
        })
    }

    async function subTaskDetail(subTextId) {
        const url = `https://wydevops.coding.net/api/project/${store.project.id}/issues/sub-tasks/${subTextId}/activities`
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                data: {},
                type: "get",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                success: function ({data}) {
                    //console.log(data)
                    resolve(data)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(arguments)
                    reject(errorThrown)
                }
            });
        })
    }

    let __flag = false;
    const incept = Utils.debounce(() => {
        try {
            if (!__flag && $('span[class^=username]')[0]) {
                console.log(document.cookie)
                __flag = true;
            }
            /**

             if (!$('#_on_off').length) {
             const filterBarDom = $('div[class^="filter-bar-section-"]');
             //console.log('filterBarDom', filterBarDom);
             $(filterBarDom[0]).append($(`<button id="_on_off" style="width: 40px;height: 24px;color: rgb(25, 128, 97);background-color: rgb(195, 243, 203);margin: 2px 16px 10px 10px;border: none;font-weight: bold;border-radius: 3px;cursor: pointer;
             " onclick="_on_off_toggle(this)">ON</button>`));
             window._on_off_toggle = function (button) {
             if (button.innerHTML === 'ON') {
             showParentIssues = false;
             button.innerHTML = 'OFF';
             button.style.backgroundColor = '#f24c3d';
             button.style.color = '#fff';
             } else {
             button.innerHTML = 'ON';
             button.style.backgroundColor = '#c3f3cb';
             button.style.color = '#198061';
             showParentIssues = true;
             }
             }
             }
             **/
        } catch (e) {
        }
        store.story.forEach(item => {
            const dom = $(`a[href^='/p/${store.project.name}/requirements/issues/${item.code}/detail']`);
            // console.log(dom, item.$hours);
            try {
                const td = dom.parent().parent().parent().parent().children()[1];
                if ($(td).find('div.spspspspsp').length) throw new Error();
                td.style.position = 'relative';
                // `<div class="tag-OnRxknb07m epic-1Eg_rPGjj7"><div class="icon-24obWj6mLq"></div><div class="detail-hc4p8Zzxbo">【保洁】【保洁-0324】新增</div></div>`
                $(td).prepend(`<div sp class="spspspspsp tag-OnRxknb07m epic-1Eg_rPGjj7"><div class="icon-24obWj6mLq"></div><div class="detail-hc4p8Zzxbo">${`${item.$hours}`.slice(0, 5)}/<span style="color: #ffa200">${fiberMatch(item.$hours)}</span></div></div>`)
                /*$(td).append(`<div sp style='position: absolute; font-size: 12px;
        left: 32px;
        bottom: -2px;
        color: #222;
        font-weight: bold;'>${item.$hours}/<span style="color: #ffa200">${fiberMatch(item.$hours)}</span></div>`)*/
            } catch (e) {
            }
            item.subTasks.forEach(sub => {
                const sub_dom = $(`a[href^='/p/${store.project.name}/subtasks/issues/${sub.code}/detail']`);
                // console.log(sub_dom)
                try {
                    const td_sub = sub_dom.parent().parent().parent().parent().children()[1];
                    if ($(td_sub).find('div.spspspspsp').length) throw new Error();
                    td_sub.style.position = 'relative';
                    // `<div class="tag-OnRxknb07m epic-1Eg_rPGjj7"><div class="icon-24obWj6mLq"></div><div class="detail-hc4p8Zzxbo">【保洁】【保洁-0324】新增</div></div>`
                    $(td_sub).prepend(`<div sp class="spspspspsp tag-OnRxknb07m sp_sub_tag"><div class="detail-hc4p8Zzxbo">${`${sub.workingHours}`.slice(0, 5)}</div></div>`)

                } catch (e) {
                }
            })
            /*
      dom.append(`<div sp style='  position: absolute;
        left: auto;
        bottom: 0;
        color: #ffa200;
        font-weight: bold;'>${item.$hours}</div>`) */
        });
    })
    let interval = null;

    function _render() {
        window.$ = $
        interval && clearInterval(interval)
        const iterationRate = Number(((1 - store.iteration.remainingDays / ((store.iteration.endAt - store.iteration.startAt) / 3600 / 24 / 1000))).toFixed(2));
        interval = setInterval(() => {
            // 渲染
            const tableDom = $('table');
            if (!tableDom.length) {
                return
            }
            interval && clearInterval(interval)
            console.log(tableDom)
            // tableDom.prepend(`<button class="new-button-1kWt8bSwah default-14YlfkOcgs h-32-1KvNA1yjmi">一键更新故事点</button>`)
            const tabsWrapper = document.createElement('div');
            tabsWrapper.id = ID_VALUE;
            const ul = document.createElement('ul');
            if ($(`#${ID_VALUE}`) && $(`#${ID_VALUE}`).length) {
                $(`#${ID_VALUE}`).remove()
            }
            $(ul).appendTo(tabsWrapper)
            Object.entries(store.personHoursMap).sort((a, b) => b[1].workingHours - a[1].workingHours).forEach(([personName, item], index) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${ID_VALUE}-${index + 1}`;
                const additionHours = Utils.reduceByProp(item.addition, 'workingHours');
                const additionText = additionHours ? ` + <span class="coco-addition-hours">${additionHours}</span>` : ''
                a.innerHTML = `${personName}(${item.workingHours}${additionText})`;
                if (!item.person) {
                    a.style.color = 'red'
                }
                $(a).appendTo(li);
                const div = document.createElement('div');
                div.id = `${ID_VALUE}-${index + 1}`;
                div.style.display = 'none';
                const subs = item.tasks.filter(item => item.issueTypeDetail.name === '子工作项');
                const completed = subs.filter(item => item.issueStatus.name === '已完成');
                const completedHours = Utils.reduceByProp(completed, 'workingHours');
                const subsHours = Utils.reduceByProp(subs, 'workingHours');
                const hoursRate = completedHours / subsHours;
                const deltaRate = hoursRate - iterationRate;

                let additionLines = item.addition.map(item => {
                    const subs = item.tasks.filter(item => item.issueTypeDetail.name === '子工作项');
                    const completed = subs.filter(item => item.issueStatus.name === '已完成');
                    return `
            <p>
             <b style="color: firebrick">${item.iteration.name}：</b>
             <b>${Utils.reduceByProp(completed, 'workingHours')}</b>/${Utils.reduceByProp(subs, 'workingHours')}&nbsp;&nbsp;&nbsp;&nbsp;
             完成率：<b>${Utils.formatRate(Utils.reduceByProp(completed, 'workingHours') / Utils.reduceByProp(subs, 'workingHours'))}</b>&nbsp;&nbsp;&nbsp;&nbsp;
             <b style="color: ${deltaRate > 0 ? 'green' : 'red'}">${deltaRate > 0 ? '⬆' : '⬇'}</b>${Utils.formatRate(deltaRate)}（期望：${Utils.formatRate(iterationRate)}）
             子工作项进度：<b>${completed.length}</b>/${subs.length}&nbsp;&nbsp;&nbsp;&nbsp;完成率：<b>${Utils.formatRate(completed.length / subs.length)}</b>
            </p>
          `
                }).join('');
                if (additionLines) {
                    additionLines = `
            <header class="coco-additions-tag">共享资源任务工时统计<div class="coco-info-icon"></div></header>
            <div class="coco-additions-wrapper">
                ${additionLines}
            </div>
          `
                }

                let innerHTML = `
          <p style="margin-bottom: 0;"><b>${store.iteration.name}：</b>
            <b>${Utils.reduceByProp(completed, 'workingHours')}</b>/${Utils.reduceByProp(subs, 'workingHours')}&nbsp;&nbsp;&nbsp;&nbsp;
            完成率：<b>${Utils.formatRate(Utils.reduceByProp(completed, 'workingHours') / Utils.reduceByProp(subs, 'workingHours'))}</b>&nbsp;&nbsp;&nbsp;&nbsp;
            <b style="color: ${deltaRate > 0 ? 'green' : 'red'}">${deltaRate > 0 ? '⬆' : '⬇'}</b>${Utils.formatRate(deltaRate)}（期望：${Utils.formatRate(iterationRate)}）
           子工作项进度：<b>${completed.length}</b>/${subs.length}&nbsp;&nbsp;&nbsp;&nbsp;完成率：<b>${Utils.formatRate(completed.length / subs.length)}</b>
            ${item.person ? `<button class="_week_report new-button-1kWt8bSwah default-14YlfkOcgs h-32-1KvNA1yjmi" style="margin-left: 12px;height: 24px;" data-user="${item.person.id}">生成周报</button>
          <button class="_all_report new-button-1kWt8bSwah default-14YlfkOcgs h-32-1KvNA1yjmi" style="margin-left: 12px;height: 24px;" data-user="${item.person.id}">生成迭代报告</button>` : ''}
          </p>
            ${additionLines}
        `;
                div.innerHTML = innerHTML;
                tabsWrapper.append(div)
                $(li).appendTo(ul);
            })
            $('div[class^="page-container-"]').parent().append(tabsWrapper)
            $('._week_report').click(async (event) => report_by_time()(event))
            $('._all_report').click(async (event) => report_by_time('all')(event))
            // const img = document.createElement('img');
            // img.src = `https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3ca7fba5-3cfa-402c-aaec-2b3e431e262d/226c3600-5069-429d-95be-79bce56a1796.png`;
            // tabsWrapper.append(img)
            // tabsWrapper.append($('div[class^="page-container-"]').parent())
            // $(function () {
            $(`#${ID_VALUE}`).tabs({
                collapsible: true
            });
            try {
                $('#coco-tabs > ul > li').on('contextmenu', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.target.click();
                    switchPerson($(event.target)[0].innerText.replace(/(.+)\(.+/, '$1'), !$(event.target).parent().hasClass('ui-state-active'))
                })
            } catch (e) {
            }
            var x = 15;
            var y = -40;
            $(".coco-info-icon").mouseover(function (e) {
                this.myTitle = `
<div>1.使用者需拥有共享成员所在项目的权限</div>
<div>2.共享成员的多个冲刺的时间差不高于7天</div>
        `;
                this.title = "";
                var tooltip = "<div class='coco-tooltip'>" + this.myTitle + "</div>"; //创建 div 元素
                $("body").append(tooltip);	//把它追加到文档中
                $(".coco-tooltip")
                    .css({
                        "top": (e.pageY + y) + "px",
                        "left": (e.pageX + x) + "px"
                    }).show("fast");	  //设置x坐标和y坐标，并且显示
            }).mouseout(function () {
                this.title = this.myTitle;
                $(".coco-tooltip").remove();   //移除
            }).mousemove(function (e) {
                $(".coco-tooltip")
                    .css({
                        "top": (e.pageY + y) + "px",
                        "left": (e.pageX + x) + "px"
                    }).show("fast");
            });
            // });
            // tableDom.parentNode.insertBefore(document.createElement('div'), tableDom)
        }, 200)
    }


    /**
     * 左上角图标转圈圈
     */
    function hackLiYang() {
        try {
            // Array.from($('img')).forEach(el => {
            //   el.src = `https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3ca7fba5-3cfa-402c-aaec-2b3e431e262d/226c3600-5069-429d-95be-79bce56a1796.png`;
            //   const style = {
            //     animationName: 'loadingCircle',
            //     animationDuration: '1s',
            //     animationIterationCount: 999999,
            //     animationDelay: '1.2s',
            //   }
            //   Object.entries(style).forEach(([name, value]) => el.style[name] = value)
            // })
            const el = $('a[class^="enterprise-trigger-logo-"] > img')[0];
            //if (store.project && store.project.name === "ziyoumokuaiyouhua") {
            //el.src = `https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3ca7fba5-3cfa-402c-aaec-2b3e431e262d/226c3600-5069-429d-95be-79bce56a1796.png`;
            //}
            const style = {
                animationName: 'loadingCircle',
                animationDuration: '1s',
                animationIterationCount: 999999,
                animationDelay: '1.2s',
            }
            Object.entries(style).forEach(([name, value]) => el.style[name] = value)
        } catch (e) {

        }
    }


    /**
     * 史诗下所有事项（故事 + 子任务）
     * @param epicCode
     * @returns {Promise<unknown>}
     */
    function fetchEpicIssues(epicCode) {
        const url = `https://wydevops.coding.net/api/project/${store.project.id}/issues/epics/${epicCode}/issues`;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                data: {},
                type: "get",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                success: function ({data}) {
                    //console.log(data)
                    resolve(data)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(arguments)
                    reject(errorThrown)
                }
            });
        })
    }

    /**
     * 事项详情
     * @param code
     * @returns {Promise<unknown>}
     */
    function fetchIssuesDetail(code) {
        const url = `https://wydevops.coding.net/api/project/${store.project.id}/issues/${code}?withDescriptionMarkup=false`;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                data: {},
                type: "get",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                success: function ({data}) {
                    //console.log(data)
                    resolve(data)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(arguments)
                    reject(errorThrown)
                }
            });
        })
    }

    function report_by_time(type = 'week') {
        return async function (event) {
            event.target.innerText = '请稍后';
            event.target.disabled = 'disabled';
            const userId = event.target.dataset.user;
            console.log(event.target.dataset.user, store.story);
            let allSubTasks = [];
            store.story.forEach(item => {
                allSubTasks = [...allSubTasks, ...(item.subTasks.map(item1 => ({
                    ...item1,
                    module: (item.module && item.module.id) ? item.module : {
                        id: 999999,
                        name: "🈚️模块",
                    },
                    story: {code: item.code, name: item.name, priority: item.priority, ...item}
                })))]
            })
            console.log(allSubTasks);
            let processingTasks = allSubTasks.filter(item => item.assignee && (item.assignee.id == userId));
            if (type === 'week') processingTasks = processingTasks.filter(item => item.issueStatus.type !== 'TODO')
            const codes = processingTasks.map(item => item.code);
            const weekly_tasks = [];
            for (const code of codes) {
                const subTaskLogs = await subTaskDetail(code);
                const _logs = subTaskLogs.filter(item => item.issueLog && item.issueLog.target === 'STATUS')
                const log = _logs[_logs.length - 1];

                if (type === 'week') {
                    const time = new Date(log.createdAt)
                    if (Utils.isCurrentWeek(time)) {
                        weekly_tasks.push(processingTasks.find(item => item.code === code))
                    }
                } else {
                    weekly_tasks.push(processingTasks.find(item => item.code === code))
                }
            }
            // const epicMap = {};
            // weekly_tasks.forEach(item => {
            //   epicMap[item.epic.code] = epicMap[item.epic.code] || [];
            //   epicMap[item.epic.code].push(item)
            // })
            // const groupByEpic = Object.entries(epicMap).map(([epicCode, tasks]) => ({...tasks[0].epic, tasks}))
            const getCustomFieldsValue = (customeFileds = {}, name) => {
                const field = store.fileds.find(item => item.name === name);
                if (!field) return '';
                const fieldOptions = field.options || [];
                const fieldNameMap = fieldOptions.reduce((prev, curr) => {
                    prev[curr.id] = curr.name;
                    return prev;
                }, {})
                const key = String(field.issueFieldId);
                try {
                    for (const [k, v] of Object.entries(customeFileds)) {
                        if (String(k) === key) {
                            if (v instanceof Array) {
                                return v.map(item => fieldNameMap[name]).join(',');
                            } else {
                                return fieldNameMap[v];
                            }
                        }
                    }
                } catch (e) {
                    return ''
                }
            }
            const moduleMap = {};
            weekly_tasks.forEach(item => {
                const moduleName = getCustomFieldsValue(item.story ? item.story.customFields: item.customFields, '所属项目');
                // const _nameMatches = /【(.+?)】/.exec(item.story.name);
                // const moduleName = _nameMatches.length > 0 ? _nameMatches[1] : '未知';
                item.moduleName = moduleName;
                moduleMap[moduleName] = moduleMap[moduleName] || [];
                moduleMap[moduleName].push(item)
            })
            const groupByModule = Object.entries(moduleMap).map(([moduleName, tasks]) => ({moduleName, tasks}))
            console.log(groupByModule)
            let text = ``;
            for (let index in groupByModule) {
                const module = groupByModule[index];
                // 计算史诗进度 begin
                // const epicIssues = await fetchEpicIssues(epic.code);
                // const statData = {
                //   total: 0,
                //   curr: 0
                // }
                // for (const story of epicIssues) {
                //   const ownerTasks = story.subTasks.filter(task => task.issueTypeDetail.name === '子工作项' && task.assignee?.id == userId);
                //   console.log('ownerTasks:', ownerTasks)
                //   for (const task of ownerTasks) {
                //     const taskDetail = await fetchIssuesDetail(task.code);
                //     statData.total += taskDetail.workingHours;
                //     if (taskDetail.issueStatus.type === "COMPLETED") {
                //       statData.curr += taskDetail.workingHours;
                //     }
                //     console.log(taskDetail, statData.curr, statData.total)
                //   }
                // }
                // 计算史诗进度 end
                text += `<b style="font-weight: bold;">${Number(index) + 1}、${module.moduleName}</b>`
                text += `<ul>`
                module.tasks.forEach(task => {
                    text += `<li>
                  <a href="https://wydevops.coding.net/p/${store.project.name}/requirements/issues/${task.story.code}/detail" title="${task.story.name}">故事 ${task.story.code}</a>
                   / <a href="https://wydevops.coding.net/p/${store.project.name}/requirements/issues/${task.story.code}/detail/subissues/${task.code}">任务 ${task.code}</a>
                  ：${Utils.formatPriority(task.story.priority)}${task.name}（${task.workingHours}） <span style="color: red"> ${Utils.formatStatus(task.issueStatus.name)}</span>
                  </li>`
                });
                text += `</ul><br/>`;
            }
            event.target.innerText = type === 'week' ? '生成周报' : '生成迭代报告';
            event.target.removeAttribute('disabled')
            const MIMETYPE = "text/html";

            const data = [new ClipboardItem({[MIMETYPE]: new Blob([text], {type: MIMETYPE})})];
            navigator.clipboard.write(data).then(function () {
                alert("复制成功！去试试粘贴到Excel内吧～")
            }, function () {
                alert("不知道怎么回事，再试一次吧！")
                console.error("Unable to write to clipboard. :-(");
            });

        }
    }

    const FiberList = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40]

    function fiberMatch(number) {
        if (!number) return 0;
        const _number = number / 8;
        return FiberList.find(item => _number <= item);
    }

    // 设置故事点
    async function setStoryPoint(story, point) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://wydevops.coding.net/api/project/${store.project.id}/issues/requirements/${story}/fields`,
                data: {storyPoint: point},
                type: "PATCH",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                success: function ({data}) {
                    console.log(data)
                    resolve()
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(arguments)
                    reject(errorThrown)
                }
            });
        })
    }

    async function getMyProjectList() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://wydevops.coding.net/api/platform/project/recent/views/search?pmType=PROJECT&keyWord=`,
                data: {},
                type: "GET",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                success: function ({data}) {
                    store.projectList = data;
                    resolve()
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(arguments)
                    reject(errorThrown)
                }
            });
        })
    }

    async function getIterationsList(project) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://wydevops.coding.net/api/project/${project.id}/iterations?page=1&pageSize=100&keywords=&status=WAIT_PROCESS&status=PROCESSING&startDate=&endDate=&sortBy=CODE%3ADESC`,
                data: {},
                type: "GET",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                success: function ({data}) {
                    console.log('$iterations:', data);
                    project.$iterations = data.list;
                    resolve()
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(arguments)
                    reject(errorThrown)
                }
            });
        })
    }

    async function getFieldsList() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://wydevops.coding.net/api/project/${store.project.id}/issues/ITERATION_ISSUE/filters/more-fields`,
                data: {},
                type: "GET",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                success: function ({data}) {
                    console.log('$fields:', data);
                    store.fileds = data;
                    resolve()
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(arguments)
                    reject(errorThrown)
                }
            });
        })
    }

    // 创建 Fetch 请求拦截器对象
    const fetchInterceptor = {
        // 请求拦截
        request: function (url, options) {
            // 调用拦截回调函数，并传递请求参数
            // console.log('请求拦截:', url, options);

            // 修改请求参数示例
            // options.headers['Authorization'] = 'Bearer xxxxxxx';

            return [url, options];
        },

        // 响应拦截
        response: function (response) {
            // 调用拦截回调函数，并传递响应数据
            //console.log('响应拦截:', response);

            // 修改响应数据示例
            // var modifiedResponse = { status: 200, data: 'Modified response' };
            // return Promise.resolve(new Response(JSON.stringify(modifiedResponse), response));

            return response;
        }
    };

    const __fetch = window.fetch;
    // 重写 Fetch API 的 fetch 方法
    window.fetch = function () {
        const args = arguments;
        const url = args[0];
        const options = args[1];

        // 调用请求拦截回调函数
        const interceptedRequest = fetchInterceptor.request(url, options);

        // 发起原始的 Fetch 请求
        return __fetch.apply(this, interceptedRequest)
            .then(function (response) {
                // 调用响应拦截回调函数
                return fetchInterceptor.response(response);
            });
    };


    // 创建拦截器对象
    const interceptor = fetchInterceptor;

    // 请求拦截
    interceptor.request = function (url, options) {

        if (options.method === 'PATCH') {
            console.log('自定义请求拦截:', url, options);
        }
        return [url, options];
    };

    // 响应拦截
    interceptor.response = function (response) {

        if (response.url.endsWith("/fields") || response.url.endsWith("join/iteration")) {
            rerender();
        }
        //  console.log(response, document.cookie)
        if (response.url.endsWith('platform/user/current')) {
            console.log(response, document.cookie)
        }
        // 修改响应数据示例
        var modifiedResponse = {status: 200, data: 'Modified response'};
        return response;
    };


    let _i1, _i2;

    function switchPerson(personName = "崔启蒙", onlyClear = false) {
        console.log("switchPerson", personName)
        _i1 && clearInterval(_i1)
        _i2 && clearInterval(_i2)
        try {
            // const $DropDown = $($('div[class^="filter-bar-section-"]').find('div[class^="dropdown-"]')[2]);
            const $DropDown = $($($('div[class^="filterAttrs-"]').find('span[class="filterFixedItem"]'))[1]);
            $DropDown.find('div[class^="trigger-"]')[1].click();
            // $DropDown[0].style.visibility = 'hidden'
            _i1 = setInterval(() => {
                if (!$DropDown.find('div[class^="newfilter-dropdown panel-"]').length) {
                    $DropDown.find('div[class^="trigger-"]')[1].click();
                    return
                }
                const $Panel = $DropDown.find('div[class^="newfilter-dropdown panel-"]');
                // $Panel.hide();
                if ($Panel.find('div[class^="side-operation-"]').find('span[class^="clear-button-"]').length) {
                    // console.log($Panel, $Panel.find('div[class^="clear-button-"]').length, $Panel.find('div[class^="clear-button-"]')[0])
                    $Panel.find('div[class^="side-operation-"]').find('span[class^="clear-button-"]')[0].click();
                }
                clearInterval(_i1);
                if (onlyClear) {
                    document.body.click()
                    return;
                }
                const $Input = $Panel.find('input')[0];
                const _key = Object.keys($Input).find(key => key.startsWith('__reactInternalInstance'));
                $Input[_key].memoizedProps.onChange({target: {value: personName}})
                _i2 = setInterval(() => {
                    if ($Panel.find('div[class^="item-"]').length !== 1) return
                    $Panel.find('div[class^="item-"]').click()
                    clearInterval(_i2);
                    setTimeout(() => {
                        document.body.click()
                    }, 80)
                }, 100)
            }, 150)
        } catch (e) {

        }
    }

    // 这里是kubesphere的生产环境标识
    const i = setInterval(() => {
        if (!document.querySelector('#root > div > div > a')) {
            return;
        }
        clearInterval(i)
        document.querySelector('#root > div > div > a').innerHTML += `<span style="
  position: absolute;
  left: calc(50% - -79px);
  top: 6px;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  padding: 4px 10px;
  background: red;
  border-radius: 12px;
  animation: liuquan 1.6s infinite;
">生产环境</span>`
    }, 200)


    function 大爷让我加的需求() {
        try {
            if (!$('.daye').length && store.project.name) {
                const wrapper = $('#layout > aside div.layout-sider-content-3--_1GXfMA > div.layout-sider-menu-list-2uEqjcLrKw > div:nth-child(1) > div > a:nth-child(4)');
                wrapper.parent().append(`<a href="/p/${store.project.name}/releases" class="daye layout-menu-3WFaMkjTrU" data-code="PROJECT_BUG">
<div class="layout-menu-wrap-2CsF_0f6Mi">
<span class="ant-badge badge-onAOhHP1W_"><img src="/micro-frontend/layout/static/team/all-artifacts.svg" class="menu-icon-cgCSmHHLei"></span>
<div class="menu-name-wrap-39B9VHvnAH"><span class="menu-name-aUEf_zcSi5">版本</span><div class="menu-tags-26-9VwO6r8"></div></div>
</div>
</a>`)
                wrapper.parent().append(`<a href="/p/${store.project.name}/epics/issues" class="daye layout-menu-3WFaMkjTrU" data-code="PROJECT_EPIC">
<div class="layout-menu-wrap-2CsF_0f6Mi">
<span class="ant-badge badge-onAOhHP1W_"><img src="/micro-frontend/layout/static/project/appops.svg" class="menu-icon-cgCSmHHLei"></span>
<div class="menu-name-wrap-39B9VHvnAH"><span class="menu-name-aUEf_zcSi5">史诗</span><div class="menu-tags-26-9VwO6r8"></div></div>
</div>
</a>`);
                wrapper.parent().append(`<a href="/p/${store.project.name}/bug-tracking/issues" class="daye layout-menu-3WFaMkjTrU" data-code="PROJECT_BUG">
<div class="layout-menu-wrap-2CsF_0f6Mi">
<span class="ant-badge badge-onAOhHP1W_"><img src="/micro-frontend/layout/static/project/appops.svg" class="menu-icon-cgCSmHHLei"></span>
<div class="menu-name-wrap-39B9VHvnAH"><span class="menu-name-aUEf_zcSi5">缺陷</span><div class="menu-tags-26-9VwO6r8"></div></div>
</div>
</a>`)
            }
        } catch (e) {

        }

    }

})();

