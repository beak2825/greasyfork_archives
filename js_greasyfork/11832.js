// ==UserScript==
// @name         [HWM] clanWorkers
// @version      2.0.5
// @description  Работа на клановых предприятии
// @author       Komdosh
// @match        http://www.heroeswm.ru/home.php*
// @grant        none
// @namespace https://greasyfork.org/users/13829
// @downloadURL https://update.greasyfork.org/scripts/11832/%5BHWM%5D%20clanWorkers.user.js
// @updateURL https://update.greasyfork.org/scripts/11832/%5BHWM%5D%20clanWorkers.meta.js
// ==/UserScript==
c=0;
flag=1;
clan_num=433;
clansMate=[];
objectsNum = [];
if (navigator.userAgent.search(/Chrome/) == -1 && navigator.userAgent.search(/Firefox/) == -1) return 0;

//***************************************************************************
//Интерфейс
var tdArray = document.getElementsByTagName('td');
for (var i = 0; i < tdArray.length; i++)
{
    if (tdArray[i].getElementsByTagName('b').length>0 && /\u0414\u0440\u0443\u0437\u044c\u044f \u0432 \u0438\u0433\u0440\u0435/.test(tdArray[i].getElementsByTagName('b')[0].innerHTML))
    {
        var mainElem = tdArray[i];
        var Box = tdArray[i+2];
        break;
    }
}
var div = document.createElement('div');
div.id = 'works';
div.style.display = "none";
var span = document.createElement( 'span' );
span.innerHTML = '&nbsp;(';
span.id = 'link';
var a = document.createElement('a');
a.href = 'javascript: void(0);';
a.innerHTML = '\u041a\u043b\u0430\u043d \u0440\u0430\u0431\u043e\u0442\u0430';
span.appendChild(a);
span.innerHTML += ')';
mainElem.appendChild(span);
mainElem.getElementsByTagName('a')[1].addEventListener('click', function() { document.getElementById('works').style.display = ( document.getElementById('works').style.display == 'none') ? 'block' : 'none'; }, false );
var tb = document.createElement( 'table' );
tb.id = "fieldTab";
var tr = document.createElement( 'tr' );
var td = document.createElement( 'td' );
td.innerHTML = '*\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0441:';
tr.appendChild( td );
var td = document.createElement( 'td' );
var inp = document.createElement( 'input' );
inp.setAttribute("placeholder","12-01-11 07:15");
inp.type = 'text';
inp.id = 'DateFrom';
td.appendChild(inp);
tr.appendChild(td);
var td = document.createElement( 'td' );
var inp = document.createElement( 'button' );
inp.innerHTML = '\u041c\u0435\u0441\u044f\u0446 \u043d\u0430\u0437\u0430\u0434';
inp.onclick = function(){
    var now = new Date();
    var day = now.getDate();
    day = formateDate(day, 1);
    var month = now.getMonth()+1;
    if(month==1)
        month=12;
    month = formateDate(month, 0);
    var year = (100-now.getYear())*(-1);
    var hours = now.getHours();
    hours = formateDate(hours, 1);
    var minutes = now.getMinutes();
    minutes = formateDate(minutes, 1);
    document.getElementById('DateFrom').value = day+"-"+month+"-"+year+" "+hours+":"+minutes;
}
td.appendChild(inp);
tr.appendChild(td);
var td = document.createElement( 'td' );
var inp = document.createElement( 'button' );
inp.innerHTML = '\u0412\u0447\u0435\u0440\u0430';
inp.onclick = function(){
    var now = new Date();
    var day = now.getDate();
    day = formateDate(day, 0);
    var month = now.getMonth()+1;
    if(month==1)
        month=12;
    month = formateDate(month, 1);
    var year = (100-now.getYear())*(-1);
    var hours = now.getHours();
    hours = formateDate(hours, 1);
    var minutes = now.getMinutes();
    minutes = formateDate(minutes, 1);
    document.getElementById('DateFrom').value = day+"-"+month+"-"+year+" "+hours+":"+minutes;
}
td.appendChild(inp);
tr.appendChild(td);
tb.appendChild(tr);
var tr = document.createElement( 'tr' );
var td = document.createElement( 'td' );
td.innerHTML = '*\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0434\u043e:';
tr.appendChild( td );
var td = document.createElement( 'td' );
var inp = document.createElement( 'input' );
inp.setAttribute("placeholder","13-01-11 07:15");
inp.type = 'text';
inp.id = 'DateTo';
td.appendChild(inp);
tr.appendChild(td);
var td = document.createElement( 'td' );
var inp = document.createElement( 'button' );
inp.innerHTML = '\u0421\u0435\u0439\u0447\u0430\u0441';
inp.onclick = function(){
    var now = new Date();
    var day = now.getDate();
    day = formateDate(day, 1);
    var month = now.getMonth()+1;
    month = formateDate(month, 1);
    var year = (100-now.getYear())*(-1);
    var hours = now.getHours();
    hours = formateDate(hours, 1);
    var minutes = now.getMinutes();
    minutes = formateDate(minutes, 1);
    document.getElementById('DateTo').value = day+"-"+month+"-"+year+" "+hours+":"+minutes;
}
td.appendChild(inp);
tr.appendChild(td);
tb.appendChild(tr);
var tr = document.createElement( 'tr' );
var td = document.createElement( 'td' );
td.innerHTML = '\u0413\u0420:';
tr.appendChild( td );
var td = document.createElement( 'td' );
var inp = document.createElement( 'input' );
inp.setAttribute("placeholder","10");
inp.type = 'text';
inp.id = 'Gr';
td.appendChild(inp);
tr.appendChild(td);
tb.appendChild(tr);
div.appendChild( tb );
var button = document.createElement('button');
button.innerHTML = '\u041e\u0431\u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c';
button.id='procButton';
button.onclick = function(){
    if(document.getElementById('DateFrom').value && document.getElementById('DateTo').value && /[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/.test(document.getElementById('DateTo').value) && /[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/.test(document.getElementById('DateFrom').value) && (parseDate(document.getElementById('DateTo').value)>parseDate(document.getElementById('DateFrom').value)))
    {
        start(); 
        document.getElementById('spo').style.display='block'; 
        document.getElementById('waiting').style.display='block'; 
        Box.innerHTML="\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430 \u043f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435, \u0441\u043a\u0440\u0438\u043f\u0442 \u0441\u043e\u0431\u0438\u0440\u0430\u0435\u0442 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e!<br> \u0416\u0435\u043b\u0430\u0442\u0435\u043b\u044c\u043d\u043e \u043e\u0441\u0442\u0430\u0432\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u044d\u0442\u043e\u0439 \u0436\u0435 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435 \u0432\u043e \u0438\u0437\u0431\u0435\u0436\u0430\u043d\u0438\u0435 \u043f\u0440\u043e\u0431\u043b\u0435\u043c.";
    }
    else
        alert("\u0414\u0430\u0442\u0430 \u0437\u0430\u043f\u0438\u0441\u0430\u043d\u0430 \u0432 \u043d\u0435\u0432\u0435\u0440\u043d\u043e\u043c \u0444\u043e\u0440\u043c\u0430\u0442\u0435!");
};
div.appendChild(button);
var spo = document.createElement('span');
spo.id='spo';
spo.innerHTML = '<img src="http://dcdn.heroeswm.ru/i_clans/l_'+clan_num+'.gif?v=69" width="20" height="15"">';
spo.style.display = 'none';
div.appendChild(spo);
var spo = document.createElement('span');
spo.id='waiting';
spo.innerHTML = '';
spo.style.display = 'none';
div.appendChild(spo);
mainElem.appendChild( div );
//***************************************************************************
//Достаём массив соклан
function start()
{
    document.getElementById('procButton').style.display='none';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI("clan_info.php?id="+clan_num));
    xhr.overrideMimeType('text/xml; charset=windows-1251');
    xhr.onload = function() 
    {
        if(document.getElementById('resp')===null)
        {
            var div = document.createElement( 'div' );
            div.id = 'resp';
            div.style.display = 'none';
            div.innerHTML = xhr.responseText;
            document.getElementsByTagName('body')[0].appendChild( div );
        }
        if (xhr.status === 200)
        {
            var respDoc = document.getElementById('resp');
            var aArray = respDoc.getElementsByTagName('a');
            for(var i=35; i<aArray.length; i++)
            {
                if(/<a href="pl_info\.php\?id=[0-9]*" class="pi">.*<\/a>/.test(aArray[i].outerHTML) && !document.getElementById('Gr').value)
                {
                    clansMate[clansMate.length]=[];
                    clansMate[clansMate.length-1][0] = aArray[i].outerHTML/*.split('">')[1].split('</a')[0]*/;
                    clansMate[clansMate.length-1][1]=0;
                }
                if(/<a href="object-info\.php\?id=[0-9]*">.*<\/a>/.test(aArray[i].outerHTML))
                {
                    objectsNum[objectsNum.length] = aArray[i].outerHTML.split('id=')[1].split('"')[0];
                }
            }        
            getWorkers(0,0);
        }
        else 
        {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}
//***************************************************************************
//Обработка данных
function getWorkers(objId, pg)
{
    flag=1;
    var dateToCmp ='';
    document.getElementById('waiting').innerHTML='\u041d\u043e\u043c\u0435\u0440 \u043f\u0440\u0435\u0434\u043f\u0440\u0438\u0442\u0438\u044f: '+objectsNum[objId]+" \u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430: "+pg;
    if(objId < objectsNum.length) //objectsNum.length
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', encodeURI("objectworkers.php?id="+objectsNum[objId]+"&page="+pg));
        xhr.overrideMimeType('text/xml; charset=windows-1251');
        xhr.onload = function() 
        {
            if (xhr.status === 200)
            {
                document.getElementById('resp').innerHTML = xhr.responseText;
                var respDoc = document.getElementById('resp');
                var array = respDoc.getElementsByTagName('nobr');
                for(var i=10; i<array.length && flag; i++)
                    if(/[0-9]{2}-[0-9]{2}-[0-9]{2} .*/.test(array[i].innerHTML))
                    {
                        dateToCmp = array[i].innerHTML.split('&nbsp;&nbsp;')[1].split(' (')[0].slice(0, -1);
                        if(dateCmp(dateToCmp)>0)
                        {
                            if(document.getElementById('Gr').value)
                            {
                                var links = array[i].getElementsByTagName('a');
                                for (var j=0; j<links.length; j++)
                                    if(parseInt(links[j].innerHTML.split('[')[1].split(']')[0])<=document.getElementById('Gr').value) 
                                    {
                                        if(!(new RegExp(links[j].innerHTML.split('[')[0]).test(clansMate)))
                                        {
                                            clansMate[clansMate.length]=[];
                                            clansMate[clansMate.length-1][0] = links[j].outerHTML.split('[')[0];
                                            clansMate[clansMate.length-1][1] = links[j].innerHTML.split('[')[1].split(']')[0];
                                        }
                                    }
                            }                          
                            else
                                for(var j=0; j<clansMate.length; j++)
                                    if(new RegExp('.*' + clansMate[j][0].split('<\/a')[0].split('>')[1] + '.*').test(array[i].innerHTML))
                                        clansMate[j][1]++;
                        }
                        flag=(dateCmp(dateToCmp)==-1)?0:1;
                    }
                if(!flag)
                    getWorkers(objId+1, 0);
                else
                    getWorkers(objId, pg+1);
            }
            else 
            {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }
    else
        sm();
}

//***************************************************************************
//Вывод данных
function sm(){
    document.getElementById('spo').style.display='none';
    document.getElementById('waiting').style.display='none';
    Box.innerHTML = '';
    var st = document.createElement('div');
    st.id = "stDiv";
    var tb = document.createElement('table');
    tb.style.cssText = 'margin:auto';
    var tr = document.createElement( 'tr' );
    var td = document.createElement( 'td' );
    td.innerHTML = "\u041d\u0438\u043a";
    td.style.cssText = 'text-align:center; border-bottom:1px solid grey; font-weight: bold';
    tr.appendChild(td);
    td = document.createElement( 'td' );
    td.style.cssText = 'text-align:center; border-bottom:1px solid grey; font-weight: bold';
    tr.appendChild(td);
    if(document.getElementById('Gr').value)
        td.innerHTML = "\u0413\u0420"; 
    else
        td.innerHTML = "\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0440\u0430\u0431\u043e\u0442";
    tb.appendChild(tr);
    clansMate.sort(sWorks);
    for(var i=0; i<clansMate.length; i++)
    {
        tr = document.createElement( 'tr' );
        td = document.createElement( 'td' );
        td.innerHTML = clansMate[i][0];
        td.style.cssText = 'border-bottom:1px solid grey;';
        tr.appendChild(td);
        td = document.createElement( 'td' );
        td.innerHTML = clansMate[i][1];
        td.style.cssText = 'text-align:right; border-bottom:1px solid grey;';
        tr.appendChild(td);
        tb.appendChild(tr);
    }
    st.appendChild(tb);
    Box.appendChild(st);
}
// Сортировка по количеству работ
function sWorks(a, b) {
    if (a[1] > b[1]) return -1;
    else if (a[1] < b[1]) return 1; else return 0;
}
//***************************************************************************
//Сравнение дат
function dateCmp(strDate)
{
    if(document.getElementById('DateFrom').value===strDate || document.getElementById('DateTo').value===strDate)
    {
        return 1;
    }
    //0 - день, 1 - месяц, 2 - год, 3 - часы, 4 - минуты
    var dateFrom = parseDate(document.getElementById('DateFrom').value);
    var dateTo = parseDate(document.getElementById('DateTo').value);
    var cDate = parseDate(strDate);
    if(cDate<dateFrom)
        return -1;
    if(dateFrom<cDate && cDate<dateTo)
        return 1;
    return 0;
}
//Мелкие вспомогательные функции
function parseDate(strDate){
    //0 - год, 1 - месяц, 2 - день, 3 - часы, 4 - минуты
    return parseInt(strDate.split('-')[2].split(' ')[0]+strDate.split('-')[1].split('-')[0]+strDate.split('-')[0]+strDate.split(' ')[1].split(':')[0]+strDate.split(':')[1]);
}
function formateDate(date, bool){
    if(bool)
        return (date<10)?("0"+date):date;
    else
        return (date<10)?("0"+(date-1)):date-1;
}