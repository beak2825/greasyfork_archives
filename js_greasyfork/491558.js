// ==UserScript==
// @name         上架助手-油猴插件
// @namespace    http://tampermonkey.net/
// @version      2024-06-06_01
// @description  上架助手
// @license      MIT
// @author       Beerspume
// @match        https://www2.energyahead.com/*
// @match        https://www2.energyahead.cnpc/*
// @match        https://soluxemall.com/seller/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=www2.energyahead.com
// @grant        GM_addElement
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/491558/%E4%B8%8A%E6%9E%B6%E5%8A%A9%E6%89%8B-%E6%B2%B9%E7%8C%B4%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/491558/%E4%B8%8A%E6%9E%B6%E5%8A%A9%E6%89%8B-%E6%B2%B9%E7%8C%B4%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const FieldMap=[
        {labelName:"商品名称",value:()=>{return (Goods.goodsname||"").replace(/^(\+\s*)?/,"SQHY ")}},
        {labelName:"官网地址",columnName:"mpriceurl"},
        {labelName:"UPC编码",columnName:"upccode"},
        {labelName:"税率",value:"0.13"},
        {labelName:"所属品牌",columnName:"goodsbrand"},
        {labelName:"计量单位",columnName:"goodsunit"},
        {labelName:"物资分类",columnName:"zsycodes"},
        {labelName:"供货价",value:()=>{return (Math.round(Math.floor(Goods.eshopprice*0.95*10000+0.1)/100)/100)}},//这里做两次四舍五入是解决浮点计算的精读问题
        {labelName:"市场价",columnName:"macketprice"},
        {labelName:"库存"},
        {labelName:"规格名称",value:"规格"},
        {labelName:"规格值",columnName:"goodsmodel"},
        {labelName:"山东",value:false},
        {labelName:"福建",value:false},
        {labelName:"台湾",value:true},
        {labelName:"河北",value:false},
        {labelName:"河南",value:false},
        {labelName:"重庆",value:false},
        {labelName:"湖北",value:false},
        {labelName:"湖南",value:false},
        {labelName:"海南",value:false},
        {labelName:"江西",value:false},
        {labelName:"黑龙江",value:false},
        {labelName:"天津",value:false},
        {labelName:"贵州",value:false},
        {labelName:"陕西",value:false},
        {labelName:"新疆",value:false},
        {labelName:"江苏",value:false},
        {labelName:"安徽",value:false},
        {labelName:"西藏",value:true},
        {labelName:"吉林",value:false},
        {labelName:"上海",value:false},
        {labelName:"甘肃",value:false},
        {labelName:"宁夏",value:false},
        {labelName:"山西",value:false},
        {labelName:"四川",value:false},
        {labelName:"港澳",value:true},
        {labelName:"广西",value:false},
        {labelName:"浙江",value:false},
        {labelName:"云南",value:false},
        {labelName:"内蒙古",value:false},
        {labelName:"辽宁",value:false},
        {labelName:"广东",value:false},
        {labelName:"青海",value:false},
        {labelName:"北京",value:false},
        {labelName:"中石油昆仑好客有限公司",value:true},
    ];
    let Goods={};
    FieldMap.forEach((kv)=>{
        const labelName=kv.labelName;
        const re = new RegExp(`.*${labelName}.*`, "g");
        kv.re=re;

    });

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
    const api=(api_name,data)=>{
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                url:"http://43.143.136.44/hysm/api/api.asp",
                method:'POST',
                responseType:"json",
                headers:{i:api_name,"Content-Type":"application/x-www-form-urlencoded"},
                data:ObjToParams(data),
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

    //-------------------------------------------- 能源一号  添加商品 ----------------------------------------------------------------------------
    //初始化添加商品页面
    const fn_initAddPage=()=>{
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar){
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:999;width:10em;background-color:lightblue;position:fixed;top:90px;left:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            // 批量助手图标
            const el_toolbar=document.createElement("div");
            el_menubar.append(el_toolbar);
            el_toolbar.innerText="\u2261";
            el_toolbar.style="position: absolute;top:0px;right:5px;font-size:1.5em;cursor:pointer;";
            el_toolbar.addEventListener("click",()=>{
                const el_batch=document.querySelector(".hy_batch");
                if(el_batch.style.display!="none"){
                    el_batch.style.display="none";
                }else{
                    el_batch.style.display="block";
                }
            });

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="width:100%;height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";


            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="上架助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";

            //E采码输入框
            const el_input=document.createElement("input");
            el_mainContainer.append(el_input);
            el_input.style="width:100%;margin-bottom:5px;";
            el_input.setAttribute("placeholder","填入E采码");
            el_input.classList.add("hy_ecaicodes");
            //el_input.value="2212300066";

            //查询按钮
            const el_b1=document.createElement("button");
            el_mainContainer.append(el_b1);
            el_b1.style="width:90%;margin-bottom:5px;";
            el_b1.textContent="查找商品";
            el_b1.addEventListener("click",fn_searchGoods);
            el_b1.classList.add("hy_btn_search_goods");

            //查询消息显示区
            const el_msg1=document.createElement("div");
            el_mainContainer.append(el_msg1);
            el_msg1.style="width:100%;color:red;display:none;margin-bottom:5px;";
            el_msg1.innerText="";
            el_msg1.classList.add("hy_msg1");

            //上传图片按钮
            const el_b2=document.createElement("button");
            el_mainContainer.append(el_b2);
            el_b2.style="width:90%;margin-bottom:5px;";
            el_b2.textContent="上传图片";
            el_b2.addEventListener("click",fn_uploadImage);
            el_b2.setAttribute("disabled",true);
            el_b2.classList.add("hy_btn_upload_image");

            //完成信息显示区
            const el_msg2=document.createElement("div");
            el_mainContainer.append(el_msg2);
            el_msg2.style="width:100%;color:red;display:none;margin-bottom:5px;color:green";
            el_msg2.innerText="完成！可点击保存提交产品";
            el_msg2.classList.add("hy_msg2");

            //批量助手功能区
            const el_batch=document.createElement("div");
            el_menubar.append(el_batch);
            el_batch.style="position: absolute;top:0px;left:10em; width:10em;background-color:lightblue; border-radius:5px;box-shadow: 0px 0px 10px; display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";
            el_batch.classList.add("hy_batch");


            //批量粘贴按钮
            const el_btn_paste=document.createElement("button");
            el_batch.append(el_btn_paste);
            el_btn_paste.style="width:90%;margin-bottom:5px;";
            el_btn_paste.textContent="批量粘贴E采码";
            el_btn_paste.addEventListener("click",()=>{
                const el_textPaste=document.querySelector(".hy_textPaste");
                const el_ecode_list=document.querySelector(".hy_ecodeList");
                if(el_textPaste){
                    if(el_textPaste.style.display=="none"){
                        el_textPaste.style.display="block";
                        const s=fn_readBatchECode();
                        el_textPaste.value=s.replace(/,/g,"\n");
                        if(el_ecode_list) el_ecode_list.style.display="none";
                    }else{
                        el_textPaste.style.display="none"
                        if(el_ecode_list) el_ecode_list.style.display="block";
                        fn_saveBatchECode(el_textPaste.value);
                        fn_refreshBatchECode();

                    }
                }
            });

            //自动导入需要上传的E采码
            const el_btn_need_sync_to_energyahead=document.createElement("button");
            el_batch.append(el_btn_need_sync_to_energyahead);
            el_btn_need_sync_to_energyahead.style="width:90%;margin-bottom:5px;";
            el_btn_need_sync_to_energyahead.textContent="自动获取E采码";
            el_btn_need_sync_to_energyahead.addEventListener("click",()=>{
                (async()=>{
                    const api_result=await api("need_sync_to_energyahead",{limit:20});
                    const codes=[];
                    api_result.forEach((d)=>{
                        codes.push(d.ecaicodes);
                    });
                    fn_saveBatchECode(codes.join("\n"));
                    fn_refreshBatchECode();
                })();
            });

            //批量粘贴输入框
            const el_text_paste=document.createElement("textarea");
            el_batch.append(el_text_paste);
            el_text_paste.style="width:90%;margin-bottom:5px;";
            el_text_paste.setAttribute("rows",40);
            el_text_paste.classList.add("hy_textPaste");

            //批量E采码列表
            const el_ecode_list=document.createElement("ul");
            el_batch.append(el_ecode_list);
            el_ecode_list.style="width:90%;margin-bottom:5px;height: 40em;overflow-y: auto;";
            el_ecode_list.classList.add("hy_ecodeList");

        }

        //将助手工具添加到页面
        document.body.insertAdjacentElement("afterBegin",el_menubar);

        //根据存储情况显示批量助手界面
        const el_text_paste=document.querySelector(".hy_textPaste");
        const el_ecode_list=document.querySelector(".hy_ecodeList");
        if(fn_readBatchECode()){
            el_text_paste.style.display="none";
            el_ecode_list.style.display="block";
            fn_refreshBatchECode();
        }else{
            el_text_paste.style.display="block";
            el_ecode_list.style.display="none";
        }

        //绑定原生页面的保存按钮，用于触发刷新批量E采码的修改
        const el_submit=document.querySelector("#confirm-btn-id");
        if(el_submit){
            el_submit.addEventListener("click",fn_useECode);
        }

    };

    const KEY_BatchCodes="BatchCodes";
    //保存批量E采码
    const fn_saveBatchECode=(s)=>{
        const code_list=s.split(/[\s;,|]+/);
        localStorage.setItem(KEY_BatchCodes,code_list);
    }
    const fn_readBatchECode=()=>{
        return localStorage.getItem(KEY_BatchCodes);

    }
    const fn_refreshBatchECode=()=>{
        const s=fn_readBatchECode()||"";
        const code_list=s.split(/[\s;,|]+/);
        const el_ecode_list=document.querySelector(".hy_ecodeList");
        if(el_ecode_list){
            const unused_li=[];
            const used_li=[];
            code_list.forEach((code)=>{
                if(code.trim()!==""){
                    const el_li=document.createElement("li");
                    //el_ecode_list.append(el_li);
                    const used=code.startsWith("--");
                    if(used){
                        code=code.replace(/^--/g,"");
                        used_li.push(el_li);
                    }else{
                        unused_li.push(el_li);
                    }
                    el_li.innerText=code;
                    if(used){
                        el_li.style="text-align:center;margin-bottom:3px;cursor:pointer;border: 1px solid green;background-color: green;color: white;";
                    }else{
                        el_li.style="text-align:center;margin-bottom:3px;cursor:pointer;border: 1px solid black;";
                    }
                    el_li.addEventListener("click",(event)=>{
                        const el_li=event.target;
                        const el_ecaicodes=document.querySelector(".hy_ecaicodes");
                        const btn_search_goods=document.querySelector(".hy_btn_search_goods");

                        if(el_ecaicodes){
                            el_ecaicodes.value=el_li.innerText;
                            if(btn_search_goods){
                                btn_search_goods.dispatchEvent(new Event("click"));
                            }
                        }

                    });
                }
            });
            while (el_ecode_list.firstChild) {
                el_ecode_list.removeChild(el_ecode_list.firstChild);
            }
            unused_li.concat(used_li).forEach((el_li)=>{
                el_ecode_list.append(el_li);
            });

        }

    }

    //标记当前输入框中的E采码为使用过状态
    const fn_useECode=()=>{
        const el_ecaicodes=document.querySelector(".hy_ecaicodes");
        if(el_ecaicodes){
            const code=el_ecaicodes.value.trim();
            if(code){
                localStorage.setItem(KEY_BatchCodes,localStorage.getItem(KEY_BatchCodes).replace(new RegExp(`^(${code})([,\s$])`, "g"),"--$1$2").replace(new RegExp(`([,\s])(${code})([,\s$])`, "g"),"$1--$2$3"));
                fn_refreshBatchECode();
            }
        }
    }

    //从数据库中取得商品信息
    const fn_getGoods=(code)=>{
        return new Promise((resolve,reject)=>{
            (async()=>{
                try{
                    const api_result=await api("goods_detail_shangjiazhushou",{code:code});
                    resolve(api_result[0]);
                }catch(e){
                    reject(e);
                }
            })();
        });
    };

    const fn_getGoodsImages=(goodsid)=>{
        return new Promise((resolve,reject)=>{
            (async()=>{
                try{
                    const images=[];
                    const response=await api("goods_image",{goodsid:goodsid});
                    response.forEach((d)=>{
                        images.push(d.imgurl);
                    });
                    resolve(images);
                }catch(e){
                    reject(e);
                }
            })();
        });
    };

    //从搜索商品
    const fn_searchGoods=()=>{
        (async()=>{
            const el_code=document.querySelector(".hy_ecaicodes");
            if(el_code){
                const code=el_code.value.trim();
                if(code){
                    const el_msg1=document.querySelector(".hy_msg1");
                    if(el_msg1){
                        el_msg1.innerText="";
                        el_msg1.style.display="none";
                    }
                    const el_msg2=document.querySelector(".hy_msg2");
                    if(el_msg2){
                        el_msg2.style.display="none";
                    }
                    const el_btn_upload_image=document.querySelector(".hy_btn_upload_image");
                    if(el_btn_upload_image){
                        el_btn_upload_image.setAttribute("disabled",true);
                        el_btn_upload_image.textContent=`正在搜索`;
                    }

                    Goods=await fn_getGoods(code);
                    if(Goods){
                        if(Goods.klhkcode){
                            //已上传过昆仑好客编码禁止重复上传
                            const msg_text=`E采码"${code}"<br>对应的数据已经上传过昆仑好客<br>编码为${Goods.klhkcode}`;
                            const el_msg1=document.querySelector(".hy_msg1");
                            if(el_msg1){
                                el_msg1.innerHTML=msg_text;
                                el_msg1.style.display="block";
                            }
                            if(el_btn_upload_image){
                                el_btn_upload_image.setAttribute("disabled",true);
                                el_btn_upload_image.textContent=`已上传过`;
                            }
                        }else{
                            //填入表单数据
                            Goods.imageUrl=await fn_getGoodsImages(Goods.id);
                            if(Goods.imageUrl && Goods.imageUrl.length>0){
                                if(el_btn_upload_image){
                                    el_btn_upload_image.removeAttribute("disabled");
                                    el_btn_upload_image.textContent=`上传图片(${Goods.imageUrl.length})`;
                                }
                            }
                            await fn_fillField();
                        }
                    }else{
                        const msg_text=`E采码"${code}"，没有找到商品数据`;
                        const el_msg1=document.querySelector(".hy_msg1");
                        if(el_msg1){
                            el_msg1.innerText=msg_text;
                            el_msg1.style.display="block";
                        }
                        if(el_btn_upload_image){
                            el_btn_upload_image.setAttribute("disabled",true);
                            el_btn_upload_image.textContent=`没有商品信息`;
                        }

                    }
                }
            }
            //fn_useECode();

        })();
    };

    //添加商品时自动写入表单
    const fn_fillField=()=>{
        (async()=>{

            const fn_fill=(el_formgroup)=>{
                const el_label=el_formgroup;//.querySelector("label");
                if(el_label){
                    const text=el_label.textContent;
                    let fieldConfig=undefined;
                    for(let i=0;i<FieldMap.length;i++){
                        const kv=FieldMap[i];
                        if(kv.re.test(el_label.textContent)){
                            fieldConfig=kv;
                        }
                    };
                    if(fieldConfig){
                        let value=undefined;
                        if(fieldConfig.columnName){
                            value=Goods[fieldConfig.columnName];
                        }else if(typeof(fieldConfig.value)==="function"){
                            value=fieldConfig.value();
                        }else{
                            value=fieldConfig.value;
                        }
                        const el_input=el_formgroup.querySelector("input");
                        if(el_input && value!==undefined){
                            if(el_input.type=="checkbox"){
                                el_input.checked=value;
                                el_input.dispatchEvent(new Event("change"));
                            }else{
                                el_input.value=value;
                                var ie=new Event("input",{bubbles:true});
                                var tracker=el_input._valueTracker;
                                if(tracker){
                                    tracker.setValue(value);
                                }
                                el_input.dispatchEvent(ie);
                            }
                        }else{
                            const el_select=el_formgroup.querySelector("select");
                            if(el_select && fieldConfig.value!==undefined){
                                el_select.value=fieldConfig.value;
                                el_select.dispatchEvent(new Event("change"));
                            }
                        }
                    }
                }
            };
            document.querySelectorAll(".form-group").forEach(fn_fill);
            document.querySelectorAll(".checkbox").forEach(fn_fill);
            document.querySelectorAll(".area-checkbox-div").forEach(fn_fill);
        })();
    };


    //上传图片到能源一号
    const fn_uploadImage=()=>{
        return (async()=>{
            const el_btn_upload_image=document.querySelector(".hy_btn_upload_image");
            if(el_btn_upload_image){
                el_btn_upload_image.setAttribute("disabled",true);
                el_btn_upload_image.textContent=`正在上传图片`;
            }

            const frame_editor=document.querySelector(".ke-edit-iframe");
            if(frame_editor){
                frame_editor.contentDocument.body.innerHTML="";
            }

            const image_set=document.querySelector("#l_uploadingIdkeys")
            if(image_set){
                image_set.scrollIntoViewIfNeeded();
            }

            for(let i=0;i<Goods.imageUrl.length;i++){
                const imageUrl=Goods.imageUrl[i];
                await new Promise((resolve,reject)=>{
                    (async()=>{
                        const photo_data=await fn_download_photo(imageUrl);

                        var l_indexcode=parseInt(10000000*Math.random());
                        var searchObj = new FormData();
                        var index = imageUrl.lastIndexOf(".");
                        var fileName = imageUrl.substring(0, index);
                        var ext = imageUrl.substring(index + 1, imageUrl.length);
                        searchObj.append("name",l_indexcode+ '.' + ext)
                        searchObj.append("file",photo_data)


                        GM_xmlhttpRequest({
                            url:"https://www2.energyahead.com/rest/supplier",
                            method:'POST',
                            data:searchObj,
                            onload:(event)=>{
                                let serverImageUrl=event.response;
                                if(serverImageUrl.indexOf("\"") != -1){
                                    serverImageUrl=serverImageUrl.substring(1,serverImageUrl.length-1)
                                }
                                if(i<5){
                                    const el_img_div=document.querySelector(`#imgdiv${i+1}`);
                                    if(el_img_div){
                                        const el_img=el_img_div.querySelector("img");
                                        if(el_img){
                                            el_img.setAttribute("src",serverImageUrl);
                                        }
                                        const el_input=el_img_div.querySelector("input");
                                        el_input.setAttribute("data-imgurl",serverImageUrl);
                                    }
                                }
                                if(frame_editor){
                                    frame_editor.contentDocument.body.insertAdjacentHTML("beforeend",`<p><img src="${serverImageUrl}" data-ke-src="${serverImageUrl}"></p>`);
                                }
                                resolve();

                            },
                            onerror:(event)=>{
                                reject(event);
                            }
                        });
                    })();
                });
            }
            if(el_btn_upload_image){
                el_btn_upload_image.setAttribute("disabled",true);
                el_btn_upload_image.textContent=`完成`;
            }
            const el_msg2=document.querySelector(".hy_msg2");
            if(el_msg2){
                el_msg2.style.display="block";
            }

        })();
    };

    //-------------------------------------------- 能源一号 商品列表页 ----------------------------------------------------------------------------
    // 初始化列表页面
    const fn_initListPage=()=>{
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar){
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:999;width:10em;background-color:lightblue;position:fixed;top:90px;left:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="width:100%;height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";


            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="上架助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";

            //商品同步按钮
            const el_b1=document.createElement("button");
            el_mainContainer.append(el_b1);
            el_b1.style="width:90%;margin-bottom:5px;";
            el_b1.textContent="商品同步";
            el_b1.addEventListener("click",fn_syncGoods);
            el_b1.classList.add("hy_btn_sync_goods");

        }
        //将助手工具添加到页面
        document.body.insertAdjacentElement("afterBegin",el_menubar);

    };

    const api_energyahead_routing=(data)=>{
        const url="https://www2.energyahead.com/rest/service/routing";
        Object.keys(data).forEach((k)=>{
            const v=data[k];
            if(typeof(v)==="object"){
                data[k]=JSON.stringify(v);
            }
        });

        data.token=localStorage.token;
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                url:url,
                method:'POST',
                responseType:"json",
                headers:{"Content-Type":"application/x-www-form-urlencoded"},
                data:ObjToParams(data),
                onload:(event)=>{
                    if(event.status==200){
                        const r=event.response;
                        resolve(r);
                    }else{
                        reject(event);
                    }
                },
                onerror:(event)=>{
                    console.log(event);
                }
            });//GM_xmlhttpRequest结束
        });// Promise结束
    };//函数定义结束


    // 尝试将列表页中的“商品编码”同步到管理系统
    const fn_syncGoods=()=>{
        (async ()=>{
            const el_btn_sync_goods= document.querySelector(".hy_btn_sync_goods");
            if(el_btn_sync_goods){
                el_btn_sync_goods.setAttribute("disabled",true);
            }

            const el_table_rows=document.querySelectorAll("#l_showTable_tableHtml>tbody>tr");
            try{
                const prepare_data=[];
                //遍历表格构造同步请求
                for(let i=0;i<(el_table_rows||[]).length;i++){
                    const el_tr=el_table_rows[i];
                    const el_td_klhkcode=el_tr.querySelector("td:nth-child(3)");
                    const el_td_goodsname=el_tr.querySelector("td:nth-child(4)>input");
                    const el_td_status=el_tr.querySelector("td:nth-child(7)>span");
                    const el_a_edit=el_tr.querySelector("td:nth-child(8)>a:nth-child(1)");
                    const klhkcode=el_td_klhkcode.innerText.trim();
                    const goodsname=el_td_goodsname.value;
                    const commodityid_match=(el_a_edit.getAttribute("onclick")||"").match(/(?<=_hrefsurl\()(\d+)(?=,)/);
                    let commodityid="";
                    if(commodityid_match){
                        commodityid=commodityid_match[1];
                    }
                    const auditStatus=el_td_status.innerText.trim()=="已上架"?5:0;
                    const re=/^SQHY\s*/;
                    if(re.test(goodsname)){
                        const goods_detail=await api_energyahead_routing({
                            service: "getKunLunThirdPartyCommodity",
                            ThirdPartyPreliminaryCommodityReqBO: {"commodityId":commodityid,"states":1},
                        });

                        prepare_data.push({
                            goodsname:goodsname.replace(re,""),
                            klhkcode:klhkcode,
                            klhkskuid:goods_detail && goods_detail.skuList && goods_detail.skuList[0] && goods_detail.skuList[0].itemId,
                        });
                    }
                };
                const api_result=await api("sync_goods_from_energyahead_2",{d:prepare_data});
                const sync_result_message={};
                api_result.forEach((d)=>{
                    sync_result_message[d.klhkcode]=d;
                });

                //遍历表格显示同步结果-开始
                document.querySelectorAll("#l_showTable_tableHtml>tbody div.sync_message").forEach((el_sync_message)=>{
                    el_sync_message.remove();
                });
                //计算消息条的宽度，覆盖第一到第三列
                let message_width=0;
                const el_td_start=document.querySelector("#l_showTable_tableHtml>tbody>tr:nth-child(1)>td:nth-child(1)");
                const el_td_end=document.querySelector("#l_showTable_tableHtml>tbody>tr:nth-child(1)>td:nth-child(3)");
                if(el_td_start && el_td_end){
                    message_width= el_td_end.offsetLeft+el_td_end.offsetWidth-el_td_start.clientLeft;
                }
                (el_table_rows||[]).forEach((el_tr)=>{
                    const el_td_first=el_tr.querySelector("td:nth-child(1)");
                    const el_td_klhkcode=el_tr.querySelector("td:nth-child(3)");
                    const klhkcode=el_td_klhkcode.innerText.trim();
                    const d=sync_result_message[klhkcode];
                    if(d){
                        const el_sync_message=fn_sync_massage_ui(d,el_td_first,message_width);
                    }
                });
                //遍历表格显示同步结果-结束
            }catch(e){
                console.log(e);
            }


            if(el_btn_sync_goods){
                el_btn_sync_goods.removeAttribute("disabled");
            }

        })();
    };

    const SyncErrorTypeMap={
        "Goods Not Found":"没有找到商品",
        "Same Code":"昆仑好客编码已同步过",
        "Code Exist":"昆仑好客编码已同步过，但与当前不一致",
        "Duplicated Goods":"找到多个商品，无法确定应该同步到哪一个",
        "Done":"完成同步",
    }
    const fn_sync_massage_ui=(d,el_parent,message_width)=>{
        message_width=message_width || 300;
        const height=el_parent.clientHeight;
        //信息显示跳
        const el_sync_message=document.createElement("div");
        el_parent.style.position="relative";
        el_parent.append(el_sync_message);
        let backgroundColor="darkred";
        if(d.success){
            backgroundColor="darkgreen";
        }
        el_sync_message.style=`min-width:${message_width}px;width: max-content;height:${height}px;background:${backgroundColor};position: absolute;top: 0;left: 0;opacity: 0.8;z-index:999;display:flex;flex-direction: row;justify-content: start;align-items: center;font-size:larger;padding-left:2em;padding-right:2em;`;
        el_sync_message.classList.add("sync_message")

        //关闭按钮
        const el_btn_close=document.createElement("button");
        el_sync_message.append(el_btn_close);
        el_btn_close.textContent="关闭";
        el_btn_close.style="margin-right:1em;"
        el_btn_close.addEventListener("click",(event)=>{
            event.target.closest("div").remove();
        });

        //显示同步信息
        const el_message_text=document.createElement("div.sync_message");
        el_sync_message.append(el_message_text);
        let message_text=SyncErrorTypeMap[d.errorType];
        if(!message_text) message_text="无法确定错误类型";
        el_message_text.innerText=message_text;
        el_message_text.style="color:white;margin-right:1em;"

        //如果有重复商品显示详情按钮
        if(d.errorType=="Duplicated Goods"){
            const el_btn_detail=document.createElement("button");
            el_sync_message.append(el_btn_detail);
            el_btn_detail.textContent="复制详情";
            el_btn_detail.style="margin-right:1em;color:blue;"
            let title="";
            (d.goods||[]).forEach((goods)=>{
                title+=`id:${goods.id}, E采码:${goods.ecaicodes}, 已有的昆仑好客编码:${goods.klhkcode}, 商品名称:“${goods.goodsname}”\n`;
            });
            el_btn_detail.setAttribute("title",title);
            el_btn_detail.addEventListener("click",(event)=>{
                const detail=el_btn_detail.getAttribute("title");
                copyToClipboard(detail);
                el_btn_detail.textContent="复制详情 - 已复制";
            });
        }

        return el_sync_message;
    };

    //--------------------------------------------------- 能源一号 订单详情页 ----------------------------------------------------------------------------------
    // 初始化列表页面
    const fn_initOrderDetailPage=(options)=>{
        const order_id=options.param.id;
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar){
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:999;width:10em;background-color:lightblue;position:fixed;top:90px;left:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="width:100%;height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";


            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="上架助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";

            //订单同步按钮
            const el_b1=document.createElement("button");
            el_mainContainer.append(el_b1);
            el_b1.style="width:90%;margin-bottom:5px;";
            el_b1.textContent="打开华远系统";
            el_b1.addEventListener("click",(event)=>{fn_syncOrder(order_id);});
            el_b1.classList.add("hy_btn_sync_order");
            el_b1.setAttribute("order_id",order_id);

            const el_msg1=document.createElement("div");
            el_mainContainer.append(el_msg1);
            el_msg1.style="width:100%;color:blue;display:none;margin-bottom:5px;";
            el_msg1.innerText="";
            el_msg1.classList.add("hy_msg1");

        }
        //将助手工具添加到页面
        document.body.insertAdjacentElement("afterBegin",el_menubar);

    };

    //同步订单详情
    const fn_syncOrder=(order_id)=>{
        const el_btn_sync_order=document.querySelector(".hy_btn_sync_order");
        if(!order_id){
            if(el_btn_sync_order){
                order_id=el_btn_sync_order.getAttribute("order_id");
                el_btn_sync_order.setAttribute("disabled",true);
                el_btn_sync_order.innerText="打开中...";
            }
        }
        const el_msg1=document.querySelector(".hy_msg1");
        if(el_msg1){
            el_msg1.innerText="";
            el_msg1.style.color="blue";
            el_msg1.style.display="none";
        }

        //获取当前的订单详情
        const fn_getOrderDetail=(order_id)=>{
            return api_energyahead_routing({
                service: "querySonOrderInfo",
                OrderKlSonReqBO:{"id":order_id},
            });
        };//函数定义结束

        if(order_id){
            (async (order_id)=>{
                const el_btn_sync_order=document.querySelector(".hy_btn_sync_order");
                const el_msg1=document.querySelector(".hy_msg1");
                try{
                    const order_detail=await fn_getOrderDetail(order_id);
                    if(order_detail.respCode!="0000"){
                        throw order_detail;
                    }
                    const data={
                        orderbh:order_detail.sn,//订单编号：“DS12189620_5”
                        orderfrom:4,//订单来源：固定值 4
                        orderamount:order_detail.purchaseIncludeTotalPrice/10000,//订单总金额：“5,916.67”
                        ordertime:order_detail.createTime , //订单创建时间：“ 2024-04-15 16:50:15”
                        address:order_detail.deliveryAddress , // 收货地址：甘肃兰州市西固区。。。
                        personname:order_detail.consignee , // 联系方式收货人 “魏平”
                        tell:order_detail.contact , // 联系方式 电话 “13519604851”
                        ordergoodsnum:order_detail.orderKlSonDetailRspBOList && order_detail.orderKlSonDetailRspBOList.length ||0 , // 订单中商品条数 "3"
                        customername:order_detail.regionalCorporationName , // 需求单位:"中国石油润滑油公司"
                        note:order_detail.remark, // 备注

                    };
                    let has_goods=false;
                    let totalAmount=0;
                    let goods_index=0;
                    for(let i=0;i<(order_detail.orderKlSonDetailRspBOList||[]).length;i++){
                        const son_detail=order_detail.orderKlSonDetailRspBOList[i];
                        if((son_detail.itemName||"").startsWith("SQHY")){
                            has_goods=true;
                            data[`goodsid${goods_index}`]=son_detail.sku && son_detail.sku.itemId ||""; //  第一个商品skuid "26001028991"
                            data[`goodsname${goods_index}`]=(son_detail.itemName||"").replace(/^SQHY\s*/,""); //第一个商品名称 “SQHY 星宇 乳胶磨砂防水防滑手.。。”
                            data[`goodsOrderPrice${goods_index}`]=son_detail.purchaseIncludePrice/10000; // 第一个商品订单单价 “8.55”
                            data[`goodsUnit${goods_index}`]=son_detail.measureName||""; // 第一个商品单位 “副”
                            data[`goodsNum${goods_index}`]=son_detail.num||0; // 第一个商品数量 “299”
                            totalAmount+=son_detail.purchaseIncludePrice/10000*(son_detail.num||0);
                            goods_index++;
                        }
                    }
                    data.orderamount=totalAmount;
                    data.ordergoodsnum=goods_index;
                    if(has_goods){
                        //window.open(`http://43.143.136.44/hysm/import_order.asp?${ObjToParams(data)}`,"hy-system");
                        //构造提交的表单
                        const el_form=document.createElement("form");
                        el_form.style.display="none";
                        el_form.setAttribute("target","hy-system");
                        el_form.setAttribute("action","http://43.143.136.44/hysm/import_order.asp");
                        el_form.setAttribute("method","post")
                        Object.keys(data).forEach((k)=>{
                            let v=data[k];
                            if(typeof(v)==="object"){
                                v=JSON.stringify(v);
                            }
                            const el_input=document.createElement("input");
                            el_input.setAttribute("name",k);
                            el_input.setAttribute("value",v);
                            el_form.append(el_input);
                            //ret+=`${k}=${encodeURIComponent(v)}&`;
                        });
                        document.body.append(el_form);
                        console.log(el_form);
                        el_form.submit();
                        el_form.remove();
                        //构造提交的表单-结束

                        if(el_msg1){
                            el_msg1.innerHTML="同步完成<br>如果打开页面需要登录，请登录后再次点击按钮";
                            el_msg1.style.color="blue";
                            el_msg1.style.display="block";
                        }
                    }else{
                        if(el_msg1){
                            el_msg1.innerHTML="订单中没有华远的商品";
                            el_msg1.style.color="red";
                            el_msg1.style.display="block";
                        }
                    }
                    if(el_btn_sync_order){
                        el_btn_sync_order.removeAttribute("disabled");
                        el_btn_sync_order.innerText="打开华远系统";
                    }

                }catch(e){
                    let error_message=e;
                    if(typeof(e)==="object"){
                        error_message=Error.prototype.isPrototypeOf(e)?e.message:JSON.stringify(e);
                    }
                    if(el_msg1){
                        el_msg1.innerText=error_message;
                        el_msg1.style.color="red";
                        el_msg1.style.display="block";
                    }
                    if(el_btn_sync_order){
                        el_btn_sync_order.removeAttribute("disabled");
                        el_btn_sync_order.innerText="打开华远系统";
                    }
                }
            })(order_id);
        }else{
            if(el_msg1){
                el_msg1.innerText="没有找到订单ID";
                el_msg1.style.color="red";
                el_msg1.style.display="block";
            }
            if(el_btn_sync_order){
                el_btn_sync_order.removeAttribute("disabled");
                el_btn_sync_order.innerText="打开华远系统";
            }
        }

    };


    //--------------------------------------------------- 能源一号 订单列表页 ----------------------------------------------------------------------------------
    // 初始化列表页面
    const fn_initOrderSerchPage=(options)=>{
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar){
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:999;width:10em;background-color:lightblue;position:fixed;top:90px;left:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="width:100%;height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";


            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="上架助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";

            const el_msg1=document.createElement("div");
            el_mainContainer.append(el_msg1);
            el_msg1.style="width:100%;color:blue;display:block;margin-bottom:5px;";
            el_msg1.innerText="正在检索订单列表...";
            el_msg1.classList.add("hy_msg1");

        }
        //将助手工具添加到页面
        document.body.insertAdjacentElement("afterBegin",el_menubar);

        (async()=>{
            //在订单列表项中添加按钮,如果列表还没有刷新出来则1秒后重试
            const fn_injection_order_list=async ()=>{
                const el_order_list=document.querySelectorAll(".cnpc-table-list");
                if(el_order_list.length>0){
                    for(let order_index=0;order_index<el_order_list.length;order_index++){
                        const el_order=el_order_list[order_index];
                        if(!el_order.querySelector(".hy_sync_order")){
                           const el_a=el_order.querySelector("a.orderDetail");
                            let order_id="";
                            if(el_a){
                                order_id=el_a.href.match(/(?<=\?id=)(\d+)(?=\&)/)[1];
                            }
                            if(order_id){
                                /*在遍历订单列表的时候判断订单是否有华远商品，如果有才显示导入按钮。*/
                                //取得订单详细信息
                                const order_detail=await api_energyahead_routing({
                                    service: "querySonOrderInfo",
                                    OrderKlSonReqBO:{"id":order_id},
                                });
                                if(order_detail.respCode!="0000"){
                                    throw order_detail;
                                }
                                //遍历订单商品判断是否为华远商品
                                let has_goods=false;
                                for(let i=0;i<(order_detail.orderKlSonDetailRspBOList||[]).length;i++){
                                    const son_detail=order_detail.orderKlSonDetailRspBOList[i];
                                    if((son_detail.itemName||"").startsWith("SQHY")){
                                        has_goods=true;
                                        break;
                                    }
                                }
                                const el_button_container=el_order.querySelector(".top-right-btn");
                                if(has_goods){//订单存在华远商品显示导入按钮
                                    if(el_button_container){
                                        const el_button=document.createElement("a");
                                        el_button.classList.add("right-btn","cnpc-comment","delivered","hy_sync_order");
                                        el_button.style="background-color:#add8e6;color:black;border-color: black";
                                        el_button.innerText="导入华远系统";
                                        el_button.dataset.orderid=order_id;
                                        el_button.addEventListener("click",(event)=>{
                                            const el_button=event.target;
                                            const order_id=el_button.dataset.orderid
                                            fn_syncOrder(order_id);
                                        });
                                        el_button_container.insertAdjacentElement("beforeEnd",el_button);

                                    }
                                }else{//订单不存在华远商品显示提示按钮且不能点击“样式hy_sync_order需要保留，否则在下次遍历时会重复调用订单详情接口”
                                    if(el_button_container){
                                        const el_button=document.createElement("a");
                                        el_button.classList.add("right-btn","cnpc-comment","delivered","hy_sync_order");
                                        el_button.style="background-color:lightgrey;color:black;border-color: black";
                                        el_button.innerText="订单没有华远商品";
                                        el_button.setAttribute("disabled",1);
                                        el_button.dataset.orderid=order_id;
                                        el_button_container.insertAdjacentElement("beforeEnd",el_button);

                                    }

                                }
                            }
                        }
                    };
                    const el_msg1=document.querySelector(".hy_msg1");
                    if(el_msg1){
                        el_msg1.innerHTML="订单列表准备完毕<br>点击按钮\"导入华远系统\"";
                    }
                }
                window.setTimeout(fn_injection_order_list,1000);
                
            };
            fn_injection_order_list()


        })();
    };



    //--------------------------------------------------- 石油易采 ----------------------------------------------------------------------------------
    // 初始化石油E采列表页面
    const fn_initECaiListPage=()=>{
        let el_menubar=document.querySelector(".hy_menubar");
        if(!el_menubar){
            // 插件功能区
            el_menubar=document.createElement("div");
            el_menubar.classList.add("hy_menubar");
            el_menubar.style="z-index:999;width:12em;background-color:lightblue;position:fixed;bottom:0px;left:5px;border-radius:5px;font-size:larger; box-shadow: 0px 0px 10px;";

            //主功能区
            const el_mainContainer=document.createElement("div");
            el_menubar.append(el_mainContainer);
            el_mainContainer.style="width:90%;height:100%;display:flex;flex-direction: column;justify-content:center;align-items:center;padding:5px 5px 5px 5px;";


            //主功能区标题
            const el_title=document.createElement("div");
            el_mainContainer.append(el_title);
            el_title.innerText="上架助手";
            el_title.style="width:100%;text-align: center;margin-bottom:5px;font-weight: bolder;";

            //查询按钮
            const el_b1=document.createElement("button");
            el_mainContainer.append(el_b1);
            el_b1.style="width:90%;margin-bottom:5px;";
            el_b1.textContent="同步E采商品";
            el_b1.addEventListener("click",fn_getNeedSyncECaiCodes);
            el_b1.classList.add("hy_btn_sync_ecai_goods");

            const el_msg1=document.createElement("div");
            el_mainContainer.append(el_msg1);
            el_msg1.style="width:100%;color:blue;display:none;margin-bottom:5px;";
            el_msg1.innerText="";
            el_msg1.classList.add("hy_msg1");

        }
        //将助手工具添加到页面
        document.body.insertAdjacentElement("afterBegin",el_menubar);

    };

    //开始同步E采商品
    const fn_getNeedSyncECaiCodes=()=>{
        (async()=>{
            const el_btn_sync_ecai_goods=document.querySelector(".hy_btn_sync_ecai_goods");
            if(el_btn_sync_ecai_goods){
                el_btn_sync_ecai_goods.setAttribute("disabled",true);
            }
            const el_msg1=document.querySelector(".hy_msg1");
            if(el_msg1){
                el_msg1.style.display="block";
                el_msg1.innerText="正在获取需要同步的E采编码...";
            }
            const api_result=await api("need_sync_from_ECai",{limit:9999});
            if(el_msg1){
                el_msg1.style.display="block";
                el_msg1.innerText=`共获取需要同步的E采编码(${api_result.length})条`;
            }

            let success_count=0;
            let error_count=0;

            if(el_msg1){
                el_msg1.style.display="block";
                const average=fn_timeSample();
                el_msg1.innerHTML=`共获取需要同步的E采编码(${api_result.length})条<br>开始同步`;
            }

            for(let i=0;i<api_result.length;i++){
                try{
                    let ecaicodes=api_result[i].ecaicodes;
                    //const re_result=(ecaicodes||"").match(/(\d+)/);
                    //ecaicodes=(re_result&&re_result[0])||"";
                    console.log(`获取E采数据:${ecaicodes}`);
                    const ecai_data=await fn_getECaiGoods(ecaicodes);
                    console.log(`同步E采数据:${ecaicodes}`);
                    const sync_result=await fn_syncECaiGoods(ecai_data);
                    console.log(sync_result);
                    if(sync_result.result){
                        success_count++;
                    }else{
                        error_count++;
                    }
                }catch(e){
                    error_count++;
                    console.log(e);
                }

                let sleepTime=3;

                if(i<api_result.length-1){
                    console.log(`等待${sleepTime}秒...`);
                    await sleep(sleepTime);
                }
                if(el_msg1){
                    el_msg1.style.display="block";
                    const average=fn_timeSample();
                    //console.log("average:"+average);
                    el_msg1.innerHTML=`共获取需要同步的E采编码(${api_result.length})条<br>完成${i+1}条其中错误${error_count}条<br>预计剩余时间${fn_formatSeconds((api_result.length-i-1)*average)}`;
                }
            }

            if(el_btn_sync_ecai_goods){
                el_btn_sync_ecai_goods.removeAttribute("disabled");
            }


        })();
    };

    //获取E采商品信息
    const fn_getECaiGoods=(ecaicode)=>{
        return new Promise((resolve,reject)=>{
            const url=`https://soluxemall.com/api/provider/selOneGoods?id=${ecaicode}`;
            GM_xmlhttpRequest({
                url:url,
                method:'POST',
                responseType:"json",
                headers:{"Authorization":localStorage.getItem("token")},
                onload:(event)=>{
                    if(event.status==200){
                        const r=event.response;
                        if(r.code==0){
                            try{
                                resolve({
                                    id:r.body.id,
                                    scPriceUri:r.body.scPriceUri,
                                    upc:r.body.upc,
                                    scPrice:r.body.scPrice,
                                    sellPrice:r.body.sellPrice,
                                });
                            }catch(e){
                                reject(e);
                            }
                        }else{
                            reject(r);
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
    //同步单条E采数据
    const fn_syncECaiGoods=(ecaiGoods)=>{
        return new Promise((resolve,reject)=>{
            const data=`param=${encodeURIComponent(JSON.stringify(ecaiGoods))}`;
            console.log(data);
            GM_xmlhttpRequest({
                url:`http://43.143.136.44/hysm/ajax_savegoodsinfo.asp?${data}`,
                method:'GET',
                responseType:"json",
                onload:(event)=>{
                    if(event.status==200){
                        resolve(event.response);
                    }else{
                        reject(event);
                    }
                },
                onerror:(event)=>{
                    reject(event);
                }
            });
        });
    };

    const href=document.location.href;
    const match=[
        {
            "re":/commodity_maintained_add\.html/,
            "fn":fn_initAddPage,
        },
        {
            "re":/commodity_maintenance_operation\.html/,
            "fn":fn_initListPage,
        },
        {
            "re":/purchase_order_detail_third\.html*/,
            "fn":fn_initOrderDetailPage,
        },
        {
            "re":/\/orderThird\/supplyorder_search\.html*/,
            "fn":fn_initOrderSerchPage,
        },

        {
            "re":/soluxemall\.com\/seller\/*/,
            "fn":fn_initECaiListPage,
        }
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

})();