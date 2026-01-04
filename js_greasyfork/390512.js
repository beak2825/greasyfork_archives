// ----------Куча комментариев----------------------------------------------
//
// ==UserScript==
// @name TREASURY
// @namespace TREASURY button
// @version 2.5
// @description Этот скрипт добавит нужные кнопки!
// @include https://intranet.ylrus.com/treasury/*
// @run-at  document-end
// @grant   GM_xmlhttpRequest
// @connect www.cbr.ru
// @downloadURL https://update.greasyfork.org/scripts/390512/TREASURY.user.js
// @updateURL https://update.greasyfork.org/scripts/390512/TREASURY.meta.js
// ==/UserScript==


window.onload = function() {
    var styles = `
*{
  box-sizing: border-box;
}
.d-table{
  display: table;
  width: 100%;
  border-collapse: collapse;
}
.d-tr{
  display: table-row;
}
.d-td{
  display: table-cell;
  border: none;
  border: 1px solid ;
  vertical-align: middle;
}
.copied{
  font-weight:bold;
}`
    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.append(styleSheet)

    if (typeof cntYUNAS !== 'undefined') {
        var invSupplie = document.querySelector("#container-invSupplierID > label");
        console.log(invSupplie)
        console.log(cntYUNAS)
        invSupplie.innerHTML=invSupplie.innerHTML+' '+ '<span style="font-weight: normal">'+cntYUNAS+'</span>'
        invSupplie.setAttribute('style', 'white-space: pre-wrap')
    }
     var tabsElem = $('.tabs.ui-tabs.ui-corner-all.ui-widget.ui-widget-content');
     if($('#same_ex').length) $( '<li aria-controls="Estimates"><a href="/nlogjc/supinvoice_form.php?sinID=631636 #jit" id="ui-id-9">Estimates</a></li>').appendTo(".ui-tabs-nav")
//     var num_tabs=0, link=[], pdf_name,pdfID;
//     var oGrid = $('#fil').eiseGrid('getGridObject');
//     oGrid.tbodies.each(function(){
//         if(/pdf|jpeg/.test(this.querySelector('tr > td.fil-filType.eg-text > input').value)){//image/jpeg=='application/pdf'
//             link.push(this.querySelector('tr > td.fil-filName.eg-text > div > a').href.replace('https://intranet.ylrus.com/treasury/getfile','getpdf'));
//             pdf_name=this.querySelector('tr > td.fil-filName.eg-text >  div > a').innerHTML.slice(0,6);
//             $( '<li class="pdf"><a href="#pdf-'+num_tabs+'" id="ui-id-1'+num_tabs+'">'+pdf_name+'</a></li>' ).appendTo(".ui-tabs-nav")
//                 ++num_tabs;
//         }
//     });
//     tabsElem.tabs({activate: function( event, ui ){
//            pdfID=ui.newTab.attr('aria-controls')
//            if(ui.newTab.hasClass("pdf")&&!$('#'+pdfID).length){
//                tabsElem.append('<div id="'+pdfID+'" class="ui-tabs-panel"><iframe src="'+link[pdfID.slice(-1)]+'" style="height: '+(window.innerHeight-240)+'px;"></iframe></div>');
//            }
//        }
//    });
     tabsElem.tabs("refresh");
     tabsElem.bind("tabsload", function(event, ui) {
         setTimeout(() =>  {  searchJID(); }, 200);
         ;})


    var save = document.getElementsByClassName('sprite save submit')
    if(save.length>0){
        save[0].parentNode.outerHTML += '<li><a class="sprite attach" href="javascript:attach(0);" onclick="attach(0);; return (false);">Заменить скан</a></li>';
    }
    var share=document.getElementsByClassName('sprite share')
    if(share.length>0){
        share[0].parentNode.outerHTML += '<li><a class="sprite save submit" href="javascript:save();" onclick="save();; return (false);">Сохранить</a></li>';
    }
    var footer= document.getElementsByClassName('link-footer')
    if(footer.length>0){
        footer[0].innerHTML += '<li><a id="nlogjc_sin" target="_blank" href="/nlogjc/supinvoice_form.php?sinID=' + document.getElementById("invID").value + '">Список работ</a></li>';
    }

    var invAm= document.querySelector("#container-invAmount > label")
    if (invAm) {
        invAm.onclick = function copyDivToClipboard(elem) {
            event.preventDefault();
            var range = document.createRange();
                console.log(this.parentNode.children[1].children[0])
            range.selectNode(this.parentNode.children[1].children[0]);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand("copy");
            setTimeout(function() {
                window.getSelection().removeAllRanges();
            }, 200);
        }
    }
    if (invAmount) {
       if (document.getElementById("invVatID").value==9){
            document.getElementById('invAmount_details').innerHTML += (invAmount/1.2).toFixed(2).replace(".", ",")
       }
    }
    console.log(invComment)
    if (invComment) {
        var block=document.createElement('div');
        block.id='workimage';
        block.style.display = 'none';
        var image=document.createElement('img');
        image.src='https://intranet.ylrus.com/common/images/ajax-loader-orange.gif';
        block.appendChild(image);
        var obj=document.getElementById('description');
        obj.appendChild(block);
        var job=invComment.match(/C0\d{7}|[A-Z]{3,5}(?:21|20)\d{5}/);
        if(job&&!CheckContNumber(job[0])){
            document.getElementsByClassName('link-footer')[0].innerHTML += '<li><a id="nlogjc_sin" target="_blank" href="/nlogjc/job_form.php?jobID=' + job+ '">' + job+ '</a></li>';
        }
    }
    var curen = document.querySelector("#container-invCurrencyID > label");//[for='invCurrencyID']"
    if (curen) {
        curen.addEventListener('click', function() {
            displayEuro(0);
            function displayEuro(i) {
                GM_xmlhttpRequest({
                    method : "GET",
                    url : "http://www.cbr.ru/scripts/XML_daily.asp?date_req="+invDate.replace(/(\d{4})-(\d{2})-(\d{2})/,'$3/$2/$1'),
                    onload : function(response) {
                        myFunction(response, i);
                    }
                });
            }
            function myFunction(xml, i) {
                var xmlDoc = xml.responseXML;
                var usd = xmlDoc.querySelectorAll("Valute[ID='R01235'] > Value")[0].childNodes[0].nodeValue;
                document.getElementById('invAmount_details').innerHTML +=  " Usd: <b>" + (invAmount /usd.replace(',','.')).toFixed(2);
                var eur = xmlDoc.querySelectorAll("Valute[ID='R01239'] > Value")[0].childNodes[0].nodeValue;
                document.getElementById('invAmount_details').innerHTML +=  " Euro: <b>" + (invAmount/eur.replace(',','.')).toFixed(2);
                document.getElementById('invCurrencyID_details').innerHTML += invDate.replace(/(\d{4})-(\d{2})-(\d{2})/,'$3.$2.$1')+": $ <b>" + usd + "</b> € <b>"+ eur;
            }
        });
    }
    var invPerformer = document.querySelector("#container-invPerformerID > label");
    if (invPerformer) {
        invPerformer.addEventListener('click', function() {
           if (confirm('Удалить исполнителя?'))           {
               document.querySelector("#invPerformerID").value='';
               document.querySelector("#input_invPerformerID").value='';
           };
        });
    }
    var button = document.getElementById('heading');
    if (button) {
        button.addEventListener('click', function() {
            if (invComment) {
                var arr = cnt(invComment)
                var tr = "";
                var td = "";
                var cntrs= "";
                var jobs ="";
                var table = document.createElement("table");
                //table.classList.add("d-table");
                //console.log(arr.length)
                if (!!arr && arr.length){
                        block.style.display = 'block';
                    (function xhrReq(index) {
                        index = index || 0;

                        if(index < 0 || index >= arr.length) {
                            return;
                        }
                        if (-1 < cntrs.search(arr[index])){

                            return xhrReq(index+1);
                        }
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "https://intranet.ylrus.com/nlogjc/job_list.php?job_staID=&DataAction=json&offset=0&noCache=1&rnd=36319&job_jobFlagMyItems=&job_jobCntNo="+arr[index]);
                        xhr.send();
                        xhr.addEventListener("readystatechange", function () {
                            console.log(this.readyState);

                            if (this.readyState === 4 ) {
                                block.style.display = 'none';
                                var response=JSON.parse(this.responseText);
                                var rows = response.rows.length;
                                if(response.nTotalRows==0){
                                    if (!confirm('Нет работ для '+arr[index]+', продолжить?')) return;
                                    return xhrReq(index+1);

                                }
                                table.setAttribute("border", "1px");
                                table.setAttribute("width", "100%");
                                for (var i = 0; i < rows; i++) {
                                    tr = document.createElement("tr");
                                    //tr.classList.add("d-tr");
                                    switch(response.rows[i].r.staTitleLocal.t) {
                                        case 'Активна':
                                            tr.style.backgroundColor="#fcfcee";
                                            break;
                                        case 'Закрыта':
                                            tr.style.backgroundColor="#FFA07A";
                                            break;
                                        case '(черновик)':
                                            tr.style.backgroundColor="#EEE";
                                            break;
                                    }
                                    td = document.createElement("td");
                                    td.classList.add("d-td");
                                    td.innerHTML = response.rows[i].r.jobCustomerID.t; //пишем в нее текст
                                    td.setAttribute('style', ' cursor: pointer')
                                    td.onclick = function copyDivToClipboard(elem) {
                                        var range = document.createRange();
                                        range.selectNode(this.parentNode.children[1].firstChild);
                                        window.getSelection().removeAllRanges();
                                        window.getSelection().addRange(range);
                                        document.execCommand("copy");
                                        this.nextSibling.classList.add('copied');
                                        console.log(elem)
                                        setTimeout(function() {
                                            console.log(this)
                                            window.getSelection().removeAllRanges();
                                        }, 200);
                                    }
                                    tr.appendChild(td);
                                    td = document.createElement("td");
                                    td.classList.add("d-td");
                                    var e = document.createElement('a');
                                    e.href = 'https://intranet.ylrus.com/nlogjc/job_form.php?jobID='+response.rows[i].PK;
                                    e.title = response.rows[i].r.jobInsertBy.t;
                                    e.target="_blank"
                                    e.appendChild(document.createTextNode(response.rows[i].PK));
                                    td.appendChild(e);
                                    tr.appendChild(td);
                                    table.appendChild(tr);
                                    if(!!response.rows[i].r.jobCntNo){
                                        td = document.createElement("td");
                                        td.innerHTML = response.rows[i].r.jobMasterBLNumber.t;
                                        td.title = response.rows[i].r.jobPOL.v+' '+response.rows[i].r.jobShipmentDate.t+'-'+response.rows[i].r.jobPOD.v+' '+response.rows[i].r.jobETAPort.t
                                        tr.appendChild(td);
                                        td = document.createElement("td");
                                        td.innerHTML = response.rows[i].r.jobProfitID.t;
                                        tr.appendChild(td);
                                        td = document.createElement("td");
                                        var includCntr = arr.filter(elem => response.rows[i].r.jobCntNo.t.includes(elem)).length;
                                        td.innerHTML = includCntr + ' из ' + response.rows[i].r.jobCntNo.t.split(',').length;
                                        td.title = arr.filter(elem => response.rows[i].r.jobCntNo.t.includes(elem)).join(' ');
                                        cntrs=cntrs+response.rows[i].r.jobCntNo.t;
                                        tr.appendChild(td);
                                    }else{
                                        td = document.createElement("td");
                                        td.innerHTML = 'ошибка';
                                        tr.appendChild(td);
                                    }
                                }
                                td.setAttribute('style','border-bottom-width : 3px;');
                                var div = document.getElementById('description');
                                if (div) {
                                    div.appendChild(table);
                                }
                                xhrReq(index+1)
                            }
                        });
                    })();
                }else{
                    console.log('в коментах нет контенера')
                }
                var AWB = document.getElementById('invComment').value.match(/\d{3}-\s*\d{4} ?\d{4}/g)
                if (!!AWB && AWB.length){


                    //alert(AWB.length)
                    block.style.display = 'block';
                    (function xhrReq(index) {
                         index = index || 0;

                        if(index < 0 || index >= AWB.length) {
                            return;
                        }
                        //return xhrReq(index+1);

                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "https://intranet.ylrus.com/nlogjc/job_list.php?DataAction=json&offset=0&noCache=1&rnd=36319&job_jobMasterBLNumber="+AWB[index].replace(' ',''));
                        xhr.send();
                        xhr.addEventListener("readystatechange", function () {
                            console.log(this.readyState);

                            if (this.readyState === 4 ) {
                                block.style.display = 'none';
                                var response=JSON.parse(this.responseText);
                                var rows = response.rows.length;
                                if(response.nTotalRows==0){
                                    if (!confirm('Нет работ для '+AWB[index]+', продолжить?')) return;


                                }
                                table.setAttribute("border", "1px");
                                table.setAttribute("width", "100%");
                                for (var i = 0; i < rows; i++) {
                                    tr = document.createElement("tr");
                                    switch(response.rows[i].r.staTitleLocal.t) {
                                        case 'Активна':
                                            tr.style.backgroundColor="#fcfcee";
                                            break;
                                        case 'Закрыта':
                                            tr.style.backgroundColor="#FFA07A";
                                            break;
                                        case '(черновик)':
                                            tr.style.backgroundColor="#EEE";
                                            break;
                                    }
                                    td = document.createElement("td");
                                    td.innerHTML = response.rows[i].r.jobCustomerID.t; //пишем в нее текст
                                    td.setAttribute('style', ' cursor: pointer')
                                    td.onclick = function copyDivToClipboard(elem) {
                                        var range = document.createRange();
                                        range.selectNode(this.parentNode.children[1].firstChild);
                                        window.getSelection().removeAllRanges();
                                        window.getSelection().addRange(range);
                                        document.execCommand("copy");
                                        this.nextSibling.classList.add('copied');
                                        console.log(elem)
                                        setTimeout(function() {
                                            console.log(this)
                                            window.getSelection().removeAllRanges();
                                        }, 200);
                                    }
                                    tr.appendChild(td);
                                    td = document.createElement("td");
                                    var e = document.createElement('a');
                                    e.href = 'https://intranet.ylrus.com/nlogjc/job_form.php?jobID='+response.rows[i].PK;
                                    e.target="_blank"
                                    e.title = response.rows[i].r.jobInsertBy.t;
                                    e.appendChild(document.createTextNode(response.rows[i].PK));
                                    td.appendChild(e);
                                    tr.appendChild(td);
                                    table.appendChild(tr);
                                    if(!!response.rows[i].r.jobCntNo){
                                        td = document.createElement("td");
                                        td.innerHTML = response.rows[i].r.jobMasterBLNumber.t;
                                        td.title = response.rows[i].r.jobBLNumber.t;
                                        tr.appendChild(td);

                                    }else{
                                        td = document.createElement("td");
                                        td.innerHTML = 'ошибка';
                                        tr.appendChild(td);
                                    }
                                }
                                var div = document.getElementById('description');
                                if (div) {
                                    div.appendChild(table);
                                }
                                xhrReq(index+1)

                            }
                        });
                    })();
                }else{
                    console.log('в коментах нет AWB')
                }
                var auto = document.getElementById('invComment').value.match(/[авекмнорстухabekmhopctyx](\d{3})[авекмнорстухabekmhopctyx]{2}/i)
                if (auto){

                    //alert(auto)
                    block.style.display = 'block';
                    (function xhrReq(index) {


                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "https://intranet.ylrus.com/nlogjc/job_list.php?DataAction=json&offset=0&noCache=1&rnd=36319&job_jobCarNo="+auto[1]);
                        xhr.send();
                        xhr.addEventListener("readystatechange", function () {
                            if (this.readyState === 4 ) {
                                block.style.display = 'none';
                                var response=JSON.parse(this.responseText);
                                var rows = response.rows.length;
                                if(response.nTotalRows==0){
                                    alert('Нет работ для '+auto[0])
                                }
                                table.setAttribute("border", "1px");
                                table.setAttribute("width", "100%");
                                console.log(auto[0])

                                for (var i = 0; i < rows; i++) {
                                    console.log(response.rows[i].r.jobCarNo.t)
                                    if(rus_to_latin(auto[0])==rus_to_latin(response.rows[i].r.jobCarNo.t)){
                                        tr = document.createElement("tr");
                                        switch(response.rows[i].r.staTitleLocal.t) {
                                            case 'Активна':
                                                tr.style.backgroundColor="#fcfcee";
                                                break;
                                            case 'Закрыта':
                                                tr.style.backgroundColor="#FFA07A";
                                                break;
                                            case '(черновик)':
                                                tr.style.backgroundColor="#EEE";
                                                break;
                                        }
                                        td = document.createElement("td");
                                        td.innerHTML = response.rows[i].r.jobCustomerID.t;
                                        td.setAttribute('style', ' cursor: pointer')
                                        td.onclick = function copyDivToClipboard(elem) {
                                            var range = document.createRange();
                                            range.selectNode(this.parentNode.children[1].firstChild);
                                            window.getSelection().removeAllRanges();
                                            window.getSelection().addRange(range);
                                            document.execCommand("copy");
                                            this.nextSibling.classList.add('copied');
                                            console.log(elem)
                                            setTimeout(function() {
                                                console.log(this)
                                                window.getSelection().removeAllRanges();
                                            }, 200);
                                    }
                                        tr.appendChild(td);
                                        td = document.createElement("td");
                                        var e = document.createElement('a');
                                        e.href = 'https://intranet.ylrus.com/nlogjc/job_form.php?jobID='+response.rows[i].PK;
                                        e.target="_blank"
                                        e.title = response.rows[i].r.jobInsertBy.t;
                                        e.appendChild(document.createTextNode(response.rows[i].PK));
                                        td.appendChild(e);
                                        tr.appendChild(td);
                                        table.appendChild(tr);

                                        if(!!response.rows[i].r.jobCarNo){
                                            td = document.createElement("td");
                                            td.innerHTML = response.rows[i].r.jobWayBillNumber.t;
                                            td.title = response.rows[i].r.jobPrcNo.t;
                                            tr.appendChild(td);
                                            td = document.createElement("td");
                                            td.innerHTML = (!!response.rows[i].r.jobWayBillDate.t?response.rows[i].r.jobWayBillDate.t:response.rows[i].r.jobShipmentDate.t);
                                            tr.appendChild(td);
                                        }else{
                                            td = document.createElement("td");
                                            td.innerHTML = 'ошибка';
                                            tr.appendChild(td);
                                        }
                                    }
                                }
                                var div = document.getElementById('description');
                                if (div) {
                                    div.appendChild(table);
                                }

                            }
                        });
                    })();
                }else{
                    console.log('в коментах нет auto')
                }
            }
        });
    }
};
document.onkeydown = function(e) {
    if (e.shiftKey && e.ctrlKey && e.keyCode == "A".charCodeAt()) {
        var rows= document.querySelectorAll("td.el-text.inv_entitylist_invTitle")

        for (var i = 0; i < rows.length; i++) {
            console.log(rows[i].innerHTML)
            rows[i].innerHTML=rows[i].innerHTML.replace('frm_invoice.php?invID',"/nlogjc/supinvoice_form.php?sinID")

        }
    }
    if ( e.ctrlKey && e.keyCode == "S".charCodeAt()) {
        event.preventDefault();
        setTimeout(function(){
            location.reload();
        }, 1000);
        save();
    }
    if ( e.ctrlKey && e.keyCode == "D".charCodeAt()) {
        event.preventDefault();
        var currentDate = new Date;
        $(".date#invPaymentDate").datepicker("setDate",currentDate.asString());
        save();

    }
}
var searchJID = function(){
    var $mapper = $('#jit')
    var oGrid = $mapper.eiseGrid('getGridObject');
    oGrid.reset();
    oGrid.spinner();
    var strURL = '/nlogjc/supinvoice_form.php?sinID='+doc.itemID+"&DataAction=searchJID";
    $.getJSON(strURL, function(response){
        oGrid.reset();
        if(response.status=='ok'){
            oGrid.fill(response.data)
            for (let index = 0; index < oGrid.tbodies.length; ++index) {oGrid.tbodies[index].childNodes[1].cells[1].childNodes[1].childNodes[0].href=oGrid.tbodies[index].childNodes[1].cells[1].childNodes[1].childNodes[0].href.replace('treasury','nlogjc')
            }
        }

    });

}
function cnt(data) {
	let	contr = data.match(/[A-Z]{3}U\d{7}/g)
	if (contr){
        var i = 0, current, length = contr.length, Checked = [];
        for (; i < length; i++) {
        current = contr[i];
        if(CheckContNumber(current)){
            Checked.push(current);
      }
    }
    return Checked;
	};
}
function CheckContNumber(cntr){
    if(/[A-Z]{3}U\d{7}/.test(cntr)){
        var a = '0123456789A-BCDEFGHIJK-LMNOPQRSTU-VWXYZ';
        var c=0;
                            console.log(cntr)
        var arr=cntr.match(/./g);
        for (var i = 0; i < 10; i++) {
            c=c+Math.pow(2,i)*a.search(arr[i])
        }
        return 	c%11%10==cntr.slice(-1);
    }else{
        return false
    }
}
//'а','в','е','к','м','н','о','р','с','т','у','х'
//'a','b','e','k','m','h','o','p','c','t','y','x'
function rus_to_latin ( str ) {
    var ru = {
        'а': 'a', 'в': 'b', 'е': 'e', 'к': 'k', 'м': 'm', 'н': 'h', 'о': 'o', 'р': 'p', 'с': 'c', 'т': 't', 'у': 'y', 'х': 'x'
    }, n_str = [];
    str = str.replace(/[^а-яa-z0-9]/ig, '').match(/[авекмнорстухabekmhopctyx]\d{3}[авекмнорстухabekmhopctyx]{2}/i);
    str=str?str[0]:'';
    for ( var i = 0; i < str.length; ++i ) {
        n_str.push(
            ru[ str[i] ]
            || ru[ str[i].toLowerCase() ] == undefined && str[i]
            || ru[ str[i].toLowerCase() ].replace(/^(.)/, function ( match ) { return match.toUpperCase() })
        );
    }
                        //console.log(n_str.join(''))
    return n_str.join('').toUpperCase();
}

