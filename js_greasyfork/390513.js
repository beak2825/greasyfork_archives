// ==UserScript==
// @name NLOGJC
// @namespace NLOGJC map
// @version 1.2
// @description Для мапинга счетов!
// @include https://intranet.ylrus.com/nlogjc*
// @downloadURL https://update.greasyfork.org/scripts/390513/NLOGJC.user.js
// @updateURL https://update.greasyfork.org/scripts/390513/NLOGJC.meta.js
// ==/UserScript==

window.onload = function() {

    let result = [];
    var GHQ=document.querySelectorAll("#ghq_report > tbody > tr")
    for (var i = 0; i < GHQ.length; i++) {
        var GHQtext = GHQ[i].children[0].innerText
        var GHQact = GHQ[i].children[2].innerText
        //console.log(GHQ[i])
        if (GHQtext != "" && /Ocean/.test(GHQtext) ) {
            GHQ[i].style.backgroundColor = "#dff0d8";
        }else if (GHQtext != "" &&  /Air/.test(GHQtext) ) {
            GHQ[i].style.backgroundColor = "PaleTurquoise";
        }else if (GHQtext != "" &&  /Land/.test(GHQtext) ) {
            GHQ[i].style.backgroundColor = "LightYellow";

        }
    }

    var itog=document.querySelectorAll("#jit > table > tbody")
    if(itog){
        // console.log( document.querySelectorAll("#jit > table > tbody"));
        if (itog.length>0){
            var amm=0
            for (var jj = 4; jj < itog.length; jj++) {
                var CM1_Rep=itog[jj].rows[0].querySelector("td.jit-jitActCM1_Rep")?itog[jj].rows[0].querySelector("td.jit-jitActCM1_Rep"):itog[jj].rows[0].querySelector("td.jit-jitEstCM1_Rep")
                //console.log(CM1_Rep)
                amm+=parseFloat(CM1_Rep.firstChild.value.replace(",", ''))
            }
        }
        if(amm<0&&document.querySelector("#btn_8_0_20"))document.querySelector("#btn_8_0_20").style.color="red";
    }
    if(aclOldStatusID.value<30){
        [1.5,5,7.5].forEach(function(item) {
            $('#jobForm #fldsJIT.hasButtons > legend').append('<button class="btn" type="button">'+item+'</button>');
        });
    }
    $('.btn').click(function(){
        var ammSel=0
        $('#jit .eg-data.eg-selected [name="jitEstIncome[]"]').each(function(index,data) {
            ammSel+=parseFloat(data.value.replace(",", ''))
        });
        if (ammSel==0) {alert('Ничего не выделено');return false;}
        var comsa= ammSel*this.innerHTML/100
        console.log(jobID.value)
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://intranet.ylrus.com/nlogjc/job_form.php");
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send("DataAction=update_jit&jitGUID=&jitJobID="+encodeURI(jobID.value)+"&jitProductID=14&\
jitTitle="+encodeURI('Вознаграждение экспедитора '+this.innerHTML+'%')+"&\
jitIncomeOptions=&jitBaseUOMID=&jitEstIncomeCurr=LOC&jitEstIncomePrice="+comsa+"&jitEstQuantity=1&jitEstIncome="+comsa+"&jitEstIncomeVAT=20&jitEstIncomeROE=1&jitEstCostCurr=none&\
jitEstCostPrice=&jitEstCostQuantity=&jitEstCost=0.00&jitEstCostVAT=0&jitEstCostROE=&jitExpectedSupplierID=&jitExpectedSupplierID_text=&jitEstIncome_Rep="+comsa+"&\
jitEstCost_Rep=0&jitEstCM1_Rep="+comsa+"&jitQtdIncomeCurr=LOC&jitQtdIncomePrice="+comsa+"0&jitQtdQuantity=1.000&jitQtdIncome="+comsa+"&jitQtdIncomeVAT=20&jitQtdIncomeROE=1");
        xhr.addEventListener("readystatechange", function () {
            console.log(this.readyState);
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {
                    location.reload();
                }
            };
        })
    });

    var btn = document.createElement('input');//создаём нашу кнопку
    btn.type = 'button';
    btn.value = 'примапить по сумме';
    btn.setAttribute("id","btn_map");
    if (document.querySelector("#frmMapper > div.search_results > div.buttons")) document.querySelector("#frmMapper > div.search_results > div.buttons").appendChild(btn)

    function myBtn() {
        var click= 0;
        var summa = document.querySelector("#sinRemains").value.replace(",", '')
        var arr = []
        var jit = document.querySelectorAll("#jit > table > tbody > tr > td > div > table > tbody")
        for (var x = 4; x < jit.length; x++) {
            arr.push(jit[x].rows[0].cells[0].children[4].value);
            //console.log(jit[x].rows[0].cells[0].children[4])
        }
        var alength = arr.length
        var target = document.getElementsByClassName('eg-container')[1];
        if (alength>18) {
            console.log('слишком много строк')

            for (var ii=3; ii < document.getElementsByClassName('eg-container')[1].rows.length; ii++) {
                //console.log((document.getElementById('sitAmount').value.replace(",", '')/3).toFixed(2)+' - ' +((document.getElementsByClassName('eg-container')[1].rows[ii].cells[0].getElementsByTagName('input')[4].value)/3).toFixed(2))

                if((document.getElementById('sitAmount').value.replace(",", '')/3).toFixed(2)==(document.getElementsByClassName('eg-container')[1].rows[ii].cells[0].getElementsByTagName('input')[4].value/3).toFixed(2)){
                    ++click;
                    console.log('click');
                    document.getElementsByClassName('eg-container')[1].rows[ii].cells[0].lastChild.click();
                    break;
                    return click;
                }
            }
        }else{
            for(i=Math.pow(2,alength)-1; i>=0; i--) {
                var b = i.toString(2)
                while(b.length < alength+1) {b = '0' + b}
                //var farr = arr.filter( function(item, n, arr) {return b.charAt(alength-n) > 0})
                var result = arr.reduce(function(sum, current, n) { return sum*1 + current*b.charAt(alength-n)}, 0);
                if ((summa/3).toFixed(2)==(result/3).toFixed(2)) break;
            }
            console.log(b)
            for (var i = b.length; i > 0; --i){
                // console.log(b[i])
                // console.log(target.rows[alength-i+4].cells[0].lastChild);
                if (b[i]==1) target.rows[alength-i+4].cells[0].lastChild.click();
                ++click;
            }
            return b;
        }
        if (click==0){
            var arrAWB=document.getElementById('invComment').value.match(/(\d{4})\/\d{3}-/)
            if (!arrAWB) arrAWB=document.getElementById('invComment').value.match(/(BNA0\d+)/)
            for (let ii=3; ii < target.rows.length; ii++) {
                if(document.getElementById('sitAmount').value.replace(",", '')==target.rows[ii].cells[0].getElementsByTagName('input')[3].value){
                    if(-1 < target.rows[ii].innerHTML.search(arrAWB[1])){
                        target.rows[ii].cells[0].lastChild.click();
                        var elem=target.rows[ii].childNodes[11].childNodes[1]
                        elem.innerHTML=elem.innerHTML.replace(arrAWB[1],"<span style='background:SkyBlue;'>"+arrAWB+"</span>")
                        click++;
                    }
                }
            }

            if(click==0){
                for (let ii=3; ii < target.rows.length; ii++) {
                    if(document.getElementById('sitAmount').value.replace(",", '')==target.rows[ii].cells[0].getElementsByTagName('input')[3].value){
                        target.rows[ii].cells[0].lastChild.click();
                        click++;
                        break;
                    }
                }
            }
            if(click==0)console.log('не найдено')
        }
    };




    var HeadIcon=document.querySelector("#jit > table > thead > tr > th.jit-invStatusIcon")
    if(HeadIcon){
        HeadIcon.style.cursor='pointer';
        HeadIcon.onclick = function (){
            var elems = $('#jit .jit-invStatusIcon.positive');
            console.log( elems.length);
            for (var i = 0; i < elems.length; i++){
                if( elems[i].children[0].value=='<img src="images/red.png"/>'){
                    elems[i].previousElementSibling.children[1].click();
                }
            }
        }
    }
    //var ContainerBody = document.querySelectorAll("#jcn > table > tbody")
    //console.log(ContainerBody.length);
    //for (var j = 4; j < ContainerBody.length; j++) {
     //   ContainerBody[j].children[0].children[0].lastChild.setAttribute('style',"position:absolute; display:block");
     //   ContainerBody[j].children[0].children[0].setAttribute('style',"position:relative");
      //  var Container = ContainerBody[j].children[0].children[0]//.lastChild//.innerText
      //  var a = document.createElement('a')
      //  a.setAttribute('class',"fa fa-search");
     //   a.setAttribute('aria-hidden',"true");
     //   a.setAttribute('target',"_blank");
     //   a.setAttribute('style',"position:absolute;top:4px;right:0;");
      //  a.href = 'https://intranet.ylrus.com/treasury/frm_search.php?strSearch='+(Container.lastChild.innerText?Container.lastChild.innerText:Container.lastChild.value);
     //   Container.appendChild(a)
        // Container.innerHTML +='<a class="fa fa-search" aria-hidden="true" href="https://intranet.ylrus.com/treasury/frm_search.php?strSearch='+Container.innerHTML+'" target="_blank" style=" float: right"></a>'
    //}

    document.onkeydown = function(e) {

        if ( e.ctrlKey && e.keyCode == "A".charCodeAt()) {
            event.preventDefault();
            setCost();
        }
        if ( e.ctrlKey && e.keyCode == "S".charCodeAt()) {
            event.preventDefault();
            searchJob();
        }
    }

    if($('#aclOldStatusID')[0].value<27){
        $('#fldsJIT .eg-button-add').click(function(){
            mapItems2();
        });
    }

    function mapItems2(){
        // alert($("#sinMainData").offset().top);

        if(!this.mapperHTML){
            var sinMapperTpl = $('#sinmapper')[0];
            this.mapperHTML = (sinMapperTpl ? sinMapperTpl.outerHTML : null);
            $(sinMapperTpl).remove();
        }

        var $mapper = $(this.mapperHTML)
        $mapper.dialog({
            width: '80%',
            height: 540,
            /*
            position: [$("#sinMainData").offset().left + $("#sinMainData").outerWidth(true)+5
                , $("#sinMainData").offset().top-10 ],
                */
            open: function(){
                $mapper.eiseIntraForm();
                //$mapper.find('#jitExpectedSupplierID')[0].checked = true;
                var $grid = $mapper.find('.eiseGrid')
                .eiseGrid();
                $grid.eiseGrid('height', 400);
                $grid.find('th.jit-jitCheckbox').css('cursor', 'pointer').click(function(ev){
                    $grid.find('.eg-data input[name="jitCheckbox_chk[]"]').each(function(){
                        this.click();
                    })
                });
            },
            close: function(){
                $mapper.remove();
            },
            modal: true
        });


        $mapper.find('#strKeys').keydown( function(event) { if(event.which==9){

            var replaceString = String.fromCharCode(9);

            if (window.getSelection) {
                // not IE case
                var txtArea = this;
                var startPos = txtArea.selectionStart;
                var endPos = txtArea.selectionEnd;
                var scrollTop = txtArea.scrollTop;
                txtArea.value = txtArea.value.substring(0, startPos) + replaceString + txtArea.value.substring(endPos, txtArea.value.length);
                txtArea.focus();
                txtArea.selectionStart = startPos + replaceString.length;
                txtArea.selectionEnd = startPos + replaceString.length;

            } else if (document.selection && document.selection.createRange && document.selection.type != "None") {
                // IE case
                var range = document.selection.createRange();
                var isCollapsed = range.text == '';
                range.text = replaceString;

                if (!isCollapsed)  {
                    range.moveStart('character', -replaceString.length);
                    range.select();
                }
            }

            event.preventDefault();
            return false;

        }else

            if(event.which==10 || (event.keyCode==13 && (event.ctrlKey || event.metaKey))) {
                searchJID();
                return false;
            }
                                                           else
                                                               return true;
                                                          });

        $mapper.find('#jitExpectedSupplierID').change(function(){

            searchJID();

        })

        $mapper.find('#btnSearch').click(function(){
            searchJID();
            return false;
        })

        $mapper.find('#btnClose').click(function(){
            $mapper.dialog('close');
        })

        $mapper.find('#btn_map').click(function(){
            myBtn();
            return false;
        })

        $mapper.find('#sitAmount').val($('#sinRemains').val());

        searchJID()

    }


    function setCost(){
        var click= 0;
        var target = document.getElementsByClassName('eg-container')[1];
        var arr=document.getElementById('invComment').value.match(/(\d{4})\/\d{3}-/)
        if (!arr) arr=document.getElementById('invComment').value.match(/(BNA0\d+)/)
        for (let ii=3; ii < target.rows.length; ii++) {
            if(document.getElementById('sitAmount').value.replace(",", '')==target.rows[ii].cells[0].getElementsByTagName('input')[3].value){
                if(-1 < target.rows[ii].innerHTML.search(arr[1])){
                    target.rows[ii].cells[0].lastChild.click();
                    var elem=target.rows[ii].childNodes[11].childNodes[1]
                    elem.innerHTML=elem.innerHTML.replace(arr[1],"<span style='background:SkyBlue;'>"+arr+"</span>")
                    click++;
                }
            }
        }

        if(click==0){
            for (let ii=3; ii < target.rows.length; ii++) {
                if(document.getElementById('sitAmount').value.replace(",", '')==target.rows[ii].cells[0].getElementsByTagName('input')[3].value){
                    target.rows[ii].cells[0].lastChild.click();
                    click++;
                    break;
                }
            }
        }
        if(click==0)alert('не найдено')
        // $('#sinmapper th.jit-jitCheckbox').click();
        var jitActCost = document.getElementsByTagName('tfoot')[1].getElementsByTagName('div')[0].innerHTML.replace(",", '');
        if(jitActCost==document.getElementById('sitAmount').value.replace(",", '')){

        }

    }

    var sinRemains = document.getElementById('sinRemains')
    var btn_123_27_30 = document.getElementById('btn_123_27_30')
    if(sinRemains && btn_123_27_30){
        if (sinRemains.value!=0) {
            setTimeout(() =>  { mapItems2(); searchJob(); }, 500);

        }
    }
    var money = document.querySelector("#iit > table > tfoot > tr > td.iit-iitAmountNet.eg-money > div")
    var UsdEx = document.querySelector("#nLocUsdExchangeRate")
        if(money && UsdEx){
        if (money.innerHTML!='') {
            document.querySelector("#iit > table > tfoot > tr > td.eg-totals-caption").innerHTML=document.querySelector("#iit > table > tfoot > tr > td.eg-totals-caption").innerHTML+' '+((money.innerHTML.replace(/,/g, ''))/UsdEx.innerHTML).toFixed(2)+' $';
        }
    }
    function searchJob(){
        if (document.getElementById("invComment")) {
            document.getElementById('strKeys').value=document.getElementById('invComment').value.match(/\d{3}-\d{8}/)
            var arr = cnt(document.getElementById('invComment').value)
            var click= 0;
            var td = "";
            var cntrs= "";
            var jobs ="";
            if (arr){
                (function xhrReq(index) {
                    index = index || 0;
                    if(index < 0 || index >= arr.length) {
                        return;
                    }
                    if (-1 < cntrs.search(arr[index])){
                        return xhrReq(index+1);
                    }
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", "https://intranet.ylrus.com/nlogjc/job_list.php?DataAction=json&offset=0&noCache=1&rnd=36319&job_jobFlagMyItems=&job_jobFlagMyItems=&job_jobCntNo="+arr[index]);
                    xhr.send();
                    xhr.addEventListener("readystatechange", function () {
                        if (this.readyState === 4 ) {
                            var response=JSON.parse(this.responseText);
                            var rows = response.rows.length;
                            for (var i = 0; i < rows; i++) {
                                if(!!response.rows[i].r.jobCntNo){
                                    cntrs=cntrs+response.rows[i].r.jobCntNo.t;
                                    jobs = jobs + response.rows[i].PK+'\n';
                                }
                            }
                            document.getElementById('strKeys').value=jobs;

                            var target = document.getElementsByClassName('eg-container')[1];
                            var observer = new MutationObserver(function(mutations) {
                                mutations.forEach(function(mutation) {
                                    mutation.addedNodes.forEach(function(node) {
                                        //console.log(node);
                                        for (var j = 0; j <arr.length; ++j) {
                                            if(-1 < node.innerHTML.search(arr[j])){
                                                var elem=node.childNodes[1].childNodes[11].childNodes[1]
                                                elem.innerHTML=elem.innerHTML.replace(arr[j],"<span style='background:SkyBlue;'>"+arr[j]+"</span>")
                                                if(document.getElementById('sitAmount').value.replace(",", '')==node.childNodes[1].cells[0].getElementsByTagName('input')[3].value&&click==0){
                                                    node.childNodes[1].cells[0].lastChild.click();
                                                    console.log(node.childNodes[1].cells[0]);
                                                    ++click;
                                                    break;
                                                }
                                            }
                                        }
                                        //console.log(document.getElementsByClassName('eg-container')[1].rows.length)
                                        console.log(click);
                                        if(click==0){
                                            click=myBtn()
                                        }
                                    });
                                });
                                //observer.disconnect();
                                //   console.log('disconnect');
                                //setCost();
                                //   setTimeout(() => setCost(observer), 100);
                            });
                            //console.log('disconnect');
                            //observer.disconnect();
                            //console.log('осталось', observer.takeRecords());
                            // настраиваем наблюдатель
                            var config = { attributes: false, childList: true, characterData: true}//, subtree: true
                            // передаем элемент и настройки в наблюдатель
                            observer.observe(target, config);
                            xhrReq(index+1);
                        };
                    });
                })();



            }else{
                console.log('в коментах нет контенера')
            }
        }
    };

    function cnt(data) {
        var	cntr = data.match(/[A-Z]{3}U\d{7}/g)
        if (cntr){
            var i = 0, current, length = cntr.length, Checked = [];
            for (; i < length; i++) {
                current = cntr[i];
                if(CheckContNumber(current)){
                    Checked.push(current);
                }
            }
            return Checked;
        };
    }
    function CheckContNumber(cnt){
        var a = '0123456789A-BCDEFGHIJK-LMNOPQRSTU-VWXYZ';
        var c=0;
        var arr=cnt.match(/./g);
        for (var i = 0; i < 10; i++) {
            c=c+Math.pow(2,i)*a.search(arr[i])
        }
        return 	c%11%10==cnt.slice(-1);
    }
}