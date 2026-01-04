// ==UserScript==
// @name         闪购辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  闪购辅助工具,可以批量下载开票信息
// @author       Beerspume
// @match        http*://shangoue.meituan.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meituan.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/474222/%E9%97%AA%E8%B4%AD%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/474222/%E9%97%AA%E8%B4%AD%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var docCookies = {
        getItem: function (sKey) {
            return (
                decodeURIComponent(
                    document.cookie.replace(
                        new RegExp(
                            "(?:(?:^|.*;)\\s*" +
                            encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
                            "\\s*\\=\\s*([^;]*).*$)|^.*$",
                        ),
                        "$1",
                    ),
                ) || null
            );
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires =
                            vEnd === Infinity
                            ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
                        : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie =
                encodeURIComponent(sKey) +
                "=" +
                encodeURIComponent(sValue) +
                sExpires +
                (sDomain ? "; domain=" + sDomain : "") +
                (sPath ? "; path=" + sPath : "") +
                (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!sKey || !this.hasItem(sKey)) {
                return false;
            }
            document.cookie =
                encodeURIComponent(sKey) +
                "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
                (sDomain ? "; domain=" + sDomain : "") +
                (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            return new RegExp(
                "(?:^|;\\s*)" +
                encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
                "\\s*\\=",
            ).test(document.cookie);
        },
        keys: /* optional method: you can safely remove it! */ function () {
            var aKeys = document.cookie
            .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "")
            .split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        },
    };

    const fn_sleep=(ms)=>{
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const fn_setCookie=(cookie)=>{
        if(cookie){
            for(let key in cookie){
                if(key){
                    docCookies.setItem(key,cookie[key]);
                }
            }
        }

    };

    let last_remoteTime=0;
    const api_remote=async (options)=>{
        let now=(new Date()).getTime();
        while(now-last_remoteTime<500){
            await fn_sleep(200);
            now=(new Date()).getTime();
        }
        last_remoteTime=now;
        //GM_xmlhttpRequest(options);
        const xhr=new XMLHttpRequest();
        xhr.open(options.method,options.url);
        xhr.responseType=options.responseType;
        const old_cookie=document.cookie;
        const handleEvent=(event)=>{
            document.cookie=old_cookie;
            if(xhr.status==200){
                if(options.onload){
                    options.onload(xhr);
                }
            }else{
                if(options.onerror){
                    options.onerror(xhr);
                }
            }
        };
        xhr.addEventListener("load",handleEvent);
        xhr.addEventListener("error",handleEvent);
        if(options.cookie){
            fn_setCookie(options.cookie);
        }
        xhr.send(options.data);
    };
    const api_onload=(resolve,reject,result)=>{
        const response=result.response;
        if(response.code==0){
            resolve(response.data||{});
        }else{
            reject(response.msg);
        }
    }
    const api_onerror=(resolve,reject,result)=>{
        reject(result);
    }
    const api_poiList=()=>{
        return new Promise((resolve,reject)=>{
            api_remote({
                url:'/api/poi/poiList',
                method:'POST',
                data:{},
                responseType:'json',
                onload:(result)=>{
                    api_onload(resolve,reject,result);
                },
                onerror:(result)=>{
                    api_onerror(resolve,reject,result);
                }
            });
        });
    }

    const api_contractInfo=()=>{
        return new Promise((resolve,reject)=>{
            api_remote({
                url:'/finance/invoice/api/common/application/r/queryContractInfo',
                method:'GET',
                data:{},
                responseType:'json',
                onload:(result)=>{
                    api_onload(resolve,reject,result);
                },
                onerror:(result)=>{
                    api_onerror(resolve,reject,result);
                }
            });
        });
    }

    const api_qualificationList=(contractId,partnerType,qualificationType,wmPoiId,wmPoiName)=>{
        const old_cookie=document.cookie;
        //const new_cookie=fn_setCookie(old_cookie);
        return new Promise((resolve,reject)=>{
            api_remote({
                url:`/finance/invoice/api/common/qualification/r/list?source=2&contractId=${contractId}&partnerType=${partnerType}&qualificationType=${qualificationType}`,
                method:'GET',
                data:{},
                cookie:{
                    "wmPoiId":wmPoiId,
                    "wmPoiName":wmPoiName,
                },
                responseType:'json',
                onload:(result)=>{
                    //document.cookie=old_cookie;
                    api_onload(resolve,reject,result);
                },
                onerror:(result)=>{
                    //document.cookie=old_cookie;
                    api_onerror(resolve,reject,result);
                }
            });
        });
    }

    const api_amount=(contractId,partnerType,qualificationType,baseFeeType,amountGatherType,wmPoiId,wmPoiName)=>{
        return new Promise((resolve,reject)=>{
            const pageNo=1;
            const pageSize=10;
            api_remote({
                url:`/finance/invoice/api/common/application/r/amount?source=2&contractId=${contractId}&baseFeeType=${baseFeeType}&partnerType=${partnerType}&amountGatherType=${amountGatherType}&qualificationType=${qualificationType}&pageNo=${pageNo}&pageSize=${pageSize}`,
                method:'GET',
                data:{},
                cookie:{
                    "wmPoiId":wmPoiId,
                    "wmPoiName":wmPoiName,
                },
                responseType:'json',
                onload:(result)=>{
                    api_onload(resolve,reject,result);
                },
                onerror:(result)=>{
                    api_onerror(resolve,reject,result);
                }
            });
        });
    }

    let outdata={};
    let monthNameList=[];
    const fn_downloadMonth=async (month)=>{
        const monthData=outdata[month];
        console.log(monthData);
        let sheetText="店铺名称,时间,金额,明细项目,发票抬头\n";
        for(let i=0;i<monthData.list.length;i++){
            const d=monthData.list[i];
            sheetText+=`${d.poiName},${d.month},${d.moneyCent/100.0},${d.qualificationTypeName},${d.partnerBName}\n`;
        }
        const sheetData = new Blob([sheetText], {
            type: 'text/plain;charset=GBK'
        });
        const base64_url=URL.createObjectURL(sheetData);
        const a=document.createElement("a");
        a.href=base64_url;
        a.download=`${month}.csv`;
        a.style.display="none";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(base64_url);
        document.body.removeChild(a);

    };

    const fn_mask=(show)=>{

        let el_mask=document.querySelector("#huimin_mask");
        if(!el_mask){
            el_mask=document.createElement("div");
            el_mask.id="huimin_mask";
            el_mask.style.position="absolute";
            el_mask.style.width="9999px";
            el_mask.style.height="9999px";
            el_mask.style.top="-100px";
            el_mask.style.left="-100px";
            el_mask.style.backgroundColor="gray";
            el_mask.style.zIndex="999999";
            el_mask.style.opacity="0.8";
            document.body.append(el_mask);
        }
        if(show){
            el_mask.style.display="block";
            document.body.style.overflow="hidden";
        }else{
            el_mask.style.display="none";
            document.body.style.overflow=undefined;
        }

    };
    const fn_get=()=>{
        console.log('-----------------------------------------');
        const el_monthList=document.querySelector("#huimin_monthList");
        const el_huimin_start=document.querySelector("#huimin_start");
        el_huimin_start.disabled=true;
        outdata={};
        monthNameList=[];
        (async ()=>{
            fn_mask(true);
            const old_wmPoiId=docCookies.getItem("wmPoiId");
            const old_wmPoiName=docCookies.getItem("wmPoiName");
            try{
                const poiList=(await api_poiList()).filter((poi)=>{
                    return poi.id>0;
                });
                //console.log(poiList);
                //console.log(`找到${poiList.length}个门店`);
                el_monthList.innerHTML=`找到${poiList.length}个门店`;

                const contractInfo=(await api_contractInfo())[0];
                const contractId=contractInfo.contractId;
                //console.log(contractInfo);
                //console.log(contractId);

                for(let i=0;i<poiList.length;i++){
                    const poi=poiList[i];
                    const wmPoiId=poi.id;
                    const wmPoiName=poi.poiName;
                    //console.log(`获取第${i+1}个店铺\[${wmPoiName}\]...`);
                    el_monthList.innerHTML=`找到${poiList.length}个门店,获取第${i+1}个店铺<span style="color:brown;">\[${wmPoiName}\]</span>数据...`;
                    const qualificationList=(await api_qualificationList(contractId,101,2,wmPoiId,wmPoiName));
                    //console.log(qualificationList);

                    for(let j=0;j<qualificationList.length;j++){
                        const qualification=qualificationList[j];
                        const partnerType=qualification.partnerType;
                        const qualificationType=qualification.qualificationType;
                        const baseFeeType=3;//qualification.invoiceType;
                        const amountGatherType=2;
                        const monthAmountList=(await api_amount(contractId,partnerType,qualificationType,baseFeeType,amountGatherType,wmPoiId,wmPoiName)).monthAmountList
                        ;
                        //console.log(amountList);

                        const qualificationTypeName=qualification.qualificationTypeName;
                        const partnerBName=qualification.partnerBName;
                        for(let k=0;k<monthAmountList.length;k++){
                            const amount=monthAmountList[k];
                            const month=amount.month;
                            const moneyCent=amount.moneyCent
                            if(outdata[month]==undefined){
                                outdata[month]={};
                                monthNameList.push(month);
                            }
                            const monthData=outdata[month];
                            monthData.month=month;
                            monthData.list=monthData.list||[];
                            monthData.list.push({
                                "poiName":wmPoiName,
                                "month":month,
                                "moneyCent":moneyCent,
                                "qualificationTypeName":qualificationTypeName,
                                "month":month,
                                "partnerBName":partnerBName,
                            });
                        }
                    }
                    //console.log(`\t第${i+1}个店铺\[${wmPoiName}\]数据收集完成`);
                    el_monthList.innerHTML=`找到${poiList.length}个门店,获取第${i+1}个店铺<span style="color:brown;">\[${wmPoiName}\]</span>数据收集完成`;
                }
                console.log(outdata);
                el_monthList.innerHTML="";
                for(let i=0;i<monthNameList.length;i++){
                    const month=monthNameList[i];
                    const el_download=document.createElement("span");
                    el_download.style.marginLeft="7px";
                    el_download.style.marginRight="7px";
                    el_download.style.color="blue";
                    el_download.style.cursor="pointer";
                    el_download.style.textDecoration="underline";
                    el_download.innerText=`下载${month}`;
                    el_download.addEventListener('click',()=>{
                        fn_downloadMonth(month);
                    });
                    el_monthList.append(el_download);
                }
            }catch(e){
                console.log(e);
            }
            el_huimin_start.disabled=false;
            docCookies.setItem("wmPoiId",old_wmPoiId);
            docCookies.setItem("wmPoiName",old_wmPoiName);
            fn_mask(false);

        })();
    }
    const el_huiminToolbar=document.createElement("div");
    el_huiminToolbar.id="huiminToolbar";
    el_huiminToolbar.style.width="100%";
    el_huiminToolbar.style.height="40px";
    el_huiminToolbar.style.padding="5px 10px 5px 10px";
    el_huiminToolbar.style.backgroundColor="antiquewhite";
    el_huiminToolbar.style.display="flex";
    el_huiminToolbar.style.gap="10px";

    const el_button=document.createElement("button");
    el_button.id="huimin_start";
    el_button.innerText="获取开票数据";
    el_button.style.paddingLeft="5px";
    el_button.style.paddingRight="5px";
    el_button.addEventListener('click',()=>{
        fn_get();
    });
    el_huiminToolbar.append(el_button);

    const el_span_month=document.createElement("span");
    el_span_month.id="huimin_monthList";
    el_huiminToolbar.append(el_span_month);

    document.body.insertAdjacentElement('afterbegin',el_huiminToolbar);
})();