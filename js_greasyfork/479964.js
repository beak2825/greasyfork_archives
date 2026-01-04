// ==UserScript==
// @name         TopCoder tests viewer
// @name:zh-CN   TopCoder tests viewer
// @namespace    https://github.com/platelett/script
// @version      0.1
// @description  After submitting on the TopCoder web client, you can see the details of the tests.
// @description:zh-CN 在 TopCoder 网页端提交后可以看到测试点详情。
// @author       platelet
// @match        https://arena.topcoder.com/*
// @icon         https://www.google.com/s2/favicons?domain=topcoder.com
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/479964/TopCoder%20tests%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/479964/TopCoder%20tests%20viewer.meta.js
// ==/UserScript==
var wsHook = {};

function loadWsHook(){
    /* wsHook.js
     * https://github.com/skepticfx/wshook
     * Reference: http://www.w3.org/TR/2011/WD-websockets-20110419/#websocket
     */

    (function () {
        // Mutable MessageEvent.
        // Subclasses MessageEvent and makes data, origin and other MessageEvent properites mutatble.
        function MutableMessageEvent (o) {
            this.bubbles = o.bubbles || false
            this.cancelBubble = o.cancelBubble || false
            this.cancelable = o.cancelable || false
            this.currentTarget = o.currentTarget || null
            this.data = o.data || null
            this.defaultPrevented = o.defaultPrevented || false
            this.eventPhase = o.eventPhase || 0
            this.lastEventId = o.lastEventId || ''
            this.origin = o.origin || ''
            this.path = o.path || new Array(0)
            this.ports = o.parts || new Array(0)
            this.returnValue = o.returnValue || true
            this.source = o.source || null
            this.srcElement = o.srcElement || null
            this.target = o.target || null
            this.timeStamp = o.timeStamp || null
            this.type = o.type || 'message'
            this.__proto__ = o.__proto__ || MessageEvent.__proto__
        }

        var before = wsHook.before = function (data, url, wsObject) {
            return data
        }
        var after = wsHook.after = function (e, url, wsObject) {
            return e
        }
        var modifyUrl = wsHook.modifyUrl = function(url) {
            return url
        }
        wsHook.resetHooks = function () {
            wsHook.before = before
            wsHook.after = after
            wsHook.modifyUrl = modifyUrl
        }

        var _WS = WebSocket
        WebSocket = function (url, protocols) {
            var WSObject
            url = wsHook.modifyUrl(url) || url
            this.url = url
            this.protocols = protocols
            if (!this.protocols) { WSObject = new _WS(url) } else { WSObject = new _WS(url, protocols) }

            var _send = WSObject.send
            WSObject.send = function (data) {
                arguments[0] = wsHook.before(data, WSObject.url, WSObject) || data
                _send.apply(this, arguments)
            }

            // Events needs to be proxied and bubbled down.
            WSObject._addEventListener = WSObject.addEventListener
            WSObject.addEventListener = function () {
                var eventThis = this
                // if eventName is 'message'
                if (arguments[0] === 'message') {
                    arguments[1] = (function (userFunc) {
                        return function instrumentAddEventListener () {
                            arguments[0] = wsHook.after(new MutableMessageEvent(arguments[0]), WSObject.url, WSObject)
                            if (arguments[0] === null) return
                            userFunc.apply(eventThis, arguments)
                        }
                    })(arguments[1])
                }
                return WSObject._addEventListener.apply(this, arguments)
            }

            Object.defineProperty(WSObject, 'onmessage', {
                'set': function () {
                    var eventThis = this
                    var userFunc = arguments[0]
                    var onMessageHandler = function () {
                        arguments[0] = wsHook.after(new MutableMessageEvent(arguments[0]), WSObject.url, WSObject)
                        if (arguments[0] === null) return
                        userFunc.apply(eventThis, arguments)
                    }
                    WSObject._addEventListener.apply(this, ['message', onMessageHandler, false])
                }
            })

            return WSObject
        }
    })()
}

var container
var timeLimit, memoryLimit, multiArgs
var numberOfTests, runningIndex, maxTime, maxMemory, totTime
var results, firstFail
var blocks = new Array()

