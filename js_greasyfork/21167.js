// ==UserScript==
// @name        EH_Tag_Exposer_and_Hider
// @author      Nowaydumb
// @description Show all tags on hover, favorites tags marked and in bold, unliked tags marked and red .Put your favorite Tags in front of the title, Hide tags you dislike, Button to show hidden galleries. Add favorite and disliked tags by easily editing the script.
// @include     http*://exhentai.org/
// @include     http*://exhentai.org/?*
// @include     http*://exhentai.org/tag/*
// @include     http*://exhentai.org/favorites.php
// @include     http*://exhentai.org/favorites.php?*
// @include     http*://exhentai.org/uploader/*
// @include     http://g.e-hentai.org/
// @include     http://g.e-hentai.org/?*
// @include     http://g.e-hentai.org/tag/*
// @include     http://g.e-hentai.org/favorites.php
// @include     http://g.e-hentai.org/favorites.php?*
// @include     http://g.e-hentai.org/uploader/*
// @version     1.06
// @grant       none
// @run-at      document-idle
// @namespace https://greasyfork.org/users/53150
// @downloadURL https://update.greasyfork.org/scripts/21167/EH_Tag_Exposer_and_Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/21167/EH_Tag_Exposer_and_Hider.meta.js
// ==/UserScript==
/*Favorites*/
var UnlikeTags = {
    'body swap': 'BODY SWAP',
    'diaper': 'DIAPER',
    'dickgirl on male': 'FUTA+MALE',
    'females only': 'GIRL ONLY',
    'femdom': 'FEMDOM',
    'frottage': '2DICKRUB',
    'furry': 'FURRY',
    //'hairy armpits': 'HAIRY ARMPITS',
    //'hairy': 'HAIRY',
    'incomplete': 'INCOMPLETE',
    'males only': 'MALE ONLY',
    'non-nude': 'NON NUDE',
    'novel': 'NOVEL',
    'sample': 'SAMPLE',
    'vore': 'VORE',
    'yaoi': 'YAOI',
    'yuri':'YURI',

}; /*Disliked*/
var AlertTags = {
 // 'age progression': 'AGE PROG',
   // 'age regression': 'AGE REG',
    'ahegao': 'AHEGAO',
   // 'amputee': 'AMPUTEE',
    'anal birth': 'ANAL BIRTH',
    'anal': 'ANAL',
    'armpit licking': 'ARMPIT LICK',
    'armpit sex': 'ARMPIT SEX',
    'assjob': 'ASSJOB',
    'autopaizuri': 'AUTO PAIZ',
    'ballsucking': 'BALLSUCK',
    'bbm': 'BBM',
    'bestiality': 'BEAST',
    'big clit': 'BIG CLIT',
    'big penis': 'BIG DICK',
    'bike shorts': 'BIKE SHORTS',
    'birth': 'BIRTH',
    'blackmail': 'BLACKMAIL',
    //'blindfold': 'BLINDFOLD',
    'blowjob face': 'SUCK FACE',
    'body modification': 'BODY MOD',
    'body paiting': 'BODY PAINT',
    'body writing': 'BODY WRITE',
    'bodystocking': 'BODYSTOCKING',
    'bodysuit': 'BODYSUIT',
    'brainfuck': 'BRAINFUCK',
    //'bride': 'BRIDE',
    //'bukkake': 'BUKKAKE',
    //'bunny girl': 'BUNNYGIRL',
    //'business suit': 'OL',
    'cashier': 'CASHIER',
    //'catgirl': 'CATGIRL',
    'cervix penetration': 'CERVIX PEN',
    'cheating': 'CHEAT',
    'chikan': 'CHIKAN',
    'chinese dress': 'CHINESE DRESS',
    'chloroform': 'CHLOROFORM',
    'clith growth': 'CLIT GROWTH',
    'cockslapping': 'COCKSLAP',
    //'collar': 'COLLAR',
    'condom': 'CONDOM',
    'corruption': 'CORRUPT',
    'cosplaying': 'COSPLAY',
    'cum bath': 'CUM BATH',
    'cum swap': 'CUM SWAP',
    'cuntboy': 'CUNTBOY',
    //'dark skin': 'DARK SKIN',
    'defloration': 'DEFLO',
    'dick growth': 'DICK GROWTH',
    'dickgirl on dickgirl': 'FUTA+FUTA',
    'dicknipples': 'DICKNIPPLES',
    'dilf': 'DILF',
    'drugs': 'DRUGS',
    'drunk': 'DRUNK',
    'eggs': 'EGGS',
    'elf': 'ELF',
    'emotionless sex': 'EMOTIONLESS',
    'enema': 'ENEMA',
    //'english': 'ENG',
    'exhibitionism': 'EXHIB',
    //'father': 'DAD',
    'females only': 'FEM ONLY',
    'fisting': 'FISTING',
    'forniphilia': 'FURNITURE',
    //'full censorship': 'FCEN',
    //'full color': 'COLOR',
    'fundoshi': 'FUNDOSHI',
    'futanari': 'FUTA',
    'game sprite': 'PIXEL',
    'gaping': 'GAPING',
    'glory hole': 'GLORY HOLE',
    'gokkun': 'GOKKUN',
    'gothic lolita': 'GOTH LOLI',
    'guro': 'GURO',
    'gyaru': 'GYARU',
    'haigure': 'HAIGURE',
    'hijav': 'HIJAB',
    'horse cock': 'HORSE COCK',
    'huge penis': 'HUGE DICK',
    'human cattle': 'HUMAN CATTLE',
    'human pet': 'PET',
    'humiliation': 'HUMILIATED',
    'impregnation': 'IMPREG',
    'incest': 'INCEST',
    'insect': 'INCEST',
    'inverted nipples': 'INV NIPPLES',
    'invisible': 'INVIS',
    'japanese': 'JP',
    'kigurumi': 'KIGURUMI',
    'kimono': 'KIMONO',
    'kunoich': 'NINJA',
    //'lactation': 'LACTATE',
    'large insertions': 'XL INSERT',
    'latex': 'LATEX',
    'leglock': 'LEGLOCK',
    'leotard': 'LEOTARD',
    'living clothers': 'LIVE CLOTHES',
    'lolicon': 'LOLI',
    'maid': 'MAID',
    'male on dickgirl': 'MALE+FUTA',
    'mind break': 'MB',
    'mind control': 'MC',
    'monster': 'MONSTER',
    'moral degeneration': 'MD',
    //'mosaic censorship': 'MCEN',
    'mother': 'MOM',
    'multiple penises': '2 DICKS',
    'nakadashi': 'CREAMPIE',
    'navel fuck': 'NAVEL FUCK',
    'netorare': 'NTR',
    'nipple fuck': 'NIPPLE FUCK',
    'nose hook': 'NOSE HOOK',
    'nurse': 'NURSE',
    'oil': 'OIL',
    'old man': 'OLD MAN',
    'oppai loli': 'OPPAI LOLI',
    'orc': 'ORC',
    'orgasm denial': 'CUM DENIAL',
    'pantyhose': 'PANTYHOSE',
    'parasite': 'PARASITE',
    'pasties': 'PASTIES',
    'penis birth': 'PENIS BIRTH',
    'phimosis': 'PHIMOSIS',
    'piercing': 'PIERCING',
    'pig man': 'PIGMAN',
    'pig': 'PIG',
    'policewoman': 'POLICEWOMAN',
    'possession': 'POSSESSION',
    'pregnant': 'PREG',
    'prolapse': 'PROLAPSE',
    'prostate massage': 'PROSTATE MASSAGE',
    'prostitution': 'WHORE',
    'public use': 'PUB USE',
    'randoseru': 'RED BACKPACK',
    'rape': 'RAPE',
    'rimjob': 'RIMJOB',
    'ryona': 'RYONA',
    'salive': 'SALIVA',
    'scat': 'SCAT',
    //'school swimswuit': 'SSWIMSUIT',
    'schoolgirl uniform': 'SG',
    'shemale': 'SHEMALE',
    'shotacon': 'SHOTA',
    //'sister': 'SIS',
    'skinsuit': 'SKINSUIT',
    'slave': 'SLAVE',
    'sleeping': 'SLEEP',
    'slime girl': 'SLIME GIRL',
    'slime': 'SLIME',
    'slug': 'SLUG',
    'smegma': 'SMEGMA',
    //'sole dickgirl': 'SOLE DICKGIRL',
    //'sole female': 'SOLE FEM',
    'stewardess': 'STEWARDESS',
    'stockings': 'STOCKINGS',
    'stomach deformation': 'STOMACH DEF',
    'story arc': 'STORY',
    'stuck in wall': 'STUCK WALL',
    'sumata': 'THIGH RUB',
    'sweating': 'SWEAT',
    //'swimsuit': 'BIKINI',
    'syringe': 'SYRINGE',
    'tanlines': 'TAN',
    //'teacher': 'TEACHER',
    'tentacles': 'TENTACLE',
    'time stop': 'TIME STOP',
    'tomboy': 'TOMBOY',
    'torture': 'TORTURE',
    'translated': 'TL',
    'unbirth': 'UNBIRTH',
    'uncensored': 'UNCEN',
    'unusual pupils': 'PUPILS',
    'urethra insertion': 'URETHRA',
    'worm': 'WORM',
    'x-ray': 'XRAY',
};
/*Tag Rename*/
var TagsChs = {
  'netorare':'NTR',
};
/*Liked and Disliked tags listed at the top uncomment "UnlikeTags_Div.innerHTML = TopAlert;"*/
var TopAlert = 'Hiding：<span style="font-size:larger">';
for (var i in UnlikeTags) {
  TopAlert += UnlikeTags[i] + '&nbsp;';
}
TopAlert += '</span><br>Favorites：<span style="font-size:larger">';
for (var i in AlertTags) {
  TopAlert += AlertTags[i] + '&nbsp;';
}
TopAlert += '</span>';
var UnlikeTags_Div = document.querySelector('h1');
//UnlikeTags_Div.innerHTML = TopAlert;
var Div_needHide = [];
var Div = document.querySelectorAll('.it5>a,.id2>a');
var Group_Artist_Array = [];
var Group_Array = [];
var Artist_Array = [];
var Doujinshi_Array = [];
var gidlist = [];
var gmetadata_all = [];
for (var i = 0; i < Div.length; i++) {
  if (Div[i].querySelector('img')){
      Div[i].querySelector('img').className = 'TagPreview_' + i;}
    else{
        Div[i].className = 'TagPreview_' + i;
  }
  var url_array = Div[i].href.split('/');
  gidlist.push([url_array[4],
  url_array[5]]);
  if (i === 24) {
    xhr(gidlist, 0);
    gidlist = [];
  } else if (i === 49) {
    xhr(gidlist, 1);
  } else if (i === Div.length - 1 && i < 24) {
    xhr(gidlist, 0);
  } else if (i === Div.length - 1 && i > 24) {
    xhr(gidlist, 1);
  }
}
function xhr(gidlist, status) {
  var gdata = {
    'method': 'gdata',
    'gidlist': gidlist,
    'namespace': 1
  };
  var xhr = 'xhr_' + Math.random().toString();
  xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://exhentai.org/api.php', true);
  xhr.onload = function () {
    var apirsp = JSON.parse(xhr.responseText);
    TagPreview(apirsp.gmetadata, status);
    HideGalleries();
  };
  xhr.send(JSON.stringify(gdata));
}
function TagPreview(gmetadata, status) {
  if (status === 0) {
    gmetadata_all = gmetadata.concat(gmetadata_all);
  } else {
    gmetadata_all = gmetadata_all.concat(gmetadata);
  }
  //console.log(gmetadata);
  //console.log(gmetadata_all);
  var Box = document.createElement('div');
  Box.id = 'TagPreview';
  Box.style = 'position:absolute;padding:5px;display:none;z-index:999;font-size:larger;width:300px;border-color:black;border-style:solid;color:white;background-color:#34353B;';
  document.querySelector('.ido').onmousemove = function (e) {
    if (e.target.className.indexOf('TagPreview_') >= 0) {
      var id = e.target.className.replace('TagPreview_', '');
      if (gmetadata_all[id].tags) {
        var tags = gmetadata_all[id].tags;
        var tag_pos = 0;
        for (var i = 0; i < tags.length; i++) {

           if (tags[i].match(/^((?!\:).)*$/)) {
                if (tags[i] in AlertTags) {
                    tags[i] = '<span style="color:white;font-weight:bold;">[' + tags[i] + ']</span>';
                } else if (tags[i] in UnlikeTags) {
                    tags[i] = '<span style="color:red;font-weight:bold;">{' + tags[i] + '}</span>';
                }
                    if ( tag_pos <= 7 ){
                        //tags[i] = '<span>Other: </span>' + tags[i];
                        if (tag_pos !== 0){
                            tags[i] = '<hr>' + tags[i];
                        }
                        tag_pos = 8;
                    }

           } else if (tags[i].match(/language\:.*?/)) {
                tags[i] = tags[i].replace(/language\:(.*)/, '$1');
                if ( tag_pos === 0 ){
                    tags[i] = '<span>Language: </span>' + tags[i];
                    tag_pos = 1;
                }
          } else if (tags[i].match(/parody\:.*?/)) {
                tags[i] = tags[i].replace(/parody\:(.*)/, '$1');
                if ( tag_pos <= 1 ){
                    tags[i] = '<span>Parody: </span>' + tags[i];
                    if (tag_pos !== 0){
                        tags[i] = '<hr>' + tags[i];
                    }
                    tag_pos = 2;
                }
          } else if (tags[i].match(/character\:.*?/)) {
                tags[i] = tags[i].replace(/character\:(.*)/, '$1');
                if ( tag_pos <= 2 ){
                    tags[i] = '<span>Characters: </span>' + tags[i];
                    if (tag_pos !== 0){
                        tags[i] = '<hr>' + tags[i];
                    }
                    tag_pos = 3;
                }
          } else if (tags[i].match(/group\:.*?/)) {
                tags[i] = tags[i].replace(/group\:(.*)/, '$1');
                if ( tag_pos <= 3 ){
                    tags[i] = '<span>Group: </span>' + tags[i];
                    if (tag_pos !== 0){
                        tags[i] = '<hr>' + tags[i];
                    }
                    tag_pos = 4;
                }
          } else if (tags[i].match(/artist\:.*?/)) {
                tags[i] = tags[i].replace(/artist\:(.*)/, '$1');
                if ( tag_pos <= 4 ){
                    tags[i] = '<span>Artist: </span>' + tags[i];
                    if (tag_pos !== 0){
                        tags[i] = '<hr>' + tags[i];
                    }
                    tag_pos = 5;
                }
          } else if (tags[i].match(/^male\:.*?$/)) {
                tags[i] = tags[i].replace(/^male\:(.*)$/, '$1');
                if (tags[i] in AlertTags) {
                    tags[i] = '<span style="color:white;font-weight:bold;">[' + tags[i] + ']</span>';
                } else if (tags[i] in UnlikeTags) {
                    tags[i] = '<span style="color:red;font-weight:bold;">{' + tags[i] + '}</span>';
                }
                if ( tag_pos <= 5 ){
                    tags[i] = '<span>Male: </span>' + tags[i];
                    if (tag_pos !== 0){
                        tags[i] = '<hr>' + tags[i];
                    }
                    tag_pos = 6;
                }
            } else if (tags[i].match(/female\:.*?/)) {
                tags[i] = tags[i].replace(/female\:(.*)/, '$1');
                if (tags[i] in AlertTags) {
                    tags[i] = '<span style="color:white;font-weight:bold;">[' + tags[i] + ']</span>';
                } else if (tags[i] in UnlikeTags) {
                    tags[i] = '<span style="color:red;font-weight:bold;">{' + tags[i] + '}</span>';
                }
                if ( tag_pos <= 6 ){
                    tags[i] = '<span>Female: </span>' + tags[i];
                    if (tag_pos !== 0){
                        tags[i] = '<hr>' + tags[i];
                    }
                    tag_pos = 7;
                }
          }

        }
        var tag = tags.join('; ');
      } else {
         var tag = '';
      }
      if (gmetadata_all[id].title) {
        var title = gmetadata_all[id].title;
      } else {
        var title = gmetadata_all[id].title;
      }
      var MousePos = getMousePos(e);
      Box.style.display = 'block';
      Box.style.left = eval(MousePos.x + 5) + 'px';
      Box.style.top = eval(MousePos.y + 5) + 'px';
      Box.innerHTML = '<div>' + title + '</div><br><div style="color:white">[' + eval(parseInt(gmetadata_all[id].filesize / 1024 / 1024)) + 'M]' + gmetadata_all[id].filecount + ' Pages</div><br>'  + tag;
    } else {
      //Box.innerHTML = '';
      if (e.buttons !== 0) {
        setTimeout(function () {
          Box.style.display = 'none';
        }, 5000);
      } else {
        Box.style.display = 'none';
      }
    }
  };
  document.body.appendChild(Box);
}
function HideGalleries() {
  var amount = 0;
  for (var i = 0; i < Div.length; i++) {
    var tags = gmetadata_all[i].tags;
    //console.log(gmetadata_all[i].tags);
    for (var n = 0; n < tags.length; n++) {
      if (tags[n].match(/^.*\:.*?$/)) {
          //tags[n] = tags[n].replace(/.*\:(.*)/, '$1');
      }
      if (tags[n].replace(/.*\:(.*)/, '$1') in AlertTags) {
        Div[i].innerHTML = '<b>[' + AlertTags[tags[n].replace(/.*\:(.*)/, '$1')] + ']</b>' + Div[i].innerHTML;
        if (Div[i].style.color !== 'tomato') {
          Div[i].style.color = 'white';
        }
      }
      if (tags[n].replace(/.*\:(.*)/, '$1') in UnlikeTags) {
        Div_needHide.push(Div[i]);
        amount++;
        if (Div[i].parentNode.className === 'it5') {
          Div[i].innerHTML = '<b>[' + UnlikeTags[tags[n].replace(/.*\:(.*)/, '$1')] + ']</b>' + Div[i].innerHTML;
          Div[i].style.color = 'tomato';
          Div[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        } else {
          Div[i].innerHTML = '<b>[' + UnlikeTags[tags[n].replace(/.*\:(.*)/, '$1')] + ']</b>' + Div[i].innerHTML;
          Div[i].style.color = 'tomato';
          Div[i].parentNode.parentNode.style.display = 'none';
        }
      }
    }
  }
  document.querySelector('p.ip').innerHTML += '  Hiding ' + amount + ' Galleries.';
  var ShowToggle = document.createElement('button');
  ShowToggle.innerHTML = 'Show';
  ShowToggle.id = 'ShowToggle_Show';
  ShowToggle.className = 'stdbtn';
  ShowToggle.onclick = function () {
    if (this.id === 'ShowToggle_Show') {
      for (var i = 0; i < Div_needHide.length; i++) {
        if (Div_needHide[i].parentNode.className === 'it5') {
          Div_needHide[i].parentNode.parentNode.parentNode.parentNode.style.display = '';
        } else {
          Div_needHide[i].parentNode.parentNode.style.display = '';
        }
      }
      this.id = 'ShowToggle_Hide';
      this.innerHTML = 'hide';
    }else{
      for (var i = 0; i < Div_needHide.length; i++) {
        if (Div_needHide[i].parentNode.className === 'it5') {
          Div_needHide[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        } else {
          Div_needHide[i].parentNode.parentNode.style.display = 'none';
        }
      }
      this.id = 'ShowToggle_Show';
      this.innerHTML = 'show';
    }
  };
  document.querySelector('p.ip').appendChild(ShowToggle);
}
function getMousePos(event) {
  var e = event || window.event;
  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  var x = e.pageX || e.clientX + scrollX;
  var y = e.pageY || e.clientY + scrollY;
  return {
    'x': x,
    'y': y
  };
}
