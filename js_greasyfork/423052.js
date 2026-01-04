// ==UserScript==
// @name         QiMai.cn Exporter
// @description  Export csv from qimai.cn
// @author       kawais
// @namespace    kawais
// @include      https://www.qimai.cn/rank/float
// @version      1.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @grant        GM.xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/423052/QiMaicn%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/423052/QiMaicn%20Exporter.meta.js
// ==/UserScript==
 
this.$ = this.jQuery = jQuery.noConflict(true);
console.log(GM_info);
 
(function () {
  var css = [
    '#exporter {',
    '    position: fixed;',
    '    padding: 7px;',
    '    background-color: #F8EEB1;',
    '    border: 2px solid #333;',
    '    border-radius: 6px;',
    '    z-index: 9999;',
    '    font-size: 18px;',
    '    right: 30px;',
    '    bottom: 20px;',
    '    color: #000;',
    '    width: 300px;',
    '    text-align: center;',
    '    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 0.3);',
    '}'
  ].join('\n');
  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName('head');
    if (heads.length > 0) {
      heads[0].appendChild(node);
    } else {
      // no head yet, stick it whereever
      document.documentElement.appendChild(node);
    }
  }
}) ();
 
var html = '<div id="exporter">' +
    '<span>Export</span>'+
    '<span id="process" style="margin-left:10px"></span>'+
    '</div>';
 
$('body').prepend(html);

setInterval(()=>{
    if(!document.querySelector('#exporter')) return
    if(location.href.indexOf('https://www.qimai.cn/rank/float')===0){
        document.querySelector('#exporter').style.display='block'
    }else{
        document.querySelector('#exporter').style.display='none'
    }
},1000) 
 
 
$('#exporter').click(function(){
  list=[]
  $('#process').html('')
  doExport();
})


 
 
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function encode(t,n){
    t = t.split('')
    let Et=0,tf=10
    for (var a = t.length, e = n.length, s = 'charCodeAt', i = Et; i < a; i++)
        t[i] = String.fromCharCode(t[i][s](Et) ^ n[(i + tf) % e][s](Et));    
    
    return encodeURIComponent(btoa(t.join('')))
}
var list=[]

function download(data,type){
    if(!data || data.length<=0) return
    let arr=[]
    switch(type){
        case 'float':
            arr=data.reduce((r,v)=>{
                r.push(`${v.appInfo.appId},${v.appInfo.appName.replace(/,/g,' ')},${v.rankInfo.change},${v.ranking},${v.genre},${v.ranking_c},${v.genre_b}`)
                return r
            },[])
            break
    }
    saveAs(new Blob([arr.join("\r\n")], {type: "text/plain;charset=utf-8"}),'export.csv')
    $('#process').html('')
}

function getKey(){ 
            var n, o, r = void 0 === a ? 2166136261 : a;
            for (n = 0,
            o = e.length; n < o; n++)
                r ^= e.charCodeAt(n),
                r += (r << 1) + (r << 4) + (r << 7) + (r << 8) + (r << 24);
            return t ? ("0000000" + (r >>> 0).toString(16)).substr(-16) : r >>> 0 
}

function doExport(page) {
    let arr=location.href.split('/')
    var params={}
    params.page=page||1
    for(var i=5;i<arr.length;i++){
        params[arr[i]]=arr[i+1]
        i++
    }
    
    let vals=Object.values(params).sort().join('')
    let t=new Date - (0) - 1515125653845
    let str=`${btoa(vals)}@#/rank/${arr[4]}@#${t}@#1`
    let key='0000000c735d856'
    //let key=getKey("qimai|Technologyx",1)
    params.analysis=encode(str,key)
    let url=location.href.split('/').slice(0,5).join('/').replace('//www.','//api.')
    $('#process').html(`Page: ${params.page} loading...`)
    $.ajax({
        dataType: 'json',
        async: false,
        url: url,
        xhrFields: {
            withCredentials: true
        },
        data:params
    }).done(function (data) {
        if(data.code===10000){
            list.push(...data.rankInfo)
            if(data.rankInfo.length>=data.pageSize){
                setTimeout(()=>{doExport(params.page+1)},2000)
            }else{
                download(list,arr[4])
            }
        }else{
            download(list,arr[4])
        }
    });    

    return
}