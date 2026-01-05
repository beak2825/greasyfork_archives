// ==UserScript==
// @name     Flashscore Better Score
// @namespace  Flashscore
// @version    0.6
// @include http://www.flashscore.com/*
// @include http://www.flashscore.de/*
// @description Adds score evaluation, view TotalScore, AH1,AH2 (+ 1H and 1P) at matchdetails and can show soccer game stats on mygames tab.
// @author quelltextwerk@gmail.com
// @license Creative Commons (by-nc-sa); http://creativecommons.org/licenses/by-sa/4.0/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17280/Flashscore%20Better%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/17280/Flashscore%20Better%20Score.meta.js
// ==/UserScript==

//Show Stats on Mygames Tab
var showSoccerStats = true;
//How many Stats Rows show
var soccerStatsCount = 3;
//Stats Row Width
var srw = 75;


//browser compatible
if(!String.prototype.startsWith){
    String.prototype.startsWith = function (str) {
        return !this.indexOf(str);
    }
}

if(!String.prototype.endsWith){
    String.prototype.endsWith = function (s) {
        return this.indexOf(s, this.length - s.length) !== -1;
    }
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

if (typeof String.prototype.translate !== 'function') {
    String.prototype.translate = function (o) {
        return this.replace(/{([^{}]*)}/g, function (a, b) {
            var r = o[b];
            return typeof r === 'string' ? r : a;
        });
    };
}

var SRefD = '<select id="SRef"><option value="AH1">AH1</option><option value="AH2">AH2</option><option value="TotalScore">TotalScore</option><option value="Team1Score">Team1Score</option><option value="Team1Score">Team2Score</option><option value="1H_AH1">1H_AH1</option><option value="1H_AH2">1H_AH2</option><option value="1H_TotalScore">1H_TotalScore</option><option value="1P_AH1">1P_AH1</option><option value="1P_AH2">1P_AH2</option><option value="1P_TotalScore">1P_TotalScore</option>';
var SOPD  = '</select> OP:<select ID="SOP"><option value="LT">&#60</option><option value="GT">&#62</option><option value="LE">&#8804</option><option value="GE">&#8805</option><option value="EQ">&#8801</option><option value="NE">&#8800</option>';
var COMPD = '</select> COMP:<input type="number" id="SCOMP" value="0" step="0.5">';
var SelDef = SRefD + SOPD + COMPD;

var OStatsFT = '<option>FT - {a}</option><option>FT - {b}</option><option>FT - {c}</option><option>FT - {d}</option><option>FT - {e}</option><option>FT - {f}</option><option>FT - {g}</option><option>FT - {h}</option><option>FT - {i}</option><option>FT - {j}</option><option>FT - {k}</option><option>FT - {l}</option><option>FT - {m}</option>';
var OStats1H = '<option>1H - {a}</option><option>1H - {b}</option><option>1H - {c}</option><option>1H - {d}</option><option>1H - {e}</option><option>1H - {f}</option><option>1H - {g}</option><option>1H - {h}</option><option>1H - {i}</option><option>1H - {j}</option><option>1H - {k}</option><option>1H - {l}</option><option>1H - {m}</option>';
var OStats2H = '<option>2H - {a}</option><option>2H - {b}</option><option>2H - {c}</option><option>2H - {d}</option><option>2H - {e}</option><option>2H - {f}</option><option>2H - {g}</option><option>2H - {h}</option><option>2H - {i}</option><option>2H - {j}</option><option>2H - {k}</option><option>2H - {l}</option><option>2H - {m}</option>';
var OStatsDef = OStatsFT + OStats1H + OStats2H;


var translateCOM = {a:'Ball Possession',b:'Goal Attempts',c:'Shots on Goal',d:'Shots off Goal',e:'Blocked Shots',f:'Free Kicks',g:'Corner Kicks',h:'Offsides',i:'Throw-in',j:'Goalkeeper Saves',k:'Red Cards',l:'Yellow Cards',m:'Fouls'};
var translateDE  = {a:'Ballbesitz',b:'Torversuche',c:'Schüsse aufs Tor',d:'Schüsse neben das Tor',e:'Blocked Shots',f:'Freistöße',g:'Eckbälle',h:'Abseits',i:'Einwürfe',j:'Gehaltene Bälle',k:'Rote Karten',l:'Gelbe Karten',m:'Fouls'};

if(document.domain.endsWith('.de')){
  console.log('Translate to German');
  var OStats = OStatsDef.translate(translateDE);  
} else {
  console.log('Translate to English');
  var OStats = OStatsDef.translate(translateCOM);
}


if (!showSoccerStats) {
    soccerStatsCount = 0;
}

function MyCompareScore(SRef, SCOMP, SOP, T1, T2) {
    var A;
    var B;
    var R;

    T1 = parseInt(T1);
    T2 = parseInt(T2);

    if (SRef.endsWith('TotalScore') ){
        A = T1 + T2;
    } else if (SRef.endsWith('AH1') ){
        A = T2 - T1;
    } else if (SRef.endsWith('AH2')  ){
        A = T1 - T2;
    } else if (SRef.endsWith('Team1Score') ){
        A = T1;
    } else if (SRef.endsWith('Team2Score') ){
        A = T2;
    }

    B = parseFloat(SCOMP);
	
	C = isInt(B);
	

    if (SOP == 'GT') {
        if(C && B == A) return 2;
		return A > B;
    } else if (SOP == 'LT') {
	    if(C && B == A) return 2;
        return A < B;
    } else if (SOP == 'GE') {
        return A >= B;
    } else if (SOP == 'LE') {
        return A <= B;
    } else if (SOP == 'EQ') {
        return A == B;
    } else if (SOP == 'NE') {
        return A != B;
    }

    return 0;
}

function MyOperationText(SOP) {
    if (SOP == 'GT') {
        return '>';
    } else if (SOP == 'LT') {
        return '<';
    } else if (SOP == 'GE') {
        return '>=';
    } else if (SOP == 'LE') {
        return '<=';
    } else if (SOP == 'EQ') {
        return '==';
    } else if (SOP == 'NE') {
        return '!=';
    }

    return null;
}

function MyFlashscore() {


    //Get Saved
    if (localStorage.getItem('BetterScoreSel') === null) {
        LSSel = [];
    } else {
        LSSel = JSON.parse(localStorage['BetterScoreSel']);
    }

    //--------------------------------------------------------------------------------------------------------------
    // match-summary
    //--------------------------------------------------------------------------------------------------------------
    var uri;
    var re = /.*\/match\/(.*)\/#/;
    if ((uri = re.exec(window.location.href)) !== null) {

        //More Score Top
        if ($('.current-result > .r > .sum').length) {
            T1 = parseInt($('.current-result > .r > span:eq(0)').text());
            T2 = parseInt($('.current-result > .r > span:eq(2)').text());
            sum = T1 + T2;
            diff = T2 - T1;
            if (!isNaN(sum)) {
                $('.current-result > .r > .sum').text(sum + ' | AH1 ' + diff);
            }
        } else {
            if ($('.current-result > .r').length) {
                $('.current-result > .r').append('<div class="sum"></div>');
                MyFlashscore();
            } else {
                if ($('.current-result > .sum').length) {
                    T1 = parseInt($('.current-result > span:eq(0)').text());
                    T2 = parseInt($('.current-result > span:eq(2)').text());
                    sum = T1 + T2;
                    diff = T2 - T1;
                    if (!isNaN(sum)) {
                        $('.current-result > .sum').text(sum + ' | AH1 ' + diff);
                    }
                } else {
                    $('.current-result').append('<div class="sum"></div>');
                    MyFlashscore();
                }
            }
        }

        //Basketball Quarters sum
        if ($('#parts> tbody > tr.odd:first > td').length == 7 && $('#parts> tbody > tr').length <= 3) {
            $('#parts> tbody').append('<tr class="odd"><td></td><td class="Sum"></td><td class="score 1Q"></td><td class="score 2Q"></td><td class="score 3Q"></td><td class="score 4Q"></td></tr>');

            $sum = parseInt($('#parts> tbody > tr:eq(1) >td:eq(1)').text()) + parseInt($('#parts> tbody > tr:eq(2) >td:eq(1)').text());
            $sum1Q = parseInt($('#parts> tbody > tr:eq(1) >td:eq(2)').text()) + parseInt($('#parts> tbody > tr:eq(2) >td:eq(2)').text());
            $sum2Q = parseInt($('#parts> tbody > tr:eq(1) >td:eq(3)').text()) + parseInt($('#parts> tbody > tr:eq(2) >td:eq(3)').text());
            $sum3Q = parseInt($('#parts> tbody > tr:eq(1) >td:eq(4)').text()) + parseInt($('#parts> tbody > tr:eq(2) >td:eq(4)').text());
            $sum4Q = parseInt($('#parts> tbody > tr:eq(1) >td:eq(5)').text()) + parseInt($('#parts> tbody > tr:eq(2) >td:eq(5)').text());

            if (!isNaN($sum)) {
                $('#parts> tbody > tr >td.Sum').text($sum);
            }
            if (!isNaN($sum1Q)) {
                $('#parts> tbody > tr >td.1Q').text($sum1Q);
            }
            if (!isNaN($sum2Q)) {
                $('#parts> tbody > tr >td.2Q').text($sum2Q);
            }
            if (!isNaN($sum3Q)) {
                $('#parts> tbody > tr >td.3Q').text($sum3Q);
            }
            if (!isNaN($sum4Q)) {
                $('#parts> tbody > tr >td.4Q').text($sum4Q);
            }
        }

        // Add comparison options
        if ($('th.header > div').length == 1) {
            $('th.header').append('<div> - Ref:' + SelDef + '</div>');
        }

        //Check have saved data	and first load	
        var i;
        var m;
        if (match_summary_first) {
            for (i = 0; i < LSSel.length; i++) {
                if (LSSel[i]['ID'] == uri[1]) {
                    $("#SRef").val(LSSel[i]['SRef']);
                    $("#SCOMP").val(LSSel[i]['SCOMP']);
                    $("#SOP").val(LSSel[i]['SOP']);
                    break;
                }
            }
            match_summary_first = false;
        }
        // Check comparison options
        if ($("#SCOMP").val() && !isNaN(sum)) {
            var CT1;
			var CT2;
			
			if( $("#SRef option:selected").val().startsWith('1H_') ){
				if( $('body.basketball').length > 0){
					CT1 = parseInt($('.p1_home').text())+ parseInt($('.p2_home').text());
					CT2 = parseInt($('.p1_away').text())+ parseInt($('.p2_away').text());
				} else {
					CT1 = $('.p1_home').text();
					CT2 = $('.p1_away').text();				
				}				
			} else if( $("#SRef option:selected").val().startsWith('1P_') ){
				CT1 = $('.p1_home').text();
				CT2 = $('.p1_away').text();
			} else {
				CT1 = T1;
				CT2 = T2;
			}
			
			var R = MyCompareScore($("#SRef option:selected").val(), $("#SCOMP").val(), $("#SOP option:selected").val(), CT1, CT2);
            console.log($("#SRef option:selected").val(), $("#SCOMP").val(), $("#SOP option:selected").val(), R, CT1, CT2);
            
			if (R == 1) {
				$('#flashscore_column').css("background-color", "#9f9");						
			}
			else if (R == 2) {
				$('#flashscore_column').css("background-color", "#ff9");
			}
			else {
				$('#flashscore_column').css("background-color", "#f99");
			}

            // add title icons
            /*             var link = document.createElement('link');
                        link.rel = 'shortcut icon';
                        if (R) {
                            link.href = 'http://files.softicons.com/download/application-icons/32x32-free-design-icons-by-aha-soft/ico/Ok.ico';
                        } else {
                            link.href = 'http://files.softicons.com/download/toolbar-icons/max-mini-icons-by-ashung/ico/error.ico ';
                        }
                        document.getElementsByTagName('head')[0].appendChild(link); */
        }
    }

    //--------------------------------------------------------------------------------------------------------------
    // My-Games
    //--------------------------------------------------------------------------------------------------------------
    if ($('li.ifmenu-custom.selected').length === 1) {
        //console.log('My-Games');

        if ($('div.MySRef').length === 0) {
            $('.table-line-bottom:first').after('<div class="MySRef"><label>Ref:</label>' + SelDef + '</div>');
        }
        if ($('td.MyRefer').length === 0) {
            $skipnext = false;

            $('.table-main > table > tbody >tr:not([class="blank-line"]) ').each(function() {
                if ($skipnext) {
                    $skipnext = false;
                    return true;
                }


                var FO = null;
                var i;
                for (i = 0; i < LSSel.length; i++) {
                    if ($(this).attr('id').endsWith(LSSel[i]['ID'])) {
                        FO = LSSel[i];
                        break;
                    }
                }
                //console.log(FO);



                if ($(this).parents('table').attr('class') == 'basketball') {
                    if (!!FO) {
                        $(this).append('<td rowspan="2" class="MyRefer" style="nowrap;width: 100px;" sref="' + FO['SRef'] + '" sop="' + FO['SOP'] + '" scomp="' + FO['SCOMP'] + '">' + FO['SRef'] + ' ' + MyOperationText(FO['SOP']) + ' ' + FO['SCOMP'] + '</td>');
                    } else {
                        $(this).append('<td rowspan="2" class="MyRefer" style="nowrap;width: 100px;" >Choose your bet below the table and click here</td>');
                    }
                    $skipnext = true;
                } else {
                    var statshtml = '';

                    if ($(this).parents('table').attr('class') == 'soccer' && showSoccerStats) {
                        for (i = 0; i < soccerStatsCount; i++) {
                            statshtml += '<td id="MyS' + i + '_' + $(this).attr('id').substr(4) + '" style="nowrap;"></td>';
                        }
                    }

                    if (!!FO) {
                        $(this).append('<td class="MyRefer" style="nowrap;width: 100px;" sref="' + FO['SRef'] + '" sop="' + FO['SOP'] + '" scomp="' + FO['SCOMP'] + '">' + FO['SRef'] + ' ' + MyOperationText(FO['SOP']) + ' ' + FO['SCOMP'] + '</td>' + statshtml);
                    } else {
                        $(this).append('<td class="MyRefer" style="nowrap;width: 100px;">Choose your bet below the table and click here</td>' + statshtml);
                    }
                }


            });

			$('.head_ab').each(function() {				
				$(this).parent().append('<td></td>');
				
				if ($(this).parents('table').attr('class') == 'soccer' && showSoccerStats) {					
					for (i = 0; i < soccerStatsCount; i++) {
						$(this).parent().append('<td style="nowrap;width: ' + srw + 'px;"><select style="width:' + srw + 'px" class="SStats' + i + '">' + OStats + '</select></td>');
					}
				}
			
			});			
			
            //Kosmetik	
			 $('.table-main > table > tbody >tr.blank-line > td ').each(function() {
				$(this).attr('colspan', $(this).attr('colspan') + 1);
			 });	
			
			   $('.stats-link').css({'position':'relative','float':'right'});
            if (MyGamesRunOne) {				
				var addwidth = 100 + soccerStatsCount * srw;
                $('div.container > .content').width($('div.container > .content').width() + addwidth);
                $('#fsbody').width($('#fsbody').width() + addwidth);
                MyGamesRunOne = false;
            }




            // Save Changes from Select/Options
            $('.MyRefer').on('click', function(e) {
                e.stopPropagation();
                //console.log($(this));                

                var SRef = $("#SRef option:selected").val();
                var SOP = $("#SOP option:selected").val();
                var SCOMP = $("#SCOMP").val();
                var reb = /.+_.+_(.*)/;
                var m = reb.exec($(this).parent().attr('id'));
                var ID = m[1];
                MakeSave(ID);

                //Set Attr ad Displaytext
                $(this).attr('SRef', SRef);
                $(this).attr('SOP', SOP);
                $(this).attr('SCOMP', parseFloat(SCOMP));
                $(this).text(SRef + ' ' + MyOperationText(SOP) + ' ' + SCOMP);
            });
            $('.MyRefer').on('mouseover', function(e) {
                e.stopPropagation();
            });
        }

        $('td.MyRefer').each(function() {
            if ($(this).is('[SRef]')) {
                var T1, T2;
                var re = '';

                
				if( $(this).attr('SRef').startsWith('1H_') ){
					re = /\((\d+).-.(\d+)\)/;
					if ((m = re.exec($($(this).parent()).find('.cell_sb').text())) !== null) {
						T1 = m[1];
						T2 = m[2];
					} else {
						if ($(this).parents('table').attr('class') == 'basketball') {
							T1 = parseInt($($(this).parent()).find('.cell_sd').text()) + parseInt($($(this).parent()).find('.cell_se').text());
							T2 = parseInt($($(this).parent()).next().find('.cell_tb').text()) + parseInt($($(this).parent()).next().find('.cell_tc').text());
						} else {
							T1 = $($(this).parent()).find('.cell_sd').text();
							T2 = $($(this).parent()).next().find('.cell_tb').text();
						}
					}
				}				
				else if( $(this).attr('SRef').startsWith('1P_') ){
						T1 = $($(this).parent()).find('.cell_sd').text();
						T2 = $($(this).parent()).next().find('.cell_tb').text();				
				}
				else {
					re = /(\d+).-.(\d+)/;
					if ((m = re.exec($($(this).parent()).find('.score').text())) !== null) {
						T1 = m[1];
						T2 = m[2];
					} else if ($($(this).parent()).find('.score-home').text() !== '') {
						T1 = $($(this).parent()).find('.score-home').text();
						T2 = $($(this).parent()).next().find('.score-away').text();
					}
				}
				
				

				

                if (!isNaN(parseInt(T1))) {
                    var R = MyCompareScore($(this).attr('SRef'), parseFloat($(this).attr('SCOMP')), $(this).attr('SOP'), T1, T2);                    
					//console.log($(this).attr('SRef'), $(this).attr('SCOMP'), $(this).attr('SOP'),R,T1,T2);
                    if (R == 1) {
                        $(this).css("background-color", "#9f9");						
                    }
					else if (R == 2) {
                        $(this).css("background-color", "#ff9");
                    }
					else {
                        $(this).css("background-color", "#f99");
                    }
                }
            }
        });
    }
}




function MyFlashscoreStats() {
    if ($('li.ifmenu-custom.selected').length === 1) {
        $('.table-main > table.soccer').each(function() {
            var i;
            var k;
            var action = {};
            var c = 0;
            $(this).find("select option:selected").each(function() {
                action['MyS' + c] = $(this).text();
                c++;
            });

            $(this).find('tr[id]').each(function() {
                action['gid'] = $(this).attr('id').substr(4);
                if(document.domain.endsWith('.de')){					
					var url = 'http://d.flashscore.de/x/feed/d_st_' + action['gid'] + '_de_1';
				} else {					
					var url = 'http://d.flashscore.com/x/feed/d_st_' + action['gid'] + '_en_1';
                }     
				
				var x = cjs.feedRequest._createAjaxJqObject(
					url,				
					function(status, header, data, json) {
                        var respond = $('<html />').html(data);
                        //console.log( respond ); 
                        //console.log( 'json:'+json );
                        var opt = JSON.parse(json);

                        //Get all Stats
                        var stats = [];
                        for (i = 0; i < 3; i++) {
                            stats[i] = [];
                            respond.find('#tab-statistics-' + i + '-statistic tr').each(function() {
                                var tds = $(this).find('td');
                                if (tds.length == 3) {
                                    var v = [];
                                    for (k = 0; k < 3; k++) {
                                        v[k] = $(tds[k]).text();
                                    }
                                    stats[i].push(v);
                                }
                            });
                        }
                        //console.log(stats);

                        for (i = 0; i < soccerStatsCount; i++) {
                            var m = 0;
                            var n = opt['MyS' + i].split(" - ");
                            if (n[0] == 'FT') {
                                m = 0;
                            } else if (n[0] == '1H') {
                                m = 1;
                            } else if (n[0] == '2H') {
                                m = 2;
                            }

                            for (k = 0; k < stats[m].length; k++) {
                                if (stats[m][k][1] == n[1]) {
                                    $('#MyS' + i + '_' + opt['gid']).text(stats[m][k][0] + ' : ' + stats[m][k][2]);
                                    break;
                                }
                            }
                        }
                    }, JSON.stringify(action)
                );
                x.update();

            });
        });
    }
    setTimeout(function() {
        MyFlashscoreStats();
    }, 10000);
}




function MakeSave(ID) {
    //Get Saved
    if (localStorage.getItem('BetterScoreSel') === null) {
        LSSel = [];
    } else {
        LSSel = JSON.parse(localStorage['BetterScoreSel']);
    }

    var SRef = $("#SRef option:selected").val();
    var SOP = $("#SOP option:selected").val();
    var SCOMP = $("#SCOMP").val();
    var TS = new Date().getTime();

    //Remove old timestamps (5 Days)
    for (var i = 0; i < LSSel.length; i++) {
        if ((LSSel[i]['TS'] + 432000000) <= TS) {
            LSSel.splice(i, 1);
        }
    }
    //Remove old values
    for (i = 0; i < LSSel.length; i++) {
        if (LSSel[i]['ID'] == ID) {
            LSSel.splice(i, 1);
            break;
        }
    }

    //Add new values and saved
    LSSel.push({
        SRef: SRef,
        SOP: SOP,
        SCOMP: SCOMP,
        TS: TS,
        ID: ID
    });
    localStorage.setItem('BetterScoreSel', JSON.stringify(LSSel));
}


var match_summary_first = true;
var MyGamesRunOne = true;
var sum = 0;
var diff = 0;
var T1 = 0;
var T2 = 0;

$('th.header').change(function() {
    var uri;
    var re = /.*\/match\/(.*)\/#/;
    if ((uri = re.exec(window.location.href)) !== null) {
        MakeSave(uri[1]);
    }
    MyFlashscore();
});

$(document).ready(function() {
    setInterval(function() {
        MyFlashscore();
    }, 1000);
    if (showSoccerStats) {
        setTimeout(function() {
            MyFlashscoreStats();
        }, 2000);
    }
});
