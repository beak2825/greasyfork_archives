// ==UserScript==

// @name        单证文档导出插件

// @namespace   Violentmonkey Scripts

// @match       https://youniverse.feishu.cn/sheets/*

// @grant       none

// @version     1.49

// @author      -

// @description 2022/9/30 14:36:49

// @downloadURL https://update.greasyfork.org/scripts/446265/%E5%8D%95%E8%AF%81%E6%96%87%E6%A1%A3%E5%AF%BC%E5%87%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/446265/%E5%8D%95%E8%AF%81%E6%96%87%E6%A1%A3%E5%AF%BC%E5%87%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==



console.log('hi~');



const realmName = 'https://scm-gateway.youniverse.cc:8881';



const style = document.createElement('style');

style.innerHTML = `

  .visible{

    overflow-y:visible !important;

  }

  .tab--active .line1{

    bottom:30px !important;

  }

  .tab--active .line2{

    bottom:-5px !important;

  }

`;



document.querySelector('head').appendChild(style);



console.log('11111', document.querySelector('.note-title__input').innerHTML);

let showScan = false;

let module_type;

if (document.querySelector('.note-title__input').innerHTML.includes('三方') && document.querySelector('.note-title__input').innerHTML.includes('龙舟')) {

    console.log('!!!!!', document.querySelector('.note-title__input').innerHTML.indexOf('三方'), document.querySelector('.note-title__input').innerHTML.indexOf('龙舟'))

    const lzIndex = document.querySelector('.note-title__input').innerHTML.indexOf('龙舟')

    const sfIndex = document.querySelector('.note-title__input').innerHTML.indexOf('三方')

    showScan = true;

    if (lzIndex < sfIndex) {

        module_type = document.querySelector('.note-title__input').innerHTML.includes("欧洲") ? 3 : 1;

    } else {

        module_type = document.querySelector('.note-title__input').innerHTML.includes("欧洲") ? 2 : 0;

    }

} else if (document.querySelector('.note-title__input').innerHTML.includes('三方')) {

    showScan = true;

    module_type = document.querySelector('.note-title__input').innerHTML.includes("欧洲") ? 2 : 0;

} else if (document.querySelector('.note-title__input').innerHTML.includes('龙舟')) {

    showScan = true;

    module_type = document.querySelector('.note-title__input').innerHTML.includes("欧洲") ? 3 : 1;

} else if (document.querySelector('.note-title__input').innerHTML.includes('日本')) {

    showScan = true;

    module_type = 4;
}



// 舱单导入按钮

const manifestImportButton = document.createElement('div');

manifestImportButton.innerHTML = '舱单导入';

manifestImportButton.addEventListener('click', importManifest);

manifestImportButton.classList.add('scan-button');

manifestImportButton.style =

    'position:fixed;top:16px;right:calc(50% - 100px);z-index:99999;background:#ddd;border:2px solid #654321;padding:4px;cursor:pointer';



if (module_type == 1) {

    document.querySelector('body').appendChild(manifestImportButton);

}



function importManifest() {

    window.open(`https://api.d2c.youniverse.cc/d2c-web/logistics/${location.pathname.split('/')[2]}/sync-manifest-data`);

}



//导出报关单

const customsDeclarationButton = document.createElement('div');

customsDeclarationButton.innerHTML = '报关资料';

customsDeclarationButton.addEventListener('click', customsDeclarationReq);

customsDeclarationButton.classList.add('customs-declaration-button');

//默认偏移量

var offsetPosition = '100px';

if (module_type == 1) {

    //有舱单导入按钮后调整偏移量

    offsetPosition = '200px';

}

customsDeclarationButton.style =

    `position:fixed;top:16px;right:calc(50% - ${offsetPosition});z-index:99999;background:#ddd;border:2px solid #654321;padding:4px;cursor:pointer`;



if (showScan) {

    document.querySelector('body').appendChild(customsDeclarationButton);

}

