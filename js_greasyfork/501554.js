// ==UserScript==
// @name         风控购买label
// @namespace    http://maxpeedingrods.cn/
// @version      2024-07-23
// @description  购买label自动填写信息并添加搜索功能
// @license      No License
// @author       yang
// @match        *://pro.packlink.com/*
// @match        *://crm.maxpeedingrods.cn/*
// @match        https://crm.maxpeedingrods.cn/
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/501554/%E9%A3%8E%E6%8E%A7%E8%B4%AD%E4%B9%B0label.user.js
// @updateURL https://update.greasyfork.org/scripts/501554/%E9%A3%8E%E6%8E%A7%E8%B4%AD%E4%B9%B0label.meta.js
// ==/UserScript==

function createButton() {
    const myKey = 'pro__Access-Token';
    const myValue = GM_getValue(myKey);
    // console.log(`Retrieved ${myKey}: ${myValue} from Tampermonkey storage`);
    function addEventListener() {
        // 保留原始的方法
        var originalPushState = history.pushState;
        var originalReplaceState = history.replaceState;

        // 重写pushState
        history.pushState = function () {
            var result = originalPushState.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        // 重写replaceState
        history.replaceState = function () {
            var result = originalReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        // 监听popstate事件
        window.addEventListener('popstate', function () {
            window.dispatchEvent(new Event('locationchange'));
        });

        // 自定义事件处理

        window.addEventListener('locationchange', function () {
            const url = window.location.href;
            if (url.indexOf("private/shipments/create/info") >= 0) {

                waitForElement('#main-scrollable-window > article > main > section ', createInfo);

            }
            else if (url.indexOf("private/shipments/create/address") >= 0) {
                waitForElement('#main-scrollable-window > article > main > section ', createAddress);
            }
        });
    }


    // 发送两个GET请求并处理数据
    async function fetchAndProcessData(searchValue) {
        try {
            // 定义两个API的URL
            const jsontoken = JSON.parse(myValue)
            // console.log(jsontoken.value)
            const apiUrl1 = "https://crm.maxpeedingrods.cn:8013/crm/order/queryBuyerAndPackage?humanOrderId=" + encodeURIComponent(searchValue);
            // console.log(apiUrl1)
            // const apiUrl2 = "http://kongapi.maxpeedingrods.cn:8000/owms/api/warehouse_management/package/get_info?human_order_id=" + encodeURIComponent(searchValue);
            const headers = {
                "X-Access-Token": jsontoken.value,
            }
            // 同时发送两个GET请求
            const [response1] = await Promise.all([
                makeGMRequest('GET', apiUrl1, null, headers),
                // makeGMRequest('GET', apiUrl2)
            ]);

            // 处理响应数据
            // console.log('Response 1:', response1);
            // console.log('Response 2:', response2);

            const fillData = JSON.parse(response1)
            // console.log("sssssssssssssssss",fillData.result.buyerCountryCode)
            // 检查订单数据是否有效
            if (!fillData.result || !fillData.result.buyerCountryCode) {
                alert("输入订单有误，请从新输入");
                return; // 退出函数
            }
            const fcountryinput = countryCodeToInfo[fillData.result.buyerCountryCode]["country"]
            // console.log(fcountryinput)
            const fromcountry = "from.country"
            selectClickById(fcountryinput, fromcountry);
            // 使用id定位
            const frominputElementById = document.getElementById('from.postalCode');
            changeReactInputValue(frominputElementById, fillData.result.crmOrderInfoBuyer.buyerPostalCode.slice(0, 5));
            changeReactInputValue(frominputElementById, fillData.result.crmOrderInfoBuyer.buyerPostalCode.slice(0, 5));
            // 直接从对象中获取值并进行拼接  
            // const codecity = fillData.result.crmOrderInfoBuyer.buyerPostalCode + " "+"-"+" " + fillData.result.crmOrderInfoBuyer.buyerCity;
            // // console.log(codecity)
            // changeReactInputValue(frominputElementById, codecity);
            // changeReactInputValue(frominputElementById, codecity);




            const tcountryinput = getwarehouseinformation(fcountryinput)
            const tocountry = "to.country"

            // 假设已经对tcountryinput进行了验证
            if (tcountryinput) {
                try {
                    selectClickById(tcountryinput.country, tocountry);
                } catch (error) {
                    alert("选择仓库时发生错误，请稍后再试");
                }
            } else {
                alert("该国家无对应仓库，请手动选择" + fcountryinput);
                return;
            }

            // 使用id定位

            const toinputElementById = document.getElementById('to.postalCode');
            changeReactInputValue(toinputElementById, tcountryinput.postcode);
            changeReactInputValue(toinputElementById, tcountryinput.postcode);

            setTimeout(() => {
                // 使用querySelector找到具有特定for属性的label元素
                const label = document.querySelector('label[for="from.postalCode"]');
                const menuDiv = label.parentNode.parentNode.nextElementSibling.firstElementChild;
                const btns = menuDiv.querySelectorAll('button');
                if (btns.length > 0) {
                    // 遍历所有的button元素
                    for (const btn of btns) {
                        if (btn.innerText.split(' - ')[1].toLowerCase() == fillData.result.crmOrderInfoBuyer.buyerCity.toLowerCase()) {
                            btn.click()
                            break;
                        }
                    }
                }
            }, 2000);
            setTimeout(() => {
                const label = document.querySelector('label[for="to.postalCode"]');
                const menuDiv = label.parentNode.parentNode.nextElementSibling.firstElementChild;
                const btns = menuDiv.querySelectorAll('button');
                if (btns.length > 0) {
                    btns[0].click();
                }
            }, 2000);

            //调用函数生成一个排序select框
            const targetElement = $('#main-scrollable-window > article > main > section');
            initCountrySelect(targetElement, tcountryinput.country, "selectaction1");

            if (!fillData.result || !fillData.result.crmOrderPackages || !fillData.result.crmOrderPackages.total_length) {
                alert("未搜索到包裹信息，请确认包裹信息是否存在");
                return; // 退出函数
            }
            const weight = document.getElementById('parcels.0.weight');
            changeReactInputValue(weight, (fillData.result.crmOrderPackages.total_weight) / 1000);
            const length = document.getElementById('parcels.0.length');
            changeReactInputValue(length, fillData.result.crmOrderPackages.total_length);
            const width = document.getElementById('parcels.0.width');
            changeReactInputValue(width, fillData.result.crmOrderPackages.total_width);
            const height = document.getElementById('parcels.0.height');
            changeReactInputValue(height, fillData.result.crmOrderPackages.total_height);

            const selectsku = document.getElementById('selectaction2')
            // console.log(selectsku)
            const product = fillData.result.crmOrderPackages.products
            // 遍历 products 数组 
            selectsku.innerHTML = ''; // 清空之前的所有 option   
            const option1 = document.createElement('option')
            option1.value = "defaultpagebag";
            option1.textContent = "请选择sku,或点击此处返回原值";
            selectsku.appendChild(option1);
            product.forEach(function (product) {
                // 为每个 sku 创建一个新的 option 元素  
                const option = document.createElement('option');
                // 设置 option 的 value 和文本内容  
                option.value = product.sku;
                option.textContent = product.sku;
                // 将 option 元素添加到 select 元素中
                selectsku.appendChild(option);
            });


        } catch (error) {
            console.error('get请求失败', error);
            alert("未获取token或token已失效，请重新登陆crm系统")

        }
    }

    //发送sku请求到接口查询sku的参数
    async function infoskusearch(skuselectedValue) {
        try {
            // console.log(skuselectedValue)
            if (skuselectedValue === "defaultpagebag") {
                // console.log(skuselectedValue)
                // console.log(localStorage.getItem('lastSearchValue'))
                InfoDefaultSkuSearch(localStorage.getItem('lastSearchValue'))

            }
            else {
                // 定义两个API的URL
                const jsontoken = JSON.parse(myValue)
                // console.log(jsontoken.value)
                const apiUrl1 = "https://crm.maxpeedingrods.cn:8013/crm/order/getSkuSize?sku=" + encodeURIComponent(skuselectedValue);
                // console.log(apiUrl1)
                // const apiUrl2 = "http://kongapi.maxpeedingrods.cn:8000/owms/api/warehouse_management/package/get_info?human_order_id=" + encodeURIComponent(searchValue);
                const headers = {
                    "X-Access-Token": jsontoken.value,
                }
                // 同时发送两个GET请求
                const [response1] = await Promise.all([
                    makeGMRequest('GET', apiUrl1, null, headers),
                    // makeGMRequest('GET', apiUrl2)
                ]);
                const fillData = JSON.parse(response1)
                // console.log(fillData)
                if (!fillData.result || !fillData.result[0].size || !fillData.result[0].size.width) {
                    alert("未搜索到包裹信息，请确认信息是否存在");
                    return; // 退出函数
                }
                const weight = document.getElementById('parcels.0.weight');
                changeReactInputValue(weight, (fillData.result[0].size.weight) / 1000);
                const length = document.getElementById('parcels.0.length');
                changeReactInputValue(length, fillData.result[0].size.length);
                const width = document.getElementById('parcels.0.width');
                changeReactInputValue(width, fillData.result[0].size.width);
                const height = document.getElementById('parcels.0.height');
                changeReactInputValue(height, fillData.result[0].size.height);
            }
        }
        catch (error) {
            console.error('get请求失败', error);
            alert("找不到sku信息")
        }
    }

    //发送sku请求到订单接口查询订单默认包裹的参数
    async function InfoDefaultSkuSearch(skudefaultValue) {
        const jsontoken = JSON.parse(myValue)
        const apiUrl1 = "https://crm.maxpeedingrods.cn:8013/crm/order/queryBuyerAndPackage?humanOrderId=" + encodeURIComponent(skudefaultValue);
        const headers = {
            "X-Access-Token": jsontoken.value,
        }
        // 发送GET请求
        const [response1] = await Promise.all([
            makeGMRequest('GET', apiUrl1, null, headers),
        ]);
        const fillData = JSON.parse(response1)
        const weight = document.getElementById('parcels.0.weight');
        changeReactInputValue(weight, (fillData.result.crmOrderPackages.total_weight) / 1000);
        const length = document.getElementById('parcels.0.length');
        changeReactInputValue(length, fillData.result.crmOrderPackages.total_length);
        const width = document.getElementById('parcels.0.width');
        changeReactInputValue(width, fillData.result.crmOrderPackages.total_width);
        const height = document.getElementById('parcels.0.height');
        changeReactInputValue(height, fillData.result.crmOrderPackages.total_height);
    }

    // 发送两个GET请求并处理数据
    async function adressfetchAndProcessData(searchValue) {
        try {
            // 定义两个API的URL
            const jsontoken = JSON.parse(myValue)
            // console.log(jsontoken.value)
            const apiUrl1 = "https://crm.maxpeedingrods.cn:8013/crm/order/queryBuyerAndPackage?humanOrderId=" + encodeURIComponent(searchValue);
            // console.log(apiUrl1)
            // const apiUrl2 = "http://kongapi.maxpeedingrods.cn:8000/owms/api/warehouse_management/package/get_info?human_order_id=" + encodeURIComponent(searchValue);
            const headers = {
                "X-Access-Token": jsontoken.value,
            }
            // 同时发送两个GET请求
            const [response1] = await Promise.all([
                makeGMRequest('GET', apiUrl1, null, headers),
                // makeGMRequest('GET', apiUrl2)
            ]);

            // 处理响应数据
            // console.log('Response 1:', response1);
            // console.log('Response 2:', response2);

            const fillData = JSON.parse(response1)
            // console.log("sssssssssssssssss",fillData.result.buyerCountryCode)
            const tcountryinput = countryCodeToInfo[fillData.result.buyerCountryCode]["country"]
            //调用函数生成一个排序select框
            const targetElement = $('#main-scrollable-window > article > main > section');
            adressinitCountrySelect(targetElement, tcountryinput);
            // 使用id定位
            const ffirstName = document.getElementById('from.firstName');
            changeReactInputValue(ffirstName, fillData.result.crmOrderInfoBuyer.buyerName);
            const flastName = document.getElementById('from.lastName');
            changeReactInputValue(flastName, fillData.result.crmOrderInfoBuyer.buyerName);
            const femail = document.getElementById('from.email');
            changeReactInputValue(femail, fillData.result.crmOrderInfoBuyer.buyerEmail);
            const fphone = document.getElementById('from.phone');
            changeReactInputValue(fphone, fillData.result.crmOrderInfoBuyer.buyerPhone);
            const fstreet1 = document.getElementById('from.street1');
            changeReactInputValue(fstreet1, fillData.result.crmOrderInfoBuyer.buyerAddress1);

            // const trecipientinformation = getwarehouseinformation(tcountryinput)
            // 给name加上订单号
            const updatedCountries = updateRecipientNamesWithSuffix(countries, fillData.result.crmHumanOrderId);
            //搜索新表写入表格
            const newrecipientName = findRecipientNameBycountry(updatedCountries, tcountryinput);

            // 假设已经对tcountryinput进行了验证
            if (newrecipientName) {
                try {
                    const tfirstName = document.getElementById('to.firstName');
                    changeReactInputValue(tfirstName, newrecipientName.recipientname);
                    const tlastName = document.getElementById('to.lastName');
                    changeReactInputValue(tlastName, newrecipientName.recipientname);
                    const temail = document.getElementById('to.email');
                    changeReactInputValue(temail, newrecipientName.recipientemail);
                    const tphone = document.getElementById('to.phone');
                    changeReactInputValue(tphone, newrecipientName.recipientphone);
                    const recipiententadress = document.getElementById('to.street1');
                    changeReactInputValue(recipiententadress, newrecipientName.recipiententadress);

                } catch (error) {
                    console.error("选择仓库时发生错误：", error);
                    // alert("选择仓库时发生错误，请稍后再试");
                }
            } else {
                alert("该国家无对应仓库，请手动选择" + tcountryinput);
            }




        } catch (error) {
            console.error('get请求失败', error);
            alert("查找失败，请检查ID后重试")
        }
    }







    //info页搜索框
    function initCountrySelect(targetElement, priorityCountry = null, selectId = null) {
        // 查找select元素
        // let countrySelect = targetElement.find('select');
        let countrySelect = targetElement.find('#' + selectId);

        // 如果select元素不存在，则创建并初始化
        if (!countrySelect.length) {
            countrySelect = $('<select id="' + selectId + '" style="width:300px"></select>');
            // 添加一个空白的默认选项
            countrySelect.append($('<option style = "color:red"></option>').val('').text('请选择国家，以上为推荐仓库'));
            // 创建一个包含所有option的数组，根据priorityCountry排序
            const sortedOptions = countries.map(country => {
                const option = $('<option></option>').val(country.country).text(country.name);
                // 仅在是优先国家时添加红色样式
                if (country.country === priorityCountry) {
                    option.css('color', 'red'); // 使用jQuery的css方法来设置样式
                }
                return { option, isPriority: country.country === priorityCountry };
            }).sort((a, b) => {
                // 如果a是优先国家且b不是，则a在前
                // 如果b是优先国家且a不是，则b在前
                // 如果都是或都不是优先国家，则按名称或其他逻辑排序（这里简化为不排序）
                if (a.isPriority && !b.isPriority) return -1;
                if (!a.isPriority && b.isPriority) return 1;
                return 0; // 这里可以添加更复杂的排序逻辑
            }).map(item => item.option);

            // 将排序后的option添加到select中
            sortedOptions.forEach(option => countrySelect.append(option));

            // 将select元素添加到目标元素中
            targetElement.prepend(countrySelect);
        }

        // 如果设置了优先国家，并且select元素已存在，则更新其位置和选中状态
        if (priorityCountry && countrySelect.length) {
            const priorityOption = countrySelect.find(`option[value='${priorityCountry}']`);
            if (priorityOption.length) {
                // 如果priorityOption不是第一个子元素，则将其移动到最前面并设置为选中状态
                if (!priorityOption.is(':first-child')) {
                    priorityOption.prependTo(countrySelect).prop('selected', true);
                } else {
                    // 如果它已经是第一个子元素，但仍然需要确保它被选中
                    priorityOption.prop('selected', true);
                }
            }
        }

    }

    // info页搜索框和按钮函数
    function initSearchUI(targetElement) {
        // 创建一个搜索框和一个按钮
        const searchBox = $('<input type="text" placeholder="请输入订单ID(带店铺前缀的订单号)" style="width:300px">');
        const searchButton = $('<button>查找</button>');

        // 将搜索框和按钮添加到目标元素的最顶部（作为子元素）
        targetElement.prepend(searchBox, searchButton);

        // 监听按钮点击事件
        searchButton.on('click', function () {
            const searchValue = searchBox.val().trim(); // 获取输入框中的订单ID

            localStorage.setItem('lastSearchValue', searchValue);
            //console.log("sssssssssssssssss已经存了", searchValue)
            // console.log(searchValue);
            fetchAndProcessData(searchValue);
        });
    }

    //info页sku搜索框
    function initCountrySelectSku(skuElement, selectId) {
        // 查找select元素

        let SkuSelect = skuElement.find('#' + selectId);

        // 如果select元素不存在，则创建并初始化
        if (!SkuSelect.length) {
            SkuSelect = $('<select id="' + selectId + '" style="width:300px"></select>');
            // 添加一个空白的默认选项
            SkuSelect.append($('<option></option>').val('').text('请选择sku'));
            // 将select元素添加到目标元素中
            skuElement.append(SkuSelect);
        }


    }

    //adress页搜索框
    function adressinitCountrySelect(targetElement, priorityCountry = null) {
        // 查找select元素
        let countrySelect = targetElement.find('select');

        // 如果select元素不存在，则创建并初始化
        if (!countrySelect.length) {
            countrySelect = $('<select id="selectaction1",style="width:300px"></select>');
            // 添加一个空白的默认选项
            countrySelect.append($('<option style = "color:red"></option>').val('').text('请选择国家，以上为推荐仓库'));
            // 创建一个包含所有option的数组，根据priorityCountry排序
            const sortedOptions = countries.map(country => {
                const option = $('<option></option>').val(country.country).text(country.name);
                // 仅在是优先国家时添加红色样式
                if (country.country === priorityCountry) {
                    option.css('color', 'red'); // 使用jQuery的css方法来设置样式
                }
                return { option, isPriority: country.country === priorityCountry };
            }).sort((a, b) => {
                // 如果a是优先国家且b不是，则a在前
                // 如果b是优先国家且a不是，则b在前
                // 如果都是或都不是优先国家，则按名称或其他逻辑排序（这里简化为不排序）
                if (a.isPriority && !b.isPriority) return -1;
                if (!a.isPriority && b.isPriority) return 1;
                return 0; // 这里可以添加更复杂的排序逻辑
            }).map(item => item.option);

            // 将排序后的option添加到select中
            sortedOptions.forEach(option => countrySelect.append(option));

            // 将select元素添加到目标元素中
            targetElement.prepend(countrySelect);
        }

        // 如果设置了优先国家，并且select元素已存在，则更新其位置和选中状态
        if (priorityCountry && countrySelect.length) {
            const priorityOption = countrySelect.find(`option[value='${priorityCountry}']`);
            if (priorityOption.length) {
                // 如果priorityOption不是第一个子元素，则将其移动到最前面并设置为选中状态
                if (!priorityOption.is(':first-child')) {
                    priorityOption.prependTo(countrySelect).prop('selected', true);
                } else {
                    // 如果它已经是第一个子元素，但仍然需要确保它被选中
                    priorityOption.prop('selected', true);
                }
            }
        }

    }
    //adress页搜索框和按钮函数
    function adressinitSearchUI(targetElement) {
        // 创建一个搜索框和一个按钮
        const searchBox = $('<input id="input1" type="text" placeholder="请输入订单ID(带店铺前缀的订单号)" style="width:300px">');
        const searchButton = $('<button id="button1">查找</button>');

        // 监听按钮点击事件
        searchButton.on('click', function () {
            const searchValue = searchBox.val().trim(); // 获取输入框中的订单ID
            // console.log(searchValue);
            adressfetchAndProcessData(searchValue);
        });

        // 将搜索框和按钮添加到目标元素的最顶部（作为子元素）
        targetElement.prepend(searchBox, searchButton);
        const lastinput = document.getElementById('input1');
        changeReactInputValue(lastinput, localStorage.getItem('lastSearchValue'));
        //console.log("正在自动填入")
        const lastbutton = document.getElementById('button1')
        //console.log(lastbutton)
        lastbutton.click()
    }
    //国家选择框选择函数
    function selectClickById(countryname, countrylocaltion) {
        const label = document.querySelector('label[for="' + countrylocaltion + '"]');
        label.click()
        const menuDiv = label.parentNode.parentNode.nextElementSibling.firstElementChild;
        const btns = menuDiv.querySelectorAll('button');
        // 遍历所有的button元素
        for (const btn of btns) {
            if (btn.innerText == countryname) {
                btn.click()
                break;
            }
        }

    }
    //点击函数
    // function simulateClickByClassName(className) {
    //     const element = document.querySelector(`.${className}`);
    //     if (element) {
    //         element.click();
    //     } else {
    //         console.error(`No element found with class name: ${className}`);
    //     }
    // }
    //调用下面这个函数可以给框架包装过的input框赋值
    //INPUT填写函数！！！！
    function changeReactInputValue(inputDom, newText) {
        let lastValue = inputDom.value;
        inputDom.value = newText;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = inputDom._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputDom.dispatchEvent(event);
    }
    // 封装GM_xmlhttpRequest为Promise
    //发送get请求到接口函数
    function makeGMRequest(method, url, data = null, headers) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                data: data,
                headers: headers,
                onload: function (response) {
                    resolve(response.responseText);
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }
    // 等待元素出现并执行回调
    //监控元素出现函数
    function waitForElement(selector, callback) {
        var checkExist = setInterval(function () {
            if ($(selector).length > 0) {
                //if (document.querySelector(selector)){

                clearInterval(checkExist);
                callback();
            }
        }, 100); // 每100毫秒检查一次，根据需要调整
    }


    function createInfo() {
        // 找到的元素
        const targetElement = $('#main-scrollable-window > article > main > section');
        const skuElement = $('#main-scrollable-window > article > main > section > form > div > div:nth-child(3) > span')

        // 初始化下拉选择框
        initCountrySelect(targetElement, null, "selectaction1")
        // 初始化搜索框和按钮
        initSearchUI(targetElement);
        //初始化sku下拉选择框
        initCountrySelectSku(skuElement, "selectaction2")
        // 获取 select 元素
        const selectElement = document.getElementById('selectaction1');
        // 添加事件监听器
        selectElement.addEventListener('change', function () {
            // 获取选中的 option 的 value
            const selectedValue = this.value;
            //获取选中的文本内容
            // 获取选中的 option 的文本内容
            const selectedOption = this.selectedOptions[0]; // 获取第一个选中的option，通常是唯一一个
            const optionText = selectedOption.textContent;
            // 调用函数进行赋值或其他操作
            // console.log("正在获取select点击值",selectedValue)
            // 获取所有具有类名 'css-1yp72kh' 的 div 元素
            // const fromCountryInputs = document.querySelectorAll('div.css-1yp72kh');


            const tocountry = "to.country"
            selectClickById(selectedValue, tocountry);

            const toinputElementById = document.getElementById('to.postalCode');
            const postcode = getPostcodeByNameAndCountry(optionText, selectedValue);
            changeReactInputValue(toinputElementById, postcode);
            changeReactInputValue(toinputElementById, postcode);

            setTimeout(() => {
                const label = document.querySelector('label[for="to.postalCode"]');
                const menuDiv = label.parentNode.parentNode.nextElementSibling.firstElementChild;
                const btns = menuDiv.querySelectorAll('button');
                if (btns.length > 0) {
                    btns[0].click();
                }
            }, 2000);
        });
        // 获取 select 元素
        const selectaction2 = document.getElementById('selectaction2');
        // 添加事件监听器
        selectaction2.addEventListener('change', function () {
            // 获取选中的 option 的 value
            const skuselectedValue = this.value;
            infoskusearch(skuselectedValue)
        });



    }

    function createAddress() {
        // 找到的元素
        const targetElement = $('#main-scrollable-window > article > main > section');

        // 初始化下拉选择框
        adressinitCountrySelect(targetElement)
        // 初始化搜索框和按钮sssssssssssssss
        adressinitSearchUI(targetElement);
        // 获取 select 元素
        const selectElement = document.getElementById('selectaction1');
        // 添加事件监听器
        selectElement.addEventListener('change', function () {
            // 获取选中的 option 的 value
            const selectedValue = this.value;
            //获取选中的文本内容
            // 获取选中的 option 的文本内容
            const selectedOption = this.selectedOptions[0]; // 获取第一个选中的option，通常是唯一一个
            const optionText = selectedOption.textContent;
            const inputElement = document.getElementById('input1');
            // 设置input事件监听器
            inputElement.addEventListener('input', function (event) {
                // 这里可以获取到输入框的当前值
                var currentValue = event.target.value;
                const updatedCountries = updateRecipientNamesWithSuffix(countries, currentValue);
                //搜索新表写入表格
                const newrecipientName = findRecipientNameByNameAndCountry(updatedCountries, optionText, selectedValue);
                const recipientname = newrecipientName.recipientname;
                const tfirstName = document.getElementById('to.firstName');
                changeReactInputValue(tfirstName, recipientname);
                const tlastName = document.getElementById('to.lastName');
                changeReactInputValue(tlastName, recipientname);

            });
            // 给name加上订单号
            const dingdanid = document.getElementById("input1").value
            const updatedCountries = updateRecipientNamesWithSuffix(countries, dingdanid);
            //搜索新表写入表格
            const newrecipientName = findRecipientNameByNameAndCountry(updatedCountries, optionText, selectedValue);
            const recipientname = newrecipientName.recipientname;
            const recipientphone = gettoByNameAndCountry(optionText, selectedValue).recipientphone;
            const recipientemail = gettoByNameAndCountry(optionText, selectedValue).recipientemail;
            const recipiententadress = gettoByNameAndCountry(optionText, selectedValue).recipiententadress;
            const tfirstName = document.getElementById('to.firstName');
            changeReactInputValue(tfirstName, recipientname);
            const tlastName = document.getElementById('to.lastName');
            changeReactInputValue(tlastName, recipientname);
            const temail = document.getElementById('to.email');
            changeReactInputValue(temail, recipientemail);
            const tphone = document.getElementById('to.phone');
            changeReactInputValue(tphone, recipientphone);
            const tstree = document.getElementById('to.street1');
            changeReactInputValue(tstree, recipiententadress);



        });
    }
    // 定义一个函数来修改数组中所有对象的recipientname，添加后缀
    function updateRecipientNamesWithSuffix(countries, suffix) {
        // 使用map函数来遍历数组并返回一个新的数组
        return countries.map(country => {
            // 复制对象（浅拷贝）
            const newCountry = { ...country };
            // 修改recipientname属性
            newCountry.recipientname += suffix;
            // 返回新的对象
            return newCountry;
        });
    }

    // 定义一个函数来查找具有特定name和country的对象，并返回其recipientname
    function findRecipientNameBycountry(countries, country) {
        const warehouse = countries.find(warehouse => warehouse.country === country);
        return warehouse; // 返回整个仓库对象或undefined
    }
    // 定义一个函数来查找具有特定name和country的对象，并返回其recipientname
    function findRecipientNameByNameAndCountry(countries, name, country) {
        const warehouse = countries.find(warehouse => warehouse.name === name && warehouse.country === country);
        return warehouse; // 返回整个仓库对象或undefined
    }
    //查找仓库信息
    function getwarehouseinformation(country) {
        const warehouse = countries.find(warehouse => warehouse.country === country);
        return warehouse; // 返回整个仓库对象或undefined
    }

    //查找收件人信息
    function gettoByNameAndCountry(name, country) {
        const warehouse = countries.find(warehouse => warehouse.name === name && warehouse.country === country);
        return warehouse; // 返回整个仓库对象或undefined
    }


    function getPostcodeByNameAndCountry(name, country) {
        const warehouse = countries.find(warehouse => warehouse.name === name && warehouse.country === country);
        return warehouse ? warehouse.postcode : null; // 如果找到了仓库，就返回postcode，否则返回null
    }
    // 定义一些国家名称和对应的值
    const countries = [

        { name: 'MS-ZY美西仓', country: 'USA', postcode: '91710 - Chino', recipientname: 'return+ce+611+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: 'C/O 13725 Pipeline Ave, Chino, CA, 91710' },
        { name: 'MS-ZY美东仓', country: 'USA', postcode: '08016 - Burlington', recipientname: 'return+ce+611+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: '美国 C/O 1620 River Rd，unit A（A1-A8）' },
        { name: 'MS-DE德国仓', country: 'Germany', postcode: '53881 - Euskirchen', recipientname: 'return+ce+611+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: '德国 C/O Heinrich-Barth-Str. 18' },
        { name: 'MS-CZ捷克仓', country: 'Czech Republic', postcode: '252 61 - Dobrovíz', recipientname: 'Return JKCE+611+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: 'C/O Logicor Park Prague Airport' },
        { name: 'MS-FR法国仓', country: 'France', postcode: '60440 - Nanteuil-le-Haudouin', recipientname: 'return+ce+611+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: 'C/O 7 rue de la Demi-lune' },
        { name: 'MS-UK英国仓', country: 'United Kingdom', postcode: 'WS11 1SL - Cannock', recipientname: 'return+ce+5379+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: 'C/O Jupiter,Unit 1 Watling Street, Kingswood Lakeside' },
        { name: 'MS-ES西班牙仓', country: 'Spain - Mainland', postcode: '28042 - Madrid', recipientname: 'return+ce+611+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: '西班牙 C/O av central 34, nave b,c' },
        { name: 'MS-AU澳洲新仓', country: 'Australia', postcode: '3153 - Bayswater', recipientname: 'Return CE+611+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: 'PO BOX 4001, BAYSWATER, VIC' },
        { name: 'MS-IT意大利仓', country: 'Italy', postcode: '10156 - Torino', recipientname: 'return+ce+611+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: '意大利 C/O Magazzino 10, S.com. da Bertolla all’abbadia 176' },
        { name: 'MS-ZY-CA加拿大仓', country: 'Canada', postcode: 'L6T 5S2 - Brampton', recipientname: 'return+ce+611+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: '加拿大 C/O 5 Paget Rd 城市：Brampton' },
        { name: 'LWP-AU(AU Post之外的服务退件地址)', country: 'Australia', postcode: '2142 - South Granville', recipientname: 'Online Seller RMA+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: ' #80695295，Warehouse 2, 54 Ferndell St, South Granville  AU' },
        { name: 'LWP-AU(AU Post的服务商退件地址)', country: 'Australia', postcode: '2052 - University of New South Wales', recipientname: 'Union Lucky Returns+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: 'Union Lucky Returns ,  P O Box 6008  #80695295 ,  CHULLORA  New South Wales   AU' },
        { name: 'LWP-US-WC(西)', country: 'USA', postcode: '91789 - City of Industry', recipientname: 'RMA Department+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: '131 Marcellin Dr  #80695295 ,  City of Industry  California   US' },
        { name: 'LWP-US-KY(东）', country: 'USA', postcode: '41048 - Hebron', recipientname: 'return+ce+611+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: 'Online Seller RMA ,  2125 Gateway Blvd  #80695295 ,  Hebron  Kentucky  US  邮编：41048' },
        { name: 'GR-DE', country: 'Germany', postcode: '28197 - Bremen', recipientname: 'Online Seller +', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: '#60864987 ,  Ludwig-Erhard-Str. 2 ,   Bremen ,  -  DE' },
        { name: 'GR-UKGF', country: 'United Kingdom', postcode: 'LE3 8DX - Glenfield', recipientname: 'Online Seller +', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: 'Warehouse1, Mill Lane Industrial Estate  #60864987 ,  Glenfield  Leicestershire   UK ' },
        { name: 'RS-PL波兰仓', country: 'Poland', postcode: '69-100 - Świecko', recipientname: 'SR WHPL-EC0425-RMA+', recipientphone: '2134593517', recipientemail: 'cqgg.logistics@maxpeedingrods.cn', recipiententadress: 'Swiecko43B ，69-100，  Świecko， Poland' },
    ];

    const countryCodeToInfo = { "CN": { "alpha_3_code": "CHN", "numeric_code": "156", "country": "China", "country_name_cn": "中国" }, "AD": { "alpha_3_code": "AND", "numeric_code": "020", "country": "Andorra", "country_name_cn": "安道尔" }, "AE": { "alpha_3_code": "ARE", "numeric_code": "784", "country": "United Arab Emirates", "country_name_cn": "阿联酋" }, "AF": { "alpha_3_code": "AFG", "numeric_code": "004", "country": "Afghanistan", "country_name_cn": "阿富汗" }, "AG": { "alpha_3_code": "ATG", "numeric_code": "028", "country": "Antigua and Barbuda", "country_name_cn": "安提瓜和巴布达" }, "AI": { "alpha_3_code": "AIA", "numeric_code": "660", "country": "Anguilla", "country_name_cn": "安圭拉" }, "AL": { "alpha_3_code": "ALB", "numeric_code": "008", "country": "Albania", "country_name_cn": "阿尔巴尼亚" }, "AM": { "alpha_3_code": "ARM", "numeric_code": "051", "country": "Armenia", "country_name_cn": "亚美尼亚" }, "AO": { "alpha_3_code": "AGO", "numeric_code": "024", "country": "Angola", "country_name_cn": "安哥拉" }, "AQ": { "alpha_3_code": "ATA", "numeric_code": "010", "country": "Antarctica", "country_name_cn": "南极洲" }, "AR": { "alpha_3_code": "ARG", "numeric_code": "032", "country": "Argentina", "country_name_cn": "阿根廷" }, "AS": { "alpha_3_code": "ASM", "numeric_code": "016", "country": "American Samoa", "country_name_cn": "美属萨摩亚" }, "AT": { "alpha_3_code": "AUT", "numeric_code": "040", "country": "Austria", "country_name_cn": "奥地利" }, "AU": { "alpha_3_code": "AUS", "numeric_code": "036", "country": "Australia", "country_name_cn": "澳大利亚" }, "AW": { "alpha_3_code": "ABW", "numeric_code": "533", "country": "Aruba", "country_name_cn": "阿鲁巴" }, "AX": { "alpha_3_code": "ALA", "numeric_code": "248", "country": "Åland Islands", "country_name_cn": "奥兰群岛" }, "AZ": { "alpha_3_code": "AZE", "numeric_code": "031", "country": "Azerbaijan", "country_name_cn": "阿塞拜疆" }, "BA": { "alpha_3_code": "BIH", "numeric_code": "070", "country": "Bosnia and Herzegovina", "country_name_cn": "波黑" }, "BB": { "alpha_3_code": "BRB", "numeric_code": "052", "country": "Barbados", "country_name_cn": "巴巴多斯" }, "BD": { "alpha_3_code": "BGD", "numeric_code": "050", "country": "Bangladesh", "country_name_cn": "孟加拉" }, "BE": { "alpha_3_code": "BEL", "numeric_code": "056", "country": "Belgium", "country_name_cn": "比利时" }, "BF": { "alpha_3_code": "BFA", "numeric_code": "854", "country": "Burkina", "country_name_cn": "布基纳法索" }, "BG": { "alpha_3_code": "BGR", "numeric_code": "100", "country": "Bulgaria", "country_name_cn": "保加利亚" }, "BH": { "alpha_3_code": "BHR", "numeric_code": "048", "country": "Bahrain", "country_name_cn": "巴林" }, "BI": { "alpha_3_code": "BDI", "numeric_code": "108", "country": "Burundi", "country_name_cn": "布隆迪" }, "BJ": { "alpha_3_code": "BEN", "numeric_code": "204", "country": "Benin", "country_name_cn": "贝宁" }, "BL": { "alpha_3_code": "BLM", "numeric_code": "652", "country": "Saint Barthélemy", "country_name_cn": "圣巴泰勒米岛" }, "BM": { "alpha_3_code": "BMU", "numeric_code": "060", "country": "Bermuda", "country_name_cn": "百慕大" }, "BN": { "alpha_3_code": "BRN", "numeric_code": "096", "country": "Brunei", "country_name_cn": "文莱" }, "BO": { "alpha_3_code": "BOL", "numeric_code": "068", "country": "Bolivia", "country_name_cn": "玻利维亚" }, "BQ": { "alpha_3_code": "BES", "numeric_code": "535", "country": "Caribbean Netherlands", "country_name_cn": "荷兰加勒比区" }, "BR": { "alpha_3_code": "BRA", "numeric_code": "076", "country": "Brazil", "country_name_cn": "巴西" }, "BS": { "alpha_3_code": "BHS", "numeric_code": "044", "country": "The Bahamas", "country_name_cn": "巴哈马" }, "BT": { "alpha_3_code": "BTN", "numeric_code": "064", "country": "Bhutan", "country_name_cn": "不丹" }, "BV": { "alpha_3_code": "BVT", "numeric_code": "074", "country": "Bouvet Island", "country_name_cn": "布韦岛" }, "BW": { "alpha_3_code": "BWA", "numeric_code": "072", "country": "Botswana", "country_name_cn": "博茨瓦纳" }, "BY": { "alpha_3_code": "BLR", "numeric_code": "112", "country": "Belarus", "country_name_cn": "白俄罗斯" }, "BZ": { "alpha_3_code": "BLZ", "numeric_code": "084", "country": "Belize", "country_name_cn": "伯利兹" }, "CA": { "alpha_3_code": "CAN", "numeric_code": "124", "country": "Canada", "country_name_cn": "加拿大" }, "CC": { "alpha_3_code": "CCK", "numeric_code": "166", "country": "Cocos (Keeling) Islands", "country_name_cn": "科科斯群岛" }, "CF": { "alpha_3_code": "CAF", "numeric_code": "140", "country": "Central African Republic", "country_name_cn": "中非" }, "CH": { "alpha_3_code": "CHE", "numeric_code": "756", "country": "Switzerland", "country_name_cn": "瑞士" }, "CL": { "alpha_3_code": "CHL", "numeric_code": "152", "country": "Chile", "country_name_cn": "智利" }, "CM": { "alpha_3_code": "CMR", "numeric_code": "120", "country": "Cameroon", "country_name_cn": "喀麦隆" }, "CO": { "alpha_3_code": "COL", "numeric_code": "170", "country": "Colombia", "country_name_cn": "哥伦比亚" }, "CR": { "alpha_3_code": "CRI", "numeric_code": "188", "country": "Costa Rica", "country_name_cn": "哥斯达黎加" }, "CU": { "alpha_3_code": "CUB", "numeric_code": "192", "country": "Cuba", "country_name_cn": "古巴" }, "CV": { "alpha_3_code": "CPV", "numeric_code": "132", "country": "Cape Verde", "country_name_cn": "佛得角" }, "CX": { "alpha_3_code": "CXR", "numeric_code": "162", "country": "Christmas Island", "country_name_cn": "圣诞岛" }, "CY": { "alpha_3_code": "CYP", "numeric_code": "196", "country": "Cyprus", "country_name_cn": "塞浦路斯" }, "CZ": { "alpha_3_code": "CZE", "numeric_code": "203", "country": "Czech Republic", "country_name_cn": "捷克" }, "DE": { "alpha_3_code": "DEU", "numeric_code": "276", "country": "Germany", "country_name_cn": "德国" }, "DJ": { "alpha_3_code": "DJI", "numeric_code": "262", "country": "Djibouti", "country_name_cn": "吉布提" }, "DK": { "alpha_3_code": "DNK", "numeric_code": "208", "country": "Denmark", "country_name_cn": "丹麦" }, "DM": { "alpha_3_code": "DMA", "numeric_code": "212", "country": "Dominica", "country_name_cn": "多米尼克" }, "DO": { "alpha_3_code": "DOM", "numeric_code": "214", "country": "Dominican Republic", "country_name_cn": "多米尼加" }, "DZ": { "alpha_3_code": "DZA", "numeric_code": "012", "country": "Algeria", "country_name_cn": "阿尔及利亚" }, "EC": { "alpha_3_code": "ECU", "numeric_code": "218", "country": "Ecuador", "country_name_cn": "厄瓜多尔" }, "EE": { "alpha_3_code": "EST", "numeric_code": "233", "country": "Estonia", "country_name_cn": "爱沙尼亚" }, "EG": { "alpha_3_code": "EGY", "numeric_code": "818", "country": "Egypt", "country_name_cn": "埃及" }, "EH": { "alpha_3_code": "ESH", "numeric_code": "732", "country": "Western Sahara", "country_name_cn": "西撒哈拉" }, "ER": { "alpha_3_code": "ERI", "numeric_code": "232", "country": "Eritrea", "country_name_cn": "厄立特里亚" }, "ES": { "alpha_3_code": "ESP", "numeric_code": "724", "country": "Spain - Mainland", "country_name_cn": "西班牙" }, "FI": { "alpha_3_code": "FIN", "numeric_code": "246", "country": "Finland", "country_name_cn": "芬兰" }, "FJ": { "alpha_3_code": "FJI", "numeric_code": "242", "country": "Fiji", "country_name_cn": "斐济群岛" }, "FK": { "alpha_3_code": "FLK", "numeric_code": "238", "country": "Falkland Islands", "country_name_cn": "马尔维纳斯群岛（ 福克兰）" }, "FM": { "alpha_3_code": "FSM", "numeric_code": "583", "country": "Federated States of Micronesia", "country_name_cn": "密克罗尼西亚联邦" }, "FO": { "alpha_3_code": "FRO", "numeric_code": "234", "country": "Faroe Islands", "country_name_cn": "法罗群岛" }, "FR": { "alpha_3_code": "FRA", "numeric_code": "250", "country": "France", "country_name_cn": "法国" }, "GA": { "alpha_3_code": "GAB", "numeric_code": "266", "country": "Gabon", "country_name_cn": "加蓬" }, "GD": { "alpha_3_code": "GRD", "numeric_code": "308", "country": "Grenada", "country_name_cn": "格林纳达" }, "GE": { "alpha_3_code": "GEO", "numeric_code": "268", "country": "Georgia", "country_name_cn": "格鲁吉亚" }, "GF": { "alpha_3_code": "GUF", "numeric_code": "254", "country": "French Guiana", "country_name_cn": "法属圭亚那" }, "GH": { "alpha_3_code": "GHA", "numeric_code": "288", "country": "Ghana", "country_name_cn": "加纳" }, "GI": { "alpha_3_code": "GIB", "numeric_code": "292", "country": "Gibraltar", "country_name_cn": "直布罗陀" }, "GL": { "alpha_3_code": "GRL", "numeric_code": "304", "country": "Greenland", "country_name_cn": "格陵兰" }, "GN": { "alpha_3_code": "GIN", "numeric_code": "324", "country": "Guinea", "country_name_cn": "几内亚" }, "GP": { "alpha_3_code": "GLP", "numeric_code": "312", "country": "Guadeloupe", "country_name_cn": "瓜德罗普" }, "GQ": { "alpha_3_code": "GNQ", "numeric_code": "226", "country": "Equatorial Guinea", "country_name_cn": "赤道几内亚" }, "GR": { "alpha_3_code": "GRC", "numeric_code": "300", "country": "Greece", "country_name_cn": "希腊" }, "GS": { "alpha_3_code": "SGS", "numeric_code": "239", "country": "South Georgia and the South Sandwich Islands", "country_name_cn": "南乔治亚岛和南桑威奇群岛" }, "GT": { "alpha_3_code": "GTM", "numeric_code": "320", "country": "Guatemala", "country_name_cn": "危地马拉" }, "GU": { "alpha_3_code": "GUM", "numeric_code": "316", "country": "Guam", "country_name_cn": "关岛" }, "GW": { "alpha_3_code": "GNB", "numeric_code": "624", "country": "Guinea-Bissau", "country_name_cn": "几内亚比绍" }, "GY": { "alpha_3_code": "GUY", "numeric_code": "328", "country": "Guyana", "country_name_cn": "圭亚那" }, "HK": { "alpha_3_code": "HKG", "numeric_code": "344", "country": "Hong Kong", "country_name_cn": "香港" }, "HM": { "alpha_3_code": "HMD", "numeric_code": "334", "country": "Heard Island and McDonald Islands", "country_name_cn": "赫德岛和麦克唐纳群岛" }, "HN": { "alpha_3_code": "HND", "numeric_code": "340", "country": "Honduras", "country_name_cn": "洪都拉斯" }, "HR": { "alpha_3_code": "HRV", "numeric_code": "191", "country": "Croatia", "country_name_cn": "克罗地亚" }, "HT": { "alpha_3_code": "HTI", "numeric_code": "332", "country": "Haiti", "country_name_cn": "海地" }, "HU": { "alpha_3_code": "HUN", "numeric_code": "348", "country": "Hungary", "country_name_cn": "匈牙利" }, "ID": { "alpha_3_code": "IDN", "numeric_code": "360", "country": "Indonesia", "country_name_cn": "印尼" }, "IE": { "alpha_3_code": "IRL", "numeric_code": "372", "country": "Ireland", "country_name_cn": "爱尔兰" }, "IL": { "alpha_3_code": "ISR", "numeric_code": "376", "country": "Israel", "country_name_cn": "以色列" }, "IM": { "alpha_3_code": "IMN", "numeric_code": "833", "country": "Isle of Man", "country_name_cn": "马恩岛" }, "IN": { "alpha_3_code": "IND", "numeric_code": "356", "country": "India", "country_name_cn": "印度" }, "IO": { "alpha_3_code": "IOT", "numeric_code": "086", "country": "British Indian Ocean Territory", "country_name_cn": "英属印度洋领地" }, "IQ": { "alpha_3_code": "IRQ", "numeric_code": "368", "country": "Iraq", "country_name_cn": "伊拉克" }, "IR": { "alpha_3_code": "IRN", "numeric_code": "364", "country": "Iran", "country_name_cn": "伊朗" }, "IS": { "alpha_3_code": "ISL", "numeric_code": "352", "country": "Iceland", "country_name_cn": "冰岛" }, "IT": { "alpha_3_code": "ITA", "numeric_code": "380", "country": "Italy", "country_name_cn": "意大利" }, "JE": { "alpha_3_code": "JEY", "numeric_code": "832", "country": "Jersey", "country_name_cn": "泽西岛" }, "JM": { "alpha_3_code": "JAM", "numeric_code": "388", "country": "Jamaica", "country_name_cn": "牙买加" }, "JO": { "alpha_3_code": "JOR", "numeric_code": "400", "country": "Jordan", "country_name_cn": "约旦" }, "JP": { "alpha_3_code": "JPN", "numeric_code": "392", "country": "Japan", "country_name_cn": "日本" }, "KH": { "alpha_3_code": "KHM", "numeric_code": "116", "country": "Cambodia", "country_name_cn": "柬埔寨" }, "KI": { "alpha_3_code": "KIR", "numeric_code": "296", "country": "Kiribati", "country_name_cn": "基里巴斯" }, "KM": { "alpha_3_code": "COM", "numeric_code": "174", "country": "The Comoros", "country_name_cn": "科摩罗" }, "KW": { "alpha_3_code": "KWT", "numeric_code": "414", "country": "Kuwait", "country_name_cn": "科威特" }, "KY": { "alpha_3_code": "CYM", "numeric_code": "136", "country": "Cayman Islands", "country_name_cn": "开曼群岛" }, "LB": { "alpha_3_code": "LBN", "numeric_code": "422", "country": "Lebanon", "country_name_cn": "黎巴嫩" }, "LI": { "alpha_3_code": "LIE", "numeric_code": "438", "country": "Liechtenstein", "country_name_cn": "列支敦士登" }, "LK": { "alpha_3_code": "LKA", "numeric_code": "144", "country": "Sri Lanka", "country_name_cn": "斯里兰卡" }, "LR": { "alpha_3_code": "LBR", "numeric_code": "430", "country": "Liberia", "country_name_cn": "利比里亚" }, "LS": { "alpha_3_code": "LSO", "numeric_code": "426", "country": "Lesotho", "country_name_cn": "莱索托" }, "LT": { "alpha_3_code": "LTU", "numeric_code": "440", "country": "Lithuania", "country_name_cn": "立陶宛" }, "LU": { "alpha_3_code": "LUX", "numeric_code": "442", "country": "Luxembourg", "country_name_cn": "卢森堡" }, "LV": { "alpha_3_code": "LVA", "numeric_code": "428", "country": "Latvia", "country_name_cn": "拉脱维亚" }, "LY": { "alpha_3_code": "LBY", "numeric_code": "434", "country": "Libya", "country_name_cn": "利比亚" }, "MA": { "alpha_3_code": "MAR", "numeric_code": "504", "country": "Morocco", "country_name_cn": "摩洛哥" }, "MC": { "alpha_3_code": "MCO", "numeric_code": "492", "country": "Monaco", "country_name_cn": "摩纳哥" }, "MD": { "alpha_3_code": "MDA", "numeric_code": "498", "country": "Moldova", "country_name_cn": "摩尔多瓦" }, "ME": { "alpha_3_code": "MNE", "numeric_code": "499", "country": "Montenegro", "country_name_cn": "黑山" }, "MF": { "alpha_3_code": "MAF", "numeric_code": "663", "country": "Saint Martin （France）", "country_name_cn": "法属圣马丁" }, "MG": { "alpha_3_code": "MDG", "numeric_code": "450", "country": "Madagascar", "country_name_cn": "马达加斯加" }, "MH": { "alpha_3_code": "MHL", "numeric_code": "584", "country": "Marshall islands", "country_name_cn": "马绍尔群岛" }, "MK": { "alpha_3_code": "MKD", "numeric_code": "807", "country": "Republic of Macedonia （FYROM", "country_name_cn": "马其顿" }, "ML": { "alpha_3_code": "MLI", "numeric_code": "466", "country": "Mali", "country_name_cn": "马里" }, "MM": { "alpha_3_code": "MMR", "numeric_code": "104", "country": "Myanmar （Burma）", "country_name_cn": "缅甸" }, "MO": { "alpha_3_code": "MAC", "numeric_code": "446", "country": "Macao", "country_name_cn": "澳门" }, "MQ": { "alpha_3_code": "MTQ", "numeric_code": "474", "country": "Martinique", "country_name_cn": "马提尼克" }, "MR": { "alpha_3_code": "MRT", "numeric_code": "478", "country": "Mauritania", "country_name_cn": "毛里塔尼亚" }, "MS": { "alpha_3_code": "MSR", "numeric_code": "500", "country": "Montserrat", "country_name_cn": "蒙塞拉特岛" }, "MT": { "alpha_3_code": "MLT", "numeric_code": "470", "country": "Malta", "country_name_cn": "马耳他" }, "MV": { "alpha_3_code": "MDV", "numeric_code": "462", "country": "Maldives", "country_name_cn": "马尔代夫" }, "MW": { "alpha_3_code": "MWI", "numeric_code": "454", "country": "Malawi", "country_name_cn": "马拉维" }, "MX": { "alpha_3_code": "MEX", "numeric_code": "484", "country": "Mexico", "country_name_cn": "墨西哥" }, "MY": { "alpha_3_code": "MYS", "numeric_code": "458", "country": "Malaysia", "country_name_cn": "马来西亚" }, "NA": { "alpha_3_code": "NAM", "numeric_code": "516", "country": "Namibia", "country_name_cn": "纳米比亚" }, "NE": { "alpha_3_code": "NER", "numeric_code": "562", "country": "Niger", "country_name_cn": "尼日尔" }, "NF": { "alpha_3_code": "NFK", "numeric_code": "574", "country": "Norfolk Island", "country_name_cn": "诺福克岛" }, "NG": { "alpha_3_code": "NGA", "numeric_code": "566", "country": "Nigeria", "country_name_cn": "尼日利亚" }, "NI": { "alpha_3_code": "NIC", "numeric_code": "558", "country": "Nicaragua", "country_name_cn": "尼加拉瓜" }, "NL": { "alpha_3_code": "NLD", "numeric_code": "528", "country": "Netherlands", "country_name_cn": "荷兰" }, "NO": { "alpha_3_code": "NOR", "numeric_code": "578", "country": "Norway", "country_name_cn": "挪威" }, "NP": { "alpha_3_code": "NPL", "numeric_code": "524", "country": "Nepal", "country_name_cn": "尼泊尔" }, "NR": { "alpha_3_code": "NRU", "numeric_code": "520", "country": "Nauru", "country_name_cn": "瑙鲁" }, "OM": { "alpha_3_code": "OMN", "numeric_code": "512", "country": "Oman", "country_name_cn": "阿曼" }, "PA": { "alpha_3_code": "PAN", "numeric_code": "591", "country": "Panama", "country_name_cn": "巴拿马" }, "PE": { "alpha_3_code": "PER", "numeric_code": "604", "country": "Peru", "country_name_cn": "秘鲁" }, "PF": { "alpha_3_code": "PYF", "numeric_code": "258", "country": "French polynesia", "country_name_cn": "法属波利尼西" }, "PG": { "alpha_3_code": "PNG", "numeric_code": "598", "country": "Papua New Guinea", "country_name_cn": "巴布亚新几内亚" }, "PH": { "alpha_3_code": "PHL", "numeric_code": "608", "country": "The Philippines", "country_name_cn": "菲律宾" }, "PK": { "alpha_3_code": "PAK", "numeric_code": "586", "country": "Pakistan", "country_name_cn": "巴基斯坦" }, "PL": { "alpha_3_code": "POL", "numeric_code": "616", "country": "Poland", "country_name_cn": "波兰" }, "PN": { "alpha_3_code": "PCN", "numeric_code": "612", "country": "Pitcairn Islands", "country_name_cn": "皮特凯恩群岛" }, "PR": { "alpha_3_code": "PRI", "numeric_code": "630", "country": "Puerto Rico", "country_name_cn": "波多黎各" }, "PS": { "alpha_3_code": "PSE", "numeric_code": "275", "country": "Palestinian territories", "country_name_cn": "巴勒斯坦" }, "PW": { "alpha_3_code": "PLW", "numeric_code": "585", "country": "Palau", "country_name_cn": "帕劳" }, "PY": { "alpha_3_code": "PRY", "numeric_code": "600", "country": "Paraguay", "country_name_cn": "巴拉圭" }, "QA": { "alpha_3_code": "QAT", "numeric_code": "634", "country": "Qatar", "country_name_cn": "卡塔尔" }, "RE": { "alpha_3_code": "REU", "numeric_code": "638", "country": "Réunion", "country_name_cn": "留尼汪" }, "RO": { "alpha_3_code": "ROU", "numeric_code": "642", "country": "Romania", "country_name_cn": "罗马尼亚" }, "RS": { "alpha_3_code": "SRB", "numeric_code": "688", "country": "Serbia", "country_name_cn": "塞尔维亚" }, "RU": { "alpha_3_code": "RUS", "numeric_code": "643", "country": "Russian Federation", "country_name_cn": "俄罗斯" }, "RW": { "alpha_3_code": "RWA", "numeric_code": "646", "country": "Rwanda", "country_name_cn": "卢旺达" }, "SB": { "alpha_3_code": "SLB", "numeric_code": "090", "country": "Solomon Islands", "country_name_cn": "所罗门群岛" }, "SC": { "alpha_3_code": "SYC", "numeric_code": "690", "country": "Seychelles", "country_name_cn": "塞舌尔" }, "SD": { "alpha_3_code": "SDN", "numeric_code": "729", "country": "Sudan", "country_name_cn": "苏丹" }, "SE": { "alpha_3_code": "SWE", "numeric_code": "752", "country": "Sweden", "country_name_cn": "瑞典" }, "SG": { "alpha_3_code": "SGP", "numeric_code": "702", "country": "Singapore", "country_name_cn": "新加坡" }, "SI": { "alpha_3_code": "SVN", "numeric_code": "705", "country": "Slovenia", "country_name_cn": "斯洛文尼亚" }, "SJ": { "alpha_3_code": "SJM", "numeric_code": "744", "country": "Template:Country data SJM Svalbard", "country_name_cn": "斯瓦尔巴群岛和 扬马延岛" }, "SK": { "alpha_3_code": "SVK", "numeric_code": "703", "country": "Slovakia", "country_name_cn": "斯洛伐克" }, "SL": { "alpha_3_code": "SLE", "numeric_code": "694", "country": "Sierra Leone", "country_name_cn": "塞拉利昂" }, "SM": { "alpha_3_code": "SMR", "numeric_code": "674", "country": "San Marino", "country_name_cn": "圣马力诺" }, "SN": { "alpha_3_code": "SEN", "numeric_code": "686", "country": "Senegal", "country_name_cn": "塞内加尔" }, "SO": { "alpha_3_code": "SOM", "numeric_code": "706", "country": "Somalia", "country_name_cn": "索马里" }, "SR": { "alpha_3_code": "SUR", "numeric_code": "740", "country": "Suriname", "country_name_cn": "苏里南" }, "SS": { "alpha_3_code": "SSD", "numeric_code": "728", "country": "South Sudan", "country_name_cn": "南苏丹" }, "ST": { "alpha_3_code": "STP", "numeric_code": "678", "country": "Sao Tome and Principe", "country_name_cn": "圣多美和普林西比" }, "SV": { "alpha_3_code": "SLV", "numeric_code": "222", "country": "El Salvador", "country_name_cn": "萨尔瓦多" }, "SY": { "alpha_3_code": "SYR", "numeric_code": "760", "country": "Syria", "country_name_cn": "叙利亚" }, "SZ": { "alpha_3_code": "SWZ", "numeric_code": "748", "country": "Swaziland", "country_name_cn": "斯威士兰" }, "TC": { "alpha_3_code": "TCA", "numeric_code": "796", "country": "Turks and Caicos Islands", "country_name_cn": "特克斯和凯科斯群岛" }, "TD": { "alpha_3_code": "TCD", "numeric_code": "148", "country": "Chad", "country_name_cn": "乍得" }, "TG": { "alpha_3_code": "TGO", "numeric_code": "768", "country": "Togo", "country_name_cn": "多哥" }, "TH": { "alpha_3_code": "THA", "numeric_code": "764", "country": "Thailand", "country_name_cn": "泰国" }, "TK": { "alpha_3_code": "TKL", "numeric_code": "772", "country": "Tokelau", "country_name_cn": "托克劳" }, "TL": { "alpha_3_code": "TLS", "numeric_code": "626", "country": "Timor-Leste （East Timor）", "country_name_cn": "东帝汶" }, "TN": { "alpha_3_code": "TUN", "numeric_code": "788", "country": "Tunisia", "country_name_cn": "突尼斯" }, "TO": { "alpha_3_code": "TON", "numeric_code": "776", "country": "Tonga", "country_name_cn": "汤加" }, "TR": { "alpha_3_code": "TUR", "numeric_code": "792", "country": "Turkey", "country_name_cn": "土耳其" }, "TV": { "alpha_3_code": "TUV", "numeric_code": "798", "country": "Tuvalu", "country_name_cn": "图瓦卢" }, "TZ": { "alpha_3_code": "TZA", "numeric_code": "834", "country": "Tanzania", "country_name_cn": "坦桑尼亚" }, "UA": { "alpha_3_code": "UKR", "numeric_code": "804", "country": "Ukraine", "country_name_cn": "乌克兰" }, "UG": { "alpha_3_code": "UGA", "numeric_code": "800", "country": "Uganda", "country_name_cn": "乌干达" }, "US": { "alpha_3_code": "USA", "numeric_code": "840", "country": "USA", "country_name_cn": "美国" }, "UY": { "alpha_3_code": "URY", "numeric_code": "858", "country": "Uruguay", "country_name_cn": "乌拉圭" }, "VA": { "alpha_3_code": "VAT", "numeric_code": "336", "country": "Vatican City （The Holy See）", "country_name_cn": "梵蒂冈" }, "VE": { "alpha_3_code": "VEN", "numeric_code": "862", "country": "Venezuela", "country_name_cn": "委内瑞拉" }, "VG": { "alpha_3_code": "VGB", "numeric_code": "092", "country": "British Virgin Islands", "country_name_cn": "英属维尔京群岛" }, "VI": { "alpha_3_code": "VIR", "numeric_code": "850", "country": "United States Virgin Islands", "country_name_cn": "美属维尔京群岛" }, "VN": { "alpha_3_code": "VNM", "numeric_code": "704", "country": "Vietnam", "country_name_cn": "越南" }, "WF": { "alpha_3_code": "WLF", "numeric_code": "876", "country": "Wallis and Futuna", "country_name_cn": "瓦利斯和富图纳" }, "WS": { "alpha_3_code": "WSM", "numeric_code": "882", "country": "Samoa", "country_name_cn": "萨摩亚" }, "YE": { "alpha_3_code": "YEM", "numeric_code": "887", "country": "Yemen", "country_name_cn": "也门" }, "YT": { "alpha_3_code": "MYT", "numeric_code": "175", "country": "Mayotte", "country_name_cn": "马约特" }, "ZA": { "alpha_3_code": "ZAF", "numeric_code": "710", "country": "South Africa", "country_name_cn": "南非" }, "ZM": { "alpha_3_code": "ZMB", "numeric_code": "894", "country": "Zambia", "country_name_cn": "赞比亚" }, "ZW": { "alpha_3_code": "ZWE", "numeric_code": "716", "country": "Zimbabwe", "country_name_cn": "津巴布韦" }, "CG": { "alpha_3_code": "COG", "numeric_code": "178", "country": "Republic of the Congo", "country_name_cn": "刚果（布）" }, "CD": { "alpha_3_code": "COD", "numeric_code": "180", "country": "Democratic Republic of the Congo", "country_name_cn": "刚果（金）" }, "MZ": { "alpha_3_code": "MOZ", "numeric_code": "508", "country": "Mozambique", "country_name_cn": "莫桑比克" }, "GG": { "alpha_3_code": "GGY", "numeric_code": "831", "country": "Guernsey", "country_name_cn": "根西岛" }, "GM": { "alpha_3_code": "GMB", "numeric_code": "270", "country": "Gambia", "country_name_cn": "冈比亚" }, "MP": { "alpha_3_code": "MNP", "numeric_code": "580", "country": "Northern Mariana Islands", "country_name_cn": "北马里亚纳群岛" }, "ET": { "alpha_3_code": "ETH", "numeric_code": "231", "country": "Ethiopia", "country_name_cn": "埃塞俄比亚" }, "NC": { "alpha_3_code": "NCL", "numeric_code": "540", "country": "New Caledonia", "country_name_cn": "新喀里多尼亚" }, "VU": { "alpha_3_code": "VUT", "numeric_code": "548", "country": "Vanuatu", "country_name_cn": "瓦努阿图" }, "TF": { "alpha_3_code": "ATF", "numeric_code": "260", "country": "French Southern Territories", "country_name_cn": "法属南部领地" }, "NU": { "alpha_3_code": "NIU", "numeric_code": "570", "country": "Niue", "country_name_cn": "纽埃" }, "UM": { "alpha_3_code": "UMI", "numeric_code": "581", "country": "United States Minor Outlying Islands", "country_name_cn": "美国本土外小岛屿" }, "CK": { "alpha_3_code": "COK", "numeric_code": "184", "country": "Cook Islands", "country_name_cn": "库克群岛" }, "GB": { "alpha_3_code": "GBR", "numeric_code": "826", "country": "United Kingdom", "country_name_cn": "英国" }, "TT": { "alpha_3_code": "TTO", "numeric_code": "780", "country": "Trinidad and Tobago", "country_name_cn": "特立尼达和多巴哥" }, "VC": { "alpha_3_code": "VCT", "numeric_code": "670", "country": "St. Vincent and the Grenadines", "country_name_cn": "圣文森特和格林纳丁斯" }, "TW": { "alpha_3_code": "TWN", "numeric_code": "158", "country": "Taiwan", "country_name_cn": "台湾地区/ 台湾省" }, "NZ": { "alpha_3_code": "NZL", "numeric_code": "554", "country": "New Zealand", "country_name_cn": "新西兰" }, "SA": { "alpha_3_code": "SAU", "numeric_code": "682", "country": "Saudi Arabia", "country_name_cn": "沙特阿拉伯" }, "LA": { "alpha_3_code": "LAO", "numeric_code": "418", "country": "Laos", "country_name_cn": "老挝" }, "KP": { "alpha_3_code": "PRK", "numeric_code": "408", "country": "North Korea", "country_name_cn": "朝鲜 北朝鲜" }, "KR": { "alpha_3_code": "KOR", "numeric_code": "410", "country": "South Korea", "country_name_cn": "韩国 南朝鲜" }, "PT": { "alpha_3_code": "PRT", "numeric_code": "620", "country": "Portugal", "country_name_cn": "葡萄牙" }, "KG": { "alpha_3_code": "KGZ", "numeric_code": "417", "country": "Kyrgyzstan", "country_name_cn": "吉尔吉斯斯坦" }, "KZ": { "alpha_3_code": "KAZ", "numeric_code": "398", "country": "Kazakhstan", "country_name_cn": "哈萨克斯坦" }, "TJ": { "alpha_3_code": "TJK", "numeric_code": "762", "country": "Tajikistan", "country_name_cn": "塔吉克斯坦" }, "TM": { "alpha_3_code": "TKM", "numeric_code": "795", "country": "Turkmenistan", "country_name_cn": "土库曼斯坦" }, "UZ": { "alpha_3_code": "UZB", "numeric_code": "860", "country": "Uzbekistan", "country_name_cn": "乌兹别克斯坦" }, "KN": { "alpha_3_code": "KNA", "numeric_code": "659", "country": "St. Kitts and Nevis", "country_name_cn": "圣基茨和尼维斯" }, "PM": { "alpha_3_code": "SPM", "numeric_code": "666", "country": "Saint-Pierre and Miquelon", "country_name_cn": "圣皮埃尔和密克隆" }, "SH": { "alpha_3_code": "SHN", "numeric_code": "654", "country": "St. Helena and Dependencies", "country_name_cn": "圣赫勒拿" }, "LC": { "alpha_3_code": "LCA", "numeric_code": "662", "country": "St. Lucia", "country_name_cn": "圣卢西亚" }, "MU": { "alpha_3_code": "MUS", "numeric_code": "480", "country": "Mauritius", "country_name_cn": "毛里求斯" }, "CI": { "alpha_3_code": "CIV", "numeric_code": "384", "country": "Côte d'Ivoire", "country_name_cn": "科特迪瓦" }, "KE": { "alpha_3_code": "KEN", "numeric_code": "404", "country": "Kenya", "country_name_cn": "肯尼亚" }, "MN": { "alpha_3_code": "MNG", "numeric_code": "496", "country": "Mongolia", "country_name_cn": "蒙古国 蒙古" } };





    $(document).ready(function () {
        addEventListener();
        window.dispatchEvent(new Event('locationchange'));
    });
}


(function () {
    'use strict';

    // 读取 localStorage 数据
    const myKey = 'pro__Access-Token';
    const myValue = localStorage.getItem(myKey);
    if (myValue) {
        // 存储数据到 Tampermonkey 的存储中
        GM_setValue(myKey, myValue);
        console.log(`Stored ${myKey}: ${myValue} in Tampermonkey storage`);
    }



    createButton();
})();