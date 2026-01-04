// ==UserScript==
// @name         PoiDBTrans
// @version      4.2
// @description  Translate ship names and menu items on db.kcwiki.org
// @author       joethedestroyr
// @license      Public Domain
// @match        https://db.kcwiki.org/*
// @grant GM_setValue
// @grant GM_getValue
// @require http://code.jquery.com/jquery-2.2.4.min.js#sha256=BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=
// @require https://greasyfork.org/scripts/30548-waitforkeyelements/code/waitForKeyElements.js?version=200253
// @require https://greasyfork.org/scripts/5279-greasemonkey-supervalues/code/GreaseMonkey_SuperValues.js?version=47932
// @namespace https://greasyfork.org/users/147977
// @downloadURL https://update.greasyfork.org/scripts/32178/PoiDBTrans.user.js
// @updateURL https://update.greasyfork.org/scripts/32178/PoiDBTrans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //***********************************
    // Translation of page items
    var trans={};

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
                } catch(e) { window.alert("Error: Failed to parse selected file as JSON!"); return; }

                //Load ship id data
                $.ajax({
                    dataType: "text",
                    //        url: 'https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/assets/js/WhoCallsTheFleetShipDb.json',
                    url: 'https://gitcdn.xyz/repo/KC3Kai/KC3Kai/master/src/assets/js/WhoCallsTheFleetShipDb.json',
                    cache: true
                }).done(function( data ) {
                    var ship_id=[];
                    var ship_nm={};

                    //Parse ship id data
                    var t=data.split("\n");
                    for(var i=0;i<t.length;++i) {
                        try {
                            var s=JSON.parse(t[i]);
                            ship_id[s.id]=s;
                            if(!ship_nm.hasOwnProperty(s.name.ja_jp) ||
                               ship_nm[s.name.ja_jp].id > s.id         )
                                ship_nm[s.name.ja_jp]=s;
                        } catch (e) { }
                    }

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
                    GM_SuperValue.set ("locked_ships", locked);
                    window.alert("User ship list loaded OK.");
                    window.location.href=window.location.href;
                }).fail(function() {
                    window.alert("User ship list load failed!\nCould not download WhoCallsTheFleetShipDb");
                });
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
        if(!trans.hasOwnProperty('equips')) return;
        if(!trans.hasOwnProperty('misc')) return;
        if(!trans.hasOwnProperty('suff')) return;

        var locked_ships = GM_SuperValue.get ("locked_ships"); //Load user ship list
        if(locked_ships) {
            if(Object.keys(locked_ships).length===0) { //Must have screwed up load, try again
                window.location.href=window.location.href;
                return;
            }
            locked_ships["(无掉落)"]=true;
        }
        var rgx_map=/^https:\/\/db\.kcwiki\.org\/drop\/map\/\d+(\/\d)?\/[^.]+\.html$/;
        var rgx_ship=/^https:\/\/db\.kcwiki\.org\/drop\/ship\/\d+\/?$/;
        var rgx_equip=/^https:\/\/db\.kcwiki\.org\/development\/item\/\d+\.html$/;
        if(rgx_map.test(document.URL)) { //Map drop page
            //Translate ship names/categories
            var transShipRow=function(el) {
                if(el instanceof jQuery) el=el.get(0);
                if(el.hasAttribute("data-index")){

                    var cols=el.getElementsByTagName("TD");
                    var shpc=cols[1];
                    if(shpc.childNodes[0].nodeType==Node.ELEMENT_NODE) {
                        var nm=shpc.childNodes[0].innerHTML;
                        if(trans.ships.hasOwnProperty(nm)) {
                            shpc.childNodes[0].innerHTML=trans.ships[nm];
                        }
                        if(locked_ships && !locked_ships.hasOwnProperty(nm) &&
                           nm.substr(-4)!=" ***"                              )
                            shpc.childNodes[0].innerHTML+=" ***";
                    } else if(shpc.childNodes[0].nodeType==Node.TEXT_NODE) {
                        var nm=shpc.childNodes[0].nodeValue;
                        if(trans.ships.hasOwnProperty(nm)) {
                            shpc.childNodes[0].nodeValue=trans.ships[nm];
                        }
                        if(locked_ships && !locked_ships.hasOwnProperty(nm) &&
                           nm.substr(-4)!=" ***"                              )
                            shpc.childNodes[0].nodeValue+=" ***";
                    }

                    var typ=cols[2];
                    if(trans.misc.hasOwnProperty(typ.innerHTML))
                        typ.innerHTML=trans.misc[typ.innerHTML];
                } else if (el.classList.contains("detail-view")) {
                    //Translation for abyssals fleets
                    var re = /[\u30a0-\u30ff\u4e00-\u9faf]+/gi;
                    var cols=el.getElementsByTagName('div');
                    //Iterate on all fleets and ignore the 2 first div for header
                    for(var j=2; j < cols.length; ++j) {
                        var shpc=cols[j];
                        //InnerHtml
                        if(shpc.childNodes[0].nodeType==Node.ELEMENT_NODE) {
                            //Replace all suffixes
                            for(var i in trans.suff) {
                                shpc.childNodes[0].innerHTML = shpc.childNodes[0].innerHTML.split(i).join(trans.suff[i]);
                            }
                            //Replace ships names
                            var nm_list = shpc.childNodes[0].innerHTML.match(re);
                            for (var i=0; i < nm_list.length; ++i) {
                                if(trans.ships.hasOwnProperty(nm_list[i])) {
                                    shpc.childNodes[0].innerHTML = shpc.childNodes[0].innerHTML.replace( nm_list[i], trans.ships[nm_list[i]]);
                                }
                            }
                        //NodeValue
                        } else if(shpc.childNodes[0].nodeType==Node.TEXT_NODE) {
                            //Replace all suffixes
                            for(var i in trans.suff) {
                                shpc.childNodes[0].nodeValue = shpc.childNodes[0].nodeValue.split(i).join(trans.suff[i]);
                            }
                            //Replace ships names
                            var nm_list = shpc.childNodes[0].nodeValue.match(re);
                            for (var i=0; i < nm_list.length; ++i) {
                                if(trans.ships.hasOwnProperty(nm_list[i])) {
                                    shpc.childNodes[0].innerHTML = shpc.childNodes[0].nodeValue.replace( nm_list[i], trans.ships[nm_list[i]]);
                                }
                            }
                        }
                    }
                }
            };
            waitForKeyElements ("tr", transShipRow);
            var rows=document.getElementsByTagName("TR");
            for(var i=0;i<rows.length;++i)
                transShipRow(rows[i]);

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
            if(rgx_ship.test(el.href) && //Link to ship drop page
               trans.ships.hasOwnProperty(el.innerHTML)) {
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
    $.ajax({
        dataType: "json",
//        url: 'https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/ships.json',
        url: 'https://gitcdn.xyz/repo/KC3Kai/kc3-translations/master/data/en/ships.json',
        cache: true
    }).done(function( data ) {
        trans.ships=data;
        trans.ships["(无掉落)"]="(No drop)";
        transFunc();
    });

    $.ajax({
        dataType: "json",
//        url: "https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/items.json",
        url: "https://gitcdn.xyz/repo/KC3Kai/kc3-translations/master/data/en/items.json",
        cache: true
    }).done(function( data ) {
        var equips=data;
        equips["(失敗)"]="Fail (Penguin)";

        trans.equips=equips;
        transFunc();
    });

    //Suffix translation
    var suff={};
    suff['後期型']=" Late Model";
    suff['-壊']=" - Damaged";
    trans.suff=suff;
    transFunc();

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
    misc["潜水舰"]="SS(V)";
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
    misc["掉落统计"]="Drops";
    misc["开发统计"]="Development";
    //Difficulties
    misc["甲"]="Hard";
    misc["乙"]="Normal";
    misc["丙"]="Easy";
//    misc[""]="";

    trans.misc=misc;
    transFunc();
})();
