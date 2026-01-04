// ==UserScript==
// @name           WordPress 系博客验证码 自动填表
// @author          极品小猫
// @version         1.2.4
// @description      支持“胡萝卜周”、“殁漂遥”、“独孤求软”、“蓝点网”，理论上是支持 WordPress 模板的网站，但是需要自行添加 include
// @namespace        https://greasyfork.org/zh-CN/users/3128
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           unsafeWindow
// @grant           GM_info
// @include          http://www.carrotchou.blog/*.html
// @include          https://mpyit.com/*.html*
// @include          https://www.mpyit.com/*.html*
// @include          http://www.dugubest.com/archives/*
// @include          https://huajiakeji.com/downloadstart.html#*
// @include          https://www.landiannews.com/archives/*
// @exclude          http*://mail.*
// @require          http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @run-at          document-idle
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/404510/WordPress%20%E7%B3%BB%E5%8D%9A%E5%AE%A2%E9%AA%8C%E8%AF%81%E7%A0%81%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/404510/WordPress%20%E7%B3%BB%E5%8D%9A%E5%AE%A2%E9%AA%8C%E8%AF%81%E7%A0%81%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E8%A1%A8.meta.js
// ==/UserScript==

let u=unsafeWindow,
    urls=location.href,
    host=location.hostname,
    hosts=location.hostname.replace(/^www\./i,''),
    paths=location.pathname,
    searchs=location.search.replace(/^\?/,''),
    ToDay=getDate(),
    CodeData={};

if(typeof(GM_getValue('CodeData'))=='undefined') GM_setValue('CodeData', {});
else CodeData=GM_getValue('CodeData');

let WordPress = ['carrotchou.blog', 'mpyit.com', 'dugubest.com','landiannews.com']; //WordPress 模板网站清单

let HostList={
    'WordPress':{//WordPress 模板博客通用规则
        'id':'#verifycode, [name="huoduan_laomome"], #gogogo',
        'val': '',//默认密码
        'btn':'#verifybtn',
        callback: function(){
            let config=CodeData[hosts];

            //重新记录密码
            if(config.verifycode=='none') {
                config.verifycode=this.val;
                config.date=ToDay;
                CodeData[hosts]=config;
                GM_setValue('CodeData', CodeData);
            }
        },
        pre : function(conf, e){ //预定义行为
            let config=CodeData[hosts]||{date:"", verifycode:""};

            //密码检测阶段1，日期不符
            /*
            if((!config.date||config.date!==ToDay)&&config.verifycode=='none') {
                config.verifycode=prompt('填写今天的暗号：', config.verifycode);
            }
            */

            //密码检测阶段2，暗号出错
            $('script:not([src]):not([type="text/javascript"])').each(function(){
                if(/暗号出错|验证码错误/.test(this.textContent)&&config.verifycode!=='none') {
                    config.verifycode=prompt('验证码错误，请重写（输入none则今天不会再打扰你了）：', config.verifycode);
                }
            });

            //密码检测阶段3，循环检测没有输入密码
            while((!config.verifycode||config.verifycode=='null')&&config.verifycode!=='none') config.verifycode=prompt('没有写入暗号，请重写（输入none则不会再打扰你了）：', config.verifycode||'none');

            config.date=ToDay;
            CodeData[hosts]=config;
            GM_setValue('CodeData', CodeData);

            conf.val=config.verifycode;
            document.body.oncopy=function(){return false;};
            return conf;
        }
    }
}
for(let i in WordPress) HostList[WordPress[i]]=HostList['WordPress']; //生成 HostList
if((u.wpp_params||u.wp&&(u.wp_url||u.wppay_ajax_url)) && !HostList[hosts]) HostList[hosts]=HostList['WordPress'];

if(HostList[hosts]) {
    let conf=HostList[hosts];

    //检查密码框目标是否存在
    if($(conf['id']).length>0) {
        if(conf['pre']) conf=conf['pre'](conf); //执行预定义行为

        $(document).ready(function(){
            //用户名填表
            var t=setInterval(function(){
                if($('#username,[name="username"], #password,[name="password"]').length>0) {
                    setTimeout(function(){
                        $('#username,[name="username"]').val(conf.username).keydown();
                        $('#password,[name="password"]').val(conf.password).keydown();
                    },100)
                    clearInterval(t);
                }
            },1000);

            if(conf['callback']) $(conf['btn']).on('click', conf['callback']); //绑定密码重置
            if(conf['val']&&conf['val']!=='none') { //存在密码时，自动填写
                $(conf['id']).val(conf['val']);
                $(conf['btn']).click();
            }
        });
    }

    //跳转链处理
    $('body').on('click', 'a', function(e){
        if(/\/go\?url=/i.test(this.href)) this.href=getUrlParam('url', this.href);
    });
}

function getUrlParam(name, url, option, newVal) {
    var search = url ? url.replace(/^.+\?/,'') : location.search;
    var reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");
    var str = search.replace(/^\?/,'').match(reg);

    if (str !== null) {
        switch(option) {
            case 0:
                return unescape(str[0]);
            case 1:
                return unescape(str[1]);
            case 2:
                return unescape(str[2]);
            case 'new':
                return url.replace(str[1]+'='+str[2], str[1]+'='+newVal);
            default:
                return unescape(str[2]);
        }
    } else {
        return false;
    }
}

function getDate(type) {
    var myDate = new Date();

    var year=myDate.getFullYear();
    var month=myDate.getMonth()+1;
    var day=myDate.getDate();

    switch(type) {
        case '/': return year+type+month+type+day;
            break;
        default :
            return year+'-'+month+'-'+day;
    }
}
