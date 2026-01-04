// ==UserScript==
// @name         PoiDBTrans
// @namespace    https://greasyfork.org/en/users/135297-joe-barker
// @version      9
// @description  Translate ship names and menu items on db.kcwiki.org
// @author       jwbarker
// @license      Public Domain
// @match        https://db.kcwiki.org/*
// @grant GM_setValue
// @grant GM_getValue
// @require http://code.jquery.com/jquery-2.2.4.min.js#sha256=BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=
// @require https://greasyfork.org/scripts/30548-waitforkeyelements/code/waitForKeyElements.js
// @require https://greasyfork.org/scripts/5279-greasemonkey-supervalues/code/GreaseMonkey_SuperValues.js
// @downloadURL https://update.greasyfork.org/scripts/30868/PoiDBTrans.user.js
// @updateURL https://update.greasyfork.org/scripts/30868/PoiDBTrans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //***********************************
    // Translation of page items
    var trans={};
    var trans_ship_name=function(nm) {
        if(trans.ships.hasOwnProperty(nm)) {
           return trans.ships[nm];
        }
        //Check if suffixes present
        var sfx=Object.keys(trans.affix).find(function(sfx) {
            return nm.endsWith(sfx);
        });
        if(sfx) {
            var t=trans_ship_name(nm.slice(0,-sfx.length))+trans.affix[sfx];
            trans.ships[nm]=t;
            return t;
        }
        return nm;
    };

    var createLoadOwnedShips=function() { //Create button to load owned ship data
        var el=document.createElement("SPAN");

        el.appendChild(document.createTextNode("Load owned ships:"));
        var ship_file_inp=document.createElement("INPUT");
        ship_file_inp.setAttribute("type", "file");
        ship_file_inp.onchange = function(event){
            var input = event.target;
            var reader = new FileReader();
            reader.onload = function(){
                var d;
                try {
                    d = JSON.parse(reader.result);
                } catch(e) { window.alert("PoiDBTrans:\nError: Failed to parse selected file as JSON!"); return; }

                //Load ship id data
                var ship_id=trans.wctf_id;
                var ship_nm=trans.wctf_nm;

                //Process locked ship data from user's file
                var locked={};
                for(var s in d.ships) {
                    if(d.ships[s].lock!=1) continue;
                    var ss=ship_id[d.ships[s].masterId];
                    while(ss) {
                        locked[ss.name.ja_jp]=true;
                        if(ss.remodel.prev)
                            ss=ship_id[ss.remodel.prev];
                        else
                            ss=null;
                    }
                    ss=ship_id[d.ships[s].masterId];
                    while(ss) {
                        locked[ss.name.ja_jp]=true;
                        if(ss.remodel.next)
                            ss=ship_id[ss.remodel.next];
                        else
                            ss=null;
                    }
                }

                if(Object.keys(locked).length==0) {
                    window.alert("PoiDBTrans:\nUser ship list load failed!\nNo owned ships found");
                    return;
                }

                GM_SuperValue.set ("locked_ships", locked);
                window.alert("PoiDBTrans:\nUser ship list loaded OK.");
                window.location.href=window.location.href;
            };
            reader.readAsText(input.files[0]);
        };
        el.appendChild(ship_file_inp);

        var help=document.createElement("A");
        help.innerHTML="?";
        help.onclick=function() {
            alert("Use this to highlight drops that you do not own yet.\n\nFirst, use KC3Kai to export your list of owned ships:\n"+
                  "1) In Strategy Room, go to Player/Profile\n2) Click 'Export Basic Profile' and save this file somewhere\n"+
                  "3) Return to this page and click the 'Choose file' button\n4) Select the file you just saved\n"+
                  "5) If loading succeeds, a popup box will appear informing you so\n\n(Note, only heartlocked ships are counted.)");
        };
        el.appendChild(help);

        return el;
    };

    var transFunc=function() { //Main translation function
        //Wait for all data to load
        if(!trans.hasOwnProperty('ships')) return;
        if(!trans.hasOwnProperty('affix')) return;
        if(!trans.hasOwnProperty('equips')) return;
        if(!trans.hasOwnProperty('misc')) return;
        if(!trans.hasOwnProperty('wctf_id')) return;

        var locked_ships = GM_SuperValue.get ("locked_ships"); //Load user ship list
        if(locked_ships) {
            if(Object.keys(locked_ships).length==0) //Must have screwed up load
                locked_ships=null;
            else
                locked_ships["(无掉落)"]=true;
        }
        var rgx_map=/^https:\/\/db\.kcwiki\.org\/drop\/map\/\d+(\/\d)?\/[^.]+\.html$/;
        var rgx_ship=/^https:\/\/db\.kcwiki\.org\/drop\/ship\/\d+\/?$/;
        var rgx_shipConst=/^https:\/\/db\.kcwiki\.org\/construction\/ship\/\d+\.html$/;
        var rgx_equip=/^https:\/\/db\.kcwiki\.org\/development\/item\/\d+\.html$/;
        if(rgx_map.test(document.URL)) { //Map drop page
            //Translate ship names/categories
            var transShipRow=function(el) {
                var cols=el.getElementsByTagName("TD");
                var shpc=cols[1];
                if(shpc.childNodes[0].nodeType==Node.ELEMENT_NODE &&
                   !shpc.childNodes[0].hasAttribute("translated")   ) {
                    var nm=shpc.childNodes[0].innerHTML;
                    shpc.childNodes[0].innerHTML=trans_ship_name(nm);
                    if(locked_ships && !locked_ships.hasOwnProperty(nm) &&
                       nm.substr(-4)!=" ***"                              )
                        shpc.childNodes[0].innerHTML+=" ***";
                    if(trans.wctf_nm.hasOwnProperty(nm) && trans.wctf_nm[nm].links &&
                       trans.wctf_nm[nm].links[1] && trans.wctf_nm[nm].links[1].name &&
                       trans.wctf_nm[nm].links[1].name=="英文WIKI" && trans.wctf_nm[nm].links[1].url  ) {
                       var a=document.createElement("A");
                       a.setAttribute("href", trans.wctf_nm[nm].links[1].url);
                       a.style.verticalAlign="super";
                       a.innerHTML="&nbsp;?";
                       shpc.childNodes[0].insertBefore(a,null);
                    }
                    shpc.childNodes[0].setAttributeNode(document.createAttribute("translated"));
                } else if(shpc.childNodes[0].nodeType==Node.TEXT_NODE &&
                         !shpc.hasAttribute("translated")               ) {
                    var nm=shpc.childNodes[0].nodeValue;
                    shpc.childNodes[0].nodeValue=trans_ship_name(nm);
                    if(locked_ships && !locked_ships.hasOwnProperty(nm) &&
                       nm.substr(-4)!=" ***"                              )
                        shpc.childNodes[0].nodeValue+=" ***";
                    if(trans.wctf_nm.hasOwnProperty(nm) && trans.wctf_nm[nm].links &&
                       trans.wctf_nm[nm].links[1] && trans.wctf_nm[nm].links[1].name &&
                       trans.wctf_nm[nm].links[1].name=="英文WIKI" && trans.wctf_nm[nm].links[1].url  ) {
                       var a=document.createElement("A");
                       a.setAttribute("href", trans.wctf_nm[nm].links[1].url);
                       a.style.verticalAlign="super";
                       a.innerHTML="&nbsp;?";
                       shpc.insertBefore(a,shpc.childNodes[0].nextSibling);
                    }
                    shpc.setAttributeNode(document.createAttribute("translated"));
                }

                var typ=cols[2];
                if(trans.misc.hasOwnProperty(typ.innerHTML))
                    typ.innerHTML=trans.misc[typ.innerHTML];
            };

            var compTransCache={};
            var rgx_comp1=/^\s*([^(]+)\s*([(]\s*\d+\s*[)])\s*\/?/;
            var rgx_comp2=/^\s*[(]\s*([^)]+)\s*[)]/;
            var compTrans=function(el) {
                if(el.children.length==0 || el.children[0].tagName!="TD") return;
                el=el.children[0];

                if(el.children.length==0 || el.children[0].tagName!="DIV" || !el.children[0].classList.contains("table-like")) return;
                el=el.children[0];

                for(var j=1;j<el.children.length;++j) {
                    var el2=el.children[j];

                    if(el2.children.length==0 || el2.children[0].tagName!="SPAN") continue;
                    el2=el2.children[0];

                    if(compTransCache.hasOwnProperty(el2.innerHTML)) {
                        el2.innerHTML=compTransCache[el2.innerHTML];
                        continue;
                    }

                    var didTrans=false;
                    var t="";
                    var old=el2.innerHTML;
                    var match=rgx_comp1.exec(old);
                    while(match!=null) {
                        var tnm=trans_ship_name(match[1]);
                        if(tnm!=match[1]) {
                            t+=" / "+tnm+" "+match[2];
                            didTrans=true;
                        } else {
                            t+=" / "+match[1]+match[2];
                        }
                        old=old.slice(match[0].length);
                        match=rgx_comp1.exec(old);
                    }
                    t=t.slice(3);
                    match=rgx_comp2.exec(old);
                    if(match!=null) {
                        if(trans.misc.hasOwnProperty(match[1])) {
                            t+=" ("+trans.misc[match[1]]+")";
                            didTrans=true;
                        } else {
                            t+=" ("+match[1]+")";
                        }
                    } else {
                        t+=old;
                    }
                    if(!didTrans) {
                        //No trans
                        compTransCache[el2.innerHTML]=el2.innerHTML;
                        continue;
                    }

                    compTransCache[el2.innerHTML]=t;
                    el2.innerHTML=t;
                }
            };

            var trans_tr=function(el) {
                if(el instanceof jQuery) el=el.get(0);

                if(el.hasAttribute("data-index")) transShipRow(el);
                else if(el.classList.contains("detail-view")) compTrans(el);
            };
            waitForKeyElements ("tr", trans_tr);
            var rows=document.getElementsByTagName("TR");
            for(var i=0;i<rows.length;++i)
                trans_tr(rows[i]);

            waitForKeyElements("div.section-cbox-w",function(el) {
                if(el instanceof jQuery) el=el.get(0);

                el.parentElement.insertBefore(createLoadOwnedShips(), el);
            });
        } else if(document.URL=="https://db.kcwiki.org/drop/") { //Main drop page
            $(".panel-title").each(function(i,el) {
                if(el instanceof jQuery) el=el.get(0);
                if(el.innerHTML!="舰娘") return;
                el.parentElement.parentElement.parentElement.appendChild(createLoadOwnedShips());
            });
        }

        //Translate buttons/links (on all pages)
        waitForKeyElements ("a", function(el) {
            if(el instanceof jQuery) el=el.get(0);
            if( ( rgx_ship.test(el.href) || //Link to ship drop page
                  rgx_shipConst.test(el.href) ) //Or ship const page
                && trans.ships.hasOwnProperty(el.innerHTML)) {
                var nm=el.innerHTML;
                el.innerHTML=trans.ships[nm];
                if(locked_ships && !locked_ships.hasOwnProperty(nm))
                    el.style.textDecoration='underline';
            } else if(rgx_equip.test(el.href) && //Link to equip recipe page
               trans.equips.hasOwnProperty(el.innerHTML)) {
                el.innerHTML=trans.equips[el.innerHTML];
            } else if(trans.misc.hasOwnProperty(el.innerHTML)) //Miscellaneous links
                el.innerHTML=trans.misc[el.innerHTML];
        });
    };

    //***********************************
    // Load translation from KC3Kai-translations
    // (Run translation function after all are loaded)
    var do_load_data=(function() {
        //Create a function which will try to load data from a sequence of mirror urls,
        //process and cache that data if sucessful, or use cached data if missing
        var cache={};
        cache.store=GM_SuperValue.get("cache_store");
        if(!cache.store)
            cache.store={};
        cache.update_wait=0;
        cache.update_needed=false;
        cache.update=function() {
            if( --cache.update_wait > 0 )
                return;

            if(!cache.update_needed)
                return;

            GM_SuperValue.set ("cache_store", cache.store);
        };
        var load=function(name,dataType,urls,process_function) {
            if(!Array.isArray(urls))
                urls=[urls];
            var now = Date.now();

            ++cache.update_wait;

            var ajax_fail=function() {
                //If all else fails, check the cache
                if(cache.store.hasOwnProperty([name])) {
                    var data=cache.store[name].data;
                    if(process_function(data)) {
                        //success
                        var oldtime=(new Date(cache.store[name].access_time)).toLocaleString();
                        console.log('PoiDBTrans: Loaded old('+oldtime+') version of '+name);
                        if(now > cache.store[name].last_warning + 24*60*60*1000) {
                            window.alert("PoiDBTrans:\nFailed loading "+name+
                                ", using old data ("+oldtime+
                                ") instead\n\n(This warning will now be disabled for 24hrs)");
                            cache.store[name].last_warning = now;
                            cache.update_needed=true;
                        }
                    }
                    //No else, we don't cache data that fails processing
                } else {
                    console.log('PoiDBTrans: Failed loading '+name);
                    window.alert("PoiDBTrans:\nFailed loading "+name+"\nTranslation disabled.");
                }
                cache.update();
            };
            //Make a sequence of callback functions that try each url in turn if the previous fails
            for(let i=urls.length-1;i>=0;--i) {
                const oldfail=ajax_fail;
                const url=urls[i];
                ajax_fail=function() {
                    $.ajax({
                        dataType: dataType,
                        url: url,
                        cache: true
                    }).done(function( data ) {
                        try {
                            if(!process_function(data))
                                throw 'failed';
                        } catch(e) {
                            console.log('PoiDBTrans: Failed to process '+url);
                            if(e.message)
                                console.log(e.message);
                            else
                                console.log(e);
                            oldfail();
                            return;
                        }
                        //Success
                        cache.store[name]={};
                        cache.store[name].data=data;
                        cache.store[name].access_time = now;
                        cache.store[name].last_warning = now - 24*60*60*1000;
                        cache.update_needed=true;
                        cache.update();
                    }).fail(function() {
                        console.log('PoiDBTrans: Failed to access (or parse) '+url);
                        oldfail();
                    });
                };
            }
            //Kick things off
            ajax_fail();
        };
        return load;
    })();

    do_load_data('ships.json','json',[
        'https://gitcdn.xyz/repo/KC3Kai/kc3-translations/master/data/en/ships.json',
        'https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/ships.json'
        ],
        function(data) {
            trans.ships=data;
            trans.ships["(无掉落)"]="(No drop)";
            transFunc();
            return true;
        }
    );

    do_load_data('ship_affix.json','json',[
        'https://gitcdn.xyz/repo/KC3Kai/kc3-translations/master/data/en/ship_affix.json',
        'https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/ship_affix.json'
        ],
        function(data) {
            trans.affix=Object.assign({},data.suffixes,data.yomi);
            transFunc();
            return true;
        }
    );

    do_load_data('WhoCallsTheFleet_ships.nedb','text',[
        'https://gitcdn.xyz/repo/KC3Kai/KC3Kai/master/src/data/WhoCallsTheFleet_ships.nedb',
        'https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/data/WhoCallsTheFleet_ships.nedb'
        ],
        function(data) {
            if(!/^\s*{/.test(data))
                return false;

            var wctf_id={};
            var wctf_nm={};
            var ok=0;
            data.split("\n").forEach(function(line) {
                try {
                    var s=JSON.parse(line);
                    wctf_id[s.id]=s;
                    if(!wctf_nm.hasOwnProperty(s.name.ja_jp) ||
                       wctf_nm[s.name.ja_jp].id > s.id         )
                        wctf_nm[s.name.ja_jp]=s;
                    ++ok;
    //            } catch (e) { }
                } catch (e) { console.log(line); }
            });
            if(ok==0)
                return false;

            trans.wctf_id=wctf_id;
            trans.wctf_nm=wctf_nm;
            transFunc();
            return true;
        }
    );

    do_load_data('items.json','json',[
        'https://gitcdn.xyz/repo/KC3Kai/kc3-translations/master/data/en/items.json',
        'https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/items.json'
        ],
        function(data) {
            var equips=data;
            equips["(失敗)"]="Fail (Penguin)";

            trans.equips=equips;
            transFunc();
            return true;
        }
    );

    //Translation of menu/other items
    var misc={};
    //Ships
    misc["空母"]="CV(B)";
    misc["轻空母"]="CVL";
    misc["战舰"]="(F)BB(V)";
    misc["重巡洋舰"]="CA(V)";
    misc["轻巡洋舰"]="CL";
    misc["驱逐舰"]="DD";
    misc["海防舰"]="DE";
    misc["补给舰"]="AO";
    misc["扬陆舰"]="LHA";
    misc["工作舰"]="AR";
    misc["潜水舰"]="SS";
    misc["潜水空母"]="SSV";
    misc["驱逐"]="DD";
    misc["轻巡、练巡"]="CL/CLT";
    misc["重巡"]="CA";
    misc["轻母"]="CVL";
    misc["潜水母舰"]="AS";
    misc["水母"]="AV";
    misc["练习巡洋舰"]="CT";
    misc["其他"]="Other";
    //Equipment
    misc["主砲・副砲"]="Main/Secondary Gun";
    misc["魚雷"]="Torpedo";
    misc["艦載機"]="Attack Plane";
    misc["弾薬・機銃"]="Ammunition / AA Gun";
    misc["偵察機・電探"]="Reconnaissance Plane / Radar";
    misc["缶・タービン・バルジ"]="Drum / Turbine / Torp Bulge";
    misc["爆雷・ソナー"]="Depth Charge / Sonar";
    //Recipes
    misc["装備開発"]="Equipment";
    misc["艦娘建造(通常)"]="Ships (Normal)";
    misc["艦娘建造(大型)"]="Ships (LSC)";
    //Menu sections
    misc["建造统计"]="Construction";
    misc["掉落统计"]="Drops";
    misc["开发统计"]="Development";
    misc["新实装、活动限定"]="New / Event";
    //Difficulties
    misc["甲"]="Hard";
    misc["乙"]="Normal";
    misc["丙"]="Easy";
    misc["丁"]="Casual";
    //Formations
    misc["梯形陣"]="Echelon";
    misc["輪形陣"]="Diamond";
    misc["単横陣"]="Line Abreast";
    misc["単縦陣"]="Line Ahead";
    misc["複縦陣"]="Double Line";
    misc["第一警戒航行序列"]="Cruising Formation 1, anti-sub";
    misc["第二警戒航行序列"]="Cruising Formation 2, forward";
    misc["第三警戒航行序列"]="Cruising Formation 3, ring";
    misc["第四警戒航行序列"]="Cruising Formation 4, battle";
//    misc[""]="";

    trans.misc=misc;
    transFunc();
})();
