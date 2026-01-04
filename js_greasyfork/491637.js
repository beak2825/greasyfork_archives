// ==UserScript==
// @name         新版图寻主页背景更改&主题色设置插件 Tuxun Main Page Background Image Changer & Theme Color Setting 航线插件
// @version      2.4
// @description  最终版本，将不会继续维护。操作按钮位于窗口右下角！此脚本支持以本地图片或网络图片作为图寻网站背景，支持图寻网站主题色更改。图片转链接可以使用picui.cn或者smms.app
// @author       航线规划院
// @icon         https://s.chao-fan.com/tuxun/favicon.ico
// @match        https://tuxun.fun/*
// @exclude      https://tuxun.fun/replay-pano?*
// @grant        none
// @namespace https://greasyfork.org/users/1251388
// @downloadURL https://update.greasyfork.org/scripts/491637/%E6%96%B0%E7%89%88%E5%9B%BE%E5%AF%BB%E4%B8%BB%E9%A1%B5%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9%E4%B8%BB%E9%A2%98%E8%89%B2%E8%AE%BE%E7%BD%AE%E6%8F%92%E4%BB%B6%20Tuxun%20Main%20Page%20Background%20Image%20Changer%20%20Theme%20Color%20Setting%20%E8%88%AA%E7%BA%BF%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/491637/%E6%96%B0%E7%89%88%E5%9B%BE%E5%AF%BB%E4%B8%BB%E9%A1%B5%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9%E4%B8%BB%E9%A2%98%E8%89%B2%E8%AE%BE%E7%BD%AE%E6%8F%92%E4%BB%B6%20Tuxun%20Main%20Page%20Background%20Image%20Changer%20%20Theme%20Color%20Setting%20%E8%88%AA%E7%BA%BF%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var storedImageUrl = localStorage.getItem('customImageUrl');
    var imageUrl = storedImageUrl || 'https://s2.loli.net/2024/01/21/WvsJiRdQTSE7Kxa.jpg';
    var storedBrightness = localStorage.getItem('brightnessValue');
    var storedBrightnessValue = localStorage.getItem('customBrightnessValue');
    var brightnessValue = storedBrightnessValue ? parseFloat(storedBrightnessValue) : 0.95;
    var storedBlur = localStorage.getItem('blurValue');
    var storedBlurValue = localStorage.getItem('customBlurValue');
    var blurValue = storedBlurValue ? parseFloat(storedBlurValue) : 0;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;

    function buttonWidth() {
        if (isLandscape) {
            console.log('当前是横屏模式');
            return '200px';
        } else {
            console.log('当前是竖屏模式');
            return '105px';
        }
    }

    function logoWidth() {
        if (isLandscape) {
            return '70px';
        } else {
            return '45px';
        }
    }

    function logoHeight() {
        if (isLandscape) {
            return '29.55px';
        } else {
            return '19px';
        }
    }

    function updateBackgroundImage() {
        var existingStyles = document.querySelectorAll('style[data-source="userscript-background"]');
        existingStyles.forEach(function(style) {
            style.remove();
        });

        var style = document.createElement('style');
        style.setAttribute('data-source', 'userscript-background');
        style.innerHTML = `
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                background-image: url(${imageUrl});
                background-size: cover;
                background-position: center;
                filter: brightness(${brightnessValue}) blur(${blurValue}px);
            }
        `;
        document.head.appendChild(style);
    }

    updateBackgroundImage();

    function showModal() {
        var overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'transparent';
        overlay.style.zIndex = '1001';
        document.body.appendChild(overlay);

        var modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        modal.style.padding = '20px';
        modal.style.zIndex = '1002';
        modal.style.borderRadius = '5px';
        modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.alignItems = 'center';

        overlay.addEventListener('click', function() {
            modal.remove();
            overlay.remove();
        });

        /*图片上传*/

        var fileButton = document.createElement('button');
        fileButton.textContent = '选择本地图片(<2M)';
        fileButton.style.margin = '10px';
        fileButton.style.color = 'black';
        fileButton.style.width = '180px';
        modal.appendChild(fileButton);

        var hiddenFileInput = document.createElement('input');
        hiddenFileInput.type = 'file';
        hiddenFileInput.style.display = 'none';
        document.body.appendChild(hiddenFileInput);

        fileButton.addEventListener('click', function() {
            hiddenFileInput.click();
        });

        hiddenFileInput.addEventListener('change', handleFileUpload);

        var urlButton = document.createElement('button');
        urlButton.textContent = '上传背景图片地址';
        urlButton.style.margin = '10px';
        urlButton.style.color = 'black';
        urlButton.style.width = '180px';
        modal.appendChild(urlButton);

        var elementToHide = document.querySelector('.home___kWbfw');
        if (elementToHide) {
            var hideElementCheckboxContainer = document.createElement('div');
            hideElementCheckboxContainer.style.margin = '10px';
            modal.appendChild(hideElementCheckboxContainer);

            var hideElementCheckbox = document.createElement('input');
            hideElementCheckbox.type = 'checkbox';
            hideElementCheckbox.id = 'hideElementCheckbox';

            hideElementCheckbox.checked = true;
            hideElementCheckboxContainer.appendChild(hideElementCheckbox);

            var hideElementLabel = document.createElement('label');
            hideElementLabel.htmlFor = 'hideElementCheckbox';
            hideElementLabel.textContent = '不使用图寻默认背景';
            hideElementLabel.style.marginLeft = '5px';
            hideElementLabel.style.color = 'black';
            hideElementCheckboxContainer.appendChild(hideElementLabel);


            hideElementCheckbox.addEventListener('change', function() {
                localStorage.setItem('hideElementCheckboxChecked', hideElementCheckbox.checked);

                if (hideElementCheckbox.checked) {
                } else {
                    elementToHide.style.display = '';
                }
            });

            var hideElementCheckboxChecked = localStorage.getItem('hideElementCheckboxChecked');
            if (hideElementCheckboxChecked === 'false') {
                hideElementCheckbox.checked = false;
                elementToHide.style.display = '';
            } else {
                elementToHide.style.display = 'none';
            }
        }

        /*按钮颜色更改*/

        var colorContainer = document.createElement('div');
        colorContainer.style.display = 'flex';
        colorContainer.style.alignItems = 'center';
        colorContainer.style.margin = '10px';
        modal.appendChild(colorContainer);

        var colorLabel = document.createElement('div');
        colorLabel.textContent = '按钮颜色：';
        colorLabel.style.marginRight = '10px';
        colorLabel.style.color = 'black';
        colorContainer.appendChild(colorLabel);

        var colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = localStorage.getItem('customColor') || '#ff9427';
        colorContainer.appendChild(colorInput);

        colorInput.addEventListener('input', function() {
            colorLabel.textContent = '按钮颜色：';
            localStorage.setItem('customColor', colorInput.value);
            updateCustomStyles();
        });

        /*应用为主题色*/

        var checkboxContainer = document.createElement('div');
        checkboxContainer.style.margin = '10px';
        modal.appendChild(checkboxContainer);

        var customStyleCheckbox = document.createElement('input');
        customStyleCheckbox.type = 'checkbox';
        customStyleCheckbox.id = 'customStyleCheckbox';
        customStyleCheckbox.checked = localStorage.getItem('customStyleApplied') === 'true';
        checkboxContainer.appendChild(customStyleCheckbox);

        var checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = 'customStyleCheckbox';
        checkboxLabel.textContent = '应用为主题色（推荐使用彩色）';
        checkboxLabel.style.marginLeft = '5px';
        checkboxLabel.style.color = 'black';
        checkboxContainer.appendChild(checkboxLabel);

        var bgcheckboxContainer = document.createElement('div');
        bgcheckboxContainer.style.margin = '10px';
        modal.appendChild(bgcheckboxContainer);

        var BGcheckbox = document.createElement('input');
        BGcheckbox.type = 'checkbox';
        BGcheckbox.id = 'BGcheckbox';
        BGcheckbox.checked = localStorage.getItem('moreBG') === 'true';
        bgcheckboxContainer.appendChild(BGcheckbox);

        var BGcheckboxLabel = document.createElement('label');
        BGcheckboxLabel.htmlFor = 'BGcheckbox';
        BGcheckboxLabel.textContent = '将背景应用至更多页面';
        BGcheckboxLabel.style.marginLeft = '5px';
        BGcheckboxLabel.style.color = 'black';
        bgcheckboxContainer.appendChild(BGcheckboxLabel);

        customStyleCheckbox.addEventListener('change', function() {
            localStorage.setItem('customStyleApplied', customStyleCheckbox.checked);
            if (customStyleCheckbox.checked) {
                var style = document.createElement('style');
                style.setAttribute('data-source', 'userscript-custom-style');
                style.textContent = generateCustomStyles();
                document.head.appendChild(style);
            } else {
                var styles = document.querySelectorAll('style[data-source="userscript-custom-style"]');
                styles.forEach(function(style) {
                    style.remove();
                });
            }
        });

        BGcheckbox.addEventListener('change', function() {
            localStorage.setItem('moreBG', BGcheckbox.checked);
            if (BGcheckbox.checked) {
                const currentUrl = window.location.href;
                if (!currentUrl.includes("tuxun.fun/challenge")){
                    var style = document.createElement('style');
                    style.setAttribute('data-source', 'userscript-custom-style-morebg');
                    style.textContent =
                        `
                    .wrapper___cSTyt {
                        background-color: transparent !important;
                    }

                    .dailyChallengeContainer___udY4u{
                        background-color: transparent !important;
                    }

                    .wrap___wPZIN{
                        background-color: transparent !important;
                    }
                    `;
                    /*.wrapper___g9IXM{
                        background-color: transparent !important;
                    }*/
                    // 匹配成功后的黑底去除。下面也有一个
                    document.head.appendChild(style);
                }
            } else {
                var styles = document.querySelectorAll('style[data-source="userscript-custom-style-morebg"]');
                styles.forEach(function(style) {
                    style.remove();
                });
            }
        });

        /*透明度更改*/

        var opacityContainer = document.createElement('div');
        opacityContainer.style.display = 'flex';
        opacityContainer.style.alignItems = 'center';
        opacityContainer.style.margin = '10px';
        modal.appendChild(opacityContainer);

        var opacityLabel = document.createElement('div');
        opacityLabel.textContent = '透明度：' + (localStorage.getItem('customOpacity') || '0.15');
        opacityLabel.style.color = 'black';
        opacityLabel.style.marginRight = '10px';
        opacityLabel.style.width = '100px';
        opacityContainer.appendChild(opacityLabel);

        var opacityInput = document.createElement('input');
        opacityInput.type = 'range';
        opacityInput.min = '0';
        opacityInput.max = '1';
        opacityInput.step = '0.01';
        opacityInput.value = localStorage.getItem('customOpacity') || '0.1';
        opacityContainer.appendChild(opacityInput);

        opacityInput.addEventListener('input', function() {
            var opacityValue = parseFloat(opacityInput.value);
            opacityLabel.textContent = '透明度：' + opacityValue;
            localStorage.setItem('customOpacity', opacityValue.toString());
            updateCustomStyles();
        });

        /*图片亮度更改*/

        var brightnessContainer = document.createElement('div');
        brightnessContainer.style.display = 'flex';
        brightnessContainer.style.alignItems = 'center';
        brightnessContainer.style.margin = '10px';
        modal.appendChild(brightnessContainer);

        var brightnessLabel = document.createElement('div');
        brightnessLabel.textContent = '亮度：' + brightnessValue;
        brightnessLabel.style.marginRight = '10px';
        brightnessLabel.style.color = 'black';
        brightnessLabel.style.width = '100px';
        brightnessContainer.appendChild(brightnessLabel);

        var brightnessInput = document.createElement('input');
        brightnessInput.type = 'range';
        brightnessInput.min = '0';
        brightnessInput.max = '1';
        brightnessInput.step = '0.01';
        brightnessInput.value = brightnessValue.toString();
        brightnessContainer.appendChild(brightnessInput);

        brightnessInput.addEventListener('input', function() {
            brightnessValue = parseFloat(brightnessInput.value);
            brightnessLabel.textContent = '亮度：' + brightnessValue;
            localStorage.setItem('customBrightnessValue', brightnessValue.toString());
            updateBackgroundImage();
        });

        var blurContainer = document.createElement('div');
        blurContainer.style.display = 'flex';
        blurContainer.style.alignItems = 'center';
        blurContainer.style.margin = '10px';
        modal.appendChild(blurContainer);

        var blurLabel = document.createElement('div');
        blurLabel.textContent = '虚化：' + blurValue;
        blurLabel.style.marginRight = '10px';
        blurLabel.style.color = 'black';
        blurLabel.style.width = '100px';
        blurContainer.appendChild(blurLabel);

        var blurInput = document.createElement('input');
        blurInput.type = 'range';
        blurInput.min = '0';
        blurInput.max = '3';
        blurInput.step = '0.01';
        blurInput.value = blurValue.toString();
        blurContainer.appendChild(blurInput);

        blurInput.addEventListener('input', function() {
            blurValue = parseFloat(blurInput.value);
            blurLabel.textContent = '虚化：' + blurValue;
            localStorage.setItem('customBlurValue', blurValue.toString());
            updateBackgroundImage();
        });

        /*关闭*/

        var closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.color = 'black';

        fileButton.addEventListener('change', handleFileUpload);
        urlButton.addEventListener('click', handleChangeImageUrl);
        closeButton.addEventListener('click', function() {
            modal.remove();
            overlay.remove();
        });

        modal.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        modal.appendChild(closeButton);
        document.body.appendChild(modal);

        var checkUpdateButton = document.createElement('button');
        checkUpdateButton.textContent = 'v2.4';
        checkUpdateButton.style.margin = '10px';
        checkUpdateButton.style.color = 'black';
        checkUpdateButton.style.width = '90px';
        modal.appendChild(checkUpdateButton);

        checkUpdateButton.onclick = function() {
            window.location.href = 'https://greasyfork.org/zh-CN/scripts/491637';
        };

        var authorCredit = document.createElement('div');
        authorCredit.innerHTML = '<a href="https://tuxun.fun/user/317140" target="_blank"><img src="https://i.chao-fan.com/biz/1712056718961_24a43410d1fb4362b03280478c46d67f_0.png?x-oss-process=image/resize,h_20/quality,q_75"></a>';
        authorCredit.style.position = 'absolute';
        authorCredit.style.bottom = '5px';
        authorCredit.style.right = '5px';
        modal.appendChild(authorCredit);

        var selfConfident = document.createElement('div');
        selfConfident.innerHTML = '<a href="https://greasyfork.org/zh-CN/scripts/504488" target="_blank">自信模式</a>';
        selfConfident.style.position = 'absolute';
        selfConfident.style.bottom = '5px';
        selfConfident.style.left = '5px';
        selfConfident.style.fontSize = '12px';
        var link = selfConfident.querySelector('a');
        link.style.textDecoration = 'none';
        link.style.color = '#000';
        link.addEventListener('mouseover', function() {
            var customColor = localStorage.getItem('customColor') || '#ff9427';
            link.style.color = customColor;
        });
        link.addEventListener('mouseout', function() {
            link.style.color = '#000';
        });

        modal.appendChild(selfConfident);
    }

    function handleFileUpload(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var newImageUrl = e.target.result;
            localStorage.setItem('customImageUrl', newImageUrl);
            imageUrl = newImageUrl;
            updateBackgroundImage();
        };
        reader.readAsDataURL(file);
    }

    function handleChangeImageUrl() {
        var newImageUrl = prompt('请将以图片格式结尾（.jpg或者.png等）的图片URL链接粘贴到此处。图片转URL链接可以使用picui.cn或者smms.app');
        if(newImageUrl) {
            localStorage.setItem('customImageUrl', newImageUrl);
            imageUrl = newImageUrl;
            updateBackgroundImage();
        }
    }

    updateBackgroundImage();

    var style = document.createElement('style');
    style.textContent = `
    body {
        background-color: transparent !important;
    }

    .homePage___A0eaw {
        background-color: transparent !important;
    }

    .css-mf7bu6 {
        background: none !important;
    }

    .card___AUSml:hover {
        color: white !important;
        outline: none !important;
    }

    .activity___hL3wd {
        text-decoration: none !important;
    }

    .ant-pro-layout .ant-pro-layout-bg-list {
        background: none !important;
    }
    `; // 何时都会应用

    document.head.appendChild(style);

    function rgbaColor(hex, opacity) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
    }

    function updateCustomStyles() {
        var customColor = localStorage.getItem('customColor') || '#ff9427';
        var customOpacity = localStorage.getItem('customOpacity') || '0.2';
        var existingStyles = document.querySelectorAll('style[data-source="userscript-custom-styles"]');
        existingStyles.forEach(function(style) {
            style.remove();
        });

    var mainButton = document.createElement('button');
    mainButton.textContent = '✈️';
    mainButton.style.position = 'fixed';
    mainButton.style.bottom = '10px';
    mainButton.style.right = '10px';
    mainButton.style.zIndex = '1000';
    mainButton.style.opacity = '0.6';
    mainButton.style.backgroundColor = `${rgbaColor('#fff', 1)}`;
    mainButton.style.border = '1px solid';
    mainButton.style.borderRadius = '40px';
    mainButton.style.borderColor = `${rgbaColor(customColor, 1)}`;

    document.body.appendChild(mainButton);
    mainButton.addEventListener('click', showModal);

    var style = document.createElement('style');
        style.setAttribute('data-source', 'userscript-custom-styles');
        style.textContent = `
        .card___AUSml {
            background-color: ${rgbaColor(customColor, customOpacity)} !important;
            backdrop-filter: blur(1.5px) !important;
            transition: background-color 0.3s, backdrop-filter 0.3s !important;
        }

        .card___AUSml:hover {
            backdrop-filter: blur(0px) !important;
            background-color: ${rgbaColor(customColor, customOpacity*0.6)} !important;
        }

        div[style="text-align: center; color: rgb(250, 140, 22); text-decoration: underline; margin-bottom: 20px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;"] > div {
            background-color: ${rgbaColor(customColor, customOpacity)} !important;
            color: white;
            text-decoration: underline;
        }
    `;
        document.head.appendChild(style);
    }

    function generateCustomStyles() {
        var customColor = localStorage.getItem('customColor') || '#ff9427';
        var customOpacity = localStorage.getItem('customOpacity') || '0.2';
        const newSVG = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" id="1" viewBox="0 0 225.6 95.28">
        <defs>
            <style>.cls-1{fill:#fff;}.cls-2{fill:${rgbaColor(customColor, 1)};fill-rule:evenodd;}</style>
        </defs>
        <g>
            <path class="cls-1" d="M101.4,95.16H0V3H101.4V95.16Zm-18.6-12.96V15.96H18.48V82.2H82.8Z"/>
            <path class="cls-1" d="M115.56,53.28h72.84v-5.52h18.48v5.52h18.72v13.2h-18.72v28.8h-33.6v-11.16h15.12v-17.64H115.56v-13.2Zm83.52-25.32H120.24v-10.08h78.84v-5.76H117.84V0h99.72V45.96H117.84v-12.12h81.24v-5.88Zm-46.92,43.44l11.52,23.76h-19.2l-11.52-23.76h19.2Z"/>
        </g>
        <text/>
        <g>
            <path class="cls-2" d="M74.1,41.81c0-12.84-10.36-23.25-23.2-23.25s-23.2,10.41-23.2,23.25c0,0-.78,12.92,23.2,36.9,23.98-23.98,23.2-36.9,23.2-36.9"/>
            <circle class="cls-1" cx="50.9" cy="38.16" r="12.79"/>
        </g>
    </svg>`);
        return `
        .navigate___xl6aN .logo___KYw8m sup {
            background-color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-btn-primary{
            background-color: ${rgbaColor(customColor, 1)} !important;
            border-color: transparent !important;
            color: #fff !important;
        }/*按钮*/

        .ant-btn-primary:hover{
            background-color: #fff !important;
            color: ${rgbaColor(customColor, 1)} !important;
            border-color: ${rgbaColor(customColor, 1)} !important;
        }

        .roundWrapper___eTnOj{
            background-color: ${rgbaColor(customColor, 1)} !important;
        }

        .wrapper___hJxKg .scoreReulst___qqkPH .scoreReulstValue___gFyI2{
            text-shadow: 0 0 2px ${rgbaColor(customColor, 1)},0 0 6px ${rgbaColor(customColor, 1)},0 0 4px ${rgbaColor(customColor, 1)},0 0 10px ${rgbaColor(customColor, 1)},0 0 10px ${rgbaColor(customColor, 1)},0 0 10px ${rgbaColor(customColor, 1)},0 0 15px ${rgbaColor(customColor, 1)},0 0 15px ${rgbaColor(customColor, 1)} !important;
        }

        .dailyChallengeTypeContainer___Ye7CG:hover,.dailyChallengeTypeContainer___Ye7CG.active___G_ELD{
            outline: 2px solid ${rgbaColor(customColor, 1)} !important;
        }

        .countdownPath___BljUS{
            stroke: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-ribbon{
            text-shadow: ${rgbaColor(customColor, 1)} 1px 1px 5px !important;
        }

        .ant-btn-lg{
            color: white;
            width: ${buttonWidth()};
            height: 45px;
        }

        .ant-btn-variant-outlined:not(.ant-btn-icon-only){
            border-radius: 40px !important;
            background-color: ${rgbaColor(customColor, customOpacity*1.5)} !important;
            border-color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-float-btn-primary, .ant-float-btn-primary .ant-float-btn-body{
            background-color: ${rgbaColor(customColor, customOpacity/2)} !important;
        }

        .ant-btn.ant-btn-round.ant-btn-lg{
            background-color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-btn-color-primary{
            box-shadow: none !important;
        }

        .ant-btn-variant-solid:not(:disabled):not(.ant-btn-disabled):hover{
            background-color: white !important;
        }

        .ant-btn-lg.ant-btn-icon-only{
            border-radius: 8px !important;
        }

        .ant-btn-variant-dashed{
            border: 1px solid ${rgbaColor(customColor, 1)} !important;
            background-color: ${rgbaColor(customColor, customOpacity*1.5)} !important;
            border-radius: 40px !important;
        }

        .ant-list-item{
            background-color: ${rgbaColor(customColor, 0.5)};
        }

        .ant-card{
            background-color: ${rgbaColor(customColor, 0.5)} !important;
        }

        .wrapper___SIyI4{
            border-radius: 20px;
            padding: 10px;
            background-color: ${rgbaColor(customColor, 0.3)} !important;
        }

        .ant-card-body{
            background-color: ${rgbaColor(customColor, 0.3)} !important;
        }

        .ant-card-bordered{
            border: 1px solid ${rgbaColor(customColor, 0.5)} !important;
        }

        .backBtn___dV1yA{
            background-color: ${rgbaColor(customColor, customOpacity*2)} !important;
        }

        .ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover, .ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):hover{
            color: ${rgbaColor(customColor, 1)} !important;
            border-Color: ${rgbaColor(customColor, 1)} !important;
            background-color: #fff5 !important;
        }

        button.ant-btn.ant-btn-round.ant-btn-default.ant-btn-color-default.ant-btn-variant-outlined.ant-btn-lg:hover{
            background-color: #fff !important;
        }

        .dailyChallengeTypeContainer___Ye7CG{
            background-color: ${rgbaColor(customColor, 0.5)} !important;
            border: 1px solid ${rgbaColor(customColor, 0.5)} !important;
        }

        .ant-spin-dot-item{
            background-color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-pro-card{
           background-color: transparent !important;
        }

        .ant-pro-card.infoWrapper___d9VOm{
            border: 1px solid ${rgbaColor(customColor, 0.5)} !important;
            background-color: ${rgbaColor(customColor, 0.3)} !important;
        }

        .ant-segmented{
            background-color: ${rgbaColor(customColor, 0.4)} !important;
        }

        .mapSettingDescription___m28cr{
            background-color: ${rgbaColor(customColor, customOpacity)} !important;
        }

        .matchTypeDescription___UXlTS{
            background-color: ${rgbaColor(customColor, customOpacity)} !important;
        }

        .ant-segmented .ant-segmented-item-selected{
            background-color: #fff3 !important;
        }

        .css-imeb5n.ant-space{
            justify-content: space-evenly;
        }

        .ant-segmented-thumb{
           background-color: transparent !important;
        }

        .ant-table-wrapper .ant-table-tbody .ant-table-row >.ant-table-cell-row-hover{
            background-color: ${rgbaColor(customColor, 0.2)} !important;
        }

        .ant-pro-card.ant-pro-card-ghost{
           background-color: transparent !important;
           border-color: transparent !important;
        }

        .css-imeb5n.ant-table-wrapper .ant-table{
            background-color: transparent !important;
        }

        .ant-table-wrapper .ant-table-tbody >tr >th, .ant-table-wrapper .ant-table-tbody >tr >td{
            border-bottom: none !important;
        }

        .ant-spin-text{
            color: ${rgbaColor(customColor, 1)} !important;
            text-shadow: none !important;
        }

        .ant-switch.ant-switch-checked{
            background: ${rgbaColor(customColor, 1)} !important;
        }

        .hudAvatarContainer___MYJpm .avatarContainer___tJ9Gx{
            background: ${rgbaColor(customColor, 1)} !important;
        }

        .hudHealthBarContainer___v1oCm .hudHealthBar___BPbFA{
            background: ${rgbaColor(customColor, 1)} !important;
        }

        .challengeWrap___q0AXk .innerWrapper___XVgZO .roundScore___OWkm_ .roundScoreScore___UMflq .roundScoreValue___YSyQt{
            text-shadow: 0 0 2px ${rgbaColor(customColor, 1)},0 0 6px ${rgbaColor(customColor, 1)},0 0 4px ${rgbaColor(customColor, 1)},0 0 10px ${rgbaColor(customColor, 1)},0 0 10px ${rgbaColor(customColor, 1)},0 0 10px ${rgbaColor(customColor, 1)},0 0 15px ${rgbaColor(customColor, 1)},0 0 15px ${rgbaColor(customColor, 1)} !important;
        }

        .ant-badge .ant-scroll-number{
            background-color: ${rgbaColor(customColor, 1)} !important;
            color: white !important;
        }

        sup.ant-scroll-number.hostBadge___MIQmq.ant-badge-count.ant-badge-multiple-words{
            background-color: ${rgbaColor(customColor, 1)} !important;
            color: white !important;
        }

        .ant-avatar-image{
            border-color: ${rgbaColor(customColor, 1)} !important;
        }

        .status___XaZqs{
            background-color: ${rgbaColor(customColor, 1)} !important;
        }

        .status___XaZqs .statistic___Mky_T .ant-statistic-content .ant-statistic-content-prefix{
            color: white !important;
        }

        .mapBox___wPNE1 .mapWrapper___GgkxF .mapConfirm___Q8fp1 button:disabled{
            background-color: white !important;
            color: ${rgbaColor(customColor, 1)} !important;
            border-color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-message .ant-message-notice-wrapper .ant-message-warning>.anticon{
            color: ${rgbaColor(customColor, 1)} !important;
        }

        .anticon-spin{
            color: ${rgbaColor(customColor, 1)} !important;
        }

        .wrapper___H8Ysq .scoreReulst___u9Phz .myScore___XfYBe{
            border: 3px solid ${rgbaColor(customColor, 1)} !important;
        }

        .partyWrapper___TwyLT{
            background-color: transparent !important;
        }

        .ant-scroll-number .ant-badge-count .ant-badge-multiple-words{
            color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-flex p {
            color: ${customColor} !important;
        } /* 正在匹配 */

        .ant-input-outlined:focus, .css-imeb5n.ant-input-outlined:focus-within{
            border-color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-input-outlined:hover{
            border-color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-input-number-outlined:focus, .css-imeb5n.ant-input-number-outlined:focus-within{
            border-color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-input-number-outlined:hover{
            border-color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-table-container{
            background-color: ${rgbaColor(customColor, 0.3)} !important;
            border: 1px solid ${rgbaColor(customColor, 0.5)} !important;
        }

        .ant-dropdown .ant-dropdown-menu{
            background-color: ${rgbaColor(customColor, customOpacity)} !important;
        }

        .ant-descriptions-view{
            background-color: ${rgbaColor(customColor, 0.3)} !important;
        }

        .logo___KYw8m {
            background-image: url("data:image/svg+xml,${newSVG}");
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            width: ${logoWidth()};
            height: ${logoHeight()};
        }

        .logo___KYw8m img {
            display: none;
        }

        .ant-alert-warning{
            background-color: ${rgbaColor(customColor, 0.5)} !important;
        }

        .ant-spin-nested-loading .ant-spin-blur{
            opacity: 0 !important;
        }

        .ant-pagination-item-active{
            background-color: none !important;
            border-color: ${rgbaColor(customColor, 1)} !important;
        }

        .ant-pagination-item-active a{
            color: white !important;
        }

        .ant-pagination-item{
            background-color: ${rgbaColor(customColor, 0.3)} !important;
        }
        `;
    }

    function applyInitialCustomStyles() {
        if (localStorage.getItem('customStyleApplied') === 'true') {
            var style = document.createElement('style');
            style.setAttribute('data-source', 'userscript-custom-style');
            style.textContent = generateCustomStyles();
            document.head.appendChild(style);
        }
    };

    function applyMoreBG() {
        if (localStorage.getItem('moreBG') === 'true') {
            const currentUrl = window.location.href;
            if (!currentUrl.includes("tuxun.fun/challenge")){
                var style = document.createElement('style');
                style.setAttribute('data-source', 'userscript-custom-style-morebg');
                style.textContent =
                `
                .wrapper___cSTyt {
                    background-color: transparent !important;
                }

                .dailyChallengeContainer___udY4u{
                    background-color: transparent !important;
                }

                .wrap___wPZIN{
                    background-color: transparent !important;
                }
                `;
                /*.wrapper___g9IXM{
                    background-color: transparent !important;
                }*/
                document.head.appendChild(style);
            } else {
                var existingStyles = document.querySelectorAll('style[data-source="userscript-custom-style-morebg"]');
                existingStyles.forEach(function(style) {
                    style.remove();
                });
            }
        }
    };

    function updateHideElementStyle() {
        var style = document.createElement('style');
        if (localStorage.getItem('hideElementCheckboxChecked') === 'false') {
            style.setAttribute('data-source', 'userscript-custom-styles');
            style.textContent = `
            .home___kWbfw {
                display: block !important;
            }
        `;
        } else {
            style.setAttribute('data-source', 'userscript-custom-styles');
            style.textContent = `
            .home___kWbfw {
                display: none !important;
            }
        `;
        }
        document.head.appendChild(style);
    };

    updateCustomStyles(); // 放最前面

    applyInitialCustomStyles();

    setInterval(applyMoreBG, 1000);

    applyMoreBG();

    updateHideElementStyle();

})();