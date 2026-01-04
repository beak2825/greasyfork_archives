// ==UserScript==
// @name         人物链接ICO显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       azuse
// @match        https://bangumi.tv/group/topic/354390
// @match        https://bgm.tv/group/topic/354390
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397923/%E4%BA%BA%E7%89%A9%E9%93%BE%E6%8E%A5ICO%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/397923/%E4%BA%BA%E7%89%A9%E9%93%BE%E6%8E%A5ICO%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

let api = 'https://www.tinygrail.com/api/';
let characterlist;
let i=0;

let aList = $('a').filter(function() {
    return this.href.match(/https:\/\/bgm.tv\/character\/[0-9].*/);
    })


let ids = []

for(let i in aList){
    if (i == "length")break;
    let id = aList[i].href.split('/character/')[1].toString();
    ids.push(id)
}

checkLink(ids)



function postData(url, data, callback) {
  var d = JSON.stringify(data);
  if (!url.startsWith('http'))
    url = api + url;
  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: d,
    xhrFields: { withCredentials: true },
    success: callback
  });
}

function getData(url, data, callback) {
    var d = JSON.stringify(data);
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      data: d,
      xhrFields: { withCredentials: true },
      success: callback
    });
  }

function caculateICO(ico) {
  var level = 0;
  var price = 10;
  var amount = 10000;
  var total = 0;
  var next = 100000;

  if (ico.Total < 100000 || ico.Users < 10) {
    return { Level: level, Next: next, Price: 0, Amount: 0 };
  }

  level = Math.floor(Math.sqrt(ico.Total / 100000));
  amount = 10000 + (level - 1) * 7500;
  price = ico.Total / amount;
  next = Math.pow(level + 1, 2) * 100000;

  return { Level: level, Next: next, Price: price, Amount: amount };
}
function formatNumber(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.ceil(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}
function renderCharacterTag(chara, item) {
  var id = chara.Id;
  var flu = '--';
  var tclass = 'even';
  if (chara.Fluctuation > 0) {
    tclass = 'raise';
    flu = `+${formatNumber(chara.Fluctuation * 100, 2)}%`;
  } else if (chara.Fluctuation < 0) {
    tclass = 'fall';
    flu = `${formatNumber(chara.Fluctuation * 100, 2)}%`;
  }

  var tag = `<div class="tag_e ${tclass}" title="₵${formatNumber(chara.MarketValue, 0)} / ${formatNumber(chara.Total, 0)}">₵${formatNumber(chara.Current, 2)} ${flu}</div>`
  return tag;
}
function checkup(){
    let ids = [];
    let list = {};
    if(document.location.href.match(/mono\/character/))
        characterlist = document.querySelectorAll('#columnA .section ul li');
    else if(document.location.href.match(/subject\/\d+\/characters/))
        characterlist = document.querySelectorAll('#columnInSubjectA .clearit h2');
    else if(document.location.href.match(/subject\/\d+/))
        characterlist = document.querySelectorAll('#browserItemList .user');
    else if(document.location.href.match(/character/))
        characterlist = document.querySelectorAll('#columnCrtBrowserB .browserCrtList h3');

    characterlist.forEach( (elem, index) => {
        let href = elem.querySelector('a.l').href;
        let id = href.split('/character/')[1].toString();
        ids.push(parseInt(id));
        list[id] = elem;
    });
    postData('chara/list', ids, function (d, s) {
    if (d.State === 0) {
        for (i = 0; i < d.Value.length; i++) {
            var item = d.Value[i];
            var pre = caculateICO(item);
            if (item.CharacterId) {
                var id = item.CharacterId;
                var percent = formatNumber(item.Total / pre.Next * 100, 0);
                var ICOtag = `<div class="tags tag_e lv${pre.Level}" title="${formatNumber(item.Total, 2)}/lv${pre.Level} ${percent}%">ICO:₵${formatNumber(item.Total, 0)}</div>`;
                $(list[id].querySelector('a.l')).append(ICOtag);
                //$(list[id].querySelector('a.l')).append( '₵'+d.Value[i].Total);
            }
            else{
                var id = item.Id;
                //list[id].querySelector('a.l').style.color = '#fa8792';
                //$(list[id].querySelector('a.l')).append( '₵'+d.Value[i].Current);
                //var depth = renderCharacterDepth(chara);
                var tag = renderCharacterTag(item, list[id]);
                //$(item).find('.row').append(depth);
                $(list[id].querySelector('a.l')).append(tag);
            }
        }
    }
  });
}

function checkLink(ids){

    postData('chara/list', ids, function (d, s) {
        if (d.State === 0) {
            id_ico_or_in_market = []
            for (j = 0; j < d.Value.length; j++) {
                var item = d.Value[j];
                var pre = caculateICO(item);
                if (item.CharacterId) {
                    // 已上市
                    var id = item.CharacterId;
                    var name = item.Name;
                    var icoInformation = "ICO中 "+item.End
                    var imgUrl = item.Icon

                    html = htmlAssemble(imgUrl, name, icoInformation)
                    htmlInsert(html, id)
                    id_ico_or_in_market.push(id)
                }
                else{
                    // 未上市
                    var id = item.Id;
                    var name = item.Name;
                    var icoInformation = "已上市";
                    var imgUrl = item.Icon

                    html = htmlAssemble(imgUrl, name, icoInformation)
                    htmlInsert(html, id)
                    id_ico_or_in_market.push(id)
                }
            }
            htmlInsertReset(id_ico_or_in_market)
        }
    })
}

function htmlAssemble(imgUrl, name, icoInformation){
    html =
    `<div style="height: 50px; width:200px; display: flex; flex-direction: row;">
        <div style="height: 50px;width:50px;display: inline-block">
            <img src="${imgUrl}" alt="" style="height: 100%;width:auto;border-radius: 5px;">
        </div>
        <div style="height: 50px;width:150px;display: inline-block;flex-direction: row">
            <label style="padding:10px;">${name}</label>
            <label style="padding:10px;">${icoInformation}</label>
        </div>
    </div>`
    return html
}

function htmlInsert(html, charaId){
    for(i in aList){
        if(i=="length")break;
        let id = aList[i].href.split('/character/')[1].toString();
        if (id==charaId){
            try {
                aList[i].outerHTML += html

            }
            catch(err){

            }
        }
    }
}

function htmlInsertReset(ids_already_have){
    for(i in aList){
        break;
        if(i=="length")break;
        let id = aList[i].href.split('/character/')[1].toString();
        if(ids_already_have.indexOf(id) == -1){
            callback = function(d,s){
                console.log($(".nameSingle", d))
            }
            getData("/character/"+id, "", callback)
        }
    }
}
