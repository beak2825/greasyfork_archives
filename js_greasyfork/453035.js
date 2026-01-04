// ==UserScript==
// @name         Contract Scan
// @name:zh-cn   合约扫描器
// @version      1.1.0
// @namespace    https://github.com/DAOBuidler/contractscan
// @homepage     https://github.com/DAOBuidler/contractscan
// @author       Diven@BuidlerDAO Exqlnet@BuidlerDAO
// @description  contractscan is an oil monkey script specially designed for contract beginners. It enables users to edit and automatically package and download the contract code online with one click when viewing the contract code on the mainstream public chain.
// @description:zh-cn contractscan 是一个专为合约初学者打造的油猴脚本，能够让用户在主流公链上查阅合约代码时，一键在线编辑和自动打包代码并下载
// @match        https://bscscan.com/address/*
// @match        https://etherscan.io/address/*
// @match        https://polygonscan.com/address/*
// @match        https://*.bscscan.com/address/*
// @match        https://*.etherscan.io/address/*
// @match        https://*.polygonscan.com/address/*
// @match        https://bscscan.com/token/*
// @match        https://etherscan.io/token/*
// @match        https://polygonscan.com/token/*
// @match        https://*.bscscan.com/token/*
// @match        https://*.etherscan.io/token/*
// @match        https://*.polygonscan.com/token/*
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/453035/Contract%20Scan.user.js
// @updateURL https://update.greasyfork.org/scripts/453035/Contract%20Scan.meta.js
// ==/UserScript==



const ContractPage = (function () {
    return {
        init: async function () {
            var host = location.hostname;
            var successIconNum = document.getElementsByClassName('fa fa-check-circle text-success').length
            var contractVerified = successIconNum >= 1

            // 如果未验证，直接 pass，如果通过则默认判断合约代码文件数量 >= 1
            if (!contractVerified) return;

            // 获取合约地址
            var hrefUrlData = window.location.href.split('/')
            var contractAddress = hrefUrlData[4].substring(0, 42).toString()


            var htmlObject = document.createElement('div');
            var res = await jQuery.get('/contractdiffchecker?a1=' + contractAddress);
            htmlObject.innerHTML = '<div id="contractscan_copy">' + res + '</div>'
            document.lastChild.appendChild(htmlObject)
            document.getElementById("contractscan_copy").style.display = 'none';


            // 如果合约已验证，判断是否为多文件上传
            var codeFileNameList = []
            var uploadDic = {}
            var contractName = document.getElementsByClassName('h6 font-weight-bold mb-0')[0].innerText

            // 文件名样式的文件
            var codeFileNameElement = document.getElementsByClassName('text-secondary')
            codeFile = document.getElementsByClassName('ace_content')

            // 如果有多个文件名样式，则通过规则过滤出文件名 list
            if (codeFileNameElement.length > 0) {
                for (var i = 0; i < codeFileNameElement.length; i++) {
                    // 兼容 BSC fileName 冒号前面有空格的问题
                    var codeFileNameText = codeFileNameElement[i].innerText.toString().replace(' :', ':')
                    findTextSplitBySpace = codeFileNameText.split(' ')
                    if (findTextSplitBySpace.length == 5 & findTextSplitBySpace[0] == 'File') {
                        codeFileNameList.push(findTextSplitBySpace[4])
                    }
                }
            }

            // 判断文件数量
            if (codeFileNameList.length > 0) {
                for (var i = 0; i < codeFileNameList.length; i++) {
                    var code = document.getElementsByClassName('sourceCode1')[i].innerText
                    var fileName = codeFileNameList[i].endsWith('sol') ? codeFileNameList[i] : codeFileNameList[i] + '.sol'
                    uploadDic[fileName] = code
                }
            } else {
                var code = document.getElementsByClassName('sourceCode1')[0].innerText
                var fileName = contractName.endsWith('sol') ? contractName : contractName + '.sol'
                uploadDic[fileName] = code

            }

            // 上传到仓库
            var status = 0;
            const response = await fetch("https://contractscan.inft.host/api/create-repo", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "namespace": host,
                    "contractAddress": contractAddress,
                    "files": uploadDic,
                }),
            }).then(res => {
                status = res.status
                return res.json()
            });;

            if (status == 200) {
                // 渲染按钮
                var btnElement1 = document.createElement('div');
                btnElement1.style.marginLeft = '4px'
                btnElement1.innerHTML = `<li id ="contractscan_view_online_btn" class="nav-item"><a class="btn btn-xs btn-primary" data-toggle="tab" style="color: white" href=""><span>🔥 View Online</span></a></li>`
                document.getElementById("nav_subtabs").appendChild(btnElement1)
                this.setBtnEventById('contractscan_view_online_btn', this.openUrlOnNewWindows, [response.data.githubDevUrl])

                var btnElement2 = document.createElement('div');
                btnElement2.style.marginLeft = '4px'
                btnElement2.innerHTML = `<li id ="contractscan_download_btn" class="nav-item"><a class="btn btn-xs btn-primary" data-toggle="tab" style="color: white" href=""><span>⬇ Export Zip</span></a></li>`
                document.getElementById("nav_subtabs").appendChild(btnElement2)
                this.setBtnEventById('contractscan_download_btn', this.openUrlOnNewWindows, [response.data.archiveUrl])
            }
        },

        openUrlOnNewWindows: async function (url) {
            window.open(url)
        },

        setBtnEventById: function (aim_btn_name, event, args = []) {
            let btn = document.getElementById(aim_btn_name);

            // 绑定事件，添加到页面上
            btn.onclick = () => {
                if (args.length) {
                    event(...args);
                } else {
                    event();
                }
            };
            return btn;
        },

        setBtnEventbyClass: function (aim_btn, event, args = []) {
            let btn = document.querySelector(`.${aim_btn.replace("_", "-")}`);

            // 绑定事件，添加到页面上
            btn.onclick = () => {
                this.enhanceBtnClickReaction(aim_btn);
                if (args.length) {
                    event(...args);
                } else {
                    event();
                }
            };
            return btn;
        },
    };
})();

(function () {
    ContractPage.init();
})();
