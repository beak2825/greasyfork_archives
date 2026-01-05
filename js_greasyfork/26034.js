// ==UserScript==
// @name         P-GO Auto SEARCH
// @version      0.40
// @description  P-GO SEARCHを自動でサーチ
// @match        https://pmap.kuku.lu/*
// @grant        none
// @namespace    https://greasyfork.org/users/89773
// @downloadURL https://update.greasyfork.org/scripts/26034/P-GO%20Auto%20SEARCH.user.js
// @updateURL https://update.greasyfork.org/scripts/26034/P-GO%20Auto%20SEARCH.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //keyの設定不要

    var latlng; //座標はダイアログから設定
    //範囲指定
    var x = 7;    //東→に
    var y = 7;    //南↓に

    //未確定ソースを確定に 下を'var kakutei = true;'に
    var kakutei;

    //間隔指定
    var x_margin = 0.0025;
    var y_margin = 0.002;

    //localStorageに保存してたらそっちを優先
    if (localStorage.getItem("x")) x = localStorage.getItem("x");
    if (localStorage.getItem("y")) y = localStorage.getItem("y");
    if (localStorage.getItem("x_margin")) x_margin = localStorage.getItem("x_margin");
    if (localStorage.getItem("y_margin")) y_margin = localStorage.getItem("y_margin");
    if (!latlng){
        if (localStorage.getItem("latlng")){
            latlng = localStorage.getItem("latlng");
            if (!latlng.match(/\d+\.\d+,\s?\d+\.\d+/)) latlng = dialog('不正値');
        }else{
            latlng = dialog();
        }
        latlng = latlng.split(',');
        latlng = [Number(latlng[0]), Number(latlng[1])];
    }

    function gene(latlng, range, adjust){
        var list=[];
        for (var i=0; i<range.lat; i++){
            var v = floatFormat((latlng[0] - y_margin*i));
            var r = (!adjust && i%2 !== 0) ? range.lng-1 : range.lng;
            for (var j=0; j<r; j++){
                var w = floatFormat((latlng[1] + x_margin*j));
                if (i%2 !== 0) w = floatFormat(w + x_margin/2);
                list.push([v, w]);
            }
        }
        return list;
    }

    function dialog(messege){
        messege = messege ? messege+'\n' : '';
        var latlng = window.prompt(messege+"起点座標を入力", "35.690695, 139.699694");
        if (!latlng.match(/\d+\.\d+,\s?\d+\.\d+/)){
            latlng = dialog('不正値');
        }else{
            localStorage.setItem("latlng", latlng);
        }
        return latlng;
    }

    function floatFormat(number){
        var _pow = Math.pow(10, 6);
        return Math.round(number * _pow) / _pow;
    }

    var list = gene(latlng, {lat: y, lng: x});

    if (kakutei){
        var t_lat = 1;
        var t_lng = 3;
        var m_lat = y_margin * t_lat;
        var m_lng = x_margin * t_lng;
        var c_lat = localStorage.getItem("lat") ? localStorage.getItem("lat") : 0;
        var c_lng = localStorage.getItem("lng") ? localStorage.getItem("lng") : 0;
        var adjust = (t_lat%2 !== 0 && c_lat%2 !== 0) ? floatFormat(x_margin/2) : 0;
        list = gene([latlng[0] - m_lat*c_lat, latlng[1] + m_lng*c_lng + adjust], {lat: t_lat, lng: t_lng}, true);
        setInterval(function(){
            c_lat++;
            if (c_lat>10){
                c_lat = 0;
                c_lng++;
                localStorage.setItem("lng", c_lng);
            }
            localStorage.setItem("lat", c_lat);
            adjust = (t_lat%2 !== 0 && c_lat%2 !== 0) ? floatFormat(x_margin/2) : 0;
            list = gene([latlng[0] - m_lat*c_lat, latlng[1] + m_lng*c_lng + adjust], {lat: t_lat, lng: t_lng}, true);
            for (var i=0; i<list.length; i++){
                L.circle([list[i][0], list[i][1]], 150, {opacity: 0.2, fillOpacity: 0.1, color: 'red'}).addTo(map);
            }
        }, 60*60*1000);
    }

    var jump, random, lat, lng, marker, timeout;
    var auto = true;
    var done = true;
    var count = Math.floor( Math.random() * list.length );
    var key = $('head').text().match(/uukey=(.*?)\&/)[1];
    var version = $('head').text().match(/sysversion=(.*?)\&/)[1];
    var option = {
        opacity: 0.8,
        zIndexOffset: 999999,
        icon : L.icon({
            iconUrl: 'https://github.com/pointhi/leaflet-color-markers/raw/master/img/marker-icon-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    };

    var searching, searchcircle, search_marker, search_circle;
    function addMarker(lat, lng){
        search_marker=L.marker([lat, lng], {
            zIndexOffset: 999999,
            icon: L.icon({
                iconUrl: 'https://img-pmap.aquapal-cdn.net/img/icon_search2.png',
                iconSize: [40, 40]
            })
        }).on( 'click', function() {
            if (!searching){
                searching = true;
                search(lat, lng);
            }
        }).addTo(map);
        search_circle=L.circle([lat, lng], 150, {opacity: 0.1, color: 'green'}).addTo(map);
    }

    function search(s_lat, s_lng){
        if (!searchcircle && done){
            done = false;
            if (random){
                count = Math.floor( Math.random() * list.length );
            }else{
                count++;
                if (count>=list.length) count = 0;
            }
            lat = list[count][0];
            lng = list[count][1];
            console.info(count + ': ' + lat + ', ' + lng);

            if (marker) map.removeLayer(marker);
            marker = L.marker([lat, lng], option).addTo(map);
            if (jump) map.setView([lat, lng], 17);
        }else if(s_lat && s_lng){
            lat = s_lat;
            lng = s_lng;
        }

        research_key = "psearch-"+uuid();

        viewTopMessage("リクエスト");
        $.ajax({
            url: "https://sv-webdb1.pmap.kuku.lu/_server.php",
            type: "GET",
            data: {
                uukey: key,
                sysversion: version,
                action: 'addServerQueue',
                run_key: research_key,
                loc1: lat,
                loc2: lng
            },
            timeout: 6000,
            cache: false
        }).done(function(data, status, xhr) {
            if (data.match("REQ_CAPTCHA")){
                $.getScript("https://www.google.com/recaptcha/api.js", function(){
                    openAlertWindow('<center><div class="g-recaptcha" data-callback="syncerRecaptchaCallback" data-sitekey="'+parseValue(data.split("NG:")[1]).sitekey+'"></div></center>');
                });
                var Interval = setInterval(function(){
                    if($('#area_topmessage a').text()=='確認成功'){
                        clearInterval(Interval);
                        search();
                    }
                }, 1000);
            }else{
                var t = 5;
                if(data.match("連打")){
                    viewTopMessage("連打");
                }else if(data.match("busy")){
                    viewTopMessage("大混雑");
                }else if (data.match("OK")){
                    done = true;
                    searching = false;
                    t = 10;
                    viewTopMessage("更新中");

                    research_runserver = parseValue(data.split("OK:")[1]);
                    if (research_timeout) {
                        clearInterval(research_timeout);
                        research_timeout = false;
                    }
                    research_timeout = setInterval(researchResult, 1000);
                }
                nextRefreshResearch(t);
                if (!searchcircle || t<10) timeout = setTimeout(function(){search();}, t*1000);
            }
        }).fail(function(xhr, status, error) {
            search();
        });
    }

    var interval = setInterval(function(){
        if (auto) search();
        for (var i=0; i<list.length; i++){
            L.circle([list[i][0], list[i][1]], 150, {opacity: 0.2, fillOpacity: 0.1, color: 'red'}).addTo(map);
        }

        map.on('click', function(e) {
            if (searchcircle){
                if(!$(e.originalEvent.target).is('.leaflet-control, .leaflet-control img')){
                    console.info(e.latlng+'');
                    map.removeLayer(search_marker);
                    map.removeLayer(search_circle);
                    addMarker(e.latlng.lat, e.latlng.lng);
                }
            }
        });

        var _class='leaflet-bar leaflet-control leaflet-control-custom leaflet-control-command-interior';
        var css ='width:80px;height:35px;padding:10px;text-align:center;cursor:pointer;background:#';
        $('.leaflet-bottom.leaflet-left').append(
            $('<div>', {
                id: 'search',
                class: _class,
                html: '<img src="https://img-pmap.aquapal-cdn.net/img/icon_searchcircle2.png" width="30" style="opacity:0.5;">',
                click: function(){
                    if (searchcircle) {
                        searchcircle = false;
                        $(this).children().css('opacity', 0.5);
                        map.removeLayer(search_marker);
                        map.removeLayer(search_circle);
                    } else {
                        searchcircle = true;
                        auto = false;
                        clearTimeout(timeout);
                        $('#Auto').css('background', '#ffffff');
                        $(this).children().css('opacity', 1);

                        addMarker(map.getCenter().lat, map.getCenter().lng);
                    }
                    clearTimeout(timeout);
                    timeout = searching = false;
                }
            }),
            $('<div>', {
                text: '再指定',
                class: _class,
                style: css + 'ffffff;',
                on: {
                    click: function(){
                        dialog();
                        location.reload();
                    }
                }
            }),
            $('<div>', {
                text: 'Random',
                class: _class,
                style: css + (random ? 'dddddd;' : 'ffffff;'),
                on: {
                    click: function(){
                        if (random) {
                            random = false;
                            $(this).css('background', '#ffffff');
                        } else {
                            random = true;
                            $(this).css('background', '#dddddd');
                        }
                    }
                }
            }),
            $('<div>', {
                text: 'Jamp',
                class: _class,
                style: css + (jump ? 'dddddd;' : 'ffffff;'),
                on: {
                    click: function(){
                        if (jump) {
                            jump = false;
                            $(this).css('background', '#ffffff');
                        } else {
                            jump = true;
                            $(this).css('background', '#dddddd');
                        }
                    }
                }
            }),
            $('<div>', {
                text: 'Auto',
                id: 'Auto',
                class: _class,
                style: css + (auto ? 'dddddd;' : 'ffffff;'),
                on: {
                    click: function(){
                        if (auto) {
                            auto = false;
                            clearTimeout(timeout);
                            $(this).css('background', '#ffffff');
                        } else {
                            auto = true;
                            searchcircle = false;
                            $('#search').children().css('opacity', 0.5);
                            map.removeLayer(search_marker);
                            map.removeLayer(search_circle);
                            search();
                            $(this).css('background', '#dddddd');
                        }
                    }
                }
            })
        );
        if($('#Auto').length>0) clearInterval(interval);
    }, 1000);
})();