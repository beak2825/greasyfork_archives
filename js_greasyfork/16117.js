// ==UserScript==
// @name        Загрузка скринов из раздачи для pornolab.net
// @description Загрузка скринов из раздачи
// @namespace   memmes
// @include  *://*pornolab.net/forum/tracker.php*
// @version     2.2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/16117/%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0%20%D1%81%D0%BA%D1%80%D0%B8%D0%BD%D0%BE%D0%B2%20%D0%B8%D0%B7%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B0%D1%87%D0%B8%20%D0%B4%D0%BB%D1%8F%20pornolabnet.user.js
// @updateURL https://update.greasyfork.org/scripts/16117/%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0%20%D1%81%D0%BA%D1%80%D0%B8%D0%BD%D0%BE%D0%B2%20%D0%B8%D0%B7%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B0%D1%87%D0%B8%20%D0%B4%D0%BB%D1%8F%20pornolabnet.meta.js
// ==/UserScript==

var FullLoad = true;

var debag = false;

var LoadImage = "data:image/gif;base64,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";
var MyMas = [];

var loc_hostname = location.hostname;
debug_log(location.hostname);

var RegexString = GetRegexString(loc_hostname);
debug_log(RegexString);

var RegexStringR = "body tbody.row1 header";
var RegexStringS = "body tbody .row1 form";

var body = document.querySelector('body');
body.addEventListener('click', MyFunc);

function GetRegexString(pDom)
{
    var result= "";

    if (FullLoad)
    {
        result = /<div class="post_body"([\s\S]*?)<div class="clear"><\/div>/;
    }
    else
    {
          result = /((<a href=.*?(?:radikal|fastpic|firepic|you-logo|lostpic|imageban|sendpic|picclick|imagevenue|turboimagehost).*?<\/a>))/g;

    }

    return result;
}

function MySpl(event) //костыль для спойлеров
{
    var EventTarget = event.target;

    if (/sp-head/.test(EventTarget.className))
    {
        var Spl = EventTarget.parentNode;
        if (/sp-wrap/.test(Spl.className))
        {
            var Blck = Spl.querySelector('div:nth-child(2)');
            if (Blck.style.display == "block")
            {
                Blck.style.display = "none";
            } else Blck.style.display = "block";
        }
    }
}

function GetCellHREF(pDom,Cell2)
{
    var result = Cell2.querySelector('a:nth-child(1)').href;

    debug_log(result);

    return result;
}

function PrepareHTML(pDom,HTMLtext)
{
    var result = HTMLtext;

    if (FullLoad)
    {
        debug_log("PreparePost");
        result = PreparePost(pDom,HTMLtext);
    } else
    {
        debug_log("PrepareImage");
        result = PrepareImage(pDom,HTMLtext);
    }

    return result;
}

function PreparePost(pDom,HTMLtext)
{
    var result = HTMLtext;

    result = result.replace(new RegExp('<div class="clear"([\s\S]*)<\/div>"', 'g'),'');

    result = result.replace(new RegExp('var class="postImg postImgAligned img-right" title', 'g'),'img src');

    result = result.replace(new RegExp('var class="postImg" title', 'g'),'img src');

    result = result.replace(new RegExp('</var>', 'g'),'</br>');

    result = result.replace(new RegExp('<div class="sp-wrap">', 'g'),'<div class="sp-wrap"><div class="sp-head folded clickable">Спойлер</div>');

    return result;
}

function PrepareImage(pDom,HTMLtext)
{
    var result = HTMLtext;

    result = result.replace(new RegExp('class="postLink"', 'g'),'');
    result = result.replace(new RegExp('var class="postImg" title', 'g'),'img src');
    result = result.replace(new RegExp('</var>', 'g'),'');

    return result;
}

function ItsLine(target)
{
    var result = false;

    debug_log(target.className);
    result = (target.className == "row4 med tLeft u");

    return result;
}

function AlreadyLoad(target){return (target.hasAttribute('MyLoad')===false);}
function DomDell(pLink){return pLink.replace(/^.*?:\/\/.*?(?=\/|$)/,'');}
function scrollToElement(theElement)
{
    var selectedPosX = 0;var selectedPosY = 0;
    while (theElement != null)
    {
        selectedPosX += theElement.offsetLeft;selectedPosY += theElement.offsetTop;theElement = theElement.offsetParent;
    }
    window.scrollTo(selectedPosX,selectedPosY);
}
function debug_log(pLogText){if(debag){console.log(pLogText);}}
function ItsMyDel(target) {return (target.hasAttribute('MyDel'));}

