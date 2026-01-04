// ==UserScript==
// @name         Staker Roulette Tweaks v2
// @namespace    stakerroulettetweaks
// @version      0.2
// @description  visuell improvements / autocharting
// @author       stimpy
// @match        https://stake.com/games/roulette
// @match        *://stake.com/games/roulette/*
// @match        https://stake.com/games
// @match        https://stake.com/games/roulette*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant		GM_xmlhttpRequest
// @grant		GM_info
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle


function l(u, i) {
    var d = document;
    if (!d.getElementById(i)) {
        var s = d.createElement('script');
        s.src = u;
        s.id = i;
        d.body.appendChild(s);
    }
}

l('//code.jquery.com/jquery-3.2.1.min.js', 'jquery');
// @downloadURL https://update.greasyfork.org/scripts/36376/Staker%20Roulette%20Tweaks%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/36376/Staker%20Roulette%20Tweaks%20v2.meta.js
// ==/UserScript==
//////JQuery Compatibility statement//////
this.$ = this.jQuery = jQuery.noConflict(true);
//////JQuery Compatibility statement//////


var htmlstring =  "<div class='nwrapper' width='100%'><div class='info' id='infopanel' width='100%' style='font-size: 10px;'><div id='wrpHistory'></div><div id='balance'></div>[ spin: <span id='ninfo'>0</span> ( <span id='glbspncnt'>0</span> ) ] [ prft: <span id='myprofit'></span> ] [ maxblnc: <span id='maxbalance'></span> ]</div><div class='nrow' id='myrow0' width = '100%'><div class='labelz' id='label0'>0x | <span id='l0cnt'>37</span></div><div class='numbas' loosecount='0' cooldown='0' id='mynumba0'>0</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba1'>1</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba2'>2</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba3'>3</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba4'>4</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba5'>5</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba6'>6</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba7'>7</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba8'>8</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba9'>9</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba10'>10</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba11'>11</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba12'>12</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba13'>13</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba14'>14</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba15'>15</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba16'>16</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba17'>17</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba18'>18</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba19'>19</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba20'>20</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba21'>21</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba22'>22</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba23'>23</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba24'>24</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba25'>25</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba26'>26</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba27'>27</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba28'>28</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba29'>29</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba30'>30</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba31'>31</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba32'>32</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba33'>33</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba34'>34</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba35'>35</div><div class='numbas' loosecount='0' cooldown='0' id='mynumba36'>36</div></div><div class='nrow' id='myrow1' width = '100%'><div class='labelz' id='label1'>1x | <span id='l1cnt'>0</span></div></div><div class='nrow' id='myrow2' width = '100%'><div class='labelz' id='label2'>2x | <span id='l2cnt'>0</span></div></div><div class='nrow' id='myrow3' width = '100%'><div class='labelz' id='label3'>3x | <span id='l3cnt'>0</span></div></div><div class='nrow' id='myrow4' width = '100%'><div class='labelz' id='label4'>4x | <span id='l4cnt'>0</span></div></div><div class='nrow' id='myrow5' width = '100%'><div class='labelz' id='label5'>5x | <span id='l5cnt'>0</span></div></div><div class='nrow' id='myrow6' width = '100%'><div class='labelz' id='label6'>6x | <span id='l6cnt'>0</span></div></div><div class='nrow' id='myrow7' width = '100%'><div class='labelz' id='label7'>7x | <span id='l7cnt'>0</span></div></div><div class='nrow' id='myrow8' width = '100%'><div class='labelz' id='label8'>8x | <span id='l8cnt'>0</span></div></div><div class='nrow' id='myrow9' width = '100%'><div class='labelz' id='label9'>9x | <span id='l9cnt'>0</span></div></div><div class='nrow' id='myrow10' width = '100%'><div class='labelz' id='label10'>10x | <span id='l10cnt'>0</span></div></div></div>";
var stylestring = "<style type='text/css'> .mylex{ display: flex; flex-direction: column; } .info { font-family: proxima-nova, sans-serif; font-size: 14px !important; } .hidethere { display: none !important; } .nwrapper { width: 100%; display: inline-block; align-items: center; justify-content: center }  .numbas { padding: 1px; margin: 1px; border: true; border-style: solid; border-width: 1px; height: 12px; width: 14px; background: #F7F7FA; display: inline-block; font-family: proxima-nova, sans-serif; font-size: 8px; text-align: center; } #myrow0 { opacity: 0.5; } .labelz { opacity: 0.5; padding: 1px; margin: 1px; border: true; border-style: solid; border-width: 1px; height: 12px; width: 32px; background: #F7F7FA; display: inline-block; font-family: proxima-nova, sans-serif; font-size: 8px; text-align: center; } </style>";
var spinCount = 0;
var globalSpinCount = 0;
var spinCountSave = 0;
var autom = true;
var autoCount = 0;
var startbalance = 0;
var oldrowNumber = 0;
var maxhitcount = 0;
var clearflag = false;
var loosecount = 0;
var ticker = 0;
var oldProfit = 0;
var maxProfit = 0;
var oldBalance = 0;
var maxBalance = 0;
var oldwager = 0;
var doBet = false;
var actualPrft = 0;
var numberarray = [];
var firsthit = false;
var letsreset = false;
var letsrollBack = false;
var actuallyrolled = "";
var actuallyrolledInt = 0;
var actualBlnce = 0;
var expRpt = 0;
var expHit = 0;
var expRpt_old = 0;
var expHit_old = 0;
var hitVariance = 0;
var rptVariance = 0;