//导出清关资料
const customsClearanceButton = document.createElement('div');
customsClearanceButton.innerHTML = '清关资料';
customsClearanceButton.addEventListener('click', customsClearanceReq);
customsClearanceButton.classList.add('customs-clearance-button');
//默认偏移量
offsetPosition = '200px';
if (module_type == 1) {
    //有舱单导入按钮后调整偏移量
    offsetPosition = '300px';
}
customsClearanceButton.style =
    `position:fixed;top:16px;right:calc(50% - ${offsetPosition});z-index:99999;background:#ddd;border:2px solid #654321;padding:4px;cursor:pointer`;

if (showScan) {
    document.querySelector('body').appendChild(customsClearanceButton);
}

const scanButton = document.createElement('div');

scanButton.innerHTML = '扫描';

scanButton.addEventListener('click', scan);

scanButton.classList.add('scan-button');

scanButton.style =

    'position:fixed;top:16px;right:50%;z-index:99999;background:#ddd;border:2px solid #654321;padding:4px;cursor:pointer';



if (showScan) {

    document.querySelector('body').appendChild(scanButton);

}



let hasBeenScanned = false;



// 顶部导航栏配置

let tabNameConfigArr = [];



// 顶部导航栏初始化标记

let tabNameInitFlag = false;



function initTabNameConfig() {

    if (tabNameInitFlag) {

        return;

    }



    if (module_type == 0) {

        // 三方模版配置

        tabNameConfigArr = [

            {

                type: 'JDZL',

                sheetTitle: "截单资料",

                borderColor: '#FF6666'

            },

            {

                type: 'SJD',

                sheetTitle: "商检单",

                borderColor: '#99CC66'

            },

            {

                type: 'TBD',

                sheetTitle: "投保单",

                borderColor: '#333399'

            },

            {

                type: 'QGZL',

                sheetTitle: "发票",

                borderColor: '#CCCCFF',

                render: function (key) {

                    const tabList = document.querySelectorAll('.tab-list .tab');

                    tabList[key].style += ';overflow:visible;';

                    const len = tabList[key].offsetWidth + tabList[+key + 1].offsetWidth;

                    const line = document.createElement('div');

                    line.classList.add('line1');

                    line.style = `width:${len}px;height:4px;position:absolute;left:0;bottom:40px;z-index:9999999999;background:#CCCCFF`;

                    tabList[key].appendChild(line);



                    const line2 = document.createElement('div');

                    line2.classList.add('line2');

                    line2.style = `width:${len}px;height:4px;position:absolute;left:0;bottom:5px;z-index:9999999999;background:#CCCCFF`;

                    tabList[key].appendChild(line2);

                }

            },
            {

                type: 'SHCD',

                sheetTitle: "上海舱单西邮",

                borderColor: '#333399'

            },
            {

                type: 'NBCD',

                sheetTitle: "宁波舱单西邮",

                borderColor: '#CC9999'

            },

        ]

        tabNameInitFlag = true;

    } else if (module_type == 1) {

        // 龙舟模版配置

        tabNameConfigArr = [

            {

                type: 'JDZL',

                sheetTitle: "AMS",

                borderColor: '#FF6666',

                render: function (key) {

                    const tabList = document.querySelectorAll('.tab-list .tab');



                    tabList[key].style = 'overflow:visible;';

                    const len =

                        tabList[key].offsetWidth +

                        tabList[+key + 1].offsetWidth +

                        tabList[+key + 2].offsetWidth +

                        tabList[+key + 3].offsetWidth;

                    const line = document.createElement('div');

                    line.classList.add('line1');

                    line.style = `width:${len}px;height:4px;position:absolute;left:0;bottom:40px;z-index:9999999999;background:#FF6666`;

                    tabList[key].appendChild(line);



                    const line2 = document.createElement('div');

                    line2.classList.add('line2');

                    line2.style = `width:${len}px;height:4px;position:absolute;left:0;bottom:5px;z-index:9999999999;background:#FF6666`;

                    tabList[key].appendChild(line2);

                }

            },

            {

                type: 'SJD',

                sheetTitle: "商检单",

                borderColor: '#99CC66'

            },

            {

                type: 'QGZL',

                sheetTitle: "CI",

                borderColor: '#333399',

                render: function (key) {

                    const tabList = document.querySelectorAll('.tab-list .tab');



                    tabList[key].style = 'overflow:visible;';

                    const len = tabList[key].offsetWidth + tabList[+key + 1].offsetWidth;

                    const line = document.createElement('div');

                    line.classList.add('line1');

                    line.style = `width:${len}px;height:4px;position:absolute;left:0;bottom:40px;z-index:9999999999;background:#333399`;

                    tabList[key].appendChild(line);



                    const line2 = document.createElement('div');

                    line2.classList.add('line2');

                    line2.style = `width:${len}px;height:4px;position:absolute;left:0;bottom:5px;z-index:9999999999;background:#333399`;

                    tabList[key].appendChild(line2);

                }

            },

            {

                type: 'TSCA',

                sheetTitle: "TSCA",

                borderColor: '#CCCCFF'

            },

            {

                type: 'PSB',

                sheetTitle: "派送表",

                borderColor: '#CC9999'

            },

        ]

        tabNameInitFlag = true;

    } else if (module_type == 2) {

        // 欧洲三方模版配置

        tabNameConfigArr = [

            {

                type: 'JDAMS',

                sheetTitle: "ENS&amp;VGM",

                borderColor: '#FF6666',

            },

            {

                type: 'JDCD',

                sheetTitle: "截单资料-舱单",

                borderColor: "#FF6666",

            },

            {

                type: 'JDSI',

                sheetTitle: "SI",

                borderColor: "#FF6666",

            },

            {

                type: 'NBJDZL',

                sheetTitle: "宁波舱单模板",

                borderColor: '#99CC66',

            },

            {

                type: 'TBD',

                sheetTitle: "投保单",

                borderColor: '#CCCCFF'

            },

            {

                type: 'SJD',

                sheetTitle: "商检单",

                borderColor: '#333399'

            },

            {

                type: 'QGCI',

                sheetTitle: "CI",

                borderColor: '#333399'

            },

            {

                type: 'QGPL',

                sheetTitle: "PL",

                borderColor: '#333399'

            },

            {

                type: 'QGFP',

                sheetTitle: "英国4PX-发票",

                borderColor: '#CC9999'

            },

        ]

        tabNameInitFlag = true;

    } else if (module_type == 3) {

        // 欧洲龙舟模版配置

        tabNameConfigArr = [

            {

                type: 'SHJDZL',

                sheetTitle: "ENS&amp;VGM",

                borderColor: '#FF6666',

                render: function (key) {

                    const tabList = document.querySelectorAll('.tab-list .tab');



                    tabList[key].style = 'overflow:visible;';

                    const len =

                        tabList[key].offsetWidth +

                        tabList[+key + 1].offsetWidth +

                        tabList[+key + 2].offsetWidth;

                    const line = document.createElement('div');

                    line.classList.add('line1');

                    line.style = `width:${len}px;height:4px;position:absolute;left:0;bottom:40px;z-index:9999999999;background:#FF6666`;

                    tabList[key].appendChild(line);



                    const line2 = document.createElement('div');

                    line2.classList.add('line2');

                    line2.style = `width:${len}px;height:4px;position:absolute;left:0;bottom:5px;z-index:9999999999;background:#FF6666`;

                    tabList[key].appendChild(line2);

                }

            },

            {

                type: 'NBJDZL',

                sheetTitle: "欧洲宁波港舱单",

                borderColor: '#99CC66',

            },

            {

                type: 'TBD',

                sheetTitle: "投保单",

                borderColor: '#333399'

            },

            {

                type: 'SJD',

                sheetTitle: "商检单",

                borderColor: '#CCCCFF'

            },

            {

                type: 'QGZL',

                sheetTitle: "CI",

                borderColor: '#FF6666',

                render: function (key) {

                    const tabList = document.querySelectorAll('.tab-list .tab');



                    tabList[key].style = 'overflow:visible;';

                    const len = tabList[key].offsetWidth + tabList[+key + 1].offsetWidth;

                    const line = document.createElement('div');

                    line.classList.add('line1');

                    line.style = `width:${len}px;height:4px;position:absolute;left:0;bottom:40px;z-index:9999999999;background:#FF6666`;

                    tabList[key].appendChild(line);



                    const line2 = document.createElement('div');

                    line2.classList.add('line2');

                    line2.style = `width:${len}px;height:4px;position:absolute;left:0;bottom:5px;z-index:9999999999;background:#FF6666`;

                    tabList[key].appendChild(line2);

                }

            },

            {

                type: 'QGFP',

                sheetTitle: "4PX-发票",

                borderColor: '#CC9999'

            },

        ]

        tabNameInitFlag = true;

    } else if (module_type == 4) {
        // 日本模版

        tabNameConfigArr = [
            {
                type: 'JDZL',

                sheetTitle: "截单资料",

                borderColor: '#FF6666'
            },
            {
                type: 'TBD',

                sheetTitle: "投保单",

                borderColor: '#99CC66'
            },
            {
                type: 'QGZL',

                sheetTitle: "箱单",

                borderColor: '#333399'
            },
            {
                type: 'PSB',

                sheetTitle: "线上FBA表",

                borderColor: '#CC9999'
            }
        ];
        tabNameInitFlag = true;

    }

}



