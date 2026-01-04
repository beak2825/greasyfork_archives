// ==UserScript==
// @name         Semi-auto_fill_form
// @namespace    https://u.stcsm.sh.gov.cn/
// @version      0.0.1
// @description  Semi-auto fill form!
// @author       RuthlessHardt
// @match        *://u.stcsm.sh.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sh.gov.cn
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      Mozilla Public License 1.1 (MPL)
// @downloadURL https://update.greasyfork.org/scripts/461566/Semi-auto_fill_form.user.js
// @updateURL https://update.greasyfork.org/scripts/461566/Semi-auto_fill_form.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //div
    const div = document.createElement("div");
    div.style.width = "260px";
    div.style.height = "420px";
    div.style.background = "#ffffff";
    div.style.border = "1px solid #dddddd";
    div.style.borderRadius = "7px"; 
    div.innerHTML = "将excel数据粘贴到这里";
    div.style.position = "absolute"
    div.style.top = "32%"
    div.style.padding = "10px 10px"
    div.style.left = "2%"
    div.style.zIndex = 999999
    document.body.appendChild(div);

    //创建文本域
    let textarea = document.createElement("textarea"); //创建一个文本域
    textarea.style.width = "240px"; //文本域宽度
    textarea.style.height = "300px"; //文本域高度
    textarea.style.borderRadius = "7px"; //文本域四个角弧度
    textarea.style.padding = "7px 10px"


    //创建按钮
    let button = document.createElement("button"); //创建一个按钮
    button.textContent = "运行数据填写脚本"; //按钮内容
    //button.style.width = "90px"; //按钮宽度
    button.style.height = "28px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#1890ff"; //按钮底色
    button.style.border = "1px solid #1890ff"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.style.position = "absolute"
    button.style.bottom = "4%"
    button.style.padding = "0px 20px"
    button.style.right = "4%"
    button.style.zIndex = 1
    button.addEventListener("click", clickBotton) //监听按钮点击事件
    //放入区域节点内
    div.appendChild(textarea); //把按钮加入到 x 的子节点中
    div.appendChild(button); //把按钮加入到 x 的子节点中
    //按钮点击触发函数
    function clickBotton(){
        if(textarea.value!=null&&textarea.value.trim()!=""){
            let antDrawerTitle = document.getElementsByClassName("ant-drawer-title")[0]
            let rcDialogTitle = document.getElementsByClassName("ant-modal-title")[0];
            // console.log(antDrawerTitle.innerHTML);
            if(antDrawerTitle!=null&&antDrawerTitle.innerHTML.includes("项目发展目标")){
                fillProjForm(textarea.value)  
            }else if(antDrawerTitle!=null&&antDrawerTitle.innerHTML.includes("企业发展目标")){
                fillCompForm(textarea.value) 
            }
            else if(antDrawerTitle!=null && rcDialogTitle!=null && antDrawerTitle.innerHTML.includes("企业基本信息和概况-企业历史财务数据") &&rcDialogTitle.innerHTML.includes("填写相关信息")){
                fillHistoryFinancialData(textarea.value)
                alert("填写完成！年份和有无数据需要自己填写！")
            }
            else if(antDrawerTitle==null || rcDialogTitle==null){
                alert("请正确选择填报项目！！！")
            }
        }else{
            alert("请粘贴excel数据到规定区域！！！")
        }

        //项目发展目标
        // let item1 = document.evaluate('//*[@id="app"]/div/div/div[2]/div/div[2]/div/div[1]/article/div/div[1]/div/div/div/div[2]/div/ul/li[2]/div[1]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        // item1.singleNodeValue.click();
        //执行填入
        // fillProjForm(textarea.value)  


        //提交
        // $(".ant-btn.ant-btn-primary").trigger("click")
        // let clickEvent = new Event('click');
        // submitBtn.dispatchEvent(clickEvent);





        //企业发展目标
        // let item2 = document.evaluate('//*[@id="app"]/div/div/div[2]/div/div[2]/div/div[1]/article/div/div[1]/div/div/div/div[2]/div/ul/li[3]/div[1]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        // item2.singleNodeValue.click();
        // //执行填入
        // fillCompForm(textarea.value)  
        // //提交
        // submitBtn.dispatchEvent(clickEvent);


    }
    //项目发展目标
    function fillProjForm(data){
        let projValuesStr = data;
 
        let projXpathArr = [
            '//*[@id="bc84f7810b68430aa70c9442d0768dc2"]',
            '//*[@id="d815e163a984468fa4c8e4674e5cfe7a"]',
            
            '//*[@id="6f6c9ee3a9a4455c97543844776499b3"]/div[2]/input',
            '//*[@id="142b0ff54e4746a18ec3f000205c837b"]/div[2]/input',
            '//*[@id="7e9502f6d32c4e24926ae179e39a7cdf"]/div[2]/input',
            '//*[@id="ced052ca1bde4b38b00e93754656f901"]/div[2]/input',

            '//*[@id="972edbe19f134924b6b07b7420c37ef0"]/div[2]/input',
            '//*[@id="5560c6533b67430cb9af59ec70007147"]/div[2]/input',
            '//*[@id="ac746b309a034779a83eb5c19e01beb7"]/div[2]/input',
            '//*[@id="b7f2189601714e4f9db16eed3a79ac04"]/div[2]/input'
        ]

        // let projXpathArr = [
        //     '/html/body/div[4]/div/div[2]/div/div/div[2]/div/article/div/div/form/article/div/div[2]/div/div[2]/div/span/textarea',
        //     '/html/body/div[4]/div/div[2]/div/div/div[2]/div/article/div/div/form/article/div/div[3]/div/div[2]/div/span/textarea',
            
        //     '/html/body/div[4]/div/div[2]/div/div/div[2]/div/article/div/div/form/article/div/div[6]/div/div[2]/div/span/div/div/div[2]/input',
        //     '/html/body/div[4]/div/div[2]/div/div/div[2]/div/article/div/div/form/article/div/div[7]/div/div[2]/div/span/div/div/div[2]/input',
        //     '/html/body/div[4]/div/div[2]/div/div/div[2]/div/article/div/div/form/article/div/div[8]/div/div[2]/div/span/div/div/div[2]/input',
        //     '/html/body/div[4]/div/div[2]/div/div/div[2]/div/article/div/div/form/article/div/div[9]/div/div[2]/div/span/div/div/div[2]/input',

        //     '/html/body/div[4]/div/div[2]/div/div/div[2]/div/article/div/div/form/article/div/div[12]/div/div[2]/div/span/div/div/div[2]/input',
        //     '/html/body/div[4]/div/div[2]/div/div/div[2]/div/article/div/div/form/article/div/div[13]/div/div[2]/div/span/div/div/div[2]/input',
        //     '/html/body/div[4]/div/div[2]/div/div/div[2]/div/article/div/div/form/article/div/div[14]/div/div[2]/div/span/div/div/div[2]/input',
        //     '/html/body/div[4]/div/div[2]/div/div/div[2]/div/article/div/div/form/article/div/div[15]/div/div[2]/div/span/div/div/div[2]/input'
        // ]

        //根据上年的数据计算出未来三年预期数据（默认预估涨 10 %）
        let riseRate = 10
        //第一年
        let firstYearDataArr = []
        //第二年
        let secondYearDataArr = []

        let dataArr = projValuesStr.split('\r')[0].split('\n')
        //过滤null等空值
        let dataArrNew = dataArr.filter(elm => elm);

        dataArrNew.forEach(e =>{
            firstYearDataArr.push(e*(100+riseRate)/100)
            secondYearDataArr.push(e*((100+riseRate)**2)/(100**2))
        })

        //对应填充的值
        let projValues = []

        //固定 技术指标
        projValues.push("扩大业务规模，扩大企业员工数，研发投入同比提高10%，利润同比提高10%")
        projValues.push("研发投入同比提高10%，利润同比提高10%")
        //第一年
        projValues.push(firstYearDataArr[0])
        projValues.push(firstYearDataArr[14])
        projValues.push(firstYearDataArr[2])
        projValues.push(firstYearDataArr[16])

        //第二年
        projValues.push(secondYearDataArr[0])
        projValues.push(secondYearDataArr[14])
        projValues.push(secondYearDataArr[2])
        projValues.push(secondYearDataArr[16])
        //循环填充对应的值
        for (let i = 0; i < projXpathArr.length; i++) {
            //获取焦点
            let result = document.evaluate(projXpathArr[i], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) {
                //模拟点击
                result.singleNodeValue.click();
                //模拟键盘填数据
                var evt = new InputEvent('input', {
                    inputType: 'insertText',
                    data: projValues[i],
                    dataTransfer: null,
                    isComposing: false
                });
                result.singleNodeValue.value = projValues[i]
                result.singleNodeValue.dispatchEvent(evt)
            }
        }
    }
    
    //企业发展目标
    function fillCompForm(data){
        let compValuesStr = data;
        //未来三年发展目标，共计24条数据项
        let compXpathArr = [
            '//*[@id="17c7045d6b6a4ec4a2b6f1143fbdb536"]/div[2]/input',
            '//*[@id="03af4a0f633843f781721d0336c16171"]/div[2]/input',
            '//*[@id="45e797d64ea9464db0e50345369ff84f"]/div[2]/input',
            '//*[@id="78d762b734df40c5ab4909e609593c0b"]/div[2]/input',
            '//*[@id="8779c313d2944892bdc3e24b3fa0d977"]/div[2]/input',
            '//*[@id="90ed77561bea453789bcc3ec2feb8ea8"]/div[2]/input',
            '//*[@id="7cbfe77123724a26b2e9b79f0627a6ba"]/div[2]/input',
            '//*[@id="36f5f8d17dd945da83fcce4850c41c20"]/div[2]/input',

            '//*[@id="1397556eb4cc497f8da00df8a74560de"]/div[2]/input',
            '//*[@id="9fca43a57c084bdf87aaee3b0accd2e1"]/div[2]/input',
            '//*[@id="e9381cc43dad4f8d812c9eb390cd4459"]/div[2]/input',
            '//*[@id="c785afe1db274124ab2660df5607f6a6"]/div[2]/input',
            '//*[@id="7c6f2a42b0754286b1367bd14605f8e5"]/div[2]/input',
            '//*[@id="82a462d577654a628259454bc8ad706d"]/div[2]/input',
            '//*[@id="68450a2ad2ab4e089d61a4cfb0d3d842"]/div[2]/input',
            '//*[@id="9205bc2365b442949157fde35ebaec4c"]/div[2]/input',

            '//*[@id="f3d1e87c4032476ea7f2afd956ddc430"]/div[2]/input',
            '//*[@id="3a883319acf540fda9ffab8bb5e9f21c"]/div[2]/input',
            '//*[@id="62de7ae6d82f4e5b915520aef194e13b"]/div[2]/input',
            '//*[@id="2e63eda42c9f4a469121fd7b55731775"]/div[2]/input',
            '//*[@id="3da7bc865de2421f956cb289158b8e79"]/div[2]/input',
            '//*[@id="bbdd8164e08b4bd398c8cd36269f7f8f"]/div[2]/input',
            '//*[@id="985a93314fc74915b07154caf7c309b5"]/div[2]/input',
            '//*[@id="27f3a0bfbc334d53834a6f34c17a15ac"]/div[2]/input',
        ]

        //根据上年的数据计算出未来三年预期数据（默认预估涨 10 %）
        let riseRate = 10
        //第一年
        let firstYearDataArr = []
        //第二年
        let secondYearDataArr = []
        //第三年
        let thirdYearDataArr = []

        let dataArr = compValuesStr.split('\r')[0].split('\n')
        //过滤null等空值
        let dataArrNew = dataArr.filter(elm => elm);

        dataArrNew.forEach(e =>{
            firstYearDataArr.push(e*(100+riseRate)/100)
            secondYearDataArr.push(e*((100+riseRate)**2)/(100**2))
            thirdYearDataArr.push(e*((100+riseRate)**3)/(100**3))
        })
        // firstYearDataArr.forEach(e => {
        //     console.log(e)
        // });


        //对应填充的值
        let compValues = []
        compValues.push(firstYearDataArr[0])
        compValues.push(firstYearDataArr[1])
        compValues.push(firstYearDataArr[2])
        compValues.push(firstYearDataArr[3])
        compValues.push(firstYearDataArr[4])
        compValues.push(firstYearDataArr[14])
        compValues.push(firstYearDataArr[8])
        compValues.push(60)
        compValues.push(secondYearDataArr[0])
        compValues.push(secondYearDataArr[1])
        compValues.push(secondYearDataArr[2])
        compValues.push(secondYearDataArr[3])
        compValues.push(secondYearDataArr[4])
        compValues.push(secondYearDataArr[14])
        compValues.push(secondYearDataArr[8])
        compValues.push(90)
        compValues.push(thirdYearDataArr[0])
        compValues.push(thirdYearDataArr[1])
        compValues.push(thirdYearDataArr[2])
        compValues.push(thirdYearDataArr[3])
        compValues.push(thirdYearDataArr[4])
        compValues.push(thirdYearDataArr[14])
        compValues.push(thirdYearDataArr[8])
        compValues.push(100)

        //循环填充对应的值
        for (let i = 0; i < compXpathArr.length; i++) {
            //获取焦点
            let result = document.evaluate(compXpathArr[i], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) {
                //模拟点击
                result.singleNodeValue.click();
                //模拟键盘填数据
                var evt = new InputEvent('input', {
                    inputType: 'insertText',
                    data: compValues[i],
                    dataTransfer: null,
                    isComposing: false
                });
                result.singleNodeValue.value = compValues[i]
                result.singleNodeValue.dispatchEvent(evt)
            }
        }
    }
   
    //企业历史财务数据
    function fillHistoryFinancialData(data){
        let historyValuesStr = data;
        //25项
        let historyXpathArr = [
            '//*[@id="e08c700edc914003b8a8c05fd2bff5c7"]/div[2]/input',
            '//*[@id="c80d2d80eb2c4870a443354f03ae5bfd"]/div[2]/input',
            '//*[@id="d72e4e84d335492db9882a90e34eafa5"]/div[2]/input',
            '//*[@id="65c6f05217d14b46a07f662083d0912c"]/div[2]/input',
            '//*[@id="fb1eba672e7d4aba82c038dde70f6dc7"]/div[2]/input',
            '//*[@id="782e84ffe3ca45eb9163da653267dd4f"]/div[2]/input',
            '//*[@id="8fed3c53852a4ba987ef48550084fee8"]/div[2]/input',
            '//*[@id="350618d57425404691e01962104342e2"]/div[2]/input',
            '//*[@id="6cfe928ecc654039931a466969499a3e"]/div[2]/input',
            '//*[@id="ac1da98dad8c4d89afa1e32e47ea5d84"]/div[2]/input',

            '//*[@id="dae3a30b59ec4982abec35b0664f7fb2"]/div[2]/input',
            '//*[@id="7097a2286db24d77abd6ee5871214e79"]/div[2]/input',
            '//*[@id="b73645a863624bf89a5971764d32a033"]/div[2]/input',
            '//*[@id="dd012b3c84be488194cd541897952a56"]/div[2]/input',
            '//*[@id="8ffbd0b8c3214318b08a4fafbcb31c59"]/div[2]/input',


            '//*[@id="dacfbcb2a9a948a980a44792e1890e59"]/div[2]/input',
            '//*[@id="eb95cd903863424a88ea9317ab4e9fd9"]/div[2]/input',
            '//*[@id="c02e64c027ee4747b2c0edb5c9ee82ec"]/div[2]/input',
            '//*[@id="a1a87cfbb9274b4181b8cb06ba3eb4d6"]/div[2]/input',
            '//*[@id="f9a4fd5323d9414da0b3bbb8fd52ef12"]/div[2]/input',
            '//*[@id="0dcabf3a18024adabe72f7376ee88fe0"]/div[2]/input',


            '//*[@id="cde6ecd4e9554012a85bc4b05b391317"]/div[2]/input',
            '//*[@id="4e9cb7f2fe65473f8046158ba13fb414"]/div[2]/input',


            '//*[@id="e785be8af13c4d1c89411c602bde0983"]/div[2]/input',
            '//*[@id="b613177b030342b5a61f9a0aabe5b7e5"]/div[2]/input',
        ]

        let dataArr = historyValuesStr.split('\r')[0].split('\n')
        //过滤null等空值
        let dataArrNew = dataArr.filter(elm => elm);

        // firstYearDataArr.forEach(e => {
        //     console.log(e)
        // });


        //对应填充的值
        let historyValues = []
        historyValues.push(dataArrNew[1])
        historyValues.push(dataArrNew[2])
        historyValues.push(dataArrNew[0])
        historyValues.push(dataArrNew[4])

        historyValues.push(dataArrNew[5])
        historyValues.push(dataArrNew[8])
        historyValues.push(dataArrNew[7])
        historyValues.push(dataArrNew[6])
        historyValues.push(dataArrNew[9])
        historyValues.push(dataArrNew[10])
        historyValues.push(dataArrNew[11])

        historyValues.push(dataArrNew[12])
        historyValues.push(dataArrNew[13])
        historyValues.push(dataArrNew[13]-dataArrNew[14])
        historyValues.push(dataArrNew[16])
        historyValues.push(dataArrNew[17])
        historyValues.push(dataArrNew[18])
        historyValues.push(dataArrNew[19])
        historyValues.push(dataArrNew[20])
        historyValues.push(dataArrNew[21])
        historyValues.push(dataArrNew[23])
        historyValues.push(dataArrNew[24])
        historyValues.push(dataArrNew[25])
        historyValues.push(dataArrNew[26])
        historyValues.push(dataArrNew[27])

        //循环填充对应的值
        for (let i = 0; i < historyXpathArr.length; i++) {
            //获取焦点
            let result = document.evaluate(historyXpathArr[i], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) {
                //模拟点击
                result.singleNodeValue.click();
                //模拟键盘填数据
                var evt = new InputEvent('input', {
                    inputType: 'insertText',
                    data: historyValues[i],
                    dataTransfer: null,
                    isComposing: false
                });
                result.singleNodeValue.value = historyValues[i]
                result.singleNodeValue.dispatchEvent(evt)
            }
        }
    }
})();