setTimeout(function(){ startIt(); }, 1000);

function startIt(){
    $( "head" ).append( stylestring );
    $( ".container:first" ).prepend( "<button class= 'labelz' id='initBot'>StakeRltBot</button>" );


    $( "#initBot" ).click( function(){
        $( "div.CanvasWrapper__Wrapper-jZpqcf.SNUQp"  ).attr("id", "mywheel");
        $( "#mywheel"  ).addClass("hidethere" );

        $( "span.Winning__Value-clcYJN.cQYwXv"  ).attr("id", "winningnumba");
        $( "div.Footer__Main-cbYjLO.eGoesP"  ).attr("id", "numbercontainer");
        $( "div.Balance__BalanceWrapper-TyjZM.kYQMZJ"  ).attr("id", "balancewrp");
        $( "#balancewrp" ).appendTo( $( "#infopanel" ) );
        $( "div.styles__StyledFeedSidebar-fuLCcn.cGGHBR"  ).attr("id", "sidebar");
        $( sidebar ).addClass("hidethere" );

        $( "ol.SpinHistory__List-aMykR.cicZIv"  ).attr("id", "history");


        $( "#history" ).css( "display", "-webkit-box" );
        $( "#history" ).css( "font-size", "14px" );
        $( "div.Header__Wrapper-laTQtG.hHyrgc"  ).attr("id", "putContainer");
        $( "#history" ).appendTo( "#putContainer" );
        $( "#putcontainer" ).css( "display", "block !important" );
        $( "#putContainer" ).prepend( htmlstring );

        $( "#putcontainer"  ).addClass("myflex" );
        $( ".nwrapper" ).removeClass( "hidethere" );
        $( "div.custom-scrollbar.styles__AppWrapper-cxIzVO.cIWPOU"  ).attr("id", "scroller");
        $( "#scroller" ).width( "100%" );
        $( "div.Winning__StyledWinning-jjfbQN.aWlVh"  ).attr("id", "winningnumberwrp");
        $( "#winningnumberwrp" ).addClass("hidethere" );
        $( ".container" ).css( "width", "100%" );
        var twb = $("span").filter( function(){ return ($(this).text() == "1 to 18" );} );
        var tmpwagerbtn = twb.parent("div");
        tmpwagerbtn.attr( "id", "tmpwager" );

        $( "#winningnumberwrp" ).appendTo( $( ".nwrapper" ) );


        $( "div.ClearRemove__StyledClearRemove-cEvMBa.dQJddI"  ).attr("id", "clearwrp");
        var clearBtn = $( "#clearwrp" ).children().first();
        clearBtn.attr( "id", "clearbutton" );

        $( "div.Balance__BalanceWrapper-TyjZM.kYQMZJ" ).attr("id", "mybalance");
        var tmpblnce = $( "#mybalance" ).text();
        $( "#mybalance" ).appendTo( $( "#infopanel" ) );
        startbalance = parseFloat(tmpblnce.substring(4, 14));

        $( ".jGHxKO:first-child" ).css( "font-size", "20px" );

        $( "button[data-test='rouletteBet']" ).attr("id", "letsBet");
        $( "#letsBet"  ).click( function(){
            autom = true;
            waitForIt(); });

    });

    $( "#mynumba0" ).click( function(){
        $( "div.Balance__BalanceWrapper-TyjZM.kYQMZJ" ).attr("id", "mybalance");
        var tmpblnce = $( "#mybalance" ).text();
        $( "#mybalance" ).appendTo( $( "#infopanel" ) );
        startbalance = parseFloat(tmpblnce.substring(4, 14));
        $( "#myprofit"  ).text( 0 );
        waitForIt();
    });
    $( "#mynumba1" ).click( function(){
        reset();

    });
}