function scan() {

    if (hasBeenScanned) {

        return;

    }

    initTabNameConfig();



    document.querySelector('.tab-container').classList.add('visible');

    const tabList = document.querySelectorAll('.tab-list .tab');



    for (const key of tabList) {

        const tab = key.querySelector('.tab-name');

        const tabName = tab.innerHTML;



        const matchSheetConfig = tabNameConfigArr.find(v => tabName.includes(v.sheetTitle));





        if (matchSheetConfig) {

            hasBeenScanned = true;

            key.style = `border:2px solid ${matchSheetConfig.borderColor};`;

            const exportButton = document.createElement('div');

            exportButton.innerHTML = '导出';

            exportButton.style = `padding:2px;border:2px solid ${matchSheetConfig.borderColor};z-index:9;margin-right:8px;color:black;border-radius:4px`;

            exportButton.addEventListener('click', (event) => {

                exportReq(event, matchSheetConfig.type);

            });



            const flagNode = key.querySelector('.tab-name')

            key.insertBefore(exportButton, flagNode);

            if (matchSheetConfig.render) {

                matchSheetConfig.render(Array.prototype.slice.call(tabList).findIndex(v => v == key));

            }

        }

    }

}



function exportReq(event, type) {

    event.stopPropagation();

    console.log(type, event);



    const payload = {

        type,

        module_type,

    };



    const param = new FormData();

    param.append('json', JSON.stringify(payload));



    event.target.innerHTML = '导出中……';



    fetch(

        `https://api.d2c.youniverse.cc/d2c-web/logistics/${location.pathname.split('/')[2]

        }/list?type=${type}&module_type=${module_type}`,

        {

            method: 'GET', // *GET, POST, PUT, DELETE, etc.

            mode: 'cors', // no-cors, *cors, same-origin

            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached

        },

    )

        .then((res) => {

            return res.json();

        })

        .then((data) => {

            console.log('!?!?!?!?!?', data);

            for (const item of data.data) {

                window.open(`https://api.d2c.youniverse.cc/d2c-web/logistics${item}`);

            }

        })

        .catch((error) => {

            alert('导出失败，请联系开发靓仔')

            console.log('err!!!!!', error);

        })

        .finally(() => {

            event.target.innerHTML = '导出'

        })

}



