// ==UserScript==
// @name         智能增加售后地址
// @namespace    http://tampermonkey.net/
// @version      0.9.2
// @description  try to take over the world!
// @author       You
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462848/%E6%99%BA%E8%83%BD%E5%A2%9E%E5%8A%A0%E5%94%AE%E5%90%8E%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/462848/%E6%99%BA%E8%83%BD%E5%A2%9E%E5%8A%A0%E5%94%AE%E5%90%8E%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==
function checkURL() {
    const element = document.getElementById('tab-afterSaleAddress');
    if (element) {
        const isSelected = element.getAttribute('aria-selected') === 'true';
        if (isSelected) {
          //console.log('自主售后退货地址管理处于选中状态');
          jdnew();
        }
    }
    requestAnimationFrame(checkURL);
}

requestAnimationFrame(checkURL);
 
/*
// 使用 setInterval 每隔 1000 毫秒检查一次
setInterval(function () {
    // 检查当前页面的 URL 是否符合特定模式
    //if (wildcardMatch(window.location.href, "*://*.jd.com/afs/detail/waitAudit*")) {
        if (document.querySelector('#tab-roles[aria-selected="true"]')) {
           jdnew();
       }
    //}
    // 如果不符合特定模式，则什么都不做
}, 1000);
*/
//新版
function jdnew() {
//接口地址
const domain = "https://sff.jd.com/";
//接口id
const appId = 'JJZ621CAGWRTEBI2Q0FH';
//添加地址api
const addReturnAddress = 'dsm.seller.delivery.center.api.service.dsm.ReturnAddressDsmBaseService.addReturnAddress';
//查询地址api
const queryReturnAddressListByPage = 'dsm.seller.delivery.center.api.service.dsm.ReturnAddressDsmBaseService.queryReturnAddressListByPage';
//删除地址api
const delReturnAddress = "dsm.seller.delivery.center.api.service.dsm.ReturnAddressDsmBaseService.delReturnAddress";
//setInterval(async function () {
    let elButtons = document.querySelectorAll(".rcd-button--primary");
    for (let i = 0; i < elButtons.length; i++) {
        if (elButtons[i].textContent.includes("增加售后地址")) {
            if (!document.getElementById("zntjshdz")) {
                //按键存在不存在，创建按键
                addaiaddress(i);
            } else if (!document.getElementById("scdyshdz")) {
                //按键存在不存在，创建按键
                adddeleteaddress();
            }
        }
    }
//}, 500);
async function addaiaddress(id) {
        let button = '<button id="zntjshdz" class="rcd-button margin-tb rcd-button--primary"><span>智能增加售后地址</span></button>'
        $(".rcd-button--primary").eq(id).after(button);
        $("#zntjshdz").click(async function () {
            let person = prompt("请输入地址");
            if (person != null && person != "") {
                await aiaddress(person);
            }
        });
};

async function adddeleteaddress() {
        $("#zntjshdz").after('<button id="scdyshdz" class="rcd-button margin-tb rcd-button--primary"><span>删除多余售后地址</span></button>');
        $("#scdyshdz").click(async function () {
            await getaddresslist();
            location.reload();
        });
};

async function aiaddress(address) {
        //获取地址列表
        let URL = "https://lop-proxy.jd.com/address/queryAddressRecognition";
        let data = [{ "text": address, "addressType": 0, "queryType": 0, "lat": 0, "lng": 0 }];
        let httprequest = new XMLHttpRequest();
        httprequest.open('post', URL, false);
        httprequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        httprequest.setRequestHeader("LOP-DN", "logistics-mrd.jd.com");
        httprequest.send(JSON.stringify(data));
        if (httprequest.readyState == 4 && httprequest.status == 200) {
            let restext = httprequest.responseText;
            let res = eval("(" + restext + ")");
            if (res.success == true) {           //识别成功
                //联系人
                if(res.data.name){
                    var contact = res.data.name;
                }else{
                    contact = prompt("未识别到联系人，请手动输入");
                };
                //联系人电话
                if(res.data.mobilePhone){
                    var contactPhone = res.data.mobilePhone;
                }else{
                    contactPhone = prompt("未识别到联系电话，请手动输入");
                };
                //四级地址id
                var addressId = res.data.addressInfo.townCode;
                //地址详细信息
                let addressDetail = res.data.addressInfo.detailAddress;
                //一级id
                let provinceCode = res.data.addressInfo.provinceCode;
                //二级id
                let cityCode = res.data.addressInfo.cityCode;
                //三级id
                let districtCode = res.data.addressInfo.districtCode;
                if (addressId == "null" || addressId == undefined) {
                    //没有四级地址
                    addressId = res.data.addressInfo.districtCode;
                    //fullAreaIds完整区域ID
                    var fullAreaIds = [provinceCode, cityCode, districtCode];
                } else {
                    //fullAreaIds完整区域ID
                    fullAreaIds = [provinceCode, cityCode, districtCode, addressId];
                }
                //添加地址body
                const postalCode = "";
                const contactName = contact;
                const defaultEnum = "NO";
                const statusEnum = "VALID";
                const addressTypeEnum = "AFS";
                const dsmRequest = {
                    paasRequest: {
                        bizRequest: {
                            fullAreaIds,
                            addressId,
                            addressDetail,
                            postalCode,
                            contactPhone,
                            contactName,
                            defaultEnum,
                            statusEnum,
                            addressTypeEnum
                        },
                        componentBase: {
                            buid: "301",
                            language: "ZH_CN",
                            appId: "1214303",
                            appName: "seller-delivery-fe"
                        }
                    }
                };
                //发送添加地址请求
                const obj = await send(addReturnAddress, JSON.stringify({dsmRequest}));
                alert(obj.msg);
                location.reload();
            } else {
                //识别失败，请手动输入
                alert(res.message);
                return false;
            }
        }
}

async function getaddresslist() {
        //获取地址列表
        const dsmRequest = {
            paasRequest: {
                bizRequest: {
                    "pageIndex": 1,
                    "pageSize": 100,
                    "addressTypeEnum": "AFS"
                },
                componentBase: {
                    "buid": "301",
                    "language": "ZH_CN",
                    "appId": "1214303",
                    "appName": "seller-delivery-fe"
                }
            }
        };
        //发送地址列表请求
        const obj = await send(queryReturnAddressListByPage, JSON.stringify({dsmRequest}));
        for (let i = 1; i < obj.data.dataList.length; i++) {
            let addressid = obj.data.dataList[i].id;
            await deleteaddress(addressid);
        }
    
}

async function deleteaddress(addressid) {
        const dsmRequest = {
            paasRequest: {
                bizRequest: {
                    "id": addressid
                },
                componentBase: {
                    "buid": "301",
                    "language": "ZH_CN",
                    "appId": "1214303",
                    "appName": "seller-delivery-fe"
                }
            }
        };
        //发送删除地址请求
        const obj = await send(delReturnAddress, JSON.stringify({dsmRequest}));
}

async function send(api,body) {
        const url = `${domain}api?v=1.0&appId=${appId}&api=${api}`;
        const response = await fetch(url, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
                "dsm-platform": "pc",
            },
            "method": "POST",
            "credentials": "include",
            "body": body
        });
        const data = await response.json();
        return data
}
}