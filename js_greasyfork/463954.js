// ==UserScript==
// @name         春秋半自动
// @description  春秋半自动-辅助
// @namespace    http://tampermonkey.net/undefined
// @version      0.1.2
// @require		http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @match       https://flights.ch.com/*



// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/463954/%E6%98%A5%E7%A7%8B%E5%8D%8A%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/463954/%E6%98%A5%E7%A7%8B%E5%8D%8A%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict'
    var gender = {'FEMALE': '2','MALE':'1'}
    //国家转码
    var national = {'AE': 'ARE', 'AF': 'AFG', 'AL': 'ALB', 'AM': 'ARM', 'AO': 'AGO', 'AR': 'ARG', 'AT': 'AUT', 'AU': 'AUS', 'AZ': 'AZE', 'BE': 'BEL', 'BG': 'BGR', 'BH': 'BHR', 'BI': 'BDI', 'BJ': 'BEN', 'BN': 'BRN', 'BO': 'BOL', 'BR': 'BRA', 'BW': 'BWA', 'BY': 'BLR', 'CA': 'CAN', 'CF': 'CAF', 'CG': 'COG', 'CH': 'CHE', 'CL': 'CHL', 'CM': 'CMR', 'CN': 'CHN', 'CO': 'COL', 'CR': 'CRI', 'CS': 'CZE', 'CU': 'CUB', 'CY': 'CYP', 'DE': 'DEU', 'DK': 'DNK', 'DZ': 'DZA', 'EC': 'ECU', 'EE': 'EST', 'EG': 'EGY', 'ES': 'ESP', 'ET': 'ETH', 'FI': 'FIN', 'FJ': 'FJI', 'FR': 'FRA', 'GA': 'GAB', 'GB': 'GBR', 'GD': 'GRD', 'GE': 'GEO', 'GH': 'GHA', 'GN': 'GIN', 'GR': 'GRC', 'GT': 'GTM', 'HN': 'HND', 'HU': 'HUN', 'IE': 'IRL', 'IL': 'ISR', 'IN': 'IND', 'IQ': 'IRQ', 'IR': 'IRN', 'IS': 'ISL', 'IT': 'ITA', 'JM': 'JAM', 'JO': 'JOR', 'JP': 'JPN', 'KH': 'KHM', 'KR': 'KOR', 'KW': 'KWT', 'LA': 'LAO', 'LB': 'LBN', 'LC': 'LCA', 'LI': 'LIE', 'LK': 'LKA', 'LR': 'LBR', 'LT': 'LTU', 'LU': 'LUX', 'LV': 'LVA', 'LY': 'LBY', 'MA': 'MAR', 'MC': 'MCO', 'MD': 'MDA', 'MG': 'MDG', 'ML': 'MLI', 'MM': 'MMR', 'MN': 'MNG', 'MT': 'MLT', 'MU': 'MUS', 'MW': 'MWI', 'MX': 'MEX', 'MY': 'MYS', 'MZ': 'MOZ', 'NA': 'NAM', 'NE': 'NER', 'NG': 'NGA', 'NI': 'NIC', 'NL': 'NLD', 'NO': 'NOR', 'NP': 'NPL', 'NZ': 'NZL', 'OM': 'OMN', 'PA': 'PAN', 'PE': 'PER', 'PG': 'PNG', 'PH': 'PHL', 'PK': 'PAK', 'PL': 'POL', 'PT': 'PRT', 'PY': 'PRY', 'QA': 'QAT', 'RO': 'ROU', 'RU': 'RUS', 'SA': 'SAU', 'SC': 'SYC', 'SD': 'SDN', 'SE': 'SWE', 'SG': 'SGP', 'SI': 'SVN', 'SK': 'SVK', 'SM': 'SMR', 'SN': 'SEN', 'SO': 'SOM', 'SY': 'SYR', 'SZ': 'SWZ', 'TD': 'TCD', 'TG': 'TGO', 'TH': 'THA', 'TJ': 'TJK', 'TN': 'TUN', 'TR': 'TUR', 'TZ': 'TZA', 'UA': 'UKR', 'UG': 'UGA', 'US': 'USA', 'UY': 'URY', 'VE': 'VEN', 'VN': 'VNM', 'YE': 'YEM', 'ZA': 'ZAF', 'ZM': 'ZMB', 'ZW': 'ZWE'}
    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return true;
        }
    }
    window.reactAutoEvent = function (doc, value, eventName = 'input') {
        let doc1 = doc
        let lastValue
        if (eventName === 'input') {
            lastValue = doc1.value
            doc1.value = value
        }
        let event = new Event(eventName, {bubbles: true})
        // hack React15
        event.simulated = true
        // hack React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = doc1._valueTracker
        if (tracker) {
            tracker.setValue(lastValue)
        }
        doc1.dispatchEvent(event)
    }
    function selectFlightNo(flightNo) {
        // 航班信息标量
        let allFlightNoLi = document.getElementsByClassName("flight-item-new");
        for (let allFlightNo of allFlightNoLi) {
            let flightText = allFlightNo.innerText;
            // 标记航班号
            if (flightText.indexOf(flightNo) !== -1) {
                allFlightNo.style.border = "10px solid #0c76e0";
                // 点击订票
                // allFlightNo.getElementsByClassName("select-btn J_SelectFlight")[0].click();
                // window.flightSelectOver = true;
            }
        }
    }
    function addPeople(peopleMessageLi) {
        console.log('乘机人---'+peopleMessageLi.length)
        sleep(1000)
        var count = 0
        //取消设为订单联系人
        // document.querySelector("body > div:nth-child(10) > div > div.c-passengerArea > ul.c-passengers.m-forms > li > div.passenger-panel-foot > ul > li.setlinkBox > div").click()
        for (let peopleMessage of peopleMessageLi) {

            document.getElementsByClassName('add-btns f-cb')[0].getElementsByTagName('li')[0].click()
            //乘机人信息添加页
            let inputItemLi = document.getElementsByClassName('c-passengers m-forms')[0].getElementsByClassName('passenger-item')[count].getElementsByTagName('ul')[0].getElementsByTagName('li')
            count++
            for (let inputItemIndex in inputItemLi) {
                switch (inputItemIndex) {
                    case '0':
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByTagName('input')[0],
                            peopleMessage.name.split('/')[0]
                        )
                        inputItemLi[inputItemIndex].getElementsByTagName('span')[0].click()
                        console.log('乘客姓')
                        break
                    case '1':
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByTagName('input')[0],
                            peopleMessage.name.split('/')[1]
                        )
                        inputItemLi[inputItemIndex].getElementsByTagName('span')[0].click()
                        console.log('乘客名')
                        break
                    case '2':
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByTagName('input')[1],
                            '18010272539'
                        )
                        inputItemLi[inputItemIndex].getElementsByTagName('span')[0].click()
                        console.log('手机号')
                        break
                    case '3':
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByTagName('input')[0],
                            peopleMessage.birthday
                        )
                        inputItemLi[inputItemIndex].getElementsByTagName('span')[0].click()
                        console.log('出生日期')
                        break
                    case '4':
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByTagName('input')[0],
                            '2'
                        )
                        console.log('证件类型')
                        break
                    case '5':
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByTagName('input')[0],
                            peopleMessage.cardNo
                        )
                        inputItemLi[inputItemIndex].getElementsByTagName('span')[0].click()
                        console.log('证件号')
                        break
                    case '6':
                        if (national[peopleMessage.cardIssuePlace]==null){
                            alert('未获取到证件签发国，请联系技术')
                            return
                        }
                        else {
                            window.reactAutoEvent(
                                inputItemLi[inputItemIndex].getElementsByTagName('input')[0],
                                national[peopleMessage.cardIssuePlace]
                            )
                        }
                        console.log('证件签发国')
                        break
                    case '7':
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByTagName('input')[0],
                            peopleMessage.cardExpired
                        )
                        console.log('证件有效期')
                        break
                    case '8':
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByTagName('input')[0],
                            national[peopleMessage.nationality]
                        )
                        console.log('国籍')
                        break
                    case '9':
                        if (gender[peopleMessage.gender]==null){
                            alert('未获取到性别，请联系技术')
                            return
                        }
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByTagName('input')[0],
                            gender[peopleMessage.gender]
                        )
                        console.log('性别')
                        break
                }
            }
        }
        document.getElementsByClassName('btn-delete')[document.getElementsByClassName('btn-delete').length-1].click()
        let order_linkman = document.querySelector('ul.c-passengers.c-link > li > ul').getElementsByTagName('li')
        for (let inputItemIndex in order_linkman) {
            switch (inputItemIndex) {
                case '0':
                    window.reactAutoEvent(order_linkman[inputItemIndex].getElementsByTagName('input')[0], 'ZHONGLEI')
                    order_linkman[inputItemIndex].getElementsByTagName('span')[0].click()
                    // debugger
                    window.reactAutoEvent(
                        order_linkman[inputItemIndex].getElementsByTagName('input')[0],
                        'ZHONGLEI'
                    )
                    order_linkman[inputItemIndex].getElementsByTagName('span')[0].click()
                    console.log('联系人姓名')
                    break
                case '1':
                    window.reactAutoEvent(
                        order_linkman[inputItemIndex].getElementsByTagName('input')[1],
                        '18010272539'
                    )
                    console.log('联系人手机号')
                    break
                case '2':
                    window.reactAutoEvent(
                        order_linkman[inputItemIndex].getElementsByTagName('input')[0],
                        '18010272539@163.com'
                    )
                    order_linkman[inputItemIndex].getElementsByTagName('span')[0].click()
                    console.log('联系人邮箱')
                    break

            }
        }
        //获取焦点
        count = 0
        for (let peopleMessage of peopleMessageLi) {
            let inputItemLi = document.getElementsByClassName('c-passengers m-forms')[0].getElementsByClassName('passenger-item')[count].getElementsByTagName('ul')[0].getElementsByTagName('li')
            count++
            for (let inputItemIndex in inputItemLi) {
                switch (inputItemIndex) {
                    case '4':
                        inputItemLi[inputItemIndex].getElementsByClassName('u-select-view')[0].click()
                        inputItemLi[inputItemIndex].getElementsByClassName('u-select-item')[0].click()
                        console.log('证件类型')
                        break
                }
            }
        }
        //我已确定
        document.querySelector('#J_agreement > input').click()
    }
    var intervalID = setInterval(function() {
        console.log('----')
        if (document.getElementsByClassName('c-passengers m-forms')&&window.location.href.indexOf('page=search')!==-1){
            var flightInfoAndUserInfo = localStorage.getItem('flightInfoAndUserInfo')
            localStorage.removeItem('flightInfoAndUserInfo');

            setTimeout(addPeople, 3000,JSON.parse(flightInfoAndUserInfo)['passengerInfos'])
            clearInterval(intervalID);

        }
    }, 1000);
    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var nowLocationPathname = window.location.pathname
        var host = window.location.host
        var flightSearch = document.getElementById('search-submit')
        var flightInfoAndUserInfo = localStorage.getItem('flightInfoAndUserInfo')
        if (nowLocationPathname === '/' && host === 'flights.ch.com' && flightSearch) {
            var flightData = ''
            var data = decodeURIComponent(window.location.href).split('#')
            if (data.length === 1) {
                var data1 = data[0].split('https://flights.ch.com/')
                if (data1.length === 1) {
                    alert('未获取到数据，请联系技术')
                    return
                }
                flightData = data1[1]
            } else {
                flightData = data[1]
            }
            localStorage.setItem('flightInfoAndUserInfo', flightData)
            flightData = JSON.parse(flightData)
            var href = 'https://flights.ch.com/' + flightData['depAirport'] + '-' + flightData['arrAirport'] + '.html?FDate=' + flightData['depDate'] + '&SType=0&MType=0&intcmp=flightspage_recommend_hx_SHA-CGD&IsNew=1'
            window.location.replace(href)
        }
        else if (document.getElementsByClassName('c-passengers m-forms') && host === 'flights.ch.com'&&window.location.href.indexOf('page=search')!==-1) {
            setTimeout(addPeople, 3, JSON.parse(flightInfoAndUserInfo)['passengerInfos'])
        }
        else if (document.getElementsByClassName('flight-item-new') && host === 'flights.ch.com') {
            setTimeout(selectFlightNo, 3000, JSON.parse(flightInfoAndUserInfo)['flightNo'])
        }
    })
})();