var myHeaders = new Headers();



var requestGetOptions = {

    method: 'GET',

    headers: myHeaders,

    redirect: 'follow'

};



var requestPostOptions = {

    method: 'POST',

    headers: myHeaders,

    redirect: 'follow'

};



//防止操作过快点击多次

var valve = true

async function customsDeclarationReq() {

    alert("请点击确认，进行下载")

    //禁用按钮

    if (valve) {

        //上锁

        valve = false

        //加载用户信息

        await simulateClickImage();

        var operator = $("._pp-panel-name").text();

        let token = location.pathname.split('/')[2];

        var data = await getContractNo(token, operator);

        //打开

        valve = true

        if (typeof (data) == "undefined") {

            return false

        }

        for (const contractNo of data) {

            await customsDeclarationExport(token, operator, contractNo)

        }

    }



}

async function customsClearanceReq() {
    alert("请点击确认，进行下载")
    //禁用按钮
    if (valve) {
        //上锁
        valve = false
        //加载用户信息
        await simulateClickImage();
        var operator = $("._pp-panel-name").text();
        let token = location.pathname.split('/')[2];
        await customsClearanceExport(token, operator);
        //打开
        valve = true
    }
}


//模拟点击头像加载用户信息

async function simulateClickImage() {

    var operator = $("._pp-panel-name").text();

    if ('' === operator) {

        //禁止弹出显示

        $("div[_pp-theme]").not("._pp-trigger-container").css({ display: "none" });

        //模拟点击头像，

        await $("._pp-control-close").click();

        setTimeout(() => {

            //隐藏弹窗

            $("._pp-dropdown-placement-bottomRight").addClass("_pp-dropdown-hidden");

            //去掉禁止

            $("div[_pp-theme]").not("._pp-trigger-container").css({ display: "" });

        }, 60);

    }

}



