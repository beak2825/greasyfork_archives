// ==UserScript==
// @name         mp4ba百度网盘自动保存
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  已更名为 mp4ba百度网盘一键保存
// @author       zsandianv
// @match        http://www.mp4ba.cc/*
// @match        http://mp4ba.cc/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/notiflix@2.1.3/dist/Minified/notiflix-2.1.3.min.js
// @connect      pan.baidu.com
// @downloadURL https://update.greasyfork.org/scripts/395793/mp4ba%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/395793/mp4ba%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let domparser = new DOMParser();
    let path = '/';//请自行修改
    //let url = document.querySelector('div.btn-group.cloud').children[0].href;
    //let pwd = document.querySelector('div.btn-group.cloud').children[1].innerText.split('：')[1];

    async function verifypwd ( url , pwd ) {
        let responsedata = [];
        let surl;
        let doc;
        console.log(5)
        await ajax( 'GET', url,'' , )
            .then( response => {
            responsedata = response;
            console.log( responsedata )
        } );
        doc = domparser.parseFromString( responsedata.responseText, "text/html" );
        if ( responsedata.status === 200 ){
            surl = responsedata.finalUrl.split('=')[1];
            let r = /yunData.setData\((.*?)\)/;
            r.exec( responsedata.responseText );
            let yunData = JSON.parse( RegExp.$1 );
            let queryData = {
                surl: surl ,
                t: (new Date()).valueOf() ,
                channel: 'chunlei' ,
                web: 1 ,
                app_id: '250528' ,
                bdstoken: yunData.bdstoken ,
                clienttype:0
            }
            let headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer': responsedata.finalUrl
            }
            let postData = 'pwd=' + pwd + '&vcode=&vcode_str=';
            let verifyurl = 'https://pan.baidu.com/share/verify?' + $.param(queryData);
            await ajax( 'POST', verifyurl , postData , headers )
                .then( response => {
                responsedata = response;
                console.log( responsedata )
            } );
            if ( JSON.parse( responsedata.responseText ).errno === 0 ) {
                saveFile ( url )
            } else{
                Notiflix.Notify.Failure('提取码验证失败')
            }
        }


    }




    async function checkUrl ( ) {
        console.log(1)
        tips ();
        let responsedata = [];
        let doc;
        let url;
        let pwd;
        let dow_con = $('div.btn-group.cloud');
        for (var i = 0; i < dow_con.length; i++) {
            if ( i === 0 ){
                url = $('div.btn-group.cloud:first')[0].children[0].href;
                pwd = $('div.btn-group.cloud:first')[0].children[1].innerText.split('：')[1];
            } else {
                url = $('div.btn-group.cloud:last')[0].children[0].href;
                pwd = $('div.btn-group.cloud:last')[0].children[1].innerText.split('：')[1];
            }
            await ajax( 'GET', url,'' , )
                .then( response => {
                responsedata = response;
                console.log( responsedata )
            } );
            doc = domparser.parseFromString( responsedata.responseText, "text/html" );
            if ( responsedata.status === 200 ){
                if ( responsedata.finalUrl === url ){
                    if (doc.getElementsByClassName("error-img").length !== 0 ){
                        console.log(2)
                        let btnToolHTML = '<a href="javascript:;" target="_self" class="btn btn-default btnbd">链接已失效</a>'
                        if ( i === 0){
                            $(btnToolHTML).appendTo('div.btn-group.cloud:first')
                        } else{
                            $(btnToolHTML).appendTo('div.btn-group.cloud:last')
                        }
                        continue;
                    }
                    else {
                        console.log(3)
                        let btnToolHTML = '<a href="javascript:;" target="_blank" class="btn btn-default btnbd">一键保存</a>'
                        if ( i === 0){
                            $(btnToolHTML).appendTo('div.btn-group.cloud:first').click(function () {
                                Notiflix.Notify.Warning('正在保存，请稍后...');
                                saveFile ( url );
                                return false;
                            });
                        } else{
                            $(btnToolHTML).appendTo('div.btn-group.cloud:last').click(function () {
                                Notiflix.Notify.Warning('正在保存，请稍后...');
                                saveFile ( url );
                                return false;
                            });
                        }
                    }
                }
                else if ( responsedata.finalUrl.indexOf("surl") !== -1 ){
                    console.log(4)
                    let btnToolHTML = '<a href="javascript:;" target="_blank" class="btn btn-default btnbd">一键保存</a>'
                    if ( i === 0){
                        $(btnToolHTML).appendTo('div.btn-group.cloud:first').click(function () {
                            Notiflix.Notify.Warning('正在保存，请稍后...');
                            verifypwd ( url , pwd);
                            return false;
                        });
                    } else{
                        $(btnToolHTML).appendTo('div.btn-group.cloud:last').click(function () {
                            Notiflix.Notify.Warning('正在保存，请稍后...');
                            verifypwd ( url , pwd);
                            return false;
                        });
                    }
                }
                else {
                    let btnToolHTML = '<a href="javascript:;" target="_self" class="btn btn-default btnbd">未知错误</a>'
                    Notiflix.Notify.Failure('未知错误')
                    if ( i === 0){
                        $(btnToolHTML).appendTo('div.btn-group.cloud:first')
                    } else{
                        $(btnToolHTML).appendTo('div.btn-group.cloud:last')
                    }
                }
            }
        }
    }



    async function saveFile ( url ) {
        console.log(6)

        let responsedata = [];
        let surl;
        let doc;
        let params = [];
        let fsidlist = [];
        await ajax( 'GET', url,'' , )
            .then( response => {
            responsedata = response;
            console.log( responsedata )
        } );
        doc = domparser.parseFromString( responsedata.responseText, "text/html" );
        let r = /yunData.setData\((.*?)\)/;
        r.exec( responsedata.responseText );
        let yunData = JSON.parse( RegExp.$1 );
        let queryData = {
            shareid: yunData.shareid ,
            from: yunData.uk ,
            channel: 'chunlei' ,
            web: 1 ,
            app_id: '250528' ,
            bdstoken: yunData.bdstoken,
            clienttype: 0
        }

        if (yunData['file_list']['list']){
            $.each(yunData['file_list']['list'], function (index, element) {
                fsidlist.push(element.fs_id)
            });
        }
        let option = {
            fsidlist: '[' + fsidlist.toString() + ']' ,
            path: path
        }
        let headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': url
        }
        let saveApi = 'https://pan.baidu.com/share/transfer?' + $.param(queryData);
        for ( let k in option ) params.push( `${encodeURIComponent(k)}=${encodeURIComponent(option[k])}` );
        let postData = params.join( '&' );
        await ajax( 'POST', saveApi , postData , headers )
            .then( response => {
            responsedata = response;
            console.log( responsedata )
        } );
        let data = JSON.parse( responsedata.responseText );
        if ( data.errno === 0 ) {
            Notiflix.Notify.Success('保存成功')
        }
        else if ( data.errno === 12 ){
            for (let i = 0; i < data.info.length; i++) {
                if ( data.info[i].errno === -30 ){
                    Notiflix.Notify.Failure('文件已存在')
                }
                else {
                    Notiflix.Notify.Failure('保存失败，请手动保存')
                }
            }
        }
        else {
            Notiflix.Notify.Failure('保存失败，请手动保存')
        }
    }








    checkUrl ( )


    function tips (){
        let head = document.getElementsByTagName("head")[0];
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "https://cdn.jsdelivr.net/npm/notiflix@2.1.3/dist/Minified/notiflix-2.1.3.min.css";
        head.appendChild(link);
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdn.jsdelivr.net/npm/notiflix@2.1.3/dist/Minified/notiflix-2.1.3.min.js";
        head.appendChild(script);

        Notiflix.Notify.Init({fontSize:"18px",timeout:3000,showOnlyTheLastOne:true});
        Notiflix.Report.Init();
        Notiflix.Confirm.Init();
        Notiflix.Loading.Init({svgColor:"#f60000",});
    }


    function ajax ( Method, Url, Data, Headers ) {
        return new Promise( ( resolve, reject ) => {
            GM_xmlhttpRequest( {
                url: Url,
                method: Method,
                data: Data,
                headers: Headers,
                onload: function ( response ) {
                    resolve( response );
                }
            } );
        } );
    }


    // Your code here...
})();