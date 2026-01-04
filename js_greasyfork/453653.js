// ==UserScript==
// @name         CookieSetter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.heroeswm.ru/home.php*
// @match        https://www.heroeswm.ru/

// @match        http://www.themostamazingwebsiteontheinternet.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/453653/CookieSetter.user.js
// @updateURL https://update.greasyfork.org/scripts/453653/CookieSetter.meta.js
// ==/UserScript==
// @require http://code.jquery.com/jquery-latest.js
// @require https://raw.githubusercontent.com/js-cookie/js-cookie/master/src/js.cookie.js


(function() {
    'use strict';
    var styleSheet=`
.div1{
    -webkit-text-size-adjust: none!important;
    color-scheme: only light;
    COLOR: #592C08;
    FONT-FAMILY: verdana,geneva,arial cyr;
    image-rendering: -webkit-optimize-contrast;
    font-size: 90%;
    text-align: left;
    width: 100%;
    }
.div2{
    -webkit-text-size-adjust: none!important;
    color-scheme: only light;
    COLOR: #592C08;
    FONT-FAMILY: verdana,geneva,arial cyr;
    image-rendering: -webkit-optimize-contrast;
    font-size: 90%;
    text-align: left;
    border-top: solid 1px silver;
}
.a1{
    -webkit-text-size-adjust: none!important;
    color-scheme: only light;
    image-rendering: -webkit-optimize-contrast;
    text-align: left;
    FONT-FAMILY: inherit;
    COLOR: inherit;
    text-decoration-skip-ink: none;
    font-size: inherit;
    text-decoration: none;
}
.div3{
    -webkit-text-size-adjust: none!important;
    color-scheme: only light;
    text-decoration-skip-ink: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    image-rendering: -webkit-optimize-contrast;
    color: #592C08;
    font-family: verdana,geneva,arial cyr;
    -webkit-user-select: none;
    font-size: 100%;
    line-height: 30px;
    position: relative;
    border-bottom: solid 1px silver;
    transition: background .2s;
    text-align: left;
    font-weight: bold;
}
.button{
-webkit-text-size-adjust: none!important;
color-scheme: only light;
image-rendering: -webkit-optimize-contrast;
text-align: left;
FONT-FAMILY: inherit;
COLOR: inherit;
text-decoration-skip-ink: none;
font-size: 15px;
cursor: pointer;
text-decoration: none;
width:120px;
background:none;
border:none;

    }
.tab{
       -webkit-text-size-adjust: none!important;
    color-scheme: only light;
    COLOR: #592C08;
    FONT-FAMILY: verdana,geneva,arial cyr;
    image-rendering: -webkit-optimize-contrast;
    font-size: 90%;
    width: 100%;
    margin: 0 auto;
    margin-left:8px;
    padding: 1em 0;
    display: flex;
    flex-direction: column;
    position: relative;
    background: url('../i/homeico/corner_lt2.png') no-repeat top left,url('../i/homeico/corner_rt2.png') no-repeat top right,url('../i/homeico/corner_lb2.png') no-repeat bottom left,url('../i/homeico/corner_rb2.png') no-repeat bottom right #f5f3ea;
    background-size: 14px;
    box-shadow: inset 0 0 0 1px #b19673, 0 2px 5px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    text-align: left;
    margin-top: 14px;
    align-items: center;
}

}
`;
    /*
       -webkit-text-size-adjust: none!important;
    color-scheme: only light;
    COLOR: #592C08;
    FONT-FAMILY: verdana,geneva,arial cyr;
    image-rendering: -webkit-optimize-contrast;
    font-size: 90%;
    width: 100%;
    margin: 0 auto;
    padding: 1em 0;
    display: flex;
    flex-direction: column;
    position: relative;
    background-size: 14px;
    border-radius: 3px;
    text-align: left;
    margin-top: 14px;
    align-items: center;
*/




    var s=document.createElement('Style');
    s.type="text/css";
    s.innerHTML=styleSheet;
    (document.head || document.documentElement).appendChild(s);
    var pos=document.evaluate('/html/body/center/div[2]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var pos2=document.evaluate('/html/body/center/table/tbody/tr/td/table/tbody/tr[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var pos3=document.evaluate('/html/body/center/table/tbody/tr/td/table/tbody/tr[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var pos4=document.evaluate('/html/body/form/table/tbody/tr[1]/td[2]/table/tbody/tr[2]/td[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    var acc=[
        "Super-Dragon@_ga=GA1.2.669150530.1651342409; perm_login=1; user_reg_rand_ukey=69941e7ca521bddd850f09cbaa4bbd17; home_cache=1; map_cache=1; combat_sound_on=0; combat_sound_volume=0; combat_music_volume=0; combat_show_log=true; combat_show_numbers=true; home_protocol_expand=1; hwm_pvp_g_auto=1; mot_7862677=2; combat_engine6zz=1; combat_fps6zz=60; home_numbers_showed=1; pl_id=6826244; duration=20069; duration2=36674; PHPSESSID=e312aba562bbfc5df003d473bff0a934; hwm_mob_or_support=0; inv_cat=; inv_r=1; inv_set_how=0; all_trades_from_me=1; all_trades_to_me=0; combat_chat_opened=1@Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
        "Eclipso777@_ga=GA1.2.335138950.1666040489; _gid=GA1.2.1574084252.1666040489; _ym_uid=1666037278934629161; _ym_d=1666040489; _ym_isad=2; hwm_mob_or_support=0; _gat_gtag_UA_2408617_1=1; inv_cat=; inv_r=1; _ga=GA1.2.321655856.1612361627; perm_login=1; _gid=GA1.2.134384557.1666037275; pl_id=7657740; duration=24013; duration2=35704; PHPSESSID=9cee67492e281dcca2cc5ad49e0eaf57@Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.77",
        "Bobolo@_ga=GA1.2.1186506024.1666041629; _gid=GA1.2.300301385.1666041629; _ym_uid=1666037278934629161; _ym_d=1666041630; _ym_isad=2; _ym_uid=1666037278934629161; _ym_isad=2; hwm_mob_or_support=0; _gat_gtag_UA_2408617_1=1; inv_cat=; inv_r=1; home_protocol_expand=1; _ym_d=1666040489; _ga=GA1.2.335138950.1666040489; _gid=GA1.2.1574084252.1666040489; perm_login=0; pl_id=7008204; duration=28914; duration2=19302; PHPSESSID=63615042ba1afe7dee0cb1f5e0157b16@Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.77",
        "ppap@_ga=GA1.2.1728025923.1650635686; _gid=GA1.2.143767805.1650635686; pl_id=7601932; perm_login=1; duration=29955; duration2=16511; PHPSESSID=63b34f854f10e0b9c7b45a2616e84dd8@Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.77",
        "FlyFairyFly@_ga=GA1.2.1186506024.1666041629; _gid=GA1.2.300301385.1666041629; _ym_uid=1666037278934629161; _ym_d=1666041630; _ym_isad=2; pl_id=7657726; perm_login=1; duration=36778; duration2=30267; PHPSESSID=addfebd2726d992e5a6c337205e22597; home_protocol_expand=1; _gat_gtag_UA_2408617_1=1@Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.77",
        "GGG@_ga=GA1.2.344789815.1612270439; _gid=GA1.2.1155462327.1650630352; pl_id=7619762; perm_login=1; duration=24833; duration2=14518; PHPSESSID=20a51f4884cbd24b7097a299b6991847@Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.77",
        "kltr@_ga=GA1.2.1944712099.1639411545; user_reg_rand_ukey=7191b06d89970e4056bde1a0374b512e; combat_engine6zz=1; combat_music_volume=30; combat_sound_volume=60; combat_classic_chat=true; inv_set_how=1; _gid=GA1.2.1635371789.1666633541; hwm_mob_or_support=0; inv_cat=; inv_r=1; mot_6131422=2; combat_show_numbers=true; user_reg_rand_ukey=7191b06d89970e4056bde1a0374b512e; combat_sound_on=false; arcomage_fullscreen=false; fcounter=6; home_protocol_expand=1; all_trades_to_me=1; all_trades_from_me=1; combat_small_portraits=false; clan_f_6131422=1; combat_fps6zz=60; map_hero_event_hide_d=41; _gat_gtag_UA_2408617_1=1; perm_login=1; _ga=GA1.2.1944712099.1639411545; _gid=GA1.2.1635371789.1666633541; pl_id=6131422; duration=12321; duration2=14867; PHPSESSID=36523ebf1445f77aef13520eabd7de4d@Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
        "Выход@_ga=GA0; _gid=GA0; pl_id=0; perm_login=1; duration=0; duration2=0; PHPSESSID=0@Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.77",
    ]

    /*
     var c_mult=["_ga=GA1.2.1728025923.1650635686;",
                 "_gid=GA1.2.143767805.1650635686;",
                 "pl_id=7601932;",
                 "perm_login=1;",
                 "duration=29955;",
                 "duration2=16511;",
                 "PHPSESSID=63b34f854f10e0b9c7b45a2616e84dd8"
                ]
    */
    var cont=["_ga",
              "_gid",
              "pl_id",
              "perm_login",
              "duration",
              "duration2",
              "PHPSESSID"
             ]
    var v1=[]
    var c=[]
    var tab=document.createElement('div');
    tab.className='tab';

    for(let i=0;i<acc.length;i++){

        v1[i]=acc[i].split('@')
        var btn = document.createElement('button');
        var div3=document.createElement('div');
        var a1=document.createElement('a');
        a1.className='a1';
        div3.className='div3';
        btn.innerHTML=v1[i][0];
        btn.className='button';
        btn.onclick=()=>{
            c=v1[i][1].split(';')
            for(let j=0;j<c.length;j++){
                let ok=0;
                for(let k=0;k<cont.length;k++){
                    if(c[j].match(cont[k])){
                        ok=1;
                        break;
                    }
                }
                ok=1;
                if(ok){
                    document.cookie=String(c[j])
                }
            }
            navigator.userAgent=v1[i][2]

        }

        try{
            a1.appendChild(btn);
            div3.appendChild(a1);
            var div2=document.createElement('div');
            div2.className='div2';
            div2.appendChild(div3);
            var div1=document.createElement('div');
            div1.className='div1';
            div1.appendChild(div2);
            tab.appendChild(div1);
        }
        catch{
        }

    }
    try{
        pos3.append(tab);
    }
    catch{
        try{
        pos.append(tab);
        }
        catch{
        pos4.append(tab);
        }
    }
})();
