// ==UserScript==
// @name              nativeads-render 调试工具
// @namespace         https://github.com/Peter-WF/render-tool
// @version           0.0.19
// @icon              https://www.baidu.com/favicon.ico
// @description       otp render dev tool
// @require           https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @match             *://otp.baidu.com/admin/homepage/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/372682/nativeads-render%20%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/372682/nativeads-render%20%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

$(function () {
    setTimeout(async function () {
        await inject()
    }, 1000)
    window.addEventListener('hashchange', function () {
        if (/\#\/my_env\/detail\/(\d*)/.test(location.hash)) {
            setTimeout(async function () {
                await inject()
            }, 1000)
        }
    })
})

async function inject() {
    const otpInfoCard = $('md-tabs-content-wrapper md-tab-content').eq(0)
    const otpInfo = await init(otpInfoCard)
    showDebugInfo({
        otpInfoCard,
        url: otpInfo.url,
        ip: otpInfo.ip,
        port: otp.port,
        type: otp.type
    })
    if (otp.type === 'render') {
        showRenderLog({
            ip: otpInfo.ip,
            port: otp.port
        })
    }
}

async function init(container) {
    const otpId = location.hash.match(/\#\/my_env\/detail\/(\d*)/)[1]
    const otpInfo = await getOtpInfo(otpId)
    otpInfo.type = getOtpType(container)
    initHandle(otpInfo.type)
    injectCss()
    cleanLog()
    return window.otp = otpInfo
}

function getOtpType(container) {
    // otp 对应关系
    const typeMap = {
        afd: '.nativeads-afd.otp.baidu.com',
        render: '.nativeads-render.otp.baidu.com'
    }

    // 获取当前 otp 类型
    return Object.keys(typeMap).find(item => {
        return container[0].innerText.includes(typeMap[item])
    })
}

function initHandle(type) {
    if (type === 'render') {
        $('body').on('click', '#copyRenderCommonBtn', function () {
            var ipPortText = $('#renderCommonText')[0]
            ipPortText.focus()
            ipPortText.select()
            document.execCommand('copy')
        }).on('click', '#copyBtn', function () {
            var ipPortText = $('#ipPortText')[0]
            ipPortText.focus()
            ipPortText.select()
            document.execCommand('copy')
        }).on('dblclick', '.J-render-log-card', function (event) {
            if ($(event.target).hasClass('J-render-log-card')) {
                $(event.target).toggleClass("active");
            } else {
                $(event.target).parents('.J-render-log-card').toggleClass("active");
            }
        }).on('click', '.J-render-log-card-switch', function (event) {
            $(event.target).parents('.J-render-log-card').toggleClass("active");
        }).on('click', '.J-clear-log', function () {
            cleanLog()
        }).on('keydown', function (event) {
            if (event.metaKey && event.keyCode === 75) {
                cleanLog()
            }
        }).on('click', '#restart', function () {
            $('#restartProgress').show()
            $('#restart').hide()
            $('#restartMessage').hide()
            const {ip, port} = window.otp
            const restartUrl = `http://${ip}:${port + 5}/forever/restart/0`;
            $.ajax({
                url: restartUrl,
                dataType:'jsonp'
            }).then(res => {
                if(res.success){
                    $('#restart').show()
                    $('#restartProgress').hide()
                    $('#restartMessage').show()
                }
            })
        })
    } else {
        $('body').on('click', '#gdCommandBtn', function () {
            var gdCommandText = $('#gdCommandText')[0]
            gdCommandText.focus()
            gdCommandText.select()
            document.execCommand('copy')
        })
    }
}

function getOtpInfo(otpId) {
    return $.ajax({
        url: `http://otp.baidu.com/control/getexpandmenuinfo?expandMenuId=${otpId}`
    }).then(res => {
        res = JSON.parse(res)
        return {
            url: res.data[0].containerInfo.url,
            ip: res.data[0].containerInfo.ip,
            port: res.data[0].containerInfo.portInfo && JSON.parse(res.data[0].containerInfo.portInfo).allocatedInfo[0].port
        }
    })
}

/**
 * 显示 chrome 在线调试
 * @param otpInfoCard
 * @param url
 * @param ip
 * @param port
 * @param type
 */
function showDebugInfo({otpInfoCard, url, ip, port, type}) {
    const debugUrl = `http://${ip}:${port + 5}/inspect`;
    const restartUrl = `http://${ip}:${port + 5}/forever/restart/0`;
    const coverUrl = `http://${ip}:${port + 5}/coverage`;

    // 不同 otp 模板不同
    const tplMap = {
        render: `
    <div layout="row" layout-xs="column" class="info-row layout-xs-column layout-row">
      <div flex-gt-xs="100" layout="row" class="layout-row flex-gt-xs-100">
        <div flex="20" class="flex-20"><md-icon class="material-icons">language</md-icon> 域名+端口:</div>
        <div style="" flex="80" class="flex-80">
            <textarea id="ipPortText" style="width: 315px;height: 23px;">${ip}:${port}</textarea>
            <button id="copyBtn">复制</button> 
        </div>
      </div>
    </div>
    <div layout="row" layout-xs="column" class="info-row layout-xs-column layout-row">
      <div flex-gt-xs="100" layout="row" class="layout-row flex-gt-xs-100">
        <div flex="20" class="flex-20"><md-icon class="material-icons">language</md-icon> render common 地址:</div>
        <div style="" flex="80" class="flex-80">
            <textarea id="renderCommonText" style="width: 315px;height: 23px;">http://${ip}:${port}/common</textarea>
            <button id="copyRenderCommonBtn">复制</button> 
        </div>
      </div>
    </div>
    <div layout="row" layout-xs="column" class="info-row layout-xs-column layout-row">
      <div flex-gt-xs="100" layout="row" class="layout-row flex-gt-xs-100">
        <div flex="20" class="flex-20"><md-icon class="material-icons">info</md-icon> 在线调试:</div>
        <div style="color:rgb(255, 64, 129)" flex="80" class="flex-80">
            <a href="${debugUrl}" target="_blank" style="margin-right: 5px;">${debugUrl}</a>
            <a href="http://wiki.baidu.com/pages/viewpage.action?pageId=500238055" style="text-decoration: none;border: none;" target="_blank">
                <md-icon class="material-icons">help</md-icon>
            </a>
        </div>
      </div>
    </div>
    <div layout="row" layout-xs="column" class="info-row layout-xs-column layout-row">
      <div flex-gt-xs="100" layout="row" class="layout-row flex-gt-xs-100">
        <div flex="20" class="flex-20"><md-icon class="ng-scope material-icons">code</md-icon> 查看代码覆盖率:</div>
        <div style="color:rgb(255, 64, 129)" flex="80" class="flex-80">
            <a href="${coverUrl}" target="_blank" class="ng-binding">${coverUrl}</a>
        </div>
      </div>
    </div>
    <div layout="row" layout-xs="column" class="info-row layout-xs-column layout-row">
      <div flex-gt-xs="100" layout="row" class="layout-row flex-gt-xs-100">
        <div flex="20" class="flex-20"><md-icon class="ng-scope material-icons">autorenew</md-icon> 重启:</div>
        <div style="color:rgb(255, 64, 129)" flex="80" class="flex-80">
            <button id="restart">立即重启</button> 
            <div id="restartProgress" class="restartProgress">
              <md-progress-circular md-mode="indeterminate" aria-valuemin="0" aria-valuemax="100" role="progressbar" class="ng-scope" style="width: 50px; height: 50px;"><div class="md-scale-wrapper md-mode-indeterminate" style="transform: translate(-50%, -50%) scale(0.5);"><div class="md-spinner-wrapper"><div class="md-inner"><div class="md-gap"></div><div class="md-left"><div class="md-half-circle"></div></div><div class="md-right"><div class="md-half-circle"></div></div></div></div></div></md-progress-circular>
            </div>
            <span id="restartMessage" class="restartMessage">重启成功</span>
        </div>
      </div>
    </div>
    `,
        afd: `
        <div layout="row" layout-xs="column" class="info-row layout-xs-column layout-row">
          <div flex-gt-xs="100" layout="row" class="layout-row flex-gt-xs-100">
            <div flex="20" class="flex-20"><md-icon class="material-icons">domain</md-icon> 配置中心:</div>
            <div style="" flex="80" class="flex-80">
              <a href="${url}/test/conf" target="_blank" class="ng-binding">${url}/test/conf</a>
            </div>
          </div>
        </div>
        <div layout="row" layout-xs="column" class="info-row layout-xs-column layout-row">
          <div flex-gt-xs="100" layout="row" class="layout-row flex-gt-xs-100">
            <div flex="20" class="flex-20"><md-icon class="material-icons">tv</md-icon> 关闭 GD 渠道命令:</div>
            <div style="" flex="80" class="flex-80">
                <textarea id="gdCommandText" style="width: 315px;height: 23px;">afd_deploy -g False</textarea>
                <button id="gdCommandBtn">复制</button> 
            </div>
          </div>
        </div>
        `
    }
    otpInfoCard.find('md-content>div').eq(5).after(tplMap[type])
}

function showRenderLog({ip, port}) {
    const ioObj = new io(`http://${ip}:${port + 1}`, {
        reconnection: false,
        autoConnect: false
    });

    ioObj.open();

    const timeSign = moment().format('x');
    const appLogEventID = `appLog#${timeSign}`;
    const wfLogEventID = `wfLog#${timeSign}`;
    const appLogOpt = {
        'name': 'app',
        'eventID': appLogEventID
    };
    const wfLogOpt = {
        'name': 'app-wf',
        'eventID': wfLogEventID
    };

    ioObj.emit('tail', appLogOpt);
    ioObj.emit('tail', wfLogOpt);

    ioObj.on(appLogEventID, (log) => logRender(log));

    ioObj.on(wfLogEventID, (log) => logRender(log, true))
}

function logRender(log, isError) {
    log.split('\n').forEach(item => {
        if (item) {
            const logInfo = formatBaseInfo(item)
            $('#render-log-container').append(`
            <div class="render-log-card J-render-log-card  ${isError ? 'error-log' : ''}">
                <div class="card-title">${logInfo.time} : ${logInfo.description}</div>
                ${logInfo.json ? '<code class="card-content">' + JSON.stringify(logInfo.json, '', 4) + '<em class="render-log-card-switch J-render-log-card-switch"></em></code>' : ''}
            </div>`)
        }
    })
    // 收到消息后默认滚动到底部
    const $mainContent = $('#mainContent')
    $mainContent.parent()[0].scrollTop = $mainContent.parent()[0].scrollHeight
}

/**
 * 格式化基础信息
 * 1. 请求时间
 * 2. 描述信息
 * 3. json
 * 2. 来源（eid、cpid）。ASP、天路、GD、DSP
 * 3. mtId、srcId/placeId
 */
function formatBaseInfo(logString) {
    console.log(logString)
    const reg = /(?:WARNING|NOTICE): (.*) \[\-\:\-\] errno\[0\].*custom\[-\]([^\{]*)((\{.*)])?$/
    const matchArr = logString.match(reg)
    // 请求时间
    const time = matchArr[1]
    // 描述信息
    const description = matchArr[2].trim() || '无描述信息'
    // 解析 json
    let json;
    if (matchArr[4]) {
        try {
            json = JSON.parse(matchArr[4] || {})
        } catch (e) {
            json = (new Function(`retrurn ` + matchArr[4]))()
        }
    }
    return {
        time,
        description,
        json
    }
}

function cleanLog() {
    $('md-pagination-wrapper md-tab-item').last().find('.ng-scope').html('实时日志')
    $('md-tabs-content-wrapper md-tab-content').last().html('<div id="render-log-container"><button class="clear-log J-clear-log">清除日志(⌘ + K)</button></div>')
}

function injectCss() {
    $('head').append(`<style>
    .doc-content, .layout-content{
        max-width: none;
    }
    
    #render-log-container{
        min-height: 500px;
    }
    
    .clear-log {
        width: 400px;
        margin: 10px auto;
        display: block;
    }
    
    .render-log-card {
        font-size: 14px;
        margin: 10px;
        padding: 10px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.50);
        text-overflow: ellipsis;
        overflow: hidden;
        position: relative;
    }
    
    .card-title {
        margin-bottom: 10px;
    }
    
    .render-log-card code {
        white-space: nowrap;
        color: green;
    }
    
    .render-log-card .render-log-card-switch {
        font-style: normal;
    }
    
    .render-log-card .render-log-card-switch:after{
        content: '+';
        font-size: 20px;
        position: absolute;
        right: 10px;
        top: 0;
        cursor: pointer;
        padding: 5px;
    }
    
    .render-log-card.active code {
        white-space: pre-wrap;
    }
    
    .render-log-card.active .render-log-card-switch:after{
        content: '-';
        color: red;
    }
    
    .render-log-card.error-log .card-title{
        color: red;
    }
    
    .render-log-card.error-log code{
        color: red;
    }
    
    .restartProgress {
      display: none;
    }
    
    .restartMessage {
      display: none;
    }
    
    </style>`)
}
