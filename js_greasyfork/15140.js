// ==UserScript==
// @name        ハースストーン海外サイト日本語カード化
// @namespace   hearthstonejapaneseconverter
// @description 海外のハースストーンサイトのカード名を英語から日本語にします
// @version 1.0.4
// @include     http://www.hearthpwn.com/*
// @include     http://www.icy-veins.com/*
// @include     http://www.hearthstonetopdeck.com/*
// @include     http://www.hearthstonetopdecks.com/*
// @include     http://www.liquidhearth.com/*
// @include     http://www.heartharena.com/*
// @include     http://www.arenavalue.com/*
// @include     http://hs.inven.co.kr/*
// @include http://gametsg.techbang.com/hs*
// @include http://www.hearthhead.com/*
// @include http://hearthstoneplayers.com/*
// @include http://hearthstone.metabomb.net/*
// @include https://docs.google.com/spreadsheets/d/1PM8jptHcItFM_3BNDbtzeea4Yc_vF87R8EECa0kdASU*
// @include https://docs.google.com/spreadsheet/pub?key=0AsKyuF-D-OHadEJQYjlPbzByclBXZUNZcE1PcXdydXc*
// @include https://docs.google.com/spreadsheets/d/1BZp5ASUI5GJLNBDW0EhHCjmQlk3ZGjBpRaQ5Rax1WHs/*
// @match   https://tempostorm.com/hearthstone/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/15140/%E3%83%8F%E3%83%BC%E3%82%B9%E3%82%B9%E3%83%88%E3%83%BC%E3%83%B3%E6%B5%B7%E5%A4%96%E3%82%B5%E3%82%A4%E3%83%88%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%82%AB%E3%83%BC%E3%83%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/15140/%E3%83%8F%E3%83%BC%E3%82%B9%E3%82%B9%E3%83%88%E3%83%BC%E3%83%B3%E6%B5%B7%E5%A4%96%E3%82%B5%E3%82%A4%E3%83%88%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%82%AB%E3%83%BC%E3%83%89%E5%8C%96.meta.js
// ==/UserScript==
"use strict";

