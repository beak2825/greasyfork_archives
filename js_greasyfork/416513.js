// ==UserScript==
// @name         上学吧免会员查看答案
// @namespace    http://tampermonkey.net/sxb/
// @version      2.2.1
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAAzzGb/M8xm/zPMZv8zzGb/M8xm/zPMZv8zzGb/M8xm/zPMZv8zzGb/M8xm/zPMZv8zzGb/M8xm/zPMZv8zzGb/M8xm/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM8xm/zPMZv8AAAAAAAAAAAAAAAAAAAAAM5n//zOZ//8zmf//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADPMZv8zzGb/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOZ//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzzGb/M8xm/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzmf//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM8xm/zPMZv8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM5n//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADPMZv8zzGb/AAAAADOZ//8zmf//M5n//zOZ//8zmf//M5n//zOZ//8zmf//M5n//zOZ//8zmf//M5n//wAAAAAzzGb/M8xm/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzmf//M5n//wAAAAAAAAAAAAAAAAAAAAAAAAAAM8xm/zPMZv8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzmf//AAAAAAAAAAAAAAAAAAAAADPMZv8zzGb/AAAAAAAAAAAAAAAAM5n//zOZ//8zmf//M5n//zOZ//8zmf//M5n//zOZ//8AAAAAAAAAAAAAAAAzzGb/M8xm/wAAAAAzmf//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOZ//8AAAAAM8xm/zPMZv8AAAAAM5n//zOZ//8zmf//M5n//zOZ//8zmf//M5n//zOZ//8zmf//M5n//zOZ//8zmf//AAAAADPMZv8zzGb/AAAAAAAAAAAAAAAAM5n//wAAAAAAAAAAAAAAADOZ//8AAAAAAAAAADOZ//8AAAAAAAAAAAAAAAAzzGb/M8xm/wAAAAAAAAAAM5n//wAAAAAAAAAAAAAAADOZ//8AAAAAAAAAAAAAAAAAAAAAM5n//wAAAAAAAAAAM8xm/zPMZv8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADPMZv8zzGb/M8xm/zPMZv8zzGb/M8xm/zPMZv8zzGb/M8xm/zPMZv8zzGb/M8xm/zPMZv8zzGb/M8xm/zPMZv8zzGb/AAAAAH/+AAB4/gAAf34AAH9+AAB/fgAAQAIAAH8+AAB/3gAAcA4AAF/6AABAAgAAd24AAG72AAB//gAAAAAAAA==
// @description  上学吧，免会员免VIP，即可在页面上直接查看答案。
// @author       chenshao
// @match        *://www.shangxueba.com/ask/*
// @match        *://m.shangxueba.com/ask/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/sweetalert@2.1.2/dist/sweetalert.min.js
// @require      https://greasyfork.org/scripts/405869-tips4code/code/tips4Code.js
// @connect      www.yyxxs.cn
// @connect      localhost
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416513/%E4%B8%8A%E5%AD%A6%E5%90%A7%E5%85%8D%E4%BC%9A%E5%91%98%E6%9F%A5%E7%9C%8B%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/416513/%E4%B8%8A%E5%AD%A6%E5%90%A7%E5%85%8D%E4%BC%9A%E5%91%98%E6%9F%A5%E7%9C%8B%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* global swal */
    /* global GM_addStyle */
    /* global GM_getValue */
    /* global GM_setValue */
    /* global GM_info */
    /* global GM_xmlhttpRequest */
    // ==============================参数配置
    let settingData = {
        storageNamePrefix: 'rukai_StorageName_', // 本地储存名称前缀
        // getAnswerUrl: 'http://localhost:8080/sxb/getanswer.php',
        getAnswerUrl: 'http://www.yyxxs.cn/sxb/getanswer.php',
    };
    // 验证码
    let veriCode = {
        getCode: () => {
            return GM_getValue(settingData.storageNamePrefix + 'veriCode');
        },
        setCode: (code) => {
            GM_setValue(settingData.storageNamePrefix + 'veriCode', code);
        }
    }

    // 添加新按钮
    let btnAnswer = {
        id: 'btnTampermonkey',
        innerText: '猴友查看答案',
        title: '免会员免VIP，即可查看答案',
        setStartState: () => {
            let btn = document.querySelector('#rukai_zjbtn');
            btn.removeEventListener('click', getRemoteAnswer);
            btn.innerText = '正在查询答案...';
        },
        setStopState: () => {
            let btn = document.querySelector('#rukai_zjbtn');
            btn.addEventListener('click', getRemoteAnswer);
            btn.innerText = btnAnswer.innerText;
        }
    }

    // 是否移动端
    let checkIsMobile = function() {
        let host = window.location.hostname;
        let isMobile = false;
        if (host.split('.')[0] === 'm') isMobile = true;
        return isMobile;
    }

    // 问题类别（ask：普通  jxjy：继续教育）
    let checkAskType = function() {
        let pathName = window.document.location.pathname;
        let askType = pathName.substring(1, pathName.substr(1).indexOf('/') + 1);
        return askType;
    }

    // 创建按钮
    let createBtnAnswer = function() {
        let askType = checkAskType();
        let btn;
        switch (askType) {
        case 'ask':
            btn = document.createElement('a');
            btn.className = 'zjbtn';
            break;
        }
        Object.assign(btn, btnAnswer);
        btn.id = 'rukai_zjbtn';
        btn.style.cssText = 'margin-top: 10px; background: red;';
        btn.addEventListener('click', getRemoteAnswer);
        return btn;
    }

    // #region 服务端查询答案
    let getCurrentUrl = (isEncode) => {
        let url = window.location.href;
        // url编码
        if (isEncode) {
            url = encodeURIComponent(url);
        }
        return url;
    };
    let getRemoteAnswer = () => {
        // 提示输入验证码
        let code = veriCode.getCode();
        // code = '';
        console.log('开始发起服务端请求，验证码为：' + code);
        if (!code) {
            showTips4Code();
            return;
        }
        // PC端、移动端
        let client = checkIsMobile() ? 'mobile' : 'pc';
        // 问题类别（ask：普通  jxjy：继续教育）
        let askType = checkAskType();
        // 发起请求
        let details = {
            method: 'GET',
            responseType: 'json',
            timeout: 20000, // 20秒超时
            url: settingData.getAnswerUrl + `?url=${getCurrentUrl(true)}&code=${code}&client=${client}&askType=${askType}&ver=${GM_info.version}&t=` + new Date().getTime(),
            onloadstart: function() {
                btnAnswer.setStartState();
            },
            onload: function(res) {
                // 分3种情况处理返回结果：0正常返回（参考源网站）、1验证码不正确（调用showTips4Code）、100其它错误（调用showErrorTips）
                console.log(res);
                if (res.status === 200) {
                    switch (res.response.retCode) {
                    case 0: // 正常返回
                        let answer = res.response.answer;
                        btnAnswer.setStopState();
                        processAnswer(answer, client);
                        break;
                    case 1: // 验证码不正确
                        showTips4Code('<u>验证码不正确</u> 或 <u>验证码已过期（请从公众号获取最新验证码）</u>');
                        break;
                    default: // 其它错误
                        showErrorTips(res, res.response.answer);
                        break;
                    }
                } else {
                    showErrorTips(res);
                }
            },
            ontimeout: (res) => {
                showErrorTips(res);
            },
            onerror: (res) => {
                showErrorTips(res);
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            showErrorTips(error);
        }
    }
    // 处理服务端返回的答案（使用更加简单的方式显示答案，不再参考源网站处理方式）
    let processAnswer = function(answer, client) {
        switch (client) {
        case 'pc':
            $('.zjbtndiv').html(answer);
            // document.querySelector('#daanmaxdiv').innerHTML = answer;
            break;
        case 'mobile':
            $('#zuijiadiv').html(answer);
            $('#zuijiadiv').next().hide();
            // document.querySelector('#daanmaxdiv').innerHTML = answer;
            break;
        }
    }
    // 出错 统一提示
    let showErrorTips = (error, errorMessage) => {
        console.error(error);
        btnAnswer.setStopState();
        let errorContent = '请稍后重试或到公众号反馈，收到反馈后我会第一时间修复！';
        if (errorMessage) {
            errorContent = errorMessage;
        }
        swal('Sorry，查询答案出错', errorContent, 'error');
    }
    // #endregion 服务端查询答案

    // 在【查看最佳答案】下面新增按钮
    function setZjBtn(btn) {
        let askType = checkAskType();
        console.log(askType);
        let btnZJ = null;
        switch (askType) {
        case 'ask':
            btnZJ = document.querySelector('.zjbtn');
            if (!btnZJ) btnZJ = document.querySelector('.buymember');// 悬赏问题
            break;
        }
        if (!btnZJ) {
            setTimeout(() => {
                setZjBtn(btn);
            }, 300);
        } else {
            console.log('找到按钮【查看答案】：');
            // console.log(btnZJ);
            let parent = btnZJ.parentNode;
            parent.insertBefore(btn, btnZJ.nextSibling);
        }
    }

    // ########################################################
    const tips4Code = document.createElement('div');
    tips4Code.innerHTML = `
        <div id="rukai_divCode">
            <div class="rukai_CodeInput">
                <div id="rukai_error"></div>
                <input id="rukai_code" style="width: 32%" type="text" placeholder="输入验证码" />
                <button id="rukai_submitBtn" style="width: 80px" type="submit" class="rukai_submitBtn rukai_submitBtn-red">确定</button>
            </div>
            <div class="rukai_CodeImg"><img src="data:image/jpeg;base64,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" alt="微信扫描二维码" /></div>
            <div class="rukai_CodeTips">
                <div class="rukai_CodeTitle">获取验证码步骤（绝不收费）</div>
                <p>【1】扫描二维码，关注微信公众号</p>
                <p>【2】在公众号中回复 <strong style="color:#f00">上学</strong>，即可获得验证码</p>
                <p>【3】在上面中输入验证码，点击【确定】，就可以查询答案了</p>
                <p class="rukai_CodeLast">注：验证码不定期更新，如提示验证码过期，则需要按上面步骤重新获取</p>
            </div>
            <div class="rukai_clear"></div>
        </div>
    `;
    function showTips4Code(message) {
        swal({
            // title: '免费获取验证码步骤',
            content: tips4Code,
            // button: 'O K',
            button: false,
            className: 'swal-modal-autowidth'
        }).then((value) => {
            btnAnswer.setStopState();
        });
        // 验证码不正确或过期：给出提示
        let divErrorMessage = document.querySelector('#rukai_error');
        if (message) {
            divErrorMessage.innerHTML = message;
            divErrorMessage.style.display = '';
        } else {
            divErrorMessage.style.display = 'none';
        }
        document.querySelector('#rukai_code').focus();
        let submitBtn = document.querySelector('#rukai_submitBtn');
        submitBtn.removeEventListener('click', setCodeFromInput);
        submitBtn.addEventListener('click', setCodeFromInput);
    }

    function setCodeFromInput() {
        let code = document.querySelector('#rukai_code').value.trim();
        if (code.length > 0) {
            veriCode.setCode(code);
            swal.close();
            getRemoteAnswer();
        }
    }
    GM_addStyle(`
        #rukai_divCode{}
        #rukai_divCode .rukai_CodeInput{
            margin-bottom: 30px;
            margin-top: 50px;
        }
        #rukai_divCode .rukai_CodeTitle{
            font-size: 30px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        #rukai_divCode .rukai_CodeImg{
            float: left;
        }
        #rukai_divCode .rukai_CodeImg img{
            width: 200px;
        }
        #rukai_divCode .rukai_CodeTips{
            float: left;
            text-align: left;
            padding-top: 10px;
        }
        #rukai_divCode .rukai_CodeTips p{
            white-space:nowrap;
            margin-bottom: 15px;
        }
        }
        #rukai_divCode .rukai_CodeTips p.rukai_CodeLast{
            margin-bottom: 0px;
        }
        #rukai_divCode .rukai_clear{
            clear: both;
            margin-bottom: 30px;
        }
        .swal-modal-autowidth{
            width: auto;
        }

        #rukai_code{
            width: 100%;
            border: 1px solid #ccc;
            padding: 7px 0;
            background: #F4F4F7;
            border-radius: 3px;
            padding-left:5px;
            -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
            -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
            -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
            transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s
        }
        #rukai_code:focus{
            border-color: #66afe9;
            outline: 0;
            -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
        }
        /* 验证码 */
        .rukai_submitBtn {
            line-height: 1.499;
            position: relative;
            display: inline-block;
            font-weight: 400;
            white-space: nowrap;
            text-align: center;
            background-image: none;
            border: 1px solid transparent;
            -webkit-box-shadow: 0 2px 0 rgba(0,0,0,0.015);
            box-shadow: 0 2px 0 rgba(0,0,0,0.015);
            cursor: pointer;
            -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
            transition: all .3s cubic-bezier(.645, .045, .355, 1);
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            height: 32px;
            padding: 0 15px;
            font-size: 14px;
            border-radius: 4px;
            color: rgba(0,0,0,0.65);
            background-color: #fff;
            border-color: #d9d9d9;
        }
        .rukai_submitBtn-primary {
            color: #fff;
            background-color: #1890ff;
            border-color: #1890ff;
            text-shadow: 0 -1px 0 rgba(0,0,0,0.12);
            -webkit-box-shadow: 0 2px 0 rgba(0,0,0,0.045);
            box-shadow: 0 2px 0 rgba(0,0,0,0.045);
        }
        .rukai_submitBtn-red {
            color: #fff;
            background-color: #FF5A44;
            border-color: #FF5A44;
            text-shadow: 0 -1px 0 rgba(0,0,0,0.12);
            -webkit-box-shadow: 0 2px 0 rgba(0,0,0,0.045);
            box-shadow: 0 2px 0 rgba(0,0,0,0.045);
        }
        #rukai_error{
            color: #f00;
            margin-bottom: 30px;
        }
        /*修改上学吧网站的css*/
        span.gre{
            display: none;
        }
        div.replyCon{
            margin: 0px 0 10px 50px;
            /*line-height: 30px;*/
        }
        div.replyCon_mobile{
            margin: 0px 0 25px 0px;
        }
    `);

    // ==================================== 逻辑代码开始
    console.log('脚本 START');
    let btn = createBtnAnswer();
    setZjBtn(btn);
    console.log('脚本 END');
    // 查答案功能今天检查正常 #########
})();