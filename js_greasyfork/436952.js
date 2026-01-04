// ==UserScript==
// @name         台灣運彩小工具
// @name:zh-TW   台灣運彩小工具
// @namespace    https://github.com/oxNNxo
// @version      1.1
// @description  用於台灣運彩網頁的小工具。可自動計算收益，自動重新整理網頁，等功能。
// @author       pro1028@PTT
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @match        https://member.sportslottery.com.tw/*
// @icon         https://www.google.com/s2/favicons?domain=sportslottery.com.tw
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436952/%E5%8F%B0%E7%81%A3%E9%81%8B%E5%BD%A9%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/436952/%E5%8F%B0%E7%81%A3%E9%81%8B%E5%BD%A9%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

//可簡易設定參數
var bar_position = 0; //設定綠色列位置 0:懸浮於最上方 1:固定在紅色列下方
var auto_reload = false; //設定自動重新整理 true:是 false:否
var reload_sleeptime = 10; //設定多久重新整理一次 單位:分鐘(運彩網頁設定為閒置二十分鐘自動登出)
var show_bet_list = true;//設定是否開啟顯示投注清單 true:是 false:否
//可簡易設定參數


var $ = window.jQuery;

(function() {
    'use strict';
    $(document).ready(function(){
        setTimeout(async function() {
            var zNode = document.createElement ('div');
            zNode.setAttribute ('id', 'myContainer');
            switch(bar_position){
                case 0:
                    $('body')[0].prepend (zNode)
                    $('#myContainer')[0].setAttribute("style", "background-color:lightgreen;color:black;position:fixed;z-index:2;width:100%;");
                    break
                case 1:
                    document.getElementsByClassName('grid-12')[1].appendChild (zNode)
                    $('#myContainer')[0].setAttribute("style", "background-color:lightgreen;color:black;");
                    break
                default:
                    document.getElementsByClassName('grid-12')[1].appendChild (zNode)
                    $('#myContainer')[0].setAttribute("style", "background-color:lightgreen;color:black;");
                    break
            }

            var inputFormNode = document.createElement('form');
            inputFormNode.setAttribute("id","toolForm");
            inputFormNode.setAttribute("autocomplete","off")
            inputFormNode.setAttribute("onsubmit","return false;")


            var goGHButtonNode = document.createElement('button');
            goGHButtonNode.setAttribute("id", "goGHButton");
            goGHButtonNode.setAttribute("type", "button");
            goGHButtonNode.innerHTML = '前往我的投注紀錄';

			var showGHButtonNode = document.createElement('button');
            showGHButtonNode.setAttribute("id", "showGHButton");
            showGHButtonNode.setAttribute("type", "button");
            showGHButtonNode.innerHTML = '開/關全部注單'

            var printGLButtonNode = document.createElement('button');
            printGLButtonNode.setAttribute("id", "printGLButton");
            printGLButtonNode.setAttribute("type", "button");
            printGLButtonNode.innerHTML = '輸出注單'

            var calGHButtonNode = document.createElement('button');
            calGHButtonNode.setAttribute("id", "calGHButton");
            calGHButtonNode.setAttribute("type", "button");
            calGHButtonNode.innerHTML = '計算總和'

            var textGHNode = document.createElement('span');
            textGHNode.setAttribute("id", "numberGHText");
            textGHNode.innerHTML = 0;

            var sevendaysButtonNode = document.createElement('button');
            sevendaysButtonNode.setAttribute("id", "sevendaysButton");
            sevendaysButtonNode.setAttribute("type", "button");
            sevendaysButtonNode.innerHTML = '過去七天';

            var goTHButtonNode = document.createElement('button');
            goTHButtonNode.setAttribute("id", "goTHButton");
            goTHButtonNode.setAttribute("type", "button");
            goTHButtonNode.innerHTML = '前往交易紀錄'

            var calTHButtonNode = document.createElement('button');
            calTHButtonNode.setAttribute("id", "calTHButton");
            calTHButtonNode.setAttribute("type", "button");
            calTHButtonNode.innerHTML = '計算總和'

            var textTHNode = document.createElement('span');
            textTHNode.setAttribute("id", "numberTHText");
            textTHNode.innerHTML = 0;



            var inputNoNode = document.createElement('input');
            inputNoNode.setAttribute("id", "findNoInput");
            inputNoNode.setAttribute("onkeyup","value=this.value.replace(/[^0-9]/g,'')")
            inputNoNode.setAttribute("maxlength",4)
            inputNoNode.setAttribute("size",6)
            inputNoNode.setAttribute("autocomplete","off")
            inputNoNode.setAttribute("placeholder","賽事編號")


            var findNoButtonNode = document.createElement('button');
            findNoButtonNode.setAttribute("id", "findNoButton");
            findNoButtonNode.setAttribute("type", "button");
            findNoButtonNode.innerHTML = 'Go'
            var auto_buy = false;
            if(auto_buy){
                var targetOddNode = document.createElement('input');
                targetOddNode.setAttribute("id", "targetOddInput");
                targetOddNode.setAttribute("onkeyup","value=this.value.replace(/[^0-9.]/g,'')");
                targetOddNode.setAttribute("maxlength",4);
                targetOddNode.setAttribute("size",6);
                targetOddNode.setAttribute("autocomplete","off");
                targetOddNode.setAttribute("placeholder","目標賠率");

                var targetAmountNode = document.createElement('input');
                targetAmountNode.setAttribute("id", "targetAmountInput");
                targetAmountNode.setAttribute("onkeyup","value=this.value.replace(/[^0-9]/g,'')");
                targetAmountNode.setAttribute("maxlength",6);
                targetAmountNode.setAttribute("size",6);
                targetAmountNode.setAttribute("autocomplete","off");
                targetAmountNode.setAttribute("placeholder","目標數量");

                var confirmCheckNode = document.createElement('input');
                confirmCheckNode.setAttribute("id", "confirmCheck");
                confirmCheckNode.setAttribute("type", "checkbox");

                var confirmLabelNode = document.createElement('label');
                confirmLabelNode.setAttribute("id", "confirmLabel");
                confirmLabelNode.setAttribute("for", "confirmCheck");
                confirmLabelNode.innerHTML = "確定自動投注" ;

                var autoBuyButtonNode = document.createElement('button');
                autoBuyButtonNode.setAttribute("id", "autoBuyButton");
                autoBuyButtonNode.setAttribute("type", "button");
                autoBuyButtonNode.setAttribute("disabled", "disabled");
                autoBuyButtonNode.innerHTML = '開始';
            }


            $('#myContainer')[0].appendChild(inputFormNode);
            $('#toolForm')[0].appendChild(goGHButtonNode);
            $('#toolForm')[0].appendChild(showGHButtonNode);
            $('#toolForm')[0].appendChild(printGLButtonNode);
            $('#toolForm')[0].appendChild(calGHButtonNode);
            $('#toolForm')[0].append('總計：');
            $('#toolForm')[0].appendChild(textGHNode);
            $('#toolForm')[0].append(' | ');
            $('#toolForm')[0].appendChild(sevendaysButtonNode);
            $('#toolForm')[0].append(' | ');
            $('#toolForm')[0].appendChild(goTHButtonNode);
            $('#toolForm')[0].appendChild(calTHButtonNode);
            $('#toolForm')[0].append('總計：');
            $('#toolForm')[0].appendChild(textTHNode);
            $('#toolForm')[0].append(' | ');
            $('#toolForm')[0].appendChild(inputNoNode);
            $('#toolForm')[0].appendChild(findNoButtonNode);
            if(auto_buy){
                $('#toolForm')[0].append(' | ');
                $('#toolForm')[0].appendChild(targetOddNode);
                $('#toolForm')[0].append(' ');
                $('#toolForm')[0].appendChild(targetAmountNode);
                $('#toolForm')[0].appendChild(confirmCheckNode);
                $('#toolForm')[0].appendChild(confirmLabelNode);
                $('#toolForm')[0].appendChild(autoBuyButtonNode);
            }

            $('#goGHButton')[0].addEventListener("click", gamehistory, false);
            $('#showGHButton')[0].addEventListener("click", toggle_detail, false);
            $("#printGLButton")[0].addEventListener("click", showbought, false);
            $('#calGHButton')[0].addEventListener("click", doGHCal, false);
            $('#sevendaysButton')[0].addEventListener("click", sevendays, false);
            $('#goTHButton')[0].addEventListener("click", transactionhistory, false);
            $('#calTHButton')[0].addEventListener("click", doTHCal, false);
            $('#findNoButton')[0].addEventListener("click", findgame, false);

            if(auto_buy){
                $('#confirmCheck')[0].addEventListener("change", confirmcheck, false);
                $('#autoBuyButton')[0].addEventListener("click", autobuy, false);
            }

            if(show_bet_list){
                var printlistdivNode = document.createElement('div');
                printlistdivNode.setAttribute("id", "printListDiv");
                while($('.betslipContainer.collapsed')[0] == undefined)
                    await sleep(100)
                $('.betslipContainer.collapsed')[0].insertBefore(printlistdivNode,$('.betslipTabs')[0].nextSibling)

                var printlistformNode = document.createElement('form');
                printlistformNode.setAttribute("id","printlistForm");
                printlistformNode.setAttribute("autocomplete","off");
                printlistformNode.setAttribute("onsubmit","return false;");

                var printNoCheckNode = document.createElement('input');
                printNoCheckNode.setAttribute("id", "printNoCheck");
                printNoCheckNode.setAttribute("type", "checkbox");

                var printNoLabelNode = document.createElement('label');
                printNoLabelNode.setAttribute("id", "printNoLabel");
                printNoLabelNode.setAttribute("for", "printNoCheck");
                printNoLabelNode.innerHTML = "編號" ;

                var printDateCheckNode = document.createElement('input');
                printDateCheckNode.setAttribute("id", "printDateCheck");
                printDateCheckNode.setAttribute("type", "checkbox");

                var printDateLabelNode = document.createElement('label');
                printDateLabelNode.setAttribute("id", "printDateLabel");
                printDateLabelNode.setAttribute("for", "printDateCheck");
                printDateLabelNode.innerHTML = "日期" ;

                var printTimeCheckNode = document.createElement('input');
                printTimeCheckNode.setAttribute("id", "printTimeCheck");
                printTimeCheckNode.setAttribute("type", "checkbox");

                var printTimeLabelNode = document.createElement('label');
                printTimeLabelNode.setAttribute("id", "printTimeLabel");
                printTimeLabelNode.setAttribute("for", "printTimeCheck");
                printTimeLabelNode.innerHTML = "時間" ;

                var printVsCheckNode = document.createElement('input');
                printVsCheckNode.setAttribute("id", "printVsCheck");
                printVsCheckNode.setAttribute("type", "checkbox");

                var printVsLabelNode = document.createElement('label');
                printVsLabelNode.setAttribute("id", "printVsLabel");
                printVsLabelNode.setAttribute("for", "printVsCheck");
                printVsLabelNode.innerHTML = "組合" ;

                var printVsPCheckNode = document.createElement('input');
                printVsPCheckNode.setAttribute("id", "printVsPCheck");
                printVsPCheckNode.setAttribute("type", "checkbox");

                var printVsPLabelNode = document.createElement('label');
                printVsPLabelNode.setAttribute("id", "printVsPLabel");
                printVsPLabelNode.setAttribute("for", "printVsPCheck");
                printVsPLabelNode.innerHTML = "投手" ;

                var printOptionCheckNode = document.createElement('input');
                printOptionCheckNode.setAttribute("id", "printOptionCheck");
                printOptionCheckNode.setAttribute("type", "checkbox");

                var printOptionLabelNode = document.createElement('label');
                printOptionLabelNode.setAttribute("id", "printOptionLabel");
                printOptionLabelNode.setAttribute("for", "printOptionCheck");
                printOptionLabelNode.innerHTML = "玩法" ;

                var printSelectCheckNode = document.createElement('input');
                printSelectCheckNode.setAttribute("id", "printSelectCheck");
                printSelectCheckNode.setAttribute("type", "checkbox");

                var printSelectLabelNode = document.createElement('label');
                printSelectLabelNode.setAttribute("id", "printSelectLabel");
                printSelectLabelNode.setAttribute("for", "printSelectCheck");
                printSelectLabelNode.innerHTML = "選項" ;

                var printOddCheckNode = document.createElement('input');
                printOddCheckNode.setAttribute("id", "printOddCheck");
                printOddCheckNode.setAttribute("type", "checkbox");

                var printOddLabelNode = document.createElement('label');
                printOddLabelNode.setAttribute("id", "printOddLabel");
                printOddLabelNode.setAttribute("for", "printOddCheck");
                printOddLabelNode.innerHTML = "賠率" ;

                var printListButtonNode = document.createElement('button');
                printListButtonNode.setAttribute("id", "printListButton");
                printListButtonNode.setAttribute("type", "button");
                printListButtonNode.innerHTML = '顯示清單';

                var printListModalNode = document.createElement('div');
                printListModalNode.setAttribute("id", "myModal")
                printListModalNode.setAttribute("class","modal")
                printListModalNode.innerHTML = '<div class="modal-content"><span id="listcontent"></span></div>'

                var copyListButtonNode = document.createElement('button');
                copyListButtonNode.setAttribute("id", "copyListButton");
                copyListButtonNode.setAttribute("type", "button");
                copyListButtonNode.innerHTML = '複製到剪貼簿';

                $('#printListDiv')[0].appendChild(printlistformNode);
                $('#printlistForm')[0].appendChild(printNoCheckNode);
                $('#printlistForm')[0].appendChild(printNoLabelNode);
                $('#printlistForm')[0].appendChild(printDateCheckNode);
                $('#printlistForm')[0].appendChild(printDateLabelNode);
                $('#printlistForm')[0].appendChild(printTimeCheckNode);
                $('#printlistForm')[0].appendChild(printTimeLabelNode);
                $('#printlistForm')[0].appendChild(printVsCheckNode);
                $('#printlistForm')[0].appendChild(printVsLabelNode);
                $('#printlistForm')[0].appendChild(printVsPCheckNode);
                $('#printlistForm')[0].appendChild(printVsPLabelNode);
                $('#printlistForm')[0].appendChild(document.createElement("br"));
                $('#printlistForm')[0].appendChild(printOptionCheckNode);
                $('#printlistForm')[0].appendChild(printOptionLabelNode);
                $('#printlistForm')[0].appendChild(printSelectCheckNode);
                $('#printlistForm')[0].appendChild(printSelectLabelNode);
                $('#printlistForm')[0].appendChild(printOddCheckNode);
                $('#printlistForm')[0].appendChild(printOddLabelNode);
                $('#printlistForm')[0].appendChild(printListButtonNode);
                $('#printListDiv')[0].appendChild(printListModalNode)
                $('.modal-content')[0].appendChild(copyListButtonNode)

                $('#printListButton')[0].addEventListener("click", showbetlist, false);
                $('#copyListButton')[0].addEventListener("click", copyToClipBoard, false);
                for (let checkbox of $('#printlistForm input')){
                    $(checkbox).prop('checked', true)
                }

                var modal = $("#myModal")[0];
                $("#printListButton")[0].onclick = function() {
                  modal.style.display = "block";
                }
                $("#printGLButton")[0].onclick = function() {
                  modal.style.display = "block";
                }
                window.onclick = function(event) {
                  if (event.target == modal) {
                    modal.style.display = "none";
                    $('#listcontent')[0].innerHTML = ''
                    $('#copyListButton')[0].innerHTML = '複製到剪貼簿'
                  }
                }
            }

        },1000);
        if (auto_reload){
            setTimeout(function() {
                location.reload()
            }, reload_sleeptime*60000);
        }
    });
})();
async function sleep(ms = 0) {
	return new Promise(r => setTimeout(r, ms));
}
async function doGHCal() {
	var amount = 0;
    while(1){
		$('.rowsList').find('.tableRow.default').each(function(index){
            let row_amount = this.children[0].children[3].children[0].children[0].previousSibling.data.replace(',','');
            let row_type = this.children[0].children[4].children[0].children[0].previousSibling.data.replace(',','');
            amount += parseInt(row_type) - parseInt(row_amount);
		});
		$('#numberGHText')[0].innerHTML = amount;
		let nowpage = 0;
        if($('.btn-numbered-page.active')[0]!=undefined)
			nowpage = $('.btn-numbered-page.active')[0].children[0].innerHTML;
		if($('.btn-next-page.disabled')[0]!=undefined || $('.btn-next-page')[0]==undefined){
			$('#numberGHText')[0].innerHTML += ' Done!';
            break;
        }
		$('.btn-next-page')[0].children[0].click();
		while(nowpage == $('.btn-numbered-page.active')[0].children[0].innerHTML){
			await sleep(100);
		}
	}
}
async function doTHCal() {
	var amount = 0;
    while(1){
		$('.rowsList').find('.tableRow.default').each(function(index){
            let row_amount = this.children[0].children[2].children[0].children[0].previousSibling.data.replace(',','');
            let row_type = this.children[0].children[0].children[0].firstChild.data;
            if(row_type == '中獎' || row_type == '調整' || row_type == '退款')
                amount += parseInt(row_amount);
            else if(row_type == '投注')
                amount -= parseInt(row_amount);
		});
		$('#numberTHText')[0].innerHTML = amount;
		let nowpage = 0;
        if($('.btn-numbered-page.active')[0]!=undefined)
			nowpage = $('.btn-numbered-page.active')[0].children[0].innerHTML;
		if($('.btn-next-page.disabled')[0]!=undefined || $('.btn-next-page')[0]==undefined){
			$('#numberTHText')[0].innerHTML += ' Done!';
            break;
        }
		$('.btn-next-page')[0].children[0].click();
		while(nowpage == $('.btn-numbered-page.active')[0].children[0].innerHTML){
			await sleep(100);
		}
	}
}
function sevendays(){
    document.getElementsByClassName('whitePlCl dropdown')[0].getElementsByClassName('dropdown-menu')[0].getElementsByTagName('li')[3].click()
    document.getElementsByClassName('button orange showBtn')[0].click()
}
function gamehistory (zEvent) {
    var newlink = 'https://member.sportslottery.com.tw/zt/view/game-history'
    window.location.href = newlink
}
function transactionhistory(zEvent){
    var newlink = 'https://member.sportslottery.com.tw/zt/view/financial-history'
    window.location.href = newlink
}
function toggle_detail() {
	let open = 0;
	let close = 0;
    $('.button.toggleDetailsButton').each(function(){
		if($(this).css('transform')=='none')
			close += 1
		else if($(this).css('transform')!='none')
			open += 1
	})
	if(close >= open){
		$('.button.toggleDetailsButton').each(function(){
			if($(this).css('transform')=='none')
				this.click()
		})
	}
	else{
		$('.button.toggleDetailsButton').each(function(){
			if($(this).css('transform')!='none')
				this.click()
		})
	}

}

