// ==UserScript==
// @name         ERP增强-快捷生成商品数据
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  1688页面增加快捷生成蓝阵ERP商品导入表格的功能，个人使用，非公开。
// @author       Haiiro
// @license      Private Use Only
// @match        https://detail.1688.com/offer/*.html*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1688.com


// @downloadURL https://update.greasyfork.org/scripts/499596/ERP%E5%A2%9E%E5%BC%BA-%E5%BF%AB%E6%8D%B7%E7%94%9F%E6%88%90%E5%95%86%E5%93%81%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/499596/ERP%E5%A2%9E%E5%BC%BA-%E5%BF%AB%E6%8D%B7%E7%94%9F%E6%88%90%E5%95%86%E5%93%81%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    // 规格匹配，复杂规则写前面，比如浅灰色LGR写在灰色GR前面，会准确些。
    const codeMap={'黑':'BK',
                   '米白':'OWT',
                   '米色':'BG',
                   '粉色':'PK',
                   '粉红':'PK',
                   '粉':'PK',
                   '白':'WT',
                   '浅灰':'LGR',
                   '深灰':'DGR',
                   '灰':'GR',
                   '深绿':'DGN',
                   '浅绿':'LGN',
                   '绿':'GN',
                   '浅蓝':'LBL',
                   '深蓝':'DBL',
                   '蓝':'BL',
                   '黄':'YW',
                   '卡其':'KH',
                   '浅棕':'LBN',
                   '深棕':'DBN',
                   '棕':'BN',
                   '藏青':'NV',
                   'XS':'XS',
                   'S':'S',
                   'M':'M',
                   'XXXXXL':'5XL',
                   'XXXXL':'4XL',
                   'XXXL':'3XL',
                   'XXL':'2XL',
                   '2XL':'2XL',
                   '3XL':'3XL',
                   '4XL':'4XL',
                   '5XL':'5XL',
                   'XL':'XL',
                   'L':'L',
                   '34':'34',
                   '35':'35',
                   '36':'36',
                   '37':'37',
                   '38':'38',
                   '39':'39',
                   '40':'40',
                   '41':'41',
                   '42':'42',
                   '43':'43',
                   '44':'44',
                   '45':'45',

                  }



    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                obs.disconnect();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    waitForElement('.title-content', function(element) {
        let isShow=0
        const saveedSubNubMap=new Map()
        // 规格项数量,如颜色、尺码，就是2个规格项
        const specNum= $(".pc-sku-wrapper>div").size()-1

        $(".title-content").after("<button id='show-elements' style='margin-top:5px;' >制作ERP货品信息</button>")

        $("#show-elements").on("click",showElements)

        function showElements(){
            if( isShow==1){
                return
            }
            isShow=1

            $(".no-affix-wrapper").before(`<div style="margin-left: 16px;margin-bottom: 5px;">
									  <span style='margin-right: 5px;'>主sku</span><input  class='main-sku' type='text' value='' style='margin-right: 8px;'/>
									  <span style='margin-right: 5px;'>品名</span><input class='sku-name' type='text' value='' style='margin-right: 8px;'/>
									  </div>
									  <div style="margin-left: 16px;">
									  <span style='margin-right: 5px;'>货品归属</span><select class='sku-belong'  style='margin-right: 8px;'>
									  <option value=""> </option>
									  <option value="IRIS">IRIS</option>
									  <option value="More Cherie">More Cherie</option>
									  <option value="Anytime">Anytime</option>
									  <option value="RireKiitos">RireKiitos</option>
									  <option value="sopoten">sopoten</option>
									  <option value="Q10">Q10</option>
									  </select>
									  <span style='margin-right: 5px;'>发货方式</span><select class='sku-delivery'  style='margin-right: 8px;'>
									  <option value=""> </option>
									  <option value="HM25">HM25</option>
									  <option value="HM30">HM30</option>
									  <option value="SAGAWA">SAGAWA</option>
									  </select> </div>`)
            $(".sku-delivery").after("<label  style='margin-left: 130px;margin-right: 5px;'><input type='checkbox' id='toggleSwitch'> 辅助填写</label><button id='def-spec-btn' >全部填写</button><button id='create-btn'>生成ERP导入表</button>")
            //$(".sku-delivery").after(specNum>1?"<button id='swap-btn'  style='margin-left: 200px;margin-right: 5px;'>上下规格切换</button><button id='create-btn'>生成企耳导入表</button>":"<button id='create-btn' style='margin-left: 250px;'>生成企耳导入表</button>")



            $(".prop-item-wrapper>.prop-item>.prop-item-inner-wrapper").after("<span >编号</span><input class='sku-sub-num'  type='text' data-init='0' value=''/>")
            //$(".sku-module-horizon-list").before("<button id='merge-btn' style='margin-left: 90%;margin-right: 5px;'>合并规格</button><span id='merge-text' style='margin-left: 80%;margin-right: 5px;display: none;'>切换一个规格来合并</span>")
            $(".count-widget-wrapper>.sku-item-wrapper>.sku-item-left>.sku-item-name").after("<span style='display:flex;align-items:center;margin-right: 5px;'>编号</span><input class='sku-sub-num' type='text' value='' data-init='0' style='margin:5px 0;height:29px;margin-right: 8px;'/>")
            //	if(specNum>1){
            //		$("#swap-btn").on("click",swapSpec)
            //	}

            $("#create-btn").on("click",createXlsx)
            $(".prop-item").on("click",reafter)

            //$("#merge-btn").on("click",t)
            $(".sku-sub-num").on("change",saveSubNum)



            $("#toggleSwitch").on("click", function () {

                // 获取开关的状态
                let isChecked = $("#toggleSwitch").is(":checked");

                if(isChecked){
                    $(".sku-sub-num").on("focus",defSpec)
                }else{
                    $(".sku-sub-num").off("focus",defSpec)
                }
            });


            $("#def-spec-btn").on("click",defSpecAll)

        }

        function t(){
            console.info("123")
            $("#merge-btn").hide();
            $("#merge-text").show();
            merge();
        }

        // 在选择更改后，重新插入编号输入框
        function merge(){
            const old_html= $("#sku-count-widget-wrapper").html()

            const target = document.getElementById("sku-count-widget-wrapper");

            // 配置监听选项
            // const config = { childList: true, subtree: true, characterData: true };
            const config = { childList: true, subtree: false, characterData: false };

            // 创建观察者
            let observer = new MutationObserver((mutationsList) => {
                observer.disconnect();
                //$("#sku-count-widget-wrapper").append(old_html)
                const new_html= $("#sku-count-widget-wrapper").children().last().html()
                $("#sku-count-widget-wrapper").children().last().after(old_html)
                //console.info($("#sku-count-widget-wrapper").html())

                $("#merge-btn").show();
                $("#merge-text").hide();

            });
            // 开始观察
            observer.observe(target, config);



        }


        // 在选择更改后，重新插入编号输入框
        function saveSubNum(){

            // 获取当前元素的父元素
            const parentElement = $(this).parent();

            // 查找父元素中的 .sku-item-name 元素
            const skuItemName = parentElement.find(".sku-item-name");

            // 获取 .sku-item-name 下的第一个子元素的 HTML 内容
            const childHtml = skuItemName.html().trim();
            saveedSubNubMap.set(childHtml, $(this).val())

        }
        // 在选择更改后，重新插入编号输入框
        function reafter(){
            const target = document.getElementById("sku-count-widget-wrapper");

            // 配置监听选项
            const config = { childList: true, subtree: true, characterData: true };

            // 创建观察者
            let observer = new MutationObserver((mutationsList) => {
                observer.disconnect();

                if ($(".count-widget-wrapper>.sku-item-wrapper>.sku-item-left>.sku-item-name").find(".sku-sub-num").length === 0) {

                    $(".count-widget-wrapper>.sku-item-wrapper>.sku-item-left>.sku-item-name").after("<span style='display:flex;align-items:center;margin-right: 5px;'>编号</span><input class='sku-sub-num' type='text' value='' data-init='0' style='margin:5px 0;height:29px;margin-right: 8px;'/>")
                }
                for ( let el of Array.from($(".count-widget-wrapper>.sku-item-wrapper>.sku-item-left>.sku-item-name"))){
                    const name=  $(el).html().trim()
                    if (saveedSubNubMap.has(name) ){
                        $(el).parent().find(".sku-sub-num").val(saveedSubNubMap.get(name))
                    }
                }
                $(".sku-sub-num").on("change",saveSubNum)
            });
            // 开始观察
            observer.observe(target, config);



        }
        function defSpecAll(){
            $(".sku-sub-num").each(function() {
                // 使用 call 将 this 传递给 defSpec，确保 this 是当前遍历的元素
                defSpec.call(this);
            });
            $(".sku-wrapper-expend-button").click()
        }
        function defSpec(element=null){
            element=element||this
            let el=null
            if(!element.data){
                el=$(this)
            }else{
                el=$(element)
            }
            // element = element || this;

            const isInit=el.data('init')
            if(isInit==1){
                return
            }
            el.data('init',1)
            const parent=el.parent()

            if (parent.hasClass('prop-item')){
                let s=parent.find(".prop-name").html().trim()
                s=checkDefSpec(s)
                el.val(s)

            }else{
                let s=parent.find(".sku-item-name").html().trim()
                s=checkDefSpec(s)
                el.val(s)
                // 获取当前元素的父元素
                const parentElement = $(el).parent();

                // 查找父元素中的 .sku-item-name 元素
                const skuItemName = parentElement.find(".sku-item-name");

                // 获取 .sku-item-name 下的第一个子元素的 HTML 内容
                const childHtml = skuItemName.html().trim();
                saveedSubNubMap.set(childHtml, $(this).val())
            }

        }
        function checkDefSpec(s){
            for (let key in codeMap) {
                if (s.toUpperCase().includes(key.toUpperCase())){
                    return codeMap[key]
                }

            }
            return "";
        }

        function createXlsx(){


            // 子规格编号标识，0标识没填写过
            //let isEmpty=0
            // 主sku
            const mainSku=$(".main-sku").val().trim()
            if(mainSku==null||mainSku==''){
                alert("主sku没有填写")
                return;
            }
            // 品名
            const skuName=$(".sku-name").val().trim()
            if(skuName==null||skuName==''){
                alert("品名没有填写")
                return;
            }
            // 货品归属
            const belong=$(".sku-belong").val().trim()
            if(belong==null||belong==''){
                alert("货品归属没有填写")
                return;
            }
            // 物流方式
            const delivery=$(".sku-delivery").val().trim()
            if(delivery==null||delivery==''){
                alert("发货方式没有填写")
                return;
            }
            // 店铺名
            const shopName = $("#hd_0 span[title]").html()

            // 商品网址
            let itemUrl = window.top.location.href
            // 正则表达式匹配 jpg 图片地址
            const regex = /(https?:\/\/.*?\.html)/g;

            // 使用 match 方法提取所有匹配到的 jpg 图片地址
            const match  = itemUrl.match(regex);

            // 输出匹配到的结果
            if (match) {
                itemUrl=match[0]
            }

            // 表格数据
            let data=null
            if(specNum==1){

                // 子sku编码列表
                const subNumList = $(".count-widget-wrapper>.sku-item-wrapper>.sku-item-left>.sku-sub-num")
                if(	isDuplicate(subNumList)){
                    alert("子编码有重复")
                    return
                }
                // 规格名元素列表
                const specNameList= $(".count-widget-wrapper>.sku-item-wrapper>.sku-item-left>.sku-item-name")
                // 规格图片列表
                //const imgList= $(".count-widget-wrapper>.sku-item-wrapper>.sku-item-image")



                //data = [["主SKU","品名","系列码","货品分类","多规格","子编码","颜色","尺码","图片地址","规格补充","设为独立编码","品牌ID","参考进价","参考售价","货品归属","货品备注","重量(KG)","长(CM)","宽(CM)","高(CM)","供应商名称","供应商货号","参考进价","采购链接","语言名称1","报关品名1","报关材质1","语言名称2","报关品名2","报关材质2","报关单位","报关单价",""]]
                data = [["主SKU","规格类型","品名","系列码","主图","货品分类","品牌","开发人员","货品单位","货品备注","规格图片","子编码","条码","设为独立编码","颜色","尺码","规格补充","参考进价","参考售价","长宽高","长","宽","高","重量","规格备注","供应商家","供应商别名","供应商价格","商家品牌","商家货号","商家型号","采购链接"]]

                for(let i = 0; i < subNumList.length; i++){
                    let subNum= $(subNumList[i]).val()
                    if (subNum!="" && subNum!=null){
                        //isEmpty=1

                        const imgEl=$(subNumList[i]).parent().parent().find(".sku-item-image")

                        //const imgStyleText = $(imgList[i]).attr('style')
                        let imgUrl=""

                        if(imgEl.length>0){
                            const imgStyleText = imgEl.attr('style')

                            // 正则表达式匹配 jpg 图片地址
                            const regex = /(https?:\/\/.*?\.jpg)/g;

                            // 使用 match 方法提取所有匹配到的 jpg 图片地址
                            const match  = imgStyleText.match(regex);

                            // 输出匹配到的结果
                            if (match) {
                                imgUrl=match[0]
                            }

                        }


                        //data.push([mainSku,skuName,mainSku,"","1",mainSku+"-"+subNum.toUpperCase(),$(specNameList[i]).html().trim(),"",imgUrl,"","1","","","",belong,delivery,"","","","",shopName,"","0",itemUrl,"中文",skuName,"","英文","-"]);
                        data.push([mainSku,"多规格",skuName,mainSku,imgUrl,"","",belong,"",delivery,imgUrl,mainSku+"-"+subNum.toUpperCase(),"","是",$(specNameList[i]).html().trim(),"","","","","","","","","","",shopName,"","","","","",itemUrl]);


                    }
                }

            }else{


                // 子sku编码列表
                const subNumList = $(".prop-item-wrapper>.prop-item>.sku-sub-num")
                if(	isDuplicate(subNumList)){
                    alert("子编码有重复")
                    return
                }
                // 规格名元素列表
                const specNameList= $(".prop-item-wrapper>.prop-item>.prop-item-inner-wrapper>.prop-name")

                // 子sku编码列表2
                const subNumList2 = $(".count-widget-wrapper>.sku-item-wrapper>.sku-item-left>.sku-sub-num")
                if(	isDuplicate( subNumList2)){
                    alert("子编码有重复")
                    return
                }


                let allEmpty = true;  // 初始化为 true，表示所有元素的值都是空的

                subNumList2.each(function() {
                    // 获取当前元素的值，并去除前后空格
                    const value = $(this).val().trim();

                    // 如果有一个元素的值不为空，设置 allEmpty 为 false
                    if (value !== "") {
                        allEmpty = false;
                        return false;  // 一旦发现非空值就可以跳出循环
                    }
                });


                // 规格名元素列表2
                const specNameList2 = $(".count-widget-wrapper>.sku-item-wrapper>.sku-item-left>.sku-item-name")

                //data = [["主SKU","品名","系列码","货品分类","多规格","子编码","颜色","尺码","图片地址","规格补充","设为独立编码","品牌ID","参考进价","参考售价","货品归属","货品备注","重量(KG)","长(CM)","宽(CM)","高(CM)","供应商名称","供应商货号","参考进价","采购链接","语言名称1","报关品名1","报关材质1","语言名称2","报关品名2","报关材质2","报关单位","报关单价",""]]
                data = [["主SKU","规格类型","品名","系列码","主图","货品分类","品牌","开发人员","货品单位","货品备注","规格图片","子编码","条码","设为独立编码","颜色","尺码","规格补充","参考进价","参考售价","长宽高","长","宽","高","重量","规格备注","供应商家","供应商别名","供应商价格","商家品牌","商家货号","商家型号","采购链接"]]

                for(let i = 0; i < subNumList.length; i++){
                    let subNum= $(subNumList[i]).val()
                    if (subNum!="" && subNum!=null){
                        if(allEmpty){
                            const imgEl=$(subNumList[i]).parent().find(".prop-item-inner-wrapper").find(".prop-img")

                            //const imgStyleText = $(imgList[i]).attr('style')
                            let imgUrl=""

                            if(imgEl.length>0){
                                const imgStyleText = imgEl.attr('style')

                                // 正则表达式匹配 jpg 图片地址
                                const regex = /(https?:\/\/.*?\.jpg)/g;

                                // 使用 match 方法提取所有匹配到的 jpg 图片地址
                                const match  = imgStyleText.match(regex);

                                // 输出匹配到的结果
                                if (match) {
                                    imgUrl=match[0]
                                }

                            }

                            //data.push([mainSku,skuName,mainSku,"","1",mainSku+"-"+subNum.toUpperCase(),$(specNameList[i]).html().trim(),"",imgUrl,"","1","","","",belong,delivery,"","","","",shopName,"","0",itemUrl,"中文",skuName,"","英文","-"]);
                            data.push([mainSku,"多规格",skuName,mainSku,imgUrl,"","",belong,"",delivery,imgUrl,mainSku+"-"+subNum.toUpperCase(),"","是",$(specNameList[i]).html().trim(),"","","","","","","","","","",shopName,"","","","","",itemUrl]);


                        }
                        else{
                            for(let j = 0; j < subNumList2.length; j++){
                                let subNum2= $(subNumList2[j]).val()
                                if (subNum2!="" && subNum2!=null){
                                    const imgEl=$(subNumList[i]).parent().find(".prop-item-inner-wrapper").find(".prop-img")

                                    //const imgStyleText = $(imgList[i]).attr('style')
                                    let imgUrl=""

                                    if(imgEl.length>0){
                                        const imgStyleText = imgEl.attr('style')

                                        // 正则表达式匹配 jpg 图片地址
                                        const regex = /(https?:\/\/.*?\.jpg)/g;

                                        // 使用 match 方法提取所有匹配到的 jpg 图片地址
                                        const match  = imgStyleText.match(regex);

                                        // 输出匹配到的结果
                                        if (match) {
                                            imgUrl=match[0]
                                        }

                                    }
                                    //data.push([mainSku,skuName,mainSku,"","1",mainSku+"-"+subNum.toUpperCase()+"-"+subNum2.toUpperCase(),$(specNameList[i]).html().trim(),$(specNameList2[j]).html().trim(),imgUrl,"","1","","","",belong,delivery,"","","","",shopName,"","0",itemUrl,"中文",skuName,"","英文","-"]);
                                    data.push([mainSku,"多规格",skuName,mainSku,imgUrl,"","",belong,"",delivery,imgUrl,mainSku+"-"+subNum.toUpperCase()+"-"+subNum2.toUpperCase(),"","是",$(specNameList[i]).html().trim(),$(specNameList2[j]).html().trim(),"","","","","","","","","",shopName,"","","","","",itemUrl]);

                                }
                            }
                        }
                    }
                }

            }

            if(data){
                // 创建一个新的工作簿
                var wb = XLSX.utils.book_new();

                // 将数据转换为工作表
                var ws = XLSX.utils.aoa_to_sheet(data);

                // 将工作表添加到工作簿中
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

                // 生成并下载 XLSX 文件
                XLSX.writeFile(wb, "商品数据.xlsx");}
        }
        // 确认 input 元素重复值
        function isDuplicate(els){
            // 所有元素的值并去除空白
            var values = els.map(function() {
                return $(this).val().trim();
            }).get();

            // 去除空白值
            values = values.filter(function(value) {
                return value !== "";
            });

            // 使用 Set 检查重复
            let set = new Set();
            for (let value of values) {
                set.add(value);
            }

            // 如果 Set 的大小不等于数组的长度，说明有重复
            return set.size !== values.length;
        }

        function swapSpec(){
            let a=$($(".pc-sku-wrapper>div")[0])
            let b=$($(".pc-sku-wrapper>div")[1])
            // 交换元素位置
            var temp = $('<div>'); // 临时占位元素
            a.before(temp);
            b.before(a);
            temp.replaceWith(b);
        }

    });





})();
