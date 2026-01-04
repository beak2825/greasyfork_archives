// ==UserScript==
// @name         eBay订单信息快速复制助手
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  ebay订单信息 读取 生成 复制到剪贴板
// @match        https://www.ebay.com/*  // 替换为目标网页的URL
// @grant        none
// @include      https://www.ebay.com/mesh/ord/details?orderid=*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519511/eBay%E8%AE%A2%E5%8D%95%E4%BF%A1%E6%81%AF%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519511/eBay%E8%AE%A2%E5%8D%95%E4%BF%A1%E6%81%AF%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        // Modern approach using Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            // Preferred method for modern browsers
            return navigator.clipboard.writeText(text)
                .then(() => {
                console.log('Text copied to clipboard');
                return true;
            })
                .catch(err => {
                console.error('Failed to copy text: ', err);
                return false;
            });
        } else {
            // Fallback method for older browsers
            try {
                // Create a temporary textarea element
                const textArea = document.createElement('textarea');
                textArea.value = text;

                // Make the textarea out of viewport
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                textArea.style.top = '0';
                textArea.setAttribute('readonly', '');

                document.body.appendChild(textArea);

                // Select the text
                textArea.select();
                textArea.setSelectionRange(0, 99999); // For mobile devices

                // Copy the text
                const successful = document.execCommand('copy');

                // Remove the textarea
                document.body.removeChild(textArea);

                if (successful) {
                    console.log('Text copied to clipboard');
                    return true;
                } else {
                    console.error('Unable to copy text');
                    return false;
                }
            } catch (err) {
                console.error('Fallback copy method failed: ', err);
                return false;
            }
        }
    }
    function addressTrim(inAddress){
        console.log(inAddress)
        let outAddress =""
        let nameArray = inAddress.split("Copy name")
        let strName= "姓名："+nameArray[0]+"\n"
        outAddress = nameArray[1]
        console.log(outAddress); // Outputs: "ABC some text after"
        //outAddress = inAddress.replace("Copy name","\n")
        outAddress =outAddress.replaceAll("Copy to clipboard","\n")
        outAddress =outAddress.replaceAll("Copy street","\n")
        outAddress =outAddress.replaceAll("Copy city, ",",")
        outAddress =outAddress.replaceAll("Copy state/province ","")
        outAddress =outAddress.replaceAll("Copy zip code"," ")
        outAddress =outAddress.replaceAll("Copy country/region","")

        outAddress = "地址："+outAddress.trim()
        return strName+outAddress
    }

    // 自定义函数：通过XPath定位元素
    function findElementByXPath(xpath) {
        const result = document.evaluate(xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue; // 返回匹配的DOM节点
    }
    // 主函数
    function readLabelText() {
        let strOrderId = ''
        let strUserName = ''
        let strUserId = ''
        let strPhoneNum = ''
        let strItemName = ''
        let strAddress = ''
        let strShoeSize = ''
        // 使用精确的CSS选择器定位目标元素
        const elementOrderId = findElementByXPath('/html/body/div[2]/div[2]/main/div/div[4]/div[2]/div[1]/div/dl/div[1]/dd')
        if (elementOrderId) {
            const textContent = elementOrderId.textContent.trim(); // 获取文本并去掉多余空格
            strOrderId=textContent
            //console.log('strOrderId:', strOrderId);

        }
        const elementUserName= findElementByXPath('/html/body/div[2]/div[2]/main/div/div[4]/div[2]/div[1]/div/dl/div[4]/dd/div[1]')
        if(elementUserName){
            strUserName=elementUserName.textContent.trim();
            //console.log('strUserName:', strUserName);
        }
        const elementUserId=findElementByXPath('/html/body/div[2]/div[2]/main/div/div[4]/div[2]/div[1]/div/dl/div[4]/dd/div[2]/a[1]')
        if(elementUserId){
            strUserId=elementUserId.textContent.trim();
            //console.log('strUserId:', strUserId);
        }


        const elementItemName = findElementByXPath('/html/body/div[2]/div[2]/main/div/div[3]/div[1]/div[2]/div[1]/a');
        // 检查是否找到目标元素
        if (elementItemName) {
            strItemName=elementItemName.textContent.trim()
            //console.log('strItemName:', strItemName);
        }

        const elementPhoneNum = findElementByXPath('/html/body/div[2]/div[2]/main/div/div[4]/div[1]/div[6]/div/div/div[1]/div[1]/div[2]/div/dd/span/span/span/span/span/button');
        // 检查是否找到目标元素
        if (elementPhoneNum) {
            strPhoneNum=elementPhoneNum.textContent.trim()
            strPhoneNum=strPhoneNum.replace(" ","")
            console.log('strPhoneNum:', strPhoneNum);
        }


        const elementAddress = findElementByXPath('/html/body/div[2]/div[2]/main/div/div[4]/div[1]/div[6]/div/div/div[1]/div[1]/div[1]/div[2]');
        if (elementAddress) {
            strAddress= elementAddress.textContent.trim()
            strAddress= addressTrim(strAddress)
            //strAddress= strAddress.replace(strUserName,"")
            strAddress= strAddress.trim()
            //console.log('strAddress:', strAddress);
            /*example 姓名从地址里面抽取,不要用ebay账户名
姓名：Keosha Williams
地址：354 Pixley PI
West Deptford,NJ08096-4013 United States*/
        }

        const elementShoeSize = findElementByXPath('/html/body/div[2]/div[2]/main/div/div[4]/div[1]/div[7]/div/div/div/div/div/div[2]/div[1]/div[1]/span[2]');
        // 检查是否找到目标元素
        if (elementShoeSize) {
            strShoeSize=elementShoeSize.textContent.trim()
            strShoeSize = "US " + strShoeSize + "男"
            //console.log('strShoeSize:', strShoeSize);
        }
        let strInfo= `订单号：\n${strAddress}\n电话：\n${strPhoneNum}\n\n产品： ${ strItemName}\n尺码： ${strShoeSize}\n买家ID： ${strUserId}\n店铺运营：YY`;
        console.log(strInfo)

        // let fileName= `订单${strOrderId}`;
        copyToClipboard(strInfo)
            .then(success => {
            if (success) {
                alert('订单信息已经复制!');
            } else {
                alert('订单信息生成失败');
            }
        });
    }

    // 添加按钮到页面
    function addButton() {
        const button = document.createElement('button'); // 创建按钮
        button.textContent = '读取订单信息'; // 按钮文字
        button.style.position = 'fixed'; // 固定位置
        button.style.bottom = '20px'; // 距离底部20px
        button.style.left = '20px'; // 距离右侧20px
        button.style.zIndex = '9999'; // 确保按钮在最前面
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007bff'; // 按钮颜色
        button.style.color = '#fff'; // 按钮文字颜色
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // 按钮点击事件绑定到自定义函数
        button.addEventListener('click', readLabelText);

        // 将按钮添加到页面
        document.body.appendChild(button);
    }

    // 页面加载完成后执行
    //window.addEventListener('load', readLabelText);
    window.addEventListener('load', addButton);
    // 或者如果需要在页面动态变化时持续监听


})();