async function findgame(){
    var no = $('#findNoInput')[0].value
    if(no.length < 3)
        return
    $('#findNoInput')[0].value = ''
    if(window.location.href != 'https://member.sportslottery.com.tw/zt'){
        if($('.default.genericLink').length==0 || $('.default.genericLink')[1].textContent !='賽事表'){
            alert('這裡不能用')
            return
        }
        $('.default.genericLink')[1].click()
    }
    while($('.lastMinutesHeader .sportSelect').length == 0)
        await sleep(30)
    for(let sport of $('.lastMinutesHeader .sportSelect')[0].children){
        sport.click()
        while(sport.className !='selected')
            await sleep(30)
        for(let game of $('.lastMinuteBetsContainer.flexible_item .common.eventRow')){
            if(no == $(game).find('.eventCode')[0].textContent.replace('賽事編號','')){
                $(game).find('.default.genericLink')[0].click()
                return
            }
        }
    }
    alert('查無此編號')
}

function confirmcheck(zEvent){
    if(this.checked) {
        $('#targetAmountInput')[0].disabled = 'disabled';
        $('#targetAmountInput')[0].style.background = 'gray';
        $('#targetOddInput')[0].disabled = 'disabled';
        $('#targetOddInput')[0].style.background = 'gray';
        $('#autoBuyButton')[0].disabled = '';
      } else {
        $('#targetAmountInput')[0].disabled = '';
        $('#targetAmountInput')[0].style.background = '';
        $('#targetOddInput')[0].disabled = '';
        $('#targetOddInput')[0].style.background = '';
        $('#autoBuyButton')[0].disabled = 'disabled';
      }
}

