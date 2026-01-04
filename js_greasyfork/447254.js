// ==UserScript==
// @name         DuTimeRecord Helper
// @namespace    https://github.com/xiaobutiaoer
// @version      2.0
// @description  控制台打印任务进度
// @author       Mengnan
// @match        https://iwork-rdc.shizhuang-inc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447254/DuTimeRecord%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/447254/DuTimeRecord%20Helper.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // 常量获取
    const RDC_TOKEN = localStorage.rdc_token
    // 当前 versionID
    let href = location.href
    let [projectId, versionId, userId] = href.match(/\d+/g)

    // 封装fetch
    const request = (url, opt = {}) => {
        let defaultOpt = {
            method: 'GET',
            headers: {
                Authorization: RDC_TOKEN
            }
        }
        return new Promise(async (rs, rj) => {
            fetch(url, {
                ...defaultOpt,
                ...opt
            }).then(res => res.json()).then(res => rs(res.data)).catch(err => rj(err))
        })
    }


    // 获取负责人列表
    // let chargePeople = request('https://iwork-rdc.shizhuang-inc.com/iwork-rdc/rdc/api/user/search?group=true')

    // 获取当前版本
    // let getCurVersion = request(`https://iwork-rdc.shizhuang-inc.com/iwork-rdc/rdc/api/project/${PROJECT_ID}`)

    // 获取当前用户

    let getTimeRecordData = () => {
        request('https://iwork-rdc.shizhuang-inc.com/iwork-rdc/rdc/api/user/currentUser').then(({ user_id }) => {
            // &sub_leader_ids=${userData.user_id}
            request(`https://iwork-rdc.shizhuang-inc.com/iwork-rdc/rdc/api/process/task/process/list_data?show_mode=plan&type=process&project=${versionId}&user_ids=${user_id}`).then(res => {
                const { process_data } = res
                let dataSource = []
                process_data.forEach(({ display_name, process_list = [] }) => {
                    let work_time = 0
                    let time_str = ''

                    process_list.forEach(({name = '', finish_work_time = 0, plan_work_time = 0}) => {
                        time_str += `${name?.match(/【.*】/)}: ${finish_work_time}    `
                        if (plan_work_time !== 0) {
                            work_time = plan_work_time
                        }
                    })
                    dataSource.push({
                        '任务名称': display_name,
                        '实际耗时': time_str,
                        '估时': work_time
                    })

                })
                console.clear()
                console.table(dataSource, ['任务名称', '估时', '实际耗时'])
            })
        })
    }

    getTimeRecordData()

    window.addEventListener('replaceState', function(e) {

        if (location.href !== href) {
            href = location.href
            let params = location.href.match(/\d+/g)
            if ((params[0] !== projectId || params[1] !== versionId) && projectId && versionId) {
                projectId = params[0]
                versionId = params[1]
                getTimeRecordData()
            }
        }

    });

})();