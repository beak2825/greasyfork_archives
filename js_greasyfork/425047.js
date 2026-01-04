// ==UserScript==
// @name         论坛移动端兼容性调整
// @namespace    www.sou-tong.org
// @version      0.0.28
// @description  移动端兼容性修固!
// @author       King
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/425047/%E8%AE%BA%E5%9D%9B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%85%BC%E5%AE%B9%E6%80%A7%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/425047/%E8%AE%BA%E5%9D%9B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%85%BC%E5%AE%B9%E6%80%A7%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==
/**********************************************\
 * 都2021啦，移动端都辣么的流行了，论坛还是上个世纪的排版吗？还不赶紧适配下？
 * 本脚本只适合移动端，当然啦，你在电脑上使用也是木有问题的~
 * 本脚本：不自动更新、不弹框、无广告、无远程控制
 * 当前源码无混淆，你可以修改并重新发布（注意：再次发布遇到问题将于本人无任何关系）
 * 欢迎大家提出宝贵的意见，我会继续保持更新
 * 一直在更新中
\************************************************/

(function() {
    var key = encodeURIComponent("st:stPlus:1");
    if (window[key]) {
        return;
    }

    try {
        var run = () => {
            window[key] = true;
            let pc = document.querySelector('#mn_forum a');
            let new_element = document.createElement("style");
            if (pc && pc.innerText.includes("搜 同")) {
                var viewportMeta = document.createElement('meta');
                viewportMeta.name = "viewport";
                viewportMeta.content = "width=device-width, user-scalable=no,initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0";
                document.getElementsByTagName('head')[0].append(viewportMeta);
                document.getElementById('myprompt') && document.getElementById('myprompt').addEventListener('click', e => e.preventDefault());

                new_element.innerHTML = `input,button,select,textarea{font-size:12px;}body #nv{background-image:none;}.ct2_a .mn{width:100%}body#nv_forum,body#nv_home{max-width:1200px;margin:0 auto;}#toptb,a#e_image,a#e_sml{display:none;}#qmenu{opacity:0;display:none;}div#e_button{float:none !important;}.wp{width:100%;}.ad>td{height:4px;}img[src='static/image/common/logo.gif'],#ip_notice{display:none;}#hd .wp,#wp{min-width:initial;}#pt{height:auto;}#ct div#diy_chart.area{margin-bottom:22px;}#scbar_form table{width:100%;}#scbar_txt{width:initial;}td.fl_i,td.fl_by,td.by,td.num{width:0;display:none;}.tl table tr th{width:100%;padding-right:0;}#postlist>table:first-child .plc .y{display:none;}#postlist{border-bottom:none;}.bm{border-left:none;border-right:none;}#postlist .plc .t_f img,#postlist .plc .tattl img{max-width:100%;height:auto;}#postlist>table:first-child .pls{display:none;}#postlist>table:first-child .plc{padding:10px 10px !important;}#postlist .pls{border:none;background:transparent;width:46px;text-align:center;border:none;}#postlist .plc{padding-left:12px;padding-right:12px;}#postlist .pi{border-bottom:none;margin-bottom:0px;}#postlist .pti .authi .authicn{display:none;}#postlist .pti .authi>.pipe,#postlist .pti .authi>a,#postlist .pti .authi>.none,#postlist .pti .authi>.xg1{display:none;}.pg_viewthread #pt .z>a:last-child,.pg_viewthread #pt .z>em:nth-last-child(2){display:none;}#f_pst .pls{display:none;}#ft{background:#F3F3F3;border-top:1px solid #E3E3E3 !important;color:#999;}#flk{float:none;text-align:center;}#frt,#flk .xs0{display:none;}#postlist .pls{width:46px;text-align:center;display:none;}#postlist .res-postfirst .pls{width:0;}#postlist .favatar.pls{position:initial !important;}#postlist .plc .t_fsz{min-height:30px;}#postlist .favatar.pls>*{display:none;}.ad .pls{background:#C2D5E3;padding:0;height:4px;}.pg_viewthread #newspecial,.pg_viewthread #post_reply,.pg_viewthread #newspecialtmp,.pg_viewthread #post_replytmp{display:none;}.pg>a{display:none;}.pg>strong+a,.pg>a:nth-last-child(3){display:inline;}.pg>a.nxt{display:block;font-size:0;padding-right:0;width:12px;background-position:center;}#pgt,.pgs{padding-left:8px;padding-right:8px;}#f_pst .plc{padding:5px 8px 0 8px;}.pg>.first,.pg>.prev,.pg>.prev+a,.pg>.last{display:inline;}#chart .chart.z,#chart .y{display:none;}#pt{padding-left:5px;height:auto;}#thread_types.ttp{border:none;padding:0 0 0 8px;}.tl .tps,.tl .tps+a.xi1,.tl .res-ti+a.xi1{display:none;}.xst{word-break:break-all;}.pg{float:right;}.pg label{padding-left:4px;padding-right:4px;}td[id^=postmessage_]{font-size:1rem;}.pgb a{padding-left:15px;padding-right:5px;margin-left:0;background-position:1px 50%;}#f_pst{border-bottom:none;}.bm,.bn{margin-bottom:10px;}.boardnav #ct .bm_h .xs1.xw0{display:none;}.appl{float:none;}.ct2_a{display:flex;flex-wrap:wrap-reverse;padding-left:0;background:none;border:none;}#ct.ct2_a{min-height:auto;}.ct2_a .appl{display:inline-block;box-sizing:border-box;width:100%;margin:3px 0 5px 0;background:#F6F6F6;border:none;}.appl .tbn .bbda{background:#F0F0F0;margin-bottom:3px;text-align:center;font-weight:normal;border-bottom:none;}.ct2_a .appl .tbn li{border:none !important;float:left;}.tbn ul a{display:inline-block;}.ct2_a .appl .tbn li a{color:#777;}.ct2_a .appl .tbn li{border:none !important;float:left;}.ct2_a .appl .tbn li.a{font-weight:bold;margin-top:0;background:none;}.ct2_a .appl .tbn li.a a{color:#444;}.tb a{padding-left:7px;padding-right:7px;}#diy_chart>div{width:100%;overflow-y:hidden;overflow-x:auto;white-space:nowrap;}#diy_chart>div>div{display:inline-block;width:initial;float:none;}#diy_chart>div>div>div:nth-child(2)>div{width:305px;display:inline-block;float:none;}#diy_chart>div>div:first-child>div:nth-child(2)>div:first-child{width:246px;}div#e_attach_menu,div#e_pasteword_menu{width:100% !important;left:auto !important;max-width:600px;top:calc(50% - 291px) !important;}tbody[id^=normalthread_] .common,tbody[id^=stickthread_] .common,tbody[id^=stickthread_] .lock,tbody[id^=normalthread_] .new,tbody[id^=normalthread_] .lock{padding:12px 0;}tbody[id^=normalthread_] .common a,tbody[id^=normalthread_] .new a{font-size:16px;line-height:28px;}blockquote{margin:0;}.pl .quote,.pl .blockcode{padding:10px 10px 10px 48px !important;}.pl .quote blockquote{padding:0 26px 5px 0 !important;}div#imgzoom{left:initial !important;}.zimg_prev,.zimg_next { width: 50% !important; }#postlist .pti .authi>a.xw1:first-child{display:inline-block;}`;
                document.body.appendChild(new_element);

                let new_element2 = document.createElement("style");
                new_element2.innerHTML = `div#editorbox{width:100%;}div#e_button{float:none !important;overflow-y:hidden;overflow-x:auto;white-space:nowrap;}.edt .b1r,.edt .b2r{float:none !important;display:inline-block;vertical-align:top;}div#e_controls{min-width:auto !important;}span#subjectchk{display:block;}div#e_url_menu,div#e_at_menu,div#e_quote_menu,div#e_code_menu,div#e_index_menu,div#e_free_menu,div#e_tbl_menu,div#e_cst1_qq_menu{left:50% !important;margin-left:-135px;}div#e_postbg_menu{left:50% !important;margin-left:-167px;}`;
                new_element2.innerHTML = `${new_element2.innerHTML} .mn .bw0 .bm_c th{font-size:0.8rem;padding:12px 0;}.mn .bw0 .bm_c tr>td:nth-child(3){width:62px;}div[id^='subforum_']{overflow-x:auto;}#fwin_reply .m_c .tedt{width:100%;}#fwin_reply .m_c .quote{width:100%;}`;
                document.body.appendChild(new_element2);
            } else {
                let getMobileNum = () => {
                    var search = document.location.search;
                    let matcher = new RegExp("[?&]mobile\=([^&]+)", "g").exec(search);
                    let items = null;
                    if (null != matcher) {
                        try {
                            items = decodeURIComponent(decodeURIComponent(matcher[1]));
                        } catch (e) {
                            try {
                                items = decodeURIComponent(matcher[1]);
                            } catch (e) {
                                items = matcher[1];
                            }
                        };
                    };
                    return items;
                };
                let mobileNum = getMobileNum();
                let pcS = document.getElementsByClassName("user_fun");
                if ((mobileNum && mobileNum === "2") || (pcS && pcS.length > 0)) {
                    let fdiv = document.createElement('div');
                    let fa = document.createElement('a');
                    fa.href = "javascript:;";
                    fa.id = 'footer_dump';
                    fa.innerText = "插件提示您：需要跳转到移动端适配吗?";
                    fdiv.appendChild(fa);
                    document.getElementsByClassName("footer")[0].appendChild(fdiv);
                    new_element.innerHTML = (`a#footer_dump{color:#89bf58;font-size:18px;display:inline-block;margin:20px auto 25px;text-decoration:underline;}`);
                    document.body.appendChild(new_element);
                    fa.addEventListener('click', function() {
                        window.location.href = "/index.php?mobile=no";
                    });
                };
            };
            let categoryMs = document.querySelectorAll('a');
            categoryMs = Array.from(categoryMs);
            categoryMs.forEach(categoryM => {
                let href = categoryM.getAttribute('href');
                if (/fid=\d+/.test(href) && /mod\s*=\s*forumdisplay/.test(href) && !/separatorline/.test(href)) {
                    categoryM.setAttribute('href', `${href}#separatorline`);
                }
            });

            let normalthrads = document.querySelectorAll(`table tbody[id^='normalthread_'] a.xst`);
            normalthrads = Array.from(normalthrads);
            normalthrads.forEach(normalthrad => {
                normalthrad.addEventListener('click', function() {
                    normalthrad.setAttribute('style', `color:#da00ff;font-weight:700;text-decoration:line-through;`);
                });
            });
            let posts = document.querySelectorAll('#postlist table[id^=pid]');
            posts = Array.from(posts);
            posts.forEach(post => {
                let getAuthor = post.querySelectorAll('.authi');
                if (getAuthor && getAuthor.length > 1) {
                    let innerImg = getAuthor[1].getElementsByTagName('img')[0];
                    getAuthor[1].insertBefore(getAuthor[0].getElementsByTagName('a')[0], innerImg);
                };
            });
        };

        document.onreadystatechange = function() {
            if (document.readyState != "loading") {
                console.log(document.readyState);
                !window[key] && run();
                return;
            };
        };
    } catch (err) {
        console.log('stBBS', err);
    }
})();