async function autobuy(){
    $('#autoBuyButton')[0].disabled = 'disabled';
    var odddom = $('.betslipEventContainer .odd span')
    var now_odd = parseFloat(odddom[0].textContent)
    var target_odd = parseFloat($('#targetOddInput')[0].value)
    var amount = parseInt($('#targetAmountInput')[0].value)
    var theButton = $('.mainArea .betslipSummary .button')[0]
    if(target_odd==NaN)
        target_odd = 1.00
    if(amount==NaN)
        amount=-1
    while($('#confirmCheck')[0].checked){
        while(now_odd >= target_odd && (amount > 0 || amount <= -1)){
            while(theButton.className.includes('disabled')){}
            while(theButton.textContent != '確認金額無誤馬上投注'){
                if(theButton.textContent == '重新整理')
                    theButton.click()
            }
            now_odd = parseFloat(odddom[0].textContent)
            if(now_odd >= target_odd && theButton.textContent == '確認金額無誤馬上投注'){
                theButton.click()
            }
            await sleep(1000)
            while(theButton.className.includes('disabled'))
                while(theButton.textContent != '保留選項'){
                    await sleep(1000)
                }
            if(theButton.textContent == '保留選項'){
                theButton.click()
                amount -= 1
            }
            await sleep((Math.random()+1)*1000)
        }
        await sleep(1500)
    }
    $('#autoBuyButton')[0].disabled = '';
}

