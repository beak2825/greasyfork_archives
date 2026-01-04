// ==UserScript==
// @name YD OPS Utils
// @match http://ts.ky.yundasys.com:8080/yd-ops/apps/index.zul
// @description:zh-cn 韵达 OPS 系统附加工具
// @version 0.0.1.20181002132204
// @namespace https://greasyfork.org/users/216781
// @description 韵达 OPS 系统附加工具
// @downloadURL https://update.greasyfork.org/scripts/372794/YD%20OPS%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/372794/YD%20OPS%20Utils.meta.js
// ==/UserScript==
var dialog = document.createElement('div');
dialog.style.display = 'none'
dialog.style.position = 'fixed'
dialog.style.width = '225px'
dialog.style.height = '187px'
dialog.style.zIndex = 999999
dialog.style.top = '120px'
dialog.style.right = '16px'
dialog.style.backgroundColor = '#FFFFFF'
dialog.style.border = '2px solid lightslategray'
dialog.innerHTML = `

体积：<input type="number" style="width: 50px;" id="utils-length" />x<input type="number" id="utils-width" style="width: 50px;" />x<input type="number" id="utils-height" style="width: 50px;" />
重量：<input type="number" style="width: 50px;" id="utils-weight" />省外：<input type="checkbox" style="position: relative;width: 18px;height: 18px;top: 4px;" id="utils-scope" />
托盘：<input type="checkbox" style="position: relative;width: 18px;height: 18px;top: 4px;" id="utils-tray" />
数量：<input type="number" style="width: 50px;" id="utils-number" value="1"> <input type="button" style="" id="utils-reset" value="重置" style="width: 50px;" /><textarea id="utils-result" style="margin: 0px; width: 223px; height: 120px; resize: none;" readonly="readonly" ></textarea>
`
document.body.appendChild(dialog)

var lengthInput = document.getElementById('utils-length')
var widthInput = document.getElementById('utils-width')
var heightInput = document.getElementById('utils-height')
var weightInput = document.getElementById('utils-weight')
var scopeInput = document.getElementById('utils-scope')
var trayInput = document.getElementById('utils-tray')
var numberInput = document.getElementById('utils-number')
var resultTextarea = document.getElementById('utils-result')
var resetButton = document.getElementById('utils-reset')

resetButton.onclick = function(){
  lengthInput.value = ''
  widthInput.value = ''
  heightInput.value = ''
  weightInput.value = ''
  scopeInput.checked = false
  trayInput.checked = false
  numberInput.value = 1
  resultTextarea.value = ''
}


resultTextarea.onfocus = function(){
    var resultWeight = Number(document.querySelector('[placeholder=请填写结算重量]').value)
    var weight = Number(weightInput.value)
    var result = ''
    var temp = 0
    if(weight != 0){
        temp = weight
        result += weight
        var tray = trayInput.checked
        if(tray){
            result += "-10"
            temp -= 10
            result += "=" + temp
        }
    } else {
        var length = Number(lengthInput.value)
        var width = Number(widthInput.value)
        var height = Number(heightInput.value)
        var number = Number(numberInput.value)

        temp = length * width * height
        result += length + 'x' + width + 'x' + height + '=' + temp
        temp = Math.floor(temp/5000.0)
        result += '÷5000=' + temp
        temp *= number
        result += '*' + number + "=" + temp
    }
    temp -= resultWeight
    result += '-' + resultWeight + '=' + temp
    var scope = scopeInput.checked
    if(scope){
        temp *= 5
        result += 'x5=' + temp
    } else {
        temp *= 3
        result += 'x3=' + temp
    }
    temp *= 0.25
    result += 'x0.25=' + temp
    resultTextarea.value = result
    resultTextarea.select()
}

setInterval(() => {
  $(document).unbind('keydown')
    var detail = document.querySelector('[placeholder=请填写结算重量]')
    if(detail != null){
        dialog.style.display = 'block'
    } else {
        dialog.style.display = 'none'
    }
}, 100)