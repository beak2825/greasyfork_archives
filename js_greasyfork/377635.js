// ==UserScript==
// @name              render-release-tool
// @version           0.0.18
// @icon              https://www.baidu.com/favicon.ico
// @description       render 上线工具
// @require           https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @match             *://orp.baidu.com/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/216399
// @downloadURL https://update.greasyfork.org/scripts/377635/render-release-tool.user.js
// @updateURL https://update.greasyfork.org/scripts/377635/render-release-tool.meta.js
// ==/UserScript==

const config = {
    host: 'http://cp01-ywrd-adstyle-01.epc.baidu.com:8400',
    imTo: 1674687
    //host: 'http://local.baidu.com:4000'
}

// 本次上线信息

const orpInfo = {
    module: {}
}

$(async function () {
    autoFill()
    initEvent()
    addQuickLink()
    await addHiLog()

    async function circulation() {
        await addHiLog()
        await delay(2000)
        await circulation()
    }

    await circulation()
})

function autoFill() {
    const fillMap = {
        '/operationmenuui/viewcreatemenu': function () {
            $('#menuName').val(getNowDate() + '-render上线')
        },
        '/operationmenuui/editmenu': function () {
            $('#singleIdc').val('jx')
            $('#sideIdc').val('jx')
            $('[name=allidc]').eq(1).click()
            $('#poling').val('5')
            $('#roll_concurrence_percent').val('5')
        }
    }
    Object.keys(fillMap).find(item => {
        if (window.location.href.includes(item)) {
            fillMap[item]()
            return true
        }
    })
}

function initEvent() {
    $('body').on('click', '#copyHiLog', function () {
        const hiLog = $('#hiLogText')[0]
        hiLog.focus()
        hiLog.select()
        document.execCommand('copy')
    }).on('click', '#sendLog', async function () {
        $(this).attr('disabled', 'disabled')
        const $sendHiLogMessage = $('#sendHiLogMessage').hide()
        const hiLog = $('#hiLogText').val()
        const imTo = $('#imTo').val()
        await sendHiLog(hiLog, imTo)
        $(this).removeAttr('disabled')
        $sendHiLogMessage.show()
    }).on('click', '#sendScreenshot', async function () {
        $(this).attr('disabled', 'disabled')
        const $sendScreenshotMessage = $('#sendScreenshotMessage').hide()
        const cmatchs = $('#cmatchText').val().split(',')
        const imTo = $('#imTo').val()
        const errorCmatchList = []
        for (let i = 0; i < cmatchs.length; i++) {
            const res = await sendScreenshot(cmatchs[i], imTo)
            if (!res.success) {
                errorCmatchList.push(cmatchs[i])
            }
        }

        await sendErrorMonitor(imTo)

        if (errorCmatchList.length) {
            $sendScreenshotMessage.html(`除[${errorCmatchList.join(', ')}]外均成功`)
        }

        $(this).removeAttr('disabled')
        $sendScreenshotMessage.show()
    }).on('click', '.J-send-module-message', async function () {
        if (confirm('确认将发送至 render 上线值班群 1564712 么？')) {
            const user = $('.dropdown-toggle[href="/user/my"]').text().trim()

            let hiLog = `HiRobot
【Render】上线单已创建完毕, 辛苦大家 check
【触发人】${user}
【上线wiki】http://wiki.baidu.com/display/nativeads/${getNowDate()}
        `

            Object.keys(orpInfo.module).forEach(module => {
                const branch = orpInfo.module[module].branch
                hiLog += `
【${module}】此次上线分支 ${branch}
【检查是否同步主干】http://icode.baidu.com/repos/baidu/render/${module}/merge/${module}_${branch}_BRANCH...master
【Diff】http://icode.baidu.com/repos/baidu/render/${module}/merge/master...${module}_${branch}_BRANCH
            `
            })

            await sendHiLog(hiLog, 1564712)
        }
    })
}

