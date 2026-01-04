// ==UserScript==
// @name           HWM_Time_Seconds
// @author         Demin
// @namespace      Demin_95725
// @description    Время с секундами (by Demin), с частыми синхронизациями
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        3.3
// @encoding 	   utf-8
// @include        https://*heroeswm.ru/*
// @include        https://178.248.235.15/*
// @include        https://*lordswm.com/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/376594/HWM_Time_Seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/376594/HWM_Time_Seconds.meta.js
// ==/UserScript==

// (c) 2011-2014, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )

try{
    (function() {

        var version = '3.2';


        if (typeof GM_getValue != 'function') {
            this.GM_getValue=function (key,def) {return localStorage[key] || def;};
            this.GM_setValue=function (key,value) {return localStorage[key]=value;};
            this.GM_deleteValue=function (key) {return delete localStorage[key];};
        }


        var script_num = 95725;
        var script_name = "hwm_time_seconds: Время с секундами (by Demin)";
        update_n(version,script_num,script_name);

        var url_cur = location.href;
        var url = 'https://'+location.hostname+'/';


        if ( document.querySelector("body") ) {

            if( !GM_getValue("95725_hwm_time_sec_add") ) GM_setValue("95725_hwm_time_sec_add" , '0');
            if( !GM_getValue("95725_time_error_gm") ) GM_setValue("95725_time_error_gm", '0');
            if( !GM_getValue("95725_time_error2_gm") ) GM_setValue("95725_time_error2_gm", '0');
            if( !GM_getValue("95725_last_synch_gm") ) GM_setValue("95725_last_synch_gm", '1318000000000');

            var time_serv = /([^,]*)(, \d+ online.*)/;
            var time_top = /(\d+):(\d+), \d+ online/;
            var all_td = document.getElementsByTagName('td');
            var td_len = all_td.length;
            var td_i;
            var td_ih;
            var time_sec;
            var online;
            var hm;

            for (var i=0; i<td_len; i++) {
                td_i = all_td[i];
                td_ih = td_i.innerHTML;
                if (td_ih.indexOf("<td")!=-1) {continue;}
                if (td_ih.search(time_top)!=-1) {
                    online = (time_serv.exec(td_ih))[2];
                    hm = time_top.exec(td_ih);

                    td_add = document.createElement( 'td' );
                    td_add.setAttribute('align', 'right');
                    td_add.setAttribute('id', 'jsset_ts');
                    td_add.setAttribute('valign', 'bottom');
                    td_add.setAttribute('width', '60');
                    td_add.innerHTML="";
                    td_i.parentNode.insertBefore(td_add, td_i);
                    addEvent($("jsset_ts"), "click", settings);

                    if (Number(GM_getValue("95725_last_synch_gm", '0')) + 60 * 60 * 1000 < (new Date().getTime())) { get_time(); }
                    else if ( GM_getValue("95725_time_sec_gm") ) { show_time(); }
                    else { get_time(); }

                    break;
                }
            }

        }

        function show_time() {
            time_sec = Number(GM_getValue("95725_time_sec_gm"));

// true time
            ct = Math.round( ((new Date().getTime())-time_sec)/1000 );
            dd = Math.floor( ct / 86400 );
            dh = Math.floor( ( ct - dd * 86400 ) / 3600 );
            dm = Math.floor( ( ct - dd * 86400 - dh * 3600 ) / 60 );
            ds = ct % 60;

            if ( (dh!=hm[1]) || (dm-hm[2])>1 || hm[2]>dm ) {
                if ( (dh-hm[1]==1 || hm[1]-dh==23) && (hm[2]-dm==59) ) { showtop(td_i); }
                else {
                    GM_setValue("95725_time_sec_gm", '');
                    var err4 = Number(GM_getValue("95725_time_error2_gm"))+1;
                    GM_setValue("95725_time_error2_gm", ''+err4);
                    //alert(hm[1]+':'+hm[2]+' - '+dh+':'+dm+':'+ds);
                    get_time();
                }
            }
            else { GM_setValue("95725_time_error2_gm", '0'); showtop(td_i); }
        }

        function get_time() {
            if ( Number(GM_getValue("95725_time_error_gm"))<4 && Number(GM_getValue("95725_time_error2_gm"))<4 ) {
                if ( Number(GM_getValue("95725_last_synch_gm", '0')) + 60000 < (new Date().getTime()) ) {
                    GM_setValue("95725_last_synch_gm", ''+(new Date().getTime()));
                    var objXMLHttpReqTime = new XMLHttpRequest();
                    objXMLHttpReqTime.open('GET', 'time.php' + '?rand=' + (Math.random()* 1000000), true);
                    objXMLHttpReqTime.onreadystatechange = function() { handleHttpResponseTime(objXMLHttpReqTime); }
                    objXMLHttpReqTime.send(null);
                } else {
                    setTimeout(function() { get_time(); }, 60000);
                }
            }
        }

        function handleHttpResponseTime(obj) {
            if (obj.readyState == 4 && obj.status == 200) {
                if ( sec_serv = /now (\d+)/.exec(obj.responseText) ) {
// 1318550400000  75600000
                    sec_serv = Number( sec_serv[1] ) * 1000 + Number( GM_getValue("95725_hwm_time_sec_add") ) * 1000 - 1318626000000;
                    sec_serv = new Date().getTime() - sec_serv;
                    GM_setValue("95725_time_sec_gm", '' + sec_serv);
                    GM_setValue("95725_time_error_gm", '0');
                    show_time();
                }
                else {
                    var err3 = Number(GM_getValue("95725_time_error_gm"))+1;
                    GM_setValue("95725_time_error_gm", ''+err3);
                    setTimeout(function() { get_time(); }, 60000);
                }
            }
        }

        function showtop(td_i) {
            ct = Math.round( ((new Date().getTime())-time_sec)/1000 );
            dd = Math.floor( ct / 86400 );
            dh = Math.floor( ( ct - dd * 86400 ) / 3600 );
            dm = Math.floor( ( ct - dd * 86400 - dh * 3600 ) / 60 );
            ds = ct % 60;
            td_i.innerHTML = dh + ':' + ( (dm < 10) ? '0' : '' ) + dm + ':' + ( (ds < 10) ? '0' : '') + ds + online;
            setTimeout(function() {showtop(td_i)}, 1000);
        }

        function settings_close()
        {
            var bg = $('bgOverlay');
            var bgc = $('bgCenter');
            bg.parentNode.removeChild(bg);
            bgc.parentNode.removeChild(bgc);
        }

        function settings()
        {
            var bg = $('bgOverlay');
            var bgc = $('bgCenter');
            var bg_height = ScrollHeight();

            if ( !bg )
            {
                bg = document.createElement('div');
                document.body.appendChild( bg );

                bgc = document.createElement('div');
                document.body.appendChild( bgc );
            }

            bg.id = 'bgOverlay';
            bg.style.position = 'absolute';
            bg.style.left = '0px';
            bg.style.width = '100%';
            bg.style.background = "#000000";
            bg.style.opacity = "0.5";
            bg.style.zIndex = "7";

            bgc.id = 'bgCenter';
            bgc.style.position = 'absolute';
            bgc.style.left = ( ( ClientWidth() - 650 ) / 2 ) + 'px';
            bgc.style.width = '650px';
            bgc.style.background = "#F6F3EA";
            bgc.style.zIndex = "8";

            addEvent(bg, "click", settings_close);

            if ( url.match('lordswm') ) {

                var st_1 = 'Adding';
                var st_2 = 'second(s) to the sync (page load time from the server)';
                var st_3 = 'Restart the script';
                var st_author = 'Script author';

            } else {

                var st_1 = '\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0442\u044C';
                var st_2 = '\u0441\u0435\u043A\u0443\u043D\u0434(\u044B) \u043D\u0430 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E (\u0432\u0440\u0435\u043C\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430)';
                var st_3 = '\u041F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0441\u043A\u0440\u0438\u043F\u0442';
                var st_author = '\u0410\u0432\u0442\u043E\u0440 \u0441\u043A\u0440\u0438\u043F\u0442\u0430';

            }

            bgc.innerHTML = '<div style="border:1px solid #abc;padding:5px;margin:2px;"><div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tr" title="Close">x</div><table>'+
                '<tr><td>'+st_1+' <input id="hwm_time_add" value="'+
                GM_getValue("95725_hwm_time_sec_add")+
                '" size="1" maxlength="2"> '+st_2+'</b> <input type="submit" id="hwm_time_add_ok" value="ok"><br><br></td></tr>'+

                '<tr><td><input type="submit" id="ref48" value="'+st_3+'"></td></tr>'+

                '</table><table width=100%>'+
                '<tr><td style="text-align:right">'+st_author+': <a href="pl_info.php?id=15091">Demin</a> <a href="javascript:void(0);" id="open_transfer_id">?</a></td></tr>'+
                '</table></div>';

            addEvent($("bt_close_tr"), "click", settings_close);
            addEvent($("hwm_time_add_ok"), "click", hwm_time_add_f);
            addEvent($("ref48"), "click", ref48_f);
            addEvent($("open_transfer_id"), "click", open_transfer_f);

            bg.style.top = '0px';
            bg.style.height = bg_height + 'px';
            bgc.style.top = ( window.pageYOffset + 150 ) + 'px';
            bg.style.display = '';
            bgc.style.display = '';
        }

        function hwm_time_add_f()
        {
            if ( Number( $("hwm_time_add").value ) >= 0 ) {
                GM_setValue( "95725_hwm_time_sec_add" , '' + $("hwm_time_add").value );
            }
        }

        function ref48_f()
        {
            GM_setValue("95725_time_error_gm", '0');
            GM_setValue("95725_time_error2_gm", '0');
            GM_setValue("95725_time_sec_gm", '');
            GM_setValue("95725_last_synch_gm", '');
        }

        function open_transfer_f()
        {
            if ( location.href.match('lordswm') )
            {
                window.location = "transfer.php?nick=demin&shortcomment=Transferred 10000 Gold 5 Diamonds";
            } else {
                window.location = "transfer.php?nick=demin&shortcomment=%CF%E5%F0%E5%E4%E0%ED%EE%2010000%20%C7%EE%EB%EE%F2%EE%205%20%C1%F0%E8%EB%EB%E8%E0%ED%F2%FB";
            }
        }

        function ClientHeight() {
            return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientHeight:document.body.clientHeight;
        }

        function ClientWidth() {
            return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;
        }

        function ScrollHeight() {
            return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
        }

        function $(id) { return document.querySelector("#"+id); }

        function addEvent(elem, evType, fn) {
            if (elem.addEventListener) {
                elem.addEventListener(evType, fn, false);
            }
            else if (elem.attachEvent) {
                elem.attachEvent("on" + evType, fn);
            }
            else {
                elem["on" + evType] = fn;
            }
        }

        function update_n(a,b,c,d,e){if(e){e++}else{e=1;d=(Number(GM_getValue(b+'_update_script_last2','0'))||0)}if(e>3){return}var f=new Date().getTime();var g=document.querySelector('#update_demin_script2');if(g){if((d+86400000<f)||(d>f)){g=g.innerHTML;if(/100000=1.1/.exec(g)){var h=new RegExp(b+'=(\\d+\\.\\d+)=(\\d+)').exec(g);var i=/url7=([^%]+)/.exec(g);if(a&&h&&i){if(Number(h[1])>Number(a))setTimeout(function(){if(confirm('\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u0438\u043F\u0442\u0430: "'+c+'".\n\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0441\u0435\u0439\u0447\u0430\u0441?\n\nThere is an update available for the script: "'+c+'".\nWould you like install the script now?')){if(typeof GM_openInTab=='function'){GM_openInTab(i[1].replace(/\s/g,'')+h[2])}else{window.open(i[1].replace(/\s/g,'')+h[2],'_blank')}}},500)}GM_setValue(b+'_update_script_last2',''+f)}else{setTimeout(function(){update_n(a,b,c,d,e)},1000)}}}else{var j=document.querySelector('body');if(j){var k=GM_getValue(b+'_update_script_array2');if(e==1&&((d+86400000<f)||(d>f)||!k)){if(k){GM_deleteValue(b+'_update_script_array2')}setTimeout(function(){update_n(a,b,c,d,e)},1000);return}var l=document.createElement('div');l.id='update_demin_script2';l.setAttribute('style','position: absolute; width: 0px; height: 0px; top: 0px; left: 0px; display: none;');l.innerHTML='';j.appendChild(l);if((d+86400000<f)||(d>f)||!k){var m=new XMLHttpRequest();m.open('GET','photo_pl_photos.php?aid=1777'+'&rand='+(Math.random()*100),true);m.onreadystatechange=function(){update(m,a,b,c,d,e)};m.send(null)}else{document.querySelector('#update_demin_script2').innerHTML=k;setTimeout(function(){update_n(a,b,c,d,e)},10)}}}}function update(a,b,c,d,e,f){if(a.readyState==4&&a.status==200){a=a.responseText;var g=/(\d+=\d+\.\d+(=\d+)*)/g;var h='';var i=/(url7=[^%]+\%)/.exec(a);if(i){h+=i[1]}while((i=g.exec(a))!=null){if(h.indexOf(i[1])==-1){h+=' '+i[1]}};GM_setValue(c+'_update_script_array2',''+h);var j=document.querySelector('#update_demin_script2');if(j){j.innerHTML=h;setTimeout(function(){update_n(b,c,d,e,f)},10)}}}

    })();
} catch (E) {console.log(E)}