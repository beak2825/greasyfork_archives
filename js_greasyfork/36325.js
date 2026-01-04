// ==UserScript==
// @name         ニコニ広告 検索割り込みブロック
// @namespace    nicovideo.jp/user/16261157
// @version      1.0.5
// @description  検索結果へ紛れ込んだニコニ広告を上部に並べ直してまとめるスクリプト (Chrome + Tampermonkey, FireFox + Tampermonkey にて動作確認)
// @author       Alpha
// @match        *://www.nicovideo.jp/search/*
// @match        *://www.nicovideo.jp/tag/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/36325/%E3%83%8B%E3%82%B3%E3%83%8B%E5%BA%83%E5%91%8A%20%E6%A4%9C%E7%B4%A2%E5%89%B2%E3%82%8A%E8%BE%BC%E3%81%BF%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/36325/%E3%83%8B%E3%82%B3%E3%83%8B%E5%BA%83%E5%91%8A%20%E6%A4%9C%E7%B4%A2%E5%89%B2%E3%82%8A%E8%BE%BC%E3%81%BF%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function(){
    if(document.head){
        document.head.insertAdjacentHTML('beforeend', `<style type="text/css" class="Style_of_NicoQ-Filter">
.NAM{max-width:700px; margin-bottom:4px;}
.NAM label{cursor:pointer; user-select:none;}
.ADSToggle{display:inline-block; position:absolute; top:3px; background-color:#FFFFFF; color:#999; border:1px solid #CCC; border-radius:2px; font-size:13px; padding:2px; ransition:color 0.17s, border-color 0.17s;}
.ADSToggle input[type="checkbox"] + span{margin-left:2px;}
.ADSToggle:hover{color:#69F; border-color:#8AF;}
.NAM input[type="checkbox"]{margin:initial; vertical-align:middle;}
.NAMF{list-style:none; border-bottom:1px dashed #A0A0A080; margin-top:5px;}

.NAMF.videoList01 .item, .NAMF.videoList02 .item{float:left; margin-right:20px; margin-bottom:20px; position:relative; border-bottom:none;}
.NAMF.videoList01 .item{width:100%;}
.NAMF.videoList02 .item{width:335px;}
.NAMF.videoList01 .item .itemTitle, .NAMF.videoList02 .item{font-size:12.0833px; margin-top:0;}
.NAMF.videoList02 .item:nth-child(2n+1){clear:none;}
.NAMF.video .item:nth-child(4n){margin-right:0;}
.NAMF.video:not(.videoList04) .itemData .count{font-size:11.05px;}

.videoList02 .wrap > .itemComment{max-width:160px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;}



.NAMF > li {display:inline-block; vertical-align:top;}
.NAMF.videoList04 .nicoadVideoItemWrapper .item{margin-right:15px;}

.videoList > .list:not(.videoListSkeleton) .nicoadVideoItem, .ADSToggle[data-toggle="hidden"] + .NAMF{display:none;}
.ADSToggle:has(input[type="checkbox"]:checked) + .NAMF{display:none;}

.NAM{display:none;}
.NAM div.sensitiveVideoItem{display:none;}
.NAM:has(.nicoadVideoItemWrapper[data-content-id]){display:block;}
</style>`);
    }
    else return;
    const sls = {
        list:['videoList', 'c'],
        adf:['nicoadVideoItemWrapper', 'c']
    },
          tmsd = {
              b:{bu:undefined, bu2:undefined},
              ces:{},
              bctf:window.navigator.userAgent.toLowerCase().indexOf("firefox") !== -1
          },
          div = document.createElement('div'),
          SAT = {GMV:GM_getValue('Search_AD_Toggle'), SAT:false, Value:''};
    if(SAT.GMV && (SAT.GMV === true || SAT.GMV === 'true')){
        SAT.SAT = true;
    }
    (function(){
        div.innerHTML = `<div class="NAM">
            <label class="ADSToggle"${tmsd.bctf ? ` data-toggle="${SAT.SAT ? `hidden` : `display`}"`: ``}><input type="checkbox" class="ADSToggleCheck"${SAT.SAT ? ` checked="checked"` : ``}></input>
            <span>ニコニ広告枠を非表示</span></label>
            <div class="NAMF video"></div>
            </div>`;
    }());
    tmsd.ces.NAM = div.getElementsByClassName('NAM')[0];
    tmsd.ces.NAMF = tmsd.ces.NAM.getElementsByClassName('NAMF')[0];
    if(tmsd.bctf) tmsd.ces.ADST = tmsd.ces.NAM.getElementsByClassName('ADSToggle')[0];

    tmsd.ces.NAM.getElementsByClassName('ADSToggleCheck')[0].addEventListener('change',function(){
        switch(this.checked){
            case true:
                GM_setValue('Search_AD_Toggle', true);
                if(tmsd.bctf && tmsd.ces.ADST) tmsd.ces.ADST.dataset.toggle = 'hidden';
                break;
            case false:
            default:
                GM_setValue('Search_AD_Toggle', false);
                if(tmsd.bctf && tmsd.ces.ADST) tmsd.ces.ADST.dataset.toggle = 'display';
                break;
        }
    });

    async function ta(a){
        if(a && a.s && a.s[0] && a.s[1] && /^[icst]$/i.test(a.s[1]) && document.body){
            let p;
            if(a.pn) p = a.pn;
            else if(a.s[1] === 'i') p = document;
            else p = document.body;
            switch(a.s[1]){
                case 'i':
                    return document.getElementById(a.s[0]);
                case 'c':
                    if(a.o) return p.getElementsByClassName(a.s[0])[0];
                    else return p.getElementsByClassName(a.s[0]);
                    break;
                case 't':
                    if(a.s[0] === 'body') return document.body;
                    else if(a.o) return p.getElementsByTagName(a.s[0])[0];
                    else return p.getElementsByTagName(a.s[0]);
                    break;
                case 's':
                    if(a.o) return p.querySelector(a.s[0]);
                    else return p.querySelectorAll(a.s[0]);
                    break;
            }
        }
        else return false;
    }

    function main(a){
        if(a && Array.isArray(a) && a.length){
            tmsd.ces.N_Frame = document.body.getElementsByClassName('column')[0];
            tmsd.ces.VL = document.body.getElementsByClassName('videoList')[0];
            if(tmsd.ces.VL && tmsd.ces.VL.className.match(/videoList\d{2}/)) tmsd.ces.NAMF.className = 'NAMF video ' + tmsd.ces.VL.className.match(/videoList\d{2}/)[0];
            if(tmsd.ces.N_Frame) tmsd.ces.N_Frame.insertBefore(tmsd.ces.NAM, tmsd.ces.N_Frame.firstChild);
            if(tmsd.ces.NAMF){
                Promise.all(
                    a.map(async function(m){
                        tmsd.ces.NAMF.appendChild(m);
                        return true;
                    })
                )
                    .then(function(e){
                    if(tmsd.bctf && 3 < e.length) tmsd.ces.NAM.style.display = 'block';
                    delete sls.list;
                    delete sls.item;
                    delete sls.adf;
                    delete tmsd.ces.NAMF;
                    if(tmsd.bctf && tmsd.bctf !== undefined && tmsd.bctf !== true) delete tmsd.bctf;
                })
                    .catch(function(er){console.error(er);});
            }
        }
    }

    function sta(a){
        return ta({s:sls.adf, pn:a})
            .then(function(r){
            if(r){
                tmsd.b.bu2 = false;
                tmsd.ces.i = Array.prototype.slice.call(r);
                main(tmsd.ces.i);
            }
        })
            .catch(function(er){console.error(er)});
    }

    function tal(){
        ta({s:sls.list, o:true})
            .then(function(r){
            if(r){
                tmsd.b.bu = false;
                tmsd.ces.list = r;
                sta(tmsd.ces.list);
            }
        });
    }

    function cb(){
        if(tmsd.b.bu !== false) tal();
        else if(tmsd.b.bu2 !== false) sta(tmsd.ces.list);
    }

    if(document.body) cb();

    document.addEventListener('readystatechange',function(t){
        setTimeout(function(){
            cb();
        },1);
    });
})();