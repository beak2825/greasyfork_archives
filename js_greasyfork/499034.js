// ==UserScript==
// @name         需求纳产脚本
// @version      1.0
// @description  需求纳产脚本操作
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagezw/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagezw/demandbasicinfonew_detail?*
// @grant        none


// @namespace https://greasyfork.org/users/1324667
// @downloadURL https://update.greasyfork.org/scripts/499034/%E9%9C%80%E6%B1%82%E7%BA%B3%E4%BA%A7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/499034/%E9%9C%80%E6%B1%82%E7%BA%B3%E4%BA%A7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //#region 基础方法
    var mini = window.mini,
        $ = window.$,
        epoint = window.epoint,
        SrcBoot = window.SrcBoot,
        document = window.document,
        Util = window.Util,
        s_Html = window.s_Html,
        JSON = window.JSON,
        window_url = window.location.href,
        website_host = window.location.host;

    function createBtn(name, f) {
        var btn = new mini.Button();
        btn.addCls('mini-btn-primary');
        btn.set({
            disableMultiClick: false,
            text: name
        });
        btn.on('click', f);
        return btn;
    }

    // 获取需求信息
    window.demandInfo = {};

    /**
     * 读取需求的基本信息
     */
    var mailContent = '<div id="copyTable"><span style="color: rgb(61, 75, 100); font-family: &quot;Microsoft YaHei&quot;, Tahoma, Verdana; font-size: 10.5pt; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline !important;">各位领导同事：</span>\n' +
