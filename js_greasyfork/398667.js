// ==UserScript==
// @name         loadbt自动邀请 maiz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  已失效，loadbt 接入Google验证码
// @author       zsandianv
// @match        https://www.baidu.com
// @match        http://www.baidu.com
// @grant        GM_xmlhttpRequest
// @connect      www.loadbt.com
// @connect      inbox.maiz.ca
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/notiflix@2.1.2/dist/Minified/notiflix-2.1.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/398667/loadbt%E8%87%AA%E5%8A%A8%E9%82%80%E8%AF%B7%20maiz.user.js
// @updateURL https://update.greasyfork.org/scripts/398667/loadbt%E8%87%AA%E5%8A%A8%E9%82%80%E8%AF%B7%20maiz.meta.js
// ==/UserScript==

( function () {
    'use strict';

    let domparser = new DOMParser();
    let username;
    let loadbt_password = 'zjav2020z'; //输入 loadbt 密码
    let loadbt_share_url = 'https://www.loadbt.com/c/973335152'; //输入 loadbt 邀请链接
    let loadbt_url = 'https://www.loadbt.com/';
    let loadbt_url_zh = 'https://www.loadbt.com/zh';
    let loadbt_register_url;
    let loadbt_register_api = 'https://www.loadbt.com/register';
    let loadbt_files_url = 'https://www.loadbt.com/files';
    let loadbt_logout_api = 'https://www.loadbt.com/logout';
    let loadbt_verify_api = 'https://www.loadbt.com/email/verify'
    let loadbt_activate_url;
    let maiz_inbox_url;
    let mail;




    async function loadbt_register (url) {
        console.log( 1 )

        let doc;
        let responsedata;
        let token;
        let params = [];
        let referrer;
        let loadbt_headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
        }
        console.log( url )//访问 loadbt 邀请链接
        await myGetData( 'GET', url, '', loadbt_headers )
            .then( response => {
            responsedata = response;
            console.log( responsedata )
        } );
        Notiflix.Notify.Info('正在注册 loadbt 账号');
        let refcode = url.split( '/' )[ 4 ];
        referrer = 'https://www.loadbt.com/?refcode=' + refcode + '&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=CopyPaste';
        let loadbt_2_headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'Referer': referrer,
            'RefererPolicy': 'no-referrer-when-downgrade',
        }
        let loadbt_post_headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'Referer': loadbt_register_url,
            'RefererPolicy': 'no-referrer-when-downgrade',
        }
        do{
            console.log( loadbt_register_url )//访问 loadbt 注册链接
            await myGetData( 'GET', loadbt_register_url, '', loadbt_2_headers )
                .then( response => {
                responsedata = response;
                console.log( responsedata )
            } );
            if ( responsedata.status === 200 ) {
                doc = domparser.parseFromString( responsedata.responseText, "text/html" );
                console.log( doc )
                token = doc.getElementsByName( "_token" )[ 0 ].value;
                if ( responsedata.finalUrl === loadbt_verify_api || responsedata.finalUrl === loadbt_files_url ){
                    let postdata = '_token=' + token;
                    console.log( loadbt_logout_api ) //发送 loadbt_logout 信息
                    await myGetData( 'POST', loadbt_logout_api, postdata, loadbt_post_headers )
                        .then( response => {
                        responsedata = response;
                        console.log( responsedata )
                    } );
                }
            }else {
                Notiflix.Loading.Arrows('错误 : loadbt 服务器错误，请稍后重试');
                Notiflix.Notify.Failure('错误 : loadbt 服务器错误，请稍后重试')
                window.alert('错误 : loadbt 服务器错误，请稍后重试');
                return;
            }
        }while( responsedata.finalUrl !== loadbt_register_url );
        let logindata = {
            '_token': token,
            'email': mail,
            'password': loadbt_password,
            'password_confirmation': loadbt_password,
            'terms': 'on',
        }
        for ( let k in logindata ) params.push( `${encodeURIComponent(k)}=${encodeURIComponent(logindata[k])}` );
        let postdata = params.join( '&' );
        console.log( loadbt_register_api )//发送 loadbt_register 信息
        await myGetData( 'POST', loadbt_register_api, postdata, loadbt_post_headers )
            .then( response => {
            responsedata = response;
            console.log( responsedata )
        } );
        if ( responsedata.status === 200 ) {
            if (responsedata.finalUrl === loadbt_verify_api){
                Notiflix.Notify.Success('注册 loadbt 账号成功')
                await loadbt_activate_link(maiz_inbox_url)
            }else if (responsedata.finalUrl === loadbt_register_url){
                Notiflix.Loading.Arrows('错误 : 请更换 ip 地址');
                Notiflix.Notify.Failure('错误 : 请更换 ip 地址')
                window.alert('错误 : 请更换 ip 地址');
                return;
            }
        }
    }



    async function loadbt_activate_link (url) {
        console.log( 2 )

        let doc;
        let responsedata;
        let message_body;
        let message;
        let message_length;
        let maiz_get_headers = {
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Connection': 'keep-alive',
            'Referer': url,
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
        }
        console.log( url ) //访问 maiz
        await myGetData( 'GET', url, '', maiz_get_headers )
            .then( response => {
            responsedata = response;
            console.log( responsedata )
        } );
        do{
            console.log( 'https://inbox.maiz.ca/mail/fetch' )//获取 loadbt 激活链接
            await myGetData( 'GET', 'https://inbox.maiz.ca/mail/fetch', '', maiz_get_headers )
                .then( response => {
                responsedata = response;
                console.log( responsedata )
            } );
            Notiflix.Notify.Info('正在获取 loadbt 激活链接');
            message_length = 0;
            if (typeof responsedata !== 'null' && responsedata.status === 200 ){
                message = JSON.parse( responsedata.responseText );
                message_length = message['length'];
            }
            if (message_length === 0){
                console.log( 'https://inbox.maiz.ca/mail/fetch?new=true' )//获取 loadbt 激活链接
                await myGetData( 'GET', 'https://inbox.maiz.ca/mail/fetch?new=true', '', maiz_get_headers )
                    .then( response => {
                    responsedata = response;
                    console.log( responsedata )
                } );
                Notiflix.Notify.Info('正在获取 loadbt 激活链接');
            }
            if (typeof responsedata !== 'null' && responsedata.status === 200 ){
                message = JSON.parse( responsedata.responseText );
                message_length = message['length'];
            }
        }while (message_length === 0);
        if (message_length !== 0){
            $.each(message, function (index, element) {
                if (typeof element.html !== 'undefined'){
                    message_body = element.html
                }
            });
        }
        doc = domparser.parseFromString( message_body, "text/html" );
        console.log( doc )
        loadbt_activate_url = doc.links[1].href
        if ( typeof loadbt_activate_url === 'string' ) {
            Notiflix.Notify.Success('获取 loadbt 激活链接成功')
            await loadbt_activate()
        }
    }



    async function loadbt_activate () {
        console.log( 3 )

        let responsedata = [];
        let doc;
        let token;
        let loadbt_headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
        }
        console.log( loadbt_activate_url ) //激活 loadbt
        await myGetData( 'GET', loadbt_activate_url, '', loadbt_headers )
            .then( response => {
            responsedata = response;
            console.log( responsedata )
        } );
        Notiflix.Notify.Info('正在激活 loadbt 账号');
        if ( responsedata.status === 200 ) {
            console.log( loadbt_files_url ) //获取 loadbt_logout_token
            await myGetData( 'GET', loadbt_files_url, '', loadbt_headers )
                .then( response => {
                responsedata = response;
                console.log( responsedata )
            } );
            doc = domparser.parseFromString( responsedata.responseText, "text/html" );
            token = doc.getElementsByName( '_token' )[ 0 ].value;
            let loadbt_logout_headers = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
                'Referer': loadbt_files_url,
                'RefererPolicy': 'no-referrer-when-downgrade',
            }
            let postdata = '_token=' + token;
            console.log( loadbt_logout_api ) //退出当前 loadbt 为下次注册住准备
            await myGetData( 'POST', loadbt_logout_api, postdata, loadbt_logout_headers )
                .then( response => {
                responsedata = response;
                console.log( responsedata )
            } );
            if ( responsedata.status === 200 ) {
                Notiflix.Notify.Success('激活 loadbt 账号成功')

            }
        }
    }


    async function loadbt () {
        tips ()
        if ( loadbt_password === '' || loadbt_share_url === ''){
            console.error( '错误 : 请输入必要参数')
            Notiflix.Loading.Arrows('错误 : 请输入必要参数');
            Notiflix.Notify.Failure('错误 : 请输入必要参数')
            return;
        }else {
            let timestamp = Date.parse( new Date() );
            username = ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4) + timestamp;
            mail = username + '@maiz.ca';
            maiz_inbox_url = 'https://inbox.maiz.ca/mailbox/'+mail;
            loadbt_register_url = 'https://www.loadbt.com/register?placeholder_email=' + username + '%40maiz.ca';
            await loadbt_register (loadbt_share_url);
        }
    }

    //let url = 'https://inbox.maiz.ca/mailbox/l6tj1584809071000@maiz.ca';
    //loadbt_activate_link(url)


    loadbt ()

    function wait ( timeoutms ) {
        return new Promise( ( resolve, reject ) => {
            function check (){
                console.warn('waitting')
                if((timeoutms -= 1000) < 0 )
                    resolve ()
                else
                    setTimeout(check, 1000)
            }
            setTimeout(check, 1000)
        } );
    }

    function wait_for_element ( timeoutms ) {
        return new Promise( ( resolve, reject ) => {
            function check (){
                var e = document.querySelector( '.signup__form-header > span' );
                var x = document.querySelector( 'div.authentication.login.slide-element' );
                console.warn('waitting')
                if ( e !== null ) {
                    resolve (true)
                }
                else if ( x !== null ) {
                    resolve (false)
                }
                else if (( timeoutms -= 1000 ) < 0) {
                    reject (console.warn('timed out!'))
                }
                else {
                    setTimeout( check, 1000)
                }
            }
            setTimeout( check, 1000)
        } );
    }


    function tips (){
        let head = document.getElementsByTagName("head")[0];
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "https://cdn.jsdelivr.net/npm/notiflix@2.1.2/dist/Minified/notiflix-2.1.2.min.css";
        head.appendChild(link);
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdn.jsdelivr.net/npm/notiflix@2.1.2/dist/Minified/notiflix-2.1.2.min.js";
        head.appendChild(script);

        Notiflix.Notify.Init({fontSize:"16px",timeout:60000,showOnlyTheLastOne:true});
        Notiflix.Report.Init();
        Notiflix.Confirm.Init();
        Notiflix.Loading.Init({svgColor:"#f60000",});
    }

    function ajax ( Method, Url, Data, Headers ){
        let p = new Promise(function(resolve, reject){
            GM_xmlhttpRequest( {
                url: Url,
                method: Method,
                data: Data,
                headers: Headers,
                ontimeout: function ( ) {
                    console.log( 'ontimeout')
                    reject()
                },
                onerror: function ( ) {
                    console.log( 'onerror')
                    reject()
                },
                onload: function ( response ) {
                    console.log( 'onload' )
                    setTimeout( function () {
                        resolve( response );
                    }, 2000 );
                }
            } );
        })
        return p
    }

    function myGetData(Method, Url, Data, Headers ) {
        return new Promise(function(resolve, reject) {
            function attempt () {
                ajax(Method, Url, Data, Headers).then( response => {
                    resolve(response);
                } ).catch(function(erro) {
                    attempt()
                })
            }
            attempt()
        })
    }

    // Your code here...
} )();