// 支持链接补全, 加上跳转链接, 方便直达
function addQuickLink() {
    const fillMap = {
        '/operationmenuui/menuinfo': function () {
            const container = $('#appdetail').find('table')[0]
            container.innerText.replace(/baidu\/render\/([^\t\n]*)\t([^\t\n]*)/g, function (origin, project, version) {
                const branch = version.split('.').slice(0, -1).join('-')
                // 上线信息收集
                orpInfo.module[project] = {
                    branch
                }
                container.innerHTML = container.innerHTML.replace(`baidu/render/${project}`,
                    `baidu/render/${project}
                     <br>（
                     <a href="http://icode.baidu.com/repos/baidu/render/${project}/merge/${project}_${branch}_BRANCH...master" target="_blank">是否同步主干?</a>
                     ，
                     <a href="http://icode.baidu.com/repos/baidu/render/${project}/merge/master...${project}_${branch}_BRANCH" target="_blank">确认上线代码是否符合预期?</a>
                     ）
                `)
            })
            container.innerText.replace(/模块信息/g, function () {
                container.innerHTML = container.innerHTML.replace(`模块信息`,
                    `模块信息（<a href="###" class="J-send-module-message">发送至 Hi-1564712 群</a>）
                `)
            })
        }
    }
    Object.keys(fillMap).find(item => {
        if (window.location.href.includes(item)) {
            fillMap[item]()
            return true
        }
    })
}

function getOrpInfo(menuId, productId = 769) {
    return $.ajax({
        url: `http://orp.baidu.com/operationui/browse/newoperationdetail`,
        method: 'post',
        data: {
            menuId,
            productId
        }
    }).then(res => {
        res = JSON.parse(res)
        if (res.errno === 0) {
            const stageStatus = res.data.stageStatus
            return {
                prepare: stageStatus.prepare,
                staticSide: stageStatus.staticSide,
                preview: stageStatus.preview,
                single: stageStatus.single,
                tcSide: stageStatus.tcSide,
                jxSide: stageStatus.jxSide,
            }
        }
    })
}

async function sendHiLog(content, imTo) {
    return $.ajax({
        url: `${config.host}/api/sendMessage`,
        method: 'post',
        data: {
            content,
            imTo: imTo || config.imTo
        }
    })
}

async function sendScreenshot(cmatch, imTo) {
    return $.ajax({
        url: `${config.host}/api/sendDashboard`,
        method: 'post',
        xhrFields: {
            withCredentials: true
        },
        data: {
            cmatch,
            imTo: imTo || config.imTo
        }
    })
}

// 发送 fatal 截图
async function sendErrorMonitor(imTo) {
    return $.ajax({
        url: `${config.host}/api/sendErrorMonitor`,
        method: 'post',
        xhrFields: {
            withCredentials: true
        },
        data: {
            imTo: imTo || config.imTo
        }
    })
}

async function addHiLog() {
    if (location.href.includes('/operationmenuui/menuinfo?menuId=')) {
        const menuInfo = await getMenuInfo()
        const orpInfo = await getOrpInfo(menuInfo.id)
        if (orpInfo) {
            let $hiLog = $('#hiLog')
            if ($hiLog.length === 0) {
                const tpl = `
                    <label>
                       请输入 hi 群号: 
                       <input id="imTo" value="1564712" placeholder="默认发送至 1674687" style="border:1px solid #ccc;width: 150px;height: 50px;margin-right: 10px;padding: 4px 6px;border-radius: 4px;"/>
                    </label>
                    <div id="hiLog">
                       <textarea id="hiLogText" style="width: 565px;height: 200px;margin-right: 10px;"></textarea>
                       <input id="copyHiLog" class="btn btn-default" type="button" value="复制">                                     
                       <input id="sendLog" class="btn btn-default" type="button" value="直接发送到 hi">    
                       <span id="sendHiLogMessage" style="display: none">发送成功</span>                                 
                    </div>
                    <br>
                    <div id="cmatch">
                       <input id="cmatchText" placeholder="请填写此次上线cmatch, 以逗号分割" style="border:1px solid #ccc;width: 565px;height: 50px;margin-right: 10px;padding: 4px 6px;border-radius: 4px;"/>
                       <input id="sendScreenshot" class="btn btn-default" type="button" value="监控截图发送到 hi">   
                       <span id="sendScreenshotMessage" style="display: none">发送成功</span>                                  
                    </div>
                `
                $hiLog = $(tpl)
                $hiLog.insertBefore('#bottomBtns')
            }
            // console.log(getHiLog(menuInfo.id, menuInfo.status, orpInfo[menuInfo.status]))
            $hiLog.find('#hiLogText').val(getHiLog(menuInfo.id, menuInfo.status, orpInfo[menuInfo.status]))
        }
    }
}