function waitForIt(){
    var tmpblnce = $( "#mybalance" ).text();
            actualBlnce = parseFloat(tmpblnce.substring(4, 14));

            if( actualBlnce > maxBalance ){
                maxBalance = actualBlnce;
                $( "#maxbalance"  ).text( maxBalance.toFixed(8) );
                if( maxhitcount > 2 ){
                    loosecount = 0;
                    letsreset = true;
                }
            }

            if( oldBalance > actualBlnce && firsthit === true && oldrowNumber < 1 ){
                loosecount++;
            }

            oldprofit = actualPrft;
            actualPrft = actualBlnce - startbalance;

    $( "#myprofit"  ).text( actualPrft.toFixed(8) );


    winningnumba = setInterval( function(){

        var letsbetString = $( "#letsBet"  ).text();
        if( letsbetString != "Spinning..." ){

            spinCount = spinCount + 1;
            globalSpinCount = globalSpinCount + 1;
            $( "#ninfo"  ).text( spinCount );
            $( "#glbspncnt"  ).text( globalSpinCount );

            // get hit number
            actuallyrolled = $( "#winningnumba"  ).text();
            actuallyrolledInt = parseInt(actuallyrolled);
            console.log( "actuallyrolledInt: "+ actuallyrolledInt );

            if( $.inArray( actuallyrolledInt, numberarray ) > -1 ){ loosecount = 0; }

            // get old and new row for hit number
            var lastnumba = $( "#mynumba"+actuallyrolled );
            var oldrow = lastnumba.parent("div");
            var oldrowID = oldrow.attr('id');
            oldrowNumber = parseInt(oldrowID.substring(5));

            if( (oldrowNumber+1) > maxhitcount ){
                maxhitcount = (oldrowNumber+1);
            }

            if( actuallyrolledInt !== 0 ){ $( "#mynumba"+actuallyrolled ).appendTo( $( "#myrow"+( oldrowNumber+1 )));}
            updateRowCount();
            unHitRatio();

            if( rptVariance <= -1 ){
                dobet = true;
            }else{
                dobet = false;
            }




            oldwager = mywager;
            var mywager = parseFloat(letsbetString.substring( 4, 14 ));
            var numberBtn = $("span").filter( function(){ return ( $( this ).text() == actuallyrolled );} );

            clearInterval(winningnumba);
            if( actualBlnce <= 0 ){ autom = false; }

            if( oldBalance < actualBlnce && maxhitcount > 4 ){
                loosecount = 0;
                letsrollBack = true;
            }

            if( spinCount >= 37 ){
                loosecount = 0;
                letsrollBack = true;
            }

            if( letsrollBack === true ){
                rollBack();
            }

            getlastsix();
            checkLC();

            if( numberarray.length < 1 ){
                firsthit = false;
                $( "#clearbutton" ).click();
                $( "#tmpwager" ).click();
            }



            oldBalance = actualBlnce;

            if( autom === true ){
                if( firsthit && numberarray.length > 0 ){
                    if( loosecount < 6 ){
                        if( dobet === true ){

							$( "#clearbutton" ).click();
							for (var r = 0; r < numberarray.length-1; r++) {
								numberBtn = $("span").filter( function(){ return ($(this).text() == numberarray[r] );} );
								//console.log("click: "+numberarray[r] );

								var thisnumba = $( "#mynumba"+numberarray[r] );

								var thisrow = thisnumba.parent("div");
								var thisrowID = thisrow.attr('id');
								var clickcount = parseInt( thisrowID.substring( 5 )) - 2;
								//console.log( "(should get "+clickcount+" clicks)");

								for( var c = 0; c <= clickcount; c++ ){
									numberBtn.next().click();
								}
									//numberBtn.next().click();
							}
                        }else{
							$( "#clearbutton" ).click();
							$( "#tmpwager" ).click();
						}
                    }else{
                        //loosecount = 0;
                        //rollBack();
                        //maxhitcount = maxhitcount - 1;
                        $( "#clearbutton" ).click();
                        $( "#tmpwager" ).click();
                    }
                }
            }
            setTimeout(function(){ $( "#letsBet"  ).click(); },150);
            if( letsreset === true ){
                reset();
            }


        }
     }, 150);
}

function unHitRatio(){
    expRpt_old = expRpt;
    expRpt = ( spinCount * 0.26 ).toFixed(0);
    if( expRpt_old == expRpt ){
        expHit = expHit + 1;
    }
    hitVariance = ( 37 - $( "#myrow0 > div.numbas" ).length ) - expHit;

    var rptcnt = 0;
    for( t = 2; t <= maxhitcount; t++ ){
        rptcnt = rptcnt + $( "#myrow"+t+" > div.numbas" ).length;
    }

    rptVariance = rptcnt - expRpt;
    console.log( "H: "+( 37 - $( "#myrow0 > div.numbas" ).length )+ "/"+expHit+" ("+hitVariance+") - R/expR: "+rptcnt+"/"+ expRpt+" ("+rptVariance+")" );
}

