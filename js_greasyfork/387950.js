// ==UserScript==
// @name         ニコニ広告 ランキング割り込みブロック
// @namespace    nicovideo.jp/user/16261157
// @version      1.0.0
// @description  ランキングに紛れ込んだニコニ広告を上部に並べ直してまとめるスクリプト
// @author       Alpha
// @match        http://www.nicovideo.jp/ranking
// @match        https://www.nicovideo.jp/ranking
// @match        http://www.nicovideo.jp/ranking?*
// @match        https://www.nicovideo.jp/ranking?*
// @match        http://www.nicovideo.jp/ranking/genre/*
// @match        https://www.nicovideo.jp/ranking/genre/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387950/%E3%83%8B%E3%82%B3%E3%83%8B%E5%BA%83%E5%91%8A%20%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E5%89%B2%E3%82%8A%E8%BE%BC%E3%81%BF%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/387950/%E3%83%8B%E3%82%B3%E3%83%8B%E5%BA%83%E5%91%8A%20%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E5%89%B2%E3%82%8A%E8%BE%BC%E3%81%BF%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function(){
    const Sls = {
        list:{type:'class', word:'RankingMainContainer'},
        item:{type:'class', word:'RankingMatrixNicoadsRow'}
    },
          DOMs = {},
          div = document.createElement('div'),
          GM_DATA = {GMV:GM_getValue('NicoRanking_AD_Toggle')};

    if(location.href.match(/^http(s|):\/\/www\.nicovideo\.jp\/ranking\/genre/)){
        Sls.list.word = 'RankingVideoListContainer';
        Sls.item.word = 'RankingMainNicoad';
    }
    (function(){
        div.innerHTML =
            '<div class="NicoAD_to_Top">'+
            '<div class="NAtT_Controller" data-ad="display">'+
            '<label class="NicoAD_Toggle"><input type="checkbox" class="NicoAD_Toggle_Check"><span>広告枠を非表示</span></input></label>'+
            '</div>'+
            '<div class="NAB"><div class="NicoAD_Frame"></div></div>'+
            '</div>'+

            '<style type="text/css">'+
            '.NicoAD_to_Top input[type="checkbox"]{margin:0 3px; vertical-align: middle; width:16px; height:16px;}\n\n'+

            '.NicoAD_Toggle{user-select:none; cursor:pointer; color:rgba(100, 100, 100, 0.64); border:1px solid rgba(100, 100, 100, 0.1); border-radius:3px; padding-right:3px; '+
            'background-color:rgba(100, 100, 100, 0.05); transition:color 0.17s, border-color 0.17s, background-color 0.17s;}\n'+
            '.NicoAD_Toggle:hover{color:#20A0FF; border-color:#20A0FF; background-color:#FFFFFF;}\n\n'+

            '.NicoAD_Frame{margin-bottom:5px; padding-bottom:5px;/* border-bottom:1px dotted;*//* background-color:rgba(255, 0, 0, 0.3);*/ max-height:436px; overflow-y:auto;}\n'+
            '.NicoAD_to_Top .NAB{border-top:1px dotted rgba(100, 100, 100, 0.5); margin-top:5px; padding-top:5px;}\n\n'+
            '.NicoAD_Frame > .RankingMatrixNicoadsRow{margin-bottom:10px;}\n\n'+

            '.NAtT_Controller[data-ad="hidden"] ~ .NAB{display:none}'+
            '</style>';
    }());
    if(!document.head) return;
    document.head.appendChild(div.getElementsByTagName('style')[0]);
    const NAtT = div.getElementsByClassName('NicoAD_to_Top')[0],
          NAF = NAtT.getElementsByClassName('NicoAD_Frame')[0],
          NAtT_Controller = NAtT.getElementsByClassName('NAtT_Controller')[0],
          NicoAD_Toggle_Check = div.getElementsByClassName('NicoAD_Toggle_Check')[0];

    if(GM_DATA.GMV && (GM_DATA.GMV === true || GM_DATA.GMV.NRAT === 'true')){
        GM_DATA.SAT = true;
        NicoAD_Toggle_Check.checked = 'checked';
        NAtT_Controller.dataset.ad = 'hidden';
    }

    NicoAD_Toggle_Check.addEventListener('change',function(){
        if(!NAtT_Controller) return;
        switch(this.checked){
                case true:
                NAtT_Controller.dataset.ad = 'hidden';
                GM_setValue('NicoRanking_AD_Toggle', true);
                break;
                case false:
                NAtT_Controller.dataset.ad = 'display';
                GM_deleteValue('NicoRanking_AD_Toggle');
                break;
        }
    });

    function Move_to_Top(Is){
        if(NAF){
            Array.prototype.slice.call(Is).forEach(function(e){
                if(e){
                    NAF.appendChild(e);
                }
            });
        }
    }

    (function(){
        function TA(e){
            return new Promise(function(resolve, reject){
                    if(!DOMs.list) DOMs.list = document.body.getElementsByClassName(Sls.list.word)[0];
                    else reject();
                    if(DOMs.list) DOMs.item = DOMs.list.getElementsByClassName(Sls.item.word)[0];
                    else reject();
                    if(DOMs.item){
                        DOMs.items = DOMs.list.getElementsByClassName(Sls.item.word);
                        resolve();
                    }
                    if(DOMs.items) console.log(DOMs.items.length);
            });
        }

        function SubOBS(a){
            if(a.target){
                const DOM = new MutationObserver(function(MutationRecords, MutationObserver){
                    console.log(MutationRecords);
                    if(!a.target) DOM.disconnect();
                    TA('S_OBS').then(function(){
                        Move_to_Top(DOMs.items);
                    })
                .catch(function(e){DOM.disconnect(); console.log(e);});
                });
                DOM.observe(a.target,{
                    childList:true
                });
            }
        }

        document.addEventListener('DOMContentLoaded',function(){
            TA('Nomal').then(function(e){
                DOMs.list.parentNode.insertBefore(NAtT, DOMs.list);
                Move_to_Top(DOMs.items);
            })
                .catch(function(e){
                if(document.body){
                    const OBS = new MutationObserver(function(MutationRecords, MutationObserver){
                        TA('OBS').then(function(e){
                            OBS.disconnect();
                            DOMs.list.parentNode.insertBefore(NAtT, DOMs.list);
                            Move_to_Top(DOMs.items);
                        }).catch(function(e){
                            OBS.disconnect();
                        });
                    });
                    OBS.observe(document.body,{
                        subtree:true,
                        childList:true
                    });
                    window.addEventListener('load',function(){
                        setTimeout(function(){
                            OBS.disconnect();
                        },1);
                    });
                }
            });
        });
    }());
})();