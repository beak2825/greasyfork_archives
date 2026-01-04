// ==UserScript==
// @name         上架助手2024-油猴插件
// @namespace    http://tampermonkey.net/
// @version      2025.02.06.1
// @description  上架助手2024
// @license      MIT
// @author       Beerspume
// @match        https://*.soluxemall.com/*
// @match        https://supadmin.jd.com/*
// @match        shop.jd.com/jdm/trade/orders/order-list*
// @match        shop.jd.com/jdm/trade/order/orderDetail*
// @match        https://www2.energyahead.com/html/supermarket.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=benefits.soluxemall.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js
// @grant        GM_addElement
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/520144/%E4%B8%8A%E6%9E%B6%E5%8A%A9%E6%89%8B2024-%E6%B2%B9%E7%8C%B4%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/520144/%E4%B8%8A%E6%9E%B6%E5%8A%A9%E6%89%8B2024-%E6%B2%B9%E7%8C%B4%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //取得易采网站后台请求的授权信息
    function getAuthorization(){
        //从localStorage中取得授权信息
        const json_jdcloud=localStorage.getItem("jdcloud");
        let Authorization=undefined;
        if(json_jdcloud){
            try{
                const jdcloud=JSON.parse(json_jdcloud);
                Authorization=jdcloud.token;
                //console.log(`Authorization: ${Authorization}`);
            }catch(e){
                console.log("jdcloud解析失败,请查看localStorage中的jdcloud是否正确");
            }
        }
        return Authorization;
    }
    function getNodeByInnerText(parentNode,tagname,InnerText){
        let nodechilldern = parentNode.querySelectorAll(tagname);
        for (let i = 0; i < nodechilldern.length; i++) {
            if (nodechilldern[i].innerText==InnerText){
                return nodechilldern[i];
            }
        }
        return null;
    }
    //复制内容到剪贴板
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(function() {
            console.log('Text copied to clipboard');
        })
            .catch(function(err) {
            console.error('Failed to copy text: ', err);
        });
    }
    //将毫秒时间戳转换为时间
    function timestampToDate(timestamp) {
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份是从0开始的
        var day = ("0" + date.getDate()).slice(-2);
        var hours = ("0" + date.getHours()).slice(-2);
        var minutes = ("0" + date.getMinutes()).slice(-2);
        var seconds = ("0" + date.getSeconds()).slice(-2);
        return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    }

    //将秒转化为小时
    const fn_formatSeconds=(seconds)=>{
        if(seconds===Infinity){
            return "";
        }else{
            return `${Math.floor(seconds/3600)}小时${Math.floor(seconds%3600/60)}分钟${Math.floor(seconds%3600%60)}秒`;
        }
    };

    function sleep(seconds){
        return new Promise((resolve,reject)=>{
            window.setTimeout(()=>{
                resolve();
            },seconds*1000);
        });
    }

    const TimeSample=[];
    const fn_timeSample=()=>{
        TimeSample.push(new Date().getTime());
        while(TimeSample.lenth>11){
            TimeSample.shift();
        }
        let average=Infinity;
        if(TimeSample.length>0){
            average=(Math.max(...TimeSample)-Math.min(...TimeSample))/TimeSample.length/1000;
        }
        return average;

    };

    // 访问后台服务的统一接口
    const hyservice=(action,data)=>{
        return new Promise((resolve,reject)=>{
            const post_data = `action=${action}&`+ObjToParams(data);
            console.log(post_data);
            GM_xmlhttpRequest({
                url:"http://43.143.136.44/hysm/service.asp",
                method:'POST',
                responseType:"json",
                headers:{"Content-Type":"application/x-www-form-urlencoded"},
                data:post_data,
                onload:(event)=>{
                    if(event.status==200){
                        if(event.response.success){
                            resolve(event.response.data);
                        }else{
                            reject(event.response);
                        }
                    }else{
                        reject(event);
                    }
                },
                onerror:(event)=>{
                    reject(event);
                }
            });
        });
    }
    //转换请求参数格式
    function ObjToParams(obj){
        let ret="";
        Object.keys(obj).forEach((k)=>{
            let v=obj[k];
            if(typeof(v)==="object"){
                v=JSON.stringify(v);
            }
            ret+=`${k}=${encodeURIComponent(v)}&`;
        });
        if(ret.length>1){
            ret=ret.substring(0,ret.length-1)
        }
        return ret;
    }
    //显示信息
    function msgDisplay(str){
        let el_msg=document.querySelector(".hy_msg1");
        if(el_msg){
            el_msg.innerText=str;
        }
    }


    //下载图片存放到Blob
    const fn_download_photo=function(photo_url){
        return new Promise((resolve,reject)=>{
            const re_photo_filename=/\/([^\/]+)$/;
            const m_photo_filename=photo_url.match(re_photo_filename);
            let photo_filename='noname.jpg';
            if(m_photo_filename){
                photo_filename=m_photo_filename[1];
            }

            GM_xmlhttpRequest({
                url:photo_url,
                method:'GET',
                responseType:'blob',
                onload:(event)=>{
                    const phpto_data=event.response;
                    resolve(phpto_data);
                },
                onerror:(event)=>{
                    reject(event);
                }
            });
        });
    };
       //取得商品详情
        const getGoodsDetail=(shopSkuId)=>{
            return new Promise((resolve,reject)=>{
                const post_data={shopSkuId: shopSkuId};
                const post_headers={
                    "Content-Type":"application/json;charset=UTF-8",
                    "Authorization":getAuthorization(),
                };
                GM_xmlhttpRequest({
                    url:"https://benefits.soluxemall.com/proxy/item-center/energynet/platform/shopDataFilling/seachSupplierEnergyDataDetail",
                    method:'POST',
                    data:JSON.stringify(post_data),
                    headers:post_headers,
                    onload:(event)=>{
                        try{
                            if(event.status==200){
                                const response=JSON.parse(event.responseText);
                                if(response.code=="0"){
                                    resolve(response.data);
                                }else{
                                    reject(response.msg);
                                }
                            }else{
                                reject(event);
                            }
                        }catch(e){
                            reject(e);
                        }
                    },
                    onerror:(event)=>{
                        reject(event);
                    }
                });
            });
        };
        //从华远平台获取订单信息
        const getHYSMOrderDetail=(nyoneOrderNo)=>{
            return new Promise((resolve,reject)=>{
                const post_headers={
                    "Content-Type":"application/json;charset=UTF-8",
                };
                GM_xmlhttpRequest({
                    url:`http://43.143.136.44/hysm/ajax_checkorderbh.asp?orderbh=${nyoneOrderNo}`,
                    method:'GET',
                    headers:post_headers,
                    onload:(event)=>{
                        try{
                            if(event.status==200){
                                const response=JSON.parse(event.responseText);
                                resolve(response);
                            }else{
                                reject(event);
                            }
                        }catch(e){
                            reject(e);
                        }
                    },
                    onerror:(event)=>{
                        reject(event);
                    }
                });
            });
        };
        const importUrl = `http://43.143.136.44/hysm/doimport_order.asp`;//华远后台导入订单页面地址
        const importDomain = 'http://43.143.136.44'; //华远后台域名
        const postDataToHYSM=(order)=>{
            let newWindow = window.open(`${importUrl}?orderfrom=${order.orderfrom}`,'importorder');
            const handleMessage=(event)=>{
                if(event.origin == importDomain){
                    console.log(event);
                    if(event.data=="ok"){
                        console.log("发送数据给华远窗口",order);
                        newWindow.postMessage(order,importDomain);
                        newWindow.focus();
                        window.removeEventListener('message', handleMessage);
                    }
                }
            }
            window.addEventListener('message',handleMessage);
        }
    //-------------------------------------------- 能源一号网 -> 第三方超市 ------------------------------------------------------------------
    const fn_initEnergyNetMenuBar=()=>{
       console.log('进入能源一号网第三方超市');
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar){
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:999;width:10em;background-color:lightblue;position:fixed;top:10px;right:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";
            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="商品助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";
            //导入编码按钮
            const el_b1=document.createElement("button");
            el_mainContainer.append(el_b1);
            el_b1.style="width:90%;margin-bottom:5px;";
            el_b1.textContent="导入商品编码";
            el_b1.addEventListener("click",(event)=>{doImportEnergyGoodsId()});
            el_b1.classList.add("hy_btn_importgoodsid");
            /*
            //导入按钮
            const el_b3=document.createElement("button");
            el_mainContainer.append(el_b3);
            el_b3.style="width:90%;margin-bottom:5px;";
            el_b3.textContent="导入商品快照";
            el_b3.addEventListener("click",(event)=>{doImportEnergyGoodsSnapshot()});
            //el_b3.setAttribute("disabled",true);
            el_b3.classList.add("hy_btn_importgoodsimg");
            */

            //查询消息显示区
            const el_msg1=document.createElement("div");
            el_mainContainer.append(el_msg1);
            el_msg1.style="width:100%;color:red;display:block;margin-bottom:5px;";
            el_msg1.innerText="";
            el_msg1.classList.add("hy_msg1");
            //将助手工具添加到页面
            document.body.insertAdjacentElement("afterBegin",el_menubar);
            msgDisplay(`请先登录能源一号网`);
        }

        const getEnergyGoodsByKeywords=(Keywords)=>{
            return new Promise((resolve,reject)=>{

                let commonSearchReqBO={frozenOrgCode:"SUP",
                                       checkStatusOrgCode:"SUP",
                                       isFrozenStatus:false,
                                       pageNo:1,
                                       pageSize:10,
                                       supplierName:"",
                                       sort:"default",
                                       keyWord:Keywords,
                                       commoditySource:"-1"};
                const token = localStorage.getItem("token");
                const searchReq=encodeURIComponent(JSON.stringify(commonSearchReqBO));
                let postData=`CommonSearchReqBO=${searchReq}&service=searchThirdPartyCommodity&token=${token}`;
                const post_headers={
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                };
                //console.log(postData);
                GM_xmlhttpRequest({
                    url:"https://www2.energyahead.com/rest/service/routing",
                    method:'POST',
                    data:postData,
                    headers:post_headers,
                    onload:(event)=>{
                        try{
                            if(event.status==200){
                                const response=JSON.parse(event.responseText);
                                resolve(response);
                            }else{
                                reject(event);
                            }
                        }catch(e){
                            reject(e);
                        }
                    },
                    onerror:(event)=>{
                        reject(event);
                    }
                });
            });
        };

         //导入商品编码
        const doImportEnergyGoodsId=()=>{
            (async()=>{
                const el_btn=document.querySelector(".hy_btn_importgoodsid");
                if(el_btn){
                    el_btn.setAttribute("disabled",true);
                }
                console.log('开始导入能源一号网商品编码');
                msgDisplay(`获取需要导入编码的商品列表`);
                const goodsList = await hyservice("energyapplygoodslist",{pagesize:-1,pageno:1});
                console.log("get goods list ",goodsList);
                const allnum = goodsList.length;
                let errnum =0;
                let oknum = 0;
                msgDisplay(`需要导入数量：${allnum}`);
                for(let i=0;i<goodsList.length;i++){
                    const skuid = goodsList[i].shopskuid;
                    let commodityId="";
                    try{
                        let begintime = new Date().getTime();
                        const seachList=await getEnergyGoodsByKeywords(skuid);
                        commodityId = seachList.commodityPageList.rows[0].commodityId;
                        const ret = await hyservice("saveenergygoodsid",{shopskuid:skuid,commodityId:commodityId});
                        oknum+=1;
                        let endtime = new Date().getTime();
                        console.log(`导入${skuid}/${commodityId}成功 耗时${endtime-begintime}ms`);
                    }catch(e){
                        console.error(`导入${skuid}/${commodityId}失败`,e);
                        errnum +=1;
                    }
                    msgDisplay(`已完成导入：${i+1}/${allnum} 失败 ${errnum} 条` );
                    await sleep(0.5);
                }
                msgDisplay(`导入结束：共${allnum}条，失败${errnum}条` );
                if(el_btn){
                    el_btn.removeAttribute("disabled");
                }
             })();
        };
        //导入商品快照
        const doImportEnergyGoodsSnapshot=()=>{
            (async()=>{
                console.log('开始导入能源一号网商品快照');

                let newWindow = window.open(`https://www2.energyahead.com/html/shop/3rd_party_detail.html?supplierId=3955259471&commodityId=6334250`,'energygoodsdetailwindow');
                console.log('新商品页面打开');
                await sleep(1);
                let newdoc = newWindow.document;
                const el_commodity = newdoc.querySelector(".commodity");
                const el_detail = el_commodity.querySelector('.commodity-details');
                el_detail.parentNode.removeChild(el_detail);
                let el_div1 = el_commodity.querySelector('.magnifier-assembly');
                el_div1.parentNode.removeChild(el_div1);
                el_div1 = el_commodity.querySelector('.move-view');
                el_div1.parentNode.removeChild(el_div1);
                el_div1 = el_commodity.querySelector('.magnifier-view');
                el_div1.parentNode.removeChild(el_div1);
                const el_goodsimg = el_commodity.querySelector('.images-cover').querySelector('img');
                const imgdata = await fn_download_photo(el_goodsimg.src);
                el_goodsimg.src =window.URL.createObjectURL(imgdata);
                await sleep(1);
                await html2canvas(el_commodity).then(canvas => {
                    // 创建一个图片元素
                    var img = canvas.toDataURL("image/png");
                    // 创建一个链接元素
                    var link = document.createElement('a');
                    console.log(img);
                    link.href = img;
                    // 设置下载的文件名
                    link.download = 'downloaded-image.png';
                    // 触发下载
                    link.click();

                });
               //newWindow.close();
            })();
        };

    };

    //-------------------------------------------- 京东商家后台 -> 订单详情 ------------------------------------------------------------------

    const fn_initJDOrderDetailMenuBar=()=>{
        console.log('进入京东订单详情页面');
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar){
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:999;width:10em;background-color:lightblue;position:fixed;top:10px;right:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";
            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="京东订单导入助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";
            //导入按钮
            const el_b3=document.createElement("button");
            el_mainContainer.append(el_b3);
            el_b3.style="width:90%;margin-bottom:5px;";
            el_b3.textContent="导入订单到华远系统";
            el_b3.addEventListener("click",(event)=>{doImportJDOrder()});
            //el_b3.setAttribute("disabled",true);
            el_b3.classList.add("hy_btn_importorder");

            //查询消息显示区
            const el_msg1=document.createElement("div");
            el_mainContainer.append(el_msg1);
            el_msg1.style="width:100%;color:red;display:block;margin-bottom:5px;";
            el_msg1.innerText="";
            el_msg1.classList.add("hy_msg1");
            //将助手工具添加到页面
            document.body.insertAdjacentElement("afterBegin",el_menubar);
        }



        //导入京东订单
        //从华远平台获取订单信息
        const getHYSMJDGoodsDetail=(jdsku)=>{
            return new Promise((resolve,reject)=>{
                const post_headers={
                    "Content-Type":"application/json;charset=UTF-8",
                };
                GM_xmlhttpRequest({
                    url:`http://43.143.136.44/hysm/do_getjdgoodsdetail.asp?jdsku=${jdsku}`,
                    method:'GET',
                    headers:post_headers,
                    onload:(event)=>{
                        try{
                            if(event.status==200){
                                const response=JSON.parse(event.responseText);
                                resolve(response);
                            }else{
                                reject(event);
                            }
                        }catch(e){
                            reject(e);
                        }
                    },
                    onerror:(event)=>{
                        reject(event);
                    }
                });
            });
        };

        //取得京东订单详情
        const doImportJDOrder=()=>{
            (async()=>{
               console.log(`开始导入京东订单`);
               console.log("准备订单数据");

            let order = new Object;
            const el_orderdiv=document.querySelector("div.order-info");
            if(el_orderdiv==null){
                msgDisplay(`请等订单信息加载完毕再导入`);
                return;
            }
            const orderstus =document.querySelector("div.form-item.inline.order-status").querySelector('span.form-item-text').innerText;
            if(orderstus=='等待付款' ||orderstus== '已取消'){
                msgDisplay(`订单状态为 ${orderstus} 不能导入`);
                return;
            }
            order.orderfrom=2;
            order.orderbh = document.querySelector("div.form-item.order-item").querySelectorAll("span")[1].innerText;
            order.personname = "";
            order.address = "";
            order.tell = "";
            order.note = "";
            order.ordertime = "";
            order.company="";
            try{
                order.personname=el_orderdiv.querySelector(".goods-name-box").querySelectorAll("span")[0].innerText;
            }catch (error) {}
            try{
                order.address=el_orderdiv.querySelector(".goods-address").querySelectorAll("span")[0].innerText;
            }catch (error) {}
            try{
                order.tell = el_orderdiv.querySelector(".goods-mobile-phone").querySelectorAll("span")[0].innerText;
            }catch (error) {}
            try{
                order.note = getNodeByInnerText(document.querySelector("div.order-status-content"),"span","买家留言：").parentNode.querySelectorAll("span")[1].innerText;
            }catch (error) {}
            try{
                const el_paydiv= document.querySelectorAll(".consignee-info")[2];
                order.ordertime=getNodeByInnerText(el_paydiv,"div.item-label","付款时间").parentNode.querySelector("div.item-value").innerText
                //order.ordertime=el_paydiv.querySelectorAll("div")[1].querySelectorAll('.info-bar-item')[1].querySelector('.item-value').innerText;
            }catch (error) {}
            try{
                const el_companyDiv = document.querySelectorAll(".consignee-info")[3];
                if(getNodeByInnerText(el_companyDiv,"div","单位名称")!=null){
                    order.company=getNodeByInnerText(el_companyDiv,"div","单位名称").parentNode.querySelectorAll("div")[1].innerText;
                }
                if(getNodeByInnerText(el_companyDiv,"div","发票抬头")!=null){
                    order.company=getNodeByInnerText(el_companyDiv,"div","发票抬头").parentNode.querySelectorAll("div")[1].innerText;
                }
            }catch (error) {}
            //订单商品
            let orderItems = [];
            //商品列表
            const goodslistdiv = document.querySelector("div.product-table-box");
            const goodslisttable = goodslistdiv.querySelector("table.el-table__body").querySelector("tbody");
            order.ordergoodsnum = goodslisttable.querySelectorAll("tr").length;
            const goodslisttr = goodslisttable.querySelectorAll("tr");
            var orderamount = 0;
            for (var i = 0; i < goodslisttr.length; i++) {
                let goodsItem = new Object;
                goodsItem.goodsid = goodslisttr[i].querySelectorAll("td")[0].innerText;
                const goodsFromHYSM = await getHYSMJDGoodsDetail(goodsItem.goodsid);
                console.log('从华远系统取商品信息',goodsFromHYSM);
                goodsItem.goodsname = goodsFromHYSM.productname;
                goodsItem.goodsBrand =goodsFromHYSM. mainbrandname;
                goodsItem.goodsUnit = goodsFromHYSM.mainunitcode;
                goodsItem.goodsOrderPrice = goodslisttr[i].querySelectorAll("td")[5].innerText;
                let reg1 = new RegExp("￥","g");
                goodsItem.goodsOrderPrice = goodsItem.goodsOrderPrice.replace(reg1,"");
                goodsItem.goodsNum = goodslisttr[i].querySelectorAll("td")[2].querySelectorAll("div.price")[1].innerText;
                var reg3 = new RegExp("x","g");
                goodsItem.goodsNum= goodsItem.goodsNum.replace(reg3,"");
                orderamount+=goodsItem.goodsNum * goodsItem.goodsOrderPrice;
                orderItems.push(goodsItem);
            }
            order.goodsItems = orderItems;
            order.orderamount = orderamount;
            //取得companyinfo
            const companyinfo = new Object;
            var el_companynode = document.querySelectorAll(".consignee-info")[3];
            companyinfo.companytype=1;
            companyinfo.companyname="";
            companyinfo.companycode="";
            companyinfo.address="";
            companyinfo.linktell="";
            companyinfo.bankname="";
            companyinfo.bankcount="";
            companyinfo.linkmanname = "-";
            companyinfo.sellgoods="京东客户";
            try{
                if(getNodeByInnerText(el_companynode,"div.item-label","单位名称")!=null){
                    companyinfo.companyname=getNodeByInnerText(el_companynode,"div.item-label","单位名称").parentNode.querySelector("div.item-value").innerText;
                }
                if (getNodeByInnerText(el_companynode,"div.item-label","发票抬头")!=null){
                    companyinfo.companyname=getNodeByInnerText(el_companynode,"div.item-label","发票抬头").parentNode.querySelector("div.item-value").innerText;
                }
            }catch(e){}
            try{
                companyinfo.companycode = getNodeByInnerText(el_companynode,"div.item-label","纳税人识别号").parentNode.querySelector("div.item-value").innerText;
            }catch(e){}
            try{
                if(getNodeByInnerText(el_companynode,"div.item-label","单位地址")!=null){
                    companyinfo.address = getNodeByInnerText(el_companynode,"div.item-label","单位地址").parentNode.querySelector("div.item-value").innerText;
                }
                if (getNodeByInnerText(el_companynode,"div.item-label","地址")!=null){
                    companyinfo.address = getNodeByInnerText(el_companynode,"div.item-label","地址").parentNode.querySelector("div.item-value").innerText;
                }
            }catch(e){}
            try{
                if(getNodeByInnerText(el_companynode,"div.item-label","单位电话")!=null){
                    companyinfo.linktell = getNodeByInnerText(el_companynode,"div.item-label","单位电话").parentNode.querySelector("div.item-value").innerText;
                }
                if(getNodeByInnerText(el_companynode,"div.item-label","电话")!=null){
                    companyinfo.linktell = getNodeByInnerText(el_companynode,"div.item-label","电话").parentNode.querySelector("div.item-value").innerText;
                }
	        }catch(e){}

            if(getNodeByInnerText(el_companynode,"div.item-label","开户银行")!=null){
                companyinfo.bankname = getNodeByInnerText(el_companynode,"div.item-label","开户银行").parentNode.querySelector("div.item-value").innerText;
            }
            try{
                if(getNodeByInnerText(el_companynode,"div.item-label","银行账号")!=null){
                    companyinfo.bankcount = getNodeByInnerText(el_companynode,"div.item-label","银行账号").parentNode.querySelector("div.item-value").innerText;
                }
                if(getNodeByInnerText(el_companynode,"div","开户账号")!=null){
                    companyinfo.bankcount = getNodeByInnerText(el_companynode,"div","开户账号").parentNode.querySelector("div.item-value").innerText;
                }
	        }catch(e){}
            order.companyInfo=companyinfo;

            console.log(order);
            postDataToHYSM(order);

            })();
        };

    };
    //-------------------------------------------- 京东商家后台 -> 订单列表 ------------------------------------------------------------------

    const fn_initJDOrderMenuBar=()=>{
        console.log('进入京东订单列表页面');
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar){
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:999;width:10em;background-color:lightblue;position:fixed;top:10px;right:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";
            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="京东订单助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";
            //导入输入商品按钮
            const el_b3=document.createElement("button");
            el_mainContainer.append(el_b3);
            el_b3.style="width:90%;margin-bottom:5px;";
            el_b3.textContent="检查新订单";
            el_b3.addEventListener("click",(event)=>{doCheckJDOrders()});
            el_b3.classList.add("hy_btn_check_neworder");

            //查询消息显示区
            const el_msg1=document.createElement("div");
            el_mainContainer.append(el_msg1);
            el_msg1.style="width:100%;color:red;display:block;margin-bottom:5px;";
            el_msg1.innerText="";
            el_msg1.classList.add("hy_msg1");
            //将助手工具添加到页面
            document.body.insertAdjacentElement("afterBegin",el_menubar);
        }


   //检查新订单

       const doCheckJDOrders=()=>{
            (async()=>{
                console.log('检查京东订单列表页面中的订单是否有新订单');
                msgDisplay(`检查页面中的订单是否有新订单`);
                const el_btn=document.querySelector(".hy_btn_check_neworder");
                if(el_btn){
                    el_btn.setAttribute("disabled",true);
                }
                const el_btn_arr = document.querySelectorAll('.hy_import_order_btn')||[];
                for(let i=0;i<el_btn_arr.length;i++){
                    el_btn_arr[i].parentNode.removeChild(el_btn_arr[i]);
                }
                const orderDiv = document.querySelector(".order-list-card-table");
                if(orderDiv ==null){
                    return;
                }
                const el_div_ordertitle = orderDiv.querySelectorAll(".card-header")||[];
                let newordernum=0;
                for(let i=0;i<el_div_ordertitle.length;i++){
                    try{
                        msgDisplay(`检查订单${i+1}/${el_div_ordertitle.length}`);
                        let orderno="";
                        try{
                            orderno=el_div_ordertitle[i].querySelector("div.shop-order-id").querySelector('button').innerText;
                        }catch(e){}
                        if(orderno.length==0){
                            break; //没有取得订单号
                        }
                        console.log(orderno);
                        const hycheckOrder = await getHYSMOrderDetail(orderno);
                        console.log(hycheckOrder);
                        if(hycheckOrder.found=="no"){
                            //发现新订单
                            console.log(`发现新订单${orderno}`);
                            const el_button=document.createElement("label");
                            el_button.classList.add("hy_import_order_btn");
                            el_button.style="background:#ffb800;border-style:none";
                            el_button.innerText="新订单";
                            el_div_ordertitle[i].insertAdjacentElement("beforeEnd",el_button);
                            newordernum+=1;
                        }

                    }catch(e){
                        console.error(`检查订单出现错误`);
                        msgDisplay(`检查订单出现错误`);
                        console.error(e);
                    }
                }
                if(el_div_ordertitle.length==0){
                    msgDisplay(`没有订单列表`);
                }else{
                    if(newordernum>0){
                        msgDisplay(`找到新订单${newordernum}个，请导入`);
                    }else{
                        msgDisplay(`没有找到新订单`);
                    }
                }
                if(el_btn){
                    el_btn.removeAttribute("disabled");
                }
            })();
        };


    };
    //-------------------------------------------- 京东墨卡托 ->  ----------------------------------------------------------------------------
    //订单列表页面，检查订单是否为新订单
    const fn_initJDGoodsMenuBar=()=>{
        console.log('进入京东页面');
        if(window !== window.top){
            return;
        }
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar ){
            console.log('创建京东助手功能菜单');
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:9999;width:10em;background-color:lightblue;position:fixed;top:10px;right:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";
            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="商品助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";
           //导入数量输入框
            const el_input=document.createElement("input");
            el_mainContainer.append(el_input);
            el_input.style="width:100%;margin-bottom:5px;";
            el_input.setAttribute("placeholder","请输入导入的商品数");
            el_input.classList.add("hy_input_importgoodsnum");
            //导入输入商品按钮
            const el_b3=document.createElement("button");
            el_mainContainer.append(el_b3);
            el_b3.style="width:90%;margin-bottom:5px;";
            el_b3.textContent="导入商品";
            el_b3.addEventListener("click",(event)=>{doImportGoods();});
            el_b3.classList.add("hy_btn_importjdgoods");
            //查询消息显示区
            const el_msg1=document.createElement("div");
            el_mainContainer.append(el_msg1);
            el_msg1.style="width:90%;color:red;display:block;margin-bottom:5px;";
            el_msg1.innerText="";
            el_msg1.classList.add("hy_msg1");
            //将助手工具添加到页面

            document.body.insertAdjacentElement("afterBegin",el_menubar);
        }
        //提交京东商品到华远后台京东商品库中
       const postJDGoodsToHYSM=(goods)=>{
            return new Promise((resolve,reject)=>{
                const post_data={
                    "mainbrandname":goods.mainBrandName,
                    "maincategorymame":goods.mainCategoryName,
                    "mainunitcode":goods.mainUnitCode,
                    "manufacturercode":goods.manufacturerCode,
                    "productname":goods.productName,
                    "lowestbuy":goods.lowestBuy,
                    "b2bskustate":goods.b2bSkuState,
                    "jdprice":goods.jdPrice,
                    "createdate":timestampToDate(goods.createDate),
                    "jdskuid":goods.jdSkuId,
                    "stockmumber":goods.stockNumber,
                    "jddataid":goods.id,
                };
                //console.log(JSON.stringify(post_data));
                const post_headers={
                    "Content-Type":"application/x-www-form-urlencoded",
                };
               GM_xmlhttpRequest({
                    url:"http://43.143.136.44/hysm/importjdgoods.asp",
                    method:'POST',
                    data:"param="+encodeURIComponent(JSON.stringify(post_data)),
                    headers:post_headers,
                    onload:(event)=>{
                        try{
                            const response=JSON.parse(event.responseText);
                            if(response.returncode==0){
                                resolve();
                            }else{
                                reject(response);
                            }
                        }catch(e){
                            reject(e);
                        }
                    },
                    onerror:(event)=>{
                        reject(event);
                    }
                });
            });
       }
       //点击导入商品按钮，导入前n条商品
       const doImportGoods=()=>{
            (async()=>{
                console.log('开始导入商品');
                const el_btn=document.querySelector(".hy_btn_importjdgoods");
                if(el_btn){
                    el_btn.setAttribute("disabled",true);
                }
                let goodsnum=0;
                const el_input = document.querySelector('.hy_input_importgoodsnum');
                if (!isNaN(el_input.value)){
                    goodsnum = parseInt(el_input.value);
                }
                console.log(goodsnum);
                if(goodsnum>0){
                    let uploadGoodsFailNum=0;
                    let uploadGoodsSucessNum=0;
                    msgDisplay(`正在准备要上传的商品列表`);
                    const goodsList = await getJDGoodsList(0,goodsnum);
                    console.log(goodsList);
                    const alldatanum =goodsList.datas.length;
                    for(let i=0;i< alldatanum;i++){
                        const goods = goodsList.datas[i];
                        try{
                            await postJDGoodsToHYSM(goods);
                            uploadGoodsSucessNum+=1;
                            console.log(`成功上传${goods.jdSkuId} (${i}/${alldatanum})`);
                            msgDisplay(`成功上传${goods.jdSkuId} (${i}/${alldatanum})`);
                        }catch(e){
                            uploadGoodsFailNum+=1;
                            console.error(`提交出现错误${goods.jdSkuId} (${i}/${alldatanum})`);
                            msgDisplay(`提交出现错误${goods.jdSkuId} (${i}/${alldatanum})`);
                            console.error(e);
                        }
                    }
                    msgDisplay(`导入完毕，成功${uploadGoodsSucessNum}条 失败${uploadGoodsFailNum}条`);
                }else{
                    console.log('请输入导入数量');
                    msgDisplay('请输入导入数量');
                }
                if(el_btn){
                    el_btn.removeAttribute("disabled");
                }

            })();
        };

        //取得商品列表
        const getJDGoodsList=(start,length)=>{
            return new Promise((resolve,reject)=>{
                let post_data=`draw=2&start=${start}&length=${length}&productMode=ICF&isSearch=true`;
                console.log(post_data);
                const post_headers={
                    "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",
                };
                GM_xmlhttpRequest({
                    url:"https://supadmin.jd.com/jdiSupplyProduct/list.do",
                    method:'POST',
                    data:JSON.stringify(post_data),
                    headers:post_headers,
                    onload:(event)=>{
                        try{
                            if(event.status==200){

                                const response=JSON.parse(event.responseText);
                                if(response.responseCode=="200"){
                                    resolve(response.responseData);
                                }else{
                                    console.log('取数据错误');
                                    reject(response.responseMessage);
                                }
                            }else{
                                reject(event);
                            }
                        }catch(e){
                            reject(e);
                        }
                    },
                    onerror:(event)=>{
                        reject(event);
                    }
                });
            });
        };


    }
        //-------------------------------------------- 石油易采->销售订单 ----------------------------------------------------------------------------
    //订单列表页面，检查订单是否为新订单
    const fn_initOrderList=()=>{
        console.log('进入石油e采订单列表页面');
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar){
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:999;width:10em;background-color:lightblue;position:fixed;top:10px;right:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";
            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="订单助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";
            //导入输入商品按钮
            const el_b3=document.createElement("button");
            el_mainContainer.append(el_b3);
            el_b3.style="width:90%;margin-bottom:5px;";
            el_b3.textContent="检查新订单";
            el_b3.addEventListener("click",(event)=>{doCheckOrders()});
            el_b3.classList.add("hy_btn_check_neworder");
            //查询消息显示区
            const el_msg1=document.createElement("div");
            el_mainContainer.append(el_msg1);
            el_msg1.style="width:100%;color:red;display:block;margin-bottom:5px;";
            el_msg1.innerText="";
            el_msg1.classList.add("hy_msg1");
            //将助手工具添加到页面
            document.body.insertAdjacentElement("afterBegin",el_menubar);
        }

        //取得订单详情
        const getOrderDetail=(orderno)=>{
            return new Promise((resolve,reject)=>{
                const post_headers={
                    "Content-Type":"application/json;charset=UTF-8",
                    "Authorization":getAuthorization(),
                };
                GM_xmlhttpRequest({
                    url:`https://benefits.soluxemall.com/proxy/order/seller/order/getPurchaseInfo?platformId=20&orderNo=${orderno}&handle=2`,
                    method:'GET',
                    headers:post_headers,
                    onload:(event)=>{
                        try{
                            if(event.status==200){
                                const response=JSON.parse(event.responseText);
                                if(response.code=="0"){
                                    resolve(response.data);
                                }else{
                                    reject(response.msg);
                                }
                            }else{
                                reject(event);
                            }
                        }catch(e){
                            reject(e);
                        }
                    },
                    onerror:(event)=>{
                        reject(event);
                    }
                });
            });
        };

        //导入新订单
       const doImportOrders=(orderno)=>{
            (async()=>{
            //开始导入订单
                console.log(`开始导入订单${orderno}`);
                const ecaiorder=await getOrderDetail(orderno);
                console.log(ecaiorder);
                const order={
                    orderfrom:0,
                    orderbh:ecaiorder.nyoneOrderNo,
                    ordertime:ecaiorder.orderTime,
                    company:"华油阳光（北京）商贸有限责任公司",
                    personname:ecaiorder.receiverName,
                    tell:ecaiorder.mobile,
                    address:ecaiorder.address,
                    note:(ecaiorder.remark||"").replace("null",""),
                    orderamount:ecaiorder.totalPrice,
                };
                let has_error=false;
                let has_goods=false;
                let totalAmount=0;
                let goods_index=0;
                let errmsg="";
                let goodsItems=[];
                for(let i=0;i<ecaiorder.subOrderInfoResultVoList[0].subSkuDemandInfo.length;i++){
                    const ecaiGoodsitem=ecaiorder.subOrderInfoResultVoList[0].subSkuDemandInfo[i];
                    const ecaiGoodsdetail = await getGoodsDetail(ecaiGoodsitem.skuId);
                    console.log(ecaiGoodsdetail);
                    has_goods=true;
                    let goodsitem= new Object;
                    goodsitem.goodsid=ecaiGoodsitem.skuId; //商品sku
                    goodsitem.goodsBrand=ecaiGoodsdetail.brandCnName; //商品品牌
                    goodsitem.goodsname=ecaiGoodsdetail.shopBaseSkuName; //商品名称
                    goodsitem.goodsOrderPrice=ecaiGoodsitem.sellPrice; //商品单价
                    goodsitem.goodsNum=ecaiGoodsitem.skuNums; //采购数量
                    goodsitem.goodsUnit=ecaiGoodsdetail.sourceSkuUnit; //商品单位
                    totalAmount+=ecaiGoodsitem.sellPrice*ecaiGoodsitem.skuNums;
                    goods_index++;
                    goodsItems.push(goodsitem);
                }
                order.goodsItems = goodsItems;
                totalAmount = totalAmount.toFixed(2);
                order.orderamount=totalAmount;
                order.ordergoodsnum=goods_index;
                if(totalAmount!=ecaiorder.totalPrice){
                    console.log(`计算出的订单金额：${totalAmount}- ${ecaiorder.totalPrice}`);
                    console.log('订单金额对比错误');
                    errmsg = `订单金额对比错误：${totalAmount}- ${ecaiorder.totalPrice}`;
                    has_error =true;

                }
                if(!has_goods){
                    has_error =true;
                    errmsg = '订单中没有商品信息';
                }
                //构造提交的表单
                if(!has_error){
                    postDataToHYSM(order);
                }else{
                    console.log(`导入订单失败，${errmsg}`);
                    msgDisplay(`导入订单失败，${errmsg}`);
                }

            })();
        };

   //检查新订单

       const doCheckOrders=()=>{
            (async()=>{
                console.log('检查页面中的订单是否有新订单');
                msgDisplay(`检查页面中的订单是否有新订单`);
                const el_btn=document.querySelector(".hy_btn_check_neworder");
                if(el_btn){
                    el_btn.setAttribute("disabled",true);
                }
                const el_btn_arr = document.querySelectorAll('.hy_import_order_btn')||[];
                for(let i=0;i<el_btn_arr.length;i++){
                    el_btn_arr[i].parentNode.removeChild(el_btn_arr[i]);
                }
                const orderDiv = document.querySelector(".layui-tab-item.layui-show");
                const trTitleList = orderDiv.querySelectorAll("tr.trTitle")||[];
                let newordernum=0;
                for(let i=0;i<trTitleList.length;i++){
                    try{
                        msgDisplay(`检查订单${i+1}/${trTitleList.length}`);
                        const orderno=trTitleList[i].querySelector("input.table-checkbox").getAttribute('data-order-no');
                        const order=await getOrderDetail(orderno);
                        console.log(order);
                        const hycheckOrder = await getHYSMOrderDetail(order.nyoneOrderNo);
                        console.log(hycheckOrder);
                        if(hycheckOrder.found=="no" ){
                            //发现新订单
                            console.log(`发现新订单${orderno}-${order.nyoneOrderNo}`);
                            const el_button=document.createElement("button");
                            el_button.classList.add("hy_import_order_btn");
                            el_button.style="background:#ffb800;cursor: pointer;border-style:none";
                            el_button.innerText="导入华远系统";
                            el_button.addEventListener("click",(event)=>{
                                            const el_button=event.target;
                                            const order_id=el_button.dataset.orderid
                                            doImportOrders(orderno);
                                        });
                            const tdarray= trTitleList[i].querySelectorAll("td")||[];
                            if (tdarray.length>0){
                                tdarray[tdarray.length-1].insertAdjacentElement("beforeEnd",el_button);
                            }
                            newordernum+=1;
                        }

                    }catch(e){
                        console.error(`检查订单出现错误`);
                        msgDisplay(`检查订单出现错误`);
                        console.error(e);
                    }
                }
                if(trTitleList.length==0){
                    msgDisplay(`没有订单列表`);
                }else{
                    if(newordernum>0){
                        msgDisplay(`找到新订单${newordernum}个，请导入`);
                    }else{
                        msgDisplay(`没有找到新订单`);
                    }
                }
                if(el_btn){
                    el_btn.removeAttribute("disabled");
                }
            })();
        };
    }