function showbetlist(){
    for(let bet of $('.betslipEventContainer')){
        var lineNode = document.createElement('p')
        var liststr = ''
        if($('#printNoCheck')[0].checked)
            liststr += $(bet).find('.taiwanDate')[0].textContent.split(',')[0].split(':')[1] + ' '
        var game_datetime = $(bet).find('.info-time')[0].getAttribute('datetime').replace('T',' ').replace(':00+08:00','').slice(5) + ' '
        if($('#printDateCheck')[0].checked)
            liststr += game_datetime.split(' ')[0].replace('-','/') + ' '
        if($('#printTimeCheck')[0].checked)
            liststr += game_datetime.split(' ')[1] + ' '
        var vs=$(bet).find('.eventName')[0].textContent.trim();
        const regexpVS = /(?<a>.*)\((?<ap>.*)\) @ (?<h>.*)\((?<hp>.*)\)/;
        const matchVS = regexpVS.exec(vs);
        if(matchVS != null){
            var awayname = matchVS.groups.a
            var awayPname = matchVS.groups.ap
            var homename = matchVS.groups.h
            var homePname = matchVS.groups.hp
        }
        if($('#printVsCheck')[0].checked){
            if(vs.includes('(')){
                if($('#printVsPCheck')[0].checked)
                    liststr += matchVS.groups.a + '(' +  matchVS.groups.ap + ') @ ' + matchVS.groups.h + '(' +  matchVS.groups.hp + ')' + ' '
                else
                    liststr += matchVS.groups.a + ' @ ' + matchVS.groups.h + ' '
            }
            else
                liststr += vs + ' '
        }
        if($('#printOptionCheck')[0].checked)
            liststr += $(bet).find('.marketName')[0].textContent + ' '
        var selectname = $(bet).find('.selection')[0].textContent
        if($('#printSelectCheck')[0].checked){
            if(vs.includes('(') && (selectname.includes(awayPname) || selectname.includes(homePname)) && !$('#printVsPCheck')[0].checked){
                selectname = selectname.replace(awayname+'('+awayPname+')',awayname).replace(homename+'('+homePname+')',homename)
            }
            liststr += selectname + ' '
        }
        if($('#printOddCheck')[0].checked)
            liststr += $(bet).find('.odd')[0].textContent
        lineNode.innerHTML = liststr
        $('#listcontent')[0].appendChild(lineNode)
    }
}
function copyToClipBoard(zEvent) {
    if($('#listcontent p')[0] != undefined){
        var content = '';
        for(let bet of $('#listcontent p')){
            content += $(bet)[0].textContent + '\r\n\r\n'
        }
        content = content.trim() + '\r\n'
        navigator.clipboard.writeText(content)
        .then(() => {
            $('#copyListButton')[0].innerHTML = 'Copied!'
        })
            .catch(err => {
            alert('無法複製...')
        })
    }
    else if($('#listcontent table')[0] != undefined){
        var urlField = document.querySelector('#listcontent table');
        var range = document.createRange();
        range.selectNode(urlField);
        window.getSelection().addRange(range);
        document.execCommand('copy');
        $('#copyListButton')[0].innerHTML = 'Copied!'
    }
}

