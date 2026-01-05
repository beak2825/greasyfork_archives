// ==UserScript==
// @author      ZSMTurker
// @name        ZSMTurker's Combo Script
// @namespace   https://greasyfork.org/users/2291
// @description Combination script for common HITs
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       http://www.mturk.com/*
// @match       https://www.mturk.com/*
// @match       https://www.mturkcontent.com/dynamic/hit*
// @match       https://turkexperiment.com/*
// @match       https://snapsaves.com/web/*
// @match       https://s3.amazonaws.com/mylikes_serve/*
// @match       https://s3.amazonaws.com/mturk_bulk/hits/*
// @match       https://turk.cognifics.com/*
// @match       https://ni14.crowdcomputingsystems.com/mturk-web/*
// @match       http://util.homezoollc.com/data/image/*
// @match       https://work.crowdsource.com/amt/*
// @match       http://vms-blur.message.ch/*
// @match       https://www.deyde.com/*
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/2884/ZSMTurker%27s%20Combo%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/2884/ZSMTurker%27s%20Combo%20Script.meta.js
// ==/UserScript==

var requesterName = $( 'tr:contains(Requester:)' ).last().children().first().next().text().trim();

var piotrCount, benCount, homeZooCount, homeZooHist;
$( document ).ready( function() {
if ( requesterName == 'Prospect Smarter' ) 
{
    $('iframe').attr('style', 'height: 800px;');
}
if ( requesterName == 'Procore Development' )
{
    window.scrollBy(0,1000);
}
if ( requesterName == 'Futurecom Uwe Gartmann' )
{
    var externalLink = $('a:contains("Link to external site")');
    //checkFuturecom(externalLink);
}	

function checkFuturecom($link)
{
    GM_xmlhttpRequest(
    {
        method: "GET",
        url: $link.attr('href'),
        onerror: function(){alert('failed');},
        onload: function (response)
        {
            var $src = $(response.responseText);
            var alreadyDone = $src.find('#counterLabel').text();
            if ( !alreadyDone )
            {
            $link.css('text-decoration', 'line-through');
            $('img[src="/images/skip_hit.gif"]').eq(0).click();
            } else {
            $('input[src="/images/accept_hit.gif"]').eq(0).click();
            }
        }
    });
}

$('iframe').focus();  

var checkMyLikes = $( document ).find( 'button:contains("Mature Image")' ).text();
var checkCognifics = $( document ).find( 'div:contains("Cognifics - Content Rating")' ).text();
var checkTwoLakesResearch = $( document ).find( 'div b:contains("Does this post mention")' ).text();
var checkProspectSmarter = $( document ).find( 'p:contains("Some other examples! Please note this does not mean ONLY say yes")' ).text();
var checkTaskRabbitTurk = $( document ).find( 'div:contains("Choose a category for this Task:")').text();
var checkCrowdAnalytics = $( document ).find( 'p:contains("Please review the below ad to assess if the ad is free of clutter and provides a simple, understandable message.")').text();
var checkSETMasterAccount = $( document ).find( 'a[href="http://www.set.tv/"]').text();
var checkBenPeterson = $( document ).find( 'h3:contains("Judging from the photo, do you feel this person is...")').text();
var checkHomeZoo = $( document ).find( 'li:contains("Seating areas outside are "External", not living.")').text();
var checkNPDRD = $( document ).find( '#school').text();
var checkCSQuestionCategory = $( document ).find( 'h1:contains("Choose Category for a Provided Question")').text();
console.log(location.hostname);
if ( requesterName == 'Venue Quality' ) {
    window.scrollBy(0,1000);
    document.addEventListener( "keydown", elVenueQuality, false );
} else if ( requesterName == 'SDG Production' ) {
    document.addEventListener( "keydown", elSDGProduction, false );
} else if ( requesterName == 'John Russell' ) {
    window.scrollBy(0,1000);
    document.addEventListener( "keydown", elJohnRussell, false );
} else if ( checkTwoLakesResearch ) {
    //window.scrollBy(0,1000);
    document.addEventListener( "keydown", elTwoLakesResearch, false );
} else if ( checkProspectSmarter ) {
    document.addEventListener( "keydown", elProspectSmarter, false );
} else if ( checkTaskRabbitTurk ) {
    document.addEventListener( "keydown", elTaskRabbitTurk, false );
} else if ( checkCrowdAnalytics ) {
    window.scrollBy(0,1000);
    document.addEventListener( "keydown", elCrowdAnalytics, false );
} else if ( checkSETMasterAccount ) {
    window.scrollBy(0,1000);
    document.addEventListener( "keydown", elSETMasterAccount, false );
} else if ( checkHomeZoo ) {
    homeZooCount = 1;
    homeZooHist = [];
    //window.scrollBy(0,1000);
    document.addEventListener( "keydown", elHomeZoo, false );
} else if ( checkNPDRD ) {
    document.addEventListener( "keydown", elNPDRD, false );
} else if ( checkBenPeterson ) {
    benCount = 1;
    window.scrollBy(0,1000);
    document.addEventListener( "keydown", elBenPeterson, false );
} else if ( $('#counterLabel:contains("Image")').text() ) {
    document.addEventListener( "keydown", elFuturecom, false );
} else if ( checkMyLikes ) {
    window.scrollBy(0,1000);
    document.addEventListener( "keydown", elMyLikes, false );
} else if ( checkCognifics ) {
    window.scrollBy(0,1000);
    document.addEventListener( "keydown", elCognifics, false );
} else if ( checkCSQuestionCategory ) {
    document.addEventListener( "keydown", elCSQuestionCategory, false );
} else if ( location.hostname == 'www.deyde.com' ) {
    $( 'button[name="cancel"]' ).eq( 0 ).css('float','right');
    $( 'button[name="check"]' ).eq( 0 ).css('float', 'left');
    piotrCount = 1;
    $('#priceCluster-1').click();
    $('#offerCluster-1').click();
    document.addEventListener( "keydown", elPiotr, false );
}else {
    document.addEventListener( "keydown", elNoScript, false );
}

function elNoScript( i ) {
    if ( i.keyCode == 191 && i.shiftKey ) { //? Key - Shows Keys
        alert("Sorry, no script detected for this page.\n\nAsk ZSMTurker on MTG if you would like one."); 
    }
}

function elPiotr( i ) {
    if ( i.keyCode == 49 ) { //1
        $( 'button[name="check"]' ).eq( 0 ).css('background-color', '#ffffff');
        $( 'button[name="check"]' ).eq( 0 ).click();
    }
    if ( i.keyCode == 50 ) { //2
        $( 'button[name="cancel"]' ).eq( 0 ).css('background-color', '#ffffff');
        $( 'button[name="cancel"]' ).eq( 0 ).click();
    }
    if ( i.keyCode == 81 ) { //Q
        $( 'input[name="offerCluster"]' ).eq( piotrCount ).click();
    }
    if ( i.keyCode == 87 ) { //W
        piotrCount++;
        $( 'input[name="priceCluster"]' ).eq( piotrCount ).click();
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //? Key - Shows Keys
        alert('1 - Approve \n 2 - Reject');
    }
}
 
function elVenueQuality( i ) {
    if ( i.keyCode == 49 ) { //1
        $( 'input[name="Answer_1"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'input[name="/submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 50 ) { //2
        $( 'input[name="Answer_1"]' ).eq( 1 ).click();
        setTimeout( function() {
            $( 'input[name="/submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //?
        alert( "1 Key: Select 'Yes'\n2 Key: Select 'No'\n\nHIT will automatically submit after selection is made." );
    }
}

function elSDGProduction ( i ) {
    if ( i.keyCode == 49 ) { //1
        var tempLink = $( 'body form div div div p a' ).text();
        window.open(tempLink, '_blank');
    }
    if ( i.keyCode == 50 ) { //2
        setTimeout( function() {
            $( 'input[name="/submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //?
        alert( "SDG PRODUCTION INSTRUCTIONS\n1 Key: Open Link\n2 Key: Submit" );
    }
}

function elJohnRussell( i ) {
    if ( i.keyCode == 49 ) { //1
        $( 'input[name="Answer_1"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'input[name="/submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 50 ) { //2
        $( 'input[name="Answer_1"]' ).eq( 1 ).click();
        setTimeout( function() {
            $( 'input[name="/submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //?
        alert( "1 Key: Select 'Yes'\n2 Key: Select 'No'\n\nHIT will automatically submit after selection is made." );
    }
}

function elCrowdAnalytics( i ) {
    if ( i.keyCode == 49 ) { //1
        $( 'input[value="0"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'input[value="Submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 50 ) { //2
        $( 'input[value="5"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'input[value="Submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 51 ) { //3
        $( 'input[value="3"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'input[value="Submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 52 ) { //4
        $( 'input[value="1"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'input[value="Submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //?
        alert( "1 Key: Select 'Yes'\n2 Key: Select 'No'\n\nHIT will automatically submit after selection is made." );
    }
}

function elSETMasterAccount( i ) {
    if ( i.keyCode == 49 ) { //1
        $( 'input[value="0"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'input[value="Submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 50 ) { //2
        $( 'input[value="5"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'input[value="Submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 51 ) { //3
        $( 'input[value="3"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'input[value="Submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 52 ) { //4
        $( 'input[value="1"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'input[value="Submit"]' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //?
        alert( "1 Key: Select 'Yes'\n2 Key: Select 'No'\n\nHIT will automatically submit after selection is made." );
    }
}

function elHomeZoo( i ) {
    var homeZooLabels = $( document ).find('.category-option' );
    for ( var n = 0; n < homeZooLabels.length; n++) {
        homeZooLabels.eq( n ).css('background-color','#FFFFFF');
    }
    console.log(homeZooLabels.length);
    if ( i.keyCode == 49 ) { //1
        $( 'label:contains("Bathroom")' ).css('background-color','#7ACC7A');
        setTimeout( function() {
            $( 'label:contains("Bathroom")' ).click();
            $( 'label:contains("Bathroom")' ).css('background-color','#DDDDDD');
        }, 200 );
        homeZooHist[homeZooCount] = 1;
        homeZooCount++;
    }
    if ( i.keyCode == 50 ) { //2
        $( 'label:contains("Bedroom")' ).css('background-color','#7ACC7A');
        setTimeout( function() {
            $( 'label:contains("Bedroom")' ).click();
            $( 'label:contains("Bedroom")' ).css('background-color','#DDDDDD');
        }, 200 );
        homeZooHist[homeZooCount] = 2;
        homeZooCount++;
    }
    if ( i.keyCode == 51 ) { //3
        $( 'label:contains("Dining")' ).css('background-color','#7ACC7A');
        setTimeout( function() {
            $( 'label:contains("Dining")' ).click();
            $( 'label:contains("Dining")' ).css('background-color','#DDDDDD');
        }, 200 );
        homeZooHist[homeZooCount] = 3;
        homeZooCount++;
    }
    if ( i.keyCode == 52 ) { //4
       $( 'label:contains("Exterior")' ).css('background-color','#7ACC7A');
        setTimeout( function() {
            $( 'label:contains("Exterior")' ).click();
            $( 'label:contains("Exterior")' ).css('background-color','#DDDDDD');
        }, 200 );
        homeZooHist[homeZooCount] = 4;
        homeZooCount++;
    }
    if ( i.keyCode == 53 ) { //5
       $( 'label:contains("Kitchen")' ).css('background-color','#7ACC7A');
        setTimeout( function() {
            $( 'label:contains("Kitchen")' ).click();
            $( 'label:contains("Kitchen")' ).css('background-color','#DDDDDD');
        }, 200 );
        homeZooHist[homeZooCount] = 5;
        homeZooCount++;
    }
    if ( i.keyCode == 54 ) { //6
       $( 'label:contains("Living")' ).css('background-color','#7ACC7A');
        setTimeout( function() {
            $( 'label:contains("Living")' ).click();
            $( 'label:contains("Living")' ).css('background-color','#DDDDDD');
        }, 200 );
        homeZooHist[homeZooCount] = 6;
        homeZooCount++;
    }
    if ( i.keyCode == 55 ) { //7
       $( 'label:contains("Other")' ).css('background-color','#7ACC7A');
        setTimeout( function() {
            $( 'label:contains("Other")' ).click();
            $( 'label:contains("Other")' ).css('background-color','#DDDDDD');
        }, 200 );
        homeZooHist[homeZooCount] = 7;
        homeZooCount++;
    }
    if ( i.keyCode == 81 ) { //q
        if ( homeZooCount > 1 ) {
            homeZooCount--;
            $( '#previous' ).click();
            homeZooLabels.eq( homeZooHist[homeZooCount] - 1 ).css('background-color','#7ACC7A');
        } else {
            homeZooLabels.eq( homeZooHist[1] - 1 ).css('background-color','#7ACC7A');
        }
    }
    if ( i.keyCode == 87 ) { //w
        if ( homeZooHist[homeZooCount] ) {
            homeZooCount++;
            $( '#next' ).click();
            homeZooLabels.eq( homeZooHist[homeZooCount] - 1 ).css('background-color','#7ACC7A');
        }
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //?
        alert( "HOMEZOO LLC INSTRUCTIONS\n1 Key: Select 'Bathroom'\n2 Key: Select 'Bedroom'\n3 Key: Select 'Dining'\n4 Key: Select 'Exterior'\n5 Key: Select 'Kitchen'\n6 Key: Select 'Living'\n7 Key: Select 'Other'\nQ Key: Select 'Previous'\nW Key: Select 'Next'\n\nHIT will automatically submit after last selection is made." );
    }
}

function elNPDRD( i ) {
    if ( i.keyCode == 49 ) { //1
        var temp1 = $( '#school' ).text();
        var temp2 = ' supply list'
        var temp3 = $( '#county' ).text();
        window.open('https://www.google.com/search?q='+temp1 + ' ' + temp3, '_blank');//+temp2
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //?
        alert( "1 Key: Search for school supply list \n\nUse in conjunction with AHK." );
    }
}

function elBenPeterson( i ) {
    console.log('Detected Ben Peterson KeyDown');
    if ( benCount == 1 ) {
        benCount++;
        if ( i.keyCode == 49 ) { //1
            $( '#competent1' ).click();
        }
        if ( i.keyCode == 50 ) { //2
            $( '#competent2' ).click();
        }
        if ( i.keyCode == 51 ) { //3
            $( '#competent3' ).click();
        }
        if ( i.keyCode == 52 ) { //4
            $( '#competent4' ).click();
        }
        if ( i.keyCode == 53 ) { //5
            $( '#competent5' ).click();
        }
        if ( i.keyCode == 32 ) { //Space
            $( '#competent0' ).click();
        }
        if ( i.keyCode == 81 ) { //q
            $( '#competent-1' ).click();
        }
        if ( i.keyCode == 87 ) { //w
            $( '#competent-2' ).click();
        }
        if ( i.keyCode == 69 ) { //e
            $( '#competent-3' ).click();
        }
        if ( i.keyCode == 82 ) { //r
            $( '#competent-4' ).click();
        }
        if ( i.keyCode == 84 ) { //t
            $( '#competent-5' ).click();
        }
    } else if ( benCount == 2 ) {
        benCount++;
        if ( i.keyCode == 49 ) { //1
            $( '#likable1' ).click();
        }
        if ( i.keyCode == 50 ) { //2
            $( '#likable2' ).click();
        }
        if ( i.keyCode == 51 ) { //3
            $( '#likable3' ).click();
        }
        if ( i.keyCode == 52 ) { //4
            $( '#likable4' ).click();
        }
        if ( i.keyCode == 53 ) { //5
            $( '#likable5' ).click();
        }
        if ( i.keyCode == 32 ) { //Space
            $( '#likable0' ).click();
        }
        if ( i.keyCode == 81 ) { //q
            $( '#likable-1' ).click();
        }
        if ( i.keyCode == 87 ) { //w
            $( '#likable-2' ).click();
        }
        if ( i.keyCode == 69 ) { //e
            $( '#likable-3' ).click();
        }
        if ( i.keyCode == 82 ) { //r
            $( '#likable-4' ).click();
        }
        if ( i.keyCode == 84 ) { //t
            $( '#likable-5' ).click();
        }
    } else if ( benCount == 3 ) {
        benCount = 1;
        if ( i.keyCode == 49 ) { //1
            $( '#influential1' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
        if ( i.keyCode == 50 ) { //2
            $( '#influential2' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
        if ( i.keyCode == 51 ) { //3
            $( '#influential3' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
        if ( i.keyCode == 52 ) { //4
            $( '#influential4' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
        if ( i.keyCode == 53 ) { //5
            $( '#influential5' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
        if ( i.keyCode == 32 ) { //Space
            $( '#influential0' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
        if ( i.keyCode == 81 ) { //q
            $( '#influential-1' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
        if ( i.keyCode == 87 ) { //w
            $( '#influential-2' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
        if ( i.keyCode == 69 ) { //e
            $( '#influential-3' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
        if ( i.keyCode == 82 ) { //r
            $( '#influential-4' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
        if ( i.keyCode == 84 ) { //t
            $( '#influential-5' ).click();
            setTimeout( function() {
                $( '#submitButton' ).eq( 0 ).click();
            }, 100 );
        }
    }
}

function elFuturecom ( i ) {
    if ( i.keyCode == 49 ) { //1
        $( '#btnPrev' ).click();
    }
    if ( i.keyCode == 50 ) { //2
        $( '#btnNext' ).click();
    }
    if ( i.keyCode == 81 ) { //Q
        $( '#ellipseType' ).click();
    }
    if ( i.keyCode == 87 ) { //W
        $( '#rectangleType' ).click();
    }
}

function elTwoLakesResearch( i ) {
    if ( i.keyCode == 49 ) { //1
        $( 'input[value="yes"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'a:contains("Submit Answers")' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 50 ) { //2
        $( 'input[value="no"]' ).eq( 0 ).click();
        setTimeout( function() {
            $( 'a:contains("Submit Answers")' ).eq( 0 ).click();
        }, 100 );
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //?
        alert( "1 Key: Select 'Yes'\n2 Key: Select 'No'\n\nHIT will automatically submit after selection is made." );
    }
}

function elProspectSmarter( i ) {
    if ( i.keyCode == 49 ) { //1 Key - Good
        $('#image option:contains("Good")').prop({selected: true});
        setTimeout( function() {
            document.getElementById("mturk_form").submit();
        }, 100 );
    }    
    if ( i.keyCode == 50 ) { //2 Key - Bad
        $('#image option:contains("Bad")').prop({selected: true});
        setTimeout( function() {
            document.getElementById("mturk_form").submit();
        }, 100 );
    }
    if ( i.keyCode == 51 ) { //3 Key - Cannot Determine
        $('#image option:contains("Cannot Determine")').prop({selected: true});
        setTimeout( function() {
            document.getElementById("mturk_form").submit();
        }, 100 );
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //? Key - Shows Keys
        alert("1 Key - Good\n2 Key - Bad\n3 Key - Cannot Determine\n\n Auto-Submits"); 
    }
}

function elTaskRabbitTurk( i ) {
    if ( i.keyCode == 49 ) { //1 Key - Good
        $('input[name="category_id"]').eq( 0 ).click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 100 );
    }    
    if ( i.keyCode == 50 ) { //2 Key - Bad
        $('input[name="category_id"]').eq( 1 ).click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 100 );
    }
    if ( i.keyCode == 51 ) { //3 Key - Cannot Determine
        $('input[name="category_id"]').eq( 2 ).click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 100 );
    }
    if ( i.keyCode == 52 ) { //4 Key - Cannot Determine
        $('input[name="category_id"]').eq( 3 ).click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 100 );
    }
    if ( i.keyCode == 53 ) { //5 Key - Cannot Determine
        $('input[name="category_id"]').eq( 4 ).click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 100 );
    }
    if ( i.keyCode == 54 ) { //6 Key - Cannot Determine
        $('input[name="category_id"]').eq( 5 ).click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 100 );
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //? Key - Shows Keys
        alert("1-6: Select category 1-6\nSelects Left to Right, Top to Bottom\n1-2-3\n4-5-6\n\n Auto-Submits"); 
    }
}

function elMyLikes( i ) {
    if ( i.keyCode == 49 ) { //1 - Mature
        $('#submit_mature').css('background-color','#FAFAFA');
        setTimeout( function() {
            $('#submit_mature').click();
        }, 500 );
    } else if ( i.keyCode == 50 ) { //2 - Safe
        $('#submit_safe').css('background-color','#FAFAFA');
        setTimeout( function() {
            $('#submit_safe').eq(0).click();
        }, 500 );    
    } else if ( i.keyCode == 191 && i.shiftKey ) { //? Key - Shows Keys
        alert("1 Key: Select 'Mature Image'\n2 Key: Select 'Safe Image'\n\nHIT will automatically submit after selection is made."); 
    }
}

function elCognifics( i ) {
    if ( i.keyCode == 70 ) { //F - Female
        $('#gender_0_female').click();
    } else if ( i.keyCode == 77 ) { //M - Male
        $('#gender_0_male').click();
    } else if ( i.keyCode == 66 ) { //B - Both
        $('#gender_0_both').click();
    } else if ( i.keyCode == 67 ) { //C - Can't tell
        $('#gender_0_cant_tell_gender').click();
    } else if ( i.keyCode == 78 ) { //N - Not human
        $('#gender_0_not_human').click();
    } else if ( i.keyCode == 49 ) { //1 - Tame
        $('#rating_0_tame').click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 500 );
    } else if ( i.keyCode == 50 ) { //2 - Sexy
        $('#rating_0_sexy').click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 500 );
    } else if ( i.keyCode == 51 ) { //3 - Censored
        $('#rating_0_censored_nudity').click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 500 );
    } else if ( i.keyCode == 52 ) { //4 - Topless
        $('#rating_0_female_topless_nudity').click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 500 );
    } else if ( i.keyCode == 53 ) { //5 - Buttocks
        $('#rating_0_buttocks_nudity').click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 500 );
    } else if ( i.keyCode == 54 ) { //6 - Frontal
        $('#rating_0_below_waist_frontal_nudity').click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 500 );
    } else if ( i.keyCode == 55 ) { //7 - Insertion
        $('#rating_0_below_waist_insertion').click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 500 );
    } else if ( i.keyCode == 56 ) { //8 - Inappropriate
        $('#rating_0_inappropriate').click();
        setTimeout( function() {
            $( 'input.submit_button' )[0].click();
        }, 500 );
    } else if ( i.keyCode == 191 && i.shiftKey ) { //? Key - Shows Keys
        alert("1 Key: Select 'Mature Image'\n2 Key: Select 'Safe Image'\n\nHIT will automatically submit after selection is made."); 
    }
}

function elCSQuestionCategory( i ) {
    if ( i.keyCode == 49 ) { //1 - Mature
        $('#submitButton').click();
    } else if ( i.keyCode == 191 && i.shiftKey ) { //? Key - Shows Keys
        alert("1 Key: Submit"); 
    }
}
}) ;
