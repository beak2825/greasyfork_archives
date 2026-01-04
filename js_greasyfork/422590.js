// ==UserScript==
// @name        OEcreator
// @namespace   OEcreatorScript
// @match       http://redmine.mango.local/versions/*
// @match       http://redmine.mango.local/projects/*
// @match       http://redmine.mango.local/issues/*
// @grant       none
// @version     1.92
// @author      -
// @description 04.02.2021, 11:56:21
// @downloadURL https://update.greasyfork.org/scripts/422590/OEcreator.user.js
// @updateURL https://update.greasyfork.org/scripts/422590/OEcreator.meta.js
// ==/UserScript==

//Страница версий
if (location.href.split('/')[3] == 'versions') {
  var version = location.href.split('/')[4];
  var version_name = document.getElementsByTagName('h2')[0].innerHTML;
 
  var n = document.getElementById("project_quick_jump_box").options.selectedIndex;
  var txt = document.getElementById("project_quick_jump_box").options[n].text;
  var project_link;
  var project_name;
  switch (txt) {
    case '    » Интеграция':
      project_link = 'http://redmine.mango.local/projects/zniintegration/issues/new';
      project_name = 'ITG';
      break;
    case '    » Личный кабинет 7':
      project_link = 'http://redmine.mango.local/projects/lk7/issues/new';
      project_name = 'ЛК7';
      break;
    case '  » ЦОВ':
      project_link = 'http://redmine.mango.local/projects/zni-cc/issues/new';
      project_name = 'CCC';
      break;
    case '  » Виртуальная АТС':
      project_link = 'http://redmine.mango.local/projects/zni-vats/issues/new';
      project_name = 'ВАТС';
      break;
    case 'Коммуникации на сайте':
      project_link = 'http://redmine.mango.local/projects/zni-minsk-komnas/issues/new';
      project_name = 'ДКТ';
      break;
    case 'Коммуникатор':
      project_link = 'http://redmine.mango.local/projects/kommunikator/issues/new';
      project_name = 'МТ';
      break;
    case 'Мобильный ЛК':
      project_link = 'http://redmine.mango.local/projects/znimoblk/issues/new';
      project_name = 'МЛК';
      break;
    case 'MTalker Mobile':
      project_link = 'http://redmine.mango.local/projects/kommunikator/issues/new';
      project_name = 'MT';
      break;
    case 'MTalker Server':
      project_link = 'http://redmine.mango.local/projects/kommunikator/issues/new';
      project_name = 'MT';
      break;
    default:
      project_link = '';
      project_name = '';
  }
  
  //забрать список заявок из ОП
  var version_issues = document.getElementsByClassName('list')[0].children[1].children;
  var issues_str = '';
  for (let issue of version_issues) {
    issues_str += issue.children[1].innerText+'\r\n';
  }
  //создание кнопок
  let link = document.createElement('a');
  //link.href = project_link;
  link.innerHTML = 'Создать ОЭ';
  document.getElementsByTagName('h2')[0].innerHTML = version_name + ' ';
  document.getElementsByTagName('h2')[0].append(link);
  
  link.onclick = ()=>{
    //window.open(project_link, '_blank');
    oe_name = prompt('Название ОЭ', 'ОЭ '+project_name+' '+version_name);
    if (oe_name != null) postinfo(oe_name,issues_str);
  }

}

//трудозатраты
function add_time_entries(en_type, en_time) {
  var issue = document.getElementsByClassName('work-time')[0].href.split('/index/')[1];
  fetch("http://redmine.mango.local/time_entries", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,bg;q=0.6,uk;q=0.5,be;q=0.4,kk;q=0.3,ku;q=0.2,cs;q=0.1,eo;q=0.1",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "x-csrf-token": document.querySelector('meta[name="csrf-token"]').content,
      "upgrade-insecure-requests": "1"
    },
    "referrer": "http://redmine.mango.local/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "utf8=%E2%9C%93&issue_id="+issue+"&time_entry%5Bissue_id%5D="+issue+"&time_entry%5Bhours%5D="+en_time+"&time_entry%5Bcomments%5D=&time_entry%5Bactivity_id%5D="+en_type+"&commit=%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D1%82%D1%8C",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });
  //setTimeout(()=>location.reload(), 2000)
}

