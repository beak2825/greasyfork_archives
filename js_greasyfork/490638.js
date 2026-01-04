// ==UserScript==
// @name         清爽下载
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  不要“安全下载”，要那么安全干嘛？
// @author       cw2012
// @match        https://www.pcsoft.com.cn/soft/*.html
// @match        http*://www.downza.cn/soft/*.html
// @match        https://www.duote.com/soft/*.html
// @match        http*://www.ddooo.com/softdown/*.htm
// @match        http*://www.onlinedown.net/soft/*.htm
// @match        http*://www.qqtn.com/down/*.html
// @match        http*://www.xiazaiba.com/html/*.html
// @match        http*://www.xz7.com/downinfo/*.html
// @match        http*://www.cr173.com/soft/*.html
// @match        http*://www.jb51.net/softs/*.html
// @connect      *
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/490638/%E6%B8%85%E7%88%BD%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/490638/%E6%B8%85%E7%88%BD%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url, id,btnQueryStrArray,eleToHideQueryStrArray, hotNewsQueryStrArray;
    let btnStyle;
    switch(location.hostname.replace('www.', '')){
        case 'pcsoft.com.cn':
            d_pc();
            break;
        case 'downza.cn':
            d_downza();
            break;
        case 'duote.com':
        case 'duote.com':
            d_duote();
            break;
        case 'ddooo.com':
            d_ddoo();
            break;
        case 'onlinedown.net':
            d_huajun();
            break;
        case 'qqtn.com':
            d_qqtn();
            break;
        case 'xiazaiba.com':
            d_xzb();
            break;
        case 'xz7.com':
            d_xz7();
            break;
        case 'cr173.com':
            d_xxrj();
            break;
        case 'jb51.net':
            d_jb51();
            break;
    }
    // 通用的处理方法
    function download(url){
        let a = document.createElement('a');
        a.onclick = ()=>{
            window.open(url,"_blank");
        };
        a.click();
    }
    function find(s, b){
        if(b)
            return document.querySelector(s);
        else return document.querySelectorAll(s);
    }
    // 下载按钮，下载链接， 是第一个元素且要保留其他按钮， 要隐藏的元素，其他要处理的方法
    function commonManage(f, btn_d, b_firstEle, url_d, cs_hide){
        if(f){
            f();
        }
        if(b_firstEle){
            let tmp = find(btn_d, 1);
            if(url_d[0] === null){
                tmp.onclick = null;
                if(tmp.tagName.toLowerCase() === 'a'){
                    tmp.href=null;
                }
                tmp.onclick = () => {
                    download(url_d[0]);
                }
            }
        }else{
            let tmp = find(btn_d);
            for(let item of tmp){
                item.onclick = null;
                item.style.display = 'none';
            }
            tmp[0].style.display = 'block';
            tmp[0].onclick = () => {
                download(url_d[0]);
            }
            if(tmp[0].tagName.toLowerCase() === 'a'){
                tmp[0].href=null;
            }
        }
        for(let item of cs_hide){
            // document.querySelector(item).style.display = 'none';
            let tmp =find(item, 1);
            if(tmp)
                tmp.remove();
        }
    }

    function d_pc(){
        let a = find('.xzdz.bddown.godown', 1);
        a.onclick = null;
        find('.xzdzbox', 1).style.display = 'none';
        a = find('.download_n>dd>a:first-child');
        let url = [a[0].href];
        commonManage(null,
                     '.xzdz.bddown.godown',
                     true,
                     [url],
                     ['.xgydbox', '#cybox', '.cyboxList', '.wrap_rg', '.sytjbox', '.list_rg', '.xianssort']
                    );
    }

    function d_downza(){
        let url = find('.con>a.qrcode_show', 1).href
        commonManage(null,
                     '.u-btn-box>a:first-child',
                     true,
                     [url],
                     ['#m-xzdz','.u-btn-box>a:nth-child(2)', '.links', '.guess-box', '.m-gg1', '.m-coll1-right','#m-xgwz', '#m-tags', '#m-rjzt']
                    );
    }

    function d_duote(){
        commonManage(null,
                     '.df.down-btns>a:first-child',
                     true,
                     [find('.df.down-btns>a:first-child', 1).href],
                     ['.app-right', '.app-method', '#app-topic', '#app-comm', '.df.down-btns>a:nth-child(2)', '.bottom-fixed .limit-width.center>a.dow-high', '.bottom-box a.high-btn']
                    );
    }
    function d_ddoo(){
        commonManage(null,
                     '.ptbtn',
                     true,
                     [find('.pt_list>li:nth-child(2)>a', 1).href],
                     ['#pltab', '.right.main-right', '.Relevantsoft', '.left', '.DownloadSfot']
                    );
    }
    function d_huajun(){
        commonManage(null,
                     '.param-content>.down-box>a',
                     true,
                     [find('.down-list>div:nth-child(2) a:first-child', 1).href],
                     ['#downBox','.tags','.sw-param-right','.relation-article-box','.m-other-right','.down-box>a:nth-child(odd)','.g-bottom-banner .down-box>a:nth-child(2)','.m-con-right', '.bdtg-box']
                    );
    }
    function d_qqtn(){
        commonManage(null,
                     '.m-down-btn>.m-down-link',
                     true,
                     [find('.u-down-list ul>li>a:first-child', 1).href],
                     ['#down-mian','.g-tltj','.g-hotico','.g-rj-right.f-fr','.m-soft-relat','.m-like-box','.g-article','#goto-pl']
                    );
    }
    function d_xzb(){
        commonManage(null,
                     '#base_download_once',
                     true,
                     [find('.sdown-btns>a:first-child', 1).href],
                     ['.boxMod:nth-child(even)','.pb30.boxMod.mt20', '.wt300.rf']
                    )
    }
    function d_xz7(){
        commonManage(null,
                     '.art-detail.fix .btn-dl',
                     true,
                     [find('.m-art-dl ul.media>li>a:first-child', 1).href],
                     ['.m-art-dl','.J_tab_cont.company','.m-excellent','.art-main ul.info-tab>li:nth-child(2)','.art-main ul.info-tab>li:nth-child(2)','.art-main ul.info-tab>li:nth-child(2)', '.m-comment', '.m-related-list','.m-related-link', '.s-soft-art .m-side-col', '.m-side-col']
                    )
    }
    function d_xxrj(){
        commonManage(()=>{
            let btn = find('.maindown_w4>a', 1);
            btn.style.positon = 'relative';
            btn.style.top='-150px';
            btn.style.left='550px';
        },
                     '.maindown_w4>a',
                     true,
                     [find('ul.ul_Address>li>a:first-child', 1).href],
                     ['#xiangua','#download','.c_soft_button', '#class-soft','#class-cms','#comment_list','#downhelp', '.c_info_side', '.c_soft_same.m-soft-relat','.m-goklist', '.m-key-link', '#content>.g-add-version']
                    )
    }
    function d_jb51(){
        commonManage(()=>{
            let btn = find('#xzbtn>a:first-child',1);
            btn.style.display = 'none';

            let a = document.createElement('a');
            a.innerText = ' ';
            a.style.display = 'block';
            a.style.width = '300px';
            a.style.height = '80px';
            a.style.position = 'relative';
            a.style.cursor= 'pointer';
            a.style.top='-150px';
            a.style.left='550px';
            a.setAttribute('itemprop',null);
            a.onclick = find('ul.ul_Address>li>a:first-child', 1).onclick;
            a.style.background = 'url(//img.jbzj.com/skin/downsoft/2018/Images/softsbtn.png) no-repeat';
            find('#xzbtn', 1).append(a);
        },
                     '#xzbtn>a:first-child',
                     true,
                     [null],
                     ['#samesoft','#xzbtn>a.gsdw', '#xzbtn>a.Acnowk','.ptjc', '#down1','.main-right','#header>.fl','#header>.fr', '#tldown', '#suoluetu', '.c_soft_same.m-soft-relat','.m-goklist', '.m-key-link', '#content>.g-add-version']
                    )
    }
})();