//-------------------------------------------- 石油易采->供应商中心->商品管理->能源一号网 ----------------------------------------------------------------------------

    //初始化添加商品页面
    const fn_initNumberOne=()=>{
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar){
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:999;width:10em;background-color:lightblue;position:fixed;top:10px;right:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";


            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="上架助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";
           //商品sku输入框
            const el_input=document.createElement("input");
            el_mainContainer.append(el_input);
            el_input.style="width:100%;margin-bottom:5px;";
            el_input.setAttribute("placeholder","填入商品9开头sku");
            el_input.classList.add("hy_input_shopskucodes");
            //导入输入商品按钮
            const el_b3=document.createElement("button");
            el_mainContainer.append(el_b3);
            el_b3.style="width:90%;margin-bottom:5px;";
            el_b3.textContent="上传商品";
            el_b3.addEventListener("click",(event)=>{doUploadGoodsListBySKU()});
            el_b3.classList.add("hy_btn_import_goodsbysku");

            //导入全部商品按钮
            const el_b1=document.createElement("button");
            el_mainContainer.append(el_b1);
            el_b1.style="width:90%;margin-bottom:5px;";
            el_b1.textContent="上传全部商品";
            el_b1.addEventListener("click",(event)=>{doUploadGoodsListByPage(1,200)});
            el_b1.classList.add("hy_btn_importALL_goods");
            //上传响应商品按钮
            const el_b2=document.createElement("button");
            el_mainContainer.append(el_b2);
            el_b2.style="width:90%;margin-bottom:5px;";
            el_b2.textContent="上传响应商品";
            el_b2.addEventListener("click",(event)=>{doUploadApplyGoodsListByPage(1,200)});
            el_b2.classList.add("hy_btn_importapply_goods");
            //查询消息显示区
            const el_msg1=document.createElement("div");
            el_mainContainer.append(el_msg1);
            el_msg1.style="width:100%;color:red;display:block;margin-bottom:5px;";
            el_msg1.innerText="";
            el_msg1.classList.add("hy_msg1");

            //完成信息显示区
            const el_msg2=document.createElement("div");
            el_mainContainer.append(el_msg2);
            el_msg2.style="width:100%;color:red;display:none;margin-bottom:5px;color:green";
            el_msg2.innerText="完成！可点击保存提交产品";
            el_msg2.classList.add("hy_msg2");

        //将助手工具添加到页面
        document.body.insertAdjacentElement("afterBegin",el_menubar);
        };

        //取得商品列表
        const getGoodsListByPage=(pageNum,pageSize,status)=>{
            return new Promise((resolve,reject)=>{
                let post_data={pageNum: pageNum, pageSize: pageSize}
                if(status>0 ){
                    post_data.status=status;
                };
                //console.log(post_data);
                const post_headers={
                    "Content-Type":"application/json;charset=UTF-8",
                    "Authorization":getAuthorization(),
                };
                GM_xmlhttpRequest({
                    url:"https://benefits.soluxemall.com/proxy/item-center/energynet/platform/shopDataFilling/selectPageListByStatus",
                    method:'POST',
                    data:JSON.stringify(post_data),
                    headers:post_headers,
                    onload:(event)=>{
                        try{
                            if(event.status==200){

                                const response=JSON.parse(event.responseText);
                                if(response.code=="0"){
                                    resolve(response.data);
                                }else{
                                    reject(response.msg);
                                }
                            }else{
                                reject(event);
                            }
                        }catch(e){
                            reject(e);
                        }
                    },
                    onerror:(event)=>{
                        reject(event);
                    }
                });
            });
        };



        //两次请求的最小间隔时间
        const minReuestInterval=2000;

        //输入的sku商品上传
        const doUploadGoodsListBySKU=()=>{
            (async()=>{
                const el_btn=document.querySelector(".hy_btn_import_goodsbysku");
                if(el_btn){
                    el_btn.setAttribute("disabled",true);
                }
                const shopSkuId=document.querySelector(".hy_input_shopskucodes").value;
                try{
                    const goods=await getGoodsDetail(shopSkuId);
                    await postGoodsToHYMS(goods);
                    console.log(`已上传商品${shopSkuId}`)
                     msgDisplay(`已上传商品${shopSkuId}`);
                }catch(e){
                    console.error(`提交商品出现错误${shopSkuId}`);
                    msgDisplay(`提交商品出现错误${shopSkuId}`);
                    console.error(e);
                }
                if(el_btn){
                    el_btn.removeAttribute("disabled");
                }
            })();
        };
       let uploadApplyGoodsSucessNum=0; //成功上传数目
       let uploadApplyGoodsFailNum=0; //失败上传数目
       //遍历响应的商品并上传响应信息，采用递归方式遍历所有页
        const doUploadApplyGoodsListByPage=(pn,ps)=>{
            (async()=>{
                const el_btn=document.querySelector(".hy_btn_importapply_goods");
                if(el_btn){
                    el_btn.setAttribute("disabled",true);
                }
                const response=await getGoodsListByPage(pn,ps,3);
                //console.log(response);
                const pageNum=response.pageNum;
                const pageSize=response.pageSize;
                const totalPageCount=response.totalPageCount;
                const totalCount=response.totalCount;
                const result=response.result;
                for(let i=0;i<result.length;i++){
                    const t0=(new Date()).getTime();
                    const currentNum=(pageNum-1)*pageSize+i+1;
                    const shopSkuId=result[i].shopSkuId;
                    try{
                        await postApplyGoodsToHYMS(result[i]);
                        uploadApplyGoodsSucessNum+=1;
                        console.log(`已上传响应商品${shopSkuId}(${currentNum}/${totalCount} at page:${pageNum})`)
                    }catch(e){
                        uploadApplyGoodsFailNum+=1;
                        console.error(`提交响应商品出现错误${shopSkuId}(${currentNum}/${totalCount} at page:${pageNum})`);
                        console.error(result[i]);
                        console.error(e);
                    }
                    const t1=(new Date()).getTime();
                    if(t1-t0<minReuestInterval){
                        const sleepSeconds=(minReuestInterval-(t1-t0))/1000;
                        //console.log(`sleep ${sleepSeconds}秒`);
                        //await sleep(sleepSeconds);
                    }
                     msgDisplay(`上传成功${uploadApplyGoodsSucessNum}条失败${uploadApplyGoodsFailNum}条`);
                }
                if(pageNum<totalPageCount){
                    doUploadApplyGoodsListByPage(pageNum+1,pageSize);
                }else{
                    console.log("上传结束");
                    msgDisplay(`上传成功${uploadApplyGoodsSucessNum}条失败${uploadApplyGoodsFailNum}条 上传结束` );
                    if(el_btn){
                        el_btn.removeAttribute("disabled");
                    }
                }

            })();
        };
       let uploadGoodsSucessNum=0; //成功上传数目
       let uploadGoodsFailNum=0; //失败上传数目
        //遍历商品并上传，采用递归方式遍历所有页
        const doUploadGoodsListByPage=(pn,ps)=>{
            (async()=>{
                const el_btn=document.querySelector(".hy_btn_importALL_goods");
                if(el_btn){
                    el_btn.setAttribute("disabled",true);
                }
                const response=await getGoodsListByPage(pn,ps,0);
                const pageNum=response.pageNum;
                const pageSize=response.pageSize;
                const totalPageCount=response.totalPageCount;
                const totalCount=response.totalCount;
                const result=response.result;
                for(let i=0;i<result.length;i++){
                    const t0=(new Date()).getTime();
                    const currentNum=(pageNum-1)*pageSize+i+1;
                    const shopSkuId=result[i].shopSkuId;
                    try{

                        const goods=await getGoodsDetail(shopSkuId);
                        await postGoodsToHYMS(goods);
                        console.log(`已上传商品${shopSkuId}(${currentNum}/${totalCount} at page:${pageNum})`)
                        uploadGoodsSucessNum +=1;
                    }catch(e){
                        console.error(`提交商品出现错误${shopSkuId}(${currentNum}/${totalCount} at page:${pageNum})`);
                        console.error(result[i]);
                        uploadGoodsFailNum +=1;
                        console.error(e);
                    }
                    msgDisplay(`上传成功${uploadGoodsSucessNum}条失败${uploadGoodsFailNum}条`);
                    const t1=(new Date()).getTime();
                    if(t1-t0<minReuestInterval){
                        const sleepSeconds=(minReuestInterval-(t1-t0))/1000;
                        //console.log(`sleep ${sleepSeconds}秒`);
                        await sleep(sleepSeconds);
                    }

                }
                if(pageNum<totalPageCount){
                    doUploadGoodsListByPage(pageNum+1,pageSize);
                }else{
                    msgDisplay(`上传成功${uploadGoodsSucessNum}条失败${uploadGoodsFailNum}条 上传结束`);
                    console.log("上传结束");
                    if(el_btn){
                        el_btn.removeAttribute("disabled");
                    }
                }
            })();
        };

        //上传商品响应到HYMS
        const postApplyGoodsToHYMS=(goods)=>{
            return new Promise((resolve,reject)=>{
                //console.log(goods);
                const post_data={
                    "isagree":1,
                    "sellarea":goods.areaNames||[],
                    "agreeprice":goods.supplierSupplyPrice,
                    "shopSkuId":goods.shopSkuId
                };
                //console.log("post_data="+JSON.stringify(post_data));
                const post_headers={
                    "Content-Type":"application/x-www-form-urlencoded",
                };
               GM_xmlhttpRequest({
                    url:"http://43.143.136.44/hysm/importapplygoods.asp",
                    method:'POST',
                    data:"param="+encodeURIComponent(JSON.stringify(post_data)),
                    headers:post_headers,
                    onload:(event)=>{
                        try{
                            const response=JSON.parse(event.responseText);
                            if(response.returncode==0){
                                resolve();
                            }else{
                                reject(response);
                            }
                        }catch(e){
                            reject(e);
                        }
                    },
                    onerror:(event)=>{
                        reject(event);
                    }
                });
            });
        }


        //上传商品到HYMS
        const postGoodsToHYMS=(goods)=>{
            return new Promise((resolve,reject)=>{
                //console.log(goods);
                let goodsimgs = new Array();
                let dataapplyItemAnnexRequestVoList = goods.applyItemAnnexRequestVoList||[];
                for(let i=0;i<dataapplyItemAnnexRequestVoList.length;i++){
                    goodsimgs.push(dataapplyItemAnnexRequestVoList[i].annexUrl);
                }
                const post_data={
                    "brandCnName":goods.brandCnName,
                    "brandEnName":goods.brandEnName,
                    "detail":goods.detail,
                    "energySellPrice":goods.energySellPrice,
                    "goodsCode":goods.goodsCode,
                    "goodsName":goods.goodsName,
                    "itemCode":goods.itemCode,
                    "marketPrice":goods.marketPrice,
                    "param":goods.param,
                    "paramJson":goods.paramJson,
                    "shopSkuId":goods.shopSkuId,
                    "shopBaseSkuName":goods.shopBaseSkuName,
                    "sourceSkuUnit":goods.sourceSkuUnit,
                    "taxCode":goods.taxCode,
                    "taxRate":goods.taxRate,
                    "sellPrice":goods.sellPrice,
                    "goodsimgs":goodsimgs||[],
                };
                console.log(JSON.stringify(post_data));
                const post_headers={
                    "Content-Type":"application/x-www-form-urlencoded",
                };
               GM_xmlhttpRequest({
                    url:"http://43.143.136.44/hysm/importenergynetgoods.asp",
                    method:'POST',
                    data:"param="+encodeURIComponent(JSON.stringify(post_data)),
                    headers:post_headers,
                    onload:(event)=>{
                        try{
                            const response=JSON.parse(event.responseText);
                            if(response.returncode==0){
                                resolve();
                            }else{
                                reject(response);
                            }
                        }catch(e){
                            reject(e);
                        }
                    },
                    onerror:(event)=>{
                        reject(event);
                    }
                });
            });
        }

    };


    /*----------------------------------访问页面到功能入口的路由---------------------------------------------*/
    const hyMenuBarShow=()=>{
        let el_menubar=document.querySelector(".hy_menubar");
        if(el_menubar){
            el_menubar.parentNode.removeChild(el_menubar);
        }
        const href=document.location.href;
        const match=[
            {
                "re":/shop-view\/goods\//,
                "fn":fn_initNumberOne,
            },
            {
                "re":/shop-view\/order\/order-list/,
                "fn":fn_initOrderList,
            },
            {
                "re":/supadmin.jd.com/,
                "fn":fn_initJDGoodsMenuBar,
            },
            {
                "re":/shop.jd.com\/jdm\/trade\/orders\/order-list/,
                "fn":fn_initJDOrderMenuBar,
            },
            {
                "re":/shop.jd.com\/jdm\/trade\/order\/orderDetail/,
                "fn":fn_initJDOrderDetailMenuBar,
            },
            {
                "re":/https:\/\/www2.energyahead.com\/html\/supermarket.html/,
                "fn":fn_initEnergyNetMenuBar,
            },
        ];


        const param={};
        (href.match(/(?<=[\?\&])([^\?\&]+)/g)||[]).forEach((s)=>{
            let p=s.indexOf("=");
            p=p>=0?p:s.length;
            const key=s.substring(0,p);
            const value=s.substring(p+1);
            if(key){
                param[key]=value;
            }
        });
        for(let i=0;i<match.length;i++){
            const m=match[i];
            if(m.re.test(href)){
                m.fn({param:param});
                break;
            }
        }
    }
    window.addEventListener('popstate', function(event) {
        var currentUrl = document.location.href;
        console.log('URL changed to: ' + currentUrl);
        hyMenuBarShow();

    });
    console.log("上架助手已启动");
    hyMenuBarShow();

})();