/**
 * 获取当前时间
 * @returns {string}
 */
function getNowDate() {
    const now = new Date()
    const year = now.getFullYear()
    const month = ('0' + (now.getMonth() + 1)).substr(-2)
    const date = ('0' + now.getDate()).substr(-2)
    return `${year}-${month}-${date}` // '2018-12-15'
}

async function getMenuInfo() {
    const $statusEl = $('[data-stagename]')
    if ($statusEl.length) {
        let status = null
        $statusEl.each((index, item) => {
            const $item = $(item)
            // processid 最先的 0 代表其上一个尚未结束, 也即是上上一个已经结束
            if ($item.attr('data-processid') === '0') {
                if (index <= 2) {
                    status = 'prepare'
                } else {
                    status = $statusEl.eq(index - 2).data('stagename')
                }
                return false
            }
        })

        if (!status) {
            // 遍历后发现 processid 均不为 0 , 则判断当前是否是全量完毕
            // 判断按钮是否是 disabled
            if ($('[data-stagename]').last().find('.btn-default.disabled').length) {
                status = 'jxSide'
            } else {
                status = 'tcSide'
            }
        }

        return {
            id: location.href.match(/menuId=(\d*)/)[1],
            status: status
        }
    } else {
        await delay(500)
        return getMenuInfo()
    }
}

async function delay(sec) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, sec)
    })
}

function getHiLog(id, process, {startTime, endTime}) {
    if (startTime && endTime) {
        const processMap = {
            prepare: {
                name: '准备中'
            },
            staticSide: {
                name: '静态资源服务器',
            },
            preview: {
                name: '预览机',
                stay: '15min',
                others: '\n辛苦验证:\n\tnativeads-render-prev：tc-bac-orp-ecom-odp-67713.tc:8310/common'
            },
            single: {
                name: '单台',
                stay: '15min',
                others: '\n辛苦验证:\n\tnativeads-render：bjyz-bac-orp-feed-ads-75841.bjyz:8270/common\n\tnativeads-cover：bjyz-bac-orp-ecom-odp-63504.bjyz:8200/common'
            },
            tcSide: {
                name: '单边',
                stay: '45min'
            },
            jxSide: {
                name: '全量',
                stay: '60min'
            }
        }
        const $conatiner = $('#appdetail')
        const modules = $conatiner[0].innerText.match(/(?<=baidu\/render\/)([^\t\n]*)/g)

        return `【周知】${getNowDate()}-render上线
上线模块：
${modules && modules.join(',')}
上线单地址：http://orp.baidu.com/operationmenuui/menuinfo?menuId=${id}
酷贝地址：http://kubera.noah.baidu.com/kubera/fe/trend.php?nodeId=11442&name=afd_render_succ_rate&menuId=11442&type=3&chartId=
当前进度：${processMap[process].name}
开始时间：${moment(new Date(startTime * 1000)).format('HH:mm:ss')}
结束时间：${moment(new Date(endTime * 1000)).format('HH:mm:ss')}
${processMap[process].stay ? "停留时间：" + processMap[process].stay : ''}
${processMap[process].others ? processMap[process].others : ''}`
    }
}