// ==UserScript==
// @name         微信公众平台助手
// @namespace    ༺黑白༻
// @version      0.4
// @description  微信公众平台设置助手
// @author       Paul
// @license      MIT
// @match        https://mp.weixin.qq.com/wxamp/*
// @match        https://mp.weixin.qq.com/wxopen/*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @require      https://cdn.bootcss.com/vue/2.6.11/vue.min.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @resource elementui https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/479592/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/479592/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    class ObjectBase{
        constructor(){
            this.GM_addStyle = GM_addStyle;
            this.GM_getResourceText = GM_getResourceText;

            this.GM_addStyle(this.GM_getResourceText("elementui"));
            // 加载 element 字体
            this.GM_addStyle('@font-face{font-family:element-icons;src:url(https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/fonts/element-icons.woff) format("woff"),url(https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/fonts/element-icons.ttf) format("truetype");font-weight:400;font-display:"auto";font-style:normal}');
            // 加载自定义样式
            this.GM_addStyle(`
input.people_ck{ position: absolute;top: 20px;opacity: 100;cursor: pointer;pointer-events:all;}
.ellipsisText{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height: 23px; }
.ctrpanel{ position:fixed;top:0;left:0;height:100%;z-index:9999;background-color:#fff; }
.ctrpanel .el-main { width:220px; }
.ctrpanel .hide { display:none; }
`);

            // 创建Vue承载容器
            this._buildHtml();

            // 创建Vue
            this.App = this._buildVue();
            this.App.instance = this;
            this.App.$mount('#vue');

            var pathname = unsafeWindow.location.pathname;
            console.log(pathname);
            if(pathname == "/wxamp/wadevelopcode/get_class")
            {
                this.wait2Async(()=>{
                    var $res = $("label:contains('版本描述')").siblings('.weui-desktop-form__controls').find('.weui-desktop-form__textarea');
                    return $res.length > 0 ? $res : null;
                }).then(($textarea) =>{
                    if($textarea.val())
                    {
                        this.changeTextareaData($textarea[0],"修复已知问题");
                        this._hitClick($('a.btn:contains("提交审核")')[0]);

                    }
                });
            }
            else if(pathname == "/wxamp/accessapi/apply")
            {
                if(this._getUrlParam("api_name") == "wx.chooseAddress")
                {
                    this.wait2Async(()=>{
                        var $res = $("div.newinterface-access-content-form-row-l:contains('申请接口理由')").siblings('div.newinterface-access-content-form-row-r').find('.weui-desktop-form__textarea');
                        return $res.length > 0 ? $res : null;
                    }).then(($textarea) =>{
                        this.changeTextareaData($textarea[0],"当前业务涉及买家线上下单，商家快递发货的业务场景。需要调用用户的收货地址，不需要用户每次都填写收货地址。");
                    });
                }
            }

        }
        execByPromiseAsync(scope, fn) {
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 2)
            return new Promise((resolve, reject) => {
                args.unshift({
                    resolve: resolve,
                    reject: reject
                });
                fn.apply(scope, args);
            });
        }

        loopAsync(fn, ts = 1000,runNow = true) {
            var timeoutHandler = null;
            var setTimeoutFn = ()=>{
                fn();
                timeoutHandler = setTimeout(setTimeoutFn, ts);
            };
            if(runNow)
                setTimeoutFn();
            else
                timeoutHandler = setTimeout(setTimeoutFn, ts);

            return ()=>{ timeoutHandler && clearTimeout(timeoutHandler); };
        }

        waitAsync(chkFn, ts = 1000) {
            var hasChkFn = typeof chkFn == 'function';
            var setTimeoutFn = hasChkFn ?
                async (dfd) => {
                    var chkResult = chkFn();
                    var resolve = chkResult == null ? false : typeof chkResult == 'object' ? chkResult.success : chkResult;
                    if (resolve) {
                        dfd.resolve(chkResult);
                    }
                    else setTimeout(setTimeoutFn, ts, dfd);
                }
            : (dfd) => {
                setTimeout(() => dfd.resolve(), ts);
            }
            return this.execByPromiseAsync(this, setTimeoutFn);
        }

        wait2Async(chkFn, ts = 1000) {
            var hasChkFn = typeof chkFn == 'function';
            var setTimeoutFn = hasChkFn ?
                async (dfd) => {
                    var chkResult = chkFn();
                    var resolve = typeof chkResult == 'boolean' ? chkResult : chkResult == null ? false : true;
                    if (resolve) {
                        dfd.resolve(chkResult);
                    }
                    else setTimeout(setTimeoutFn, ts, dfd);
                }
            : (dfd) => {
                setTimeout(() => dfd.resolve(), ts);
            }
            return this.execByPromiseAsync(this, setTimeoutFn);
        }

        sleepAsync(ts = 1000) {
            return this.waitAsync(null, ts);
        }

        changeInputData(el, value) {
            let copySetValue = Object.getOwnPropertyDescriptor(unsafeWindow.HTMLInputElement.prototype, 'value').set;
            copySetValue.call(el, value);
            let e = new Event('input', { bubbles: true })
            el.dispatchEvent(e)
        }

        changeTextareaData(el,value)
        {
            let copySetValue = Object.getOwnPropertyDescriptor(unsafeWindow.HTMLTextAreaElement.prototype, 'value').set;
            copySetValue.call(el, value);
            let e = new Event('input', { bubbles: true })
            el.dispatchEvent(e)
        }

        appendHtml(html, dom = document.body) {
            var temp = document.createElement('div');
            temp.innerHTML = html;
            var frag = document.createDocumentFragment();
            frag.appendChild(temp.firstElementChild);
            dom.appendChild(frag);
        }

        JSONToExcelConvertor(JSONData, FileName, title, filter){
            if (!JSONData)
                return;
            //转化json为object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var excel = "<table>";
            //设置表头
            var row = "<tr>";
            if (title) {
                //使用标题项
                for (var i3 in title) {
                    row += "<th align='center'>" + title[i3] + '</th>';
                }
            }
            else {
                //不使用标题项
                for (var i2 in arrData[0]) {
                    row += "<th align='center'>" + i2 + '</th>';
                }
            }
            excel += row + "</tr>";
            //设置数据
            for (var i = 0; i < arrData.length; i++) {
                row = "<tr>";
                for (var index in arrData[i]) {
                    //判断是否有过滤行
                    if (filter) {
                        if (filter.indexOf(index) == -1) {
                            var value = arrData[i][index] == null ? "" : arrData[i][index];
                            row += '<td>' + value + '</td>';
                        }
                    }
                    else {
                        var value2 = arrData[i][index] == null ? "" : arrData[i][index];
                        row += "<td align='center'>" + value2 + "</td>";
                    }
                }
                excel += row + "</tr>";
            }
            excel += "</table>";

            //下面是构建文件的代码
            var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
            excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
            excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
            excelFile += '; charset=UTF-8">';
            excelFile += "<head>";
            excelFile += "<!--[if gte mso 9]>";
            excelFile += "<xml>";
            excelFile += "<x:ExcelWorkbook>";
            excelFile += "<x:ExcelWorksheets>";
            excelFile += "<x:ExcelWorksheet>";
            excelFile += "<x:Name>";
            excelFile += "{worksheet}";
            excelFile += "</x:Name>";
            excelFile += "<x:WorksheetOptions>";
            excelFile += "<x:DisplayGridlines/>";
            excelFile += "</x:WorksheetOptions>";
            excelFile += "</x:ExcelWorksheet>";
            excelFile += "</x:ExcelWorksheets>";
            excelFile += "</x:ExcelWorkbook>";
            excelFile += "</xml>";
            excelFile += "<![endif]-->";
            excelFile += "</head>";
            excelFile += "<body>";
            excelFile += excel;
            excelFile += "</body>";
            excelFile += "</html>";
            var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
            //创建一个a标签
            var link = document.createElement("a");
            //给a标签一个路径
            link.href = uri;
            //为了防止这个a标签显示在视图上，需要先把他隐藏
            link.style = "visibility:hidden";
            //为文件添加后缀名，告诉他这是一个ex文件
            link.download = FileName + ".xls";
            //把a标签添加到body上
            document.body.appendChild(link);
            //触发a标签，等于访问这个文件地址，实现文件下载
            link.click();
            //文件下载完毕后删除a标签，以免对DOM产生冗余
            document.body.removeChild(link);
        }

        _hitClick(el){
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        }

        _getUrlParam(paramName){
            var url = unsafeWindow.location.href;
            let pattern = /(\w+)=([\w.]+)/ig;
            let parames = {};
            url.replace(pattern, ($, $1, $2) => {
                parames[$1] = $2;
            });
            return parames[paramName];
        }

        _buildHtml(){
            this.appendHtml(
                `<div id="vue" >
                     <el-container class="ctrpanel" >
                         <el-aside width="10px" style="background-color:red;cursor: pointer;" >
                             <span @click="toggle" style="height:100%;widht:100%;display:block;">&nbsp;</span>
                          </el-aside>
                         <el-main :class="{ hide : toggleHidePanel }">
                                 <el-row style="margin-top:10px;">
                                     <el-col><el-button type="primary" @click="fill_serverdomain"  >填充服务器域名</el-button></el-col>
                                 </el-row>
                                 <el-row style="margin-top:10px;">
                                  <el-col><el-button type="primary"  @click="fill_businessdomain"  >填充业务域名</el-button></el-col>
                                 </el-row>
                                 <el-row style="margin-top:10px;">
                                     <el-col><el-button type="primary" @click="fill_msgpush" >填充消息推送</el-button></el-col>
                                 </el-row>
                                 <el-row style="margin-top:10px;">
                                     <el-col><el-button type="primary" @click="fill_submsg" >设置订阅消息</el-button></el-col>
                                 </el-row>
                                  <el-row style="margin-top:10px;">
                                     <el-col><el-button type="primary" @click="fill_private" >填充隐私策略</el-button></el-col>
                                 </el-row>
                                   <el-row style="margin-top:10px;">
                                     <el-col><el-button type="primary" @click="export_miniprogram" >导出主体下的小程序</el-button></el-col>
                                 </el-row>
                                  <el-row style="margin-top:10px;">
                                     <el-col><el-button type="danger" @click="send_audit" >提交审核</el-button></el-col>
                                 </el-row>
                          </el-main>
                     </el-container>
                 </div>`
            );
        }

        _buildVue() {
            var that = this;
            return new Vue({
                data() {
                    return {
                        toggleHidePanel: true,
                    };
                },
                methods: {
                    toggle(){
                        this.toggleHidePanel = !this.toggleHidePanel;
                    },
                    async fill_serverdomain(){
                        var $dialog =  $("h3.weui-desktop-dialog__title:contains('配置服务器域名')").parent().parent();
                        if($dialog.length<=0)
                        {
                            alert("没找到配置服务器域名弹框");
                            return ;
                        }
                        var inputObj={
                            'request合法域名':'https://api.im.qcloud.com;https://buy.vzan.com;https://datasink.vzan.com;https://events.im.qcloud.com;https://events.tim.qq.com;https://grouptalk.c2c.qq.com;https://j.weizan.cn;https://j2.weizan.cn;https://log.aldwx.com;https://open.weixin.qq.com;https://pingtas.qq.com;https://pxh.pinxianghui.com;https://sell.vzan.com;https://static1.weizan.cn;https://web.sdk.qcloud.com;https://webim.tim.qq.com;https://yun.tim.qq.com;https://pxhxcxdom.pinxianghui.com;'
                            ,'socket合法域名':'wss://gw-hk.vzan.com;wss://gw.vzan.com;wss://pxh.pinxianghui.com;wss://wss.im.qcloud.com;wss://wss.tim.qq.com;wss://ws.vzan.com;wss://gdwss.vzan.com;wss://wks.vzan.com;wss://pxhxcxdom.pinxianghui.com;'
                            ,'uploadFile合法域名':'https://buy.vzan.com;https://cos.ap-guangzhou.myqcloud.com;https://cos.ap-shanghai.myqcloud.com;https://cos.ap-shanghai.tencentcos.cn;https://pxh.pinxianghui.com;https://sell.vzan.com;https://pxhxcxdom.pinxianghui.com;'
                            ,'downloadFile合法域名':'https://a2.vzan.cc;https://buy.vzan.com;https://cos.ap-guangzhou.myqcloud.com;https://cos.ap-shanghai.myqcloud.com;https://cos.ap-shanghai.tencentcos.cn;https://i.vzan.cc;https://i2.vzan.cc;https://i2cut.vzan.cc;https://i3.vzan.cc;https://icut.vzan.cc;https://j.vzan.cc;https://j.weizan.cn;https://mp.weixin.qq.com;https://static1.weizan.cn;https://thirdwx.qlogo.cn;https://wx.qlogo.cn;https://img.vzan.com;https://oss.vzan.com;https://a2.vzan.com;https://i2cut.vzan.com;https://icut.vzan.com;https://i3.vzan.com;https://i2.vzan.com;https://i.vzan.com;https://j2.weizan.cn;'
                        };
                        for(var item in inputObj)
                        {
                            $("label:contains('"+item+"')").siblings('.frm_controls').find('.url_area').html(inputObj[item]).focus();
                        }

                        await that.sleepAsync(2000);
                        $dialog.find('button:contains("保存并提交")')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    },
                    async fill_businessdomain(){
                        var $dialog =  $("h3.weui-desktop-dialog__title:contains('配置业务域名')").parent().parent();
                        if($dialog.length<=0) {
                            alert("没找到配置业务域名弹框");
                            return ;
                        }

                        var $addBtn =  $dialog.find('a.icon_add');

                        var inputObj={
                            '域名1':'pxh.pinxianghui.com'
                            ,'域名2':'usercenter.vzan.com'
                            ,'域名3':'vzan.com'
                            ,'域名4':'wx.vzan.com'
                            ,'域名5':'pxhxcxdom.pinxianghui.com'
                            ,'域名6':'auth.pinxianghui.net'
                        };
                        var inputs = [];
                        for(var item in inputObj)
                        {
                            var $item =  await that.waitAsync(()=>{
                                var $yuming =$dialog.find("label:contains('"+item+"')");
                                if($yuming.length <=0 )
                                {
                                    if($addBtn.attr("hasclick") != "1"){
                                        $addBtn.attr("hasclick","1");
                                        $addBtn[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                                    }
                                    return false;
                                }
                                $addBtn.attr("hasclick","0");
                                var $dom = $yuming.siblings('.frm_controls').find('input.frm_input');
                                return {
                                    success: $dom.length > 0,
                                    dom : $dom
                                };
                            });
                            inputs.push({ $dom:$item.dom, val : inputObj[item] });
                            that.changeInputData($item.dom[0],inputObj[item]);
                        }

                        await that.waitAsync(()=>{
                            for(var i=0,len = inputs.length; i<len; i++)
                            {
                                var tmp = inputs[i];
                                if(tmp.$dom.val() != tmp.val) return false;
                                console.log(tmp.$dom.val());
                            }
                            return true;
                        },200);

                        console.log("触发提交");
                        $dialog.find('button:contains("保存")')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    },
                    async fill_msgpush(){
                        if($('a:contains("消息推送服务器配置指南")').length<=0)
                        {
                            alert("没找到消息推送服务器配置指南");
                            return ;
                        }
                        var appid = unsafeWindow.prompt("输入当前小程序APPID");
                        var inputObj={
                            'URL(服务器地址)':'https://pxhxcxdom.pinxianghui.com/buy/vzgwxmessage/unifiedprocess/'+appid
                            ,'Token(令牌)':'vzan1688'
                            ,'EncodingAESKey':'TSFxq9eX0El2EMiJsSGsahxFAhnK0XVbQtzCML61rJz'
                        };
                        var $from = $('#customer_form');
                        for(var item in inputObj)
                        {
                            that.changeInputData($from.find("label:contains('"+item+"')").siblings('.frm_controls').find('input.frm_input')[0],inputObj[item]);
                            await that.sleepAsync(500);
                        }
                        // 单选框
                        var radioObj = {
                            '消息加密方式':2,
                            '数据格式':1
                        };
                        for(item in radioObj)
                        {
                            $from.find("label:contains('"+item+"')").siblings('.frm_controls').find("i.icon_radio")[radioObj[item]].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                            await that.sleepAsync(500);
                        }

                        $from.find('a:contains("提交")')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));

                    },
                    async fill_private(){
                        if( $('h2.weui-desktop-page__title:contains("用户隐私保护指引设置")').length <= 0)
                        {
                            alert("没找到用户隐私保护指引设置");
                            return ;
                        }

                        var checkBoxs = [];
                        // 补充列表填空
                        var $ul =  $('ul.privacy-config__list');

                        if( $ul.find('p:contains("收集你的微信昵称、头像")').length <=0 )
                        {
                            checkBoxs.push("用户信息（微信昵称、头像）");
                        }

                        if( $ul.find('p:contains("访问你的麦克风")').length <=0 )
                        {
                            checkBoxs.push("麦克风");
                        }

                        if( $ul.find('p:contains("读取你的剪切板")').length <=0 )
                        {
                            checkBoxs.push("剪切板");
                        }

                        if( $ul.find('p:contains("收集你选中的文件")').length <=0 )
                        {
                            checkBoxs.push("选中的文件");
                        }

                        if( $ul.find('p:contains("访问你的摄像头")').length <=0 )
                        {
                            checkBoxs.push("摄像头");
                        }


                        if(checkBoxs.length > 0){
                            // 增加消息类型
                            $('a:contains("增加信息类型")')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                            var waitResult1 =  await that.waitAsync(()=>{
                                var find1 =$('h3.weui-desktop-dialog__title:contains("使用用户信息类型")');
                                return {
                                    success : find1.length > 0,
                                    res :find1
                                }
                            } );
                            var $dailog = waitResult1.res.parent().parent();

                            for(var i=0,len = checkBoxs.length;i<len;i++)
                            {
                                $dailog.find('span:contains("'+checkBoxs[i]+'")').parent().siblings('i.weui-desktop-icon-checkbox')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                                await that.sleepAsync(500);
                            }
                            $dailog.find('button:contains("确认")')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                            await that.sleepAsync(1000);
                        }

                        var pObj={
                            '，开发者将在获取你的明示同意后，访问你的麦克风。':{ required:true,val:'客户连麦可以发言' }
                            ,'开发者将在获取你的明示同意后，访问你的摄像头。':{ required:true,val:'连麦时可以展示客户画面' }
                            ,'开发者将在获取你的明示同意后，使用你的相册（仅写入）权限。':{ required:true,val:'保存图片或者上传图片'}
                            ,'，开发者将在获取你的明示同意后，收集你的位置信息。':{ required:true,val:'方便用户下单，商家发货'}
                            ,'，开发者将在获取你的明示同意后，收集你的微信昵称、头像。':{ required:true,val:'登录小程序，查看用户信息'}
                            ,'收集你选中的文件':{ required:true,val:'即时通讯 上传插件'}
                            ,'读取你的剪切板':{ required:true,val:'快捷复制'}
                            ,'收集你的地址':{ required:true,val:'商品的上架展示'}
                            ,'收集你选中的照片或视频信息':{ required:true,val:'保存图片或者上传图片'}
                            ,"开发者将在获取你的明示同意后，收集你的手机号":{ required:false,val:'方便沟通联系'}
                        };

                        for(var item in pObj)
                        {
                            console.log(item);
                            var obj = pObj[item];
                            var $input = $ul.find('p:contains("'+item+'")').siblings('div.weui-desktop-form__input-area').find('input.weui-desktop-form__input');
                            if(obj.required || $input.length > 0){
                                that.changeInputData($input[0],obj.val);
                            }
                        }

                        // 补充权益
                        var $quanyi = $('p.group-infos_order:contains("你可以通过以下方式与开发者联系，申请注销你在小程序中使用的账号")');
                        $ul = $quanyi.siblings('ul');
                        $ul.children('div:eq(0)')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        await that.sleepAsync(100);
                        $ul.find('span.weui-desktop-dropdown__list-ele__text:contains("电话")')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        await that.sleepAsync(200);
                        that.changeInputData($ul.find('input[placeholder="电话"]')[0],"4000566612");

                        // 补充通知
                        that.changeInputData($("span:contains('方式告知并征得你的明示同意')").siblings('div.weui-desktop-form__input-area').find('input.weui-desktop-form__input')[0],"系统通知");

                        // 勾选复选框
                        $('span.weui-desktop-form__check-content:contains("本小程序已对用户的信息处理进行了逐一")').prev('i.weui-desktop-icon-checkbox')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));

                        // 找到确认按钮
                        var $btn = $('button:contains("确定并生成协议")');

                        await that.waitAsync(()=>!$btn.hasClass('weui-desktop-btn_disabled'));

                        $btn[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    },
                    async export_miniprogram(){
                        var $infoPage = $('div.meta_name:contains("主体信息")').parent().parent();
                        if($infoPage.length<=0)
                        {
                            alert("请打开基本信息界面");
                            return ;
                        }
                        var mainName = $infoPage.find('td:eq(1)').text().trim();

                        // 点击详情
                        $infoPage.find('td.last_child').find('a:contains("详情")')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));

                        var dailogRes = await that.waitAsync(()=>{ var $res = $("h3.weui-desktop-dialog__title:contains('主体信息')").parent().parent(); return { success:$res.length > 0 , res:$res } });
                        var $dialog = dailogRes.res;
                        console.log($dialog);
                        // 点击查询
                        var queryBtn =  $dialog.find('a:contains("查询")');
                        queryBtn[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        await that.waitAsync(()=>{ return $("h3.weui-desktop-dialog__title:contains('安全保护')").length > 0;  });

                        var mainQueryDailogRes = await that.waitAsync(()=>{ var $res = $("h3.weui-desktop-dialog__title:contains('主体绑定小程序账号查询')").parent().parent(); return { success:$res.length > 0 , res:$res } });

                        console.log('已经扫码');

                        var $mainQueryDailog = mainQueryDailogRes.res;
                        var $lis = $mainQueryDailog.find('ul.weui-desktop-card-profile__list>li');
                        var infos = [];
                        $lis.each((index,val)=>{
                            var obj ={}; var $val=$(val); obj['小程序名称']=$val.find('.weui-desktop-card-profile__nickname').text(); obj["原始Id"] = $val.find('.weui-desktop-card-profile__desc:eq(0)').text(); var statusText = $val.find('.weui-desktop-card-profile__desc:eq(1)').text();  obj["账号状态"] =statusText.indexOf('\n') != -1 ? statusText.split('\n')[1].trim() : statusText.trim(); infos.push(obj);
                        });

                        that.JSONToExcelConvertor(infos,`${mainName}的所有小程序`);

                        $mainQueryDailog.find('button:contains("关闭")')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        $dialog.find('button:contains("关闭")')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    },
                    async send_audit(){
                        var $version_mgr = $("h2:contains('版本管理')").parent().parent();
                        if($version_mgr.length<=0)
                        {
                            alert("请打开版本管理界面");
                            return ;
                        }

                        var $submit_audit =  $version_mgr.find('button:contains("提交审核")');
                        that._hitClick($submit_audit[0]);

                        var $visibleDialog = await that.wait2Async(()=>{ var $res=$('div.weui-desktop-dialog:visible'); return $res.length > 0 ? $res : null });

                        while($visibleDialog.length > 0){
                            // weui-desktop-btn_primary
                            var $icons = $visibleDialog.find('i.weui-desktop-icon-checkbox');
                            if($icons.length > 0){
                                $icons.each((idx,val)=> that._hitClick(val));
                            }

                            var $jixBtn =  $visibleDialog.find("button.weui-desktop-btn_primary");
                            await that.wait2Async(()=>$jixBtn.hasClass('.weui-desktop-btn_disabled') ? null : $jixBtn);

                            that._hitClick($jixBtn[0]);

                            await that.wait2Async(()=>$visibleDialog.is(":hidden")? $visibleDialog : null);

                            $visibleDialog = $('div.weui-desktop-dialog:visible');
                        }
                    },
                    async fill_submsg(){
                        var $submsg_mgr = $("h2:contains('订阅消息')").parent().parent();
                        if($submsg_mgr.length<=0)
                        {
                            alert("请打开订阅消息界面");
                            return ;
                        }

                        var $kaitongBtn = $submsg_mgr.find('button:contains("开通")');
                        if($kaitongBtn.length > 0)
                        {
                            that._hitClick($kaitongBtn[0]);
                            await that.sleepAsync(2000);
                        }

                        if(unsafeWindow.location.href.indexOf('mp.weixin.qq.com/wxamp/newtmpl/tmplselect') == -1)
                        {
                            // 获取token
                            var token = that._getUrlParam("token");
                            unsafeWindow.location.href = `https://mp.weixin.qq.com/wxamp/newtmpl/tmplselect?simple=1&type=2&tid=223&token=${token}&lang=zh_CN`;
                            return;
                        }

                        var selectLabels=["直播标题","直播间名称","直播时间"];
                        for(var i=0,len=selectLabels.length;i<len;i++)
                        {
                            var tmp = selectLabels[i];
                            var $input = $submsg_mgr.find('.tmplmsg_keywords_list input[value="'+tmp+'"]');
                            if($input.length > 0)
                            {
                                var $i = $input.next();
                                if($i.length > 0){
                                    that._hitClick($i[0]);
                                    await that.sleepAsync(500);
                                }
                            }
                        }

                        that.changeInputData($submsg_mgr.find("label:contains('场景说明')").siblings('.frm_controls').find('input.weui-desktop-form__input')[0],'开播提醒');
                        await that.sleepAsync(500);

                        that._hitClick($submsg_mgr.find('a:contains("提交")')[0]);
                    }
                }
            });
        }
    }

    new ObjectBase();

})();