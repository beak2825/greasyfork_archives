// ==UserScript==
// @name         TM Transfer Profit Calculator
// @description  Based on TM_Enhanced_Transfer_List by andrizz
// @version      1.6
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       中美两开花
// @include      https://trophymanager.com/transfer/*
// @include      https://static.trophymanager.com/transfer/*
// @grant        all
// @license      MIT
// @namespace https://greasyfork.org/users/15590
// @downloadURL https://update.greasyfork.org/scripts/491856/TM%20Transfer%20Profit%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/491856/TM%20Transfer%20Profit%20Calculator.meta.js
// ==/UserScript==

unsafeWindow.jQuery(document).ajaxComplete(function(event, pippo, settings)
{
    rebindClicks();

    if (settings.url === "/ajax/transfer.ajax.php")
    {
        moreInfos();
    }
});

function rebindClicks()
{
    $.each($('#pages').find('span'), function(index, span)
    {
        var clickAntigo = $(span).attr('onclick');
		$(span).removeAttr('onclick');
        $(span).off('click');
        $(span).on('click', function()
                   {
                       eval(clickAntigo);
                       moreInfos();
                       rebindClicks();
                   });
	});
}

function moreInfos()
{
    $(".asi2 .routine").remove();
    $("th.align_center").after("<th class='asi2' title='ASI e TI after the training' style='width: 30px; cursor: pointer;''><nobr>ASI 2 (TI)</nobr></th>");
    $("th.asi2").after("<th class='profit0' title='Profit after 6 weeks or until end of age (normalized to 6 weeks)' style='width:20px; cursor: pointer;''><nobr>P0/PT</nobr></th>");
    $("th.profit0").after("<th class='profit1' title='Profit after one additional year of blooming (normalized to 6 weeks)' style='width:20px; cursor: pointer;''><nobr>P1</nobr></th>");
    // $("th.right").after("<th class='ROI' title='Return over Investment' style='wideth: 20px; cursor: pointer;''>ROI</th>");
    $("tr.header").append("<th class='routine' title='Routine' style='width: 30px; cursor: pointer;''>Rou</th>");
    $("th.align_center").remove();
    var params = "";
	$("div.player_name > a").each(function(e, player)
    {
		params = "player_id="+$(player).attr("player_link"); //player_id=2014919etc..

		var pippo = new XMLHttpRequest();
		pippo.open("POST", "https://trophymanager.com/ajax/tooltip.ajax.php", true);
		pippo.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		pippo.onreadystatechange = function()
		{
			if (pippo.readyState == 4)
			{
				var risultato = JSON.parse(pippo.responseText);

                var id = risultato.player.player_id
                var testoAsi = $("tr#player_row_" + id + " td.align_center.align_right").text();
                var asiInt = testoAsi.replace (/,/g , "");
                var asi2Int = risultato.player.skill_index.replace (/,/g , "");

                var ruolo = $("tr#player_row_" + id + " span.favposition.short.nowrap").text();
                var isGK = (ruolo == "GK");
                if  (isGK) {
                    var sk1 =  Math.pow(asiInt * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1/7)/14*11;
                    var sk2 = Math.pow(asi2Int * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1/7)/14*11;
                } else {
                    var sk1 = Math.pow(asiInt * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1/7);
                    var sk2 = Math.pow(asi2Int * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1/7);
                }
                var TI = Math.round((sk2 - sk1)*10);
                var col = ""
                if (TI > 9) {
                    col = 'gold';
                } else if (TI > 0) {
                    col = 'khaki';
                } else if (TI == 0) {
                    col = 'silver';
                } else {
                    col = 'chocolate';
                }

                var mon = Number(risultato.player.months);
                var year = Number(risultato.player.age);
                var blooming = false;
                var xtraMon = 0;
                if (mon < 5.1 && TI > 5.9) { // age month = 0, 1, 2, 3, 4, 5; TI at least 6
                    blooming = true;
                    xtraMon = 5 - mon;
                }

                var myTrainFacility = 10;//训练等级
                var trainEffect = 1 - (10 - myTrainFacility) * 0.05

                var newsk = 0;
                var newsi = 0;
                var newsk1 = 0;
                var newsi1 = 0;

                if (TI < 5.1) { // not in any blooming
                    newsk = sk2 + TI*6/10; // keep old TI
                    newsk1 = newsk; // not used
                } else if (blooming) { // TI at least 6, and month <= 5
                    newsk = sk2 + Math.floor(trainEffect*TI)*(11-mon)/10; // TI adjusted by training facility level, calculated until end of age
                    newsk1 = sk2 + Math.floor(trainEffect*TI)*(23-mon)*0.9/10; // additional 12 months
                    if (year < 19) { // TI includes youth physical growth, deduct from next year
                        newsk1 = newsk1 - Math.ceil(0.3*TI)*12/10; // 0.3: percentage of physical TI under 19, may change this value
                    }
                } else { // TI at least 6, but month >= 6
                    newsk = sk2 + (Math.floor(trainEffect*TI) * (11-mon) + 5 * (mon-5))/10; // First part adjusted TI, then assume TI drops to 5 for rest months
                    newsk1 = newsk; // not used
                }
                if (isGK) {
                    newsi = Math.pow(newsk / 11 * 14, 7) /(Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7));
                    newsi1 = Math.pow(newsk1 / 11 * 14, 7) /(Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7));
                } else {
                    newsi = Math.pow(newsk, 7)/(Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7));
                    newsi1 = Math.pow(newsk1, 7)/(Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7));
                }
                var wage = risultato.player.wage.replace(/<\/?span[^>]*>/g,"").replace (/,/g , "");
                var age = year + mon/12;
                var bankprice = CalcBankPrice((age+0.5+(xtraMon/12)), newsi, isGK);
                var bankprice1 = CalcBankPrice((age+1.5+(xtraMon/12)), newsi1, isGK);
                var cost = $("td.bid_" + id).closest("td")[0].innerText.replace (/,/g , "");
                var Revenue = Math.round(bankprice*0.94) - ((7+xtraMon) * Number(wage));
                var Revenue1 = Math.round(bankprice1*0.94) - ((19+xtraMon) * Number(wage));
                var P0 = (Revenue - cost)*(6/(6+xtraMon))/1000000;
                var P1 = (Revenue1 - cost)*(6/(18+xtraMon))/1000000;
                var ROI = Math.round((Revenue/Math.ceil(Number(cost)*1.025) - 1) * 1000)/10;
                var col2 = "";
                var col3 = "";
                var threshold = 5000000 // threshold for high price players and low price players
                if (Revenue > threshold) { // ROI coloring, Revenue > 5M
                    if (ROI > 49.99) {
                        col2 = 'yellow';
                    } else if (ROI > 29.99) {
                        col2 = 'gold';
                    } else if (ROI > 9.99) {
                        col2 = 'khaki';
                    } else if (ROI > 0) {
                        col2 = 'darkkhaki';
                    } else {
                        col2 = 'chocolate';
                    }
                } else { // ROI coloring, Revenue <= 5M)
                    if (ROI > 29.99) {
                        col2 = 'seaShell';
                    } else if (ROI > 0) {
                        col2 = 'silver';
                    } else {
                        col2 = 'chocolate';
                    }
                }

                $("tr#player_row_" + id + " td.left + td.align_center").closest("td").append("."+risultato.player.months);
                $("a[player_link=" + id + "]").closest("tr").append("<td class='right align_right routine' style='padding-right:5px;'><span>" + risultato.player.routine + "</span></td>");
                $("td[id=time_" + id + "]").before("<td class='right align_center asi2' style='padding-right:1px;color:" + col + ";'><span>&nbsp;" + risultato.player.skill_index + " (<b>" +TI+"</b>)</span></td>");
                if (blooming) {
                    $("td[id=time_" + id + "]").before("<td class='right align_right profit' style='padding-right:2px;color:" + profitColor(P0) + ";'><span><i>" + revenueBold1(bankprice, P0) + P0.toFixed(2)+ "M" + revenueBold2(bankprice, P0) + "</i></span></td>");
                    $("td[id=time_" + id + "]").before("<td class='right align_right profit' style='padding-right:2px;color:" + profitColor(P1) + ";'><span><i>" + revenueBold1(bankprice1, P1) + P1.toFixed(2)+ "M" + revenueBold2(bankprice1, P0) + "</i></span></td>");
                } else {
                    $("td[id=time_" + id + "]").before("<td class='right align_right profit' style='padding-right:2px;color:" + profitColor(P0) + ";'><span>" + revenueBold1(bankprice, P0) + P0.toFixed(2)+ "M" + revenueBold2(bankprice, P0) + "</span></td>");
                    $("td[id=time_" + id + "]").before("<td class='right align_right profit' style='padding-right:2px;'><span>" + '--' + "</span></td>");
                }
                //if (ROI > 0) {
                    // $("tr#player_row_" + id + " td.bid_" + id).closest("td").after("<td class='right align_center ROI' style='padding-left:5px;color:" + col2 + ";'><span><b>" + ROI + "</b></span></td>");
                //} else {
                    // $("tr#player_row_" + id + " td.bid_" + id).closest("td").after("<td class='right align_center ROI' style='padding-left:5px;color:" + col2 + ";'><span>" + ROI + "</span></td>");
                //}
                $("tr#player_row_" + id + " td.align_center.align_right").remove();
            }
         }
		pippo.send(params);
    });
  }