async function showbought(){

    var gameL = {}
    while(1){
        $('.button.toggleDetailsButton').each(function(){
            if($(this).css('transform')=='none')
                this.click()
            })
        await sleep(500);
        for(let bet of $('.ui-widget-content.ui-datatable-even')){
            var gameNo = $(bet).find('.t2')[0].textContent
            if(!(gameNo in gameL)){
                gameL[gameNo] = {}
                gameL[gameNo]['t2'] = gameNo
                gameL[gameNo]['t1'] = $(bet).find('.t1')[0].textContent
                gameL[gameNo]['t3'] = $(bet).find('.t3')[0].textContent.replace('-','@').replace('	B','')
                gameL[gameNo]['op'] = {}
            }
            var gameOp = $(bet).find('.t4')[0].textContent
            if(!(gameOp in gameL[gameNo]['op']))
                gameL[gameNo]['op'][gameOp] = {}
            var gameSl = $(bet).find('.t5')[0].textContent
            if(!(gameSl in gameL[gameNo]['op'][gameOp]))
                gameL[gameNo]['op'][gameOp][gameSl] = []
            var gameOd = $(bet).find('.t7')[0].textContent
            if(!(gameL[gameNo]['op'][gameOp][gameSl].includes(gameOd)))
                gameL[gameNo]['op'][gameOp][gameSl].push(gameOd)
        }
        let nowpage = 0;
        if($('.btn-numbered-page.active')[0]!=undefined)
            nowpage = $('.btn-numbered-page.active')[0].children[0].innerHTML;
        if($('.btn-next-page.disabled')[0]!=undefined || $('.btn-next-page')[0]==undefined){
            break;
        }
        $('.btn-next-page')[0].children[0].click();
        while(nowpage == $('.btn-numbered-page.active')[0].children[0].innerHTML){
            await sleep(100);
        }
    }

    console.log(gameL)
    var str = ''
    var table = document.createElement('table')
    table.setAttribute("style","border: 1px solid black;border-collapse: collapse;")
    $('#listcontent')[0].appendChild(table)
    var table_header = document.createElement('thead')
    table.appendChild(table_header)
    table_header.innerHTML = '<tr><td class="mytd">賽事</td><td class="mytd">玩法</td><td class="mytd">投注內容</td><td class="mytd">賠率</td></tr>'
    var table_body = document.createElement('tbody')
    table.appendChild(table_body)
    for (let game of Object.keys(gameL)){
        var table_row = document.createElement('tr')
        table_body.appendChild(table_row)
        var table_d1 = document.createElement('td')
        table_row.appendChild(table_d1)
        table_d1.setAttribute("class","mytd")
        var d1_rowspan = 0
        for (let sec of Object.keys(gameL[game])){
            if(typeof(gameL[game][sec]) == 'object'){
                for(let op of Object.keys(gameL[game][sec])){
                    var table_d2 = document.createElement('td')
                    if(d1_rowspan >=1){
                        table_row = document.createElement('tr')
                        table_body.appendChild(table_row)
                    }
                    table_row.appendChild(table_d2)
                    table_d2.setAttribute("class","mytd")
                    var d2_rowspan = 0
                    str += '\r\n\t' + op
                    table_d2.textContent += op
                    for(let sl of Object.keys(gameL[game][sec][op])){
                        var table_d3 = document.createElement('td')
                        if(d2_rowspan >=1){
                            table_row = document.createElement('tr')
                            table_body.appendChild(table_row)
                        }
                        table_row.appendChild(table_d3)
                        table_d3.setAttribute("class","mytd")
                        str += '\r\n\t\t' + sl
                        table_d3.textContent += sl
                        var table_d4 = document.createElement('td')
                        table_row.appendChild(table_d4)
                        table_d4.setAttribute("class","mytd")
                        for(let od of gameL[game][sec][op][sl]){
                            str += '\t' + od
                            table_d4.textContent += od + ','
                        }
                        table_d4.textContent = table_d4.textContent.slice(0,-1)
                        d1_rowspan += 1
                        d2_rowspan += 1
                    }
                    table_d2.setAttribute("rowspan",d2_rowspan)
                }
            }
            else
                table_d1.textContent += gameL[game][sec] + ' '
        }
        table_d1.setAttribute("rowspan",d1_rowspan)
    }
}

GM_addStyle ( `
.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
}


.modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 60%;
}


.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.mytd{
    white-space:pre-wrap;
    word-wrap:break-word;
    border: 1px solid black;
    border-collapse: collapse;
}
` );