this.$ = this.jQuery = jQuery.noConflict(true);
var HRSJPC = HRSJPC || {
};
HRSJPC.alst = {
  'hearthpwn.com': [
    'body',
    {
      path: 'cards/',
      getnodes: {
        tag: 'h2'
      }
    },
    {
      path: 'decks',
      getnodes: {
        tag: 'option'
      },
      postProcess: function (rt) {
        var d1 = document.getElementById('filter-contains-card');
        var d2 = document.getElementById('filter-not-contains-card');
        if (!d1) {
          return;
        }
        HRSJPC.gm.sortSelect(d1);
        HRSJPC.gm.sortSelect(d2);
       //for chrome
       $("#filter-contains-card").trigger("chosen:updated");
       $("#finter-not-contains-card").trigger("chosen:updated");
        }
      
    },
    {
      path: 'decks',
      postProcess: function (rt) {
        
        var d = document.getElementById('dynamic-filters');
        if (!d) {
          return;
        }
        
        var m = d.nextElementSibling;
        var pl = HRSJPC.gm.pwords;
        var tm = m.innerHTML;
        for (var i = pl.length-1;i>=0;--i) {
          
          tm = tm.replace('"'+pl[i][0]+'"','"'+pl[i][1]+'"');
        }
        m.innerHTML =tm;
        eval(tm);
       
       //unsafeWindow.DynamicFilters();
      }
    }
  ],
  'www.icy-veins.com': 'body',
  'hearthstonetopdecks.com': [
    {
      root: '#main',
      getnodes: [
        {
          "class": 'card-name'
        },
        {
          tag: 'a'
        }
      ]
    },
    {
      path: 'cards/',
      root: '#main',
      getnodes: {
        "class": 'entry-title'
      }
    },
    {
      path: 'card-category/',
      root: '#main',
      getnodes: {
        tag: 'h2'
      }
    },
    {
      path: 'deck-category',
      root: '#cat-card-sort',
      getnodes: {
        tag: 'option'
      }
    },
    {
      path: 'card-category',
      root: 'div.col-md-8:nth-child(6) > fieldset:nth-child(1) > select:nth-child(2)',
      getnodes: {
        tag: 'option'
      },
      pwords: true,splitmatch:true
    }
  ],
  'www.hearthstonetopdeck.com': {
    path: 'deck/',
    getnodes: {
      "class": 'cardname'
    },
    regex: /^\d\s(.+)$/
  },
  'www.liquidhearth.com': 'body',
  'tempostorm.com/hearthstone': [
    {
      /*path: /decks|meta-snapshot|deck-builder/,*/
      postProcess: function (rt) {
        
        waitForKeyElements('.tech-card-body', single);
        waitForKeyElements('.db-deck-card-name', single);
        waitForKeyElements('div.list-card', roop2);
        waitForKeyElements('.deck-list', roop2);
        var target = rt.querySelector('.deck-list');
        if (!target) {
          return;
        }
        roop2(target);
        var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.type ==
            'childList') {
              ;
              roop2(mutation.target);
            }
          });
        });
        var config = {
          childList: true
        }
        observer.observe(target, config);
        function roop2(tobj) {
          var cl = document.getElementsByClassName('list-card');
          HRSJPC.gm.link(HRSJPC.gm.hcards, 0, cl);
        }
        function single(tobj) {
          
          for (var i = 0; i < tobj.length; i++) {
            var txnode = HRSJPC.gm.textnodeextract(tobj[i]);
            if (!txnode) {
              continue;
            }
            var tx = txnode.nodeValue.trim();
            ;
            var m = HRSJPC.gm.wordmatch(HRSJPC.gm.hcards, 0, tx);
            if (m) {
              txnode.nodeValue = m;
            }
          }
        }
      }
    }
  ],
  'www.heartharena.com': {
    root: 'body#tier-list',
    getnodes: {
      tag: 'dt'
    }
  },
  'www.arenavalue.com': [
    {
      root: '#home > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)',
      getnodes: {
        tag: 'option'
      },
      postProcess: function (rt) {
        
        var sec = rt.getElementsByTagName('select');
        for (var i = sec.lnegth-1;i>=0;--i) {
          HRSJPC.gm.sortSelect(sec[i]);
        }
        
      }
    },
    {
      path: 'class/',
      getnodes: {
        tag: 'p'
      },
      root: '#home > div:nth-child(3)',
      ignore: true,
      pwords: true
    },
    {
      path: 'class/',
      postProcess: function (rt) {
        var d = document.getElementById('deck');
        var observer = new MutationObserver(function (mutations) {
          dlist(d);
        });
        var config = {
          childList: true,
          characterData: true,
          attributes: true,
          subtree: true
        };
        observer.observe(d, config);
        function dlist(tg) {
          var dg = tg.getElementsByTagName('div');
          HRSJPC.gm.link(HRSJPC.gm.hcards, 0, dg, /(^.+?)( x \d)?$/);
        }
      }
    }
  ],
  'hs.inven.co.kr': [
    {
      path: 'dataninfo/deck/',
      root: '#hsBody',
      getnodes: {
        tag: 'li'
      },
      lang: 3,
      delay: true,
      limitlength: 10
    },
    {
      path: 'dataninfo/deck/',
      root: '.hsDbCommonTop',
      getnodes: [
        {
          tag: 'label'
        },
        {
          tag: 'b'
        },
        {
          tag: 'span'
        },
        {
          "class": 'name'
        }
      ],
      lang: 3,
      delay: true,
      pwords: true
    },
    {root:"#hsHeadmenu",getnodes:{tag:"a"},lang:3,pwords:true,id:20}
  ],"gametsg.techbang.com/hs":{path:"deck",postProcessOnly:true,postProcess:function(){
    
    

    
     var rt = document.getElementById("card_table");
      if(!rt){
        return;
      }
      var d = rt.getElementsByClassName("mid1");
      
      for (var i =0;i<d.length;i++){
        var c = d[i].parentNode.lastChild;
          if(c){
            var cm = c.nodeValue;
            if(cm){      
                cm = cm.trim();
              var m = HRSJPC.gm.wordmatch(HRSJPC.gm.hcards, 0, cm);
              if (m) {
                var txr = HRSJPC.gm.textnodeextract(d[i]);
                if(txr){
                  txr.nodeValue = m;
                }
              }
            }
          }   
      }
  }
  },
  "www.hearthhead.com":{getnodes:{tag:"span"}}
  ,
  "hearthstoneplayers.com":{getnodes:{class:"card-title"}},
  "hearthstone.metabomb.net":{getnodes:{tag:"span"}}
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
HRSJPC.gm = {
  _hcards: undefined,
  _pwords: undefined,
  get hcards() {
    if (!this._hcards) {
      this._hcards = this.hlist();
    }
    return this._hcards;
  },
  get pwords() {
    if (!this._pwords) {
      this._pwords = this.plist();
    }
    return this._pwords;
  },
  main: function () {
    //iframe google docs
    if (document.URL.indexOf('docs.google.com') >= 0) {
      ;
      this.googlelink();
      return;
    }
    /*
  if(document.URL.indexOf("docs.google.com")>= 0){
    var ct = GM_getValue("hearthstone",0);
        ;
    if(ct === 0){
    GM_deleteValue("hearthstone");
     return;
    }else{
      GM_setValue("hearthstone",--ct);
    }
   ;
  googlelink();
  return;
}

  
  if(document.URL.indexOf("www.liquidhearth.com/guides/arena-tier-list") >= 0){
    var f = document.getElementsByTagName("iframe");

     ct = 0;
    for(var i = 0;i<f.length;i++){
       if(f[i].src.indexOf("docs.google.com">=0)){
          ct ++;
        
        
      }
    }
     GM_setValue("hearthstone",ct);
  }
  */

    var fnc = function (obj) {
      
      if(obj.postProcessOnly){
        
        obj.postProcess();
        return;
      }
      
      var robj = document.querySelector(obj.root);
      
      if (!robj) {
        return;
      }
      if (!obj.getnodes) {
        obj.getnodes = {
          tag: 'a'
        };
      }
      var nodesarry,td,tcd;
      if (typeof obj.getnodes == 'function') {
        td = obj.getnodes(robj);
        nodesarry = [td];
      } else if (typeof obj.getnodes == 'object') {
        if (!Array.isArray(obj.getnodes)) {
          obj.getnodes = [
            obj.getnodes
          ];
        }
        nodesarry = [];
        for (var g in obj.getnodes) {
          if ('tag' in obj.getnodes[g]) {
            nodesarry.push(robj.getElementsByTagName(obj.getnodes[g].tag));
          } else if ('class' in obj.getnodes[g]) {
            nodesarry.push(robj.getElementsByClassName(obj.getnodes[g].class));
          }
        }
        if (obj.pwords) {
          tcd = HRSJPC.gm.pwords;
        } else {
          tcd = HRSJPC.gm.hcards;
        }
        var lang;
        if (obj.lang) {
          lang = obj.lang;
        } else {
          lang = 0;
        }
      }
      
      for (var nodes in nodesarry) {
      //
        HRSJPC.gm.link(tcd, lang, nodesarry[nodes], obj.regex, obj.ignore, obj.limitlength,obj.splitmatch);
      }
      if (obj.postProcess) {
        obj.postProcess(robj);
      }
     
    }
    function chksite(element, index, array) {
      
      
      if (typeof element == 'string') { //string
        var em = {
        };
        em.root = element;
        em.getnodes = {
          tag: 'a'
        };
        element = em;
      } else {
        if (element.path) {
          var mc = false;
          var path = window.location.pathname + window.location.search;
          if (typeof element.path == 'string') {
            
            mc = path.indexOf(element.path) >= 0;
          } else if (element.path instanceof RegExp) {
            mc = element.path.test(path);
          }
            if (!mc) {
                
                return;
              }
        }

 
        
       
        if (!element.postProcessOnly && !('root' in element)) {
           element.root = 'body';
        }
        if ('postProcess' in element) {
          element.postProcess = element.postProcess.bind(element);
        }
      }
      if (window.top != window.self && !element.inner) {
        
        return;
      }
      if (element.delay) {
        ;
        var ov = function (e) {
          if (document.readyState == 'complete') {
            //setTimeout(fnc,7000,element);
            fnc(element);
          }
        };
        document.addEventListener('readystatechange', ov, false);
        //document.onreadystatechange = ov;
      } else {
        fnc(element);
      }
    }
    var u;
    var url = document.URL;
    function hr() {
      
      for (var al in HRSJPC.alst) {
        if (url.indexOf(al) >= 0) {
          u = HRSJPC.alst[al];
          ;
          if (!Array.isArray(u)) {
            u = [
              u
            ];
          }
          
          u.forEach(chksite);
          break;
        }
      }
      //for end

    }
    hr();
    
  },
  link: function (list, langno, docs, regex, ignore, limitlength,splitmatch) {

    var regf = regex ? true : false;
    var tx,
    bn,
    m,
    rga;
    for (var i =docs.length-1;i >= 0 ; --i) {
      
      tx = this.textnodeextract(docs[i]);
      
      if (tx) {
        if (regf) {
          rga = regex.exec(tx.extracttext);
          //;
          bn = rga[1];
          if (!bn) {
            ;
            return;
          }
        } else {
          bn = tx.extracttext;
          //;
        };
        
        
        if(splitmatch){
           var sp = bn.split(" ");
          
          m = "";
          var tm;
          
          for(var i = 0;i<sp.length;i++){         
             tm =  this.wordmatch(list,langno,sp[i],ignore,limitlength);
            m += tm ? tm : sp[i];
          }
       
        }else{
          m = this.wordmatch(list, langno, bn, ignore, limitlength);
        }
        //
        
          if (m) {
          if (!regf) {
            tx.nodeValue = m;
          } else {
            tx.nodeValue = tx.nodeValue.replace(bn, m);
          }
        }
      }
    }
  },
  googlelink: function () {
    var rg = /([^*‡†]+)/;
    var tg = document.getElementsByTagName('td');
    this.link(this.hcards, 0, tg, rg, true);
  },
  wordmatch: function (arry, arryno, target, ignore, limitlength) {
    
    
    target = format(target, false,ignore, limitlength);
    
    for (var i = arry.length-1;i >= 0 ;--i) {
         if(arry[i][arryno]){
            if (format(arry[i][arryno],true, ignore, limitlength) === target) {
            return arry[i][1];
          }
         }
    }
    
    function format(t,myaf,match, limit) {
      
      if (ignore) {
        t = t.toLowerCase().replace(/[\s:\-’']/g,"");
      }
      else{
        if(!myaf){
           
            t = t.replace(/[’']/g,"").replace(": ",':');
           
          }   
      }
      
      if (limit) {
        t = t.substring(0, limitlength);
      }
      return t;
    }
    
    
  },
  textnodeextract: function (dt, deepct, deeplimit) {
    if (!dt || !dt.hasChildNodes) {
      return;
    }
    for (var j = 0; j < dt.childNodes.length; j++) {
      var nd = dt.childNodes[j];
      if (nd.nodeType === 3) {
        var f = nd.nodeValue.trim();
        if (this.byteLength(f) >= 3) {
          dt.childNodes[j].extracttext = f;
          return dt.childNodes[j];
        }
      } else if (nd.nodeType === 1 && nd.hasChildNodes) {
        if (!deepct) {
          deepct = 0;
        }
        if (!deeplimit) {
          deeplimit = 2;
        }
        if (deepct >= deeplimit) {
          return;
        }
        deepct++;
        var r = this.textnodeextract(nd, deepct, deeplimit);
        if (r) {
          return r;
        }
      }
    }
  },
  byteLength: function (str) {
    // returns the byte length of an utf8 string
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
      var code = str.charCodeAt(i);
      if (code > 127 && code <= 2047) s++;
       else if (code > 2047 && code <= 65535) s += 2;
    }
    return s;
  },
  sortSelect: function (selElem) {
    var tmpAry = new Array();
    for (var i = 0; i < selElem.options.length; i++) {
      tmpAry[i] = new Array();
      tmpAry[i][0] = selElem.options[i].text;
      tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
      selElem.options[0] = null;
    }
    for (var i = 0; i < tmpAry.length; i++) {
      var op = new Option(tmpAry[i][0], tmpAry[i][1]);
      selElem.options[i] = op;
    }
    return;
  },
  hlist: function () {
    return [
    ['Lantern of Power',
    '力のランタン',
    '',
    ''],
    [
      'Mirror of Doom',
      '破滅の鏡',
      '',
      ''
    ],
    [
      'Timepiece of Horror',
      '恐怖時計',
      '',
      ''
    ],
    [
      'Djinny of Zephyrs',
      '西風の精',
      '',
      ''
    ],
    [
      'Hunters Mark',
      'ハンターズ・マーク',
      '猎人印记',
      '사냥꾼의 징표'
    ],
    [
      'Leokk',
      'レオック',
      '',
      ''
    ],
    [
      'Abomination',
      '涜れしもの',
      '憎恶',
      '누더기골렘'
    ],
    [
      'Abusive Sergeant',
      '鬼軍曹',
      '叫嚣的中士',
      '가혹한 하사관'
    ],
    [
      'Acidic Swamp Ooze',
      '酸性沼ウーズ',
      '酸性沼泽软泥怪',
      '산성 늪수액괴물'
    ],
    [
      'Acidmaw',
      'アシッドモー',
      '酸喉',
      '산성아귀'
    ],
    [
      'Acolyte of Pain',
      '苦痛の侍祭',
      '苦痛侍僧',
      '고통의 수행사제'
    ],
    [
      'AlAkir the Windlord',
      '風の王アラキア',
      '风领主奥拉基尔',
      '바람의 군주 알아키르'
    ],
    [
      'Alarm-o-Bot',
      'アラームロボ',
      '报警机器人',
      '노움 자동경보기'
    ],
    [
      'Aldor Peacekeeper',
      'アルダーの平和の番人',
      '奥尔多卫士',
      '알도르 평화감시단'
    ],
    [
      'Alexstrasza',
      'アレクストラーザ',
      '阿莱克丝塔萨',
      '알렉스트라자'
    ],
    [
      'Alexstraszas Champion',
      'アレクストラーザの勇者',
      '阿莱克丝塔萨的勇士',
      '알렉스트라자의 용사'
    ],
    [
      'Amani Berserker',
      'アマニの狂戦士',
      '阿曼尼狂战士',
      '아마니 광전사'
    ],
    [
      'Ancestors Call',
      '祖霊の声',
      '先祖召唤',
      '선조의 부름'
    ],
    [
      'Ancestral Healing',
      '祖霊の癒し',
      '先祖治疗',
      '선인의 치유력'
    ],
    [
      'Ancestral Knowledge',
      '祖霊の知識',
      '先祖知识',
      '선조의 지혜'
    ],
    [
      'Ancestral Spirit',
      '祖霊の導き',
      '先祖之魂',
      '고대의 영혼'
    ],
    [
      'Ancient Brewmaster',
      '老練の酒造大師',
      '年迈的酒仙',
      '고대의 양조사'
    ],
    [
      'Ancient Mage',
      '老練のメイジ',
      '年迈的法师',
      '고대의 마법사'
    ],
    [
      'Ancient of Lore',
      '知識の古代樹',
      '知识古树',
      '지식의 고대정령'
    ],
    [
      'Ancient of War',
      '戦の古代樹',
      '战争古树',
      '전쟁의 고대정령'
    ],
    [
      'Ancient Shade',
      '古代のシェード',
      '远古暗影',
      '고대의 망령'
    ],
    [
      'Ancient Watcher',
      '古代の番人',
      '上古看守者',
      '고대의 감시자'
    ],
    [
      'Angry Chicken',
      'アングリーチキン',
      '愤怒的小鸡',
      '화난 닭'
    ],
    [
      'Anima Golem',
      'アニマ・ゴーレム',
      '心能魔像',
      '령 골렘'
    ],
    [
      'Animal Companion',
      '獣の相棒',
      '动物伙伴',
      '야생의 벗'
    ],
    [
      'Animated Armor',
      '操られた鎧',
      '复活的铠甲',
      '살아 움직이는 갑옷'
    ],
    [
      'Annoy-o-Tron',
      'マジウザ・オ・トロン',
      '吵吵机器人',
      '안녕로봇'
    ],
    [
      'Anodized Robo Cub',
      'アルマイト・ロボペット',
      '电镀机械熊仔',
      '양극 처리 로봇 새끼곰'
    ],
    [
      'Antique Healbot',
      '骨董品のヒールロボ',
      '老式治疗机器人',
      '낡은 치유로봇'
    ],
    [
      'Anubar Ambusher',
      'アヌバー・アンブッシャー',
      '阿努巴尔伏击者',
      '아눕아르 복병'
    ],
    [
      'Anubarak',
      'アヌバラク',
      '阿努巴拉克',
      '아눕아락'
    ],
    [
      'Anubisath Sentinel',
      'アヌビサス・センチネル',
      '阿努比萨斯哨兵',
      '아누비사스 파수병'
    ],
    [
      'Anyfin Can Happen',
      '七つの鯛罪',
      '亡者归来',
      '무엇이든 가능하다옳'
    ],
    [
      'Arathi Weaponsmith',
      'アラシの武器職人',
      '阿拉希武器匠',
      '아라시 무기제작자'
    ],
    [
      'Arcane Blast',
      '魔力の炸裂',
      '奥术冲击',
      '비전 작렬'
    ],
    [
      'Arcane Explosion',
      '魔力の爆発',
      '魔爆术',
      '신비한 폭발'
    ],
    [
      'Arcane Golem',
      '魔力のゴーレム',
      '奥术傀儡',
      '비전 골렘'
    ],
    [
      'Arcane Intellect',
      '魔力なる知性',
      '奥术智慧',
      '신비한 지능'
    ],
    [
      'Arcane Missiles',
      '魔力の矢',
      '奥术飞弹',
      '신비한 화살'
    ],
    [
      'Arcane Nullifier X-21',
      'アーケン・ヌリファイアーX-21',
      '施法者克星X-21',
      '자동화 마력제거기 X-21'
    ],
    [
      'Arcane Shot',
      '魔力の一矢',
      '奥术射击',
      '신비한 사격'
    ],
    [
      'Arcanite Reaper',
      'アルカナイト・リーパー',
      '奥金斧',
      '아케이나이트 도끼'
    ],
    [
      'Arch-Thief Rafaam',
      '大怪盗ラファーム',
      '虚灵窃贼拉法姆',
      '대도 라팜'
    ],
    [
      'Archmage Antonidas',
      '大魔術師アントニダス',
      '大法师安东尼达斯',
      '대마법사 안토니다스'
    ],
    [
      'Archmage',
      '大魔術師',
      '大法师',
      '대마법사'
    ],
    [
      'Argent Commander',
      'アージェントの司令官',
      '银色指挥官',
      '은빛십자군 부대장'
    ],
    [
      'Argent Horserider',
      'アージェントの騎兵',
      '银色骑手',
      '은빛십자군 기수'
    ],
    [
      'Argent Lance',
      'アージェント・ランス',
      '白银之枪',
      '은빛십자군 창'
    ],
    [
      'Argent Protector',
      'アージェントの護衛',
      '银色保卫者',
      '여명회 파수병'
    ],
    [
      'Argent Squire',
      'アージェントの従騎士',
      '银色侍从',
      '은빛십자군 종자'
    ],
    [
      'Argent Watchman',
      'アージェントの衛兵',
      '银色警卫',
      '은빛십자군 경비병'
    ],
    [
      'Armored Warhorse',
      '重装戦馬',
      '重甲战马',
      '중무장 전투마'
    ],
    [
      'Armorsmith',
      '鎧職人',
      '铸甲师',
      '방어구 제작자'
    ],
    [
      'Ashbringer',
      'アッシュブリンガー',
      '',
      ''
    ],
    [
      'Assassins Blade',
      'アサシンブレード',
      '刺客之刃',
      '암살자의 검'
    ],
    [
      'Assassinate',
      '暗殺',
      '刺杀',
      '암살'
    ],
    [
      'Astral Communion',
      '星霊交信',
      '星界沟通',
      '천공의 교감'
    ],
    [
      'Auchenai Soulpriest',
      'オウケナイのソウルプリースト',
      '奥金尼灵魂祭司',
      '아키나이 영혼사제'
    ],
    [
      'Avenge',
      '仇討',
      '复仇',
      '앙갚음'
    ],
    [
      'Avenging Wrath',
      '報復の怒り',
      '复仇之怒',
      '응징의 격노'
    ],
    [
      'Aviana',
      'アヴィアナ',
      '艾维娜',
      '아비아나'
    ],
    [
      'Axe Flinger',
      'アックスフリンガー',
      '掷斧者',
      '도끼 투척수'
    ],
    [
      'Azure Drake',
      'アジュア・ドレイク',
      '碧蓝幼龙',
      '하늘빛 비룡'
    ],
    [
      'Backstab',
      '死角からの一刺し',
      '背刺',
      '기습'
    ],
    [
      'Ball of Spiders',
      '群がるクモ',
      '天降蛛群',
      '거미떼'
    ],
    [
      'Bane of Doom',
      '破滅に至る病',
      '末日灾祸',
      '운명의 파멸'
    ],
    [
      'Baron Geddon',
      'バロン・ゲドン',
      '迦顿男爵',
      '남작 게돈'
    ],
    [
      'Baron Rivendare',
      'バロン・リーヴェンデア',
      '瑞文戴尔男爵',
      '남작 리븐데어'
    ],
    [
      'Bash',
      '強打',
      '怒袭',
      '강타'
    ],
    [
      'Battle Rage',
      '狂瀾怒濤',
      '战斗怒火',
      '전투 격노'
    ],
    [
      'Bear Trap',
      'クマの罠',
      '捕熊陷阱',
      '곰 덫'
    ],
    [
      'Beneath the Grounds',
      '土蜘蛛',
      '危机四伏',
      '땅속의 위협'
    ],
    [
      'Bestial Wrath',
      '野獣の怒り',
      '狂野怒火',
      '야수의 격노'
    ],
    [
      'Betrayal',
      '裏切り',
      '背叛',
      '배신'
    ],
    [
      'Big Game Hunter',
      '大物ハンター',
      '王牌猎人',
      '나 이런 사냥꾼이야'
    ],
    [
      'Bite',
      '噛み付き',
      '撕咬',
      '물기'
    ],
    [
      'Blackwing Corruptor',
      'ブラックウィングの変性者',
      '黑翼腐蚀者',
      '검은날개 타락자'
    ],
    [
      'Blackwing Technician',
      'ブラックウィングの技術者',
      '黑翼技师',
      '검은날개 기술병'
    ],
    [
      'Blade Flurry',
      '千刃乱舞',
      '剑刃乱舞',
      '폭풍의 칼날'
    ],
    [
      'Blessed Champion',
      '祝福されし勇者',
      '受祝福的勇士',
      '축복받은 용사'
    ],
    [
      'Blessing of Kings',
      '王の祝福',
      '王者祝福',
      '왕의 축복'
    ],
    [
      'Blessing of Wisdom',
      '知恵の祝福',
      '智慧祝福',
      '지혜의 축복'
    ],
    [
      'Blingtron 3000',
      'ブリングトロン3000',
      '布林顿3000型',
      '블링트론 3000'
    ],
    [
      'Blizzard',
      'ブリザード',
      '暴风雪',
      '눈보라'
    ],
    [
      'Blood Imp',
      'ブラッドインプ',
      '鲜血小鬼',
      '피의 임프'
    ],
    [
      'Blood Knight',
      'ブラッドナイト',
      '血骑士',
      '혈기사'
    ],
    [
      'Bloodfen Raptor',
      'ブラッドフェン・ラプター',
      '血沼迅猛龙',
      '붉은늪지랩터'
    ],
    [
      'Bloodlust',
      '血の渇き',
      '嗜血',
      '피의 욕망'
    ],
    [
      'Bloodmage Thalnos',
      'ブラッドメイジ・サルノス',
      '血法师萨尔诺斯',
      '혈법사 탈노스'
    ],
    [
      'Bloodsail Corsair',
      'ブラッドセイルの海賊',
      '血帆海盗',
      '붉은해적단 바다사냥꾼'
    ],
    [
      'Bloodsail Raider',
      'ブラッドセイルの略奪者',
      '血帆袭击者',
      '붉은해적단 약탈자'
    ],
    [
      'Bluegill Warrior',
      'ブルーギル・ウォリアー',
      '蓝腮战士',
      '푸른아가미 전사'
    ],
    [
      'Bolf Ramshield',
      'ボルフ・ラムシールド',
      '博尔夫·碎盾',
      '볼프 램실드'
    ],
    [
      'Bolster',
      '奮起',
      '加固',
      '고무'
    ],
    [
      'Bolvar Fordragon',
      'ボルヴァー・フォードラゴン',
      '伯瓦尔·弗塔根',
      '볼바르 폴드라곤'
    ],
    [
      'Bomb Lobber',
      'ボム・ロバー',
      '榴弹投手',
      '폭탄 투척수'
    ],
    [
      'Boneguard Lieutenant',
      'ボーンガード将校',
      '白骨卫士军官',
      '해골경비대 부관'
    ],
    [
      'Booty Bay Bodyguard',
      'ブーティ・ベイのボディガード',
      '藏宝海湾保镖',
      '무법항 경호원'
    ],
    [
      'Boulderfist Ogre',
      'ボルダーフィストのオーガ',
      '石拳食人魔',
      '돌주먹 오우거'
    ],
    [
      'Bouncing Blade',
      '跳ね回る刃',
      '弹射之刃',
      '날뛰는 톱날'
    ],
    [
      'Brann Bronzebeard',
      'ブラン・ブロンズビアード',
      '布莱恩·铜须',
      '브란 브론즈비어드'
    ],
    [
      'Brave Archer',
      '勇敢なる射手',
      '神勇弓箭手',
      '용감한 궁수'
    ],
    [
      'Brawl',
      '乱闘',
      '绝命乱斗',
      '난투'
    ],
    [
      'Buccaneer',
      'バッカニーア',
      '锈水海盗',
      '해적단원'
    ],
    [
      'Burgle',
      '強盗',
      '剽窃',
      '도둑질'
    ],
    [
      'Burly Rockjaw Trogg',
      'バーリー・ロックジョー・トログ',
      '石腭穴居人壮汉',
      '힘센 바위턱트로그'
    ],
    [
      'Cabal Shadow Priest',
      'カバルの影の僧侶',
      '秘教暗影祭司',
      '비밀결사단 어둠사제'
    ],
    [
      'Cairne Bloodhoof',
      'ケーアン・ブラッドフーフ',
      '凯恩·血蹄',
      '케른 블러드후프'
    ],
    [
      'Call Pet',
      'ペット呼び寄せ',
      '召唤宠物',
      '야수 부르기'
    ],
    [
      'Captain Greenskin',
      'グリーンスキン船長',
      '绿皮船长',
      '선장 그린스킨'
    ],
    [
      'Captains Parrot',
      '船長のオウム',
      '船长的鹦鹉',
      '선장의 앵무새'
    ],
    [
      'Captured Jormungar',
      '捕獲されたヨルムンガー',
      '俘获的冰虫',
      '사로잡힌 요르문가르'
    ],
    [
      'Cenarius',
      'セナリウス',
      '塞纳留斯',
      '세나리우스'
    ],
    [
      'Charge',
      '突撃',
      '冲锋',
      '돌진'
    ],
    [
      'Charged Hammer',
      '雷電の鎚',
      '灌魔之锤',
      '충전된 망치'
    ],
    [
      'Chillmaw',
      'チルモー',
      '冰喉',
      '서리아귀'
    ],
    [
      'Chillwind Yeti',
      'チルウィンドのイェテイ',
      '冰风雪人',
      '서리바람 설인'
    ],
    [
      'Circle of Healing',
      '回復の輪',
      '治疗之环',
      '치유의 마법진'
    ],
    [
      'Chromaggus',
      'クロマガス',
      '克洛玛古斯',
      '크로마구스'
    ],
    [
      'Claw',
      '爪',
      '爪击',
      '할퀴기'
    ],
    [
      'Cleave',
      'ぶった切り',
      '顺劈斩',
      '회전베기'
    ],
    [
      'Clockwork Giant',
      'ゼンマイ仕掛けの巨人',
      '发条巨人',
      '거인 태엽돌이'
    ],
    [
      'Clockwork Gnome',
      'ゼンマイ仕掛けのノーム',
      '发条侏儒',
      '노움 태엽돌이'
    ],
    [
      'Clockwork Knight',
      'ゼンマイ仕掛けの騎士',
      '发条骑士',
      '태엽돌이 기사'
    ],
    [
      'Cobalt Guardian',
      'コバルトの守護者',
      '钴制卫士',
      '코발트 수호자'
    ],
    [
      'Cobra Shot',
      'コブラの一矢',
      '眼镜蛇射击',
      '코브라 사격'
    ],
    [
      'Coghammer',
      'コグハンマー',
      '齿轮光锤',
      '톱니망치'
    ],
    [
      'Cogmaster',
      'コグマスター',
      '齿轮大师',
      '톱니장인'
    ],
    [
      'Cogmasters Wrench',
      'コグマスターのレンチ',
      '齿轮大师的扳手',
      '톱니장인의 렌치'
    ],
    [
      'Cold Blood',
      '冷血',
      '冷血',
      '냉혈'
    ],
    [
      'Coldarra Drake',
      'コールダラ・ドレイク',
      '考达拉幼龙',
      '콜다라 비룡'
    ],
    [
      'Coldlight Oracle',
      'コールドライトの託宣師',
      '寒光智者',
      '시린빛 점쟁이'
    ],
    [
      'Coldlight Seer',
      'コールドライトの預言者',
      '寒光先知',
      '시린빛 예언자'
    ],
    [
      'Coliseum Manager',
      'コロシアムの支配人',
      '角斗场主管',
      '경기장 관리자'
    ],
    [
      'Commanding Shout',
      '号令',
      '命令怒吼',
      '지휘의 외침'
    ],
    [
      'Competitive Spirit',
      '競争心',
      '争强好胜',
      '경쟁심'
    ],
    [
      'Conceal',
      '隠蔽',
      '隐藏',
      '은폐'
    ],
    [
      'Cone of Cold',
      '冷気の放射',
      '冰锥术',
      '냉기 돌풍'
    ],
    [
      'Confessor Paletress',
      '告解師ペイルトレス',
      '银色神官帕尔崔丝',
      '고해사제 페일트리스'
    ],
    [
      'Confuse',
      '混乱',
      '迷乱',
      '혼란'
    ],
    [
      'Consecration',
      '聖別',
      '奉献',
      '신성화'
    ],
    [
      'Convert',
      '転向',
      '策反',
      '교화'
    ],
    [
      'Core Hound',
      'コアハウンド',
      '熔火恶犬',
      '심장부 사냥개'
    ],
    [
      'Core Rager',
      'コア・レイジャー',
      '熔火怒犬',
      '흉포한 심장부 사냥개'
    ],
    [
      'Corruption',
      '崩壊',
      '腐蚀术',
      '부패'
    ],
    [
      'Counterspell',
      '呪文相殺',
      '法术反制',
      '마법 차단'
    ],
    [
      'Crackle',
      'バリバリ',
      '连环爆裂',
      '파지직'
    ],
    [
      'Crazed Alchemist',
      'イカれた錬金術士',
      '疯狂的炼金师',
      '광기의 연금술사'
    ],
    [
      'Crowd Favorite',
      '花形選手',
      '人气选手',
      '마상시합 유명인'
    ],
    [
      'Cruel Taskmaster',
      '残酷な現場監督',
      '严酷的监工',
      '잔인한 감독관'
    ],
    [
      'Crush',
      'クラッシュ',
      '重碾',
      '으깨기'
    ],
    [
      'Cult Master',
      'カルトの教祖',
      '诅咒教派领袖',
      '이교도 지도자'
    ],
    [
      'Curse of Rafaam',
      'ラファームの呪い',
      '拉法姆的诅咒',
      '라팜의 저주'
    ],
    [
      'Cursed Blade',
      '呪われた剣',
      '诅咒之刃',
      '저주받은 검'
    ],
    [
      'Cutpurse',
      'スリ',
      '窃贼',
      '소매치기'
    ],
    [
      'Dalaran Aspirant',
      'ダラランの志願兵',
      '达拉然铁骑士',
      '달라란 지원자'
    ],
    [
      'Dalaran Mage',
      'ダラランのメイジ',
      '达拉然法师',
      '달라란 마법사'
    ],
    [
      'Dancing Swords',
      '踊る剣',
      '舞动之剑',
      '춤추는 검'
    ],
    [
      'Dark Bargain',
      '闇の約定',
      '黑暗契约',
      '어둠의 거래'
    ],
    [
      'Dark Cultist',
      '闇の教団の使徒',
      '黑暗教徒',
      '어둠의 이교도'
    ],
    [
      'Dark Iron Dwarf',
      'ダークアイアンのドワーフ',
      '黑铁矮人',
      '검은무쇠 드워프'
    ],
    [
      'Dark Iron Skulker',
      'ダークアイアン・スカルカー',
      '黑铁潜藏者',
      '검은무쇠 잠복자'
    ],
    [
      'Dark Peddler',
      '闇の売人',
      '黑市摊贩',
      '어둠의 행상인'
    ],
    [
      'Dark Wispers',
      'ダーク・ウィスパー',
      '黑暗低语者',
      '어둠의 속삭임'
    ],
    [
      'Darkbomb',
      '闇爆弾',
      '暗色炸弹',
      '검은폭탄'
    ],
    [
      'Darkscale Healer',
      'ダークスケイルの治療師',
      '暗鳞治愈者',
      '어둠비늘 치유사'
    ],
    [
      'Darnassus Aspirant',
      'ダーナサスの志願兵',
      '达纳苏斯豹骑士',
      '다르나서스 지원자'
    ],
    [
      'Dart Trap',
      'ダーツの罠',
      '毒镖陷阱',
      '화살 덫'
    ],
    [
      'Deadly Poison',
      '致死毒',
      '致命药膏',
      '맹독'
    ],
    [
      'Deadly Shot',
      '必殺の一矢',
      '致命射击',
      '치명적인 사격'
    ],
    [
      'Deaths Bite',
      'デス・バイト',
      '死亡之咬',
      '죽음의 이빨'
    ],
    [
      'Deathlord',
      'デスロード',
      '死亡领主',
      '죽음의 군주'
    ],
    [
      'Deathwing',
      'デスウィング',
      '死亡之翼',
      '데스윙'
    ],
    [
      'Defender of Argus',
      'アルガスの守護者',
      '阿古斯防御者',
      '아르거스의 수호자'
    ],
    [
      'Defender',
      '身代わり',
      '',
      ''
    ],
    [
      'Defias Bandit',
      'デファイアスの盗賊',
      '',
      ''
    ],
    [
      'Defias Ringleader',
      'デファイアスの親方',
      '迪菲亚头目',
      '데피아즈단 두목'
    ],
    [
      'Demolisher',
      '破壊兵器',
      '攻城车',
      '파괴전차'
    ],
    [
      'Demonfire',
      '悪魔の火',
      '恶魔之火',
      '악마의 불꽃'
    ],
    [
      'Demonfuse',
      '悪魔融合',
      '恶魔融合',
      '악마의 기운'
    ],
    [
      'Demonheart',
      '悪魔の心臓',
      '恶魔之心',
      '악마의 심장'
    ],
    [
      'Demonwrath',
      '悪魔の憤怒',
      '恶魔之怒',
      '악마의 격노'
    ],
    [
      'Desert Camel',
      '砂漠ラクダ',
      '大漠沙驼',
      '사막 낙타'
    ],
    [
      'Dire Wolf Alpha',
      'ダイアウルフ・リーダー',
      '恐狼前锋',
      '광포한 늑대 우두머리'
    ],
    [
      'Divine Favor',
      '神聖なる恩寵',
      '神恩术',
      '신의 은총'
    ],
    [
      'Divine Spirit',
      '神授の霊力',
      '神圣之灵',
      '천상의 정신'
    ],
    [
      'Djinni of Zephyrs',
      '西風の精',
      '西风灯神',
      '서풍의 신령'
    ],
    [
      'Doomguard',
      'ドゥームガード',
      '末日守卫',
      '파멸의 수호병'
    ],
    [
      'Doomhammer',
      'ドゥームハンマー',
      '毁灭之锤',
      '둠해머'
    ],
    [
      'Doomsayer',
      '終末預言者',
      '末日预言者',
      '파멸의 예언자'
    ],
    [
      'Dr. Boom',
      'ドクター・ブーム',
      '砰砰博士',
      '박사 붐'
    ],
    [
      'Draenei Totemcarver',
      'ドラナイのトーテム彫師',
      '德莱尼图腾师',
      '드레나이 토템술사'
    ],
    [
      'Dragon Consort',
      'ドラゴンの寵臣',
      '龙王配偶',
      '용의 배우자'
    ],
    [
      'Dragon Egg',
      'ドラゴンの卵',
      '龙蛋',
      '용의 알'
    ],
    [
      'Dragons Breath',
      'ドラゴンブレス',
      '龙息术',
      '용의 숨결'
    ],
    [
      'Dragonhawk Rider',
      'ドラゴンホーク騎兵',
      '龙鹰骑士',
      '용매 기수'
    ],
    [
      'Dragonkin Sorcerer',
      'ドラゴンキン・ソーサラー',
      '龙人巫师',
      '용혈족 마술사'
    ],
    [
      'Dragonling Mechanic',
      'ミニドラゴン・メカニック',
      '机械幼龙技工',
      '기계용 정비사'
    ],
    [
      'Drain Life',
      '生命吸収',
      '吸取生命',
      '생명력 흡수'
    ],
    [
      'Drakonid Crusher',
      'ドラコニッド・クラッシャー',
      '龙人打击者',
      '용기병 분쇄자'
    ],
    [
      'Dread Corsair',
      '悪辣なる海賊',
      '恐怖海盗',
      '공포의 해적'
    ],
    [
      'Dread Infernal',
      '凄まじき焦熱の悪鬼',
      '恐惧地狱火',
      '공포의 지옥불정령'
    ],
    [
      'Dreadscale',
      'ドレッドスケイル',
      '恐鳞',
      '공포비늘'
    ],
    [
      'Dreadsteed',
      'ドレッドスティード',
      '恐惧战马',
      '공포마'
    ],
    [
      'Druid of the Claw',
      '爪のドルイド',
      '利爪德鲁伊',
      '발톱의 드루이드'
    ],
    [
      'Druid of the Fang',
      '牙のドルイド',
      '尖牙德鲁伊',
      '송곳니의 드루이드'
    ],
    [
      'Druid of the Flame',
      '炎のドルイド',
      '烈焰德鲁伊',
      '화염의 드루이드'
    ],
    [
      'Druid of the Saber',
      'サーベルのドルイド',
      '刃牙德鲁伊',
      '칼날이빨의 드루이드'
    ],
    [
      'Dunemaul Shaman',
      'デューンモールのシャーマン',
      '砂槌萨满祭司',
      '모래망치 주술사'
    ],
    [
      'Duplicate',
      '複製',
      '复制',
      '복제'
    ],
    [
      'Dust Devil',
      '塵の悪魔',
      '尘魔',
      '먼지 악령'
    ],
    [
      'Eadric the Pure',
      '潔白のエアドリック',
      '纯洁者耶德瑞克',
      '성기사 에드릭'
    ],
    [
      'Eaglehorn Bow',
      'イーグルホーン・ボウ',
      '鹰角弓',
      '독수리뿔 장궁'
    ],
    [
      'Earth Elemental',
      '大地の精霊',
      '土元素',
      '대지의 정령'
    ],
    [
      'Earth Shock',
      '大地の衝撃',
      '大地震击',
      '대지 충격'
    ],
    [
      'Earthen Ring Farseer',
      '大地の円環の遠見師',
      '大地之环先知',
      '대지 고리회 선견자'
    ],
    [
      'Echo of Medivh',
      'メディヴの残響',
      '麦迪文的残影',
      '메디브의 메아리'
    ],
    [
      'Echoing Ooze',
      '反響ウーズ',
      '分裂软泥怪',
      '고동치는 수액괴물'
    ],
    [
      'Edwin VanCleef',
      'エドウィン・ヴァンクリーフ',
      '艾德温·范克里夫',
      '에드윈 밴클리프'
    ],
    [
      'Eerie Statue',
      '不気味な像',
      '诡异的雕像',
      '으스스한 석상'
    ],
    [
      'Effigy',
      '身代わり人形',
      '轮回',
      '인형 의식'
    ],
    [
      'Elemental Destruction',
      '精霊崩壊',
      '元素毁灭',
      '파괴의 정기'
    ],
    [
      'Elise Starseeker',
      'エリーズ・スターシーカー',
      '伊莉斯·逐星',
      '엘리스 스타시커'
    ],
    [
      'Elite Tauren Chieftain',
      'エリート・トーレン・チーフテン',
      '精英牛头人酋长',
      '정예 타우렌 족장'
    ],
    [
      'Elven Archer',
      'エルフの射手',
      '精灵弓箭手',
      '엘프 궁수'
    ],
    [
      'Emperor Cobra',
      'エンペラー・コブラ',
      '帝王眼镜蛇',
      '황제 코브라'
    ],
    [
      'Emperor Thaurissan',
      'ソーリサン皇帝',
      '索瑞森大帝',
      '제왕 타우릿산'
    ],
    [
      'Enhance-o Mechano',
      'エンハンス・オ・メカーノ',
      '强化机器人',
      '강화로봇'
    ],
    [
      'Enter the Coliseum',
      '決闘の地',
      '精英对决',
      '경기장 입장'
    ],
    [
      'Entomb',
      '埋葬',
      '埋葬',
      '생매장'
    ],
    [
      'Equality',
      '平等',
      '生而平等',
      '평등'
    ],
    [
      'Ethereal Arcanist',
      'イセリアルの魔術師',
      '虚灵奥术师',
      '에테리얼 비전술사'
    ],
    [
      'Ethereal Conjurer',
      'イセリアルの召術師',
      '虚灵巫师',
      '에테리얼 창조술사'
    ],
    [
      'Everyfin is Awesome',
      'エラばれし我らにヒレ伏せ',
      '鱼人恩典',
      '모든 것이 멋지다옳'
    ],
    [
      'Evil Heckler',
      '邪悪なる野次馬',
      '邪灵拷问者',
      '고약한 야유꾼'
    ],
    [
      'Eviscerate',
      '腹裂き',
      '刺骨',
      '절개'
    ],
    [
      'Excavated Evil',
      '掘り出されし邪悪',
      '极恶之咒',
      '파헤쳐진 악'
    ],
    [
      'Execute',
      '止めの一撃',
      '斩杀',
      '마무리 일격'
    ],
    [
      'Explorer\'s Hat',
      '探検家の帽子',
      '探险帽',
      '탐험가의 모자'
    ],
    [
      'Explorers Hat',
      '探検家の帽子',
      '',
      ''
    ],
    [
      'Explosive Sheep',
      '爆発ヒツジ',
      '自爆绵羊',
      '양 폭탄'
    ],
    [
      'Explosive Shot',
      '爆発の一矢',
      '爆炸射击',
      '폭발 사격'
    ],
    [
      'Explosive Trap',
      '爆発の罠',
      '爆炸陷阱',
      '폭발의 덫'
    ],
    [
      'Eydis Darkbane',
      'エイディス・ダークベイン',
      '黑暗邪使艾蒂丝',
      '아이디스 다크베인'
    ],
    [
      'Eye for an Eye',
      '目には目を',
      '以眼还眼',
      '눈에는 눈'
    ],
    [
      'Faceless Manipulator',
      '無貌の繰り手',
      '无面操纵者',
      '얼굴 없는 배후자'
    ],
    [
      'Faerie Dragon',
      'フェアリードラゴン',
      '精灵龙',
      '요정용'
    ],
    [
      'Fallen Hero',
      '堕ちた英雄',
      '英雄之魂',
      '영웅의 넋'
    ],
    [
      'Fan of Knives',
      'ナイフの雨',
      '刀扇',
      '칼날 부채'
    ],
    [
      'Far Sight',
      '遠見',
      '视界术',
      '천리안'
    ],
    [
      'Fearsome Doomguard',
      '恐るべきドゥームガード',
      '恐怖末日守卫',
      '섬뜩한 파멸의 수호병'
    ],
    [
      'Feign Death',
      '死んだふり',
      '假死',
      '죽은척하기'
    ],
    [
      'Fel Cannon',
      'フェルキャノン',
      '邪能火炮',
      '지옥 대포'
    ],
    [
      'Fel Reaver',
      'フェル・リーヴァー',
      '魔能机甲',
      '지옥절단기'
    ],
    [
      'Felguard',
      'フェルガード',
      '恶魔卫士',
      '지옥수호병'
    ],
    [
      'Fen Creeper',
      'フェン・クリーパー',
      '沼泽爬行者',
      '수렁이끼괴물'
    ],
    [
      'Fencing Coach',
      'フェンシングのコーチ',
      '击剑教头',
      '검술 지도자'
    ],
    [
      'Feral Spirit',
      '野獣の精霊',
      '野性狼魂',
      '야수 정령'
    ],
    [
      'Feugen',
      'フューゲン',
      '费尔根',
      '퓨진'
    ],
    [
      'Fierce Monkey',
      '獰猛なサル',
      '凶暴猿猴',
      '사나운 원숭이'
    ],
    [
      'Fiery War Axe',
      '烈火の戦斧',
      '炽炎战斧',
      '이글거리는 전쟁 도끼'
    ],
    [
      'Fire Elemental',
      'ファイア・エレメンタル',
      '火元素',
      '불의 정령'
    ],
    [
      'Fireball',
      'ファイアーボール',
      '火球术',
      '화염구'
    ],
    [
      'Fireguard Destroyer',
      'ファイアガード・デストロイヤー',
      '火焰驱逐者',
      '파괴의 화염수호정령'
    ],
    [
      'Fist of Jaraxxus',
      'ジャラクサスの鉄拳',
      '加拉克苏斯之拳',
      '자락서스의 주먹'
    ],
    [
      'Fjola Lightbane',
      'フィヨラ・ライトベイン',
      '光明邪使菲奥拉',
      '피욜라 라이트베인'
    ],
    [
      'Flame Imp',
      '炎のインプ',
      '烈焰小鬼',
      '화염 임프'
    ],
    [
      'Flame Juggler',
      '火炎ジャグラー',
      '火焰杂耍者',
      '불꽃 곡예사'
    ],
    [
      'Flame Lance',
      'フレイムランス',
      '炎枪术',
      '화염창'
    ],
    [
      'Flame Leviathan',
      'フレイム・リバイアサン',
      '烈焰巨兽',
      '거대 화염전차'
    ],
    [
      'Flamecannon',
      'フレイムキャノン',
      '烈焰轰击',
      '화염포'
    ],
    [
      'Flamestrike',
      'フレイムストライク',
      '烈焰风暴',
      '불기둥'
    ],
    [
      'Flametongue Totem',
      '炎の舌のトーテム',
      '火舌图腾',
      '불꽃의 토템'
    ],
    [
      'Flamewaker',
      'フレイムウェイカー',
      '火妖',
      '불꽃꼬리 전사'
    ],
    [
      'Flare',
      '照明弾',
      '照明弹',
      '섬광'
    ],
    [
      'Flash Heal',
      '瞬間回復',
      '快速治疗',
      '순간 치유'
    ],
    [
      'Flesheating Ghoul',
      '屍肉喰いのグール',
      '腐肉食尸鬼',
      '굶주린 식인 구울'
    ],
    [
      'Floating Watcher',
      '浮遊する番人',
      '漂浮观察者',
      '떠 다니는 감시자'
    ],
    [
      'Flying Machine',
      '飛行マシーン',
      '飞行器',
      '비행기'
    ],
    [
      'Foe Reaper 4000',
      'エネミーリーパー4000',
      '死神4000型',
      '전투 절단기 4000'
    ],
    [
      'Force of Nature',
      '自然の援軍',
      '自然之力',
      '자연의 군대'
    ],
    [
      'Force-Tank MAX',
      'フォース・タンクMAX',
      '强袭坦克',
      '막강 에너지 전차'
    ],
    [
      'Forgotten Torch',
      '忘れられた松明',
      '老旧的火把',
      '잊혀진 횃불'
    ],
    [
      'Forked Lightning',
      'フォーク・ライトニング',
      '叉状闪电',
      '갈래 번개'
    ],
    [
      'Fossilized Devilsaur',
      'デビルサウルスの化石',
      '石化魔暴龙',
      '화석 데빌사우루스'
    ],
    [
      'Freezing Trap',
      '凍結の罠',
      '冰冻陷阱',
      '빙결의 덫'
    ],
    [
      'Frigid Snobold',
      '極寒のスノボルト',
      '雪地狗头人',
      '눈덩이 스노볼트'
    ],
    [
      'Frost Elemental',
      'フロスト・エレメンタル',
      '冰霜元素',
      '냉기 정령'
    ],
    [
      'Frost Giant',
      '霜の巨人',
      '冰霜巨人',
      '서리 거인'
    ],
    [
      'Frost Nova',
      'フロストノヴァ',
      '冰霜新星',
      '얼음 회오리'
    ],
    [
      'Frost Shock',
      'フロストショック',
      '冰霜震击',
      '냉기 충격'
    ],
    [
      'Frostbolt',
      'フロストボルト',
      '寒冰箭',
      '얼음 화살'
    ],
    [
      'Frostwolf Grunt',
      'フロストウルフの兵卒',
      '霜狼步兵',
      '서리늑대 그런트'
    ],
    [
      'Frostwolf Warlord',
      'フロストウルフの将軍',
      '霜狼督军',
      '서리늑대 전쟁군주'
    ],
    [
      'Frothing Berserker',
      '泡を吹く狂戦士',
      '暴乱狂战士',
      '거품 무는 광전사'
    ],
    [
      'Gadgetzan Auctioneer',
      'ガジェッツァンの競売人',
      '加基森拍卖师',
      '가젯잔 경매인'
    ],
    [
      'Gadgetzan Jouster',
      'ガジェッツァンの槍試合選手',
      '加基森枪骑士',
      '가젯잔 창기사'
    ],
    [
      'Gahzrilla',
      'ガーズリラ',
      '加兹瑞拉',
      '가즈릴라'
    ],
    [
      'Gang Up',
      '集合の合図',
      '夜幕奇袭',
      '패거리'
    ],
    [
      'Garrison Commander',
      '守備隊司令官',
      '要塞指挥官',
      '주둔지 사령관'
    ],
    [
      'Gazlowe',
      'ガズロウ',
      '加兹鲁维',
      '가즈로'
    ],
    [
      'Gelbin Mekkatorque',
      'ゲルビン・メカトルク',
      '格尔宾·梅卡托克',
      '겔빈 멕카토크'
    ],
    [
      'Gilblin Stalker',
      'ギルブリン・ストーカー',
      '海地精猎手',
      '길블린 추적자'
    ],
    [
      'Gladiators Longbow',
      '剣闘士の長弓',
      '角斗士的长弓',
      '검투사의 장궁'
    ],
    [
      'Glaivezooka',
      'グレイブズーカ',
      '重型刃弩',
      '수리검포'
    ],
    [
      'Gnomeregan Infantry',
      'ノームレガン歩兵',
      '诺莫瑞根步兵',
      '놈리건 보병'
    ],
    [
      'Gnomish Experimenter',
      'ノームの実験者',
      '侏儒实验技师',
      '노움 실험가'
    ],
    [
      'Gnomish Inventor',
      'ノームの発明家',
      '侏儒发明家',
      '노움 발명가'
    ],
    [
      'Goblin Auto-Barber',
      'ゴブリン式全自動散髪機',
      '地精自动理发装置',
      '고블린 자동 이발기'
    ],
    [
      'Goblin Blastmage',
      'ゴブリンのブラストメイジ',
      '地精炎术师',
      '고블린 폭발법사'
    ],
    [
      'Goblin Sapper',
      'ゴブリン戦闘工兵',
      '地精工兵',
      '고블린 공병'
    ],
    [
      'Goldshire Footman',
      'ゴールドシャイアの歩兵',
      '闪金镇步兵',
      '황금골 보병'
    ],
    [
      'Gorehowl',
      'ゴアハウル',
      '血吼',
      '피의 울음소리'
    ],
    [
      'Gorillabot A-3',
      'ゴリラロボA-3',
      'A3型机械金刚',
      '고릴라로봇 A-3'
    ],
    [
      'Gormok the Impaler',
      '串刺しのゴーモック',
      '穿刺者戈莫克',
      '꿰뚫는 자 고르목'
    ],
    [
      'Grand Crusader',
      'グランド・クルセイダー',
      '十字军统领',
      '고위 성전사'
    ],
    [
      'Grim Patron',
      'ぐったりガブ呑み亭の常連',
      '恐怖的奴隶主',
      '험상궂은 손님'
    ],
    [
      'Grimscale Oracle',
      'グリムスケイルの託宣師',
      '暗鳞先知',
      '성난비늘 수련사'
    ],
    [
      'Grommash Hellscream',
      'グロマッシュ・ヘルスクリーム',
      '格罗玛什·地狱咆哮',
      '그롬마쉬 헬스크림'
    ],
    [
      'Grove Tender',
      '木立の世話係',
      '林地树妖',
      '숲 뜰지기'
    ],
    [
      'Gruul',
      'グルゥル',
      '格鲁尔',
      '그룰'
    ],
    [
      'Guardian of Kings',
      '王の守護者',
      '列王守卫',
      '왕의 수호자'
    ],
    [
      'Gurubashi Berserker',
      'グルバシの狂戦士',
      '古拉巴什狂暴者',
      '구루바시 광전사'
    ],
    [
      'Hammer of Wrath',
      '怒りの鉄槌',
      '愤怒之锤',
      '천벌의 망치'
    ],
    [
      'Hand of Protection',
      '守りの手',
      '保护之手',
      '보호의 손길'
    ],
    [
      'Harrison Jones',
      'ハリソン・ジョーンズ',
      '哈里森·琼斯',
      '해리슨 존스'
    ],
    [
      'Harvest Golem',
      '刈入れゴーレム',
      '麦田傀儡',
      '허수아비골렘'
    ],
    [
      'Haunted Creeper',
      '呪われた蜘蛛',
      '鬼灵爬行者',
      '유령 들린 거미'
    ],
    [
      'Headcrack',
      '脳天直撃',
      '裂颅之击',
      '머리 후려치기'
    ],
    [
      'Healing Totem',
      '回復のトーテム',
      '',
      ''
    ],
    [
      'Healing Touch',
      '癒しの手',
      '治疗之触',
      '치유의 손길'
    ],
    [
      'Healing Wave',
      '癒しの波',
      '治疗波',
      '치유의 물결'
    ],
    [
      'Hellfire',
      '地獄の炎',
      '地狱烈焰',
      '지옥의 불길'
    ],
    [
      'Hemet Nesingwary',
      'ヒーメット・ネッシングウェアリー',
      '赫米特·奈辛瓦里',
      '헤멧 네싱워리'
    ],
    [
      'Heroic Strike',
      'ヒロイック・ストライク',
      '英勇打击',
      '영웅의 일격'
    ],
    [
      'Hex',
      '呪術',
      '妖术',
      '사술'
    ],
    [
      'Hobgoblin',
      'ホブゴブリン',
      '大胖',
      '밥통고블린'
    ],
    [
      'Hogger',
      'ホガー',
      '霍格',
      '들창코'
    ],
    [
      'Holy Champion',
      '聖なる勇者',
      '神圣勇士',
      '신성한 용사'
    ],
    [
      'Holy Fire',
      '聖なる炎',
      '神圣之火',
      '신성한 불꽃'
    ],
    [
      'Holy Light',
      '聖なる光',
      '圣光术',
      '성스러운 빛'
    ],
    [
      'Holy Nova',
      'ホーリーノヴァ',
      '神圣新星',
      '신성한 폭발'
    ],
    [
      'Holy Smite',
      '聖なる一撃',
      '神圣惩击',
      '성스러운 일격'
    ],
    [
      'Holy Wrath',
      '聖なる怒り',
      '神圣愤怒',
      '신의 격노'
    ],
    [
      'Houndmaster',
      '猟犬使い',
      '驯兽师',
      '사냥개조련사'
    ],
    [
      'Huffer',
      'ハファー',
      '',
      ''
    ],
    [
      'Huge Toad',
      '巨大ガマ',
      '巨型蟾蜍',
      '왕두꺼비'
    ],
    [
      'Humility',
      '謙遜',
      '谦逊',
      '겸손'
    ],
    [
      'Hungry Crab',
      '飢えたカニ',
      '鱼人杀手蟹',
      '굶주린 게'
    ],
    [
      'Hungry Dragon',
      '腹ペコのドラゴン',
      '饥饿的巨龙',
      '굶주린 용'
    ],
    [
      'Hyena',
      'ハイエナ',
      '',
      ''
    ],
    [
      'Ice Barrier',
      'アイスバリア',
      '寒冰护体',
      '얼음 보호막'
    ],
    [
      'Ice Block',
      'アイスブロック',
      '寒冰屏障',
      '얼음 방패'
    ],
    [
      'Ice Lance',
      'アイスランス',
      '冰枪术',
      '얼음창'
    ],
    [
      'Ice Rager',
      'アイス・レイジャー',
      '冰霜暴怒者',
      '얼음 광전사'
    ],
    [
      'Icehowl',
      'アイスハウル',
      '冰吼',
      '얼음울음'
    ],
    [
      'Illidan Stormrage',
      'イリダン・ストームレイジ',
      '伊利丹·怒风',
      '일리단 스톰레이지'
    ],
    [
      'Illuminator',
      'イルミネイター',
      '明光祭司',
      '광휘의 노움'
    ],
    [
      'Imp Gang Boss',
      'インプ・ギャングのボス',
      '小鬼首领',
      '임프 두목'
    ],
    [
      'Imp Master',
      'インプ使い',
      '小鬼召唤师',
      '임프 소환사'
    ],
    [
      'Imp',
      'インプ',
      '',
      ''
    ],
    [
      'Imp-losion',
      'インプァクト',
      '小鬼爆破',
      '임프폭발'
    ],
    [
      'Infernal',
      '焦熱の悪鬼',
      '',
      ''
    ],
    [
      'Injured Blademaster',
      '傷を負った剣匠',
      '负伤剑圣',
      '부상당한 검귀'
    ],
    [
      'Injured Kvaldir',
      '傷を負ったクヴァルディル',
      '受伤的克瓦迪尔',
      '부상당한 크발디르'
    ],
    [
      'Inner Fire',
      '内なる炎',
      '心灵之火',
      '내면의 열정'
    ],
    [
      'Inner Rage',
      '内なる激怒',
      '怒火中烧',
      '내면의 분노'
    ],
    [
      'Innervate',
      '錬気',
      '激活',
      '정신 자극'
    ],
    [
      'Iron Juggernaut',
      'アイアン・ジャガーノート',
      '钢铁战蝎',
      '강철의 거대괴수'
    ],
    [
      'Iron Sensei',
      '鉄の師匠',
      '钢铁武道家',
      '강철 사부'
    ],
    [
      'Ironbark Protector',
      '鉄の樹皮の守り手',
      '埃隆巴克保护者',
      '무쇠껍질 수호정령'
    ],
    [
      'Ironbeak Owl',
      '鉄嘴のフクロウ',
      '铁喙猫头鹰',
      '무쇠부리 올빼미'
    ],
    [
      'Ironforge Rifleman',
      'アイアンフォージのライフル兵',
      '铁炉堡火枪手',
      '아이언포지 소총병'
    ],
    [
      'Ironfur Grizzly',
      '鉄毛のグリズリー',
      '铁鬃灰熊',
      '무쇠가죽 불곰'
    ],
    [
      'Jeeves',
      'ジーヴス',
      '基维斯',
      '지브스'
    ],
    [
      'Jeweled Scarab',
      '宝飾スカラベ',
      '宝石甲虫',
      '보석 박힌 딱정벌레'
    ],
    [
      'Jungle Moonkin',
      'ジャングル・ムーンキン',
      '丛林枭兽',
      '밀림 달빛야수'
    ],
    [
      'Jungle Panther',
      'ジャングル・パンサー',
      '丛林猎豹',
      '밀림 표범'
    ],
    [
      'Junkbot',
      'ジャンクロボ',
      '回收机器人',
      '고철로봇'
    ],
    [
      'Justicar Trueheart',
      'ジャスティサー・トゥルーハート',
      '裁决者图哈特',
      '심판관 트루하트'
    ],
    [
      'Keeper of the Grove',
      '木立の番人',
      '丛林守护者',
      '숲의 수호자'
    ],
    [
      'Keeper of Uldaman',
      'ウルダマンの番人',
      '奥达曼守护者',
      '울다만의 수호자'
    ],
    [
      'KelThuzad',
      'ケルスザード',
      '克尔苏加德',
      '켈투자드'
    ],
    [
      'Kezan Mystic',
      'ケザンのミスティック',
      '科赞秘术师',
      '케잔 비술사'
    ],
    [
      'Kidnapper',
      '誘拐魔',
      '劫持者',
      '납치범'
    ],
    [
      'Kill Command',
      '殺しの命令',
      '杀戮命令',
      '살상 명령'
    ],
    [
      'King Krush',
      'キングクラッシュ',
      '暴龙王克鲁什',
      '왕 크루쉬'
    ],
    [
      'King Mukla',
      'キング・ムクラ',
      '穆克拉',
      '밀림의 왕 무클라'
    ],
    [
      'King of Beasts',
      '獣の王',
      '百兽之王',
      '백수의 왕'
    ],
    [
      'Kings Defender',
      '王の護衛',
      '国王护卫者',
      '왕의 수호검'
    ],
    [
      'Kings Elekk',
      '王のエレク',
      '皇家雷象',
      '왕의 엘레크'
    ],
    [
      'Kirin Tor Mage',
      'キリン・トアのメイジ',
      '肯瑞托法师',
      '키린 토 마법사'
    ],
    [
      'Knife Juggler',
      'ナイフ・ジャグラー',
      '飞刀杂耍者',
      '단검 곡예사'
    ],
    [
      'Knight of the Wild',
      '野生の騎士',
      '荒野骑士',
      '야생의 기사'
    ],
    [
      'Kobold Geomancer',
      'コボルトの地霊術師',
      '狗头人地卜师',
      '코볼트 흙점쟁이'
    ],
    [
      'Kodorider',
      'コドー騎兵',
      '科多兽骑手',
      '코도 기수'
    ],
    [
      'Korkron Elite',
      'コルクロンの精鋭',
      '库卡隆精英卫士',
      '코르크론 정예병'
    ],
    [
      'Kvaldir Raider',
      'クヴァルディルの襲撃兵',
      '克瓦迪尔劫掠者',
      '크발디르 약탈자'
    ],
    [
      'Lance Carrier',
      '槍持ち',
      '持枪侍从',
      '창 운반꾼'
    ],
    [
      'Lava Burst',
      '溶岩爆発',
      '熔岩爆裂',
      '용암 폭발'
    ],
    [
      'Lava Shock',
      '溶岩の衝撃',
      '熔岩震击',
      '용암 충격'
    ],
    [
      'Lay on Hands',
      '按手の儀式',
      '圣疗术',
      '신의 축복'
    ],
    [
      'Leeroy Jenkins',
      'リロイ・ジェンキンス',
      '火车王里诺艾',
      '리로이 젠킨스'
    ],
    [
      'Leper Gnome',
      'レプラノーム',
      '麻疯侏儒',
      '오염된 노움'
    ],
    [
      'Light of the Naaru',
      'ナールの光',
      '纳鲁之光',
      '나루의 빛'
    ],
    [
      'Lights Champion',
      '光の勇者',
      '圣光勇士',
      '빛의 용사'
    ],
    [
      'Lights Justice',
      'ライツ・ジャスティス',
      '圣光的正义',
      '빛의 정의'
    ],
    [
      'Lightbomb',
      '光爆弾',
      '圣光炸弹',
      '빛폭탄'
    ],
    [
      'Lightning Bolt',
      'ライトニングボルト',
      '闪电箭',
      '번개 화살'
    ],
    [
      'Lightning Storm',
      'ライトニングストーム',
      '闪电风暴',
      '번개 폭풍'
    ],
    [
      'Lightspawn',
      'ライトスポーン',
      '光耀之子',
      '빛의 정령'
    ],
    [
      'Lightwarden',
      'ライトウォーデン',
      '圣光护卫者',
      '빛의 감시자'
    ],
    [
      'Lightwell',
      '光の井戸',
      '光明之泉',
      '빛샘'
    ],
    [
      'Lil Exorcist',
      'リトル・エクソシスト',
      '小个子驱魔者',
      '꼬마 퇴마사'
    ],
    [
      'Living Roots',
      '生きている根',
      '活体根须',
      '살아있는 뿌리'
    ],
    [
      'Loatheb',
      'ロウゼブ',
      '洛欧塞布',
      '로데브'
    ],
    [
      'Lock and Load',
      '発射準備',
      '子弹上膛',
      '실탄 장전'
    ],
    [
      'Loot Hoarder',
      '戦利品クレクレ君',
      '战利品贮藏者',
      '전리품 수집가'
    ],
    [
      'Lord Jaraxxus',
      'ロード・ジャラクサス',
      '加拉克苏斯大王',
      '군주 자락서스'
    ],
    [
      'Lord of the Arena',
      '闘技場の覇者',
      '竞技场主宰',
      '투기장의 제왕'
    ],
    [
      'Lorewalker Cho',
      '探話士チョー',
      '游学者周卓',
      '전승지기 초'
    ],
    [
      'Lost Tallstrider',
      '迷子のトールストライダー',
      '迷失的陆行鸟',
      '길 잃은 타조'
    ],
    [
      'Lowly Squire',
      '下っ端従騎士',
      '低阶侍从',
      '풋내기 종자'
    ],
    [
      'Mad Bomber',
      'マッドボンバー',
      '疯狂投弹者',
      '정신 나간 폭격수'
    ],
    [
      'Mad Scientist',
      'マッドサイエンティスト',
      '疯狂的科学家',
      '미치광이 과학자'
    ],
    [
      'Madder Bomber',
      'マッダーボンバー',
      '疯狂爆破者',
      '완전히 정신 나간 폭격수'
    ],
    [
      'Maexxna',
      'マイエクスナ',
      '迈克斯纳',
      '맥스나'
    ],
    [
      'Magma Rager',
      'マグマ・レイジャー',
      '岩浆暴怒者',
      '용암 광전사'
    ],
    [
      'Magnataur Alpha',
      'マグナタウルスの長',
      '猛犸人头领',
      '덩치 큰 마그나타우르'
    ],
    [
      'Maiden of the Lake',
      '湖の乙女',
      '湖之仙女',
      '호수의 여신'
    ],
    [
      'Majordomo Executus',
      '筆頭家老エグゼクタス',
      '管理者埃克索图斯',
      '청지기 이그젝큐투스'
    ],
    [
      'MalGanis',
      'マルガニス',
      '玛尔加尼斯',
      '말가니스'
    ],
    [
      'Malorne',
      'マローン',
      '玛洛恩',
      '말로른'
    ],
    [
      'Malygos',
      'マリゴス',
      '玛里苟斯',
      '말리고스'
    ],
    [
      'Mana Addict',
      'マナ中毒者',
      '魔瘾者',
      '마나 중독자'
    ],
    [
      'Mana Tide Totem',
      'マナの潮のトーテム',
      '法力之潮图腾',
      '마나 해일 토템'
    ],
    [
      'Mana Wraith',
      'マナ・レイス',
      '法力怨魂',
      '마나 망령'
    ],
    [
      'Mana Wyrm',
      'マナ・ワーム',
      '法力浮龙',
      '마나 지룡'
    ],
    [
      'Mark of Nature',
      '自然の紋章',
      '自然印记',
      '자연의 징표'
    ],
    [
      'Mark of the Wild',
      '野生の紋章',
      '野性印记',
      '야생의 징표'
    ],
    [
      'Mass Dispel',
      '大いなる解呪',
      '群体驱散',
      '대규모 무효화'
    ],
    [
      'Master Jouster',
      '槍試合の名手',
      '大师级枪骑士',
      '위대한 창기사'
    ],
    [
      'Master of Ceremonies',
      '司会者',
      '庆典司仪',
      '마상시합 진행자'
    ],
    [
      'Master of Disguise',
      '変装の達人',
      '伪装大师',
      '위장의 대가'
    ],
    [
      'Master Swordsmith',
      '熟練武器職人',
      '铸剑师',
      '검 제작의 대가'
    ],
    [
      'Mech-Bear-Cat',
      'メカ・ビントロング',
      '机械野兽',
      '기계표범곰'
    ],
    [
      'Mechanical Yeti',
      'メカ・イェテイ',
      '机械雪人',
      '기계설인'
    ],
    [
      'Mechwarper',
      'メカワーパー',
      '机械跃迁者',
      '기계소환로봇'
    ],
    [
      'Mekgineer Thermaplugg',
      'メカジニア・サーマプラッグ',
      '瑟玛普拉格',
      '기계박사 텔마플러그'
    ],
    [
      'Metaltooth Leaper',
      'メタルトゥース・リーパー',
      '金刚刃牙兽',
      '강철니 표범로봇'
    ],
    [
      'Micro Machine',
      'マイクロマシーン',
      '微型战斗机甲',
      '초소형 기계'
    ],
    [
      'Millhouse Manastorm',
      'ミルハウス・マナストーム',
      '米尔豪斯·法力风暴',
      '밀하우스 마나스톰'
    ],
    [
      'Mimirons Head',
      'ミミロン・ヘッド',
      '米米尔隆的头部',
      '미미론의 머리'
    ],
    [
      'Mind Blast',
      '思念撃破',
      '心灵震爆',
      '정신 분열'
    ],
    [
      'Mind Control Tech',
      '精神支配技士',
      '精神控制技师',
      '정신 지배 기술자'
    ],
    [
      'Mind Control',
      '精神支配',
      '精神控制',
      '정신 지배'
    ],
    [
      'Mind Vision',
      '思念透視',
      '心灵视界',
      '마음의 눈'
    ],
    [
      'Mindgames',
      'マインドゲームス',
      '控心术',
      '심리 조작'
    ],
    [
      'Mini-Mage',
      'ミニ・メイジ',
      '小个子法师',
      '작은 마법사'
    ],
    [
      'Mirror Entity',
      '鏡の住人',
      '镜像实体',
      '거울상'
    ],
    [
      'Mirror Image',
      'ミラーイメージ',
      '镜像',
      '환영 복제'
    ],
    [
      'Misdirection',
      'ミスディレクション',
      '误导',
      '눈속임'
    ],
    [
      'Misha',
      'ミーシャ',
      '',
      ''
    ],
    [
      'Mistress of Pain',
      '苦痛の貴婦人',
      '痛苦女王',
      '고통의 여제'
    ],
    [
      'Mogor the Ogre',
      'モゴール・ジ・オーガ',
      '食人魔勇士穆戈尔',
      '모고르'
    ],
    [
      'Mogors Champion',
      'モゴールの勇者',
      '穆戈尔的勇士',
      '모고르의 용사'
    ],
    [
      'Mogushan Warden',
      '魔古山の番兵',
      '魔古山守望者',
      '모구샨 감시자'
    ],
    [
      'Molten Giant',
      '溶岩の巨人',
      '熔核巨人',
      '용암거인'
    ],
    [
      'Moonfire',
      '月の炎',
      '月火术',
      '달빛섬광'
    ],
    [
      'Mortal Coil',
      '生の苦悩',
      '死亡缠绕',
      '죽음의 고리'
    ],
    [
      'Mortal Strike',
      '必殺の一撃',
      '致死打击',
      '필사의 일격'
    ],
    [
      'Mountain Giant',
      '山の巨人',
      '山岭巨人',
      '산악거인'
    ],
    [
      'Mounted Raptor',
      '騎乗のラプター',
      '骑乘迅猛龙',
      '랩터 탈것'
    ],
    [
      'Muklas Champion',
      'ムクラの勇者',
      '穆克拉的勇士',
      '무클라의 용사'
    ],
    [
      'Mulch',
      'マルチ',
      '腐根',
      '양분 흡수'
    ],
    [
      'Multi-Shot',
      'マルチショット',
      '多重射击',
      '일제 사격'
    ],
    [
      'Murloc Knight',
      'マーロック騎士',
      '鱼人骑士',
      '멀록 기사'
    ],
    [
      'Murloc Raider',
      'マーロックの襲撃兵',
      '鱼人袭击者',
      '멀록 약탈꾼'
    ],
    [
      'Murloc Tidecaller',
      'マーロックのタイドコーラー',
      '鱼人招潮者',
      '멀록 파도술사'
    ],
    [
      'Murloc Tidehunter',
      'マーロックのタイドハンター',
      '鱼人猎潮者',
      '멀록 바다사냥꾼'
    ],
    [
      'Murloc Tinyfin',
      'マーロック・タイニーフィン',
      '鱼人宝宝',
      '아기 멀록'
    ],
    [
      'Murloc Warleader',
      'マーロックの戦隊長',
      '鱼人领军',
      '멀록 전투대장'
    ],
    [
      'Museum Curator',
      '博物館のキュレーター',
      '博物馆馆长',
      '박물관 관리인'
    ],
    [
      'Muster for Battle',
      '兵役招集',
      '作战动员',
      '병력 소집'
    ],
    [
      'Mysterious Challenger',
      '謎めいた挑戦者',
      '神秘挑战者',
      '수수께끼의 도전자'
    ],
    [
      'Naga Sea Witch',
      'ナーガの海の魔女',
      '纳迦海巫',
      '나가 바다 마녀'
    ],
    [
      'Nat Pagle',
      'ナット・ペイグル',
      '纳特·帕格',
      '내트 페이글'
    ],
    [
      'Naturalize',
      '自然への回帰',
      '自然平衡',
      '자연화'
    ],
    [
      'Nefarian',
      'ネファリアン',
      '奈法利安',
      '네파리안'
    ],
    [
      'Neptulon',
      'ネプチュロン',
      '耐普图隆',
      '넵튤론'
    ],
    [
      'Nerubar Weblord',
      'ネルバー・ウェブロード',
      '尼鲁巴蛛网领主',
      '네룹아르 그물군주'
    ],
    [
      'Nerubian Egg',
      'ネルビアンの卵',
      '蛛魔之卵',
      '네루비안 알'
    ],
    [
      'Nerubian',
      'ネルビアン',
      '',
      ''
    ],
    [
      'Nexus-Champion Saraad',
      'ネクサスの勇者サラード',
      '虚灵勇士萨兰德',
      '연합용사 사라아드'
    ],
    [
      'Nightblade',
      'ナイトブレード',
      '夜刃刺客',
      '암흑칼날'
    ],
    [
      'Noble Sacrifice',
      '身代わり',
      '崇高牺牲',
      '고귀한 희생'
    ],
    [
      'North Sea Kraken',
      '北海のクラーケン',
      '北海海怪',
      '북해 크라켄'
    ],
    [
      'Northshire Cleric',
      'ノースシャイアの聖職者',
      '北郡牧师',
      '북녘골 성직자'
    ],
    [
      'Nourish',
      '滋養',
      '滋养',
      '육성'
    ],
    [
      'Novice Engineer',
      '初級エンジニア',
      '工程师学徒',
      '풋내기 기술자'
    ],
    [
      'Nozdormu',
      'ノズドルム',
      '诺兹多姆',
      '노즈도르무'
    ],
    [
      'Oasis Snapjaw',
      'オアシス・オオアゴガメ',
      '绿洲钳嘴龟',
      '오아시스 무쇠턱거북'
    ],
    [
      'Obsidian Destroyer',
      'オブシディアン・デストロイヤー',
      '黑曜石毁灭者',
      '흑요석 파괴자'
    ],
    [
      'Ogre Brute',
      'オーガの暴れん坊',
      '食人魔步兵',
      '오우거 투사'
    ],
    [
      'Ogre Magi',
      'オーガのメイジ達',
      '食人魔法师',
      '오우거 마법사'
    ],
    [
      'Ogre Ninja',
      'オーガ・ニンジャ',
      '食人魔忍者',
      '오우거 닌자'
    ],
    [
      'Ogre Warmaul',
      'オーガの巨槌',
      '食人魔战槌',
      '오우거 전쟁망치'
    ],
    [
      'Old Murk-Eye',
      '大いなるマーク・アイ',
      '老瞎眼',
      '늙은 거먹눈 멀록'
    ],
    [
      'One-eyed Cheat',
      '隻眼のチート',
      '独眼欺诈者',
      '외눈박이 사기꾼'
    ],
    [
      'Onyxia',
      'オニクシア',
      '奥妮克希亚',
      '오닉시아'
    ],
    [
      'Orgrimmar Aspirant',
      'オーグリマーの志願兵',
      '奥格瑞玛狼骑士',
      '오그리마 지원자'
    ],
    [
      'Panther',
      'ヒョウ',
      '',
      ''
    ],
    [
      'Patient Assassin',
      '埋伏の暗殺者',
      '耐心的刺客',
      '침착한 암살자'
    ],
    [
      'Perditions Blade',
      '地獄送りの刃',
      '毁灭之刃',
      '전멸의 비수'
    ],
    [
      'Piloted Shredder',
      '手動操縦のシュレッダー',
      '载人收割机',
      '누군가 조종하는 벌목기'
    ],
    [
      'Piloted Sky Golem',
      '手動操縦のスカイ・ゴーレム',
      '载人飞天魔像',
      '누군가 조종하는 하늘 골렘'
    ],
    [
      'Pint-Sized Summoner',
      'ポケットサイズの召喚師',
      '小个子召唤师',
      '자그마한 소환사'
    ],
    [
      'Pit Fighter',
      '決闘士',
      '格斗士',
      '구덩이 투사'
    ],
    [
      'Pit Lord',
      'ピットロード',
      '深渊领主',
      '지옥의 군주'
    ],
    [
      'Pit Snake',
      'ピットスネーク',
      '深渊巨蟒',
      '구덩이 독사'
    ],
    [
      'Poison Seeds',
      '毒の種',
      '剧毒之种',
      '독성 씨앗'
    ],
    [
      'Poisoned Blade',
      '毒仕込みの刃',
      '淬毒利刃',
      '독 묻은 칼'
    ],
    [
      'Polymorph',
      '動物変身',
      '变形术',
      '변이'
    ],
    [
      'Polymorph:Boar',
      '動物変身・イノシシ',
      '变形术：野猪',
      '변이:멧돼지'
    ],
    [
      'Power of the Wild',
      '野生の力',
      '野性之力',
      '야생의 힘'
    ],
    [
      'Power Overwhelming',
      '凄まじき力',
      '力量的代价',
      '압도적인 힘'
    ],
    [
      'Power Word:Glory',
      '真言・栄光',
      '真言术：耀',
      '신의 권능:영광'
    ],
    [
      'Power Word:Shield',
      '真言・盾',
      '真言术：盾',
      '신의 권능:보호막'
    ],
    [
      'Powermace',
      'パワーメイス',
      '动力战锤',
      '강화 철퇴'
    ],
    [
      'Powershot',
      '剛力の一矢',
      '强风射击',
      '강화 사격'
    ],
    [
      'Preparation',
      '段取り',
      '伺机待发',
      '마음가짐'
    ],
    [
      'Priestess of Elune',
      'エルーンのプリーステス',
      '艾露恩的女祭司',
      '엘룬의 여사제'
    ],
    [
      'Prophet Velen',
      '預言者ヴェレン',
      '先知维伦',
      '예언자 벨렌'
    ],
    [
      'Puddlestomper',
      'パドルストンパー',
      '淤泥践踏者',
      '웅덩이디딤꾼'
    ],
    [
      'Pyroblast',
      'パイロブラスト',
      '炎爆术',
      '불덩이 작렬'
    ],
    [
      'Quartermaster',
      '兵站将校',
      '军需官',
      '병참장교'
    ],
    [
      'Questing Adventurer',
      'クエスト中の冒険者',
      '任务达人',
      '퀘스트 중인 모험가'
    ],
    [
      'Quick Shot',
      '速射の一矢',
      '快速射击',
      '속사'
    ],
    [
      'Raging Worgen',
      '激昂のウォーゲン',
      '暴怒的狼人',
      '흉포한 늑대인간'
    ],
    [
      'Ragnaros the Firelord',
      '炎の王ラグナロス',
      '炎魔之王拉格纳罗斯',
      '불의 군주 라그나로스'
    ],
    [
      'Raid Leader',
      'レイドリーダー',
      '团队领袖',
      '공격대장'
    ],
    [
      'Ram Wrangler',
      '羊飼育者',
      '暴躁的牧羊人',
      '산양 사육사'
    ],
    [
      'Rampage',
      '暴走',
      '狂暴',
      '광란'
    ],
    [
      'Raven Idol',
      'ワタリガラスの偶像',
      '乌鸦神像',
      '까마귀 우상'
    ],
    [
      'Ravenholdt Assassin',
      'レイヴンホルトの暗殺者',
      '拉文霍德刺客',
      '라벤홀트 암살자'
    ],
    [
      'Razorfen Hunter',
      'レイザーフェン・ハンター',
      '剃刀猎手',
      '가시덩굴 사냥꾼'
    ],
    [
      'Reckless Rocketeer',
      '無謀なロケット乗り',
      '鲁莽火箭兵',
      '못 말리는 로켓병'
    ],
    [
      'Recombobulator',
      'リコンボビュレイター',
      '侏儒变形师',
      '유전자 재결합사'
    ],
    [
      'Recruiter',
      '徴兵官',
      '征募官',
      '모병관'
    ],
    [
      'Recycle',
      'リサイクル',
      '回收',
      '재활용'
    ],
    [
      'Redemption',
      '救済',
      '救赎',
      '구원'
    ],
    [
      'Refreshment Vendor',
      'スナック売り',
      '零食商贩',
      '투스카르 행상인'
    ],
    [
      'Reincarnate',
      '転生',
      '转生',
      '윤회'
    ],
    [
      'Reliquarty Seeker',
      '聖堂の探求者',
      '',
      ''
    ],
    [
      'Reliquary Seeker',
      '聖堂の探求者',
      '遗物搜寻者',
      '성물회 구도자'
    ],
    [
      'Rend Blackhand',
      'レンド・ブラックハンド',
      '雷德·黑手',
      '렌드 블랙핸드'
    ],
    [
      'Reno Jackson',
      'レノ・ジャクソン',
      '雷诺·杰克逊',
      '리노 잭슨'
    ],
    [
      'Repentance',
      '懺悔',
      '忏悔',
      '참회'
    ],
    [
      'Resurrect',
      '復活',
      '复活术',
      '부활'
    ],
    [
      'Revenge',
      '報復',
      '复仇打击',
      '복수'
    ],
    [
      'Rhonin',
      'ローニン',
      '罗宁',
      '로닌'
    ],
    [
      'River Crocolisk',
      'リバー・クロコリスク',
      '淡水鳄',
      '민물악어'
    ],
    [
      'Rockbiter Weapon',
      '岩穿ちの武器',
      '石化武器',
      '대지의 무기'
    ],
    [
      'Rumbling Elemental',
      '轟きのエレメンタル',
      '顽石元素',
      '지축을 울리는 정령'
    ],
    [
      'Sabertooth Lion',
      'サーベル・ライオン',
      '',
      ''
    ],
    [
      'Sabertooth Panther',
      'サーベル・パンサー',
      '',
      ''
    ],
    [
      'Sabotage',
      'サボタージュ',
      '暗中破坏',
      '파괴 공작'
    ],
    [
      'Saboteur',
      '妨害工作員',
      '破坏者',
      '파괴공작원'
    ],
    [
      'Sacred Trial',
      '聖なる試練',
      '审判',
      '신성한 시험'
    ],
    [
      'Salty Dog',
      '老練船乗り',
      '熟练的水手',
      '노련한 뱃사람'
    ],
    [
      'Sap',
      '昏倒',
      '闷棍',
      '혼절시키기'
    ],
    [
      'Sapling',
      '若木',
      '',
      ''
    ],
    [
      'Savage Combatant',
      '野蛮の闘士',
      '狂野争斗者',
      '흉포한 전투원'
    ],
    [
      'Savage Roar',
      '野蛮の咆哮',
      '野蛮咆哮',
      '야생의 포효'
    ],
    [
      'Savagery',
      '野蛮',
      '野蛮之击',
      '야생성'
    ],
    [
      'Savannah Highmane',
      'サバンナ・ハイメイン',
      '长鬃草原狮',
      '사바나 사자'
    ],
    [
      'Scarlet Crusader',
      'スカーレット・クルセイダー',
      '血色十字军战士',
      '붉은십자군 성전사'
    ],
    [
      'Scarlet Purifier',
      'スカーレット・ピュリファイアー',
      '血色净化者',
      '붉은십자군 정화전사'
    ],
    [
      'Scavenging Hyena',
      '腐肉食いのハイエナ',
      '食腐土狼',
      '청소부 하이에나'
    ],
    [
      'Screwjank Clunker',
      'スクリュージャンク・クランカー',
      '废旧螺栓机甲',
      '깡통나사 고물로봇'
    ],
    [
      'Sea Giant',
      '海の巨人',
      '海巨人',
      '바다거인'
    ],
    [
      'Sea Reaver',
      'シー・リーヴァー',
      '破海者',
      '바다의 학살자'
    ],
    [
      'Seal of Champions',
      '勇者の紋章',
      '英勇圣印',
      '용사의 문장'
    ],
    [
      'Seal of Light',
      '光の紋章',
      '光明圣印',
      '빛의 문장'
    ],
    [
      'Searing Totem',
      '焦熱のトーテム',
      '',
      ''
    ],
    [
      'Secretkeeper',
      '秘密の番人',
      '奥秘守护者',
      '비밀지기'
    ],
    [
      'Senjin Shieldmasta',
      'センジン・シールドマスタ',
      '森金持盾卫士',
      '센진 방패대가'
    ],
    [
      'Sense Demons',
      '悪魔感知',
      '感知恶魔',
      '악마 감지'
    ],
    [
      'Shade of Naxxramas',
      'ナクスラーマスの亡霊',
      '纳克萨玛斯之影',
      '낙스라마스의 망령'
    ],
    [
      'Shado-Pan Cavalry',
      'シャドーパン騎兵',
      '',
      ''
    ],
    [
      'Shado-Pan Rider',
      'シャドーパン騎兵',
      '影踪骁骑兵',
      '음영파 기수'
    ],
    [
      'Shadow Bolt',
      'シャドウボルト',
      '暗影箭',
      '어둠의 화살'
    ],
    [
      'Shadow Madness',
      '影の狂気',
      '暗影狂乱',
      '암흑의 광기'
    ],
    [
      'Shadow of Nothing',
      '無の影',
      '',
      ''
    ],
    [
      'Shadow Word:Death',
      '密言・死',
      '暗言术：灭',
      '어둠의 권능:죽음'
    ],
    [
      'Shadow Word:Pain',
      '密言・痛',
      '暗言术：痛',
      '어둠의 권능:고통'
    ],
    [
      'Shadowbomber',
      'シャドウボンバー',
      '暗影投弹手',
      '그림자 폭격수'
    ],
    [
      'Shadowboxer',
      'シャドウボクサー',
      '暗影打击装甲',
      '권투로봇'
    ],
    [
      'Shadowfiend',
      'シャドーフィーンド',
      '暗影魔',
      '어둠의 마귀'
    ],
    [
      'Shadowflame',
      '影の炎',
      '暗影烈焰',
      '암흑불길'
    ],
    [
      'Shadowform',
      '影なる姿',
      '暗影形态',
      '어둠의 형상'
    ],
    [
      'Shadowste',
      '影隠れ',
      '',
      ''
    ],
    [
      'Shadowstep',
      '影走り',
      '暗影步',
      '그림자 밟기'
    ],
    [
      'Shady Dealer',
      '闇商人',
      '走私商贩',
      '암거래상'
    ],
    [
      'Shattered Sun Cleric',
      'シャタード・サンの聖職者',
      '破碎残阳祭司',
      '무너진 태양 성직자'
    ],
    [
      'Shield Block',
      'シールドブロック',
      '盾牌格挡',
      '방패 막기'
    ],
    [
      'Shield Slam',
      'シールドスラム',
      '盾牌猛击',
      '방패 밀쳐내기'
    ],
    [
      'Shieldbearer',
      '盾持ち',
      '持盾卫士',
      '방패병'
    ],
    [
      'Shielded Minibot',
      'シールドミニロボ',
      '护盾机器人',
      '보호막을 쓴 꼬마로봇'
    ],
    [
      'Shieldmaiden',
      'シールドメイデン',
      '盾甲侍女',
      '방패 여전사'
    ],
    [
      'Ships Cannon',
      '艦載砲',
      '船载火炮',
      '함포'
    ],
    [
      'Shiv',
      'ドス',
      '毒刃',
      '독칼'
    ],
    [
      'Shrinkmeister',
      'シュリンクマイスター',
      '缩小射线工程师',
      '축소술사'
    ],
    [
      'SI:7 Agent',
      'SI:7諜報員',
      '军情七处特工',
      'SI:7 요원'
    ],
    [
      'Sideshow Spelleater',
      '大道芸の呪文喰い',
      '杂耍吞法者',
      '공연장 주문탐식자'
    ],
    [
      'Siege Engine',
      '攻城兵器',
      '重型攻城战车',
      '공성 전차'
    ],
    [
      'Silence',
      '沈黙',
      '沉默',
      '침묵'
    ],
    [
      'Silent Knight',
      '静寂の騎士',
      '沉默的骑士',
      '고요한 기사'
    ],
    [
      'Siltfin Spiritwalker',
      'シルトフィン・スピリットウォーカー',
      '沙鳞灵魂行者',
      '진흙지느러미 영혼방랑자'
    ],
    [
      'Silver Hand Knight',
      'シルバーハンド騎士',
      '白银之手骑士',
      '은빛 성기사단 기사'
    ],
    [
      'Silver Hand Recruit',
      'シルバーハンド新兵',
      '',
      ''
    ],
    [
      'Silver Hand Regent',
      'シルバーハンドの執政',
      '白银之手教官',
      '은빛 성기사단 섭정'
    ],
    [
      'Silverback Patriarch',
      'シルバーバックの長',
      '银背族长',
      '은빛털고릴라 우두머리'
    ],
    [
      'Silvermoon Guardian',
      'シルバームーンの守護兵',
      '银月城卫兵',
      '실버문 수호병'
    ],
    [
      'Sinister Strike',
      '凶悪なる一撃',
      '影袭',
      '사악한 일격'
    ],
    [
      'Siphon Soul',
      '魂抽出',
      '灵魂虹吸',
      '영혼 착취'
    ],
    [
      'Sir Finley Mrrgglton',
      'サー・フィンレー・マルグルトン',
      '芬利·莫格顿爵士',
      '핀리 므르글턴 경'
    ],
    [
      'Skycapn Kragg',
      '空賊船長クラッグ',
      '天空上尉库拉格',
      '하늘선장 크라그'
    ],
    [
      'Slam',
      '叩きつけ',
      '猛击',
      '격돌'
    ],
    [
      'Sludge Belcher',
      'ヘドロゲッパー',
      '淤泥喷射者',
      '썩은위액 누더기골렘'
    ],
    [
      'Snake Trap',
      'ヘビの罠',
      '毒蛇陷阱',
      '뱀 덫'
    ],
    [
      'Snake',
      'ヘビ',
      '',
      ''
    ],
    [
      'Sneeds Old Shredder',
      'スニードの旧型シュレッダー',
      '斯尼德的伐木机',
      '스니드의 낡은 벌목기'
    ],
    [
      'Snipe',
      '狙撃',
      '狙击',
      '저격'
    ],
    [
      'Snowchugger',
      'スノーチャガー',
      '碎雪机器人',
      '꽁꽁로봇'
    ],
    [
      'Solemn Vigil',
      'しめやかな通夜',
      '严正警戒',
      '엄숙한 애도'
    ],
    [
      'Soot Spewer',
      'ススポッポー',
      '煤烟喷吐装置',
      '그을음 생성로봇'
    ],
    [
      'Sorcerers Apprentice',
      '魔法使いの弟子',
      '巫师学徒',
      '마술사의 수습생'
    ],
    [
      'Soul of the Forest',
      '森の魂',
      '丛林之魂',
      '숲의 영혼'
    ],
    [
      'Soulfire',
      '魂の炎',
      '灵魂之火',
      '영혼의 불꽃'
    ],
    [
      'Southsea Captain',
      '南海の船長',
      '南海船长',
      '남쪽바다 선장'
    ],
    [
      'Southsea Deckhand',
      '南海の甲板員',
      '南海船工',
      '남쪽바다 갑판원'
    ],
    [
      'Sparring Partner',
      'スパーリング・パートナー',
      '格斗陪练师',
      '대련 상대'
    ],
    [
      'Spawn of Shadows',
      'シャドースポーン',
      '暗影子嗣',
      '어둠의 종복'
    ],
    [
      'Spectral Knight',
      '亡霊騎士',
      '鬼灵骑士',
      '유령 기사'
    ],
    [
      'Spellbender',
      'スペルベンダー',
      '扰咒术',
      '주문왜곡사'
    ],
    [
      'Spellbreaker',
      'スペルブレイカー',
      '破法者',
      '주문파괴자'
    ],
    [
      'Spellslinger',
      'スペルスリンガー',
      '嗜法者',
      '주문사수'
    ],
    [
      'Spider Tank',
      'クモ戦車',
      '蜘蛛坦克',
      '거미 전차'
    ],
    [
      'Spirit Wolf',
      '狼の精霊',
      '',
      ''
    ],
    [
      'Spiteful Smith',
      '性悪な鍛冶屋',
      '恶毒铁匠',
      '원한 맺힌 대장장이'
    ],
    [
      'Sprint',
      '逃げ足',
      '疾跑',
      '전력 질주'
    ],
    [
      'Stablemaster',
      '厩舎長',
      '兽栏大师',
      '마구간지기'
    ],
    [
      'Stalagg',
      'スタラグ',
      '斯塔拉格',
      '스탈라그'
    ],
    [
      'Stampeding Kodo',
      '暴走コドー',
      '狂奔科多兽',
      '날뛰는 코도'
    ],
    [
      'Starfall',
      '星の雨',
      '星辰坠落',
      '별똥별'
    ],
    [
      'Starfire',
      '星の火',
      '星火术',
      '별빛섬광'
    ],
    [
      'Starving Buzzard',
      '飢えたハゲタカ',
      '饥饿的秃鹫',
      '굶주린 대머리수리'
    ],
    [
      'Steamwheedle Sniper',
      'スチームウィードルの狙撃兵',
      '热砂港狙击手',
      '스팀휘들 저격수'
    ],
    [
      'Stoneclaw Totem',
      '石爪のトーテム',
      '',
      ''
    ],
    [
      'Stoneskin Gargoyle',
      '石肌のガーゴイル',
      '岩肤石像鬼',
      '돌가죽 가고일'
    ],
    [
      'Stonesplinter Trogg',
      'ストーンスプリンター・トログ',
      '碎石穴居人',
      '가루바위 트로그'
    ],
    [
      'Stonetusk Boar',
      '石牙のイノシシ',
      '石牙野猪',
      '돌엄니멧돼지'
    ],
    [
      'Stormforged Axe',
      'ストームフォージド・アックス',
      '雷铸战斧',
      '폭풍으로 벼려낸 도끼'
    ],
    [
      'Stormpike Commando',
      'ストームパイクのコマンドー',
      '雷矛特种兵',
      '스톰파이크 특공대'
    ],
    [
      'Stormwind Champion',
      'ストームウィンドの勇者',
      '暴风城勇士',
      '스톰윈드 용사'
    ],
    [
      'Stormwind Knight',
      'ストームウィンドの騎士',
      '暴风城骑士',
      '스톰윈드 기사'
    ],
    [
      'Stranglethorn Tiger',
      'ストラングソーン トラ',
      '荆棘谷猛虎',
      '가시덤불 호랑이'
    ],
    [
      'Succubus',
      'サキュバス',
      '魅魔',
      '서큐버스'
    ],
    [
      'Summoning Portal',
      '召喚のポータル',
      '召唤传送门',
      '소환의 문'
    ],
    [
      'Summoning Stone',
      '召喚石',
      '集合石',
      '소환의 돌'
    ],
    [
      'Sunfury Protector',
      'サンフューリーの護衛',
      '日怒保卫者',
      '성난태양 파수병'
    ],
    [
      'Sunwalker',
      'サンウォーカー',
      '烈日行者',
      '태양길잡이'
    ],
    [
      'Sacrificial Pact',
      '生贄の契約',
      '牺牲契约',
      '희생의 서약'
    ],
    [
      'Swipe',
      'なぎ払い',
      '横扫',
      '휘둘러치기'
    ],
    [
      'Sword of Justice',
      'ソード・オブ・ジャスティス',
      '公正之剑',
      '정의의 칼날'
    ],
    [
      'Sylvanas Windrunner',
      'シルヴァナス・ウィンドランナー',
      '希尔瓦娜斯·风行者',
      '실바나스 윈드러너'
    ],
    [
      'Target Dummy',
      'ターゲット・ダミー',
      '活动假人',
      '표적 허수아비'
    ],
    [
      'Tauren Warrior',
      'トーレン・ウォリアー',
      '牛头人战士',
      '타우렌 전사'
    ],
    [
      'Temple Enforcer',
      '寺院の執行人',
      '圣殿执行者',
      '사원 집행자'
    ],
    [
      'Thaddius',
      'サディウス',
      '',
      ''
    ],
    [
      'The Beast',
      '魔獣',
      '比斯巨兽',
      '괴수'
    ],
    [
      'The Black Knight',
      '黒騎士',
      '黑骑士',
      '흑기사'
    ],
    [
      'The Mistcaller',
      '霧招き',
      '唤雾者伊戈瓦尔',
      '안개소환사'
    ],
    [
      'The Skeleton Knight',
      '骸骨騎士',
      '骷髅骑士',
      '해골 기사'
    ],
    [
      'Thoughtsteal',
      '思念奪取',
      '思维窃取',
      '생각 훔치기'
    ],
    [
      'Thrallmar Farseer',
      'スロールマーの遠見師',
      '萨尔玛先知',
      '스랄마 선견자'
    ],
    [
      'Thunder Bluff Valiant',
      'サンダー・ブラフの勇士',
      '雷霆崖勇士',
      '썬더 블러프 용맹전사'
    ],
    [
      'Timber Wolf',
      '森林オオカミ',
      '森林狼',
      '회갈색 늑대'
    ],
    [
      'Tinkers Sharpsword Oil',
      'ティンカーの刃研ぎ油',
      '修补匠的磨刀油',
      '땜장이의 뾰족칼 기름'
    ],
    [
      'Tinkertown Technician',
      'ティンカータウンの技術者',
      '工匠镇技师',
      '땜장이 마을 기술자'
    ],
    [
      'Tinkmaster Overspark',
      'ティンクマスター・オーバースパーク',
      '工匠大师欧沃斯巴克',
      '수석땜장이 오버스파크'
    ],
    [
      'Tiny Knight of Evil',
      '小粒なる邪悪の騎士',
      '小鬼骑士',
      '작고 사악한 창기사'
    ],
    [
      'Tirion Fordring',
      'ティリオン・フォードリング',
      '提里奥·弗丁',
      '티리온 폴드링'
    ],
    [
      'Tomb Pillager',
      '墓荒らし',
      '盗墓匪贼',
      '묘실 도굴꾼'
    ],
    [
      'Tomb Spider',
      '墓守蜘蛛',
      '墓穴蜘蛛',
      '무덤 거미'
    ],
    [
      'Toshley',
      'トッシュリー',
      '托什雷',
      '토쉴리'
    ],
    [
      'Totem Golem',
      'トーテム・ゴーレム',
      '图腾魔像',
      '토템 골렘'
    ],
    [
      'Totemic Might',
      'トーテムの力',
      '图腾之力',
      '토템의 힘'
    ],
    [
      'Tournament Attendee',
      'トーナメント参加者',
      '赛场观众',
      '마상시합 관중'
    ],
    [
      'Tournament Medic',
      'トーナメント衛生兵',
      '赛场医师',
      '마상시합장 의무관'
    ],
    [
      'Tracking',
      '追跡術',
      '追踪术',
      '추적'
    ],
    [
      'Trade Prince Gallywix',
      '商大公ガリーウィックス',
      '加里维克斯',
      '무역왕 갤리윅스'
    ],
    [
      'Treant',
      'トレント',
      '',
      ''
    ],
    [
      'Tree of Life',
      '生命の樹',
      '生命之树',
      '생명의 나무'
    ],
    [
      'Troggzor the Earthinator',
      'アーシネイター・トログザー',
      '颤地者特罗格佐尔',
      '대지종결자 트로그조르'
    ],
    [
      'Truesilver Champion',
      'トゥルーシルバー・チャンピオン',
      '真银圣剑',
      '용사의 진은검'
    ],
    [
      'Tundra Rhino',
      'ツンドラサイ',
      '苔原犀牛',
      '툰드라 코뿔소'
    ],
    [
      'Tunnel Trogg',
      'トンネル・トログ',
      '坑道穴居人',
      '땅굴 트로그'
    ],
    [
      'Tuskarr Jouster',
      'タスカーの槍試合選手',
      '海象人龟骑士',
      '투스카르 창기사'
    ],
    [
      'Tuskarr Totemic',
      'タスカーのトーテム師',
      '海象人图腾师',
      '투스카르 토템지기'
    ],
    [
      'Twilight Drake',
      'トワイライト・ドレイク',
      '暮光幼龙',
      '황혼의 비룡'
    ],
    [
      'Twilight Guardian',
      'トワイライトの守護者',
      '暮光守护者',
      '황혼의 수호자'
    ],
    [
      'Twilight Whelp',
      'チビ・トワイライトドラゴン',
      '暮光雏龙',
      '황혼의 새끼용'
    ],
    [
      'Twisting Nether',
      '捻じれし冥界',
      '扭曲虚空',
      '뒤틀린 황천'
    ],
    [
      'Unbound Elemental',
      '自由なるエレメンタル',
      '无羁元素',
      '속박 풀린 정령'
    ],
    [
      'Undercity Valiant',
      'アンダーシティの勇士',
      '幽暗城勇士',
      '언더시티 용맹전사'
    ],
    [
      'Undertaker',
      '墓堀り人',
      '送葬者',
      '장의사'
    ],
    [
      'Unearthed Raptor',
      '掘り起こされたラプター',
      '石化迅猛龙',
      '발굴된 랩터'
    ],
    [
      'Unleash the Hounds',
      '猟犬を放て！',
      '关门放狗',
      '개들을 풀어라'
    ],
    [
      'Unstable Ghoul',
      '不安定なグール',
      '蹒跚的食尸鬼',
      '불안정한 구울'
    ],
    [
      'Unstable Portal',
      '不安定なポータル',
      '不稳定的传送门',
      '불안정한 차원문'
    ],
    [
      'Upgrade!',
      'アップグレード！',
      '升级！',
      '강화!'
    ],
    [
      'Upgraded Repair Bot',
      '改良型修理ロボ',
      '高级修理机器人',
      '업그레이드된 수리 로봇'
    ],
    [
      'Vanish',
      '退散',
      '消失',
      '소멸'
    ],
    [
      'Vaporize',
      '蒸発',
      '蒸发',
      '증발시키기'
    ],
    [
      'Varian Wrynn',
      'ヴァリアン・リン',
      '瓦里安·乌瑞恩',
      '바리안 린'
    ],
    [
      'Velens Chosen',
      'ヴェレンに選ばれし者',
      '维伦的恩泽',
      '벨렌의 선택'
    ],
    [
      'Venture Co. Mercenary',
      'ベンチャー社の傭兵',
      '风险投资公司雇佣兵',
      '투자개발회사 용병'
    ],
    [
      'Violet Teacher',
      'ヴァイオレット・アイの講師',
      '紫罗兰教师',
      '보랏빛 여교사'
    ],
    [
      'Vitality Totem',
      '生命力のトーテム',
      '活力图腾',
      '활력의 토템'
    ],
    [
      'Void Crusher',
      'ヴォイド・クラッシャー',
      '虚空碾压者',
      '공허파괴자'
    ],
    [
      'Void Terror',
      'ヴォイドテラー',
      '虚空恐魔',
      '공허의 괴물'
    ],
    [
      'Voidcaller',
      'ヴォイドコーラー',
      '空灵召唤者',
      '공허소환사'
    ],
    [
      'Voidwalker',
      'ヴォイドウォーカー',
      '虚空行者',
      '공허방랑자'
    ],
    [
      'Voljin',
      'ヴォルジン',
      '沃金',
      '볼진'
    ],
    [
      'Volcanic Drake',
      'ヴォルカニック・ドレイク',
      '火山幼龙',
      '화산 비룡'
    ],
    [
      'Volcanic Lumberer',
      'ヴォルカニック・ランバラー',
      '火山邪木',
      '화산의 나무정령'
    ],
    [
      'Voodoo Doctor',
      'ヴードゥーの呪術師',
      '巫医',
      '부두교 의술사'
    ],
    [
      'Wailing Soul',
      '泣き叫ぶ魂',
      '哀嚎的灵魂',
      '울부짖는 영혼'
    ],
    [
      'War Golem',
      '戦のゴーレム',
      '作战傀儡',
      '전쟁 골렘'
    ],
    [
      'Warbot',
      '戦闘ロボ',
      '战斗机器人',
      '전쟁로봇'
    ],
    [
      'Warhorse Trainer',
      '戦馬訓練士',
      '战马训练师',
      '전투마 조련사'
    ],
    [
      'Warsong Commander',
      'ウォーソングの武将',
      '战歌指挥官',
      '전쟁노래 사령관'
    ],
    [
      'Water Elemental',
      'ウォーター・エレメンタル',
      '水元素',
      '물의 정령'
    ],
    [
      'Webspinner',
      'ウェブスピナー',
      '结网蛛',
      '그물거미'
    ],
    [
      'Wee Spellstopper',
      'ウィー・スペルストッパー',
      '小个子扰咒师',
      '작은 주문차단자'
    ],
    [
      'Whirling Zap-o-matic',
      '回転式ザップ・オ・マティック',
      '自动漩涡打击装置',
      '회전하는 자동제압로봇'
    ],
    [
      'Whirlwind',
      '旋風剣',
      '旋风斩',
      '소용돌이'
    ],
    [
      'Wicked Knife',
      '邪道のナイフ',
      '',
      ''
    ],
    [
      'Wild Growth',
      '野生の繁茂',
      '野性成长',
      '급속 성장'
    ],
    [
      'Wild Pyromancer',
      '熱狂する火霊術師',
      '狂野炎术师',
      '광기의 화염술사'
    ],
    [
      'Wildwalker',
      '荒野を歩む者',
      '荒野行者',
      '야생길잡이'
    ],
    [
      'Wilfred Fizzlebang',
      'ウィルフレッド・フィスルバン',
      '威尔弗雷德·菲兹班',
      '윌프레드 피즐뱅'
    ],
    [
      'Windfury Harpy',
      '疾風のハーピィ',
      '风怒鹰身人',
      '성난바람 하피'
    ],
    [
      'Windfury',
      '疾風',
      '风怒',
      '질풍'
    ],
    [
      'Windspeaker',
      'ウィンドスピーカー',
      '风语者',
      '바람예언자'
    ],
    [
      'Wisp',
      'ウィスプ',
      '小精灵',
      '위습'
    ],
    [
      'Wobbling Runts',
      'ふらつくこびと達',
      '摇摆的俾格米',
      '흔들거리는 소인족'
    ],
    [
      'Wolfrider',
      'ウルフライダー',
      '狼骑兵',
      '늑대기수'
    ],
    [
      'Worgen Infiltrator',
      'ウォーゲンのスパイ',
      '狼人渗透者',
      '늑대인간 침투요원'
    ],
    [
      'Worthless Imp',
      '役立たずのインプ',
      '',
      ''
    ],
    [
      'Wrath of Air Totem',
      '怒れる大気のトーテム',
      '',
      ''
    ],
    [
      'Wrath',
      '自然の怒り',
      '愤怒',
      '천벌'
    ],
    [
      'Wrathguard',
      'ラスガード',
      '愤怒卫士',
      '격노수호병'
    ],
    [
      'Wyrmrest Agent',
      'ワームレストのエージェント',
      '龙眠教官',
      '고룡쉼터 요원'
    ],
    [
      'Young Dragonhawk',
      '巣立ちのドラゴンホーク',
      '幼龙鹰',
      '어린 용매'
    ],
    [
      'Young Priestess',
      '若きプリーステス',
      '年轻的女祭司',
      '젊은 여사제'
    ],
    [
      'Youthful Brewmaster',
      '若き酒造大師',
      '年轻的酒仙',
      '젊은 양조사'
    ],
    [
      'Ysera',
      'イセラ',
      '伊瑟拉',
      '이세라'
    ],
    [
      'Zombie Chow',
      'エサゾンビ',
      '肉用僵尸',
      '간식용 좀비'
    ],
    [
      'Totemic Call',
      'トーテム招来',
      '',
      ''
    ],
    [
      'FireBlast',
      'ファイアブラスト',
      '',
      ''
    ],
    [
      'Armor Up!',
      '装甲強化！',
      '',
      ''
    ],
    [
      'Dagger Mastery',
      'ダガーの達人',
      '',
      ''
    ],
    [
      'Lesser Heal',
      '小回復',
      '',
      ''
    ],
    [
      'Reinforce',
      '増援',
      '',
      ''
    ],
    [
      'Life Tap',
      '命を魔力に',
      '',
      ''
    ],
    [
      'Steady Shot',
      '不抜の一矢',
      '',
      ''
    ],
    [
      'Magni Bronzebeard',
      'マグニ・ブロンズビアード',
      '',
      ''
    ],
    [
      'Blessing of Might',
      '力の祝福',
      '力量祝福',
      '힘의 축복'
    ],
    [
      'Medivh',
      'メディヴ',
      '',
      ''
    ],
    [
      'Alleria Windrunner',
      'アレリア・ウィンドランナー',
      '',
      ''
    ]
    ];
  },
  plist: function () {
    return [
    ['Secret',
    'シークレット',
    '',
    ''],
    [
      'Midrange',
      'ミッドレンジ',
      '',
      ''
    ],
    [
      'Aggro',
      'アグロドルイド',
      '',
      ''
    ],
    [
      'Midrange',
      'ミッド',
      '',
      ''
    ],
    [
      'Miracle',
      'ミラクル',
      '',
      ''
    ],
    [
      'Reno',
      'レノ',
      '',
      ''
    ],
    [
      'Control',
      'コント',
      '',
      ''
    ],
    [
      'Malygos',
      'マリゴス',
      '',
      ''
    ],
    [
      'Midrange',
      'ミッドレンジ',
      '',
      ''
    ],
    [
      'Patron',
      'パトロン',
      '',
      ''
    ],
    [
      'Dragon',
      'ドラゴン',
      '',
      ''
    ],
    [
      'Tempo',
      'テンポ',
      '',
      ''
    ],
    [
      'Face',
      'フェイス',
      '',
      ''
    ],
    [
      'Hybrid',
      'ハイブリッド',
      '',
      ''
    ],
    [
      'Zoo',
      'ズー',
      '',
      ''
    ],
    [
      'Oil',
      'オイル',
      '',
      ''
    ],
    [
      'Raptor',
      'ラプター',
      '',
      ''
    ],
    [
      'Murloc',
      'マーロック',
      '',
      ''
    ],
    [
      'Entomb',
      'エントゥーム',
      '',
      ''
    ],
    [
      'Freeze Mage',
      'フリーズメイジ',
      '',
      ''
    ],
    [
      'Handlock',
      'ハンドロック',
      '',
      ''
    ],
    [
      'Dragonlock',
      'ドラゴンロック',
      '',
      ''
    ],
    [
      'Tavern Brawl',
      '酒場の喧嘩',
      '',
      ''
    ],
    [
      'Tournament',
      'トーナメント',
      '',
      ''
    ],
    [
      'Theorycraft',
      'その他（Theorycraft）',
      '',
      '컨셉덱'
    ],
    [
      'Minion',
      'ミニオン',
      '',
      '하수인'
    ],
    [
      'Immune',
      '無敵',
      '',
      ''
    ],
    [
      'Inspire',
      '激励',
      '',
      '격려'
    ],
    [
      'Windfury',
      '疾風',
      '',
      '질풍'
    ],
    [
      'Enrage',
      '激怒',
      '',
      '격노'
    ],
    [
      'Overload',
      'オーバーロード',
      '',
      '과부하'
    ],
    [
      'Silence',
      '沈黙',
      '',
      '침묵'
    ],
    [
      'Secret',
      '秘策',
      '',
      '비밀'
    ],
    [
      'Stealth',
      '隠れ身',
      '',
      '은신'
    ],
    [
      'Spell Damage',
      '呪文ダメージ',
      '',
      '주문 공격력'
    ],
    [
      'Charge',
      '突撃',
      '',
      '돌진'
    ],
    [
      'ChooseOne',
      '選択',
      '',
      '선택'
    ],
    [
      'Deathrattle',
      '断末魔',
      '',
      '죽음의 메아리'
    ],
    [
      'Divine Shield',
      '聖なる盾',
      '',
      '천상의 보호막'
    ],
    [
      'Taunt',
      '挑発',
      '',
      '도발'
    ],
    [
      'Transform',
      '変身',
      '',
      ''
    ],
    [
      'Battlecry',
      '雄叫び',
      '',
      '전투의 함성'
    ],
    [
      'Discover',
      '発見',
      '',
      ''
    ],
    [
      'Fatigue',
      '疲労',
      '',
      ''
    ],
    [
      'Combo',
      'コンボ',
      '',
      '연계'
    ],
    [
      'Freeze',
      '凍結',
      '',
      '빙결'
    ],
    [
      'Joust',
      'ジャウスト',
      '',
      ''
    ],
    [
      'Deck Type',
      'デッキタイプ',
      '',
      ''
    ],
    [
      'Dust Cost',
      '魔素コスト',
      '',
      ''
    ],
    [
      'Weapon',
      '武器',
      '',
      '무기'
    ],
    [
      '',
      '呪文',
      '',
      '주문'
    ],
    [
      '',
      'ドロー',
      '',
      '카드 뽑기'
    ],
    [
      'Dragon',
      'ドラゴン',
      '',
      ''
    ],
    [
      'Mech',
      'メック',
      '',
      ''
    ],
    [
      'Mage',
      'メイジ',
      '',
      '마법사'
    ],
    [
      'Hunter',
      'ハンター',
      '',
      '사냥꾼'
    ],
    [
      'Paladin',
      'パラディン',
      '',
      '성기사'
    ],
    [
      'Priest',
      'プリースト',
      '',
      '사제'
    ],
    [
      'Shaman',
      'シャーマン',
      '',
      '주술사'
    ],
    [
      'Warlock',
      'ウォーロック',
      '',
      '흑마법사'
    ],
    [
      'Rogue',
      'ローグ',
      '',
      '도적'
    ],
    [
      'Warrior',
      'ウォリアー',
      '',
      '전사'
    ],
    [
      'Druid',
      'ドルイド',
      '',
      '드루이드'
    ],
    [
      '',
      'レジェ無し',
      '',
      '노전설'
    ],
    [
      '',
      '無課金',
      '',
      '무과금'
    ],
    [
      '',
      '初期化',
      '',
      '초기화'
    ],
    [
      '',
      '動画あり',
      '',
      '영상 포함'
    ],
    [
      '',
      '枚以上',
      '',
      '장 이상'
    ],
    [
      '',
      'ダメージ',
      '',
      '피해'
    ],
    [
      'Gain',
      '増加',,
    ],
    [
      'Give',
      '付与',
      ,
    ],
    [
      'Destroy',
      '破壊',
      ,
    ],
    [
      'Equip',
      '装備',
      ,
    ],
      ["","カード","","카드목록"],
      ["","デッキ","","덱 시뮬레이터"]
    ];
  }
};
HRSJPC.gm.main();