//шаблоны
function savePattern() {
  console.log('save');
  if (window.getSelection()) {
	  var select = window.getSelection();
    if (encodeURIComponent(select.toString()) === '') return;
    let url = 'http://192.168.10.92/oe/oecreator/patterns.php?add';
    var xhr = new XMLHttpRequest();
    var body = 'author=' + encodeURIComponent(document.getElementsByClassName('user active')[0].innerText) +
      '&pattern=' + encodeURIComponent(select.toString());
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = ()=>{
      //if (this.readyState != 4) return;
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        //window.open(project_link+'?id='+xhr.responseText, '_blank');
      }
    };
    xhr.send(body);
    }
}
function deletePattern(id) {
  let url = 'http://192.168.10.92/oe/oecreator/patterns.php?delete';
  var xhr = new XMLHttpRequest();
  var body = 'id=' + encodeURIComponent(id);
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  eval("patliid"+id+".style.display = 'none'");
  xhr.send(body);
}
function patterns() {
  let url = 'http://192.168.10.92/oe/oecreator/patterns.php?get='+document.getElementsByClassName('user active')[0].innerText;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = ()=>{
    //if (this.readyState != 4) return;
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
       var temp = document.createElement('div');
       temp.id = 'patterns';
       temp.style.padding = '5px 0px 5px 180px';
       var pat_text = '<details><summary>Шаблоны</summary><ul>';
       //let answ = eval(xhr.responseText);
       let answ = JSON.parse(xhr.response);
       for (ans in answ) {
         pat_text += '<li id="patliid'+ans+'"><a class="patli">' + answ[ans] + '</a> <a class="patlidel" title="'+ans+'"><img src="http://redmine.mango.local/images/delete.png"/></a></li>';
       };
       pat_text += 'Для сохранения текста в качестве шаблона выделите его в текстовом поле выше, затем нажмите [<a id="patsave">Сохранить выделенное как шаблон</a>]</ul></details>';
       temp.innerHTML = pat_text;
       document.getElementById('issue_description').parentElement.parentElement.parentElement.after(temp);
       var hrefs = document.getElementsByClassName("patli");
       for (var i = 0; i < hrefs.length; i++) {
         hrefs.item(i).addEventListener('click', function(e){
          e.preventDefault();
          issue_description.innerHTML += "\n"+e.target.innerHTML;
         });
       }
       var hrefsd = document.getElementsByClassName("patlidel");
       for (var i = 0; i < hrefsd.length; i++) {
         hrefsd.item(i).addEventListener('click', function(e){
          e.preventDefault();
          let deleteThis = confirm("Удалить паттерн?");
          if (deleteThis) deletePattern(e.target.parentElement.title);
         });
       }
       document.getElementById('patsave').addEventListener('mousedown', function(e){
           savePattern();
       });
       document.querySelectorAll('a').forEach((e)=>{e.style.cursor='pointer'});
    }
  };
  xhr.send();
}

//пушит в бд данные для создания оэ
function postinfo(project_name,issues_str) {
  let url = 'http://192.168.10.92/oe/oecreator/get.php?create';
  var xhr = new XMLHttpRequest();
  var body = 'project=' + encodeURIComponent(project_name) +
      '&issues=' + encodeURIComponent(issues_str);
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = ()=>{
    //if (this.readyState != 4) return;
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      window.open(project_link+'?id='+xhr.responseText, '_blank');
    }
  };
  xhr.send(body);
}

