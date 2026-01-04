// ==UserScript==
// @name        CzTorrent+
// @namespace   cztorrent_reloaded
// @include     https://tracker.cztorrent.net*
// @version     0.99200320
// @author      Nidecker
// @grant       unsafeWindow
// @run-at document-start
// @description Dark mode, image lightbox,
// @downloadURL https://update.greasyfork.org/scripts/407379/CzTorrent%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/407379/CzTorrent%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var darkMode,
        imagesOverlay,
        forumTemplates,
        forumTemplatesSelect,
        uploadTemplates,
        uploadTemplatesSelect,
        darkStyle,
        userId = false,
        sessionUserId = false,
        switcher = '';
    //TODO: seedpage (thanks); thanks on torrent detail via ajax

    function ready(czt_init) {
        handleStyleCreation();
        if (document.readyState !== 'loading'){
            czt_init();
        } else {
            document.addEventListener('DOMContentLoaded', czt_init);
        }
    }

    function init() {
        setTimeout(function () {
            createSwitcher(switcher);
            if (darkMode)
                handleStyleDifferences();
            if (window.location.pathname.indexOf('/torrents') !== -1) {
                handleClickableCategories();
                markNewTorrents();
                createLastVisitItem();
            }
            // TODO: setSessionID();
            if (window.location.pathname.indexOf('/torrent/') !== -1) {
                createEmptyOverlay();
                handleImageOverlays();
            }
            if (window.location.pathname.indexOf('forum/newtopic') !== -1 || window.location.pathname.indexOf('forum/addpost') !== -1) {
                handleForumTemplates();
            }
            if (window.location.pathname.indexOf('upload/') !== -1) {
                handleUploadTemplates();
            }
        }, 500);

    }

    function createLastVisitItem() {
        setTimeout(function(){
            localStorage.setItem('lastVisit', Date.now().toString());
        }, 8000);
    }

    function handleStyleCreation() {
        darkStyle = document.createElement("style");
        darkStyle.id = "darkMode";
        darkStyle.type = "text/css";
        darkStyle.innerText = getStyle();

        let dark = localStorage.getItem('darkMode');
        darkMode = false;
        if(dark !== null) {
            darkMode = true;
            if (document.head) {
                document.head.appendChild(darkStyle);
            } else {
                setTimeout(function () {
                    document.head.appendChild(darkStyle);
                }, 200)
            }
            switcher = 'checked=checked';
        }
    }

    function createSwitcher(checkBox) {
        let switcher = "<style" +
            " type='text/css'>.switch{position:absolute;top:10px;right:10px;display:inline-block;width:60px;height:34px}.switch input{display:none}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;-webkit-transition:.4s;transition:.4s}.slider:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;-webkit-transition:.4s;transition:.4s}input:checked+.slider{background-color:#2D5365}input:focus+.slider{box-shadow:0 0 1px #2196F3}input:checked+.slider:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}td.detaily > a:visited{ color: #999999 !important;}#zoomIn:hover,#zoomOut:hover{cursor:pointer;border:1px solid #999 !important}</style>" +
            "<label class=\"switch\">" +
            "<input "+checkBox+" type=\"checkbox\">" +
            "<span class=\"slider round\"></span>" +
            "</label>";
        let wrapper = document.createElement('div');
        wrapper.innerHTML = switcher;
        document.body.appendChild(wrapper);

        document.querySelector('span.slider').addEventListener('click', switchDarkMode);
    }

    function getStyle() {
        return "body{ background-color:#202020;background-image:none;color:#d2d2d2}"+
            "#footer_shadow{ display:none;}"+
            "div.block,#shoutbox_new_smiles{ background-color:#3c3b36 !important;border:1px #232323 solid !important;}"+
            "#torrenty tr.torr_hover:hover,#image_upload #list .image:hover,#image_upload ul.categories li,#image_upload ul.categories li:hover{ background-color:#363636 !important;}"+
            "a{ color:#64b3d6;}"+
            "a:hover{ color:#7ec8e9;}"+
            "#torrenty td.detaily a{ color:#d2d2d2;}"+
            "td.detadily > a:visited{ color:#f0f0f0;}"+
            "#torrenty tr:hover td.detaily span{ color:#b7b7b7;}"+
            ".user_menu_top,.user_menu_bottom{background:#232323;border-right: none;border-bottom: none;}"+
            ".user_menu_bottom{border-top:none;}"+
            "#users_stats #user_panel,#user_forum .panel{ background:#232323;}"+
            "#user_forum .panel{ border:1px #5c5952 solid;}"+
            "#users_stats #tracker_stats th:nth-child(2n){ background-image:none;background: #292929;}"+
            "#users_stats #tracker_stats td:nth-child(2n){ background-image:none;background: #292929;}"+
            "#users_stats #tracker_stats,ul.top_menu ul.kask_menu li a{ background-image:none;}"+
            "#users_stats #user_panel dl dd a{ color:#64b3d6;}"+
            "#users_stats{ background:#232323;}"+
            "#content{ background:#232323;}"+
            ".user_menu_top div:last-child,.user_menu_bottom div:last-child{ background:none;}"+
            "#torrenty tr.popisy a,div.code,#seedbonus table.inf tr.head td{ color: #999999;}"+
            "p.pager a{ color:#d2d2d2;background: #3c3b36;border:1px #5c5952 solid}"+
            "p.pager a.on{ border:1px #5c5952 solid;background: #44423d;}"+
            "p.pager a:hover{ background: #44423d;}"+
            "input, select, textarea{ color: #e3e3e3;background: #363636;}"+
            "select, textarea{ background: #363636 !important;}"+
            "#torrenty td.categorie, #torrenty td.download, #torrenty td.detaily, #torrenty td.shortdesc, #torrenty td.coment, #torrenty td.peers, #torrenty td.edit{ border-bottom: 1px #44423d solid;}"+
            ".overdiv{ background: #3c3b36;border: 1px #5c5952 solid !important;}" +
            "#bottom_menu,#footer{ background: #2d5365;}" +
            "#conteiner{ background: #2d5365;border: none;width: 872px;}"+
            ".n_button,.n_button:hover{ -moz-box-shadow: inset 0px -3px 7px 0px #29bbff;"+
            "-webkit-box-shadow: inset 0px -3px 7px 0px #29bbff;"+
            "box-shadow: inset 0px -3px 7px 0px #29bbff;"+
            "background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #58a9d1), color-stop(1, #4486a4));"+
            "background: -moz-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: -webkit-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: -o-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: -ms-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: linear-gradient(to bottom, #58a9d1 5%, #4486a4 100%);"+
            "background-color: rgba(0, 0, 0, 0);"+
            "filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#58a9d1', endColorstr='#4486a4',GradientType=0);"+
            "background-color: #4486a4;"+
            "-moz-border-radius: 3px;"+
            "-webkit-border-radius: 3px;"+
            "border-radius: 3px;"+
            "border: none;"+
            "color: #fff;"+
            "text-decoration: none;"+
            "text-shadow: 0px 1px 0px #263666;}"+
            ".n_button:hover{ -webkit-box-shadow: inset 0px -2px 7px 0px #29bbff;box-shadow: inset 0px -2px 7px 0px #29bbff;}"+
            "#shoutbox_new .box{ background-color: #3c3b36 !important;border: 1px #656565 solid !important;}"+
            "#shoutbox_new .post{ border-bottom: 1px #44423d solid !important;}"+
            "#shoutbox_new input.msg{ border: 1px #656565 solid !important;}"+
            "#shoutbox_new .new_post {background-color:#363636;}" +
            "div.headline{ background: none;}"+
            ".hp_favorite .fav{ background: #474641;border: 1px #393939 solid;}"+
            ".hp_favorite .fav:hover{ background: #41403c}"+
            "#forum table.blocks tr.topic_2{ background-color: #232323;}"+
            "#forum table.blocks tr.topic_1{ background-color: #292929;}"+
            "#forum table.blocks tr.topic_1:hover,#forum table.blocks tr.topic_2:hover{ background-color: #363636;}"+
            ".fce_panel{ background-color: #232323;}"+
            "#forum tr.topic_1 span.new,#forum tr.topic_2 span.new,#forum tr.thread_1 span.new,#forum tr.thread_2 span.new{ background-image: url('data:image/png;base64,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');}"+
            "#forum span.seen{ margin: 0;}"+
            ".fce_panel_top,#forum table.blocks tr.main_topic td{ border-bottom: none;}"+
            "#forum table.blocks tr.main_topic td,#forum table.blocks td.name a{ color: #d2d2d2;}"+
            ".torrent_descr_block,.editor,.editor .funkce #fce_text,.input_text,#posta .incoming .subject," +
            "#posta .new #write_pm .for,#comments table .watch .right,#comments table .watch .left," +
            "#comments table .main_line .right,#comments table .post .right,#comments table .watch .left," +
            "#comments table .post .left,#comments table .main_line .left,#comments table .pager .right,#comments table .pager .left,#posta .zaplneni_archivu{ background: #3c3b36 !important;}"+
            "table.editor_subject .input_text{ border-color: #44423d;}"+
            ".editor textarea{ background: #363636;border: 1px #44423d solid;}"+
            "input.button,input.initComments{ -moz-box-shadow: inset 0px -3px 7px 0px #29bbff;"+
            "-webkit-box-shadow: inset 0px -3px 7px 0px #29bbff;"+
            "box-shadow: inset 0px -3px 7px 0px #29bbff;"+
            "background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #58a9d1), color-stop(1, #4486a4));"+
            "background: -moz-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: -webkit-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: -o-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: -ms-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: linear-gradient(to bottom, #58a9d1 5%, #4486a4 100%);"+
            "background-color: rgba(0, 0, 0, 0);"+
            "background-color: rgba(0, 0, 0, 0);"+
            "filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#58a9d1', endColorstr='#4486a4',GradientType=0);"+
            "background-color: #4486a4;"+
            "-moz-border-radius: 3px;"+
            "-webkit-border-radius: 3px;"+
            "border-radius: 3px;"+
            "border: none;"+
            "color: #fff;"+
            "text-decoration: none;"+
            "text-shadow: 0px 1px 0px #263666;}"+
            ".editor .nahled,.editor .odeslat{ text-align: center;font-size: 9pt}"+
            "#torrent_descr > div,#shoutbox_new .settings,#upload .guide,#upload div.nahled{ background-color: #3c3b36!important;}"+
            "#torrent_details dl dd a{color: #fff;}"+
            ".progrs, #upload div.nahled p{border-bottom: 1px #44423d solid;}"+
            "#upload .cancel_upload {border-top: 1px #44423d solid;}"+
            "a.stahnout,a.reseed,input.nahled,input.odeslat{ -moz-box-shadow: inset 0px -3px 7px 0px #29bbff;"+
            "-webkit-box-shadow: inset 0px -3px 7px 0px #29bbff;"+
            "box-shadow: inset 0px -3px 7px 0px #29bbff;"+
            "background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #58a9d1), color-stop(1, #4486a4));"+
            "background: -moz-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: -webkit-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: -o-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: -ms-linear-gradient(top, #58a9d1 5%, #4486a4 100%);"+
            "background: linear-gradient(to bottom, #58a9d1 5%, #4486a4 100%);"+
            "background-color: rgba(0, 0, 0, 0);"+
            "filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#58a9d1', endColorstr='#4486a4',GradientType=0);"+
            "background-color: #4486a4;"+
            "background-image: none !important;"+
            "-moz-border-radius: 3px;"+
            "-webkit-border-radius: 3px;"+
            "border-radius: 3px;"+
            "border: none;"+
            "color: #fff;"+
            "padding: 2px 0;"+
            "height: unset;"+
            "text-decoration: none;"+
            "text-shadow: 0px 1px 0px #263666;}"+
            "#forum table.threads tr.thread_name td,#forum table.threads a,#forum table td.post div.upraveno,#forum table.threads a.date{ color: #999999;}"+
            "#forum table.post_1,#posta ul,#posta .incoming,#posta .incoming table tr.detaily,.progrs a,table.form td.left," +
            ".gray_menu div,.gray_menu .empty,.gray_menu,.blue_menu .empty,.blue_menu div,.blue_menu,table.table td," +
            "#stats .graph_table .scale_lines,#stats .graph_table,#stats .graph_name,#support .round_top,#support .round_bottom," +
            "#support .option,#support table td,.editor .funkce_font,.editor .funkce_size,.editor .funkce_field,.editor .funkce_fontcolor,.editor .funkce_symbs,.editor .funkce_smile,.editor .funkce_bgcolor{ background-color: #3c3b36;}"+
            "#forum table.post_2,.progrs a.act,.progrs a:hover,.progrs a.act:hover{ background-color: #353430;}"+
            "#posta ul li a.aktiv,#posta ul li a:hover,#posta .incoming table tr.old:hover,.gray_menu div a:hover," +
            ".blue_menu div a:hover,#users_list table tr.uzivatel:hover,#support .option:hover,#support table tr.head_lines td," +
            "#support table tr.head_lines td:hover,#support table tr:hover td,#posta .incoming table tr.new,#posta .incoming table tr.new:hover,.editor .funkce_symbs div:hover{ background-color: #363636;}"+
            "#forum table.threads tr.thread_1{ background-color: #232323;}"+
            "#forum table.threads tr.thread_2{ background-color: #292929;}"+
            "#forum table.threads span,#posta ul li a,.progrs a,.progrs a:hover,.gray_menu div a,.blue_menu div a{ color: #d2d2d2;}"+
            "div.quote,div.code{ background-color: #4a4944 !important;border: 1px #353431 solid !important}"+
            "div.quote{ background-image: url(\"https://cdn.cztorrent.net/image/original/QgN0rbkA7TFjedzj\") !important;background-size: 25px;}"+
            "div.code{ background-image: url(\"https://cdn.cztorrent.net/image/original/vJFSDBI9ErcdL8UL\") !important;background-size: 40px;}"+
            "a.bookms_star, a.bookms_star_act{ background-image: url(\"https://cdn.cztorrent.net/image/original/gZunrMk-5j0-9H1j\");}"+
            "#posta ul li a.aktiv,#posta ul li a,#comments table .post .left{ border: none;}"+
            "#posta .incoming,.n_select,.progrs a,.progrs a.act,#posta .new #write_pm .for .input_text,#posta .new,#image_upload ul.categories li{ border: 1px #44423d solid;}"+
            "#posta .incoming table tr.detaily td,#posta .incoming table tr.old td,table.form td{ border-bottom: 1px #44423d solid;}"+
            "#forum table td.post div.podpis{ border-top: 1px #44423d solid;}"+
            "#forum table td.user div{ border-right: 1px #44423d solid;}"+
            "#forum table td.post div.time,#forum table.threads tr.thread_name td,#forum table.threads{ border-bottom: 1px #44423d solid;}"+
            "#forum table.post_1,#forum table.post_2,.gray_menu,.blue_menu,#support .round_top,#support .round_bottom,#support .option{ border: none;}"+
            "table.table tr.borders td{ border-left: 1px #44423d solid;border-right: 1px #44423d solid;}"+
            "table.table tr.header_borders td{ background-color: #363636;border: 1px #44423d solid;}"+
            "#support .round_top,#support .round_bottom,#support table tr.head_lines td,#support table tr.head_lines td:hover,#bottom_menu,#footer{ background-image: none;}"+
            "#support table tr.head_lines td,#support table td,#support table tr:hover td,#support table tr:hover td.ops{ border-bottom: 1px #44423d solid;}"+
            ".forum_last_topics a.ellipsis strong{ color: #7dcaec;}"+
            ".forum_last_topics a.ellipsis strong:hover{ color: #64b3d6;}"+
            "#comments table .watch .right,#comments table .watch .left{ border-bottom: 6px #3c3b36 solid}"+
            "#comments table .main_line .right,#comments table .main_line .left,#comments table .post .right,#comments table .pager .left,#comments table .pager .right,ul.top_menu ul.kask_menu li a{ border: none}"+
            "#comments table .watch .left{ border-right: 1px #3c3b36 solid;}"+
            "#comments table .pager .left{ border-right: none}"+
            "#caution p.red{ border-top: 5px #b00c00 solid;background-color: #2d5365;}"+
            "#image_upload #list .image{ color: #d2d2d2;border: 1px #44423d solid;background-color: #3c3b36;}"+
            "#image_upload #detail .info table .fo td{ color: #82C1DD;}"+
            "#image_upload .addCategory input.text,#image_upload .listCategories div input.text{ border: 1px solid #999999;}"+
            "div.header_cz{ background-image: url(\"https://cdn.cztorrent.net/image/original/Ea1Wr4nYFtAYaXXH\");border-top-right-radius: 65px;border-top-left-radius: 65px;}"+
            "#header a.domu_cz,#header a.torrenty_cz,#header a.upload_cz,#header a.statistika_cz,#header a.uzivatele_cz,#header a.forum_cz{ background-image: none;}"+
            "#header a.domu_cz:hover,#header a.torrenty_cz:hover,#header a.upload_cz:hover,#header a.statistika_cz:hover,#header a.uzivatele_cz:hover,#header a.forum_cz:hover{ background: rgba(45, 83, 101,.5);border-top-left-radius: 10px;border-top-right-radius: 10px;}"+
            "ul.top_menu li.right,ul.top_menu li.left,ul.top_menu{ background: none;}"+
            "ul.top_menu{ border: 1px solid #527483}"+
            "#conteiner ul.top_menu,#conteiner #users_stats,#conteiner #content,#conteiner #content .user_menu_top,#conteiner #content .user_menu_bottom{ border-radius:10px}"+
            "ul.top_menu li a:hover,ul.top_menu ul.kask_menu li a{ background: #1f475e;}"+
            "ul.top_menu ul.kask_menu li a:hover{ background: #305565;}"+
            "#caution{ width: 870px;border: 1px #82c1dd solid;background-color: #b00c00;}"+
            "#posta .incoming table tr.new td{ border-bottom: 1px #44423d solid;}"+
            "#seedbonus .limit,#seedbonus .limitt,#seedbonus .limittt,#torrent_details #zdravi #health,#posta .zaplneni_archivu .backgr{ background-image: url(\"https://cdn.cztorrent.net/image/original/yB90Hkv4QTfbrTFM\");}"+
            "#torrent_seed table td[style=\"color:black\"],#torrenty td.peers{ color:#999999 !important;}"+
            "#user_forum .path{ background-color: #202020;border-top: 1px #5c5952 solid;border-bottom: 1px #5c5952 solid;}"+
            "#user_forum .post{ background-color: #3c3b36;border-bottom: 1px #5c5952 solid;}"+
            "#peers tr.b{ background-color: #32312d;}"+
            "#peers tr.my{ background-color: #1e1e1e;}"+
            "#torrenty span.peers_1{ color: #e90d0d;}"+
            "#torrenty span.peers_2{ color: #dd902d;}"+
            "#torrenty span.peers_3{ color: #c6c400;}"+
            "#torrenty span.peers_4{ color: #389500;}"+
            "#torrenty span.peers_5{ color: #4cc800;}"+
            "#torrenty span.peers_6{ color: #5ef800;}"+
            "img.half{border:5px solid #fff;border-radius:10px;height:auto;max-height:50%;width:auto;max-width:50%}"+
            "img.full{border:5px solid #fff;border-radius:10px;width:100%}"+
            "a.button{background-image:none;background:linear-gradient(to bottom, #58a9d1 5%, #4486a4 100%)}" +
            "a.button:hover{background:linear-gradient(to bottom, #64accf 5%, #5f98b1 100%)}" +
            "a.button span{background-image:none;color:#fff;text-shadow: 0px 1px 0px #263666;}" +
            "#shoutbox_new .post strong:hover{background-color: #555 !important;}" +
            "#rating{background-image: url('https://cdn.cztorrent.net/image/original/nqn84ZJoxA0HXyrA');}";
    }

    function switchDarkMode() {
        if(darkMode) {
            localStorage.removeItem('darkMode');
            document.getElementById('darkMode').remove();
            darkMode = false;
        } else {
            localStorage.setItem('darkMode', '1');
            document.head.appendChild(darkStyle);
            darkMode = true;
        }
    }

    function handleStyleDifferences() {
        if (document.querySelector('a.stahnout'))
            document.querySelector('a.stahnout').textContent = 'Stáhnout';
        if (document.querySelector('a.reseed'))
            document.querySelector('a.reseed').textContent = 'Reseed';
        if (document.querySelector('input.nahled'))
            document.querySelector('input.nahled').value = 'Náhled';
        if (document.querySelector('input.odeslat'))
            document.querySelector('input.odeslat').value = 'Odeslat';
        if (document.querySelector('.shortdesc img')) {
            let descriptionImages = document.querySelectorAll('.shortdesc');
            for (var i = 0; i < descriptionImages.length; i++) {
                if (descriptionImages[i].children[0])
                    descriptionImages[i].children[0].setAttribute('src', 'https://cdn.cztorrent.net/image/original/DHZQxWEafx2mm13g');
            }
        }
        if (document.querySelector('#torrent_details')) {
            let items = document.querySelectorAll('#torrent_details #right dd');
            if (items[items.length-1].children[0])
                items[items.length-1].children[0].setAttribute('src', 'https://cdn.cztorrent.net/image/original/DHZQxWEafx2mm13g');
        }
    }

    function handleClickableCategories() {
        let category = document.querySelectorAll("td.categorie");
        for (var j = 0; j < category.length; j++) {
            if (category[j].innerText === 'Aplikace')
                category[j].innerHTML = '<a href="/torrents?c22=1&s=&t=0">Aplikace</a>';
            else if (category[j].innerText === 'Filmy')
                category[j].innerHTML = '<a href="/torrents?c1=1&s=&t=0">Filmy</a>';
            else if (category[j].innerText === 'Filmy - 3D')
                category[j].innerHTML = '<a href="/torrents?c36=1&s=&t=0">Filmy - 3D</a>';
            else if (category[j].innerText === 'Filmy - anime')
                category[j].innerHTML = '<a href="/torrents?c35=1&s=&t=0">Filmy - anime</a>';
            else if (category[j].innerText === 'Filmy - Blu-ray')
                category[j].innerHTML = '<a href="/torrents?c37=1&s=&t=0">Filmy - Blu-ray</a>';
            else if (category[j].innerText === 'Filmy - dokument')
                category[j].innerHTML = '<a href="/torrents?c33=1&s=&t=0">Filmy - dokument</a>';
            else if (category[j].innerText === 'Filmy - DVD')
                category[j].innerHTML = '<a href="/torrents?c11=1&s=&t=0">Filmy - DVD</a>';
            else if (category[j].innerText === 'Filmy - DVD full')
                category[j].innerHTML = '<a href="/torrents?c30=1&s=&t=0">Filmy - DVD full</a>';
            else if (category[j].innerText === 'Filmy - kreslené')
                category[j].innerHTML = '<a href="/torrents?c5=1&s=&t=0">Filmy - kreslené</a>';
            else if (category[j].innerText === 'HD')
                category[j].innerHTML = '<a href="/torrents?c31=1&s=&t=0">HD</a>';
            else if (category[j].innerText === 'HD-LQ')
                category[j].innerHTML = '<a href="/torrents?c38=1&s=&t=0">HD-LQ</a>';
            else if (category[j].innerText === 'Hry')
                category[j].innerHTML = '<a href="/torrents?c3=1&s=&t=0">Hry</a>';
            else if (category[j].innerText === 'Hudba')
                category[j].innerHTML = '<a href="/torrents?c2=1&s=&t=0">Hudba</a>';
            else if (category[j].innerText === 'Hudební video')
                category[j].innerHTML = '<a href="/torrents?c34=1&s=&t=0">Hudební video</a>';
            else if (category[j].innerText === 'Knihy')
                category[j].innerHTML = '<a href="/torrents?c6=1&s=&t=0">Knihy</a>';
            else if (category[j].innerText === 'Konzole')
                category[j].innerHTML = '<a href="/torrents?c13=1&s=&t=0">Konzole</a>';
            else if (category[j].innerText === 'Mluvené slovo')
                category[j].innerHTML = '<a href="/torrents?c32=1&s=&t=0">Mluvené slovo</a>';
            else if (category[j].innerText === 'Mobil, PDA')
                category[j].innerHTML = '<a href="/torrents?c16=1&s=&t=0">Mobil, PDA</a>';
            else if (category[j].innerText === 'Ostatní')
                category[j].innerHTML = '<a href="/torrents?c4=1&s=&t=0">Ostatní</a>';
            else if (category[j].innerText === 'Seriály')
                category[j].innerHTML = '<a href="/torrents?c25=1&s=&t=0">Seriály</a>';
            else if (category[j].innerText === 'Soundtrack')
                category[j].innerHTML = '<a href="/torrents?c29=1&s=&t=0">Soundtrack</a>';
            else if (category[j].innerText === 'xXx')
                category[j].innerHTML = '<a href="/torrents?c24=1&s=&t=0">xXx</a>';
        }
    }

    function markNewTorrents() {
        let lastVisitSpan = document.querySelectorAll('td.detaily>span:last-child');
        let lastVisit = localStorage.getItem('lastVisit');
        for (var k = 0; k < lastVisitSpan.length; k++) {
            let e = lastVisitSpan[k].innerText.split(' | ')[1].split(".").join("/").split('/');
            let date = new Date(e[1]+'/'+e[0]+'/'+e[2]).getTime();
            let color = 'rgb(205, 206, 210)';
            if(darkMode)
                color = 'rgb(67, 67, 67)';
            if (parseInt(lastVisit) < date) {
                lastVisitSpan[k].closest('tr.torr_hover').setAttribute('style', 'background-color:' + color);
            }
        }
    }

    function createEmptyOverlay() {
        imagesOverlay = document.createElement("div");
        imagesOverlay.setAttribute('id', 'overlay');
        imagesOverlay.setAttribute('style', 'display: none;background: rgba(0, 0, 0, .7); width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 999; text-align: center; overflow-y: auto;');

        imagesOverlay.innerHTML = "<div id='img' style='margin-top: 40px;'></div>"+
            "<div id='img-res' style='text-align:center;margin:2% auto 10px;color: white;font-size: 1.3em;'>- x -</div>";
        document.body.appendChild(imagesOverlay);

        imagesOverlay.addEventListener('click', hideOverlay.bind(null, false));

        document.addEventListener('keyup', hideOverlay.bind(null, true));
    }

    function handleImageOverlays() {
        let images = document.querySelectorAll('.image_overview');
        for (var l = 0; l < images.length; l++) {
            images[l].addEventListener('click', imageOverlay);
        }
    }

    function imageOverlay(e) {
        e.preventDefault();
        let src = this.href,
            dim = '- x -',
            image = new Image();
        image.addEventListener("load", function() {
            let that = this;
            setTimeout(function() {
                dim = that.naturalWidth +' x '+ that.naturalHeight;
                updateDimensions(dim);
            }, 400);
        });
        image.addEventListener('click', function (e) {
            e.stopPropagation();
            image.classList.toggle('half');
            image.classList.toggle('full');
        });
        image.src = src;
        image.setAttribute('class', 'half');
        let overImg = document.querySelector('#overlay #img');
        overImg.innerHTML = '';
        overImg.appendChild(image);
        imagesOverlay.style.display = '';
    }

    function updateDimensions(dim) {
        document.querySelector('#img-res').textContent = dim;
    }

    function hideOverlay(byKey, event) {
        if (!byKey || (byKey && event.key === 'Escape'))
            imagesOverlay.style.display = 'none';
    }

    // FORUM TEMPLATES START

    function handleForumTemplates() {
        setForumTemplates();

        createForumTemplateControls();
    }

    function setForumTemplates() {
        let templates = localStorage.getItem('forumTemplates');
        if (templates == null) {
            templates = [];
            createForumTemplates(templates);
        } else {
            templates = JSON.parse(templates);
        }
        forumTemplates = templates;
    }

    function createForumTemplates(templates) {
        templates = JSON.stringify(templates);
        localStorage.setItem('forumTemplates', templates);
    }

    function createForumTemplateControls() {
        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = "15px";

        forumTemplatesSelect = document.createElement("select");
        forumTemplatesSelect.id = "forumTemplates";
        forumTemplatesSelect.style.width = "150px";
        forumTemplatesSelect.style.border = "none";
        forumTemplatesSelect.style.outline = "#818181 solid 1px";
        forumTemplatesSelect.addEventListener("change", changeForumTemplate);

        loadForumTemplateOptions();

        let saveTemplate = document.createElement("input");
        saveTemplate.type = "button";
        saveTemplate.value = "Uložit";
        saveTemplate.className = 'nahled';
        saveTemplate.style.margin = '0 5px';
        saveTemplate.style.top = '0';
        saveTemplate.addEventListener("click", saveForumTemplate);

        let deleteTemplate = document.createElement("input");
        deleteTemplate.type = "button";
        deleteTemplate.value = "Smazat";
        deleteTemplate.className = 'nahled';
        deleteTemplate.style.top = '0';
        deleteTemplate.addEventListener("click", deleteForumTemplate);

        div.appendChild(forumTemplatesSelect);
        div.appendChild(saveTemplate);
        div.appendChild(deleteTemplate);

        document.querySelector('form .submit').prepend(div);
    }

    function loadForumTemplateOptions() {
        forumTemplatesSelect.innerHTML = '';
        let blank = document.createElement("option");
        blank.value = null;
        blank.disabled = true;
        blank.selected = true;
        blank.appendChild(document.createTextNode('Šablona'));
        forumTemplatesSelect.appendChild(blank);
        for (var i = 0; i < forumTemplates.length; i++) {
            let template = forumTemplates[i];
            let option = document.createElement("option");
            option.value = template.content;
            option.appendChild(document.createTextNode(template.name));
            forumTemplatesSelect.appendChild(option);
        }
    }

    function changeForumTemplate() {
        let editor = document.querySelector('form textarea[name="post"]');
        editor.value = forumTemplatesSelect.value;
    }

    function saveForumTemplate() {
        let templateName = prompt("Jméno šablony", new Date().toLocaleString());
        let editor = document.querySelector('form textarea[name="post"]');

        if (templateName != null && editor.value !== '') {
            let template = {
                "name": templateName,
                "content": editor.value
            };

            forumTemplates.push(template);
            createForumTemplates(forumTemplates);
            let option = document.createElement("option");
            option.value = template.content;
            option.selected = true;
            option.appendChild(document.createTextNode(template.name));
            forumTemplatesSelect.appendChild(option);
        }
    }

    function deleteForumTemplate() {
        if (confirm('Smazat?')) {
            forumTemplates.splice((forumTemplatesSelect.selectedIndex - 1), 1);
            createForumTemplates(forumTemplates);
            loadForumTemplateOptions();
        }
    }

    // FORUM TEMPLATES END

    // TORRENT TEMPLATES START

    function handleUploadTemplates() {
        let activeStage = document.querySelector('.progrs a.act');
        if (!activeStage || activeStage.innerHTML !== 'Detaily a náhled') {
            return false;
        }

        setUploadTemplates();

        createUploadTemplateControls();
    }

    function setUploadTemplates() {
        let templates = localStorage.getItem('uploadTemplates');
        if (templates == null) {
            templates = [];
            createUploadTemplates(templates);
        } else {
            templates = JSON.parse(templates);
        }
        uploadTemplates = templates;
    }

    function createUploadTemplates(templates) {
        templates = JSON.stringify(templates);
        localStorage.setItem('uploadTemplates', templates);
    }

    function createUploadTemplateControls() {
        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = "15px";

        uploadTemplatesSelect = document.createElement("select");
        uploadTemplatesSelect.id = "uploadTemplates";
        uploadTemplatesSelect.style.width = "150px";
        uploadTemplatesSelect.style.border = "none";
        uploadTemplatesSelect.style.outline = "#818181 solid 1px";
        uploadTemplatesSelect.addEventListener("change", changeUploadTemplate);

        loadUploadTemplateOptions();

        let saveTemplate = document.createElement("input");
        saveTemplate.type = "button";
        saveTemplate.value = "Uložit";
        saveTemplate.className = 'nahled';
        saveTemplate.style.margin = '0 5px';
        saveTemplate.style.top = '0';
        saveTemplate.addEventListener("click", saveUploadTemplate);

        let deleteTemplate = document.createElement("input");
        deleteTemplate.type = "button";
        deleteTemplate.value = "Smazat";
        deleteTemplate.className = 'nahled';
        deleteTemplate.style.top = '0';
        deleteTemplate.addEventListener("click", deleteUploadTemplate);

        div.appendChild(uploadTemplatesSelect);
        div.appendChild(saveTemplate);
        div.appendChild(deleteTemplate);

        document.querySelector('.editor .submit').prepend(div);
    }

    function loadUploadTemplateOptions() {
        uploadTemplatesSelect.innerHTML = '';
        let blank = document.createElement("option");
        blank.value = null;
        blank.disabled = true;
        blank.selected = true;
        blank.appendChild(document.createTextNode('Šablona'));
        uploadTemplatesSelect.appendChild(blank);
        for (var i = 0; i < uploadTemplates.length; i++) {
            let template = uploadTemplates[i];
            let option = document.createElement("option");
            option.value = template.content;
            option.appendChild(document.createTextNode(template.name));
            uploadTemplatesSelect.appendChild(option);
        }
    }

    function changeUploadTemplate() {
        let editor = document.querySelector('.editor textarea[name="description"]');
        editor.value = uploadTemplatesSelect.value;
    }

    function saveUploadTemplate() {
        let templateName = prompt("Jméno šablony", new Date().toLocaleString());
        let editor = document.querySelector('.editor textarea[name="description"]');

        if (templateName != null && editor.value !== '') {
            let template = {
                "name": templateName,
                "content": editor.value
            };

            uploadTemplates.push(template);
            createForumTemplates(uploadTemplates);
            let option = document.createElement("option");
            option.value = template.content;
            option.selected = true;
            option.appendChild(document.createTextNode(template.name));
            uploadTemplatesSelect.appendChild(option);
        }
    }

    function deleteUploadTemplate() {
        if (confirm('Smazat?')) {
            uploadTemplates.splice((uploadTemplatesSelect.selectedIndex - 1), 1);
            createUploadTemplates(uploadTemplates);
            loadUploadTemplateOptions();
        }
    }

    // TORRENT TEMPLATES END

    // AJAX START

    function setSessionID() {
        let UidWrapper = document.querySelector('#user_panel .panel_4 a');
        if(UidWrapper) {
            userId = UidWrapper.href.split('/profile/')[1];
        }

        let savedUid = localStorage.getItem('cztUserID');

        let pathname = window.location.pathname;
        if (pathname.indexOf('/torrent/') !== -1 ||
            (pathname.indexOf('/profile/') !== -1 && pathname.indexOf('/settings') !== -1) ||
            pathname.indexOf('/signature') !== -1 || pathname.indexOf('/resetpid') !== -1 ||
            pathname.indexOf('/park-account') !== -1 || pathname.indexOf('/reset-ratio') !== -1 ||
            pathname.indexOf('/mailbox') !== -1) {
            //top priority - if there's session ID on page, it will 100% work
            sessionUserId = searchSessionID(pathname);
            if(sessionUserId && userId) {
                localStorage.setItem('cztUserID', userId + '/' + sessionUserId);
            }
        } else if(savedUid) {
            //if there is at least saved session ID in localstorage, compare user IDs and use saved session ID
            let cztUserId = savedUid.split('/')[0];
            if (cztUserId === userId)
                sessionUserId = savedUid.split('/')[1];
        } else {
            //otherwise make ajax call, grab and save fresh session ID
            sessionUserId = fetchSessionID();
            if(typeof sessionUserId !== typeof undefined && sessionUserId && userId) {
                localStorage.setItem('cztUserID', userId + '/' + sessionUserId);
            }
        }
    }

    function searchSessionID(pathname) {
        let form = false;


        return false;
    }

    function fetchSessionID() {
        let request = new XMLHttpRequest();
        request.open('GET', 'https://tracker.cztorrent.net/forum/newtopic/117', true);

        request.onload = function() {
            if (this.status === 200) {
                let parser = new DOMParser();
                let html = parser.parseFromString(this.responseText, 'text/html');
                return html.querySelector('form').getAttribute('action').split('/')[4];
            } else {
                return false;
            }
        };
        request.onerror = function() {
            return false;
        };
        request.send();
    }

    ready(init())
}) ();