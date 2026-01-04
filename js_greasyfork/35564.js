// ==UserScript==
// @name        HWH Price per battle in transfers
// @namespace   Zeleax
// @description В протоколе передач добавляет цену за бой, общую сумму дивидендов за акции предприятий. В протоколе кузнецов в шапке показывает время завершения текущего ремонта
// @include /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com|my.lordswm.com)\/(pl_transfers.php\?id=.*)/
// @version     1.6
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/35564/HWH%20Price%20per%20battle%20in%20transfers.user.js
// @updateURL https://update.greasyfork.org/scripts/35564/HWH%20Price%20per%20battle%20in%20transfers.meta.js
// ==/UserScript==

var body = document.body.innerHTML;
var regx = /\d{2}-\d{2}-\d{2} \d{2}:\d{2}:/g; // время
var pos=[]; // начало каждой строки
var res, s, sfind, ttime;
var finishRepairTime;
var foundFirstRepair=false;
var curHWMdate=GetHWMDate();
var dividend_flag=0;
var dividendLastRowId=-1;

while(res = regx.exec(body)) pos.push(res.index);

var arrbody=[]; // строки
var dividend_sum=0;
for(var i=0; i<pos.length; i++){
    s =(i<pos.length) ? body.substring(pos[i], pos[i+1]) : body.substring(pos[i]);

    res = /на (\d+) боев .+ за (\d+) Золото/.exec(s);
    if(res && res[1]>1) {
       sfind='за '+res[2]+' Золото';
       s=s.replace(sfind, sfind+' ('+Math.round(res[2] / res[1] *10)/10+'/бой)');
    }

    if (!foundFirstRepair)
    {
        res = /Получено за ремонт: (\d+) \((\d+)%\)/.exec(s.toString()); // личный ремонт
        if(res) {
            var startDate= ParseHWMLogDate(s);
            var repairTimeMinutes=parseInt(res[1],10)*1.5/(parseInt(res[2],10));
            finishRepairTime=AddMinutes(startDate, repairTimeMinutes);
            foundFirstRepair=true;
        }
        else
        {
            res = /до (.+)\. Заработано/.exec(s.toString()); // клановый ремонт
            if(res) {
                finishRepairTime=ParseHWMLogDate2(res[1]);
                foundFirstRepair=true;
            }
        }

        if(foundFirstRepair)
        {
            s=s.replace('<a ', '<a id="foundFirstRepair" ');
        }
    }

    arrbody.push(s);

    var res_dividend = /Получено (\d+) золота .+Империя.+дивиденды/.exec(s);
    if(res_dividend && res_dividend[1]>1) {
        dividend_flag=1;
        dividend_sum+=parseInt(res_dividend[1]);

        if(i==pos.length-1) {
            dividendLastRowId=i;
        }
    }
    else if(dividend_flag==1){
        dividend_flag=0;
        dividendLastRowId= i-1;
    }

    if(dividendLastRowId>=0){
        var brPos = arrbody[dividendLastRowId].indexOf('<br>');
        if(brPos>0) arrbody[dividendLastRowId]=arrbody[dividendLastRowId].slice(0, brPos) +'. ИТОГО дивидендов: '+dividend_sum+arrbody[dividendLastRowId].slice(brPos);
        dividend_sum=0;
        dividendLastRowId=-1;
    }
}

document.body.innerHTML=body.substring(0,pos[0]) + arrbody.join('');

if(foundFirstRepair && curHWMdate<finishRepairTime) // идет ремонт
{
    var el=getE('//div[contains(text(),"Протокол передач")]');
    if(el)
    {
        var sp=document.createElement('span');
        sp.id='finishRepairTimeStr';
        sp.style="color:red;";
        sp.textContent=' '+DateToHWMString(finishRepairTime);
        sp.title="Время окончания текущего ремонта";
        el.appendChild(sp);
    }

    el = document.getElementById('foundFirstRepair');
    el.style="color: red;";
}

// "23-01-22 19:44 Текст" -> Date
function ParseHWMLogDate(s){return new Date(parseInt(s.substring(6,8),10)+2000, parseInt(s.substring(3,5),10)-1, parseInt(s.substring(0,2),10), parseInt(s.substring(9,11),10), parseInt(s.substring(12,14),10));}
// "2022.01.23 05:14 Текст" -> Date
function ParseHWMLogDate2(s){return new Date(parseInt(s.substring(0,4),10), parseInt(s.substring(5,7),10)-1, parseInt(s.substring(8,10),10), parseInt(s.substring(11,13),10), parseInt(s.substring(14,16),10));}
// Date + Minutes
function AddMinutes(dt, minutes) {return new Date(dt.getTime() + minutes*60000);}
// Date -> для текущей даты "05:14", для другой даты "23.01 05:14", для другого года "2022.01.23 05:14"
function DateToHWMString(d){
    var dt=GetHWMDate();
    var res;
    if(dt.getYear()!=d.getYear()) res=DateToHWMString2(d);
    else {
        res=('0'+(d.getHours())).slice(-2)+':'+('0'+(d.getMinutes())).slice(-2); // HH:MM
        if(dt.getDate()!=d.getDate()) res = ('0'+d.getDate()).slice(-2)+'.'+('0'+(d.getMonth()+1)).slice(-2)+' '+ res; // dd.mm HH:MM
    }

    return res;
}
// Date -> "2022.01.23 05:14"
function DateToHWMString2(d){return d.getFullYear()+'.'+('0'+(d.getMonth()+1)).slice(-2)+'.'+('0'+d.getDate()).slice(-2)+' '+('0'+(d.getHours())).slice(-2)+':'+('0'+(d.getMinutes())).slice(-2);}
// возвращает Date для HWM (берет из часов возле значка радио)
function GetHWMDate(){
    var result;
    var el=getE('//td[a[contains(@href,"player.html")]]');
    if (el){
        var res = /(\d{1,2}):(\d{1,2})/.exec(el.innerText); // 22:54, 5043 online
        if(res) {
            var hours = parseInt(res[1],10);
            var timestamp=(new Date()).setHours(hours);
            result = new Date(timestamp);

            var localHour=(new Date()).getHours(); // корректируем с учетом разницы часовых поясов
            var diffHours=localHour-hours;
            if(Math.abs(diffHours)>15){
                if(diffHours>0) result++;
                else result--;
            }
        }
    }
    return result;
}

function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
