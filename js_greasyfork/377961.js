// ==UserScript==
// @name SDalert
// @namespace Violentmonkey Scripts
// @match *://hd/WorkOrder.do*
// @match *://sd.corp.mango.ru/WorkOrder.do*
// @match *://sd/WorkOrder.do* 
// @match *://hd/SearchN.do*
// @match *://sd.corp.mango.ru/SearchN.do*
// @match *://sd/SearchN.do*
// @grant none
// @description SDalert for ORKs
// @version 0.0.50
// @downloadURL https://update.greasyfork.org/scripts/377961/SDalert.user.js
// @updateURL https://update.greasyfork.org/scripts/377961/SDalert.meta.js
// ==/UserScript==


(($) => {
  $(document).ready(() => {
    console.log('SDAlert для ОРК загружен');
    if (document.getElementById('WorkOrder_Fields_UDF_LONG2_CUR') !== null) {
    console.log('SDAlert - поле найдено, запускаемся');
    var urlreq1 = getUrlVars()["woMode"];
    var urlreq2 = getUrlVars()["woID"];
    if (((urlreq1 == 'viewWO')&(urlreq2 != null))||(location.href.substr(10,10)=='SearchN.do')) {
      var div = document.createElement('div');
      div.id = "modal_rm";
      //div.setAttribute('onclick', 'this.hide()');
      div.setAttribute('style','display: block; position: fixed; content: ""; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); z-index: 1; opacity: 0.85; transition: opacity 0.2s, z-index 0s 0.2s; text-align: center; overflow: hidden; overflow-y: auto; white-space: nowrap;');
      //div.innerHTML = '<strong id="modal_rm_text"></strong>';
      document.getElementsByTagName('body')[0].appendChild(div);
      
      var div_rt = document.createElement('div');
      div_rt.id = "modal_rm_text";
      //div.setAttribute('onclick', 'this.hide()');
      div_rt.setAttribute('style','transition: 1.5s; font-size: 24px; padding-top: 15px; display: block; background-color: #fff; height: 100px; width: 400px; position: fixed; bottom: 40%; right: 40%; z-index: 30; text-align: center;');
      //div_rt.innerHTML = '<strong id="modal_rm_text"></strong>';
      document.getElementsByTagName('body')[0].appendChild(div_rt);
      
      var dialog_t = document.getElementById('modal_rm_text');
      
            
      var dialog = document.getElementById('modal_rm');
      
      var RMnum = document.getElementById("WorkOrder_Fields_UDF_LONG2_CUR").getAttribute("val");
      console.log(RMnum);
      if (RMnum.length == 6) { 
        document.getElementById('modal_rm_text').innerHTML = 'Заявка передана в <span style="color:red">RedMine!</span><br><a style="text-decoration: underline;" href="http://redmine.mango.local/issues/'+RMnum+'" target="_blank">Открыть '+RMnum+'</a>';
        document.getElementById('STATUSID_CUR').innerHTML = 'Текущий статус этой заявки: '+document.getElementById("STATUSID_CUR").innerHTML+'<br>Передана в RM<br><br>Номер указан в "Связанные сопровождения" (ниже)<br>';
        document.getElementById('status_PH').innerHTML = 'Текущий статус этой заявки: '+document.getElementById("status_PH").innerHTML+'<br>Передана в RM<br><br><a style="text-decoration: underline;" href="http://redmine.mango.local/issues/'+RMnum+'" target="_blank">Перейти в RM '+RMnum+'</a><br>';
      dialog.show();dialog_t.show();
      } else
      if (RMnum.length == 7) { 
        var sdurl = window.location.hostname;
        document.getElementById('modal_rm_text').innerHTML = 'Заявка передана в <span style="color:red">ГОМиЭ!</span><br><a style="text-decoration: underline;" href="http://'+sdurl+'/WorkOrder.do?woMode=viewWO&woID='+RMnum+'" target="_blank">Открыть '+RMnum+'</a>';
        document.getElementById('STATUSID_CUR').innerHTML = 'Текущий статус этой заявки: '+document.getElementById("STATUSID_CUR").innerHTML+'<br>Передана в ГОМиЭ<br><br>Номер указан в "Связанные сопровождения" (ниже)<br>';
        document.getElementById('status_PH').innerHTML = 'Текущий статус этой заявки: '+document.getElementById("status_PH").innerHTML+'<br>Передана в ГОМиЭ<br><br><a style="text-decoration: underline;" href="http://'+sdurl+'/WorkOrder.do?woMode=viewWO&woID='+RMnum+'" target="_blank">Перейти в ГОМиЭ '+RMnum+'</a><br>';
      dialog.show();dialog_t.show();
      } else {dialog.hide();dialog_t.hide();}
      
      //крестик "закрыть"
      var div_cb = document.createElement('div');
      div_cb.id = "modal_close_button";
      div_cb.setAttribute('onclick', 'document.getElementById("modal_rm").hide(); document.getElementById("modal_rm_text").style.border = "1px  solid black"; document.getElementById("modal_rm_text").style.bottom = "1%"; document.getElementById("modal_rm_text").style.right = "1%";document.getElementById("modal_close_button").setAttribute("onclick", "document.getElementById(`modal_rm_text`).hide()");');
      div_cb.setAttribute('style','padding: 3px; right: 0; top: 0; width: 24px; height: 24px; position: absolute; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAQAAABKIxwrAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfjAhQOOgDWiKNXAAABlUlEQVQ4y4XUvU+TURQG8F9bJjbSmhiJ0kQdXECMm4CixMSJb938F/w/DPK5i7obraNxIaaLFVxwYjBGygRJm0CiQ9/jgNL3bUHPHU7uc55z7nPPyb05acsbNWnMBUUH9myo+Cicavdtia61aaKb2mNFCA3PzRkyYMicdQ0hLCpkye+EliXFjjJFyxKhkk5YEQ5Nna7RtENhqa05tM4kw4xEuHfcja107hm2KnyW47bQyGju6fBQ0hRG86bw2sFJ4IFtZfSpenyC7nuDSWrCbKrytrBj0Bfhu96TyLzwiT3heurYfjtCIuy6msKHhTq/hIuZaw1KhHAng14SfnZX71P7M/5vyin8hrCbV8eVlPYPbqobt6PsfUr7ZdR5JqynqjzywzWc99WTFP5KeMpYV997Ozyc0xRGyNsUlv8z1TWhJgcTQsv0P8izEmH873ZRODJzJvlIWGgDBRUhsarUQS1Zkwhvsw+kYFEITS/MGzZg2EMvNYWwkCUf2y3VU95qzd02JZdJyBkxaUy/kn11Gyqq6Z/gNycgoUpO0KWUAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAyLTIwVDEzOjU4OjAwKzAxOjAwjmONUgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMi0yMFQxMzo1ODowMCswMTowMP8+Ne4AAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC); background-position: center center; background-repeat: no-repeat;');
      document.getElementById('modal_rm_text').appendChild(div_cb);
    }}
  });
})(jQuery);

  

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