function CalcBankPrice(age, si, isgk) {
    var Result = Infinity;
    var ageD = 25 / age;
    Result = Math.floor(si * 500 * Math.pow(ageD, 2.5));
    if (isgk) {
        Result = Math.floor(Result * 0.75);
    }
    return Result;
  }

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function profitColor(profit) {
    var outCol = '';
    if (profit > 10) {
        outCol = 'gold';
    } else if (profit > 6) {
        outCol = 'khaki';
    } else if (profit > 4) {
        outCol = 'beige';
    } else if (profit > 2) {
        outCol = 'darkkhaki';
    } else if (profit > 0) {
        outCol = 'silver';
    } else {
        outCol = 'chocolate';
    }
    return outCol;
}

function profitBold1(profit) {
    var outB = '';
    if (profit > 6) {
        outB = '<b>';
    }
    return outB;
}

function profitBold2(profit) {
    var outB = '';
    if (profit > 6) {
        outB = '</b>';
    }
    return outB;
}

function revenueBold1(bank, profit) {
    var outB = '';
    if (bank > 25000000 && profit > 6) {
        outB = '<b>';
    }
    return outB;
}

function revenueBold2(bank, profit) {
    var outB = '';
    if (bank > 25000000 && profit > 6) {
        outB = '</b>';
    }
    return outB;
}