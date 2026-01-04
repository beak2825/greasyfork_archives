// ==UserScript==
// @name         tyc_data_helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  tyc data helper
// @author       dubo@tianyancha.com
// @match        https://mp.ifeng.com/*
// @match        https://fhhuser.ifeng.com/*
// @match        https://mp.dayu.com/*
// @match        http://mp.163.com/*
// @match        https://mp.yidianzixun.com/*
// @match        https://mp.qutoutiao.net/*
// @match        https://mp.sohu.com/mpfe/*
// @match        http://mp.tt.cn/*
// @match        https://mp.xueqiu.com/*
// @match        https://mp.toutiao.com/*
// @match        https://baijiahao.baidu.com/*
// @match        https://om.qq.com/*
// @match        https://mp.weixin.qq.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/422686/tyc_data_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/422686/tyc_data_helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 数据解析地址
    const data_send_address = 'http://172.24.114.24:8001/monitor/receive';
    // 定义需要拦截的媒体号及对应请求
    const media_type = new Map();
    media_type.set('大风号', ['/api/statistics/getDayData']);
    media_type.set('大鱼号', ['/dashboard/stat/getConsumptionData', 'api/stat/user/fans/daylist_uc_v2'])
    media_type.set('网易号', ['wemedia/data/content/article/pv/list.do', 'wemedia/subs.json']);
    media_type.set('一点号', ['api/get-fans-everyday', 'api/source-data']);
    media_type.set('趣头条号', ['memberfan/brief', 'report/brief']);
    media_type.set('搜狐号', ['news/v4/users/stat/single', 'news/v4/users/stat/overall']);
    media_type.set('东方号', ['east-content/userdata/datasurvey']);
    media_type.set('雪球号', ['xq/analysis/author/general_analysis.json','xq/analysis/author/relation_analysis.json']);
    media_type.set('头条号', ['agw/statistic/v2/content/stat_trends', 'statistic/v2/fans/trends']);
    media_type.set('百家号', ['builder/author/statistic/appStatistic', 'author/statistic/getFansBasicInfo']);
    media_type.set('企鹅号', ['ommixin/GetArticleReadpvStatistic', 'ommixin/getFansDetailStatistic']);
    media_type.set('微信', ['misc/useranalysis', 'misc/datacubequery']);
    add_sw();
    function add_sw(){
        var swal_js= document.createElement("script");
        swal_js.type = "text/javascript";
        swal_js.src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.15.5/sweetalert2.min.js";
        document.head.appendChild(swal_js);
        var swal_css = document.createElement('link');
        swal_css.rel = 'stylesheet';
        swal_css.href = 'https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.15.5/sweetalert2.min.css';
        document.head.appendChild(swal_css);
    };
    //自定义Ajax
    function ajax(method, url, data, callback) {
        //1、创建请求对象
        var xhr = new XMLHttpRequest();
        //2、配置请求参数并发送请求
        method = method.toUpperCase();
        if (method === 'GET') {
            xhr.rawopen('GET', url, true);
            xhr.send(null);
        } else if (method === 'POST') {
            xhr.rawopen('POST', url, true);
            xhr.send(data);
        } else {
            console.error('请传入合法的请求方式');
        }
        //3、监听状态
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //向外返回服务器的数据
                //根据responseXML属性是否为空
                if (!xhr.responseXML) {
                    callback(xhr.responseText);
                } else {
                    callback(xhr.responseXML);
                }
            }
        }
    };

    XMLHttpRequest.prototype.rawopen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener("readystatechange",
        function() {
            let params = {'media_name': '', 'media_user_account': '', 'responData': null}
            console.log(this)
            if (this.status == 200) {
                for (let key of media_type.keys()) {
                    let media_type_value = media_type.get(key);
                    for(let j = 0, len=media_type_value.length; j < len; j++) {
                        if(url.indexOf(media_type_value[j])!== -1){
                            console.info(key,method, url);
                            let media_account_name = '';
                            let responseTmp = null;
                            console.log(key);
                            console.log(this.getAllResponseHeaders());
                            switch(key){
                                case '大风号':
                                    media_account_name = document.getElementsByClassName('head_name-2pDDc_mC')[0].innerText;
                                    break;
                                case '大鱼号':
                                    media_account_name = '天眼查';
                                    break;
                                case '网易号':
                                    media_account_name = '天眼查';
                                    responseTmp = this.response;
                                    break;
                                case '一点号':
                                    media_account_name = '天眼查';
                                    break;
                                case '趣头条号':
                                    media_account_name = document.getElementsByClassName('right-name')[0].innerText;
                                    break;
                                case '搜狐号':
                                    media_account_name = document.getElementsByClassName('user-name')[0].innerText;
                                    break;
                                case '东方号':
                                    media_account_name = document.getElementsByClassName('info-name')[0].innerText;
                                    break;
                                case '雪球号':
                                    media_account_name = document.getElementsByClassName('header_user-name_2xQ')[0].innerText;
                                    break;
                                case '头条号':
                                    media_account_name = document.getElementsByClassName('auth-avator-name')[0].innerText;
                                    break;
                                case '百家号':
                                    media_account_name = document.getElementsByClassName('domain')[0].innerText;
                                    break;
                                case '企鹅号':
                                    media_account_name = document.getElementsByClassName('usernameText-cls2j9OE')[0].innerText;
                                    break;
                                case '微信':
                                    media_account_name = document.getElementsByClassName('weui-desktop-account__nickname weui-desktop__small-screen-hide')[0].innerText;
                                    params['cookie'] = document.cookie;
                                    break;
                            }
                            params['media_name'] = key;
                            params['media_user_account'] = media_account_name;
                            params['responData'] = responseTmp === null ? this.responseText : responseTmp;
                            params['url'] = url;
                            if(params['responData'] != null && params['responData'] != ''){
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: data_send_address,
                                    async: false,
                                    data: JSON.stringify(params),
                                    onload: function(res){
                                        Swal.fire({
                                            position: 'top-end',
                                            icon: 'success',
                                            title: key + "的后台数据已同步至数据管理平台，快去看看吧！",
                                            showConfirmButton: false,
                                            timer: 5000
                                        })
                                        console.log('上传结果：', res.responseText)
                                    }
                                });
                            }
                        }
                    }
                }
            }
        },
        false);
        XMLHttpRequest.prototype.rawopen.call(this, method, url, async, user, pass);
    };
})();