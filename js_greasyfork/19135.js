// ==UserScript==
// @name         M-Team 搜索器
// @namespace    mteam-searcher
// @version      0.17
// @description  在 资源库 看到的影片、演员和类型，能够立即在 M-team 中搜索。
// @author       Samuel Cui
// @include     *://avmoo.xyz/*
// @include     *://tp.m-team.cc/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19135/M-Team%20%E6%90%9C%E7%B4%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/19135/M-Team%20%E6%90%9C%E7%B4%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    var site_root = "https://avmoo.xyz/";
    var jav_regex = RegExp(site_root + "([^/]+)/([^/]+)/(.+)");
    var mteam_regex = RegExp("https://tp.m-team.cc/(details|adult)\.php.*");

    var jav_paths = jav_regex.exec(location.href);
    if (jav_paths !== null) {
        switch(jav_paths[2]) {
            case "movie":
                var mteam_root = document.createElement('p');
                var mteam = document.createElement('a');
                mteam.innerHTML = '在 M-team 中搜索';
                mteam.href = '//tp.m-team.cc/adult.php?incldead=0&spstate=0&inclbookmarked=0&search=' + document.querySelector('.header').nextElementSibling.innerHTML + '&search_area=0&search_mode=0';
                mteam.target = '_blank';
                mteam_root.appendChild(mteam);
                var target = document.querySelector('.info');
                target.insertBefore(mteam_root, target.querySelectorAll('p')[1]);
                return;
            case "star":
                var mteam_root = document.createElement('p');
                var mteam = document.createElement('a');
                mteam.innerHTML = '在 M-team 中搜索';
                mteam.href = '//tp.m-team.cc/adult.php?incldead=0&spstate=0&inclbookmarked=0&search=' + document.querySelector('.pb-10').innerHTML + '&search_area=0&search_mode=0';
                mteam.target = '_blank';
                mteam_root.appendChild(mteam);
                document.querySelector('.photo-info').appendChild(mteam_root);
                return;
            case "genre":
                var url = location.href.replace('/cn/', '/ja/').replace('/tw/', '/ja/').replace('/en/', '/ja/');
                var nav = document.querySelector('.nav.navbar-nav');
                var ajax = new XMLHttpRequest();
                ajax.onreadystatechange=function() {
                    if (ajax.readyState==4 && ajax.status==200) {
                        var mteam_root = document.createElement('li');
                        var mteam = document.createElement('a');
                        mteam.innerHTML = '在 M-team 中搜索 类别 ' + document.querySelector('title').text.match(/(.+?) - .+/)[1];
                        mteam.href = '//tp.m-team.cc/adult.php?tagname=' + ajax.responseText.match(/<title>(.+) - ジャンル .+<\/title>/)[1];
                        mteam.target = '_blank';
                        mteam_root.appendChild(mteam);
                        nav.appendChild(mteam_root);
                    }
                };
                ajax.open("GET", url, true);
                ajax.send();
                return;
        }
    }

    var mteam_paths = mteam_regex.exec(location.href);
    if (mteam_paths === null) {
        return;
    }
    switch(mteam_paths[1]) {
        case "adult":
            var search_matched = /&search=(.+?)&/.exec(location.href);
            if (search_matched !== null) {
                var mteam = document.createElement('a');
                mteam.innerHTML = '在 JAV 中搜索';
                mteam.href = site_root + 'cn/search/' + search_matched[1];
                mteam.target = '_blank';
                var target = document.querySelectorAll('select[name=search_area]')[0];
                target.parentElement.appendChild(mteam);
            }

            var list = document.querySelectorAll('table.torrents')[0].children[0].children;
            var line_num = null;
            jQuery.each(list, function (index, line) {
                if (line.querySelectorAll('img[alt$="Censored"]').length === 0) {
                    return;
                }
                var mteam = document.createElement('a');
                mteam.innerHTML = '<img src="' + site_root + 'app/jav/View/img/favicon.ico" height="16px" width="16px" />';
                mteam.href = site_root + 'cn/search/' + line.querySelectorAll('a[href^="details.php"]')[0].title.match(/(.+?) /)[1];
                mteam.target = '_blank';
                var target = line.querySelectorAll('a[id^=bookmark]')[0];
                target.parentElement.appendChild(mteam);
            });
            return;
        case "details":
            if (/\sCensored/.test(document.documentElement.innerHTML)) {
                var jsearch = document.createElement('a');
                jsearch.innerHTML = 'J';
                jsearch.href = site_root + 'cn/search/' + jQuery('#top').text().match(/(.+?) /)[1];
                jsearch.target = '_blank';
                jsearch.style = 'color:#880000';
                var msearch = document.createElement('a');
                msearch.innerHTML = 'M';
                msearch.href = '//tp.m-team.cc/adult.php?incldead=1&spstate=0&inclbookmarked=0&search=' + jQuery('#top').text().match(/(.+?) /)[1];
                msearch.target = '_blank';
                msearch.style = 'color:#880000';
                var target = jQuery('#top')[0];
                target.appendChild(document.createTextNode(' ['));
                target.appendChild(jsearch);
                target.appendChild(document.createTextNode('] ['));
                target.appendChild(msearch);
                target.appendChild(document.createTextNode(']'));
            }
            return;
    }
})();