function append(parent, html) {
    var element = document.createElement("div")
    element.innerHTML = html
    return parent.appendChild(element.children[0])
}
function initialize() {
    maxTime = maxMemory = totTime = 0, runningIndex = 1
    results = new Array(numberOfTests)
    firstFail = 0, blocks.length = 0
    var temp = document.querySelectorAll("#top-content > div:nth-child(1) > div > div:nth-child(11) > div")
    timeLimit = parseFloat(temp[1].textContent) * (temp[0].textContent == "Time limit (s):" ? 1000 : 1)
    temp = document.querySelectorAll("#top-content > div:nth-child(1) > div > div:nth-child(12) > div")
    memoryLimit = parseFloat(temp[1].textContent) * (temp[0].textContent == "Memory limit (MB):" ? 1024 : 1)
    multiArgs = document.querySelector("#top-content > div:nth-child(1) > div > div:nth-child(6) > div.textWhite.ng-binding").textContent.indexOf(',') != -1
    console.log(timeLimit, memoryLimit, document.querySelector("#top-content > div:nth-child(1) > div > div:nth-child(6) > div.textWhite.ng-binding").textContent)
}
function loadContainer() {
    if (container) document.body.removeChild(container)
    container = append(document.body, `
<div style="background: white; padding-top: 50px; padding-left: 50px; font-size: 48px; font-family: verdana, arial, sans-serif; color: black;">
    <span style="color: #808080; line-height: 50px;" id="verdict">Running on test 1</span>
    (${numberOfTests} test cases)
    <br><br>
    <table style="line-height: 50px;" id="overview"><tbody>
        <tr><td>Total Time</td><td>Max Time</td><td>Max Memory</td></tr>
        <tr><td id="totTime">0 ms</td><td id="maxTime">0 ms</td><td id="memory">0 KB</td></tr>
    </tbody></table>
</div>
    `)
}
function memoryString(value) {
    return value < 1024 ? `${value} KB` : `${(value / 1024).toFixed(2)} MB`
}
function printData(ctr, name, data) {
    var index = blocks.length
    blocks.push(data)
    var button = append(ctr, `
<div>
    <span style="font-size: 24px; vertical-align: middle; line-height: 50px;">${name}</span>
    <span style="font-weight: bold; color: navy; cursor: pointer; user-select: none !important; font-family: 'Lato', 'Helvetica Neue', arial, sans-serif; vertical-align: middle;">[Copy full data]</span>
    <br>
    <div class="codeblock">${data.length <= 80 ? data : data.slice(0, 77) + "..."}</div>
</div>
    `).children[1]
    button.onclick = () => navigator.clipboard.writeText(blocks[index]).then(() => {
        button.innerHTML = "[Copied]"
        setTimeout(() => button.innerHTML = "[Copy full data]", 500)
    }, () => alert("Copy failed!"));
}
function dataString(data) {
    var args = JSON.stringify(data).split("")
    var inq = false
    for (let i in args) {
        if (args[i] == '"') inq = !inq
        if (inq) continue
        if (args[i] == '[') args[i] = '{'
        if (args[i] == ']') args[i] = '}'
    }
    return args.join("")
}
function getVerdict(result) {
    if (result.succeeded) return "Accepted"
    if ("checkAnswerResponse" in result) return "Wrong answer"
    if (result.message.startsWith("The code execution time exceeded"))
        return "Time limit exceeded"
    if (result.message.startsWith("sandbox did not finish on time"))
        return "Time limit exceeded"
    if (result.message.startsWith("abnormal termination"))
        return "Runtime error"
    if (result.message.startsWith("segmentation fault"))
        return "Runtime error"
    if (result.message.startsWith("caught signal"))
        return "Runtime error"
    return "Unknown error (possibly MLE)"
}
function printResult(result) {
    var verdict = getVerdict(result)
    var ctr = append(container, `
<span style="font-size: 18px">
    <br>
    <span style="font-size: 30px; color: #3B5998">#Test: ${result.testCaseIndex}</span>
    <br>
    <span style="font-size: 24px; color: ${verdict == "Accepted" ? "#00AA00" : "#0000AA"};">${verdict}</span>
    <br>
    <strong>Time</strong>: ${result.execTime} ms, <strong>Memory</strong>: ${memoryString(result.maxMemoryUsed)}
    <br>
</span>
    `)
    printData(ctr, "Input", dataString(multiArgs ? result.args.slice(1, -1) : result.args))
    if ("returnValue" in result) printData(ctr, "Output", dataString(result.returnValue))
    if (verdict != "Accepted") printData(ctr, "Answer", dataString(result.expectedValue))
    if ("checkAnswerResponse" in result) printData(ctr, "Message", result.checkAnswerResponse)
    else if ("message" in result) printData(ctr, "Message", result.message)
}
function printResults() {
    var state = document.querySelector("#verdict")
    state.style["font-weight"] = "bold"
    if (!firstFail) {
        state.innerHTML = "Accepted", state.style.color = "#00AA00"
        for (const a of results) if(a) printResult(a)
    } else {
        state.innerHTML = `${getVerdict(results[firstFail - 1])} on test ${firstFail}`
        state.style.color = "#0000AA"
        for (const a of results) if (a && !a.succeeded) printResult(a)
        for (const a of results) if (a && a.succeeded) printResult(a)
    }
    container.scrollIntoView();
}
function addResult(result) {
    console.log(result)
    results[result.testCaseIndex++] = result
    if (getVerdict(result) == "Time limit exceeded") result.execTime = timeLimit;
    maxTime = Math.max(maxTime, result.execTime)
    maxMemory = Math.max(maxMemory, result.maxMemoryUsed)
    totTime += result.execTime
    document.querySelector("#maxTime").innerHTML = `${maxTime} ms`
    document.querySelector("#totTime").innerHTML = `${totTime} ms`
    document.querySelector("#memory").innerHTML = memoryString(maxMemory)

    if (firstFail) return
    if (!result.succeeded) {
        firstFail = result.testCaseIndex
        setTimeout(printResults, 200)
    }
    if (++runningIndex > numberOfTests) printResults()
    else document.querySelector("#verdict").innerHTML = `Running on test ${runningIndex}`
}
function handleArenaEvent(event) {
    if (event.name == "PracticeSystemTestResponse") {
        numberOfTests = Object.values(event.args[0].testCaseCountByComponentId)[0]
        initialize(), loadContainer(), container.scrollIntoView()
    }
    if (event.name == "PracticeSystemTestResultResponse")
        addResult(event.args[0].resultData)
}
(function() {
    onload = () => append(document.head, `
<style type="text/css">
.codeblock {
    height: 35px;
    width: 1000px;
    background: #EEEEEE;
    padding-top: 5px;
    padding-left: 10px;
    font-size: 24px;
    font-family: monospace;
    color: black;
}
#overview {
    width: 1000px;
    min-height: 140px;
    text-align: center;
    border-collapse: collapse;
}
#overview, #overview td {
    border: 5px solid;
}
</style>
    `)
    loadWsHook()
    wsHook.after = function(messageEvent, url, wsObject) {
        if (messageEvent.data.startsWith("5:::")) {
            handleArenaEvent(JSON.parse(messageEvent.data.slice(4)))
        }
        return messageEvent
    }
})();