//Показывает письмо о старте ОЭ
function mail_start(name,number) {
  var newWin = window.open();
  newWin.document.open();
  newWin.document.write('<div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Коллеги, добрый день.</span></font></span></font></div><div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Запущен&nbsp;процесс&nbsp;опытной эксплуатации:</span></font></span></font></div><div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,Helvetica,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 16px;"><br></span></font></span></font></div><font face="Calibri,Helvetica,sans-serif,serif,EmojiFont" style="font-size: 16px; background-color: rgb(255, 255, 255);"><table width="643" cellspacing="0" cellpadding="2" style="table-layout: fixed; width: 643px;"><colgroup><col width="145" style="width: 145px;"><col width="93" style="width: 93px;"><col width="111" style="width: 111px;"><col width="136" style="width: 136px;"><col width="135" style="width: 135px;"></colgroup><tbody><tr><td width="151" style="width: 151px; padding: 1.41pt 5.38pt; border: 1pt solid black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Продукт</span></font></div></td><td width="96" style="width: 96px; padding: 1.41pt 5.38pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Номер процесса ОЭ(ссылка)</span></font></div></td><td width="114" style="width: 114px; padding: 1.41pt 5.38pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Отчет по связанным ЗНИ и Проблемам</span></font></div></td><td width="141" style="width: 141px; padding: 1.41pt 1.41pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Сопровождения «Проблема»</span></font></div></td><td width="164" style="width: 164.2px; padding: 1.41pt 1.41pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Сопровождения «ЗНИ»</span></font></div></td></tr><tr><td style="padding: 0px 5.38pt 1.41pt; border-style: none solid solid; border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: black; border-bottom-color: black; border-left-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">'+name+'</span></font></div><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;">&nbsp;</div></td><td style="padding: 0px 5.38pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><br></div><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><span id="LPlnk243614"></span><a href="http://redmine.mango.local/issues/'+number+'" target="_blank" rel="noopener noreferrer"><font face="Calibri,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 11pt;">'+number+'</span></font></a></div><br></td><td style="padding: 0px 5.38pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><a href="http://redmine.mango.local/projects/zni/issues?utf8=%E2%9C%93&amp;set_filter=1&amp;f%5B%5D=status_id&amp;op%5Bstatus_id%5D=*&amp;f%5B%5D=relates&amp;op%5Brelates%5D=%3D&amp;v%5Brelates%5D%5B%5D='+number+'&amp;f%5B%5D=cf_36&amp;op%5Bcf_36%5D=%3D&amp;v%5Bcf_36%5D%5B%5D=%D0%97%D0%B0%D1%8F%D0%B2%D0%BA%D0%B0+%D0%BD%D0%B0+%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5&amp;v%5Bcf_36%5D%5B%5D=%D0%9F%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D0%B0&amp;f%5B%5D=&amp;c%5B%5D=status&amp;c%5B%5D=priority&amp;c%5B%5D=subject&amp;c%5B%5D=author&amp;c%5B%5D=assigned_to&amp;c%5B%5D=updated_on&amp;c%5B%5D=start_date&amp;c%5B%5D=due_date&amp;c%5B%5D=cf_36&amp;group_by=cf_36&amp;t%5B%5D=" target="_blank" rel="noopener noreferrer"><font face="Calibri,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 11pt;">Отчет по ОЭ</span></font></a></div></td><td style="padding: 0px 1.41pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 14.67px;">-</span></font></div></td><td style="padding: 0px 1.41pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 14.67px;">-</span></font></div></td></tr></tbody></table></font>');
}
//Показывает письмо о завершении ОЭ
async function mail_finish(name,number) {
  let response = await fetch("http://redmine.mango.local/projects/zni/issues.csv?c%5B%5D=cf_36&f%5B%5D=relates&f%5B%5D=cf_36&f%5B%5D=&group_by=&op%5Bcf_36%5D=%3D&op%5Brelates%5D=%3D&set_filter=1&t%5B%5D=&utf8=%E2%9C%93&v%5Bcf_36%5D%5B%5D=%D0%97%D0%B0%D1%8F%D0%B2%D0%BA%D0%B0+%D0%BD%D0%B0+%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5&v%5Bcf_36%5D%5B%5D=%D0%9F%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D0%B0&v%5Brelates%5D%5B%5D="+number, {
    "headers": {
      "accept": "*/*",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,bg;q=0.6,uk;q=0.5,be;q=0.4,kk;q=0.3,ku;q=0.2,cs;q=0.1,eo;q=0.1",
      "if-none-match": "W/\"89c56a7b06b6404ff156d14fbd3d64b4\""
    },
    "referrer": "http://redmine.mango.local/issues/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  if (response.ok) {
    var answ = await response.text();
    var cnt_problem = 0;
    var cnt_zni = 0;
    answ.split("\n").forEach(element => {
      if ((element!='#|Суть вопроса')&&(element!='')) {
        if (element.split('|')[1] == 'Проблема') cnt_problem++;
        if (element.split('|')[1] == 'Заявка на изменение') cnt_zni++;
    }});
    var newWin = window.open();
    newWin.document.open();
    newWin.document.write('<div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Коллеги, добрый день.</span></font></span></font></div><div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Завершен&nbsp;процесс&nbsp;опытной эксплуатации:</span></font></span></font></div><div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,Helvetica,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 16px;"><br></span></font></span></font></div><font face="Calibri,Helvetica,sans-serif,serif,EmojiFont" style="font-size: 16px; background-color: rgb(255, 255, 255);"><table width="643" cellspacing="0" cellpadding="2" style="table-layout: fixed; width: 643px;"><colgroup><col width="145" style="width: 145px;"><col width="93" style="width: 93px;"><col width="111" style="width: 111px;"><col width="136" style="width: 136px;"><col width="135" style="width: 135px;"></colgroup><tbody><tr><td width="151" style="width: 151px; padding: 1.41pt 5.38pt; border: 1pt solid black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Продукт</span></font></div></td><td width="96" style="width: 96px; padding: 1.41pt 5.38pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Номер процесса ОЭ(ссылка)</span></font></div></td><td width="114" style="width: 114px; padding: 1.41pt 5.38pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Отчет по связанным ЗНИ и Проблемам</span></font></div></td><td width="141" style="width: 141px; padding: 1.41pt 1.41pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Сопровождения «Проблема»</span></font></div></td><td width="164" style="width: 164.2px; padding: 1.41pt 1.41pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Сопровождения «ЗНИ»</span></font></div></td></tr><tr><td style="padding: 0px 5.38pt 1.41pt; border-style: none solid solid; border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: black; border-bottom-color: black; border-left-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">'+name+'</span></font></div><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;">&nbsp;</div></td><td style="padding: 0px 5.38pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><br></div><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><span id="LPlnk243614"></span><a href="http://redmine.mango.local/issues/'+number+'" target="_blank" rel="noopener noreferrer"><font face="Calibri,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 11pt;">'+number+'</span></font></a></div><br></td><td style="padding: 0px 5.38pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><a href="http://redmine.mango.local/projects/zni/issues?utf8=%E2%9C%93&amp;set_filter=1&amp;f%5B%5D=status_id&amp;op%5Bstatus_id%5D=*&amp;f%5B%5D=relates&amp;op%5Brelates%5D=%3D&amp;v%5Brelates%5D%5B%5D='+number+'&amp;f%5B%5D=cf_36&amp;op%5Bcf_36%5D=%3D&amp;v%5Bcf_36%5D%5B%5D=%D0%97%D0%B0%D1%8F%D0%B2%D0%BA%D0%B0+%D0%BD%D0%B0+%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5&amp;v%5Bcf_36%5D%5B%5D=%D0%9F%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D0%B0&amp;f%5B%5D=&amp;c%5B%5D=status&amp;c%5B%5D=priority&amp;c%5B%5D=subject&amp;c%5B%5D=author&amp;c%5B%5D=assigned_to&amp;c%5B%5D=updated_on&amp;c%5B%5D=start_date&amp;c%5B%5D=due_date&amp;c%5B%5D=cf_36&amp;group_by=cf_36&amp;t%5B%5D=" target="_blank" rel="noopener noreferrer"><font face="Calibri,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 11pt;">Отчет по ОЭ</span></font></a></div></td><td style="padding: 0px 1.41pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 14.67px;">'+cnt_problem+'</span></font></div></td><td style="padding: 0px 1.41pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 14.67px;">'+cnt_zni+'</span></font></div></td></tr></tbody></table></font>');
  }
}

async function mail_finish_several() {
  var numbers = [];
  var response = [];
  var cnt_problem = [];
  var cnt_zni = [];
  var newWin = window.open();
  newWin.document.write('<div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Коллеги, добрый день.</span></font></span></font></div>');
  newWin.document.write('<div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Завершен&nbsp;процесс&nbsp;опытной эксплуатации:</span></font></span></font></div>');
  newWin.document.write('<div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,Helvetica,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 16px;"><br></span></font></span></font></div>');
  newWin.document.write('<font face="Calibri,Helvetica,sans-serif,serif,EmojiFont" style="font-size: 16px; background-color: rgb(255, 255, 255);"><table width="643" cellspacing="0" cellpadding="2" style="table-layout: fixed; width: 643px;"><colgroup><col width="145" style="width: 145px;"><col width="93" style="width: 93px;"><col width="111" style="width: 111px;"><col width="136" style="width: 136px;"><col width="135" style="width: 135px;"></colgroup><tbody>');
  newWin.document.write('<tr><td width="151" style="width: 151px; padding: 1.41pt 5.38pt; border: 1pt solid black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Продукт</span></font></div></td><td width="96" style="width: 96px; padding: 1.41pt 5.38pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Номер процесса ОЭ(ссылка)</span></font></div></td><td width="114" style="width: 114px; padding: 1.41pt 5.38pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Отчет по связанным ЗНИ и Проблемам</span></font></div></td><td width="141" style="width: 141px; padding: 1.41pt 1.41pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Сопровождения «Проблема»</span></font></div></td><td width="164" style="width: 164.2px; padding: 1.41pt 1.41pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Сопровождения «ЗНИ»</span></font></div></td></tr>');

  var checked = document.querySelectorAll("input[class=issues]:checked");
  checked.forEach((chb)=>{numbers[chb.value] = chb.name})
  numbers.forEach( async (name,number) => {
    response[number] = await fetch("http://redmine.mango.local/projects/zni/issues.csv?c%5B%5D=cf_36&f%5B%5D=relates&f%5B%5D=cf_36&f%5B%5D=&group_by=&op%5Bcf_36%5D=%3D&op%5Brelates%5D=%3D&set_filter=1&t%5B%5D=&utf8=%E2%9C%93&v%5Bcf_36%5D%5B%5D=%D0%97%D0%B0%D1%8F%D0%B2%D0%BA%D0%B0+%D0%BD%D0%B0+%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5&v%5Bcf_36%5D%5B%5D=%D0%9F%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D0%B0&v%5Brelates%5D%5B%5D="+number, {
      "headers": {
        "accept": "*/*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,bg;q=0.6,uk;q=0.5,be;q=0.4,kk;q=0.3,ku;q=0.2,cs;q=0.1,eo;q=0.1",
        "if-none-match": "W/\"89c56a7b06b6404ff156d14fbd3d64b4\""
      },
      "referrer": "http://redmine.mango.local/issues/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
    if (response[number].ok) {
      var answ = await response[number].text();
      cnt_problem[number] = 0;
      cnt_zni[number] = 0;
      answ.split("\n").forEach(element => {
        if ((element!='#|Суть вопроса')&&(element!='')) {
          if (element.split('|')[1] == 'Проблема') cnt_problem[number]++;
          if (element.split('|')[1] == 'Заявка на изменение') cnt_zni[number]++;
      }});
      newWin.document.write('<tr><td style="padding: 0px 5.38pt 1.41pt; border-style: none solid solid; border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: black; border-bottom-color: black; border-left-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">'+name+'</span></font></div><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;">&nbsp;</div></td><td style="padding: 0px 5.38pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><br></div><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><span id="LPlnk243614"></span><a href="http://redmine.mango.local/issues/'+number+'" target="_blank" rel="noopener noreferrer"><font face="Calibri,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 11pt;">'+number+'</span></font></a></div><br></td><td style="padding: 0px 5.38pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><a href="http://redmine.mango.local/projects/zni/issues?utf8=%E2%9C%93&amp;set_filter=1&amp;f%5B%5D=status_id&amp;op%5Bstatus_id%5D=*&amp;f%5B%5D=relates&amp;op%5Brelates%5D=%3D&amp;v%5Brelates%5D%5B%5D='+number+'&amp;f%5B%5D=cf_36&amp;op%5Bcf_36%5D=%3D&amp;v%5Bcf_36%5D%5B%5D=%D0%97%D0%B0%D1%8F%D0%B2%D0%BA%D0%B0+%D0%BD%D0%B0+%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5&amp;v%5Bcf_36%5D%5B%5D=%D0%9F%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D0%B0&amp;f%5B%5D=&amp;c%5B%5D=status&amp;c%5B%5D=priority&amp;c%5B%5D=subject&amp;c%5B%5D=author&amp;c%5B%5D=assigned_to&amp;c%5B%5D=updated_on&amp;c%5B%5D=start_date&amp;c%5B%5D=due_date&amp;c%5B%5D=cf_36&amp;group_by=cf_36&amp;t%5B%5D=" target="_blank" rel="noopener noreferrer"><font face="Calibri,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 11pt;">Отчет по ОЭ</span></font></a></div></td><td style="padding: 0px 1.41pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 14.67px;">'+cnt_problem[number]+'</span></font></div></td><td style="padding: 0px 1.41pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 14.67px;">'+cnt_zni[number]+'</span></font></div></td></tr>');
    }
  });
  //newWin.document.write('</tbody></table></font>');
}

function mail_start_several() {
  var newWin = window.open();
  var numbers = [];
  newWin.document.open();
  newWin.document.write('<div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Коллеги, добрый день.</span></font></span></font></div>');
  newWin.document.write('<div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Запущен&nbsp;процесс&nbsp;опытной эксплуатации:</span></font></span></font></div>');
  newWin.document.write('<div style="font-family: Calibri, Helvetica, sans-serif, EmojiFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, NotoColorEmoji, &quot;Segoe UI Symbol&quot;, &quot;Android Emoji&quot;, EmojiSymbols; font-size: 16px; background-color: rgb(255, 255, 255); margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,Helvetica,sans-serif,EmojiFont,Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols" size="2"><span style="font-size: 16px;"><font face="Calibri,Helvetica,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 16px;"><br></span></font></span></font></div>');
  newWin.document.write('<font face="Calibri,Helvetica,sans-serif,serif,EmojiFont" style="font-size: 16px; background-color: rgb(255, 255, 255);"><table width="643" cellspacing="0" cellpadding="2" style="table-layout: fixed; width: 643px;"><colgroup><col width="145" style="width: 145px;"><col width="93" style="width: 93px;"><col width="111" style="width: 111px;"><col width="136" style="width: 136px;"><col width="135" style="width: 135px;"></colgroup><tbody>');
  newWin.document.write('<tr><td width="151" style="width: 151px; padding: 1.41pt 5.38pt; border: 1pt solid black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Продукт</span></font></div></td><td width="96" style="width: 96px; padding: 1.41pt 5.38pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Номер процесса ОЭ(ссылка)</span></font></div></td><td width="114" style="width: 114px; padding: 1.41pt 5.38pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Отчет по связанным ЗНИ и Проблемам</span></font></div></td><td width="141" style="width: 141px; padding: 1.41pt 1.41pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Сопровождения «Проблема»</span></font></div></td><td width="164" style="width: 164.2px; padding: 1.41pt 1.41pt 1.41pt 0px; border-style: solid solid solid none; border-top-width: 1pt; border-right-width: 1pt; border-bottom-width: 1pt; border-top-color: black; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">Сопровождения «ЗНИ»</span></font></div></td></tr>');
  var checked = document.querySelectorAll("input[class=issues]:checked");
  checked.forEach((chb)=>{numbers[chb.value] = chb.name})
  numbers.forEach((name,number) => {
    newWin.document.write('<tr><td style="padding: 0px 5.38pt 1.41pt; border-style: none solid solid; border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: black; border-bottom-color: black; border-left-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 11pt;">'+name+'</span></font></div><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;">&nbsp;</div></td><td style="padding: 0px 5.38pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><br></div><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><span id="LPlnk243614"></span><a href="http://redmine.mango.local/issues/'+number+'" target="_blank" rel="noopener noreferrer"><font face="Calibri,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 11pt;">'+number+'</span></font></a></div><br></td><td style="padding: 0px 5.38pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><a href="http://redmine.mango.local/projects/zni/issues?utf8=%E2%9C%93&amp;set_filter=1&amp;f%5B%5D=status_id&amp;op%5Bstatus_id%5D=*&amp;f%5B%5D=relates&amp;op%5Brelates%5D=%3D&amp;v%5Brelates%5D%5B%5D='+number+'&amp;f%5B%5D=cf_36&amp;op%5Bcf_36%5D=%3D&amp;v%5Bcf_36%5D%5B%5D=%D0%97%D0%B0%D1%8F%D0%B2%D0%BA%D0%B0+%D0%BD%D0%B0+%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5&amp;v%5Bcf_36%5D%5B%5D=%D0%9F%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D0%B0&amp;f%5B%5D=&amp;c%5B%5D=status&amp;c%5B%5D=priority&amp;c%5B%5D=subject&amp;c%5B%5D=author&amp;c%5B%5D=assigned_to&amp;c%5B%5D=updated_on&amp;c%5B%5D=start_date&amp;c%5B%5D=due_date&amp;c%5B%5D=cf_36&amp;group_by=cf_36&amp;t%5B%5D=" target="_blank" rel="noopener noreferrer"><font face="Calibri,sans-serif,serif,EmojiFont" size="2"><span style="font-size: 11pt;">Отчет по ОЭ</span></font></a></div></td><td style="padding: 0px 1.41pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 14.67px;">-</span></font></div></td><td style="padding: 0px 1.41pt 1.41pt 0px; border-style: none solid solid none; border-right-width: 1pt; border-bottom-width: 1pt; border-right-color: black; border-bottom-color: black;"><div align="center" style="text-align: center; margin-top: 0px; margin-bottom: 0px;"><font face="Calibri,sans-serif,serif,EmojiFont" size="2" color="#1F497D"><span style="font-size: 14.67px;">-</span></font></div></td></tr>');
  });
  
  newWin.document.write('</tbody></table></font>');
}

//mail_start_several('dd','ff');


//загружает из бд данные для создания ОЭ
function loadinfo(id) {
  let url = 'http://192.168.10.92/oe/oecreator/get.php?get='+id;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = ()=>{
    //if (this.readyState != 4) return;
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      let answ = eval(xhr.responseText);
      issue_subject.value = answ[1];
      issue_description.innerHTML = answ[2];
      issue_tracker_id.value = "24";
      updateIssueFrom('/projects/zniintegration/issues/new.js', issue_tracker_id);
      issue_assigned_to_id.value="906";
      //issue_due_date.value = answ[3];
      watchers_inputs.innerHTML = '<label id=\"issue_watcher_user_ids_906\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"906\" checked=\"checked\" /> Группа опытной эксплуатации <\/label>';
    }
  };
  xhr.send();
}

async function setRelations(issue) {
  let link = location.href;
  let response = await fetch(link+"/relations", {
    "headers": {
      "accept": "*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,bg;q=0.6,uk;q=0.5,be;q=0.4,kk;q=0.3,ku;q=0.2,cs;q=0.1,eo;q=0.1",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-csrf-token": document.querySelector('meta[name="csrf-token"]').content,
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": link,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "utf8=%E2%9C%93&relation%5Brelation_type%5D=relates&relation%5Bissue_to_id%5D="+issue+"&relation%5Bdelay%5D=&commit=%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D1%82%D1%8C",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });

  if (response.ok) { 
    let answ = await response.text();
    eval(answ);
    $('#new-relation-form').hide()
  }
}


async function getOEissues(variant) {
  let response = await fetch("http://redmine.mango.local/projects/zni/issues.csv?c%5B%5D=subject&c%5B%5D=project&c%5B%5D=status&f%5B%5D=status_id&f%5B%5D=tracker_id&f%5B%5D=&group_by=&op%5Bstatus_id%5D=o&op%5Btracker_id%5D=%3D&set_filter=1&t%5B%5D=&utf8=%E2%9C%93&v%5Btracker_id%5D%5B%5D=24", {
    "headers": {
      "accept": "*/*",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,bg;q=0.6,uk;q=0.5,be;q=0.4,kk;q=0.3,ku;q=0.2,cs;q=0.1,eo;q=0.1",
      "if-none-match": "W/\"89c56a7b06b6404ff156d14fbd3d64b4\""
    },
    "referrer": "http://redmine.mango.local/issues/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  if (response.ok) {
    var answ = await response.text();
    if (variant == 'all') {
      var link_text = document.createElement('h3');
      link_text.innerHTML = 'Список текущих ОЭ';
      sidebar.append(link_text);
      sidebar.append(document.createElement('br'));
      var link_issue = [];
      var link_relations = [];
      var link_number = [];
      var number;
      var name;
      answ.split("\n").forEach(element => {if ((element!='#|Тема|Проект|Статус')&&(element!='')) {
        number = element.split('|')[0];
        name = element.split('|')[1];
        link_number[number] = number;
        link_issue[number] = document.createElement('a');
        link_relations[number] = document.createElement('a');
        link_relations[number].title = number;
        link_issue[number].innerHTML = name;
        link_issue[number].href = "http://redmine.mango.local/issues/"+number;
        link_relations[number].innerHTML = 'Связать';
        sidebar.append(link_issue[number]);
        sidebar.append(document.createTextNode (" "));
        sidebar.append(link_relations[number]);
        sidebar.append(document.createElement('br'));
        link_relations[number].onclick = (e)=>{
          setRelations(e.target.title);
          e.target.style.display = 'none';
        }
      }});
    } else {
      var link_text = document.createElement('h3');
      link_text.innerHTML = 'Выбрать несколько ОЭ для письма';
      sidebar.append(link_text);
      sidebar.append(document.createElement('br'));
      var link_issue = [];
      var link_relations = [];
      var link_number = [];
      var number;
      var name;
      answ.split("\n").forEach(element => {
        if ((element!='#|Тема|Проект|Статус')&&(element!='')) {
          number = element.split('|')[0];
          name = element.split('|')[1];
          var el = document.createElement('input');
          el.type = "checkbox";
          el.className = "issues";
          el.name = name;
          el.value = number;
          sidebar.append(el);
          sidebar.append(document.createTextNode(name));
          sidebar.append(document.createElement('br'));
        }
      });
      var btn_start = document.createElement('a');
      var btn_end = document.createElement('a');
      btn_start.innerHTML = 'Письмо о запуске выбранных';
      btn_end.innerHTML = 'Письмо о завершении выбранных';
      sidebar.append(btn_start);
      sidebar.append(document.createElement('br'));
      sidebar.append(btn_end);
      btn_start.onclick = ()=>{
        mail_start_several();
      };
      btn_end.onclick = ()=>{
        mail_finish_several();
      };
      
    }
    document.querySelectorAll('a').forEach((e)=>{e.style.cursor='pointer'});
  }
}


//Страница создания заявки
if ((location.href.split('/')[3] == 'projects')&&(location.href.split('/')[6].split('?')[0] == 'new')) {
  if (location.href.split('?id=')[1] != undefined) {
    loadinfo(location.href.split('?id=')[1]);
  }
  if (location.href.split('?from=oe')[1] != undefined) {
      if (location.href.split('?from=oe&name=')[1].split('&type=')[1] == 'problem') {
        issue_custom_field_values_36.value="Проблема";
        issue_custom_field_values_49.value="Ошибка возникла у сотрудника";
        issue_subject.value = decodeURI(location.href.split('?from=oe&name=')[1].split('&type=')[0]+' - ');
        switch (location.href.split('/')[4]) {
          case "kommunikator":
            issue_assigned_to_id.value = 194;
            break;
          case 'zniikskt':
            issue_assigned_to_id.value = 194;
            break;
          case 'zni-vats':
            issue_assigned_to_id.value = 110;
            break;
          case 'zni-cc':
            issue_assigned_to_id.value = 110;
            break;
          case 'zniintegration':
            issue_assigned_to_id.value = 194;
            break;
          case 'lk7':
            issue_assigned_to_id.value = 110;
            break;
          default:
            issue_assigned_to_id.value = '';
        }
      } else {
        issue_custom_field_values_36.value="Заявка на изменение";
        issue_custom_field_values_49.value="Идея сотрудника(для клиентов)";
        issue_subject.value = decodeURI(location.href.split('?from=oe&name=')[1].split('&type=')[0]+' ЗНИ - ');
        issue_assigned_to_id.value = 59;
      }
      watchers_inputs.innerHTML = '<label id=\"issue_watcher_user_ids_906\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"906\" checked=\"checked\" /> Группа опытной эксплуатации <\/label>';
  }
  patterns();
  /*issue_assigned_to_id.parentNode.append(document.createTextNode (" "));
  let assigned_to_self = document.createElement('a');
  assigned_to_self.innerHTML = 'мне';
  issue_assigned_to_id.parentNode.append(assigned_to_self);
  assigned_to_self.onclick = ()=>{
    issue_assigned_to_id.value = issue_assigned_to_id.options[1].value;
  };*/
  issue_description.innerHTML = 'Добрый день, коллеги'+"\r";
  watchers_inputs.innerHTML = '<label id=\"issue_watcher_user_ids_906\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"906\" checked=\"checked\" /> Группа опытной эксплуатации <\/label>';
  issue_assigned_to_id.parentNode.append(document.createTextNode (" "));
  let assigned_to_minsk = document.createElement('a');
  assigned_to_minsk.innerHTML = 'Минск';
  issue_assigned_to_id.parentNode.append(assigned_to_minsk);
  assigned_to_minsk.onclick = ()=>{
    issue_assigned_to_id.value = 110;
  };
  issue_assigned_to_id.parentNode.append(document.createTextNode (" "));
  let assigned_to_msk = document.createElement('a');
  assigned_to_msk.innerHTML = 'ГТ';
  issue_assigned_to_id.parentNode.append(assigned_to_msk);
  assigned_to_msk.onclick = ()=>{
    issue_assigned_to_id.value = 194;
  };
  issue_assigned_to_id.parentNode.append(document.createTextNode (" "));
  let assigned_to_ba = document.createElement('a');
  assigned_to_ba.innerHTML = 'БА';
  issue_assigned_to_id.parentNode.append(assigned_to_ba);
  assigned_to_ba.onclick = ()=>{
    issue_assigned_to_id.value = 59;
  };
  issue_assigned_to_id.parentNode.append(document.createTextNode (" "));
  let assigned_to_oe = document.createElement('a');
  assigned_to_oe.innerHTML = 'ОЭ';
  issue_assigned_to_id.parentNode.append(assigned_to_oe);
  assigned_to_oe.onclick = ()=>{
    issue_assigned_to_id.value = 906;
  };
  
} 

//Страница заявки
if (location.href.split('/')[3] == 'issues') {
  $('#sidebar').html($('#watchers'));
  sidebar.append(document.createElement('br'));
  if (issue_tracker_id.value == "24") {
      //Трекер опытная эксплуатация
      var control_text = document.createElement('h3');
      control_text.innerHTML = 'УПРАВЛЕНИЕ ОЭ';
      sidebar.append(control_text);
      sidebar.append(document.createElement('br'));
      let link_add_problem = document.createElement('a');
      link_add_problem.innerHTML = 'Создать Проблему';
      sidebar.append(link_add_problem);
      link_add_problem.onclick = ()=>{
          if (document.getElementsByClassName('new-issue-sub')[0].href != "http://redmine.mango.local/projects/zni-minsk-komnas/issues/new") {
              window.open(document.getElementsByClassName('new-issue-sub')[0].href+'?from=oe&name='+document.getElementsByClassName('subject')[0].children[0].children[0].innerHTML+'&type=problem', '_blank');
          } else {
              //Костыль для ДКТ
              window.open('http://redmine.mango.local/projects/zniikskt/issues/new'+'?from=oe&name='+document.getElementsByClassName('subject')[0].children[0].children[0].innerHTML+'&type=problem', '_blank');
          }
      }
      sidebar.append(document.createElement('br'));
      let link_add_zni = document.createElement('a');
      link_add_zni.innerHTML = 'Создать ЗНИ';
      sidebar.append(link_add_zni);
      link_add_zni.onclick = ()=>{
          if (document.getElementsByClassName('new-issue-sub')[0].href != "http://redmine.mango.local/projects/zni-minsk-komnas/issues/new") {
              window.open(document.getElementsByClassName('new-issue-sub')[0].href+'?from=oe&name='+document.getElementsByClassName('subject')[0].children[0].children[0].innerHTML+'&type=zni', '_blank');
          } else {
              //Костыль для ДКТ
              window.open('http://redmine.mango.local/projects/zniikskt/issues/new'+'?from=oe&name='+document.getElementsByClassName('subject')[0].children[0].children[0].innerHTML+'&type=zni', '_blank');
          }
      }
      sidebar.append(document.createElement('br'));
      sidebar.append(document.createElement('br'));
      let link_mail_start = document.createElement('a');
      link_mail_start.innerHTML = 'Письмо о запуске';
      sidebar.append(link_mail_start);
      link_mail_start.onclick = ()=>{
          mail_start(document.getElementsByClassName('subject')[0].children[0].children[0].innerHTML, location.href.split('/')[4].split('?')[0]);
      }
      sidebar.append(document.createElement('br'));
      let link_mail_finish = document.createElement('a');
      link_mail_finish.innerHTML = 'Письмо о завершении';
      sidebar.append(link_mail_finish);
      link_mail_finish.onclick = (e)=>{
          e.target.style.display = 'none';
          mail_finish(document.getElementsByClassName('subject')[0].children[0].children[0].innerHTML, location.href.split('/')[4].split('?')[0]);
      }
      getOEissues('variant');
  } else {
    //Прочие трекеры
      getOEissues('all');
  }
  sidebar.append(document.createElement('br'));
  sidebar.append(document.createElement('hr'));
  sidebar.append(document.createElement('br'));
  let enties_add = document.createElement('a');
  enties_add.innerHTML = 'Трудозатраты на создание (15 минут)';
  sidebar.append(enties_add);
  enties_add.onclick = ()=>{
    add_time_entries(15, '0.25');
  }
  sidebar.append(document.createElement('br'));
  sidebar.append(document.createElement('br'));
  var enties_select = document.createElement('select');
  enties_select.innerHTML = '<option value="">--- Выберите ---</option><option value="8">Проектирование</option><option value="9">Разработка</option><option value="11">Тестирование</option><option value="12">Согласование</option><option value="13">Мониторинг</option><option value="14">Исследование </option><option value="15">Документирование</option><option value="19">Уточнение</option><option value="20">Консультирование</option><option value="29">Наставничество</option><option value="30">Приемка</option><option value="32">Актуализация</option>';
  sidebar.append(enties_select);
  var time_input = document.createElement('select');
  time_input.innerHTML = '<option value="0.1">5 мин</option><option value="0.25">15 мин</option><option value="0.5">30 мин</option><option value="0.75">45 мин</option><option value="1">1 час</option>';
  time_input.style.marginLeft = "15px";
  time_input.style.width = "80px";
  time_input.style.marginRight = "15px";
  sidebar.append(time_input);
  var time_ent_but = document.createElement('input');
  time_ent_but.type="button";
  time_ent_but.value="Добавить";
  sidebar.append(time_ent_but);
  time_ent_but.onclick = ()=>{
    add_time_entries(enties_select.value, time_input.value);
    time_ent_but.disabled = true;
  }
}
document.querySelectorAll('a').forEach((e)=>{e.style.cursor='pointer'});