//获取相关的合同号

function getContractNo(token, operator) {

    return fetch(`${realmName}/logistic/customsDocumentation/onlineExcel/getContractNo?fileToken=${token}&operator=${operator}`, requestGetOptions)

        .then(response => response.json())

        .then(result => {

            const code = result.code;

            if ("10000" == code) {

                var contractNos = result.data

                if (contractNos == '' || contractNos == null) {

                    alert("数据还未同步，请复制下面链接查看是否存在错误信息：物流跟踪数据格式错误文件")

                } else {

                    console.log("正常获取合同号：" + contractNos)

                    return contractNos;

                }

            } else {

                alert("获取合同号异常：" + result.msg)

                console.log("获取合同号异常：" + result.msg)

            }

        })

        .catch(error => console.log('error->合同号获取出异常：', error));

}







//导出报关资料

function customsDeclarationExport(token, operator, contractNo) {

    fetch(`${realmName}/logistic/customsDocumentation/onlineExcel/download?contractNo=${contractNo}&fileToken=${token}&operator=${operator}`, requestPostOptions)

        .then(async response => {

            const headers = response.headers

            const content = headers.get('content-disposition')

            if (content == null || content == '') {

                //content为空表示下载失败

                const responseJson = await response.json();

                alert("下载报关资料异常：" + responseJson.msg)

                console.log("报关资料导出异常：" + responseJson.msg)

            } else {

                let filename = decodeURIComponent(

                    content.match(/attachment;filename=(\S*)/)[1]

                );

                var update = "-已更新";

                if (filename.indexOf(update) >= 0) {

                    filename = filename.replace(update, "");

                    alert(`${filename}数据发生了变化`);

                }

                const blobData = await response.blob();

                saveBlobAs(blobData, `${filename}`)

            }

        })

        .catch(error => console.log('error->报关资料导出异常', error));

}

//导出清关资料
function customsClearanceExport(token, operator) {
    fetch(`${realmName}/logistic/customsClearance/onlineExcel/download?fileToken=${token}&operator=${operator}`, requestPostOptions)
        .then(async response => {
            const headers = response.headers
            const content = headers.get('content-disposition')
            if (content == null || content == '') {
                //content为空表示下载失败
                const responseJson = await response.json();
                alert("下载清关资料异常：" + responseJson.msg)
                console.log("清关资料导出异常：" + responseJson.msg)
            } else {
                let filename = decodeURIComponent(
                    content.match(/attachment;filename=(\S*)/)[1]
                );
                var update = "-已更新";
                if (filename.indexOf(update) >= 0) {
                    filename = filename.replace(update, "");
                    alert(`${filename}数据发生了变化`);
                }
                const blobData = await response.blob();
                saveBlobAs(blobData, `${filename}`)
            }
        })
        .catch(error => console.log('error->清关资料导出异常', error));
}

// 下载excel

function saveBlobAs(blob, filename) {

    if (window.navigator.msSaveOrOpenBlob) {

        navigator.msSaveBlob(blob, filename)

    } else {

        const anchor = document.createElement('a')

        const body = document.querySelector('body')

        anchor.href = window.URL.createObjectURL(blob)

        anchor.download = filename



        anchor.style.display = 'none'

        body.appendChild(anchor)



        anchor.click()

        body.removeChild(anchor)



        window.URL.revokeObjectURL(anchor.href)

    }

}