'<div style="margin: 0px; padding: 0px; color: rgb(61, 75, 100); font-family: &quot;Microsoft YaHei&quot;, Tahoma, Verdana; font-size: 13px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; text-indent: 2em; line-height: 1.5;"><span style="font-size: 10.5pt;">为了更好的项目推进，项目复用，完善产品，本需求符合产品收编原则，现由产品研发交付。</span></div>\n' +
'<div style="margin: 0px; padding: 0px; color: rgb(61, 75, 100); font-family: &quot;Microsoft YaHei&quot;, Tahoma, Verdana; font-size: 13px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; line-height: 1.5;">\n' +
'<table border="1" cellpadding="3" cellspacing="2" bordercolor="#000000" align="left" style="position: relative; border-spacing: 0px; border-collapse: collapse; font-size: inherit; table-layout: fixed; width: 750px; background-color: rgb(255, 255, 255); text-align: left; height: 227px;">\n' +
'  <tbody>\n' +
'    <tr style="height: 25px;">\n' +
'      <td style="margin: 0px; padding: 0px; width: 88px; height: 25px;"><span style="font-weight: bold;">&ensp;项目名称</span></td>\n' +
'      <td style="margin: 0px; padding: 0px; width: 444px; height: 25px;"><span id="pname" style="width:auto !important"></span></td>\n' +
'    </tr>\n' +
'    <tr>\n' +
'      <td style="margin: 0px; padding: 0px; width: 88px; height: 26px;"><span style="font-weight: bold;">&ensp;收编需求</span></td>\n' +
'      <td style="margin: 0px; padding: 0px; width: 444px; height: 26px;"><span id="pxname" style="width:auto !important"></span></td>\n' +
'    </tr>\n' +
'    <tr style="height: 25px;">\n' +
'      <td style="margin: 0px; padding: 0px; width: 88px; height: 25px;"><span style="font-weight: bold;">&ensp;收编内容</span></td>\n' +
'      <td style="margin: 0px; padding: 0px; width: 444px; height: 25px;"><span id="pcontent" style="width:auto !important"></span></td>\n' +
'    </tr>\n' +
'    <tr style="height: 25px;">\n' +
'      <td style="margin: 0px; padding: 0px; width: 88px; height: 25px;"><span style="font-weight: bold;">&ensp;涉及移动端</span></td>\n' +
'      <td style="margin: 0px; padding: 0px; width: 444px; height: 25px;"><span id="pismobile" style="width:auto !important"></span></td>\n' +
'    </tr>\n' +
'    <tr style="height: 25px;">\n' +
'      <td style="margin: 0px; padding: 0px; width: 88px; height: 25px;"><span style="font-weight: bold;">&ensp;需求地址</span></td>\n' +
'      <td style="margin: 0px; padding: 0px; width: 444px; height: 25px;"><span id="purl" style="width:auto !important"></span></td>\n' +
'    </tr>\n' +
'    <tr style="height: 25px;">\n' +
'      <td style="margin: 0px; padding: 0px; width: 88px; height: 25px;"><span style="font-weight: bold;">&ensp;项目版本</span></td>\n' +
'      <td style="margin: 0px; padding: 0px; width: 444px; height: 25px;"><span id="pversion" style="width:auto !important"></span></td>\n' +
'    </tr>\n' +
'    <tr style="height: 25px;">\n' +
'      <td style="margin: 0px; padding: 0px; width: 88px; height: 25px;"><span style="font-weight: bold;">&ensp;收编版本</span></td>\n' +
'      <td style="margin: 0px; padding: 0px; width: 444px; height: 25px;"><span id="psbversion" style="width:auto !important"></span></td>\n' +
'    </tr>\n' +
'    <tr style="height: 25px;">\n' +
'      <td style="margin: 0px; padding: 0px; width: 88px; height: 25px;"><span style="font-weight: bold;">&ensp;交付时间</span></td>\n' +
'      <td style="margin: 0px; padding: 0px; width: 444px; height: 25px;"><span id="ptime" style="width:auto !important"></span></td>\n' +
'    </tr>\n' +
'    <tr style="height: 25px;">\n' +
'      <td style="margin: 0px; padding: 0px; width: 88px; height: 25px;"><span style="font-weight: bold;">&ensp;备注</span></td>\n' +
'      <td style="margin: 0px; padding: 0px; width: 444px; height: 25px;"><span id="pmark" style="width:auto !important"></span></td>\n' +
'    </tr>\n' +
'  </tbody>\n' +
'</table>\n' +
'</div></div>';

    function loadDemandInfo() {
        var $output = $('.mini-outputtext');
        $output.each(function () {
            var id = $(this).attr('id');
            if (id) {
                var miniOutputText = new mini.get(id);

                window.demandInfo[correctId(id)] = miniOutputText.getValue();
            }
        });
        var $buttonedit = $('.mini-buttonedit');
        $buttonedit.each(function () {
            var id = $(this).attr('id');
            if (id) {
                var miniButtonEdit = new mini.get(id);
                window.demandInfo[correctId(id + "text")] = miniButtonEdit.getText();
            }
        });

        function correctId(id) {
            if (id.endsWith('guidtext')) {
                return correctId(id.substr(0, id.length - 8) + "name")
            }
            if (id.endsWith('text')) {
                return correctId(id.substr(0, id.length - 4));
            }
            if (id.endsWith('read')) {
                return correctId(id.substr(0, id.length - 4));
            }
            if (id.endsWith('write')) {
                return correctId(id.substr(0, id.length - 5));
            }
            return id;
        }

        var demandGuid = window.rowguid;
        window.demandInfo.rowguid = demandGuid;
        window.demandInfo.demandurl = window_url
        window.demandInfo.projectguid = $('#projectguid\\$value').val()
        window.demandInfo.demandname = $('#demandname').html()
        //demandInfo.djdate=$('.form-control.span1[label="登记日期"]').children().html()
        window.demandInfo.demandno = $('.form-control.span1[label="需求编号"]').children().html()
        window.demandInfo.rowguid = demandGuid + '-change'
        window.demandInfo.projectguid = mini.get('projectguid').getValue()
        window.demandInfo.demandname = $('.form-control[label="需求名称"]').children().html()
        window.demandInfo.productname = $('.form-control.span1[label="产品选择"]').children().html()
        window.demandInfo.hopefinishdate = $('.form-control.span1[label="期望完成时间"]').children().html()
        window.demandInfo.isurgent = '否'
        window.demandInfo.projectname = $('.form-control[label="项目名称"]').children().children().html()
    }

    var domToRender = $('#fkxx').find(".btn-group")[0];
    var domToolBar = $('.fui-toolbar').children().get(0);

    $(domToolBar).append('<span style="float:left;margin-left:8px">产品纳产操作：</span>')

    //渲染需求纳产按钮
    var signBtn = createBtn("需求纳产", function () {
        // 调用showPopup()函数来显示弹窗
        showPopup();

    });
    signBtn.render(domToolBar);

    //渲染纳入需求池按钮
    var signBtn1 = createBtn("纳入需求池", function () {
         alert("纳入需求池")
    });
    signBtn1.render(domToolBar);

    //渲染需求不纳产按钮
    var signBtn2 = createBtn("需求不纳产", function () {
       alert("需求不纳产")
    });
    signBtn2.render(domToolBar);

    function getSjDate(name) {
        var flag = 0
        var sjdate = "";
        $('#transactionhistory1_workitemlist').find(".mini-grid-cell-inner").each(function () {
            var s = $(this).children("span").text()
            if (s == "") {
                s = $(this).text()
            }

            if (flag > 0) {
                flag++;
            }
            if (s == name || s.indexOf(name) != -1) {
                if (flag != 0) {
                    flag = 0
                }
                flag++;
            }

            if (flag == 3) {
                if (s.indexOf("-") != -1) {
                    sjdate = s
                }
                //return ;
            }

        })

        return sjdate;
    }






   // 创建弹窗的HTML结构
    function createPopup() {
        // 创建弹窗容器
        const popup = document.createElement('div');
        popup.id = 'popup';
        popup.style.width = '800px';
        popup.style.height = '800px';
        popup.style.position = 'fixed';
        popup.style.zIndex = '1000'; // 确保弹窗在页面最上层
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid #ccc';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        popup.innerHTML =mailContent;

        // 创建关闭按钮
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px'; // 距离顶部10px
        closeButton.style.right = '10px'; // 距离右侧10px
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '20px';
        closeButton.style.color = '#333';
        closeButton.onclick = function() {
            document.body.removeChild(popup);
        };

       // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制内容';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '10px';
        copyButton.style.right = '80px';
        copyButton.style.cursor = 'pointer';
        copyButton.onclick = function(event) {
            event.preventDefault(); // 阻止链接的默认跳转行为
            event.stopPropagation(); // 阻止事件继续冒泡
            copyTableToClipboard(popup);
        };


        // 复制表格内容到剪贴板的函数定义在外部
        function copyTableToClipboard(popupElement) {
            var range, sel;
            if (document.createRange && window.getSelection) {
                range = document.createRange();
                sel = window.getSelection();
                sel.removeAllRanges();

                var copyTable = popupElement.querySelector('#copyTable');
                if (copyTable) {
                    try {
                        range.selectNodeContents(copyTable);
                        sel.addRange(range);
                        document.execCommand("copy");
                        epoint.alert("成功复制到剪贴板");
                    } catch (e) {
                        console.error("复制操作失败: ", e);
                        epoint.alert("复制操作失败，请稍后重试");
                    }
                } else {
                    console.error("未找到复制目标元素");
                    epoint.alert("未找到复制目标，请确保表格存在");
                }

                // 取消文本选中状态
                sel.removeAllRanges();
            }
        }

        // 添加复制按钮到弹窗
        popup.appendChild(copyButton);

        // 添加关闭按钮到弹窗
        popup.appendChild(closeButton);

       /**
       // 使弹窗可拖拽
        let isDragging = false;
        let startY, startX, dragX, dragY;

        popup.addEventListener('mousedown', (e) => {
            if (e.target === popup) { // 只有当点击的是popup本身时才开始拖拽
                e.preventDefault();
                isDragging = true;
                startY = e.clientY;
                startX = e.clientX;
                dragX = parseFloat(popup.style.left) || 0; // 使用 || 0 确保有默认值
                dragY = parseFloat(popup.style.top) || 0;  // 使用 || 0 确保有默认值
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                popup.style.left = `${dragX + (e.clientX - startX)}px`;
                popup.style.top = `${dragY + (e.clientY - startY)}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                // 这里可以添加一些逻辑，比如保存弹窗的最后位置
                isDragging = false;
            }
        });**/


        // 将弹窗添加到body
        document.body.appendChild(popup);


        //设置内容
        //项目名称
        $("#pname").text(window.demandInfo.projectname);
        //收编需求
        $("#pxname").text(window.demandInfo.demandname);
        //收编内容
        $("#pcontent").text();
        //移动端
        $("#pismobile").text();
        //需求地址
        $("#purl").text(window.demandInfo.demandurl);
        //项目版本
        $("#pversion").text();
        //收编版本
        $("#psbversion").text();
        //交付时间
        $("#ptime").text();
        //备注
        $("#pmark").text();



          // 创建一个新的 div 作为表单容器，并将添加到弹窗中
        const formContainer = document.createElement('div');
        popup.appendChild(formContainer);
        formContainer.style.flexDirection = 'column'; // 子元素垂直排列
        formContainer.style.position = 'fixed';
        formContainer.style.bottom = '0';
        formContainer.style.left = '0';
        formContainer.style.right = '0';
        formContainer.style.backgroundColor = 'white'; // 可以根据需要调整样式
        formContainer.style.padding = '10px';
        formContainer.style.boxShadow = '0 -2px 4px rgba(0,0,0,0.1)';
        // 创建输入框和标签的函数
        const createInputField = (labelText, inputId) => {
            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.width = '110px'; // 标签宽度占满
            label.style.textAlign = 'right'; // 每个标签独占一行
            label.style.float = 'left';

            const input = document.createElement('input');
            input.id = inputId+'Input';
            input.className = 'form-control';
            input.style.width = 'calc(100% - 110px)'; // 输入框宽度撑满
            input.style.float = 'left';
            input.autocomplete="off";
            // 创建一个新的 div 作为每组标签和输入框的容器
            const fieldContainer = document.createElement('div');
            fieldContainer.style.flexDirection = 'column'; // 标签和输入框垂直排列
            fieldContainer.style.height = '25px';
            fieldContainer.style.marginBottom = '10px';
            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);

            // 将每组标签和输入框添加到表单容器中
            formContainer.appendChild(fieldContainer);

            // 监听输入框的输入事件，更新页面上相应内容
            input.addEventListener('input', function() {
                let value = this.value;
                window.demandInfo[this.id] = value;
                // 假设页面上有一个元素id与inputId相同，用于显示文本
                if(document.getElementById(inputId)){
                    document.getElementById(inputId).textContent = value;
                }
            });
        };

        // 为每个需求信息创建输入框和标签
        createInputField('收编内容：', 'pcontent');
        createInputField('是否涉及移动端：', 'pismobile');
        createInputField('项目版本：', 'pversion');
        createInputField('收编版本：', 'psbversion');
        createInputField('交付时间：', 'ptime');
        createInputField('备注：', 'pmark');
        // ...为其他字段重复上述步骤...



    }

    // 显示弹窗
    function showPopup() {
            loadDemandInfo();
            createPopup();
    }

    // 绑定显示弹窗的按钮
    document.addEventListener('DOMContentLoaded', function() {
        const showButton = document.createElement('button');
        showButton.innerText = '显示弹窗';
        showButton.onclick = showPopup;
        document.body.appendChild(showButton);
    });

})();