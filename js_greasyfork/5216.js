	

    // ==UserScript==
    // @name        Entre.portal.+
    // @namespace   entre.portal.plus
    // @description Gör hantverksdata portalen möjlig att använda sig utav genom att skriva till arbetsbeskrivningen i orderlistan. Dessutom fler förbättringar.
    // @include     *portal.hantverksdata.*
    // @version     0.8.6
    // @grant       GM_AddStyle
    // @require     http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/5216/Entreportal%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/5216/Entreportal%2B.meta.js
    // ==/UserScript==
    var numOrders = 0;
    var debug = 1;
	
    $(document).ready(function () {
           
        log('Page completed loading. window.location=' + window.location);
        log('Initializing idle timer & main program flow timer.');

        $(this) .mousemove(function (e) {
            log('Mouse event, idle time counter set to 0. Counter was ' + idleTime);
            idleTime = 0;
        });
        $(this) .keypress(function (e) {
            log('Keypress event, idle time counter set to 0. Counter was ' + idleTime);
            idleTime = 0;
        });
        log("window.location: " + window.location.href);
        if ((window.location.href == 'http://portal.hantverksdata.se/') || (window.location.href == 'https://portal.hantverksdata.se/') || (window.location.href == 'https://portal.hantverksdata.se') || (window.location.href == 'portal.hantverksdata.se')) {
            log('Loaded main page (' + window.location + ') Getting total number of orders in your list.');
            while (true) {
                var timeout = window.setTimeout(function () {
                    numOrders = document.getElementById('prt_prt_mcph_OrderTotalCountPanel').innerHTML;
                }, 8000);
                var checkOneMore = true;
                log('Checking if item recieved variable ('+numOrders+') is purely a number.');
                if (isdigit(numOrders) == true) {
                     if (numOrders == 0 || checkOneMore) {
                         checkOneMore = false;
                         log('Number is zero. Waiting 5 more seconds and checking again before giving up.');
                         timeout = window.setTimeout(function () {
                             numOrders = document.getElementById('prt_prt_mcph_OrderTotalCountPanel').innerHTML;
                         }, 5000);
                     }
                    log("It is a number, " + numOrders + ", saving in cookie 'numOrders' and breaking out of loop");
                    setCookie('numOrders', numOrders, 364);
                    break;
                }
                else {
                    log("Error: Number of orders loaded is not a digit ! '" + numOrders + "'");        
                }
            }
            log('Done with all jobs on this page. Idling.');
        }
        else if (/\bOrderList\.aspx\b/.test(window.location)) {
			document.title = "Order List";
            log("Loading order list");
            //Table width stops table from wobbling around when text is changing.
            var fixTableWidth = document.getElementById('prt_mcph_OrderListGrid_ctl00');
            fixTableWidth.childNodes[0].childNodes[3].style = 'width:70%';
            var OrderRowButtonStr = '<div class="left"><div id="prt_ToolBarButtonsContentPlaceHolder_toolbar_Edit_panel"><img onmouseup="$("#toolbar_Edit").click()" id="toolbar_Edit2" onclick="" onmousedown="document.cookie=\'goOrderRows=yes;expires=52223232\'" class="ToolbarButton" src="Images/toolbarIcons/000-cart.png" style="height:32px;width:32px;"></div></div>';
            var EditButton = document.getElementById('prt_ToolBarButtonsContentPlaceHolder_toolbar_Edit_panel');
            var divLeft = EditButton.parentNode.cloneNode();
            var divOrderRowButton = EditButton.cloneNode();
            var imgOrderRow = EditButton.childNodes[0].cloneNode();
            imgOrderRow.setAttribute('onclick', '$(\'#toolbar_Edit\').click()');
            imgOrderRow.setAttribute('onmousedown', 'document.cookie=\'goOrderRows=yes;expires=52223232\'');
            imgOrderRow.setAttribute('src', 'Images/toolbarIcons/000-cart.png');
            imgOrderRow.setAttribute('class', 'ToolbarButton');
            divOrderRowButton.appendChild(imgOrderRow);
            divLeft.appendChild(divOrderRowButton);
            EditButton.parentNode.appendChild(divLeft);

			var baknumOrders=displayAlertAllOrders();
			var anchors = document.getElementsByTagName('tr');
			numOrders=0;
			for(var i = 0; i < anchors.length; i++) {
					var cur= anchors[i].getAttribute('id');
					if (/.*prt_mcph_OrderListGrid_ctl00__.*/.test(cur)) {
							numOrders++;
					}
			}
			if(numOrders == 0){
				baknumOrders=numOrders;
			}
            log("numOrders:"+numOrders);
            for (var i = 1; i < (numOrders + 1); i++) {
                var idec = (i - 1);
     
                var trow = document.getElementById('prt_mcph_OrderListGrid_ctl00__' + idec);
                var rowArray = trow.childNodes;
                var orderNumber = rowArray[2].innerHTML;
                var orderObject = rowArray[3];
                var orderName = orderObject.innerHTML;
                var beskrivning = 'Arbetsbeskrivning: Finns ej / ej hämtats.';
                var Totalen = '';
                orderObject.setAttribute('name', orderName);
                beskrivning = getCookie(orderNumber);
               
             //   log('index:'+i+' description:'+beskrivning+' ordernr:'+orderNumber+' orderName:'+orderName);
                if (orderObject.getAttribute('alt') !== '')
                {
                    orderObject.setAttribute('alt', beskrivning);
                    orderObject.style.height = '40px';
                                    orderObject.innerHTML = '<div style=\'width:80%; color:black; font-size:14px;\' onclick=\'this.parentNode.parentNode.click()\'>Märke:'
                        + orderObject.getAttribute('name') + '<br>' + orderObject.getAttribute('alt') + '</div>';
     
                    if (beskrivning !== 'Arbetsbeskrivning: Finns ej / ej hämtats.') {
                        var incthree;
                        incthree = 3 + (i * 3);
                        if (incthree < 10) {
                            incthree = '0' + incthree;
                        }
                        var addInfo = document.getElementById('prt_mcph_OrderListGrid_ctl00_ctl' + incthree + '_Detail' + i + '0__' + (i - 1) + ':0_0') .childNodes[0];
                        addInfo.innerHTML = addInfo.innerHTML + '<div style=\'color:red; font-size:14px;\'> Arbetsbeskrivning:\'' + getCookie(orderNumber) + '</div>';
                    }
                    else {
                        continue;
                    }
                }
            }
        }
        else if (/\bEditOrder\.aspx\?order=\b/.test(window.location)) {
            var curCostumer = document.getElementById('mcph_txt_OR1_Order_MARKE').getAttribute('value');
            log('current order costumer: ' + curCostumer);
            document.cookie = curOrdernr + 'c=' + curCostumer + '; expires=Thu, 18 Dec 2017 12:00:00 GMT';
			         
            var curOrdernr = document.getElementById('HeaderBarContentPlaceHolder_TopicLabel').innerHTML;
            curOrdernr = curOrdernr.substr(7);
            log(curOrdernr);
			
			document.title = "Order:" + curOrdernr + " " + curCostumer;
            log('Loading page EditOrder.aspx. Full location:'+window.location)
     
            var infoID = document.getElementById('mcph_txt_OR1_Order_ORDINFO');
            var info = infoID.innerHTML;
     
            info = info.replace('\n', ' ');
            info = info.replace('\n', ' ');
            info = info.replace('\n', ' ');
            info = info.replace('\n', ' ');
            info = info.replace('\n', ' ');        
     
            log('this order: ' + info);
            if (getCookie('goOrderRows') .length > 0) {
                window.location = 'https://portal.hantverksdata.se/OrderRows.aspx?order=' + curOrdernr;
            }
           
            document.cookie = curOrdernr + '=' + info + '; expires=Thu, 18 Dec 2017 12:00:00 GMT';
            setCookie('"' + index + '"', '"' + info + '"', 1);
        }
        else if (/\bOrderRows\.aspx\?order=\b/.test(window.location)) {
			var ordernr1 = window.location.href.split('=')[1];
			log(ordernr1);
			document.title = "Kundvagn: " + ordernr1 + " " + getCookie(ordernr1 + "c");
            if (getCookie('goOrderRows')) {
                deleteCookie('goOrderRows');
            }
        }
        else if (/\bParticipants\.aspx\?order=\b/.test(window.location)) {
            var classOrder = document.getElementById('HeaderBarContentPlaceHolder_Topiclabel');
            var ordernr = getNthWord(classOrder.innerHTML, 2);
			var ordernr1 = window.location.href.split('=')[1];
			log(ordernr1);
			document.title = "Deltagare: " + ordernr1 + " " + getCookie(ordernr1 + "c");
            var readyButton = document.getElementById('prt_ToolBarButtonsContentPlaceHolder_toolbar_Ready_panel');
            readyButton.setAttribute('onmousedown', 'javascript: document.cookie="' + ordernr + '=0; expires:=-1;"');
        }
		else if (/\TimeRegistration\.aspx\b/.test(window.location)) {
			document.title = "Time Registration";
		}
    });
    function displayAlertAllOrders(){
            var alertOrders = document.getElementsByClassName('rtsLI rtsFirst')[0];
            //mainToolbar
            //var alertOrders = document.getElementById('mainToolbar');
            var str = "";
            var allOrders = document.cookie.split(";");
            allOrders = allOrders.sort();
            var newords = allOrders.sort();
            numOrders = 0;
            for(var x = 0; x < newords.length; x++){
                            nr = newords[x].split('=');
                            nr[0] = nr[0].replace(' ', '');
                            nr[1] = nr[1].replace('=', '');
                            log(nr[0]);
                            if(isdigit(nr[0])){
                                    numOrders++;
                                    var kund = getCookie(nr[0]+'c');
                                    str = str + nr[0] + '\\t\\t (' + kund + ')\\n\\t' + nr[1] + '\\n';
                            }
            }        
            alertOrders.setAttribute('onclick', 'javascript:alert(\'' + str + '\')');
            return numOrders;
     }
    function getNumberOfSavedOrders(){
            var count=0;
            $.each(document.cookie.split(/; */), function()  {
              var splitCookie = this.split('=');
              var curnumber = splitCookie[0].replace(' ', '');
              if(isdigit(curnumber))
                    count++;
            });
            log(count);
            return count;
    }
    function timerIncrement() {
        log('testing');
        var numOrders = document.getElementsByClassName('rtsTxt') [0].innerHTML.substring(5, 7);
        log('numOrders:' + numOrders);
        if (numOrders > numOrdersCompare)
        {
            log('We just got in another job. Check it out.');
        }
        log('We have a total of ' + numOrders + ' orders waiting.');
        setCookie('numOrders', numOrders, 365);
        numOrdersCompare = numOrders;
        idleTime = idleTime + 1;
        log('timerIncrement was called. It get\'s called once a minute, and therefore we can decide how long the idle timer should be.');
        if (idleTime > 19) {
            // 20 minutes
            log('20 minutes has passed');
            window.location.reload();
        }
    }
    function openOrder(index, button) {
        $('#prt_mcph_OrderListGrid_ctl00__' + index) .click();
        $('#' + button) .click();
    }
    function getNthWord(str, n) {
        var m = str.match(new RegExp('^(?:w+W+){' + --n + '}(w+)'));
        return m && m[1];
    }
    function isdigit(string) {
        var ret = /^\d+$/.test(string);
        return ret;
    }
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + d.toGMTString();
        document.cookie = cname + '=' + cvalue + '; ' + expires;
    }
    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + '=');
            if (c_start != - 1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(';', c_start);
                if (c_end == - 1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return '';
    }
    function deleteCookie(cookie) {
        log('Deleting cookie: ' + cookie);
        setCookie(cookie, null, - 1);
    }
	function log(msg){
		if(debug==1){
			console.log(msg);
		}
	}
