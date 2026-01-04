// ==UserScript==
// @name         河北银行行号查询系统控件增强
// @namespace    empyrealtear
// @version      0.0.1
// @description  移除多余元素，增加地址遍历功能，验证码错误不跳转页面
// @author       empyrealtear
// @match        https://www.hebbank.com/corporbank/otherBankQueryWeb.do
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406529/%E6%B2%B3%E5%8C%97%E9%93%B6%E8%A1%8C%E8%A1%8C%E5%8F%B7%E6%9F%A5%E8%AF%A2%E7%B3%BB%E7%BB%9F%E6%8E%A7%E4%BB%B6%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/406529/%E6%B2%B3%E5%8C%97%E9%93%B6%E8%A1%8C%E8%A1%8C%E5%8F%B7%E6%9F%A5%E8%AF%A2%E7%B3%BB%E7%BB%9F%E6%8E%A7%E4%BB%B6%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict'
    jQuery.noConflict()
    
    // 移除左右两侧广告
    jQuery('[id*=GuangGao]').remove()
    // 删除地址复选框初始化
    jQuery('#bankTypeSelect').removeAttr('onchange')
    // 验证码错误不跳转页面
    jQuery('#queryButton').removeAttr('onclick')
    jQuery('#queryButton').click(customQueryBank)
    // 验证码框回车绑定
    //  - 查询点击
    //  - 验证码图片点击
    //  - 验证码框内容清空
    jQuery('#checkCodeText').keypress(() => {
        if (event.keyCode == 13) {
            jQuery('#queryButton').click()
            jQuery('#verifyImg').click()
            jQuery('#checkCodeText').val(null)
        }
    })

    // 增强地址选择
    var province = jQuery('#provinceSelect')
    var city = jQuery('#citySelect')
    var provinceArr = new Array()

    jQuery('#provinceSelect>option').each((i, opt) => provinceArr[i] = {
        text: opt.text,
        code: opt.value,
        city: ajaxCity(opt.value)
    })

    var exCity = jQuery('<input></input>', { width: city.width() }).appendTo(city.parent())
    exCity.keypress((event) => {
        if (event.keyCode != 13 & exCity.val().length > 0)
            return
        var regex = new RegExp(exCity.val())
        var end = false
        for (let i = 0; i < provinceArr.length; i++)
            provinceArr[i].city.then(result => {
                if (end) return
                for (let ci = 0; ci < result.length; ci++)
                    if (regex.test(provinceArr[i].text + result[ci].text)) {
                        province.val(provinceArr[i].code)
                        province.change()
                        var cityCode = `${result[ci].code}`.substring(0, 4)
                        setTimeout(() => city.val(cityCode), 200)
                        console.log(`${provinceArr[i].text}(${provinceArr[i].code})->`
                            + `${result[ci].text}(${cityCode})`)
                        end = true
                        return
                    }
            })
    })
})()

function ajaxCity(provinceCode) {
    return new Promise(resolve => {
        sendAjaxRequest('POST', 'cityQueryAjax.do',
            `provinceCode=${provinceCode}`, (ele) => {
                var icoll = ele.getElement('iCityInfo')
                var result = new Array()
                for (var i = 0; i < icoll.size(); i++) {
                    var kcoll = icoll.getElementAt(i)
                    result[i] = {
                        text: kcoll.getValueAt('cityName'),
                        code: kcoll.getValueAt('cityCode')
                    }
                }
                resolve(result)
            })
    })
}

function customQueryBank() {
    if (jQuery('#citySelect').attr('disabled')) {
        alert('请选择开户行所在地')
        return
    }

    var bankType = jQuery('#bankTypeSelect').val()
    var cityCode = jQuery('#citySelect').val()
    var bankName = jQuery('#bankNameText').val()
    var checkCode = jQuery('#checkCodeText').val()

    if (!checkCode.length)
        return

    if (!isEmpty(bankName)) {
        bankName = bankName.replace(/^\s+|\s+$/g, "").replace(/\s+/g, "*")
        var bankNameArray = bankName.split('*')
        var names = '%25'
        for (let i = 0; i < bankNameArray.length; i++)
            if (i < 3)
                names += (bankNameArray[i] + '%25')

        var params = `checkCode=${checkCode}&bankType=${bankType}&cityCode=${cityCode}&bankName=${names}`
    } else
        var params = `checkCode=${checkCode}&bankType=${bankType}&cityCode=${cityCode}`

    jQuery('#queryButton').attr('disabled', true)
    try {
        decodeURI(params)
        new Ajax.Request('webBankQueryAjax.do', {
            method: 'POST',
            parameters: params,
            onFailure: showError,
            onComplete: (response) => {
                if (response.responseText.indexOf('<?xml') < 0) {
                    jQuery("#resultTableBody").hide()
                    jQuery("#resultTableBody2").show()
                    jQuery('#resultTableBody2>tr>td').text('验证码错误(网络波动时会连续发生)')
                    return
                }

                var contextDataPos = response.responseXML.childNodes.length - 1
                var contextData = new KeyedCollectionClass(response.responseXML.childNodes[contextDataPos])

                var errorMessage = contextData.getValueAt("errorMessage")
                if (errorMessage == null) {
                    cleanTableBody('resultTableBody')
                    var keyWord = contextData.getValueAt('bankName')
                    var icoll = contextData.getElement('iBankInfo')
                    var iSize = icoll.size()
                    if (iSize > 0) {
                        for (var i = 0; i < iSize; i++) {
                            var kcoll = icoll.getElementAt(i)
                            var unionBankNo = kcoll.getValueAt('unionBankNo')
                            var bankName = kcoll.getValueAt('bankName')

                            addRow('resultTableBody', i, unionBankNo, bankName, keyWord)
                        }
                        jQuery('#resultTableBody').show()
                        jQuery('#resultTableBody2').hide()
                    } else {
                        jQuery('#resultTableBody').hide()
                        jQuery('#resultTableBody2').show()
                        jQuery('#resultTableBody2>tr>td').text('未找到记录')
                    }
                } else
                    alert(errorMessage)
            }
        })
    } catch (e) {
        alert('输入了非法字符')
    }
    jQuery('#queryButton').attr('disabled', false)
}
