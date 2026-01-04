// ==UserScript==
// @name         食品审批-确定市场所&监管人员
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  try to take over the world!
// @author       You
// @match        http://172.20.234.90:8089/sdfda/jsp/dsp/common/cform/formframe.jsp*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=234.90
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473730/%E9%A3%9F%E5%93%81%E5%AE%A1%E6%89%B9-%E7%A1%AE%E5%AE%9A%E5%B8%82%E5%9C%BA%E6%89%80%E7%9B%91%E7%AE%A1%E4%BA%BA%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/473730/%E9%A3%9F%E5%93%81%E5%AE%A1%E6%89%B9-%E7%A1%AE%E5%AE%9A%E5%B8%82%E5%9C%BA%E6%89%80%E7%9B%91%E7%AE%A1%E4%BA%BA%E5%91%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //http://172.20.234.90:8089/sdfda/jsp/dsp/common/cform/formframe.jsp?taskType=1&assignmentId=8a5297298a159eab018a1c706c1157ab&internalId=8a5297298a159eab018a1c706c1157ab&procDefUniqueId=ff8080814bd01a07014bd84fab1e00cf&actDefUniqueId=ff80808151417da8015146f8cef82560&actDefId=act2&assignmentId=8a5297298a159eab018a1c706c1157ab&serialNo=18a1c5ef41c65c8&bizTypeCode=FoodMgt&formId=DSP_SDYJ_SPJY_BG&formDataId=8a5297278a15b816018a1c60202609ea&formType=cform&bizTypeCode=FoodMgt
    //http://172.20.234.90:8089/sdfda/jsp/dsp/bizwork/tasklist/todotask/todotask_city_list.jsp
    //日常监管机构 RiChangJianGuanJiGou
    let url = window.location.pathname;
    let updataurl = 'https://greasyfork.org/zh-CN/scripts/473730-%E9%A3%9F%E5%93%81%E5%AE%A1%E6%89%B9-%E7%A1%AE%E5%AE%9A%E5%B8%82%E5%9C%BA%E6%89%80-%E7%9B%91%E7%AE%A1%E4%BA%BA%E5%91%98';

    if(url==='/sdfda/jsp/dsp/common/cform/formframe.jsp'){
        getEle();

    }
    function getEle(){
        let addr,addrId;
        let ifm = window.frames["formframe"];
        //console.log('ifm',ifm);
        if(!ifm){
            setTimeout(function(){getEle()},500);
            return;
        }
        let text = window.frames["formframe"].contentDocument.querySelector('#RiChangJianGuanJiGou');
        let jname = window.frames["formframe"].contentDocument.querySelector('#RiChangJianGuanRenYuan');
        let updataUrl = window.frames["formframe"].contentDocument.querySelector('#DSP_SDYJ_SPYJ__RCJG');
        //let updataUrl = window.frames["formframe"].contentDocument.querySelector('#RiChangJianGuanJiGou').parentNode.parentNode.parentNode.parentNode.parentNode.firstChild;
        //设立 获取街道信息  【371312001,九曲】【371312004,汤河镇】【371312005,太平】【371312006,汤头街道】【371312007,八湖镇】【371312008,郑旺镇】【371312009,经济开发区】
        //变更 获取街道信息
        let type = window.frames["formframe"].contentDocument.querySelector('#DSP_APPLY_SUBJECT');
        let isHide = window.frames["formframe"].contentDocument.querySelector('#DSP_SDYJ_SPYJ_RCJGRY');
        if(!type && !jname && !isHide && !ifm && !updataUrl && !updataUrl == null){
            setTimeout(function(){getEle()},500);
            return;
        }

        //let updataUrl = type;
        console.log('updataUrl_1',updataUrl);
        //updataUrl = updataUrl.parentNode.parentNode.parentNode.parentNode.parentNode.firstChild;
        if(!updataUrl ){
            console.log(123,window.frames["formframe"].contentDocument.querySelector('#DSP_SDYJ_SPYJ__RCJG'));
            setTimeout(function(){getEle()},500);
            return;
        }
        //updataUrl = updataUrl.firstElementChild;

        updataUrl = updataUrl.firstChild;
        console.log('updataUrl_2',updataUrl)
        isHide = isHide.style.display
        type = type.value;
        updataUrl.textContent = updataUrl.textContent +'【点击更新脚本！】';
        updataUrl.addEventListener('click',function(){
            window.open(updataurl,'_blank');
        })
/*         updataUrl.onclick = function(){
            window.open(updataurl,'_blank');
        } */
        console.log(type);
        if(type=='《食品经营许可证》申请'||type=='《食品经营许可证》延续申请'){
            console.log("申请");
            addr = window.frames["formframe"].contentDocument.querySelector('#ZhuSuo_TOWN_ID');
            addrId = addr.value;
            console.log(addrId);
            console.log('addr',addr.value);
            if(!addr){
                setTimeout(function(){getEle()},500);
                return;
            }

            switch(addrId){
                case '371312001':
                    text.value = "河东区九曲市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "杨猛   刘晶";
                    }
                    text.addEventListener('click',jiuQu);
                    break;
                case '371312004':
                    text.value = "河东区汤河市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "王涛  张民朋";
                    }
                    console.log('河东区汤河市场监督管理所');
                    break;
                case '371312005':
                    text.value = "河东区太平市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "罗淼   姜坤";
                    }

                    console.log('河东区太平市场监督管理所');
                    break;
                case '371312006':
                    text.value = "河东区汤头市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "孟凡磊  王利萍";
                    }

                    console.log('河东区汤头市场监督管理所');
                    break;
                case '371312007':
                    text.value = "河东区八湖市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "赵守会  林庆铎";
                    }

                    console.log('河东区八湖市场监督管理所');
                    break;
                case '371312008':
                    text.value = "河东区郑旺市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "孟东磊  宋春增";
                    }

                    console.log('河东区郑旺市场监督管理所');
                    break;
                case '371312009':
                    text.value = "河东经济开发区市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "王效荣  张学平";
                    }

                    console.log('河东经济开发区市场监督管理所');
                    break;
            }

        }else if(type =='《食品经营许可证》变更'){
            console.log("变更");
            addr = window.frames["formframe"].contentDocument.querySelector('#ZhuSuo');
            console.log('addr',addr.value);

            if(!addr.value){
                setTimeout(function(){getEle()},500);
                return;
            }

            let addrArray=['九曲','汤河','太平','汤头','八湖','郑旺','经济开发区'];
            let i=0;
            for(i;i<addrArray.length;i++){
                if((addr.value.indexOf(addrArray[i]))>=0){
                    console.log(`匹配到关键字【${addrArray[i]}】 i=${i}`);
                    break;
                }
            }

            switch(addrArray[i]){
                case '九曲':

                    text.value = "河东区九曲市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "杨猛   刘晶";
                    }
                    text.addEventListener('click',jiuQu);
                    break;
                case '汤河':
                    text.value = "河东区汤河市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "王涛  张民朋";
                    }

                    console.log('河东区汤河市场监督管理所');
                    break;
                case '太平':
                    text.value = "河东区太平市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "罗淼   姜坤";
                    }

                    console.log('河东区太平市场监督管理所');
                    break;
                case '汤头':
                    text.value = "河东区汤头市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "孟凡磊  王利萍";
                    }

                    console.log('河东区汤头市场监督管理所');
                    break;
                case '八湖':
                    text.value = "河东区八湖市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "赵守会  林庆铎";
                    }

                    console.log('河东区八湖市场监督管理所');
                    break;
                case '郑旺':
                    text.value = "河东区郑旺市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "孟东磊  宋春增";
                    }

                    console.log('河东区郑旺市场监督管理所');
                    break;
                case '经济开发区':
                    text.value = "河东经济开发区市场监督管理所";
                    if(isHide=='block'){
                        jname.value = "王效荣  张学平";
                    }

                    console.log('河东经济开发区市场监督管理所');
                    break;
            }



        }



        function jiuQu(){

            if(text.value =="河东区九曲市场监督管理所" ){
                console.log("改城区");
                text.value = "河东区城区市场监督管理所";
                if(isHide=='block'){
                    jname.value = "韩庆玲   葛祥菊";
                }

            }else if(text.value =="河东区城区市场监督管理所" ){
                console.log("改九曲区");
                text.value = "河东区九曲市场监督管理所";
                if(isHide=='block'){
                    jname.value = "杨猛   刘晶";
                }

            }
        }

    }

})();