function reset(){
    for(var k = 0; k <= 36; k++) {
        $( "#mynumba"+k ).appendTo( $( "#myrow0" ) );
    }
    spinCount = 0;
    $( "#ninfo"  ).text( spinCount );


    numberarray = [];
    for( v = 0; v <= maxhitcount; v++ ){
        var xcount = $( "#myrow"+v+" > div.numbas" ).length;
        $( "#l"+v+"cnt"  ).text( xcount );
    }

    maxhitcount = 0;
    tmpblnce = $( "#mybalance" ).text();
    actualBlnce = parseFloat(tmpblnce.substring(4, 14));
    startbalance = parseFloat(tmpblnce.substring(4, 14));
    oldprofit = 0;
    actualPrft =0;
    expRpt = 0;
    expHit = 0;
    expRpt_old = 0;
    expHit_old = 0;
    hitVariance = 0;
    rptVariance = 0;
    $( "#myprofit"  ).text( actualPrft.toFixed(8) );
    oldrowNumber = 0;
    firsthit = false;
    $( "#clearbutton" ).click();
    $( "#tmpwager" ).click();

    letsreset = false;


    //setTimeout(function(){ $( "#letsBet"  ).click(); },200);
    //autom = 0;
}

function checkLC(){
    for( var d = 0; d <= 36; d++ ){
        var numLC = parseInt( $( "#mynumba"+d ).attr( "loosecount" ))+1;
        if( actuallyrolledInt !== d ){
            $( "#mynumba"+d ).attr( "loosecount", numLC );
        }else{
            $( "#mynumba"+d ).attr( "loosecount", "0" );
        }
    }
}



function getlastsix(){
    if( maxhitcount >= 2 ){
        numberarray = [];
  //      $( "#clearbutton" ).click();
        for( r = maxhitcount; r >= 1; r-- ){
            var ncount = $( "#myrow"+r+" > div.numbas" ).length;
            //console.log( "#myrow"+r+": "+ ncount);
            if( ncount > 0 ){

				for( nmb = 0; nmb <= (ncount-1); nmb++ ){
					var nstring = $( "#myrow"+r+" > div.numbas:eq( "+nmb+" )" ).text();
					//console.log( nmb+ " number "+nstring );

					var nInt = parseInt( nstring );
					if( $.inArray( nInt, numberarray ) <= -1 && nInt !== 0 ){
                        
                        var numbacnt = parseInt( $( "#mynumba"+nInt ).attr( "loosecount" ));
                        if( numbacnt <= 14 ){
                            numberarray.push( nInt );
                        }
					}
					if( numberarray.length > 5 ){
						break;
					}

				}
            }
            if( r === maxhitcount && $( "#myrow"+r+" > div.numbas" ).length > 1 ){
                break;
            }
            if( numberarray.length > 5 ){
                break;
            }
        }
        if( numberarray === [] ){
            numberarray.push( actuallyrolledInt );
        }

    }
    if( maxhitcount > 1 ){ firsthit = true; }
}

function rollBack(){
    while ( $( "#myrow2 > div.numbas" ).length > 3) {
        for( rw = 1; rw <= maxhitcount; rw++ ){
            var ncnt = $( "#myrow" + rw + " > div.numbas" );
            //console.log( "row " + rw + " has "+ ncnt.length + "numbers" );
            ncnt.appendTo( $( "#myrow" + ( rw-1 )));
        }
    }



    spinCount = $( "#myrow1 > div.numbas" ).length + $( "#myrow2 > div.numbas" ).length;
    $( "#ninfo"  ).text( spinCount );

    tmpblnce = $( "#mybalance" ).text();
    actualBlnce = parseFloat(tmpblnce.substring(4, 14));
    startbalance = parseFloat(tmpblnce.substring(4, 14));
    oldprofit = 0;
    actualPrft = 0;
    hitVariance = 0;
    rptVariance = 0;
    expRpt = 0;
    expHit = 0;
    expRpt_old = 0;
    expHit_old = 0;
    $( "#myprofit"  ).text( actualPrft.toFixed(8) );
    maxhitcount =  1;

    letsrollBack = false;

}

function updateRowCount(){
    for( v = 0; v <= maxhitcount; v++ ){
        $( "#l" + v + "cnt"  ).text( $( "#myrow" + v + " > div.numbas" ).length );
    }
}