function AddTable(target)
{
    var RandomNom = 1;//random(9999);

    target.setAttribute('MyLoad', RandomNom);

    var mytbl = document.createElement('table');

    mytbl.style.width = '100%';
    mytbl.setAttribute('MyTable', 'true');

    var mytbdy = document.createElement('tbody');

    mytbl.setAttribute('border', '0');

    var tr = document.createElement('tr');

    var td = document.createElement('td');
    td.style.width = '1%';
    //td.innerHTML = "<b>с</br>в</br>е</br>р</br>н</br>у</br>т</br>ь</b>";
    td.style.backgroundColor = "gray";
    td.style.cursor= "pointer";
    td.setAttribute('MyDel', 'true');
   // td.setAttribute('ScrolTo', RandomNom);

    tr.appendChild(td);

    var Result_td = document.createElement('td');

    var LImg = new Image();
    LImg.setAttribute('src', LoadImage);
    LImg.setAttribute('style', "display: block; margin: 0 auto;");
    Result_td.appendChild(LImg);

    tr.appendChild(Result_td);



    td = document.createElement('td');
    td.style.width = '1%';
    //td.innerHTML = "<b>с</br>в</br>е</br>р</br>н</br>у</br>т</br>ь</b>";
    td.style.backgroundColor = "gray";
    td.style.cursor= "pointer";
    tr.appendChild(td);
    td.setAttribute('MyDel', 'true');
   // td.setAttribute('ScrolTo', RandomNom);

    mytbdy.appendChild(tr);


    tr = document.createElement('tr');

    td = document.createElement('td');
    td.style.width = '1%';
    td.style.backgroundColor = "gray";
    td.style.cursor= "pointer";
    td.setAttribute('MyDel', 'true');
   // td.setAttribute('ScrolTo', RandomNom);
    tr.appendChild(td);

    td = document.createElement('td');
    //    td.style.width = '1%';
    td.innerHTML = "<center><b>свернуть</b></center>";
    td.style.backgroundColor = "gray";
    td.style.cursor= "pointer";
    td.setAttribute('MyDel', 'true');
   // td.setAttribute('ScrolTo', RandomNom);
    tr.appendChild(td);

    td = document.createElement('td');
    td.style.width = '1%';
    td.style.backgroundColor = "gray";
    td.style.cursor= "pointer";
    td.setAttribute('MyDel', 'true');
    //td.setAttribute('ScrolTo', RandomNom);
    tr.appendChild(td);

    mytbdy.appendChild(tr);

    mytbl.appendChild(mytbdy);

    target.appendChild(mytbl);

    return Result_td;
}

function GetMyTable(EventTarget)
{
    result = EventTarget;

    while ((result.hasAttribute('MyTable') === false)&&(result.tagName != 'BODY'))
    {
        result = result.parentNode;
    }

    return result;
}

function MyFunc(event)
{
    EventTarget = event.target;

    debug_log("--event.target--");
    debug_log(EventTarget);

    if (EventTarget.parentNode.className == "row4 med tLeft u")
    {
        EventTarget = EventTarget.parentNode;
    }

    if (ItsLine(EventTarget))
    {
        debug_log("--TARGET--");

        if (AlreadyLoad(EventTarget))
        {
            debug_log("--Cell--");
            debug_log(EventTarget);
            debug_log("--AddTable--");

            var ResTd = AddTable(EventTarget);
            ResTd.addEventListener('click', MySpl);

            MyMas.push(EventTarget);

            CellHREF = GetCellHREF(loc_hostname,EventTarget);

            debug_log("--HREF--");
            debug_log(CellHREF);

            MdownloadPage(CellHREF);
        }else
        {
            console.log("UN LOAD");
            var MyTable = EventTarget.querySelector("table[MyTable]");
            EventTarget.removeAttribute('MyLoad');
            MyTable.remove();
        }
    }
    //клик по ячейкам свернуть
    if (ItsMyDel(EventTarget)||ItsMyDel(EventTarget.parentNode))
    {
        var MyTable = GetMyTable(EventTarget);
        if (MyTable!=EventTarget)
        {
            var Cell = MyTable.parentNode;
            Cell.removeAttribute('MyLoad');
            //Cell

          //  if (!(document.scrollTop() + window.height() > Cell.offset().top && document.scrollTop() - Cell.offset().top < Cell.height()))
          //  {
          //     scrollToElement(Cell);
          //  }

            MyTable.remove();
        }
        console.log("MyDELLL");
    }
}

function MdownloadPage(url)
{
    debug_log("url");
    debug_log(url);

    var data = GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'text/xml'
        },
        onload: function (response) {

            debug_log("response");
            debug_log(response);

            debug_log("response.finalUr");
            debug_log(response.finalUrl);

            debug_log("MyMas");
            debug_log(MyMas);

            for (var em = 0; em < MyMas.length; em++)
            {

                if (DomDell(GetCellHREF(loc_hostname,MyMas[em]))==DomDell(response.finalUrl)){
                    TargetEm = MyMas[em];
                    MyMas.splice(em, 1);
                    break;
                }
            }

            debug_log("TargetEm");
            debug_log(TargetEm);

            LoadDIV = TargetEm.querySelector('table[MyTable] > tbody > tr > td:nth-child(2)');

            while (LoadDIV.lastChild) LoadDIV.removeChild(LoadDIV.lastChild);

            debug_log("LoadDIV");
            debug_log(LoadDIV);

            var m = RegexString.exec(response.responseText);

            debug_log("---m---");
            debug_log(m);

            if (m !== null)
            {

                debug_log("---m[0]---");
                debug_log(m[0]);

                res = PrepareHTML(loc_hostname,m[0]);

                debug_log(res);

                LoadDIV.innerHTML += res;
              }
        }
    });
}
